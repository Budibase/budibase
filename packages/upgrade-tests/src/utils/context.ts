import * as fs from "fs"
import * as path from "path"
import { UpgradeContext, JSONValue, JSONObject } from "../types"

const CONTEXT_FILE = path.join(process.cwd(), ".upgrade-context.json")

class UpgradeContextImpl implements UpgradeContext {
  private data: JSONObject = {}

  constructor() {
    this.load()
  }

  set(key: string, value: JSONValue): void {
    this.data[key] = value
    this.save()
  }

  get<T extends JSONValue = JSONValue>(key: string): T {
    if (!Object.prototype.hasOwnProperty.call(this.data, key)) {
      throw new Error(`Key "${key}" not found in upgrade context`)
    }
    return this.data[key] as T
  }

  clear(): void {
    this.data = {}
    if (fs.existsSync(CONTEXT_FILE)) {
      fs.unlinkSync(CONTEXT_FILE)
    }
  }

  private load(): void {
    if (fs.existsSync(CONTEXT_FILE)) {
      try {
        const content = fs.readFileSync(CONTEXT_FILE, "utf-8")
        this.data = JSON.parse(content)
      } catch (error) {
        console.error("Failed to load upgrade context:", error)
        this.data = {}
      }
    }
  }

  private save(): void {
    try {
      fs.writeFileSync(CONTEXT_FILE, JSON.stringify(this.data, null, 2))
    } catch (error) {
      console.error("Failed to save upgrade context:", error)
    }
  }
}

export const upgradeContext = new UpgradeContextImpl()
