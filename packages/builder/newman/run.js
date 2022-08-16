const newman = require("newman")

const collection = require("./newman.json")
const environment = require("./environments/localhost.env.json")

const run = async () => {
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

  await newman.run(options)
}

run()
