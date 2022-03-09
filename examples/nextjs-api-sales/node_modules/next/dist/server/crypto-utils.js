"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encryptWithSecret = encryptWithSecret;
exports.decryptWithSecret = decryptWithSecret;
var _crypto = _interopRequireDefault(require("crypto"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Background:
// https://security.stackexchange.com/questions/184305/why-would-i-ever-use-aes-256-cbc-if-aes-256-gcm-is-more-secure
const CIPHER_ALGORITHM = `aes-256-gcm`, CIPHER_KEY_LENGTH = 32, CIPHER_IV_LENGTH = 16, CIPHER_TAG_LENGTH = 16, CIPHER_SALT_LENGTH = 64;
const PBKDF2_ITERATIONS = 100000 // https://support.1password.com/pbkdf2/
;
function encryptWithSecret(secret, data) {
    const iv = _crypto.default.randomBytes(CIPHER_IV_LENGTH);
    const salt = _crypto.default.randomBytes(CIPHER_SALT_LENGTH);
    // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
    const key = _crypto.default.pbkdf2Sync(secret, salt, PBKDF2_ITERATIONS, CIPHER_KEY_LENGTH, `sha512`);
    const cipher = _crypto.default.createCipheriv(CIPHER_ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
        cipher.update(data, `utf8`),
        cipher.final()
    ]);
    // https://nodejs.org/api/crypto.html#crypto_cipher_getauthtag
    const tag = cipher.getAuthTag();
    return Buffer.concat([
        // Data as required by:
        // Salt for Key: https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
        // IV: https://nodejs.org/api/crypto.html#crypto_class_decipher
        // Tag: https://nodejs.org/api/crypto.html#crypto_decipher_setauthtag_buffer
        salt,
        iv,
        tag,
        encrypted, 
    ]).toString(`hex`);
}
function decryptWithSecret(secret, encryptedData) {
    const buffer = Buffer.from(encryptedData, `hex`);
    const salt = buffer.slice(0, CIPHER_SALT_LENGTH);
    const iv = buffer.slice(CIPHER_SALT_LENGTH, CIPHER_SALT_LENGTH + CIPHER_IV_LENGTH);
    const tag = buffer.slice(CIPHER_SALT_LENGTH + CIPHER_IV_LENGTH, CIPHER_SALT_LENGTH + CIPHER_IV_LENGTH + CIPHER_TAG_LENGTH);
    const encrypted = buffer.slice(CIPHER_SALT_LENGTH + CIPHER_IV_LENGTH + CIPHER_TAG_LENGTH);
    // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
    const key = _crypto.default.pbkdf2Sync(secret, salt, PBKDF2_ITERATIONS, CIPHER_KEY_LENGTH, `sha512`);
    const decipher = _crypto.default.createDecipheriv(CIPHER_ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(encrypted) + decipher.final(`utf8`);
}

//# sourceMappingURL=crypto-utils.js.map