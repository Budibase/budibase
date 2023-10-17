export { Breadcrumb, BreadcrumbHint, Request, SdkInfo, Event, EventHint, EventStatus, Exception, Response, Severity, StackFrame, Stacktrace, Thread, User, } from '@sentry/types';
export { SeverityLevel } from '@sentry/utils';
export { addGlobalEventProcessor, addBreadcrumb, captureException, captureEvent, captureMessage, configureScope, getHubFromCarrier, getCurrentHub, Hub, makeMain, Scope, Session, startTransaction, SDK_VERSION, setContext, setExtra, setExtras, setTag, setTags, setUser, withScope, } from '@sentry/core';
export { NodeOptions } from './types';
export { NodeBackend } from './backend';
export { NodeClient } from './client';
export { defaultIntegrations, init, lastEventId, flush, close, getSentryRelease } from './sdk';
export { deepReadDirSync } from './utils';
export { SDK_NAME } from './version';
import { Integrations as CoreIntegrations } from '@sentry/core';
import * as Handlers from './handlers';
import * as NodeIntegrations from './integrations';
import * as Transports from './transports';
declare const INTEGRATIONS: {
    Console: typeof NodeIntegrations.Console;
    Http: typeof NodeIntegrations.Http;
    OnUncaughtException: typeof NodeIntegrations.OnUncaughtException;
    OnUnhandledRejection: typeof NodeIntegrations.OnUnhandledRejection;
    LinkedErrors: typeof NodeIntegrations.LinkedErrors;
    Modules: typeof NodeIntegrations.Modules;
    ContextLines: typeof NodeIntegrations.ContextLines;
    FunctionToString: typeof CoreIntegrations.FunctionToString;
    InboundFilters: typeof CoreIntegrations.InboundFilters;
};
export { INTEGRATIONS as Integrations, Transports, Handlers };
//# sourceMappingURL=index.d.ts.map