
export const createTrigger = () => ({
  actionName: '',
  eventName: '',
  // function, has access to event context,
  // returns object that is used as parameter to action
  // only used if triggered by event
  optionsCreator: '',
  // action runs if true,
  // has access to event context
  condition: '',
});

export const createAction = () => ({
  name: '',
  behaviourSource: '',
  // name of function in actionSource
  behaviourName: '',
  // parameter passed into behaviour.
  // any other parms passed at runtime e.g.
  // by trigger, or manually, will be merged into this
  initialOptions: {},
});
