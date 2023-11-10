jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    objectStore: {
      ...core.objectStore,
      upload: jest.fn(),
      uploadDirectory: jest.fn().mockImplementation(() => {
        return [{ name: "test.js" }]
      }),
      deleteFolder: jest.fn().mockImplementation(),
    },
  }
})

import { events, objectStore } from "@budibase/backend-core"
import * as setup from "./utilities"

const mockUploadDirectory = objectStore.uploadDirectory as jest.Mock
const mockDeleteFolder = objectStore.deleteFolder as jest.Mock

describe("/plugins", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    jest.clearAllMocks()
  })

  const createPlugin = async (status?: number) => {
    return request
      .post(`/api/plugin/upload`)
      .attach("file", "src/api/routes/tests/data/comment-box-1.0.2.tar.gz")
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(status ? status : 200)
  }

  const getPlugins = async (status?: number) => {
    return request
      .get(`/api/plugin`)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(status ? status : 200)
  }

  describe("upload", () => {
    it("should be able to upload a plugin", async () => {
      let res = await createPlugin()
      expect(res.body).toBeDefined()
      expect(res.body.plugins).toBeDefined()
      expect(res.body.plugins[0]._id).toEqual("plg_comment-box")
      expect(events.plugin.imported).toHaveBeenCalledTimes(1)
    })

    it("should not be able to create a plugin if there is an error", async () => {
      mockUploadDirectory.mockImplementationOnce(() => {
        throw new Error()
      })
      let res = await createPlugin(400)
      expect(res.body.message).toEqual("Failed to import plugin: Error")
      expect(events.plugin.imported).toHaveBeenCalledTimes(0)
    })
  })

  describe("fetch", () => {
    it("should be able to fetch plugins", async () => {
      await createPlugin()
      const res = await getPlugins()
      expect(res.body).toBeDefined()
      expect(res.body[0]._id).toEqual("plg_comment-box")
    })
  })

  describe("destroy", () => {
    it("should be able to delete a plugin", async () => {
      await createPlugin()
      const res = await request
        .delete(`/api/plugin/plg_comment-box`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toBeDefined()
      expect(res.body.message).toEqual("Plugin plg_comment-box deleted.")

      const plugins = await getPlugins()
      expect(plugins.body).toBeDefined()
      expect(plugins.body.length).toEqual(0)
      expect(events.plugin.deleted).toHaveBeenCalledTimes(1)
    })
    it("should handle an error deleting a plugin", async () => {
      mockDeleteFolder.mockImplementationOnce(() => {
        throw new Error()
      })

      await createPlugin()
      const res = await request
        .delete(`/api/plugin/plg_comment-box`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)

      expect(res.body.message).toEqual("Failed to delete plugin: Error")
      expect(events.plugin.deleted).toHaveBeenCalledTimes(0)
      const plugins = await getPlugins()
      expect(plugins.body).toBeDefined()
      expect(plugins.body.length).toEqual(1)
    })
  })

  describe("github", () => {
    const createGithubPlugin = async (status?: number, url?: string) => {
      return await request
        .post(`/api/plugin`)
        .send({
          source: "Github",
          url,
          githubToken: "token",
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(status ? status : 200)
    }
    it("should be able to create a plugin from github", async () => {
      const res = await createGithubPlugin(
        200,
        "https://github.com/my-repo/budibase-comment-box.git"
      )
      expect(res.body).toBeDefined()
      expect(res.body.plugin).toBeDefined()
      expect(res.body.plugin._id).toEqual("plg_comment-box")
    })
    it("should fail if the url is not from github", async () => {
      const res = await createGithubPlugin(
        400,
        "https://notgithub.com/my-repo/budibase-comment-box"
      )
      expect(res.body.message).toEqual(
        "Failed to import plugin: The plugin origin must be from Github"
      )
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
