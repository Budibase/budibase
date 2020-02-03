import {
  searchAllComponents,
  getExactComponent,
  getAncestorProps,
} from "../src/userInterface/pagesParsing/searchComponents"
import { componentsAndScreens } from "./testData"

describe("searchAllComponents", () => {
  it("should match component by name", () => {
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
})

describe("getExactComponent", () => {
  it("should get component by name", () => {
    const { components, screens } = componentsAndScreens()
    const result = getExactComponent(
      [...components, ...screens],
      "common/SmallTextbox"
    )

    expect(result).toBeDefined()
    expect(result.name).toBe("common/SmallTextbox")
  })

  it("should return nothing when no result (should not fail)", () => {
    const { components, screens } = componentsAndScreens()
    const result = getExactComponent([...components, ...screens], "bla/bla/bla")

    expect(result).not.toBeDefined()
  })
})

describe("getAncestorProps", () => {
  it("should return props of root component", () => {
    const result = getAncestorProps(
      componentsAndScreens().components,
      "budibase-components/TextBox"
    )

    expect(result).toEqual([componentsAndScreens().components[0].props])
  })

  it("should return props of inherited and current component, in order", () => {
    const { components, screens } = componentsAndScreens()
    const allComponentsAndScreens = [...components, ...screens]

    const result = getAncestorProps(
      allComponentsAndScreens,
      "common/PasswordBox"
    )

    expect(result).toEqual([
      allComponentsAndScreens[0].props,
      { ...allComponentsAndScreens[5].props },
    ])
  })
})
