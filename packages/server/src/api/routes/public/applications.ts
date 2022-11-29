import controller from "../../controllers/public/applications"
import Endpoint from "./utils/Endpoint"
const { nameValidator, applicationValidator } = require("../utils/validators")

const read = [],
  write = []

/**
 * @openapi
 * /applications:
 *   post:
 *     operationId: create
 *     summary: Create an application
 *     tags:
 *       - applications
 *     parameters:
 *       - $ref: '#/components/parameters/appId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/application'
 *     responses:
 *       200:
 *         description: Returns the created application.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/applicationOutput'
 *             examples:
 *               application:
 *                 $ref: '#/components/examples/application'
 */
write.push(
  new Endpoint("post", "/applications", controller.create).addMiddleware(
    applicationValidator()
  )
)

/**
 * @openapi
 * /applications/{appId}:
 *   put:
 *     operationId: update
 *     summary: Update an application
 *     tags:
 *       - applications
 *     parameters:
 *       - $ref: '#/components/parameters/appIdUrl'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/application'
 *     responses:
 *       200:
 *         description: Returns the updated application.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/applicationOutput'
 *             examples:
 *               application:
 *                 $ref: '#/components/examples/application'
 */
write.push(
  new Endpoint("put", "/applications/:appId", controller.update).addMiddleware(
    applicationValidator()
  )
)

/**
 * @openapi
 * /applications/{appId}:
 *   delete:
 *     operationId: destroy
 *     summary: Delete an application
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
 *               $ref: '#/components/schemas/applicationOutput'
 *             examples:
 *               application:
 *                 $ref: '#/components/examples/application'
 */
write.push(new Endpoint("delete", "/applications/:appId", controller.destroy))

/**
 * @openapi
 * /applications/{appId}:
 *   get:
 *     operationId: getById
 *     summary: Retrieve an application
 *     tags:
 *       - applications
 *     parameters:
 *       - $ref: '#/components/parameters/appIdUrl'
 *     responses:
 *       200:
 *         description: Returns the retrieved application.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/applicationOutput'
 *             examples:
 *               application:
 *                 $ref: '#/components/examples/application'
 */
read.push(new Endpoint("get", "/applications/:appId", controller.read))

/**
 * @openapi
 * /applications/search:
 *   post:
 *     operationId: search
 *     summary: Search for applications
 *     description: Based on application properties (currently only name) search for applications.
 *     tags:
 *       - applications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/nameSearch'
 *     responses:
 *       200:
 *         description: Returns the applications that were found based on the search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/applicationSearch'
 *             examples:
 *               applications:
 *                 $ref: '#/components/examples/applications'
 */
read.push(
  new Endpoint("post", "/applications/search", controller.search).addMiddleware(
    nameValidator()
  )
)

export default { read, write }
