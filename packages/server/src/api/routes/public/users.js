const controller = require("../../controllers/public/users")
const Endpoint = require("./utils/Endpoint")

const read = [],
  write = []

/**
 * @openapi
 * /users/search:
 *   post:
 *     summary: Search for a user based on their email/username.
 *     tags:
 *       - users
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
read.push(new Endpoint("post", "/users/search", controller.search))

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user in the Budibase portal.
 *     tags:
 *       - users
 *     parameters:
 *       - $ref: '#/components/parameters/appId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
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
write.push(new Endpoint("post", "/users", controller.create))

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
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
write.push(new Endpoint("put", "/users/:userId", controller.update))

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
write.push(new Endpoint("delete", "/users/:userId", controller.delete))

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
read.push(new Endpoint("get", "/users/:userId", controller.read))

module.exports = { read, write }
