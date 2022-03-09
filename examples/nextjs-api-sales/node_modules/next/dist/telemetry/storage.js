"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _conf = _interopRequireDefault(require("next/dist/compiled/conf"));
var _crypto = require("crypto");
var _isDocker = _interopRequireDefault(require("next/dist/compiled/is-docker"));
var _path = _interopRequireDefault(require("path"));
var _anonymousMeta = require("./anonymous-meta");
var ciEnvironment = _interopRequireWildcard(require("./ci-info"));
var _postPayload = require("./post-payload");
var _projectId = require("./project-id");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
// This is the key that stores whether or not telemetry is enabled or disabled.
const TELEMETRY_KEY_ENABLED = 'telemetry.enabled';
// This is the key that specifies when the user was informed about anonymous
// telemetry collection.
const TELEMETRY_KEY_NOTIFY_DATE = 'telemetry.notifiedAt';
// This is a quasi-persistent identifier used to dedupe recurring events. It's
// generated from random data and completely anonymous.
const TELEMETRY_KEY_ID = `telemetry.anonymousId`;
// This is the cryptographic salt that is included within every hashed value.
// This salt value is never sent to us, ensuring privacy and the one-way nature
// of the hash (prevents dictionary lookups of pre-computed hashes).
// See the `oneWayHash` function.
const TELEMETRY_KEY_SALT = `telemetry.salt`;
class Telemetry {
    constructor({ distDir  }){
        this.notify = ()=>{
            if (this.isDisabled || !this.conf) {
                return;
            }
            // The end-user has already been notified about our telemetry integration. We
            // don't need to constantly annoy them about it.
            // We will re-inform users about the telemetry if significant changes are
            // ever made.
            if (this.conf.get(TELEMETRY_KEY_NOTIFY_DATE, '')) {
                return;
            }
            this.conf.set(TELEMETRY_KEY_NOTIFY_DATE, Date.now().toString());
            console.log(`${_chalk.default.magenta.bold('Attention')}: Next.js now collects completely anonymous telemetry regarding usage.`);
            console.log(`This information is used to shape Next.js' roadmap and prioritize features.`);
            console.log(`You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:`);
            console.log(_chalk.default.cyan('https://nextjs.org/telemetry'));
            console.log();
        };
        this.setEnabled = (_enabled)=>{
            const enabled = !!_enabled;
            this.conf && this.conf.set(TELEMETRY_KEY_ENABLED, enabled);
            return this.conf && this.conf.path;
        };
        this.oneWayHash = (payload)=>{
            const hash = (0, _crypto).createHash('sha256');
            // Always prepend the payload value with salt. This ensures the hash is truly
            // one-way.
            hash.update(this.salt);
            // Update is an append operation, not a replacement. The salt from the prior
            // update is still present!
            hash.update(payload);
            return hash.digest('hex');
        };
        this.record = (_events)=>{
            const _this = this;
            // pseudo try-catch
            async function wrapper() {
                return await _this.submitRecord(_events);
            }
            const prom = wrapper().then((value)=>({
                    isFulfilled: true,
                    isRejected: false,
                    value
                })
            ).catch((reason)=>({
                    isFulfilled: false,
                    isRejected: true,
                    reason
                })
            )// Acts as `Promise#finally` because `catch` transforms the error
            .then((res)=>{
                // Clean up the event to prevent unbounded `Set` growth
                this.queue.delete(prom);
                return res;
            });
            // Track this `Promise` so we can flush pending events
            this.queue.add(prom);
            return prom;
        };
        this.flush = async ()=>Promise.all(this.queue).catch(()=>null
            )
        ;
        this.submitRecord = (_events)=>{
            let events;
            if (Array.isArray(_events)) {
                events = _events;
            } else {
                events = [
                    _events
                ];
            }
            if (events.length < 1) {
                return Promise.resolve();
            }
            if (this.NEXT_TELEMETRY_DEBUG) {
                // Print to standard error to simplify selecting the output
                events.forEach(({ eventName , payload  })=>console.error(`[telemetry] ` + JSON.stringify({
                        eventName,
                        payload
                    }, null, 2))
                );
                // Do not send the telemetry data if debugging. Users may use this feature
                // to preview what data would be sent.
                return Promise.resolve();
            }
            // Skip recording telemetry if the feature is disabled
            if (this.isDisabled) {
                return Promise.resolve();
            }
            const context = {
                anonymousId: this.anonymousId,
                projectId: this.projectId,
                sessionId: this.sessionId
            };
            const meta = (0, _anonymousMeta).getAnonymousMeta();
            return (0, _postPayload)._postPayload(`https://telemetry.nextjs.org/api/v1/record`, {
                context,
                meta,
                events: events.map(({ eventName , payload  })=>({
                        eventName,
                        fields: payload
                    })
                )
            });
        };
        // Read in the constructor so that .env can be loaded before reading
        const { NEXT_TELEMETRY_DISABLED , NEXT_TELEMETRY_DEBUG  } = process.env;
        this.NEXT_TELEMETRY_DISABLED = NEXT_TELEMETRY_DISABLED;
        this.NEXT_TELEMETRY_DEBUG = NEXT_TELEMETRY_DEBUG;
        const storageDirectory = getStorageDirectory(distDir);
        try {
            // `conf` incorrectly throws a permission error during initialization
            // instead of waiting for first use. We need to handle it, otherwise the
            // process may crash.
            this.conf = new _conf.default({
                projectName: 'nextjs',
                cwd: storageDirectory
            });
        } catch (_) {
            this.conf = null;
        }
        this.sessionId = (0, _crypto).randomBytes(32).toString('hex');
        this.rawProjectId = (0, _projectId).getRawProjectId();
        this.queue = new Set();
        this.notify();
    }
    get anonymousId() {
        const val = this.conf && this.conf.get(TELEMETRY_KEY_ID);
        if (val) {
            return val;
        }
        const generated = (0, _crypto).randomBytes(32).toString('hex');
        this.conf && this.conf.set(TELEMETRY_KEY_ID, generated);
        return generated;
    }
    get salt() {
        const val = this.conf && this.conf.get(TELEMETRY_KEY_SALT);
        if (val) {
            return val;
        }
        const generated = (0, _crypto).randomBytes(16).toString('hex');
        this.conf && this.conf.set(TELEMETRY_KEY_SALT, generated);
        return generated;
    }
    get isDisabled() {
        if (!!this.NEXT_TELEMETRY_DISABLED || !this.conf) {
            return true;
        }
        return this.conf.get(TELEMETRY_KEY_ENABLED, true) === false;
    }
    get isEnabled() {
        return !!this.conf && this.conf.get(TELEMETRY_KEY_ENABLED, true) !== false;
    }
    get projectId() {
        return this.oneWayHash(this.rawProjectId);
    }
}
exports.Telemetry = Telemetry;
function getStorageDirectory(distDir) {
    const isLikelyEphemeral = ciEnvironment.isCI || (0, _isDocker).default();
    if (isLikelyEphemeral) {
        return _path.default.join(distDir, 'cache');
    }
    return undefined;
}

//# sourceMappingURL=storage.js.map