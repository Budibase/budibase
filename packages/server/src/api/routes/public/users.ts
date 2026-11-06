import controller from "../../controllers/public/users"
import { Endpoint } from "@budibase/backend-core"
import { nameValidator, publicApiUserValidator } from "../utils/validators"

const read = [],
  write = []

/**
 * @openapi
 * /users:
 *   post:
 *     operationId: userCreate
 *     summary: Create a user
 *     description: >
 *       Creates a new user. The `userGroups` property can be provided with an array of group IDs
 *       to assign initial group memberships. If `userGroups` is omitted, the default group (if configured)
 *       is assigned. Providing `userGroups: []` explicitly creates the user without any memberships.
 *       Setting `userGroups` requires a global admin API key and both the user groups and expanded public API licensed features.
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
write.push(
  new Endpoint("post", "/users", controller.create).addMiddleware(
    publicApiUserValidator()
  )
)

/**
 * @openapi
 * /users/{userId}:
 *   put:
 *     operationId: userUpdate
 *     summary: Update a user
 *     description: >
 *       Updates an existing user. Group memberships can be assigned, updated, or removed using the `userGroups` field:
 *
 *       * **Omitted**: existing memberships are preserved.
 *       * **Empty array `[]`**: removes all group memberships from the user.
 *       * **Array of group IDs**: reconciles memberships by adding new groups and removing unlisted groups.
 *
 *       Modifying group memberships requires a global admin API key and both the user groups and
 *       expanded public API features. Requests without membership changes do not require global admin privileges.
 *       Malformed group IDs return a 400 validation error. Missing or SCIM-managed groups return 404
 *       without altering memberships.
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
write.push(
  new Endpoint("put", "/users/:userId", controller.update).addMiddleware(
    publicApiUserValidator()
  )
)

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
