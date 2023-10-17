const fs = require("fs")
const path = require("path")
const os = require("os")
const { error } = require("../utils")

export class ConfigManager {
  path: string

  constructor() {
    this.path = path.join(os.homedir(), ".budibase.json")
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, "{}")
    }
  }

  get config() {
    try {
      return JSON.parse(fs.readFileSync(this.path, "utf8"))
    } catch (err) {
      console.log(
        error(
          "Error parsing configuration file. Please check your .budibase.json is valid."
        )
      )
      return {}
    }
  }

  set config(json: any) {
    fs.writeFileSync(this.path, JSON.stringify(json))
  }

  getValue(key: string) {
    return this.config[key]
  }

  setValue(key: string, value: any) {
    this.config = {
      ...this.config,
      [key]: value,
    }
  }

  removeKey(key: string) {
    const updated = { ...this.config }
    delete updated[key]
    this.config = updated
  }
}
