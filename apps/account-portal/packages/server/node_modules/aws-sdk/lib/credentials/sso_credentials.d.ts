import {Credentials} from '../credentials';
import SSO = require('../../clients/sso');
import { HTTPOptions } from '../config-base';
export class SsoCredentials extends Credentials {
    /**
     * Creates a new SsoCredentials object.
     */
    constructor(options?: SsoCredentialsOptions);
}

interface SsoCredentialsOptions {
    httpOptions?: HTTPOptions,
    profile?: string;
    filename?: string;
    ssoClient?: SSO;
}
