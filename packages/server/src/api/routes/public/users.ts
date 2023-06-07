import controller from "../../controllers/public/users"
import Endpoint from "./utils/Endpoint"
import { nameValidator } from "../utils/validators"

const read = [],
  write = []

/**
 * @openapi
 * /users:
 *   post:
 *     operationId: userCreate
 *     summary: Create a user
 *     tags:
 *       - users
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
 *     operationId: userUpdate
 *     summary: Update a user
 *     tags:
 *       - users
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
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
 *     operationId: userDestroy
 *     summary: Delete a user
 *     tags:
 *       - users
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
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
write.push(new Endpoint("delete", "/users/:userId", controller.destroy))

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     operationId: userGetById
 *     summary: Retrieve a user
 *     tags:
 *       - users
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
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

/**
 * @openapi
 * /users/search:
 *   post:
 *     operationId: userSearch
 *     summary: Search for users
 *     description: Based on user properties (currently only name) search for users.
 *     tags:
 *       - users
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
 *               $ref: '#/components/schemas/userSearch'
 *             examples:
 *               users:
 *                 $ref: '#/components/examples/users'
 */
read.push(
  new Endpoint("post", "/users/search", controller.search).addMiddleware(
    nameValidator()
  )
)

export default { read, write }
