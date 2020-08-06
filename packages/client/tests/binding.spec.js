import { load, makePage, makeScreen } from "./testAppDef"

describe("binding", () => {


  it("should bind to data in context", async () => {
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
          _component: "testlib/list",
          data: dataArray,
          _children: [
            {
              _component: "testlib/h1",
              text: "{{data.name}}",
            }
          ],
        }),
      ]
    )

    const rootDiv = dom.window.document.body.children[0]
    expect(rootDiv.children.length).toBe(1)

    const screenRoot = rootDiv.children[0]

    expect(screenRoot.children[0].children.length).toBe(2)
    expect(screenRoot.children[0].children[0].innerText).toBe(dataArray[0].name)
    expect(screenRoot.children[0].children[1].innerText).toBe(dataArray[1].name)
  })

  it("should bind to input in root", async () => {
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
          _children: [
            {
              _component: "testlib/h1",
              text: "{{inputid.value}}",
            },
            {
              _id: "inputid",
              _component: "testlib/input",
              value: "hello"
            }
          ],
        }),
      ]
    )

    const rootDiv = dom.window.document.body.children[0]
    expect(rootDiv.children.length).toBe(1)

    const screenRoot = rootDiv.children[0]

    expect(screenRoot.children[0].children.length).toBe(2)
    expect(screenRoot.children[0].children[0].innerText).toBe("hello")

    // change value of input
    const input = dom.window.document.getElementsByClassName("input-inputid")[0]

    changeInputValue(dom, input, "new value")
    expect(screenRoot.children[0].children[0].innerText).toBe("new value")

  })

  it("should bind to input in context", async () => {
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
          _component: "testlib/list",
          data: dataArray,
          _children: [
            {
              _component: "testlib/h1",
              text: "{{inputid.value}}",
            },
            {
              _id: "inputid",
              _component: "testlib/input",
              value: "hello"
            }
          ],
        }),
      ]
    )

    const rootDiv = dom.window.document.body.children[0]
    expect(rootDiv.children.length).toBe(1)

    const screenRoot = rootDiv.children[0]
    expect(screenRoot.children[0].children.length).toBe(4)

    const firstHeader = screenRoot.children[0].children[0]
    const firstInput = screenRoot.children[0].children[1]
    const secondHeader = screenRoot.children[0].children[2]
    const secondInput = screenRoot.children[0].children[3]
    
    expect(firstHeader.innerText).toBe("hello")
    expect(secondHeader.innerText).toBe("hello")

    changeInputValue(dom, firstInput, "first input value")
    expect(firstHeader.innerText).toBe("first input value")

    changeInputValue(dom, secondInput, "second input value")
    expect(secondHeader.innerText).toBe("second input value")

  })

  it("should bind contextual component, to input in root context", async () => {
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
          _children: [
            {
              _id: "inputid",
              _component: "testlib/input",
              value: "hello"
            },
            {
              _component: "testlib/list",
              data: dataArray,
              _children: [
                {
                  _component: "testlib/h1",
                  text: "{{parent.inputid.value}}",
                },
              ],
            }
          ]
        }),
      ]
    )

    const rootDiv = dom.window.document.body.children[0]
    expect(rootDiv.children.length).toBe(1)

    const screenRoot = rootDiv.children[0]
    expect(screenRoot.children[0].children.length).toBe(2)

    const input = screenRoot.children[0].children[0]

    const firstHeader = screenRoot.children[0].children[1].children[0]
    const secondHeader = screenRoot.children[0].children[1].children[0]
    
    expect(firstHeader.innerText).toBe("hello")
    expect(secondHeader.innerText).toBe("hello")

    changeInputValue(dom, input, "new input value")
    expect(firstHeader.innerText).toBe("new input value")
    expect(secondHeader.innerText).toBe("new input value")

  })

  const changeInputValue = (dom, input, newValue) => {
    var event = new dom.window.Event("change")
    input.value = newValue
    input.dispatchEvent(event)
  }

  const dataArray = [
    {
      name: "katherine",
      age: 30,
    },
    {
      name: "steve",
      age: 41,
    },
  ]
})
