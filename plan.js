/**
* Make into an object?
* Inital values?
*/

function plan(bible_book, sequence, verses_day, remainder, book_remainder, sequence_key, results) {
	var chapter_verses = bible_book[sequence[sequence_key]-1]; //minus 1 for 0 indexed array
	var chapter = sequence[sequence_key]; //sequence must use real chapters

	var begin_verse = (remainder <= 0) ? 1 : chapter_verses - Math.abs(remainder) + 1;

	var end_verse = null;
	if (remainder < 0) {
		end_verse = Math.abs(remainder);
	} 
	else if (remainder > 0 && book_remainder === 0) {
		end_verse = Math.abs(remainder);
	}
	else if (book_remainder === 0 ) {
		end_verse = Math.abs(remainder) + verses_day;
	}
	else if (begin_verse == chapter_verses) {
		end_verse = chapter_verses;
	}
	else if (verses_day === 1) {
		end_verse = begin_verse;
	}
	else if (chapter_verses - book_remainder + verses_day < chapter_verses) {
		end_verse = chapter_verses - book_remainder + verses_day;
	}
	else {
		end_verse = chapter_verses ;
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
