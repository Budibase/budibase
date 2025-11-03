import path from "path"
import { getAppObjectStorageEtags } from "../../../tests/utilities/objectStore"
import * as setup from "./utilities"

const PASSWORD = "testtest"

describe("/applications/:appId/import", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  it("should be able to perform an old import", async () => {
    const appId = config.getDevWorkspaceId()
    await request
      .post(`/api/applications/${appId}/import`)
      .field("encryptionPassword", PASSWORD)
      .attach(
        "appExport",
        path.join(__dirname, "data", "old-export.enc.tar.gz")
      )
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    const appPackage = await config.api.workspace.get(appId!)
    expect(appPackage.navigation?.links?.length).toBe(2)
    expect(appPackage.navigation?.links?.[0].url).toBe("/blank")
    expect(appPackage.navigation?.links?.[1].url).toBe("/derp")

    const screens = await config.api.screen.list()
    expect(screens.length).toBe(2)
    expect(screens[0].routing.route).toBe("/derp")
    expect(screens[1].routing.route).toBe("/blank")

    const { workspaceApps: apps } = await config.api.workspaceApp.fetch()
    expect(apps.length).toBe(1)
    expect(apps[0].name).toBe(config.getDevWorkspace().name)

    const fileEtags = await getAppObjectStorageEtags(appId)
    expect(fileEtags).toEqual({
      // These etags match the ones from the export file
      "budibase-client.js": "a0ab956601262aae131122b3f65102da-2",
      "manifest.json": "8eecdd3935062de5298d8d115453e124",
    })
  })

  it("should be able to perform a new import", async () => {
    const appId = config.getDevWorkspaceId()
    await request
      .post(`/api/applications/${appId}/import`)
      .attach(
        "appExport",
        path.join(__dirname, "data", "export-change-request.tar.gz")
      )
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    const appPackage = await config.api.workspace.get(appId!)
    expect(appPackage.navigation?.links?.length).toBe(3)
    expect(appPackage.navigation?.links?.[0].url).toBe("/my-change-requests")
    expect(appPackage.navigation?.links?.[1].url).toBe(
      "/review-change-requests"
    )
    expect(appPackage.navigation?.links?.[2].url).toBe("/administration")

    const screens = await config.api.screen.list()
    expect(screens.length).toBe(6)
    expect(screens[0].routing.route).toBe("/my-change-requests")
    expect(screens[1].routing.route).toBe("/administration")
    expect(screens[2].routing.route).toBe("/review-change-requests")
    expect(screens[3].routing.route).toBe("/my-change-requests/edit/:id")
    expect(screens[4].routing.route).toBe("/administration/:id")
    expect(screens[5].routing.route).toBe("/change-request/new")

    const { workspaceApps: apps } = await config.api.workspaceApp.fetch()
    expect(apps.length).toBe(1)
    expect(apps[0].name).toBe("Change request management")

    const fileEtags = await getAppObjectStorageEtags(appId)
    expect(fileEtags).toEqual({
      "budibase-client.js": "e5cc573e15b6f763059fb39c7023563b",
      "chunks/Accordion-2cb8cb47.js": "6c31abff08901e08cbccddb166c45595",
      "chunks/ApexChart-39eab0fb.js": "6c3a81927d09960cd43928a7bcf47494",
      "chunks/AreaChart-a379ae5f.js": "a3d0bf7077ab88f212f27f70319d7970",
      "chunks/AttachmentField-e5117cd3.js": "28d5375a8aadcd4a0e2bfaddec5bd101",
      "chunks/AttachmentSingleField-1572398b.js":
        "09f744333db6e9089d5d6b4bea88682f",
      "chunks/BBReferenceField-e3676b66.js": "f7246829444474fddf1b8e9ed3652e02",
      "chunks/BBReferenceSingleField-fc28c308.js":
        "8cc1698452229d6963b636d59a3b90f2",
      "chunks/BackgroundImage-3795f230.js": "b613be4eec5d861ae39a18e81e1948d8",
      "chunks/BarChart-162a85a3.js": "e447d8bb5974487e6da1c468e17f314f",
      "chunks/BigIntField-1178528a.js": "095b3580d930300f1b481bc3f91fc0d2",
      "chunks/BooleanField-a73bf955.js": "91cf7ace226a5370744de046cc6358da",
      "chunks/Button-55cd96fd.js": "c2ac4b3fdb85e768eab38763023ea5a7",
      "chunks/ButtonGroup-dd32cbc5.js": "70f98d27c6e4a3d81c799781db11fb1b",
      "chunks/CandleStickChart-c8debfdc.js": "70adf3c3955f6a2a08d2f347d6a801c4",
      "chunks/Card-0f6d1d51.js": "0bf5032569513ca6d2a6cd81cda6ef27",
      "chunks/CardHorizontal-e6ec1d90.js": "0ec2cb7147611937b00985ae75d1f12d",
      "chunks/CardStat-10bc4b91.js": "289581a2f425e4bf6cf2118e51bbefa2",
      "chunks/CardsBlock-3bf33a86.js": "15c4f90da5021530d2f3bcfcd16184dd",
      "chunks/ChartBlock-9712464a.js": "e42adb87fc2d53b4c88f3831e32d437b",
      "chunks/CheckboxGroup-995bb449.js": "d234f50e0ef9fcbeb212a82cdf1b8222",
      "chunks/CodeGenerator-491374a6.js": "5ab08a313fd009d5c3ccfae4294a01d2",
      "chunks/CodeScannerField-878f0124.js": "880ab344a303f85d245d0188936cbaa8",
      "chunks/CollapsedButtonGroup-2dfcf354.js":
        "8a8ab48ee3e3cb65c7ada31d7f6fe2b5",
      "chunks/Container-7ddcd183.js": "d1983447bf76acd38d89fa131ae77b11",
      "chunks/DataProvider-2dab392d.js": "94ea5723bd485131e8aec71991311252",
      "chunks/DatePicker-1e1fb6b9.js": "2710176a8f77f123bc5e2a24d9d579b8",
      "chunks/DatePicker-7555af0b.js": "cfe62110215bc4e76805939032b7f0e2",
      "chunks/DateRangePicker-a1795a88.js": "85ef887f3f29e68f888ecc7d2b9cba48",
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
      "chunks/MultiFieldSelect-23df1bf3.js": "276080e77efbc46058b53339da0641fd",
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
})
