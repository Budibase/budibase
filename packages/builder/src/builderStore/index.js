import {createPackage} from "./createPackage";
import getStore from "./store";
import { last } from "lodash/fp";

export const database = getStore();

export const createNewPackage = () =>
    createPackage(packageInfo, database);

export const initialise = async () => {
    try {
        setupRouter(database);
        await database.initialise();
    } catch(err) {
        console.log(err);
    }

} 

const setupRouter = (writable) => {
    const pushState = history.pushState;
    history.pushState = () => {
        pushState.apply(history, arguments);
        //fireEvents('pushState', arguments); 
        writable.initialise();
    }
    window.addEventListener('hashchange',()=>{
        writable.initialise();
    })
}
