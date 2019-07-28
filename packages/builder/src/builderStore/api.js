
const apiCall = (method) => (url, body, returnResponse=false) => 
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body && JSON.stringify(body), 
    }).then(r => returnResponse ? r : r.json());

const post = apiCall("POST");
const get = apiCall("GET");
const patch = apiCall("PATCH");
const del = apiCall("DELETE");

export default {
    post, get, patch, delete:del
};