import { getExactComponent } from "../src/components/userInterface/pagesParsing/searchComponents"
import { rename } from "../src/components/userInterface/pagesParsing/renameScreen"
import { componentsAndScreens } from "./testData"

describe("rename component", () => {
  it("should change the name of the component, duh", () => {
    const { screens } = componentsAndScreens()

    const result = rename({}, screens, "PrimaryButton", "MainButton")

    const newComponent = getExactComponent(result.screens, "MainButton")
    const oldComponent = getExactComponent(result.screens, "Primary")
    expect(oldComponent).toBeUndefined()
    expect(newComponent).toBeDefined()
    expect(newComponent.name).toBe("MainButton")
  })

  /* this may be usefull if we have user defined components
    it("should change name of nested _components", () => {
        const {screens} = componentsAndScreens();
        const result = rename({}, screens, "PrimaryButton", "MainButton");

        const buttonGroup = getExactComponent(result.screens, "ButtonGroup");
        expect(buttonGroup.props.header[0]._component).toBe("MainButton");

    });
    */

  it("should change name of page appBody", () => {
    const { screens } = componentsAndScreens()
    const pages = {
      main: {
        appBody: "PrimaryButton",
      },
    }

    const result = rename(pages, screens, "PrimaryButton", "MainButton")
    expect(result.pages.main.appBody).toBe("MainButton")
  })

  /* this may be usefull if we have user defined components
    it("should return a list of changed components", () => {
        const {screens} = componentsAndScreens();
        const result = rename({}, screens, "PrimaryButton", "MainButton");

        expect(result.changedScreens).toEqual(["ButtonGroup"]);

        const result2 = rename({}, screens, "common/SmallTextbox", "common/TinyTextBox");
        expect(result2.changedScreens).toEqual(["Field"]);

    });
    */
})
