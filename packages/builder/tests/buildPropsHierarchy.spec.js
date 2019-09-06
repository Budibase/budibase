import { allComponents } from "./testData";
import {
    find
} from "lodash/fp";
import { buildPropsHierarchy } from "../src/userInterface/pagesParsing/buildPropsHierarchy";

describe("buildPropsHierarchy", () => {


    it("should build a complex component with arrays and components", () => {

        const components = allComponents();

        const allprops = buildPropsHierarchy(
            components, "ButtonGroup");

        expect(allprops._component).toEqual("budibase-components/div");

        const primaryButtonProps = () => ({
            _component: "budibase-components/Button",
            css:"btn-primary",
            content: {_component:""},
            contentText: "",
            size:""
        });

        const headerButton = primaryButtonProps();
        expect(allprops.header).toEqual(headerButton);

        const button1 = primaryButtonProps();
        button1.contentText = "Button 1";
        expect(allprops.children[0]).toEqual({
            _component: "children[0]",
            control: button1
        });


        const button2 = primaryButtonProps();
        button2.contentText = "Button 2";
        expect(allprops.children[1]).toEqual({
            _component: "children[1]",
            control: button2
        })



    });

});