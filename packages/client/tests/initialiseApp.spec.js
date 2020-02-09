import { load, makePage, makeScreen } from "./testAppDef"

describe("initialiseApp", () => {
  it("should populate simple div with initial props", async () => {
    const { dom } = await load(
      makePage({
        _component: "testlib/div",
        className: "my-test-class",
      })
    )

    expect(dom.window.document.body.children.length).toBe(1)
    const child = dom.window.document.body.children[0]
    expect(child.className.includes("my-test-class")).toBeTruthy()
  })

  it("should populate child component with props", async () => {
    const { dom } = await load(
      makePage({
        _component: "testlib/div",
        _children: [
          {
            _component: "testlib/h1",
            text: "header one",
          },
          {
            _component: "testlib/h1",
            text: "header two",
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

  it("should append children when told to do so", async () => {
    const { dom } = await load(
      makePage({
        _component: "testlib/div",
        _children: [
          {
            _component: "testlib/h1",
            text: "header one",
          },
          {
            _component: "testlib/h1",
            text: "header two",
          },
        ],
        append: true,
      })
    )

    const rootDiv = dom.window.document.body.children[0]

    expect(rootDiv.children.length).toBe(3)
    expect(rootDiv.children[0].tagName).toBe("DIV")
    expect(rootDiv.children[0].className).toBe("default-child")
    expect(rootDiv.children[1].tagName).toBe("H1")
    expect(rootDiv.children[1].innerText).toBe("header one")
    expect(rootDiv.children[2].tagName).toBe("H1")
    expect(rootDiv.children[2].innerText).toBe("header two")
  })

  it("should populate page with correct screen", async () => {
    const { dom } = await load(
      makePage({
        _component: "testlib/div",
        _children: [
          {
            _component: "##builtin/screenslot",
          },
        ],
      }),
      [
        makeScreen("/", {
          _component: "testlib/div",
          className: "screen-class",
        }),
      ]
    )

    const rootDiv = dom.window.document.body.children[0]

    expect(rootDiv.children.length).toBe(1)
    expect(rootDiv.children[0].children.length).toBe(1)
    expect(
      rootDiv.children[0].children[0].className.includes("screen-class")
    ).toBeTruthy()
  })

  it("should populate screen with children", async () => {
    const { dom } = await load(
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
              text: "header one",
            },
            {
              _component: "testlib/h1",
              text: "header two",
            },
          ],
        }),
      ]
    )

    const rootDiv = dom.window.document.body.children[0]
    expect(rootDiv.children.length).toBe(1)

    const screenRoot = rootDiv.children[0]

    console.log(screenRoot.children)
    expect(screenRoot.children.length).toBe(1)
    expect(screenRoot.children[0].children.length).toBe(2)
    expect(screenRoot.children[0].children[0].innerText).toBe("header one")
    expect(screenRoot.children[0].children[1].innerText).toBe("header two")
  })
})
