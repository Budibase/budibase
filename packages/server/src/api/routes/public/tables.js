const Router = require("@koa/router")
const controller = require("../../controllers/public/tables")

const router = Router()
/**
 * @openapi
 * /tables:
 *   post:
 *     summary: Create a new table
 *     tags:
 *       - tables
 *     responses:
 *       200:
 *         description: Returns the created table, including the ID which has been generated for it.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               row:
 *                 $ref: '#/components/examples/table'
 */
router.post("/tables", controller.create)

/**
 * @openapi
 * /tables/:tableId:
 *   put:
 *     summary: Update a single row within a specified table.
 *     tags:
 *       - tables
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/rowId'
 *     responses:
 *       200:
 *         description: Returns the created row, including the ID which has been generated for it.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               row:
 *                 $ref: '#/components/examples/row'
 */
router.put("/tables/:tableId", controller.update)

/**
 * @openapi
 * /tables:
 *   get:
 *     summary: Update a single row within a specified table.
 *     tags:
 *       - tables
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/rowId'
 *     responses:
 *       200:
 *         description: Returns the created row, including the ID which has been generated for it.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               row:
 *                 $ref: '#/components/examples/row'
 */
router.get("/tables", controller.getAllTables)

/**
 * @openapi
 * /tables/{tableId}/rows/{rowId}:
 *   put:
 *     summary: Update a single row within a specified table.
 *     tags:
 *       - rows
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/rowId'
 *     responses:
 *       200:
 *         description: Returns the created row, including the ID which has been generated for it.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               row:
 *                 $ref: '#/components/examples/row'
 */
router.get("/tables/:tableId", controller.getSingleTable)

/**
 * @openapi
 * /tables/{tableId}/rows/{rowId}:
 *   put:
 *     summary: Update a single row within a specified table.
 *     tags:
 *       - rows
 *     parameters:
 *       - $ref: '#/components/parameters/tableId'
 *       - $ref: '#/components/parameters/rowId'
 *     responses:
 *       200:
 *         description: Returns the created row, including the ID which has been generated for it.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               row:
 *                 $ref: '#/components/examples/row'
 */
router.delete("/tables/:tableId", controller.delete)

module.exports = router
