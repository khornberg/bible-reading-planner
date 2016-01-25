/* global bible, planner, saveAs, moment, ics */

'use strict';

// tests
console.groupCollapsed('App tests');
console.log('Running jQuery %s', $().jquery);
console.log(bible);
var ref = bible.parseReference('rom 1:4');
console.log(bible.add(ref, 10).toString());
console.log('LZString: ' + typeof LZString !== 'undefined');
console.log('moment: ' + typeof moment !== 'undefined');
console.log('ics: ' + typeof ics !== 'undefined');
console.groupEnd();

/**
 * Contants
 */
// var PATH = (window.location.host === 'khornberg.github.io') ? window.location.href + '/bible-reading-planner' : '';
var BASE_URL = window.location.origin + window.location.pathname;
var READING_PLANS = BASE_URL + 'bower_components/readingplans';
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
 * @return {object} Object of the user data
 */
function getPlanData () {
    var data = {};

    // sequence name
    data.sequenceName = $('.list-group-item.active').attr('name');
    if (!data.sequenceName) {
        throw 'Choose a sequence.';
    }

    // beginning
    data.begin = $('#calendar-start').datepicker('getDate');
    if (data.begin[0]) {
        throw 'Choose a start date.';
    }

    // end
    data.end = $('#calendar-end').datepicker('getDate');
    if (data.end[0]) {
        throw 'Choose an end date.';
    }

    // days to skip
    var opts = [];
    $('#skip-checkboxes input:checked').each(function (i, input) {
        opts.push(Number(input.value));
    });

    data.skip = opts;

    // kind
    data.kind = $('#type :radio:checked').attr('id');

    // amount
    data.amount = $('#amountNumber').val();

    if(!data.kind) {
        throw 'Choose an amount to read.';
    }
    else if(data.kind === 'verses' && !data.amount) {
        throw 'Specify the number of verses per day you want to read.';
    }
    else if(data.kind === 'undefined') {
        throw 'Choose to whether or not to read some verses, the whole plan, or just what fits in your day.';
    }

    console.log('Data ' + JSON.stringify(data));

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

                if ( typeof  plan[i].refs[n] === 'string') {
                    rows = rows + plan[i].refs[n];

                    // don't put a comma after the last element
                    if( n < plan[i].refs.length - 1) {
                        rows = rows + ', ';
                    }
                }
                else {
                    for(var d = 0; d < plan[i].refs[n].length; d++) {
                        rows = rows + plan[i].refs[n][d];

                        // don't put a comma after the last element
                        if( d < plan[i].refs[n].length - 1) {
                            rows = rows + ', ';
                        }
                    }
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
 * Assembles URI
 * @return {[type]} [description]
 */
function assembleUri () {
    var uriString = '';

    /*
     * p = plan
     * s = start date
     * e = end date
     * k = skipped days
     * a = amount to read (kind): read number of verses, everything, or what time allows
     */

    uriString += 'p=' + planner.sequence.abbv + '&';
    uriString += 's=' + (planner.begin.getMonth()+1) + '/' + planner.begin.getDate() + '/' + planner.begin.getFullYear() + '&';
    uriString += 'e=' + (planner.end.getMonth()+1) + '/' + planner.end.getDate() + '/' + planner.end.getFullYear() + '&';
    uriString += 'k=[' + planner.skip.toString() + ']&';
    uriString += 'a=' + planner.amount;
console.log(uriString);
    return uriString;
}

/**
 * Compresses URI string to base64 using LZString and replacing invalid URI characters = and /
 * @return {string} Compressed URI data
 */
function compressUri () {
    var uriStringCompressed = LZString.compressToBase64(assembleUri()).replace("=","$").replace("/","-");
    return uriStringCompressed;
}

/**
 * Decompresses and gets URI data
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/window.location}
 * @returns {object} URI data
 */

function getUriData () {
    var oGetVars = {};

    function buildValue(sValue) {
      if (/^\s*$/.test(sValue)) { return null; }
      if (/^(true|false)$/i.test(sValue)) { return sValue.toLowerCase() === "true"; } //Boolean
      if (isFinite(sValue)) { return parseFloat(sValue); } //Float
      if (isFinite(Date.parse(sValue))) { return new Date(sValue); } //Date
      if (/^\[.*\]$/.test(sValue)) { return JSON.parse(sValue); } //Array
      return sValue;
    }

    if (window.location.search.length > 1) {
      var uri = LZString.decompressFromBase64(window.location.search.substr(1)).replace("$","=").replace("-","/");
console.log(uri || false);
      for (var aItKey, nKeyId = 0, aCouples = uri.split("&"); nKeyId < aCouples.length; nKeyId++) {
        aItKey = aCouples[nKeyId].split("=");
        oGetVars[unescape(aItKey[0])] = aItKey.length > 1 ? buildValue(unescape(aItKey[1])) : null;
      }
    }

    return oGetVars;
}

/**
 * Validates plan data in uri
 * @param  {object}  uriData Uncompressed plan data
 * @return {Boolean}         True if plan is valid
 */
function isValidPlan (uriData) {
    var abbv = [];
    $('.list-group-item').each(function () {
        abbv.push($( this ).attr('data-abbv'));
    });

    if (abbv.indexOf(uriData.p) === -1) { return false; } // plan abbreviation
    // if (typeof uriData.p === 'undefined') { return false; } // plan abbreviation
    if (!isFinite(Date.parse(uriData.s))) { return false; } // start date
    if (!isFinite(Date.parse(uriData.e))) { return false; } // end date
    if (!Array.isArray(uriData.k)) { return false; } // skip days
    if (!$.isNumeric(uriData.a) && uriData.a !== 'partial' && uriData.a !== 'whole') {
        return false;
    }
    return true;
}

/**
 * Updates links for sharing the plan
 */
function updateLinks () {
    $('#fb').attr('href', 'http://www.facebook.com/sharer.php?u=' + window.location.href);
    $('#tw').attr('href', 'http://twitter.com/share?url=' + window.location.href + '&Bible Reading Plan');
    $('#gp').attr('href', 'https://plus.google.com/share?url='+ window.location.href);
    $('#li').attr('href', 'http://www.linkedin.com/shareArticle?mini=true&url='+ window.location.href);
}

/**
 * UI construct
 */

var uriData = getUriData();

// set sequence selected
$('.list-group-item').each(function () {
    if ($( this ).attr('data-abbv') === uriData.p) {
        $( this ).addClass('active');
    }
});

function getStartDate() {
  var today = new Date();
  var thisYear = today.getFullYear();
  return new Date(thisYear, 0, 1);
}

// calendars
$('#calendar-start').datepicker({
    'todayHighlight': true,
    'startDate': getStartDate()
});
// set calendar start date
$('#calendar-start').datepicker('update', (typeof uriData.s !== 'undefined') ? uriData.s : new Date());

$('#calendar-end').datepicker({
    'todayHighlight': true,
    'startDate': new Date()
});

var initEndDate = null;
if (typeof uriData.e !== 'undefined') {
    initEndDate = uriData.e;
} else {
    initEndDate = new Date();
    initEndDate.setDate(initEndDate.getDate() + 30);
}
// set calendar end date
$('#calendar-end').datepicker('update', initEndDate);

// the end cannot be before the start
$('#calendar-start').change(function() {
    $('#calendar-end').datepicker('setStartDate', $('#calendar-start').datepicker('getDate'));
});

// the start cannot be after the end
$('#calendar-end').change(function() {
    $('#calendar-start').datepicker('setEndDate', $('#calendar-end').datepicker('getDate'));
});

// set disabled days
if (typeof uriData.k !== 'undefined' && uriData.k.length > 0) {
    $('#calendar-start').datepicker('setDaysOfWeekDisabled', uriData.k);
    $('#calendar-end').datepicker('setDaysOfWeekDisabled', uriData.k);
    $('#skip-checkboxes input').each(function (i, input) {
        if (uriData.k.indexOf(Number(input.value)) !== -1) {
            $( this ).parent().addClass('active');
        }
    })
}

// disable days
$('#skip-checkboxes').change(function () {
    $('#calendar-start').datepicker('setDaysOfWeekDisabled', getSkippedDays());
    $('#calendar-end').datepicker('setDaysOfWeekDisabled', getSkippedDays());
});

// set radio buttons
if (typeof uriData.a !== 'undefined') {
    if (uriData.a === 'partial') {
        $('#amountNumber').hide();
        // $('#amountSpecified').show();
        $('#partial').parent().addClass('active');
        $('#partial').prop( 'checked', true);
        $('#specified').parent().addClass('active');
        $('#specified').prop( 'checked', true);
    } else if (uriData.a === 'whole') {
        $('#amountNumber').hide();
        // $('#amountSpecified').show();
        $('#whole').parent().addClass('active');
        $('#whole').prop( 'checked', true);
        $('#specified').parent().addClass('active');
        $('#specified').prop( 'checked', true);
    } else {
        $('#amountNumber').show().val(uriData.a);
        // $('#amountSpecified').hide();
        $('#verses').parent().addClass('active');
        $('#verses').prop( 'checked', true);
    }
}

// radio buttons
$('#type input[type=radio]').change(function () {
    if ( this.id === 'verses' ) {
        $('#amountNumber').show();
    }
    else {
        $('#amountNumber').hide();
    }
});

/**
 * User actions
 */

/**
 * Gets name from each plan and add to list
 */

 // select functionality
$('.list-group-item').click(function () {
    // TODO better way of doing this?
    $('.list-group-item').each(function () {
        $(this).removeClass('active');
    });

    $(this).addClass('active');

    // Load text
    // TODO reduce XHRs
    planner.sequenceName = $('.list-group-item.active').attr('name');
    planner.load();

    // $('.panel-heading').text(planner.sequence.name);

    var firstDay = '<p><b>Day 1:</b> ' + planner.sequence.data2[0];
    var secondDay = '<br /><b>Day 2:</b> ' + planner.sequence.data2[1] + '</p>';
    var totalDays = '<p><b>Days:</b> ' + planner.sequence.data2.length + '<br /><b>Readings:</b> ' + planner.sequence.data.length;
    var info = planner.sequence.info + '<br /><br />Excerpt from the original sequence:' + firstDay + secondDay + totalDays;

    $('.panel-sequence').html(info);
});

$('#sequence').click(function (e) {
    e.preventDefault();
});

$('#legal').click(function (e) {
    e.preventDefault();
    $('.legal').toggle();
    document.getElementById('legal').scrollIntoView();
});

// create plan
$('#create').click(function() {
    try {
        $('.alert').remove();

        var data = getPlanData();
        planner.set(data);
        planner.create();

        var rows = output(planner.plan, 'dom');
        if (rows) {
            $('tbody').children().remove();
        }
        $('tbody').append(rows);
        // $('.plan').addClass('fade');
        $('.plan').css('display', 'block');

        document.getElementById('plan').scrollIntoView();

        window.history.pushState({}, 'Create Bible Reading Plan', window.location.pathname + '?' + compressUri());

        updateLinks();

        $('#downloads h2').text('Your customized ' + planner.sequence.name + ' plan');
    }
    catch(err) {
        console.error(err);
        if (err.status === 404) {
            showError('Error getting the plan file.');
        }
        else {
            showError(err);
        }
    }
});

// show save/download options
$('#save').click(function (event) {
    event.preventDefault();
    $('.save a').toggle();
});

// show share options
$('#share').click(function (event) {
    event.preventDefault();
    $('.share a').toggle();
});

// download as text
$('#downloadText').click(function (event) {
    event.preventDefault();
    var text = '';
    $('tbody tr').each(function( index, el ) {
        text += el.cells[0].innerText + ': ' + el.cells[1].innerText + SEPARATOR;
    });
    var blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, FILENAME + '.txt');
});

// download as markdown
$('#downloadMarkdown').click(function (event) {
    event.preventDefault();
    var text = '';
    $('tbody tr').each(function( index, el ) {
        text += '**' + el.cells[0].innerText + '**: ' + el.cells[1].innerText + SEPARATOR;
    });
    var blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, FILENAME + '.md');
});

// download as ics
$('#downloadIcs').click(function (event) {
    event.preventDefault();
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
});

// email as text
$('#emailText').click(function (event) {
    // var text = '';
    // $('tbody tr').each(function( index, el ) {
    //     text += el.cells[0].innerText + ': ' + el.cells[1].innerText + SEPARATOR;
    // });
    // console.log(text);
    $('#emailText').attr('href', 'mailto:?Subject=Bible Reading Plan&Body=My bible reading plan: ' + window.location.href);
});

if (isValidPlan(uriData)) {
    console.log(isValidPlan(uriData));
    $('#create').trigger('click');
}

//sdg
