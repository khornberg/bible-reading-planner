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

/** Verse distances */
// Gen 2 - Gen 4
test("verse distance same book", function() {
    var resultDistance = bible.verseDistance(0, 1, 3);
    var expectedResults = 49;
	equal(resultDistance, expectedResults);
});

// Gen 1 - Gen 1
test("verse distance same book and chapter", function() {
    var resultDistance = bible.verseDistance(0, 0, 0);
    var expectedResults = 0;
	equal(resultDistance, expectedResults);
});

// Gen 1 - Gen 50
// Whole book, end chapter must be length of array
test("verse distance whole book", function() {
    var resultDistance = bible.verseDistance(0, 0, 50);
    var expectedResults = 1533;
	equal(resultDistance, expectedResults);
});

// Gen 2:5 - Lev 4:5
test("distance partial book to partial book though another book", function() {
    var ref1 = {bookIndex: 0, chapter: 1, verse: 5, chapter1: 1, verse1: 5, chapter2: -1, verse2: -1};
    var ref2 = {bookIndex: 2, chapter: 3, verse: 5, chapter1: 3, verse1: 5, chapter2: -1, verse2: -1};
    var resultDistance = bible.distance(ref1, ref2);
    var expectedResults = {'chapters': 92, 'verses': 2766};
	deepEqual(resultDistance, expectedResults);
});

// 2 John 3 - 3 John 5
test("verse distance middle of book to middle of another book", function() {
    var ref1 = {bookIndex: 62, chapter: 0, verse: 3, chapter1: 0, verse1: 3, chapter2: -1, verse2: -1};
    var ref2 = {bookIndex: 63, chapter: 0, verse: 5, chapter1: 0, verse1: 5, chapter2: -1, verse2: -1};
    var resultDistance = bible.distance(ref1, ref2);
    var expectedResults = {'chapters': 1, 'verses': 16};
    deepEqual(resultDistance, expectedResults);
});

// References reversed.
// 2 Chron 36:22 - Ezra 1:4
test("verse distance middle of book to middle of another book small", function() {
    var ref1 = {bookIndex: 13, chapter: 35, verse: 22, chapter1: 35, verse1: 22, chapter2: -1, verse2: -1};
    var ref2 = {bookIndex: 14, chapter: 0, verse: 4, chapter1: 0, verse1: 4, chapter2: -1, verse2: -1};
    var resultDistance = bible.distance(ref2, ref1);
    var expectedResults = {'chapters': 1, 'verses': 6};
    deepEqual(resultDistance, expectedResults);
});

// Eph 5:1 - Eph 6:10
// Eph 5:1-6:10
test("verse distance same book chapter to chapter", function() {
    var ref1 = {bookIndex: 48, chapter: 4, verse: 1, chapter1: 4, verse1: 1, chapter2: 5, verse2: 10};
    var resultDistance = bible.distance(ref1);
    var expectedResults = {'chapters': 1, 'verses': 43};
    deepEqual(resultDistance, expectedResults);
});

// Col
test("verse distance whole book", function() {
    var ref1 = {bookIndex: 50, chapter: -1, verse: -1, chapter1: -1, verse1: -1, chapter2: -1, verse2: -1};
    var resultDistance = bible.distance(ref1);
    var expectedResults = {'chapters': 4, 'verses': 95};
    deepEqual(resultDistance, expectedResults);
});

// Errored reference
test("verse distance whole book error all -1", function() {
    var ref1 = {bookIndex: -1, chapter: -1, verse: -1, chapter1: -1, verse1: -1, chapter2: -1, verse2: -1};
    var resultDistance = bible.distance(ref1);
    var expectedResults = {'chapters': null, 'verses': null};
    deepEqual(resultDistance, expectedResults);
});

// Other errors?


/** Add tests */
// 1 John 5:1 + 5 verses
test("add 5 verses from begining of book, same book", function() {
    var ref1 = {bookIndex: 61, chapter: 4, verse: 1, chapter1: 4, verse1: 1, chapter2: -1, verse2: -1};
    var n = 5;
    var result = bible.add(ref1, n);
    var expectedResults = {bookIndex: 61, chapter: 4, verse: 1, chapter1: 4, verse1: 6, chapter2: -1, verse2: -1};
    deepEqual(result, expectedResults);
});

// 1 John 5:20 + 10 verses
test("add 10 verses from middle of book, change 1 book", function() {
    var ref1 = {bookIndex: 61, chapter: 4, verse: 20, chapter1: 4, verse1: 20, chapter2: -1, verse2: -1};
    var n = 10;
    var result = bible.add(ref1, n);
    var expectedResults = {bookIndex: 62, chapter: 4, verse: 20, chapter1: 0, verse1: 9, chapter2: -1, verse2: -1};
    deepEqual(result, expectedResults);
});

// Gen 3:5 + 100 verses
test("add 100 verses from middle of book, change several chapters", function() {
    var ref1 = {bookIndex: 0, chapter: 2, verse: 5, chapter1: 2, verse1: 5, chapter2: -1, verse2: -1};
    var n = 100;
    var result = bible.add(ref1, n);
    var expectedResults = {bookIndex: 0, chapter: 2, verse: 5, chapter1: 6, verse1: 1, chapter2: -1, verse2: -1};
    deepEqual(result, expectedResults);
});

// Ps 3:5 + 100 verses
test("add 100 verses from middle of book, change several chapters", function() {
    var ref1 = {bookIndex: 18, chapter: 2, verse: 5, chapter1: 2, verse1: 5, chapter2: -1, verse2: -1};
    var n = 100;
    var result = bible.add(ref1, n);
    var expectedResults = {bookIndex: 18, chapter: 2, verse: 5, chapter1: 10, verse1: 3, chapter2: -1, verse2: -1};
    deepEqual(result, expectedResults);
});

// 1 John 5:1 + 100 verses
test("add 100 verses from middle of book, change several chapters and books", function() {
    var ref1 = {bookIndex: 61, chapter: 4, verse: 1, chapter1: 4, verse1: 1, chapter2: -1, verse2: -1};
    var n = 100;
    var result = bible.add(ref1, n);
    var expectedResults = {bookIndex: 65, chapter: 4, verse: 1, chapter1: 1, verse1: 8, chapter2: -1, verse2: -1};
    deepEqual(result, expectedResults);
});