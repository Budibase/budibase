import * as setup from "./utilities"
import nock from "nock"

interface App {
  background: string
  icon: string
  category: string
  description: string
  name: string
  url: string
  type: string
  key: string
  image: string
}

interface Manifest {
  templates: {
    app: { [key: string]: App }
  }
}

function setManifest(manifest: Manifest) {
  nock("https://prod-budi-templates.s3-eu-west-1.amazonaws.com")
    .get("/manifest.json")
    .reply(200, manifest)
}

function mockApp(key: string, tarPath: string) {
  nock("https://prod-budi-templates.s3-eu-west-1.amazonaws.com")
    .get(`/app/${key}.tar.gz`)
    .replyWithFile(200, tarPath)
}

function mockAgencyClientPortal() {
  setManifest({
    templates: {
      app: {
        "Agency Client Portal": {
          background: "#20a3a8",
          icon: "Project",
          category: "Portals",
          description:
            "Manage clients, streamline communications, and securely share files.",
          name: "Agency Client Portal",
          url: "https://budibase.com/portals/templates/agency-client-portal-template/",
          type: "app",
          key: "app/agency-client-portal",
          image:
            "https://prod-budi-templates.s3.eu-west-1.amazonaws.com/images/agency-client-portal.png",
        },
      },
    },
  })

  mockApp(
    "agency-client-portal",
    "packages/server/src/api/routes/tests/data/agency-client-portal.tar.gz"
  )
}

describe("/templates", () => {
  let config = setup.getConfig()

  afterAll(setup.afterAll)
  beforeAll(async () => {
    await config.init()
  })
  beforeEach(() => {
    nock.cleanAll()
    mockAgencyClientPortal()
  })

  describe("fetch", () => {
    it("should be able to fetch templates", async () => {
      const res = await config.api.templates.fetch()
      expect(res).toHaveLength(1)
      expect(res[0].name).toBe("Agency Client Portal")
    })
  })
})
