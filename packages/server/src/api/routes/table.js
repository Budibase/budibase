const Router = require("@koa/router")
const tableController = require("../controllers/table")
const authorized = require("../../middleware/authorized")
const { paramResource, bodyResource } = require("../../middleware/resourceId")
const {
  BUILDER,
  PermissionLevels,
  PermissionTypes,
} = require("@budibase/backend-core/permissions")
const { tableValidator } = require("./utils/validators")

const router = new Router()

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
    authorized(PermissionTypes.TABLE, PermissionLevels.READ, { schema: true }),
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
   * @apiParam (Body) {object} [dataImport] When creating an internal table it can be built from a CSV, by using the
   * CSV validation endpoint. Send the CSV data to the validation endpoint, then put the results of that call
   * into this property, along with the CSV and a table/rows will be built from it. This is not supported when updating
   * or for external tables.
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
   *   "dataImport": {
   *     "csvString": "column\nvalue",
   *     "primaryDisplay": "column",
   *     "schema": {
   *       "column": {
   *         "type": "string"
   *       }
   *     }
   *   }
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
  /**
   * @api {post} /api/tables/csv/validate Validate a CSV for a table
   * @apiName Validate a CSV for a table
   * @apiGroup tables
   * @apiPermission builder
   * @apiDescription When creating a new table, or importing a CSV to an existing table the CSV must be validated and
   * converted into a Budibase schema; this endpoint does this.
   *
   * @apiParam (Body) {string} csvString The CSV which is to be validated as a string.
   * @apiParam (Body) {object} [schema] When a CSV has been validated it is possible to re-validate after changing the
   * type of a field, by default everything will be strings as there is no way to infer types. The returned schema can
   * be updated and then returned to the endpoint to re-validate and check if the type will work for the CSV, e.g.
   * using a number instead of strings.
   * @apiParam (Body) {string} [tableId] If importing data to an existing table this will pull the current table and
   * remove any fields from the CSV schema which do not exist on the table/don't match the type of the table. When
   * importing a CSV to an existing table only fields that are present on the table can be imported.
   *
   * @apiSuccess {object} schema The response body will contain a "schema" object that represents the schema found for
   * the CSV - this will be in the same format used for table schema.s
   */
  .post(
    "/api/tables/csv/validate",
    authorized(BUILDER),
    tableController.validateCSVSchema
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
   * @apiParam (Body) {object} dataImport This is the same as the structure used when creating an internal table with
   * a CSV, it will have the "schema" returned from the CSV validation endpoint and the "csvString" which is to be
   * turned into rows.
   *
   * @apiSuccess {string} message A message stating that the data was imported successfully.
   */
  .post(
    "/api/tables/:tableId/import",
    paramResource("tableId"),
    authorized(BUILDER),
    tableController.bulkImport
  )

module.exports = router
