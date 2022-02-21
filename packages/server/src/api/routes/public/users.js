const Router = require("@koa/router")
const controller = require("../../controllers/public/users")

const router = Router()

/**
 * @openapi
 * /users/search:
 *   post:
 *     summary: Search for a user based on their email/username.
 *     tags:
 *       - users
 *     parameters:
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the found users based on search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/user'
 */
router.post("/users/search", controller.search)

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user in the Budibase portal.
 *     tags:
 *       - users
 *     parameters:
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the created user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post("/users", controller.create)

/**
 * @openapi
 * /users/{userId}:
 *   put:
 *     summary: Update an existing user by their ID.
 *     tags:
 *       - users
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the updated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.put("/users/:userId", controller.update)

/**
 * @openapi
 * /users/{userId}:
 *   delete:
 *     summary: Delete an existing user by their ID.
 *     tags:
 *       - users
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the deleted user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.delete("/users/:userId", controller.delete)

module.exports = router
