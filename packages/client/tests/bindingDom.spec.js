import { load, makePage, makeScreen } from "./testAppDef"

describe("initialiseApp (binding)", () => {
  it("should populate root element prop from store value", async () => {
    const { dom } = await load(
      makePage({
        _component: "testlib/div",
        className: {
          "##bbstate": "divClassName",
          "##bbsource": "store",
          "##bbstatefallback": "default",
        },
      })
    )

    const rootDiv = dom.window.document.body.children[0]
    expect(rootDiv.className.includes("default")).toBe(true)
  })

  it("should update root element from store", async () => {
    const { dom, app } = await load(
      makePage({
        _component: "testlib/div",
        className: {
          "##bbstate": "divClassName",
          "##bbsource": "store",
          "##bbstatefallback": "default",
        },
      })
    )

    app.pageStore().update(s => {
      s.divClassName = "newvalue"
      return s
    })

    const rootDiv = dom.window.document.body.children[0]
    expect(rootDiv.className.includes("newvalue")).toBe(true)
  })

  it("should populate child component with store value", async () => {
    const { dom } = await load(
      makePage({
        _component: "testlib/div",
        _children: [
          {
            _component: "testlib/h1",
            text: {
              "##bbstate": "headerOneText",
              "##bbsource": "store",
              "##bbstatefallback": "header one",
            },
          },
          {
            _component: "testlib/h1",
            text: {
              "##bbstate": "headerTwoText",
              "##bbsource": "store",
              "##bbstatefallback": "header two",
            },
          },
        ],
      })
    )

    const rootDiv = dom.window.document.body.children[0]

    expect(rootDiv.children.length).toBe(2)
    expect(rootDiv.children[0].tagName).toBe("H1")
    expect(rootDiv.children[0].innerText).toBe("header one")
    expect(rootDiv.children[1].tagName).toBe("H1")
    expect(rootDiv.children[1].innerText).toBe("header two")
  })

  it("should populate child component with store value", async () => {
    const { dom, app } = await load(
      makePage({
        _component: "testlib/div",
        _children: [
          {
            _component: "testlib/h1",
            text: {
              "##bbstate": "headerOneText",
              "##bbsource": "store",
              "##bbstatefallback": "header one",
            },
          },
          {
            _component: "testlib/h1",
            text: {
              "##bbstate": "headerTwoText",
              "##bbsource": "store",
              "##bbstatefallback": "header two",
            },
          },
        ],
      })
    )

    app.pageStore().update(s => {
      s.headerOneText = "header 1 - new val"
      s.headerTwoText = "header 2 - new val"
      return s
    })

    const rootDiv = dom.window.document.body.children[0]

    expect(rootDiv.children.length).toBe(2)
    expect(rootDiv.children[0].tagName).toBe("H1")
    expect(rootDiv.children[0].innerText).toBe("header 1 - new val")
    expect(rootDiv.children[1].tagName).toBe("H1")
    expect(rootDiv.children[1].innerText).toBe("header 2 - new val")
  })

  it("should populate screen child with store value", async () => {
    const { dom, app } = await load(
      makePage({
        _component: "testlib/div",
        _children: [
          {
            _component: "##builtin/screenslot",
            text: "header one",
          },
        ],
      }),
      [
        makeScreen("/", {
          _component: "testlib/div",
          className: "screen-class",
          _children: [
            {
              _component: "testlib/h1",
              text: {
                "##bbstate": "headerOneText",
                "##bbsource": "store",
                "##bbstatefallback": "header one",
              },
            },
            {
              _component: "testlib/h1",
              text: {
                "##bbstate": "headerTwoText",
                "##bbsource": "store",
                "##bbstatefallback": "header two",
              },
            },
          ],
        }),
      ]
    )

    app.screenStore().update(s => {
      s.headerOneText = "header 1 - new val"
      s.headerTwoText = "header 2 - new val"
      return s
    })

    const rootDiv = dom.window.document.body.children[0]
    expect(rootDiv.children.length).toBe(1)

    const screenRoot = rootDiv.children[0]

    expect(screenRoot.children.length).toBe(1)
    expect(screenRoot.children[0].children.length).toBe(2)
    expect(screenRoot.children[0].children[0].innerText).toBe(
      "header 1 - new val"
    )
    expect(screenRoot.children[0].children[1].innerText).toBe(
      "header 2 - new val"
    )
  })
})
