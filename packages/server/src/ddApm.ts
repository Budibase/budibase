import apm from "dd-trace"

// enable APM if configured
if (process.env.DD_APM_ENABLED) {
  console.log("Starting dd-trace")
  apm.init({
    // @ts-ignore for some reason dd-trace types don't include this options,
    // even though it's spoken about in the docs.
    debug: process.env.DD_ENV === "qa",
  })
}
