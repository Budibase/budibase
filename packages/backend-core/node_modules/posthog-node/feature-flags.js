const axios = require('axios')
const crypto = require('crypto')
const ms = require('ms')
const version = require('./package.json').version

const LONG_SCALE = 0xfffffffffffffff

class ClientError extends Error {
    constructor(message, extra) {
        super()
        Error.captureStackTrace(this, this.constructor)
        this.name = 'ClientError'
        this.message = message
        if (extra) {
            this.extra = extra
        }
    }
}

class FeatureFlagsPoller {
    constructor({ pollingInterval, personalApiKey, projectApiKey, timeout, host, featureFlagCalledCallback }) {
        this.pollingInterval = pollingInterval
        this.personalApiKey = personalApiKey
        this.featureFlags = []
        this.loadedSuccessfullyOnce = false
        this.timeout = timeout
        this.projectApiKey = projectApiKey
        this.featureFlagCalledCallback = featureFlagCalledCallback
        this.host = host
        this.poller = null

        void this.loadFeatureFlags()
    }

    async isFeatureEnabled(key, distinctId, defaultResult = false, groups = {}) {
        await this.loadFeatureFlags()

        if (!this.loadedSuccessfullyOnce) {
            return defaultResult
        }

        let featureFlag = null

        for (const flag of this.featureFlags) {
            if (key === flag.key) {
                featureFlag = flag
                break
            }
        }

        if (!featureFlag) {
            return defaultResult
        }

        let isFlagEnabledResponse

        if (featureFlag.is_simple_flag) {
            isFlagEnabledResponse = this._isSimpleFlagEnabled({
                key,
                distinctId,
                rolloutPercentage: featureFlag.rolloutPercentage,
            })
        } else {
            const res = await this._request({ path: 'decide', method: 'POST', data: { groups, distinct_id: distinctId } })
            isFlagEnabledResponse = res.data.featureFlags.indexOf(key) >= 0
        }

        this.featureFlagCalledCallback(key, distinctId, isFlagEnabledResponse)
        return isFlagEnabledResponse
    }

    async loadFeatureFlags(forceReload = false) {
        if (!this.loadedSuccessfullyOnce || forceReload) {
            await this._loadFeatureFlags()
        }
    }

    /* istanbul ignore next */
    async _loadFeatureFlags() {
        if (this.poller) {
            clearTimeout(this.poller)
            this.poller = null
        }
        this.poller = setTimeout(() => this._loadFeatureFlags(), this.pollingInterval)

        try {
            const res = await this._request({ path: 'api/feature_flag', usePersonalApiKey: true })
            if (res && res.status === 401) {
                throw new ClientError(
                    `Your personalApiKey is invalid. Are you sure you're not using your Project API key? More information: https://posthog.com/docs/api/overview`
                )
            }

            this.featureFlags = res.data.results.filter(flag => flag.active)

            this.loadedSuccessfullyOnce = true
        } catch (err) {
            // if an error that is not an instance of ClientError is thrown
            // we silently ignore the error when reloading feature flags
            if (err instanceof ClientError) {
                throw err
            }
        }
    }

    // sha1('a.b') should equal '69f6642c9d71b463485b4faf4e989dc3fe77a8c6'
    // integerRepresentationOfHashSubset / LONG_SCALE for sha1('a.b') should equal 0.4139158829615955
    _isSimpleFlagEnabled({ key, distinctId, rolloutPercentage }) {
        if (!rolloutPercentage) {
            return true
        }
        const sha1Hash = crypto.createHash('sha1')
        sha1Hash.update(`${key}.${distinctId}`)
        const integerRepresentationOfHashSubset = parseInt(sha1Hash.digest('hex').slice(0, 15), 16)
        return integerRepresentationOfHashSubset / LONG_SCALE <= rolloutPercentage / 100
    }

    /* istanbul ignore next */
    async _request({ path, method = 'GET', usePersonalApiKey = false, data = {} }) {
        let url = `${this.host}/${path}/`
        let headers = {
            'Content-Type': 'application/json',
        }

        if (usePersonalApiKey) {
            headers = { ...headers, Authorization: `Bearer ${this.personalApiKey}` }
            url = url + `?token=${this.projectApiKey}`
        } else {
            data = { ...data, token: this.projectApiKey }
        }

        if (typeof window === 'undefined') {
            headers['user-agent'] = `posthog-node/${version}`
        }

        const req = {
            method: method,
            url: url,
            headers: headers,
            data: JSON.stringify(data),
        }

        if (this.timeout) {
            req.timeout = typeof this.timeout === 'string' ? ms(this.timeout) : this.timeout
        }


        let res
        try {
            res = await axios.request(req)
        } catch (err) {
            throw new Error(`Request to ${path} failed with error: ${err.message}`)
        }

        return res
    }

    stopPoller() {
        clearTimeout(this.poller)
    }
}

module.exports = {
    FeatureFlagsPoller,
}
