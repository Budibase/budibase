const { join } = require("path")
const { parsed: env } = require("dotenv").config({
  path: join(__dirname, ".env.test"),
})

const jestTestcontainersConfigGenerator = require("../../jestTestcontainersConfigGenerator")

module.exports = jestTestcontainersConfigGenerator(env)
