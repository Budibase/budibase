import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AppFabric extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AppFabric.Types.ClientConfiguration)
  config: Config & AppFabric.Types.ClientConfiguration;
  /**
   * Gets user access details in a batch request. This action polls data from the tasks that are kicked off by the StartUserAccessTasks action.
   */
  batchGetUserAccessTasks(params: AppFabric.Types.BatchGetUserAccessTasksRequest, callback?: (err: AWSError, data: AppFabric.Types.BatchGetUserAccessTasksResponse) => void): Request<AppFabric.Types.BatchGetUserAccessTasksResponse, AWSError>;
  /**
   * Gets user access details in a batch request. This action polls data from the tasks that are kicked off by the StartUserAccessTasks action.
   */
  batchGetUserAccessTasks(callback?: (err: AWSError, data: AppFabric.Types.BatchGetUserAccessTasksResponse) => void): Request<AppFabric.Types.BatchGetUserAccessTasksResponse, AWSError>;
  /**
   * Establishes a connection between Amazon Web Services AppFabric and an application, which allows AppFabric to call the APIs of the application.
   */
  connectAppAuthorization(params: AppFabric.Types.ConnectAppAuthorizationRequest, callback?: (err: AWSError, data: AppFabric.Types.ConnectAppAuthorizationResponse) => void): Request<AppFabric.Types.ConnectAppAuthorizationResponse, AWSError>;
  /**
   * Establishes a connection between Amazon Web Services AppFabric and an application, which allows AppFabric to call the APIs of the application.
   */
  connectAppAuthorization(callback?: (err: AWSError, data: AppFabric.Types.ConnectAppAuthorizationResponse) => void): Request<AppFabric.Types.ConnectAppAuthorizationResponse, AWSError>;
  /**
   * Creates an app authorization within an app bundle, which allows AppFabric to connect to an application.
   */
  createAppAuthorization(params: AppFabric.Types.CreateAppAuthorizationRequest, callback?: (err: AWSError, data: AppFabric.Types.CreateAppAuthorizationResponse) => void): Request<AppFabric.Types.CreateAppAuthorizationResponse, AWSError>;
  /**
   * Creates an app authorization within an app bundle, which allows AppFabric to connect to an application.
   */
  createAppAuthorization(callback?: (err: AWSError, data: AppFabric.Types.CreateAppAuthorizationResponse) => void): Request<AppFabric.Types.CreateAppAuthorizationResponse, AWSError>;
  /**
   * Creates an app bundle to collect data from an application using AppFabric.
   */
  createAppBundle(params: AppFabric.Types.CreateAppBundleRequest, callback?: (err: AWSError, data: AppFabric.Types.CreateAppBundleResponse) => void): Request<AppFabric.Types.CreateAppBundleResponse, AWSError>;
  /**
   * Creates an app bundle to collect data from an application using AppFabric.
   */
  createAppBundle(callback?: (err: AWSError, data: AppFabric.Types.CreateAppBundleResponse) => void): Request<AppFabric.Types.CreateAppBundleResponse, AWSError>;
  /**
   * Creates a data ingestion for an application.
   */
  createIngestion(params: AppFabric.Types.CreateIngestionRequest, callback?: (err: AWSError, data: AppFabric.Types.CreateIngestionResponse) => void): Request<AppFabric.Types.CreateIngestionResponse, AWSError>;
  /**
   * Creates a data ingestion for an application.
   */
  createIngestion(callback?: (err: AWSError, data: AppFabric.Types.CreateIngestionResponse) => void): Request<AppFabric.Types.CreateIngestionResponse, AWSError>;
  /**
   * Creates an ingestion destination, which specifies how an application's ingested data is processed by Amazon Web Services AppFabric and where it's delivered.
   */
  createIngestionDestination(params: AppFabric.Types.CreateIngestionDestinationRequest, callback?: (err: AWSError, data: AppFabric.Types.CreateIngestionDestinationResponse) => void): Request<AppFabric.Types.CreateIngestionDestinationResponse, AWSError>;
  /**
   * Creates an ingestion destination, which specifies how an application's ingested data is processed by Amazon Web Services AppFabric and where it's delivered.
   */
  createIngestionDestination(callback?: (err: AWSError, data: AppFabric.Types.CreateIngestionDestinationResponse) => void): Request<AppFabric.Types.CreateIngestionDestinationResponse, AWSError>;
  /**
   * Deletes an app authorization. You must delete the associated ingestion before you can delete an app authorization.
   */
  deleteAppAuthorization(params: AppFabric.Types.DeleteAppAuthorizationRequest, callback?: (err: AWSError, data: AppFabric.Types.DeleteAppAuthorizationResponse) => void): Request<AppFabric.Types.DeleteAppAuthorizationResponse, AWSError>;
  /**
   * Deletes an app authorization. You must delete the associated ingestion before you can delete an app authorization.
   */
  deleteAppAuthorization(callback?: (err: AWSError, data: AppFabric.Types.DeleteAppAuthorizationResponse) => void): Request<AppFabric.Types.DeleteAppAuthorizationResponse, AWSError>;
  /**
   * Deletes an app bundle. You must delete all associated app authorizations before you can delete an app bundle.
   */
  deleteAppBundle(params: AppFabric.Types.DeleteAppBundleRequest, callback?: (err: AWSError, data: AppFabric.Types.DeleteAppBundleResponse) => void): Request<AppFabric.Types.DeleteAppBundleResponse, AWSError>;
  /**
   * Deletes an app bundle. You must delete all associated app authorizations before you can delete an app bundle.
   */
  deleteAppBundle(callback?: (err: AWSError, data: AppFabric.Types.DeleteAppBundleResponse) => void): Request<AppFabric.Types.DeleteAppBundleResponse, AWSError>;
  /**
   * Deletes an ingestion. You must stop (disable) the ingestion and you must delete all associated ingestion destinations before you can delete an app ingestion.
   */
  deleteIngestion(params: AppFabric.Types.DeleteIngestionRequest, callback?: (err: AWSError, data: AppFabric.Types.DeleteIngestionResponse) => void): Request<AppFabric.Types.DeleteIngestionResponse, AWSError>;
  /**
   * Deletes an ingestion. You must stop (disable) the ingestion and you must delete all associated ingestion destinations before you can delete an app ingestion.
   */
  deleteIngestion(callback?: (err: AWSError, data: AppFabric.Types.DeleteIngestionResponse) => void): Request<AppFabric.Types.DeleteIngestionResponse, AWSError>;
  /**
   * Deletes an ingestion destination. This deletes the association between an ingestion and it's destination. It doesn't delete previously ingested data or the storage destination, such as the Amazon S3 bucket where the data is delivered. If the ingestion destination is deleted while the associated ingestion is enabled, the ingestion will fail and is eventually disabled.
   */
  deleteIngestionDestination(params: AppFabric.Types.DeleteIngestionDestinationRequest, callback?: (err: AWSError, data: AppFabric.Types.DeleteIngestionDestinationResponse) => void): Request<AppFabric.Types.DeleteIngestionDestinationResponse, AWSError>;
  /**
   * Deletes an ingestion destination. This deletes the association between an ingestion and it's destination. It doesn't delete previously ingested data or the storage destination, such as the Amazon S3 bucket where the data is delivered. If the ingestion destination is deleted while the associated ingestion is enabled, the ingestion will fail and is eventually disabled.
   */
  deleteIngestionDestination(callback?: (err: AWSError, data: AppFabric.Types.DeleteIngestionDestinationResponse) => void): Request<AppFabric.Types.DeleteIngestionDestinationResponse, AWSError>;
  /**
   * Returns information about an app authorization.
   */
  getAppAuthorization(params: AppFabric.Types.GetAppAuthorizationRequest, callback?: (err: AWSError, data: AppFabric.Types.GetAppAuthorizationResponse) => void): Request<AppFabric.Types.GetAppAuthorizationResponse, AWSError>;
  /**
   * Returns information about an app authorization.
   */
  getAppAuthorization(callback?: (err: AWSError, data: AppFabric.Types.GetAppAuthorizationResponse) => void): Request<AppFabric.Types.GetAppAuthorizationResponse, AWSError>;
  /**
   * Returns information about an app bundle.
   */
  getAppBundle(params: AppFabric.Types.GetAppBundleRequest, callback?: (err: AWSError, data: AppFabric.Types.GetAppBundleResponse) => void): Request<AppFabric.Types.GetAppBundleResponse, AWSError>;
  /**
   * Returns information about an app bundle.
   */
  getAppBundle(callback?: (err: AWSError, data: AppFabric.Types.GetAppBundleResponse) => void): Request<AppFabric.Types.GetAppBundleResponse, AWSError>;
  /**
   * Returns information about an ingestion.
   */
  getIngestion(params: AppFabric.Types.GetIngestionRequest, callback?: (err: AWSError, data: AppFabric.Types.GetIngestionResponse) => void): Request<AppFabric.Types.GetIngestionResponse, AWSError>;
  /**
   * Returns information about an ingestion.
   */
  getIngestion(callback?: (err: AWSError, data: AppFabric.Types.GetIngestionResponse) => void): Request<AppFabric.Types.GetIngestionResponse, AWSError>;
  /**
   * Returns information about an ingestion destination.
   */
  getIngestionDestination(params: AppFabric.Types.GetIngestionDestinationRequest, callback?: (err: AWSError, data: AppFabric.Types.GetIngestionDestinationResponse) => void): Request<AppFabric.Types.GetIngestionDestinationResponse, AWSError>;
  /**
   * Returns information about an ingestion destination.
   */
  getIngestionDestination(callback?: (err: AWSError, data: AppFabric.Types.GetIngestionDestinationResponse) => void): Request<AppFabric.Types.GetIngestionDestinationResponse, AWSError>;
  /**
   * Returns a list of all app authorizations configured for an app bundle.
   */
  listAppAuthorizations(params: AppFabric.Types.ListAppAuthorizationsRequest, callback?: (err: AWSError, data: AppFabric.Types.ListAppAuthorizationsResponse) => void): Request<AppFabric.Types.ListAppAuthorizationsResponse, AWSError>;
  /**
   * Returns a list of all app authorizations configured for an app bundle.
   */
  listAppAuthorizations(callback?: (err: AWSError, data: AppFabric.Types.ListAppAuthorizationsResponse) => void): Request<AppFabric.Types.ListAppAuthorizationsResponse, AWSError>;
  /**
   * Returns a list of app bundles.
   */
  listAppBundles(params: AppFabric.Types.ListAppBundlesRequest, callback?: (err: AWSError, data: AppFabric.Types.ListAppBundlesResponse) => void): Request<AppFabric.Types.ListAppBundlesResponse, AWSError>;
  /**
   * Returns a list of app bundles.
   */
  listAppBundles(callback?: (err: AWSError, data: AppFabric.Types.ListAppBundlesResponse) => void): Request<AppFabric.Types.ListAppBundlesResponse, AWSError>;
  /**
   * Returns a list of all ingestion destinations configured for an ingestion.
   */
  listIngestionDestinations(params: AppFabric.Types.ListIngestionDestinationsRequest, callback?: (err: AWSError, data: AppFabric.Types.ListIngestionDestinationsResponse) => void): Request<AppFabric.Types.ListIngestionDestinationsResponse, AWSError>;
  /**
   * Returns a list of all ingestion destinations configured for an ingestion.
   */
  listIngestionDestinations(callback?: (err: AWSError, data: AppFabric.Types.ListIngestionDestinationsResponse) => void): Request<AppFabric.Types.ListIngestionDestinationsResponse, AWSError>;
  /**
   * Returns a list of all ingestions configured for an app bundle.
   */
  listIngestions(params: AppFabric.Types.ListIngestionsRequest, callback?: (err: AWSError, data: AppFabric.Types.ListIngestionsResponse) => void): Request<AppFabric.Types.ListIngestionsResponse, AWSError>;
  /**
   * Returns a list of all ingestions configured for an app bundle.
   */
  listIngestions(callback?: (err: AWSError, data: AppFabric.Types.ListIngestionsResponse) => void): Request<AppFabric.Types.ListIngestionsResponse, AWSError>;
  /**
   * Returns a list of tags for a resource.
   */
  listTagsForResource(params: AppFabric.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: AppFabric.Types.ListTagsForResourceResponse) => void): Request<AppFabric.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of tags for a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: AppFabric.Types.ListTagsForResourceResponse) => void): Request<AppFabric.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Starts (enables) an ingestion, which collects data from an application.
   */
  startIngestion(params: AppFabric.Types.StartIngestionRequest, callback?: (err: AWSError, data: AppFabric.Types.StartIngestionResponse) => void): Request<AppFabric.Types.StartIngestionResponse, AWSError>;
  /**
   * Starts (enables) an ingestion, which collects data from an application.
   */
  startIngestion(callback?: (err: AWSError, data: AppFabric.Types.StartIngestionResponse) => void): Request<AppFabric.Types.StartIngestionResponse, AWSError>;
  /**
   * Starts the tasks to search user access status for a specific email address. The tasks are stopped when the user access status data is found. The tasks are terminated when the API calls to the application time out.
   */
  startUserAccessTasks(params: AppFabric.Types.StartUserAccessTasksRequest, callback?: (err: AWSError, data: AppFabric.Types.StartUserAccessTasksResponse) => void): Request<AppFabric.Types.StartUserAccessTasksResponse, AWSError>;
  /**
   * Starts the tasks to search user access status for a specific email address. The tasks are stopped when the user access status data is found. The tasks are terminated when the API calls to the application time out.
   */
  startUserAccessTasks(callback?: (err: AWSError, data: AppFabric.Types.StartUserAccessTasksResponse) => void): Request<AppFabric.Types.StartUserAccessTasksResponse, AWSError>;
  /**
   * Stops (disables) an ingestion.
   */
  stopIngestion(params: AppFabric.Types.StopIngestionRequest, callback?: (err: AWSError, data: AppFabric.Types.StopIngestionResponse) => void): Request<AppFabric.Types.StopIngestionResponse, AWSError>;
  /**
   * Stops (disables) an ingestion.
   */
  stopIngestion(callback?: (err: AWSError, data: AppFabric.Types.StopIngestionResponse) => void): Request<AppFabric.Types.StopIngestionResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified resource.
   */
  tagResource(params: AppFabric.Types.TagResourceRequest, callback?: (err: AWSError, data: AppFabric.Types.TagResourceResponse) => void): Request<AppFabric.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: AppFabric.Types.TagResourceResponse) => void): Request<AppFabric.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a tag or tags from a resource.
   */
  untagResource(params: AppFabric.Types.UntagResourceRequest, callback?: (err: AWSError, data: AppFabric.Types.UntagResourceResponse) => void): Request<AppFabric.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a tag or tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: AppFabric.Types.UntagResourceResponse) => void): Request<AppFabric.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an app authorization within an app bundle, which allows AppFabric to connect to an application. If the app authorization was in a connected state, updating the app authorization will set it back to a PendingConnect state.
   */
  updateAppAuthorization(params: AppFabric.Types.UpdateAppAuthorizationRequest, callback?: (err: AWSError, data: AppFabric.Types.UpdateAppAuthorizationResponse) => void): Request<AppFabric.Types.UpdateAppAuthorizationResponse, AWSError>;
  /**
   * Updates an app authorization within an app bundle, which allows AppFabric to connect to an application. If the app authorization was in a connected state, updating the app authorization will set it back to a PendingConnect state.
   */
  updateAppAuthorization(callback?: (err: AWSError, data: AppFabric.Types.UpdateAppAuthorizationResponse) => void): Request<AppFabric.Types.UpdateAppAuthorizationResponse, AWSError>;
  /**
   * Updates an ingestion destination, which specifies how an application's ingested data is processed by Amazon Web Services AppFabric and where it's delivered.
   */
  updateIngestionDestination(params: AppFabric.Types.UpdateIngestionDestinationRequest, callback?: (err: AWSError, data: AppFabric.Types.UpdateIngestionDestinationResponse) => void): Request<AppFabric.Types.UpdateIngestionDestinationResponse, AWSError>;
  /**
   * Updates an ingestion destination, which specifies how an application's ingested data is processed by Amazon Web Services AppFabric and where it's delivered.
   */
  updateIngestionDestination(callback?: (err: AWSError, data: AppFabric.Types.UpdateIngestionDestinationResponse) => void): Request<AppFabric.Types.UpdateIngestionDestinationResponse, AWSError>;
}
declare namespace AppFabric {
  export interface ApiKeyCredential {
    /**
     * An API key for an application.
     */
    apiKey: SensitiveString2048;
  }
  export interface AppAuthorization {
    /**
     * The Amazon Resource Name (ARN) of the app authorization.
     */
    appAuthorizationArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the app bundle for the app authorization.
     */
    appBundleArn: Arn;
    /**
     * The name of the application.
     */
    app: String255;
    /**
     * Contains information about an application tenant, such as the application display name and identifier.
     */
    tenant: Tenant;
    /**
     * The authorization type.
     */
    authType: AuthType;
    /**
     * The state of the app authorization. The following states are possible:    PendingConnect: The initial state of the app authorization. The app authorization is created but not yet connected.    Connected: The app authorization is connected to the application, and is ready to be used.    ConnectionValidationFailed: The app authorization received a validation exception when trying to connect to the application. If the app authorization is in this state, you should verify the configured credentials and try to connect the app authorization again.    TokenAutoRotationFailed: AppFabric failed to refresh the access token. If the app authorization is in this state, you should try to reconnect the app authorization.  
     */
    status: AppAuthorizationStatus;
    /**
     * The timestamp of when the app authorization was created.
     */
    createdAt: DateTime;
    /**
     * The timestamp of when the app authorization was last updated.
     */
    updatedAt: DateTime;
    /**
     * The user persona of the app authorization. This field should always be admin.
     */
    persona?: Persona;
    /**
     * The application URL for the OAuth flow.
     */
    authUrl?: String;
  }
  export type AppAuthorizationStatus = "PendingConnect"|"Connected"|"ConnectionValidationFailed"|"TokenAutoRotationFailed"|string;
  export interface AppAuthorizationSummary {
    /**
     * The Amazon Resource Name (ARN) of the app authorization.
     */
    appAuthorizationArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the app bundle for the app authorization.
     */
    appBundleArn: Arn;
    /**
     * The name of the application.
     */
    app: String255;
    /**
     * Contains information about an application tenant, such as the application display name and identifier.
     */
    tenant: Tenant;
    /**
     * The state of the app authorization. The following states are possible:    PendingConnect: The initial state of the app authorization. The app authorization is created but not yet connected.    Connected: The app authorization is connected to the application, and is ready to be used.    ConnectionValidationFailed: The app authorization received a validation exception when trying to connect to the application. If the app authorization is in this state, you should verify the configured credentials and try to connect the app authorization again.    TokenAutoRotationFailed: AppFabric failed to refresh the access token. If the app authorization is in this state, you should try to reconnect the app authorization.  
     */
    status: AppAuthorizationStatus;
    /**
     * Timestamp for when the app authorization was last updated.
     */
    updatedAt: DateTime;
  }
  export type AppAuthorizationSummaryList = AppAuthorizationSummary[];
  export interface AppBundle {
    /**
     * The Amazon Resource Name (ARN) of the app bundle.
     */
    arn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the Key Management Service (KMS) key used to encrypt the application data.
     */
    customerManagedKeyArn?: Arn;
  }
  export interface AppBundleSummary {
    /**
     * The Amazon Resource Name (ARN) of the app bundle.
     */
    arn: Arn;
  }
  export type AppBundleSummaryList = AppBundleSummary[];
  export type Arn = string;
  export interface AuditLogDestinationConfiguration {
    /**
     * Contains information about an audit log destination.
     */
    destination: Destination;
  }
  export interface AuditLogProcessingConfiguration {
    /**
     * The event schema in which the audit logs need to be formatted.
     */
    schema: Schema;
    /**
     * The format in which the audit logs need to be formatted.
     */
    format: Format;
  }
  export interface AuthRequest {
    /**
     * The redirect URL that is specified in the AuthURL and the application client.
     */
    redirectUri: RedirectUri;
    /**
     * The authorization code returned by the application after permission is granted in the application OAuth page (after clicking on the AuthURL).
     */
    code: SensitiveString2048;
  }
  export type AuthType = "oauth2"|"apiKey"|string;
  export interface BatchGetUserAccessTasksRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The tasks IDs to use for the request.
     */
    taskIdList: TaskIdList;
  }
  export interface BatchGetUserAccessTasksResponse {
    /**
     * Contains a list of user access results.
     */
    userAccessResultsList?: UserAccessResultsList;
  }
  export interface ConnectAppAuthorizationRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle that contains the app authorization to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app authorization to use for the request.
     */
    appAuthorizationIdentifier: Identifier;
    /**
     * Contains OAuth2 authorization information. This is required if the app authorization for the request is configured with an OAuth2 (oauth2) authorization type.
     */
    authRequest?: AuthRequest;
  }
  export interface ConnectAppAuthorizationResponse {
    /**
     * Contains a summary of the app authorization.
     */
    appAuthorizationSummary: AppAuthorizationSummary;
  }
  export interface CreateAppAuthorizationRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The name of the application. Valid values are:    SLACK     ASANA     JIRA     M365     M365AUDITLOGS     ZOOM     ZENDESK     OKTA     GOOGLE     DROPBOX     SMARTSHEET     CISCO   
     */
    app: String255;
    /**
     * Contains credentials for the application, such as an API key or OAuth2 client ID and secret. Specify credentials that match the authorization type for your request. For example, if the authorization type for your request is OAuth2 (oauth2), then you should provide only the OAuth2 credentials.
     */
    credential: Credential;
    /**
     * Contains information about an application tenant, such as the application display name and identifier.
     */
    tenant: Tenant;
    /**
     * The authorization type for the app authorization.
     */
    authType: AuthType;
    /**
     * Specifies a unique, case-sensitive identifier that you provide to ensure the idempotency of the request. This lets you safely retry the request without accidentally performing the same operation a second time. Passing the same value to a later call to an operation requires that you also pass the same value for all other parameters. We recommend that you use a UUID type of value. If you don't provide this value, then Amazon Web Services generates a random one for you. If you retry the operation with the same ClientToken, but with different parameters, the retry fails with an IdempotentParameterMismatch error.
     */
    clientToken?: UUID;
    /**
     * A map of the key-value pairs of the tag or tags to assign to the resource.
     */
    tags?: TagList;
  }
  export interface CreateAppAuthorizationResponse {
    /**
     * Contains information about an app authorization.
     */
    appAuthorization: AppAuthorization;
  }
  export interface CreateAppBundleRequest {
    /**
     * Specifies a unique, case-sensitive identifier that you provide to ensure the idempotency of the request. This lets you safely retry the request without accidentally performing the same operation a second time. Passing the same value to a later call to an operation requires that you also pass the same value for all other parameters. We recommend that you use a UUID type of value. If you don't provide this value, then Amazon Web Services generates a random one for you. If you retry the operation with the same ClientToken, but with different parameters, the retry fails with an IdempotentParameterMismatch error.
     */
    clientToken?: UUID;
    /**
     * The Amazon Resource Name (ARN) of the Key Management Service (KMS) key to use to encrypt the application data. If this is not specified, an Amazon Web Services owned key is used for encryption.
     */
    customerManagedKeyIdentifier?: Identifier;
    /**
     * A map of the key-value pairs of the tag or tags to assign to the resource.
     */
    tags?: TagList;
  }
  export interface CreateAppBundleResponse {
    /**
     * Contains information about an app bundle.
     */
    appBundle: AppBundle;
  }
  export interface CreateIngestionDestinationRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the ingestion to use for the request.
     */
    ingestionIdentifier: Identifier;
    /**
     * Contains information about how ingested data is processed.
     */
    processingConfiguration: ProcessingConfiguration;
    /**
     * Contains information about the destination of ingested data.
     */
    destinationConfiguration: DestinationConfiguration;
    /**
     * Specifies a unique, case-sensitive identifier that you provide to ensure the idempotency of the request. This lets you safely retry the request without accidentally performing the same operation a second time. Passing the same value to a later call to an operation requires that you also pass the same value for all other parameters. We recommend that you use a UUID type of value. If you don't provide this value, then Amazon Web Services generates a random one for you. If you retry the operation with the same ClientToken, but with different parameters, the retry fails with an IdempotentParameterMismatch error.
     */
    clientToken?: UUID;
    /**
     * A map of the key-value pairs of the tag or tags to assign to the resource.
     */
    tags?: TagList;
  }
  export interface CreateIngestionDestinationResponse {
    /**
     * Contains information about an ingestion destination.
     */
    ingestionDestination: IngestionDestination;
  }
  export interface CreateIngestionRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The name of the application. Valid values are:    SLACK     ASANA     JIRA     M365     M365AUDITLOGS     ZOOM     ZENDESK     OKTA     GOOGLE     DROPBOX     SMARTSHEET     CISCO   
     */
    app: String255;
    /**
     * The ID of the application tenant.
     */
    tenantId: TenantIdentifier;
    /**
     * The ingestion type.
     */
    ingestionType: IngestionType;
    /**
     * Specifies a unique, case-sensitive identifier that you provide to ensure the idempotency of the request. This lets you safely retry the request without accidentally performing the same operation a second time. Passing the same value to a later call to an operation requires that you also pass the same value for all other parameters. We recommend that you use a UUID type of value. If you don't provide this value, then Amazon Web Services generates a random one for you. If you retry the operation with the same ClientToken, but with different parameters, the retry fails with an IdempotentParameterMismatch error.
     */
    clientToken?: UUID;
    /**
     * A map of the key-value pairs of the tag or tags to assign to the resource.
     */
    tags?: TagList;
  }
  export interface CreateIngestionResponse {
    /**
     * Contains information about an ingestion.
     */
    ingestion: Ingestion;
  }
  export interface Credential {
    /**
     * Contains OAuth2 client credential information.
     */
    oauth2Credential?: Oauth2Credential;
    /**
     * Contains API key credential information.
     */
    apiKeyCredential?: ApiKeyCredential;
  }
  export type DateTime = Date;
  export interface DeleteAppAuthorizationRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app authorization to use for the request.
     */
    appAuthorizationIdentifier: Identifier;
  }
  export interface DeleteAppAuthorizationResponse {
  }
  export interface DeleteAppBundleRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the app bundle that needs to be deleted.
     */
    appBundleIdentifier: Identifier;
  }
  export interface DeleteAppBundleResponse {
  }
  export interface DeleteIngestionDestinationRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the ingestion to use for the request.
     */
    ingestionIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the ingestion destination to use for the request.
     */
    ingestionDestinationIdentifier: Identifier;
  }
  export interface DeleteIngestionDestinationResponse {
  }
  export interface DeleteIngestionRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the ingestion to use for the request.
     */
    ingestionIdentifier: Identifier;
  }
  export interface DeleteIngestionResponse {
  }
  export interface Destination {
    /**
     * Contains information about an Amazon S3 bucket.
     */
    s3Bucket?: S3Bucket;
    /**
     * Contains information about an Amazon Kinesis Data Firehose delivery stream.
     */
    firehoseStream?: FirehoseStream;
  }
  export interface DestinationConfiguration {
    /**
     * Contains information about an audit log destination configuration.
     */
    auditLog?: AuditLogDestinationConfiguration;
  }
  export type Email = string;
  export interface FirehoseStream {
    /**
     * The name of the Amazon Kinesis Data Firehose delivery stream.
     */
    streamName: String64;
  }
  export type Format = "json"|"parquet"|string;
  export interface GetAppAuthorizationRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app authorization to use for the request.
     */
    appAuthorizationIdentifier: Identifier;
  }
  export interface GetAppAuthorizationResponse {
    /**
     * Contains information about an app authorization.
     */
    appAuthorization: AppAuthorization;
  }
  export interface GetAppBundleRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
  }
  export interface GetAppBundleResponse {
    /**
     * Contains information about an app bundle.
     */
    appBundle: AppBundle;
  }
  export interface GetIngestionDestinationRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the ingestion to use for the request.
     */
    ingestionIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the ingestion destination to use for the request.
     */
    ingestionDestinationIdentifier: Identifier;
  }
  export interface GetIngestionDestinationResponse {
    /**
     * Contains information about an ingestion destination.
     */
    ingestionDestination: IngestionDestination;
  }
  export interface GetIngestionRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the ingestion to use for the request.
     */
    ingestionIdentifier: Identifier;
  }
  export interface GetIngestionResponse {
    /**
     * Contains information about an ingestion.
     */
    ingestion: Ingestion;
  }
  export type Identifier = string;
  export interface Ingestion {
    /**
     * The Amazon Resource Name (ARN) of the ingestion.
     */
    arn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the app bundle for the ingestion.
     */
    appBundleArn: Arn;
    /**
     * The name of the application.
     */
    app: String255;
    /**
     * The ID of the application tenant.
     */
    tenantId: TenantIdentifier;
    /**
     * The timestamp of when the ingestion was created.
     */
    createdAt: DateTime;
    /**
     * The timestamp of when the ingestion was last updated.
     */
    updatedAt: DateTime;
    /**
     * The status of the ingestion.
     */
    state: IngestionState;
    /**
     * The type of the ingestion.
     */
    ingestionType: IngestionType;
  }
  export interface IngestionDestination {
    /**
     * The Amazon Resource Name (ARN) of the ingestion destination.
     */
    arn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the ingestion.
     */
    ingestionArn: Arn;
    /**
     * Contains information about how ingested data is processed.
     */
    processingConfiguration: ProcessingConfiguration;
    /**
     * Contains information about the destination of ingested data.
     */
    destinationConfiguration: DestinationConfiguration;
    /**
     * The state of the ingestion destination. The following states are possible:    Active: The ingestion destination is active and is ready to be used.    Failed: The ingestion destination has failed. If the ingestion destination is in this state, you should verify the ingestion destination configuration and try again.  
     */
    status?: IngestionDestinationStatus;
    /**
     * The reason for the current status of the ingestion destination. Only present when the status of ingestion destination is Failed.
     */
    statusReason?: String;
    /**
     * The timestamp of when the ingestion destination was created.
     */
    createdAt?: DateTime;
    /**
     * The timestamp of when the ingestion destination was last updated.
     */
    updatedAt?: DateTime;
  }
  export type IngestionDestinationList = IngestionDestinationSummary[];
  export type IngestionDestinationStatus = "Active"|"Failed"|string;
  export interface IngestionDestinationSummary {
    /**
     * The Amazon Resource Name (ARN) of the ingestion destination.
     */
    arn: Arn;
  }
  export type IngestionList = IngestionSummary[];
  export type IngestionState = "enabled"|"disabled"|string;
  export interface IngestionSummary {
    /**
     * The Amazon Resource Name (ARN) of the ingestion.
     */
    arn: Arn;
    /**
     * The name of the application.
     */
    app: String255;
    /**
     * The ID of the application tenant.
     */
    tenantId: TenantIdentifier;
    /**
     * The status of the ingestion.
     */
    state: IngestionState;
  }
  export type IngestionType = "auditLog"|string;
  export interface ListAppAuthorizationsRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The maximum number of results that are returned per call. You can use nextToken to obtain further pages of results. This is only an upper limit. The actual number of results returned per call might be fewer than the specified maximum.
     */
    maxResults?: MaxResults;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: String2048;
  }
  export interface ListAppAuthorizationsResponse {
    /**
     * Contains a list of app authorization summaries.
     */
    appAuthorizationSummaryList: AppAuthorizationSummaryList;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: String2048;
  }
  export interface ListAppBundlesRequest {
    /**
     * The maximum number of results that are returned per call. You can use nextToken to obtain further pages of results. This is only an upper limit. The actual number of results returned per call might be fewer than the specified maximum.
     */
    maxResults?: MaxResults;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: String2048;
  }
  export interface ListAppBundlesResponse {
    /**
     * Contains a list of app bundle summaries.
     */
    appBundleSummaryList: AppBundleSummaryList;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: String2048;
  }
  export interface ListIngestionDestinationsRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the ingestion to use for the request.
     */
    ingestionIdentifier: Identifier;
    /**
     * The maximum number of results that are returned per call. You can use nextToken to obtain further pages of results. This is only an upper limit. The actual number of results returned per call might be fewer than the specified maximum.
     */
    maxResults?: MaxResults;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: String;
  }
  export interface ListIngestionDestinationsResponse {
    /**
     * Contains a list of ingestion destination summaries.
     */
    ingestionDestinations: IngestionDestinationList;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: String;
  }
  export interface ListIngestionsRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The maximum number of results that are returned per call. You can use nextToken to obtain further pages of results. This is only an upper limit. The actual number of results returned per call might be fewer than the specified maximum.
     */
    maxResults?: MaxResults;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: String;
  }
  export interface ListIngestionsResponse {
    /**
     * Contains a list of ingestion summaries.
     */
    ingestions: IngestionList;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource for which you want to retrieve tags.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A map of the key-value pairs for the tag or tags assigned to the specified resource.
     */
    tags?: TagList;
  }
  export type MaxResults = number;
  export interface Oauth2Credential {
    /**
     * The client ID of the client application.
     */
    clientId: String2048;
    /**
     * The client secret of the client application.
     */
    clientSecret: SensitiveString2048;
  }
  export type Persona = "admin"|"endUser"|string;
  export interface ProcessingConfiguration {
    /**
     * Contains information about an audit log processing configuration.
     */
    auditLog?: AuditLogProcessingConfiguration;
  }
  export type RedirectUri = string;
  export type ResultStatus = "IN_PROGRESS"|"COMPLETED"|"FAILED"|"EXPIRED"|string;
  export interface S3Bucket {
    /**
     * The name of the Amazon S3 bucket.
     */
    bucketName: String63;
    /**
     * The object key to use.
     */
    prefix?: String120;
  }
  export type Schema = "ocsf"|"raw"|string;
  export type SensitiveString2048 = string;
  export interface StartIngestionRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the ingestion to use for the request.
     */
    ingestionIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
  }
  export interface StartIngestionResponse {
  }
  export interface StartUserAccessTasksRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The email address of the target user.
     */
    email: Email;
  }
  export interface StartUserAccessTasksResponse {
    /**
     * Contains a list of user access task information.
     */
    userAccessTasksList?: UserAccessTasksList;
  }
  export interface StopIngestionRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the ingestion to use for the request.
     */
    ingestionIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
  }
  export interface StopIngestionResponse {
  }
  export type String = string;
  export type String120 = string;
  export type String2048 = string;
  export type String255 = string;
  export type String63 = string;
  export type String64 = string;
  export interface Tag {
    /**
     * Tag key.
     */
    key: TagKey;
    /**
     * Tag value.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to tag.
     */
    resourceArn: Arn;
    /**
     * A map of the key-value pairs of the tag or tags to assign to the resource.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TaskError {
    /**
     * The code of the error.
     */
    errorCode?: String;
    /**
     * The message of the error.
     */
    errorMessage?: String;
  }
  export type TaskIdList = UUID[];
  export interface Tenant {
    /**
     * The ID of the application tenant.
     */
    tenantIdentifier: TenantIdentifier;
    /**
     * The display name of the tenant.
     */
    tenantDisplayName: String2048;
  }
  export type TenantIdentifier = string;
  export type UUID = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to untag.
     */
    resourceArn: Arn;
    /**
     * The keys of the key-value pairs for the tag or tags you want to remove from the specified resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAppAuthorizationRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app authorization to use for the request.
     */
    appAuthorizationIdentifier: Identifier;
    /**
     * Contains credentials for the application, such as an API key or OAuth2 client ID and secret. Specify credentials that match the authorization type of the app authorization to update. For example, if the authorization type of the app authorization is OAuth2 (oauth2), then you should provide only the OAuth2 credentials.
     */
    credential?: Credential;
    /**
     * Contains information about an application tenant, such as the application display name and identifier.
     */
    tenant?: Tenant;
  }
  export interface UpdateAppAuthorizationResponse {
    /**
     * Contains information about an app authorization.
     */
    appAuthorization: AppAuthorization;
  }
  export interface UpdateIngestionDestinationRequest {
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the app bundle to use for the request.
     */
    appBundleIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the ingestion to use for the request.
     */
    ingestionIdentifier: Identifier;
    /**
     * The Amazon Resource Name (ARN) or Universal Unique Identifier (UUID) of the ingestion destination to use for the request.
     */
    ingestionDestinationIdentifier: Identifier;
    /**
     * Contains information about the destination of ingested data.
     */
    destinationConfiguration: DestinationConfiguration;
  }
  export interface UpdateIngestionDestinationResponse {
    /**
     * Contains information about an ingestion destination.
     */
    ingestionDestination: IngestionDestination;
  }
  export interface UserAccessResultItem {
    /**
     * The name of the application.
     */
    app?: String255;
    /**
     * The ID of the application tenant.
     */
    tenantId?: TenantIdentifier;
    /**
     * The display name of the tenant.
     */
    tenantDisplayName?: String2048;
    /**
     * The unique ID of the task.
     */
    taskId?: UUID;
    /**
     * The status of the user access result item. The following states are possible:    IN_PROGRESS: The user access task is in progress.    COMPLETED: The user access task completed successfully.    FAILED: The user access task failed.    EXPIRED: The user access task expired.  
     */
    resultStatus?: ResultStatus;
    /**
     * The email address of the target user.
     */
    email?: Email;
    /**
     * The unique ID of user.
     */
    userId?: SensitiveString2048;
    /**
     * The full name of the user.
     */
    userFullName?: SensitiveString2048;
    /**
     * The first name of the user.
     */
    userFirstName?: SensitiveString2048;
    /**
     * The last name of the user.
     */
    userLastName?: SensitiveString2048;
    /**
     * The status of the user returned by the application.
     */
    userStatus?: String;
    /**
     * Contains information about an error returned from a user access task.
     */
    taskError?: TaskError;
  }
  export type UserAccessResultsList = UserAccessResultItem[];
  export interface UserAccessTaskItem {
    /**
     * The name of the application.
     */
    app: String255;
    /**
     * The ID of the application tenant.
     */
    tenantId: TenantIdentifier;
    /**
     * The unique ID of the task.
     */
    taskId?: UUID;
    /**
     * Error from the task, if any.
     */
    error?: TaskError;
  }
  export type UserAccessTasksList = UserAccessTaskItem[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2023-05-19"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AppFabric client.
   */
  export import Types = AppFabric;
}
export = AppFabric;
