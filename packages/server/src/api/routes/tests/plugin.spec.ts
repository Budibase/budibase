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
import nock from "nock"
import { PluginSource } from "@budibase/types"

const mockUploadDirectory = objectStore.uploadDirectory as jest.Mock
const mockDeleteFolder = objectStore.deleteFolder as jest.Mock

describe("/plugins", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    jest.clearAllMocks()
    nock.cleanAll()
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
    beforeEach(async () => {
      nock("https://api.github.com")
        .get("/repos/my-repo/budibase-comment-box")
        .reply(200, {
          name: "budibase-comment-box",
          releases_url:
            "https://api.github.com/repos/my-repo/budibase-comment-box{/id}",
        })
        .get("/repos/my-repo/budibase-comment-box/latest")
        .reply(200, {
          assets: [
            {
              content_type: "application/gzip",
              browser_download_url:
                "https://github.com/my-repo/budibase-comment-box/releases/download/v1.0.2/comment-box-1.0.2.tar.gz",
            },
          ],
        })

      nock("https://github.com")
        .get(
          "/my-repo/budibase-comment-box/releases/download/v1.0.2/comment-box-1.0.2.tar.gz"
        )
        .replyWithFile(
          200,
          "src/api/routes/tests/data/comment-box-1.0.2.tar.gz"
        )
    })

    it("should be able to create a plugin from github", async () => {
      const { plugin } = await config.api.plugin.create({
        source: PluginSource.GITHUB,
        url: "https://github.com/my-repo/budibase-comment-box.git",
        githubToken: "token",
      })
      expect(plugin._id).toEqual("plg_comment-box")
    })

    it("should fail if the url is not from github", async () => {
      await config.api.plugin.create(
        {
          source: PluginSource.GITHUB,
          url: "https://notgithub.com/my-repo/budibase-comment-box",
          githubToken: "token",
        },
        {
          status: 400,
          body: {
            message:
              "Failed to import plugin: The plugin origin must be from Github",
          },
        }
      )
    })
  })
  describe("npm", () => {
    it("should be able to create a plugin from npm", async () => {
      nock("https://registry.npmjs.org")
        .get("/budibase-component")
        .reply(200, {
          name: "budibase-component",
          "dist-tags": {
            latest: "1.0.0",
          },
          versions: {
            "1.0.0": {
              dist: {
                tarball:
                  "https://registry.npmjs.org/budibase-component/-/budibase-component-1.0.1.tgz",
              },
            },
          },
        })
        .get("/budibase-component/-/budibase-component-1.0.1.tgz")
        .replyWithFile(
          200,
          "src/api/routes/tests/data/budibase-component-1.0.1.tgz"
        )

      const { plugin } = await config.api.plugin.create({
        source: PluginSource.NPM,
        url: "https://www.npmjs.com/package/budibase-component",
      })
      expect(plugin._id).toEqual("plg_budibase-component")
      expect(events.plugin.imported).toHaveBeenCalled()
    })
  })

  describe("url", () => {
    it("should be able to create a plugin from a URL", async () => {
      nock("https://www.someurl.com")
        .get("/comment-box/comment-box-1.0.2.tar.gz")
        .replyWithFile(
          200,
          "src/api/routes/tests/data/comment-box-1.0.2.tar.gz"
        )

      const { plugin } = await config.api.plugin.create({
        source: PluginSource.URL,
        url: "https://www.someurl.com/comment-box/comment-box-1.0.2.tar.gz",
      })
      expect(plugin._id).toEqual("plg_comment-box")
      expect(events.plugin.imported).toHaveBeenCalledTimes(1)
    })
  })
})
