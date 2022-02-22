const controller = require("../../controllers/public/applications")
const Endpoint = require("./utils/Endpoint")

const read = [],
  write = []

/**
 * @openapi
 * /applications/search:
 *   post:
 *     summary: Search for an application based on its app name.
 *     tags:
 *       - applications
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
 *         description: Returns the applications that were found based on the search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/application'
 *             examples:
 *               applications:
 *                 $ref: '#/components/examples/applications'
 */
read.push(new Endpoint("post", "/applications/search", controller.search))

/**
 * @openapi
 * /applications:
 *   post:
 *     summary: Create a new application.
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
write.push(new Endpoint("post", "/applications", controller.create))

/**
 * @openapi
 * /applications/{appId}:
 *   put:
 *     summary: Update an existing application by its ID.
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
write.push(new Endpoint("put", "/applications/:appId", controller.update))

/**
 * @openapi
 * /applications/{appId}:
 *   delete:
 *     summary: Delete an existing application by its ID.
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
write.push(new Endpoint("delete", "/applications/:appId", controller.delete))

/**
 * @openapi
 * /applications/{appId}:
 *   get:
 *     summary: Retrieve a single application by its ID.
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

module.exports = { read, write }
