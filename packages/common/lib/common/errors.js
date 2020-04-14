"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorisedError = exports.BadRequestError = void 0;var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));function _createSuper(Derived) {return function () {var Super = (0, _getPrototypeOf2["default"])(Derived),result;if (_isNativeReflectConstruct()) {var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return (0, _possibleConstructorReturn2["default"])(this, result);};}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}var BadRequestError = /*#__PURE__*/function (_Error) {(0, _inherits2["default"])(BadRequestError, _Error);var _super = _createSuper(BadRequestError);
  function BadRequestError(message) {var _this;(0, _classCallCheck2["default"])(this, BadRequestError);
    _this = _super.call(this, message);
    _this.httpStatusCode = 400;return _this;
  }return BadRequestError;}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));exports.BadRequestError = BadRequestError;var


UnauthorisedError = /*#__PURE__*/function (_Error2) {(0, _inherits2["default"])(UnauthorisedError, _Error2);var _super2 = _createSuper(UnauthorisedError);
  function UnauthorisedError(message) {var _this2;(0, _classCallCheck2["default"])(this, UnauthorisedError);
    _this2 = _super2.call(this, message);
    _this2.httpStatusCode = 401;return _this2;
  }return UnauthorisedError;}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));exports.UnauthorisedError = UnauthorisedError;var


ForbiddenError = /*#__PURE__*/function (_Error3) {(0, _inherits2["default"])(ForbiddenError, _Error3);var _super3 = _createSuper(ForbiddenError);
  function ForbiddenError(message) {var _this3;(0, _classCallCheck2["default"])(this, ForbiddenError);
    _this3 = _super3.call(this, message);
    _this3.httpStatusCode = 403;return _this3;
  }return ForbiddenError;}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));exports.ForbiddenError = ForbiddenError;var


NotFoundError = /*#__PURE__*/function (_Error4) {(0, _inherits2["default"])(NotFoundError, _Error4);var _super4 = _createSuper(NotFoundError);
  function NotFoundError(message) {var _this4;(0, _classCallCheck2["default"])(this, NotFoundError);
    _this4 = _super4.call(this, message);
    _this4.httpStatusCode = 404;return _this4;
  }return NotFoundError;}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));exports.NotFoundError = NotFoundError;var


ConflictError = /*#__PURE__*/function (_Error5) {(0, _inherits2["default"])(ConflictError, _Error5);var _super5 = _createSuper(ConflictError);
  function ConflictError(message) {var _this5;(0, _classCallCheck2["default"])(this, ConflictError);
    _this5 = _super5.call(this, message);
    _this5.httpStatusCode = 409;return _this5;
  }return ConflictError;}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));exports.ConflictError = ConflictError;
//# sourceMappingURL=errors.js.map