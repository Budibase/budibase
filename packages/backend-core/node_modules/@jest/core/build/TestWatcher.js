'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _emittery() {
  const data = _interopRequireDefault(require('emittery'));

  _emittery = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

class TestWatcher extends _emittery().default {
  constructor({isWatchMode}) {
    super();

    _defineProperty(this, 'state', void 0);

    _defineProperty(this, '_isWatchMode', void 0);

    this.state = {
      interrupted: false
    };
    this._isWatchMode = isWatchMode;
  }

  async setState(state) {
    Object.assign(this.state, state);
    await this.emit('change', this.state);
  }

  isInterrupted() {
    return this.state.interrupted;
  }

  isWatchMode() {
    return this._isWatchMode;
  }
}

exports.default = TestWatcher;
