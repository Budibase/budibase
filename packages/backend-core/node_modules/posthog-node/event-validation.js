var type = require('component-type')
var join = require('join-component')
var assert = require('assert')

// PostHog messages can be a maximum of 32 kB.
var MAX_SIZE = 32 << 10

module.exports = eventValidation

/**
 * Validate an event.
 */

function eventValidation(event, type) {
    validateGenericEvent(event)
    type = type || event.type
    assert(type, 'You must pass an event type.')
    switch (type) {
        case 'capture':
            return validateCaptureEvent(event)
        case 'identify':
            return validateIdentifyEvent(event)
        case 'alias':
            return validateAliasEvent(event)
        case 'groupIdentify':
            return validateGroupIdentifyEvent(event)
        case 'isFeatureEnabled':
            return validateIsFeatureEnabled(event)
        default:
            assert(0, 'Invalid event type: "' + type + '"')
    }
}

/**
 * Validate a "capture" event.
 */

function validateCaptureEvent(event) {
    assert(event.distinctId, 'You must pass a "distinctId".')
    assert(event.event, 'You must pass an "event".')
}

/**
 * Validate a "identify" event.
 */

function validateIdentifyEvent(event) {
    assert(event.distinctId, 'You must pass a "distinctId".')
}

/**
 * Validate an "alias" event.
 */

function validateAliasEvent(event) {
    assert(event.distinctId, 'You must pass a "distinctId".')
    assert(event.alias, 'You must pass a "alias".')
}

/**
 * Validate an "groupIdentify" event.
 */

 function validateGroupIdentifyEvent(event) {
    assert(event.groupType, 'You must pass a "groupType".')
    assert(event.groupKey, 'You must pass a "groupKey".')
}

/**
 * Validate a "isFeatureEnabled" call
 */

 function validateIsFeatureEnabled(event) {
    assert(event.key, 'You must pass a "key".')
    assert(event.distinctId, 'You must pass a "distinctId".')
    assert(type(event.defaultResult) == 'boolean', '"defaultResult" must be a boolean.')
    if (event.groups) {
        assert(type(event.groups) == 'object', 'You must pass an object for "groups".')
    }
}


/**
 * Validation rules.
 */

var genericValidationRules = {
    event: 'string',
    properties: 'object',
    alias: 'string',
    timestamp: 'date',
    distinctId: 'string',
    type: 'string',
}

/**
 * Validate an event object.
 */

function validateGenericEvent(event) {
    assert(type(event) === 'object', 'You must pass a message object.')
    var json = JSON.stringify(event)
    // Strings are variable byte encoded, so json.length is not sufficient.
    assert(Buffer.byteLength(json, 'utf8') < MAX_SIZE, 'Your message must be < 32 kB.')

    for (var key in genericValidationRules) {
        var val = event[key]
        if (!val) continue
        var rule = genericValidationRules[key]
        if (type(rule) !== 'array') {
            rule = [rule]
        }
        var a = rule[0] === 'object' ? 'an' : 'a'
        assert(
            rule.some(function (e) {
                return type(val) === e
            }),
            '"' + key + '" must be ' + a + ' ' + join(rule, 'or') + '.'
        )
    }
}
