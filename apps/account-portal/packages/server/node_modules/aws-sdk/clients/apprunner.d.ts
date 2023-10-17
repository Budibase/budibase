import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AppRunner extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AppRunner.Types.ClientConfiguration)
  config: Config & AppRunner.Types.ClientConfiguration;
  /**
   * Associate your own domain name with the App Runner subdomain URL of your App Runner service. After you call AssociateCustomDomain and receive a successful response, use the information in the CustomDomain record that's returned to add CNAME records to your Domain Name System (DNS). For each mapped domain name, add a mapping to the target App Runner subdomain and one or more certificate validation records. App Runner then performs DNS validation to verify that you own or control the domain name that you associated. App Runner tracks domain validity in a certificate stored in AWS Certificate Manager (ACM).
   */
  associateCustomDomain(params: AppRunner.Types.AssociateCustomDomainRequest, callback?: (err: AWSError, data: AppRunner.Types.AssociateCustomDomainResponse) => void): Request<AppRunner.Types.AssociateCustomDomainResponse, AWSError>;
  /**
   * Associate your own domain name with the App Runner subdomain URL of your App Runner service. After you call AssociateCustomDomain and receive a successful response, use the information in the CustomDomain record that's returned to add CNAME records to your Domain Name System (DNS). For each mapped domain name, add a mapping to the target App Runner subdomain and one or more certificate validation records. App Runner then performs DNS validation to verify that you own or control the domain name that you associated. App Runner tracks domain validity in a certificate stored in AWS Certificate Manager (ACM).
   */
  associateCustomDomain(callback?: (err: AWSError, data: AppRunner.Types.AssociateCustomDomainResponse) => void): Request<AppRunner.Types.AssociateCustomDomainResponse, AWSError>;
  /**
   * Create an App Runner automatic scaling configuration resource. App Runner requires this resource when you create or update App Runner services and you require non-default auto scaling settings. You can share an auto scaling configuration across multiple services. Create multiple revisions of a configuration by calling this action multiple times using the same AutoScalingConfigurationName. The call returns incremental AutoScalingConfigurationRevision values. When you create a service and configure an auto scaling configuration resource, the service uses the latest active revision of the auto scaling configuration by default. You can optionally configure the service to use a specific revision. Configure a higher MinSize to increase the spread of your App Runner service over more Availability Zones in the Amazon Web Services Region. The tradeoff is a higher minimal cost. Configure a lower MaxSize to control your cost. The tradeoff is lower responsiveness during peak demand.
   */
  createAutoScalingConfiguration(params: AppRunner.Types.CreateAutoScalingConfigurationRequest, callback?: (err: AWSError, data: AppRunner.Types.CreateAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.CreateAutoScalingConfigurationResponse, AWSError>;
  /**
   * Create an App Runner automatic scaling configuration resource. App Runner requires this resource when you create or update App Runner services and you require non-default auto scaling settings. You can share an auto scaling configuration across multiple services. Create multiple revisions of a configuration by calling this action multiple times using the same AutoScalingConfigurationName. The call returns incremental AutoScalingConfigurationRevision values. When you create a service and configure an auto scaling configuration resource, the service uses the latest active revision of the auto scaling configuration by default. You can optionally configure the service to use a specific revision. Configure a higher MinSize to increase the spread of your App Runner service over more Availability Zones in the Amazon Web Services Region. The tradeoff is a higher minimal cost. Configure a lower MaxSize to control your cost. The tradeoff is lower responsiveness during peak demand.
   */
  createAutoScalingConfiguration(callback?: (err: AWSError, data: AppRunner.Types.CreateAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.CreateAutoScalingConfigurationResponse, AWSError>;
  /**
   * Create an App Runner connection resource. App Runner requires a connection resource when you create App Runner services that access private repositories from certain third-party providers. You can share a connection across multiple services. A connection resource is needed to access GitHub and Bitbucket repositories. Both require a user interface approval process through the App Runner console before you can use the connection.
   */
  createConnection(params: AppRunner.Types.CreateConnectionRequest, callback?: (err: AWSError, data: AppRunner.Types.CreateConnectionResponse) => void): Request<AppRunner.Types.CreateConnectionResponse, AWSError>;
  /**
   * Create an App Runner connection resource. App Runner requires a connection resource when you create App Runner services that access private repositories from certain third-party providers. You can share a connection across multiple services. A connection resource is needed to access GitHub and Bitbucket repositories. Both require a user interface approval process through the App Runner console before you can use the connection.
   */
  createConnection(callback?: (err: AWSError, data: AppRunner.Types.CreateConnectionResponse) => void): Request<AppRunner.Types.CreateConnectionResponse, AWSError>;
  /**
   * Create an App Runner observability configuration resource. App Runner requires this resource when you create or update App Runner services and you want to enable non-default observability features. You can share an observability configuration across multiple services. Create multiple revisions of a configuration by calling this action multiple times using the same ObservabilityConfigurationName. The call returns incremental ObservabilityConfigurationRevision values. When you create a service and configure an observability configuration resource, the service uses the latest active revision of the observability configuration by default. You can optionally configure the service to use a specific revision. The observability configuration resource is designed to configure multiple features (currently one feature, tracing). This action takes optional parameters that describe the configuration of these features (currently one parameter, TraceConfiguration). If you don't specify a feature parameter, App Runner doesn't enable the feature.
   */
  createObservabilityConfiguration(params: AppRunner.Types.CreateObservabilityConfigurationRequest, callback?: (err: AWSError, data: AppRunner.Types.CreateObservabilityConfigurationResponse) => void): Request<AppRunner.Types.CreateObservabilityConfigurationResponse, AWSError>;
  /**
   * Create an App Runner observability configuration resource. App Runner requires this resource when you create or update App Runner services and you want to enable non-default observability features. You can share an observability configuration across multiple services. Create multiple revisions of a configuration by calling this action multiple times using the same ObservabilityConfigurationName. The call returns incremental ObservabilityConfigurationRevision values. When you create a service and configure an observability configuration resource, the service uses the latest active revision of the observability configuration by default. You can optionally configure the service to use a specific revision. The observability configuration resource is designed to configure multiple features (currently one feature, tracing). This action takes optional parameters that describe the configuration of these features (currently one parameter, TraceConfiguration). If you don't specify a feature parameter, App Runner doesn't enable the feature.
   */
  createObservabilityConfiguration(callback?: (err: AWSError, data: AppRunner.Types.CreateObservabilityConfigurationResponse) => void): Request<AppRunner.Types.CreateObservabilityConfigurationResponse, AWSError>;
  /**
   * Create an App Runner service. After the service is created, the action also automatically starts a deployment. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  createService(params: AppRunner.Types.CreateServiceRequest, callback?: (err: AWSError, data: AppRunner.Types.CreateServiceResponse) => void): Request<AppRunner.Types.CreateServiceResponse, AWSError>;
  /**
   * Create an App Runner service. After the service is created, the action also automatically starts a deployment. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  createService(callback?: (err: AWSError, data: AppRunner.Types.CreateServiceResponse) => void): Request<AppRunner.Types.CreateServiceResponse, AWSError>;
  /**
   * Create an App Runner VPC connector resource. App Runner requires this resource when you want to associate your App Runner service to a custom Amazon Virtual Private Cloud (Amazon VPC).
   */
  createVpcConnector(params: AppRunner.Types.CreateVpcConnectorRequest, callback?: (err: AWSError, data: AppRunner.Types.CreateVpcConnectorResponse) => void): Request<AppRunner.Types.CreateVpcConnectorResponse, AWSError>;
  /**
   * Create an App Runner VPC connector resource. App Runner requires this resource when you want to associate your App Runner service to a custom Amazon Virtual Private Cloud (Amazon VPC).
   */
  createVpcConnector(callback?: (err: AWSError, data: AppRunner.Types.CreateVpcConnectorResponse) => void): Request<AppRunner.Types.CreateVpcConnectorResponse, AWSError>;
  /**
   * Create an App Runner VPC Ingress Connection resource. App Runner requires this resource when you want to associate your App Runner service with an Amazon VPC endpoint.
   */
  createVpcIngressConnection(params: AppRunner.Types.CreateVpcIngressConnectionRequest, callback?: (err: AWSError, data: AppRunner.Types.CreateVpcIngressConnectionResponse) => void): Request<AppRunner.Types.CreateVpcIngressConnectionResponse, AWSError>;
  /**
   * Create an App Runner VPC Ingress Connection resource. App Runner requires this resource when you want to associate your App Runner service with an Amazon VPC endpoint.
   */
  createVpcIngressConnection(callback?: (err: AWSError, data: AppRunner.Types.CreateVpcIngressConnectionResponse) => void): Request<AppRunner.Types.CreateVpcIngressConnectionResponse, AWSError>;
  /**
   * Delete an App Runner automatic scaling configuration resource. You can delete a top level auto scaling configuration, a specific revision of one, or all revisions associated with the top level configuration. You can't delete the default auto scaling configuration or a configuration that's used by one or more App Runner services.
   */
  deleteAutoScalingConfiguration(params: AppRunner.Types.DeleteAutoScalingConfigurationRequest, callback?: (err: AWSError, data: AppRunner.Types.DeleteAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.DeleteAutoScalingConfigurationResponse, AWSError>;
  /**
   * Delete an App Runner automatic scaling configuration resource. You can delete a top level auto scaling configuration, a specific revision of one, or all revisions associated with the top level configuration. You can't delete the default auto scaling configuration or a configuration that's used by one or more App Runner services.
   */
  deleteAutoScalingConfiguration(callback?: (err: AWSError, data: AppRunner.Types.DeleteAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.DeleteAutoScalingConfigurationResponse, AWSError>;
  /**
   * Delete an App Runner connection. You must first ensure that there are no running App Runner services that use this connection. If there are any, the DeleteConnection action fails.
   */
  deleteConnection(params: AppRunner.Types.DeleteConnectionRequest, callback?: (err: AWSError, data: AppRunner.Types.DeleteConnectionResponse) => void): Request<AppRunner.Types.DeleteConnectionResponse, AWSError>;
  /**
   * Delete an App Runner connection. You must first ensure that there are no running App Runner services that use this connection. If there are any, the DeleteConnection action fails.
   */
  deleteConnection(callback?: (err: AWSError, data: AppRunner.Types.DeleteConnectionResponse) => void): Request<AppRunner.Types.DeleteConnectionResponse, AWSError>;
  /**
   * Delete an App Runner observability configuration resource. You can delete a specific revision or the latest active revision. You can't delete a configuration that's used by one or more App Runner services.
   */
  deleteObservabilityConfiguration(params: AppRunner.Types.DeleteObservabilityConfigurationRequest, callback?: (err: AWSError, data: AppRunner.Types.DeleteObservabilityConfigurationResponse) => void): Request<AppRunner.Types.DeleteObservabilityConfigurationResponse, AWSError>;
  /**
   * Delete an App Runner observability configuration resource. You can delete a specific revision or the latest active revision. You can't delete a configuration that's used by one or more App Runner services.
   */
  deleteObservabilityConfiguration(callback?: (err: AWSError, data: AppRunner.Types.DeleteObservabilityConfigurationResponse) => void): Request<AppRunner.Types.DeleteObservabilityConfigurationResponse, AWSError>;
  /**
   * Delete an App Runner service. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.  Make sure that you don't have any active VPCIngressConnections associated with the service you want to delete.  
   */
  deleteService(params: AppRunner.Types.DeleteServiceRequest, callback?: (err: AWSError, data: AppRunner.Types.DeleteServiceResponse) => void): Request<AppRunner.Types.DeleteServiceResponse, AWSError>;
  /**
   * Delete an App Runner service. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.  Make sure that you don't have any active VPCIngressConnections associated with the service you want to delete.  
   */
  deleteService(callback?: (err: AWSError, data: AppRunner.Types.DeleteServiceResponse) => void): Request<AppRunner.Types.DeleteServiceResponse, AWSError>;
  /**
   * Delete an App Runner VPC connector resource. You can't delete a connector that's used by one or more App Runner services.
   */
  deleteVpcConnector(params: AppRunner.Types.DeleteVpcConnectorRequest, callback?: (err: AWSError, data: AppRunner.Types.DeleteVpcConnectorResponse) => void): Request<AppRunner.Types.DeleteVpcConnectorResponse, AWSError>;
  /**
   * Delete an App Runner VPC connector resource. You can't delete a connector that's used by one or more App Runner services.
   */
  deleteVpcConnector(callback?: (err: AWSError, data: AppRunner.Types.DeleteVpcConnectorResponse) => void): Request<AppRunner.Types.DeleteVpcConnectorResponse, AWSError>;
  /**
   * Delete an App Runner VPC Ingress Connection resource that's associated with an App Runner service. The VPC Ingress Connection must be in one of the following states to be deleted:     AVAILABLE     FAILED_CREATION     FAILED_UPDATE     FAILED_DELETION   
   */
  deleteVpcIngressConnection(params: AppRunner.Types.DeleteVpcIngressConnectionRequest, callback?: (err: AWSError, data: AppRunner.Types.DeleteVpcIngressConnectionResponse) => void): Request<AppRunner.Types.DeleteVpcIngressConnectionResponse, AWSError>;
  /**
   * Delete an App Runner VPC Ingress Connection resource that's associated with an App Runner service. The VPC Ingress Connection must be in one of the following states to be deleted:     AVAILABLE     FAILED_CREATION     FAILED_UPDATE     FAILED_DELETION   
   */
  deleteVpcIngressConnection(callback?: (err: AWSError, data: AppRunner.Types.DeleteVpcIngressConnectionResponse) => void): Request<AppRunner.Types.DeleteVpcIngressConnectionResponse, AWSError>;
  /**
   * Return a full description of an App Runner automatic scaling configuration resource.
   */
  describeAutoScalingConfiguration(params: AppRunner.Types.DescribeAutoScalingConfigurationRequest, callback?: (err: AWSError, data: AppRunner.Types.DescribeAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.DescribeAutoScalingConfigurationResponse, AWSError>;
  /**
   * Return a full description of an App Runner automatic scaling configuration resource.
   */
  describeAutoScalingConfiguration(callback?: (err: AWSError, data: AppRunner.Types.DescribeAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.DescribeAutoScalingConfigurationResponse, AWSError>;
  /**
   * Return a description of custom domain names that are associated with an App Runner service.
   */
  describeCustomDomains(params: AppRunner.Types.DescribeCustomDomainsRequest, callback?: (err: AWSError, data: AppRunner.Types.DescribeCustomDomainsResponse) => void): Request<AppRunner.Types.DescribeCustomDomainsResponse, AWSError>;
  /**
   * Return a description of custom domain names that are associated with an App Runner service.
   */
  describeCustomDomains(callback?: (err: AWSError, data: AppRunner.Types.DescribeCustomDomainsResponse) => void): Request<AppRunner.Types.DescribeCustomDomainsResponse, AWSError>;
  /**
   * Return a full description of an App Runner observability configuration resource.
   */
  describeObservabilityConfiguration(params: AppRunner.Types.DescribeObservabilityConfigurationRequest, callback?: (err: AWSError, data: AppRunner.Types.DescribeObservabilityConfigurationResponse) => void): Request<AppRunner.Types.DescribeObservabilityConfigurationResponse, AWSError>;
  /**
   * Return a full description of an App Runner observability configuration resource.
   */
  describeObservabilityConfiguration(callback?: (err: AWSError, data: AppRunner.Types.DescribeObservabilityConfigurationResponse) => void): Request<AppRunner.Types.DescribeObservabilityConfigurationResponse, AWSError>;
  /**
   * Return a full description of an App Runner service.
   */
  describeService(params: AppRunner.Types.DescribeServiceRequest, callback?: (err: AWSError, data: AppRunner.Types.DescribeServiceResponse) => void): Request<AppRunner.Types.DescribeServiceResponse, AWSError>;
  /**
   * Return a full description of an App Runner service.
   */
  describeService(callback?: (err: AWSError, data: AppRunner.Types.DescribeServiceResponse) => void): Request<AppRunner.Types.DescribeServiceResponse, AWSError>;
  /**
   * Return a description of an App Runner VPC connector resource.
   */
  describeVpcConnector(params: AppRunner.Types.DescribeVpcConnectorRequest, callback?: (err: AWSError, data: AppRunner.Types.DescribeVpcConnectorResponse) => void): Request<AppRunner.Types.DescribeVpcConnectorResponse, AWSError>;
  /**
   * Return a description of an App Runner VPC connector resource.
   */
  describeVpcConnector(callback?: (err: AWSError, data: AppRunner.Types.DescribeVpcConnectorResponse) => void): Request<AppRunner.Types.DescribeVpcConnectorResponse, AWSError>;
  /**
   * Return a full description of an App Runner VPC Ingress Connection resource.
   */
  describeVpcIngressConnection(params: AppRunner.Types.DescribeVpcIngressConnectionRequest, callback?: (err: AWSError, data: AppRunner.Types.DescribeVpcIngressConnectionResponse) => void): Request<AppRunner.Types.DescribeVpcIngressConnectionResponse, AWSError>;
  /**
   * Return a full description of an App Runner VPC Ingress Connection resource.
   */
  describeVpcIngressConnection(callback?: (err: AWSError, data: AppRunner.Types.DescribeVpcIngressConnectionResponse) => void): Request<AppRunner.Types.DescribeVpcIngressConnectionResponse, AWSError>;
  /**
   * Disassociate a custom domain name from an App Runner service. Certificates tracking domain validity are associated with a custom domain and are stored in AWS Certificate Manager (ACM). These certificates aren't deleted as part of this action. App Runner delays certificate deletion for 30 days after a domain is disassociated from your service.
   */
  disassociateCustomDomain(params: AppRunner.Types.DisassociateCustomDomainRequest, callback?: (err: AWSError, data: AppRunner.Types.DisassociateCustomDomainResponse) => void): Request<AppRunner.Types.DisassociateCustomDomainResponse, AWSError>;
  /**
   * Disassociate a custom domain name from an App Runner service. Certificates tracking domain validity are associated with a custom domain and are stored in AWS Certificate Manager (ACM). These certificates aren't deleted as part of this action. App Runner delays certificate deletion for 30 days after a domain is disassociated from your service.
   */
  disassociateCustomDomain(callback?: (err: AWSError, data: AppRunner.Types.DisassociateCustomDomainResponse) => void): Request<AppRunner.Types.DisassociateCustomDomainResponse, AWSError>;
  /**
   * Returns a list of active App Runner automatic scaling configurations in your Amazon Web Services account. You can query the revisions for a specific configuration name or the revisions for all active configurations in your account. You can optionally query only the latest revision of each requested name. To retrieve a full description of a particular configuration revision, call and provide one of the ARNs returned by ListAutoScalingConfigurations.
   */
  listAutoScalingConfigurations(params: AppRunner.Types.ListAutoScalingConfigurationsRequest, callback?: (err: AWSError, data: AppRunner.Types.ListAutoScalingConfigurationsResponse) => void): Request<AppRunner.Types.ListAutoScalingConfigurationsResponse, AWSError>;
  /**
   * Returns a list of active App Runner automatic scaling configurations in your Amazon Web Services account. You can query the revisions for a specific configuration name or the revisions for all active configurations in your account. You can optionally query only the latest revision of each requested name. To retrieve a full description of a particular configuration revision, call and provide one of the ARNs returned by ListAutoScalingConfigurations.
   */
  listAutoScalingConfigurations(callback?: (err: AWSError, data: AppRunner.Types.ListAutoScalingConfigurationsResponse) => void): Request<AppRunner.Types.ListAutoScalingConfigurationsResponse, AWSError>;
  /**
   * Returns a list of App Runner connections that are associated with your Amazon Web Services account.
   */
  listConnections(params: AppRunner.Types.ListConnectionsRequest, callback?: (err: AWSError, data: AppRunner.Types.ListConnectionsResponse) => void): Request<AppRunner.Types.ListConnectionsResponse, AWSError>;
  /**
   * Returns a list of App Runner connections that are associated with your Amazon Web Services account.
   */
  listConnections(callback?: (err: AWSError, data: AppRunner.Types.ListConnectionsResponse) => void): Request<AppRunner.Types.ListConnectionsResponse, AWSError>;
  /**
   * Returns a list of active App Runner observability configurations in your Amazon Web Services account. You can query the revisions for a specific configuration name or the revisions for all active configurations in your account. You can optionally query only the latest revision of each requested name. To retrieve a full description of a particular configuration revision, call and provide one of the ARNs returned by ListObservabilityConfigurations.
   */
  listObservabilityConfigurations(params: AppRunner.Types.ListObservabilityConfigurationsRequest, callback?: (err: AWSError, data: AppRunner.Types.ListObservabilityConfigurationsResponse) => void): Request<AppRunner.Types.ListObservabilityConfigurationsResponse, AWSError>;
  /**
   * Returns a list of active App Runner observability configurations in your Amazon Web Services account. You can query the revisions for a specific configuration name or the revisions for all active configurations in your account. You can optionally query only the latest revision of each requested name. To retrieve a full description of a particular configuration revision, call and provide one of the ARNs returned by ListObservabilityConfigurations.
   */
  listObservabilityConfigurations(callback?: (err: AWSError, data: AppRunner.Types.ListObservabilityConfigurationsResponse) => void): Request<AppRunner.Types.ListObservabilityConfigurationsResponse, AWSError>;
  /**
   * Return a list of operations that occurred on an App Runner service. The resulting list of OperationSummary objects is sorted in reverse chronological order. The first object on the list represents the last started operation.
   */
  listOperations(params: AppRunner.Types.ListOperationsRequest, callback?: (err: AWSError, data: AppRunner.Types.ListOperationsResponse) => void): Request<AppRunner.Types.ListOperationsResponse, AWSError>;
  /**
   * Return a list of operations that occurred on an App Runner service. The resulting list of OperationSummary objects is sorted in reverse chronological order. The first object on the list represents the last started operation.
   */
  listOperations(callback?: (err: AWSError, data: AppRunner.Types.ListOperationsResponse) => void): Request<AppRunner.Types.ListOperationsResponse, AWSError>;
  /**
   * Returns a list of running App Runner services in your Amazon Web Services account.
   */
  listServices(params: AppRunner.Types.ListServicesRequest, callback?: (err: AWSError, data: AppRunner.Types.ListServicesResponse) => void): Request<AppRunner.Types.ListServicesResponse, AWSError>;
  /**
   * Returns a list of running App Runner services in your Amazon Web Services account.
   */
  listServices(callback?: (err: AWSError, data: AppRunner.Types.ListServicesResponse) => void): Request<AppRunner.Types.ListServicesResponse, AWSError>;
  /**
   * Returns a list of the associated App Runner services using an auto scaling configuration.
   */
  listServicesForAutoScalingConfiguration(params: AppRunner.Types.ListServicesForAutoScalingConfigurationRequest, callback?: (err: AWSError, data: AppRunner.Types.ListServicesForAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.ListServicesForAutoScalingConfigurationResponse, AWSError>;
  /**
   * Returns a list of the associated App Runner services using an auto scaling configuration.
   */
  listServicesForAutoScalingConfiguration(callback?: (err: AWSError, data: AppRunner.Types.ListServicesForAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.ListServicesForAutoScalingConfigurationResponse, AWSError>;
  /**
   * List tags that are associated with for an App Runner resource. The response contains a list of tag key-value pairs.
   */
  listTagsForResource(params: AppRunner.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: AppRunner.Types.ListTagsForResourceResponse) => void): Request<AppRunner.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List tags that are associated with for an App Runner resource. The response contains a list of tag key-value pairs.
   */
  listTagsForResource(callback?: (err: AWSError, data: AppRunner.Types.ListTagsForResourceResponse) => void): Request<AppRunner.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of App Runner VPC connectors in your Amazon Web Services account.
   */
  listVpcConnectors(params: AppRunner.Types.ListVpcConnectorsRequest, callback?: (err: AWSError, data: AppRunner.Types.ListVpcConnectorsResponse) => void): Request<AppRunner.Types.ListVpcConnectorsResponse, AWSError>;
  /**
   * Returns a list of App Runner VPC connectors in your Amazon Web Services account.
   */
  listVpcConnectors(callback?: (err: AWSError, data: AppRunner.Types.ListVpcConnectorsResponse) => void): Request<AppRunner.Types.ListVpcConnectorsResponse, AWSError>;
  /**
   * Return a list of App Runner VPC Ingress Connections in your Amazon Web Services account.
   */
  listVpcIngressConnections(params: AppRunner.Types.ListVpcIngressConnectionsRequest, callback?: (err: AWSError, data: AppRunner.Types.ListVpcIngressConnectionsResponse) => void): Request<AppRunner.Types.ListVpcIngressConnectionsResponse, AWSError>;
  /**
   * Return a list of App Runner VPC Ingress Connections in your Amazon Web Services account.
   */
  listVpcIngressConnections(callback?: (err: AWSError, data: AppRunner.Types.ListVpcIngressConnectionsResponse) => void): Request<AppRunner.Types.ListVpcIngressConnectionsResponse, AWSError>;
  /**
   * Pause an active App Runner service. App Runner reduces compute capacity for the service to zero and loses state (for example, ephemeral storage is removed). This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  pauseService(params: AppRunner.Types.PauseServiceRequest, callback?: (err: AWSError, data: AppRunner.Types.PauseServiceResponse) => void): Request<AppRunner.Types.PauseServiceResponse, AWSError>;
  /**
   * Pause an active App Runner service. App Runner reduces compute capacity for the service to zero and loses state (for example, ephemeral storage is removed). This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  pauseService(callback?: (err: AWSError, data: AppRunner.Types.PauseServiceResponse) => void): Request<AppRunner.Types.PauseServiceResponse, AWSError>;
  /**
   * Resume an active App Runner service. App Runner provisions compute capacity for the service. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  resumeService(params: AppRunner.Types.ResumeServiceRequest, callback?: (err: AWSError, data: AppRunner.Types.ResumeServiceResponse) => void): Request<AppRunner.Types.ResumeServiceResponse, AWSError>;
  /**
   * Resume an active App Runner service. App Runner provisions compute capacity for the service. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  resumeService(callback?: (err: AWSError, data: AppRunner.Types.ResumeServiceResponse) => void): Request<AppRunner.Types.ResumeServiceResponse, AWSError>;
  /**
   * Initiate a manual deployment of the latest commit in a source code repository or the latest image in a source image repository to an App Runner service. For a source code repository, App Runner retrieves the commit and builds a Docker image. For a source image repository, App Runner retrieves the latest Docker image. In both cases, App Runner then deploys the new image to your service and starts a new container instance. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  startDeployment(params: AppRunner.Types.StartDeploymentRequest, callback?: (err: AWSError, data: AppRunner.Types.StartDeploymentResponse) => void): Request<AppRunner.Types.StartDeploymentResponse, AWSError>;
  /**
   * Initiate a manual deployment of the latest commit in a source code repository or the latest image in a source image repository to an App Runner service. For a source code repository, App Runner retrieves the commit and builds a Docker image. For a source image repository, App Runner retrieves the latest Docker image. In both cases, App Runner then deploys the new image to your service and starts a new container instance. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  startDeployment(callback?: (err: AWSError, data: AppRunner.Types.StartDeploymentResponse) => void): Request<AppRunner.Types.StartDeploymentResponse, AWSError>;
  /**
   * Add tags to, or update the tag values of, an App Runner resource. A tag is a key-value pair.
   */
  tagResource(params: AppRunner.Types.TagResourceRequest, callback?: (err: AWSError, data: AppRunner.Types.TagResourceResponse) => void): Request<AppRunner.Types.TagResourceResponse, AWSError>;
  /**
   * Add tags to, or update the tag values of, an App Runner resource. A tag is a key-value pair.
   */
  tagResource(callback?: (err: AWSError, data: AppRunner.Types.TagResourceResponse) => void): Request<AppRunner.Types.TagResourceResponse, AWSError>;
  /**
   * Remove tags from an App Runner resource.
   */
  untagResource(params: AppRunner.Types.UntagResourceRequest, callback?: (err: AWSError, data: AppRunner.Types.UntagResourceResponse) => void): Request<AppRunner.Types.UntagResourceResponse, AWSError>;
  /**
   * Remove tags from an App Runner resource.
   */
  untagResource(callback?: (err: AWSError, data: AppRunner.Types.UntagResourceResponse) => void): Request<AppRunner.Types.UntagResourceResponse, AWSError>;
  /**
   * Update an auto scaling configuration to be the default. The existing default auto scaling configuration will be set to non-default automatically.
   */
  updateDefaultAutoScalingConfiguration(params: AppRunner.Types.UpdateDefaultAutoScalingConfigurationRequest, callback?: (err: AWSError, data: AppRunner.Types.UpdateDefaultAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.UpdateDefaultAutoScalingConfigurationResponse, AWSError>;
  /**
   * Update an auto scaling configuration to be the default. The existing default auto scaling configuration will be set to non-default automatically.
   */
  updateDefaultAutoScalingConfiguration(callback?: (err: AWSError, data: AppRunner.Types.UpdateDefaultAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.UpdateDefaultAutoScalingConfigurationResponse, AWSError>;
  /**
   * Update an App Runner service. You can update the source configuration and instance configuration of the service. You can also update the ARN of the auto scaling configuration resource that's associated with the service. However, you can't change the name or the encryption configuration of the service. These can be set only when you create the service. To update the tags applied to your service, use the separate actions TagResource and UntagResource. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  updateService(params: AppRunner.Types.UpdateServiceRequest, callback?: (err: AWSError, data: AppRunner.Types.UpdateServiceResponse) => void): Request<AppRunner.Types.UpdateServiceResponse, AWSError>;
  /**
   * Update an App Runner service. You can update the source configuration and instance configuration of the service. You can also update the ARN of the auto scaling configuration resource that's associated with the service. However, you can't change the name or the encryption configuration of the service. These can be set only when you create the service. To update the tags applied to your service, use the separate actions TagResource and UntagResource. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  updateService(callback?: (err: AWSError, data: AppRunner.Types.UpdateServiceResponse) => void): Request<AppRunner.Types.UpdateServiceResponse, AWSError>;
  /**
   * Update an existing App Runner VPC Ingress Connection resource. The VPC Ingress Connection must be in one of the following states to be updated:    AVAILABLE     FAILED_CREATION     FAILED_UPDATE   
   */
  updateVpcIngressConnection(params: AppRunner.Types.UpdateVpcIngressConnectionRequest, callback?: (err: AWSError, data: AppRunner.Types.UpdateVpcIngressConnectionResponse) => void): Request<AppRunner.Types.UpdateVpcIngressConnectionResponse, AWSError>;
  /**
   * Update an existing App Runner VPC Ingress Connection resource. The VPC Ingress Connection must be in one of the following states to be updated:    AVAILABLE     FAILED_CREATION     FAILED_UPDATE   
   */
  updateVpcIngressConnection(callback?: (err: AWSError, data: AppRunner.Types.UpdateVpcIngressConnectionResponse) => void): Request<AppRunner.Types.UpdateVpcIngressConnectionResponse, AWSError>;
}
declare namespace AppRunner {
  export type ASConfigMaxConcurrency = number;
  export type ASConfigMaxSize = number;
  export type ASConfigMinSize = number;
  export type AppRunnerResourceArn = string;
  export interface AssociateCustomDomainRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to associate a custom domain name with.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A custom domain endpoint to associate. Specify a root domain (for example, example.com), a subdomain (for example, login.example.com or admin.login.example.com), or a wildcard (for example, *.example.com).
     */
    DomainName: DomainName;
    /**
     * Set to true to associate the subdomain www.DomainName  with the App Runner service in addition to the base domain. Default: true 
     */
    EnableWWWSubdomain?: NullableBoolean;
  }
  export interface AssociateCustomDomainResponse {
    /**
     * The App Runner subdomain of the App Runner service. The custom domain name is mapped to this target name.
     */
    DNSTarget: String;
    /**
     * The Amazon Resource Name (ARN) of the App Runner service with which a custom domain name is associated.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A description of the domain name that's being associated.
     */
    CustomDomain: CustomDomain;
    /**
     * DNS Target records for the custom domains of this Amazon VPC. 
     */
    VpcDNSTargets: VpcDNSTargetList;
  }
  export interface AuthenticationConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the App Runner connection that enables the App Runner service to connect to a source repository. It's required for GitHub code repositories.
     */
    ConnectionArn?: AppRunnerResourceArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants the App Runner service access to a source repository. It's required for ECR image repositories (but not for ECR Public repositories).
     */
    AccessRoleArn?: RoleArn;
  }
  export interface AutoScalingConfiguration {
    /**
     * The Amazon Resource Name (ARN) of this auto scaling configuration.
     */
    AutoScalingConfigurationArn?: AppRunnerResourceArn;
    /**
     * The customer-provided auto scaling configuration name. It can be used in multiple revisions of a configuration.
     */
    AutoScalingConfigurationName?: AutoScalingConfigurationName;
    /**
     * The revision of this auto scaling configuration. It's unique among all the active configurations ("Status": "ACTIVE") that share the same AutoScalingConfigurationName.
     */
    AutoScalingConfigurationRevision?: AutoScalingConfigurationRevision;
    /**
     * It's set to true for the configuration with the highest Revision among all configurations that share the same AutoScalingConfigurationName. It's set to false otherwise.
     */
    Latest?: Latest;
    /**
     * The current state of the auto scaling configuration. If the status of a configuration revision is INACTIVE, it was deleted and can't be used. Inactive configuration revisions are permanently removed some time after they are deleted.
     */
    Status?: AutoScalingConfigurationStatus;
    /**
     * The maximum number of concurrent requests that an instance processes. If the number of concurrent requests exceeds this limit, App Runner scales the service up.
     */
    MaxConcurrency?: MaxConcurrency;
    /**
     * The minimum number of instances that App Runner provisions for a service. The service always has at least MinSize provisioned instances. Some of them actively serve traffic. The rest of them (provisioned and inactive instances) are a cost-effective compute capacity reserve and are ready to be quickly activated. You pay for memory usage of all the provisioned instances. You pay for CPU usage of only the active subset. App Runner temporarily doubles the number of provisioned instances during deployments, to maintain the same capacity for both old and new code.
     */
    MinSize?: MinSize;
    /**
     * The maximum number of instances that a service scales up to. At most MaxSize instances actively serve traffic for your service.
     */
    MaxSize?: MaxSize;
    /**
     * The time when the auto scaling configuration was created. It's in Unix time stamp format.
     */
    CreatedAt?: Timestamp;
    /**
     * The time when the auto scaling configuration was deleted. It's in Unix time stamp format.
     */
    DeletedAt?: Timestamp;
    /**
     * Indicates if this auto scaling configuration has an App Runner service associated with it. A value of true indicates one or more services are associated. A value of false indicates no services are associated.
     */
    HasAssociatedService?: HasAssociatedService;
    /**
     * Indicates if this auto scaling configuration should be used as the default for a new App Runner service that does not have an auto scaling configuration ARN specified during creation. Each account can have only one default AutoScalingConfiguration per region. The default AutoScalingConfiguration can be any revision under the same AutoScalingConfigurationName.
     */
    IsDefault?: IsDefault;
  }
  export type AutoScalingConfigurationName = string;
  export type AutoScalingConfigurationRevision = number;
  export type AutoScalingConfigurationStatus = "ACTIVE"|"INACTIVE"|string;
  export interface AutoScalingConfigurationSummary {
    /**
     * The Amazon Resource Name (ARN) of this auto scaling configuration.
     */
    AutoScalingConfigurationArn?: AppRunnerResourceArn;
    /**
     * The customer-provided auto scaling configuration name. It can be used in multiple revisions of a configuration.
     */
    AutoScalingConfigurationName?: AutoScalingConfigurationName;
    /**
     * The revision of this auto scaling configuration. It's unique among all the active configurations ("Status": "ACTIVE") with the same AutoScalingConfigurationName.
     */
    AutoScalingConfigurationRevision?: Integer;
    /**
     * The current state of the auto scaling configuration. If the status of a configuration revision is INACTIVE, it was deleted and can't be used. Inactive configuration revisions are permanently removed some time after they are deleted.
     */
    Status?: AutoScalingConfigurationStatus;
    /**
     * The time when the auto scaling configuration was created. It's in Unix time stamp format.
     */
    CreatedAt?: Timestamp;
    /**
     * Indicates if this auto scaling configuration has an App Runner service associated with it. A value of true indicates one or more services are associated. A value of false indicates no services are associated.
     */
    HasAssociatedService?: HasAssociatedService;
    /**
     * Indicates if this auto scaling configuration should be used as the default for a new App Runner service that does not have an auto scaling configuration ARN specified during creation. Each account can have only one default AutoScalingConfiguration per region. The default AutoScalingConfiguration can be any revision under the same AutoScalingConfigurationName.
     */
    IsDefault?: IsDefault;
  }
  export type AutoScalingConfigurationSummaryList = AutoScalingConfigurationSummary[];
  export type Boolean = boolean;
  export type BuildCommand = string;
  export interface CertificateValidationRecord {
    /**
     * The certificate CNAME record name.
     */
    Name?: String;
    /**
     * The record type, always CNAME.
     */
    Type?: String;
    /**
     * The certificate CNAME record value.
     */
    Value?: String;
    /**
     * The current state of the certificate CNAME record validation. It should change to SUCCESS after App Runner completes validation with your DNS.
     */
    Status?: CertificateValidationRecordStatus;
  }
  export type CertificateValidationRecordList = CertificateValidationRecord[];
  export type CertificateValidationRecordStatus = "PENDING_VALIDATION"|"SUCCESS"|"FAILED"|string;
  export interface CodeConfiguration {
    /**
     * The source of the App Runner configuration. Values are interpreted as follows:    REPOSITORY – App Runner reads configuration values from the apprunner.yaml file in the source code repository and ignores CodeConfigurationValues.    API – App Runner uses configuration values provided in CodeConfigurationValues and ignores the apprunner.yaml file in the source code repository.  
     */
    ConfigurationSource: ConfigurationSource;
    /**
     * The basic configuration for building and running the App Runner service. Use it to quickly launch an App Runner service without providing a apprunner.yaml file in the source code repository (or ignoring the file if it exists).
     */
    CodeConfigurationValues?: CodeConfigurationValues;
  }
  export interface CodeConfigurationValues {
    /**
     * A runtime environment type for building and running an App Runner service. It represents a programming language runtime.
     */
    Runtime: Runtime;
    /**
     * The command App Runner runs to build your application.
     */
    BuildCommand?: BuildCommand;
    /**
     * The command App Runner runs to start your application.
     */
    StartCommand?: StartCommand;
    /**
     * The port that your application listens to in the container. Default: 8080 
     */
    Port?: String;
    /**
     * The environment variables that are available to your running App Runner service. An array of key-value pairs.
     */
    RuntimeEnvironmentVariables?: RuntimeEnvironmentVariables;
    /**
     * An array of key-value pairs representing the secrets and parameters that get referenced to your service as an environment variable. The supported values are either the full Amazon Resource Name (ARN) of the Secrets Manager secret or the full ARN of the parameter in the Amazon Web Services Systems Manager Parameter Store.     If the Amazon Web Services Systems Manager Parameter Store parameter exists in the same Amazon Web Services Region as the service that you're launching, you can use either the full ARN or name of the secret. If the parameter exists in a different Region, then the full ARN must be specified.     Currently, cross account referencing of Amazon Web Services Systems Manager Parameter Store parameter is not supported.    
     */
    RuntimeEnvironmentSecrets?: RuntimeEnvironmentSecrets;
  }
  export interface CodeRepository {
    /**
     * The location of the repository that contains the source code.
     */
    RepositoryUrl: String;
    /**
     * The version that should be used within the source code repository.
     */
    SourceCodeVersion: SourceCodeVersion;
    /**
     * Configuration for building and running the service from a source code repository.   CodeConfiguration is required only for CreateService request. 
     */
    CodeConfiguration?: CodeConfiguration;
    /**
     * The path of the directory that stores source code and configuration files. The build and start commands also execute from here. The path is absolute from root and, if not specified, defaults to the repository root.
     */
    SourceDirectory?: SourceDirectory;
  }
  export type ConfigurationSource = "REPOSITORY"|"API"|string;
  export interface Connection {
    /**
     * The customer-provided connection name.
     */
    ConnectionName?: ConnectionName;
    /**
     * The Amazon Resource Name (ARN) of this connection.
     */
    ConnectionArn?: AppRunnerResourceArn;
    /**
     * The source repository provider.
     */
    ProviderType?: ProviderType;
    /**
     * The current state of the App Runner connection. When the state is AVAILABLE, you can use the connection to create an App Runner service.
     */
    Status?: ConnectionStatus;
    /**
     * The App Runner connection creation time, expressed as a Unix time stamp.
     */
    CreatedAt?: Timestamp;
  }
  export type ConnectionName = string;
  export type ConnectionStatus = "PENDING_HANDSHAKE"|"AVAILABLE"|"ERROR"|"DELETED"|string;
  export interface ConnectionSummary {
    /**
     * The customer-provided connection name.
     */
    ConnectionName?: ConnectionName;
    /**
     * The Amazon Resource Name (ARN) of this connection.
     */
    ConnectionArn?: AppRunnerResourceArn;
    /**
     * The source repository provider.
     */
    ProviderType?: ProviderType;
    /**
     * The current state of the App Runner connection. When the state is AVAILABLE, you can use the connection to create an App Runner service.
     */
    Status?: ConnectionStatus;
    /**
     * The App Runner connection creation time, expressed as a Unix time stamp.
     */
    CreatedAt?: Timestamp;
  }
  export type ConnectionSummaryList = ConnectionSummary[];
  export type Cpu = string;
  export interface CreateAutoScalingConfigurationRequest {
    /**
     * A name for the auto scaling configuration. When you use it for the first time in an Amazon Web Services Region, App Runner creates revision number 1 of this name. When you use the same name in subsequent calls, App Runner creates incremental revisions of the configuration.  Prior to the release of Auto scale configuration enhancements, the name DefaultConfiguration was reserved.  This restriction is no longer in place. You can now manage DefaultConfiguration the same way you manage your custom auto scaling configurations. This means you can do the following with the DefaultConfiguration that App Runner provides:   Create new revisions of the DefaultConfiguration.   Delete the revisions of the DefaultConfiguration.   Delete the auto scaling configuration for which the App Runner DefaultConfiguration was created.   If you delete the auto scaling configuration you can create another custom auto scaling configuration with the same DefaultConfiguration name. The original DefaultConfiguration resource provided by App Runner remains in your account unless you make changes to it.   
     */
    AutoScalingConfigurationName: AutoScalingConfigurationName;
    /**
     * The maximum number of concurrent requests that you want an instance to process. If the number of concurrent requests exceeds this limit, App Runner scales up your service. Default: 100 
     */
    MaxConcurrency?: ASConfigMaxConcurrency;
    /**
     * The minimum number of instances that App Runner provisions for your service. The service always has at least MinSize provisioned instances. Some of them actively serve traffic. The rest of them (provisioned and inactive instances) are a cost-effective compute capacity reserve and are ready to be quickly activated. You pay for memory usage of all the provisioned instances. You pay for CPU usage of only the active subset. App Runner temporarily doubles the number of provisioned instances during deployments, to maintain the same capacity for both old and new code. Default: 1 
     */
    MinSize?: ASConfigMinSize;
    /**
     * The maximum number of instances that your service scales up to. At most MaxSize instances actively serve traffic for your service. Default: 25 
     */
    MaxSize?: ASConfigMaxSize;
    /**
     * A list of metadata items that you can associate with your auto scaling configuration resource. A tag is a key-value pair.
     */
    Tags?: TagList;
  }
  export interface CreateAutoScalingConfigurationResponse {
    /**
     * A description of the App Runner auto scaling configuration that's created by this request.
     */
    AutoScalingConfiguration: AutoScalingConfiguration;
  }
  export interface CreateConnectionRequest {
    /**
     * A name for the new connection. It must be unique across all App Runner connections for the Amazon Web Services account in the Amazon Web Services Region.
     */
    ConnectionName: ConnectionName;
    /**
     * The source repository provider.
     */
    ProviderType: ProviderType;
    /**
     * A list of metadata items that you can associate with your connection resource. A tag is a key-value pair.
     */
    Tags?: TagList;
  }
  export interface CreateConnectionResponse {
    /**
     * A description of the App Runner connection that's created by this request.
     */
    Connection: Connection;
  }
  export interface CreateObservabilityConfigurationRequest {
    /**
     * A name for the observability configuration. When you use it for the first time in an Amazon Web Services Region, App Runner creates revision number 1 of this name. When you use the same name in subsequent calls, App Runner creates incremental revisions of the configuration.  The name DefaultConfiguration is reserved. You can't use it to create a new observability configuration, and you can't create a revision of it. When you want to use your own observability configuration for your App Runner service, create a configuration with a different name, and then provide it when you create or update your service. 
     */
    ObservabilityConfigurationName: ObservabilityConfigurationName;
    /**
     * The configuration of the tracing feature within this observability configuration. If you don't specify it, App Runner doesn't enable tracing.
     */
    TraceConfiguration?: TraceConfiguration;
    /**
     * A list of metadata items that you can associate with your observability configuration resource. A tag is a key-value pair.
     */
    Tags?: TagList;
  }
  export interface CreateObservabilityConfigurationResponse {
    /**
     * A description of the App Runner observability configuration that's created by this request.
     */
    ObservabilityConfiguration: ObservabilityConfiguration;
  }
  export interface CreateServiceRequest {
    /**
     * A name for the App Runner service. It must be unique across all the running App Runner services in your Amazon Web Services account in the Amazon Web Services Region.
     */
    ServiceName: ServiceName;
    /**
     * The source to deploy to the App Runner service. It can be a code or an image repository.
     */
    SourceConfiguration: SourceConfiguration;
    /**
     * The runtime configuration of instances (scaling units) of your service.
     */
    InstanceConfiguration?: InstanceConfiguration;
    /**
     * An optional list of metadata items that you can associate with the App Runner service resource. A tag is a key-value pair.
     */
    Tags?: TagList;
    /**
     * An optional custom encryption key that App Runner uses to encrypt the copy of your source repository that it maintains and your service logs. By default, App Runner uses an Amazon Web Services managed key.
     */
    EncryptionConfiguration?: EncryptionConfiguration;
    /**
     * The settings for the health check that App Runner performs to monitor the health of the App Runner service.
     */
    HealthCheckConfiguration?: HealthCheckConfiguration;
    /**
     * The Amazon Resource Name (ARN) of an App Runner automatic scaling configuration resource that you want to associate with your service. If not provided, App Runner associates the latest revision of a default auto scaling configuration. Specify an ARN with a name and a revision number to associate that revision. For example: arn:aws:apprunner:us-east-1:123456789012:autoscalingconfiguration/high-availability/3  Specify just the name to associate the latest revision. For example: arn:aws:apprunner:us-east-1:123456789012:autoscalingconfiguration/high-availability 
     */
    AutoScalingConfigurationArn?: AppRunnerResourceArn;
    /**
     * Configuration settings related to network traffic of the web application that the App Runner service runs.
     */
    NetworkConfiguration?: NetworkConfiguration;
    /**
     * The observability configuration of your service.
     */
    ObservabilityConfiguration?: ServiceObservabilityConfiguration;
  }
  export interface CreateServiceResponse {
    /**
     * A description of the App Runner service that's created by this request.
     */
    Service: Service;
    /**
     * The unique ID of the asynchronous operation that this request started. You can use it combined with the ListOperations call to track the operation's progress.
     */
    OperationId: UUID;
  }
  export interface CreateVpcConnectorRequest {
    /**
     * A name for the VPC connector.
     */
    VpcConnectorName: VpcConnectorName;
    /**
     * A list of IDs of subnets that App Runner should use when it associates your service with a custom Amazon VPC. Specify IDs of subnets of a single Amazon VPC. App Runner determines the Amazon VPC from the subnets you specify.   App Runner currently only provides support for IPv4.  
     */
    Subnets: StringList;
    /**
     * A list of IDs of security groups that App Runner should use for access to Amazon Web Services resources under the specified subnets. If not specified, App Runner uses the default security group of the Amazon VPC. The default security group allows all outbound traffic.
     */
    SecurityGroups?: StringList;
    /**
     * A list of metadata items that you can associate with your VPC connector resource. A tag is a key-value pair.
     */
    Tags?: TagList;
  }
  export interface CreateVpcConnectorResponse {
    /**
     * A description of the App Runner VPC connector that's created by this request.
     */
    VpcConnector: VpcConnector;
  }
  export interface CreateVpcIngressConnectionRequest {
    /**
     * The Amazon Resource Name (ARN) for this App Runner service that is used to create the VPC Ingress Connection resource.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A name for the VPC Ingress Connection resource. It must be unique across all the active VPC Ingress Connections in your Amazon Web Services account in the Amazon Web Services Region. 
     */
    VpcIngressConnectionName: VpcIngressConnectionName;
    /**
     * Specifications for the customer’s Amazon VPC and the related Amazon Web Services PrivateLink VPC endpoint that are used to create the VPC Ingress Connection resource.
     */
    IngressVpcConfiguration: IngressVpcConfiguration;
    /**
     * An optional list of metadata items that you can associate with the VPC Ingress Connection resource. A tag is a key-value pair.
     */
    Tags?: TagList;
  }
  export interface CreateVpcIngressConnectionResponse {
    /**
     * A description of the App Runner VPC Ingress Connection resource that's created by this request. 
     */
    VpcIngressConnection: VpcIngressConnection;
  }
  export interface CustomDomain {
    /**
     * An associated custom domain endpoint. It can be a root domain (for example, example.com), a subdomain (for example, login.example.com or admin.login.example.com), or a wildcard (for example, *.example.com).
     */
    DomainName: DomainName;
    /**
     * When true, the subdomain www.DomainName  is associated with the App Runner service in addition to the base domain.
     */
    EnableWWWSubdomain: NullableBoolean;
    /**
     * A list of certificate CNAME records that's used for this domain name.
     */
    CertificateValidationRecords?: CertificateValidationRecordList;
    /**
     * The current state of the domain name association.
     */
    Status: CustomDomainAssociationStatus;
  }
  export type CustomDomainAssociationStatus = "CREATING"|"CREATE_FAILED"|"ACTIVE"|"DELETING"|"DELETE_FAILED"|"PENDING_CERTIFICATE_DNS_VALIDATION"|"BINDING_CERTIFICATE"|string;
  export type CustomDomainList = CustomDomain[];
  export type CustomerAccountId = string;
  export interface DeleteAutoScalingConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner auto scaling configuration that you want to delete. The ARN can be a full auto scaling configuration ARN, or a partial ARN ending with either .../name  or .../name/revision . If a revision isn't specified, the latest active revision is deleted.
     */
    AutoScalingConfigurationArn: AppRunnerResourceArn;
    /**
     * Set to true to delete all of the revisions associated with the AutoScalingConfigurationArn parameter value. When DeleteAllRevisions is set to true, the only valid value for the Amazon Resource Name (ARN) is a partial ARN ending with: .../name.
     */
    DeleteAllRevisions?: Boolean;
  }
  export interface DeleteAutoScalingConfigurationResponse {
    /**
     * A description of the App Runner auto scaling configuration that this request just deleted.
     */
    AutoScalingConfiguration: AutoScalingConfiguration;
  }
  export interface DeleteConnectionRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner connection that you want to delete.
     */
    ConnectionArn: AppRunnerResourceArn;
  }
  export interface DeleteConnectionResponse {
    /**
     * A description of the App Runner connection that this request just deleted.
     */
    Connection?: Connection;
  }
  export interface DeleteObservabilityConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner observability configuration that you want to delete. The ARN can be a full observability configuration ARN, or a partial ARN ending with either .../name  or .../name/revision . If a revision isn't specified, the latest active revision is deleted.
     */
    ObservabilityConfigurationArn: AppRunnerResourceArn;
  }
  export interface DeleteObservabilityConfigurationResponse {
    /**
     * A description of the App Runner observability configuration that this request just deleted.
     */
    ObservabilityConfiguration: ObservabilityConfiguration;
  }
  export interface DeleteServiceRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to delete.
     */
    ServiceArn: AppRunnerResourceArn;
  }
  export interface DeleteServiceResponse {
    /**
     * A description of the App Runner service that this request just deleted.
     */
    Service: Service;
    /**
     * The unique ID of the asynchronous operation that this request started. You can use it combined with the ListOperations call to track the operation's progress.
     */
    OperationId: UUID;
  }
  export interface DeleteVpcConnectorRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner VPC connector that you want to delete. The ARN must be a full VPC connector ARN.
     */
    VpcConnectorArn: AppRunnerResourceArn;
  }
  export interface DeleteVpcConnectorResponse {
    /**
     * A description of the App Runner VPC connector that this request just deleted.
     */
    VpcConnector: VpcConnector;
  }
  export interface DeleteVpcIngressConnectionRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner VPC Ingress Connection that you want to delete.
     */
    VpcIngressConnectionArn: AppRunnerResourceArn;
  }
  export interface DeleteVpcIngressConnectionResponse {
    /**
     * A description of the App Runner VPC Ingress Connection that this request just deleted.
     */
    VpcIngressConnection: VpcIngressConnection;
  }
  export interface DescribeAutoScalingConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner auto scaling configuration that you want a description for. The ARN can be a full auto scaling configuration ARN, or a partial ARN ending with either .../name  or .../name/revision . If a revision isn't specified, the latest active revision is described.
     */
    AutoScalingConfigurationArn: AppRunnerResourceArn;
  }
  export interface DescribeAutoScalingConfigurationResponse {
    /**
     * A full description of the App Runner auto scaling configuration that you specified in this request.
     */
    AutoScalingConfiguration: AutoScalingConfiguration;
  }
  export type DescribeCustomDomainsMaxResults = number;
  export interface DescribeCustomDomainsRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want associated custom domain names to be described for.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A token from a previous result page. It's used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones that are specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: String;
    /**
     * The maximum number of results that each response (result page) can include. It's used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: DescribeCustomDomainsMaxResults;
  }
  export interface DescribeCustomDomainsResponse {
    /**
     * The App Runner subdomain of the App Runner service. The associated custom domain names are mapped to this target name.
     */
    DNSTarget: String;
    /**
     * The Amazon Resource Name (ARN) of the App Runner service whose associated custom domain names you want to describe.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A list of descriptions of custom domain names that are associated with the service. In a paginated request, the request returns up to MaxResults records per call.
     */
    CustomDomains: CustomDomainList;
    /**
     * DNS Target records for the custom domains of this Amazon VPC. 
     */
    VpcDNSTargets: VpcDNSTargetList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. It's returned in a paginated request.
     */
    NextToken?: String;
  }
  export interface DescribeObservabilityConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner observability configuration that you want a description for. The ARN can be a full observability configuration ARN, or a partial ARN ending with either .../name  or .../name/revision . If a revision isn't specified, the latest active revision is described.
     */
    ObservabilityConfigurationArn: AppRunnerResourceArn;
  }
  export interface DescribeObservabilityConfigurationResponse {
    /**
     * A full description of the App Runner observability configuration that you specified in this request.
     */
    ObservabilityConfiguration: ObservabilityConfiguration;
  }
  export interface DescribeServiceRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want a description for.
     */
    ServiceArn: AppRunnerResourceArn;
  }
  export interface DescribeServiceResponse {
    /**
     * A full description of the App Runner service that you specified in this request.
     */
    Service: Service;
  }
  export interface DescribeVpcConnectorRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner VPC connector that you want a description for. The ARN must be a full VPC connector ARN.
     */
    VpcConnectorArn: AppRunnerResourceArn;
  }
  export interface DescribeVpcConnectorResponse {
    /**
     * A description of the App Runner VPC connector that you specified in this request.
     */
    VpcConnector: VpcConnector;
  }
  export interface DescribeVpcIngressConnectionRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner VPC Ingress Connection that you want a description for.
     */
    VpcIngressConnectionArn: AppRunnerResourceArn;
  }
  export interface DescribeVpcIngressConnectionResponse {
    /**
     * A description of the App Runner VPC Ingress Connection that you specified in this request.
     */
    VpcIngressConnection: VpcIngressConnection;
  }
  export interface DisassociateCustomDomainRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to disassociate a custom domain name from.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * The domain name that you want to disassociate from the App Runner service.
     */
    DomainName: DomainName;
  }
  export interface DisassociateCustomDomainResponse {
    /**
     * The App Runner subdomain of the App Runner service. The disassociated custom domain name was mapped to this target name.
     */
    DNSTarget: String;
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that a custom domain name is disassociated from.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A description of the domain name that's being disassociated.
     */
    CustomDomain: CustomDomain;
    /**
     * DNS Target records for the custom domains of this Amazon VPC. 
     */
    VpcDNSTargets: VpcDNSTargetList;
  }
  export type DomainName = string;
  export interface EgressConfiguration {
    /**
     * The type of egress configuration. Set to DEFAULT for access to resources hosted on public networks. Set to VPC to associate your service to a custom VPC specified by VpcConnectorArn.
     */
    EgressType?: EgressType;
    /**
     * The Amazon Resource Name (ARN) of the App Runner VPC connector that you want to associate with your App Runner service. Only valid when EgressType = VPC.
     */
    VpcConnectorArn?: AppRunnerResourceArn;
  }
  export type EgressType = "DEFAULT"|"VPC"|string;
  export interface EncryptionConfiguration {
    /**
     * The ARN of the KMS key that's used for encryption.
     */
    KmsKey: KmsKeyArn;
  }
  export type HasAssociatedService = boolean;
  export interface HealthCheckConfiguration {
    /**
     * The IP protocol that App Runner uses to perform health checks for your service. If you set Protocol to HTTP, App Runner sends health check requests to the HTTP path specified by Path. Default: TCP 
     */
    Protocol?: HealthCheckProtocol;
    /**
     * The URL that health check requests are sent to.  Path is only applicable when you set Protocol to HTTP. Default: "/" 
     */
    Path?: HealthCheckPath;
    /**
     * The time interval, in seconds, between health checks. Default: 5 
     */
    Interval?: HealthCheckInterval;
    /**
     * The time, in seconds, to wait for a health check response before deciding it failed. Default: 2 
     */
    Timeout?: HealthCheckTimeout;
    /**
     * The number of consecutive checks that must succeed before App Runner decides that the service is healthy. Default: 1 
     */
    HealthyThreshold?: HealthCheckHealthyThreshold;
    /**
     * The number of consecutive checks that must fail before App Runner decides that the service is unhealthy. Default: 5 
     */
    UnhealthyThreshold?: HealthCheckUnhealthyThreshold;
  }
  export type HealthCheckHealthyThreshold = number;
  export type HealthCheckInterval = number;
  export type HealthCheckPath = string;
  export type HealthCheckProtocol = "TCP"|"HTTP"|string;
  export type HealthCheckTimeout = number;
  export type HealthCheckUnhealthyThreshold = number;
  export interface ImageConfiguration {
    /**
     * Environment variables that are available to your running App Runner service. An array of key-value pairs.
     */
    RuntimeEnvironmentVariables?: RuntimeEnvironmentVariables;
    /**
     * An optional command that App Runner runs to start the application in the source image. If specified, this command overrides the Docker image’s default start command.
     */
    StartCommand?: StartCommand;
    /**
     * The port that your application listens to in the container. Default: 8080 
     */
    Port?: String;
    /**
     * An array of key-value pairs representing the secrets and parameters that get referenced to your service as an environment variable. The supported values are either the full Amazon Resource Name (ARN) of the Secrets Manager secret or the full ARN of the parameter in the Amazon Web Services Systems Manager Parameter Store.     If the Amazon Web Services Systems Manager Parameter Store parameter exists in the same Amazon Web Services Region as the service that you're launching, you can use either the full ARN or name of the secret. If the parameter exists in a different Region, then the full ARN must be specified.     Currently, cross account referencing of Amazon Web Services Systems Manager Parameter Store parameter is not supported.    
     */
    RuntimeEnvironmentSecrets?: RuntimeEnvironmentSecrets;
  }
  export type ImageIdentifier = string;
  export interface ImageRepository {
    /**
     * The identifier of an image. For an image in Amazon Elastic Container Registry (Amazon ECR), this is an image name. For the image name format, see Pulling an image in the Amazon ECR User Guide.
     */
    ImageIdentifier: ImageIdentifier;
    /**
     * Configuration for running the identified image.
     */
    ImageConfiguration?: ImageConfiguration;
    /**
     * The type of the image repository. This reflects the repository provider and whether the repository is private or public.
     */
    ImageRepositoryType: ImageRepositoryType;
  }
  export type ImageRepositoryType = "ECR"|"ECR_PUBLIC"|string;
  export interface IngressConfiguration {
    /**
     * Specifies whether your App Runner service is publicly accessible. To make the service publicly accessible set it to True. To make the service privately accessible, from only within an Amazon VPC set it to False. 
     */
    IsPubliclyAccessible?: Boolean;
  }
  export interface IngressVpcConfiguration {
    /**
     * The ID of the VPC that is used for the VPC endpoint.
     */
    VpcId?: String;
    /**
     * The ID of the VPC endpoint that your App Runner service connects to. 
     */
    VpcEndpointId?: String;
  }
  export interface InstanceConfiguration {
    /**
     * The number of CPU units reserved for each instance of your App Runner service. Default: 1 vCPU 
     */
    Cpu?: Cpu;
    /**
     * The amount of memory, in MB or GB, reserved for each instance of your App Runner service. Default: 2 GB 
     */
    Memory?: Memory;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that provides permissions to your App Runner service. These are permissions that your code needs when it calls any Amazon Web Services APIs.
     */
    InstanceRoleArn?: RoleArn;
  }
  export type Integer = number;
  export type IsDefault = boolean;
  export type KmsKeyArn = string;
  export type Latest = boolean;
  export interface ListAutoScalingConfigurationsRequest {
    /**
     * The name of the App Runner auto scaling configuration that you want to list. If specified, App Runner lists revisions that share this name. If not specified, App Runner returns revisions of all active configurations.
     */
    AutoScalingConfigurationName?: AutoScalingConfigurationName;
    /**
     * Set to true to list only the latest revision for each requested configuration name. Set to false to list all revisions for each requested configuration name. Default: true 
     */
    LatestOnly?: Boolean;
    /**
     * The maximum number of results to include in each response (result page). It's used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: MaxResults;
    /**
     * A token from a previous result page. It's used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones that are specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: NextToken;
  }
  export interface ListAutoScalingConfigurationsResponse {
    /**
     * A list of summary information records for auto scaling configurations. In a paginated request, the request returns up to MaxResults records for each call.
     */
    AutoScalingConfigurationSummaryList: AutoScalingConfigurationSummaryList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. It's returned in a paginated request.
     */
    NextToken?: NextToken;
  }
  export interface ListConnectionsRequest {
    /**
     * If specified, only this connection is returned. If not specified, the result isn't filtered by name.
     */
    ConnectionName?: ConnectionName;
    /**
     * The maximum number of results to include in each response (result page). Used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: MaxResults;
    /**
     * A token from a previous result page. Used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: NextToken;
  }
  export interface ListConnectionsResponse {
    /**
     * A list of summary information records for connections. In a paginated request, the request returns up to MaxResults records for each call.
     */
    ConnectionSummaryList: ConnectionSummaryList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. Returned in a paginated request.
     */
    NextToken?: NextToken;
  }
  export interface ListObservabilityConfigurationsRequest {
    /**
     * The name of the App Runner observability configuration that you want to list. If specified, App Runner lists revisions that share this name. If not specified, App Runner returns revisions of all active configurations.
     */
    ObservabilityConfigurationName?: ObservabilityConfigurationName;
    /**
     * Set to true to list only the latest revision for each requested configuration name. Set to false to list all revisions for each requested configuration name. Default: true 
     */
    LatestOnly?: Boolean;
    /**
     * The maximum number of results to include in each response (result page). It's used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: MaxResults;
    /**
     * A token from a previous result page. It's used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones that are specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: NextToken;
  }
  export interface ListObservabilityConfigurationsResponse {
    /**
     * A list of summary information records for observability configurations. In a paginated request, the request returns up to MaxResults records for each call.
     */
    ObservabilityConfigurationSummaryList: ObservabilityConfigurationSummaryList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. It's returned in a paginated request.
     */
    NextToken?: NextToken;
  }
  export type ListOperationsMaxResults = number;
  export interface ListOperationsRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want a list of operations for.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A token from a previous result page. It's used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: String;
    /**
     * The maximum number of results to include in each response (result page). It's used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: ListOperationsMaxResults;
  }
  export interface ListOperationsResponse {
    /**
     * A list of operation summary information records. In a paginated request, the request returns up to MaxResults records for each call.
     */
    OperationSummaryList?: OperationSummaryList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. It's returned in a paginated request.
     */
    NextToken?: String;
  }
  export interface ListServicesForAutoScalingConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner auto scaling configuration that you want to list the services for. The ARN can be a full auto scaling configuration ARN, or a partial ARN ending with either .../name  or .../name/revision . If a revision isn't specified, the latest active revision is used.
     */
    AutoScalingConfigurationArn: AppRunnerResourceArn;
    /**
     * The maximum number of results to include in each response (result page). It's used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: MaxResults;
    /**
     * A token from a previous result page. It's used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: NextToken;
  }
  export interface ListServicesForAutoScalingConfigurationResponse {
    /**
     * A list of service ARN records. In a paginated request, the request returns up to MaxResults records for each call.
     */
    ServiceArnList: ServiceArnList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. It's returned in a paginated request.
     */
    NextToken?: NextToken;
  }
  export interface ListServicesRequest {
    /**
     * A token from a previous result page. Used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: String;
    /**
     * The maximum number of results to include in each response (result page). It's used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: ServiceMaxResults;
  }
  export interface ListServicesResponse {
    /**
     * A list of service summary information records. In a paginated request, the request returns up to MaxResults records for each call.
     */
    ServiceSummaryList: ServiceSummaryList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. It's returned in a paginated request.
     */
    NextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that a tag list is requested for. It must be the ARN of an App Runner resource.
     */
    ResourceArn: AppRunnerResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of the tag key-value pairs that are associated with the resource.
     */
    Tags?: TagList;
  }
  export interface ListVpcConnectorsRequest {
    /**
     * The maximum number of results to include in each response (result page). It's used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: MaxResults;
    /**
     * A token from a previous result page. It's used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones that are specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: NextToken;
  }
  export interface ListVpcConnectorsResponse {
    /**
     * A list of information records for VPC connectors. In a paginated request, the request returns up to MaxResults records for each call.
     */
    VpcConnectors: VpcConnectors;
    /**
     * The token that you can pass in a subsequent request to get the next result page. It's returned in a paginated request.
     */
    NextToken?: NextToken;
  }
  export interface ListVpcIngressConnectionsFilter {
    /**
     * The Amazon Resource Name (ARN) of a service to filter by. 
     */
    ServiceArn?: AppRunnerResourceArn;
    /**
     * The ID of a VPC Endpoint to filter by. 
     */
    VpcEndpointId?: String;
  }
  export interface ListVpcIngressConnectionsRequest {
    /**
     * The VPC Ingress Connections to be listed based on either the Service Arn or Vpc Endpoint Id, or both.
     */
    Filter?: ListVpcIngressConnectionsFilter;
    /**
     * The maximum number of results to include in each response (result page). It's used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: MaxResults;
    /**
     * A token from a previous result page. It's used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones that are specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: NextToken;
  }
  export interface ListVpcIngressConnectionsResponse {
    /**
     * A list of summary information records for VPC Ingress Connections. In a paginated request, the request returns up to MaxResults records for each call.
     */
    VpcIngressConnectionSummaryList: VpcIngressConnectionSummaryList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. It's returned in a paginated request.
     */
    NextToken?: NextToken;
  }
  export type MaxConcurrency = number;
  export type MaxResults = number;
  export type MaxSize = number;
  export type Memory = string;
  export type MinSize = number;
  export interface NetworkConfiguration {
    /**
     * Network configuration settings for outbound message traffic.
     */
    EgressConfiguration?: EgressConfiguration;
    /**
     * Network configuration settings for inbound message traffic.
     */
    IngressConfiguration?: IngressConfiguration;
  }
  export type NextToken = string;
  export type NullableBoolean = boolean;
  export interface ObservabilityConfiguration {
    /**
     * The Amazon Resource Name (ARN) of this observability configuration.
     */
    ObservabilityConfigurationArn?: AppRunnerResourceArn;
    /**
     * The customer-provided observability configuration name. It can be used in multiple revisions of a configuration.
     */
    ObservabilityConfigurationName?: ObservabilityConfigurationName;
    /**
     * The configuration of the tracing feature within this observability configuration. If not specified, tracing isn't enabled.
     */
    TraceConfiguration?: TraceConfiguration;
    /**
     * The revision of this observability configuration. It's unique among all the active configurations ("Status": "ACTIVE") that share the same ObservabilityConfigurationName.
     */
    ObservabilityConfigurationRevision?: Integer;
    /**
     * It's set to true for the configuration with the highest Revision among all configurations that share the same ObservabilityConfigurationName. It's set to false otherwise.
     */
    Latest?: Boolean;
    /**
     * The current state of the observability configuration. If the status of a configuration revision is INACTIVE, it was deleted and can't be used. Inactive configuration revisions are permanently removed some time after they are deleted.
     */
    Status?: ObservabilityConfigurationStatus;
    /**
     * The time when the observability configuration was created. It's in Unix time stamp format.
     */
    CreatedAt?: Timestamp;
    /**
     * The time when the observability configuration was deleted. It's in Unix time stamp format.
     */
    DeletedAt?: Timestamp;
  }
  export type ObservabilityConfigurationName = string;
  export type ObservabilityConfigurationStatus = "ACTIVE"|"INACTIVE"|string;
  export interface ObservabilityConfigurationSummary {
    /**
     * The Amazon Resource Name (ARN) of this observability configuration.
     */
    ObservabilityConfigurationArn?: AppRunnerResourceArn;
    /**
     * The customer-provided observability configuration name. It can be used in multiple revisions of a configuration.
     */
    ObservabilityConfigurationName?: ObservabilityConfigurationName;
    /**
     * The revision of this observability configuration. It's unique among all the active configurations ("Status": "ACTIVE") that share the same ObservabilityConfigurationName.
     */
    ObservabilityConfigurationRevision?: Integer;
  }
  export type ObservabilityConfigurationSummaryList = ObservabilityConfigurationSummary[];
  export type OperationStatus = "PENDING"|"IN_PROGRESS"|"FAILED"|"SUCCEEDED"|"ROLLBACK_IN_PROGRESS"|"ROLLBACK_FAILED"|"ROLLBACK_SUCCEEDED"|string;
  export interface OperationSummary {
    /**
     * A unique ID of this operation. It's unique in the scope of the App Runner service.
     */
    Id?: UUID;
    /**
     * The type of operation. It indicates a specific action that occured.
     */
    Type?: OperationType;
    /**
     * The current state of the operation.
     */
    Status?: OperationStatus;
    /**
     * The Amazon Resource Name (ARN) of the resource that the operation acted on (for example, an App Runner service).
     */
    TargetArn?: AppRunnerResourceArn;
    /**
     * The time when the operation started. It's in the Unix time stamp format.
     */
    StartedAt?: Timestamp;
    /**
     * The time when the operation ended. It's in the Unix time stamp format.
     */
    EndedAt?: Timestamp;
    /**
     * The time when the operation was last updated. It's in the Unix time stamp format.
     */
    UpdatedAt?: Timestamp;
  }
  export type OperationSummaryList = OperationSummary[];
  export type OperationType = "START_DEPLOYMENT"|"CREATE_SERVICE"|"PAUSE_SERVICE"|"RESUME_SERVICE"|"DELETE_SERVICE"|"UPDATE_SERVICE"|string;
  export interface PauseServiceRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to pause.
     */
    ServiceArn: AppRunnerResourceArn;
  }
  export interface PauseServiceResponse {
    /**
     * A description of the App Runner service that this request just paused.
     */
    Service: Service;
    /**
     * The unique ID of the asynchronous operation that this request started. You can use it combined with the ListOperations call to track the operation's progress.
     */
    OperationId?: UUID;
  }
  export type ProviderType = "GITHUB"|"BITBUCKET"|string;
  export interface ResumeServiceRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to resume.
     */
    ServiceArn: AppRunnerResourceArn;
  }
  export interface ResumeServiceResponse {
    /**
     * A description of the App Runner service that this request just resumed.
     */
    Service: Service;
    /**
     * The unique ID of the asynchronous operation that this request started. You can use it combined with the ListOperations call to track the operation's progress.
     */
    OperationId?: UUID;
  }
  export type RoleArn = string;
  export type Runtime = "PYTHON_3"|"NODEJS_12"|"NODEJS_14"|"CORRETTO_8"|"CORRETTO_11"|"NODEJS_16"|"GO_1"|"DOTNET_6"|"PHP_81"|"RUBY_31"|string;
  export type RuntimeEnvironmentSecrets = {[key: string]: RuntimeEnvironmentSecretsValue};
  export type RuntimeEnvironmentSecretsName = string;
  export type RuntimeEnvironmentSecretsValue = string;
  export type RuntimeEnvironmentVariables = {[key: string]: RuntimeEnvironmentVariablesValue};
  export type RuntimeEnvironmentVariablesKey = string;
  export type RuntimeEnvironmentVariablesValue = string;
  export interface Service {
    /**
     * The customer-provided service name.
     */
    ServiceName: ServiceName;
    /**
     * An ID that App Runner generated for this service. It's unique within the Amazon Web Services Region.
     */
    ServiceId: ServiceId;
    /**
     * The Amazon Resource Name (ARN) of this service.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A subdomain URL that App Runner generated for this service. You can use this URL to access your service web application.
     */
    ServiceUrl?: String;
    /**
     * The time when the App Runner service was created. It's in the Unix time stamp format.
     */
    CreatedAt: Timestamp;
    /**
     * The time when the App Runner service was last updated at. It's in the Unix time stamp format.
     */
    UpdatedAt: Timestamp;
    /**
     * The time when the App Runner service was deleted. It's in the Unix time stamp format.
     */
    DeletedAt?: Timestamp;
    /**
     * The current state of the App Runner service. These particular values mean the following.    CREATE_FAILED – The service failed to create. The failed service isn't usable, and still counts towards your service quota. To troubleshoot this failure, read the failure events and logs, change any parameters that need to be fixed, and rebuild your service using UpdateService.    DELETE_FAILED – The service failed to delete and can't be successfully recovered. Retry the service deletion call to ensure that all related resources are removed.  
     */
    Status: ServiceStatus;
    /**
     * The source deployed to the App Runner service. It can be a code or an image repository.
     */
    SourceConfiguration: SourceConfiguration;
    /**
     * The runtime configuration of instances (scaling units) of this service.
     */
    InstanceConfiguration: InstanceConfiguration;
    /**
     * The encryption key that App Runner uses to encrypt the service logs and the copy of the source repository that App Runner maintains for the service. It can be either a customer-provided encryption key or an Amazon Web Services managed key.
     */
    EncryptionConfiguration?: EncryptionConfiguration;
    /**
     * The settings for the health check that App Runner performs to monitor the health of this service.
     */
    HealthCheckConfiguration?: HealthCheckConfiguration;
    /**
     * Summary information for the App Runner automatic scaling configuration resource that's associated with this service.
     */
    AutoScalingConfigurationSummary: AutoScalingConfigurationSummary;
    /**
     * Configuration settings related to network traffic of the web application that this service runs.
     */
    NetworkConfiguration: NetworkConfiguration;
    /**
     * The observability configuration of this service.
     */
    ObservabilityConfiguration?: ServiceObservabilityConfiguration;
  }
  export type ServiceArnList = AppRunnerResourceArn[];
  export type ServiceId = string;
  export type ServiceMaxResults = number;
  export type ServiceName = string;
  export interface ServiceObservabilityConfiguration {
    /**
     * When true, an observability configuration resource is associated with the service, and an ObservabilityConfigurationArn is specified.
     */
    ObservabilityEnabled: Boolean;
    /**
     * The Amazon Resource Name (ARN) of the observability configuration that is associated with the service. Specified only when ObservabilityEnabled is true. Specify an ARN with a name and a revision number to associate that revision. For example: arn:aws:apprunner:us-east-1:123456789012:observabilityconfiguration/xray-tracing/3  Specify just the name to associate the latest revision. For example: arn:aws:apprunner:us-east-1:123456789012:observabilityconfiguration/xray-tracing 
     */
    ObservabilityConfigurationArn?: AppRunnerResourceArn;
  }
  export type ServiceStatus = "CREATE_FAILED"|"RUNNING"|"DELETED"|"DELETE_FAILED"|"PAUSED"|"OPERATION_IN_PROGRESS"|string;
  export interface ServiceSummary {
    /**
     * The customer-provided service name.
     */
    ServiceName?: ServiceName;
    /**
     * An ID that App Runner generated for this service. It's unique within the Amazon Web Services Region.
     */
    ServiceId?: ServiceId;
    /**
     * The Amazon Resource Name (ARN) of this service.
     */
    ServiceArn?: AppRunnerResourceArn;
    /**
     * A subdomain URL that App Runner generated for this service. You can use this URL to access your service web application.
     */
    ServiceUrl?: String;
    /**
     * The time when the App Runner service was created. It's in the Unix time stamp format.
     */
    CreatedAt?: Timestamp;
    /**
     * The time when the App Runner service was last updated. It's in theUnix time stamp format.
     */
    UpdatedAt?: Timestamp;
    /**
     * The current state of the App Runner service. These particular values mean the following.    CREATE_FAILED – The service failed to create. The failed service isn't usable, and still counts towards your service quota. To troubleshoot this failure, read the failure events and logs, change any parameters that need to be fixed, and rebuild your service using UpdateService.    DELETE_FAILED – The service failed to delete and can't be successfully recovered. Retry the service deletion call to ensure that all related resources are removed.  
     */
    Status?: ServiceStatus;
  }
  export type ServiceSummaryList = ServiceSummary[];
  export interface SourceCodeVersion {
    /**
     * The type of version identifier. For a git-based repository, branches represent versions.
     */
    Type: SourceCodeVersionType;
    /**
     * A source code version. For a git-based repository, a branch name maps to a specific version. App Runner uses the most recent commit to the branch.
     */
    Value: String;
  }
  export type SourceCodeVersionType = "BRANCH"|string;
  export interface SourceConfiguration {
    /**
     * The description of a source code repository. You must provide either this member or ImageRepository (but not both).
     */
    CodeRepository?: CodeRepository;
    /**
     * The description of a source image repository. You must provide either this member or CodeRepository (but not both).
     */
    ImageRepository?: ImageRepository;
    /**
     * If true, continuous integration from the source repository is enabled for the App Runner service. Each repository change (including any source code commit or new image version) starts a deployment. Default: App Runner sets to false for a source image that uses an ECR Public repository or an ECR repository that's in an Amazon Web Services account other than the one that the service is in. App Runner sets to true in all other cases (which currently include a source code repository or a source image using a same-account ECR repository).
     */
    AutoDeploymentsEnabled?: NullableBoolean;
    /**
     * Describes the resources that are needed to authenticate access to some source repositories.
     */
    AuthenticationConfiguration?: AuthenticationConfiguration;
  }
  export type SourceDirectory = string;
  export type StartCommand = string;
  export interface StartDeploymentRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to manually deploy to.
     */
    ServiceArn: AppRunnerResourceArn;
  }
  export interface StartDeploymentResponse {
    /**
     * The unique ID of the asynchronous operation that this request started. You can use it combined with the ListOperations call to track the operation's progress.
     */
    OperationId: UUID;
  }
  export type String = string;
  export type StringList = String[];
  export interface Tag {
    /**
     * The key of the tag.
     */
    Key?: TagKey;
    /**
     * The value of the tag.
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to update tags for. It must be the ARN of an App Runner resource.
     */
    ResourceArn: AppRunnerResourceArn;
    /**
     * A list of tag key-value pairs to add or update. If a key is new to the resource, the tag is added with the provided value. If a key is already associated with the resource, the value of the tag is updated.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface TraceConfiguration {
    /**
     * The implementation provider chosen for tracing App Runner services.
     */
    Vendor: TracingVendor;
  }
  export type TracingVendor = "AWSXRAY"|string;
  export type UUID = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to remove tags from. It must be the ARN of an App Runner resource.
     */
    ResourceArn: AppRunnerResourceArn;
    /**
     * A list of tag keys that you want to remove.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDefaultAutoScalingConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner auto scaling configuration that you want to set as the default. The ARN can be a full auto scaling configuration ARN, or a partial ARN ending with either .../name  or .../name/revision . If a revision isn't specified, the latest active revision is set as the default.
     */
    AutoScalingConfigurationArn: AppRunnerResourceArn;
  }
  export interface UpdateDefaultAutoScalingConfigurationResponse {
    /**
     * A description of the App Runner auto scaling configuration that was set as default.
     */
    AutoScalingConfiguration: AutoScalingConfiguration;
  }
  export interface UpdateServiceRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to update.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * The source configuration to apply to the App Runner service. You can change the configuration of the code or image repository that the service uses. However, you can't switch from code to image or the other way around. This means that you must provide the same structure member of SourceConfiguration that you originally included when you created the service. Specifically, you can include either CodeRepository or ImageRepository. To update the source configuration, set the values to members of the structure that you include.
     */
    SourceConfiguration?: SourceConfiguration;
    /**
     * The runtime configuration to apply to instances (scaling units) of your service.
     */
    InstanceConfiguration?: InstanceConfiguration;
    /**
     * The Amazon Resource Name (ARN) of an App Runner automatic scaling configuration resource that you want to associate with the App Runner service.
     */
    AutoScalingConfigurationArn?: AppRunnerResourceArn;
    /**
     * The settings for the health check that App Runner performs to monitor the health of the App Runner service.
     */
    HealthCheckConfiguration?: HealthCheckConfiguration;
    /**
     * Configuration settings related to network traffic of the web application that the App Runner service runs.
     */
    NetworkConfiguration?: NetworkConfiguration;
    /**
     * The observability configuration of your service.
     */
    ObservabilityConfiguration?: ServiceObservabilityConfiguration;
  }
  export interface UpdateServiceResponse {
    /**
     * A description of the App Runner service updated by this request. All configuration values in the returned Service structure reflect configuration changes that are being applied by this request.
     */
    Service: Service;
    /**
     * The unique ID of the asynchronous operation that this request started. You can use it combined with the ListOperations call to track the operation's progress.
     */
    OperationId: UUID;
  }
  export interface UpdateVpcIngressConnectionRequest {
    /**
     * The Amazon Resource Name (Arn) for the App Runner VPC Ingress Connection resource that you want to update.
     */
    VpcIngressConnectionArn: AppRunnerResourceArn;
    /**
     * Specifications for the customer’s Amazon VPC and the related Amazon Web Services PrivateLink VPC endpoint that are used to update the VPC Ingress Connection resource.
     */
    IngressVpcConfiguration: IngressVpcConfiguration;
  }
  export interface UpdateVpcIngressConnectionResponse {
    /**
     * A description of the App Runner VPC Ingress Connection resource that's updated by this request.
     */
    VpcIngressConnection: VpcIngressConnection;
  }
  export interface VpcConnector {
    /**
     * The customer-provided VPC connector name.
     */
    VpcConnectorName?: VpcConnectorName;
    /**
     * The Amazon Resource Name (ARN) of this VPC connector.
     */
    VpcConnectorArn?: AppRunnerResourceArn;
    /**
     * The revision of this VPC connector. It's unique among all the active connectors ("Status": "ACTIVE") that share the same Name.  At this time, App Runner supports only one revision per name. 
     */
    VpcConnectorRevision?: Integer;
    /**
     * A list of IDs of subnets that App Runner uses for your service. All IDs are of subnets of a single Amazon VPC.
     */
    Subnets?: StringList;
    /**
     * A list of IDs of security groups that App Runner uses for access to Amazon Web Services resources under the specified subnets. If not specified, App Runner uses the default security group of the Amazon VPC. The default security group allows all outbound traffic.
     */
    SecurityGroups?: StringList;
    /**
     * The current state of the VPC connector. If the status of a connector revision is INACTIVE, it was deleted and can't be used. Inactive connector revisions are permanently removed some time after they are deleted.
     */
    Status?: VpcConnectorStatus;
    /**
     * The time when the VPC connector was created. It's in Unix time stamp format.
     */
    CreatedAt?: Timestamp;
    /**
     * The time when the VPC connector was deleted. It's in Unix time stamp format.
     */
    DeletedAt?: Timestamp;
  }
  export type VpcConnectorName = string;
  export type VpcConnectorStatus = "ACTIVE"|"INACTIVE"|string;
  export type VpcConnectors = VpcConnector[];
  export interface VpcDNSTarget {
    /**
     * The Amazon Resource Name (ARN) of the VPC Ingress Connection that is associated with your service.
     */
    VpcIngressConnectionArn?: AppRunnerResourceArn;
    /**
     * The ID of the Amazon VPC that is associated with the custom domain name of the target DNS.
     */
    VpcId?: String;
    /**
     * The domain name of your target DNS that is associated with the Amazon VPC.
     */
    DomainName?: DomainName;
  }
  export type VpcDNSTargetList = VpcDNSTarget[];
  export interface VpcIngressConnection {
    /**
     * The Amazon Resource Name (ARN) of the VPC Ingress Connection. 
     */
    VpcIngressConnectionArn?: AppRunnerResourceArn;
    /**
     * The customer-provided VPC Ingress Connection name.
     */
    VpcIngressConnectionName?: VpcIngressConnectionName;
    /**
     * The Amazon Resource Name (ARN) of the service associated with the VPC Ingress Connection. 
     */
    ServiceArn?: AppRunnerResourceArn;
    /**
     * The current status of the VPC Ingress Connection. The VPC Ingress Connection displays one of the following statuses: AVAILABLE, PENDING_CREATION, PENDING_UPDATE, PENDING_DELETION,FAILED_CREATION, FAILED_UPDATE, FAILED_DELETION, and DELETED.. 
     */
    Status?: VpcIngressConnectionStatus;
    /**
     * The Account Id you use to create the VPC Ingress Connection resource.
     */
    AccountId?: CustomerAccountId;
    /**
     * The domain name associated with the VPC Ingress Connection resource.
     */
    DomainName?: DomainName;
    /**
     * Specifications for the customer’s VPC and related PrivateLink VPC endpoint that are used to associate with the VPC Ingress Connection resource.
     */
    IngressVpcConfiguration?: IngressVpcConfiguration;
    /**
     * The time when the VPC Ingress Connection was created. It's in the Unix time stamp format.    Type: Timestamp     Required: Yes   
     */
    CreatedAt?: Timestamp;
    /**
     * The time when the App Runner service was deleted. It's in the Unix time stamp format.    Type: Timestamp     Required: No   
     */
    DeletedAt?: Timestamp;
  }
  export type VpcIngressConnectionName = string;
  export type VpcIngressConnectionStatus = "AVAILABLE"|"PENDING_CREATION"|"PENDING_UPDATE"|"PENDING_DELETION"|"FAILED_CREATION"|"FAILED_UPDATE"|"FAILED_DELETION"|"DELETED"|string;
  export interface VpcIngressConnectionSummary {
    /**
     * The Amazon Resource Name (ARN) of the VPC Ingress Connection. 
     */
    VpcIngressConnectionArn?: AppRunnerResourceArn;
    /**
     * The Amazon Resource Name (ARN) of the service associated with the VPC Ingress Connection. 
     */
    ServiceArn?: AppRunnerResourceArn;
  }
  export type VpcIngressConnectionSummaryList = VpcIngressConnectionSummary[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-05-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AppRunner client.
   */
  export import Types = AppRunner;
}
export = AppRunner;
