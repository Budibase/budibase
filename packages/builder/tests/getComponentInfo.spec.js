import {
  getInstanceProps,
  getScreenInfo,
  getComponentInfo,
} from "../src/userInterface/pagesParsing/createProps"
import { keys, some, find } from "lodash/fp"
import { componentsAndScreens } from "./testData"

describe("getComponentInfo", () => {
  it("should return default props for root component", () => {
    const result = getComponentInfo(
      componentsAndScreens().components,
      "budibase-components/TextBox"
    )

    expect(result.errors).toEqual([])
    expect(result.fullProps).toEqual({
      _component: "budibase-components/TextBox",
      size: "",
      isPassword: false,
      placeholder: "",
      label: "",
    })
  })

  it("getInstanceProps should set supplied props on top of default props", () => {
    const result = getInstanceProps(
      getComponentInfo(
        componentsAndScreens().components,
        "budibase-components/TextBox"
      ),
      { size: "small" }
    )

    expect(result).toEqual({
      _component: "budibase-components/TextBox",
      size: "small",
      isPassword: false,
      placeholder: "",
      label: "",
    })
  })
})

describe("getScreenInfo", () => {
  const getScreen = (screens, name) => find(s => s.name === name)(screens)

  it("should return correct props for screen", () => {
    const { components, screens } = componentsAndScreens()
    const result = getScreenInfo(
      components,
      getScreen(screens, "common/SmallTextbox")
    )

    expect(result.errors).toEqual([])
    expect(result.fullProps).toEqual({
      _component: "common/SmallTextbox",
      size: "small",
      isPassword: false,
      placeholder: "",
      label: "",
    })
  })

  it("should return correct props for twice derived component", () => {
    const { components, screens } = componentsAndScreens()
    const result = getScreenInfo(
      components,
      getScreen(screens, "common/PasswordBox")
    )

    expect(result.errors).toEqual([])
    expect(result.fullProps).toEqual({
      _component: "common/PasswordBox",
      size: "small",
      isPassword: true,
      placeholder: "",
      label: "",
    })
  })

  it("should list unset props as those that are only defined in root", () => {
    const { components, screens } = componentsAndScreens()
    const result = getScreenInfo(
      components,
      getScreen(screens, "common/PasswordBox")
    )

    expect(result.unsetProps).toEqual(["placeholder", "label"])
  })
})
