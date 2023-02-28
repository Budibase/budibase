import controller from "../../controllers/public/tables"
import Endpoint from "./utils/Endpoint"
import { tableValidator, nameValidator } from "../utils/validators"

const read = [],
  write = []

/**
 * @openapi
 * /tables:
 *   post:
 *     operationId: tableCreate
 *     summary: Create a table
 *     description: Create a table, this could be internal or external.
 *     tags:
 *       - tables
 *     parameters:
 *       - $ref: '#/components/parameters/appId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/table'
 *           examples:
 *             table:
 *               $ref: '#/components/examples/table'
 *     responses:
 *       200:
 *         description: Returns the created table, including the ID which has been generated for it. This can be
 *           internal or external datasources.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tableOutput'
 *             examples:
 *               table:
 *                 $ref: '#/components/examples/table'
 */
write.push(
  new Endpoint("post", "/tables", controller.create).addMiddleware(
    tableValidator()
  )
)

/**
 * @openapi
 * /tables/{tableId}:
 *   put:
 *     operationId: tableUpdate
 *     summary: Update a table
 *     description: Update a table, this could be internal or external.
 *     tags:
 *       - tables
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/appId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/table'
 *           examples:
 *             table:
 *               $ref: '#/components/examples/table'
 *     responses:
 *       200:
 *         description: Returns the updated table.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tableOutput'
 *             examples:
 *               table:
 *                 $ref: '#/components/examples/table'
 */
write.push(
  new Endpoint("put", "/tables/:tableId", controller.update).addMiddleware(
    tableValidator()
  )
)

/**
 * @openapi
 * /tables/{tableId}:
 *   delete:
 *     operationId: tableDestroy
 *     summary: Delete a table
 *     description: Delete a table, this could be internal or external.
 *     tags:
 *       - tables
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the deleted table.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tableOutput'
 *             examples:
 *               table:
 *                 $ref: '#/components/examples/table'
 */
write.push(new Endpoint("delete", "/tables/:tableId", controller.destroy))

/**
 * @openapi
 * /tables/{tableId}:
 *   get:
 *     operationId: tableGetById
 *     summary: Retrieve a table
 *     description: Lookup a table, this could be internal or external.
 *     tags:
 *       - tables
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the retrieved table.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tableOutput'
 *             examples:
 *               table:
 *                 $ref: '#/components/examples/table'
 */
read.push(new Endpoint("get", "/tables/:tableId", controller.read))

/**
 * @openapi
 * /tables/search:
 *   post:
 *     operationId: tableSearch
 *     summary: Search for tables
 *     description: Based on table properties (currently only name) search for tables. This could be
 *       an internal or an external table.
 *     tags:
 *       - tables
 *     parameters:
 *       - $ref: '#/components/parameters/appId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/nameSearch'
 *     responses:
 *       200:
 *         description: Returns the found tables, based on the search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tableSearch'
 *             examples:
 *               tables:
 *                 $ref: '#/components/examples/tables'
 */
read.push(
  new Endpoint("post", "/tables/search", controller.search).addMiddleware(
    nameValidator()
  )
)

export default { read, write }
