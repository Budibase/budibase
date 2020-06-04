import {
  searchAllComponents,
  getExactComponent,
  getAncestorProps,
} from "../src/components/userInterface/pagesParsing/searchComponents"
import { componentsAndScreens } from "./testData"

describe("searchAllComponents", () => {
  //Commenting as searchAllComponents doesn't seemed to be used in any active components
  // it("should match component by name", () => {
  //   const results = searchAllComponents(
  //     componentsAndScreens().components,
  //     "Textbox"
  //   )

  //   expect(results.length).toBe(1)
  //   expect(results[0]._instanceName).toBe("budibase-components/TextBox")
  // })

 /*  
  //Commenting as searchAllComponents doesn't seemed to be used in any active components
 it("should match component by tag", () => {
    const results = searchAllComponents(
      componentsAndScreens().components,
      "record"
    )

    expect(results.length).toBe(1)
    expect(results[0].name).toBe("budibase-components/RecordView")
  }) */
})

describe("getExactComponent", () => {
  // it("should get component by name", () => {
  //   const { components, screens } = componentsAndScreens()
  //   const result = getExactComponent(
  //     [...components, ...screens],
  //     "common/SmallTextbox"
  //   )

  //   expect(result).toBeDefined()
  //   expect(result._instanceName).toBe("common/SmallTextbox")
  // })

  // it("should return nothing when no result (should not fail)", () => {
  //   const { components, screens } = componentsAndScreens()
  //   const result = getExactComponent([...components, ...screens], "bla/bla/bla")

  //   expect(result).not.toBeDefined()
  // })



  it("should return a component", () => {
    const { components } = componentsAndScreens()
    const result = getExactComponent(components, "Textbox")

    expect(result).toBeDefined()
  })

  it("should return a screen", () => {
    const { screens } = componentsAndScreens()
    const result = getExactComponent(screens, "Container", true)

    expect(result).toBeDefined()
  })

  // it("should not return a screen as name is not defined on top level anymore", () => {
  //   const { screens } = componentsAndScreens()
  //   const result = getExactComponent(screens, "Container")

  //   expect(result).not.toBeDefined()
  // })
})

describe("getAncestorProps", () => {
  /* 
    //ancestorProps not being used anywhere
  it("should return props of root component", () => {
    const result = getAncestorProps(
      componentsAndScreens().components,
      "budibase-components/TextBox"
    )

    expect(result).toEqual([componentsAndScreens().components[0].props])
  }) */
/* 
  //ancestorProps not being used anywhere
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
  }) */
})
