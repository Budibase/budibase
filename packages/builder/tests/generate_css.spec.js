import {
  generate_css,
  make_margin,
  generate_screen_css,
} from "../src/builderStore/generate_css.js"

describe("make_margin", () => {
  test("it should generate a valid rule", () => {
    expect(make_margin(["1", "1", "1", "1"])).toEqual("1px 1px 1px 1px")
  })

  test("empty values should output 0", () => {
    expect(make_margin(["1", "1", "", ""])).toEqual("1px 1px 0px 0px")
    expect(make_margin(["1", "", "", "1"])).toEqual("1px 0px 0px 1px")
    expect(make_margin(["", "", "", ""])).toEqual("0px 0px 0px 0px")
  })
})

describe("generate_css", () => {
  test("it should generate a valid css rule: grid-area", () => {
    expect(generate_css({ layout: { gridarea: ["", "", "", ""] } })).toEqual({
      layout: "",
      position: "",
    })
  })

  test("it should generate a valid css rule: grid-gap", () => {
    expect(generate_css({ layout: { gap: "10" } })).toEqual({
      layout: "grid-gap: 10px;\ndisplay: grid;",
      position: "",
    })
  })

  test("it should generate a valid css rule: column 1", () => {
    expect(generate_css({ position: { column: ["", ""] } })).toEqual({
      layout: "",
      position: "",
    })
  })

  test("it should generate a valid css rule: column 2", () => {
    expect(generate_css({ position: { column: ["1", ""] } })).toEqual({
      position: "grid-column-start: 1;",
      layout: "",
    })
  })

  test("it should generate a valid css rule: column 3", () => {
    expect(generate_css({ position: { column: ["", "1"] } })).toEqual({
      position: "grid-column-end: 1;",
      layout: "",
    })
  })

  test("it should generate a valid css rule: column 4", () => {
    expect(generate_css({ position: { column: ["1", "1"] } })).toEqual({
      position: "grid-column-start: 1;\ngrid-column-end: 1;",
      layout: "",
    })
  })

  test("it should generate a valid css rule: row 1", () => {
    expect(generate_css({ position: { row: ["", ""] } })).toEqual({
      layout: "",
      position: "",
    })
  })

  test("it should generate a valid css rule: row 2", () => {
    expect(generate_css({ position: { row: ["1", ""] } })).toEqual({
      position: "grid-row-start: 1;",
      layout: "",
    })
  })

  test("it should generate a valid css rule: row 3", () => {
    expect(generate_css({ position: { row: ["", "1"] } })).toEqual({
      position: "grid-row-end: 1;",
      layout: "",
    })
  })

  test("it should generate a valid css rule: row 4", () => {
    expect(generate_css({ position: { row: ["1", "1"] } })).toEqual({
      position: "grid-row-start: 1;\ngrid-row-end: 1;",
      layout: "",
    })
  })

  test("it should generate a valid css rule: padding 1", () => {
    expect(
      generate_css({ position: { padding: ["1", "1", "1", "1"] } })
    ).toEqual({
      position: "padding: 1px 1px 1px 1px;",
      layout: "",
    })
  })

  test("it should generate a valid css rule: padding 2", () => {
    expect(generate_css({ position: { padding: ["1", "", "", "1"] } })).toEqual(
      {
        position: "padding: 1px 0px 0px 1px;",
        layout: "",
      }
    )
  })

  test("it should generate a valid css rule: margin 1", () => {
    expect(
      generate_css({ position: { margin: ["1", "1", "1", "1"] } })
    ).toEqual({
      position: "margin: 1px 1px 1px 1px;",
      layout: "",
    })
  })

  test("it should generate a valid css rule: margin 2", () => {
    expect(generate_css({ position: { margin: ["1", "", "", "1"] } })).toEqual({
      position: "margin: 1px 0px 0px 1px;",
      layout: "",
    })
  })

  test("it should generate a valid css rule: z-index 1", () => {
    expect(generate_css({ position: { zindex: "" } })).toEqual({
      position: "",
      layout: "",
    })
  })

  test("it should generate a valid css rule: z-index 2", () => {
    expect(generate_css({ position: { zindex: "1" } })).toEqual({
      position: "z-index: 1;",
      layout: "",
    })
  })
})

describe("generate_screen_css", () => {
  test("it should compile the css for a list of components", () => {
    const components = [
      {
        _styles: {
          layout: { gridarea: ["", "", "", ""] },
          position: { margin: ["1", "1", "1", "1"] },
        },
        _id: 1,
      },
      {
        _styles: {
          layout: { gridarea: ["", "", "", ""] },
          position: { margin: ["1", "1", "1", "1"] },
        },
        _id: 2,
      },
      {
        _styles: {
          layout: { gridarea: ["", "", "", ""] },
          position: { margin: ["1", "1", "1", "1"] },
        },
        _id: 3,
      },
      {
        _styles: {
          layout: { gridarea: ["", "", "", ""] },
          position: { margin: ["1", "1", "1", "1"] },
        },
        _id: 4,
      },
    ]

    const compiled = `.pos-1 {
margin: 1px 1px 1px 1px;
}
.lay-1 {

}
.pos-2 {
margin: 1px 1px 1px 1px;
}
.lay-2 {

}
.pos-3 {
margin: 1px 1px 1px 1px;
}
.lay-3 {

}
.pos-4 {
margin: 1px 1px 1px 1px;
}
.lay-4 {

}`

    expect(generate_screen_css(components)).toEqual(compiled)
  })

  test("it should compile the css for a list of components", () => {
    const components = [
      {
        _styles: {
          layout: { gridarea: ["", "", "", ""] },
          position: { margin: ["1", "1", "1", "1"] },
        },
        _id: 1,
        _children: [
          {
            _styles: {
              layout: { gridarea: ["", "", "", ""] },
              position: { margin: ["1", "1", "1", "1"] },
            },
            _id: 2,
            _children: [
              {
                _styles: {
                  layout: { gridarea: ["", "", "", ""] },
                  position: { margin: ["1", "1", "1", "1"] },
                },
                _id: 3,
                _children: [
                  {
                    _styles: {
                      layout: { gridarea: ["", "", "", ""] },
                      position: { margin: ["1", "1", "1", "1"] },
                    },
                    _id: 4,
                    _children: [
                      {
                        _styles: {
                          layout: { gridarea: ["", "", "", ""] },
                          position: { margin: ["1", "1", "1", "1"] },
                        },
                        _id: 5,
                        _children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        _styles: {
          layout: { gridarea: ["", "", "", ""] },
          position: { margin: ["1", "1", "1", "1"] },
        },
        _id: 6,
      },
      {
        _styles: {
          layout: { gridarea: ["", "", "", ""] },
          position: { margin: ["1", "1", "1", "1"] },
        },
        _id: 7,
      },
      {
        _styles: {
          layout: { gridarea: ["", "", "", ""] },
          position: { margin: ["1", "1", "1", "1"] },
        },
        _id: 8,
      },
    ]

    const compiled = `.pos-1 {
margin: 1px 1px 1px 1px;
}
.lay-1 {

}
.pos-2 {
margin: 1px 1px 1px 1px;
}
.lay-2 {

}
.pos-3 {
margin: 1px 1px 1px 1px;
}
.lay-3 {

}
.pos-4 {
margin: 1px 1px 1px 1px;
}
.lay-4 {

}
.pos-5 {
margin: 1px 1px 1px 1px;
}
.lay-5 {

}
.pos-6 {
margin: 1px 1px 1px 1px;
}
.lay-6 {

}
.pos-7 {
margin: 1px 1px 1px 1px;
}
.lay-7 {

}
.pos-8 {
margin: 1px 1px 1px 1px;
}
.lay-8 {

}`

    expect(generate_screen_css(components)).toEqual(compiled)
  })
})
