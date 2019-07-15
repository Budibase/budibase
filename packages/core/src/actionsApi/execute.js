import { permission } from '../authApi/permissions';
import { apiWrapperSync } from '../common/apiWrapper';
import { events } from '../common/events';

export const executeAction = app => (actionName, options) => {
  apiWrapperSync(
    app,
    events.actionsApi.execute,
    permission.executeAction.isAuthorized(actionName),
    { actionName, options },
    app.actions[actionName], options,
  );
};

export const _executeAction = (behaviourSources, action, options) => behaviourSources[action.behaviourSource][action.behaviourName](options);
