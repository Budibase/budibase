import {
  generate_css,
  generate_screen_css,
  generate_array_styles
} from "../src/builderStore/generate_css.js"

describe("generate_css", () => {

  test("Check how partially empty arrays are handled", () => {
    expect(["", "5", "", ""].map(generate_array_styles)).toEqual(["0px", "5px", "0px", "0px"])
  })

  test("Check how array styles are output", () => {
    expect(generate_css({ margin: ["0", "10", "0", "15"] })).toBe("margin: 0px 10px 0px 15px;")
  })

  test("Check handling of an array with empty string values", () => {
    expect(generate_css({ padding: ["", "", "", ""] })).toBe("")
  })

  test("Check handling of an empty array", () => {
    expect(generate_css({ margin: [] })).toBe("")
  })

  test("Check handling of valid font property", () => {
    expect(generate_css({ "font-size": "10px" })).toBe("font-size: 10px;")
  })
})


describe("generate_screen_css", () => {
  const normalComponent = { _id: "123-456", _component: "@standard-components/header", _children: [], _styles: { normal: { "font-size": "16px" }, hover: {}, active: {}, selected: {} } }
    
  test("Test generation of normal css styles", () => {
    expect(generate_screen_css([normalComponent])).toBe(".header-123-456 {\nfont-size: 16px;\n}")
  })

  const hoverComponent = { _id: "123-456", _component: "@standard-components/header", _children: [], _styles: { normal: {}, hover: {"font-size": "16px"}, active: {}, selected: {} } }

  test("Test generation of hover css styles", () => {
    expect(generate_screen_css([hoverComponent])).toBe(".header-123-456:hover {\nfont-size: 16px;\n}")
  })

  const selectedComponent = { _id: "123-456", _component: "@standard-components/header", _children: [], _styles: { normal: {}, hover: {}, active: {}, selected: { "font-size": "16px" } } }
  
  test("Test generation of selection css styles", () => {
    expect(generate_screen_css([selectedComponent])).toBe(".header-123-456::selection {\nfont-size: 16px;\n}")
  }) 

  const emptyComponent = { _id: "123-456", _component: "@standard-components/header", _children: [], _styles: { normal: {}, hover: {}, active: {}, selected: {} } }

  test.only("Testing handling of empty component styles", () => {
    expect(generate_screen_css([emptyComponent])).toBe("")
  }) 
})