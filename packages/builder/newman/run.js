const newman = require("newman")

const collection = require("./newman.json")

const run = async () => {
  console.log(process.argv)

  const env = process.argv[2]
  let environment
  if (env === "test") {
    environment = require("./environments/test.env.json")
  } else if (env === "dev") {
    environment = require("./environments/dev.env.json")
  }

  // const environment = `./environments/${env}.env.json`

  console.log(environment)

  const options = {
    //   apiKey: "",
    collection,
    environment,
    //   envVar: "",
    //   globals: "",
    //   globalVar: "",
    //   iterationCount: "",
    //   iterationData: "",
    //   folder: "",
    //   workingDir: ""
    //   insecureFileRead: "",
    //   timeout: "",
    //   timeoutRequest: "",
    //   timeoutScript: "",
    //   delayRequest: "",
    //   ignoreRedirects: "",
    //   insecure: "",
    //   bail: "",
    //   suppressExitCode: "",
    reporters: "cli",
    //   reporter: "",
    //   color: "",
    //   sslClientCert: "",
    //   sslClientKey: "",
    //   sslClientPassphrase: "",
    //   sslClientCertList: "",
    //   sslExtraCaCerts: "",
    //   requestAgents: "",
    //   cookieJar: "",
  }

  newman
    .run(options, err => {
      console.log(err)
      process.exit(1)
    })
    .on("done", (err, summary) => {
      if (!options.suppressExitCode && (err || summary.run.failures.length)) {
        process.exit(1)
        // core.setFailed('Newman run failed! ' + (err || ''))
      }
    })
}

run()
