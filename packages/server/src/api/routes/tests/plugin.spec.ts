let mockObjectStore = jest.fn().mockImplementation(() => {
  return [{ name: "test.js" }]
})
jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    objectStore: {
      ...core.objectStore,
      upload: jest.fn(),
      uploadDirectory: mockObjectStore,
    },
  }
})

import { events } from "@budibase/backend-core"
import * as setup from "./utilities"

describe("/plugins", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    jest.clearAllMocks()
  })

  describe("upload", () => {
    it("should be able to upload a plugin", async () => {
      const res = await request
        .post(`/api/plugin/upload`)
        .attach("file", "src/api/routes/tests/data/comment-box-1.0.2.tar.gz")
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toBeDefined()
      expect(res.body.plugins).toBeDefined()
      expect(res.body.plugins[0]._id).toEqual("plg_comment-box")
      expect(events.plugin.imported).toHaveBeenCalledTimes(1)
    })

    it("should not be able to create a plugin if there is an error", async () => {
      mockObjectStore.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await request
        .post(`/api/plugin/upload`)
        .attach("file", "src/api/routes/tests/data/comment-box-1.0.2.tar.gz")
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)
      expect(res.body.message).toEqual("Failed to import plugin: Error")
      expect(events.plugin.imported).toHaveBeenCalledTimes(0)
    })
  })

  describe("github", () => {
    it("should be able to create a plugin from github", async () => {
      const res = await request
        .post(`/api/plugin`)
        .send({
          source: "Github",
          url: "https://github.com/my-repo/budibase-comment-box",
          githubToken: "token",
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toBeDefined()
      expect(res.body.plugin._id).toEqual("plg_comment-box")
    })
  })
  describe("npm", () => {
    it("should be able to create a plugin from npm", async () => {
      const res = await request
        .post(`/api/plugin`)
        .send({
          source: "NPM",
          url: "https://www.npmjs.com/package/budibase-component",
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toBeDefined()
      expect(res.body.plugin._id).toEqual("plg_budibase-component")
      expect(events.plugin.imported).toHaveBeenCalled()
    })
  })

  describe("url", () => {
    it("should be able to create a plugin from a URL", async () => {
      const res = await request
        .post(`/api/plugin`)
        .send({
          source: "URL",
          url: "https://www.someurl.com/comment-box/comment-box-1.0.2.tar.gz",
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toBeDefined()
      expect(res.body.plugin._id).toEqual("plg_comment-box")
      expect(events.plugin.imported).toHaveBeenCalledTimes(1)
    })
  })
})
