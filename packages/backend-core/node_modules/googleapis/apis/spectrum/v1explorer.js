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
 * Google Spectrum Database API
 *
 * API for spectrum-management functions.
 *
 * @example
 * var google = require('googleapis');
 * var spectrum = google.spectrum('v1explorer');
 *
 * @namespace spectrum
 * @type {Function}
 * @version v1explorer
 * @variation v1explorer
 * @param {object=} options Options for Spectrum
 */
function Spectrum(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.paws = {

    /**
     * spectrum.paws.getSpectrum
     *
     * @desc Requests information about the available spectrum for a device at a location. Requests from a fixed-mode device must include owner information so the device can be registered with the database.
     *
     * @alias spectrum.paws.getSpectrum
     * @memberOf! spectrum(v1explorer)
     *
     * @param {object} params Parameters for request
     * @param {spectrum(v1explorer).PawsGetSpectrumRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getSpectrum: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/spectrum/v1explorer/paws/getSpectrum',
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
     * spectrum.paws.getSpectrumBatch
     *
     * @desc The Google Spectrum Database does not support batch requests, so this method always yields an UNIMPLEMENTED error.
     *
     * @alias spectrum.paws.getSpectrumBatch
     * @memberOf! spectrum(v1explorer)
     *
     * @param {object} params Parameters for request
     * @param {spectrum(v1explorer).PawsGetSpectrumBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getSpectrumBatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/spectrum/v1explorer/paws/getSpectrumBatch',
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
     * spectrum.paws.init
     *
     * @desc Initializes the connection between a white space device and the database.
     *
     * @alias spectrum.paws.init
     * @memberOf! spectrum(v1explorer)
     *
     * @param {object} params Parameters for request
     * @param {spectrum(v1explorer).PawsInitRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    init: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/spectrum/v1explorer/paws/init',
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
     * spectrum.paws.notifySpectrumUse
     *
     * @desc Notifies the database that the device has selected certain frequency ranges for transmission. Only to be invoked when required by the regulator. The Google Spectrum Database does not operate in domains that require notification, so this always yields an UNIMPLEMENTED error.
     *
     * @alias spectrum.paws.notifySpectrumUse
     * @memberOf! spectrum(v1explorer)
     *
     * @param {object} params Parameters for request
     * @param {spectrum(v1explorer).PawsNotifySpectrumUseRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    notifySpectrumUse: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/spectrum/v1explorer/paws/notifySpectrumUse',
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
     * spectrum.paws.register
     *
     * @desc The Google Spectrum Database implements registration in the getSpectrum method. As such this always returns an UNIMPLEMENTED error.
     *
     * @alias spectrum.paws.register
     * @memberOf! spectrum(v1explorer)
     *
     * @param {object} params Parameters for request
     * @param {spectrum(v1explorer).PawsRegisterRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/spectrum/v1explorer/paws/register',
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
     * spectrum.paws.verifyDevice
     *
     * @desc Validates a device for white space use in accordance with regulatory rules. The Google Spectrum Database does not support master/slave configurations, so this always yields an UNIMPLEMENTED error.
     *
     * @alias spectrum.paws.verifyDevice
     * @memberOf! spectrum(v1explorer)
     *
     * @param {object} params Parameters for request
     * @param {spectrum(v1explorer).PawsVerifyDeviceRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    verifyDevice: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/spectrum/v1explorer/paws/verifyDevice',
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
 * @typedef AntennaCharacteristics
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {number} height The antenna height in meters. Whether the antenna height is required depends on the device type and the regulatory domain. Note that the height may be negative.
 * @property {string} heightType If the height is required, then the height type (AGL for above ground level or AMSL for above mean sea level) is also required. The default is AGL.
 * @property {number} heightUncertainty The height uncertainty in meters. Whether this is required depends on the regulatory domain.
 */
/**
 * @typedef DatabaseSpec
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {string} name The display name for a database.
 * @property {string} uri The corresponding URI of the database.
 */
/**
 * @typedef DbUpdateSpec
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {spectrum(v1explorer).DatabaseSpec[]} databases A required list of one or more databases. A device should update its preconfigured list of databases to replace (only) the database that provided the response with the specified entries.
 */
/**
 * @typedef DeviceCapabilities
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {spectrum(v1explorer).FrequencyRange[]} frequencyRanges An optional list of frequency ranges supported by the device. Each element must contain start and stop frequencies in which the device can operate. Channel identifiers are optional. When specified, the database should not return available spectrum that falls outside these ranges or channel IDs.
 */
/**
 * @typedef DeviceDescriptor
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {string} etsiEnDeviceCategory Specifies the ETSI white space device category. Valid values are the strings master and slave. This field is case-insensitive. Consult the ETSI documentation for details about the device types.
* @property {string} etsiEnDeviceEmissionsClass Specifies the ETSI white space device emissions class. The values are represented by numeric strings, such as 1, 2, etc. Consult the ETSI documentation for details about the device types.
* @property {string} etsiEnDeviceType Specifies the ETSI white space device type. Valid values are single-letter strings, such as A, B, etc. Consult the ETSI documentation for details about the device types.
* @property {string} etsiEnTechnologyId Specifies the ETSI white space device technology identifier. The string value must not exceed 64 characters in length. Consult the ETSI documentation for details about the device types.
* @property {string} fccId Specifies the device&#39;s FCC certification identifier. The value is an identifier string whose length should not exceed 32 characters. Note that, in practice, a valid FCC ID may be limited to 19 characters.
* @property {string} fccTvbdDeviceType Specifies the TV Band White Space device type, as defined by the FCC. Valid values are FIXED, MODE_1, MODE_2.
* @property {string} manufacturerId The manufacturer&#39;s ID may be required by the regulatory domain. This should represent the name of the device manufacturer, should be consistent across all devices from the same manufacturer, and should be distinct from that of other manufacturers. The string value must not exceed 64 characters in length.
* @property {string} modelId The device&#39;s model ID may be required by the regulatory domain. The string value must not exceed 64 characters in length.
* @property {string[]} rulesetIds The list of identifiers for rulesets supported by the device. A database may require that the device provide this list before servicing the device requests. If the database does not support any of the rulesets specified in the list, the database may refuse to service the device requests. If present, the list must contain at least one entry.

For information about the valid requests, see section 9.2 of the PAWS specification. Currently, FccTvBandWhiteSpace-2010 is the only supported ruleset.
* @property {string} serialNumber The manufacturer&#39;s device serial number; required by the applicable regulatory domain. The length of the value must not exceed 64 characters.
*/
/**
 * @typedef DeviceOwner
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {spectrum(v1explorer).Vcard} operator The vCard contact information for the device operator is optional, but may be required by specific regulatory domains.
 * @property {spectrum(v1explorer).Vcard} owner The vCard contact information for the individual or business that owns the device is required.
 */
/**
 * @typedef DeviceValidity
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {spectrum(v1explorer).DeviceDescriptor} deviceDesc The descriptor of the device for which the validity check was requested. It will always be present.
 * @property {boolean} isValid The validity status: true if the device is valid for operation, false otherwise. It will always be present.
 * @property {string} reason If the device identifier is not valid, the database may include a reason. The reason may be in any language. The length of the value should not exceed 128 characters.
 */
/**
 * @typedef EventTime
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {string} startTime The inclusive start of the event. It will be present.
 * @property {string} stopTime The exclusive end of the event. It will be present.
 */
/**
 * @typedef FrequencyRange
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {string} channelId The database may include a channel identifier, when applicable. When it is included, the device should treat it as informative. The length of the identifier should not exceed 16 characters.
 * @property {number} maxPowerDBm The maximum total power level (EIRP)—computed over the corresponding operating bandwidth—that is permitted within the frequency range. Depending on the context in which the frequency-range element appears, this value may be required. For example, it is required in the available-spectrum response, available-spectrum-batch response, and spectrum-use notification message, but it should not be present (it is not applicable) when the frequency range appears inside a device-capabilities message.
 * @property {number} startHz The required inclusive start of the frequency range (in Hertz).
 * @property {number} stopHz The required exclusive end of the frequency range (in Hertz).
 */
/**
 * @typedef GeoLocation
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {integer} confidence The location confidence level, as an integer percentage, may be required, depending on the regulatory domain. When the parameter is optional and not provided, its value is assumed to be 95. Valid values range from 0 to 99, since, in practice, 100-percent confidence is not achievable. The confidence value is meaningful only when geolocation refers to a point with uncertainty.
 * @property {spectrum(v1explorer).GeoLocationEllipse} point If present, indicates that the geolocation represents a point. Paradoxically, a point is parameterized using an ellipse, where the center represents the location of the point and the distances along the major and minor axes represent the uncertainty. The uncertainty values may be required, depending on the regulatory domain.
 * @property {spectrum(v1explorer).GeoLocationPolygon} region If present, indicates that the geolocation represents a region. Database support for regions is optional.
 */
/**
 * @typedef GeoLocationEllipse
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {spectrum(v1explorer).GeoLocationPoint} center A required geo-spatial point representing the center of the ellipse.
 * @property {number} orientation A floating-point number that expresses the orientation of the ellipse, representing the rotation, in degrees, of the semi-major axis from North towards the East. For example, when the uncertainty is greatest along the North-South direction, orientation is 0 degrees; conversely, if the uncertainty is greatest along the East-West direction, orientation is 90 degrees. When orientation is not present, the orientation is assumed to be 0.
 * @property {number} semiMajorAxis A floating-point number that expresses the location uncertainty along the major axis of the ellipse. May be required by the regulatory domain. When the uncertainty is optional, the default value is 0.
 * @property {number} semiMinorAxis A floating-point number that expresses the location uncertainty along the minor axis of the ellipse. May be required by the regulatory domain. When the uncertainty is optional, the default value is 0.
 */
/**
 * @typedef GeoLocationPoint
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {number} latitude A required floating-point number that expresses the latitude in degrees using the WGS84 datum. For details on this encoding, see the National Imagery and Mapping Agency&#39;s Technical Report TR8350.2.
 * @property {number} longitude A required floating-point number that expresses the longitude in degrees using the WGS84 datum. For details on this encoding, see the National Imagery and Mapping Agency&#39;s Technical Report TR8350.2.
 */
/**
 * @typedef GeoLocationPolygon
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {spectrum(v1explorer).GeoLocationPoint[]} exterior When the geolocation describes a region, the exterior field refers to a list of latitude/longitude points that represent the vertices of a polygon. The first and last points must be the same. Thus, a minimum of four points is required. The following polygon restrictions from RFC5491 apply:  
- A connecting line shall not cross another connecting line of the same polygon. 
- The vertices must be defined in a counterclockwise order. 
- The edges of a polygon are defined by the shortest path between two points in space (not a geodesic curve). Consequently, the length between two adjacent vertices should be restricted to a maximum of 130 km. 
- All vertices are assumed to be at the same altitude. 
- Polygon shapes should be restricted to a maximum of 15 vertices (16 points that include the repeated vertex).
*/
/**
 * @typedef GeoSpectrumSchedule
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {spectrum(v1explorer).GeoLocation} location The geolocation identifies the location at which the spectrum schedule applies. It will always be present.
 * @property {spectrum(v1explorer).SpectrumSchedule[]} spectrumSchedules A list of available spectrum profiles and associated times. It will always be present, and at least one schedule must be included (though it may be empty if there is no available spectrum). More than one schedule may be included to represent future changes to the available spectrum.
 */
/**
 * @typedef PawsGetSpectrumBatchRequest
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {spectrum(v1explorer).AntennaCharacteristics} antenna Depending on device type and regulatory domain, antenna characteristics may be required.
* @property {spectrum(v1explorer).DeviceCapabilities} capabilities The master device may include its device capabilities to limit the available-spectrum batch response to the spectrum that is compatible with its capabilities. The database should not return spectrum that is incompatible with the specified capabilities.
* @property {spectrum(v1explorer).DeviceDescriptor} deviceDesc When the available spectrum request is made on behalf of a specific device (a master or slave device), device descriptor information for the device on whose behalf the request is made is required (in such cases, the requestType parameter must be empty). When a requestType value is specified, device descriptor information may be optional or required according to the rules of the applicable regulatory domain.
* @property {spectrum(v1explorer).GeoLocation[]} locations A geolocation list is required. This allows a device to specify its current location plus additional anticipated locations when allowed by the regulatory domain. At least one location must be included. Geolocation must be given as the location of the radiation center of the device&#39;s antenna. If a location specifies a region, rather than a point, the database may return an UNIMPLEMENTED error if it does not support query by region.

There is no upper limit on the number of locations included in a available spectrum batch request, but the database may restrict the number of locations it supports by returning a response with fewer locations than specified in the batch request. Note that geolocations must be those of the master device (a device with geolocation capability that makes an available spectrum batch request), whether the master device is making the request on its own behalf or on behalf of a slave device (one without geolocation capability).
* @property {spectrum(v1explorer).DeviceDescriptor} masterDeviceDesc When an available spectrum batch request is made by the master device (a device with geolocation capability) on behalf of a slave device (a device without geolocation capability), the rules of the applicable regulatory domain may require the master device to provide its own device descriptor information (in addition to device descriptor information for the slave device in a separate parameter).
* @property {spectrum(v1explorer).DeviceOwner} owner Depending on device type and regulatory domain, device owner information may be included in an available spectrum batch request. This allows the device to register and get spectrum-availability information in a single request.
* @property {string} requestType The request type parameter is an optional parameter that can be used to modify an available spectrum batch request, but its use depends on applicable regulatory rules. For example, It may be used to request generic slave device parameters without having to specify the device descriptor for a specific device. When the requestType parameter is missing, the request is for a specific device (master or slave), and the device descriptor parameter for the device on whose behalf the batch request is made is required.
* @property {string} type The message type (e.g., INIT_REQ, AVAIL_SPECTRUM_REQ, ...).

Required field.
* @property {string} version The PAWS version. Must be exactly 1.0.

Required field.
*/
/**
 * @typedef PawsGetSpectrumBatchResponse
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {spectrum(v1explorer).DbUpdateSpec} databaseChange A database may include the databaseChange parameter to notify a device of a change to its database URI, providing one or more alternate database URIs. The device should use this information to update its list of pre-configured databases by (only) replacing its entry for the responding database with the list of alternate URIs.
* @property {spectrum(v1explorer).DeviceDescriptor} deviceDesc The database must return in its available spectrum response the device descriptor information it received in the master device&#39;s available spectrum batch request.
* @property {spectrum(v1explorer).GeoSpectrumSchedule[]} geoSpectrumSchedules The available spectrum batch response must contain a geo-spectrum schedule list, The list may be empty if spectrum is not available. The database may return more than one geo-spectrum schedule to represent future changes to the available spectrum. How far in advance a schedule may be provided depends upon the applicable regulatory domain. The database may return available spectrum for fewer geolocations than requested. The device must not make assumptions about the order of the entries in the list, and must use the geolocation value in each geo-spectrum schedule entry to match available spectrum to a location.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;spectrum#pawsGetSpectrumBatchResponse&quot;.
* @property {number} maxContiguousBwHz The database may return a constraint on the allowed maximum contiguous bandwidth (in Hertz). A regulatory domain may require the database to return this parameter. When this parameter is present in the response, the device must apply this constraint to its spectrum-selection logic to ensure that no single block of spectrum has bandwidth that exceeds this value.
* @property {number} maxTotalBwHz The database may return a constraint on the allowed maximum total bandwidth (in Hertz), which does not need to be contiguous. A regulatory domain may require the database to return this parameter. When this parameter is present in the available spectrum batch response, the device must apply this constraint to its spectrum-selection logic to ensure that total bandwidth does not exceed this value.
* @property {boolean} needsSpectrumReport For regulatory domains that require a spectrum-usage report from devices, the database must return true for this parameter if the geo-spectrum schedules list is not empty; otherwise, the database should either return false or omit this parameter. If this parameter is present and its value is true, the device must send a spectrum use notify message to the database; otherwise, the device should not send the notification.
* @property {spectrum(v1explorer).RulesetInfo} rulesetInfo The database should return ruleset information, which identifies the applicable regulatory authority and ruleset for the available spectrum batch response. If included, the device must use the corresponding ruleset to interpret the response. Values provided in the returned ruleset information, such as maxLocationChange, take precedence over any conflicting values provided in the ruleset information returned in a prior initialization response sent by the database to the device.
* @property {string} timestamp The database includes a timestamp of the form, YYYY-MM-DDThh:mm:ssZ (Internet timestamp format per RFC3339), in its available spectrum batch response. The timestamp should be used by the device as a reference for the start and stop times specified in the response spectrum schedules.
* @property {string} type The message type (e.g., INIT_REQ, AVAIL_SPECTRUM_REQ, ...).

Required field.
* @property {string} version The PAWS version. Must be exactly 1.0.

Required field.
*/
/**
 * @typedef PawsGetSpectrumRequest
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {spectrum(v1explorer).AntennaCharacteristics} antenna Depending on device type and regulatory domain, the characteristics of the antenna may be required.
* @property {spectrum(v1explorer).DeviceCapabilities} capabilities The master device may include its device capabilities to limit the available-spectrum response to the spectrum that is compatible with its capabilities. The database should not return spectrum that is incompatible with the specified capabilities.
* @property {spectrum(v1explorer).DeviceDescriptor} deviceDesc When the available spectrum request is made on behalf of a specific device (a master or slave device), device descriptor information for that device is required (in such cases, the requestType parameter must be empty). When a requestType value is specified, device descriptor information may be optional or required according to the rules of the applicable regulatory domain.
* @property {spectrum(v1explorer).GeoLocation} location The geolocation of the master device (a device with geolocation capability that makes an available spectrum request) is required whether the master device is making the request on its own behalf or on behalf of a slave device (one without geolocation capability). The location must be the location of the radiation center of the master device&#39;s antenna. To support mobile devices, a regulatory domain may allow the anticipated position of the master device to be given instead. If the location specifies a region, rather than a point, the database may return an UNIMPLEMENTED error code if it does not support query by region.
* @property {spectrum(v1explorer).DeviceDescriptor} masterDeviceDesc When an available spectrum request is made by the master device (a device with geolocation capability) on behalf of a slave device (a device without geolocation capability), the rules of the applicable regulatory domain may require the master device to provide its own device descriptor information (in addition to device descriptor information for the slave device, which is provided in a separate parameter).
* @property {spectrum(v1explorer).DeviceOwner} owner Depending on device type and regulatory domain, device owner information may be included in an available spectrum request. This allows the device to register and get spectrum-availability information in a single request.
* @property {string} requestType The request type parameter is an optional parameter that can be used to modify an available spectrum request, but its use depends on applicable regulatory rules. It may be used, for example, to request generic slave device parameters without having to specify the device descriptor for a specific device. When the requestType parameter is missing, the request is for a specific device (master or slave), and the deviceDesc parameter for the device on whose behalf the request is made is required.
* @property {string} type The message type (e.g., INIT_REQ, AVAIL_SPECTRUM_REQ, ...).

Required field.
* @property {string} version The PAWS version. Must be exactly 1.0.

Required field.
*/
/**
 * @typedef PawsGetSpectrumResponse
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {spectrum(v1explorer).DbUpdateSpec} databaseChange A database may include the databaseChange parameter to notify a device of a change to its database URI, providing one or more alternate database URIs. The device should use this information to update its list of pre-configured databases by (only) replacing its entry for the responding database with the list of alternate URIs.
* @property {spectrum(v1explorer).DeviceDescriptor} deviceDesc The database must return, in its available spectrum response, the device descriptor information it received in the master device&#39;s available spectrum request.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;spectrum#pawsGetSpectrumResponse&quot;.
* @property {number} maxContiguousBwHz The database may return a constraint on the allowed maximum contiguous bandwidth (in Hertz). A regulatory domain may require the database to return this parameter. When this parameter is present in the response, the device must apply this constraint to its spectrum-selection logic to ensure that no single block of spectrum has bandwidth that exceeds this value.
* @property {number} maxTotalBwHz The database may return a constraint on the allowed maximum total bandwidth (in Hertz), which need not be contiguous. A regulatory domain may require the database to return this parameter. When this parameter is present in the available spectrum response, the device must apply this constraint to its spectrum-selection logic to ensure that total bandwidth does not exceed this value.
* @property {boolean} needsSpectrumReport For regulatory domains that require a spectrum-usage report from devices, the database must return true for this parameter if the spectrum schedule list is not empty; otherwise, the database will either return false or omit this parameter. If this parameter is present and its value is true, the device must send a spectrum use notify message to the database; otherwise, the device must not send the notification.
* @property {spectrum(v1explorer).RulesetInfo} rulesetInfo The database should return ruleset information, which identifies the applicable regulatory authority and ruleset for the available spectrum response. If included, the device must use the corresponding ruleset to interpret the response. Values provided in the returned ruleset information, such as maxLocationChange, take precedence over any conflicting values provided in the ruleset information returned in a prior initialization response sent by the database to the device.
* @property {spectrum(v1explorer).SpectrumSchedule[]} spectrumSchedules The available spectrum response must contain a spectrum schedule list. The list may be empty if spectrum is not available. The database may return more than one spectrum schedule to represent future changes to the available spectrum. How far in advance a schedule may be provided depends on the applicable regulatory domain.
* @property {string} timestamp The database includes a timestamp of the form YYYY-MM-DDThh:mm:ssZ (Internet timestamp format per RFC3339) in its available spectrum response. The timestamp should be used by the device as a reference for the start and stop times specified in the response spectrum schedules.
* @property {string} type The message type (e.g., INIT_REQ, AVAIL_SPECTRUM_REQ, ...).

Required field.
* @property {string} version The PAWS version. Must be exactly 1.0.

Required field.
*/
/**
 * @typedef PawsInitRequest
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {spectrum(v1explorer).DeviceDescriptor} deviceDesc The DeviceDescriptor parameter is required. If the database does not support the device or any of the rulesets specified in the device descriptor, it must return an UNSUPPORTED error code in the error response.
* @property {spectrum(v1explorer).GeoLocation} location A device&#39;s geolocation is required.
* @property {string} type The message type (e.g., INIT_REQ, AVAIL_SPECTRUM_REQ, ...).

Required field.
* @property {string} version The PAWS version. Must be exactly 1.0.

Required field.
*/
/**
 * @typedef PawsInitResponse
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {spectrum(v1explorer).DbUpdateSpec} databaseChange A database may include the databaseChange parameter to notify a device of a change to its database URI, providing one or more alternate database URIs. The device should use this information to update its list of pre-configured databases by (only) replacing its entry for the responding database with the list of alternate URIs.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;spectrum#pawsInitResponse&quot;.
* @property {spectrum(v1explorer).RulesetInfo} rulesetInfo The rulesetInfo parameter must be included in the response. This parameter specifies the regulatory domain and parameters applicable to that domain. The database must include the authority field, which defines the regulatory domain for the location specified in the INIT_REQ message.
* @property {string} type The message type (e.g., INIT_REQ, AVAIL_SPECTRUM_REQ, ...).

Required field.
* @property {string} version The PAWS version. Must be exactly 1.0.

Required field.
*/
/**
 * @typedef PawsNotifySpectrumUseRequest
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {spectrum(v1explorer).DeviceDescriptor} deviceDesc Device descriptor information is required in the spectrum-use notification message.
* @property {spectrum(v1explorer).GeoLocation} location The geolocation of the master device (the device that is sending the spectrum-use notification) to the database is required in the spectrum-use notification message.
* @property {spectrum(v1explorer).SpectrumMessage[]} spectra A spectrum list is required in the spectrum-use notification. The list specifies the spectrum that the device expects to use, which includes frequency ranges and maximum power levels. The list may be empty if the device decides not to use any of spectrum. For consistency, the psdBandwidthHz value should match that from one of the spectrum elements in the corresponding available spectrum response previously sent to the device by the database. Note that maximum power levels in the spectrum element must be expressed as power spectral density over the specified psdBandwidthHz value. The actual bandwidth to be used (as computed from the start and stop frequencies) may be different from the psdBandwidthHz value. As an example, when regulatory rules express maximum power spectral density in terms of maximum power over any 100 kHz band, then the psdBandwidthHz value should be set to 100 kHz, even though the actual bandwidth used can be 20 kHz.
* @property {string} type The message type (e.g., INIT_REQ, AVAIL_SPECTRUM_REQ, ...).

Required field.
* @property {string} version The PAWS version. Must be exactly 1.0.

Required field.
*/
/**
 * @typedef PawsNotifySpectrumUseResponse
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;spectrum#pawsNotifySpectrumUseResponse&quot;.
* @property {string} type The message type (e.g., INIT_REQ, AVAIL_SPECTRUM_REQ, ...).

Required field.
* @property {string} version The PAWS version. Must be exactly 1.0.

Required field.
*/
/**
 * @typedef PawsRegisterRequest
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {spectrum(v1explorer).AntennaCharacteristics} antenna Antenna characteristics, including its height and height type.
* @property {spectrum(v1explorer).DeviceDescriptor} deviceDesc A DeviceDescriptor is required.
* @property {spectrum(v1explorer).DeviceOwner} deviceOwner Device owner information is required.
* @property {spectrum(v1explorer).GeoLocation} location A device&#39;s geolocation is required.
* @property {string} type The message type (e.g., INIT_REQ, AVAIL_SPECTRUM_REQ, ...).

Required field.
* @property {string} version The PAWS version. Must be exactly 1.0.

Required field.
*/
/**
 * @typedef PawsRegisterResponse
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {spectrum(v1explorer).DbUpdateSpec} databaseChange A database may include the databaseChange parameter to notify a device of a change to its database URI, providing one or more alternate database URIs. The device should use this information to update its list of pre-configured databases by (only) replacing its entry for the responding database with the list of alternate URIs.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;spectrum#pawsRegisterResponse&quot;.
* @property {string} type The message type (e.g., INIT_REQ, AVAIL_SPECTRUM_REQ, ...).

Required field.
* @property {string} version The PAWS version. Must be exactly 1.0.

Required field.
*/
/**
 * @typedef PawsVerifyDeviceRequest
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {spectrum(v1explorer).DeviceDescriptor[]} deviceDescs A list of device descriptors, which specifies the slave devices to be validated, is required.
* @property {string} type The message type (e.g., INIT_REQ, AVAIL_SPECTRUM_REQ, ...).

Required field.
* @property {string} version The PAWS version. Must be exactly 1.0.

Required field.
*/
/**
 * @typedef PawsVerifyDeviceResponse
 * @memberOf! spectrum(v1explorer)
 * @type object
* @property {spectrum(v1explorer).DbUpdateSpec} databaseChange A database may include the databaseChange parameter to notify a device of a change to its database URI, providing one or more alternate database URIs. The device should use this information to update its list of pre-configured databases by (only) replacing its entry for the responding database with the list of alternate URIs.
* @property {spectrum(v1explorer).DeviceValidity[]} deviceValidities A device validities list is required in the device validation response to report whether each slave device listed in a previous device validation request is valid. The number of entries must match the number of device descriptors listed in the previous device validation request.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;spectrum#pawsVerifyDeviceResponse&quot;.
* @property {string} type The message type (e.g., INIT_REQ, AVAIL_SPECTRUM_REQ, ...).

Required field.
* @property {string} version The PAWS version. Must be exactly 1.0.

Required field.
*/
/**
 * @typedef RulesetInfo
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {string} authority The regulatory domain to which the ruleset belongs is required. It must be a 2-letter country code. The device should use this to determine additional device behavior required by the associated regulatory domain.
 * @property {number} maxLocationChange The maximum location change in meters is required in the initialization response, but optional otherwise. When the device changes location by more than this specified distance, it must contact the database to get the available spectrum for the new location. If the device is using spectrum that is no longer available, it must immediately cease use of the spectrum under rules for database-managed spectrum. If this value is provided within the context of an available-spectrum response, it takes precedence over the value within the initialization response.
 * @property {integer} maxPollingSecs The maximum duration, in seconds, between requests for available spectrum. It is required in the initialization response, but optional otherwise. The device must contact the database to get available spectrum no less frequently than this duration. If the new spectrum information indicates that the device is using spectrum that is no longer available, it must immediately cease use of those frequencies under rules for database-managed spectrum. If this value is provided within the context of an available-spectrum response, it takes precedence over the value within the initialization response.
 * @property {string[]} rulesetIds The identifiers of the rulesets supported for the device&#39;s location. The database should include at least one applicable ruleset in the initialization response. The device may use the ruleset identifiers to determine parameters to include in subsequent requests. Within the context of the available-spectrum responses, the database should include the identifier of the ruleset that it used to determine the available-spectrum response. If included, the device must use the specified ruleset to interpret the response. If the device does not support the indicated ruleset, it must not operate in the spectrum governed by the ruleset.
 */
/**
 * @typedef SpectrumMessage
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {number} bandwidth The bandwidth (in Hertz) for which permissible power levels are specified. For example, FCC regulation would require only one spectrum specification at 6MHz bandwidth, but Ofcom regulation would require two specifications, at 0.1MHz and 8MHz. This parameter may be empty if there is no available spectrum. It will be present otherwise.
 * @property {spectrum(v1explorer).FrequencyRange[]} frequencyRanges The list of frequency ranges and permissible power levels. The list may be empty if there is no available spectrum, otherwise it will be present.
 */
/**
 * @typedef SpectrumSchedule
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {spectrum(v1explorer).EventTime} eventTime The event time expresses when the spectrum profile is valid. It will always be present.
 * @property {spectrum(v1explorer).SpectrumMessage[]} spectra A list of spectrum messages representing the usable profile. It will always be present, but may be empty when there is no available spectrum.
 */
/**
 * @typedef Vcard
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {spectrum(v1explorer).VcardAddress} adr The street address of the entity.
 * @property {spectrum(v1explorer).VcardTypedText} email An email address that can be used to reach the contact.
 * @property {string} fn The full name of the contact person. For example: John A. Smith.
 * @property {spectrum(v1explorer).VcardTypedText} org The organization associated with the registering entity.
 * @property {spectrum(v1explorer).VcardTelephone} tel A telephone number that can be used to call the contact.
 */
/**
 * @typedef VcardAddress
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {string} code The postal code associated with the address. For example: 94423.
 * @property {string} country The country name. For example: US.
 * @property {string} locality The city or local equivalent portion of the address. For example: San Jose.
 * @property {string} pobox An optional post office box number.
 * @property {string} region The state or local equivalent portion of the address. For example: CA.
 * @property {string} street The street number and name. For example: 123 Any St.
 */
/**
 * @typedef VcardTelephone
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {string} uri A nested telephone URI of the form: tel:+1-123-456-7890.
 */
/**
 * @typedef VcardTypedText
 * @memberOf! spectrum(v1explorer)
 * @type object
 * @property {string} text The text string associated with this item. For example, for an org field: ACME, inc. For an email field: smith@example.com.
 */
module.exports = Spectrum;
