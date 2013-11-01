define(['bibleMath'], function () {

    'use strict';

    var data = {};

    /**
     * Get data from page elements
     * @return {array} Array of the data
     */
    function get () {  
        // sequence
        data['sequenceName'] = $('.list-group-item.active').attr('name');

        // start
        data['start'] = $('#calendar-start').datepicker('getDate');

        // end
        data['end'] = $('#calendar-end').datepicker('getDate');

        // days to skip
        var opts = [];
        $('#skip-checkboxes input:checked').each(function (i, input) { 
            opts.push(Number(input.value)); 
        })
        data['skip'] = opts;

        // amount
        data['amount'] = Number($('#amount').val());

        // type
        data['type'] = $(':radio:checked').attr('id');

console.info("Data " + JSON.stringify(data));
        return data;
    }

    /**
     * Sets object data from get()
     */
    function set () {
        var data = this.get();
        this.sequenceName = data.sequenceName;
        this.start = data.start;
        this.end = data.end;
        this.skip = data.skip;
        this.amount = data.amount;
        this.type = data.type;

    }

    return {
        'sequenceName': data.sequenceName,
        'start': data.start,
        'end': data.end,
        'skip': data.skip,
        'amount': data.amount,
        'type': data.type,
        'duration': null,
        'get': get,
        'set': set,

        'create': function(sequence, amount, type) {
            sequence = (sequence === undefined) ? this.load(this.sequenceName) : sequence;
            amount = (amount === undefined) ? this.amount : amount;
            type = (type === undefined) ? this.type : type;

            if(type === 'verses') {
                return this.createVerses(sequence, 0, amount, 0, 0);
            }
            if(type === 'specified') {
                return this.createSpecified(sequence, amount)
            }
        },

        'createSpecified': function (sequence, amount) {
            var items = Math.round(sequence.data.length / this.duration.length, 0);
            var results = [];

            // whole sequence
            if (amount === 'whole'){ 
                for (var i = 0; i < this.duration.length; i++) {
                    var n = i * items;
                    var limit = (n + items > sequence.data.length) ? sequence.data.length : n + items;
                    var refs = [];
                    for (n; n < limit; n++) {
                        if(n < sequence.data.length) {
                            refs.push(bible.parseReference(sequence.data[n]));
                        }
                    };
                    results.push({'day': this.duration[i].toString(), 'refs': refs});
                    if (limit === sequence.data.length) { break; }
                };
            }

            // partial sequence
            if (amount === 'partial') {
                for (var i = 0; i < this.duration.length; i++) {
                    results.push({'day': this.duration[i].toString(), 'refs': bible.parseReference(sequence.data[i])})    
                };
            }

            return results;
        },

        'createVersesOld': function (sequence, sequenceKey, versesPerDay, remainder, bookRemainder, results) {
            //Parse
            var ref = bible.parseReference(sequence.data[sequenceKey]);

            // init
            // var remainder, bookRemainder = 0
            var chapterVerses = bible.Books[ref.bookIndex].verses[ref.chapter - 1]; //minus 1 for 0 indexed array
            var chapter = ref.chapter; //sequence must use real chapters

            var beginVerse = (remainder <= 0) ? 1 : chapterVerses - Math.abs(remainder) + 1;
            var endVerse = null;
            /**
             * Read to the end of the chapter unless:
             * 1) a new book is being read as shown by a (-)negative remainder or a bookRemainder of 0
             * 2) reaminder in book to be read (bookRemainder) plus the verses/day to be read is less than the verses in the chapter
             * 3) reaminder in book to be read (bookRemainder) plus the remaining verses to be read is less than the verses in the chapter
            */
            
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

            // TODO change these into bible.Reference objects
            var beginReference = bible.Reference(ref.bookIndex, chapter, beginVerse); //{'chapter': chapter, 'verse': beginVerse}; 
            var endReference = bible.Reference(ref.bookIndex, chapter, endVerse); //{'chapter': chapter, 'verse': endVerse};

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

            results.push({'start': beginReference, 'end': endReference});

            if (sequence.length !== sequenceKey) {
                this.createVersesOld(sequence, sequenceKey, versesPerDay, remainder, bookRemainder, results);
            }

            return results;
        },

        'createVerses': function (sequence, sequenceKey, versesPerDay, remainder, bookRemainder, results) {

            // init
            var ref = null;
            var r = [];
            var d = [];

            if (typeof results === 'undefined' ) {
                results = new Array();
            }

        
            for (var i = 0; i < this.duration.length; i++) {
                ref = bible.parseReference(sequence.data[sequenceKey]);
    console.info("seq ref " + ref.toString());

                if (ref != 'invalid' || !ref) {
                    var a = bible.add(ref, this.amount);
                
    console.info("bible amount " + this.amount + " bible add ref " + a.toString());
                    r.push(a);
                    var b = bible.distance(ref);
    console.info("bible distance " + b.toString());
                    d.push(b);
                    sequenceKey++;
                    results.push({'day': this.duration[i].toString(), 'start': r, 'end': ''});
                }
            };

    console.info(r);
    console.info(d);
    console.info(results);
            
            // if (sequence.length !== sequenceKey) {
            //     this.createVerses(sequence, sequenceKey, versesPerDay, remainder, bookRemainder, results);
            // }

            return results;
        },

        'load': function (sequence) {
            sequence = (sequence === undefined) ? this.sequenceName : sequence;
            var result = '';
            $.ajax({
                dataType: "json",
                url: '/bower_components/readingplans/' + sequence,
                async: false,
                success: function(json) { result = json; },
                error: function(e) { result = e; }
            });
            return result;
        },

        'output': function (plan, destination) {
            switch (destination) {
                case 'pdf':
                case 'text':
                case 'markdown':
                case 'ical':
                    console.error('Not implemented yet.');
                case 'dom':
                default:
                    var row = '';
                    for (var i = 0; i < plan.length; i++) {
                        row = row + '<tr><td>' + plan[i].day + '</td><td>';
                        for(var n = 0; n < plan[i].refs.length; n++) {
                            row = row + plan[i].refs[n].toString();
                            if( n < plan[i].refs.length - 1) {
                                row = row + ', ';
                            }
                        }

                        row = row + '</td></tr>';
                    };
                    return row;
            }
            
        }
    };
});

//sdg
