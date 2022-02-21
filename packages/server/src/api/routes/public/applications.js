const Router = require("@koa/router")
const controller = require("../../controllers/public/applications")

const router = Router()

/**
 * @openapi
 * /applications/search:
 *   post:
 *     summary: Search for an application based on its app name.
 *     tags:
 *       - applications
 *     parameters:
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the applications that were found based on the search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/application'
 */
router.post("/applications/search", controller.search)

/**
 * @openapi
 * /applications:
 *   post:
 *     summary: Create a new application.
 *     tags:
 *       - applications
 *     parameters:
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the created application.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post("/applications", controller.create)

/**
 * @openapi
 * /applications/{appId}:
 *   put:
 *     summary: Update an existing application by its ID.
 *     tags:
 *       - applications
 *     parameters:
 *       - $ref: '#/components/parameters/appIdUrl'
 *     responses:
 *       200:
 *         description: Returns the updated application.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.put("/applications/:appId", controller.update)

/**
 * @openapi
 * /applications/{appId}:
 *   delete:
 *     summary: Delete an existing application by its ID.
 *     tags:
 *       - applications
 *     parameters:
 *       - $ref: '#/components/parameters/appIdUrl'
 *     responses:
 *       200:
 *         description: Returns the deleted application.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.delete("/applications/:appId", controller.delete)

module.exports = router
