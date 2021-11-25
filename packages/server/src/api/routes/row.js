const Router = require("@koa/router")
const rowController = require("../controllers/row")
const authorized = require("../../middleware/authorized")
const usage = require("../../middleware/usageQuota")
const {
  paramResource,
  paramSubResource,
} = require("../../middleware/resourceId")
const {
  PermissionLevels,
  PermissionTypes,
} = require("@budibase/auth/permissions")

const router = Router()

router
  /**
   * @api {get} /api/:tableId/:rowId/enrich Get an enriched row
   * @apiName /api/:tableId/:rowId/enrich
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
   * @apiError {string} message If the table or row could not be found then an error will be thrown.
   */
  .get(
    "/api/:tableId/:rowId/enrich",
    paramSubResource("tableId", "rowId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.fetchEnrichedRow
  )
  /**
   * @api {get} /api/:tableId/rows Get all rows in a table
   * @apiName /api/:tableId/rows
   * @apiGroup rows
   * @apiPermission table read access
   * @apiDescription This is a deprecated endpoint that should not be used anymore, instead use the search endpoint.
   * This endpoint gets all of the rows within the specified table - it is not heavily used
   * due to its lack of support for pagination. With SQL tables this will retrieve up to a limit and then
   * will simply stop.
   *
   * @apiParam {string} tableId The ID of the table to retrieve all rows within.
   *
   * @apiSuccess {object[]} rows The response body will be an array of all rows found.
   * @apiError {string} message If the table could not be found then an error will be thrown.
   */
  .get(
    "/api/:tableId/rows",
    paramResource("tableId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.fetch
  )
  /**
   * @api {get} /api/:tableId/rows/:rowId Retrieve a single row
   * @apiName /api/:tableId/rows/:rowId
   * @apiGroup rows
   * @apiPermission table read access
   * @apiDescription This endpoint retrieves only the specified row. If you wish to retrieve
   * a row by anything other than its _id field, use the search endpoint.
   *
   * @apiParam {string} tableId The ID of the table to retrieve a row from.
   * @apiParam {string} rowId The ID of the row to retrieve.
   *
   * @apiSuccess {object} row The response body will be the row that was found.
   * @apiError {string} message If the table or row could not be found then an error will be thrown.
   */
  .get(
    "/api/:tableId/rows/:rowId",
    paramSubResource("tableId", "rowId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.find
  )
  /**
   * @api {post} /api/:tableId/search Search for rows in a table
   * @apiName /api/:tableId/search
   * @apiGroup rows
   * @apiPermission table read access
   * @apiDescription This is the primary method of accessing rows in Budibase, the data provider
   * and data UI in the builder are built atop this. All filtering, sorting and pagination is
   * handled through this, for internal and external (datasource plus, e.g. SQL) tables.
   *
   * @apiBody
   *
   */
  .post(
    "/api/:tableId/search",
    paramResource("tableId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.search
  )
  // DEPRECATED - this is an old API, but for backwards compat it needs to be
  // supported still
  .post(
    "/api/search/:tableId/rows",
    paramResource("tableId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    rowController.search
  )
  .post(
    "/api/:tableId/rows",
    paramResource("tableId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    usage,
    rowController.save
  )
  .patch(
    "/api/:tableId/rows",
    paramResource("tableId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    rowController.patch
  )
  .post(
    "/api/:tableId/rows/validate",
    paramResource("tableId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    rowController.validate
  )
  .delete(
    "/api/:tableId/rows",
    paramResource("tableId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    usage,
    rowController.destroy
  )

module.exports = router
