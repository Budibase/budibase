import { recursivelyValidate } from "./validateProps";
import { 
    isString, 
    keys, 
    flatten,
    isArray,
    map,
    filter
} from "lodash/fp";
import { common } from "../../../../core/src";
const pipe = common.$;

export const validatePage = (page, getComponent) => {
    const errors = [];
    const error = message => errors.push(message);

    const noIndex = !page.index || !page.index._component;
    if(noIndex) {
        error("Must choose a component for your index.html");
    }

    if(!page.appBody 
        || !isString(page.appBody) 
        || !page.appBody.endsWith(".json")) {
        error("App body must be set toa valid JSON file");
    }

    const indexHtmlErrors = noIndex 
    ? []
    : pipe(
        recursivelyValidate(page.index, getComponent), [
        map(e => `Index.html: ${e.error}`)
    ]);

    return [...errors, ...indexHtmlErrors];
}

export const validatePages = (pages, getComponent) => {

    let errors = [];
    const error = message => errors.push(message);

    if(!pages.main) {
        error("must have a 'main' page");
    }

    if(!pages.unauthenticated) {
        error("must have a 'unauthenticated' (login) page");
    }

    if(!pages.componentLibraries 
      || !isArray(pages.componentLibraries) 
      || pages.componentLibraries.length === 0) {

        error("componentLibraries must be set to a non-empty array of strings");
    }

    const pageErrors = pipe(pages, [
        keys,
        filter(k => k !== "componentLibraries"),
        map(k => validatePage(pages[k], getComponent)),
        flatten
    ]);

    return [...errors, ...pageErrors];
}