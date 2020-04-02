import { getNewScreen } from "../src/components/userInterface/pagesParsing/createProps"
import { componentsAndScreens, stripStandardProps } from "./testData"

describe("geNewScreen", () => {
  it("should return correct props for screen", () => {
    const { components } = componentsAndScreens()
    const result = getNewScreen(
      components,
      "budibase-components/TextBox",
      "newscreen"
    )

    expect(result.props._code).toBeDefined()
    expect(result.props._id).toBeDefined()
    expect(result.props._styles).toBeDefined()
    stripStandardProps(result.props)

    const expectedProps = {
      _component: "budibase-components/TextBox",
      size: "",
      isPassword: false,
      placeholder: "",
      label: "",
    }

    expect(result.props).toEqual(expectedProps)
    expect(result.name).toBe("newscreen")
    expect(result.url).toBeDefined()
  })
})
