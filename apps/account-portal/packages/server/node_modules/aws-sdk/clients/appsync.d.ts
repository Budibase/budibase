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
   * Maps an endpoint to your custom domain.
   */
  associateApi(params: AppSync.Types.AssociateApiRequest, callback?: (err: AWSError, data: AppSync.Types.AssociateApiResponse) => void): Request<AppSync.Types.AssociateApiResponse, AWSError>;
  /**
   * Maps an endpoint to your custom domain.
   */
  associateApi(callback?: (err: AWSError, data: AppSync.Types.AssociateApiResponse) => void): Request<AppSync.Types.AssociateApiResponse, AWSError>;
  /**
   * Creates an association between a Merged API and source API using the source API's identifier.
   */
  associateMergedGraphqlApi(params: AppSync.Types.AssociateMergedGraphqlApiRequest, callback?: (err: AWSError, data: AppSync.Types.AssociateMergedGraphqlApiResponse) => void): Request<AppSync.Types.AssociateMergedGraphqlApiResponse, AWSError>;
  /**
   * Creates an association between a Merged API and source API using the source API's identifier.
   */
  associateMergedGraphqlApi(callback?: (err: AWSError, data: AppSync.Types.AssociateMergedGraphqlApiResponse) => void): Request<AppSync.Types.AssociateMergedGraphqlApiResponse, AWSError>;
  /**
   * Creates an association between a Merged API and source API using the Merged API's identifier.
   */
  associateSourceGraphqlApi(params: AppSync.Types.AssociateSourceGraphqlApiRequest, callback?: (err: AWSError, data: AppSync.Types.AssociateSourceGraphqlApiResponse) => void): Request<AppSync.Types.AssociateSourceGraphqlApiResponse, AWSError>;
  /**
   * Creates an association between a Merged API and source API using the Merged API's identifier.
   */
  associateSourceGraphqlApi(callback?: (err: AWSError, data: AppSync.Types.AssociateSourceGraphqlApiResponse) => void): Request<AppSync.Types.AssociateSourceGraphqlApiResponse, AWSError>;
  /**
   * Creates a cache for the GraphQL API.
   */
  createApiCache(params: AppSync.Types.CreateApiCacheRequest, callback?: (err: AWSError, data: AppSync.Types.CreateApiCacheResponse) => void): Request<AppSync.Types.CreateApiCacheResponse, AWSError>;
  /**
   * Creates a cache for the GraphQL API.
   */
  createApiCache(callback?: (err: AWSError, data: AppSync.Types.CreateApiCacheResponse) => void): Request<AppSync.Types.CreateApiCacheResponse, AWSError>;
  /**
   * Creates a unique key that you can distribute to clients who invoke your API.
   */
  createApiKey(params: AppSync.Types.CreateApiKeyRequest, callback?: (err: AWSError, data: AppSync.Types.CreateApiKeyResponse) => void): Request<AppSync.Types.CreateApiKeyResponse, AWSError>;
  /**
   * Creates a unique key that you can distribute to clients who invoke your API.
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
   * Creates a custom DomainName object.
   */
  createDomainName(params: AppSync.Types.CreateDomainNameRequest, callback?: (err: AWSError, data: AppSync.Types.CreateDomainNameResponse) => void): Request<AppSync.Types.CreateDomainNameResponse, AWSError>;
  /**
   * Creates a custom DomainName object.
   */
  createDomainName(callback?: (err: AWSError, data: AppSync.Types.CreateDomainNameResponse) => void): Request<AppSync.Types.CreateDomainNameResponse, AWSError>;
  /**
   * Creates a Function object. A function is a reusable entity. You can use multiple functions to compose the resolver logic.
   */
  createFunction(params: AppSync.Types.CreateFunctionRequest, callback?: (err: AWSError, data: AppSync.Types.CreateFunctionResponse) => void): Request<AppSync.Types.CreateFunctionResponse, AWSError>;
  /**
   * Creates a Function object. A function is a reusable entity. You can use multiple functions to compose the resolver logic.
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
   * Creates a Resolver object. A resolver converts incoming requests into a format that a data source can understand, and converts the data source's responses into GraphQL.
   */
  createResolver(params: AppSync.Types.CreateResolverRequest, callback?: (err: AWSError, data: AppSync.Types.CreateResolverResponse) => void): Request<AppSync.Types.CreateResolverResponse, AWSError>;
  /**
   * Creates a Resolver object. A resolver converts incoming requests into a format that a data source can understand, and converts the data source's responses into GraphQL.
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
   * Deletes a custom DomainName object.
   */
  deleteDomainName(params: AppSync.Types.DeleteDomainNameRequest, callback?: (err: AWSError, data: AppSync.Types.DeleteDomainNameResponse) => void): Request<AppSync.Types.DeleteDomainNameResponse, AWSError>;
  /**
   * Deletes a custom DomainName object.
   */
  deleteDomainName(callback?: (err: AWSError, data: AppSync.Types.DeleteDomainNameResponse) => void): Request<AppSync.Types.DeleteDomainNameResponse, AWSError>;
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
   * Removes an ApiAssociation object from a custom domain.
   */
  disassociateApi(params: AppSync.Types.DisassociateApiRequest, callback?: (err: AWSError, data: AppSync.Types.DisassociateApiResponse) => void): Request<AppSync.Types.DisassociateApiResponse, AWSError>;
  /**
   * Removes an ApiAssociation object from a custom domain.
   */
  disassociateApi(callback?: (err: AWSError, data: AppSync.Types.DisassociateApiResponse) => void): Request<AppSync.Types.DisassociateApiResponse, AWSError>;
  /**
   * Deletes an association between a Merged API and source API using the source API's identifier and the association ID.
   */
  disassociateMergedGraphqlApi(params: AppSync.Types.DisassociateMergedGraphqlApiRequest, callback?: (err: AWSError, data: AppSync.Types.DisassociateMergedGraphqlApiResponse) => void): Request<AppSync.Types.DisassociateMergedGraphqlApiResponse, AWSError>;
  /**
   * Deletes an association between a Merged API and source API using the source API's identifier and the association ID.
   */
  disassociateMergedGraphqlApi(callback?: (err: AWSError, data: AppSync.Types.DisassociateMergedGraphqlApiResponse) => void): Request<AppSync.Types.DisassociateMergedGraphqlApiResponse, AWSError>;
  /**
   * Deletes an association between a Merged API and source API using the Merged API's identifier and the association ID.
   */
  disassociateSourceGraphqlApi(params: AppSync.Types.DisassociateSourceGraphqlApiRequest, callback?: (err: AWSError, data: AppSync.Types.DisassociateSourceGraphqlApiResponse) => void): Request<AppSync.Types.DisassociateSourceGraphqlApiResponse, AWSError>;
  /**
   * Deletes an association between a Merged API and source API using the Merged API's identifier and the association ID.
   */
  disassociateSourceGraphqlApi(callback?: (err: AWSError, data: AppSync.Types.DisassociateSourceGraphqlApiResponse) => void): Request<AppSync.Types.DisassociateSourceGraphqlApiResponse, AWSError>;
  /**
   * Evaluates the given code and returns the response. The code definition requirements depend on the specified runtime. For APPSYNC_JS runtimes, the code defines the request and response functions. The request function takes the incoming request after a GraphQL operation is parsed and converts it into a request configuration for the selected data source operation. The response function interprets responses from the data source and maps it to the shape of the GraphQL field output type. 
   */
  evaluateCode(params: AppSync.Types.EvaluateCodeRequest, callback?: (err: AWSError, data: AppSync.Types.EvaluateCodeResponse) => void): Request<AppSync.Types.EvaluateCodeResponse, AWSError>;
  /**
   * Evaluates the given code and returns the response. The code definition requirements depend on the specified runtime. For APPSYNC_JS runtimes, the code defines the request and response functions. The request function takes the incoming request after a GraphQL operation is parsed and converts it into a request configuration for the selected data source operation. The response function interprets responses from the data source and maps it to the shape of the GraphQL field output type. 
   */
  evaluateCode(callback?: (err: AWSError, data: AppSync.Types.EvaluateCodeResponse) => void): Request<AppSync.Types.EvaluateCodeResponse, AWSError>;
  /**
   * Evaluates a given template and returns the response. The mapping template can be a request or response template. Request templates take the incoming request after a GraphQL operation is parsed and convert it into a request configuration for the selected data source operation. Response templates interpret responses from the data source and map it to the shape of the GraphQL field output type. Mapping templates are written in the Apache Velocity Template Language (VTL).
   */
  evaluateMappingTemplate(params: AppSync.Types.EvaluateMappingTemplateRequest, callback?: (err: AWSError, data: AppSync.Types.EvaluateMappingTemplateResponse) => void): Request<AppSync.Types.EvaluateMappingTemplateResponse, AWSError>;
  /**
   * Evaluates a given template and returns the response. The mapping template can be a request or response template. Request templates take the incoming request after a GraphQL operation is parsed and convert it into a request configuration for the selected data source operation. Response templates interpret responses from the data source and map it to the shape of the GraphQL field output type. Mapping templates are written in the Apache Velocity Template Language (VTL).
   */
  evaluateMappingTemplate(callback?: (err: AWSError, data: AppSync.Types.EvaluateMappingTemplateResponse) => void): Request<AppSync.Types.EvaluateMappingTemplateResponse, AWSError>;
  /**
   * Flushes an ApiCache object.
   */
  flushApiCache(params: AppSync.Types.FlushApiCacheRequest, callback?: (err: AWSError, data: AppSync.Types.FlushApiCacheResponse) => void): Request<AppSync.Types.FlushApiCacheResponse, AWSError>;
  /**
   * Flushes an ApiCache object.
   */
  flushApiCache(callback?: (err: AWSError, data: AppSync.Types.FlushApiCacheResponse) => void): Request<AppSync.Types.FlushApiCacheResponse, AWSError>;
  /**
   * Retrieves an ApiAssociation object.
   */
  getApiAssociation(params: AppSync.Types.GetApiAssociationRequest, callback?: (err: AWSError, data: AppSync.Types.GetApiAssociationResponse) => void): Request<AppSync.Types.GetApiAssociationResponse, AWSError>;
  /**
   * Retrieves an ApiAssociation object.
   */
  getApiAssociation(callback?: (err: AWSError, data: AppSync.Types.GetApiAssociationResponse) => void): Request<AppSync.Types.GetApiAssociationResponse, AWSError>;
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
   * Retrieves a custom DomainName object.
   */
  getDomainName(params: AppSync.Types.GetDomainNameRequest, callback?: (err: AWSError, data: AppSync.Types.GetDomainNameResponse) => void): Request<AppSync.Types.GetDomainNameResponse, AWSError>;
  /**
   * Retrieves a custom DomainName object.
   */
  getDomainName(callback?: (err: AWSError, data: AppSync.Types.GetDomainNameResponse) => void): Request<AppSync.Types.GetDomainNameResponse, AWSError>;
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
   * Retrieves a SourceApiAssociation object.
   */
  getSourceApiAssociation(params: AppSync.Types.GetSourceApiAssociationRequest, callback?: (err: AWSError, data: AppSync.Types.GetSourceApiAssociationResponse) => void): Request<AppSync.Types.GetSourceApiAssociationResponse, AWSError>;
  /**
   * Retrieves a SourceApiAssociation object.
   */
  getSourceApiAssociation(callback?: (err: AWSError, data: AppSync.Types.GetSourceApiAssociationResponse) => void): Request<AppSync.Types.GetSourceApiAssociationResponse, AWSError>;
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
   * Lists multiple custom domain names.
   */
  listDomainNames(params: AppSync.Types.ListDomainNamesRequest, callback?: (err: AWSError, data: AppSync.Types.ListDomainNamesResponse) => void): Request<AppSync.Types.ListDomainNamesResponse, AWSError>;
  /**
   * Lists multiple custom domain names.
   */
  listDomainNames(callback?: (err: AWSError, data: AppSync.Types.ListDomainNamesResponse) => void): Request<AppSync.Types.ListDomainNamesResponse, AWSError>;
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
   * Lists the SourceApiAssociationSummary data.
   */
  listSourceApiAssociations(params: AppSync.Types.ListSourceApiAssociationsRequest, callback?: (err: AWSError, data: AppSync.Types.ListSourceApiAssociationsResponse) => void): Request<AppSync.Types.ListSourceApiAssociationsResponse, AWSError>;
  /**
   * Lists the SourceApiAssociationSummary data.
   */
  listSourceApiAssociations(callback?: (err: AWSError, data: AppSync.Types.ListSourceApiAssociationsResponse) => void): Request<AppSync.Types.ListSourceApiAssociationsResponse, AWSError>;
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
   * Lists Type objects by the source API association ID.
   */
  listTypesByAssociation(params: AppSync.Types.ListTypesByAssociationRequest, callback?: (err: AWSError, data: AppSync.Types.ListTypesByAssociationResponse) => void): Request<AppSync.Types.ListTypesByAssociationResponse, AWSError>;
  /**
   * Lists Type objects by the source API association ID.
   */
  listTypesByAssociation(callback?: (err: AWSError, data: AppSync.Types.ListTypesByAssociationResponse) => void): Request<AppSync.Types.ListTypesByAssociationResponse, AWSError>;
  /**
   * Adds a new schema to your GraphQL API. This operation is asynchronous. Use to determine when it has completed.
   */
  startSchemaCreation(params: AppSync.Types.StartSchemaCreationRequest, callback?: (err: AWSError, data: AppSync.Types.StartSchemaCreationResponse) => void): Request<AppSync.Types.StartSchemaCreationResponse, AWSError>;
  /**
   * Adds a new schema to your GraphQL API. This operation is asynchronous. Use to determine when it has completed.
   */
  startSchemaCreation(callback?: (err: AWSError, data: AppSync.Types.StartSchemaCreationResponse) => void): Request<AppSync.Types.StartSchemaCreationResponse, AWSError>;
  /**
   * Initiates a merge operation. Returns a status that shows the result of the merge operation.
   */
  startSchemaMerge(params: AppSync.Types.StartSchemaMergeRequest, callback?: (err: AWSError, data: AppSync.Types.StartSchemaMergeResponse) => void): Request<AppSync.Types.StartSchemaMergeResponse, AWSError>;
  /**
   * Initiates a merge operation. Returns a status that shows the result of the merge operation.
   */
  startSchemaMerge(callback?: (err: AWSError, data: AppSync.Types.StartSchemaMergeResponse) => void): Request<AppSync.Types.StartSchemaMergeResponse, AWSError>;
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
   * Updates an API key. You can update the key as long as it's not deleted.
   */
  updateApiKey(params: AppSync.Types.UpdateApiKeyRequest, callback?: (err: AWSError, data: AppSync.Types.UpdateApiKeyResponse) => void): Request<AppSync.Types.UpdateApiKeyResponse, AWSError>;
  /**
   * Updates an API key. You can update the key as long as it's not deleted.
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
   * Updates a custom DomainName object.
   */
  updateDomainName(params: AppSync.Types.UpdateDomainNameRequest, callback?: (err: AWSError, data: AppSync.Types.UpdateDomainNameResponse) => void): Request<AppSync.Types.UpdateDomainNameResponse, AWSError>;
  /**
   * Updates a custom DomainName object.
   */
  updateDomainName(callback?: (err: AWSError, data: AppSync.Types.UpdateDomainNameResponse) => void): Request<AppSync.Types.UpdateDomainNameResponse, AWSError>;
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
   * Updates some of the configuration choices of a particular source API association.
   */
  updateSourceApiAssociation(params: AppSync.Types.UpdateSourceApiAssociationRequest, callback?: (err: AWSError, data: AppSync.Types.UpdateSourceApiAssociationResponse) => void): Request<AppSync.Types.UpdateSourceApiAssociationResponse, AWSError>;
  /**
   * Updates some of the configuration choices of a particular source API association.
   */
  updateSourceApiAssociation(callback?: (err: AWSError, data: AppSync.Types.UpdateSourceApiAssociationResponse) => void): Request<AppSync.Types.UpdateSourceApiAssociationResponse, AWSError>;
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
     * The authentication type: API key, Identity and Access Management (IAM), OpenID Connect (OIDC), Amazon Cognito user pools, or Lambda.
     */
    authenticationType?: AuthenticationType;
    /**
     * The OIDC configuration.
     */
    openIDConnectConfig?: OpenIDConnectConfig;
    /**
     * The Amazon Cognito user pool configuration.
     */
    userPoolConfig?: CognitoUserPoolConfig;
    /**
     * Configuration for Lambda function authorization.
     */
    lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
  }
  export type AdditionalAuthenticationProviders = AdditionalAuthenticationProvider[];
  export interface ApiAssociation {
    /**
     * The domain name.
     */
    domainName?: DomainName;
    /**
     * The API ID.
     */
    apiId?: String;
    /**
     * Identifies the status of an association.    PROCESSING: The API association is being created. You cannot modify association requests during processing.    SUCCESS: The API association was successful. You can modify associations after success.    FAILED: The API association has failed. You can modify associations after failure.  
     */
    associationStatus?: AssociationStatus;
    /**
     * Details about the last deployment status.
     */
    deploymentDetail?: String;
  }
  export interface ApiCache {
    /**
     * TTL in seconds for cache entries. Valid values are 1–3,600 seconds.
     */
    ttl?: Long;
    /**
     * Caching behavior.    FULL_REQUEST_CACHING: All requests are fully cached.    PER_RESOLVER_CACHING: Individual resolvers that you specify are cached.  
     */
    apiCachingBehavior?: ApiCachingBehavior;
    /**
     * Transit encryption flag when connecting to cache. You cannot update this setting after creation.
     */
    transitEncryptionEnabled?: Boolean;
    /**
     * At-rest encryption flag for cache. You cannot update this setting after creation.
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
  export interface AppSyncRuntime {
    /**
     * The name of the runtime to use. Currently, the only allowed value is APPSYNC_JS.
     */
    name: RuntimeName;
    /**
     * The version of the runtime to use. Currently, the only allowed version is 1.0.0.
     */
    runtimeVersion: String;
  }
  export interface AssociateApiRequest {
    /**
     * The domain name.
     */
    domainName: DomainName;
    /**
     * The API ID. Private APIs can not be associated with custom domains.
     */
    apiId: String;
  }
  export interface AssociateApiResponse {
    /**
     * The ApiAssociation object.
     */
    apiAssociation?: ApiAssociation;
  }
  export interface AssociateMergedGraphqlApiRequest {
    /**
     * The identifier of the AppSync Source API. This is generated by the AppSync service. In most cases, source APIs (especially in your account) only require the API ID value or ARN of the source API. However, source APIs from other accounts (cross-account use cases) strictly require the full resource ARN of the source API.
     */
    sourceApiIdentifier: String;
    /**
     * The identifier of the AppSync Merged API. This is generated by the AppSync service. In most cases, Merged APIs (especially in your account) only require the API ID value or ARN of the merged API. However, Merged APIs in other accounts (cross-account use cases) strictly require the full resource ARN of the merged API.
     */
    mergedApiIdentifier: String;
    /**
     * The description field.
     */
    description?: String;
    /**
     * The SourceApiAssociationConfig object data.
     */
    sourceApiAssociationConfig?: SourceApiAssociationConfig;
  }
  export interface AssociateMergedGraphqlApiResponse {
    /**
     * The SourceApiAssociation object data.
     */
    sourceApiAssociation?: SourceApiAssociation;
  }
  export interface AssociateSourceGraphqlApiRequest {
    /**
     * The identifier of the AppSync Merged API. This is generated by the AppSync service. In most cases, Merged APIs (especially in your account) only require the API ID value or ARN of the merged API. However, Merged APIs in other accounts (cross-account use cases) strictly require the full resource ARN of the merged API.
     */
    mergedApiIdentifier: String;
    /**
     * The identifier of the AppSync Source API. This is generated by the AppSync service. In most cases, source APIs (especially in your account) only require the API ID value or ARN of the source API. However, source APIs from other accounts (cross-account use cases) strictly require the full resource ARN of the source API.
     */
    sourceApiIdentifier: String;
    /**
     * The description field.
     */
    description?: String;
    /**
     * The SourceApiAssociationConfig object data.
     */
    sourceApiAssociationConfig?: SourceApiAssociationConfig;
  }
  export interface AssociateSourceGraphqlApiResponse {
    /**
     * The SourceApiAssociation object data.
     */
    sourceApiAssociation?: SourceApiAssociation;
  }
  export type AssociationStatus = "PROCESSING"|"FAILED"|"SUCCESS"|string;
  export type AuthenticationType = "API_KEY"|"AWS_IAM"|"AMAZON_COGNITO_USER_POOLS"|"OPENID_CONNECT"|"AWS_LAMBDA"|string;
  export interface AuthorizationConfig {
    /**
     * The authorization type that the HTTP endpoint requires.    AWS_IAM: The authorization type is Signature Version 4 (SigV4).  
     */
    authorizationType: AuthorizationType;
    /**
     * The Identity and Access Management (IAM) settings.
     */
    awsIamConfig?: AwsIamConfig;
  }
  export type AuthorizationType = "AWS_IAM"|string;
  export interface AwsIamConfig {
    /**
     * The signing Amazon Web Services Region for IAM authorization.
     */
    signingRegion?: String;
    /**
     * The signing service name for IAM authorization.
     */
    signingServiceName?: String;
  }
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export type Boolean = boolean;
  export type BooleanValue = boolean;
  export interface CachingConfig {
    /**
     * The TTL in seconds for a resolver that has caching activated. Valid values are 1–3,600 seconds.
     */
    ttl: Long;
    /**
     * The caching keys for a resolver that has caching activated. Valid values are entries from the $context.arguments, $context.source, and $context.identity maps.
     */
    cachingKeys?: CachingKeys;
  }
  export type CachingKeys = String[];
  export type CertificateArn = string;
  export type Code = string;
  export interface CodeError {
    /**
     * The type of code error.  Examples include, but aren't limited to: LINT_ERROR, PARSER_ERROR.
     */
    errorType?: String;
    /**
     * A user presentable error. Examples include, but aren't limited to: Parsing error: Unterminated string literal.
     */
    value?: String;
    /**
     * The line, column, and span location of the error in the code.
     */
    location?: CodeErrorLocation;
  }
  export type CodeErrorColumn = number;
  export type CodeErrorLine = number;
  export interface CodeErrorLocation {
    /**
     * The line number in the code. Defaults to 0 if unknown.
     */
    line?: CodeErrorLine;
    /**
     * The column number in the code. Defaults to 0 if unknown.
     */
    column?: CodeErrorColumn;
    /**
     * The span/length of the error. Defaults to -1 if unknown.
     */
    span?: CodeErrorSpan;
  }
  export type CodeErrorSpan = number;
  export type CodeErrors = CodeError[];
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
     * A regular expression for validating the incoming Amazon Cognito user pool app client ID. If this value isn't set, no filtering is applied.
     */
    appIdClientRegex?: String;
  }
  export type ConflictDetectionType = "VERSION"|"NONE"|string;
  export type ConflictHandlerType = "OPTIMISTIC_CONCURRENCY"|"LAMBDA"|"AUTOMERGE"|"NONE"|string;
  export type Context = string;
  export interface CreateApiCacheRequest {
    /**
     * The GraphQL API ID.
     */
    apiId: String;
    /**
     * TTL in seconds for cache entries. Valid values are 1–3,600 seconds.
     */
    ttl: Long;
    /**
     * Transit encryption flag when connecting to cache. You cannot update this setting after creation.
     */
    transitEncryptionEnabled?: Boolean;
    /**
     * At-rest encryption flag for cache. You cannot update this setting after creation.
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
     * From the creation time, the time after which the API key expires. The date is represented as seconds since the epoch, rounded down to the nearest hour. The default value for this parameter is 7 days from creation time. For more information, see .
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
     * The Identity and Access Management (IAM) service role Amazon Resource Name (ARN) for the data source. The system assumes this role when accessing the data source.
     */
    serviceRoleArn?: String;
    /**
     * Amazon DynamoDB settings.
     */
    dynamodbConfig?: DynamodbDataSourceConfig;
    /**
     * Lambda settings.
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
    /**
     * Amazon EventBridge settings.
     */
    eventBridgeConfig?: EventBridgeDataSourceConfig;
  }
  export interface CreateDataSourceResponse {
    /**
     * The DataSource object.
     */
    dataSource?: DataSource;
  }
  export interface CreateDomainNameRequest {
    /**
     * The domain name.
     */
    domainName: DomainName;
    /**
     * The Amazon Resource Name (ARN) of the certificate. This can be an Certificate Manager (ACM) certificate or an Identity and Access Management (IAM) server certificate.
     */
    certificateArn: CertificateArn;
    /**
     * A description of the DomainName.
     */
    description?: Description;
  }
  export interface CreateDomainNameResponse {
    /**
     * The configuration for the DomainName.
     */
    domainNameConfig?: DomainNameConfig;
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
     * The version of the request mapping template. Currently, the supported value is 2018-05-29. Note that when using VTL and mapping templates, the functionVersion is required.
     */
    functionVersion?: String;
    syncConfig?: SyncConfig;
    /**
     * The maximum batching size for a resolver.
     */
    maxBatchSize?: MaxBatchSize;
    runtime?: AppSyncRuntime;
    /**
     * The function code that contains the request and response functions. When code is used, the runtime is required. The runtime value must be APPSYNC_JS.
     */
    code?: Code;
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
     * The authentication type: API key, Identity and Access Management (IAM), OpenID Connect (OIDC), Amazon Cognito user pools, or Lambda.
     */
    authenticationType: AuthenticationType;
    /**
     * The Amazon Cognito user pool configuration.
     */
    userPoolConfig?: UserPoolConfig;
    /**
     * The OIDC configuration.
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
     * A flag indicating whether to use X-Ray tracing for the GraphqlApi.
     */
    xrayEnabled?: Boolean;
    /**
     * Configuration for Lambda function authorization.
     */
    lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
    /**
     * Sets the value of the GraphQL API to public (GLOBAL) or private (PRIVATE). If no value is provided, the visibility will be set to GLOBAL by default. This value cannot be changed once the API has been created.
     */
    visibility?: GraphQLApiVisibility;
    /**
     * The value that indicates whether the GraphQL API is a standard API (GRAPHQL) or merged API (MERGED).
     */
    apiType?: GraphQLApiType;
    /**
     * The Identity and Access Management service role ARN for a merged API. The AppSync service assumes this role on behalf of the Merged API to validate access to source APIs at runtime and to prompt the AUTO_MERGE to update the merged API endpoint with the source API changes automatically.
     */
    mergedApiExecutionRoleArn?: String;
    /**
     * The owner contact information for an API resource. This field accepts any string input with a length of 0 - 256 characters.
     */
    ownerContact?: String;
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
     * The mapping template to use for requests. A resolver uses a request mapping template to convert a GraphQL expression into a format that a data source can understand. Mapping templates are written in Apache Velocity Template Language (VTL). VTL request mapping templates are optional when using an Lambda data source. For all other data sources, VTL request and response mapping templates are required.
     */
    requestMappingTemplate?: MappingTemplate;
    /**
     * The mapping template to use for responses from the data source.
     */
    responseMappingTemplate?: MappingTemplate;
    /**
     * The resolver type.    UNIT: A UNIT resolver type. A UNIT resolver is the default resolver type. You can use a UNIT resolver to run a GraphQL query against a single data source.    PIPELINE: A PIPELINE resolver type. You can use a PIPELINE resolver to invoke a series of Function objects in a serial manner. You can use a pipeline resolver to run a GraphQL query against multiple data sources.  
     */
    kind?: ResolverKind;
    /**
     * The PipelineConfig.
     */
    pipelineConfig?: PipelineConfig;
    /**
     * The SyncConfig for a resolver attached to a versioned data source.
     */
    syncConfig?: SyncConfig;
    /**
     * The caching configuration for the resolver.
     */
    cachingConfig?: CachingConfig;
    /**
     * The maximum batching size for a resolver.
     */
    maxBatchSize?: MaxBatchSize;
    runtime?: AppSyncRuntime;
    /**
     * The resolver code that contains the request and response functions. When code is used, the runtime is required. The runtime value must be APPSYNC_JS.
     */
    code?: Code;
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
     * The data source Amazon Resource Name (ARN).
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
     * The type of the data source.    AWS_LAMBDA: The data source is an Lambda function.    AMAZON_DYNAMODB: The data source is an Amazon DynamoDB table.    AMAZON_ELASTICSEARCH: The data source is an Amazon OpenSearch Service domain.    AMAZON_OPENSEARCH_SERVICE: The data source is an Amazon OpenSearch Service domain.    AMAZON_EVENTBRIDGE: The data source is an Amazon EventBridge configuration.    NONE: There is no data source. Use this type when you want to invoke a GraphQL operation without connecting to a data source, such as when you're performing data transformation with resolvers or invoking a subscription from a mutation.    HTTP: The data source is an HTTP endpoint.    RELATIONAL_DATABASE: The data source is a relational database.  
     */
    type?: DataSourceType;
    /**
     * The Identity and Access Management (IAM) service role Amazon Resource Name (ARN) for the data source. The system assumes this role when accessing the data source.
     */
    serviceRoleArn?: String;
    /**
     * DynamoDB settings.
     */
    dynamodbConfig?: DynamodbDataSourceConfig;
    /**
     * Lambda settings.
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
    /**
     * Amazon EventBridge settings.
     */
    eventBridgeConfig?: EventBridgeDataSourceConfig;
  }
  export type DataSourceType = "AWS_LAMBDA"|"AMAZON_DYNAMODB"|"AMAZON_ELASTICSEARCH"|"NONE"|"HTTP"|"RELATIONAL_DATABASE"|"AMAZON_OPENSEARCH_SERVICE"|"AMAZON_EVENTBRIDGE"|string;
  export type DataSources = DataSource[];
  export type _Date = Date;
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
  export interface DeleteDomainNameRequest {
    /**
     * The domain name.
     */
    domainName: DomainName;
  }
  export interface DeleteDomainNameResponse {
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
     * The number of minutes that an Item is stored in the data source.
     */
    baseTableTTL?: Long;
    /**
     * The Delta Sync table name.
     */
    deltaSyncTableName?: String;
    /**
     * The number of minutes that a Delta Sync log entry is stored in the Delta Sync table.
     */
    deltaSyncTableTTL?: Long;
  }
  export type Description = string;
  export interface DisassociateApiRequest {
    /**
     * The domain name.
     */
    domainName: DomainName;
  }
  export interface DisassociateApiResponse {
  }
  export interface DisassociateMergedGraphqlApiRequest {
    /**
     * The identifier of the AppSync Source API. This is generated by the AppSync service. In most cases, source APIs (especially in your account) only require the API ID value or ARN of the source API. However, source APIs from other accounts (cross-account use cases) strictly require the full resource ARN of the source API.
     */
    sourceApiIdentifier: String;
    /**
     * The ID generated by the AppSync service for the source API association.
     */
    associationId: String;
  }
  export interface DisassociateMergedGraphqlApiResponse {
    /**
     * The state of the source API association.
     */
    sourceApiAssociationStatus?: SourceApiAssociationStatus;
  }
  export interface DisassociateSourceGraphqlApiRequest {
    /**
     * The identifier of the AppSync Merged API. This is generated by the AppSync service. In most cases, Merged APIs (especially in your account) only require the API ID value or ARN of the merged API. However, Merged APIs in other accounts (cross-account use cases) strictly require the full resource ARN of the merged API.
     */
    mergedApiIdentifier: String;
    /**
     * The ID generated by the AppSync service for the source API association.
     */
    associationId: String;
  }
  export interface DisassociateSourceGraphqlApiResponse {
    /**
     * The state of the source API association.
     */
    sourceApiAssociationStatus?: SourceApiAssociationStatus;
  }
  export type DomainName = string;
  export interface DomainNameConfig {
    /**
     * The domain name.
     */
    domainName?: DomainName;
    /**
     * A description of the DomainName configuration.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of the certificate. This can be an Certificate Manager (ACM) certificate or an Identity and Access Management (IAM) server certificate.
     */
    certificateArn?: CertificateArn;
    /**
     * The domain name that AppSync provides.
     */
    appsyncDomainName?: String;
    /**
     * The ID of your Amazon Route 53 hosted zone.
     */
    hostedZoneId?: String;
  }
  export type DomainNameConfigs = DomainNameConfig[];
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
     * The DeltaSyncConfig for a versioned data source.
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
  export interface ErrorDetail {
    /**
     * The error payload.
     */
    message?: ErrorMessage;
  }
  export type ErrorMessage = string;
  export interface EvaluateCodeErrorDetail {
    /**
     * The error payload.
     */
    message?: ErrorMessage;
    /**
     * Contains the list of CodeError objects.
     */
    codeErrors?: CodeErrors;
  }
  export interface EvaluateCodeRequest {
    /**
     * The runtime to be used when evaluating the code. Currently, only the APPSYNC_JS runtime is supported.
     */
    runtime: AppSyncRuntime;
    /**
     * The code definition to be evaluated. Note that code and runtime are both required for this action. The runtime value must be APPSYNC_JS.
     */
    code: Code;
    /**
     * The map that holds all of the contextual information for your resolver invocation. A context is required for this action.
     */
    context: Context;
    /**
     * The function within the code to be evaluated. If provided, the valid values are request and response.
     */
    function?: String;
  }
  export interface EvaluateCodeResponse {
    /**
     * The result of the evaluation operation.
     */
    evaluationResult?: EvaluationResult;
    /**
     * Contains the payload of the response error.
     */
    error?: EvaluateCodeErrorDetail;
    /**
     * A list of logs that were generated by calls to util.log.info and util.log.error in the evaluated code.
     */
    logs?: Logs;
  }
  export interface EvaluateMappingTemplateRequest {
    /**
     * The mapping template; this can be a request or response template. A template is required for this action.
     */
    template: Template;
    /**
     * The map that holds all of the contextual information for your resolver invocation. A context is required for this action.
     */
    context: Context;
  }
  export interface EvaluateMappingTemplateResponse {
    /**
     * The mapping template; this can be a request or response template.
     */
    evaluationResult?: EvaluationResult;
    /**
     * The ErrorDetail object.
     */
    error?: ErrorDetail;
    /**
     * A list of logs that were generated by calls to util.log.info and util.log.error in the evaluated code.
     */
    logs?: Logs;
  }
  export type EvaluationResult = string;
  export interface EventBridgeDataSourceConfig {
    /**
     * The ARN of the event bus. For more information about event buses, see Amazon EventBridge event buses.
     */
    eventBusArn: String;
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
     * The Amazon Resource Name (ARN) of the Function object.
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
     * The version of the request mapping template. Currently, only the 2018-05-29 version of the template is supported.
     */
    functionVersion?: String;
    syncConfig?: SyncConfig;
    /**
     * The maximum batching size for a resolver.
     */
    maxBatchSize?: MaxBatchSize;
    runtime?: AppSyncRuntime;
    /**
     * The function code that contains the request and response functions. When code is used, the runtime is required. The runtime value must be APPSYNC_JS.
     */
    code?: Code;
  }
  export type Functions = FunctionConfiguration[];
  export type FunctionsIds = String[];
  export interface GetApiAssociationRequest {
    /**
     * The domain name.
     */
    domainName: DomainName;
  }
  export interface GetApiAssociationResponse {
    /**
     * The ApiAssociation object.
     */
    apiAssociation?: ApiAssociation;
  }
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
  export interface GetDomainNameRequest {
    /**
     * The domain name.
     */
    domainName: DomainName;
  }
  export interface GetDomainNameResponse {
    /**
     * The configuration for the DomainName.
     */
    domainNameConfig?: DomainNameConfig;
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
  export interface GetSourceApiAssociationRequest {
    /**
     * The identifier of the AppSync Merged API. This is generated by the AppSync service. In most cases, Merged APIs (especially in your account) only require the API ID value or ARN of the merged API. However, Merged APIs in other accounts (cross-account use cases) strictly require the full resource ARN of the merged API.
     */
    mergedApiIdentifier: String;
    /**
     * The ID generated by the AppSync service for the source API association.
     */
    associationId: String;
  }
  export interface GetSourceApiAssociationResponse {
    /**
     * The SourceApiAssociation object data.
     */
    sourceApiAssociation?: SourceApiAssociation;
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
  export type GraphQLApiType = "GRAPHQL"|"MERGED"|string;
  export type GraphQLApiVisibility = "GLOBAL"|"PRIVATE"|string;
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
     * The Amazon Resource Name (ARN).
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
     * A flag indicating whether to use X-Ray tracing for this GraphqlApi.
     */
    xrayEnabled?: Boolean;
    /**
     * The ARN of the WAF access control list (ACL) associated with this GraphqlApi, if one exists.
     */
    wafWebAclArn?: String;
    /**
     * Configuration for Lambda function authorization.
     */
    lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
    /**
     * The DNS records for the API.
     */
    dns?: MapOfStringToString;
    /**
     * Sets the value of the GraphQL API to public (GLOBAL) or private (PRIVATE). If no value is provided, the visibility will be set to GLOBAL by default. This value cannot be changed once the API has been created.
     */
    visibility?: GraphQLApiVisibility;
    /**
     * The value that indicates whether the GraphQL API is a standard API (GRAPHQL) or merged API (MERGED).
     */
    apiType?: GraphQLApiType;
    /**
     * The Identity and Access Management service role ARN for a merged API. The AppSync service assumes this role on behalf of the Merged API to validate access to source APIs at runtime and to prompt the AUTO_MERGE to update the merged API endpoint with the source API changes automatically.
     */
    mergedApiExecutionRoleArn?: String;
    /**
     * The account owner of the GraphQL API.
     */
    owner?: String;
    /**
     * The owner contact information for an API resource. This field accepts any string input with a length of 0 - 256 characters.
     */
    ownerContact?: String;
  }
  export type GraphqlApis = GraphqlApi[];
  export interface HttpDataSourceConfig {
    /**
     * The HTTP URL endpoint. You can specify either the domain name or IP, and port combination, and the URL scheme must be HTTP or HTTPS. If you don't specify the port, AppSync uses the default port 80 for the HTTP endpoint and port 443 for HTTPS endpoints.
     */
    endpoint?: String;
    /**
     * The authorization configuration in case the HTTP endpoint requires authorization.
     */
    authorizationConfig?: AuthorizationConfig;
  }
  export interface LambdaAuthorizerConfig {
    /**
     * The number of seconds a response should be cached for. The default is 0 seconds, which disables caching. If you don't specify a value for authorizerResultTtlInSeconds, the default value is used. The maximum value is one hour (3600 seconds). The Lambda function can override this by returning a ttlOverride key in its response.
     */
    authorizerResultTtlInSeconds?: TTL;
    /**
     * The Amazon Resource Name (ARN) of the Lambda function to be called for authorization. This can be a standard Lambda ARN, a version ARN (.../v3), or an alias ARN.   Note: This Lambda function must have the following resource-based policy assigned to it. When configuring Lambda authorizers in the console, this is done for you. To use the Command Line Interface (CLI), run the following:  aws lambda add-permission --function-name "arn:aws:lambda:us-east-2:111122223333:function:my-function" --statement-id "appsync" --principal appsync.amazonaws.com --action lambda:InvokeFunction 
     */
    authorizerUri: String;
    /**
     * A regular expression for validation of tokens before the Lambda function is called.
     */
    identityValidationExpression?: String;
  }
  export interface LambdaConflictHandlerConfig {
    /**
     * The Amazon Resource Name (ARN) for the Lambda function to use as the Conflict Handler.
     */
    lambdaConflictHandlerArn?: String;
  }
  export interface LambdaDataSourceConfig {
    /**
     * The Amazon Resource Name (ARN) for the Lambda function.
     */
    lambdaFunctionArn: String;
  }
  export interface ListApiKeysRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results that you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListApiKeysResponse {
    /**
     * The ApiKey objects.
     */
    apiKeys?: ApiKeys;
    /**
     * An identifier to pass in the next request to this operation to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListDataSourcesRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results that you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListDataSourcesResponse {
    /**
     * The DataSource objects.
     */
    dataSources?: DataSources;
    /**
     * An identifier to pass in the next request to this operation to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListDomainNamesRequest {
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results that you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListDomainNamesResponse {
    /**
     * Lists configurations for multiple domain names.
     */
    domainNameConfigs?: DomainNameConfigs;
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListFunctionsRequest {
    /**
     * The GraphQL API ID.
     */
    apiId: String;
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results that you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListFunctionsResponse {
    /**
     * A list of Function objects.
     */
    functions?: Functions;
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListGraphqlApisRequest {
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results that you want the request to return.
     */
    maxResults?: MaxResults;
    /**
     * The value that indicates whether the GraphQL API is a standard API (GRAPHQL) or merged API (MERGED).
     */
    apiType?: GraphQLApiType;
    /**
     * The account owner of the GraphQL API.
     */
    owner?: Ownership;
  }
  export interface ListGraphqlApisResponse {
    /**
     * The GraphqlApi objects.
     */
    graphqlApis?: GraphqlApis;
    /**
     * An identifier to pass in the next request to this operation to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListResolversByFunctionRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * The function ID.
     */
    functionId: String;
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results that you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListResolversByFunctionResponse {
    /**
     * The list of resolvers.
     */
    resolvers?: Resolvers;
    /**
     * An identifier that you can use to return the next set of items in the list.
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
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results that you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListResolversResponse {
    /**
     * The Resolver objects.
     */
    resolvers?: Resolvers;
    /**
     * An identifier to pass in the next request to this operation to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListSourceApiAssociationsRequest {
    /**
     * The API ID.
     */
    apiId: String;
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results that you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListSourceApiAssociationsResponse {
    /**
     * The SourceApiAssociationSummary object data.
     */
    sourceApiAssociationSummaries?: SourceApiAssociationSummaryList;
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The GraphqlApi Amazon Resource Name (ARN).
     */
    resourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A TagMap object.
     */
    tags?: TagMap;
  }
  export interface ListTypesByAssociationRequest {
    /**
     * The identifier of the AppSync Merged API. This is generated by the AppSync service. In most cases, Merged APIs (especially in your account) only require the API ID value or ARN of the merged API. However, Merged APIs in other accounts (cross-account use cases) strictly require the full resource ARN of the merged API.
     */
    mergedApiIdentifier: String;
    /**
     * The ID generated by the AppSync service for the source API association.
     */
    associationId: String;
    /**
     * The format type.
     */
    format: TypeDefinitionFormat;
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results that you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListTypesByAssociationResponse {
    /**
     * The Type objects.
     */
    types?: TypeList;
    /**
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
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
     * An identifier that was returned from the previous call to this operation, which you can use to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results that you want the request to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListTypesResponse {
    /**
     * The Type objects.
     */
    types?: TypeList;
    /**
     * An identifier to pass in the next request to this operation to return the next set of items in the list.
     */
    nextToken?: PaginationToken;
  }
  export interface LogConfig {
    /**
     * The field logging level. Values can be NONE, ERROR, or ALL.    NONE: No field-level logs are captured.    ERROR: Logs the following information only for the fields that are in error:   The error section in the server response.   Field-level errors.   The generated request/response functions that got resolved for error fields.      ALL: The following information is logged for all fields in the query:   Field-level tracing information.   The generated request/response functions that got resolved for each field.    
     */
    fieldLogLevel: FieldLogLevel;
    /**
     * The service role that AppSync assumes to publish to CloudWatch logs in your account.
     */
    cloudWatchLogsRoleArn: String;
    /**
     * Set to TRUE to exclude sections that contain information such as headers, context, and evaluated mapping templates, regardless of logging level.
     */
    excludeVerboseContent?: Boolean;
  }
  export type Logs = String[];
  export type Long = number;
  export type MapOfStringToString = {[key: string]: String};
  export type MappingTemplate = string;
  export type MaxBatchSize = number;
  export type MaxResults = number;
  export type MergeType = "MANUAL_MERGE"|"AUTO_MERGE"|string;
  export interface OpenIDConnectConfig {
    /**
     * The issuer for the OIDC configuration. The issuer returned by discovery must exactly match the value of iss in the ID token.
     */
    issuer: String;
    /**
     * The client identifier of the relying party at the OpenID identity provider. This identifier is typically obtained when the relying party is registered with the OpenID identity provider. You can specify a regular expression so that AppSync can validate against multiple client identifiers at a time.
     */
    clientId?: String;
    /**
     * The number of milliseconds that a token is valid after it's issued to a user.
     */
    iatTTL?: Long;
    /**
     * The number of milliseconds that a token is valid after being authenticated.
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
  export type Ownership = "CURRENT_ACCOUNT"|"OTHER_ACCOUNTS"|string;
  export type PaginationToken = string;
  export interface PipelineConfig {
    /**
     * A list of Function objects.
     */
    functions?: FunctionsIds;
  }
  export interface RdsHttpEndpointConfig {
    /**
     * Amazon Web Services Region for Amazon RDS HTTP endpoint.
     */
    awsRegion?: String;
    /**
     * Amazon RDS cluster Amazon Resource Name (ARN).
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
     * Amazon Web Services secret store Amazon Resource Name (ARN) for database credentials.
     */
    awsSecretStoreArn?: String;
  }
  export interface RelationalDatabaseDataSourceConfig {
    /**
     * Source type for the relational database.    RDS_HTTP_ENDPOINT: The relational database source type is an Amazon Relational Database Service (Amazon RDS) HTTP endpoint.  
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
     * The resolver Amazon Resource Name (ARN).
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
     * The resolver type.    UNIT: A UNIT resolver type. A UNIT resolver is the default resolver type. You can use a UNIT resolver to run a GraphQL query against a single data source.    PIPELINE: A PIPELINE resolver type. You can use a PIPELINE resolver to invoke a series of Function objects in a serial manner. You can use a pipeline resolver to run a GraphQL query against multiple data sources.  
     */
    kind?: ResolverKind;
    /**
     * The PipelineConfig.
     */
    pipelineConfig?: PipelineConfig;
    /**
     * The SyncConfig for a resolver attached to a versioned data source.
     */
    syncConfig?: SyncConfig;
    /**
     * The caching configuration for the resolver.
     */
    cachingConfig?: CachingConfig;
    /**
     * The maximum batching size for a resolver.
     */
    maxBatchSize?: MaxBatchSize;
    runtime?: AppSyncRuntime;
    /**
     * The resolver code that contains the request and response functions. When code is used, the runtime is required. The runtime value must be APPSYNC_JS.
     */
    code?: Code;
  }
  export type ResolverKind = "UNIT"|"PIPELINE"|string;
  export type Resolvers = Resolver[];
  export type ResourceArn = string;
  export type ResourceName = string;
  export type RuntimeName = "APPSYNC_JS"|string;
  export type SchemaStatus = "PROCESSING"|"ACTIVE"|"DELETING"|"FAILED"|"SUCCESS"|"NOT_APPLICABLE"|string;
  export interface SourceApiAssociation {
    /**
     * The ID generated by the AppSync service for the source API association.
     */
    associationId?: String;
    /**
     * The Amazon Resource Name (ARN) of the source API association.
     */
    associationArn?: String;
    /**
     * The ID of the AppSync source API.
     */
    sourceApiId?: String;
    /**
     * The Amazon Resource Name (ARN) of the AppSync source API.
     */
    sourceApiArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the AppSync Merged API.
     */
    mergedApiArn?: String;
    /**
     * The ID of the AppSync Merged API.
     */
    mergedApiId?: String;
    /**
     * The description field.
     */
    description?: String;
    /**
     * The SourceApiAssociationConfig object data.
     */
    sourceApiAssociationConfig?: SourceApiAssociationConfig;
    /**
     * The state of the source API association.
     */
    sourceApiAssociationStatus?: SourceApiAssociationStatus;
    /**
     * The detailed message related to the current state of the source API association.
     */
    sourceApiAssociationStatusDetail?: String;
    /**
     * The datetime value of the last successful merge of the source API association. The result will be in UTC format and your local time zone.
     */
    lastSuccessfulMergeDate?: _Date;
  }
  export interface SourceApiAssociationConfig {
    /**
     * The property that indicates which merging option is enabled in the source API association. Valid merge types are MANUAL_MERGE (default) and AUTO_MERGE. Manual merges are the default behavior and require the user to trigger any changes from the source APIs to the merged API manually. Auto merges subscribe the merged API to the changes performed on the source APIs so that any change in the source APIs are also made to the merged API. Auto merges use MergedApiExecutionRoleArn to perform merge operations.
     */
    mergeType?: MergeType;
  }
  export type SourceApiAssociationStatus = "MERGE_SCHEDULED"|"MERGE_FAILED"|"MERGE_SUCCESS"|"MERGE_IN_PROGRESS"|"AUTO_MERGE_SCHEDULE_FAILED"|"DELETION_SCHEDULED"|"DELETION_IN_PROGRESS"|"DELETION_FAILED"|string;
  export interface SourceApiAssociationSummary {
    /**
     * The ID generated by the AppSync service for the source API association.
     */
    associationId?: String;
    /**
     * The Amazon Resource Name (ARN) of the source API association.
     */
    associationArn?: String;
    /**
     * The ID of the AppSync source API.
     */
    sourceApiId?: String;
    /**
     * The Amazon Resource Name (ARN) of the AppSync Source API.
     */
    sourceApiArn?: String;
    /**
     * The ID of the AppSync Merged API.
     */
    mergedApiId?: String;
    /**
     * The Amazon Resource Name (ARN) of the AppSync Merged API.
     */
    mergedApiArn?: String;
    /**
     * The description field.
     */
    description?: String;
  }
  export type SourceApiAssociationSummaryList = SourceApiAssociationSummary[];
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
  export interface StartSchemaMergeRequest {
    /**
     * The ID generated by the AppSync service for the source API association.
     */
    associationId: String;
    /**
     * The identifier of the AppSync Merged API. This is generated by the AppSync service. In most cases, Merged APIs (especially in your account) only require the API ID value or ARN of the merged API. However, Merged APIs in other accounts (cross-account use cases) strictly require the full resource ARN of the merged API.
     */
    mergedApiIdentifier: String;
  }
  export interface StartSchemaMergeResponse {
    /**
     * The state of the source API association.
     */
    sourceApiAssociationStatus?: SourceApiAssociationStatus;
  }
  export type String = string;
  export interface SyncConfig {
    /**
     * The Conflict Resolution strategy to perform in the event of a conflict.    OPTIMISTIC_CONCURRENCY: Resolve conflicts by rejecting mutations when versions don't match the latest version at the server.    AUTOMERGE: Resolve conflicts with the Automerge conflict resolution strategy.    LAMBDA: Resolve conflicts with an Lambda function supplied in the LambdaConflictHandlerConfig.  
     */
    conflictHandler?: ConflictHandlerType;
    /**
     * The Conflict Detection strategy to use.    VERSION: Detect conflicts based on object versions for this resolver.    NONE: Do not detect conflicts when invoking this resolver.  
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
     * The GraphqlApi Amazon Resource Name (ARN).
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
  export type Template = string;
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
     * The type Amazon Resource Name (ARN).
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
     * The GraphqlApi Amazon Resource Name (ARN).
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
     * The GraphQL API ID.
     */
    apiId: String;
    /**
     * TTL in seconds for cache entries. Valid values are 1–3,600 seconds.
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
     * From the update time, the time after which the API key expires. The date is represented as seconds since the epoch. For more information, see .
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
     * The new service role Amazon Resource Name (ARN) for the data source.
     */
    serviceRoleArn?: String;
    /**
     * The new Amazon DynamoDB configuration.
     */
    dynamodbConfig?: DynamodbDataSourceConfig;
    /**
     * The new Lambda configuration.
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
    /**
     * The new Amazon EventBridge settings.
     */
    eventBridgeConfig?: EventBridgeDataSourceConfig;
  }
  export interface UpdateDataSourceResponse {
    /**
     * The updated DataSource object.
     */
    dataSource?: DataSource;
  }
  export interface UpdateDomainNameRequest {
    /**
     * The domain name.
     */
    domainName: DomainName;
    /**
     * A description of the DomainName.
     */
    description?: Description;
  }
  export interface UpdateDomainNameResponse {
    /**
     * The configuration for the DomainName.
     */
    domainNameConfig?: DomainNameConfig;
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
     * The version of the request mapping template. Currently, the supported value is 2018-05-29. Note that when using VTL and mapping templates, the functionVersion is required.
     */
    functionVersion?: String;
    syncConfig?: SyncConfig;
    /**
     * The maximum batching size for a resolver.
     */
    maxBatchSize?: MaxBatchSize;
    runtime?: AppSyncRuntime;
    /**
     * The function code that contains the request and response functions. When code is used, the runtime is required. The runtime value must be APPSYNC_JS.
     */
    code?: Code;
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
     * The new Amazon Cognito user pool configuration for the ~GraphqlApi object.
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
     * A flag indicating whether to use X-Ray tracing for the GraphqlApi.
     */
    xrayEnabled?: Boolean;
    /**
     * Configuration for Lambda function authorization.
     */
    lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
    /**
     * The Identity and Access Management service role ARN for a merged API. The AppSync service assumes this role on behalf of the Merged API to validate access to source APIs at runtime and to prompt the AUTO_MERGE to update the merged API endpoint with the source API changes automatically.
     */
    mergedApiExecutionRoleArn?: String;
    /**
     * The owner contact information for an API resource. This field accepts any string input with a length of 0 - 256 characters.
     */
    ownerContact?: String;
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
     * The new request mapping template. A resolver uses a request mapping template to convert a GraphQL expression into a format that a data source can understand. Mapping templates are written in Apache Velocity Template Language (VTL). VTL request mapping templates are optional when using an Lambda data source. For all other data sources, VTL request and response mapping templates are required.
     */
    requestMappingTemplate?: MappingTemplate;
    /**
     * The new response mapping template.
     */
    responseMappingTemplate?: MappingTemplate;
    /**
     * The resolver type.    UNIT: A UNIT resolver type. A UNIT resolver is the default resolver type. You can use a UNIT resolver to run a GraphQL query against a single data source.    PIPELINE: A PIPELINE resolver type. You can use a PIPELINE resolver to invoke a series of Function objects in a serial manner. You can use a pipeline resolver to run a GraphQL query against multiple data sources.  
     */
    kind?: ResolverKind;
    /**
     * The PipelineConfig.
     */
    pipelineConfig?: PipelineConfig;
    /**
     * The SyncConfig for a resolver attached to a versioned data source.
     */
    syncConfig?: SyncConfig;
    /**
     * The caching configuration for the resolver.
     */
    cachingConfig?: CachingConfig;
    /**
     * The maximum batching size for a resolver.
     */
    maxBatchSize?: MaxBatchSize;
    runtime?: AppSyncRuntime;
    /**
     * The resolver code that contains the request and response functions. When code is used, the runtime is required. The runtime value must be APPSYNC_JS.
     */
    code?: Code;
  }
  export interface UpdateResolverResponse {
    /**
     * The updated Resolver object.
     */
    resolver?: Resolver;
  }
  export interface UpdateSourceApiAssociationRequest {
    /**
     * The ID generated by the AppSync service for the source API association.
     */
    associationId: String;
    /**
     * The identifier of the AppSync Merged API. This is generated by the AppSync service. In most cases, Merged APIs (especially in your account) only require the API ID value or ARN of the merged API. However, Merged APIs in other accounts (cross-account use cases) strictly require the full resource ARN of the merged API.
     */
    mergedApiIdentifier: String;
    /**
     * The description field.
     */
    description?: String;
    /**
     * The SourceApiAssociationConfig object data.
     */
    sourceApiAssociationConfig?: SourceApiAssociationConfig;
  }
  export interface UpdateSourceApiAssociationResponse {
    /**
     * The SourceApiAssociation object data.
     */
    sourceApiAssociation?: SourceApiAssociation;
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
     * A regular expression for validating the incoming Amazon Cognito user pool app client ID. If this value isn't set, no filtering is applied.
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
