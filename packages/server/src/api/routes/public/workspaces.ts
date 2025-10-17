import { Endpoint } from "@budibase/backend-core"
import controller from "../../controllers/public/workspaces"
import { applicationValidator, nameValidator } from "../utils/validators"

const read = [],
  write = []

/**
 * @openapi
 * /workspaces:
 *   post:
 *     operationId: workspaceCreate
 *     summary: Create a workspace
 *     tags:
 *       - workspaces
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/workspace'
 *     responses:
 *       200:
 *         description: Returns the created workspace.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/workspaceOutput'
 *             examples:
 *               workspace:
 *                 $ref: '#/components/examples/workspace'
 */
write.push(
  new Endpoint("post", "/workspaces", controller.create).addMiddleware(
    applicationValidator()
  )
)

/**
 * @openapi
 * /workspaces/{workspaceId}:
 *   put:
 *     operationId: workspaceUpdate
 *     summary: Update a workspace
 *     tags:
 *       - workspaces
 *     parameters:
 *       - $ref: '#/components/parameters/workspaceId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/workspace'
 *     responses:
 *       200:
 *         description: Returns the updated workspace.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/workspaceOutput'
 *             examples:
 *               workspace:
 *                 $ref: '#/components/examples/workspace'
 */
write.push(
  new Endpoint("put", "/workspaces/:appId", controller.update).addMiddleware(
    applicationValidator()
  )
)

/**
 * @openapi
 * /workspaces/{workspaceId}:
 *   delete:
 *     operationId: workspaceDestroy
 *     summary: Delete a workspace
 *     tags:
 *       - workspaces
 *     parameters:
 *       - $ref: '#/components/parameters/workspaceId'
 *     responses:
 *       200:
 *         description: Returns the deleted workspace.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/workspaceOutput'
 *             examples:
 *               workspace:
 *                 $ref: '#/components/examples/workspace'
 */
write.push(new Endpoint("delete", "/workspaces/:appId", controller.destroy))

/**
 * @openapi
 * /workspaces/{workspaceId}/publish:
 *   post:
 *     operationId: workspacePublish
 *     summary: Publish a workspace
 *     tags:
 *       - workspaces
 *     parameters:
 *       - $ref: '#/components/parameters/workspaceId'
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
  new Endpoint("post", "/workspaces/:appId/publish", controller.publish)
)

/**
 * @openapi
 * /workspaces/{workspaceId}/unpublish:
 *   post:
 *     operationId: workspaceUnpublish
 *     summary: Unpublish a workspace
 *     tags:
 *       - workspaces
 *     parameters:
 *       - $ref: '#/components/parameters/workspaceId'
 *     responses:
 *       204:
 *         description: The workspace was published successfully.
 */
write.push(
  new Endpoint("post", "/workspaces/:appId/unpublish", controller.unpublish)
)

/**
 * @openapi
 * /workspaces/{workspaceId}/import:
 *   post:
 *     operationId: workspaceImport
 *     summary: Import a workspace to an existing workspace 🔒
 *     description: This endpoint is only available on a business or enterprise license.
 *     tags:
 *       - workspaces
 *     parameters:
 *       - $ref: '#/components/parameters/workspaceId'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               encryptedPassword:
 *                 description: Password for the file if it is encrypted.
 *                 type: string
 *               file:
 *                 description: The export to import.
 *                 type: string
 *                 format: binary
 *             required:
 *               - file
 *     responses:
 *       204:
 *         description: Workspace has been updated.
 */
write.push(
  new Endpoint("post", "/workspaces/:appId/import", controller.importToApp)
)

/**
 * @openapi
 * /workspaces/{workspaceId}/export:
 *   post:
 *     operationId: workspaceExport
 *     summary: Export a workspace 🔒
 *     description: This endpoint is only available on a business or enterprise license.
 *     tags:
 *       - workspaces
 *     parameters:
 *       - $ref: '#/components/parameters/workspaceId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/workspaceExport'
 *     responses:
 *       200:
 *         description: A gzip tarball containing the workspace export, encrypted if password provided.
 *         content:
 *           application/gzip:
 *             schema:
 *               type: string
 *               format: binary
 *               example: Tarball containing database and object store contents...
 */
read.push(
  new Endpoint("post", "/workspaces/:appId/export", controller.exportApp)
)

/**
 * @openapi
 * /workspaces/{workspaceId}:
 *   get:
 *     operationId: workspaceGetById
 *     summary: Retrieve a workspace
 *     tags:
 *       - workspaces
 *     parameters:
 *       - $ref: '#/components/parameters/workspaceId'
 *     responses:
 *       200:
 *         description: Returns the retrieved workspace.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/workspaceOutput'
 *             examples:
 *               workspace:
 *                 $ref: '#/components/examples/workspace'
 */
read.push(new Endpoint("get", "/workspaces/:appId", controller.read))

/**
 * @openapi
 * /workspaces/search:
 *   post:
 *     operationId: workspaceSearch
 *     summary: Search for workspaces
 *     description: Based on workspace properties (currently only name) search for workspaces.
 *     tags:
 *       - workspaces
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/nameSearch'
 *     responses:
 *       200:
 *         description: Returns the workspaces that were found based on the search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/workspaceSearch'
 *             examples:
 *               workspaces:
 *                 $ref: '#/components/examples/workspaces'
 */
read.push(
  new Endpoint("post", "/workspaces/search", controller.search).addMiddleware(
    nameValidator()
  )
)

export default { read, write }
