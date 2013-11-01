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
        moment: '../bower_components/moment/min/moment.min',
        twix: '../bower_components/twix/bin/twix.min'
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

require(['app', 'jquery', 'bibleMath', 'bootstrapDatepicker', 'bootstrapButton', 'bootstrapTooltip'], function (app, $) {
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
        "todayHighlight": true,
        "startDate": new Date()
    });

    $('#calendar-start').datepicker('update', new Date());

    $('#calendar-end').datepicker({
        "todayHighlight": true,
        "startDate": new Date()
    });

    var initEndDate = new Date();
    initEndDate.setDate(initEndDate.getDate() + 30);
    $('#calendar-end').datepicker('update', initEndDate);

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

    // radio buttons
    $('input[type=radio]').change(function () { 
        if ( this.id === 'specified' ) {
            $('#amount').hide();
        }
        else {
            $('#amount').show();
        }
    });

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

    // Load plans
    $.ajax({
        url: '/bower_components/readingplans',
        type: 'GET',
    })
    .done(function(data) {
        var plans = [];

        $(data).find("a:contains(.json)").each(function() {
            plans.push($(this).attr("title"));
        });

        for (var i = 0; i < plans.length; i++) {
            var planName = setSequences(plans[i]);   
        }
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
        $.getJSON('/bower_components/readingplans/' + sequence) 
        .done(function(json, textStatus) {
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

    $('#sequence').click(function (e) {
        e.preventDefault();
    })
    
    // create plan
    $('#create').click(function(event) {

        $('#wait').show();     

        require(['plan', 'time', 'bootstrapAlert'], function (plan, time) {

            plan.set();
            var jsonSequence = plan.load(plan.sequence);
            
            if (jsonSequence.status != 404) {
                $('#wait').hide();
                $('.alert').remove();

                plan.duration = time(plan.start, plan.end, plan.skip);
                // var userPlan = plan.create(jsonSequence, plan.amount, plan.type);

                // test specified sequences
                var userPlan = plan.create(jsonSequence, 'whole', plan.type);
                // var userPlan = plan.create(jsonSequence, 'partial', plan.type);

                var rows = plan.output(userPlan, 'dom');
console.log(rows);
                if (rows) {
                    $('tbody').children().remove();
                }
                $('tbody').append(rows);
                $('.plan').fadeIn('slow'); //use css3 animation
            }
            else {
                $('#wait').hide();
                $('div .alert').remove();
                var message = 'A sequence could not be loaded.'
console.error(jsonSequence.status);
                var error_message = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>' + message + '</strong></div>';
                $('#wait').parent().append(error_message);
            }

            
       });
    });
});

//sdg

