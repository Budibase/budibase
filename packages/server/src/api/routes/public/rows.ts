import controller, { viewSearch } from "../../controllers/public/rows"
import Endpoint from "./utils/Endpoint"
import { externalSearchValidator } from "../utils/validators"

const read = [],
  write = []

/**
 * @openapi
 * /tables/{tableId}/rows:
 *   post:
 *     operationId: rowCreate
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
 *     operationId: rowUpdate
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
 *     operationId: rowDestroy
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
 *     operationId: rowGetById
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
 *     operationId: rowSearch
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
 *             $ref: '#/components/schemas/rowSearch'
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

/**
 * @openapi
 * /views/{viewId}/rows/search:
 *   post:
 *     operationId: rowViewSearch
 *     summary: Search for rows in a view
 *     tags:
 *       - rows
 *     parameters:
 *       - $ref: '#/components/parameters/viewId'
 *       - $ref: '#/components/parameters/appId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/rowSearch'
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
    "/views/:viewId/rows/search",
    controller.viewSearch
  ).addMiddleware(externalSearchValidator())
)

export default { read, write }
