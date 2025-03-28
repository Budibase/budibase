import fs from "fs"
import { join } from "path"
import { DEV_ASSET_PATH } from "../../../utilities/fileSystem"
import * as setup from "./utilities"

const path = join(DEV_ASSET_PATH, "builder", "index.html")
let addedIndexHtml = false
const config = setup.getConfig()

beforeAll(async () => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, "<html></html>", "utf8")
    addedIndexHtml = true
  }
  await config.init()
})

afterAll(() => {
  if (addedIndexHtml) {
    fs.rmSync(path)
  }
})

describe("/builder/:file*", () => {
  it("should be able to retrieve the builder file", async () => {
    const res = await config.api.assets.get("index.html")
    expect(res.text).toContain("<html")
  })
})
