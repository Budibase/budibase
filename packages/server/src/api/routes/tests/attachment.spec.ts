import { withEnv } from "../../../environment"
import * as setup from "./utilities"
import { APIError } from "@budibase/types"

describe("/api/applications/:appId/sync", () => {
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
  })
  afterAll(async () => {
    setup.afterAll()
  })

  describe("/api/attachments/process", () => {
    it("should accept an image file upload", async () => {
      let resp = await config.api.attachment.process(
        "1px.jpg",
        Buffer.from([0])
      )
      expect(resp.length).toBe(1)

      let upload = resp[0]

      expect(upload.url.split("?")[0].endsWith(".jpg")).toBe(true)
      expect(upload.extension).toBe("jpg")
      expect(upload.size).toBe(1)
      expect(upload.name).toBe("1px.jpg")
    })

    it("should reject an upload with a malicious file extension", async () => {
      await withEnv({ SELF_HOSTED: undefined }, async () => {
        let resp = (await config.api.attachment.process(
          "ohno.exe",
          Buffer.from([0]),
          { status: 400 }
        )) as unknown as APIError
        expect(resp.message).toContain("invalid extension")
      })
    })

    it("should reject an upload with a malicious uppercase file extension", async () => {
      await withEnv({ SELF_HOSTED: undefined }, async () => {
        let resp = (await config.api.attachment.process(
          "OHNO.EXE",
          Buffer.from([0]),
          { status: 400 }
        )) as unknown as APIError
        expect(resp.message).toContain("invalid extension")
      })
    })

    it("should reject an upload with no file", async () => {
      let resp = (await config.api.attachment.process(
        undefined as any,
        undefined as any,
        {
          status: 400,
        }
      )) as unknown as APIError
      expect(resp.message).toContain("No file provided")
    })
  })
})
