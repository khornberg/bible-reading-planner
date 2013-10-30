require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        bootstrapAffix: '../bower_components/sass-bootstrap/js/affix',
        bootstrapAlert: '../bower_components/sass-bootstrap/js/alert',
        bootstrapButton: '../bower_components/sass-bootstrap/js/button',
        bootstrapCarousel: '../bower_components/sass-bootstrap/js/carousel',
        bootstrapCollapse: '../bower_components/sass-bootstrap/js/collapse',
        bootstrapDropdown: '../bower_components/sass-bootstrap/js/dropdown',
        bootstrapModal: '../bower_components/sass-bootstrap/js/modal',
        bootstrapPopover: '../bower_components/sass-bootstrap/js/popover',
        bootstrapScrollspy: '../bower_components/sass-bootstrap/js/scrollspy',
        bootstrapTab: '../bower_components/sass-bootstrap/js/tab',
        bootstrapTooltip: '../bower_components/sass-bootstrap/js/tooltip',
        bootstrapTransition: '../bower_components/sass-bootstrap/js/transition',
        bootstrapDatepicker: '../bower_components/bootstrap-datepicker/js/bootstrap-datepicker',
        bible: '../bower_components/bible.math.js/bible',
        bibleReference: '../bower_components/bible.math.js/bible.reference',
        bibleMath: '../bower_components/bible.math.js/bible.math',
    },
    shim: {
        bootstrapAffix: {
            deps: ['jquery']
        },
        bootstrapAlert: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapButton: {
            deps: ['jquery']
        },
        bootstrapCarousel: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapCollapse: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapDropdown: {
            deps: ['jquery']
        },
        bootstrapModal:{
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapPopover: {
            deps: ['jquery', 'bootstrapTooltip']
        },
        bootstrapScrollspy: {
            deps: ['jquery']
        },
        bootstrapTab: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapTooltip: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapTransition: {
            deps: ['jquery']
        },
        bootstrapDatepicker: {
            deps: ['jquery']
        },
        bible: {
            exports: 'bible'
        },
        bibleReference: {
            deps: ['bible']
        },
        bibleMath: {
            deps: ['bible', 'bibleReference']
        }
    }
});

require(['app', 'jquery', 'bibleMath', 'bootstrapDatepicker', 'bootstrapButton'], function (app, $) {
    'use strict';
    // use app here
    // 
    // tests
    console.groupCollapsed('App tests');
    console.log(app);
    console.log('Running jQuery %s', $().jquery);
    console.log(bible);
    var ref = bible.parseReference("rom 1:3");
    console.log(bible.add(ref, 10).toString());
    console.groupEnd();

    // calendars
    $('#calendar-start').datepicker({
        "todayHighlight":true,
        "startDate": new Date()
    });

    var endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    $('#calendar-end').datepicker({
        "todayHighlight":true,
        "startDate": endDate
    });

    // the end cannot be before the start
    $('#calendar-start').change(function() {
        $('#calendar-end').datepicker('setStartDate', $('#calendar-start').datepicker('getDate'));
    })

    // the start cannot be after the end
    $('#calendar-end').change(function() {
        $('#calendar-start').datepicker('setEndDate', $('#calendar-end').datepicker('getDate'));
    })

    // disable days
    $('#skip-checkboxes').change(function () {
        $('#calendar-start').datepicker('setDaysOfWeekDisabled', getSkippedDays());
        $('#calendar-end').datepicker('setDaysOfWeekDisabled', getSkippedDays());
    })

    /**
     * Get skipped days checked
     * @return {array} Array of skipped days
     */
    function getSkippedDays () {
        var opts = [];
        $('#skip-checkboxes input:checked').each(function (i, input) { 
            opts.push(input.value); 
        })
        return opts;
    }

    // radio buttons
    $('input[type=radio]').change(function () { 
        console.log(this);
        if ( this.id === 'specified' ) {
            $('#amount').hide(); 
        }
        else {
            $('#amount').show();
        }
    });

    // Load plans
    $.ajax({
        url: '/plans',
        type: 'GET',
    })
    .done(function(data) {
        var plans = [];

        $(data).find("a:contains(.json)").each(function() {
            plans.push($(this).attr("title"));
        });

        console.groupCollapsed('Load Plan Names');

        for (var i = 0; i < plans.length; i++) {
            var planName = setSequences(plans[i]);   
        }
        console.groupEnd();
    })
    .fail(function() {
        console.error("error loading bible reading plan");
        var plan = '<a href="" class="list-group-item">Error Loading Plans</a>';
        $('#sequence').append(plan);
    });

    /**
     * Gets name from each plan and add to list
     * @param {string} plan Filename of plan to load
     */
    function setSequences (sequence) {
        $.getJSON('/plans/' + sequence) 
        .done(function(json, textStatus) {
            console.log(json.name + " " + textStatus);
            var plan = '<a href="#" class="list-group-item" name="' + sequence + '">' + json.name + '</a>';
            $('#sequence').append(plan);

            // select functionality
            $('.list-group-item').click(function () { 
                $('.list-group-item').each(function () {
                    $(this).removeClass('active');
                })

                $(this).addClass('active');
            });
        });
    }
    
    /**
     * Get data from page elements
     * @return {array} Array of the data
     */
    define('getData', [], function () {
        'use strict';

        return function () {
                var data = [];
                // sequence
                data['sequence'] = $('.list-group-item.active').attr('name');

                // start
                data['start'] = $('#calendar-start').datepicker('getDate');

                // end
                data['end'] = $('#calendar-end').datepicker('getDate');

                // days to skip
            //     var opts = [];
            // $('#skip-checkboxes input:checked').each(function (i, input) { 
            //     opts.push(input.value); 
            // })
                data['skip'] = getSkippedDays();

                // amount
                data['amount'] = $('#amount').val();

                // type
                data['type'] = $(':radio:checked').attr('id');

                console.info(data);
                return data;
        };
    });

    // create plan
    $('#create').click(function(event) {

        $('#wait').show();     
        

        require(['getData', 'plan'], function (getData, plan) {
            var data = getData();
            // plan(bibleBook, sequence, versesPerDay, remainder, 0, 0, 0);
        });

        //testing only
        setTimeout(function () {
            $('#wait').hide();
            $('.plan').fadeIn('slow');
        }, 2000)
    });
});

//sdg

