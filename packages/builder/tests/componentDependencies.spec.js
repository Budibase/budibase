import { componentDependencies } from "../src/userInterface/pagesParsing/findDependencies"
import { componentsAndScreens } from "./testData"
import { some, find } from "lodash/fp"

describe("component dependencies", () => {
  const contains = (result, name) => some(c => c.name === name)(result)

  const get = (all, name) => find(c => c.name === name)(all)

  it("should include component that inheirts", () => {
    const { components, screens } = componentsAndScreens()

    const result = componentDependencies(
      {},
      screens,
      components,
      get([...components, ...screens], "budibase-components/TextBox")
    )

    expect(contains(result.dependantComponents, "common/SmallTextbox")).toBe(
      true
    )
  })

  it("should include component that nests", () => {
    const { components, screens } = componentsAndScreens()

    const result = componentDependencies(
      {},
      screens,
      components,
      get([...components, ...screens], "budibase-components/Button")
    )

    expect(contains(result.dependantComponents, "ButtonGroup")).toBe(true)
  })

  it("should include components n page apbody", () => {
    const { components, screens } = componentsAndScreens()
    const pages = {
      main: {
        appBody: "PrimaryButton",
      },
    }

    const result = componentDependencies(
      pages,
      screens,
      components,
      get([...components, ...screens], "PrimaryButton")
    )

    expect(result.dependantPages).toEqual(["main"])
  })
})
