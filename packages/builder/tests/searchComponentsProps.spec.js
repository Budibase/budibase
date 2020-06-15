import {
  searchAllComponents,
  getExactComponent,
  getAncestorProps,
} from "../src/components/userInterface/pagesParsing/searchComponents"
import { componentsAndScreens } from "./testData"
/* 
//searchAllComponents used in ComponentSearch which is no longer used in the Builder
describe("searchAllComponents", () => {
  it.only("should match component by name", () => {
    const results = searchAllComponents(
      componentsAndScreens().components,
      "Textbox"
    )

    expect(results.length).toBe(1)
    expect(results[0].name).toBe("budibase-components/TextBox")
  })

  it("should match component by tag", () => {
    const results = searchAllComponents(
      componentsAndScreens().components,
      "record"
    )

    expect(results.length).toBe(1)
    expect(results[0].name).toBe("budibase-components/RecordView")
  })
}) */

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

// Commented as not used anywhere
//describe("getAncestorProps", () => {
//   it("should return props of root component", () => {
//     const result = getAncestorProps(
//       componentsAndScreens().components,
//       "budibase-components/TextBox"
//     )

//     expect(result).toEqual([componentsAndScreens().components[0].props])
//   })

//   it("should return props of inherited and current component, in order", () => {
//     const { components, screens } = componentsAndScreens()
//     const allComponentsAndScreens = [...components, ...screens]

//     const result = getAncestorProps(
//       allComponentsAndScreens,
//       "common/PasswordBox"
//     )

//     expect(result).toEqual([
//       allComponentsAndScreens[0].props,
//       { ...allComponentsAndScreens[5].props },
//     ])
//   })
// })
