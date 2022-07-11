import controller from "../../controllers/public/rows"
import Endpoint from "./utils/Endpoint"
import { externalSearchValidator } from "../utils/validators"

const read = [],
  write = []

/**
 * @openapi
 * /tables/{tableId}/rows:
 *   post:
 *     summary: Create a row
 *     description: Creates a row within the specified table.
 *     tags:
 *       - rows
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/appId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/row'
 *           examples:
 *             row:
 *               $ref: '#/components/examples/inputRow'
 *     responses:
 *       200:
 *         description: Returns the created row, including the ID which has been generated for it.
 *           This can be found in the Budibase portal, viewed under the developer information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/rowOutput'
 *             examples:
 *               row:
 *                 $ref: '#/components/examples/row'
 */
write.push(new Endpoint("post", "/tables/:tableId/rows", controller.create))

/**
 * @openapi
 * /tables/{tableId}/rows/{rowId}:
 *   put:
 *     summary: Update a row
 *     description: Updates a row within the specified table.
 *     tags:
 *       - rows
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/rowId'
 *       - $ref: '#/components/parameters/appId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/row'
 *           examples:
 *             row:
 *               $ref: '#/components/examples/inputRow'
 *     responses:
 *       200:
 *         description: Returns the created row, including the ID which has been generated for it.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/rowOutput'
 *             examples:
 *               row:
 *                 $ref: '#/components/examples/row'
 */
write.push(
  new Endpoint("put", "/tables/:tableId/rows/:rowId", controller.update)
)

/**
 * @openapi
 * /tables/{tableId}/rows/{rowId}:
 *   delete:
 *     summary: Delete a row
 *     description: Deletes a row within the specified table.
 *     tags:
 *       - rows
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/rowId'
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the deleted row, including the ID which has been generated for it.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/rowOutput'
 *             examples:
 *               row:
 *                 $ref: '#/components/examples/row'
 */
write.push(
  new Endpoint("delete", "/tables/:tableId/rows/:rowId", controller.destroy)
)

/**
 * @openapi
 * /tables/{tableId}/rows/{rowId}:
 *   get:
 *     summary: Retrieve a row
 *     description: This gets a single row, it will be enriched with the full related rows, rather than
 *       the squashed "primaryDisplay" format returned by the search endpoint.
 *     tags:
 *       - rows
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/rowId'
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the retrieved row.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/rowOutput'
 *             examples:
 *               enrichedRow:
 *                 $ref: '#/components/examples/enrichedRow'
 */
read.push(new Endpoint("get", "/tables/:tableId/rows/:rowId", controller.read))

/**
 * @openapi
 * /tables/{tableId}/rows/search:
 *   post:
 *     summary: Search for rows
 *     tags:
 *       - rows
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/appId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: object
 *                 properties:
 *                   allOr:
 *                     type: boolean
 *                     description: Specifies that a row should be returned if it satisfies
 *                       any of the specified options, rather than requiring it to fulfill all
 *                       the search parameters. This defaults to false, meaning AND logic will be used.
 *                   string:
 *                     type: object
 *                     example:
 *                       columnName1: value
 *                       columnName2: value
 *                     description: A map of field name to the string to search for,
 *                       this will look for rows that have a value starting with the
 *                       string value.
 *                     additionalProperties:
 *                       type: string
 *                       description: The value to search for in the column.
 *                   fuzzy:
 *                     type: object
 *                     description: A fuzzy search, only supported by internal tables.
 *                   range:
 *                     type: object
 *                     description: Searches within a range, the format of this must be
 *                       in the format of an object with a "low" and "high" property.
 *                     example:
 *                       columnName1: { low: 10, high: 20 }
 *                   equal:
 *                     type: object
 *                     description: Searches for rows that have a column value that is
 *                       exactly the value set.
 *                   notEqual:
 *                     type: object
 *                     description: Searches for any row which does not contain the specified
 *                       column value.
 *                   empty:
 *                     type: object
 *                     description: Searches for rows which do not contain the specified column.
 *                       The object should simply contain keys of the column names, these
 *                       can map to any value.
 *                     example:
 *                       columnName1: ""
 *                   notEmpty:
 *                     type: object
 *                     description: Searches for rows which have the specified column.
 *                   oneOf:
 *                     type: object
 *                     description: Searches for rows which have a column value that is any
 *                       of the specified values. The format of this must be columnName -> [value1, value2].
 *               paginate:
 *                 type: boolean
 *                 description: Enables pagination, by default this is disabled.
 *               bookmark:
 *                 oneOf:
 *                   - type: string
 *                   - type: integer
 *                 description: If retrieving another page, the bookmark from the previous request must be supplied.
 *               limit:
 *                 type: integer
 *                 description: The maximum number of rows to return, useful when paginating, for internal tables this
 *                   will be limited to 1000, for SQL tables it will be 5000.
 *               sort:
 *                 type: object
 *                 description: A set of parameters describing the sort behaviour of the search.
 *                 properties:
 *                   order:
 *                     type: string
 *                     enum: [ascending, descending]
 *                     description: The order of the sort, by default this is ascending.
 *                   column:
 *                     type: string
 *                     description: The name of the column by which the rows will be sorted.
 *                   type:
 *                     type: string
 *                     enum: [string, number]
 *                     description: Defines whether the column should be treated as a string
 *                       or as numbers when sorting.
 *     responses:
 *       200:
 *         description: The response will contain an array of rows that match the search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/searchOutput'
 *             examples:
 *               search:
 *                 $ref: '#/components/examples/rows'
 */
read.push(
  new Endpoint(
    "post",
    "/tables/:tableId/rows/search",
    controller.search
  ).addMiddleware(externalSearchValidator())
)

export default { read, write }
