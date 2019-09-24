import {
    eventHandlers
} from "../../../client/src/state/eventHandlers";

export {
    EVENT_TYPE_MEMBER_NAME
 } from "../../../client/src/state/eventHandlers";

export const allHandlers = ()  => {
    const handlersObj = eventHandlers({}, {});
    const handlersArray = [];
    for(let key in handlersObj) {
        handlersArray.push({name:key, ...handlersObj[key]});
    }
    return handlersArray;
}