const testAppDef = require("../appPackages/testApp/appDefinition.json")
const testAccessLevels = require("../appPackages/testApp/access_levels.json")
const mainPage = require("../appPackages/testApp/pages/main/page.json")
const unauthenticatedPage = require("../appPackages/testApp/pages/unauthenticated/page.json")
const testComponents = require("../appPackages/testApp/customComponents/components.json")
const testMoreComponents = require("../appPackages/testApp/moreCustomComponents/components.json")
const statusCodes = require("../utilities/statusCodes")
const screen1 = require("../appPackages/testApp/pages/main/screens/screen1.json")
const screen2 = require("../appPackages/testApp/pages/main/screens/screen2.json")
const { readJSON, pathExists, unlink, readFile } = require("fs-extra")
const { getHashedCssPaths } = require("../utilities/builder/convertCssToFiles")
const listScreens = require("../utilities/builder/listScreens")
const { getApisWithFullAccess } = require("../utilities/budibaseApi")

const app = require("./testApp")()
testComponents.textbox.name = `./customComponents/textbox`
testMoreComponents.textbox.name = `./moreCustomComponents/textbox`

let _master
const getmaster = async () => {
  if (!_master)
    _master = await getApisWithFullAccess({}, app.masterAppPackage)
  return _master
}

beforeAll(async () => {
  const testScreen = "./appPackages/testApp/pages/main/screens/newscreen.json"
  const testScreenAfterMove =
    "./appPackages/testApp/pages/main/screens/anotherscreen.json"

  if (await pathExists(testScreen)) await unlink(testScreen)
  if (await pathExists(testScreenAfterMove)) await unlink(testScreenAfterMove)

  await app.start()

  const response = await app
      .post(`/_master/api/authenticate`, {
        username: app.credentials.masterOwner.username,
        password: app.credentials.masterOwner.password,
      })
      .expect(statusCodes.OK)

  app.credentials.masterOwner.cookie = response.header["set-cookie"]

  const master = await getmaster()
  const newApp = master.recordApi.getNew("/applications", "application")
  newApp.name = "testApp"
  await app
    .post(`/_master/api/record/${newApp.key}`, newApp)
    .set("cookie", app.credentials.masterOwner.cookie)
    .expect(statusCodes.OK)
})

afterAll(async () => await app.destroy())

it("/apppackage should get appDefinition", async () => {
  const { body } = await app
    .get("/_builder/api/testApp/appPackage")
    .expect(statusCodes.OK)

  expect(body.appDefinition).toEqual(testAppDef)
})

it("/apppackage should get access levels", async () => {
  const { body } = await app
    .get("/_builder/api/testApp/appPackage")
    .expect(statusCodes.OK)

  expect(body.accessLevels).toEqual(testAccessLevels)
})

it("/apppackage should get pages", async () => {
  const { body } = await app
    .get("/_builder/api/testApp/appPackage")
    .expect(statusCodes.OK)
  expect(body.pages).toEqual({
    main: { ...mainPage, name: "main" },
    unauthenticated: { ...unauthenticatedPage, name: "unauthenticated" },
  })
})

it("/apppackage should get components", async () => {
  const { body } = await app
    .get("/_builder/api/testApp/appPackage")
    .expect(statusCodes.OK)

  expect(body.components.components["./customComponents/textbox"]).toBeDefined()
  expect(
    body.components.components["./moreCustomComponents/textbox"]
  ).toBeDefined()

  expect(body.components.components["./customComponents/textbox"]).toEqual(
    testComponents.textbox
  )

  expect(body.components.components["./moreCustomComponents/textbox"]).toEqual(
    testMoreComponents.textbox
  )
})

it("/pages/:pageName/screens should get screens", async () => {
  const { body } = await app
    .get("/_builder/api/testApp/pages/main/screens")
    .expect(statusCodes.OK)

  const expectedComponents = {
    screen1: { ...screen1, name: "screen1" },
    screen2: { ...screen2, name: "screen2" },
  }

  expect(body).toEqual(expectedComponents)
})

it("should be able to create new screen", async () => {
  const newscreen = {
    name: "newscreen",
    props: {
      _component: "@budibase/standard-component/div",
      className: "something",
    },
  }

  await app
    .post("/_builder/api/testApp/pages/main/screen", newscreen)
    .expect(statusCodes.OK)

  const screenFile = "./appPackages/testApp/pages/main/screens/newscreen.json"
  expect(await pathExists(screenFile)).toBe(true)
  expect(await readJSON(screenFile)).toEqual(newscreen)
})

it("should be able to update screen", async () => {
  const updatedscreen = {
    name: "newscreen",
    props: {
      _component: "@budibase/standard-component/div",
      className: "something else",
    },
  }

  await app
    .post("/_builder/api/testApp/pages/main/screen", updatedscreen)
    .expect(statusCodes.OK)

  const screenFile = "./appPackages/testApp/pages/main/screens/newscreen.json"
  expect(await readJSON(screenFile)).toEqual(updatedscreen)
})

it("should be able to rename screen", async () => {
  await app
    .patch("/_builder/api/testApp/pages/main/screen", {
      oldname: "newscreen",
      newname: "anotherscreen",
    })
    .expect(statusCodes.OK)

  const oldcomponentFile =
    "./appPackages/testApp/pages/main/screens/newscreen.json"
  const newcomponentFile =
    "./appPackages/testApp/pages/main/screens/anotherscreen.json"

  expect(await pathExists(oldcomponentFile)).toBe(false)
  expect(await pathExists(newcomponentFile)).toBe(true)
})

it("should be able to delete screen", async () => {
  await app
    .delete("/_builder/api/testApp/pages/main/screen/anotherscreen")
    .expect(statusCodes.OK)

  const componentFile =
    "./appPackages/testApp/pages/main/screens/anotherscreen.json"
  expect(await pathExists(componentFile)).toBe(false)
})

it("/savePage should prepare all necessary client files", async () => {
  const mainCss = "/*main page css*/"
  mainPage._css = mainCss
  const screen1Css = "/*screen1 css*/"
  screen1._css = screen1Css
  const screen2Css = "/*screen2 css*/"
  screen2._css = screen2Css

  await app
    .post("/_builder/api/testApp/pages/main", {
      appDefinition: testAppDef,
      accessLevels: testAccessLevels,
      page: mainPage,
      uiFunctions: "{'1234':() => 'test return'}",
      screens: [screen1, screen2],
    })
    .expect(statusCodes.OK)

  const publicFolderMain = relative =>
    "./appPackages/testApp/public/main" + relative

  const cssDir = publicFolderMain("/css")

  expect(await pathExists(publicFolderMain("/index.html"))).toBe(true)

  expect(
    await pathExists(publicFolderMain("/lib/customComponents/index.js"))
  ).toBe(true)

  expect(
    await pathExists(publicFolderMain("/lib/moreCustomComponents/index.js"))
  ).toBe(true)

  expect(
    await pathExists(
      publicFolderMain(
        "/lib/node_modules/@budibase/standard-components/dist/index.js"
      )
    )
  ).toBe(true)

  const indexHtmlMain = await readFile(publicFolderMain("/index.html"), "utf8")

  const pageCssPaths = getHashedCssPaths(cssDir, mainCss)
  const screen1CssPaths = getHashedCssPaths(cssDir, screen1Css)
  const screen2CssPaths = getHashedCssPaths(cssDir, screen2Css)

  expect(await pathExists(publicFolderMain(pageCssPaths.url))).toBe(true)
  const savedPageCss = await readFile(
    publicFolderMain(pageCssPaths.url),
    "utf8"
  )
  expect(savedPageCss).toEqual(mainCss)
  expect(indexHtmlMain.includes(pageCssPaths.url)).toBe(true)

  expect(await pathExists(publicFolderMain(screen1CssPaths.url))).toBe(true)
  const savedScreen1Css = await readFile(
    publicFolderMain(screen1CssPaths.url),
    "utf8"
  )
  expect(savedScreen1Css).toEqual(screen1Css)
  expect(indexHtmlMain.includes(screen1CssPaths.url)).toBe(true)

  expect(await pathExists(publicFolderMain(screen2CssPaths.url))).toBe(true)
  const savedScreen2Css = await readFile(
    publicFolderMain(screen2CssPaths.url),
    "utf8"
  )
  expect(savedScreen2Css).toEqual(screen2Css)
  expect(indexHtmlMain.includes(screen2CssPaths.url)).toBe(true)
})
