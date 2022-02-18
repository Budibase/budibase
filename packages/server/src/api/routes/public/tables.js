const Router = require("@koa/router")
const controller = require("../../controllers/public/tables")

const router = Router()

/**
 * @openapi
 * /tables/search:
 *   post:
 *     summary: Search internal and external tables based on their name.
 *     parameters:
 *       - $ref: '#/components/parameters/appId'
 *     tags:
 *       - tables
 *     requestBody:
 *
 *     responses:
 *       200:
 *         description: Returns the found tables, based on the search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             examples:
 *               tables:
 *                 $ref: '#/components/examples/tables'
 */
router.post("/tables/search", controller.search)

/**
 * @openapi
 * /tables:
 *   post:
 *     summary: Create a new table.
 *     parameters:
 *       - $ref: '#/components/parameters/appId'
 *     tags:
 *       - tables
 *     responses:
 *       200:
 *         description: Returns the created table, including the ID which has been generated for it. This can be
 *           internal or external data sources.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               table:
 *                 $ref: '#/components/examples/table'
 */
router.post("/tables", controller.create)

/**
 * @openapi
 * /tables/:tableId:
 *   put:
 *     summary: Update the specified table. This can be for internal or external tables.
 *     tags:
 *       - tables
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the updated table.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               table:
 *                 $ref: '#/components/examples/row'
 */
router.put("/tables/:tableId", controller.update)

/**
 * @openapi
 * /tables:
 *   get:
 *     summary: Get all the tables, internal and external within an app.
 *     tags:
 *       - tables
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns all of the tables which were found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               table:
 *                 $ref: '#/components/examples/row'
 */
router.get("/tables", controller.singleRead)

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
 *               type: object
 *             examples:
 *               table:
 *                 $ref: '#/components/examples/table'
 */
router.delete("/tables/:tableId", controller.delete)

module.exports = router
