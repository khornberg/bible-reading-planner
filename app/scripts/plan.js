/* global bible, time */
/* global READING_PLANS */
/* exported planner */

/**
 * Planner creates the bible reading plan.
 */

var planner = {
    'sequence': null,
    'sequenceName': null,
    'begin': null,
    'end': null,
    'skip': null,
    'amount': null,
    'type': null,
    'duration': null,
    'plan': null,
    
    /**
     * Determines type of plan to create
     * @param  {object} sequence Bible reading sequence
     * @param  {string|int} amount   Amount to read
     * @param  {string} type     Sequence type
     * @return {object}          Bible reading plan
     */
    'create': function () {
        'use strict';

        if(this.type === 'verses') {
            var amount = (Number(this.amount) > 0) ? Number(this.amount) : 1;
            this.plan = this.createVersesPlan(this.sequence, amount);
        }
        if(this.type === 'specified') {
            this.plan = this.createSpecifiedPlan(this.sequence, this.amount);
        }
        // if(type === 'chapters') {
        //     return this.createChaptersPlan(sequence, Number(amount));
        // }
    },

    /**
     * Create plan using the sequence plan
     * @param  {object} sequence Bible reading sequence
     * @param  {string|int} amount   Amount to read
     * @return {object}          Bible reading plan
     */
    'createSpecifiedPlan': function (sequence, amount) {
        'use strict';

        var items = Math.floor(sequence.data2.length / this.duration.length);
        // If duration is longer than the sequence, adjust to ouput everything
        items = (items === 0) ? 1 : items;
        var mod = sequence.data2.length % this.duration.length;
        var results = [];
        var sequenceKey = 0;

        /** 
         * Whole sequence
         * For each day of the sequence and each item in the day's sequence, add the day's items.
         * If the number of days to read is not the same as the days in the sequence, read more in the beginning since people give up less right away.
         */
        if (amount === 'whole'){

            for (var day = 0; day < this.duration.length; day++) {
                var refs = [];
                
                for (var x = 0; x < items; x++) {
                    if(sequenceKey < sequence.data2.length) {
                        for (var a = 0; a < sequence.data2[sequenceKey].length; a++) {
                            refs.push(bible.parseReference(sequence.data2[sequenceKey][a]).toString());
                        }
                        sequenceKey++;
                        if (mod > 0) {
                            for (var b = 0; b < sequence.data2[sequenceKey].length; b++) {
                                refs.push(bible.parseReference(sequence.data2[sequenceKey][b]).toString());
                            }
                            sequenceKey++;
                            mod--;
                        }
                    }
                }

                results.push({'day': this.duration[day].toString(), 'refs': refs});
                if (sequenceKey === sequence.data2.length) { break; }
            }
        }

        /**
         * Partial sequence
         * For each day in the sequence, read the amount
         */
        if (amount === 'partial') {
            var sequenceLength = (this.duration.length < sequence.data2.length) ? this.duration.length : sequence.data2.length;
            for (var i = 0; i < sequenceLength; i++) {
                var ref = '';
                for (var n = 0; n < sequence.data2[i].length; n++) {
                    var comma = (n > 0) ? ', ' : '';
                    ref += comma + bible.parseReference(sequence.data2[i][n]).toString();
                }
                results.push({'day': this.duration[i].toString(), 'refs': [ref.trim()]});
            }
                
        }

        return results;
    },

    /**
     * Create plan using a set number of verses
     * @param  {object} sequence Bible reading sequence
     * @param  {int} amount   Amount to read
     * @return {object}          Bible reading plan
     */
    'createVersesPlan': function (sequence, amount) {
        'use strict';

        var sequenceKey = 0;
        var partialReferenceString = '';
        var results = [];
        var refs = [];
        var dayRefs = [];
        var ref;
        var remainder = 0;

        /** 
         * Determine references per day
         * Loop through the sequence data and parse each item to get a bible reference.
         * If the reference is valid, determine the amount to read relative to the reference.
         *     If the sequence specifies to read more than the amount desired to read, split the sequence reference up into readable parts.
         *     Else add the sequence reference.
         * Else the reference is invalid. Notify the user and move on in the sequence.
         * Finally if a partial reference remains from spliting a sequence reference, add that also.
         */

        while(sequenceKey < sequence.data.length) {
            if (ref === null || ref === undefined) {
                ref = bible.parseReference(sequence.data[sequenceKey]);
                
                // account for single and multi chapter ref
                if (ref.chapter1 >= 0 && ref.verse1 === -1 && ref.verse2 === -1) {
                    ref.chapter2 = (ref.chapter2 === -1) ? ref.chapter1 : ref.chapter2;
                    var ch = (ref.chapter2 === -1) ? ref.chapter1 - 1 : ref.chapter2 -1; // 0 based index
                    ref.verse2 = bible.Books[ref.bookIndex].verses[ch];
                    ref.verse1 = 1;
                }
            }

            if (ref.isValid()) {
                var distance = (ref !== null) ? bible.distance(ref).verses : 0; // distance of reference
                var amt = (remainder > 0) ? remainder : amount; // amount to read

                // the amount to read is less than the distance of the reference
                if(distance >= amt) {
                    var verse1 = (ref.verse1 === -1) ? 1 : ref.verse1; // multiple chapter ref
                    var startRef = bible.Reference(ref.bookIndex, ref.chapter1, verse1); // start ref
                    var startRefString = startRef.toString();
                    var endRef = bible.add(startRef, amt - 1);
                    var endRefString = endRef.toString();
                    

                    var referenceString = null;
                    // Format output to shorter reference strings
                    if (startRefString !== endRefString) {
                        if (startRef.bookIndex === endRef.bookIndex) {
                            var endRefChapter = (startRef.chapter1 === endRef.chapter1) ? '' : endRef.chapter1 + ':';
                            referenceString = startRefString + '-' + endRefChapter + endRef.verse1;
                        }
                        else {
                            referenceString = startRefString + '-' + endRefString;
                        }
                    }
                    else {
                        referenceString = startRefString; // don't output same ref twice
                    }

                    dayRefs.push(referenceString);
                    refs.push(dayRefs);
                    dayRefs = [];

                    bible.add(ref, amt);

                    // add past end ref
                    // get a new ref
                    if (ref.chapter1 > ref.chapter2 || (ref.chapter1 === ref.chapter2 && ref.verse1 > ref.verse2)) {
                        console.error('Reversed: ' + ref);
                        ref = null;
                        sequenceKey++;
                    }

                    remainder = 0;
                }
                // amount to read is greater than the reference, so add it and go to the next reference for more verses
                else {
                    dayRefs.push(ref.toString());
                    remainder = amt - distance;
                    ref = null;
                    sequenceKey++;
                }
            }
            // not a valid reference, log it and move on
            else {
                if (sequence.data[sequenceKey] !== undefined) {
                    console.error('invalid reference: ' + sequence.data[sequenceKey] + ' key: ' + sequenceKey + ' sequence: ' + sequence.name);
                    refs.push('Sorry there was an error parsing ' + sequence.data[sequenceKey] + '.');
                    ref = null;
                    sequenceKey++;
                }
            }
        }

        // add any remaining partials
        if (partialReferenceString !== '') {
            refs.push(partialReferenceString);
        }

        // Add references and date to results
        for (var i = 0; i < this.duration.length; i++) {
            if (refs[i] !== undefined) {
                results.push({'day': this.duration[i], 'refs': [refs[i]]});
            }
        }

        return results;
    },

    /** not implemented yet **/
    // 'createChaptersPlan': function (sequence, amount) {
        
    //     return;
    // },

    /**
     * Loads bible reading sequence
     * @param  {string} Bible reading sequence name
     */
    'load': function () {
        'use strict';

        var sequenceName = (arguments.length >= 1) ? arguments[0] : this.sequenceName;
        var readingPlans = (arguments.length >= 2) ? arguments[1] : READING_PLANS;
        var result = null;
        if(sequenceName) {
            $.ajax({
                dataType: 'json',
                url: readingPlans + '/' + sequenceName,
                async: false,
                success: function(json) { result = json; },
                error: function(e) { throw e; }
            });
        }
        this.sequence = result;
    },

    /**
     * Sets the planner data
     * @param  {object} data Data from user
     */
    'set': function (data) {
        'use strict';

        this.sequenceName = data.sequenceName;
        this.begin = data.begin;
        this.end = data.end;
        this.skip = data.skip;
        this.amount = data.amount;
        this.type = data.type;
        this.duration = time(this.begin, this.end, this.skip);
        this.load();
    }
};

//sdg
