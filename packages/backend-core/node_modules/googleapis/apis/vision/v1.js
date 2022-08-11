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
 * Google Cloud Vision API
 *
 * Integrates Google Vision features, including image labeling, face, logo, and landmark detection, optical character recognition (OCR), and detection of explicit content, into applications.
 *
 * @example
 * var google = require('googleapis');
 * var vision = google.vision('v1');
 *
 * @namespace vision
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Vision
 */
function Vision(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.images = {

    /**
     * vision.images.annotate
     *
     * @desc Run image detection and annotation for a batch of images.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Vision API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/vision
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var vision = google.vision('v1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'annotate' method:
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   vision.images.annotate(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias vision.images.annotate
     * @memberOf! vision(v1)
     *
     * @param {object} params Parameters for request
     * @param {vision(v1).BatchAnnotateImagesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    annotate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://vision.googleapis.com/v1/images:annotate',
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
 * @typedef ImageSource
 * @memberOf! vision(v1)
 * @type object
* @property {string} gcsImageUri Google Cloud Storage image URI, which must be in the following form:
`gs://bucket_name/object_name` (for details, see
[Google Cloud Storage Request URIs](https://cloud.google.com/storage/docs/reference-uris)).
NOTE: Cloud Storage object versioning is not supported.
*/
/**
 * @typedef AnnotateImageRequest
 * @memberOf! vision(v1)
 * @type object
 * @property {vision(v1).Image} image The image to be processed.
 * @property {vision(v1).ImageContext} imageContext Additional context that may accompany the image.
 * @property {vision(v1).Feature[]} features Requested features.
 */
/**
 * @typedef AnnotateImageResponse
 * @memberOf! vision(v1)
 * @type object
* @property {vision(v1).EntityAnnotation[]} labelAnnotations If present, label detection has completed successfully.
* @property {vision(v1).EntityAnnotation[]} landmarkAnnotations If present, landmark detection has completed successfully.
* @property {vision(v1).SafeSearchAnnotation} safeSearchAnnotation If present, safe-search annotation has completed successfully.
* @property {vision(v1).ImageProperties} imagePropertiesAnnotation If present, image properties were extracted successfully.
* @property {vision(v1).EntityAnnotation[]} textAnnotations If present, text (OCR) detection has completed successfully.
* @property {vision(v1).EntityAnnotation[]} logoAnnotations If present, logo detection has completed successfully.
* @property {vision(v1).FaceAnnotation[]} faceAnnotations If present, face detection has completed successfully.
* @property {vision(v1).Status} error If set, represents the error message for the operation.
Note that filled-in image annotations are guaranteed to be
correct, even when `error` is set.
*/
/**
 * @typedef LatLongRect
 * @memberOf! vision(v1)
 * @type object
 * @property {vision(v1).LatLng} maxLatLng Max lat/long pair.
 * @property {vision(v1).LatLng} minLatLng Min lat/long pair.
 */
/**
 * @typedef Status
 * @memberOf! vision(v1)
 * @type object
* @property {integer} code The status code, which should be an enum value of google.rpc.Code.
* @property {object[]} details A list of messages that carry the error details.  There will be a
common set of message types for APIs to use.
* @property {string} message A developer-facing error message, which should be in English. Any
user-facing error message should be localized and sent in the
google.rpc.Status.details field, or localized by the client.
*/
/**
 * @typedef FaceAnnotation
 * @memberOf! vision(v1)
 * @type object
* @property {number} tiltAngle Pitch angle, which indicates the upwards/downwards angle that the face is
pointing relative to the image&#39;s horizontal plane. Range [-180,180].
* @property {string} underExposedLikelihood Under-exposed likelihood.
* @property {vision(v1).BoundingPoly} fdBoundingPoly The `fd_bounding_poly` bounding polygon is tighter than the
`boundingPoly`, and encloses only the skin part of the face. Typically, it
is used to eliminate the face from any image analysis that detects the
&quot;amount of skin&quot; visible in an image. It is not based on the
landmarker results, only on the initial face detection, hence
the &lt;code&gt;fd&lt;/code&gt; (face detection) prefix.
* @property {number} landmarkingConfidence Face landmarking confidence. Range [0, 1].
* @property {string} joyLikelihood Joy likelihood.
* @property {number} detectionConfidence Detection confidence. Range [0, 1].
* @property {string} surpriseLikelihood Surprise likelihood.
* @property {string} angerLikelihood Anger likelihood.
* @property {string} headwearLikelihood Headwear likelihood.
* @property {number} panAngle Yaw angle, which indicates the leftward/rightward angle that the face is
pointing relative to the vertical plane perpendicular to the image. Range
[-180,180].
* @property {vision(v1).BoundingPoly} boundingPoly The bounding polygon around the face. The coordinates of the bounding box
are in the original image&#39;s scale, as returned in `ImageParams`.
The bounding box is computed to &quot;frame&quot; the face in accordance with human
expectations. It is based on the landmarker results.
Note that one or more x and/or y coordinates may not be generated in the
`BoundingPoly` (the polygon will be unbounded) if only a partial face
appears in the image to be annotated.
* @property {vision(v1).Landmark[]} landmarks Detected face landmarks.
* @property {string} blurredLikelihood Blurred likelihood.
* @property {number} rollAngle Roll angle, which indicates the amount of clockwise/anti-clockwise rotation
of the face relative to the image vertical about the axis perpendicular to
the face. Range [-180,180].
* @property {string} sorrowLikelihood Sorrow likelihood.
*/
/**
 * @typedef Vertex
 * @memberOf! vision(v1)
 * @type object
 * @property {integer} y Y coordinate.
 * @property {integer} x X coordinate.
 */
/**
 * @typedef ColorInfo
 * @memberOf! vision(v1)
 * @type object
* @property {number} pixelFraction The fraction of pixels the color occupies in the image.
Value in range [0, 1].
* @property {vision(v1).Color} color RGB components of the color.
* @property {number} score Image-specific score for this color. Value in range [0, 1].
*/
/**
 * @typedef BoundingPoly
 * @memberOf! vision(v1)
 * @type object
 * @property {vision(v1).Vertex[]} vertices The bounding polygon vertices.
 */
/**
 * @typedef Landmark
 * @memberOf! vision(v1)
 * @type object
 * @property {vision(v1).Position} position Face landmark position.
 * @property {string} type Face landmark type.
 */
/**
 * @typedef ImageContext
 * @memberOf! vision(v1)
 * @type object
* @property {vision(v1).LatLongRect} latLongRect lat/long rectangle that specifies the location of the image.
* @property {string[]} languageHints List of languages to use for TEXT_DETECTION. In most cases, an empty value
yields the best results since it enables automatic language detection. For
languages based on the Latin alphabet, setting `language_hints` is not
needed. In rare cases, when the language of the text in the image is known,
setting a hint will help get better results (although it will be a
significant hindrance if the hint is wrong). Text detection returns an
error if one or more of the specified languages is not one of the
[supported languages](/vision/docs/languages).
*/
/**
 * @typedef BatchAnnotateImagesRequest
 * @memberOf! vision(v1)
 * @type object
 * @property {vision(v1).AnnotateImageRequest[]} requests Individual image annotation requests for this batch.
 */
/**
 * @typedef EntityAnnotation
 * @memberOf! vision(v1)
 * @type object
* @property {string} mid Opaque entity ID. Some IDs may be available in
[Google Knowledge Graph Search API](https://developers.google.com/knowledge-graph/).
* @property {string} description Entity textual description, expressed in its `locale` language.
* @property {number} topicality The relevancy of the ICA (Image Content Annotation) label to the
image. For example, the relevancy of &quot;tower&quot; is likely higher to an image
containing the detected &quot;Eiffel Tower&quot; than to an image containing a
detected distant towering building, even though the confidence that
there is a tower in each image may be the same. Range [0, 1].
* @property {string} locale The language code for the locale in which the entity textual
`description` is expressed.
* @property {vision(v1).Property[]} properties Some entities may have optional user-supplied `Property` (name/value)
fields, such a score or string that qualifies the entity.
* @property {number} score Overall score of the result. Range [0, 1].
* @property {vision(v1).BoundingPoly} boundingPoly Image region to which this entity belongs. Currently not produced
for `LABEL_DETECTION` features. For `TEXT_DETECTION` (OCR), `boundingPoly`s
are produced for the entire text detected in an image region, followed by
`boundingPoly`s for each word within the detected text.
* @property {vision(v1).LocationInfo[]} locations The location information for the detected entity. Multiple
`LocationInfo` elements can be present because one location may
indicate the location of the scene in the image, and another location
may indicate the location of the place where the image was taken.
Location information is usually present for landmarks.
* @property {number} confidence The accuracy of the entity detection in an image.
For example, for an image in which the &quot;Eiffel Tower&quot; entity is detected,
this field represents the confidence that there is a tower in the query
image. Range [0, 1].
*/
/**
 * @typedef Property
 * @memberOf! vision(v1)
 * @type object
 * @property {string} value Value of the property.
 * @property {string} name Name of the property.
 */
/**
 * @typedef Color
 * @memberOf! vision(v1)
 * @type object
* @property {number} green The amount of green in the color as a value in the interval [0, 1].
* @property {number} blue The amount of blue in the color as a value in the interval [0, 1].
* @property {number} red The amount of red in the color as a value in the interval [0, 1].
* @property {number} alpha The fraction of this color that should be applied to the pixel. That is,
the final pixel color is defined by the equation:

  pixel color = alpha * (this color) + (1.0 - alpha) * (background color)

This means that a value of 1.0 corresponds to a solid color, whereas
a value of 0.0 corresponds to a completely transparent color. This
uses a wrapper message rather than a simple float scalar so that it is
possible to distinguish between a default value and the value being unset.
If omitted, this color object is to be rendered as a solid color
(as if the alpha value had been explicitly given with a value of 1.0).
*/
/**
 * @typedef LocationInfo
 * @memberOf! vision(v1)
 * @type object
 * @property {vision(v1).LatLng} latLng lat/long location coordinates.
 */
/**
 * @typedef SafeSearchAnnotation
 * @memberOf! vision(v1)
 * @type object
* @property {string} medical Likelihood that this is a medical image.
* @property {string} spoof Spoof likelihood. The likelihood that an modification
was made to the image&#39;s canonical version to make it appear
funny or offensive.
* @property {string} violence Violence likelihood.
* @property {string} adult Represents the adult content likelihood for the image.
*/
/**
 * @typedef Image
 * @memberOf! vision(v1)
 * @type object
* @property {vision(v1).ImageSource} source Google Cloud Storage image location. If both `content` and `source`
are provided for an image, `content` takes precedence and is
used to perform the image annotation request.
* @property {string} content Image content, represented as a stream of bytes.
Note: as with all `bytes` fields, protobuffers use a pure binary
representation, whereas JSON representations use base64.
*/
/**
 * @typedef DominantColorsAnnotation
 * @memberOf! vision(v1)
 * @type object
 * @property {vision(v1).ColorInfo[]} colors RGB color values with their score and pixel fraction.
 */
/**
 * @typedef Feature
 * @memberOf! vision(v1)
 * @type object
 * @property {string} type The feature type.
 * @property {integer} maxResults Maximum number of results of this type.
 */
/**
 * @typedef BatchAnnotateImagesResponse
 * @memberOf! vision(v1)
 * @type object
 * @property {vision(v1).AnnotateImageResponse[]} responses Individual responses to image annotation requests within the batch.
 */
/**
 * @typedef ImageProperties
 * @memberOf! vision(v1)
 * @type object
 * @property {vision(v1).DominantColorsAnnotation} dominantColors If present, dominant colors completed successfully.
 */
/**
 * @typedef LatLng
 * @memberOf! vision(v1)
 * @type object
 * @property {number} latitude The latitude in degrees. It must be in the range [-90.0, +90.0].
 * @property {number} longitude The longitude in degrees. It must be in the range [-180.0, +180.0].
 */
/**
 * @typedef Position
 * @memberOf! vision(v1)
 * @type object
 * @property {number} y Y coordinate.
 * @property {number} x X coordinate.
 * @property {number} z Z coordinate (or depth).
 */
module.exports = Vision;
