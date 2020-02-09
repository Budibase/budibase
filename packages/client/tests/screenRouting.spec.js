import { load, makePage, makeScreen } from "./testAppDef"

describe("screenRouting", () => {
  it("should load correct screen, for initial URL", async () => {
    const { page, screens } = pageWith3Screens()
    const { dom } = await load(page, screens, "/screen2")

    const rootDiv = dom.window.document.body.children[0]
    expect(rootDiv.children.length).toBe(1)

    const screenRoot = rootDiv.children[0]

    expect(screenRoot.children.length).toBe(1)
    expect(screenRoot.children[0].children.length).toBe(1)
    expect(screenRoot.children[0].children[0].innerText).toBe("screen 2")
  })

  it("should be able to route to the correct screen", async () => {
    const { page, screens } = pageWith3Screens()
    const { dom, app } = await load(page, screens, "/screen2")

    app.routeTo()("/screen3")
    const rootDiv = dom.window.document.body.children[0]
    expect(rootDiv.children.length).toBe(1)

    const screenRoot = rootDiv.children[0]

    expect(screenRoot.children.length).toBe(1)
    expect(screenRoot.children[0].children.length).toBe(1)
    expect(screenRoot.children[0].children[0].innerText).toBe("screen 3")
  })
})

const pageWith3Screens = () => ({
  page: makePage({
    _component: "testlib/div",
    _children: [
      {
        _component: "##builtin/screenslot",
        text: "header one",
      },
    ],
  }),
  screens: [
    makeScreen("/", {
      _component: "testlib/div",
      className: "screen-class",
      _children: [
        {
          _component: "testlib/h1",
          text: "screen 1",
        },
      ],
    }),
    makeScreen("/screen2", {
      _component: "testlib/div",
      className: "screen-class",
      _children: [
        {
          _component: "testlib/h1",
          text: "screen 2",
        },
      ],
    }),
    makeScreen("/screen3", {
      _component: "testlib/div",
      className: "screen-class",
      _children: [
        {
          _component: "testlib/h1",
          text: "screen 3",
        },
      ],
    }),
  ],
})
