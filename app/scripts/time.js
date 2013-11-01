define(['moment', 'twix'], function (moment) {

	'use strict';

	return function (start, end, skip) {
            var start = moment(start);
            var end = moment(end);
            var range = start.twix(end, true);
            var i = range.iterate('days');
            var c = 0;
            var days = [];
            
            while (c<range.count('days')) {
                var d = i.next(); 
                if ( !(skip.indexOf(d.day()) >= 0)) { 
                    days.push(d.format('MMMM Do, YYYY'));
                }
                c++;
            }

            return days;
        };
});