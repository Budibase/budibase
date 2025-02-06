import * as setup from "./utilities"
import path from "path"
import nock from "nock"
import { generator } from "@budibase/backend-core/tests"

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
    .get(`/templates/app/${key}.tar.gz`)
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
    path.resolve(__dirname, "data", "agency-client-portal.tar.gz")
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
      const templates = await config.api.templates.fetch()
      expect(templates).toHaveLength(1)
      expect(templates[0].name).toBe("Agency Client Portal")
    })
  })

  describe("create app from template", () => {
    it("should be able to create an app from a template", async () => {
      const name = generator.guid().replaceAll("-", "")
      const url = `/${name}`

      const app = await config.api.application.create({
        name,
        url,
        useTemplate: "true",
        templateName: "Agency Client Portal",
        templateKey: "app/agency-client-portal",
      })
      expect(app.name).toBe(name)
      expect(app.url).toBe(url)

      await config.withApp(app, async () => {
        const tables = await config.api.table.fetch()
        expect(tables).toHaveLength(2)

        tables.sort((a, b) => a.name.localeCompare(b.name))
        const [agencyProjects, users] = tables
        expect(agencyProjects.name).toBe("Agency Projects")
        expect(users.name).toBe("Users")

        const { rows } = await config.api.row.search(agencyProjects._id!, {
          tableId: agencyProjects._id!,
          query: {},
        })

        expect(rows).toHaveLength(3)
      })
    })
  })
})
