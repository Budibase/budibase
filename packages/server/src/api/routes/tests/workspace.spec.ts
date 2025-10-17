import { DEFAULT_TABLES } from "../../../db/defaultData/datasource_bb_default"
import { setEnv, withEnv } from "../../../environment"

import { Header, context, db, events, roles } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import {
  type Workspace,
  BuiltinPermissionID,
  PermissionLevel,
  Screen,
  WorkspaceApp,
} from "@budibase/types"
import nock from "nock"
import path from "path"
import tk from "timekeeper"
import * as uuid from "uuid"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"
import { WorkspaceStatus } from "../../../db/utils"
import env from "../../../environment"
import sdk from "../../../sdk"
import { getAppObjectStorageEtags } from "../../../tests/utilities/objectStore"
import {
  basicQuery,
  basicScreen,
  basicTable,
  customScreen,
} from "../../../tests/utilities/structures"
import * as setup from "./utilities"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"

const generateAppName = () => {
  return structures.generator.word({ length: 10 })
}

describe("/applications", () => {
  let config = setup.getConfig()
  let workspace: Workspace

  afterAll(() => {
    setup.afterAll()
  })

  beforeAll(async () => {
    await config.init()
  })

  async function createNewApp() {
    workspace = await config.newTenant()
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
        const apps = await config.api.workspace.fetch()
        expect(apps).toHaveLength(0)
      })

      user = await config.globalUser({
        ...user,
        builder: {
          apps: [config.getProdWorkspaceId()],
        },
      })

      await config.withUser(user, async () => {
        const apps = await config.api.workspace.fetch()
        expect(apps).toHaveLength(1)
      })
    })

    it("should only return apps a user has access to through a custom role", async () => {
      let user = await config.createUser({
        builder: { global: false },
        admin: { global: false },
      })

      await config.withUser(user, async () => {
        const apps = await config.api.workspace.fetch()
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
          [config.getProdWorkspaceId()]: role.name,
        },
      })

      await config.withUser(user, async () => {
        const apps = await config.api.workspace.fetch()
        expect(apps).toHaveLength(1)
      })
    })

    it("should only return apps a user has access to through a custom role on a group", async () => {
      let user = await config.createUser({
        builder: { global: false },
        admin: { global: false },
      })

      await config.withUser(user, async () => {
        const apps = await config.api.workspace.fetch()
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
        const apps = await config.api.workspace.fetch()
        expect(apps).toHaveLength(1)
      })
    })
  })

  describe("create", () => {
    const checkScreenCount = async (expectedCount: number) => {
      const res = await config.api.workspace.getDefinition(
        config.getDevWorkspaceId()
      )
      expect(res.screens.length).toEqual(expectedCount)
    }

    const checkTableCount = async (expectedCount: number) => {
      const tables = await config.api.table.fetch()
      expect(tables.length).toEqual(expectedCount)
    }

    it("creates empty app without sample data", async () => {
      const name = generateAppName()
      const newWorkspace = await config.api.workspace.create({
        name,
      })
      expect(newWorkspace.name).toBe(name)
      expect(newWorkspace._id).toBeDefined()
      expect(events.app.created).toHaveBeenCalledTimes(1)

      // Ensure we created a blank app without sample data
      await checkScreenCount(0)
      await checkTableCount(1) // users table
    })

    it("creates app with sample data when onboarding", async () => {
      const name = generateAppName()
      const newWorkspace = await config.api.workspace.create({
        name,
        isOnboarding: "true",
      })
      expect(newWorkspace._id).toBeDefined()
      expect(newWorkspace.name).toBe("Default workspace")
      expect(events.app.created).toHaveBeenCalledTimes(1)

      // Check sample resources in the newly created app context
      await config.withApp(newWorkspace, async () => {
        const workspaceAppsFetchResult = await config.api.workspaceApp.fetch()
        const {
          workspaceApps: [app],
        } = workspaceAppsFetchResult
        expect(app.name).toBe(name)

        const res = await config.api.workspace.getDefinition(newWorkspace.appId)
        expect(res.screens.length).toEqual(1)

        const tables = await config.api.table.fetch()
        expect(tables.length).toEqual(5)
      })
    })

    it("creates app from template", async () => {
      nock("https://prod-budi-templates.s3-eu-west-1.amazonaws.com")
        .get(`/templates/app/expense-approval.tar.gz`)
        .replyWithFile(
          200,
          path.resolve(__dirname, "data", "expense-approval.tar.gz")
        )

      const newApp = await config.api.workspace.create({
        name: generateAppName(),
        useTemplate: "true",
        templateKey: "app/expense-approval",
      })
      expect(newApp._id).toBeDefined()
      expect(events.app.created).toHaveBeenCalledTimes(1)
      expect(events.app.templateImported).toHaveBeenCalledTimes(1)

      // Check resources from template in the newly created app context
      await config.withApp(newApp, async () => {
        const res = await config.api.workspace.getDefinition(newApp.appId)
        expect(res.screens.length).toEqual(6)

        const tables = await config.api.table.fetch()
        expect(tables.length).toEqual(4)
      })
    })

    it("creates app from file", async () => {
      const newApp = await config.api.workspace.create({
        name: generateAppName(),
        useTemplate: "true",
        fileToImport: "src/api/routes/tests/data/old-app.txt", // export.tx was empty
      })
      expect(newApp._id).toBeDefined()
      expect(events.app.created).toHaveBeenCalledTimes(1)
      expect(events.app.fileImported).toHaveBeenCalledTimes(1)

      // Check resources from import file in the newly created app context
      await config.withApp(newApp, async () => {
        const res = await config.api.workspace.getDefinition(newApp.appId)
        expect(res.screens.length).toEqual(1)

        const tables = await config.api.table.fetch()
        expect(tables.length).toEqual(1)
      })
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
      const app = await config.api.workspace.create({
        name: generateAppName(),
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
      await config.api.workspace.create(
        { name: workspace.name },
        { body: { message: "App name is already in use." }, status: 400 }
      )
    })

    it("should reject with a known url", async () => {
      await config.api.workspace.create(
        { name: "made up", url: workspace!.url! },
        { body: { message: "App URL is already in use." }, status: 400 }
      )
    })

    it("creates app from a old import", async () => {
      const newApp = await config.api.workspace.createFromImport({
        name: generateAppName(),
        fileToImport: path.join(__dirname, "data", "old-export.enc.tar.gz"),
        encryptionPassword: "testtest",
      })
      expect(newApp._id).toBeDefined()
      expect(events.app.created).toHaveBeenCalledTimes(1)
      expect(events.app.fileImported).toHaveBeenCalledTimes(1)

      // Check resources from import file in the newly created app context
      await config.withApp(newApp, async () => {
        const res = await config.api.workspace.getDefinition(newApp.appId)
        expect(res.screens.length).toEqual(2)

        const tables = await config.api.table.fetch()
        expect(tables.length).toEqual(7)
      })

      const fileEtags = await getAppObjectStorageEtags(newApp.appId)
      expect(fileEtags).toEqual({
        // These etags match the ones from the export file
        "budibase-client.js": "a0ab956601262aae131122b3f65102da-2",
        "manifest.json": "8eecdd3935062de5298d8d115453e124",
      })
    })

    it("creates app from a new import", async () => {
      const newApp = await config.api.workspace.createFromImport({
        name: generateAppName(),
        fileToImport: path.join(__dirname, "data", "export.tar.gz"),
      })
      expect(newApp._id).toBeDefined()
      expect(events.app.created).toHaveBeenCalledTimes(1)
      expect(events.app.fileImported).toHaveBeenCalledTimes(1)

      // Check resources from import file in the newly created app context
      await config.withApp(newApp, async () => {
        const res = await config.api.workspace.getDefinition(newApp.appId)
        expect(res.screens.length).toEqual(6)

        const tables = await config.api.table.fetch()
        expect(tables.length).toEqual(3)
      })

      const fileEtags = await getAppObjectStorageEtags(newApp.appId)
      expect(fileEtags).toEqual({
        // These etags match the ones from the export file
        "budibase-client.esm.js": "f6848d844994c1e220c94498ddbc6b38",
        "budibase-client.js": "d94c9df976f805497f6f44fd5fc568d4-2",
        "chunks/Accordion-9cca26a0.js": "ec9512fced7ea993f9719e65cd2e6e38",
        "chunks/ApexChart-5b4a3d9d.js": "b1ea9b71c2fb4d523b2d415232da6c8a",
        "chunks/AreaChart-44e19b77.js": "47f20c21b4af6be12e087de22df8cc7e",
        "chunks/AttachmentField-a12e4946.js":
          "e2764138f4949f3ac1c72358ed5fc60a",
        "chunks/AttachmentSingleField-7e764dbf.js":
          "2b1e12daaf6b9b0bd2cde08ae234f950",
        "chunks/BBReferenceField-cfc17956.js":
          "5047590aa421bfd2ff69043466d36f42",
        "chunks/BBReferenceSingleField-83e64059.js":
          "26dbdeb210644f56a99964be538319d7",
        "chunks/BackgroundImage-4982e45e.js":
          "e7c4b9f593bf421e00e4567367cf358a",
        "chunks/BarChart-0428f963.js": "4e6365f28289faf5b6e1c23dd0fe8e66",
        "chunks/BigIntField-ed133a4a.js": "552f3624c8a50ec3ffa2cc0621042b91",
        "chunks/BooleanField-1499476d.js": "7fe6688751d936d147341e5a931757bf",
        "chunks/Button-c7fa1868.js": "ef83c3bdde5f10b856f76070e4259728",
        "chunks/ButtonGroup-a310c488.js": "52acb925551f183bb4d6a9e31e72af6a",
        "chunks/CandleStickChart-a4a9d143.js":
          "4d253b2ab71b3933fcc9d5ac8a43fc30",
        "chunks/Card-89291907.js": "cd522aee24ec242cf68851d4637f6b40",
        "chunks/CardHorizontal-4856557b.js": "14a72bd2aee0aa7b4cb40280421c5477",
        "chunks/CardStat-dba219c4.js": "ac1f52d6ae1ecc25914ccc07d96bd080",
        "chunks/CardsBlock-19962fe4.js": "4e5a0a5dc704b3f64564d4f30915da9c",
        "chunks/ChartBlock-d8c111b4.js": "4291b235134b7ce512eedb08fdbd817d",
        "chunks/CheckboxGroup-9d863d31.js": "853f5c207e9b2c5e57aff3b4dfae203d",
        "chunks/CodeGenerator-b39a8f85.js": "99ab2bdd04bf900a473468e1996380de",
        "chunks/CodeScannerField-6386017e.js":
          "06e45b5cc8bae122dc7d963adf188ab0",
        "chunks/CollapsedButtonGroup-d8de26c5.js":
          "78feb06de3124f84c09769f38ac14c0d",
        "chunks/Container-4931ed81.js": "2a5a53e8c2b97afcf9f6e12b3740a874",
        "chunks/DataProvider-c2eb491f.js": "4b4829e2812f326554937c3841f475bc",
        "chunks/DatePicker-068351bc.js": "c60d541deebf2ba00d3848b27c33057c",
        "chunks/DatePicker-35c5ed8a.js": "1d04b2463e899f90f1db1cecd7c0babe",
        "chunks/DateRangePicker-ee5c28e9.js":
          "1f49bab1613493166cfb4fcfdae2d90a",
        "chunks/DateTimeField-f8090126.js": "4af8e875405f3a459dfb2323384b19b1",
        "chunks/Divider-bd03f6fb.js": "323d134a73a433904dcc739c4147b7ba",
        "chunks/DonutChart-11db2ed7.js": "c97a5311ec89b1df7dee9830e1f4a58a",
        "chunks/DynamicFilter-ef41ebe9.js": "c84a17ba7e732bf391f5372c2f445185",
        "chunks/Embed-87363b6d.js": "e12d52399416305233b098e1402b775f",
        "chunks/EmbeddedMap-6e53b98f.js": "5a5626f9823623ae2648a1c613a8fb7a",
        "chunks/Field-a0270b82.js": "352b39e6f484630b31db6de2e4393a0c",
        "chunks/FieldGroup-543c7365.js": "cbf70e3b7f2f84e04c82491f015590fd",
        "chunks/Filter-3ffb41e7.js": "37e686fcc853e1467f59f2c43b95f788",
        "chunks/Form-65c5c1fc.js": "21c2efd3e635624d6beeec291100a36c",
        "chunks/FormBlock-ce75163c.js": "b2b766ba468b50a6ebbe66ef9b2d201e",
        "chunks/FormBlockComponent-ef01f7a7.js":
          "d2a53c058f68de7d35c555fe47fa5fc7",
        "chunks/FormStep-dbc420ca.js": "8a75114e6db7d2fa1fd6722887460b2e",
        "chunks/GridBlock-bcf934a1.js": "1923f17f953bb89b7b347c299638dac6",
        "chunks/Heading-f38de215.js": "fd02279b4b3750e29b3d9c8e7bef0ffe",
        "chunks/HistogramChart-74885af0.js": "5fe1caedd3b68101193d3440df864187",
        "chunks/Icon-b3cc9c4c.js": "a64612c525db4ec795453a43728c1431",
        "chunks/IconV2-ee1fcd86.js": "20acc1930f2e74914e00f18c1595b8f1",
        "chunks/Image-dfe48334.js": "e1bcc8e7533fd3bcf27ac1a9fc230a81",
        "chunks/InnerForm-0042fa8f.js": "994539a4fbdfae000f0c04516560294d",
        "chunks/Item-43bbcac6.js": "32588e5752c61b0a6bbac750b4e73564",
        "chunks/JSONField-361c6eb9.js": "f4c7170e66427aa970d01c8fffd9c146",
        "chunks/Layout-04a25671.js": "cadd777860c094a8277bbecdfe037537",
        "chunks/LineChart-9fda5b47.js": "d1ad1c6462352cf3088db52bdcae06b1",
        "chunks/Link-fa4a78c7.js": "178e67509b7f923de4d6bf8480dd033e",
        "chunks/LongFormField-0bef90b1.js": "83efd0044c80832aa0cde18fe25127ea",
        "chunks/MarkdownViewer-04a414fe.js": "d6503a0ca993e2193a3728e66d456c66",
        "chunks/MarkdownViewer-cf7dad2b.js": "ef0c684ecb98fc3598ea8a11f6c12092",
        "chunks/Modal-75738615.js": "a447c6897615560ec0c6cb83a7a556b1",
        "chunks/MultiFieldSelect-f504cbce.js":
          "4afe468194e7f128797f6094566a57b8",
        "chunks/MultiStepFormblock-37b5b4f1.js":
          "dfdf1b4f3f80d9b24c8acd7092f5b170",
        "chunks/Multiselect-cb208362.js": "9bf0b0cc7d73f9aab2ef27612caa767b",
        "chunks/Navigation-9e54504f.js": "f3048323e14dcdd463df825cc2fec52e",
        "chunks/NumberField-02a75204.js": "b28a56fa72565d356f08601dd892a67f",
        "chunks/OptionsField-c1f4b374.js": "01a4ea023637efe910277e5b4d377ea2",
        "chunks/PDF-cf382f13.js": "a6a286d66e8cfa78ec067579d12f24e6",
        "chunks/PDFTable-fe446882.js": "f1a11a1687e2ca9d6e3117dfcd5848bf",
        "chunks/PasswordField-9b077ac9.js": "de1a2dc6f5df73541360238de00c7a88",
        "chunks/PieChart-ec8f28cd.js": "a4502c8982824c19a5e808096c55d4f1",
        "chunks/Placeholder-4dedd9c4.js": "dd5e5234ed7db8e464edaaf1a1a5e1c2",
        "chunks/RadioGroup-75258068.js": "d317f9b7f74a2db01acf5e78d6225d10",
        "chunks/RatingField-46823661.js": "cc06e316c27d1bc5da08ce0dd43a3a06",
        "chunks/RelationshipField-3efc82fb.js":
          "06e95dd226d7b93c844a992e9e7beb99",
        "chunks/Repeater-f14cafc9.js": "9f8470b0b4672315fbe0f1f63c96f86f",
        "chunks/RepeaterBlock-1d1ed77d.js": "1a668f5bcf8994ad0691bff16fad0f7d",
        "chunks/RowExplorer-67121c16.js": "e7240383d083befa888769749e86e2ea",
        "chunks/S3Upload-8c366084.js": "c58955aeadd599bc96a35fb0e2720240",
        "chunks/ScreenSlot-66447642.js": "c36ac82140074703422d77a53465290f",
        "chunks/Section-52788705.js": "35e3239c8a09416124ab5019f75f02eb",
        "chunks/SidePanel-d5419cc3.js": "33e60267697d710801bdb62d287c94f7",
        "chunks/SignatureField-5c36824c.js": "dc806a314c7bd779b49d2165ff71f142",
        "chunks/SingleRowProvider-9f648522.js":
          "e3817c1086583c75e759aea846e9b098",
        "chunks/SpectrumCard-6580d0c0.js": "da6fed7a90e4d3c116391c548f603911",
        "chunks/StackedList-fdb8c6c4.js": "1e2fecbb2b6f1e901fa0b280cd64f7b8",
        "chunks/StringField-ac8abf33.js": "2efd434bdac0c0602c504bb47ae78968",
        "chunks/Table-70055afa.js": "da4bec11edc5d98eb854b63b867cc90c",
        "chunks/TableBlock-39c419ea.js": "1b8391f1b9adecab1fe0da757c09c29e",
        "chunks/Tag-270bec7e.js": "e57e342b4af202d947457ec08a7c7ca6",
        "chunks/Text-737e775f.js": "9a8f361ba1eafdd326bbb25e014291b9",
        "chunks/Text-b9f6e161.js": "4200792440c1c7c3ad59ad48c4bee659",
        "chunks/TextArea-78f87eef.js": "1ca1605c2cc2a3d42f7e4091c65916df",
        "chunks/UserAvatar-4b1adc76.js": "608e8e94885bd1606079d960ea1801ed",
        "chunks/___vite-browser-external_commonjs-proxy-437eb1e3.js":
          "7ef73805ad72b431a50eacdba8473cb4",
        "chunks/_commonjs-dynamic-modules-58f2b0ec.js":
          "f4894f5027d4507efa95bac3f0835734",
        "chunks/apexcharts.common-290331c1.js":
          "8bfcacda7c0e2aa2ddbe28ada4fef740",
        "chunks/blocks-7fc2c1d0.js": "5c607205e8da87c5283a762806933ee5",
        "chunks/easymde-68976a10.js": "0f0105832a44a227cabec5ee7c363082",
        "chunks/index-8b9900f1.js": "46026a89a663966c2c5b76d978b69d2d",
        "chunks/index-9ad91fbe.js": "13bfa53aa3582c38f82d747e4186701e",
        "chunks/optionsParser-a13cad91.js": "6dc97a247da4216a7706cfa641a8c94f",
        "chunks/phosphorIconLoader-f5abc73c.js":
          "b2ab8b782be3a65902f50a4f5bcb079b",
        "chunks/table-46a4929b.js": "78296f79d7aa785d5f6a1a1a5dceee3a",
        "chunks/users-bee20df5.js": "40d29d530dc9b4f6ec0d54d020cb0710",
        "chunks/utc-71549d16.js": "e2a1d198f0d5941807e95d62408681e7",
        "manifest.json": "84459d28e16709c6c3edeabfc6912dbf",
      })
    })
  })

  describe("fetch", () => {
    it("lists all applications", async () => {
      const apps = await config.api.workspace.fetch({
        status: WorkspaceStatus.DEV,
      })
      expect(apps.length).toBeGreaterThan(0)
    })
  })

  describe("fetchClientApps", () => {
    it("should return apps when workspace app are published", async () => {
      const response = await config.api.workspace.fetchClientApps()
      expect(response.apps).toHaveLength(1)
      expect(response.apps[0]).toEqual(
        expect.objectContaining({
          prodId: config.getProdWorkspaceId(),
          url: workspace.url,
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

      const response = await config.api.workspace.fetchClientApps()

      expect(response.apps.length).toBe(2)

      const testApp = response.apps.find(a => a.name === "Test Workspace App")
      expect(testApp).toEqual(
        expect.objectContaining({
          prodId: config.getProdWorkspaceId(),
          name: "Test Workspace App",
          url: `${workspace.url}/testapp`,
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

      const response = await config.api.workspace.fetchClientApps()

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
            prodId: config.getProdWorkspaceId(),
            updatedAt: app.updatedAt,
            url: `${app.url}/appone`,
          },
          {
            appId: `${app.appId}_${workspaceApp2._id}`,
            name: "App Two",
            prodId: config.getProdWorkspaceId(),
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
      workspace = await config.publish()

      const secondWorkspace = await tk.withFreeze(new Date(), async () => {
        // Create second workspace
        let secondWorkspace = await config.api.workspace.create({
          name: "Second workspace",
          url: "workspace2",
        })

        await config.withApp(secondWorkspace, async () => {
          await config.api.workspaceApp.create(
            structures.workspaceApps.createRequest({
              name: "App Two",
              url: "/apptwo",
              disabled: false,
            })
          )
          await config.api.workspace.publish(secondWorkspace.appId)
        })
        return secondWorkspace
      })

      const response = await config.api.workspace.fetchClientApps()

      expect(response.apps).toHaveLength(3)

      expect(response.apps).toEqual(
        expect.arrayContaining([
          {
            appId: expect.stringMatching(
              new RegExp(`^${workspace.appId}_workspace_app_.+`)
            ),
            name: workspace.name,
            prodId: workspace.appId,
            updatedAt: workspace.updatedAt,
            url: workspace.url,
          },
          {
            appId: `${workspace.appId}_${app1Workspace1._id}`,
            name: "App One",
            prodId: config.getProdWorkspaceId(),
            updatedAt: workspace.updatedAt,
            url: `${workspace.url}/appone`,
          },
          {
            appId: expect.stringMatching(
              new RegExp(
                `^${db.getProdWorkspaceID(secondWorkspace.appId)}_workspace_app_.+`
              )
            ),
            name: "App Two",
            prodId: db.getProdWorkspaceID(secondWorkspace.appId),
            updatedAt: secondWorkspace.updatedAt,
            url: `${secondWorkspace.url}/apptwo`,
          },
        ])
      )
    })

    it("should not return unpublished workspaces", async () => {
      const { workspaceApp: app1Workspace1 } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "App One",
            url: "/appone",
            disabled: false,
          })
        )
      workspace = await config.publish()

      // Non published workspace
      await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Another workspace",
          url: "/other",
          disabled: false,
        })
      )

      // Create second app
      const secondWorkspace = await tk.withFreeze(new Date(), async () => {
        const secondWorkspace = await config.api.workspace.create({
          name: "Second workspace",
        })

        await config.withApp(secondWorkspace, () =>
          config.api.workspaceApp.create(
            structures.workspaceApps.createRequest({
              name: "Default",
              url: "/",
            })
          )
        )
        await config.api.workspace.publish(secondWorkspace.appId)
        return secondWorkspace
      })

      // Unpublished workspace
      const thirdWorkspace = await config.api.workspace.create({
        name: "Third App",
      })
      await config.withApp(thirdWorkspace, () =>
        config.api.workspaceApp.create(structures.workspaceApps.createRequest())
      )

      const response = await config.api.workspace.fetchClientApps()

      expect(response.apps).toHaveLength(3)

      expect(response.apps).toEqual(
        expect.arrayContaining([
          {
            appId: expect.stringMatching(
              new RegExp(`^${workspace.appId}_workspace_app_.+`)
            ),
            name: workspace.name,
            prodId: workspace.appId,
            updatedAt: workspace.updatedAt,
            url: workspace.url,
          },
          {
            appId: `${workspace.appId}_${app1Workspace1._id}`,
            name: "App One",
            prodId: config.getProdWorkspaceId(),
            updatedAt: workspace.updatedAt,
            url: `${workspace.url}/appone`,
          },
          {
            appId: expect.stringMatching(
              new RegExp(
                `^${db.getProdWorkspaceID(secondWorkspace.appId)}_workspace_app_.+`
              )
            ),
            name: "Default",
            prodId: db.getProdWorkspaceID(secondWorkspace.appId),
            updatedAt: secondWorkspace.updatedAt,
            url: secondWorkspace.url,
          },
        ])
      )
    })

    it("should not return disabled apps", async () => {
      const { workspaceApp: app1Workspace1 } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "App One",
            url: "/appone",
            disabled: false,
          })
        )

      await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Another app",
          url: "/other",
          disabled: true,
        })
      )

      workspace = await config.publish()

      const response = await config.api.workspace.fetchClientApps()

      expect(response.apps).toHaveLength(2)
      expect(response.apps).toEqual(
        expect.arrayContaining([
          {
            appId: expect.stringMatching(
              new RegExp(`^${workspace.appId}_workspace_app_.+`)
            ),
            name: workspace.name,
            prodId: workspace.appId,
            updatedAt: workspace.updatedAt,
            url: workspace.url,
          },
          {
            appId: `${workspace.appId}_${app1Workspace1._id}`,
            name: "App One",
            prodId: config.getProdWorkspaceId(),
            updatedAt: workspace.updatedAt,
            url: `${workspace.url}/appone`,
          },
        ])
      )
    })
  })

  describe("fetchAppDefinition", () => {
    it("should be able to get an apps definition", async () => {
      const res = await config.api.workspace.getDefinition(workspace.appId)
      expect(res.libraries.length).toEqual(1)
    })
  })

  describe("fetchAppPackage", () => {
    it("should be able to fetch the app package", async () => {
      const res = await config.api.workspace.getAppPackage(workspace.appId)
      expect(res.application).toBeDefined()
      expect(res.application.appId).toEqual(config.getDevWorkspaceId())
    })

    it("should retrieve all the screens for builder calls", async () => {
      await config.api.screen.save(basicScreen())
      await config.api.screen.save(basicScreen())
      await config.api.screen.save(basicScreen())

      const res = await config.api.workspace.getAppPackage(workspace.appId)

      expect(res.screens).toHaveLength(3) // 3 created screens
    })

    it("should retrieve all the screens for public calls", async () => {
      const [_screen1, screen2, _screen3] = await Promise.all([
        config.api.screen.save(basicScreen()),
        config.api.screen.save(
          customScreen({
            roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
            route: "/",
          })
        ),
        config.api.screen.save(basicScreen()),
      ])

      await config.publish()
      const res = await config.withHeaders(
        { referer: `http://localhost:10000/app${workspace.url}` },
        () =>
          config.api.workspace.getAppPackage(config.getProdWorkspaceId(), {
            publicUser: true,
          })
      )

      expect(res.screens).toHaveLength(1)
      expect(res.screens).toContainEqual(
        expect.objectContaining({ _id: screen2._id })
      )
    })

    describe("workspace apps", () => {
      it("should retrieve all the screens for builder calls", async () => {
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest()
        )

        const res = await config.api.workspace.getAppPackage(workspace.appId)

        expect(res.screens).toHaveLength(0)
      })

      describe("should retrieve only the screens for a given workspace app", () => {
        let workspaceAppInfo: {
          workspaceApp: WorkspaceApp
          screens: Screen[]
        }[]

        beforeEach(async () => {
          const appPackage = await config.api.workspace.getAppPackage(
            workspace.appId
          )

          let defaultWorkspaceApp: WorkspaceApp | undefined

          const { workspaceApps: allWorkspaceApps } =
            await config.api.workspaceApp.fetch()
          defaultWorkspaceApp = allWorkspaceApps[0]
          if (!defaultWorkspaceApp) {
            defaultWorkspaceApp = (
              await config.api.workspaceApp.create(
                structures.workspaceApps.createRequest({
                  name: "Default",
                  url: "/",
                })
              )
            ).workspaceApp
          }

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
                referer: `http://localhost:10000/${config.devWorkspaceId}${closingChar}`,
              },
              async () => {
                const res = await config.api.workspace.getAppPackage(
                  workspace.appId,
                  {
                    headers: {
                      [Header.TYPE]: "client",
                    },
                  }
                )

                expect(res.screens).toHaveLength(1)
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
                referer: `http://localhost:10000/${config.devWorkspaceId}${url}${closingChar}`,
              },
              async () => {
                const res = await config.api.workspace.getAppPackage(
                  workspace.appId,
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
              referer: `http://localhost:10000/${config.devWorkspaceId}${url}#page-1`,
            },
            async () => {
              const res = await config.api.workspace.getAppPackage(
                workspace.appId,
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
                referer: `http://localhost:10000/app${config.prodWorkspace?.url}`,
              },
              async () => {
                const res = await config.api.workspace.getAppPackage(
                  config.getDevWorkspaceId(),
                  {
                    headers: {
                      [Header.TYPE]: "client",
                    },
                  }
                )

                expect(res.screens).toHaveLength(1)
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
  })

  describe("update", () => {
    it("should be able to update the app package", async () => {
      const updatedApp = await config.api.workspace.update(workspace.appId, {
        name: "TEST_APP",
      })
      expect(updatedApp._rev).toBeDefined()
      expect(events.app.updated).toHaveBeenCalledTimes(1)
    })
  })

  describe("publish", () => {
    it("should publish app with dev app ID", async () => {
      await config.api.workspace.publish(workspace.appId)
      expect(events.app.published).toHaveBeenCalledTimes(1)
    })

    it("should publish app with prod app ID", async () => {
      await config.api.workspace.publish(workspace.appId.replace("_dev", ""))
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

      await config.api.workspace.filteredPublish(workspace.appId, {
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

      await config.api.workspace.filteredPublish(workspace.appId, {
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

    it("should publish table permissions for custom roles correctly", async () => {
      // Create a table for testing permissions
      const table = await config.api.table.save(basicTable())
      expect(table._id).toBeDefined()

      // Create a custom role
      const customRole = await config.api.roles.save({
        name: "TestRole",
        inherits: "PUBLIC",
        permissionId: BuiltinPermissionID.READ_ONLY,
        version: "name",
      })
      expect(customRole._id).toBeDefined()

      // Add READ permission for the custom role on the table
      await config.api.permission.add({
        roleId: customRole._id!,
        resourceId: table._id!,
        level: PermissionLevel.READ,
      })

      // Verify permissions exist in development
      const devPermissions = await config.api.permission.get(table._id!)
      expect(devPermissions.permissions.read.role).toBe(customRole.name)

      // Publish the application
      await config.publish()

      // Verify permissions are correctly published to production
      await config.withProdApp(async () => {
        const prodPermissions = await config.api.permission.get(table._id!)
        expect(prodPermissions.permissions.read.role).toBe(customRole.name)

        // Also verify the role itself exists in production
        const roles = await config.api.roles.fetch()
        const prodRole = roles.find(r => r.name === customRole.name)
        expect(prodRole).toBeDefined()
        expect(prodRole!.name).toBe("TestRole")
      })
    })
  })

  describe("manage client library version", () => {
    it("should be able to update the app client library version", async () => {
      await config.api.workspace.updateClient(workspace.appId)
      expect(events.app.versionUpdated).toHaveBeenCalledTimes(1)
    })

    it("should be able to revert the app client library version", async () => {
      await config.api.workspace.updateClient(workspace.appId)
      await config.api.workspace.revertClient(workspace.appId)
      expect(events.app.versionReverted).toHaveBeenCalledTimes(1)
    })
  })

  describe("edited at", () => {
    it("middleware should set updatedAt", async () => {
      const app = await tk.withFreeze(
        "2021-01-01",
        async () =>
          await config.api.workspace.create({ name: generateAppName() })
      )
      expect(app.updatedAt).toEqual("2021-01-01T00:00:00.000Z")

      const updatedApp = await tk.withFreeze(
        "2021-02-01",
        async () =>
          await config.withApp(app, () =>
            config.api.workspace.update(app.appId, {
              name: "UPDATED_NAME",
            })
          )
      )
      expect(updatedApp._rev).toBeDefined()
      expect(updatedApp.updatedAt).toEqual("2021-02-01T00:00:00.000Z")

      const fetchedApp = await config.api.workspace.get(app.appId)
      expect(fetchedApp.updatedAt).toEqual("2021-02-01T00:00:00.000Z")
    })
  })

  describe("sync", () => {
    it("app should sync correctly", async () => {
      const { message } = await config.api.workspace.sync(workspace.appId)
      expect(message).toEqual("App sync completed successfully.")
    })

    it("app should not sync if production", async () => {
      const { message } = await config.withProdApp(() =>
        config.api.workspace.sync(workspace.appId.replace("_dev", ""), {
          status: 400,
        })
      )

      expect(message).toEqual(
        "This action cannot be performed for production apps"
      )
    })

    it("app should not sync if sync is disabled", async () => {
      env._set("DISABLE_AUTO_PROD_APP_SYNC", true)
      const { message } = await config.api.workspace.sync(workspace.appId)
      expect(message).toEqual(
        "App sync disabled. You can reenable with the DISABLE_AUTO_PROD_APP_SYNC environment variable."
      )
      env._set("DISABLE_AUTO_PROD_APP_SYNC", false)
    })
  })

  describe("unpublish", () => {
    it("should unpublish app with dev app ID", async () => {
      await config.api.workspace.unpublish(workspace.appId)
      expect(events.app.unpublished).toHaveBeenCalledTimes(1)
    })

    it("should unpublish app with prod app ID", async () => {
      await config.withProdApp(() =>
        config.api.workspace.unpublish(workspace.appId.replace("_dev", ""))
      )
      expect(events.app.unpublished).toHaveBeenCalledTimes(1)
    })
  })

  describe("delete", () => {
    it("should delete published app and dev apps with dev app ID", async () => {
      nock("http://localhost:10000")
        .delete(`/api/global/roles/${workspace.appId}`)
        .reply(200, {})

      await config.api.workspace.delete(workspace.appId)
      expect(events.app.deleted).toHaveBeenCalledTimes(1)
      expect(events.app.unpublished).toHaveBeenCalledTimes(1)
    })

    it("should delete published app and dev app with prod app ID", async () => {
      const prodAppId = workspace.appId.replace("_dev", "")
      nock("http://localhost:10000")
        .delete(`/api/global/roles/${prodAppId}`)
        .reply(200, {})

      await config.withProdApp(() => config.api.workspace.delete(prodAppId))
      expect(events.app.deleted).toHaveBeenCalledTimes(1)
      expect(events.app.unpublished).toHaveBeenCalledTimes(1)
    })

    it("should remove MIGRATING_APP header if present during deletion", async () => {
      setEnv({ DISABLE_WORKSPACE_MIGRATIONS: false })

      const migrationsModule = await import(
        "../../../workspaceMigrations/migrations"
      )

      const migrationMock = jest.fn()
      migrationsModule.MIGRATIONS.push({
        id: "99999999999999_test_deletion",
        func: migrationMock,
      })

      nock("http://localhost:10000")
        .delete(`/api/global/roles/${workspace.appId}`)
        .reply(200, {})

      expect(migrationMock).not.toHaveBeenCalled()
      await withEnv(
        {
          SYNC_MIGRATION_CHECKS_MS: 1000,
        },
        () =>
          config.api.workspace.delete(workspace.appId, {
            headersNotPresent: [Header.MIGRATING_APP],
          })
      )

      expect(migrationMock).toHaveBeenCalledTimes(2)
      expect(events.app.deleted).toHaveBeenCalledTimes(1)

      migrationsModule.MIGRATIONS.pop()
    })
  })

  describe("POST /api/applications/:appId/duplicate", () => {
    it("should duplicate an existing app", async () => {
      const resp = await config.api.workspace.duplicateWorkspace(
        workspace.appId,
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
      expect(resp.sourceAppId).toEqual(workspace.appId)
      expect(resp.duplicateAppId).not.toEqual(workspace.appId)
    })

    it("should reject an unknown app id with a 404", async () => {
      await config.api.workspace.duplicateWorkspace(
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
      await config.api.workspace.duplicateWorkspace(
        workspace.appId,
        {
          name: workspace.name,
          url: "/known-name",
        },
        { body: { message: "App name is already in use." }, status: 400 }
      )
      expect(events.app.duplicated).not.toHaveBeenCalled()
    })

    it("should reject with a known url", async () => {
      await config.api.workspace.duplicateWorkspace(
        workspace.appId,
        {
          name: "this is fine",
          url: workspace.url,
        },
        { body: { message: "App URL is already in use." }, status: 400 }
      )
      expect(events.app.duplicated).not.toHaveBeenCalled()
    })
  })

  describe("POST /api/applications/:appId/sync", () => {
    it("should not sync automation logs", async () => {
      const automation = await config.createAutomation()
      await context.doInWorkspaceContext(workspace.appId, () =>
        config.createAutomationLog(automation)
      )

      await config.api.workspace.sync(workspace.appId)

      // does exist in prod
      const prodLogs = await config.getAutomationLogs()
      expect(prodLogs.data.length).toBe(1)

      await config.api.workspace.unpublish(workspace.appId)

      // doesn't exist in dev
      const devLogs = await config.getAutomationLogs()
      expect(devLogs.data.length).toBe(0)
    })
  })

  describe("POST /api/applications/:appId/sample", () => {
    it("should be able to add sample data", async () => {
      await config.api.workspace.addSampleData(config.getDevWorkspaceId())
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

  describe("seedProductionTables", () => {
    it("should seed empty production tables with development data when publishing", async () => {
      // Create a table in development
      const table = await config.api.table.save(basicTable())
      expect(table._id).toBeDefined()

      // Create some test rows in development
      const testRows = [{ name: "Row 1" }, { name: "Row 2" }, { name: "Row 3" }]

      for (const rowData of testRows) {
        await config.api.row.save(table._id!, rowData)
      }

      // Verify rows exist in development
      const devRows = await config.api.row.search(table._id!, { query: {} })
      expect(devRows.rows).toHaveLength(3)

      // Publish with seedProductionTables option
      await config.api.workspace.filteredPublish(config.getDevWorkspaceId(), {
        seedProductionTables: true,
      })

      // Switch to production context and verify data was seeded
      await context.doInWorkspaceContext(config.prodWorkspaceId!, async () => {
        const prodRows = await config.api.row.search(table._id!, {
          query: {},
        })
        expect(prodRows.rows).toHaveLength(3)

        // Verify the actual data was copied correctly
        const prodRowNames = prodRows.rows.map(row => row.name).sort()
        expect(prodRowNames).toEqual(["Row 1", "Row 2", "Row 3"])
      })
    })

    it("should handle seedProductionTables API option correctly", async () => {
      // Create a table in development with unique name for this test
      const table = await config.api.table.save(basicTable())
      expect(table._id).toBeDefined()

      // Create some test rows in development
      await config.api.row.save(table._id!, { name: "Dev Row 1" })
      await config.api.row.save(table._id!, { name: "Dev Row 2" })

      // Verify the API accepts seedProductionTables option without error
      const result = await config.api.workspace.filteredPublish(
        config.getDevWorkspaceId(),
        {
          seedProductionTables: true,
        }
      )

      // Check that the publish completed successfully
      expect(result).toBeDefined()

      // Verify data was published to production (since test mode publishes all data)
      await context.doInWorkspaceContext(config.prodWorkspaceId!, async () => {
        const prodRows = await config.api.row.search(table._id!, {
          query: {},
        })
        expect(prodRows.rows).toHaveLength(2)

        const prodRowNames = prodRows.rows.map(row => row.name).sort()
        expect(prodRowNames).toEqual(["Dev Row 1", "Dev Row 2"])
      })

      // Test that we can call listEmptyProductionTables without error
      const emptyTables = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => {
          return await sdk.tables.listEmptyProductionTables()
        }
      )

      // The result should be an array (even if empty in test mode due to all tables being synced)
      expect(Array.isArray(emptyTables)).toBe(true)
    })
  })
})
