"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stream = require("stream");

class ReadableScan extends _stream.Readable {
  constructor(scanCommand, opt = {}) {
    super({
      objectMode: true
    });
    this._scanCommand = scanCommand;
    this._cursor = 0;
    this.opt = opt;
    this._drained = false;
  }

  _callScan() {
    const args = [this._cursor];

    if (this.opt.key) {
      args.unshift(this.opt.key);
    }

    if (this.opt.match) {
      args.push('MATCH', this.opt.match);
    }

    if (this.opt.count) {
      args.push('COUNT', this.opt.count);
    }

    return this._scanCommand(...args);
  }

  _read() {
    if (this._drained) {
      this.push(null);
      return;
    }

    this._callScan().then(res => {
      const [nextCursor, keys] = res;

      if (nextCursor === '0') {
        this._drained = true;
      } else {
        this._cursor = nextCursor;
      }

      if (keys.length > 0) this.push(keys);else this._read();
    }).catch(err => process.nextTick(() => this.emit('error', err)));
  }

}

exports.default = ReadableScan;