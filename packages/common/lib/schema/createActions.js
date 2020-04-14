"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.createAction = exports.createTrigger = void 0;var createTrigger = function createTrigger() {return {
    actionName: "",
    eventName: "",
    // function, has access to event context,
    // returns object that is used as parameter to action
    // only used if triggered by event
    optionsCreator: "",
    // action runs if true,
    // has access to event context
    condition: "" };};exports.createTrigger = createTrigger;


var createAction = function createAction() {return {
    name: "",
    behaviourSource: "",
    // name of function in actionSource
    behaviourName: "",
    // parameter passed into behaviour.
    // any other parms passed at runtime e.g.
    // by trigger, or manually, will be merged into this
    initialOptions: {} };};exports.createAction = createAction;
//# sourceMappingURL=createActions.js.map