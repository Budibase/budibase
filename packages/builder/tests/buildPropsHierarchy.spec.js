import { componentsAndScreens } from "./testData";
import {
    find
} from "lodash/fp";
import { buildPropsHierarchy } from "../src/userInterface/pagesParsing/buildPropsHierarchy";

describe("buildPropsHierarchy", () => {


    it("should build a complex component children", () => {

        const {components, screens} = componentsAndScreens();

        const allprops = buildPropsHierarchy(
            components, screens, "ButtonGroup");

        expect(allprops._component).toEqual("budibase-components/div");

        const primaryButtonProps = () => ({
            _component: "budibase-components/Button"
        });

        const button1 = primaryButtonProps();
        button1.contentText = "Button 1";
        expect(allprops._children[0]).toEqual(button1);

        const button2 = primaryButtonProps();
        button2.contentText = "Button 2";
        expect(allprops._children[1]).toEqual(button2)
    });
});