import { context, objectStore } from "@budibase/backend-core"
import { App, DocumentType } from "@budibase/types"
import { getRequest, getConfig, afterAll as _afterAll } from "./utilities"

describe("PWA Manifest", () => {
  let request = getRequest()
  let config = getConfig()

  afterAll(() => {
    _afterAll()
  })

  beforeAll(async () => {
    await config.init()
  })
  it("should serve a valid manifest.json with properly configured PWA", async () => {
    await context.doInAppContext(config.getAppId(), async () => {
      const appDb = context.getAppDB()
      let appDoc = await appDb.get<App>(DocumentType.APP_METADATA)

      const pwaConfig = {
        name: "Test App",
        short_name: "TestApp",
        description: "Test app description",
        background_color: "#FFFFFF",
        theme_color: "#4285F4",
        display: "standalone",
        icons: [
          {
            src: `${config.appId}/pwa/icon-small.png`,
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: `${config.appId}/pwa/icon-large.png`,
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: `${config.appId}/pwa/icon-screenshot.png`,
            sizes: "1240x600",
            type: "image/png",
          },
        ],
      }

      // Upload fake icons to minio
      await objectStore.upload({
        bucket: "apps",
        filename: `${config.appId}/pwa/icon-small.png`,
        body: Buffer.from("fake-image-data"),
        type: "image/png",
      })

      await objectStore.upload({
        bucket: "apps",
        filename: `${config.appId}/pwa/icon-large.png`,
        body: Buffer.from("fake-image-data"),
        type: "image/png",
      })

      await appDb.put({
        ...appDoc,
        pwa: pwaConfig,
      })

      const res = await request
        .get(`/api/apps/${config.appId}/manifest.json`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body).toMatchObject({
        name: "Test App",
        short_name: "TestApp",
        description: "Test app description",
        background_color: "#FFFFFF",
        theme_color: "#4285F4",
        display: "standalone",
        start_url: expect.stringContaining(appDoc.url!),
        icons: expect.arrayContaining([
          expect.objectContaining({
            sizes: "144x144",
            type: "image/png",
            src: expect.stringContaining("icon-small.png"),
          }),
          expect.objectContaining({
            sizes: "512x512",
            type: "image/png",
            src: expect.stringContaining("icon-large.png"),
          }),
        ]),
      })

      expect(res.body.screenshots.length).toBeGreaterThan(0)
    })
  })
})
