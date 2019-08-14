import { expandPropsDefinition } from "../src/userInterface/pagesParsing/types";

const propDef = {
    label: "string",
    width: {type:"number"},
    color: {type:"string", required:true},
    child: "component",
    navitems: {
        type: "array",
        elementDefinition: {
            name: {type:"string"},
            height: "number"
        }
    }
}

describe("expandPropDefintion", () => {

    it("should expand property defined as string, into default for that type", () => {

        const result = expandPropsDefinition(propDef);

        expect(result.label.type).toBe("string");
        expect(result.label.required).toBe(false);
    });

    it("should add members to property defined as object, when members do not exist", () => {

        const result = expandPropsDefinition(propDef);
        expect(result.width.required).toBe(false);
    });

    it("should not override existing memebers", () => {

        const result = expandPropsDefinition(propDef);
        expect(result.color.required).toBe(true);
    });

    it("should also expand out elementdefinition of array", () => {
        const result = expandPropsDefinition(propDef);
        expect(result.navitems.elementDefinition.height.type).toBe("number");
    })

})