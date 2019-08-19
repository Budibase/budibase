
const apiCall = (method, returnResponse) => (url, body) => 
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body && JSON.stringify(body), 
    }).then(r => 
        returnResponse ? r.json() : r
    );

const post = apiCall("POST", true);
const get = apiCall("GET", true);
const patch = apiCall("PATCH", true);
const del = apiCall("DELETE", false);

export default {
    post, get, patch, delete:del
};