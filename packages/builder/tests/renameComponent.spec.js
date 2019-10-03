import {
    searchAllComponents, 
    getExactComponent,
    getAncestorProps
} from "../src/userInterface/pagesParsing/searchComponents";
import {
    rename
} from "../src/userInterface/pagesParsing/renameComponent";
import { allComponents } from "./testData";

describe("rename component", () => {
    it("should change the name of the component, duh", () => {

        const components = allComponents();
        
        const result = rename({}, components, "PrimaryButton", "MainButton");

        const newComponent = getExactComponent(result.allComponents, "MainButton");
        const oldComponent = getExactComponent(result.allComponents, "Primary");
        expect(oldComponent).toBeUndefined();
        expect(newComponent).toBeDefined();
        expect(newComponent.name).toBe("MainButton");

    });

    it("should chnge name on inherits", () => {

        const components = allComponents();
        
        const result = rename({}, components, "common/SmallTextbox", "common/TinyTextbox");

        const passwordTextbox = getExactComponent(result.allComponents, "common/PasswordBox");
        expect(passwordTextbox.inherits).toBe("common/TinyTextbox");

    });

    it("should change name of nested _components", () => {
        const components = allComponents();
        const result = rename({}, components, "PrimaryButton", "MainButton");

        const buttonGroup = getExactComponent(result.allComponents, "ButtonGroup");
        expect(buttonGroup.props.header._component).toBe("MainButton");

    });

    it("should change name of nested _components inside arrays", () => {
        const components = allComponents();
        const result = rename({}, components, "PrimaryButton", "MainButton");

        const buttonGroup = getExactComponent(result.allComponents, "ButtonGroup");
        expect(buttonGroup.props.children[0].control._component).toBe("MainButton");

    });


    it("should change name of page appBody", () => {
        const components = allComponents();
        const pages = {
            main: {
                appBody: "PrimaryButton"
            }
        };

        const result = rename(pages, components, "PrimaryButton", "MainButton");
        expect(result.pages.main.appBody).toBe("MainButton");
        
    });

    it("should return a list of changed components", () => {
        const components = allComponents();
        const result = rename({}, components, "PrimaryButton", "MainButton");

        expect(result.changedComponents).toEqual(["ButtonGroup"]);

        const result2 = rename({}, components, "common/SmallTextbox", "common/TinyTextBox");
        expect(result2.changedComponents).toEqual(["common/PasswordBox"]);

    });
})