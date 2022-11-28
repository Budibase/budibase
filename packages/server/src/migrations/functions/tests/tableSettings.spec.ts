import { App, Screen, ScreenProps } from "@budibase/types"

const { db: dbCore } = require("@budibase/backend-core")
const TestConfig = require("../../../tests/utilities/TestConfiguration")
const migration = require("../tableSettings")

// Local type for allowing any child components inside screens
type MigratingScreenProps = ScreenProps & { _children: any[] }
type MigratingScreen = Screen & { props: MigratingScreenProps }

describe("run", () => {
  const config = new TestConfig(false)
  let app: App
  let screen: MigratingScreen

  beforeAll(async () => {
    await config.init()
    app = await config.createApp("testApp")
    screen = await config.createScreen()
  })

  afterAll(config.end)

  it("migrates table block row on click settings", async () => {
    // Add legacy table block as first child
    screen.props._children[0] = {
      _component: "@budibase/standard-components/tableblock",
      _id: "foo",
      linkRows: true,
      linkURL: "/rows/:id",
      linkPeek: true,
      linkColumn: "name",
    }
    await config.createScreen(screen)

    // Run migration
    screen = await dbCore.doWithDB(app.appId, async (db: any) => {
      await migration.run(db)
      return await db.get(screen._id)
    })

    // Verify new "onClick" setting
    const onClick = screen.props._children[0].onClick
    expect(onClick).toBeDefined()
    expect(onClick.length).toBe(1)
    expect(onClick[0]["##eventHandlerType"]).toBe("Navigate To")
    expect(onClick[0].parameters.url).toBe(
      `/rows/{{ [eventContext].[row].[name] }}`
    )
    expect(onClick[0].parameters.peek).toBeTruthy()
  })

  it("migrates table row on click settings", async () => {
    // Add legacy table block as first child
    screen.props._children[0] = {
      _component: "@budibase/standard-components/table",
      _id: "foo",
      linkRows: true,
      linkURL: "/rows/:id",
      linkPeek: true,
      linkColumn: "name",
    }
    await config.createScreen(screen)

    // Run migration
    screen = await dbCore.doWithDB(app.appId, async (db: any) => {
      await migration.run(db)
      return await db.get(screen._id)
    })

    // Verify new "onClick" setting
    const onClick = screen.props._children[0].onClick
    expect(onClick).toBeDefined()
    expect(onClick.length).toBe(1)
    expect(onClick[0]["##eventHandlerType"]).toBe("Navigate To")
    expect(onClick[0].parameters.url).toBe(
      `/rows/{{ [eventContext].[row].[name] }}`
    )
    expect(onClick[0].parameters.peek).toBeTruthy()
  })

  it("migrates table block title button settings", async () => {
    // Add legacy table block as first child
    screen.props._children[0] = {
      _component: "@budibase/standard-components/tableblock",
      _id: "foo",
      showTitleButton: true,
      titleButtonURL: "/url",
      titleButtonPeek: true,
    }
    await config.createScreen(screen)

    // Run migration
    screen = await dbCore.doWithDB(app.appId, async (db: any) => {
      await migration.run(db)
      return await db.get(screen._id)
    })

    // Verify new "onClickTitleButton" setting
    const onClick = screen.props._children[0].onClickTitleButton
    expect(onClick).toBeDefined()
    expect(onClick.length).toBe(1)
    expect(onClick[0]["##eventHandlerType"]).toBe("Navigate To")
    expect(onClick[0].parameters.url).toBe("/url")
    expect(onClick[0].parameters.peek).toBeTruthy()
  })

  it("ignores components that have already been migrated", async () => {
    // Add legacy table block as first child
    screen.props._children[0] = {
      _component: "@budibase/standard-components/tableblock",
      _id: "foo",
      linkRows: true,
      linkURL: "/rows/:id",
      linkPeek: true,
      linkColumn: "name",
      onClick: "foo",
    }
    const initialDefinition = JSON.stringify(screen.props._children[0])
    await config.createScreen(screen)

    // Run migration
    screen = await dbCore.doWithDB(app.appId, async (db: any) => {
      await migration.run(db)
      return await db.get(screen._id)
    })

    // Verify new "onClick" setting
    const newDefinition = JSON.stringify(screen.props._children[0])
    expect(initialDefinition).toEqual(newDefinition)
  })
})
