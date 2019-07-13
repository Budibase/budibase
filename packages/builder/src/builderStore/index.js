import {createPackage} from "./createPackage";
import getStore from "./store";
import { last } from "lodash/fp";

const appName = last(window.location.hash.substr(1).split("/"));

export const database = getStore(appName);

export const createNewPackage = () =>
    createPackage(packageInfo, database);

export const initialise = async () => {
    try {
        await database.initialise();
    } catch(err) {
        console.log(err);
    }

} 
