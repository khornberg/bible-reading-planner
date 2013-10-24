/**
* Make into an object?
* Inital values?
*/

function plan(bible_book, sequence, verses_day, remainder, book_remainder, sequence_key, results) {
	var chapter_verses = bible_book[sequence[sequence_key]-1]; //minus 1 for 0 indexed array
	var chapter = sequence[sequence_key]; //sequence must use real chapters

	var begin_verse = (remainder <= 0) ? 1 : chapter_verses - Math.abs(remainder) + 1;

    /**
     * Read to the end of the chapter unless:
     * 1) a new book is being read as shown by a (-)negative remainder or a book_remainder of 0
     * 2) reaminder in book to be read (book_remainder) plus the verses/day to be read is less than the verses in the chapter
     * 3) reaminder in book to be read (book_remainder) plus the remaining verses to be read is less than the verses in the chapter
    */
	var end_verse = null;
	
	// 1
	if (remainder < 0) {
		end_verse = Math.abs(remainder);
	} 
// 	else if (remainder > 0 && book_remainder === 0) {
// 		end_verse = remainder;
// 	}
    // 1
	else if (book_remainder === 0) {
		end_verse = (remainder === 0) ? verses_day : Math.abs(remainder);
	}
	// Correction for book_remainder problem
	else if (begin_verse == chapter_verses) {
		end_verse = chapter_verses;
	}
	// 3
	else if (chapter_verses - book_remainder + verses_day < chapter_verses) {
		end_verse = chapter_verses - book_remainder + verses_day;
	}
	else {
		end_verse = chapter_verses ;
	}
	
	// Only if a reader is reading 1 verse a day
	if (verses_day === 1) {
		end_verse = begin_verse;
	}

	var begin_ref = {'chapter': chapter, 'verse': begin_verse};
	var end_ref = {'chapter': chapter, 'verse': end_verse};

	//remainder
	if(verses_day <= chapter_verses) { //less than the chapter is read
		if(remainder === 0) {
			remainder = chapter_verses - verses_day;
		} 
		else if (book_remainder === 0) {
			remainder = chapter_verses - Math.abs(remainder);
		} 
		else {
			// remainder = (remainder - verses_day > 0) ? remainder - verses_day : 0;
			remainder = remainder - verses_day;

		}
	} 
	else {
		// more than than the chapter is read
		remainder = verses_day - chapter_verses;
		sequence_key++;
	}

    // TODO not calculating correct book remainder on 4:26 with remainder of 1
	book_remainder = (book_remainder !== 0) ? chapter_verses - Math.abs(remainder) : Math.abs(remainder);

	if (remainder <= 0) {
		sequence_key++;
		book_remainder = 0;
	}

	if(typeof results == 'undefined' )
		results = new Array();

	results.push({'day': results.length, 'start': begin_ref, 'end': end_ref});

	if (sequence.length !== sequence_key)
		plan(bible_book, sequence, verses_day, remainder, book_remainder, sequence_key, results);

	return results;
}

//sdg

