import controller from "../../controllers/public/views"
import Endpoint from "./utils/Endpoint"
import { viewValidator, nameValidator } from "../utils/validators"

const read = [],
  write = []

/**
 * @openapi
 * /views:
 *   post:
 *     operationId: viewCreate
 *     summary: Create a view
 *     description: Create a view, this can be against an internal or external table.
 *     tags:
 *       - views
 *     parameters:
 *       - $ref: '#/components/parameters/appId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/view'
 *           examples:
 *             view:
 *               $ref: '#/components/examples/view'
 *     responses:
 *       200:
 *         description: Returns the created view, including the ID which has been generated for it.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/viewOutput'
 *             examples:
 *               view:
 *                 $ref: '#/components/examples/view'
 */
write.push(
  new Endpoint("post", "/views", controller.create).addMiddleware(
    viewValidator()
  )
)

/**
 * @openapi
 * /views/{viewId}:
 *   put:
 *     operationId: viewUpdate
 *     summary: Update a view
 *     description: Update a view, this can be against an internal or external table.
 *     tags:
 *       - views
 *     parameters:
 *       - $ref: '#/components/parameters/viewId'
 *       - $ref: '#/components/parameters/appId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/view'
 *           examples:
 *             view:
 *               $ref: '#/components/examples/view'
 *     responses:
 *       200:
 *         description: Returns the updated view.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/viewOutput'
 *             examples:
 *               view:
 *                 $ref: '#/components/examples/view'
 */
write.push(
  new Endpoint("put", "/views/:viewId", controller.update).addMiddleware(
    viewValidator()
  )
)

/**
 * @openapi
 * /views/{viewId}:
 *   delete:
 *     operationId: viewDestroy
 *     summary: Delete a view
 *     description: Delete a view, this can be against an internal or external table.
 *     tags:
 *       - views
 *     parameters:
 *       - $ref: '#/components/parameters/viewId'
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the deleted view.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/viewOutput'
 *             examples:
 *               view:
 *                 $ref: '#/components/examples/view'
 */
write.push(new Endpoint("delete", "/views/:viewId", controller.destroy))

/**
 * @openapi
 * /views/{viewId}:
 *   get:
 *     operationId: viewGetById
 *     summary: Retrieve a view
 *     description: Lookup a view, this could be internal or external.
 *     tags:
 *       - views
 *     parameters:
 *       - $ref: '#/components/parameters/viewId'
 *       - $ref: '#/components/parameters/appId'
 *     responses:
 *       200:
 *         description: Returns the retrieved view.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/viewOutput'
 *             examples:
 *               view:
 *                 $ref: '#/components/examples/view'
 */
read.push(new Endpoint("get", "/views/:viewId", controller.read))

/**
 * @openapi
 * /views/search:
 *   post:
 *     operationId: viewSearch
 *     summary: Search for views
 *     description: Based on view properties (currently only name) search for views.
 *     tags:
 *       - views
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
 *         description: Returns the found views, based on the search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/viewSearch'
 *             examples:
 *               views:
 *                 $ref: '#/components/examples/views'
 */
read.push(
  new Endpoint("post", "/views/search", controller.search).addMiddleware(
    nameValidator()
  )
)

export default { read, write }
