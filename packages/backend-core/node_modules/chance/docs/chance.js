//  Chance.js 1.0.16
//  http://chancejs.com
//  (c) 2013 Victor Quinn
//  Chance may be freely distributed or modified under the MIT license.

(function () {

    // Constants
    var MAX_INT = 9007199254740992;
    var MIN_INT = -MAX_INT;
    var NUMBERS = '0123456789';
    var CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
    var CHARS_UPPER = CHARS_LOWER.toUpperCase();
    var HEX_POOL  = NUMBERS + "abcdef";

    // Errors
    function UnsupportedError(message) {
        this.name = 'UnsupportedError';
        this.message = message || 'This feature is not supported on this platform';
    }

    UnsupportedError.prototype = new Error();
    UnsupportedError.prototype.constructor = UnsupportedError;

    // Cached array helpers
    var slice = Array.prototype.slice;

    // Constructor
    function Chance (seed) {
        if (!(this instanceof Chance)) {
            if (!seed) { seed = null; } // handle other non-truthy seeds, as described in issue #322
            return seed === null ? new Chance() : new Chance(seed);
        }

        // if user has provided a function, use that as the generator
        if (typeof seed === 'function') {
            this.random = seed;
            return this;
        }

        if (arguments.length) {
            // set a starting value of zero so we can add to it
            this.seed = 0;
        }

        // otherwise, leave this.seed blank so that MT will receive a blank

        for (var i = 0; i < arguments.length; i++) {
            var seedling = 0;
            if (Object.prototype.toString.call(arguments[i]) === '[object String]') {
                for (var j = 0; j < arguments[i].length; j++) {
                    // create a numeric hash for each argument, add to seedling
                    var hash = 0;
                    for (var k = 0; k < arguments[i].length; k++) {
                        hash = arguments[i].charCodeAt(k) + (hash << 6) + (hash << 16) - hash;
                    }
                    seedling += hash;
                }
            } else {
                seedling = arguments[i];
            }
            this.seed += (arguments.length - i) * seedling;
        }

        // If no generator function was provided, use our MT
        this.mt = this.mersenne_twister(this.seed);
        this.bimd5 = this.blueimp_md5();
        this.random = function () {
            return this.mt.random(this.seed);
        };

        return this;
    }

    Chance.prototype.VERSION = "1.0.16";

    // Random helper functions
    function initOptions(options, defaults) {
        options = options || {};

        if (defaults) {
            for (var i in defaults) {
                if (typeof options[i] === 'undefined') {
                    options[i] = defaults[i];
                }
            }
        }

        return options;
    }

    function range(size) {
        return Array.apply(null, Array(size)).map(function (_, i) {return i;});
    }

    function testRange(test, errorMessage) {
        if (test) {
            throw new RangeError(errorMessage);
        }
    }

    /**
     * Encode the input string with Base64.
     */
    var base64 = function() {
        throw new Error('No Base64 encoder available.');
    };

    // Select proper Base64 encoder.
    (function determineBase64Encoder() {
        if (typeof btoa === 'function') {
            base64 = btoa;
        } else if (typeof Buffer === 'function') {
            base64 = function(input) {
                return new Buffer(input).toString('base64');
            };
        }
    })();

    // -- Basics --

    /**
     *  Return a random bool, either true or false
     *
     *  @param {Object} [options={ likelihood: 50 }] alter the likelihood of
     *    receiving a true or false value back.
     *  @throws {RangeError} if the likelihood is out of bounds
     *  @returns {Bool} either true or false
     */
    Chance.prototype.bool = function (options) {
        // likelihood of success (true)
        options = initOptions(options, {likelihood : 50});

        // Note, we could get some minor perf optimizations by checking range
        // prior to initializing defaults, but that makes code a bit messier
        // and the check more complicated as we have to check existence of
        // the object then existence of the key before checking constraints.
        // Since the options initialization should be minor computationally,
        // decision made for code cleanliness intentionally. This is mentioned
        // here as it's the first occurrence, will not be mentioned again.
        testRange(
            options.likelihood < 0 || options.likelihood > 100,
            "Chance: Likelihood accepts values from 0 to 100."
        );

        return this.random() * 100 < options.likelihood;
    };

    Chance.prototype.animal = function (options){
      //returns a random animal
      options = initOptions(options);

      if(typeof options.type !== 'undefined'){
        //if user does not put in a valid animal type, user will get an error
        testRange(
           !this.get("animals")[options.type.toLowerCase()],
           "Please pick from desert, ocean, grassland, forest, zoo, pets, farm."
         );
         //if user does put in valid animal type, will return a random animal of that type
          return this.pick(this.get("animals")[options.type.toLowerCase()]);
      }
       //if user does not put in any animal type, will return a random animal regardless
      animalTypeArray = ["desert","forest","ocean","zoo","farm","pet","grassland"];
      return this.pick(this.get("animals")[this.pick(animalTypeArray)]);
    };

    /**
     *  Return a random character.
     *
     *  @param {Object} [options={}] can specify a character pool, only alpha,
     *    only symbols, and casing (lower or upper)
     *  @returns {String} a single random character
     *  @throws {RangeError} Can only specify alpha or symbols, not both
     */
    Chance.prototype.character = function (options) {
        options = initOptions(options);
        testRange(
            options.alpha && options.symbols,
            "Chance: Cannot specify both alpha and symbols."
        );

        var symbols = "!@#$%^&*()[]",
            letters, pool;

        if (options.casing === 'lower') {
            letters = CHARS_LOWER;
        } else if (options.casing === 'upper') {
            letters = CHARS_UPPER;
        } else {
            letters = CHARS_LOWER + CHARS_UPPER;
        }

        if (options.pool) {
            pool = options.pool;
        } else if (options.alpha) {
            pool = letters;
        } else if (options.symbols) {
            pool = symbols;
        } else {
            pool = letters + NUMBERS + symbols;
        }

        return pool.charAt(this.natural({max: (pool.length - 1)}));
    };

    // Note, wanted to use "float" or "double" but those are both JS reserved words.

    // Note, fixed means N OR LESS digits after the decimal. This because
    // It could be 14.9000 but in JavaScript, when this is cast as a number,
    // the trailing zeroes are dropped. Left to the consumer if trailing zeroes are
    // needed
    /**
     *  Return a random floating point number
     *
     *  @param {Object} [options={}] can specify a fixed precision, min, max
     *  @returns {Number} a single floating point number
     *  @throws {RangeError} Can only specify fixed or precision, not both. Also
     *    min cannot be greater than max
     */
    Chance.prototype.floating = function (options) {
        options = initOptions(options, {fixed : 4});
        testRange(
            options.fixed && options.precision,
            "Chance: Cannot specify both fixed and precision."
        );

        var num;
        var fixed = Math.pow(10, options.fixed);

        var max = MAX_INT / fixed;
        var min = -max;

        testRange(
            options.min && options.fixed && options.min < min,
            "Chance: Min specified is out of range with fixed. Min should be, at least, " + min
        );
        testRange(
            options.max && options.fixed && options.max > max,
            "Chance: Max specified is out of range with fixed. Max should be, at most, " + max
        );

        options = initOptions(options, { min : min, max : max });

        // Todo - Make this work!
        // options.precision = (typeof options.precision !== "undefined") ? options.precision : false;

        num = this.integer({min: options.min * fixed, max: options.max * fixed});
        var num_fixed = (num / fixed).toFixed(options.fixed);

        return parseFloat(num_fixed);
    };

    /**
     *  Return a random integer
     *
     *  NOTE the max and min are INCLUDED in the range. So:
     *  chance.integer({min: 1, max: 3});
     *  would return either 1, 2, or 3.
     *
     *  @param {Object} [options={}] can specify a min and/or max
     *  @returns {Number} a single random integer number
     *  @throws {RangeError} min cannot be greater than max
     */
    Chance.prototype.integer = function (options) {
        // 9007199254740992 (2^53) is the max integer number in JavaScript
        // See: http://vq.io/132sa2j
        options = initOptions(options, {min: MIN_INT, max: MAX_INT});
        testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");

        return Math.floor(this.random() * (options.max - options.min + 1) + options.min);
    };

    /**
     *  Return a random natural
     *
     *  NOTE the max and min are INCLUDED in the range. So:
     *  chance.natural({min: 1, max: 3});
     *  would return either 1, 2, or 3.
     *
     *  @param {Object} [options={}] can specify a min and/or maxm or a numerals count.
     *  @returns {Number} a single random integer number
     *  @throws {RangeError} min cannot be greater than max
     */
    Chance.prototype.natural = function (options) {
        options = initOptions(options, {min: 0, max: MAX_INT});
        if (typeof options.numerals === 'number'){
          testRange(options.numerals < 1, "Chance: Numerals cannot be less than one.");
          options.min = Math.pow(10, options.numerals - 1);
          options.max = Math.pow(10, options.numerals) - 1;
        }
        testRange(options.min < 0, "Chance: Min cannot be less than zero.");
        return this.integer(options);
    };

    /**
     *  Return a random hex number as string
     *
     *  NOTE the max and min are INCLUDED in the range. So:
     *  chance.hex({min: '9', max: 'B'});
     *  would return either '9', 'A' or 'B'.
     *
     *  @param {Object} [options={}] can specify a min and/or max and/or casing
     *  @returns {String} a single random string hex number
     *  @throws {RangeError} min cannot be greater than max
     */
    Chance.prototype.hex = function (options) {
        options = initOptions(options, {min: 0, max: MAX_INT, casing: 'lower'});
        testRange(options.min < 0, "Chance: Min cannot be less than zero.");
		var integer = this.natural({min: options.min, max: options.max});
		if (options.casing === 'upper') {
			return integer.toString(16).toUpperCase();
		}
		return integer.toString(16);
    };

    Chance.prototype.letter = function(options) {
        options = initOptions(options, {casing: 'lower'});
        var pool = "abcdefghijklmnopqrstuvwxyz";
        var letter = this.character({pool: pool});
        if (options.casing === 'upper') {
            letter = letter.toUpperCase();
        }
        return letter;
    }

    /**
     *  Return a random string
     *
     *  @param {Object} [options={}] can specify a length
     *  @returns {String} a string of random length
     *  @throws {RangeError} length cannot be less than zero
     */
    Chance.prototype.string = function (options) {
        options = initOptions(options, { length: this.natural({min: 5, max: 20}) });
        testRange(options.length < 0, "Chance: Length cannot be less than zero.");
        var length = options.length,
            text = this.n(this.character, length, options);

        return text.join("");
    };

    /**
     *  Return a random buffer
     *
     *  @param {Object} [options={}] can specify a length
     *  @returns {Buffer} a buffer of random length
     *  @throws {RangeError} length cannot be less than zero
     */
    Chance.prototype.buffer = function (options) {
        if (typeof Buffer === 'undefined') {
            throw new UnsupportedError('Sorry, the buffer() function is not supported on your platform');
        }
        options = initOptions(options, { length: this.natural({min: 5, max: 20}) });
        testRange(options.length < 0, "Chance: Length cannot be less than zero.");
        var length = options.length;
        var content = this.n(this.character, length, options);

        return Buffer.from(content);
    };

    // -- End Basics --

    // -- Helpers --

    Chance.prototype.capitalize = function (word) {
        return word.charAt(0).toUpperCase() + word.substr(1);
    };

    Chance.prototype.mixin = function (obj) {
        for (var func_name in obj) {
            Chance.prototype[func_name] = obj[func_name];
        }
        return this;
    };

    /**
     *  Given a function that generates something random and a number of items to generate,
     *    return an array of items where none repeat.
     *
     *  @param {Function} fn the function that generates something random
     *  @param {Number} num number of terms to generate
     *  @param {Object} options any options to pass on to the generator function
     *  @returns {Array} an array of length `num` with every item generated by `fn` and unique
     *
     *  There can be more parameters after these. All additional parameters are provided to the given function
     */
    Chance.prototype.unique = function(fn, num, options) {
        testRange(
            typeof fn !== "function",
            "Chance: The first argument must be a function."
        );

        var comparator = function(arr, val) { return arr.indexOf(val) !== -1; };

        if (options) {
            comparator = options.comparator || comparator;
        }

        var arr = [], count = 0, result, MAX_DUPLICATES = num * 50, params = slice.call(arguments, 2);

        while (arr.length < num) {
            var clonedParams = JSON.parse(JSON.stringify(params));
            result = fn.apply(this, clonedParams);
            if (!comparator(arr, result)) {
                arr.push(result);
                // reset count when unique found
                count = 0;
            }

            if (++count > MAX_DUPLICATES) {
                throw new RangeError("Chance: num is likely too large for sample set");
            }
        }
        return arr;
    };

    /**
     *  Gives an array of n random terms
     *
     *  @param {Function} fn the function that generates something random
     *  @param {Number} n number of terms to generate
     *  @returns {Array} an array of length `n` with items generated by `fn`
     *
     *  There can be more parameters after these. All additional parameters are provided to the given function
     */
    Chance.prototype.n = function(fn, n) {
        testRange(
            typeof fn !== "function",
            "Chance: The first argument must be a function."
        );

        if (typeof n === 'undefined') {
            n = 1;
        }
        var i = n, arr = [], params = slice.call(arguments, 2);

        // Providing a negative count should result in a noop.
        i = Math.max( 0, i );

        for (null; i--; null) {
            arr.push(fn.apply(this, params));
        }

        return arr;
    };

    // H/T to SO for this one: http://vq.io/OtUrZ5
    Chance.prototype.pad = function (number, width, pad) {
        // Default pad to 0 if none provided
        pad = pad || '0';
        // Convert number to a string
        number = number + '';
        return number.length >= width ? number : new Array(width - number.length + 1).join(pad) + number;
    };

    // DEPRECATED on 2015-10-01
    Chance.prototype.pick = function (arr, count) {
        if (arr.length === 0) {
            throw new RangeError("Chance: Cannot pick() from an empty array");
        }
        if (!count || count === 1) {
            return arr[this.natural({max: arr.length - 1})];
        } else {
            return this.shuffle(arr).slice(0, count);
        }
    };

    // Given an array, returns a single random element
    Chance.prototype.pickone = function (arr) {
        if (arr.length === 0) {
          throw new RangeError("Chance: Cannot pickone() from an empty array");
        }
        return arr[this.natural({max: arr.length - 1})];
    };

    // Given an array, returns a random set with 'count' elements
    Chance.prototype.pickset = function (arr, count) {
        if (count === 0) {
            return [];
        }
        if (arr.length === 0) {
            throw new RangeError("Chance: Cannot pickset() from an empty array");
        }
        if (count < 0) {
            throw new RangeError("Chance: Count must be a positive number");
        }
        if (!count || count === 1) {
            return [ this.pickone(arr) ];
        } else {
            return this.shuffle(arr).slice(0, count);
        }
    };

    Chance.prototype.shuffle = function (arr) {
        var new_array = [],
            j = 0,
            length = Number(arr.length),
            source_indexes = range(length),
            last_source_index = length - 1,
            selected_source_index;

        for (var i = 0; i < length; i++) {
            // Pick a random index from the array
            selected_source_index = this.natural({max: last_source_index});
            j = source_indexes[selected_source_index];

            // Add it to the new array
            new_array[i] = arr[j];

            // Mark the source index as used
            source_indexes[selected_source_index] = source_indexes[last_source_index];
            last_source_index -= 1;
        }

        return new_array;
    };

    // Returns a single item from an array with relative weighting of odds
    Chance.prototype.weighted = function (arr, weights, trim) {
        if (arr.length !== weights.length) {
            throw new RangeError("Chance: Length of array and weights must match");
        }

        // scan weights array and sum valid entries
        var sum = 0;
        var val;
        for (var weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
            val = weights[weightIndex];
            if (isNaN(val)) {
                throw new RangeError("Chance: All weights must be numbers");
            }

            if (val > 0) {
                sum += val;
            }
        }

        if (sum === 0) {
            throw new RangeError("Chance: No valid entries in array weights");
        }

        // select a value within range
        var selected = this.random() * sum;

        // find array entry corresponding to selected value
        var total = 0;
        var lastGoodIdx = -1;
        var chosenIdx;
        for (weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
            val = weights[weightIndex];
            total += val;
            if (val > 0) {
                if (selected <= total) {
                    chosenIdx = weightIndex;
                    break;
                }
                lastGoodIdx = weightIndex;
            }

            // handle any possible rounding error comparison to ensure something is picked
            if (weightIndex === (weights.length - 1)) {
                chosenIdx = lastGoodIdx;
            }
        }

        var chosen = arr[chosenIdx];
        trim = (typeof trim === 'undefined') ? false : trim;
        if (trim) {
            arr.splice(chosenIdx, 1);
            weights.splice(chosenIdx, 1);
        }

        return chosen;
    };

    // -- End Helpers --

    // -- Text --

    Chance.prototype.paragraph = function (options) {
        options = initOptions(options);

        var sentences = options.sentences || this.natural({min: 3, max: 7}),
            sentence_array = this.n(this.sentence, sentences);

        return sentence_array.join(' ');
    };

    // Could get smarter about this than generating random words and
    // chaining them together. Such as: http://vq.io/1a5ceOh
    Chance.prototype.sentence = function (options) {
        options = initOptions(options);

        var words = options.words || this.natural({min: 12, max: 18}),
            punctuation = options.punctuation,
            text, word_array = this.n(this.word, words);

        text = word_array.join(' ');

        // Capitalize first letter of sentence
        text = this.capitalize(text);

        // Make sure punctuation has a usable value
        if (punctuation !== false && !/^[\.\?;!:]$/.test(punctuation)) {
            punctuation = '.';
        }

        // Add punctuation mark
        if (punctuation) {
            text += punctuation;
        }

        return text;
    };

    Chance.prototype.syllable = function (options) {
        options = initOptions(options);

        var length = options.length || this.natural({min: 2, max: 3}),
            consonants = 'bcdfghjklmnprstvwz', // consonants except hard to speak ones
            vowels = 'aeiou', // vowels
            all = consonants + vowels, // all
            text = '',
            chr;

        // I'm sure there's a more elegant way to do this, but this works
        // decently well.
        for (var i = 0; i < length; i++) {
            if (i === 0) {
                // First character can be anything
                chr = this.character({pool: all});
            } else if (consonants.indexOf(chr) === -1) {
                // Last character was a vowel, now we want a consonant
                chr = this.character({pool: consonants});
            } else {
                // Last character was a consonant, now we want a vowel
                chr = this.character({pool: vowels});
            }

            text += chr;
        }

        if (options.capitalize) {
            text = this.capitalize(text);
        }

        return text;
    };

    Chance.prototype.word = function (options) {
        options = initOptions(options);

        testRange(
            options.syllables && options.length,
            "Chance: Cannot specify both syllables AND length."
        );

        var syllables = options.syllables || this.natural({min: 1, max: 3}),
            text = '';

        if (options.length) {
            // Either bound word by length
            do {
                text += this.syllable();
            } while (text.length < options.length);
            text = text.substring(0, options.length);
        } else {
            // Or by number of syllables
            for (var i = 0; i < syllables; i++) {
                text += this.syllable();
            }
        }

        if (options.capitalize) {
            text = this.capitalize(text);
        }

        return text;
    };

    // -- End Text --

    // -- Person --

    Chance.prototype.age = function (options) {
        options = initOptions(options);
        var ageRange;

        switch (options.type) {
            case 'child':
                ageRange = {min: 0, max: 12};
                break;
            case 'teen':
                ageRange = {min: 13, max: 19};
                break;
            case 'adult':
                ageRange = {min: 18, max: 65};
                break;
            case 'senior':
                ageRange = {min: 65, max: 100};
                break;
            case 'all':
                ageRange = {min: 0, max: 100};
                break;
            default:
                ageRange = {min: 18, max: 65};
                break;
        }

        return this.natural(ageRange);
    };

    Chance.prototype.birthday = function (options) {
        var age = this.age(options);
        var currentYear = new Date().getFullYear();

        if (options && options.type) {
            var min = new Date();
            var max = new Date();
            min.setFullYear(currentYear - age - 1);
            max.setFullYear(currentYear - age);

            options = initOptions(options, {
                min: min,
                max: max
            });
        } else {
            options = initOptions(options, {
                year: currentYear - age
            });
        }

        return this.date(options);
    };

    // CPF; ID to identify taxpayers in Brazil
    Chance.prototype.cpf = function (options) {
        options = initOptions(options, {
            formatted: true
        });

        var n = this.n(this.natural, 9, { max: 9 });
        var d1 = n[8]*2+n[7]*3+n[6]*4+n[5]*5+n[4]*6+n[3]*7+n[2]*8+n[1]*9+n[0]*10;
        d1 = 11 - (d1 % 11);
        if (d1>=10) {
            d1 = 0;
        }
        var d2 = d1*2+n[8]*3+n[7]*4+n[6]*5+n[5]*6+n[4]*7+n[3]*8+n[2]*9+n[1]*10+n[0]*11;
        d2 = 11 - (d2 % 11);
        if (d2>=10) {
            d2 = 0;
        }
        var cpf = ''+n[0]+n[1]+n[2]+'.'+n[3]+n[4]+n[5]+'.'+n[6]+n[7]+n[8]+'-'+d1+d2;
        return options.formatted ? cpf : cpf.replace(/\D/g,'');
    };

    // CNPJ: ID to identify companies in Brazil
    Chance.prototype.cnpj = function (options) {
        options = initOptions(options, {
            formatted: true
        });

        var n = this.n(this.natural, 12, { max: 12 });
        var d1 = n[11]*2+n[10]*3+n[9]*4+n[8]*5+n[7]*6+n[6]*7+n[5]*8+n[4]*9+n[3]*2+n[2]*3+n[1]*4+n[0]*5;
        d1 = 11 - (d1 % 11);
        if (d1<2) {
            d1 = 0;
        }
        var d2 = d1*2+n[11]*3+n[10]*4+n[9]*5+n[8]*6+n[7]*7+n[6]*8+n[5]*9+n[4]*2+n[3]*3+n[2]*4+n[1]*5+n[0]*6;
        d2 = 11 - (d2 % 11);
        if (d2<2) {
            d2 = 0;
        }
        var cnpj = ''+n[0]+n[1]+'.'+n[2]+n[3]+n[4]+'.'+n[5]+n[6]+n[7]+'/'+n[8]+n[9]+n[10]+n[11]+'-'+d1+d2;
        return options.formatted ? cnpj : cnpj.replace(/\D/g,'');
    };

    Chance.prototype.first = function (options) {
        options = initOptions(options, {gender: this.gender(), nationality: 'en'});
        return this.pick(this.get("firstNames")[options.gender.toLowerCase()][options.nationality.toLowerCase()]);
    };

    Chance.prototype.profession = function (options) {
        options = initOptions(options);
        if(options.rank){
            return this.pick(['Apprentice ', 'Junior ', 'Senior ', 'Lead ']) + this.pick(this.get("profession"));
        } else{
            return this.pick(this.get("profession"));
        }
    };

    Chance.prototype.company = function (){
        return this.pick(this.get("company"));
    };

    Chance.prototype.gender = function (options) {
        options = initOptions(options, {extraGenders: []});
        return this.pick(['Male', 'Female'].concat(options.extraGenders));
    };

    Chance.prototype.last = function (options) {
      options = initOptions(options, {nationality: '*'});
      if (options.nationality === "*") {
        var allLastNames = []
        var lastNames = this.get("lastNames")
        Object.keys(lastNames).forEach(function(key, i){
          allLastNames = allLastNames.concat(lastNames[key])
        })
        return this.pick(allLastNames)
      }
      else {
        return this.pick(this.get("lastNames")[options.nationality.toLowerCase()]);
      }

    };

    Chance.prototype.israelId=function(){
        var x=this.string({pool: '0123456789',length:8});
        var y=0;
        for (var i=0;i<x.length;i++){
            var thisDigit=  x[i] *  (i/2===parseInt(i/2) ? 1 : 2);
            thisDigit=this.pad(thisDigit,2).toString();
            thisDigit=parseInt(thisDigit[0]) + parseInt(thisDigit[1]);
            y=y+thisDigit;
        }
        x=x+(10-parseInt(y.toString().slice(-1))).toString().slice(-1);
        return x;
    };

    Chance.prototype.mrz = function (options) {
        var checkDigit = function (input) {
            var alpha = "<ABCDEFGHIJKLMNOPQRSTUVWXYXZ".split(''),
                multipliers = [ 7, 3, 1 ],
                runningTotal = 0;

            if (typeof input !== 'string') {
                input = input.toString();
            }

            input.split('').forEach(function(character, idx) {
                var pos = alpha.indexOf(character);

                if(pos !== -1) {
                    character = pos === 0 ? 0 : pos + 9;
                } else {
                    character = parseInt(character, 10);
                }
                character *= multipliers[idx % multipliers.length];
                runningTotal += character;
            });
            return runningTotal % 10;
        };
        var generate = function (opts) {
            var pad = function (length) {
                return new Array(length + 1).join('<');
            };
            var number = [ 'P<',
                           opts.issuer,
                           opts.last.toUpperCase(),
                           '<<',
                           opts.first.toUpperCase(),
                           pad(39 - (opts.last.length + opts.first.length + 2)),
                           opts.passportNumber,
                           checkDigit(opts.passportNumber),
                           opts.nationality,
                           opts.dob,
                           checkDigit(opts.dob),
                           opts.gender,
                           opts.expiry,
                           checkDigit(opts.expiry),
                           pad(14),
                           checkDigit(pad(14)) ].join('');

            return number +
                (checkDigit(number.substr(44, 10) +
                            number.substr(57, 7) +
                            number.substr(65, 7)));
        };

        var that = this;

        options = initOptions(options, {
            first: this.first(),
            last: this.last(),
            passportNumber: this.integer({min: 100000000, max: 999999999}),
            dob: (function () {
                var date = that.birthday({type: 'adult'});
                return [date.getFullYear().toString().substr(2),
                        that.pad(date.getMonth() + 1, 2),
                        that.pad(date.getDate(), 2)].join('');
            }()),
            expiry: (function () {
                var date = new Date();
                return [(date.getFullYear() + 5).toString().substr(2),
                        that.pad(date.getMonth() + 1, 2),
                        that.pad(date.getDate(), 2)].join('');
            }()),
            gender: this.gender() === 'Female' ? 'F': 'M',
            issuer: 'GBR',
            nationality: 'GBR'
        });
        return generate (options);
    };

    Chance.prototype.name = function (options) {
        options = initOptions(options);

        var first = this.first(options),
            last = this.last(options),
            name;

        if (options.middle) {
            name = first + ' ' + this.first(options) + ' ' + last;
        } else if (options.middle_initial) {
            name = first + ' ' + this.character({alpha: true, casing: 'upper'}) + '. ' + last;
        } else {
            name = first + ' ' + last;
        }

        if (options.prefix) {
            name = this.prefix(options) + ' ' + name;
        }

        if (options.suffix) {
            name = name + ' ' + this.suffix(options);
        }

        return name;
    };

    // Return the list of available name prefixes based on supplied gender.
    // @todo introduce internationalization
    Chance.prototype.name_prefixes = function (gender) {
        gender = gender || "all";
        gender = gender.toLowerCase();

        var prefixes = [
            { name: 'Doctor', abbreviation: 'Dr.' }
        ];

        if (gender === "male" || gender === "all") {
            prefixes.push({ name: 'Mister', abbreviation: 'Mr.' });
        }

        if (gender === "female" || gender === "all") {
            prefixes.push({ name: 'Miss', abbreviation: 'Miss' });
            prefixes.push({ name: 'Misses', abbreviation: 'Mrs.' });
        }

        return prefixes;
    };

    // Alias for name_prefix
    Chance.prototype.prefix = function (options) {
        return this.name_prefix(options);
    };

    Chance.prototype.name_prefix = function (options) {
        options = initOptions(options, { gender: "all" });
        return options.full ?
            this.pick(this.name_prefixes(options.gender)).name :
            this.pick(this.name_prefixes(options.gender)).abbreviation;
    };
    //Hungarian ID number
    Chance.prototype.HIDN= function(){
     //Hungarian ID nuber structure: XXXXXXYY (X=number,Y=Capital Latin letter)
      var idn_pool="0123456789";
      var idn_chrs="ABCDEFGHIJKLMNOPQRSTUVWXYXZ";
      var idn="";
        idn+=this.string({pool:idn_pool,length:6});
        idn+=this.string({pool:idn_chrs,length:2});
        return idn;
    };


    Chance.prototype.ssn = function (options) {
        options = initOptions(options, {ssnFour: false, dashes: true});
        var ssn_pool = "1234567890",
            ssn,
            dash = options.dashes ? '-' : '';

        if(!options.ssnFour) {
            ssn = this.string({pool: ssn_pool, length: 3}) + dash +
            this.string({pool: ssn_pool, length: 2}) + dash +
            this.string({pool: ssn_pool, length: 4});
        } else {
            ssn = this.string({pool: ssn_pool, length: 4});
        }
        return ssn;
    };

    // Aadhar is similar to ssn, used in India to uniquely identify a person
    Chance.prototype.aadhar = function (options) {
        options = initOptions(options, {onlyLastFour: false, separatedByWhiteSpace: true});
        var aadhar_pool = "1234567890",
            aadhar,
            whiteSpace = options.separatedByWhiteSpace ? ' ' : '';

        if(!options.onlyLastFour) {
            aadhar = this.string({pool: aadhar_pool, length: 4}) + whiteSpace +
            this.string({pool: aadhar_pool, length: 4}) + whiteSpace +
            this.string({pool: aadhar_pool, length: 4});
        } else {
            aadhar = this.string({pool: aadhar_pool, length: 4});
        }
        return aadhar;
    };

    // Return the list of available name suffixes
    // @todo introduce internationalization
    Chance.prototype.name_suffixes = function () {
        var suffixes = [
            { name: 'Doctor of Osteopathic Medicine', abbreviation: 'D.O.' },
            { name: 'Doctor of Philosophy', abbreviation: 'Ph.D.' },
            { name: 'Esquire', abbreviation: 'Esq.' },
            { name: 'Junior', abbreviation: 'Jr.' },
            { name: 'Juris Doctor', abbreviation: 'J.D.' },
            { name: 'Master of Arts', abbreviation: 'M.A.' },
            { name: 'Master of Business Administration', abbreviation: 'M.B.A.' },
            { name: 'Master of Science', abbreviation: 'M.S.' },
            { name: 'Medical Doctor', abbreviation: 'M.D.' },
            { name: 'Senior', abbreviation: 'Sr.' },
            { name: 'The Third', abbreviation: 'III' },
            { name: 'The Fourth', abbreviation: 'IV' },
            { name: 'Bachelor of Engineering', abbreviation: 'B.E' },
            { name: 'Bachelor of Technology', abbreviation: 'B.TECH' }
        ];
        return suffixes;
    };

    // Alias for name_suffix
    Chance.prototype.suffix = function (options) {
        return this.name_suffix(options);
    };

    Chance.prototype.name_suffix = function (options) {
        options = initOptions(options);
        return options.full ?
            this.pick(this.name_suffixes()).name :
            this.pick(this.name_suffixes()).abbreviation;
    };

    Chance.prototype.nationalities = function () {
        return this.get("nationalities");
    };

    // Generate random nationality based on json list
    Chance.prototype.nationality = function () {
        var nationality = this.pick(this.nationalities());
        return nationality.name;
    };

    // -- End Person --

    // -- Mobile --
    // Android GCM Registration ID
    Chance.prototype.android_id = function () {
        return "APA91" + this.string({ pool: "0123456789abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_", length: 178 });
    };

    // Apple Push Token
    Chance.prototype.apple_token = function () {
        return this.string({ pool: "abcdef1234567890", length: 64 });
    };

    // Windows Phone 8 ANID2
    Chance.prototype.wp8_anid2 = function () {
        return base64( this.hash( { length : 32 } ) );
    };

    // Windows Phone 7 ANID
    Chance.prototype.wp7_anid = function () {
        return 'A=' + this.guid().replace(/-/g, '').toUpperCase() + '&E=' + this.hash({ length:3 }) + '&W=' + this.integer({ min:0, max:9 });
    };

    // BlackBerry Device PIN
    Chance.prototype.bb_pin = function () {
        return this.hash({ length: 8 });
    };

    // -- End Mobile --

    // -- Web --
    Chance.prototype.avatar = function (options) {
        var url = null;
        var URL_BASE = '//www.gravatar.com/avatar/';
        var PROTOCOLS = {
            http: 'http',
            https: 'https'
        };
        var FILE_TYPES = {
            bmp: 'bmp',
            gif: 'gif',
            jpg: 'jpg',
            png: 'png'
        };
        var FALLBACKS = {
            '404': '404', // Return 404 if not found
            mm: 'mm', // Mystery man
            identicon: 'identicon', // Geometric pattern based on hash
            monsterid: 'monsterid', // A generated monster icon
            wavatar: 'wavatar', // A generated face
            retro: 'retro', // 8-bit icon
            blank: 'blank' // A transparent png
        };
        var RATINGS = {
            g: 'g',
            pg: 'pg',
            r: 'r',
            x: 'x'
        };
        var opts = {
            protocol: null,
            email: null,
            fileExtension: null,
            size: null,
            fallback: null,
            rating: null
        };

        if (!options) {
            // Set to a random email
            opts.email = this.email();
            options = {};
        }
        else if (typeof options === 'string') {
            opts.email = options;
            options = {};
        }
        else if (typeof options !== 'object') {
            return null;
        }
        else if (options.constructor === 'Array') {
            return null;
        }

        opts = initOptions(options, opts);

        if (!opts.email) {
            // Set to a random email
            opts.email = this.email();
        }

        // Safe checking for params
        opts.protocol = PROTOCOLS[opts.protocol] ? opts.protocol + ':' : '';
        opts.size = parseInt(opts.size, 0) ? opts.size : '';
        opts.rating = RATINGS[opts.rating] ? opts.rating : '';
        opts.fallback = FALLBACKS[opts.fallback] ? opts.fallback : '';
        opts.fileExtension = FILE_TYPES[opts.fileExtension] ? opts.fileExtension : '';

        url =
            opts.protocol +
            URL_BASE +
            this.bimd5.md5(opts.email) +
            (opts.fileExtension ? '.' + opts.fileExtension : '') +
            (opts.size || opts.rating || opts.fallback ? '?' : '') +
            (opts.size ? '&s=' + opts.size.toString() : '') +
            (opts.rating ? '&r=' + opts.rating : '') +
            (opts.fallback ? '&d=' + opts.fallback : '')
            ;

        return url;
    };

    /**
     * #Description:
     * ===============================================
     * Generate random color value base on color type:
     * -> hex
     * -> rgb
     * -> rgba
     * -> 0x
     * -> named color
     *
     * #Examples:
     * ===============================================
     * * Geerate random hex color
     * chance.color() => '#79c157' / 'rgb(110,52,164)' / '0x67ae0b' / '#e2e2e2' / '#29CFA7'
     *
     * * Generate Hex based color value
     * chance.color({format: 'hex'})    => '#d67118'
     *
     * * Generate simple rgb value
     * chance.color({format: 'rgb'})    => 'rgb(110,52,164)'
     *
     * * Generate Ox based color value
     * chance.color({format: '0x'})     => '0x67ae0b'
     *
     * * Generate graiscale based value
     * chance.color({grayscale: true})  => '#e2e2e2'
     *
     * * Return valide color name
     * chance.color({format: 'name'})   => 'red'
     *
     * * Make color uppercase
     * chance.color({casing: 'upper'})  => '#29CFA7'
     *
     * * Min Max values for RGBA
     * var light_red = chance.color({format: 'hex', min_red: 200, max_red: 255, max_green: 0, max_blue: 0, min_alpha: .2, max_alpha: .3});
     *
     * @param  [object] options
     * @return [string] color value
     */
    Chance.prototype.color = function (options) {
        function gray(value, delimiter) {
            return [value, value, value].join(delimiter || '');
        }

        function rgb(hasAlpha) {
            var rgbValue     = (hasAlpha)    ? 'rgba' : 'rgb';
            var alphaChannel = (hasAlpha)    ? (',' + this.floating({min:min_alpha, max:max_alpha})) : "";
            var colorValue   = (isGrayscale) ? (gray(this.natural({min: min_rgb, max: max_rgb}), ',')) : (this.natural({min: min_green, max: max_green}) + ',' + this.natural({min: min_blue, max: max_blue}) + ',' + this.natural({max: 255}));
            return rgbValue + '(' + colorValue + alphaChannel + ')';
        }

        function hex(start, end, withHash) {
            var symbol = (withHash) ? "#" : "";
            var hexstring = "";

            if (isGrayscale) {
                hexstring = gray(this.pad(this.hex({min: min_rgb, max: max_rgb}), 2));
                if (options.format === "shorthex") {
                    hexstring = gray(this.hex({min: 0, max: 15}));
                }
            }
            else {
                if (options.format === "shorthex") {
                    hexstring = this.pad(this.hex({min: Math.floor(min_red / 16), max: Math.floor(max_red / 16)}), 1) + this.pad(this.hex({min: Math.floor(min_green / 16), max: Math.floor(max_green / 16)}), 1) + this.pad(this.hex({min: Math.floor(min_blue / 16), max: Math.floor(max_blue / 16)}), 1);
                }
                else if (min_red !== undefined || max_red !== undefined || min_green !== undefined || max_green !== undefined || min_blue !== undefined || max_blue !== undefined) {
                    hexstring = this.pad(this.hex({min: min_red, max: max_red}), 2) + this.pad(this.hex({min: min_green, max: max_green}), 2) + this.pad(this.hex({min: min_blue, max: max_blue}), 2);
                }
                else {
                    hexstring = this.pad(this.hex({min: min_rgb, max: max_rgb}), 2) + this.pad(this.hex({min: min_rgb, max: max_rgb}), 2) + this.pad(this.hex({min: min_rgb, max: max_rgb}), 2);
                }
            }

            return symbol + hexstring;
        }

        options = initOptions(options, {
            format: this.pick(['hex', 'shorthex', 'rgb', 'rgba', '0x', 'name']),
            grayscale: false,
            casing: 'lower',
            min: 0,
            max: 255,
            min_red: undefined,
            max_red: undefined,
            min_green: undefined,
            max_green: undefined,
            min_blue: undefined,
            max_blue: undefined,
            min_alpha: 0,
            max_alpha: 1
        });

        var isGrayscale = options.grayscale;
        var min_rgb = options.min;
        var max_rgb = options.max;
        var min_red = options.min_red;
        var max_red = options.max_red;
        var min_green = options.min_green;
        var max_green = options.max_green;
        var min_blue = options.min_blue;
        var max_blue = options.max_blue;
        var min_alpha = options.min_alpha;
        var max_alpha = options.max_alpha;
        if (options.min_red === undefined) { min_red = min_rgb; }
        if (options.max_red === undefined) { max_red = max_rgb; }
        if (options.min_green === undefined) { min_green = min_rgb; }
        if (options.max_green === undefined) { max_green = max_rgb; }
        if (options.min_blue === undefined) { min_blue = min_rgb; }
        if (options.max_blue === undefined) { max_blue = max_rgb; }
        if (options.min_alpha === undefined) { min_alpha = 0; }
        if (options.max_alpha === undefined) { max_alpha = 1; }
        if (isGrayscale && min_rgb === 0 && max_rgb === 255 && min_red !== undefined && max_red !== undefined) {
            min_rgb = ((min_red + min_green + min_blue) / 3);
            max_rgb = ((max_red + max_green + max_blue) / 3);
        }
        var colorValue;

        if (options.format === 'hex') {
            colorValue = hex.call(this, 2, 6, true);
        }
        else if (options.format === 'shorthex') {
            colorValue = hex.call(this, 1, 3, true);
        }
        else if (options.format === 'rgb') {
            colorValue = rgb.call(this, false);
        }
        else if (options.format === 'rgba') {
            colorValue = rgb.call(this, true);
        }
        else if (options.format === '0x') {
            colorValue = '0x' + hex.call(this, 2, 6);
        }
        else if(options.format === 'name') {
            return this.pick(this.get("colorNames"));
        }
        else {
            throw new RangeError('Invalid format provided. Please provide one of "hex", "shorthex", "rgb", "rgba", "0x" or "name".');
        }

        if (options.casing === 'upper' ) {
            colorValue = colorValue.toUpperCase();
        }

        return colorValue;
    };

    Chance.prototype.domain = function (options) {
        options = initOptions(options);
        return this.word() + '.' + (options.tld || this.tld());
    };

    Chance.prototype.email = function (options) {
        options = initOptions(options);
        return this.word({length: options.length}) + '@' + (options.domain || this.domain());
    };

    /**
     * #Description:
     * ===============================================
     * Generate a random Facebook id, aka fbid.
     *
     * NOTE: At the moment (Sep 2017), Facebook ids are
     * "numeric strings" of length 16.
     * However, Facebook Graph API documentation states that
     * "it is extremely likely to change over time".
     * @see https://developers.facebook.com/docs/graph-api/overview/
     *
     * #Examples:
     * ===============================================
     * chance.fbid() => '1000035231661304'
     *
     * @return [string] facebook id
     */
    Chance.prototype.fbid = function () {
        return '10000' + this.string({pool: "1234567890", length: 11});
    };

    Chance.prototype.google_analytics = function () {
        var account = this.pad(this.natural({max: 999999}), 6);
        var property = this.pad(this.natural({max: 99}), 2);

        return 'UA-' + account + '-' + property;
    };

    Chance.prototype.hashtag = function () {
        return '#' + this.word();
    };

    Chance.prototype.ip = function () {
        // Todo: This could return some reserved IPs. See http://vq.io/137dgYy
        // this should probably be updated to account for that rare as it may be
        return this.natural({min: 1, max: 254}) + '.' +
               this.natural({max: 255}) + '.' +
               this.natural({max: 255}) + '.' +
               this.natural({min: 1, max: 254});
    };

    Chance.prototype.ipv6 = function () {
        var ip_addr = this.n(this.hash, 8, {length: 4});

        return ip_addr.join(":");
    };

    Chance.prototype.klout = function () {
        return this.natural({min: 1, max: 99});
    };

    Chance.prototype.semver = function (options) {
        options = initOptions(options, { include_prerelease: true });

        var range = this.pickone(["^", "~", "<", ">", "<=", ">=", "="]);
        if (options.range) {
            range = options.range;
        }

        var prerelease = "";
        if (options.include_prerelease) {
            prerelease = this.weighted(["", "-dev", "-beta", "-alpha"], [50, 10, 5, 1]);
        }
        return range + this.rpg('3d10').join('.') + prerelease;
    };

    Chance.prototype.tlds = function () {
        return ['com', 'org', 'edu', 'gov', 'co.uk', 'net', 'io', 'ac', 'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'an', 'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bm', 'bn', 'bo', 'bq', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cu', 'cv', 'cw', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'eu', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st', 'su', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tp', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'uk', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye', 'yt', 'za', 'zm', 'zw'];
    };

    Chance.prototype.tld = function () {
        return this.pick(this.tlds());
    };

    Chance.prototype.twitter = function () {
        return '@' + this.word();
    };

    Chance.prototype.url = function (options) {
        options = initOptions(options, { protocol: "http", domain: this.domain(options), domain_prefix: "", path: this.word(), extensions: []});

        var extension = options.extensions.length > 0 ? "." + this.pick(options.extensions) : "";
        var domain = options.domain_prefix ? options.domain_prefix + "." + options.domain : options.domain;

        return options.protocol + "://" + domain + "/" + options.path + extension;
    };

    Chance.prototype.port = function() {
        return this.integer({min: 0, max: 65535});
    };

    Chance.prototype.locale = function (options) {
        options = initOptions(options);
        if (options.region){
          return this.pick(this.get("locale_regions"));
        } else {
          return this.pick(this.get("locale_languages"));
        }
    };

    Chance.prototype.locales = function (options) {
      options = initOptions(options);
      if (options.region){
        return this.get("locale_regions");
      } else {
        return this.get("locale_languages");
      }
    };

    Chance.prototype.loremPicsum = function (options) {
        options = initOptions(options, { width: 500, height: 500, greyscale: false, blurred: false });

        var greyscale = options.greyscale ? 'g/' : '';
        var query = options.blurred ? '/?blur' : '/?random';

        return 'https://picsum.photos/' + greyscale + options.width + '/' + options.height + query;
    }

    // -- End Web --

    // -- Location --

    Chance.prototype.address = function (options) {
        options = initOptions(options);
        return this.natural({min: 5, max: 2000}) + ' ' + this.street(options);
    };

    Chance.prototype.altitude = function (options) {
        options = initOptions(options, {fixed: 5, min: 0, max: 8848});
        return this.floating({
            min: options.min,
            max: options.max,
            fixed: options.fixed
        });
    };

    Chance.prototype.areacode = function (options) {
        options = initOptions(options, {parens : true});
        // Don't want area codes to start with 1, or have a 9 as the second digit
        var areacode = this.natural({min: 2, max: 9}).toString() +
                this.natural({min: 0, max: 8}).toString() +
                this.natural({min: 0, max: 9}).toString();

        return options.parens ? '(' + areacode + ')' : areacode;
    };

    Chance.prototype.city = function () {
        return this.capitalize(this.word({syllables: 3}));
    };

    Chance.prototype.coordinates = function (options) {
        return this.latitude(options) + ', ' + this.longitude(options);
    };

    Chance.prototype.countries = function () {
        return this.get("countries");
    };

    Chance.prototype.country = function (options) {
        options = initOptions(options);
        var country = this.pick(this.countries());
        return options.raw ? country : options.full ? country.name : country.abbreviation;
    };

    Chance.prototype.depth = function (options) {
        options = initOptions(options, {fixed: 5, min: -10994, max: 0});
        return this.floating({
            min: options.min,
            max: options.max,
            fixed: options.fixed
        });
    };

    Chance.prototype.geohash = function (options) {
        options = initOptions(options, { length: 7 });
        return this.string({ length: options.length, pool: '0123456789bcdefghjkmnpqrstuvwxyz' });
    };

    Chance.prototype.geojson = function (options) {
        return this.latitude(options) + ', ' + this.longitude(options) + ', ' + this.altitude(options);
    };

    Chance.prototype.latitude = function (options) {
        options = initOptions(options, {fixed: 5, min: -90, max: 90});
        return this.floating({min: options.min, max: options.max, fixed: options.fixed});
    };

    Chance.prototype.longitude = function (options) {
        options = initOptions(options, {fixed: 5, min: -180, max: 180});
        return this.floating({min: options.min, max: options.max, fixed: options.fixed});
    };

    Chance.prototype.phone = function (options) {
        var self = this,
            numPick,
            ukNum = function (parts) {
                var section = [];
                //fills the section part of the phone number with random numbers.
                parts.sections.forEach(function(n) {
                    section.push(self.string({ pool: '0123456789', length: n}));
                });
                return parts.area + section.join(' ');
            };
        options = initOptions(options, {
            formatted: true,
            country: 'us',
            mobile: false
        });
        if (!options.formatted) {
            options.parens = false;
        }
        var phone;
        switch (options.country) {
            case 'fr':
                if (!options.mobile) {
                    numPick = this.pick([
                        // Valid zone and département codes.
                        '01' + this.pick(['30', '34', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '53', '55', '56', '58', '60', '64', '69', '70', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83']) + self.string({ pool: '0123456789', length: 6}),
                        '02' + this.pick(['14', '18', '22', '23', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '40', '41', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '56', '57', '61', '62', '69', '72', '76', '77', '78', '85', '90', '96', '97', '98', '99']) + self.string({ pool: '0123456789', length: 6}),
                        '03' + this.pick(['10', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '39', '44', '45', '51', '52', '54', '55', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90']) + self.string({ pool: '0123456789', length: 6}),
                        '04' + this.pick(['11', '13', '15', '20', '22', '26', '27', '30', '32', '34', '37', '42', '43', '44', '50', '56', '57', '63', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '88', '89', '90', '91', '92', '93', '94', '95', '97', '98']) + self.string({ pool: '0123456789', length: 6}),
                        '05' + this.pick(['08', '16', '17', '19', '24', '31', '32', '33', '34', '35', '40', '45', '46', '47', '49', '53', '55', '56', '57', '58', '59', '61', '62', '63', '64', '65', '67', '79', '81', '82', '86', '87', '90', '94']) + self.string({ pool: '0123456789', length: 6}),
                        '09' + self.string({ pool: '0123456789', length: 8}),
                    ]);
                    phone = options.formatted ? numPick.match(/../g).join(' ') : numPick;
                } else {
                    numPick = this.pick(['06', '07']) + self.string({ pool: '0123456789', length: 8});
                    phone = options.formatted ? numPick.match(/../g).join(' ') : numPick;
                }
                break;
            case 'uk':
                if (!options.mobile) {
                    numPick = this.pick([
                        //valid area codes of major cities/counties followed by random numbers in required format.

                        { area: '01' + this.character({ pool: '234569' }) + '1 ', sections: [3,4] },
                        { area: '020 ' + this.character({ pool: '378' }), sections: [3,4] },
                        { area: '023 ' + this.character({ pool: '89' }), sections: [3,4] },
                        { area: '024 7', sections: [3,4] },
                        { area: '028 ' + this.pick(['25','28','37','71','82','90','92','95']), sections: [2,4] },
                        { area: '012' + this.pick(['04','08','54','76','97','98']) + ' ', sections: [6] },
                        { area: '013' + this.pick(['63','64','84','86']) + ' ', sections: [6] },
                        { area: '014' + this.pick(['04','20','60','61','80','88']) + ' ', sections: [6] },
                        { area: '015' + this.pick(['24','27','62','66']) + ' ', sections: [6] },
                        { area: '016' + this.pick(['06','29','35','47','59','95']) + ' ', sections: [6] },
                        { area: '017' + this.pick(['26','44','50','68']) + ' ', sections: [6] },
                        { area: '018' + this.pick(['27','37','84','97']) + ' ', sections: [6] },
                        { area: '019' + this.pick(['00','05','35','46','49','63','95']) + ' ', sections: [6] }
                    ]);
                    phone = options.formatted ? ukNum(numPick) : ukNum(numPick).replace(' ', '', 'g');
                } else {
                    numPick = this.pick([
                        { area: '07' + this.pick(['4','5','7','8','9']), sections: [2,6] },
                        { area: '07624 ', sections: [6] }
                    ]);
                    phone = options.formatted ? ukNum(numPick) : ukNum(numPick).replace(' ', '');
                }
                break;
            case 'za':
                if (!options.mobile) {
                    numPick = this.pick([
                       '01' + this.pick(['0', '1', '2', '3', '4', '5', '6', '7', '8']) + self.string({ pool: '0123456789', length: 7}),
                       '02' + this.pick(['1', '2', '3', '4', '7', '8']) + self.string({ pool: '0123456789', length: 7}),
                       '03' + this.pick(['1', '2', '3', '5', '6', '9']) + self.string({ pool: '0123456789', length: 7}),
                       '04' + this.pick(['1', '2', '3', '4', '5','6','7', '8','9']) + self.string({ pool: '0123456789', length: 7}),
                       '05' + this.pick(['1', '3', '4', '6', '7', '8']) + self.string({ pool: '0123456789', length: 7}),
                    ]);
                    phone = options.formatted || numPick;
                } else {
                    numPick = this.pick([
                        '060' + this.pick(['3','4','5','6','7','8','9']) + self.string({ pool: '0123456789', length: 6}),
                        '061' + this.pick(['0','1','2','3','4','5','8']) + self.string({ pool: '0123456789', length: 6}),
                        '06'  + self.string({ pool: '0123456789', length: 7}),
                        '071' + this.pick(['0','1','2','3','4','5','6','7','8','9']) + self.string({ pool: '0123456789', length: 6}),
                        '07'  + this.pick(['2','3','4','6','7','8','9']) + self.string({ pool: '0123456789', length: 7}),
                        '08'  + this.pick(['0','1','2','3','4','5']) + self.string({ pool: '0123456789', length: 7}),
                    ]);
                    phone = options.formatted || numPick;
                }
                break;
            case 'us':
                var areacode = this.areacode(options).toString();
                var exchange = this.natural({ min: 2, max: 9 }).toString() +
                    this.natural({ min: 0, max: 9 }).toString() +
                    this.natural({ min: 0, max: 9 }).toString();
                var subscriber = this.natural({ min: 1000, max: 9999 }).toString(); // this could be random [0-9]{4}
                phone = options.formatted ? areacode + ' ' + exchange + '-' + subscriber : areacode + exchange + subscriber;
                break;
            case 'br':
                var areaCode = this.pick(["11", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "24", "27", "28", "31", "32", "33", "34", "35", "37", "38", "41", "42", "43", "44", "45", "46", "47", "48", "49", "51", "53", "54", "55", "61", "62", "63", "64", "65", "66", "67", "68", "69", "71", "73", "74", "75", "77", "79", "81", "82", "83", "84", "85", "86", "87", "88", "89", "91", "92", "93", "94", "95", "96", "97", "98", "99"]);
                var prefix;
                if (options.mobile) {
                    // Brasilian official reference (mobile): http://www.anatel.gov.br/setorregulado/plano-de-numeracao-brasileiro?id=330
                    prefix = '9' + self.string({ pool: '0123456789', length: 4});
                } else {
                    // Brasilian official reference: http://www.anatel.gov.br/setorregulado/plano-de-numeracao-brasileiro?id=331
                    prefix = this.natural({ min: 2000, max: 5999 }).toString();
                }
                var mcdu = self.string({ pool: '0123456789', length: 4});
                phone = options.formatted ? '(' + areaCode + ') ' + prefix + '-' + mcdu : areaCode + prefix + mcdu;
                break;
        }
        return phone;
    };

    Chance.prototype.postal = function () {
        // Postal District
        var pd = this.character({pool: "XVTSRPNKLMHJGECBA"});
        // Forward Sortation Area (FSA)
        var fsa = pd + this.natural({max: 9}) + this.character({alpha: true, casing: "upper"});
        // Local Delivery Unut (LDU)
        var ldu = this.natural({max: 9}) + this.character({alpha: true, casing: "upper"}) + this.natural({max: 9});

        return fsa + " " + ldu;
    };

    Chance.prototype.counties = function (options) {
        options = initOptions(options, { country: 'uk' });
        return this.get("counties")[options.country.toLowerCase()];
    };

    Chance.prototype.county = function (options) {
        return this.pick(this.counties(options)).name;
    };

    Chance.prototype.provinces = function (options) {
        options = initOptions(options, { country: 'ca' });
        return this.get("provinces")[options.country.toLowerCase()];
    };

    Chance.prototype.province = function (options) {
        return (options && options.full) ?
            this.pick(this.provinces(options)).name :
            this.pick(this.provinces(options)).abbreviation;
    };

    Chance.prototype.state = function (options) {
        return (options && options.full) ?
            this.pick(this.states(options)).name :
            this.pick(this.states(options)).abbreviation;
    };

    Chance.prototype.states = function (options) {
        options = initOptions(options, { country: 'us', us_states_and_dc: true } );

        var states;

        switch (options.country.toLowerCase()) {
            case 'us':
                var us_states_and_dc = this.get("us_states_and_dc"),
                    territories = this.get("territories"),
                    armed_forces = this.get("armed_forces");

                states = [];

                if (options.us_states_and_dc) {
                    states = states.concat(us_states_and_dc);
                }
                if (options.territories) {
                    states = states.concat(territories);
                }
                if (options.armed_forces) {
                    states = states.concat(armed_forces);
                }
                break;
            case 'it':
                states = this.get("country_regions")[options.country.toLowerCase()];
                break;
            case 'uk':
                states = this.get("counties")[options.country.toLowerCase()];
                break;
        }

        return states;
    };

    Chance.prototype.street = function (options) {
        options = initOptions(options, { country: 'us', syllables: 2 });
        var     street;

        switch (options.country.toLowerCase()) {
            case 'us':
                street = this.word({ syllables: options.syllables });
                street = this.capitalize(street);
                street += ' ';
                street += options.short_suffix ?
                    this.street_suffix(options).abbreviation :
                    this.street_suffix(options).name;
                break;
            case 'it':
                street = this.word({ syllables: options.syllables });
                street = this.capitalize(street);
                street = (options.short_suffix ?
                    this.street_suffix(options).abbreviation :
                    this.street_suffix(options).name) + " " + street;
                break;
        }
        return street;
    };

    Chance.prototype.street_suffix = function (options) {
        options = initOptions(options, { country: 'us' });
        return this.pick(this.street_suffixes(options));
    };

    Chance.prototype.street_suffixes = function (options) {
        options = initOptions(options, { country: 'us' });
        // These are the most common suffixes.
        return this.get("street_suffixes")[options.country.toLowerCase()];
    };

    // Note: only returning US zip codes, internationalization will be a whole
    // other beast to tackle at some point.
    Chance.prototype.zip = function (options) {
        var zip = this.n(this.natural, 5, {max: 9});

        if (options && options.plusfour === true) {
            zip.push('-');
            zip = zip.concat(this.n(this.natural, 4, {max: 9}));
        }

        return zip.join("");
    };

    // -- End Location --

    // -- Time

    Chance.prototype.ampm = function () {
        return this.bool() ? 'am' : 'pm';
    };

    Chance.prototype.date = function (options) {
        var date_string, date;

        // If interval is specified we ignore preset
        if(options && (options.min || options.max)) {
            options = initOptions(options, {
                american: true,
                string: false
            });
            var min = typeof options.min !== "undefined" ? options.min.getTime() : 1;
            // 100,000,000 days measured relative to midnight at the beginning of 01 January, 1970 UTC. http://es5.github.io/#x15.9.1.1
            var max = typeof options.max !== "undefined" ? options.max.getTime() : 8640000000000000;

            date = new Date(this.integer({min: min, max: max}));
        } else {
            var m = this.month({raw: true});
            var daysInMonth = m.days;

            if(options && options.month) {
                // Mod 12 to allow months outside range of 0-11 (not encouraged, but also not prevented).
                daysInMonth = this.get('months')[((options.month % 12) + 12) % 12].days;
            }

            options = initOptions(options, {
                year: parseInt(this.year(), 10),
                // Necessary to subtract 1 because Date() 0-indexes month but not day or year
                // for some reason.
                month: m.numeric - 1,
                day: this.natural({min: 1, max: daysInMonth}),
                hour: this.hour({twentyfour: true}),
                minute: this.minute(),
                second: this.second(),
                millisecond: this.millisecond(),
                american: true,
                string: false
            });

            date = new Date(options.year, options.month, options.day, options.hour, options.minute, options.second, options.millisecond);
        }

        if (options.american) {
            // Adding 1 to the month is necessary because Date() 0-indexes
            // months but not day for some odd reason.
            date_string = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        } else {
            date_string = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        }

        return options.string ? date_string : date;
    };

    Chance.prototype.hammertime = function (options) {
        return this.date(options).getTime();
    };

    Chance.prototype.hour = function (options) {
        options = initOptions(options, {
            min: options && options.twentyfour ? 0 : 1,
            max: options && options.twentyfour ? 23 : 12
        });

        testRange(options.min < 0, "Chance: Min cannot be less than 0.");
        testRange(options.twentyfour && options.max > 23, "Chance: Max cannot be greater than 23 for twentyfour option.");
        testRange(!options.twentyfour && options.max > 12, "Chance: Max cannot be greater than 12.");
        testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");

        return this.natural({min: options.min, max: options.max});
    };

    Chance.prototype.millisecond = function () {
        return this.natural({max: 999});
    };

    Chance.prototype.minute = Chance.prototype.second = function (options) {
        options = initOptions(options, {min: 0, max: 59});

        testRange(options.min < 0, "Chance: Min cannot be less than 0.");
        testRange(options.max > 59, "Chance: Max cannot be greater than 59.");
        testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");

        return this.natural({min: options.min, max: options.max});
    };

    Chance.prototype.month = function (options) {
        options = initOptions(options, {min: 1, max: 12});

        testRange(options.min < 1, "Chance: Min cannot be less than 1.");
        testRange(options.max > 12, "Chance: Max cannot be greater than 12.");
        testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");

        var month = this.pick(this.months().slice(options.min - 1, options.max));
        return options.raw ? month : month.name;
    };

    Chance.prototype.months = function () {
        return this.get("months");
    };

    Chance.prototype.second = function () {
        return this.natural({max: 59});
    };

    Chance.prototype.timestamp = function () {
        return this.natural({min: 1, max: parseInt(new Date().getTime() / 1000, 10)});
    };

    Chance.prototype.weekday = function (options) {
        options = initOptions(options, {weekday_only: false});
        var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        if (!options.weekday_only) {
            weekdays.push("Saturday");
            weekdays.push("Sunday");
        }
        return this.pickone(weekdays);
    };

    Chance.prototype.year = function (options) {
        // Default to current year as min if none specified
        options = initOptions(options, {min: new Date().getFullYear()});

        // Default to one century after current year as max if none specified
        options.max = (typeof options.max !== "undefined") ? options.max : options.min + 100;

        return this.natural(options).toString();
    };

    // -- End Time

    // -- Finance --

    Chance.prototype.cc = function (options) {
        options = initOptions(options);

        var type, number, to_generate;

        type = (options.type) ?
                    this.cc_type({ name: options.type, raw: true }) :
                    this.cc_type({ raw: true });

        number = type.prefix.split("");
        to_generate = type.length - type.prefix.length - 1;

        // Generates n - 1 digits
        number = number.concat(this.n(this.integer, to_generate, {min: 0, max: 9}));

        // Generates the last digit according to Luhn algorithm
        number.push(this.luhn_calculate(number.join("")));

        return number.join("");
    };

    Chance.prototype.cc_types = function () {
        // http://en.wikipedia.org/wiki/Bank_card_number#Issuer_identification_number_.28IIN.29
        return this.get("cc_types");
    };

    Chance.prototype.cc_type = function (options) {
        options = initOptions(options);
        var types = this.cc_types(),
            type = null;

        if (options.name) {
            for (var i = 0; i < types.length; i++) {
                // Accept either name or short_name to specify card type
                if (types[i].name === options.name || types[i].short_name === options.name) {
                    type = types[i];
                    break;
                }
            }
            if (type === null) {
                throw new RangeError("Chance: Credit card type '" + options.name + "' is not supported");
            }
        } else {
            type = this.pick(types);
        }

        return options.raw ? type : type.name;
    };

    // return all world currency by ISO 4217
    Chance.prototype.currency_types = function () {
        return this.get("currency_types");
    };

    // return random world currency by ISO 4217
    Chance.prototype.currency = function () {
        return this.pick(this.currency_types());
    };

    // return all timezones available
    Chance.prototype.timezones = function () {
        return this.get("timezones");
    };

    // return random timezone
    Chance.prototype.timezone = function () {
        return this.pick(this.timezones());
    };

    //Return random correct currency exchange pair (e.g. EUR/USD) or array of currency code
    Chance.prototype.currency_pair = function (returnAsString) {
        var currencies = this.unique(this.currency, 2, {
            comparator: function(arr, val) {

                return arr.reduce(function(acc, item) {
                    // If a match has been found, short circuit check and just return
                    return acc || (item.code === val.code);
                }, false);
            }
        });

        if (returnAsString) {
            return currencies[0].code + '/' + currencies[1].code;
        } else {
            return currencies;
        }
    };

    Chance.prototype.dollar = function (options) {
        // By default, a somewhat more sane max for dollar than all available numbers
        options = initOptions(options, {max : 10000, min : 0});

        var dollar = this.floating({min: options.min, max: options.max, fixed: 2}).toString(),
            cents = dollar.split('.')[1];

        if (cents === undefined) {
            dollar += '.00';
        } else if (cents.length < 2) {
            dollar = dollar + '0';
        }

        if (dollar < 0) {
            return '-$' + dollar.replace('-', '');
        } else {
            return '$' + dollar;
        }
    };

    Chance.prototype.euro = function (options) {
        return Number(this.dollar(options).replace("$", "")).toLocaleString() + "€";
    };

    Chance.prototype.exp = function (options) {
        options = initOptions(options);
        var exp = {};

        exp.year = this.exp_year();

        // If the year is this year, need to ensure month is greater than the
        // current month or this expiration will not be valid
        if (exp.year === (new Date().getFullYear()).toString()) {
            exp.month = this.exp_month({future: true});
        } else {
            exp.month = this.exp_month();
        }

        return options.raw ? exp : exp.month + '/' + exp.year;
    };

    Chance.prototype.exp_month = function (options) {
        options = initOptions(options);
        var month, month_int,
            // Date object months are 0 indexed
            curMonth = new Date().getMonth() + 1;

        if (options.future && (curMonth !== 12)) {
            do {
                month = this.month({raw: true}).numeric;
                month_int = parseInt(month, 10);
            } while (month_int <= curMonth);
        } else {
            month = this.month({raw: true}).numeric;
        }

        return month;
    };

    Chance.prototype.exp_year = function () {
        var curMonth = new Date().getMonth() + 1,
            curYear = new Date().getFullYear();

        return this.year({min: ((curMonth === 12) ? (curYear + 1) : curYear), max: (curYear + 10)});
    };

    Chance.prototype.vat = function (options) {
        options = initOptions(options, { country: 'it' });
        switch (options.country.toLowerCase()) {
            case 'it':
                return this.it_vat();
        }
    };

    /**
     * Generate a string matching IBAN pattern (https://en.wikipedia.org/wiki/International_Bank_Account_Number).
     * No country-specific formats support (yet)
     */
    Chance.prototype.iban = function () {
        var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var alphanum = alpha + '0123456789';
        var iban =
            this.string({ length: 2, pool: alpha }) +
            this.pad(this.integer({ min: 0, max: 99 }), 2) +
            this.string({ length: 4, pool: alphanum }) +
            this.pad(this.natural(), this.natural({ min: 6, max: 26 }));
        return iban;
    };

    // -- End Finance

    // -- Regional

    Chance.prototype.it_vat = function () {
        var it_vat = this.natural({min: 1, max: 1800000});

        it_vat = this.pad(it_vat, 7) + this.pad(this.pick(this.provinces({ country: 'it' })).code, 3);
        return it_vat + this.luhn_calculate(it_vat);
    };

    /*
     * this generator is written following the official algorithm
     * all data can be passed explicitely or randomized by calling chance.cf() without options
     * the code does not check that the input data is valid (it goes beyond the scope of the generator)
     *
     * @param  [Object] options = { first: first name,
     *                              last: last name,
     *                              gender: female|male,
                                    birthday: JavaScript date object,
                                    city: string(4), 1 letter + 3 numbers
                                   }
     * @return [string] codice fiscale
     *
    */
    Chance.prototype.cf = function (options) {
        options = options || {};
        var gender = !!options.gender ? options.gender : this.gender(),
            first = !!options.first ? options.first : this.first( { gender: gender, nationality: 'it'} ),
            last = !!options.last ? options.last : this.last( { nationality: 'it'} ),
            birthday = !!options.birthday ? options.birthday : this.birthday(),
            city = !!options.city ? options.city : this.pickone(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'Z']) + this.pad(this.natural({max:999}), 3),
            cf = [],
            name_generator = function(name, isLast) {
                var temp,
                    return_value = [];

                if (name.length < 3) {
                    return_value = name.split("").concat("XXX".split("")).splice(0,3);
                }
                else {
                    temp = name.toUpperCase().split('').map(function(c){
                        return ("BCDFGHJKLMNPRSTVWZ".indexOf(c) !== -1) ? c : undefined;
                    }).join('');
                    if (temp.length > 3) {
                        if (isLast) {
                            temp = temp.substr(0,3);
                        } else {
                            temp = temp[0] + temp.substr(2,2);
                        }
                    }
                    if (temp.length < 3) {
                        return_value = temp;
                        temp = name.toUpperCase().split('').map(function(c){
                            return ("AEIOU".indexOf(c) !== -1) ? c : undefined;
                        }).join('').substr(0, 3 - return_value.length);
                    }
                    return_value = return_value + temp;
                }

                return return_value;
            },
            date_generator = function(birthday, gender, that) {
                var lettermonths = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];

                return  birthday.getFullYear().toString().substr(2) +
                        lettermonths[birthday.getMonth()] +
                        that.pad(birthday.getDate() + ((gender.toLowerCase() === "female") ? 40 : 0), 2);
            },
            checkdigit_generator = function(cf) {
                var range1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    range2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    evens  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    odds   = "BAKPLCQDREVOSFTGUHMINJWZYX",
                    digit  = 0;


                for(var i = 0; i < 15; i++) {
                    if (i % 2 !== 0) {
                        digit += evens.indexOf(range2[range1.indexOf(cf[i])]);
                    }
                    else {
                        digit +=  odds.indexOf(range2[range1.indexOf(cf[i])]);
                    }
                }
                return evens[digit % 26];
            };

        cf = cf.concat(name_generator(last, true), name_generator(first), date_generator(birthday, gender, this), city.toUpperCase().split("")).join("");
        cf += checkdigit_generator(cf.toUpperCase(), this);

        return cf.toUpperCase();
    };

    Chance.prototype.pl_pesel = function () {
        var number = this.natural({min: 1, max: 9999999999});
        var arr = this.pad(number, 10).split('');
        for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i]);
        }

        var controlNumber = (1 * arr[0] + 3 * arr[1] + 7 * arr[2] + 9 * arr[3] + 1 * arr[4] + 3 * arr[5] + 7 * arr[6] + 9 * arr[7] + 1 * arr[8] + 3 * arr[9]) % 10;
        if(controlNumber !== 0) {
            controlNumber = 10 - controlNumber;
        }

        return arr.join('') + controlNumber;
    };

    Chance.prototype.pl_nip = function () {
        var number = this.natural({min: 1, max: 999999999});
        var arr = this.pad(number, 9).split('');
        for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i]);
        }

        var controlNumber = (6 * arr[0] + 5 * arr[1] + 7 * arr[2] + 2 * arr[3] + 3 * arr[4] + 4 * arr[5] + 5 * arr[6] + 6 * arr[7] + 7 * arr[8]) % 11;
        if(controlNumber === 10) {
            return this.pl_nip();
        }

        return arr.join('') + controlNumber;
    };

    Chance.prototype.pl_regon = function () {
        var number = this.natural({min: 1, max: 99999999});
        var arr = this.pad(number, 8).split('');
        for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i]);
        }

        var controlNumber = (8 * arr[0] + 9 * arr[1] + 2 * arr[2] + 3 * arr[3] + 4 * arr[4] + 5 * arr[5] + 6 * arr[6] + 7 * arr[7]) % 11;
        if(controlNumber === 10) {
            controlNumber = 0;
        }

        return arr.join('') + controlNumber;
    };

    // -- End Regional

    // -- Music --

    Chance.prototype.note = function(options) {
      // choices for 'notes' option:
      // flatKey - chromatic scale with flat notes (default)
      // sharpKey - chromatic scale with sharp notes
      // flats - just flat notes
      // sharps - just sharp notes
      // naturals - just natural notes
      // all - naturals, sharps and flats
      options = initOptions(options, { notes : 'flatKey'});
      var scales = {
        naturals: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        flats: ['D♭', 'E♭', 'G♭', 'A♭', 'B♭'],
        sharps: ['C♯', 'D♯', 'F♯', 'G♯', 'A♯']
      };
      scales.all = scales.naturals.concat(scales.flats.concat(scales.sharps))
      scales.flatKey = scales.naturals.concat(scales.flats)
      scales.sharpKey = scales.naturals.concat(scales.sharps)
      return this.pickone(scales[options.notes]);
    }

    Chance.prototype.midi_note = function(options) {
      var min = 0;
      var max = 127;
      options = initOptions(options, { min : min, max : max });
      return this.integer({min: options.min, max: options.max});
    }

    Chance.prototype.chord_quality = function(options) {
      options = initOptions(options, { jazz: true });
      var chord_qualities = ['maj', 'min', 'aug', 'dim'];
      if (options.jazz){
        chord_qualities = [
          'maj7',
          'min7',
          '7',
          'sus',
          'dim',
          'ø'
        ];
      }
      return this.pickone(chord_qualities);
    }

    Chance.prototype.chord = function (options) {
      options = initOptions(options);
      return this.note(options) + this.chord_quality(options);
    }

    Chance.prototype.tempo = function (options) {
      var min = 40;
      var max = 320;
      options = initOptions(options, {min: min, max: max});
      return this.integer({min: options.min, max: options.max});
    }

    // -- End Music

    // -- Miscellaneous --

    // Coin - Flip, flip, flipadelphia
    Chance.prototype.coin = function(options) {
      return this.bool() ? "heads" : "tails";
    }

    // Dice - For all the board game geeks out there, myself included ;)
    function diceFn (range) {
        return function () {
            return this.natural(range);
        };
    }
    Chance.prototype.d4 = diceFn({min: 1, max: 4});
    Chance.prototype.d6 = diceFn({min: 1, max: 6});
    Chance.prototype.d8 = diceFn({min: 1, max: 8});
    Chance.prototype.d10 = diceFn({min: 1, max: 10});
    Chance.prototype.d12 = diceFn({min: 1, max: 12});
    Chance.prototype.d20 = diceFn({min: 1, max: 20});
    Chance.prototype.d30 = diceFn({min: 1, max: 30});
    Chance.prototype.d100 = diceFn({min: 1, max: 100});

    Chance.prototype.rpg = function (thrown, options) {
        options = initOptions(options);
        if (!thrown) {
            throw new RangeError("Chance: A type of die roll must be included");
        } else {
            var bits = thrown.toLowerCase().split("d"),
                rolls = [];

            if (bits.length !== 2 || !parseInt(bits[0], 10) || !parseInt(bits[1], 10)) {
                throw new Error("Chance: Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die");
            }
            for (var i = bits[0]; i > 0; i--) {
                rolls[i - 1] = this.natural({min: 1, max: bits[1]});
            }
            return (typeof options.sum !== 'undefined' && options.sum) ? rolls.reduce(function (p, c) { return p + c; }) : rolls;
        }
    };

    // Guid
    Chance.prototype.guid = function (options) {
        options = initOptions(options, { version: 5 });

        var guid_pool = "abcdef1234567890",
            variant_pool = "ab89",
            guid = this.string({ pool: guid_pool, length: 8 }) + '-' +
                   this.string({ pool: guid_pool, length: 4 }) + '-' +
                   // The Version
                   options.version +
                   this.string({ pool: guid_pool, length: 3 }) + '-' +
                   // The Variant
                   this.string({ pool: variant_pool, length: 1 }) +
                   this.string({ pool: guid_pool, length: 3 }) + '-' +
                   this.string({ pool: guid_pool, length: 12 });
        return guid;
    };

    // Hash
    Chance.prototype.hash = function (options) {
        options = initOptions(options, {length : 40, casing: 'lower'});
        var pool = options.casing === 'upper' ? HEX_POOL.toUpperCase() : HEX_POOL;
        return this.string({pool: pool, length: options.length});
    };

    Chance.prototype.luhn_check = function (num) {
        var str = num.toString();
        var checkDigit = +str.substring(str.length - 1);
        return checkDigit === this.luhn_calculate(+str.substring(0, str.length - 1));
    };

    Chance.prototype.luhn_calculate = function (num) {
        var digits = num.toString().split("").reverse();
        var sum = 0;
        var digit;

        for (var i = 0, l = digits.length; l > i; ++i) {
            digit = +digits[i];
            if (i % 2 === 0) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
        }
        return (sum * 9) % 10;
    };

    // MD5 Hash
    Chance.prototype.md5 = function(options) {
        var opts = { str: '', key: null, raw: false };

        if (!options) {
            opts.str = this.string();
            options = {};
        }
        else if (typeof options === 'string') {
            opts.str = options;
            options = {};
        }
        else if (typeof options !== 'object') {
            return null;
        }
        else if(options.constructor === 'Array') {
            return null;
        }

        opts = initOptions(options, opts);

        if(!opts.str){
            throw new Error('A parameter is required to return an md5 hash.');
        }

        return this.bimd5.md5(opts.str, opts.key, opts.raw);
    };

    /**
     * #Description:
     * =====================================================
     * Generate random file name with extension
     *
     * The argument provide extension type
     * -> raster
     * -> vector
     * -> 3d
     * -> document
     *
     * If nothing is provided the function return random file name with random
     * extension type of any kind
     *
     * The user can validate the file name length range
     * If nothing provided the generated file name is random
     *
     * #Extension Pool :
     * * Currently the supported extensions are
     *  -> some of the most popular raster image extensions
     *  -> some of the most popular vector image extensions
     *  -> some of the most popular 3d image extensions
     *  -> some of the most popular document extensions
     *
     * #Examples :
     * =====================================================
     *
     * Return random file name with random extension. The file extension
     * is provided by a predefined collection of extensions. More about the extension
     * pool can be found in #Extension Pool section
     *
     * chance.file()
     * => dsfsdhjf.xml
     *
     * In order to generate a file name with specific length, specify the
     * length property and integer value. The extension is going to be random
     *
     * chance.file({length : 10})
     * => asrtineqos.pdf
     *
     * In order to generate file with extension from some of the predefined groups
     * of the extension pool just specify the extension pool category in fileType property
     *
     * chance.file({fileType : 'raster'})
     * => dshgssds.psd
     *
     * You can provide specific extension for your files
     * chance.file({extension : 'html'})
     * => djfsd.html
     *
     * Or you could pass custom collection of extensions by array or by object
     * chance.file({extensions : [...]})
     * => dhgsdsd.psd
     *
     * chance.file({extensions : { key : [...], key : [...]}})
     * => djsfksdjsd.xml
     *
     * @param  [collection] options
     * @return [string]
     *
     */
    Chance.prototype.file = function(options) {

        var fileOptions = options || {};
        var poolCollectionKey = "fileExtension";
        var typeRange   = Object.keys(this.get("fileExtension"));//['raster', 'vector', '3d', 'document'];
        var fileName;
        var fileExtension;

        // Generate random file name
        fileName = this.word({length : fileOptions.length});

        // Generate file by specific extension provided by the user
        if(fileOptions.extension) {

            fileExtension = fileOptions.extension;
            return (fileName + '.' + fileExtension);
        }

        // Generate file by specific extension collection
        if(fileOptions.extensions) {

            if(Array.isArray(fileOptions.extensions)) {

                fileExtension = this.pickone(fileOptions.extensions);
                return (fileName + '.' + fileExtension);
            }
            else if(fileOptions.extensions.constructor === Object) {

                var extensionObjectCollection = fileOptions.extensions;
                var keys = Object.keys(extensionObjectCollection);

                fileExtension = this.pickone(extensionObjectCollection[this.pickone(keys)]);
                return (fileName + '.' + fileExtension);
            }

            throw new Error("Chance: Extensions must be an Array or Object");
        }

        // Generate file extension based on specific file type
        if(fileOptions.fileType) {

            var fileType = fileOptions.fileType;
            if(typeRange.indexOf(fileType) !== -1) {

                fileExtension = this.pickone(this.get(poolCollectionKey)[fileType]);
                return (fileName + '.' + fileExtension);
            }

            throw new RangeError("Chance: Expect file type value to be 'raster', 'vector', '3d' or 'document'");
        }

        // Generate random file name if no extension options are passed
        fileExtension = this.pickone(this.get(poolCollectionKey)[this.pickone(typeRange)]);
        return (fileName + '.' + fileExtension);
    };

    var data = {
     


        firstNames: {
            "male": {
                "en": ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Charles", "Thomas", "Christopher", "Daniel", "Matthew", "George", "Donald", "Anthony", "Paul", "Mark", "Edward", "Steven", "Kenneth", "Andrew", "Brian", "Joshua", "Kevin", "Ronald", "Timothy", "Jason", "Jeffrey", "Frank", "Gary", "Ryan", "Nicholas", "Eric", "Stephen", "Jacob", "Larry", "Jonathan", "Scott", "Raymond", "Justin", "Brandon", "Gregory", "Samuel", "Benjamin", "Patrick", "Jack", "Henry", "Walter", "Dennis", "Jerry", "Alexander", "Peter", "Tyler", "Douglas", "Harold", "Aaron", "Jose", "Adam", "Arthur", "Zachary", "Carl", "Nathan", "Albert", "Kyle", "Lawrence", "Joe", "Willie", "Gerald", "Roger", "Keith", "Jeremy", "Terry", "Harry", "Ralph", "Sean", "Jesse", "Roy", "Louis", "Billy", "Austin", "Bruce", "Eugene", "Christian", "Bryan", "Wayne", "Russell", "Howard", "Fred", "Ethan", "Jordan", "Philip", "Alan", "Juan", "Randy", "Vincent", "Bobby", "Dylan", "Johnny", "Phillip", "Victor", "Clarence", "Ernest", "Martin", "Craig", "Stanley", "Shawn", "Travis", "Bradley", "Leonard", "Earl", "Gabriel", "Jimmy", "Francis", "Todd", "Noah", "Danny", "Dale", "Cody", "Carlos", "Allen", "Frederick", "Logan", "Curtis", "Alex", "Joel", "Luis", "Norman", "Marvin", "Glenn", "Tony", "Nathaniel", "Rodney", "Melvin", "Alfred", "Steve", "Cameron", "Chad", "Edwin", "Caleb", "Evan", "Antonio", "Lee", "Herbert", "Jeffery", "Isaac", "Derek", "Ricky", "Marcus", "Theodore", "Elijah", "Luke", "Jesus", "Eddie", "Troy", "Mike", "Dustin", "Ray", "Adrian", "Bernard", "Leroy", "Angel", "Randall", "Wesley", "Ian", "Jared", "Mason", "Hunter", "Calvin", "Oscar", "Clifford", "Jay", "Shane", "Ronnie", "Barry", "Lucas", "Corey", "Manuel", "Leo", "Tommy", "Warren", "Jackson", "Isaiah", "Connor", "Don", "Dean", "Jon", "Julian", "Miguel", "Bill", "Lloyd", "Charlie", "Mitchell", "Leon", "Jerome", "Darrell", "Jeremiah", "Alvin", "Brett", "Seth", "Floyd", "Jim", "Blake", "Micheal", "Gordon", "Trevor", "Lewis", "Erik", "Edgar", "Vernon", "Devin", "Gavin", "Jayden", "Chris", "Clyde", "Tom", "Derrick", "Mario", "Brent", "Marc", "Herman", "Chase", "Dominic", "Ricardo", "Franklin", "Maurice", "Max", "Aiden", "Owen", "Lester", "Gilbert", "Elmer", "Gene", "Francisco", "Glen", "Cory", "Garrett", "Clayton", "Sam", "Jorge", "Chester", "Alejandro", "Jeff", "Harvey", "Milton", "Cole", "Ivan", "Andre", "Duane", "Landon"],
                // Data taken from http://www.dati.gov.it/dataset/comune-di-firenze_0163
                "it": ["Adolfo", "Alberto", "Aldo", "Alessandro", "Alessio", "Alfredo", "Alvaro", "Andrea", "Angelo", "Angiolo", "Antonino", "Antonio", "Attilio", "Benito", "Bernardo", "Bruno", "Carlo", "Cesare", "Christian", "Claudio", "Corrado", "Cosimo", "Cristian", "Cristiano", "Daniele", "Dario", "David", "Davide", "Diego", "Dino", "Domenico", "Duccio", "Edoardo", "Elia", "Elio", "Emanuele", "Emiliano", "Emilio", "Enrico", "Enzo", "Ettore", "Fabio", "Fabrizio", "Federico", "Ferdinando", "Fernando", "Filippo", "Francesco", "Franco", "Gabriele", "Giacomo", "Giampaolo", "Giampiero", "Giancarlo", "Gianfranco", "Gianluca", "Gianmarco", "Gianni", "Gino", "Giorgio", "Giovanni", "Giuliano", "Giulio", "Giuseppe", "Graziano", "Gregorio", "Guido", "Iacopo", "Jacopo", "Lapo", "Leonardo", "Lorenzo", "Luca", "Luciano", "Luigi", "Manuel", "Marcello", "Marco", "Marino", "Mario", "Massimiliano", "Massimo", "Matteo", "Mattia", "Maurizio", "Mauro", "Michele", "Mirko", "Mohamed", "Nello", "Neri", "Niccolò", "Nicola", "Osvaldo", "Otello", "Paolo", "Pier Luigi", "Piero", "Pietro", "Raffaele", "Remo", "Renato", "Renzo", "Riccardo", "Roberto", "Rolando", "Romano", "Salvatore", "Samuele", "Sandro", "Sergio", "Silvano", "Simone", "Stefano", "Thomas", "Tommaso", "Ubaldo", "Ugo", "Umberto", "Valerio", "Valter", "Vasco", "Vincenzo", "Vittorio"],
                // Data taken from http://www.svbkindernamen.nl/int/nl/kindernamen/index.html
                "nl": ["Aaron","Abel","Adam","Adriaan","Albert","Alexander","Ali","Arjen","Arno","Bart","Bas","Bastiaan","Benjamin","Bob", "Boris","Bram","Brent","Cas","Casper","Chris","Christiaan","Cornelis","Daan","Daley","Damian","Dani","Daniel","Daniël","David","Dean","Dirk","Dylan","Egbert","Elijah","Erik","Erwin","Evert","Ezra","Fabian","Fedde","Finn","Florian","Floris","Frank","Frans","Frederik","Freek","Geert","Gerard","Gerben","Gerrit","Gijs","Guus","Hans","Hendrik","Henk","Herman","Hidde","Hugo","Jaap","Jan Jaap","Jan-Willem","Jack","Jacob","Jan","Jason","Jasper","Jayden","Jelle","Jelte","Jens","Jeroen","Jesse","Jim","Job","Joep","Johannes","John","Jonathan","Joris","Joshua","Joël","Julian","Kees","Kevin","Koen","Lars","Laurens","Leendert","Lennard","Lodewijk","Luc","Luca","Lucas","Lukas","Luuk","Maarten","Marcus","Martijn","Martin","Matthijs","Maurits","Max","Mees","Melle","Mick","Mika","Milan","Mohamed","Mohammed","Morris","Muhammed","Nathan","Nick","Nico","Niek","Niels","Noah","Noud","Olivier","Oscar","Owen","Paul","Pepijn","Peter","Pieter","Pim","Quinten","Reinier","Rens","Robin","Ruben","Sam","Samuel","Sander","Sebastiaan","Sem","Sep","Sepp","Siem","Simon","Stan","Stef","Steven","Stijn","Sven","Teun","Thijmen","Thijs","Thomas","Tijn","Tim","Timo","Tobias","Tom","Victor","Vince","Willem","Wim","Wouter","Yusuf"],
                // Data taken from https://fr.wikipedia.org/wiki/Liste_de_pr%C3%A9noms_fran%C3%A7ais_et_de_la_francophonie
                "fr": ["Aaron","Abdon","Abel","Abélard","Abelin","Abondance","Abraham","Absalon","Acace","Achaire","Achille","Adalard","Adalbald","Adalbéron","Adalbert","Adalric","Adam","Adegrin","Adel","Adelin","Andelin","Adelphe","Adam","Adéodat","Adhémar","Adjutor","Adolphe","Adonis","Adon","Adrien","Agapet","Agathange","Agathon","Agilbert","Agénor","Agnan","Aignan","Agrippin","Aimable","Aimé","Alain","Alban","Albin","Aubin","Albéric","Albert","Albertet","Alcibiade","Alcide","Alcée","Alcime","Aldonce","Aldric","Aldéric","Aleaume","Alexandre","Alexis","Alix","Alliaume","Aleaume","Almine","Almire","Aloïs","Alphée","Alphonse","Alpinien","Alverède","Amalric","Amaury","Amandin","Amant","Ambroise","Amédée","Amélien","Amiel","Amour","Anaël","Anastase","Anatole","Ancelin","Andéol","Andoche","André","Andoche","Ange","Angelin","Angilbe","Anglebert","Angoustan","Anicet","Anne","Annibal","Ansbert","Anselme","Anthelme","Antheaume","Anthime","Antide","Antoine","Antonius","Antonin","Apollinaire","Apollon","Aquilin","Arcade","Archambaud","Archambeau","Archange","Archibald","Arian","Ariel","Ariste","Aristide","Armand","Armel","Armin","Arnould","Arnaud","Arolde","Arsène","Arsinoé","Arthaud","Arthème","Arthur","Ascelin","Athanase","Aubry","Audebert","Audouin","Audran","Audric","Auguste","Augustin","Aurèle","Aurélien","Aurian","Auxence","Axel","Aymard","Aymeric","Aymon","Aymond","Balthazar","Baptiste","Barnabé","Barthélemy","Bartimée","Basile","Bastien","Baudouin","Bénigne","Benjamin","Benoît","Bérenger","Bérard","Bernard","Bertrand","Blaise","Bon","Boniface","Bouchard","Brice","Brieuc","Bruno","Brunon","Calixte","Calliste","Camélien","Camille","Camillien","Candide","Caribert","Carloman","Cassandre","Cassien","Cédric","Céleste","Célestin","Célien","Césaire","César","Charles","Charlemagne","Childebert","Chilpéric","Chrétien","Christian","Christodule","Christophe","Chrysostome","Clarence","Claude","Claudien","Cléandre","Clément","Clotaire","Côme","Constance","Constant","Constantin","Corentin","Cyprien","Cyriaque","Cyrille","Cyril","Damien","Daniel","David","Delphin","Denis","Désiré","Didier","Dieudonné","Dimitri","Dominique","Dorian","Dorothée","Edgard","Edmond","Édouard","Éleuthère","Élie","Élisée","Émeric","Émile","Émilien","Emmanuel","Enguerrand","Épiphane","Éric","Esprit","Ernest","Étienne","Eubert","Eudes","Eudoxe","Eugène","Eusèbe","Eustache","Évariste","Évrard","Fabien","Fabrice","Falba","Félicité","Félix","Ferdinand","Fiacre","Fidèle","Firmin","Flavien","Flodoard","Florent","Florentin","Florestan","Florian","Fortuné","Foulques","Francisque","François","Français","Franciscus","Francs","Frédéric","Fulbert","Fulcran","Fulgence","Gabin","Gabriel","Gaël","Garnier","Gaston","Gaspard","Gatien","Gaud","Gautier","Gédéon","Geoffroy","Georges","Géraud","Gérard","Gerbert","Germain","Gervais","Ghislain","Gilbert","Gilles","Girart","Gislebert","Gondebaud","Gonthier","Gontran","Gonzague","Grégoire","Guérin","Gui","Guillaume","Gustave","Guy","Guyot","Hardouin","Hector","Hédelin","Hélier","Henri","Herbert","Herluin","Hervé","Hilaire","Hildebert","Hincmar","Hippolyte","Honoré","Hubert","Hugues","Innocent","Isabeau","Isidore","Jacques","Japhet","Jason","Jean","Jeannel","Jeannot","Jérémie","Jérôme","Joachim","Joanny","Job","Jocelyn","Joël","Johan","Jonas","Jonathan","Joseph","Josse","Josselin","Jourdain","Jude","Judicaël","Jules","Julien","Juste","Justin","Lambert","Landry","Laurent","Lazare","Léandre","Léon","Léonard","Léopold","Leu","Loup","Leufroy","Libère","Liétald","Lionel","Loïc","Longin","Lorrain","Lorraine","Lothaire","Louis","Loup","Luc","Lucas","Lucien","Ludolphe","Ludovic","Macaire","Malo","Mamert","Manassé","Marc","Marceau","Marcel","Marcelin","Marius","Marseille","Martial","Martin","Mathurin","Matthias","Mathias","Matthieu","Maugis","Maurice","Mauricet","Maxence","Maxime","Maximilien","Mayeul","Médéric","Melchior","Mence","Merlin","Mérovée","Michaël","Michel","Moïse","Morgan","Nathan","Nathanaël","Narcisse","Néhémie","Nestor","Nestor","Nicéphore","Nicolas","Noé","Noël","Norbert","Normand","Normands","Octave","Odilon","Odon","Oger","Olivier","Oury","Pacôme","Palémon","Parfait","Pascal","Paterne","Patrice","Paul","Pépin","Perceval","Philémon","Philibert","Philippe","Philothée","Pie","Pierre","Pierrick","Prosper","Quentin","Raoul","Raphaël","Raymond","Régis","Réjean","Rémi","Renaud","René","Reybaud","Richard","Robert","Roch","Rodolphe","Rodrigue","Roger","Roland","Romain","Romuald","Roméo","Rome","Ronan","Roselin","Salomon","Samuel","Savin","Savinien","Scholastique","Sébastien","Séraphin","Serge","Séverin","Sidoine","Sigebert","Sigismond","Silvère","Simon","Siméon","Sixte","Stanislas","Stéphane","Stephan","Sylvain","Sylvestre","Tancrède","Tanguy","Taurin","Théodore","Théodose","Théophile","Théophraste","Thibault","Thibert","Thierry","Thomas","Timoléon","Timothée","Titien","Tonnin","Toussaint","Trajan","Tristan","Turold","Tim","Ulysse","Urbain","Valentin","Valère","Valéry","Venance","Venant","Venceslas","Vianney","Victor","Victorien","Victorin","Vigile","Vincent","Vital","Vitalien","Vivien","Waleran","Wandrille","Xavier","Xénophon","Yves","Zacharie","Zaché","Zéphirin"]
            },

            "female": {
                "en": ["Mary", "Emma", "Elizabeth", "Minnie", "Margaret", "Ida", "Alice", "Bertha", "Sarah", "Annie", "Clara", "Ella", "Florence", "Cora", "Martha", "Laura", "Nellie", "Grace", "Carrie", "Maude", "Mabel", "Bessie", "Jennie", "Gertrude", "Julia", "Hattie", "Edith", "Mattie", "Rose", "Catherine", "Lillian", "Ada", "Lillie", "Helen", "Jessie", "Louise", "Ethel", "Lula", "Myrtle", "Eva", "Frances", "Lena", "Lucy", "Edna", "Maggie", "Pearl", "Daisy", "Fannie", "Josephine", "Dora", "Rosa", "Katherine", "Agnes", "Marie", "Nora", "May", "Mamie", "Blanche", "Stella", "Ellen", "Nancy", "Effie", "Sallie", "Nettie", "Della", "Lizzie", "Flora", "Susie", "Maud", "Mae", "Etta", "Harriet", "Sadie", "Caroline", "Katie", "Lydia", "Elsie", "Kate", "Susan", "Mollie", "Alma", "Addie", "Georgia", "Eliza", "Lulu", "Nannie", "Lottie", "Amanda", "Belle", "Charlotte", "Rebecca", "Ruth", "Viola", "Olive", "Amelia", "Hannah", "Jane", "Virginia", "Emily", "Matilda", "Irene", "Kathryn", "Esther", "Willie", "Henrietta", "Ollie", "Amy", "Rachel", "Sara", "Estella", "Theresa", "Augusta", "Ora", "Pauline", "Josie", "Lola", "Sophia", "Leona", "Anne", "Mildred", "Ann", "Beulah", "Callie", "Lou", "Delia", "Eleanor", "Barbara", "Iva", "Louisa", "Maria", "Mayme", "Evelyn", "Estelle", "Nina", "Betty", "Marion", "Bettie", "Dorothy", "Luella", "Inez", "Lela", "Rosie", "Allie", "Millie", "Janie", "Cornelia", "Victoria", "Ruby", "Winifred", "Alta", "Celia", "Christine", "Beatrice", "Birdie", "Harriett", "Mable", "Myra", "Sophie", "Tillie", "Isabel", "Sylvia", "Carolyn", "Isabelle", "Leila", "Sally", "Ina", "Essie", "Bertie", "Nell", "Alberta", "Katharine", "Lora", "Rena", "Mina", "Rhoda", "Mathilda", "Abbie", "Eula", "Dollie", "Hettie", "Eunice", "Fanny", "Ola", "Lenora", "Adelaide", "Christina", "Lelia", "Nelle", "Sue", "Johanna", "Lilly", "Lucinda", "Minerva", "Lettie", "Roxie", "Cynthia", "Helena", "Hilda", "Hulda", "Bernice", "Genevieve", "Jean", "Cordelia", "Marian", "Francis", "Jeanette", "Adeline", "Gussie", "Leah", "Lois", "Lura", "Mittie", "Hallie", "Isabella", "Olga", "Phoebe", "Teresa", "Hester", "Lida", "Lina", "Winnie", "Claudia", "Marguerite", "Vera", "Cecelia", "Bess", "Emilie", "Rosetta", "Verna", "Myrtie", "Cecilia", "Elva", "Olivia", "Ophelia", "Georgie", "Elnora", "Violet", "Adele", "Lily", "Linnie", "Loretta", "Madge", "Polly", "Virgie", "Eugenia", "Lucile", "Lucille", "Mabelle", "Rosalie"],
                // Data taken from http://www.dati.gov.it/dataset/comune-di-firenze_0162
                "it": ["Ada", "Adriana", "Alessandra", "Alessia", "Alice", "Angela", "Anna", "Anna Maria", "Annalisa", "Annita", "Annunziata", "Antonella", "Arianna", "Asia", "Assunta", "Aurora", "Barbara", "Beatrice", "Benedetta", "Bianca", "Bruna", "Camilla", "Carla", "Carlotta", "Carmela", "Carolina", "Caterina", "Catia", "Cecilia", "Chiara", "Cinzia", "Clara", "Claudia", "Costanza", "Cristina", "Daniela", "Debora", "Diletta", "Dina", "Donatella", "Elena", "Eleonora", "Elisa", "Elisabetta", "Emanuela", "Emma", "Eva", "Federica", "Fernanda", "Fiorella", "Fiorenza", "Flora", "Franca", "Francesca", "Gabriella", "Gaia", "Gemma", "Giada", "Gianna", "Gina", "Ginevra", "Giorgia", "Giovanna", "Giulia", "Giuliana", "Giuseppa", "Giuseppina", "Grazia", "Graziella", "Greta", "Ida", "Ilaria", "Ines", "Iolanda", "Irene", "Irma", "Isabella", "Jessica", "Laura", "Lea", "Letizia", "Licia", "Lidia", "Liliana", "Lina", "Linda", "Lisa", "Livia", "Loretta", "Luana", "Lucia", "Luciana", "Lucrezia", "Luisa", "Manuela", "Mara", "Marcella", "Margherita", "Maria", "Maria Cristina", "Maria Grazia", "Maria Luisa", "Maria Pia", "Maria Teresa", "Marina", "Marisa", "Marta", "Martina", "Marzia", "Matilde", "Melissa", "Michela", "Milena", "Mirella", "Monica", "Natalina", "Nella", "Nicoletta", "Noemi", "Olga", "Paola", "Patrizia", "Piera", "Pierina", "Raffaella", "Rebecca", "Renata", "Rina", "Rita", "Roberta", "Rosa", "Rosanna", "Rossana", "Rossella", "Sabrina", "Sandra", "Sara", "Serena", "Silvana", "Silvia", "Simona", "Simonetta", "Sofia", "Sonia", "Stefania", "Susanna", "Teresa", "Tina", "Tiziana", "Tosca", "Valentina", "Valeria", "Vanda", "Vanessa", "Vanna", "Vera", "Veronica", "Vilma", "Viola", "Virginia", "Vittoria"],
                // Data taken from http://www.svbkindernamen.nl/int/nl/kindernamen/index.html
                "nl": ["Ada", "Arianne", "Afke", "Amanda", "Amber", "Amy", "Aniek", "Anita", "Anja", "Anna", "Anne", "Annelies", "Annemarie", "Annette", "Anouk", "Astrid", "Aukje", "Barbara", "Bianca", "Carla", "Carlijn", "Carolien", "Chantal", "Charlotte", "Claudia", "Daniëlle", "Debora", "Diane", "Dora", "Eline", "Elise", "Ella", "Ellen", "Emma", "Esmee", "Evelien", "Esther", "Erica", "Eva", "Femke", "Fleur", "Floor", "Froukje", "Gea", "Gerda", "Hanna", "Hanneke", "Heleen", "Hilde", "Ilona", "Ina", "Inge", "Ingrid", "Iris", "Isabel", "Isabelle", "Janneke", "Jasmijn", "Jeanine", "Jennifer", "Jessica", "Johanna", "Joke", "Julia", "Julie", "Karen", "Karin", "Katja", "Kim", "Lara", "Laura", "Lena", "Lianne", "Lieke", "Lilian", "Linda", "Lisa", "Lisanne", "Lotte", "Louise", "Maaike", "Manon", "Marga", "Maria", "Marissa", "Marit", "Marjolein", "Martine", "Marleen", "Melissa", "Merel", "Miranda", "Michelle", "Mirjam", "Mirthe", "Naomi", "Natalie", 'Nienke', "Nina", "Noortje", "Olivia", "Patricia", "Paula", "Paulien", "Ramona", "Ria", "Rianne", "Roos", "Rosanne", "Ruth", "Sabrina", "Sandra", "Sanne", "Sara", "Saskia", "Silvia", "Sofia", "Sophie", "Sonja", "Suzanne", "Tamara", "Tess", "Tessa", "Tineke", "Valerie", "Vanessa", "Veerle", "Vera", "Victoria", "Wendy", "Willeke", "Yvonne", "Zoë"],
                // Data taken from https://fr.wikipedia.org/wiki/Liste_de_pr%C3%A9noms_fran%C3%A7ais_et_de_la_francophonie
                "fr": ["Abdon","Abel","Abigaëlle","Abigaïl","Acacius","Acanthe","Adalbert","Adalsinde","Adegrine","Adélaïde","Adèle","Adélie","Adeline","Adeltrude","Adolphe","Adonis","Adrastée","Adrehilde","Adrienne","Agathe","Agilbert","Aglaé","Aignan","Agneflète","Agnès","Agrippine","Aimé","Alaine","Alaïs","Albane","Albérade","Alberte","Alcide","Alcine","Alcyone","Aldegonde","Aleth","Alexandrine","Alexine","Alice","Aliénor","Aliette","Aline","Alix","Alizé","Aloïse","Aloyse","Alphonsine","Althée","Amaliane","Amalthée","Amande","Amandine","Amant","Amarande","Amaranthe","Amaryllis","Ambre","Ambroisie","Amélie","Améthyste","Aminte","Anaël","Anaïs","Anastasie","Anatole","Ancelin","Andrée","Anémone","Angadrême","Angèle","Angeline","Angélique","Angilbert","Anicet","Annabelle","Anne","Annette","Annick","Annie","Annonciade","Ansbert","Anstrudie","Anthelme","Antigone","Antoinette","Antonine","Aphélie","Apolline","Apollonie","Aquiline","Arabelle","Arcadie","Archange","Argine","Ariane","Aricie","Ariel","Arielle","Arlette","Armance","Armande","Armandine","Armelle","Armide","Armelle","Armin","Arnaud","Arsène","Arsinoé","Artémis","Arthur","Ascelin","Ascension","Assomption","Astarté","Astérie","Astrée","Astrid","Athalie","Athanasie","Athina","Aube","Albert","Aude","Audrey","Augustine","Aure","Aurélie","Aurélien","Aurèle","Aurore","Auxence","Aveline","Abigaëlle","Avoye","Axelle","Aymard","Azalée","Adèle","Adeline","Barbe","Basilisse","Bathilde","Béatrice","Béatrix","Bénédicte","Bérengère","Bernadette","Berthe","Bertille","Beuve","Blanche","Blanc","Blandine","Brigitte","Brune","Brunehilde","Callista","Camille","Capucine","Carine","Caroline","Cassandre","Catherine","Cécile","Céleste","Célestine","Céline","Chantal","Charlène","Charline","Charlotte","Chloé","Christelle","Christiane","Christine","Claire","Clara","Claude","Claudine","Clarisse","Clémence","Clémentine","Cléo","Clio","Clotilde","Coline","Conception","Constance","Coralie","Coraline","Corentine","Corinne","Cyrielle","Daniel","Daniel","Daphné","Débora","Delphine","Denise","Diane","Dieudonné","Dominique","Doriane","Dorothée","Douce","Édith","Edmée","Éléonore","Éliane","Élia","Éliette","Élisabeth","Élise","Ella","Élodie","Éloïse","Elsa","Émeline","Émérance","Émérentienne","Émérencie","Émilie","Emma","Emmanuelle","Emmelie","Ernestine","Esther","Estelle","Eudoxie","Eugénie","Eulalie","Euphrasie","Eusébie","Évangéline","Eva","Ève","Évelyne","Fanny","Fantine","Faustine","Félicie","Fernande","Flavie","Fleur","Flore","Florence","Florie","Fortuné","France","Francia","Françoise","Francine","Gabrielle","Gaëlle","Garance","Geneviève","Georgette","Gerberge","Germaine","Gertrude","Gisèle","Guenièvre","Guilhemine","Guillemette","Gustave","Gwenael","Hélène","Héloïse","Henriette","Hermine","Hermione","Hippolyte","Honorine","Hortense","Huguette","Ines","Irène","Irina","Iris","Isabeau","Isabelle","Iseult","Isolde","Ismérie","Jacinthe","Jacqueline","Jade","Janine","Jeanne","Jocelyne","Joëlle","Joséphine","Judith","Julia","Julie","Jules","Juliette","Justine","Katy","Kathy","Katie","Laura","Laure","Laureline","Laurence","Laurene","Lauriane","Laurianne","Laurine","Léa","Léna","Léonie","Léon","Léontine","Lorraine","Lucie","Lucienne","Lucille","Ludivine","Lydie","Lydie","Megane","Madeleine","Magali","Maguelone","Mallaury","Manon","Marceline","Margot","Marguerite","Marianne","Marie","Myriam","Marie","Marine","Marion","Marlène","Marthe","Martine","Mathilde","Maud","Maureen","Mauricette","Maxime","Mélanie","Melissa","Mélissandre","Mélisande","Mélodie","Michel","Micheline","Mireille","Miriam","Moïse","Monique","Morgane","Muriel","Mylène","Nadège","Nadine","Nathalie","Nicole","Nicolette","Nine","Noël","Noémie","Océane","Odette","Odile","Olive","Olivia","Olympe","Ombline","Ombeline","Ophélie","Oriande","Oriane","Ozanne","Pascale","Pascaline","Paule","Paulette","Pauline","Priscille","Prisca","Prisque","Pécine","Pélagie","Pénélope","Perrine","Pétronille","Philippine","Philomène","Philothée","Primerose","Prudence","Pulchérie","Quentine","Quiéta","Quintia","Quintilla","Rachel","Raphaëlle","Raymonde","Rebecca","Régine","Réjeanne","René","Rita","Rita","Rolande","Romane","Rosalie","Rose","Roseline","Sabine","Salomé","Sandra","Sandrine","Sarah","Ségolène","Séverine","Sibylle","Simone","Sixt","Solange","Soline","Solène","Sophie","Stéphanie","Suzanne","Sylvain","Sylvie","Tatiana","Thaïs","Théodora","Thérèse","Tiphaine","Ursule","Valentine","Valérie","Véronique","Victoire","Victorine","Vinciane","Violette","Virginie","Viviane","Xavière","Yolande","Ysaline","Yvette","Yvonne","Zélie","Zita","Zoé"]
            }
        },

        lastNames: {
            "en": ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Diaz', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace', 'Woods', 'Cole', 'West', 'Jordan', 'Owens', 'Reynolds', 'Fisher', 'Ellis', 'Harrison', 'Gibson', 'McDonald', 'Cruz', 'Marshall', 'Ortiz', 'Gomez', 'Murray', 'Freeman', 'Wells', 'Webb', 'Simpson', 'Stevens', 'Tucker', 'Porter', 'Hunter', 'Hicks', 'Crawford', 'Henry', 'Boyd', 'Mason', 'Morales', 'Kennedy', 'Warren', 'Dixon', 'Ramos', 'Reyes', 'Burns', 'Gordon', 'Shaw', 'Holmes', 'Rice', 'Robertson', 'Hunt', 'Black', 'Daniels', 'Palmer', 'Mills', 'Nichols', 'Grant', 'Knight', 'Ferguson', 'Rose', 'Stone', 'Hawkins', 'Dunn', 'Perkins', 'Hudson', 'Spencer', 'Gardner', 'Stephens', 'Payne', 'Pierce', 'Berry', 'Matthews', 'Arnold', 'Wagner', 'Willis', 'Ray', 'Watkins', 'Olson', 'Carroll', 'Duncan', 'Snyder', 'Hart', 'Cunningham', 'Bradley', 'Lane', 'Andrews', 'Ruiz', 'Harper', 'Fox', 'Riley', 'Armstrong', 'Carpenter', 'Weaver', 'Greene', 'Lawrence', 'Elliott', 'Chavez', 'Sims', 'Austin', 'Peters', 'Kelley', 'Franklin', 'Lawson', 'Fields', 'Gutierrez', 'Ryan', 'Schmidt', 'Carr', 'Vasquez', 'Castillo', 'Wheeler', 'Chapman', 'Oliver', 'Montgomery', 'Richards', 'Williamson', 'Johnston', 'Banks', 'Meyer', 'Bishop', 'McCoy', 'Howell', 'Alvarez', 'Morrison', 'Hansen', 'Fernandez', 'Garza', 'Harvey', 'Little', 'Burton', 'Stanley', 'Nguyen', 'George', 'Jacobs', 'Reid', 'Kim', 'Fuller', 'Lynch', 'Dean', 'Gilbert', 'Garrett', 'Romero', 'Welch', 'Larson', 'Frazier', 'Burke', 'Hanson', 'Day', 'Mendoza', 'Moreno', 'Bowman', 'Medina', 'Fowler', 'Brewer', 'Hoffman', 'Carlson', 'Silva', 'Pearson', 'Holland', 'Douglas', 'Fleming', 'Jensen', 'Vargas', 'Byrd', 'Davidson', 'Hopkins', 'May', 'Terry', 'Herrera', 'Wade', 'Soto', 'Walters', 'Curtis', 'Neal', 'Caldwell', 'Lowe', 'Jennings', 'Barnett', 'Graves', 'Jimenez', 'Horton', 'Shelton', 'Barrett', 'Obrien', 'Castro', 'Sutton', 'Gregory', 'McKinney', 'Lucas', 'Miles', 'Craig', 'Rodriquez', 'Chambers', 'Holt', 'Lambert', 'Fletcher', 'Watts', 'Bates', 'Hale', 'Rhodes', 'Pena', 'Beck', 'Newman', 'Haynes', 'McDaniel', 'Mendez', 'Bush', 'Vaughn', 'Parks', 'Dawson', 'Santiago', 'Norris', 'Hardy', 'Love', 'Steele', 'Curry', 'Powers', 'Schultz', 'Barker', 'Guzman', 'Page', 'Munoz', 'Ball', 'Keller', 'Chandler', 'Weber', 'Leonard', 'Walsh', 'Lyons', 'Ramsey', 'Wolfe', 'Schneider', 'Mullins', 'Benson', 'Sharp', 'Bowen', 'Daniel', 'Barber', 'Cummings', 'Hines', 'Baldwin', 'Griffith', 'Valdez', 'Hubbard', 'Salazar', 'Reeves', 'Warner', 'Stevenson', 'Burgess', 'Santos', 'Tate', 'Cross', 'Garner', 'Mann', 'Mack', 'Moss', 'Thornton', 'Dennis', 'McGee', 'Farmer', 'Delgado', 'Aguilar', 'Vega', 'Glover', 'Manning', 'Cohen', 'Harmon', 'Rodgers', 'Robbins', 'Newton', 'Todd', 'Blair', 'Higgins', 'Ingram', 'Reese', 'Cannon', 'Strickland', 'Townsend', 'Potter', 'Goodwin', 'Walton', 'Rowe', 'Hampton', 'Ortega', 'Patton', 'Swanson', 'Joseph', 'Francis', 'Goodman', 'Maldonado', 'Yates', 'Becker', 'Erickson', 'Hodges', 'Rios', 'Conner', 'Adkins', 'Webster', 'Norman', 'Malone', 'Hammond', 'Flowers', 'Cobb', 'Moody', 'Quinn', 'Blake', 'Maxwell', 'Pope', 'Floyd', 'Osborne', 'Paul', 'McCarthy', 'Guerrero', 'Lindsey', 'Estrada', 'Sandoval', 'Gibbs', 'Tyler', 'Gross', 'Fitzgerald', 'Stokes', 'Doyle', 'Sherman', 'Saunders', 'Wise', 'Colon', 'Gill', 'Alvarado', 'Greer', 'Padilla', 'Simon', 'Waters', 'Nunez', 'Ballard', 'Schwartz', 'McBride', 'Houston', 'Christensen', 'Klein', 'Pratt', 'Briggs', 'Parsons', 'McLaughlin', 'Zimmerman', 'French', 'Buchanan', 'Moran', 'Copeland', 'Roy', 'Pittman', 'Brady', 'McCormick', 'Holloway', 'Brock', 'Poole', 'Frank', 'Logan', 'Owen', 'Bass', 'Marsh', 'Drake', 'Wong', 'Jefferson', 'Park', 'Morton', 'Abbott', 'Sparks', 'Patrick', 'Norton', 'Huff', 'Clayton', 'Massey', 'Lloyd', 'Figueroa', 'Carson', 'Bowers', 'Roberson', 'Barton', 'Tran', 'Lamb', 'Harrington', 'Casey', 'Boone', 'Cortez', 'Clarke', 'Mathis', 'Singleton', 'Wilkins', 'Cain', 'Bryan', 'Underwood', 'Hogan', 'McKenzie', 'Collier', 'Luna', 'Phelps', 'McGuire', 'Allison', 'Bridges', 'Wilkerson', 'Nash', 'Summers', 'Atkins'],
                // Data taken from http://www.dati.gov.it/dataset/comune-di-firenze_0164 (first 1000)
            "it": ["Acciai", "Aglietti", "Agostini", "Agresti", "Ahmed", "Aiazzi", "Albanese", "Alberti", "Alessi", "Alfani", "Alinari", "Alterini", "Amato", "Ammannati", "Ancillotti", "Andrei", "Andreini", "Andreoni", "Angeli", "Anichini", "Antonelli", "Antonini", "Arena", "Ariani", "Arnetoli", "Arrighi", "Baccani", "Baccetti", "Bacci", "Bacherini", "Badii", "Baggiani", "Baglioni", "Bagni", "Bagnoli", "Baldassini", "Baldi", "Baldini", "Ballerini", "Balli", "Ballini", "Balloni", "Bambi", "Banchi", "Bandinelli", "Bandini", "Bani", "Barbetti", "Barbieri", "Barchielli", "Bardazzi", "Bardelli", "Bardi", "Barducci", "Bargellini", "Bargiacchi", "Barni", "Baroncelli", "Baroncini", "Barone", "Baroni", "Baronti", "Bartalesi", "Bartoletti", "Bartoli", "Bartolini", "Bartoloni", "Bartolozzi", "Basagni", "Basile", "Bassi", "Batacchi", "Battaglia", "Battaglini", "Bausi", "Becagli", "Becattini", "Becchi", "Becucci", "Bellandi", "Bellesi", "Belli", "Bellini", "Bellucci", "Bencini", "Benedetti", "Benelli", "Beni", "Benini", "Bensi", "Benucci", "Benvenuti", "Berlincioni", "Bernacchioni", "Bernardi", "Bernardini", "Berni", "Bernini", "Bertelli", "Berti", "Bertini", "Bessi", "Betti", "Bettini", "Biagi", "Biagini", "Biagioni", "Biagiotti", "Biancalani", "Bianchi", "Bianchini", "Bianco", "Biffoli", "Bigazzi", "Bigi", "Biliotti", "Billi", "Binazzi", "Bindi", "Bini", "Biondi", "Bizzarri", "Bocci", "Bogani", "Bolognesi", "Bonaiuti", "Bonanni", "Bonciani", "Boncinelli", "Bondi", "Bonechi", "Bongini", "Boni", "Bonini", "Borchi", "Boretti", "Borghi", "Borghini", "Borgioli", "Borri", "Borselli", "Boschi", "Bottai", "Bracci", "Braccini", "Brandi", "Braschi", "Bravi", "Brazzini", "Breschi", "Brilli", "Brizzi", "Brogelli", "Brogi", "Brogioni", "Brunelli", "Brunetti", "Bruni", "Bruno", "Brunori", "Bruschi", "Bucci", "Bucciarelli", "Buccioni", "Bucelli", "Bulli", "Burberi", "Burchi", "Burgassi", "Burroni", "Bussotti", "Buti", "Caciolli", "Caiani", "Calabrese", "Calamai", "Calamandrei", "Caldini", "Calo'", "Calonaci", "Calosi", "Calvelli", "Cambi", "Camiciottoli", "Cammelli", "Cammilli", "Campolmi", "Cantini", "Capanni", "Capecchi", "Caponi", "Cappelletti", "Cappelli", "Cappellini", "Cappugi", "Capretti", "Caputo", "Carbone", "Carboni", "Cardini", "Carlesi", "Carletti", "Carli", "Caroti", "Carotti", "Carrai", "Carraresi", "Carta", "Caruso", "Casalini", "Casati", "Caselli", "Casini", "Castagnoli", "Castellani", "Castelli", "Castellucci", "Catalano", "Catarzi", "Catelani", "Cavaciocchi", "Cavallaro", "Cavallini", "Cavicchi", "Cavini", "Ceccarelli", "Ceccatelli", "Ceccherelli", "Ceccherini", "Cecchi", "Cecchini", "Cecconi", "Cei", "Cellai", "Celli", "Cellini", "Cencetti", "Ceni", "Cenni", "Cerbai", "Cesari", "Ceseri", "Checcacci", "Checchi", "Checcucci", "Cheli", "Chellini", "Chen", "Cheng", "Cherici", "Cherubini", "Chiaramonti", "Chiarantini", "Chiarelli", "Chiari", "Chiarini", "Chiarugi", "Chiavacci", "Chiesi", "Chimenti", "Chini", "Chirici", "Chiti", "Ciabatti", "Ciampi", "Cianchi", "Cianfanelli", "Cianferoni", "Ciani", "Ciapetti", "Ciappi", "Ciardi", "Ciatti", "Cicali", "Ciccone", "Cinelli", "Cini", "Ciobanu", "Ciolli", "Cioni", "Cipriani", "Cirillo", "Cirri", "Ciucchi", "Ciuffi", "Ciulli", "Ciullini", "Clemente", "Cocchi", "Cognome", "Coli", "Collini", "Colombo", "Colzi", "Comparini", "Conforti", "Consigli", "Conte", "Conti", "Contini", "Coppini", "Coppola", "Corsi", "Corsini", "Corti", "Cortini", "Cosi", "Costa", "Costantini", "Costantino", "Cozzi", "Cresci", "Crescioli", "Cresti", "Crini", "Curradi", "D'Agostino", "D'Alessandro", "D'Amico", "D'Angelo", "Daddi", "Dainelli", "Dallai", "Danti", "Davitti", "De Angelis", "De Luca", "De Marco", "De Rosa", "De Santis", "De Simone", "De Vita", "Degl'Innocenti", "Degli Innocenti", "Dei", "Del Lungo", "Del Re", "Di Marco", "Di Stefano", "Dini", "Diop", "Dobre", "Dolfi", "Donati", "Dondoli", "Dong", "Donnini", "Ducci", "Dumitru", "Ermini", "Esposito", "Evangelisti", "Fabbri", "Fabbrini", "Fabbrizzi", "Fabbroni", "Fabbrucci", "Fabiani", "Facchini", "Faggi", "Fagioli", "Failli", "Faini", "Falciani", "Falcini", "Falcone", "Fallani", "Falorni", "Falsini", "Falugiani", "Fancelli", "Fanelli", "Fanetti", "Fanfani", "Fani", "Fantappie'", "Fantechi", "Fanti", "Fantini", "Fantoni", "Farina", "Fattori", "Favilli", "Fedi", "Fei", "Ferrante", "Ferrara", "Ferrari", "Ferraro", "Ferretti", "Ferri", "Ferrini", "Ferroni", "Fiaschi", "Fibbi", "Fiesoli", "Filippi", "Filippini", "Fini", "Fioravanti", "Fiore", "Fiorentini", "Fiorini", "Fissi", "Focardi", "Foggi", "Fontana", "Fontanelli", "Fontani", "Forconi", "Formigli", "Forte", "Forti", "Fortini", "Fossati", "Fossi", "Francalanci", "Franceschi", "Franceschini", "Franchi", "Franchini", "Franci", "Francini", "Francioni", "Franco", "Frassineti", "Frati", "Fratini", "Frilli", "Frizzi", "Frosali", "Frosini", "Frullini", "Fusco", "Fusi", "Gabbrielli", "Gabellini", "Gagliardi", "Galanti", "Galardi", "Galeotti", "Galletti", "Galli", "Gallo", "Gallori", "Gambacciani", "Gargani", "Garofalo", "Garuglieri", "Gashi", "Gasperini", "Gatti", "Gelli", "Gensini", "Gentile", "Gentili", "Geri", "Gerini", "Gheri", "Ghini", "Giachetti", "Giachi", "Giacomelli", "Gianassi", "Giani", "Giannelli", "Giannetti", "Gianni", "Giannini", "Giannoni", "Giannotti", "Giannozzi", "Gigli", "Giordano", "Giorgetti", "Giorgi", "Giovacchini", "Giovannelli", "Giovannetti", "Giovannini", "Giovannoni", "Giuliani", "Giunti", "Giuntini", "Giusti", "Gonnelli", "Goretti", "Gori", "Gradi", "Gramigni", "Grassi", "Grasso", "Graziani", "Grazzini", "Greco", "Grifoni", "Grillo", "Grimaldi", "Grossi", "Gualtieri", "Guarducci", "Guarino", "Guarnieri", "Guasti", "Guerra", "Guerri", "Guerrini", "Guidi", "Guidotti", "He", "Hoxha", "Hu", "Huang", "Iandelli", "Ignesti", "Innocenti", "Jin", "La Rosa", "Lai", "Landi", "Landini", "Lanini", "Lapi", "Lapini", "Lari", "Lascialfari", "Lastrucci", "Latini", "Lazzeri", "Lazzerini", "Lelli", "Lenzi", "Leonardi", "Leoncini", "Leone", "Leoni", "Lepri", "Li", "Liao", "Lin", "Linari", "Lippi", "Lisi", "Livi", "Lombardi", "Lombardini", "Lombardo", "Longo", "Lopez", "Lorenzi", "Lorenzini", "Lorini", "Lotti", "Lu", "Lucchesi", "Lucherini", "Lunghi", "Lupi", "Madiai", "Maestrini", "Maffei", "Maggi", "Maggini", "Magherini", "Magini", "Magnani", "Magnelli", "Magni", "Magnolfi", "Magrini", "Malavolti", "Malevolti", "Manca", "Mancini", "Manetti", "Manfredi", "Mangani", "Mannelli", "Manni", "Mannini", "Mannucci", "Manuelli", "Manzini", "Marcelli", "Marchese", "Marchetti", "Marchi", "Marchiani", "Marchionni", "Marconi", "Marcucci", "Margheri", "Mari", "Mariani", "Marilli", "Marinai", "Marinari", "Marinelli", "Marini", "Marino", "Mariotti", "Marsili", "Martelli", "Martinelli", "Martini", "Martino", "Marzi", "Masi", "Masini", "Masoni", "Massai", "Materassi", "Mattei", "Matteini", "Matteucci", "Matteuzzi", "Mattioli", "Mattolini", "Matucci", "Mauro", "Mazzanti", "Mazzei", "Mazzetti", "Mazzi", "Mazzini", "Mazzocchi", "Mazzoli", "Mazzoni", "Mazzuoli", "Meacci", "Mecocci", "Meini", "Melani", "Mele", "Meli", "Mengoni", "Menichetti", "Meoni", "Merlini", "Messeri", "Messina", "Meucci", "Miccinesi", "Miceli", "Micheli", "Michelini", "Michelozzi", "Migliori", "Migliorini", "Milani", "Miniati", "Misuri", "Monaco", "Montagnani", "Montagni", "Montanari", "Montelatici", "Monti", "Montigiani", "Montini", "Morandi", "Morandini", "Morelli", "Moretti", "Morganti", "Mori", "Morini", "Moroni", "Morozzi", "Mugnai", "Mugnaini", "Mustafa", "Naldi", "Naldini", "Nannelli", "Nanni", "Nannini", "Nannucci", "Nardi", "Nardini", "Nardoni", "Natali", "Ndiaye", "Nencetti", "Nencini", "Nencioni", "Neri", "Nesi", "Nesti", "Niccolai", "Niccoli", "Niccolini", "Nigi", "Nistri", "Nocentini", "Noferini", "Novelli", "Nucci", "Nuti", "Nutini", "Oliva", "Olivieri", "Olmi", "Orlandi", "Orlandini", "Orlando", "Orsini", "Ortolani", "Ottanelli", "Pacciani", "Pace", "Paci", "Pacini", "Pagani", "Pagano", "Paggetti", "Pagliai", "Pagni", "Pagnini", "Paladini", "Palagi", "Palchetti", "Palloni", "Palmieri", "Palumbo", "Pampaloni", "Pancani", "Pandolfi", "Pandolfini", "Panerai", "Panichi", "Paoletti", "Paoli", "Paolini", "Papi", "Papini", "Papucci", "Parenti", "Parigi", "Parisi", "Parri", "Parrini", "Pasquini", "Passeri", "Pecchioli", "Pecorini", "Pellegrini", "Pepi", "Perini", "Perrone", "Peruzzi", "Pesci", "Pestelli", "Petri", "Petrini", "Petrucci", "Pettini", "Pezzati", "Pezzatini", "Piani", "Piazza", "Piazzesi", "Piazzini", "Piccardi", "Picchi", "Piccini", "Piccioli", "Pieraccini", "Pieraccioni", "Pieralli", "Pierattini", "Pieri", "Pierini", "Pieroni", "Pietrini", "Pini", "Pinna", "Pinto", "Pinzani", "Pinzauti", "Piras", "Pisani", "Pistolesi", "Poggesi", "Poggi", "Poggiali", "Poggiolini", "Poli", "Pollastri", "Porciani", "Pozzi", "Pratellesi", "Pratesi", "Prosperi", "Pruneti", "Pucci", "Puccini", "Puccioni", "Pugi", "Pugliese", "Puliti", "Querci", "Quercioli", "Raddi", "Radu", "Raffaelli", "Ragazzini", "Ranfagni", "Ranieri", "Rastrelli", "Raugei", "Raveggi", "Renai", "Renzi", "Rettori", "Ricci", "Ricciardi", "Ridi", "Ridolfi", "Rigacci", "Righi", "Righini", "Rinaldi", "Risaliti", "Ristori", "Rizzo", "Rocchi", "Rocchini", "Rogai", "Romagnoli", "Romanelli", "Romani", "Romano", "Romei", "Romeo", "Romiti", "Romoli", "Romolini", "Rontini", "Rosati", "Roselli", "Rosi", "Rossetti", "Rossi", "Rossini", "Rovai", "Ruggeri", "Ruggiero", "Russo", "Sabatini", "Saccardi", "Sacchetti", "Sacchi", "Sacco", "Salerno", "Salimbeni", "Salucci", "Salvadori", "Salvestrini", "Salvi", "Salvini", "Sanesi", "Sani", "Sanna", "Santi", "Santini", "Santoni", "Santoro", "Santucci", "Sardi", "Sarri", "Sarti", "Sassi", "Sbolci", "Scali", "Scarpelli", "Scarselli", "Scopetani", "Secci", "Selvi", "Senatori", "Senesi", "Serafini", "Sereni", "Serra", "Sestini", "Sguanci", "Sieni", "Signorini", "Silvestri", "Simoncini", "Simonetti", "Simoni", "Singh", "Sodi", "Soldi", "Somigli", "Sorbi", "Sorelli", "Sorrentino", "Sottili", "Spina", "Spinelli", "Staccioli", "Staderini", "Stefanelli", "Stefani", "Stefanini", "Stella", "Susini", "Tacchi", "Tacconi", "Taddei", "Tagliaferri", "Tamburini", "Tanganelli", "Tani", "Tanini", "Tapinassi", "Tarchi", "Tarchiani", "Targioni", "Tassi", "Tassini", "Tempesti", "Terzani", "Tesi", "Testa", "Testi", "Tilli", "Tinti", "Tirinnanzi", "Toccafondi", "Tofanari", "Tofani", "Tognaccini", "Tonelli", "Tonini", "Torelli", "Torrini", "Tosi", "Toti", "Tozzi", "Trambusti", "Trapani", "Tucci", "Turchi", "Ugolini", "Ulivi", "Valente", "Valenti", "Valentini", "Vangelisti", "Vanni", "Vannini", "Vannoni", "Vannozzi", "Vannucchi", "Vannucci", "Ventura", "Venturi", "Venturini", "Vestri", "Vettori", "Vichi", "Viciani", "Vieri", "Vigiani", "Vignoli", "Vignolini", "Vignozzi", "Villani", "Vinci", "Visani", "Vitale", "Vitali", "Viti", "Viviani", "Vivoli", "Volpe", "Volpi", "Wang", "Wu", "Xu", "Yang", "Ye", "Zagli", "Zani", "Zanieri", "Zanobini", "Zecchi", "Zetti", "Zhang", "Zheng", "Zhou", "Zhu", "Zingoni", "Zini", "Zoppi"],
            // http://www.voornamelijk.nl/meest-voorkomende-achternamen-in-nederland-en-amsterdam/
            "nl":["Albers", "Alblas", "Appelman", "Baars", "Baas", "Bakker", "Blank", "Bleeker", "Blok", "Blom", "Boer", "Boers", "Boldewijn", "Boon", "Boot", "Bos", "Bosch", "Bosma", "Bosman", "Bouma", "Bouman", "Bouwman", "Brands", "Brouwer", "Burger", "Buijs", "Buitenhuis", "Ceder", "Cohen", "Dekker", "Dekkers", "Dijkman", "Dijkstra", "Driessen", "Drost", "Engel", "Evers", "Faber", "Franke", "Gerritsen", "Goedhart", "Goossens", "Groen", "Groenenberg", "Groot", "Haan", "Hart", "Heemskerk", "Hendriks", "Hermans", "Hoekstra", "Hofman", "Hopman", "Huisman", "Jacobs", "Jansen", "Janssen", "Jonker", "Jaspers", "Keijzer", "Klaassen", "Klein", "Koek", "Koenders", "Kok", "Kool", "Koopman", "Koopmans", "Koning", "Koster", "Kramer", "Kroon", "Kuijpers", "Kuiper", "Kuipers", "Kurt", "Koster", "Kwakman", "Los", "Lubbers", "Maas", "Markus", "Martens", "Meijer", "Mol", "Molenaar", "Mulder", "Nieuwenhuis", "Peeters", "Peters", "Pengel", "Pieters", "Pool", "Post", "Postma", "Prins", "Pronk", "Reijnders", "Rietveld", "Roest", "Roos", "Sanders", "Schaap", "Scheffer", "Schenk", "Schilder", "Schipper", "Schmidt", "Scholten", "Schouten", "Schut", "Schutte", "Schuurman", "Simons", "Smeets", "Smit", "Smits", "Snel", "Swinkels", "Tas", "Terpstra", "Timmermans", "Tol", "Tromp", "Troost", "Valk", "Veenstra", "Veldkamp", "Verbeek", "Verheul", "Verhoeven", "Vermeer", "Vermeulen", "Verweij", "Vink", "Visser", "Voorn", "Vos", "Wagenaar", "Wiersema", "Willems", "Willemsen", "Witteveen", "Wolff", "Wolters", "Zijlstra", "Zwart", "de Beer", "de Boer", "de Bruijn", "de Bruin", "de Graaf", "de Groot", "de Haan", "de Haas", "de Jager", "de Jong", "de Jonge", "de Koning", "de Lange", "de Leeuw", "de Ridder", "de Rooij", "de Ruiter", "de Vos", "de Vries", "de Waal", "de Wit", "de Zwart", "van Beek", "van Boven", "van Dam", "van Dijk", "van Dongen", "van Doorn", "van Egmond", "van Eijk", "van Es", "van Gelder", "van Gelderen", "van Houten", "van Hulst", "van Kempen", "van Kesteren", "van Leeuwen", "van Loon", "van Mill", "van Noord", "van Ommen", "van Ommeren", "van Oosten", "van Oostveen", "van Rijn", "van Schaik", "van Veen", "van Vliet", "van Wijk", "van Wijngaarden", "van den Poel", "van de Pol", "van den Ploeg", "van de Ven", "van den Berg", "van den Bosch", "van den Brink", "van den Broek", "van den Heuvel", "van der Heijden", "van der Horst", "van der Hulst", "van der Kroon", "van der Laan", "van der Linden", "van der Meer", "van der Meij", "van der Meulen", "van der Molen", "van der Sluis", "van der Spek", "van der Veen", "van der Velde", "van der Velden", "van der Vliet", "van der Wal"],
            // https://surnames.behindthename.com/top/lists/england-wales/1991
            "uk":["Smith","Jones","Williams","Taylor","Brown","Davies","Evans","Wilson","Thomas","Johnson","Roberts","Robinson","Thompson","Wright","Walker","White","Edwards","Hughes","Green","Hall","Lewis","Harris","Clarke","Patel","Jackson","Wood","Turner","Martin","Cooper","Hill","Ward","Morris","Moore","Clark","Lee","King","Baker","Harrison","Morgan","Allen","James","Scott","Phillips","Watson","Davis","Parker","Price","Bennett","Young","Griffiths","Mitchell","Kelly","Cook","Carter","Richardson","Bailey","Collins","Bell","Shaw","Murphy","Miller","Cox","Richards","Khan","Marshall","Anderson","Simpson","Ellis","Adams","Singh","Begum","Wilkinson","Foster","Chapman","Powell","Webb","Rogers","Gray","Mason","Ali","Hunt","Hussain","Campbell","Matthews","Owen","Palmer","Holmes","Mills","Barnes","Knight","Lloyd","Butler","Russell","Barker","Fisher","Stevens","Jenkins","Murray","Dixon","Harvey","Graham","Pearson","Ahmed","Fletcher","Walsh","Kaur","Gibson","Howard","Andrews","Stewart","Elliott","Reynolds","Saunders","Payne","Fox","Ford","Pearce","Day","Brooks","West","Lawrence","Cole","Atkinson","Bradley","Spencer","Gill","Dawson","Ball","Burton","O'brien","Watts","Rose","Booth","Perry","Ryan","Grant","Wells","Armstrong","Francis","Rees","Hayes","Hart","Hudson","Newman","Barrett","Webster","Hunter","Gregory","Carr","Lowe","Page","Marsh","Riley","Dunn","Woods","Parsons","Berry","Stone","Reid","Holland","Hawkins","Harding","Porter","Robertson","Newton","Oliver","Reed","Kennedy","Williamson","Bird","Gardner","Shah","Dean","Lane","Cooke","Bates","Henderson","Parry","Burgess","Bishop","Walton","Burns","Nicholson","Shepherd","Ross","Cross","Long","Freeman","Warren","Nicholls","Hamilton","Byrne","Sutton","Mcdonald","Yates","Hodgson","Robson","Curtis","Hopkins","O'connor","Harper","Coleman","Watkins","Moss","Mccarthy","Chambers","O'neill","Griffin","Sharp","Hardy","Wheeler","Potter","Osborne","Johnston","Gordon","Doyle","Wallace","George","Jordan","Hutchinson","Rowe","Burke","May","Pritchard","Gilbert","Willis","Higgins","Read","Miles","Stevenson","Stephenson","Hammond","Arnold","Buckley","Walters","Hewitt","Barber","Nelson","Slater","Austin","Sullivan","Whitehead","Mann","Frost","Lambert","Stephens","Blake","Akhtar","Lynch","Goodwin","Barton","Woodward","Thomson","Cunningham","Quinn","Barnett","Baxter","Bibi","Clayton","Nash","Greenwood","Jennings","Holt","Kemp","Poole","Gallagher","Bond","Stokes","Tucker","Davidson","Fowler","Heath","Norman","Middleton","Lawson","Banks","French","Stanley","Jarvis","Gibbs","Ferguson","Hayward","Carroll","Douglas","Dickinson","Todd","Barlow","Peters","Lucas","Knowles","Hartley","Miah","Simmons","Morton","Alexander","Field","Morrison","Norris","Townsend","Preston","Hancock","Thornton","Baldwin","Burrows","Briggs","Parkinson","Reeves","Macdonald","Lamb","Black","Abbott","Sanders","Thorpe","Holden","Tomlinson","Perkins","Ashton","Rhodes","Fuller","Howe","Bryant","Vaughan","Dale","Davey","Weston","Bartlett","Whittaker","Davison","Kent","Skinner","Birch","Morley","Daniels","Glover","Howell","Cartwright","Pugh","Humphreys","Goddard","Brennan","Wall","Kirby","Bowen","Savage","Bull","Wong","Dobson","Smart","Wilkins","Kirk","Fraser","Duffy","Hicks","Patterson","Bradshaw","Little","Archer","Warner","Waters","O'sullivan","Farrell","Brookes","Atkins","Kay","Dodd","Bentley","Flynn","John","Schofield","Short","Haynes","Wade","Butcher","Henry","Sanderson","Crawford","Sheppard","Bolton","Coates","Giles","Gould","Houghton","Gibbons","Pratt","Manning","Law","Hooper","Noble","Dyer","Rahman","Clements","Moran","Sykes","Chan","Doherty","Connolly","Joyce","Franklin","Hobbs","Coles","Herbert","Steele","Kerr","Leach","Winter","Owens","Duncan","Naylor","Fleming","Horton","Finch","Fitzgerald","Randall","Carpenter","Marsden","Browne","Garner","Pickering","Hale","Dennis","Vincent","Chadwick","Chandler","Sharpe","Nolan","Lyons","Hurst","Collier","Peacock","Howarth","Faulkner","Rice","Pollard","Welch","Norton","Gough","Sinclair","Blackburn","Bryan","Conway","Power","Cameron","Daly","Allan","Hanson","Gardiner","Boyle","Myers","Turnbull","Wallis","Mahmood","Sims","Swift","Iqbal","Pope","Brady","Chamberlain","Rowley","Tyler","Farmer","Metcalfe","Hilton","Godfrey","Holloway","Parkin","Bray","Talbot","Donnelly","Nixon","Charlton","Benson","Whitehouse","Barry","Hope","Lord","North","Storey","Connor","Potts","Bevan","Hargreaves","Mclean","Mistry","Bruce","Howells","Hyde","Parkes","Wyatt","Fry","Lees","O'donnell","Craig","Forster","Mckenzie","Humphries","Mellor","Carey","Ingram","Summers","Leonard"],
            // https://surnames.behindthename.com/top/lists/germany/2017
            "de": ["Müller","Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Schulz","Hoffmann","Schäfer","Koch","Bauer","Richter","Klein","Wolf","Schröder","Neumann","Schwarz","Zimmermann","Braun","Krüger","Hofmann","Hartmann","Lange","Schmitt","Werner","Schmitz","Krause","Meier","Lehmann","Schmid","Schulze","Maier","Köhler","Herrmann","König","Walter","Mayer","Huber","Kaiser","Fuchs","Peters","Lang","Scholz","Möller","Weiß","Jung","Hahn","Schubert","Vogel","Friedrich","Keller","Günther","Frank","Berger","Winkler","Roth","Beck","Lorenz","Baumann","Franke","Albrecht","Schuster","Simon","Ludwig","Böhm","Winter","Kraus","Martin","Schumacher","Krämer","Vogt","Stein","Jäger","Otto","Sommer","Groß","Seidel","Heinrich","Brandt","Haas","Schreiber","Graf","Schulte","Dietrich","Ziegler","Kuhn","Kühn","Pohl","Engel","Horn","Busch","Bergmann","Thomas","Voigt","Sauer","Arnold","Wolff","Pfeiffer"],
            // http://www.japantimes.co.jp/life/2009/10/11/lifestyle/japans-top-100-most-common-family-names/
            "jp": ["Sato","Suzuki","Takahashi","Tanaka","Watanabe","Ito","Yamamoto","Nakamura","Kobayashi","Kato","Yoshida","Yamada","Sasaki","Yamaguchi","Saito","Matsumoto","Inoue","Kimura","Hayashi","Shimizu","Yamazaki","Mori","Abe","Ikeda","Hashimoto","Yamashita","Ishikawa","Nakajima","Maeda","Fujita","Ogawa","Goto","Okada","Hasegawa","Murakami","Kondo","Ishii","Saito","Sakamoto","Endo","Aoki","Fujii","Nishimura","Fukuda","Ota","Miura","Fujiwara","Okamoto","Matsuda","Nakagawa","Nakano","Harada","Ono","Tamura","Takeuchi","Kaneko","Wada","Nakayama","Ishida","Ueda","Morita","Hara","Shibata","Sakai","Kudo","Yokoyama","Miyazaki","Miyamoto","Uchida","Takagi","Ando","Taniguchi","Ohno","Maruyama","Imai","Takada","Fujimoto","Takeda","Murata","Ueno","Sugiyama","Masuda","Sugawara","Hirano","Kojima","Otsuka","Chiba","Kubo","Matsui","Iwasaki","Sakurai","Kinoshita","Noguchi","Matsuo","Nomura","Kikuchi","Sano","Onishi","Sugimoto","Arai"],
            // http://www.lowchensaustralia.com/names/popular-spanish-names.htm
            "es": ["Garcia","Fernandez","Lopez","Martinez","Gonzalez","Rodriguez","Sanchez","Perez","Martin","Gomez","Ruiz","Diaz","Hernandez","Alvarez","Jimenez","Moreno","Munoz","Alonso","Romero","Navarro","Gutierrez","Torres","Dominguez","Gil","Vazquez","Blanco","Serrano","Ramos","Castro","Suarez","Sanz","Rubio","Ortega","Molina","Delgado","Ortiz","Morales","Ramirez","Marin","Iglesias","Santos","Castillo","Garrido","Calvo","Pena","Cruz","Cano","Nunez","Prieto","Diez","Lozano","Vidal","Pascual","Ferrer","Medina","Vega","Leon","Herrero","Vicente","Mendez","Guerrero","Fuentes","Campos","Nieto","Cortes","Caballero","Ibanez","Lorenzo","Pastor","Gimenez","Saez","Soler","Marquez","Carrasco","Herrera","Montero","Arias","Crespo","Flores","Andres","Aguilar","Hidalgo","Cabrera","Mora","Duran","Velasco","Rey","Pardo","Roman","Vila","Bravo","Merino","Moya","Soto","Izquierdo","Reyes","Redondo","Marcos","Carmona","Menendez"],
            // Data taken from https://fr.wikipedia.org/wiki/Liste_des_noms_de_famille_les_plus_courants_en_France
            "fr": ["Martin","Bernard","Thomas","Petit","Robert","Richard","Durand","Dubois","Moreau","Laurent","Simon","Michel","Lefèvre","Leroy","Roux","David","Bertrand","Morel","Fournier","Girard","Bonnet","Dupont","Lambert","Fontaine","Rousseau","Vincent","Müller","Lefèvre","Faure","André","Mercier","Blanc","Guérin","Boyer","Garnier","Chevalier","François","Legrand","Gauthier","Garcia","Perrin","Robin","Clément","Morin","Nicolas","Henry","Roussel","Matthieu","Gautier","Masson","Marchand","Duval","Denis","Dumont","Marie","Lemaire","Noël","Meyer","Dufour","Meunier","Brun","Blanchard","Giraud","Joly","Rivière","Lucas","Brunet","Gaillard","Barbier","Arnaud","Martínez","Gérard","Roche","Renard","Schmitt","Roy","Leroux","Colin","Vidal","Caron","Picard","Roger","Fabre","Aubert","Lemoine","Renaud","Dumas","Lacroix","Olivier","Philippe","Bourgeois","Pierre","Benoît","Rey","Leclerc","Payet","Rolland","Leclercq","Guillaume","Lecomte","López","Jean","Dupuy","Guillot","Hubert","Berger","Carpentier","Sánchez","Dupuis","Moulin","Louis","Deschamps","Huet","Vasseur","Perez","Boucher","Fleury","Royer","Klein","Jacquet","Adam","Paris","Poirier","Marty","Aubry","Guyot","Carré","Charles","Renault","Charpentier","Ménard","Maillard","Baron","Bertin","Bailly","Hervé","Schneider","Fernández","Le GallGall","Collet","Léger","Bouvier","Julien","Prévost","Millet","Perrot","Daniel","Le RouxRoux","Cousin","Germain","Breton","Besson","Langlois","Rémi","Le GoffGoff","Pelletier","Lévêque","Perrier","Leblanc","Barré","Lebrun","Marchal","Weber","Mallet","Hamon","Boulanger","Jacob","Monnier","Michaud","Rodríguez","Guichard","Gillet","Étienne","Grondin","Poulain","Tessier","Chevallier","Collin","Chauvin","Da SilvaSilva","Bouchet","Gay","Lemaître","Bénard","Maréchal","Humbert","Reynaud","Antoine","Hoarau","Perret","Barthélemy","Cordier","Pichon","Lejeune","Gilbert","Lamy","Delaunay","Pasquier","Carlier","LaporteLaporte"]
        },

        // Data taken from https://github.com/umpirsky/country-list/blob/master/data/en_US/country.json
        countries: [{"name":"Afghanistan","abbreviation":"AF"},{"name":"Åland Islands","abbreviation":"AX"},{"name":"Albania","abbreviation":"AL"},{"name":"Algeria","abbreviation":"DZ"},{"name":"American Samoa","abbreviation":"AS"},{"name":"Andorra","abbreviation":"AD"},{"name":"Angola","abbreviation":"AO"},{"name":"Anguilla","abbreviation":"AI"},{"name":"Antarctica","abbreviation":"AQ"},{"name":"Antigua & Barbuda","abbreviation":"AG"},{"name":"Argentina","abbreviation":"AR"},{"name":"Armenia","abbreviation":"AM"},{"name":"Aruba","abbreviation":"AW"},{"name":"Ascension Island","abbreviation":"AC"},{"name":"Australia","abbreviation":"AU"},{"name":"Austria","abbreviation":"AT"},{"name":"Azerbaijan","abbreviation":"AZ"},{"name":"Bahamas","abbreviation":"BS"},{"name":"Bahrain","abbreviation":"BH"},{"name":"Bangladesh","abbreviation":"BD"},{"name":"Barbados","abbreviation":"BB"},{"name":"Belarus","abbreviation":"BY"},{"name":"Belgium","abbreviation":"BE"},{"name":"Belize","abbreviation":"BZ"},{"name":"Benin","abbreviation":"BJ"},{"name":"Bermuda","abbreviation":"BM"},{"name":"Bhutan","abbreviation":"BT"},{"name":"Bolivia","abbreviation":"BO"},{"name":"Bosnia & Herzegovina","abbreviation":"BA"},{"name":"Botswana","abbreviation":"BW"},{"name":"Brazil","abbreviation":"BR"},{"name":"British Indian Ocean Territory","abbreviation":"IO"},{"name":"British Virgin Islands","abbreviation":"VG"},{"name":"Brunei","abbreviation":"BN"},{"name":"Bulgaria","abbreviation":"BG"},{"name":"Burkina Faso","abbreviation":"BF"},{"name":"Burundi","abbreviation":"BI"},{"name":"Cambodia","abbreviation":"KH"},{"name":"Cameroon","abbreviation":"CM"},{"name":"Canada","abbreviation":"CA"},{"name":"Canary Islands","abbreviation":"IC"},{"name":"Cape Verde","abbreviation":"CV"},{"name":"Caribbean Netherlands","abbreviation":"BQ"},{"name":"Cayman Islands","abbreviation":"KY"},{"name":"Central African Republic","abbreviation":"CF"},{"name":"Ceuta & Melilla","abbreviation":"EA"},{"name":"Chad","abbreviation":"TD"},{"name":"Chile","abbreviation":"CL"},{"name":"China","abbreviation":"CN"},{"name":"Christmas Island","abbreviation":"CX"},{"name":"Cocos (Keeling) Islands","abbreviation":"CC"},{"name":"Colombia","abbreviation":"CO"},{"name":"Comoros","abbreviation":"KM"},{"name":"Congo - Brazzaville","abbreviation":"CG"},{"name":"Congo - Kinshasa","abbreviation":"CD"},{"name":"Cook Islands","abbreviation":"CK"},{"name":"Costa Rica","abbreviation":"CR"},{"name":"Côte d'Ivoire","abbreviation":"CI"},{"name":"Croatia","abbreviation":"HR"},{"name":"Cuba","abbreviation":"CU"},{"name":"Curaçao","abbreviation":"CW"},{"name":"Cyprus","abbreviation":"CY"},{"name":"Czech Republic","abbreviation":"CZ"},{"name":"Denmark","abbreviation":"DK"},{"name":"Diego Garcia","abbreviation":"DG"},{"name":"Djibouti","abbreviation":"DJ"},{"name":"Dominica","abbreviation":"DM"},{"name":"Dominican Republic","abbreviation":"DO"},{"name":"Ecuador","abbreviation":"EC"},{"name":"Egypt","abbreviation":"EG"},{"name":"El Salvador","abbreviation":"SV"},{"name":"Equatorial Guinea","abbreviation":"GQ"},{"name":"Eritrea","abbreviation":"ER"},{"name":"Estonia","abbreviation":"EE"},{"name":"Ethiopia","abbreviation":"ET"},{"name":"Falkland Islands","abbreviation":"FK"},{"name":"Faroe Islands","abbreviation":"FO"},{"name":"Fiji","abbreviation":"FJ"},{"name":"Finland","abbreviation":"FI"},{"name":"France","abbreviation":"FR"},{"name":"French Guiana","abbreviation":"GF"},{"name":"French Polynesia","abbreviation":"PF"},{"name":"French Southern Territories","abbreviation":"TF"},{"name":"Gabon","abbreviation":"GA"},{"name":"Gambia","abbreviation":"GM"},{"name":"Georgia","abbreviation":"GE"},{"name":"Germany","abbreviation":"DE"},{"name":"Ghana","abbreviation":"GH"},{"name":"Gibraltar","abbreviation":"GI"},{"name":"Greece","abbreviation":"GR"},{"name":"Greenland","abbreviation":"GL"},{"name":"Grenada","abbreviation":"GD"},{"name":"Guadeloupe","abbreviation":"GP"},{"name":"Guam","abbreviation":"GU"},{"name":"Guatemala","abbreviation":"GT"},{"name":"Guernsey","abbreviation":"GG"},{"name":"Guinea","abbreviation":"GN"},{"name":"Guinea-Bissau","abbreviation":"GW"},{"name":"Guyana","abbreviation":"GY"},{"name":"Haiti","abbreviation":"HT"},{"name":"Honduras","abbreviation":"HN"},{"name":"Hong Kong SAR China","abbreviation":"HK"},{"name":"Hungary","abbreviation":"HU"},{"name":"Iceland","abbreviation":"IS"},{"name":"India","abbreviation":"IN"},{"name":"Indonesia","abbreviation":"ID"},{"name":"Iran","abbreviation":"IR"},{"name":"Iraq","abbreviation":"IQ"},{"name":"Ireland","abbreviation":"IE"},{"name":"Isle of Man","abbreviation":"IM"},{"name":"Israel","abbreviation":"IL"},{"name":"Italy","abbreviation":"IT"},{"name":"Jamaica","abbreviation":"JM"},{"name":"Japan","abbreviation":"JP"},{"name":"Jersey","abbreviation":"JE"},{"name":"Jordan","abbreviation":"JO"},{"name":"Kazakhstan","abbreviation":"KZ"},{"name":"Kenya","abbreviation":"KE"},{"name":"Kiribati","abbreviation":"KI"},{"name":"Kosovo","abbreviation":"XK"},{"name":"Kuwait","abbreviation":"KW"},{"name":"Kyrgyzstan","abbreviation":"KG"},{"name":"Laos","abbreviation":"LA"},{"name":"Latvia","abbreviation":"LV"},{"name":"Lebanon","abbreviation":"LB"},{"name":"Lesotho","abbreviation":"LS"},{"name":"Liberia","abbreviation":"LR"},{"name":"Libya","abbreviation":"LY"},{"name":"Liechtenstein","abbreviation":"LI"},{"name":"Lithuania","abbreviation":"LT"},{"name":"Luxembourg","abbreviation":"LU"},{"name":"Macau SAR China","abbreviation":"MO"},{"name":"Macedonia","abbreviation":"MK"},{"name":"Madagascar","abbreviation":"MG"},{"name":"Malawi","abbreviation":"MW"},{"name":"Malaysia","abbreviation":"MY"},{"name":"Maldives","abbreviation":"MV"},{"name":"Mali","abbreviation":"ML"},{"name":"Malta","abbreviation":"MT"},{"name":"Marshall Islands","abbreviation":"MH"},{"name":"Martinique","abbreviation":"MQ"},{"name":"Mauritania","abbreviation":"MR"},{"name":"Mauritius","abbreviation":"MU"},{"name":"Mayotte","abbreviation":"YT"},{"name":"Mexico","abbreviation":"MX"},{"name":"Micronesia","abbreviation":"FM"},{"name":"Moldova","abbreviation":"MD"},{"name":"Monaco","abbreviation":"MC"},{"name":"Mongolia","abbreviation":"MN"},{"name":"Montenegro","abbreviation":"ME"},{"name":"Montserrat","abbreviation":"MS"},{"name":"Morocco","abbreviation":"MA"},{"name":"Mozambique","abbreviation":"MZ"},{"name":"Myanmar (Burma)","abbreviation":"MM"},{"name":"Namibia","abbreviation":"NA"},{"name":"Nauru","abbreviation":"NR"},{"name":"Nepal","abbreviation":"NP"},{"name":"Netherlands","abbreviation":"NL"},{"name":"New Caledonia","abbreviation":"NC"},{"name":"New Zealand","abbreviation":"NZ"},{"name":"Nicaragua","abbreviation":"NI"},{"name":"Niger","abbreviation":"NE"},{"name":"Nigeria","abbreviation":"NG"},{"name":"Niue","abbreviation":"NU"},{"name":"Norfolk Island","abbreviation":"NF"},{"name":"North Korea","abbreviation":"KP"},{"name":"Northern Mariana Islands","abbreviation":"MP"},{"name":"Norway","abbreviation":"NO"},{"name":"Oman","abbreviation":"OM"},{"name":"Pakistan","abbreviation":"PK"},{"name":"Palau","abbreviation":"PW"},{"name":"Palestinian Territories","abbreviation":"PS"},{"name":"Panama","abbreviation":"PA"},{"name":"Papua New Guinea","abbreviation":"PG"},{"name":"Paraguay","abbreviation":"PY"},{"name":"Peru","abbreviation":"PE"},{"name":"Philippines","abbreviation":"PH"},{"name":"Pitcairn Islands","abbreviation":"PN"},{"name":"Poland","abbreviation":"PL"},{"name":"Portugal","abbreviation":"PT"},{"name":"Puerto Rico","abbreviation":"PR"},{"name":"Qatar","abbreviation":"QA"},{"name":"Réunion","abbreviation":"RE"},{"name":"Romania","abbreviation":"RO"},{"name":"Russia","abbreviation":"RU"},{"name":"Rwanda","abbreviation":"RW"},{"name":"Samoa","abbreviation":"WS"},{"name":"San Marino","abbreviation":"SM"},{"name":"São Tomé and Príncipe","abbreviation":"ST"},{"name":"Saudi Arabia","abbreviation":"SA"},{"name":"Senegal","abbreviation":"SN"},{"name":"Serbia","abbreviation":"RS"},{"name":"Seychelles","abbreviation":"SC"},{"name":"Sierra Leone","abbreviation":"SL"},{"name":"Singapore","abbreviation":"SG"},{"name":"Sint Maarten","abbreviation":"SX"},{"name":"Slovakia","abbreviation":"SK"},{"name":"Slovenia","abbreviation":"SI"},{"name":"Solomon Islands","abbreviation":"SB"},{"name":"Somalia","abbreviation":"SO"},{"name":"South Africa","abbreviation":"ZA"},{"name":"South Georgia & South Sandwich Islands","abbreviation":"GS"},{"name":"South Korea","abbreviation":"KR"},{"name":"South Sudan","abbreviation":"SS"},{"name":"Spain","abbreviation":"ES"},{"name":"Sri Lanka","abbreviation":"LK"},{"name":"St. Barthélemy","abbreviation":"BL"},{"name":"St. Helena","abbreviation":"SH"},{"name":"St. Kitts & Nevis","abbreviation":"KN"},{"name":"St. Lucia","abbreviation":"LC"},{"name":"St. Martin","abbreviation":"MF"},{"name":"St. Pierre & Miquelon","abbreviation":"PM"},{"name":"St. Vincent & Grenadines","abbreviation":"VC"},{"name":"Sudan","abbreviation":"SD"},{"name":"Suriname","abbreviation":"SR"},{"name":"Svalbard & Jan Mayen","abbreviation":"SJ"},{"name":"Swaziland","abbreviation":"SZ"},{"name":"Sweden","abbreviation":"SE"},{"name":"Switzerland","abbreviation":"CH"},{"name":"Syria","abbreviation":"SY"},{"name":"Taiwan","abbreviation":"TW"},{"name":"Tajikistan","abbreviation":"TJ"},{"name":"Tanzania","abbreviation":"TZ"},{"name":"Thailand","abbreviation":"TH"},{"name":"Timor-Leste","abbreviation":"TL"},{"name":"Togo","abbreviation":"TG"},{"name":"Tokelau","abbreviation":"TK"},{"name":"Tonga","abbreviation":"TO"},{"name":"Trinidad & Tobago","abbreviation":"TT"},{"name":"Tristan da Cunha","abbreviation":"TA"},{"name":"Tunisia","abbreviation":"TN"},{"name":"Turkey","abbreviation":"TR"},{"name":"Turkmenistan","abbreviation":"TM"},{"name":"Turks & Caicos Islands","abbreviation":"TC"},{"name":"Tuvalu","abbreviation":"TV"},{"name":"U.S. Outlying Islands","abbreviation":"UM"},{"name":"U.S. Virgin Islands","abbreviation":"VI"},{"name":"Uganda","abbreviation":"UG"},{"name":"Ukraine","abbreviation":"UA"},{"name":"United Arab Emirates","abbreviation":"AE"},{"name":"United Kingdom","abbreviation":"GB"},{"name":"United States","abbreviation":"US"},{"name":"Uruguay","abbreviation":"UY"},{"name":"Uzbekistan","abbreviation":"UZ"},{"name":"Vanuatu","abbreviation":"VU"},{"name":"Vatican City","abbreviation":"VA"},{"name":"Venezuela","abbreviation":"VE"},{"name":"Vietnam","abbreviation":"VN"},{"name":"Wallis & Futuna","abbreviation":"WF"},{"name":"Western Sahara","abbreviation":"EH"},{"name":"Yemen","abbreviation":"YE"},{"name":"Zambia","abbreviation":"ZM"},{"name":"Zimbabwe","abbreviation":"ZW"}],

                counties: {
            // Data taken from http://www.downloadexcelfiles.com/gb_en/download-excel-file-list-counties-uk
            "uk": [
                {name: 'Bath and North East Somerset'},
                {name: 'Aberdeenshire'},
                {name: 'Anglesey'},
                {name: 'Angus'},
                {name: 'Bedford'},
                {name: 'Blackburn with Darwen'},
                {name: 'Blackpool'},
                {name: 'Bournemouth'},
                {name: 'Bracknell Forest'},
                {name: 'Brighton & Hove'},
                {name: 'Bristol'},
                {name: 'Buckinghamshire'},
                {name: 'Cambridgeshire'},
                {name: 'Carmarthenshire'},
                {name: 'Central Bedfordshire'},
                {name: 'Ceredigion'},
                {name: 'Cheshire East'},
                {name: 'Cheshire West and Chester'},
                {name: 'Clackmannanshire'},
                {name: 'Conwy'},
                {name: 'Cornwall'},
                {name: 'County Antrim'},
                {name: 'County Armagh'},
                {name: 'County Down'},
                {name: 'County Durham'},
                {name: 'County Fermanagh'},
                {name: 'County Londonderry'},
                {name: 'County Tyrone'},
                {name: 'Cumbria'},
                {name: 'Darlington'},
                {name: 'Denbighshire'},
                {name: 'Derby'},
                {name: 'Derbyshire'},
                {name: 'Devon'},
                {name: 'Dorset'},
                {name: 'Dumfries and Galloway'},
                {name: 'Dundee'},
                {name: 'East Lothian'},
                {name: 'East Riding of Yorkshire'},
                {name: 'East Sussex'},
                {name: 'Edinburgh?'},
                {name: 'Essex'},
                {name: 'Falkirk'},
                {name: 'Fife'},
                {name: 'Flintshire'},
                {name: 'Gloucestershire'},
                {name: 'Greater London'},
                {name: 'Greater Manchester'},
                {name: 'Gwent'},
                {name: 'Gwynedd'},
                {name: 'Halton'},
                {name: 'Hampshire'},
                {name: 'Hartlepool'},
                {name: 'Herefordshire'},
                {name: 'Hertfordshire'},
                {name: 'Highlands'},
                {name: 'Hull'},
                {name: 'Isle of Wight'},
                {name: 'Isles of Scilly'},
                {name: 'Kent'},
                {name: 'Lancashire'},
                {name: 'Leicester'},
                {name: 'Leicestershire'},
                {name: 'Lincolnshire'},
                {name: 'Lothian'},
                {name: 'Luton'},
                {name: 'Medway'},
                {name: 'Merseyside'},
                {name: 'Mid Glamorgan'},
                {name: 'Middlesbrough'},
                {name: 'Milton Keynes'},
                {name: 'Monmouthshire'},
                {name: 'Moray'},
                {name: 'Norfolk'},
                {name: 'North East Lincolnshire'},
                {name: 'North Lincolnshire'},
                {name: 'North Somerset'},
                {name: 'North Yorkshire'},
                {name: 'Northamptonshire'},
                {name: 'Northumberland'},
                {name: 'Nottingham'},
                {name: 'Nottinghamshire'},
                {name: 'Oxfordshire'},
                {name: 'Pembrokeshire'},
                {name: 'Perth and Kinross'},
                {name: 'Peterborough'},
                {name: 'Plymouth'},
                {name: 'Poole'},
                {name: 'Portsmouth'},
                {name: 'Powys'},
                {name: 'Reading'},
                {name: 'Redcar and Cleveland'},
                {name: 'Rutland'},
                {name: 'Scottish Borders'},
                {name: 'Shropshire'},
                {name: 'Slough'},
                {name: 'Somerset'},
                {name: 'South Glamorgan'},
                {name: 'South Gloucestershire'},
                {name: 'South Yorkshire'},
                {name: 'Southampton'},
                {name: 'Southend-on-Sea'},
                {name: 'Staffordshire'},
                {name: 'Stirlingshire'},
                {name: 'Stockton-on-Tees'},
                {name: 'Stoke-on-Trent'},
                {name: 'Strathclyde'},
                {name: 'Suffolk'},
                {name: 'Surrey'},
                {name: 'Swindon'},
                {name: 'Telford and Wrekin'},
                {name: 'Thurrock'},
                {name: 'Torbay'},
                {name: 'Tyne and Wear'},
                {name: 'Warrington'},
                {name: 'Warwickshire'},
                {name: 'West Berkshire'},
                {name: 'West Glamorgan'},
                {name: 'West Lothian'},
                {name: 'West Midlands'},
                {name: 'West Sussex'},
                {name: 'West Yorkshire'},
                {name: 'Western Isles'},
                {name: 'Wiltshire'},
                {name: 'Windsor and Maidenhead'},
                {name: 'Wokingham'},
                {name: 'Worcestershire'},
                {name: 'Wrexham'},
                {name: 'York'}]
                                },
        provinces: {
            "ca": [
                {name: 'Alberta', abbreviation: 'AB'},
                {name: 'British Columbia', abbreviation: 'BC'},
                {name: 'Manitoba', abbreviation: 'MB'},
                {name: 'New Brunswick', abbreviation: 'NB'},
                {name: 'Newfoundland and Labrador', abbreviation: 'NL'},
                {name: 'Nova Scotia', abbreviation: 'NS'},
                {name: 'Ontario', abbreviation: 'ON'},
                {name: 'Prince Edward Island', abbreviation: 'PE'},
                {name: 'Quebec', abbreviation: 'QC'},
                {name: 'Saskatchewan', abbreviation: 'SK'},

                // The case could be made that the following are not actually provinces
                // since they are technically considered "territories" however they all
                // look the same on an envelope!
                {name: 'Northwest Territories', abbreviation: 'NT'},
                {name: 'Nunavut', abbreviation: 'NU'},
                {name: 'Yukon', abbreviation: 'YT'}
            ],
            "it": [
                { name: "Agrigento", abbreviation: "AG", code: 84 },
                { name: "Alessandria", abbreviation: "AL", code: 6 },
                { name: "Ancona", abbreviation: "AN", code: 42 },
                { name: "Aosta", abbreviation: "AO", code: 7 },
                { name: "L'Aquila", abbreviation: "AQ", code: 66 },
                { name: "Arezzo", abbreviation: "AR", code: 51 },
                { name: "Ascoli-Piceno", abbreviation: "AP", code: 44 },
                { name: "Asti", abbreviation: "AT", code: 5 },
                { name: "Avellino", abbreviation: "AV", code: 64 },
                { name: "Bari", abbreviation: "BA", code: 72 },
                { name: "Barletta-Andria-Trani", abbreviation: "BT", code: 72 },
                { name: "Belluno", abbreviation: "BL", code: 25 },
                { name: "Benevento", abbreviation: "BN", code: 62 },
                { name: "Bergamo", abbreviation: "BG", code: 16 },
                { name: "Biella", abbreviation: "BI", code: 96 },
                { name: "Bologna", abbreviation: "BO", code: 37 },
                { name: "Bolzano", abbreviation: "BZ", code: 21 },
                { name: "Brescia", abbreviation: "BS", code: 17 },
                { name: "Brindisi", abbreviation: "BR", code: 74 },
                { name: "Cagliari", abbreviation: "CA", code: 92 },
                { name: "Caltanissetta", abbreviation: "CL", code: 85 },
                { name: "Campobasso", abbreviation: "CB", code: 70 },
                { name: "Carbonia Iglesias", abbreviation: "CI", code: 70 },
                { name: "Caserta", abbreviation: "CE", code: 61 },
                { name: "Catania", abbreviation: "CT", code: 87 },
                { name: "Catanzaro", abbreviation: "CZ", code: 79 },
                { name: "Chieti", abbreviation: "CH", code: 69 },
                { name: "Como", abbreviation: "CO", code: 13 },
                { name: "Cosenza", abbreviation: "CS", code: 78 },
                { name: "Cremona", abbreviation: "CR", code: 19 },
                { name: "Crotone", abbreviation: "KR", code: 101 },
                { name: "Cuneo", abbreviation: "CN", code: 4 },
                { name: "Enna", abbreviation: "EN", code: 86 },
                { name: "Fermo", abbreviation: "FM", code: 86 },
                { name: "Ferrara", abbreviation: "FE", code: 38 },
                { name: "Firenze", abbreviation: "FI", code: 48 },
                { name: "Foggia", abbreviation: "FG", code: 71 },
                { name: "Forli-Cesena", abbreviation: "FC", code: 71 },
                { name: "Frosinone", abbreviation: "FR", code: 60 },
                { name: "Genova", abbreviation: "GE", code: 10 },
                { name: "Gorizia", abbreviation: "GO", code: 31 },
                { name: "Grosseto", abbreviation: "GR", code: 53 },
                { name: "Imperia", abbreviation: "IM", code: 8 },
                { name: "Isernia", abbreviation: "IS", code: 94 },
                { name: "La-Spezia", abbreviation: "SP", code: 66 },
                { name: "Latina", abbreviation: "LT", code: 59 },
                { name: "Lecce", abbreviation: "LE", code: 75 },
                { name: "Lecco", abbreviation: "LC", code: 97 },
                { name: "Livorno", abbreviation: "LI", code: 49 },
                { name: "Lodi", abbreviation: "LO", code: 98 },
                { name: "Lucca", abbreviation: "LU", code: 46 },
                { name: "Macerata", abbreviation: "MC", code: 43 },
                { name: "Mantova", abbreviation: "MN", code: 20 },
                { name: "Massa-Carrara", abbreviation: "MS", code: 45 },
                { name: "Matera", abbreviation: "MT", code: 77 },
                { name: "Medio Campidano", abbreviation: "VS", code: 77 },
                { name: "Messina", abbreviation: "ME", code: 83 },
                { name: "Milano", abbreviation: "MI", code: 15 },
                { name: "Modena", abbreviation: "MO", code: 36 },
                { name: "Monza-Brianza", abbreviation: "MB", code: 36 },
                { name: "Napoli", abbreviation: "NA", code: 63 },
                { name: "Novara", abbreviation: "NO", code: 3 },
                { name: "Nuoro", abbreviation: "NU", code: 91 },
                { name: "Ogliastra", abbreviation: "OG", code: 91 },
                { name: "Olbia Tempio", abbreviation: "OT", code: 91 },
                { name: "Oristano", abbreviation: "OR", code: 95 },
                { name: "Padova", abbreviation: "PD", code: 28 },
                { name: "Palermo", abbreviation: "PA", code: 82 },
                { name: "Parma", abbreviation: "PR", code: 34 },
                { name: "Pavia", abbreviation: "PV", code: 18 },
                { name: "Perugia", abbreviation: "PG", code: 54 },
                { name: "Pesaro-Urbino", abbreviation: "PU", code: 41 },
                { name: "Pescara", abbreviation: "PE", code: 68 },
                { name: "Piacenza", abbreviation: "PC", code: 33 },
                { name: "Pisa", abbreviation: "PI", code: 50 },
                { name: "Pistoia", abbreviation: "PT", code: 47 },
                { name: "Pordenone", abbreviation: "PN", code: 93 },
                { name: "Potenza", abbreviation: "PZ", code: 76 },
                { name: "Prato", abbreviation: "PO", code: 100 },
                { name: "Ragusa", abbreviation: "RG", code: 88 },
                { name: "Ravenna", abbreviation: "RA", code: 39 },
                { name: "Reggio-Calabria", abbreviation: "RC", code: 35 },
                { name: "Reggio-Emilia", abbreviation: "RE", code: 35 },
                { name: "Rieti", abbreviation: "RI", code: 57 },
                { name: "Rimini", abbreviation: "RN", code: 99 },
                { name: "Roma", abbreviation: "Roma", code: 58 },
                { name: "Rovigo", abbreviation: "RO", code: 29 },
                { name: "Salerno", abbreviation: "SA", code: 65 },
                { name: "Sassari", abbreviation: "SS", code: 90 },
                { name: "Savona", abbreviation: "SV", code: 9 },
                { name: "Siena", abbreviation: "SI", code: 52 },
                { name: "Siracusa", abbreviation: "SR", code: 89 },
                { name: "Sondrio", abbreviation: "SO", code: 14 },
                { name: "Taranto", abbreviation: "TA", code: 73 },
                { name: "Teramo", abbreviation: "TE", code: 67 },
                { name: "Terni", abbreviation: "TR", code: 55 },
                { name: "Torino", abbreviation: "TO", code: 1 },
                { name: "Trapani", abbreviation: "TP", code: 81 },
                { name: "Trento", abbreviation: "TN", code: 22 },
                { name: "Treviso", abbreviation: "TV", code: 26 },
                { name: "Trieste", abbreviation: "TS", code: 32 },
                { name: "Udine", abbreviation: "UD", code: 30 },
                { name: "Varese", abbreviation: "VA", code: 12 },
                { name: "Venezia", abbreviation: "VE", code: 27 },
                { name: "Verbania", abbreviation: "VB", code: 27 },
                { name: "Vercelli", abbreviation: "VC", code: 2 },
                { name: "Verona", abbreviation: "VR", code: 23 },
                { name: "Vibo-Valentia", abbreviation: "VV", code: 102 },
                { name: "Vicenza", abbreviation: "VI", code: 24 },
                { name: "Viterbo", abbreviation: "VT", code: 56 }
            ]
        },

            // from: https://github.com/samsargent/Useful-Autocomplete-Data/blob/master/data/nationalities.json
        nationalities: [
           {name: 'Afghan'},
           {name: 'Albanian'},
           {name: 'Algerian'},
           {name: 'American'},
           {name: 'Andorran'},
           {name: 'Angolan'},
           {name: 'Antiguans'},
           {name: 'Argentinean'},
           {name: 'Armenian'},
           {name: 'Australian'},
           {name: 'Austrian'},
           {name: 'Azerbaijani'},
           {name: 'Bahami'},
           {name: 'Bahraini'},
           {name: 'Bangladeshi'},
           {name: 'Barbadian'},
           {name: 'Barbudans'},
           {name: 'Batswana'},
           {name: 'Belarusian'},
           {name: 'Belgian'},
           {name: 'Belizean'},
           {name: 'Beninese'},
           {name: 'Bhutanese'},
           {name: 'Bolivian'},
           {name: 'Bosnian'},
           {name: 'Brazilian'},
           {name: 'British'},
           {name: 'Bruneian'},
           {name: 'Bulgarian'},
           {name: 'Burkinabe'},
           {name: 'Burmese'},
           {name: 'Burundian'},
           {name: 'Cambodian'},
           {name: 'Cameroonian'},
           {name: 'Canadian'},
           {name: 'Cape Verdean'},
           {name: 'Central African'},
           {name: 'Chadian'},
           {name: 'Chilean'},
           {name: 'Chinese'},
           {name: 'Colombian'},
           {name: 'Comoran'},
           {name: 'Congolese'},
           {name: 'Costa Rican'},
           {name: 'Croatian'},
           {name: 'Cuban'},
           {name: 'Cypriot'},
           {name: 'Czech'},
           {name: 'Danish'},
           {name: 'Djibouti'},
           {name: 'Dominican'},
           {name: 'Dutch'},
           {name: 'East Timorese'},
           {name: 'Ecuadorean'},
           {name: 'Egyptian'},
           {name: 'Emirian'},
           {name: 'Equatorial Guinean'},
           {name: 'Eritrean'},
           {name: 'Estonian'},
           {name: 'Ethiopian'},
           {name: 'Fijian'},
           {name: 'Filipino'},
           {name: 'Finnish'},
           {name: 'French'},
           {name: 'Gabonese'},
           {name: 'Gambian'},
           {name: 'Georgian'},
           {name: 'German'},
           {name: 'Ghanaian'},
           {name: 'Greek'},
           {name: 'Grenadian'},
           {name: 'Guatemalan'},
           {name: 'Guinea-Bissauan'},
           {name: 'Guinean'},
           {name: 'Guyanese'},
           {name: 'Haitian'},
           {name: 'Herzegovinian'},
           {name: 'Honduran'},
           {name: 'Hungarian'},
           {name: 'I-Kiribati'},
           {name: 'Icelander'},
           {name: 'Indian'},
           {name: 'Indonesian'},
           {name: 'Iranian'},
           {name: 'Iraqi'},
           {name: 'Irish'},
           {name: 'Israeli'},
           {name: 'Italian'},
           {name: 'Ivorian'},
           {name: 'Jamaican'},
           {name: 'Japanese'},
           {name: 'Jordanian'},
           {name: 'Kazakhstani'},
           {name: 'Kenyan'},
           {name: 'Kittian and Nevisian'},
           {name: 'Kuwaiti'},
           {name: 'Kyrgyz'},
           {name: 'Laotian'},
           {name: 'Latvian'},
           {name: 'Lebanese'},
           {name: 'Liberian'},
           {name: 'Libyan'},
           {name: 'Liechtensteiner'},
           {name: 'Lithuanian'},
           {name: 'Luxembourger'},
           {name: 'Macedonian'},
           {name: 'Malagasy'},
           {name: 'Malawian'},
           {name: 'Malaysian'},
           {name: 'Maldivan'},
           {name: 'Malian'},
           {name: 'Maltese'},
           {name: 'Marshallese'},
           {name: 'Mauritanian'},
           {name: 'Mauritian'},
           {name: 'Mexican'},
           {name: 'Micronesian'},
           {name: 'Moldovan'},
           {name: 'Monacan'},
           {name: 'Mongolian'},
           {name: 'Moroccan'},
           {name: 'Mosotho'},
           {name: 'Motswana'},
           {name: 'Mozambican'},
           {name: 'Namibian'},
           {name: 'Nauruan'},
           {name: 'Nepalese'},
           {name: 'New Zealander'},
           {name: 'Nicaraguan'},
           {name: 'Nigerian'},
           {name: 'Nigerien'},
           {name: 'North Korean'},
           {name: 'Northern Irish'},
           {name: 'Norwegian'},
           {name: 'Omani'},
           {name: 'Pakistani'},
           {name: 'Palauan'},
           {name: 'Panamanian'},
           {name: 'Papua New Guinean'},
           {name: 'Paraguayan'},
           {name: 'Peruvian'},
           {name: 'Polish'},
           {name: 'Portuguese'},
           {name: 'Qatari'},
           {name: 'Romani'},
           {name: 'Russian'},
           {name: 'Rwandan'},
           {name: 'Saint Lucian'},
           {name: 'Salvadoran'},
           {name: 'Samoan'},
           {name: 'San Marinese'},
           {name: 'Sao Tomean'},
           {name: 'Saudi'},
           {name: 'Scottish'},
           {name: 'Senegalese'},
           {name: 'Serbian'},
           {name: 'Seychellois'},
           {name: 'Sierra Leonean'},
           {name: 'Singaporean'},
           {name: 'Slovakian'},
           {name: 'Slovenian'},
           {name: 'Solomon Islander'},
           {name: 'Somali'},
           {name: 'South African'},
           {name: 'South Korean'},
           {name: 'Spanish'},
           {name: 'Sri Lankan'},
           {name: 'Sudanese'},
           {name: 'Surinamer'},
           {name: 'Swazi'},
           {name: 'Swedish'},
           {name: 'Swiss'},
           {name: 'Syrian'},
           {name: 'Taiwanese'},
           {name: 'Tajik'},
           {name: 'Tanzanian'},
           {name: 'Thai'},
           {name: 'Togolese'},
           {name: 'Tongan'},
           {name: 'Trinidadian or Tobagonian'},
           {name: 'Tunisian'},
           {name: 'Turkish'},
           {name: 'Tuvaluan'},
           {name: 'Ugandan'},
           {name: 'Ukrainian'},
           {name: 'Uruguaya'},
           {name: 'Uzbekistani'},
           {name: 'Venezuela'},
           {name: 'Vietnamese'},
           {name: 'Wels'},
           {name: 'Yemenit'},
           {name: 'Zambia'},
           {name: 'Zimbabwe'},
        ],
          // http://www.loc.gov/standards/iso639-2/php/code_list.php (ISO-639-1 codes)
        locale_languages: [
          "aa",
          "ab",
          "ae",
          "af",
          "ak",
          "am",
          "an",
          "ar",
          "as",
          "av",
          "ay",
          "az",
          "ba",
          "be",
          "bg",
          "bh",
          "bi",
          "bm",
          "bn",
          "bo",
          "br",
          "bs",
          "ca",
          "ce",
          "ch",
          "co",
          "cr",
          "cs",
          "cu",
          "cv",
          "cy",
          "da",
          "de",
          "dv",
          "dz",
          "ee",
          "el",
          "en",
          "eo",
          "es",
          "et",
          "eu",
          "fa",
          "ff",
          "fi",
          "fj",
          "fo",
          "fr",
          "fy",
          "ga",
          "gd",
          "gl",
          "gn",
          "gu",
          "gv",
          "ha",
          "he",
          "hi",
          "ho",
          "hr",
          "ht",
          "hu",
          "hy",
          "hz",
          "ia",
          "id",
          "ie",
          "ig",
          "ii",
          "ik",
          "io",
          "is",
          "it",
          "iu",
          "ja",
          "jv",
          "ka",
          "kg",
          "ki",
          "kj",
          "kk",
          "kl",
          "km",
          "kn",
          "ko",
          "kr",
          "ks",
          "ku",
          "kv",
          "kw",
          "ky",
          "la",
          "lb",
          "lg",
          "li",
          "ln",
          "lo",
          "lt",
          "lu",
          "lv",
          "mg",
          "mh",
          "mi",
          "mk",
          "ml",
          "mn",
          "mr",
          "ms",
          "mt",
          "my",
          "na",
          "nb",
          "nd",
          "ne",
          "ng",
          "nl",
          "nn",
          "no",
          "nr",
          "nv",
          "ny",
          "oc",
          "oj",
          "om",
          "or",
          "os",
          "pa",
          "pi",
          "pl",
          "ps",
          "pt",
          "qu",
          "rm",
          "rn",
          "ro",
          "ru",
          "rw",
          "sa",
          "sc",
          "sd",
          "se",
          "sg",
          "si",
          "sk",
          "sl",
          "sm",
          "sn",
          "so",
          "sq",
          "sr",
          "ss",
          "st",
          "su",
          "sv",
          "sw",
          "ta",
          "te",
          "tg",
          "th",
          "ti",
          "tk",
          "tl",
          "tn",
          "to",
          "tr",
          "ts",
          "tt",
          "tw",
          "ty",
          "ug",
          "uk",
          "ur",
          "uz",
          "ve",
          "vi",
          "vo",
          "wa",
          "wo",
          "xh",
          "yi",
          "yo",
          "za",
          "zh",
          "zu"
        ],

        // From http://data.okfn.org/data/core/language-codes#resource-language-codes-full (IETF language tags)
        locale_regions: [
          "agq-CM",
          "asa-TZ",
          "ast-ES",
          "bas-CM",
          "bem-ZM",
          "bez-TZ",
          "brx-IN",
          "cgg-UG",
          "chr-US",
          "dav-KE",
          "dje-NE",
          "dsb-DE",
          "dua-CM",
          "dyo-SN",
          "ebu-KE",
          "ewo-CM",
          "fil-PH",
          "fur-IT",
          "gsw-CH",
          "gsw-FR",
          "gsw-LI",
          "guz-KE",
          "haw-US",
          "hsb-DE",
          "jgo-CM",
          "jmc-TZ",
          "kab-DZ",
          "kam-KE",
          "kde-TZ",
          "kea-CV",
          "khq-ML",
          "kkj-CM",
          "kln-KE",
          "kok-IN",
          "ksb-TZ",
          "ksf-CM",
          "ksh-DE",
          "lag-TZ",
          "lkt-US",
          "luo-KE",
          "luy-KE",
          "mas-KE",
          "mas-TZ",
          "mer-KE",
          "mfe-MU",
          "mgh-MZ",
          "mgo-CM",
          "mua-CM",
          "naq-NA",
          "nmg-CM",
          "nnh-CM",
          "nus-SD",
          "nyn-UG",
          "rof-TZ",
          "rwk-TZ",
          "sah-RU",
          "saq-KE",
          "sbp-TZ",
          "seh-MZ",
          "ses-ML",
          "shi-Latn",
          "shi-Latn-MA",
          "shi-Tfng",
          "shi-Tfng-MA",
          "smn-FI",
          "teo-KE",
          "teo-UG",
          "twq-NE",
          "tzm-Latn",
          "tzm-Latn-MA",
          "vai-Latn",
          "vai-Latn-LR",
          "vai-Vaii",
          "vai-Vaii-LR",
          "vun-TZ",
          "wae-CH",
          "xog-UG",
          "yav-CM",
          "zgh-MA",
          "af-NA",
          "af-ZA",
          "ak-GH",
          "am-ET",
          "ar-001",
          "ar-AE",
          "ar-BH",
          "ar-DJ",
          "ar-DZ",
          "ar-EG",
          "ar-EH",
          "ar-ER",
          "ar-IL",
          "ar-IQ",
          "ar-JO",
          "ar-KM",
          "ar-KW",
          "ar-LB",
          "ar-LY",
          "ar-MA",
          "ar-MR",
          "ar-OM",
          "ar-PS",
          "ar-QA",
          "ar-SA",
          "ar-SD",
          "ar-SO",
          "ar-SS",
          "ar-SY",
          "ar-TD",
          "ar-TN",
          "ar-YE",
          "as-IN",
          "az-Cyrl",
          "az-Cyrl-AZ",
          "az-Latn",
          "az-Latn-AZ",
          "be-BY",
          "bg-BG",
          "bm-Latn",
          "bm-Latn-ML",
          "bn-BD",
          "bn-IN",
          "bo-CN",
          "bo-IN",
          "br-FR",
          "bs-Cyrl",
          "bs-Cyrl-BA",
          "bs-Latn",
          "bs-Latn-BA",
          "ca-AD",
          "ca-ES",
          "ca-ES-VALENCIA",
          "ca-FR",
          "ca-IT",
          "cs-CZ",
          "cy-GB",
          "da-DK",
          "da-GL",
          "de-AT",
          "de-BE",
          "de-CH",
          "de-DE",
          "de-LI",
          "de-LU",
          "dz-BT",
          "ee-GH",
          "ee-TG",
          "el-CY",
          "el-GR",
          "en-001",
          "en-150",
          "en-AG",
          "en-AI",
          "en-AS",
          "en-AU",
          "en-BB",
          "en-BE",
          "en-BM",
          "en-BS",
          "en-BW",
          "en-BZ",
          "en-CA",
          "en-CC",
          "en-CK",
          "en-CM",
          "en-CX",
          "en-DG",
          "en-DM",
          "en-ER",
          "en-FJ",
          "en-FK",
          "en-FM",
          "en-GB",
          "en-GD",
          "en-GG",
          "en-GH",
          "en-GI",
          "en-GM",
          "en-GU",
          "en-GY",
          "en-HK",
          "en-IE",
          "en-IM",
          "en-IN",
          "en-IO",
          "en-JE",
          "en-JM",
          "en-KE",
          "en-KI",
          "en-KN",
          "en-KY",
          "en-LC",
          "en-LR",
          "en-LS",
          "en-MG",
          "en-MH",
          "en-MO",
          "en-MP",
          "en-MS",
          "en-MT",
          "en-MU",
          "en-MW",
          "en-MY",
          "en-NA",
          "en-NF",
          "en-NG",
          "en-NR",
          "en-NU",
          "en-NZ",
          "en-PG",
          "en-PH",
          "en-PK",
          "en-PN",
          "en-PR",
          "en-PW",
          "en-RW",
          "en-SB",
          "en-SC",
          "en-SD",
          "en-SG",
          "en-SH",
          "en-SL",
          "en-SS",
          "en-SX",
          "en-SZ",
          "en-TC",
          "en-TK",
          "en-TO",
          "en-TT",
          "en-TV",
          "en-TZ",
          "en-UG",
          "en-UM",
          "en-US",
          "en-US-POSIX",
          "en-VC",
          "en-VG",
          "en-VI",
          "en-VU",
          "en-WS",
          "en-ZA",
          "en-ZM",
          "en-ZW",
          "eo-001",
          "es-419",
          "es-AR",
          "es-BO",
          "es-CL",
          "es-CO",
          "es-CR",
          "es-CU",
          "es-DO",
          "es-EA",
          "es-EC",
          "es-ES",
          "es-GQ",
          "es-GT",
          "es-HN",
          "es-IC",
          "es-MX",
          "es-NI",
          "es-PA",
          "es-PE",
          "es-PH",
          "es-PR",
          "es-PY",
          "es-SV",
          "es-US",
          "es-UY",
          "es-VE",
          "et-EE",
          "eu-ES",
          "fa-AF",
          "fa-IR",
          "ff-CM",
          "ff-GN",
          "ff-MR",
          "ff-SN",
          "fi-FI",
          "fo-FO",
          "fr-BE",
          "fr-BF",
          "fr-BI",
          "fr-BJ",
          "fr-BL",
          "fr-CA",
          "fr-CD",
          "fr-CF",
          "fr-CG",
          "fr-CH",
          "fr-CI",
          "fr-CM",
          "fr-DJ",
          "fr-DZ",
          "fr-FR",
          "fr-GA",
          "fr-GF",
          "fr-GN",
          "fr-GP",
          "fr-GQ",
          "fr-HT",
          "fr-KM",
          "fr-LU",
          "fr-MA",
          "fr-MC",
          "fr-MF",
          "fr-MG",
          "fr-ML",
          "fr-MQ",
          "fr-MR",
          "fr-MU",
          "fr-NC",
          "fr-NE",
          "fr-PF",
          "fr-PM",
          "fr-RE",
          "fr-RW",
          "fr-SC",
          "fr-SN",
          "fr-SY",
          "fr-TD",
          "fr-TG",
          "fr-TN",
          "fr-VU",
          "fr-WF",
          "fr-YT",
          "fy-NL",
          "ga-IE",
          "gd-GB",
          "gl-ES",
          "gu-IN",
          "gv-IM",
          "ha-Latn",
          "ha-Latn-GH",
          "ha-Latn-NE",
          "ha-Latn-NG",
          "he-IL",
          "hi-IN",
          "hr-BA",
          "hr-HR",
          "hu-HU",
          "hy-AM",
          "id-ID",
          "ig-NG",
          "ii-CN",
          "is-IS",
          "it-CH",
          "it-IT",
          "it-SM",
          "ja-JP",
          "ka-GE",
          "ki-KE",
          "kk-Cyrl",
          "kk-Cyrl-KZ",
          "kl-GL",
          "km-KH",
          "kn-IN",
          "ko-KP",
          "ko-KR",
          "ks-Arab",
          "ks-Arab-IN",
          "kw-GB",
          "ky-Cyrl",
          "ky-Cyrl-KG",
          "lb-LU",
          "lg-UG",
          "ln-AO",
          "ln-CD",
          "ln-CF",
          "ln-CG",
          "lo-LA",
          "lt-LT",
          "lu-CD",
          "lv-LV",
          "mg-MG",
          "mk-MK",
          "ml-IN",
          "mn-Cyrl",
          "mn-Cyrl-MN",
          "mr-IN",
          "ms-Latn",
          "ms-Latn-BN",
          "ms-Latn-MY",
          "ms-Latn-SG",
          "mt-MT",
          "my-MM",
          "nb-NO",
          "nb-SJ",
          "nd-ZW",
          "ne-IN",
          "ne-NP",
          "nl-AW",
          "nl-BE",
          "nl-BQ",
          "nl-CW",
          "nl-NL",
          "nl-SR",
          "nl-SX",
          "nn-NO",
          "om-ET",
          "om-KE",
          "or-IN",
          "os-GE",
          "os-RU",
          "pa-Arab",
          "pa-Arab-PK",
          "pa-Guru",
          "pa-Guru-IN",
          "pl-PL",
          "ps-AF",
          "pt-AO",
          "pt-BR",
          "pt-CV",
          "pt-GW",
          "pt-MO",
          "pt-MZ",
          "pt-PT",
          "pt-ST",
          "pt-TL",
          "qu-BO",
          "qu-EC",
          "qu-PE",
          "rm-CH",
          "rn-BI",
          "ro-MD",
          "ro-RO",
          "ru-BY",
          "ru-KG",
          "ru-KZ",
          "ru-MD",
          "ru-RU",
          "ru-UA",
          "rw-RW",
          "se-FI",
          "se-NO",
          "se-SE",
          "sg-CF",
          "si-LK",
          "sk-SK",
          "sl-SI",
          "sn-ZW",
          "so-DJ",
          "so-ET",
          "so-KE",
          "so-SO",
          "sq-AL",
          "sq-MK",
          "sq-XK",
          "sr-Cyrl",
          "sr-Cyrl-BA",
          "sr-Cyrl-ME",
          "sr-Cyrl-RS",
          "sr-Cyrl-XK",
          "sr-Latn",
          "sr-Latn-BA",
          "sr-Latn-ME",
          "sr-Latn-RS",
          "sr-Latn-XK",
          "sv-AX",
          "sv-FI",
          "sv-SE",
          "sw-CD",
          "sw-KE",
          "sw-TZ",
          "sw-UG",
          "ta-IN",
          "ta-LK",
          "ta-MY",
          "ta-SG",
          "te-IN",
          "th-TH",
          "ti-ER",
          "ti-ET",
          "to-TO",
          "tr-CY",
          "tr-TR",
          "ug-Arab",
          "ug-Arab-CN",
          "uk-UA",
          "ur-IN",
          "ur-PK",
          "uz-Arab",
          "uz-Arab-AF",
          "uz-Cyrl",
          "uz-Cyrl-UZ",
          "uz-Latn",
          "uz-Latn-UZ",
          "vi-VN",
          "yi-001",
          "yo-BJ",
          "yo-NG",
          "zh-Hans",
          "zh-Hans-CN",
          "zh-Hans-HK",
          "zh-Hans-MO",
          "zh-Hans-SG",
          "zh-Hant",
          "zh-Hant-HK",
          "zh-Hant-MO",
          "zh-Hant-TW",
          "zu-ZA"
        ],

        us_states_and_dc: [
            {name: 'Alabama', abbreviation: 'AL'},
            {name: 'Alaska', abbreviation: 'AK'},
            {name: 'Arizona', abbreviation: 'AZ'},
            {name: 'Arkansas', abbreviation: 'AR'},
            {name: 'California', abbreviation: 'CA'},
            {name: 'Colorado', abbreviation: 'CO'},
            {name: 'Connecticut', abbreviation: 'CT'},
            {name: 'Delaware', abbreviation: 'DE'},
            {name: 'District of Columbia', abbreviation: 'DC'},
            {name: 'Florida', abbreviation: 'FL'},
            {name: 'Georgia', abbreviation: 'GA'},
            {name: 'Hawaii', abbreviation: 'HI'},
            {name: 'Idaho', abbreviation: 'ID'},
            {name: 'Illinois', abbreviation: 'IL'},
            {name: 'Indiana', abbreviation: 'IN'},
            {name: 'Iowa', abbreviation: 'IA'},
            {name: 'Kansas', abbreviation: 'KS'},
            {name: 'Kentucky', abbreviation: 'KY'},
            {name: 'Louisiana', abbreviation: 'LA'},
            {name: 'Maine', abbreviation: 'ME'},
            {name: 'Maryland', abbreviation: 'MD'},
            {name: 'Massachusetts', abbreviation: 'MA'},
            {name: 'Michigan', abbreviation: 'MI'},
            {name: 'Minnesota', abbreviation: 'MN'},
            {name: 'Mississippi', abbreviation: 'MS'},
            {name: 'Missouri', abbreviation: 'MO'},
            {name: 'Montana', abbreviation: 'MT'},
            {name: 'Nebraska', abbreviation: 'NE'},
            {name: 'Nevada', abbreviation: 'NV'},
            {name: 'New Hampshire', abbreviation: 'NH'},
            {name: 'New Jersey', abbreviation: 'NJ'},
            {name: 'New Mexico', abbreviation: 'NM'},
            {name: 'New York', abbreviation: 'NY'},
            {name: 'North Carolina', abbreviation: 'NC'},
            {name: 'North Dakota', abbreviation: 'ND'},
            {name: 'Ohio', abbreviation: 'OH'},
            {name: 'Oklahoma', abbreviation: 'OK'},
            {name: 'Oregon', abbreviation: 'OR'},
            {name: 'Pennsylvania', abbreviation: 'PA'},
            {name: 'Rhode Island', abbreviation: 'RI'},
            {name: 'South Carolina', abbreviation: 'SC'},
            {name: 'South Dakota', abbreviation: 'SD'},
            {name: 'Tennessee', abbreviation: 'TN'},
            {name: 'Texas', abbreviation: 'TX'},
            {name: 'Utah', abbreviation: 'UT'},
            {name: 'Vermont', abbreviation: 'VT'},
            {name: 'Virginia', abbreviation: 'VA'},
            {name: 'Washington', abbreviation: 'WA'},
            {name: 'West Virginia', abbreviation: 'WV'},
            {name: 'Wisconsin', abbreviation: 'WI'},
            {name: 'Wyoming', abbreviation: 'WY'}
        ],

        territories: [
            {name: 'American Samoa', abbreviation: 'AS'},
            {name: 'Federated States of Micronesia', abbreviation: 'FM'},
            {name: 'Guam', abbreviation: 'GU'},
            {name: 'Marshall Islands', abbreviation: 'MH'},
            {name: 'Northern Mariana Islands', abbreviation: 'MP'},
            {name: 'Puerto Rico', abbreviation: 'PR'},
            {name: 'Virgin Islands, U.S.', abbreviation: 'VI'}
        ],

        armed_forces: [
            {name: 'Armed Forces Europe', abbreviation: 'AE'},
            {name: 'Armed Forces Pacific', abbreviation: 'AP'},
            {name: 'Armed Forces the Americas', abbreviation: 'AA'}
        ],

        country_regions: {
            it: [
                { name: "Valle d'Aosta", abbreviation: "VDA" },
                { name: "Piemonte", abbreviation: "PIE" },
                { name: "Lombardia", abbreviation: "LOM" },
                { name: "Veneto", abbreviation: "VEN" },
                { name: "Trentino Alto Adige", abbreviation: "TAA" },
                { name: "Friuli Venezia Giulia", abbreviation: "FVG" },
                { name: "Liguria", abbreviation: "LIG" },
                { name: "Emilia Romagna", abbreviation: "EMR" },
                { name: "Toscana", abbreviation: "TOS" },
                { name: "Umbria", abbreviation: "UMB" },
                { name: "Marche", abbreviation: "MAR" },
                { name: "Abruzzo", abbreviation: "ABR" },
                { name: "Lazio", abbreviation: "LAZ" },
                { name: "Campania", abbreviation: "CAM" },
                { name: "Puglia", abbreviation: "PUG" },
                { name: "Basilicata", abbreviation: "BAS" },
                { name: "Molise", abbreviation: "MOL" },
                { name: "Calabria", abbreviation: "CAL" },
                { name: "Sicilia", abbreviation: "SIC" },
                { name: "Sardegna", abbreviation: "SAR" }
            ]
        },

        street_suffixes: {
            'us': [
                {name: 'Avenue', abbreviation: 'Ave'},
                {name: 'Boulevard', abbreviation: 'Blvd'},
                {name: 'Center', abbreviation: 'Ctr'},
                {name: 'Circle', abbreviation: 'Cir'},
                {name: 'Court', abbreviation: 'Ct'},
                {name: 'Drive', abbreviation: 'Dr'},
                {name: 'Extension', abbreviation: 'Ext'},
                {name: 'Glen', abbreviation: 'Gln'},
                {name: 'Grove', abbreviation: 'Grv'},
                {name: 'Heights', abbreviation: 'Hts'},
                {name: 'Highway', abbreviation: 'Hwy'},
                {name: 'Junction', abbreviation: 'Jct'},
                {name: 'Key', abbreviation: 'Key'},
                {name: 'Lane', abbreviation: 'Ln'},
                {name: 'Loop', abbreviation: 'Loop'},
                {name: 'Manor', abbreviation: 'Mnr'},
                {name: 'Mill', abbreviation: 'Mill'},
                {name: 'Park', abbreviation: 'Park'},
                {name: 'Parkway', abbreviation: 'Pkwy'},
                {name: 'Pass', abbreviation: 'Pass'},
                {name: 'Path', abbreviation: 'Path'},
                {name: 'Pike', abbreviation: 'Pike'},
                {name: 'Place', abbreviation: 'Pl'},
                {name: 'Plaza', abbreviation: 'Plz'},
                {name: 'Point', abbreviation: 'Pt'},
                {name: 'Ridge', abbreviation: 'Rdg'},
                {name: 'River', abbreviation: 'Riv'},
                {name: 'Road', abbreviation: 'Rd'},
                {name: 'Square', abbreviation: 'Sq'},
                {name: 'Street', abbreviation: 'St'},
                {name: 'Terrace', abbreviation: 'Ter'},
                {name: 'Trail', abbreviation: 'Trl'},
                {name: 'Turnpike', abbreviation: 'Tpke'},
                {name: 'View', abbreviation: 'Vw'},
                {name: 'Way', abbreviation: 'Way'}
            ],
            'it': [
                { name: 'Accesso', abbreviation: 'Acc.' },
                { name: 'Alzaia', abbreviation: 'Alz.' },
                { name: 'Arco', abbreviation: 'Arco' },
                { name: 'Archivolto', abbreviation: 'Acv.' },
                { name: 'Arena', abbreviation: 'Arena' },
                { name: 'Argine', abbreviation: 'Argine' },
                { name: 'Bacino', abbreviation: 'Bacino' },
                { name: 'Banchi', abbreviation: 'Banchi' },
                { name: 'Banchina', abbreviation: 'Ban.' },
                { name: 'Bastioni', abbreviation: 'Bas.' },
                { name: 'Belvedere', abbreviation: 'Belv.' },
                { name: 'Borgata', abbreviation: 'B.ta' },
                { name: 'Borgo', abbreviation: 'B.go' },
                { name: 'Calata', abbreviation: 'Cal.' },
                { name: 'Calle', abbreviation: 'Calle' },
                { name: 'Campiello', abbreviation: 'Cam.' },
                { name: 'Campo', abbreviation: 'Cam.' },
                { name: 'Canale', abbreviation: 'Can.' },
                { name: 'Carraia', abbreviation: 'Carr.' },
                { name: 'Cascina', abbreviation: 'Cascina' },
                { name: 'Case sparse', abbreviation: 'c.s.' },
                { name: 'Cavalcavia', abbreviation: 'Cv.' },
                { name: 'Circonvallazione', abbreviation: 'Cv.' },
                { name: 'Complanare', abbreviation: 'C.re' },
                { name: 'Contrada', abbreviation: 'C.da' },
                { name: 'Corso', abbreviation: 'C.so' },
                { name: 'Corte', abbreviation: 'C.te' },
                { name: 'Cortile', abbreviation: 'C.le' },
                { name: 'Diramazione', abbreviation: 'Dir.' },
                { name: 'Fondaco', abbreviation: 'F.co' },
                { name: 'Fondamenta', abbreviation: 'F.ta' },
                { name: 'Fondo', abbreviation: 'F.do' },
                { name: 'Frazione', abbreviation: 'Fr.' },
                { name: 'Isola', abbreviation: 'Is.' },
                { name: 'Largo', abbreviation: 'L.go' },
                { name: 'Litoranea', abbreviation: 'Lit.' },
                { name: 'Lungolago', abbreviation: 'L.go lago' },
                { name: 'Lungo Po', abbreviation: 'l.go Po' },
                { name: 'Molo', abbreviation: 'Molo' },
                { name: 'Mura', abbreviation: 'Mura' },
                { name: 'Passaggio privato', abbreviation: 'pass. priv.' },
                { name: 'Passeggiata', abbreviation: 'Pass.' },
                { name: 'Piazza', abbreviation: 'P.zza' },
                { name: 'Piazzale', abbreviation: 'P.le' },
                { name: 'Ponte', abbreviation: 'P.te' },
                { name: 'Portico', abbreviation: 'P.co' },
                { name: 'Rampa', abbreviation: 'Rampa' },
                { name: 'Regione', abbreviation: 'Reg.' },
                { name: 'Rione', abbreviation: 'R.ne' },
                { name: 'Rio', abbreviation: 'Rio' },
                { name: 'Ripa', abbreviation: 'Ripa' },
                { name: 'Riva', abbreviation: 'Riva' },
                { name: 'Rondò', abbreviation: 'Rondò' },
                { name: 'Rotonda', abbreviation: 'Rot.' },
                { name: 'Sagrato', abbreviation: 'Sagr.' },
                { name: 'Salita', abbreviation: 'Sal.' },
                { name: 'Scalinata', abbreviation: 'Scal.' },
                { name: 'Scalone', abbreviation: 'Scal.' },
                { name: 'Slargo', abbreviation: 'Sl.' },
                { name: 'Sottoportico', abbreviation: 'Sott.' },
                { name: 'Strada', abbreviation: 'Str.' },
                { name: 'Stradale', abbreviation: 'Str.le' },
                { name: 'Strettoia', abbreviation: 'Strett.' },
                { name: 'Traversa', abbreviation: 'Trav.' },
                { name: 'Via', abbreviation: 'V.' },
                { name: 'Viale', abbreviation: 'V.le' },
                { name: 'Vicinale', abbreviation: 'Vic.le' },
                { name: 'Vicolo', abbreviation: 'Vic.' }
            ],
            'uk' : [
                {name: 'Avenue', abbreviation: 'Ave'},
                {name: 'Close', abbreviation: 'Cl'},
                {name: 'Court', abbreviation: 'Ct'},
                {name: 'Crescent', abbreviation: 'Cr'},
                {name: 'Drive', abbreviation: 'Dr'},
                {name: 'Garden', abbreviation: 'Gdn'},
                {name: 'Gardens', abbreviation: 'Gdns'},
                {name: 'Green', abbreviation: 'Gn'},
                {name: 'Grove', abbreviation: 'Gr'},
                {name: 'Lane', abbreviation: 'Ln'},
                {name: 'Mount', abbreviation: 'Mt'},
                {name: 'Place', abbreviation: 'Pl'},
                {name: 'Park', abbreviation: 'Pk'},
                {name: 'Ridge', abbreviation: 'Rdg'},
                {name: 'Road', abbreviation: 'Rd'},
                {name: 'Square', abbreviation: 'Sq'},
                {name: 'Street', abbreviation: 'St'},
                {name: 'Terrace', abbreviation: 'Ter'},
                {name: 'Valley', abbreviation: 'Val'}
            ]
        },

        months: [
            {name: 'January', short_name: 'Jan', numeric: '01', days: 31},
            // Not messing with leap years...
            {name: 'February', short_name: 'Feb', numeric: '02', days: 28},
            {name: 'March', short_name: 'Mar', numeric: '03', days: 31},
            {name: 'April', short_name: 'Apr', numeric: '04', days: 30},
            {name: 'May', short_name: 'May', numeric: '05', days: 31},
            {name: 'June', short_name: 'Jun', numeric: '06', days: 30},
            {name: 'July', short_name: 'Jul', numeric: '07', days: 31},
            {name: 'August', short_name: 'Aug', numeric: '08', days: 31},
            {name: 'September', short_name: 'Sep', numeric: '09', days: 30},
            {name: 'October', short_name: 'Oct', numeric: '10', days: 31},
            {name: 'November', short_name: 'Nov', numeric: '11', days: 30},
            {name: 'December', short_name: 'Dec', numeric: '12', days: 31}
        ],

        // http://en.wikipedia.org/wiki/Bank_card_number#Issuer_identification_number_.28IIN.29
        cc_types: [
            {name: "American Express", short_name: 'amex', prefix: '34', length: 15},
            {name: "Bankcard", short_name: 'bankcard', prefix: '5610', length: 16},
            {name: "China UnionPay", short_name: 'chinaunion', prefix: '62', length: 16},
            {name: "Diners Club Carte Blanche", short_name: 'dccarte', prefix: '300', length: 14},
            {name: "Diners Club enRoute", short_name: 'dcenroute', prefix: '2014', length: 15},
            {name: "Diners Club International", short_name: 'dcintl', prefix: '36', length: 14},
            {name: "Diners Club United States & Canada", short_name: 'dcusc', prefix: '54', length: 16},
            {name: "Discover Card", short_name: 'discover', prefix: '6011', length: 16},
            {name: "InstaPayment", short_name: 'instapay', prefix: '637', length: 16},
            {name: "JCB", short_name: 'jcb', prefix: '3528', length: 16},
            {name: "Laser", short_name: 'laser', prefix: '6304', length: 16},
            {name: "Maestro", short_name: 'maestro', prefix: '5018', length: 16},
            {name: "Mastercard", short_name: 'mc', prefix: '51', length: 16},
            {name: "Solo", short_name: 'solo', prefix: '6334', length: 16},
            {name: "Switch", short_name: 'switch', prefix: '4903', length: 16},
            {name: "Visa", short_name: 'visa', prefix: '4', length: 16},
            {name: "Visa Electron", short_name: 'electron', prefix: '4026', length: 16}
        ],

        //return all world currency by ISO 4217
        currency_types: [
            {'code' : 'AED', 'name' : 'United Arab Emirates Dirham'},
            {'code' : 'AFN', 'name' : 'Afghanistan Afghani'},
            {'code' : 'ALL', 'name' : 'Albania Lek'},
            {'code' : 'AMD', 'name' : 'Armenia Dram'},
            {'code' : 'ANG', 'name' : 'Netherlands Antilles Guilder'},
            {'code' : 'AOA', 'name' : 'Angola Kwanza'},
            {'code' : 'ARS', 'name' : 'Argentina Peso'},
            {'code' : 'AUD', 'name' : 'Australia Dollar'},
            {'code' : 'AWG', 'name' : 'Aruba Guilder'},
            {'code' : 'AZN', 'name' : 'Azerbaijan New Manat'},
            {'code' : 'BAM', 'name' : 'Bosnia and Herzegovina Convertible Marka'},
            {'code' : 'BBD', 'name' : 'Barbados Dollar'},
            {'code' : 'BDT', 'name' : 'Bangladesh Taka'},
            {'code' : 'BGN', 'name' : 'Bulgaria Lev'},
            {'code' : 'BHD', 'name' : 'Bahrain Dinar'},
            {'code' : 'BIF', 'name' : 'Burundi Franc'},
            {'code' : 'BMD', 'name' : 'Bermuda Dollar'},
            {'code' : 'BND', 'name' : 'Brunei Darussalam Dollar'},
            {'code' : 'BOB', 'name' : 'Bolivia Boliviano'},
            {'code' : 'BRL', 'name' : 'Brazil Real'},
            {'code' : 'BSD', 'name' : 'Bahamas Dollar'},
            {'code' : 'BTN', 'name' : 'Bhutan Ngultrum'},
            {'code' : 'BWP', 'name' : 'Botswana Pula'},
            {'code' : 'BYR', 'name' : 'Belarus Ruble'},
            {'code' : 'BZD', 'name' : 'Belize Dollar'},
            {'code' : 'CAD', 'name' : 'Canada Dollar'},
            {'code' : 'CDF', 'name' : 'Congo/Kinshasa Franc'},
            {'code' : 'CHF', 'name' : 'Switzerland Franc'},
            {'code' : 'CLP', 'name' : 'Chile Peso'},
            {'code' : 'CNY', 'name' : 'China Yuan Renminbi'},
            {'code' : 'COP', 'name' : 'Colombia Peso'},
            {'code' : 'CRC', 'name' : 'Costa Rica Colon'},
            {'code' : 'CUC', 'name' : 'Cuba Convertible Peso'},
            {'code' : 'CUP', 'name' : 'Cuba Peso'},
            {'code' : 'CVE', 'name' : 'Cape Verde Escudo'},
            {'code' : 'CZK', 'name' : 'Czech Republic Koruna'},
            {'code' : 'DJF', 'name' : 'Djibouti Franc'},
            {'code' : 'DKK', 'name' : 'Denmark Krone'},
            {'code' : 'DOP', 'name' : 'Dominican Republic Peso'},
            {'code' : 'DZD', 'name' : 'Algeria Dinar'},
            {'code' : 'EGP', 'name' : 'Egypt Pound'},
            {'code' : 'ERN', 'name' : 'Eritrea Nakfa'},
            {'code' : 'ETB', 'name' : 'Ethiopia Birr'},
            {'code' : 'EUR', 'name' : 'Euro Member Countries'},
            {'code' : 'FJD', 'name' : 'Fiji Dollar'},
            {'code' : 'FKP', 'name' : 'Falkland Islands (Malvinas) Pound'},
            {'code' : 'GBP', 'name' : 'United Kingdom Pound'},
            {'code' : 'GEL', 'name' : 'Georgia Lari'},
            {'code' : 'GGP', 'name' : 'Guernsey Pound'},
            {'code' : 'GHS', 'name' : 'Ghana Cedi'},
            {'code' : 'GIP', 'name' : 'Gibraltar Pound'},
            {'code' : 'GMD', 'name' : 'Gambia Dalasi'},
            {'code' : 'GNF', 'name' : 'Guinea Franc'},
            {'code' : 'GTQ', 'name' : 'Guatemala Quetzal'},
            {'code' : 'GYD', 'name' : 'Guyana Dollar'},
            {'code' : 'HKD', 'name' : 'Hong Kong Dollar'},
            {'code' : 'HNL', 'name' : 'Honduras Lempira'},
            {'code' : 'HRK', 'name' : 'Croatia Kuna'},
            {'code' : 'HTG', 'name' : 'Haiti Gourde'},
            {'code' : 'HUF', 'name' : 'Hungary Forint'},
            {'code' : 'IDR', 'name' : 'Indonesia Rupiah'},
            {'code' : 'ILS', 'name' : 'Israel Shekel'},
            {'code' : 'IMP', 'name' : 'Isle of Man Pound'},
            {'code' : 'INR', 'name' : 'India Rupee'},
            {'code' : 'IQD', 'name' : 'Iraq Dinar'},
            {'code' : 'IRR', 'name' : 'Iran Rial'},
            {'code' : 'ISK', 'name' : 'Iceland Krona'},
            {'code' : 'JEP', 'name' : 'Jersey Pound'},
            {'code' : 'JMD', 'name' : 'Jamaica Dollar'},
            {'code' : 'JOD', 'name' : 'Jordan Dinar'},
            {'code' : 'JPY', 'name' : 'Japan Yen'},
            {'code' : 'KES', 'name' : 'Kenya Shilling'},
            {'code' : 'KGS', 'name' : 'Kyrgyzstan Som'},
            {'code' : 'KHR', 'name' : 'Cambodia Riel'},
            {'code' : 'KMF', 'name' : 'Comoros Franc'},
            {'code' : 'KPW', 'name' : 'Korea (North) Won'},
            {'code' : 'KRW', 'name' : 'Korea (South) Won'},
            {'code' : 'KWD', 'name' : 'Kuwait Dinar'},
            {'code' : 'KYD', 'name' : 'Cayman Islands Dollar'},
            {'code' : 'KZT', 'name' : 'Kazakhstan Tenge'},
            {'code' : 'LAK', 'name' : 'Laos Kip'},
            {'code' : 'LBP', 'name' : 'Lebanon Pound'},
            {'code' : 'LKR', 'name' : 'Sri Lanka Rupee'},
            {'code' : 'LRD', 'name' : 'Liberia Dollar'},
            {'code' : 'LSL', 'name' : 'Lesotho Loti'},
            {'code' : 'LTL', 'name' : 'Lithuania Litas'},
            {'code' : 'LYD', 'name' : 'Libya Dinar'},
            {'code' : 'MAD', 'name' : 'Morocco Dirham'},
            {'code' : 'MDL', 'name' : 'Moldova Leu'},
            {'code' : 'MGA', 'name' : 'Madagascar Ariary'},
            {'code' : 'MKD', 'name' : 'Macedonia Denar'},
            {'code' : 'MMK', 'name' : 'Myanmar (Burma) Kyat'},
            {'code' : 'MNT', 'name' : 'Mongolia Tughrik'},
            {'code' : 'MOP', 'name' : 'Macau Pataca'},
            {'code' : 'MRO', 'name' : 'Mauritania Ouguiya'},
            {'code' : 'MUR', 'name' : 'Mauritius Rupee'},
            {'code' : 'MVR', 'name' : 'Maldives (Maldive Islands) Rufiyaa'},
            {'code' : 'MWK', 'name' : 'Malawi Kwacha'},
            {'code' : 'MXN', 'name' : 'Mexico Peso'},
            {'code' : 'MYR', 'name' : 'Malaysia Ringgit'},
            {'code' : 'MZN', 'name' : 'Mozambique Metical'},
            {'code' : 'NAD', 'name' : 'Namibia Dollar'},
            {'code' : 'NGN', 'name' : 'Nigeria Naira'},
            {'code' : 'NIO', 'name' : 'Nicaragua Cordoba'},
            {'code' : 'NOK', 'name' : 'Norway Krone'},
            {'code' : 'NPR', 'name' : 'Nepal Rupee'},
            {'code' : 'NZD', 'name' : 'New Zealand Dollar'},
            {'code' : 'OMR', 'name' : 'Oman Rial'},
            {'code' : 'PAB', 'name' : 'Panama Balboa'},
            {'code' : 'PEN', 'name' : 'Peru Nuevo Sol'},
            {'code' : 'PGK', 'name' : 'Papua New Guinea Kina'},
            {'code' : 'PHP', 'name' : 'Philippines Peso'},
            {'code' : 'PKR', 'name' : 'Pakistan Rupee'},
            {'code' : 'PLN', 'name' : 'Poland Zloty'},
            {'code' : 'PYG', 'name' : 'Paraguay Guarani'},
            {'code' : 'QAR', 'name' : 'Qatar Riyal'},
            {'code' : 'RON', 'name' : 'Romania New Leu'},
            {'code' : 'RSD', 'name' : 'Serbia Dinar'},
            {'code' : 'RUB', 'name' : 'Russia Ruble'},
            {'code' : 'RWF', 'name' : 'Rwanda Franc'},
            {'code' : 'SAR', 'name' : 'Saudi Arabia Riyal'},
            {'code' : 'SBD', 'name' : 'Solomon Islands Dollar'},
            {'code' : 'SCR', 'name' : 'Seychelles Rupee'},
            {'code' : 'SDG', 'name' : 'Sudan Pound'},
            {'code' : 'SEK', 'name' : 'Sweden Krona'},
            {'code' : 'SGD', 'name' : 'Singapore Dollar'},
            {'code' : 'SHP', 'name' : 'Saint Helena Pound'},
            {'code' : 'SLL', 'name' : 'Sierra Leone Leone'},
            {'code' : 'SOS', 'name' : 'Somalia Shilling'},
            {'code' : 'SPL', 'name' : 'Seborga Luigino'},
            {'code' : 'SRD', 'name' : 'Suriname Dollar'},
            {'code' : 'STD', 'name' : 'São Tomé and Príncipe Dobra'},
            {'code' : 'SVC', 'name' : 'El Salvador Colon'},
            {'code' : 'SYP', 'name' : 'Syria Pound'},
            {'code' : 'SZL', 'name' : 'Swaziland Lilangeni'},
            {'code' : 'THB', 'name' : 'Thailand Baht'},
            {'code' : 'TJS', 'name' : 'Tajikistan Somoni'},
            {'code' : 'TMT', 'name' : 'Turkmenistan Manat'},
            {'code' : 'TND', 'name' : 'Tunisia Dinar'},
            {'code' : 'TOP', 'name' : 'Tonga Pa\'anga'},
            {'code' : 'TRY', 'name' : 'Turkey Lira'},
            {'code' : 'TTD', 'name' : 'Trinidad and Tobago Dollar'},
            {'code' : 'TVD', 'name' : 'Tuvalu Dollar'},
            {'code' : 'TWD', 'name' : 'Taiwan New Dollar'},
            {'code' : 'TZS', 'name' : 'Tanzania Shilling'},
            {'code' : 'UAH', 'name' : 'Ukraine Hryvnia'},
            {'code' : 'UGX', 'name' : 'Uganda Shilling'},
            {'code' : 'USD', 'name' : 'United States Dollar'},
            {'code' : 'UYU', 'name' : 'Uruguay Peso'},
            {'code' : 'UZS', 'name' : 'Uzbekistan Som'},
            {'code' : 'VEF', 'name' : 'Venezuela Bolivar'},
            {'code' : 'VND', 'name' : 'Viet Nam Dong'},
            {'code' : 'VUV', 'name' : 'Vanuatu Vatu'},
            {'code' : 'WST', 'name' : 'Samoa Tala'},
            {'code' : 'XAF', 'name' : 'Communauté Financière Africaine (BEAC) CFA Franc BEAC'},
            {'code' : 'XCD', 'name' : 'East Caribbean Dollar'},
            {'code' : 'XDR', 'name' : 'International Monetary Fund (IMF) Special Drawing Rights'},
            {'code' : 'XOF', 'name' : 'Communauté Financière Africaine (BCEAO) Franc'},
            {'code' : 'XPF', 'name' : 'Comptoirs Français du Pacifique (CFP) Franc'},
            {'code' : 'YER', 'name' : 'Yemen Rial'},
            {'code' : 'ZAR', 'name' : 'South Africa Rand'},
            {'code' : 'ZMW', 'name' : 'Zambia Kwacha'},
            {'code' : 'ZWD', 'name' : 'Zimbabwe Dollar'}
        ],

        // return the names of all valide colors
        colorNames : [  "AliceBlue", "Black", "Navy", "DarkBlue", "MediumBlue", "Blue", "DarkGreen", "Green", "Teal", "DarkCyan", "DeepSkyBlue", "DarkTurquoise", "MediumSpringGreen", "Lime", "SpringGreen",
            "Aqua", "Cyan", "MidnightBlue", "DodgerBlue", "LightSeaGreen", "ForestGreen", "SeaGreen", "DarkSlateGray", "LimeGreen", "MediumSeaGreen", "Turquoise", "RoyalBlue", "SteelBlue", "DarkSlateBlue", "MediumTurquoise",
            "Indigo", "DarkOliveGreen", "CadetBlue", "CornflowerBlue", "RebeccaPurple", "MediumAquaMarine", "DimGray", "SlateBlue", "OliveDrab", "SlateGray", "LightSlateGray", "MediumSlateBlue", "LawnGreen", "Chartreuse",
            "Aquamarine", "Maroon", "Purple", "Olive", "Gray", "SkyBlue", "LightSkyBlue", "BlueViolet", "DarkRed", "DarkMagenta", "SaddleBrown", "Ivory", "White",
            "DarkSeaGreen", "LightGreen", "MediumPurple", "DarkViolet", "PaleGreen", "DarkOrchid", "YellowGreen", "Sienna", "Brown", "DarkGray", "LightBlue", "GreenYellow", "PaleTurquoise", "LightSteelBlue", "PowderBlue",
            "FireBrick", "DarkGoldenRod", "MediumOrchid", "RosyBrown", "DarkKhaki", "Silver", "MediumVioletRed", "IndianRed", "Peru", "Chocolate", "Tan", "LightGray", "Thistle", "Orchid", "GoldenRod", "PaleVioletRed",
            "Crimson", "Gainsboro", "Plum", "BurlyWood", "LightCyan", "Lavender", "DarkSalmon", "Violet", "PaleGoldenRod", "LightCoral", "Khaki", "AliceBlue", "HoneyDew", "Azure", "SandyBrown", "Wheat", "Beige", "WhiteSmoke",
            "MintCream", "GhostWhite", "Salmon", "AntiqueWhite", "Linen", "LightGoldenRodYellow", "OldLace", "Red", "Fuchsia", "Magenta", "DeepPink", "OrangeRed", "Tomato", "HotPink", "Coral", "DarkOrange", "LightSalmon", "Orange",
            "LightPink", "Pink", "Gold", "PeachPuff", "NavajoWhite", "Moccasin", "Bisque", "MistyRose", "BlanchedAlmond", "PapayaWhip", "LavenderBlush", "SeaShell", "Cornsilk", "LemonChiffon", "FloralWhite", "Snow", "Yellow", "LightYellow"
        ],

        // Data taken from https://www.sec.gov/rules/other/4-460list.htm
        company: [ "3Com Corp",
        "3M Company",
        "A.G. Edwards Inc.",
        "Abbott Laboratories",
        "Abercrombie & Fitch Co.",
        "ABM Industries Incorporated",
        "Ace Hardware Corporation",
        "ACT Manufacturing Inc.",
        "Acterna Corp.",
        "Adams Resources & Energy, Inc.",
        "ADC Telecommunications, Inc.",
        "Adelphia Communications Corporation",
        "Administaff, Inc.",
        "Adobe Systems Incorporated",
        "Adolph Coors Company",
        "Advance Auto Parts, Inc.",
        "Advanced Micro Devices, Inc.",
        "AdvancePCS, Inc.",
        "Advantica Restaurant Group, Inc.",
        "The AES Corporation",
        "Aetna Inc.",
        "Affiliated Computer Services, Inc.",
        "AFLAC Incorporated",
        "AGCO Corporation",
        "Agilent Technologies, Inc.",
        "Agway Inc.",
        "Apartment Investment and Management Company",
        "Air Products and Chemicals, Inc.",
        "Airborne, Inc.",
        "Airgas, Inc.",
        "AK Steel Holding Corporation",
        "Alaska Air Group, Inc.",
        "Alberto-Culver Company",
        "Albertson's, Inc.",
        "Alcoa Inc.",
        "Alleghany Corporation",
        "Allegheny Energy, Inc.",
        "Allegheny Technologies Incorporated",
        "Allergan, Inc.",
        "ALLETE, Inc.",
        "Alliant Energy Corporation",
        "Allied Waste Industries, Inc.",
        "Allmerica Financial Corporation",
        "The Allstate Corporation",
        "ALLTEL Corporation",
        "The Alpine Group, Inc.",
        "Amazon.com, Inc.",
        "AMC Entertainment Inc.",
        "American Power Conversion Corporation",
        "Amerada Hess Corporation",
        "AMERCO",
        "Ameren Corporation",
        "America West Holdings Corporation",
        "American Axle & Manufacturing Holdings, Inc.",
        "American Eagle Outfitters, Inc.",
        "American Electric Power Company, Inc.",
        "American Express Company",
        "American Financial Group, Inc.",
        "American Greetings Corporation",
        "American International Group, Inc.",
        "American Standard Companies Inc.",
        "American Water Works Company, Inc.",
        "AmerisourceBergen Corporation",
        "Ames Department Stores, Inc.",
        "Amgen Inc.",
        "Amkor Technology, Inc.",
        "AMR Corporation",
        "AmSouth Bancorp.",
        "Amtran, Inc.",
        "Anadarko Petroleum Corporation",
        "Analog Devices, Inc.",
        "Anheuser-Busch Companies, Inc.",
        "Anixter International Inc.",
        "AnnTaylor Inc.",
        "Anthem, Inc.",
        "AOL Time Warner Inc.",
        "Aon Corporation",
        "Apache Corporation",
        "Apple Computer, Inc.",
        "Applera Corporation",
        "Applied Industrial Technologies, Inc.",
        "Applied Materials, Inc.",
        "Aquila, Inc.",
        "ARAMARK Corporation",
        "Arch Coal, Inc.",
        "Archer Daniels Midland Company",
        "Arkansas Best Corporation",
        "Armstrong Holdings, Inc.",
        "Arrow Electronics, Inc.",
        "ArvinMeritor, Inc.",
        "Ashland Inc.",
        "Astoria Financial Corporation",
        "AT&T Corp.",
        "Atmel Corporation",
        "Atmos Energy Corporation",
        "Audiovox Corporation",
        "Autoliv, Inc.",
        "Automatic Data Processing, Inc.",
        "AutoNation, Inc.",
        "AutoZone, Inc.",
        "Avaya Inc.",
        "Avery Dennison Corporation",
        "Avista Corporation",
        "Avnet, Inc.",
        "Avon Products, Inc.",
        "Baker Hughes Incorporated",
        "Ball Corporation",
        "Bank of America Corporation",
        "The Bank of New York Company, Inc.",
        "Bank One Corporation",
        "Banknorth Group, Inc.",
        "Banta Corporation",
        "Barnes & Noble, Inc.",
        "Bausch & Lomb Incorporated",
        "Baxter International Inc.",
        "BB&T Corporation",
        "The Bear Stearns Companies Inc.",
        "Beazer Homes USA, Inc.",
        "Beckman Coulter, Inc.",
        "Becton, Dickinson and Company",
        "Bed Bath & Beyond Inc.",
        "Belk, Inc.",
        "Bell Microproducts Inc.",
        "BellSouth Corporation",
        "Belo Corp.",
        "Bemis Company, Inc.",
        "Benchmark Electronics, Inc.",
        "Berkshire Hathaway Inc.",
        "Best Buy Co., Inc.",
        "Bethlehem Steel Corporation",
        "Beverly Enterprises, Inc.",
        "Big Lots, Inc.",
        "BJ Services Company",
        "BJ's Wholesale Club, Inc.",
        "The Black & Decker Corporation",
        "Black Hills Corporation",
        "BMC Software, Inc.",
        "The Boeing Company",
        "Boise Cascade Corporation",
        "Borders Group, Inc.",
        "BorgWarner Inc.",
        "Boston Scientific Corporation",
        "Bowater Incorporated",
        "Briggs & Stratton Corporation",
        "Brightpoint, Inc.",
        "Brinker International, Inc.",
        "Bristol-Myers Squibb Company",
        "Broadwing, Inc.",
        "Brown Shoe Company, Inc.",
        "Brown-Forman Corporation",
        "Brunswick Corporation",
        "Budget Group, Inc.",
        "Burlington Coat Factory Warehouse Corporation",
        "Burlington Industries, Inc.",
        "Burlington Northern Santa Fe Corporation",
        "Burlington Resources Inc.",
        "C. H. Robinson Worldwide Inc.",
        "Cablevision Systems Corp",
        "Cabot Corp",
        "Cadence Design Systems, Inc.",
        "Calpine Corp.",
        "Campbell Soup Co.",
        "Capital One Financial Corp.",
        "Cardinal Health Inc.",
        "Caremark Rx Inc.",
        "Carlisle Cos. Inc.",
        "Carpenter Technology Corp.",
        "Casey's General Stores Inc.",
        "Caterpillar Inc.",
        "CBRL Group Inc.",
        "CDI Corp.",
        "CDW Computer Centers Inc.",
        "CellStar Corp.",
        "Cendant Corp",
        "Cenex Harvest States Cooperatives",
        "Centex Corp.",
        "CenturyTel Inc.",
        "Ceridian Corp.",
        "CH2M Hill Cos. Ltd.",
        "Champion Enterprises Inc.",
        "Charles Schwab Corp.",
        "Charming Shoppes Inc.",
        "Charter Communications Inc.",
        "Charter One Financial Inc.",
        "ChevronTexaco Corp.",
        "Chiquita Brands International Inc.",
        "Chubb Corp",
        "Ciena Corp.",
        "Cigna Corp",
        "Cincinnati Financial Corp.",
        "Cinergy Corp.",
        "Cintas Corp.",
        "Circuit City Stores Inc.",
        "Cisco Systems Inc.",
        "Citigroup, Inc",
        "Citizens Communications Co.",
        "CKE Restaurants Inc.",
        "Clear Channel Communications Inc.",
        "The Clorox Co.",
        "CMGI Inc.",
        "CMS Energy Corp.",
        "CNF Inc.",
        "Coca-Cola Co.",
        "Coca-Cola Enterprises Inc.",
        "Colgate-Palmolive Co.",
        "Collins & Aikman Corp.",
        "Comcast Corp.",
        "Comdisco Inc.",
        "Comerica Inc.",
        "Comfort Systems USA Inc.",
        "Commercial Metals Co.",
        "Community Health Systems Inc.",
        "Compass Bancshares Inc",
        "Computer Associates International Inc.",
        "Computer Sciences Corp.",
        "Compuware Corp.",
        "Comverse Technology Inc.",
        "ConAgra Foods Inc.",
        "Concord EFS Inc.",
        "Conectiv, Inc",
        "Conoco Inc",
        "Conseco Inc.",
        "Consolidated Freightways Corp.",
        "Consolidated Edison Inc.",
        "Constellation Brands Inc.",
        "Constellation Emergy Group Inc.",
        "Continental Airlines Inc.",
        "Convergys Corp.",
        "Cooper Cameron Corp.",
        "Cooper Industries Ltd.",
        "Cooper Tire & Rubber Co.",
        "Corn Products International Inc.",
        "Corning Inc.",
        "Costco Wholesale Corp.",
        "Countrywide Credit Industries Inc.",
        "Coventry Health Care Inc.",
        "Cox Communications Inc.",
        "Crane Co.",
        "Crompton Corp.",
        "Crown Cork & Seal Co. Inc.",
        "CSK Auto Corp.",
        "CSX Corp.",
        "Cummins Inc.",
        "CVS Corp.",
        "Cytec Industries Inc.",
        "D&K Healthcare Resources, Inc.",
        "D.R. Horton Inc.",
        "Dana Corporation",
        "Danaher Corporation",
        "Darden Restaurants Inc.",
        "DaVita Inc.",
        "Dean Foods Company",
        "Deere & Company",
        "Del Monte Foods Co",
        "Dell Computer Corporation",
        "Delphi Corp.",
        "Delta Air Lines Inc.",
        "Deluxe Corporation",
        "Devon Energy Corporation",
        "Di Giorgio Corporation",
        "Dial Corporation",
        "Diebold Incorporated",
        "Dillard's Inc.",
        "DIMON Incorporated",
        "Dole Food Company, Inc.",
        "Dollar General Corporation",
        "Dollar Tree Stores, Inc.",
        "Dominion Resources, Inc.",
        "Domino's Pizza LLC",
        "Dover Corporation, Inc.",
        "Dow Chemical Company",
        "Dow Jones & Company, Inc.",
        "DPL Inc.",
        "DQE Inc.",
        "Dreyer's Grand Ice Cream, Inc.",
        "DST Systems, Inc.",
        "DTE Energy Co.",
        "E.I. Du Pont de Nemours and Company",
        "Duke Energy Corp",
        "Dun & Bradstreet Inc.",
        "DURA Automotive Systems Inc.",
        "DynCorp",
        "Dynegy Inc.",
        "E*Trade Group, Inc.",
        "E.W. Scripps Company",
        "Earthlink, Inc.",
        "Eastman Chemical Company",
        "Eastman Kodak Company",
        "Eaton Corporation",
        "Echostar Communications Corporation",
        "Ecolab Inc.",
        "Edison International",
        "EGL Inc.",
        "El Paso Corporation",
        "Electronic Arts Inc.",
        "Electronic Data Systems Corp.",
        "Eli Lilly and Company",
        "EMC Corporation",
        "Emcor Group Inc.",
        "Emerson Electric Co.",
        "Encompass Services Corporation",
        "Energizer Holdings Inc.",
        "Energy East Corporation",
        "Engelhard Corporation",
        "Enron Corp.",
        "Entergy Corporation",
        "Enterprise Products Partners L.P.",
        "EOG Resources, Inc.",
        "Equifax Inc.",
        "Equitable Resources Inc.",
        "Equity Office Properties Trust",
        "Equity Residential Properties Trust",
        "Estee Lauder Companies Inc.",
        "Exelon Corporation",
        "Exide Technologies",
        "Expeditors International of Washington Inc.",
        "Express Scripts Inc.",
        "ExxonMobil Corporation",
        "Fairchild Semiconductor International Inc.",
        "Family Dollar Stores Inc.",
        "Farmland Industries Inc.",
        "Federal Mogul Corp.",
        "Federated Department Stores Inc.",
        "Federal Express Corp.",
        "Felcor Lodging Trust Inc.",
        "Ferro Corp.",
        "Fidelity National Financial Inc.",
        "Fifth Third Bancorp",
        "First American Financial Corp.",
        "First Data Corp.",
        "First National of Nebraska Inc.",
        "First Tennessee National Corp.",
        "FirstEnergy Corp.",
        "Fiserv Inc.",
        "Fisher Scientific International Inc.",
        "FleetBoston Financial Co.",
        "Fleetwood Enterprises Inc.",
        "Fleming Companies Inc.",
        "Flowers Foods Inc.",
        "Flowserv Corp",
        "Fluor Corp",
        "FMC Corp",
        "Foamex International Inc",
        "Foot Locker Inc",
        "Footstar Inc.",
        "Ford Motor Co",
        "Forest Laboratories Inc.",
        "Fortune Brands Inc.",
        "Foster Wheeler Ltd.",
        "FPL Group Inc.",
        "Franklin Resources Inc.",
        "Freeport McMoran Copper & Gold Inc.",
        "Frontier Oil Corp",
        "Furniture Brands International Inc.",
        "Gannett Co., Inc.",
        "Gap Inc.",
        "Gateway Inc.",
        "GATX Corporation",
        "Gemstar-TV Guide International Inc.",
        "GenCorp Inc.",
        "General Cable Corporation",
        "General Dynamics Corporation",
        "General Electric Company",
        "General Mills Inc",
        "General Motors Corporation",
        "Genesis Health Ventures Inc.",
        "Gentek Inc.",
        "Gentiva Health Services Inc.",
        "Genuine Parts Company",
        "Genuity Inc.",
        "Genzyme Corporation",
        "Georgia Gulf Corporation",
        "Georgia-Pacific Corporation",
        "Gillette Company",
        "Gold Kist Inc.",
        "Golden State Bancorp Inc.",
        "Golden West Financial Corporation",
        "Goldman Sachs Group Inc.",
        "Goodrich Corporation",
        "The Goodyear Tire & Rubber Company",
        "Granite Construction Incorporated",
        "Graybar Electric Company Inc.",
        "Great Lakes Chemical Corporation",
        "Great Plains Energy Inc.",
        "GreenPoint Financial Corp.",
        "Greif Bros. Corporation",
        "Grey Global Group Inc.",
        "Group 1 Automotive Inc.",
        "Guidant Corporation",
        "H&R Block Inc.",
        "H.B. Fuller Company",
        "H.J. Heinz Company",
        "Halliburton Co.",
        "Harley-Davidson Inc.",
        "Harman International Industries Inc.",
        "Harrah's Entertainment Inc.",
        "Harris Corp.",
        "Harsco Corp.",
        "Hartford Financial Services Group Inc.",
        "Hasbro Inc.",
        "Hawaiian Electric Industries Inc.",
        "HCA Inc.",
        "Health Management Associates Inc.",
        "Health Net Inc.",
        "Healthsouth Corp",
        "Henry Schein Inc.",
        "Hercules Inc.",
        "Herman Miller Inc.",
        "Hershey Foods Corp.",
        "Hewlett-Packard Company",
        "Hibernia Corp.",
        "Hillenbrand Industries Inc.",
        "Hilton Hotels Corp.",
        "Hollywood Entertainment Corp.",
        "Home Depot Inc.",
        "Hon Industries Inc.",
        "Honeywell International Inc.",
        "Hormel Foods Corp.",
        "Host Marriott Corp.",
        "Household International Corp.",
        "Hovnanian Enterprises Inc.",
        "Hub Group Inc.",
        "Hubbell Inc.",
        "Hughes Supply Inc.",
        "Humana Inc.",
        "Huntington Bancshares Inc.",
        "Idacorp Inc.",
        "IDT Corporation",
        "IKON Office Solutions Inc.",
        "Illinois Tool Works Inc.",
        "IMC Global Inc.",
        "Imperial Sugar Company",
        "IMS Health Inc.",
        "Ingles Market Inc",
        "Ingram Micro Inc.",
        "Insight Enterprises Inc.",
        "Integrated Electrical Services Inc.",
        "Intel Corporation",
        "International Paper Co.",
        "Interpublic Group of Companies Inc.",
        "Interstate Bakeries Corporation",
        "International Business Machines Corp.",
        "International Flavors & Fragrances Inc.",
        "International Multifoods Corporation",
        "Intuit Inc.",
        "IT Group Inc.",
        "ITT Industries Inc.",
        "Ivax Corp.",
        "J.B. Hunt Transport Services Inc.",
        "J.C. Penny Co.",
        "J.P. Morgan Chase & Co.",
        "Jabil Circuit Inc.",
        "Jack In The Box Inc.",
        "Jacobs Engineering Group Inc.",
        "JDS Uniphase Corp.",
        "Jefferson-Pilot Co.",
        "John Hancock Financial Services Inc.",
        "Johnson & Johnson",
        "Johnson Controls Inc.",
        "Jones Apparel Group Inc.",
        "KB Home",
        "Kellogg Company",
        "Kellwood Company",
        "Kelly Services Inc.",
        "Kemet Corp.",
        "Kennametal Inc.",
        "Kerr-McGee Corporation",
        "KeyCorp",
        "KeySpan Corp.",
        "Kimball International Inc.",
        "Kimberly-Clark Corporation",
        "Kindred Healthcare Inc.",
        "KLA-Tencor Corporation",
        "K-Mart Corp.",
        "Knight-Ridder Inc.",
        "Kohl's Corp.",
        "KPMG Consulting Inc.",
        "Kroger Co.",
        "L-3 Communications Holdings Inc.",
        "Laboratory Corporation of America Holdings",
        "Lam Research Corporation",
        "LandAmerica Financial Group Inc.",
        "Lands' End Inc.",
        "Landstar System Inc.",
        "La-Z-Boy Inc.",
        "Lear Corporation",
        "Legg Mason Inc.",
        "Leggett & Platt Inc.",
        "Lehman Brothers Holdings Inc.",
        "Lennar Corporation",
        "Lennox International Inc.",
        "Level 3 Communications Inc.",
        "Levi Strauss & Co.",
        "Lexmark International Inc.",
        "Limited Inc.",
        "Lincoln National Corporation",
        "Linens 'n Things Inc.",
        "Lithia Motors Inc.",
        "Liz Claiborne Inc.",
        "Lockheed Martin Corporation",
        "Loews Corporation",
        "Longs Drug Stores Corporation",
        "Louisiana-Pacific Corporation",
        "Lowe's Companies Inc.",
        "LSI Logic Corporation",
        "The LTV Corporation",
        "The Lubrizol Corporation",
        "Lucent Technologies Inc.",
        "Lyondell Chemical Company",
        "M & T Bank Corporation",
        "Magellan Health Services Inc.",
        "Mail-Well Inc.",
        "Mandalay Resort Group",
        "Manor Care Inc.",
        "Manpower Inc.",
        "Marathon Oil Corporation",
        "Mariner Health Care Inc.",
        "Markel Corporation",
        "Marriott International Inc.",
        "Marsh & McLennan Companies Inc.",
        "Marsh Supermarkets Inc.",
        "Marshall & Ilsley Corporation",
        "Martin Marietta Materials Inc.",
        "Masco Corporation",
        "Massey Energy Company",
        "MasTec Inc.",
        "Mattel Inc.",
        "Maxim Integrated Products Inc.",
        "Maxtor Corporation",
        "Maxxam Inc.",
        "The May Department Stores Company",
        "Maytag Corporation",
        "MBNA Corporation",
        "McCormick & Company Incorporated",
        "McDonald's Corporation",
        "The McGraw-Hill Companies Inc.",
        "McKesson Corporation",
        "McLeodUSA Incorporated",
        "M.D.C. Holdings Inc.",
        "MDU Resources Group Inc.",
        "MeadWestvaco Corporation",
        "Medtronic Inc.",
        "Mellon Financial Corporation",
        "The Men's Wearhouse Inc.",
        "Merck & Co., Inc.",
        "Mercury General Corporation",
        "Merrill Lynch & Co. Inc.",
        "Metaldyne Corporation",
        "Metals USA Inc.",
        "MetLife Inc.",
        "Metris Companies Inc",
        "MGIC Investment Corporation",
        "MGM Mirage",
        "Michaels Stores Inc.",
        "Micron Technology Inc.",
        "Microsoft Corporation",
        "Milacron Inc.",
        "Millennium Chemicals Inc.",
        "Mirant Corporation",
        "Mohawk Industries Inc.",
        "Molex Incorporated",
        "The MONY Group Inc.",
        "Morgan Stanley Dean Witter & Co.",
        "Motorola Inc.",
        "MPS Group Inc.",
        "Murphy Oil Corporation",
        "Nabors Industries Inc",
        "Nacco Industries Inc",
        "Nash Finch Company",
        "National City Corp.",
        "National Commerce Financial Corporation",
        "National Fuel Gas Company",
        "National Oilwell Inc",
        "National Rural Utilities Cooperative Finance Corporation",
        "National Semiconductor Corporation",
        "National Service Industries Inc",
        "Navistar International Corporation",
        "NCR Corporation",
        "The Neiman Marcus Group Inc.",
        "New Jersey Resources Corporation",
        "New York Times Company",
        "Newell Rubbermaid Inc",
        "Newmont Mining Corporation",
        "Nextel Communications Inc",
        "Nicor Inc",
        "Nike Inc",
        "NiSource Inc",
        "Noble Energy Inc",
        "Nordstrom Inc",
        "Norfolk Southern Corporation",
        "Nortek Inc",
        "North Fork Bancorporation Inc",
        "Northeast Utilities System",
        "Northern Trust Corporation",
        "Northrop Grumman Corporation",
        "NorthWestern Corporation",
        "Novellus Systems Inc",
        "NSTAR",
        "NTL Incorporated",
        "Nucor Corp",
        "Nvidia Corp",
        "NVR Inc",
        "Northwest Airlines Corp",
        "Occidental Petroleum Corp",
        "Ocean Energy Inc",
        "Office Depot Inc.",
        "OfficeMax Inc",
        "OGE Energy Corp",
        "Oglethorpe Power Corp.",
        "Ohio Casualty Corp.",
        "Old Republic International Corp.",
        "Olin Corp.",
        "OM Group Inc",
        "Omnicare Inc",
        "Omnicom Group",
        "On Semiconductor Corp",
        "ONEOK Inc",
        "Oracle Corp",
        "Oshkosh Truck Corp",
        "Outback Steakhouse Inc.",
        "Owens & Minor Inc.",
        "Owens Corning",
        "Owens-Illinois Inc",
        "Oxford Health Plans Inc",
        "Paccar Inc",
        "PacifiCare Health Systems Inc",
        "Packaging Corp. of America",
        "Pactiv Corp",
        "Pall Corp",
        "Pantry Inc",
        "Park Place Entertainment Corp",
        "Parker Hannifin Corp.",
        "Pathmark Stores Inc.",
        "Paychex Inc",
        "Payless Shoesource Inc",
        "Penn Traffic Co.",
        "Pennzoil-Quaker State Company",
        "Pentair Inc",
        "Peoples Energy Corp.",
        "PeopleSoft Inc",
        "Pep Boys Manny, Moe & Jack",
        "Potomac Electric Power Co.",
        "Pepsi Bottling Group Inc.",
        "PepsiAmericas Inc.",
        "PepsiCo Inc.",
        "Performance Food Group Co.",
        "Perini Corp",
        "PerkinElmer Inc",
        "Perot Systems Corp",
        "Petco Animal Supplies Inc.",
        "Peter Kiewit Sons', Inc.",
        "PETsMART Inc",
        "Pfizer Inc",
        "Pacific Gas & Electric Corp.",
        "Pharmacia Corp",
        "Phar Mor Inc.",
        "Phelps Dodge Corp.",
        "Philip Morris Companies Inc.",
        "Phillips Petroleum Co",
        "Phillips Van Heusen Corp.",
        "Phoenix Companies Inc",
        "Pier 1 Imports Inc.",
        "Pilgrim's Pride Corporation",
        "Pinnacle West Capital Corp",
        "Pioneer-Standard Electronics Inc.",
        "Pitney Bowes Inc.",
        "Pittston Brinks Group",
        "Plains All American Pipeline LP",
        "PNC Financial Services Group Inc.",
        "PNM Resources Inc",
        "Polaris Industries Inc.",
        "Polo Ralph Lauren Corp",
        "PolyOne Corp",
        "Popular Inc",
        "Potlatch Corp",
        "PPG Industries Inc",
        "PPL Corp",
        "Praxair Inc",
        "Precision Castparts Corp",
        "Premcor Inc.",
        "Pride International Inc",
        "Primedia Inc",
        "Principal Financial Group Inc.",
        "Procter & Gamble Co.",
        "Pro-Fac Cooperative Inc.",
        "Progress Energy Inc",
        "Progressive Corporation",
        "Protective Life Corp",
        "Provident Financial Group",
        "Providian Financial Corp.",
        "Prudential Financial Inc.",
        "PSS World Medical Inc",
        "Public Service Enterprise Group Inc.",
        "Publix Super Markets Inc.",
        "Puget Energy Inc.",
        "Pulte Homes Inc",
        "Qualcomm Inc",
        "Quanta Services Inc.",
        "Quantum Corp",
        "Quest Diagnostics Inc.",
        "Questar Corp",
        "Quintiles Transnational",
        "Qwest Communications Intl Inc",
        "R.J. Reynolds Tobacco Company",
        "R.R. Donnelley & Sons Company",
        "Radio Shack Corporation",
        "Raymond James Financial Inc.",
        "Raytheon Company",
        "Reader's Digest Association Inc.",
        "Reebok International Ltd.",
        "Regions Financial Corp.",
        "Regis Corporation",
        "Reliance Steel & Aluminum Co.",
        "Reliant Energy Inc.",
        "Rent A Center Inc",
        "Republic Services Inc",
        "Revlon Inc",
        "RGS Energy Group Inc",
        "Rite Aid Corp",
        "Riverwood Holding Inc.",
        "RoadwayCorp",
        "Robert Half International Inc.",
        "Rock-Tenn Co",
        "Rockwell Automation Inc",
        "Rockwell Collins Inc",
        "Rohm & Haas Co.",
        "Ross Stores Inc",
        "RPM Inc.",
        "Ruddick Corp",
        "Ryder System Inc",
        "Ryerson Tull Inc",
        "Ryland Group Inc.",
        "Sabre Holdings Corp",
        "Safeco Corp",
        "Safeguard Scientifics Inc.",
        "Safeway Inc",
        "Saks Inc",
        "Sanmina-SCI Inc",
        "Sara Lee Corp",
        "SBC Communications Inc",
        "Scana Corp.",
        "Schering-Plough Corp",
        "Scholastic Corp",
        "SCI Systems Onc.",
        "Science Applications Intl. Inc.",
        "Scientific-Atlanta Inc",
        "Scotts Company",
        "Seaboard Corp",
        "Sealed Air Corp",
        "Sears Roebuck & Co",
        "Sempra Energy",
        "Sequa Corp",
        "Service Corp. International",
        "ServiceMaster Co",
        "Shaw Group Inc",
        "Sherwin-Williams Company",
        "Shopko Stores Inc",
        "Siebel Systems Inc",
        "Sierra Health Services Inc",
        "Sierra Pacific Resources",
        "Silgan Holdings Inc.",
        "Silicon Graphics Inc",
        "Simon Property Group Inc",
        "SLM Corporation",
        "Smith International Inc",
        "Smithfield Foods Inc",
        "Smurfit-Stone Container Corp",
        "Snap-On Inc",
        "Solectron Corp",
        "Solutia Inc",
        "Sonic Automotive Inc.",
        "Sonoco Products Co.",
        "Southern Company",
        "Southern Union Company",
        "SouthTrust Corp.",
        "Southwest Airlines Co",
        "Southwest Gas Corp",
        "Sovereign Bancorp Inc.",
        "Spartan Stores Inc",
        "Spherion Corp",
        "Sports Authority Inc",
        "Sprint Corp.",
        "SPX Corp",
        "St. Jude Medical Inc",
        "St. Paul Cos.",
        "Staff Leasing Inc.",
        "StanCorp Financial Group Inc",
        "Standard Pacific Corp.",
        "Stanley Works",
        "Staples Inc",
        "Starbucks Corp",
        "Starwood Hotels & Resorts Worldwide Inc",
        "State Street Corp.",
        "Stater Bros. Holdings Inc.",
        "Steelcase Inc",
        "Stein Mart Inc",
        "Stewart & Stevenson Services Inc",
        "Stewart Information Services Corp",
        "Stilwell Financial Inc",
        "Storage Technology Corporation",
        "Stryker Corp",
        "Sun Healthcare Group Inc.",
        "Sun Microsystems Inc.",
        "SunGard Data Systems Inc.",
        "Sunoco Inc.",
        "SunTrust Banks Inc",
        "Supervalu Inc",
        "Swift Transportation, Co., Inc",
        "Symbol Technologies Inc",
        "Synovus Financial Corp.",
        "Sysco Corp",
        "Systemax Inc.",
        "Target Corp.",
        "Tech Data Corporation",
        "TECO Energy Inc",
        "Tecumseh Products Company",
        "Tektronix Inc",
        "Teleflex Incorporated",
        "Telephone & Data Systems Inc",
        "Tellabs Inc.",
        "Temple-Inland Inc",
        "Tenet Healthcare Corporation",
        "Tenneco Automotive Inc.",
        "Teradyne Inc",
        "Terex Corp",
        "Tesoro Petroleum Corp.",
        "Texas Industries Inc.",
        "Texas Instruments Incorporated",
        "Textron Inc",
        "Thermo Electron Corporation",
        "Thomas & Betts Corporation",
        "Tiffany & Co",
        "Timken Company",
        "TJX Companies Inc",
        "TMP Worldwide Inc",
        "Toll Brothers Inc",
        "Torchmark Corporation",
        "Toro Company",
        "Tower Automotive Inc.",
        "Toys 'R' Us Inc",
        "Trans World Entertainment Corp.",
        "TransMontaigne Inc",
        "Transocean Inc",
        "TravelCenters of America Inc.",
        "Triad Hospitals Inc",
        "Tribune Company",
        "Trigon Healthcare Inc.",
        "Trinity Industries Inc",
        "Trump Hotels & Casino Resorts Inc.",
        "TruServ Corporation",
        "TRW Inc",
        "TXU Corp",
        "Tyson Foods Inc",
        "U.S. Bancorp",
        "U.S. Industries Inc.",
        "UAL Corporation",
        "UGI Corporation",
        "Unified Western Grocers Inc",
        "Union Pacific Corporation",
        "Union Planters Corp",
        "Unisource Energy Corp",
        "Unisys Corporation",
        "United Auto Group Inc",
        "United Defense Industries Inc.",
        "United Parcel Service Inc",
        "United Rentals Inc",
        "United Stationers Inc",
        "United Technologies Corporation",
        "UnitedHealth Group Incorporated",
        "Unitrin Inc",
        "Universal Corporation",
        "Universal Forest Products Inc",
        "Universal Health Services Inc",
        "Unocal Corporation",
        "Unova Inc",
        "UnumProvident Corporation",
        "URS Corporation",
        "US Airways Group Inc",
        "US Oncology Inc",
        "USA Interactive",
        "USFreighways Corporation",
        "USG Corporation",
        "UST Inc",
        "Valero Energy Corporation",
        "Valspar Corporation",
        "Value City Department Stores Inc",
        "Varco International Inc",
        "Vectren Corporation",
        "Veritas Software Corporation",
        "Verizon Communications Inc",
        "VF Corporation",
        "Viacom Inc",
        "Viad Corp",
        "Viasystems Group Inc",
        "Vishay Intertechnology Inc",
        "Visteon Corporation",
        "Volt Information Sciences Inc",
        "Vulcan Materials Company",
        "W.R. Berkley Corporation",
        "W.R. Grace & Co",
        "W.W. Grainger Inc",
        "Wachovia Corporation",
        "Wakenhut Corporation",
        "Walgreen Co",
        "Wallace Computer Services Inc",
        "Wal-Mart Stores Inc",
        "Walt Disney Co",
        "Walter Industries Inc",
        "Washington Mutual Inc",
        "Washington Post Co.",
        "Waste Management Inc",
        "Watsco Inc",
        "Weatherford International Inc",
        "Weis Markets Inc.",
        "Wellpoint Health Networks Inc",
        "Wells Fargo & Company",
        "Wendy's International Inc",
        "Werner Enterprises Inc",
        "WESCO International Inc",
        "Western Digital Inc",
        "Western Gas Resources Inc",
        "WestPoint Stevens Inc",
        "Weyerhauser Company",
        "WGL Holdings Inc",
        "Whirlpool Corporation",
        "Whole Foods Market Inc",
        "Willamette Industries Inc.",
        "Williams Companies Inc",
        "Williams Sonoma Inc",
        "Winn Dixie Stores Inc",
        "Wisconsin Energy Corporation",
        "Wm Wrigley Jr Company",
        "World Fuel Services Corporation",
        "WorldCom Inc",
        "Worthington Industries Inc",
        "WPS Resources Corporation",
        "Wyeth",
        "Wyndham International Inc",
        "Xcel Energy Inc",
        "Xerox Corp",
        "Xilinx Inc",
        "XO Communications Inc",
        "Yellow Corporation",
        "York International Corp",
        "Yum Brands Inc.",
        "Zale Corporation",
        "Zions Bancorporation"
      ],

        fileExtension : {
            "raster"    : ["bmp", "gif", "gpl", "ico", "jpeg", "psd", "png", "psp", "raw", "tiff"],
            "vector"    : ["3dv", "amf", "awg", "ai", "cgm", "cdr", "cmx", "dxf", "e2d", "egt", "eps", "fs", "odg", "svg", "xar"],
            "3d"        : ["3dmf", "3dm", "3mf", "3ds", "an8", "aoi", "blend", "cal3d", "cob", "ctm", "iob", "jas", "max", "mb", "mdx", "obj", "x", "x3d"],
            "document"  : ["doc", "docx", "dot", "html", "xml", "odt", "odm", "ott", "csv", "rtf", "tex", "xhtml", "xps"]
        },

        // Data taken from https://github.com/dmfilipenko/timezones.json/blob/master/timezones.json
        timezones: [
                  {
                    "name": "Dateline Standard Time",
                    "abbr": "DST",
                    "offset": -12,
                    "isdst": false,
                    "text": "(UTC-12:00) International Date Line West",
                    "utc": [
                      "Etc/GMT+12"
                    ]
                  },
                  {
                    "name": "UTC-11",
                    "abbr": "U",
                    "offset": -11,
                    "isdst": false,
                    "text": "(UTC-11:00) Coordinated Universal Time-11",
                    "utc": [
                      "Etc/GMT+11",
                      "Pacific/Midway",
                      "Pacific/Niue",
                      "Pacific/Pago_Pago"
                    ]
                  },
                  {
                    "name": "Hawaiian Standard Time",
                    "abbr": "HST",
                    "offset": -10,
                    "isdst": false,
                    "text": "(UTC-10:00) Hawaii",
                    "utc": [
                      "Etc/GMT+10",
                      "Pacific/Honolulu",
                      "Pacific/Johnston",
                      "Pacific/Rarotonga",
                      "Pacific/Tahiti"
                    ]
                  },
                  {
                    "name": "Alaskan Standard Time",
                    "abbr": "AKDT",
                    "offset": -8,
                    "isdst": true,
                    "text": "(UTC-09:00) Alaska",
                    "utc": [
                      "America/Anchorage",
                      "America/Juneau",
                      "America/Nome",
                      "America/Sitka",
                      "America/Yakutat"
                    ]
                  },
                  {
                    "name": "Pacific Standard Time (Mexico)",
                    "abbr": "PDT",
                    "offset": -7,
                    "isdst": true,
                    "text": "(UTC-08:00) Baja California",
                    "utc": [
                      "America/Santa_Isabel"
                    ]
                  },
                  {
                    "name": "Pacific Standard Time",
                    "abbr": "PDT",
                    "offset": -7,
                    "isdst": true,
                    "text": "(UTC-08:00) Pacific Time (US & Canada)",
                    "utc": [
                      "America/Dawson",
                      "America/Los_Angeles",
                      "America/Tijuana",
                      "America/Vancouver",
                      "America/Whitehorse",
                      "PST8PDT"
                    ]
                  },
                  {
                    "name": "US Mountain Standard Time",
                    "abbr": "UMST",
                    "offset": -7,
                    "isdst": false,
                    "text": "(UTC-07:00) Arizona",
                    "utc": [
                      "America/Creston",
                      "America/Dawson_Creek",
                      "America/Hermosillo",
                      "America/Phoenix",
                      "Etc/GMT+7"
                    ]
                  },
                  {
                    "name": "Mountain Standard Time (Mexico)",
                    "abbr": "MDT",
                    "offset": -6,
                    "isdst": true,
                    "text": "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
                    "utc": [
                      "America/Chihuahua",
                      "America/Mazatlan"
                    ]
                  },
                  {
                    "name": "Mountain Standard Time",
                    "abbr": "MDT",
                    "offset": -6,
                    "isdst": true,
                    "text": "(UTC-07:00) Mountain Time (US & Canada)",
                    "utc": [
                      "America/Boise",
                      "America/Cambridge_Bay",
                      "America/Denver",
                      "America/Edmonton",
                      "America/Inuvik",
                      "America/Ojinaga",
                      "America/Yellowknife",
                      "MST7MDT"
                    ]
                  },
                  {
                    "name": "Central America Standard Time",
                    "abbr": "CAST",
                    "offset": -6,
                    "isdst": false,
                    "text": "(UTC-06:00) Central America",
                    "utc": [
                      "America/Belize",
                      "America/Costa_Rica",
                      "America/El_Salvador",
                      "America/Guatemala",
                      "America/Managua",
                      "America/Tegucigalpa",
                      "Etc/GMT+6",
                      "Pacific/Galapagos"
                    ]
                  },
                  {
                    "name": "Central Standard Time",
                    "abbr": "CDT",
                    "offset": -5,
                    "isdst": true,
                    "text": "(UTC-06:00) Central Time (US & Canada)",
                    "utc": [
                      "America/Chicago",
                      "America/Indiana/Knox",
                      "America/Indiana/Tell_City",
                      "America/Matamoros",
                      "America/Menominee",
                      "America/North_Dakota/Beulah",
                      "America/North_Dakota/Center",
                      "America/North_Dakota/New_Salem",
                      "America/Rainy_River",
                      "America/Rankin_Inlet",
                      "America/Resolute",
                      "America/Winnipeg",
                      "CST6CDT"
                    ]
                  },
                  {
                    "name": "Central Standard Time (Mexico)",
                    "abbr": "CDT",
                    "offset": -5,
                    "isdst": true,
                    "text": "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
                    "utc": [
                      "America/Bahia_Banderas",
                      "America/Cancun",
                      "America/Merida",
                      "America/Mexico_City",
                      "America/Monterrey"
                    ]
                  },
                  {
                    "name": "Canada Central Standard Time",
                    "abbr": "CCST",
                    "offset": -6,
                    "isdst": false,
                    "text": "(UTC-06:00) Saskatchewan",
                    "utc": [
                      "America/Regina",
                      "America/Swift_Current"
                    ]
                  },
                  {
                    "name": "SA Pacific Standard Time",
                    "abbr": "SPST",
                    "offset": -5,
                    "isdst": false,
                    "text": "(UTC-05:00) Bogota, Lima, Quito",
                    "utc": [
                      "America/Bogota",
                      "America/Cayman",
                      "America/Coral_Harbour",
                      "America/Eirunepe",
                      "America/Guayaquil",
                      "America/Jamaica",
                      "America/Lima",
                      "America/Panama",
                      "America/Rio_Branco",
                      "Etc/GMT+5"
                    ]
                  },
                  {
                    "name": "Eastern Standard Time",
                    "abbr": "EDT",
                    "offset": -4,
                    "isdst": true,
                    "text": "(UTC-05:00) Eastern Time (US & Canada)",
                    "utc": [
                      "America/Detroit",
                      "America/Havana",
                      "America/Indiana/Petersburg",
                      "America/Indiana/Vincennes",
                      "America/Indiana/Winamac",
                      "America/Iqaluit",
                      "America/Kentucky/Monticello",
                      "America/Louisville",
                      "America/Montreal",
                      "America/Nassau",
                      "America/New_York",
                      "America/Nipigon",
                      "America/Pangnirtung",
                      "America/Port-au-Prince",
                      "America/Thunder_Bay",
                      "America/Toronto",
                      "EST5EDT"
                    ]
                  },
                  {
                    "name": "US Eastern Standard Time",
                    "abbr": "UEDT",
                    "offset": -4,
                    "isdst": true,
                    "text": "(UTC-05:00) Indiana (East)",
                    "utc": [
                      "America/Indiana/Marengo",
                      "America/Indiana/Vevay",
                      "America/Indianapolis"
                    ]
                  },
                  {
                    "name": "Venezuela Standard Time",
                    "abbr": "VST",
                    "offset": -4.5,
                    "isdst": false,
                    "text": "(UTC-04:30) Caracas",
                    "utc": [
                      "America/Caracas"
                    ]
                  },
                  {
                    "name": "Paraguay Standard Time",
                    "abbr": "PST",
                    "offset": -4,
                    "isdst": false,
                    "text": "(UTC-04:00) Asuncion",
                    "utc": [
                      "America/Asuncion"
                    ]
                  },
                  {
                    "name": "Atlantic Standard Time",
                    "abbr": "ADT",
                    "offset": -3,
                    "isdst": true,
                    "text": "(UTC-04:00) Atlantic Time (Canada)",
                    "utc": [
                      "America/Glace_Bay",
                      "America/Goose_Bay",
                      "America/Halifax",
                      "America/Moncton",
                      "America/Thule",
                      "Atlantic/Bermuda"
                    ]
                  },
                  {
                    "name": "Central Brazilian Standard Time",
                    "abbr": "CBST",
                    "offset": -4,
                    "isdst": false,
                    "text": "(UTC-04:00) Cuiaba",
                    "utc": [
                      "America/Campo_Grande",
                      "America/Cuiaba"
                    ]
                  },
                  {
                    "name": "SA Western Standard Time",
                    "abbr": "SWST",
                    "offset": -4,
                    "isdst": false,
                    "text": "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
                    "utc": [
                      "America/Anguilla",
                      "America/Antigua",
                      "America/Aruba",
                      "America/Barbados",
                      "America/Blanc-Sablon",
                      "America/Boa_Vista",
                      "America/Curacao",
                      "America/Dominica",
                      "America/Grand_Turk",
                      "America/Grenada",
                      "America/Guadeloupe",
                      "America/Guyana",
                      "America/Kralendijk",
                      "America/La_Paz",
                      "America/Lower_Princes",
                      "America/Manaus",
                      "America/Marigot",
                      "America/Martinique",
                      "America/Montserrat",
                      "America/Port_of_Spain",
                      "America/Porto_Velho",
                      "America/Puerto_Rico",
                      "America/Santo_Domingo",
                      "America/St_Barthelemy",
                      "America/St_Kitts",
                      "America/St_Lucia",
                      "America/St_Thomas",
                      "America/St_Vincent",
                      "America/Tortola",
                      "Etc/GMT+4"
                    ]
                  },
                  {
                    "name": "Pacific SA Standard Time",
                    "abbr": "PSST",
                    "offset": -4,
                    "isdst": false,
                    "text": "(UTC-04:00) Santiago",
                    "utc": [
                      "America/Santiago",
                      "Antarctica/Palmer"
                    ]
                  },
                  {
                    "name": "Newfoundland Standard Time",
                    "abbr": "NDT",
                    "offset": -2.5,
                    "isdst": true,
                    "text": "(UTC-03:30) Newfoundland",
                    "utc": [
                      "America/St_Johns"
                    ]
                  },
                  {
                    "name": "E. South America Standard Time",
                    "abbr": "ESAST",
                    "offset": -3,
                    "isdst": false,
                    "text": "(UTC-03:00) Brasilia",
                    "utc": [
                      "America/Sao_Paulo"
                    ]
                  },
                  {
                    "name": "Argentina Standard Time",
                    "abbr": "AST",
                    "offset": -3,
                    "isdst": false,
                    "text": "(UTC-03:00) Buenos Aires",
                    "utc": [
                      "America/Argentina/La_Rioja",
                      "America/Argentina/Rio_Gallegos",
                      "America/Argentina/Salta",
                      "America/Argentina/San_Juan",
                      "America/Argentina/San_Luis",
                      "America/Argentina/Tucuman",
                      "America/Argentina/Ushuaia",
                      "America/Buenos_Aires",
                      "America/Catamarca",
                      "America/Cordoba",
                      "America/Jujuy",
                      "America/Mendoza"
                    ]
                  },
                  {
                    "name": "SA Eastern Standard Time",
                    "abbr": "SEST",
                    "offset": -3,
                    "isdst": false,
                    "text": "(UTC-03:00) Cayenne, Fortaleza",
                    "utc": [
                      "America/Araguaina",
                      "America/Belem",
                      "America/Cayenne",
                      "America/Fortaleza",
                      "America/Maceio",
                      "America/Paramaribo",
                      "America/Recife",
                      "America/Santarem",
                      "Antarctica/Rothera",
                      "Atlantic/Stanley",
                      "Etc/GMT+3"
                    ]
                  },
                  {
                    "name": "Greenland Standard Time",
                    "abbr": "GDT",
                    "offset": -2,
                    "isdst": true,
                    "text": "(UTC-03:00) Greenland",
                    "utc": [
                      "America/Godthab"
                    ]
                  },
                  {
                    "name": "Montevideo Standard Time",
                    "abbr": "MST",
                    "offset": -3,
                    "isdst": false,
                    "text": "(UTC-03:00) Montevideo",
                    "utc": [
                      "America/Montevideo"
                    ]
                  },
                  {
                    "name": "Bahia Standard Time",
                    "abbr": "BST",
                    "offset": -3,
                    "isdst": false,
                    "text": "(UTC-03:00) Salvador",
                    "utc": [
                      "America/Bahia"
                    ]
                  },
                  {
                    "name": "UTC-02",
                    "abbr": "U",
                    "offset": -2,
                    "isdst": false,
                    "text": "(UTC-02:00) Coordinated Universal Time-02",
                    "utc": [
                      "America/Noronha",
                      "Atlantic/South_Georgia",
                      "Etc/GMT+2"
                    ]
                  },
                  {
                    "name": "Mid-Atlantic Standard Time",
                    "abbr": "MDT",
                    "offset": -1,
                    "isdst": true,
                    "text": "(UTC-02:00) Mid-Atlantic - Old"
                  },
                  {
                    "name": "Azores Standard Time",
                    "abbr": "ADT",
                    "offset": 0,
                    "isdst": true,
                    "text": "(UTC-01:00) Azores",
                    "utc": [
                      "America/Scoresbysund",
                      "Atlantic/Azores"
                    ]
                  },
                  {
                    "name": "Cape Verde Standard Time",
                    "abbr": "CVST",
                    "offset": -1,
                    "isdst": false,
                    "text": "(UTC-01:00) Cape Verde Is.",
                    "utc": [
                      "Atlantic/Cape_Verde",
                      "Etc/GMT+1"
                    ]
                  },
                  {
                    "name": "Morocco Standard Time",
                    "abbr": "MDT",
                    "offset": 1,
                    "isdst": true,
                    "text": "(UTC) Casablanca",
                    "utc": [
                      "Africa/Casablanca",
                      "Africa/El_Aaiun"
                    ]
                  },
                  {
                    "name": "UTC",
                    "abbr": "CUT",
                    "offset": 0,
                    "isdst": false,
                    "text": "(UTC) Coordinated Universal Time",
                    "utc": [
                      "America/Danmarkshavn",
                      "Etc/GMT"
                    ]
                  },
                  {
                    "name": "GMT Standard Time",
                    "abbr": "GDT",
                    "offset": 1,
                    "isdst": true,
                    "text": "(UTC) Dublin, Edinburgh, Lisbon, London",
                    "utc": [
                      "Atlantic/Canary",
                      "Atlantic/Faeroe",
                      "Atlantic/Madeira",
                      "Europe/Dublin",
                      "Europe/Guernsey",
                      "Europe/Isle_of_Man",
                      "Europe/Jersey",
                      "Europe/Lisbon",
                      "Europe/London"
                    ]
                  },
                  {
                    "name": "Greenwich Standard Time",
                    "abbr": "GST",
                    "offset": 0,
                    "isdst": false,
                    "text": "(UTC) Monrovia, Reykjavik",
                    "utc": [
                      "Africa/Abidjan",
                      "Africa/Accra",
                      "Africa/Bamako",
                      "Africa/Banjul",
                      "Africa/Bissau",
                      "Africa/Conakry",
                      "Africa/Dakar",
                      "Africa/Freetown",
                      "Africa/Lome",
                      "Africa/Monrovia",
                      "Africa/Nouakchott",
                      "Africa/Ouagadougou",
                      "Africa/Sao_Tome",
                      "Atlantic/Reykjavik",
                      "Atlantic/St_Helena"
                    ]
                  },
                  {
                    "name": "W. Europe Standard Time",
                    "abbr": "WEDT",
                    "offset": 2,
                    "isdst": true,
                    "text": "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
                    "utc": [
                      "Arctic/Longyearbyen",
                      "Europe/Amsterdam",
                      "Europe/Andorra",
                      "Europe/Berlin",
                      "Europe/Busingen",
                      "Europe/Gibraltar",
                      "Europe/Luxembourg",
                      "Europe/Malta",
                      "Europe/Monaco",
                      "Europe/Oslo",
                      "Europe/Rome",
                      "Europe/San_Marino",
                      "Europe/Stockholm",
                      "Europe/Vaduz",
                      "Europe/Vatican",
                      "Europe/Vienna",
                      "Europe/Zurich"
                    ]
                  },
                  {
                    "name": "Central Europe Standard Time",
                    "abbr": "CEDT",
                    "offset": 2,
                    "isdst": true,
                    "text": "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
                    "utc": [
                      "Europe/Belgrade",
                      "Europe/Bratislava",
                      "Europe/Budapest",
                      "Europe/Ljubljana",
                      "Europe/Podgorica",
                      "Europe/Prague",
                      "Europe/Tirane"
                    ]
                  },
                  {
                    "name": "Romance Standard Time",
                    "abbr": "RDT",
                    "offset": 2,
                    "isdst": true,
                    "text": "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
                    "utc": [
                      "Africa/Ceuta",
                      "Europe/Brussels",
                      "Europe/Copenhagen",
                      "Europe/Madrid",
                      "Europe/Paris"
                    ]
                  },
                  {
                    "name": "Central European Standard Time",
                    "abbr": "CEDT",
                    "offset": 2,
                    "isdst": true,
                    "text": "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
                    "utc": [
                      "Europe/Sarajevo",
                      "Europe/Skopje",
                      "Europe/Warsaw",
                      "Europe/Zagreb"
                    ]
                  },
                  {
                    "name": "W. Central Africa Standard Time",
                    "abbr": "WCAST",
                    "offset": 1,
                    "isdst": false,
                    "text": "(UTC+01:00) West Central Africa",
                    "utc": [
                      "Africa/Algiers",
                      "Africa/Bangui",
                      "Africa/Brazzaville",
                      "Africa/Douala",
                      "Africa/Kinshasa",
                      "Africa/Lagos",
                      "Africa/Libreville",
                      "Africa/Luanda",
                      "Africa/Malabo",
                      "Africa/Ndjamena",
                      "Africa/Niamey",
                      "Africa/Porto-Novo",
                      "Africa/Tunis",
                      "Etc/GMT-1"
                    ]
                  },
                  {
                    "name": "Namibia Standard Time",
                    "abbr": "NST",
                    "offset": 1,
                    "isdst": false,
                    "text": "(UTC+01:00) Windhoek",
                    "utc": [
                      "Africa/Windhoek"
                    ]
                  },
                  {
                    "name": "GTB Standard Time",
                    "abbr": "GDT",
                    "offset": 3,
                    "isdst": true,
                    "text": "(UTC+02:00) Athens, Bucharest",
                    "utc": [
                      "Asia/Nicosia",
                      "Europe/Athens",
                      "Europe/Bucharest",
                      "Europe/Chisinau"
                    ]
                  },
                  {
                    "name": "Middle East Standard Time",
                    "abbr": "MEDT",
                    "offset": 3,
                    "isdst": true,
                    "text": "(UTC+02:00) Beirut",
                    "utc": [
                      "Asia/Beirut"
                    ]
                  },
                  {
                    "name": "Egypt Standard Time",
                    "abbr": "EST",
                    "offset": 2,
                    "isdst": false,
                    "text": "(UTC+02:00) Cairo",
                    "utc": [
                      "Africa/Cairo"
                    ]
                  },
                  {
                    "name": "Syria Standard Time",
                    "abbr": "SDT",
                    "offset": 3,
                    "isdst": true,
                    "text": "(UTC+02:00) Damascus",
                    "utc": [
                      "Asia/Damascus"
                    ]
                  },
                  {
                    "name": "E. Europe Standard Time",
                    "abbr": "EEDT",
                    "offset": 3,
                    "isdst": true,
                    "text": "(UTC+02:00) E. Europe"
                  },
                  {
                    "name": "South Africa Standard Time",
                    "abbr": "SAST",
                    "offset": 2,
                    "isdst": false,
                    "text": "(UTC+02:00) Harare, Pretoria",
                    "utc": [
                      "Africa/Blantyre",
                      "Africa/Bujumbura",
                      "Africa/Gaborone",
                      "Africa/Harare",
                      "Africa/Johannesburg",
                      "Africa/Kigali",
                      "Africa/Lubumbashi",
                      "Africa/Lusaka",
                      "Africa/Maputo",
                      "Africa/Maseru",
                      "Africa/Mbabane",
                      "Etc/GMT-2"
                    ]
                  },
                  {
                    "name": "FLE Standard Time",
                    "abbr": "FDT",
                    "offset": 3,
                    "isdst": true,
                    "text": "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
                    "utc": [
                      "Europe/Helsinki",
                      "Europe/Kiev",
                      "Europe/Mariehamn",
                      "Europe/Riga",
                      "Europe/Sofia",
                      "Europe/Tallinn",
                      "Europe/Uzhgorod",
                      "Europe/Vilnius",
                      "Europe/Zaporozhye"
                    ]
                  },
                  {
                    "name": "Turkey Standard Time",
                    "abbr": "TDT",
                    "offset": 3,
                    "isdst": true,
                    "text": "(UTC+02:00) Istanbul",
                    "utc": [
                      "Europe/Istanbul"
                    ]
                  },
                  {
                    "name": "Israel Standard Time",
                    "abbr": "JDT",
                    "offset": 3,
                    "isdst": true,
                    "text": "(UTC+02:00) Jerusalem",
                    "utc": [
                      "Asia/Jerusalem"
                    ]
                  },
                  {
                    "name": "Libya Standard Time",
                    "abbr": "LST",
                    "offset": 2,
                    "isdst": false,
                    "text": "(UTC+02:00) Tripoli",
                    "utc": [
                      "Africa/Tripoli"
                    ]
                  },
                  {
                    "name": "Jordan Standard Time",
                    "abbr": "JST",
                    "offset": 3,
                    "isdst": false,
                    "text": "(UTC+03:00) Amman",
                    "utc": [
                      "Asia/Amman"
                    ]
                  },
                  {
                    "name": "Arabic Standard Time",
                    "abbr": "AST",
                    "offset": 3,
                    "isdst": false,
                    "text": "(UTC+03:00) Baghdad",
                    "utc": [
                      "Asia/Baghdad"
                    ]
                  },
                  {
                    "name": "Kaliningrad Standard Time",
                    "abbr": "KST",
                    "offset": 3,
                    "isdst": false,
                    "text": "(UTC+03:00) Kaliningrad, Minsk",
                    "utc": [
                      "Europe/Kaliningrad",
                      "Europe/Minsk"
                    ]
                  },
                  {
                    "name": "Arab Standard Time",
                    "abbr": "AST",
                    "offset": 3,
                    "isdst": false,
                    "text": "(UTC+03:00) Kuwait, Riyadh",
                    "utc": [
                      "Asia/Aden",
                      "Asia/Bahrain",
                      "Asia/Kuwait",
                      "Asia/Qatar",
                      "Asia/Riyadh"
                    ]
                  },
                  {
                    "name": "E. Africa Standard Time",
                    "abbr": "EAST",
                    "offset": 3,
                    "isdst": false,
                    "text": "(UTC+03:00) Nairobi",
                    "utc": [
                      "Africa/Addis_Ababa",
                      "Africa/Asmera",
                      "Africa/Dar_es_Salaam",
                      "Africa/Djibouti",
                      "Africa/Juba",
                      "Africa/Kampala",
                      "Africa/Khartoum",
                      "Africa/Mogadishu",
                      "Africa/Nairobi",
                      "Antarctica/Syowa",
                      "Etc/GMT-3",
                      "Indian/Antananarivo",
                      "Indian/Comoro",
                      "Indian/Mayotte"
                    ]
                  },
                  {
                    "name": "Iran Standard Time",
                    "abbr": "IDT",
                    "offset": 4.5,
                    "isdst": true,
                    "text": "(UTC+03:30) Tehran",
                    "utc": [
                      "Asia/Tehran"
                    ]
                  },
                  {
                    "name": "Arabian Standard Time",
                    "abbr": "AST",
                    "offset": 4,
                    "isdst": false,
                    "text": "(UTC+04:00) Abu Dhabi, Muscat",
                    "utc": [
                      "Asia/Dubai",
                      "Asia/Muscat",
                      "Etc/GMT-4"
                    ]
                  },
                  {
                    "name": "Azerbaijan Standard Time",
                    "abbr": "ADT",
                    "offset": 5,
                    "isdst": true,
                    "text": "(UTC+04:00) Baku",
                    "utc": [
                      "Asia/Baku"
                    ]
                  },
                  {
                    "name": "Russian Standard Time",
                    "abbr": "RST",
                    "offset": 4,
                    "isdst": false,
                    "text": "(UTC+04:00) Moscow, St. Petersburg, Volgograd",
                    "utc": [
                      "Europe/Moscow",
                      "Europe/Samara",
                      "Europe/Simferopol",
                      "Europe/Volgograd"
                    ]
                  },
                  {
                    "name": "Mauritius Standard Time",
                    "abbr": "MST",
                    "offset": 4,
                    "isdst": false,
                    "text": "(UTC+04:00) Port Louis",
                    "utc": [
                      "Indian/Mahe",
                      "Indian/Mauritius",
                      "Indian/Reunion"
                    ]
                  },
                  {
                    "name": "Georgian Standard Time",
                    "abbr": "GST",
                    "offset": 4,
                    "isdst": false,
                    "text": "(UTC+04:00) Tbilisi",
                    "utc": [
                      "Asia/Tbilisi"
                    ]
                  },
                  {
                    "name": "Caucasus Standard Time",
                    "abbr": "CST",
                    "offset": 4,
                    "isdst": false,
                    "text": "(UTC+04:00) Yerevan",
                    "utc": [
                      "Asia/Yerevan"
                    ]
                  },
                  {
                    "name": "Afghanistan Standard Time",
                    "abbr": "AST",
                    "offset": 4.5,
                    "isdst": false,
                    "text": "(UTC+04:30) Kabul",
                    "utc": [
                      "Asia/Kabul"
                    ]
                  },
                  {
                    "name": "West Asia Standard Time",
                    "abbr": "WAST",
                    "offset": 5,
                    "isdst": false,
                    "text": "(UTC+05:00) Ashgabat, Tashkent",
                    "utc": [
                      "Antarctica/Mawson",
                      "Asia/Aqtau",
                      "Asia/Aqtobe",
                      "Asia/Ashgabat",
                      "Asia/Dushanbe",
                      "Asia/Oral",
                      "Asia/Samarkand",
                      "Asia/Tashkent",
                      "Etc/GMT-5",
                      "Indian/Kerguelen",
                      "Indian/Maldives"
                    ]
                  },
                  {
                    "name": "Pakistan Standard Time",
                    "abbr": "PST",
                    "offset": 5,
                    "isdst": false,
                    "text": "(UTC+05:00) Islamabad, Karachi",
                    "utc": [
                      "Asia/Karachi"
                    ]
                  },
                  {
                    "name": "India Standard Time",
                    "abbr": "IST",
                    "offset": 5.5,
                    "isdst": false,
                    "text": "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
                    "utc": [
                      "Asia/Calcutta"
                    ]
                  },
                  {
                    "name": "Sri Lanka Standard Time",
                    "abbr": "SLST",
                    "offset": 5.5,
                    "isdst": false,
                    "text": "(UTC+05:30) Sri Jayawardenepura",
                    "utc": [
                      "Asia/Colombo"
                    ]
                  },
                  {
                    "name": "Nepal Standard Time",
                    "abbr": "NST",
                    "offset": 5.75,
                    "isdst": false,
                    "text": "(UTC+05:45) Kathmandu",
                    "utc": [
                      "Asia/Katmandu"
                    ]
                  },
                  {
                    "name": "Central Asia Standard Time",
                    "abbr": "CAST",
                    "offset": 6,
                    "isdst": false,
                    "text": "(UTC+06:00) Astana",
                    "utc": [
                      "Antarctica/Vostok",
                      "Asia/Almaty",
                      "Asia/Bishkek",
                      "Asia/Qyzylorda",
                      "Asia/Urumqi",
                      "Etc/GMT-6",
                      "Indian/Chagos"
                    ]
                  },
                  {
                    "name": "Bangladesh Standard Time",
                    "abbr": "BST",
                    "offset": 6,
                    "isdst": false,
                    "text": "(UTC+06:00) Dhaka",
                    "utc": [
                      "Asia/Dhaka",
                      "Asia/Thimphu"
                    ]
                  },
                  {
                    "name": "Ekaterinburg Standard Time",
                    "abbr": "EST",
                    "offset": 6,
                    "isdst": false,
                    "text": "(UTC+06:00) Ekaterinburg",
                    "utc": [
                      "Asia/Yekaterinburg"
                    ]
                  },
                  {
                    "name": "Myanmar Standard Time",
                    "abbr": "MST",
                    "offset": 6.5,
                    "isdst": false,
                    "text": "(UTC+06:30) Yangon (Rangoon)",
                    "utc": [
                      "Asia/Rangoon",
                      "Indian/Cocos"
                    ]
                  },
                  {
                    "name": "SE Asia Standard Time",
                    "abbr": "SAST",
                    "offset": 7,
                    "isdst": false,
                    "text": "(UTC+07:00) Bangkok, Hanoi, Jakarta",
                    "utc": [
                      "Antarctica/Davis",
                      "Asia/Bangkok",
                      "Asia/Hovd",
                      "Asia/Jakarta",
                      "Asia/Phnom_Penh",
                      "Asia/Pontianak",
                      "Asia/Saigon",
                      "Asia/Vientiane",
                      "Etc/GMT-7",
                      "Indian/Christmas"
                    ]
                  },
                  {
                    "name": "N. Central Asia Standard Time",
                    "abbr": "NCAST",
                    "offset": 7,
                    "isdst": false,
                    "text": "(UTC+07:00) Novosibirsk",
                    "utc": [
                      "Asia/Novokuznetsk",
                      "Asia/Novosibirsk",
                      "Asia/Omsk"
                    ]
                  },
                  {
                    "name": "China Standard Time",
                    "abbr": "CST",
                    "offset": 8,
                    "isdst": false,
                    "text": "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
                    "utc": [
                      "Asia/Hong_Kong",
                      "Asia/Macau",
                      "Asia/Shanghai"
                    ]
                  },
                  {
                    "name": "North Asia Standard Time",
                    "abbr": "NAST",
                    "offset": 8,
                    "isdst": false,
                    "text": "(UTC+08:00) Krasnoyarsk",
                    "utc": [
                      "Asia/Krasnoyarsk"
                    ]
                  },
                  {
                    "name": "Singapore Standard Time",
                    "abbr": "MPST",
                    "offset": 8,
                    "isdst": false,
                    "text": "(UTC+08:00) Kuala Lumpur, Singapore",
                    "utc": [
                      "Asia/Brunei",
                      "Asia/Kuala_Lumpur",
                      "Asia/Kuching",
                      "Asia/Makassar",
                      "Asia/Manila",
                      "Asia/Singapore",
                      "Etc/GMT-8"
                    ]
                  },
                  {
                    "name": "W. Australia Standard Time",
                    "abbr": "WAST",
                    "offset": 8,
                    "isdst": false,
                    "text": "(UTC+08:00) Perth",
                    "utc": [
                      "Antarctica/Casey",
                      "Australia/Perth"
                    ]
                  },
                  {
                    "name": "Taipei Standard Time",
                    "abbr": "TST",
                    "offset": 8,
                    "isdst": false,
                    "text": "(UTC+08:00) Taipei",
                    "utc": [
                      "Asia/Taipei"
                    ]
                  },
                  {
                    "name": "Ulaanbaatar Standard Time",
                    "abbr": "UST",
                    "offset": 8,
                    "isdst": false,
                    "text": "(UTC+08:00) Ulaanbaatar",
                    "utc": [
                      "Asia/Choibalsan",
                      "Asia/Ulaanbaatar"
                    ]
                  },
                  {
                    "name": "North Asia East Standard Time",
                    "abbr": "NAEST",
                    "offset": 9,
                    "isdst": false,
                    "text": "(UTC+09:00) Irkutsk",
                    "utc": [
                      "Asia/Irkutsk"
                    ]
                  },
                  {
                    "name": "Tokyo Standard Time",
                    "abbr": "TST",
                    "offset": 9,
                    "isdst": false,
                    "text": "(UTC+09:00) Osaka, Sapporo, Tokyo",
                    "utc": [
                      "Asia/Dili",
                      "Asia/Jayapura",
                      "Asia/Tokyo",
                      "Etc/GMT-9",
                      "Pacific/Palau"
                    ]
                  },
                  {
                    "name": "Korea Standard Time",
                    "abbr": "KST",
                    "offset": 9,
                    "isdst": false,
                    "text": "(UTC+09:00) Seoul",
                    "utc": [
                      "Asia/Pyongyang",
                      "Asia/Seoul"
                    ]
                  },
                  {
                    "name": "Cen. Australia Standard Time",
                    "abbr": "CAST",
                    "offset": 9.5,
                    "isdst": false,
                    "text": "(UTC+09:30) Adelaide",
                    "utc": [
                      "Australia/Adelaide",
                      "Australia/Broken_Hill"
                    ]
                  },
                  {
                    "name": "AUS Central Standard Time",
                    "abbr": "ACST",
                    "offset": 9.5,
                    "isdst": false,
                    "text": "(UTC+09:30) Darwin",
                    "utc": [
                      "Australia/Darwin"
                    ]
                  },
                  {
                    "name": "E. Australia Standard Time",
                    "abbr": "EAST",
                    "offset": 10,
                    "isdst": false,
                    "text": "(UTC+10:00) Brisbane",
                    "utc": [
                      "Australia/Brisbane",
                      "Australia/Lindeman"
                    ]
                  },
                  {
                    "name": "AUS Eastern Standard Time",
                    "abbr": "AEST",
                    "offset": 10,
                    "isdst": false,
                    "text": "(UTC+10:00) Canberra, Melbourne, Sydney",
                    "utc": [
                      "Australia/Melbourne",
                      "Australia/Sydney"
                    ]
                  },
                  {
                    "name": "West Pacific Standard Time",
                    "abbr": "WPST",
                    "offset": 10,
                    "isdst": false,
                    "text": "(UTC+10:00) Guam, Port Moresby",
                    "utc": [
                      "Antarctica/DumontDUrville",
                      "Etc/GMT-10",
                      "Pacific/Guam",
                      "Pacific/Port_Moresby",
                      "Pacific/Saipan",
                      "Pacific/Truk"
                    ]
                  },
                  {
                    "name": "Tasmania Standard Time",
                    "abbr": "TST",
                    "offset": 10,
                    "isdst": false,
                    "text": "(UTC+10:00) Hobart",
                    "utc": [
                      "Australia/Currie",
                      "Australia/Hobart"
                    ]
                  },
                  {
                    "name": "Yakutsk Standard Time",
                    "abbr": "YST",
                    "offset": 10,
                    "isdst": false,
                    "text": "(UTC+10:00) Yakutsk",
                    "utc": [
                      "Asia/Chita",
                      "Asia/Khandyga",
                      "Asia/Yakutsk"
                    ]
                  },
                  {
                    "name": "Central Pacific Standard Time",
                    "abbr": "CPST",
                    "offset": 11,
                    "isdst": false,
                    "text": "(UTC+11:00) Solomon Is., New Caledonia",
                    "utc": [
                      "Antarctica/Macquarie",
                      "Etc/GMT-11",
                      "Pacific/Efate",
                      "Pacific/Guadalcanal",
                      "Pacific/Kosrae",
                      "Pacific/Noumea",
                      "Pacific/Ponape"
                    ]
                  },
                  {
                    "name": "Vladivostok Standard Time",
                    "abbr": "VST",
                    "offset": 11,
                    "isdst": false,
                    "text": "(UTC+11:00) Vladivostok",
                    "utc": [
                      "Asia/Sakhalin",
                      "Asia/Ust-Nera",
                      "Asia/Vladivostok"
                    ]
                  },
                  {
                    "name": "New Zealand Standard Time",
                    "abbr": "NZST",
                    "offset": 12,
                    "isdst": false,
                    "text": "(UTC+12:00) Auckland, Wellington",
                    "utc": [
                      "Antarctica/McMurdo",
                      "Pacific/Auckland"
                    ]
                  },
                  {
                    "name": "UTC+12",
                    "abbr": "U",
                    "offset": 12,
                    "isdst": false,
                    "text": "(UTC+12:00) Coordinated Universal Time+12",
                    "utc": [
                      "Etc/GMT-12",
                      "Pacific/Funafuti",
                      "Pacific/Kwajalein",
                      "Pacific/Majuro",
                      "Pacific/Nauru",
                      "Pacific/Tarawa",
                      "Pacific/Wake",
                      "Pacific/Wallis"
                    ]
                  },
                  {
                    "name": "Fiji Standard Time",
                    "abbr": "FST",
                    "offset": 12,
                    "isdst": false,
                    "text": "(UTC+12:00) Fiji",
                    "utc": [
                      "Pacific/Fiji"
                    ]
                  },
                  {
                    "name": "Magadan Standard Time",
                    "abbr": "MST",
                    "offset": 12,
                    "isdst": false,
                    "text": "(UTC+12:00) Magadan",
                    "utc": [
                      "Asia/Anadyr",
                      "Asia/Kamchatka",
                      "Asia/Magadan",
                      "Asia/Srednekolymsk"
                    ]
                  },
                  {
                    "name": "Kamchatka Standard Time",
                    "abbr": "KDT",
                    "offset": 13,
                    "isdst": true,
                    "text": "(UTC+12:00) Petropavlovsk-Kamchatsky - Old"
                  },
                  {
                    "name": "Tonga Standard Time",
                    "abbr": "TST",
                    "offset": 13,
                    "isdst": false,
                    "text": "(UTC+13:00) Nuku'alofa",
                    "utc": [
                      "Etc/GMT-13",
                      "Pacific/Enderbury",
                      "Pacific/Fakaofo",
                      "Pacific/Tongatapu"
                    ]
                  },
                  {
                    "name": "Samoa Standard Time",
                    "abbr": "SST",
                    "offset": 13,
                    "isdst": false,
                    "text": "(UTC+13:00) Samoa",
                    "utc": [
                      "Pacific/Apia"
                    ]
                  }
                ],
        //List source: http://answers.google.com/answers/threadview/id/589312.html
        profession: [
            "Airline Pilot",
            "Academic Team",
            "Accountant",
            "Account Executive",
            "Actor",
            "Actuary",
            "Acquisition Analyst",
            "Administrative Asst.",
            "Administrative Analyst",
            "Administrator",
            "Advertising Director",
            "Aerospace Engineer",
            "Agent",
            "Agricultural Inspector",
            "Agricultural Scientist",
            "Air Traffic Controller",
            "Animal Trainer",
            "Anthropologist",
            "Appraiser",
            "Architect",
            "Art Director",
            "Artist",
            "Astronomer",
            "Athletic Coach",
            "Auditor",
            "Author",
            "Baker",
            "Banker",
            "Bankruptcy Attorney",
            "Benefits Manager",
            "Biologist",
            "Bio-feedback Specialist",
            "Biomedical Engineer",
            "Biotechnical Researcher",
            "Broadcaster",
            "Broker",
            "Building Manager",
            "Building Contractor",
            "Building Inspector",
            "Business Analyst",
            "Business Planner",
            "Business Manager",
            "Buyer",
            "Call Center Manager",
            "Career Counselor",
            "Cash Manager",
            "Ceramic Engineer",
            "Chief Executive Officer",
            "Chief Operation Officer",
            "Chef",
            "Chemical Engineer",
            "Chemist",
            "Child Care Manager",
            "Chief Medical Officer",
            "Chiropractor",
            "Cinematographer",
            "City Housing Manager",
            "City Manager",
            "Civil Engineer",
            "Claims Manager",
            "Clinical Research Assistant",
            "Collections Manager.",
            "Compliance Manager",
            "Comptroller",
            "Computer Manager",
            "Commercial Artist",
            "Communications Affairs Director",
            "Communications Director",
            "Communications Engineer",
            "Compensation Analyst",
            "Computer Programmer",
            "Computer Ops. Manager",
            "Computer Engineer",
            "Computer Operator",
            "Computer Graphics Specialist",
            "Construction Engineer",
            "Construction Manager",
            "Consultant",
            "Consumer Relations Manager",
            "Contract Administrator",
            "Copyright Attorney",
            "Copywriter",
            "Corporate Planner",
            "Corrections Officer",
            "Cosmetologist",
            "Credit Analyst",
            "Cruise Director",
            "Chief Information Officer",
            "Chief Technology Officer",
            "Customer Service Manager",
            "Cryptologist",
            "Dancer",
            "Data Security Manager",
            "Database Manager",
            "Day Care Instructor",
            "Dentist",
            "Designer",
            "Design Engineer",
            "Desktop Publisher",
            "Developer",
            "Development Officer",
            "Diamond Merchant",
            "Dietitian",
            "Direct Marketer",
            "Director",
            "Distribution Manager",
            "Diversity Manager",
            "Economist",
            "EEO Compliance Manager",
            "Editor",
            "Education Adminator",
            "Electrical Engineer",
            "Electro Optical Engineer",
            "Electronics Engineer",
            "Embassy Management",
            "Employment Agent",
            "Engineer Technician",
            "Entrepreneur",
            "Environmental Analyst",
            "Environmental Attorney",
            "Environmental Engineer",
            "Environmental Specialist",
            "Escrow Officer",
            "Estimator",
            "Executive Assistant",
            "Executive Director",
            "Executive Recruiter",
            "Facilities Manager",
            "Family Counselor",
            "Fashion Events Manager",
            "Fashion Merchandiser",
            "Fast Food Manager",
            "Film Producer",
            "Film Production Assistant",
            "Financial Analyst",
            "Financial Planner",
            "Financier",
            "Fine Artist",
            "Wildlife Specialist",
            "Fitness Consultant",
            "Flight Attendant",
            "Flight Engineer",
            "Floral Designer",
            "Food & Beverage Director",
            "Food Service Manager",
            "Forestry Technician",
            "Franchise Management",
            "Franchise Sales",
            "Fraud Investigator",
            "Freelance Writer",
            "Fund Raiser",
            "General Manager",
            "Geologist",
            "General Counsel",
            "Geriatric Specialist",
            "Gerontologist",
            "Glamour Photographer",
            "Golf Club Manager",
            "Gourmet Chef",
            "Graphic Designer",
            "Grounds Keeper",
            "Hazardous Waste Manager",
            "Health Care Manager",
            "Health Therapist",
            "Health Service Administrator",
            "Hearing Officer",
            "Home Economist",
            "Horticulturist",
            "Hospital Administrator",
            "Hotel Manager",
            "Human Resources Manager",
            "Importer",
            "Industrial Designer",
            "Industrial Engineer",
            "Information Director",
            "Inside Sales",
            "Insurance Adjuster",
            "Interior Decorator",
            "Internal Controls Director",
            "International Acct.",
            "International Courier",
            "International Lawyer",
            "Interpreter",
            "Investigator",
            "Investment Banker",
            "Investment Manager",
            "IT Architect",
            "IT Project Manager",
            "IT Systems Analyst",
            "Jeweler",
            "Joint Venture Manager",
            "Journalist",
            "Labor Negotiator",
            "Labor Organizer",
            "Labor Relations Manager",
            "Lab Services Director",
            "Lab Technician",
            "Land Developer",
            "Landscape Architect",
            "Law Enforcement Officer",
            "Lawyer",
            "Lead Software Engineer",
            "Lead Software Test Engineer",
            "Leasing Manager",
            "Legal Secretary",
            "Library Manager",
            "Litigation Attorney",
            "Loan Officer",
            "Lobbyist",
            "Logistics Manager",
            "Maintenance Manager",
            "Management Consultant",
            "Managed Care Director",
            "Managing Partner",
            "Manufacturing Director",
            "Manpower Planner",
            "Marine Biologist",
            "Market Res. Analyst",
            "Marketing Director",
            "Materials Manager",
            "Mathematician",
            "Membership Chairman",
            "Mechanic",
            "Mechanical Engineer",
            "Media Buyer",
            "Medical Investor",
            "Medical Secretary",
            "Medical Technician",
            "Mental Health Counselor",
            "Merchandiser",
            "Metallurgical Engineering",
            "Meteorologist",
            "Microbiologist",
            "MIS Manager",
            "Motion Picture Director",
            "Multimedia Director",
            "Musician",
            "Network Administrator",
            "Network Specialist",
            "Network Operator",
            "New Product Manager",
            "Novelist",
            "Nuclear Engineer",
            "Nuclear Specialist",
            "Nutritionist",
            "Nursing Administrator",
            "Occupational Therapist",
            "Oceanographer",
            "Office Manager",
            "Operations Manager",
            "Operations Research Director",
            "Optical Technician",
            "Optometrist",
            "Organizational Development Manager",
            "Outplacement Specialist",
            "Paralegal",
            "Park Ranger",
            "Patent Attorney",
            "Payroll Specialist",
            "Personnel Specialist",
            "Petroleum Engineer",
            "Pharmacist",
            "Photographer",
            "Physical Therapist",
            "Physician",
            "Physician Assistant",
            "Physicist",
            "Planning Director",
            "Podiatrist",
            "Political Analyst",
            "Political Scientist",
            "Politician",
            "Portfolio Manager",
            "Preschool Management",
            "Preschool Teacher",
            "Principal",
            "Private Banker",
            "Private Investigator",
            "Probation Officer",
            "Process Engineer",
            "Producer",
            "Product Manager",
            "Product Engineer",
            "Production Engineer",
            "Production Planner",
            "Professional Athlete",
            "Professional Coach",
            "Professor",
            "Project Engineer",
            "Project Manager",
            "Program Manager",
            "Property Manager",
            "Public Administrator",
            "Public Safety Director",
            "PR Specialist",
            "Publisher",
            "Purchasing Agent",
            "Publishing Director",
            "Quality Assurance Specialist",
            "Quality Control Engineer",
            "Quality Control Inspector",
            "Radiology Manager",
            "Railroad Engineer",
            "Real Estate Broker",
            "Recreational Director",
            "Recruiter",
            "Redevelopment Specialist",
            "Regulatory Affairs Manager",
            "Registered Nurse",
            "Rehabilitation Counselor",
            "Relocation Manager",
            "Reporter",
            "Research Specialist",
            "Restaurant Manager",
            "Retail Store Manager",
            "Risk Analyst",
            "Safety Engineer",
            "Sales Engineer",
            "Sales Trainer",
            "Sales Promotion Manager",
            "Sales Representative",
            "Sales Manager",
            "Service Manager",
            "Sanitation Engineer",
            "Scientific Programmer",
            "Scientific Writer",
            "Securities Analyst",
            "Security Consultant",
            "Security Director",
            "Seminar Presenter",
            "Ship's Officer",
            "Singer",
            "Social Director",
            "Social Program Planner",
            "Social Research",
            "Social Scientist",
            "Social Worker",
            "Sociologist",
            "Software Developer",
            "Software Engineer",
            "Software Test Engineer",
            "Soil Scientist",
            "Special Events Manager",
            "Special Education Teacher",
            "Special Projects Director",
            "Speech Pathologist",
            "Speech Writer",
            "Sports Event Manager",
            "Statistician",
            "Store Manager",
            "Strategic Alliance Director",
            "Strategic Planning Director",
            "Stress Reduction Specialist",
            "Stockbroker",
            "Surveyor",
            "Structural Engineer",
            "Superintendent",
            "Supply Chain Director",
            "System Engineer",
            "Systems Analyst",
            "Systems Programmer",
            "System Administrator",
            "Tax Specialist",
            "Teacher",
            "Technical Support Specialist",
            "Technical Illustrator",
            "Technical Writer",
            "Technology Director",
            "Telecom Analyst",
            "Telemarketer",
            "Theatrical Director",
            "Title Examiner",
            "Tour Escort",
            "Tour Guide Director",
            "Traffic Manager",
            "Trainer Translator",
            "Transportation Manager",
            "Travel Agent",
            "Treasurer",
            "TV Programmer",
            "Underwriter",
            "Union Representative",
            "University Administrator",
            "University Dean",
            "Urban Planner",
            "Veterinarian",
            "Vendor Relations Director",
            "Viticulturist",
            "Warehouse Manager"
        ],
        animals : {
          //list of ocean animals comes from https://owlcation.com/stem/list-of-ocean-animals
          "ocean" : ["Acantharea","Anemone","Angelfish King","Ahi Tuna","Albacore","American Oyster","Anchovy","Armored Snail","Arctic Char","Atlantic Bluefin Tuna","Atlantic Cod","Atlantic Goliath Grouper","Atlantic Trumpetfish","Atlantic Wolffish","Baleen Whale","Banded Butterflyfish","Banded Coral Shrimp","Banded Sea Krait","Barnacle","Barndoor Skate","Barracuda","Basking Shark","Bass","Beluga Whale","Bluebanded Goby","Bluehead Wrasse","Bluefish","Bluestreak Cleaner-Wrasse","Blue Marlin","Blue Shark","Blue Spiny Lobster","Blue Tang","Blue Whale","Broadclub Cuttlefish","Bull Shark","Chambered Nautilus","Chilean Basket Star","Chilean Jack Mackerel","Chinook Salmon","Christmas Tree Worm","Clam","Clown Anemonefish","Clown Triggerfish","Cod","Coelacanth","Cockscomb Cup Coral","Common Fangtooth","Conch","Cookiecutter Shark","Copepod","Coral","Corydoras","Cownose Ray","Crab","Crown-of-Thorns Starfish","Cushion Star","Cuttlefish","California Sea Otters","Dolphin","Dolphinfish","Dory","Devil Fish","Dugong","Dumbo Octopus","Dungeness Crab","Eccentric Sand Dollar","Edible Sea Cucumber","Eel","Elephant Seal","Elkhorn Coral","Emperor Shrimp","Estuarine Crocodile","Fathead Sculpin","Fiddler Crab","Fin Whale","Flameback","Flamingo Tongue Snail","Flashlight Fish","Flatback Turtle","Flatfish","Flying Fish","Flounder","Fluke","French Angelfish","Frilled Shark","Fugu (also called Pufferfish)","Gar","Geoduck","Giant Barrel Sponge","Giant Caribbean Sea Anemone","Giant Clam","Giant Isopod","Giant Kingfish","Giant Oarfish","Giant Pacific Octopus","Giant Pyrosome","Giant Sea Star","Giant Squid","Glowing Sucker Octopus","Giant Tube Worm","Goblin Shark","Goosefish","Great White Shark","Greenland Shark","Grey Atlantic Seal","Grouper","Grunion","Guineafowl Puffer","Haddock","Hake","Halibut","Hammerhead Shark","Hapuka","Harbor Porpoise","Harbor Seal","Hatchetfish","Hawaiian Monk Seal","Hawksbill Turtle","Hector's Dolphin","Hermit Crab","Herring","Hoki","Horn Shark","Horseshoe Crab","Humpback Anglerfish","Humpback Whale","Icefish","Imperator Angelfish","Irukandji Jellyfish","Isopod","Ivory Bush Coral","Japanese Spider Crab","Jellyfish","John Dory","Juan Fernandez Fur Seal","Killer Whale","Kiwa Hirsuta","Krill","Lagoon Triggerfish","Lamprey","Leafy Seadragon","Leopard Seal","Limpet","Ling","Lionfish","Lions Mane Jellyfish","Lobe Coral","Lobster","Loggerhead Turtle","Longnose Sawshark","Longsnout Seahorse","Lophelia Coral","Marrus Orthocanna","Manatee","Manta Ray","Marlin","Megamouth Shark","Mexican Lookdown","Mimic Octopus","Moon Jelly","Mollusk","Monkfish","Moray Eel","Mullet","Mussel","Megaladon","Napoleon Wrasse","Nassau Grouper","Narwhal","Nautilus","Needlefish","Northern Seahorse","North Atlantic Right Whale","Northern Red Snapper","Norway Lobster","Nudibranch","Nurse Shark","Oarfish","Ocean Sunfish","Oceanic Whitetip Shark","Octopus","Olive Sea Snake","Orange Roughy","Ostracod","Otter","Oyster","Pacific Angelshark","Pacific Blackdragon","Pacific Halibut","Pacific Sardine","Pacific Sea Nettle Jellyfish","Pacific White Sided Dolphin","Pantropical Spotted Dolphin","Patagonian Toothfish","Peacock Mantis Shrimp","Pelagic Thresher Shark","Penguin","Peruvian Anchoveta","Pilchard","Pink Salmon","Pinniped","Plankton","Porpoise","Polar Bear","Portuguese Man o' War","Pycnogonid Sea Spider","Quahog","Queen Angelfish","Queen Conch","Queen Parrotfish","Queensland Grouper","Ragfish","Ratfish","Rattail Fish","Ray","Red Drum","Red King Crab","Ringed Seal","Risso's Dolphin","Ross Seals","Sablefish","Salmon","Sand Dollar","Sandbar Shark","Sawfish","Sarcastic Fringehead","Scalloped Hammerhead Shark","Seahorse","Sea Cucumber","Sea Lion","Sea Urchin","Seal","Shark","Shortfin Mako Shark","Shovelnose Guitarfish","Shrimp","Silverside Fish","Skipjack Tuna","Slender Snipe Eel","Smalltooth Sawfish","Smelts","Sockeye Salmon","Southern Stingray","Sponge","Spotted Porcupinefish","Spotted Dolphin","Spotted Eagle Ray","Spotted Moray","Squid","Squidworm","Starfish","Stickleback","Stonefish","Stoplight Loosejaw","Sturgeon","Swordfish","Tan Bristlemouth","Tasseled Wobbegong","Terrible Claw Lobster","Threespot Damselfish","Tiger Prawn","Tiger Shark","Tilefish","Toadfish","Tropical Two-Wing Flyfish","Tuna","Umbrella Squid","Velvet Crab","Venus Flytrap Sea Anemone","Vigtorniella Worm","Viperfish","Vampire Squid","Vaquita","Wahoo","Walrus","West Indian Manatee","Whale","Whale Shark","Whiptail Gulper","White-Beaked Dolphin","White-Ring Garden Eel","White Shrimp","Wobbegong","Wrasse","Wreckfish","Xiphosura","Yellowtail Damselfish","Yelloweye Rockfish","Yellow Cup Black Coral","Yellow Tube Sponge","Yellowfin Tuna","Zebrashark","Zooplankton"],
          //list of desert, grassland, and forest animals comes from http://www.skyenimals.com/
          "desert" : ["Aardwolf","Addax","African Wild Ass","Ant","Antelope","Armadillo","Baboon","Badger","Bat","Bearded Dragon","Beetle","Bird","Black-footed Cat","Boa","Brown Bear","Bustard","Butterfly","Camel","Caracal","Caracara","Caterpillar","Centipede","Cheetah","Chipmunk","Chuckwalla","Climbing Mouse","Coati","Cobra","Cotton Rat","Cougar","Courser","Crane Fly","Crow","Dassie Rat","Dove","Dunnart","Eagle","Echidna","Elephant","Emu","Falcon","Fly","Fox","Frogmouth","Gecko","Geoffroy's Cat","Gerbil","Grasshopper","Guanaco","Gundi","Hamster","Hawk","Hedgehog","Hyena","Hyrax","Jackal","Kangaroo","Kangaroo Rat","Kestrel","Kowari","Kultarr","Leopard","Lion","Macaw","Meerkat","Mouse","Oryx","Ostrich","Owl","Pronghorn","Python","Rabbit","Raccoon","Rattlesnake","Rhinoceros","Sand Cat","Spectacled Bear","Spiny Mouse","Starling","Stick Bug","Tarantula","Tit","Toad","Tortoise","Tyrant Flycatcher","Viper","Vulture","Waxwing","Xerus","Zebra"],
          "grassland" : ["Aardvark","Aardwolf","Accentor","African Buffalo","African Wild Dog","Alpaca","Anaconda","Ant","Anteater","Antelope","Armadillo","Baboon","Badger","Bandicoot","Barbet","Bat","Bee","Bee-eater","Beetle","Bird","Bison","Black-footed Cat","Black-footed Ferret","Bluebird","Boa","Bowerbird","Brown Bear","Bush Dog","Bushshrike","Bustard","Butterfly","Buzzard","Caracal","Caracara","Cardinal","Caterpillar","Cheetah","Chipmunk","Civet","Climbing Mouse","Clouded Leopard","Coati","Cobra","Cockatoo","Cockroach","Common Genet","Cotton Rat","Cougar","Courser","Coyote","Crane","Crane Fly","Cricket","Crow","Culpeo","Death Adder","Deer","Deer Mouse","Dingo","Dinosaur","Dove","Drongo","Duck","Duiker","Dunnart","Eagle","Echidna","Elephant","Elk","Emu","Falcon","Finch","Flea","Fly","Flying Frog","Fox","Frog","Frogmouth","Garter Snake","Gazelle","Gecko","Geoffroy's Cat","Gerbil","Giant Tortoise","Giraffe","Grasshopper","Grison","Groundhog","Grouse","Guanaco","Guinea Pig","Hamster","Harrier","Hartebeest","Hawk","Hedgehog","Helmetshrike","Hippopotamus","Hornbill","Hyena","Hyrax","Impala","Jackal","Jaguar","Jaguarundi","Kangaroo","Kangaroo Rat","Kestrel","Kultarr","Ladybug","Leopard","Lion","Macaw","Meerkat","Mouse","Newt","Oryx","Ostrich","Owl","Pangolin","Pheasant","Prairie Dog","Pronghorn","Przewalski's Horse","Python","Quoll","Rabbit","Raven","Rhinoceros","Shelduck","Sloth Bear","Spectacled Bear","Squirrel","Starling","Stick Bug","Tamandua","Tasmanian Devil","Thornbill","Thrush","Toad","Tortoise"],
          "forest" : ["Agouti","Anaconda","Anoa","Ant","Anteater","Antelope","Armadillo","Asian Black Bear","Aye-aye","Babirusa","Baboon","Badger","Bandicoot","Banteng","Barbet","Basilisk","Bat","Bearded Dragon","Bee","Bee-eater","Beetle","Bettong","Binturong","Bird-of-paradise","Bongo","Bowerbird","Bulbul","Bush Dog","Bushbaby","Bushshrike","Butterfly","Buzzard","Caecilian","Cardinal","Cassowary","Caterpillar","Centipede","Chameleon","Chimpanzee","Cicada","Civet","Clouded Leopard","Coati","Cobra","Cockatoo","Cockroach","Colugo","Cotinga","Cotton Rat","Cougar","Crane Fly","Cricket","Crocodile","Crow","Cuckoo","Cuscus","Death Adder","Deer","Dhole","Dingo","Dinosaur","Drongo","Duck","Duiker","Eagle","Echidna","Elephant","Finch","Flat-headed Cat","Flea","Flowerpecker","Fly","Flying Frog","Fossa","Frog","Frogmouth","Gaur","Gecko","Gorilla","Grison","Hawaiian Honeycreeper","Hawk","Hedgehog","Helmetshrike","Hornbill","Hyrax","Iguana","Jackal","Jaguar","Jaguarundi","Kestrel","Ladybug","Lemur","Leopard","Lion","Macaw","Mandrill","Margay","Monkey","Mouse","Mouse Deer","Newt","Okapi","Old World Flycatcher","Orangutan","Owl","Pangolin","Peafowl","Pheasant","Possum","Python","Quokka","Rabbit","Raccoon","Red Panda","Red River Hog","Rhinoceros","Sloth Bear","Spectacled Bear","Squirrel","Starling","Stick Bug","Sun Bear","Tamandua","Tamarin","Tapir","Tarantula","Thrush","Tiger","Tit","Toad","Tortoise","Toucan","Trogon","Trumpeter","Turaco","Turtle","Tyrant Flycatcher","Viper","Vulture","Wallaby","Warbler","Wasp","Waxwing","Weaver","Weaver-finch","Whistler","White-eye","Whydah","Woodswallow","Worm","Wren","Xenops","Yellowjacket","Accentor","African Buffalo","American Black Bear","Anole","Bird","Bison","Boa","Brown Bear","Chipmunk","Common Genet","Copperhead","Coyote","Deer Mouse","Dormouse","Elk","Emu","Fisher","Fox","Garter Snake","Giant Panda","Giant Tortoise","Groundhog","Grouse","Guanaco","Himalayan Tahr","Kangaroo","Koala","Numbat","Quoll","Raccoon dog","Tasmanian Devil","Thornbill","Turkey","Vole","Weasel","Wildcat","Wolf","Wombat","Woodchuck","Woodpecker"],
          //list of farm animals comes from https://www.buzzle.com/articles/farm-animals-list.html
          "farm" : ["Alpaca","Buffalo","Banteng","Cow","Cat","Chicken","Carp","Camel","Donkey","Dog","Duck","Emu","Goat","Gayal","Guinea","Goose","Horse","Honey","Llama","Pig","Pigeon","Rhea","Rabbit","Sheep","Silkworm","Turkey","Yak","Zebu"],
          //list of pet animals comes from https://www.dogbreedinfo.com/pets/pet.htm
          "pet" : ["Bearded Dragon","Birds","Burro","Cats","Chameleons","Chickens","Chinchillas","Chinese Water Dragon","Cows","Dogs","Donkey","Ducks","Ferrets","Fish","Geckos","Geese","Gerbils","Goats","Guinea Fowl","Guinea Pigs","Hamsters","Hedgehogs","Horses","Iguanas","Llamas","Lizards","Mice","Mule","Peafowl","Pigs and Hogs","Pigeons","Ponies","Pot Bellied Pig","Rabbits","Rats","Sheep","Skinks","Snakes","Stick Insects","Sugar Gliders","Tarantula","Turkeys","Turtles"],
          //list of zoo animals comes from https://bronxzoo.com/animals
          "zoo" : ["Aardvark","African Wild Dog","Aldabra Tortoise","American Alligator","American Bison","Amur Tiger","Anaconda","Andean Condor","Asian Elephant","Baby Doll Sheep","Bald Eagle","Barred Owl","Blue Iguana","Boer Goat","California Sea Lion","Caribbean Flamingo","Chinchilla","Collared Lemur","Coquerel's Sifaka","Cuban Amazon Parrot","Ebony Langur","Fennec Fox","Fossa","Gelada","Giant Anteater","Giraffe","Gorilla","Grizzly Bear","Henkel's Leaf-tailed Gecko","Indian Gharial","Indian Rhinoceros","King Cobra","King Vulture","Komodo Dragon","Linne's Two-toed Sloth","Lion","Little Penguin","Madagascar Tree Boa","Magellanic Penguin","Malayan Tapir","Malayan Tiger","Matschies Tree Kangaroo","Mini Donkey","Monarch Butterfly","Nile crocodile","North American Porcupine","Nubian Ibex","Okapi","Poison Dart Frog","Polar Bear","Pygmy Marmoset","Radiated Tortoise","Red Panda","Red Ruffed Lemur","Ring-tailed Lemur","Ring-tailed Mongoose","Rock Hyrax","Small Clawed Asian Otter","Snow Leopard","Snowy Owl","Southern White-faced Owl","Southern White Rhinocerous","Squirrel Monkey","Tufted Puffin","White Cheeked Gibbon","White-throated Bee Eater","Zebra"]
        },
        emotions: [
            "love",
             "Joy",
             "Surprise",
             "Anger",
             "Sadness", 
             "Fear"
        ],
    };

    var o_hasOwnProperty = Object.prototype.hasOwnProperty;
    var o_keys = (Object.keys || function(obj) {
      var result = [];
      for (var key in obj) {
        if (o_hasOwnProperty.call(obj, key)) {
          result.push(key);
        }
      }

      return result;
    });


    function _copyObject(source, target) {
      var keys = o_keys(source);
      var key;

      for (var i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        target[key] = source[key] || target[key];
      }
    }

    function _copyArray(source, target) {
      for (var i = 0, l = source.length; i < l; i++) {
        target[i] = source[i];
      }
    }

    function copyObject(source, _target) {
        var isArray = Array.isArray(source);
        var target = _target || (isArray ? new Array(source.length) : {});

        if (isArray) {
          _copyArray(source, target);
        } else {
          _copyObject(source, target);
        }

        return target;
    }

    /** Get the data based on key**/
    Chance.prototype.get = function (name) {
        return copyObject(data[name]);
    };

    // Mac Address
    Chance.prototype.mac_address = function(options){
        // typically mac addresses are separated by ":"
        // however they can also be separated by "-"
        // the network variant uses a dot every fourth byte

        options = initOptions(options);
        if(!options.separator) {
            options.separator =  options.networkVersion ? "." : ":";
        }

        var mac_pool="ABCDEF1234567890",
            mac = "";
        if(!options.networkVersion) {
            mac = this.n(this.string, 6, { pool: mac_pool, length:2 }).join(options.separator);
        } else {
            mac = this.n(this.string, 3, { pool: mac_pool, length:4 }).join(options.separator);
        }

        return mac;
    };

    Chance.prototype.normal = function (options) {
        options = initOptions(options, {mean : 0, dev : 1, pool : []});

        testRange(
            options.pool.constructor !== Array,
            "Chance: The pool option must be a valid array."
        );
        testRange(
            typeof options.mean !== 'number',
            "Chance: Mean (mean) must be a number"
        );
        testRange(
            typeof options.dev !== 'number',
            "Chance: Standard deviation (dev) must be a number"
        );

        // If a pool has been passed, then we are returning an item from that pool,
        // using the normal distribution settings that were passed in
        if (options.pool.length > 0) {
            return this.normal_pool(options);
        }

        // The Marsaglia Polar method
        var s, u, v, norm,
            mean = options.mean,
            dev = options.dev;

        do {
            // U and V are from the uniform distribution on (-1, 1)
            u = this.random() * 2 - 1;
            v = this.random() * 2 - 1;

            s = u * u + v * v;
        } while (s >= 1);

        // Compute the standard normal variate
        norm = u * Math.sqrt(-2 * Math.log(s) / s);

        // Shape and scale
        return dev * norm + mean;
    };

    Chance.prototype.normal_pool = function(options) {
        var performanceCounter = 0;
        do {
            var idx = Math.round(this.normal({ mean: options.mean, dev: options.dev }));
            if (idx < options.pool.length && idx >= 0) {
                return options.pool[idx];
            } else {
                performanceCounter++;
            }
        } while(performanceCounter < 100);

        throw new RangeError("Chance: Your pool is too small for the given mean and standard deviation. Please adjust.");
    };

    Chance.prototype.radio = function (options) {
        // Initial Letter (Typically Designated by Side of Mississippi River)
        options = initOptions(options, {side : "?"});
        var fl = "";
        switch (options.side.toLowerCase()) {
        case "east":
        case "e":
            fl = "W";
            break;
        case "west":
        case "w":
            fl = "K";
            break;
        default:
            fl = this.character({pool: "KW"});
            break;
        }

        return fl + this.character({alpha: true, casing: "upper"}) +
                this.character({alpha: true, casing: "upper"}) +
                this.character({alpha: true, casing: "upper"});
    };

    // Set the data as key and data or the data map
    Chance.prototype.set = function (name, values) {
        if (typeof name === "string") {
            data[name] = values;
        } else {
            data = copyObject(name, data);
        }
    };

    Chance.prototype.tv = function (options) {
        return this.radio(options);
    };

    // ID number for Brazil companies
    Chance.prototype.cnpj = function () {
        var n = this.n(this.natural, 8, { max: 9 });
        var d1 = 2+n[7]*6+n[6]*7+n[5]*8+n[4]*9+n[3]*2+n[2]*3+n[1]*4+n[0]*5;
        d1 = 11 - (d1 % 11);
        if (d1>=10){
            d1 = 0;
        }
        var d2 = d1*2+3+n[7]*7+n[6]*8+n[5]*9+n[4]*2+n[3]*3+n[2]*4+n[1]*5+n[0]*6;
        d2 = 11 - (d2 % 11);
        if (d2>=10){
            d2 = 0;
        }
        return ''+n[0]+n[1]+'.'+n[2]+n[3]+n[4]+'.'+n[5]+n[6]+n[7]+'/0001-'+d1+d2;
    };

    Chance.prototype.emotion = function () {
        return this.pick(this.get("emotions"));
    };

    // -- End Miscellaneous --

    Chance.prototype.mersenne_twister = function (seed) {
        return new MersenneTwister(seed);
    };

    Chance.prototype.blueimp_md5 = function () {
        return new BlueImpMD5();
    };

    // Mersenne Twister from https://gist.github.com/banksean/300494
    /*
       A C-program for MT19937, with initialization improved 2002/1/26.
       Coded by Takuji Nishimura and Makoto Matsumoto.

       Before using, initialize the state by using init_genrand(seed)
       or init_by_array(init_key, key_length).

       Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
       All rights reserved.

       Redistribution and use in source and binary forms, with or without
       modification, are permitted provided that the following conditions
       are met:

       1. Redistributions of source code must retain the above copyright
       notice, this list of conditions and the following disclaimer.

       2. Redistributions in binary form must reproduce the above copyright
       notice, this list of conditions and the following disclaimer in the
       documentation and/or other materials provided with the distribution.

       3. The names of its contributors may not be used to endorse or promote
       products derived from this software without specific prior written
       permission.

       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
       "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
       LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
       A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
       CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
       EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
       PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
       PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
       LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
       NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
       SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


       Any feedback is very welcome.
       http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
       email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
     */
    var MersenneTwister = function (seed) {
        if (seed === undefined) {
            // kept random number same size as time used previously to ensure no unexpected results downstream
            seed = Math.floor(Math.random()*Math.pow(10,13));
        }
        /* Period parameters */
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df;   /* constant vector a */
        this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
        this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

        this.mt = new Array(this.N); /* the array for the state vector */
        this.mti = this.N + 1; /* mti==N + 1 means mt[N] is not initialized */

        this.init_genrand(seed);
    };

    /* initializes mt[N] with a seed */
    MersenneTwister.prototype.init_genrand = function (s) {
        this.mt[0] = s >>> 0;
        for (this.mti = 1; this.mti < this.N; this.mti++) {
            s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            this.mt[this.mti] >>>= 0;
            /* for >32 bit machines */
        }
    };

    /* initialize by an array with array-length */
    /* init_key is the array for initializing keys */
    /* key_length is its length */
    /* slight change for C++, 2004/2/26 */
    MersenneTwister.prototype.init_by_array = function (init_key, key_length) {
        var i = 1, j = 0, k, s;
        this.init_genrand(19650218);
        k = (this.N > key_length ? this.N : key_length);
        for (; k; k--) {
            s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            j++;
            if (i >= this.N) { this.mt[0] = this.mt[this.N - 1]; i = 1; }
            if (j >= key_length) { j = 0; }
        }
        for (k = this.N - 1; k; k--) {
            s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            if (i >= this.N) { this.mt[0] = this.mt[this.N - 1]; i = 1; }
        }

        this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
    };

    /* generates a random number on [0,0xffffffff]-interval */
    MersenneTwister.prototype.genrand_int32 = function () {
        var y;
        var mag01 = new Array(0x0, this.MATRIX_A);
        /* mag01[x] = x * MATRIX_A  for x=0,1 */

        if (this.mti >= this.N) { /* generate N words at one time */
            var kk;

            if (this.mti === this.N + 1) {   /* if init_genrand() has not been called, */
                this.init_genrand(5489); /* a default initial seed is used */
            }
            for (kk = 0; kk < this.N - this.M; kk++) {
                y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk + 1]&this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (;kk < this.N - 1; kk++) {
                y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk + 1]&this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (this.mt[this.N - 1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

            this.mti = 0;
        }

        y = this.mt[this.mti++];

        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    };

    /* generates a random number on [0,0x7fffffff]-interval */
    MersenneTwister.prototype.genrand_int31 = function () {
        return (this.genrand_int32() >>> 1);
    };

    /* generates a random number on [0,1]-real-interval */
    MersenneTwister.prototype.genrand_real1 = function () {
        return this.genrand_int32() * (1.0 / 4294967295.0);
        /* divided by 2^32-1 */
    };

    /* generates a random number on [0,1)-real-interval */
    MersenneTwister.prototype.random = function () {
        return this.genrand_int32() * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    };

    /* generates a random number on (0,1)-real-interval */
    MersenneTwister.prototype.genrand_real3 = function () {
        return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    };

    /* generates a random number on [0,1) with 53-bit resolution*/
    MersenneTwister.prototype.genrand_res53 = function () {
        var a = this.genrand_int32()>>>5, b = this.genrand_int32()>>>6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    };

    // BlueImp MD5 hashing algorithm from https://github.com/blueimp/JavaScript-MD5
    var BlueImpMD5 = function () {};

    BlueImpMD5.prototype.VERSION = '1.0.1';

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    BlueImpMD5.prototype.safe_add = function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };

    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    BlueImpMD5.prototype.bit_roll = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };

    /*
    * These functions implement the five basic operations the algorithm uses.
    */
    BlueImpMD5.prototype.md5_cmn = function (q, a, b, x, s, t) {
        return this.safe_add(this.bit_roll(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    };
    BlueImpMD5.prototype.md5_ff = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };
    BlueImpMD5.prototype.md5_gg = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };
    BlueImpMD5.prototype.md5_hh = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };
    BlueImpMD5.prototype.md5_ii = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    };

    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    BlueImpMD5.prototype.binl_md5 = function (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a =  1732584193,
            b = -271733879,
            c = -1732584194,
            d =  271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = this.md5_ff(a, b, c, d, x[i],       7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
            b = this.md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
            c = this.md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
            d = this.md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

            a = this.md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
            b = this.md5_gg(b, c, d, a, x[i],      20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = this.md5_hh(a, b, c, d, x[i +  5],  4, -378558);
            d = this.md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
            c = this.md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
            d = this.md5_hh(d, a, b, c, x[i],      11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
            a = this.md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
            b = this.md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

            a = this.md5_ii(a, b, c, d, x[i],       6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
            d = this.md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
            a = this.md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
            b = this.md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return [a, b, c, d];
    };

    /*
    * Convert an array of little-endian words to a string
    */
    BlueImpMD5.prototype.binl2rstr = function (input) {
        var i,
            output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    };

    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    BlueImpMD5.prototype.rstr2binl = function (input) {
        var i,
            output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    };

    /*
    * Calculate the MD5 of a raw string
    */
    BlueImpMD5.prototype.rstr_md5 = function (s) {
        return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
    };

    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    BlueImpMD5.prototype.rstr_hmac_md5 = function (key, data) {
        var i,
            bkey = this.rstr2binl(key),
            ipad = [],
            opad = [],
            hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
            bkey = this.binl_md5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
        return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
    };

    /*
    * Convert a raw string to a hex string
    */
    BlueImpMD5.prototype.rstr2hex = function (input) {
        var hex_tab = '0123456789abcdef',
            output = '',
            x,
            i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
        }
        return output;
    };

    /*
    * Encode a string as utf-8
    */
    BlueImpMD5.prototype.str2rstr_utf8 = function (input) {
        return unescape(encodeURIComponent(input));
    };

    /*
    * Take string arguments and return either raw or hex encoded strings
    */
    BlueImpMD5.prototype.raw_md5 = function (s) {
        return this.rstr_md5(this.str2rstr_utf8(s));
    };
    BlueImpMD5.prototype.hex_md5 = function (s) {
        return this.rstr2hex(this.raw_md5(s));
    };
    BlueImpMD5.prototype.raw_hmac_md5 = function (k, d) {
        return this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d));
    };
    BlueImpMD5.prototype.hex_hmac_md5 = function (k, d) {
        return this.rstr2hex(this.raw_hmac_md5(k, d));
    };

    BlueImpMD5.prototype.md5 = function (string, key, raw) {
        if (!key) {
            if (!raw) {
                return this.hex_md5(string);
            }

            return this.raw_md5(string);
        }

        if (!raw) {
            return this.hex_hmac_md5(key, string);
        }

        return this.raw_hmac_md5(key, string);
    };

    // CommonJS module
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Chance;
        }
        exports.Chance = Chance;
    }

    // Register as an anonymous AMD module
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return Chance;
        });
    }

    // if there is a importsScrips object define chance for worker
    // allows worker to use full Chance functionality with seed
    if (typeof importScripts !== 'undefined') {
        chance = new Chance();
        self.Chance = Chance;
    }

    // If there is a window object, that at least has a document property,
    // instantiate and define chance on the window
    if (typeof window === "object" && typeof window.document === "object") {
        window.Chance = Chance;
        window.chance = new Chance();
    }
})();
