const controller = require("../../controllers/public/queries")
const Endpoint = require("./utils/Endpoint")

const read = [],
  write = []

/**
 * @openapi
 * /queries/search:
 *   post:
 *     summary: Search for a query based on its name.
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
 *               type: object
 *               properties:
 *                 queries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/query'
 *             examples:
 *               queries:
 *                 $ref: '#/components/examples/queries'
 */
read.push(new Endpoint("post", "/queries/search", controller.search))

/**
 * @openapi
 * /queries/{queryId}:
 *   post:
 *     summary: Execute a query and retrieve its response.
 *     tags:
 *       - queries
 *     parameters:
 *       - $ref: '#/components/parameters/queryId'
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the result of the query execution.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: The data retrieved from the query.
 *                   items:
 *                     type: object
 *                     description: The structure of the returned data will be an object,
 *                       if it is just a string then this will be an object containing "value".
 *                 pagination:
 *                   type: object
 *                   description: For supported query types this returns pagination information.
 *                   properties:
 *                     cursor:
 *                       type: string
 *                       description: The pagination cursor location.
 *                 raw:
 *                   type: string
 *                   description: The raw query response.
 *                 headers:
 *                   type: object
 *                   description: For REST queries the headers in the response will be returned here.
 *             examples:
 *               REST:
 *                 $ref: '#/components/examples/restResponse'
 *               SQL:
 *                 $ref: '#/components/examples/sqlResponse'
 *
 */
write.push(new Endpoint("post", "/queries/:queryId", controller.execute))

module.exports = { read, write }
