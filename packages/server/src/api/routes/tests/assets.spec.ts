import fs from "fs"
import { join } from "path"
import { DEV_ASSET_PATH } from "../../../utilities/fileSystem"
import * as setup from "./utilities"

const path = join(DEV_ASSET_PATH, "builder")
let addedPath = false
const config = setup.getConfig()

beforeAll(async () => {
  if (!fs.existsSync(path)) {
    addedPath = true
    fs.mkdirSync(path)
  }
  const indexPath = join(path, "index.html")
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, "<html></html>", "utf8")
    addedPath = true
  }
  await config.init()
})

afterAll(() => {
  if (addedPath) {
    fs.rmSync(path, { recursive: true })
  }
})

describe("/builder/:file*", () => {
  it("should be able to retrieve the builder file", async () => {
    const res = await config.api.assets.get("index.html")
    expect(res.text).toContain("<html")
  })
})
