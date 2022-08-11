'use strict';

/**
 * Module: http-mock
 *
 *   The interface for this entire module that just exposes the exported
 *   functions from the other libraries.
 */

var request = require('./mockRequest');
var response = require('./mockResponse');
var express = require('./express/mock-express');

/**
 * Creates linked req and res objects. Enables using methods that require both
 * objects to interact, for example res.format.
 *
 * @param  {Object} reqOpts Options for req creation, see
 *                          @mockRequest.createRequest
 * @param  {Object} resOpts Options for res creation, see
 *                          @mockResponse.createResponse
 * @return {Object}         Object with both mocks: { req, res }
 */
var createRequestResponse = function (reqOpts, resOpts) {
    var req = request.createRequest(reqOpts);
    var res = response.createResponse(Object.assign({}, resOpts, { req: req }));

    return { req: req, res: res };
};

exports.createRequest = request.createRequest;
exports.createResponse = response.createResponse;
exports.createMocks = createRequestResponse;
exports.express = express;
