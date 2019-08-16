import { 
    getInstanceProps,
    getComponentInfo 
} from "../src/userInterface/pagesParsing/createProps";
import {
    keys, some
} from "lodash/fp";
import { allComponents } from "./testData";



describe("getComponentInfo", () => {

    it("should return default props for root component", () => {
        const result = getComponentInfo(
            allComponents(), 
            "budibase-components/TextBox");

        expect(result.errors).toEqual([]);
        expect(result.fullProps).toEqual({
            size: "",
            isPassword: false,
            placeholder: "",
            label:""
        });
    });

    it("should return no inherited for root component", () => {
        const result = getComponentInfo(
            allComponents(), 
            "budibase-components/TextBox");

        expect(result.inheritedProps).toEqual([]);
        
    });

    it("getInstanceProps should set supplied props on top of default props", () => {
        const result = getInstanceProps(
            getComponentInfo(
                allComponents(), 
                "budibase-components/TextBox"),
            {size:"small"});

        expect(result).toEqual({
            size: "small",
            isPassword: false,
            placeholder: "",
            label:""
        });
        
    });

    it("should return correct props for derived component", () => {
        const result = getComponentInfo(
            allComponents(), 
            "common/SmallTextbox");

        expect(result.errors).toEqual([]);
        expect(result.fullProps).toEqual({
            size: "small",
            isPassword: false,
            placeholder: "",
            label:""
        });
    });

    it("should return correct props for twice derived component", () => {
        const result = getComponentInfo(
            allComponents(), 
            "common/PasswordBox");

        expect(result.errors).toEqual([]);
        expect(result.fullProps).toEqual({
            size: "small",
            isPassword: true,
            placeholder: "",
            label:""
        });
    });

    it("should list inheirted props as those that are defined in ancestor, derived components", () => {
        const result = getComponentInfo(
            allComponents(), 
            "common/PasswordBox");

        // size is inherited from SmallTextbox
        expect(result.inheritedProps).toEqual(["size"]);
    });

    it("should list unset props as those that are only defined in root", () => {
        const result = getComponentInfo(
            allComponents(), 
            "common/PasswordBox");

        expect(result.unsetProps).toEqual([
            "placeholder", "label"]);
    });

})