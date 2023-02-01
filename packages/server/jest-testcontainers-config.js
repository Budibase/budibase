const { join } = require("path")
require("dotenv").config({
  path: join(__dirname, "..", "..", "hosting", ".env"),
})

const jestTestcontainersConfigGenerator = require("../../jestTestcontainersConfigGenerator")

module.exports = jestTestcontainersConfigGenerator()
