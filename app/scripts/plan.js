define(['bibleMath'], function () {

    'use strict';

    var data = {};

    /**
     * Get data from page elements
     * @return {array} Array of the data
     */
    function get () {
        // sequence
        data.sequenceName = $('.list-group-item.active').attr('name');

        // start
        data.start = $('#calendar-start').datepicker('getDate');

        // end
        data.end = $('#calendar-end').datepicker('getDate');

        // days to skip
        var opts = [];
        $('#skip-checkboxes input:checked').each(function (i, input) {
            opts.push(Number(input.value));
        });

        data.skip = opts;

        // type
        data.type = $('#type :radio:checked').attr('id');

        // amount
        data.amount = (data.type === 'specified') ? $('#amountSpecified :radio:checked').attr('id') : $('#amountNumber').val();



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
                return this.createVersesPlan(sequence, Number(amount));
            }
            if(type === 'specified') {
                return this.createSpecifiedPlan(sequence, amount);
            }
            // if(type === 'chapters') {
            //     return this.createChaptersPlan(sequence, Number(amount));
            // }
        },

        'createSpecifiedPlan': function (sequence, amount) {
            var items = Math.floor(sequence.data.length / this.duration.length);
            // If duration is longer than the sequence, adjust to ouput everything
                items = (items === 0) ? 1 : items;
            var mod = sequence.data.length % this.duration.length;
            var results = [];
            var sequenceKey = 0;

            // whole sequence
            if (amount === 'whole'){

                for (var i = 0; i < this.duration.length; i++) {
                    var refs = [];
                    
                    for (var x = 0; x < items; x++) {
                        if(sequenceKey < sequence.data.length) {
                            refs.push(bible.parseReference(sequence.data[sequenceKey]).toString());
                            sequenceKey++;
                            if (mod > 0) {
                                refs.push(bible.parseReference(sequence.data[sequenceKey]).toString());
                                sequenceKey++;
                                mod--;
                            }
                        }
                    };

                    results.push({'day': this.duration[i].toString(), 'refs': refs});
                    if (sequenceKey === sequence.data.length) { break; }
                }
            }

            // partial sequence
            if (amount === 'partial') {
                var length = (this.duration.length < sequence.data.length) ? this.duration.length : sequence.data.length;
                for (var i = 0; i < length; i++) {
                    results.push({'day': this.duration[i].toString(), 'refs': [bible.parseReference(sequence.data[i]).toString()]});
                }
                    
            }

            return results;
        },

        'createVersesPlan': function (sequence, amount) {

            var sequenceKey = 0;
            var ref = undefined;
            var partialReferenceString = '';
            var results = [];
            var refs = [];

            // Determine references per day

            while(sequenceKey < sequence.data.length) {
                if (ref === undefined) {
                    var ref = bible.parseReference(sequence.data[sequenceKey]);
                    console.info(ref.toString());
                }

                if (ref.isValid()) {
                    var distance = (ref !== undefined) ? bible.distance(ref).verses : undefined;
                    var tmpDistance = (partialReferenceString !== '') ? bible.distance(bible.parseReference(partialReferenceString)).verses : '';

                    // amount
                    var amt = (partialReferenceString !== '') ? amount - tmpDistance : amount;
                    if(distance >= amt) { 
                        var startRef = bible.Reference(ref.bookIndex, ref.chapter1, ((ref.verse1 === -1) ? 1 : ref.verse1)); // start ref
                        var startRefString = startRef.toString();
                        var endRef = bible.add(startRef, amt - 1).toString(); // end ref

                        var referenceString = (partialReferenceString !== '') ? partialReferenceString + '; ' + startRefString + '-' + endRef : startRefString + '-' + endRef;
                        refs.push(referenceString);
                        bible.add(ref, amt);
                        partialReferenceString = '';
                    }
                    else {
                        partialReferenceString = (partialReferenceString === '') ? ref.toString() : partialReferenceString + '; ' + ref.toString();
                        ref = undefined;
                        sequenceKey++;
                    }
                }
                else {
                    if (sequence.data[sequenceKey] !== undefined) {
                        console.error("invalid reference: " + sequence.data[sequenceKey] + " key: " + sequenceKey);
                        refs.push('Error parsing reference in sequence.');
                        ref = undefined;
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

        // not implemented yet
        // 'createChaptersPlan': function (sequence, amount) {
            
        //     return;
        // },

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
                break;
            case 'dom':
            default:
                var row = '';
                for (var i = 0; i < plan.length; i++) {
                    row = row + '<tr><td>' + plan[i].day + '</td><td>';
                    for(var n = 0; n < plan[i].refs.length; n++) {
                        row = row + plan[i].refs[n];
                        // row = row + plan[i].refs[n].toString();
                        
                        // don't put a comma after the last element
                        if( n < plan[i].refs.length - 1) {
                            row = row + ', ';
                        }
                    }

                    row = row + '</td></tr>';
                }
                return row;
            }
            
        }
    };
});

//sdg
