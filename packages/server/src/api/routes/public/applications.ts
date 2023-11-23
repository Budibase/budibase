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
 *     summary: Publish an application
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
 * /applications/{appId}/import:
 *   post:
 *     operationId: appImport
 *     summary: Import an app to an existing app 🔒
 *     description: This endpoint is only available on a business or enterprise license.
 *     tags:
 *       - applications
 *     parameters:
 *       - $ref: '#/components/parameters/appIdUrl'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               encryptedPassword:
 *                 description: Password for the export if it is encrypted.
 *                 type: string
 *               appExport:
 *                 description: The app export to import.
 *                 type: string
 *                 format: binary
 *             required:
 *               - appExport
 *     responses:
 *       204:
 *         description: Application has been updated.
 */
write.push(
  new Endpoint("post", "/applications/:appId/import", controller.importToApp)
)

/**
 * @openapi
 * /applications/{appId}/export:
 *   post:
 *     operationId: appExport
 *     summary: Export an app 🔒
 *     description: This endpoint is only available on a business or enterprise license.
 *     tags:
 *       - applications
 *     parameters:
 *       - $ref: '#/components/parameters/appIdUrl'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/appExport'
 *     responses:
 *       200:
 *         description: A gzip tarball containing the app export, encrypted if password provided.
 *         content:
 *           application/gzip:
 *             schema:
 *               type: string
 *               format: binary
 *               example: Tarball containing database and object store contents...
 */
read.push(
  new Endpoint("post", "/applications/:appId/export", controller.exportApp)
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
