const { v4 } = require("uuid")

export = function (): string {
  return v4().replace(/-/g, "")
}
