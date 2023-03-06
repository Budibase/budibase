import apm from "elastic-apm-node"

// enable APM if configured
if (process.env.ELASTIC_APM_ENABLED) {
  console.log("Starting elastic-apm-node")
  apm.start({
    serviceName: process.env.SERVICE,
    environment: process.env.BUDIBASE_ENVIRONMENT,
  })
}
