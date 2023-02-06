const { join } = require("path")
require("dotenv").config({
  path: join(__dirname, "..", "..", "hosting", ".env"),
})

process.env.POSTGRES_PASSWORD = "password"

const jestTestcontainersConfigGenerator = require("../../jestTestcontainersConfigGenerator")

module.exports = jestTestcontainersConfigGenerator()
