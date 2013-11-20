/* global moment */
/* exported time */

/**
 * Determines number of days in the bible reading plan
 * @param  {string} start Start of bible reading plan 'mm/dd/yyyy'
 * @param  {string} end   End of bible reading plan 'mm/dd/yyyy'
 * @param  {array} skip  Days to skip
 * @return {array}       Days in the bible reading plan
 */
var time = function (start, end, skip) {
    'use strict';
    var momentStart = moment(start);
    var momentEnd = moment(end);
    var range = momentStart.twix(momentEnd, true);
    var i = range.iterate('days');
    var c = 0;
    var days = [];
    
    while (c<range.count('days')) {
        var d = i.next();
        // day not found in the skip array, so read on that day
        if ( skip.indexOf(d.day()) < 0 ) {
            days.push(d.format('MMMM Do, YYYY'));
        }
        c++;
    }

    return days;
};