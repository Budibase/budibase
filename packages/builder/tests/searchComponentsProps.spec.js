import {
  searchAllComponents,
  getExactComponent,
  getAncestorProps,
} from "../src/components/userInterface/pagesParsing/searchComponents"
import { componentsAndScreens } from "./testData"


describe("getExactComponent", () => {
  it("should get component by name", () => {
    const { components } = componentsAndScreens()
    const result = getExactComponent(
      components,
      "TextBox"
    )

    expect(result).toBeDefined()
    expect(result._instanceName).toBe("TextBox")
  })

  test("Should not find as isScreen is not specified", () => {
    const { screens } = componentsAndScreens()
    const result = getExactComponent(screens, "SmallTextbox")

    expect(result).not.toBeDefined()
  })

  test("Should find as isScreen is specified", () => {
    const { screens } = componentsAndScreens()
    const result = getExactComponent(screens, "SmallTextbox", true)

    expect(result).toBeDefined()
    expect(result.props._instanceName).toBe("SmallTextbox")

  })
})

