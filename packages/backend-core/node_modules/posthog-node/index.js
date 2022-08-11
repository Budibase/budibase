'use strict'

const assert = require('assert')
const removeSlash = require('remove-trailing-slash')
const axios = require('axios')
const axiosRetry = require('axios-retry')
const ms = require('ms')
const version = require('./package.json').version
const looselyValidate = require('./event-validation')
const { FeatureFlagsPoller } = require('./feature-flags')

const setImmediate = global.setImmediate || process.nextTick.bind(process)
const noop = () => {}

const FIVE_MINUTES = 5 * 60 * 1000
class PostHog {
    /**
     * Initialize a new `PostHog` with your PostHog project's `apiKey` and an
     * optional dictionary of `options`.
     *
     * @param {String} apiKey
     * @param {Object} [options] (optional)
     *   @property {Number} flushAt (default: 20)
     *   @property {Number} flushInterval (default: 10000)
     *   @property {String} host (default: 'https://app.posthog.com')
     *   @property {Boolean} enable (default: true)
     *   @property {String} featureFlagsPollingInterval (default: 300000)
     *   @property {String} personalApiKey
     */

    constructor(apiKey, options) {
        options = options || {}

        assert(apiKey, "You must pass your PostHog project's api key.")

        this.queue = []
        this.apiKey = apiKey
        this.host = removeSlash(options.host || 'https://app.posthog.com')
        this.timeout = options.timeout || false
        this.flushAt = Math.max(options.flushAt, 1) || 20
        this.flushInterval = typeof options.flushInterval === 'number' ? options.flushInterval : 10000
        this.flushed = false
        this.personalApiKey = options.personalApiKey

        Object.defineProperty(this, 'enable', {
            configurable: false,
            writable: false,
            enumerable: true,
            value: typeof options.enable === 'boolean' ? options.enable : true,
        })

        axiosRetry(axios, {
            retries: options.retryCount || 3,
            retryCondition: this._isErrorRetryable,
            retryDelay: axiosRetry.exponentialDelay,
        })

        if (this.personalApiKey) {
            const featureFlagCalledCallback = (key, distinctId, isFlagEnabledResponse) => {
                this.capture({
                    distinctId,
                    event: '$feature_flag_called',
                    properties: {
                        $feature_flag: key,
                        $feature_flag_response: isFlagEnabledResponse,
                    },
                })
            }

            this.featureFlagsPoller = new FeatureFlagsPoller({
                pollingInterval:
                    typeof options.featureFlagsPollingInterval === 'number'
                        ? options.featureFlagsPollingInterval
                        : FIVE_MINUTES,
                personalApiKey: options.personalApiKey,
                projectApiKey: apiKey,
                timeout: options.timeout || false,
                host: this.host,
                featureFlagCalledCallback,
            })
        }
    }

    _validate(message, type) {
        try {
            looselyValidate(message, type)
        } catch (e) {
            if (e.message === 'Your message must be < 32 kB.') {
                console.log(
                    'Your message must be < 32 kB.',
                    JSON.stringify(message)
                )
                return
            }
            throw e
        }
    }

    /**
     * Send an identify `message`.
     *
     * @param {Object} message
     * @param {Function} [callback] (optional)
     * @return {PostHog}
     */

    identify(message, callback) {
        this._validate(message, 'identify')

        const apiMessage = Object.assign({}, message, {
            $set: message.properties || {},
            event: '$identify',
            properties: {
                $lib: 'posthog-node',
                $lib_version: version,
            },
        })

        this.enqueue('identify', apiMessage, callback)
        return this
    }

    /**
     * Send a capture `message`.
     *
     * @param {Object} message
     * @param {Function} [callback] (optional)
     * @return {PostHog}
     */

    capture(message, callback) {
        this._validate(message, 'capture')

        const properties = Object.assign({}, message.properties, {
            $lib: 'posthog-node',
            $lib_version: version,
        })

        if ('groups' in message) {
            properties.$groups = message.groups
            delete message.groups
        }

        const apiMessage = Object.assign({}, message, { properties })

        this.enqueue('capture', apiMessage, callback)
        return this
    }

    /**
     * Send an alias `message`.
     *
     * @param {Object} message
     * @param {Function} [callback] (optional)
     * @return {PostHog}
     */

    alias(message, callback) {
        this._validate(message, 'alias')

        const apiMessage = Object.assign({}, message, {
            event: '$create_alias',
            properties: {
                distinct_id: message.distinctId || message.distinct_id,
                alias: message.alias,
                $lib: 'posthog-node',
                $lib_version: version,
            },
        })
        delete apiMessage.alias
        delete apiMessage.distinctId
        apiMessage.distinct_id = message.distinctId || message.distinct_id

        this.enqueue('alias', apiMessage, callback)
        return this
    }

    /**
     * @description Sets a groups properties, which allows asking questions like "Who are the most active companies"
     * using my product in PostHog.
     *
     * @param groupType Type of group (ex: 'company'). Limited to 5 per project
     * @param groupKey Unique identifier for that type of group (ex: 'id:5')
     * @param properties OPTIONAL | which can be a object with any information you'd like to add
     */
    groupIdentify(message, callback) {
        this._validate(message, 'groupIdentify')

        const captureMessage = {
            event: '$groupidentify',
            distinctId: `\$${message.groupType}_${message.groupKey}`,
            properties: {
                $group_type: message.groupType,
                $group_key: message.groupKey,
                $group_set: message.properties || {}
            }
        }

        return this.capture(captureMessage, callback)
    }

    /**
     * Add a `message` of type `type` to the queue and
     * check whether it should be flushed.
     *
     * @param {String} type
     * @param {Object} message
     * @param {Function} [callback] (optional)
     * @api private
     */

    enqueue(type, message, callback) {
        callback = callback || noop

        if (!this.enable) {
            return setImmediate(callback)
        }

        message = Object.assign({}, message)
        message.type = type
        message.library = 'posthog-node'
        message.library_version = version

        if (!message.timestamp) {
            message.timestamp = new Date()
        }

        if (message.distinctId) {
            message.distinct_id = message.distinctId
            delete message.distinctId
        }

        this.queue.push({ message, callback })

        if (!this.flushed) {
            this.flushed = true
            this.flush()
            return
        }

        if (this.queue.length >= this.flushAt) {
            this.flush()
        }

        if (this.flushInterval && !this.timer) {
            this.timer = setTimeout(() => this.flush(), this.flushInterval)
        }
    }

    async isFeatureEnabled(key, distinctId, defaultResult = false, groups = {}) {
        this._validate({ key, distinctId, defaultResult, groups }, 'isFeatureEnabled')
        assert(this.personalApiKey, 'You have to specify the option personalApiKey to use feature flags.')

        return await this.featureFlagsPoller.isFeatureEnabled(key, distinctId, defaultResult, groups)
    }

    async reloadFeatureFlags() {
        await this.featureFlagsPoller.loadFeatureFlags(true)
    }

    /**
     * Flush the current queue
     *
     * @param {Function} [callback] (optional)
     * @return {PostHog}
     */

    flush(callback) {
        callback = callback || noop

        if (!this.enable) {
            return setImmediate(callback)
        }

        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }

        if (!this.queue.length) {
            return setImmediate(callback)
        }

        const items = this.queue.splice(0, this.flushAt)
        const callbacks = items.map((item) => item.callback)
        const messages = items.map((item) => item.message)

        const data = {
            api_key: this.apiKey,
            batch: messages,
        }

        const done = (err) => {
            callbacks.forEach((callback) => callback(err))
            callback(err, data)
        }

        // Don't set the user agent if we're not on a browser. The latest spec allows
        // the User-Agent header (see https://fetch.spec.whatwg.org/#terminology-headers
        // and https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader),
        // but browsers such as Chrome and Safari have not caught up.
        const headers = {}
        if (typeof window === 'undefined') {
            headers['user-agent'] = `posthog-node/${version}`
        }

        const req = {
            method: 'POST',
            url: `${this.host}/batch/`,
            data,
            headers,
        }

        if (this.timeout) {
            req.timeout = typeof this.timeout === 'string' ? ms(this.timeout) : this.timeout
        }

        axios(req)
            .then(() => done())
            .catch((err) => {
                if (err.response) {
                    const error = new Error(err.response.statusText)
                    return done(error)
                }

                done(err)
            })
    }

    shutdown() {
        if (this.personalApiKey) {
            this.featureFlagsPoller.stopPoller()
        }
        this.flush()
    }

    _isErrorRetryable(error) {
        // Retry Network Errors.
        if (axiosRetry.isNetworkError(error)) {
            return true
        }

        if (!error.response) {
            // Cannot determine if the request can be retried
            return false
        }

        // Retry Server Errors (5xx).
        if (error.response.status >= 500 && error.response.status <= 599) {
            return true
        }

        // Retry if rate limited.
        if (error.response.status === 429) {
            return true
        }

        return false
    }
}

module.exports = PostHog
