import {Credentials} from '../credentials';
import {AWSError} from '../error';
import STS = require('../../clients/sts');

export class ChainableTemporaryCredentials extends Credentials {
    constructor(options: ChainableTemporaryCredentials.ChainableTemporaryCredentialsOptions);
    /**
     * Creates a new temporary credentials object.
     */
    constructor(options?: ChainableTemporaryCredentials.ChainableTemporaryCredentialsOptions);
    /**
     * Refreshes credentials using AWS.STS.assumeRole() or AWS.STS.getSessionToken(), depending on whether an IAM role ARN was passed to the credentials constructor().
     */
    refresh(callback: (err: AWSError) => void): void;

    /**
     * The STS service instance used to get and refresh temporary credentials from AWS STS.
     */
    readonly service: STS
}

// Needed to expose interfaces on the class
declare namespace ChainableTemporaryCredentials {
    export type ChainableTemporaryCredentialsOptions = {
        params?: STS.Types.AssumeRoleRequest|STS.Types.GetSessionTokenRequest,
        masterCredentials?: Credentials,
        stsConfig?: STS.Types.ClientConfiguration,
        tokenCodeFn?: (serialNumber: string, callback: (err?: Error, token?: string) => void) => void
    }
}
