/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* jshint maxlen: false */

'use strict';

var createAPIRequest = require('../../lib/apirequest');
var utils = require('../../lib/utils');

/**
 * Google Proximity Beacon API
 *
 * Registers, manages, indexes, and searches beacons.
 *
 * @example
 * var google = require('googleapis');
 * var proximitybeacon = google.proximitybeacon('v1beta1');
 *
 * @namespace proximitybeacon
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Proximitybeacon
 */
function Proximitybeacon(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.beacons = {

    /**
     * proximitybeacon.beacons.register
     *
     * @desc Registers a previously unregistered beacon given its `advertisedId`. These IDs are unique within the system. An ID can be registered only once. Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **Is owner** or **Can edit** permissions in the Google Developers Console project.
     *
     * @alias proximitybeacon.beacons.register
     * @memberOf! proximitybeacon(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.projectId The project id of the project the beacon will be registered to. If the project id is not specified then the project making the request is used. Optional.
     * @param {proximitybeacon(v1beta1).Beacon} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    register: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://proximitybeacon.googleapis.com/v1beta1/beacons:register',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * proximitybeacon.beacons.decommission
     *
     * @desc Decommissions the specified beacon in the service. This beacon will no longer be returned from `beaconinfo.getforobserved`. This operation is permanent -- you will not be able to re-register a beacon with this ID again. Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **Is owner** or **Can edit** permissions in the Google Developers Console project.
     *
     * @alias proximitybeacon.beacons.decommission
     * @memberOf! proximitybeacon(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.beaconName Beacon that should be decommissioned. A beacon name has the format "beacons/N!beaconId" where the beaconId is the base16 ID broadcast by the beacon and N is a code for the beacon's type. Possible values are `3` for Eddystone-UID, `4` for Eddystone-EID, `1` for iBeacon, or `5` for AltBeacon. For Eddystone-EID beacons, you may use either the current EID of the beacon's "stable" UID. Required.
     * @param {string=} params.projectId The project id of the beacon to decommission. If the project id is not specified then the project making the request is used. The project id must match the project that owns the beacon. Optional.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    decommission: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://proximitybeacon.googleapis.com/v1beta1/{beaconName}:decommission',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['beaconName'],
        pathParams: ['beaconName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * proximitybeacon.beacons.get
     *
     * @desc Returns detailed information about the specified beacon. Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **viewer**, **Is owner** or **Can edit** permissions in the Google Developers Console project. Requests may supply an Eddystone-EID beacon name in the form: `beacons/4!beaconId` where the `beaconId` is the base16 ephemeral ID broadcast by the beacon. The returned `Beacon` object will contain the beacon's stable Eddystone-UID. Clients not authorized to resolve the beacon's ephemeral Eddystone-EID broadcast will receive an error.
     *
     * @alias proximitybeacon.beacons.get
     * @memberOf! proximitybeacon(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.beaconName Resource name of this beacon. A beacon name has the format "beacons/N!beaconId" where the beaconId is the base16 ID broadcast by the beacon and N is a code for the beacon's type. Possible values are `3` for Eddystone-UID, `4` for Eddystone-EID, `1` for iBeacon, or `5` for AltBeacon. For Eddystone-EID beacons, you may use either the current EID or the beacon's "stable" UID. Required.
     * @param {string=} params.projectId The project id of the beacon to request. If the project id is not specified then the project making the request is used. The project id must match the project that owns the beacon. Optional.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://proximitybeacon.googleapis.com/v1beta1/{beaconName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['beaconName'],
        pathParams: ['beaconName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * proximitybeacon.beacons.list
     *
     * @desc Searches the beacon registry for beacons that match the given search criteria. Only those beacons that the client has permission to list will be returned. Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **viewer**, **Is owner** or **Can edit** permissions in the Google Developers Console project.
     *
     * @alias proximitybeacon.beacons.list
     * @memberOf! proximitybeacon(v1beta1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.q Filter query string that supports the following field filters: * `description:""` For example: `description:"Room 3"` Returns beacons whose description matches tokens in the string "Room 3" (not necessarily that exact string). The string must be double-quoted. * `status:` For example: `status:active` Returns beacons whose status matches the given value. Values must be one of the Beacon.Status enum values (case insensitive). Accepts multiple filters which will be combined with OR logic. * `stability:` For example: `stability:mobile` Returns beacons whose expected stability matches the given value. Values must be one of the Beacon.Stability enum values (case insensitive). Accepts multiple filters which will be combined with OR logic. * `place_id:""` For example: `place_id:"ChIJVSZzVR8FdkgRXGmmm6SslKw="` Returns beacons explicitly registered at the given place, expressed as a Place ID obtained from [Google Places API](/places/place-id). Does not match places inside the given place. Does not consider the beacon's actual location (which may be different from its registered place). Accepts multiple filters that will be combined with OR logic. The place ID must be double-quoted. * `registration_time[|=]` For example: `registration_time>=1433116800` Returns beacons whose registration time matches the given filter. Supports the operators: , =. Timestamp must be expressed as an integer number of seconds since midnight January 1, 1970 UTC. Accepts at most two filters that will be combined with AND logic, to support "between" semantics. If more than two are supplied, the latter ones are ignored. * `lat: lng: radius:` For example: `lat:51.1232343 lng:-1.093852 radius:1000` Returns beacons whose registered location is within the given circle. When any of these fields are given, all are required. Latitude and longitude must be decimal degrees between -90.0 and 90.0 and between -180.0 and 180.0 respectively. Radius must be an integer number of meters between 10 and 1,000,000 (1000 km). * `property:"="` For example: `property:"battery-type=CR2032"` Returns beacons which have a property of the given name and value. Supports multiple filters which will be combined with OR logic. The entire name=value string must be double-quoted as one string. * `attachment_type:""` For example: `attachment_type:"my-namespace/my-type"` Returns beacons having at least one attachment of the given namespaced type. Supports "any within this namespace" via the partial wildcard syntax: "my-namespace/x". Supports multiple filters which will be combined with OR logic. The string must be double-quoted. Multiple filters on the same field are combined with OR logic (except registration_time which is combined with AND logic). Multiple filters on different fields are combined with AND logic. Filters should be separated by spaces. As with any HTTP query string parameter, the whole filter expression must be URL-encoded. Example REST request: `GET /v1beta1/beacons?q=status:active%20lat:51.123%20lng:-1.095%20radius:1000`
     * @param {string=} params.pageToken A pagination token obtained from a previous request to list beacons.
     * @param {integer=} params.pageSize The maximum number of records to return for this request, up to a server-defined upper limit.
     * @param {string=} params.projectId The project id to list beacons under. If not present then the project credential that made the request is used as the project. Optional.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    list: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://proximitybeacon.googleapis.com/v1beta1/beacons',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * proximitybeacon.beacons.update
     *
     * @desc Updates the information about the specified beacon. **Any field that you do not populate in the submitted beacon will be permanently erased**, so you should follow the "read, modify, write" pattern to avoid inadvertently destroying data. Changes to the beacon status via this method will be silently ignored. To update beacon status, use the separate methods on this API for activation, deactivation, and decommissioning. Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **Is owner** or **Can edit** permissions in the Google Developers Console project.
     *
     * @alias proximitybeacon.beacons.update
     * @memberOf! proximitybeacon(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.beaconName Resource name of this beacon. A beacon name has the format "beacons/N!beaconId" where the beaconId is the base16 ID broadcast by the beacon and N is a code for the beacon's type. Possible values are `3` for Eddystone, `1` for iBeacon, or `5` for AltBeacon. This field must be left empty when registering. After reading a beacon, clients can use the name for future operations.
     * @param {string=} params.projectId The project id of the beacon to update. If the project id is not specified then the project making the request is used. The project id must match the project that owns the beacon. Optional.
     * @param {proximitybeacon(v1beta1).Beacon} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://proximitybeacon.googleapis.com/v1beta1/{beaconName}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['beaconName'],
        pathParams: ['beaconName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * proximitybeacon.beacons.activate
     *
     * @desc Activates a beacon. A beacon that is active will return information and attachment data when queried via `beaconinfo.getforobserved`. Calling this method on an already active beacon will do nothing (but will return a successful response code). Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **Is owner** or **Can edit** permissions in the Google Developers Console project.
     *
     * @alias proximitybeacon.beacons.activate
     * @memberOf! proximitybeacon(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.beaconName Beacon that should be activated. A beacon name has the format "beacons/N!beaconId" where the beaconId is the base16 ID broadcast by the beacon and N is a code for the beacon's type. Possible values are `3` for Eddystone-UID, `4` for Eddystone-EID, `1` for iBeacon, or `5` for AltBeacon. For Eddystone-EID beacons, you may use either the current EID or the beacon's "stable" UID. Required.
     * @param {string=} params.projectId The project id of the beacon to activate. If the project id is not specified then the project making the request is used. The project id must match the project that owns the beacon. Optional.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    activate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://proximitybeacon.googleapis.com/v1beta1/{beaconName}:activate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['beaconName'],
        pathParams: ['beaconName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * proximitybeacon.beacons.deactivate
     *
     * @desc Deactivates a beacon. Once deactivated, the API will not return information nor attachment data for the beacon when queried via `beaconinfo.getforobserved`. Calling this method on an already inactive beacon will do nothing (but will return a successful response code). Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **Is owner** or **Can edit** permissions in the Google Developers Console project.
     *
     * @alias proximitybeacon.beacons.deactivate
     * @memberOf! proximitybeacon(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.beaconName Beacon that should be deactivated. A beacon name has the format "beacons/N!beaconId" where the beaconId is the base16 ID broadcast by the beacon and N is a code for the beacon's type. Possible values are `3` for Eddystone-UID, `4` for Eddystone-EID, `1` for iBeacon, or `5` for AltBeacon. For Eddystone-EID beacons, you may use either the current EID or the beacon's "stable" UID. Required.
     * @param {string=} params.projectId The project id of the beacon to deactivate. If the project id is not specified then the project making the request is used. The project id must match the project that owns the beacon. Optional.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    deactivate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://proximitybeacon.googleapis.com/v1beta1/{beaconName}:deactivate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['beaconName'],
        pathParams: ['beaconName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    attachments: {

      /**
       * proximitybeacon.beacons.attachments.create
       *
       * @desc Associates the given data with the specified beacon. Attachment data must contain two parts:   - A namespaced type.  - The actual attachment data itself.  The namespaced type consists of two parts, the namespace and the type. The namespace must be one of the values returned by the `namespaces` endpoint, while the type can be a string of any characters except for the forward slash (`/`) up to 100 characters in length. Attachment data can be up to 1024 bytes long. Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **Is owner** or **Can edit** permissions in the Google Developers Console project.
       *
       * @alias proximitybeacon.beacons.attachments.create
       * @memberOf! proximitybeacon(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.beaconName Beacon on which the attachment should be created. A beacon name has the format "beacons/N!beaconId" where the beaconId is the base16 ID broadcast by the beacon and N is a code for the beacon's type. Possible values are `3` for Eddystone-UID, `4` for Eddystone-EID, `1` for iBeacon, or `5` for AltBeacon. For Eddystone-EID beacons, you may use either the current EID or the beacon's "stable" UID. Required.
       * @param {string=} params.projectId The project id of the project the attachment will belong to. If the project id is not specified then the project making the request is used. Optional.
       * @param {proximitybeacon(v1beta1).BeaconAttachment} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      create: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://proximitybeacon.googleapis.com/v1beta1/{beaconName}/attachments',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['beaconName'],
          pathParams: ['beaconName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * proximitybeacon.beacons.attachments.list
       *
       * @desc Returns the attachments for the specified beacon that match the specified namespaced-type pattern. To control which namespaced types are returned, you add the `namespacedType` query parameter to the request. You must either use `x/x`, to return all attachments, or the namespace must be one of the ones returned from the `namespaces` endpoint. Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **viewer**, **Is owner** or **Can edit** permissions in the Google Developers Console project.
       *
       * @alias proximitybeacon.beacons.attachments.list
       * @memberOf! proximitybeacon(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.beaconName Beacon whose attachments should be fetched. A beacon name has the format "beacons/N!beaconId" where the beaconId is the base16 ID broadcast by the beacon and N is a code for the beacon's type. Possible values are `3` for Eddystone-UID, `4` for Eddystone-EID, `1` for iBeacon, or `5` for AltBeacon. For Eddystone-EID beacons, you may use either the current EID or the beacon's "stable" UID. Required.
       * @param {string=} params.namespacedType Specifies the namespace and type of attachment to include in response in namespace/type format. Accepts `x/x` to specify "all types in all namespaces".
       * @param {string=} params.projectId The project id to list beacon attachments under. This field can be used when "*" is specified to mean all attachment namespaces. Projects may have multiple attachments with multiple namespaces. If "*" is specified and the projectId string is empty, then the project making the request is used. Optional.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      list: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://proximitybeacon.googleapis.com/v1beta1/{beaconName}/attachments',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['beaconName'],
          pathParams: ['beaconName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * proximitybeacon.beacons.attachments.delete
       *
       * @desc Deletes the specified attachment for the given beacon. Each attachment has a unique attachment name (`attachmentName`) which is returned when you fetch the attachment data via this API. You specify this with the delete request to control which attachment is removed. This operation cannot be undone. Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **Is owner** or **Can edit** permissions in the Google Developers Console project.
       *
       * @alias proximitybeacon.beacons.attachments.delete
       * @memberOf! proximitybeacon(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.attachmentName The attachment name (`attachmentName`) of the attachment to remove. For example: `beacons/3!893737abc9/attachments/c5e937-af0-494-959-ec49d12738`. For Eddystone-EID beacons, the beacon ID portion (`3!893737abc9`) may be the beacon's current EID, or its "stable" Eddystone-UID. Required.
       * @param {string=} params.projectId The project id of the attachment to delete. If not provided, the project that is making the request is used. Optional.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      delete: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://proximitybeacon.googleapis.com/v1beta1/{attachmentName}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['attachmentName'],
          pathParams: ['attachmentName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * proximitybeacon.beacons.attachments.batchDelete
       *
       * @desc Deletes multiple attachments on a given beacon. This operation is permanent and cannot be undone. You can optionally specify `namespacedType` to choose which attachments should be deleted. If you do not specify `namespacedType`, all your attachments on the given beacon will be deleted. You also may explicitly specify `x/x` to delete all. Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **Is owner** or **Can edit** permissions in the Google Developers Console project.
       *
       * @alias proximitybeacon.beacons.attachments.batchDelete
       * @memberOf! proximitybeacon(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.beaconName The beacon whose attachments should be deleted. A beacon name has the format "beacons/N!beaconId" where the beaconId is the base16 ID broadcast by the beacon and N is a code for the beacon's type. Possible values are `3` for Eddystone-UID, `4` for Eddystone-EID, `1` for iBeacon, or `5` for AltBeacon. For Eddystone-EID beacons, you may use either the current EID or the beacon's "stable" UID. Required.
       * @param {string=} params.namespacedType Specifies the namespace and type of attachments to delete in `namespace/type` format. Accepts `x/x` to specify "all types in all namespaces". Optional.
       * @param {string=} params.projectId The project id to delete beacon attachments under. This field can be used when "*" is specified to mean all attachment namespaces. Projects may have multiple attachments with multiple namespaces. If "*" is specified and the projectId string is empty, then the project making the request is used. Optional.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      batchDelete: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://proximitybeacon.googleapis.com/v1beta1/{beaconName}/attachments:batchDelete',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['beaconName'],
          pathParams: ['beaconName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    diagnostics: {

      /**
       * proximitybeacon.beacons.diagnostics.list
       *
       * @desc List the diagnostics for a single beacon. You can also list diagnostics for all the beacons owned by your Google Developers Console project by using the beacon name `beacons/-`. Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **viewer**, **Is owner** or **Can edit** permissions in the Google Developers Console project.
       *
       * @alias proximitybeacon.beacons.diagnostics.list
       * @memberOf! proximitybeacon(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.beaconName Beacon that the diagnostics are for.
       * @param {integer=} params.pageSize Specifies the maximum number of results to return. Defaults to 10. Maximum 1000. Optional.
       * @param {string=} params.pageToken Requests results that occur after the `page_token`, obtained from the response to a previous request. Optional.
       * @param {string=} params.alertFilter Requests only beacons that have the given alert. For example, to find beacons that have low batteries use `alert_filter=LOW_BATTERY`.
       * @param {string=} params.projectId Requests only diagnostic records for the given project id. If not set, then the project making the request will be used for looking up diagnostic records. Optional.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      list: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://proximitybeacon.googleapis.com/v1beta1/{beaconName}/diagnostics',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['beaconName'],
          pathParams: ['beaconName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.namespaces = {

    /**
     * proximitybeacon.namespaces.list
     *
     * @desc Lists all attachment namespaces owned by your Google Developers Console project. Attachment data associated with a beacon must include a namespaced type, and the namespace must be owned by your project. Authenticate using an [OAuth access token](https://developers.google.com/identity/protocols/OAuth2) from a signed-in user with **viewer**, **Is owner** or **Can edit** permissions in the Google Developers Console project.
     *
     * @alias proximitybeacon.namespaces.list
     * @memberOf! proximitybeacon(v1beta1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.projectId The project id to list namespaces under. Optional.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    list: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://proximitybeacon.googleapis.com/v1beta1/namespaces',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * proximitybeacon.namespaces.update
     *
     * @desc Updates the information about the specified namespace. Only the namespace visibility can be updated.
     *
     * @alias proximitybeacon.namespaces.update
     * @memberOf! proximitybeacon(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.namespaceName Resource name of this namespace. Namespaces names have the format: namespaces/namespace.
     * @param {string=} params.projectId The project id of the namespace to update. If the project id is not specified then the project making the request is used. The project id must match the project that owns the beacon. Optional.
     * @param {proximitybeacon(v1beta1).Namespace} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://proximitybeacon.googleapis.com/v1beta1/{namespaceName}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['namespaceName'],
        pathParams: ['namespaceName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.v1beta1 = {

    /**
     * proximitybeacon.getEidparams
     *
     * @desc Gets the Proximity Beacon API's current public key and associated parameters used to initiate the Diffie-Hellman key exchange required to register a beacon that broadcasts the Eddystone-EID format. This key changes periodically; clients may cache it and re-use the same public key to provision and register multiple beacons. However, clients should be prepared to refresh this key when they encounter an error registering an Eddystone-EID beacon.
     *
     * @alias proximitybeacon.getEidparams
     * @memberOf! proximitybeacon(v1beta1)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getEidparams: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://proximitybeacon.googleapis.com/v1beta1/eidparams',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.beaconinfo = {

    /**
     * proximitybeacon.beaconinfo.getforobserved
     *
     * @desc Given one or more beacon observations, returns any beacon information and attachments accessible to your application. Authorize by using the [API key](https://developers.google.com/beacons/proximity/how-tos/authorizing#APIKey) for the application.
     *
     * @alias proximitybeacon.beaconinfo.getforobserved
     * @memberOf! proximitybeacon(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {proximitybeacon(v1beta1).GetInfoForObservedBeaconsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getforobserved: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://proximitybeacon.googleapis.com/v1beta1/beaconinfo:getforobserved',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Beacon
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {string} beaconName Resource name of this beacon. A beacon name has the format &quot;beacons/N!beaconId&quot; where the beaconId is the base16 ID broadcast by the beacon and N is a code for the beacon&#39;s type. Possible values are `3` for Eddystone, `1` for iBeacon, or `5` for AltBeacon. This field must be left empty when registering. After reading a beacon, clients can use the name for future operations.
 * @property {proximitybeacon(v1beta1).AdvertisedId} advertisedId The identifier of a beacon as advertised by it. This field must be populated when registering. It may be empty when updating a beacon record because it is ignored in updates. When registering a beacon that broadcasts Eddystone-EID, this field should contain a &quot;stable&quot; Eddystone-UID that identifies the beacon and links it to its attachments. The stable Eddystone-UID is only used for administering the beacon.
 * @property {string} status Current status of the beacon. Required.
 * @property {string} placeId The [Google Places API](/places/place-id) Place ID of the place where the beacon is deployed. This is given when the beacon is registered or updated, not automatically detected in any way. Optional.
 * @property {proximitybeacon(v1beta1).LatLng} latLng The location of the beacon, expressed as a latitude and longitude pair. This location is given when the beacon is registered or updated. It does not necessarily indicate the actual current location of the beacon. Optional.
 * @property {proximitybeacon(v1beta1).IndoorLevel} indoorLevel The indoor level information for this beacon, if known. As returned by the Google Maps API. Optional.
 * @property {string} expectedStability Expected location stability. This is set when the beacon is registered or updated, not automatically detected in any way. Optional.
 * @property {string} description Free text used to identify and describe the beacon. Maximum length 140 characters. Optional.
 * @property {object} properties Properties of the beacon device, for example battery type or firmware version. Optional.
 * @property {proximitybeacon(v1beta1).EphemeralIdRegistration} ephemeralIdRegistration Write-only registration parameters for beacons using Eddystone-EID (remotely resolved ephemeral ID) format. This information will not be populated in API responses. When submitting this data, the `advertised_id` field must contain an ID of type Eddystone-UID. Any other ID type will result in an error.
 * @property {string} provisioningKey Some beacons may require a user to provide an authorization key before changing any of its configuration (e.g. broadcast frames, transmit power). This field provides a place to store and control access to that key. This field is populated in responses to `GET /v1beta1/beacons/3!beaconId` from users with write access to the given beacon. That is to say: If the user is authorized to write the beacon&#39;s confidential data in the service, the service considers them authorized to configure the beacon. Note that this key grants nothing on the service, only on the beacon itself.
 */
/**
 * @typedef AdvertisedId
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {string} type Specifies the identifier type. Required.
 * @property {string} id The actual beacon identifier, as broadcast by the beacon hardware. Must be [base64](http://tools.ietf.org/html/rfc4648#section-4) encoded in HTTP requests, and will be so encoded (with padding) in responses. The base64 encoding should be of the binary byte-stream and not any textual (such as hex) representation thereof. Required.
 */
/**
 * @typedef LatLng
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {number} latitude The latitude in degrees. It must be in the range [-90.0, +90.0].
 * @property {number} longitude The longitude in degrees. It must be in the range [-180.0, +180.0].
 */
/**
 * @typedef IndoorLevel
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {string} name The name of this level.
 */
/**
 * @typedef EphemeralIdRegistration
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {string} beaconEcdhPublicKey The beacon&#39;s public key used for the Elliptic curve Diffie-Hellman key exchange. When this field is populated, `service_ecdh_public_key` must also be populated, and `beacon_identity_key` must not be.
 * @property {string} serviceEcdhPublicKey The service&#39;s public key used for the Elliptic curve Diffie-Hellman key exchange. When this field is populated, `beacon_ecdh_public_key` must also be populated, and `beacon_identity_key` must not be.
 * @property {string} beaconIdentityKey The private key of the beacon. If this field is populated, `beacon_ecdh_public_key` and `service_ecdh_public_key` must not be populated.
 * @property {integer} rotationPeriodExponent Indicates the nominal period between each rotation of the beacon&#39;s ephemeral ID. &quot;Nominal&quot; because the beacon should randomize the actual interval. See [the spec at github](https://github.com/google/eddystone/tree/master/eddystone-eid) for details. This value corresponds to a power-of-two scaler on the beacon&#39;s clock: when the scaler value is K, the beacon will begin broadcasting a new ephemeral ID on average every 2^K seconds.
 * @property {string} initialClockValue The initial clock value of the beacon. The beacon&#39;s clock must have begun counting at this value immediately prior to transmitting this value to the resolving service. Significant delay in transmitting this value to the service risks registration or resolution failures. If a value is not provided, the default is zero.
 * @property {string} initialEid An initial ephemeral ID calculated using the clock value submitted as `initial_clock_value`, and the secret key generated by the Diffie-Hellman key exchange using `service_ecdh_public_key` and `service_ecdh_public_key`. This initial EID value will be used by the service to confirm that the key exchange process was successful.
 */
/**
 * @typedef Empty
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 */
/**
 * @typedef ListBeaconsResponse
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {proximitybeacon(v1beta1).Beacon[]} beacons The beacons that matched the search criteria.
 * @property {string} nextPageToken An opaque pagination token that the client may provide in their next request to retrieve the next page of results.
 * @property {string} totalCount Estimate of the total number of beacons matched by the query. Higher values may be less accurate.
 */
/**
 * @typedef BeaconAttachment
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {string} attachmentName Resource name of this attachment. Attachment names have the format: beacons/beacon_id/attachments/attachment_id. Leave this empty on creation.
 * @property {string} namespacedType Specifies what kind of attachment this is. Tells a client how to interpret the `data` field. Format is namespace/type. Namespace provides type separation between clients. Type describes the type of `data`, for use by the client when parsing the `data` field. Required.
 * @property {string} data An opaque data container for client-provided data. Must be [base64](http://tools.ietf.org/html/rfc4648#section-4) encoded in HTTP requests, and will be so encoded (with padding) in responses. Required.
 */
/**
 * @typedef ListBeaconAttachmentsResponse
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {proximitybeacon(v1beta1).BeaconAttachment[]} attachments The attachments that corresponded to the request params.
 */
/**
 * @typedef DeleteAttachmentsResponse
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {integer} numDeleted The number of attachments that were deleted.
 */
/**
 * @typedef ListNamespacesResponse
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {proximitybeacon(v1beta1).Namespace[]} namespaces The attachments that corresponded to the request params.
 */
/**
 * @typedef Namespace
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {string} namespaceName Resource name of this namespace. Namespaces names have the format: namespaces/namespace.
 * @property {string} servingVisibility Specifies what clients may receive attachments under this namespace via `beaconinfo.getforobserved`.
 */
/**
 * @typedef EphemeralIdRegistrationParams
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {string} serviceEcdhPublicKey The beacon service&#39;s public key for use by a beacon to derive its Identity Key using Elliptic Curve Diffie-Hellman key exchange.
 * @property {integer} minRotationPeriodExponent Indicates the minimum rotation period supported by the service. See EddystoneEidRegistration.rotation_period_exponent
 * @property {integer} maxRotationPeriodExponent Indicates the maximum rotation period supported by the service. See EddystoneEidRegistration.rotation_period_exponent
 */
/**
 * @typedef ListDiagnosticsResponse
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {proximitybeacon(v1beta1).Diagnostics[]} diagnostics The diagnostics matching the given request.
 * @property {string} nextPageToken Token that can be used for pagination. Returned only if the request matches more beacons than can be returned in this response.
 */
/**
 * @typedef Diagnostics
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {string} beaconName Resource name of the beacon. For Eddystone-EID beacons, this may be the beacon&#39;s current EID, or the beacon&#39;s &quot;stable&quot; Eddystone-UID.
 * @property {proximitybeacon(v1beta1).Date} estimatedLowBatteryDate The date when the battery is expected to be low. If the value is missing then there is no estimate for when the battery will be low. This value is only an estimate, not an exact date.
 * @property {string[]} alerts An unordered list of Alerts that the beacon has.
 */
/**
 * @typedef Date
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {integer} year Year of date. Must be from 1 to 9999, or 0 if specifying a date without a year.
 * @property {integer} month Month of year. Must be from 1 to 12.
 * @property {integer} day Day of month. Must be from 1 to 31 and valid for the year and month, or 0 if specifying a year/month where the day is not significant.
 */
/**
 * @typedef GetInfoForObservedBeaconsRequest
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {proximitybeacon(v1beta1).Observation[]} observations The beacons that the client has encountered. At least one must be given.
 * @property {string[]} namespacedTypes Specifies what kind of attachments to include in the response. When given, the response will include only attachments of the given types. When empty, no attachments will be returned. Must be in the format namespace/type. Accepts `*` to specify all types in all namespaces. Optional.
 */
/**
 * @typedef Observation
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {proximitybeacon(v1beta1).AdvertisedId} advertisedId The ID advertised by the beacon the client has encountered. Clients may submit an Eddystone-EID `advertised_id`. If the client is not authorized to resolve the given Eddystone-EID, no data will be returned for that beacon. Required.
 * @property {string} telemetry The array of telemetry bytes received from the beacon. The server is responsible for parsing it. This field may frequently be empty, as with a beacon that transmits telemetry only occasionally.
 * @property {string} timestampMs Time when the beacon was observed.
 */
/**
 * @typedef GetInfoForObservedBeaconsResponse
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {proximitybeacon(v1beta1).BeaconInfo[]} beacons Public information about beacons. May be empty if the request matched no beacons.
 */
/**
 * @typedef BeaconInfo
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {proximitybeacon(v1beta1).AdvertisedId} advertisedId The ID advertised by the beacon.
 * @property {string} beaconName The name under which the beacon is registered.
 * @property {proximitybeacon(v1beta1).AttachmentInfo[]} attachments Attachments matching the type(s) requested. May be empty if no attachment types were requested, or if none matched.
 */
/**
 * @typedef AttachmentInfo
 * @memberOf! proximitybeacon(v1beta1)
 * @type object
 * @property {string} namespacedType Specifies what kind of attachment this is. Tells a client how to interpret the `data` field. Format is namespace/type, for example scrupulous-wombat-12345/welcome-message
 * @property {string} data An opaque data container for client-provided data.
 */
module.exports = Proximitybeacon;
