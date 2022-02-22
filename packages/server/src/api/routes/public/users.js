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
 *             examples:
 *               users:
 *                 $ref: '#/components/examples/users'
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
 *               $ref: '#/components/schemas/userOutput'
 *             examples:
 *               user:
 *                 $ref: '#/components/examples/user'
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
 *               $ref: '#/components/schemas/userOutput'
 *             examples:
 *               user:
 *                 $ref: '#/components/examples/user'
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
 *               $ref: '#/components/schemas/userOutput'
 *             examples:
 *               user:
 *                 $ref: '#/components/examples/user'
 */
router.delete("/users/:userId", controller.delete)

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     summary: Retrieve a single user by their ID.
 *     tags:
 *       - users
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the retrieved user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userOutput'
 *             examples:
 *               user:
 *                 $ref: '#/components/examples/user'
 */
router.get("/users/:userId", controller.read)

module.exports = router
