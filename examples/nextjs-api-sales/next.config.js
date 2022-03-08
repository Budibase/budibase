const { join } = require("path")
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [join(__dirname, "styles")]
  },
  serverRuntimeConfig: {
    apiKey: "",
    appName: "",
    host: "http://localhost:10000"
  }
}

module.exports = nextConfig
