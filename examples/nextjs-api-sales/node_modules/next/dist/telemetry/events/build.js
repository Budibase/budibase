"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.eventTypeCheckCompleted = eventTypeCheckCompleted;
exports.eventLintCheckCompleted = eventLintCheckCompleted;
exports.eventBuildCompleted = eventBuildCompleted;
exports.eventBuildOptimize = eventBuildOptimize;
exports.eventBuildFeatureUsage = eventBuildFeatureUsage;
exports.EVENT_BUILD_FEATURE_USAGE = void 0;
const REGEXP_DIRECTORY_DUNDER = /[\\/]__[^\\/]+(?<![\\/]__(?:tests|mocks))__[\\/]/i;
const REGEXP_DIRECTORY_TESTS = /[\\/]__(tests|mocks)__[\\/]/i;
const REGEXP_FILE_TEST = /\.(?:spec|test)\.[^.]+$/i;
const EVENT_TYPE_CHECK_COMPLETED = 'NEXT_TYPE_CHECK_COMPLETED';
function eventTypeCheckCompleted(event) {
    return {
        eventName: EVENT_TYPE_CHECK_COMPLETED,
        payload: event
    };
}
const EVENT_LINT_CHECK_COMPLETED = 'NEXT_LINT_CHECK_COMPLETED';
function eventLintCheckCompleted(event) {
    return {
        eventName: EVENT_LINT_CHECK_COMPLETED,
        payload: event
    };
}
const EVENT_BUILD_COMPLETED = 'NEXT_BUILD_COMPLETED';
function eventBuildCompleted(pagePaths, event) {
    return {
        eventName: EVENT_BUILD_COMPLETED,
        payload: {
            ...event,
            totalPageCount: pagePaths.length,
            hasDunderPages: pagePaths.some((path)=>REGEXP_DIRECTORY_DUNDER.test(path)
            ),
            hasTestPages: pagePaths.some((path)=>REGEXP_DIRECTORY_TESTS.test(path) || REGEXP_FILE_TEST.test(path)
            )
        }
    };
}
const EVENT_BUILD_OPTIMIZED = 'NEXT_BUILD_OPTIMIZED';
function eventBuildOptimize(pagePaths, event) {
    return {
        eventName: EVENT_BUILD_OPTIMIZED,
        payload: {
            ...event,
            totalPageCount: pagePaths.length,
            hasDunderPages: pagePaths.some((path)=>REGEXP_DIRECTORY_DUNDER.test(path)
            ),
            hasTestPages: pagePaths.some((path)=>REGEXP_DIRECTORY_TESTS.test(path) || REGEXP_FILE_TEST.test(path)
            )
        }
    };
}
const EVENT_BUILD_FEATURE_USAGE = 'NEXT_BUILD_FEATURE_USAGE';
exports.EVENT_BUILD_FEATURE_USAGE = EVENT_BUILD_FEATURE_USAGE;
function eventBuildFeatureUsage(telemetryPlugin) {
    return telemetryPlugin.usages().map(({ featureName , invocationCount  })=>({
            eventName: EVENT_BUILD_FEATURE_USAGE,
            payload: {
                featureName,
                invocationCount
            }
        })
    );
}

//# sourceMappingURL=build.js.map