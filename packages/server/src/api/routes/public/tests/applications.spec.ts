import * as setup from "../../tests/utilities"
import {
  generateMakeRequest,
  generateMakeRequestWithFormData,
  MakeRequestResponse,
  MakeRequestWithFormDataResponse,
} from "./utils"
import { User } from "@budibase/types"
import { join } from "path"
import { mocks } from "@budibase/backend-core/tests"

const PASSWORD = "testtest"
const NO_LICENSE_MSG = "Endpoint unavailable, license required."

let config = setup.getConfig()
let apiKey: string,
  globalUser: User,
  makeRequest: MakeRequestResponse,
  makeRequestFormData: MakeRequestWithFormDataResponse

beforeAll(async () => {
  await config.init()
  globalUser = await config.globalUser()
  apiKey = await config.generateApiKey(globalUser._id)
  makeRequest = generateMakeRequest(apiKey)
  makeRequestFormData = generateMakeRequestWithFormData(apiKey)
})

afterAll(setup.afterAll)

describe("check export/import", () => {
  async function runExport() {
    return await makeRequest("post", `/applications/${config.appId}/export`, {
      encryptionPassword: PASSWORD,
      excludeRows: true,
    })
  }

  async function runImport() {
    const pathToExport = join(
      __dirname,
      "..",
      "..",
      "tests",
      "assets",
      "export.tar.gz"
    )
    return await makeRequestFormData(
      "post",
      `/applications/${config.appId}/import`,
      {
        encryptionPassword: PASSWORD,
        appExport: { path: pathToExport },
      }
    )
  }

  it("check licensing for export", async () => {
    const res = await runExport()
    expect(res.status).toBe(403)
    expect(res.body.message).toBe(NO_LICENSE_MSG)
  })

  it("check licensing for import", async () => {
    const res = await runImport()
    expect(res.status).toBe(403)
    expect(res.body.message).toBe(NO_LICENSE_MSG)
  })

  it("should be able to export app", async () => {
    mocks.licenses.useExpandedPublicApi()
    const res = await runExport()
    expect(res.headers["content-disposition"]).toMatch(
      /attachment; filename=".*-export-.*\.tar.gz"/g
    )
    expect(res.body instanceof Buffer).toBe(true)
    expect(res.status).toBe(200)
  })

  it("should be able to import app", async () => {
    mocks.licenses.useExpandedPublicApi()
    const res = await runImport()
    expect(Object.keys(res.body).length).toBe(0)
    // check screens imported correctly
    const screens = await config.api.screen.list()
    expect(screens.length).toBe(2)
    expect(screens[0].routing.route).toBe("/derp")
    expect(screens[1].routing.route).toBe("/blank")
    expect(res.status).toBe(204)
  })
})
