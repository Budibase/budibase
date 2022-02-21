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
 */
router.post("/queries/search", controller.search)

/**
 * @openapi
 * /queries/{queryId}:
 *   post:
 *     summary: Execute a query and retrieve its response.
 *     tags:
 *       - queries
 */
router.post("/queries/:queryId", controller.execute)

module.exports = router
