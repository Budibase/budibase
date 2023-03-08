import controller from "../../controllers/public/applications"
import Endpoint from "./utils/Endpoint"
const { nameValidator, applicationValidator } = require("../utils/validators")

const read = [],
  write = []

/**
 * @openapi
 * /applications:
 *   post:
 *     operationId: appCreate
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
 *     operationId: appUpdate
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
 *     operationId: appDestroy
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
 * /applications/{appId}/unpublish:
 *   post:
 *     operationId: appUnpublish
 *     summary: Unpublish an application
 *     tags:
 *       - applications
 *     parameters:
 *       - $ref: '#/components/parameters/appIdUrl'
 *     responses:
 *       204:
 *         description: The app was published successfully.
 */
write.push(
  new Endpoint("post", "/applications/:appId/unpublish", controller.unpublish)
)

/**
 * @openapi
 * /applications/{appId}/publish:
 *   post:
 *     operationId: appPublish
 *     summary: Unpublish an application
 *     tags:
 *       - applications
 *     parameters:
 *       - $ref: '#/components/parameters/appIdUrl'
 *     responses:
 *       200:
 *         description: Returns the deployment object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/deploymentOutput'
 *             examples:
 *               deployment:
 *                 $ref: '#/components/examples/deploymentOutput'
 */
write.push(
  new Endpoint("post", "/applications/:appId/publish", controller.publish)
)

/**
 * @openapi
 * /applications/{appId}:
 *   get:
 *     operationId: appGetById
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
 *     operationId: appSearch
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
