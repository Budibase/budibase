import { createCoreApp } from "./createCoreApp"
import {
    getNew, getNewChild
} from "../../../core/src/recordApi/getNew";
import {
    constructHierarchy
} from "../../../core/src/templateApi/createNodes";

export const createCoreApi = (appDefinition, user) => {
    
    const app = createCoreApp(appDefinition, user);

    return {
        recordApi: {
            getNew: getNew(app),
            getNewChild: getNewChild(app)
        },

        templateApi: {
            constructHierarchy
        }
    }

}