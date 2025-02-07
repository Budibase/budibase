if (typeof btoa !== "function") {
  var chars = {
    ascii: function () {
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    },
    indices: function () {
      if (!this.cache) {
        this.cache = {}
        var ascii = chars.ascii()

        for (var c = 0; c < ascii.length; c++) {
          var chr = ascii[c]
          this.cache[chr] = c
        }
      }
      return this.cache
    },
  }

  function atob(b64) {
    var indices = chars.indices(),
      pos = b64.indexOf("="),
      padded = pos > -1,
      len = padded ? pos : b64.length,
      i = -1,
      data = ""

    while (i < len) {
      var code =
        (indices[b64[++i]] << 18) |
        (indices[b64[++i]] << 12) |
        (indices[b64[++i]] << 6) |
        indices[b64[++i]]
      if (code !== 0) {
        data += String.fromCharCode(
          (code >>> 16) & 255,
          (code >>> 8) & 255,
          code & 255
        )
      }
    }

    if (padded) {
      data = data.slice(0, pos - b64.length)
    }

    return data
  }

  function btoa(data) {
    var ascii = chars.ascii(),
      len = data.length - 1,
      i = -1,
      b64 = ""

    while (i < len) {
      var code =
        (data.charCodeAt(++i) << 16) |
        (data.charCodeAt(++i) << 8) |
        data.charCodeAt(++i)
      b64 +=
        ascii[(code >>> 18) & 63] +
        ascii[(code >>> 12) & 63] +
        ascii[(code >>> 6) & 63] +
        ascii[code & 63]
    }

    var pads = data.length % 3
    if (pads > 0) {
      b64 = b64.slice(0, pads - 3)

      while (b64.length % 4 !== 0) {
        b64 += "="
      }
    }

    return b64
  }
}

if (typeof TextDecoder === "undefined") {
  globalThis.TextDecoder = class {
    constructor(encoding = "utf8") {
      if (encoding !== "utf8") {
        throw new Error(
          `Only UTF-8 is supported in this polyfill. Recieved: ${encoding}`
        )
      }
    }
    decode(buffer) {
      return String.fromCharCode(...buffer)
    }
  }
}

if (typeof TextEncoder === "undefined") {
  globalThis.TextEncoder = class {
    encode(str) {
      const utf8 = []
      for (const i = 0; i < str.length; i++) {
        const codePoint = str.charCodeAt(i)

        if (codePoint < 0x80) {
          utf8.push(codePoint)
        } else if (codePoint < 0x800) {
          utf8.push(0xc0 | (codePoint >> 6))
          utf8.push(0x80 | (codePoint & 0x3f))
        } else if (codePoint < 0x10000) {
          utf8.push(0xe0 | (codePoint >> 12))
          utf8.push(0x80 | ((codePoint >> 6) & 0x3f))
          utf8.push(0x80 | (codePoint & 0x3f))
        } else {
          utf8.push(0xf0 | (codePoint >> 18))
          utf8.push(0x80 | ((codePoint >> 12) & 0x3f))
          utf8.push(0x80 | ((codePoint >> 6) & 0x3f))
          utf8.push(0x80 | (codePoint & 0x3f))
        }
      }
      return new Uint8Array(utf8)
    }
  }
}
