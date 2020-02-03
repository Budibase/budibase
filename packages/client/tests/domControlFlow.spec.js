import { load } from "./testAppDef"

describe("controlFlow", () => {
  it("should display simple div, with always true render function", async () => {
    const { dom } = await load({
      _component: "testlib/div",
      className: "my-test-class",
      _id: "always_render",
    })

    expect(dom.window.document.body.children.length).toBe(1)
    const child = dom.window.document.body.children[0]
    expect(child.className).toBe("my-test-class")
  })

  it("should not display div, with always false render function", async () => {
    const { dom } = await load({
      _component: "testlib/div",
      className: "my-test-class",
      _id: "never_render",
    })

    expect(dom.window.document.body.children.length).toBe(0)
  })

  it("should display 3 divs in a looped render function", async () => {
    const { dom } = await load({
      _component: "testlib/div",
      className: "my-test-class",
      _id: "three_clones",
    })

    expect(dom.window.document.body.children.length).toBe(3)

    const child0 = dom.window.document.body.children[0]
    expect(child0.className).toBe("my-test-class")

    const child1 = dom.window.document.body.children[1]
    expect(child1.className).toBe("my-test-class")

    const child2 = dom.window.document.body.children[2]
    expect(child2.className).toBe("my-test-class")
  })

  it("should display 3 div, in a looped render, as children", async () => {
    const { dom } = await load({
      _component: "testlib/div",
      _children: [
        {
          _component: "testlib/div",
          className: "my-test-class",
          _id: "three_clones",
        },
      ],
    })

    expect(dom.window.document.body.children.length).toBe(1)

    const rootDiv = dom.window.document.body.children[0]
    expect(rootDiv.children.length).toBe(3)

    expect(rootDiv.children[0].className).toBe("my-test-class")
    expect(rootDiv.children[1].className).toBe("my-test-class")
    expect(rootDiv.children[2].className).toBe("my-test-class")
  })
})
