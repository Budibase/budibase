import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MigrationHubRefactorSpaces extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MigrationHubRefactorSpaces.Types.ClientConfiguration)
  config: Config & MigrationHubRefactorSpaces.Types.ClientConfiguration;
  /**
   * Creates an Amazon Web Services Migration Hub Refactor Spaces application. The account that owns the environment also owns the applications created inside the environment, regardless of the account that creates the application. Refactor Spaces provisions an Amazon API Gateway, API Gateway VPC link, and Network Load Balancer for the application proxy inside your account. In environments created with a CreateEnvironment:NetworkFabricType of NONE you need to configure  VPC to VPC connectivity between your service VPC and the application proxy VPC to route traffic through the application proxy to a service with a private URL endpoint. For more information, see  Create an application in the Refactor Spaces User Guide. 
   */
  createApplication(params: MigrationHubRefactorSpaces.Types.CreateApplicationRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.CreateApplicationResponse) => void): Request<MigrationHubRefactorSpaces.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates an Amazon Web Services Migration Hub Refactor Spaces application. The account that owns the environment also owns the applications created inside the environment, regardless of the account that creates the application. Refactor Spaces provisions an Amazon API Gateway, API Gateway VPC link, and Network Load Balancer for the application proxy inside your account. In environments created with a CreateEnvironment:NetworkFabricType of NONE you need to configure  VPC to VPC connectivity between your service VPC and the application proxy VPC to route traffic through the application proxy to a service with a private URL endpoint. For more information, see  Create an application in the Refactor Spaces User Guide. 
   */
  createApplication(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.CreateApplicationResponse) => void): Request<MigrationHubRefactorSpaces.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates an Amazon Web Services Migration Hub Refactor Spaces environment. The caller owns the environment resource, and all Refactor Spaces applications, services, and routes created within the environment. They are referred to as the environment owner. The environment owner has cross-account visibility and control of Refactor Spaces resources that are added to the environment by other accounts that the environment is shared with. When creating an environment with a CreateEnvironment:NetworkFabricType of TRANSIT_GATEWAY, Refactor Spaces provisions a transit gateway to enable services in VPCs to communicate directly across accounts. If CreateEnvironment:NetworkFabricType is NONE, Refactor Spaces does not create a transit gateway and you must use your network infrastructure to route traffic to services with private URL endpoints.
   */
  createEnvironment(params: MigrationHubRefactorSpaces.Types.CreateEnvironmentRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.CreateEnvironmentResponse) => void): Request<MigrationHubRefactorSpaces.Types.CreateEnvironmentResponse, AWSError>;
  /**
   * Creates an Amazon Web Services Migration Hub Refactor Spaces environment. The caller owns the environment resource, and all Refactor Spaces applications, services, and routes created within the environment. They are referred to as the environment owner. The environment owner has cross-account visibility and control of Refactor Spaces resources that are added to the environment by other accounts that the environment is shared with. When creating an environment with a CreateEnvironment:NetworkFabricType of TRANSIT_GATEWAY, Refactor Spaces provisions a transit gateway to enable services in VPCs to communicate directly across accounts. If CreateEnvironment:NetworkFabricType is NONE, Refactor Spaces does not create a transit gateway and you must use your network infrastructure to route traffic to services with private URL endpoints.
   */
  createEnvironment(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.CreateEnvironmentResponse) => void): Request<MigrationHubRefactorSpaces.Types.CreateEnvironmentResponse, AWSError>;
  /**
   * Creates an Amazon Web Services Migration Hub Refactor Spaces route. The account owner of the service resource is always the environment owner, regardless of which account creates the route. Routes target a service in the application. If an application does not have any routes, then the first route must be created as a DEFAULT RouteType. When created, the default route defaults to an active state so state is not a required input. However, like all other state values the state of the default route can be updated after creation, but only when all other routes are also inactive. Conversely, no route can be active without the default route also being active. When you create a route, Refactor Spaces configures the Amazon API Gateway to send traffic to the target service as follows:    URL Endpoints  If the service has a URL endpoint, and the endpoint resolves to a private IP address, Refactor Spaces routes traffic using the API Gateway VPC link. If a service endpoint resolves to a public IP address, Refactor Spaces routes traffic over the public internet. Services can have HTTP or HTTPS URL endpoints. For HTTPS URLs, publicly-signed certificates are supported. Private Certificate Authorities (CAs) are permitted only if the CA's domain is also publicly resolvable.  Refactor Spaces automatically resolves the public Domain Name System (DNS) names that are set in CreateService:UrlEndpoint when you create a service. The DNS names resolve when the DNS time-to-live (TTL) expires, or every 60 seconds for TTLs less than 60 seconds. This periodic DNS resolution ensures that the route configuration remains up-to-date.    One-time health check  A one-time health check is performed on the service when either the route is updated from inactive to active, or when it is created with an active state. If the health check fails, the route transitions the route state to FAILED, an error code of SERVICE_ENDPOINT_HEALTH_CHECK_FAILURE is provided, and no traffic is sent to the service. For private URLs, a target group is created on the Network Load Balancer and the load balancer target group runs default target health checks. By default, the health check is run against the service endpoint URL. Optionally, the health check can be performed against a different protocol, port, and/or path using the CreateService:UrlEndpoint parameter. All other health check settings for the load balancer use the default values described in the Health checks for your target groups in the Elastic Load Balancing guide. The health check is considered successful if at least one target within the target group transitions to a healthy state.     Lambda function endpoints  If the service has an Lambda function endpoint, then Refactor Spaces configures the Lambda function's resource policy to allow the application's API Gateway to invoke the function. The Lambda function state is checked. If the function is not active, the function configuration is updated so that Lambda resources are provisioned. If the Lambda state is Failed, then the route creation fails. For more information, see the GetFunctionConfiguration's State response parameter in the Lambda Developer Guide. A check is performed to determine that a Lambda function with the specified ARN exists. If it does not exist, the health check fails. For public URLs, a connection is opened to the public endpoint. If the URL is not reachable, the health check fails.     Environments without a network bridge  When you create environments without a network bridge (CreateEnvironment:NetworkFabricType is NONE) and you use your own networking infrastructure, you need to configure VPC to VPC connectivity between your network and the application proxy VPC. Route creation from the application proxy to service endpoints will fail if your network is not configured to connect to the application proxy VPC. For more information, see  Create a route in the Refactor Spaces User Guide. 
   */
  createRoute(params: MigrationHubRefactorSpaces.Types.CreateRouteRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.CreateRouteResponse) => void): Request<MigrationHubRefactorSpaces.Types.CreateRouteResponse, AWSError>;
  /**
   * Creates an Amazon Web Services Migration Hub Refactor Spaces route. The account owner of the service resource is always the environment owner, regardless of which account creates the route. Routes target a service in the application. If an application does not have any routes, then the first route must be created as a DEFAULT RouteType. When created, the default route defaults to an active state so state is not a required input. However, like all other state values the state of the default route can be updated after creation, but only when all other routes are also inactive. Conversely, no route can be active without the default route also being active. When you create a route, Refactor Spaces configures the Amazon API Gateway to send traffic to the target service as follows:    URL Endpoints  If the service has a URL endpoint, and the endpoint resolves to a private IP address, Refactor Spaces routes traffic using the API Gateway VPC link. If a service endpoint resolves to a public IP address, Refactor Spaces routes traffic over the public internet. Services can have HTTP or HTTPS URL endpoints. For HTTPS URLs, publicly-signed certificates are supported. Private Certificate Authorities (CAs) are permitted only if the CA's domain is also publicly resolvable.  Refactor Spaces automatically resolves the public Domain Name System (DNS) names that are set in CreateService:UrlEndpoint when you create a service. The DNS names resolve when the DNS time-to-live (TTL) expires, or every 60 seconds for TTLs less than 60 seconds. This periodic DNS resolution ensures that the route configuration remains up-to-date.    One-time health check  A one-time health check is performed on the service when either the route is updated from inactive to active, or when it is created with an active state. If the health check fails, the route transitions the route state to FAILED, an error code of SERVICE_ENDPOINT_HEALTH_CHECK_FAILURE is provided, and no traffic is sent to the service. For private URLs, a target group is created on the Network Load Balancer and the load balancer target group runs default target health checks. By default, the health check is run against the service endpoint URL. Optionally, the health check can be performed against a different protocol, port, and/or path using the CreateService:UrlEndpoint parameter. All other health check settings for the load balancer use the default values described in the Health checks for your target groups in the Elastic Load Balancing guide. The health check is considered successful if at least one target within the target group transitions to a healthy state.     Lambda function endpoints  If the service has an Lambda function endpoint, then Refactor Spaces configures the Lambda function's resource policy to allow the application's API Gateway to invoke the function. The Lambda function state is checked. If the function is not active, the function configuration is updated so that Lambda resources are provisioned. If the Lambda state is Failed, then the route creation fails. For more information, see the GetFunctionConfiguration's State response parameter in the Lambda Developer Guide. A check is performed to determine that a Lambda function with the specified ARN exists. If it does not exist, the health check fails. For public URLs, a connection is opened to the public endpoint. If the URL is not reachable, the health check fails.     Environments without a network bridge  When you create environments without a network bridge (CreateEnvironment:NetworkFabricType is NONE) and you use your own networking infrastructure, you need to configure VPC to VPC connectivity between your network and the application proxy VPC. Route creation from the application proxy to service endpoints will fail if your network is not configured to connect to the application proxy VPC. For more information, see  Create a route in the Refactor Spaces User Guide. 
   */
  createRoute(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.CreateRouteResponse) => void): Request<MigrationHubRefactorSpaces.Types.CreateRouteResponse, AWSError>;
  /**
   * Creates an Amazon Web Services Migration Hub Refactor Spaces service. The account owner of the service is always the environment owner, regardless of which account in the environment creates the service. Services have either a URL endpoint in a virtual private cloud (VPC), or a Lambda function endpoint.  If an Amazon Web Services resource is launched in a service VPC, and you want it to be accessible to all of an environment’s services with VPCs and routes, apply the RefactorSpacesSecurityGroup to the resource. Alternatively, to add more cross-account constraints, apply your own security group. 
   */
  createService(params: MigrationHubRefactorSpaces.Types.CreateServiceRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.CreateServiceResponse) => void): Request<MigrationHubRefactorSpaces.Types.CreateServiceResponse, AWSError>;
  /**
   * Creates an Amazon Web Services Migration Hub Refactor Spaces service. The account owner of the service is always the environment owner, regardless of which account in the environment creates the service. Services have either a URL endpoint in a virtual private cloud (VPC), or a Lambda function endpoint.  If an Amazon Web Services resource is launched in a service VPC, and you want it to be accessible to all of an environment’s services with VPCs and routes, apply the RefactorSpacesSecurityGroup to the resource. Alternatively, to add more cross-account constraints, apply your own security group. 
   */
  createService(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.CreateServiceResponse) => void): Request<MigrationHubRefactorSpaces.Types.CreateServiceResponse, AWSError>;
  /**
   * Deletes an Amazon Web Services Migration Hub Refactor Spaces application. Before you can delete an application, you must first delete any services or routes within the application.
   */
  deleteApplication(params: MigrationHubRefactorSpaces.Types.DeleteApplicationRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.DeleteApplicationResponse) => void): Request<MigrationHubRefactorSpaces.Types.DeleteApplicationResponse, AWSError>;
  /**
   * Deletes an Amazon Web Services Migration Hub Refactor Spaces application. Before you can delete an application, you must first delete any services or routes within the application.
   */
  deleteApplication(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.DeleteApplicationResponse) => void): Request<MigrationHubRefactorSpaces.Types.DeleteApplicationResponse, AWSError>;
  /**
   * Deletes an Amazon Web Services Migration Hub Refactor Spaces environment. Before you can delete an environment, you must first delete any applications and services within the environment.
   */
  deleteEnvironment(params: MigrationHubRefactorSpaces.Types.DeleteEnvironmentRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.DeleteEnvironmentResponse) => void): Request<MigrationHubRefactorSpaces.Types.DeleteEnvironmentResponse, AWSError>;
  /**
   * Deletes an Amazon Web Services Migration Hub Refactor Spaces environment. Before you can delete an environment, you must first delete any applications and services within the environment.
   */
  deleteEnvironment(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.DeleteEnvironmentResponse) => void): Request<MigrationHubRefactorSpaces.Types.DeleteEnvironmentResponse, AWSError>;
  /**
   * Deletes the resource policy set for the environment. 
   */
  deleteResourcePolicy(params: MigrationHubRefactorSpaces.Types.DeleteResourcePolicyRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.DeleteResourcePolicyResponse) => void): Request<MigrationHubRefactorSpaces.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes the resource policy set for the environment. 
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.DeleteResourcePolicyResponse) => void): Request<MigrationHubRefactorSpaces.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes an Amazon Web Services Migration Hub Refactor Spaces route.
   */
  deleteRoute(params: MigrationHubRefactorSpaces.Types.DeleteRouteRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.DeleteRouteResponse) => void): Request<MigrationHubRefactorSpaces.Types.DeleteRouteResponse, AWSError>;
  /**
   * Deletes an Amazon Web Services Migration Hub Refactor Spaces route.
   */
  deleteRoute(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.DeleteRouteResponse) => void): Request<MigrationHubRefactorSpaces.Types.DeleteRouteResponse, AWSError>;
  /**
   * Deletes an Amazon Web Services Migration Hub Refactor Spaces service. 
   */
  deleteService(params: MigrationHubRefactorSpaces.Types.DeleteServiceRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.DeleteServiceResponse) => void): Request<MigrationHubRefactorSpaces.Types.DeleteServiceResponse, AWSError>;
  /**
   * Deletes an Amazon Web Services Migration Hub Refactor Spaces service. 
   */
  deleteService(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.DeleteServiceResponse) => void): Request<MigrationHubRefactorSpaces.Types.DeleteServiceResponse, AWSError>;
  /**
   * Gets an Amazon Web Services Migration Hub Refactor Spaces application.
   */
  getApplication(params: MigrationHubRefactorSpaces.Types.GetApplicationRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.GetApplicationResponse) => void): Request<MigrationHubRefactorSpaces.Types.GetApplicationResponse, AWSError>;
  /**
   * Gets an Amazon Web Services Migration Hub Refactor Spaces application.
   */
  getApplication(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.GetApplicationResponse) => void): Request<MigrationHubRefactorSpaces.Types.GetApplicationResponse, AWSError>;
  /**
   * Gets an Amazon Web Services Migration Hub Refactor Spaces environment.
   */
  getEnvironment(params: MigrationHubRefactorSpaces.Types.GetEnvironmentRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.GetEnvironmentResponse) => void): Request<MigrationHubRefactorSpaces.Types.GetEnvironmentResponse, AWSError>;
  /**
   * Gets an Amazon Web Services Migration Hub Refactor Spaces environment.
   */
  getEnvironment(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.GetEnvironmentResponse) => void): Request<MigrationHubRefactorSpaces.Types.GetEnvironmentResponse, AWSError>;
  /**
   * Gets the resource-based permission policy that is set for the given environment. 
   */
  getResourcePolicy(params: MigrationHubRefactorSpaces.Types.GetResourcePolicyRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.GetResourcePolicyResponse) => void): Request<MigrationHubRefactorSpaces.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Gets the resource-based permission policy that is set for the given environment. 
   */
  getResourcePolicy(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.GetResourcePolicyResponse) => void): Request<MigrationHubRefactorSpaces.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Gets an Amazon Web Services Migration Hub Refactor Spaces route.
   */
  getRoute(params: MigrationHubRefactorSpaces.Types.GetRouteRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.GetRouteResponse) => void): Request<MigrationHubRefactorSpaces.Types.GetRouteResponse, AWSError>;
  /**
   * Gets an Amazon Web Services Migration Hub Refactor Spaces route.
   */
  getRoute(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.GetRouteResponse) => void): Request<MigrationHubRefactorSpaces.Types.GetRouteResponse, AWSError>;
  /**
   * Gets an Amazon Web Services Migration Hub Refactor Spaces service. 
   */
  getService(params: MigrationHubRefactorSpaces.Types.GetServiceRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.GetServiceResponse) => void): Request<MigrationHubRefactorSpaces.Types.GetServiceResponse, AWSError>;
  /**
   * Gets an Amazon Web Services Migration Hub Refactor Spaces service. 
   */
  getService(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.GetServiceResponse) => void): Request<MigrationHubRefactorSpaces.Types.GetServiceResponse, AWSError>;
  /**
   * Lists all the Amazon Web Services Migration Hub Refactor Spaces applications within an environment. 
   */
  listApplications(params: MigrationHubRefactorSpaces.Types.ListApplicationsRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.ListApplicationsResponse) => void): Request<MigrationHubRefactorSpaces.Types.ListApplicationsResponse, AWSError>;
  /**
   * Lists all the Amazon Web Services Migration Hub Refactor Spaces applications within an environment. 
   */
  listApplications(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.ListApplicationsResponse) => void): Request<MigrationHubRefactorSpaces.Types.ListApplicationsResponse, AWSError>;
  /**
   * Lists all Amazon Web Services Migration Hub Refactor Spaces service virtual private clouds (VPCs) that are part of the environment. 
   */
  listEnvironmentVpcs(params: MigrationHubRefactorSpaces.Types.ListEnvironmentVpcsRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.ListEnvironmentVpcsResponse) => void): Request<MigrationHubRefactorSpaces.Types.ListEnvironmentVpcsResponse, AWSError>;
  /**
   * Lists all Amazon Web Services Migration Hub Refactor Spaces service virtual private clouds (VPCs) that are part of the environment. 
   */
  listEnvironmentVpcs(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.ListEnvironmentVpcsResponse) => void): Request<MigrationHubRefactorSpaces.Types.ListEnvironmentVpcsResponse, AWSError>;
  /**
   * Lists Amazon Web Services Migration Hub Refactor Spaces environments owned by a caller account or shared with the caller account. 
   */
  listEnvironments(params: MigrationHubRefactorSpaces.Types.ListEnvironmentsRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.ListEnvironmentsResponse) => void): Request<MigrationHubRefactorSpaces.Types.ListEnvironmentsResponse, AWSError>;
  /**
   * Lists Amazon Web Services Migration Hub Refactor Spaces environments owned by a caller account or shared with the caller account. 
   */
  listEnvironments(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.ListEnvironmentsResponse) => void): Request<MigrationHubRefactorSpaces.Types.ListEnvironmentsResponse, AWSError>;
  /**
   * Lists all the Amazon Web Services Migration Hub Refactor Spaces routes within an application. 
   */
  listRoutes(params: MigrationHubRefactorSpaces.Types.ListRoutesRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.ListRoutesResponse) => void): Request<MigrationHubRefactorSpaces.Types.ListRoutesResponse, AWSError>;
  /**
   * Lists all the Amazon Web Services Migration Hub Refactor Spaces routes within an application. 
   */
  listRoutes(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.ListRoutesResponse) => void): Request<MigrationHubRefactorSpaces.Types.ListRoutesResponse, AWSError>;
  /**
   * Lists all the Amazon Web Services Migration Hub Refactor Spaces services within an application. 
   */
  listServices(params: MigrationHubRefactorSpaces.Types.ListServicesRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.ListServicesResponse) => void): Request<MigrationHubRefactorSpaces.Types.ListServicesResponse, AWSError>;
  /**
   * Lists all the Amazon Web Services Migration Hub Refactor Spaces services within an application. 
   */
  listServices(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.ListServicesResponse) => void): Request<MigrationHubRefactorSpaces.Types.ListServicesResponse, AWSError>;
  /**
   * Lists the tags of a resource. The caller account must be the same as the resource’s OwnerAccountId. Listing tags in other accounts is not supported. 
   */
  listTagsForResource(params: MigrationHubRefactorSpaces.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.ListTagsForResourceResponse) => void): Request<MigrationHubRefactorSpaces.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags of a resource. The caller account must be the same as the resource’s OwnerAccountId. Listing tags in other accounts is not supported. 
   */
  listTagsForResource(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.ListTagsForResourceResponse) => void): Request<MigrationHubRefactorSpaces.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Attaches a resource-based permission policy to the Amazon Web Services Migration Hub Refactor Spaces environment. The policy must contain the same actions and condition statements as the arn:aws:ram::aws:permission/AWSRAMDefaultPermissionRefactorSpacesEnvironment permission in Resource Access Manager. The policy must not contain new lines or blank lines. 
   */
  putResourcePolicy(params: MigrationHubRefactorSpaces.Types.PutResourcePolicyRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.PutResourcePolicyResponse) => void): Request<MigrationHubRefactorSpaces.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Attaches a resource-based permission policy to the Amazon Web Services Migration Hub Refactor Spaces environment. The policy must contain the same actions and condition statements as the arn:aws:ram::aws:permission/AWSRAMDefaultPermissionRefactorSpacesEnvironment permission in Resource Access Manager. The policy must not contain new lines or blank lines. 
   */
  putResourcePolicy(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.PutResourcePolicyResponse) => void): Request<MigrationHubRefactorSpaces.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Removes the tags of a given resource. Tags are metadata which can be used to manage a resource. To tag a resource, the caller account must be the same as the resource’s OwnerAccountId. Tagging resources in other accounts is not supported.  Amazon Web Services Migration Hub Refactor Spaces does not propagate tags to orchestrated resources, such as an environment’s transit gateway. 
   */
  tagResource(params: MigrationHubRefactorSpaces.Types.TagResourceRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.TagResourceResponse) => void): Request<MigrationHubRefactorSpaces.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the tags of a given resource. Tags are metadata which can be used to manage a resource. To tag a resource, the caller account must be the same as the resource’s OwnerAccountId. Tagging resources in other accounts is not supported.  Amazon Web Services Migration Hub Refactor Spaces does not propagate tags to orchestrated resources, such as an environment’s transit gateway. 
   */
  tagResource(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.TagResourceResponse) => void): Request<MigrationHubRefactorSpaces.Types.TagResourceResponse, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata which can be used to manage a resource. To untag a resource, the caller account must be the same as the resource’s OwnerAccountId. Untagging resources across accounts is not supported. 
   */
  untagResource(params: MigrationHubRefactorSpaces.Types.UntagResourceRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.UntagResourceResponse) => void): Request<MigrationHubRefactorSpaces.Types.UntagResourceResponse, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata which can be used to manage a resource. To untag a resource, the caller account must be the same as the resource’s OwnerAccountId. Untagging resources across accounts is not supported. 
   */
  untagResource(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.UntagResourceResponse) => void): Request<MigrationHubRefactorSpaces.Types.UntagResourceResponse, AWSError>;
  /**
   *  Updates an Amazon Web Services Migration Hub Refactor Spaces route. 
   */
  updateRoute(params: MigrationHubRefactorSpaces.Types.UpdateRouteRequest, callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.UpdateRouteResponse) => void): Request<MigrationHubRefactorSpaces.Types.UpdateRouteResponse, AWSError>;
  /**
   *  Updates an Amazon Web Services Migration Hub Refactor Spaces route. 
   */
  updateRoute(callback?: (err: AWSError, data: MigrationHubRefactorSpaces.Types.UpdateRouteResponse) => void): Request<MigrationHubRefactorSpaces.Types.UpdateRouteResponse, AWSError>;
}
declare namespace MigrationHubRefactorSpaces {
  export type AccountId = string;
  export type AdditionalDetails = {[key: string]: AdditionalDetailsValue};
  export type AdditionalDetailsKey = string;
  export type AdditionalDetailsValue = string;
  export type ApiGatewayEndpointType = "REGIONAL"|"PRIVATE"|string;
  export type ApiGatewayId = string;
  export interface ApiGatewayProxyConfig {
    /**
     * The resource ID of the API Gateway for the proxy. 
     */
    ApiGatewayId?: ApiGatewayId;
    /**
     * The type of API Gateway endpoint created. 
     */
    EndpointType?: ApiGatewayEndpointType;
    /**
     * The Amazon Resource Name (ARN) of the Network Load Balancer configured by the API Gateway proxy. 
     */
    NlbArn?: NlbArn;
    /**
     * The name of the Network Load Balancer that is configured by the API Gateway proxy. 
     */
    NlbName?: NlbName;
    /**
     * The endpoint URL of the API Gateway proxy. 
     */
    ProxyUrl?: Uri;
    /**
     * The name of the API Gateway stage. The name defaults to prod. 
     */
    StageName?: StageName;
    /**
     * The VpcLink ID of the API Gateway proxy. 
     */
    VpcLinkId?: VpcLinkId;
  }
  export interface ApiGatewayProxyInput {
    /**
     * The type of endpoint to use for the API Gateway proxy. If no value is specified in the request, the value is set to REGIONAL by default. If the value is set to PRIVATE in the request, this creates a private API endpoint that is isolated from the public internet. The private endpoint can only be accessed by using Amazon Virtual Private Cloud (Amazon VPC) interface endpoints for the Amazon API Gateway that has been granted access. For more information about creating a private connection with Refactor Spaces and interface endpoint (Amazon Web Services PrivateLink) availability, see Access Refactor Spaces using an interface endpoint (Amazon Web Services PrivateLink).
     */
    EndpointType?: ApiGatewayEndpointType;
    /**
     * The name of the API Gateway stage. The name defaults to prod. 
     */
    StageName?: StageName;
  }
  export interface ApiGatewayProxySummary {
    /**
     * The resource ID of the API Gateway for the proxy. 
     */
    ApiGatewayId?: ApiGatewayId;
    /**
     * The type of API Gateway endpoint created. 
     */
    EndpointType?: ApiGatewayEndpointType;
    /**
     * The Amazon Resource Name (ARN) of the Network Load Balancer configured by the API Gateway proxy. 
     */
    NlbArn?: NlbArn;
    /**
     * The name of the Network Load Balancer that is configured by the API Gateway proxy. 
     */
    NlbName?: NlbName;
    /**
     * The endpoint URL of the API Gateway proxy. 
     */
    ProxyUrl?: Uri;
    /**
     * The name of the API Gateway stage. The name defaults to prod. 
     */
    StageName?: StageName;
    /**
     * The VpcLink ID of the API Gateway proxy. 
     */
    VpcLinkId?: VpcLinkId;
  }
  export type ApplicationId = string;
  export type ApplicationName = string;
  export type ApplicationState = "CREATING"|"ACTIVE"|"DELETING"|"FAILED"|"UPDATING"|string;
  export type ApplicationSummaries = ApplicationSummary[];
  export interface ApplicationSummary {
    /**
     * The endpoint URL of the Amazon API Gateway proxy. 
     */
    ApiGatewayProxy?: ApiGatewayProxySummary;
    /**
     * The unique identifier of the application. 
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the application. 
     */
    Arn?: ResourceArn;
    /**
     * The Amazon Web Services account ID of the application creator. 
     */
    CreatedByAccountId?: AccountId;
    /**
     * A timestamp that indicates when the application is created. 
     */
    CreatedTime?: Timestamp;
    /**
     * The unique identifier of the environment. 
     */
    EnvironmentId?: EnvironmentId;
    /**
     * Any error associated with the application resource. 
     */
    Error?: ErrorResponse;
    /**
     * A timestamp that indicates when the application was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The name of the application. 
     */
    Name?: ApplicationName;
    /**
     * The Amazon Web Services account ID of the application owner (which is always the same as the environment owner account ID).
     */
    OwnerAccountId?: AccountId;
    /**
     * The proxy type of the proxy created within the application. 
     */
    ProxyType?: ProxyType;
    /**
     * The current state of the application. 
     */
    State?: ApplicationState;
    /**
     * The tags assigned to the application. 
     */
    Tags?: TagMap;
    /**
     * The ID of the virtual private cloud (VPC). 
     */
    VpcId?: VpcId;
  }
  export type Boolean = boolean;
  export type CidrBlock = string;
  export type CidrBlocks = CidrBlock[];
  export type ClientToken = string;
  export interface CreateApplicationRequest {
    /**
     * A wrapper object holding the API Gateway endpoint type and stage name for the proxy. 
     */
    ApiGatewayProxy?: ApiGatewayProxyInput;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken?: ClientToken;
    /**
     * The unique identifier of the environment.
     */
    EnvironmentIdentifier: EnvironmentId;
    /**
     * The name to use for the application. 
     */
    Name: ApplicationName;
    /**
     * The proxy type of the proxy created within the application. 
     */
    ProxyType: ProxyType;
    /**
     * The tags to assign to the application. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key-value pair.
     */
    Tags?: TagMap;
    /**
     * The ID of the virtual private cloud (VPC).
     */
    VpcId: VpcId;
  }
  export interface CreateApplicationResponse {
    /**
     * A wrapper object holding the API Gateway endpoint type and stage name for the proxy. 
     */
    ApiGatewayProxy?: ApiGatewayProxyInput;
    /**
     * The unique identifier of the application.
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is arn:aws:refactor-spaces:region:account-id:resource-type/resource-id . For more information about ARNs, see  Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ResourceArn;
    /**
     * The Amazon Web Services account ID of application creator.
     */
    CreatedByAccountId?: AccountId;
    /**
     * A timestamp that indicates when the application is created.
     */
    CreatedTime?: Timestamp;
    /**
     * The ID of the environment in which the application is created.
     */
    EnvironmentId?: EnvironmentId;
    /**
     * A timestamp that indicates when the application was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The name of the application.
     */
    Name?: ApplicationName;
    /**
     * The Amazon Web Services account ID of the application owner (which is always the same as the environment owner account ID).
     */
    OwnerAccountId?: AccountId;
    /**
     * The proxy type of the proxy created within the application. 
     */
    ProxyType?: ProxyType;
    /**
     * The current state of the application. 
     */
    State?: ApplicationState;
    /**
     * The tags assigned to the application. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key-value pair. 
     */
    Tags?: TagMap;
    /**
     * The ID of the Amazon VPC. 
     */
    VpcId?: VpcId;
  }
  export interface CreateEnvironmentRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken?: ClientToken;
    /**
     * The description of the environment.
     */
    Description?: Description;
    /**
     * The name of the environment.
     */
    Name: EnvironmentName;
    /**
     * The network fabric type of the environment.
     */
    NetworkFabricType: NetworkFabricType;
    /**
     * The tags to assign to the environment. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key-value pair.
     */
    Tags?: TagMap;
  }
  export interface CreateEnvironmentResponse {
    /**
     * The Amazon Resource Name (ARN) of the environment.
     */
    Arn?: ResourceArn;
    /**
     * A timestamp that indicates when the environment is created.
     */
    CreatedTime?: Timestamp;
    /**
     * A description of the environment.
     */
    Description?: Description;
    /**
     * The unique identifier of the environment.
     */
    EnvironmentId?: EnvironmentId;
    /**
     * A timestamp that indicates when the environment was last updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The name of the environment.
     */
    Name?: EnvironmentName;
    /**
     * The network fabric type of the environment.
     */
    NetworkFabricType?: NetworkFabricType;
    /**
     * The Amazon Web Services account ID of environment owner.
     */
    OwnerAccountId?: AccountId;
    /**
     * The current state of the environment. 
     */
    State?: EnvironmentState;
    /**
     * The tags assigned to the created environment. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key-value pair..
     */
    Tags?: TagMap;
  }
  export interface CreateRouteRequest {
    /**
     * The ID of the application within which the route is being created.
     */
    ApplicationIdentifier: ApplicationId;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken?: ClientToken;
    /**
     *  Configuration for the default route type. 
     */
    DefaultRoute?: DefaultRouteInput;
    /**
     * The ID of the environment in which the route is created.
     */
    EnvironmentIdentifier: EnvironmentId;
    /**
     * The route type of the route. DEFAULT indicates that all traffic that does not match another route is forwarded to the default route. Applications must have a default route before any other routes can be created. URI_PATH indicates a route that is based on a URI path.
     */
    RouteType: RouteType;
    /**
     * The ID of the service in which the route is created. Traffic that matches this route is forwarded to this service.
     */
    ServiceIdentifier: ServiceId;
    /**
     * The tags to assign to the route. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key-value pair.. 
     */
    Tags?: TagMap;
    /**
     * The configuration for the URI path route type. 
     */
    UriPathRoute?: UriPathRouteInput;
  }
  export interface CreateRouteResponse {
    /**
     * The ID of the application in which the route is created.
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the route. The format for this ARN is arn:aws:refactor-spaces:region:account-id:resource-type/resource-id . For more information about ARNs, see  Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ResourceArn;
    /**
     * The Amazon Web Services account ID of the route creator.
     */
    CreatedByAccountId?: AccountId;
    /**
     * A timestamp that indicates when the route is created.
     */
    CreatedTime?: Timestamp;
    /**
     * A timestamp that indicates when the route was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The Amazon Web Services account ID of the route owner.
     */
    OwnerAccountId?: AccountId;
    /**
     * The unique identifier of the route.
     */
    RouteId?: RouteId;
    /**
     * The route type of the route.
     */
    RouteType?: RouteType;
    /**
     * The ID of service in which the route is created. Traffic that matches this route is forwarded to this service.
     */
    ServiceId?: ServiceId;
    /**
     * The current state of the route. Activation state only allows ACTIVE or INACTIVE as user inputs. FAILED is a route state that is system generated.
     */
    State?: RouteState;
    /**
     * The tags assigned to the created route. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key-value pair. 
     */
    Tags?: TagMap;
    /**
     * Configuration for the URI path route type. 
     */
    UriPathRoute?: UriPathRouteInput;
  }
  export interface CreateServiceRequest {
    /**
     * The ID of the application which the service is created.
     */
    ApplicationIdentifier: ApplicationId;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken?: ClientToken;
    /**
     * The description of the service.
     */
    Description?: Description;
    /**
     * The type of endpoint to use for the service. The type can be a URL in a VPC or an Lambda function.
     */
    EndpointType: ServiceEndpointType;
    /**
     * The ID of the environment in which the service is created.
     */
    EnvironmentIdentifier: EnvironmentId;
    /**
     * The configuration for the Lambda endpoint type.
     */
    LambdaEndpoint?: LambdaEndpointInput;
    /**
     * The name of the service.
     */
    Name: ServiceName;
    /**
     * The tags to assign to the service. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key-value pair.. 
     */
    Tags?: TagMap;
    /**
     * The configuration for the URL endpoint type. When creating a route to a service, Refactor Spaces automatically resolves the address in the UrlEndpointInput object URL when the Domain Name System (DNS) time-to-live (TTL) expires, or every 60 seconds for TTLs less than 60 seconds.
     */
    UrlEndpoint?: UrlEndpointInput;
    /**
     * The ID of the VPC.
     */
    VpcId?: VpcId;
  }
  export interface CreateServiceResponse {
    /**
     * The ID of the application that the created service belongs to. 
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    Arn?: ResourceArn;
    /**
     * The Amazon Web Services account ID of the service creator.
     */
    CreatedByAccountId?: AccountId;
    /**
     * A timestamp that indicates when the service is created.
     */
    CreatedTime?: Timestamp;
    /**
     * The description of the created service.
     */
    Description?: Description;
    /**
     * The endpoint type of the service.
     */
    EndpointType?: ServiceEndpointType;
    /**
     * The unique identifier of the environment.
     */
    EnvironmentId?: EnvironmentId;
    /**
     * The configuration for the Lambda endpoint type.
     */
    LambdaEndpoint?: LambdaEndpointInput;
    /**
     * A timestamp that indicates when the service was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The name of the service.
     */
    Name?: ServiceName;
    /**
     * The Amazon Web Services account ID of the service owner.
     */
    OwnerAccountId?: AccountId;
    /**
     * The unique identifier of the service.
     */
    ServiceId?: ServiceId;
    /**
     * The current state of the service. 
     */
    State?: ServiceState;
    /**
     * The tags assigned to the created service. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key-value pair.. 
     */
    Tags?: TagMap;
    /**
     * The configuration for the URL endpoint type. 
     */
    UrlEndpoint?: UrlEndpointInput;
    /**
     * The ID of the VPC. 
     */
    VpcId?: VpcId;
  }
  export interface DefaultRouteInput {
    /**
     * If set to ACTIVE, traffic is forwarded to this route’s service after the route is created. 
     */
    ActivationState?: RouteActivationState;
  }
  export interface DeleteApplicationRequest {
    /**
     * The ID of the application.
     */
    ApplicationIdentifier: ApplicationId;
    /**
     * The ID of the environment. 
     */
    EnvironmentIdentifier: EnvironmentId;
  }
  export interface DeleteApplicationResponse {
    /**
     * The ID of the application.
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    Arn?: ResourceArn;
    /**
     * The unique identifier of the application’s environment.
     */
    EnvironmentId?: EnvironmentId;
    /**
     * A timestamp that indicates when the environment was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The name of the application.
     */
    Name?: ApplicationName;
    /**
     * The current state of the application. 
     */
    State?: ApplicationState;
  }
  export interface DeleteEnvironmentRequest {
    /**
     * The ID of the environment. 
     */
    EnvironmentIdentifier: EnvironmentId;
  }
  export interface DeleteEnvironmentResponse {
    /**
     * The Amazon Resource Name (ARN) of the environment.
     */
    Arn?: ResourceArn;
    /**
     * The unique identifier of the environment.
     */
    EnvironmentId?: EnvironmentId;
    /**
     * A timestamp that indicates when the environment was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The name of the environment.
     */
    Name?: EnvironmentName;
    /**
     * The current state of the environment. 
     */
    State?: EnvironmentState;
  }
  export interface DeleteResourcePolicyRequest {
    /**
     * Amazon Resource Name (ARN) of the resource associated with the policy. 
     */
    Identifier: ResourcePolicyIdentifier;
  }
  export interface DeleteResourcePolicyResponse {
  }
  export interface DeleteRouteRequest {
    /**
     * The ID of the application to delete the route from.
     */
    ApplicationIdentifier: ApplicationId;
    /**
     * The ID of the environment to delete the route from.
     */
    EnvironmentIdentifier: EnvironmentId;
    /**
     * The ID of the route to delete.
     */
    RouteIdentifier: RouteId;
  }
  export interface DeleteRouteResponse {
    /**
     * The ID of the application that the route belongs to.
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the route.
     */
    Arn?: ResourceArn;
    /**
     * A timestamp that indicates when the route was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The ID of the route to delete.
     */
    RouteId?: RouteId;
    /**
     * The ID of the service that the route belongs to.
     */
    ServiceId?: ServiceId;
    /**
     * The current state of the route. 
     */
    State?: RouteState;
  }
  export interface DeleteServiceRequest {
    /**
     * Deletes a Refactor Spaces service.  The RefactorSpacesSecurityGroup security group must be removed from all Amazon Web Services resources in the virtual private cloud (VPC) prior to deleting a service with a URL endpoint in a VPC. 
     */
    ApplicationIdentifier: ApplicationId;
    /**
     * The ID of the environment that the service is in.
     */
    EnvironmentIdentifier: EnvironmentId;
    /**
     * The ID of the service to delete.
     */
    ServiceIdentifier: ServiceId;
  }
  export interface DeleteServiceResponse {
    /**
     * The ID of the application that the service is in.
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    Arn?: ResourceArn;
    /**
     * The unique identifier of the environment.
     */
    EnvironmentId?: EnvironmentId;
    /**
     * A timestamp that indicates when the service was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The name of the service.
     */
    Name?: ServiceName;
    /**
     * The unique identifier of the service.
     */
    ServiceId?: ServiceId;
    /**
     * The current state of the service. 
     */
    State?: ServiceState;
  }
  export type Description = string;
  export type Ec2TagValue = string;
  export type EnvironmentId = string;
  export type EnvironmentName = string;
  export type EnvironmentState = "CREATING"|"ACTIVE"|"DELETING"|"FAILED"|string;
  export type EnvironmentSummaries = EnvironmentSummary[];
  export interface EnvironmentSummary {
    /**
     * The Amazon Resource Name (ARN) of the environment. 
     */
    Arn?: ResourceArn;
    /**
     * A timestamp that indicates when the environment is created. 
     */
    CreatedTime?: Timestamp;
    /**
     * A description of the environment. 
     */
    Description?: Description;
    /**
     * The unique identifier of the environment. 
     */
    EnvironmentId?: EnvironmentId;
    /**
     * Any error associated with the environment resource. 
     */
    Error?: ErrorResponse;
    /**
     * A timestamp that indicates when the environment was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The name of the environment. 
     */
    Name?: EnvironmentName;
    /**
     * The network fabric type of the environment. 
     */
    NetworkFabricType?: NetworkFabricType;
    /**
     * The Amazon Web Services account ID of the environment owner.
     */
    OwnerAccountId?: AccountId;
    /**
     * The current state of the environment. 
     */
    State?: EnvironmentState;
    /**
     * The tags assigned to the environment. 
     */
    Tags?: TagMap;
    /**
     * The ID of the Transit Gateway set up by the environment. 
     */
    TransitGatewayId?: TransitGatewayId;
  }
  export interface EnvironmentVpc {
    /**
     * The Amazon Web Services account ID of the virtual private cloud (VPC) owner. 
     */
    AccountId?: AccountId;
    /**
     * The list of Amazon Virtual Private Cloud (Amazon VPC) CIDR blocks. 
     */
    CidrBlocks?: CidrBlocks;
    /**
     * A timestamp that indicates when the VPC is first added to the environment. 
     */
    CreatedTime?: Timestamp;
    /**
     * The unique identifier of the environment. 
     */
    EnvironmentId?: EnvironmentId;
    /**
     * A timestamp that indicates when the VPC was last updated by the environment. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The ID of the VPC. 
     */
    VpcId?: VpcId;
    /**
     * The name of the VPC at the time it is added to the environment. 
     */
    VpcName?: Ec2TagValue;
  }
  export type EnvironmentVpcs = EnvironmentVpc[];
  export type ErrorCode = "INVALID_RESOURCE_STATE"|"RESOURCE_LIMIT_EXCEEDED"|"RESOURCE_CREATION_FAILURE"|"RESOURCE_UPDATE_FAILURE"|"SERVICE_ENDPOINT_HEALTH_CHECK_FAILURE"|"RESOURCE_DELETION_FAILURE"|"RESOURCE_RETRIEVAL_FAILURE"|"RESOURCE_IN_USE"|"RESOURCE_NOT_FOUND"|"STATE_TRANSITION_FAILURE"|"REQUEST_LIMIT_EXCEEDED"|"NOT_AUTHORIZED"|string;
  export type ErrorMessage = string;
  export type ErrorResourceType = "ENVIRONMENT"|"APPLICATION"|"ROUTE"|"SERVICE"|"TRANSIT_GATEWAY"|"TRANSIT_GATEWAY_ATTACHMENT"|"API_GATEWAY"|"NLB"|"TARGET_GROUP"|"LOAD_BALANCER_LISTENER"|"VPC_LINK"|"LAMBDA"|"VPC"|"SUBNET"|"ROUTE_TABLE"|"SECURITY_GROUP"|"VPC_ENDPOINT_SERVICE_CONFIGURATION"|"RESOURCE_SHARE"|"IAM_ROLE"|string;
  export interface ErrorResponse {
    /**
     * The Amazon Web Services account ID of the resource owner. 
     */
    AccountId?: AccountId;
    /**
     * Additional details about the error. 
     */
    AdditionalDetails?: AdditionalDetails;
    /**
     * The error code associated with the error. 
     */
    Code?: ErrorCode;
    /**
     * The message associated with the error. 
     */
    Message?: ErrorMessage;
    /**
     * The ID of the resource. 
     */
    ResourceIdentifier?: ResourceIdentifier;
    /**
     * The type of resource. 
     */
    ResourceType?: ErrorResourceType;
  }
  export interface GetApplicationRequest {
    /**
     * The ID of the application.
     */
    ApplicationIdentifier: ApplicationId;
    /**
     * The ID of the environment. 
     */
    EnvironmentIdentifier: EnvironmentId;
  }
  export interface GetApplicationResponse {
    /**
     * The endpoint URL of the API Gateway proxy. 
     */
    ApiGatewayProxy?: ApiGatewayProxyConfig;
    /**
     * The unique identifier of the application.
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    Arn?: ResourceArn;
    /**
     * The Amazon Web Services account ID of the application creator. 
     */
    CreatedByAccountId?: AccountId;
    /**
     * A timestamp that indicates when the application is created. 
     */
    CreatedTime?: Timestamp;
    /**
     * The unique identifier of the environment.
     */
    EnvironmentId?: EnvironmentId;
    /**
     * Any error associated with the application resource. 
     */
    Error?: ErrorResponse;
    /**
     * A timestamp that indicates when the application was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The name of the application.
     */
    Name?: ApplicationName;
    /**
     * The Amazon Web Services account ID of the application owner (which is always the same as the environment owner account ID).
     */
    OwnerAccountId?: AccountId;
    /**
     * The proxy type of the proxy created within the application. 
     */
    ProxyType?: ProxyType;
    /**
     * The current state of the application. 
     */
    State?: ApplicationState;
    /**
     * The tags assigned to the application. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key-value pair. 
     */
    Tags?: TagMap;
    /**
     * The ID of the virtual private cloud (VPC). 
     */
    VpcId?: VpcId;
  }
  export interface GetEnvironmentRequest {
    /**
     * The ID of the environment.
     */
    EnvironmentIdentifier: EnvironmentId;
  }
  export interface GetEnvironmentResponse {
    /**
     * The Amazon Resource Name (ARN) of the environment.
     */
    Arn?: ResourceArn;
    /**
     * A timestamp that indicates when the environment is created. 
     */
    CreatedTime?: Timestamp;
    /**
     * The description of the environment. 
     */
    Description?: Description;
    /**
     * The unique identifier of the environment. 
     */
    EnvironmentId?: EnvironmentId;
    /**
     * Any error associated with the environment resource. 
     */
    Error?: ErrorResponse;
    /**
     * A timestamp that indicates when the environment was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The name of the environment.
     */
    Name?: EnvironmentName;
    /**
     * The network fabric type of the environment. 
     */
    NetworkFabricType?: NetworkFabricType;
    /**
     * The Amazon Web Services account ID of the environment owner.
     */
    OwnerAccountId?: AccountId;
    /**
     * The current state of the environment. 
     */
    State?: EnvironmentState;
    /**
     * The tags to assign to the environment. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key-value pair. 
     */
    Tags?: TagMap;
    /**
     * The ID of the Transit Gateway set up by the environment, if applicable.
     */
    TransitGatewayId?: TransitGatewayId;
  }
  export interface GetResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource associated with the policy. 
     */
    Identifier: ResourcePolicyIdentifier;
  }
  export interface GetResourcePolicyResponse {
    /**
     * A JSON-formatted string for an Amazon Web Services resource-based policy. 
     */
    Policy?: PolicyString;
  }
  export interface GetRouteRequest {
    /**
     * The ID of the application. 
     */
    ApplicationIdentifier: ApplicationId;
    /**
     * The ID of the environment.
     */
    EnvironmentIdentifier: EnvironmentId;
    /**
     * The ID of the route.
     */
    RouteIdentifier: RouteId;
  }
  export interface GetRouteResponse {
    /**
     * If set to true, this option appends the source path to the service URL endpoint.
     */
    AppendSourcePath?: Boolean;
    /**
     * The ID of the application that the route belongs to. 
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the route.
     */
    Arn?: ResourceArn;
    /**
     * The Amazon Web Services account ID of the route creator.
     */
    CreatedByAccountId?: AccountId;
    /**
     * The timestamp of when the route is created. 
     */
    CreatedTime?: Timestamp;
    /**
     * Unique identifier of the environment.
     */
    EnvironmentId?: EnvironmentId;
    /**
     * Any error associated with the route resource. 
     */
    Error?: ErrorResponse;
    /**
     * Indicates whether to match all subpaths of the given source path. If this value is false, requests must match the source path exactly before they are forwarded to this route's service. 
     */
    IncludeChildPaths?: Boolean;
    /**
     * A timestamp that indicates when the route was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * A list of HTTP methods to match. An empty list matches all values. If a method is present, only HTTP requests using that method are forwarded to this route’s service. 
     */
    Methods?: HttpMethods;
    /**
     * The Amazon Web Services account ID of the route owner.
     */
    OwnerAccountId?: AccountId;
    /**
     * A mapping of Amazon API Gateway path resources to resource IDs. 
     */
    PathResourceToId?: PathResourceToId;
    /**
     * The unique identifier of the route.  DEFAULT: All traffic that does not match another route is forwarded to the default route. Applications must have a default route before any other routes can be created.  URI_PATH: A route that is based on a URI path.
     */
    RouteId?: RouteId;
    /**
     * The type of route.
     */
    RouteType?: RouteType;
    /**
     * The unique identifier of the service.
     */
    ServiceId?: ServiceId;
    /**
     * This is the path that Refactor Spaces uses to match traffic. Paths must start with / and are relative to the base of the application. To use path parameters in the source path, add a variable in curly braces. For example, the resource path {user} represents a path parameter called 'user'.
     */
    SourcePath?: UriPath;
    /**
     * The current state of the route. 
     */
    State?: RouteState;
    /**
     * The tags assigned to the route. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key-value pair. 
     */
    Tags?: TagMap;
  }
  export interface GetServiceRequest {
    /**
     * The ID of the application.
     */
    ApplicationIdentifier: ApplicationId;
    /**
     * The ID of the environment.
     */
    EnvironmentIdentifier: EnvironmentId;
    /**
     * The ID of the service.
     */
    ServiceIdentifier: ServiceId;
  }
  export interface GetServiceResponse {
    /**
     * The ID of the application.
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    Arn?: ResourceArn;
    /**
     * The Amazon Web Services account ID of the service creator.
     */
    CreatedByAccountId?: AccountId;
    /**
     * The timestamp of when the service is created.
     */
    CreatedTime?: Timestamp;
    /**
     * The description of the service. 
     */
    Description?: Description;
    /**
     * The endpoint type of the service.
     */
    EndpointType?: ServiceEndpointType;
    /**
     * The unique identifier of the environment.
     */
    EnvironmentId?: EnvironmentId;
    /**
     * Any error associated with the service resource. 
     */
    Error?: ErrorResponse;
    /**
     * The configuration for the Lambda endpoint type. The Arn is the Amazon Resource Name (ARN) of the Lambda function associated with this service. 
     */
    LambdaEndpoint?: LambdaEndpointConfig;
    /**
     * A timestamp that indicates when the service was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The name of the service.
     */
    Name?: ServiceName;
    /**
     * The Amazon Web Services account ID of the service owner.
     */
    OwnerAccountId?: AccountId;
    /**
     * The unique identifier of the service.
     */
    ServiceId?: ServiceId;
    /**
     * The current state of the service. 
     */
    State?: ServiceState;
    /**
     * The tags assigned to the service. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key-value pair. 
     */
    Tags?: TagMap;
    /**
     * The configuration for the URL endpoint type. The Url isthe URL of the endpoint type. The HealthUrl is the health check URL of the endpoint type. 
     */
    UrlEndpoint?: UrlEndpointConfig;
    /**
     * The ID of the virtual private cloud (VPC). 
     */
    VpcId?: VpcId;
  }
  export type HttpMethod = "DELETE"|"GET"|"HEAD"|"OPTIONS"|"PATCH"|"POST"|"PUT"|string;
  export type HttpMethods = HttpMethod[];
  export type LambdaArn = string;
  export interface LambdaEndpointConfig {
    /**
     * The Amazon Resource Name (ARN) of the Lambda endpoint. 
     */
    Arn?: LambdaArn;
  }
  export interface LambdaEndpointInput {
    /**
     * The Amazon Resource Name (ARN) of the Lambda function or alias.
     */
    Arn: LambdaArn;
  }
  export interface LambdaEndpointSummary {
    /**
     * The Amazon Resource Name (ARN) of the Lambda endpoint. 
     */
    Arn?: LambdaArn;
  }
  export interface ListApplicationsRequest {
    /**
     * The ID of the environment. 
     */
    EnvironmentIdentifier: EnvironmentId;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListApplicationsResponse {
    /**
     * The list of ApplicationSummary objects. 
     */
    ApplicationSummaryList?: ApplicationSummaries;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListEnvironmentVpcsRequest {
    /**
     * The ID of the environment. 
     */
    EnvironmentIdentifier: EnvironmentId;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListEnvironmentVpcsResponse {
    /**
     * The list of EnvironmentVpc objects. 
     */
    EnvironmentVpcList?: EnvironmentVpcs;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListEnvironmentsRequest {
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListEnvironmentsResponse {
    /**
     * The list of EnvironmentSummary objects. 
     */
    EnvironmentSummaryList?: EnvironmentSummaries;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListRoutesRequest {
    /**
     * The ID of the application. 
     */
    ApplicationIdentifier: ApplicationId;
    /**
     * The ID of the environment. 
     */
    EnvironmentIdentifier: EnvironmentId;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListRoutesResponse {
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
    /**
     * The list of RouteSummary objects. 
     */
    RouteSummaryList?: RouteSummaries;
  }
  export interface ListServicesRequest {
    /**
     * The ID of the application. 
     */
    ApplicationIdentifier: ApplicationId;
    /**
     * The ID of the environment. 
     */
    EnvironmentIdentifier: EnvironmentId;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListServicesResponse {
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
    /**
     *  The list of ServiceSummary objects. 
     */
    ServiceSummaryList?: ServiceSummaries;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. 
     */
    ResourceArn: String;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of tags assigned to the resource. 
     */
    Tags?: TagMap;
  }
  export type MaxResults = number;
  export type NetworkFabricType = "TRANSIT_GATEWAY"|"NONE"|string;
  export type NextToken = string;
  export type NlbArn = string;
  export type NlbName = string;
  export type PathResourceToId = {[key: string]: PathResourceToIdValue};
  export type PathResourceToIdKey = string;
  export type PathResourceToIdValue = string;
  export type PolicyString = string;
  export type ProxyType = "API_GATEWAY"|string;
  export interface PutResourcePolicyRequest {
    /**
     * A JSON-formatted string for an Amazon Web Services resource-based policy. 
     */
    Policy: PolicyString;
    /**
     * The Amazon Resource Name (ARN) of the resource to which the policy is being attached. 
     */
    ResourceArn: ResourceArn;
  }
  export interface PutResourcePolicyResponse {
  }
  export type ResourceArn = string;
  export type ResourceIdentifier = string;
  export type ResourcePolicyIdentifier = string;
  export type RouteActivationState = "ACTIVE"|"INACTIVE"|string;
  export type RouteId = string;
  export type RouteState = "CREATING"|"ACTIVE"|"DELETING"|"FAILED"|"UPDATING"|"INACTIVE"|string;
  export type RouteSummaries = RouteSummary[];
  export interface RouteSummary {
    /**
     * If set to true, this option appends the source path to the service URL endpoint.
     */
    AppendSourcePath?: Boolean;
    /**
     * The unique identifier of the application. 
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the route. 
     */
    Arn?: ResourceArn;
    /**
     * The Amazon Web Services account ID of the route creator. 
     */
    CreatedByAccountId?: AccountId;
    /**
     * A timestamp that indicates when the route is created. 
     */
    CreatedTime?: Timestamp;
    /**
     * The unique identifier of the environment. 
     */
    EnvironmentId?: EnvironmentId;
    /**
     * Any error associated with the route resource. 
     */
    Error?: ErrorResponse;
    /**
     * Indicates whether to match all subpaths of the given source path. If this value is false, requests must match the source path exactly before they are forwarded to this route's service.
     */
    IncludeChildPaths?: Boolean;
    /**
     * A timestamp that indicates when the route was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * A list of HTTP methods to match. An empty list matches all values. If a method is present, only HTTP requests using that method are forwarded to this route’s service. 
     */
    Methods?: HttpMethods;
    /**
     * The Amazon Web Services account ID of the route owner.
     */
    OwnerAccountId?: AccountId;
    /**
     * A mapping of Amazon API Gateway path resources to resource IDs. 
     */
    PathResourceToId?: PathResourceToId;
    /**
     * The unique identifier of the route. 
     */
    RouteId?: RouteId;
    /**
     * The route type of the route. 
     */
    RouteType?: RouteType;
    /**
     * The unique identifier of the service. 
     */
    ServiceId?: ServiceId;
    /**
     * This is the path that Refactor Spaces uses to match traffic. Paths must start with / and are relative to the base of the application. To use path parameters in the source path, add a variable in curly braces. For example, the resource path {user} represents a path parameter called 'user'.
     */
    SourcePath?: UriPath;
    /**
     * The current state of the route. 
     */
    State?: RouteState;
    /**
     * The tags assigned to the route. 
     */
    Tags?: TagMap;
  }
  export type RouteType = "DEFAULT"|"URI_PATH"|string;
  export type ServiceEndpointType = "LAMBDA"|"URL"|string;
  export type ServiceId = string;
  export type ServiceName = string;
  export type ServiceState = "CREATING"|"ACTIVE"|"DELETING"|"FAILED"|string;
  export type ServiceSummaries = ServiceSummary[];
  export interface ServiceSummary {
    /**
     * The unique identifier of the application. 
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the service. 
     */
    Arn?: ResourceArn;
    /**
     * The Amazon Web Services account ID of the service creator. 
     */
    CreatedByAccountId?: AccountId;
    /**
     * A timestamp that indicates when the service is created. 
     */
    CreatedTime?: Timestamp;
    /**
     * A description of the service. 
     */
    Description?: Description;
    /**
     * The endpoint type of the service. 
     */
    EndpointType?: ServiceEndpointType;
    /**
     * The unique identifier of the environment. 
     */
    EnvironmentId?: EnvironmentId;
    /**
     * Any error associated with the service resource. 
     */
    Error?: ErrorResponse;
    /**
     * A summary of the configuration for the Lambda endpoint type. 
     */
    LambdaEndpoint?: LambdaEndpointSummary;
    /**
     * A timestamp that indicates when the service was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The name of the service. 
     */
    Name?: ServiceName;
    /**
     * The Amazon Web Services account ID of the service owner.
     */
    OwnerAccountId?: AccountId;
    /**
     * The unique identifier of the service. 
     */
    ServiceId?: ServiceId;
    /**
     * The current state of the service. 
     */
    State?: ServiceState;
    /**
     * The tags assigned to the service. 
     */
    Tags?: TagMap;
    /**
     * The summary of the configuration for the URL endpoint type. 
     */
    UrlEndpoint?: UrlEndpointSummary;
    /**
     * The ID of the virtual private cloud (VPC). 
     */
    VpcId?: VpcId;
  }
  export type StageName = string;
  export type String = string;
  export type TagKeys = String[];
  export type TagMap = {[key: string]: TagMapValueString};
  export type TagMapKeyString = string;
  export type TagMapValueString = string;
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: String;
    /**
     * The new or modified tags for the resource.
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type Timestamp = Date;
  export type TransitGatewayId = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. 
     */
    ResourceArn: String;
    /**
     * The list of keys of the tags to be removed from the resource. 
     */
    TagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateRouteRequest {
    /**
     *  If set to ACTIVE, traffic is forwarded to this route’s service after the route is updated. 
     */
    ActivationState: RouteActivationState;
    /**
     *  The ID of the application within which the route is being updated. 
     */
    ApplicationIdentifier: ApplicationId;
    /**
     *  The ID of the environment in which the route is being updated. 
     */
    EnvironmentIdentifier: EnvironmentId;
    /**
     *  The unique identifier of the route to update. 
     */
    RouteIdentifier: RouteId;
  }
  export interface UpdateRouteResponse {
    /**
     *  The ID of the application in which the route is being updated. 
     */
    ApplicationId?: ApplicationId;
    /**
     *  The Amazon Resource Name (ARN) of the route. The format for this ARN is arn:aws:refactor-spaces:region:account-id:resource-type/resource-id . For more information about ARNs, see  Amazon Resource Names (ARNs) in the Amazon Web Services General Reference. 
     */
    Arn?: ResourceArn;
    /**
     *  A timestamp that indicates when the route was last updated. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     *  The unique identifier of the route. 
     */
    RouteId?: RouteId;
    /**
     *  The ID of service in which the route was created. Traffic that matches this route is forwarded to this service. 
     */
    ServiceId?: ServiceId;
    /**
     *  The current state of the route. 
     */
    State?: RouteState;
  }
  export type Uri = string;
  export type UriPath = string;
  export interface UriPathRouteInput {
    /**
     * If set to ACTIVE, traffic is forwarded to this route’s service after the route is created. 
     */
    ActivationState: RouteActivationState;
    /**
     * If set to true, this option appends the source path to the service URL endpoint.
     */
    AppendSourcePath?: Boolean;
    /**
     * Indicates whether to match all subpaths of the given source path. If this value is false, requests must match the source path exactly before they are forwarded to this route's service. 
     */
    IncludeChildPaths?: Boolean;
    /**
     * A list of HTTP methods to match. An empty list matches all values. If a method is present, only HTTP requests using that method are forwarded to this route’s service. 
     */
    Methods?: HttpMethods;
    /**
     * This is the path that Refactor Spaces uses to match traffic. Paths must start with / and are relative to the base of the application. To use path parameters in the source path, add a variable in curly braces. For example, the resource path {user} represents a path parameter called 'user'.
     */
    SourcePath: UriPath;
  }
  export interface UrlEndpointConfig {
    /**
     * The health check URL of the URL endpoint type. 
     */
    HealthUrl?: Uri;
    /**
     * The HTTP URL endpoint. 
     */
    Url?: Uri;
  }
  export interface UrlEndpointInput {
    /**
     * The health check URL of the URL endpoint type. If the URL is a public endpoint, the HealthUrl must also be a public endpoint. If the URL is a private endpoint inside a virtual private cloud (VPC), the health URL must also be a private endpoint, and the host must be the same as the URL. 
     */
    HealthUrl?: Uri;
    /**
     * The URL to route traffic to. The URL must be an rfc3986-formatted URL. If the host is a domain name, the name must be resolvable over the public internet. If the scheme is https, the top level domain of the host must be listed in the IANA root zone database. 
     */
    Url: Uri;
  }
  export interface UrlEndpointSummary {
    /**
     * The health check URL of the URL endpoint type. If the URL is a public endpoint, the HealthUrl must also be a public endpoint. If the URL is a private endpoint inside a virtual private cloud (VPC), the health URL must also be a private endpoint, and the host must be the same as the URL.
     */
    HealthUrl?: Uri;
    /**
     *  The URL to route traffic to. The URL must be an rfc3986-formatted URL. If the host is a domain name, the name must be resolvable over the public internet. If the scheme is https, the top level domain of the host must be listed in the IANA root zone database. 
     */
    Url?: Uri;
  }
  export type VpcId = string;
  export type VpcLinkId = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-10-26"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MigrationHubRefactorSpaces client.
   */
  export import Types = MigrationHubRefactorSpaces;
}
export = MigrationHubRefactorSpaces;
