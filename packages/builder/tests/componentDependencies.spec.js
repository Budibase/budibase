import {
    searchAllComponents, 
    getExactComponent,
    getAncestorProps
} from "../src/userInterface/pagesParsing/searchComponents";
import {
    componentDependencies
} from "../src/userInterface/pagesParsing/findDependencies";
import { allComponents } from "./testData";
import { some, find } from "lodash/fp"

describe("component dependencies", () => {

    const contains = (result, name) => 
        some(c => c.name === name)(result);
    
    const get = (all, name) => 
        find(c => c.name === name)(all);

    it("should include component that inheirts", () => {

        const components = allComponents();
        
        const result = componentDependencies(
            {}, components, get(components, "budibase-components/TextBox"));

        expect(contains(result.dependantComponents, "common/SmallTextbox")).toBe(true);

    });

    it("should include component that nests", () => {
        const components = allComponents();
        
        const result = componentDependencies(
            {}, components, get(components, "PrimaryButton"));

        expect(contains(result.dependantComponents, "ButtonGroup")).toBe(true);

    });

    it("shouldinclude component that nests inside arrays", () => {
        const components = allComponents();
        
        const result = componentDependencies(
            {}, components, get(components, "common/PasswordBox"));

        expect(contains(result.dependantComponents, "ButtonGroup")).toBe(true);
    });


    it("should include components n page apbody", () => {
        const components = allComponents();
        const pages = {
            main: {
                appBody: "PrimaryButton"
            }
        };
        
        const result = componentDependencies(
            pages, components, get(components, "PrimaryButton"));

        expect(result.dependantPages).toEqual(["main"]);
    });
})