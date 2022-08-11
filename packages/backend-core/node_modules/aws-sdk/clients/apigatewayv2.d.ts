import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ApiGatewayV2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ApiGatewayV2.Types.ClientConfiguration)
  config: Config & ApiGatewayV2.Types.ClientConfiguration;
  /**
   * Creates an Api resource.
   */
  createApi(params: ApiGatewayV2.Types.CreateApiRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateApiResponse) => void): Request<ApiGatewayV2.Types.CreateApiResponse, AWSError>;
  /**
   * Creates an Api resource.
   */
  createApi(callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateApiResponse) => void): Request<ApiGatewayV2.Types.CreateApiResponse, AWSError>;
  /**
   * Creates an API mapping.
   */
  createApiMapping(params: ApiGatewayV2.Types.CreateApiMappingRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateApiMappingResponse) => void): Request<ApiGatewayV2.Types.CreateApiMappingResponse, AWSError>;
  /**
   * Creates an API mapping.
   */
  createApiMapping(callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateApiMappingResponse) => void): Request<ApiGatewayV2.Types.CreateApiMappingResponse, AWSError>;
  /**
   * Creates an Authorizer for an API.
   */
  createAuthorizer(params: ApiGatewayV2.Types.CreateAuthorizerRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateAuthorizerResponse) => void): Request<ApiGatewayV2.Types.CreateAuthorizerResponse, AWSError>;
  /**
   * Creates an Authorizer for an API.
   */
  createAuthorizer(callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateAuthorizerResponse) => void): Request<ApiGatewayV2.Types.CreateAuthorizerResponse, AWSError>;
  /**
   * Creates a Deployment for an API.
   */
  createDeployment(params: ApiGatewayV2.Types.CreateDeploymentRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateDeploymentResponse) => void): Request<ApiGatewayV2.Types.CreateDeploymentResponse, AWSError>;
  /**
   * Creates a Deployment for an API.
   */
  createDeployment(callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateDeploymentResponse) => void): Request<ApiGatewayV2.Types.CreateDeploymentResponse, AWSError>;
  /**
   * Creates a domain name.
   */
  createDomainName(params: ApiGatewayV2.Types.CreateDomainNameRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateDomainNameResponse) => void): Request<ApiGatewayV2.Types.CreateDomainNameResponse, AWSError>;
  /**
   * Creates a domain name.
   */
  createDomainName(callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateDomainNameResponse) => void): Request<ApiGatewayV2.Types.CreateDomainNameResponse, AWSError>;
  /**
   * Creates an Integration.
   */
  createIntegration(params: ApiGatewayV2.Types.CreateIntegrationRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateIntegrationResult) => void): Request<ApiGatewayV2.Types.CreateIntegrationResult, AWSError>;
  /**
   * Creates an Integration.
   */
  createIntegration(callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateIntegrationResult) => void): Request<ApiGatewayV2.Types.CreateIntegrationResult, AWSError>;
  /**
   * Creates an IntegrationResponses.
   */
  createIntegrationResponse(params: ApiGatewayV2.Types.CreateIntegrationResponseRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateIntegrationResponseResponse) => void): Request<ApiGatewayV2.Types.CreateIntegrationResponseResponse, AWSError>;
  /**
   * Creates an IntegrationResponses.
   */
  createIntegrationResponse(callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateIntegrationResponseResponse) => void): Request<ApiGatewayV2.Types.CreateIntegrationResponseResponse, AWSError>;
  /**
   * Creates a Model for an API.
   */
  createModel(params: ApiGatewayV2.Types.CreateModelRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateModelResponse) => void): Request<ApiGatewayV2.Types.CreateModelResponse, AWSError>;
  /**
   * Creates a Model for an API.
   */
  createModel(callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateModelResponse) => void): Request<ApiGatewayV2.Types.CreateModelResponse, AWSError>;
  /**
   * Creates a Route for an API.
   */
  createRoute(params: ApiGatewayV2.Types.CreateRouteRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateRouteResult) => void): Request<ApiGatewayV2.Types.CreateRouteResult, AWSError>;
  /**
   * Creates a Route for an API.
   */
  createRoute(callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateRouteResult) => void): Request<ApiGatewayV2.Types.CreateRouteResult, AWSError>;
  /**
   * Creates a RouteResponse for a Route.
   */
  createRouteResponse(params: ApiGatewayV2.Types.CreateRouteResponseRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateRouteResponseResponse) => void): Request<ApiGatewayV2.Types.CreateRouteResponseResponse, AWSError>;
  /**
   * Creates a RouteResponse for a Route.
   */
  createRouteResponse(callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateRouteResponseResponse) => void): Request<ApiGatewayV2.Types.CreateRouteResponseResponse, AWSError>;
  /**
   * Creates a Stage for an API.
   */
  createStage(params: ApiGatewayV2.Types.CreateStageRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateStageResponse) => void): Request<ApiGatewayV2.Types.CreateStageResponse, AWSError>;
  /**
   * Creates a Stage for an API.
   */
  createStage(callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateStageResponse) => void): Request<ApiGatewayV2.Types.CreateStageResponse, AWSError>;
  /**
   * Creates a VPC link.
   */
  createVpcLink(params: ApiGatewayV2.Types.CreateVpcLinkRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateVpcLinkResponse) => void): Request<ApiGatewayV2.Types.CreateVpcLinkResponse, AWSError>;
  /**
   * Creates a VPC link.
   */
  createVpcLink(callback?: (err: AWSError, data: ApiGatewayV2.Types.CreateVpcLinkResponse) => void): Request<ApiGatewayV2.Types.CreateVpcLinkResponse, AWSError>;
  /**
   * Deletes the AccessLogSettings for a Stage. To disable access logging for a Stage, delete its AccessLogSettings.
   */
  deleteAccessLogSettings(params: ApiGatewayV2.Types.DeleteAccessLogSettingsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the AccessLogSettings for a Stage. To disable access logging for a Stage, delete its AccessLogSettings.
   */
  deleteAccessLogSettings(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Api resource.
   */
  deleteApi(params: ApiGatewayV2.Types.DeleteApiRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Api resource.
   */
  deleteApi(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an API mapping.
   */
  deleteApiMapping(params: ApiGatewayV2.Types.DeleteApiMappingRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an API mapping.
   */
  deleteApiMapping(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Authorizer.
   */
  deleteAuthorizer(params: ApiGatewayV2.Types.DeleteAuthorizerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Authorizer.
   */
  deleteAuthorizer(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a CORS configuration.
   */
  deleteCorsConfiguration(params: ApiGatewayV2.Types.DeleteCorsConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a CORS configuration.
   */
  deleteCorsConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Deployment.
   */
  deleteDeployment(params: ApiGatewayV2.Types.DeleteDeploymentRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Deployment.
   */
  deleteDeployment(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a domain name.
   */
  deleteDomainName(params: ApiGatewayV2.Types.DeleteDomainNameRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a domain name.
   */
  deleteDomainName(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Integration.
   */
  deleteIntegration(params: ApiGatewayV2.Types.DeleteIntegrationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Integration.
   */
  deleteIntegration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an IntegrationResponses.
   */
  deleteIntegrationResponse(params: ApiGatewayV2.Types.DeleteIntegrationResponseRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an IntegrationResponses.
   */
  deleteIntegrationResponse(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Model.
   */
  deleteModel(params: ApiGatewayV2.Types.DeleteModelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Model.
   */
  deleteModel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Route.
   */
  deleteRoute(params: ApiGatewayV2.Types.DeleteRouteRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Route.
   */
  deleteRoute(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a route request parameter.
   */
  deleteRouteRequestParameter(params: ApiGatewayV2.Types.DeleteRouteRequestParameterRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a route request parameter.
   */
  deleteRouteRequestParameter(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a RouteResponse.
   */
  deleteRouteResponse(params: ApiGatewayV2.Types.DeleteRouteResponseRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a RouteResponse.
   */
  deleteRouteResponse(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the RouteSettings for a stage.
   */
  deleteRouteSettings(params: ApiGatewayV2.Types.DeleteRouteSettingsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the RouteSettings for a stage.
   */
  deleteRouteSettings(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Stage.
   */
  deleteStage(params: ApiGatewayV2.Types.DeleteStageRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Stage.
   */
  deleteStage(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a VPC link.
   */
  deleteVpcLink(params: ApiGatewayV2.Types.DeleteVpcLinkRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.DeleteVpcLinkResponse) => void): Request<ApiGatewayV2.Types.DeleteVpcLinkResponse, AWSError>;
  /**
   * Deletes a VPC link.
   */
  deleteVpcLink(callback?: (err: AWSError, data: ApiGatewayV2.Types.DeleteVpcLinkResponse) => void): Request<ApiGatewayV2.Types.DeleteVpcLinkResponse, AWSError>;
  /**
   * 
   */
  exportApi(params: ApiGatewayV2.Types.ExportApiRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.ExportApiResponse) => void): Request<ApiGatewayV2.Types.ExportApiResponse, AWSError>;
  /**
   * 
   */
  exportApi(callback?: (err: AWSError, data: ApiGatewayV2.Types.ExportApiResponse) => void): Request<ApiGatewayV2.Types.ExportApiResponse, AWSError>;
  /**
   * Resets all authorizer cache entries on a stage. Supported only for HTTP APIs.
   */
  resetAuthorizersCache(params: ApiGatewayV2.Types.ResetAuthorizersCacheRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Resets all authorizer cache entries on a stage. Supported only for HTTP APIs.
   */
  resetAuthorizersCache(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets an Api resource.
   */
  getApi(params: ApiGatewayV2.Types.GetApiRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetApiResponse) => void): Request<ApiGatewayV2.Types.GetApiResponse, AWSError>;
  /**
   * Gets an Api resource.
   */
  getApi(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetApiResponse) => void): Request<ApiGatewayV2.Types.GetApiResponse, AWSError>;
  /**
   * Gets an API mapping.
   */
  getApiMapping(params: ApiGatewayV2.Types.GetApiMappingRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetApiMappingResponse) => void): Request<ApiGatewayV2.Types.GetApiMappingResponse, AWSError>;
  /**
   * Gets an API mapping.
   */
  getApiMapping(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetApiMappingResponse) => void): Request<ApiGatewayV2.Types.GetApiMappingResponse, AWSError>;
  /**
   * Gets API mappings.
   */
  getApiMappings(params: ApiGatewayV2.Types.GetApiMappingsRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetApiMappingsResponse) => void): Request<ApiGatewayV2.Types.GetApiMappingsResponse, AWSError>;
  /**
   * Gets API mappings.
   */
  getApiMappings(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetApiMappingsResponse) => void): Request<ApiGatewayV2.Types.GetApiMappingsResponse, AWSError>;
  /**
   * Gets a collection of Api resources.
   */
  getApis(params: ApiGatewayV2.Types.GetApisRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetApisResponse) => void): Request<ApiGatewayV2.Types.GetApisResponse, AWSError>;
  /**
   * Gets a collection of Api resources.
   */
  getApis(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetApisResponse) => void): Request<ApiGatewayV2.Types.GetApisResponse, AWSError>;
  /**
   * Gets an Authorizer.
   */
  getAuthorizer(params: ApiGatewayV2.Types.GetAuthorizerRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetAuthorizerResponse) => void): Request<ApiGatewayV2.Types.GetAuthorizerResponse, AWSError>;
  /**
   * Gets an Authorizer.
   */
  getAuthorizer(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetAuthorizerResponse) => void): Request<ApiGatewayV2.Types.GetAuthorizerResponse, AWSError>;
  /**
   * Gets the Authorizers for an API.
   */
  getAuthorizers(params: ApiGatewayV2.Types.GetAuthorizersRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetAuthorizersResponse) => void): Request<ApiGatewayV2.Types.GetAuthorizersResponse, AWSError>;
  /**
   * Gets the Authorizers for an API.
   */
  getAuthorizers(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetAuthorizersResponse) => void): Request<ApiGatewayV2.Types.GetAuthorizersResponse, AWSError>;
  /**
   * Gets a Deployment.
   */
  getDeployment(params: ApiGatewayV2.Types.GetDeploymentRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetDeploymentResponse) => void): Request<ApiGatewayV2.Types.GetDeploymentResponse, AWSError>;
  /**
   * Gets a Deployment.
   */
  getDeployment(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetDeploymentResponse) => void): Request<ApiGatewayV2.Types.GetDeploymentResponse, AWSError>;
  /**
   * Gets the Deployments for an API.
   */
  getDeployments(params: ApiGatewayV2.Types.GetDeploymentsRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetDeploymentsResponse) => void): Request<ApiGatewayV2.Types.GetDeploymentsResponse, AWSError>;
  /**
   * Gets the Deployments for an API.
   */
  getDeployments(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetDeploymentsResponse) => void): Request<ApiGatewayV2.Types.GetDeploymentsResponse, AWSError>;
  /**
   * Gets a domain name.
   */
  getDomainName(params: ApiGatewayV2.Types.GetDomainNameRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetDomainNameResponse) => void): Request<ApiGatewayV2.Types.GetDomainNameResponse, AWSError>;
  /**
   * Gets a domain name.
   */
  getDomainName(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetDomainNameResponse) => void): Request<ApiGatewayV2.Types.GetDomainNameResponse, AWSError>;
  /**
   * Gets the domain names for an AWS account.
   */
  getDomainNames(params: ApiGatewayV2.Types.GetDomainNamesRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetDomainNamesResponse) => void): Request<ApiGatewayV2.Types.GetDomainNamesResponse, AWSError>;
  /**
   * Gets the domain names for an AWS account.
   */
  getDomainNames(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetDomainNamesResponse) => void): Request<ApiGatewayV2.Types.GetDomainNamesResponse, AWSError>;
  /**
   * Gets an Integration.
   */
  getIntegration(params: ApiGatewayV2.Types.GetIntegrationRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetIntegrationResult) => void): Request<ApiGatewayV2.Types.GetIntegrationResult, AWSError>;
  /**
   * Gets an Integration.
   */
  getIntegration(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetIntegrationResult) => void): Request<ApiGatewayV2.Types.GetIntegrationResult, AWSError>;
  /**
   * Gets an IntegrationResponses.
   */
  getIntegrationResponse(params: ApiGatewayV2.Types.GetIntegrationResponseRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetIntegrationResponseResponse) => void): Request<ApiGatewayV2.Types.GetIntegrationResponseResponse, AWSError>;
  /**
   * Gets an IntegrationResponses.
   */
  getIntegrationResponse(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetIntegrationResponseResponse) => void): Request<ApiGatewayV2.Types.GetIntegrationResponseResponse, AWSError>;
  /**
   * Gets the IntegrationResponses for an Integration.
   */
  getIntegrationResponses(params: ApiGatewayV2.Types.GetIntegrationResponsesRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetIntegrationResponsesResponse) => void): Request<ApiGatewayV2.Types.GetIntegrationResponsesResponse, AWSError>;
  /**
   * Gets the IntegrationResponses for an Integration.
   */
  getIntegrationResponses(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetIntegrationResponsesResponse) => void): Request<ApiGatewayV2.Types.GetIntegrationResponsesResponse, AWSError>;
  /**
   * Gets the Integrations for an API.
   */
  getIntegrations(params: ApiGatewayV2.Types.GetIntegrationsRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetIntegrationsResponse) => void): Request<ApiGatewayV2.Types.GetIntegrationsResponse, AWSError>;
  /**
   * Gets the Integrations for an API.
   */
  getIntegrations(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetIntegrationsResponse) => void): Request<ApiGatewayV2.Types.GetIntegrationsResponse, AWSError>;
  /**
   * Gets a Model.
   */
  getModel(params: ApiGatewayV2.Types.GetModelRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetModelResponse) => void): Request<ApiGatewayV2.Types.GetModelResponse, AWSError>;
  /**
   * Gets a Model.
   */
  getModel(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetModelResponse) => void): Request<ApiGatewayV2.Types.GetModelResponse, AWSError>;
  /**
   * Gets a model template.
   */
  getModelTemplate(params: ApiGatewayV2.Types.GetModelTemplateRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetModelTemplateResponse) => void): Request<ApiGatewayV2.Types.GetModelTemplateResponse, AWSError>;
  /**
   * Gets a model template.
   */
  getModelTemplate(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetModelTemplateResponse) => void): Request<ApiGatewayV2.Types.GetModelTemplateResponse, AWSError>;
  /**
   * Gets the Models for an API.
   */
  getModels(params: ApiGatewayV2.Types.GetModelsRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetModelsResponse) => void): Request<ApiGatewayV2.Types.GetModelsResponse, AWSError>;
  /**
   * Gets the Models for an API.
   */
  getModels(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetModelsResponse) => void): Request<ApiGatewayV2.Types.GetModelsResponse, AWSError>;
  /**
   * Gets a Route.
   */
  getRoute(params: ApiGatewayV2.Types.GetRouteRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetRouteResult) => void): Request<ApiGatewayV2.Types.GetRouteResult, AWSError>;
  /**
   * Gets a Route.
   */
  getRoute(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetRouteResult) => void): Request<ApiGatewayV2.Types.GetRouteResult, AWSError>;
  /**
   * Gets a RouteResponse.
   */
  getRouteResponse(params: ApiGatewayV2.Types.GetRouteResponseRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetRouteResponseResponse) => void): Request<ApiGatewayV2.Types.GetRouteResponseResponse, AWSError>;
  /**
   * Gets a RouteResponse.
   */
  getRouteResponse(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetRouteResponseResponse) => void): Request<ApiGatewayV2.Types.GetRouteResponseResponse, AWSError>;
  /**
   * Gets the RouteResponses for a Route.
   */
  getRouteResponses(params: ApiGatewayV2.Types.GetRouteResponsesRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetRouteResponsesResponse) => void): Request<ApiGatewayV2.Types.GetRouteResponsesResponse, AWSError>;
  /**
   * Gets the RouteResponses for a Route.
   */
  getRouteResponses(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetRouteResponsesResponse) => void): Request<ApiGatewayV2.Types.GetRouteResponsesResponse, AWSError>;
  /**
   * Gets the Routes for an API.
   */
  getRoutes(params: ApiGatewayV2.Types.GetRoutesRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetRoutesResponse) => void): Request<ApiGatewayV2.Types.GetRoutesResponse, AWSError>;
  /**
   * Gets the Routes for an API.
   */
  getRoutes(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetRoutesResponse) => void): Request<ApiGatewayV2.Types.GetRoutesResponse, AWSError>;
  /**
   * Gets a Stage.
   */
  getStage(params: ApiGatewayV2.Types.GetStageRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetStageResponse) => void): Request<ApiGatewayV2.Types.GetStageResponse, AWSError>;
  /**
   * Gets a Stage.
   */
  getStage(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetStageResponse) => void): Request<ApiGatewayV2.Types.GetStageResponse, AWSError>;
  /**
   * Gets the Stages for an API.
   */
  getStages(params: ApiGatewayV2.Types.GetStagesRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetStagesResponse) => void): Request<ApiGatewayV2.Types.GetStagesResponse, AWSError>;
  /**
   * Gets the Stages for an API.
   */
  getStages(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetStagesResponse) => void): Request<ApiGatewayV2.Types.GetStagesResponse, AWSError>;
  /**
   * Gets a collection of Tag resources.
   */
  getTags(params: ApiGatewayV2.Types.GetTagsRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetTagsResponse) => void): Request<ApiGatewayV2.Types.GetTagsResponse, AWSError>;
  /**
   * Gets a collection of Tag resources.
   */
  getTags(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetTagsResponse) => void): Request<ApiGatewayV2.Types.GetTagsResponse, AWSError>;
  /**
   * Gets a VPC link.
   */
  getVpcLink(params: ApiGatewayV2.Types.GetVpcLinkRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetVpcLinkResponse) => void): Request<ApiGatewayV2.Types.GetVpcLinkResponse, AWSError>;
  /**
   * Gets a VPC link.
   */
  getVpcLink(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetVpcLinkResponse) => void): Request<ApiGatewayV2.Types.GetVpcLinkResponse, AWSError>;
  /**
   * Gets a collection of VPC links.
   */
  getVpcLinks(params: ApiGatewayV2.Types.GetVpcLinksRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.GetVpcLinksResponse) => void): Request<ApiGatewayV2.Types.GetVpcLinksResponse, AWSError>;
  /**
   * Gets a collection of VPC links.
   */
  getVpcLinks(callback?: (err: AWSError, data: ApiGatewayV2.Types.GetVpcLinksResponse) => void): Request<ApiGatewayV2.Types.GetVpcLinksResponse, AWSError>;
  /**
   * Imports an API.
   */
  importApi(params: ApiGatewayV2.Types.ImportApiRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.ImportApiResponse) => void): Request<ApiGatewayV2.Types.ImportApiResponse, AWSError>;
  /**
   * Imports an API.
   */
  importApi(callback?: (err: AWSError, data: ApiGatewayV2.Types.ImportApiResponse) => void): Request<ApiGatewayV2.Types.ImportApiResponse, AWSError>;
  /**
   * Puts an Api resource.
   */
  reimportApi(params: ApiGatewayV2.Types.ReimportApiRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.ReimportApiResponse) => void): Request<ApiGatewayV2.Types.ReimportApiResponse, AWSError>;
  /**
   * Puts an Api resource.
   */
  reimportApi(callback?: (err: AWSError, data: ApiGatewayV2.Types.ReimportApiResponse) => void): Request<ApiGatewayV2.Types.ReimportApiResponse, AWSError>;
  /**
   * Creates a new Tag resource to represent a tag.
   */
  tagResource(params: ApiGatewayV2.Types.TagResourceRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.TagResourceResponse) => void): Request<ApiGatewayV2.Types.TagResourceResponse, AWSError>;
  /**
   * Creates a new Tag resource to represent a tag.
   */
  tagResource(callback?: (err: AWSError, data: ApiGatewayV2.Types.TagResourceResponse) => void): Request<ApiGatewayV2.Types.TagResourceResponse, AWSError>;
  /**
   * Deletes a Tag.
   */
  untagResource(params: ApiGatewayV2.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Tag.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an Api resource.
   */
  updateApi(params: ApiGatewayV2.Types.UpdateApiRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateApiResponse) => void): Request<ApiGatewayV2.Types.UpdateApiResponse, AWSError>;
  /**
   * Updates an Api resource.
   */
  updateApi(callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateApiResponse) => void): Request<ApiGatewayV2.Types.UpdateApiResponse, AWSError>;
  /**
   * The API mapping.
   */
  updateApiMapping(params: ApiGatewayV2.Types.UpdateApiMappingRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateApiMappingResponse) => void): Request<ApiGatewayV2.Types.UpdateApiMappingResponse, AWSError>;
  /**
   * The API mapping.
   */
  updateApiMapping(callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateApiMappingResponse) => void): Request<ApiGatewayV2.Types.UpdateApiMappingResponse, AWSError>;
  /**
   * Updates an Authorizer.
   */
  updateAuthorizer(params: ApiGatewayV2.Types.UpdateAuthorizerRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateAuthorizerResponse) => void): Request<ApiGatewayV2.Types.UpdateAuthorizerResponse, AWSError>;
  /**
   * Updates an Authorizer.
   */
  updateAuthorizer(callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateAuthorizerResponse) => void): Request<ApiGatewayV2.Types.UpdateAuthorizerResponse, AWSError>;
  /**
   * Updates a Deployment.
   */
  updateDeployment(params: ApiGatewayV2.Types.UpdateDeploymentRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateDeploymentResponse) => void): Request<ApiGatewayV2.Types.UpdateDeploymentResponse, AWSError>;
  /**
   * Updates a Deployment.
   */
  updateDeployment(callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateDeploymentResponse) => void): Request<ApiGatewayV2.Types.UpdateDeploymentResponse, AWSError>;
  /**
   * Updates a domain name.
   */
  updateDomainName(params: ApiGatewayV2.Types.UpdateDomainNameRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateDomainNameResponse) => void): Request<ApiGatewayV2.Types.UpdateDomainNameResponse, AWSError>;
  /**
   * Updates a domain name.
   */
  updateDomainName(callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateDomainNameResponse) => void): Request<ApiGatewayV2.Types.UpdateDomainNameResponse, AWSError>;
  /**
   * Updates an Integration.
   */
  updateIntegration(params: ApiGatewayV2.Types.UpdateIntegrationRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateIntegrationResult) => void): Request<ApiGatewayV2.Types.UpdateIntegrationResult, AWSError>;
  /**
   * Updates an Integration.
   */
  updateIntegration(callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateIntegrationResult) => void): Request<ApiGatewayV2.Types.UpdateIntegrationResult, AWSError>;
  /**
   * Updates an IntegrationResponses.
   */
  updateIntegrationResponse(params: ApiGatewayV2.Types.UpdateIntegrationResponseRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateIntegrationResponseResponse) => void): Request<ApiGatewayV2.Types.UpdateIntegrationResponseResponse, AWSError>;
  /**
   * Updates an IntegrationResponses.
   */
  updateIntegrationResponse(callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateIntegrationResponseResponse) => void): Request<ApiGatewayV2.Types.UpdateIntegrationResponseResponse, AWSError>;
  /**
   * Updates a Model.
   */
  updateModel(params: ApiGatewayV2.Types.UpdateModelRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateModelResponse) => void): Request<ApiGatewayV2.Types.UpdateModelResponse, AWSError>;
  /**
   * Updates a Model.
   */
  updateModel(callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateModelResponse) => void): Request<ApiGatewayV2.Types.UpdateModelResponse, AWSError>;
  /**
   * Updates a Route.
   */
  updateRoute(params: ApiGatewayV2.Types.UpdateRouteRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateRouteResult) => void): Request<ApiGatewayV2.Types.UpdateRouteResult, AWSError>;
  /**
   * Updates a Route.
   */
  updateRoute(callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateRouteResult) => void): Request<ApiGatewayV2.Types.UpdateRouteResult, AWSError>;
  /**
   * Updates a RouteResponse.
   */
  updateRouteResponse(params: ApiGatewayV2.Types.UpdateRouteResponseRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateRouteResponseResponse) => void): Request<ApiGatewayV2.Types.UpdateRouteResponseResponse, AWSError>;
  /**
   * Updates a RouteResponse.
   */
  updateRouteResponse(callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateRouteResponseResponse) => void): Request<ApiGatewayV2.Types.UpdateRouteResponseResponse, AWSError>;
  /**
   * Updates a Stage.
   */
  updateStage(params: ApiGatewayV2.Types.UpdateStageRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateStageResponse) => void): Request<ApiGatewayV2.Types.UpdateStageResponse, AWSError>;
  /**
   * Updates a Stage.
   */
  updateStage(callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateStageResponse) => void): Request<ApiGatewayV2.Types.UpdateStageResponse, AWSError>;
  /**
   * Updates a VPC link.
   */
  updateVpcLink(params: ApiGatewayV2.Types.UpdateVpcLinkRequest, callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateVpcLinkResponse) => void): Request<ApiGatewayV2.Types.UpdateVpcLinkResponse, AWSError>;
  /**
   * Updates a VPC link.
   */
  updateVpcLink(callback?: (err: AWSError, data: ApiGatewayV2.Types.UpdateVpcLinkResponse) => void): Request<ApiGatewayV2.Types.UpdateVpcLinkResponse, AWSError>;
}
declare namespace ApiGatewayV2 {
  export interface AccessLogSettings {
    /**
     * The ARN of the CloudWatch Logs log group to receive access logs.
     */
    DestinationArn?: Arn;
    /**
     * A single line format of the access logs of data, as specified by selected $context variables. The format must include at least $context.requestId.
     */
    Format?: StringWithLengthBetween1And1024;
  }
  export interface Api {
    /**
     * The URI of the API, of the form {api-id}.execute-api.{region}.amazonaws.com. The stage name is typically appended to this URI to form a complete path to a deployed API stage.
     */
    ApiEndpoint?: __string;
    /**
     * Specifies whether an API is managed by API Gateway. You can't update or delete a managed API by using API Gateway. A managed API can be deleted only through the tooling or service that created it.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * The API ID.
     */
    ApiId?: Id;
    /**
     * An API key selection expression. Supported only for WebSocket APIs. See API Key Selection Expressions.
     */
    ApiKeySelectionExpression?: SelectionExpression;
    /**
     * A CORS configuration. Supported only for HTTP APIs.
     */
    CorsConfiguration?: Cors;
    /**
     * The timestamp when the API was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The description of the API.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Avoid validating models when creating a deployment. Supported only for WebSocket APIs.
     */
    DisableSchemaValidation?: __boolean;
    /**
     * Specifies whether clients can invoke your API by using the default execute-api endpoint. By default, clients can invoke your API with the default https://{api_id}.execute-api.{region}.amazonaws.com endpoint. To require that clients use a custom domain name to invoke your API, disable the default endpoint.
     */
    DisableExecuteApiEndpoint?: __boolean;
    /**
     * The validation information during API import. This may include particular properties of your OpenAPI definition which are ignored during import. Supported only for HTTP APIs.
     */
    ImportInfo?: __listOf__string;
    /**
     * The name of the API.
     */
    Name: StringWithLengthBetween1And128;
    /**
     * The API protocol.
     */
    ProtocolType: ProtocolType;
    /**
     * The route selection expression for the API. For HTTP APIs, the routeSelectionExpression must be ${request.method} ${request.path}. If not provided, this will be the default for HTTP APIs. This property is required for WebSocket APIs.
     */
    RouteSelectionExpression: SelectionExpression;
    /**
     * A collection of tags associated with the API.
     */
    Tags?: Tags;
    /**
     * A version identifier for the API.
     */
    Version?: StringWithLengthBetween1And64;
    /**
     * The warning messages reported when failonwarnings is turned on during API import.
     */
    Warnings?: __listOf__string;
  }
  export interface ApiMapping {
    /**
     * The API identifier.
     */
    ApiId: Id;
    /**
     * The API mapping identifier.
     */
    ApiMappingId?: Id;
    /**
     * The API mapping key.
     */
    ApiMappingKey?: SelectionKey;
    /**
     * The API stage.
     */
    Stage: StringWithLengthBetween1And128;
  }
  export type Arn = string;
  export type AuthorizationScopes = StringWithLengthBetween1And64[];
  export type AuthorizationType = "NONE"|"AWS_IAM"|"CUSTOM"|"JWT"|string;
  export interface Authorizer {
    /**
     * Specifies the required credentials as an IAM role for API Gateway to invoke the authorizer. To specify an IAM role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To use resource-based permissions on the Lambda function, don't specify this parameter. Supported only for REQUEST authorizers.
     */
    AuthorizerCredentialsArn?: Arn;
    /**
     * The authorizer identifier.
     */
    AuthorizerId?: Id;
    /**
     * Specifies the format of the payload sent to an HTTP API Lambda authorizer. Required for HTTP API Lambda authorizers. Supported values are 1.0 and 2.0. To learn more, see Working with AWS Lambda authorizers for HTTP APIs.
     */
    AuthorizerPayloadFormatVersion?: StringWithLengthBetween1And64;
    /**
     * The time to live (TTL) for cached authorizer results, in seconds. If it equals 0, authorization caching is disabled. If it is greater than 0, API Gateway caches authorizer responses. The maximum value is 3600, or 1 hour. Supported only for HTTP API Lambda authorizers.
     */
    AuthorizerResultTtlInSeconds?: IntegerWithLengthBetween0And3600;
    /**
     * The authorizer type. Specify REQUEST for a Lambda function using incoming request parameters. Specify JWT to use JSON Web Tokens (supported only for HTTP APIs).
     */
    AuthorizerType?: AuthorizerType;
    /**
     * The authorizer's Uniform Resource Identifier (URI). For REQUEST authorizers, this must be a well-formed Lambda function URI, for example, arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:{account_id}:function:{lambda_function_name}/invocations. In general, the URI has this form: arn:aws:apigateway:{region}:lambda:path/{service_api}
               , where {region} is the same as the region hosting the Lambda function, path indicates that the remaining substring in the URI should be treated as the path to the resource, including the initial /. For Lambda functions, this is usually of the form /2015-03-31/functions/[FunctionARN]/invocations. Supported only for REQUEST authorizers.
     */
    AuthorizerUri?: UriWithLengthBetween1And2048;
    /**
     * Specifies whether a Lambda authorizer returns a response in a simple format. If enabled, the Lambda authorizer can return a boolean value instead of an IAM policy. Supported only for HTTP APIs. To learn more, see Working with AWS Lambda authorizers for HTTP APIs
     */
    EnableSimpleResponses?: __boolean;
    /**
     * The identity source for which authorization is requested. For a REQUEST authorizer, this is optional. The value is a set of one or more mapping expressions of the specified request parameters. The identity source can be headers, query string parameters, stage variables, and context parameters. For example, if an Auth header and a Name query string parameter are defined as identity sources, this value is route.request.header.Auth, route.request.querystring.Name for WebSocket APIs. For HTTP APIs, use selection expressions prefixed with $, for example, $request.header.Auth, $request.querystring.Name. These parameters are used to perform runtime validation for Lambda-based authorizers by verifying all of the identity-related request parameters are present in the request, not null, and non-empty. Only when this is true does the authorizer invoke the authorizer Lambda function. Otherwise, it returns a 401 Unauthorized response without calling the Lambda function. For HTTP APIs, identity sources are also used as the cache key when caching is enabled. To learn more, see Working with AWS Lambda authorizers for HTTP APIs. For JWT, a single entry that specifies where to extract the JSON Web Token (JWT) from inbound requests. Currently only header-based and query parameter-based selections are supported, for example $request.header.Authorization.
     */
    IdentitySource?: IdentitySourceList;
    /**
     * The validation expression does not apply to the REQUEST authorizer.
     */
    IdentityValidationExpression?: StringWithLengthBetween0And1024;
    /**
     * Represents the configuration of a JWT authorizer. Required for the JWT authorizer type. Supported only for HTTP APIs.
     */
    JwtConfiguration?: JWTConfiguration;
    /**
     * The name of the authorizer.
     */
    Name: StringWithLengthBetween1And128;
  }
  export type AuthorizerType = "REQUEST"|"JWT"|string;
  export type ConnectionType = "INTERNET"|"VPC_LINK"|string;
  export type ContentHandlingStrategy = "CONVERT_TO_BINARY"|"CONVERT_TO_TEXT"|string;
  export interface Cors {
    /**
     * Specifies whether credentials are included in the CORS request. Supported only for HTTP APIs.
     */
    AllowCredentials?: __boolean;
    /**
     * Represents a collection of allowed headers. Supported only for HTTP APIs.
     */
    AllowHeaders?: CorsHeaderList;
    /**
     * Represents a collection of allowed HTTP methods. Supported only for HTTP APIs.
     */
    AllowMethods?: CorsMethodList;
    /**
     * Represents a collection of allowed origins. Supported only for HTTP APIs.
     */
    AllowOrigins?: CorsOriginList;
    /**
     * Represents a collection of exposed headers. Supported only for HTTP APIs.
     */
    ExposeHeaders?: CorsHeaderList;
    /**
     * The number of seconds that the browser should cache preflight request results. Supported only for HTTP APIs.
     */
    MaxAge?: IntegerWithLengthBetweenMinus1And86400;
  }
  export type CorsHeaderList = __string[];
  export type CorsMethodList = StringWithLengthBetween1And64[];
  export type CorsOriginList = __string[];
  export interface CreateApiMappingRequest {
    /**
     * The API identifier.
     */
    ApiId: Id;
    /**
     * The API mapping key.
     */
    ApiMappingKey?: SelectionKey;
    /**
     * The domain name.
     */
    DomainName: __string;
    /**
     * The API stage.
     */
    Stage: StringWithLengthBetween1And128;
  }
  export interface CreateApiMappingResponse {
    /**
     * The API identifier.
     */
    ApiId?: Id;
    /**
     * The API mapping identifier.
     */
    ApiMappingId?: Id;
    /**
     * The API mapping key.
     */
    ApiMappingKey?: SelectionKey;
    /**
     * The API stage.
     */
    Stage?: StringWithLengthBetween1And128;
  }
  export interface CreateApiRequest {
    /**
     * An API key selection expression. Supported only for WebSocket APIs. See API Key Selection Expressions.
     */
    ApiKeySelectionExpression?: SelectionExpression;
    /**
     * A CORS configuration. Supported only for HTTP APIs. See Configuring CORS for more information.
     */
    CorsConfiguration?: Cors;
    /**
     * This property is part of quick create. It specifies the credentials required for the integration, if any. For a Lambda integration, three options are available. To specify an IAM Role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To require that the caller's identity be passed through from the request, specify arn:aws:iam::*:user/*. To use resource-based permissions on supported AWS services, specify null. Currently, this property is not used for HTTP integrations. Supported only for HTTP APIs.
     */
    CredentialsArn?: Arn;
    /**
     * The description of the API.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Avoid validating models when creating a deployment. Supported only for WebSocket APIs.
     */
    DisableSchemaValidation?: __boolean;
    /**
     * Specifies whether clients can invoke your API by using the default execute-api endpoint. By default, clients can invoke your API with the default https://{api_id}.execute-api.{region}.amazonaws.com endpoint. To require that clients use a custom domain name to invoke your API, disable the default endpoint.
     */
    DisableExecuteApiEndpoint?: __boolean;
    /**
     * The name of the API.
     */
    Name: StringWithLengthBetween1And128;
    /**
     * The API protocol.
     */
    ProtocolType: ProtocolType;
    /**
     * This property is part of quick create. If you don't specify a routeKey, a default route of $default is created. The $default route acts as a catch-all for any request made to your API, for a particular stage. The $default route key can't be modified. You can add routes after creating the API, and you can update the route keys of additional routes. Supported only for HTTP APIs.
     */
    RouteKey?: SelectionKey;
    /**
     * The route selection expression for the API. For HTTP APIs, the routeSelectionExpression must be ${request.method} ${request.path}. If not provided, this will be the default for HTTP APIs. This property is required for WebSocket APIs.
     */
    RouteSelectionExpression?: SelectionExpression;
    /**
     * The collection of tags. Each tag element is associated with a given resource.
     */
    Tags?: Tags;
    /**
     * This property is part of quick create. Quick create produces an API with an integration, a default catch-all route, and a default stage which is configured to automatically deploy changes. For HTTP integrations, specify a fully qualified URL. For Lambda integrations, specify a function ARN. The type of the integration will be HTTP_PROXY or AWS_PROXY, respectively. Supported only for HTTP APIs.
     */
    Target?: UriWithLengthBetween1And2048;
    /**
     * A version identifier for the API.
     */
    Version?: StringWithLengthBetween1And64;
  }
  export interface CreateApiResponse {
    /**
     * The URI of the API, of the form {api-id}.execute-api.{region}.amazonaws.com. The stage name is typically appended to this URI to form a complete path to a deployed API stage.
     */
    ApiEndpoint?: __string;
    /**
     * Specifies whether an API is managed by API Gateway. You can't update or delete a managed API by using API Gateway. A managed API can be deleted only through the tooling or service that created it.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * The API ID.
     */
    ApiId?: Id;
    /**
     * An API key selection expression. Supported only for WebSocket APIs. See API Key Selection Expressions.
     */
    ApiKeySelectionExpression?: SelectionExpression;
    /**
     * A CORS configuration. Supported only for HTTP APIs.
     */
    CorsConfiguration?: Cors;
    /**
     * The timestamp when the API was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The description of the API.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Avoid validating models when creating a deployment. Supported only for WebSocket APIs.
     */
    DisableSchemaValidation?: __boolean;
    /**
     * Specifies whether clients can invoke your API by using the default execute-api endpoint. By default, clients can invoke your API with the default https://{api_id}.execute-api.{region}.amazonaws.com endpoint. To require that clients use a custom domain name to invoke your API, disable the default endpoint.
     */
    DisableExecuteApiEndpoint?: __boolean;
    /**
     * The validation information during API import. This may include particular properties of your OpenAPI definition which are ignored during import. Supported only for HTTP APIs.
     */
    ImportInfo?: __listOf__string;
    /**
     * The name of the API.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * The API protocol.
     */
    ProtocolType?: ProtocolType;
    /**
     * The route selection expression for the API. For HTTP APIs, the routeSelectionExpression must be ${request.method} ${request.path}. If not provided, this will be the default for HTTP APIs. This property is required for WebSocket APIs.
     */
    RouteSelectionExpression?: SelectionExpression;
    /**
     * A collection of tags associated with the API.
     */
    Tags?: Tags;
    /**
     * A version identifier for the API.
     */
    Version?: StringWithLengthBetween1And64;
    /**
     * The warning messages reported when failonwarnings is turned on during API import.
     */
    Warnings?: __listOf__string;
  }
  export interface CreateAuthorizerRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * Specifies the required credentials as an IAM role for API Gateway to invoke the authorizer. To specify an IAM role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To use resource-based permissions on the Lambda function, don't specify this parameter. Supported only for REQUEST authorizers.
     */
    AuthorizerCredentialsArn?: Arn;
    /**
     * Specifies the format of the payload sent to an HTTP API Lambda authorizer. Required for HTTP API Lambda authorizers. Supported values are 1.0 and 2.0. To learn more, see Working with AWS Lambda authorizers for HTTP APIs.
     */
    AuthorizerPayloadFormatVersion?: StringWithLengthBetween1And64;
    /**
     * The time to live (TTL) for cached authorizer results, in seconds. If it equals 0, authorization caching is disabled. If it is greater than 0, API Gateway caches authorizer responses. The maximum value is 3600, or 1 hour. Supported only for HTTP API Lambda authorizers.
     */
    AuthorizerResultTtlInSeconds?: IntegerWithLengthBetween0And3600;
    /**
     * The authorizer type. Specify REQUEST for a Lambda function using incoming request parameters. Specify JWT to use JSON Web Tokens (supported only for HTTP APIs).
     */
    AuthorizerType: AuthorizerType;
    /**
     * The authorizer's Uniform Resource Identifier (URI). For REQUEST authorizers, this must be a well-formed Lambda function URI, for example, arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:{account_id}:function:{lambda_function_name}/invocations. In general, the URI has this form: arn:aws:apigateway:{region}:lambda:path/{service_api}
               , where {region} is the same as the region hosting the Lambda function, path indicates that the remaining substring in the URI should be treated as the path to the resource, including the initial /. For Lambda functions, this is usually of the form /2015-03-31/functions/[FunctionARN]/invocations. Supported only for REQUEST authorizers.
     */
    AuthorizerUri?: UriWithLengthBetween1And2048;
    /**
     * Specifies whether a Lambda authorizer returns a response in a simple format. By default, a Lambda authorizer must return an IAM policy. If enabled, the Lambda authorizer can return a boolean value instead of an IAM policy. Supported only for HTTP APIs. To learn more, see Working with AWS Lambda authorizers for HTTP APIs
     */
    EnableSimpleResponses?: __boolean;
    /**
     * The identity source for which authorization is requested. For a REQUEST authorizer, this is optional. The value is a set of one or more mapping expressions of the specified request parameters. The identity source can be headers, query string parameters, stage variables, and context parameters. For example, if an Auth header and a Name query string parameter are defined as identity sources, this value is route.request.header.Auth, route.request.querystring.Name for WebSocket APIs. For HTTP APIs, use selection expressions prefixed with $, for example, $request.header.Auth, $request.querystring.Name. These parameters are used to perform runtime validation for Lambda-based authorizers by verifying all of the identity-related request parameters are present in the request, not null, and non-empty. Only when this is true does the authorizer invoke the authorizer Lambda function. Otherwise, it returns a 401 Unauthorized response without calling the Lambda function. For HTTP APIs, identity sources are also used as the cache key when caching is enabled. To learn more, see Working with AWS Lambda authorizers for HTTP APIs. For JWT, a single entry that specifies where to extract the JSON Web Token (JWT) from inbound requests. Currently only header-based and query parameter-based selections are supported, for example $request.header.Authorization.
     */
    IdentitySource: IdentitySourceList;
    /**
     * This parameter is not used.
     */
    IdentityValidationExpression?: StringWithLengthBetween0And1024;
    /**
     * Represents the configuration of a JWT authorizer. Required for the JWT authorizer type. Supported only for HTTP APIs.
     */
    JwtConfiguration?: JWTConfiguration;
    /**
     * The name of the authorizer.
     */
    Name: StringWithLengthBetween1And128;
  }
  export interface CreateAuthorizerResponse {
    /**
     * Specifies the required credentials as an IAM role for API Gateway to invoke the authorizer. To specify an IAM role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To use resource-based permissions on the Lambda function, don't specify this parameter. Supported only for REQUEST authorizers.
     */
    AuthorizerCredentialsArn?: Arn;
    /**
     * The authorizer identifier.
     */
    AuthorizerId?: Id;
    /**
     * Specifies the format of the payload sent to an HTTP API Lambda authorizer. Required for HTTP API Lambda authorizers. Supported values are 1.0 and 2.0. To learn more, see Working with AWS Lambda authorizers for HTTP APIs.
     */
    AuthorizerPayloadFormatVersion?: StringWithLengthBetween1And64;
    /**
     * The time to live (TTL) for cached authorizer results, in seconds. If it equals 0, authorization caching is disabled. If it is greater than 0, API Gateway caches authorizer responses. The maximum value is 3600, or 1 hour. Supported only for HTTP API Lambda authorizers.
     */
    AuthorizerResultTtlInSeconds?: IntegerWithLengthBetween0And3600;
    /**
     * The authorizer type. Specify REQUEST for a Lambda function using incoming request parameters. Specify JWT to use JSON Web Tokens (supported only for HTTP APIs).
     */
    AuthorizerType?: AuthorizerType;
    /**
     * The authorizer's Uniform Resource Identifier (URI). For REQUEST authorizers, this must be a well-formed Lambda function URI, for example, arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:{account_id}:function:{lambda_function_name}/invocations. In general, the URI has this form: arn:aws:apigateway:{region}:lambda:path/{service_api}
               , where {region} is the same as the region hosting the Lambda function, path indicates that the remaining substring in the URI should be treated as the path to the resource, including the initial /. For Lambda functions, this is usually of the form /2015-03-31/functions/[FunctionARN]/invocations. Supported only for REQUEST authorizers.
     */
    AuthorizerUri?: UriWithLengthBetween1And2048;
    /**
     * Specifies whether a Lambda authorizer returns a response in a simple format. If enabled, the Lambda authorizer can return a boolean value instead of an IAM policy. Supported only for HTTP APIs. To learn more, see Working with AWS Lambda authorizers for HTTP APIs
     */
    EnableSimpleResponses?: __boolean;
    /**
     * The identity source for which authorization is requested. For a REQUEST authorizer, this is optional. The value is a set of one or more mapping expressions of the specified request parameters. The identity source can be headers, query string parameters, stage variables, and context parameters. For example, if an Auth header and a Name query string parameter are defined as identity sources, this value is route.request.header.Auth, route.request.querystring.Name for WebSocket APIs. For HTTP APIs, use selection expressions prefixed with $, for example, $request.header.Auth, $request.querystring.Name. These parameters are used to perform runtime validation for Lambda-based authorizers by verifying all of the identity-related request parameters are present in the request, not null, and non-empty. Only when this is true does the authorizer invoke the authorizer Lambda function. Otherwise, it returns a 401 Unauthorized response without calling the Lambda function. For HTTP APIs, identity sources are also used as the cache key when caching is enabled. To learn more, see Working with AWS Lambda authorizers for HTTP APIs. For JWT, a single entry that specifies where to extract the JSON Web Token (JWT) from inbound requests. Currently only header-based and query parameter-based selections are supported, for example $request.header.Authorization.
     */
    IdentitySource?: IdentitySourceList;
    /**
     * The validation expression does not apply to the REQUEST authorizer.
     */
    IdentityValidationExpression?: StringWithLengthBetween0And1024;
    /**
     * Represents the configuration of a JWT authorizer. Required for the JWT authorizer type. Supported only for HTTP APIs.
     */
    JwtConfiguration?: JWTConfiguration;
    /**
     * The name of the authorizer.
     */
    Name?: StringWithLengthBetween1And128;
  }
  export interface CreateDeploymentRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The description for the deployment resource.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * The name of the Stage resource for the Deployment resource to create.
     */
    StageName?: StringWithLengthBetween1And128;
  }
  export interface CreateDeploymentResponse {
    /**
     * Specifies whether a deployment was automatically released.
     */
    AutoDeployed?: __boolean;
    /**
     * The date and time when the Deployment resource was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The identifier for the deployment.
     */
    DeploymentId?: Id;
    /**
     * The status of the deployment: PENDING, FAILED, or SUCCEEDED.
     */
    DeploymentStatus?: DeploymentStatus;
    /**
     * May contain additional feedback on the status of an API deployment.
     */
    DeploymentStatusMessage?: __string;
    /**
     * The description for the deployment.
     */
    Description?: StringWithLengthBetween0And1024;
  }
  export interface CreateDomainNameRequest {
    /**
     * The domain name.
     */
    DomainName: StringWithLengthBetween1And512;
    /**
     * The domain name configurations.
     */
    DomainNameConfigurations?: DomainNameConfigurations;
    /**
     * The mutual TLS authentication configuration for a custom domain name.
     */
    MutualTlsAuthentication?: MutualTlsAuthenticationInput;
    /**
     * The collection of tags associated with a domain name.
     */
    Tags?: Tags;
  }
  export interface CreateDomainNameResponse {
    /**
     * The API mapping selection expression.
     */
    ApiMappingSelectionExpression?: SelectionExpression;
    /**
     * The name of the DomainName resource.
     */
    DomainName?: StringWithLengthBetween1And512;
    /**
     * The domain name configurations.
     */
    DomainNameConfigurations?: DomainNameConfigurations;
    /**
     * The mutual TLS authentication configuration for a custom domain name.
     */
    MutualTlsAuthentication?: MutualTlsAuthentication;
    /**
     * The collection of tags associated with a domain name.
     */
    Tags?: Tags;
  }
  export interface CreateIntegrationRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The ID of the VPC link for a private integration. Supported only for HTTP APIs.
     */
    ConnectionId?: StringWithLengthBetween1And1024;
    /**
     * The type of the network connection to the integration endpoint. Specify INTERNET for connections through the public routable internet or VPC_LINK for private connections between API Gateway and resources in a VPC. The default value is INTERNET.
     */
    ConnectionType?: ConnectionType;
    /**
     * Supported only for WebSocket APIs. Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT, with the following behaviors: CONVERT_TO_BINARY: Converts a response payload from a Base64-encoded string to the corresponding binary blob. CONVERT_TO_TEXT: Converts a response payload from a binary blob to a Base64-encoded string. If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
     */
    ContentHandlingStrategy?: ContentHandlingStrategy;
    /**
     * Specifies the credentials required for the integration, if any. For AWS integrations, three options are available. To specify an IAM Role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To require that the caller's identity be passed through from the request, specify the string arn:aws:iam::*:user/*. To use resource-based permissions on supported AWS services, specify null.
     */
    CredentialsArn?: Arn;
    /**
     * The description of the integration.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Specifies the integration's HTTP method type.
     */
    IntegrationMethod?: StringWithLengthBetween1And64;
    /**
     * Supported only for HTTP API AWS_PROXY integrations. Specifies the AWS service action to invoke. To learn more, see Integration subtype reference.
     */
    IntegrationSubtype?: StringWithLengthBetween1And128;
    /**
     * The integration type of an integration. One of the following: AWS: for integrating the route or method request with an AWS service action, including the Lambda function-invoking action. With the Lambda function-invoking action, this is referred to as the Lambda custom integration. With any other AWS service action, this is known as AWS integration. Supported only for WebSocket APIs. AWS_PROXY: for integrating the route or method request with a Lambda function or other AWS service action. This integration is also referred to as a Lambda proxy integration. HTTP: for integrating the route or method request with an HTTP endpoint. This integration is also referred to as the HTTP custom integration. Supported only for WebSocket APIs. HTTP_PROXY: for integrating the route or method request with an HTTP endpoint, with the client request passed through as-is. This is also referred to as HTTP proxy integration. For HTTP API private integrations, use an HTTP_PROXY integration. MOCK: for integrating the route or method request with API Gateway as a "loopback" endpoint without invoking any backend. Supported only for WebSocket APIs.
     */
    IntegrationType: IntegrationType;
    /**
     * For a Lambda integration, specify the URI of a Lambda function. For an HTTP integration, specify a fully-qualified URL. For an HTTP API private integration, specify the ARN of an Application Load Balancer listener, Network Load Balancer listener, or AWS Cloud Map service. If you specify the ARN of an AWS Cloud Map service, API Gateway uses DiscoverInstances to identify resources. You can use query parameters to target specific resources. To learn more, see DiscoverInstances. For private integrations, all resources must be owned by the same AWS account.
     */
    IntegrationUri?: UriWithLengthBetween1And2048;
    /**
     * Specifies the pass-through behavior for incoming requests based on the Content-Type header in the request, and the available mapping templates specified as the requestTemplates property on the Integration resource. There are three valid values: WHEN_NO_MATCH, WHEN_NO_TEMPLATES, and NEVER. Supported only for WebSocket APIs. WHEN_NO_MATCH passes the request body for unmapped content types through to the integration backend without transformation. NEVER rejects unmapped content types with an HTTP 415 Unsupported Media Type response. WHEN_NO_TEMPLATES allows pass-through when the integration has no content types mapped to templates. However, if there is at least one content type defined, unmapped content types will be rejected with the same HTTP 415 Unsupported Media Type response.
     */
    PassthroughBehavior?: PassthroughBehavior;
    /**
     * Specifies the format of the payload sent to an integration. Required for HTTP APIs.
     */
    PayloadFormatVersion?: StringWithLengthBetween1And64;
    /**
     * For WebSocket APIs, a key-value map specifying request parameters that are passed from the method request to the backend. The key is an integration request parameter name and the associated value is a method request parameter value or static value that must be enclosed within single quotes and pre-encoded as required by the backend. The method request parameter value must match the pattern of method.request.{location}.{name}
               , where 
                  {location}
                is querystring, path, or header; and 
                  {name}
                must be a valid and unique method request parameter name. For HTTP API integrations with a specified integrationSubtype, request parameters are a key-value map specifying parameters that are passed to AWS_PROXY integrations. You can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see Working with AWS service integrations for HTTP APIs. For HTTP API integrations without a specified integrationSubtype request parameters are a key-value map specifying how to transform HTTP requests before sending them to the backend. The key should follow the pattern &lt;action&gt;:&lt;header|querystring|path&gt;.&lt;location&gt; where action can be append, overwrite or remove. For values, you can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see Transforming API requests and responses.
     */
    RequestParameters?: IntegrationParameters;
    /**
     * Represents a map of Velocity templates that are applied on the request payload based on the value of the Content-Type header sent by the client. The content type value is the key in this map, and the template (as a String) is the value. Supported only for WebSocket APIs.
     */
    RequestTemplates?: TemplateMap;
    /**
     * Supported only for HTTP APIs. You use response parameters to transform the HTTP response from a backend integration before returning the response to clients. Specify a key-value map from a selection key to response parameters. The selection key must be a valid HTTP status code within the range of 200-599. Response parameters are a key-value map. The key must match pattern &lt;action&gt;:&lt;header&gt;.&lt;location&gt; or overwrite.statuscode. The action can be append, overwrite or remove. The value can be a static value, or map to response data, stage variables, or context variables that are evaluated at runtime. To learn more, see Transforming API requests and responses.
     */
    ResponseParameters?: ResponseParameters;
    /**
     * The template selection expression for the integration.
     */
    TemplateSelectionExpression?: SelectionExpression;
    /**
     * Custom timeout between 50 and 29,000 milliseconds for WebSocket APIs and between 50 and 30,000 milliseconds for HTTP APIs. The default timeout is 29 seconds for WebSocket APIs and 30 seconds for HTTP APIs.
     */
    TimeoutInMillis?: IntegerWithLengthBetween50And30000;
    /**
     * The TLS configuration for a private integration. If you specify a TLS configuration, private integration traffic uses the HTTPS protocol. Supported only for HTTP APIs.
     */
    TlsConfig?: TlsConfigInput;
  }
  export interface CreateIntegrationResult {
    /**
     * Specifies whether an integration is managed by API Gateway. If you created an API using using quick create, the resulting integration is managed by API Gateway. You can update a managed integration, but you can't delete it.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * The ID of the VPC link for a private integration. Supported only for HTTP APIs.
     */
    ConnectionId?: StringWithLengthBetween1And1024;
    /**
     * The type of the network connection to the integration endpoint. Specify INTERNET for connections through the public routable internet or VPC_LINK for private connections between API Gateway and resources in a VPC. The default value is INTERNET.
     */
    ConnectionType?: ConnectionType;
    /**
     * Supported only for WebSocket APIs. Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT, with the following behaviors: CONVERT_TO_BINARY: Converts a response payload from a Base64-encoded string to the corresponding binary blob. CONVERT_TO_TEXT: Converts a response payload from a binary blob to a Base64-encoded string. If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
     */
    ContentHandlingStrategy?: ContentHandlingStrategy;
    /**
     * Specifies the credentials required for the integration, if any. For AWS integrations, three options are available. To specify an IAM Role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To require that the caller's identity be passed through from the request, specify the string arn:aws:iam::*:user/*. To use resource-based permissions on supported AWS services, specify null.
     */
    CredentialsArn?: Arn;
    /**
     * Represents the description of an integration.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Represents the identifier of an integration.
     */
    IntegrationId?: Id;
    /**
     * Specifies the integration's HTTP method type.
     */
    IntegrationMethod?: StringWithLengthBetween1And64;
    /**
     * The integration response selection expression for the integration. Supported only for WebSocket APIs. See Integration Response Selection Expressions.
     */
    IntegrationResponseSelectionExpression?: SelectionExpression;
    /**
     * Supported only for HTTP API AWS_PROXY integrations. Specifies the AWS service action to invoke. To learn more, see Integration subtype reference.
     */
    IntegrationSubtype?: StringWithLengthBetween1And128;
    /**
     * The integration type of an integration. One of the following: AWS: for integrating the route or method request with an AWS service action, including the Lambda function-invoking action. With the Lambda function-invoking action, this is referred to as the Lambda custom integration. With any other AWS service action, this is known as AWS integration. Supported only for WebSocket APIs. AWS_PROXY: for integrating the route or method request with a Lambda function or other AWS service action. This integration is also referred to as a Lambda proxy integration. HTTP: for integrating the route or method request with an HTTP endpoint. This integration is also referred to as the HTTP custom integration. Supported only for WebSocket APIs. HTTP_PROXY: for integrating the route or method request with an HTTP endpoint, with the client request passed through as-is. This is also referred to as HTTP proxy integration. MOCK: for integrating the route or method request with API Gateway as a "loopback" endpoint without invoking any backend. Supported only for WebSocket APIs.
     */
    IntegrationType?: IntegrationType;
    /**
     * For a Lambda integration, specify the URI of a Lambda function. For an HTTP integration, specify a fully-qualified URL. For an HTTP API private integration, specify the ARN of an Application Load Balancer listener, Network Load Balancer listener, or AWS Cloud Map service. If you specify the ARN of an AWS Cloud Map service, API Gateway uses DiscoverInstances to identify resources. You can use query parameters to target specific resources. To learn more, see DiscoverInstances. For private integrations, all resources must be owned by the same AWS account.
     */
    IntegrationUri?: UriWithLengthBetween1And2048;
    /**
     * Specifies the pass-through behavior for incoming requests based on the Content-Type header in the request, and the available mapping templates specified as the requestTemplates property on the Integration resource. There are three valid values: WHEN_NO_MATCH, WHEN_NO_TEMPLATES, and NEVER. Supported only for WebSocket APIs. WHEN_NO_MATCH passes the request body for unmapped content types through to the integration backend without transformation. NEVER rejects unmapped content types with an HTTP 415 Unsupported Media Type response. WHEN_NO_TEMPLATES allows pass-through when the integration has no content types mapped to templates. However, if there is at least one content type defined, unmapped content types will be rejected with the same HTTP 415 Unsupported Media Type response.
     */
    PassthroughBehavior?: PassthroughBehavior;
    /**
     * Specifies the format of the payload sent to an integration. Required for HTTP APIs.
     */
    PayloadFormatVersion?: StringWithLengthBetween1And64;
    /**
     * For WebSocket APIs, a key-value map specifying request parameters that are passed from the method request to the backend. The key is an integration request parameter name and the associated value is a method request parameter value or static value that must be enclosed within single quotes and pre-encoded as required by the backend. The method request parameter value must match the pattern of method.request.{location}.{name}
          , where 
            {location}
           is querystring, path, or header; and 
            {name}
           must be a valid and unique method request parameter name. For HTTP API integrations with a specified integrationSubtype, request parameters are a key-value map specifying parameters that are passed to AWS_PROXY integrations. You can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see Working with AWS service integrations for HTTP APIs. For HTTP API itegrations, without a specified integrationSubtype request parameters are a key-value map specifying how to transform HTTP requests before sending them to backend integrations. The key should follow the pattern &lt;action&gt;:&lt;header|querystring|path&gt;.&lt;location&gt;. The action can be append, overwrite or remove. For values, you can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see Transforming API requests and responses.
     */
    RequestParameters?: IntegrationParameters;
    /**
     * Represents a map of Velocity templates that are applied on the request payload based on the value of the Content-Type header sent by the client. The content type value is the key in this map, and the template (as a String) is the value. Supported only for WebSocket APIs.
     */
    RequestTemplates?: TemplateMap;
    /**
     * Supported only for HTTP APIs. You use response parameters to transform the HTTP response from a backend integration before returning the response to clients. Specify a key-value map from a selection key to response parameters. The selection key must be a valid HTTP status code within the range of 200-599. Response parameters are a key-value map. The key must match pattern &lt;action&gt;:&lt;header&gt;.&lt;location&gt; or overwrite.statuscode. The action can be append, overwrite or remove. The value can be a static value, or map to response data, stage variables, or context variables that are evaluated at runtime. To learn more, see Transforming API requests and responses.
     */
    ResponseParameters?: ResponseParameters;
    /**
     * The template selection expression for the integration. Supported only for WebSocket APIs.
     */
    TemplateSelectionExpression?: SelectionExpression;
    /**
     * Custom timeout between 50 and 29,000 milliseconds for WebSocket APIs and between 50 and 30,000 milliseconds for HTTP APIs. The default timeout is 29 seconds for WebSocket APIs and 30 seconds for HTTP APIs.
     */
    TimeoutInMillis?: IntegerWithLengthBetween50And30000;
    /**
     * The TLS configuration for a private integration. If you specify a TLS configuration, private integration traffic uses the HTTPS protocol. Supported only for HTTP APIs.
     */
    TlsConfig?: TlsConfig;
  }
  export interface CreateIntegrationResponseRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT, with the following behaviors: CONVERT_TO_BINARY: Converts a response payload from a Base64-encoded string to the corresponding binary blob. CONVERT_TO_TEXT: Converts a response payload from a binary blob to a Base64-encoded string. If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
     */
    ContentHandlingStrategy?: ContentHandlingStrategy;
    /**
     * The integration ID.
     */
    IntegrationId: __string;
    /**
     * The integration response key.
     */
    IntegrationResponseKey: SelectionKey;
    /**
     * A key-value map specifying response parameters that are passed to the method response from the backend. The key is a method response header parameter name and the mapped value is an integration response header value, a static value enclosed within a pair of single quotes, or a JSON expression from the integration response body. The mapping key must match the pattern of method.response.header.{name}, where {name} is a valid and unique header name. The mapped non-static value must match the pattern of integration.response.header.{name} or integration.response.body.{JSON-expression}, where {name} is a valid and unique response header name and {JSON-expression} is a valid JSON expression without the $ prefix.
     */
    ResponseParameters?: IntegrationParameters;
    /**
     * The collection of response templates for the integration response as a string-to-string map of key-value pairs. Response templates are represented as a key/value map, with a content-type as the key and a template as the value.
     */
    ResponseTemplates?: TemplateMap;
    /**
     * The template selection expression for the integration response. Supported only for WebSocket APIs.
     */
    TemplateSelectionExpression?: SelectionExpression;
  }
  export interface CreateIntegrationResponseResponse {
    /**
     * Supported only for WebSocket APIs. Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT, with the following behaviors: CONVERT_TO_BINARY: Converts a response payload from a Base64-encoded string to the corresponding binary blob. CONVERT_TO_TEXT: Converts a response payload from a binary blob to a Base64-encoded string. If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
     */
    ContentHandlingStrategy?: ContentHandlingStrategy;
    /**
     * The integration response ID.
     */
    IntegrationResponseId?: Id;
    /**
     * The integration response key.
     */
    IntegrationResponseKey?: SelectionKey;
    /**
     * A key-value map specifying response parameters that are passed to the method response from the backend. The key is a method response header parameter name and the mapped value is an integration response header value, a static value enclosed within a pair of single quotes, or a JSON expression from the integration response body. The mapping key must match the pattern of method.response.header.{name}, where name is a valid and unique header name. The mapped non-static value must match the pattern of integration.response.header.{name} or integration.response.body.{JSON-expression}, where name is a valid and unique response header name and JSON-expression is a valid JSON expression without the $ prefix.
     */
    ResponseParameters?: IntegrationParameters;
    /**
     * The collection of response templates for the integration response as a string-to-string map of key-value pairs. Response templates are represented as a key/value map, with a content-type as the key and a template as the value.
     */
    ResponseTemplates?: TemplateMap;
    /**
     * The template selection expressions for the integration response.
     */
    TemplateSelectionExpression?: SelectionExpression;
  }
  export interface CreateModelRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The content-type for the model, for example, "application/json".
     */
    ContentType?: StringWithLengthBetween1And256;
    /**
     * The description of the model.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * The name of the model. Must be alphanumeric.
     */
    Name: StringWithLengthBetween1And128;
    /**
     * The schema for the model. For application/json models, this should be JSON schema draft 4 model.
     */
    Schema: StringWithLengthBetween0And32K;
  }
  export interface CreateModelResponse {
    /**
     * The content-type for the model, for example, "application/json".
     */
    ContentType?: StringWithLengthBetween1And256;
    /**
     * The description of the model.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * The model identifier.
     */
    ModelId?: Id;
    /**
     * The name of the model. Must be alphanumeric.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * The schema for the model. For application/json models, this should be JSON schema draft 4 model.
     */
    Schema?: StringWithLengthBetween0And32K;
  }
  export interface CreateRouteRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * Specifies whether an API key is required for the route. Supported only for WebSocket APIs.
     */
    ApiKeyRequired?: __boolean;
    /**
     * The authorization scopes supported by this route.
     */
    AuthorizationScopes?: AuthorizationScopes;
    /**
     * The authorization type for the route. For WebSocket APIs, valid values are NONE for open access, AWS_IAM for using AWS IAM permissions, and CUSTOM for using a Lambda authorizer For HTTP APIs, valid values are NONE for open access, JWT for using JSON Web Tokens, AWS_IAM for using AWS IAM permissions, and CUSTOM for using a Lambda authorizer.
     */
    AuthorizationType?: AuthorizationType;
    /**
     * The identifier of the Authorizer resource to be associated with this route. The authorizer identifier is generated by API Gateway when you created the authorizer.
     */
    AuthorizerId?: Id;
    /**
     * The model selection expression for the route. Supported only for WebSocket APIs.
     */
    ModelSelectionExpression?: SelectionExpression;
    /**
     * The operation name for the route.
     */
    OperationName?: StringWithLengthBetween1And64;
    /**
     * The request models for the route. Supported only for WebSocket APIs.
     */
    RequestModels?: RouteModels;
    /**
     * The request parameters for the route. Supported only for WebSocket APIs.
     */
    RequestParameters?: RouteParameters;
    /**
     * The route key for the route.
     */
    RouteKey: SelectionKey;
    /**
     * The route response selection expression for the route. Supported only for WebSocket APIs.
     */
    RouteResponseSelectionExpression?: SelectionExpression;
    /**
     * The target for the route.
     */
    Target?: StringWithLengthBetween1And128;
  }
  export interface CreateRouteResult {
    /**
     * Specifies whether a route is managed by API Gateway. If you created an API using quick create, the $default route is managed by API Gateway. You can't modify the $default route key.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * Specifies whether an API key is required for this route. Supported only for WebSocket APIs.
     */
    ApiKeyRequired?: __boolean;
    /**
     * A list of authorization scopes configured on a route. The scopes are used with a JWT authorizer to authorize the method invocation. The authorization works by matching the route scopes against the scopes parsed from the access token in the incoming request. The method invocation is authorized if any route scope matches a claimed scope in the access token. Otherwise, the invocation is not authorized. When the route scope is configured, the client must provide an access token instead of an identity token for authorization purposes.
     */
    AuthorizationScopes?: AuthorizationScopes;
    /**
     * The authorization type for the route. For WebSocket APIs, valid values are NONE for open access, AWS_IAM for using AWS IAM permissions, and CUSTOM for using a Lambda authorizer For HTTP APIs, valid values are NONE for open access, JWT for using JSON Web Tokens, AWS_IAM for using AWS IAM permissions, and CUSTOM for using a Lambda authorizer.
     */
    AuthorizationType?: AuthorizationType;
    /**
     * The identifier of the Authorizer resource to be associated with this route. The authorizer identifier is generated by API Gateway when you created the authorizer.
     */
    AuthorizerId?: Id;
    /**
     * The model selection expression for the route. Supported only for WebSocket APIs.
     */
    ModelSelectionExpression?: SelectionExpression;
    /**
     * The operation name for the route.
     */
    OperationName?: StringWithLengthBetween1And64;
    /**
     * The request models for the route. Supported only for WebSocket APIs.
     */
    RequestModels?: RouteModels;
    /**
     * The request parameters for the route. Supported only for WebSocket APIs.
     */
    RequestParameters?: RouteParameters;
    /**
     * The route ID.
     */
    RouteId?: Id;
    /**
     * The route key for the route.
     */
    RouteKey?: SelectionKey;
    /**
     * The route response selection expression for the route. Supported only for WebSocket APIs.
     */
    RouteResponseSelectionExpression?: SelectionExpression;
    /**
     * The target for the route.
     */
    Target?: StringWithLengthBetween1And128;
  }
  export interface CreateRouteResponseRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The model selection expression for the route response. Supported only for WebSocket APIs.
     */
    ModelSelectionExpression?: SelectionExpression;
    /**
     * The response models for the route response.
     */
    ResponseModels?: RouteModels;
    /**
     * The route response parameters.
     */
    ResponseParameters?: RouteParameters;
    /**
     * The route ID.
     */
    RouteId: __string;
    /**
     * The route response key.
     */
    RouteResponseKey: SelectionKey;
  }
  export interface CreateRouteResponseResponse {
    /**
     * Represents the model selection expression of a route response. Supported only for WebSocket APIs.
     */
    ModelSelectionExpression?: SelectionExpression;
    /**
     * Represents the response models of a route response.
     */
    ResponseModels?: RouteModels;
    /**
     * Represents the response parameters of a route response.
     */
    ResponseParameters?: RouteParameters;
    /**
     * Represents the identifier of a route response.
     */
    RouteResponseId?: Id;
    /**
     * Represents the route response key of a route response.
     */
    RouteResponseKey?: SelectionKey;
  }
  export interface CreateStageRequest {
    /**
     * Settings for logging access in this stage.
     */
    AccessLogSettings?: AccessLogSettings;
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * Specifies whether updates to an API automatically trigger a new deployment. The default value is false.
     */
    AutoDeploy?: __boolean;
    /**
     * The identifier of a client certificate for a Stage. Supported only for WebSocket APIs.
     */
    ClientCertificateId?: Id;
    /**
     * The default route settings for the stage.
     */
    DefaultRouteSettings?: RouteSettings;
    /**
     * The deployment identifier of the API stage.
     */
    DeploymentId?: Id;
    /**
     * The description for the API stage.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Route settings for the stage, by routeKey.
     */
    RouteSettings?: RouteSettingsMap;
    /**
     * The name of the stage.
     */
    StageName: StringWithLengthBetween1And128;
    /**
     * A map that defines the stage variables for a Stage. Variable names can have alphanumeric and underscore characters, and the values must match [A-Za-z0-9-._~:/?#&amp;=,]+.
     */
    StageVariables?: StageVariablesMap;
    /**
     * The collection of tags. Each tag element is associated with a given resource.
     */
    Tags?: Tags;
  }
  export interface CreateStageResponse {
    /**
     * Settings for logging access in this stage.
     */
    AccessLogSettings?: AccessLogSettings;
    /**
     * Specifies whether a stage is managed by API Gateway. If you created an API using quick create, the $default stage is managed by API Gateway. You can't modify the $default stage.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * Specifies whether updates to an API automatically trigger a new deployment. The default value is false.
     */
    AutoDeploy?: __boolean;
    /**
     * The identifier of a client certificate for a Stage. Supported only for WebSocket APIs.
     */
    ClientCertificateId?: Id;
    /**
     * The timestamp when the stage was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * Default route settings for the stage.
     */
    DefaultRouteSettings?: RouteSettings;
    /**
     * The identifier of the Deployment that the Stage is associated with. Can't be updated if autoDeploy is enabled.
     */
    DeploymentId?: Id;
    /**
     * The description of the stage.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Describes the status of the last deployment of a stage. Supported only for stages with autoDeploy enabled.
     */
    LastDeploymentStatusMessage?: __string;
    /**
     * The timestamp when the stage was last updated.
     */
    LastUpdatedDate?: __timestampIso8601;
    /**
     * Route settings for the stage, by routeKey.
     */
    RouteSettings?: RouteSettingsMap;
    /**
     * The name of the stage.
     */
    StageName?: StringWithLengthBetween1And128;
    /**
     * A map that defines the stage variables for a stage resource. Variable names can have alphanumeric and underscore characters, and the values must match [A-Za-z0-9-._~:/?#&amp;=,]+.
     */
    StageVariables?: StageVariablesMap;
    /**
     * The collection of tags. Each tag element is associated with a given resource.
     */
    Tags?: Tags;
  }
  export interface CreateVpcLinkRequest {
    /**
     * The name of the VPC link.
     */
    Name: StringWithLengthBetween1And128;
    /**
     * A list of security group IDs for the VPC link.
     */
    SecurityGroupIds?: SecurityGroupIdList;
    /**
     * A list of subnet IDs to include in the VPC link.
     */
    SubnetIds: SubnetIdList;
    /**
     * A list of tags.
     */
    Tags?: Tags;
  }
  export interface CreateVpcLinkResponse {
    /**
     * The timestamp when the VPC link was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The name of the VPC link.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * A list of security group IDs for the VPC link.
     */
    SecurityGroupIds?: SecurityGroupIdList;
    /**
     * A list of subnet IDs to include in the VPC link.
     */
    SubnetIds?: SubnetIdList;
    /**
     * Tags for the VPC link.
     */
    Tags?: Tags;
    /**
     * The ID of the VPC link.
     */
    VpcLinkId?: Id;
    /**
     * The status of the VPC link.
     */
    VpcLinkStatus?: VpcLinkStatus;
    /**
     * A message summarizing the cause of the status of the VPC link.
     */
    VpcLinkStatusMessage?: StringWithLengthBetween0And1024;
    /**
     * The version of the VPC link.
     */
    VpcLinkVersion?: VpcLinkVersion;
  }
  export interface DeleteAccessLogSettingsRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The stage name. Stage names can only contain alphanumeric characters, hyphens, and underscores. Maximum length is 128 characters.
     */
    StageName: __string;
  }
  export interface DeleteApiMappingRequest {
    /**
     * The API mapping identifier.
     */
    ApiMappingId: __string;
    /**
     * The domain name.
     */
    DomainName: __string;
  }
  export interface DeleteApiRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
  }
  export interface DeleteAuthorizerRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The authorizer identifier.
     */
    AuthorizerId: __string;
  }
  export interface DeleteCorsConfigurationRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
  }
  export interface DeleteDeploymentRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The deployment ID.
     */
    DeploymentId: __string;
  }
  export interface DeleteDomainNameRequest {
    /**
     * The domain name.
     */
    DomainName: __string;
  }
  export interface DeleteIntegrationRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The integration ID.
     */
    IntegrationId: __string;
  }
  export interface DeleteIntegrationResponseRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The integration ID.
     */
    IntegrationId: __string;
    /**
     * The integration response ID.
     */
    IntegrationResponseId: __string;
  }
  export interface DeleteModelRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The model ID.
     */
    ModelId: __string;
  }
  export interface DeleteRouteRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The route ID.
     */
    RouteId: __string;
  }
  export interface DeleteRouteRequestParameterRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The route request parameter key.
     */
    RequestParameterKey: __string;
    /**
     * The route ID.
     */
    RouteId: __string;
  }
  export interface DeleteRouteResponseRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The route ID.
     */
    RouteId: __string;
    /**
     * The route response ID.
     */
    RouteResponseId: __string;
  }
  export interface DeleteRouteSettingsRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The route key.
     */
    RouteKey: __string;
    /**
     * The stage name. Stage names can only contain alphanumeric characters, hyphens, and underscores. Maximum length is 128 characters.
     */
    StageName: __string;
  }
  export interface DeleteStageRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The stage name. Stage names can only contain alphanumeric characters, hyphens, and underscores. Maximum length is 128 characters.
     */
    StageName: __string;
  }
  export interface DeleteVpcLinkRequest {
    /**
     * The ID of the VPC link.
     */
    VpcLinkId: __string;
  }
  export interface DeleteVpcLinkResponse {
  }
  export interface Deployment {
    /**
     * Specifies whether a deployment was automatically released.
     */
    AutoDeployed?: __boolean;
    /**
     * The date and time when the Deployment resource was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The identifier for the deployment.
     */
    DeploymentId?: Id;
    /**
     * The status of the deployment: PENDING, FAILED, or SUCCEEDED.
     */
    DeploymentStatus?: DeploymentStatus;
    /**
     * May contain additional feedback on the status of an API deployment.
     */
    DeploymentStatusMessage?: __string;
    /**
     * The description for the deployment.
     */
    Description?: StringWithLengthBetween0And1024;
  }
  export type DeploymentStatus = "PENDING"|"FAILED"|"DEPLOYED"|string;
  export interface DomainName {
    /**
     * The API mapping selection expression.
     */
    ApiMappingSelectionExpression?: SelectionExpression;
    /**
     * The name of the DomainName resource.
     */
    DomainName: StringWithLengthBetween1And512;
    /**
     * The domain name configurations.
     */
    DomainNameConfigurations?: DomainNameConfigurations;
    /**
     * The mutual TLS authentication configuration for a custom domain name.
     */
    MutualTlsAuthentication?: MutualTlsAuthentication;
    /**
     * The collection of tags associated with a domain name.
     */
    Tags?: Tags;
  }
  export interface DomainNameConfiguration {
    /**
     * A domain name for the API.
     */
    ApiGatewayDomainName?: __string;
    /**
     * An AWS-managed certificate that will be used by the edge-optimized endpoint for this domain name. AWS Certificate Manager is the only supported source.
     */
    CertificateArn?: Arn;
    /**
     * The user-friendly name of the certificate that will be used by the edge-optimized endpoint for this domain name.
     */
    CertificateName?: StringWithLengthBetween1And128;
    /**
     * The timestamp when the certificate that was used by edge-optimized endpoint for this domain name was uploaded.
     */
    CertificateUploadDate?: __timestampIso8601;
    /**
     * The status of the domain name migration. The valid values are AVAILABLE, UPDATING, PENDING_CERTIFICATE_REIMPORT, and PENDING_OWNERSHIP_VERIFICATION. If the status is UPDATING, the domain cannot be modified further until the existing operation is complete. If it is AVAILABLE, the domain can be updated.
     */
    DomainNameStatus?: DomainNameStatus;
    /**
     * An optional text message containing detailed information about status of the domain name migration.
     */
    DomainNameStatusMessage?: __string;
    /**
     * The endpoint type.
     */
    EndpointType?: EndpointType;
    /**
     * The Amazon Route 53 Hosted Zone ID of the endpoint.
     */
    HostedZoneId?: __string;
    /**
     * The Transport Layer Security (TLS) version of the security policy for this domain name. The valid values are TLS_1_0 and TLS_1_2.
     */
    SecurityPolicy?: SecurityPolicy;
    /**
     * The ARN of the public certificate issued by ACM to validate ownership of your custom domain. Only required when configuring mutual TLS and using an ACM imported or private CA certificate ARN as the regionalCertificateArn
     */
    OwnershipVerificationCertificateArn?: Arn;
  }
  export type DomainNameConfigurations = DomainNameConfiguration[];
  export type DomainNameStatus = "AVAILABLE"|"UPDATING"|"PENDING_CERTIFICATE_REIMPORT"|"PENDING_OWNERSHIP_VERIFICATION"|string;
  export type EndpointType = "REGIONAL"|"EDGE"|string;
  export interface ExportApiRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The version of the API Gateway export algorithm. API Gateway uses the latest version by default. Currently, the only supported version is 1.0.
     */
    ExportVersion?: __string;
    /**
     * Specifies whether to include API Gateway extensions in the exported API definition. API Gateway extensions are included by default.
     */
    IncludeExtensions?: __boolean;
    /**
     * The output type of the exported definition file. Valid values are JSON and YAML.
     */
    OutputType: __string;
    /**
     * The version of the API specification to use. OAS30, for OpenAPI 3.0, is the only supported value.
     */
    Specification: __string;
    /**
     * The name of the API stage to export. If you don't specify this property, a representation of the latest API configuration is exported.
     */
    StageName?: __string;
  }
  export interface ExportApiResponse {
    body?: ExportedApi;
  }
  export type ExportedApi = Buffer|Uint8Array|Blob|string;
  export interface ResetAuthorizersCacheRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The stage name. Stage names can contain only alphanumeric characters, hyphens, and underscores, or be $default. Maximum length is 128 characters.
     */
    StageName: __string;
  }
  export interface GetApiMappingRequest {
    /**
     * The API mapping identifier.
     */
    ApiMappingId: __string;
    /**
     * The domain name.
     */
    DomainName: __string;
  }
  export interface GetApiMappingResponse {
    /**
     * The API identifier.
     */
    ApiId?: Id;
    /**
     * The API mapping identifier.
     */
    ApiMappingId?: Id;
    /**
     * The API mapping key.
     */
    ApiMappingKey?: SelectionKey;
    /**
     * The API stage.
     */
    Stage?: StringWithLengthBetween1And128;
  }
  export interface GetApiMappingsRequest {
    /**
     * The domain name.
     */
    DomainName: __string;
    /**
     * The maximum number of elements to be returned for this resource.
     */
    MaxResults?: __string;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: __string;
  }
  export interface GetApiMappingsResponse {
    /**
     * The elements from this collection.
     */
    Items?: __listOfApiMapping;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: NextToken;
  }
  export interface GetApiRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
  }
  export interface GetApiResponse {
    /**
     * The URI of the API, of the form {api-id}.execute-api.{region}.amazonaws.com. The stage name is typically appended to this URI to form a complete path to a deployed API stage.
     */
    ApiEndpoint?: __string;
    /**
     * Specifies whether an API is managed by API Gateway. You can't update or delete a managed API by using API Gateway. A managed API can be deleted only through the tooling or service that created it.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * The API ID.
     */
    ApiId?: Id;
    /**
     * An API key selection expression. Supported only for WebSocket APIs. See API Key Selection Expressions.
     */
    ApiKeySelectionExpression?: SelectionExpression;
    /**
     * A CORS configuration. Supported only for HTTP APIs.
     */
    CorsConfiguration?: Cors;
    /**
     * The timestamp when the API was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The description of the API.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Avoid validating models when creating a deployment. Supported only for WebSocket APIs.
     */
    DisableSchemaValidation?: __boolean;
    /**
     * Specifies whether clients can invoke your API by using the default execute-api endpoint. By default, clients can invoke your API with the default https://{api_id}.execute-api.{region}.amazonaws.com endpoint. To require that clients use a custom domain name to invoke your API, disable the default endpoint.
     */
    DisableExecuteApiEndpoint?: __boolean;
    /**
     * The validation information during API import. This may include particular properties of your OpenAPI definition which are ignored during import. Supported only for HTTP APIs.
     */
    ImportInfo?: __listOf__string;
    /**
     * The name of the API.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * The API protocol.
     */
    ProtocolType?: ProtocolType;
    /**
     * The route selection expression for the API. For HTTP APIs, the routeSelectionExpression must be ${request.method} ${request.path}. If not provided, this will be the default for HTTP APIs. This property is required for WebSocket APIs.
     */
    RouteSelectionExpression?: SelectionExpression;
    /**
     * A collection of tags associated with the API.
     */
    Tags?: Tags;
    /**
     * A version identifier for the API.
     */
    Version?: StringWithLengthBetween1And64;
    /**
     * The warning messages reported when failonwarnings is turned on during API import.
     */
    Warnings?: __listOf__string;
  }
  export interface GetApisRequest {
    /**
     * The maximum number of elements to be returned for this resource.
     */
    MaxResults?: __string;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: __string;
  }
  export interface GetApisResponse {
    /**
     * The elements from this collection.
     */
    Items?: __listOfApi;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: NextToken;
  }
  export interface GetAuthorizerRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The authorizer identifier.
     */
    AuthorizerId: __string;
  }
  export interface GetAuthorizerResponse {
    /**
     * Specifies the required credentials as an IAM role for API Gateway to invoke the authorizer. To specify an IAM role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To use resource-based permissions on the Lambda function, don't specify this parameter. Supported only for REQUEST authorizers.
     */
    AuthorizerCredentialsArn?: Arn;
    /**
     * The authorizer identifier.
     */
    AuthorizerId?: Id;
    /**
     * Specifies the format of the payload sent to an HTTP API Lambda authorizer. Required for HTTP API Lambda authorizers. Supported values are 1.0 and 2.0. To learn more, see Working with AWS Lambda authorizers for HTTP APIs.
     */
    AuthorizerPayloadFormatVersion?: StringWithLengthBetween1And64;
    /**
     * The time to live (TTL) for cached authorizer results, in seconds. If it equals 0, authorization caching is disabled. If it is greater than 0, API Gateway caches authorizer responses. The maximum value is 3600, or 1 hour. Supported only for HTTP API Lambda authorizers.
     */
    AuthorizerResultTtlInSeconds?: IntegerWithLengthBetween0And3600;
    /**
     * The authorizer type. Specify REQUEST for a Lambda function using incoming request parameters. Specify JWT to use JSON Web Tokens (supported only for HTTP APIs).
     */
    AuthorizerType?: AuthorizerType;
    /**
     * The authorizer's Uniform Resource Identifier (URI). For REQUEST authorizers, this must be a well-formed Lambda function URI, for example, arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:{account_id}:function:{lambda_function_name}/invocations. In general, the URI has this form: arn:aws:apigateway:{region}:lambda:path/{service_api}
               , where {region} is the same as the region hosting the Lambda function, path indicates that the remaining substring in the URI should be treated as the path to the resource, including the initial /. For Lambda functions, this is usually of the form /2015-03-31/functions/[FunctionARN]/invocations. Supported only for REQUEST authorizers.
     */
    AuthorizerUri?: UriWithLengthBetween1And2048;
    /**
     * Specifies whether a Lambda authorizer returns a response in a simple format. If enabled, the Lambda authorizer can return a boolean value instead of an IAM policy. Supported only for HTTP APIs. To learn more, see Working with AWS Lambda authorizers for HTTP APIs
     */
    EnableSimpleResponses?: __boolean;
    /**
     * The identity source for which authorization is requested. For a REQUEST authorizer, this is optional. The value is a set of one or more mapping expressions of the specified request parameters. The identity source can be headers, query string parameters, stage variables, and context parameters. For example, if an Auth header and a Name query string parameter are defined as identity sources, this value is route.request.header.Auth, route.request.querystring.Name for WebSocket APIs. For HTTP APIs, use selection expressions prefixed with $, for example, $request.header.Auth, $request.querystring.Name. These parameters are used to perform runtime validation for Lambda-based authorizers by verifying all of the identity-related request parameters are present in the request, not null, and non-empty. Only when this is true does the authorizer invoke the authorizer Lambda function. Otherwise, it returns a 401 Unauthorized response without calling the Lambda function. For HTTP APIs, identity sources are also used as the cache key when caching is enabled. To learn more, see Working with AWS Lambda authorizers for HTTP APIs. For JWT, a single entry that specifies where to extract the JSON Web Token (JWT) from inbound requests. Currently only header-based and query parameter-based selections are supported, for example $request.header.Authorization.
     */
    IdentitySource?: IdentitySourceList;
    /**
     * The validation expression does not apply to the REQUEST authorizer.
     */
    IdentityValidationExpression?: StringWithLengthBetween0And1024;
    /**
     * Represents the configuration of a JWT authorizer. Required for the JWT authorizer type. Supported only for HTTP APIs.
     */
    JwtConfiguration?: JWTConfiguration;
    /**
     * The name of the authorizer.
     */
    Name?: StringWithLengthBetween1And128;
  }
  export interface GetAuthorizersRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The maximum number of elements to be returned for this resource.
     */
    MaxResults?: __string;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: __string;
  }
  export interface GetAuthorizersResponse {
    /**
     * The elements from this collection.
     */
    Items?: __listOfAuthorizer;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: NextToken;
  }
  export interface GetDeploymentRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The deployment ID.
     */
    DeploymentId: __string;
  }
  export interface GetDeploymentResponse {
    /**
     * Specifies whether a deployment was automatically released.
     */
    AutoDeployed?: __boolean;
    /**
     * The date and time when the Deployment resource was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The identifier for the deployment.
     */
    DeploymentId?: Id;
    /**
     * The status of the deployment: PENDING, FAILED, or SUCCEEDED.
     */
    DeploymentStatus?: DeploymentStatus;
    /**
     * May contain additional feedback on the status of an API deployment.
     */
    DeploymentStatusMessage?: __string;
    /**
     * The description for the deployment.
     */
    Description?: StringWithLengthBetween0And1024;
  }
  export interface GetDeploymentsRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The maximum number of elements to be returned for this resource.
     */
    MaxResults?: __string;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: __string;
  }
  export interface GetDeploymentsResponse {
    /**
     * The elements from this collection.
     */
    Items?: __listOfDeployment;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: NextToken;
  }
  export interface GetDomainNameRequest {
    /**
     * The domain name.
     */
    DomainName: __string;
  }
  export interface GetDomainNameResponse {
    /**
     * The API mapping selection expression.
     */
    ApiMappingSelectionExpression?: SelectionExpression;
    /**
     * The name of the DomainName resource.
     */
    DomainName?: StringWithLengthBetween1And512;
    /**
     * The domain name configurations.
     */
    DomainNameConfigurations?: DomainNameConfigurations;
    /**
     * The mutual TLS authentication configuration for a custom domain name.
     */
    MutualTlsAuthentication?: MutualTlsAuthentication;
    /**
     * The collection of tags associated with a domain name.
     */
    Tags?: Tags;
  }
  export interface GetDomainNamesRequest {
    /**
     * The maximum number of elements to be returned for this resource.
     */
    MaxResults?: __string;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: __string;
  }
  export interface GetDomainNamesResponse {
    /**
     * The elements from this collection.
     */
    Items?: __listOfDomainName;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: NextToken;
  }
  export interface GetIntegrationRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The integration ID.
     */
    IntegrationId: __string;
  }
  export interface GetIntegrationResult {
    /**
     * Specifies whether an integration is managed by API Gateway. If you created an API using using quick create, the resulting integration is managed by API Gateway. You can update a managed integration, but you can't delete it.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * The ID of the VPC link for a private integration. Supported only for HTTP APIs.
     */
    ConnectionId?: StringWithLengthBetween1And1024;
    /**
     * The type of the network connection to the integration endpoint. Specify INTERNET for connections through the public routable internet or VPC_LINK for private connections between API Gateway and resources in a VPC. The default value is INTERNET.
     */
    ConnectionType?: ConnectionType;
    /**
     * Supported only for WebSocket APIs. Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT, with the following behaviors: CONVERT_TO_BINARY: Converts a response payload from a Base64-encoded string to the corresponding binary blob. CONVERT_TO_TEXT: Converts a response payload from a binary blob to a Base64-encoded string. If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
     */
    ContentHandlingStrategy?: ContentHandlingStrategy;
    /**
     * Specifies the credentials required for the integration, if any. For AWS integrations, three options are available. To specify an IAM Role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To require that the caller's identity be passed through from the request, specify the string arn:aws:iam::*:user/*. To use resource-based permissions on supported AWS services, specify null.
     */
    CredentialsArn?: Arn;
    /**
     * Represents the description of an integration.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Represents the identifier of an integration.
     */
    IntegrationId?: Id;
    /**
     * Specifies the integration's HTTP method type.
     */
    IntegrationMethod?: StringWithLengthBetween1And64;
    /**
     * The integration response selection expression for the integration. Supported only for WebSocket APIs. See Integration Response Selection Expressions.
     */
    IntegrationResponseSelectionExpression?: SelectionExpression;
    /**
     * Supported only for HTTP API AWS_PROXY integrations. Specifies the AWS service action to invoke. To learn more, see Integration subtype reference.
     */
    IntegrationSubtype?: StringWithLengthBetween1And128;
    /**
     * The integration type of an integration. One of the following: AWS: for integrating the route or method request with an AWS service action, including the Lambda function-invoking action. With the Lambda function-invoking action, this is referred to as the Lambda custom integration. With any other AWS service action, this is known as AWS integration. Supported only for WebSocket APIs. AWS_PROXY: for integrating the route or method request with a Lambda function or other AWS service action. This integration is also referred to as a Lambda proxy integration. HTTP: for integrating the route or method request with an HTTP endpoint. This integration is also referred to as the HTTP custom integration. Supported only for WebSocket APIs. HTTP_PROXY: for integrating the route or method request with an HTTP endpoint, with the client request passed through as-is. This is also referred to as HTTP proxy integration. MOCK: for integrating the route or method request with API Gateway as a "loopback" endpoint without invoking any backend. Supported only for WebSocket APIs.
     */
    IntegrationType?: IntegrationType;
    /**
     * For a Lambda integration, specify the URI of a Lambda function. For an HTTP integration, specify a fully-qualified URL. For an HTTP API private integration, specify the ARN of an Application Load Balancer listener, Network Load Balancer listener, or AWS Cloud Map service. If you specify the ARN of an AWS Cloud Map service, API Gateway uses DiscoverInstances to identify resources. You can use query parameters to target specific resources. To learn more, see DiscoverInstances. For private integrations, all resources must be owned by the same AWS account.
     */
    IntegrationUri?: UriWithLengthBetween1And2048;
    /**
     * Specifies the pass-through behavior for incoming requests based on the Content-Type header in the request, and the available mapping templates specified as the requestTemplates property on the Integration resource. There are three valid values: WHEN_NO_MATCH, WHEN_NO_TEMPLATES, and NEVER. Supported only for WebSocket APIs. WHEN_NO_MATCH passes the request body for unmapped content types through to the integration backend without transformation. NEVER rejects unmapped content types with an HTTP 415 Unsupported Media Type response. WHEN_NO_TEMPLATES allows pass-through when the integration has no content types mapped to templates. However, if there is at least one content type defined, unmapped content types will be rejected with the same HTTP 415 Unsupported Media Type response.
     */
    PassthroughBehavior?: PassthroughBehavior;
    /**
     * Specifies the format of the payload sent to an integration. Required for HTTP APIs.
     */
    PayloadFormatVersion?: StringWithLengthBetween1And64;
    /**
     * For WebSocket APIs, a key-value map specifying request parameters that are passed from the method request to the backend. The key is an integration request parameter name and the associated value is a method request parameter value or static value that must be enclosed within single quotes and pre-encoded as required by the backend. The method request parameter value must match the pattern of method.request.{location}.{name}
          , where 
            {location}
           is querystring, path, or header; and 
            {name}
           must be a valid and unique method request parameter name. For HTTP API integrations with a specified integrationSubtype, request parameters are a key-value map specifying parameters that are passed to AWS_PROXY integrations. You can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see Working with AWS service integrations for HTTP APIs. For HTTP API itegrations, without a specified integrationSubtype request parameters are a key-value map specifying how to transform HTTP requests before sending them to backend integrations. The key should follow the pattern &lt;action&gt;:&lt;header|querystring|path&gt;.&lt;location&gt;. The action can be append, overwrite or remove. For values, you can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see Transforming API requests and responses.
     */
    RequestParameters?: IntegrationParameters;
    /**
     * Represents a map of Velocity templates that are applied on the request payload based on the value of the Content-Type header sent by the client. The content type value is the key in this map, and the template (as a String) is the value. Supported only for WebSocket APIs.
     */
    RequestTemplates?: TemplateMap;
    /**
     * Supported only for HTTP APIs. You use response parameters to transform the HTTP response from a backend integration before returning the response to clients. Specify a key-value map from a selection key to response parameters. The selection key must be a valid HTTP status code within the range of 200-599. Response parameters are a key-value map. The key must match pattern &lt;action&gt;:&lt;header&gt;.&lt;location&gt; or overwrite.statuscode. The action can be append, overwrite or remove. The value can be a static value, or map to response data, stage variables, or context variables that are evaluated at runtime. To learn more, see Transforming API requests and responses.
     */
    ResponseParameters?: ResponseParameters;
    /**
     * The template selection expression for the integration. Supported only for WebSocket APIs.
     */
    TemplateSelectionExpression?: SelectionExpression;
    /**
     * Custom timeout between 50 and 29,000 milliseconds for WebSocket APIs and between 50 and 30,000 milliseconds for HTTP APIs. The default timeout is 29 seconds for WebSocket APIs and 30 seconds for HTTP APIs.
     */
    TimeoutInMillis?: IntegerWithLengthBetween50And30000;
    /**
     * The TLS configuration for a private integration. If you specify a TLS configuration, private integration traffic uses the HTTPS protocol. Supported only for HTTP APIs.
     */
    TlsConfig?: TlsConfig;
  }
  export interface GetIntegrationResponseRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The integration ID.
     */
    IntegrationId: __string;
    /**
     * The integration response ID.
     */
    IntegrationResponseId: __string;
  }
  export interface GetIntegrationResponseResponse {
    /**
     * Supported only for WebSocket APIs. Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT, with the following behaviors: CONVERT_TO_BINARY: Converts a response payload from a Base64-encoded string to the corresponding binary blob. CONVERT_TO_TEXT: Converts a response payload from a binary blob to a Base64-encoded string. If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
     */
    ContentHandlingStrategy?: ContentHandlingStrategy;
    /**
     * The integration response ID.
     */
    IntegrationResponseId?: Id;
    /**
     * The integration response key.
     */
    IntegrationResponseKey?: SelectionKey;
    /**
     * A key-value map specifying response parameters that are passed to the method response from the backend. The key is a method response header parameter name and the mapped value is an integration response header value, a static value enclosed within a pair of single quotes, or a JSON expression from the integration response body. The mapping key must match the pattern of method.response.header.{name}, where name is a valid and unique header name. The mapped non-static value must match the pattern of integration.response.header.{name} or integration.response.body.{JSON-expression}, where name is a valid and unique response header name and JSON-expression is a valid JSON expression without the $ prefix.
     */
    ResponseParameters?: IntegrationParameters;
    /**
     * The collection of response templates for the integration response as a string-to-string map of key-value pairs. Response templates are represented as a key/value map, with a content-type as the key and a template as the value.
     */
    ResponseTemplates?: TemplateMap;
    /**
     * The template selection expressions for the integration response.
     */
    TemplateSelectionExpression?: SelectionExpression;
  }
  export interface GetIntegrationResponsesRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The integration ID.
     */
    IntegrationId: __string;
    /**
     * The maximum number of elements to be returned for this resource.
     */
    MaxResults?: __string;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: __string;
  }
  export interface GetIntegrationResponsesResponse {
    /**
     * The elements from this collection.
     */
    Items?: __listOfIntegrationResponse;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: NextToken;
  }
  export interface GetIntegrationsRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The maximum number of elements to be returned for this resource.
     */
    MaxResults?: __string;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: __string;
  }
  export interface GetIntegrationsResponse {
    /**
     * The elements from this collection.
     */
    Items?: __listOfIntegration;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: NextToken;
  }
  export interface GetModelRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The model ID.
     */
    ModelId: __string;
  }
  export interface GetModelResponse {
    /**
     * The content-type for the model, for example, "application/json".
     */
    ContentType?: StringWithLengthBetween1And256;
    /**
     * The description of the model.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * The model identifier.
     */
    ModelId?: Id;
    /**
     * The name of the model. Must be alphanumeric.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * The schema for the model. For application/json models, this should be JSON schema draft 4 model.
     */
    Schema?: StringWithLengthBetween0And32K;
  }
  export interface GetModelTemplateRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The model ID.
     */
    ModelId: __string;
  }
  export interface GetModelTemplateResponse {
    /**
     * The template value.
     */
    Value?: __string;
  }
  export interface GetModelsRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The maximum number of elements to be returned for this resource.
     */
    MaxResults?: __string;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: __string;
  }
  export interface GetModelsResponse {
    /**
     * The elements from this collection.
     */
    Items?: __listOfModel;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: NextToken;
  }
  export interface GetRouteRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The route ID.
     */
    RouteId: __string;
  }
  export interface GetRouteResult {
    /**
     * Specifies whether a route is managed by API Gateway. If you created an API using quick create, the $default route is managed by API Gateway. You can't modify the $default route key.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * Specifies whether an API key is required for this route. Supported only for WebSocket APIs.
     */
    ApiKeyRequired?: __boolean;
    /**
     * A list of authorization scopes configured on a route. The scopes are used with a JWT authorizer to authorize the method invocation. The authorization works by matching the route scopes against the scopes parsed from the access token in the incoming request. The method invocation is authorized if any route scope matches a claimed scope in the access token. Otherwise, the invocation is not authorized. When the route scope is configured, the client must provide an access token instead of an identity token for authorization purposes.
     */
    AuthorizationScopes?: AuthorizationScopes;
    /**
     * The authorization type for the route. For WebSocket APIs, valid values are NONE for open access, AWS_IAM for using AWS IAM permissions, and CUSTOM for using a Lambda authorizer For HTTP APIs, valid values are NONE for open access, JWT for using JSON Web Tokens, AWS_IAM for using AWS IAM permissions, and CUSTOM for using a Lambda authorizer.
     */
    AuthorizationType?: AuthorizationType;
    /**
     * The identifier of the Authorizer resource to be associated with this route. The authorizer identifier is generated by API Gateway when you created the authorizer.
     */
    AuthorizerId?: Id;
    /**
     * The model selection expression for the route. Supported only for WebSocket APIs.
     */
    ModelSelectionExpression?: SelectionExpression;
    /**
     * The operation name for the route.
     */
    OperationName?: StringWithLengthBetween1And64;
    /**
     * The request models for the route. Supported only for WebSocket APIs.
     */
    RequestModels?: RouteModels;
    /**
     * The request parameters for the route. Supported only for WebSocket APIs.
     */
    RequestParameters?: RouteParameters;
    /**
     * The route ID.
     */
    RouteId?: Id;
    /**
     * The route key for the route.
     */
    RouteKey?: SelectionKey;
    /**
     * The route response selection expression for the route. Supported only for WebSocket APIs.
     */
    RouteResponseSelectionExpression?: SelectionExpression;
    /**
     * The target for the route.
     */
    Target?: StringWithLengthBetween1And128;
  }
  export interface GetRouteResponseRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The route ID.
     */
    RouteId: __string;
    /**
     * The route response ID.
     */
    RouteResponseId: __string;
  }
  export interface GetRouteResponseResponse {
    /**
     * Represents the model selection expression of a route response. Supported only for WebSocket APIs.
     */
    ModelSelectionExpression?: SelectionExpression;
    /**
     * Represents the response models of a route response.
     */
    ResponseModels?: RouteModels;
    /**
     * Represents the response parameters of a route response.
     */
    ResponseParameters?: RouteParameters;
    /**
     * Represents the identifier of a route response.
     */
    RouteResponseId?: Id;
    /**
     * Represents the route response key of a route response.
     */
    RouteResponseKey?: SelectionKey;
  }
  export interface GetRouteResponsesRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The maximum number of elements to be returned for this resource.
     */
    MaxResults?: __string;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: __string;
    /**
     * The route ID.
     */
    RouteId: __string;
  }
  export interface GetRouteResponsesResponse {
    /**
     * The elements from this collection.
     */
    Items?: __listOfRouteResponse;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: NextToken;
  }
  export interface GetRoutesRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The maximum number of elements to be returned for this resource.
     */
    MaxResults?: __string;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: __string;
  }
  export interface GetRoutesResponse {
    /**
     * The elements from this collection.
     */
    Items?: __listOfRoute;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: NextToken;
  }
  export interface GetStageRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The stage name. Stage names can only contain alphanumeric characters, hyphens, and underscores. Maximum length is 128 characters.
     */
    StageName: __string;
  }
  export interface GetStageResponse {
    /**
     * Settings for logging access in this stage.
     */
    AccessLogSettings?: AccessLogSettings;
    /**
     * Specifies whether a stage is managed by API Gateway. If you created an API using quick create, the $default stage is managed by API Gateway. You can't modify the $default stage.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * Specifies whether updates to an API automatically trigger a new deployment. The default value is false.
     */
    AutoDeploy?: __boolean;
    /**
     * The identifier of a client certificate for a Stage. Supported only for WebSocket APIs.
     */
    ClientCertificateId?: Id;
    /**
     * The timestamp when the stage was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * Default route settings for the stage.
     */
    DefaultRouteSettings?: RouteSettings;
    /**
     * The identifier of the Deployment that the Stage is associated with. Can't be updated if autoDeploy is enabled.
     */
    DeploymentId?: Id;
    /**
     * The description of the stage.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Describes the status of the last deployment of a stage. Supported only for stages with autoDeploy enabled.
     */
    LastDeploymentStatusMessage?: __string;
    /**
     * The timestamp when the stage was last updated.
     */
    LastUpdatedDate?: __timestampIso8601;
    /**
     * Route settings for the stage, by routeKey.
     */
    RouteSettings?: RouteSettingsMap;
    /**
     * The name of the stage.
     */
    StageName?: StringWithLengthBetween1And128;
    /**
     * A map that defines the stage variables for a stage resource. Variable names can have alphanumeric and underscore characters, and the values must match [A-Za-z0-9-._~:/?#&amp;=,]+.
     */
    StageVariables?: StageVariablesMap;
    /**
     * The collection of tags. Each tag element is associated with a given resource.
     */
    Tags?: Tags;
  }
  export interface GetStagesRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The maximum number of elements to be returned for this resource.
     */
    MaxResults?: __string;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: __string;
  }
  export interface GetStagesResponse {
    /**
     * The elements from this collection.
     */
    Items?: __listOfStage;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: NextToken;
  }
  export interface GetTagsRequest {
    /**
     * The resource ARN for the tag.
     */
    ResourceArn: __string;
  }
  export interface GetTagsResponse {
    Tags?: Tags;
  }
  export interface GetVpcLinkRequest {
    /**
     * The ID of the VPC link.
     */
    VpcLinkId: __string;
  }
  export interface GetVpcLinkResponse {
    /**
     * The timestamp when the VPC link was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The name of the VPC link.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * A list of security group IDs for the VPC link.
     */
    SecurityGroupIds?: SecurityGroupIdList;
    /**
     * A list of subnet IDs to include in the VPC link.
     */
    SubnetIds?: SubnetIdList;
    /**
     * Tags for the VPC link.
     */
    Tags?: Tags;
    /**
     * The ID of the VPC link.
     */
    VpcLinkId?: Id;
    /**
     * The status of the VPC link.
     */
    VpcLinkStatus?: VpcLinkStatus;
    /**
     * A message summarizing the cause of the status of the VPC link.
     */
    VpcLinkStatusMessage?: StringWithLengthBetween0And1024;
    /**
     * The version of the VPC link.
     */
    VpcLinkVersion?: VpcLinkVersion;
  }
  export interface GetVpcLinksRequest {
    /**
     * The maximum number of elements to be returned for this resource.
     */
    MaxResults?: __string;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: __string;
  }
  export interface GetVpcLinksResponse {
    /**
     * A collection of VPC links.
     */
    Items?: __listOfVpcLink;
    /**
     * The next page of elements from this collection. Not valid for the last element of the collection.
     */
    NextToken?: NextToken;
  }
  export type Id = string;
  export type IdentitySourceList = __string[];
  export interface ImportApiRequest {
    /**
     * Specifies how to interpret the base path of the API during import. Valid values are ignore, prepend, and split. The default value is ignore. To learn more, see Set the OpenAPI basePath Property. Supported only for HTTP APIs.
     */
    Basepath?: __string;
    /**
     * The OpenAPI definition. Supported only for HTTP APIs.
     */
    Body: __string;
    /**
     * Specifies whether to rollback the API creation when a warning is encountered. By default, API creation continues if a warning is encountered.
     */
    FailOnWarnings?: __boolean;
  }
  export interface ImportApiResponse {
    /**
     * The URI of the API, of the form {api-id}.execute-api.{region}.amazonaws.com. The stage name is typically appended to this URI to form a complete path to a deployed API stage.
     */
    ApiEndpoint?: __string;
    /**
     * Specifies whether an API is managed by API Gateway. You can't update or delete a managed API by using API Gateway. A managed API can be deleted only through the tooling or service that created it.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * The API ID.
     */
    ApiId?: Id;
    /**
     * An API key selection expression. Supported only for WebSocket APIs. See API Key Selection Expressions.
     */
    ApiKeySelectionExpression?: SelectionExpression;
    /**
     * A CORS configuration. Supported only for HTTP APIs.
     */
    CorsConfiguration?: Cors;
    /**
     * The timestamp when the API was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The description of the API.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Avoid validating models when creating a deployment. Supported only for WebSocket APIs.
     */
    DisableSchemaValidation?: __boolean;
    /**
     * Specifies whether clients can invoke your API by using the default execute-api endpoint. By default, clients can invoke your API with the default https://{api_id}.execute-api.{region}.amazonaws.com endpoint. To require that clients use a custom domain name to invoke your API, disable the default endpoint.
     */
    DisableExecuteApiEndpoint?: __boolean;
    /**
     * The validation information during API import. This may include particular properties of your OpenAPI definition which are ignored during import. Supported only for HTTP APIs.
     */
    ImportInfo?: __listOf__string;
    /**
     * The name of the API.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * The API protocol.
     */
    ProtocolType?: ProtocolType;
    /**
     * The route selection expression for the API. For HTTP APIs, the routeSelectionExpression must be ${request.method} ${request.path}. If not provided, this will be the default for HTTP APIs. This property is required for WebSocket APIs.
     */
    RouteSelectionExpression?: SelectionExpression;
    /**
     * A collection of tags associated with the API.
     */
    Tags?: Tags;
    /**
     * A version identifier for the API.
     */
    Version?: StringWithLengthBetween1And64;
    /**
     * The warning messages reported when failonwarnings is turned on during API import.
     */
    Warnings?: __listOf__string;
  }
  export type IntegerWithLengthBetween0And3600 = number;
  export type IntegerWithLengthBetween50And30000 = number;
  export type IntegerWithLengthBetweenMinus1And86400 = number;
  export interface Integration {
    /**
     * Specifies whether an integration is managed by API Gateway. If you created an API using using quick create, the resulting integration is managed by API Gateway. You can update a managed integration, but you can't delete it.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * The ID of the VPC link for a private integration. Supported only for HTTP APIs.
     */
    ConnectionId?: StringWithLengthBetween1And1024;
    /**
     * The type of the network connection to the integration endpoint. Specify INTERNET for connections through the public routable internet or VPC_LINK for private connections between API Gateway and resources in a VPC. The default value is INTERNET.
     */
    ConnectionType?: ConnectionType;
    /**
     * Supported only for WebSocket APIs. Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT, with the following behaviors: CONVERT_TO_BINARY: Converts a response payload from a Base64-encoded string to the corresponding binary blob. CONVERT_TO_TEXT: Converts a response payload from a binary blob to a Base64-encoded string. If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
     */
    ContentHandlingStrategy?: ContentHandlingStrategy;
    /**
     * Specifies the credentials required for the integration, if any. For AWS integrations, three options are available. To specify an IAM Role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To require that the caller's identity be passed through from the request, specify the string arn:aws:iam::*:user/*. To use resource-based permissions on supported AWS services, specify null.
     */
    CredentialsArn?: Arn;
    /**
     * Represents the description of an integration.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Represents the identifier of an integration.
     */
    IntegrationId?: Id;
    /**
     * Specifies the integration's HTTP method type.
     */
    IntegrationMethod?: StringWithLengthBetween1And64;
    /**
     * The integration response selection expression for the integration. Supported only for WebSocket APIs. See Integration Response Selection Expressions.
     */
    IntegrationResponseSelectionExpression?: SelectionExpression;
    /**
     * Supported only for HTTP API AWS_PROXY integrations. Specifies the AWS service action to invoke. To learn more, see Integration subtype reference.
     */
    IntegrationSubtype?: StringWithLengthBetween1And128;
    /**
     * The integration type of an integration. One of the following: AWS: for integrating the route or method request with an AWS service action, including the Lambda function-invoking action. With the Lambda function-invoking action, this is referred to as the Lambda custom integration. With any other AWS service action, this is known as AWS integration. Supported only for WebSocket APIs. AWS_PROXY: for integrating the route or method request with a Lambda function or other AWS service action. This integration is also referred to as a Lambda proxy integration. HTTP: for integrating the route or method request with an HTTP endpoint. This integration is also referred to as the HTTP custom integration. Supported only for WebSocket APIs. HTTP_PROXY: for integrating the route or method request with an HTTP endpoint, with the client request passed through as-is. This is also referred to as HTTP proxy integration. MOCK: for integrating the route or method request with API Gateway as a "loopback" endpoint without invoking any backend. Supported only for WebSocket APIs.
     */
    IntegrationType?: IntegrationType;
    /**
     * For a Lambda integration, specify the URI of a Lambda function. For an HTTP integration, specify a fully-qualified URL. For an HTTP API private integration, specify the ARN of an Application Load Balancer listener, Network Load Balancer listener, or AWS Cloud Map service. If you specify the ARN of an AWS Cloud Map service, API Gateway uses DiscoverInstances to identify resources. You can use query parameters to target specific resources. To learn more, see DiscoverInstances. For private integrations, all resources must be owned by the same AWS account.
     */
    IntegrationUri?: UriWithLengthBetween1And2048;
    /**
     * Specifies the pass-through behavior for incoming requests based on the Content-Type header in the request, and the available mapping templates specified as the requestTemplates property on the Integration resource. There are three valid values: WHEN_NO_MATCH, WHEN_NO_TEMPLATES, and NEVER. Supported only for WebSocket APIs. WHEN_NO_MATCH passes the request body for unmapped content types through to the integration backend without transformation. NEVER rejects unmapped content types with an HTTP 415 Unsupported Media Type response. WHEN_NO_TEMPLATES allows pass-through when the integration has no content types mapped to templates. However, if there is at least one content type defined, unmapped content types will be rejected with the same HTTP 415 Unsupported Media Type response.
     */
    PassthroughBehavior?: PassthroughBehavior;
    /**
     * Specifies the format of the payload sent to an integration. Required for HTTP APIs.
     */
    PayloadFormatVersion?: StringWithLengthBetween1And64;
    /**
     * For WebSocket APIs, a key-value map specifying request parameters that are passed from the method request to the backend. The key is an integration request parameter name and the associated value is a method request parameter value or static value that must be enclosed within single quotes and pre-encoded as required by the backend. The method request parameter value must match the pattern of method.request.{location}.{name}
          , where 
            {location}
           is querystring, path, or header; and 
            {name}
           must be a valid and unique method request parameter name. For HTTP API integrations with a specified integrationSubtype, request parameters are a key-value map specifying parameters that are passed to AWS_PROXY integrations. You can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see Working with AWS service integrations for HTTP APIs. For HTTP API itegrations, without a specified integrationSubtype request parameters are a key-value map specifying how to transform HTTP requests before sending them to backend integrations. The key should follow the pattern &lt;action&gt;:&lt;header|querystring|path&gt;.&lt;location&gt;. The action can be append, overwrite or remove. For values, you can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see Transforming API requests and responses.
     */
    RequestParameters?: IntegrationParameters;
    /**
     * Represents a map of Velocity templates that are applied on the request payload based on the value of the Content-Type header sent by the client. The content type value is the key in this map, and the template (as a String) is the value. Supported only for WebSocket APIs.
     */
    RequestTemplates?: TemplateMap;
    /**
     * Supported only for HTTP APIs. You use response parameters to transform the HTTP response from a backend integration before returning the response to clients. Specify a key-value map from a selection key to response parameters. The selection key must be a valid HTTP status code within the range of 200-599. Response parameters are a key-value map. The key must match pattern &lt;action&gt;:&lt;header&gt;.&lt;location&gt; or overwrite.statuscode. The action can be append, overwrite or remove. The value can be a static value, or map to response data, stage variables, or context variables that are evaluated at runtime. To learn more, see Transforming API requests and responses.
     */
    ResponseParameters?: ResponseParameters;
    /**
     * The template selection expression for the integration. Supported only for WebSocket APIs.
     */
    TemplateSelectionExpression?: SelectionExpression;
    /**
     * Custom timeout between 50 and 29,000 milliseconds for WebSocket APIs and between 50 and 30,000 milliseconds for HTTP APIs. The default timeout is 29 seconds for WebSocket APIs and 30 seconds for HTTP APIs.
     */
    TimeoutInMillis?: IntegerWithLengthBetween50And30000;
    /**
     * The TLS configuration for a private integration. If you specify a TLS configuration, private integration traffic uses the HTTPS protocol. Supported only for HTTP APIs.
     */
    TlsConfig?: TlsConfig;
  }
  export type IntegrationParameters = {[key: string]: StringWithLengthBetween1And512};
  export interface IntegrationResponse {
    /**
     * Supported only for WebSocket APIs. Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT, with the following behaviors: CONVERT_TO_BINARY: Converts a response payload from a Base64-encoded string to the corresponding binary blob. CONVERT_TO_TEXT: Converts a response payload from a binary blob to a Base64-encoded string. If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
     */
    ContentHandlingStrategy?: ContentHandlingStrategy;
    /**
     * The integration response ID.
     */
    IntegrationResponseId?: Id;
    /**
     * The integration response key.
     */
    IntegrationResponseKey: SelectionKey;
    /**
     * A key-value map specifying response parameters that are passed to the method response from the backend. The key is a method response header parameter name and the mapped value is an integration response header value, a static value enclosed within a pair of single quotes, or a JSON expression from the integration response body. The mapping key must match the pattern of method.response.header.{name}, where name is a valid and unique header name. The mapped non-static value must match the pattern of integration.response.header.{name} or integration.response.body.{JSON-expression}, where name is a valid and unique response header name and JSON-expression is a valid JSON expression without the $ prefix.
     */
    ResponseParameters?: IntegrationParameters;
    /**
     * The collection of response templates for the integration response as a string-to-string map of key-value pairs. Response templates are represented as a key/value map, with a content-type as the key and a template as the value.
     */
    ResponseTemplates?: TemplateMap;
    /**
     * The template selection expressions for the integration response.
     */
    TemplateSelectionExpression?: SelectionExpression;
  }
  export type IntegrationType = "AWS"|"HTTP"|"MOCK"|"HTTP_PROXY"|"AWS_PROXY"|string;
  export interface JWTConfiguration {
    /**
     * A list of the intended recipients of the JWT. A valid JWT must provide an aud that matches at least one entry in this list. See RFC 7519. Supported only for HTTP APIs.
     */
    Audience?: __listOf__string;
    /**
     * The base domain of the identity provider that issues JSON Web Tokens. For example, an Amazon Cognito user pool has the following format: https://cognito-idp.{region}.amazonaws.com/{userPoolId}
               . Required for the JWT authorizer type. Supported only for HTTP APIs.
     */
    Issuer?: UriWithLengthBetween1And2048;
  }
  export type LoggingLevel = "ERROR"|"INFO"|"OFF"|string;
  export interface Model {
    /**
     * The content-type for the model, for example, "application/json".
     */
    ContentType?: StringWithLengthBetween1And256;
    /**
     * The description of the model.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * The model identifier.
     */
    ModelId?: Id;
    /**
     * The name of the model. Must be alphanumeric.
     */
    Name: StringWithLengthBetween1And128;
    /**
     * The schema for the model. For application/json models, this should be JSON schema draft 4 model.
     */
    Schema?: StringWithLengthBetween0And32K;
  }
  export interface MutualTlsAuthentication {
    /**
     * An Amazon S3 URL that specifies the truststore for mutual TLS authentication, for example, s3://bucket-name/key-name. The truststore can contain certificates from public or private certificate authorities. To update the truststore, upload a new version to S3, and then update your custom domain name to use the new version. To update the truststore, you must have permissions to access the S3 object.
     */
    TruststoreUri?: UriWithLengthBetween1And2048;
    /**
     * The version of the S3 object that contains your truststore. To specify a version, you must have versioning enabled for the S3 bucket.
     */
    TruststoreVersion?: StringWithLengthBetween1And64;
    /**
     * A list of warnings that API Gateway returns while processing your truststore. Invalid certificates produce warnings. Mutual TLS is still enabled, but some clients might not be able to access your API. To resolve warnings, upload a new truststore to S3, and then update you domain name to use the new version.
     */
    TruststoreWarnings?: __listOf__string;
  }
  export interface MutualTlsAuthenticationInput {
    /**
     * An Amazon S3 URL that specifies the truststore for mutual TLS authentication, for example, s3://bucket-name/key-name. The truststore can contain certificates from public or private certificate authorities. To update the truststore, upload a new version to S3, and then update your custom domain name to use the new version. To update the truststore, you must have permissions to access the S3 object.
     */
    TruststoreUri?: UriWithLengthBetween1And2048;
    /**
     * The version of the S3 object that contains your truststore. To specify a version, you must have versioning enabled for the S3 bucket.
     */
    TruststoreVersion?: StringWithLengthBetween1And64;
  }
  export type NextToken = string;
  export interface ParameterConstraints {
    /**
     * Whether or not the parameter is required.
     */
    Required?: __boolean;
  }
  export type PassthroughBehavior = "WHEN_NO_MATCH"|"NEVER"|"WHEN_NO_TEMPLATES"|string;
  export type ProtocolType = "WEBSOCKET"|"HTTP"|string;
  export interface ReimportApiRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * Specifies how to interpret the base path of the API during import. Valid values are ignore, prepend, and split. The default value is ignore. To learn more, see Set the OpenAPI basePath Property. Supported only for HTTP APIs.
     */
    Basepath?: __string;
    /**
     * The OpenAPI definition. Supported only for HTTP APIs.
     */
    Body: __string;
    /**
     * Specifies whether to rollback the API creation when a warning is encountered. By default, API creation continues if a warning is encountered.
     */
    FailOnWarnings?: __boolean;
  }
  export interface ReimportApiResponse {
    /**
     * The URI of the API, of the form {api-id}.execute-api.{region}.amazonaws.com. The stage name is typically appended to this URI to form a complete path to a deployed API stage.
     */
    ApiEndpoint?: __string;
    /**
     * Specifies whether an API is managed by API Gateway. You can't update or delete a managed API by using API Gateway. A managed API can be deleted only through the tooling or service that created it.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * The API ID.
     */
    ApiId?: Id;
    /**
     * An API key selection expression. Supported only for WebSocket APIs. See API Key Selection Expressions.
     */
    ApiKeySelectionExpression?: SelectionExpression;
    /**
     * A CORS configuration. Supported only for HTTP APIs.
     */
    CorsConfiguration?: Cors;
    /**
     * The timestamp when the API was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The description of the API.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Avoid validating models when creating a deployment. Supported only for WebSocket APIs.
     */
    DisableSchemaValidation?: __boolean;
    /**
     * Specifies whether clients can invoke your API by using the default execute-api endpoint. By default, clients can invoke your API with the default https://{api_id}.execute-api.{region}.amazonaws.com endpoint. To require that clients use a custom domain name to invoke your API, disable the default endpoint.
     */
    DisableExecuteApiEndpoint?: __boolean;
    /**
     * The validation information during API import. This may include particular properties of your OpenAPI definition which are ignored during import. Supported only for HTTP APIs.
     */
    ImportInfo?: __listOf__string;
    /**
     * The name of the API.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * The API protocol.
     */
    ProtocolType?: ProtocolType;
    /**
     * The route selection expression for the API. For HTTP APIs, the routeSelectionExpression must be ${request.method} ${request.path}. If not provided, this will be the default for HTTP APIs. This property is required for WebSocket APIs.
     */
    RouteSelectionExpression?: SelectionExpression;
    /**
     * A collection of tags associated with the API.
     */
    Tags?: Tags;
    /**
     * A version identifier for the API.
     */
    Version?: StringWithLengthBetween1And64;
    /**
     * The warning messages reported when failonwarnings is turned on during API import.
     */
    Warnings?: __listOf__string;
  }
  export type ResponseParameters = {[key: string]: IntegrationParameters};
  export interface Route {
    /**
     * Specifies whether a route is managed by API Gateway. If you created an API using quick create, the $default route is managed by API Gateway. You can't modify the $default route key.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * Specifies whether an API key is required for this route. Supported only for WebSocket APIs.
     */
    ApiKeyRequired?: __boolean;
    /**
     * A list of authorization scopes configured on a route. The scopes are used with a JWT authorizer to authorize the method invocation. The authorization works by matching the route scopes against the scopes parsed from the access token in the incoming request. The method invocation is authorized if any route scope matches a claimed scope in the access token. Otherwise, the invocation is not authorized. When the route scope is configured, the client must provide an access token instead of an identity token for authorization purposes.
     */
    AuthorizationScopes?: AuthorizationScopes;
    /**
     * The authorization type for the route. For WebSocket APIs, valid values are NONE for open access, AWS_IAM for using AWS IAM permissions, and CUSTOM for using a Lambda authorizer For HTTP APIs, valid values are NONE for open access, JWT for using JSON Web Tokens, AWS_IAM for using AWS IAM permissions, and CUSTOM for using a Lambda authorizer.
     */
    AuthorizationType?: AuthorizationType;
    /**
     * The identifier of the Authorizer resource to be associated with this route. The authorizer identifier is generated by API Gateway when you created the authorizer.
     */
    AuthorizerId?: Id;
    /**
     * The model selection expression for the route. Supported only for WebSocket APIs.
     */
    ModelSelectionExpression?: SelectionExpression;
    /**
     * The operation name for the route.
     */
    OperationName?: StringWithLengthBetween1And64;
    /**
     * The request models for the route. Supported only for WebSocket APIs.
     */
    RequestModels?: RouteModels;
    /**
     * The request parameters for the route. Supported only for WebSocket APIs.
     */
    RequestParameters?: RouteParameters;
    /**
     * The route ID.
     */
    RouteId?: Id;
    /**
     * The route key for the route.
     */
    RouteKey: SelectionKey;
    /**
     * The route response selection expression for the route. Supported only for WebSocket APIs.
     */
    RouteResponseSelectionExpression?: SelectionExpression;
    /**
     * The target for the route.
     */
    Target?: StringWithLengthBetween1And128;
  }
  export type RouteModels = {[key: string]: StringWithLengthBetween1And128};
  export type RouteParameters = {[key: string]: ParameterConstraints};
  export interface RouteResponse {
    /**
     * Represents the model selection expression of a route response. Supported only for WebSocket APIs.
     */
    ModelSelectionExpression?: SelectionExpression;
    /**
     * Represents the response models of a route response.
     */
    ResponseModels?: RouteModels;
    /**
     * Represents the response parameters of a route response.
     */
    ResponseParameters?: RouteParameters;
    /**
     * Represents the identifier of a route response.
     */
    RouteResponseId?: Id;
    /**
     * Represents the route response key of a route response.
     */
    RouteResponseKey: SelectionKey;
  }
  export interface RouteSettings {
    /**
     * Specifies whether (true) or not (false) data trace logging is enabled for this route. This property affects the log entries pushed to Amazon CloudWatch Logs. Supported only for WebSocket APIs.
     */
    DataTraceEnabled?: __boolean;
    /**
     * Specifies whether detailed metrics are enabled.
     */
    DetailedMetricsEnabled?: __boolean;
    /**
     * Specifies the logging level for this route: INFO, ERROR, or OFF. This property affects the log entries pushed to Amazon CloudWatch Logs. Supported only for WebSocket APIs.
     */
    LoggingLevel?: LoggingLevel;
    /**
     * Specifies the throttling burst limit.
     */
    ThrottlingBurstLimit?: __integer;
    /**
     * Specifies the throttling rate limit.
     */
    ThrottlingRateLimit?: __double;
  }
  export type RouteSettingsMap = {[key: string]: RouteSettings};
  export type SecurityGroupIdList = __string[];
  export type SecurityPolicy = "TLS_1_0"|"TLS_1_2"|string;
  export type SelectionExpression = string;
  export type SelectionKey = string;
  export interface Stage {
    /**
     * Settings for logging access in this stage.
     */
    AccessLogSettings?: AccessLogSettings;
    /**
     * Specifies whether a stage is managed by API Gateway. If you created an API using quick create, the $default stage is managed by API Gateway. You can't modify the $default stage.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * Specifies whether updates to an API automatically trigger a new deployment. The default value is false.
     */
    AutoDeploy?: __boolean;
    /**
     * The identifier of a client certificate for a Stage. Supported only for WebSocket APIs.
     */
    ClientCertificateId?: Id;
    /**
     * The timestamp when the stage was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * Default route settings for the stage.
     */
    DefaultRouteSettings?: RouteSettings;
    /**
     * The identifier of the Deployment that the Stage is associated with. Can't be updated if autoDeploy is enabled.
     */
    DeploymentId?: Id;
    /**
     * The description of the stage.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Describes the status of the last deployment of a stage. Supported only for stages with autoDeploy enabled.
     */
    LastDeploymentStatusMessage?: __string;
    /**
     * The timestamp when the stage was last updated.
     */
    LastUpdatedDate?: __timestampIso8601;
    /**
     * Route settings for the stage, by routeKey.
     */
    RouteSettings?: RouteSettingsMap;
    /**
     * The name of the stage.
     */
    StageName: StringWithLengthBetween1And128;
    /**
     * A map that defines the stage variables for a stage resource. Variable names can have alphanumeric and underscore characters, and the values must match [A-Za-z0-9-._~:/?#&amp;=,]+.
     */
    StageVariables?: StageVariablesMap;
    /**
     * The collection of tags. Each tag element is associated with a given resource.
     */
    Tags?: Tags;
  }
  export type StageVariablesMap = {[key: string]: StringWithLengthBetween0And2048};
  export type StringWithLengthBetween0And1024 = string;
  export type StringWithLengthBetween0And2048 = string;
  export type StringWithLengthBetween0And32K = string;
  export type StringWithLengthBetween1And1024 = string;
  export type StringWithLengthBetween1And128 = string;
  export type StringWithLengthBetween1And1600 = string;
  export type StringWithLengthBetween1And256 = string;
  export type StringWithLengthBetween1And512 = string;
  export type StringWithLengthBetween1And64 = string;
  export type SubnetIdList = __string[];
  export interface TagResourceRequest {
    /**
     * The resource ARN for the tag.
     */
    ResourceArn: __string;
    /**
     * The collection of tags. Each tag element is associated with a given resource.
     */
    Tags?: Tags;
  }
  export interface TagResourceResponse {
  }
  export type Tags = {[key: string]: StringWithLengthBetween1And1600};
  export type TemplateMap = {[key: string]: StringWithLengthBetween0And32K};
  export interface TlsConfig {
    /**
     * If you specify a server name, API Gateway uses it to verify the hostname on the integration's certificate. The server name is also included in the TLS handshake to support Server Name Indication (SNI) or virtual hosting.
     */
    ServerNameToVerify?: StringWithLengthBetween1And512;
  }
  export interface TlsConfigInput {
    /**
     * If you specify a server name, API Gateway uses it to verify the hostname on the integration's certificate. The server name is also included in the TLS handshake to support Server Name Indication (SNI) or virtual hosting.
     */
    ServerNameToVerify?: StringWithLengthBetween1And512;
  }
  export interface UntagResourceRequest {
    /**
     * The resource ARN for the tag.
     */
    ResourceArn: __string;
    /**
     * The Tag keys to delete
     */
    TagKeys: __listOf__string;
  }
  export interface UpdateApiMappingRequest {
    /**
     * The API identifier.
     */
    ApiId: Id;
    /**
     * The API mapping identifier.
     */
    ApiMappingId: __string;
    /**
     * The API mapping key.
     */
    ApiMappingKey?: SelectionKey;
    /**
     * The domain name.
     */
    DomainName: __string;
    /**
     * The API stage.
     */
    Stage?: StringWithLengthBetween1And128;
  }
  export interface UpdateApiMappingResponse {
    /**
     * The API identifier.
     */
    ApiId?: Id;
    /**
     * The API mapping identifier.
     */
    ApiMappingId?: Id;
    /**
     * The API mapping key.
     */
    ApiMappingKey?: SelectionKey;
    /**
     * The API stage.
     */
    Stage?: StringWithLengthBetween1And128;
  }
  export interface UpdateApiRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * An API key selection expression. Supported only for WebSocket APIs. See API Key Selection Expressions.
     */
    ApiKeySelectionExpression?: SelectionExpression;
    /**
     * A CORS configuration. Supported only for HTTP APIs.
     */
    CorsConfiguration?: Cors;
    /**
     * This property is part of quick create. It specifies the credentials required for the integration, if any. For a Lambda integration, three options are available. To specify an IAM Role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To require that the caller's identity be passed through from the request, specify arn:aws:iam::*:user/*. To use resource-based permissions on supported AWS services, don't specify this parameter. Currently, this property is not used for HTTP integrations. If provided, this value replaces the credentials associated with the quick create integration. Supported only for HTTP APIs.
     */
    CredentialsArn?: Arn;
    /**
     * The description of the API.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Avoid validating models when creating a deployment. Supported only for WebSocket APIs.
     */
    DisableSchemaValidation?: __boolean;
    /**
     * Specifies whether clients can invoke your API by using the default execute-api endpoint. By default, clients can invoke your API with the default https://{api_id}.execute-api.{region}.amazonaws.com endpoint. To require that clients use a custom domain name to invoke your API, disable the default endpoint.
     */
    DisableExecuteApiEndpoint?: __boolean;
    /**
     * The name of the API.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * This property is part of quick create. If not specified, the route created using quick create is kept. Otherwise, this value replaces the route key of the quick create route. Additional routes may still be added after the API is updated. Supported only for HTTP APIs.
     */
    RouteKey?: SelectionKey;
    /**
     * The route selection expression for the API. For HTTP APIs, the routeSelectionExpression must be ${request.method} ${request.path}. If not provided, this will be the default for HTTP APIs. This property is required for WebSocket APIs.
     */
    RouteSelectionExpression?: SelectionExpression;
    /**
     * This property is part of quick create. For HTTP integrations, specify a fully qualified URL. For Lambda integrations, specify a function ARN. The type of the integration will be HTTP_PROXY or AWS_PROXY, respectively. The value provided updates the integration URI and integration type. You can update a quick-created target, but you can't remove it from an API. Supported only for HTTP APIs.
     */
    Target?: UriWithLengthBetween1And2048;
    /**
     * A version identifier for the API.
     */
    Version?: StringWithLengthBetween1And64;
  }
  export interface UpdateApiResponse {
    /**
     * The URI of the API, of the form {api-id}.execute-api.{region}.amazonaws.com. The stage name is typically appended to this URI to form a complete path to a deployed API stage.
     */
    ApiEndpoint?: __string;
    /**
     * Specifies whether an API is managed by API Gateway. You can't update or delete a managed API by using API Gateway. A managed API can be deleted only through the tooling or service that created it.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * The API ID.
     */
    ApiId?: Id;
    /**
     * An API key selection expression. Supported only for WebSocket APIs. See API Key Selection Expressions.
     */
    ApiKeySelectionExpression?: SelectionExpression;
    /**
     * A CORS configuration. Supported only for HTTP APIs.
     */
    CorsConfiguration?: Cors;
    /**
     * The timestamp when the API was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The description of the API.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Avoid validating models when creating a deployment. Supported only for WebSocket APIs.
     */
    DisableSchemaValidation?: __boolean;
    /**
     * Specifies whether clients can invoke your API by using the default execute-api endpoint. By default, clients can invoke your API with the default https://{api_id}.execute-api.{region}.amazonaws.com endpoint. To require that clients use a custom domain name to invoke your API, disable the default endpoint.
     */
    DisableExecuteApiEndpoint?: __boolean;
    /**
     * The validation information during API import. This may include particular properties of your OpenAPI definition which are ignored during import. Supported only for HTTP APIs.
     */
    ImportInfo?: __listOf__string;
    /**
     * The name of the API.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * The API protocol.
     */
    ProtocolType?: ProtocolType;
    /**
     * The route selection expression for the API. For HTTP APIs, the routeSelectionExpression must be ${request.method} ${request.path}. If not provided, this will be the default for HTTP APIs. This property is required for WebSocket APIs.
     */
    RouteSelectionExpression?: SelectionExpression;
    /**
     * A collection of tags associated with the API.
     */
    Tags?: Tags;
    /**
     * A version identifier for the API.
     */
    Version?: StringWithLengthBetween1And64;
    /**
     * The warning messages reported when failonwarnings is turned on during API import.
     */
    Warnings?: __listOf__string;
  }
  export interface UpdateAuthorizerRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * Specifies the required credentials as an IAM role for API Gateway to invoke the authorizer. To specify an IAM role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To use resource-based permissions on the Lambda function, don't specify this parameter.
     */
    AuthorizerCredentialsArn?: Arn;
    /**
     * The authorizer identifier.
     */
    AuthorizerId: __string;
    /**
     * Specifies the format of the payload sent to an HTTP API Lambda authorizer. Required for HTTP API Lambda authorizers. Supported values are 1.0 and 2.0. To learn more, see Working with AWS Lambda authorizers for HTTP APIs.
     */
    AuthorizerPayloadFormatVersion?: StringWithLengthBetween1And64;
    /**
     * The time to live (TTL) for cached authorizer results, in seconds. If it equals 0, authorization caching is disabled. If it is greater than 0, API Gateway caches authorizer responses. The maximum value is 3600, or 1 hour. Supported only for HTTP API Lambda authorizers.
     */
    AuthorizerResultTtlInSeconds?: IntegerWithLengthBetween0And3600;
    /**
     * The authorizer type. Specify REQUEST for a Lambda function using incoming request parameters. Specify JWT to use JSON Web Tokens (supported only for HTTP APIs).
     */
    AuthorizerType?: AuthorizerType;
    /**
     * The authorizer's Uniform Resource Identifier (URI). For REQUEST authorizers, this must be a well-formed Lambda function URI, for example, arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:{account_id}:function:{lambda_function_name}/invocations. In general, the URI has this form: arn:aws:apigateway:{region}:lambda:path/{service_api}
               , where {region} is the same as the region hosting the Lambda function, path indicates that the remaining substring in the URI should be treated as the path to the resource, including the initial /. For Lambda functions, this is usually of the form /2015-03-31/functions/[FunctionARN]/invocations. Supported only for REQUEST authorizers.
     */
    AuthorizerUri?: UriWithLengthBetween1And2048;
    /**
     * Specifies whether a Lambda authorizer returns a response in a simple format. By default, a Lambda authorizer must return an IAM policy. If enabled, the Lambda authorizer can return a boolean value instead of an IAM policy. Supported only for HTTP APIs. To learn more, see Working with AWS Lambda authorizers for HTTP APIs
     */
    EnableSimpleResponses?: __boolean;
    /**
     * The identity source for which authorization is requested. For a REQUEST authorizer, this is optional. The value is a set of one or more mapping expressions of the specified request parameters. The identity source can be headers, query string parameters, stage variables, and context parameters. For example, if an Auth header and a Name query string parameter are defined as identity sources, this value is route.request.header.Auth, route.request.querystring.Name for WebSocket APIs. For HTTP APIs, use selection expressions prefixed with $, for example, $request.header.Auth, $request.querystring.Name. These parameters are used to perform runtime validation for Lambda-based authorizers by verifying all of the identity-related request parameters are present in the request, not null, and non-empty. Only when this is true does the authorizer invoke the authorizer Lambda function. Otherwise, it returns a 401 Unauthorized response without calling the Lambda function. For HTTP APIs, identity sources are also used as the cache key when caching is enabled. To learn more, see Working with AWS Lambda authorizers for HTTP APIs. For JWT, a single entry that specifies where to extract the JSON Web Token (JWT) from inbound requests. Currently only header-based and query parameter-based selections are supported, for example $request.header.Authorization.
     */
    IdentitySource?: IdentitySourceList;
    /**
     * This parameter is not used.
     */
    IdentityValidationExpression?: StringWithLengthBetween0And1024;
    /**
     * Represents the configuration of a JWT authorizer. Required for the JWT authorizer type. Supported only for HTTP APIs.
     */
    JwtConfiguration?: JWTConfiguration;
    /**
     * The name of the authorizer.
     */
    Name?: StringWithLengthBetween1And128;
  }
  export interface UpdateAuthorizerResponse {
    /**
     * Specifies the required credentials as an IAM role for API Gateway to invoke the authorizer. To specify an IAM role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To use resource-based permissions on the Lambda function, don't specify this parameter. Supported only for REQUEST authorizers.
     */
    AuthorizerCredentialsArn?: Arn;
    /**
     * The authorizer identifier.
     */
    AuthorizerId?: Id;
    /**
     * Specifies the format of the payload sent to an HTTP API Lambda authorizer. Required for HTTP API Lambda authorizers. Supported values are 1.0 and 2.0. To learn more, see Working with AWS Lambda authorizers for HTTP APIs.
     */
    AuthorizerPayloadFormatVersion?: StringWithLengthBetween1And64;
    /**
     * The time to live (TTL) for cached authorizer results, in seconds. If it equals 0, authorization caching is disabled. If it is greater than 0, API Gateway caches authorizer responses. The maximum value is 3600, or 1 hour. Supported only for HTTP API Lambda authorizers.
     */
    AuthorizerResultTtlInSeconds?: IntegerWithLengthBetween0And3600;
    /**
     * The authorizer type. Specify REQUEST for a Lambda function using incoming request parameters. Specify JWT to use JSON Web Tokens (supported only for HTTP APIs).
     */
    AuthorizerType?: AuthorizerType;
    /**
     * The authorizer's Uniform Resource Identifier (URI). For REQUEST authorizers, this must be a well-formed Lambda function URI, for example, arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:{account_id}:function:{lambda_function_name}/invocations. In general, the URI has this form: arn:aws:apigateway:{region}:lambda:path/{service_api}
               , where {region} is the same as the region hosting the Lambda function, path indicates that the remaining substring in the URI should be treated as the path to the resource, including the initial /. For Lambda functions, this is usually of the form /2015-03-31/functions/[FunctionARN]/invocations. Supported only for REQUEST authorizers.
     */
    AuthorizerUri?: UriWithLengthBetween1And2048;
    /**
     * Specifies whether a Lambda authorizer returns a response in a simple format. If enabled, the Lambda authorizer can return a boolean value instead of an IAM policy. Supported only for HTTP APIs. To learn more, see Working with AWS Lambda authorizers for HTTP APIs
     */
    EnableSimpleResponses?: __boolean;
    /**
     * The identity source for which authorization is requested. For a REQUEST authorizer, this is optional. The value is a set of one or more mapping expressions of the specified request parameters. The identity source can be headers, query string parameters, stage variables, and context parameters. For example, if an Auth header and a Name query string parameter are defined as identity sources, this value is route.request.header.Auth, route.request.querystring.Name for WebSocket APIs. For HTTP APIs, use selection expressions prefixed with $, for example, $request.header.Auth, $request.querystring.Name. These parameters are used to perform runtime validation for Lambda-based authorizers by verifying all of the identity-related request parameters are present in the request, not null, and non-empty. Only when this is true does the authorizer invoke the authorizer Lambda function. Otherwise, it returns a 401 Unauthorized response without calling the Lambda function. For HTTP APIs, identity sources are also used as the cache key when caching is enabled. To learn more, see Working with AWS Lambda authorizers for HTTP APIs. For JWT, a single entry that specifies where to extract the JSON Web Token (JWT) from inbound requests. Currently only header-based and query parameter-based selections are supported, for example $request.header.Authorization.
     */
    IdentitySource?: IdentitySourceList;
    /**
     * The validation expression does not apply to the REQUEST authorizer.
     */
    IdentityValidationExpression?: StringWithLengthBetween0And1024;
    /**
     * Represents the configuration of a JWT authorizer. Required for the JWT authorizer type. Supported only for HTTP APIs.
     */
    JwtConfiguration?: JWTConfiguration;
    /**
     * The name of the authorizer.
     */
    Name?: StringWithLengthBetween1And128;
  }
  export interface UpdateDeploymentRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The deployment ID.
     */
    DeploymentId: __string;
    /**
     * The description for the deployment resource.
     */
    Description?: StringWithLengthBetween0And1024;
  }
  export interface UpdateDeploymentResponse {
    /**
     * Specifies whether a deployment was automatically released.
     */
    AutoDeployed?: __boolean;
    /**
     * The date and time when the Deployment resource was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The identifier for the deployment.
     */
    DeploymentId?: Id;
    /**
     * The status of the deployment: PENDING, FAILED, or SUCCEEDED.
     */
    DeploymentStatus?: DeploymentStatus;
    /**
     * May contain additional feedback on the status of an API deployment.
     */
    DeploymentStatusMessage?: __string;
    /**
     * The description for the deployment.
     */
    Description?: StringWithLengthBetween0And1024;
  }
  export interface UpdateDomainNameRequest {
    /**
     * The domain name.
     */
    DomainName: __string;
    /**
     * The domain name configurations.
     */
    DomainNameConfigurations?: DomainNameConfigurations;
    /**
     * The mutual TLS authentication configuration for a custom domain name.
     */
    MutualTlsAuthentication?: MutualTlsAuthenticationInput;
  }
  export interface UpdateDomainNameResponse {
    /**
     * The API mapping selection expression.
     */
    ApiMappingSelectionExpression?: SelectionExpression;
    /**
     * The name of the DomainName resource.
     */
    DomainName?: StringWithLengthBetween1And512;
    /**
     * The domain name configurations.
     */
    DomainNameConfigurations?: DomainNameConfigurations;
    /**
     * The mutual TLS authentication configuration for a custom domain name.
     */
    MutualTlsAuthentication?: MutualTlsAuthentication;
    /**
     * The collection of tags associated with a domain name.
     */
    Tags?: Tags;
  }
  export interface UpdateIntegrationRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The ID of the VPC link for a private integration. Supported only for HTTP APIs.
     */
    ConnectionId?: StringWithLengthBetween1And1024;
    /**
     * The type of the network connection to the integration endpoint. Specify INTERNET for connections through the public routable internet or VPC_LINK for private connections between API Gateway and resources in a VPC. The default value is INTERNET.
     */
    ConnectionType?: ConnectionType;
    /**
     * Supported only for WebSocket APIs. Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT, with the following behaviors: CONVERT_TO_BINARY: Converts a response payload from a Base64-encoded string to the corresponding binary blob. CONVERT_TO_TEXT: Converts a response payload from a binary blob to a Base64-encoded string. If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
     */
    ContentHandlingStrategy?: ContentHandlingStrategy;
    /**
     * Specifies the credentials required for the integration, if any. For AWS integrations, three options are available. To specify an IAM Role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To require that the caller's identity be passed through from the request, specify the string arn:aws:iam::*:user/*. To use resource-based permissions on supported AWS services, specify null.
     */
    CredentialsArn?: Arn;
    /**
     * The description of the integration
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * The integration ID.
     */
    IntegrationId: __string;
    /**
     * Specifies the integration's HTTP method type.
     */
    IntegrationMethod?: StringWithLengthBetween1And64;
    /**
     * Supported only for HTTP API AWS_PROXY integrations. Specifies the AWS service action to invoke. To learn more, see Integration subtype reference.
     */
    IntegrationSubtype?: StringWithLengthBetween1And128;
    /**
     * The integration type of an integration. One of the following: AWS: for integrating the route or method request with an AWS service action, including the Lambda function-invoking action. With the Lambda function-invoking action, this is referred to as the Lambda custom integration. With any other AWS service action, this is known as AWS integration. Supported only for WebSocket APIs. AWS_PROXY: for integrating the route or method request with a Lambda function or other AWS service action. This integration is also referred to as a Lambda proxy integration. HTTP: for integrating the route or method request with an HTTP endpoint. This integration is also referred to as the HTTP custom integration. Supported only for WebSocket APIs. HTTP_PROXY: for integrating the route or method request with an HTTP endpoint, with the client request passed through as-is. This is also referred to as HTTP proxy integration. For HTTP API private integrations, use an HTTP_PROXY integration. MOCK: for integrating the route or method request with API Gateway as a "loopback" endpoint without invoking any backend. Supported only for WebSocket APIs.
     */
    IntegrationType?: IntegrationType;
    /**
     * For a Lambda integration, specify the URI of a Lambda function. For an HTTP integration, specify a fully-qualified URL. For an HTTP API private integration, specify the ARN of an Application Load Balancer listener, Network Load Balancer listener, or AWS Cloud Map service. If you specify the ARN of an AWS Cloud Map service, API Gateway uses DiscoverInstances to identify resources. You can use query parameters to target specific resources. To learn more, see DiscoverInstances. For private integrations, all resources must be owned by the same AWS account.
     */
    IntegrationUri?: UriWithLengthBetween1And2048;
    /**
     * Specifies the pass-through behavior for incoming requests based on the Content-Type header in the request, and the available mapping templates specified as the requestTemplates property on the Integration resource. There are three valid values: WHEN_NO_MATCH, WHEN_NO_TEMPLATES, and NEVER. Supported only for WebSocket APIs. WHEN_NO_MATCH passes the request body for unmapped content types through to the integration backend without transformation. NEVER rejects unmapped content types with an HTTP 415 Unsupported Media Type response. WHEN_NO_TEMPLATES allows pass-through when the integration has no content types mapped to templates. However, if there is at least one content type defined, unmapped content types will be rejected with the same HTTP 415 Unsupported Media Type response.
     */
    PassthroughBehavior?: PassthroughBehavior;
    /**
     * Specifies the format of the payload sent to an integration. Required for HTTP APIs.
     */
    PayloadFormatVersion?: StringWithLengthBetween1And64;
    /**
     * For WebSocket APIs, a key-value map specifying request parameters that are passed from the method request to the backend. The key is an integration request parameter name and the associated value is a method request parameter value or static value that must be enclosed within single quotes and pre-encoded as required by the backend. The method request parameter value must match the pattern of method.request.{location}.{name}
          , where 
            {location}
           is querystring, path, or header; and 
            {name}
           must be a valid and unique method request parameter name. For HTTP API integrations with a specified integrationSubtype, request parameters are a key-value map specifying parameters that are passed to AWS_PROXY integrations. You can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see Working with AWS service integrations for HTTP APIs. For HTTP API integrations, without a specified integrationSubtype request parameters are a key-value map specifying how to transform HTTP requests before sending them to the backend. The key should follow the pattern &lt;action&gt;:&lt;header|querystring|path&gt;.&lt;location&gt; where action can be append, overwrite or remove. For values, you can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see Transforming API requests and responses.
     */
    RequestParameters?: IntegrationParameters;
    /**
     * Represents a map of Velocity templates that are applied on the request payload based on the value of the Content-Type header sent by the client. The content type value is the key in this map, and the template (as a String) is the value. Supported only for WebSocket APIs.
     */
    RequestTemplates?: TemplateMap;
    /**
     * Supported only for HTTP APIs. You use response parameters to transform the HTTP response from a backend integration before returning the response to clients. Specify a key-value map from a selection key to response parameters. The selection key must be a valid HTTP status code within the range of 200-599. Response parameters are a key-value map. The key must match pattern &lt;action&gt;:&lt;header&gt;.&lt;location&gt; or overwrite.statuscode. The action can be append, overwrite or remove. The value can be a static value, or map to response data, stage variables, or context variables that are evaluated at runtime. To learn more, see Transforming API requests and responses.
     */
    ResponseParameters?: ResponseParameters;
    /**
     * The template selection expression for the integration.
     */
    TemplateSelectionExpression?: SelectionExpression;
    /**
     * Custom timeout between 50 and 29,000 milliseconds for WebSocket APIs and between 50 and 30,000 milliseconds for HTTP APIs. The default timeout is 29 seconds for WebSocket APIs and 30 seconds for HTTP APIs.
     */
    TimeoutInMillis?: IntegerWithLengthBetween50And30000;
    /**
     * The TLS configuration for a private integration. If you specify a TLS configuration, private integration traffic uses the HTTPS protocol. Supported only for HTTP APIs.
     */
    TlsConfig?: TlsConfigInput;
  }
  export interface UpdateIntegrationResult {
    /**
     * Specifies whether an integration is managed by API Gateway. If you created an API using using quick create, the resulting integration is managed by API Gateway. You can update a managed integration, but you can't delete it.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * The ID of the VPC link for a private integration. Supported only for HTTP APIs.
     */
    ConnectionId?: StringWithLengthBetween1And1024;
    /**
     * The type of the network connection to the integration endpoint. Specify INTERNET for connections through the public routable internet or VPC_LINK for private connections between API Gateway and resources in a VPC. The default value is INTERNET.
     */
    ConnectionType?: ConnectionType;
    /**
     * Supported only for WebSocket APIs. Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT, with the following behaviors: CONVERT_TO_BINARY: Converts a response payload from a Base64-encoded string to the corresponding binary blob. CONVERT_TO_TEXT: Converts a response payload from a binary blob to a Base64-encoded string. If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
     */
    ContentHandlingStrategy?: ContentHandlingStrategy;
    /**
     * Specifies the credentials required for the integration, if any. For AWS integrations, three options are available. To specify an IAM Role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To require that the caller's identity be passed through from the request, specify the string arn:aws:iam::*:user/*. To use resource-based permissions on supported AWS services, specify null.
     */
    CredentialsArn?: Arn;
    /**
     * Represents the description of an integration.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Represents the identifier of an integration.
     */
    IntegrationId?: Id;
    /**
     * Specifies the integration's HTTP method type.
     */
    IntegrationMethod?: StringWithLengthBetween1And64;
    /**
     * The integration response selection expression for the integration. Supported only for WebSocket APIs. See Integration Response Selection Expressions.
     */
    IntegrationResponseSelectionExpression?: SelectionExpression;
    /**
     * Supported only for HTTP API AWS_PROXY integrations. Specifies the AWS service action to invoke. To learn more, see Integration subtype reference.
     */
    IntegrationSubtype?: StringWithLengthBetween1And128;
    /**
     * The integration type of an integration. One of the following: AWS: for integrating the route or method request with an AWS service action, including the Lambda function-invoking action. With the Lambda function-invoking action, this is referred to as the Lambda custom integration. With any other AWS service action, this is known as AWS integration. Supported only for WebSocket APIs. AWS_PROXY: for integrating the route or method request with a Lambda function or other AWS service action. This integration is also referred to as a Lambda proxy integration. HTTP: for integrating the route or method request with an HTTP endpoint. This integration is also referred to as the HTTP custom integration. Supported only for WebSocket APIs. HTTP_PROXY: for integrating the route or method request with an HTTP endpoint, with the client request passed through as-is. This is also referred to as HTTP proxy integration. MOCK: for integrating the route or method request with API Gateway as a "loopback" endpoint without invoking any backend. Supported only for WebSocket APIs.
     */
    IntegrationType?: IntegrationType;
    /**
     * For a Lambda integration, specify the URI of a Lambda function. For an HTTP integration, specify a fully-qualified URL. For an HTTP API private integration, specify the ARN of an Application Load Balancer listener, Network Load Balancer listener, or AWS Cloud Map service. If you specify the ARN of an AWS Cloud Map service, API Gateway uses DiscoverInstances to identify resources. You can use query parameters to target specific resources. To learn more, see DiscoverInstances. For private integrations, all resources must be owned by the same AWS account.
     */
    IntegrationUri?: UriWithLengthBetween1And2048;
    /**
     * Specifies the pass-through behavior for incoming requests based on the Content-Type header in the request, and the available mapping templates specified as the requestTemplates property on the Integration resource. There are three valid values: WHEN_NO_MATCH, WHEN_NO_TEMPLATES, and NEVER. Supported only for WebSocket APIs. WHEN_NO_MATCH passes the request body for unmapped content types through to the integration backend without transformation. NEVER rejects unmapped content types with an HTTP 415 Unsupported Media Type response. WHEN_NO_TEMPLATES allows pass-through when the integration has no content types mapped to templates. However, if there is at least one content type defined, unmapped content types will be rejected with the same HTTP 415 Unsupported Media Type response.
     */
    PassthroughBehavior?: PassthroughBehavior;
    /**
     * Specifies the format of the payload sent to an integration. Required for HTTP APIs.
     */
    PayloadFormatVersion?: StringWithLengthBetween1And64;
    /**
     * For WebSocket APIs, a key-value map specifying request parameters that are passed from the method request to the backend. The key is an integration request parameter name and the associated value is a method request parameter value or static value that must be enclosed within single quotes and pre-encoded as required by the backend. The method request parameter value must match the pattern of method.request.{location}.{name}
          , where 
            {location}
           is querystring, path, or header; and 
            {name}
           must be a valid and unique method request parameter name. For HTTP API integrations with a specified integrationSubtype, request parameters are a key-value map specifying parameters that are passed to AWS_PROXY integrations. You can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see Working with AWS service integrations for HTTP APIs. For HTTP API itegrations, without a specified integrationSubtype request parameters are a key-value map specifying how to transform HTTP requests before sending them to backend integrations. The key should follow the pattern &lt;action&gt;:&lt;header|querystring|path&gt;.&lt;location&gt;. The action can be append, overwrite or remove. For values, you can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see Transforming API requests and responses.
     */
    RequestParameters?: IntegrationParameters;
    /**
     * Represents a map of Velocity templates that are applied on the request payload based on the value of the Content-Type header sent by the client. The content type value is the key in this map, and the template (as a String) is the value. Supported only for WebSocket APIs.
     */
    RequestTemplates?: TemplateMap;
    /**
     * Supported only for HTTP APIs. You use response parameters to transform the HTTP response from a backend integration before returning the response to clients. Specify a key-value map from a selection key to response parameters. The selection key must be a valid HTTP status code within the range of 200-599. Response parameters are a key-value map. The key must match pattern &lt;action&gt;:&lt;header&gt;.&lt;location&gt; or overwrite.statuscode. The action can be append, overwrite or remove. The value can be a static value, or map to response data, stage variables, or context variables that are evaluated at runtime. To learn more, see Transforming API requests and responses.
     */
    ResponseParameters?: ResponseParameters;
    /**
     * The template selection expression for the integration. Supported only for WebSocket APIs.
     */
    TemplateSelectionExpression?: SelectionExpression;
    /**
     * Custom timeout between 50 and 29,000 milliseconds for WebSocket APIs and between 50 and 30,000 milliseconds for HTTP APIs. The default timeout is 29 seconds for WebSocket APIs and 30 seconds for HTTP APIs.
     */
    TimeoutInMillis?: IntegerWithLengthBetween50And30000;
    /**
     * The TLS configuration for a private integration. If you specify a TLS configuration, private integration traffic uses the HTTPS protocol. Supported only for HTTP APIs.
     */
    TlsConfig?: TlsConfig;
  }
  export interface UpdateIntegrationResponseRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * Supported only for WebSocket APIs. Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT, with the following behaviors: CONVERT_TO_BINARY: Converts a response payload from a Base64-encoded string to the corresponding binary blob. CONVERT_TO_TEXT: Converts a response payload from a binary blob to a Base64-encoded string. If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
     */
    ContentHandlingStrategy?: ContentHandlingStrategy;
    /**
     * The integration ID.
     */
    IntegrationId: __string;
    /**
     * The integration response ID.
     */
    IntegrationResponseId: __string;
    /**
     * The integration response key.
     */
    IntegrationResponseKey?: SelectionKey;
    /**
     * A key-value map specifying response parameters that are passed to the method response from the backend. The key is a method response header parameter name and the mapped value is an integration response header value, a static value enclosed within a pair of single quotes, or a JSON expression from the integration response body. The mapping key must match the pattern of method.response.header.{name}
               , where name is a valid and unique header name. The mapped non-static value must match the pattern of integration.response.header.{name}
                or integration.response.body.{JSON-expression}
               , where 
                  {name}
                is a valid and unique response header name and 
                  {JSON-expression}
                is a valid JSON expression without the $ prefix.
     */
    ResponseParameters?: IntegrationParameters;
    /**
     * The collection of response templates for the integration response as a string-to-string map of key-value pairs. Response templates are represented as a key/value map, with a content-type as the key and a template as the value.
     */
    ResponseTemplates?: TemplateMap;
    /**
     * The template selection expression for the integration response. Supported only for WebSocket APIs.
     */
    TemplateSelectionExpression?: SelectionExpression;
  }
  export interface UpdateIntegrationResponseResponse {
    /**
     * Supported only for WebSocket APIs. Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT, with the following behaviors: CONVERT_TO_BINARY: Converts a response payload from a Base64-encoded string to the corresponding binary blob. CONVERT_TO_TEXT: Converts a response payload from a binary blob to a Base64-encoded string. If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
     */
    ContentHandlingStrategy?: ContentHandlingStrategy;
    /**
     * The integration response ID.
     */
    IntegrationResponseId?: Id;
    /**
     * The integration response key.
     */
    IntegrationResponseKey?: SelectionKey;
    /**
     * A key-value map specifying response parameters that are passed to the method response from the backend. The key is a method response header parameter name and the mapped value is an integration response header value, a static value enclosed within a pair of single quotes, or a JSON expression from the integration response body. The mapping key must match the pattern of method.response.header.{name}, where name is a valid and unique header name. The mapped non-static value must match the pattern of integration.response.header.{name} or integration.response.body.{JSON-expression}, where name is a valid and unique response header name and JSON-expression is a valid JSON expression without the $ prefix.
     */
    ResponseParameters?: IntegrationParameters;
    /**
     * The collection of response templates for the integration response as a string-to-string map of key-value pairs. Response templates are represented as a key/value map, with a content-type as the key and a template as the value.
     */
    ResponseTemplates?: TemplateMap;
    /**
     * The template selection expressions for the integration response.
     */
    TemplateSelectionExpression?: SelectionExpression;
  }
  export interface UpdateModelRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The content-type for the model, for example, "application/json".
     */
    ContentType?: StringWithLengthBetween1And256;
    /**
     * The description of the model.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * The model ID.
     */
    ModelId: __string;
    /**
     * The name of the model.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * The schema for the model. For application/json models, this should be JSON schema draft 4 model.
     */
    Schema?: StringWithLengthBetween0And32K;
  }
  export interface UpdateModelResponse {
    /**
     * The content-type for the model, for example, "application/json".
     */
    ContentType?: StringWithLengthBetween1And256;
    /**
     * The description of the model.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * The model identifier.
     */
    ModelId?: Id;
    /**
     * The name of the model. Must be alphanumeric.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * The schema for the model. For application/json models, this should be JSON schema draft 4 model.
     */
    Schema?: StringWithLengthBetween0And32K;
  }
  export interface UpdateRouteRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * Specifies whether an API key is required for the route. Supported only for WebSocket APIs.
     */
    ApiKeyRequired?: __boolean;
    /**
     * The authorization scopes supported by this route.
     */
    AuthorizationScopes?: AuthorizationScopes;
    /**
     * The authorization type for the route. For WebSocket APIs, valid values are NONE for open access, AWS_IAM for using AWS IAM permissions, and CUSTOM for using a Lambda authorizer For HTTP APIs, valid values are NONE for open access, JWT for using JSON Web Tokens, AWS_IAM for using AWS IAM permissions, and CUSTOM for using a Lambda authorizer.
     */
    AuthorizationType?: AuthorizationType;
    /**
     * The identifier of the Authorizer resource to be associated with this route. The authorizer identifier is generated by API Gateway when you created the authorizer.
     */
    AuthorizerId?: Id;
    /**
     * The model selection expression for the route. Supported only for WebSocket APIs.
     */
    ModelSelectionExpression?: SelectionExpression;
    /**
     * The operation name for the route.
     */
    OperationName?: StringWithLengthBetween1And64;
    /**
     * The request models for the route. Supported only for WebSocket APIs.
     */
    RequestModels?: RouteModels;
    /**
     * The request parameters for the route. Supported only for WebSocket APIs.
     */
    RequestParameters?: RouteParameters;
    /**
     * The route ID.
     */
    RouteId: __string;
    /**
     * The route key for the route.
     */
    RouteKey?: SelectionKey;
    /**
     * The route response selection expression for the route. Supported only for WebSocket APIs.
     */
    RouteResponseSelectionExpression?: SelectionExpression;
    /**
     * The target for the route.
     */
    Target?: StringWithLengthBetween1And128;
  }
  export interface UpdateRouteResult {
    /**
     * Specifies whether a route is managed by API Gateway. If you created an API using quick create, the $default route is managed by API Gateway. You can't modify the $default route key.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * Specifies whether an API key is required for this route. Supported only for WebSocket APIs.
     */
    ApiKeyRequired?: __boolean;
    /**
     * A list of authorization scopes configured on a route. The scopes are used with a JWT authorizer to authorize the method invocation. The authorization works by matching the route scopes against the scopes parsed from the access token in the incoming request. The method invocation is authorized if any route scope matches a claimed scope in the access token. Otherwise, the invocation is not authorized. When the route scope is configured, the client must provide an access token instead of an identity token for authorization purposes.
     */
    AuthorizationScopes?: AuthorizationScopes;
    /**
     * The authorization type for the route. For WebSocket APIs, valid values are NONE for open access, AWS_IAM for using AWS IAM permissions, and CUSTOM for using a Lambda authorizer For HTTP APIs, valid values are NONE for open access, JWT for using JSON Web Tokens, AWS_IAM for using AWS IAM permissions, and CUSTOM for using a Lambda authorizer.
     */
    AuthorizationType?: AuthorizationType;
    /**
     * The identifier of the Authorizer resource to be associated with this route. The authorizer identifier is generated by API Gateway when you created the authorizer.
     */
    AuthorizerId?: Id;
    /**
     * The model selection expression for the route. Supported only for WebSocket APIs.
     */
    ModelSelectionExpression?: SelectionExpression;
    /**
     * The operation name for the route.
     */
    OperationName?: StringWithLengthBetween1And64;
    /**
     * The request models for the route. Supported only for WebSocket APIs.
     */
    RequestModels?: RouteModels;
    /**
     * The request parameters for the route. Supported only for WebSocket APIs.
     */
    RequestParameters?: RouteParameters;
    /**
     * The route ID.
     */
    RouteId?: Id;
    /**
     * The route key for the route.
     */
    RouteKey?: SelectionKey;
    /**
     * The route response selection expression for the route. Supported only for WebSocket APIs.
     */
    RouteResponseSelectionExpression?: SelectionExpression;
    /**
     * The target for the route.
     */
    Target?: StringWithLengthBetween1And128;
  }
  export interface UpdateRouteResponseRequest {
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * The model selection expression for the route response. Supported only for WebSocket APIs.
     */
    ModelSelectionExpression?: SelectionExpression;
    /**
     * The response models for the route response.
     */
    ResponseModels?: RouteModels;
    /**
     * The route response parameters.
     */
    ResponseParameters?: RouteParameters;
    /**
     * The route ID.
     */
    RouteId: __string;
    /**
     * The route response ID.
     */
    RouteResponseId: __string;
    /**
     * The route response key.
     */
    RouteResponseKey?: SelectionKey;
  }
  export interface UpdateRouteResponseResponse {
    /**
     * Represents the model selection expression of a route response. Supported only for WebSocket APIs.
     */
    ModelSelectionExpression?: SelectionExpression;
    /**
     * Represents the response models of a route response.
     */
    ResponseModels?: RouteModels;
    /**
     * Represents the response parameters of a route response.
     */
    ResponseParameters?: RouteParameters;
    /**
     * Represents the identifier of a route response.
     */
    RouteResponseId?: Id;
    /**
     * Represents the route response key of a route response.
     */
    RouteResponseKey?: SelectionKey;
  }
  export interface UpdateStageRequest {
    /**
     * Settings for logging access in this stage.
     */
    AccessLogSettings?: AccessLogSettings;
    /**
     * The API identifier.
     */
    ApiId: __string;
    /**
     * Specifies whether updates to an API automatically trigger a new deployment. The default value is false.
     */
    AutoDeploy?: __boolean;
    /**
     * The identifier of a client certificate for a Stage.
     */
    ClientCertificateId?: Id;
    /**
     * The default route settings for the stage.
     */
    DefaultRouteSettings?: RouteSettings;
    /**
     * The deployment identifier for the API stage. Can't be updated if autoDeploy is enabled.
     */
    DeploymentId?: Id;
    /**
     * The description for the API stage.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Route settings for the stage.
     */
    RouteSettings?: RouteSettingsMap;
    /**
     * The stage name. Stage names can contain only alphanumeric characters, hyphens, and underscores, or be $default. Maximum length is 128 characters.
     */
    StageName: __string;
    /**
     * A map that defines the stage variables for a Stage. Variable names can have alphanumeric and underscore characters, and the values must match [A-Za-z0-9-._~:/?#&amp;=,]+.
     */
    StageVariables?: StageVariablesMap;
  }
  export interface UpdateStageResponse {
    /**
     * Settings for logging access in this stage.
     */
    AccessLogSettings?: AccessLogSettings;
    /**
     * Specifies whether a stage is managed by API Gateway. If you created an API using quick create, the $default stage is managed by API Gateway. You can't modify the $default stage.
     */
    ApiGatewayManaged?: __boolean;
    /**
     * Specifies whether updates to an API automatically trigger a new deployment. The default value is false.
     */
    AutoDeploy?: __boolean;
    /**
     * The identifier of a client certificate for a Stage. Supported only for WebSocket APIs.
     */
    ClientCertificateId?: Id;
    /**
     * The timestamp when the stage was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * Default route settings for the stage.
     */
    DefaultRouteSettings?: RouteSettings;
    /**
     * The identifier of the Deployment that the Stage is associated with. Can't be updated if autoDeploy is enabled.
     */
    DeploymentId?: Id;
    /**
     * The description of the stage.
     */
    Description?: StringWithLengthBetween0And1024;
    /**
     * Describes the status of the last deployment of a stage. Supported only for stages with autoDeploy enabled.
     */
    LastDeploymentStatusMessage?: __string;
    /**
     * The timestamp when the stage was last updated.
     */
    LastUpdatedDate?: __timestampIso8601;
    /**
     * Route settings for the stage, by routeKey.
     */
    RouteSettings?: RouteSettingsMap;
    /**
     * The name of the stage.
     */
    StageName?: StringWithLengthBetween1And128;
    /**
     * A map that defines the stage variables for a stage resource. Variable names can have alphanumeric and underscore characters, and the values must match [A-Za-z0-9-._~:/?#&amp;=,]+.
     */
    StageVariables?: StageVariablesMap;
    /**
     * The collection of tags. Each tag element is associated with a given resource.
     */
    Tags?: Tags;
  }
  export interface UpdateVpcLinkRequest {
    /**
     * The name of the VPC link.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * The ID of the VPC link.
     */
    VpcLinkId: __string;
  }
  export interface UpdateVpcLinkResponse {
    /**
     * The timestamp when the VPC link was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The name of the VPC link.
     */
    Name?: StringWithLengthBetween1And128;
    /**
     * A list of security group IDs for the VPC link.
     */
    SecurityGroupIds?: SecurityGroupIdList;
    /**
     * A list of subnet IDs to include in the VPC link.
     */
    SubnetIds?: SubnetIdList;
    /**
     * Tags for the VPC link.
     */
    Tags?: Tags;
    /**
     * The ID of the VPC link.
     */
    VpcLinkId?: Id;
    /**
     * The status of the VPC link.
     */
    VpcLinkStatus?: VpcLinkStatus;
    /**
     * A message summarizing the cause of the status of the VPC link.
     */
    VpcLinkStatusMessage?: StringWithLengthBetween0And1024;
    /**
     * The version of the VPC link.
     */
    VpcLinkVersion?: VpcLinkVersion;
  }
  export type UriWithLengthBetween1And2048 = string;
  export interface VpcLink {
    /**
     * The timestamp when the VPC link was created.
     */
    CreatedDate?: __timestampIso8601;
    /**
     * The name of the VPC link.
     */
    Name: StringWithLengthBetween1And128;
    /**
     * A list of security group IDs for the VPC link.
     */
    SecurityGroupIds: SecurityGroupIdList;
    /**
     * A list of subnet IDs to include in the VPC link.
     */
    SubnetIds: SubnetIdList;
    /**
     * Tags for the VPC link.
     */
    Tags?: Tags;
    /**
     * The ID of the VPC link.
     */
    VpcLinkId: Id;
    /**
     * The status of the VPC link.
     */
    VpcLinkStatus?: VpcLinkStatus;
    /**
     * A message summarizing the cause of the status of the VPC link.
     */
    VpcLinkStatusMessage?: StringWithLengthBetween0And1024;
    /**
     * The version of the VPC link.
     */
    VpcLinkVersion?: VpcLinkVersion;
  }
  export type VpcLinkStatus = "PENDING"|"AVAILABLE"|"DELETING"|"FAILED"|"INACTIVE"|string;
  export type VpcLinkVersion = "V2"|string;
  export type __boolean = boolean;
  export type __double = number;
  export type __integer = number;
  export type __listOfApi = Api[];
  export type __listOfApiMapping = ApiMapping[];
  export type __listOfAuthorizer = Authorizer[];
  export type __listOfDeployment = Deployment[];
  export type __listOfDomainName = DomainName[];
  export type __listOfIntegration = Integration[];
  export type __listOfIntegrationResponse = IntegrationResponse[];
  export type __listOfModel = Model[];
  export type __listOfRoute = Route[];
  export type __listOfRouteResponse = RouteResponse[];
  export type __listOfStage = Stage[];
  export type __listOfVpcLink = VpcLink[];
  export type __listOf__string = __string[];
  export type __string = string;
  export type __timestampIso8601 = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-11-29"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ApiGatewayV2 client.
   */
  export import Types = ApiGatewayV2;
}
export = ApiGatewayV2;
