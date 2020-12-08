const { generateAssetCss, generateCss } = require("../../../utilities/builder/generateCss")

describe("generate_css", () => {
  it("Check how array styles are output", () => {
    expect(generateCss({ margin: ["0", "10", "0", "15"] })).toBe("margin: 0 10 0 15;")
  })

  it("Check handling of an array with empty string values", () => {
    expect(generateCss({ padding: ["", "", "", ""] })).toBe("")
  })

  it("Check handling of an empty array", () => {
    expect(generateCss({ margin: [] })).toBe("")
  })

  it("Check handling of valid font property", () => {
    expect(generateCss({ "font-size": "10px" })).toBe("font-size: 10px;")
  })
})


describe("generate_screen_css", () => {
  const normalComponent = { _id: "123-456", _component: "@standard-components/header", _children: [], _styles: { normal: { "font-size": "16px" }, hover: {}, active: {}, selected: {} } }

  it("Test generation of normal css styles", () => {
    expect(generateAssetCss([normalComponent])).toBe(".header-123-456 {\nfont-size: 16px;\n}")
  })

  const hoverComponent = { _id: "123-456", _component: "@standard-components/header", _children: [], _styles: { normal: {}, hover: {"font-size": "16px"}, active: {}, selected: {} } }

  it("Test generation of hover css styles", () => {
    expect(generateAssetCss([hoverComponent])).toBe(".header-123-456:hover {\nfont-size: 16px;\n}")
  })

  const selectedComponent = { _id: "123-456", _component: "@standard-components/header", _children: [], _styles: { normal: {}, hover: {}, active: {}, selected: { "font-size": "16px" } } }

  it("Test generation of selection css styles", () => {
    expect(generateAssetCss([selectedComponent])).toBe(".header-123-456::selection {\nfont-size: 16px;\n}")
  }) 

  const emptyComponent = { _id: "123-456", _component: "@standard-components/header", _children: [], _styles: { normal: {}, hover: {}, active: {}, selected: {} } }

  it("Testing handling of empty component styles", () => {
    expect(generateAssetCss([emptyComponent])).toBe("")
  }) 
})