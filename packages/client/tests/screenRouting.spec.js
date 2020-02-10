import { load, makePage, makeScreen, walkComponentTree } from "./testAppDef"
import { isScreenSlot } from "../src/render/builtinComponents"

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

  it("should destroy and unsubscribe all components on a screen whe screen is changed", async () => {
    const { page, screens } = pageWith3Screens()
    const { app } = await load(page, screens, "/screen2")

    const nodes = createTrackerNodes(app)

    app.routeTo()("/screen3")

    expect(nodes.length > 0).toBe(true)
    expect(
      nodes.some(n => n.isDestroyed === false && isUnderScreenSlot(n.node))
    ).toBe(false)
    expect(
      nodes.some(n => n.isUnsubscribed === false && isUnderScreenSlot(n.node))
    ).toBe(false)
  })

  it("should not destroy and unsubscribe page and screenslot components when screen is changed", async () => {
    const { page, screens } = pageWith3Screens()
    const { app } = await load(page, screens, "/screen2")

    const nodes = createTrackerNodes(app)

    app.routeTo()("/screen3")

    expect(nodes.length > 0).toBe(true)
    expect(
      nodes.some(n => n.isDestroyed === true && !isUnderScreenSlot(n.node))
    ).toBe(false)
  })
})

const createTrackerNodes = app => {
  const nodes = []
  walkComponentTree(app.rootNode(), n => {
    if (!n.component) return
    const tracker = { node: n, isDestroyed: false, isUnsubscribed: false }
    const _destroy = n.component.$destroy
    n.component.$destroy = () => {
      _destroy()
      tracker.isDestroyed = true
    }
    const _unsubscribe = n.unsubscribe
    if (!_unsubscribe) {
      tracker.isUnsubscribed = undefined
    } else {
      n.unsubscribe = () => {
        _unsubscribe()
        tracker.isUnsubscribed = true
      }
    }
    nodes.push(tracker)
  })
  return nodes
}

const isUnderScreenSlot = node =>
  node.parentNode &&
  (isScreenSlot(node.parentNode.props._component) ||
    isUnderScreenSlot(node.parentNode))

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
