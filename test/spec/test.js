/*global describe, it, assert */

(function () {
	'use strict';
    describe('App loaded', function () {
        describe('Are dependencies available?', function () {
            it('should have jQuery, moment, twix, time, bible.math, ics, blob, filesaver available', function () {
                assert.ok($().jquery, 'jQuery not loaded');
                assert.ok(moment, 'moment not loaded');
                assert.ok(moment.twix, 'twix not loaded');
                assert.ok(time, 'time not loaded');
                assert.ok(bible, 'bible not loaded');
                assert.ok(ics, 'ics not loaded');
                assert.ok(Blob, 'ics not loaded');
                assert.ok(saveas, 'ics not loaded');
            });
        });
    });

    describe('Sequence parsing', function () {
        describe('Test each item in a sequence by parsing', function () {
            it('should have no errors', function () {
				var p = ["backtothebiblechronological.json", "esvchroniclesandprophets.json", "esvpsalmsandwisdomliterature.json", "esvgospelsandepistles.json", "esvpentateuchandhistoryofisrael.json", "esveverydayinword.json", "esvliterarystudybible.json", "esvthroughthebible.json", "heartlightotandnt.json", "mcheyne.json", "oneyearchronological.json"];

				for (var x = p.length - 1; x >= 0; x--) {
					planner.load(p[x], '/bower_components/readingplans');
					for (var i = planner.sequence.data.length - 1; i >= 0; i--) {
						var a = bible.parseReference(planner.sequence.data[i]);
						// if (a.bookIndex === -1 ) console.error('invalid reference: ' + planner.sequence.data[i] + ' key: ' + i + ' sequence: ' + planner.sequence.name + ' previous ref: ' + planner.sequence.data[i-1]);
						assert.notEqual(a.bookIndex, -1, planner.sequence.data[i].toString() + ' failed to parse. Object of ' + JSON.stringify(a));
					};
				};
            
            });
        });
    });

})();
