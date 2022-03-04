const licensing = require("./licensing")

const codes = {
  ...licensing.codes,
}

const types = {
  ...licensing.types,
}

module.exports = {
  codes,
  types,
  UsageLimitError: licensing.UsageLimitError,
}
