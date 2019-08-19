import { isUndefined } from "lodash/fp";

const apiCall = (method, returnJson) => (url, body, returnJsonOverride) => 
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body && JSON.stringify(body), 
    }).then(r => {
        if(!isUndefined(returnJsonOverride)) 
            returnJson = returnJsonOverride;
        return returnJson ? r.json() : r
    });

const post = apiCall("POST", true);
const get = apiCall("GET", true);
const patch = apiCall("PATCH", true);
const del = apiCall("DELETE", false);

export default {
    post, get, patch, delete:del
};