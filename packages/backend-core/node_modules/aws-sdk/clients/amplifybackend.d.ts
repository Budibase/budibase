import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AmplifyBackend extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AmplifyBackend.Types.ClientConfiguration)
  config: Config & AmplifyBackend.Types.ClientConfiguration;
  /**
   * This operation clones an existing backend.
   */
  cloneBackend(params: AmplifyBackend.Types.CloneBackendRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.CloneBackendResponse) => void): Request<AmplifyBackend.Types.CloneBackendResponse, AWSError>;
  /**
   * This operation clones an existing backend.
   */
  cloneBackend(callback?: (err: AWSError, data: AmplifyBackend.Types.CloneBackendResponse) => void): Request<AmplifyBackend.Types.CloneBackendResponse, AWSError>;
  /**
   * This operation creates a backend for an Amplify app. Backends are automatically created at the time of app creation.
   */
  createBackend(params: AmplifyBackend.Types.CreateBackendRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.CreateBackendResponse) => void): Request<AmplifyBackend.Types.CreateBackendResponse, AWSError>;
  /**
   * This operation creates a backend for an Amplify app. Backends are automatically created at the time of app creation.
   */
  createBackend(callback?: (err: AWSError, data: AmplifyBackend.Types.CreateBackendResponse) => void): Request<AmplifyBackend.Types.CreateBackendResponse, AWSError>;
  /**
   * Creates a new backend API resource.
   */
  createBackendAPI(params: AmplifyBackend.Types.CreateBackendAPIRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.CreateBackendAPIResponse) => void): Request<AmplifyBackend.Types.CreateBackendAPIResponse, AWSError>;
  /**
   * Creates a new backend API resource.
   */
  createBackendAPI(callback?: (err: AWSError, data: AmplifyBackend.Types.CreateBackendAPIResponse) => void): Request<AmplifyBackend.Types.CreateBackendAPIResponse, AWSError>;
  /**
   * Creates a new backend authentication resource.
   */
  createBackendAuth(params: AmplifyBackend.Types.CreateBackendAuthRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.CreateBackendAuthResponse) => void): Request<AmplifyBackend.Types.CreateBackendAuthResponse, AWSError>;
  /**
   * Creates a new backend authentication resource.
   */
  createBackendAuth(callback?: (err: AWSError, data: AmplifyBackend.Types.CreateBackendAuthResponse) => void): Request<AmplifyBackend.Types.CreateBackendAuthResponse, AWSError>;
  /**
   * Creates a config object for a backend.
   */
  createBackendConfig(params: AmplifyBackend.Types.CreateBackendConfigRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.CreateBackendConfigResponse) => void): Request<AmplifyBackend.Types.CreateBackendConfigResponse, AWSError>;
  /**
   * Creates a config object for a backend.
   */
  createBackendConfig(callback?: (err: AWSError, data: AmplifyBackend.Types.CreateBackendConfigResponse) => void): Request<AmplifyBackend.Types.CreateBackendConfigResponse, AWSError>;
  /**
   * Generates a one-time challenge code to authenticate a user into your Amplify Admin UI.
   */
  createToken(params: AmplifyBackend.Types.CreateTokenRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.CreateTokenResponse) => void): Request<AmplifyBackend.Types.CreateTokenResponse, AWSError>;
  /**
   * Generates a one-time challenge code to authenticate a user into your Amplify Admin UI.
   */
  createToken(callback?: (err: AWSError, data: AmplifyBackend.Types.CreateTokenResponse) => void): Request<AmplifyBackend.Types.CreateTokenResponse, AWSError>;
  /**
   * Removes an existing environment from your Amplify project.
   */
  deleteBackend(params: AmplifyBackend.Types.DeleteBackendRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.DeleteBackendResponse) => void): Request<AmplifyBackend.Types.DeleteBackendResponse, AWSError>;
  /**
   * Removes an existing environment from your Amplify project.
   */
  deleteBackend(callback?: (err: AWSError, data: AmplifyBackend.Types.DeleteBackendResponse) => void): Request<AmplifyBackend.Types.DeleteBackendResponse, AWSError>;
  /**
   * Deletes an existing backend API resource.
   */
  deleteBackendAPI(params: AmplifyBackend.Types.DeleteBackendAPIRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.DeleteBackendAPIResponse) => void): Request<AmplifyBackend.Types.DeleteBackendAPIResponse, AWSError>;
  /**
   * Deletes an existing backend API resource.
   */
  deleteBackendAPI(callback?: (err: AWSError, data: AmplifyBackend.Types.DeleteBackendAPIResponse) => void): Request<AmplifyBackend.Types.DeleteBackendAPIResponse, AWSError>;
  /**
   * Deletes an existing backend authentication resource.
   */
  deleteBackendAuth(params: AmplifyBackend.Types.DeleteBackendAuthRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.DeleteBackendAuthResponse) => void): Request<AmplifyBackend.Types.DeleteBackendAuthResponse, AWSError>;
  /**
   * Deletes an existing backend authentication resource.
   */
  deleteBackendAuth(callback?: (err: AWSError, data: AmplifyBackend.Types.DeleteBackendAuthResponse) => void): Request<AmplifyBackend.Types.DeleteBackendAuthResponse, AWSError>;
  /**
   * Deletes the challenge token based on the given appId and sessionId.
   */
  deleteToken(params: AmplifyBackend.Types.DeleteTokenRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.DeleteTokenResponse) => void): Request<AmplifyBackend.Types.DeleteTokenResponse, AWSError>;
  /**
   * Deletes the challenge token based on the given appId and sessionId.
   */
  deleteToken(callback?: (err: AWSError, data: AmplifyBackend.Types.DeleteTokenResponse) => void): Request<AmplifyBackend.Types.DeleteTokenResponse, AWSError>;
  /**
   * Generates a model schema for an existing backend API resource.
   */
  generateBackendAPIModels(params: AmplifyBackend.Types.GenerateBackendAPIModelsRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.GenerateBackendAPIModelsResponse) => void): Request<AmplifyBackend.Types.GenerateBackendAPIModelsResponse, AWSError>;
  /**
   * Generates a model schema for an existing backend API resource.
   */
  generateBackendAPIModels(callback?: (err: AWSError, data: AmplifyBackend.Types.GenerateBackendAPIModelsResponse) => void): Request<AmplifyBackend.Types.GenerateBackendAPIModelsResponse, AWSError>;
  /**
   * Provides project-level details for your Amplify UI project.
   */
  getBackend(params: AmplifyBackend.Types.GetBackendRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.GetBackendResponse) => void): Request<AmplifyBackend.Types.GetBackendResponse, AWSError>;
  /**
   * Provides project-level details for your Amplify UI project.
   */
  getBackend(callback?: (err: AWSError, data: AmplifyBackend.Types.GetBackendResponse) => void): Request<AmplifyBackend.Types.GetBackendResponse, AWSError>;
  /**
   * Gets the details for a backend API.
   */
  getBackendAPI(params: AmplifyBackend.Types.GetBackendAPIRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.GetBackendAPIResponse) => void): Request<AmplifyBackend.Types.GetBackendAPIResponse, AWSError>;
  /**
   * Gets the details for a backend API.
   */
  getBackendAPI(callback?: (err: AWSError, data: AmplifyBackend.Types.GetBackendAPIResponse) => void): Request<AmplifyBackend.Types.GetBackendAPIResponse, AWSError>;
  /**
   * Generates a model schema for existing backend API resource.
   */
  getBackendAPIModels(params: AmplifyBackend.Types.GetBackendAPIModelsRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.GetBackendAPIModelsResponse) => void): Request<AmplifyBackend.Types.GetBackendAPIModelsResponse, AWSError>;
  /**
   * Generates a model schema for existing backend API resource.
   */
  getBackendAPIModels(callback?: (err: AWSError, data: AmplifyBackend.Types.GetBackendAPIModelsResponse) => void): Request<AmplifyBackend.Types.GetBackendAPIModelsResponse, AWSError>;
  /**
   * Gets a backend auth details.
   */
  getBackendAuth(params: AmplifyBackend.Types.GetBackendAuthRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.GetBackendAuthResponse) => void): Request<AmplifyBackend.Types.GetBackendAuthResponse, AWSError>;
  /**
   * Gets a backend auth details.
   */
  getBackendAuth(callback?: (err: AWSError, data: AmplifyBackend.Types.GetBackendAuthResponse) => void): Request<AmplifyBackend.Types.GetBackendAuthResponse, AWSError>;
  /**
   * Returns information about a specific job.
   */
  getBackendJob(params: AmplifyBackend.Types.GetBackendJobRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.GetBackendJobResponse) => void): Request<AmplifyBackend.Types.GetBackendJobResponse, AWSError>;
  /**
   * Returns information about a specific job.
   */
  getBackendJob(callback?: (err: AWSError, data: AmplifyBackend.Types.GetBackendJobResponse) => void): Request<AmplifyBackend.Types.GetBackendJobResponse, AWSError>;
  /**
   * Gets the challenge token based on the given appId and sessionId.
   */
  getToken(params: AmplifyBackend.Types.GetTokenRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.GetTokenResponse) => void): Request<AmplifyBackend.Types.GetTokenResponse, AWSError>;
  /**
   * Gets the challenge token based on the given appId and sessionId.
   */
  getToken(callback?: (err: AWSError, data: AmplifyBackend.Types.GetTokenResponse) => void): Request<AmplifyBackend.Types.GetTokenResponse, AWSError>;
  /**
   * Imports an existing backend authentication resource.
   */
  importBackendAuth(params: AmplifyBackend.Types.ImportBackendAuthRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.ImportBackendAuthResponse) => void): Request<AmplifyBackend.Types.ImportBackendAuthResponse, AWSError>;
  /**
   * Imports an existing backend authentication resource.
   */
  importBackendAuth(callback?: (err: AWSError, data: AmplifyBackend.Types.ImportBackendAuthResponse) => void): Request<AmplifyBackend.Types.ImportBackendAuthResponse, AWSError>;
  /**
   * Lists the jobs for the backend of an Amplify app.
   */
  listBackendJobs(params: AmplifyBackend.Types.ListBackendJobsRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.ListBackendJobsResponse) => void): Request<AmplifyBackend.Types.ListBackendJobsResponse, AWSError>;
  /**
   * Lists the jobs for the backend of an Amplify app.
   */
  listBackendJobs(callback?: (err: AWSError, data: AmplifyBackend.Types.ListBackendJobsResponse) => void): Request<AmplifyBackend.Types.ListBackendJobsResponse, AWSError>;
  /**
   * Removes all backend environments from your Amplify project.
   */
  removeAllBackends(params: AmplifyBackend.Types.RemoveAllBackendsRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.RemoveAllBackendsResponse) => void): Request<AmplifyBackend.Types.RemoveAllBackendsResponse, AWSError>;
  /**
   * Removes all backend environments from your Amplify project.
   */
  removeAllBackends(callback?: (err: AWSError, data: AmplifyBackend.Types.RemoveAllBackendsResponse) => void): Request<AmplifyBackend.Types.RemoveAllBackendsResponse, AWSError>;
  /**
   * Removes the AWS resources required to access the Amplify Admin UI.
   */
  removeBackendConfig(params: AmplifyBackend.Types.RemoveBackendConfigRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.RemoveBackendConfigResponse) => void): Request<AmplifyBackend.Types.RemoveBackendConfigResponse, AWSError>;
  /**
   * Removes the AWS resources required to access the Amplify Admin UI.
   */
  removeBackendConfig(callback?: (err: AWSError, data: AmplifyBackend.Types.RemoveBackendConfigResponse) => void): Request<AmplifyBackend.Types.RemoveBackendConfigResponse, AWSError>;
  /**
   * Updates an existing backend API resource.
   */
  updateBackendAPI(params: AmplifyBackend.Types.UpdateBackendAPIRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.UpdateBackendAPIResponse) => void): Request<AmplifyBackend.Types.UpdateBackendAPIResponse, AWSError>;
  /**
   * Updates an existing backend API resource.
   */
  updateBackendAPI(callback?: (err: AWSError, data: AmplifyBackend.Types.UpdateBackendAPIResponse) => void): Request<AmplifyBackend.Types.UpdateBackendAPIResponse, AWSError>;
  /**
   * Updates an existing backend authentication resource.
   */
  updateBackendAuth(params: AmplifyBackend.Types.UpdateBackendAuthRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.UpdateBackendAuthResponse) => void): Request<AmplifyBackend.Types.UpdateBackendAuthResponse, AWSError>;
  /**
   * Updates an existing backend authentication resource.
   */
  updateBackendAuth(callback?: (err: AWSError, data: AmplifyBackend.Types.UpdateBackendAuthResponse) => void): Request<AmplifyBackend.Types.UpdateBackendAuthResponse, AWSError>;
  /**
   * Updates the AWS resources required to access the Amplify Admin UI.
   */
  updateBackendConfig(params: AmplifyBackend.Types.UpdateBackendConfigRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.UpdateBackendConfigResponse) => void): Request<AmplifyBackend.Types.UpdateBackendConfigResponse, AWSError>;
  /**
   * Updates the AWS resources required to access the Amplify Admin UI.
   */
  updateBackendConfig(callback?: (err: AWSError, data: AmplifyBackend.Types.UpdateBackendConfigResponse) => void): Request<AmplifyBackend.Types.UpdateBackendConfigResponse, AWSError>;
  /**
   * Updates a specific job.
   */
  updateBackendJob(params: AmplifyBackend.Types.UpdateBackendJobRequest, callback?: (err: AWSError, data: AmplifyBackend.Types.UpdateBackendJobResponse) => void): Request<AmplifyBackend.Types.UpdateBackendJobResponse, AWSError>;
  /**
   * Updates a specific job.
   */
  updateBackendJob(callback?: (err: AWSError, data: AmplifyBackend.Types.UpdateBackendJobResponse) => void): Request<AmplifyBackend.Types.UpdateBackendJobResponse, AWSError>;
}
declare namespace AmplifyBackend {
  export type AuthResources = "USER_POOL_ONLY"|"IDENTITY_POOL_AND_USER_POOL"|string;
  export interface BackendAPIAppSyncAuthSettings {
    /**
     * The Amazon Cognito user pool ID, if Amazon Cognito was used as an authentication setting to access your data models.
     */
    CognitoUserPoolId?: __string;
    /**
     * The API key description for API_KEY, if it was used as an authentication mechanism to access your data models.
     */
    Description?: __string;
    /**
     * The API key expiration time for API_KEY, if it was used as an authentication mechanism to access your data models.
     */
    ExpirationTime?: __double;
    /**
     * The expiry time for the OpenID authentication mechanism.
     */
    OpenIDAuthTTL?: __string;
    /**
     * The clientID for openID, if openID was used as an authentication setting to access your data models.
     */
    OpenIDClientId?: __string;
    /**
     * The expiry time for the OpenID authentication mechanism.
     */
    OpenIDIatTTL?: __string;
    /**
     * The openID issuer URL, if openID was used as an authentication setting to access your data models.
     */
    OpenIDIssueURL?: __string;
    /**
     * The OpenID provider name, if OpenID was used as an authentication mechanism to access your data models.
     */
    OpenIDProviderName?: __string;
  }
  export interface BackendAPIAuthType {
    /**
     * Describes the authentication mode.
     */
    Mode?: Mode;
    /**
     * Describes settings for the authentication mode.
     */
    Settings?: BackendAPIAppSyncAuthSettings;
  }
  export interface BackendAPIConflictResolution {
    /**
     * The strategy for conflict resolution.
     */
    ResolutionStrategy?: ResolutionStrategy;
  }
  export interface BackendAPIResourceConfig {
    /**
     * Additional authentication methods used to interact with your data models.
     */
    AdditionalAuthTypes?: ListOfBackendAPIAuthType;
    /**
     * The API name used to interact with the data model, configured as a part of your Amplify project.
     */
    ApiName?: __string;
    /**
     * The conflict resolution strategy for your data stored in the data models.
     */
    ConflictResolution?: BackendAPIConflictResolution;
    /**
     * The default authentication type for interacting with the configured data models in your Amplify project.
     */
    DefaultAuthType?: BackendAPIAuthType;
    /**
     * The service used to provision and interact with the data model.
     */
    Service?: __string;
    /**
     * The definition of the data model in the annotated transform of the GraphQL schema.
     */
    TransformSchema?: __string;
  }
  export interface BackendAuthAppleProviderConfig {
    /**
     * Describes the client_id (also called Services ID) that comes from Apple.
     */
    ClientId?: __string;
    /**
     * Describes the key_id that comes from Apple.
     */
    KeyId?: __string;
    /**
     * Describes the private_key that comes from Apple.
     */
    PrivateKey?: __string;
    /**
     * Describes the team_id that comes from Apple.
     */
    TeamId?: __string;
  }
  export interface BackendAuthSocialProviderConfig {
    /**
     * Describes the client_id, which can be obtained from the third-party social federation provider.
     */
    ClientId?: __string;
    /**
     * Describes the client_secret, which can be obtained from third-party social federation providers.
     */
    ClientSecret?: __string;
  }
  export interface BackendJobRespObj {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The time when the job was created.
     */
    CreateTime?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
    /**
     * The time when the job was last updated.
     */
    UpdateTime?: __string;
  }
  export interface CloneBackendRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The name of the destination backend environment to be created.
     */
    TargetEnvironmentName: __string;
  }
  export interface CloneBackendResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface CreateBackendAPIRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The resource configuration for this request.
     */
    ResourceConfig: BackendAPIResourceConfig;
    /**
     * The name of this resource.
     */
    ResourceName: __string;
  }
  export interface CreateBackendAPIResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface CreateBackendAuthForgotPasswordConfig {
    /**
     * Describes which mode to use (either SMS or email) to deliver messages to app users who want to recover their password.
     */
    DeliveryMethod: DeliveryMethod;
    /**
     * The configuration for the email sent when an app user forgets their password.
     */
    EmailSettings?: EmailSettings;
    /**
     * The configuration for the SMS message sent when an app user forgets their password.
     */
    SmsSettings?: SmsSettings;
  }
  export interface CreateBackendAuthIdentityPoolConfig {
    /**
     * Name of the Amazon Cognito identity pool used for authorization.
     */
    IdentityPoolName: __string;
    /**
     * Set to true or false based on whether you want to enable guest authorization to your Amplify app.
     */
    UnauthenticatedLogin: __boolean;
  }
  export interface CreateBackendAuthMFAConfig {
    /**
     * Describes whether MFA should be [ON, OFF, or OPTIONAL] for authentication in your Amplify project.
     */
    MFAMode: MFAMode;
    /**
     * Describes the configuration settings and methods for your Amplify app users to use MFA.
     */
    Settings?: Settings;
  }
  export interface CreateBackendAuthOAuthConfig {
    /**
     * The domain prefix for your Amplify app.
     */
    DomainPrefix?: __string;
    /**
     * The OAuth grant type that you use to allow app users to authenticate from your Amplify app.
     */
    OAuthGrantType: OAuthGrantType;
    /**
     * List of OAuth-related flows used to allow your app users to authenticate from your Amplify app.
     */
    OAuthScopes: ListOfOAuthScopesElement;
    /**
     * The redirected URI for signing in to your Amplify app.
     */
    RedirectSignInURIs: ListOf__string;
    /**
     * Redirect URLs that OAuth uses when a user signs out of an Amplify app.
     */
    RedirectSignOutURIs: ListOf__string;
    /**
     * The settings for using social providers to access your Amplify app.
     */
    SocialProviderSettings?: SocialProviderSettings;
  }
  export interface CreateBackendAuthPasswordPolicyConfig {
    /**
     * Additional constraints for the password used to access the backend of your Amplify project.
     */
    AdditionalConstraints?: ListOfAdditionalConstraintsElement;
    /**
     * The minimum length of the password used to access the backend of your Amplify project.
     */
    MinimumLength: __double;
  }
  export interface CreateBackendAuthRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The resource configuration for this request object.
     */
    ResourceConfig: CreateBackendAuthResourceConfig;
    /**
     * The name of this resource.
     */
    ResourceName: __string;
  }
  export interface CreateBackendAuthResourceConfig {
    /**
     * Defines whether you want to configure only authentication or both authentication and authorization settings.
     */
    AuthResources: AuthResources;
    /**
     * Describes the authorization configuration for the Amazon Cognito identity pool, provisioned as a part of your auth resource in the Amplify project.
     */
    IdentityPoolConfigs?: CreateBackendAuthIdentityPoolConfig;
    /**
     * Defines the service name to use when configuring an authentication resource in your Amplify project.
     */
    Service: Service;
    /**
     * Describes authentication configuration for the Amazon Cognito user pool, provisioned as a part of your auth resource in the Amplify project.
     */
    UserPoolConfigs: CreateBackendAuthUserPoolConfig;
  }
  export interface CreateBackendAuthResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface CreateBackendAuthUserPoolConfig {
    /**
     * Describes the forgotten password policy for your Amazon Cognito user pool, configured as a part of your Amplify project.
     */
    ForgotPassword?: CreateBackendAuthForgotPasswordConfig;
    /**
     * Describes whether to apply multi-factor authentication policies for your Amazon Cognito user pool configured as a part of your Amplify project.
     */
    Mfa?: CreateBackendAuthMFAConfig;
    /**
     * Describes the OAuth policy and rules for your Amazon Cognito user pool, configured as a part of your Amplify project.
     */
    OAuth?: CreateBackendAuthOAuthConfig;
    /**
     * Describes the password policy for your Amazon Cognito user pool, configured as a part of your Amplify project.
     */
    PasswordPolicy?: CreateBackendAuthPasswordPolicyConfig;
    /**
     * The required attributes to sign up new users in the user pool.
     */
    RequiredSignUpAttributes: ListOfRequiredSignUpAttributesElement;
    /**
     * Describes the sign-in methods that your Amplify app users use to log in using the Amazon Cognito user pool, configured as a part of your Amplify project.
     */
    SignInMethod: SignInMethod;
    /**
     * The Amazon Cognito user pool name.
     */
    UserPoolName: __string;
  }
  export interface CreateBackendConfigRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The app ID for the backend manager.
     */
    BackendManagerAppId?: __string;
  }
  export interface CreateBackendConfigResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface CreateBackendRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the app.
     */
    AppName: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The resource configuration for the create backend request.
     */
    ResourceConfig?: ResourceConfig;
    /**
     * The name of the resource.
     */
    ResourceName?: __string;
  }
  export interface CreateBackendResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface CreateTokenRequest {
    /**
     * The app ID.
     */
    AppId: __string;
  }
  export interface CreateTokenResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * One-time challenge code for authenticating into the Amplify Admin UI.
     */
    ChallengeCode?: __string;
    /**
     * A unique ID provided when creating a new challenge token.
     */
    SessionId?: __string;
    /**
     * The expiry time for the one-time generated token code.
     */
    Ttl?: __string;
  }
  export interface DeleteBackendAPIRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * Defines the resource configuration for the data model in your Amplify project.
     */
    ResourceConfig?: BackendAPIResourceConfig;
    /**
     * The name of this resource.
     */
    ResourceName: __string;
  }
  export interface DeleteBackendAPIResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface DeleteBackendAuthRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The name of this resource.
     */
    ResourceName: __string;
  }
  export interface DeleteBackendAuthResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface DeleteBackendRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
  }
  export interface DeleteBackendResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface DeleteTokenRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The session ID.
     */
    SessionId: __string;
  }
  export interface DeleteTokenResponse {
    /**
     * Indicates whether the request succeeded or failed.
     */
    IsSuccess?: __boolean;
  }
  export type DeliveryMethod = "EMAIL"|"SMS"|string;
  export interface EmailSettings {
    /**
     * The body of the email.
     */
    EmailMessage?: __string;
    /**
     * The subject of the email.
     */
    EmailSubject?: __string;
  }
  export interface GenerateBackendAPIModelsRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The name of this resource.
     */
    ResourceName: __string;
  }
  export interface GenerateBackendAPIModelsResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface GetBackendAPIModelsRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The name of this resource.
     */
    ResourceName: __string;
  }
  export interface GetBackendAPIModelsResponse {
    /**
     * Stringified JSON of the datastore model.
     */
    Models?: __string;
    /**
     * The current status of the request.
     */
    Status?: Status;
  }
  export interface GetBackendAPIRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * Defines the resource configuration for the data model in your Amplify project.
     */
    ResourceConfig?: BackendAPIResourceConfig;
    /**
     * The name of this resource.
     */
    ResourceName: __string;
  }
  export interface GetBackendAPIResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The resource configuration for this response object.
     */
    ResourceConfig?: BackendAPIResourceConfig;
    /**
     * The name of this resource.
     */
    ResourceName?: __string;
  }
  export interface GetBackendAuthRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The name of this resource.
     */
    ResourceName: __string;
  }
  export interface GetBackendAuthResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The resource configuration for authorization requests to the backend of your Amplify project.
     */
    ResourceConfig?: CreateBackendAuthResourceConfig;
    /**
     * The name of this resource.
     */
    ResourceName?: __string;
  }
  export interface GetBackendJobRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The ID for the job.
     */
    JobId: __string;
  }
  export interface GetBackendJobResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * The time when the job was created.
     */
    CreateTime?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
    /**
     * The time when the job was last updated.
     */
    UpdateTime?: __string;
  }
  export interface GetBackendRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
  }
  export interface GetBackendResponse {
    /**
     * A stringified version of the cli.json file for your Amplify project.
     */
    AmplifyFeatureFlags?: __string;
    /**
     * A stringified version of the current configs for your Amplify project.
     */
    AmplifyMetaConfig?: __string;
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the app.
     */
    AppName?: __string;
    /**
     * A list of backend environments in an array.
     */
    BackendEnvironmentList?: ListOf__string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request failed, this is the returned error.
     */
    Error?: __string;
  }
  export interface GetTokenRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The session ID.
     */
    SessionId: __string;
  }
  export interface GetTokenResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The one-time challenge code for authenticating into the Amplify Admin UI.
     */
    ChallengeCode?: __string;
    /**
     * A unique ID provided when creating a new challenge token.
     */
    SessionId?: __string;
    /**
     * The expiry time for the one-time generated token code.
     */
    Ttl?: __string;
  }
  export interface ImportBackendAuthRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The ID of the Amazon Cognito identity pool.
     */
    IdentityPoolId?: __string;
    /**
     * The ID of the Amazon Cognito native client.
     */
    NativeClientId: __string;
    /**
     * The ID of the Amazon Cognito user pool.
     */
    UserPoolId: __string;
    /**
     * The ID of the Amazon Cognito web client.
     */
    WebClientId: __string;
  }
  export interface ImportBackendAuthResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface ListBackendJobsRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The maximum number of results that you want in the response.
     */
    MaxResults?: __integerMin1Max25;
    /**
     * The token for the next set of results.
     */
    NextToken?: __string;
    /**
     * Filters the list of response objects to include only those with the specified operation name.
     */
    Operation?: __string;
    /**
     * Filters the list of response objects to include only those with the specified status.
     */
    Status?: __string;
  }
  export interface ListBackendJobsResponse {
    /**
     * An array of jobs and their properties.
     */
    Jobs?: ListOfBackendJobRespObj;
    /**
     * The token for the next set of results.
     */
    NextToken?: __string;
  }
  export interface LoginAuthConfigReqObj {
    /**
     * The Amazon Cognito identity pool ID used for the Amplify Admin UI login authorization.
     */
    AwsCognitoIdentityPoolId?: __string;
    /**
     * The AWS Region for the Amplify Admin UI login.
     */
    AwsCognitoRegion?: __string;
    /**
     * The Amazon Cognito user pool ID used for Amplify Admin UI login authentication.
     */
    AwsUserPoolsId?: __string;
    /**
     * The web client ID for the Amazon Cognito user pools.
     */
    AwsUserPoolsWebClientId?: __string;
  }
  export type MFAMode = "ON"|"OFF"|"OPTIONAL"|string;
  export type Mode = "API_KEY"|"AWS_IAM"|"AMAZON_COGNITO_USER_POOLS"|"OPENID_CONNECT"|string;
  export type OAuthGrantType = "CODE"|"IMPLICIT"|string;
  export interface RemoveAllBackendsRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * Cleans up the Amplify Console app if this value is set to true.
     */
    CleanAmplifyApp?: __boolean;
  }
  export interface RemoveAllBackendsResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface RemoveBackendConfigRequest {
    /**
     * The app ID.
     */
    AppId: __string;
  }
  export interface RemoveBackendConfigResponse {
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
  }
  export type ResolutionStrategy = "OPTIMISTIC_CONCURRENCY"|"LAMBDA"|"AUTOMERGE"|"NONE"|string;
  export interface ResourceConfig {
  }
  export type Service = "COGNITO"|string;
  export interface Settings {
    /**
     * The supported MFA types.
     */
    MfaTypes?: ListOfMfaTypesElement;
    /**
     * The body of the SMS message.
     */
    SmsMessage?: __string;
  }
  export type SignInMethod = "EMAIL"|"EMAIL_AND_PHONE_NUMBER"|"PHONE_NUMBER"|"USERNAME"|string;
  export interface SmsSettings {
    /**
     * The body of the SMS message.
     */
    SmsMessage?: __string;
  }
  export interface SocialProviderSettings {
    Facebook?: BackendAuthSocialProviderConfig;
    Google?: BackendAuthSocialProviderConfig;
    LoginWithAmazon?: BackendAuthSocialProviderConfig;
    SignInWithApple?: BackendAuthAppleProviderConfig;
  }
  export type Status = "LATEST"|"STALE"|string;
  export interface UpdateBackendAPIRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * Defines the resource configuration for the data model in your Amplify project.
     */
    ResourceConfig?: BackendAPIResourceConfig;
    /**
     * The name of this resource.
     */
    ResourceName: __string;
  }
  export interface UpdateBackendAPIResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface UpdateBackendAuthForgotPasswordConfig {
    /**
     * Describes which mode to use (either SMS or email) to deliver messages to app users that want to recover their password.
     */
    DeliveryMethod?: DeliveryMethod;
    /**
     * The configuration for the email sent when an app user forgets their password.
     */
    EmailSettings?: EmailSettings;
    /**
     * The configuration for the SMS message sent when an Amplify app user forgets their password.
     */
    SmsSettings?: SmsSettings;
  }
  export interface UpdateBackendAuthIdentityPoolConfig {
    /**
     * A boolean value that can be set to allow or disallow guest-level authorization into your Amplify app.
     */
    UnauthenticatedLogin?: __boolean;
  }
  export interface UpdateBackendAuthMFAConfig {
    /**
     * The MFA mode for the backend of your Amplify project.
     */
    MFAMode?: MFAMode;
    /**
     * The settings of your MFA configuration for the backend of your Amplify project.
     */
    Settings?: Settings;
  }
  export interface UpdateBackendAuthOAuthConfig {
    /**
     * The Amazon Cognito domain prefix used to create a hosted UI for authentication.
     */
    DomainPrefix?: __string;
    /**
     * The OAuth grant type to allow app users to authenticate from your Amplify app.
     */
    OAuthGrantType?: OAuthGrantType;
    /**
     * The list of OAuth-related flows that can allow users to authenticate from your Amplify app.
     */
    OAuthScopes?: ListOfOAuthScopesElement;
    /**
     * Redirect URLs that OAuth uses when a user signs in to an Amplify app.
     */
    RedirectSignInURIs?: ListOf__string;
    /**
     * Redirect URLs that OAuth uses when a user signs out of an Amplify app.
     */
    RedirectSignOutURIs?: ListOf__string;
    /**
     * Describes third-party social federation configurations for allowing your users to sign in with OAuth.
     */
    SocialProviderSettings?: SocialProviderSettings;
  }
  export interface UpdateBackendAuthPasswordPolicyConfig {
    /**
     * Describes additional constraints on password requirements to sign in to the auth resource, configured as a part of your Amplify project.
     */
    AdditionalConstraints?: ListOfAdditionalConstraintsElement;
    /**
     * Describes the minimum length of the password required to sign in to the auth resource, configured as a part of your Amplify project.
     */
    MinimumLength?: __double;
  }
  export interface UpdateBackendAuthRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The resource configuration for this request object.
     */
    ResourceConfig: UpdateBackendAuthResourceConfig;
    /**
     * The name of this resource.
     */
    ResourceName: __string;
  }
  export interface UpdateBackendAuthResourceConfig {
    /**
     * Defines the service name to use when configuring an authentication resource in your Amplify project.
     */
    AuthResources: AuthResources;
    /**
     * Describes the authorization configuration for the Amazon Cognito identity pool, provisioned as a part of your auth resource in the Amplify project.
     */
    IdentityPoolConfigs?: UpdateBackendAuthIdentityPoolConfig;
    /**
     * Defines the service name to use when configuring an authentication resource in your Amplify project.
     */
    Service: Service;
    /**
     * Describes the authentication configuration for the Amazon Cognito user pool, provisioned as a part of your auth resource in the Amplify project.
     */
    UserPoolConfigs: UpdateBackendAuthUserPoolConfig;
  }
  export interface UpdateBackendAuthResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
  }
  export interface UpdateBackendAuthUserPoolConfig {
    /**
     * Describes the forgot password policy for your Amazon Cognito user pool, configured as a part of your Amplify project.
     */
    ForgotPassword?: UpdateBackendAuthForgotPasswordConfig;
    /**
     * Describes whether to apply multi-factor authentication policies for your Amazon Cognito user pool configured as a part of your Amplify project.
     */
    Mfa?: UpdateBackendAuthMFAConfig;
    /**
     * Describes the OAuth policy and rules for your Amazon Cognito user pool, configured as a part of your Amplify project.
     */
    OAuth?: UpdateBackendAuthOAuthConfig;
    /**
     * Describes the password policy for your Amazon Cognito user pool, configured as a part of your Amplify project.
     */
    PasswordPolicy?: UpdateBackendAuthPasswordPolicyConfig;
  }
  export interface UpdateBackendConfigRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * Describes the Amazon Cognito configuration for Admin UI access.
     */
    LoginAuthConfig?: LoginAuthConfigReqObj;
  }
  export interface UpdateBackendConfigResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The app ID for the backend manager.
     */
    BackendManagerAppId?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * Describes the Amazon Cognito configurations for the Admin UI auth resource to log in with.
     */
    LoginAuthConfig?: LoginAuthConfigReqObj;
  }
  export interface UpdateBackendJobRequest {
    /**
     * The app ID.
     */
    AppId: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName: __string;
    /**
     * The ID for the job.
     */
    JobId: __string;
    /**
     * Filters the list of response objects to include only those with the specified operation name.
     */
    Operation?: __string;
    /**
     * Filters the list of response objects to include only those with the specified status.
     */
    Status?: __string;
  }
  export interface UpdateBackendJobResponse {
    /**
     * The app ID.
     */
    AppId?: __string;
    /**
     * The name of the backend environment.
     */
    BackendEnvironmentName?: __string;
    /**
     * The time when the job was created.
     */
    CreateTime?: __string;
    /**
     * If the request fails, this error is returned.
     */
    Error?: __string;
    /**
     * The ID for the job.
     */
    JobId?: __string;
    /**
     * The name of the operation.
     */
    Operation?: __string;
    /**
     * The current status of the request.
     */
    Status?: __string;
    /**
     * The time when the job was last updated.
     */
    UpdateTime?: __string;
  }
  export type AdditionalConstraintsElement = "REQUIRE_DIGIT"|"REQUIRE_LOWERCASE"|"REQUIRE_SYMBOL"|"REQUIRE_UPPERCASE"|string;
  export type MfaTypesElement = "SMS"|"TOTP"|string;
  export type OAuthScopesElement = "PHONE"|"EMAIL"|"OPENID"|"PROFILE"|"AWS_COGNITO_SIGNIN_USER_ADMIN"|string;
  export type RequiredSignUpAttributesElement = "ADDRESS"|"BIRTHDATE"|"EMAIL"|"FAMILY_NAME"|"GENDER"|"GIVEN_NAME"|"LOCALE"|"MIDDLE_NAME"|"NAME"|"NICKNAME"|"PHONE_NUMBER"|"PICTURE"|"PREFERRED_USERNAME"|"PROFILE"|"UPDATED_AT"|"WEBSITE"|"ZONE_INFO"|string;
  export type __boolean = boolean;
  export type __double = number;
  export type __integerMin1Max25 = number;
  export type ListOfBackendAPIAuthType = BackendAPIAuthType[];
  export type ListOfBackendJobRespObj = BackendJobRespObj[];
  export type ListOfAdditionalConstraintsElement = AdditionalConstraintsElement[];
  export type ListOfMfaTypesElement = MfaTypesElement[];
  export type ListOfOAuthScopesElement = OAuthScopesElement[];
  export type ListOfRequiredSignUpAttributesElement = RequiredSignUpAttributesElement[];
  export type ListOf__string = __string[];
  export type __string = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-08-11"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AmplifyBackend client.
   */
  export import Types = AmplifyBackend;
}
export = AmplifyBackend;
