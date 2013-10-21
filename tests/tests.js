// Tests

var bible_book = [31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26];

// whole book straight through
var sequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];

var sequence_random = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
// chapters mixed up
sequence_random.sort(function(a,b){
    return Math.floor(Math.random()*3 - 1);
});;

var verses_day = new Array();
// one
verses_day[0] = 1;
// fewer than all chapters
verses_day[1] = 13;
// greater than some, fewer than others, equal to three
verses_day[2] = 31;
// greater than all chapters
verses_day[3] = 50;

// output('bible_book', bible_book);
// output('sequence', sequence);
// output('sequence_random', sequence_random);

// for (var i = 0; i < verses_day.length; i++) {
// 	console.info("verses_day " + verses_day[i])
// 	output('vpd', verses_day[i]);

// 	var reading_plan = plan(bible_book, sequence, verses_day[i], 0, 0, 0);

// 	for (var i = 0; i < reading_plan.length; i++) {
// 		output('output', reading_plan[i].start.chapter + ":" + reading_plan[i].start.verse + "-" + reading_plan[i].end.chapter + ":" + reading_plan[i].end.verse);
// 	};

	

test("bible reading plan small", function() {
    var sequence_small = [1,3,4,2,5];
    var verses_day_small = 20;
    var small_return = [{"day":0,"start":{"chapter":1,"verse":1},"end":{"chapter":1,"verse":20}},{"day":1,"start":{"chapter":1,"verse":21},"end":{"chapter":1,"verse":31}},{"day":2,"start":{"chapter":3,"verse":1},"end":{"chapter":3,"verse":9}},{"day":3,"start":{"chapter":3,"verse":10},"end":{"chapter":3,"verse":24}},{"day":4,"start":{"chapter":4,"verse":1},"end":{"chapter":4,"verse":5}},{"day":5,"start":{"chapter":4,"verse":6},"end":{"chapter":4,"verse":25}},{"day":6,"start":{"chapter":4,"verse":26},"end":{"chapter":4,"verse":26}},{"day":7,"start":{"chapter":2,"verse":1},"end":{"chapter":2,"verse":19}},{"day":8,"start":{"chapter":2,"verse":20},"end":{"chapter":2,"verse":25}},{"day":9,"start":{"chapter":5,"verse":1},"end":{"chapter":5,"verse":14}},{"day":10,"start":{"chapter":5,"verse":15},"end":{"chapter":5,"verse":32}}];
    var reading_plan_small = plan(bible_book, sequence_small, verses_day_small, 0, 0, 0);
	deepEqual(reading_plan_small, small_return);
});

