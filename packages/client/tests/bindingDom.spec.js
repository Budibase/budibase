import { load, makePage, makeScreen } from "./testAppDef"
import { EVENT_TYPE_MEMBER_NAME } from "../src/state/eventHandlers"

describe("initialiseApp (binding)", () => {
  it("should populate root element prop from store value", async () => {
    const { dom } = await load(
      makePage({
        _component: "testlib/div",
        className: {
          "##bbstate": "divClassName",
          "##bbsource": "state",
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
          "##bbsource": "state",
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

  it("should update root element from store, using binding expression", async () => {
    const { dom, app } = await load(
      makePage({
        _component: "testlib/div",
        className: "state.divClassName",
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
              "##bbsource": "state",
              "##bbstatefallback": "header one",
            },
          },
          {
            _component: "testlib/h1",
            text: {
              "##bbstate": "headerTwoText",
              "##bbsource": "state",
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
              "##bbsource": "state",
              "##bbstatefallback": "header one",
            },
          },
          {
            _component: "testlib/h1",
            text: {
              "##bbstate": "headerTwoText",
              "##bbsource": "state",
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
                "##bbsource": "state",
                "##bbstatefallback": "header one",
              },
            },
            {
              _component: "testlib/h1",
              text: {
                "##bbstate": "headerTwoText",
                "##bbsource": "state",
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

  it("should fire events", async () => {
    const { dom, app } = await load(
      makePage({
        _component: "testlib/button",
        onClick: [
          event("Set State", {
            path: "address",
            value: "123 Main Street",
          }),
        ],
      })
    )

    const button = dom.window.document.body.children[0]
    expect(button.tagName).toBe("BUTTON")

    let storeAddress
    app.pageStore().subscribe(s => {
      storeAddress = s.address
    })
    button.dispatchEvent(new dom.window.Event("click"))
    expect(storeAddress).toBe("123 Main Street")
  })

  it("should alter event parameters based on store values", async () => {
    const { dom, app } = await load(
      makePage({
        _component: "testlib/button",
        onClick: [
          event("Set State", {
            path: "address",
            value: {
              "##bbstate": "sourceaddress",
              "##bbsource": "state",
              "##bbstatefallback": "fallback address",
            },
          }),
        ],
      })
    )

    const button = dom.window.document.body.children[0]
    expect(button.tagName).toBe("BUTTON")

    let storeAddress
    app.pageStore().subscribe(s => {
      storeAddress = s.address
    })

    button.dispatchEvent(new dom.window.Event("click"))
    expect(storeAddress).toBe("fallback address")

    app.pageStore().update(s => {
      s.sourceaddress = "new address"
      return s
    })

    button.dispatchEvent(new dom.window.Event("click"))
    expect(storeAddress).toBe("new address")
  })

  it("should take event parameters from context values", async () => {
    const { dom, app } = await load(
      makePage({
        _component: "testlib/button",
        _id: "with_context",
        onClick: [
          event("Set State", {
            path: "address",
            value: {
              "##bbstate": "testKey",
              "##bbsource": "context",
              "##bbstatefallback": "fallback address",
            },
          }),
        ],
      })
    )

    const button = dom.window.document.body.children[0]
    expect(button.tagName).toBe("BUTTON")

    let storeAddress
    app.pageStore().subscribe(s => {
      storeAddress = s.address
    })

    button.dispatchEvent(new dom.window.Event("click"))
    expect(storeAddress).toBe("test value")
  })
})

it("should rerender components when their code is bound to the store ", async () => {
  const { dom, app } = await load(
    makePage({
      _component: "testlib/div",
      _children: [
        {
          _component: "testlib/div",
          _id: "n_clones_based_on_store",
          className: "child_div",
        },
      ],
    })
  )

  const rootDiv = dom.window.document.body.children[0]
  expect(rootDiv.tagName).toBe("DIV")
  expect(rootDiv.children.length).toBe(0)

  app.pageStore().update(s => {
    s.componentCount = 3
    return s
  })

  expect(rootDiv.children.length).toBe(3)
  expect(rootDiv.children[0].className.includes("child_div")).toBe(true)

  app.pageStore().update(s => {
    s.componentCount = 5
    return s
  })

  expect(rootDiv.children.length).toBe(5)
  expect(rootDiv.children[0].className.includes("child_div")).toBe(true)

  app.pageStore().update(s => {
    s.componentCount = 0
    return s
  })

  expect(rootDiv.children.length).toBe(0)
})

it("should be able to read value from context, passed fromm parent, through code", async () => {
  const { dom, app } = await load(
    makePage({
      _component: "testlib/div",
      _children: [
        {
          _component: "testlib/div",
          _id: "n_clones_based_on_store",
          className: {
            "##bbstate": "index",
            "##bbsource": "context",
            "##bbstatefallback": "nothing",
          },
        },
      ],
    })
  )

  const rootDiv = dom.window.document.body.children[0]
  expect(rootDiv.tagName).toBe("DIV")
  expect(rootDiv.children.length).toBe(0)

  app.pageStore().update(s => {
    s.componentCount = 3
    return s
  })

  expect(rootDiv.children.length).toBe(3)
  expect(rootDiv.children[0].className.includes("index_0")).toBe(true)
  expect(rootDiv.children[1].className.includes("index_1")).toBe(true)
  expect(rootDiv.children[2].className.includes("index_2")).toBe(true)
})

const event = (handlerType, parameters) => {
  const e = {}
  e[EVENT_TYPE_MEMBER_NAME] = handlerType
  e.parameters = parameters
  return e
}
