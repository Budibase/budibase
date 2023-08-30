import Router from "@koa/router"
import * as rowController from "../controllers/row"
import authorized, { authorizedResource } from "../../middleware/authorized"
import { paramResource, paramSubResource } from "../../middleware/resourceId"
import { permissions } from "@budibase/backend-core"
import { internalSearchValidator } from "./utils/validators"
import trimViewRowInfo from "../../middleware/trimViewRowInfo"

const { PermissionType, PermissionLevel } = permissions

const router: Router = new Router()

router
  /**
   * @api {get} /api/:sourceId/:rowId/enrich Get an enriched row
   * @apiName Get an enriched row
   * @apiGroup rows
   * @apiPermission table read access
   * @apiDescription This API is only useful when dealing with rows that have relationships.
   * Normally when a row is a returned from the API relationships will only have the structure
   * `{ primaryDisplay: "name", _id: ... }` but this call will return the full related rows
   * for each relationship instead.
   *
   * @apiParam {string} rowId The ID of the row which is to be retrieved and enriched.
   *
   * @apiSuccess {object} row The response body will be the enriched row.
   */
  .get(
    "/api/:sourceId/:rowId/enrich",
    paramSubResource("sourceId", "rowId"),
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    rowController.fetchEnrichedRow
  )
  /**
   * @api {get} /api/:sourceId/rows Get all rows in a table
   * @apiName Get all rows in a table
   * @apiGroup rows
   * @apiPermission table read access
   * @apiDescription This is a deprecated endpoint that should not be used anymore, instead use the search endpoint.
   * This endpoint gets all of the rows within the specified table - it is not heavily used
   * due to its lack of support for pagination. With SQL tables this will retrieve up to a limit and then
   * will simply stop.
   *
   * @apiParam {string} sourceId The ID of the table to retrieve all rows within.
   *
   * @apiSuccess {object[]} rows The response body will be an array of all rows found.
   */
  .get(
    "/api/:sourceId/rows",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    rowController.fetch
  )
  /**
   * @api {get} /api/:sourceId/rows/:rowId Retrieve a single row
   * @apiName Retrieve a single row
   * @apiGroup rows
   * @apiPermission table read access
   * @apiDescription This endpoint retrieves only the specified row. If you wish to retrieve
   * a row by anything other than its _id field, use the search endpoint.
   *
   * @apiParam {string} sourceId The ID of the table to retrieve a row from.
   * @apiParam {string} rowId The ID of the row to retrieve.
   *
   * @apiSuccess {object} body The response body will be the row that was found.
   */
  .get(
    "/api/:sourceId/rows/:rowId",
    paramSubResource("sourceId", "rowId"),
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    rowController.find
  )
  /**
   * @api {post} /api/:sourceId/search Search for rows in a table
   * @apiName Search for rows in a table
   * @apiGroup rows
   * @apiPermission table read access
   * @apiDescription This is the primary method of accessing rows in Budibase, the data provider
   * and data UI in the builder are built atop this. All filtering, sorting and pagination is
   * handled through this, for internal and external (datasource plus, e.g. SQL) tables.
   *
   * @apiParam {string} sourceId The ID of the table to retrieve rows from.
   *
   * @apiParam (Body) {boolean} [paginate] If pagination is required then this should be set to true,
   * defaults to false.
   * @apiParam (Body) {object} [query] This contains a set of filters which should be applied, if none
   * specified then the request will be unfiltered. An example with all of the possible query
   * options has been supplied below.
   * @apiParam (Body) {number} [limit] This sets a limit for the number of rows that will be returned,
   * this will be implemented at the database level if supported for performance reasons. This
   * is useful when paginating to set exactly how many rows per page.
   * @apiParam (Body) {string} [bookmark] If pagination is enabled then a bookmark will be returned
   * with each successful search request, this should be supplied back to get the next page.
   * @apiParam (Body) {object} [sort] If sort is desired this should contain the name of the column to
   * sort on.
   * @apiParam (Body) {string} [sortOrder] If sort is enabled then this can be either "descending" or
   * "ascending" as required.
   * @apiParam (Body) {string} [sortType] If sort is enabled then you must specify the type of search
   * being used, either "string" or "number". This is only used for internal tables.
   *
   * @apiParamExample {json} Example:
   * {
   *  "tableId": "ta_70260ff0b85c467ca74364aefc46f26d",
   *  "query": {
   *    "string": {},
   *    "fuzzy": {},
   *    "range": {
   *      "columnName": {
   *        "high": 20,
   *        "low": 10,
   *      }
   *    },
   *    "equal": {
   *      "columnName": "someValue"
   *    },
   *    "notEqual": {},
   *    "empty": {},
   *    "notEmpty": {},
   *    "oneOf": {
   *      "columnName": ["value"]
   *    }
   *  },
   *  "limit": 10,
   *  "sort": "name",
   *  "sortOrder": "descending",
   *  "sortType": "string",
   *  "paginate": true
   * }
   *
   * @apiSuccess {object[]} rows An array of rows that was found based on the supplied parameters.
   * @apiSuccess {boolean} hasNextPage If pagination was enabled then this specifies whether or
   * not there is another page after this request.
   * @apiSuccess {string} bookmark The bookmark to be sent with the next request to get the next
   * page.
   */
  .post(
    "/api/:sourceId/search",
    internalSearchValidator(),
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    rowController.search
  )
  // DEPRECATED - this is an old API, but for backwards compat it needs to be
  // supported still
  .post(
    "/api/search/:sourceId/rows",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    rowController.search
  )
  /**
   * @api {post} /api/:sourceId/rows Creates a new row
   * @apiName Creates a new row
   * @apiGroup rows
   * @apiPermission table write access
   * @apiDescription This API will create a new row based on the supplied body. If the
   * body includes an "_id" field then it will update an existing row if the field
   * links to one. Please note that "_id", "_rev" and "tableId" are fields that are
   * already used by Budibase tables and cannot be used for columns.
   *
   * @apiParam {string} sourceId The ID of the table to save a row to.
   *
   * @apiParam (Body) {string} [_id] If the row exists already then an ID for the row must be provided.
   * @apiParam (Body) {string} [_rev] If working with an existing row for an internal table its revision
   * must also be provided.
   * @apiParam (Body) {string} tableId The ID of the table should also be specified in the row body itself.
   * @apiParam (Body) {any} [any] Any field supplied in the body will be assessed to see if it matches
   * a column in the specified table. All other fields will be dropped and not stored.
   *
   * @apiSuccess {string} _id The ID of the row that was just saved, if it was just created this
   * is the rows new ID.
   * @apiSuccess {string} [_rev] If saving to an internal table a revision will also be returned.
   * @apiSuccess {object} body The contents of the row that was saved will be returned as well.
   */
  .post(
    "/api/:sourceId/rows",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    trimViewRowInfo,
    rowController.save
  )
  /**
   * @api {patch} /api/:sourceId/rows Updates a row
   * @apiName Update a row
   * @apiGroup rows
   * @apiPermission table write access
   * @apiDescription This endpoint is identical to the row creation endpoint but instead it will
   * error if an _id isn't provided, it will only function for existing rows.
   */
  .patch(
    "/api/:sourceId/rows",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    trimViewRowInfo,
    rowController.patch
  )
  /**
   * @api {post} /api/:sourceId/rows/validate Validate inputs for a row
   * @apiName Validate inputs for a row
   * @apiGroup rows
   * @apiPermission table write access
   * @apiDescription When attempting to save a row you may want to check if the row is valid
   * given the table schema, this will iterate through all the constraints on the table and
   * check if the request body is valid.
   *
   * @apiParam {string} sourceId The ID of the table the row is to be validated for.
   *
   * @apiParam (Body) {any} [any] Any fields provided in the request body will be tested
   * against the table schema and constraints.
   *
   * @apiSuccess {boolean} valid If inputs provided are acceptable within the table schema this
   * will be true, if it is not then then errors property will be populated.
   * @apiSuccess {object} [errors] A key value map of information about fields on the input
   * which do not match the table schema. The key name will be the column names that have breached
   * the schema.
   */
  .post(
    "/api/:sourceId/rows/validate",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    rowController.validate
  )
  /**
   * @api {delete} /api/:sourceId/rows Delete rows
   * @apiName Delete rows
   * @apiGroup rows
   * @apiPermission table write access
   * @apiDescription This endpoint can delete a single row, or delete them in a bulk
   * fashion.
   *
   * @apiParam {string} sourceId The ID of the table the row is to be deleted from.
   *
   * @apiParam (Body) {object[]} [rows] If bulk deletion is desired then provide the rows in this
   * key of the request body that are to be deleted.
   * @apiParam (Body) {string} [_id] If deleting a single row then provide its ID in this field.
   * @apiParam (Body) {string} [_rev] If deleting a single row from an internal table then provide its
   * revision here.
   *
   * @apiSuccess {object[]|object} body If deleting bulk then the response body will be an array
   * of the deleted rows, if deleting a single row then the body will contain a "row" property which
   * is the deleted row.
   */
  .delete(
    "/api/:sourceId/rows",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    trimViewRowInfo,
    rowController.destroy
  )

  /**
   * @api {post} /api/:sourceId/rows/exportRows Export Rows
   * @apiName Export rows
   * @apiGroup rows
   * @apiPermission table write access
   * @apiDescription This API can export a number of provided rows
   *
   * @apiParam {string} sourceId The ID of the table the row is to be deleted from.
   *
   * @apiParam (Body) {object[]} [rows] The row IDs which are to be exported
   *
   * @apiSuccess {object[]|object}
   */
  .post(
    "/api/:sourceId/rows/exportRows",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    rowController.exportRows
  )

router.post(
  "/api/v2/views/:viewId/search",
  authorizedResource(PermissionType.VIEW, PermissionLevel.READ, "viewId"),
  rowController.views.searchView
)

export default router
