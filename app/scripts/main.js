/* global bible, Spinner, planner, saveAs, moment, ics */

'use strict';

// tests
console.groupCollapsed('App tests');
console.log('Running jQuery %s', $().jquery);
console.log(bible);
var ref = bible.parseReference('rom 1:4');
console.log(bible.add(ref, 10).toString());
console.groupEnd();

/**
 * Contants
 */
var READING_PLANS = (window.location.host === 'khornberg.github.io') ? 'http://khornberg.github.io/bible-reading-planner/bower_components/readingplans' : '/bower_components/readingplans';
var FILENAME = 'BibleReadingPlan';
var SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';

/**
 * Helper functions
 */

/**
 * Get skipped days checked
 * @return {array} Array of skipped days
 */
function getSkippedDays () {
    var opts = [];
    $('#skip-checkboxes input:checked').each(function (i, input) {
        opts.push(input.value);
    });
    return opts;
}

/**
 * Gets name from each plan and add to list
 * @param {string} plan Filename of plan to load
 * @todo  github does not allow getting contents of a directory
 */
// function setSequences (sequence) {
//     $.getJSON(READING_PLANS + '/' + sequence)
//     .done(function(json) {
//         var length = (typeof json.data2 === 'undefined') ? json.data.length : json.data2.length;
//         var plan = '<a href="#" class="list-group-item" name="' + sequence + '">' + json.name + '<span class="badge">' + length + ' days</span></a>';
//         $('#sequence').append(plan);

        // select functionality
        $('.list-group-item').click(function () {
            // TODO better way of doing this?          
            $('.list-group-item').each(function () {
                $(this).removeClass('active');
            });

            
            var x = null;
            $('.list-group-item').each(function () {
                // Load text
                planner.sequenceName = $(this).attr('name');
                planner.load();

                $('.panel-heading').text(planner.sequence.name);
                $('.panel-body').html(planner.sequence.info);

                x += $('.panel').html();

            
                console.info(x);
            });

            $(this).addClass('active');

            // Load text
            planner.sequenceName = $('.list-group-item.active').attr('name');
            planner.load();

            $('.panel-heading').text(planner.sequence.name);
            $('.panel-body').html(planner.sequence.info);
        });
//     });
// }

/**
 * Shows error message
 * @param  {string} message Error message
 */
function showError(message) {
    var errorMessage = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>' + message + '</strong></div>';
    $('#wait').hide();
    $('div .alert').remove();
    $('#wait').parent().append(errorMessage);
    document.getElementById('wait').scrollIntoView() ;
}

/**
 * Get data from page elements
 * @return {array} Array of the user data
 */
function getPlannerData () {
    var data = {};

    // sequence name
    data.sequenceName = $('.list-group-item.active').attr('name');
    
    // beginning
    data.begin = $('#calendar-start').datepicker('getDate');

    // end
    data.end = $('#calendar-end').datepicker('getDate');

    // days to skip
    var opts = [];
    $('#skip-checkboxes input:checked').each(function (i, input) {
        opts.push(Number(input.value));
    });

    data.skip = opts;

    // type
    data.type = $('#type :radio:checked').attr('id');

    // amount
    data.amount = (data.type === 'specified') ? $('#amountSpecified :radio:checked').attr('id') : $('#amountNumber').val();

    console.info('Data ' + JSON.stringify(data));
    return data;
}

/**
 * Creates output of plan
 * @param  {object} plan        Bible reading plan
 * @param  {string} destination Type of destination to create output for
 * @return {string}             Formated bible reading plan
 */
function output (plan, destination) {
    switch (destination) {
    case 'pdf':
    case 'text':
    case 'markdown':
    case 'ical':
        console.error('Not implemented yet.');
        break;
    case 'dom':
        var rows = '';
        for (var i = 0; i < plan.length; i++) {
            rows = rows + '<tr><td>' + plan[i].day + '</td><td>';
            for(var n = 0; n < plan[i].refs.length; n++) {
                rows = rows + plan[i].refs[n];
                // rows = rows + plan[i].refs[n].toString();
                
                // don't put a comma after the last element
                if( n < plan[i].refs.length - 1) {
                    rows = rows + ', ';
                }
            }

            rows = rows + '</td></tr>';
        }
        return rows;
    default:
        break;
    }
}

/**
 * UI construct
 */

// Load plans
// $.ajax({
//     url: READING_PLANS,
//     type: 'GET',
// })
// .done(function(data) {
//     var plans = [];

//     $(data).find('a:contains(.json)').each(function() {
//         plans.push($(this).attr('title'));
//     });

//     for (var i = 0; i < plans.length; i++) {
//         setSequences(plans[i]);
//     }
// })
// .fail(function() {
//     console.error('error loading bible reading plan');
//     var plan = '<a href="" class="list-group-item">Error Loading Plans</a>';
//     $('#sequence').append(plan);
// });

// calendars
$('#calendar-start').datepicker({
    'todayHighlight': true,
    'startDate': new Date()
});

$('#calendar-start').datepicker('update', new Date());

$('#calendar-end').datepicker({
    'todayHighlight': true,
    'startDate': new Date()
});

var initEndDate = new Date();
initEndDate.setDate(initEndDate.getDate() + 30);
$('#calendar-end').datepicker('update', initEndDate);

// the end cannot be before the start
$('#calendar-start').change(function() {
    $('#calendar-end').datepicker('setStartDate', $('#calendar-start').datepicker('getDate'));
});

// the start cannot be after the end
$('#calendar-end').change(function() {
    $('#calendar-start').datepicker('setEndDate', $('#calendar-end').datepicker('getDate'));
});

// disable days
$('#skip-checkboxes').change(function () {
    $('#calendar-start').datepicker('setDaysOfWeekDisabled', getSkippedDays());
    $('#calendar-end').datepicker('setDaysOfWeekDisabled', getSkippedDays());
});

// radio buttons
$('#type input[type=radio]').change(function () {
    if ( this.id === 'specified' ) {
        $('#amountNumber').hide();
        $('#amountSpecified').show();
    }
    else {
        $('#amountNumber').show();
        $('#amountSpecified').hide();
    }
});

/**
 * User actions
 */

$('#sequence').click(function (e) {
    e.preventDefault();
});

$('#legal').click(function (e) {
    e.preventDefault();
    $('.legal').show();
});

// create plan
$('#create').click(function() {
    $('#wait').show();
    // Show spinner while waiting
    var opts = {
        lines: 13,
        length: 15,
        width: 5,
        radius: 15,
        corners: 1,
        rotate: 0,
        direction: 1,
        color: '#000',
        speed: 1,
        trail: 40,
        shadow: false,
        hwaccel: false,
        className: 'spinner'
    };
    var wait = document.getElementById('wait');
    var spinner;
    // don't add another spiner if one exists
    if (!wait.firstElementChild) {
        spinner = new Spinner(opts).spin(wait);
    }

    try {
        $('.alert').remove();
        
        var data = getPlannerData();
        planner.set(data);
        planner.create();
        var rows = output(planner.plan, 'dom');

        spinner.stop();
        $('#wait').hide();

        if (rows) {
            $('tbody').children().remove();
        }
        $('tbody').append(rows);
        $('.plan').addClass('fade');

        document.getElementById('plan').scrollIntoView();
    }
    catch(err) {
        console.error(err);
        spinner.stop();
        showError(err);
    }
});

// download as text
$('#downloadText').click(function(event) {
    event.preventDefault();
    var text = '';
    $('tbody tr').each(function( index, el ) {
        text += el.cells[0].innerText + ': ' + el.cells[1].innerText + SEPARATOR;
    });
    var blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, FILENAME + '.txt');
});

// download as markdown
$('#downloadMarkdown').click(function(event) {
    event.preventDefault();
    var text = '';
    $('tbody tr').each(function( index, el ) {
        text += '**' + el.cells[0].innerText + '**: ' + el.cells[1].innerText + SEPARATOR;
    });
    var blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, FILENAME + '.md');
});

// download as ics
$('#downloadIcs').click(function(event) {
    event.preventDefault();
    $.getScript('/scripts/ics.js')
        .done(function() {
            var cal = ics();
            $('tbody tr').each(function (index, el) {
                var day = moment(el.cells[0].innerText, 'MMMM DD, YYYY');
                var start = moment(day).format('YYYY/MM/DD');
                var end = moment(day).add('d', 1).format('YYYY/MM/DD');
                var description = el.cells[1].innerText;
                var subject = 'Bible Reading';
                var location = 'Your Bible';
                cal.addEvent(subject, description, location, start, end);
            });
            cal.download(FILENAME);
        })
        .fail(function(err) {
            showError(err);
            console.log(err);
        });
});

// email as text
$('#emailText').click(function(event) {
    var text = '';
    $('tbody tr').each(function( index, el ) {
        text += el.cells[0].innerText + ': ' + el.cells[1].innerText + SEPARATOR;
    });
    console.log(text);
    $('#emailText').attr('href', 'mailto:?Subject=Bible Reading Plan&Body='+text);
});


//sdg
