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
      .attach("appExport", path.join(__dirname, "data", "export.tar.gz"))
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
      "budibase-client.esm.js": "f6848d844994c1e220c94498ddbc6b38",
      "budibase-client.js": "d94c9df976f805497f6f44fd5fc568d4-2",
      "chunks/Accordion-9cca26a0.js": "ec9512fced7ea993f9719e65cd2e6e38",
      "chunks/ApexChart-5b4a3d9d.js": "b1ea9b71c2fb4d523b2d415232da6c8a",
      "chunks/AreaChart-44e19b77.js": "47f20c21b4af6be12e087de22df8cc7e",
      "chunks/AttachmentField-a12e4946.js": "e2764138f4949f3ac1c72358ed5fc60a",
      "chunks/AttachmentSingleField-7e764dbf.js":
        "2b1e12daaf6b9b0bd2cde08ae234f950",
      "chunks/BBReferenceField-cfc17956.js": "5047590aa421bfd2ff69043466d36f42",
      "chunks/BBReferenceSingleField-83e64059.js":
        "26dbdeb210644f56a99964be538319d7",
      "chunks/BackgroundImage-4982e45e.js": "e7c4b9f593bf421e00e4567367cf358a",
      "chunks/BarChart-0428f963.js": "4e6365f28289faf5b6e1c23dd0fe8e66",
      "chunks/BigIntField-ed133a4a.js": "552f3624c8a50ec3ffa2cc0621042b91",
      "chunks/BooleanField-1499476d.js": "7fe6688751d936d147341e5a931757bf",
      "chunks/Button-c7fa1868.js": "ef83c3bdde5f10b856f76070e4259728",
      "chunks/ButtonGroup-a310c488.js": "52acb925551f183bb4d6a9e31e72af6a",
      "chunks/CandleStickChart-a4a9d143.js": "4d253b2ab71b3933fcc9d5ac8a43fc30",
      "chunks/Card-89291907.js": "cd522aee24ec242cf68851d4637f6b40",
      "chunks/CardHorizontal-4856557b.js": "14a72bd2aee0aa7b4cb40280421c5477",
      "chunks/CardStat-dba219c4.js": "ac1f52d6ae1ecc25914ccc07d96bd080",
      "chunks/CardsBlock-19962fe4.js": "4e5a0a5dc704b3f64564d4f30915da9c",
      "chunks/ChartBlock-d8c111b4.js": "4291b235134b7ce512eedb08fdbd817d",
      "chunks/CheckboxGroup-9d863d31.js": "853f5c207e9b2c5e57aff3b4dfae203d",
      "chunks/CodeGenerator-b39a8f85.js": "99ab2bdd04bf900a473468e1996380de",
      "chunks/CodeScannerField-6386017e.js": "06e45b5cc8bae122dc7d963adf188ab0",
      "chunks/CollapsedButtonGroup-d8de26c5.js":
        "78feb06de3124f84c09769f38ac14c0d",
      "chunks/Container-4931ed81.js": "2a5a53e8c2b97afcf9f6e12b3740a874",
      "chunks/DataProvider-c2eb491f.js": "4b4829e2812f326554937c3841f475bc",
      "chunks/DatePicker-068351bc.js": "c60d541deebf2ba00d3848b27c33057c",
      "chunks/DatePicker-35c5ed8a.js": "1d04b2463e899f90f1db1cecd7c0babe",
      "chunks/DateRangePicker-ee5c28e9.js": "1f49bab1613493166cfb4fcfdae2d90a",
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
      "chunks/MultiFieldSelect-f504cbce.js": "4afe468194e7f128797f6094566a57b8",
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
