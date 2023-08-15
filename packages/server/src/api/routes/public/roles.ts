import controller from "../../controllers/public/roles"
import Endpoint from "./utils/Endpoint"

const write = []

/**
 * @openapi
 * /roles/assign:
 *   post:
 *     operationId: roleAssign
 *     summary: Assign a role to a list of users
 *     description: This is a business/enterprise only endpoint
 *     tags:
 *       - roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/rolesAssign'
 *     responses:
 *       200:
 *         description: Returns a list of updated user IDs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/rolesOutput'
 */
write.push(new Endpoint("post", "/roles/assign", controller.assign))

/**
 * @openapi
 * /roles/unassign:
 *   post:
 *     operationId: roleUnAssign
 *     summary: Un-assign a role from a list of users
 *     description: This is a business/enterprise only endpoint
 *     tags:
 *       - roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/rolesUnAssign'
 *     responses:
 *       200:
 *         description: Returns a list of updated user IDs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/rolesOutput'
 */
write.push(new Endpoint("post", "/roles/unassign", controller.unAssign))

export default { write, read: [] }
