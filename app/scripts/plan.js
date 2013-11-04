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
            if(type === 'chapters') {
                return this.createChaptersPlan(sequence, Number(amount));
            }
        },

        'createSpecifiedPlan': function (sequence, amount) {
            var items = Math.floor(sequence.data.length / this.duration.length);
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
                for (var i = 0; i < this.duration.length; i++) {
                    results.push({'day': this.duration[i].toString(), 'refs': [bible.parseReference(sequence.data[i]).toString()]});
                }
                    
            }

            return results;
        },

        'createVersesPlan': function (sequence, amount) {
            var results = [];
            var remainder = 0;

            function vA (sequenceKey, remainder, duration) {
                var refs = [];
                var ref = bible.parseReference(sequence.data[sequenceKey]);

                if (ref != 'invalid') {
                    var tmp = bible.Reference(ref.bookIndex, ref.chapter1, ref.verse1); // start ref
                    var end = (ref.chapter2 !== -1 && ref.verse2 !== -1) ? bible.Reference(ref.bookIndex, ref.chapter2, ref.verse2) : tmp; // end ref

                    refs.push(tmp.toString()); // first string ref (from)
var e = 0;
                    if (remainder > 0) {
                        var r = bible.add(tmp, remainder);
                        refs.push('-'+r.toString()); // second string ref (to) if remaining from the previous sequence | amount
                        e++;
                    }

                    while (bible.distance(tmp, end).verses > amount) {
                        var w = bible.add(tmp, amount);
                        if(e%2 > 0) {
                            refs.push(w.toString()); // second string ref (to) if remaining not true, else first string of new ref (from), 2nd iteration second string ref (to)
                        }
                        else {   
                            refs.push('-'+w.toString());
                        }
                    }

                    // add reminder before exit
                    var d = bible.distance(tmp, end);
                    remainder = (d.hasOwnProperty('verses')) ? d.verses : 0;
                    if (remainder > 1) {
                        refs.push('-'+end.toString()); // finish the sequence (to) Amount to read is more than the total distance of the sequence item.
                    }
                    else {
                        refs.push('?'+tmp.toString()); // ?
                    }
                }
                else {
                    console.error("invalid (seq.data): " + sequence.data[sequenceKey])
                }

                results.push({'day': duration, 'refs': refs});

                return remainder;
            }
var sequenceKey = 0;
            for (var i = 0; i < this.duration.length; i++) {
                remainder = vA (sequenceKey, remainder, this.duration[i]);
                sequenceKey++;
            }

            return results;
        },

        'createChaptersPlan': function (sequence, amount) {
            var results = [];
            var remainder = 0;

            function vA (i, remainder, duration) {
                var refs = [];
                var ref = bible.parseReference(sequence.data[i]);

                if (ref != 'invalid') {
                    var tmp = bible.Reference(ref.bookIndex, ref.chapter1, ref.verse1); // start ref
                    // var end = (ref.chapter2 !== -1 && ref.verse2 !== -1) ? bible.Reference(ref.bookIndex, ref.chapter2, ref.verse2) : tmp; // end ref
                    var end = bible.Reference(ref.bookIndex, ref.chapter2, ref.verse2);
                    refs.push(tmp.toString());
                    // if (remainder > 0) {
                    //     var r = bible.add(tmp, remainder);
                    //     refs.push(r);
                    // }

                    while (bible.distance(tmp, end).verses > amount) {
                        var w = bible.add(tmp, amount);
                        refs.push(w.toString());
                    }

                    // add reminder before exit
                    var d = bible.distance(tmp, end);
                    remainder = (d.hasOwnProperty('verses')) ? d.verses : 0;
                    if (remainder > 1) {
                        refs.push(end.toString());
                    }
                    else {
                        refs.push(tmp.toString());
                    }
                }
                else {
                    console.error("invalid (seq.data): " + sequence.data[i])
                }
                results.push({'day': duration, 'refs': refs});

                return remainder;
            }

            for (var i = 0; i < this.duration.length; i++) {
                remainder = vA (i, remainder, this.duration[i]);
            }

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
