import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AppSync extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AppSync.Types.ClientConfiguration)
  config: Config & AppSync.Types.ClientConfiguration;
  /**
   * Creates a cache for the GraphQL API.
   */
  createApiCache(params: AppSync.Types.CreateApiCacheRequest, callback?: (err: AWSError, data: AppSync.Types.CreateApiCacheResponse) => void): Request<AppSync.Types.CreateApiCacheResponse, AWSError>;
  /**
   * Creates a cache for the GraphQL API.
   */
  createApiCache(callback?: (err: AWSError, data: AppSync.Types.CreateApiCacheResponse) => void): Request<AppSync.Types.CreateApiCacheResponse, AWSError>;
  /**
   * Creates a unique key that you can distribute to clients who are executing your API.
   */
  createApiKey(params: AppSync.Types.CreateApiKeyRequest, callback?: (err: AWSError, data: AppSync.Types.CreateApiKeyResponse) => void): Request<AppSync.Types.CreateApiKeyResponse, AWSError>;
  /**
   * Creates a unique key that you can distribute to clients who are executing your API.
   */
  createApiKey(callback?: (err: AWSError, data: AppSync.Types.CreateApiKeyResponse) => void): Request<AppSync.Types.CreateApiKeyResponse, AWSError>;
  /**
   * Creates a DataSource object.
   */
  createDataSource(params: AppSync.Types.CreateDataSourceRequest, callback?: (err: AWSError, data: AppSync.Types.CreateDataSourceResponse) => void): Request<AppSync.Types.CreateDataSourceResponse, AWSError>;
  /**
   * Creates a DataSource object.
   */
  createDataSource(callback?: (err: AWSError, data: AppSync.Types.CreateDataSourceResponse) => void): Request<AppSync.Types.CreateDataSourceResponse, AWSError>;
  /**
   * Creates a Function object. A function is a reusable entity. Multiple functions can be used to compose the resolver logic.
   */
  createFunction(params: AppSync.Types.CreateFunctionRequest, callback?: (err: AWSError, data: AppSync.Types.CreateFunctionResponse) => void): Request<AppSync.Types.CreateFunctionResponse, AWSError>;
  /**
   * Creates a Function object. A function is a reusable entity. Multiple functions can be used to compose the resolver logic.
   */
  createFunction(callback?: (err: AWSError, data: AppSync.Types.CreateFunctionResponse) => void): Request<AppSync.Types.CreateFunctionResponse, AWSError>;
  /**
   * Creates a GraphqlApi object.
   */
  createGraphqlApi(params: AppSync.Types.CreateGraphqlApiRequest, callback?: (err: AWSError, data: AppSync.Types.CreateGraphqlApiResponse) => void): Request<AppSync.Types.CreateGraphqlApiResponse, AWSError>;
  /**
   * Creates a GraphqlApi object.
   */
  createGraphqlApi(callback?: (err: AWSError, data: AppSync.Types.CreateGraphqlApiResponse) => void): Request<AppSync.Types.CreateGraphqlApiResponse, AWSError>;
  /**
   * Creates a Resolver object. A resolver converts incoming requests into a format that a data source can understand and converts the data source's responses into GraphQL.
   */
  createResolver(params: AppSync.Types.CreateResolverRequest, callback?: (err: AWSError, data: AppSync.Types.CreateResolverResponse) => void): Request<AppSync.Types.CreateResolverResponse, AWSError>;
  /**
   * Creates a Resolver object. A resolver converts incoming requests into a format that a data source can understand and converts the data source's responses into GraphQL.
   */
  createResolver(callback?: (err: AWSError, data: AppSync.Types.CreateResolverResponse) => void): Request<AppSync.Types.CreateResolverResponse, AWSError>;
  /**
   * Creates a Type object.
   */
  createType(params: AppSync.Types.CreateTypeRequest, callback?: (err: AWSError, data: AppSync.Types.CreateTypeResponse) => void): Request<AppSync.Types.CreateTypeResponse, AWSError>;
  /**
   * Creates a Type object.
   */
  createType(callback?: (err: AWSError, data: AppSync.Types.CreateTypeResponse) => void): Request<AppSync.Types.CreateTypeResponse, AWSError>;
  /**
   * Deletes an ApiCache object.
   */
  deleteApiCache(params: AppSync.Types.DeleteApiCacheRequest, callback?: (err: AWSError, data: AppSync.Types.DeleteApiCacheResponse) => void): Request<AppSync.Types.DeleteApiCacheResponse, AWSError>;
  /**
   * Deletes an ApiCache object.
   */
  deleteApiCache(callback?: (err: AWSError, data: AppSync.Types.DeleteApiCacheResponse) => void): Request<AppSync.Types.DeleteApiCacheResponse, AWSError>;
  /**
   * Deletes an API key.
   */
  deleteApiKey(params: AppSync.Types.DeleteApiKeyRequest, callback?: (err: AWSError, data: AppSync.Types.DeleteApiKeyResponse) => void): Request<AppSync.Types.DeleteApiKeyResponse, AWSError>;
  /**
   * Deletes an API key.
   */
  deleteApiKey(callback?: (err: AWSError, data: AppSync.Types.DeleteApiKeyResponse) => void): Request<AppSync.Types.DeleteApiKeyResponse, AWSError>;
  /**
   * Deletes a DataSource object.
   */
  deleteDataSource(params: AppSync.Types.DeleteDataSourceRequest, callback?: (err: AWSError, data: AppSync.Types.DeleteDataSourceResponse) => void): Request<AppSync.Types.DeleteDataSourceResponse, AWSError>;
  /**
   * Deletes a DataSource object.
   */
  deleteDataSource(callback?: (err: AWSError, data: AppSync.Types.DeleteDataSourceResponse) => void): Request<AppSync.Types.DeleteDataSourceResponse, AWSError>;
  /**
   * Deletes a Function.
   */
  deleteFunction(params: AppSync.Types.DeleteFunctionRequest, callback?: (err: AWSError, data: AppSync.Types.DeleteFunctionResponse) => void): Request<AppSync.Types.DeleteFunctionResponse, AWSError>;
  /**
   * Deletes a Function.
   */
  deleteFunction(callback?: (err: AWSError, data: AppSync.Types.DeleteFunctionResponse) => void): Request<AppSync.Types.DeleteFunctionResponse, AWSError>;
  /**
   * Deletes a GraphqlApi object.
   */
  deleteGraphqlApi(params: AppSync.Types.DeleteGraphqlApiRequest, callback?: (err: AWSError, data: AppSync.Types.DeleteGraphqlApiResponse) => void): Request<AppSync.Types.DeleteGraphqlApiResponse, AWSError>;
  /**
   * Deletes a GraphqlApi object.
   */
  deleteGraphqlApi(callback?: (err: AWSError, data: AppSync.Types.DeleteGraphqlApiResponse) => void): Request<AppSync.Types.DeleteGraphqlApiResponse, AWSError>;
  /**
   * Deletes a Resolver object.
   */
  deleteResolver(params: AppSync.Types.DeleteResolverRequest, callback?: (err: AWSError, data: AppSync.Types.DeleteResolverResponse) => void): Request<AppSync.Types.DeleteResolverResponse, AWSError>;
  /**
   * Deletes a Resolver object.
   */
  deleteResolver(callback?: (err: AWSError, data: AppSync.Types.DeleteResolverResponse) => void): Request<AppSync.Types.DeleteResolverResponse, AWSError>;
  /**
   * Deletes a Type object.
   */
  deleteType(params: AppSync.Types.DeleteTypeRequest, callback?: (err: AWSError, data: AppSync.Types.DeleteTypeResponse) => void): Request<AppSync.Types.DeleteTypeResponse, AWSError>;
  /**
   * Deletes a Type object.
   */
  deleteType(callback?: (err: AWSError, data: AppSync.Types.DeleteTypeResponse) => void): Request<AppSync.Types.DeleteTypeResponse, AWSError>;
  /**
   * Flushes an ApiCache object.
   */
  flushApiCache(params: AppSync.Types.FlushApiCacheRequest, callback?: (err: AWSError, data: AppSync.Types.FlushApiCacheResponse) => void): Request<AppSync.Types.FlushApiCacheResponse, AWSError>;
  /**
   * Flushes an ApiCache object.
   */
  flushApiCache(callback?: (err: AWSError, data: AppSync.Types.FlushApiCacheResponse) => void): Request<AppSync.Types.FlushApiCacheResponse, AWSError>;
  /**
   * Retrieves an ApiCache object.
   */
  getApiCache(params: AppSync.Types.GetApiCacheRequest, callback?: (err: AWSError, data: AppSync.Types.GetApiCacheResponse) => void): Request<AppSync.Types.GetApiCacheResponse, AWSError>;
  /**
   * Retrieves an ApiCache object.
   */
  getApiCache(callback?: (err: AWSError, data: AppSync.Types.GetApiCacheResponse) => void): Request<AppSync.Types.GetApiCacheResponse, AWSError>;
  /**
   * Retrieves a DataSource object.
   */
  getDataSource(params: AppSync.Types.GetDataSourceRequest, callback?: (err: AWSError, data: AppSync.Types.GetDataSourceResponse) => void): Request<AppSync.Types.GetDataSourceResponse, AWSError>;
  /**
   * Retrieves a DataSource object.
   */
  getDataSource(callback?: (err: AWSError, data: AppSync.Types.GetDataSourceResponse) => void): Request<AppSync.Types.GetDataSourceResponse, AWSError>;
  /**
   * Get a Function.
   */
  getFunction(params: AppSync.Types.GetFunctionRequest, callback?: (err: AWSError, data: AppSync.Types.GetFunctionResponse) => void): Request<AppSync.Types.GetFunctionResponse, AWSError>;
  /**
   * Get a Function.
   */
  getFunction(callback?: (err: AWSError, data: AppSync.Types.GetFunctionResponse) => void): Request<AppSync.Types.GetFunctionResponse, AWSError>;
  /**
   * Retrieves a GraphqlApi object.
   */
  getGraphqlApi(params: AppSync.Types.GetGraphqlApiRequest, callback?: (err: AWSError, data: AppSync.Types.GetGraphqlApiResponse) => void): Request<AppSync.Types.GetGraphqlApiResponse, AWSError>;
  /**
   * Retrieves a GraphqlApi object.
   */
  getGraphqlApi(callback?: (err: AWSError, data: AppSync.Types.GetGraphqlApiResponse) => void): Request<AppSync.Types.GetGraphqlApiResponse, AWSError>;
  /**
   * Retrieves the introspection schema for a GraphQL API.
   */
  getIntrospectionSchema(params: AppSync.Types.GetIntrospectionSchemaRequest, callback?: (err: AWSError, data: AppSync.Types.GetIntrospectionSchemaResponse) => void): Request<AppSync.Types.GetIntrospectionSchemaResponse, AWSError>;
  /**
   * Retrieves the introspection schema for a GraphQL API.
   */
  getIntrospectionSchema(callback?: (err: AWSError, data: AppSync.Types.GetIntrospectionSchemaResponse) => void): Request<AppSync.Types.GetIntrospectionSchemaResponse, AWSError>;
  /**
   * Retrieves a Resolver object.
   */
  getResolver(params: AppSync.Types.GetResolverRequest, callback?: (err: AWSError, data: AppSync.Types.GetResolverResponse) => void): Request<AppSync.Types.GetResolverResponse, AWSError>;
  /**
   * Retrieves a Resolver object.
   */
  getResolver(callback?: (err: AWSError, data: AppSync.Types.GetResolverResponse) => void): Request<AppSync.Types.GetResolverResponse, AWSError>;
  /**
   * Retrieves the current status of a schema creation operation.
   */
  getSchemaCreationStatus(params: AppSync.Types.GetSchemaCreationStatusRequest, callback?: (err: AWSError, data: AppSync.Types.GetSchemaCreationStatusResponse) => void): Request<AppSync.Types.GetSchemaCreationStatusResponse, AWSError>;
  /**
   * Retrieves the current status of a schema creation operation.
   */
  getSchemaCreationStatus(callback?: (err: AWSError, data: AppSync.Types.GetSchemaCreationStatusResponse) => void): Request<AppSync.Types.GetSchemaCreationStatusResponse, AWSError>;
  /**
   * Retrieves a Type object.
   */
  getType(params: AppSync.Types.GetTypeRequest, callback?: (err: AWSError, data: AppSync.Types.GetTypeResponse) => void): Request<AppSync.Types.GetTypeResponse, AWSError>;
  /**
   * Retrieves a Type object.
   */
  getType(callback?: (err: AWSError, data: AppSync.Types.GetTypeResponse) => void): Request<AppSync.Types.GetTypeResponse, AWSError>;
  /**
   * Lists the API keys for a given API.  API keys are deleted automatically 60 days after they expire. However, they may still be included in the response until they have actually been deleted. You can safely call DeleteApiKey to manually delete a key before it's automatically deleted. 
   */
  listApiKeys(params: AppSync.Types.ListApiKeysRequest, callback?: (err: AWSError, data: AppSync.Types.ListApiKeysResponse) => void): Request<AppSync.Types.ListApiKeysResponse, AWSError>;
  /**
   * Lists the API keys for a given API.  API keys are deleted automatically 60 days after they expire. However, they may still be included in the response until they have actually been deleted. You can safely call DeleteApiKey to manually delete a key before it's automatically deleted. 
   */
  listApiKeys(callback?: (err: AWSError, data: AppSync.Types.ListApiKeysResponse) => void): Request<AppSync.Types.ListApiKeysResponse, AWSError>;
  /**
   * Lists the data sources for a given API.
   */
  listDataSources(params: AppSync.Types.ListDataSourcesRequest, callback?: (err: AWSError, data: AppSync.Types.ListDataSourcesResponse) => void): Request<AppSync.Types.ListDataSourcesResponse, AWSError>;
  /**
   * Lists the data sources for a given API.
   */
  listDataSources(callback?: (err: AWSError, data: AppSync.Types.ListDataSourcesResponse) => void): Request<AppSync.Types.ListDataSourcesResponse, AWSError>;
  /**
   * List multiple functions.
   */
  listFunctions(params: AppSync.Types.ListFunctionsRequest, callback?: (err: AWSError, data: AppSync.Types.ListFunctionsResponse) => void): Request<AppSync.Types.ListFunctionsResponse, AWSError>;
  /**
   * List multiple functions.
   */
  listFunctions(callback?: (err: AWSError, data: AppSync.Types.ListFunctionsResponse) => void): Request<AppSync.Types.ListFunctionsResponse, AWSError>;
  /**
   * Lists your GraphQL APIs.
   */
  listGraphqlApis(params: AppSync.Types.ListGraphqlApisRequest, callback?: (err: AWSError, data: AppSync.Types.ListGraphqlApisResponse) => void): Request<AppSync.Types.ListGraphqlApisResponse, AWSError>;
  /**
   * Lists your GraphQL APIs.
   */
  listGraphqlApis(callback?: (err: AWSError, data: AppSync.Types.ListGraphqlApisResponse) => void): Request<AppSync.Types.ListGraphqlApisResponse, AWSError>;
  /**
   * Lists the resolvers for a given API and type.
   */
  listResolvers(params: AppSync.Types.ListResolversRequest, callback?: (err: AWSError, data: AppSync.Types.ListResolversResponse) => void): Request<AppSync.Types.ListResolversResponse, AWSError>;
  /**
   * Lists the resolvers for a given API and type.
   */
  listResolvers(callback?: (err: AWSError, data: AppSync.Types.ListResolversResponse) => void): Request<AppSync.Types.ListResolversResponse, AWSError>;
  /**
   * List the resolvers that are associated with a specific function.
   */
  listResolversByFunction(params: AppSync.Types.ListResolversByFunctionRequest, callback?: (err: AWSError, data: AppSync.Types.ListResolversByFunctionResponse) => void): Request<AppSync.Types.ListResolversByFunctionResponse, AWSError>;
  /**
   * List the resolvers that are associated with a specific function.
   */
  listResolversByFunction(callback?: (err: AWSError, data: AppSync.Types.ListResolversByFunctionResponse) => void): Request<AppSync.Types.ListResolversByFunctionResponse, AWSError>;
  /**
   * Lists the tags for a resource.
   */
  listTagsForResource(params: AppSync.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: AppSync.Types.ListTagsForResourceResponse) => void): Request<AppSync.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: AppSync.Types.ListTagsForResourceResponse) => void): Request<AppSync.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the types for a given API.
   */
  listTypes(params: AppSync.Types.ListTypesRequest, callback?: (err: AWSError, data: AppSync.Types.ListTypesResponse) => void): Request<AppSync.Types.ListTypesResponse, AWSError>;
  /**
   * Lists the types for a given API.
   */
  listTypes(callback?: (err: AWSError, data: AppSync.Types.ListTypesResponse) => void): Request<AppSync.Types.ListTypesResponse, AWSError>;
  /**
   * Adds a new schema to your GraphQL API. This operation is asynchronous. Use to determine when it has completed.
   */
  startSchemaCreation(params: AppSync.Types.StartSchemaCreationRequest, callback?: (err: AWSError, data: AppSync.Types.StartSchemaCreationResponse) => void): Request<AppSync.Types.StartSchemaCreationResponse, AWSError>;
  /**
   * Adds a new schema to your GraphQL API. This operation is asynchronous. Use to determine when it has completed.
   */
  startSchemaCreation(callback?: (err: AWSError, data: AppSync.Types.StartSchemaCreationResponse) => void): Request<AppSync.Types.StartSchemaCreationResponse, AWSError>;
  /**
   * Tags a resource with user-supplied tags.
   */
  tagResource(params: AppSync.Types.TagResourceRequest, callback?: (err: AWSError, data: AppSync.Types.TagResourceResponse) => void): Request<AppSync.Types.TagResourceResponse, AWSError>;
  /**
   * Tags a resource with user-supplied tags.
   */
  tagResource(callback?: (err: AWSError, data: AppSync.Types.TagResourceResponse) => void): Request<AppSync.Types.TagResourceResponse, AWSError>;
  /**
   * Untags a resource.
   */
  untagResource(params: AppSync.Types.UntagResourceRequest, callback?: (err: AWSError, data: AppSync.Types.UntagResourceResponse) => void): Request<AppSync.Types.UntagResourceResponse, AWSError>;
  /**
   * Untags a resource.
   */
  untagResource(callback?: (err: AWSError, data: AppSync.Types.UntagResourceResponse) => void): Request<AppSync.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the cache for the GraphQL API.
   */
  updateApiCache(params: AppSync.Types.UpdateApiCacheRequest, callback?: (err: AWSError, data: AppSync.Types.UpdateApiCacheResponse) => void): Request<AppSync.Types.UpdateApiCacheResponse, AWSError>;
  /**
   * Updates the cache for the GraphQL API.
   */
  updateApiCache(callback?: (err: AWSError, data: AppSync.Types.UpdateApiCacheResponse) => void): Request<AppSync.Types.UpdateApiCacheResponse, AWSError>;
  /**
   * Updates an API key. The key can be updated while it is not deleted.
   */
  updateApiKey(params: AppSync.Types.UpdateApiKeyRequest, callback?: (err: AWSError, data: AppSync.Types.UpdateApiKeyResponse) => void): Request<AppSync.Types.UpdateApiKeyResponse, AWSError>;
  /**
   * Updates an API key. The key can be updated while it is not deleted.
   */
  updateApiKey(callback?: (err: AWSError, data: AppSync.Types.UpdateApiKeyResponse) => void): Request<AppSync.Types.UpdateApiKeyResponse, AWSError>;
  /**
   * Updates a DataSource object.
   */
  updateDataSource(params: AppSync.Types.UpdateDataSourceRequest, callback?: (err: AWSError, data: AppSync.Types.UpdateDataSourceResponse) => void): Request<AppSync.Types.UpdateDataSourceResponse, AWSError>;
  /**
   * Updates a DataSource object.
   */
  updateDataSource(callback?: (err: AWSError, data: AppSync.Types.UpdateDataSourceResponse) => void): Request<AppSync.Types.UpdateDataSourceResponse, AWSError>;
  /**
   * Updates a Function object.
   */
  updateFunction(params: AppSync.Types.UpdateFunctionRequest, callback?: (err: AWSError, data: AppSync.Types.UpdateFunctionResponse) => void): Request<AppSync.Types.UpdateFunctionResponse, AWSError>;
  /**
   * Updates a Function object.
   */
  updateFunction(callback?: (err: AWSError, data: AppSync.Types.UpdateFunctionResponse) => void): Request<AppSync.Types.UpdateFunctionResponse, AWSError>;
  /**
   * Updates a GraphqlApi object.
   */
  updateGraphqlApi(params: AppSync.Types.UpdateGraphqlApiRequest, callback?: (err: AWSError, data: AppSync.Types.UpdateGraphqlApiResponse) => void): Request<AppSync.Types.UpdateGraphqlApiResponse, AWSError>;
  /**
   * Updates a GraphqlApi object.
   */
  updateGraphqlApi(callback?: (err: AWSError, data: AppSync.Types.UpdateGraphqlApiResponse) => void): Request<AppSync.Types.UpdateGraphqlApiResponse, AWSError>;
  /**
   * Updates a Resolver object.
   */
  updateResolver(params: AppSync.Types.UpdateResolverRequest, callback?: (err: AWSError, data: AppSync.Types.UpdateResolverResponse) => void): Request<AppSync.Types.UpdateResolverResponse, AWSError>;
  /**
   * Updates a Resolver object.
   */
  updateResolver(callback?: (err: AWSError, data: AppSync.Types.UpdateResolverResponse) => void): Request<AppSync.Types.UpdateResolverResponse, AWSError>;
  /**
   * Updates a Type object.
   */
  updateType(params: AppSync.Types.UpdateTypeRequest, callback?: (err: AWSError, data: AppSync.Types.UpdateTypeResponse) => void): Request<AppSync.Types.UpdateTypeResponse, AWSError>;
  /**
   * Updates a Type object.
   */
  updateType(callback?: (err: AWSError, data: AppSync.Types.UpdateTypeResponse) => void): Request<AppSync.Types.UpdateTypeResponse, AWSError>;
}
declare namespace AppSync {
  export interface AdditionalAuthenticationProvider {
    /**
     * The authentication type: API key, Identity and Access Management, OIDC, Amazon Cognito user pools, or Amazon Web Services Lambda.
     */
    authenticationType?: AuthenticationType;
    /**
     * The OpenID Connect configuration.
     */
    openIDConnectConfig?: OpenIDConnectConfig;
    /**
     * The Amazon Cognito user pool configuration.
     */
    userPoolConfig?: CognitoUserPoolConfig;
    /**
     * Configuration for Amazon Web Services Lambda function authorization.
     */
    lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
  }
  export type AdditionalAuthenticationProviders = AdditionalAuthenticationProvider[];
  export interface ApiCache {
    /**
     * TTL in seconds for cache entries. Valid values are between 1 and 3600 seconds.
     */
    ttl?: Long;
    /**
     * Caching behavior.    FULL_REQUEST_CACHING: All requests are fully cached.    PER_RESOLVER_CACHING: Individual resolvers that you specify are cached.  
     */
    apiCachingBehavior?: ApiCachingBehavior;
    /**
     * Transit encryption flag when connecting to cache. This setting cannot be updated after creation.
     */
    transitEncryptionEnabled?: Boolean;
    /**
     * At rest encryption flag for cache. This setting cannot be updated after creation.
     */
    atRestEncryptionEnabled?: Boolean;
    /**
     * The cache instance type. Valid values are     SMALL     MEDIUM     LARGE     XLARGE     LARGE_2X     LARGE_4X     LARGE_8X (not available in all regions)    LARGE_12X    Historically, instance types were identified by an EC2-style value. As of July 2020, this is deprecated, and the generic identifiers above should be used. The following legacy instance types are available, but their use is discouraged:    T2_SMALL: A t2.small instance type.    T2_MEDIUM: A t2.medium instance type.    R4_LARGE: A r4.large instance type.    R4_XLARGE: A r4.xlarge instance type.    R4_2XLARGE: A r4.2xlarge instance type.    R4_4XLARGE: A r4.4xlarge instance type.    R4_8XLARGE: A r4.8xlarge instance type.  
     */
    type?: ApiCacheType;
    /**
     * The cache instance status.    AVAILABLE: The instance is available for use.    CREATING: The instance is currently creating.    DELETING: The instance is currently deleting.    MODIFYING: The instance is currently modifying.    FAILED: The instance has failed creation.  
     */
    status?: ApiCacheStatus;
  }
  export type ApiCacheStatus = "AVAILABLE"|"CREATING"|"DELETING"|"MODIFYING"|"FAILED"|string;
  export type ApiCacheType = "T2_SMALL"|"T2_MEDIUM"|"R4_LARGE"|"R4_XLARGE"|"R4_2XLARGE"|"R4_4XLARGE"|"R4_8XLARGE"|"SMALL"|"MEDIUM"|"LARGE"|"XLARGE"|"LARGE_2X"|"LARGE_4X"|"LARGE_8X"|"LARGE_12X"|string;
  export type ApiCachingBehavior = "FULL_REQUEST_CACHING"|"PER_RESOLVER_CACHING"|string;
  export interface ApiKey {
    /**
     * The API key ID.
     */
    id?: String;
    /**
     * A description of the purpose of the API key.
     */
    description?: String;
    /**
     * The time after which the API key expires. The date is represented as seconds since the epoch, rounded down to the nearest hour.
     */
    expires?: Long;
    /**
     * The time after which the API key is deleted. The date is represented as seconds since the epoch, rounded down to the nearest hour.
     */
    deletes?: Long;
  }
  export type ApiKeys = ApiKey[];
  export type AuthenticationType = "API_KEY"|"AWS_IAM"|"AMAZON_COGNITO_USER_POOLS"|"OPENID_CONNECT"|"AWS_LAMBDA"|string;
  export interface AuthorizationConfig {
    /**
     * The authorization type required by the HTTP endpoint.    AWS_IAM: The authorization type is Sigv4.  
     */
    authorizationType: AuthorizationType;
    /**
     * The Identity and Access Management settings.
     */
    awsIamConfig?: AwsIamConfig;
  }
  export type AuthorizationType = "AWS_IAM"|string;
  export interface AwsIamConfig {
    /**
     * The signing region for Identity and Access Management authorization.
     */
    signingRegion?: String;
    /**
     * The signing service name for Identity and Access Management authorization.
     */
    signingServiceName?: String;
  }
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export type Boolean = boolean;
  export type BooleanValue = boolean;
  export interface CachingConfig {
    /**
     * The TTL in seconds for a resolver that has caching enabled. Valid values are between 1 and 3600 seconds.
     */
    ttl?: Long;
    /**
     * The caching keys for a resolver that has caching enabled. Valid values are entries from the $context.arguments, $context.source, and $context.identity maps.
     */
    cachingKeys?: CachingKeys;
  }
  export type CachingKeys = String[];
  export interface CognitoUserPoolConfig {
    /**
     * The user pool ID.
     */
    userPoolId: String;
    /**
     * The Amazon Web Services Region in which the user pool was created.
     */
    awsRegion: String;
    /**
     * A regular expression for validating the incoming Amazon Cognito user pool app client ID.
     */
    appIdClientRegex?: String;
  }
  export type ConflictDetectionType = "VERSION"|"NONE"|string;
  export type ConflictHandlerType = "OPTIMISTIC_CONCURRENCY"|"LAMBDA"|"AUTOMERGE"|"NONE"|string;
  export interface CreateApiCacheRequest {
    /**
     * The GraphQL API Id.
     */
    apiId: String;
    /**
     * TTL in seconds for cache entries. Valid values are between 1 and 3600 seconds.
     */
    ttl: Long;
    /**
     * Transit encryption flag when connecting to cache. This setting cannot be updated after creation.
     */
    transitEncryptionEnabled?: Boolean;
    /**
     * At rest encryption flag for cache. This setting cannot be updated after creation.
     */
    atRestEncryptionEnabled?: Boolean;
    /**
     * Caching behavior.    FULL_REQUEST_CACHING: All requests are fully cached.    PER_RESOLVER_CACHING: Individual resolvers that you specify are cached.  
     */
    apiCachingBehavior: ApiCachingBehavior;
    /**
     * The cache instance type. Valid values are     SMALL     MEDIUM     LARGE     XLARGE     LARGE_2X     LARGE_4X     LARGE_8X (not available in all regions)    LARGE_12X    Historically, instance types were identified by an EC2-style value. As of July 2020, this is deprecated, and the generic identifiers above should be used. The following legacy instance types are available, but their use is discouraged:    T2_SMALL: A t2.small instance type.    T2_MEDIUM: A t2.medium instance type.    R4_LARGE: A r4.large instance type.    R4_XLARGE: A r4.xlarge instance type.    R4_2XLARGE: A r4.2xlarge instance type.    R4_4XLARGE: A r4.4xlarge instance type.    R4_8XLARGE: A r4.8xlarge instance type.  
     */
    type: ApiCacheType;
  }
  export interface CreateApiCacheResponse {
    /**
     * The ApiCache object.
     */
    apiCache?: ApiCache;
  }
  export interface CreateApiKeyRequest {
    /**
     * The ID for your GraphQL API.
     */
    apiId: String;
    /**
     * A description of the purpose of the API key.
     */
    description?: String;
    /**
     * The time from creation time after which the API key expires. The date is represented as seconds since the epoch, rounded down to the nearest hour. The default value for this parameter is 7 days from creation time. For more information, see .
     */
    expires?: Long;
  }
  export interface CreateApiKeyResponse {
    /**
     * The API key.
     */
    apiKey?: ApiKey;
  }
  export interface CreateDataSourceRequest {
    /**
     * The API ID for the GraphQL API for the DataSource.
     */
    apiId: String;
    /**
     * A user-supplied name for the DataSource.
     */
    name: ResourceName;
    /**
     * A description of the DataSource.
     */
    description?: String;
    /**
     * The type of the DataSource.
     */
    type: DataSourceType;
    /**
     * The Identity and Access Management service role ARN for the data source. The system assumes this role when accessing the data source.
     */
    serviceRoleArn?: String;
    /**
     * Amazon DynamoDB settings.
     */
    dynamodbConfig?: DynamodbDataSourceConfig;
    /**
     * Amazon Web Services Lambda settings.
     */
    lambdaConfig?: LambdaDataSourceConfig;
    /**
     * Amazon OpenSearch Service settings. As of September 2021, Amazon Elasticsearch service is Amazon OpenSearch Service. This configuration is deprecated. For new data sources, use CreateDataSourceRequest$openSearchServiceConfig to create an OpenSearch data source.
     */
    elasticsearchConfig?: ElasticsearchDataSourceConfig;
    /**
     * Amazon OpenSearch Service settings.
     */
    openSearchServiceConfig?: OpenSearchServiceDataSourceConfig;
    /**
     * HTTP endpoint settings.
     */
    httpConfig?: HttpDataSourceConfig;
    /**
     * Relational database settings.
     */
    relationalDatabaseConfig?: RelationalDatabaseDataSourceConfig;
  }
  export interface CreateDataSourceResponse {
    /**
     * The DataSource object.
     */
    dataSource?: DataSource;
  }
  export interface CreateFunctionRequest {
    /**
     * The GraphQL API ID.
     */
    apiId: String;
    /**
     * The Function name. The function name does not have to be unique.
     */
    name: ResourceName;
    /**
     * The Function description.
     */
    description?: String;
    /**
     * The Function DataSource name.
     */
    dataSourceName: ResourceName;
    /**
     * The Function request mapping template. Functions support only the 2018-05-29 version of the request mapping template.
     */
    requestMappingTemplate?: MappingTemplate;
    /**
     * The Function response mapping template. 
     */
    responseMappingTemplate?: MappingTemplate;
    /**
     * The version of the request mapping template. Currently the supported value is 2018-05-29. 
     */
    functionVersion: String;
    syncConfig?: SyncConfig;
  }
  export interface CreateFunctionResponse {
    /**
     * The Function object.
     */
    functionConfiguration?: FunctionConfiguration;
  }
  export interface CreateGraphqlApiRequest {
    /**
     * A user-supplied name for the GraphqlApi.
     */
    name: String;
    /**
     * The Amazon CloudWatch Logs configuration.
     */
    logConfig?: LogConfig;
    /**
     * The authentication type: API key, Identity and Access Management, OIDC, Amazon Cognito user pools, or Amazon Web Services Lambda.
     */
    authenticationType: AuthenticationType;
    /**
     * The Amazon Cognito user pool configuration.
     */
    userPoolConfig?: UserPoolConfig;
    /**
     * The OpenID Connect configuration.
     */
    openIDConnectConfig?: OpenIDConnectConfig;
    /**
     * A TagMap object.
     */
    tags?: TagMap;
    /**
     * A list of additional authentication providers for the GraphqlApi API.
     */
    additionalAuthenticationProviders?: AdditionalAuthenticationProviders;
    /**
     * A flag indicating whether to enable X-Ray tracing for the GraphqlApi.
     */
    xrayEnabled?: Boolean;
    /**
     * Configuration for Amazon Web Services Lambda function authorization.
     */
    lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
  }
  export interface CreateGraphqlApiResponse {
    /**
     * The GraphqlApi.
     */
    graphqlApi?: GraphqlApi;
  }
  export interface CreateResolverRequest {
    /**
     * The ID for the GraphQL API for which the resolver is being created.
     */
    apiId: String;
    /**
     * The name of the Type.
     */
    typeName: ResourceName;
    /**
     * The name of the field to attach the resolver to.
     */
    fieldName: ResourceName;
    /**
     * The name of the data source for which the resolver is being created.
     */
    dataSourceName?: ResourceName;
    /**
     * The mapping template to be used for requests. A resolver uses a request mapping template to convert a GraphQL expression into a format that a data source can understand. Mapping templates are written in Apache Velocity Template Language (VTL). VTL request mapping templates are optional when using a Lambda data source. For all other data sources, VTL request and response mapping templates are required.
     */
    requestMappingTemplate?: MappingTemplate;
    /**
     * The mapping template to be used for responses from the data source.
     */
    responseMappingTemplate?: MappingTemplate;
    /**
     * The resolver type.    UNIT: A UNIT resolver type. A UNIT resolver is the default resolver type. A UNIT resolver enables you to execute a GraphQL query against a single data source.    PIPELINE: A PIPELINE resolver type. A PIPELINE resolver enables you to execute a series of Function in a serial manner. You can use a pipeline resolver to execute a GraphQL query against multiple data sources.  
     */
    kind?: ResolverKind;
    /**
     * The PipelineConfig.
     */
    pipelineConfig?: PipelineConfig;
    /**
     * The SyncConfig for a resolver attached to a versioned datasource.
     */
    syncConfig?: SyncConfig;
    /**
     * The caching configuration for the resolver.
     */
    cachingConfig?: CachingConfig;
  }
  export interface CreateResolverResponse {
    /**
     * The Resolver object.
     */
    resolver?: Resolver;
  }
  export interface CreateTypeRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The type definition, in GraphQL Schema Definition Language (SDL) format. For more information, see the GraphQL SDL documentation.
     */
    definition: String;
    /**
     * The type format: SDL or JSON.
     */
    format: TypeDefinitionFormat;
  }
  export interface CreateTypeResponse {
    /**
     * The Type object.
     */
    type?: Type;
  }
  export interface DataSource {
    /**
     * The data source ARN.
     */
    dataSourceArn?: String;
    /**
     * The name of the data source.
     */
    name?: ResourceName;
    /**
     * The description of the data source.
     */
    description?: String;
    /**
     * The type of the data source.    AWS_LAMBDA: The data source is an Amazon Web Services Lambda function.    AMAZON_DYNAMODB: The data source is an Amazon DynamoDB table.    AMAZON_ELASTICSEARCH: The data source is an Amazon OpenSearch Service domain.    AMAZON_OPENSEARCH_SERVICE: The data source is an Amazon OpenSearch Service domain.    NONE: There is no data source. This type is used when you wish to invoke a GraphQL operation without connecting to a data source, such as performing data transformation with resolvers or triggering a subscription to be invoked from a mutation.    HTTP: The data source is an HTTP endpoint.    RELATIONAL_DATABASE: The data source is a relational database.  
     */
    type?: DataSourceType;
    /**
     * The Identity and Access Management service role ARN for the data source. The system assumes this role when accessing the data source.
     */
    serviceRoleArn?: String;
    /**
     * Amazon DynamoDB settings.
     */
    dynamodbConfig?: DynamodbDataSourceConfig;
    /**
     * Amazon Web Services Lambda settings.
     */
    lambdaConfig?: LambdaDataSourceConfig;
    /**
     * Amazon OpenSearch Service settings.
     */
    elasticsearchConfig?: ElasticsearchDataSourceConfig;
    /**
     * Amazon OpenSearch Service settings.
     */
    openSearchServiceConfig?: OpenSearchServiceDataSourceConfig;
    /**
     * HTTP endpoint settings.
     */
    httpConfig?: HttpDataSourceConfig;
    /**
     * Relational database settings.
     */
    relationalDatabaseConfig?: RelationalDatabaseDataSourceConfig;
  }
  export type DataSourceType = "AWS_LAMBDA"|"AMAZON_DYNAMODB"|"AMAZON_ELASTICSEARCH"|"NONE"|"HTTP"|"RELATIONAL_DATABASE"|"AMAZON_OPENSEARCH_SERVICE"|string;
  export type DataSources = DataSource[];
  export type DefaultAction = "ALLOW"|"DENY"|string;
  export interface DeleteApiCacheRequest {
    /**
     * The API ID.
     */
    apiId: String;
  }
  export interface DeleteApiCacheResponse {
  }
  export interface DeleteApiKeyRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The ID for the API key.
     */
    id: String;
  }
  export interface DeleteApiKeyResponse {
  }
  export interface DeleteDataSourceRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The name of the data source.
     */
    name: ResourceName;
  }
  export interface DeleteDataSourceResponse {
  }
  export interface DeleteFunctionRequest {
    /**
     * The GraphQL API ID.
     */
    apiId: String;
    /**
     * The Function ID.
     */
    functionId: ResourceName;
  }
  export interface DeleteFunctionResponse {
  }
  export interface DeleteGraphqlApiRequest {
    /**
     * The API ID.
     */
    apiId: String;
  }
  export interface DeleteGraphqlApiResponse {
  }
  export interface DeleteResolverRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The name of the resolver type.
     */
    typeName: ResourceName;
    /**
     * The resolver field name.
     */
    fieldName: ResourceName;
  }
  export interface DeleteResolverResponse {
  }
  export interface DeleteTypeRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The type name.
     */
    typeName: ResourceName;
  }
  export interface DeleteTypeResponse {
  }
  export interface DeltaSyncConfig {
    /**
     * The number of minutes an Item is stored in the datasource.
     */
    baseTableTTL?: Long;
    /**
     * The Delta Sync table name.
     */
    deltaSyncTableName?: String;
    /**
     * The number of minutes a Delta Sync log entry is stored in the Delta Sync table.
     */
    deltaSyncTableTTL?: Long;
  }
  export interface DynamodbDataSourceConfig {
    /**
     * The table name.
     */
    tableName: String;
    /**
     * The Amazon Web Services Region.
     */
    awsRegion: String;
    /**
     * Set to TRUE to use Amazon Cognito credentials with this data source.
     */
    useCallerCredentials?: Boolean;
    /**
     * The DeltaSyncConfig for a versioned datasource.
     */
    deltaSyncConfig?: DeltaSyncConfig;
    /**
     * Set to TRUE to use Conflict Detection and Resolution with this data source.
     */
    versioned?: Boolean;
  }
  export interface ElasticsearchDataSourceConfig {
    /**
     * The endpoint.
     */
    endpoint: String;
    /**
     * The Amazon Web Services Region.
     */
    awsRegion: String;
  }
  export type FieldLogLevel = "NONE"|"ERROR"|"ALL"|string;
  export interface FlushApiCacheRequest {
    /**
     * The API ID.
     */
    apiId: String;
  }
  export interface FlushApiCacheResponse {
  }
  export interface FunctionConfiguration {
    /**
     * A unique ID representing the Function object.
     */
    functionId?: String;
    /**
     * The ARN of the Function object.
     */
    functionArn?: String;
    /**
     * The name of the Function object.
     */
    name?: ResourceName;
    /**
     * The Function description.
     */
    description?: String;
    /**
     * The name of the DataSource.
     */
    dataSourceName?: ResourceName;
    /**
     * The Function request mapping template. Functions support only the 2018-05-29 version of the request mapping template.
     */
    requestMappingTemplate?: MappingTemplate;
    /**
     * The Function response mapping template.
     */
    responseMappingTemplate?: MappingTemplate;
    /**
     * The version of the request mapping template. Currently only the 2018-05-29 version of the template is supported.
     */
    functionVersion?: String;
    syncConfig?: SyncConfig;
  }
  export type Functions = FunctionConfiguration[];
  export type FunctionsIds = String[];
  export interface GetApiCacheRequest {
    /**
     * The API ID.
     */
    apiId: String;
  }
  export interface GetApiCacheResponse {
    /**
     * The ApiCache object.
     */
    apiCache?: ApiCache;
  }
  export interface GetDataSourceRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The name of the data source.
     */
    name: ResourceName;
  }
  export interface GetDataSourceResponse {
    /**
     * The DataSource object.
     */
    dataSource?: DataSource;
  }
  export interface GetFunctionRequest {
    /**
     * The GraphQL API ID.
     */
    apiId: String;
    /**
     * The Function ID.
     */
    functionId: ResourceName;
  }
  export interface GetFunctionResponse {
    /**
     * The Function object.
     */
    functionConfiguration?: FunctionConfiguration;
  }
  export interface GetGraphqlApiRequest {
    /**
     * The API ID for the GraphQL API.
     */
    apiId: String;
  }
  export interface GetGraphqlApiResponse {
    /**
     * The GraphqlApi object.
     */
    graphqlApi?: GraphqlApi;
  }
  export interface GetIntrospectionSchemaRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The schema format: SDL or JSON.
     */
    format: OutputType;
    /**
     * A flag that specifies whether the schema introspection should contain directives.
     */
    includeDirectives?: BooleanValue;
  }
  export interface GetIntrospectionSchemaResponse {
    /**
     * The schema, in GraphQL Schema Definition Language (SDL) format. For more information, see the GraphQL SDL documentation.
     */
    schema?: _Blob;
  }
  export interface GetResolverRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The resolver type name.
     */
    typeName: ResourceName;
    /**
     * The resolver field name.
     */
    fieldName: ResourceName;
  }
  export interface GetResolverResponse {
    /**
     * The Resolver object.
     */
    resolver?: Resolver;
  }
  export interface GetSchemaCreationStatusRequest {
    /**
     * The API ID.
     */
    apiId: String;
  }
  export interface GetSchemaCreationStatusResponse {
    /**
     * The current state of the schema (PROCESSING, FAILED, SUCCESS, or NOT_APPLICABLE). When the schema is in the ACTIVE state, you can add data.
     */
    status?: SchemaStatus;
    /**
     * Detailed information about the status of the schema creation operation.
     */
    details?: String;
  }
  export interface GetTypeRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The type name.
     */
    typeName: ResourceName;
    /**
     * The type format: SDL or JSON.
     */
    format: TypeDefinitionFormat;
  }
  export interface GetTypeResponse {
    /**
     * The Type object.
     */
    type?: Type;
  }
  export interface GraphqlApi {
    /**
     * The API name.
     */
    name?: ResourceName;
    /**
     * The API ID.
     */
    apiId?: String;
    /**
     * The authentication type.
     */
    authenticationType?: AuthenticationType;
    /**
     * The Amazon CloudWatch Logs configuration.
     */
    logConfig?: LogConfig;
    /**
     * The Amazon Cognito user pool configuration.
     */
    userPoolConfig?: UserPoolConfig;
    /**
     * The OpenID Connect configuration.
     */
    openIDConnectConfig?: OpenIDConnectConfig;
    /**
     * The ARN.
     */
    arn?: String;
    /**
     * The URIs.
     */
    uris?: MapOfStringToString;
    /**
     * The tags.
     */
    tags?: TagMap;
    /**
     * A list of additional authentication providers for the GraphqlApi API.
     */
    additionalAuthenticationProviders?: AdditionalAuthenticationProviders;
    /**
     * A flag representing whether X-Ray tracing is enabled for this GraphqlApi.
     */
    xrayEnabled?: Boolean;
    /**
     * The ARN of the WAF ACL associated with this GraphqlApi, if one exists.
     */
    wafWebAclArn?: String;
    /**
     * Configuration for Amazon Web Services Lambda function authorization.
     */
    lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
  }
  export type GraphqlApis = GraphqlApi[];
  export interface HttpDataSourceConfig {
    /**
     * The HTTP URL endpoint. You can either specify the domain name or IP, and port combination, and the URL scheme must be HTTP or HTTPS. If the port is not specified, AppSync uses the default port 80 for the HTTP endpoint and port 443 for HTTPS endpoints.
     */
    endpoint?: String;
    /**
     * The authorization config in case the HTTP endpoint requires authorization.
     */
    authorizationConfig?: AuthorizationConfig;
  }
  export interface LambdaAuthorizerConfig {
    /**
     * The number of seconds a response should be cached for. The default is 5 minutes (300 seconds). The Lambda function can override this by returning a ttlOverride key in its response. A value of 0 disables caching of responses.
     */
    authorizerResultTtlInSeconds?: TTL;
    /**
     * The ARN of the Lambda function to be called for authorization. This may be a standard Lambda ARN, a version ARN (.../v3) or alias ARN.   Note: This Lambda function must have the following resource-based policy assigned to it. When configuring Lambda authorizers in the Console, this is done for you. To do so with the Amazon Web Services CLI, run the following:  aws lambda add-permission --function-name "arn:aws:lambda:us-east-2:111122223333:function:my-function" --statement-id "appsync" --principal appsync.amazonaws.com --action lambda:InvokeFunction 
     */
    authorizerUri: String;
    /**
     * A regular expression for validation of tokens before the Lambda function is called.
     */
    identityValidationExpression?: String;
  }
  export interface LambdaConflictHandlerConfig {
    /**
     * The Arn for the Lambda function to use as the Conflict Handler.
     */
    lambdaConflictHandlerArn?: String;
  }
  export interface LambdaDataSourceConfig {
    /**
     * The ARN for the Lambda function.
     */
    lambdaFunctionArn: String;
  }
  export interface ListApiKeysRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListApiKeysResponse {
    /**
     * The ApiKey objects.
     */
    apiKeys?: ApiKeys;
    /**
     * An identifier to be passed in the next request to this operation to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListDataSourcesRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list. 
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListDataSourcesResponse {
    /**
     * The DataSource objects.
     */
    dataSources?: DataSources;
    /**
     * An identifier to be passed in the next request to this operation to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListFunctionsRequest {
    /**
     * The GraphQL API ID.
     */
    apiId: String;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListFunctionsResponse {
    /**
     * A list of Function objects.
     */
    functions?: Functions;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListGraphqlApisRequest {
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list. 
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListGraphqlApisResponse {
    /**
     * The GraphqlApi objects.
     */
    graphqlApis?: GraphqlApis;
    /**
     * An identifier to be passed in the next request to this operation to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListResolversByFunctionRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The Function ID.
     */
    functionId: String;
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListResolversByFunctionResponse {
    /**
     * The list of resolvers.
     */
    resolvers?: Resolvers;
    /**
     * An identifier that can be used to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListResolversRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The type name.
     */
    typeName: String;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list. 
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListResolversResponse {
    /**
     * The Resolver objects.
     */
    resolvers?: Resolvers;
    /**
     * An identifier to be passed in the next request to this operation to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The GraphqlApi ARN.
     */
    resourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A TagMap object.
     */
    tags?: TagMap;
  }
  export interface ListTypesRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The type format: SDL or JSON.
     */
    format: TypeDefinitionFormat;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list. 
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListTypesResponse {
    /**
     * The Type objects.
     */
    types?: TypeList;
    /**
     * An identifier to be passed in the next request to this operation to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface LogConfig {
    /**
     * The field logging level. Values can be NONE, ERROR, or ALL.     NONE: No field-level logs are captured.    ERROR: Logs the following information only for the fields that are in error:   The error section in the server response.   Field-level errors.   The generated request/response functions that got resolved for error fields.      ALL: The following information is logged for all fields in the query:   Field-level tracing information.   The generated request/response functions that got resolved for each field.    
     */
    fieldLogLevel: FieldLogLevel;
    /**
     * The service role that AppSync will assume to publish to Amazon CloudWatch logs in your account. 
     */
    cloudWatchLogsRoleArn: String;
    /**
     * Set to TRUE to exclude sections that contain information such as headers, context, and evaluated mapping templates, regardless of logging level.
     */
    excludeVerboseContent?: Boolean;
  }
  export type Long = number;
  export type MapOfStringToString = {[key: string]: String};
  export type MappingTemplate = string;
  export type MaxResults = number;
  export interface OpenIDConnectConfig {
    /**
     * The issuer for the OpenID Connect configuration. The issuer returned by discovery must exactly match the value of iss in the ID token.
     */
    issuer: String;
    /**
     * The client identifier of the Relying party at the OpenID identity provider. This identifier is typically obtained when the Relying party is registered with the OpenID identity provider. You can specify a regular expression so the AppSync can validate against multiple client identifiers at a time.
     */
    clientId?: String;
    /**
     * The number of milliseconds a token is valid after being issued to a user.
     */
    iatTTL?: Long;
    /**
     * The number of milliseconds a token is valid after being authenticated.
     */
    authTTL?: Long;
  }
  export interface OpenSearchServiceDataSourceConfig {
    /**
     * The endpoint.
     */
    endpoint: String;
    /**
     * The Amazon Web Services Region.
     */
    awsRegion: String;
  }
  export type OutputType = "SDL"|"JSON"|string;
  export type PaginationToken = string;
  export interface PipelineConfig {
    /**
     * A list of Function objects.
     */
    functions?: FunctionsIds;
  }
  export interface RdsHttpEndpointConfig {
    /**
     * Amazon Web Services Region for RDS HTTP endpoint.
     */
    awsRegion?: String;
    /**
     * Amazon RDS cluster ARN.
     */
    dbClusterIdentifier?: String;
    /**
     * Logical database name.
     */
    databaseName?: String;
    /**
     * Logical schema name.
     */
    schema?: String;
    /**
     * Amazon Web Services secret store ARN for database credentials.
     */
    awsSecretStoreArn?: String;
  }
  export interface RelationalDatabaseDataSourceConfig {
    /**
     * Source type for the relational database.    RDS_HTTP_ENDPOINT: The relational database source type is an Amazon RDS HTTP endpoint.  
     */
    relationalDatabaseSourceType?: RelationalDatabaseSourceType;
    /**
     * Amazon RDS HTTP endpoint settings.
     */
    rdsHttpEndpointConfig?: RdsHttpEndpointConfig;
  }
  export type RelationalDatabaseSourceType = "RDS_HTTP_ENDPOINT"|string;
  export interface Resolver {
    /**
     * The resolver type name.
     */
    typeName?: ResourceName;
    /**
     * The resolver field name.
     */
    fieldName?: ResourceName;
    /**
     * The resolver data source name.
     */
    dataSourceName?: ResourceName;
    /**
     * The resolver ARN.
     */
    resolverArn?: String;
    /**
     * The request mapping template.
     */
    requestMappingTemplate?: MappingTemplate;
    /**
     * The response mapping template.
     */
    responseMappingTemplate?: MappingTemplate;
    /**
     * The resolver type.    UNIT: A UNIT resolver type. A UNIT resolver is the default resolver type. A UNIT resolver enables you to execute a GraphQL query against a single data source.    PIPELINE: A PIPELINE resolver type. A PIPELINE resolver enables you to execute a series of Function in a serial manner. You can use a pipeline resolver to execute a GraphQL query against multiple data sources.  
     */
    kind?: ResolverKind;
    /**
     * The PipelineConfig.
     */
    pipelineConfig?: PipelineConfig;
    /**
     * The SyncConfig for a resolver attached to a versioned datasource.
     */
    syncConfig?: SyncConfig;
    /**
     * The caching configuration for the resolver.
     */
    cachingConfig?: CachingConfig;
  }
  export type ResolverKind = "UNIT"|"PIPELINE"|string;
  export type Resolvers = Resolver[];
  export type ResourceArn = string;
  export type ResourceName = string;
  export type SchemaStatus = "PROCESSING"|"ACTIVE"|"DELETING"|"FAILED"|"SUCCESS"|"NOT_APPLICABLE"|string;
  export interface StartSchemaCreationRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The schema definition, in GraphQL schema language format.
     */
    definition: _Blob;
  }
  export interface StartSchemaCreationResponse {
    /**
     * The current state of the schema (PROCESSING, FAILED, SUCCESS, or NOT_APPLICABLE). When the schema is in the ACTIVE state, you can add data.
     */
    status?: SchemaStatus;
  }
  export type String = string;
  export interface SyncConfig {
    /**
     * The Conflict Resolution strategy to perform in the event of a conflict.    OPTIMISTIC_CONCURRENCY: Resolve conflicts by rejecting mutations when versions do not match the latest version at the server.    AUTOMERGE: Resolve conflicts with the Automerge conflict resolution strategy.    LAMBDA: Resolve conflicts with a Lambda function supplied in the LambdaConflictHandlerConfig.  
     */
    conflictHandler?: ConflictHandlerType;
    /**
     * The Conflict Detection strategy to use.    VERSION: Detect conflicts based on object versions for this resolver.    NONE: Do not detect conflicts when executing this resolver.  
     */
    conflictDetection?: ConflictDetectionType;
    /**
     * The LambdaConflictHandlerConfig when configuring LAMBDA as the Conflict Handler.
     */
    lambdaConflictHandlerConfig?: LambdaConflictHandlerConfig;
  }
  export type TTL = number;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The GraphqlApi ARN.
     */
    resourceArn: ResourceArn;
    /**
     * A TagMap object.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface Type {
    /**
     * The type name.
     */
    name?: ResourceName;
    /**
     * The type description.
     */
    description?: String;
    /**
     * The type ARN.
     */
    arn?: String;
    /**
     * The type definition.
     */
    definition?: String;
    /**
     * The type format: SDL or JSON.
     */
    format?: TypeDefinitionFormat;
  }
  export type TypeDefinitionFormat = "SDL"|"JSON"|string;
  export type TypeList = Type[];
  export interface UntagResourceRequest {
    /**
     * The GraphqlApi ARN.
     */
    resourceArn: ResourceArn;
    /**
     * A list of TagKey objects.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateApiCacheRequest {
    /**
     * The GraphQL API Id.
     */
    apiId: String;
    /**
     * TTL in seconds for cache entries. Valid values are between 1 and 3600 seconds.
     */
    ttl: Long;
    /**
     * Caching behavior.    FULL_REQUEST_CACHING: All requests are fully cached.    PER_RESOLVER_CACHING: Individual resolvers that you specify are cached.  
     */
    apiCachingBehavior: ApiCachingBehavior;
    /**
     * The cache instance type. Valid values are     SMALL     MEDIUM     LARGE     XLARGE     LARGE_2X     LARGE_4X     LARGE_8X (not available in all regions)    LARGE_12X    Historically, instance types were identified by an EC2-style value. As of July 2020, this is deprecated, and the generic identifiers above should be used. The following legacy instance types are available, but their use is discouraged:    T2_SMALL: A t2.small instance type.    T2_MEDIUM: A t2.medium instance type.    R4_LARGE: A r4.large instance type.    R4_XLARGE: A r4.xlarge instance type.    R4_2XLARGE: A r4.2xlarge instance type.    R4_4XLARGE: A r4.4xlarge instance type.    R4_8XLARGE: A r4.8xlarge instance type.  
     */
    type: ApiCacheType;
  }
  export interface UpdateApiCacheResponse {
    /**
     * The ApiCache object.
     */
    apiCache?: ApiCache;
  }
  export interface UpdateApiKeyRequest {
    /**
     * The ID for the GraphQL API.
     */
    apiId: String;
    /**
     * The API key ID.
     */
    id: String;
    /**
     * A description of the purpose of the API key.
     */
    description?: String;
    /**
     * The time from update time after which the API key expires. The date is represented as seconds since the epoch. For more information, see .
     */
    expires?: Long;
  }
  export interface UpdateApiKeyResponse {
    /**
     * The API key.
     */
    apiKey?: ApiKey;
  }
  export interface UpdateDataSourceRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The new name for the data source.
     */
    name: ResourceName;
    /**
     * The new description for the data source.
     */
    description?: String;
    /**
     * The new data source type.
     */
    type: DataSourceType;
    /**
     * The new service role ARN for the data source.
     */
    serviceRoleArn?: String;
    /**
     * The new Amazon DynamoDB configuration.
     */
    dynamodbConfig?: DynamodbDataSourceConfig;
    /**
     * The new Amazon Web Services Lambda configuration.
     */
    lambdaConfig?: LambdaDataSourceConfig;
    /**
     * The new OpenSearch configuration. As of September 2021, Amazon Elasticsearch service is Amazon OpenSearch Service. This configuration is deprecated. Instead, use UpdateDataSourceRequest$openSearchServiceConfig to update an OpenSearch data source.
     */
    elasticsearchConfig?: ElasticsearchDataSourceConfig;
    /**
     * The new OpenSearch configuration.
     */
    openSearchServiceConfig?: OpenSearchServiceDataSourceConfig;
    /**
     * The new HTTP endpoint configuration.
     */
    httpConfig?: HttpDataSourceConfig;
    /**
     * The new relational database configuration.
     */
    relationalDatabaseConfig?: RelationalDatabaseDataSourceConfig;
  }
  export interface UpdateDataSourceResponse {
    /**
     * The updated DataSource object.
     */
    dataSource?: DataSource;
  }
  export interface UpdateFunctionRequest {
    /**
     * The GraphQL API ID.
     */
    apiId: String;
    /**
     * The Function name.
     */
    name: ResourceName;
    /**
     * The Function description.
     */
    description?: String;
    /**
     * The function ID.
     */
    functionId: ResourceName;
    /**
     * The Function DataSource name.
     */
    dataSourceName: ResourceName;
    /**
     * The Function request mapping template. Functions support only the 2018-05-29 version of the request mapping template.
     */
    requestMappingTemplate?: MappingTemplate;
    /**
     * The Function request mapping template. 
     */
    responseMappingTemplate?: MappingTemplate;
    /**
     * The version of the request mapping template. Currently the supported value is 2018-05-29. 
     */
    functionVersion: String;
    syncConfig?: SyncConfig;
  }
  export interface UpdateFunctionResponse {
    /**
     * The Function object.
     */
    functionConfiguration?: FunctionConfiguration;
  }
  export interface UpdateGraphqlApiRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The new name for the GraphqlApi object.
     */
    name: String;
    /**
     * The Amazon CloudWatch Logs configuration for the GraphqlApi object.
     */
    logConfig?: LogConfig;
    /**
     * The new authentication type for the GraphqlApi object.
     */
    authenticationType?: AuthenticationType;
    /**
     * The new Amazon Cognito user pool configuration for the GraphqlApi object.
     */
    userPoolConfig?: UserPoolConfig;
    /**
     * The OpenID Connect configuration for the GraphqlApi object.
     */
    openIDConnectConfig?: OpenIDConnectConfig;
    /**
     * A list of additional authentication providers for the GraphqlApi API.
     */
    additionalAuthenticationProviders?: AdditionalAuthenticationProviders;
    /**
     * A flag indicating whether to enable X-Ray tracing for the GraphqlApi.
     */
    xrayEnabled?: Boolean;
    /**
     * Configuration for Amazon Web Services Lambda function authorization.
     */
    lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
  }
  export interface UpdateGraphqlApiResponse {
    /**
     * The updated GraphqlApi object.
     */
    graphqlApi?: GraphqlApi;
  }
  export interface UpdateResolverRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The new type name.
     */
    typeName: ResourceName;
    /**
     * The new field name.
     */
    fieldName: ResourceName;
    /**
     * The new data source name.
     */
    dataSourceName?: ResourceName;
    /**
     * The new request mapping template. A resolver uses a request mapping template to convert a GraphQL expression into a format that a data source can understand. Mapping templates are written in Apache Velocity Template Language (VTL). VTL request mapping templates are optional when using a Lambda data source. For all other data sources, VTL request and response mapping templates are required.
     */
    requestMappingTemplate?: MappingTemplate;
    /**
     * The new response mapping template.
     */
    responseMappingTemplate?: MappingTemplate;
    /**
     * The resolver type.    UNIT: A UNIT resolver type. A UNIT resolver is the default resolver type. A UNIT resolver enables you to execute a GraphQL query against a single data source.    PIPELINE: A PIPELINE resolver type. A PIPELINE resolver enables you to execute a series of Function in a serial manner. You can use a pipeline resolver to execute a GraphQL query against multiple data sources.  
     */
    kind?: ResolverKind;
    /**
     * The PipelineConfig.
     */
    pipelineConfig?: PipelineConfig;
    /**
     * The SyncConfig for a resolver attached to a versioned datasource.
     */
    syncConfig?: SyncConfig;
    /**
     * The caching configuration for the resolver.
     */
    cachingConfig?: CachingConfig;
  }
  export interface UpdateResolverResponse {
    /**
     * The updated Resolver object.
     */
    resolver?: Resolver;
  }
  export interface UpdateTypeRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The new type name.
     */
    typeName: ResourceName;
    /**
     * The new definition.
     */
    definition?: String;
    /**
     * The new type format: SDL or JSON.
     */
    format: TypeDefinitionFormat;
  }
  export interface UpdateTypeResponse {
    /**
     * The updated Type object.
     */
    type?: Type;
  }
  export interface UserPoolConfig {
    /**
     * The user pool ID.
     */
    userPoolId: String;
    /**
     * The Amazon Web Services Region in which the user pool was created.
     */
    awsRegion: String;
    /**
     * The action that you want your GraphQL API to take when a request that uses Amazon Cognito user pool authentication doesn't match the Amazon Cognito user pool configuration.
     */
    defaultAction: DefaultAction;
    /**
     * A regular expression for validating the incoming Amazon Cognito user pool app client ID.
     */
    appIdClientRegex?: String;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-07-25"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AppSync client.
   */
  export import Types = AppSync;
}
export = AppSync;
