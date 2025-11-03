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
      const name = "Welcome app"
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
        { body: { message: "Workspace name is already in use." }, status: 400 }
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
        fileToImport: path.join(
          __dirname,
          "data",
          "export-change-request.tar.gz"
        ),
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
        "budibase-client.js": "e5cc573e15b6f763059fb39c7023563b",
        "chunks/Accordion-2cb8cb47.js": "6c31abff08901e08cbccddb166c45595",
        "chunks/ApexChart-39eab0fb.js": "6c3a81927d09960cd43928a7bcf47494",
        "chunks/AreaChart-a379ae5f.js": "a3d0bf7077ab88f212f27f70319d7970",
        "chunks/AttachmentField-e5117cd3.js":
          "28d5375a8aadcd4a0e2bfaddec5bd101",
        "chunks/AttachmentSingleField-1572398b.js":
          "09f744333db6e9089d5d6b4bea88682f",
        "chunks/BBReferenceField-e3676b66.js":
          "f7246829444474fddf1b8e9ed3652e02",
        "chunks/BBReferenceSingleField-fc28c308.js":
          "8cc1698452229d6963b636d59a3b90f2",
        "chunks/BackgroundImage-3795f230.js":
          "b613be4eec5d861ae39a18e81e1948d8",
        "chunks/BarChart-162a85a3.js": "e447d8bb5974487e6da1c468e17f314f",
        "chunks/BigIntField-1178528a.js": "095b3580d930300f1b481bc3f91fc0d2",
        "chunks/BooleanField-a73bf955.js": "91cf7ace226a5370744de046cc6358da",
        "chunks/Button-55cd96fd.js": "c2ac4b3fdb85e768eab38763023ea5a7",
        "chunks/ButtonGroup-dd32cbc5.js": "70f98d27c6e4a3d81c799781db11fb1b",
        "chunks/CandleStickChart-c8debfdc.js":
          "70adf3c3955f6a2a08d2f347d6a801c4",
        "chunks/Card-0f6d1d51.js": "0bf5032569513ca6d2a6cd81cda6ef27",
        "chunks/CardHorizontal-e6ec1d90.js": "0ec2cb7147611937b00985ae75d1f12d",
        "chunks/CardStat-10bc4b91.js": "289581a2f425e4bf6cf2118e51bbefa2",
        "chunks/CardsBlock-3bf33a86.js": "15c4f90da5021530d2f3bcfcd16184dd",
        "chunks/ChartBlock-9712464a.js": "e42adb87fc2d53b4c88f3831e32d437b",
        "chunks/CheckboxGroup-995bb449.js": "d234f50e0ef9fcbeb212a82cdf1b8222",
        "chunks/CodeGenerator-491374a6.js": "5ab08a313fd009d5c3ccfae4294a01d2",
        "chunks/CodeScannerField-878f0124.js":
          "880ab344a303f85d245d0188936cbaa8",
        "chunks/CollapsedButtonGroup-2dfcf354.js":
          "8a8ab48ee3e3cb65c7ada31d7f6fe2b5",
        "chunks/Container-7ddcd183.js": "d1983447bf76acd38d89fa131ae77b11",
        "chunks/DataProvider-2dab392d.js": "94ea5723bd485131e8aec71991311252",
        "chunks/DatePicker-1e1fb6b9.js": "2710176a8f77f123bc5e2a24d9d579b8",
        "chunks/DatePicker-7555af0b.js": "cfe62110215bc4e76805939032b7f0e2",
        "chunks/DateRangePicker-a1795a88.js":
          "85ef887f3f29e68f888ecc7d2b9cba48",
        "chunks/DateTimeField-f5d99d23.js": "b6489bc9d0e90f56314fcf27a4754464",
        "chunks/Divider-68332217.js": "611627e6f84349e36ecefbb108455348",
        "chunks/DonutChart-28fb127b.js": "be3e0af33c16f5c3d581af02478b7e33",
        "chunks/DynamicFilter-dbdc356f.js": "89e8e20238b69e0fbbb227caba631681",
        "chunks/Embed-dc9f82d1.js": "96d4019d86360bc3542a9d5e93422640",
        "chunks/EmbeddedMap-6e3f96cb.js": "1579f6ab323805cfde554412c2d446a7",
        "chunks/Field-026e9b04.js": "3a908b104e0034c0154ab03b44f7477b",
        "chunks/FieldGroup-f0c1e7cf.js": "d606e090ec0b738b8b6eb01d95a6098f",
        "chunks/Filter-3a9aa189.js": "7276af9ac5a0bbdeeafef42ce14fda5e",
        "chunks/Form-56b35759.js": "9e2e769ace0f80bb439dd301ff863d73",
        "chunks/FormBlock-3cd3ad17.js": "1e19c090b5823dd18c1be05dc6ab4f81",
        "chunks/FormBlockComponent-2878d220.js":
          "1a07a0d8ae66a2105aff65b32f8a530e",
        "chunks/FormStep-df7eab03.js": "a768c847b0deabaa1d77f7067bef8a03",
        "chunks/GridBlock-491c18a4.js": "90f1ef4741f7376faed56a409961cfac",
        "chunks/Heading-4b1671cd.js": "ac4638c1ae5f62309116512a8e0eab51",
        "chunks/HistogramChart-203aa0f3.js": "a9642f7caf35c1337b5e9395949fa243",
        "chunks/Icon-fd04df96.js": "ffc96f184a714cb2f2f1b5e85c660f13",
        "chunks/IconV2-ad7b0c23.js": "d07f14e49be8cbb09a3abbde6cf0a48f",
        "chunks/Image-3a087865.js": "062618e193044c72278a3151a589f012",
        "chunks/InnerForm-c723d600.js": "19928ce1f80cbd367844b913d42eec5c",
        "chunks/Item-9d93f702.js": "6fa24583053078ef61d00c78708f8c21",
        "chunks/JSONField-7e954e3d.js": "5b24c14e5538fcc9df5f18805818dda0",
        "chunks/Layout-40e3c850.js": "0e20d870ea11b7dd0dab3c261816de1c",
        "chunks/LineChart-068e963f.js": "1e6adf36b182c445443aec22eb88be96",
        "chunks/Link-4880dae1.js": "d27c1db45a61e1dd5b698b57dc739bfb",
        "chunks/LongFormField-bc02d88c.js": "68a94ff7ed3c6d0216336ae0462a1f59",
        "chunks/MarkdownViewer-7a4fbc38.js": "63317b70e8e7da3842ddd0f07ab234f4",
        "chunks/MarkdownViewer-dd1a3360.js": "ee22472560b67ae10f0f30c4ab32dddc",
        "chunks/Modal-008cf67c.js": "b29d0060369155dcd334d1b68cbba03e",
        "chunks/MultiFieldSelect-23df1bf3.js":
          "276080e77efbc46058b53339da0641fd",
        "chunks/MultiStepFormblock-01bfdb43.js":
          "431f0cfdccddb7319d5906a776d4ec6d",
        "chunks/Multiselect-7c6c2576.js": "ea398ee03e5c7a1007f1276423ff5daa",
        "chunks/Navigation-87988fa7.js": "b5c4a52e7abed3e0efcc82fc5c3aa2c3",
        "chunks/NumberField-466f5c60.js": "f5e6ff725f6eb731756f9f8db70a10ad",
        "chunks/OptionsField-b06d8158.js": "17ecda7500b7f547566e2cc465a24446",
        "chunks/PDF-02c0256e.js": "3a4cff05d9f3e8d472ee10e7ef1b0667",
        "chunks/PDFTable-dfb99b1f.js": "543210d354116900a6df607ac499d33c",
        "chunks/PasswordField-c9480ea8.js": "fb3b3624295b0fc4824d9a65555c9942",
        "chunks/PieChart-da6edd10.js": "3df5a1faf78a0a7abd282eddab1176fe",
        "chunks/Placeholder-31706623.js": "60d9ea517a314f0236b2ad695f3a7bbc",
        "chunks/RadioGroup-00f609dd.js": "23279784bec23c9ce9fcea24399647ff",
        "chunks/RatingField-ffd5a256.js": "7a4451771f5d215384b1f48feb535872",
        "chunks/RelationshipField-1b2fe5d7.js":
          "188c395de77004c4f5fb92f96b4b12a6",
        "chunks/Repeater-81cb2810.js": "954d0a4355b87ca3cb3c4f7cba42cd93",
        "chunks/RepeaterBlock-fb4c50d5.js": "41ab68b67e9ba2ab941dd38b6b2f94c7",
        "chunks/RowExplorer-33d5e611.js": "df6b48cd8f3f7788952da92e3708e0dc",
        "chunks/S3Upload-3385d6dc.js": "266f1f5d2189649681c3488c1d9605e6",
        "chunks/ScreenSlot-68962710.js": "6decb6e4e44a2a49bde5cd5f27155236",
        "chunks/Section-9872aa71.js": "f3670bfbc30ee6077e2171d52fd608d9",
        "chunks/SidePanel-cd5a291c.js": "92c3b80b1c39b46d3318ca7456a18eec",
        "chunks/SignatureField-7558b68b.js": "ff7f93e792465217d6c85a19bff6e402",
        "chunks/SingleRowProvider-63b76c66.js":
          "9032c0b573ff818cea22d24689f08f32",
        "chunks/SpectrumCard-a5a528eb.js": "31a0c889a4106db57c2817a86c8acfa4",
        "chunks/StackedList-4cc5f377.js": "a71b5816fd410a805a77a19cf42ea6ca",
        "chunks/StringField-126698b8.js": "7eb28a84da15ebffbc86b7d3a63b7f53",
        "chunks/Table-587c58c0.js": "7fde88b76de65d315ab68eb596ad41e6",
        "chunks/TableBlock-38f80d18.js": "7ea2724d05a25dfc9dca4ee52259f042",
        "chunks/Tag-878e0f24.js": "0c9b9080278e99f99988b1a867c1ba39",
        "chunks/Text-82e2f22f.js": "861dd585b7eb13d9ce95e96642c855f0",
        "chunks/Text-c9a1f90b.js": "0fafd70680293ea5b37956a009947d73",
        "chunks/TextArea-7aa2423b.js": "0b49472f219125cf3deac7ae06ad298c",
        "chunks/UserAvatar-be3a991a.js": "9531b40b5486a62146b4a40bad3a03a9",
        "chunks/___vite-browser-external_commonjs-proxy-7d128c64.js":
          "0f39b111899f167f217ce463140097d4",
        "chunks/_commonjs-dynamic-modules-58f2b0ec.js":
          "f4894f5027d4507efa95bac3f0835734",
        "chunks/apexcharts.common-4a420431.js":
          "7725a9d63f9bde736d08c554fc3138b9",
        "chunks/blocks-37916d2a.js": "d885dee62719debeca88185734e803e3",
        "chunks/easymde-4c022f51.js": "bbf6dc7af9d62fdad24ddfb56685dd0d",
        "chunks/index-445f15a6.js": "9e163d2006e7c7f9245dc849d3ac82a5",
        "chunks/index-a0738cd3.js": "b9b4e1ccd9dd74a91b632bfae8dff028",
        "chunks/optionsParser-a13cad91.js": "6dc97a247da4216a7706cfa641a8c94f",
        "chunks/phosphorIconLoader-f5abc73c.js":
          "b2ab8b782be3a65902f50a4f5bcb079b",
        "chunks/table-a8827bda.js": "83edddafbee024f0efa03eb3097931e4",
        "chunks/users-c42bb877.js": "76b0eaaf02626699bb7140acfc5cf688",
        "chunks/utc-ac6b2ab4.js": "d8ad2d7735b971be7749d7f62e81629c",
        "manifest.json": "93bcfcf77d7c3fa555642816f42214fa",
      })
    })

    it("preserves app scripts when creating from an import", async () => {
      const sourceWorkspace = await config.api.workspace.create({
        name: generateAppName(),
      })
      const scripts = [
        {
          id: "s1",
          name: "Head script",
          location: "Head" as const,
          html: "<script>window.__testHead = true</script>",
          cspWhitelist: "https://example.com",
        },
        {
          id: "s2",
          name: "Body script",
          location: "Body" as const,
          html: "<script>window.__testBody = true</script>",
        },
      ]
      await config.withApp(sourceWorkspace, async () => {
        await config.api.workspace.update(sourceWorkspace.appId, { scripts })
      })

      const exportPath = await sdk.backups.exportApp(sourceWorkspace.appId, {
        tar: true,
      })

      const newWorkspace = await config.api.workspace.createFromImport({
        name: generateAppName(),
        fileToImport: exportPath,
      })

      const workspacePackage = await config.withApp(newWorkspace, async () => {
        return await config.api.workspace.getAppPackage(newWorkspace.appId)
      })
      const importedScripts = workspacePackage.application.scripts || []
      expect(importedScripts).toHaveLength(scripts.length)

      const headScript = importedScripts.find(s => s.location === "Head")
      expect(headScript).toMatchObject({
        name: "Head script",
        location: "Head",
        html: "<script>window.__testHead = true</script>",
        cspWhitelist: "https://example.com",
      })

      const bodyScript = importedScripts.find(s => s.location === "Body")
      expect(bodyScript).toMatchObject({
        name: "Body script",
        location: "Body",
        html: "<script>window.__testBody = true</script>",
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
        { body: { message: "Workspace name is already in use." }, status: 400 }
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
