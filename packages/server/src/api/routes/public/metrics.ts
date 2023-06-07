import controller from "../../controllers/public/metrics"
import Endpoint from "./utils/Endpoint"

const read = []

/**
 * @openapi
 * /metrics:
 *   get:
 *     operationId: metricsGet
 *     summary: Retrieve Budibase tenant metrics
 *     description: Output metrics in OpenMetrics format compatible with Prometheus
 *     tags:
 *       - metrics
 *     responses:
 *       200:
 *         description: Returns tenant metrics.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             examples:
 *               metrics:
 *                 $ref: '#/components/examples/metrics'
 */
read.push(new Endpoint("get", "/metrics", controller.fetch))

export default { read }
