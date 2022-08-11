import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SSOOIDC extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SSOOIDC.Types.ClientConfiguration)
  config: Config & SSOOIDC.Types.ClientConfiguration;
  /**
   * Creates and returns an access token for the authorized client. The access token issued will be used to fetch short-term credentials for the assigned roles in the AWS account.
   */
  createToken(params: SSOOIDC.Types.CreateTokenRequest, callback?: (err: AWSError, data: SSOOIDC.Types.CreateTokenResponse) => void): Request<SSOOIDC.Types.CreateTokenResponse, AWSError>;
  /**
   * Creates and returns an access token for the authorized client. The access token issued will be used to fetch short-term credentials for the assigned roles in the AWS account.
   */
  createToken(callback?: (err: AWSError, data: SSOOIDC.Types.CreateTokenResponse) => void): Request<SSOOIDC.Types.CreateTokenResponse, AWSError>;
  /**
   * Registers a client with AWS SSO. This allows clients to initiate device authorization. The output should be persisted for reuse through many authentication requests.
   */
  registerClient(params: SSOOIDC.Types.RegisterClientRequest, callback?: (err: AWSError, data: SSOOIDC.Types.RegisterClientResponse) => void): Request<SSOOIDC.Types.RegisterClientResponse, AWSError>;
  /**
   * Registers a client with AWS SSO. This allows clients to initiate device authorization. The output should be persisted for reuse through many authentication requests.
   */
  registerClient(callback?: (err: AWSError, data: SSOOIDC.Types.RegisterClientResponse) => void): Request<SSOOIDC.Types.RegisterClientResponse, AWSError>;
  /**
   * Initiates device authorization by requesting a pair of verification codes from the authorization service.
   */
  startDeviceAuthorization(params: SSOOIDC.Types.StartDeviceAuthorizationRequest, callback?: (err: AWSError, data: SSOOIDC.Types.StartDeviceAuthorizationResponse) => void): Request<SSOOIDC.Types.StartDeviceAuthorizationResponse, AWSError>;
  /**
   * Initiates device authorization by requesting a pair of verification codes from the authorization service.
   */
  startDeviceAuthorization(callback?: (err: AWSError, data: SSOOIDC.Types.StartDeviceAuthorizationResponse) => void): Request<SSOOIDC.Types.StartDeviceAuthorizationResponse, AWSError>;
}
declare namespace SSOOIDC {
  export type AccessToken = string;
  export type AuthCode = string;
  export type ClientId = string;
  export type ClientName = string;
  export type ClientSecret = string;
  export type ClientType = string;
  export interface CreateTokenRequest {
    /**
     * The unique identifier string for each client. This value should come from the persisted result of the RegisterClient API.
     */
    clientId: ClientId;
    /**
     * A secret string generated for the client. This value should come from the persisted result of the RegisterClient API.
     */
    clientSecret: ClientSecret;
    /**
     * Supports grant types for authorization code, refresh token, and device code request.
     */
    grantType: GrantType;
    /**
     * Used only when calling this API for the device code grant type. This short-term code is used to identify this authentication attempt. This should come from an in-memory reference to the result of the StartDeviceAuthorization API.
     */
    deviceCode: DeviceCode;
    /**
     * The authorization code received from the authorization service. This parameter is required to perform an authorization grant request to get access to a token.
     */
    code?: AuthCode;
    /**
     * The token used to obtain an access token in the event that the access token is invalid or expired. This token is not issued by the service.
     */
    refreshToken?: RefreshToken;
    /**
     * The list of scopes that is defined by the client. Upon authorization, this list is used to restrict permissions when granting an access token.
     */
    scope?: Scopes;
    /**
     * The location of the application that will receive the authorization code. Users authorize the service to send the request to this location.
     */
    redirectUri?: URI;
  }
  export interface CreateTokenResponse {
    /**
     * An opaque token to access AWS SSO resources assigned to a user.
     */
    accessToken?: AccessToken;
    /**
     * Used to notify the client that the returned token is an access token. The supported type is BearerToken.
     */
    tokenType?: TokenType;
    /**
     * Indicates the time in seconds when an access token will expire.
     */
    expiresIn?: ExpirationInSeconds;
    /**
     * A token that, if present, can be used to refresh a previously issued access token that might have expired.
     */
    refreshToken?: RefreshToken;
    /**
     * The identifier of the user that associated with the access token, if present.
     */
    idToken?: IdToken;
  }
  export type DeviceCode = string;
  export type ExpirationInSeconds = number;
  export type GrantType = string;
  export type IdToken = string;
  export type IntervalInSeconds = number;
  export type LongTimeStampType = number;
  export type RefreshToken = string;
  export interface RegisterClientRequest {
    /**
     * The friendly name of the client.
     */
    clientName: ClientName;
    /**
     * The type of client. The service supports only public as a client type. Anything other than public will be rejected by the service.
     */
    clientType: ClientType;
    /**
     * The list of scopes that are defined by the client. Upon authorization, this list is used to restrict permissions when granting an access token.
     */
    scopes?: Scopes;
  }
  export interface RegisterClientResponse {
    /**
     * The unique identifier string for each client. This client uses this identifier to get authenticated by the service in subsequent calls.
     */
    clientId?: ClientId;
    /**
     * A secret string generated for the client. The client will use this string to get authenticated by the service in subsequent calls.
     */
    clientSecret?: ClientSecret;
    /**
     * Indicates the time at which the clientId and clientSecret were issued.
     */
    clientIdIssuedAt?: LongTimeStampType;
    /**
     * Indicates the time at which the clientId and clientSecret will become invalid.
     */
    clientSecretExpiresAt?: LongTimeStampType;
    /**
     * The endpoint where the client can request authorization.
     */
    authorizationEndpoint?: URI;
    /**
     * The endpoint where the client can get an access token.
     */
    tokenEndpoint?: URI;
  }
  export type Scope = string;
  export type Scopes = Scope[];
  export interface StartDeviceAuthorizationRequest {
    /**
     * The unique identifier string for the client that is registered with AWS SSO. This value should come from the persisted result of the RegisterClient API operation.
     */
    clientId: ClientId;
    /**
     * A secret string that is generated for the client. This value should come from the persisted result of the RegisterClient API operation.
     */
    clientSecret: ClientSecret;
    /**
     * The URL for the AWS SSO user portal. For more information, see Using the User Portal in the AWS Single Sign-On User Guide.
     */
    startUrl: URI;
  }
  export interface StartDeviceAuthorizationResponse {
    /**
     * The short-lived code that is used by the device when polling for a session token.
     */
    deviceCode?: DeviceCode;
    /**
     * A one-time user verification code. This is needed to authorize an in-use device.
     */
    userCode?: UserCode;
    /**
     * The URI of the verification page that takes the userCode to authorize the device.
     */
    verificationUri?: URI;
    /**
     * An alternate URL that the client can use to automatically launch a browser. This process skips the manual step in which the user visits the verification page and enters their code.
     */
    verificationUriComplete?: URI;
    /**
     * Indicates the number of seconds in which the verification code will become invalid.
     */
    expiresIn?: ExpirationInSeconds;
    /**
     * Indicates the number of seconds the client must wait between attempts when polling for a session.
     */
    interval?: IntervalInSeconds;
  }
  export type TokenType = string;
  export type URI = string;
  export type UserCode = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-06-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SSOOIDC client.
   */
  export import Types = SSOOIDC;
}
export = SSOOIDC;
