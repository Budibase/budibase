const fs = require("fs")
const path = require("path")
const os = require("os")
const { error } = require("../utils")

class ConfigManager {
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
      console.log(error(("Error parsing configuration file. Please check your .budibase.json is valid.")))
    }
  }

  set config(json) {
    fs.writeFileSync(this.path, JSON.stringify(json))
  }

  getValue(key) {
    return this.config[key]
  }

  setValue(key, value) {
    const updated = {
      ...this.config,
      [key]: value
    }
    this.config = updated
  }

  removeKey(key) {
    const updated = { ...this.config }
    delete updated[key]
    this.config = updated
  }
}

module.exports = ConfigManager