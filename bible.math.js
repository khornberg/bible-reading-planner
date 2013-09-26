/**
 * Calculates distance between verses by chapter and verse.
 * @depends on bible.js and bible.reference.js from bibly.js by John Dyer
 * 
 */

// Expects a bible.Reference object
// bookIndex: _bookIndex,
// chapter: _chapter1,
// verse: _verse1,
// chapter1: _chapter1,
// verse1: _verse1,
// chapter2: _chapter2,
// verse2: _verse2,

bible.distance = function() {
 //arguments received
 var args = arguments;
 var chapters = null;
 var verses = null;
 var startRef = null;
 var endRef = null;
 
 // Sort references based on book order
 if (args.length > 1) {
    if (args[0].bookIndex < args[1].bookIndex) {
        startRef = args[0];
        endRef = args[1];
    }
    else {
        startRef = args[1];
        endRef = args[0];
    }
 }

 //1 argument
 if (args.length == 1) {
    //chapter2 and verse2 are set, calculate distance between chapter1, verse1 and chapter2, verse2
    if (args[0].chapter2 != -1 && args[0].verse2 != -1) {
        verses = args[0].verse2 + bible.verseDistance(args[0].bookIndex, args[0].chapter1, args[0].chapter2) - args[0].verse1 + 1;
        chapters = args[0].chapter2 - args[0].chapter1;
    }
    //chapter2 and verse2 are not set, expects a second argument
    //bookIndex set?
    //neither distance can be calculated, returning null
    else {
        return {'chapters': chapters, 'verses': verses};
    }
 }
 //2 arguments, any more are ignored
 else {
    //calculate distance between args[0] chapter1, verse1 and args[1] chapter1, verse1 or chapter2, verse2 if set
    if (endRef.chapter2 != -1 || endRef.verse2 != -1) {
        endRef.verse = endRef.verse2;
        endRef.chapter = endRef.chapter2;
    }
    else {
        endRef.verse = endRef.verse1;
        endRef.chapter = endRef.chapter1;
    }
    
    // Book indices are different
    if(startRef.bookIndex !== endRef.bookIndex) {
        var startBook = 0;
        var versesBeginn = 0;
        var versesMiddle = 0;
        var versesEnd = 0;
        var chaptersBegin = 0;
        var chaptersMiddle = 0;
        var chaptersEnd = 0;
        
        startBook = bible.Books[startRef.bookIndex].verses.length;
        versesBegin = bible.verseDistance(startRef.bookIndex, startRef.chapter1, startBook) - startRef.verse1 + 1;
        chaptersBegin = startBook - startRef.chapter1;
        versesEnd = bible.verseDistance(endRef.bookIndex, 0, endRef.chapter) + endRef.verse;
        chaptersEnd = endRef.chapter1;
        
        //whole book distances
        for(b=startRef.bookIndex+1; b<endRef.bookIndex; b++) {
            versesMiddle = bible.verseDistance(b, 0, bible.Books[b].verses.length) + versesMiddle;
            chaptersMiddle += bible.Books[b].verses.length;
        }
        
        verses = versesBegin + versesMiddle + versesEnd;
        chapters = chaptersBegin + chaptersMiddle + chaptersEnd;
    }
    else {
        verses = endRef.verse1 + bible.verseDistance(startRef.bookIndex, startRef.chapter1, endRef.chapter1) - startRef.verse1 + 1;
        chapters = endRef.chapter1 - startRef.chapter1;
    }
 }
 
 return {'chapters': chapters, 'verses': verses};
}

bible.verseDistance = function(bookIndex, chapter1, chapter2) {
    var chapters = bible.Books[bookIndex].verses;
    var verses = 0;
    //single chapter
    if(chapter1==chapter2) return bible.Books[bookIndex].verses[chapter1];
    
    for(i=chapter1; i<chapter2; i++) {
        verses = chapters[i] + verses;
    }
    
    return verses;
}

/**
 * Tests
 */
// // Gen 1 - Gen 2
// var ref1 = {bookIndex: 0, chapter: 0, verse: 1, chapter1: 0, verse1: 1, chapter2: -1, verse2: -1};
// var ref2 = {bookIndex: 0, chapter: 1, verse: 1, chapter1: 1, verse1: 1, chapter2: -1, verse2: -1};
// var resultDistance = bible.distance(ref1, ref2);
// var expectedResults = {'chapters': 1, 'verses': 56};

// test("sdistance ame book to same book", function() {
// 	deepEqual(resultDistance, expectedResults);
// });

// // Gen 10 - Gen 12
// var ref1 = {bookIndex: 0, chapter: 9, verse: 1, chapter1: 9, verse1: 1, chapter2: -1, verse2: -1};
// var ref2 = {bookIndex: 0, chapter: 11, verse: 1, chapter1: 11, verse1: 1, chapter2: -1, verse2: -1};
// var resultDistance = bible.distance(ref1, ref2);
// var expectedResults = {'chapters': 2, 'verses': 84};
// test("distance same book to same book more than one chapter", function() {
// 	deepEqual(resultDistance, expectedResults);
// });

// // 1 John 2 - 1 John 2
// // 1 John 2
// var ref1 = {bookIndex: 61, chapter: 1, verse: 1, chapter1: 1, verse1: 1, chapter2: 1, verse2: 1};
// var resultDistance = bible.distance(ref1);
// var expectedResults = {'chapters': 0, 'verses': 29};
// test("distance single whole chapter", function() {
// 	deepEqual(resultDistance, expectedResults);
// });

// // 2 John 3 - 3 John 5
// var ref1 = {bookIndex: 62, chapter: 3, verse: 1, chapter1: 3, verse1: 1, chapter2: -1, verse2: -1};
// var ref2 = {bookIndex: 63, chapter: 4, verse: 1, chapter1: 4, verse1: 1, chapter2: -1, verse2: -1};
// var resultDistance = bible.distance(ref1, ref2);
// var expectedResults = {'chapters': 2, 'verses': 16};
// test("distance middle of book to middle of another book", function() {
// 	deepEqual(resultDistance, expectedResults);
// });

// References reversed.
// // 2 Chron 36:22 - Ezra 1:4
// var ref1 = {bookIndex: 13, chapter: 35, verse: 22, chapter1: 35, verse1: 22, chapter2: -1, verse2: -1};
// var ref2 = {bookIndex: 14, chapter: 0, verse: 4, chapter1: 0, verse1: 4, chapter2: -1, verse2: -1};
// var resultDistance = bible.distance(ref2, ref1);
// var expectedResults = {'chapters': 1, 'verses': 6};
// test("distance middle of book to middle of another book small", function() {
// 	deepEqual(resultDistance, expectedResults);
// });

// // Eph 5:1 - Eph 6:10
// // Eph 5:1-6:10
// var ref1 = {bookIndex: 48, chapter: 4, verse: 1, chapter1: 4, verse1: 1, chapter2: 5, verse2: 10};
// var resultDistance = bible.distance(ref1);
// var expectedResults = {'chapters': 1, 'verses': 43};
// test("distance same book chapter to chapter", function() {
// 	deepEqual(resultDistance, expectedResults);
// });

// // Col
// var ref1 = {bookIndex: 50, chapter: -1, verse: -1, chapter1: -1, verse1: -1, chapter2: -1, verse2: -1};
// var resultDistance = bible.distance(ref1);
// var expectedResults = {'chapters': 0, 'verses': 95};
// test("distance whole book", function() {
// 	deepEqual(resultDistance, expectedResults);
// });

// // Errored reference
// var ref1 = {bookIndex: -1, chapter: -1, verse: -1, chapter1: -1, verse1: -1, chapter2: -1, verse2: -1};
// var resultDistance = bible.distance(ref1);
// var expectedResults = {'chapters': 0, 'verses': 0};
// test("distance whole book", function() {
// 	deepEqual(resultDistance, expectedResults);
// });

// Other errors?


//sdg
