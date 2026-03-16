import fs from "fs"
import path from "path"
import { budibaseTempDir } from "../../budibaseDir"
import { cleanup } from "../app"

describe("app filesystem cleanup", () => {
  it("removes temp folders for the provided app IDs only", () => {
    const appId = `app_${Date.now()}`
    const appPath = path.join(budibaseTempDir(), appId)
    const otherPath = path.join(
      budibaseTempDir(),
      `other-app-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    )

    fs.mkdirSync(appPath, { recursive: true })
    fs.mkdirSync(otherPath, { recursive: true })

    cleanup([appId])

    expect(fs.existsSync(appPath)).toBe(false)
    expect(fs.existsSync(otherPath)).toBe(true)

    fs.rmSync(otherPath, { recursive: true, force: true })
  })

  it("rejects cleanup paths that escape the Budibase temp directory", () => {
    const outsidePath = path.resolve(
      budibaseTempDir(),
      "..",
      `outside-${Date.now()}`
    )
    fs.mkdirSync(outsidePath, { recursive: true })

    expect(() =>
      cleanup([`..${path.sep}${path.basename(outsidePath)}`])
    ).toThrow("Path must be within the Budibase temp directory.")
    expect(fs.existsSync(outsidePath)).toBe(true)

    fs.rmSync(outsidePath, { recursive: true, force: true })
  })
})
