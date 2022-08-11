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
 * Google Slides API
 *
 * An API for creating and editing Google Slides presentations.
 *
 * @example
 * var google = require('googleapis');
 * var slides = google.slides('v1');
 *
 * @namespace slides
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Slides
 */
function Slides(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.presentations = {

    /**
     * slides.presentations.get
     *
     * @desc Gets the latest version of the specified presentation.
     *
     * @alias slides.presentations.get
     * @memberOf! slides(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.presentationId The ID of the presentation to retrieve.
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
          url: 'https://slides.googleapis.com/v1/presentations/{presentationId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['presentationId'],
        pathParams: ['presentationId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * slides.presentations.create
     *
     * @desc Creates a new presentation using the title given in the request. Other fields in the request are ignored. Returns the created presentation.
     *
     * @alias slides.presentations.create
     * @memberOf! slides(v1)
     *
     * @param {object} params Parameters for request
     * @param {slides(v1).Presentation} params.resource Request body data
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
          url: 'https://slides.googleapis.com/v1/presentations',
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
     * slides.presentations.batchUpdate
     *
     * @desc Applies one or more updates to the presentation.  Each request is validated before being applied. If any request is not valid, then the entire request will fail and nothing will be applied.  Some requests have replies to give you some information about how they are applied. Other requests do not need to return information; these each return an empty reply. The order of replies matches that of the requests.  For example, suppose you call batchUpdate with four updates, and only the third one returns information. The response would have two empty replies: the reply to the third request, and another empty reply, in that order.  Because other users may be editing the presentation, the presentation might not exactly reflect your changes: your changes may be altered with respect to collaborator changes. If there are no collaborators, the presentation should reflect your changes. In any case, the updates in your request are guaranteed to be applied together atomically.
     *
     * @alias slides.presentations.batchUpdate
     * @memberOf! slides(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.presentationId The presentation to apply the updates to.
     * @param {slides(v1).BatchUpdatePresentationRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    batchUpdate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://slides.googleapis.com/v1/presentations/{presentationId}:batchUpdate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['presentationId'],
        pathParams: ['presentationId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    pages: {

      /**
       * slides.presentations.pages.get
       *
       * @desc Gets the latest version of the specified page in the presentation.
       *
       * @alias slides.presentations.pages.get
       * @memberOf! slides(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.presentationId The ID of the presentation to retrieve.
       * @param {string} params.pageObjectId The object ID of the page to retrieve.
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
            url: 'https://slides.googleapis.com/v1/presentations/{presentationId}/pages/{pageObjectId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['presentationId', 'pageObjectId'],
          pathParams: ['presentationId', 'pageObjectId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef StretchedPictureFill
 * @memberOf! slides(v1)
 * @type object
* @property {string} contentUrl Reading the content_url:

An URL to a picture with a default lifetime of 30 minutes.
This URL is tagged with the account of the requester. Anyone with the URL
effectively accesses the picture as the original requester. Access to the
picture may be lost if the presentation&#39;s sharing settings change.

Writing the content_url:

The picture is fetched once at insertion time and a copy is stored for
display inside the presentation. Pictures must be less than 50MB in size,
cannot exceed 25 megapixels, and must be in either in PNG, JPEG, or GIF
format.
* @property {slides(v1).Size} size The original size of the picture fill. This field is read-only.
*/
/**
 * @typedef Image
 * @memberOf! slides(v1)
 * @type object
* @property {string} contentUrl An URL to an image with a default lifetime of 30 minutes.
This URL is tagged with the account of the requester. Anyone with the URL
effectively accesses the image as the original requester. Access to the
image may be lost if the presentation&#39;s sharing settings change.
* @property {slides(v1).ImageProperties} imageProperties The properties of the image.
*/
/**
 * @typedef VideoProperties
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).Outline} outline The outline of the video. The default outline matches the defaults for new
videos created in the Slides editor.
*/
/**
 * @typedef CropProperties
 * @memberOf! slides(v1)
 * @type object
* @property {number} rightOffset The offset specifies the right edge of the crop rectangle that is located
to the left of the original bounding rectangle right edge, relative to the
object&#39;s original width.
* @property {number} angle The rotation angle of the crop window around its center, in radians.
Rotation angle is applied after the offset.
* @property {number} leftOffset The offset specifies the left edge of the crop rectangle that is located to
the right of the original bounding rectangle left edge, relative to the
object&#39;s original width.
* @property {number} topOffset The offset specifies the top edge of the crop rectangle that is located
below the original bounding rectangle top edge, relative to the object&#39;s
original height.
* @property {number} bottomOffset The offset specifies the bottom edge of the crop rectangle that is located
above the original bounding rectangle bottom edge, relative to the object&#39;s
original height.
*/
/**
 * @typedef TableRange
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).TableCellLocation} location The starting location of the table range.
 * @property {integer} rowSpan The row span of the table range.
 * @property {integer} columnSpan The column span of the table range.
 */
/**
 * @typedef UpdateTextStyleRequest
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).TextStyle} style The style(s) to set on the text.

If the value for a particular style matches that of the parent, that style
will be set to inherit.

Certain text style changes may cause other changes meant to mirror the
behavior of the Slides editor. See the documentation of
TextStyle for more information.
* @property {string} objectId The object ID of the shape or table with the text to be styled.
* @property {string} fields The fields that should be updated.

At least one field must be specified. The root `style` is implied and
should not be specified. A single `&quot;*&quot;` can be used as short-hand for
listing every field.

For example to update the text style to bold, set `fields` to `&quot;bold&quot;`.

To reset a property to its default value,
include its field name in the field mask but leave the field itself unset.
* @property {slides(v1).Range} textRange The range of text to style.

The range may be extended to include adjacent newlines.

If the range fully contains a paragraph belonging to a list, the
paragraph&#39;s bullet is also updated with the matching text style.
* @property {slides(v1).TableCellLocation} cellLocation The optional table cell location if the text to be styled is in a table
cell. If present, the object_id must refer to a table.
*/
/**
 * @typedef InsertTextRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} text The text to be inserted.

Inserting a newline character will implicitly create a new
ParagraphMarker at that index.
The paragraph style of the new paragraph will be copied from the paragraph
at the current insertion index, including lists and bullets.

Text styles for inserted text will be determined automatically, generally
preserving the styling of neighboring text. In most cases, the text will be
added to the TextRun that exists at the
insertion index.

Some control characters (U+0000-U+0008, U+000C-U+001F) and characters
from the Unicode Basic Multilingual Plane Private Use Area (U+E000-U+F8FF)
will be stripped out of the inserted text.
* @property {string} objectId The object ID of the shape or table where the text will be inserted.
* @property {integer} insertionIndex The index where the text will be inserted, in Unicode code units, based
on TextElement indexes.

The index is zero-based and is computed from the start of the string.
The index may be adjusted to prevent insertions inside Unicode grapheme
clusters. In these cases, the text will be inserted immediately after the
grapheme cluster.
* @property {slides(v1).TableCellLocation} cellLocation The optional table cell location if the text is to be inserted into a table
cell. If present, the object_id must refer to a table.
*/
/**
 * @typedef RgbColor
 * @memberOf! slides(v1)
 * @type object
 * @property {number} green The green component of the color, from 0.0 to 1.0.
 * @property {number} blue The blue component of the color, from 0.0 to 1.0.
 * @property {number} red The red component of the color, from 0.0 to 1.0.
 */
/**
 * @typedef PageElementProperties
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).Size} size The size of the element.
 * @property {string} pageObjectId The object ID of the page where the element is located.
 * @property {slides(v1).AffineTransform} transform The transform for the element.
 */
/**
 * @typedef DeleteTextRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} objectId The object ID of the shape or table from which the text will be deleted.
* @property {slides(v1).Range} textRange The range of text to delete, based on TextElement indexes.

There is always an implicit newline character at the end of a shape&#39;s or
table cell&#39;s text that cannot be deleted. `Range.Type.ALL` will use the
correct bounds, but care must be taken when specifying explicit bounds for
range types `FROM_START_INDEX` and `FIXED_RANGE`. For example, if the text
is &quot;ABC&quot;, followed by an implicit newline, then the maximum value is 2 for
`text_range.start_index` and 3 for `text_range.end_index`.

Deleting text that crosses a paragraph boundary may result in changes
to paragraph styles and lists as the two paragraphs are merged.

Ranges that include only one code unit of a surrogate pair are expanded to
include both code units.
* @property {slides(v1).TableCellLocation} cellLocation The optional table cell location if the text is to be deleted from a table
cell. If present, the object_id must refer to a table.
*/
/**
 * @typedef ParagraphStyle
 * @memberOf! slides(v1)
 * @type object
* @property {number} lineSpacing The amount of space between lines, as a percentage of normal, where normal
is represented as 100.0. If unset, the value is inherited from the parent.
This property is read-only.
* @property {string} spacingMode The spacing mode for the paragraph. This property is read-only.
* @property {string} alignment The text alignment for this paragraph. This property is read-only.
* @property {slides(v1).Dimension} spaceAbove The amount of extra space above the paragraph. If unset, the value is
inherited from the parent. This property is read-only.
* @property {string} direction The text direction of this paragraph. This property is read-only.
* @property {slides(v1).Dimension} indentEnd The amount indentation for the paragraph on the side that corresponds to
the end of the text, based on the current text direction. If unset, the
value is inherited from the parent. This property is read-only.
* @property {slides(v1).Dimension} indentFirstLine The amount of indentation for the start of the first line of the paragraph.
If unset, the value is inherited from the parent. This property is
read-only.
* @property {slides(v1).Dimension} indentStart The amount indentation for the paragraph on the side that corresponds to
the start of the text, based on the current text direction. If unset, the
value is inherited from the parent. This property is read-only.
* @property {slides(v1).Dimension} spaceBelow The amount of extra space above the paragraph. If unset, the value is
inherited from the parent. This property is read-only.
*/
/**
 * @typedef Page
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).SlideProperties} slideProperties Slide specific properties. Only set if page_type = SLIDE.
* @property {string} pageType The type of the page.
* @property {slides(v1).PageElement[]} pageElements The page elements rendered on the page.
* @property {slides(v1).PageProperties} pageProperties The properties of the page.
* @property {slides(v1).LayoutProperties} layoutProperties Layout specific properties. Only set if page_type = LAYOUT.
* @property {string} objectId The object ID for this page. Object IDs used by
Page and
PageElement share the same namespace.
*/
/**
 * @typedef UpdateShapePropertiesRequest
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).ShapeProperties} shapeProperties The shape properties to update.
* @property {string} objectId The object ID of the shape the updates are applied to.
* @property {string} fields The fields that should be updated.

At least one field must be specified. The root `shapeProperties` is
implied and should not be specified. A single `&quot;*&quot;` can be used as
short-hand for listing every field.

For example to update the shape background solid fill color, set `fields`
to `&quot;shapeBackgroundFill.solidFill.color&quot;`.

To reset a property to its default value, include its field name in the
field mask but leave the field itself unset.
*/
/**
 * @typedef CreateLineResponse
 * @memberOf! slides(v1)
 * @type object
 * @property {string} objectId The object ID of the created line.
 */
/**
 * @typedef Presentation
 * @memberOf! slides(v1)
 * @type object
* @property {string} title The title of the presentation.
* @property {string} locale The locale of the presentation, as an IETF BCP 47 language tag.
* @property {slides(v1).Page[]} slides The slides in the presentation.
A slide inherits properties from a slide layout.
* @property {slides(v1).Page[]} masters The slide masters in the presentation. A slide master contains all common
page elements and the common properties for a set of layouts. They serve
three purposes:

- Placeholder shapes on a master contain the default text styles and shape
  properties of all placeholder shapes on pages that use that master.
- The master page properties define the common page properties inherited by
  its layouts.
- Any other shapes on the master slide will appear on all slides using that
  master, regardless of their layout.
* @property {slides(v1).Size} pageSize The size of pages in the presentation.
* @property {string} presentationId The ID of the presentation.
* @property {slides(v1).Page[]} layouts The layouts in the presentation. A layout is a template that determines
how content is arranged and styled on the slides that inherit from that
layout.
*/
/**
 * @typedef CreateImageRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} url The image URL.

The image is fetched once at insertion time and a copy is stored for
display inside the presentation. Images must be less than 50MB in size,
cannot exceed 25 megapixels, and must be in either in PNG, JPEG, or GIF
format.
* @property {string} objectId A user-supplied object ID.

If you specify an ID, it must be unique among all pages and page elements
in the presentation. The ID must start with an alphanumeric character or an
underscore (matches regex `[a-zA-Z0-9_]`); remaining characters
may include those as well as a hyphen or colon (matches regex
`[a-zA-Z0-9_-:]`).
The length of the ID must not be less than 5 or greater than 50.

If you don&#39;t specify an ID, a unique one is generated.
* @property {slides(v1).PageElementProperties} elementProperties The element properties for the image.

When the aspect ratio of the provided size does not match the image aspect
ratio, the image is scaled and centered with respect to the size in order
to maintain aspect ratio. The provided transform is applied after this
operation.
*/
/**
 * @typedef SlideProperties
 * @memberOf! slides(v1)
 * @type object
 * @property {string} layoutObjectId The object ID of the layout that this slide is based on.
 * @property {string} masterObjectId The object ID of the master that this slide is based on.
 */
/**
 * @typedef UpdatePageElementTransformRequest
 * @memberOf! slides(v1)
 * @type object
 * @property {string} applyMode The apply mode of the transform update.
 * @property {string} objectId The object ID of the page element to update.
 * @property {slides(v1).AffineTransform} transform The input transform matrix used to update the page element.
 */
/**
 * @typedef List
 * @memberOf! slides(v1)
 * @type object
* @property {object} nestingLevel A map of nesting levels to the properties of bullets at the associated
level. A list has at most nine levels of nesting, so the possible values
for the keys of this map are 0 through 8, inclusive.
* @property {string} listId The ID of the list.
*/
/**
 * @typedef CreateVideoResponse
 * @memberOf! slides(v1)
 * @type object
 * @property {string} objectId The object ID of the created video.
 */
/**
 * @typedef InsertTableRowsRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} tableObjectId The table to insert rows into.
* @property {boolean} insertBelow Whether to insert new rows below the reference cell location.

- `True`: insert below the cell.
- `False`: insert above the cell.
* @property {slides(v1).TableCellLocation} cellLocation The reference table cell location from which rows will be inserted.

A new row will be inserted above (or below) the row where the reference
cell is. If the reference cell is a merged cell, a new row will be
inserted above (or below) the merged cell.
* @property {integer} number The number of rows to be inserted. Maximum 20 per request.
*/
/**
 * @typedef UpdateVideoPropertiesRequest
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).VideoProperties} videoProperties The video properties to update.
* @property {string} objectId The object ID of the video the updates are applied to.
* @property {string} fields The fields that should be updated.

At least one field must be specified. The root `videoProperties` is
implied and should not be specified. A single `&quot;*&quot;` can be used as
short-hand for listing every field.

For example to update the video outline color, set `fields` to
`&quot;outline.outlineFill.solidFill.color&quot;`.

To reset a property to its default value, include its field name in the
field mask but leave the field itself unset.
*/
/**
 * @typedef OpaqueColor
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).RgbColor} rgbColor An opaque RGB color.
 * @property {string} themeColor An opaque theme color.
 */
/**
 * @typedef Response
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).CreateTableResponse} createTable The result of creating a table.
* @property {slides(v1).ReplaceAllTextResponse} replaceAllText The result of replacing text.
* @property {slides(v1).CreateLineResponse} createLine The result of creating a line.
* @property {slides(v1).CreateSheetsChartResponse} createSheetsChart The result of creating a Google Sheets chart.
* @property {slides(v1).CreateSlideResponse} createSlide The result of creating a slide.
* @property {slides(v1).CreateShapeResponse} createShape The result of creating a shape.
* @property {slides(v1).ReplaceAllShapesWithImageResponse} replaceAllShapesWithImage The result of replacing all shapes matching some criteria with an
image.
* @property {slides(v1).CreateVideoResponse} createVideo The result of creating a video.
* @property {slides(v1).CreateImageResponse} createImage The result of creating an image.
* @property {slides(v1).DuplicateObjectResponse} duplicateObject The result of duplicating an object.
*/
/**
 * @typedef LineProperties
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).Dimension} weight The thickness of the line.
* @property {string} endArrow The style of the arrow at the end of the line.
* @property {slides(v1).Link} link The hyperlink destination of the line. If unset, there is no link.
* @property {slides(v1).LineFill} lineFill The fill of the line. The default line fill matches the defaults for new
lines created in the Slides editor.
* @property {string} dashStyle The dash style of the line.
* @property {string} startArrow The style of the arrow at the beginning of the line.
*/
/**
 * @typedef Table
 * @memberOf! slides(v1)
 * @type object
* @property {integer} columns Number of columns in the table.
* @property {slides(v1).TableColumnProperties[]} tableColumns Properties of each column.
* @property {integer} rows Number of rows in the table.
* @property {slides(v1).TableRow[]} tableRows Properties and contents of each row.

Cells that span multiple rows are contained in only one of these rows and
have a row_span greater
than 1.
*/
/**
 * @typedef NestingLevel
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).TextStyle} bulletStyle The style of a bullet at this level of nesting.
 */
/**
 * @typedef DuplicateObjectResponse
 * @memberOf! slides(v1)
 * @type object
 * @property {string} objectId The ID of the new duplicate object.
 */
/**
 * @typedef RefreshSheetsChartRequest
 * @memberOf! slides(v1)
 * @type object
 * @property {string} objectId The object ID of the chart to refresh.
 */
/**
 * @typedef TableCellLocation
 * @memberOf! slides(v1)
 * @type object
 * @property {integer} rowIndex The 0-based row index.
 * @property {integer} columnIndex The 0-based column index.
 */
/**
 * @typedef TextContent
 * @memberOf! slides(v1)
 * @type object
* @property {object} lists The bulleted lists contained in this text, keyed by list ID.
* @property {slides(v1).TextElement[]} textElements The text contents broken down into its component parts, including styling
information. This property is read-only.
*/
/**
 * @typedef PageElement
 * @memberOf! slides(v1)
 * @type object
* @property {string} description The description of the page element. Combined with title to display alt
text.
* @property {string} title The title of the page element. Combined with description to display alt
text.
* @property {slides(v1).AffineTransform} transform The transform of the page element.
* @property {slides(v1).Video} video A video page element.
* @property {slides(v1).SheetsChart} sheetsChart A linked chart embedded from Google Sheets. Unlinked charts are
represented as images.
* @property {slides(v1).Line} line A line page element.
* @property {slides(v1).Table} table A table page element.
* @property {slides(v1).WordArt} wordArt A word art page element.
* @property {slides(v1).Shape} shape A generic shape.
* @property {slides(v1).Group} elementGroup A collection of page elements joined as a single unit.
* @property {slides(v1).Image} image An image page element.
* @property {string} objectId The object ID for this page element. Object IDs used by
google.apps.slides.v1.Page and
google.apps.slides.v1.PageElement share the same namespace.
* @property {slides(v1).Size} size The size of the page element.
*/
/**
 * @typedef UpdatePagePropertiesRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} objectId The object ID of the page the update is applied to.
* @property {string} fields The fields that should be updated.

At least one field must be specified. The root `pageProperties` is
implied and should not be specified. A single `&quot;*&quot;` can be used as
short-hand for listing every field.

For example to update the page background solid fill color, set `fields`
to `&quot;pageBackgroundFill.solidFill.color&quot;`.

To reset a property to its default value, include its field name in the
field mask but leave the field itself unset.
* @property {slides(v1).PageProperties} pageProperties The page properties to update.
*/
/**
 * @typedef UpdateTableCellPropertiesRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} objectId The object ID of the table.
* @property {slides(v1).TableRange} tableRange The table range representing the subset of the table to which the updates
are applied. If a table range is not specified, the updates will apply to
the entire table.
* @property {string} fields The fields that should be updated.

At least one field must be specified. The root `tableCellProperties` is
implied and should not be specified. A single `&quot;*&quot;` can be used as
short-hand for listing every field.

For example to update the table cell background solid fill color, set
`fields` to `&quot;tableCellBackgroundFill.solidFill.color&quot;`.

To reset a property to its default value, include its field name in the
field mask but leave the field itself unset.
* @property {slides(v1).TableCellProperties} tableCellProperties The table cell properties to update.
*/
/**
 * @typedef BatchUpdatePresentationRequest
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).Request[]} requests A list of updates to apply to the presentation.
 */
/**
 * @typedef Dimension
 * @memberOf! slides(v1)
 * @type object
 * @property {string} unit The units for magnitude.
 * @property {number} magnitude The magnitude.
 */
/**
 * @typedef Placeholder
 * @memberOf! slides(v1)
 * @type object
* @property {integer} index The index of the placeholder. If the same placeholder types are the present
in the same page, they would have different index values.
* @property {string} type The type of the placeholder.
* @property {string} parentObjectId The object ID of this shape&#39;s parent placeholder.
If unset, the parent placeholder shape does not exist, so the shape does
not inherit properties from any other shape.
*/
/**
 * @typedef CreateSheetsChartRequest
 * @memberOf! slides(v1)
 * @type object
* @property {integer} chartId The ID of the specific chart in the Google Sheets spreadsheet.
* @property {string} objectId A user-supplied object ID.

If specified, the ID must be unique among all pages and page elements in
the presentation. The ID should start with a word character [a-zA-Z0-9_]
and then followed by any number of the following characters [a-zA-Z0-9_-:].
The length of the ID should not be less than 5 or greater than 50.
If empty, a unique identifier will be generated.
* @property {string} spreadsheetId The ID of the Google Sheets spreadsheet that contains the chart.
* @property {slides(v1).PageElementProperties} elementProperties The element properties for the chart.

When the aspect ratio of the provided size does not match the chart aspect
ratio, the chart is scaled and centered with respect to the size in order
to maintain aspect ratio. The provided transform is applied after this
operation.
* @property {string} linkingMode The mode with which the chart is linked to the source spreadsheet. When
not specified, the chart will be an image that is not linked.
*/
/**
 * @typedef DeleteTableRowRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} tableObjectId The table to delete rows from.
* @property {slides(v1).TableCellLocation} cellLocation The reference table cell location from which a row will be deleted.

The row this cell spans will be deleted. If this is a merged cell, multiple
rows will be deleted. If no rows remain in the table after this deletion,
the whole table is deleted.
*/
/**
 * @typedef Video
 * @memberOf! slides(v1)
 * @type object
* @property {string} url An URL to a video. The URL is valid as long as the source video
exists and sharing settings do not change.
* @property {slides(v1).VideoProperties} videoProperties The properties of the video.
* @property {string} source The video source.
* @property {string} id The video source&#39;s unique identifier for this video.
*/
/**
 * @typedef Link
 * @memberOf! slides(v1)
 * @type object
* @property {string} url If set, indicates this is a link to the external web page at this URL.
* @property {string} relativeLink If set, indicates this is a link to a slide in this presentation,
addressed by its position.
* @property {integer} slideIndex If set, indicates this is a link to the slide at this zero-based index
in the presentation. There may not be a slide at this index.
* @property {string} pageObjectId If set, indicates this is a link to the specific page in this
presentation with this ID. A page with this ID may not exist.
*/
/**
 * @typedef PageBackgroundFill
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).StretchedPictureFill} stretchedPictureFill Stretched picture fill.
* @property {string} propertyState The background fill property state.

Updating the the fill on a page will implicitly update this field to
`RENDERED`, unless another value is specified in the same request. To
have no fill on a page, set this field to `NOT_RENDERED`. In this case,
any other fill fields set in the same request will be ignored.
* @property {slides(v1).SolidFill} solidFill Solid color fill.
*/
/**
 * @typedef ColorStop
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).OpaqueColor} color The color of the gradient stop.
* @property {number} position The relative position of the color stop in the gradient band measured
in percentage. The value should be in the interval [0.0, 1.0].
* @property {number} alpha The alpha value of this color in the gradient band. Defaults to 1.0,
fully opaque.
*/
/**
 * @typedef ThemeColorPair
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).RgbColor} color The concrete color corresponding to the theme color type above.
 * @property {string} type The type of the theme color.
 */
/**
 * @typedef ReplaceAllShapesWithImageRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} replaceMethod The replace method.
* @property {slides(v1).SubstringMatchCriteria} containsText If set, this request will replace all of the shapes that contain the
given text.
* @property {string} imageUrl The image URL.

The image is fetched once at insertion time and a copy is stored for
display inside the presentation. Images must be less than 50MB in size,
cannot exceed 25 megapixels, and must be in either in PNG, JPEG, or GIF
format.
*/
/**
 * @typedef DeleteObjectRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} objectId The object ID of the page or page element to delete.

If after a delete operation a group contains
only 1 or no page elements, the group is also deleted.

If a placeholder is deleted on a layout, any empty inheriting shapes are
also deleted.
*/
/**
 * @typedef CreateImageResponse
 * @memberOf! slides(v1)
 * @type object
 * @property {string} objectId The object ID of the created image.
 */
/**
 * @typedef Recolor
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).ColorStop[]} recolorStops The recolor effect is represented by a gradient, which is a list of color
stops. This property is read-only.
*/
/**
 * @typedef TextStyle
 * @memberOf! slides(v1)
 * @type object
* @property {boolean} bold Whether or not the text is bold.
* @property {boolean} italic Whether or not the text is italicized.
* @property {string} baselineOffset The text&#39;s vertical offset from its normal position.

Text with `SUPERSCRIPT` or `SUBSCRIPT` baseline offsets is automatically
rendered in a smaller font size, computed based on the `font_size` field.
The `font_size` itself is not affected by changes in this field.
* @property {slides(v1).OptionalColor} foregroundColor The color of the text itself. If set, the color is either opaque or
transparent, depending on if the `opaque_color` field in it is set.
* @property {string} fontFamily The font family of the text.

The font family can be any font from the Font menu in Slides or from
[Google Fonts] (https://fonts.google.com/). If the font name is
unrecognized, the text is rendered in `Arial`.

Some fonts can affect the weight of the text. If an update request
specifies values for both `font_family` and `bold`, the explicitly-set
`bold` value is used.
* @property {boolean} strikethrough Whether or not the text is struck through.
* @property {slides(v1).Link} link The hyperlink destination of the text. If unset, there is no link. Links
are not inherited from parent text.

Changing the link in an update request causes some other changes to the
text style of the range:

* When setting a link, the text foreground color will be set to
  ThemeColorType.HYPERLINK and the text will
  be underlined. If these fields are modified in the same
  request, those values will be used instead of the link defaults.
* Setting a link on a text range that overlaps with an existing link will
  also update the existing link to point to the new URL.
* Links are not settable on newline characters. As a result, setting a link
  on a text range that crosses a paragraph boundary, such as `&quot;ABC\n123&quot;`,
  will separate the newline character(s) into their own text runs. The
  link will be applied separately to the runs before and after the newline.
* Removing a link will update the text style of the range to match the
  style of the preceding text (or the default text styles if the preceding
  text is another link) unless different styles are being set in the same
  request.
* @property {boolean} smallCaps Whether or not the text is in small capital letters.
* @property {slides(v1).OptionalColor} backgroundColor The background color of the text. If set, the color is either opaque or
transparent, depending on if the `opaque_color` field in it is set.
* @property {slides(v1).Dimension} fontSize The size of the text&#39;s font. When read, the `font_size` will specified in
points.
* @property {boolean} underline Whether or not the text is underlined.
*/
/**
 * @typedef UpdateLinePropertiesRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} objectId The object ID of the line the update is applied to.
* @property {slides(v1).LineProperties} lineProperties The line properties to update.
* @property {string} fields The fields that should be updated.

At least one field must be specified. The root `lineProperties` is
implied and should not be specified. A single `&quot;*&quot;` can be used as
short-hand for listing every field.

For example to update the line solid fill color, set `fields` to
`&quot;lineFill.solidFill.color&quot;`.

To reset a property to its default value, include its field name in the
field mask but leave the field itself unset.
*/
/**
 * @typedef TableCellBackgroundFill
 * @memberOf! slides(v1)
 * @type object
* @property {string} propertyState The background fill property state.

Updating the the fill on a table cell will implicitly update this field
to `RENDERED`, unless another value is specified in the same request. To
have no fill on a table cell, set this field to `NOT_RENDERED`. In this
case, any other fill fields set in the same request will be ignored.
* @property {slides(v1).SolidFill} solidFill Solid color fill.
*/
/**
 * @typedef SolidFill
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).OpaqueColor} color The color value of the solid fill.
* @property {number} alpha The fraction of this `color` that should be applied to the pixel.
That is, the final pixel color is defined by the equation:

  pixel color = alpha * (color) + (1.0 - alpha) * (background color)

This means that a value of 1.0 corresponds to a solid color, whereas
a value of 0.0 corresponds to a completely transparent color.
*/
/**
 * @typedef DuplicateObjectRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} objectId The ID of the object to duplicate.
* @property {object} objectIds The object being duplicated may contain other objects, for example when
duplicating a slide or a group page element. This map defines how the IDs
of duplicated objects are generated: the keys are the IDs of the original
objects and its values are the IDs that will be assigned to the
corresponding duplicate object. The ID of the source object&#39;s duplicate
may be specified in this map as well, using the same value of the
`object_id` field as a key and the newly desired ID as the value.

All keys must correspond to existing IDs in the presentation. All values
must be unique in the presentation and must start with an alphanumeric
character or an underscore (matches regex `[a-zA-Z0-9_]`); remaining
characters may include those as well as a hyphen or colon (matches regex
`[a-zA-Z0-9_-:]`). The length of the new ID must not be less than 5 or
greater than 50.

If any IDs of source objects are omitted from the map, a new random ID will
be assigned. If the map is empty or unset, all duplicate objects will
receive a new random ID.
*/
/**
 * @typedef SheetsChart
 * @memberOf! slides(v1)
 * @type object
* @property {integer} chartId The ID of the specific chart in the Google Sheets spreadsheet that is
embedded.
* @property {string} spreadsheetId The ID of the Google Sheets spreadsheet that contains the source chart.
* @property {slides(v1).SheetsChartProperties} sheetsChartProperties The properties of the Sheets chart.
* @property {string} contentUrl The URL of an image of the embedded chart, with a default lifetime of 30
minutes. This URL is tagged with the account of the requester. Anyone with
the URL effectively accesses the image as the original requester. Access to
the image may be lost if the presentation&#39;s sharing settings change.
*/
/**
 * @typedef PageProperties
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).PageBackgroundFill} pageBackgroundFill The background fill of the page. If unset, the background fill is inherited
from a parent page if it exists. If the page has no parent, then the
background fill defaults to the corresponding fill in the Slides editor.
* @property {slides(v1).ColorScheme} colorScheme The color scheme of the page. If unset, the color scheme is inherited from
a parent page. If the page has no parent, the color scheme uses a default
Slides color scheme. This field is read-only.
*/
/**
 * @typedef Shadow
 * @memberOf! slides(v1)
 * @type object
* @property {string} alignment The alignment point of the shadow, that sets the origin for translate,
scale and skew of the shadow.
* @property {boolean} rotateWithShape Whether the shadow should rotate with the shape.
* @property {slides(v1).AffineTransform} transform Transform that encodes the translate, scale, and skew of the shadow,
relative to the alignment position.
* @property {slides(v1).OpaqueColor} color The shadow color value.
* @property {slides(v1).Dimension} blurRadius The radius of the shadow blur. The larger the radius, the more diffuse the
shadow becomes.
* @property {string} propertyState The shadow property state.

Updating the the shadow on a page element will implicitly update this field
to `RENDERED`, unless another value is specified in the same request. To
have no shadow on a page element, set this field to `NOT_RENDERED`. In this
case, any other shadow fields set in the same request will be ignored.
* @property {number} alpha The alpha of the shadow&#39;s color, from 0.0 to 1.0.
* @property {string} type The type of the shadow.
*/
/**
 * @typedef LayoutReference
 * @memberOf! slides(v1)
 * @type object
 * @property {string} predefinedLayout Predefined layout.
 * @property {string} layoutId Layout ID: the object ID of one of the layouts in the presentation.
 */
/**
 * @typedef CreateSheetsChartResponse
 * @memberOf! slides(v1)
 * @type object
 * @property {string} objectId The object ID of the created chart.
 */
/**
 * @typedef ReplaceAllTextResponse
 * @memberOf! slides(v1)
 * @type object
 * @property {integer} occurrencesChanged The number of occurrences changed by replacing all text.
 */
/**
 * @typedef LayoutProperties
 * @memberOf! slides(v1)
 * @type object
 * @property {string} displayName The human readable name of the layout in the presentation&#39;s locale.
 * @property {string} masterObjectId The object ID of the master that this layout is based on.
 * @property {string} name The name of the layout.
 */
/**
 * @typedef InsertTableColumnsRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} tableObjectId The table to insert columns into.
* @property {boolean} insertRight Whether to insert new columns to the right of the reference cell location.

- `True`: insert to the right.
- `False`: insert to the left.
* @property {slides(v1).TableCellLocation} cellLocation The reference table cell location from which columns will be inserted.

A new column will be inserted to the left (or right) of the column where
the reference cell is. If the reference cell is a merged cell, a new
column will be inserted to the left (or right) of the merged cell.
* @property {integer} number The number of columns to be inserted. Maximum 20 per request.
*/
/**
 * @typedef DeleteTableColumnRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} tableObjectId The table to delete columns from.
* @property {slides(v1).TableCellLocation} cellLocation The reference table cell location from which a column will be deleted.

The column this cell spans will be deleted. If this is a merged cell,
multiple columns will be deleted. If no columns remain in the table after
this deletion, the whole table is deleted.
*/
/**
 * @typedef TableRow
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).Dimension} rowHeight Height of a row.
* @property {slides(v1).TableCell[]} tableCells Properties and contents of each cell.

Cells that span multiple columns are represented only once with a
column_span greater
than 1. As a result, the length of this collection does not always match
the number of columns of the entire table.
*/
/**
 * @typedef AffineTransform
 * @memberOf! slides(v1)
 * @type object
 * @property {string} unit The units for translate elements.
 * @property {number} shearY The Y coordinate shearing element.
 * @property {number} translateX The X coordinate translation element.
 * @property {number} shearX The X coordinate shearing element.
 * @property {number} scaleY The Y coordinate scaling element.
 * @property {number} scaleX The X coordinate scaling element.
 * @property {number} translateY The Y coordinate translation element.
 */
/**
 * @typedef CreateShapeRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} objectId A user-supplied object ID.

If you specify an ID, it must be unique among all pages and page elements
in the presentation. The ID must start with an alphanumeric character or an
underscore (matches regex `[a-zA-Z0-9_]`); remaining characters
may include those as well as a hyphen or colon (matches regex
`[a-zA-Z0-9_-:]`).
The length of the ID must not be less than 5 or greater than 50.
If empty, a unique identifier will be generated.
* @property {string} shapeType The shape type.
* @property {slides(v1).PageElementProperties} elementProperties The element properties for the shape.
*/
/**
 * @typedef ShapeBackgroundFill
 * @memberOf! slides(v1)
 * @type object
* @property {string} propertyState The background fill property state.

Updating the the fill on a shape will implicitly update this field to
`RENDERED`, unless another value is specified in the same request. To
have no fill on a shape, set this field to `NOT_RENDERED`. In this case,
any other fill fields set in the same request will be ignored.
* @property {slides(v1).SolidFill} solidFill Solid color fill.
*/
/**
 * @typedef Line
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).LineProperties} lineProperties The properties of the line.
 * @property {string} lineType The type of the line.
 */
/**
 * @typedef SheetsChartProperties
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).ImageProperties} chartImageProperties The properties of the embedded chart image.
 */
/**
 * @typedef AutoText
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).TextStyle} style The styling applied to this auto text.
 * @property {string} type The type of this auto text.
 * @property {string} content The rendered content of this auto text, if available.
 */
/**
 * @typedef TextElement
 * @memberOf! slides(v1)
 * @type object
* @property {integer} endIndex The zero-based end index of this text element, exclusive, in Unicode code
units.
* @property {slides(v1).TextRun} textRun A TextElement representing a run of text where all of the characters
in the run have the same TextStyle.

The `start_index` and `end_index` of TextRuns will always be fully
contained in the index range of a single `paragraph_marker` TextElement.
In other words, a TextRun will never span multiple paragraphs.
* @property {integer} startIndex The zero-based start index of this text element, in Unicode code units.
* @property {slides(v1).ParagraphMarker} paragraphMarker A marker representing the beginning of a new paragraph.

The `start_index` and `end_index` of this TextElement represent the
range of the paragraph. Other TextElements with an index range contained
inside this paragraph&#39;s range are considered to be part of this
paragraph. The range of indices of two separate paragraphs will never
overlap.
* @property {slides(v1).AutoText} autoText A TextElement representing a spot in the text that is dynamically
replaced with content that can change over time.
*/
/**
 * @typedef UpdateSlidesPositionRequest
 * @memberOf! slides(v1)
 * @type object
* @property {integer} insertionIndex The index where the slides should be inserted, based on the slide
arrangement before the move takes place. Must be between zero and the
number of slides in the presentation, inclusive.
* @property {string[]} slideObjectIds The IDs of the slides in the presentation that should be moved.
The slides in this list must be in existing presentation order, without
duplicates.
*/
/**
 * @typedef ReplaceAllTextRequest
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).SubstringMatchCriteria} containsText Finds text in a shape matching this substring.
 * @property {string} replaceText The text that will replace the matched text.
 */
/**
 * @typedef ShapeProperties
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).Outline} outline The outline of the shape. If unset, the outline is inherited from a
parent placeholder if it exists. If the shape has no parent, then the
default outline depends on the shape type, matching the defaults for
new shapes created in the Slides editor.
* @property {slides(v1).Link} link The hyperlink destination of the shape. If unset, there is no link. Links
are not inherited from parent placeholders.
* @property {slides(v1).ShapeBackgroundFill} shapeBackgroundFill The background fill of the shape. If unset, the background fill is
inherited from a parent placeholder if it exists. If the shape has no
parent, then the default background fill depends on the shape type,
matching the defaults for new shapes created in the Slides editor.
* @property {slides(v1).Shadow} shadow The shadow properties of the shape. If unset, the shadow is inherited from
a parent placeholder if it exists. If the shape has no parent, then the
default shadow matches the defaults for new shapes created in the Slides
editor. This property is read-only.
*/
/**
 * @typedef CreateLineRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} objectId A user-supplied object ID.

If you specify an ID, it must be unique among all pages and page elements
in the presentation. The ID must start with an alphanumeric character or an
underscore (matches regex `[a-zA-Z0-9_]`); remaining characters
may include those as well as a hyphen or colon (matches regex
`[a-zA-Z0-9_-:]`).
The length of the ID must not be less than 5 or greater than 50.

If you don&#39;t specify an ID, a unique one is generated.
* @property {slides(v1).PageElementProperties} elementProperties The element properties for the line.
* @property {string} lineCategory The category of line to be created.
*/
/**
 * @typedef CreateShapeResponse
 * @memberOf! slides(v1)
 * @type object
 * @property {string} objectId The object ID of the created shape.
 */
/**
 * @typedef CreateSlideResponse
 * @memberOf! slides(v1)
 * @type object
 * @property {string} objectId The object ID of the created slide.
 */
/**
 * @typedef UpdateImagePropertiesRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} objectId The object ID of the image the updates are applied to.
* @property {string} fields The fields that should be updated.

At least one field must be specified. The root `imageProperties` is
implied and should not be specified. A single `&quot;*&quot;` can be used as
short-hand for listing every field.

For example to update the image outline color, set `fields` to
`&quot;outline.outlineFill.solidFill.color&quot;`.

To reset a property to its default value, include its field name in the
field mask but leave the field itself unset.
* @property {slides(v1).ImageProperties} imageProperties The image properties to update.
*/
/**
 * @typedef CreateVideoRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} objectId A user-supplied object ID.

If you specify an ID, it must be unique among all pages and page elements
in the presentation. The ID must start with an alphanumeric character or an
underscore (matches regex `[a-zA-Z0-9_]`); remaining characters
may include those as well as a hyphen or colon (matches regex
`[a-zA-Z0-9_-:]`).
The length of the ID must not be less than 5 or greater than 50.

If you don&#39;t specify an ID, a unique one is generated.
* @property {string} source The video source.
* @property {slides(v1).PageElementProperties} elementProperties The element properties for the video.
* @property {string} id The video source&#39;s unique identifier for this video.

e.g. For YouTube video https://www.youtube.com/watch?v=7U3axjORYZ0,
the ID is 7U3axjORYZ0.
*/
/**
 * @typedef CreateTableRequest
 * @memberOf! slides(v1)
 * @type object
* @property {integer} columns Number of columns in the table.
* @property {string} objectId A user-supplied object ID.

If you specify an ID, it must be unique among all pages and page elements
in the presentation. The ID must start with an alphanumeric character or an
underscore (matches regex `[a-zA-Z0-9_]`); remaining characters
may include those as well as a hyphen or colon (matches regex
`[a-zA-Z0-9_-:]`).
The length of the ID must not be less than 5 or greater than 50.

If you don&#39;t specify an ID, a unique one is generated.
* @property {integer} rows Number of rows in the table.
* @property {slides(v1).PageElementProperties} elementProperties The element properties for the table.

The table will be created at the provided size, subject to a minimum size.
If no size is provided, the table will be automatically sized.

Table transforms must have a scale of 1 and no shear components. If no
transform is provided, the table will be centered on the page.
*/
/**
 * @typedef OptionalColor
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).OpaqueColor} opaqueColor If set, this will be used as an opaque color. If unset, this represents
a transparent color.
*/
/**
 * @typedef TextRun
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).TextStyle} style The styling applied to this run.
 * @property {string} content The text of this run.
 */
/**
 * @typedef Shape
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).TextContent} text The text content of the shape.
* @property {slides(v1).ShapeProperties} shapeProperties The properties of the shape.
* @property {string} shapeType The type of the shape.
* @property {slides(v1).Placeholder} placeholder Placeholders are shapes that are inherit from corresponding placeholders on
layouts and masters.

If set, the shape is a placeholder shape and any inherited properties
can be resolved by looking at the parent placeholder identified by the
Placeholder.parent_object_id field.
*/
/**
 * @typedef BatchUpdatePresentationResponse
 * @memberOf! slides(v1)
 * @type object
* @property {string} presentationId The presentation the updates were applied to.
* @property {slides(v1).Response[]} replies The reply of the updates.  This maps 1:1 with the updates, although
replies to some requests may be empty.
*/
/**
 * @typedef ImageProperties
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).CropProperties} cropProperties The crop properties of the image. If not set, the image is not cropped.
This property is read-only.
* @property {slides(v1).Outline} outline The outline of the image. If not set, the the image has no outline.
* @property {slides(v1).Shadow} shadow The shadow of the image. If not set, the image has no shadow. This property
is read-only.
* @property {number} transparency The transparency effect of the image. The value should be in the interval
[0.0, 1.0], where 0 means no effect and 1 means completely transparent.
This property is read-only.
* @property {number} contrast The contrast effect of the image. The value should be in the interval
[-1.0, 1.0], where 0 means no effect. This property is read-only.
* @property {slides(v1).Link} link The hyperlink destination of the image. If unset, there is no link.
* @property {slides(v1).Recolor} recolor The recolor effect of the image. If not set, the image is not recolored.
This property is read-only.
* @property {number} brightness The brightness effect of the image. The value should be in the interval
[-1.0, 1.0], where 0 means no effect. This property is read-only.
*/
/**
 * @typedef Group
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).PageElement[]} children The collection of elements in the group. The minimum size of a group is 2.
 */
/**
 * @typedef Outline
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).Dimension} weight The thickness of the outline.
* @property {string} dashStyle The dash style of the outline.
* @property {string} propertyState The outline property state.

Updating the the outline on a page element will implicitly update this
field to`RENDERED`, unless another value is specified in the same request.
To have no outline on a page element, set this field to `NOT_RENDERED`. In
this case, any other outline fields set in the same request will be
ignored.
* @property {slides(v1).OutlineFill} outlineFill The fill of the outline.
*/
/**
 * @typedef TableCell
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).TextContent} text The text content of the cell.
 * @property {slides(v1).TableCellLocation} location The location of the cell within the table.
 * @property {integer} rowSpan Row span of the cell.
 * @property {slides(v1).TableCellProperties} tableCellProperties The properties of the table cell.
 * @property {integer} columnSpan Column span of the cell.
 */
/**
 * @typedef ReplaceAllShapesWithImageResponse
 * @memberOf! slides(v1)
 * @type object
 * @property {integer} occurrencesChanged The number of shapes replaced with images.
 */
/**
 * @typedef CreateSlideRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} objectId A user-supplied object ID.

If you specify an ID, it must be unique among all pages and page elements
in the presentation. The ID must start with an alphanumeric character or an
underscore (matches regex `[a-zA-Z0-9_]`); remaining characters
may include those as well as a hyphen or colon (matches regex
`[a-zA-Z0-9_-:]`).
The length of the ID must not be less than 5 or greater than 50.

If you don&#39;t specify an ID, a unique one is generated.
* @property {integer} insertionIndex The optional zero-based index indicating where to insert the slides.

If you don&#39;t specify an index, the new slide is created at the end.
* @property {slides(v1).LayoutReference} slideLayoutReference Layout reference of the slide to be inserted, based on the *current
master*, which is one of the following:

- The master of the previous slide index.
- The master of the first slide, if the insertion_index is zero.
- The first master in the presentation, if there are no slides.

If the LayoutReference is not found in the current master, a 400 bad
request error is returned.

If you don&#39;t specify a layout reference, then the new slide will use the
predefined layout `BLANK`.
*/
/**
 * @typedef TableCellProperties
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).TableCellBackgroundFill} tableCellBackgroundFill The background fill of the table cell. The default fill matches the fill
for newly created table cells in the Slides editor.
*/
/**
 * @typedef CreateTableResponse
 * @memberOf! slides(v1)
 * @type object
 * @property {string} objectId The object ID of the created table.
 */
/**
 * @typedef Size
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).Dimension} width The width of the object.
 * @property {slides(v1).Dimension} height The height of the object.
 */
/**
 * @typedef ColorScheme
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).ThemeColorPair[]} colors The ThemeColorType and corresponding concrete color pairs.
 */
/**
 * @typedef ParagraphMarker
 * @memberOf! slides(v1)
 * @type object
* @property {slides(v1).ParagraphStyle} style The paragraph&#39;s style
* @property {slides(v1).Bullet} bullet The bullet for this paragraph. If not present, the paragraph does not
belong to a list.
*/
/**
 * @typedef CreateParagraphBulletsRequest
 * @memberOf! slides(v1)
 * @type object
* @property {string} objectId The object ID of the shape or table containing the text to add bullets to.
* @property {slides(v1).Range} textRange The range of text to apply the bullet presets to, based on TextElement indexes.
* @property {string} bulletPreset The kinds of bullet glyphs to be used. Defaults to the
`BULLET_DISC_CIRCLE_SQUARE` preset.
* @property {slides(v1).TableCellLocation} cellLocation The optional table cell location if the text to be modified is in a table
cell. If present, the object_id must refer to a table.
*/
/**
 * @typedef SubstringMatchCriteria
 * @memberOf! slides(v1)
 * @type object
* @property {string} text The text to search for in the shape or table.
* @property {boolean} matchCase Indicates whether the search should respect case:

- `True`: the search is case sensitive.
- `False`: the search is case insensitive.
*/
/**
 * @typedef WordArt
 * @memberOf! slides(v1)
 * @type object
 * @property {string} renderedText The text rendered as word art.
 */
/**
 * @typedef Range
 * @memberOf! slides(v1)
 * @type object
* @property {integer} endIndex The optional zero-based index of the end of the collection.
Required for `SPECIFIC_RANGE` delete mode.
* @property {integer} startIndex The optional zero-based index of the beginning of the collection.
Required for `SPECIFIC_RANGE` and `FROM_START_INDEX` ranges.
* @property {string} type The type of range.
*/
/**
 * @typedef TableColumnProperties
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).Dimension} columnWidth Width of a column.
 */
/**
 * @typedef Request
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).CreateParagraphBulletsRequest} createParagraphBullets Creates bullets for paragraphs.
 * @property {slides(v1).InsertTableColumnsRequest} insertTableColumns Inserts columns into a table.
 * @property {slides(v1).CreateTableRequest} createTable Creates a new table.
 * @property {slides(v1).DeleteTextRequest} deleteText Deletes text from a shape or a table cell.
 * @property {slides(v1).ReplaceAllTextRequest} replaceAllText Replaces all instances of specified text.
 * @property {slides(v1).UpdateVideoPropertiesRequest} updateVideoProperties Updates the properties of a Video.
 * @property {slides(v1).InsertTextRequest} insertText Inserts text into a shape or table cell.
 * @property {slides(v1).DeleteTableRowRequest} deleteTableRow Deletes a row from a table.
 * @property {slides(v1).CreateLineRequest} createLine Creates a line.
 * @property {slides(v1).UpdateTextStyleRequest} updateTextStyle Updates the styling of text within a Shape or Table.
 * @property {slides(v1).InsertTableRowsRequest} insertTableRows Inserts rows into a table.
 * @property {slides(v1).UpdateTableCellPropertiesRequest} updateTableCellProperties Updates the properties of a TableCell.
 * @property {slides(v1).RefreshSheetsChartRequest} refreshSheetsChart Refreshes a Google Sheets chart.
 * @property {slides(v1).CreateSheetsChartRequest} createSheetsChart Creates an embedded Google Sheets chart.
 * @property {slides(v1).UpdatePagePropertiesRequest} updatePageProperties Updates the properties of a Page.
 * @property {slides(v1).UpdateShapePropertiesRequest} updateShapeProperties Updates the properties of a Shape.
 * @property {slides(v1).CreateSlideRequest} createSlide Creates a new slide.
 * @property {slides(v1).DeleteObjectRequest} deleteObject Deletes a page or page element from the presentation.
 * @property {slides(v1).CreateShapeRequest} createShape Creates a new shape.
 * @property {slides(v1).UpdatePageElementTransformRequest} updatePageElementTransform Updates the transform of a page element.
 * @property {slides(v1).UpdateSlidesPositionRequest} updateSlidesPosition Updates the position of a set of slides in the presentation.
 * @property {slides(v1).ReplaceAllShapesWithImageRequest} replaceAllShapesWithImage Replaces all shapes matching some criteria with an image.
 * @property {slides(v1).UpdateImagePropertiesRequest} updateImageProperties Updates the properties of an Image.
 * @property {slides(v1).CreateVideoRequest} createVideo Creates a video.
 * @property {slides(v1).CreateImageRequest} createImage Creates an image.
 * @property {slides(v1).DuplicateObjectRequest} duplicateObject Duplicates a slide or page element.
 * @property {slides(v1).DeleteTableColumnRequest} deleteTableColumn Deletes a column from a table.
 * @property {slides(v1).UpdateLinePropertiesRequest} updateLineProperties Updates the properties of a Line.
 */
/**
 * @typedef LineFill
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).SolidFill} solidFill Solid color fill.
 */
/**
 * @typedef OutlineFill
 * @memberOf! slides(v1)
 * @type object
 * @property {slides(v1).SolidFill} solidFill Solid color fill.
 */
/**
 * @typedef Bullet
 * @memberOf! slides(v1)
 * @type object
 * @property {integer} nestingLevel The nesting level of this paragraph in the list.
 * @property {string} glyph The rendered bullet glyph for this paragraph.
 * @property {slides(v1).TextStyle} bulletStyle The paragraph specific text style applied to this bullet.
 * @property {string} listId The ID of the list this paragraph belongs to.
 */
module.exports = Slides;
