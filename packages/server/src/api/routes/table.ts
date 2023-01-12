import Router from "@koa/router"
import * as tableController from "../controllers/table"
import authorized from "../../middleware/authorized"
import { paramResource, bodyResource } from "../../middleware/resourceId"
import { permissions } from "@budibase/backend-core"
import { tableValidator } from "./utils/validators"
const { BUILDER, PermissionLevel, PermissionType } = permissions

const router: Router = new Router()

router
  /**
   * @api {get} /api/tables Fetch all tables
   * @apiName Fetch all tables
   * @apiGroup tables
   * @apiPermission table read access
   * @apiDescription This endpoint retrieves all of the tables which have been created in
   * an app. This includes all of the external and internal tables; to tell the difference
   * between these look for the "type" property on each table, either being "internal" or "external".
   *
   * @apiSuccess {object[]} body The response body will be the list of tables that was found - as
   * this does not take any parameters the only error scenario is no access.
   */
  .get("/api/tables", authorized(BUILDER), tableController.fetch)
  /**
   * @api {get} /api/tables/:id Fetch a single table
   * @apiName Fetch a single table
   * @apiGroup tables
   * @apiPermission table read access
   * @apiDescription Retrieves a single table this could be be internal or external based on
   * the provided table ID.
   *
   * @apiParam {string} id The ID of the table which is to be retrieved.
   *
   * @apiSuccess {object[]} body The response body will be the table that was found.
   */
  .get(
    "/api/tables/:tableId",
    paramResource("tableId"),
    authorized(PermissionType.TABLE, PermissionLevel.READ, { schema: true }),
    tableController.find
  )
  /**
   * @api {post} /api/tables Save a table
   * @apiName Save a table
   * @apiGroup tables
   * @apiPermission builder
   * @apiDescription Create or update a table with this endpoint, this will function for both internal
   * external tables.
   *
   * @apiParam (Body) {string} [_id] If updating an existing table then the ID of the table must be specified.
   * @apiParam (Body) {string} [_rev] If updating an existing internal table then the revision must also be specified.
   * @apiParam (Body) {string} type] This should either be "internal" or "external" depending on the table type -
   * this will default to internal.
   * @apiParam (Body) {string} [sourceId] If creating an external table then this should be set to the datasource ID. If
   * building an internal table this does not need to be set, although it will be returned as "bb_internal".
   * @apiParam (Body) {string} name The name of the table, this will be used in the UI. To rename the table simply
   * supply the table structure to this endpoint with the name changed.
   * @apiParam (Body) {object} schema A key value object which has all of the columns in the table as the keys in this
   * object. For each column a "type" and "constraints" must be specified, with some types requiring further information.
   * More information about the schema structure can be found in the Typescript definitions.
   * @apiParam (Body) {string} [primaryDisplay] The name of the column which should be used when displaying rows
   * from this table as relationships.
   * @apiParam (Body) {object[]} [indexes] Specifies the search indexes - this is deprecated behaviour with the introduction
   * of lucene indexes. This functionality is only available for internal tables.
   * @apiParam (Body) {object} [_rename] If a column is to be renamed then the "old" column name should be set in this
   * structure, and the "updated", new column name should also be supplied. The schema should also be updated, this field
   * lets the server know that a field hasn't just been deleted, that the data has moved to a new name, this will fix
   * the rows in the table. This functionality is only available for internal tables.
   * @apiParam (Body) {object[]} [rows] When creating a table using a compatible data source, an array of objects to be imported into the new table can be provided.
   *
   * @apiParamExample {json} Example:
   * {
   *   "_id": "ta_05541307fa0f4044abee071ca2a82119",
   *   "_rev": "10-0fbe4e78f69b255d79f1017e2eeef807",
   *   "type": "internal",
   *   "views": {},
   *   "name": "tableName",
   *   "schema": {
   *     "column": {
   *       "type": "string",
   *       "constraints": {
   *         "type": "string",
   *         "length": {
   *           "maximum": null
   *         },
   *         "presence": false
   *       },
   *       "name": "column"
   *     },
   *   },
   *   "primaryDisplay": "column",
   *   "indexes": [],
   *   "sourceId": "bb_internal",
   *   "_rename": {
   *     "old": "columnName",
   *     "updated": "newColumnName",
   *   },
   *   "rows": []
   * }
   *
   * @apiSuccess {object} table The response body will contain the table structure after being cleaned up and
   * saved to the database.
   */
  .post(
    "/api/tables",
    // allows control over updating a table
    bodyResource("_id"),
    authorized(BUILDER),
    tableValidator(),
    tableController.save
  )
  .post(
    "/api/convert/csvToJson",
    authorized(BUILDER),
    tableController.csvToJson
  )
  .post(
    "/api/tables/validateNewTableImport",
    authorized(BUILDER),
    tableController.validateNewTableImport
  )
  .post(
    "/api/tables/validateExistingTableImport",
    authorized(BUILDER),
    tableController.validateExistingTableImport
  )
  /**
   * @api {post} /api/tables/:tableId/:revId Delete a table
   * @apiName Delete a table
   * @apiGroup tables
   * @apiPermission builder
   * @apiDescription This endpoint will delete a table and all of its associated data, for this reason it is
   * quite dangerous - it will work for internal and external tables.
   *
   * @apiParam {string} tableId The ID of the table which is to be deleted.
   * @apiParam {string} [revId] If deleting an internal table then the revision must also be supplied (_rev), for
   * external tables this can simply be set to anything, e.g. "external".
   *
   * @apiSuccess {string} message A message stating that the table was deleted successfully.
   */
  .delete(
    "/api/tables/:tableId/:revId",
    paramResource("tableId"),
    authorized(BUILDER),
    tableController.destroy
  )
  /**
   * @api {post} /api/tables/:tableId/:revId Import CSV to existing table
   * @apiName Import CSV to existing table
   * @apiGroup tables
   * @apiPermission builder
   * @apiDescription This endpoint will import data to existing tables, internal or external. It is used in combination
   * with the CSV validation endpoint. Take the output of the CSV validation endpoint and pass it to this endpoint to
   * import the data; please note this will only import fields that already exist on the table/match the type.
   *
   * @apiParam {string} tableId The ID of the table which the data should be imported to.
   *
   * @apiParam (Body) {object[]} rows An array of objects representing the rows to be imported, key-value pairs not matching the table schema will be ignored.
   *
   * @apiSuccess {string} message A message stating that the data was imported successfully.
   */
  .post(
    "/api/tables/:tableId/import",
    paramResource("tableId"),
    authorized(BUILDER),
    tableController.bulkImport
  )

export default router
