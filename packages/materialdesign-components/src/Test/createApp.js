import { createApp } from "@budibase/client/src/createApp";
import componentsJson from "../../components.json";
import packageJson from "../../package.json";

export default async () =>  {

    const components = {...componentsJson};
    delete components._lib;

    componentLibraries[packageJson.name] = components;

    const appDef = {hierarchy:{}, actions:{}};
    const user = {name:"yeo", permissions:[]};
   
    var app = createApp(componentLibraries, appDef, user);
    return app;

}