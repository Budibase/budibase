import controller from "../../controllers/public/metrics"
import Endpoint from "./utils/Endpoint"

const read = []

/**
 * @openapi
 * /metrics:
 *   get:
 *     operationId: getById
 *     summary: Retrieve Budibase tenant metrics
 *     description: Output metrics in openMetrics format compatible with Prometheus
 *     tags:
 *       - metrics
 *     responses:
 *       200:
 *         description: Returns tenant metrics.
 *         content:
 *           text/plain:
 *             schema:
 *               $ref: '#/components/schemas/tableOutput'
 *             examples:
 *               table:
 *                 $ref: '#/components/examples/table'
 */
read.push(new Endpoint("get", "/metrics", controller.fetch))

export default { read }
