define(["bibleMath"], function() {

    'use strict';

    return {
        'create': function(bibleBook, sequence, versesPerDay, remainder, bookRemainder, sequenceKey, results) {
               
        var chapterVerses = bibleBook[sequence[sequenceKey] - 1]; //minus 1 for 0 indexed array
        var chapter = sequence[sequenceKey]; //sequence must use real chapters

        var beginVerse = (remainder <= 0) ? 1 : chapterVerses - Math.abs(remainder) + 1;

        /**
         * Read to the end of the chapter unless:
         * 1) a new book is being read as shown by a (-)negative remainder or a bookRemainder of 0
         * 2) reaminder in book to be read (bookRemainder) plus the verses/day to be read is less than the verses in the chapter
         * 3) reaminder in book to be read (bookRemainder) plus the remaining verses to be read is less than the verses in the chapter
        */
        var endVerse = null;
        
        // 1
        if (remainder < 0) {
            endVerse = Math.abs(remainder);
        }
        else if (bookRemainder === 0) {
            endVerse = (remainder === 0) ? versesPerDay : Math.abs(remainder);
        }
        // Correction for bookRemainder problem
        else if (beginVerse === chapterVerses) {
            endVerse = chapterVerses;
        }
        // 3
        else if (chapterVerses - bookRemainder + versesPerDay < chapterVerses) {
            endVerse = chapterVerses - bookRemainder + versesPerDay;
        }
        else {
            endVerse = chapterVerses;
        }
        
        // Only if a reader is reading 1 verse a day
        if (versesPerDay === 1) {
            endVerse = beginVerse;
        }

        var beginReference = {'chapter': chapter, 'verse': beginVerse};
        var endReference = {'chapter': chapter, 'verse': endVerse};

        //remainder
        if(versesPerDay <= chapterVerses) { //less than the chapter is read
            if (remainder === 0) {
                remainder = chapterVerses - versesPerDay;
            }
            else if (bookRemainder === 0) {
                remainder = chapterVerses - Math.abs(remainder);
            }
            else {
                // remainder = (remainder - versesPerDay > 0) ? remainder - versesPerDay : 0;
                remainder = remainder - versesPerDay;
            }
        }
        else {
            // more than than the chapter is read
            remainder = versesPerDay - chapterVerses;
            sequenceKey++;
        }

        // TODO not calculating correct book remainder on 4:26 with remainder of 1
        bookRemainder = (bookRemainder !== 0) ? chapterVerses - Math.abs(remainder) : Math.abs(remainder);

        if (remainder <= 0) {
            sequenceKey++;
            bookRemainder = 0;
        }

        if (typeof results === 'undefined' ) {
            results = new Array();
        }

        results.push({'day': results.length, 'start': beginReference, 'end': endReference});

        if (sequence.length !== sequenceKey) {
            plan(bibleBook, sequence, versesPerDay, remainder, bookRemainder, sequenceKey, results);
        }

        return results;

        },

        'load': function (sequence) {
            var result = '';
            $.ajax({
                dataType: "json",
                url: '/plans/' + sequence,
                async: false,
                success: function(json) { result = json; }
            });
            return result;
        },

        'output': function (p) {
            var day = '';
            for (var i = 0; i < p.length; i++) {
                day = '<tr><td>' + p[i].day + '</td><td>' + p[i].start + ' - ' + p[i].end + '</td>';
                $('tbody').append(day);
            };
            
        }
    };
});

//sdg
