import {
  isFunction, filter, map,
  uniqBy, keys, difference,
  join, reduce, find,
} from 'lodash/fp';
import { compileExpression, compileCode } from '../common/compileCode';
import { $ } from '../common';
import { _executeAction } from './execute';
import { BadRequestError, NotFoundError } from '../common/errors';

export const initialiseActions = (subscribe, behaviourSources, actions, triggers, apis) => {
  validateSources(behaviourSources, actions);
  subscribeTriggers(subscribe, behaviourSources, actions, triggers, apis);
  return createActionsCollection(behaviourSources, actions);
};

const createActionsCollection = (behaviourSources, actions) => $(actions, [
  reduce((all, a) => {
    all[a.name] = opts => _executeAction(behaviourSources, a, opts);
    return all;
  }, {}),
]);

const subscribeTriggers = (subscribe, behaviourSources, actions, triggers, apis) => {
  const createOptions = (optionsCreator, eventContext) => {
    if (!optionsCreator) return {};
    const create = compileCode(optionsCreator);
    return create({ context: eventContext, apis });
  };

  const shouldRunTrigger = (trigger, eventContext) => {
    if (!trigger.condition) return true;
    const shouldRun = compileExpression(trigger.condition);
    return shouldRun({ context: eventContext });
  };

  for (let trig of triggers) {
    subscribe(trig.eventName, async (ev, ctx) => {
      if (shouldRunTrigger(trig, ctx)) {
        await _executeAction(
          behaviourSources,
          find(a => a.name === trig.actionName)(actions),
          createOptions(trig.optionsCreator, ctx),
        );
      }
    });
  }
};

const validateSources = (behaviourSources, actions) => {
  const declaredSources = $(actions, [
    uniqBy(a => a.behaviourSource),
    map(a => a.behaviourSource),
  ]);

  const suppliedSources = keys(behaviourSources);

  const missingSources = difference(
    declaredSources, suppliedSources,
  );

  if (missingSources.length > 0) {
    throw new BadRequestError(`Declared behaviour sources are not supplied: ${join(', ', missingSources)}`);
  }

  const missingBehaviours = $(actions, [
    filter(a => !isFunction(behaviourSources[a.behaviourSource][a.behaviourName])),
    map(a => `Action: ${a.name} : ${a.behaviourSource}.${a.behaviourName}`),
  ]);

  if (missingBehaviours.length > 0) {
    throw new NotFoundError(`Missing behaviours: could not find behaviour functions: ${join(', ', missingBehaviours)}`);
  }
};
