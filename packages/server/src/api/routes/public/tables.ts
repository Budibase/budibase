import controller from "../../controllers/public/tables"
import Endpoint from "./utils/Endpoint"
import { tableValidator, nameValidator } from "../utils/validators"

const read = [],
  write = []

/**
 * @openapi
 * /tables/search:
 *   post:
 *     summary: Search internal and external tables based on their name.
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
 *               type: object
 *               properties:
 *                 applications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/table'
 *             examples:
 *               tables:
 *                 $ref: '#/components/examples/tables'
 */
read.push(
  new Endpoint("post", "/tables/search", controller.search).addMiddleware(
    nameValidator()
  )
)

/**
 * @openapi
 * /tables:
 *   post:
 *     summary: Create a new table.
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
 *           internal or external data sources.
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
 *     summary: Update the specified table.
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
 *     summary: Delete a single table and all of its data.
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
 *     summary: Gets a single table by its ID.
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

export default { read, write }
