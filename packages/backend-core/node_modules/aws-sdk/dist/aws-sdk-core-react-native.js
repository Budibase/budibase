(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AWS"] = factory();
	else
		root["AWS"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * The main AWS namespace
	 */
	var AWS = { util: __webpack_require__(2) };

	/**
	 * @api private
	 * @!macro [new] nobrowser
	 *   @note This feature is not supported in the browser environment of the SDK.
	 */
	var _hidden = {}; _hidden.toString(); // hack to parse macro

	/**
	 * @api private
	 */
	module.exports = AWS;

	AWS.util.update(AWS, {

	  /**
	   * @constant
	   */
	  VERSION: '2.1030.0',

	  /**
	   * @api private
	   */
	  Signers: {},

	  /**
	   * @api private
	   */
	  Protocol: {
	    Json: __webpack_require__(13),
	    Query: __webpack_require__(17),
	    Rest: __webpack_require__(21),
	    RestJson: __webpack_require__(22),
	    RestXml: __webpack_require__(23)
	  },

	  /**
	   * @api private
	   */
	  XML: {
	    Builder: __webpack_require__(24),
	    Parser: null // conditionally set based on environment
	  },

	  /**
	   * @api private
	   */
	  JSON: {
	    Builder: __webpack_require__(14),
	    Parser: __webpack_require__(15)
	  },

	  /**
	   * @api private
	   */
	  Model: {
	    Api: __webpack_require__(29),
	    Operation: __webpack_require__(30),
	    Shape: __webpack_require__(19),
	    Paginator: __webpack_require__(31),
	    ResourceWaiter: __webpack_require__(32)
	  },

	  /**
	   * @api private
	   */
	  apiLoader: __webpack_require__(33),

	  /**
	   * @api private
	   */
	  EndpointCache: __webpack_require__(34).EndpointCache
	});
	__webpack_require__(36);
	__webpack_require__(37);
	__webpack_require__(41);
	__webpack_require__(44);
	__webpack_require__(45);
	__webpack_require__(50);
	__webpack_require__(53);
	__webpack_require__(54);
	__webpack_require__(55);
	__webpack_require__(63);

	/**
	 * @readonly
	 * @return [AWS.SequentialExecutor] a collection of global event listeners that
	 *   are attached to every sent request.
	 * @see AWS.Request AWS.Request for a list of events to listen for
	 * @example Logging the time taken to send a request
	 *   AWS.events.on('send', function startSend(resp) {
	 *     resp.startTime = new Date().getTime();
	 *   }).on('complete', function calculateTime(resp) {
	 *     var time = (new Date().getTime() - resp.startTime) / 1000;
	 *     console.log('Request took ' + time + ' seconds');
	 *   });
	 *
	 *   new AWS.S3().listBuckets(); // prints 'Request took 0.285 seconds'
	 */
	AWS.events = new AWS.SequentialExecutor();

	//create endpoint cache lazily
	AWS.util.memoizedProperty(AWS, 'endpointCache', function() {
	  return new AWS.EndpointCache(AWS.config.endpointCacheSize);
	}, true);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {/* eslint guard-for-in:0 */
	var AWS;

	/**
	 * A set of utility methods for use with the AWS SDK.
	 *
	 * @!attribute abort
	 *   Return this value from an iterator function {each} or {arrayEach}
	 *   to break out of the iteration.
	 *   @example Breaking out of an iterator function
	 *     AWS.util.each({a: 1, b: 2, c: 3}, function(key, value) {
	 *       if (key == 'b') return AWS.util.abort;
	 *     });
	 *   @see each
	 *   @see arrayEach
	 * @api private
	 */
	var util = {
	  environment: 'nodejs',
	  engine: function engine() {
	    if (util.isBrowser() && typeof navigator !== 'undefined') {
	      return navigator.userAgent;
	    } else {
	      var engine = process.platform + '/' + process.version;
	      if (process.env.AWS_EXECUTION_ENV) {
	        engine += ' exec-env/' + process.env.AWS_EXECUTION_ENV;
	      }
	      return engine;
	    }
	  },

	  userAgent: function userAgent() {
	    var name = util.environment;
	    var agent = 'aws-sdk-' + name + '/' + __webpack_require__(1).VERSION;
	    if (name === 'nodejs') agent += ' ' + util.engine();
	    return agent;
	  },

	  uriEscape: function uriEscape(string) {
	    var output = encodeURIComponent(string);
	    output = output.replace(/[^A-Za-z0-9_.~\-%]+/g, escape);

	    // AWS percent-encodes some extra non-standard characters in a URI
	    output = output.replace(/[*]/g, function(ch) {
	      return '%' + ch.charCodeAt(0).toString(16).toUpperCase();
	    });

	    return output;
	  },

	  uriEscapePath: function uriEscapePath(string) {
	    var parts = [];
	    util.arrayEach(string.split('/'), function (part) {
	      parts.push(util.uriEscape(part));
	    });
	    return parts.join('/');
	  },

	  urlParse: function urlParse(url) {
	    return util.url.parse(url);
	  },

	  urlFormat: function urlFormat(url) {
	    return util.url.format(url);
	  },

	  queryStringParse: function queryStringParse(qs) {
	    return util.querystring.parse(qs);
	  },

	  queryParamsToString: function queryParamsToString(params) {
	    var items = [];
	    var escape = util.uriEscape;
	    var sortedKeys = Object.keys(params).sort();

	    util.arrayEach(sortedKeys, function(name) {
	      var value = params[name];
	      var ename = escape(name);
	      var result = ename + '=';
	      if (Array.isArray(value)) {
	        var vals = [];
	        util.arrayEach(value, function(item) { vals.push(escape(item)); });
	        result = ename + '=' + vals.sort().join('&' + ename + '=');
	      } else if (value !== undefined && value !== null) {
	        result = ename + '=' + escape(value);
	      }
	      items.push(result);
	    });

	    return items.join('&');
	  },

	  readFileSync: function readFileSync(path) {
	    if (util.isBrowser()) return null;
	    return __webpack_require__(6).readFileSync(path, 'utf-8');
	  },

	  base64: {
	    encode: function encode64(string) {
	      if (typeof string === 'number') {
	        throw util.error(new Error('Cannot base64 encode number ' + string));
	      }
	      if (string === null || typeof string === 'undefined') {
	        return string;
	      }
	      var buf = util.buffer.toBuffer(string);
	      return buf.toString('base64');
	    },

	    decode: function decode64(string) {
	      if (typeof string === 'number') {
	        throw util.error(new Error('Cannot base64 decode number ' + string));
	      }
	      if (string === null || typeof string === 'undefined') {
	        return string;
	      }
	      return util.buffer.toBuffer(string, 'base64');
	    }

	  },

	  buffer: {
	    /**
	     * Buffer constructor for Node buffer and buffer pollyfill
	     */
	    toBuffer: function(data, encoding) {
	      return (typeof util.Buffer.from === 'function' && util.Buffer.from !== Uint8Array.from) ?
	        util.Buffer.from(data, encoding) : new util.Buffer(data, encoding);
	    },

	    alloc: function(size, fill, encoding) {
	      if (typeof size !== 'number') {
	        throw new Error('size passed to alloc must be a number.');
	      }
	      if (typeof util.Buffer.alloc === 'function') {
	        return util.Buffer.alloc(size, fill, encoding);
	      } else {
	        var buf = new util.Buffer(size);
	        if (fill !== undefined && typeof buf.fill === 'function') {
	          buf.fill(fill, undefined, undefined, encoding);
	        }
	        return buf;
	      }
	    },

	    toStream: function toStream(buffer) {
	      if (!util.Buffer.isBuffer(buffer)) buffer =  util.buffer.toBuffer(buffer);

	      var readable = new (util.stream.Readable)();
	      var pos = 0;
	      readable._read = function(size) {
	        if (pos >= buffer.length) return readable.push(null);

	        var end = pos + size;
	        if (end > buffer.length) end = buffer.length;
	        readable.push(buffer.slice(pos, end));
	        pos = end;
	      };

	      return readable;
	    },

	    /**
	     * Concatenates a list of Buffer objects.
	     */
	    concat: function(buffers) {
	      var length = 0,
	          offset = 0,
	          buffer = null, i;

	      for (i = 0; i < buffers.length; i++) {
	        length += buffers[i].length;
	      }

	      buffer = util.buffer.alloc(length);

	      for (i = 0; i < buffers.length; i++) {
	        buffers[i].copy(buffer, offset);
	        offset += buffers[i].length;
	      }

	      return buffer;
	    }
	  },

	  string: {
	    byteLength: function byteLength(string) {
	      if (string === null || string === undefined) return 0;
	      if (typeof string === 'string') string = util.buffer.toBuffer(string);

	      if (typeof string.byteLength === 'number') {
	        return string.byteLength;
	      } else if (typeof string.length === 'number') {
	        return string.length;
	      } else if (typeof string.size === 'number') {
	        return string.size;
	      } else if (typeof string.path === 'string') {
	        return __webpack_require__(6).lstatSync(string.path).size;
	      } else {
	        throw util.error(new Error('Cannot determine length of ' + string),
	          { object: string });
	      }
	    },

	    upperFirst: function upperFirst(string) {
	      return string[0].toUpperCase() + string.substr(1);
	    },

	    lowerFirst: function lowerFirst(string) {
	      return string[0].toLowerCase() + string.substr(1);
	    }
	  },

	  ini: {
	    parse: function string(ini) {
	      var currentSection, map = {};
	      util.arrayEach(ini.split(/\r?\n/), function(line) {
	        line = line.split(/(^|\s)[;#]/)[0]; // remove comments
	        var section = line.match(/^\s*\[([^\[\]]+)\]\s*$/);
	        if (section) {
	          currentSection = section[1];
	          if (currentSection === '__proto__' || currentSection.split(/\s/)[1] === '__proto__') {
	            throw util.error(
	              new Error('Cannot load profile name \'' + currentSection + '\' from shared ini file.')
	            );
	          }
	        } else if (currentSection) {
	          var item = line.match(/^\s*(.+?)\s*=\s*(.+?)\s*$/);
	          if (item) {
	            map[currentSection] = map[currentSection] || {};
	            map[currentSection][item[1]] = item[2];
	          }
	        }
	      });

	      return map;
	    }
	  },

	  fn: {
	    noop: function() {},
	    callback: function (err) { if (err) throw err; },

	    /**
	     * Turn a synchronous function into as "async" function by making it call
	     * a callback. The underlying function is called with all but the last argument,
	     * which is treated as the callback. The callback is passed passed a first argument
	     * of null on success to mimick standard node callbacks.
	     */
	    makeAsync: function makeAsync(fn, expectedArgs) {
	      if (expectedArgs && expectedArgs <= fn.length) {
	        return fn;
	      }

	      return function() {
	        var args = Array.prototype.slice.call(arguments, 0);
	        var callback = args.pop();
	        var result = fn.apply(null, args);
	        callback(result);
	      };
	    }
	  },

	  /**
	   * Date and time utility functions.
	   */
	  date: {

	    /**
	     * @return [Date] the current JavaScript date object. Since all
	     *   AWS services rely on this date object, you can override
	     *   this function to provide a special time value to AWS service
	     *   requests.
	     */
	    getDate: function getDate() {
	      if (!AWS) AWS = __webpack_require__(1);
	      if (AWS.config.systemClockOffset) { // use offset when non-zero
	        return new Date(new Date().getTime() + AWS.config.systemClockOffset);
	      } else {
	        return new Date();
	      }
	    },

	    /**
	     * @return [String] the date in ISO-8601 format
	     */
	    iso8601: function iso8601(date) {
	      if (date === undefined) { date = util.date.getDate(); }
	      return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
	    },

	    /**
	     * @return [String] the date in RFC 822 format
	     */
	    rfc822: function rfc822(date) {
	      if (date === undefined) { date = util.date.getDate(); }
	      return date.toUTCString();
	    },

	    /**
	     * @return [Integer] the UNIX timestamp value for the current time
	     */
	    unixTimestamp: function unixTimestamp(date) {
	      if (date === undefined) { date = util.date.getDate(); }
	      return date.getTime() / 1000;
	    },

	    /**
	     * @param [String,number,Date] date
	     * @return [Date]
	     */
	    from: function format(date) {
	      if (typeof date === 'number') {
	        return new Date(date * 1000); // unix timestamp
	      } else {
	        return new Date(date);
	      }
	    },

	    /**
	     * Given a Date or date-like value, this function formats the
	     * date into a string of the requested value.
	     * @param [String,number,Date] date
	     * @param [String] formatter Valid formats are:
	     #   * 'iso8601'
	     #   * 'rfc822'
	     #   * 'unixTimestamp'
	     * @return [String]
	     */
	    format: function format(date, formatter) {
	      if (!formatter) formatter = 'iso8601';
	      return util.date[formatter](util.date.from(date));
	    },

	    parseTimestamp: function parseTimestamp(value) {
	      if (typeof value === 'number') { // unix timestamp (number)
	        return new Date(value * 1000);
	      } else if (value.match(/^\d+$/)) { // unix timestamp
	        return new Date(value * 1000);
	      } else if (value.match(/^\d{4}/)) { // iso8601
	        return new Date(value);
	      } else if (value.match(/^\w{3},/)) { // rfc822
	        return new Date(value);
	      } else {
	        throw util.error(
	          new Error('unhandled timestamp format: ' + value),
	          {code: 'TimestampParserError'});
	      }
	    }

	  },

	  crypto: {
	    crc32Table: [
	     0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419,
	     0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4,
	     0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07,
	     0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE,
	     0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856,
	     0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9,
	     0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4,
	     0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B,
	     0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3,
	     0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A,
	     0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599,
	     0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924,
	     0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190,
	     0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F,
	     0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E,
	     0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01,
	     0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED,
	     0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950,
	     0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3,
	     0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2,
	     0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A,
	     0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5,
	     0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010,
	     0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F,
	     0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17,
	     0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6,
	     0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615,
	     0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8,
	     0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344,
	     0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB,
	     0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A,
	     0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5,
	     0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1,
	     0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C,
	     0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF,
	     0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236,
	     0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE,
	     0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31,
	     0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C,
	     0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713,
	     0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B,
	     0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242,
	     0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1,
	     0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C,
	     0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278,
	     0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7,
	     0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66,
	     0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9,
	     0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605,
	     0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8,
	     0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B,
	     0x2D02EF8D],

	    crc32: function crc32(data) {
	      var tbl = util.crypto.crc32Table;
	      var crc = 0 ^ -1;

	      if (typeof data === 'string') {
	        data = util.buffer.toBuffer(data);
	      }

	      for (var i = 0; i < data.length; i++) {
	        var code = data.readUInt8(i);
	        crc = (crc >>> 8) ^ tbl[(crc ^ code) & 0xFF];
	      }
	      return (crc ^ -1) >>> 0;
	    },

	    hmac: function hmac(key, string, digest, fn) {
	      if (!digest) digest = 'binary';
	      if (digest === 'buffer') { digest = undefined; }
	      if (!fn) fn = 'sha256';
	      if (typeof string === 'string') string = util.buffer.toBuffer(string);
	      return util.crypto.lib.createHmac(fn, key).update(string).digest(digest);
	    },

	    md5: function md5(data, digest, callback) {
	      return util.crypto.hash('md5', data, digest, callback);
	    },

	    sha256: function sha256(data, digest, callback) {
	      return util.crypto.hash('sha256', data, digest, callback);
	    },

	    hash: function(algorithm, data, digest, callback) {
	      var hash = util.crypto.createHash(algorithm);
	      if (!digest) { digest = 'binary'; }
	      if (digest === 'buffer') { digest = undefined; }
	      if (typeof data === 'string') data = util.buffer.toBuffer(data);
	      var sliceFn = util.arraySliceFn(data);
	      var isBuffer = util.Buffer.isBuffer(data);
	      //Identifying objects with an ArrayBuffer as buffers
	      if (util.isBrowser() && typeof ArrayBuffer !== 'undefined' && data && data.buffer instanceof ArrayBuffer) isBuffer = true;

	      if (callback && typeof data === 'object' &&
	          typeof data.on === 'function' && !isBuffer) {
	        data.on('data', function(chunk) { hash.update(chunk); });
	        data.on('error', function(err) { callback(err); });
	        data.on('end', function() { callback(null, hash.digest(digest)); });
	      } else if (callback && sliceFn && !isBuffer &&
	                 typeof FileReader !== 'undefined') {
	        // this might be a File/Blob
	        var index = 0, size = 1024 * 512;
	        var reader = new FileReader();
	        reader.onerror = function() {
	          callback(new Error('Failed to read data.'));
	        };
	        reader.onload = function() {
	          var buf = new util.Buffer(new Uint8Array(reader.result));
	          hash.update(buf);
	          index += buf.length;
	          reader._continueReading();
	        };
	        reader._continueReading = function() {
	          if (index >= data.size) {
	            callback(null, hash.digest(digest));
	            return;
	          }

	          var back = index + size;
	          if (back > data.size) back = data.size;
	          reader.readAsArrayBuffer(sliceFn.call(data, index, back));
	        };

	        reader._continueReading();
	      } else {
	        if (util.isBrowser() && typeof data === 'object' && !isBuffer) {
	          data = new util.Buffer(new Uint8Array(data));
	        }
	        var out = hash.update(data).digest(digest);
	        if (callback) callback(null, out);
	        return out;
	      }
	    },

	    toHex: function toHex(data) {
	      var out = [];
	      for (var i = 0; i < data.length; i++) {
	        out.push(('0' + data.charCodeAt(i).toString(16)).substr(-2, 2));
	      }
	      return out.join('');
	    },

	    createHash: function createHash(algorithm) {
	      return util.crypto.lib.createHash(algorithm);
	    }

	  },

	  /** @!ignore */

	  /* Abort constant */
	  abort: {},

	  each: function each(object, iterFunction) {
	    for (var key in object) {
	      if (Object.prototype.hasOwnProperty.call(object, key)) {
	        var ret = iterFunction.call(this, key, object[key]);
	        if (ret === util.abort) break;
	      }
	    }
	  },

	  arrayEach: function arrayEach(array, iterFunction) {
	    for (var idx in array) {
	      if (Object.prototype.hasOwnProperty.call(array, idx)) {
	        var ret = iterFunction.call(this, array[idx], parseInt(idx, 10));
	        if (ret === util.abort) break;
	      }
	    }
	  },

	  update: function update(obj1, obj2) {
	    util.each(obj2, function iterator(key, item) {
	      obj1[key] = item;
	    });
	    return obj1;
	  },

	  merge: function merge(obj1, obj2) {
	    return util.update(util.copy(obj1), obj2);
	  },

	  copy: function copy(object) {
	    if (object === null || object === undefined) return object;
	    var dupe = {};
	    // jshint forin:false
	    for (var key in object) {
	      dupe[key] = object[key];
	    }
	    return dupe;
	  },

	  isEmpty: function isEmpty(obj) {
	    for (var prop in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
	        return false;
	      }
	    }
	    return true;
	  },

	  arraySliceFn: function arraySliceFn(obj) {
	    var fn = obj.slice || obj.webkitSlice || obj.mozSlice;
	    return typeof fn === 'function' ? fn : null;
	  },

	  isType: function isType(obj, type) {
	    // handle cross-"frame" objects
	    if (typeof type === 'function') type = util.typeName(type);
	    return Object.prototype.toString.call(obj) === '[object ' + type + ']';
	  },

	  typeName: function typeName(type) {
	    if (Object.prototype.hasOwnProperty.call(type, 'name')) return type.name;
	    var str = type.toString();
	    var match = str.match(/^\s*function (.+)\(/);
	    return match ? match[1] : str;
	  },

	  error: function error(err, options) {
	    var originalError = null;
	    if (typeof err.message === 'string' && err.message !== '') {
	      if (typeof options === 'string' || (options && options.message)) {
	        originalError = util.copy(err);
	        originalError.message = err.message;
	      }
	    }
	    err.message = err.message || null;

	    if (typeof options === 'string') {
	      err.message = options;
	    } else if (typeof options === 'object' && options !== null) {
	      util.update(err, options);
	      if (options.message)
	        err.message = options.message;
	      if (options.code || options.name)
	        err.code = options.code || options.name;
	      if (options.stack)
	        err.stack = options.stack;
	    }

	    if (typeof Object.defineProperty === 'function') {
	      Object.defineProperty(err, 'name', {writable: true, enumerable: false});
	      Object.defineProperty(err, 'message', {enumerable: true});
	    }

	    err.name = String(options && options.name || err.name || err.code || 'Error');
	    err.time = new Date();

	    if (originalError) err.originalError = originalError;

	    return err;
	  },

	  /**
	   * @api private
	   */
	  inherit: function inherit(klass, features) {
	    var newObject = null;
	    if (features === undefined) {
	      features = klass;
	      klass = Object;
	      newObject = {};
	    } else {
	      var ctor = function ConstructorWrapper() {};
	      ctor.prototype = klass.prototype;
	      newObject = new ctor();
	    }

	    // constructor not supplied, create pass-through ctor
	    if (features.constructor === Object) {
	      features.constructor = function() {
	        if (klass !== Object) {
	          return klass.apply(this, arguments);
	        }
	      };
	    }

	    features.constructor.prototype = newObject;
	    util.update(features.constructor.prototype, features);
	    features.constructor.__super__ = klass;
	    return features.constructor;
	  },

	  /**
	   * @api private
	   */
	  mixin: function mixin() {
	    var klass = arguments[0];
	    for (var i = 1; i < arguments.length; i++) {
	      // jshint forin:false
	      for (var prop in arguments[i].prototype) {
	        var fn = arguments[i].prototype[prop];
	        if (prop !== 'constructor') {
	          klass.prototype[prop] = fn;
	        }
	      }
	    }
	    return klass;
	  },

	  /**
	   * @api private
	   */
	  hideProperties: function hideProperties(obj, props) {
	    if (typeof Object.defineProperty !== 'function') return;

	    util.arrayEach(props, function (key) {
	      Object.defineProperty(obj, key, {
	        enumerable: false, writable: true, configurable: true });
	    });
	  },

	  /**
	   * @api private
	   */
	  property: function property(obj, name, value, enumerable, isValue) {
	    var opts = {
	      configurable: true,
	      enumerable: enumerable !== undefined ? enumerable : true
	    };
	    if (typeof value === 'function' && !isValue) {
	      opts.get = value;
	    }
	    else {
	      opts.value = value; opts.writable = true;
	    }

	    Object.defineProperty(obj, name, opts);
	  },

	  /**
	   * @api private
	   */
	  memoizedProperty: function memoizedProperty(obj, name, get, enumerable) {
	    var cachedValue = null;

	    // build enumerable attribute for each value with lazy accessor.
	    util.property(obj, name, function() {
	      if (cachedValue === null) {
	        cachedValue = get();
	      }
	      return cachedValue;
	    }, enumerable);
	  },

	  /**
	   * TODO Remove in major version revision
	   * This backfill populates response data without the
	   * top-level payload name.
	   *
	   * @api private
	   */
	  hoistPayloadMember: function hoistPayloadMember(resp) {
	    var req = resp.request;
	    var operationName = req.operation;
	    var operation = req.service.api.operations[operationName];
	    var output = operation.output;
	    if (output.payload && !operation.hasEventOutput) {
	      var payloadMember = output.members[output.payload];
	      var responsePayload = resp.data[output.payload];
	      if (payloadMember.type === 'structure') {
	        util.each(responsePayload, function(key, value) {
	          util.property(resp.data, key, value, false);
	        });
	      }
	    }
	  },

	  /**
	   * Compute SHA-256 checksums of streams
	   *
	   * @api private
	   */
	  computeSha256: function computeSha256(body, done) {
	    if (util.isNode()) {
	      var Stream = util.stream.Stream;
	      var fs = __webpack_require__(6);
	      if (typeof Stream === 'function' && body instanceof Stream) {
	        if (typeof body.path === 'string') { // assume file object
	          var settings = {};
	          if (typeof body.start === 'number') {
	            settings.start = body.start;
	          }
	          if (typeof body.end === 'number') {
	            settings.end = body.end;
	          }
	          body = fs.createReadStream(body.path, settings);
	        } else { // TODO support other stream types
	          return done(new Error('Non-file stream objects are ' +
	                                'not supported with SigV4'));
	        }
	      }
	    }

	    util.crypto.sha256(body, 'hex', function(err, sha) {
	      if (err) done(err);
	      else done(null, sha);
	    });
	  },

	  /**
	   * @api private
	   */
	  isClockSkewed: function isClockSkewed(serverTime) {
	    if (serverTime) {
	      util.property(AWS.config, 'isClockSkewed',
	        Math.abs(new Date().getTime() - serverTime) >= 300000, false);
	      return AWS.config.isClockSkewed;
	    }
	  },

	  applyClockOffset: function applyClockOffset(serverTime) {
	    if (serverTime)
	      AWS.config.systemClockOffset = serverTime - new Date().getTime();
	  },

	  /**
	   * @api private
	   */
	  extractRequestId: function extractRequestId(resp) {
	    var requestId = resp.httpResponse.headers['x-amz-request-id'] ||
	                     resp.httpResponse.headers['x-amzn-requestid'];

	    if (!requestId && resp.data && resp.data.ResponseMetadata) {
	      requestId = resp.data.ResponseMetadata.RequestId;
	    }

	    if (requestId) {
	      resp.requestId = requestId;
	    }

	    if (resp.error) {
	      resp.error.requestId = requestId;
	    }
	  },

	  /**
	   * @api private
	   */
	  addPromises: function addPromises(constructors, PromiseDependency) {
	    var deletePromises = false;
	    if (PromiseDependency === undefined && AWS && AWS.config) {
	      PromiseDependency = AWS.config.getPromisesDependency();
	    }
	    if (PromiseDependency === undefined && typeof Promise !== 'undefined') {
	      PromiseDependency = Promise;
	    }
	    if (typeof PromiseDependency !== 'function') deletePromises = true;
	    if (!Array.isArray(constructors)) constructors = [constructors];

	    for (var ind = 0; ind < constructors.length; ind++) {
	      var constructor = constructors[ind];
	      if (deletePromises) {
	        if (constructor.deletePromisesFromClass) {
	          constructor.deletePromisesFromClass();
	        }
	      } else if (constructor.addPromisesToClass) {
	        constructor.addPromisesToClass(PromiseDependency);
	      }
	    }
	  },

	  /**
	   * @api private
	   * Return a function that will return a promise whose fate is decided by the
	   * callback behavior of the given method with `methodName`. The method to be
	   * promisified should conform to node.js convention of accepting a callback as
	   * last argument and calling that callback with error as the first argument
	   * and success value on the second argument.
	   */
	  promisifyMethod: function promisifyMethod(methodName, PromiseDependency) {
	    return function promise() {
	      var self = this;
	      var args = Array.prototype.slice.call(arguments);
	      return new PromiseDependency(function(resolve, reject) {
	        args.push(function(err, data) {
	          if (err) {
	            reject(err);
	          } else {
	            resolve(data);
	          }
	        });
	        self[methodName].apply(self, args);
	      });
	    };
	  },

	  /**
	   * @api private
	   */
	  isDualstackAvailable: function isDualstackAvailable(service) {
	    if (!service) return false;
	    var metadata = __webpack_require__(7);
	    if (typeof service !== 'string') service = service.serviceIdentifier;
	    if (typeof service !== 'string' || !metadata.hasOwnProperty(service)) return false;
	    return !!metadata[service].dualstackAvailable;
	  },

	  /**
	   * @api private
	   */
	  calculateRetryDelay: function calculateRetryDelay(retryCount, retryDelayOptions, err) {
	    if (!retryDelayOptions) retryDelayOptions = {};
	    var customBackoff = retryDelayOptions.customBackoff || null;
	    if (typeof customBackoff === 'function') {
	      return customBackoff(retryCount, err);
	    }
	    var base = typeof retryDelayOptions.base === 'number' ? retryDelayOptions.base : 100;
	    var delay = Math.random() * (Math.pow(2, retryCount) * base);
	    return delay;
	  },

	  /**
	   * @api private
	   */
	  handleRequestWithRetries: function handleRequestWithRetries(httpRequest, options, cb) {
	    if (!options) options = {};
	    var http = AWS.HttpClient.getInstance();
	    var httpOptions = options.httpOptions || {};
	    var retryCount = 0;

	    var errCallback = function(err) {
	      var maxRetries = options.maxRetries || 0;
	      if (err && err.code === 'TimeoutError') err.retryable = true;

	      // Call `calculateRetryDelay()` only when relevant, see #3401
	      if (err && err.retryable && retryCount < maxRetries) {
	        var delay = util.calculateRetryDelay(retryCount, options.retryDelayOptions, err);
	        if (delay >= 0) {
	          retryCount++;
	          setTimeout(sendRequest, delay + (err.retryAfter || 0));
	          return;
	        }
	      }
	      cb(err);
	    };

	    var sendRequest = function() {
	      var data = '';
	      http.handleRequest(httpRequest, httpOptions, function(httpResponse) {
	        httpResponse.on('data', function(chunk) { data += chunk.toString(); });
	        httpResponse.on('end', function() {
	          var statusCode = httpResponse.statusCode;
	          if (statusCode < 300) {
	            cb(null, data);
	          } else {
	            var retryAfter = parseInt(httpResponse.headers['retry-after'], 10) * 1000 || 0;
	            var err = util.error(new Error(),
	              {
	                statusCode: statusCode,
	                retryable: statusCode >= 500 || statusCode === 429
	              }
	            );
	            if (retryAfter && err.retryable) err.retryAfter = retryAfter;
	            errCallback(err);
	          }
	        });
	      }, errCallback);
	    };

	    AWS.util.defer(sendRequest);
	  },

	  /**
	   * @api private
	   */
	  uuid: {
	    v4: function uuidV4() {
	      return __webpack_require__(8).v4();
	    }
	  },

	  /**
	   * @api private
	   */
	  convertPayloadToString: function convertPayloadToString(resp) {
	    var req = resp.request;
	    var operation = req.operation;
	    var rules = req.service.api.operations[operation].output || {};
	    if (rules.payload && resp.data[rules.payload]) {
	      resp.data[rules.payload] = resp.data[rules.payload].toString();
	    }
	  },

	  /**
	   * @api private
	   */
	  defer: function defer(callback) {
	    if (typeof process === 'object' && typeof process.nextTick === 'function') {
	      process.nextTick(callback);
	    } else if (typeof setImmediate === 'function') {
	      setImmediate(callback);
	    } else {
	      setTimeout(callback, 0);
	    }
	  },

	  /**
	   * @api private
	   */
	  getRequestPayloadShape: function getRequestPayloadShape(req) {
	    var operations = req.service.api.operations;
	    if (!operations) return undefined;
	    var operation = (operations || {})[req.operation];
	    if (!operation || !operation.input || !operation.input.payload) return undefined;
	    return operation.input.members[operation.input.payload];
	  },

	  getProfilesFromSharedConfig: function getProfilesFromSharedConfig(iniLoader, filename) {
	    var profiles = {};
	    var profilesFromConfig = {};
	    if (process.env[util.configOptInEnv]) {
	      var profilesFromConfig = iniLoader.loadFrom({
	        isConfig: true,
	        filename: process.env[util.sharedConfigFileEnv]
	      });
	    }
	    var profilesFromCreds= {};
	    try {
	      var profilesFromCreds = iniLoader.loadFrom({
	        filename: filename ||
	          (process.env[util.configOptInEnv] && process.env[util.sharedCredentialsFileEnv])
	      });
	    } catch (error) {
	      // if using config, assume it is fully descriptive without a credentials file:
	      if (!process.env[util.configOptInEnv]) throw error;
	    }
	    for (var i = 0, profileNames = Object.keys(profilesFromConfig); i < profileNames.length; i++) {
	      profiles[profileNames[i]] = objectAssign(profiles[profileNames[i]] || {}, profilesFromConfig[profileNames[i]]);
	    }
	    for (var i = 0, profileNames = Object.keys(profilesFromCreds); i < profileNames.length; i++) {
	      profiles[profileNames[i]] = objectAssign(profiles[profileNames[i]] || {}, profilesFromCreds[profileNames[i]]);
	    }
	    return profiles;

	    /**
	     * Roughly the semantics of `Object.assign(target, source)`
	     */
	    function objectAssign(target, source) {
	      for (var i = 0, keys = Object.keys(source); i < keys.length; i++) {
	        target[keys[i]] = source[keys[i]];
	      }
	      return target;
	    }
	  },

	  /**
	   * @api private
	   */
	  ARN: {
	    validate: function validateARN(str) {
	      return str && str.indexOf('arn:') === 0 && str.split(':').length >= 6;
	    },
	    parse: function parseARN(arn) {
	      var matched = arn.split(':');
	      return {
	        partition: matched[1],
	        service: matched[2],
	        region: matched[3],
	        accountId: matched[4],
	        resource: matched.slice(5).join(':')
	      };
	    },
	    build: function buildARN(arnObject) {
	      if (
	        arnObject.service === undefined ||
	        arnObject.region === undefined ||
	        arnObject.accountId === undefined ||
	        arnObject.resource === undefined
	      ) throw util.error(new Error('Input ARN object is invalid'));
	      return 'arn:'+ (arnObject.partition || 'aws') + ':' + arnObject.service +
	        ':' + arnObject.region + ':' + arnObject.accountId + ':' + arnObject.resource;
	    }
	  },

	  /**
	   * @api private
	   */
	  defaultProfile: 'default',

	  /**
	   * @api private
	   */
	  configOptInEnv: 'AWS_SDK_LOAD_CONFIG',

	  /**
	   * @api private
	   */
	  sharedCredentialsFileEnv: 'AWS_SHARED_CREDENTIALS_FILE',

	  /**
	   * @api private
	   */
	  sharedConfigFileEnv: 'AWS_CONFIG_FILE',

	  /**
	   * @api private
	   */
	  imdsDisabledEnv: 'AWS_EC2_METADATA_DISABLED'
	};

	/**
	 * @api private
	 */
	module.exports = util;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(4).setImmediate))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
	            (typeof self !== "undefined" && self) ||
	            window;
	var apply = Function.prototype.apply;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(scope, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// setimmediate attaches itself to the global object
	__webpack_require__(5);
	// On some exotic environments, it's not clear which object `setimmediate` was
	// able to install onto.  Search each possibility in the same order as the
	// `setimmediate` library.
	exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
	                       (typeof global !== "undefined" && global.setImmediate) ||
	                       (this && this.setImmediate);
	exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
	                         (typeof global !== "undefined" && global.clearImmediate) ||
	                         (this && this.clearImmediate);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(3)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/* (ignored) */

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	module.exports = {"acm":{"name":"ACM","cors":true},"apigateway":{"name":"APIGateway","cors":true},"applicationautoscaling":{"prefix":"application-autoscaling","name":"ApplicationAutoScaling","cors":true},"appstream":{"name":"AppStream"},"autoscaling":{"name":"AutoScaling","cors":true},"batch":{"name":"Batch"},"budgets":{"name":"Budgets"},"clouddirectory":{"name":"CloudDirectory","versions":["2016-05-10*"]},"cloudformation":{"name":"CloudFormation","cors":true},"cloudfront":{"name":"CloudFront","versions":["2013-05-12*","2013-11-11*","2014-05-31*","2014-10-21*","2014-11-06*","2015-04-17*","2015-07-27*","2015-09-17*","2016-01-13*","2016-01-28*","2016-08-01*","2016-08-20*","2016-09-07*","2016-09-29*","2016-11-25*","2017-03-25*","2017-10-30*","2018-06-18*","2018-11-05*","2019-03-26*"],"cors":true},"cloudhsm":{"name":"CloudHSM","cors":true},"cloudsearch":{"name":"CloudSearch"},"cloudsearchdomain":{"name":"CloudSearchDomain"},"cloudtrail":{"name":"CloudTrail","cors":true},"cloudwatch":{"prefix":"monitoring","name":"CloudWatch","cors":true},"cloudwatchevents":{"prefix":"events","name":"CloudWatchEvents","versions":["2014-02-03*"],"cors":true},"cloudwatchlogs":{"prefix":"logs","name":"CloudWatchLogs","cors":true},"codebuild":{"name":"CodeBuild","cors":true},"codecommit":{"name":"CodeCommit","cors":true},"codedeploy":{"name":"CodeDeploy","cors":true},"codepipeline":{"name":"CodePipeline","cors":true},"cognitoidentity":{"prefix":"cognito-identity","name":"CognitoIdentity","cors":true},"cognitoidentityserviceprovider":{"prefix":"cognito-idp","name":"CognitoIdentityServiceProvider","cors":true},"cognitosync":{"prefix":"cognito-sync","name":"CognitoSync","cors":true},"configservice":{"prefix":"config","name":"ConfigService","cors":true},"cur":{"name":"CUR","cors":true},"datapipeline":{"name":"DataPipeline"},"devicefarm":{"name":"DeviceFarm","cors":true},"directconnect":{"name":"DirectConnect","cors":true},"directoryservice":{"prefix":"ds","name":"DirectoryService"},"discovery":{"name":"Discovery"},"dms":{"name":"DMS"},"dynamodb":{"name":"DynamoDB","cors":true},"dynamodbstreams":{"prefix":"streams.dynamodb","name":"DynamoDBStreams","cors":true},"ec2":{"name":"EC2","versions":["2013-06-15*","2013-10-15*","2014-02-01*","2014-05-01*","2014-06-15*","2014-09-01*","2014-10-01*","2015-03-01*","2015-04-15*","2015-10-01*","2016-04-01*","2016-09-15*"],"cors":true},"ecr":{"name":"ECR","cors":true},"ecs":{"name":"ECS","cors":true},"efs":{"prefix":"elasticfilesystem","name":"EFS","cors":true},"elasticache":{"name":"ElastiCache","versions":["2012-11-15*","2014-03-24*","2014-07-15*","2014-09-30*"],"cors":true},"elasticbeanstalk":{"name":"ElasticBeanstalk","cors":true},"elb":{"prefix":"elasticloadbalancing","name":"ELB","cors":true},"elbv2":{"prefix":"elasticloadbalancingv2","name":"ELBv2","cors":true},"emr":{"prefix":"elasticmapreduce","name":"EMR","cors":true},"es":{"name":"ES"},"elastictranscoder":{"name":"ElasticTranscoder","cors":true},"firehose":{"name":"Firehose","cors":true},"gamelift":{"name":"GameLift","cors":true},"glacier":{"name":"Glacier"},"health":{"name":"Health"},"iam":{"name":"IAM","cors":true},"importexport":{"name":"ImportExport"},"inspector":{"name":"Inspector","versions":["2015-08-18*"],"cors":true},"iot":{"name":"Iot","cors":true},"iotdata":{"prefix":"iot-data","name":"IotData","cors":true},"kinesis":{"name":"Kinesis","cors":true},"kinesisanalytics":{"name":"KinesisAnalytics"},"kms":{"name":"KMS","cors":true},"lambda":{"name":"Lambda","cors":true},"lexruntime":{"prefix":"runtime.lex","name":"LexRuntime","cors":true},"lightsail":{"name":"Lightsail"},"machinelearning":{"name":"MachineLearning","cors":true},"marketplacecommerceanalytics":{"name":"MarketplaceCommerceAnalytics","cors":true},"marketplacemetering":{"prefix":"meteringmarketplace","name":"MarketplaceMetering"},"mturk":{"prefix":"mturk-requester","name":"MTurk","cors":true},"mobileanalytics":{"name":"MobileAnalytics","cors":true},"opsworks":{"name":"OpsWorks","cors":true},"opsworkscm":{"name":"OpsWorksCM"},"organizations":{"name":"Organizations"},"pinpoint":{"name":"Pinpoint"},"polly":{"name":"Polly","cors":true},"rds":{"name":"RDS","versions":["2014-09-01*"],"cors":true},"redshift":{"name":"Redshift","cors":true},"rekognition":{"name":"Rekognition","cors":true},"resourcegroupstaggingapi":{"name":"ResourceGroupsTaggingAPI"},"route53":{"name":"Route53","cors":true},"route53domains":{"name":"Route53Domains","cors":true},"s3":{"name":"S3","dualstackAvailable":true,"cors":true},"s3control":{"name":"S3Control","dualstackAvailable":true,"xmlNoDefaultLists":true},"servicecatalog":{"name":"ServiceCatalog","cors":true},"ses":{"prefix":"email","name":"SES","cors":true},"shield":{"name":"Shield"},"simpledb":{"prefix":"sdb","name":"SimpleDB"},"sms":{"name":"SMS"},"snowball":{"name":"Snowball"},"sns":{"name":"SNS","cors":true},"sqs":{"name":"SQS","cors":true},"ssm":{"name":"SSM","cors":true},"storagegateway":{"name":"StorageGateway","cors":true},"stepfunctions":{"prefix":"states","name":"StepFunctions"},"sts":{"name":"STS","cors":true},"support":{"name":"Support"},"swf":{"name":"SWF"},"xray":{"name":"XRay","cors":true},"waf":{"name":"WAF","cors":true},"wafregional":{"prefix":"waf-regional","name":"WAFRegional"},"workdocs":{"name":"WorkDocs","cors":true},"workspaces":{"name":"WorkSpaces"},"codestar":{"name":"CodeStar"},"lexmodelbuildingservice":{"prefix":"lex-models","name":"LexModelBuildingService","cors":true},"marketplaceentitlementservice":{"prefix":"entitlement.marketplace","name":"MarketplaceEntitlementService"},"athena":{"name":"Athena","cors":true},"greengrass":{"name":"Greengrass"},"dax":{"name":"DAX"},"migrationhub":{"prefix":"AWSMigrationHub","name":"MigrationHub"},"cloudhsmv2":{"name":"CloudHSMV2","cors":true},"glue":{"name":"Glue"},"mobile":{"name":"Mobile"},"pricing":{"name":"Pricing","cors":true},"costexplorer":{"prefix":"ce","name":"CostExplorer","cors":true},"mediaconvert":{"name":"MediaConvert"},"medialive":{"name":"MediaLive"},"mediapackage":{"name":"MediaPackage"},"mediastore":{"name":"MediaStore"},"mediastoredata":{"prefix":"mediastore-data","name":"MediaStoreData","cors":true},"appsync":{"name":"AppSync"},"guardduty":{"name":"GuardDuty"},"mq":{"name":"MQ"},"comprehend":{"name":"Comprehend","cors":true},"iotjobsdataplane":{"prefix":"iot-jobs-data","name":"IoTJobsDataPlane"},"kinesisvideoarchivedmedia":{"prefix":"kinesis-video-archived-media","name":"KinesisVideoArchivedMedia","cors":true},"kinesisvideomedia":{"prefix":"kinesis-video-media","name":"KinesisVideoMedia","cors":true},"kinesisvideo":{"name":"KinesisVideo","cors":true},"sagemakerruntime":{"prefix":"runtime.sagemaker","name":"SageMakerRuntime"},"sagemaker":{"name":"SageMaker"},"translate":{"name":"Translate","cors":true},"resourcegroups":{"prefix":"resource-groups","name":"ResourceGroups","cors":true},"alexaforbusiness":{"name":"AlexaForBusiness"},"cloud9":{"name":"Cloud9"},"serverlessapplicationrepository":{"prefix":"serverlessrepo","name":"ServerlessApplicationRepository"},"servicediscovery":{"name":"ServiceDiscovery"},"workmail":{"name":"WorkMail"},"autoscalingplans":{"prefix":"autoscaling-plans","name":"AutoScalingPlans"},"transcribeservice":{"prefix":"transcribe","name":"TranscribeService"},"connect":{"name":"Connect","cors":true},"acmpca":{"prefix":"acm-pca","name":"ACMPCA"},"fms":{"name":"FMS"},"secretsmanager":{"name":"SecretsManager","cors":true},"iotanalytics":{"name":"IoTAnalytics","cors":true},"iot1clickdevicesservice":{"prefix":"iot1click-devices","name":"IoT1ClickDevicesService"},"iot1clickprojects":{"prefix":"iot1click-projects","name":"IoT1ClickProjects"},"pi":{"name":"PI"},"neptune":{"name":"Neptune"},"mediatailor":{"name":"MediaTailor"},"eks":{"name":"EKS"},"macie":{"name":"Macie"},"dlm":{"name":"DLM"},"signer":{"name":"Signer"},"chime":{"name":"Chime"},"pinpointemail":{"prefix":"pinpoint-email","name":"PinpointEmail"},"ram":{"name":"RAM"},"route53resolver":{"name":"Route53Resolver"},"pinpointsmsvoice":{"prefix":"sms-voice","name":"PinpointSMSVoice"},"quicksight":{"name":"QuickSight"},"rdsdataservice":{"prefix":"rds-data","name":"RDSDataService"},"amplify":{"name":"Amplify"},"datasync":{"name":"DataSync"},"robomaker":{"name":"RoboMaker"},"transfer":{"name":"Transfer"},"globalaccelerator":{"name":"GlobalAccelerator"},"comprehendmedical":{"name":"ComprehendMedical","cors":true},"kinesisanalyticsv2":{"name":"KinesisAnalyticsV2"},"mediaconnect":{"name":"MediaConnect"},"fsx":{"name":"FSx"},"securityhub":{"name":"SecurityHub"},"appmesh":{"name":"AppMesh","versions":["2018-10-01*"]},"licensemanager":{"prefix":"license-manager","name":"LicenseManager"},"kafka":{"name":"Kafka"},"apigatewaymanagementapi":{"name":"ApiGatewayManagementApi"},"apigatewayv2":{"name":"ApiGatewayV2"},"docdb":{"name":"DocDB"},"backup":{"name":"Backup"},"worklink":{"name":"WorkLink"},"textract":{"name":"Textract"},"managedblockchain":{"name":"ManagedBlockchain"},"mediapackagevod":{"prefix":"mediapackage-vod","name":"MediaPackageVod"},"groundstation":{"name":"GroundStation"},"iotthingsgraph":{"name":"IoTThingsGraph"},"iotevents":{"name":"IoTEvents"},"ioteventsdata":{"prefix":"iotevents-data","name":"IoTEventsData"},"personalize":{"name":"Personalize","cors":true},"personalizeevents":{"prefix":"personalize-events","name":"PersonalizeEvents","cors":true},"personalizeruntime":{"prefix":"personalize-runtime","name":"PersonalizeRuntime","cors":true},"applicationinsights":{"prefix":"application-insights","name":"ApplicationInsights"},"servicequotas":{"prefix":"service-quotas","name":"ServiceQuotas"},"ec2instanceconnect":{"prefix":"ec2-instance-connect","name":"EC2InstanceConnect"},"eventbridge":{"name":"EventBridge"},"lakeformation":{"name":"LakeFormation"},"forecastservice":{"prefix":"forecast","name":"ForecastService","cors":true},"forecastqueryservice":{"prefix":"forecastquery","name":"ForecastQueryService","cors":true},"qldb":{"name":"QLDB"},"qldbsession":{"prefix":"qldb-session","name":"QLDBSession"},"workmailmessageflow":{"name":"WorkMailMessageFlow"},"codestarnotifications":{"prefix":"codestar-notifications","name":"CodeStarNotifications"},"savingsplans":{"name":"SavingsPlans"},"sso":{"name":"SSO"},"ssooidc":{"prefix":"sso-oidc","name":"SSOOIDC"},"marketplacecatalog":{"prefix":"marketplace-catalog","name":"MarketplaceCatalog"},"dataexchange":{"name":"DataExchange"},"sesv2":{"name":"SESV2"},"migrationhubconfig":{"prefix":"migrationhub-config","name":"MigrationHubConfig"},"connectparticipant":{"name":"ConnectParticipant"},"appconfig":{"name":"AppConfig"},"iotsecuretunneling":{"name":"IoTSecureTunneling"},"wafv2":{"name":"WAFV2"},"elasticinference":{"prefix":"elastic-inference","name":"ElasticInference"},"imagebuilder":{"name":"Imagebuilder"},"schemas":{"name":"Schemas"},"accessanalyzer":{"name":"AccessAnalyzer"},"codegurureviewer":{"prefix":"codeguru-reviewer","name":"CodeGuruReviewer"},"codeguruprofiler":{"name":"CodeGuruProfiler"},"computeoptimizer":{"prefix":"compute-optimizer","name":"ComputeOptimizer"},"frauddetector":{"name":"FraudDetector"},"kendra":{"name":"Kendra"},"networkmanager":{"name":"NetworkManager"},"outposts":{"name":"Outposts"},"augmentedairuntime":{"prefix":"sagemaker-a2i-runtime","name":"AugmentedAIRuntime"},"ebs":{"name":"EBS"},"kinesisvideosignalingchannels":{"prefix":"kinesis-video-signaling","name":"KinesisVideoSignalingChannels","cors":true},"detective":{"name":"Detective"},"codestarconnections":{"prefix":"codestar-connections","name":"CodeStarconnections"},"synthetics":{"name":"Synthetics"},"iotsitewise":{"name":"IoTSiteWise"},"macie2":{"name":"Macie2"},"codeartifact":{"name":"CodeArtifact"},"honeycode":{"name":"Honeycode"},"ivs":{"name":"IVS"},"braket":{"name":"Braket"},"identitystore":{"name":"IdentityStore"},"appflow":{"name":"Appflow"},"redshiftdata":{"prefix":"redshift-data","name":"RedshiftData"},"ssoadmin":{"prefix":"sso-admin","name":"SSOAdmin"},"timestreamquery":{"prefix":"timestream-query","name":"TimestreamQuery"},"timestreamwrite":{"prefix":"timestream-write","name":"TimestreamWrite"},"s3outposts":{"name":"S3Outposts"},"databrew":{"name":"DataBrew"},"servicecatalogappregistry":{"prefix":"servicecatalog-appregistry","name":"ServiceCatalogAppRegistry"},"networkfirewall":{"prefix":"network-firewall","name":"NetworkFirewall"},"mwaa":{"name":"MWAA"},"amplifybackend":{"name":"AmplifyBackend"},"appintegrations":{"name":"AppIntegrations"},"connectcontactlens":{"prefix":"connect-contact-lens","name":"ConnectContactLens"},"devopsguru":{"prefix":"devops-guru","name":"DevOpsGuru"},"ecrpublic":{"prefix":"ecr-public","name":"ECRPUBLIC"},"lookoutvision":{"name":"LookoutVision"},"sagemakerfeaturestoreruntime":{"prefix":"sagemaker-featurestore-runtime","name":"SageMakerFeatureStoreRuntime"},"customerprofiles":{"prefix":"customer-profiles","name":"CustomerProfiles"},"auditmanager":{"name":"AuditManager"},"emrcontainers":{"prefix":"emr-containers","name":"EMRcontainers"},"healthlake":{"name":"HealthLake"},"sagemakeredge":{"prefix":"sagemaker-edge","name":"SagemakerEdge"},"amp":{"name":"Amp"},"greengrassv2":{"name":"GreengrassV2"},"iotdeviceadvisor":{"name":"IotDeviceAdvisor"},"iotfleethub":{"name":"IoTFleetHub"},"iotwireless":{"name":"IoTWireless"},"location":{"name":"Location","cors":true},"wellarchitected":{"name":"WellArchitected"},"lexmodelsv2":{"prefix":"models.lex.v2","name":"LexModelsV2"},"lexruntimev2":{"prefix":"runtime.lex.v2","name":"LexRuntimeV2","cors":true},"fis":{"name":"Fis"},"lookoutmetrics":{"name":"LookoutMetrics"},"mgn":{"name":"Mgn"},"lookoutequipment":{"name":"LookoutEquipment"},"nimble":{"name":"Nimble"},"finspace":{"name":"Finspace"},"finspacedata":{"prefix":"finspace-data","name":"Finspacedata"},"ssmcontacts":{"prefix":"ssm-contacts","name":"SSMContacts"},"ssmincidents":{"prefix":"ssm-incidents","name":"SSMIncidents"},"applicationcostprofiler":{"name":"ApplicationCostProfiler"},"apprunner":{"name":"AppRunner"},"proton":{"name":"Proton"},"route53recoverycluster":{"prefix":"route53-recovery-cluster","name":"Route53RecoveryCluster"},"route53recoverycontrolconfig":{"prefix":"route53-recovery-control-config","name":"Route53RecoveryControlConfig"},"route53recoveryreadiness":{"prefix":"route53-recovery-readiness","name":"Route53RecoveryReadiness"},"chimesdkidentity":{"prefix":"chime-sdk-identity","name":"ChimeSDKIdentity"},"chimesdkmessaging":{"prefix":"chime-sdk-messaging","name":"ChimeSDKMessaging"},"snowdevicemanagement":{"prefix":"snow-device-management","name":"SnowDeviceManagement"},"memorydb":{"name":"MemoryDB"},"opensearch":{"name":"OpenSearch"},"kafkaconnect":{"name":"KafkaConnect"},"voiceid":{"prefix":"voice-id","name":"VoiceID"},"wisdom":{"name":"Wisdom"},"account":{"name":"Account"},"cloudcontrol":{"name":"CloudControl"},"grafana":{"name":"Grafana"},"panorama":{"name":"Panorama"},"chimesdkmeetings":{"prefix":"chime-sdk-meetings","name":"ChimeSDKMeetings"},"resiliencehub":{"name":"Resiliencehub"},"migrationhubstrategy":{"name":"MigrationHubStrategy"}}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var v1 = __webpack_require__(9);
	var v4 = __webpack_require__(12);

	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;

	module.exports = uuid;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var rng = __webpack_require__(10);
	var bytesToUuid = __webpack_require__(11);

	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html

	var _nodeId;
	var _clockseq;

	// Previous uuid creation time
	var _lastMSecs = 0;
	var _lastNSecs = 0;

	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];

	  options = options || {};
	  var node = options.node || _nodeId;
	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

	  // node and clockseq need to be initialized to random values if they're not
	  // specified.  We do this lazily to minimize issues related to insufficient
	  // system entropy.  See #189
	  if (node == null || clockseq == null) {
	    var seedBytes = rng();
	    if (node == null) {
	      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	      node = _nodeId = [
	        seedBytes[0] | 0x01,
	        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
	      ];
	    }
	    if (clockseq == null) {
	      // Per 4.2.2, randomize (14 bit) clockseq
	      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
	    }
	  }

	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }

	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }

	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;

	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;

	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;

	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;

	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;

	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;

	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;

	  // `node`
	  for (var n = 0; n < 6; ++n) {
	    b[i + n] = node[n];
	  }

	  return buf ? buf : bytesToUuid(b);
	}

	module.exports = v1;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	// Unique ID creation requires a high quality random # generator.  In the
	// browser this is a little complicated due to unknown quality of Math.random()
	// and inconsistent support for the `crypto` API.  We do the best we can via
	// feature-detection

	// getRandomValues needs to be invoked in a context where "this" is a Crypto
	// implementation. Also, find the complete implementation of crypto on IE11.
	var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
	                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

	if (getRandomValues) {
	  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
	  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

	  module.exports = function whatwgRNG() {
	    getRandomValues(rnds8);
	    return rnds8;
	  };
	} else {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var rnds = new Array(16);

	  module.exports = function mathRNG() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return rnds;
	  };
	}


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	/**
	 * Convert array of 16 byte values to UUID string format of the form:
	 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	 */
	var byteToHex = [];
	for (var i = 0; i < 256; ++i) {
	  byteToHex[i] = (i + 0x100).toString(16).substr(1);
	}

	function bytesToUuid(buf, offset) {
	  var i = offset || 0;
	  var bth = byteToHex;
	  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
	  return ([bth[buf[i++]], bth[buf[i++]], 
		bth[buf[i++]], bth[buf[i++]], '-',
		bth[buf[i++]], bth[buf[i++]], '-',
		bth[buf[i++]], bth[buf[i++]], '-',
		bth[buf[i++]], bth[buf[i++]], '-',
		bth[buf[i++]], bth[buf[i++]],
		bth[buf[i++]], bth[buf[i++]],
		bth[buf[i++]], bth[buf[i++]]]).join('');
	}

	module.exports = bytesToUuid;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var rng = __webpack_require__(10);
	var bytesToUuid = __webpack_require__(11);

	function v4(options, buf, offset) {
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options === 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || rng)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ++ii) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || bytesToUuid(rnds);
	}

	module.exports = v4;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var JsonBuilder = __webpack_require__(14);
	var JsonParser = __webpack_require__(15);
	var populateHostPrefix = __webpack_require__(16).populateHostPrefix;

	function buildRequest(req) {
	  var httpRequest = req.httpRequest;
	  var api = req.service.api;
	  var target = api.targetPrefix + '.' + api.operations[req.operation].name;
	  var version = api.jsonVersion || '1.0';
	  var input = api.operations[req.operation].input;
	  var builder = new JsonBuilder();

	  if (version === 1) version = '1.0';
	  httpRequest.body = builder.build(req.params || {}, input);
	  httpRequest.headers['Content-Type'] = 'application/x-amz-json-' + version;
	  httpRequest.headers['X-Amz-Target'] = target;

	  populateHostPrefix(req);
	}

	function extractError(resp) {
	  var error = {};
	  var httpResponse = resp.httpResponse;

	  error.code = httpResponse.headers['x-amzn-errortype'] || 'UnknownError';
	  if (typeof error.code === 'string') {
	    error.code = error.code.split(':')[0];
	  }

	  if (httpResponse.body.length > 0) {
	    try {
	      var e = JSON.parse(httpResponse.body.toString());
	      var code = e.__type || e.code || e.Code;
	      if (code) {
	        error.code = code.split('#').pop();
	      }
	      if (error.code === 'RequestEntityTooLarge') {
	        error.message = 'Request body must be less than 1 MB';
	      } else {
	        error.message = (e.message || e.Message || null);
	      }
	    } catch (e) {
	      error.statusCode = httpResponse.statusCode;
	      error.message = httpResponse.statusMessage;
	    }
	  } else {
	    error.statusCode = httpResponse.statusCode;
	    error.message = httpResponse.statusCode.toString();
	  }

	  resp.error = util.error(new Error(), error);
	}

	function extractData(resp) {
	  var body = resp.httpResponse.body.toString() || '{}';
	  if (resp.request.service.config.convertResponseTypes === false) {
	    resp.data = JSON.parse(body);
	  } else {
	    var operation = resp.request.service.api.operations[resp.request.operation];
	    var shape = operation.output || {};
	    var parser = new JsonParser();
	    resp.data = parser.parse(body, shape);
	  }
	}

	/**
	 * @api private
	 */
	module.exports = {
	  buildRequest: buildRequest,
	  extractError: extractError,
	  extractData: extractData
	};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);

	function JsonBuilder() { }

	JsonBuilder.prototype.build = function(value, shape) {
	  return JSON.stringify(translate(value, shape));
	};

	function translate(value, shape) {
	  if (!shape || value === undefined || value === null) return undefined;

	  switch (shape.type) {
	    case 'structure': return translateStructure(value, shape);
	    case 'map': return translateMap(value, shape);
	    case 'list': return translateList(value, shape);
	    default: return translateScalar(value, shape);
	  }
	}

	function translateStructure(structure, shape) {
	  if (shape.isDocument) {
	    return structure;
	  }
	  var struct = {};
	  util.each(structure, function(name, value) {
	    var memberShape = shape.members[name];
	    if (memberShape) {
	      if (memberShape.location !== 'body') return;
	      var locationName = memberShape.isLocationName ? memberShape.name : name;
	      var result = translate(value, memberShape);
	      if (result !== undefined) struct[locationName] = result;
	    }
	  });
	  return struct;
	}

	function translateList(list, shape) {
	  var out = [];
	  util.arrayEach(list, function(value) {
	    var result = translate(value, shape.member);
	    if (result !== undefined) out.push(result);
	  });
	  return out;
	}

	function translateMap(map, shape) {
	  var out = {};
	  util.each(map, function(key, value) {
	    var result = translate(value, shape.value);
	    if (result !== undefined) out[key] = result;
	  });
	  return out;
	}

	function translateScalar(value, shape) {
	  return shape.toWireFormat(value);
	}

	/**
	 * @api private
	 */
	module.exports = JsonBuilder;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);

	function JsonParser() { }

	JsonParser.prototype.parse = function(value, shape) {
	  return translate(JSON.parse(value), shape);
	};

	function translate(value, shape) {
	  if (!shape || value === undefined) return undefined;

	  switch (shape.type) {
	    case 'structure': return translateStructure(value, shape);
	    case 'map': return translateMap(value, shape);
	    case 'list': return translateList(value, shape);
	    default: return translateScalar(value, shape);
	  }
	}

	function translateStructure(structure, shape) {
	  if (structure == null) return undefined;
	  if (shape.isDocument) return structure;

	  var struct = {};
	  var shapeMembers = shape.members;
	  util.each(shapeMembers, function(name, memberShape) {
	    var locationName = memberShape.isLocationName ? memberShape.name : name;
	    if (Object.prototype.hasOwnProperty.call(structure, locationName)) {
	      var value = structure[locationName];
	      var result = translate(value, memberShape);
	      if (result !== undefined) struct[name] = result;
	    }
	  });
	  return struct;
	}

	function translateList(list, shape) {
	  if (list == null) return undefined;

	  var out = [];
	  util.arrayEach(list, function(value) {
	    var result = translate(value, shape.member);
	    if (result === undefined) out.push(null);
	    else out.push(result);
	  });
	  return out;
	}

	function translateMap(map, shape) {
	  if (map == null) return undefined;

	  var out = {};
	  util.each(map, function(key, value) {
	    var result = translate(value, shape.value);
	    if (result === undefined) out[key] = null;
	    else out[key] = result;
	  });
	  return out;
	}

	function translateScalar(value, shape) {
	  return shape.toType(value);
	}

	/**
	 * @api private
	 */
	module.exports = JsonParser;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var util =  __webpack_require__(2);
	var AWS = __webpack_require__(1);

	/**
	 * Prepend prefix defined by API model to endpoint that's already
	 * constructed. This feature does not apply to operations using
	 * endpoint discovery and can be disabled.
	 * @api private
	 */
	function populateHostPrefix(request)  {
	  var enabled = request.service.config.hostPrefixEnabled;
	  if (!enabled) return request;
	  var operationModel = request.service.api.operations[request.operation];
	  //don't marshal host prefix when operation has endpoint discovery traits
	  if (hasEndpointDiscover(request)) return request;
	  if (operationModel.endpoint && operationModel.endpoint.hostPrefix) {
	    var hostPrefixNotation = operationModel.endpoint.hostPrefix;
	    var hostPrefix = expandHostPrefix(hostPrefixNotation, request.params, operationModel.input);
	    prependEndpointPrefix(request.httpRequest.endpoint, hostPrefix);
	    validateHostname(request.httpRequest.endpoint.hostname);
	  }
	  return request;
	}

	/**
	 * @api private
	 */
	function hasEndpointDiscover(request) {
	  var api = request.service.api;
	  var operationModel = api.operations[request.operation];
	  var isEndpointOperation = api.endpointOperation && (api.endpointOperation === util.string.lowerFirst(operationModel.name));
	  return (operationModel.endpointDiscoveryRequired !== 'NULL' || isEndpointOperation === true);
	}

	/**
	 * @api private
	 */
	function expandHostPrefix(hostPrefixNotation, params, shape) {
	  util.each(shape.members, function(name, member) {
	    if (member.hostLabel === true) {
	      if (typeof params[name] !== 'string' || params[name] === '') {
	        throw util.error(new Error(), {
	          message: 'Parameter ' + name + ' should be a non-empty string.',
	          code: 'InvalidParameter'
	        });
	      }
	      var regex = new RegExp('\\{' + name + '\\}', 'g');
	      hostPrefixNotation = hostPrefixNotation.replace(regex, params[name]);
	    }
	  });
	  return hostPrefixNotation;
	}

	/**
	 * @api private
	 */
	function prependEndpointPrefix(endpoint, prefix) {
	  if (endpoint.host) {
	    endpoint.host = prefix + endpoint.host;
	  }
	  if (endpoint.hostname) {
	    endpoint.hostname = prefix + endpoint.hostname;
	  }
	}

	/**
	 * @api private
	 */
	function validateHostname(hostname) {
	  var labels = hostname.split('.');
	  //Reference: https://tools.ietf.org/html/rfc1123#section-2
	  var hostPattern = /^[a-zA-Z0-9]{1}$|^[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]$/;
	  util.arrayEach(labels, function(label) {
	    if (!label.length || label.length < 1 || label.length > 63) {
	      throw util.error(new Error(), {
	        code: 'ValidationError',
	        message: 'Hostname label length should be between 1 to 63 characters, inclusive.'
	      });
	    }
	    if (!hostPattern.test(label)) {
	      throw AWS.util.error(new Error(),
	        {code: 'ValidationError', message: label + ' is not hostname compatible.'});
	    }
	  });
	}

	module.exports = {
	  populateHostPrefix: populateHostPrefix
	};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);
	var util = __webpack_require__(2);
	var QueryParamSerializer = __webpack_require__(18);
	var Shape = __webpack_require__(19);
	var populateHostPrefix = __webpack_require__(16).populateHostPrefix;

	function buildRequest(req) {
	  var operation = req.service.api.operations[req.operation];
	  var httpRequest = req.httpRequest;
	  httpRequest.headers['Content-Type'] =
	    'application/x-www-form-urlencoded; charset=utf-8';
	  httpRequest.params = {
	    Version: req.service.api.apiVersion,
	    Action: operation.name
	  };

	  // convert the request parameters into a list of query params,
	  // e.g. Deeply.NestedParam.0.Name=value
	  var builder = new QueryParamSerializer();
	  builder.serialize(req.params, operation.input, function(name, value) {
	    httpRequest.params[name] = value;
	  });
	  httpRequest.body = util.queryParamsToString(httpRequest.params);

	  populateHostPrefix(req);
	}

	function extractError(resp) {
	  var data, body = resp.httpResponse.body.toString();
	  if (body.match('<UnknownOperationException')) {
	    data = {
	      Code: 'UnknownOperation',
	      Message: 'Unknown operation ' + resp.request.operation
	    };
	  } else {
	    try {
	      data = new AWS.XML.Parser().parse(body);
	    } catch (e) {
	      data = {
	        Code: resp.httpResponse.statusCode,
	        Message: resp.httpResponse.statusMessage
	      };
	    }
	  }

	  if (data.requestId && !resp.requestId) resp.requestId = data.requestId;
	  if (data.Errors) data = data.Errors;
	  if (data.Error) data = data.Error;
	  if (data.Code) {
	    resp.error = util.error(new Error(), {
	      code: data.Code,
	      message: data.Message
	    });
	  } else {
	    resp.error = util.error(new Error(), {
	      code: resp.httpResponse.statusCode,
	      message: null
	    });
	  }
	}

	function extractData(resp) {
	  var req = resp.request;
	  var operation = req.service.api.operations[req.operation];
	  var shape = operation.output || {};
	  var origRules = shape;

	  if (origRules.resultWrapper) {
	    var tmp = Shape.create({type: 'structure'});
	    tmp.members[origRules.resultWrapper] = shape;
	    tmp.memberNames = [origRules.resultWrapper];
	    util.property(shape, 'name', shape.resultWrapper);
	    shape = tmp;
	  }

	  var parser = new AWS.XML.Parser();

	  // TODO: Refactor XML Parser to parse RequestId from response.
	  if (shape && shape.members && !shape.members._XAMZRequestId) {
	    var requestIdShape = Shape.create(
	      { type: 'string' },
	      { api: { protocol: 'query' } },
	      'requestId'
	    );
	    shape.members._XAMZRequestId = requestIdShape;
	  }

	  var data = parser.parse(resp.httpResponse.body.toString(), shape);
	  resp.requestId = data._XAMZRequestId || data.requestId;

	  if (data._XAMZRequestId) delete data._XAMZRequestId;

	  if (origRules.resultWrapper) {
	    if (data[origRules.resultWrapper]) {
	      util.update(data, data[origRules.resultWrapper]);
	      delete data[origRules.resultWrapper];
	    }
	  }

	  resp.data = data;
	}

	/**
	 * @api private
	 */
	module.exports = {
	  buildRequest: buildRequest,
	  extractError: extractError,
	  extractData: extractData
	};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);

	function QueryParamSerializer() {
	}

	QueryParamSerializer.prototype.serialize = function(params, shape, fn) {
	  serializeStructure('', params, shape, fn);
	};

	function ucfirst(shape) {
	  if (shape.isQueryName || shape.api.protocol !== 'ec2') {
	    return shape.name;
	  } else {
	    return shape.name[0].toUpperCase() + shape.name.substr(1);
	  }
	}

	function serializeStructure(prefix, struct, rules, fn) {
	  util.each(rules.members, function(name, member) {
	    var value = struct[name];
	    if (value === null || value === undefined) return;

	    var memberName = ucfirst(member);
	    memberName = prefix ? prefix + '.' + memberName : memberName;
	    serializeMember(memberName, value, member, fn);
	  });
	}

	function serializeMap(name, map, rules, fn) {
	  var i = 1;
	  util.each(map, function (key, value) {
	    var prefix = rules.flattened ? '.' : '.entry.';
	    var position = prefix + (i++) + '.';
	    var keyName = position + (rules.key.name || 'key');
	    var valueName = position + (rules.value.name || 'value');
	    serializeMember(name + keyName, key, rules.key, fn);
	    serializeMember(name + valueName, value, rules.value, fn);
	  });
	}

	function serializeList(name, list, rules, fn) {
	  var memberRules = rules.member || {};

	  if (list.length === 0) {
	    fn.call(this, name, null);
	    return;
	  }

	  util.arrayEach(list, function (v, n) {
	    var suffix = '.' + (n + 1);
	    if (rules.api.protocol === 'ec2') {
	      // Do nothing for EC2
	      suffix = suffix + ''; // make linter happy
	    } else if (rules.flattened) {
	      if (memberRules.name) {
	        var parts = name.split('.');
	        parts.pop();
	        parts.push(ucfirst(memberRules));
	        name = parts.join('.');
	      }
	    } else {
	      suffix = '.' + (memberRules.name ? memberRules.name : 'member') + suffix;
	    }
	    serializeMember(name + suffix, v, memberRules, fn);
	  });
	}

	function serializeMember(name, value, rules, fn) {
	  if (value === null || value === undefined) return;
	  if (rules.type === 'structure') {
	    serializeStructure(name, value, rules, fn);
	  } else if (rules.type === 'list') {
	    serializeList(name, value, rules, fn);
	  } else if (rules.type === 'map') {
	    serializeMap(name, value, rules, fn);
	  } else {
	    fn(name, rules.toWireFormat(value).toString());
	  }
	}

	/**
	 * @api private
	 */
	module.exports = QueryParamSerializer;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var Collection = __webpack_require__(20);

	var util = __webpack_require__(2);

	function property(obj, name, value) {
	  if (value !== null && value !== undefined) {
	    util.property.apply(this, arguments);
	  }
	}

	function memoizedProperty(obj, name) {
	  if (!obj.constructor.prototype[name]) {
	    util.memoizedProperty.apply(this, arguments);
	  }
	}

	function Shape(shape, options, memberName) {
	  options = options || {};

	  property(this, 'shape', shape.shape);
	  property(this, 'api', options.api, false);
	  property(this, 'type', shape.type);
	  property(this, 'enum', shape.enum);
	  property(this, 'min', shape.min);
	  property(this, 'max', shape.max);
	  property(this, 'pattern', shape.pattern);
	  property(this, 'location', shape.location || this.location || 'body');
	  property(this, 'name', this.name || shape.xmlName || shape.queryName ||
	    shape.locationName || memberName);
	  property(this, 'isStreaming', shape.streaming || this.isStreaming || false);
	  property(this, 'requiresLength', shape.requiresLength, false);
	  property(this, 'isComposite', shape.isComposite || false);
	  property(this, 'isShape', true, false);
	  property(this, 'isQueryName', Boolean(shape.queryName), false);
	  property(this, 'isLocationName', Boolean(shape.locationName), false);
	  property(this, 'isIdempotent', shape.idempotencyToken === true);
	  property(this, 'isJsonValue', shape.jsonvalue === true);
	  property(this, 'isSensitive', shape.sensitive === true || shape.prototype && shape.prototype.sensitive === true);
	  property(this, 'isEventStream', Boolean(shape.eventstream), false);
	  property(this, 'isEvent', Boolean(shape.event), false);
	  property(this, 'isEventPayload', Boolean(shape.eventpayload), false);
	  property(this, 'isEventHeader', Boolean(shape.eventheader), false);
	  property(this, 'isTimestampFormatSet', Boolean(shape.timestampFormat) || shape.prototype && shape.prototype.isTimestampFormatSet === true, false);
	  property(this, 'endpointDiscoveryId', Boolean(shape.endpointdiscoveryid), false);
	  property(this, 'hostLabel', Boolean(shape.hostLabel), false);

	  if (options.documentation) {
	    property(this, 'documentation', shape.documentation);
	    property(this, 'documentationUrl', shape.documentationUrl);
	  }

	  if (shape.xmlAttribute) {
	    property(this, 'isXmlAttribute', shape.xmlAttribute || false);
	  }

	  // type conversion and parsing
	  property(this, 'defaultValue', null);
	  this.toWireFormat = function(value) {
	    if (value === null || value === undefined) return '';
	    return value;
	  };
	  this.toType = function(value) { return value; };
	}

	/**
	 * @api private
	 */
	Shape.normalizedTypes = {
	  character: 'string',
	  double: 'float',
	  long: 'integer',
	  short: 'integer',
	  biginteger: 'integer',
	  bigdecimal: 'float',
	  blob: 'binary'
	};

	/**
	 * @api private
	 */
	Shape.types = {
	  'structure': StructureShape,
	  'list': ListShape,
	  'map': MapShape,
	  'boolean': BooleanShape,
	  'timestamp': TimestampShape,
	  'float': FloatShape,
	  'integer': IntegerShape,
	  'string': StringShape,
	  'base64': Base64Shape,
	  'binary': BinaryShape
	};

	Shape.resolve = function resolve(shape, options) {
	  if (shape.shape) {
	    var refShape = options.api.shapes[shape.shape];
	    if (!refShape) {
	      throw new Error('Cannot find shape reference: ' + shape.shape);
	    }

	    return refShape;
	  } else {
	    return null;
	  }
	};

	Shape.create = function create(shape, options, memberName) {
	  if (shape.isShape) return shape;

	  var refShape = Shape.resolve(shape, options);
	  if (refShape) {
	    var filteredKeys = Object.keys(shape);
	    if (!options.documentation) {
	      filteredKeys = filteredKeys.filter(function(name) {
	        return !name.match(/documentation/);
	      });
	    }

	    // create an inline shape with extra members
	    var InlineShape = function() {
	      refShape.constructor.call(this, shape, options, memberName);
	    };
	    InlineShape.prototype = refShape;
	    return new InlineShape();
	  } else {
	    // set type if not set
	    if (!shape.type) {
	      if (shape.members) shape.type = 'structure';
	      else if (shape.member) shape.type = 'list';
	      else if (shape.key) shape.type = 'map';
	      else shape.type = 'string';
	    }

	    // normalize types
	    var origType = shape.type;
	    if (Shape.normalizedTypes[shape.type]) {
	      shape.type = Shape.normalizedTypes[shape.type];
	    }

	    if (Shape.types[shape.type]) {
	      return new Shape.types[shape.type](shape, options, memberName);
	    } else {
	      throw new Error('Unrecognized shape type: ' + origType);
	    }
	  }
	};

	function CompositeShape(shape) {
	  Shape.apply(this, arguments);
	  property(this, 'isComposite', true);

	  if (shape.flattened) {
	    property(this, 'flattened', shape.flattened || false);
	  }
	}

	function StructureShape(shape, options) {
	  var self = this;
	  var requiredMap = null, firstInit = !this.isShape;

	  CompositeShape.apply(this, arguments);

	  if (firstInit) {
	    property(this, 'defaultValue', function() { return {}; });
	    property(this, 'members', {});
	    property(this, 'memberNames', []);
	    property(this, 'required', []);
	    property(this, 'isRequired', function() { return false; });
	    property(this, 'isDocument', Boolean(shape.document));
	  }

	  if (shape.members) {
	    property(this, 'members', new Collection(shape.members, options, function(name, member) {
	      return Shape.create(member, options, name);
	    }));
	    memoizedProperty(this, 'memberNames', function() {
	      return shape.xmlOrder || Object.keys(shape.members);
	    });

	    if (shape.event) {
	      memoizedProperty(this, 'eventPayloadMemberName', function() {
	        var members = self.members;
	        var memberNames = self.memberNames;
	        // iterate over members to find ones that are event payloads
	        for (var i = 0, iLen = memberNames.length; i < iLen; i++) {
	          if (members[memberNames[i]].isEventPayload) {
	            return memberNames[i];
	          }
	        }
	      });

	      memoizedProperty(this, 'eventHeaderMemberNames', function() {
	        var members = self.members;
	        var memberNames = self.memberNames;
	        var eventHeaderMemberNames = [];
	        // iterate over members to find ones that are event headers
	        for (var i = 0, iLen = memberNames.length; i < iLen; i++) {
	          if (members[memberNames[i]].isEventHeader) {
	            eventHeaderMemberNames.push(memberNames[i]);
	          }
	        }
	        return eventHeaderMemberNames;
	      });
	    }
	  }

	  if (shape.required) {
	    property(this, 'required', shape.required);
	    property(this, 'isRequired', function(name) {
	      if (!requiredMap) {
	        requiredMap = {};
	        for (var i = 0; i < shape.required.length; i++) {
	          requiredMap[shape.required[i]] = true;
	        }
	      }

	      return requiredMap[name];
	    }, false, true);
	  }

	  property(this, 'resultWrapper', shape.resultWrapper || null);

	  if (shape.payload) {
	    property(this, 'payload', shape.payload);
	  }

	  if (typeof shape.xmlNamespace === 'string') {
	    property(this, 'xmlNamespaceUri', shape.xmlNamespace);
	  } else if (typeof shape.xmlNamespace === 'object') {
	    property(this, 'xmlNamespacePrefix', shape.xmlNamespace.prefix);
	    property(this, 'xmlNamespaceUri', shape.xmlNamespace.uri);
	  }
	}

	function ListShape(shape, options) {
	  var self = this, firstInit = !this.isShape;
	  CompositeShape.apply(this, arguments);

	  if (firstInit) {
	    property(this, 'defaultValue', function() { return []; });
	  }

	  if (shape.member) {
	    memoizedProperty(this, 'member', function() {
	      return Shape.create(shape.member, options);
	    });
	  }

	  if (this.flattened) {
	    var oldName = this.name;
	    memoizedProperty(this, 'name', function() {
	      return self.member.name || oldName;
	    });
	  }
	}

	function MapShape(shape, options) {
	  var firstInit = !this.isShape;
	  CompositeShape.apply(this, arguments);

	  if (firstInit) {
	    property(this, 'defaultValue', function() { return {}; });
	    property(this, 'key', Shape.create({type: 'string'}, options));
	    property(this, 'value', Shape.create({type: 'string'}, options));
	  }

	  if (shape.key) {
	    memoizedProperty(this, 'key', function() {
	      return Shape.create(shape.key, options);
	    });
	  }
	  if (shape.value) {
	    memoizedProperty(this, 'value', function() {
	      return Shape.create(shape.value, options);
	    });
	  }
	}

	function TimestampShape(shape) {
	  var self = this;
	  Shape.apply(this, arguments);

	  if (shape.timestampFormat) {
	    property(this, 'timestampFormat', shape.timestampFormat);
	  } else if (self.isTimestampFormatSet && this.timestampFormat) {
	    property(this, 'timestampFormat', this.timestampFormat);
	  } else if (this.location === 'header') {
	    property(this, 'timestampFormat', 'rfc822');
	  } else if (this.location === 'querystring') {
	    property(this, 'timestampFormat', 'iso8601');
	  } else if (this.api) {
	    switch (this.api.protocol) {
	      case 'json':
	      case 'rest-json':
	        property(this, 'timestampFormat', 'unixTimestamp');
	        break;
	      case 'rest-xml':
	      case 'query':
	      case 'ec2':
	        property(this, 'timestampFormat', 'iso8601');
	        break;
	    }
	  }

	  this.toType = function(value) {
	    if (value === null || value === undefined) return null;
	    if (typeof value.toUTCString === 'function') return value;
	    return typeof value === 'string' || typeof value === 'number' ?
	           util.date.parseTimestamp(value) : null;
	  };

	  this.toWireFormat = function(value) {
	    return util.date.format(value, self.timestampFormat);
	  };
	}

	function StringShape() {
	  Shape.apply(this, arguments);

	  var nullLessProtocols = ['rest-xml', 'query', 'ec2'];
	  this.toType = function(value) {
	    value = this.api && nullLessProtocols.indexOf(this.api.protocol) > -1 ?
	      value || '' : value;
	    if (this.isJsonValue) {
	      return JSON.parse(value);
	    }

	    return value && typeof value.toString === 'function' ?
	      value.toString() : value;
	  };

	  this.toWireFormat = function(value) {
	    return this.isJsonValue ? JSON.stringify(value) : value;
	  };
	}

	function FloatShape() {
	  Shape.apply(this, arguments);

	  this.toType = function(value) {
	    if (value === null || value === undefined) return null;
	    return parseFloat(value);
	  };
	  this.toWireFormat = this.toType;
	}

	function IntegerShape() {
	  Shape.apply(this, arguments);

	  this.toType = function(value) {
	    if (value === null || value === undefined) return null;
	    return parseInt(value, 10);
	  };
	  this.toWireFormat = this.toType;
	}

	function BinaryShape() {
	  Shape.apply(this, arguments);
	  this.toType = function(value) {
	    var buf = util.base64.decode(value);
	    if (this.isSensitive && util.isNode() && typeof util.Buffer.alloc === 'function') {
	  /* Node.js can create a Buffer that is not isolated.
	   * i.e. buf.byteLength !== buf.buffer.byteLength
	   * This means that the sensitive data is accessible to anyone with access to buf.buffer.
	   * If this is the node shared Buffer, then other code within this process _could_ find this secret.
	   * Copy sensitive data to an isolated Buffer and zero the sensitive data.
	   * While this is safe to do here, copying this code somewhere else may produce unexpected results.
	   */
	      var secureBuf = util.Buffer.alloc(buf.length, buf);
	      buf.fill(0);
	      buf = secureBuf;
	    }
	    return buf;
	  };
	  this.toWireFormat = util.base64.encode;
	}

	function Base64Shape() {
	  BinaryShape.apply(this, arguments);
	}

	function BooleanShape() {
	  Shape.apply(this, arguments);

	  this.toType = function(value) {
	    if (typeof value === 'boolean') return value;
	    if (value === null || value === undefined) return null;
	    return value === 'true';
	  };
	}

	/**
	 * @api private
	 */
	Shape.shapes = {
	  StructureShape: StructureShape,
	  ListShape: ListShape,
	  MapShape: MapShape,
	  StringShape: StringShape,
	  BooleanShape: BooleanShape,
	  Base64Shape: Base64Shape
	};

	/**
	 * @api private
	 */
	module.exports = Shape;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var memoizedProperty = __webpack_require__(2).memoizedProperty;

	function memoize(name, value, factory, nameTr) {
	  memoizedProperty(this, nameTr(name), function() {
	    return factory(name, value);
	  });
	}

	function Collection(iterable, options, factory, nameTr, callback) {
	  nameTr = nameTr || String;
	  var self = this;

	  for (var id in iterable) {
	    if (Object.prototype.hasOwnProperty.call(iterable, id)) {
	      memoize.call(self, id, iterable[id], factory, nameTr);
	      if (callback) callback(id, iterable[id]);
	    }
	  }
	}

	/**
	 * @api private
	 */
	module.exports = Collection;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var populateHostPrefix = __webpack_require__(16).populateHostPrefix;

	function populateMethod(req) {
	  req.httpRequest.method = req.service.api.operations[req.operation].httpMethod;
	}

	function generateURI(endpointPath, operationPath, input, params) {
	  var uri = [endpointPath, operationPath].join('/');
	  uri = uri.replace(/\/+/g, '/');

	  var queryString = {}, queryStringSet = false;
	  util.each(input.members, function (name, member) {
	    var paramValue = params[name];
	    if (paramValue === null || paramValue === undefined) return;
	    if (member.location === 'uri') {
	      var regex = new RegExp('\\{' + member.name + '(\\+)?\\}');
	      uri = uri.replace(regex, function(_, plus) {
	        var fn = plus ? util.uriEscapePath : util.uriEscape;
	        return fn(String(paramValue));
	      });
	    } else if (member.location === 'querystring') {
	      queryStringSet = true;

	      if (member.type === 'list') {
	        queryString[member.name] = paramValue.map(function(val) {
	          return util.uriEscape(member.member.toWireFormat(val).toString());
	        });
	      } else if (member.type === 'map') {
	        util.each(paramValue, function(key, value) {
	          if (Array.isArray(value)) {
	            queryString[key] = value.map(function(val) {
	              return util.uriEscape(String(val));
	            });
	          } else {
	            queryString[key] = util.uriEscape(String(value));
	          }
	        });
	      } else {
	        queryString[member.name] = util.uriEscape(member.toWireFormat(paramValue).toString());
	      }
	    }
	  });

	  if (queryStringSet) {
	    uri += (uri.indexOf('?') >= 0 ? '&' : '?');
	    var parts = [];
	    util.arrayEach(Object.keys(queryString).sort(), function(key) {
	      if (!Array.isArray(queryString[key])) {
	        queryString[key] = [queryString[key]];
	      }
	      for (var i = 0; i < queryString[key].length; i++) {
	        parts.push(util.uriEscape(String(key)) + '=' + queryString[key][i]);
	      }
	    });
	    uri += parts.join('&');
	  }

	  return uri;
	}

	function populateURI(req) {
	  var operation = req.service.api.operations[req.operation];
	  var input = operation.input;

	  var uri = generateURI(req.httpRequest.endpoint.path, operation.httpPath, input, req.params);
	  req.httpRequest.path = uri;
	}

	function populateHeaders(req) {
	  var operation = req.service.api.operations[req.operation];
	  util.each(operation.input.members, function (name, member) {
	    var value = req.params[name];
	    if (value === null || value === undefined) return;

	    if (member.location === 'headers' && member.type === 'map') {
	      util.each(value, function(key, memberValue) {
	        req.httpRequest.headers[member.name + key] = memberValue;
	      });
	    } else if (member.location === 'header') {
	      value = member.toWireFormat(value).toString();
	      if (member.isJsonValue) {
	        value = util.base64.encode(value);
	      }
	      req.httpRequest.headers[member.name] = value;
	    }
	  });
	}

	function buildRequest(req) {
	  populateMethod(req);
	  populateURI(req);
	  populateHeaders(req);
	  populateHostPrefix(req);
	}

	function extractError() {
	}

	function extractData(resp) {
	  var req = resp.request;
	  var data = {};
	  var r = resp.httpResponse;
	  var operation = req.service.api.operations[req.operation];
	  var output = operation.output;

	  // normalize headers names to lower-cased keys for matching
	  var headers = {};
	  util.each(r.headers, function (k, v) {
	    headers[k.toLowerCase()] = v;
	  });

	  util.each(output.members, function(name, member) {
	    var header = (member.name || name).toLowerCase();
	    if (member.location === 'headers' && member.type === 'map') {
	      data[name] = {};
	      var location = member.isLocationName ? member.name : '';
	      var pattern = new RegExp('^' + location + '(.+)', 'i');
	      util.each(r.headers, function (k, v) {
	        var result = k.match(pattern);
	        if (result !== null) {
	          data[name][result[1]] = v;
	        }
	      });
	    } else if (member.location === 'header') {
	      if (headers[header] !== undefined) {
	        var value = member.isJsonValue ?
	          util.base64.decode(headers[header]) :
	          headers[header];
	        data[name] = member.toType(value);
	      }
	    } else if (member.location === 'statusCode') {
	      data[name] = parseInt(r.statusCode, 10);
	    }
	  });

	  resp.data = data;
	}

	/**
	 * @api private
	 */
	module.exports = {
	  buildRequest: buildRequest,
	  extractError: extractError,
	  extractData: extractData,
	  generateURI: generateURI
	};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var Rest = __webpack_require__(21);
	var Json = __webpack_require__(13);
	var JsonBuilder = __webpack_require__(14);
	var JsonParser = __webpack_require__(15);

	function populateBody(req) {
	  var builder = new JsonBuilder();
	  var input = req.service.api.operations[req.operation].input;

	  if (input.payload) {
	    var params = {};
	    var payloadShape = input.members[input.payload];
	    params = req.params[input.payload];

	    if (payloadShape.type === 'structure') {
	      req.httpRequest.body = builder.build(params || {}, payloadShape);
	      applyContentTypeHeader(req);
	    } else if (params !== undefined) {
	      // non-JSON payload
	      req.httpRequest.body = params;
	      if (payloadShape.type === 'binary' || payloadShape.isStreaming) {
	        applyContentTypeHeader(req, true);
	      }
	    }
	  } else {
	    req.httpRequest.body = builder.build(req.params, input);
	    applyContentTypeHeader(req);
	  }
	}

	function applyContentTypeHeader(req, isBinary) {
	  if (!req.httpRequest.headers['Content-Type']) {
	    var type = isBinary ? 'binary/octet-stream' : 'application/json';
	    req.httpRequest.headers['Content-Type'] = type;
	  }
	}

	function buildRequest(req) {
	  Rest.buildRequest(req);

	  // never send body payload on GET/HEAD/DELETE
	  if (['GET', 'HEAD', 'DELETE'].indexOf(req.httpRequest.method) < 0) {
	    populateBody(req);
	  }
	}

	function extractError(resp) {
	  Json.extractError(resp);
	}

	function extractData(resp) {
	  Rest.extractData(resp);

	  var req = resp.request;
	  var operation = req.service.api.operations[req.operation];
	  var rules = req.service.api.operations[req.operation].output || {};
	  var parser;
	  var hasEventOutput = operation.hasEventOutput;

	  if (rules.payload) {
	    var payloadMember = rules.members[rules.payload];
	    var body = resp.httpResponse.body;
	    if (payloadMember.isEventStream) {
	      parser = new JsonParser();
	      resp.data[payload] = util.createEventStream(
	        AWS.HttpClient.streamsApiVersion === 2 ? resp.httpResponse.stream : body,
	        parser,
	        payloadMember
	      );
	    } else if (payloadMember.type === 'structure' || payloadMember.type === 'list') {
	      var parser = new JsonParser();
	      resp.data[rules.payload] = parser.parse(body, payloadMember);
	    } else if (payloadMember.type === 'binary' || payloadMember.isStreaming) {
	      resp.data[rules.payload] = body;
	    } else {
	      resp.data[rules.payload] = payloadMember.toType(body);
	    }
	  } else {
	    var data = resp.data;
	    Json.extractData(resp);
	    resp.data = util.merge(data, resp.data);
	  }
	}

	/**
	 * @api private
	 */
	module.exports = {
	  buildRequest: buildRequest,
	  extractError: extractError,
	  extractData: extractData
	};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);
	var util = __webpack_require__(2);
	var Rest = __webpack_require__(21);

	function populateBody(req) {
	  var input = req.service.api.operations[req.operation].input;
	  var builder = new AWS.XML.Builder();
	  var params = req.params;

	  var payload = input.payload;
	  if (payload) {
	    var payloadMember = input.members[payload];
	    params = params[payload];
	    if (params === undefined) return;

	    if (payloadMember.type === 'structure') {
	      var rootElement = payloadMember.name;
	      req.httpRequest.body = builder.toXML(params, payloadMember, rootElement, true);
	    } else { // non-xml payload
	      req.httpRequest.body = params;
	    }
	  } else {
	    req.httpRequest.body = builder.toXML(params, input, input.name ||
	      input.shape || util.string.upperFirst(req.operation) + 'Request');
	  }
	}

	function buildRequest(req) {
	  Rest.buildRequest(req);

	  // never send body payload on GET/HEAD
	  if (['GET', 'HEAD'].indexOf(req.httpRequest.method) < 0) {
	    populateBody(req);
	  }
	}

	function extractError(resp) {
	  Rest.extractError(resp);

	  var data;
	  try {
	    data = new AWS.XML.Parser().parse(resp.httpResponse.body.toString());
	  } catch (e) {
	    data = {
	      Code: resp.httpResponse.statusCode,
	      Message: resp.httpResponse.statusMessage
	    };
	  }

	  if (data.Errors) data = data.Errors;
	  if (data.Error) data = data.Error;
	  if (data.Code) {
	    resp.error = util.error(new Error(), {
	      code: data.Code,
	      message: data.Message
	    });
	  } else {
	    resp.error = util.error(new Error(), {
	      code: resp.httpResponse.statusCode,
	      message: null
	    });
	  }
	}

	function extractData(resp) {
	  Rest.extractData(resp);

	  var parser;
	  var req = resp.request;
	  var body = resp.httpResponse.body;
	  var operation = req.service.api.operations[req.operation];
	  var output = operation.output;

	  var hasEventOutput = operation.hasEventOutput;

	  var payload = output.payload;
	  if (payload) {
	    var payloadMember = output.members[payload];
	    if (payloadMember.isEventStream) {
	      parser = new AWS.XML.Parser();
	      resp.data[payload] = util.createEventStream(
	        AWS.HttpClient.streamsApiVersion === 2 ? resp.httpResponse.stream : resp.httpResponse.body,
	        parser,
	        payloadMember
	      );
	    } else if (payloadMember.type === 'structure') {
	      parser = new AWS.XML.Parser();
	      resp.data[payload] = parser.parse(body.toString(), payloadMember);
	    } else if (payloadMember.type === 'binary' || payloadMember.isStreaming) {
	      resp.data[payload] = body;
	    } else {
	      resp.data[payload] = payloadMember.toType(body);
	    }
	  } else if (body.length > 0) {
	    parser = new AWS.XML.Parser();
	    var data = parser.parse(body.toString(), output);
	    util.update(resp.data, data);
	  }
	}

	/**
	 * @api private
	 */
	module.exports = {
	  buildRequest: buildRequest,
	  extractError: extractError,
	  extractData: extractData
	};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var XmlNode = __webpack_require__(25).XmlNode;
	var XmlText = __webpack_require__(27).XmlText;

	function XmlBuilder() { }

	XmlBuilder.prototype.toXML = function(params, shape, rootElement, noEmpty) {
	  var xml = new XmlNode(rootElement);
	  applyNamespaces(xml, shape, true);
	  serialize(xml, params, shape);
	  return xml.children.length > 0 || noEmpty ? xml.toString() : '';
	};

	function serialize(xml, value, shape) {
	  switch (shape.type) {
	    case 'structure': return serializeStructure(xml, value, shape);
	    case 'map': return serializeMap(xml, value, shape);
	    case 'list': return serializeList(xml, value, shape);
	    default: return serializeScalar(xml, value, shape);
	  }
	}

	function serializeStructure(xml, params, shape) {
	  util.arrayEach(shape.memberNames, function(memberName) {
	    var memberShape = shape.members[memberName];
	    if (memberShape.location !== 'body') return;

	    var value = params[memberName];
	    var name = memberShape.name;
	    if (value !== undefined && value !== null) {
	      if (memberShape.isXmlAttribute) {
	        xml.addAttribute(name, value);
	      } else if (memberShape.flattened) {
	        serialize(xml, value, memberShape);
	      } else {
	        var element = new XmlNode(name);
	        xml.addChildNode(element);
	        applyNamespaces(element, memberShape);
	        serialize(element, value, memberShape);
	      }
	    }
	  });
	}

	function serializeMap(xml, map, shape) {
	  var xmlKey = shape.key.name || 'key';
	  var xmlValue = shape.value.name || 'value';

	  util.each(map, function(key, value) {
	    var entry = new XmlNode(shape.flattened ? shape.name : 'entry');
	    xml.addChildNode(entry);

	    var entryKey = new XmlNode(xmlKey);
	    var entryValue = new XmlNode(xmlValue);
	    entry.addChildNode(entryKey);
	    entry.addChildNode(entryValue);

	    serialize(entryKey, key, shape.key);
	    serialize(entryValue, value, shape.value);
	  });
	}

	function serializeList(xml, list, shape) {
	  if (shape.flattened) {
	    util.arrayEach(list, function(value) {
	      var name = shape.member.name || shape.name;
	      var element = new XmlNode(name);
	      xml.addChildNode(element);
	      serialize(element, value, shape.member);
	    });
	  } else {
	    util.arrayEach(list, function(value) {
	      var name = shape.member.name || 'member';
	      var element = new XmlNode(name);
	      xml.addChildNode(element);
	      serialize(element, value, shape.member);
	    });
	  }
	}

	function serializeScalar(xml, value, shape) {
	  xml.addChildNode(
	    new XmlText(shape.toWireFormat(value))
	  );
	}

	function applyNamespaces(xml, shape, isRoot) {
	  var uri, prefix = 'xmlns';
	  if (shape.xmlNamespaceUri) {
	    uri = shape.xmlNamespaceUri;
	    if (shape.xmlNamespacePrefix) prefix += ':' + shape.xmlNamespacePrefix;
	  } else if (isRoot && shape.api.xmlNamespaceUri) {
	    uri = shape.api.xmlNamespaceUri;
	  }

	  if (uri) xml.addAttribute(prefix, uri);
	}

	/**
	 * @api private
	 */
	module.exports = XmlBuilder;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	var escapeAttribute = __webpack_require__(26).escapeAttribute;

	/**
	 * Represents an XML node.
	 * @api private
	 */
	function XmlNode(name, children) {
	    if (children === void 0) { children = []; }
	    this.name = name;
	    this.children = children;
	    this.attributes = {};
	}
	XmlNode.prototype.addAttribute = function (name, value) {
	    this.attributes[name] = value;
	    return this;
	};
	XmlNode.prototype.addChildNode = function (child) {
	    this.children.push(child);
	    return this;
	};
	XmlNode.prototype.removeAttribute = function (name) {
	    delete this.attributes[name];
	    return this;
	};
	XmlNode.prototype.toString = function () {
	    var hasChildren = Boolean(this.children.length);
	    var xmlText = '<' + this.name;
	    // add attributes
	    var attributes = this.attributes;
	    for (var i = 0, attributeNames = Object.keys(attributes); i < attributeNames.length; i++) {
	        var attributeName = attributeNames[i];
	        var attribute = attributes[attributeName];
	        if (typeof attribute !== 'undefined' && attribute !== null) {
	            xmlText += ' ' + attributeName + '=\"' + escapeAttribute('' + attribute) + '\"';
	        }
	    }
	    return xmlText += !hasChildren ? '/>' : '>' + this.children.map(function (c) { return c.toString(); }).join('') + '</' + this.name + '>';
	};

	/**
	 * @api private
	 */
	module.exports = {
	    XmlNode: XmlNode
	};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

	/**
	 * Escapes characters that can not be in an XML attribute.
	 */
	function escapeAttribute(value) {
	    return value.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	/**
	 * @api private
	 */
	module.exports = {
	    escapeAttribute: escapeAttribute
	};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	var escapeElement = __webpack_require__(28).escapeElement;

	/**
	 * Represents an XML text value.
	 * @api private
	 */
	function XmlText(value) {
	    this.value = value;
	}

	XmlText.prototype.toString = function () {
	    return escapeElement('' + this.value);
	};

	/**
	 * @api private
	 */
	module.exports = {
	    XmlText: XmlText
	};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

	/**
	 * Escapes characters that can not be in an XML element.
	 */
	function escapeElement(value) {
	    return value.replace(/&/g, '&amp;')
	                .replace(/</g, '&lt;')
	                .replace(/>/g, '&gt;')
	                .replace(/\r/g, '&#x0D;')
	                .replace(/\n/g, '&#x0A;')
	                .replace(/\u0085/g, '&#x85;')
	                .replace(/\u2028/, '&#x2028;');
	}

	/**
	 * @api private
	 */
	module.exports = {
	    escapeElement: escapeElement
	};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	var Collection = __webpack_require__(20);
	var Operation = __webpack_require__(30);
	var Shape = __webpack_require__(19);
	var Paginator = __webpack_require__(31);
	var ResourceWaiter = __webpack_require__(32);
	var metadata = __webpack_require__(7);

	var util = __webpack_require__(2);
	var property = util.property;
	var memoizedProperty = util.memoizedProperty;

	function Api(api, options) {
	  var self = this;
	  api = api || {};
	  options = options || {};
	  options.api = this;

	  api.metadata = api.metadata || {};

	  var serviceIdentifier = options.serviceIdentifier;
	  delete options.serviceIdentifier;

	  property(this, 'isApi', true, false);
	  property(this, 'apiVersion', api.metadata.apiVersion);
	  property(this, 'endpointPrefix', api.metadata.endpointPrefix);
	  property(this, 'signingName', api.metadata.signingName);
	  property(this, 'globalEndpoint', api.metadata.globalEndpoint);
	  property(this, 'signatureVersion', api.metadata.signatureVersion);
	  property(this, 'jsonVersion', api.metadata.jsonVersion);
	  property(this, 'targetPrefix', api.metadata.targetPrefix);
	  property(this, 'protocol', api.metadata.protocol);
	  property(this, 'timestampFormat', api.metadata.timestampFormat);
	  property(this, 'xmlNamespaceUri', api.metadata.xmlNamespace);
	  property(this, 'abbreviation', api.metadata.serviceAbbreviation);
	  property(this, 'fullName', api.metadata.serviceFullName);
	  property(this, 'serviceId', api.metadata.serviceId);
	  if (serviceIdentifier && metadata[serviceIdentifier]) {
	      property(this, 'xmlNoDefaultLists', metadata[serviceIdentifier].xmlNoDefaultLists, false);
	  }

	  memoizedProperty(this, 'className', function() {
	    var name = api.metadata.serviceAbbreviation || api.metadata.serviceFullName;
	    if (!name) return null;

	    name = name.replace(/^Amazon|AWS\s*|\(.*|\s+|\W+/g, '');
	    if (name === 'ElasticLoadBalancing') name = 'ELB';
	    return name;
	  });

	  function addEndpointOperation(name, operation) {
	    if (operation.endpointoperation === true) {
	      property(self, 'endpointOperation', util.string.lowerFirst(name));
	    }
	    if (operation.endpointdiscovery && !self.hasRequiredEndpointDiscovery) {
	      property(
	        self,
	        'hasRequiredEndpointDiscovery',
	        operation.endpointdiscovery.required === true
	      );
	    }
	  }

	  property(this, 'operations', new Collection(api.operations, options, function(name, operation) {
	    return new Operation(name, operation, options);
	  }, util.string.lowerFirst, addEndpointOperation));

	  property(this, 'shapes', new Collection(api.shapes, options, function(name, shape) {
	    return Shape.create(shape, options);
	  }));

	  property(this, 'paginators', new Collection(api.paginators, options, function(name, paginator) {
	    return new Paginator(name, paginator, options);
	  }));

	  property(this, 'waiters', new Collection(api.waiters, options, function(name, waiter) {
	    return new ResourceWaiter(name, waiter, options);
	  }, util.string.lowerFirst));

	  if (options.documentation) {
	    property(this, 'documentation', api.documentation);
	    property(this, 'documentationUrl', api.documentationUrl);
	  }
	}

	/**
	 * @api private
	 */
	module.exports = Api;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(19);

	var util = __webpack_require__(2);
	var property = util.property;
	var memoizedProperty = util.memoizedProperty;

	function Operation(name, operation, options) {
	  var self = this;
	  options = options || {};

	  property(this, 'name', operation.name || name);
	  property(this, 'api', options.api, false);

	  operation.http = operation.http || {};
	  property(this, 'endpoint', operation.endpoint);
	  property(this, 'httpMethod', operation.http.method || 'POST');
	  property(this, 'httpPath', operation.http.requestUri || '/');
	  property(this, 'authtype', operation.authtype || '');
	  property(
	    this,
	    'endpointDiscoveryRequired',
	    operation.endpointdiscovery ?
	      (operation.endpointdiscovery.required ? 'REQUIRED' : 'OPTIONAL') :
	    'NULL'
	  );
	  property(this, 'httpChecksumRequired', operation.httpChecksumRequired, false);

	  memoizedProperty(this, 'input', function() {
	    if (!operation.input) {
	      return new Shape.create({type: 'structure'}, options);
	    }
	    return Shape.create(operation.input, options);
	  });

	  memoizedProperty(this, 'output', function() {
	    if (!operation.output) {
	      return new Shape.create({type: 'structure'}, options);
	    }
	    return Shape.create(operation.output, options);
	  });

	  memoizedProperty(this, 'errors', function() {
	    var list = [];
	    if (!operation.errors) return null;

	    for (var i = 0; i < operation.errors.length; i++) {
	      list.push(Shape.create(operation.errors[i], options));
	    }

	    return list;
	  });

	  memoizedProperty(this, 'paginator', function() {
	    return options.api.paginators[name];
	  });

	  if (options.documentation) {
	    property(this, 'documentation', operation.documentation);
	    property(this, 'documentationUrl', operation.documentationUrl);
	  }

	  // idempotentMembers only tracks top-level input shapes
	  memoizedProperty(this, 'idempotentMembers', function() {
	    var idempotentMembers = [];
	    var input = self.input;
	    var members = input.members;
	    if (!input.members) {
	      return idempotentMembers;
	    }
	    for (var name in members) {
	      if (!members.hasOwnProperty(name)) {
	        continue;
	      }
	      if (members[name].isIdempotent === true) {
	        idempotentMembers.push(name);
	      }
	    }
	    return idempotentMembers;
	  });

	  memoizedProperty(this, 'hasEventOutput', function() {
	    var output = self.output;
	    return hasEventStream(output);
	  });
	}

	function hasEventStream(topLevelShape) {
	  var members = topLevelShape.members;
	  var payload = topLevelShape.payload;

	  if (!topLevelShape.members) {
	    return false;
	  }

	  if (payload) {
	    var payloadMember = members[payload];
	    return payloadMember.isEventStream;
	  }

	  // check if any member is an event stream
	  for (var name in members) {
	    if (!members.hasOwnProperty(name)) {
	      if (members[name].isEventStream === true) {
	        return true;
	      }
	    }
	  }
	  return false;
	}

	/**
	 * @api private
	 */
	module.exports = Operation;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	var property = __webpack_require__(2).property;

	function Paginator(name, paginator) {
	  property(this, 'inputToken', paginator.input_token);
	  property(this, 'limitKey', paginator.limit_key);
	  property(this, 'moreResults', paginator.more_results);
	  property(this, 'outputToken', paginator.output_token);
	  property(this, 'resultKey', paginator.result_key);
	}

	/**
	 * @api private
	 */
	module.exports = Paginator;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var property = util.property;

	function ResourceWaiter(name, waiter, options) {
	  options = options || {};
	  property(this, 'name', name);
	  property(this, 'api', options.api, false);

	  if (waiter.operation) {
	    property(this, 'operation', util.string.lowerFirst(waiter.operation));
	  }

	  var self = this;
	  var keys = [
	    'type',
	    'description',
	    'delay',
	    'maxAttempts',
	    'acceptors'
	  ];

	  keys.forEach(function(key) {
	    var value = waiter[key];
	    if (value) {
	      property(self, key, value);
	    }
	  });
	}

	/**
	 * @api private
	 */
	module.exports = ResourceWaiter;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

	function apiLoader(svc, version) {
	  if (!apiLoader.services.hasOwnProperty(svc)) {
	    throw new Error('InvalidService: Failed to load api for ' + svc);
	  }
	  return apiLoader.services[svc][version];
	}

	/**
	 * @api private
	 *
	 * This member of AWS.apiLoader is private, but changing it will necessitate a
	 * change to ../scripts/services-table-generator.ts
	 */
	apiLoader.services = {};

	/**
	 * @api private
	 */
	module.exports = apiLoader;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var LRU_1 = __webpack_require__(35);
	var CACHE_SIZE = 1000;
	/**
	 * Inspired node-lru-cache[https://github.com/isaacs/node-lru-cache]
	 */
	var EndpointCache = /** @class */ (function () {
	    function EndpointCache(maxSize) {
	        if (maxSize === void 0) { maxSize = CACHE_SIZE; }
	        this.maxSize = maxSize;
	        this.cache = new LRU_1.LRUCache(maxSize);
	    }
	    ;
	    Object.defineProperty(EndpointCache.prototype, "size", {
	        get: function () {
	            return this.cache.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    EndpointCache.prototype.put = function (key, value) {
	      var keyString = typeof key !== 'string' ? EndpointCache.getKeyString(key) : key;
	        var endpointRecord = this.populateValue(value);
	        this.cache.put(keyString, endpointRecord);
	    };
	    EndpointCache.prototype.get = function (key) {
	      var keyString = typeof key !== 'string' ? EndpointCache.getKeyString(key) : key;
	        var now = Date.now();
	        var records = this.cache.get(keyString);
	        if (records) {
	            for (var i = records.length-1; i >= 0; i--) {
	                var record = records[i];
	                if (record.Expire < now) {
	                    records.splice(i, 1);
	                }
	            }
	            if (records.length === 0) {
	                this.cache.remove(keyString);
	                return undefined;
	            }
	        }
	        return records;
	    };
	    EndpointCache.getKeyString = function (key) {
	        var identifiers = [];
	        var identifierNames = Object.keys(key).sort();
	        for (var i = 0; i < identifierNames.length; i++) {
	            var identifierName = identifierNames[i];
	            if (key[identifierName] === undefined)
	                continue;
	            identifiers.push(key[identifierName]);
	        }
	        return identifiers.join(' ');
	    };
	    EndpointCache.prototype.populateValue = function (endpoints) {
	        var now = Date.now();
	        return endpoints.map(function (endpoint) { return ({
	            Address: endpoint.Address || '',
	            Expire: now + (endpoint.CachePeriodInMinutes || 1) * 60 * 1000
	        }); });
	    };
	    EndpointCache.prototype.empty = function () {
	        this.cache.empty();
	    };
	    EndpointCache.prototype.remove = function (key) {
	      var keyString = typeof key !== 'string' ? EndpointCache.getKeyString(key) : key;
	        this.cache.remove(keyString);
	    };
	    return EndpointCache;
	}());
	exports.EndpointCache = EndpointCache;

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var LinkedListNode = /** @class */ (function () {
	    function LinkedListNode(key, value) {
	        this.key = key;
	        this.value = value;
	    }
	    return LinkedListNode;
	}());
	var LRUCache = /** @class */ (function () {
	    function LRUCache(size) {
	        this.nodeMap = {};
	        this.size = 0;
	        if (typeof size !== 'number' || size < 1) {
	            throw new Error('Cache size can only be positive number');
	        }
	        this.sizeLimit = size;
	    }
	    Object.defineProperty(LRUCache.prototype, "length", {
	        get: function () {
	            return this.size;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    LRUCache.prototype.prependToList = function (node) {
	        if (!this.headerNode) {
	            this.tailNode = node;
	        }
	        else {
	            this.headerNode.prev = node;
	            node.next = this.headerNode;
	        }
	        this.headerNode = node;
	        this.size++;
	    };
	    LRUCache.prototype.removeFromTail = function () {
	        if (!this.tailNode) {
	            return undefined;
	        }
	        var node = this.tailNode;
	        var prevNode = node.prev;
	        if (prevNode) {
	            prevNode.next = undefined;
	        }
	        node.prev = undefined;
	        this.tailNode = prevNode;
	        this.size--;
	        return node;
	    };
	    LRUCache.prototype.detachFromList = function (node) {
	        if (this.headerNode === node) {
	            this.headerNode = node.next;
	        }
	        if (this.tailNode === node) {
	            this.tailNode = node.prev;
	        }
	        if (node.prev) {
	            node.prev.next = node.next;
	        }
	        if (node.next) {
	            node.next.prev = node.prev;
	        }
	        node.next = undefined;
	        node.prev = undefined;
	        this.size--;
	    };
	    LRUCache.prototype.get = function (key) {
	        if (this.nodeMap[key]) {
	            var node = this.nodeMap[key];
	            this.detachFromList(node);
	            this.prependToList(node);
	            return node.value;
	        }
	    };
	    LRUCache.prototype.remove = function (key) {
	        if (this.nodeMap[key]) {
	            var node = this.nodeMap[key];
	            this.detachFromList(node);
	            delete this.nodeMap[key];
	        }
	    };
	    LRUCache.prototype.put = function (key, value) {
	        if (this.nodeMap[key]) {
	            this.remove(key);
	        }
	        else if (this.size === this.sizeLimit) {
	            var tailNode = this.removeFromTail();
	            var key_1 = tailNode.key;
	            delete this.nodeMap[key_1];
	        }
	        var newNode = new LinkedListNode(key, value);
	        this.nodeMap[key] = newNode;
	        this.prependToList(newNode);
	    };
	    LRUCache.prototype.empty = function () {
	        var keys = Object.keys(this.nodeMap);
	        for (var i = 0; i < keys.length; i++) {
	            var key = keys[i];
	            var node = this.nodeMap[key];
	            this.detachFromList(node);
	            delete this.nodeMap[key];
	        }
	    };
	    return LRUCache;
	}());
	exports.LRUCache = LRUCache;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);

	/**
	 * @api private
	 * @!method on(eventName, callback)
	 *   Registers an event listener callback for the event given by `eventName`.
	 *   Parameters passed to the callback function depend on the individual event
	 *   being triggered. See the event documentation for those parameters.
	 *
	 *   @param eventName [String] the event name to register the listener for
	 *   @param callback [Function] the listener callback function
	 *   @param toHead [Boolean] attach the listener callback to the head of callback array if set to true.
	 *     Default to be false.
	 *   @return [AWS.SequentialExecutor] the same object for chaining
	 */
	AWS.SequentialExecutor = AWS.util.inherit({

	  constructor: function SequentialExecutor() {
	    this._events = {};
	  },

	  /**
	   * @api private
	   */
	  listeners: function listeners(eventName) {
	    return this._events[eventName] ? this._events[eventName].slice(0) : [];
	  },

	  on: function on(eventName, listener, toHead) {
	    if (this._events[eventName]) {
	      toHead ?
	        this._events[eventName].unshift(listener) :
	        this._events[eventName].push(listener);
	    } else {
	      this._events[eventName] = [listener];
	    }
	    return this;
	  },

	  onAsync: function onAsync(eventName, listener, toHead) {
	    listener._isAsync = true;
	    return this.on(eventName, listener, toHead);
	  },

	  removeListener: function removeListener(eventName, listener) {
	    var listeners = this._events[eventName];
	    if (listeners) {
	      var length = listeners.length;
	      var position = -1;
	      for (var i = 0; i < length; ++i) {
	        if (listeners[i] === listener) {
	          position = i;
	        }
	      }
	      if (position > -1) {
	        listeners.splice(position, 1);
	      }
	    }
	    return this;
	  },

	  removeAllListeners: function removeAllListeners(eventName) {
	    if (eventName) {
	      delete this._events[eventName];
	    } else {
	      this._events = {};
	    }
	    return this;
	  },

	  /**
	   * @api private
	   */
	  emit: function emit(eventName, eventArgs, doneCallback) {
	    if (!doneCallback) doneCallback = function() { };
	    var listeners = this.listeners(eventName);
	    var count = listeners.length;
	    this.callListeners(listeners, eventArgs, doneCallback);
	    return count > 0;
	  },

	  /**
	   * @api private
	   */
	  callListeners: function callListeners(listeners, args, doneCallback, prevError) {
	    var self = this;
	    var error = prevError || null;

	    function callNextListener(err) {
	      if (err) {
	        error = AWS.util.error(error || new Error(), err);
	        if (self._haltHandlersOnError) {
	          return doneCallback.call(self, error);
	        }
	      }
	      self.callListeners(listeners, args, doneCallback, error);
	    }

	    while (listeners.length > 0) {
	      var listener = listeners.shift();
	      if (listener._isAsync) { // asynchronous listener
	        listener.apply(self, args.concat([callNextListener]));
	        return; // stop here, callNextListener will continue
	      } else { // synchronous listener
	        try {
	          listener.apply(self, args);
	        } catch (err) {
	          error = AWS.util.error(error || new Error(), err);
	        }
	        if (error && self._haltHandlersOnError) {
	          doneCallback.call(self, error);
	          return;
	        }
	      }
	    }
	    doneCallback.call(self, error);
	  },

	  /**
	   * Adds or copies a set of listeners from another list of
	   * listeners or SequentialExecutor object.
	   *
	   * @param listeners [map<String,Array<Function>>, AWS.SequentialExecutor]
	   *   a list of events and callbacks, or an event emitter object
	   *   containing listeners to add to this emitter object.
	   * @return [AWS.SequentialExecutor] the emitter object, for chaining.
	   * @example Adding listeners from a map of listeners
	   *   emitter.addListeners({
	   *     event1: [function() { ... }, function() { ... }],
	   *     event2: [function() { ... }]
	   *   });
	   *   emitter.emit('event1'); // emitter has event1
	   *   emitter.emit('event2'); // emitter has event2
	   * @example Adding listeners from another emitter object
	   *   var emitter1 = new AWS.SequentialExecutor();
	   *   emitter1.on('event1', function() { ... });
	   *   emitter1.on('event2', function() { ... });
	   *   var emitter2 = new AWS.SequentialExecutor();
	   *   emitter2.addListeners(emitter1);
	   *   emitter2.emit('event1'); // emitter2 has event1
	   *   emitter2.emit('event2'); // emitter2 has event2
	   */
	  addListeners: function addListeners(listeners) {
	    var self = this;

	    // extract listeners if parameter is an SequentialExecutor object
	    if (listeners._events) listeners = listeners._events;

	    AWS.util.each(listeners, function(event, callbacks) {
	      if (typeof callbacks === 'function') callbacks = [callbacks];
	      AWS.util.arrayEach(callbacks, function(callback) {
	        self.on(event, callback);
	      });
	    });

	    return self;
	  },

	  /**
	   * Registers an event with {on} and saves the callback handle function
	   * as a property on the emitter object using a given `name`.
	   *
	   * @param name [String] the property name to set on this object containing
	   *   the callback function handle so that the listener can be removed in
	   *   the future.
	   * @param (see on)
	   * @return (see on)
	   * @example Adding a named listener DATA_CALLBACK
	   *   var listener = function() { doSomething(); };
	   *   emitter.addNamedListener('DATA_CALLBACK', 'data', listener);
	   *
	   *   // the following prints: true
	   *   console.log(emitter.DATA_CALLBACK == listener);
	   */
	  addNamedListener: function addNamedListener(name, eventName, callback, toHead) {
	    this[name] = callback;
	    this.addListener(eventName, callback, toHead);
	    return this;
	  },

	  /**
	   * @api private
	   */
	  addNamedAsyncListener: function addNamedAsyncListener(name, eventName, callback, toHead) {
	    callback._isAsync = true;
	    return this.addNamedListener(name, eventName, callback, toHead);
	  },

	  /**
	   * Helper method to add a set of named listeners using
	   * {addNamedListener}. The callback contains a parameter
	   * with a handle to the `addNamedListener` method.
	   *
	   * @callback callback function(add)
	   *   The callback function is called immediately in order to provide
	   *   the `add` function to the block. This simplifies the addition of
	   *   a large group of named listeners.
	   *   @param add [Function] the {addNamedListener} function to call
	   *     when registering listeners.
	   * @example Adding a set of named listeners
	   *   emitter.addNamedListeners(function(add) {
	   *     add('DATA_CALLBACK', 'data', function() { ... });
	   *     add('OTHER', 'otherEvent', function() { ... });
	   *     add('LAST', 'lastEvent', function() { ... });
	   *   });
	   *
	   *   // these properties are now set:
	   *   emitter.DATA_CALLBACK;
	   *   emitter.OTHER;
	   *   emitter.LAST;
	   */
	  addNamedListeners: function addNamedListeners(callback) {
	    var self = this;
	    callback(
	      function() {
	        self.addNamedListener.apply(self, arguments);
	      },
	      function() {
	        self.addNamedAsyncListener.apply(self, arguments);
	      }
	    );
	    return this;
	  }
	});

	/**
	 * {on} is the prefered method.
	 * @api private
	 */
	AWS.SequentialExecutor.prototype.addListener = AWS.SequentialExecutor.prototype.on;

	/**
	 * @api private
	 */
	module.exports = AWS.SequentialExecutor;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var AWS = __webpack_require__(1);
	var Api = __webpack_require__(29);
	var regionConfig = __webpack_require__(38);

	var inherit = AWS.util.inherit;
	var clientCount = 0;
	var region_utils = __webpack_require__(40);

	/**
	 * The service class representing an AWS service.
	 *
	 * @class_abstract This class is an abstract class.
	 *
	 * @!attribute apiVersions
	 *   @return [Array<String>] the list of API versions supported by this service.
	 *   @readonly
	 */
	AWS.Service = inherit({
	  /**
	   * Create a new service object with a configuration object
	   *
	   * @param config [map] a map of configuration options
	   */
	  constructor: function Service(config) {
	    if (!this.loadServiceClass) {
	      throw AWS.util.error(new Error(),
	        'Service must be constructed with `new\' operator');
	    }

	    if (config) {
	      if (config.region) {
	        var region = config.region;
	        if (region_utils.isFipsRegion(region)) {
	          config.region = region_utils.getRealRegion(region);
	          config.useFipsEndpoint = true;
	        }
	        if (region_utils.isGlobalRegion(region)) {
	          config.region = region_utils.getRealRegion(region);
	        }
	      }
	      if (typeof config.useDualstack === 'boolean'
	        && typeof config.useDualstackEndpoint !== 'boolean') {
	        config.useDualstackEndpoint = config.useDualstack;
	      }
	    }

	    var ServiceClass = this.loadServiceClass(config || {});
	    if (ServiceClass) {
	      var originalConfig = AWS.util.copy(config);
	      var svc = new ServiceClass(config);
	      Object.defineProperty(svc, '_originalConfig', {
	        get: function() { return originalConfig; },
	        enumerable: false,
	        configurable: true
	      });
	      svc._clientId = ++clientCount;
	      return svc;
	    }
	    this.initialize(config);
	  },

	  /**
	   * @api private
	   */
	  initialize: function initialize(config) {
	    var svcConfig = AWS.config[this.serviceIdentifier];
	    this.config = new AWS.Config(AWS.config);
	    if (svcConfig) this.config.update(svcConfig, true);
	    if (config) this.config.update(config, true);

	    this.validateService();
	    if (!this.config.endpoint) regionConfig.configureEndpoint(this);

	    this.config.endpoint = this.endpointFromTemplate(this.config.endpoint);
	    this.setEndpoint(this.config.endpoint);
	    //enable attaching listeners to service client
	    AWS.SequentialExecutor.call(this);
	    AWS.Service.addDefaultMonitoringListeners(this);
	    if ((this.config.clientSideMonitoring || AWS.Service._clientSideMonitoring) && this.publisher) {
	      var publisher = this.publisher;
	      this.addNamedListener('PUBLISH_API_CALL', 'apiCall', function PUBLISH_API_CALL(event) {
	        process.nextTick(function() {publisher.eventHandler(event);});
	      });
	      this.addNamedListener('PUBLISH_API_ATTEMPT', 'apiCallAttempt', function PUBLISH_API_ATTEMPT(event) {
	        process.nextTick(function() {publisher.eventHandler(event);});
	      });
	    }
	  },

	  /**
	   * @api private
	   */
	  validateService: function validateService() {
	  },

	  /**
	   * @api private
	   */
	  loadServiceClass: function loadServiceClass(serviceConfig) {
	    var config = serviceConfig;
	    if (!AWS.util.isEmpty(this.api)) {
	      return null;
	    } else if (config.apiConfig) {
	      return AWS.Service.defineServiceApi(this.constructor, config.apiConfig);
	    } else if (!this.constructor.services) {
	      return null;
	    } else {
	      config = new AWS.Config(AWS.config);
	      config.update(serviceConfig, true);
	      var version = config.apiVersions[this.constructor.serviceIdentifier];
	      version = version || config.apiVersion;
	      return this.getLatestServiceClass(version);
	    }
	  },

	  /**
	   * @api private
	   */
	  getLatestServiceClass: function getLatestServiceClass(version) {
	    version = this.getLatestServiceVersion(version);
	    if (this.constructor.services[version] === null) {
	      AWS.Service.defineServiceApi(this.constructor, version);
	    }

	    return this.constructor.services[version];
	  },

	  /**
	   * @api private
	   */
	  getLatestServiceVersion: function getLatestServiceVersion(version) {
	    if (!this.constructor.services || this.constructor.services.length === 0) {
	      throw new Error('No services defined on ' +
	                      this.constructor.serviceIdentifier);
	    }

	    if (!version) {
	      version = 'latest';
	    } else if (AWS.util.isType(version, Date)) {
	      version = AWS.util.date.iso8601(version).split('T')[0];
	    }

	    if (Object.hasOwnProperty(this.constructor.services, version)) {
	      return version;
	    }

	    var keys = Object.keys(this.constructor.services).sort();
	    var selectedVersion = null;
	    for (var i = keys.length - 1; i >= 0; i--) {
	      // versions that end in "*" are not available on disk and can be
	      // skipped, so do not choose these as selectedVersions
	      if (keys[i][keys[i].length - 1] !== '*') {
	        selectedVersion = keys[i];
	      }
	      if (keys[i].substr(0, 10) <= version) {
	        return selectedVersion;
	      }
	    }

	    throw new Error('Could not find ' + this.constructor.serviceIdentifier +
	                    ' API to satisfy version constraint `' + version + '\'');
	  },

	  /**
	   * @api private
	   */
	  api: {},

	  /**
	   * @api private
	   */
	  defaultRetryCount: 3,

	  /**
	   * @api private
	   */
	  customizeRequests: function customizeRequests(callback) {
	    if (!callback) {
	      this.customRequestHandler = null;
	    } else if (typeof callback === 'function') {
	      this.customRequestHandler = callback;
	    } else {
	      throw new Error('Invalid callback type \'' + typeof callback + '\' provided in customizeRequests');
	    }
	  },

	  /**
	   * Calls an operation on a service with the given input parameters.
	   *
	   * @param operation [String] the name of the operation to call on the service.
	   * @param params [map] a map of input options for the operation
	   * @callback callback function(err, data)
	   *   If a callback is supplied, it is called when a response is returned
	   *   from the service.
	   *   @param err [Error] the error object returned from the request.
	   *     Set to `null` if the request is successful.
	   *   @param data [Object] the de-serialized data returned from
	   *     the request. Set to `null` if a request error occurs.
	   */
	  makeRequest: function makeRequest(operation, params, callback) {
	    if (typeof params === 'function') {
	      callback = params;
	      params = null;
	    }

	    params = params || {};
	    if (this.config.params) { // copy only toplevel bound params
	      var rules = this.api.operations[operation];
	      if (rules) {
	        params = AWS.util.copy(params);
	        AWS.util.each(this.config.params, function(key, value) {
	          if (rules.input.members[key]) {
	            if (params[key] === undefined || params[key] === null) {
	              params[key] = value;
	            }
	          }
	        });
	      }
	    }

	    var request = new AWS.Request(this, operation, params);
	    this.addAllRequestListeners(request);
	    this.attachMonitoringEmitter(request);
	    if (callback) request.send(callback);
	    return request;
	  },

	  /**
	   * Calls an operation on a service with the given input parameters, without
	   * any authentication data. This method is useful for "public" API operations.
	   *
	   * @param operation [String] the name of the operation to call on the service.
	   * @param params [map] a map of input options for the operation
	   * @callback callback function(err, data)
	   *   If a callback is supplied, it is called when a response is returned
	   *   from the service.
	   *   @param err [Error] the error object returned from the request.
	   *     Set to `null` if the request is successful.
	   *   @param data [Object] the de-serialized data returned from
	   *     the request. Set to `null` if a request error occurs.
	   */
	  makeUnauthenticatedRequest: function makeUnauthenticatedRequest(operation, params, callback) {
	    if (typeof params === 'function') {
	      callback = params;
	      params = {};
	    }

	    var request = this.makeRequest(operation, params).toUnauthenticated();
	    return callback ? request.send(callback) : request;
	  },

	  /**
	   * Waits for a given state
	   *
	   * @param state [String] the state on the service to wait for
	   * @param params [map] a map of parameters to pass with each request
	   * @option params $waiter [map] a map of configuration options for the waiter
	   * @option params $waiter.delay [Number] The number of seconds to wait between
	   *                                       requests
	   * @option params $waiter.maxAttempts [Number] The maximum number of requests
	   *                                             to send while waiting
	   * @callback callback function(err, data)
	   *   If a callback is supplied, it is called when a response is returned
	   *   from the service.
	   *   @param err [Error] the error object returned from the request.
	   *     Set to `null` if the request is successful.
	   *   @param data [Object] the de-serialized data returned from
	   *     the request. Set to `null` if a request error occurs.
	   */
	  waitFor: function waitFor(state, params, callback) {
	    var waiter = new AWS.ResourceWaiter(this, state);
	    return waiter.wait(params, callback);
	  },

	  /**
	   * @api private
	   */
	  addAllRequestListeners: function addAllRequestListeners(request) {
	    var list = [AWS.events, AWS.EventListeners.Core, this.serviceInterface(),
	                AWS.EventListeners.CorePost];
	    for (var i = 0; i < list.length; i++) {
	      if (list[i]) request.addListeners(list[i]);
	    }

	    // disable parameter validation
	    if (!this.config.paramValidation) {
	      request.removeListener('validate',
	        AWS.EventListeners.Core.VALIDATE_PARAMETERS);
	    }

	    if (this.config.logger) { // add logging events
	      request.addListeners(AWS.EventListeners.Logger);
	    }

	    this.setupRequestListeners(request);
	    // call prototype's customRequestHandler
	    if (typeof this.constructor.prototype.customRequestHandler === 'function') {
	      this.constructor.prototype.customRequestHandler(request);
	    }
	    // call instance's customRequestHandler
	    if (Object.prototype.hasOwnProperty.call(this, 'customRequestHandler') && typeof this.customRequestHandler === 'function') {
	      this.customRequestHandler(request);
	    }
	  },

	  /**
	   * Event recording metrics for a whole API call.
	   * @returns {object} a subset of api call metrics
	   * @api private
	   */
	  apiCallEvent: function apiCallEvent(request) {
	    var api = request.service.api.operations[request.operation];
	    var monitoringEvent = {
	      Type: 'ApiCall',
	      Api: api ? api.name : request.operation,
	      Version: 1,
	      Service: request.service.api.serviceId || request.service.api.endpointPrefix,
	      Region: request.httpRequest.region,
	      MaxRetriesExceeded: 0,
	      UserAgent: request.httpRequest.getUserAgent(),
	    };
	    var response = request.response;
	    if (response.httpResponse.statusCode) {
	      monitoringEvent.FinalHttpStatusCode = response.httpResponse.statusCode;
	    }
	    if (response.error) {
	      var error = response.error;
	      var statusCode = response.httpResponse.statusCode;
	      if (statusCode > 299) {
	        if (error.code) monitoringEvent.FinalAwsException = error.code;
	        if (error.message) monitoringEvent.FinalAwsExceptionMessage = error.message;
	      } else {
	        if (error.code || error.name) monitoringEvent.FinalSdkException = error.code || error.name;
	        if (error.message) monitoringEvent.FinalSdkExceptionMessage = error.message;
	      }
	    }
	    return monitoringEvent;
	  },

	  /**
	   * Event recording metrics for an API call attempt.
	   * @returns {object} a subset of api call attempt metrics
	   * @api private
	   */
	  apiAttemptEvent: function apiAttemptEvent(request) {
	    var api = request.service.api.operations[request.operation];
	    var monitoringEvent = {
	      Type: 'ApiCallAttempt',
	      Api: api ? api.name : request.operation,
	      Version: 1,
	      Service: request.service.api.serviceId || request.service.api.endpointPrefix,
	      Fqdn: request.httpRequest.endpoint.hostname,
	      UserAgent: request.httpRequest.getUserAgent(),
	    };
	    var response = request.response;
	    if (response.httpResponse.statusCode) {
	      monitoringEvent.HttpStatusCode = response.httpResponse.statusCode;
	    }
	    if (
	      !request._unAuthenticated &&
	      request.service.config.credentials &&
	      request.service.config.credentials.accessKeyId
	    ) {
	      monitoringEvent.AccessKey = request.service.config.credentials.accessKeyId;
	    }
	    if (!response.httpResponse.headers) return monitoringEvent;
	    if (request.httpRequest.headers['x-amz-security-token']) {
	      monitoringEvent.SessionToken = request.httpRequest.headers['x-amz-security-token'];
	    }
	    if (response.httpResponse.headers['x-amzn-requestid']) {
	      monitoringEvent.XAmznRequestId = response.httpResponse.headers['x-amzn-requestid'];
	    }
	    if (response.httpResponse.headers['x-amz-request-id']) {
	      monitoringEvent.XAmzRequestId = response.httpResponse.headers['x-amz-request-id'];
	    }
	    if (response.httpResponse.headers['x-amz-id-2']) {
	      monitoringEvent.XAmzId2 = response.httpResponse.headers['x-amz-id-2'];
	    }
	    return monitoringEvent;
	  },

	  /**
	   * Add metrics of failed request.
	   * @api private
	   */
	  attemptFailEvent: function attemptFailEvent(request) {
	    var monitoringEvent = this.apiAttemptEvent(request);
	    var response = request.response;
	    var error = response.error;
	    if (response.httpResponse.statusCode > 299 ) {
	      if (error.code) monitoringEvent.AwsException = error.code;
	      if (error.message) monitoringEvent.AwsExceptionMessage = error.message;
	    } else {
	      if (error.code || error.name) monitoringEvent.SdkException = error.code || error.name;
	      if (error.message) monitoringEvent.SdkExceptionMessage = error.message;
	    }
	    return monitoringEvent;
	  },

	  /**
	   * Attach listeners to request object to fetch metrics of each request
	   * and emit data object through \'ApiCall\' and \'ApiCallAttempt\' events.
	   * @api private
	   */
	  attachMonitoringEmitter: function attachMonitoringEmitter(request) {
	    var attemptTimestamp; //timestamp marking the beginning of a request attempt
	    var attemptStartRealTime; //Start time of request attempt. Used to calculating attemptLatency
	    var attemptLatency; //latency from request sent out to http response reaching SDK
	    var callStartRealTime; //Start time of API call. Used to calculating API call latency
	    var attemptCount = 0; //request.retryCount is not reliable here
	    var region; //region cache region for each attempt since it can be updated in plase (e.g. s3)
	    var callTimestamp; //timestamp when the request is created
	    var self = this;
	    var addToHead = true;

	    request.on('validate', function () {
	      callStartRealTime = AWS.util.realClock.now();
	      callTimestamp = Date.now();
	    }, addToHead);
	    request.on('sign', function () {
	      attemptStartRealTime = AWS.util.realClock.now();
	      attemptTimestamp = Date.now();
	      region = request.httpRequest.region;
	      attemptCount++;
	    }, addToHead);
	    request.on('validateResponse', function() {
	      attemptLatency = Math.round(AWS.util.realClock.now() - attemptStartRealTime);
	    });
	    request.addNamedListener('API_CALL_ATTEMPT', 'success', function API_CALL_ATTEMPT() {
	      var apiAttemptEvent = self.apiAttemptEvent(request);
	      apiAttemptEvent.Timestamp = attemptTimestamp;
	      apiAttemptEvent.AttemptLatency = attemptLatency >= 0 ? attemptLatency : 0;
	      apiAttemptEvent.Region = region;
	      self.emit('apiCallAttempt', [apiAttemptEvent]);
	    });
	    request.addNamedListener('API_CALL_ATTEMPT_RETRY', 'retry', function API_CALL_ATTEMPT_RETRY() {
	      var apiAttemptEvent = self.attemptFailEvent(request);
	      apiAttemptEvent.Timestamp = attemptTimestamp;
	      //attemptLatency may not be available if fail before response
	      attemptLatency = attemptLatency ||
	        Math.round(AWS.util.realClock.now() - attemptStartRealTime);
	      apiAttemptEvent.AttemptLatency = attemptLatency >= 0 ? attemptLatency : 0;
	      apiAttemptEvent.Region = region;
	      self.emit('apiCallAttempt', [apiAttemptEvent]);
	    });
	    request.addNamedListener('API_CALL', 'complete', function API_CALL() {
	      var apiCallEvent = self.apiCallEvent(request);
	      apiCallEvent.AttemptCount = attemptCount;
	      if (apiCallEvent.AttemptCount <= 0) return;
	      apiCallEvent.Timestamp = callTimestamp;
	      var latency = Math.round(AWS.util.realClock.now() - callStartRealTime);
	      apiCallEvent.Latency = latency >= 0 ? latency : 0;
	      var response = request.response;
	      if (
	        response.error &&
	        response.error.retryable &&
	        typeof response.retryCount === 'number' &&
	        typeof response.maxRetries === 'number' &&
	        (response.retryCount >= response.maxRetries)
	      ) {
	        apiCallEvent.MaxRetriesExceeded = 1;
	      }
	      self.emit('apiCall', [apiCallEvent]);
	    });
	  },

	  /**
	   * Override this method to setup any custom request listeners for each
	   * new request to the service.
	   *
	   * @method_abstract This is an abstract method.
	   */
	  setupRequestListeners: function setupRequestListeners(request) {
	  },

	  /**
	   * Gets the signing name for a given request
	   * @api private
	   */
	  getSigningName: function getSigningName() {
	    return this.api.signingName || this.api.endpointPrefix;
	  },

	  /**
	   * Gets the signer class for a given request
	   * @api private
	   */
	  getSignerClass: function getSignerClass(request) {
	    var version;
	    // get operation authtype if present
	    var operation = null;
	    var authtype = '';
	    if (request) {
	      var operations = request.service.api.operations || {};
	      operation = operations[request.operation] || null;
	      authtype = operation ? operation.authtype : '';
	    }
	    if (this.config.signatureVersion) {
	      version = this.config.signatureVersion;
	    } else if (authtype === 'v4' || authtype === 'v4-unsigned-body') {
	      version = 'v4';
	    } else {
	      version = this.api.signatureVersion;
	    }
	    return AWS.Signers.RequestSigner.getVersion(version);
	  },

	  /**
	   * @api private
	   */
	  serviceInterface: function serviceInterface() {
	    switch (this.api.protocol) {
	      case 'ec2': return AWS.EventListeners.Query;
	      case 'query': return AWS.EventListeners.Query;
	      case 'json': return AWS.EventListeners.Json;
	      case 'rest-json': return AWS.EventListeners.RestJson;
	      case 'rest-xml': return AWS.EventListeners.RestXml;
	    }
	    if (this.api.protocol) {
	      throw new Error('Invalid service `protocol\' ' +
	        this.api.protocol + ' in API config');
	    }
	  },

	  /**
	   * @api private
	   */
	  successfulResponse: function successfulResponse(resp) {
	    return resp.httpResponse.statusCode < 300;
	  },

	  /**
	   * How many times a failed request should be retried before giving up.
	   * the defaultRetryCount can be overriden by service classes.
	   *
	   * @api private
	   */
	  numRetries: function numRetries() {
	    if (this.config.maxRetries !== undefined) {
	      return this.config.maxRetries;
	    } else {
	      return this.defaultRetryCount;
	    }
	  },

	  /**
	   * @api private
	   */
	  retryDelays: function retryDelays(retryCount, err) {
	    return AWS.util.calculateRetryDelay(retryCount, this.config.retryDelayOptions, err);
	  },

	  /**
	   * @api private
	   */
	  retryableError: function retryableError(error) {
	    if (this.timeoutError(error)) return true;
	    if (this.networkingError(error)) return true;
	    if (this.expiredCredentialsError(error)) return true;
	    if (this.throttledError(error)) return true;
	    if (error.statusCode >= 500) return true;
	    return false;
	  },

	  /**
	   * @api private
	   */
	  networkingError: function networkingError(error) {
	    return error.code === 'NetworkingError';
	  },

	  /**
	   * @api private
	   */
	  timeoutError: function timeoutError(error) {
	    return error.code === 'TimeoutError';
	  },

	  /**
	   * @api private
	   */
	  expiredCredentialsError: function expiredCredentialsError(error) {
	    // TODO : this only handles *one* of the expired credential codes
	    return (error.code === 'ExpiredTokenException');
	  },

	  /**
	   * @api private
	   */
	  clockSkewError: function clockSkewError(error) {
	    switch (error.code) {
	      case 'RequestTimeTooSkewed':
	      case 'RequestExpired':
	      case 'InvalidSignatureException':
	      case 'SignatureDoesNotMatch':
	      case 'AuthFailure':
	      case 'RequestInTheFuture':
	        return true;
	      default: return false;
	    }
	  },

	  /**
	   * @api private
	   */
	  getSkewCorrectedDate: function getSkewCorrectedDate() {
	    return new Date(Date.now() + this.config.systemClockOffset);
	  },

	  /**
	   * @api private
	   */
	  applyClockOffset: function applyClockOffset(newServerTime) {
	    if (newServerTime) {
	      this.config.systemClockOffset = newServerTime - Date.now();
	    }
	  },

	  /**
	   * @api private
	   */
	  isClockSkewed: function isClockSkewed(newServerTime) {
	    if (newServerTime) {
	      return Math.abs(this.getSkewCorrectedDate().getTime() - newServerTime) >= 300000;
	    }
	  },

	  /**
	   * @api private
	   */
	  throttledError: function throttledError(error) {
	    // this logic varies between services
	    if (error.statusCode === 429) return true;
	    switch (error.code) {
	      case 'ProvisionedThroughputExceededException':
	      case 'Throttling':
	      case 'ThrottlingException':
	      case 'RequestLimitExceeded':
	      case 'RequestThrottled':
	      case 'RequestThrottledException':
	      case 'TooManyRequestsException':
	      case 'TransactionInProgressException': //dynamodb
	      case 'EC2ThrottledException':
	        return true;
	      default:
	        return false;
	    }
	  },

	  /**
	   * @api private
	   */
	  endpointFromTemplate: function endpointFromTemplate(endpoint) {
	    if (typeof endpoint !== 'string') return endpoint;

	    var e = endpoint;
	    e = e.replace(/\{service\}/g, this.api.endpointPrefix);
	    e = e.replace(/\{region\}/g, this.config.region);
	    e = e.replace(/\{scheme\}/g, this.config.sslEnabled ? 'https' : 'http');
	    return e;
	  },

	  /**
	   * @api private
	   */
	  setEndpoint: function setEndpoint(endpoint) {
	    this.endpoint = new AWS.Endpoint(endpoint, this.config);
	  },

	  /**
	   * @api private
	   */
	  paginationConfig: function paginationConfig(operation, throwException) {
	    var paginator = this.api.operations[operation].paginator;
	    if (!paginator) {
	      if (throwException) {
	        var e = new Error();
	        throw AWS.util.error(e, 'No pagination configuration for ' + operation);
	      }
	      return null;
	    }

	    return paginator;
	  }
	});

	AWS.util.update(AWS.Service, {

	  /**
	   * Adds one method for each operation described in the api configuration
	   *
	   * @api private
	   */
	  defineMethods: function defineMethods(svc) {
	    AWS.util.each(svc.prototype.api.operations, function iterator(method) {
	      if (svc.prototype[method]) return;
	      var operation = svc.prototype.api.operations[method];
	      if (operation.authtype === 'none') {
	        svc.prototype[method] = function (params, callback) {
	          return this.makeUnauthenticatedRequest(method, params, callback);
	        };
	      } else {
	        svc.prototype[method] = function (params, callback) {
	          return this.makeRequest(method, params, callback);
	        };
	      }
	    });
	  },

	  /**
	   * Defines a new Service class using a service identifier and list of versions
	   * including an optional set of features (functions) to apply to the class
	   * prototype.
	   *
	   * @param serviceIdentifier [String] the identifier for the service
	   * @param versions [Array<String>] a list of versions that work with this
	   *   service
	   * @param features [Object] an object to attach to the prototype
	   * @return [Class<Service>] the service class defined by this function.
	   */
	  defineService: function defineService(serviceIdentifier, versions, features) {
	    AWS.Service._serviceMap[serviceIdentifier] = true;
	    if (!Array.isArray(versions)) {
	      features = versions;
	      versions = [];
	    }

	    var svc = inherit(AWS.Service, features || {});

	    if (typeof serviceIdentifier === 'string') {
	      AWS.Service.addVersions(svc, versions);

	      var identifier = svc.serviceIdentifier || serviceIdentifier;
	      svc.serviceIdentifier = identifier;
	    } else { // defineService called with an API
	      svc.prototype.api = serviceIdentifier;
	      AWS.Service.defineMethods(svc);
	    }
	    AWS.SequentialExecutor.call(this.prototype);
	    //util.clientSideMonitoring is only available in node
	    if (!this.prototype.publisher && AWS.util.clientSideMonitoring) {
	      var Publisher = AWS.util.clientSideMonitoring.Publisher;
	      var configProvider = AWS.util.clientSideMonitoring.configProvider;
	      var publisherConfig = configProvider();
	      this.prototype.publisher = new Publisher(publisherConfig);
	      if (publisherConfig.enabled) {
	        //if csm is enabled in environment, SDK should send all metrics
	        AWS.Service._clientSideMonitoring = true;
	      }
	    }
	    AWS.SequentialExecutor.call(svc.prototype);
	    AWS.Service.addDefaultMonitoringListeners(svc.prototype);
	    return svc;
	  },

	  /**
	   * @api private
	   */
	  addVersions: function addVersions(svc, versions) {
	    if (!Array.isArray(versions)) versions = [versions];

	    svc.services = svc.services || {};
	    for (var i = 0; i < versions.length; i++) {
	      if (svc.services[versions[i]] === undefined) {
	        svc.services[versions[i]] = null;
	      }
	    }

	    svc.apiVersions = Object.keys(svc.services).sort();
	  },

	  /**
	   * @api private
	   */
	  defineServiceApi: function defineServiceApi(superclass, version, apiConfig) {
	    var svc = inherit(superclass, {
	      serviceIdentifier: superclass.serviceIdentifier
	    });

	    function setApi(api) {
	      if (api.isApi) {
	        svc.prototype.api = api;
	      } else {
	        svc.prototype.api = new Api(api, {
	          serviceIdentifier: superclass.serviceIdentifier
	        });
	      }
	    }

	    if (typeof version === 'string') {
	      if (apiConfig) {
	        setApi(apiConfig);
	      } else {
	        try {
	          setApi(AWS.apiLoader(superclass.serviceIdentifier, version));
	        } catch (err) {
	          throw AWS.util.error(err, {
	            message: 'Could not find API configuration ' +
	              superclass.serviceIdentifier + '-' + version
	          });
	        }
	      }
	      if (!Object.prototype.hasOwnProperty.call(superclass.services, version)) {
	        superclass.apiVersions = superclass.apiVersions.concat(version).sort();
	      }
	      superclass.services[version] = svc;
	    } else {
	      setApi(version);
	    }

	    AWS.Service.defineMethods(svc);
	    return svc;
	  },

	  /**
	   * @api private
	   */
	  hasService: function(identifier) {
	    return Object.prototype.hasOwnProperty.call(AWS.Service._serviceMap, identifier);
	  },

	  /**
	   * @param attachOn attach default monitoring listeners to object
	   *
	   * Each monitoring event should be emitted from service client to service constructor prototype and then
	   * to global service prototype like bubbling up. These default monitoring events listener will transfer
	   * the monitoring events to the upper layer.
	   * @api private
	   */
	  addDefaultMonitoringListeners: function addDefaultMonitoringListeners(attachOn) {
	    attachOn.addNamedListener('MONITOR_EVENTS_BUBBLE', 'apiCallAttempt', function EVENTS_BUBBLE(event) {
	      var baseClass = Object.getPrototypeOf(attachOn);
	      if (baseClass._events) baseClass.emit('apiCallAttempt', [event]);
	    });
	    attachOn.addNamedListener('CALL_EVENTS_BUBBLE', 'apiCall', function CALL_EVENTS_BUBBLE(event) {
	      var baseClass = Object.getPrototypeOf(attachOn);
	      if (baseClass._events) baseClass.emit('apiCall', [event]);
	    });
	  },

	  /**
	   * @api private
	   */
	  _serviceMap: {}
	});

	AWS.util.mixin(AWS.Service, AWS.SequentialExecutor);

	/**
	 * @api private
	 */
	module.exports = AWS.Service;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var regionConfig = __webpack_require__(39);

	function generateRegionPrefix(region) {
	  if (!region) return null;
	  var parts = region.split('-');
	  if (parts.length < 3) return null;
	  return parts.slice(0, parts.length - 2).join('-') + '-*';
	}

	function derivedKeys(service) {
	  var region = service.config.region;
	  var regionPrefix = generateRegionPrefix(region);
	  var endpointPrefix = service.api.endpointPrefix;

	  return [
	    [region, endpointPrefix],
	    [regionPrefix, endpointPrefix],
	    [region, '*'],
	    [regionPrefix, '*'],
	    ['*', endpointPrefix],
	    ['*', '*']
	  ].map(function(item) {
	    return item[0] && item[1] ? item.join('/') : null;
	  });
	}

	function applyConfig(service, config) {
	  util.each(config, function(key, value) {
	    if (key === 'globalEndpoint') return;
	    if (service.config[key] === undefined || service.config[key] === null) {
	      service.config[key] = value;
	    }
	  });
	}

	function configureEndpoint(service) {
	  var keys = derivedKeys(service);
	  var useFipsEndpoint = service.config.useFipsEndpoint;
	  var useDualstackEndpoint = service.config.useDualstackEndpoint;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!key) continue;

	    var rules = useFipsEndpoint
	      ? useDualstackEndpoint
	        ? regionConfig.dualstackFipsRules
	        : regionConfig.fipsRules
	      : useDualstackEndpoint
	      ? regionConfig.dualstackRules
	      : regionConfig.rules;

	    if (Object.prototype.hasOwnProperty.call(rules, key)) {
	      var config = rules[key];
	      if (typeof config === 'string') {
	        config = regionConfig.patterns[config];
	      }

	      // set global endpoint
	      service.isGlobalEndpoint = !!config.globalEndpoint;
	      if (config.signingRegion) {
	        service.signingRegion = config.signingRegion;
	      }

	      // signature version
	      if (!config.signatureVersion) config.signatureVersion = 'v4';

	      // merge config
	      applyConfig(service, config);
	      return;
	    }
	  }
	}

	function getEndpointSuffix(region) {
	  var regionRegexes = {
	    '^(us|eu|ap|sa|ca|me)\\-\\w+\\-\\d+$': 'amazonaws.com',
	    '^cn\\-\\w+\\-\\d+$': 'amazonaws.com.cn',
	    '^us\\-gov\\-\\w+\\-\\d+$': 'amazonaws.com',
	    '^us\\-iso\\-\\w+\\-\\d+$': 'c2s.ic.gov',
	    '^us\\-isob\\-\\w+\\-\\d+$': 'sc2s.sgov.gov'
	  };
	  var defaultSuffix = 'amazonaws.com';
	  var regexes = Object.keys(regionRegexes);
	  for (var i = 0; i < regexes.length; i++) {
	    var regionPattern = RegExp(regexes[i]);
	    var dnsSuffix = regionRegexes[regexes[i]];
	    if (regionPattern.test(region)) return dnsSuffix;
	  }
	  return defaultSuffix;
	}

	/**
	 * @api private
	 */
	module.exports = {
	  configureEndpoint: configureEndpoint,
	  getEndpointSuffix: getEndpointSuffix,
	};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

	module.exports = {"rules":{"*/*":{"endpoint":"{service}.{region}.amazonaws.com"},"cn-*/*":{"endpoint":"{service}.{region}.amazonaws.com.cn"},"us-iso-*/*":"usIso","us-isob-*/*":"usIsob","*/budgets":"globalSSL","*/cloudfront":"globalSSL","*/sts":"globalSSL","*/importexport":{"endpoint":"{service}.amazonaws.com","signatureVersion":"v2","globalEndpoint":true},"*/route53":"globalSSL","cn-*/route53":{"endpoint":"{service}.amazonaws.com.cn","globalEndpoint":true,"signingRegion":"cn-northwest-1"},"us-gov-*/route53":"globalGovCloud","*/waf":"globalSSL","*/iam":"globalSSL","cn-*/iam":{"endpoint":"{service}.cn-north-1.amazonaws.com.cn","globalEndpoint":true,"signingRegion":"cn-north-1"},"us-gov-*/iam":"globalGovCloud","us-gov-*/sts":{"endpoint":"{service}.{region}.amazonaws.com"},"us-gov-west-1/s3":"s3signature","us-west-1/s3":"s3signature","us-west-2/s3":"s3signature","eu-west-1/s3":"s3signature","ap-southeast-1/s3":"s3signature","ap-southeast-2/s3":"s3signature","ap-northeast-1/s3":"s3signature","sa-east-1/s3":"s3signature","us-east-1/s3":{"endpoint":"{service}.amazonaws.com","signatureVersion":"s3"},"us-east-1/sdb":{"endpoint":"{service}.amazonaws.com","signatureVersion":"v2"},"*/sdb":{"endpoint":"{service}.{region}.amazonaws.com","signatureVersion":"v2"}},"fipsRules":{"*/*":"fipsStandard","us-gov-*/*":"fipsStandard","us-iso-*/*":{"endpoint":"{service}-fips.{region}.c2s.ic.gov"},"us-iso-*/dms":"usIso","us-isob-*/*":{"endpoint":"{service}-fips.{region}.sc2s.sgov.gov"},"us-isob-*/dms":"usIsob","cn-*/*":{"endpoint":"{service}-fips.{region}.amazonaws.com.cn"},"*/api.ecr":"fips.api.ecr","*/api.sagemaker":"fips.api.sagemaker","*/batch":"fipsDotPrefix","*/eks":"fipsDotPrefix","*/models.lex":"fips.models.lex","*/runtime.lex":"fips.runtime.lex","*/runtime.sagemaker":{"endpoint":"runtime-fips.sagemaker.{region}.amazonaws.com"},"*/iam":"fipsWithoutRegion","*/route53":"fipsWithoutRegion","*/transcribe":"fipsDotPrefix","*/waf":"fipsWithoutRegion","us-gov-*/transcribe":"fipsDotPrefix","us-gov-*/api.ecr":"fips.api.ecr","us-gov-*/api.sagemaker":"fips.api.sagemaker","us-gov-*/models.lex":"fips.models.lex","us-gov-*/runtime.lex":"fips.runtime.lex","us-gov-*/acm-pca":"fipsWithServiceOnly","us-gov-*/batch":"fipsWithServiceOnly","us-gov-*/config":"fipsWithServiceOnly","us-gov-*/eks":"fipsWithServiceOnly","us-gov-*/elasticmapreduce":"fipsWithServiceOnly","us-gov-*/identitystore":"fipsWithServiceOnly","us-gov-*/dynamodb":"fipsWithServiceOnly","us-gov-*/elasticloadbalancing":"fipsWithServiceOnly","us-gov-*/guardduty":"fipsWithServiceOnly","us-gov-*/monitoring":"fipsWithServiceOnly","us-gov-*/resource-groups":"fipsWithServiceOnly","us-gov-*/runtime.sagemaker":"fipsWithServiceOnly","us-gov-*/servicecatalog-appregistry":"fipsWithServiceOnly","us-gov-*/servicequotas":"fipsWithServiceOnly","us-gov-*/ssm":"fipsWithServiceOnly","us-gov-*/sts":"fipsWithServiceOnly","us-gov-*/support":"fipsWithServiceOnly","us-gov-west-1/states":"fipsWithServiceOnly","us-iso-east-1/elasticfilesystem":{"endpoint":"elasticfilesystem-fips.{region}.c2s.ic.gov"},"us-gov-west-1/organizations":"fipsWithServiceOnly","us-gov-west-1/route53":{"endpoint":"route53.us-gov.amazonaws.com"}},"dualstackRules":{"*/*":{"endpoint":"{service}.{region}.api.aws"},"cn-*/*":{"endpoint":"{service}.{region}.api.amazonwebservices.com.cn"},"*/s3":"dualstackLegacy","cn-*/s3":"dualstackLegacyCn","*/s3-control":"dualstackLegacy","cn-*/s3-control":"dualstackLegacyCn"},"dualstackFipsRules":{"*/*":{"endpoint":"{service}-fips.{region}.api.aws"},"cn-*/*":{"endpoint":"{service}-fips.{region}.api.amazonwebservices.com.cn"},"*/s3":"dualstackFipsLegacy","cn-*/s3":"dualstackFipsLegacyCn","*/s3-control":"dualstackFipsLegacy","cn-*/s3-control":"dualstackFipsLegacyCn"},"patterns":{"globalSSL":{"endpoint":"https://{service}.amazonaws.com","globalEndpoint":true,"signingRegion":"us-east-1"},"globalGovCloud":{"endpoint":"{service}.us-gov.amazonaws.com","globalEndpoint":true,"signingRegion":"us-gov-west-1"},"s3signature":{"endpoint":"{service}.{region}.amazonaws.com","signatureVersion":"s3"},"usIso":{"endpoint":"{service}.{region}.c2s.ic.gov"},"usIsob":{"endpoint":"{service}.{region}.sc2s.sgov.gov"},"fipsStandard":{"endpoint":"{service}-fips.{region}.amazonaws.com"},"fipsDotPrefix":{"endpoint":"fips.{service}.{region}.amazonaws.com"},"fipsWithoutRegion":{"endpoint":"{service}-fips.amazonaws.com"},"fips.api.ecr":{"endpoint":"ecr-fips.{region}.amazonaws.com"},"fips.api.sagemaker":{"endpoint":"api-fips.sagemaker.{region}.amazonaws.com"},"fips.models.lex":{"endpoint":"models-fips.lex.{region}.amazonaws.com"},"fips.runtime.lex":{"endpoint":"runtime-fips.lex.{region}.amazonaws.com"},"fipsWithServiceOnly":{"endpoint":"{service}.{region}.amazonaws.com"},"dualstackLegacy":{"endpoint":"{service}.dualstack.{region}.amazonaws.com"},"dualstackLegacyCn":{"endpoint":"{service}.dualstack.{region}.amazonaws.com.cn"},"dualstackFipsLegacy":{"endpoint":"{service}-fips.dualstack.{region}.amazonaws.com"},"dualstackFipsLegacyCn":{"endpoint":"{service}-fips.dualstack.{region}.amazonaws.com.cn"}}}

/***/ }),
/* 40 */
/***/ (function(module, exports) {

	function isFipsRegion(region) {
	  return typeof region === 'string' && (region.startsWith('fips-') || region.endsWith('-fips'));
	}

	function isGlobalRegion(region) {
	  return typeof region === 'string' && ['aws-global', 'aws-us-gov-global'].includes(region);
	}

	function getRealRegion(region) {
	  return ['fips-aws-global', 'aws-fips', 'aws-global'].includes(region)
	      ? 'us-east-1'
	      : ['fips-aws-us-gov-global', 'aws-us-gov-global'].includes(region)
	      ? 'us-gov-west-1'
	      : region.replace(/fips-(dkr-|prod-)?|-fips/, '');
	}

	module.exports = {
	  isFipsRegion: isFipsRegion,
	  isGlobalRegion: isGlobalRegion,
	  getRealRegion: getRealRegion
	};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);
	__webpack_require__(42);
	__webpack_require__(43);
	var PromisesDependency;

	/**
	 * The main configuration class used by all service objects to set
	 * the region, credentials, and other options for requests.
	 *
	 * By default, credentials and region settings are left unconfigured.
	 * This should be configured by the application before using any
	 * AWS service APIs.
	 *
	 * In order to set global configuration options, properties should
	 * be assigned to the global {AWS.config} object.
	 *
	 * @see AWS.config
	 *
	 * @!group General Configuration Options
	 *
	 * @!attribute credentials
	 *   @return [AWS.Credentials] the AWS credentials to sign requests with.
	 *
	 * @!attribute region
	 *   @example Set the global region setting to us-west-2
	 *     AWS.config.update({region: 'us-west-2'});
	 *   @return [AWS.Credentials] The region to send service requests to.
	 *   @see http://docs.amazonwebservices.com/general/latest/gr/rande.html
	 *     A list of available endpoints for each AWS service
	 *
	 * @!attribute maxRetries
	 *   @return [Integer] the maximum amount of retries to perform for a
	 *     service request. By default this value is calculated by the specific
	 *     service object that the request is being made to.
	 *
	 * @!attribute maxRedirects
	 *   @return [Integer] the maximum amount of redirects to follow for a
	 *     service request. Defaults to 10.
	 *
	 * @!attribute paramValidation
	 *   @return [Boolean|map] whether input parameters should be validated against
	 *     the operation description before sending the request. Defaults to true.
	 *     Pass a map to enable any of the following specific validation features:
	 *
	 *     * **min** [Boolean] &mdash; Validates that a value meets the min
	 *       constraint. This is enabled by default when paramValidation is set
	 *       to `true`.
	 *     * **max** [Boolean] &mdash; Validates that a value meets the max
	 *       constraint.
	 *     * **pattern** [Boolean] &mdash; Validates that a string value matches a
	 *       regular expression.
	 *     * **enum** [Boolean] &mdash; Validates that a string value matches one
	 *       of the allowable enum values.
	 *
	 * @!attribute computeChecksums
	 *   @return [Boolean] whether to compute checksums for payload bodies when
	 *     the service accepts it (currently supported in S3 and SQS only).
	 *
	 * @!attribute convertResponseTypes
	 *   @return [Boolean] whether types are converted when parsing response data.
	 *     Currently only supported for JSON based services. Turning this off may
	 *     improve performance on large response payloads. Defaults to `true`.
	 *
	 * @!attribute correctClockSkew
	 *   @return [Boolean] whether to apply a clock skew correction and retry
	 *     requests that fail because of an skewed client clock. Defaults to
	 *     `false`.
	 *
	 * @!attribute sslEnabled
	 *   @return [Boolean] whether SSL is enabled for requests
	 *
	 * @!attribute s3ForcePathStyle
	 *   @return [Boolean] whether to force path style URLs for S3 objects
	 *
	 * @!attribute s3BucketEndpoint
	 *   @note Setting this configuration option requires an `endpoint` to be
	 *     provided explicitly to the service constructor.
	 *   @return [Boolean] whether the provided endpoint addresses an individual
	 *     bucket (false if it addresses the root API endpoint).
	 *
	 * @!attribute s3DisableBodySigning
	 *   @return [Boolean] whether to disable S3 body signing when using signature version `v4`.
	 *     Body signing can only be disabled when using https. Defaults to `true`.
	 *
	 * @!attribute s3UsEast1RegionalEndpoint
	 *   @return ['legacy'|'regional'] when region is set to 'us-east-1', whether to send s3
	 *     request to global endpoints or 'us-east-1' regional endpoints. This config is only
	 *     applicable to S3 client;
	 *     Defaults to 'legacy'
	 * @!attribute s3UseArnRegion
	 *   @return [Boolean] whether to override the request region with the region inferred
	 *     from requested resource's ARN. Only available for S3 buckets
	 *     Defaults to `true`
	 *
	 * @!attribute useAccelerateEndpoint
	 *   @note This configuration option is only compatible with S3 while accessing
	 *     dns-compatible buckets.
	 *   @return [Boolean] Whether to use the Accelerate endpoint with the S3 service.
	 *     Defaults to `false`.
	 *
	 * @!attribute retryDelayOptions
	 *   @example Set the base retry delay for all services to 300 ms
	 *     AWS.config.update({retryDelayOptions: {base: 300}});
	 *     // Delays with maxRetries = 3: 300, 600, 1200
	 *   @example Set a custom backoff function to provide delay values on retries
	 *     AWS.config.update({retryDelayOptions: {customBackoff: function(retryCount, err) {
	 *       // returns delay in ms
	 *     }}});
	 *   @return [map] A set of options to configure the retry delay on retryable errors.
	 *     Currently supported options are:
	 *
	 *     * **base** [Integer] &mdash; The base number of milliseconds to use in the
	 *       exponential backoff for operation retries. Defaults to 100 ms for all services except
	 *       DynamoDB, where it defaults to 50ms.
	 *
	 *     * **customBackoff ** [function] &mdash; A custom function that accepts a
	 *       retry count and error and returns the amount of time to delay in
	 *       milliseconds. If the result is a non-zero negative value, no further
	 *       retry attempts will be made. The `base` option will be ignored if this
	 *       option is supplied. The function is only called for retryable errors.
	 *
	 * @!attribute httpOptions
	 *   @return [map] A set of options to pass to the low-level HTTP request.
	 *     Currently supported options are:
	 *
	 *     * **proxy** [String] &mdash; the URL to proxy requests through
	 *     * **agent** [http.Agent, https.Agent] &mdash; the Agent object to perform
	 *       HTTP requests with. Used for connection pooling. Note that for
	 *       SSL connections, a special Agent object is used in order to enable
	 *       peer certificate verification. This feature is only supported in the
	 *       Node.js environment.
	 *     * **connectTimeout** [Integer] &mdash; Sets the socket to timeout after
	 *       failing to establish a connection with the server after
	 *       `connectTimeout` milliseconds. This timeout has no effect once a socket
	 *       connection has been established.
	 *     * **timeout** [Integer] &mdash; The number of milliseconds a request can
	 *       take before automatically being terminated.
	 *       Defaults to two minutes (120000).
	 *     * **xhrAsync** [Boolean] &mdash; Whether the SDK will send asynchronous
	 *       HTTP requests. Used in the browser environment only. Set to false to
	 *       send requests synchronously. Defaults to true (async on).
	 *     * **xhrWithCredentials** [Boolean] &mdash; Sets the "withCredentials"
	 *       property of an XMLHttpRequest object. Used in the browser environment
	 *       only. Defaults to false.
	 * @!attribute logger
	 *   @return [#write,#log] an object that responds to .write() (like a stream)
	 *     or .log() (like the console object) in order to log information about
	 *     requests
	 *
	 * @!attribute systemClockOffset
	 *   @return [Number] an offset value in milliseconds to apply to all signing
	 *     times. Use this to compensate for clock skew when your system may be
	 *     out of sync with the service time. Note that this configuration option
	 *     can only be applied to the global `AWS.config` object and cannot be
	 *     overridden in service-specific configuration. Defaults to 0 milliseconds.
	 *
	 * @!attribute signatureVersion
	 *   @return [String] the signature version to sign requests with (overriding
	 *     the API configuration). Possible values are: 'v2', 'v3', 'v4'.
	 *
	 * @!attribute signatureCache
	 *   @return [Boolean] whether the signature to sign requests with (overriding
	 *     the API configuration) is cached. Only applies to the signature version 'v4'.
	 *     Defaults to `true`.
	 *
	 * @!attribute endpointDiscoveryEnabled
	 *   @return [Boolean|undefined] whether to call operations with endpoints
	 *     given by service dynamically. Setting this config to `true` will enable
	 *     endpoint discovery for all applicable operations. Setting it to `false`
	 *     will explicitly disable endpoint discovery even though operations that
	 *     require endpoint discovery will presumably fail. Leaving it to
	 *     `undefined` means SDK only do endpoint discovery when it's required.
	 *     Defaults to `undefined`
	 *
	 * @!attribute endpointCacheSize
	 *   @return [Number] the size of the global cache storing endpoints from endpoint
	 *     discovery operations. Once endpoint cache is created, updating this setting
	 *     cannot change existing cache size.
	 *     Defaults to 1000
	 *
	 * @!attribute hostPrefixEnabled
	 *   @return [Boolean] whether to marshal request parameters to the prefix of
	 *     hostname. Defaults to `true`.
	 *
	 * @!attribute stsRegionalEndpoints
	 *   @return ['legacy'|'regional'] whether to send sts request to global endpoints or
	 *     regional endpoints.
	 *     Defaults to 'legacy'.
	 *
	 * @!attribute useFipsEndpoint
	 *   @return [Boolean] Enables FIPS compatible endpoints. Defaults to `false`.
	 *
	 * @!attribute useDualstackEndpoint
	 *   @return [Boolean] Enables IPv6 dualstack endpoint. Defaults to `false`.
	 */
	AWS.Config = AWS.util.inherit({
	  /**
	   * @!endgroup
	   */

	  /**
	   * Creates a new configuration object. This is the object that passes
	   * option data along to service requests, including credentials, security,
	   * region information, and some service specific settings.
	   *
	   * @example Creating a new configuration object with credentials and region
	   *   var config = new AWS.Config({
	   *     accessKeyId: 'AKID', secretAccessKey: 'SECRET', region: 'us-west-2'
	   *   });
	   * @option options accessKeyId [String] your AWS access key ID.
	   * @option options secretAccessKey [String] your AWS secret access key.
	   * @option options sessionToken [AWS.Credentials] the optional AWS
	   *   session token to sign requests with.
	   * @option options credentials [AWS.Credentials] the AWS credentials
	   *   to sign requests with. You can either specify this object, or
	   *   specify the accessKeyId and secretAccessKey options directly.
	   * @option options credentialProvider [AWS.CredentialProviderChain] the
	   *   provider chain used to resolve credentials if no static `credentials`
	   *   property is set.
	   * @option options region [String] the region to send service requests to.
	   *   See {region} for more information.
	   * @option options maxRetries [Integer] the maximum amount of retries to
	   *   attempt with a request. See {maxRetries} for more information.
	   * @option options maxRedirects [Integer] the maximum amount of redirects to
	   *   follow with a request. See {maxRedirects} for more information.
	   * @option options sslEnabled [Boolean] whether to enable SSL for
	   *   requests.
	   * @option options paramValidation [Boolean|map] whether input parameters
	   *   should be validated against the operation description before sending
	   *   the request. Defaults to true. Pass a map to enable any of the
	   *   following specific validation features:
	   *
	   *   * **min** [Boolean] &mdash; Validates that a value meets the min
	   *     constraint. This is enabled by default when paramValidation is set
	   *     to `true`.
	   *   * **max** [Boolean] &mdash; Validates that a value meets the max
	   *     constraint.
	   *   * **pattern** [Boolean] &mdash; Validates that a string value matches a
	   *     regular expression.
	   *   * **enum** [Boolean] &mdash; Validates that a string value matches one
	   *     of the allowable enum values.
	   * @option options computeChecksums [Boolean] whether to compute checksums
	   *   for payload bodies when the service accepts it (currently supported
	   *   in S3 only)
	   * @option options convertResponseTypes [Boolean] whether types are converted
	   *     when parsing response data. Currently only supported for JSON based
	   *     services. Turning this off may improve performance on large response
	   *     payloads. Defaults to `true`.
	   * @option options correctClockSkew [Boolean] whether to apply a clock skew
	   *     correction and retry requests that fail because of an skewed client
	   *     clock. Defaults to `false`.
	   * @option options s3ForcePathStyle [Boolean] whether to force path
	   *   style URLs for S3 objects.
	   * @option options s3BucketEndpoint [Boolean] whether the provided endpoint
	   *   addresses an individual bucket (false if it addresses the root API
	   *   endpoint). Note that setting this configuration option requires an
	   *   `endpoint` to be provided explicitly to the service constructor.
	   * @option options s3DisableBodySigning [Boolean] whether S3 body signing
	   *   should be disabled when using signature version `v4`. Body signing
	   *   can only be disabled when using https. Defaults to `true`.
	   * @option options s3UsEast1RegionalEndpoint ['legacy'|'regional'] when region
	   *   is set to 'us-east-1', whether to send s3 request to global endpoints or
	   *   'us-east-1' regional endpoints. This config is only applicable to S3 client.
	   *   Defaults to `legacy`
	   * @option options s3UseArnRegion [Boolean] whether to override the request region
	   *   with the region inferred from requested resource's ARN. Only available for S3 buckets
	   *   Defaults to `true`
	   *
	   * @option options retryDelayOptions [map] A set of options to configure
	   *   the retry delay on retryable errors. Currently supported options are:
	   *
	   *   * **base** [Integer] &mdash; The base number of milliseconds to use in the
	   *     exponential backoff for operation retries. Defaults to 100 ms for all
	   *     services except DynamoDB, where it defaults to 50ms.
	   *   * **customBackoff ** [function] &mdash; A custom function that accepts a
	   *     retry count and error and returns the amount of time to delay in
	   *     milliseconds. If the result is a non-zero negative value, no further
	   *     retry attempts will be made. The `base` option will be ignored if this
	   *     option is supplied. The function is only called for retryable errors.
	   * @option options httpOptions [map] A set of options to pass to the low-level
	   *   HTTP request. Currently supported options are:
	   *
	   *   * **proxy** [String] &mdash; the URL to proxy requests through
	   *   * **agent** [http.Agent, https.Agent] &mdash; the Agent object to perform
	   *     HTTP requests with. Used for connection pooling. Defaults to the global
	   *     agent (`http.globalAgent`) for non-SSL connections. Note that for
	   *     SSL connections, a special Agent object is used in order to enable
	   *     peer certificate verification. This feature is only available in the
	   *     Node.js environment.
	   *   * **connectTimeout** [Integer] &mdash; Sets the socket to timeout after
	   *     failing to establish a connection with the server after
	   *     `connectTimeout` milliseconds. This timeout has no effect once a socket
	   *     connection has been established.
	   *   * **timeout** [Integer] &mdash; Sets the socket to timeout after timeout
	   *     milliseconds of inactivity on the socket. Defaults to two minutes
	   *     (120000).
	   *   * **xhrAsync** [Boolean] &mdash; Whether the SDK will send asynchronous
	   *     HTTP requests. Used in the browser environment only. Set to false to
	   *     send requests synchronously. Defaults to true (async on).
	   *   * **xhrWithCredentials** [Boolean] &mdash; Sets the "withCredentials"
	   *     property of an XMLHttpRequest object. Used in the browser environment
	   *     only. Defaults to false.
	   * @option options apiVersion [String, Date] a String in YYYY-MM-DD format
	   *   (or a date) that represents the latest possible API version that can be
	   *   used in all services (unless overridden by `apiVersions`). Specify
	   *   'latest' to use the latest possible version.
	   * @option options apiVersions [map<String, String|Date>] a map of service
	   *   identifiers (the lowercase service class name) with the API version to
	   *   use when instantiating a service. Specify 'latest' for each individual
	   *   that can use the latest available version.
	   * @option options logger [#write,#log] an object that responds to .write()
	   *   (like a stream) or .log() (like the console object) in order to log
	   *   information about requests
	   * @option options systemClockOffset [Number] an offset value in milliseconds
	   *   to apply to all signing times. Use this to compensate for clock skew
	   *   when your system may be out of sync with the service time. Note that
	   *   this configuration option can only be applied to the global `AWS.config`
	   *   object and cannot be overridden in service-specific configuration.
	   *   Defaults to 0 milliseconds.
	   * @option options signatureVersion [String] the signature version to sign
	   *   requests with (overriding the API configuration). Possible values are:
	   *   'v2', 'v3', 'v4'.
	   * @option options signatureCache [Boolean] whether the signature to sign
	   *   requests with (overriding the API configuration) is cached. Only applies
	   *   to the signature version 'v4'. Defaults to `true`.
	   * @option options dynamoDbCrc32 [Boolean] whether to validate the CRC32
	   *   checksum of HTTP response bodies returned by DynamoDB. Default: `true`.
	   * @option options useAccelerateEndpoint [Boolean] Whether to use the
	   *   S3 Transfer Acceleration endpoint with the S3 service. Default: `false`.
	   * @option options clientSideMonitoring [Boolean] whether to collect and
	   *   publish this client's performance metrics of all its API requests.
	   * @option options endpointDiscoveryEnabled [Boolean|undefined] whether to
	   *   call operations with endpoints given by service dynamically. Setting this
	   * config to `true` will enable endpoint discovery for all applicable operations.
	   *   Setting it to `false` will explicitly disable endpoint discovery even though
	   *   operations that require endpoint discovery will presumably fail. Leaving it
	   *   to `undefined` means SDK will only do endpoint discovery when it's required.
	   *   Defaults to `undefined`
	   * @option options endpointCacheSize [Number] the size of the global cache storing
	   *   endpoints from endpoint discovery operations. Once endpoint cache is created,
	   *   updating this setting cannot change existing cache size.
	   *   Defaults to 1000
	   * @option options hostPrefixEnabled [Boolean] whether to marshal request
	   *   parameters to the prefix of hostname.
	   *   Defaults to `true`.
	   * @option options stsRegionalEndpoints ['legacy'|'regional'] whether to send sts request
	   *   to global endpoints or regional endpoints.
	   *   Defaults to 'legacy'.
	   * @option options useFipsEndpoint [Boolean] Enables FIPS compatible endpoints.
	   *   Defaults to `false`.
	   * @option options useDualstackEndpoint [Boolean] Enables IPv6 dualstack endpoint.
	   *   Defaults to `false`.
	   */
	  constructor: function Config(options) {
	    if (options === undefined) options = {};
	    options = this.extractCredentials(options);

	    AWS.util.each.call(this, this.keys, function (key, value) {
	      this.set(key, options[key], value);
	    });
	  },

	  /**
	   * @!group Managing Credentials
	   */

	  /**
	   * Loads credentials from the configuration object. This is used internally
	   * by the SDK to ensure that refreshable {Credentials} objects are properly
	   * refreshed and loaded when sending a request. If you want to ensure that
	   * your credentials are loaded prior to a request, you can use this method
	   * directly to provide accurate credential data stored in the object.
	   *
	   * @note If you configure the SDK with static or environment credentials,
	   *   the credential data should already be present in {credentials} attribute.
	   *   This method is primarily necessary to load credentials from asynchronous
	   *   sources, or sources that can refresh credentials periodically.
	   * @example Getting your access key
	   *   AWS.config.getCredentials(function(err) {
	   *     if (err) console.log(err.stack); // credentials not loaded
	   *     else console.log("Access Key:", AWS.config.credentials.accessKeyId);
	   *   })
	   * @callback callback function(err)
	   *   Called when the {credentials} have been properly set on the configuration
	   *   object.
	   *
	   *   @param err [Error] if this is set, credentials were not successfully
	   *     loaded and this error provides information why.
	   * @see credentials
	   * @see Credentials
	   */
	  getCredentials: function getCredentials(callback) {
	    var self = this;

	    function finish(err) {
	      callback(err, err ? null : self.credentials);
	    }

	    function credError(msg, err) {
	      return new AWS.util.error(err || new Error(), {
	        code: 'CredentialsError',
	        message: msg,
	        name: 'CredentialsError'
	      });
	    }

	    function getAsyncCredentials() {
	      self.credentials.get(function(err) {
	        if (err) {
	          var msg = 'Could not load credentials from ' +
	            self.credentials.constructor.name;
	          err = credError(msg, err);
	        }
	        finish(err);
	      });
	    }

	    function getStaticCredentials() {
	      var err = null;
	      if (!self.credentials.accessKeyId || !self.credentials.secretAccessKey) {
	        err = credError('Missing credentials');
	      }
	      finish(err);
	    }

	    if (self.credentials) {
	      if (typeof self.credentials.get === 'function') {
	        getAsyncCredentials();
	      } else { // static credentials
	        getStaticCredentials();
	      }
	    } else if (self.credentialProvider) {
	      self.credentialProvider.resolve(function(err, creds) {
	        if (err) {
	          err = credError('Could not load credentials from any providers', err);
	        }
	        self.credentials = creds;
	        finish(err);
	      });
	    } else {
	      finish(credError('No credentials to load'));
	    }
	  },

	  /**
	   * @!group Loading and Setting Configuration Options
	   */

	  /**
	   * @overload update(options, allowUnknownKeys = false)
	   *   Updates the current configuration object with new options.
	   *
	   *   @example Update maxRetries property of a configuration object
	   *     config.update({maxRetries: 10});
	   *   @param [Object] options a map of option keys and values.
	   *   @param [Boolean] allowUnknownKeys whether unknown keys can be set on
	   *     the configuration object. Defaults to `false`.
	   *   @see constructor
	   */
	  update: function update(options, allowUnknownKeys) {
	    allowUnknownKeys = allowUnknownKeys || false;
	    options = this.extractCredentials(options);
	    AWS.util.each.call(this, options, function (key, value) {
	      if (allowUnknownKeys || Object.prototype.hasOwnProperty.call(this.keys, key) ||
	          AWS.Service.hasService(key)) {
	        this.set(key, value);
	      }
	    });
	  },

	  /**
	   * Loads configuration data from a JSON file into this config object.
	   * @note Loading configuration will reset all existing configuration
	   *   on the object.
	   * @!macro nobrowser
	   * @param path [String] the path relative to your process's current
	   *    working directory to load configuration from.
	   * @return [AWS.Config] the same configuration object
	   */
	  loadFromPath: function loadFromPath(path) {
	    this.clear();

	    var options = JSON.parse(AWS.util.readFileSync(path));
	    var fileSystemCreds = new AWS.FileSystemCredentials(path);
	    var chain = new AWS.CredentialProviderChain();
	    chain.providers.unshift(fileSystemCreds);
	    chain.resolve(function (err, creds) {
	      if (err) throw err;
	      else options.credentials = creds;
	    });

	    this.constructor(options);

	    return this;
	  },

	  /**
	   * Clears configuration data on this object
	   *
	   * @api private
	   */
	  clear: function clear() {
	    /*jshint forin:false */
	    AWS.util.each.call(this, this.keys, function (key) {
	      delete this[key];
	    });

	    // reset credential provider
	    this.set('credentials', undefined);
	    this.set('credentialProvider', undefined);
	  },

	  /**
	   * Sets a property on the configuration object, allowing for a
	   * default value
	   * @api private
	   */
	  set: function set(property, value, defaultValue) {
	    if (value === undefined) {
	      if (defaultValue === undefined) {
	        defaultValue = this.keys[property];
	      }
	      if (typeof defaultValue === 'function') {
	        this[property] = defaultValue.call(this);
	      } else {
	        this[property] = defaultValue;
	      }
	    } else if (property === 'httpOptions' && this[property]) {
	      // deep merge httpOptions
	      this[property] = AWS.util.merge(this[property], value);
	    } else {
	      this[property] = value;
	    }
	  },

	  /**
	   * All of the keys with their default values.
	   *
	   * @constant
	   * @api private
	   */
	  keys: {
	    credentials: null,
	    credentialProvider: null,
	    region: null,
	    logger: null,
	    apiVersions: {},
	    apiVersion: null,
	    endpoint: undefined,
	    httpOptions: {
	      timeout: 120000
	    },
	    maxRetries: undefined,
	    maxRedirects: 10,
	    paramValidation: true,
	    sslEnabled: true,
	    s3ForcePathStyle: false,
	    s3BucketEndpoint: false,
	    s3DisableBodySigning: true,
	    s3UsEast1RegionalEndpoint: 'legacy',
	    s3UseArnRegion: undefined,
	    computeChecksums: true,
	    convertResponseTypes: true,
	    correctClockSkew: false,
	    customUserAgent: null,
	    dynamoDbCrc32: true,
	    systemClockOffset: 0,
	    signatureVersion: null,
	    signatureCache: true,
	    retryDelayOptions: {},
	    useAccelerateEndpoint: false,
	    clientSideMonitoring: false,
	    endpointDiscoveryEnabled: undefined,
	    endpointCacheSize: 1000,
	    hostPrefixEnabled: true,
	    stsRegionalEndpoints: 'legacy',
	    useFipsEndpoint: false,
	    useDualstackEndpoint: false
	  },

	  /**
	   * Extracts accessKeyId, secretAccessKey and sessionToken
	   * from a configuration hash.
	   *
	   * @api private
	   */
	  extractCredentials: function extractCredentials(options) {
	    if (options.accessKeyId && options.secretAccessKey) {
	      options = AWS.util.copy(options);
	      options.credentials = new AWS.Credentials(options);
	    }
	    return options;
	  },

	  /**
	   * Sets the promise dependency the SDK will use wherever Promises are returned.
	   * Passing `null` will force the SDK to use native Promises if they are available.
	   * If native Promises are not available, passing `null` will have no effect.
	   * @param [Constructor] dep A reference to a Promise constructor
	   */
	  setPromisesDependency: function setPromisesDependency(dep) {
	    PromisesDependency = dep;
	    // if null was passed in, we should try to use native promises
	    if (dep === null && typeof Promise === 'function') {
	      PromisesDependency = Promise;
	    }
	    var constructors = [AWS.Request, AWS.Credentials, AWS.CredentialProviderChain];
	    if (AWS.S3) {
	      constructors.push(AWS.S3);
	      if (AWS.S3.ManagedUpload) {
	        constructors.push(AWS.S3.ManagedUpload);
	      }
	    }
	    AWS.util.addPromises(constructors, PromisesDependency);
	  },

	  /**
	   * Gets the promise dependency set by `AWS.config.setPromisesDependency`.
	   */
	  getPromisesDependency: function getPromisesDependency() {
	    return PromisesDependency;
	  }
	});

	/**
	 * @return [AWS.Config] The global configuration object singleton instance
	 * @readonly
	 * @see AWS.Config
	 */
	AWS.config = new AWS.Config();


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);

	/**
	 * Represents your AWS security credentials, specifically the
	 * {accessKeyId}, {secretAccessKey}, and optional {sessionToken}.
	 * Creating a `Credentials` object allows you to pass around your
	 * security information to configuration and service objects.
	 *
	 * Note that this class typically does not need to be constructed manually,
	 * as the {AWS.Config} and {AWS.Service} classes both accept simple
	 * options hashes with the three keys. These structures will be converted
	 * into Credentials objects automatically.
	 *
	 * ## Expiring and Refreshing Credentials
	 *
	 * Occasionally credentials can expire in the middle of a long-running
	 * application. In this case, the SDK will automatically attempt to
	 * refresh the credentials from the storage location if the Credentials
	 * class implements the {refresh} method.
	 *
	 * If you are implementing a credential storage location, you
	 * will want to create a subclass of the `Credentials` class and
	 * override the {refresh} method. This method allows credentials to be
	 * retrieved from the backing store, be it a file system, database, or
	 * some network storage. The method should reset the credential attributes
	 * on the object.
	 *
	 * @!attribute expired
	 *   @return [Boolean] whether the credentials have been expired and
	 *     require a refresh. Used in conjunction with {expireTime}.
	 * @!attribute expireTime
	 *   @return [Date] a time when credentials should be considered expired. Used
	 *     in conjunction with {expired}.
	 * @!attribute accessKeyId
	 *   @return [String] the AWS access key ID
	 * @!attribute secretAccessKey
	 *   @return [String] the AWS secret access key
	 * @!attribute sessionToken
	 *   @return [String] an optional AWS session token
	 */
	AWS.Credentials = AWS.util.inherit({
	  /**
	   * A credentials object can be created using positional arguments or an options
	   * hash.
	   *
	   * @overload AWS.Credentials(accessKeyId, secretAccessKey, sessionToken=null)
	   *   Creates a Credentials object with a given set of credential information
	   *   as positional arguments.
	   *   @param accessKeyId [String] the AWS access key ID
	   *   @param secretAccessKey [String] the AWS secret access key
	   *   @param sessionToken [String] the optional AWS session token
	   *   @example Create a credentials object with AWS credentials
	   *     var creds = new AWS.Credentials('akid', 'secret', 'session');
	   * @overload AWS.Credentials(options)
	   *   Creates a Credentials object with a given set of credential information
	   *   as an options hash.
	   *   @option options accessKeyId [String] the AWS access key ID
	   *   @option options secretAccessKey [String] the AWS secret access key
	   *   @option options sessionToken [String] the optional AWS session token
	   *   @example Create a credentials object with AWS credentials
	   *     var creds = new AWS.Credentials({
	   *       accessKeyId: 'akid', secretAccessKey: 'secret', sessionToken: 'session'
	   *     });
	   */
	  constructor: function Credentials() {
	    // hide secretAccessKey from being displayed with util.inspect
	    AWS.util.hideProperties(this, ['secretAccessKey']);

	    this.expired = false;
	    this.expireTime = null;
	    this.refreshCallbacks = [];
	    if (arguments.length === 1 && typeof arguments[0] === 'object') {
	      var creds = arguments[0].credentials || arguments[0];
	      this.accessKeyId = creds.accessKeyId;
	      this.secretAccessKey = creds.secretAccessKey;
	      this.sessionToken = creds.sessionToken;
	    } else {
	      this.accessKeyId = arguments[0];
	      this.secretAccessKey = arguments[1];
	      this.sessionToken = arguments[2];
	    }
	  },

	  /**
	   * @return [Integer] the number of seconds before {expireTime} during which
	   *   the credentials will be considered expired.
	   */
	  expiryWindow: 15,

	  /**
	   * @return [Boolean] whether the credentials object should call {refresh}
	   * @note Subclasses should override this method to provide custom refresh
	   *   logic.
	   */
	  needsRefresh: function needsRefresh() {
	    var currentTime = AWS.util.date.getDate().getTime();
	    var adjustedTime = new Date(currentTime + this.expiryWindow * 1000);

	    if (this.expireTime && adjustedTime > this.expireTime) {
	      return true;
	    } else {
	      return this.expired || !this.accessKeyId || !this.secretAccessKey;
	    }
	  },

	  /**
	   * Gets the existing credentials, refreshing them if they are not yet loaded
	   * or have expired. Users should call this method before using {refresh},
	   * as this will not attempt to reload credentials when they are already
	   * loaded into the object.
	   *
	   * @callback callback function(err)
	   *   When this callback is called with no error, it means either credentials
	   *   do not need to be refreshed or refreshed credentials information has
	   *   been loaded into the object (as the `accessKeyId`, `secretAccessKey`,
	   *   and `sessionToken` properties).
	   *   @param err [Error] if an error occurred, this value will be filled
	   */
	  get: function get(callback) {
	    var self = this;
	    if (this.needsRefresh()) {
	      this.refresh(function(err) {
	        if (!err) self.expired = false; // reset expired flag
	        if (callback) callback(err);
	      });
	    } else if (callback) {
	      callback();
	    }
	  },

	  /**
	   * @!method  getPromise()
	   *   Returns a 'thenable' promise.
	   *   Gets the existing credentials, refreshing them if they are not yet loaded
	   *   or have expired. Users should call this method before using {refresh},
	   *   as this will not attempt to reload credentials when they are already
	   *   loaded into the object.
	   *
	   *   Two callbacks can be provided to the `then` method on the returned promise.
	   *   The first callback will be called if the promise is fulfilled, and the second
	   *   callback will be called if the promise is rejected.
	   *   @callback fulfilledCallback function()
	   *     Called if the promise is fulfilled. When this callback is called, it
	   *     means either credentials do not need to be refreshed or refreshed
	   *     credentials information has been loaded into the object (as the
	   *     `accessKeyId`, `secretAccessKey`, and `sessionToken` properties).
	   *   @callback rejectedCallback function(err)
	   *     Called if the promise is rejected.
	   *     @param err [Error] if an error occurred, this value will be filled
	   *   @return [Promise] A promise that represents the state of the `get` call.
	   *   @example Calling the `getPromise` method.
	   *     var promise = credProvider.getPromise();
	   *     promise.then(function() { ... }, function(err) { ... });
	   */

	  /**
	   * @!method  refreshPromise()
	   *   Returns a 'thenable' promise.
	   *   Refreshes the credentials. Users should call {get} before attempting
	   *   to forcibly refresh credentials.
	   *
	   *   Two callbacks can be provided to the `then` method on the returned promise.
	   *   The first callback will be called if the promise is fulfilled, and the second
	   *   callback will be called if the promise is rejected.
	   *   @callback fulfilledCallback function()
	   *     Called if the promise is fulfilled. When this callback is called, it
	   *     means refreshed credentials information has been loaded into the object
	   *     (as the `accessKeyId`, `secretAccessKey`, and `sessionToken` properties).
	   *   @callback rejectedCallback function(err)
	   *     Called if the promise is rejected.
	   *     @param err [Error] if an error occurred, this value will be filled
	   *   @return [Promise] A promise that represents the state of the `refresh` call.
	   *   @example Calling the `refreshPromise` method.
	   *     var promise = credProvider.refreshPromise();
	   *     promise.then(function() { ... }, function(err) { ... });
	   */

	  /**
	   * Refreshes the credentials. Users should call {get} before attempting
	   * to forcibly refresh credentials.
	   *
	   * @callback callback function(err)
	   *   When this callback is called with no error, it means refreshed
	   *   credentials information has been loaded into the object (as the
	   *   `accessKeyId`, `secretAccessKey`, and `sessionToken` properties).
	   *   @param err [Error] if an error occurred, this value will be filled
	   * @note Subclasses should override this class to reset the
	   *   {accessKeyId}, {secretAccessKey} and optional {sessionToken}
	   *   on the credentials object and then call the callback with
	   *   any error information.
	   * @see get
	   */
	  refresh: function refresh(callback) {
	    this.expired = false;
	    callback();
	  },

	  /**
	   * @api private
	   * @param callback
	   */
	  coalesceRefresh: function coalesceRefresh(callback, sync) {
	    var self = this;
	    if (self.refreshCallbacks.push(callback) === 1) {
	      self.load(function onLoad(err) {
	        AWS.util.arrayEach(self.refreshCallbacks, function(callback) {
	          if (sync) {
	            callback(err);
	          } else {
	            // callback could throw, so defer to ensure all callbacks are notified
	            AWS.util.defer(function () {
	              callback(err);
	            });
	          }
	        });
	        self.refreshCallbacks.length = 0;
	      });
	    }
	  },

	  /**
	   * @api private
	   * @param callback
	   */
	  load: function load(callback) {
	    callback();
	  }
	});

	/**
	 * @api private
	 */
	AWS.Credentials.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
	  this.prototype.getPromise = AWS.util.promisifyMethod('get', PromiseDependency);
	  this.prototype.refreshPromise = AWS.util.promisifyMethod('refresh', PromiseDependency);
	};

	/**
	 * @api private
	 */
	AWS.Credentials.deletePromisesFromClass = function deletePromisesFromClass() {
	  delete this.prototype.getPromise;
	  delete this.prototype.refreshPromise;
	};

	AWS.util.addPromises(AWS.Credentials);


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);

	/**
	 * Creates a credential provider chain that searches for AWS credentials
	 * in a list of credential providers specified by the {providers} property.
	 *
	 * By default, the chain will use the {defaultProviders} to resolve credentials.
	 * These providers will look in the environment using the
	 * {AWS.EnvironmentCredentials} class with the 'AWS' and 'AMAZON' prefixes.
	 *
	 * ## Setting Providers
	 *
	 * Each provider in the {providers} list should be a function that returns
	 * a {AWS.Credentials} object, or a hardcoded credentials object. The function
	 * form allows for delayed execution of the credential construction.
	 *
	 * ## Resolving Credentials from a Chain
	 *
	 * Call {resolve} to return the first valid credential object that can be
	 * loaded by the provider chain.
	 *
	 * For example, to resolve a chain with a custom provider that checks a file
	 * on disk after the set of {defaultProviders}:
	 *
	 * ```javascript
	 * var diskProvider = new AWS.FileSystemCredentials('./creds.json');
	 * var chain = new AWS.CredentialProviderChain();
	 * chain.providers.push(diskProvider);
	 * chain.resolve();
	 * ```
	 *
	 * The above code will return the `diskProvider` object if the
	 * file contains credentials and the `defaultProviders` do not contain
	 * any credential settings.
	 *
	 * @!attribute providers
	 *   @return [Array<AWS.Credentials, Function>]
	 *     a list of credentials objects or functions that return credentials
	 *     objects. If the provider is a function, the function will be
	 *     executed lazily when the provider needs to be checked for valid
	 *     credentials. By default, this object will be set to the
	 *     {defaultProviders}.
	 *   @see defaultProviders
	 */
	AWS.CredentialProviderChain = AWS.util.inherit(AWS.Credentials, {

	  /**
	   * Creates a new CredentialProviderChain with a default set of providers
	   * specified by {defaultProviders}.
	   */
	  constructor: function CredentialProviderChain(providers) {
	    if (providers) {
	      this.providers = providers;
	    } else {
	      this.providers = AWS.CredentialProviderChain.defaultProviders.slice(0);
	    }
	    this.resolveCallbacks = [];
	  },

	  /**
	   * @!method  resolvePromise()
	   *   Returns a 'thenable' promise.
	   *   Resolves the provider chain by searching for the first set of
	   *   credentials in {providers}.
	   *
	   *   Two callbacks can be provided to the `then` method on the returned promise.
	   *   The first callback will be called if the promise is fulfilled, and the second
	   *   callback will be called if the promise is rejected.
	   *   @callback fulfilledCallback function(credentials)
	   *     Called if the promise is fulfilled and the provider resolves the chain
	   *     to a credentials object
	   *     @param credentials [AWS.Credentials] the credentials object resolved
	   *       by the provider chain.
	   *   @callback rejectedCallback function(error)
	   *     Called if the promise is rejected.
	   *     @param err [Error] the error object returned if no credentials are found.
	   *   @return [Promise] A promise that represents the state of the `resolve` method call.
	   *   @example Calling the `resolvePromise` method.
	   *     var promise = chain.resolvePromise();
	   *     promise.then(function(credentials) { ... }, function(err) { ... });
	   */

	  /**
	   * Resolves the provider chain by searching for the first set of
	   * credentials in {providers}.
	   *
	   * @callback callback function(err, credentials)
	   *   Called when the provider resolves the chain to a credentials object
	   *   or null if no credentials can be found.
	   *
	   *   @param err [Error] the error object returned if no credentials are
	   *     found.
	   *   @param credentials [AWS.Credentials] the credentials object resolved
	   *     by the provider chain.
	   * @return [AWS.CredentialProviderChain] the provider, for chaining.
	   */
	  resolve: function resolve(callback) {
	    var self = this;
	    if (self.providers.length === 0) {
	      callback(new Error('No providers'));
	      return self;
	    }

	    if (self.resolveCallbacks.push(callback) === 1) {
	      var index = 0;
	      var providers = self.providers.slice(0);

	      function resolveNext(err, creds) {
	        if ((!err && creds) || index === providers.length) {
	          AWS.util.arrayEach(self.resolveCallbacks, function (callback) {
	            callback(err, creds);
	          });
	          self.resolveCallbacks.length = 0;
	          return;
	        }

	        var provider = providers[index++];
	        if (typeof provider === 'function') {
	          creds = provider.call();
	        } else {
	          creds = provider;
	        }

	        if (creds.get) {
	          creds.get(function (getErr) {
	            resolveNext(getErr, getErr ? null : creds);
	          });
	        } else {
	          resolveNext(null, creds);
	        }
	      }

	      resolveNext();
	    }

	    return self;
	  }
	});

	/**
	 * The default set of providers used by a vanilla CredentialProviderChain.
	 *
	 * In the browser:
	 *
	 * ```javascript
	 * AWS.CredentialProviderChain.defaultProviders = []
	 * ```
	 *
	 * In Node.js:
	 *
	 * ```javascript
	 * AWS.CredentialProviderChain.defaultProviders = [
	 *   function () { return new AWS.EnvironmentCredentials('AWS'); },
	 *   function () { return new AWS.EnvironmentCredentials('AMAZON'); },
	 *   function () { return new AWS.SharedIniFileCredentials(); },
	 *   function () { return new AWS.ECSCredentials(); },
	 *   function () { return new AWS.ProcessCredentials(); },
	 *   function () { return new AWS.TokenFileWebIdentityCredentials(); },
	 *   function () { return new AWS.EC2MetadataCredentials() }
	 * ]
	 * ```
	 */
	AWS.CredentialProviderChain.defaultProviders = [];

	/**
	 * @api private
	 */
	AWS.CredentialProviderChain.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
	  this.prototype.resolvePromise = AWS.util.promisifyMethod('resolve', PromiseDependency);
	};

	/**
	 * @api private
	 */
	AWS.CredentialProviderChain.deletePromisesFromClass = function deletePromisesFromClass() {
	  delete this.prototype.resolvePromise;
	};

	AWS.util.addPromises(AWS.CredentialProviderChain);


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);
	var inherit = AWS.util.inherit;

	/**
	 * The endpoint that a service will talk to, for example,
	 * `'https://ec2.ap-southeast-1.amazonaws.com'`. If
	 * you need to override an endpoint for a service, you can
	 * set the endpoint on a service by passing the endpoint
	 * object with the `endpoint` option key:
	 *
	 * ```javascript
	 * var ep = new AWS.Endpoint('awsproxy.example.com');
	 * var s3 = new AWS.S3({endpoint: ep});
	 * s3.service.endpoint.hostname == 'awsproxy.example.com'
	 * ```
	 *
	 * Note that if you do not specify a protocol, the protocol will
	 * be selected based on your current {AWS.config} configuration.
	 *
	 * @!attribute protocol
	 *   @return [String] the protocol (http or https) of the endpoint
	 *     URL
	 * @!attribute hostname
	 *   @return [String] the host portion of the endpoint, e.g.,
	 *     example.com
	 * @!attribute host
	 *   @return [String] the host portion of the endpoint including
	 *     the port, e.g., example.com:80
	 * @!attribute port
	 *   @return [Integer] the port of the endpoint
	 * @!attribute href
	 *   @return [String] the full URL of the endpoint
	 */
	AWS.Endpoint = inherit({

	  /**
	   * @overload Endpoint(endpoint)
	   *   Constructs a new endpoint given an endpoint URL. If the
	   *   URL omits a protocol (http or https), the default protocol
	   *   set in the global {AWS.config} will be used.
	   *   @param endpoint [String] the URL to construct an endpoint from
	   */
	  constructor: function Endpoint(endpoint, config) {
	    AWS.util.hideProperties(this, ['slashes', 'auth', 'hash', 'search', 'query']);

	    if (typeof endpoint === 'undefined' || endpoint === null) {
	      throw new Error('Invalid endpoint: ' + endpoint);
	    } else if (typeof endpoint !== 'string') {
	      return AWS.util.copy(endpoint);
	    }

	    if (!endpoint.match(/^http/)) {
	      var useSSL = config && config.sslEnabled !== undefined ?
	        config.sslEnabled : AWS.config.sslEnabled;
	      endpoint = (useSSL ? 'https' : 'http') + '://' + endpoint;
	    }

	    AWS.util.update(this, AWS.util.urlParse(endpoint));

	    // Ensure the port property is set as an integer
	    if (this.port) {
	      this.port = parseInt(this.port, 10);
	    } else {
	      this.port = this.protocol === 'https:' ? 443 : 80;
	    }
	  }

	});

	/**
	 * The low level HTTP request object, encapsulating all HTTP header
	 * and body data sent by a service request.
	 *
	 * @!attribute method
	 *   @return [String] the HTTP method of the request
	 * @!attribute path
	 *   @return [String] the path portion of the URI, e.g.,
	 *     "/list/?start=5&num=10"
	 * @!attribute headers
	 *   @return [map<String,String>]
	 *     a map of header keys and their respective values
	 * @!attribute body
	 *   @return [String] the request body payload
	 * @!attribute endpoint
	 *   @return [AWS.Endpoint] the endpoint for the request
	 * @!attribute region
	 *   @api private
	 *   @return [String] the region, for signing purposes only.
	 */
	AWS.HttpRequest = inherit({

	  /**
	   * @api private
	   */
	  constructor: function HttpRequest(endpoint, region) {
	    endpoint = new AWS.Endpoint(endpoint);
	    this.method = 'POST';
	    this.path = endpoint.path || '/';
	    this.headers = {};
	    this.body = '';
	    this.endpoint = endpoint;
	    this.region = region;
	    this._userAgent = '';
	    this.setUserAgent();
	  },

	  /**
	   * @api private
	   */
	  setUserAgent: function setUserAgent() {
	    this._userAgent = this.headers[this.getUserAgentHeaderName()] = AWS.util.userAgent();
	  },

	  getUserAgentHeaderName: function getUserAgentHeaderName() {
	    var prefix = AWS.util.isBrowser() ? 'X-Amz-' : '';
	    return prefix + 'User-Agent';
	  },

	  /**
	   * @api private
	   */
	  appendToUserAgent: function appendToUserAgent(agentPartial) {
	    if (typeof agentPartial === 'string' && agentPartial) {
	      this._userAgent += ' ' + agentPartial;
	    }
	    this.headers[this.getUserAgentHeaderName()] = this._userAgent;
	  },

	  /**
	   * @api private
	   */
	  getUserAgent: function getUserAgent() {
	    return this._userAgent;
	  },

	  /**
	   * @return [String] the part of the {path} excluding the
	   *   query string
	   */
	  pathname: function pathname() {
	    return this.path.split('?', 1)[0];
	  },

	  /**
	   * @return [String] the query string portion of the {path}
	   */
	  search: function search() {
	    var query = this.path.split('?', 2)[1];
	    if (query) {
	      query = AWS.util.queryStringParse(query);
	      return AWS.util.queryParamsToString(query);
	    }
	    return '';
	  },

	  /**
	   * @api private
	   * update httpRequest endpoint with endpoint string
	   */
	  updateEndpoint: function updateEndpoint(endpointStr) {
	    var newEndpoint = new AWS.Endpoint(endpointStr);
	    this.endpoint = newEndpoint;
	    this.path = newEndpoint.path || '/';
	    if (this.headers['Host']) {
	      this.headers['Host'] = newEndpoint.host;
	    }
	  }
	});

	/**
	 * The low level HTTP response object, encapsulating all HTTP header
	 * and body data returned from the request.
	 *
	 * @!attribute statusCode
	 *   @return [Integer] the HTTP status code of the response (e.g., 200, 404)
	 * @!attribute headers
	 *   @return [map<String,String>]
	 *      a map of response header keys and their respective values
	 * @!attribute body
	 *   @return [String] the response body payload
	 * @!attribute [r] streaming
	 *   @return [Boolean] whether this response is being streamed at a low-level.
	 *     Defaults to `false` (buffered reads). Do not modify this manually, use
	 *     {createUnbufferedStream} to convert the stream to unbuffered mode
	 *     instead.
	 */
	AWS.HttpResponse = inherit({

	  /**
	   * @api private
	   */
	  constructor: function HttpResponse() {
	    this.statusCode = undefined;
	    this.headers = {};
	    this.body = undefined;
	    this.streaming = false;
	    this.stream = null;
	  },

	  /**
	   * Disables buffering on the HTTP response and returns the stream for reading.
	   * @return [Stream, XMLHttpRequest, null] the underlying stream object.
	   *   Use this object to directly read data off of the stream.
	   * @note This object is only available after the {AWS.Request~httpHeaders}
	   *   event has fired. This method must be called prior to
	   *   {AWS.Request~httpData}.
	   * @example Taking control of a stream
	   *   request.on('httpHeaders', function(statusCode, headers) {
	   *     if (statusCode < 300) {
	   *       if (headers.etag === 'xyz') {
	   *         // pipe the stream, disabling buffering
	   *         var stream = this.response.httpResponse.createUnbufferedStream();
	   *         stream.pipe(process.stdout);
	   *       } else { // abort this request and set a better error message
	   *         this.abort();
	   *         this.response.error = new Error('Invalid ETag');
	   *       }
	   *     }
	   *   }).send(console.log);
	   */
	  createUnbufferedStream: function createUnbufferedStream() {
	    this.streaming = true;
	    return this.stream;
	  }
	});


	AWS.HttpClient = inherit({});

	/**
	 * @api private
	 */
	AWS.HttpClient.getInstance = function getInstance() {
	  if (this.singleton === undefined) {
	    this.singleton = new this();
	  }
	  return this.singleton;
	};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);
	var SequentialExecutor = __webpack_require__(36);
	var DISCOVER_ENDPOINT = __webpack_require__(46).discoverEndpoint;
	/**
	 * The namespace used to register global event listeners for request building
	 * and sending.
	 */
	AWS.EventListeners = {
	  /**
	   * @!attribute VALIDATE_CREDENTIALS
	   *   A request listener that validates whether the request is being
	   *   sent with credentials.
	   *   Handles the {AWS.Request~validate 'validate' Request event}
	   *   @example Sending a request without validating credentials
	   *     var listener = AWS.EventListeners.Core.VALIDATE_CREDENTIALS;
	   *     request.removeListener('validate', listener);
	   *   @readonly
	   *   @return [Function]
	   * @!attribute VALIDATE_REGION
	   *   A request listener that validates whether the region is set
	   *   for a request.
	   *   Handles the {AWS.Request~validate 'validate' Request event}
	   *   @example Sending a request without validating region configuration
	   *     var listener = AWS.EventListeners.Core.VALIDATE_REGION;
	   *     request.removeListener('validate', listener);
	   *   @readonly
	   *   @return [Function]
	   * @!attribute VALIDATE_PARAMETERS
	   *   A request listener that validates input parameters in a request.
	   *   Handles the {AWS.Request~validate 'validate' Request event}
	   *   @example Sending a request without validating parameters
	   *     var listener = AWS.EventListeners.Core.VALIDATE_PARAMETERS;
	   *     request.removeListener('validate', listener);
	   *   @example Disable parameter validation globally
	   *     AWS.EventListeners.Core.removeListener('validate',
	   *       AWS.EventListeners.Core.VALIDATE_REGION);
	   *   @readonly
	   *   @return [Function]
	   * @!attribute SEND
	   *   A request listener that initiates the HTTP connection for a
	   *   request being sent. Handles the {AWS.Request~send 'send' Request event}
	   *   @example Replacing the HTTP handler
	   *     var listener = AWS.EventListeners.Core.SEND;
	   *     request.removeListener('send', listener);
	   *     request.on('send', function(response) {
	   *       customHandler.send(response);
	   *     });
	   *   @return [Function]
	   *   @readonly
	   * @!attribute HTTP_DATA
	   *   A request listener that reads data from the HTTP connection in order
	   *   to build the response data.
	   *   Handles the {AWS.Request~httpData 'httpData' Request event}.
	   *   Remove this handler if you are overriding the 'httpData' event and
	   *   do not want extra data processing and buffering overhead.
	   *   @example Disabling default data processing
	   *     var listener = AWS.EventListeners.Core.HTTP_DATA;
	   *     request.removeListener('httpData', listener);
	   *   @return [Function]
	   *   @readonly
	   */
	  Core: {} /* doc hack */
	};

	/**
	 * @api private
	 */
	function getOperationAuthtype(req) {
	  if (!req.service.api.operations) {
	    return '';
	  }
	  var operation = req.service.api.operations[req.operation];
	  return operation ? operation.authtype : '';
	}

	AWS.EventListeners = {
	  Core: new SequentialExecutor().addNamedListeners(function(add, addAsync) {
	    addAsync('VALIDATE_CREDENTIALS', 'validate',
	        function VALIDATE_CREDENTIALS(req, done) {
	      if (!req.service.api.signatureVersion && !req.service.config.signatureVersion) return done(); // none
	      req.service.config.getCredentials(function(err) {
	        if (err) {
	          req.response.error = AWS.util.error(err,
	            {code: 'CredentialsError', message: 'Missing credentials in config, if using AWS_CONFIG_FILE, set AWS_SDK_LOAD_CONFIG=1'});
	        }
	        done();
	      });
	    });

	    add('VALIDATE_REGION', 'validate', function VALIDATE_REGION(req) {
	      if (!req.service.isGlobalEndpoint) {
	        var dnsHostRegex = new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/);
	        if (!req.service.config.region) {
	          req.response.error = AWS.util.error(new Error(),
	            {code: 'ConfigError', message: 'Missing region in config'});
	        } else if (!dnsHostRegex.test(req.service.config.region)) {
	          req.response.error = AWS.util.error(new Error(),
	            {code: 'ConfigError', message: 'Invalid region in config'});
	        }
	      }
	    });

	    add('BUILD_IDEMPOTENCY_TOKENS', 'validate', function BUILD_IDEMPOTENCY_TOKENS(req) {
	      if (!req.service.api.operations) {
	        return;
	      }
	      var operation = req.service.api.operations[req.operation];
	      if (!operation) {
	        return;
	      }
	      var idempotentMembers = operation.idempotentMembers;
	      if (!idempotentMembers.length) {
	        return;
	      }
	      // creates a copy of params so user's param object isn't mutated
	      var params = AWS.util.copy(req.params);
	      for (var i = 0, iLen = idempotentMembers.length; i < iLen; i++) {
	        if (!params[idempotentMembers[i]]) {
	          // add the member
	          params[idempotentMembers[i]] = AWS.util.uuid.v4();
	        }
	      }
	      req.params = params;
	    });

	    add('VALIDATE_PARAMETERS', 'validate', function VALIDATE_PARAMETERS(req) {
	      if (!req.service.api.operations) {
	        return;
	      }
	      var rules = req.service.api.operations[req.operation].input;
	      var validation = req.service.config.paramValidation;
	      new AWS.ParamValidator(validation).validate(rules, req.params);
	    });

	    add('COMPUTE_CHECKSUM', 'afterBuild', function COMPUTE_CHECKSUM(req) {
	      if (!req.service.api.operations) {
	        return;
	      }
	      var operation = req.service.api.operations[req.operation];
	      if (!operation) {
	        return;
	      }
	      var body = req.httpRequest.body;
	      var isNonStreamingPayload = body && (AWS.util.Buffer.isBuffer(body) || typeof body === 'string');
	      var headers = req.httpRequest.headers;
	      if (
	        operation.httpChecksumRequired &&
	        req.service.config.computeChecksums &&
	        isNonStreamingPayload &&
	        !headers['Content-MD5']
	      ) {
	        var md5 = AWS.util.crypto.md5(body, 'base64');
	        headers['Content-MD5'] = md5;
	      }
	    });

	    addAsync('COMPUTE_SHA256', 'afterBuild', function COMPUTE_SHA256(req, done) {
	      req.haltHandlersOnError();
	      if (!req.service.api.operations) {
	        return;
	      }
	      var operation = req.service.api.operations[req.operation];
	      var authtype = operation ? operation.authtype : '';
	      if (!req.service.api.signatureVersion && !authtype && !req.service.config.signatureVersion) return done(); // none
	      if (req.service.getSignerClass(req) === AWS.Signers.V4) {
	        var body = req.httpRequest.body || '';
	        if (authtype.indexOf('unsigned-body') >= 0) {
	          req.httpRequest.headers['X-Amz-Content-Sha256'] = 'UNSIGNED-PAYLOAD';
	          return done();
	        }
	        AWS.util.computeSha256(body, function(err, sha) {
	          if (err) {
	            done(err);
	          }
	          else {
	            req.httpRequest.headers['X-Amz-Content-Sha256'] = sha;
	            done();
	          }
	        });
	      } else {
	        done();
	      }
	    });

	    add('SET_CONTENT_LENGTH', 'afterBuild', function SET_CONTENT_LENGTH(req) {
	      var authtype = getOperationAuthtype(req);
	      var payloadMember = AWS.util.getRequestPayloadShape(req);
	      if (req.httpRequest.headers['Content-Length'] === undefined) {
	        try {
	          var length = AWS.util.string.byteLength(req.httpRequest.body);
	          req.httpRequest.headers['Content-Length'] = length;
	        } catch (err) {
	          if (payloadMember && payloadMember.isStreaming) {
	            if (payloadMember.requiresLength) {
	              //streaming payload requires length(s3, glacier)
	              throw err;
	            } else if (authtype.indexOf('unsigned-body') >= 0) {
	              //unbounded streaming payload(lex, mediastore)
	              req.httpRequest.headers['Transfer-Encoding'] = 'chunked';
	              return;
	            } else {
	              throw err;
	            }
	          }
	          throw err;
	        }
	      }
	    });

	    add('SET_HTTP_HOST', 'afterBuild', function SET_HTTP_HOST(req) {
	      req.httpRequest.headers['Host'] = req.httpRequest.endpoint.host;
	    });

	    add('RESTART', 'restart', function RESTART() {
	      var err = this.response.error;
	      if (!err || !err.retryable) return;

	      this.httpRequest = new AWS.HttpRequest(
	        this.service.endpoint,
	        this.service.region
	      );

	      if (this.response.retryCount < this.service.config.maxRetries) {
	        this.response.retryCount++;
	      } else {
	        this.response.error = null;
	      }
	    });

	    var addToHead = true;
	    addAsync('DISCOVER_ENDPOINT', 'sign', DISCOVER_ENDPOINT, addToHead);

	    addAsync('SIGN', 'sign', function SIGN(req, done) {
	      var service = req.service;
	      var operations = req.service.api.operations || {};
	      var operation = operations[req.operation];
	      var authtype = operation ? operation.authtype : '';
	      if (!service.api.signatureVersion && !authtype && !service.config.signatureVersion) return done(); // none

	      service.config.getCredentials(function (err, credentials) {
	        if (err) {
	          req.response.error = err;
	          return done();
	        }

	        try {
	          var date = service.getSkewCorrectedDate();
	          var SignerClass = service.getSignerClass(req);
	          var signer = new SignerClass(req.httpRequest,
	            service.getSigningName(req),
	            {
	              signatureCache: service.config.signatureCache,
	              operation: operation,
	              signatureVersion: service.api.signatureVersion
	            });
	          signer.setServiceClientId(service._clientId);

	          // clear old authorization headers
	          delete req.httpRequest.headers['Authorization'];
	          delete req.httpRequest.headers['Date'];
	          delete req.httpRequest.headers['X-Amz-Date'];

	          // add new authorization
	          signer.addAuthorization(credentials, date);
	          req.signedAt = date;
	        } catch (e) {
	          req.response.error = e;
	        }
	        done();
	      });
	    });

	    add('VALIDATE_RESPONSE', 'validateResponse', function VALIDATE_RESPONSE(resp) {
	      if (this.service.successfulResponse(resp, this)) {
	        resp.data = {};
	        resp.error = null;
	      } else {
	        resp.data = null;
	        resp.error = AWS.util.error(new Error(),
	          {code: 'UnknownError', message: 'An unknown error occurred.'});
	      }
	    });

	    addAsync('SEND', 'send', function SEND(resp, done) {
	      resp.httpResponse._abortCallback = done;
	      resp.error = null;
	      resp.data = null;

	      function callback(httpResp) {
	        resp.httpResponse.stream = httpResp;
	        var stream = resp.request.httpRequest.stream;
	        var service = resp.request.service;
	        var api = service.api;
	        var operationName = resp.request.operation;
	        var operation = api.operations[operationName] || {};

	        httpResp.on('headers', function onHeaders(statusCode, headers, statusMessage) {
	          resp.request.emit(
	            'httpHeaders',
	            [statusCode, headers, resp, statusMessage]
	          );

	          if (!resp.httpResponse.streaming) {
	            if (AWS.HttpClient.streamsApiVersion === 2) { // streams2 API check
	              // if we detect event streams, we're going to have to
	              // return the stream immediately
	              if (operation.hasEventOutput && service.successfulResponse(resp)) {
	                // skip reading the IncomingStream
	                resp.request.emit('httpDone');
	                done();
	                return;
	              }

	              httpResp.on('readable', function onReadable() {
	                var data = httpResp.read();
	                if (data !== null) {
	                  resp.request.emit('httpData', [data, resp]);
	                }
	              });
	            } else { // legacy streams API
	              httpResp.on('data', function onData(data) {
	                resp.request.emit('httpData', [data, resp]);
	              });
	            }
	          }
	        });

	        httpResp.on('end', function onEnd() {
	          if (!stream || !stream.didCallback) {
	            if (AWS.HttpClient.streamsApiVersion === 2 && (operation.hasEventOutput && service.successfulResponse(resp))) {
	              // don't concatenate response chunks when streaming event stream data when response is successful
	              return;
	            }
	            resp.request.emit('httpDone');
	            done();
	          }
	        });
	      }

	      function progress(httpResp) {
	        httpResp.on('sendProgress', function onSendProgress(value) {
	          resp.request.emit('httpUploadProgress', [value, resp]);
	        });

	        httpResp.on('receiveProgress', function onReceiveProgress(value) {
	          resp.request.emit('httpDownloadProgress', [value, resp]);
	        });
	      }

	      function error(err) {
	        if (err.code !== 'RequestAbortedError') {
	          var errCode = err.code === 'TimeoutError' ? err.code : 'NetworkingError';
	          err = AWS.util.error(err, {
	            code: errCode,
	            region: resp.request.httpRequest.region,
	            hostname: resp.request.httpRequest.endpoint.hostname,
	            retryable: true
	          });
	        }
	        resp.error = err;
	        resp.request.emit('httpError', [resp.error, resp], function() {
	          done();
	        });
	      }

	      function executeSend() {
	        var http = AWS.HttpClient.getInstance();
	        var httpOptions = resp.request.service.config.httpOptions || {};
	        try {
	          var stream = http.handleRequest(resp.request.httpRequest, httpOptions,
	                                          callback, error);
	          progress(stream);
	        } catch (err) {
	          error(err);
	        }
	      }
	      var timeDiff = (resp.request.service.getSkewCorrectedDate() - this.signedAt) / 1000;
	      if (timeDiff >= 60 * 10) { // if we signed 10min ago, re-sign
	        this.emit('sign', [this], function(err) {
	          if (err) done(err);
	          else executeSend();
	        });
	      } else {
	        executeSend();
	      }
	    });

	    add('HTTP_HEADERS', 'httpHeaders',
	        function HTTP_HEADERS(statusCode, headers, resp, statusMessage) {
	      resp.httpResponse.statusCode = statusCode;
	      resp.httpResponse.statusMessage = statusMessage;
	      resp.httpResponse.headers = headers;
	      resp.httpResponse.body = AWS.util.buffer.toBuffer('');
	      resp.httpResponse.buffers = [];
	      resp.httpResponse.numBytes = 0;
	      var dateHeader = headers.date || headers.Date;
	      var service = resp.request.service;
	      if (dateHeader) {
	        var serverTime = Date.parse(dateHeader);
	        if (service.config.correctClockSkew
	            && service.isClockSkewed(serverTime)) {
	          service.applyClockOffset(serverTime);
	        }
	      }
	    });

	    add('HTTP_DATA', 'httpData', function HTTP_DATA(chunk, resp) {
	      if (chunk) {
	        if (AWS.util.isNode()) {
	          resp.httpResponse.numBytes += chunk.length;

	          var total = resp.httpResponse.headers['content-length'];
	          var progress = { loaded: resp.httpResponse.numBytes, total: total };
	          resp.request.emit('httpDownloadProgress', [progress, resp]);
	        }

	        resp.httpResponse.buffers.push(AWS.util.buffer.toBuffer(chunk));
	      }
	    });

	    add('HTTP_DONE', 'httpDone', function HTTP_DONE(resp) {
	      // convert buffers array into single buffer
	      if (resp.httpResponse.buffers && resp.httpResponse.buffers.length > 0) {
	        var body = AWS.util.buffer.concat(resp.httpResponse.buffers);
	        resp.httpResponse.body = body;
	      }
	      delete resp.httpResponse.numBytes;
	      delete resp.httpResponse.buffers;
	    });

	    add('FINALIZE_ERROR', 'retry', function FINALIZE_ERROR(resp) {
	      if (resp.httpResponse.statusCode) {
	        resp.error.statusCode = resp.httpResponse.statusCode;
	        if (resp.error.retryable === undefined) {
	          resp.error.retryable = this.service.retryableError(resp.error, this);
	        }
	      }
	    });

	    add('INVALIDATE_CREDENTIALS', 'retry', function INVALIDATE_CREDENTIALS(resp) {
	      if (!resp.error) return;
	      switch (resp.error.code) {
	        case 'RequestExpired': // EC2 only
	        case 'ExpiredTokenException':
	        case 'ExpiredToken':
	          resp.error.retryable = true;
	          resp.request.service.config.credentials.expired = true;
	      }
	    });

	    add('EXPIRED_SIGNATURE', 'retry', function EXPIRED_SIGNATURE(resp) {
	      var err = resp.error;
	      if (!err) return;
	      if (typeof err.code === 'string' && typeof err.message === 'string') {
	        if (err.code.match(/Signature/) && err.message.match(/expired/)) {
	          resp.error.retryable = true;
	        }
	      }
	    });

	    add('CLOCK_SKEWED', 'retry', function CLOCK_SKEWED(resp) {
	      if (!resp.error) return;
	      if (this.service.clockSkewError(resp.error)
	          && this.service.config.correctClockSkew) {
	        resp.error.retryable = true;
	      }
	    });

	    add('REDIRECT', 'retry', function REDIRECT(resp) {
	      if (resp.error && resp.error.statusCode >= 300 &&
	          resp.error.statusCode < 400 && resp.httpResponse.headers['location']) {
	        this.httpRequest.endpoint =
	          new AWS.Endpoint(resp.httpResponse.headers['location']);
	        this.httpRequest.headers['Host'] = this.httpRequest.endpoint.host;
	        resp.error.redirect = true;
	        resp.error.retryable = true;
	      }
	    });

	    add('RETRY_CHECK', 'retry', function RETRY_CHECK(resp) {
	      if (resp.error) {
	        if (resp.error.redirect && resp.redirectCount < resp.maxRedirects) {
	          resp.error.retryDelay = 0;
	        } else if (resp.retryCount < resp.maxRetries) {
	          resp.error.retryDelay = this.service.retryDelays(resp.retryCount, resp.error) || 0;
	        }
	      }
	    });

	    addAsync('RESET_RETRY_STATE', 'afterRetry', function RESET_RETRY_STATE(resp, done) {
	      var delay, willRetry = false;

	      if (resp.error) {
	        delay = resp.error.retryDelay || 0;
	        if (resp.error.retryable && resp.retryCount < resp.maxRetries) {
	          resp.retryCount++;
	          willRetry = true;
	        } else if (resp.error.redirect && resp.redirectCount < resp.maxRedirects) {
	          resp.redirectCount++;
	          willRetry = true;
	        }
	      }

	      // delay < 0 is a signal from customBackoff to skip retries
	      if (willRetry && delay >= 0) {
	        resp.error = null;
	        setTimeout(done, delay);
	      } else {
	        done();
	      }
	    });
	  }),

	  CorePost: new SequentialExecutor().addNamedListeners(function(add) {
	    add('EXTRACT_REQUEST_ID', 'extractData', AWS.util.extractRequestId);
	    add('EXTRACT_REQUEST_ID', 'extractError', AWS.util.extractRequestId);

	    add('ENOTFOUND_ERROR', 'httpError', function ENOTFOUND_ERROR(err) {
	      function isDNSError(err) {
	        return err.errno === 'ENOTFOUND' ||
	          typeof err.errno === 'number' &&
	          typeof AWS.util.getSystemErrorName === 'function' &&
	          ['EAI_NONAME', 'EAI_NODATA'].indexOf(AWS.util.getSystemErrorName(err.errno) >= 0);
	      }
	      if (err.code === 'NetworkingError' && isDNSError(err)) {
	        var message = 'Inaccessible host: `' + err.hostname + '\' at port `' + err.port +
	          '\'. This service may not be available in the `' + err.region +
	          '\' region.';
	        this.response.error = AWS.util.error(new Error(message), {
	          code: 'UnknownEndpoint',
	          region: err.region,
	          hostname: err.hostname,
	          retryable: true,
	          originalError: err
	        });
	      }
	    });
	  }),

	  Logger: new SequentialExecutor().addNamedListeners(function(add) {
	    add('LOG_REQUEST', 'complete', function LOG_REQUEST(resp) {
	      var req = resp.request;
	      var logger = req.service.config.logger;
	      if (!logger) return;
	      function filterSensitiveLog(inputShape, shape) {
	        if (!shape) {
	          return shape;
	        }
	        if (inputShape.isSensitive) {
	          return '***SensitiveInformation***';
	        }
	        switch (inputShape.type) {
	          case 'structure':
	            var struct = {};
	            AWS.util.each(shape, function(subShapeName, subShape) {
	              if (Object.prototype.hasOwnProperty.call(inputShape.members, subShapeName)) {
	                struct[subShapeName] = filterSensitiveLog(inputShape.members[subShapeName], subShape);
	              } else {
	                struct[subShapeName] = subShape;
	              }
	            });
	            return struct;
	          case 'list':
	            var list = [];
	            AWS.util.arrayEach(shape, function(subShape, index) {
	              list.push(filterSensitiveLog(inputShape.member, subShape));
	            });
	            return list;
	          case 'map':
	            var map = {};
	            AWS.util.each(shape, function(key, value) {
	              map[key] = filterSensitiveLog(inputShape.value, value);
	            });
	            return map;
	          default:
	            return shape;
	        }
	      }

	      function buildMessage() {
	        var time = resp.request.service.getSkewCorrectedDate().getTime();
	        var delta = (time - req.startTime.getTime()) / 1000;
	        var ansi = logger.isTTY ? true : false;
	        var status = resp.httpResponse.statusCode;
	        var censoredParams = req.params;
	        if (
	          req.service.api.operations &&
	              req.service.api.operations[req.operation] &&
	              req.service.api.operations[req.operation].input
	        ) {
	          var inputShape = req.service.api.operations[req.operation].input;
	          censoredParams = filterSensitiveLog(inputShape, req.params);
	        }
	        var params = __webpack_require__(47).inspect(censoredParams, true, null);
	        var message = '';
	        if (ansi) message += '\x1B[33m';
	        message += '[AWS ' + req.service.serviceIdentifier + ' ' + status;
	        message += ' ' + delta.toString() + 's ' + resp.retryCount + ' retries]';
	        if (ansi) message += '\x1B[0;1m';
	        message += ' ' + AWS.util.string.lowerFirst(req.operation);
	        message += '(' + params + ')';
	        if (ansi) message += '\x1B[0m';
	        return message;
	      }

	      var line = buildMessage();
	      if (typeof logger.log === 'function') {
	        logger.log(line);
	      } else if (typeof logger.write === 'function') {
	        logger.write(line + '\n');
	      }
	    });
	  }),

	  Json: new SequentialExecutor().addNamedListeners(function(add) {
	    var svc = __webpack_require__(13);
	    add('BUILD', 'build', svc.buildRequest);
	    add('EXTRACT_DATA', 'extractData', svc.extractData);
	    add('EXTRACT_ERROR', 'extractError', svc.extractError);
	  }),

	  Rest: new SequentialExecutor().addNamedListeners(function(add) {
	    var svc = __webpack_require__(21);
	    add('BUILD', 'build', svc.buildRequest);
	    add('EXTRACT_DATA', 'extractData', svc.extractData);
	    add('EXTRACT_ERROR', 'extractError', svc.extractError);
	  }),

	  RestJson: new SequentialExecutor().addNamedListeners(function(add) {
	    var svc = __webpack_require__(22);
	    add('BUILD', 'build', svc.buildRequest);
	    add('EXTRACT_DATA', 'extractData', svc.extractData);
	    add('EXTRACT_ERROR', 'extractError', svc.extractError);
	  }),

	  RestXml: new SequentialExecutor().addNamedListeners(function(add) {
	    var svc = __webpack_require__(23);
	    add('BUILD', 'build', svc.buildRequest);
	    add('EXTRACT_DATA', 'extractData', svc.extractData);
	    add('EXTRACT_ERROR', 'extractError', svc.extractError);
	  }),

	  Query: new SequentialExecutor().addNamedListeners(function(add) {
	    var svc = __webpack_require__(17);
	    add('BUILD', 'build', svc.buildRequest);
	    add('EXTRACT_DATA', 'extractData', svc.extractData);
	    add('EXTRACT_ERROR', 'extractError', svc.extractError);
	  })
	};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var AWS = __webpack_require__(1);
	var util = __webpack_require__(2);
	var endpointDiscoveryEnabledEnvs = ['AWS_ENABLE_ENDPOINT_DISCOVERY', 'AWS_ENDPOINT_DISCOVERY_ENABLED'];

	/**
	 * Generate key (except resources and operation part) to index the endpoints in the cache
	 * If input shape has endpointdiscoveryid trait then use
	 *   accessKey + operation + resources + region + service as cache key
	 * If input shape doesn't have endpointdiscoveryid trait then use
	 *   accessKey + region + service as cache key
	 * @return [map<String,String>] object with keys to index endpoints.
	 * @api private
	 */
	function getCacheKey(request) {
	  var service = request.service;
	  var api = service.api || {};
	  var operations = api.operations;
	  var identifiers = {};
	  if (service.config.region) {
	    identifiers.region = service.config.region;
	  }
	  if (api.serviceId) {
	    identifiers.serviceId = api.serviceId;
	  }
	  if (service.config.credentials.accessKeyId) {
	    identifiers.accessKeyId = service.config.credentials.accessKeyId;
	  }
	  return identifiers;
	}

	/**
	 * Recursive helper for marshallCustomIdentifiers().
	 * Looks for required string input members that have 'endpointdiscoveryid' trait.
	 * @api private
	 */
	function marshallCustomIdentifiersHelper(result, params, shape) {
	  if (!shape || params === undefined || params === null) return;
	  if (shape.type === 'structure' && shape.required && shape.required.length > 0) {
	    util.arrayEach(shape.required, function(name) {
	      var memberShape = shape.members[name];
	      if (memberShape.endpointDiscoveryId === true) {
	        var locationName = memberShape.isLocationName ? memberShape.name : name;
	        result[locationName] = String(params[name]);
	      } else {
	        marshallCustomIdentifiersHelper(result, params[name], memberShape);
	      }
	    });
	  }
	}

	/**
	 * Get custom identifiers for cache key.
	 * Identifies custom identifiers by checking each shape's `endpointDiscoveryId` trait.
	 * @param [object] request object
	 * @param [object] input shape of the given operation's api
	 * @api private
	 */
	function marshallCustomIdentifiers(request, shape) {
	  var identifiers = {};
	  marshallCustomIdentifiersHelper(identifiers, request.params, shape);
	  return identifiers;
	}

	/**
	 * Call endpoint discovery operation when it's optional.
	 * When endpoint is available in cache then use the cached endpoints. If endpoints
	 * are unavailable then use regional endpoints and call endpoint discovery operation
	 * asynchronously. This is turned off by default.
	 * @param [object] request object
	 * @api private
	 */
	function optionalDiscoverEndpoint(request) {
	  var service = request.service;
	  var api = service.api;
	  var operationModel = api.operations ? api.operations[request.operation] : undefined;
	  var inputShape = operationModel ? operationModel.input : undefined;

	  var identifiers = marshallCustomIdentifiers(request, inputShape);
	  var cacheKey = getCacheKey(request);
	  if (Object.keys(identifiers).length > 0) {
	    cacheKey = util.update(cacheKey, identifiers);
	    if (operationModel) cacheKey.operation = operationModel.name;
	  }
	  var endpoints = AWS.endpointCache.get(cacheKey);
	  if (endpoints && endpoints.length === 1 && endpoints[0].Address === '') {
	    //endpoint operation is being made but response not yet received
	    //or endpoint operation just failed in 1 minute
	    return;
	  } else if (endpoints && endpoints.length > 0) {
	    //found endpoint record from cache
	    request.httpRequest.updateEndpoint(endpoints[0].Address);
	  } else {
	    //endpoint record not in cache or outdated. make discovery operation
	    var endpointRequest = service.makeRequest(api.endpointOperation, {
	      Operation: operationModel.name,
	      Identifiers: identifiers,
	    });
	    addApiVersionHeader(endpointRequest);
	    endpointRequest.removeListener('validate', AWS.EventListeners.Core.VALIDATE_PARAMETERS);
	    endpointRequest.removeListener('retry', AWS.EventListeners.Core.RETRY_CHECK);
	    //put in a placeholder for endpoints already requested, prevent
	    //too much in-flight calls
	    AWS.endpointCache.put(cacheKey, [{
	      Address: '',
	      CachePeriodInMinutes: 1
	    }]);
	    endpointRequest.send(function(err, data) {
	      if (data && data.Endpoints) {
	        AWS.endpointCache.put(cacheKey, data.Endpoints);
	      } else if (err) {
	        AWS.endpointCache.put(cacheKey, [{
	          Address: '',
	          CachePeriodInMinutes: 1 //not to make more endpoint operation in next 1 minute
	        }]);
	      }
	    });
	  }
	}

	var requestQueue = {};

	/**
	 * Call endpoint discovery operation when it's required.
	 * When endpoint is available in cache then use cached ones. If endpoints are
	 * unavailable then SDK should call endpoint operation then use returned new
	 * endpoint for the api call. SDK will automatically attempt to do endpoint
	 * discovery. This is turned off by default
	 * @param [object] request object
	 * @api private
	 */
	function requiredDiscoverEndpoint(request, done) {
	  var service = request.service;
	  var api = service.api;
	  var operationModel = api.operations ? api.operations[request.operation] : undefined;
	  var inputShape = operationModel ? operationModel.input : undefined;

	  var identifiers = marshallCustomIdentifiers(request, inputShape);
	  var cacheKey = getCacheKey(request);
	  if (Object.keys(identifiers).length > 0) {
	    cacheKey = util.update(cacheKey, identifiers);
	    if (operationModel) cacheKey.operation = operationModel.name;
	  }
	  var cacheKeyStr = AWS.EndpointCache.getKeyString(cacheKey);
	  var endpoints = AWS.endpointCache.get(cacheKeyStr); //endpoint cache also accepts string keys
	  if (endpoints && endpoints.length === 1 && endpoints[0].Address === '') {
	    //endpoint operation is being made but response not yet received
	    //push request object to a pending queue
	    if (!requestQueue[cacheKeyStr]) requestQueue[cacheKeyStr] = [];
	    requestQueue[cacheKeyStr].push({request: request, callback: done});
	    return;
	  } else if (endpoints && endpoints.length > 0) {
	    request.httpRequest.updateEndpoint(endpoints[0].Address);
	    done();
	  } else {
	    var endpointRequest = service.makeRequest(api.endpointOperation, {
	      Operation: operationModel.name,
	      Identifiers: identifiers,
	    });
	    endpointRequest.removeListener('validate', AWS.EventListeners.Core.VALIDATE_PARAMETERS);
	    addApiVersionHeader(endpointRequest);

	    //put in a placeholder for endpoints already requested, prevent
	    //too much in-flight calls
	    AWS.endpointCache.put(cacheKeyStr, [{
	      Address: '',
	      CachePeriodInMinutes: 60 //long-live cache
	    }]);
	    endpointRequest.send(function(err, data) {
	      if (err) {
	        request.response.error = util.error(err, { retryable: false });
	        AWS.endpointCache.remove(cacheKey);

	        //fail all the pending requests in batch
	        if (requestQueue[cacheKeyStr]) {
	          var pendingRequests = requestQueue[cacheKeyStr];
	          util.arrayEach(pendingRequests, function(requestContext) {
	            requestContext.request.response.error = util.error(err, { retryable: false });
	            requestContext.callback();
	          });
	          delete requestQueue[cacheKeyStr];
	        }
	      } else if (data) {
	        AWS.endpointCache.put(cacheKeyStr, data.Endpoints);
	        request.httpRequest.updateEndpoint(data.Endpoints[0].Address);

	        //update the endpoint for all the pending requests in batch
	        if (requestQueue[cacheKeyStr]) {
	          var pendingRequests = requestQueue[cacheKeyStr];
	          util.arrayEach(pendingRequests, function(requestContext) {
	            requestContext.request.httpRequest.updateEndpoint(data.Endpoints[0].Address);
	            requestContext.callback();
	          });
	          delete requestQueue[cacheKeyStr];
	        }
	      }
	      done();
	    });
	  }
	}

	/**
	 * add api version header to endpoint operation
	 * @api private
	 */
	function addApiVersionHeader(endpointRequest) {
	  var api = endpointRequest.service.api;
	  var apiVersion = api.apiVersion;
	  if (apiVersion && !endpointRequest.httpRequest.headers['x-amz-api-version']) {
	    endpointRequest.httpRequest.headers['x-amz-api-version'] = apiVersion;
	  }
	}

	/**
	 * If api call gets invalid endpoint exception, SDK should attempt to remove the invalid
	 * endpoint from cache.
	 * @api private
	 */
	function invalidateCachedEndpoints(response) {
	  var error = response.error;
	  var httpResponse = response.httpResponse;
	  if (error &&
	    (error.code === 'InvalidEndpointException' || httpResponse.statusCode === 421)
	  ) {
	    var request = response.request;
	    var operations = request.service.api.operations || {};
	    var inputShape = operations[request.operation] ? operations[request.operation].input : undefined;
	    var identifiers = marshallCustomIdentifiers(request, inputShape);
	    var cacheKey = getCacheKey(request);
	    if (Object.keys(identifiers).length > 0) {
	      cacheKey = util.update(cacheKey, identifiers);
	      if (operations[request.operation]) cacheKey.operation = operations[request.operation].name;
	    }
	    AWS.endpointCache.remove(cacheKey);
	  }
	}

	/**
	 * If endpoint is explicitly configured, SDK should not do endpoint discovery in anytime.
	 * @param [object] client Service client object.
	 * @api private
	 */
	function hasCustomEndpoint(client) {
	  //if set endpoint is set for specific client, enable endpoint discovery will raise an error.
	  if (client._originalConfig && client._originalConfig.endpoint && client._originalConfig.endpointDiscoveryEnabled === true) {
	    throw util.error(new Error(), {
	      code: 'ConfigurationException',
	      message: 'Custom endpoint is supplied; endpointDiscoveryEnabled must not be true.'
	    });
	  };
	  var svcConfig = AWS.config[client.serviceIdentifier] || {};
	  return Boolean(AWS.config.endpoint || svcConfig.endpoint || (client._originalConfig && client._originalConfig.endpoint));
	}

	/**
	 * @api private
	 */
	function isFalsy(value) {
	  return ['false', '0'].indexOf(value) >= 0;
	}

	/**
	 * If endpoint discovery should perform for this request when no operation requires endpoint
	 * discovery for the given service.
	 * SDK performs config resolution in order like below:
	 * 1. If set in client configuration.
	 * 2. If set in env AWS_ENABLE_ENDPOINT_DISCOVERY.
	 * 3. If set in shared ini config file with key 'endpoint_discovery_enabled'.
	 * @param [object] request request object.
	 * @returns [boolean|undefined] if endpoint discovery config is not set in any source, this
	 *  function returns undefined
	 * @api private
	 */
	function resolveEndpointDiscoveryConfig(request) {
	  var service = request.service || {};
	  if (service.config.endpointDiscoveryEnabled !== undefined) {
	    return service.config.endpointDiscoveryEnabled;
	  }

	  //shared ini file is only available in Node
	  //not to check env in browser
	  if (util.isBrowser()) return undefined;

	  // If any of recognized endpoint discovery config env is set
	  for (var i = 0; i < endpointDiscoveryEnabledEnvs.length; i++) {
	    var env = endpointDiscoveryEnabledEnvs[i];
	    if (Object.prototype.hasOwnProperty.call(process.env, env)) {
	      if (process.env[env] === '' || process.env[env] === undefined) {
	        throw util.error(new Error(), {
	          code: 'ConfigurationException',
	          message: 'environmental variable ' + env + ' cannot be set to nothing'
	        });
	      }
	      return !isFalsy(process.env[env]);
	    }
	  }

	  var configFile = {};
	  try {
	    configFile = AWS.util.iniLoader ? AWS.util.iniLoader.loadFrom({
	      isConfig: true,
	      filename: process.env[AWS.util.sharedConfigFileEnv]
	    }) : {};
	  } catch (e) {}
	  var sharedFileConfig = configFile[
	    process.env.AWS_PROFILE || AWS.util.defaultProfile
	  ] || {};
	  if (Object.prototype.hasOwnProperty.call(sharedFileConfig, 'endpoint_discovery_enabled')) {
	    if (sharedFileConfig.endpoint_discovery_enabled === undefined) {
	      throw util.error(new Error(), {
	        code: 'ConfigurationException',
	        message: 'config file entry \'endpoint_discovery_enabled\' cannot be set to nothing'
	      });
	    }
	    return !isFalsy(sharedFileConfig.endpoint_discovery_enabled);
	  }
	  return undefined;
	}

	/**
	 * attach endpoint discovery logic to request object
	 * @param [object] request
	 * @api private
	 */
	function discoverEndpoint(request, done) {
	  var service = request.service || {};
	  if (hasCustomEndpoint(service) || request.isPresigned()) return done();

	  var operations = service.api.operations || {};
	  var operationModel = operations[request.operation];
	  var isEndpointDiscoveryRequired = operationModel ? operationModel.endpointDiscoveryRequired : 'NULL';
	  var isEnabled = resolveEndpointDiscoveryConfig(request);
	  var hasRequiredEndpointDiscovery = service.api.hasRequiredEndpointDiscovery;
	  if (isEnabled || hasRequiredEndpointDiscovery) {
	    // Once a customer enables endpoint discovery, the SDK should start appending
	    // the string endpoint-discovery to the user-agent on all requests.
	    request.httpRequest.appendToUserAgent('endpoint-discovery');
	  }
	  switch (isEndpointDiscoveryRequired) {
	    case 'OPTIONAL':
	      if (isEnabled || hasRequiredEndpointDiscovery) {
	        // For a given service; if at least one operation requires endpoint discovery then the SDK must enable endpoint discovery
	        // by default for all operations of that service, including operations where endpoint discovery is optional.
	        optionalDiscoverEndpoint(request);
	        request.addNamedListener('INVALIDATE_CACHED_ENDPOINTS', 'extractError', invalidateCachedEndpoints);
	      }
	      done();
	      break;
	    case 'REQUIRED':
	      if (isEnabled === false) {
	        // For a given operation; if endpoint discovery is required and it has been disabled on the SDK client,
	        // then the SDK must return a clear and actionable exception.
	        request.response.error = util.error(new Error(), {
	          code: 'ConfigurationException',
	          message: 'Endpoint Discovery is disabled but ' + service.api.className + '.' + request.operation +
	                    '() requires it. Please check your configurations.'
	        });
	        done();
	        break;
	      }
	      request.addNamedListener('INVALIDATE_CACHED_ENDPOINTS', 'extractError', invalidateCachedEndpoints);
	      requiredDiscoverEndpoint(request, done);
	      break;
	    case 'NULL':
	    default:
	      done();
	      break;
	  }
	}

	module.exports = {
	  discoverEndpoint: discoverEndpoint,
	  requiredDiscoverEndpoint: requiredDiscoverEndpoint,
	  optionalDiscoverEndpoint: optionalDiscoverEndpoint,
	  marshallCustomIdentifiers: marshallCustomIdentifiers,
	  getCacheKey: getCacheKey,
	  invalidateCachedEndpoint: invalidateCachedEndpoints,
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(48);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(49);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(3)))

/***/ }),
/* 48 */
/***/ (function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ }),
/* 49 */
/***/ (function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var AWS = __webpack_require__(1);
	var AcceptorStateMachine = __webpack_require__(51);
	var inherit = AWS.util.inherit;
	var domain = AWS.util.domain;
	var jmespath = __webpack_require__(52);

	/**
	 * @api private
	 */
	var hardErrorStates = {success: 1, error: 1, complete: 1};

	function isTerminalState(machine) {
	  return Object.prototype.hasOwnProperty.call(hardErrorStates, machine._asm.currentState);
	}

	var fsm = new AcceptorStateMachine();
	fsm.setupStates = function() {
	  var transition = function(_, done) {
	    var self = this;
	    self._haltHandlersOnError = false;

	    self.emit(self._asm.currentState, function(err) {
	      if (err) {
	        if (isTerminalState(self)) {
	          if (domain && self.domain instanceof domain.Domain) {
	            err.domainEmitter = self;
	            err.domain = self.domain;
	            err.domainThrown = false;
	            self.domain.emit('error', err);
	          } else {
	            throw err;
	          }
	        } else {
	          self.response.error = err;
	          done(err);
	        }
	      } else {
	        done(self.response.error);
	      }
	    });

	  };

	  this.addState('validate', 'build', 'error', transition);
	  this.addState('build', 'afterBuild', 'restart', transition);
	  this.addState('afterBuild', 'sign', 'restart', transition);
	  this.addState('sign', 'send', 'retry', transition);
	  this.addState('retry', 'afterRetry', 'afterRetry', transition);
	  this.addState('afterRetry', 'sign', 'error', transition);
	  this.addState('send', 'validateResponse', 'retry', transition);
	  this.addState('validateResponse', 'extractData', 'extractError', transition);
	  this.addState('extractError', 'extractData', 'retry', transition);
	  this.addState('extractData', 'success', 'retry', transition);
	  this.addState('restart', 'build', 'error', transition);
	  this.addState('success', 'complete', 'complete', transition);
	  this.addState('error', 'complete', 'complete', transition);
	  this.addState('complete', null, null, transition);
	};
	fsm.setupStates();

	/**
	 * ## Asynchronous Requests
	 *
	 * All requests made through the SDK are asynchronous and use a
	 * callback interface. Each service method that kicks off a request
	 * returns an `AWS.Request` object that you can use to register
	 * callbacks.
	 *
	 * For example, the following service method returns the request
	 * object as "request", which can be used to register callbacks:
	 *
	 * ```javascript
	 * // request is an AWS.Request object
	 * var request = ec2.describeInstances();
	 *
	 * // register callbacks on request to retrieve response data
	 * request.on('success', function(response) {
	 *   console.log(response.data);
	 * });
	 * ```
	 *
	 * When a request is ready to be sent, the {send} method should
	 * be called:
	 *
	 * ```javascript
	 * request.send();
	 * ```
	 *
	 * Since registered callbacks may or may not be idempotent, requests should only
	 * be sent once. To perform the same operation multiple times, you will need to
	 * create multiple request objects, each with its own registered callbacks.
	 *
	 * ## Removing Default Listeners for Events
	 *
	 * Request objects are built with default listeners for the various events,
	 * depending on the service type. In some cases, you may want to remove
	 * some built-in listeners to customize behaviour. Doing this requires
	 * access to the built-in listener functions, which are exposed through
	 * the {AWS.EventListeners.Core} namespace. For instance, you may
	 * want to customize the HTTP handler used when sending a request. In this
	 * case, you can remove the built-in listener associated with the 'send'
	 * event, the {AWS.EventListeners.Core.SEND} listener and add your own.
	 *
	 * ## Multiple Callbacks and Chaining
	 *
	 * You can register multiple callbacks on any request object. The
	 * callbacks can be registered for different events, or all for the
	 * same event. In addition, you can chain callback registration, for
	 * example:
	 *
	 * ```javascript
	 * request.
	 *   on('success', function(response) {
	 *     console.log("Success!");
	 *   }).
	 *   on('error', function(error, response) {
	 *     console.log("Error!");
	 *   }).
	 *   on('complete', function(response) {
	 *     console.log("Always!");
	 *   }).
	 *   send();
	 * ```
	 *
	 * The above example will print either "Success! Always!", or "Error! Always!",
	 * depending on whether the request succeeded or not.
	 *
	 * @!attribute httpRequest
	 *   @readonly
	 *   @!group HTTP Properties
	 *   @return [AWS.HttpRequest] the raw HTTP request object
	 *     containing request headers and body information
	 *     sent by the service.
	 *
	 * @!attribute startTime
	 *   @readonly
	 *   @!group Operation Properties
	 *   @return [Date] the time that the request started
	 *
	 * @!group Request Building Events
	 *
	 * @!event validate(request)
	 *   Triggered when a request is being validated. Listeners
	 *   should throw an error if the request should not be sent.
	 *   @param request [Request] the request object being sent
	 *   @see AWS.EventListeners.Core.VALIDATE_CREDENTIALS
	 *   @see AWS.EventListeners.Core.VALIDATE_REGION
	 *   @example Ensuring that a certain parameter is set before sending a request
	 *     var req = s3.putObject(params);
	 *     req.on('validate', function() {
	 *       if (!req.params.Body.match(/^Hello\s/)) {
	 *         throw new Error('Body must start with "Hello "');
	 *       }
	 *     });
	 *     req.send(function(err, data) { ... });
	 *
	 * @!event build(request)
	 *   Triggered when the request payload is being built. Listeners
	 *   should fill the necessary information to send the request
	 *   over HTTP.
	 *   @param (see AWS.Request~validate)
	 *   @example Add a custom HTTP header to a request
	 *     var req = s3.putObject(params);
	 *     req.on('build', function() {
	 *       req.httpRequest.headers['Custom-Header'] = 'value';
	 *     });
	 *     req.send(function(err, data) { ... });
	 *
	 * @!event sign(request)
	 *   Triggered when the request is being signed. Listeners should
	 *   add the correct authentication headers and/or adjust the body,
	 *   depending on the authentication mechanism being used.
	 *   @param (see AWS.Request~validate)
	 *
	 * @!group Request Sending Events
	 *
	 * @!event send(response)
	 *   Triggered when the request is ready to be sent. Listeners
	 *   should call the underlying transport layer to initiate
	 *   the sending of the request.
	 *   @param response [Response] the response object
	 *   @context [Request] the request object that was sent
	 *   @see AWS.EventListeners.Core.SEND
	 *
	 * @!event retry(response)
	 *   Triggered when a request failed and might need to be retried or redirected.
	 *   If the response is retryable, the listener should set the
	 *   `response.error.retryable` property to `true`, and optionally set
	 *   `response.error.retryDelay` to the millisecond delay for the next attempt.
	 *   In the case of a redirect, `response.error.redirect` should be set to
	 *   `true` with `retryDelay` set to an optional delay on the next request.
	 *
	 *   If a listener decides that a request should not be retried,
	 *   it should set both `retryable` and `redirect` to false.
	 *
	 *   Note that a retryable error will be retried at most
	 *   {AWS.Config.maxRetries} times (based on the service object's config).
	 *   Similarly, a request that is redirected will only redirect at most
	 *   {AWS.Config.maxRedirects} times.
	 *
	 *   @param (see AWS.Request~send)
	 *   @context (see AWS.Request~send)
	 *   @example Adding a custom retry for a 404 response
	 *     request.on('retry', function(response) {
	 *       // this resource is not yet available, wait 10 seconds to get it again
	 *       if (response.httpResponse.statusCode === 404 && response.error) {
	 *         response.error.retryable = true;   // retry this error
	 *         response.error.retryDelay = 10000; // wait 10 seconds
	 *       }
	 *     });
	 *
	 * @!group Data Parsing Events
	 *
	 * @!event extractError(response)
	 *   Triggered on all non-2xx requests so that listeners can extract
	 *   error details from the response body. Listeners to this event
	 *   should set the `response.error` property.
	 *   @param (see AWS.Request~send)
	 *   @context (see AWS.Request~send)
	 *
	 * @!event extractData(response)
	 *   Triggered in successful requests to allow listeners to
	 *   de-serialize the response body into `response.data`.
	 *   @param (see AWS.Request~send)
	 *   @context (see AWS.Request~send)
	 *
	 * @!group Completion Events
	 *
	 * @!event success(response)
	 *   Triggered when the request completed successfully.
	 *   `response.data` will contain the response data and
	 *   `response.error` will be null.
	 *   @param (see AWS.Request~send)
	 *   @context (see AWS.Request~send)
	 *
	 * @!event error(error, response)
	 *   Triggered when an error occurs at any point during the
	 *   request. `response.error` will contain details about the error
	 *   that occurred. `response.data` will be null.
	 *   @param error [Error] the error object containing details about
	 *     the error that occurred.
	 *   @param (see AWS.Request~send)
	 *   @context (see AWS.Request~send)
	 *
	 * @!event complete(response)
	 *   Triggered whenever a request cycle completes. `response.error`
	 *   should be checked, since the request may have failed.
	 *   @param (see AWS.Request~send)
	 *   @context (see AWS.Request~send)
	 *
	 * @!group HTTP Events
	 *
	 * @!event httpHeaders(statusCode, headers, response, statusMessage)
	 *   Triggered when headers are sent by the remote server
	 *   @param statusCode [Integer] the HTTP response code
	 *   @param headers [map<String,String>] the response headers
	 *   @param (see AWS.Request~send)
	 *   @param statusMessage [String] A status message corresponding to the HTTP
	 *                                 response code
	 *   @context (see AWS.Request~send)
	 *
	 * @!event httpData(chunk, response)
	 *   Triggered when data is sent by the remote server
	 *   @param chunk [Buffer] the buffer data containing the next data chunk
	 *     from the server
	 *   @param (see AWS.Request~send)
	 *   @context (see AWS.Request~send)
	 *   @see AWS.EventListeners.Core.HTTP_DATA
	 *
	 * @!event httpUploadProgress(progress, response)
	 *   Triggered when the HTTP request has uploaded more data
	 *   @param progress [map] An object containing the `loaded` and `total` bytes
	 *     of the request.
	 *   @param (see AWS.Request~send)
	 *   @context (see AWS.Request~send)
	 *   @note This event will not be emitted in Node.js 0.8.x.
	 *
	 * @!event httpDownloadProgress(progress, response)
	 *   Triggered when the HTTP request has downloaded more data
	 *   @param progress [map] An object containing the `loaded` and `total` bytes
	 *     of the request.
	 *   @param (see AWS.Request~send)
	 *   @context (see AWS.Request~send)
	 *   @note This event will not be emitted in Node.js 0.8.x.
	 *
	 * @!event httpError(error, response)
	 *   Triggered when the HTTP request failed
	 *   @param error [Error] the error object that was thrown
	 *   @param (see AWS.Request~send)
	 *   @context (see AWS.Request~send)
	 *
	 * @!event httpDone(response)
	 *   Triggered when the server is finished sending data
	 *   @param (see AWS.Request~send)
	 *   @context (see AWS.Request~send)
	 *
	 * @see AWS.Response
	 */
	AWS.Request = inherit({

	  /**
	   * Creates a request for an operation on a given service with
	   * a set of input parameters.
	   *
	   * @param service [AWS.Service] the service to perform the operation on
	   * @param operation [String] the operation to perform on the service
	   * @param params [Object] parameters to send to the operation.
	   *   See the operation's documentation for the format of the
	   *   parameters.
	   */
	  constructor: function Request(service, operation, params) {
	    var endpoint = service.endpoint;
	    var region = service.config.region;
	    var customUserAgent = service.config.customUserAgent;

	    if (service.signingRegion) {
	      region = service.signingRegion;
	    } else if (service.isGlobalEndpoint) {
	      region = 'us-east-1';
	    }

	    this.domain = domain && domain.active;
	    this.service = service;
	    this.operation = operation;
	    this.params = params || {};
	    this.httpRequest = new AWS.HttpRequest(endpoint, region);
	    this.httpRequest.appendToUserAgent(customUserAgent);
	    this.startTime = service.getSkewCorrectedDate();

	    this.response = new AWS.Response(this);
	    this._asm = new AcceptorStateMachine(fsm.states, 'validate');
	    this._haltHandlersOnError = false;

	    AWS.SequentialExecutor.call(this);
	    this.emit = this.emitEvent;
	  },

	  /**
	   * @!group Sending a Request
	   */

	  /**
	   * @overload send(callback = null)
	   *   Sends the request object.
	   *
	   *   @callback callback function(err, data)
	   *     If a callback is supplied, it is called when a response is returned
	   *     from the service.
	   *     @context [AWS.Request] the request object being sent.
	   *     @param err [Error] the error object returned from the request.
	   *       Set to `null` if the request is successful.
	   *     @param data [Object] the de-serialized data returned from
	   *       the request. Set to `null` if a request error occurs.
	   *   @example Sending a request with a callback
	   *     request = s3.putObject({Bucket: 'bucket', Key: 'key'});
	   *     request.send(function(err, data) { console.log(err, data); });
	   *   @example Sending a request with no callback (using event handlers)
	   *     request = s3.putObject({Bucket: 'bucket', Key: 'key'});
	   *     request.on('complete', function(response) { ... }); // register a callback
	   *     request.send();
	   */
	  send: function send(callback) {
	    if (callback) {
	      // append to user agent
	      this.httpRequest.appendToUserAgent('callback');
	      this.on('complete', function (resp) {
	        callback.call(resp, resp.error, resp.data);
	      });
	    }
	    this.runTo();

	    return this.response;
	  },

	  /**
	   * @!method  promise()
	   *   Sends the request and returns a 'thenable' promise.
	   *
	   *   Two callbacks can be provided to the `then` method on the returned promise.
	   *   The first callback will be called if the promise is fulfilled, and the second
	   *   callback will be called if the promise is rejected.
	   *   @callback fulfilledCallback function(data)
	   *     Called if the promise is fulfilled.
	   *     @param data [Object] the de-serialized data returned from the request.
	   *   @callback rejectedCallback function(error)
	   *     Called if the promise is rejected.
	   *     @param error [Error] the error object returned from the request.
	   *   @return [Promise] A promise that represents the state of the request.
	   *   @example Sending a request using promises.
	   *     var request = s3.putObject({Bucket: 'bucket', Key: 'key'});
	   *     var result = request.promise();
	   *     result.then(function(data) { ... }, function(error) { ... });
	   */

	  /**
	   * @api private
	   */
	  build: function build(callback) {
	    return this.runTo('send', callback);
	  },

	  /**
	   * @api private
	   */
	  runTo: function runTo(state, done) {
	    this._asm.runTo(state, done, this);
	    return this;
	  },

	  /**
	   * Aborts a request, emitting the error and complete events.
	   *
	   * @!macro nobrowser
	   * @example Aborting a request after sending
	   *   var params = {
	   *     Bucket: 'bucket', Key: 'key',
	   *     Body: Buffer.alloc(1024 * 1024 * 5) // 5MB payload
	   *   };
	   *   var request = s3.putObject(params);
	   *   request.send(function (err, data) {
	   *     if (err) console.log("Error:", err.code, err.message);
	   *     else console.log(data);
	   *   });
	   *
	   *   // abort request in 1 second
	   *   setTimeout(request.abort.bind(request), 1000);
	   *
	   *   // prints "Error: RequestAbortedError Request aborted by user"
	   * @return [AWS.Request] the same request object, for chaining.
	   * @since v1.4.0
	   */
	  abort: function abort() {
	    this.removeAllListeners('validateResponse');
	    this.removeAllListeners('extractError');
	    this.on('validateResponse', function addAbortedError(resp) {
	      resp.error = AWS.util.error(new Error('Request aborted by user'), {
	         code: 'RequestAbortedError', retryable: false
	      });
	    });

	    if (this.httpRequest.stream && !this.httpRequest.stream.didCallback) { // abort HTTP stream
	      this.httpRequest.stream.abort();
	      if (this.httpRequest._abortCallback) {
	         this.httpRequest._abortCallback();
	      } else {
	        this.removeAllListeners('send'); // haven't sent yet, so let's not
	      }
	    }

	    return this;
	  },

	  /**
	   * Iterates over each page of results given a pageable request, calling
	   * the provided callback with each page of data. After all pages have been
	   * retrieved, the callback is called with `null` data.
	   *
	   * @note This operation can generate multiple requests to a service.
	   * @example Iterating over multiple pages of objects in an S3 bucket
	   *   var pages = 1;
	   *   s3.listObjects().eachPage(function(err, data) {
	   *     if (err) return;
	   *     console.log("Page", pages++);
	   *     console.log(data);
	   *   });
	   * @example Iterating over multiple pages with an asynchronous callback
	   *   s3.listObjects(params).eachPage(function(err, data, done) {
	   *     doSomethingAsyncAndOrExpensive(function() {
	   *       // The next page of results isn't fetched until done is called
	   *       done();
	   *     });
	   *   });
	   * @callback callback function(err, data, [doneCallback])
	   *   Called with each page of resulting data from the request. If the
	   *   optional `doneCallback` is provided in the function, it must be called
	   *   when the callback is complete.
	   *
	   *   @param err [Error] an error object, if an error occurred.
	   *   @param data [Object] a single page of response data. If there is no
	   *     more data, this object will be `null`.
	   *   @param doneCallback [Function] an optional done callback. If this
	   *     argument is defined in the function declaration, it should be called
	   *     when the next page is ready to be retrieved. This is useful for
	   *     controlling serial pagination across asynchronous operations.
	   *   @return [Boolean] if the callback returns `false`, pagination will
	   *     stop.
	   *
	   * @see AWS.Request.eachItem
	   * @see AWS.Response.nextPage
	   * @since v1.4.0
	   */
	  eachPage: function eachPage(callback) {
	    // Make all callbacks async-ish
	    callback = AWS.util.fn.makeAsync(callback, 3);

	    function wrappedCallback(response) {
	      callback.call(response, response.error, response.data, function (result) {
	        if (result === false) return;

	        if (response.hasNextPage()) {
	          response.nextPage().on('complete', wrappedCallback).send();
	        } else {
	          callback.call(response, null, null, AWS.util.fn.noop);
	        }
	      });
	    }

	    this.on('complete', wrappedCallback).send();
	  },

	  /**
	   * Enumerates over individual items of a request, paging the responses if
	   * necessary.
	   *
	   * @api experimental
	   * @since v1.4.0
	   */
	  eachItem: function eachItem(callback) {
	    var self = this;
	    function wrappedCallback(err, data) {
	      if (err) return callback(err, null);
	      if (data === null) return callback(null, null);

	      var config = self.service.paginationConfig(self.operation);
	      var resultKey = config.resultKey;
	      if (Array.isArray(resultKey)) resultKey = resultKey[0];
	      var items = jmespath.search(data, resultKey);
	      var continueIteration = true;
	      AWS.util.arrayEach(items, function(item) {
	        continueIteration = callback(null, item);
	        if (continueIteration === false) {
	          return AWS.util.abort;
	        }
	      });
	      return continueIteration;
	    }

	    this.eachPage(wrappedCallback);
	  },

	  /**
	   * @return [Boolean] whether the operation can return multiple pages of
	   *   response data.
	   * @see AWS.Response.eachPage
	   * @since v1.4.0
	   */
	  isPageable: function isPageable() {
	    return this.service.paginationConfig(this.operation) ? true : false;
	  },

	  /**
	   * Sends the request and converts the request object into a readable stream
	   * that can be read from or piped into a writable stream.
	   *
	   * @note The data read from a readable stream contains only
	   *   the raw HTTP body contents.
	   * @example Manually reading from a stream
	   *   request.createReadStream().on('data', function(data) {
	   *     console.log("Got data:", data.toString());
	   *   });
	   * @example Piping a request body into a file
	   *   var out = fs.createWriteStream('/path/to/outfile.jpg');
	   *   s3.service.getObject(params).createReadStream().pipe(out);
	   * @return [Stream] the readable stream object that can be piped
	   *   or read from (by registering 'data' event listeners).
	   * @!macro nobrowser
	   */
	  createReadStream: function createReadStream() {
	    var streams = AWS.util.stream;
	    var req = this;
	    var stream = null;

	    if (AWS.HttpClient.streamsApiVersion === 2) {
	      stream = new streams.PassThrough();
	      process.nextTick(function() { req.send(); });
	    } else {
	      stream = new streams.Stream();
	      stream.readable = true;

	      stream.sent = false;
	      stream.on('newListener', function(event) {
	        if (!stream.sent && event === 'data') {
	          stream.sent = true;
	          process.nextTick(function() { req.send(); });
	        }
	      });
	    }

	    this.on('error', function(err) {
	      stream.emit('error', err);
	    });

	    this.on('httpHeaders', function streamHeaders(statusCode, headers, resp) {
	      if (statusCode < 300) {
	        req.removeListener('httpData', AWS.EventListeners.Core.HTTP_DATA);
	        req.removeListener('httpError', AWS.EventListeners.Core.HTTP_ERROR);
	        req.on('httpError', function streamHttpError(error) {
	          resp.error = error;
	          resp.error.retryable = false;
	        });

	        var shouldCheckContentLength = false;
	        var expectedLen;
	        if (req.httpRequest.method !== 'HEAD') {
	          expectedLen = parseInt(headers['content-length'], 10);
	        }
	        if (expectedLen !== undefined && !isNaN(expectedLen) && expectedLen >= 0) {
	          shouldCheckContentLength = true;
	          var receivedLen = 0;
	        }

	        var checkContentLengthAndEmit = function checkContentLengthAndEmit() {
	          if (shouldCheckContentLength && receivedLen !== expectedLen) {
	            stream.emit('error', AWS.util.error(
	              new Error('Stream content length mismatch. Received ' +
	                receivedLen + ' of ' + expectedLen + ' bytes.'),
	              { code: 'StreamContentLengthMismatch' }
	            ));
	          } else if (AWS.HttpClient.streamsApiVersion === 2) {
	            stream.end();
	          } else {
	            stream.emit('end');
	          }
	        };

	        var httpStream = resp.httpResponse.createUnbufferedStream();

	        if (AWS.HttpClient.streamsApiVersion === 2) {
	          if (shouldCheckContentLength) {
	            var lengthAccumulator = new streams.PassThrough();
	            lengthAccumulator._write = function(chunk) {
	              if (chunk && chunk.length) {
	                receivedLen += chunk.length;
	              }
	              return streams.PassThrough.prototype._write.apply(this, arguments);
	            };

	            lengthAccumulator.on('end', checkContentLengthAndEmit);
	            stream.on('error', function(err) {
	              shouldCheckContentLength = false;
	              httpStream.unpipe(lengthAccumulator);
	              lengthAccumulator.emit('end');
	              lengthAccumulator.end();
	            });
	            httpStream.pipe(lengthAccumulator).pipe(stream, { end: false });
	          } else {
	            httpStream.pipe(stream);
	          }
	        } else {

	          if (shouldCheckContentLength) {
	            httpStream.on('data', function(arg) {
	              if (arg && arg.length) {
	                receivedLen += arg.length;
	              }
	            });
	          }

	          httpStream.on('data', function(arg) {
	            stream.emit('data', arg);
	          });
	          httpStream.on('end', checkContentLengthAndEmit);
	        }

	        httpStream.on('error', function(err) {
	          shouldCheckContentLength = false;
	          stream.emit('error', err);
	        });
	      }
	    });

	    return stream;
	  },

	  /**
	   * @param [Array,Response] args This should be the response object,
	   *   or an array of args to send to the event.
	   * @api private
	   */
	  emitEvent: function emit(eventName, args, done) {
	    if (typeof args === 'function') { done = args; args = null; }
	    if (!done) done = function() { };
	    if (!args) args = this.eventParameters(eventName, this.response);

	    var origEmit = AWS.SequentialExecutor.prototype.emit;
	    origEmit.call(this, eventName, args, function (err) {
	      if (err) this.response.error = err;
	      done.call(this, err);
	    });
	  },

	  /**
	   * @api private
	   */
	  eventParameters: function eventParameters(eventName) {
	    switch (eventName) {
	      case 'restart':
	      case 'validate':
	      case 'sign':
	      case 'build':
	      case 'afterValidate':
	      case 'afterBuild':
	        return [this];
	      case 'error':
	        return [this.response.error, this.response];
	      default:
	        return [this.response];
	    }
	  },

	  /**
	   * @api private
	   */
	  presign: function presign(expires, callback) {
	    if (!callback && typeof expires === 'function') {
	      callback = expires;
	      expires = null;
	    }
	    return new AWS.Signers.Presign().sign(this.toGet(), expires, callback);
	  },

	  /**
	   * @api private
	   */
	  isPresigned: function isPresigned() {
	    return Object.prototype.hasOwnProperty.call(this.httpRequest.headers, 'presigned-expires');
	  },

	  /**
	   * @api private
	   */
	  toUnauthenticated: function toUnauthenticated() {
	    this._unAuthenticated = true;
	    this.removeListener('validate', AWS.EventListeners.Core.VALIDATE_CREDENTIALS);
	    this.removeListener('sign', AWS.EventListeners.Core.SIGN);
	    return this;
	  },

	  /**
	   * @api private
	   */
	  toGet: function toGet() {
	    if (this.service.api.protocol === 'query' ||
	        this.service.api.protocol === 'ec2') {
	      this.removeListener('build', this.buildAsGet);
	      this.addListener('build', this.buildAsGet);
	    }
	    return this;
	  },

	  /**
	   * @api private
	   */
	  buildAsGet: function buildAsGet(request) {
	    request.httpRequest.method = 'GET';
	    request.httpRequest.path = request.service.endpoint.path +
	                               '?' + request.httpRequest.body;
	    request.httpRequest.body = '';

	    // don't need these headers on a GET request
	    delete request.httpRequest.headers['Content-Length'];
	    delete request.httpRequest.headers['Content-Type'];
	  },

	  /**
	   * @api private
	   */
	  haltHandlersOnError: function haltHandlersOnError() {
	    this._haltHandlersOnError = true;
	  }
	});

	/**
	 * @api private
	 */
	AWS.Request.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
	  this.prototype.promise = function promise() {
	    var self = this;
	    // append to user agent
	    this.httpRequest.appendToUserAgent('promise');
	    return new PromiseDependency(function(resolve, reject) {
	      self.on('complete', function(resp) {
	        if (resp.error) {
	          reject(resp.error);
	        } else {
	          // define $response property so that it is not enumerable
	          // this prevents circular reference errors when stringifying the JSON object
	          resolve(Object.defineProperty(
	            resp.data || {},
	            '$response',
	            {value: resp}
	          ));
	        }
	      });
	      self.runTo();
	    });
	  };
	};

	/**
	 * @api private
	 */
	AWS.Request.deletePromisesFromClass = function deletePromisesFromClass() {
	  delete this.prototype.promise;
	};

	AWS.util.addPromises(AWS.Request);

	AWS.util.mixin(AWS.Request, AWS.SequentialExecutor);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 51 */
/***/ (function(module, exports) {

	function AcceptorStateMachine(states, state) {
	  this.currentState = state || null;
	  this.states = states || {};
	}

	AcceptorStateMachine.prototype.runTo = function runTo(finalState, done, bindObject, inputError) {
	  if (typeof finalState === 'function') {
	    inputError = bindObject; bindObject = done;
	    done = finalState; finalState = null;
	  }

	  var self = this;
	  var state = self.states[self.currentState];
	  state.fn.call(bindObject || self, inputError, function(err) {
	    if (err) {
	      if (state.fail) self.currentState = state.fail;
	      else return done ? done.call(bindObject, err) : null;
	    } else {
	      if (state.accept) self.currentState = state.accept;
	      else return done ? done.call(bindObject) : null;
	    }
	    if (self.currentState === finalState) {
	      return done ? done.call(bindObject, err) : null;
	    }

	    self.runTo(finalState, done, bindObject, err);
	  });
	};

	AcceptorStateMachine.prototype.addState = function addState(name, acceptState, failState, fn) {
	  if (typeof acceptState === 'function') {
	    fn = acceptState; acceptState = null; failState = null;
	  } else if (typeof failState === 'function') {
	    fn = failState; failState = null;
	  }

	  if (!this.currentState) this.currentState = name;
	  this.states[name] = { accept: acceptState, fail: failState, fn: fn };
	  return this;
	};

	/**
	 * @api private
	 */
	module.exports = AcceptorStateMachine;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	(function(exports) {
	  "use strict";

	  function isArray(obj) {
	    if (obj !== null) {
	      return Object.prototype.toString.call(obj) === "[object Array]";
	    } else {
	      return false;
	    }
	  }

	  function isObject(obj) {
	    if (obj !== null) {
	      return Object.prototype.toString.call(obj) === "[object Object]";
	    } else {
	      return false;
	    }
	  }

	  function strictDeepEqual(first, second) {
	    // Check the scalar case first.
	    if (first === second) {
	      return true;
	    }

	    // Check if they are the same type.
	    var firstType = Object.prototype.toString.call(first);
	    if (firstType !== Object.prototype.toString.call(second)) {
	      return false;
	    }
	    // We know that first and second have the same type so we can just check the
	    // first type from now on.
	    if (isArray(first) === true) {
	      // Short circuit if they're not the same length;
	      if (first.length !== second.length) {
	        return false;
	      }
	      for (var i = 0; i < first.length; i++) {
	        if (strictDeepEqual(first[i], second[i]) === false) {
	          return false;
	        }
	      }
	      return true;
	    }
	    if (isObject(first) === true) {
	      // An object is equal if it has the same key/value pairs.
	      var keysSeen = {};
	      for (var key in first) {
	        if (hasOwnProperty.call(first, key)) {
	          if (strictDeepEqual(first[key], second[key]) === false) {
	            return false;
	          }
	          keysSeen[key] = true;
	        }
	      }
	      // Now check that there aren't any keys in second that weren't
	      // in first.
	      for (var key2 in second) {
	        if (hasOwnProperty.call(second, key2)) {
	          if (keysSeen[key2] !== true) {
	            return false;
	          }
	        }
	      }
	      return true;
	    }
	    return false;
	  }

	  function isFalse(obj) {
	    // From the spec:
	    // A false value corresponds to the following values:
	    // Empty list
	    // Empty object
	    // Empty string
	    // False boolean
	    // null value

	    // First check the scalar values.
	    if (obj === "" || obj === false || obj === null) {
	        return true;
	    } else if (isArray(obj) && obj.length === 0) {
	        // Check for an empty array.
	        return true;
	    } else if (isObject(obj)) {
	        // Check for an empty object.
	        for (var key in obj) {
	            // If there are any keys, then
	            // the object is not empty so the object
	            // is not false.
	            if (obj.hasOwnProperty(key)) {
	              return false;
	            }
	        }
	        return true;
	    } else {
	        return false;
	    }
	  }

	  function objValues(obj) {
	    var keys = Object.keys(obj);
	    var values = [];
	    for (var i = 0; i < keys.length; i++) {
	      values.push(obj[keys[i]]);
	    }
	    return values;
	  }

	  function merge(a, b) {
	      var merged = {};
	      for (var key in a) {
	          merged[key] = a[key];
	      }
	      for (var key2 in b) {
	          merged[key2] = b[key2];
	      }
	      return merged;
	  }

	  var trimLeft;
	  if (typeof String.prototype.trimLeft === "function") {
	    trimLeft = function(str) {
	      return str.trimLeft();
	    };
	  } else {
	    trimLeft = function(str) {
	      return str.match(/^\s*(.*)/)[1];
	    };
	  }

	  // Type constants used to define functions.
	  var TYPE_NUMBER = 0;
	  var TYPE_ANY = 1;
	  var TYPE_STRING = 2;
	  var TYPE_ARRAY = 3;
	  var TYPE_OBJECT = 4;
	  var TYPE_BOOLEAN = 5;
	  var TYPE_EXPREF = 6;
	  var TYPE_NULL = 7;
	  var TYPE_ARRAY_NUMBER = 8;
	  var TYPE_ARRAY_STRING = 9;

	  var TOK_EOF = "EOF";
	  var TOK_UNQUOTEDIDENTIFIER = "UnquotedIdentifier";
	  var TOK_QUOTEDIDENTIFIER = "QuotedIdentifier";
	  var TOK_RBRACKET = "Rbracket";
	  var TOK_RPAREN = "Rparen";
	  var TOK_COMMA = "Comma";
	  var TOK_COLON = "Colon";
	  var TOK_RBRACE = "Rbrace";
	  var TOK_NUMBER = "Number";
	  var TOK_CURRENT = "Current";
	  var TOK_EXPREF = "Expref";
	  var TOK_PIPE = "Pipe";
	  var TOK_OR = "Or";
	  var TOK_AND = "And";
	  var TOK_EQ = "EQ";
	  var TOK_GT = "GT";
	  var TOK_LT = "LT";
	  var TOK_GTE = "GTE";
	  var TOK_LTE = "LTE";
	  var TOK_NE = "NE";
	  var TOK_FLATTEN = "Flatten";
	  var TOK_STAR = "Star";
	  var TOK_FILTER = "Filter";
	  var TOK_DOT = "Dot";
	  var TOK_NOT = "Not";
	  var TOK_LBRACE = "Lbrace";
	  var TOK_LBRACKET = "Lbracket";
	  var TOK_LPAREN= "Lparen";
	  var TOK_LITERAL= "Literal";

	  // The "&", "[", "<", ">" tokens
	  // are not in basicToken because
	  // there are two token variants
	  // ("&&", "[?", "<=", ">=").  This is specially handled
	  // below.

	  var basicTokens = {
	    ".": TOK_DOT,
	    "*": TOK_STAR,
	    ",": TOK_COMMA,
	    ":": TOK_COLON,
	    "{": TOK_LBRACE,
	    "}": TOK_RBRACE,
	    "]": TOK_RBRACKET,
	    "(": TOK_LPAREN,
	    ")": TOK_RPAREN,
	    "@": TOK_CURRENT
	  };

	  var operatorStartToken = {
	      "<": true,
	      ">": true,
	      "=": true,
	      "!": true
	  };

	  var skipChars = {
	      " ": true,
	      "\t": true,
	      "\n": true
	  };


	  function isAlpha(ch) {
	      return (ch >= "a" && ch <= "z") ||
	             (ch >= "A" && ch <= "Z") ||
	             ch === "_";
	  }

	  function isNum(ch) {
	      return (ch >= "0" && ch <= "9") ||
	             ch === "-";
	  }
	  function isAlphaNum(ch) {
	      return (ch >= "a" && ch <= "z") ||
	             (ch >= "A" && ch <= "Z") ||
	             (ch >= "0" && ch <= "9") ||
	             ch === "_";
	  }

	  function Lexer() {
	  }
	  Lexer.prototype = {
	      tokenize: function(stream) {
	          var tokens = [];
	          this._current = 0;
	          var start;
	          var identifier;
	          var token;
	          while (this._current < stream.length) {
	              if (isAlpha(stream[this._current])) {
	                  start = this._current;
	                  identifier = this._consumeUnquotedIdentifier(stream);
	                  tokens.push({type: TOK_UNQUOTEDIDENTIFIER,
	                               value: identifier,
	                               start: start});
	              } else if (basicTokens[stream[this._current]] !== undefined) {
	                  tokens.push({type: basicTokens[stream[this._current]],
	                              value: stream[this._current],
	                              start: this._current});
	                  this._current++;
	              } else if (isNum(stream[this._current])) {
	                  token = this._consumeNumber(stream);
	                  tokens.push(token);
	              } else if (stream[this._current] === "[") {
	                  // No need to increment this._current.  This happens
	                  // in _consumeLBracket
	                  token = this._consumeLBracket(stream);
	                  tokens.push(token);
	              } else if (stream[this._current] === "\"") {
	                  start = this._current;
	                  identifier = this._consumeQuotedIdentifier(stream);
	                  tokens.push({type: TOK_QUOTEDIDENTIFIER,
	                               value: identifier,
	                               start: start});
	              } else if (stream[this._current] === "'") {
	                  start = this._current;
	                  identifier = this._consumeRawStringLiteral(stream);
	                  tokens.push({type: TOK_LITERAL,
	                               value: identifier,
	                               start: start});
	              } else if (stream[this._current] === "`") {
	                  start = this._current;
	                  var literal = this._consumeLiteral(stream);
	                  tokens.push({type: TOK_LITERAL,
	                               value: literal,
	                               start: start});
	              } else if (operatorStartToken[stream[this._current]] !== undefined) {
	                  tokens.push(this._consumeOperator(stream));
	              } else if (skipChars[stream[this._current]] !== undefined) {
	                  // Ignore whitespace.
	                  this._current++;
	              } else if (stream[this._current] === "&") {
	                  start = this._current;
	                  this._current++;
	                  if (stream[this._current] === "&") {
	                      this._current++;
	                      tokens.push({type: TOK_AND, value: "&&", start: start});
	                  } else {
	                      tokens.push({type: TOK_EXPREF, value: "&", start: start});
	                  }
	              } else if (stream[this._current] === "|") {
	                  start = this._current;
	                  this._current++;
	                  if (stream[this._current] === "|") {
	                      this._current++;
	                      tokens.push({type: TOK_OR, value: "||", start: start});
	                  } else {
	                      tokens.push({type: TOK_PIPE, value: "|", start: start});
	                  }
	              } else {
	                  var error = new Error("Unknown character:" + stream[this._current]);
	                  error.name = "LexerError";
	                  throw error;
	              }
	          }
	          return tokens;
	      },

	      _consumeUnquotedIdentifier: function(stream) {
	          var start = this._current;
	          this._current++;
	          while (this._current < stream.length && isAlphaNum(stream[this._current])) {
	              this._current++;
	          }
	          return stream.slice(start, this._current);
	      },

	      _consumeQuotedIdentifier: function(stream) {
	          var start = this._current;
	          this._current++;
	          var maxLength = stream.length;
	          while (stream[this._current] !== "\"" && this._current < maxLength) {
	              // You can escape a double quote and you can escape an escape.
	              var current = this._current;
	              if (stream[current] === "\\" && (stream[current + 1] === "\\" ||
	                                               stream[current + 1] === "\"")) {
	                  current += 2;
	              } else {
	                  current++;
	              }
	              this._current = current;
	          }
	          this._current++;
	          return JSON.parse(stream.slice(start, this._current));
	      },

	      _consumeRawStringLiteral: function(stream) {
	          var start = this._current;
	          this._current++;
	          var maxLength = stream.length;
	          while (stream[this._current] !== "'" && this._current < maxLength) {
	              // You can escape a single quote and you can escape an escape.
	              var current = this._current;
	              if (stream[current] === "\\" && (stream[current + 1] === "\\" ||
	                                               stream[current + 1] === "'")) {
	                  current += 2;
	              } else {
	                  current++;
	              }
	              this._current = current;
	          }
	          this._current++;
	          var literal = stream.slice(start + 1, this._current - 1);
	          return literal.replace("\\'", "'");
	      },

	      _consumeNumber: function(stream) {
	          var start = this._current;
	          this._current++;
	          var maxLength = stream.length;
	          while (isNum(stream[this._current]) && this._current < maxLength) {
	              this._current++;
	          }
	          var value = parseInt(stream.slice(start, this._current));
	          return {type: TOK_NUMBER, value: value, start: start};
	      },

	      _consumeLBracket: function(stream) {
	          var start = this._current;
	          this._current++;
	          if (stream[this._current] === "?") {
	              this._current++;
	              return {type: TOK_FILTER, value: "[?", start: start};
	          } else if (stream[this._current] === "]") {
	              this._current++;
	              return {type: TOK_FLATTEN, value: "[]", start: start};
	          } else {
	              return {type: TOK_LBRACKET, value: "[", start: start};
	          }
	      },

	      _consumeOperator: function(stream) {
	          var start = this._current;
	          var startingChar = stream[start];
	          this._current++;
	          if (startingChar === "!") {
	              if (stream[this._current] === "=") {
	                  this._current++;
	                  return {type: TOK_NE, value: "!=", start: start};
	              } else {
	                return {type: TOK_NOT, value: "!", start: start};
	              }
	          } else if (startingChar === "<") {
	              if (stream[this._current] === "=") {
	                  this._current++;
	                  return {type: TOK_LTE, value: "<=", start: start};
	              } else {
	                  return {type: TOK_LT, value: "<", start: start};
	              }
	          } else if (startingChar === ">") {
	              if (stream[this._current] === "=") {
	                  this._current++;
	                  return {type: TOK_GTE, value: ">=", start: start};
	              } else {
	                  return {type: TOK_GT, value: ">", start: start};
	              }
	          } else if (startingChar === "=") {
	              if (stream[this._current] === "=") {
	                  this._current++;
	                  return {type: TOK_EQ, value: "==", start: start};
	              }
	          }
	      },

	      _consumeLiteral: function(stream) {
	          this._current++;
	          var start = this._current;
	          var maxLength = stream.length;
	          var literal;
	          while(stream[this._current] !== "`" && this._current < maxLength) {
	              // You can escape a literal char or you can escape the escape.
	              var current = this._current;
	              if (stream[current] === "\\" && (stream[current + 1] === "\\" ||
	                                               stream[current + 1] === "`")) {
	                  current += 2;
	              } else {
	                  current++;
	              }
	              this._current = current;
	          }
	          var literalString = trimLeft(stream.slice(start, this._current));
	          literalString = literalString.replace("\\`", "`");
	          if (this._looksLikeJSON(literalString)) {
	              literal = JSON.parse(literalString);
	          } else {
	              // Try to JSON parse it as "<literal>"
	              literal = JSON.parse("\"" + literalString + "\"");
	          }
	          // +1 gets us to the ending "`", +1 to move on to the next char.
	          this._current++;
	          return literal;
	      },

	      _looksLikeJSON: function(literalString) {
	          var startingChars = "[{\"";
	          var jsonLiterals = ["true", "false", "null"];
	          var numberLooking = "-0123456789";

	          if (literalString === "") {
	              return false;
	          } else if (startingChars.indexOf(literalString[0]) >= 0) {
	              return true;
	          } else if (jsonLiterals.indexOf(literalString) >= 0) {
	              return true;
	          } else if (numberLooking.indexOf(literalString[0]) >= 0) {
	              try {
	                  JSON.parse(literalString);
	                  return true;
	              } catch (ex) {
	                  return false;
	              }
	          } else {
	              return false;
	          }
	      }
	  };

	      var bindingPower = {};
	      bindingPower[TOK_EOF] = 0;
	      bindingPower[TOK_UNQUOTEDIDENTIFIER] = 0;
	      bindingPower[TOK_QUOTEDIDENTIFIER] = 0;
	      bindingPower[TOK_RBRACKET] = 0;
	      bindingPower[TOK_RPAREN] = 0;
	      bindingPower[TOK_COMMA] = 0;
	      bindingPower[TOK_RBRACE] = 0;
	      bindingPower[TOK_NUMBER] = 0;
	      bindingPower[TOK_CURRENT] = 0;
	      bindingPower[TOK_EXPREF] = 0;
	      bindingPower[TOK_PIPE] = 1;
	      bindingPower[TOK_OR] = 2;
	      bindingPower[TOK_AND] = 3;
	      bindingPower[TOK_EQ] = 5;
	      bindingPower[TOK_GT] = 5;
	      bindingPower[TOK_LT] = 5;
	      bindingPower[TOK_GTE] = 5;
	      bindingPower[TOK_LTE] = 5;
	      bindingPower[TOK_NE] = 5;
	      bindingPower[TOK_FLATTEN] = 9;
	      bindingPower[TOK_STAR] = 20;
	      bindingPower[TOK_FILTER] = 21;
	      bindingPower[TOK_DOT] = 40;
	      bindingPower[TOK_NOT] = 45;
	      bindingPower[TOK_LBRACE] = 50;
	      bindingPower[TOK_LBRACKET] = 55;
	      bindingPower[TOK_LPAREN] = 60;

	  function Parser() {
	  }

	  Parser.prototype = {
	      parse: function(expression) {
	          this._loadTokens(expression);
	          this.index = 0;
	          var ast = this.expression(0);
	          if (this._lookahead(0) !== TOK_EOF) {
	              var t = this._lookaheadToken(0);
	              var error = new Error(
	                  "Unexpected token type: " + t.type + ", value: " + t.value);
	              error.name = "ParserError";
	              throw error;
	          }
	          return ast;
	      },

	      _loadTokens: function(expression) {
	          var lexer = new Lexer();
	          var tokens = lexer.tokenize(expression);
	          tokens.push({type: TOK_EOF, value: "", start: expression.length});
	          this.tokens = tokens;
	      },

	      expression: function(rbp) {
	          var leftToken = this._lookaheadToken(0);
	          this._advance();
	          var left = this.nud(leftToken);
	          var currentToken = this._lookahead(0);
	          while (rbp < bindingPower[currentToken]) {
	              this._advance();
	              left = this.led(currentToken, left);
	              currentToken = this._lookahead(0);
	          }
	          return left;
	      },

	      _lookahead: function(number) {
	          return this.tokens[this.index + number].type;
	      },

	      _lookaheadToken: function(number) {
	          return this.tokens[this.index + number];
	      },

	      _advance: function() {
	          this.index++;
	      },

	      nud: function(token) {
	        var left;
	        var right;
	        var expression;
	        switch (token.type) {
	          case TOK_LITERAL:
	            return {type: "Literal", value: token.value};
	          case TOK_UNQUOTEDIDENTIFIER:
	            return {type: "Field", name: token.value};
	          case TOK_QUOTEDIDENTIFIER:
	            var node = {type: "Field", name: token.value};
	            if (this._lookahead(0) === TOK_LPAREN) {
	                throw new Error("Quoted identifier not allowed for function names.");
	            } else {
	                return node;
	            }
	            break;
	          case TOK_NOT:
	            right = this.expression(bindingPower.Not);
	            return {type: "NotExpression", children: [right]};
	          case TOK_STAR:
	            left = {type: "Identity"};
	            right = null;
	            if (this._lookahead(0) === TOK_RBRACKET) {
	                // This can happen in a multiselect,
	                // [a, b, *]
	                right = {type: "Identity"};
	            } else {
	                right = this._parseProjectionRHS(bindingPower.Star);
	            }
	            return {type: "ValueProjection", children: [left, right]};
	          case TOK_FILTER:
	            return this.led(token.type, {type: "Identity"});
	          case TOK_LBRACE:
	            return this._parseMultiselectHash();
	          case TOK_FLATTEN:
	            left = {type: TOK_FLATTEN, children: [{type: "Identity"}]};
	            right = this._parseProjectionRHS(bindingPower.Flatten);
	            return {type: "Projection", children: [left, right]};
	          case TOK_LBRACKET:
	            if (this._lookahead(0) === TOK_NUMBER || this._lookahead(0) === TOK_COLON) {
	                right = this._parseIndexExpression();
	                return this._projectIfSlice({type: "Identity"}, right);
	            } else if (this._lookahead(0) === TOK_STAR &&
	                       this._lookahead(1) === TOK_RBRACKET) {
	                this._advance();
	                this._advance();
	                right = this._parseProjectionRHS(bindingPower.Star);
	                return {type: "Projection",
	                        children: [{type: "Identity"}, right]};
	            } else {
	                return this._parseMultiselectList();
	            }
	            break;
	          case TOK_CURRENT:
	            return {type: TOK_CURRENT};
	          case TOK_EXPREF:
	            expression = this.expression(bindingPower.Expref);
	            return {type: "ExpressionReference", children: [expression]};
	          case TOK_LPAREN:
	            var args = [];
	            while (this._lookahead(0) !== TOK_RPAREN) {
	              if (this._lookahead(0) === TOK_CURRENT) {
	                expression = {type: TOK_CURRENT};
	                this._advance();
	              } else {
	                expression = this.expression(0);
	              }
	              args.push(expression);
	            }
	            this._match(TOK_RPAREN);
	            return args[0];
	          default:
	            this._errorToken(token);
	        }
	      },

	      led: function(tokenName, left) {
	        var right;
	        switch(tokenName) {
	          case TOK_DOT:
	            var rbp = bindingPower.Dot;
	            if (this._lookahead(0) !== TOK_STAR) {
	                right = this._parseDotRHS(rbp);
	                return {type: "Subexpression", children: [left, right]};
	            } else {
	                // Creating a projection.
	                this._advance();
	                right = this._parseProjectionRHS(rbp);
	                return {type: "ValueProjection", children: [left, right]};
	            }
	            break;
	          case TOK_PIPE:
	            right = this.expression(bindingPower.Pipe);
	            return {type: TOK_PIPE, children: [left, right]};
	          case TOK_OR:
	            right = this.expression(bindingPower.Or);
	            return {type: "OrExpression", children: [left, right]};
	          case TOK_AND:
	            right = this.expression(bindingPower.And);
	            return {type: "AndExpression", children: [left, right]};
	          case TOK_LPAREN:
	            var name = left.name;
	            var args = [];
	            var expression, node;
	            while (this._lookahead(0) !== TOK_RPAREN) {
	              if (this._lookahead(0) === TOK_CURRENT) {
	                expression = {type: TOK_CURRENT};
	                this._advance();
	              } else {
	                expression = this.expression(0);
	              }
	              if (this._lookahead(0) === TOK_COMMA) {
	                this._match(TOK_COMMA);
	              }
	              args.push(expression);
	            }
	            this._match(TOK_RPAREN);
	            node = {type: "Function", name: name, children: args};
	            return node;
	          case TOK_FILTER:
	            var condition = this.expression(0);
	            this._match(TOK_RBRACKET);
	            if (this._lookahead(0) === TOK_FLATTEN) {
	              right = {type: "Identity"};
	            } else {
	              right = this._parseProjectionRHS(bindingPower.Filter);
	            }
	            return {type: "FilterProjection", children: [left, right, condition]};
	          case TOK_FLATTEN:
	            var leftNode = {type: TOK_FLATTEN, children: [left]};
	            var rightNode = this._parseProjectionRHS(bindingPower.Flatten);
	            return {type: "Projection", children: [leftNode, rightNode]};
	          case TOK_EQ:
	          case TOK_NE:
	          case TOK_GT:
	          case TOK_GTE:
	          case TOK_LT:
	          case TOK_LTE:
	            return this._parseComparator(left, tokenName);
	          case TOK_LBRACKET:
	            var token = this._lookaheadToken(0);
	            if (token.type === TOK_NUMBER || token.type === TOK_COLON) {
	                right = this._parseIndexExpression();
	                return this._projectIfSlice(left, right);
	            } else {
	                this._match(TOK_STAR);
	                this._match(TOK_RBRACKET);
	                right = this._parseProjectionRHS(bindingPower.Star);
	                return {type: "Projection", children: [left, right]};
	            }
	            break;
	          default:
	            this._errorToken(this._lookaheadToken(0));
	        }
	      },

	      _match: function(tokenType) {
	          if (this._lookahead(0) === tokenType) {
	              this._advance();
	          } else {
	              var t = this._lookaheadToken(0);
	              var error = new Error("Expected " + tokenType + ", got: " + t.type);
	              error.name = "ParserError";
	              throw error;
	          }
	      },

	      _errorToken: function(token) {
	          var error = new Error("Invalid token (" +
	                                token.type + "): \"" +
	                                token.value + "\"");
	          error.name = "ParserError";
	          throw error;
	      },


	      _parseIndexExpression: function() {
	          if (this._lookahead(0) === TOK_COLON || this._lookahead(1) === TOK_COLON) {
	              return this._parseSliceExpression();
	          } else {
	              var node = {
	                  type: "Index",
	                  value: this._lookaheadToken(0).value};
	              this._advance();
	              this._match(TOK_RBRACKET);
	              return node;
	          }
	      },

	      _projectIfSlice: function(left, right) {
	          var indexExpr = {type: "IndexExpression", children: [left, right]};
	          if (right.type === "Slice") {
	              return {
	                  type: "Projection",
	                  children: [indexExpr, this._parseProjectionRHS(bindingPower.Star)]
	              };
	          } else {
	              return indexExpr;
	          }
	      },

	      _parseSliceExpression: function() {
	          // [start:end:step] where each part is optional, as well as the last
	          // colon.
	          var parts = [null, null, null];
	          var index = 0;
	          var currentToken = this._lookahead(0);
	          while (currentToken !== TOK_RBRACKET && index < 3) {
	              if (currentToken === TOK_COLON) {
	                  index++;
	                  this._advance();
	              } else if (currentToken === TOK_NUMBER) {
	                  parts[index] = this._lookaheadToken(0).value;
	                  this._advance();
	              } else {
	                  var t = this._lookahead(0);
	                  var error = new Error("Syntax error, unexpected token: " +
	                                        t.value + "(" + t.type + ")");
	                  error.name = "Parsererror";
	                  throw error;
	              }
	              currentToken = this._lookahead(0);
	          }
	          this._match(TOK_RBRACKET);
	          return {
	              type: "Slice",
	              children: parts
	          };
	      },

	      _parseComparator: function(left, comparator) {
	        var right = this.expression(bindingPower[comparator]);
	        return {type: "Comparator", name: comparator, children: [left, right]};
	      },

	      _parseDotRHS: function(rbp) {
	          var lookahead = this._lookahead(0);
	          var exprTokens = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER, TOK_STAR];
	          if (exprTokens.indexOf(lookahead) >= 0) {
	              return this.expression(rbp);
	          } else if (lookahead === TOK_LBRACKET) {
	              this._match(TOK_LBRACKET);
	              return this._parseMultiselectList();
	          } else if (lookahead === TOK_LBRACE) {
	              this._match(TOK_LBRACE);
	              return this._parseMultiselectHash();
	          }
	      },

	      _parseProjectionRHS: function(rbp) {
	          var right;
	          if (bindingPower[this._lookahead(0)] < 10) {
	              right = {type: "Identity"};
	          } else if (this._lookahead(0) === TOK_LBRACKET) {
	              right = this.expression(rbp);
	          } else if (this._lookahead(0) === TOK_FILTER) {
	              right = this.expression(rbp);
	          } else if (this._lookahead(0) === TOK_DOT) {
	              this._match(TOK_DOT);
	              right = this._parseDotRHS(rbp);
	          } else {
	              var t = this._lookaheadToken(0);
	              var error = new Error("Sytanx error, unexpected token: " +
	                                    t.value + "(" + t.type + ")");
	              error.name = "ParserError";
	              throw error;
	          }
	          return right;
	      },

	      _parseMultiselectList: function() {
	          var expressions = [];
	          while (this._lookahead(0) !== TOK_RBRACKET) {
	              var expression = this.expression(0);
	              expressions.push(expression);
	              if (this._lookahead(0) === TOK_COMMA) {
	                  this._match(TOK_COMMA);
	                  if (this._lookahead(0) === TOK_RBRACKET) {
	                    throw new Error("Unexpected token Rbracket");
	                  }
	              }
	          }
	          this._match(TOK_RBRACKET);
	          return {type: "MultiSelectList", children: expressions};
	      },

	      _parseMultiselectHash: function() {
	        var pairs = [];
	        var identifierTypes = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER];
	        var keyToken, keyName, value, node;
	        for (;;) {
	          keyToken = this._lookaheadToken(0);
	          if (identifierTypes.indexOf(keyToken.type) < 0) {
	            throw new Error("Expecting an identifier token, got: " +
	                            keyToken.type);
	          }
	          keyName = keyToken.value;
	          this._advance();
	          this._match(TOK_COLON);
	          value = this.expression(0);
	          node = {type: "KeyValuePair", name: keyName, value: value};
	          pairs.push(node);
	          if (this._lookahead(0) === TOK_COMMA) {
	            this._match(TOK_COMMA);
	          } else if (this._lookahead(0) === TOK_RBRACE) {
	            this._match(TOK_RBRACE);
	            break;
	          }
	        }
	        return {type: "MultiSelectHash", children: pairs};
	      }
	  };


	  function TreeInterpreter(runtime) {
	    this.runtime = runtime;
	  }

	  TreeInterpreter.prototype = {
	      search: function(node, value) {
	          return this.visit(node, value);
	      },

	      visit: function(node, value) {
	          var matched, current, result, first, second, field, left, right, collected, i;
	          switch (node.type) {
	            case "Field":
	              if (value === null ) {
	                  return null;
	              } else if (isObject(value)) {
	                  field = value[node.name];
	                  if (field === undefined) {
	                      return null;
	                  } else {
	                      return field;
	                  }
	              } else {
	                return null;
	              }
	              break;
	            case "Subexpression":
	              result = this.visit(node.children[0], value);
	              for (i = 1; i < node.children.length; i++) {
	                  result = this.visit(node.children[1], result);
	                  if (result === null) {
	                      return null;
	                  }
	              }
	              return result;
	            case "IndexExpression":
	              left = this.visit(node.children[0], value);
	              right = this.visit(node.children[1], left);
	              return right;
	            case "Index":
	              if (!isArray(value)) {
	                return null;
	              }
	              var index = node.value;
	              if (index < 0) {
	                index = value.length + index;
	              }
	              result = value[index];
	              if (result === undefined) {
	                result = null;
	              }
	              return result;
	            case "Slice":
	              if (!isArray(value)) {
	                return null;
	              }
	              var sliceParams = node.children.slice(0);
	              var computed = this.computeSliceParams(value.length, sliceParams);
	              var start = computed[0];
	              var stop = computed[1];
	              var step = computed[2];
	              result = [];
	              if (step > 0) {
	                  for (i = start; i < stop; i += step) {
	                      result.push(value[i]);
	                  }
	              } else {
	                  for (i = start; i > stop; i += step) {
	                      result.push(value[i]);
	                  }
	              }
	              return result;
	            case "Projection":
	              // Evaluate left child.
	              var base = this.visit(node.children[0], value);
	              if (!isArray(base)) {
	                return null;
	              }
	              collected = [];
	              for (i = 0; i < base.length; i++) {
	                current = this.visit(node.children[1], base[i]);
	                if (current !== null) {
	                  collected.push(current);
	                }
	              }
	              return collected;
	            case "ValueProjection":
	              // Evaluate left child.
	              base = this.visit(node.children[0], value);
	              if (!isObject(base)) {
	                return null;
	              }
	              collected = [];
	              var values = objValues(base);
	              for (i = 0; i < values.length; i++) {
	                current = this.visit(node.children[1], values[i]);
	                if (current !== null) {
	                  collected.push(current);
	                }
	              }
	              return collected;
	            case "FilterProjection":
	              base = this.visit(node.children[0], value);
	              if (!isArray(base)) {
	                return null;
	              }
	              var filtered = [];
	              var finalResults = [];
	              for (i = 0; i < base.length; i++) {
	                matched = this.visit(node.children[2], base[i]);
	                if (!isFalse(matched)) {
	                  filtered.push(base[i]);
	                }
	              }
	              for (var j = 0; j < filtered.length; j++) {
	                current = this.visit(node.children[1], filtered[j]);
	                if (current !== null) {
	                  finalResults.push(current);
	                }
	              }
	              return finalResults;
	            case "Comparator":
	              first = this.visit(node.children[0], value);
	              second = this.visit(node.children[1], value);
	              switch(node.name) {
	                case TOK_EQ:
	                  result = strictDeepEqual(first, second);
	                  break;
	                case TOK_NE:
	                  result = !strictDeepEqual(first, second);
	                  break;
	                case TOK_GT:
	                  result = first > second;
	                  break;
	                case TOK_GTE:
	                  result = first >= second;
	                  break;
	                case TOK_LT:
	                  result = first < second;
	                  break;
	                case TOK_LTE:
	                  result = first <= second;
	                  break;
	                default:
	                  throw new Error("Unknown comparator: " + node.name);
	              }
	              return result;
	            case TOK_FLATTEN:
	              var original = this.visit(node.children[0], value);
	              if (!isArray(original)) {
	                return null;
	              }
	              var merged = [];
	              for (i = 0; i < original.length; i++) {
	                current = original[i];
	                if (isArray(current)) {
	                  merged.push.apply(merged, current);
	                } else {
	                  merged.push(current);
	                }
	              }
	              return merged;
	            case "Identity":
	              return value;
	            case "MultiSelectList":
	              if (value === null) {
	                return null;
	              }
	              collected = [];
	              for (i = 0; i < node.children.length; i++) {
	                  collected.push(this.visit(node.children[i], value));
	              }
	              return collected;
	            case "MultiSelectHash":
	              if (value === null) {
	                return null;
	              }
	              collected = {};
	              var child;
	              for (i = 0; i < node.children.length; i++) {
	                child = node.children[i];
	                collected[child.name] = this.visit(child.value, value);
	              }
	              return collected;
	            case "OrExpression":
	              matched = this.visit(node.children[0], value);
	              if (isFalse(matched)) {
	                  matched = this.visit(node.children[1], value);
	              }
	              return matched;
	            case "AndExpression":
	              first = this.visit(node.children[0], value);

	              if (isFalse(first) === true) {
	                return first;
	              }
	              return this.visit(node.children[1], value);
	            case "NotExpression":
	              first = this.visit(node.children[0], value);
	              return isFalse(first);
	            case "Literal":
	              return node.value;
	            case TOK_PIPE:
	              left = this.visit(node.children[0], value);
	              return this.visit(node.children[1], left);
	            case TOK_CURRENT:
	              return value;
	            case "Function":
	              var resolvedArgs = [];
	              for (i = 0; i < node.children.length; i++) {
	                  resolvedArgs.push(this.visit(node.children[i], value));
	              }
	              return this.runtime.callFunction(node.name, resolvedArgs);
	            case "ExpressionReference":
	              var refNode = node.children[0];
	              // Tag the node with a specific attribute so the type
	              // checker verify the type.
	              refNode.jmespathType = TOK_EXPREF;
	              return refNode;
	            default:
	              throw new Error("Unknown node type: " + node.type);
	          }
	      },

	      computeSliceParams: function(arrayLength, sliceParams) {
	        var start = sliceParams[0];
	        var stop = sliceParams[1];
	        var step = sliceParams[2];
	        var computed = [null, null, null];
	        if (step === null) {
	          step = 1;
	        } else if (step === 0) {
	          var error = new Error("Invalid slice, step cannot be 0");
	          error.name = "RuntimeError";
	          throw error;
	        }
	        var stepValueNegative = step < 0 ? true : false;

	        if (start === null) {
	            start = stepValueNegative ? arrayLength - 1 : 0;
	        } else {
	            start = this.capSliceRange(arrayLength, start, step);
	        }

	        if (stop === null) {
	            stop = stepValueNegative ? -1 : arrayLength;
	        } else {
	            stop = this.capSliceRange(arrayLength, stop, step);
	        }
	        computed[0] = start;
	        computed[1] = stop;
	        computed[2] = step;
	        return computed;
	      },

	      capSliceRange: function(arrayLength, actualValue, step) {
	          if (actualValue < 0) {
	              actualValue += arrayLength;
	              if (actualValue < 0) {
	                  actualValue = step < 0 ? -1 : 0;
	              }
	          } else if (actualValue >= arrayLength) {
	              actualValue = step < 0 ? arrayLength - 1 : arrayLength;
	          }
	          return actualValue;
	      }

	  };

	  function Runtime(interpreter) {
	    this._interpreter = interpreter;
	    this.functionTable = {
	        // name: [function, <signature>]
	        // The <signature> can be:
	        //
	        // {
	        //   args: [[type1, type2], [type1, type2]],
	        //   variadic: true|false
	        // }
	        //
	        // Each arg in the arg list is a list of valid types
	        // (if the function is overloaded and supports multiple
	        // types.  If the type is "any" then no type checking
	        // occurs on the argument.  Variadic is optional
	        // and if not provided is assumed to be false.
	        abs: {_func: this._functionAbs, _signature: [{types: [TYPE_NUMBER]}]},
	        avg: {_func: this._functionAvg, _signature: [{types: [TYPE_ARRAY_NUMBER]}]},
	        ceil: {_func: this._functionCeil, _signature: [{types: [TYPE_NUMBER]}]},
	        contains: {
	            _func: this._functionContains,
	            _signature: [{types: [TYPE_STRING, TYPE_ARRAY]},
	                        {types: [TYPE_ANY]}]},
	        "ends_with": {
	            _func: this._functionEndsWith,
	            _signature: [{types: [TYPE_STRING]}, {types: [TYPE_STRING]}]},
	        floor: {_func: this._functionFloor, _signature: [{types: [TYPE_NUMBER]}]},
	        length: {
	            _func: this._functionLength,
	            _signature: [{types: [TYPE_STRING, TYPE_ARRAY, TYPE_OBJECT]}]},
	        map: {
	            _func: this._functionMap,
	            _signature: [{types: [TYPE_EXPREF]}, {types: [TYPE_ARRAY]}]},
	        max: {
	            _func: this._functionMax,
	            _signature: [{types: [TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING]}]},
	        "merge": {
	            _func: this._functionMerge,
	            _signature: [{types: [TYPE_OBJECT], variadic: true}]
	        },
	        "max_by": {
	          _func: this._functionMaxBy,
	          _signature: [{types: [TYPE_ARRAY]}, {types: [TYPE_EXPREF]}]
	        },
	        sum: {_func: this._functionSum, _signature: [{types: [TYPE_ARRAY_NUMBER]}]},
	        "starts_with": {
	            _func: this._functionStartsWith,
	            _signature: [{types: [TYPE_STRING]}, {types: [TYPE_STRING]}]},
	        min: {
	            _func: this._functionMin,
	            _signature: [{types: [TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING]}]},
	        "min_by": {
	          _func: this._functionMinBy,
	          _signature: [{types: [TYPE_ARRAY]}, {types: [TYPE_EXPREF]}]
	        },
	        type: {_func: this._functionType, _signature: [{types: [TYPE_ANY]}]},
	        keys: {_func: this._functionKeys, _signature: [{types: [TYPE_OBJECT]}]},
	        values: {_func: this._functionValues, _signature: [{types: [TYPE_OBJECT]}]},
	        sort: {_func: this._functionSort, _signature: [{types: [TYPE_ARRAY_STRING, TYPE_ARRAY_NUMBER]}]},
	        "sort_by": {
	          _func: this._functionSortBy,
	          _signature: [{types: [TYPE_ARRAY]}, {types: [TYPE_EXPREF]}]
	        },
	        join: {
	            _func: this._functionJoin,
	            _signature: [
	                {types: [TYPE_STRING]},
	                {types: [TYPE_ARRAY_STRING]}
	            ]
	        },
	        reverse: {
	            _func: this._functionReverse,
	            _signature: [{types: [TYPE_STRING, TYPE_ARRAY]}]},
	        "to_array": {_func: this._functionToArray, _signature: [{types: [TYPE_ANY]}]},
	        "to_string": {_func: this._functionToString, _signature: [{types: [TYPE_ANY]}]},
	        "to_number": {_func: this._functionToNumber, _signature: [{types: [TYPE_ANY]}]},
	        "not_null": {
	            _func: this._functionNotNull,
	            _signature: [{types: [TYPE_ANY], variadic: true}]
	        }
	    };
	  }

	  Runtime.prototype = {
	    callFunction: function(name, resolvedArgs) {
	      var functionEntry = this.functionTable[name];
	      if (functionEntry === undefined) {
	          throw new Error("Unknown function: " + name + "()");
	      }
	      this._validateArgs(name, resolvedArgs, functionEntry._signature);
	      return functionEntry._func.call(this, resolvedArgs);
	    },

	    _validateArgs: function(name, args, signature) {
	        // Validating the args requires validating
	        // the correct arity and the correct type of each arg.
	        // If the last argument is declared as variadic, then we need
	        // a minimum number of args to be required.  Otherwise it has to
	        // be an exact amount.
	        var pluralized;
	        if (signature[signature.length - 1].variadic) {
	            if (args.length < signature.length) {
	                pluralized = signature.length === 1 ? " argument" : " arguments";
	                throw new Error("ArgumentError: " + name + "() " +
	                                "takes at least" + signature.length + pluralized +
	                                " but received " + args.length);
	            }
	        } else if (args.length !== signature.length) {
	            pluralized = signature.length === 1 ? " argument" : " arguments";
	            throw new Error("ArgumentError: " + name + "() " +
	                            "takes " + signature.length + pluralized +
	                            " but received " + args.length);
	        }
	        var currentSpec;
	        var actualType;
	        var typeMatched;
	        for (var i = 0; i < signature.length; i++) {
	            typeMatched = false;
	            currentSpec = signature[i].types;
	            actualType = this._getTypeName(args[i]);
	            for (var j = 0; j < currentSpec.length; j++) {
	                if (this._typeMatches(actualType, currentSpec[j], args[i])) {
	                    typeMatched = true;
	                    break;
	                }
	            }
	            if (!typeMatched) {
	                throw new Error("TypeError: " + name + "() " +
	                                "expected argument " + (i + 1) +
	                                " to be type " + currentSpec +
	                                " but received type " + actualType +
	                                " instead.");
	            }
	        }
	    },

	    _typeMatches: function(actual, expected, argValue) {
	        if (expected === TYPE_ANY) {
	            return true;
	        }
	        if (expected === TYPE_ARRAY_STRING ||
	            expected === TYPE_ARRAY_NUMBER ||
	            expected === TYPE_ARRAY) {
	            // The expected type can either just be array,
	            // or it can require a specific subtype (array of numbers).
	            //
	            // The simplest case is if "array" with no subtype is specified.
	            if (expected === TYPE_ARRAY) {
	                return actual === TYPE_ARRAY;
	            } else if (actual === TYPE_ARRAY) {
	                // Otherwise we need to check subtypes.
	                // I think this has potential to be improved.
	                var subtype;
	                if (expected === TYPE_ARRAY_NUMBER) {
	                  subtype = TYPE_NUMBER;
	                } else if (expected === TYPE_ARRAY_STRING) {
	                  subtype = TYPE_STRING;
	                }
	                for (var i = 0; i < argValue.length; i++) {
	                    if (!this._typeMatches(
	                            this._getTypeName(argValue[i]), subtype,
	                                             argValue[i])) {
	                        return false;
	                    }
	                }
	                return true;
	            }
	        } else {
	            return actual === expected;
	        }
	    },
	    _getTypeName: function(obj) {
	        switch (Object.prototype.toString.call(obj)) {
	            case "[object String]":
	              return TYPE_STRING;
	            case "[object Number]":
	              return TYPE_NUMBER;
	            case "[object Array]":
	              return TYPE_ARRAY;
	            case "[object Boolean]":
	              return TYPE_BOOLEAN;
	            case "[object Null]":
	              return TYPE_NULL;
	            case "[object Object]":
	              // Check if it's an expref.  If it has, it's been
	              // tagged with a jmespathType attr of 'Expref';
	              if (obj.jmespathType === TOK_EXPREF) {
	                return TYPE_EXPREF;
	              } else {
	                return TYPE_OBJECT;
	              }
	        }
	    },

	    _functionStartsWith: function(resolvedArgs) {
	        return resolvedArgs[0].lastIndexOf(resolvedArgs[1]) === 0;
	    },

	    _functionEndsWith: function(resolvedArgs) {
	        var searchStr = resolvedArgs[0];
	        var suffix = resolvedArgs[1];
	        return searchStr.indexOf(suffix, searchStr.length - suffix.length) !== -1;
	    },

	    _functionReverse: function(resolvedArgs) {
	        var typeName = this._getTypeName(resolvedArgs[0]);
	        if (typeName === TYPE_STRING) {
	          var originalStr = resolvedArgs[0];
	          var reversedStr = "";
	          for (var i = originalStr.length - 1; i >= 0; i--) {
	              reversedStr += originalStr[i];
	          }
	          return reversedStr;
	        } else {
	          var reversedArray = resolvedArgs[0].slice(0);
	          reversedArray.reverse();
	          return reversedArray;
	        }
	    },

	    _functionAbs: function(resolvedArgs) {
	      return Math.abs(resolvedArgs[0]);
	    },

	    _functionCeil: function(resolvedArgs) {
	        return Math.ceil(resolvedArgs[0]);
	    },

	    _functionAvg: function(resolvedArgs) {
	        var sum = 0;
	        var inputArray = resolvedArgs[0];
	        for (var i = 0; i < inputArray.length; i++) {
	            sum += inputArray[i];
	        }
	        return sum / inputArray.length;
	    },

	    _functionContains: function(resolvedArgs) {
	        return resolvedArgs[0].indexOf(resolvedArgs[1]) >= 0;
	    },

	    _functionFloor: function(resolvedArgs) {
	        return Math.floor(resolvedArgs[0]);
	    },

	    _functionLength: function(resolvedArgs) {
	       if (!isObject(resolvedArgs[0])) {
	         return resolvedArgs[0].length;
	       } else {
	         // As far as I can tell, there's no way to get the length
	         // of an object without O(n) iteration through the object.
	         return Object.keys(resolvedArgs[0]).length;
	       }
	    },

	    _functionMap: function(resolvedArgs) {
	      var mapped = [];
	      var interpreter = this._interpreter;
	      var exprefNode = resolvedArgs[0];
	      var elements = resolvedArgs[1];
	      for (var i = 0; i < elements.length; i++) {
	          mapped.push(interpreter.visit(exprefNode, elements[i]));
	      }
	      return mapped;
	    },

	    _functionMerge: function(resolvedArgs) {
	      var merged = {};
	      for (var i = 0; i < resolvedArgs.length; i++) {
	        var current = resolvedArgs[i];
	        for (var key in current) {
	          merged[key] = current[key];
	        }
	      }
	      return merged;
	    },

	    _functionMax: function(resolvedArgs) {
	      if (resolvedArgs[0].length > 0) {
	        var typeName = this._getTypeName(resolvedArgs[0][0]);
	        if (typeName === TYPE_NUMBER) {
	          return Math.max.apply(Math, resolvedArgs[0]);
	        } else {
	          var elements = resolvedArgs[0];
	          var maxElement = elements[0];
	          for (var i = 1; i < elements.length; i++) {
	              if (maxElement.localeCompare(elements[i]) < 0) {
	                  maxElement = elements[i];
	              }
	          }
	          return maxElement;
	        }
	      } else {
	          return null;
	      }
	    },

	    _functionMin: function(resolvedArgs) {
	      if (resolvedArgs[0].length > 0) {
	        var typeName = this._getTypeName(resolvedArgs[0][0]);
	        if (typeName === TYPE_NUMBER) {
	          return Math.min.apply(Math, resolvedArgs[0]);
	        } else {
	          var elements = resolvedArgs[0];
	          var minElement = elements[0];
	          for (var i = 1; i < elements.length; i++) {
	              if (elements[i].localeCompare(minElement) < 0) {
	                  minElement = elements[i];
	              }
	          }
	          return minElement;
	        }
	      } else {
	        return null;
	      }
	    },

	    _functionSum: function(resolvedArgs) {
	      var sum = 0;
	      var listToSum = resolvedArgs[0];
	      for (var i = 0; i < listToSum.length; i++) {
	        sum += listToSum[i];
	      }
	      return sum;
	    },

	    _functionType: function(resolvedArgs) {
	        switch (this._getTypeName(resolvedArgs[0])) {
	          case TYPE_NUMBER:
	            return "number";
	          case TYPE_STRING:
	            return "string";
	          case TYPE_ARRAY:
	            return "array";
	          case TYPE_OBJECT:
	            return "object";
	          case TYPE_BOOLEAN:
	            return "boolean";
	          case TYPE_EXPREF:
	            return "expref";
	          case TYPE_NULL:
	            return "null";
	        }
	    },

	    _functionKeys: function(resolvedArgs) {
	        return Object.keys(resolvedArgs[0]);
	    },

	    _functionValues: function(resolvedArgs) {
	        var obj = resolvedArgs[0];
	        var keys = Object.keys(obj);
	        var values = [];
	        for (var i = 0; i < keys.length; i++) {
	            values.push(obj[keys[i]]);
	        }
	        return values;
	    },

	    _functionJoin: function(resolvedArgs) {
	        var joinChar = resolvedArgs[0];
	        var listJoin = resolvedArgs[1];
	        return listJoin.join(joinChar);
	    },

	    _functionToArray: function(resolvedArgs) {
	        if (this._getTypeName(resolvedArgs[0]) === TYPE_ARRAY) {
	            return resolvedArgs[0];
	        } else {
	            return [resolvedArgs[0]];
	        }
	    },

	    _functionToString: function(resolvedArgs) {
	        if (this._getTypeName(resolvedArgs[0]) === TYPE_STRING) {
	            return resolvedArgs[0];
	        } else {
	            return JSON.stringify(resolvedArgs[0]);
	        }
	    },

	    _functionToNumber: function(resolvedArgs) {
	        var typeName = this._getTypeName(resolvedArgs[0]);
	        var convertedValue;
	        if (typeName === TYPE_NUMBER) {
	            return resolvedArgs[0];
	        } else if (typeName === TYPE_STRING) {
	            convertedValue = +resolvedArgs[0];
	            if (!isNaN(convertedValue)) {
	                return convertedValue;
	            }
	        }
	        return null;
	    },

	    _functionNotNull: function(resolvedArgs) {
	        for (var i = 0; i < resolvedArgs.length; i++) {
	            if (this._getTypeName(resolvedArgs[i]) !== TYPE_NULL) {
	                return resolvedArgs[i];
	            }
	        }
	        return null;
	    },

	    _functionSort: function(resolvedArgs) {
	        var sortedArray = resolvedArgs[0].slice(0);
	        sortedArray.sort();
	        return sortedArray;
	    },

	    _functionSortBy: function(resolvedArgs) {
	        var sortedArray = resolvedArgs[0].slice(0);
	        if (sortedArray.length === 0) {
	            return sortedArray;
	        }
	        var interpreter = this._interpreter;
	        var exprefNode = resolvedArgs[1];
	        var requiredType = this._getTypeName(
	            interpreter.visit(exprefNode, sortedArray[0]));
	        if ([TYPE_NUMBER, TYPE_STRING].indexOf(requiredType) < 0) {
	            throw new Error("TypeError");
	        }
	        var that = this;
	        // In order to get a stable sort out of an unstable
	        // sort algorithm, we decorate/sort/undecorate (DSU)
	        // by creating a new list of [index, element] pairs.
	        // In the cmp function, if the evaluated elements are
	        // equal, then the index will be used as the tiebreaker.
	        // After the decorated list has been sorted, it will be
	        // undecorated to extract the original elements.
	        var decorated = [];
	        for (var i = 0; i < sortedArray.length; i++) {
	          decorated.push([i, sortedArray[i]]);
	        }
	        decorated.sort(function(a, b) {
	          var exprA = interpreter.visit(exprefNode, a[1]);
	          var exprB = interpreter.visit(exprefNode, b[1]);
	          if (that._getTypeName(exprA) !== requiredType) {
	              throw new Error(
	                  "TypeError: expected " + requiredType + ", received " +
	                  that._getTypeName(exprA));
	          } else if (that._getTypeName(exprB) !== requiredType) {
	              throw new Error(
	                  "TypeError: expected " + requiredType + ", received " +
	                  that._getTypeName(exprB));
	          }
	          if (exprA > exprB) {
	            return 1;
	          } else if (exprA < exprB) {
	            return -1;
	          } else {
	            // If they're equal compare the items by their
	            // order to maintain relative order of equal keys
	            // (i.e. to get a stable sort).
	            return a[0] - b[0];
	          }
	        });
	        // Undecorate: extract out the original list elements.
	        for (var j = 0; j < decorated.length; j++) {
	          sortedArray[j] = decorated[j][1];
	        }
	        return sortedArray;
	    },

	    _functionMaxBy: function(resolvedArgs) {
	      var exprefNode = resolvedArgs[1];
	      var resolvedArray = resolvedArgs[0];
	      var keyFunction = this.createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
	      var maxNumber = -Infinity;
	      var maxRecord;
	      var current;
	      for (var i = 0; i < resolvedArray.length; i++) {
	        current = keyFunction(resolvedArray[i]);
	        if (current > maxNumber) {
	          maxNumber = current;
	          maxRecord = resolvedArray[i];
	        }
	      }
	      return maxRecord;
	    },

	    _functionMinBy: function(resolvedArgs) {
	      var exprefNode = resolvedArgs[1];
	      var resolvedArray = resolvedArgs[0];
	      var keyFunction = this.createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
	      var minNumber = Infinity;
	      var minRecord;
	      var current;
	      for (var i = 0; i < resolvedArray.length; i++) {
	        current = keyFunction(resolvedArray[i]);
	        if (current < minNumber) {
	          minNumber = current;
	          minRecord = resolvedArray[i];
	        }
	      }
	      return minRecord;
	    },

	    createKeyFunction: function(exprefNode, allowedTypes) {
	      var that = this;
	      var interpreter = this._interpreter;
	      var keyFunc = function(x) {
	        var current = interpreter.visit(exprefNode, x);
	        if (allowedTypes.indexOf(that._getTypeName(current)) < 0) {
	          var msg = "TypeError: expected one of " + allowedTypes +
	                    ", received " + that._getTypeName(current);
	          throw new Error(msg);
	        }
	        return current;
	      };
	      return keyFunc;
	    }

	  };

	  function compile(stream) {
	    var parser = new Parser();
	    var ast = parser.parse(stream);
	    return ast;
	  }

	  function tokenize(stream) {
	      var lexer = new Lexer();
	      return lexer.tokenize(stream);
	  }

	  function search(data, expression) {
	      var parser = new Parser();
	      // This needs to be improved.  Both the interpreter and runtime depend on
	      // each other.  The runtime needs the interpreter to support exprefs.
	      // There's likely a clean way to avoid the cyclic dependency.
	      var runtime = new Runtime();
	      var interpreter = new TreeInterpreter(runtime);
	      runtime._interpreter = interpreter;
	      var node = parser.parse(expression);
	      return interpreter.search(node, data);
	  }

	  exports.tokenize = tokenize;
	  exports.compile = compile;
	  exports.search = search;
	  exports.strictDeepEqual = strictDeepEqual;
	})( false ? this.jmespath = {} : exports);


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);
	var inherit = AWS.util.inherit;
	var jmespath = __webpack_require__(52);

	/**
	 * This class encapsulates the response information
	 * from a service request operation sent through {AWS.Request}.
	 * The response object has two main properties for getting information
	 * back from a request:
	 *
	 * ## The `data` property
	 *
	 * The `response.data` property contains the serialized object data
	 * retrieved from the service request. For instance, for an
	 * Amazon DynamoDB `listTables` method call, the response data might
	 * look like:
	 *
	 * ```
	 * > resp.data
	 * { TableNames:
	 *    [ 'table1', 'table2', ... ] }
	 * ```
	 *
	 * The `data` property can be null if an error occurs (see below).
	 *
	 * ## The `error` property
	 *
	 * In the event of a service error (or transfer error), the
	 * `response.error` property will be filled with the given
	 * error data in the form:
	 *
	 * ```
	 * { code: 'SHORT_UNIQUE_ERROR_CODE',
	 *   message: 'Some human readable error message' }
	 * ```
	 *
	 * In the case of an error, the `data` property will be `null`.
	 * Note that if you handle events that can be in a failure state,
	 * you should always check whether `response.error` is set
	 * before attempting to access the `response.data` property.
	 *
	 * @!attribute data
	 *   @readonly
	 *   @!group Data Properties
	 *   @note Inside of a {AWS.Request~httpData} event, this
	 *     property contains a single raw packet instead of the
	 *     full de-serialized service response.
	 *   @return [Object] the de-serialized response data
	 *     from the service.
	 *
	 * @!attribute error
	 *   An structure containing information about a service
	 *   or networking error.
	 *   @readonly
	 *   @!group Data Properties
	 *   @note This attribute is only filled if a service or
	 *     networking error occurs.
	 *   @return [Error]
	 *     * code [String] a unique short code representing the
	 *       error that was emitted.
	 *     * message [String] a longer human readable error message
	 *     * retryable [Boolean] whether the error message is
	 *       retryable.
	 *     * statusCode [Numeric] in the case of a request that reached the service,
	 *       this value contains the response status code.
	 *     * time [Date] the date time object when the error occurred.
	 *     * hostname [String] set when a networking error occurs to easily
	 *       identify the endpoint of the request.
	 *     * region [String] set when a networking error occurs to easily
	 *       identify the region of the request.
	 *
	 * @!attribute requestId
	 *   @readonly
	 *   @!group Data Properties
	 *   @return [String] the unique request ID associated with the response.
	 *     Log this value when debugging requests for AWS support.
	 *
	 * @!attribute retryCount
	 *   @readonly
	 *   @!group Operation Properties
	 *   @return [Integer] the number of retries that were
	 *     attempted before the request was completed.
	 *
	 * @!attribute redirectCount
	 *   @readonly
	 *   @!group Operation Properties
	 *   @return [Integer] the number of redirects that were
	 *     followed before the request was completed.
	 *
	 * @!attribute httpResponse
	 *   @readonly
	 *   @!group HTTP Properties
	 *   @return [AWS.HttpResponse] the raw HTTP response object
	 *     containing the response headers and body information
	 *     from the server.
	 *
	 * @see AWS.Request
	 */
	AWS.Response = inherit({

	  /**
	   * @api private
	   */
	  constructor: function Response(request) {
	    this.request = request;
	    this.data = null;
	    this.error = null;
	    this.retryCount = 0;
	    this.redirectCount = 0;
	    this.httpResponse = new AWS.HttpResponse();
	    if (request) {
	      this.maxRetries = request.service.numRetries();
	      this.maxRedirects = request.service.config.maxRedirects;
	    }
	  },

	  /**
	   * Creates a new request for the next page of response data, calling the
	   * callback with the page data if a callback is provided.
	   *
	   * @callback callback function(err, data)
	   *   Called when a page of data is returned from the next request.
	   *
	   *   @param err [Error] an error object, if an error occurred in the request
	   *   @param data [Object] the next page of data, or null, if there are no
	   *     more pages left.
	   * @return [AWS.Request] the request object for the next page of data
	   * @return [null] if no callback is provided and there are no pages left
	   *   to retrieve.
	   * @since v1.4.0
	   */
	  nextPage: function nextPage(callback) {
	    var config;
	    var service = this.request.service;
	    var operation = this.request.operation;
	    try {
	      config = service.paginationConfig(operation, true);
	    } catch (e) { this.error = e; }

	    if (!this.hasNextPage()) {
	      if (callback) callback(this.error, null);
	      else if (this.error) throw this.error;
	      return null;
	    }

	    var params = AWS.util.copy(this.request.params);
	    if (!this.nextPageTokens) {
	      return callback ? callback(null, null) : null;
	    } else {
	      var inputTokens = config.inputToken;
	      if (typeof inputTokens === 'string') inputTokens = [inputTokens];
	      for (var i = 0; i < inputTokens.length; i++) {
	        params[inputTokens[i]] = this.nextPageTokens[i];
	      }
	      return service.makeRequest(this.request.operation, params, callback);
	    }
	  },

	  /**
	   * @return [Boolean] whether more pages of data can be returned by further
	   *   requests
	   * @since v1.4.0
	   */
	  hasNextPage: function hasNextPage() {
	    this.cacheNextPageTokens();
	    if (this.nextPageTokens) return true;
	    if (this.nextPageTokens === undefined) return undefined;
	    else return false;
	  },

	  /**
	   * @api private
	   */
	  cacheNextPageTokens: function cacheNextPageTokens() {
	    if (Object.prototype.hasOwnProperty.call(this, 'nextPageTokens')) return this.nextPageTokens;
	    this.nextPageTokens = undefined;

	    var config = this.request.service.paginationConfig(this.request.operation);
	    if (!config) return this.nextPageTokens;

	    this.nextPageTokens = null;
	    if (config.moreResults) {
	      if (!jmespath.search(this.data, config.moreResults)) {
	        return this.nextPageTokens;
	      }
	    }

	    var exprs = config.outputToken;
	    if (typeof exprs === 'string') exprs = [exprs];
	    AWS.util.arrayEach.call(this, exprs, function (expr) {
	      var output = jmespath.search(this.data, expr);
	      if (output) {
	        this.nextPageTokens = this.nextPageTokens || [];
	        this.nextPageTokens.push(output);
	      }
	    });

	    return this.nextPageTokens;
	  }

	});


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2012-2013 Amazon.com, Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"). You
	 * may not use this file except in compliance with the License. A copy of
	 * the License is located at
	 *
	 *     http://aws.amazon.com/apache2.0/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */

	var AWS = __webpack_require__(1);
	var inherit = AWS.util.inherit;
	var jmespath = __webpack_require__(52);

	/**
	 * @api private
	 */
	function CHECK_ACCEPTORS(resp) {
	  var waiter = resp.request._waiter;
	  var acceptors = waiter.config.acceptors;
	  var acceptorMatched = false;
	  var state = 'retry';

	  acceptors.forEach(function(acceptor) {
	    if (!acceptorMatched) {
	      var matcher = waiter.matchers[acceptor.matcher];
	      if (matcher && matcher(resp, acceptor.expected, acceptor.argument)) {
	        acceptorMatched = true;
	        state = acceptor.state;
	      }
	    }
	  });

	  if (!acceptorMatched && resp.error) state = 'failure';

	  if (state === 'success') {
	    waiter.setSuccess(resp);
	  } else {
	    waiter.setError(resp, state === 'retry');
	  }
	}

	/**
	 * @api private
	 */
	AWS.ResourceWaiter = inherit({
	  /**
	   * Waits for a given state on a service object
	   * @param service [Service] the service object to wait on
	   * @param state [String] the state (defined in waiter configuration) to wait
	   *   for.
	   * @example Create a waiter for running EC2 instances
	   *   var ec2 = new AWS.EC2;
	   *   var waiter = new AWS.ResourceWaiter(ec2, 'instanceRunning');
	   */
	  constructor: function constructor(service, state) {
	    this.service = service;
	    this.state = state;
	    this.loadWaiterConfig(this.state);
	  },

	  service: null,

	  state: null,

	  config: null,

	  matchers: {
	    path: function(resp, expected, argument) {
	      try {
	        var result = jmespath.search(resp.data, argument);
	      } catch (err) {
	        return false;
	      }

	      return jmespath.strictDeepEqual(result,expected);
	    },

	    pathAll: function(resp, expected, argument) {
	      try {
	        var results = jmespath.search(resp.data, argument);
	      } catch (err) {
	        return false;
	      }

	      if (!Array.isArray(results)) results = [results];
	      var numResults = results.length;
	      if (!numResults) return false;
	      for (var ind = 0 ; ind < numResults; ind++) {
	        if (!jmespath.strictDeepEqual(results[ind], expected)) {
	          return false;
	        }
	      }
	      return true;
	    },

	    pathAny: function(resp, expected, argument) {
	      try {
	        var results = jmespath.search(resp.data, argument);
	      } catch (err) {
	        return false;
	      }

	      if (!Array.isArray(results)) results = [results];
	      var numResults = results.length;
	      for (var ind = 0 ; ind < numResults; ind++) {
	        if (jmespath.strictDeepEqual(results[ind], expected)) {
	          return true;
	        }
	      }
	      return false;
	    },

	    status: function(resp, expected) {
	      var statusCode = resp.httpResponse.statusCode;
	      return (typeof statusCode === 'number') && (statusCode === expected);
	    },

	    error: function(resp, expected) {
	      if (typeof expected === 'string' && resp.error) {
	        return expected === resp.error.code;
	      }
	      // if expected is not string, can be boolean indicating presence of error
	      return expected === !!resp.error;
	    }
	  },

	  listeners: new AWS.SequentialExecutor().addNamedListeners(function(add) {
	    add('RETRY_CHECK', 'retry', function(resp) {
	      var waiter = resp.request._waiter;
	      if (resp.error && resp.error.code === 'ResourceNotReady') {
	        resp.error.retryDelay = (waiter.config.delay || 0) * 1000;
	      }
	    });

	    add('CHECK_OUTPUT', 'extractData', CHECK_ACCEPTORS);

	    add('CHECK_ERROR', 'extractError', CHECK_ACCEPTORS);
	  }),

	  /**
	   * @return [AWS.Request]
	   */
	  wait: function wait(params, callback) {
	    if (typeof params === 'function') {
	      callback = params; params = undefined;
	    }

	    if (params && params.$waiter) {
	      params = AWS.util.copy(params);
	      if (typeof params.$waiter.delay === 'number') {
	        this.config.delay = params.$waiter.delay;
	      }
	      if (typeof params.$waiter.maxAttempts === 'number') {
	        this.config.maxAttempts = params.$waiter.maxAttempts;
	      }
	      delete params.$waiter;
	    }

	    var request = this.service.makeRequest(this.config.operation, params);
	    request._waiter = this;
	    request.response.maxRetries = this.config.maxAttempts;
	    request.addListeners(this.listeners);

	    if (callback) request.send(callback);
	    return request;
	  },

	  setSuccess: function setSuccess(resp) {
	    resp.error = null;
	    resp.data = resp.data || {};
	    resp.request.removeAllListeners('extractData');
	  },

	  setError: function setError(resp, retryable) {
	    resp.data = null;
	    resp.error = AWS.util.error(resp.error || new Error(), {
	      code: 'ResourceNotReady',
	      message: 'Resource is not in the state ' + this.state,
	      retryable: retryable
	    });
	  },

	  /**
	   * Loads waiter configuration from API configuration
	   *
	   * @api private
	   */
	  loadWaiterConfig: function loadWaiterConfig(state) {
	    if (!this.service.api.waiters[state]) {
	      throw new AWS.util.error(new Error(), {
	        code: 'StateNotFoundError',
	        message: 'State ' + state + ' not found.'
	      });
	    }

	    this.config = AWS.util.copy(this.service.api.waiters[state]);
	  }
	});


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);

	var inherit = AWS.util.inherit;

	/**
	 * @api private
	 */
	AWS.Signers.RequestSigner = inherit({
	  constructor: function RequestSigner(request) {
	    this.request = request;
	  },

	  setServiceClientId: function setServiceClientId(id) {
	    this.serviceClientId = id;
	  },

	  getServiceClientId: function getServiceClientId() {
	    return this.serviceClientId;
	  }
	});

	AWS.Signers.RequestSigner.getVersion = function getVersion(version) {
	  switch (version) {
	    case 'v2': return AWS.Signers.V2;
	    case 'v3': return AWS.Signers.V3;
	    case 's3v4': return AWS.Signers.V4;
	    case 'v4': return AWS.Signers.V4;
	    case 's3': return AWS.Signers.S3;
	    case 'v3https': return AWS.Signers.V3Https;
	  }
	  throw new Error('Unknown signing version ' + version);
	};

	__webpack_require__(56);
	__webpack_require__(57);
	__webpack_require__(58);
	__webpack_require__(59);
	__webpack_require__(61);
	__webpack_require__(62);


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);
	var inherit = AWS.util.inherit;

	/**
	 * @api private
	 */
	AWS.Signers.V2 = inherit(AWS.Signers.RequestSigner, {
	  addAuthorization: function addAuthorization(credentials, date) {

	    if (!date) date = AWS.util.date.getDate();

	    var r = this.request;

	    r.params.Timestamp = AWS.util.date.iso8601(date);
	    r.params.SignatureVersion = '2';
	    r.params.SignatureMethod = 'HmacSHA256';
	    r.params.AWSAccessKeyId = credentials.accessKeyId;

	    if (credentials.sessionToken) {
	      r.params.SecurityToken = credentials.sessionToken;
	    }

	    delete r.params.Signature; // delete old Signature for re-signing
	    r.params.Signature = this.signature(credentials);

	    r.body = AWS.util.queryParamsToString(r.params);
	    r.headers['Content-Length'] = r.body.length;
	  },

	  signature: function signature(credentials) {
	    return AWS.util.crypto.hmac(credentials.secretAccessKey, this.stringToSign(), 'base64');
	  },

	  stringToSign: function stringToSign() {
	    var parts = [];
	    parts.push(this.request.method);
	    parts.push(this.request.endpoint.host.toLowerCase());
	    parts.push(this.request.pathname());
	    parts.push(AWS.util.queryParamsToString(this.request.params));
	    return parts.join('\n');
	  }

	});

	/**
	 * @api private
	 */
	module.exports = AWS.Signers.V2;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);
	var inherit = AWS.util.inherit;

	/**
	 * @api private
	 */
	AWS.Signers.V3 = inherit(AWS.Signers.RequestSigner, {
	  addAuthorization: function addAuthorization(credentials, date) {

	    var datetime = AWS.util.date.rfc822(date);

	    this.request.headers['X-Amz-Date'] = datetime;

	    if (credentials.sessionToken) {
	      this.request.headers['x-amz-security-token'] = credentials.sessionToken;
	    }

	    this.request.headers['X-Amzn-Authorization'] =
	      this.authorization(credentials, datetime);

	  },

	  authorization: function authorization(credentials) {
	    return 'AWS3 ' +
	      'AWSAccessKeyId=' + credentials.accessKeyId + ',' +
	      'Algorithm=HmacSHA256,' +
	      'SignedHeaders=' + this.signedHeaders() + ',' +
	      'Signature=' + this.signature(credentials);
	  },

	  signedHeaders: function signedHeaders() {
	    var headers = [];
	    AWS.util.arrayEach(this.headersToSign(), function iterator(h) {
	      headers.push(h.toLowerCase());
	    });
	    return headers.sort().join(';');
	  },

	  canonicalHeaders: function canonicalHeaders() {
	    var headers = this.request.headers;
	    var parts = [];
	    AWS.util.arrayEach(this.headersToSign(), function iterator(h) {
	      parts.push(h.toLowerCase().trim() + ':' + String(headers[h]).trim());
	    });
	    return parts.sort().join('\n') + '\n';
	  },

	  headersToSign: function headersToSign() {
	    var headers = [];
	    AWS.util.each(this.request.headers, function iterator(k) {
	      if (k === 'Host' || k === 'Content-Encoding' || k.match(/^X-Amz/i)) {
	        headers.push(k);
	      }
	    });
	    return headers;
	  },

	  signature: function signature(credentials) {
	    return AWS.util.crypto.hmac(credentials.secretAccessKey, this.stringToSign(), 'base64');
	  },

	  stringToSign: function stringToSign() {
	    var parts = [];
	    parts.push(this.request.method);
	    parts.push('/');
	    parts.push('');
	    parts.push(this.canonicalHeaders());
	    parts.push(this.request.body);
	    return AWS.util.crypto.sha256(parts.join('\n'));
	  }

	});

	/**
	 * @api private
	 */
	module.exports = AWS.Signers.V3;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);
	var inherit = AWS.util.inherit;

	__webpack_require__(57);

	/**
	 * @api private
	 */
	AWS.Signers.V3Https = inherit(AWS.Signers.V3, {
	  authorization: function authorization(credentials) {
	    return 'AWS3-HTTPS ' +
	      'AWSAccessKeyId=' + credentials.accessKeyId + ',' +
	      'Algorithm=HmacSHA256,' +
	      'Signature=' + this.signature(credentials);
	  },

	  stringToSign: function stringToSign() {
	    return this.request.headers['X-Amz-Date'];
	  }
	});

	/**
	 * @api private
	 */
	module.exports = AWS.Signers.V3Https;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);
	var v4Credentials = __webpack_require__(60);
	var inherit = AWS.util.inherit;

	/**
	 * @api private
	 */
	var expiresHeader = 'presigned-expires';

	/**
	 * @api private
	 */
	AWS.Signers.V4 = inherit(AWS.Signers.RequestSigner, {
	  constructor: function V4(request, serviceName, options) {
	    AWS.Signers.RequestSigner.call(this, request);
	    this.serviceName = serviceName;
	    options = options || {};
	    this.signatureCache = typeof options.signatureCache === 'boolean' ? options.signatureCache : true;
	    this.operation = options.operation;
	    this.signatureVersion = options.signatureVersion;
	  },

	  algorithm: 'AWS4-HMAC-SHA256',

	  addAuthorization: function addAuthorization(credentials, date) {
	    var datetime = AWS.util.date.iso8601(date).replace(/[:\-]|\.\d{3}/g, '');

	    if (this.isPresigned()) {
	      this.updateForPresigned(credentials, datetime);
	    } else {
	      this.addHeaders(credentials, datetime);
	    }

	    this.request.headers['Authorization'] =
	      this.authorization(credentials, datetime);
	  },

	  addHeaders: function addHeaders(credentials, datetime) {
	    this.request.headers['X-Amz-Date'] = datetime;
	    if (credentials.sessionToken) {
	      this.request.headers['x-amz-security-token'] = credentials.sessionToken;
	    }
	  },

	  updateForPresigned: function updateForPresigned(credentials, datetime) {
	    var credString = this.credentialString(datetime);
	    var qs = {
	      'X-Amz-Date': datetime,
	      'X-Amz-Algorithm': this.algorithm,
	      'X-Amz-Credential': credentials.accessKeyId + '/' + credString,
	      'X-Amz-Expires': this.request.headers[expiresHeader],
	      'X-Amz-SignedHeaders': this.signedHeaders()
	    };

	    if (credentials.sessionToken) {
	      qs['X-Amz-Security-Token'] = credentials.sessionToken;
	    }

	    if (this.request.headers['Content-Type']) {
	      qs['Content-Type'] = this.request.headers['Content-Type'];
	    }
	    if (this.request.headers['Content-MD5']) {
	      qs['Content-MD5'] = this.request.headers['Content-MD5'];
	    }
	    if (this.request.headers['Cache-Control']) {
	      qs['Cache-Control'] = this.request.headers['Cache-Control'];
	    }

	    // need to pull in any other X-Amz-* headers
	    AWS.util.each.call(this, this.request.headers, function(key, value) {
	      if (key === expiresHeader) return;
	      if (this.isSignableHeader(key)) {
	        var lowerKey = key.toLowerCase();
	        // Metadata should be normalized
	        if (lowerKey.indexOf('x-amz-meta-') === 0) {
	          qs[lowerKey] = value;
	        } else if (lowerKey.indexOf('x-amz-') === 0) {
	          qs[key] = value;
	        }
	      }
	    });

	    var sep = this.request.path.indexOf('?') >= 0 ? '&' : '?';
	    this.request.path += sep + AWS.util.queryParamsToString(qs);
	  },

	  authorization: function authorization(credentials, datetime) {
	    var parts = [];
	    var credString = this.credentialString(datetime);
	    parts.push(this.algorithm + ' Credential=' +
	      credentials.accessKeyId + '/' + credString);
	    parts.push('SignedHeaders=' + this.signedHeaders());
	    parts.push('Signature=' + this.signature(credentials, datetime));
	    return parts.join(', ');
	  },

	  signature: function signature(credentials, datetime) {
	    var signingKey = v4Credentials.getSigningKey(
	      credentials,
	      datetime.substr(0, 8),
	      this.request.region,
	      this.serviceName,
	      this.signatureCache
	    );
	    return AWS.util.crypto.hmac(signingKey, this.stringToSign(datetime), 'hex');
	  },

	  stringToSign: function stringToSign(datetime) {
	    var parts = [];
	    parts.push('AWS4-HMAC-SHA256');
	    parts.push(datetime);
	    parts.push(this.credentialString(datetime));
	    parts.push(this.hexEncodedHash(this.canonicalString()));
	    return parts.join('\n');
	  },

	  canonicalString: function canonicalString() {
	    var parts = [], pathname = this.request.pathname();
	    if (this.serviceName !== 's3' && this.signatureVersion !== 's3v4') pathname = AWS.util.uriEscapePath(pathname);

	    parts.push(this.request.method);
	    parts.push(pathname);
	    parts.push(this.request.search());
	    parts.push(this.canonicalHeaders() + '\n');
	    parts.push(this.signedHeaders());
	    parts.push(this.hexEncodedBodyHash());
	    return parts.join('\n');
	  },

	  canonicalHeaders: function canonicalHeaders() {
	    var headers = [];
	    AWS.util.each.call(this, this.request.headers, function (key, item) {
	      headers.push([key, item]);
	    });
	    headers.sort(function (a, b) {
	      return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
	    });
	    var parts = [];
	    AWS.util.arrayEach.call(this, headers, function (item) {
	      var key = item[0].toLowerCase();
	      if (this.isSignableHeader(key)) {
	        var value = item[1];
	        if (typeof value === 'undefined' || value === null || typeof value.toString !== 'function') {
	          throw AWS.util.error(new Error('Header ' + key + ' contains invalid value'), {
	            code: 'InvalidHeader'
	          });
	        }
	        parts.push(key + ':' +
	          this.canonicalHeaderValues(value.toString()));
	      }
	    });
	    return parts.join('\n');
	  },

	  canonicalHeaderValues: function canonicalHeaderValues(values) {
	    return values.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
	  },

	  signedHeaders: function signedHeaders() {
	    var keys = [];
	    AWS.util.each.call(this, this.request.headers, function (key) {
	      key = key.toLowerCase();
	      if (this.isSignableHeader(key)) keys.push(key);
	    });
	    return keys.sort().join(';');
	  },

	  credentialString: function credentialString(datetime) {
	    return v4Credentials.createScope(
	      datetime.substr(0, 8),
	      this.request.region,
	      this.serviceName
	    );
	  },

	  hexEncodedHash: function hash(string) {
	    return AWS.util.crypto.sha256(string, 'hex');
	  },

	  hexEncodedBodyHash: function hexEncodedBodyHash() {
	    var request = this.request;
	    if (this.isPresigned() && (['s3', 's3-object-lambda'].indexOf(this.serviceName) > -1) && !request.body) {
	      return 'UNSIGNED-PAYLOAD';
	    } else if (request.headers['X-Amz-Content-Sha256']) {
	      return request.headers['X-Amz-Content-Sha256'];
	    } else {
	      return this.hexEncodedHash(this.request.body || '');
	    }
	  },

	  unsignableHeaders: [
	    'authorization',
	    'content-type',
	    'content-length',
	    'user-agent',
	    expiresHeader,
	    'expect',
	    'x-amzn-trace-id'
	  ],

	  isSignableHeader: function isSignableHeader(key) {
	    if (key.toLowerCase().indexOf('x-amz-') === 0) return true;
	    return this.unsignableHeaders.indexOf(key) < 0;
	  },

	  isPresigned: function isPresigned() {
	    return this.request.headers[expiresHeader] ? true : false;
	  }

	});

	/**
	 * @api private
	 */
	module.exports = AWS.Signers.V4;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);

	/**
	 * @api private
	 */
	var cachedSecret = {};

	/**
	 * @api private
	 */
	var cacheQueue = [];

	/**
	 * @api private
	 */
	var maxCacheEntries = 50;

	/**
	 * @api private
	 */
	var v4Identifier = 'aws4_request';

	/**
	 * @api private
	 */
	module.exports = {
	  /**
	   * @api private
	   *
	   * @param date [String]
	   * @param region [String]
	   * @param serviceName [String]
	   * @return [String]
	   */
	  createScope: function createScope(date, region, serviceName) {
	    return [
	      date.substr(0, 8),
	      region,
	      serviceName,
	      v4Identifier
	    ].join('/');
	  },

	  /**
	   * @api private
	   *
	   * @param credentials [Credentials]
	   * @param date [String]
	   * @param region [String]
	   * @param service [String]
	   * @param shouldCache [Boolean]
	   * @return [String]
	   */
	  getSigningKey: function getSigningKey(
	    credentials,
	    date,
	    region,
	    service,
	    shouldCache
	  ) {
	    var credsIdentifier = AWS.util.crypto
	      .hmac(credentials.secretAccessKey, credentials.accessKeyId, 'base64');
	    var cacheKey = [credsIdentifier, date, region, service].join('_');
	    shouldCache = shouldCache !== false;
	    if (shouldCache && (cacheKey in cachedSecret)) {
	      return cachedSecret[cacheKey];
	    }

	    var kDate = AWS.util.crypto.hmac(
	      'AWS4' + credentials.secretAccessKey,
	      date,
	      'buffer'
	    );
	    var kRegion = AWS.util.crypto.hmac(kDate, region, 'buffer');
	    var kService = AWS.util.crypto.hmac(kRegion, service, 'buffer');

	    var signingKey = AWS.util.crypto.hmac(kService, v4Identifier, 'buffer');
	    if (shouldCache) {
	      cachedSecret[cacheKey] = signingKey;
	      cacheQueue.push(cacheKey);
	      if (cacheQueue.length > maxCacheEntries) {
	        // remove the oldest entry (not the least recently used)
	        delete cachedSecret[cacheQueue.shift()];
	      }
	    }

	    return signingKey;
	  },

	  /**
	   * @api private
	   *
	   * Empties the derived signing key cache. Made available for testing purposes
	   * only.
	   */
	  emptyCache: function emptyCache() {
	    cachedSecret = {};
	    cacheQueue = [];
	  }
	};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);
	var inherit = AWS.util.inherit;

	/**
	 * @api private
	 */
	AWS.Signers.S3 = inherit(AWS.Signers.RequestSigner, {
	  /**
	   * When building the stringToSign, these sub resource params should be
	   * part of the canonical resource string with their NON-decoded values
	   */
	  subResources: {
	    'acl': 1,
	    'accelerate': 1,
	    'analytics': 1,
	    'cors': 1,
	    'lifecycle': 1,
	    'delete': 1,
	    'inventory': 1,
	    'location': 1,
	    'logging': 1,
	    'metrics': 1,
	    'notification': 1,
	    'partNumber': 1,
	    'policy': 1,
	    'requestPayment': 1,
	    'replication': 1,
	    'restore': 1,
	    'tagging': 1,
	    'torrent': 1,
	    'uploadId': 1,
	    'uploads': 1,
	    'versionId': 1,
	    'versioning': 1,
	    'versions': 1,
	    'website': 1
	  },

	  // when building the stringToSign, these querystring params should be
	  // part of the canonical resource string with their NON-encoded values
	  responseHeaders: {
	    'response-content-type': 1,
	    'response-content-language': 1,
	    'response-expires': 1,
	    'response-cache-control': 1,
	    'response-content-disposition': 1,
	    'response-content-encoding': 1
	  },

	  addAuthorization: function addAuthorization(credentials, date) {
	    if (!this.request.headers['presigned-expires']) {
	      this.request.headers['X-Amz-Date'] = AWS.util.date.rfc822(date);
	    }

	    if (credentials.sessionToken) {
	      // presigned URLs require this header to be lowercased
	      this.request.headers['x-amz-security-token'] = credentials.sessionToken;
	    }

	    var signature = this.sign(credentials.secretAccessKey, this.stringToSign());
	    var auth = 'AWS ' + credentials.accessKeyId + ':' + signature;

	    this.request.headers['Authorization'] = auth;
	  },

	  stringToSign: function stringToSign() {
	    var r = this.request;

	    var parts = [];
	    parts.push(r.method);
	    parts.push(r.headers['Content-MD5'] || '');
	    parts.push(r.headers['Content-Type'] || '');

	    // This is the "Date" header, but we use X-Amz-Date.
	    // The S3 signing mechanism requires us to pass an empty
	    // string for this Date header regardless.
	    parts.push(r.headers['presigned-expires'] || '');

	    var headers = this.canonicalizedAmzHeaders();
	    if (headers) parts.push(headers);
	    parts.push(this.canonicalizedResource());

	    return parts.join('\n');

	  },

	  canonicalizedAmzHeaders: function canonicalizedAmzHeaders() {

	    var amzHeaders = [];

	    AWS.util.each(this.request.headers, function (name) {
	      if (name.match(/^x-amz-/i))
	        amzHeaders.push(name);
	    });

	    amzHeaders.sort(function (a, b) {
	      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
	    });

	    var parts = [];
	    AWS.util.arrayEach.call(this, amzHeaders, function (name) {
	      parts.push(name.toLowerCase() + ':' + String(this.request.headers[name]));
	    });

	    return parts.join('\n');

	  },

	  canonicalizedResource: function canonicalizedResource() {

	    var r = this.request;

	    var parts = r.path.split('?');
	    var path = parts[0];
	    var querystring = parts[1];

	    var resource = '';

	    if (r.virtualHostedBucket)
	      resource += '/' + r.virtualHostedBucket;

	    resource += path;

	    if (querystring) {

	      // collect a list of sub resources and query params that need to be signed
	      var resources = [];

	      AWS.util.arrayEach.call(this, querystring.split('&'), function (param) {
	        var name = param.split('=')[0];
	        var value = param.split('=')[1];
	        if (this.subResources[name] || this.responseHeaders[name]) {
	          var subresource = { name: name };
	          if (value !== undefined) {
	            if (this.subResources[name]) {
	              subresource.value = value;
	            } else {
	              subresource.value = decodeURIComponent(value);
	            }
	          }
	          resources.push(subresource);
	        }
	      });

	      resources.sort(function (a, b) { return a.name < b.name ? -1 : 1; });

	      if (resources.length) {

	        querystring = [];
	        AWS.util.arrayEach(resources, function (res) {
	          if (res.value === undefined) {
	            querystring.push(res.name);
	          } else {
	            querystring.push(res.name + '=' + res.value);
	          }
	        });

	        resource += '?' + querystring.join('&');
	      }

	    }

	    return resource;

	  },

	  sign: function sign(secret, string) {
	    return AWS.util.crypto.hmac(secret, string, 'base64', 'sha1');
	  }
	});

	/**
	 * @api private
	 */
	module.exports = AWS.Signers.S3;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);
	var inherit = AWS.util.inherit;

	/**
	 * @api private
	 */
	var expiresHeader = 'presigned-expires';

	/**
	 * @api private
	 */
	function signedUrlBuilder(request) {
	  var expires = request.httpRequest.headers[expiresHeader];
	  var signerClass = request.service.getSignerClass(request);

	  delete request.httpRequest.headers['User-Agent'];
	  delete request.httpRequest.headers['X-Amz-User-Agent'];

	  if (signerClass === AWS.Signers.V4) {
	    if (expires > 604800) { // one week expiry is invalid
	      var message = 'Presigning does not support expiry time greater ' +
	                    'than a week with SigV4 signing.';
	      throw AWS.util.error(new Error(), {
	        code: 'InvalidExpiryTime', message: message, retryable: false
	      });
	    }
	    request.httpRequest.headers[expiresHeader] = expires;
	  } else if (signerClass === AWS.Signers.S3) {
	    var now = request.service ? request.service.getSkewCorrectedDate() : AWS.util.date.getDate();
	    request.httpRequest.headers[expiresHeader] = parseInt(
	      AWS.util.date.unixTimestamp(now) + expires, 10).toString();
	  } else {
	    throw AWS.util.error(new Error(), {
	      message: 'Presigning only supports S3 or SigV4 signing.',
	      code: 'UnsupportedSigner', retryable: false
	    });
	  }
	}

	/**
	 * @api private
	 */
	function signedUrlSigner(request) {
	  var endpoint = request.httpRequest.endpoint;
	  var parsedUrl = AWS.util.urlParse(request.httpRequest.path);
	  var queryParams = {};

	  if (parsedUrl.search) {
	    queryParams = AWS.util.queryStringParse(parsedUrl.search.substr(1));
	  }

	  var auth = request.httpRequest.headers['Authorization'].split(' ');
	  if (auth[0] === 'AWS') {
	    auth = auth[1].split(':');
	    queryParams['Signature'] = auth.pop();
	    queryParams['AWSAccessKeyId'] = auth.join(':');

	    AWS.util.each(request.httpRequest.headers, function (key, value) {
	      if (key === expiresHeader) key = 'Expires';
	      if (key.indexOf('x-amz-meta-') === 0) {
	        // Delete existing, potentially not normalized key
	        delete queryParams[key];
	        key = key.toLowerCase();
	      }
	      queryParams[key] = value;
	    });
	    delete request.httpRequest.headers[expiresHeader];
	    delete queryParams['Authorization'];
	    delete queryParams['Host'];
	  } else if (auth[0] === 'AWS4-HMAC-SHA256') { // SigV4 signing
	    auth.shift();
	    var rest = auth.join(' ');
	    var signature = rest.match(/Signature=(.*?)(?:,|\s|\r?\n|$)/)[1];
	    queryParams['X-Amz-Signature'] = signature;
	    delete queryParams['Expires'];
	  }

	  // build URL
	  endpoint.pathname = parsedUrl.pathname;
	  endpoint.search = AWS.util.queryParamsToString(queryParams);
	}

	/**
	 * @api private
	 */
	AWS.Signers.Presign = inherit({
	  /**
	   * @api private
	   */
	  sign: function sign(request, expireTime, callback) {
	    request.httpRequest.headers[expiresHeader] = expireTime || 3600;
	    request.on('build', signedUrlBuilder);
	    request.on('sign', signedUrlSigner);
	    request.removeListener('afterBuild',
	      AWS.EventListeners.Core.SET_CONTENT_LENGTH);
	    request.removeListener('afterBuild',
	      AWS.EventListeners.Core.COMPUTE_SHA256);

	    request.emit('beforePresign', [request]);

	    if (callback) {
	      request.build(function() {
	        if (this.response.error) callback(this.response.error);
	        else {
	          callback(null, AWS.util.urlFormat(request.httpRequest.endpoint));
	        }
	      });
	    } else {
	      request.build();
	      if (request.response.error) throw request.response.error;
	      return AWS.util.urlFormat(request.httpRequest.endpoint);
	    }
	  }
	});

	/**
	 * @api private
	 */
	module.exports = AWS.Signers.Presign;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	var AWS = __webpack_require__(1);

	/**
	 * @api private
	 */
	AWS.ParamValidator = AWS.util.inherit({
	  /**
	   * Create a new validator object.
	   *
	   * @param validation [Boolean|map] whether input parameters should be
	   *     validated against the operation description before sending the
	   *     request. Pass a map to enable any of the following specific
	   *     validation features:
	   *
	   *     * **min** [Boolean] &mdash; Validates that a value meets the min
	   *       constraint. This is enabled by default when paramValidation is set
	   *       to `true`.
	   *     * **max** [Boolean] &mdash; Validates that a value meets the max
	   *       constraint.
	   *     * **pattern** [Boolean] &mdash; Validates that a string value matches a
	   *       regular expression.
	   *     * **enum** [Boolean] &mdash; Validates that a string value matches one
	   *       of the allowable enum values.
	   */
	  constructor: function ParamValidator(validation) {
	    if (validation === true || validation === undefined) {
	      validation = {'min': true};
	    }
	    this.validation = validation;
	  },

	  validate: function validate(shape, params, context) {
	    this.errors = [];
	    this.validateMember(shape, params || {}, context || 'params');

	    if (this.errors.length > 1) {
	      var msg = this.errors.join('\n* ');
	      msg = 'There were ' + this.errors.length +
	        ' validation errors:\n* ' + msg;
	      throw AWS.util.error(new Error(msg),
	        {code: 'MultipleValidationErrors', errors: this.errors});
	    } else if (this.errors.length === 1) {
	      throw this.errors[0];
	    } else {
	      return true;
	    }
	  },

	  fail: function fail(code, message) {
	    this.errors.push(AWS.util.error(new Error(message), {code: code}));
	  },

	  validateStructure: function validateStructure(shape, params, context) {
	    this.validateType(params, context, ['object'], 'structure');

	    var paramName;
	    for (var i = 0; shape.required && i < shape.required.length; i++) {
	      paramName = shape.required[i];
	      var value = params[paramName];
	      if (value === undefined || value === null) {
	        this.fail('MissingRequiredParameter',
	          'Missing required key \'' + paramName + '\' in ' + context);
	      }
	    }

	    // validate hash members
	    for (paramName in params) {
	      if (!Object.prototype.hasOwnProperty.call(params, paramName)) continue;

	      var paramValue = params[paramName],
	          memberShape = shape.members[paramName];

	      if (memberShape !== undefined) {
	        var memberContext = [context, paramName].join('.');
	        this.validateMember(memberShape, paramValue, memberContext);
	      } else if (paramValue !== undefined && paramValue !== null) {
	        this.fail('UnexpectedParameter',
	          'Unexpected key \'' + paramName + '\' found in ' + context);
	      }
	    }

	    return true;
	  },

	  validateMember: function validateMember(shape, param, context) {
	    switch (shape.type) {
	      case 'structure':
	        return this.validateStructure(shape, param, context);
	      case 'list':
	        return this.validateList(shape, param, context);
	      case 'map':
	        return this.validateMap(shape, param, context);
	      default:
	        return this.validateScalar(shape, param, context);
	    }
	  },

	  validateList: function validateList(shape, params, context) {
	    if (this.validateType(params, context, [Array])) {
	      this.validateRange(shape, params.length, context, 'list member count');
	      // validate array members
	      for (var i = 0; i < params.length; i++) {
	        this.validateMember(shape.member, params[i], context + '[' + i + ']');
	      }
	    }
	  },

	  validateMap: function validateMap(shape, params, context) {
	    if (this.validateType(params, context, ['object'], 'map')) {
	      // Build up a count of map members to validate range traits.
	      var mapCount = 0;
	      for (var param in params) {
	        if (!Object.prototype.hasOwnProperty.call(params, param)) continue;
	        // Validate any map key trait constraints
	        this.validateMember(shape.key, param,
	                            context + '[key=\'' + param + '\']');
	        this.validateMember(shape.value, params[param],
	                            context + '[\'' + param + '\']');
	        mapCount++;
	      }
	      this.validateRange(shape, mapCount, context, 'map member count');
	    }
	  },

	  validateScalar: function validateScalar(shape, value, context) {
	    switch (shape.type) {
	      case null:
	      case undefined:
	      case 'string':
	        return this.validateString(shape, value, context);
	      case 'base64':
	      case 'binary':
	        return this.validatePayload(value, context);
	      case 'integer':
	      case 'float':
	        return this.validateNumber(shape, value, context);
	      case 'boolean':
	        return this.validateType(value, context, ['boolean']);
	      case 'timestamp':
	        return this.validateType(value, context, [Date,
	          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/, 'number'],
	          'Date object, ISO-8601 string, or a UNIX timestamp');
	      default:
	        return this.fail('UnkownType', 'Unhandled type ' +
	                         shape.type + ' for ' + context);
	    }
	  },

	  validateString: function validateString(shape, value, context) {
	    var validTypes = ['string'];
	    if (shape.isJsonValue) {
	      validTypes = validTypes.concat(['number', 'object', 'boolean']);
	    }
	    if (value !== null && this.validateType(value, context, validTypes)) {
	      this.validateEnum(shape, value, context);
	      this.validateRange(shape, value.length, context, 'string length');
	      this.validatePattern(shape, value, context);
	      this.validateUri(shape, value, context);
	    }
	  },

	  validateUri: function validateUri(shape, value, context) {
	    if (shape['location'] === 'uri') {
	      if (value.length === 0) {
	        this.fail('UriParameterError', 'Expected uri parameter to have length >= 1,'
	          + ' but found "' + value +'" for ' + context);
	      }
	    }
	  },

	  validatePattern: function validatePattern(shape, value, context) {
	    if (this.validation['pattern'] && shape['pattern'] !== undefined) {
	      if (!(new RegExp(shape['pattern'])).test(value)) {
	        this.fail('PatternMatchError', 'Provided value "' + value + '" '
	          + 'does not match regex pattern /' + shape['pattern'] + '/ for '
	          + context);
	      }
	    }
	  },

	  validateRange: function validateRange(shape, value, context, descriptor) {
	    if (this.validation['min']) {
	      if (shape['min'] !== undefined && value < shape['min']) {
	        this.fail('MinRangeError', 'Expected ' + descriptor + ' >= '
	          + shape['min'] + ', but found ' + value + ' for ' + context);
	      }
	    }
	    if (this.validation['max']) {
	      if (shape['max'] !== undefined && value > shape['max']) {
	        this.fail('MaxRangeError', 'Expected ' + descriptor + ' <= '
	          + shape['max'] + ', but found ' + value + ' for ' + context);
	      }
	    }
	  },

	  validateEnum: function validateRange(shape, value, context) {
	    if (this.validation['enum'] && shape['enum'] !== undefined) {
	      // Fail if the string value is not present in the enum list
	      if (shape['enum'].indexOf(value) === -1) {
	        this.fail('EnumError', 'Found string value of ' + value + ', but '
	          + 'expected ' + shape['enum'].join('|') + ' for ' + context);
	      }
	    }
	  },

	  validateType: function validateType(value, context, acceptedTypes, type) {
	    // We will not log an error for null or undefined, but we will return
	    // false so that callers know that the expected type was not strictly met.
	    if (value === null || value === undefined) return false;

	    var foundInvalidType = false;
	    for (var i = 0; i < acceptedTypes.length; i++) {
	      if (typeof acceptedTypes[i] === 'string') {
	        if (typeof value === acceptedTypes[i]) return true;
	      } else if (acceptedTypes[i] instanceof RegExp) {
	        if ((value || '').toString().match(acceptedTypes[i])) return true;
	      } else {
	        if (value instanceof acceptedTypes[i]) return true;
	        if (AWS.util.isType(value, acceptedTypes[i])) return true;
	        if (!type && !foundInvalidType) acceptedTypes = acceptedTypes.slice();
	        acceptedTypes[i] = AWS.util.typeName(acceptedTypes[i]);
	      }
	      foundInvalidType = true;
	    }

	    var acceptedType = type;
	    if (!acceptedType) {
	      acceptedType = acceptedTypes.join(', ').replace(/,([^,]+)$/, ', or$1');
	    }

	    var vowel = acceptedType.match(/^[aeiou]/i) ? 'n' : '';
	    this.fail('InvalidParameterType', 'Expected ' + context + ' to be a' +
	              vowel + ' ' + acceptedType);
	    return false;
	  },

	  validateNumber: function validateNumber(shape, value, context) {
	    if (value === null || value === undefined) return;
	    if (typeof value === 'string') {
	      var castedValue = parseFloat(value);
	      if (castedValue.toString() === value) value = castedValue;
	    }
	    if (this.validateType(value, context, ['number'])) {
	      this.validateRange(shape, value, context, 'numeric value');
	    }
	  },

	  validatePayload: function validatePayload(value, context) {
	    if (value === null || value === undefined) return;
	    if (typeof value === 'string') return;
	    if (value && typeof value.byteLength === 'number') return; // typed arrays
	    if (AWS.util.isNode()) { // special check for buffer/stream in Node.js
	      var Stream = AWS.util.stream.Stream;
	      if (AWS.util.Buffer.isBuffer(value) || value instanceof Stream) return;
	    } else {
	      if (typeof Blob !== void 0 && value instanceof Blob) return;
	    }

	    var types = ['Buffer', 'Stream', 'File', 'Blob', 'ArrayBuffer', 'DataView'];
	    if (value) {
	      for (var i = 0; i < types.length; i++) {
	        if (AWS.util.isType(value, types[i])) return;
	        if (AWS.util.typeName(value.constructor) === types[i]) return;
	      }
	    }

	    this.fail('InvalidParameterType', 'Expected ' + context + ' to be a ' +
	      'string, Buffer, Stream, Blob, or typed array object');
	  }
	});


/***/ })
/******/ ])
});
;