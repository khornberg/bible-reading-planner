/* brackets-xunit: qunit */

var bible_book = [31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26];
	
test("bible reading plan small", function() {
    var sequence_small = [1,3,4,2,5];
    var verses_day_small = 20;
    var small_return = [{"day":0,"start":{"chapter":1,"verse":1},"end":{"chapter":1,"verse":20}},{"day":1,"start":{"chapter":1,"verse":21},"end":{"chapter":1,"verse":31}},{"day":2,"start":{"chapter":3,"verse":1},"end":{"chapter":3,"verse":9}},{"day":3,"start":{"chapter":3,"verse":10},"end":{"chapter":3,"verse":24}},{"day":4,"start":{"chapter":4,"verse":1},"end":{"chapter":4,"verse":5}},{"day":5,"start":{"chapter":4,"verse":6},"end":{"chapter":4,"verse":25}},{"day":6,"start":{"chapter":4,"verse":26},"end":{"chapter":4,"verse":26}},{"day":7,"start":{"chapter":2,"verse":1},"end":{"chapter":2,"verse":19}},{"day":8,"start":{"chapter":2,"verse":20},"end":{"chapter":2,"verse":25}},{"day":9,"start":{"chapter":5,"verse":1},"end":{"chapter":5,"verse":14}},{"day":10,"start":{"chapter":5,"verse":15},"end":{"chapter":5,"verse":32}}];
    var reading_plan_small = plan(bible_book, sequence_small, verses_day_small, 0, 0, 0);
	deepEqual(reading_plan_small, small_return);
});

// sdg
