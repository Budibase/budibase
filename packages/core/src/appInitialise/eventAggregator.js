import { has } from 'lodash';

const publish = handlers => async (eventName, context = {}) => {
  if (!has(handlers, eventName)) return;

  for (const handler of handlers[eventName]) {
    await handler(eventName, context);
  }
};

const subscribe = handlers => (eventName, handler) => {
  if (!has(handlers, eventName)) {
    handlers[eventName] = [];
  }
  handlers[eventName].push(handler);
};

export const createEventAggregator = () => {
  const handlers = {};
  const eventAggregator = ({
    publish: publish(handlers),
    subscribe: subscribe(handlers),
  });
  return eventAggregator;
};

export default createEventAggregator;
