const { join } = require("path")
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [join(__dirname, "styles")],
  },
  serverRuntimeConfig: {
    apiKey:
      "bf4d86af933b5ac0af0fdbe4bf7d89ff-f929752a1eeaafb00f4b5e3325097d51a44fe4b39f22ed857923409cc75414b379323a25ebfb4916",
    appName: "sales",
    host: "http://localhost:10000",
  },
}

module.exports = nextConfig
