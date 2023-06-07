import controller from "../../controllers/public/queries"
import Endpoint from "./utils/Endpoint"
import { nameValidator } from "../utils/validators"

const read = [],
  write = []

/**
 * @openapi
 * /queries/{queryId}:
 *   post:
 *     operationId: queryExecute
 *     summary: Execute a query
 *     description: Queries which have been created within a Budibase app can be executed using this,
 *     tags:
 *       - queries
 *     parameters:
 *       - $ref: '#/components/parameters/queryId'
 *       - $ref: '#/components/parameters/appId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/executeQuery'
 *     responses:
 *       200:
 *         description: Returns the result of the query execution.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/executeQueryOutput'
 *             examples:
 *               REST:
 *                 $ref: '#/components/examples/restResponse'
 *               SQL:
 *                 $ref: '#/components/examples/sqlResponse'
 *
 */
write.push(new Endpoint("post", "/queries/:queryId", controller.execute))

/**
 * @openapi
 * /queries/search:
 *   post:
 *     operationId: querySearch
 *     summary: Search for queries
 *     description: Based on query properties (currently only name) search for queries.
 *     tags:
 *       - queries
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
 *         description: Returns the queries found based on the search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/querySearch'
 *             examples:
 *               queries:
 *                 $ref: '#/components/examples/queries'
 */
read.push(
  new Endpoint("post", "/queries/search", controller.search).addMiddleware(
    nameValidator()
  )
)

export default { read, write }
