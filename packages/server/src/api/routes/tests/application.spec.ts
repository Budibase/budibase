import { DEFAULT_TABLES } from "../../../db/defaultData/datasource_bb_default"
import { setEnv, withEnv } from "../../../environment"

import { checkBuilderEndpoint } from "./utilities/TestFunctions"
import * as setup from "./utilities"
import { AppStatus } from "../../../db/utils"
import {
  events,
  utils,
  context,
  roles,
  features,
  Header,
  db,
} from "@budibase/backend-core"
import env from "../../../environment"
import {
  type App,
  BuiltinPermissionID,
  Screen,
  WorkspaceApp,
} from "@budibase/types"
import tk from "timekeeper"
import * as uuid from "uuid"
import { structures } from "@budibase/backend-core/tests"
import nock from "nock"
import path from "path"
import {
  basicScreen,
  customScreen,
  basicTable,
  basicQuery,
} from "../../../tests/utilities/structures"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"

describe("/applications", () => {
  let config = setup.getConfig()
  let app: App, cleanup: () => void

  afterAll(() => {
    setup.afterAll()
    cleanup()
  })
  beforeAll(async () => {
    cleanup = setEnv({ USE_LOCAL_COMPONENT_LIBS: "0" })
    await config.init()
  })

  async function createNewApp() {
    app = await config.newTenant()
    await config.publish()
  }

  beforeEach(async () => {
    await createNewApp()
    jest.clearAllMocks()
    nock.cleanAll()
  })

  // These need to go first for the app totals to make sense
  describe("permissions", () => {
    it("should only return apps a user has access to", async () => {
      let user = await config.createUser({
        builder: { global: false },
        admin: { global: false },
      })

      await config.withUser(user, async () => {
        const apps = await config.api.application.fetch()
        expect(apps).toHaveLength(0)
      })

      user = await config.globalUser({
        ...user,
        builder: {
          apps: [config.getProdAppId()],
        },
      })

      await config.withUser(user, async () => {
        const apps = await config.api.application.fetch()
        expect(apps).toHaveLength(1)
      })
    })

    it("should only return apps a user has access to through a custom role", async () => {
      let user = await config.createUser({
        builder: { global: false },
        admin: { global: false },
      })

      await config.withUser(user, async () => {
        const apps = await config.api.application.fetch()
        expect(apps).toHaveLength(0)
      })

      const role = await config.api.roles.save({
        name: "Test",
        inherits: "PUBLIC",
        permissionId: BuiltinPermissionID.READ_ONLY,
        version: "name",
      })

      user = await config.globalUser({
        ...user,
        roles: {
          [config.getProdAppId()]: role.name,
        },
      })

      await config.withUser(user, async () => {
        const apps = await config.api.application.fetch()
        expect(apps).toHaveLength(1)
      })
    })

    it("should only return apps a user has access to through a custom role on a group", async () => {
      let user = await config.createUser({
        builder: { global: false },
        admin: { global: false },
      })

      await config.withUser(user, async () => {
        const apps = await config.api.application.fetch()
        expect(apps).toHaveLength(0)
      })

      const roleName = uuid.v4().replace(/-/g, "")
      const role = await config.api.roles.save({
        name: roleName,
        inherits: "PUBLIC",
        permissionId: BuiltinPermissionID.READ_ONLY,
        version: "name",
      })

      const group = await config.createGroup(role._id!)

      user = await config.globalUser({
        ...user,
        userGroups: [group._id!],
      })

      await config.withUser(user, async () => {
        const apps = await config.api.application.fetch()
        expect(apps).toHaveLength(1)
      })
    })
  })

  describe("create", () => {
    const checkScreenCount = async (expectedCount: number) => {
      const res = await config.api.application.getDefinition(
        config.getProdAppId()
      )
      expect(res.screens.length).toEqual(expectedCount)
    }

    const checkTableCount = async (expectedCount: number) => {
      const tables = await config.api.table.fetch()
      expect(tables.length).toEqual(expectedCount)
    }

    it("creates empty app with sample data", async () => {
      const app = await config.api.application.create({ name: utils.newid() })
      expect(app._id).toBeDefined()
      expect(events.app.created).toHaveBeenCalledTimes(1)

      // Ensure we created sample resources
      await checkScreenCount(1)
      await checkTableCount(5)
    })

    it("creates app from template", async () => {
      nock("https://prod-budi-templates.s3-eu-west-1.amazonaws.com")
        .get(`/templates/app/agency-client-portal.tar.gz`)
        .replyWithFile(
          200,
          path.resolve(__dirname, "data", "agency-client-portal.tar.gz")
        )

      const app = await config.api.application.create({
        name: utils.newid(),
        useTemplate: "true",
        templateKey: "app/agency-client-portal",
      })
      expect(app._id).toBeDefined()
      expect(events.app.created).toHaveBeenCalledTimes(1)
      expect(events.app.templateImported).toHaveBeenCalledTimes(1)

      // Ensure we did not create sample data. This template includes exactly
      // this many of each resource.
      await checkScreenCount(1)
      await checkTableCount(5)
    })

    it("creates app from file", async () => {
      const app = await config.api.application.create({
        name: utils.newid(),
        useTemplate: "true",
        fileToImport: "src/api/routes/tests/data/export.txt",
      })
      expect(app._id).toBeDefined()
      expect(events.app.created).toHaveBeenCalledTimes(1)
      expect(events.app.fileImported).toHaveBeenCalledTimes(1)

      // Ensure we did not create sample data. This file includes exactly
      // this many of each resource.
      await checkScreenCount(1)
      await checkTableCount(5)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/applications`,
        body: { name: "My App" },
      })
    })

    it("migrates navigation settings from old apps", async () => {
      const app = await config.api.application.create({
        name: utils.newid(),
        useTemplate: "true",
        fileToImport: "src/api/routes/tests/data/old-app.txt",
      })
      expect(app._id).toBeDefined()
      expect(app.navigation).toBeDefined()
      expect(app.navigation!.hideLogo).toBe(true)
      expect(app.navigation!.title).toBe("Custom Title")
      expect(app.navigation!.hideLogo).toBe(true)
      expect(app.navigation!.navigation).toBe("Left")
      expect(app.navigation!.navBackground).toBe(
        "var(--spectrum-global-color-blue-600)"
      )
      expect(app.navigation!.navTextColor).toBe(
        "var(--spectrum-global-color-gray-50)"
      )
      expect(events.app.created).toHaveBeenCalledTimes(1)
      expect(events.app.fileImported).toHaveBeenCalledTimes(1)
    })

    it("should reject with a known name", async () => {
      await config.api.application.create(
        { name: app.name },
        { body: { message: "App name is already in use." }, status: 400 }
      )
    })

    it("should reject with a known url", async () => {
      await config.api.application.create(
        { name: "made up", url: app!.url! },
        { body: { message: "App URL is already in use." }, status: 400 }
      )
    })
  })

  describe("fetch", () => {
    it("lists all applications", async () => {
      const apps = await config.api.application.fetch({ status: AppStatus.DEV })
      expect(apps.length).toBeGreaterThan(0)
    })
  })

  describe("fetchClientApps", () => {
    it("should return apps with default workspace app when published", async () => {
      const response = await config.api.application.fetchClientApps()
      expect(response.apps).toHaveLength(1)
      expect(response.apps[0]).toEqual(
        expect.objectContaining({
          prodId: config.getProdAppId(),
          url: app.url,
        })
      )
    })

    it("should return multiple apps when published app with workspace apps exists", async () => {
      await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Test Workspace App",
          url: "/testapp",
        })
      )
      await config.publish()

      const response = await config.api.application.fetchClientApps()

      expect(response.apps.length).toBe(2)

      const testApp = response.apps.find(a => a.name === "Test Workspace App")
      expect(testApp).toEqual(
        expect.objectContaining({
          prodId: config.getProdAppId(),
          name: "Test Workspace App",
          url: `${app.url}/testapp`,
        })
      )
    })

    it("should handle creating multiple workspace apps", async () => {
      const { workspaceApp: workspaceApp1 } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "App One",
            url: "/appone",
          })
        )

      const { workspaceApp: workspaceApp2 } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "App Two",
            url: "/apptwo",
          })
        )
      const app = await config.publish()

      const response = await config.api.application.fetchClientApps()

      expect(response.apps.length).toBe(3)
      expect(response.apps).toEqual(
        expect.arrayContaining([
          {
            appId: expect.stringMatching(
              new RegExp(`^${app.appId}_workspace_app_.+`)
            ),
            name: app.name,
            prodId: app.appId,
            updatedAt: app.updatedAt,
            url: app.url,
          },
          {
            appId: `${app.appId}_${workspaceApp1._id}`,
            name: "App One",
            prodId: config.getProdAppId(),
            updatedAt: app.updatedAt,
            url: `${app.url}/appone`,
          },
          {
            appId: `${app.appId}_${workspaceApp2._id}`,
            name: "App Two",
            prodId: config.getProdAppId(),
            updatedAt: app.updatedAt,
            url: `${app.url}/apptwo`,
          },
        ])
      )
    })

    it("should return apps from multiple published workspaces", async () => {
      const { workspaceApp: app1Workspace1 } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "App One",
            url: "/appone",
          })
        )
      app = await config.publish()

      const secondApp = await tk.withFreeze(new Date(), async () => {
        // Create second app
        let secondApp = await config.api.application.create({
          name: "Second App",
        })

        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "App Two",
            url: "/apptwo",
          })
        )
        await config.api.application.publish(secondApp.appId)
        return secondApp
      })

      const response = await config.api.application.fetchClientApps()

      expect(response.apps).toHaveLength(3)

      expect(response.apps).toEqual(
        expect.arrayContaining([
          {
            appId: expect.stringMatching(
              new RegExp(`^${app.appId}_workspace_app_.+`)
            ),
            name: app.name,
            prodId: app.appId,
            updatedAt: app.updatedAt,
            url: app.url,
          },
          {
            appId: `${app.appId}_${app1Workspace1._id}`,
            name: "App One",
            prodId: config.getProdAppId(),
            updatedAt: app.updatedAt,
            url: `${app.url}/appone`,
          },
          {
            appId: expect.stringMatching(
              new RegExp(
                `^${db.getProdAppID(secondApp.appId)}_workspace_app_.+`
              )
            ),
            name: secondApp.name,
            prodId: db.getProdAppID(secondApp.appId),
            updatedAt: secondApp.updatedAt,
            url: secondApp.url,
          },
        ])
      )
    })

    it("should not return unpublished apps", async () => {
      const { workspaceApp: app1Workspace1 } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "App One",
            url: "/appone",
          })
        )
      app = await config.publish()

      // Non published workspace
      await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Another app",
          url: "/other",
        })
      )

      // Create second app
      const secondApp = await tk.withFreeze(new Date(), async () => {
        const secondApp = await config.api.application.create({
          name: "Second App",
        })
        await config.api.application.publish(secondApp.appId)
        return secondApp
      })

      // Unpublished app
      await config.api.application.create({
        name: "Third App",
      })

      const response = await config.api.application.fetchClientApps()

      expect(response.apps).toHaveLength(3)

      expect(response.apps).toEqual(
        expect.arrayContaining([
          {
            appId: expect.stringMatching(
              new RegExp(`^${app.appId}_workspace_app_.+`)
            ),
            name: app.name,
            prodId: app.appId,
            updatedAt: app.updatedAt,
            url: app.url,
          },
          {
            appId: `${app.appId}_${app1Workspace1._id}`,
            name: "App One",
            prodId: config.getProdAppId(),
            updatedAt: app.updatedAt,
            url: `${app.url}/appone`,
          },
          {
            appId: expect.stringMatching(
              new RegExp(
                `^${db.getProdAppID(secondApp.appId)}_workspace_app_.+`
              )
            ),
            name: secondApp.name,
            prodId: db.getProdAppID(secondApp.appId),
            updatedAt: secondApp.updatedAt,
            url: secondApp.url,
          },
        ])
      )
    })
  })

  describe("fetchAppDefinition", () => {
    it("should be able to get an apps definition", async () => {
      const res = await config.api.application.getDefinition(app.appId)
      expect(res.libraries.length).toEqual(1)
    })
  })

  describe("fetchAppPackage", () => {
    it("should be able to fetch the app package", async () => {
      const res = await config.api.application.getAppPackage(app.appId)
      expect(res.application).toBeDefined()
      expect(res.application.appId).toEqual(config.getAppId())
    })

    it("should retrieve all the screens for builder calls", async () => {
      await config.api.screen.save(basicScreen())
      await config.api.screen.save(basicScreen())
      await config.api.screen.save(basicScreen())

      const res = await config.api.application.getAppPackage(app.appId)

      expect(res.screens).toHaveLength(4) // Default one + 3 created
    })

    it("should retrieve all the screens for public calls", async () => {
      const [_screen1, screen2, _screen3] = await Promise.all([
        config.api.screen.save(basicScreen()),
        config.api.screen.save(
          customScreen({ roleId: roles.BUILTIN_ROLE_IDS.PUBLIC, route: "/" })
        ),
        config.api.screen.save(basicScreen()),
      ])

      await config.publish()
      const res = await config.api.application.getAppPackage(app.appId, {
        publicUser: true,
      })

      expect(res.screens).toHaveLength(1)
      expect(res.screens).toContainEqual(
        expect.objectContaining({ _id: screen2._id })
      )
    })

    describe("workspace apps", () => {
      describe("on", () => {
        let featureCleanup: () => void
        beforeAll(() => {
          featureCleanup = features.testutils.setFeatureFlags("*", {
            WORKSPACE_APPS: true,
          })
        })

        afterAll(() => {
          featureCleanup()
        })

        it("should retrieve all the screens for builder calls", async () => {
          await config.api.workspaceApp.create(
            structures.workspaceApps.createRequest()
          )

          const res = await config.api.application.getAppPackage(app.appId)

          expect(res.screens).toHaveLength(1)
        })

        describe("should retrieve only the screens for a given workspace app", () => {
          let workspaceAppInfo: {
            workspaceApp: WorkspaceApp
            screens: Screen[]
          }[]

          beforeEach(async () => {
            const appPackage = await config.api.application.getAppPackage(
              app.appId
            )
            const [defaultWorkspaceApp] = (
              await config.api.workspaceApp.fetch()
            ).workspaceApps

            const { workspaceApp: workspaceApp1 } =
              await config.api.workspaceApp.create(
                structures.workspaceApps.createRequest({
                  url: "/app1",
                })
              )
            const { workspaceApp: workspaceApp2 } =
              await config.api.workspaceApp.create(
                structures.workspaceApps.createRequest({
                  url: "/app2",
                })
              )

            workspaceAppInfo = []

            async function createScreens(
              workspaceApp: WorkspaceApp,
              routes: string[]
            ) {
              const screens = []

              for (const route of routes) {
                const screen = await config.api.screen.save({
                  ...basicScreen(route),
                  workspaceAppId: workspaceApp._id!,
                })
                screens.push(screen)
              }

              workspaceAppInfo.push({
                workspaceApp,
                screens,
              })
            }

            await createScreens(defaultWorkspaceApp, ["/page-1"])
            await createScreens(workspaceApp1, ["/", "/page-1", "/page-2"])
            await createScreens(workspaceApp2, ["/", "/page-1"])

            workspaceAppInfo[0].screens.unshift(...appPackage.screens)
          })

          it.each(["", "/"])(
            "should retrieve only the screens for a the workspace all with empty prefix",
            async closingChar => {
              await config.withHeaders(
                {
                  referer: `http://localhost:10000/${config.appId}${closingChar}`,
                },
                async () => {
                  const res = await config.api.application.getAppPackage(
                    app.appId,
                    {
                      headers: {
                        [Header.TYPE]: "client",
                      },
                    }
                  )

                  expect(res.screens).toHaveLength(2)
                  expect(res.screens).toEqual(
                    expect.arrayContaining(
                      workspaceAppInfo[0].screens.map(s =>
                        expect.objectContaining({ _id: s._id })
                      )
                    )
                  )
                }
              )
            }
          )

          it.each(["", "/"])(
            "should retrieve only the screens for a the workspace from the base url of it",
            async closingChar => {
              const { url } = workspaceAppInfo[1].workspaceApp
              await config.withHeaders(
                {
                  referer: `http://localhost:10000/${config.appId}${url}${closingChar}`,
                },
                async () => {
                  const res = await config.api.application.getAppPackage(
                    app.appId,
                    {
                      headers: {
                        [Header.TYPE]: "client",
                      },
                    }
                  )

                  expect(res.screens).toHaveLength(3)
                  expect(res.screens).toEqual(
                    expect.arrayContaining(
                      workspaceAppInfo[1].screens.map(s =>
                        expect.objectContaining({ _id: s._id })
                      )
                    )
                  )
                }
              )
            }
          )

          it("should retrieve only the screens for a the workspace from a page url", async () => {
            const { url } = workspaceAppInfo[1].workspaceApp
            await config.withHeaders(
              {
                referer: `http://localhost:10000/${config.appId}${url}#page-1`,
              },
              async () => {
                const res = await config.api.application.getAppPackage(
                  app.appId,
                  {
                    headers: {
                      [Header.TYPE]: "client",
                    },
                  }
                )

                expect(res.screens).toHaveLength(3)
                expect(res.screens).toEqual(
                  expect.arrayContaining(
                    workspaceAppInfo[1].screens.map(s =>
                      expect.objectContaining({ _id: s._id })
                    )
                  )
                )
              }
            )
          })

          it("should retrieve only the screens for a the workspace for prod app", async () => {
            await config.publish()
            await config.withProdApp(() =>
              config.withHeaders(
                {
                  referer: `http://localhost:10000/app${config.prodApp?.url}`,
                },
                async () => {
                  const res = await config.api.application.getAppPackage(
                    app.appId,
                    {
                      headers: {
                        [Header.TYPE]: "client",
                      },
                    }
                  )

                  expect(res.screens).toHaveLength(2)
                  expect(res.screens).toEqual(
                    expect.arrayContaining(
                      workspaceAppInfo[0].screens.map(s =>
                        expect.objectContaining({ _id: s._id })
                      )
                    )
                  )
                }
              )
            )
          })
        })
      })

      describe("off", () => {
        it("should retrieve all the screens", async () => {
          const res = await config.api.application.getAppPackage(app.appId)

          expect(res.screens).toHaveLength(1)
        })
      })
    })
  })

  describe("update", () => {
    it("should be able to update the app package", async () => {
      const updatedApp = await config.api.application.update(app.appId, {
        name: "TEST_APP",
      })
      expect(updatedApp._rev).toBeDefined()
      expect(events.app.updated).toHaveBeenCalledTimes(1)
    })
  })

  describe("publish", () => {
    it("should publish app with dev app ID", async () => {
      await config.api.application.publish(app.appId)
      expect(events.app.published).toHaveBeenCalledTimes(1)
    })

    it("should publish app with prod app ID", async () => {
      await config.api.application.publish(app.appId.replace("_dev", ""))
      expect(events.app.published).toHaveBeenCalledTimes(1)
    })

    // API to publish filtered resources currently disabled, skip test while not needed
    it.skip("should publish app with filtered resources, filtering by automation", async () => {
      // create data resources
      const table = await config.createTable(basicTable())
      // all internal resources are published if any used
      const tableUnused = await config.createTable(basicTable())
      const datasource = await config.createDatasource()
      const query = await config.createQuery(basicQuery(datasource._id!))

      // automation to publish
      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .executeQuery({ query: { queryId: query._id! } })
        .save()

      const rowAction = await config.api.rowAction.save(table._id!, {
        name: "test",
      })

      // create some assets that won't be published
      const unpublishedDatasource = await config.createDatasource()
      const { automation: unpublishedAutomation } =
        await createAutomationBuilder(config)
          .onRowSaved({ tableId: table._id! })
          .save()

      await config.api.application.filteredPublish(app.appId, {
        automationIds: [automation._id!],
      })

      await config.withProdApp(async () => {
        const { automations } = await config.api.automation.fetch()
        expect(
          automations.find(auto => auto._id === automation._id!)
        ).toBeDefined()
        expect(
          automations.find(auto => auto._id === unpublishedAutomation._id!)
        ).toBeUndefined()
        // row action automations should be published if row action published
        expect(
          automations.find(auto => auto._id === rowAction.automationId)
        ).toBeDefined()

        const datasources = await config.api.datasource.fetch()
        expect(datasources.find(ds => ds._id === datasource._id!)).toBeDefined()
        expect(
          datasources.find(ds => ds._id === unpublishedDatasource._id!)
        ).toBeUndefined()

        const tables = await config.api.table.fetch()
        expect(tables.find(tbl => tbl._id === table._id)).toBeDefined()
        expect(tables.find(tbl => tbl._id === tableUnused._id)).toBeDefined()

        const { actions } = await config.api.rowAction.find(table._id!)
        expect(
          Object.values(actions).find(action => action.id === rowAction.id)
        ).toBeDefined()
      })
    })

    // API to publish filtered resources currently disabled, skip test while not needed
    it.skip("should publish app with filtered resources, filtering by workspace app", async () => {
      // create two screens with different workspaceAppIds
      const { workspaceApp: workspaceApp1 } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest()
        )
      const { workspaceApp: workspaceApp2 } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest()
        )

      const publishedScreen = await config.api.screen.save({
        ...basicScreen("/published-screen"),
        workspaceAppId: workspaceApp1._id,
        name: "published-screen",
      })

      const unpublishedScreen = await config.api.screen.save({
        ...basicScreen("/unpublished-screen"),
        workspaceAppId: workspaceApp2._id,
        name: "unpublished-screen",
      })

      await config.api.application.filteredPublish(app.appId, {
        workspaceAppIds: [workspaceApp1._id],
      })

      await config.withProdApp(async () => {
        const screens = await config.api.screen.list()

        // published screen should be included
        expect(
          screens.find(screen => screen._id === publishedScreen._id)
        ).toBeDefined()

        // unpublished screen should not be included
        expect(
          screens.find(screen => screen._id === unpublishedScreen._id)
        ).toBeUndefined()
      })
    })
  })

  describe("manage client library version", () => {
    it("should be able to update the app client library version", async () => {
      await config.api.application.updateClient(app.appId)
      expect(events.app.versionUpdated).toHaveBeenCalledTimes(1)
    })

    it("should be able to revert the app client library version", async () => {
      await config.api.application.updateClient(app.appId)
      await config.api.application.revertClient(app.appId)
      expect(events.app.versionReverted).toHaveBeenCalledTimes(1)
    })
  })

  describe("edited at", () => {
    it("middleware should set updatedAt", async () => {
      const app = await tk.withFreeze(
        "2021-01-01",
        async () => await config.api.application.create({ name: utils.newid() })
      )
      expect(app.updatedAt).toEqual("2021-01-01T00:00:00.000Z")

      const updatedApp = await tk.withFreeze(
        "2021-02-01",
        async () =>
          await config.withApp(app, () =>
            config.api.application.update(app.appId, {
              name: "UPDATED_NAME",
            })
          )
      )
      expect(updatedApp._rev).toBeDefined()
      expect(updatedApp.updatedAt).toEqual("2021-02-01T00:00:00.000Z")

      const fetchedApp = await config.api.application.get(app.appId)
      expect(fetchedApp.updatedAt).toEqual("2021-02-01T00:00:00.000Z")
    })
  })

  describe("sync", () => {
    it("app should sync correctly", async () => {
      const { message } = await config.api.application.sync(app.appId)
      expect(message).toEqual("App sync completed successfully.")
    })

    it("app should not sync if production", async () => {
      const { message } = await config.api.application.sync(
        app.appId.replace("_dev", ""),
        { status: 400 }
      )

      expect(message).toEqual(
        "This action cannot be performed for production apps"
      )
    })

    it("app should not sync if sync is disabled", async () => {
      env._set("DISABLE_AUTO_PROD_APP_SYNC", true)
      const { message } = await config.api.application.sync(app.appId)
      expect(message).toEqual(
        "App sync disabled. You can reenable with the DISABLE_AUTO_PROD_APP_SYNC environment variable."
      )
      env._set("DISABLE_AUTO_PROD_APP_SYNC", false)
    })
  })

  describe("unpublish", () => {
    it("should unpublish app with dev app ID", async () => {
      await config.api.application.unpublish(app.appId)
      expect(events.app.unpublished).toHaveBeenCalledTimes(1)
    })

    it("should unpublish app with prod app ID", async () => {
      await config.api.application.unpublish(app.appId.replace("_dev", ""))
      expect(events.app.unpublished).toHaveBeenCalledTimes(1)
    })
  })

  describe("delete", () => {
    it("should delete published app and dev apps with dev app ID", async () => {
      const prodAppId = app.appId.replace("_dev", "")
      nock("http://localhost:10000")
        .delete(`/api/global/roles/${prodAppId}`)
        .reply(200, {})

      await config.api.application.delete(app.appId)
      expect(events.app.deleted).toHaveBeenCalledTimes(1)
      expect(events.app.unpublished).toHaveBeenCalledTimes(1)
    })

    it("should delete published app and dev app with prod app ID", async () => {
      const prodAppId = app.appId.replace("_dev", "")
      nock("http://localhost:10000")
        .delete(`/api/global/roles/${prodAppId}`)
        .reply(200, {})

      await config.api.application.delete(prodAppId)
      expect(events.app.deleted).toHaveBeenCalledTimes(1)
      expect(events.app.unpublished).toHaveBeenCalledTimes(1)
    })

    it("should remove MIGRATING_APP header if present during deletion", async () => {
      const appMigrationsModule = await import(
        "../../../appMigrations/migrations"
      )

      const migrationMock = jest.fn()
      appMigrationsModule.MIGRATIONS.push({
        id: "99999999999999_test_deletion",
        func: migrationMock,
      })

      const prodAppId = app.appId.replace("_dev", "")
      nock("http://localhost:10000")
        .delete(`/api/global/roles/${prodAppId}`)
        .reply(200, {})

      expect(migrationMock).not.toHaveBeenCalled()
      await withEnv(
        {
          SYNC_MIGRATION_CHECKS_MS: 1000,
        },
        () =>
          config.api.application.delete(app.appId, {
            headersNotPresent: [Header.MIGRATING_APP],
          })
      )

      expect(migrationMock).toHaveBeenCalledTimes(2)
      expect(events.app.deleted).toHaveBeenCalledTimes(1)
    })
  })

  describe("POST /api/applications/:appId/duplicate", () => {
    it("should duplicate an existing app", async () => {
      const resp = await config.api.application.duplicateApp(
        app.appId,
        {
          name: "to-dupe copy",
          url: "/to-dupe-copy",
        },
        {
          status: 200,
        }
      )

      expect(events.app.duplicated).toHaveBeenCalled()
      expect(resp.duplicateAppId).toBeDefined()
      expect(resp.sourceAppId).toEqual(app.appId)
      expect(resp.duplicateAppId).not.toEqual(app.appId)
    })

    it("should reject an unknown app id with a 404", async () => {
      await config.api.application.duplicateApp(
        structures.db.id(),
        {
          name: "to-dupe 123",
          url: "/to-dupe-123",
        },
        {
          status: 404,
        }
      )
    })

    it("should reject with a known name", async () => {
      await config.api.application.duplicateApp(
        app.appId,
        {
          name: app.name,
          url: "/known-name",
        },
        { body: { message: "App name is already in use." }, status: 400 }
      )
      expect(events.app.duplicated).not.toHaveBeenCalled()
    })

    it("should reject with a known url", async () => {
      await config.api.application.duplicateApp(
        app.appId,
        {
          name: "this is fine",
          url: app.url,
        },
        { body: { message: "App URL is already in use." }, status: 400 }
      )
      expect(events.app.duplicated).not.toHaveBeenCalled()
    })
  })

  describe("POST /api/applications/:appId/sync", () => {
    it("should not sync automation logs", async () => {
      const automation = await config.createAutomation()
      await context.doInAppContext(app.appId, () =>
        config.createAutomationLog(automation)
      )

      await config.api.application.sync(app.appId)

      // does exist in prod
      const prodLogs = await config.getAutomationLogs()
      expect(prodLogs.data.length).toBe(1)

      await config.api.application.unpublish(app.appId)

      // doesn't exist in dev
      const devLogs = await config.getAutomationLogs()
      expect(devLogs.data.length).toBe(0)
    })
  })

  describe("POST /api/applications/:appId/sample", () => {
    it("should be able to add sample data", async () => {
      await config.api.application.addSampleData(config.getAppId())
      for (let table of DEFAULT_TABLES) {
        const res = await config.api.row.search(
          table._id!,
          { query: {} },
          { status: 200 }
        )
        expect(res.rows.length).not.toEqual(0)
      }
    })
  })
})
