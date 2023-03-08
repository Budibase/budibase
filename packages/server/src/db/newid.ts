const { v4 } = require("uuid")

export default function (): string {
  return v4().replace(/-/g, "")
}
