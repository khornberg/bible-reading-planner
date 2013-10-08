/**
 * Calculates distance between verses by chapter and verse.
 * @depends on bible.js and bible.reference.js from bibly.js by John Dyer
 * 
 */

 /**    Expects a bible.Reference object
 *      bookIndex: _bookIndex,
 *      chapter: _chapter1,
 *      verse: _verse1,
 *      chapter1: _chapter1,
 *      verse1: _verse1,
 *      chapter2: _chapter2,
 *      verse2: _verse2
 *
 *      bookIndex and chapters are 0 based arrays
 */

bible.distance = function() {
 //arguments received
 var args = arguments;
 var chapters = null;
 var verses = null;
 var startRef = null;
 var endRef = null;
    
 // Reference book check
 if (args[0].bookIndex < 0) return {'chapters': null, 'verses': null};
 
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
    //verse in book and chapters
    else if (args[0].chapter1 == -1 && args[0].chapter2 == -1) {
        verses = bible.Books[args[0].bookIndex].verses.reduce(function(a, b){
            return a + b;
        }, 0);
        chapters = bible.Books[args[0].bookIndex].verses.length;
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
        var versesBegin = 0;
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
    if(chapter1==chapter2) return 0;
    
    for(i=chapter1; i<chapter2; i++) {
        verses = chapters[i] + verses;
    }
    
    return verses;
}

bible.add = function(reference, verses) {
    while(verses !== 0) {
        var chapterVerses = bible.Books[reference.bookIndex].verses[reference.chapter1];
        
        if(reference.verse1 + verses <= chapterVerses) {
            reference.verse1 = reference.verse1 + verses;
            verses = 0;
        }
        else {
            verses = Math.abs(chapterVerses - reference.verse1 - verses);
            reference.verse1 = 0;
        }
        
        if(verses !== 0) {
            var nextChapter = reference.chapter1 + 1;
            //-1 for 0 indexed array
            if( (bible.Books[reference.bookIndex].verses.length - 1) < nextChapter) {
                reference.bookIndex++;
                reference.chapter1 = 0;
            }
            else {
                reference.chapter1++;
            }
        }
    }
        
    return reference;
}

//sdg
