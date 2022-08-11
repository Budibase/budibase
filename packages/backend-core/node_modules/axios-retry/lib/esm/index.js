function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import isRetryAllowed from 'is-retry-allowed';
var namespace = 'axios-retry';
/**
 * @param  {Error}  error
 * @return {boolean}
 */

export function isNetworkError(error) {
  return !error.response && Boolean(error.code) && // Prevents retrying cancelled requests
  error.code !== 'ECONNABORTED' && // Prevents retrying timed out requests
  isRetryAllowed(error); // Prevents retrying unsafe errors
}
var SAFE_HTTP_METHODS = ['get', 'head', 'options'];
var IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(['put', 'delete']);
/**
 * @param  {Error}  error
 * @return {boolean}
 */

export function isRetryableError(error) {
  return error.code !== 'ECONNABORTED' && (!error.response || error.response.status >= 500 && error.response.status <= 599);
}
/**
 * @param  {Error}  error
 * @return {boolean}
 */

export function isSafeRequestError(error) {
  if (!error.config) {
    // Cannot determine if the request can be retried
    return false;
  }

  return isRetryableError(error) && SAFE_HTTP_METHODS.indexOf(error.config.method) !== -1;
}
/**
 * @param  {Error}  error
 * @return {boolean}
 */

export function isIdempotentRequestError(error) {
  if (!error.config) {
    // Cannot determine if the request can be retried
    return false;
  }

  return isRetryableError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1;
}
/**
 * @param  {Error}  error
 * @return {boolean}
 */

export function isNetworkOrIdempotentRequestError(error) {
  return isNetworkError(error) || isIdempotentRequestError(error);
}
/**
 * @return {number} - delay in milliseconds, always 0
 */

function noDelay() {
  return 0;
}
/**
 * @param  {number} [retryNumber=0]
 * @return {number} - delay in milliseconds
 */


export function exponentialDelay() {
  var retryNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var delay = Math.pow(2, retryNumber) * 100;
  var randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay

  return delay + randomSum;
}
/**
 * Initializes and returns the retry state for the given request/config
 * @param  {AxiosRequestConfig} config
 * @return {Object}
 */

function getCurrentState(config) {
  var currentState = config[namespace] || {};
  currentState.retryCount = currentState.retryCount || 0;
  config[namespace] = currentState;
  return currentState;
}
/**
 * Returns the axios-retry options for the current request
 * @param  {AxiosRequestConfig} config
 * @param  {AxiosRetryConfig} defaultOptions
 * @return {AxiosRetryConfig}
 */


function getRequestOptions(config, defaultOptions) {
  return _objectSpread(_objectSpread({}, defaultOptions), config[namespace]);
}
/**
 * @param  {Axios} axios
 * @param  {AxiosRequestConfig} config
 */


function fixConfig(axios, config) {
  if (axios.defaults.agent === config.agent) {
    delete config.agent;
  }

  if (axios.defaults.httpAgent === config.httpAgent) {
    delete config.httpAgent;
  }

  if (axios.defaults.httpsAgent === config.httpsAgent) {
    delete config.httpsAgent;
  }
}
/**
 * Checks retryCondition if request can be retried. Handles it's retruning value or Promise.
 * @param  {number} retries
 * @param  {Function} retryCondition
 * @param  {Object} currentState
 * @param  {Error} error
 * @return {boolean}
 */


function shouldRetry(_x, _x2, _x3, _x4) {
  return _shouldRetry.apply(this, arguments);
}
/**
 * Adds response interceptors to an axios instance to retry requests failed due to network issues
 *
 * @example
 *
 * import axios from 'axios';
 *
 * axiosRetry(axios, { retries: 3 });
 *
 * axios.get('http://example.com/test') // The first request fails and the second returns 'ok'
 *   .then(result => {
 *     result.data; // 'ok'
 *   });
 *
 * // Exponential back-off retry delay between requests
 * axiosRetry(axios, { retryDelay : axiosRetry.exponentialDelay});
 *
 * // Custom retry delay
 * axiosRetry(axios, { retryDelay : (retryCount) => {
 *   return retryCount * 1000;
 * }});
 *
 * // Also works with custom axios instances
 * const client = axios.create({ baseURL: 'http://example.com' });
 * axiosRetry(client, { retries: 3 });
 *
 * client.get('/test') // The first request fails and the second returns 'ok'
 *   .then(result => {
 *     result.data; // 'ok'
 *   });
 *
 * // Allows request-specific configuration
 * client
 *   .get('/test', {
 *     'axios-retry': {
 *       retries: 0
 *     }
 *   })
 *   .catch(error => { // The first request fails
 *     error !== undefined
 *   });
 *
 * @param {Axios} axios An axios instance (the axios object or one created from axios.create)
 * @param {Object} [defaultOptions]
 * @param {number} [defaultOptions.retries=3] Number of retries
 * @param {boolean} [defaultOptions.shouldResetTimeout=false]
 *        Defines if the timeout should be reset between retries
 * @param {Function} [defaultOptions.retryCondition=isNetworkOrIdempotentRequestError]
 *        A function to determine if the error can be retried
 * @param {Function} [defaultOptions.retryDelay=noDelay]
 *        A function to determine the delay between retry requests
 */


function _shouldRetry() {
  _shouldRetry = _asyncToGenerator(function* (retries, retryCondition, currentState, error) {
    var shouldRetryOrPromise = currentState.retryCount < retries && retryCondition(error); // This could be a promise

    if (typeof shouldRetryOrPromise === 'object') {
      try {
        var shouldRetryPromiseResult = yield shouldRetryOrPromise; // keep return true unless shouldRetryPromiseResult return false for compatibility

        return shouldRetryPromiseResult !== false;
      } catch (_err) {
        return false;
      }
    }

    return shouldRetryOrPromise;
  });
  return _shouldRetry.apply(this, arguments);
}

export default function axiosRetry(axios, defaultOptions) {
  axios.interceptors.request.use(config => {
    var currentState = getCurrentState(config);
    currentState.lastRequestTime = Date.now();
    return config;
  });
  axios.interceptors.response.use(null, /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (error) {
      var {
        config
      } = error; // If we have no information to retry the request

      if (!config) {
        return Promise.reject(error);
      }

      var {
        retries = 3,
        retryCondition = isNetworkOrIdempotentRequestError,
        retryDelay = noDelay,
        shouldResetTimeout = false
      } = getRequestOptions(config, defaultOptions);
      var currentState = getCurrentState(config);

      if (yield shouldRetry(retries, retryCondition, currentState, error)) {
        currentState.retryCount += 1;
        var delay = retryDelay(currentState.retryCount, error); // Axios fails merging this configuration to the default configuration because it has an issue
        // with circular structures: https://github.com/mzabriskie/axios/issues/370

        fixConfig(axios, config);

        if (!shouldResetTimeout && config.timeout && currentState.lastRequestTime) {
          var lastRequestDuration = Date.now() - currentState.lastRequestTime; // Minimum 1ms timeout (passing 0 or less to XHR means no timeout)

          config.timeout = Math.max(config.timeout - lastRequestDuration - delay, 1);
        }

        config.transformRequest = [data => data];
        return new Promise(resolve => setTimeout(() => resolve(axios(config)), delay));
      }

      return Promise.reject(error);
    });

    return function (_x5) {
      return _ref.apply(this, arguments);
    };
  }());
} // Compatibility with CommonJS

axiosRetry.isNetworkError = isNetworkError;
axiosRetry.isSafeRequestError = isSafeRequestError;
axiosRetry.isIdempotentRequestError = isIdempotentRequestError;
axiosRetry.isNetworkOrIdempotentRequestError = isNetworkOrIdempotentRequestError;
axiosRetry.exponentialDelay = exponentialDelay;
axiosRetry.isRetryableError = isRetryableError;
//# sourceMappingURL=index.js.map