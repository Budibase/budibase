import apm from "dd-trace"

// enable APM if configured
if (process.env.DD_APM_ENABLED) {
  console.log("Starting dd-trace")
  apm.init()
}
