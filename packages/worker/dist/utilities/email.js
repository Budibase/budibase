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
const nodemailer = require("nodemailer");
const env = require("../environment");
const { getScopedConfig } = require("@budibase/backend-core/db");
const { EmailTemplatePurpose, TemplateTypes, Configs } = require("../constants");
const { getTemplateByPurpose } = require("../constants/templates");
const { getSettingsTemplateContext } = require("./templates");
const { processString } = require("@budibase/string-templates");
const { getResetPasswordCode, getInviteCode } = require("../utilities/redis");
const { getGlobalDB } = require("@budibase/backend-core/tenancy");
const TEST_MODE = false;
const TYPE = TemplateTypes.EMAIL;
const FULL_EMAIL_PURPOSES = [
    EmailTemplatePurpose.INVITATION,
    EmailTemplatePurpose.PASSWORD_RECOVERY,
    EmailTemplatePurpose.WELCOME,
    EmailTemplatePurpose.CUSTOM,
];
function createSMTPTransport(config) {
    let options;
    let secure = config.secure;
    // default it if not specified
    if (secure == null) {
        secure = config.port === 465;
    }
    if (!TEST_MODE) {
        options = {
            port: config.port,
            host: config.host,
            secure: secure,
            auth: config.auth,
        };
        options.tls = {
            rejectUnauthorized: false,
        };
        if (config.connectionTimeout) {
            options.connectionTimeout = config.connectionTimeout;
        }
    }
    else {
        options = {
            port: 587,
            host: "smtp.ethereal.email",
            secure: false,
            auth: {
                user: "don.bahringer@ethereal.email",
                pass: "yCKSH8rWyUPbnhGYk9",
            },
        };
    }
    return nodemailer.createTransport(options);
}
function getLinkCode(purpose, email, user, info = null) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (purpose) {
            case EmailTemplatePurpose.PASSWORD_RECOVERY:
                return getResetPasswordCode(user._id, info);
            case EmailTemplatePurpose.INVITATION:
                return getInviteCode(email, info);
            default:
                return null;
        }
    });
}
/**
 * Builds an email using handlebars and the templates found in the system (default or otherwise).
 * @param {string} purpose the purpose of the email being built, e.g. invitation, password reset.
 * @param {string} email the address which it is being sent to for contextual purposes.
 * @param {object} context the context which is being used for building the email (hbs context).
 * @param {object|null} user if being sent to an existing user then the object can be provided for context.
 * @param {string|null} contents if using a custom template can supply contents for context.
 * @return {Promise<string>} returns the built email HTML if all provided parameters were valid.
 */
function buildEmail(purpose, email, context, { user, contents } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // this isn't a full email
        if (FULL_EMAIL_PURPOSES.indexOf(purpose) === -1) {
            throw `Unable to build an email of type ${purpose}`;
        }
        let [base, body] = yield Promise.all([
            getTemplateByPurpose(TYPE, EmailTemplatePurpose.BASE),
            getTemplateByPurpose(TYPE, purpose),
        ]);
        if (!base || !body) {
            throw "Unable to build email, missing base components";
        }
        base = base.contents;
        body = body.contents;
        let name = user ? user.name : undefined;
        if (user && !name && user.firstName) {
            name = user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
        }
        context = Object.assign(Object.assign({}, context), { contents,
            email,
            name, user: user || {} });
        body = yield processString(body, context);
        // this should now be the complete email HTML
        return processString(base, Object.assign(Object.assign({}, context), { body }));
    });
}
/**
 * Utility function for finding most valid SMTP configuration.
 * @param {object} db The CouchDB database which is to be looked up within.
 * @param {string|null} workspaceId If using finer grain control of configs a workspace can be used.
 * @param {boolean|null} automation Whether or not the configuration is being fetched for an email automation.
 * @return {Promise<object|null>} returns the SMTP configuration if it exists
 */
function getSmtpConfiguration(db, workspaceId = null, automation) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            type: Configs.SMTP,
        };
        if (workspaceId) {
            params.workspace = workspaceId;
        }
        const customConfig = yield getScopedConfig(db, params);
        if (customConfig) {
            return customConfig;
        }
        // Use an SMTP fallback configuration from env variables
        if (!automation && env.SMTP_FALLBACK_ENABLED) {
            return {
                port: env.SMTP_PORT,
                host: env.SMTP_HOST,
                secure: false,
                from: env.SMTP_FROM_ADDRESS,
                auth: {
                    user: env.SMTP_USER,
                    pass: env.SMTP_PASSWORD,
                },
            };
        }
    });
}
/**
 * Checks if a SMTP config exists based on passed in parameters.
 * @return {Promise<boolean>} returns true if there is a configuration that can be used.
 */
exports.isEmailConfigured = (workspaceId = null) => __awaiter(void 0, void 0, void 0, function* () {
    // when "testing" or smtp fallback is enabled simply return true
    if (TEST_MODE || env.SMTP_FALLBACK_ENABLED) {
        return true;
    }
    const db = getGlobalDB();
    const config = yield getSmtpConfiguration(db, workspaceId);
    return config != null;
});
/**
 * Given an email address and an email purpose this will retrieve the SMTP configuration and
 * send an email using it.
 * @param {string} email The email address to send to.
 * @param {string} purpose The purpose of the email being sent (e.g. reset password).
 * @param {string|undefined} workspaceId If finer grain controls being used then this will lookup config for workspace.
 * @param {object|undefined} user If sending to an existing user the object can be provided, this is used in the context.
 * @param {string|undefined} from If sending from an address that is not what is configured in the SMTP config.
 * @param {string|undefined} contents If sending a custom email then can supply contents which will be added to it.
 * @param {string|undefined} subject A custom subject can be specified if the config one is not desired.
 * @param {object|undefined} info Pass in a structure of information to be stored alongside the invitation.
 * @param {boolean|undefined} disableFallback Prevent email being sent from SMTP fallback to avoid spam.
 * @return {Promise<object>} returns details about the attempt to send email, e.g. if it is successful; based on
 * nodemailer response.
 */
exports.sendEmail = (email, purpose, { workspaceId, user, from, contents, subject, info, automation } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const db = getGlobalDB();
    let config = (yield getSmtpConfiguration(db, workspaceId, automation)) || {};
    if (Object.keys(config).length === 0 && !TEST_MODE) {
        throw "Unable to find SMTP configuration.";
    }
    const transport = createSMTPTransport(config);
    // if there is a link code needed this will retrieve it
    const code = yield getLinkCode(purpose, email, user, info);
    const context = yield getSettingsTemplateContext(purpose, code);
    let message = {
        from: from || config.from,
        html: yield buildEmail(purpose, email, context, {
            user,
            contents,
        }),
    };
    message = Object.assign(Object.assign({}, message), { to: email });
    if (subject || config.subject) {
        message.subject = yield processString(subject || config.subject, context);
    }
    const response = yield transport.sendMail(message);
    if (TEST_MODE) {
        console.log("Test email URL: " + nodemailer.getTestMessageUrl(response));
    }
    return response;
});
/**
 * Given an SMTP configuration this runs it through nodemailer to see if it is in fact functional.
 * @param {object} config an SMTP configuration - this is based on the nodemailer API.
 * @return {Promise<boolean>} returns true if the configuration is valid.
 */
exports.verifyConfig = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = createSMTPTransport(config);
    yield transport.verify();
});
