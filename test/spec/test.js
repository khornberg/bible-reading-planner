/*global describe, it, assert */
mocha.setup('bdd');
var assert = chai.assert;

(function () {
	'use strict';
    describe('App loaded', function () {
        describe('Are dependencies available?', function () {
            it('should have jQuery, moment, twix, time, bible.math, Spinner, and ics available', function () {
                assert.ok($().jquery, 'jQuery not loaded');
                assert.ok(moment, 'moment not loaded');
                assert.ok(moment.twix, 'twix not loaded');
                assert.ok(time, 'time not loaded');
                assert.ok(bible, 'bible not loaded');
                assert.ok(Spinner, 'Spinner not loaded');
                assert.ok(ics, 'ics not loaded');
            });
        });
    });
})();
