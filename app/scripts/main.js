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
        bibleMath: '../bower_components/bible.math.js/bible.math'
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

require(['app', 'jquery', 'bibleMath', 'bootstrapDatepicker'], function (app, $) {
    'use strict';
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);
    console.log(bible);
    var ref = bible.parseReference("rom 1:3");
    console.log(bible.add(ref, 10).toString());

    $('#calendar-start').datepicker({});
    $('#calendar-end').datepicker({});


    // Load plans
    $.ajax({
        url: '/plans',
        type: 'GET',
    })
    .done(function(data) {
        var plans = [];

        console.log("success");
        $(data).find("a:contains(.json)").each(function() {
            plans.push($(this).attr("title"));
        });

        console.log(plans);

        for (var i = 0; i < plans.length; i++) {
            var planName = plans[i].split(".");
            var plan = '<a href="" class="list-group-item">' + planName[0] + '</a>';
            console.log(plan);
            $('#sequence').append(plan);
        }
    })
    .fail(function() {
        console.log("error");
        var plan = '<a href="" class="list-group-item">Error Loading Plans</a>';
        $('#sequence').append(plan);
    });

    function addPlans (plans) {
           
    }
    
});
