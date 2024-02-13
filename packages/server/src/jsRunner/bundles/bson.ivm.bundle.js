"use strict";
var bson = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // ../../node_modules/bson/lib/bson.cjs
  var require_bson = __commonJS({
    "../../node_modules/bson/lib/bson.cjs"(exports) {
      "use strict";
      function isAnyArrayBuffer(value) {
        return ["[object ArrayBuffer]", "[object SharedArrayBuffer]"].includes(Object.prototype.toString.call(value));
      }
      function isUint8Array(value) {
        return Object.prototype.toString.call(value) === "[object Uint8Array]";
      }
      function isRegExp(d) {
        return Object.prototype.toString.call(d) === "[object RegExp]";
      }
      function isMap(d) {
        return Object.prototype.toString.call(d) === "[object Map]";
      }
      function isDate(d) {
        return Object.prototype.toString.call(d) === "[object Date]";
      }
      function defaultInspect(x, _options) {
        return JSON.stringify(x, (k, v) => {
          if (typeof v === "bigint") {
            return { $numberLong: `${v}` };
          } else if (isMap(v)) {
            return Object.fromEntries(v);
          }
          return v;
        });
      }
      function getStylizeFunction(options) {
        const stylizeExists = options != null && typeof options === "object" && "stylize" in options && typeof options.stylize === "function";
        if (stylizeExists) {
          return options.stylize;
        }
      }
      var BSON_MAJOR_VERSION = 6;
      var BSON_INT32_MAX = 2147483647;
      var BSON_INT32_MIN = -2147483648;
      var BSON_INT64_MAX = Math.pow(2, 63) - 1;
      var BSON_INT64_MIN = -Math.pow(2, 63);
      var JS_INT_MAX = Math.pow(2, 53);
      var JS_INT_MIN = -Math.pow(2, 53);
      var BSON_DATA_NUMBER = 1;
      var BSON_DATA_STRING = 2;
      var BSON_DATA_OBJECT = 3;
      var BSON_DATA_ARRAY = 4;
      var BSON_DATA_BINARY = 5;
      var BSON_DATA_UNDEFINED = 6;
      var BSON_DATA_OID = 7;
      var BSON_DATA_BOOLEAN = 8;
      var BSON_DATA_DATE = 9;
      var BSON_DATA_NULL = 10;
      var BSON_DATA_REGEXP = 11;
      var BSON_DATA_DBPOINTER = 12;
      var BSON_DATA_CODE = 13;
      var BSON_DATA_SYMBOL = 14;
      var BSON_DATA_CODE_W_SCOPE = 15;
      var BSON_DATA_INT = 16;
      var BSON_DATA_TIMESTAMP = 17;
      var BSON_DATA_LONG = 18;
      var BSON_DATA_DECIMAL128 = 19;
      var BSON_DATA_MIN_KEY = 255;
      var BSON_DATA_MAX_KEY = 127;
      var BSON_BINARY_SUBTYPE_DEFAULT = 0;
      var BSON_BINARY_SUBTYPE_UUID_NEW = 4;
      var BSONType = Object.freeze({
        double: 1,
        string: 2,
        object: 3,
        array: 4,
        binData: 5,
        undefined: 6,
        objectId: 7,
        bool: 8,
        date: 9,
        null: 10,
        regex: 11,
        dbPointer: 12,
        javascript: 13,
        symbol: 14,
        javascriptWithScope: 15,
        int: 16,
        timestamp: 17,
        long: 18,
        decimal: 19,
        minKey: -1,
        maxKey: 127
      });
      var BSONError = class extends Error {
        get bsonError() {
          return true;
        }
        get name() {
          return "BSONError";
        }
        constructor(message, options) {
          super(message, options);
        }
        static isBSONError(value) {
          return value != null && typeof value === "object" && "bsonError" in value && value.bsonError === true && "name" in value && "message" in value && "stack" in value;
        }
      };
      var BSONVersionError = class extends BSONError {
        get name() {
          return "BSONVersionError";
        }
        constructor() {
          super(`Unsupported BSON version, bson types must be from bson ${BSON_MAJOR_VERSION}.x.x`);
        }
      };
      var BSONRuntimeError = class extends BSONError {
        get name() {
          return "BSONRuntimeError";
        }
        constructor(message) {
          super(message);
        }
      };
      var FIRST_BIT = 128;
      var FIRST_TWO_BITS = 192;
      var FIRST_THREE_BITS = 224;
      var FIRST_FOUR_BITS = 240;
      var FIRST_FIVE_BITS = 248;
      var TWO_BIT_CHAR = 192;
      var THREE_BIT_CHAR = 224;
      var FOUR_BIT_CHAR = 240;
      var CONTINUING_CHAR = 128;
      function validateUtf8(bytes, start, end) {
        let continuation = 0;
        for (let i = start; i < end; i += 1) {
          const byte = bytes[i];
          if (continuation) {
            if ((byte & FIRST_TWO_BITS) !== CONTINUING_CHAR) {
              return false;
            }
            continuation -= 1;
          } else if (byte & FIRST_BIT) {
            if ((byte & FIRST_THREE_BITS) === TWO_BIT_CHAR) {
              continuation = 1;
            } else if ((byte & FIRST_FOUR_BITS) === THREE_BIT_CHAR) {
              continuation = 2;
            } else if ((byte & FIRST_FIVE_BITS) === FOUR_BIT_CHAR) {
              continuation = 3;
            } else {
              return false;
            }
          }
        }
        return !continuation;
      }
      function tryLatin(uint8array, start, end) {
        if (uint8array.length === 0) {
          return "";
        }
        const stringByteLength = end - start;
        if (stringByteLength === 0) {
          return "";
        }
        if (stringByteLength > 20) {
          return null;
        }
        if (stringByteLength === 1 && uint8array[start] < 128) {
          return String.fromCharCode(uint8array[start]);
        }
        if (stringByteLength === 2 && uint8array[start] < 128 && uint8array[start + 1] < 128) {
          return String.fromCharCode(uint8array[start]) + String.fromCharCode(uint8array[start + 1]);
        }
        if (stringByteLength === 3 && uint8array[start] < 128 && uint8array[start + 1] < 128 && uint8array[start + 2] < 128) {
          return String.fromCharCode(uint8array[start]) + String.fromCharCode(uint8array[start + 1]) + String.fromCharCode(uint8array[start + 2]);
        }
        const latinBytes = [];
        for (let i = start; i < end; i++) {
          const byte = uint8array[i];
          if (byte > 127) {
            return null;
          }
          latinBytes.push(byte);
        }
        return String.fromCharCode(...latinBytes);
      }
      function nodejsMathRandomBytes(byteLength) {
        return nodeJsByteUtils.fromNumberArray(Array.from({ length: byteLength }, () => Math.floor(Math.random() * 256)));
      }
      var nodejsRandomBytes = (() => {
        try {
          return __require("crypto").randomBytes;
        } catch {
          return nodejsMathRandomBytes;
        }
      })();
      var nodeJsByteUtils = {
        toLocalBufferType(potentialBuffer) {
          if (Buffer.isBuffer(potentialBuffer)) {
            return potentialBuffer;
          }
          if (ArrayBuffer.isView(potentialBuffer)) {
            return Buffer.from(potentialBuffer.buffer, potentialBuffer.byteOffset, potentialBuffer.byteLength);
          }
          const stringTag = potentialBuffer?.[Symbol.toStringTag] ?? Object.prototype.toString.call(potentialBuffer);
          if (stringTag === "ArrayBuffer" || stringTag === "SharedArrayBuffer" || stringTag === "[object ArrayBuffer]" || stringTag === "[object SharedArrayBuffer]") {
            return Buffer.from(potentialBuffer);
          }
          throw new BSONError(`Cannot create Buffer from ${String(potentialBuffer)}`);
        },
        allocate(size) {
          return Buffer.alloc(size);
        },
        equals(a, b) {
          return nodeJsByteUtils.toLocalBufferType(a).equals(b);
        },
        fromNumberArray(array) {
          return Buffer.from(array);
        },
        fromBase64(base64) {
          return Buffer.from(base64, "base64");
        },
        toBase64(buffer2) {
          return nodeJsByteUtils.toLocalBufferType(buffer2).toString("base64");
        },
        fromISO88591(codePoints) {
          return Buffer.from(codePoints, "binary");
        },
        toISO88591(buffer2) {
          return nodeJsByteUtils.toLocalBufferType(buffer2).toString("binary");
        },
        fromHex(hex) {
          return Buffer.from(hex, "hex");
        },
        toHex(buffer2) {
          return nodeJsByteUtils.toLocalBufferType(buffer2).toString("hex");
        },
        fromUTF8(text) {
          return Buffer.from(text, "utf8");
        },
        toUTF8(buffer2, start, end, fatal) {
          const basicLatin = end - start <= 20 ? tryLatin(buffer2, start, end) : null;
          if (basicLatin != null) {
            return basicLatin;
          }
          const string = nodeJsByteUtils.toLocalBufferType(buffer2).toString("utf8", start, end);
          if (fatal) {
            for (let i = 0; i < string.length; i++) {
              if (string.charCodeAt(i) === 65533) {
                if (!validateUtf8(buffer2, start, end)) {
                  throw new BSONError("Invalid UTF-8 string in BSON document");
                }
                break;
              }
            }
          }
          return string;
        },
        utf8ByteLength(input) {
          return Buffer.byteLength(input, "utf8");
        },
        encodeUTF8Into(buffer2, source, byteOffset) {
          return nodeJsByteUtils.toLocalBufferType(buffer2).write(source, byteOffset, void 0, "utf8");
        },
        randomBytes: nodejsRandomBytes
      };
      function isReactNative() {
        const { navigator } = globalThis;
        return typeof navigator === "object" && navigator.product === "ReactNative";
      }
      function webMathRandomBytes(byteLength) {
        if (byteLength < 0) {
          throw new RangeError(`The argument 'byteLength' is invalid. Received ${byteLength}`);
        }
        return webByteUtils.fromNumberArray(Array.from({ length: byteLength }, () => Math.floor(Math.random() * 256)));
      }
      var webRandomBytes = (() => {
        const { crypto } = globalThis;
        if (crypto != null && typeof crypto.getRandomValues === "function") {
          return (byteLength) => {
            return crypto.getRandomValues(webByteUtils.allocate(byteLength));
          };
        } else {
          if (isReactNative()) {
            const { console } = globalThis;
            console?.warn?.("BSON: For React Native please polyfill crypto.getRandomValues, e.g. using: https://www.npmjs.com/package/react-native-get-random-values.");
          }
          return webMathRandomBytes;
        }
      })();
      var HEX_DIGIT = /(\d|[a-f])/i;
      var webByteUtils = {
        toLocalBufferType(potentialUint8array) {
          const stringTag = potentialUint8array?.[Symbol.toStringTag] ?? Object.prototype.toString.call(potentialUint8array);
          if (stringTag === "Uint8Array") {
            return potentialUint8array;
          }
          if (ArrayBuffer.isView(potentialUint8array)) {
            return new Uint8Array(potentialUint8array.buffer.slice(potentialUint8array.byteOffset, potentialUint8array.byteOffset + potentialUint8array.byteLength));
          }
          if (stringTag === "ArrayBuffer" || stringTag === "SharedArrayBuffer" || stringTag === "[object ArrayBuffer]" || stringTag === "[object SharedArrayBuffer]") {
            return new Uint8Array(potentialUint8array);
          }
          throw new BSONError(`Cannot make a Uint8Array from ${String(potentialUint8array)}`);
        },
        allocate(size) {
          if (typeof size !== "number") {
            throw new TypeError(`The "size" argument must be of type number. Received ${String(size)}`);
          }
          return new Uint8Array(size);
        },
        equals(a, b) {
          if (a.byteLength !== b.byteLength) {
            return false;
          }
          for (let i = 0; i < a.byteLength; i++) {
            if (a[i] !== b[i]) {
              return false;
            }
          }
          return true;
        },
        fromNumberArray(array) {
          return Uint8Array.from(array);
        },
        fromBase64(base64) {
          return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        },
        toBase64(uint8array) {
          return btoa(webByteUtils.toISO88591(uint8array));
        },
        fromISO88591(codePoints) {
          return Uint8Array.from(codePoints, (c) => c.charCodeAt(0) & 255);
        },
        toISO88591(uint8array) {
          return Array.from(Uint16Array.from(uint8array), (b) => String.fromCharCode(b)).join("");
        },
        fromHex(hex) {
          const evenLengthHex = hex.length % 2 === 0 ? hex : hex.slice(0, hex.length - 1);
          const buffer2 = [];
          for (let i = 0; i < evenLengthHex.length; i += 2) {
            const firstDigit = evenLengthHex[i];
            const secondDigit = evenLengthHex[i + 1];
            if (!HEX_DIGIT.test(firstDigit)) {
              break;
            }
            if (!HEX_DIGIT.test(secondDigit)) {
              break;
            }
            const hexDigit = Number.parseInt(`${firstDigit}${secondDigit}`, 16);
            buffer2.push(hexDigit);
          }
          return Uint8Array.from(buffer2);
        },
        toHex(uint8array) {
          return Array.from(uint8array, (byte) => byte.toString(16).padStart(2, "0")).join("");
        },
        fromUTF8(text) {
          return new TextEncoder().encode(text);
        },
        toUTF8(uint8array, start, end, fatal) {
          const basicLatin = end - start <= 20 ? tryLatin(uint8array, start, end) : null;
          if (basicLatin != null) {
            return basicLatin;
          }
          if (fatal) {
            try {
              return new TextDecoder("utf8", { fatal }).decode(uint8array.slice(start, end));
            } catch (cause) {
              throw new BSONError("Invalid UTF-8 string in BSON document", { cause });
            }
          }
          return new TextDecoder("utf8", { fatal }).decode(uint8array.slice(start, end));
        },
        utf8ByteLength(input) {
          return webByteUtils.fromUTF8(input).byteLength;
        },
        encodeUTF8Into(buffer2, source, byteOffset) {
          const bytes = webByteUtils.fromUTF8(source);
          buffer2.set(bytes, byteOffset);
          return bytes.byteLength;
        },
        randomBytes: webRandomBytes
      };
      var hasGlobalBuffer = typeof Buffer === "function" && Buffer.prototype?._isBuffer !== true;
      var ByteUtils = hasGlobalBuffer ? nodeJsByteUtils : webByteUtils;
      var BSONDataView = class extends DataView {
        static fromUint8Array(input) {
          return new DataView(input.buffer, input.byteOffset, input.byteLength);
        }
      };
      var BSONValue = class {
        get [Symbol.for("@@mdb.bson.version")]() {
          return BSON_MAJOR_VERSION;
        }
        [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
          return this.inspect(depth, options, inspect);
        }
      };
      var Binary = class _Binary extends BSONValue {
        get _bsontype() {
          return "Binary";
        }
        constructor(buffer2, subType) {
          super();
          if (!(buffer2 == null) && typeof buffer2 === "string" && !ArrayBuffer.isView(buffer2) && !isAnyArrayBuffer(buffer2) && !Array.isArray(buffer2)) {
            throw new BSONError("Binary can only be constructed from Uint8Array or number[]");
          }
          this.sub_type = subType ?? _Binary.BSON_BINARY_SUBTYPE_DEFAULT;
          if (buffer2 == null) {
            this.buffer = ByteUtils.allocate(_Binary.BUFFER_SIZE);
            this.position = 0;
          } else {
            this.buffer = Array.isArray(buffer2) ? ByteUtils.fromNumberArray(buffer2) : ByteUtils.toLocalBufferType(buffer2);
            this.position = this.buffer.byteLength;
          }
        }
        put(byteValue) {
          if (typeof byteValue === "string" && byteValue.length !== 1) {
            throw new BSONError("only accepts single character String");
          } else if (typeof byteValue !== "number" && byteValue.length !== 1)
            throw new BSONError("only accepts single character Uint8Array or Array");
          let decodedByte;
          if (typeof byteValue === "string") {
            decodedByte = byteValue.charCodeAt(0);
          } else if (typeof byteValue === "number") {
            decodedByte = byteValue;
          } else {
            decodedByte = byteValue[0];
          }
          if (decodedByte < 0 || decodedByte > 255) {
            throw new BSONError("only accepts number in a valid unsigned byte range 0-255");
          }
          if (this.buffer.byteLength > this.position) {
            this.buffer[this.position++] = decodedByte;
          } else {
            const newSpace = ByteUtils.allocate(_Binary.BUFFER_SIZE + this.buffer.length);
            newSpace.set(this.buffer, 0);
            this.buffer = newSpace;
            this.buffer[this.position++] = decodedByte;
          }
        }
        write(sequence, offset) {
          offset = typeof offset === "number" ? offset : this.position;
          if (this.buffer.byteLength < offset + sequence.length) {
            const newSpace = ByteUtils.allocate(this.buffer.byteLength + sequence.length);
            newSpace.set(this.buffer, 0);
            this.buffer = newSpace;
          }
          if (ArrayBuffer.isView(sequence)) {
            this.buffer.set(ByteUtils.toLocalBufferType(sequence), offset);
            this.position = offset + sequence.byteLength > this.position ? offset + sequence.length : this.position;
          } else if (typeof sequence === "string") {
            throw new BSONError("input cannot be string");
          }
        }
        read(position, length) {
          length = length && length > 0 ? length : this.position;
          return this.buffer.slice(position, position + length);
        }
        value() {
          return this.buffer.length === this.position ? this.buffer : this.buffer.subarray(0, this.position);
        }
        length() {
          return this.position;
        }
        toJSON() {
          return ByteUtils.toBase64(this.buffer);
        }
        toString(encoding) {
          if (encoding === "hex")
            return ByteUtils.toHex(this.buffer);
          if (encoding === "base64")
            return ByteUtils.toBase64(this.buffer);
          if (encoding === "utf8" || encoding === "utf-8")
            return ByteUtils.toUTF8(this.buffer, 0, this.buffer.byteLength, false);
          return ByteUtils.toUTF8(this.buffer, 0, this.buffer.byteLength, false);
        }
        toExtendedJSON(options) {
          options = options || {};
          const base64String = ByteUtils.toBase64(this.buffer);
          const subType = Number(this.sub_type).toString(16);
          if (options.legacy) {
            return {
              $binary: base64String,
              $type: subType.length === 1 ? "0" + subType : subType
            };
          }
          return {
            $binary: {
              base64: base64String,
              subType: subType.length === 1 ? "0" + subType : subType
            }
          };
        }
        toUUID() {
          if (this.sub_type === _Binary.SUBTYPE_UUID) {
            return new UUID(this.buffer.slice(0, this.position));
          }
          throw new BSONError(`Binary sub_type "${this.sub_type}" is not supported for converting to UUID. Only "${_Binary.SUBTYPE_UUID}" is currently supported.`);
        }
        static createFromHexString(hex, subType) {
          return new _Binary(ByteUtils.fromHex(hex), subType);
        }
        static createFromBase64(base64, subType) {
          return new _Binary(ByteUtils.fromBase64(base64), subType);
        }
        static fromExtendedJSON(doc, options) {
          options = options || {};
          let data;
          let type;
          if ("$binary" in doc) {
            if (options.legacy && typeof doc.$binary === "string" && "$type" in doc) {
              type = doc.$type ? parseInt(doc.$type, 16) : 0;
              data = ByteUtils.fromBase64(doc.$binary);
            } else {
              if (typeof doc.$binary !== "string") {
                type = doc.$binary.subType ? parseInt(doc.$binary.subType, 16) : 0;
                data = ByteUtils.fromBase64(doc.$binary.base64);
              }
            }
          } else if ("$uuid" in doc) {
            type = 4;
            data = UUID.bytesFromString(doc.$uuid);
          }
          if (!data) {
            throw new BSONError(`Unexpected Binary Extended JSON format ${JSON.stringify(doc)}`);
          }
          return type === BSON_BINARY_SUBTYPE_UUID_NEW ? new UUID(data) : new _Binary(data, type);
        }
        inspect(depth, options, inspect) {
          inspect ??= defaultInspect;
          const base64 = ByteUtils.toBase64(this.buffer.subarray(0, this.position));
          const base64Arg = inspect(base64, options);
          const subTypeArg = inspect(this.sub_type, options);
          return `Binary.createFromBase64(${base64Arg}, ${subTypeArg})`;
        }
      };
      Binary.BSON_BINARY_SUBTYPE_DEFAULT = 0;
      Binary.BUFFER_SIZE = 256;
      Binary.SUBTYPE_DEFAULT = 0;
      Binary.SUBTYPE_FUNCTION = 1;
      Binary.SUBTYPE_BYTE_ARRAY = 2;
      Binary.SUBTYPE_UUID_OLD = 3;
      Binary.SUBTYPE_UUID = 4;
      Binary.SUBTYPE_MD5 = 5;
      Binary.SUBTYPE_ENCRYPTED = 6;
      Binary.SUBTYPE_COLUMN = 7;
      Binary.SUBTYPE_USER_DEFINED = 128;
      var UUID_BYTE_LENGTH = 16;
      var UUID_WITHOUT_DASHES = /^[0-9A-F]{32}$/i;
      var UUID_WITH_DASHES = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
      var UUID = class _UUID extends Binary {
        constructor(input) {
          let bytes;
          if (input == null) {
            bytes = _UUID.generate();
          } else if (input instanceof _UUID) {
            bytes = ByteUtils.toLocalBufferType(new Uint8Array(input.buffer));
          } else if (ArrayBuffer.isView(input) && input.byteLength === UUID_BYTE_LENGTH) {
            bytes = ByteUtils.toLocalBufferType(input);
          } else if (typeof input === "string") {
            bytes = _UUID.bytesFromString(input);
          } else {
            throw new BSONError("Argument passed in UUID constructor must be a UUID, a 16 byte Buffer or a 32/36 character hex string (dashes excluded/included, format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).");
          }
          super(bytes, BSON_BINARY_SUBTYPE_UUID_NEW);
        }
        get id() {
          return this.buffer;
        }
        set id(value) {
          this.buffer = value;
        }
        toHexString(includeDashes = true) {
          if (includeDashes) {
            return [
              ByteUtils.toHex(this.buffer.subarray(0, 4)),
              ByteUtils.toHex(this.buffer.subarray(4, 6)),
              ByteUtils.toHex(this.buffer.subarray(6, 8)),
              ByteUtils.toHex(this.buffer.subarray(8, 10)),
              ByteUtils.toHex(this.buffer.subarray(10, 16))
            ].join("-");
          }
          return ByteUtils.toHex(this.buffer);
        }
        toString(encoding) {
          if (encoding === "hex")
            return ByteUtils.toHex(this.id);
          if (encoding === "base64")
            return ByteUtils.toBase64(this.id);
          return this.toHexString();
        }
        toJSON() {
          return this.toHexString();
        }
        equals(otherId) {
          if (!otherId) {
            return false;
          }
          if (otherId instanceof _UUID) {
            return ByteUtils.equals(otherId.id, this.id);
          }
          try {
            return ByteUtils.equals(new _UUID(otherId).id, this.id);
          } catch {
            return false;
          }
        }
        toBinary() {
          return new Binary(this.id, Binary.SUBTYPE_UUID);
        }
        static generate() {
          const bytes = ByteUtils.randomBytes(UUID_BYTE_LENGTH);
          bytes[6] = bytes[6] & 15 | 64;
          bytes[8] = bytes[8] & 63 | 128;
          return bytes;
        }
        static isValid(input) {
          if (!input) {
            return false;
          }
          if (typeof input === "string") {
            return _UUID.isValidUUIDString(input);
          }
          if (isUint8Array(input)) {
            return input.byteLength === UUID_BYTE_LENGTH;
          }
          return input._bsontype === "Binary" && input.sub_type === this.SUBTYPE_UUID && input.buffer.byteLength === 16;
        }
        static createFromHexString(hexString) {
          const buffer2 = _UUID.bytesFromString(hexString);
          return new _UUID(buffer2);
        }
        static createFromBase64(base64) {
          return new _UUID(ByteUtils.fromBase64(base64));
        }
        static bytesFromString(representation) {
          if (!_UUID.isValidUUIDString(representation)) {
            throw new BSONError("UUID string representation must be 32 hex digits or canonical hyphenated representation");
          }
          return ByteUtils.fromHex(representation.replace(/-/g, ""));
        }
        static isValidUUIDString(representation) {
          return UUID_WITHOUT_DASHES.test(representation) || UUID_WITH_DASHES.test(representation);
        }
        inspect(depth, options, inspect) {
          inspect ??= defaultInspect;
          return `new UUID(${inspect(this.toHexString(), options)})`;
        }
      };
      var Code = class _Code extends BSONValue {
        get _bsontype() {
          return "Code";
        }
        constructor(code, scope) {
          super();
          this.code = code.toString();
          this.scope = scope ?? null;
        }
        toJSON() {
          if (this.scope != null) {
            return { code: this.code, scope: this.scope };
          }
          return { code: this.code };
        }
        toExtendedJSON() {
          if (this.scope) {
            return { $code: this.code, $scope: this.scope };
          }
          return { $code: this.code };
        }
        static fromExtendedJSON(doc) {
          return new _Code(doc.$code, doc.$scope);
        }
        inspect(depth, options, inspect) {
          inspect ??= defaultInspect;
          let parametersString = inspect(this.code, options);
          const multiLineFn = parametersString.includes("\n");
          if (this.scope != null) {
            parametersString += `,${multiLineFn ? "\n" : " "}${inspect(this.scope, options)}`;
          }
          const endingNewline = multiLineFn && this.scope === null;
          return `new Code(${multiLineFn ? "\n" : ""}${parametersString}${endingNewline ? "\n" : ""})`;
        }
      };
      function isDBRefLike(value) {
        return value != null && typeof value === "object" && "$id" in value && value.$id != null && "$ref" in value && typeof value.$ref === "string" && (!("$db" in value) || "$db" in value && typeof value.$db === "string");
      }
      var DBRef = class _DBRef extends BSONValue {
        get _bsontype() {
          return "DBRef";
        }
        constructor(collection, oid, db, fields) {
          super();
          const parts = collection.split(".");
          if (parts.length === 2) {
            db = parts.shift();
            collection = parts.shift();
          }
          this.collection = collection;
          this.oid = oid;
          this.db = db;
          this.fields = fields || {};
        }
        get namespace() {
          return this.collection;
        }
        set namespace(value) {
          this.collection = value;
        }
        toJSON() {
          const o = Object.assign({
            $ref: this.collection,
            $id: this.oid
          }, this.fields);
          if (this.db != null)
            o.$db = this.db;
          return o;
        }
        toExtendedJSON(options) {
          options = options || {};
          let o = {
            $ref: this.collection,
            $id: this.oid
          };
          if (options.legacy) {
            return o;
          }
          if (this.db)
            o.$db = this.db;
          o = Object.assign(o, this.fields);
          return o;
        }
        static fromExtendedJSON(doc) {
          const copy = Object.assign({}, doc);
          delete copy.$ref;
          delete copy.$id;
          delete copy.$db;
          return new _DBRef(doc.$ref, doc.$id, doc.$db, copy);
        }
        inspect(depth, options, inspect) {
          inspect ??= defaultInspect;
          const args = [
            inspect(this.namespace, options),
            inspect(this.oid, options),
            ...this.db ? [inspect(this.db, options)] : [],
            ...Object.keys(this.fields).length > 0 ? [inspect(this.fields, options)] : []
          ];
          args[1] = inspect === defaultInspect ? `new ObjectId(${args[1]})` : args[1];
          return `new DBRef(${args.join(", ")})`;
        }
      };
      var wasm = void 0;
      try {
        wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports;
      } catch {
      }
      var TWO_PWR_16_DBL = 1 << 16;
      var TWO_PWR_24_DBL = 1 << 24;
      var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
      var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
      var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
      var INT_CACHE = {};
      var UINT_CACHE = {};
      var MAX_INT64_STRING_LENGTH = 20;
      var DECIMAL_REG_EX = /^(\+?0|(\+|-)?[1-9][0-9]*)$/;
      var Long = class _Long extends BSONValue {
        get _bsontype() {
          return "Long";
        }
        get __isLong__() {
          return true;
        }
        constructor(low = 0, high, unsigned) {
          super();
          if (typeof low === "bigint") {
            Object.assign(this, _Long.fromBigInt(low, !!high));
          } else if (typeof low === "string") {
            Object.assign(this, _Long.fromString(low, !!high));
          } else {
            this.low = low | 0;
            this.high = high | 0;
            this.unsigned = !!unsigned;
          }
        }
        static fromBits(lowBits, highBits, unsigned) {
          return new _Long(lowBits, highBits, unsigned);
        }
        static fromInt(value, unsigned) {
          let obj, cachedObj, cache;
          if (unsigned) {
            value >>>= 0;
            if (cache = 0 <= value && value < 256) {
              cachedObj = UINT_CACHE[value];
              if (cachedObj)
                return cachedObj;
            }
            obj = _Long.fromBits(value, (value | 0) < 0 ? -1 : 0, true);
            if (cache)
              UINT_CACHE[value] = obj;
            return obj;
          } else {
            value |= 0;
            if (cache = -128 <= value && value < 128) {
              cachedObj = INT_CACHE[value];
              if (cachedObj)
                return cachedObj;
            }
            obj = _Long.fromBits(value, value < 0 ? -1 : 0, false);
            if (cache)
              INT_CACHE[value] = obj;
            return obj;
          }
        }
        static fromNumber(value, unsigned) {
          if (isNaN(value))
            return unsigned ? _Long.UZERO : _Long.ZERO;
          if (unsigned) {
            if (value < 0)
              return _Long.UZERO;
            if (value >= TWO_PWR_64_DBL)
              return _Long.MAX_UNSIGNED_VALUE;
          } else {
            if (value <= -TWO_PWR_63_DBL)
              return _Long.MIN_VALUE;
            if (value + 1 >= TWO_PWR_63_DBL)
              return _Long.MAX_VALUE;
          }
          if (value < 0)
            return _Long.fromNumber(-value, unsigned).neg();
          return _Long.fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
        }
        static fromBigInt(value, unsigned) {
          return _Long.fromString(value.toString(), unsigned);
        }
        static fromString(str, unsigned, radix) {
          if (str.length === 0)
            throw new BSONError("empty string");
          if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
            return _Long.ZERO;
          if (typeof unsigned === "number") {
            radix = unsigned, unsigned = false;
          } else {
            unsigned = !!unsigned;
          }
          radix = radix || 10;
          if (radix < 2 || 36 < radix)
            throw new BSONError("radix");
          let p;
          if ((p = str.indexOf("-")) > 0)
            throw new BSONError("interior hyphen");
          else if (p === 0) {
            return _Long.fromString(str.substring(1), unsigned, radix).neg();
          }
          const radixToPower = _Long.fromNumber(Math.pow(radix, 8));
          let result = _Long.ZERO;
          for (let i = 0; i < str.length; i += 8) {
            const size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
              const power = _Long.fromNumber(Math.pow(radix, size));
              result = result.mul(power).add(_Long.fromNumber(value));
            } else {
              result = result.mul(radixToPower);
              result = result.add(_Long.fromNumber(value));
            }
          }
          result.unsigned = unsigned;
          return result;
        }
        static fromBytes(bytes, unsigned, le) {
          return le ? _Long.fromBytesLE(bytes, unsigned) : _Long.fromBytesBE(bytes, unsigned);
        }
        static fromBytesLE(bytes, unsigned) {
          return new _Long(bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24, bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24, unsigned);
        }
        static fromBytesBE(bytes, unsigned) {
          return new _Long(bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7], bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], unsigned);
        }
        static isLong(value) {
          return value != null && typeof value === "object" && "__isLong__" in value && value.__isLong__ === true;
        }
        static fromValue(val, unsigned) {
          if (typeof val === "number")
            return _Long.fromNumber(val, unsigned);
          if (typeof val === "string")
            return _Long.fromString(val, unsigned);
          return _Long.fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
        }
        add(addend) {
          if (!_Long.isLong(addend))
            addend = _Long.fromValue(addend);
          const a48 = this.high >>> 16;
          const a32 = this.high & 65535;
          const a16 = this.low >>> 16;
          const a00 = this.low & 65535;
          const b48 = addend.high >>> 16;
          const b32 = addend.high & 65535;
          const b16 = addend.low >>> 16;
          const b00 = addend.low & 65535;
          let c48 = 0, c32 = 0, c16 = 0, c00 = 0;
          c00 += a00 + b00;
          c16 += c00 >>> 16;
          c00 &= 65535;
          c16 += a16 + b16;
          c32 += c16 >>> 16;
          c16 &= 65535;
          c32 += a32 + b32;
          c48 += c32 >>> 16;
          c32 &= 65535;
          c48 += a48 + b48;
          c48 &= 65535;
          return _Long.fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
        }
        and(other) {
          if (!_Long.isLong(other))
            other = _Long.fromValue(other);
          return _Long.fromBits(this.low & other.low, this.high & other.high, this.unsigned);
        }
        compare(other) {
          if (!_Long.isLong(other))
            other = _Long.fromValue(other);
          if (this.eq(other))
            return 0;
          const thisNeg = this.isNegative(), otherNeg = other.isNegative();
          if (thisNeg && !otherNeg)
            return -1;
          if (!thisNeg && otherNeg)
            return 1;
          if (!this.unsigned)
            return this.sub(other).isNegative() ? -1 : 1;
          return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
        }
        comp(other) {
          return this.compare(other);
        }
        divide(divisor) {
          if (!_Long.isLong(divisor))
            divisor = _Long.fromValue(divisor);
          if (divisor.isZero())
            throw new BSONError("division by zero");
          if (wasm) {
            if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
              return this;
            }
            const low = (this.unsigned ? wasm.div_u : wasm.div_s)(this.low, this.high, divisor.low, divisor.high);
            return _Long.fromBits(low, wasm.get_high(), this.unsigned);
          }
          if (this.isZero())
            return this.unsigned ? _Long.UZERO : _Long.ZERO;
          let approx, rem, res;
          if (!this.unsigned) {
            if (this.eq(_Long.MIN_VALUE)) {
              if (divisor.eq(_Long.ONE) || divisor.eq(_Long.NEG_ONE))
                return _Long.MIN_VALUE;
              else if (divisor.eq(_Long.MIN_VALUE))
                return _Long.ONE;
              else {
                const halfThis = this.shr(1);
                approx = halfThis.div(divisor).shl(1);
                if (approx.eq(_Long.ZERO)) {
                  return divisor.isNegative() ? _Long.ONE : _Long.NEG_ONE;
                } else {
                  rem = this.sub(divisor.mul(approx));
                  res = approx.add(rem.div(divisor));
                  return res;
                }
              }
            } else if (divisor.eq(_Long.MIN_VALUE))
              return this.unsigned ? _Long.UZERO : _Long.ZERO;
            if (this.isNegative()) {
              if (divisor.isNegative())
                return this.neg().div(divisor.neg());
              return this.neg().div(divisor).neg();
            } else if (divisor.isNegative())
              return this.div(divisor.neg()).neg();
            res = _Long.ZERO;
          } else {
            if (!divisor.unsigned)
              divisor = divisor.toUnsigned();
            if (divisor.gt(this))
              return _Long.UZERO;
            if (divisor.gt(this.shru(1)))
              return _Long.UONE;
            res = _Long.UZERO;
          }
          rem = this;
          while (rem.gte(divisor)) {
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
            const log2 = Math.ceil(Math.log(approx) / Math.LN2);
            const delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
            let approxRes = _Long.fromNumber(approx);
            let approxRem = approxRes.mul(divisor);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
              approx -= delta;
              approxRes = _Long.fromNumber(approx, this.unsigned);
              approxRem = approxRes.mul(divisor);
            }
            if (approxRes.isZero())
              approxRes = _Long.ONE;
            res = res.add(approxRes);
            rem = rem.sub(approxRem);
          }
          return res;
        }
        div(divisor) {
          return this.divide(divisor);
        }
        equals(other) {
          if (!_Long.isLong(other))
            other = _Long.fromValue(other);
          if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
            return false;
          return this.high === other.high && this.low === other.low;
        }
        eq(other) {
          return this.equals(other);
        }
        getHighBits() {
          return this.high;
        }
        getHighBitsUnsigned() {
          return this.high >>> 0;
        }
        getLowBits() {
          return this.low;
        }
        getLowBitsUnsigned() {
          return this.low >>> 0;
        }
        getNumBitsAbs() {
          if (this.isNegative()) {
            return this.eq(_Long.MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
          }
          const val = this.high !== 0 ? this.high : this.low;
          let bit;
          for (bit = 31; bit > 0; bit--)
            if ((val & 1 << bit) !== 0)
              break;
          return this.high !== 0 ? bit + 33 : bit + 1;
        }
        greaterThan(other) {
          return this.comp(other) > 0;
        }
        gt(other) {
          return this.greaterThan(other);
        }
        greaterThanOrEqual(other) {
          return this.comp(other) >= 0;
        }
        gte(other) {
          return this.greaterThanOrEqual(other);
        }
        ge(other) {
          return this.greaterThanOrEqual(other);
        }
        isEven() {
          return (this.low & 1) === 0;
        }
        isNegative() {
          return !this.unsigned && this.high < 0;
        }
        isOdd() {
          return (this.low & 1) === 1;
        }
        isPositive() {
          return this.unsigned || this.high >= 0;
        }
        isZero() {
          return this.high === 0 && this.low === 0;
        }
        lessThan(other) {
          return this.comp(other) < 0;
        }
        lt(other) {
          return this.lessThan(other);
        }
        lessThanOrEqual(other) {
          return this.comp(other) <= 0;
        }
        lte(other) {
          return this.lessThanOrEqual(other);
        }
        modulo(divisor) {
          if (!_Long.isLong(divisor))
            divisor = _Long.fromValue(divisor);
          if (wasm) {
            const low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(this.low, this.high, divisor.low, divisor.high);
            return _Long.fromBits(low, wasm.get_high(), this.unsigned);
          }
          return this.sub(this.div(divisor).mul(divisor));
        }
        mod(divisor) {
          return this.modulo(divisor);
        }
        rem(divisor) {
          return this.modulo(divisor);
        }
        multiply(multiplier) {
          if (this.isZero())
            return _Long.ZERO;
          if (!_Long.isLong(multiplier))
            multiplier = _Long.fromValue(multiplier);
          if (wasm) {
            const low = wasm.mul(this.low, this.high, multiplier.low, multiplier.high);
            return _Long.fromBits(low, wasm.get_high(), this.unsigned);
          }
          if (multiplier.isZero())
            return _Long.ZERO;
          if (this.eq(_Long.MIN_VALUE))
            return multiplier.isOdd() ? _Long.MIN_VALUE : _Long.ZERO;
          if (multiplier.eq(_Long.MIN_VALUE))
            return this.isOdd() ? _Long.MIN_VALUE : _Long.ZERO;
          if (this.isNegative()) {
            if (multiplier.isNegative())
              return this.neg().mul(multiplier.neg());
            else
              return this.neg().mul(multiplier).neg();
          } else if (multiplier.isNegative())
            return this.mul(multiplier.neg()).neg();
          if (this.lt(_Long.TWO_PWR_24) && multiplier.lt(_Long.TWO_PWR_24))
            return _Long.fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
          const a48 = this.high >>> 16;
          const a32 = this.high & 65535;
          const a16 = this.low >>> 16;
          const a00 = this.low & 65535;
          const b48 = multiplier.high >>> 16;
          const b32 = multiplier.high & 65535;
          const b16 = multiplier.low >>> 16;
          const b00 = multiplier.low & 65535;
          let c48 = 0, c32 = 0, c16 = 0, c00 = 0;
          c00 += a00 * b00;
          c16 += c00 >>> 16;
          c00 &= 65535;
          c16 += a16 * b00;
          c32 += c16 >>> 16;
          c16 &= 65535;
          c16 += a00 * b16;
          c32 += c16 >>> 16;
          c16 &= 65535;
          c32 += a32 * b00;
          c48 += c32 >>> 16;
          c32 &= 65535;
          c32 += a16 * b16;
          c48 += c32 >>> 16;
          c32 &= 65535;
          c32 += a00 * b32;
          c48 += c32 >>> 16;
          c32 &= 65535;
          c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
          c48 &= 65535;
          return _Long.fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
        }
        mul(multiplier) {
          return this.multiply(multiplier);
        }
        negate() {
          if (!this.unsigned && this.eq(_Long.MIN_VALUE))
            return _Long.MIN_VALUE;
          return this.not().add(_Long.ONE);
        }
        neg() {
          return this.negate();
        }
        not() {
          return _Long.fromBits(~this.low, ~this.high, this.unsigned);
        }
        notEquals(other) {
          return !this.equals(other);
        }
        neq(other) {
          return this.notEquals(other);
        }
        ne(other) {
          return this.notEquals(other);
        }
        or(other) {
          if (!_Long.isLong(other))
            other = _Long.fromValue(other);
          return _Long.fromBits(this.low | other.low, this.high | other.high, this.unsigned);
        }
        shiftLeft(numBits) {
          if (_Long.isLong(numBits))
            numBits = numBits.toInt();
          if ((numBits &= 63) === 0)
            return this;
          else if (numBits < 32)
            return _Long.fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
          else
            return _Long.fromBits(0, this.low << numBits - 32, this.unsigned);
        }
        shl(numBits) {
          return this.shiftLeft(numBits);
        }
        shiftRight(numBits) {
          if (_Long.isLong(numBits))
            numBits = numBits.toInt();
          if ((numBits &= 63) === 0)
            return this;
          else if (numBits < 32)
            return _Long.fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
          else
            return _Long.fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
        }
        shr(numBits) {
          return this.shiftRight(numBits);
        }
        shiftRightUnsigned(numBits) {
          if (_Long.isLong(numBits))
            numBits = numBits.toInt();
          numBits &= 63;
          if (numBits === 0)
            return this;
          else {
            const high = this.high;
            if (numBits < 32) {
              const low = this.low;
              return _Long.fromBits(low >>> numBits | high << 32 - numBits, high >>> numBits, this.unsigned);
            } else if (numBits === 32)
              return _Long.fromBits(high, 0, this.unsigned);
            else
              return _Long.fromBits(high >>> numBits - 32, 0, this.unsigned);
          }
        }
        shr_u(numBits) {
          return this.shiftRightUnsigned(numBits);
        }
        shru(numBits) {
          return this.shiftRightUnsigned(numBits);
        }
        subtract(subtrahend) {
          if (!_Long.isLong(subtrahend))
            subtrahend = _Long.fromValue(subtrahend);
          return this.add(subtrahend.neg());
        }
        sub(subtrahend) {
          return this.subtract(subtrahend);
        }
        toInt() {
          return this.unsigned ? this.low >>> 0 : this.low;
        }
        toNumber() {
          if (this.unsigned)
            return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
          return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
        }
        toBigInt() {
          return BigInt(this.toString());
        }
        toBytes(le) {
          return le ? this.toBytesLE() : this.toBytesBE();
        }
        toBytesLE() {
          const hi = this.high, lo = this.low;
          return [
            lo & 255,
            lo >>> 8 & 255,
            lo >>> 16 & 255,
            lo >>> 24,
            hi & 255,
            hi >>> 8 & 255,
            hi >>> 16 & 255,
            hi >>> 24
          ];
        }
        toBytesBE() {
          const hi = this.high, lo = this.low;
          return [
            hi >>> 24,
            hi >>> 16 & 255,
            hi >>> 8 & 255,
            hi & 255,
            lo >>> 24,
            lo >>> 16 & 255,
            lo >>> 8 & 255,
            lo & 255
          ];
        }
        toSigned() {
          if (!this.unsigned)
            return this;
          return _Long.fromBits(this.low, this.high, false);
        }
        toString(radix) {
          radix = radix || 10;
          if (radix < 2 || 36 < radix)
            throw new BSONError("radix");
          if (this.isZero())
            return "0";
          if (this.isNegative()) {
            if (this.eq(_Long.MIN_VALUE)) {
              const radixLong = _Long.fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
              return div.toString(radix) + rem1.toInt().toString(radix);
            } else
              return "-" + this.neg().toString(radix);
          }
          const radixToPower = _Long.fromNumber(Math.pow(radix, 6), this.unsigned);
          let rem = this;
          let result = "";
          while (true) {
            const remDiv = rem.div(radixToPower);
            const intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0;
            let digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero()) {
              return digits + result;
            } else {
              while (digits.length < 6)
                digits = "0" + digits;
              result = "" + digits + result;
            }
          }
        }
        toUnsigned() {
          if (this.unsigned)
            return this;
          return _Long.fromBits(this.low, this.high, true);
        }
        xor(other) {
          if (!_Long.isLong(other))
            other = _Long.fromValue(other);
          return _Long.fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
        }
        eqz() {
          return this.isZero();
        }
        le(other) {
          return this.lessThanOrEqual(other);
        }
        toExtendedJSON(options) {
          if (options && options.relaxed)
            return this.toNumber();
          return { $numberLong: this.toString() };
        }
        static fromExtendedJSON(doc, options) {
          const { useBigInt64 = false, relaxed = true } = { ...options };
          if (doc.$numberLong.length > MAX_INT64_STRING_LENGTH) {
            throw new BSONError("$numberLong string is too long");
          }
          if (!DECIMAL_REG_EX.test(doc.$numberLong)) {
            throw new BSONError(`$numberLong string "${doc.$numberLong}" is in an invalid format`);
          }
          if (useBigInt64) {
            const bigIntResult = BigInt(doc.$numberLong);
            return BigInt.asIntN(64, bigIntResult);
          }
          const longResult = _Long.fromString(doc.$numberLong);
          if (relaxed) {
            return longResult.toNumber();
          }
          return longResult;
        }
        inspect(depth, options, inspect) {
          inspect ??= defaultInspect;
          const longVal = inspect(this.toString(), options);
          const unsignedVal = this.unsigned ? `, ${inspect(this.unsigned, options)}` : "";
          return `new Long(${longVal}${unsignedVal})`;
        }
      };
      Long.TWO_PWR_24 = Long.fromInt(TWO_PWR_24_DBL);
      Long.MAX_UNSIGNED_VALUE = Long.fromBits(4294967295 | 0, 4294967295 | 0, true);
      Long.ZERO = Long.fromInt(0);
      Long.UZERO = Long.fromInt(0, true);
      Long.ONE = Long.fromInt(1);
      Long.UONE = Long.fromInt(1, true);
      Long.NEG_ONE = Long.fromInt(-1);
      Long.MAX_VALUE = Long.fromBits(4294967295 | 0, 2147483647 | 0, false);
      Long.MIN_VALUE = Long.fromBits(0, 2147483648 | 0, false);
      var PARSE_STRING_REGEXP = /^(\+|-)?(\d+|(\d*\.\d*))?(E|e)?([-+])?(\d+)?$/;
      var PARSE_INF_REGEXP = /^(\+|-)?(Infinity|inf)$/i;
      var PARSE_NAN_REGEXP = /^(\+|-)?NaN$/i;
      var EXPONENT_MAX = 6111;
      var EXPONENT_MIN = -6176;
      var EXPONENT_BIAS = 6176;
      var MAX_DIGITS = 34;
      var NAN_BUFFER = ByteUtils.fromNumberArray([
        124,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ].reverse());
      var INF_NEGATIVE_BUFFER = ByteUtils.fromNumberArray([
        248,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ].reverse());
      var INF_POSITIVE_BUFFER = ByteUtils.fromNumberArray([
        120,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ].reverse());
      var EXPONENT_REGEX = /^([-+])?(\d+)?$/;
      var COMBINATION_MASK = 31;
      var EXPONENT_MASK = 16383;
      var COMBINATION_INFINITY = 30;
      var COMBINATION_NAN = 31;
      function isDigit(value) {
        return !isNaN(parseInt(value, 10));
      }
      function divideu128(value) {
        const DIVISOR = Long.fromNumber(1e3 * 1e3 * 1e3);
        let _rem = Long.fromNumber(0);
        if (!value.parts[0] && !value.parts[1] && !value.parts[2] && !value.parts[3]) {
          return { quotient: value, rem: _rem };
        }
        for (let i = 0; i <= 3; i++) {
          _rem = _rem.shiftLeft(32);
          _rem = _rem.add(new Long(value.parts[i], 0));
          value.parts[i] = _rem.div(DIVISOR).low;
          _rem = _rem.modulo(DIVISOR);
        }
        return { quotient: value, rem: _rem };
      }
      function multiply64x2(left, right) {
        if (!left && !right) {
          return { high: Long.fromNumber(0), low: Long.fromNumber(0) };
        }
        const leftHigh = left.shiftRightUnsigned(32);
        const leftLow = new Long(left.getLowBits(), 0);
        const rightHigh = right.shiftRightUnsigned(32);
        const rightLow = new Long(right.getLowBits(), 0);
        let productHigh = leftHigh.multiply(rightHigh);
        let productMid = leftHigh.multiply(rightLow);
        const productMid2 = leftLow.multiply(rightHigh);
        let productLow = leftLow.multiply(rightLow);
        productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
        productMid = new Long(productMid.getLowBits(), 0).add(productMid2).add(productLow.shiftRightUnsigned(32));
        productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
        productLow = productMid.shiftLeft(32).add(new Long(productLow.getLowBits(), 0));
        return { high: productHigh, low: productLow };
      }
      function lessThan(left, right) {
        const uhleft = left.high >>> 0;
        const uhright = right.high >>> 0;
        if (uhleft < uhright) {
          return true;
        } else if (uhleft === uhright) {
          const ulleft = left.low >>> 0;
          const ulright = right.low >>> 0;
          if (ulleft < ulright)
            return true;
        }
        return false;
      }
      function invalidErr(string, message) {
        throw new BSONError(`"${string}" is not a valid Decimal128 string - ${message}`);
      }
      var Decimal128 = class _Decimal128 extends BSONValue {
        get _bsontype() {
          return "Decimal128";
        }
        constructor(bytes) {
          super();
          if (typeof bytes === "string") {
            this.bytes = _Decimal128.fromString(bytes).bytes;
          } else if (isUint8Array(bytes)) {
            if (bytes.byteLength !== 16) {
              throw new BSONError("Decimal128 must take a Buffer of 16 bytes");
            }
            this.bytes = bytes;
          } else {
            throw new BSONError("Decimal128 must take a Buffer or string");
          }
        }
        static fromString(representation) {
          return _Decimal128._fromString(representation, { allowRounding: false });
        }
        static fromStringWithRounding(representation) {
          return _Decimal128._fromString(representation, { allowRounding: true });
        }
        static _fromString(representation, options) {
          let isNegative = false;
          let sawSign = false;
          let sawRadix = false;
          let foundNonZero = false;
          let significantDigits = 0;
          let nDigitsRead = 0;
          let nDigits = 0;
          let radixPosition = 0;
          let firstNonZero = 0;
          const digits = [0];
          let nDigitsStored = 0;
          let digitsInsert = 0;
          let lastDigit = 0;
          let exponent = 0;
          let significandHigh = new Long(0, 0);
          let significandLow = new Long(0, 0);
          let biasedExponent = 0;
          let index = 0;
          if (representation.length >= 7e3) {
            throw new BSONError("" + representation + " not a valid Decimal128 string");
          }
          const stringMatch = representation.match(PARSE_STRING_REGEXP);
          const infMatch = representation.match(PARSE_INF_REGEXP);
          const nanMatch = representation.match(PARSE_NAN_REGEXP);
          if (!stringMatch && !infMatch && !nanMatch || representation.length === 0) {
            throw new BSONError("" + representation + " not a valid Decimal128 string");
          }
          if (stringMatch) {
            const unsignedNumber = stringMatch[2];
            const e = stringMatch[4];
            const expSign = stringMatch[5];
            const expNumber = stringMatch[6];
            if (e && expNumber === void 0)
              invalidErr(representation, "missing exponent power");
            if (e && unsignedNumber === void 0)
              invalidErr(representation, "missing exponent base");
            if (e === void 0 && (expSign || expNumber)) {
              invalidErr(representation, "missing e before exponent");
            }
          }
          if (representation[index] === "+" || representation[index] === "-") {
            sawSign = true;
            isNegative = representation[index++] === "-";
          }
          if (!isDigit(representation[index]) && representation[index] !== ".") {
            if (representation[index] === "i" || representation[index] === "I") {
              return new _Decimal128(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER);
            } else if (representation[index] === "N") {
              return new _Decimal128(NAN_BUFFER);
            }
          }
          while (isDigit(representation[index]) || representation[index] === ".") {
            if (representation[index] === ".") {
              if (sawRadix)
                invalidErr(representation, "contains multiple periods");
              sawRadix = true;
              index = index + 1;
              continue;
            }
            if (nDigitsStored < MAX_DIGITS) {
              if (representation[index] !== "0" || foundNonZero) {
                if (!foundNonZero) {
                  firstNonZero = nDigitsRead;
                }
                foundNonZero = true;
                digits[digitsInsert++] = parseInt(representation[index], 10);
                nDigitsStored = nDigitsStored + 1;
              }
            }
            if (foundNonZero)
              nDigits = nDigits + 1;
            if (sawRadix)
              radixPosition = radixPosition + 1;
            nDigitsRead = nDigitsRead + 1;
            index = index + 1;
          }
          if (sawRadix && !nDigitsRead)
            throw new BSONError("" + representation + " not a valid Decimal128 string");
          if (representation[index] === "e" || representation[index] === "E") {
            const match = representation.substr(++index).match(EXPONENT_REGEX);
            if (!match || !match[2])
              return new _Decimal128(NAN_BUFFER);
            exponent = parseInt(match[0], 10);
            index = index + match[0].length;
          }
          if (representation[index])
            return new _Decimal128(NAN_BUFFER);
          if (!nDigitsStored) {
            digits[0] = 0;
            nDigits = 1;
            nDigitsStored = 1;
            significantDigits = 0;
          } else {
            lastDigit = nDigitsStored - 1;
            significantDigits = nDigits;
            if (significantDigits !== 1) {
              while (representation[firstNonZero + significantDigits - 1 + Number(sawSign) + Number(sawRadix)] === "0") {
                significantDigits = significantDigits - 1;
              }
            }
          }
          if (exponent <= radixPosition && radixPosition > exponent + (1 << 14)) {
            exponent = EXPONENT_MIN;
          } else {
            exponent = exponent - radixPosition;
          }
          while (exponent > EXPONENT_MAX) {
            lastDigit = lastDigit + 1;
            if (lastDigit >= MAX_DIGITS) {
              if (significantDigits === 0) {
                exponent = EXPONENT_MAX;
                break;
              }
              invalidErr(representation, "overflow");
            }
            exponent = exponent - 1;
          }
          if (options.allowRounding) {
            while (exponent < EXPONENT_MIN || nDigitsStored < nDigits) {
              if (lastDigit === 0 && significantDigits < nDigitsStored) {
                exponent = EXPONENT_MIN;
                significantDigits = 0;
                break;
              }
              if (nDigitsStored < nDigits) {
                nDigits = nDigits - 1;
              } else {
                lastDigit = lastDigit - 1;
              }
              if (exponent < EXPONENT_MAX) {
                exponent = exponent + 1;
              } else {
                const digitsString = digits.join("");
                if (digitsString.match(/^0+$/)) {
                  exponent = EXPONENT_MAX;
                  break;
                }
                invalidErr(representation, "overflow");
              }
            }
            if (lastDigit + 1 < significantDigits) {
              let endOfString = nDigitsRead;
              if (sawRadix) {
                firstNonZero = firstNonZero + 1;
                endOfString = endOfString + 1;
              }
              if (sawSign) {
                firstNonZero = firstNonZero + 1;
                endOfString = endOfString + 1;
              }
              const roundDigit = parseInt(representation[firstNonZero + lastDigit + 1], 10);
              let roundBit = 0;
              if (roundDigit >= 5) {
                roundBit = 1;
                if (roundDigit === 5) {
                  roundBit = digits[lastDigit] % 2 === 1 ? 1 : 0;
                  for (let i = firstNonZero + lastDigit + 2; i < endOfString; i++) {
                    if (parseInt(representation[i], 10)) {
                      roundBit = 1;
                      break;
                    }
                  }
                }
              }
              if (roundBit) {
                let dIdx = lastDigit;
                for (; dIdx >= 0; dIdx--) {
                  if (++digits[dIdx] > 9) {
                    digits[dIdx] = 0;
                    if (dIdx === 0) {
                      if (exponent < EXPONENT_MAX) {
                        exponent = exponent + 1;
                        digits[dIdx] = 1;
                      } else {
                        return new _Decimal128(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER);
                      }
                    }
                  } else {
                    break;
                  }
                }
              }
            }
          } else {
            while (exponent < EXPONENT_MIN || nDigitsStored < nDigits) {
              if (lastDigit === 0) {
                if (significantDigits === 0) {
                  exponent = EXPONENT_MIN;
                  break;
                }
                invalidErr(representation, "exponent underflow");
              }
              if (nDigitsStored < nDigits) {
                if (representation[nDigits - 1 + Number(sawSign) + Number(sawRadix)] !== "0" && significantDigits !== 0) {
                  invalidErr(representation, "inexact rounding");
                }
                nDigits = nDigits - 1;
              } else {
                if (digits[lastDigit] !== 0) {
                  invalidErr(representation, "inexact rounding");
                }
                lastDigit = lastDigit - 1;
              }
              if (exponent < EXPONENT_MAX) {
                exponent = exponent + 1;
              } else {
                invalidErr(representation, "overflow");
              }
            }
            if (lastDigit + 1 < significantDigits) {
              if (sawRadix) {
                firstNonZero = firstNonZero + 1;
              }
              if (sawSign) {
                firstNonZero = firstNonZero + 1;
              }
              const roundDigit = parseInt(representation[firstNonZero + lastDigit + 1], 10);
              if (roundDigit !== 0) {
                invalidErr(representation, "inexact rounding");
              }
            }
          }
          significandHigh = Long.fromNumber(0);
          significandLow = Long.fromNumber(0);
          if (significantDigits === 0) {
            significandHigh = Long.fromNumber(0);
            significandLow = Long.fromNumber(0);
          } else if (lastDigit < 17) {
            let dIdx = 0;
            significandLow = Long.fromNumber(digits[dIdx++]);
            significandHigh = new Long(0, 0);
            for (; dIdx <= lastDigit; dIdx++) {
              significandLow = significandLow.multiply(Long.fromNumber(10));
              significandLow = significandLow.add(Long.fromNumber(digits[dIdx]));
            }
          } else {
            let dIdx = 0;
            significandHigh = Long.fromNumber(digits[dIdx++]);
            for (; dIdx <= lastDigit - 17; dIdx++) {
              significandHigh = significandHigh.multiply(Long.fromNumber(10));
              significandHigh = significandHigh.add(Long.fromNumber(digits[dIdx]));
            }
            significandLow = Long.fromNumber(digits[dIdx++]);
            for (; dIdx <= lastDigit; dIdx++) {
              significandLow = significandLow.multiply(Long.fromNumber(10));
              significandLow = significandLow.add(Long.fromNumber(digits[dIdx]));
            }
          }
          const significand = multiply64x2(significandHigh, Long.fromString("100000000000000000"));
          significand.low = significand.low.add(significandLow);
          if (lessThan(significand.low, significandLow)) {
            significand.high = significand.high.add(Long.fromNumber(1));
          }
          biasedExponent = exponent + EXPONENT_BIAS;
          const dec = { low: Long.fromNumber(0), high: Long.fromNumber(0) };
          if (significand.high.shiftRightUnsigned(49).and(Long.fromNumber(1)).equals(Long.fromNumber(1))) {
            dec.high = dec.high.or(Long.fromNumber(3).shiftLeft(61));
            dec.high = dec.high.or(Long.fromNumber(biasedExponent).and(Long.fromNumber(16383).shiftLeft(47)));
            dec.high = dec.high.or(significand.high.and(Long.fromNumber(140737488355327)));
          } else {
            dec.high = dec.high.or(Long.fromNumber(biasedExponent & 16383).shiftLeft(49));
            dec.high = dec.high.or(significand.high.and(Long.fromNumber(562949953421311)));
          }
          dec.low = significand.low;
          if (isNegative) {
            dec.high = dec.high.or(Long.fromString("9223372036854775808"));
          }
          const buffer2 = ByteUtils.allocate(16);
          index = 0;
          buffer2[index++] = dec.low.low & 255;
          buffer2[index++] = dec.low.low >> 8 & 255;
          buffer2[index++] = dec.low.low >> 16 & 255;
          buffer2[index++] = dec.low.low >> 24 & 255;
          buffer2[index++] = dec.low.high & 255;
          buffer2[index++] = dec.low.high >> 8 & 255;
          buffer2[index++] = dec.low.high >> 16 & 255;
          buffer2[index++] = dec.low.high >> 24 & 255;
          buffer2[index++] = dec.high.low & 255;
          buffer2[index++] = dec.high.low >> 8 & 255;
          buffer2[index++] = dec.high.low >> 16 & 255;
          buffer2[index++] = dec.high.low >> 24 & 255;
          buffer2[index++] = dec.high.high & 255;
          buffer2[index++] = dec.high.high >> 8 & 255;
          buffer2[index++] = dec.high.high >> 16 & 255;
          buffer2[index++] = dec.high.high >> 24 & 255;
          return new _Decimal128(buffer2);
        }
        toString() {
          let biased_exponent;
          let significand_digits = 0;
          const significand = new Array(36);
          for (let i = 0; i < significand.length; i++)
            significand[i] = 0;
          let index = 0;
          let is_zero = false;
          let significand_msb;
          let significand128 = { parts: [0, 0, 0, 0] };
          let j, k;
          const string = [];
          index = 0;
          const buffer2 = this.bytes;
          const low = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
          const midl = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
          const midh = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
          const high = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
          index = 0;
          const dec = {
            low: new Long(low, midl),
            high: new Long(midh, high)
          };
          if (dec.high.lessThan(Long.ZERO)) {
            string.push("-");
          }
          const combination = high >> 26 & COMBINATION_MASK;
          if (combination >> 3 === 3) {
            if (combination === COMBINATION_INFINITY) {
              return string.join("") + "Infinity";
            } else if (combination === COMBINATION_NAN) {
              return "NaN";
            } else {
              biased_exponent = high >> 15 & EXPONENT_MASK;
              significand_msb = 8 + (high >> 14 & 1);
            }
          } else {
            significand_msb = high >> 14 & 7;
            biased_exponent = high >> 17 & EXPONENT_MASK;
          }
          const exponent = biased_exponent - EXPONENT_BIAS;
          significand128.parts[0] = (high & 16383) + ((significand_msb & 15) << 14);
          significand128.parts[1] = midh;
          significand128.parts[2] = midl;
          significand128.parts[3] = low;
          if (significand128.parts[0] === 0 && significand128.parts[1] === 0 && significand128.parts[2] === 0 && significand128.parts[3] === 0) {
            is_zero = true;
          } else {
            for (k = 3; k >= 0; k--) {
              let least_digits = 0;
              const result = divideu128(significand128);
              significand128 = result.quotient;
              least_digits = result.rem.low;
              if (!least_digits)
                continue;
              for (j = 8; j >= 0; j--) {
                significand[k * 9 + j] = least_digits % 10;
                least_digits = Math.floor(least_digits / 10);
              }
            }
          }
          if (is_zero) {
            significand_digits = 1;
            significand[index] = 0;
          } else {
            significand_digits = 36;
            while (!significand[index]) {
              significand_digits = significand_digits - 1;
              index = index + 1;
            }
          }
          const scientific_exponent = significand_digits - 1 + exponent;
          if (scientific_exponent >= 34 || scientific_exponent <= -7 || exponent > 0) {
            if (significand_digits > 34) {
              string.push(`${0}`);
              if (exponent > 0)
                string.push(`E+${exponent}`);
              else if (exponent < 0)
                string.push(`E${exponent}`);
              return string.join("");
            }
            string.push(`${significand[index++]}`);
            significand_digits = significand_digits - 1;
            if (significand_digits) {
              string.push(".");
            }
            for (let i = 0; i < significand_digits; i++) {
              string.push(`${significand[index++]}`);
            }
            string.push("E");
            if (scientific_exponent > 0) {
              string.push(`+${scientific_exponent}`);
            } else {
              string.push(`${scientific_exponent}`);
            }
          } else {
            if (exponent >= 0) {
              for (let i = 0; i < significand_digits; i++) {
                string.push(`${significand[index++]}`);
              }
            } else {
              let radix_position = significand_digits + exponent;
              if (radix_position > 0) {
                for (let i = 0; i < radix_position; i++) {
                  string.push(`${significand[index++]}`);
                }
              } else {
                string.push("0");
              }
              string.push(".");
              while (radix_position++ < 0) {
                string.push("0");
              }
              for (let i = 0; i < significand_digits - Math.max(radix_position - 1, 0); i++) {
                string.push(`${significand[index++]}`);
              }
            }
          }
          return string.join("");
        }
        toJSON() {
          return { $numberDecimal: this.toString() };
        }
        toExtendedJSON() {
          return { $numberDecimal: this.toString() };
        }
        static fromExtendedJSON(doc) {
          return _Decimal128.fromString(doc.$numberDecimal);
        }
        inspect(depth, options, inspect) {
          inspect ??= defaultInspect;
          const d128string = inspect(this.toString(), options);
          return `new Decimal128(${d128string})`;
        }
      };
      var Double = class _Double extends BSONValue {
        get _bsontype() {
          return "Double";
        }
        constructor(value) {
          super();
          if (value instanceof Number) {
            value = value.valueOf();
          }
          this.value = +value;
        }
        valueOf() {
          return this.value;
        }
        toJSON() {
          return this.value;
        }
        toString(radix) {
          return this.value.toString(radix);
        }
        toExtendedJSON(options) {
          if (options && (options.legacy || options.relaxed && isFinite(this.value))) {
            return this.value;
          }
          if (Object.is(Math.sign(this.value), -0)) {
            return { $numberDouble: "-0.0" };
          }
          return {
            $numberDouble: Number.isInteger(this.value) ? this.value.toFixed(1) : this.value.toString()
          };
        }
        static fromExtendedJSON(doc, options) {
          const doubleValue = parseFloat(doc.$numberDouble);
          return options && options.relaxed ? doubleValue : new _Double(doubleValue);
        }
        inspect(depth, options, inspect) {
          inspect ??= defaultInspect;
          return `new Double(${inspect(this.value, options)})`;
        }
      };
      var Int32 = class _Int32 extends BSONValue {
        get _bsontype() {
          return "Int32";
        }
        constructor(value) {
          super();
          if (value instanceof Number) {
            value = value.valueOf();
          }
          this.value = +value | 0;
        }
        valueOf() {
          return this.value;
        }
        toString(radix) {
          return this.value.toString(radix);
        }
        toJSON() {
          return this.value;
        }
        toExtendedJSON(options) {
          if (options && (options.relaxed || options.legacy))
            return this.value;
          return { $numberInt: this.value.toString() };
        }
        static fromExtendedJSON(doc, options) {
          return options && options.relaxed ? parseInt(doc.$numberInt, 10) : new _Int32(doc.$numberInt);
        }
        inspect(depth, options, inspect) {
          inspect ??= defaultInspect;
          return `new Int32(${inspect(this.value, options)})`;
        }
      };
      var MaxKey = class _MaxKey extends BSONValue {
        get _bsontype() {
          return "MaxKey";
        }
        toExtendedJSON() {
          return { $maxKey: 1 };
        }
        static fromExtendedJSON() {
          return new _MaxKey();
        }
        inspect() {
          return "new MaxKey()";
        }
      };
      var MinKey = class _MinKey extends BSONValue {
        get _bsontype() {
          return "MinKey";
        }
        toExtendedJSON() {
          return { $minKey: 1 };
        }
        static fromExtendedJSON() {
          return new _MinKey();
        }
        inspect() {
          return "new MinKey()";
        }
      };
      var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
      var PROCESS_UNIQUE = null;
      var kId = Symbol("id");
      var ObjectId = class _ObjectId extends BSONValue {
        get _bsontype() {
          return "ObjectId";
        }
        constructor(inputId) {
          super();
          let workingId;
          if (typeof inputId === "object" && inputId && "id" in inputId) {
            if (typeof inputId.id !== "string" && !ArrayBuffer.isView(inputId.id)) {
              throw new BSONError("Argument passed in must have an id that is of type string or Buffer");
            }
            if ("toHexString" in inputId && typeof inputId.toHexString === "function") {
              workingId = ByteUtils.fromHex(inputId.toHexString());
            } else {
              workingId = inputId.id;
            }
          } else {
            workingId = inputId;
          }
          if (workingId == null || typeof workingId === "number") {
            this[kId] = _ObjectId.generate(typeof workingId === "number" ? workingId : void 0);
          } else if (ArrayBuffer.isView(workingId) && workingId.byteLength === 12) {
            this[kId] = ByteUtils.toLocalBufferType(workingId);
          } else if (typeof workingId === "string") {
            if (workingId.length === 24 && checkForHexRegExp.test(workingId)) {
              this[kId] = ByteUtils.fromHex(workingId);
            } else {
              throw new BSONError("input must be a 24 character hex string, 12 byte Uint8Array, or an integer");
            }
          } else {
            throw new BSONError("Argument passed in does not match the accepted types");
          }
          if (_ObjectId.cacheHexString) {
            this.__id = ByteUtils.toHex(this.id);
          }
        }
        get id() {
          return this[kId];
        }
        set id(value) {
          this[kId] = value;
          if (_ObjectId.cacheHexString) {
            this.__id = ByteUtils.toHex(value);
          }
        }
        toHexString() {
          if (_ObjectId.cacheHexString && this.__id) {
            return this.__id;
          }
          const hexString = ByteUtils.toHex(this.id);
          if (_ObjectId.cacheHexString && !this.__id) {
            this.__id = hexString;
          }
          return hexString;
        }
        static getInc() {
          return _ObjectId.index = (_ObjectId.index + 1) % 16777215;
        }
        static generate(time) {
          if ("number" !== typeof time) {
            time = Math.floor(Date.now() / 1e3);
          }
          const inc = _ObjectId.getInc();
          const buffer2 = ByteUtils.allocate(12);
          BSONDataView.fromUint8Array(buffer2).setUint32(0, time, false);
          if (PROCESS_UNIQUE === null) {
            PROCESS_UNIQUE = ByteUtils.randomBytes(5);
          }
          buffer2[4] = PROCESS_UNIQUE[0];
          buffer2[5] = PROCESS_UNIQUE[1];
          buffer2[6] = PROCESS_UNIQUE[2];
          buffer2[7] = PROCESS_UNIQUE[3];
          buffer2[8] = PROCESS_UNIQUE[4];
          buffer2[11] = inc & 255;
          buffer2[10] = inc >> 8 & 255;
          buffer2[9] = inc >> 16 & 255;
          return buffer2;
        }
        toString(encoding) {
          if (encoding === "base64")
            return ByteUtils.toBase64(this.id);
          if (encoding === "hex")
            return this.toHexString();
          return this.toHexString();
        }
        toJSON() {
          return this.toHexString();
        }
        static is(variable) {
          return variable != null && typeof variable === "object" && "_bsontype" in variable && variable._bsontype === "ObjectId";
        }
        equals(otherId) {
          if (otherId === void 0 || otherId === null) {
            return false;
          }
          if (_ObjectId.is(otherId)) {
            return this[kId][11] === otherId[kId][11] && ByteUtils.equals(this[kId], otherId[kId]);
          }
          if (typeof otherId === "string") {
            return otherId.toLowerCase() === this.toHexString();
          }
          if (typeof otherId === "object" && typeof otherId.toHexString === "function") {
            const otherIdString = otherId.toHexString();
            const thisIdString = this.toHexString();
            return typeof otherIdString === "string" && otherIdString.toLowerCase() === thisIdString;
          }
          return false;
        }
        getTimestamp() {
          const timestamp = /* @__PURE__ */ new Date();
          const time = BSONDataView.fromUint8Array(this.id).getUint32(0, false);
          timestamp.setTime(Math.floor(time) * 1e3);
          return timestamp;
        }
        static createPk() {
          return new _ObjectId();
        }
        static createFromTime(time) {
          const buffer2 = ByteUtils.fromNumberArray([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          BSONDataView.fromUint8Array(buffer2).setUint32(0, time, false);
          return new _ObjectId(buffer2);
        }
        static createFromHexString(hexString) {
          if (hexString?.length !== 24) {
            throw new BSONError("hex string must be 24 characters");
          }
          return new _ObjectId(ByteUtils.fromHex(hexString));
        }
        static createFromBase64(base64) {
          if (base64?.length !== 16) {
            throw new BSONError("base64 string must be 16 characters");
          }
          return new _ObjectId(ByteUtils.fromBase64(base64));
        }
        static isValid(id) {
          if (id == null)
            return false;
          try {
            new _ObjectId(id);
            return true;
          } catch {
            return false;
          }
        }
        toExtendedJSON() {
          if (this.toHexString)
            return { $oid: this.toHexString() };
          return { $oid: this.toString("hex") };
        }
        static fromExtendedJSON(doc) {
          return new _ObjectId(doc.$oid);
        }
        inspect(depth, options, inspect) {
          inspect ??= defaultInspect;
          return `new ObjectId(${inspect(this.toHexString(), options)})`;
        }
      };
      ObjectId.index = Math.floor(Math.random() * 16777215);
      function internalCalculateObjectSize(object, serializeFunctions, ignoreUndefined) {
        let totalLength = 4 + 1;
        if (Array.isArray(object)) {
          for (let i = 0; i < object.length; i++) {
            totalLength += calculateElement(i.toString(), object[i], serializeFunctions, true, ignoreUndefined);
          }
        } else {
          if (typeof object?.toBSON === "function") {
            object = object.toBSON();
          }
          for (const key of Object.keys(object)) {
            totalLength += calculateElement(key, object[key], serializeFunctions, false, ignoreUndefined);
          }
        }
        return totalLength;
      }
      function calculateElement(name, value, serializeFunctions = false, isArray = false, ignoreUndefined = false) {
        if (typeof value?.toBSON === "function") {
          value = value.toBSON();
        }
        switch (typeof value) {
          case "string":
            return 1 + ByteUtils.utf8ByteLength(name) + 1 + 4 + ByteUtils.utf8ByteLength(value) + 1;
          case "number":
            if (Math.floor(value) === value && value >= JS_INT_MIN && value <= JS_INT_MAX) {
              if (value >= BSON_INT32_MIN && value <= BSON_INT32_MAX) {
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (4 + 1);
              } else {
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (8 + 1);
              }
            } else {
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (8 + 1);
            }
          case "undefined":
            if (isArray || !ignoreUndefined)
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + 1;
            return 0;
          case "boolean":
            return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (1 + 1);
          case "object":
            if (value != null && typeof value._bsontype === "string" && value[Symbol.for("@@mdb.bson.version")] !== BSON_MAJOR_VERSION) {
              throw new BSONVersionError();
            } else if (value == null || value._bsontype === "MinKey" || value._bsontype === "MaxKey") {
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + 1;
            } else if (value._bsontype === "ObjectId") {
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (12 + 1);
            } else if (value instanceof Date || isDate(value)) {
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (8 + 1);
            } else if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer || isAnyArrayBuffer(value)) {
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (1 + 4 + 1) + value.byteLength;
            } else if (value._bsontype === "Long" || value._bsontype === "Double" || value._bsontype === "Timestamp") {
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (8 + 1);
            } else if (value._bsontype === "Decimal128") {
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (16 + 1);
            } else if (value._bsontype === "Code") {
              if (value.scope != null && Object.keys(value.scope).length > 0) {
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + 1 + 4 + 4 + ByteUtils.utf8ByteLength(value.code.toString()) + 1 + internalCalculateObjectSize(value.scope, serializeFunctions, ignoreUndefined);
              } else {
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + 1 + 4 + ByteUtils.utf8ByteLength(value.code.toString()) + 1;
              }
            } else if (value._bsontype === "Binary") {
              const binary = value;
              if (binary.sub_type === Binary.SUBTYPE_BYTE_ARRAY) {
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (binary.position + 1 + 4 + 1 + 4);
              } else {
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (binary.position + 1 + 4 + 1);
              }
            } else if (value._bsontype === "Symbol") {
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + ByteUtils.utf8ByteLength(value.value) + 4 + 1 + 1;
            } else if (value._bsontype === "DBRef") {
              const ordered_values = Object.assign({
                $ref: value.collection,
                $id: value.oid
              }, value.fields);
              if (value.db != null) {
                ordered_values["$db"] = value.db;
              }
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + 1 + internalCalculateObjectSize(ordered_values, serializeFunctions, ignoreUndefined);
            } else if (value instanceof RegExp || isRegExp(value)) {
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + 1 + ByteUtils.utf8ByteLength(value.source) + 1 + (value.global ? 1 : 0) + (value.ignoreCase ? 1 : 0) + (value.multiline ? 1 : 0) + 1;
            } else if (value._bsontype === "BSONRegExp") {
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + 1 + ByteUtils.utf8ByteLength(value.pattern) + 1 + ByteUtils.utf8ByteLength(value.options) + 1;
            } else {
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + internalCalculateObjectSize(value, serializeFunctions, ignoreUndefined) + 1;
            }
          case "function":
            if (serializeFunctions) {
              return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + 1 + 4 + ByteUtils.utf8ByteLength(value.toString()) + 1;
            }
        }
        return 0;
      }
      function alphabetize(str) {
        return str.split("").sort().join("");
      }
      var BSONRegExp = class _BSONRegExp extends BSONValue {
        get _bsontype() {
          return "BSONRegExp";
        }
        constructor(pattern, options) {
          super();
          this.pattern = pattern;
          this.options = alphabetize(options ?? "");
          if (this.pattern.indexOf("\0") !== -1) {
            throw new BSONError(`BSON Regex patterns cannot contain null bytes, found: ${JSON.stringify(this.pattern)}`);
          }
          if (this.options.indexOf("\0") !== -1) {
            throw new BSONError(`BSON Regex options cannot contain null bytes, found: ${JSON.stringify(this.options)}`);
          }
          for (let i = 0; i < this.options.length; i++) {
            if (!(this.options[i] === "i" || this.options[i] === "m" || this.options[i] === "x" || this.options[i] === "l" || this.options[i] === "s" || this.options[i] === "u")) {
              throw new BSONError(`The regular expression option [${this.options[i]}] is not supported`);
            }
          }
        }
        static parseOptions(options) {
          return options ? options.split("").sort().join("") : "";
        }
        toExtendedJSON(options) {
          options = options || {};
          if (options.legacy) {
            return { $regex: this.pattern, $options: this.options };
          }
          return { $regularExpression: { pattern: this.pattern, options: this.options } };
        }
        static fromExtendedJSON(doc) {
          if ("$regex" in doc) {
            if (typeof doc.$regex !== "string") {
              if (doc.$regex._bsontype === "BSONRegExp") {
                return doc;
              }
            } else {
              return new _BSONRegExp(doc.$regex, _BSONRegExp.parseOptions(doc.$options));
            }
          }
          if ("$regularExpression" in doc) {
            return new _BSONRegExp(doc.$regularExpression.pattern, _BSONRegExp.parseOptions(doc.$regularExpression.options));
          }
          throw new BSONError(`Unexpected BSONRegExp EJSON object form: ${JSON.stringify(doc)}`);
        }
        inspect(depth, options, inspect) {
          const stylize = getStylizeFunction(options) ?? ((v) => v);
          inspect ??= defaultInspect;
          const pattern = stylize(inspect(this.pattern), "regexp");
          const flags = stylize(inspect(this.options), "regexp");
          return `new BSONRegExp(${pattern}, ${flags})`;
        }
      };
      var BSONSymbol = class _BSONSymbol extends BSONValue {
        get _bsontype() {
          return "BSONSymbol";
        }
        constructor(value) {
          super();
          this.value = value;
        }
        valueOf() {
          return this.value;
        }
        toString() {
          return this.value;
        }
        toJSON() {
          return this.value;
        }
        toExtendedJSON() {
          return { $symbol: this.value };
        }
        static fromExtendedJSON(doc) {
          return new _BSONSymbol(doc.$symbol);
        }
        inspect(depth, options, inspect) {
          inspect ??= defaultInspect;
          return `new BSONSymbol(${inspect(this.value, options)})`;
        }
      };
      var LongWithoutOverridesClass = Long;
      var Timestamp = class _Timestamp extends LongWithoutOverridesClass {
        get _bsontype() {
          return "Timestamp";
        }
        constructor(low) {
          if (low == null) {
            super(0, 0, true);
          } else if (typeof low === "bigint") {
            super(low, true);
          } else if (Long.isLong(low)) {
            super(low.low, low.high, true);
          } else if (typeof low === "object" && "t" in low && "i" in low) {
            if (typeof low.t !== "number" && (typeof low.t !== "object" || low.t._bsontype !== "Int32")) {
              throw new BSONError("Timestamp constructed from { t, i } must provide t as a number");
            }
            if (typeof low.i !== "number" && (typeof low.i !== "object" || low.i._bsontype !== "Int32")) {
              throw new BSONError("Timestamp constructed from { t, i } must provide i as a number");
            }
            const t = Number(low.t);
            const i = Number(low.i);
            if (t < 0 || Number.isNaN(t)) {
              throw new BSONError("Timestamp constructed from { t, i } must provide a positive t");
            }
            if (i < 0 || Number.isNaN(i)) {
              throw new BSONError("Timestamp constructed from { t, i } must provide a positive i");
            }
            if (t > 4294967295) {
              throw new BSONError("Timestamp constructed from { t, i } must provide t equal or less than uint32 max");
            }
            if (i > 4294967295) {
              throw new BSONError("Timestamp constructed from { t, i } must provide i equal or less than uint32 max");
            }
            super(i, t, true);
          } else {
            throw new BSONError("A Timestamp can only be constructed with: bigint, Long, or { t: number; i: number }");
          }
        }
        toJSON() {
          return {
            $timestamp: this.toString()
          };
        }
        static fromInt(value) {
          return new _Timestamp(Long.fromInt(value, true));
        }
        static fromNumber(value) {
          return new _Timestamp(Long.fromNumber(value, true));
        }
        static fromBits(lowBits, highBits) {
          return new _Timestamp({ i: lowBits, t: highBits });
        }
        static fromString(str, optRadix) {
          return new _Timestamp(Long.fromString(str, true, optRadix));
        }
        toExtendedJSON() {
          return { $timestamp: { t: this.high >>> 0, i: this.low >>> 0 } };
        }
        static fromExtendedJSON(doc) {
          const i = Long.isLong(doc.$timestamp.i) ? doc.$timestamp.i.getLowBitsUnsigned() : doc.$timestamp.i;
          const t = Long.isLong(doc.$timestamp.t) ? doc.$timestamp.t.getLowBitsUnsigned() : doc.$timestamp.t;
          return new _Timestamp({ t, i });
        }
        inspect(depth, options, inspect) {
          inspect ??= defaultInspect;
          const t = inspect(this.high >>> 0, options);
          const i = inspect(this.low >>> 0, options);
          return `new Timestamp({ t: ${t}, i: ${i} })`;
        }
      };
      Timestamp.MAX_VALUE = Long.MAX_UNSIGNED_VALUE;
      var JS_INT_MAX_LONG = Long.fromNumber(JS_INT_MAX);
      var JS_INT_MIN_LONG = Long.fromNumber(JS_INT_MIN);
      function internalDeserialize(buffer2, options, isArray) {
        options = options == null ? {} : options;
        const index = options && options.index ? options.index : 0;
        const size = buffer2[index] | buffer2[index + 1] << 8 | buffer2[index + 2] << 16 | buffer2[index + 3] << 24;
        if (size < 5) {
          throw new BSONError(`bson size must be >= 5, is ${size}`);
        }
        if (options.allowObjectSmallerThanBufferSize && buffer2.length < size) {
          throw new BSONError(`buffer length ${buffer2.length} must be >= bson size ${size}`);
        }
        if (!options.allowObjectSmallerThanBufferSize && buffer2.length !== size) {
          throw new BSONError(`buffer length ${buffer2.length} must === bson size ${size}`);
        }
        if (size + index > buffer2.byteLength) {
          throw new BSONError(`(bson size ${size} + options.index ${index} must be <= buffer length ${buffer2.byteLength})`);
        }
        if (buffer2[index + size - 1] !== 0) {
          throw new BSONError("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");
        }
        return deserializeObject(buffer2, index, options, isArray);
      }
      var allowedDBRefKeys = /^\$ref$|^\$id$|^\$db$/;
      function deserializeObject(buffer2, index, options, isArray = false) {
        const fieldsAsRaw = options["fieldsAsRaw"] == null ? null : options["fieldsAsRaw"];
        const raw = options["raw"] == null ? false : options["raw"];
        const bsonRegExp = typeof options["bsonRegExp"] === "boolean" ? options["bsonRegExp"] : false;
        const promoteBuffers = options.promoteBuffers ?? false;
        const promoteLongs = options.promoteLongs ?? true;
        const promoteValues = options.promoteValues ?? true;
        const useBigInt64 = options.useBigInt64 ?? false;
        if (useBigInt64 && !promoteValues) {
          throw new BSONError("Must either request bigint or Long for int64 deserialization");
        }
        if (useBigInt64 && !promoteLongs) {
          throw new BSONError("Must either request bigint or Long for int64 deserialization");
        }
        const validation = options.validation == null ? { utf8: true } : options.validation;
        let globalUTFValidation = true;
        let validationSetting;
        const utf8KeysSet = /* @__PURE__ */ new Set();
        const utf8ValidatedKeys = validation.utf8;
        if (typeof utf8ValidatedKeys === "boolean") {
          validationSetting = utf8ValidatedKeys;
        } else {
          globalUTFValidation = false;
          const utf8ValidationValues = Object.keys(utf8ValidatedKeys).map(function(key) {
            return utf8ValidatedKeys[key];
          });
          if (utf8ValidationValues.length === 0) {
            throw new BSONError("UTF-8 validation setting cannot be empty");
          }
          if (typeof utf8ValidationValues[0] !== "boolean") {
            throw new BSONError("Invalid UTF-8 validation option, must specify boolean values");
          }
          validationSetting = utf8ValidationValues[0];
          if (!utf8ValidationValues.every((item) => item === validationSetting)) {
            throw new BSONError("Invalid UTF-8 validation option - keys must be all true or all false");
          }
        }
        if (!globalUTFValidation) {
          for (const key of Object.keys(utf8ValidatedKeys)) {
            utf8KeysSet.add(key);
          }
        }
        const startIndex = index;
        if (buffer2.length < 5)
          throw new BSONError("corrupt bson message < 5 bytes long");
        const size = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
        if (size < 5 || size > buffer2.length)
          throw new BSONError("corrupt bson message");
        const object = isArray ? [] : {};
        let arrayIndex = 0;
        const done = false;
        let isPossibleDBRef = isArray ? false : null;
        const dataview = new DataView(buffer2.buffer, buffer2.byteOffset, buffer2.byteLength);
        while (!done) {
          const elementType = buffer2[index++];
          if (elementType === 0)
            break;
          let i = index;
          while (buffer2[i] !== 0 && i < buffer2.length) {
            i++;
          }
          if (i >= buffer2.byteLength)
            throw new BSONError("Bad BSON Document: illegal CString");
          const name = isArray ? arrayIndex++ : ByteUtils.toUTF8(buffer2, index, i, false);
          let shouldValidateKey = true;
          if (globalUTFValidation || utf8KeysSet.has(name)) {
            shouldValidateKey = validationSetting;
          } else {
            shouldValidateKey = !validationSetting;
          }
          if (isPossibleDBRef !== false && name[0] === "$") {
            isPossibleDBRef = allowedDBRefKeys.test(name);
          }
          let value;
          index = i + 1;
          if (elementType === BSON_DATA_STRING) {
            const stringSize = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
            if (stringSize <= 0 || stringSize > buffer2.length - index || buffer2[index + stringSize - 1] !== 0) {
              throw new BSONError("bad string length in bson");
            }
            value = ByteUtils.toUTF8(buffer2, index, index + stringSize - 1, shouldValidateKey);
            index = index + stringSize;
          } else if (elementType === BSON_DATA_OID) {
            const oid = ByteUtils.allocate(12);
            oid.set(buffer2.subarray(index, index + 12));
            value = new ObjectId(oid);
            index = index + 12;
          } else if (elementType === BSON_DATA_INT && promoteValues === false) {
            value = new Int32(buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24);
          } else if (elementType === BSON_DATA_INT) {
            value = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
          } else if (elementType === BSON_DATA_NUMBER && promoteValues === false) {
            value = new Double(dataview.getFloat64(index, true));
            index = index + 8;
          } else if (elementType === BSON_DATA_NUMBER) {
            value = dataview.getFloat64(index, true);
            index = index + 8;
          } else if (elementType === BSON_DATA_DATE) {
            const lowBits = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
            const highBits = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
            value = new Date(new Long(lowBits, highBits).toNumber());
          } else if (elementType === BSON_DATA_BOOLEAN) {
            if (buffer2[index] !== 0 && buffer2[index] !== 1)
              throw new BSONError("illegal boolean type value");
            value = buffer2[index++] === 1;
          } else if (elementType === BSON_DATA_OBJECT) {
            const _index = index;
            const objectSize = buffer2[index] | buffer2[index + 1] << 8 | buffer2[index + 2] << 16 | buffer2[index + 3] << 24;
            if (objectSize <= 0 || objectSize > buffer2.length - index)
              throw new BSONError("bad embedded document length in bson");
            if (raw) {
              value = buffer2.slice(index, index + objectSize);
            } else {
              let objectOptions = options;
              if (!globalUTFValidation) {
                objectOptions = { ...options, validation: { utf8: shouldValidateKey } };
              }
              value = deserializeObject(buffer2, _index, objectOptions, false);
            }
            index = index + objectSize;
          } else if (elementType === BSON_DATA_ARRAY) {
            const _index = index;
            const objectSize = buffer2[index] | buffer2[index + 1] << 8 | buffer2[index + 2] << 16 | buffer2[index + 3] << 24;
            let arrayOptions = options;
            const stopIndex = index + objectSize;
            if (fieldsAsRaw && fieldsAsRaw[name]) {
              arrayOptions = { ...options, raw: true };
            }
            if (!globalUTFValidation) {
              arrayOptions = { ...arrayOptions, validation: { utf8: shouldValidateKey } };
            }
            value = deserializeObject(buffer2, _index, arrayOptions, true);
            index = index + objectSize;
            if (buffer2[index - 1] !== 0)
              throw new BSONError("invalid array terminator byte");
            if (index !== stopIndex)
              throw new BSONError("corrupted array bson");
          } else if (elementType === BSON_DATA_UNDEFINED) {
            value = void 0;
          } else if (elementType === BSON_DATA_NULL) {
            value = null;
          } else if (elementType === BSON_DATA_LONG) {
            const dataview2 = BSONDataView.fromUint8Array(buffer2.subarray(index, index + 8));
            const lowBits = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
            const highBits = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
            const long = new Long(lowBits, highBits);
            if (useBigInt64) {
              value = dataview2.getBigInt64(0, true);
            } else if (promoteLongs && promoteValues === true) {
              value = long.lessThanOrEqual(JS_INT_MAX_LONG) && long.greaterThanOrEqual(JS_INT_MIN_LONG) ? long.toNumber() : long;
            } else {
              value = long;
            }
          } else if (elementType === BSON_DATA_DECIMAL128) {
            const bytes = ByteUtils.allocate(16);
            bytes.set(buffer2.subarray(index, index + 16), 0);
            index = index + 16;
            value = new Decimal128(bytes);
          } else if (elementType === BSON_DATA_BINARY) {
            let binarySize = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
            const totalBinarySize = binarySize;
            const subType = buffer2[index++];
            if (binarySize < 0)
              throw new BSONError("Negative binary type element size found");
            if (binarySize > buffer2.byteLength)
              throw new BSONError("Binary type size larger than document size");
            if (buffer2["slice"] != null) {
              if (subType === Binary.SUBTYPE_BYTE_ARRAY) {
                binarySize = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
                if (binarySize < 0)
                  throw new BSONError("Negative binary type element size found for subtype 0x02");
                if (binarySize > totalBinarySize - 4)
                  throw new BSONError("Binary type with subtype 0x02 contains too long binary size");
                if (binarySize < totalBinarySize - 4)
                  throw new BSONError("Binary type with subtype 0x02 contains too short binary size");
              }
              if (promoteBuffers && promoteValues) {
                value = ByteUtils.toLocalBufferType(buffer2.slice(index, index + binarySize));
              } else {
                value = new Binary(buffer2.slice(index, index + binarySize), subType);
                if (subType === BSON_BINARY_SUBTYPE_UUID_NEW && UUID.isValid(value)) {
                  value = value.toUUID();
                }
              }
            } else {
              const _buffer = ByteUtils.allocate(binarySize);
              if (subType === Binary.SUBTYPE_BYTE_ARRAY) {
                binarySize = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
                if (binarySize < 0)
                  throw new BSONError("Negative binary type element size found for subtype 0x02");
                if (binarySize > totalBinarySize - 4)
                  throw new BSONError("Binary type with subtype 0x02 contains too long binary size");
                if (binarySize < totalBinarySize - 4)
                  throw new BSONError("Binary type with subtype 0x02 contains too short binary size");
              }
              for (i = 0; i < binarySize; i++) {
                _buffer[i] = buffer2[index + i];
              }
              if (promoteBuffers && promoteValues) {
                value = _buffer;
              } else {
                value = new Binary(buffer2.slice(index, index + binarySize), subType);
                if (subType === BSON_BINARY_SUBTYPE_UUID_NEW && UUID.isValid(value)) {
                  value = value.toUUID();
                }
              }
            }
            index = index + binarySize;
          } else if (elementType === BSON_DATA_REGEXP && bsonRegExp === false) {
            i = index;
            while (buffer2[i] !== 0 && i < buffer2.length) {
              i++;
            }
            if (i >= buffer2.length)
              throw new BSONError("Bad BSON Document: illegal CString");
            const source = ByteUtils.toUTF8(buffer2, index, i, false);
            index = i + 1;
            i = index;
            while (buffer2[i] !== 0 && i < buffer2.length) {
              i++;
            }
            if (i >= buffer2.length)
              throw new BSONError("Bad BSON Document: illegal CString");
            const regExpOptions = ByteUtils.toUTF8(buffer2, index, i, false);
            index = i + 1;
            const optionsArray = new Array(regExpOptions.length);
            for (i = 0; i < regExpOptions.length; i++) {
              switch (regExpOptions[i]) {
                case "m":
                  optionsArray[i] = "m";
                  break;
                case "s":
                  optionsArray[i] = "g";
                  break;
                case "i":
                  optionsArray[i] = "i";
                  break;
              }
            }
            value = new RegExp(source, optionsArray.join(""));
          } else if (elementType === BSON_DATA_REGEXP && bsonRegExp === true) {
            i = index;
            while (buffer2[i] !== 0 && i < buffer2.length) {
              i++;
            }
            if (i >= buffer2.length)
              throw new BSONError("Bad BSON Document: illegal CString");
            const source = ByteUtils.toUTF8(buffer2, index, i, false);
            index = i + 1;
            i = index;
            while (buffer2[i] !== 0 && i < buffer2.length) {
              i++;
            }
            if (i >= buffer2.length)
              throw new BSONError("Bad BSON Document: illegal CString");
            const regExpOptions = ByteUtils.toUTF8(buffer2, index, i, false);
            index = i + 1;
            value = new BSONRegExp(source, regExpOptions);
          } else if (elementType === BSON_DATA_SYMBOL) {
            const stringSize = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
            if (stringSize <= 0 || stringSize > buffer2.length - index || buffer2[index + stringSize - 1] !== 0) {
              throw new BSONError("bad string length in bson");
            }
            const symbol = ByteUtils.toUTF8(buffer2, index, index + stringSize - 1, shouldValidateKey);
            value = promoteValues ? symbol : new BSONSymbol(symbol);
            index = index + stringSize;
          } else if (elementType === BSON_DATA_TIMESTAMP) {
            const i2 = buffer2[index++] + buffer2[index++] * (1 << 8) + buffer2[index++] * (1 << 16) + buffer2[index++] * (1 << 24);
            const t = buffer2[index++] + buffer2[index++] * (1 << 8) + buffer2[index++] * (1 << 16) + buffer2[index++] * (1 << 24);
            value = new Timestamp({ i: i2, t });
          } else if (elementType === BSON_DATA_MIN_KEY) {
            value = new MinKey();
          } else if (elementType === BSON_DATA_MAX_KEY) {
            value = new MaxKey();
          } else if (elementType === BSON_DATA_CODE) {
            const stringSize = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
            if (stringSize <= 0 || stringSize > buffer2.length - index || buffer2[index + stringSize - 1] !== 0) {
              throw new BSONError("bad string length in bson");
            }
            const functionString = ByteUtils.toUTF8(buffer2, index, index + stringSize - 1, shouldValidateKey);
            value = new Code(functionString);
            index = index + stringSize;
          } else if (elementType === BSON_DATA_CODE_W_SCOPE) {
            const totalSize = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
            if (totalSize < 4 + 4 + 4 + 1) {
              throw new BSONError("code_w_scope total size shorter minimum expected length");
            }
            const stringSize = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
            if (stringSize <= 0 || stringSize > buffer2.length - index || buffer2[index + stringSize - 1] !== 0) {
              throw new BSONError("bad string length in bson");
            }
            const functionString = ByteUtils.toUTF8(buffer2, index, index + stringSize - 1, shouldValidateKey);
            index = index + stringSize;
            const _index = index;
            const objectSize = buffer2[index] | buffer2[index + 1] << 8 | buffer2[index + 2] << 16 | buffer2[index + 3] << 24;
            const scopeObject = deserializeObject(buffer2, _index, options, false);
            index = index + objectSize;
            if (totalSize < 4 + 4 + objectSize + stringSize) {
              throw new BSONError("code_w_scope total size is too short, truncating scope");
            }
            if (totalSize > 4 + 4 + objectSize + stringSize) {
              throw new BSONError("code_w_scope total size is too long, clips outer document");
            }
            value = new Code(functionString, scopeObject);
          } else if (elementType === BSON_DATA_DBPOINTER) {
            const stringSize = buffer2[index++] | buffer2[index++] << 8 | buffer2[index++] << 16 | buffer2[index++] << 24;
            if (stringSize <= 0 || stringSize > buffer2.length - index || buffer2[index + stringSize - 1] !== 0)
              throw new BSONError("bad string length in bson");
            if (validation != null && validation.utf8) {
              if (!validateUtf8(buffer2, index, index + stringSize - 1)) {
                throw new BSONError("Invalid UTF-8 string in BSON document");
              }
            }
            const namespace = ByteUtils.toUTF8(buffer2, index, index + stringSize - 1, false);
            index = index + stringSize;
            const oidBuffer = ByteUtils.allocate(12);
            oidBuffer.set(buffer2.subarray(index, index + 12), 0);
            const oid = new ObjectId(oidBuffer);
            index = index + 12;
            value = new DBRef(namespace, oid);
          } else {
            throw new BSONError(`Detected unknown BSON type ${elementType.toString(16)} for fieldname "${name}"`);
          }
          if (name === "__proto__") {
            Object.defineProperty(object, name, {
              value,
              writable: true,
              enumerable: true,
              configurable: true
            });
          } else {
            object[name] = value;
          }
        }
        if (size !== index - startIndex) {
          if (isArray)
            throw new BSONError("corrupt array bson");
          throw new BSONError("corrupt object bson");
        }
        if (!isPossibleDBRef)
          return object;
        if (isDBRefLike(object)) {
          const copy = Object.assign({}, object);
          delete copy.$ref;
          delete copy.$id;
          delete copy.$db;
          return new DBRef(object.$ref, object.$id, object.$db, copy);
        }
        return object;
      }
      var regexp = /\x00/;
      var ignoreKeys = /* @__PURE__ */ new Set(["$db", "$ref", "$id", "$clusterTime"]);
      function serializeString(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_STRING;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes + 1;
        buffer2[index - 1] = 0;
        const size = ByteUtils.encodeUTF8Into(buffer2, value, index + 4);
        buffer2[index + 3] = size + 1 >> 24 & 255;
        buffer2[index + 2] = size + 1 >> 16 & 255;
        buffer2[index + 1] = size + 1 >> 8 & 255;
        buffer2[index] = size + 1 & 255;
        index = index + 4 + size;
        buffer2[index++] = 0;
        return index;
      }
      var NUMBER_SPACE = new DataView(new ArrayBuffer(8), 0, 8);
      var FOUR_BYTE_VIEW_ON_NUMBER = new Uint8Array(NUMBER_SPACE.buffer, 0, 4);
      var EIGHT_BYTE_VIEW_ON_NUMBER = new Uint8Array(NUMBER_SPACE.buffer, 0, 8);
      function serializeNumber(buffer2, key, value, index) {
        const isNegativeZero = Object.is(value, -0);
        const type = !isNegativeZero && Number.isSafeInteger(value) && value <= BSON_INT32_MAX && value >= BSON_INT32_MIN ? BSON_DATA_INT : BSON_DATA_NUMBER;
        if (type === BSON_DATA_INT) {
          NUMBER_SPACE.setInt32(0, value, true);
        } else {
          NUMBER_SPACE.setFloat64(0, value, true);
        }
        const bytes = type === BSON_DATA_INT ? FOUR_BYTE_VIEW_ON_NUMBER : EIGHT_BYTE_VIEW_ON_NUMBER;
        buffer2[index++] = type;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        buffer2.set(bytes, index);
        index += bytes.byteLength;
        return index;
      }
      function serializeBigInt(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_LONG;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index += numberOfWrittenBytes;
        buffer2[index++] = 0;
        NUMBER_SPACE.setBigInt64(0, value, true);
        buffer2.set(EIGHT_BYTE_VIEW_ON_NUMBER, index);
        index += EIGHT_BYTE_VIEW_ON_NUMBER.byteLength;
        return index;
      }
      function serializeNull(buffer2, key, _, index) {
        buffer2[index++] = BSON_DATA_NULL;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        return index;
      }
      function serializeBoolean(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_BOOLEAN;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        buffer2[index++] = value ? 1 : 0;
        return index;
      }
      function serializeDate(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_DATE;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        const dateInMilis = Long.fromNumber(value.getTime());
        const lowBits = dateInMilis.getLowBits();
        const highBits = dateInMilis.getHighBits();
        buffer2[index++] = lowBits & 255;
        buffer2[index++] = lowBits >> 8 & 255;
        buffer2[index++] = lowBits >> 16 & 255;
        buffer2[index++] = lowBits >> 24 & 255;
        buffer2[index++] = highBits & 255;
        buffer2[index++] = highBits >> 8 & 255;
        buffer2[index++] = highBits >> 16 & 255;
        buffer2[index++] = highBits >> 24 & 255;
        return index;
      }
      function serializeRegExp(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_REGEXP;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        if (value.source && value.source.match(regexp) != null) {
          throw new BSONError("value " + value.source + " must not contain null bytes");
        }
        index = index + ByteUtils.encodeUTF8Into(buffer2, value.source, index);
        buffer2[index++] = 0;
        if (value.ignoreCase)
          buffer2[index++] = 105;
        if (value.global)
          buffer2[index++] = 115;
        if (value.multiline)
          buffer2[index++] = 109;
        buffer2[index++] = 0;
        return index;
      }
      function serializeBSONRegExp(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_REGEXP;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        if (value.pattern.match(regexp) != null) {
          throw new BSONError("pattern " + value.pattern + " must not contain null bytes");
        }
        index = index + ByteUtils.encodeUTF8Into(buffer2, value.pattern, index);
        buffer2[index++] = 0;
        const sortedOptions = value.options.split("").sort().join("");
        index = index + ByteUtils.encodeUTF8Into(buffer2, sortedOptions, index);
        buffer2[index++] = 0;
        return index;
      }
      function serializeMinMax(buffer2, key, value, index) {
        if (value === null) {
          buffer2[index++] = BSON_DATA_NULL;
        } else if (value._bsontype === "MinKey") {
          buffer2[index++] = BSON_DATA_MIN_KEY;
        } else {
          buffer2[index++] = BSON_DATA_MAX_KEY;
        }
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        return index;
      }
      function serializeObjectId(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_OID;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        const idValue = value.id;
        if (isUint8Array(idValue)) {
          for (let i = 0; i < 12; i++) {
            buffer2[index++] = idValue[i];
          }
        } else {
          throw new BSONError("object [" + JSON.stringify(value) + "] is not a valid ObjectId");
        }
        return index;
      }
      function serializeBuffer(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_BINARY;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        const size = value.length;
        buffer2[index++] = size & 255;
        buffer2[index++] = size >> 8 & 255;
        buffer2[index++] = size >> 16 & 255;
        buffer2[index++] = size >> 24 & 255;
        buffer2[index++] = BSON_BINARY_SUBTYPE_DEFAULT;
        buffer2.set(value, index);
        index = index + size;
        return index;
      }
      function serializeObject(buffer2, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path) {
        if (path.has(value)) {
          throw new BSONError("Cannot convert circular structure to BSON");
        }
        path.add(value);
        buffer2[index++] = Array.isArray(value) ? BSON_DATA_ARRAY : BSON_DATA_OBJECT;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        const endIndex = serializeInto(buffer2, value, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined, path);
        path.delete(value);
        return endIndex;
      }
      function serializeDecimal128(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_DECIMAL128;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        buffer2.set(value.bytes.subarray(0, 16), index);
        return index + 16;
      }
      function serializeLong(buffer2, key, value, index) {
        buffer2[index++] = value._bsontype === "Long" ? BSON_DATA_LONG : BSON_DATA_TIMESTAMP;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        const lowBits = value.getLowBits();
        const highBits = value.getHighBits();
        buffer2[index++] = lowBits & 255;
        buffer2[index++] = lowBits >> 8 & 255;
        buffer2[index++] = lowBits >> 16 & 255;
        buffer2[index++] = lowBits >> 24 & 255;
        buffer2[index++] = highBits & 255;
        buffer2[index++] = highBits >> 8 & 255;
        buffer2[index++] = highBits >> 16 & 255;
        buffer2[index++] = highBits >> 24 & 255;
        return index;
      }
      function serializeInt32(buffer2, key, value, index) {
        value = value.valueOf();
        buffer2[index++] = BSON_DATA_INT;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        buffer2[index++] = value & 255;
        buffer2[index++] = value >> 8 & 255;
        buffer2[index++] = value >> 16 & 255;
        buffer2[index++] = value >> 24 & 255;
        return index;
      }
      function serializeDouble(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_NUMBER;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        NUMBER_SPACE.setFloat64(0, value.value, true);
        buffer2.set(EIGHT_BYTE_VIEW_ON_NUMBER, index);
        index = index + 8;
        return index;
      }
      function serializeFunction(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_CODE;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        const functionString = value.toString();
        const size = ByteUtils.encodeUTF8Into(buffer2, functionString, index + 4) + 1;
        buffer2[index] = size & 255;
        buffer2[index + 1] = size >> 8 & 255;
        buffer2[index + 2] = size >> 16 & 255;
        buffer2[index + 3] = size >> 24 & 255;
        index = index + 4 + size - 1;
        buffer2[index++] = 0;
        return index;
      }
      function serializeCode(buffer2, key, value, index, checkKeys = false, depth = 0, serializeFunctions = false, ignoreUndefined = true, path) {
        if (value.scope && typeof value.scope === "object") {
          buffer2[index++] = BSON_DATA_CODE_W_SCOPE;
          const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
          index = index + numberOfWrittenBytes;
          buffer2[index++] = 0;
          let startIndex = index;
          const functionString = value.code;
          index = index + 4;
          const codeSize = ByteUtils.encodeUTF8Into(buffer2, functionString, index + 4) + 1;
          buffer2[index] = codeSize & 255;
          buffer2[index + 1] = codeSize >> 8 & 255;
          buffer2[index + 2] = codeSize >> 16 & 255;
          buffer2[index + 3] = codeSize >> 24 & 255;
          buffer2[index + 4 + codeSize - 1] = 0;
          index = index + codeSize + 4;
          const endIndex = serializeInto(buffer2, value.scope, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined, path);
          index = endIndex - 1;
          const totalSize = endIndex - startIndex;
          buffer2[startIndex++] = totalSize & 255;
          buffer2[startIndex++] = totalSize >> 8 & 255;
          buffer2[startIndex++] = totalSize >> 16 & 255;
          buffer2[startIndex++] = totalSize >> 24 & 255;
          buffer2[index++] = 0;
        } else {
          buffer2[index++] = BSON_DATA_CODE;
          const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
          index = index + numberOfWrittenBytes;
          buffer2[index++] = 0;
          const functionString = value.code.toString();
          const size = ByteUtils.encodeUTF8Into(buffer2, functionString, index + 4) + 1;
          buffer2[index] = size & 255;
          buffer2[index + 1] = size >> 8 & 255;
          buffer2[index + 2] = size >> 16 & 255;
          buffer2[index + 3] = size >> 24 & 255;
          index = index + 4 + size - 1;
          buffer2[index++] = 0;
        }
        return index;
      }
      function serializeBinary(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_BINARY;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        const data = value.buffer;
        let size = value.position;
        if (value.sub_type === Binary.SUBTYPE_BYTE_ARRAY)
          size = size + 4;
        buffer2[index++] = size & 255;
        buffer2[index++] = size >> 8 & 255;
        buffer2[index++] = size >> 16 & 255;
        buffer2[index++] = size >> 24 & 255;
        buffer2[index++] = value.sub_type;
        if (value.sub_type === Binary.SUBTYPE_BYTE_ARRAY) {
          size = size - 4;
          buffer2[index++] = size & 255;
          buffer2[index++] = size >> 8 & 255;
          buffer2[index++] = size >> 16 & 255;
          buffer2[index++] = size >> 24 & 255;
        }
        buffer2.set(data, index);
        index = index + value.position;
        return index;
      }
      function serializeSymbol(buffer2, key, value, index) {
        buffer2[index++] = BSON_DATA_SYMBOL;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        const size = ByteUtils.encodeUTF8Into(buffer2, value.value, index + 4) + 1;
        buffer2[index] = size & 255;
        buffer2[index + 1] = size >> 8 & 255;
        buffer2[index + 2] = size >> 16 & 255;
        buffer2[index + 3] = size >> 24 & 255;
        index = index + 4 + size - 1;
        buffer2[index++] = 0;
        return index;
      }
      function serializeDBRef(buffer2, key, value, index, depth, serializeFunctions, path) {
        buffer2[index++] = BSON_DATA_OBJECT;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer2, key, index);
        index = index + numberOfWrittenBytes;
        buffer2[index++] = 0;
        let startIndex = index;
        let output = {
          $ref: value.collection || value.namespace,
          $id: value.oid
        };
        if (value.db != null) {
          output.$db = value.db;
        }
        output = Object.assign(output, value.fields);
        const endIndex = serializeInto(buffer2, output, false, index, depth + 1, serializeFunctions, true, path);
        const size = endIndex - startIndex;
        buffer2[startIndex++] = size & 255;
        buffer2[startIndex++] = size >> 8 & 255;
        buffer2[startIndex++] = size >> 16 & 255;
        buffer2[startIndex++] = size >> 24 & 255;
        return endIndex;
      }
      function serializeInto(buffer2, object, checkKeys, startingIndex, depth, serializeFunctions, ignoreUndefined, path) {
        if (path == null) {
          if (object == null) {
            buffer2[0] = 5;
            buffer2[1] = 0;
            buffer2[2] = 0;
            buffer2[3] = 0;
            buffer2[4] = 0;
            return 5;
          }
          if (Array.isArray(object)) {
            throw new BSONError("serialize does not support an array as the root input");
          }
          if (typeof object !== "object") {
            throw new BSONError("serialize does not support non-object as the root input");
          } else if ("_bsontype" in object && typeof object._bsontype === "string") {
            throw new BSONError(`BSON types cannot be serialized as a document`);
          } else if (isDate(object) || isRegExp(object) || isUint8Array(object) || isAnyArrayBuffer(object)) {
            throw new BSONError(`date, regexp, typedarray, and arraybuffer cannot be BSON documents`);
          }
          path = /* @__PURE__ */ new Set();
        }
        path.add(object);
        let index = startingIndex + 4;
        if (Array.isArray(object)) {
          for (let i = 0; i < object.length; i++) {
            const key = `${i}`;
            let value = object[i];
            if (typeof value?.toBSON === "function") {
              value = value.toBSON();
            }
            if (typeof value === "string") {
              index = serializeString(buffer2, key, value, index);
            } else if (typeof value === "number") {
              index = serializeNumber(buffer2, key, value, index);
            } else if (typeof value === "bigint") {
              index = serializeBigInt(buffer2, key, value, index);
            } else if (typeof value === "boolean") {
              index = serializeBoolean(buffer2, key, value, index);
            } else if (value instanceof Date || isDate(value)) {
              index = serializeDate(buffer2, key, value, index);
            } else if (value === void 0) {
              index = serializeNull(buffer2, key, value, index);
            } else if (value === null) {
              index = serializeNull(buffer2, key, value, index);
            } else if (isUint8Array(value)) {
              index = serializeBuffer(buffer2, key, value, index);
            } else if (value instanceof RegExp || isRegExp(value)) {
              index = serializeRegExp(buffer2, key, value, index);
            } else if (typeof value === "object" && value._bsontype == null) {
              index = serializeObject(buffer2, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path);
            } else if (typeof value === "object" && value[Symbol.for("@@mdb.bson.version")] !== BSON_MAJOR_VERSION) {
              throw new BSONVersionError();
            } else if (value._bsontype === "ObjectId") {
              index = serializeObjectId(buffer2, key, value, index);
            } else if (value._bsontype === "Decimal128") {
              index = serializeDecimal128(buffer2, key, value, index);
            } else if (value._bsontype === "Long" || value._bsontype === "Timestamp") {
              index = serializeLong(buffer2, key, value, index);
            } else if (value._bsontype === "Double") {
              index = serializeDouble(buffer2, key, value, index);
            } else if (typeof value === "function" && serializeFunctions) {
              index = serializeFunction(buffer2, key, value, index);
            } else if (value._bsontype === "Code") {
              index = serializeCode(buffer2, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path);
            } else if (value._bsontype === "Binary") {
              index = serializeBinary(buffer2, key, value, index);
            } else if (value._bsontype === "BSONSymbol") {
              index = serializeSymbol(buffer2, key, value, index);
            } else if (value._bsontype === "DBRef") {
              index = serializeDBRef(buffer2, key, value, index, depth, serializeFunctions, path);
            } else if (value._bsontype === "BSONRegExp") {
              index = serializeBSONRegExp(buffer2, key, value, index);
            } else if (value._bsontype === "Int32") {
              index = serializeInt32(buffer2, key, value, index);
            } else if (value._bsontype === "MinKey" || value._bsontype === "MaxKey") {
              index = serializeMinMax(buffer2, key, value, index);
            } else if (typeof value._bsontype !== "undefined") {
              throw new BSONError(`Unrecognized or invalid _bsontype: ${String(value._bsontype)}`);
            }
          }
        } else if (object instanceof Map || isMap(object)) {
          const iterator = object.entries();
          let done = false;
          while (!done) {
            const entry = iterator.next();
            done = !!entry.done;
            if (done)
              continue;
            const key = entry.value[0];
            let value = entry.value[1];
            if (typeof value?.toBSON === "function") {
              value = value.toBSON();
            }
            const type = typeof value;
            if (typeof key === "string" && !ignoreKeys.has(key)) {
              if (key.match(regexp) != null) {
                throw new BSONError("key " + key + " must not contain null bytes");
              }
              if (checkKeys) {
                if ("$" === key[0]) {
                  throw new BSONError("key " + key + " must not start with '$'");
                } else if (~key.indexOf(".")) {
                  throw new BSONError("key " + key + " must not contain '.'");
                }
              }
            }
            if (type === "string") {
              index = serializeString(buffer2, key, value, index);
            } else if (type === "number") {
              index = serializeNumber(buffer2, key, value, index);
            } else if (type === "bigint") {
              index = serializeBigInt(buffer2, key, value, index);
            } else if (type === "boolean") {
              index = serializeBoolean(buffer2, key, value, index);
            } else if (value instanceof Date || isDate(value)) {
              index = serializeDate(buffer2, key, value, index);
            } else if (value === null || value === void 0 && ignoreUndefined === false) {
              index = serializeNull(buffer2, key, value, index);
            } else if (isUint8Array(value)) {
              index = serializeBuffer(buffer2, key, value, index);
            } else if (value instanceof RegExp || isRegExp(value)) {
              index = serializeRegExp(buffer2, key, value, index);
            } else if (type === "object" && value._bsontype == null) {
              index = serializeObject(buffer2, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path);
            } else if (typeof value === "object" && value[Symbol.for("@@mdb.bson.version")] !== BSON_MAJOR_VERSION) {
              throw new BSONVersionError();
            } else if (value._bsontype === "ObjectId") {
              index = serializeObjectId(buffer2, key, value, index);
            } else if (type === "object" && value._bsontype === "Decimal128") {
              index = serializeDecimal128(buffer2, key, value, index);
            } else if (value._bsontype === "Long" || value._bsontype === "Timestamp") {
              index = serializeLong(buffer2, key, value, index);
            } else if (value._bsontype === "Double") {
              index = serializeDouble(buffer2, key, value, index);
            } else if (value._bsontype === "Code") {
              index = serializeCode(buffer2, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path);
            } else if (typeof value === "function" && serializeFunctions) {
              index = serializeFunction(buffer2, key, value, index);
            } else if (value._bsontype === "Binary") {
              index = serializeBinary(buffer2, key, value, index);
            } else if (value._bsontype === "BSONSymbol") {
              index = serializeSymbol(buffer2, key, value, index);
            } else if (value._bsontype === "DBRef") {
              index = serializeDBRef(buffer2, key, value, index, depth, serializeFunctions, path);
            } else if (value._bsontype === "BSONRegExp") {
              index = serializeBSONRegExp(buffer2, key, value, index);
            } else if (value._bsontype === "Int32") {
              index = serializeInt32(buffer2, key, value, index);
            } else if (value._bsontype === "MinKey" || value._bsontype === "MaxKey") {
              index = serializeMinMax(buffer2, key, value, index);
            } else if (typeof value._bsontype !== "undefined") {
              throw new BSONError(`Unrecognized or invalid _bsontype: ${String(value._bsontype)}`);
            }
          }
        } else {
          if (typeof object?.toBSON === "function") {
            object = object.toBSON();
            if (object != null && typeof object !== "object") {
              throw new BSONError("toBSON function did not return an object");
            }
          }
          for (const key of Object.keys(object)) {
            let value = object[key];
            if (typeof value?.toBSON === "function") {
              value = value.toBSON();
            }
            const type = typeof value;
            if (typeof key === "string" && !ignoreKeys.has(key)) {
              if (key.match(regexp) != null) {
                throw new BSONError("key " + key + " must not contain null bytes");
              }
              if (checkKeys) {
                if ("$" === key[0]) {
                  throw new BSONError("key " + key + " must not start with '$'");
                } else if (~key.indexOf(".")) {
                  throw new BSONError("key " + key + " must not contain '.'");
                }
              }
            }
            if (type === "string") {
              index = serializeString(buffer2, key, value, index);
            } else if (type === "number") {
              index = serializeNumber(buffer2, key, value, index);
            } else if (type === "bigint") {
              index = serializeBigInt(buffer2, key, value, index);
            } else if (type === "boolean") {
              index = serializeBoolean(buffer2, key, value, index);
            } else if (value instanceof Date || isDate(value)) {
              index = serializeDate(buffer2, key, value, index);
            } else if (value === void 0) {
              if (ignoreUndefined === false)
                index = serializeNull(buffer2, key, value, index);
            } else if (value === null) {
              index = serializeNull(buffer2, key, value, index);
            } else if (isUint8Array(value)) {
              index = serializeBuffer(buffer2, key, value, index);
            } else if (value instanceof RegExp || isRegExp(value)) {
              index = serializeRegExp(buffer2, key, value, index);
            } else if (type === "object" && value._bsontype == null) {
              index = serializeObject(buffer2, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path);
            } else if (typeof value === "object" && value[Symbol.for("@@mdb.bson.version")] !== BSON_MAJOR_VERSION) {
              throw new BSONVersionError();
            } else if (value._bsontype === "ObjectId") {
              index = serializeObjectId(buffer2, key, value, index);
            } else if (type === "object" && value._bsontype === "Decimal128") {
              index = serializeDecimal128(buffer2, key, value, index);
            } else if (value._bsontype === "Long" || value._bsontype === "Timestamp") {
              index = serializeLong(buffer2, key, value, index);
            } else if (value._bsontype === "Double") {
              index = serializeDouble(buffer2, key, value, index);
            } else if (value._bsontype === "Code") {
              index = serializeCode(buffer2, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path);
            } else if (typeof value === "function" && serializeFunctions) {
              index = serializeFunction(buffer2, key, value, index);
            } else if (value._bsontype === "Binary") {
              index = serializeBinary(buffer2, key, value, index);
            } else if (value._bsontype === "BSONSymbol") {
              index = serializeSymbol(buffer2, key, value, index);
            } else if (value._bsontype === "DBRef") {
              index = serializeDBRef(buffer2, key, value, index, depth, serializeFunctions, path);
            } else if (value._bsontype === "BSONRegExp") {
              index = serializeBSONRegExp(buffer2, key, value, index);
            } else if (value._bsontype === "Int32") {
              index = serializeInt32(buffer2, key, value, index);
            } else if (value._bsontype === "MinKey" || value._bsontype === "MaxKey") {
              index = serializeMinMax(buffer2, key, value, index);
            } else if (typeof value._bsontype !== "undefined") {
              throw new BSONError(`Unrecognized or invalid _bsontype: ${String(value._bsontype)}`);
            }
          }
        }
        path.delete(object);
        buffer2[index++] = 0;
        const size = index - startingIndex;
        buffer2[startingIndex++] = size & 255;
        buffer2[startingIndex++] = size >> 8 & 255;
        buffer2[startingIndex++] = size >> 16 & 255;
        buffer2[startingIndex++] = size >> 24 & 255;
        return index;
      }
      function isBSONType(value) {
        return value != null && typeof value === "object" && "_bsontype" in value && typeof value._bsontype === "string";
      }
      var keysToCodecs = {
        $oid: ObjectId,
        $binary: Binary,
        $uuid: Binary,
        $symbol: BSONSymbol,
        $numberInt: Int32,
        $numberDecimal: Decimal128,
        $numberDouble: Double,
        $numberLong: Long,
        $minKey: MinKey,
        $maxKey: MaxKey,
        $regex: BSONRegExp,
        $regularExpression: BSONRegExp,
        $timestamp: Timestamp
      };
      function deserializeValue(value, options = {}) {
        if (typeof value === "number") {
          const in32BitRange = value <= BSON_INT32_MAX && value >= BSON_INT32_MIN;
          const in64BitRange = value <= BSON_INT64_MAX && value >= BSON_INT64_MIN;
          if (options.relaxed || options.legacy) {
            return value;
          }
          if (Number.isInteger(value) && !Object.is(value, -0)) {
            if (in32BitRange) {
              return new Int32(value);
            }
            if (in64BitRange) {
              if (options.useBigInt64) {
                return BigInt(value);
              }
              return Long.fromNumber(value);
            }
          }
          return new Double(value);
        }
        if (value == null || typeof value !== "object")
          return value;
        if (value.$undefined)
          return null;
        const keys = Object.keys(value).filter((k) => k.startsWith("$") && value[k] != null);
        for (let i = 0; i < keys.length; i++) {
          const c = keysToCodecs[keys[i]];
          if (c)
            return c.fromExtendedJSON(value, options);
        }
        if (value.$date != null) {
          const d = value.$date;
          const date = /* @__PURE__ */ new Date();
          if (options.legacy) {
            if (typeof d === "number")
              date.setTime(d);
            else if (typeof d === "string")
              date.setTime(Date.parse(d));
            else if (typeof d === "bigint")
              date.setTime(Number(d));
            else
              throw new BSONRuntimeError(`Unrecognized type for EJSON date: ${typeof d}`);
          } else {
            if (typeof d === "string")
              date.setTime(Date.parse(d));
            else if (Long.isLong(d))
              date.setTime(d.toNumber());
            else if (typeof d === "number" && options.relaxed)
              date.setTime(d);
            else if (typeof d === "bigint")
              date.setTime(Number(d));
            else
              throw new BSONRuntimeError(`Unrecognized type for EJSON date: ${typeof d}`);
          }
          return date;
        }
        if (value.$code != null) {
          const copy = Object.assign({}, value);
          if (value.$scope) {
            copy.$scope = deserializeValue(value.$scope);
          }
          return Code.fromExtendedJSON(value);
        }
        if (isDBRefLike(value) || value.$dbPointer) {
          const v = value.$ref ? value : value.$dbPointer;
          if (v instanceof DBRef)
            return v;
          const dollarKeys = Object.keys(v).filter((k) => k.startsWith("$"));
          let valid = true;
          dollarKeys.forEach((k) => {
            if (["$ref", "$id", "$db"].indexOf(k) === -1)
              valid = false;
          });
          if (valid)
            return DBRef.fromExtendedJSON(v);
        }
        return value;
      }
      function serializeArray(array, options) {
        return array.map((v, index) => {
          options.seenObjects.push({ propertyName: `index ${index}`, obj: null });
          try {
            return serializeValue(v, options);
          } finally {
            options.seenObjects.pop();
          }
        });
      }
      function getISOString(date) {
        const isoStr = date.toISOString();
        return date.getUTCMilliseconds() !== 0 ? isoStr : isoStr.slice(0, -5) + "Z";
      }
      function serializeValue(value, options) {
        if (value instanceof Map || isMap(value)) {
          const obj = /* @__PURE__ */ Object.create(null);
          for (const [k, v] of value) {
            if (typeof k !== "string") {
              throw new BSONError("Can only serialize maps with string keys");
            }
            obj[k] = v;
          }
          return serializeValue(obj, options);
        }
        if ((typeof value === "object" || typeof value === "function") && value !== null) {
          const index = options.seenObjects.findIndex((entry) => entry.obj === value);
          if (index !== -1) {
            const props = options.seenObjects.map((entry) => entry.propertyName);
            const leadingPart = props.slice(0, index).map((prop) => `${prop} -> `).join("");
            const alreadySeen = props[index];
            const circularPart = " -> " + props.slice(index + 1, props.length - 1).map((prop) => `${prop} -> `).join("");
            const current = props[props.length - 1];
            const leadingSpace = " ".repeat(leadingPart.length + alreadySeen.length / 2);
            const dashes = "-".repeat(circularPart.length + (alreadySeen.length + current.length) / 2 - 1);
            throw new BSONError(`Converting circular structure to EJSON:
    ${leadingPart}${alreadySeen}${circularPart}${current}
    ${leadingSpace}\\${dashes}/`);
          }
          options.seenObjects[options.seenObjects.length - 1].obj = value;
        }
        if (Array.isArray(value))
          return serializeArray(value, options);
        if (value === void 0)
          return null;
        if (value instanceof Date || isDate(value)) {
          const dateNum = value.getTime(), inRange = dateNum > -1 && dateNum < 2534023188e5;
          if (options.legacy) {
            return options.relaxed && inRange ? { $date: value.getTime() } : { $date: getISOString(value) };
          }
          return options.relaxed && inRange ? { $date: getISOString(value) } : { $date: { $numberLong: value.getTime().toString() } };
        }
        if (typeof value === "number" && (!options.relaxed || !isFinite(value))) {
          if (Number.isInteger(value) && !Object.is(value, -0)) {
            if (value >= BSON_INT32_MIN && value <= BSON_INT32_MAX) {
              return { $numberInt: value.toString() };
            }
            if (value >= BSON_INT64_MIN && value <= BSON_INT64_MAX) {
              return { $numberLong: value.toString() };
            }
          }
          return { $numberDouble: Object.is(value, -0) ? "-0.0" : value.toString() };
        }
        if (typeof value === "bigint") {
          if (!options.relaxed) {
            return { $numberLong: BigInt.asIntN(64, value).toString() };
          }
          return Number(BigInt.asIntN(64, value));
        }
        if (value instanceof RegExp || isRegExp(value)) {
          let flags = value.flags;
          if (flags === void 0) {
            const match = value.toString().match(/[gimuy]*$/);
            if (match) {
              flags = match[0];
            }
          }
          const rx = new BSONRegExp(value.source, flags);
          return rx.toExtendedJSON(options);
        }
        if (value != null && typeof value === "object")
          return serializeDocument(value, options);
        return value;
      }
      var BSON_TYPE_MAPPINGS = {
        Binary: (o) => new Binary(o.value(), o.sub_type),
        Code: (o) => new Code(o.code, o.scope),
        DBRef: (o) => new DBRef(o.collection || o.namespace, o.oid, o.db, o.fields),
        Decimal128: (o) => new Decimal128(o.bytes),
        Double: (o) => new Double(o.value),
        Int32: (o) => new Int32(o.value),
        Long: (o) => Long.fromBits(o.low != null ? o.low : o.low_, o.low != null ? o.high : o.high_, o.low != null ? o.unsigned : o.unsigned_),
        MaxKey: () => new MaxKey(),
        MinKey: () => new MinKey(),
        ObjectId: (o) => new ObjectId(o),
        BSONRegExp: (o) => new BSONRegExp(o.pattern, o.options),
        BSONSymbol: (o) => new BSONSymbol(o.value),
        Timestamp: (o) => Timestamp.fromBits(o.low, o.high)
      };
      function serializeDocument(doc, options) {
        if (doc == null || typeof doc !== "object")
          throw new BSONError("not an object instance");
        const bsontype = doc._bsontype;
        if (typeof bsontype === "undefined") {
          const _doc = {};
          for (const name of Object.keys(doc)) {
            options.seenObjects.push({ propertyName: name, obj: null });
            try {
              const value = serializeValue(doc[name], options);
              if (name === "__proto__") {
                Object.defineProperty(_doc, name, {
                  value,
                  writable: true,
                  enumerable: true,
                  configurable: true
                });
              } else {
                _doc[name] = value;
              }
            } finally {
              options.seenObjects.pop();
            }
          }
          return _doc;
        } else if (doc != null && typeof doc === "object" && typeof doc._bsontype === "string" && doc[Symbol.for("@@mdb.bson.version")] !== BSON_MAJOR_VERSION) {
          throw new BSONVersionError();
        } else if (isBSONType(doc)) {
          let outDoc = doc;
          if (typeof outDoc.toExtendedJSON !== "function") {
            const mapper = BSON_TYPE_MAPPINGS[doc._bsontype];
            if (!mapper) {
              throw new BSONError("Unrecognized or invalid _bsontype: " + doc._bsontype);
            }
            outDoc = mapper(outDoc);
          }
          if (bsontype === "Code" && outDoc.scope) {
            outDoc = new Code(outDoc.code, serializeValue(outDoc.scope, options));
          } else if (bsontype === "DBRef" && outDoc.oid) {
            outDoc = new DBRef(serializeValue(outDoc.collection, options), serializeValue(outDoc.oid, options), serializeValue(outDoc.db, options), serializeValue(outDoc.fields, options));
          }
          return outDoc.toExtendedJSON(options);
        } else {
          throw new BSONError("_bsontype must be a string, but was: " + typeof bsontype);
        }
      }
      function parse(text, options) {
        const ejsonOptions = {
          useBigInt64: options?.useBigInt64 ?? false,
          relaxed: options?.relaxed ?? true,
          legacy: options?.legacy ?? false
        };
        return JSON.parse(text, (key, value) => {
          if (key.indexOf("\0") !== -1) {
            throw new BSONError(`BSON Document field names cannot contain null bytes, found: ${JSON.stringify(key)}`);
          }
          return deserializeValue(value, ejsonOptions);
        });
      }
      function stringify(value, replacer, space, options) {
        if (space != null && typeof space === "object") {
          options = space;
          space = 0;
        }
        if (replacer != null && typeof replacer === "object" && !Array.isArray(replacer)) {
          options = replacer;
          replacer = void 0;
          space = 0;
        }
        const serializeOptions = Object.assign({ relaxed: true, legacy: false }, options, {
          seenObjects: [{ propertyName: "(root)", obj: null }]
        });
        const doc = serializeValue(value, serializeOptions);
        return JSON.stringify(doc, replacer, space);
      }
      function EJSONserialize(value, options) {
        options = options || {};
        return JSON.parse(stringify(value, options));
      }
      function EJSONdeserialize(ejson, options) {
        options = options || {};
        return parse(JSON.stringify(ejson), options);
      }
      var EJSON = /* @__PURE__ */ Object.create(null);
      EJSON.parse = parse;
      EJSON.stringify = stringify;
      EJSON.serialize = EJSONserialize;
      EJSON.deserialize = EJSONdeserialize;
      Object.freeze(EJSON);
      var MAXSIZE = 1024 * 1024 * 17;
      var buffer = ByteUtils.allocate(MAXSIZE);
      function setInternalBufferSize(size) {
        if (buffer.length < size) {
          buffer = ByteUtils.allocate(size);
        }
      }
      function serialize(object, options = {}) {
        const checkKeys = typeof options.checkKeys === "boolean" ? options.checkKeys : false;
        const serializeFunctions = typeof options.serializeFunctions === "boolean" ? options.serializeFunctions : false;
        const ignoreUndefined = typeof options.ignoreUndefined === "boolean" ? options.ignoreUndefined : true;
        const minInternalBufferSize = typeof options.minInternalBufferSize === "number" ? options.minInternalBufferSize : MAXSIZE;
        if (buffer.length < minInternalBufferSize) {
          buffer = ByteUtils.allocate(minInternalBufferSize);
        }
        const serializationIndex = serializeInto(buffer, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined, null);
        const finishedBuffer = ByteUtils.allocate(serializationIndex);
        finishedBuffer.set(buffer.subarray(0, serializationIndex), 0);
        return finishedBuffer;
      }
      function serializeWithBufferAndIndex(object, finalBuffer, options = {}) {
        const checkKeys = typeof options.checkKeys === "boolean" ? options.checkKeys : false;
        const serializeFunctions = typeof options.serializeFunctions === "boolean" ? options.serializeFunctions : false;
        const ignoreUndefined = typeof options.ignoreUndefined === "boolean" ? options.ignoreUndefined : true;
        const startIndex = typeof options.index === "number" ? options.index : 0;
        const serializationIndex = serializeInto(buffer, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined, null);
        finalBuffer.set(buffer.subarray(0, serializationIndex), startIndex);
        return startIndex + serializationIndex - 1;
      }
      function deserialize2(buffer2, options = {}) {
        return internalDeserialize(ByteUtils.toLocalBufferType(buffer2), options);
      }
      function calculateObjectSize(object, options = {}) {
        options = options || {};
        const serializeFunctions = typeof options.serializeFunctions === "boolean" ? options.serializeFunctions : false;
        const ignoreUndefined = typeof options.ignoreUndefined === "boolean" ? options.ignoreUndefined : true;
        return internalCalculateObjectSize(object, serializeFunctions, ignoreUndefined);
      }
      function deserializeStream(data, startIndex, numberOfDocuments, documents, docStartIndex, options) {
        const internalOptions = Object.assign({ allowObjectSmallerThanBufferSize: true, index: 0 }, options);
        const bufferData = ByteUtils.toLocalBufferType(data);
        let index = startIndex;
        for (let i = 0; i < numberOfDocuments; i++) {
          const size = bufferData[index] | bufferData[index + 1] << 8 | bufferData[index + 2] << 16 | bufferData[index + 3] << 24;
          internalOptions.index = index;
          documents[docStartIndex + i] = internalDeserialize(bufferData, internalOptions);
          index = index + size;
        }
        return index;
      }
      var bson = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        BSONError,
        BSONRegExp,
        BSONRuntimeError,
        BSONSymbol,
        BSONType,
        BSONValue,
        BSONVersionError,
        Binary,
        Code,
        DBRef,
        Decimal128,
        Double,
        EJSON,
        Int32,
        Long,
        MaxKey,
        MinKey,
        ObjectId,
        Timestamp,
        UUID,
        calculateObjectSize,
        deserialize: deserialize2,
        deserializeStream,
        serialize,
        serializeWithBufferAndIndex,
        setInternalBufferSize
      });
      exports.BSON = bson;
      exports.BSONError = BSONError;
      exports.BSONRegExp = BSONRegExp;
      exports.BSONRuntimeError = BSONRuntimeError;
      exports.BSONSymbol = BSONSymbol;
      exports.BSONType = BSONType;
      exports.BSONValue = BSONValue;
      exports.BSONVersionError = BSONVersionError;
      exports.Binary = Binary;
      exports.Code = Code;
      exports.DBRef = DBRef;
      exports.Decimal128 = Decimal128;
      exports.Double = Double;
      exports.EJSON = EJSON;
      exports.Int32 = Int32;
      exports.Long = Long;
      exports.MaxKey = MaxKey;
      exports.MinKey = MinKey;
      exports.ObjectId = ObjectId;
      exports.Timestamp = Timestamp;
      exports.UUID = UUID;
      exports.calculateObjectSize = calculateObjectSize;
      exports.deserialize = deserialize2;
      exports.deserializeStream = deserializeStream;
      exports.serialize = serialize;
      exports.serializeWithBufferAndIndex = serializeWithBufferAndIndex;
      exports.setInternalBufferSize = setInternalBufferSize;
    }
  });

  // src/jsRunner/bundles/bsonPackage.ts
  var bsonPackage_exports = {};
  __export(bsonPackage_exports, {
    deserialize: () => deserialize,
    toJson: () => toJson
  });
  var deserialize = require_bson().deserialize;
  var toJson = require_bson().EJSON.deserialize;
  return __toCommonJS(bsonPackage_exports);
})();
