const Router = require("@koa/router")
const controller = require("../../controllers/public/queries")

const router = Router()

/**
 * @openapi
 * /queries/search:
 *   post:
 *     summary: Search for a query based on its name.
 *     tags:
 *       - queries
 *     parameters:
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the queries found based on the search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/query'
 */
router.post("/queries/search", controller.search)

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
 *               type: array
 *               items:
 *                 type: object
 */
router.post("/queries/:queryId", controller.execute)

module.exports = router
