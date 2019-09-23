
const apiCall = (method) => (url, body) => 
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body && JSON.stringify(body), 
    });

export const post = apiCall("POST");
export const get = apiCall("GET");
export const patch = apiCall("PATCH");
export const del = apiCall("DELETE");

export const authenticate = (username, password) => post("./api/authenticate", {
    username, password
});

export default {
post, get, patch, delete:del
};