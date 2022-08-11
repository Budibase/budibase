"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = exports.endSession = exports.updateSessionTTL = exports.createASession = exports.invalidateSessions = exports.getSessionsForUser = void 0;
const redis = require("../redis/init");
const { v4: uuidv4 } = require("uuid");
const { logWarn } = require("../logging");
const env = require("../environment");
// a week in seconds
const EXPIRY_SECONDS = 86400 * 7;
function makeSessionID(userId, sessionId) {
    return `${userId}/${sessionId}`;
}
function getSessionsForUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId) {
            console.trace("Cannot get sessions for undefined userId");
            return [];
        }
        const client = yield redis.getSessionClient();
        const sessions = yield client.scan(userId);
        return sessions.map((session) => session.value);
    });
}
exports.getSessionsForUser = getSessionsForUser;
function invalidateSessions(userId, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reason = (opts === null || opts === void 0 ? void 0 : opts.reason) || "unknown";
            let sessionIds = opts.sessionIds || [];
            let sessions;
            // If no sessionIds, get all the sessions for the user
            if (sessionIds.length === 0) {
                sessions = yield getSessionsForUser(userId);
                sessions.forEach((session) => (session.key = makeSessionID(session.userId, session.sessionId)));
            }
            else {
                // use the passed array of sessionIds
                sessionIds = Array.isArray(sessionIds) ? sessionIds : [sessionIds];
                sessions = sessionIds.map((sessionId) => ({
                    key: makeSessionID(userId, sessionId),
                }));
            }
            if (sessions && sessions.length > 0) {
                const client = yield redis.getSessionClient();
                const promises = [];
                for (let session of sessions) {
                    promises.push(client.delete(session.key));
                }
                if (!env.isTest()) {
                    logWarn(`Invalidating sessions for ${userId} (reason: ${reason}) - ${sessions
                        .map(session => session.key)
                        .join(", ")}`);
                }
                yield Promise.all(promises);
            }
        }
        catch (err) {
            console.error(`Error invalidating sessions: ${err}`);
        }
    });
}
exports.invalidateSessions = invalidateSessions;
function createASession(userId, session) {
    return __awaiter(this, void 0, void 0, function* () {
        // invalidate all other sessions
        yield invalidateSessions(userId, { reason: "creation" });
        const client = yield redis.getSessionClient();
        const sessionId = session.sessionId;
        if (!session.csrfToken) {
            session.csrfToken = uuidv4();
        }
        session = Object.assign(Object.assign({}, session), { createdAt: new Date().toISOString(), lastAccessedAt: new Date().toISOString(), userId });
        yield client.store(makeSessionID(userId, sessionId), session, EXPIRY_SECONDS);
    });
}
exports.createASession = createASession;
function updateSessionTTL(session) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield redis.getSessionClient();
        const key = makeSessionID(session.userId, session.sessionId);
        session.lastAccessedAt = new Date().toISOString();
        yield client.store(key, session, EXPIRY_SECONDS);
    });
}
exports.updateSessionTTL = updateSessionTTL;
function endSession(userId, sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield redis.getSessionClient();
        yield client.delete(makeSessionID(userId, sessionId));
    });
}
exports.endSession = endSession;
function getSession(userId, sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId || !sessionId) {
            throw new Error(`Invalid session details - ${userId} - ${sessionId}`);
        }
        const client = yield redis.getSessionClient();
        const session = yield client.get(makeSessionID(userId, sessionId));
        if (!session) {
            throw new Error(`Session not found - ${userId} - ${sessionId}`);
        }
        return session;
    });
}
exports.getSession = getSession;
//# sourceMappingURL=sessions.js.map