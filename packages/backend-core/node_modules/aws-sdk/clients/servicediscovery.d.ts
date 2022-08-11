import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ServiceDiscovery extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ServiceDiscovery.Types.ClientConfiguration)
  config: Config & ServiceDiscovery.Types.ClientConfiguration;
  /**
   * Creates an HTTP namespace. Service instances registered using an HTTP namespace can be discovered using a DiscoverInstances request but can't be discovered using DNS. For the current quota on the number of namespaces that you can create using the same account, see Cloud Map quotas in the Cloud Map Developer Guide.
   */
  createHttpNamespace(params: ServiceDiscovery.Types.CreateHttpNamespaceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.CreateHttpNamespaceResponse) => void): Request<ServiceDiscovery.Types.CreateHttpNamespaceResponse, AWSError>;
  /**
   * Creates an HTTP namespace. Service instances registered using an HTTP namespace can be discovered using a DiscoverInstances request but can't be discovered using DNS. For the current quota on the number of namespaces that you can create using the same account, see Cloud Map quotas in the Cloud Map Developer Guide.
   */
  createHttpNamespace(callback?: (err: AWSError, data: ServiceDiscovery.Types.CreateHttpNamespaceResponse) => void): Request<ServiceDiscovery.Types.CreateHttpNamespaceResponse, AWSError>;
  /**
   * Creates a private namespace based on DNS, which is visible only inside a specified Amazon VPC. The namespace defines your service naming scheme. For example, if you name your namespace example.com and name your service backend, the resulting DNS name for the service is backend.example.com. Service instances that are registered using a private DNS namespace can be discovered using either a DiscoverInstances request or using DNS. For the current quota on the number of namespaces that you can create using the same account, see Cloud Map quotas in the Cloud Map Developer Guide.
   */
  createPrivateDnsNamespace(params: ServiceDiscovery.Types.CreatePrivateDnsNamespaceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.CreatePrivateDnsNamespaceResponse) => void): Request<ServiceDiscovery.Types.CreatePrivateDnsNamespaceResponse, AWSError>;
  /**
   * Creates a private namespace based on DNS, which is visible only inside a specified Amazon VPC. The namespace defines your service naming scheme. For example, if you name your namespace example.com and name your service backend, the resulting DNS name for the service is backend.example.com. Service instances that are registered using a private DNS namespace can be discovered using either a DiscoverInstances request or using DNS. For the current quota on the number of namespaces that you can create using the same account, see Cloud Map quotas in the Cloud Map Developer Guide.
   */
  createPrivateDnsNamespace(callback?: (err: AWSError, data: ServiceDiscovery.Types.CreatePrivateDnsNamespaceResponse) => void): Request<ServiceDiscovery.Types.CreatePrivateDnsNamespaceResponse, AWSError>;
  /**
   * Creates a public namespace based on DNS, which is visible on the internet. The namespace defines your service naming scheme. For example, if you name your namespace example.com and name your service backend, the resulting DNS name for the service is backend.example.com. You can discover instances that were registered with a public DNS namespace by using either a DiscoverInstances request or using DNS. For the current quota on the number of namespaces that you can create using the same account, see Cloud Map quotas in the Cloud Map Developer Guide.
   */
  createPublicDnsNamespace(params: ServiceDiscovery.Types.CreatePublicDnsNamespaceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.CreatePublicDnsNamespaceResponse) => void): Request<ServiceDiscovery.Types.CreatePublicDnsNamespaceResponse, AWSError>;
  /**
   * Creates a public namespace based on DNS, which is visible on the internet. The namespace defines your service naming scheme. For example, if you name your namespace example.com and name your service backend, the resulting DNS name for the service is backend.example.com. You can discover instances that were registered with a public DNS namespace by using either a DiscoverInstances request or using DNS. For the current quota on the number of namespaces that you can create using the same account, see Cloud Map quotas in the Cloud Map Developer Guide.
   */
  createPublicDnsNamespace(callback?: (err: AWSError, data: ServiceDiscovery.Types.CreatePublicDnsNamespaceResponse) => void): Request<ServiceDiscovery.Types.CreatePublicDnsNamespaceResponse, AWSError>;
  /**
   * Creates a service. This action defines the configuration for the following entities:   For public and private DNS namespaces, one of the following combinations of DNS records in Amazon Route 53:    A     AAAA     A and AAAA     SRV     CNAME      Optionally, a health check   After you create the service, you can submit a RegisterInstance request, and Cloud Map uses the values in the configuration to create the specified entities. For the current quota on the number of instances that you can register using the same namespace and using the same service, see Cloud Map quotas in the Cloud Map Developer Guide.
   */
  createService(params: ServiceDiscovery.Types.CreateServiceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.CreateServiceResponse) => void): Request<ServiceDiscovery.Types.CreateServiceResponse, AWSError>;
  /**
   * Creates a service. This action defines the configuration for the following entities:   For public and private DNS namespaces, one of the following combinations of DNS records in Amazon Route 53:    A     AAAA     A and AAAA     SRV     CNAME      Optionally, a health check   After you create the service, you can submit a RegisterInstance request, and Cloud Map uses the values in the configuration to create the specified entities. For the current quota on the number of instances that you can register using the same namespace and using the same service, see Cloud Map quotas in the Cloud Map Developer Guide.
   */
  createService(callback?: (err: AWSError, data: ServiceDiscovery.Types.CreateServiceResponse) => void): Request<ServiceDiscovery.Types.CreateServiceResponse, AWSError>;
  /**
   * Deletes a namespace from the current account. If the namespace still contains one or more services, the request fails.
   */
  deleteNamespace(params: ServiceDiscovery.Types.DeleteNamespaceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.DeleteNamespaceResponse) => void): Request<ServiceDiscovery.Types.DeleteNamespaceResponse, AWSError>;
  /**
   * Deletes a namespace from the current account. If the namespace still contains one or more services, the request fails.
   */
  deleteNamespace(callback?: (err: AWSError, data: ServiceDiscovery.Types.DeleteNamespaceResponse) => void): Request<ServiceDiscovery.Types.DeleteNamespaceResponse, AWSError>;
  /**
   * Deletes a specified service. If the service still contains one or more registered instances, the request fails.
   */
  deleteService(params: ServiceDiscovery.Types.DeleteServiceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.DeleteServiceResponse) => void): Request<ServiceDiscovery.Types.DeleteServiceResponse, AWSError>;
  /**
   * Deletes a specified service. If the service still contains one or more registered instances, the request fails.
   */
  deleteService(callback?: (err: AWSError, data: ServiceDiscovery.Types.DeleteServiceResponse) => void): Request<ServiceDiscovery.Types.DeleteServiceResponse, AWSError>;
  /**
   * Deletes the Amazon Route 53 DNS records and health check, if any, that Cloud Map created for the specified instance.
   */
  deregisterInstance(params: ServiceDiscovery.Types.DeregisterInstanceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.DeregisterInstanceResponse) => void): Request<ServiceDiscovery.Types.DeregisterInstanceResponse, AWSError>;
  /**
   * Deletes the Amazon Route 53 DNS records and health check, if any, that Cloud Map created for the specified instance.
   */
  deregisterInstance(callback?: (err: AWSError, data: ServiceDiscovery.Types.DeregisterInstanceResponse) => void): Request<ServiceDiscovery.Types.DeregisterInstanceResponse, AWSError>;
  /**
   * Discovers registered instances for a specified namespace and service. You can use DiscoverInstances to discover instances for any type of namespace. For public and private DNS namespaces, you can also use DNS queries to discover instances.
   */
  discoverInstances(params: ServiceDiscovery.Types.DiscoverInstancesRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.DiscoverInstancesResponse) => void): Request<ServiceDiscovery.Types.DiscoverInstancesResponse, AWSError>;
  /**
   * Discovers registered instances for a specified namespace and service. You can use DiscoverInstances to discover instances for any type of namespace. For public and private DNS namespaces, you can also use DNS queries to discover instances.
   */
  discoverInstances(callback?: (err: AWSError, data: ServiceDiscovery.Types.DiscoverInstancesResponse) => void): Request<ServiceDiscovery.Types.DiscoverInstancesResponse, AWSError>;
  /**
   * Gets information about a specified instance.
   */
  getInstance(params: ServiceDiscovery.Types.GetInstanceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.GetInstanceResponse) => void): Request<ServiceDiscovery.Types.GetInstanceResponse, AWSError>;
  /**
   * Gets information about a specified instance.
   */
  getInstance(callback?: (err: AWSError, data: ServiceDiscovery.Types.GetInstanceResponse) => void): Request<ServiceDiscovery.Types.GetInstanceResponse, AWSError>;
  /**
   * Gets the current health status (Healthy, Unhealthy, or Unknown) of one or more instances that are associated with a specified service.  There's a brief delay between when you register an instance and when the health status for the instance is available.  
   */
  getInstancesHealthStatus(params: ServiceDiscovery.Types.GetInstancesHealthStatusRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.GetInstancesHealthStatusResponse) => void): Request<ServiceDiscovery.Types.GetInstancesHealthStatusResponse, AWSError>;
  /**
   * Gets the current health status (Healthy, Unhealthy, or Unknown) of one or more instances that are associated with a specified service.  There's a brief delay between when you register an instance and when the health status for the instance is available.  
   */
  getInstancesHealthStatus(callback?: (err: AWSError, data: ServiceDiscovery.Types.GetInstancesHealthStatusResponse) => void): Request<ServiceDiscovery.Types.GetInstancesHealthStatusResponse, AWSError>;
  /**
   * Gets information about a namespace.
   */
  getNamespace(params: ServiceDiscovery.Types.GetNamespaceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.GetNamespaceResponse) => void): Request<ServiceDiscovery.Types.GetNamespaceResponse, AWSError>;
  /**
   * Gets information about a namespace.
   */
  getNamespace(callback?: (err: AWSError, data: ServiceDiscovery.Types.GetNamespaceResponse) => void): Request<ServiceDiscovery.Types.GetNamespaceResponse, AWSError>;
  /**
   * Gets information about any operation that returns an operation ID in the response, such as a CreateService request.  To get a list of operations that match specified criteria, see ListOperations. 
   */
  getOperation(params: ServiceDiscovery.Types.GetOperationRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.GetOperationResponse) => void): Request<ServiceDiscovery.Types.GetOperationResponse, AWSError>;
  /**
   * Gets information about any operation that returns an operation ID in the response, such as a CreateService request.  To get a list of operations that match specified criteria, see ListOperations. 
   */
  getOperation(callback?: (err: AWSError, data: ServiceDiscovery.Types.GetOperationResponse) => void): Request<ServiceDiscovery.Types.GetOperationResponse, AWSError>;
  /**
   * Gets the settings for a specified service.
   */
  getService(params: ServiceDiscovery.Types.GetServiceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.GetServiceResponse) => void): Request<ServiceDiscovery.Types.GetServiceResponse, AWSError>;
  /**
   * Gets the settings for a specified service.
   */
  getService(callback?: (err: AWSError, data: ServiceDiscovery.Types.GetServiceResponse) => void): Request<ServiceDiscovery.Types.GetServiceResponse, AWSError>;
  /**
   * Lists summary information about the instances that you registered by using a specified service.
   */
  listInstances(params: ServiceDiscovery.Types.ListInstancesRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.ListInstancesResponse) => void): Request<ServiceDiscovery.Types.ListInstancesResponse, AWSError>;
  /**
   * Lists summary information about the instances that you registered by using a specified service.
   */
  listInstances(callback?: (err: AWSError, data: ServiceDiscovery.Types.ListInstancesResponse) => void): Request<ServiceDiscovery.Types.ListInstancesResponse, AWSError>;
  /**
   * Lists summary information about the namespaces that were created by the current account.
   */
  listNamespaces(params: ServiceDiscovery.Types.ListNamespacesRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.ListNamespacesResponse) => void): Request<ServiceDiscovery.Types.ListNamespacesResponse, AWSError>;
  /**
   * Lists summary information about the namespaces that were created by the current account.
   */
  listNamespaces(callback?: (err: AWSError, data: ServiceDiscovery.Types.ListNamespacesResponse) => void): Request<ServiceDiscovery.Types.ListNamespacesResponse, AWSError>;
  /**
   * Lists operations that match the criteria that you specify.
   */
  listOperations(params: ServiceDiscovery.Types.ListOperationsRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.ListOperationsResponse) => void): Request<ServiceDiscovery.Types.ListOperationsResponse, AWSError>;
  /**
   * Lists operations that match the criteria that you specify.
   */
  listOperations(callback?: (err: AWSError, data: ServiceDiscovery.Types.ListOperationsResponse) => void): Request<ServiceDiscovery.Types.ListOperationsResponse, AWSError>;
  /**
   * Lists summary information for all the services that are associated with one or more specified namespaces.
   */
  listServices(params: ServiceDiscovery.Types.ListServicesRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.ListServicesResponse) => void): Request<ServiceDiscovery.Types.ListServicesResponse, AWSError>;
  /**
   * Lists summary information for all the services that are associated with one or more specified namespaces.
   */
  listServices(callback?: (err: AWSError, data: ServiceDiscovery.Types.ListServicesResponse) => void): Request<ServiceDiscovery.Types.ListServicesResponse, AWSError>;
  /**
   * Lists tags for the specified resource.
   */
  listTagsForResource(params: ServiceDiscovery.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.ListTagsForResourceResponse) => void): Request<ServiceDiscovery.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists tags for the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ServiceDiscovery.Types.ListTagsForResourceResponse) => void): Request<ServiceDiscovery.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Creates or updates one or more records and, optionally, creates a health check based on the settings in a specified service. When you submit a RegisterInstance request, the following occurs:   For each DNS record that you define in the service that's specified by ServiceId, a record is created or updated in the hosted zone that's associated with the corresponding namespace.   If the service includes HealthCheckConfig, a health check is created based on the settings in the health check configuration.   The health check, if any, is associated with each of the new or updated records.    One RegisterInstance request must complete before you can submit another request and specify the same service ID and instance ID.  For more information, see CreateService. When Cloud Map receives a DNS query for the specified DNS name, it returns the applicable value:    If the health check is healthy: returns all the records    If the health check is unhealthy: returns the applicable value for the last healthy instance    If you didn't specify a health check configuration: returns all the records   For the current quota on the number of instances that you can register using the same namespace and using the same service, see Cloud Map quotas in the Cloud Map Developer Guide.
   */
  registerInstance(params: ServiceDiscovery.Types.RegisterInstanceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.RegisterInstanceResponse) => void): Request<ServiceDiscovery.Types.RegisterInstanceResponse, AWSError>;
  /**
   * Creates or updates one or more records and, optionally, creates a health check based on the settings in a specified service. When you submit a RegisterInstance request, the following occurs:   For each DNS record that you define in the service that's specified by ServiceId, a record is created or updated in the hosted zone that's associated with the corresponding namespace.   If the service includes HealthCheckConfig, a health check is created based on the settings in the health check configuration.   The health check, if any, is associated with each of the new or updated records.    One RegisterInstance request must complete before you can submit another request and specify the same service ID and instance ID.  For more information, see CreateService. When Cloud Map receives a DNS query for the specified DNS name, it returns the applicable value:    If the health check is healthy: returns all the records    If the health check is unhealthy: returns the applicable value for the last healthy instance    If you didn't specify a health check configuration: returns all the records   For the current quota on the number of instances that you can register using the same namespace and using the same service, see Cloud Map quotas in the Cloud Map Developer Guide.
   */
  registerInstance(callback?: (err: AWSError, data: ServiceDiscovery.Types.RegisterInstanceResponse) => void): Request<ServiceDiscovery.Types.RegisterInstanceResponse, AWSError>;
  /**
   * Adds one or more tags to the specified resource.
   */
  tagResource(params: ServiceDiscovery.Types.TagResourceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.TagResourceResponse) => void): Request<ServiceDiscovery.Types.TagResourceResponse, AWSError>;
  /**
   * Adds one or more tags to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: ServiceDiscovery.Types.TagResourceResponse) => void): Request<ServiceDiscovery.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified resource.
   */
  untagResource(params: ServiceDiscovery.Types.UntagResourceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.UntagResourceResponse) => void): Request<ServiceDiscovery.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: ServiceDiscovery.Types.UntagResourceResponse) => void): Request<ServiceDiscovery.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an HTTP namespace.
   */
  updateHttpNamespace(params: ServiceDiscovery.Types.UpdateHttpNamespaceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.UpdateHttpNamespaceResponse) => void): Request<ServiceDiscovery.Types.UpdateHttpNamespaceResponse, AWSError>;
  /**
   * Updates an HTTP namespace.
   */
  updateHttpNamespace(callback?: (err: AWSError, data: ServiceDiscovery.Types.UpdateHttpNamespaceResponse) => void): Request<ServiceDiscovery.Types.UpdateHttpNamespaceResponse, AWSError>;
  /**
   * Submits a request to change the health status of a custom health check to healthy or unhealthy. You can use UpdateInstanceCustomHealthStatus to change the status only for custom health checks, which you define using HealthCheckCustomConfig when you create a service. You can't use it to change the status for Route 53 health checks, which you define using HealthCheckConfig. For more information, see HealthCheckCustomConfig.
   */
  updateInstanceCustomHealthStatus(params: ServiceDiscovery.Types.UpdateInstanceCustomHealthStatusRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Submits a request to change the health status of a custom health check to healthy or unhealthy. You can use UpdateInstanceCustomHealthStatus to change the status only for custom health checks, which you define using HealthCheckCustomConfig when you create a service. You can't use it to change the status for Route 53 health checks, which you define using HealthCheckConfig. For more information, see HealthCheckCustomConfig.
   */
  updateInstanceCustomHealthStatus(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a private DNS namespace.
   */
  updatePrivateDnsNamespace(params: ServiceDiscovery.Types.UpdatePrivateDnsNamespaceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.UpdatePrivateDnsNamespaceResponse) => void): Request<ServiceDiscovery.Types.UpdatePrivateDnsNamespaceResponse, AWSError>;
  /**
   * Updates a private DNS namespace.
   */
  updatePrivateDnsNamespace(callback?: (err: AWSError, data: ServiceDiscovery.Types.UpdatePrivateDnsNamespaceResponse) => void): Request<ServiceDiscovery.Types.UpdatePrivateDnsNamespaceResponse, AWSError>;
  /**
   * Updates a public DNS namespace.
   */
  updatePublicDnsNamespace(params: ServiceDiscovery.Types.UpdatePublicDnsNamespaceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.UpdatePublicDnsNamespaceResponse) => void): Request<ServiceDiscovery.Types.UpdatePublicDnsNamespaceResponse, AWSError>;
  /**
   * Updates a public DNS namespace.
   */
  updatePublicDnsNamespace(callback?: (err: AWSError, data: ServiceDiscovery.Types.UpdatePublicDnsNamespaceResponse) => void): Request<ServiceDiscovery.Types.UpdatePublicDnsNamespaceResponse, AWSError>;
  /**
   * Submits a request to perform the following operations:   Update the TTL setting for existing DnsRecords configurations   Add, update, or delete HealthCheckConfig for a specified service  You can't add, update, or delete a HealthCheckCustomConfig configuration.    For public and private DNS namespaces, note the following:   If you omit any existing DnsRecords or HealthCheckConfig configurations from an UpdateService request, the configurations are deleted from the service.   If you omit an existing HealthCheckCustomConfig configuration from an UpdateService request, the configuration isn't deleted from the service.   When you update settings for a service, Cloud Map also updates the corresponding settings in all the records and health checks that were created by using the specified service.
   */
  updateService(params: ServiceDiscovery.Types.UpdateServiceRequest, callback?: (err: AWSError, data: ServiceDiscovery.Types.UpdateServiceResponse) => void): Request<ServiceDiscovery.Types.UpdateServiceResponse, AWSError>;
  /**
   * Submits a request to perform the following operations:   Update the TTL setting for existing DnsRecords configurations   Add, update, or delete HealthCheckConfig for a specified service  You can't add, update, or delete a HealthCheckCustomConfig configuration.    For public and private DNS namespaces, note the following:   If you omit any existing DnsRecords or HealthCheckConfig configurations from an UpdateService request, the configurations are deleted from the service.   If you omit an existing HealthCheckCustomConfig configuration from an UpdateService request, the configuration isn't deleted from the service.   When you update settings for a service, Cloud Map also updates the corresponding settings in all the records and health checks that were created by using the specified service.
   */
  updateService(callback?: (err: AWSError, data: ServiceDiscovery.Types.UpdateServiceResponse) => void): Request<ServiceDiscovery.Types.UpdateServiceResponse, AWSError>;
}
declare namespace ServiceDiscovery {
  export type AmazonResourceName = string;
  export type Arn = string;
  export type AttrKey = string;
  export type AttrValue = string;
  export type Attributes = {[key: string]: AttrValue};
  export type Code = string;
  export interface CreateHttpNamespaceRequest {
    /**
     * The name that you want to assign to this namespace.
     */
    Name: NamespaceNameHttp;
    /**
     * A unique string that identifies the request and that allows failed CreateHttpNamespace requests to be retried without the risk of running the operation twice. CreatorRequestId can be any unique string (for example, a date/time stamp).
     */
    CreatorRequestId?: ResourceId;
    /**
     * A description for the namespace.
     */
    Description?: ResourceDescription;
    /**
     * The tags to add to the namespace. Each tag consists of a key and an optional value that you define. Tags keys can be up to 128 characters in length, and tag values can be up to 256 characters in length.
     */
    Tags?: TagList;
  }
  export interface CreateHttpNamespaceResponse {
    /**
     * A value that you can use to determine whether the request completed successfully. To get the status of the operation, see GetOperation.
     */
    OperationId?: OperationId;
  }
  export interface CreatePrivateDnsNamespaceRequest {
    /**
     * The name that you want to assign to this namespace. When you create a private DNS namespace, Cloud Map automatically creates an Amazon Route 53 private hosted zone that has the same name as the namespace.
     */
    Name: NamespaceNamePrivate;
    /**
     * A unique string that identifies the request and that allows failed CreatePrivateDnsNamespace requests to be retried without the risk of running the operation twice. CreatorRequestId can be any unique string (for example, a date/timestamp).
     */
    CreatorRequestId?: ResourceId;
    /**
     * A description for the namespace.
     */
    Description?: ResourceDescription;
    /**
     * The ID of the Amazon VPC that you want to associate the namespace with.
     */
    Vpc: ResourceId;
    /**
     * The tags to add to the namespace. Each tag consists of a key and an optional value that you define. Tags keys can be up to 128 characters in length, and tag values can be up to 256 characters in length.
     */
    Tags?: TagList;
    /**
     * Properties for the private DNS namespace.
     */
    Properties?: PrivateDnsNamespaceProperties;
  }
  export interface CreatePrivateDnsNamespaceResponse {
    /**
     * A value that you can use to determine whether the request completed successfully. To get the status of the operation, see GetOperation.
     */
    OperationId?: OperationId;
  }
  export interface CreatePublicDnsNamespaceRequest {
    /**
     * The name that you want to assign to this namespace.
     */
    Name: NamespaceNamePublic;
    /**
     * A unique string that identifies the request and that allows failed CreatePublicDnsNamespace requests to be retried without the risk of running the operation twice. CreatorRequestId can be any unique string (for example, a date/timestamp).
     */
    CreatorRequestId?: ResourceId;
    /**
     * A description for the namespace.
     */
    Description?: ResourceDescription;
    /**
     * The tags to add to the namespace. Each tag consists of a key and an optional value that you define. Tags keys can be up to 128 characters in length, and tag values can be up to 256 characters in length.
     */
    Tags?: TagList;
    /**
     * Properties for the public DNS namespace.
     */
    Properties?: PublicDnsNamespaceProperties;
  }
  export interface CreatePublicDnsNamespaceResponse {
    /**
     * A value that you can use to determine whether the request completed successfully. To get the status of the operation, see GetOperation.
     */
    OperationId?: OperationId;
  }
  export interface CreateServiceRequest {
    /**
     * The name that you want to assign to the service. If you want Cloud Map to create an SRV record when you register an instance and you're using a system that requires a specific SRV format, such as HAProxy, specify the following for Name:   Start the name with an underscore (_), such as _exampleservice.   End the name with ._protocol, such as ._tcp.   When you register an instance, Cloud Map creates an SRV record and assigns a name to the record by concatenating the service name and the namespace name (for example,  _exampleservice._tcp.example.com).  For services that are accessible by DNS queries, you can't create multiple services with names that differ only by case (such as EXAMPLE and example). Otherwise, these services have the same DNS name and can't be distinguished. However, if you use a namespace that's only accessible by API calls, then you can create services that with names that differ only by case. 
     */
    Name: ServiceName;
    /**
     * The ID of the namespace that you want to use to create the service. The namespace ID must be specified, but it can be specified either here or in the DnsConfig object.
     */
    NamespaceId?: ResourceId;
    /**
     * A unique string that identifies the request and that allows failed CreateService requests to be retried without the risk of running the operation twice. CreatorRequestId can be any unique string (for example, a date/timestamp).
     */
    CreatorRequestId?: ResourceId;
    /**
     * A description for the service.
     */
    Description?: ResourceDescription;
    /**
     * A complex type that contains information about the Amazon Route 53 records that you want Cloud Map to create when you register an instance. 
     */
    DnsConfig?: DnsConfig;
    /**
     *  Public DNS and HTTP namespaces only. A complex type that contains settings for an optional Route 53 health check. If you specify settings for a health check, Cloud Map associates the health check with all the Route 53 DNS records that you specify in DnsConfig.  If you specify a health check configuration, you can specify either HealthCheckCustomConfig or HealthCheckConfig but not both.  For information about the charges for health checks, see Cloud Map Pricing.
     */
    HealthCheckConfig?: HealthCheckConfig;
    /**
     * A complex type that contains information about an optional custom health check.  If you specify a health check configuration, you can specify either HealthCheckCustomConfig or HealthCheckConfig but not both.  You can't add, update, or delete a HealthCheckCustomConfig configuration from an existing service.
     */
    HealthCheckCustomConfig?: HealthCheckCustomConfig;
    /**
     * The tags to add to the service. Each tag consists of a key and an optional value that you define. Tags keys can be up to 128 characters in length, and tag values can be up to 256 characters in length.
     */
    Tags?: TagList;
    /**
     * If present, specifies that the service instances are only discoverable using the DiscoverInstances API operation. No DNS records is registered for the service instances. The only valid value is HTTP.
     */
    Type?: ServiceTypeOption;
  }
  export interface CreateServiceResponse {
    /**
     * A complex type that contains information about the new service.
     */
    Service?: Service;
  }
  export type CustomHealthStatus = "HEALTHY"|"UNHEALTHY"|string;
  export interface DeleteNamespaceRequest {
    /**
     * The ID of the namespace that you want to delete.
     */
    Id: ResourceId;
  }
  export interface DeleteNamespaceResponse {
    /**
     * A value that you can use to determine whether the request completed successfully. To get the status of the operation, see GetOperation.
     */
    OperationId?: OperationId;
  }
  export interface DeleteServiceRequest {
    /**
     * The ID of the service that you want to delete.
     */
    Id: ResourceId;
  }
  export interface DeleteServiceResponse {
  }
  export interface DeregisterInstanceRequest {
    /**
     * The ID of the service that the instance is associated with.
     */
    ServiceId: ResourceId;
    /**
     * The value that you specified for Id in the RegisterInstance request.
     */
    InstanceId: ResourceId;
  }
  export interface DeregisterInstanceResponse {
    /**
     * A value that you can use to determine whether the request completed successfully. To get the status of the operation, see GetOperation.
     */
    OperationId?: OperationId;
  }
  export interface DiscoverInstancesRequest {
    /**
     * The HttpName name of the namespace. It's found in the HttpProperties member of the Properties member of the namespace.
     */
    NamespaceName: NamespaceName;
    /**
     * The name of the service that you specified when you registered the instance.
     */
    ServiceName: ServiceName;
    /**
     * The maximum number of instances that you want Cloud Map to return in the response to a DiscoverInstances request. If you don't specify a value for MaxResults, Cloud Map returns up to 100 instances.
     */
    MaxResults?: DiscoverMaxResults;
    /**
     * Filters to scope the results based on custom attributes for the instance (for example, {version=v1, az=1a}). Only instances that match all the specified key-value pairs are returned.
     */
    QueryParameters?: Attributes;
    /**
     * Opportunistic filters to scope the results based on custom attributes. If there are instances that match both the filters specified in both the QueryParameters parameter and this parameter, all of these instances are returned. Otherwise, the filters are ignored, and only instances that match the filters that are specified in the QueryParameters parameter are returned.
     */
    OptionalParameters?: Attributes;
    /**
     * The health status of the instances that you want to discover. This parameter is ignored for services that don't have a health check configured, and all instances are returned.  HEALTHY  Returns healthy instances.  UNHEALTHY  Returns unhealthy instances.  ALL  Returns all instances.  HEALTHY_OR_ELSE_ALL  Returns healthy instances, unless none are reporting a healthy state. In that case, return all instances. This is also called failing open.  
     */
    HealthStatus?: HealthStatusFilter;
  }
  export interface DiscoverInstancesResponse {
    /**
     * A complex type that contains one HttpInstanceSummary for each registered instance.
     */
    Instances?: HttpInstanceSummaryList;
  }
  export type DiscoverMaxResults = number;
  export interface DnsConfig {
    /**
     * The ID of the namespace to use for DNS configuration.
     */
    NamespaceId?: ResourceId;
    /**
     * The routing policy that you want to apply to all Route 53 DNS records that Cloud Map creates when you register an instance and specify this service.  If you want to use this service to register instances that create alias records, specify WEIGHTED for the routing policy.  You can specify the following values:  MULTIVALUE  If you define a health check for the service and the health check is healthy, Route 53 returns the applicable value for up to eight instances. For example, suppose that the service includes configurations for one A record and a health check. You use the service to register 10 instances. Route 53 responds to DNS queries with IP addresses for up to eight healthy instances. If fewer than eight instances are healthy, Route 53 responds to every DNS query with the IP addresses for all of the healthy instances. If you don't define a health check for the service, Route 53 assumes that all instances are healthy and returns the values for up to eight instances. For more information about the multivalue routing policy, see Multivalue Answer Routing in the Route 53 Developer Guide.  WEIGHTED  Route 53 returns the applicable value from one randomly selected instance from among the instances that you registered using the same service. Currently, all records have the same weight, so you can't route more or less traffic to any instances. For example, suppose that the service includes configurations for one A record and a health check. You use the service to register 10 instances. Route 53 responds to DNS queries with the IP address for one randomly selected instance from among the healthy instances. If no instances are healthy, Route 53 responds to DNS queries as if all of the instances were healthy. If you don't define a health check for the service, Route 53 assumes that all instances are healthy and returns the applicable value for one randomly selected instance. For more information about the weighted routing policy, see Weighted Routing in the Route 53 Developer Guide.  
     */
    RoutingPolicy?: RoutingPolicy;
    /**
     * An array that contains one DnsRecord object for each Route 53 DNS record that you want Cloud Map to create when you register an instance.
     */
    DnsRecords: DnsRecordList;
  }
  export interface DnsConfigChange {
    /**
     * An array that contains one DnsRecord object for each Route 53 record that you want Cloud Map to create when you register an instance.
     */
    DnsRecords: DnsRecordList;
  }
  export interface DnsProperties {
    /**
     * The ID for the Route 53 hosted zone that Cloud Map creates when you create a namespace.
     */
    HostedZoneId?: ResourceId;
    /**
     * Start of Authority (SOA) record for the hosted zone.
     */
    SOA?: SOA;
  }
  export interface DnsRecord {
    /**
     * The type of the resource, which indicates the type of value that Route 53 returns in response to DNS queries. You can specify values for Type in the following combinations:     A       AAAA       A  and  AAAA       SRV       CNAME     If you want Cloud Map to create a Route 53 alias record when you register an instance, specify A or AAAA for Type. You specify other settings, such as the IP address for A and AAAA records, when you register an instance. For more information, see RegisterInstance. The following values are supported:  A  Route 53 returns the IP address of the resource in IPv4 format, such as 192.0.2.44.  AAAA  Route 53 returns the IP address of the resource in IPv6 format, such as 2001:0db8:85a3:0000:0000:abcd:0001:2345.  CNAME  Route 53 returns the domain name of the resource, such as www.example.com. Note the following:   You specify the domain name that you want to route traffic to when you register an instance. For more information, see Attributes in the topic RegisterInstance.   You must specify WEIGHTED for the value of RoutingPolicy.   You can't specify both CNAME for Type and settings for HealthCheckConfig. If you do, the request will fail with an InvalidInput error.    SRV  Route 53 returns the value for an SRV record. The value for an SRV record uses the following values:  priority weight port service-hostname  Note the following about the values:   The values of priority and weight are both set to 1 and can't be changed.    The value of port comes from the value that you specify for the AWS_INSTANCE_PORT attribute when you submit a RegisterInstance request.   The value of service-hostname is a concatenation of the following values:   The value that you specify for InstanceId when you register an instance.   The name of the service.   The name of the namespace.    For example, if the value of InstanceId is test, the name of the service is backend, and the name of the namespace is example.com, the value of service-hostname is the following:  test.backend.example.com    If you specify settings for an SRV record, note the following:   If you specify values for AWS_INSTANCE_IPV4, AWS_INSTANCE_IPV6, or both in the RegisterInstance request, Cloud Map automatically creates A and/or AAAA records that have the same name as the value of service-hostname in the SRV record. You can ignore these records.   If you're using a system that requires a specific SRV format, such as HAProxy, see the Name element in the documentation about CreateService for information about how to specify the correct name format.    
     */
    Type: RecordType;
    /**
     * The amount of time, in seconds, that you want DNS resolvers to cache the settings for this record.  Alias records don't include a TTL because Route 53 uses the TTL for the Amazon Web Services resource that an alias record routes traffic to. If you include the AWS_ALIAS_DNS_NAME attribute when you submit a RegisterInstance request, the TTL value is ignored. Always specify a TTL for the service; you can use a service to register instances that create either alias or non-alias records. 
     */
    TTL: RecordTTL;
  }
  export type DnsRecordList = DnsRecord[];
  export type FailureThreshold = number;
  export type FilterCondition = "EQ"|"IN"|"BETWEEN"|string;
  export type FilterValue = string;
  export type FilterValues = FilterValue[];
  export interface GetInstanceRequest {
    /**
     * The ID of the service that the instance is associated with.
     */
    ServiceId: ResourceId;
    /**
     * The ID of the instance that you want to get information about.
     */
    InstanceId: ResourceId;
  }
  export interface GetInstanceResponse {
    /**
     * A complex type that contains information about a specified instance.
     */
    Instance?: Instance;
  }
  export interface GetInstancesHealthStatusRequest {
    /**
     * The ID of the service that the instance is associated with.
     */
    ServiceId: ResourceId;
    /**
     * An array that contains the IDs of all the instances that you want to get the health status for. If you omit Instances, Cloud Map returns the health status for all the instances that are associated with the specified service.  To get the IDs for the instances that you've registered by using a specified service, submit a ListInstances request. 
     */
    Instances?: InstanceIdList;
    /**
     * The maximum number of instances that you want Cloud Map to return in the response to a GetInstancesHealthStatus request. If you don't specify a value for MaxResults, Cloud Map returns up to 100 instances.
     */
    MaxResults?: MaxResults;
    /**
     * For the first GetInstancesHealthStatus request, omit this value. If more than MaxResults instances match the specified criteria, you can submit another GetInstancesHealthStatus request to get the next group of results. Specify the value of NextToken from the previous response in the next request.
     */
    NextToken?: NextToken;
  }
  export interface GetInstancesHealthStatusResponse {
    /**
     * A complex type that contains the IDs and the health status of the instances that you specified in the GetInstancesHealthStatus request.
     */
    Status?: InstanceHealthStatusMap;
    /**
     * If more than MaxResults instances match the specified criteria, you can submit another GetInstancesHealthStatus request to get the next group of results. Specify the value of NextToken from the previous response in the next request.
     */
    NextToken?: NextToken;
  }
  export interface GetNamespaceRequest {
    /**
     * The ID of the namespace that you want to get information about.
     */
    Id: ResourceId;
  }
  export interface GetNamespaceResponse {
    /**
     * A complex type that contains information about the specified namespace.
     */
    Namespace?: Namespace;
  }
  export interface GetOperationRequest {
    /**
     * The ID of the operation that you want to get more information about.
     */
    OperationId: ResourceId;
  }
  export interface GetOperationResponse {
    /**
     * A complex type that contains information about the operation.
     */
    Operation?: Operation;
  }
  export interface GetServiceRequest {
    /**
     * The ID of the service that you want to get settings for.
     */
    Id: ResourceId;
  }
  export interface GetServiceResponse {
    /**
     * A complex type that contains information about the service.
     */
    Service?: Service;
  }
  export interface HealthCheckConfig {
    /**
     * The type of health check that you want to create, which indicates how Route 53 determines whether an endpoint is healthy.  You can't change the value of Type after you create a health check.  You can create the following types of health checks:    HTTP: Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTP request and waits for an HTTP status code of 200 or greater and less than 400.    HTTPS: Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTPS request and waits for an HTTP status code of 200 or greater and less than 400.  If you specify HTTPS for the value of Type, the endpoint must support TLS v1.0 or later.     TCP: Route 53 tries to establish a TCP connection. If you specify TCP for Type, don't specify a value for ResourcePath.   For more information, see How Route 53 Determines Whether an Endpoint Is Healthy in the Route 53 Developer Guide.
     */
    Type: HealthCheckType;
    /**
     * The path that you want Route 53 to request when performing health checks. The path can be any value that your endpoint returns an HTTP status code of a 2xx or 3xx format for when the endpoint is healthy. An example file is /docs/route53-health-check.html. Route 53 automatically adds the DNS name for the service. If you don't specify a value for ResourcePath, the default value is /. If you specify TCP for Type, you must not specify a value for ResourcePath.
     */
    ResourcePath?: ResourcePath;
    /**
     * The number of consecutive health checks that an endpoint must pass or fail for Route 53 to change the current status of the endpoint from unhealthy to healthy or the other way around. For more information, see How Route 53 Determines Whether an Endpoint Is Healthy in the Route 53 Developer Guide.
     */
    FailureThreshold?: FailureThreshold;
  }
  export interface HealthCheckCustomConfig {
    /**
     *  This parameter is no longer supported and is always set to 1. Cloud Map waits for approximately 30 seconds after receiving an UpdateInstanceCustomHealthStatus request before changing the status of the service instance.  The number of 30-second intervals that you want Cloud Map to wait after receiving an UpdateInstanceCustomHealthStatus request before it changes the health status of a service instance. Sending a second or subsequent UpdateInstanceCustomHealthStatus request with the same value before 30 seconds has passed doesn't accelerate the change. Cloud Map still waits 30 seconds after the first request to make the change.
     */
    FailureThreshold?: FailureThreshold;
  }
  export type HealthCheckType = "HTTP"|"HTTPS"|"TCP"|string;
  export type HealthStatus = "HEALTHY"|"UNHEALTHY"|"UNKNOWN"|string;
  export type HealthStatusFilter = "HEALTHY"|"UNHEALTHY"|"ALL"|"HEALTHY_OR_ELSE_ALL"|string;
  export interface HttpInstanceSummary {
    /**
     * The ID of an instance that matches the values that you specified in the request.
     */
    InstanceId?: ResourceId;
    /**
     *      The HttpName name of the namespace. It's found in the HttpProperties member of the Properties member of the namespace.
     */
    NamespaceName?: NamespaceNameHttp;
    /**
     * The name of the service that you specified when you registered the instance.
     */
    ServiceName?: ServiceName;
    /**
     * If you configured health checking in the service, the current health status of the service instance.
     */
    HealthStatus?: HealthStatus;
    /**
     * If you included any attributes when you registered the instance, the values of those attributes.
     */
    Attributes?: Attributes;
  }
  export type HttpInstanceSummaryList = HttpInstanceSummary[];
  export interface HttpNamespaceChange {
    /**
     * An updated description for the HTTP namespace.
     */
    Description: ResourceDescription;
  }
  export interface HttpProperties {
    /**
     * The name of an HTTP namespace.
     */
    HttpName?: NamespaceName;
  }
  export interface Instance {
    /**
     * An identifier that you want to associate with the instance. Note the following:   If the service that's specified by ServiceId includes settings for an SRV record, the value of InstanceId is automatically included as part of the value for the SRV record. For more information, see DnsRecord &gt; Type.   You can use this value to update an existing instance.   To register a new instance, you must specify a value that's unique among instances that you register by using the same service.    If you specify an existing InstanceId and ServiceId, Cloud Map updates the existing DNS records. If there's also an existing health check, Cloud Map deletes the old health check and creates a new one.   The health check isn't deleted immediately, so it will still appear for a while if you submit a ListHealthChecks request, for example.   
     */
    Id: ResourceId;
    /**
     * A unique string that identifies the request and that allows failed RegisterInstance requests to be retried without the risk of executing the operation twice. You must use a unique CreatorRequestId string every time you submit a RegisterInstance request if you're registering additional instances for the same namespace and service. CreatorRequestId can be any unique string (for example, a date/time stamp).
     */
    CreatorRequestId?: ResourceId;
    /**
     * A string map that contains the following information for the service that you specify in ServiceId:   The attributes that apply to the records that are defined in the service.    For each attribute, the applicable value.   Supported attribute keys include the following:  AWS_ALIAS_DNS_NAME  If you want Cloud Map to create a Route 53 alias record that routes traffic to an Elastic Load Balancing load balancer, specify the DNS name that's associated with the load balancer. For information about how to get the DNS name, see AliasTarget-&gt;DNSName in the Route 53 API Reference. Note the following:   The configuration for the service that's specified by ServiceId must include settings for an A record, an AAAA record, or both.   In the service that's specified by ServiceId, the value of RoutingPolicy must be WEIGHTED.   If the service that's specified by ServiceId includes HealthCheckConfig settings, Cloud Map creates the health check, but it won't associate the health check with the alias record.   Auto naming currently doesn't support creating alias records that route traffic to Amazon Web Services resources other than ELB load balancers.   If you specify a value for AWS_ALIAS_DNS_NAME, don't specify values for any of the AWS_INSTANCE attributes.    AWS_EC2_INSTANCE_ID   HTTP namespaces only. The Amazon EC2 instance ID for the instance. The AWS_INSTANCE_IPV4 attribute contains the primary private IPv4 address.  AWS_INIT_HEALTH_STATUS  If the service configuration includes HealthCheckCustomConfig, you can optionally use AWS_INIT_HEALTH_STATUS to specify the initial status of the custom health check, HEALTHY or UNHEALTHY. If you don't specify a value for AWS_INIT_HEALTH_STATUS, the initial status is HEALTHY.  AWS_INSTANCE_CNAME  If the service configuration includes a CNAME record, the domain name that you want Route 53 to return in response to DNS queries (for example, example.com). This value is required if the service specified by ServiceId includes settings for an CNAME record.  AWS_INSTANCE_IPV4  If the service configuration includes an A record, the IPv4 address that you want Route 53 to return in response to DNS queries (for example, 192.0.2.44). This value is required if the service specified by ServiceId includes settings for an A record. If the service includes settings for an SRV record, you must specify a value for AWS_INSTANCE_IPV4, AWS_INSTANCE_IPV6, or both.  AWS_INSTANCE_IPV6  If the service configuration includes an AAAA record, the IPv6 address that you want Route 53 to return in response to DNS queries (for example, 2001:0db8:85a3:0000:0000:abcd:0001:2345). This value is required if the service specified by ServiceId includes settings for an AAAA record. If the service includes settings for an SRV record, you must specify a value for AWS_INSTANCE_IPV4, AWS_INSTANCE_IPV6, or both.  AWS_INSTANCE_PORT  If the service includes an SRV record, the value that you want Route 53 to return for the port. If the service includes HealthCheckConfig, the port on the endpoint that you want Route 53 to send requests to.  This value is required if you specified settings for an SRV record or a Route 53 health check when you created the service.  
     */
    Attributes?: Attributes;
  }
  export type InstanceHealthStatusMap = {[key: string]: HealthStatus};
  export type InstanceId = string;
  export type InstanceIdList = ResourceId[];
  export interface InstanceSummary {
    /**
     * The ID for an instance that you created by using a specified service.
     */
    Id?: ResourceId;
    /**
     * A string map that contains the following information:   The attributes that are associated with the instance.    For each attribute, the applicable value.   Supported attribute keys include the following:  AWS_ALIAS_DNS_NAME  For an alias record that routes traffic to an Elastic Load Balancing load balancer, the DNS name that's associated with the load balancer.   AWS_EC2_INSTANCE_ID (HTTP namespaces only)  The Amazon EC2 instance ID for the instance. When the AWS_EC2_INSTANCE_ID attribute is specified, then the AWS_INSTANCE_IPV4 attribute contains the primary private IPv4 address.  AWS_INIT_HEALTH_STATUS  If the service configuration includes HealthCheckCustomConfig, you can optionally use AWS_INIT_HEALTH_STATUS to specify the initial status of the custom health check, HEALTHY or UNHEALTHY. If you don't specify a value for AWS_INIT_HEALTH_STATUS, the initial status is HEALTHY.  AWS_INSTANCE_CNAME  For a CNAME record, the domain name that Route 53 returns in response to DNS queries (for example, example.com).  AWS_INSTANCE_IPV4  For an A record, the IPv4 address that Route 53 returns in response to DNS queries (for example, 192.0.2.44).  AWS_INSTANCE_IPV6  For an AAAA record, the IPv6 address that Route 53 returns in response to DNS queries (for example, 2001:0db8:85a3:0000:0000:abcd:0001:2345).  AWS_INSTANCE_PORT  For an SRV record, the value that Route 53 returns for the port. In addition, if the service includes HealthCheckConfig, the port on the endpoint that Route 53 sends requests to.  
     */
    Attributes?: Attributes;
  }
  export type InstanceSummaryList = InstanceSummary[];
  export interface ListInstancesRequest {
    /**
     * The ID of the service that you want to list instances for.
     */
    ServiceId: ResourceId;
    /**
     * For the first ListInstances request, omit this value. If more than MaxResults instances match the specified criteria, you can submit another ListInstances request to get the next group of results. Specify the value of NextToken from the previous response in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of instances that you want Cloud Map to return in the response to a ListInstances request. If you don't specify a value for MaxResults, Cloud Map returns up to 100 instances.
     */
    MaxResults?: MaxResults;
  }
  export interface ListInstancesResponse {
    /**
     * Summary information about the instances that are associated with the specified service.
     */
    Instances?: InstanceSummaryList;
    /**
     * If more than MaxResults instances match the specified criteria, you can submit another ListInstances request to get the next group of results. Specify the value of NextToken from the previous response in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListNamespacesRequest {
    /**
     * For the first ListNamespaces request, omit this value. If the response contains NextToken, submit another ListNamespaces request to get the next group of results. Specify the value of NextToken from the previous response in the next request.  Cloud Map gets MaxResults namespaces and then filters them based on the specified criteria. It's possible that no namespaces in the first MaxResults namespaces matched the specified criteria but that subsequent groups of MaxResults namespaces do contain namespaces that match the criteria. 
     */
    NextToken?: NextToken;
    /**
     * The maximum number of namespaces that you want Cloud Map to return in the response to a ListNamespaces request. If you don't specify a value for MaxResults, Cloud Map returns up to 100 namespaces.
     */
    MaxResults?: MaxResults;
    /**
     * A complex type that contains specifications for the namespaces that you want to list. If you specify more than one filter, a namespace must match all filters to be returned by ListNamespaces.
     */
    Filters?: NamespaceFilters;
  }
  export interface ListNamespacesResponse {
    /**
     * An array that contains one NamespaceSummary object for each namespace that matches the specified filter criteria.
     */
    Namespaces?: NamespaceSummariesList;
    /**
     * If the response contains NextToken, submit another ListNamespaces request to get the next group of results. Specify the value of NextToken from the previous response in the next request.  Cloud Map gets MaxResults namespaces and then filters them based on the specified criteria. It's possible that no namespaces in the first MaxResults namespaces matched the specified criteria but that subsequent groups of MaxResults namespaces do contain namespaces that match the criteria. 
     */
    NextToken?: NextToken;
  }
  export interface ListOperationsRequest {
    /**
     * For the first ListOperations request, omit this value. If the response contains NextToken, submit another ListOperations request to get the next group of results. Specify the value of NextToken from the previous response in the next request.  Cloud Map gets MaxResults operations and then filters them based on the specified criteria. It's possible that no operations in the first MaxResults operations matched the specified criteria but that subsequent groups of MaxResults operations do contain operations that match the criteria. 
     */
    NextToken?: NextToken;
    /**
     * The maximum number of items that you want Cloud Map to return in the response to a ListOperations request. If you don't specify a value for MaxResults, Cloud Map returns up to 100 operations.
     */
    MaxResults?: MaxResults;
    /**
     * A complex type that contains specifications for the operations that you want to list, for example, operations that you started between a specified start date and end date. If you specify more than one filter, an operation must match all filters to be returned by ListOperations.
     */
    Filters?: OperationFilters;
  }
  export interface ListOperationsResponse {
    /**
     * Summary information about the operations that match the specified criteria.
     */
    Operations?: OperationSummaryList;
    /**
     * If the response contains NextToken, submit another ListOperations request to get the next group of results. Specify the value of NextToken from the previous response in the next request.  Cloud Map gets MaxResults operations and then filters them based on the specified criteria. It's possible that no operations in the first MaxResults operations matched the specified criteria but that subsequent groups of MaxResults operations do contain operations that match the criteria. 
     */
    NextToken?: NextToken;
  }
  export interface ListServicesRequest {
    /**
     * For the first ListServices request, omit this value. If the response contains NextToken, submit another ListServices request to get the next group of results. Specify the value of NextToken from the previous response in the next request.  Cloud Map gets MaxResults services and then filters them based on the specified criteria. It's possible that no services in the first MaxResults services matched the specified criteria but that subsequent groups of MaxResults services do contain services that match the criteria. 
     */
    NextToken?: NextToken;
    /**
     * The maximum number of services that you want Cloud Map to return in the response to a ListServices request. If you don't specify a value for MaxResults, Cloud Map returns up to 100 services.
     */
    MaxResults?: MaxResults;
    /**
     * A complex type that contains specifications for the namespaces that you want to list services for.  If you specify more than one filter, an operation must match all filters to be returned by ListServices.
     */
    Filters?: ServiceFilters;
  }
  export interface ListServicesResponse {
    /**
     * An array that contains one ServiceSummary object for each service that matches the specified filter criteria.
     */
    Services?: ServiceSummariesList;
    /**
     * If the response contains NextToken, submit another ListServices request to get the next group of results. Specify the value of NextToken from the previous response in the next request.  Cloud Map gets MaxResults services and then filters them based on the specified criteria. It's possible that no services in the first MaxResults services matched the specified criteria but that subsequent groups of MaxResults services do contain services that match the criteria. 
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to retrieve tags for.
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags that are assigned to the resource.
     */
    Tags?: TagList;
  }
  export type MaxResults = number;
  export type Message = string;
  export interface Namespace {
    /**
     * The ID of a namespace.
     */
    Id?: ResourceId;
    /**
     * The Amazon Resource Name (ARN) that Cloud Map assigns to the namespace when you create it.
     */
    Arn?: Arn;
    /**
     * The name of the namespace, such as example.com.
     */
    Name?: NamespaceName;
    /**
     * The type of the namespace. The methods for discovering instances depends on the value that you specify:  HTTP  Instances can be discovered only programmatically, using the Cloud Map DiscoverInstances API.  DNS_PUBLIC  Instances can be discovered using public DNS queries and using the DiscoverInstances API.  DNS_PRIVATE  Instances can be discovered using DNS queries in VPCs and using the DiscoverInstances API.  
     */
    Type?: NamespaceType;
    /**
     * The description that you specify for the namespace when you create it.
     */
    Description?: ResourceDescription;
    /**
     * The number of services that are associated with the namespace.
     */
    ServiceCount?: ResourceCount;
    /**
     * A complex type that contains information that's specific to the type of the namespace.
     */
    Properties?: NamespaceProperties;
    /**
     * The date that the namespace was created, in Unix date/time format and Coordinated Universal Time (UTC). The value of CreateDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreateDate?: Timestamp;
    /**
     * A unique string that identifies the request and that allows failed requests to be retried without the risk of running an operation twice. 
     */
    CreatorRequestId?: ResourceId;
  }
  export interface NamespaceFilter {
    /**
     * Specify TYPE.
     */
    Name: NamespaceFilterName;
    /**
     * If you specify EQ for Condition, specify either DNS_PUBLIC or DNS_PRIVATE. If you specify IN for Condition, you can specify DNS_PUBLIC, DNS_PRIVATE, or both.
     */
    Values: FilterValues;
    /**
     * The operator that you want to use to determine whether ListNamespaces returns a namespace. Valid values for condition include:  EQ  When you specify EQ for the condition, you can choose to list only public namespaces or private namespaces, but not both. EQ is the default condition and can be omitted.  IN  When you specify IN for the condition, you can choose to list public namespaces, private namespaces, or both.   BETWEEN   Not applicable  
     */
    Condition?: FilterCondition;
  }
  export type NamespaceFilterName = "TYPE"|string;
  export type NamespaceFilters = NamespaceFilter[];
  export type NamespaceName = string;
  export type NamespaceNameHttp = string;
  export type NamespaceNamePrivate = string;
  export type NamespaceNamePublic = string;
  export interface NamespaceProperties {
    /**
     * A complex type that contains the ID for the Route 53 hosted zone that Cloud Map creates when you create a namespace.
     */
    DnsProperties?: DnsProperties;
    /**
     * A complex type that contains the name of an HTTP namespace.
     */
    HttpProperties?: HttpProperties;
  }
  export type NamespaceSummariesList = NamespaceSummary[];
  export interface NamespaceSummary {
    /**
     * The ID of the namespace.
     */
    Id?: ResourceId;
    /**
     * The Amazon Resource Name (ARN) that Cloud Map assigns to the namespace when you create it.
     */
    Arn?: Arn;
    /**
     * The name of the namespace. When you create a namespace, Cloud Map automatically creates a Route 53 hosted zone that has the same name as the namespace.
     */
    Name?: NamespaceName;
    /**
     * The type of the namespace, either public or private.
     */
    Type?: NamespaceType;
    /**
     * A description for the namespace.
     */
    Description?: ResourceDescription;
    /**
     * The number of services that were created using the namespace.
     */
    ServiceCount?: ResourceCount;
    /**
     * The properties of the namespace.
     */
    Properties?: NamespaceProperties;
    /**
     * The date and time that the namespace was created.
     */
    CreateDate?: Timestamp;
  }
  export type NamespaceType = "DNS_PUBLIC"|"DNS_PRIVATE"|"HTTP"|string;
  export type NextToken = string;
  export interface Operation {
    /**
     * The ID of the operation that you want to get information about.
     */
    Id?: OperationId;
    /**
     * The name of the operation that's associated with the specified ID.
     */
    Type?: OperationType;
    /**
     * The status of the operation. Values include the following:  SUBMITTED  This is the initial state that occurs immediately after you submit a request.  PENDING  Cloud Map is performing the operation.  SUCCESS  The operation succeeded.  FAIL  The operation failed. For the failure reason, see ErrorMessage.  
     */
    Status?: OperationStatus;
    /**
     * If the value of Status is FAIL, the reason that the operation failed.
     */
    ErrorMessage?: Message;
    /**
     * The code associated with ErrorMessage. Values for ErrorCode include the following:    ACCESS_DENIED     CANNOT_CREATE_HOSTED_ZONE     EXPIRED_TOKEN     HOSTED_ZONE_NOT_FOUND     INTERNAL_FAILURE     INVALID_CHANGE_BATCH     THROTTLED_REQUEST   
     */
    ErrorCode?: Code;
    /**
     * The date and time that the request was submitted, in Unix date/time format and Coordinated Universal Time (UTC). The value of CreateDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreateDate?: Timestamp;
    /**
     * The date and time that the value of Status changed to the current value, in Unix date/time format and Coordinated Universal Time (UTC). The value of UpdateDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    UpdateDate?: Timestamp;
    /**
     * The name of the target entity that's associated with the operation:  NAMESPACE  The namespace ID is returned in the ResourceId property.  SERVICE  The service ID is returned in the ResourceId property.  INSTANCE  The instance ID is returned in the ResourceId property.  
     */
    Targets?: OperationTargetsMap;
  }
  export interface OperationFilter {
    /**
     * Specify the operations that you want to get:    NAMESPACE_ID: Gets operations related to specified namespaces.    SERVICE_ID: Gets operations related to specified services.    STATUS: Gets operations based on the status of the operations: SUBMITTED, PENDING, SUCCEED, or FAIL.    TYPE: Gets specified types of operation.    UPDATE_DATE: Gets operations that changed status during a specified date/time range.   
     */
    Name: OperationFilterName;
    /**
     * Specify values that are applicable to the value that you specify for Name:     NAMESPACE_ID: Specify one namespace ID.    SERVICE_ID: Specify one service ID.    STATUS: Specify one or more statuses: SUBMITTED, PENDING, SUCCEED, or FAIL.    TYPE: Specify one or more of the following types: CREATE_NAMESPACE, DELETE_NAMESPACE, UPDATE_SERVICE, REGISTER_INSTANCE, or DEREGISTER_INSTANCE.    UPDATE_DATE: Specify a start date and an end date in Unix date/time format and Coordinated Universal Time (UTC). The start date must be the first value.  
     */
    Values: FilterValues;
    /**
     * The operator that you want to use to determine whether an operation matches the specified value. Valid values for condition include:    EQ: When you specify EQ for the condition, you can specify only one value. EQ is supported for NAMESPACE_ID, SERVICE_ID, STATUS, and TYPE. EQ is the default condition and can be omitted.    IN: When you specify IN for the condition, you can specify a list of one or more values. IN is supported for STATUS and TYPE. An operation must match one of the specified values to be returned in the response.    BETWEEN: Specify a start date and an end date in Unix date/time format and Coordinated Universal Time (UTC). The start date must be the first value. BETWEEN is supported for UPDATE_DATE.   
     */
    Condition?: FilterCondition;
  }
  export type OperationFilterName = "NAMESPACE_ID"|"SERVICE_ID"|"STATUS"|"TYPE"|"UPDATE_DATE"|string;
  export type OperationFilters = OperationFilter[];
  export type OperationId = string;
  export type OperationStatus = "SUBMITTED"|"PENDING"|"SUCCESS"|"FAIL"|string;
  export interface OperationSummary {
    /**
     * The ID for an operation.
     */
    Id?: OperationId;
    /**
     * The status of the operation. Values include the following:    SUBMITTED: This is the initial state immediately after you submit a request.    PENDING: Cloud Map is performing the operation.    SUCCESS: The operation succeeded.    FAIL: The operation failed. For the failure reason, see ErrorMessage.  
     */
    Status?: OperationStatus;
  }
  export type OperationSummaryList = OperationSummary[];
  export type OperationTargetType = "NAMESPACE"|"SERVICE"|"INSTANCE"|string;
  export type OperationTargetsMap = {[key: string]: ResourceId};
  export type OperationType = "CREATE_NAMESPACE"|"DELETE_NAMESPACE"|"UPDATE_NAMESPACE"|"UPDATE_SERVICE"|"REGISTER_INSTANCE"|"DEREGISTER_INSTANCE"|string;
  export interface PrivateDnsNamespaceChange {
    /**
     * An updated description for the private DNS namespace.
     */
    Description?: ResourceDescription;
    /**
     * Properties to be updated in the private DNS namespace.
     */
    Properties?: PrivateDnsNamespacePropertiesChange;
  }
  export interface PrivateDnsNamespaceProperties {
    /**
     * DNS properties for the private DNS namespace.
     */
    DnsProperties: PrivateDnsPropertiesMutable;
  }
  export interface PrivateDnsNamespacePropertiesChange {
    /**
     * Updated DNS properties for the private DNS namespace.
     */
    DnsProperties: PrivateDnsPropertiesMutableChange;
  }
  export interface PrivateDnsPropertiesMutable {
    /**
     * Fields for the Start of Authority (SOA) record for the hosted zone for the private DNS namespace.
     */
    SOA: SOA;
  }
  export interface PrivateDnsPropertiesMutableChange {
    /**
     * Updated fields for the Start of Authority (SOA) record for the hosted zone for the private DNS namespace.
     */
    SOA: SOAChange;
  }
  export interface PublicDnsNamespaceChange {
    /**
     * An updated description for the public DNS namespace.
     */
    Description?: ResourceDescription;
    /**
     * Properties to be updated in the public DNS namespace.
     */
    Properties?: PublicDnsNamespacePropertiesChange;
  }
  export interface PublicDnsNamespaceProperties {
    /**
     * DNS properties for the public DNS namespace.
     */
    DnsProperties: PublicDnsPropertiesMutable;
  }
  export interface PublicDnsNamespacePropertiesChange {
    /**
     * Updated DNS properties for the hosted zone for the public DNS namespace.
     */
    DnsProperties: PublicDnsPropertiesMutableChange;
  }
  export interface PublicDnsPropertiesMutable {
    /**
     * Start of Authority (SOA) record for the hosted zone for the public DNS namespace.
     */
    SOA: SOA;
  }
  export interface PublicDnsPropertiesMutableChange {
    /**
     * Updated fields for the Start of Authority (SOA) record for the hosted zone for the public DNS namespace.
     */
    SOA: SOAChange;
  }
  export type RecordTTL = number;
  export type RecordType = "SRV"|"A"|"AAAA"|"CNAME"|string;
  export interface RegisterInstanceRequest {
    /**
     * The ID of the service that you want to use for settings for the instance.
     */
    ServiceId: ResourceId;
    /**
     * An identifier that you want to associate with the instance. Note the following:   If the service that's specified by ServiceId includes settings for an SRV record, the value of InstanceId is automatically included as part of the value for the SRV record. For more information, see DnsRecord &gt; Type.   You can use this value to update an existing instance.   To register a new instance, you must specify a value that's unique among instances that you register by using the same service.    If you specify an existing InstanceId and ServiceId, Cloud Map updates the existing DNS records, if any. If there's also an existing health check, Cloud Map deletes the old health check and creates a new one.   The health check isn't deleted immediately, so it will still appear for a while if you submit a ListHealthChecks request, for example.   
     */
    InstanceId: InstanceId;
    /**
     * A unique string that identifies the request and that allows failed RegisterInstance requests to be retried without the risk of executing the operation twice. You must use a unique CreatorRequestId string every time you submit a RegisterInstance request if you're registering additional instances for the same namespace and service. CreatorRequestId can be any unique string (for example, a date/time stamp).
     */
    CreatorRequestId?: ResourceId;
    /**
     * A string map that contains the following information for the service that you specify in ServiceId:   The attributes that apply to the records that are defined in the service.    For each attribute, the applicable value.   Supported attribute keys include the following:  AWS_ALIAS_DNS_NAME  If you want Cloud Map to create an Amazon Route 53 alias record that routes traffic to an Elastic Load Balancing load balancer, specify the DNS name that's associated with the load balancer. For information about how to get the DNS name, see "DNSName" in the topic AliasTarget in the Route 53 API Reference. Note the following:   The configuration for the service that's specified by ServiceId must include settings for an A record, an AAAA record, or both.   In the service that's specified by ServiceId, the value of RoutingPolicy must be WEIGHTED.   If the service that's specified by ServiceId includes HealthCheckConfig settings, Cloud Map will create the Route 53 health check, but it doesn't associate the health check with the alias record.   Auto naming currently doesn't support creating alias records that route traffic to Amazon Web Services resources other than Elastic Load Balancing load balancers.   If you specify a value for AWS_ALIAS_DNS_NAME, don't specify values for any of the AWS_INSTANCE attributes.    AWS_EC2_INSTANCE_ID   HTTP namespaces only. The Amazon EC2 instance ID for the instance. If the AWS_EC2_INSTANCE_ID attribute is specified, then the only other attribute that can be specified is AWS_INIT_HEALTH_STATUS. When the AWS_EC2_INSTANCE_ID attribute is specified, then the AWS_INSTANCE_IPV4 attribute will be filled out with the primary private IPv4 address.  AWS_INIT_HEALTH_STATUS  If the service configuration includes HealthCheckCustomConfig, you can optionally use AWS_INIT_HEALTH_STATUS to specify the initial status of the custom health check, HEALTHY or UNHEALTHY. If you don't specify a value for AWS_INIT_HEALTH_STATUS, the initial status is HEALTHY.  AWS_INSTANCE_CNAME  If the service configuration includes a CNAME record, the domain name that you want Route 53 to return in response to DNS queries (for example, example.com). This value is required if the service specified by ServiceId includes settings for an CNAME record.  AWS_INSTANCE_IPV4  If the service configuration includes an A record, the IPv4 address that you want Route 53 to return in response to DNS queries (for example, 192.0.2.44). This value is required if the service specified by ServiceId includes settings for an A record. If the service includes settings for an SRV record, you must specify a value for AWS_INSTANCE_IPV4, AWS_INSTANCE_IPV6, or both.  AWS_INSTANCE_IPV6  If the service configuration includes an AAAA record, the IPv6 address that you want Route 53 to return in response to DNS queries (for example, 2001:0db8:85a3:0000:0000:abcd:0001:2345). This value is required if the service specified by ServiceId includes settings for an AAAA record. If the service includes settings for an SRV record, you must specify a value for AWS_INSTANCE_IPV4, AWS_INSTANCE_IPV6, or both.  AWS_INSTANCE_PORT  If the service includes an SRV record, the value that you want Route 53 to return for the port. If the service includes HealthCheckConfig, the port on the endpoint that you want Route 53 to send requests to.  This value is required if you specified settings for an SRV record or a Route 53 health check when you created the service.  Custom attributes  You can add up to 30 custom attributes. For each key-value pair, the maximum length of the attribute name is 255 characters, and the maximum length of the attribute value is 1,024 characters. The total size of all provided attributes (sum of all keys and values) must not exceed 5,000 characters.  
     */
    Attributes: Attributes;
  }
  export interface RegisterInstanceResponse {
    /**
     * A value that you can use to determine whether the request completed successfully. To get the status of the operation, see GetOperation.
     */
    OperationId?: OperationId;
  }
  export type ResourceCount = number;
  export type ResourceDescription = string;
  export type ResourceId = string;
  export type ResourcePath = string;
  export type RoutingPolicy = "MULTIVALUE"|"WEIGHTED"|string;
  export interface SOA {
    /**
     * The time to live (TTL) for purposes of negative caching.
     */
    TTL: RecordTTL;
  }
  export interface SOAChange {
    /**
     * The updated time to live (TTL) for purposes of negative caching.
     */
    TTL: RecordTTL;
  }
  export interface Service {
    /**
     * The ID that Cloud Map assigned to the service when you created it.
     */
    Id?: ResourceId;
    /**
     * The Amazon Resource Name (ARN) that Cloud Map assigns to the service when you create it.
     */
    Arn?: Arn;
    /**
     * The name of the service.
     */
    Name?: ServiceName;
    /**
     * The ID of the namespace that was used to create the service.
     */
    NamespaceId?: ResourceId;
    /**
     * The description of the service.
     */
    Description?: ResourceDescription;
    /**
     * The number of instances that are currently associated with the service. Instances that were previously associated with the service but that are deleted aren't included in the count. The count might not reflect pending registrations and deregistrations.
     */
    InstanceCount?: ResourceCount;
    /**
     * A complex type that contains information about the Route 53 DNS records that you want Cloud Map to create when you register an instance.
     */
    DnsConfig?: DnsConfig;
    /**
     * Describes the systems that can be used to discover the service instances.  DNS_HTTP  The service instances can be discovered using either DNS queries or the DiscoverInstances API operation.  HTTP  The service instances can only be discovered using the DiscoverInstances API operation.  DNS  Reserved.  
     */
    Type?: ServiceType;
    /**
     *  Public DNS and HTTP namespaces only. A complex type that contains settings for an optional health check. If you specify settings for a health check, Cloud Map associates the health check with the records that you specify in DnsConfig. For information about the charges for health checks, see Amazon Route 53 Pricing.
     */
    HealthCheckConfig?: HealthCheckConfig;
    /**
     * A complex type that contains information about an optional custom health check.  If you specify a health check configuration, you can specify either HealthCheckCustomConfig or HealthCheckConfig but not both. 
     */
    HealthCheckCustomConfig?: HealthCheckCustomConfig;
    /**
     * The date and time that the service was created, in Unix format and Coordinated Universal Time (UTC). The value of CreateDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreateDate?: Timestamp;
    /**
     * A unique string that identifies the request and that allows failed requests to be retried without the risk of running the operation twice. CreatorRequestId can be any unique string (for example, a date/timestamp).
     */
    CreatorRequestId?: ResourceId;
  }
  export interface ServiceChange {
    /**
     * A description for the service.
     */
    Description?: ResourceDescription;
    /**
     * Information about the Route 53 DNS records that you want Cloud Map to create when you register an instance.
     */
    DnsConfig?: DnsConfigChange;
    /**
     *  Public DNS and HTTP namespaces only. Settings for an optional health check. If you specify settings for a health check, Cloud Map associates the health check with the records that you specify in DnsConfig.
     */
    HealthCheckConfig?: HealthCheckConfig;
  }
  export interface ServiceFilter {
    /**
     * Specify NAMESPACE_ID.
     */
    Name: ServiceFilterName;
    /**
     * The values that are applicable to the value that you specify for Condition to filter the list of services.
     */
    Values: FilterValues;
    /**
     * The operator that you want to use to determine whether a service is returned by ListServices. Valid values for Condition include the following:    EQ: When you specify EQ, specify one namespace ID for Values. EQ is the default condition and can be omitted.    IN: When you specify IN, specify a list of the IDs for the namespaces that you want ListServices to return a list of services for.    BETWEEN: Not applicable.  
     */
    Condition?: FilterCondition;
  }
  export type ServiceFilterName = "NAMESPACE_ID"|string;
  export type ServiceFilters = ServiceFilter[];
  export type ServiceName = string;
  export type ServiceSummariesList = ServiceSummary[];
  export interface ServiceSummary {
    /**
     * The ID that Cloud Map assigned to the service when you created it.
     */
    Id?: ResourceId;
    /**
     * The Amazon Resource Name (ARN) that Cloud Map assigns to the service when you create it.
     */
    Arn?: Arn;
    /**
     * The name of the service.
     */
    Name?: ServiceName;
    /**
     * Describes the systems that can be used to discover the service instances.  DNS_HTTP  The service instances can be discovered using either DNS queries or the DiscoverInstances API operation.  HTTP  The service instances can only be discovered using the DiscoverInstances API operation.  DNS  Reserved.  
     */
    Type?: ServiceType;
    /**
     * The description that you specify when you create the service.
     */
    Description?: ResourceDescription;
    /**
     * The number of instances that are currently associated with the service. Instances that were previously associated with the service but that are deleted aren't included in the count. The count might not reflect pending registrations and deregistrations.
     */
    InstanceCount?: ResourceCount;
    /**
     * Information about the Route 53 DNS records that you want Cloud Map to create when you register an instance.
     */
    DnsConfig?: DnsConfig;
    /**
     *  Public DNS and HTTP namespaces only. Settings for an optional health check. If you specify settings for a health check, Cloud Map associates the health check with the records that you specify in DnsConfig.
     */
    HealthCheckConfig?: HealthCheckConfig;
    /**
     * Information about an optional custom health check. A custom health check, which requires that you use a third-party health checker to evaluate the health of your resources, is useful in the following circumstances:   You can't use a health check that's defined by HealthCheckConfig because the resource isn't available over the internet. For example, you can use a custom health check when the instance is in an Amazon VPC. (To check the health of resources in a VPC, the health checker must also be in the VPC.)   You want to use a third-party health checker regardless of where your resources are located.    If you specify a health check configuration, you can specify either HealthCheckCustomConfig or HealthCheckConfig but not both. 
     */
    HealthCheckCustomConfig?: HealthCheckCustomConfig;
    /**
     * The date and time that the service was created.
     */
    CreateDate?: Timestamp;
  }
  export type ServiceType = "HTTP"|"DNS_HTTP"|"DNS"|string;
  export type ServiceTypeOption = "HTTP"|string;
  export interface Tag {
    /**
     * The key identifier, or name, of the tag.
     */
    Key: TagKey;
    /**
     * The string value that's associated with the key of the tag. You can set the value of a tag to an empty string, but you can't set the value of a tag to null.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to retrieve tags for.
     */
    ResourceARN: AmazonResourceName;
    /**
     * The tags to add to the specified resource. Specifying the tag key is required. You can set the value of a tag to an empty string, but you can't set the value of a tag to null.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to retrieve tags for.
     */
    ResourceARN: AmazonResourceName;
    /**
     * The tag keys to remove from the specified resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateHttpNamespaceRequest {
    /**
     * The ID of the namespace that you want to update.
     */
    Id: ResourceId;
    /**
     * A unique string that identifies the request and that allows failed UpdateHttpNamespace requests to be retried without the risk of running the operation twice. UpdaterRequestId can be any unique string (for example, a date/timestamp).
     */
    UpdaterRequestId?: ResourceId;
    /**
     * Updated properties for the the HTTP namespace.
     */
    Namespace: HttpNamespaceChange;
  }
  export interface UpdateHttpNamespaceResponse {
    /**
     * A value that you can use to determine whether the request completed successfully. To get the status of the operation, see GetOperation.
     */
    OperationId?: OperationId;
  }
  export interface UpdateInstanceCustomHealthStatusRequest {
    /**
     * The ID of the service that includes the configuration for the custom health check that you want to change the status for.
     */
    ServiceId: ResourceId;
    /**
     * The ID of the instance that you want to change the health status for.
     */
    InstanceId: ResourceId;
    /**
     * The new status of the instance, HEALTHY or UNHEALTHY.
     */
    Status: CustomHealthStatus;
  }
  export interface UpdatePrivateDnsNamespaceRequest {
    /**
     * The ID of the namespace that you want to update.
     */
    Id: ResourceId;
    /**
     * A unique string that identifies the request and that allows failed UpdatePrivateDnsNamespace requests to be retried without the risk of running the operation twice. UpdaterRequestId can be any unique string (for example, a date/timestamp).
     */
    UpdaterRequestId?: ResourceId;
    /**
     * Updated properties for the private DNS namespace.
     */
    Namespace: PrivateDnsNamespaceChange;
  }
  export interface UpdatePrivateDnsNamespaceResponse {
    /**
     * A value that you can use to determine whether the request completed successfully. To get the status of the operation, see GetOperation.
     */
    OperationId?: OperationId;
  }
  export interface UpdatePublicDnsNamespaceRequest {
    /**
     * The ID of the namespace being updated.
     */
    Id: ResourceId;
    /**
     * A unique string that identifies the request and that allows failed UpdatePublicDnsNamespace requests to be retried without the risk of running the operation twice. UpdaterRequestId can be any unique string (for example, a date/timestamp).
     */
    UpdaterRequestId?: ResourceId;
    /**
     * Updated properties for the public DNS namespace.
     */
    Namespace: PublicDnsNamespaceChange;
  }
  export interface UpdatePublicDnsNamespaceResponse {
    /**
     * A value that you can use to determine whether the request completed successfully. To get the status of the operation, see GetOperation.
     */
    OperationId?: OperationId;
  }
  export interface UpdateServiceRequest {
    /**
     * The ID of the service that you want to update.
     */
    Id: ResourceId;
    /**
     * A complex type that contains the new settings for the service.
     */
    Service: ServiceChange;
  }
  export interface UpdateServiceResponse {
    /**
     * A value that you can use to determine whether the request completed successfully. To get the status of the operation, see GetOperation.
     */
    OperationId?: OperationId;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-03-14"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ServiceDiscovery client.
   */
  export import Types = ServiceDiscovery;
}
export = ServiceDiscovery;
