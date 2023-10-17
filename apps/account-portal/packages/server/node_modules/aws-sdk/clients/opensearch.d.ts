import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class OpenSearch extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: OpenSearch.Types.ClientConfiguration)
  config: Config & OpenSearch.Types.ClientConfiguration;
  /**
   * Allows the destination Amazon OpenSearch Service domain owner to accept an inbound cross-cluster search connection request. For more information, see Cross-cluster search for Amazon OpenSearch Service.
   */
  acceptInboundConnection(params: OpenSearch.Types.AcceptInboundConnectionRequest, callback?: (err: AWSError, data: OpenSearch.Types.AcceptInboundConnectionResponse) => void): Request<OpenSearch.Types.AcceptInboundConnectionResponse, AWSError>;
  /**
   * Allows the destination Amazon OpenSearch Service domain owner to accept an inbound cross-cluster search connection request. For more information, see Cross-cluster search for Amazon OpenSearch Service.
   */
  acceptInboundConnection(callback?: (err: AWSError, data: OpenSearch.Types.AcceptInboundConnectionResponse) => void): Request<OpenSearch.Types.AcceptInboundConnectionResponse, AWSError>;
  /**
   * Attaches tags to an existing Amazon OpenSearch Service domain. Tags are a set of case-sensitive key-value pairs. A domain can have up to 10 tags. For more information, see Tagging Amazon OpenSearch Service domains.
   */
  addTags(params: OpenSearch.Types.AddTagsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches tags to an existing Amazon OpenSearch Service domain. Tags are a set of case-sensitive key-value pairs. A domain can have up to 10 tags. For more information, see Tagging Amazon OpenSearch Service domains.
   */
  addTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates a package with an Amazon OpenSearch Service domain. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  associatePackage(params: OpenSearch.Types.AssociatePackageRequest, callback?: (err: AWSError, data: OpenSearch.Types.AssociatePackageResponse) => void): Request<OpenSearch.Types.AssociatePackageResponse, AWSError>;
  /**
   * Associates a package with an Amazon OpenSearch Service domain. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  associatePackage(callback?: (err: AWSError, data: OpenSearch.Types.AssociatePackageResponse) => void): Request<OpenSearch.Types.AssociatePackageResponse, AWSError>;
  /**
   * Provides access to an Amazon OpenSearch Service domain through the use of an interface VPC endpoint.
   */
  authorizeVpcEndpointAccess(params: OpenSearch.Types.AuthorizeVpcEndpointAccessRequest, callback?: (err: AWSError, data: OpenSearch.Types.AuthorizeVpcEndpointAccessResponse) => void): Request<OpenSearch.Types.AuthorizeVpcEndpointAccessResponse, AWSError>;
  /**
   * Provides access to an Amazon OpenSearch Service domain through the use of an interface VPC endpoint.
   */
  authorizeVpcEndpointAccess(callback?: (err: AWSError, data: OpenSearch.Types.AuthorizeVpcEndpointAccessResponse) => void): Request<OpenSearch.Types.AuthorizeVpcEndpointAccessResponse, AWSError>;
  /**
   * Cancels a scheduled service software update for an Amazon OpenSearch Service domain. You can only perform this operation before the AutomatedUpdateDate and when the domain's UpdateStatus is PENDING_UPDATE. For more information, see Service software updates in Amazon OpenSearch Service.
   */
  cancelServiceSoftwareUpdate(params: OpenSearch.Types.CancelServiceSoftwareUpdateRequest, callback?: (err: AWSError, data: OpenSearch.Types.CancelServiceSoftwareUpdateResponse) => void): Request<OpenSearch.Types.CancelServiceSoftwareUpdateResponse, AWSError>;
  /**
   * Cancels a scheduled service software update for an Amazon OpenSearch Service domain. You can only perform this operation before the AutomatedUpdateDate and when the domain's UpdateStatus is PENDING_UPDATE. For more information, see Service software updates in Amazon OpenSearch Service.
   */
  cancelServiceSoftwareUpdate(callback?: (err: AWSError, data: OpenSearch.Types.CancelServiceSoftwareUpdateResponse) => void): Request<OpenSearch.Types.CancelServiceSoftwareUpdateResponse, AWSError>;
  /**
   * Creates an Amazon OpenSearch Service domain. For more information, see Creating and managing Amazon OpenSearch Service domains.
   */
  createDomain(params: OpenSearch.Types.CreateDomainRequest, callback?: (err: AWSError, data: OpenSearch.Types.CreateDomainResponse) => void): Request<OpenSearch.Types.CreateDomainResponse, AWSError>;
  /**
   * Creates an Amazon OpenSearch Service domain. For more information, see Creating and managing Amazon OpenSearch Service domains.
   */
  createDomain(callback?: (err: AWSError, data: OpenSearch.Types.CreateDomainResponse) => void): Request<OpenSearch.Types.CreateDomainResponse, AWSError>;
  /**
   * Creates a new cross-cluster search connection from a source Amazon OpenSearch Service domain to a destination domain. For more information, see Cross-cluster search for Amazon OpenSearch Service.
   */
  createOutboundConnection(params: OpenSearch.Types.CreateOutboundConnectionRequest, callback?: (err: AWSError, data: OpenSearch.Types.CreateOutboundConnectionResponse) => void): Request<OpenSearch.Types.CreateOutboundConnectionResponse, AWSError>;
  /**
   * Creates a new cross-cluster search connection from a source Amazon OpenSearch Service domain to a destination domain. For more information, see Cross-cluster search for Amazon OpenSearch Service.
   */
  createOutboundConnection(callback?: (err: AWSError, data: OpenSearch.Types.CreateOutboundConnectionResponse) => void): Request<OpenSearch.Types.CreateOutboundConnectionResponse, AWSError>;
  /**
   * Creates a package for use with Amazon OpenSearch Service domains. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  createPackage(params: OpenSearch.Types.CreatePackageRequest, callback?: (err: AWSError, data: OpenSearch.Types.CreatePackageResponse) => void): Request<OpenSearch.Types.CreatePackageResponse, AWSError>;
  /**
   * Creates a package for use with Amazon OpenSearch Service domains. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  createPackage(callback?: (err: AWSError, data: OpenSearch.Types.CreatePackageResponse) => void): Request<OpenSearch.Types.CreatePackageResponse, AWSError>;
  /**
   * Creates an Amazon OpenSearch Service-managed VPC endpoint.
   */
  createVpcEndpoint(params: OpenSearch.Types.CreateVpcEndpointRequest, callback?: (err: AWSError, data: OpenSearch.Types.CreateVpcEndpointResponse) => void): Request<OpenSearch.Types.CreateVpcEndpointResponse, AWSError>;
  /**
   * Creates an Amazon OpenSearch Service-managed VPC endpoint.
   */
  createVpcEndpoint(callback?: (err: AWSError, data: OpenSearch.Types.CreateVpcEndpointResponse) => void): Request<OpenSearch.Types.CreateVpcEndpointResponse, AWSError>;
  /**
   * Deletes an Amazon OpenSearch Service domain and all of its data. You can't recover a domain after you delete it.
   */
  deleteDomain(params: OpenSearch.Types.DeleteDomainRequest, callback?: (err: AWSError, data: OpenSearch.Types.DeleteDomainResponse) => void): Request<OpenSearch.Types.DeleteDomainResponse, AWSError>;
  /**
   * Deletes an Amazon OpenSearch Service domain and all of its data. You can't recover a domain after you delete it.
   */
  deleteDomain(callback?: (err: AWSError, data: OpenSearch.Types.DeleteDomainResponse) => void): Request<OpenSearch.Types.DeleteDomainResponse, AWSError>;
  /**
   * Allows the destination Amazon OpenSearch Service domain owner to delete an existing inbound cross-cluster search connection. For more information, see Cross-cluster search for Amazon OpenSearch Service.
   */
  deleteInboundConnection(params: OpenSearch.Types.DeleteInboundConnectionRequest, callback?: (err: AWSError, data: OpenSearch.Types.DeleteInboundConnectionResponse) => void): Request<OpenSearch.Types.DeleteInboundConnectionResponse, AWSError>;
  /**
   * Allows the destination Amazon OpenSearch Service domain owner to delete an existing inbound cross-cluster search connection. For more information, see Cross-cluster search for Amazon OpenSearch Service.
   */
  deleteInboundConnection(callback?: (err: AWSError, data: OpenSearch.Types.DeleteInboundConnectionResponse) => void): Request<OpenSearch.Types.DeleteInboundConnectionResponse, AWSError>;
  /**
   * Allows the source Amazon OpenSearch Service domain owner to delete an existing outbound cross-cluster search connection. For more information, see Cross-cluster search for Amazon OpenSearch Service.
   */
  deleteOutboundConnection(params: OpenSearch.Types.DeleteOutboundConnectionRequest, callback?: (err: AWSError, data: OpenSearch.Types.DeleteOutboundConnectionResponse) => void): Request<OpenSearch.Types.DeleteOutboundConnectionResponse, AWSError>;
  /**
   * Allows the source Amazon OpenSearch Service domain owner to delete an existing outbound cross-cluster search connection. For more information, see Cross-cluster search for Amazon OpenSearch Service.
   */
  deleteOutboundConnection(callback?: (err: AWSError, data: OpenSearch.Types.DeleteOutboundConnectionResponse) => void): Request<OpenSearch.Types.DeleteOutboundConnectionResponse, AWSError>;
  /**
   * Deletes an Amazon OpenSearch Service package. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  deletePackage(params: OpenSearch.Types.DeletePackageRequest, callback?: (err: AWSError, data: OpenSearch.Types.DeletePackageResponse) => void): Request<OpenSearch.Types.DeletePackageResponse, AWSError>;
  /**
   * Deletes an Amazon OpenSearch Service package. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  deletePackage(callback?: (err: AWSError, data: OpenSearch.Types.DeletePackageResponse) => void): Request<OpenSearch.Types.DeletePackageResponse, AWSError>;
  /**
   * Deletes an Amazon OpenSearch Service-managed interface VPC endpoint.
   */
  deleteVpcEndpoint(params: OpenSearch.Types.DeleteVpcEndpointRequest, callback?: (err: AWSError, data: OpenSearch.Types.DeleteVpcEndpointResponse) => void): Request<OpenSearch.Types.DeleteVpcEndpointResponse, AWSError>;
  /**
   * Deletes an Amazon OpenSearch Service-managed interface VPC endpoint.
   */
  deleteVpcEndpoint(callback?: (err: AWSError, data: OpenSearch.Types.DeleteVpcEndpointResponse) => void): Request<OpenSearch.Types.DeleteVpcEndpointResponse, AWSError>;
  /**
   * Describes the domain configuration for the specified Amazon OpenSearch Service domain, including the domain ID, domain service endpoint, and domain ARN.
   */
  describeDomain(params: OpenSearch.Types.DescribeDomainRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainResponse) => void): Request<OpenSearch.Types.DescribeDomainResponse, AWSError>;
  /**
   * Describes the domain configuration for the specified Amazon OpenSearch Service domain, including the domain ID, domain service endpoint, and domain ARN.
   */
  describeDomain(callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainResponse) => void): Request<OpenSearch.Types.DescribeDomainResponse, AWSError>;
  /**
   * Returns the list of optimizations that Auto-Tune has made to an Amazon OpenSearch Service domain. For more information, see Auto-Tune for Amazon OpenSearch Service.
   */
  describeDomainAutoTunes(params: OpenSearch.Types.DescribeDomainAutoTunesRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainAutoTunesResponse) => void): Request<OpenSearch.Types.DescribeDomainAutoTunesResponse, AWSError>;
  /**
   * Returns the list of optimizations that Auto-Tune has made to an Amazon OpenSearch Service domain. For more information, see Auto-Tune for Amazon OpenSearch Service.
   */
  describeDomainAutoTunes(callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainAutoTunesResponse) => void): Request<OpenSearch.Types.DescribeDomainAutoTunesResponse, AWSError>;
  /**
   * Returns information about the current blue/green deployment happening on an Amazon OpenSearch Service domain. For more information, see Making configuration changes in Amazon OpenSearch Service.
   */
  describeDomainChangeProgress(params: OpenSearch.Types.DescribeDomainChangeProgressRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainChangeProgressResponse) => void): Request<OpenSearch.Types.DescribeDomainChangeProgressResponse, AWSError>;
  /**
   * Returns information about the current blue/green deployment happening on an Amazon OpenSearch Service domain. For more information, see Making configuration changes in Amazon OpenSearch Service.
   */
  describeDomainChangeProgress(callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainChangeProgressResponse) => void): Request<OpenSearch.Types.DescribeDomainChangeProgressResponse, AWSError>;
  /**
   * Returns the configuration of an Amazon OpenSearch Service domain.
   */
  describeDomainConfig(params: OpenSearch.Types.DescribeDomainConfigRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainConfigResponse) => void): Request<OpenSearch.Types.DescribeDomainConfigResponse, AWSError>;
  /**
   * Returns the configuration of an Amazon OpenSearch Service domain.
   */
  describeDomainConfig(callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainConfigResponse) => void): Request<OpenSearch.Types.DescribeDomainConfigResponse, AWSError>;
  /**
   * Returns information about domain and node health, the standby Availability Zone, number of nodes per Availability Zone, and shard count per node.
   */
  describeDomainHealth(params: OpenSearch.Types.DescribeDomainHealthRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainHealthResponse) => void): Request<OpenSearch.Types.DescribeDomainHealthResponse, AWSError>;
  /**
   * Returns information about domain and node health, the standby Availability Zone, number of nodes per Availability Zone, and shard count per node.
   */
  describeDomainHealth(callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainHealthResponse) => void): Request<OpenSearch.Types.DescribeDomainHealthResponse, AWSError>;
  /**
   * Returns information about domain and nodes, including data nodes, master nodes, ultrawarm nodes, Availability Zone(s), standby nodes, node configurations, and node states.
   */
  describeDomainNodes(params: OpenSearch.Types.DescribeDomainNodesRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainNodesResponse) => void): Request<OpenSearch.Types.DescribeDomainNodesResponse, AWSError>;
  /**
   * Returns information about domain and nodes, including data nodes, master nodes, ultrawarm nodes, Availability Zone(s), standby nodes, node configurations, and node states.
   */
  describeDomainNodes(callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainNodesResponse) => void): Request<OpenSearch.Types.DescribeDomainNodesResponse, AWSError>;
  /**
   * Returns domain configuration information about the specified Amazon OpenSearch Service domains.
   */
  describeDomains(params: OpenSearch.Types.DescribeDomainsRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainsResponse) => void): Request<OpenSearch.Types.DescribeDomainsResponse, AWSError>;
  /**
   * Returns domain configuration information about the specified Amazon OpenSearch Service domains.
   */
  describeDomains(callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainsResponse) => void): Request<OpenSearch.Types.DescribeDomainsResponse, AWSError>;
  /**
   * Describes the progress of a pre-update dry run analysis on an Amazon OpenSearch Service domain. For more information, see Determining whether a change will cause a blue/green deployment.
   */
  describeDryRunProgress(params: OpenSearch.Types.DescribeDryRunProgressRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeDryRunProgressResponse) => void): Request<OpenSearch.Types.DescribeDryRunProgressResponse, AWSError>;
  /**
   * Describes the progress of a pre-update dry run analysis on an Amazon OpenSearch Service domain. For more information, see Determining whether a change will cause a blue/green deployment.
   */
  describeDryRunProgress(callback?: (err: AWSError, data: OpenSearch.Types.DescribeDryRunProgressResponse) => void): Request<OpenSearch.Types.DescribeDryRunProgressResponse, AWSError>;
  /**
   * Lists all the inbound cross-cluster search connections for a destination (remote) Amazon OpenSearch Service domain. For more information, see Cross-cluster search for Amazon OpenSearch Service.
   */
  describeInboundConnections(params: OpenSearch.Types.DescribeInboundConnectionsRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeInboundConnectionsResponse) => void): Request<OpenSearch.Types.DescribeInboundConnectionsResponse, AWSError>;
  /**
   * Lists all the inbound cross-cluster search connections for a destination (remote) Amazon OpenSearch Service domain. For more information, see Cross-cluster search for Amazon OpenSearch Service.
   */
  describeInboundConnections(callback?: (err: AWSError, data: OpenSearch.Types.DescribeInboundConnectionsResponse) => void): Request<OpenSearch.Types.DescribeInboundConnectionsResponse, AWSError>;
  /**
   * Describes the instance count, storage, and master node limits for a given OpenSearch or Elasticsearch version and instance type.
   */
  describeInstanceTypeLimits(params: OpenSearch.Types.DescribeInstanceTypeLimitsRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeInstanceTypeLimitsResponse) => void): Request<OpenSearch.Types.DescribeInstanceTypeLimitsResponse, AWSError>;
  /**
   * Describes the instance count, storage, and master node limits for a given OpenSearch or Elasticsearch version and instance type.
   */
  describeInstanceTypeLimits(callback?: (err: AWSError, data: OpenSearch.Types.DescribeInstanceTypeLimitsResponse) => void): Request<OpenSearch.Types.DescribeInstanceTypeLimitsResponse, AWSError>;
  /**
   * Lists all the outbound cross-cluster connections for a local (source) Amazon OpenSearch Service domain. For more information, see Cross-cluster search for Amazon OpenSearch Service.
   */
  describeOutboundConnections(params: OpenSearch.Types.DescribeOutboundConnectionsRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeOutboundConnectionsResponse) => void): Request<OpenSearch.Types.DescribeOutboundConnectionsResponse, AWSError>;
  /**
   * Lists all the outbound cross-cluster connections for a local (source) Amazon OpenSearch Service domain. For more information, see Cross-cluster search for Amazon OpenSearch Service.
   */
  describeOutboundConnections(callback?: (err: AWSError, data: OpenSearch.Types.DescribeOutboundConnectionsResponse) => void): Request<OpenSearch.Types.DescribeOutboundConnectionsResponse, AWSError>;
  /**
   * Describes all packages available to OpenSearch Service. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  describePackages(params: OpenSearch.Types.DescribePackagesRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribePackagesResponse) => void): Request<OpenSearch.Types.DescribePackagesResponse, AWSError>;
  /**
   * Describes all packages available to OpenSearch Service. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  describePackages(callback?: (err: AWSError, data: OpenSearch.Types.DescribePackagesResponse) => void): Request<OpenSearch.Types.DescribePackagesResponse, AWSError>;
  /**
   * Describes the available Amazon OpenSearch Service Reserved Instance offerings for a given Region. For more information, see Reserved Instances in Amazon OpenSearch Service.
   */
  describeReservedInstanceOfferings(params: OpenSearch.Types.DescribeReservedInstanceOfferingsRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeReservedInstanceOfferingsResponse) => void): Request<OpenSearch.Types.DescribeReservedInstanceOfferingsResponse, AWSError>;
  /**
   * Describes the available Amazon OpenSearch Service Reserved Instance offerings for a given Region. For more information, see Reserved Instances in Amazon OpenSearch Service.
   */
  describeReservedInstanceOfferings(callback?: (err: AWSError, data: OpenSearch.Types.DescribeReservedInstanceOfferingsResponse) => void): Request<OpenSearch.Types.DescribeReservedInstanceOfferingsResponse, AWSError>;
  /**
   * Describes the Amazon OpenSearch Service instances that you have reserved in a given Region. For more information, see Reserved Instances in Amazon OpenSearch Service.
   */
  describeReservedInstances(params: OpenSearch.Types.DescribeReservedInstancesRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeReservedInstancesResponse) => void): Request<OpenSearch.Types.DescribeReservedInstancesResponse, AWSError>;
  /**
   * Describes the Amazon OpenSearch Service instances that you have reserved in a given Region. For more information, see Reserved Instances in Amazon OpenSearch Service.
   */
  describeReservedInstances(callback?: (err: AWSError, data: OpenSearch.Types.DescribeReservedInstancesResponse) => void): Request<OpenSearch.Types.DescribeReservedInstancesResponse, AWSError>;
  /**
   * Describes one or more Amazon OpenSearch Service-managed VPC endpoints.
   */
  describeVpcEndpoints(params: OpenSearch.Types.DescribeVpcEndpointsRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeVpcEndpointsResponse) => void): Request<OpenSearch.Types.DescribeVpcEndpointsResponse, AWSError>;
  /**
   * Describes one or more Amazon OpenSearch Service-managed VPC endpoints.
   */
  describeVpcEndpoints(callback?: (err: AWSError, data: OpenSearch.Types.DescribeVpcEndpointsResponse) => void): Request<OpenSearch.Types.DescribeVpcEndpointsResponse, AWSError>;
  /**
   * Removes a package from the specified Amazon OpenSearch Service domain. The package can't be in use with any OpenSearch index for the dissociation to succeed. The package is still available in OpenSearch Service for association later. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  dissociatePackage(params: OpenSearch.Types.DissociatePackageRequest, callback?: (err: AWSError, data: OpenSearch.Types.DissociatePackageResponse) => void): Request<OpenSearch.Types.DissociatePackageResponse, AWSError>;
  /**
   * Removes a package from the specified Amazon OpenSearch Service domain. The package can't be in use with any OpenSearch index for the dissociation to succeed. The package is still available in OpenSearch Service for association later. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  dissociatePackage(callback?: (err: AWSError, data: OpenSearch.Types.DissociatePackageResponse) => void): Request<OpenSearch.Types.DissociatePackageResponse, AWSError>;
  /**
   * Returns a map of OpenSearch or Elasticsearch versions and the versions you can upgrade them to.
   */
  getCompatibleVersions(params: OpenSearch.Types.GetCompatibleVersionsRequest, callback?: (err: AWSError, data: OpenSearch.Types.GetCompatibleVersionsResponse) => void): Request<OpenSearch.Types.GetCompatibleVersionsResponse, AWSError>;
  /**
   * Returns a map of OpenSearch or Elasticsearch versions and the versions you can upgrade them to.
   */
  getCompatibleVersions(callback?: (err: AWSError, data: OpenSearch.Types.GetCompatibleVersionsResponse) => void): Request<OpenSearch.Types.GetCompatibleVersionsResponse, AWSError>;
  /**
   * Returns a list of Amazon OpenSearch Service package versions, along with their creation time, commit message, and plugin properties (if the package is a zip plugin package). For more information, see Custom packages for Amazon OpenSearch Service.
   */
  getPackageVersionHistory(params: OpenSearch.Types.GetPackageVersionHistoryRequest, callback?: (err: AWSError, data: OpenSearch.Types.GetPackageVersionHistoryResponse) => void): Request<OpenSearch.Types.GetPackageVersionHistoryResponse, AWSError>;
  /**
   * Returns a list of Amazon OpenSearch Service package versions, along with their creation time, commit message, and plugin properties (if the package is a zip plugin package). For more information, see Custom packages for Amazon OpenSearch Service.
   */
  getPackageVersionHistory(callback?: (err: AWSError, data: OpenSearch.Types.GetPackageVersionHistoryResponse) => void): Request<OpenSearch.Types.GetPackageVersionHistoryResponse, AWSError>;
  /**
   * Retrieves the complete history of the last 10 upgrades performed on an Amazon OpenSearch Service domain.
   */
  getUpgradeHistory(params: OpenSearch.Types.GetUpgradeHistoryRequest, callback?: (err: AWSError, data: OpenSearch.Types.GetUpgradeHistoryResponse) => void): Request<OpenSearch.Types.GetUpgradeHistoryResponse, AWSError>;
  /**
   * Retrieves the complete history of the last 10 upgrades performed on an Amazon OpenSearch Service domain.
   */
  getUpgradeHistory(callback?: (err: AWSError, data: OpenSearch.Types.GetUpgradeHistoryResponse) => void): Request<OpenSearch.Types.GetUpgradeHistoryResponse, AWSError>;
  /**
   * Returns the most recent status of the last upgrade or upgrade eligibility check performed on an Amazon OpenSearch Service domain.
   */
  getUpgradeStatus(params: OpenSearch.Types.GetUpgradeStatusRequest, callback?: (err: AWSError, data: OpenSearch.Types.GetUpgradeStatusResponse) => void): Request<OpenSearch.Types.GetUpgradeStatusResponse, AWSError>;
  /**
   * Returns the most recent status of the last upgrade or upgrade eligibility check performed on an Amazon OpenSearch Service domain.
   */
  getUpgradeStatus(callback?: (err: AWSError, data: OpenSearch.Types.GetUpgradeStatusResponse) => void): Request<OpenSearch.Types.GetUpgradeStatusResponse, AWSError>;
  /**
   * Returns the names of all Amazon OpenSearch Service domains owned by the current user in the active Region.
   */
  listDomainNames(params: OpenSearch.Types.ListDomainNamesRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListDomainNamesResponse) => void): Request<OpenSearch.Types.ListDomainNamesResponse, AWSError>;
  /**
   * Returns the names of all Amazon OpenSearch Service domains owned by the current user in the active Region.
   */
  listDomainNames(callback?: (err: AWSError, data: OpenSearch.Types.ListDomainNamesResponse) => void): Request<OpenSearch.Types.ListDomainNamesResponse, AWSError>;
  /**
   * Lists all Amazon OpenSearch Service domains associated with a given package. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  listDomainsForPackage(params: OpenSearch.Types.ListDomainsForPackageRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListDomainsForPackageResponse) => void): Request<OpenSearch.Types.ListDomainsForPackageResponse, AWSError>;
  /**
   * Lists all Amazon OpenSearch Service domains associated with a given package. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  listDomainsForPackage(callback?: (err: AWSError, data: OpenSearch.Types.ListDomainsForPackageResponse) => void): Request<OpenSearch.Types.ListDomainsForPackageResponse, AWSError>;
  /**
   * Lists all instance types and available features for a given OpenSearch or Elasticsearch version.
   */
  listInstanceTypeDetails(params: OpenSearch.Types.ListInstanceTypeDetailsRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListInstanceTypeDetailsResponse) => void): Request<OpenSearch.Types.ListInstanceTypeDetailsResponse, AWSError>;
  /**
   * Lists all instance types and available features for a given OpenSearch or Elasticsearch version.
   */
  listInstanceTypeDetails(callback?: (err: AWSError, data: OpenSearch.Types.ListInstanceTypeDetailsResponse) => void): Request<OpenSearch.Types.ListInstanceTypeDetailsResponse, AWSError>;
  /**
   * Lists all packages associated with an Amazon OpenSearch Service domain. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  listPackagesForDomain(params: OpenSearch.Types.ListPackagesForDomainRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListPackagesForDomainResponse) => void): Request<OpenSearch.Types.ListPackagesForDomainResponse, AWSError>;
  /**
   * Lists all packages associated with an Amazon OpenSearch Service domain. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  listPackagesForDomain(callback?: (err: AWSError, data: OpenSearch.Types.ListPackagesForDomainResponse) => void): Request<OpenSearch.Types.ListPackagesForDomainResponse, AWSError>;
  /**
   * Retrieves a list of configuration changes that are scheduled for a domain. These changes can be service software updates or blue/green Auto-Tune enhancements.
   */
  listScheduledActions(params: OpenSearch.Types.ListScheduledActionsRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListScheduledActionsResponse) => void): Request<OpenSearch.Types.ListScheduledActionsResponse, AWSError>;
  /**
   * Retrieves a list of configuration changes that are scheduled for a domain. These changes can be service software updates or blue/green Auto-Tune enhancements.
   */
  listScheduledActions(callback?: (err: AWSError, data: OpenSearch.Types.ListScheduledActionsResponse) => void): Request<OpenSearch.Types.ListScheduledActionsResponse, AWSError>;
  /**
   * Returns all resource tags for an Amazon OpenSearch Service domain. For more information, see Tagging Amazon OpenSearch Service domains.
   */
  listTags(params: OpenSearch.Types.ListTagsRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListTagsResponse) => void): Request<OpenSearch.Types.ListTagsResponse, AWSError>;
  /**
   * Returns all resource tags for an Amazon OpenSearch Service domain. For more information, see Tagging Amazon OpenSearch Service domains.
   */
  listTags(callback?: (err: AWSError, data: OpenSearch.Types.ListTagsResponse) => void): Request<OpenSearch.Types.ListTagsResponse, AWSError>;
  /**
   * Lists all versions of OpenSearch and Elasticsearch that Amazon OpenSearch Service supports.
   */
  listVersions(params: OpenSearch.Types.ListVersionsRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListVersionsResponse) => void): Request<OpenSearch.Types.ListVersionsResponse, AWSError>;
  /**
   * Lists all versions of OpenSearch and Elasticsearch that Amazon OpenSearch Service supports.
   */
  listVersions(callback?: (err: AWSError, data: OpenSearch.Types.ListVersionsResponse) => void): Request<OpenSearch.Types.ListVersionsResponse, AWSError>;
  /**
   * Retrieves information about each Amazon Web Services principal that is allowed to access a given Amazon OpenSearch Service domain through the use of an interface VPC endpoint.
   */
  listVpcEndpointAccess(params: OpenSearch.Types.ListVpcEndpointAccessRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListVpcEndpointAccessResponse) => void): Request<OpenSearch.Types.ListVpcEndpointAccessResponse, AWSError>;
  /**
   * Retrieves information about each Amazon Web Services principal that is allowed to access a given Amazon OpenSearch Service domain through the use of an interface VPC endpoint.
   */
  listVpcEndpointAccess(callback?: (err: AWSError, data: OpenSearch.Types.ListVpcEndpointAccessResponse) => void): Request<OpenSearch.Types.ListVpcEndpointAccessResponse, AWSError>;
  /**
   * Retrieves all Amazon OpenSearch Service-managed VPC endpoints in the current Amazon Web Services account and Region.
   */
  listVpcEndpoints(params: OpenSearch.Types.ListVpcEndpointsRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListVpcEndpointsResponse) => void): Request<OpenSearch.Types.ListVpcEndpointsResponse, AWSError>;
  /**
   * Retrieves all Amazon OpenSearch Service-managed VPC endpoints in the current Amazon Web Services account and Region.
   */
  listVpcEndpoints(callback?: (err: AWSError, data: OpenSearch.Types.ListVpcEndpointsResponse) => void): Request<OpenSearch.Types.ListVpcEndpointsResponse, AWSError>;
  /**
   * Retrieves all Amazon OpenSearch Service-managed VPC endpoints associated with a particular domain.
   */
  listVpcEndpointsForDomain(params: OpenSearch.Types.ListVpcEndpointsForDomainRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListVpcEndpointsForDomainResponse) => void): Request<OpenSearch.Types.ListVpcEndpointsForDomainResponse, AWSError>;
  /**
   * Retrieves all Amazon OpenSearch Service-managed VPC endpoints associated with a particular domain.
   */
  listVpcEndpointsForDomain(callback?: (err: AWSError, data: OpenSearch.Types.ListVpcEndpointsForDomainResponse) => void): Request<OpenSearch.Types.ListVpcEndpointsForDomainResponse, AWSError>;
  /**
   * Allows you to purchase Amazon OpenSearch Service Reserved Instances.
   */
  purchaseReservedInstanceOffering(params: OpenSearch.Types.PurchaseReservedInstanceOfferingRequest, callback?: (err: AWSError, data: OpenSearch.Types.PurchaseReservedInstanceOfferingResponse) => void): Request<OpenSearch.Types.PurchaseReservedInstanceOfferingResponse, AWSError>;
  /**
   * Allows you to purchase Amazon OpenSearch Service Reserved Instances.
   */
  purchaseReservedInstanceOffering(callback?: (err: AWSError, data: OpenSearch.Types.PurchaseReservedInstanceOfferingResponse) => void): Request<OpenSearch.Types.PurchaseReservedInstanceOfferingResponse, AWSError>;
  /**
   * Allows the remote Amazon OpenSearch Service domain owner to reject an inbound cross-cluster connection request.
   */
  rejectInboundConnection(params: OpenSearch.Types.RejectInboundConnectionRequest, callback?: (err: AWSError, data: OpenSearch.Types.RejectInboundConnectionResponse) => void): Request<OpenSearch.Types.RejectInboundConnectionResponse, AWSError>;
  /**
   * Allows the remote Amazon OpenSearch Service domain owner to reject an inbound cross-cluster connection request.
   */
  rejectInboundConnection(callback?: (err: AWSError, data: OpenSearch.Types.RejectInboundConnectionResponse) => void): Request<OpenSearch.Types.RejectInboundConnectionResponse, AWSError>;
  /**
   * Removes the specified set of tags from an Amazon OpenSearch Service domain. For more information, see  Tagging Amazon OpenSearch Service domains.
   */
  removeTags(params: OpenSearch.Types.RemoveTagsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified set of tags from an Amazon OpenSearch Service domain. For more information, see  Tagging Amazon OpenSearch Service domains.
   */
  removeTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Revokes access to an Amazon OpenSearch Service domain that was provided through an interface VPC endpoint.
   */
  revokeVpcEndpointAccess(params: OpenSearch.Types.RevokeVpcEndpointAccessRequest, callback?: (err: AWSError, data: OpenSearch.Types.RevokeVpcEndpointAccessResponse) => void): Request<OpenSearch.Types.RevokeVpcEndpointAccessResponse, AWSError>;
  /**
   * Revokes access to an Amazon OpenSearch Service domain that was provided through an interface VPC endpoint.
   */
  revokeVpcEndpointAccess(callback?: (err: AWSError, data: OpenSearch.Types.RevokeVpcEndpointAccessResponse) => void): Request<OpenSearch.Types.RevokeVpcEndpointAccessResponse, AWSError>;
  /**
   * Schedules a service software update for an Amazon OpenSearch Service domain. For more information, see Service software updates in Amazon OpenSearch Service.
   */
  startServiceSoftwareUpdate(params: OpenSearch.Types.StartServiceSoftwareUpdateRequest, callback?: (err: AWSError, data: OpenSearch.Types.StartServiceSoftwareUpdateResponse) => void): Request<OpenSearch.Types.StartServiceSoftwareUpdateResponse, AWSError>;
  /**
   * Schedules a service software update for an Amazon OpenSearch Service domain. For more information, see Service software updates in Amazon OpenSearch Service.
   */
  startServiceSoftwareUpdate(callback?: (err: AWSError, data: OpenSearch.Types.StartServiceSoftwareUpdateResponse) => void): Request<OpenSearch.Types.StartServiceSoftwareUpdateResponse, AWSError>;
  /**
   * Modifies the cluster configuration of the specified Amazon OpenSearch Service domain.sl
   */
  updateDomainConfig(params: OpenSearch.Types.UpdateDomainConfigRequest, callback?: (err: AWSError, data: OpenSearch.Types.UpdateDomainConfigResponse) => void): Request<OpenSearch.Types.UpdateDomainConfigResponse, AWSError>;
  /**
   * Modifies the cluster configuration of the specified Amazon OpenSearch Service domain.sl
   */
  updateDomainConfig(callback?: (err: AWSError, data: OpenSearch.Types.UpdateDomainConfigResponse) => void): Request<OpenSearch.Types.UpdateDomainConfigResponse, AWSError>;
  /**
   * Updates a package for use with Amazon OpenSearch Service domains. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  updatePackage(params: OpenSearch.Types.UpdatePackageRequest, callback?: (err: AWSError, data: OpenSearch.Types.UpdatePackageResponse) => void): Request<OpenSearch.Types.UpdatePackageResponse, AWSError>;
  /**
   * Updates a package for use with Amazon OpenSearch Service domains. For more information, see Custom packages for Amazon OpenSearch Service.
   */
  updatePackage(callback?: (err: AWSError, data: OpenSearch.Types.UpdatePackageResponse) => void): Request<OpenSearch.Types.UpdatePackageResponse, AWSError>;
  /**
   * Reschedules a planned domain configuration change for a later time. This change can be a scheduled service software update or a blue/green Auto-Tune enhancement.
   */
  updateScheduledAction(params: OpenSearch.Types.UpdateScheduledActionRequest, callback?: (err: AWSError, data: OpenSearch.Types.UpdateScheduledActionResponse) => void): Request<OpenSearch.Types.UpdateScheduledActionResponse, AWSError>;
  /**
   * Reschedules a planned domain configuration change for a later time. This change can be a scheduled service software update or a blue/green Auto-Tune enhancement.
   */
  updateScheduledAction(callback?: (err: AWSError, data: OpenSearch.Types.UpdateScheduledActionResponse) => void): Request<OpenSearch.Types.UpdateScheduledActionResponse, AWSError>;
  /**
   * Modifies an Amazon OpenSearch Service-managed interface VPC endpoint.
   */
  updateVpcEndpoint(params: OpenSearch.Types.UpdateVpcEndpointRequest, callback?: (err: AWSError, data: OpenSearch.Types.UpdateVpcEndpointResponse) => void): Request<OpenSearch.Types.UpdateVpcEndpointResponse, AWSError>;
  /**
   * Modifies an Amazon OpenSearch Service-managed interface VPC endpoint.
   */
  updateVpcEndpoint(callback?: (err: AWSError, data: OpenSearch.Types.UpdateVpcEndpointResponse) => void): Request<OpenSearch.Types.UpdateVpcEndpointResponse, AWSError>;
  /**
   * Allows you to either upgrade your Amazon OpenSearch Service domain or perform an upgrade eligibility check to a compatible version of OpenSearch or Elasticsearch.
   */
  upgradeDomain(params: OpenSearch.Types.UpgradeDomainRequest, callback?: (err: AWSError, data: OpenSearch.Types.UpgradeDomainResponse) => void): Request<OpenSearch.Types.UpgradeDomainResponse, AWSError>;
  /**
   * Allows you to either upgrade your Amazon OpenSearch Service domain or perform an upgrade eligibility check to a compatible version of OpenSearch or Elasticsearch.
   */
  upgradeDomain(callback?: (err: AWSError, data: OpenSearch.Types.UpgradeDomainResponse) => void): Request<OpenSearch.Types.UpgradeDomainResponse, AWSError>;
}
declare namespace OpenSearch {
  export type ARN = string;
  export type AWSAccount = string;
  export interface AWSDomainInformation {
    /**
     * The Amazon Web Services account ID of the domain owner.
     */
    OwnerId?: OwnerId;
    /**
     * Name of the domain.
     */
    DomainName: DomainName;
    /**
     * The Amazon Web Services Region in which the domain is located.
     */
    Region?: Region;
  }
  export interface AcceptInboundConnectionRequest {
    /**
     * The ID of the inbound connection to accept.
     */
    ConnectionId: ConnectionId;
  }
  export interface AcceptInboundConnectionResponse {
    /**
     * Information about the accepted inbound connection.
     */
    Connection?: InboundConnection;
  }
  export interface AccessPoliciesStatus {
    /**
     * The access policy configured for the domain. Access policies can be resource-based, IP-based, or IAM-based. For more information, see Configuring access policies.
     */
    Options: PolicyDocument;
    /**
     * The status of the access policy for the domain.
     */
    Status: OptionStatus;
  }
  export type ActionSeverity = "HIGH"|"MEDIUM"|"LOW"|string;
  export type ActionStatus = "PENDING_UPDATE"|"IN_PROGRESS"|"FAILED"|"COMPLETED"|"NOT_ELIGIBLE"|"ELIGIBLE"|string;
  export type ActionType = "SERVICE_SOFTWARE_UPDATE"|"JVM_HEAP_SIZE_TUNING"|"JVM_YOUNG_GEN_TUNING"|string;
  export interface AddTagsRequest {
    /**
     * Amazon Resource Name (ARN) for the OpenSearch Service domain to which you want to attach resource tags.
     */
    ARN: ARN;
    /**
     * List of resource tags.
     */
    TagList: TagList;
  }
  export interface AdditionalLimit {
    /**
     *    MaximumNumberOfDataNodesSupported - This attribute only applies to master nodes and specifies the maximum number of data nodes of a given instance type a master node can support.    MaximumNumberOfDataNodesWithoutMasterNode - This attribute only applies to data nodes and specifies the maximum number of data nodes of a given instance type can exist without a master node governing them.  
     */
    LimitName?: LimitName;
    /**
     *  The values of the additional instance type limits.
     */
    LimitValues?: LimitValueList;
  }
  export type AdditionalLimitList = AdditionalLimit[];
  export type AdvancedOptions = {[key: string]: String};
  export interface AdvancedOptionsStatus {
    /**
     * The status of advanced options for the specified domain.
     */
    Options: AdvancedOptions;
    /**
     * The status of advanced options for the specified domain.
     */
    Status: OptionStatus;
  }
  export interface AdvancedSecurityOptions {
    /**
     * True if fine-grained access control is enabled.
     */
    Enabled?: Boolean;
    /**
     * True if the internal user database is enabled.
     */
    InternalUserDatabaseEnabled?: Boolean;
    /**
     * Container for information about the SAML configuration for OpenSearch Dashboards.
     */
    SAMLOptions?: SAMLOptionsOutput;
    /**
     * Date and time when the migration period will be disabled. Only necessary when enabling fine-grained access control on an existing domain.
     */
    AnonymousAuthDisableDate?: DisableTimestamp;
    /**
     * True if a 30-day migration period is enabled, during which administrators can create role mappings. Only necessary when enabling fine-grained access control on an existing domain.
     */
    AnonymousAuthEnabled?: Boolean;
  }
  export interface AdvancedSecurityOptionsInput {
    /**
     * True to enable fine-grained access control.
     */
    Enabled?: Boolean;
    /**
     * True to enable the internal user database.
     */
    InternalUserDatabaseEnabled?: Boolean;
    /**
     * Container for information about the master user.
     */
    MasterUserOptions?: MasterUserOptions;
    /**
     * Container for information about the SAML configuration for OpenSearch Dashboards.
     */
    SAMLOptions?: SAMLOptionsInput;
    /**
     * True to enable a 30-day migration period during which administrators can create role mappings. Only necessary when enabling fine-grained access control on an existing domain.
     */
    AnonymousAuthEnabled?: Boolean;
  }
  export interface AdvancedSecurityOptionsStatus {
    /**
     * Container for fine-grained access control settings.
     */
    Options: AdvancedSecurityOptions;
    /**
     * Status of the fine-grained access control settings for a domain.
     */
    Status: OptionStatus;
  }
  export interface AssociatePackageRequest {
    /**
     * Internal ID of the package to associate with a domain. Use DescribePackages to find this value. 
     */
    PackageID: PackageID;
    /**
     * Name of the domain to associate the package with.
     */
    DomainName: DomainName;
  }
  export interface AssociatePackageResponse {
    /**
     * Information about a package that is associated with a domain.
     */
    DomainPackageDetails?: DomainPackageDetails;
  }
  export interface AuthorizeVpcEndpointAccessRequest {
    /**
     * The name of the OpenSearch Service domain to provide access to.
     */
    DomainName: DomainName;
    /**
     * The Amazon Web Services account ID to grant access to.
     */
    Account: AWSAccount;
  }
  export interface AuthorizeVpcEndpointAccessResponse {
    /**
     * Information about the Amazon Web Services account or service that was provided access to the domain.
     */
    AuthorizedPrincipal: AuthorizedPrincipal;
  }
  export interface AuthorizedPrincipal {
    /**
     * The type of principal.
     */
    PrincipalType?: PrincipalType;
    /**
     * The IAM principal that is allowed access to the domain.
     */
    Principal?: String;
  }
  export type AuthorizedPrincipalList = AuthorizedPrincipal[];
  export interface AutoTune {
    /**
     * The type of Auto-Tune action.
     */
    AutoTuneType?: AutoTuneType;
    /**
     * Details about an Auto-Tune action.
     */
    AutoTuneDetails?: AutoTuneDetails;
  }
  export type AutoTuneDate = Date;
  export type AutoTuneDesiredState = "ENABLED"|"DISABLED"|string;
  export interface AutoTuneDetails {
    /**
     * Container for details about a scheduled Auto-Tune action.
     */
    ScheduledAutoTuneDetails?: ScheduledAutoTuneDetails;
  }
  export type AutoTuneList = AutoTune[];
  export interface AutoTuneMaintenanceSchedule {
    /**
     * The Epoch timestamp at which the Auto-Tune maintenance schedule starts.
     */
    StartAt?: StartAt;
    /**
     * The duration of the maintenance schedule. For example, "Duration": {"Value": 2, "Unit": "HOURS"}.
     */
    Duration?: Duration;
    /**
     * A cron expression for a recurring maintenance schedule during which Auto-Tune can deploy changes.
     */
    CronExpressionForRecurrence?: String;
  }
  export type AutoTuneMaintenanceScheduleList = AutoTuneMaintenanceSchedule[];
  export interface AutoTuneOptions {
    /**
     * Whether Auto-Tune is enabled or disabled.
     */
    DesiredState?: AutoTuneDesiredState;
    /**
     * When disabling Auto-Tune, specify NO_ROLLBACK to retain all prior Auto-Tune settings or DEFAULT_ROLLBACK to revert to the OpenSearch Service defaults. If you specify DEFAULT_ROLLBACK, you must include a MaintenanceSchedule in the request. Otherwise, OpenSearch Service is unable to perform the rollback.
     */
    RollbackOnDisable?: RollbackOnDisable;
    /**
     * DEPRECATED. Use off-peak window instead. A list of maintenance schedules during which Auto-Tune can deploy changes.
     */
    MaintenanceSchedules?: AutoTuneMaintenanceScheduleList;
    /**
     * Whether to use the domain's off-peak window to deploy configuration changes on the domain rather than a maintenance schedule.
     */
    UseOffPeakWindow?: Boolean;
  }
  export interface AutoTuneOptionsInput {
    /**
     * Whether Auto-Tune is enabled or disabled.
     */
    DesiredState?: AutoTuneDesiredState;
    /**
     * A list of maintenance schedules during which Auto-Tune can deploy changes. Maintenance windows are deprecated and have been replaced with off-peak windows.
     */
    MaintenanceSchedules?: AutoTuneMaintenanceScheduleList;
    /**
     * Whether to schedule Auto-Tune optimizations that require blue/green deployments during the domain's configured daily off-peak window.
     */
    UseOffPeakWindow?: Boolean;
  }
  export interface AutoTuneOptionsOutput {
    /**
     * The current state of Auto-Tune on the domain.
     */
    State?: AutoTuneState;
    /**
     * Any errors that occurred while enabling or disabling Auto-Tune.
     */
    ErrorMessage?: String;
    /**
     * Whether the domain's off-peak window will be used to deploy Auto-Tune changes rather than a maintenance schedule.
     */
    UseOffPeakWindow?: Boolean;
  }
  export interface AutoTuneOptionsStatus {
    /**
     * Auto-Tune settings for updating a domain.
     */
    Options?: AutoTuneOptions;
    /**
     * The current status of Auto-Tune for a domain.
     */
    Status?: AutoTuneStatus;
  }
  export type AutoTuneState = "ENABLED"|"DISABLED"|"ENABLE_IN_PROGRESS"|"DISABLE_IN_PROGRESS"|"DISABLED_AND_ROLLBACK_SCHEDULED"|"DISABLED_AND_ROLLBACK_IN_PROGRESS"|"DISABLED_AND_ROLLBACK_COMPLETE"|"DISABLED_AND_ROLLBACK_ERROR"|"ERROR"|string;
  export interface AutoTuneStatus {
    /**
     * Date and time when Auto-Tune was enabled for the domain.
     */
    CreationDate: UpdateTimestamp;
    /**
     * Date and time when the Auto-Tune options were last updated for the domain.
     */
    UpdateDate: UpdateTimestamp;
    /**
     * The latest version of the Auto-Tune options.
     */
    UpdateVersion?: UIntValue;
    /**
     * The current state of Auto-Tune on the domain.
     */
    State: AutoTuneState;
    /**
     * Any errors that occurred while enabling or disabling Auto-Tune.
     */
    ErrorMessage?: String;
    /**
     * Indicates whether the domain is being deleted.
     */
    PendingDeletion?: Boolean;
  }
  export type AutoTuneType = "SCHEDULED_ACTION"|string;
  export type AvailabilityZone = string;
  export interface AvailabilityZoneInfo {
    /**
     * The name of the Availability Zone.
     */
    AvailabilityZoneName?: AvailabilityZone;
    /**
     * The current state of the Availability Zone. Current options are Active and StandBy.    Active - Data nodes in the Availability Zone are in use.    StandBy - Data nodes in the Availability Zone are in a standby state.    NotAvailable - Unable to retrieve information.  
     */
    ZoneStatus?: ZoneStatus;
    /**
     * The total number of data nodes configured in the Availability Zone.
     */
    ConfiguredDataNodeCount?: NumberOfNodes;
    /**
     * The number of data nodes active in the Availability Zone.
     */
    AvailableDataNodeCount?: NumberOfNodes;
    /**
     * The total number of primary and replica shards in the Availability Zone.
     */
    TotalShards?: NumberOfShards;
    /**
     * The total number of primary and replica shards that aren't allocated to any of the nodes in the Availability Zone.
     */
    TotalUnAssignedShards?: NumberOfShards;
  }
  export type AvailabilityZoneInfoList = AvailabilityZoneInfo[];
  export type AvailabilityZoneList = AvailabilityZone[];
  export type BackendRole = string;
  export type Boolean = boolean;
  export interface CancelServiceSoftwareUpdateRequest {
    /**
     * Name of the OpenSearch Service domain that you want to cancel the service software update on.
     */
    DomainName: DomainName;
  }
  export interface CancelServiceSoftwareUpdateResponse {
    /**
     * Container for the state of your domain relative to the latest service software.
     */
    ServiceSoftwareOptions?: ServiceSoftwareOptions;
  }
  export interface ChangeProgressDetails {
    /**
     * The ID of the configuration change.
     */
    ChangeId?: GUID;
    /**
     * A message corresponding to the status of the configuration change.
     */
    Message?: Message;
  }
  export interface ChangeProgressStage {
    /**
     * The name of the stage.
     */
    Name?: ChangeProgressStageName;
    /**
     * The status of the stage.
     */
    Status?: ChangeProgressStageStatus;
    /**
     * The description of the stage.
     */
    Description?: Description;
    /**
     * The most recent updated timestamp of the stage.
     */
    LastUpdated?: LastUpdated;
  }
  export type ChangeProgressStageList = ChangeProgressStage[];
  export type ChangeProgressStageName = string;
  export type ChangeProgressStageStatus = string;
  export interface ChangeProgressStatusDetails {
    /**
     * The unique change identifier associated with a specific domain configuration change.
     */
    ChangeId?: GUID;
    /**
     * The time at which the configuration change is made on the domain.
     */
    StartTime?: UpdateTimestamp;
    /**
     * The overall status of the domain configuration change.
     */
    Status?: OverallChangeStatus;
    /**
     * The list of properties in the domain configuration change that are still pending.
     */
    PendingProperties?: StringList;
    /**
     * The list of properties in the domain configuration change that have completed.
     */
    CompletedProperties?: StringList;
    /**
     * The total number of stages required for the configuration change.
     */
    TotalNumberOfStages?: TotalNumberOfStages;
    /**
     * The specific stages that the domain is going through to perform the configuration change.
     */
    ChangeProgressStages?: ChangeProgressStageList;
  }
  export type ClientToken = string;
  export type CloudWatchLogsLogGroupArn = string;
  export interface ClusterConfig {
    /**
     * Instance type of data nodes in the cluster.
     */
    InstanceType?: OpenSearchPartitionInstanceType;
    /**
     * Number of dedicated master nodes in the cluster. This number must be greater than 1, otherwise you receive a validation exception.
     */
    InstanceCount?: IntegerClass;
    /**
     * Indicates whether dedicated master nodes are enabled for the cluster.True if the cluster will use a dedicated master node.False if the cluster will not.
     */
    DedicatedMasterEnabled?: Boolean;
    /**
     * Indicates whether multiple Availability Zones are enabled. For more information, see Configuring a multi-AZ domain in Amazon OpenSearch Service.
     */
    ZoneAwarenessEnabled?: Boolean;
    /**
     * Container for zone awareness configuration options. Only required if ZoneAwarenessEnabled is true.
     */
    ZoneAwarenessConfig?: ZoneAwarenessConfig;
    /**
     * OpenSearch Service instance type of the dedicated master nodes in the cluster.
     */
    DedicatedMasterType?: OpenSearchPartitionInstanceType;
    /**
     * Number of dedicated master nodes in the cluster. This number must be greater than 2 and not 4, otherwise you receive a validation exception.
     */
    DedicatedMasterCount?: IntegerClass;
    /**
     * Whether to enable warm storage for the cluster.
     */
    WarmEnabled?: Boolean;
    /**
     * The instance type for the cluster's warm nodes.
     */
    WarmType?: OpenSearchWarmPartitionInstanceType;
    /**
     * The number of warm nodes in the cluster.
     */
    WarmCount?: IntegerClass;
    /**
     * Container for cold storage configuration options.
     */
    ColdStorageOptions?: ColdStorageOptions;
    /**
     * A boolean that indicates whether a multi-AZ domain is turned on with a standby AZ. For more information, see Configuring a multi-AZ domain in Amazon OpenSearch Service. 
     */
    MultiAZWithStandbyEnabled?: Boolean;
  }
  export interface ClusterConfigStatus {
    /**
     * Cluster configuration options for the specified domain.
     */
    Options: ClusterConfig;
    /**
     * The status of cluster configuration options for the specified domain.
     */
    Status: OptionStatus;
  }
  export interface CognitoOptions {
    /**
     * Whether to enable or disable Amazon Cognito authentication for OpenSearch Dashboards.
     */
    Enabled?: Boolean;
    /**
     * The Amazon Cognito user pool ID that you want OpenSearch Service to use for OpenSearch Dashboards authentication.
     */
    UserPoolId?: UserPoolId;
    /**
     * The Amazon Cognito identity pool ID that you want OpenSearch Service to use for OpenSearch Dashboards authentication.
     */
    IdentityPoolId?: IdentityPoolId;
    /**
     * The AmazonOpenSearchServiceCognitoAccess role that allows OpenSearch Service to configure your user pool and identity pool.
     */
    RoleArn?: RoleArn;
  }
  export interface CognitoOptionsStatus {
    /**
     * Cognito options for the specified domain.
     */
    Options: CognitoOptions;
    /**
     * The status of the Cognito options for the specified domain.
     */
    Status: OptionStatus;
  }
  export interface ColdStorageOptions {
    /**
     * Whether to enable or disable cold storage on the domain.
     */
    Enabled: Boolean;
  }
  export type CommitMessage = string;
  export type CompatibleVersionsList = CompatibleVersionsMap[];
  export interface CompatibleVersionsMap {
    /**
     * The current version that the OpenSearch Service domain is running.
     */
    SourceVersion?: VersionString;
    /**
     * The possible versions that you can upgrade the domain to.
     */
    TargetVersions?: VersionList;
  }
  export type ConnectionAlias = string;
  export type ConnectionId = string;
  export type ConnectionMode = "DIRECT"|"VPC_ENDPOINT"|string;
  export interface ConnectionProperties {
    /**
     *  The Endpoint attribute cannot be modified.   The endpoint of the remote domain. Applicable for VPC_ENDPOINT connection mode.
     */
    Endpoint?: Endpoint;
    /**
     * The connection properties for cross cluster search.
     */
    CrossClusterSearch?: CrossClusterSearchConnectionProperties;
  }
  export type ConnectionStatusMessage = string;
  export interface CreateDomainRequest {
    /**
     * Name of the OpenSearch Service domain to create. Domain names are unique across the domains owned by an account within an Amazon Web Services Region.
     */
    DomainName: DomainName;
    /**
     * String of format Elasticsearch_X.Y or OpenSearch_X.Y to specify the engine version for the OpenSearch Service domain. For example, OpenSearch_1.0 or Elasticsearch_7.9. For more information, see Creating and managing Amazon OpenSearch Service domains.
     */
    EngineVersion?: VersionString;
    /**
     * Container for the cluster configuration of a domain.
     */
    ClusterConfig?: ClusterConfig;
    /**
     * Container for the parameters required to enable EBS-based storage for an OpenSearch Service domain.
     */
    EBSOptions?: EBSOptions;
    /**
     * Identity and Access Management (IAM) policy document specifying the access policies for the new domain.
     */
    AccessPolicies?: PolicyDocument;
    /**
     * DEPRECATED. Container for the parameters required to configure automated snapshots of domain indexes.
     */
    SnapshotOptions?: SnapshotOptions;
    /**
     * Container for the values required to configure VPC access domains. If you don't specify these values, OpenSearch Service creates the domain with a public endpoint. For more information, see Launching your Amazon OpenSearch Service domains using a VPC.
     */
    VPCOptions?: VPCOptions;
    /**
     * Key-value pairs to configure Amazon Cognito authentication. For more information, see Configuring Amazon Cognito authentication for OpenSearch Dashboards.
     */
    CognitoOptions?: CognitoOptions;
    /**
     * Key-value pairs to enable encryption at rest.
     */
    EncryptionAtRestOptions?: EncryptionAtRestOptions;
    /**
     * Enables node-to-node encryption.
     */
    NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptions;
    /**
     * Key-value pairs to specify advanced configuration options. The following key-value pairs are supported:    "rest.action.multi.allow_explicit_index": "true" | "false" - Note the use of a string rather than a boolean. Specifies whether explicit references to indexes are allowed inside the body of HTTP requests. If you want to configure access policies for domain sub-resources, such as specific indexes and domain APIs, you must disable this property. Default is true.    "indices.fielddata.cache.size": "80"  - Note the use of a string rather than a boolean. Specifies the percentage of heap space allocated to field data. Default is unbounded.    "indices.query.bool.max_clause_count": "1024" - Note the use of a string rather than a boolean. Specifies the maximum number of clauses allowed in a Lucene boolean query. Default is 1,024. Queries with more than the permitted number of clauses result in a TooManyClauses error.    "override_main_response_version": "true" | "false" - Note the use of a string rather than a boolean. Specifies whether the domain reports its version as 7.10 to allow Elasticsearch OSS clients and plugins to continue working with it. Default is false when creating a domain and true when upgrading a domain.   For more information, see Advanced cluster parameters.
     */
    AdvancedOptions?: AdvancedOptions;
    /**
     * Key-value pairs to configure log publishing.
     */
    LogPublishingOptions?: LogPublishingOptions;
    /**
     * Additional options for the domain endpoint, such as whether to require HTTPS for all traffic.
     */
    DomainEndpointOptions?: DomainEndpointOptions;
    /**
     * Options for fine-grained access control.
     */
    AdvancedSecurityOptions?: AdvancedSecurityOptionsInput;
    /**
     * List of tags to add to the domain upon creation.
     */
    TagList?: TagList;
    /**
     * Options for Auto-Tune.
     */
    AutoTuneOptions?: AutoTuneOptionsInput;
    /**
     * Specifies a daily 10-hour time block during which OpenSearch Service can perform configuration changes on the domain, including service software updates and Auto-Tune enhancements that require a blue/green deployment. If no options are specified, the default start time of 10:00 P.M. local time (for the Region that the domain is created in) is used.
     */
    OffPeakWindowOptions?: OffPeakWindowOptions;
    /**
     * Software update options for the domain.
     */
    SoftwareUpdateOptions?: SoftwareUpdateOptions;
  }
  export interface CreateDomainResponse {
    /**
     * The status of the newly created domain.
     */
    DomainStatus?: DomainStatus;
  }
  export interface CreateOutboundConnectionRequest {
    /**
     * Name and Region of the source (local) domain.
     */
    LocalDomainInfo: DomainInformationContainer;
    /**
     * Name and Region of the destination (remote) domain.
     */
    RemoteDomainInfo: DomainInformationContainer;
    /**
     * Name of the connection.
     */
    ConnectionAlias: ConnectionAlias;
    /**
     * The connection mode.
     */
    ConnectionMode?: ConnectionMode;
    /**
     * The ConnectionProperties for the outbound connection.
     */
    ConnectionProperties?: ConnectionProperties;
  }
  export interface CreateOutboundConnectionResponse {
    /**
     * Information about the source (local) domain.
     */
    LocalDomainInfo?: DomainInformationContainer;
    /**
     * Information about the destination (remote) domain.
     */
    RemoteDomainInfo?: DomainInformationContainer;
    /**
     * Name of the connection.
     */
    ConnectionAlias?: ConnectionAlias;
    /**
     * The status of the connection.
     */
    ConnectionStatus?: OutboundConnectionStatus;
    /**
     * The unique identifier for the created outbound connection, which is used for subsequent operations on the connection.
     */
    ConnectionId?: ConnectionId;
    /**
     * The connection mode.
     */
    ConnectionMode?: ConnectionMode;
    /**
     * The ConnectionProperties for the newly created connection.
     */
    ConnectionProperties?: ConnectionProperties;
  }
  export interface CreatePackageRequest {
    /**
     * Unique name for the package.
     */
    PackageName: PackageName;
    /**
     * The type of package.
     */
    PackageType: PackageType;
    /**
     * Description of the package.
     */
    PackageDescription?: PackageDescription;
    /**
     * The Amazon S3 location from which to import the package.
     */
    PackageSource: PackageSource;
  }
  export interface CreatePackageResponse {
    /**
     * Basic information about an OpenSearch Service package.
     */
    PackageDetails?: PackageDetails;
  }
  export interface CreateVpcEndpointRequest {
    /**
     * The Amazon Resource Name (ARN) of the domain to create the endpoint for.
     */
    DomainArn: DomainArn;
    /**
     * Options to specify the subnets and security groups for the endpoint.
     */
    VpcOptions: VPCOptions;
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    ClientToken?: ClientToken;
  }
  export interface CreateVpcEndpointResponse {
    /**
     * Information about the newly created VPC endpoint.
     */
    VpcEndpoint: VpcEndpoint;
  }
  export type CreatedAt = Date;
  export interface CrossClusterSearchConnectionProperties {
    /**
     * Status of SkipUnavailable param for outbound connection.
     */
    SkipUnavailable?: SkipUnavailableStatus;
  }
  export interface DeleteDomainRequest {
    /**
     * The name of the domain you want to permanently delete.
     */
    DomainName: DomainName;
  }
  export interface DeleteDomainResponse {
    /**
     * The status of the domain being deleted.
     */
    DomainStatus?: DomainStatus;
  }
  export interface DeleteInboundConnectionRequest {
    /**
     * The ID of the inbound connection to permanently delete.
     */
    ConnectionId: ConnectionId;
  }
  export interface DeleteInboundConnectionResponse {
    /**
     * The deleted inbound connection.
     */
    Connection?: InboundConnection;
  }
  export interface DeleteOutboundConnectionRequest {
    /**
     * The ID of the outbound connection you want to permanently delete.
     */
    ConnectionId: ConnectionId;
  }
  export interface DeleteOutboundConnectionResponse {
    /**
     * The deleted inbound connection.
     */
    Connection?: OutboundConnection;
  }
  export interface DeletePackageRequest {
    /**
     * The internal ID of the package you want to delete. Use DescribePackages to find this value.
     */
    PackageID: PackageID;
  }
  export interface DeletePackageResponse {
    /**
     *  Information about the deleted package.
     */
    PackageDetails?: PackageDetails;
  }
  export interface DeleteVpcEndpointRequest {
    /**
     * The unique identifier of the endpoint.
     */
    VpcEndpointId: VpcEndpointId;
  }
  export interface DeleteVpcEndpointResponse {
    /**
     * Information about the deleted endpoint, including its current status (DELETING or DELETE_FAILED).
     */
    VpcEndpointSummary: VpcEndpointSummary;
  }
  export type DeploymentCloseDateTimeStamp = Date;
  export type DeploymentStatus = "PENDING_UPDATE"|"IN_PROGRESS"|"COMPLETED"|"NOT_ELIGIBLE"|"ELIGIBLE"|string;
  export type DeploymentType = string;
  export interface DescribeDomainAutoTunesRequest {
    /**
     * Name of the domain that you want Auto-Tune details about.
     */
    DomainName: DomainName;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial DescribeDomainAutoTunes operation returns a nextToken, you can include the returned nextToken in subsequent DescribeDomainAutoTunes operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface DescribeDomainAutoTunesResponse {
    /**
     * The list of setting adjustments that Auto-Tune has made to the domain.
     */
    AutoTunes?: AutoTuneList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: NextToken;
  }
  export interface DescribeDomainChangeProgressRequest {
    /**
     * The name of the domain to get progress information for.
     */
    DomainName: DomainName;
    /**
     * The specific change ID for which you want to get progress information. If omitted, the request returns information about the most recent configuration change.
     */
    ChangeId?: GUID;
  }
  export interface DescribeDomainChangeProgressResponse {
    /**
     * Container for information about the stages of a configuration change happening on a domain.
     */
    ChangeProgressStatus?: ChangeProgressStatusDetails;
  }
  export interface DescribeDomainConfigRequest {
    /**
     * Name of the OpenSearch Service domain configuration that you want to describe.
     */
    DomainName: DomainName;
  }
  export interface DescribeDomainConfigResponse {
    /**
     * Container for the configuration of the OpenSearch Service domain.
     */
    DomainConfig: DomainConfig;
  }
  export interface DescribeDomainHealthRequest {
    /**
     * The name of the domain.
     */
    DomainName: DomainName;
  }
  export interface DescribeDomainHealthResponse {
    /**
     * The current state of the domain.    Processing - The domain has updates in progress.    Active - Requested changes have been processed and deployed to the domain.  
     */
    DomainState?: DomainState;
    /**
     * The number of Availability Zones configured for the domain. If the service is unable to fetch this information, it will return NotAvailable.
     */
    AvailabilityZoneCount?: NumberOfAZs;
    /**
     * The number of active Availability Zones configured for the domain. If the service is unable to fetch this information, it will return NotAvailable.
     */
    ActiveAvailabilityZoneCount?: NumberOfAZs;
    /**
     * The number of standby Availability Zones configured for the domain. If the service is unable to fetch this information, it will return NotAvailable.
     */
    StandByAvailabilityZoneCount?: NumberOfAZs;
    /**
     * The number of data nodes configured for the domain. If the service is unable to fetch this information, it will return NotAvailable.
     */
    DataNodeCount?: NumberOfNodes;
    /**
     * A boolean that indicates if dedicated master nodes are activated for the domain.
     */
    DedicatedMaster?: Boolean;
    /**
     * The number of nodes that can be elected as a master node. If dedicated master nodes is turned on, this value is the number of dedicated master nodes configured for the domain. If the service is unable to fetch this information, it will return NotAvailable.
     */
    MasterEligibleNodeCount?: NumberOfNodes;
    /**
     * The number of warm nodes configured for the domain.
     */
    WarmNodeCount?: NumberOfNodes;
    /**
     * Indicates whether the domain has an elected master node.    Available - The domain has an elected master node.    UnAvailable - The master node hasn't yet been elected, and a quorum to elect a new master node hasn't been reached.  
     */
    MasterNode?: MasterNodeStatus;
    /**
     * The current health status of your cluster.    Red - At least one primary shard is not allocated to any node.    Yellow - All primary shards are allocated to nodes, but some replicas aren’t.    Green - All primary shards and their replicas are allocated to nodes.    NotAvailable - Unable to retrieve cluster health.  
     */
    ClusterHealth?: DomainHealth;
    /**
     * The total number of primary and replica shards for the domain.
     */
    TotalShards?: NumberOfShards;
    /**
     * The total number of primary and replica shards not allocated to any of the nodes for the cluster.
     */
    TotalUnAssignedShards?: NumberOfShards;
    /**
     * A list of EnvironmentInfo for the domain. 
     */
    EnvironmentInformation?: EnvironmentInfoList;
  }
  export interface DescribeDomainNodesRequest {
    /**
     * The name of the domain.
     */
    DomainName: DomainName;
  }
  export interface DescribeDomainNodesResponse {
    /**
     * Contains nodes information list DomainNodesStatusList with details about the all nodes on the requested domain.
     */
    DomainNodesStatusList?: DomainNodesStatusList;
  }
  export interface DescribeDomainRequest {
    /**
     * The name of the domain that you want information about.
     */
    DomainName: DomainName;
  }
  export interface DescribeDomainResponse {
    /**
     * List that contains the status of each specified OpenSearch Service domain.
     */
    DomainStatus: DomainStatus;
  }
  export interface DescribeDomainsRequest {
    /**
     * Array of OpenSearch Service domain names that you want information about. If you don't specify any domains, OpenSearch Service returns information about all domains owned by the account.
     */
    DomainNames: DomainNameList;
  }
  export interface DescribeDomainsResponse {
    /**
     * The status of the requested domains.
     */
    DomainStatusList: DomainStatusList;
  }
  export interface DescribeDryRunProgressRequest {
    /**
     * The name of the domain.
     */
    DomainName: DomainName;
    /**
     * The unique identifier of the dry run.
     */
    DryRunId?: GUID;
    /**
     * Whether to include the configuration of the dry run in the response. The configuration specifies the updates that you're planning to make on the domain.
     */
    LoadDryRunConfig?: Boolean;
  }
  export interface DescribeDryRunProgressResponse {
    /**
     * The current status of the dry run, including any validation errors.
     */
    DryRunProgressStatus?: DryRunProgressStatus;
    /**
     * Details about the changes you're planning to make on the domain.
     */
    DryRunConfig?: DomainStatus;
    /**
     * The results of the dry run. 
     */
    DryRunResults?: DryRunResults;
  }
  export interface DescribeInboundConnectionsRequest {
    /**
     *  A list of filters used to match properties for inbound cross-cluster connections.
     */
    Filters?: FilterList;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial DescribeInboundConnections operation returns a nextToken, you can include the returned nextToken in subsequent DescribeInboundConnections operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface DescribeInboundConnectionsResponse {
    /**
     * List of inbound connections.
     */
    Connections?: InboundConnections;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: NextToken;
  }
  export interface DescribeInstanceTypeLimitsRequest {
    /**
     * The name of the domain. Only specify if you need the limits for an existing domain.
     */
    DomainName?: DomainName;
    /**
     * The OpenSearch Service instance type for which you need limit information.
     */
    InstanceType: OpenSearchPartitionInstanceType;
    /**
     * Version of OpenSearch or Elasticsearch, in the format Elasticsearch_X.Y or OpenSearch_X.Y. Defaults to the latest version of OpenSearch.
     */
    EngineVersion: VersionString;
  }
  export interface DescribeInstanceTypeLimitsResponse {
    /**
     * Map that contains all applicable instance type limits.data refers to data nodes.master refers to dedicated master nodes.
     */
    LimitsByRole?: LimitsByRole;
  }
  export interface DescribeOutboundConnectionsRequest {
    /**
     * List of filter names and values that you can use for requests.
     */
    Filters?: FilterList;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial DescribeOutboundConnections operation returns a nextToken, you can include the returned nextToken in subsequent DescribeOutboundConnections operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface DescribeOutboundConnectionsResponse {
    /**
     * List of outbound connections that match the filter criteria.
     */
    Connections?: OutboundConnections;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: NextToken;
  }
  export interface DescribePackagesFilter {
    /**
     * Any field from PackageDetails.
     */
    Name?: DescribePackagesFilterName;
    /**
     * A non-empty list of values for the specified filter field.
     */
    Value?: DescribePackagesFilterValues;
  }
  export type DescribePackagesFilterList = DescribePackagesFilter[];
  export type DescribePackagesFilterName = "PackageID"|"PackageName"|"PackageStatus"|string;
  export type DescribePackagesFilterValue = string;
  export type DescribePackagesFilterValues = DescribePackagesFilterValue[];
  export interface DescribePackagesRequest {
    /**
     * Only returns packages that match the DescribePackagesFilterList values.
     */
    Filters?: DescribePackagesFilterList;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial DescribePackageFilters operation returns a nextToken, you can include the returned nextToken in subsequent DescribePackageFilters operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface DescribePackagesResponse {
    /**
     * Basic information about a package.
     */
    PackageDetailsList?: PackageDetailsList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: String;
  }
  export interface DescribeReservedInstanceOfferingsRequest {
    /**
     * The Reserved Instance identifier filter value. Use this parameter to show only the available instance types that match the specified reservation identifier.
     */
    ReservedInstanceOfferingId?: GUID;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial DescribeReservedInstanceOfferings operation returns a nextToken, you can include the returned nextToken in subsequent DescribeReservedInstanceOfferings operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface DescribeReservedInstanceOfferingsResponse {
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: NextToken;
    /**
     * List of Reserved Instance offerings.
     */
    ReservedInstanceOfferings?: ReservedInstanceOfferingList;
  }
  export interface DescribeReservedInstancesRequest {
    /**
     * The reserved instance identifier filter value. Use this parameter to show only the reservation that matches the specified reserved OpenSearch instance ID.
     */
    ReservedInstanceId?: GUID;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial DescribeReservedInstances operation returns a nextToken, you can include the returned nextToken in subsequent DescribeReservedInstances operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface DescribeReservedInstancesResponse {
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: String;
    /**
     * List of Reserved Instances in the current Region.
     */
    ReservedInstances?: ReservedInstanceList;
  }
  export interface DescribeVpcEndpointsRequest {
    /**
     * The unique identifiers of the endpoints to get information about.
     */
    VpcEndpointIds: VpcEndpointIdList;
  }
  export interface DescribeVpcEndpointsResponse {
    /**
     * Information about each requested VPC endpoint.
     */
    VpcEndpoints: VpcEndpoints;
    /**
     * Any errors associated with the request.
     */
    VpcEndpointErrors: VpcEndpointErrorList;
  }
  export type Description = string;
  export type DisableTimestamp = Date;
  export interface DissociatePackageRequest {
    /**
     * Internal ID of the package to dissociate from the domain. Use ListPackagesForDomain to find this value.
     */
    PackageID: PackageID;
    /**
     * Name of the domain to dissociate the package from.
     */
    DomainName: DomainName;
  }
  export interface DissociatePackageResponse {
    /**
     *  Information about a package that has been dissociated from the domain.
     */
    DomainPackageDetails?: DomainPackageDetails;
  }
  export type DomainArn = string;
  export interface DomainConfig {
    /**
     * The OpenSearch or Elasticsearch version that the domain is running.
     */
    EngineVersion?: VersionStatus;
    /**
     * Container for the cluster configuration of a the domain.
     */
    ClusterConfig?: ClusterConfigStatus;
    /**
     * Container for EBS options configured for the domain.
     */
    EBSOptions?: EBSOptionsStatus;
    /**
     * Specifies the access policies for the domain.
     */
    AccessPolicies?: AccessPoliciesStatus;
    /**
     * DEPRECATED. Container for parameters required to configure automated snapshots of domain indexes.
     */
    SnapshotOptions?: SnapshotOptionsStatus;
    /**
     * The current VPC options for the domain and the status of any updates to their configuration.
     */
    VPCOptions?: VPCDerivedInfoStatus;
    /**
     * Container for Amazon Cognito options for the domain.
     */
    CognitoOptions?: CognitoOptionsStatus;
    /**
     * Key-value pairs to enable encryption at rest.
     */
    EncryptionAtRestOptions?: EncryptionAtRestOptionsStatus;
    /**
     * Whether node-to-node encryption is enabled or disabled.
     */
    NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptionsStatus;
    /**
     * Key-value pairs to specify advanced configuration options. For more information, see Advanced options.
     */
    AdvancedOptions?: AdvancedOptionsStatus;
    /**
     * Key-value pairs to configure log publishing.
     */
    LogPublishingOptions?: LogPublishingOptionsStatus;
    /**
     * Additional options for the domain endpoint, such as whether to require HTTPS for all traffic.
     */
    DomainEndpointOptions?: DomainEndpointOptionsStatus;
    /**
     * Container for fine-grained access control settings for the domain.
     */
    AdvancedSecurityOptions?: AdvancedSecurityOptionsStatus;
    /**
     * Container for Auto-Tune settings for the domain.
     */
    AutoTuneOptions?: AutoTuneOptionsStatus;
    /**
     * Container for information about the progress of an existing configuration change.
     */
    ChangeProgressDetails?: ChangeProgressDetails;
    /**
     * Container for off-peak window options for the domain.
     */
    OffPeakWindowOptions?: OffPeakWindowOptionsStatus;
    /**
     * Software update options for the domain.
     */
    SoftwareUpdateOptions?: SoftwareUpdateOptionsStatus;
  }
  export interface DomainEndpointOptions {
    /**
     * True to require that all traffic to the domain arrive over HTTPS.
     */
    EnforceHTTPS?: Boolean;
    /**
     * Specify the TLS security policy to apply to the HTTPS endpoint of the domain.  Can be one of the following values:    Policy-Min-TLS-1-0-2019-07: TLS security policy which supports TLS version 1.0 and higher.    Policy-Min-TLS-1-2-2019-07: TLS security policy which supports only TLS version 1.2   
     */
    TLSSecurityPolicy?: TLSSecurityPolicy;
    /**
     * Whether to enable a custom endpoint for the domain.
     */
    CustomEndpointEnabled?: Boolean;
    /**
     * The fully qualified URL for the custom endpoint.
     */
    CustomEndpoint?: DomainNameFqdn;
    /**
     * The ARN for your security certificate, managed in Amazon Web Services Certificate Manager (ACM).
     */
    CustomEndpointCertificateArn?: ARN;
  }
  export interface DomainEndpointOptionsStatus {
    /**
     * Options to configure the endpoint for a domain.
     */
    Options: DomainEndpointOptions;
    /**
     * The status of the endpoint options for a domain.
     */
    Status: OptionStatus;
  }
  export type DomainHealth = "Red"|"Yellow"|"Green"|"NotAvailable"|string;
  export type DomainId = string;
  export interface DomainInfo {
    /**
     * Name of the domain.
     */
    DomainName?: DomainName;
    /**
     * The type of search engine that the domain is running.OpenSearch for an OpenSearch engine, or Elasticsearch for a legacy Elasticsearch OSS engine.
     */
    EngineType?: EngineType;
  }
  export type DomainInfoList = DomainInfo[];
  export interface DomainInformationContainer {
    /**
     * Information about an Amazon OpenSearch Service domain.
     */
    AWSDomainInformation?: AWSDomainInformation;
  }
  export type DomainName = string;
  export type DomainNameFqdn = string;
  export type DomainNameList = DomainName[];
  export interface DomainNodesStatus {
    /**
     * The ID of the node.
     */
    NodeId?: NodeId;
    /**
     * Indicates whether the nodes is a data, master, or ultrawarm node.
     */
    NodeType?: NodeType;
    /**
     * The Availability Zone of the node.
     */
    AvailabilityZone?: AvailabilityZone;
    /**
     * The instance type information of the node.
     */
    InstanceType?: OpenSearchPartitionInstanceType;
    /**
     * Indicates if the node is active or in standby.
     */
    NodeStatus?: NodeStatus;
    /**
     * Indicates if the node has EBS or instance storage. 
     */
    StorageType?: StorageTypeName;
    /**
     * If the nodes has EBS storage, indicates if the volume type is GP2 or GP3. Only applicable for data nodes. 
     */
    StorageVolumeType?: VolumeType;
    /**
     * The storage size of the node, in GiB.
     */
    StorageSize?: VolumeSize;
  }
  export type DomainNodesStatusList = DomainNodesStatus[];
  export interface DomainPackageDetails {
    /**
     * Internal ID of the package.
     */
    PackageID?: PackageID;
    /**
     * User-specified name of the package.
     */
    PackageName?: PackageName;
    /**
     * The type of package.
     */
    PackageType?: PackageType;
    /**
     * Timestamp of the most recent update to the package association status.
     */
    LastUpdated?: LastUpdated;
    /**
     * Name of the domain that the package is associated with.
     */
    DomainName?: DomainName;
    /**
     * State of the association.
     */
    DomainPackageStatus?: DomainPackageStatus;
    /**
     * The current version of the package.
     */
    PackageVersion?: PackageVersion;
    /**
     * The relative path of the package on the OpenSearch Service cluster nodes. This is synonym_path when the package is for synonym files.
     */
    ReferencePath?: ReferencePath;
    /**
     * Additional information if the package is in an error state. Null otherwise.
     */
    ErrorDetails?: ErrorDetails;
  }
  export type DomainPackageDetailsList = DomainPackageDetails[];
  export type DomainPackageStatus = "ASSOCIATING"|"ASSOCIATION_FAILED"|"ACTIVE"|"DISSOCIATING"|"DISSOCIATION_FAILED"|string;
  export type DomainState = "Active"|"Processing"|"NotAvailable"|string;
  export interface DomainStatus {
    /**
     * Unique identifier for the domain.
     */
    DomainId: DomainId;
    /**
     * Name of the domain. Domain names are unique across all domains owned by the same account within an Amazon Web Services Region.
     */
    DomainName: DomainName;
    /**
     * The Amazon Resource Name (ARN) of the domain. For more information, see IAM identifiers  in the AWS Identity and Access Management User Guide.
     */
    ARN: ARN;
    /**
     * Creation status of an OpenSearch Service domain. True if domain creation is complete. False if domain creation is still in progress.
     */
    Created?: Boolean;
    /**
     * Deletion status of an OpenSearch Service domain. True if domain deletion is complete. False if domain deletion is still in progress. Once deletion is complete, the status of the domain is no longer returned.
     */
    Deleted?: Boolean;
    /**
     * Domain-specific endpoint used to submit index, search, and data upload requests to the domain.
     */
    Endpoint?: ServiceUrl;
    /**
     * The key-value pair that exists if the OpenSearch Service domain uses VPC endpoints.. Example key, value: 'vpc','vpc-endpoint-h2dsd34efgyghrtguk5gt6j2foh4.us-east-1.es.amazonaws.com'.
     */
    Endpoints?: EndpointsMap;
    /**
     * The status of the domain configuration. True if OpenSearch Service is processing configuration changes. False if the configuration is active.
     */
    Processing?: Boolean;
    /**
     * The status of a domain version upgrade to a new version of OpenSearch or Elasticsearch. True if OpenSearch Service is in the process of a version upgrade. False if the configuration is active.
     */
    UpgradeProcessing?: Boolean;
    /**
     * Version of OpenSearch or Elasticsearch that the domain is running, in the format Elasticsearch_X.Y or OpenSearch_X.Y.
     */
    EngineVersion?: VersionString;
    /**
     * Container for the cluster configuration of the domain.
     */
    ClusterConfig: ClusterConfig;
    /**
     * Container for EBS-based storage settings for the domain.
     */
    EBSOptions?: EBSOptions;
    /**
     * Identity and Access Management (IAM) policy document specifying the access policies for the domain.
     */
    AccessPolicies?: PolicyDocument;
    /**
     * DEPRECATED. Container for parameters required to configure automated snapshots of domain indexes.
     */
    SnapshotOptions?: SnapshotOptions;
    /**
     * The VPC configuration for the domain.
     */
    VPCOptions?: VPCDerivedInfo;
    /**
     * Key-value pairs to configure Amazon Cognito authentication for OpenSearch Dashboards.
     */
    CognitoOptions?: CognitoOptions;
    /**
     * Encryption at rest settings for the domain.
     */
    EncryptionAtRestOptions?: EncryptionAtRestOptions;
    /**
     * Whether node-to-node encryption is enabled or disabled.
     */
    NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptions;
    /**
     * Key-value pairs that specify advanced configuration options.
     */
    AdvancedOptions?: AdvancedOptions;
    /**
     * Log publishing options for the domain.
     */
    LogPublishingOptions?: LogPublishingOptions;
    /**
     * The current status of the domain's service software.
     */
    ServiceSoftwareOptions?: ServiceSoftwareOptions;
    /**
     * Additional options for the domain endpoint, such as whether to require HTTPS for all traffic.
     */
    DomainEndpointOptions?: DomainEndpointOptions;
    /**
     * Settings for fine-grained access control.
     */
    AdvancedSecurityOptions?: AdvancedSecurityOptions;
    /**
     * Auto-Tune settings for the domain.
     */
    AutoTuneOptions?: AutoTuneOptionsOutput;
    /**
     * Information about a configuration change happening on the domain.
     */
    ChangeProgressDetails?: ChangeProgressDetails;
    /**
     * Options that specify a custom 10-hour window during which OpenSearch Service can perform configuration changes on the domain.
     */
    OffPeakWindowOptions?: OffPeakWindowOptions;
    /**
     * Service software update options for the domain.
     */
    SoftwareUpdateOptions?: SoftwareUpdateOptions;
  }
  export type DomainStatusList = DomainStatus[];
  export type Double = number;
  export type DryRun = boolean;
  export type DryRunMode = "Basic"|"Verbose"|string;
  export interface DryRunProgressStatus {
    /**
     * The unique identifier of the dry run.
     */
    DryRunId: GUID;
    /**
     * The current status of the dry run.
     */
    DryRunStatus: String;
    /**
     * The timestamp when the dry run was initiated.
     */
    CreationDate: String;
    /**
     * The timestamp when the dry run was last updated.
     */
    UpdateDate: String;
    /**
     * Any validation failures that occurred as a result of the dry run.
     */
    ValidationFailures?: ValidationFailures;
  }
  export interface DryRunResults {
    /**
     *  Specifies the way in which OpenSearch Service will apply an update. Possible values are:    Blue/Green - The update requires a blue/green deployment.    DynamicUpdate - No blue/green deployment required    Undetermined - The domain is in the middle of an update and can't predict the deployment type. Try again after the update is complete.    None - The request doesn't include any configuration changes.  
     */
    DeploymentType?: DeploymentType;
    /**
     * A message corresponding to the deployment type.
     */
    Message?: Message;
  }
  export interface Duration {
    /**
     * Integer to specify the value of a maintenance schedule duration.
     */
    Value?: DurationValue;
    /**
     * The unit of measurement for the duration of a maintenance schedule.
     */
    Unit?: TimeUnit;
  }
  export type DurationValue = number;
  export interface EBSOptions {
    /**
     * Indicates whether EBS volumes are attached to data nodes in an OpenSearch Service domain.
     */
    EBSEnabled?: Boolean;
    /**
     * Specifies the type of EBS volumes attached to data nodes.
     */
    VolumeType?: VolumeType;
    /**
     * Specifies the size (in GiB) of EBS volumes attached to data nodes.
     */
    VolumeSize?: IntegerClass;
    /**
     * Specifies the baseline input/output (I/O) performance of EBS volumes attached to data nodes. Applicable only for the gp3 and provisioned IOPS EBS volume types.
     */
    Iops?: IntegerClass;
    /**
     * Specifies the throughput (in MiB/s) of the EBS volumes attached to data nodes. Applicable only for the gp3 volume type.
     */
    Throughput?: IntegerClass;
  }
  export interface EBSOptionsStatus {
    /**
     * The configured EBS options for the specified domain.
     */
    Options: EBSOptions;
    /**
     * The status of the EBS options for the specified domain.
     */
    Status: OptionStatus;
  }
  export interface EncryptionAtRestOptions {
    /**
     * True to enable encryption at rest.
     */
    Enabled?: Boolean;
    /**
     * The KMS key ID. Takes the form 1a2a3a4-1a2a-3a4a-5a6a-1a2a3a4a5a6a.
     */
    KmsKeyId?: KmsKeyId;
  }
  export interface EncryptionAtRestOptionsStatus {
    /**
     * Encryption at rest options for the specified domain.
     */
    Options: EncryptionAtRestOptions;
    /**
     * The status of the encryption at rest options for the specified domain.
     */
    Status: OptionStatus;
  }
  export type Endpoint = string;
  export type EndpointsMap = {[key: string]: ServiceUrl};
  export type EngineType = "OpenSearch"|"Elasticsearch"|string;
  export interface EnvironmentInfo {
    /**
     *  A list of AvailabilityZoneInfo for the domain.
     */
    AvailabilityZoneInformation?: AvailabilityZoneInfoList;
  }
  export type EnvironmentInfoList = EnvironmentInfo[];
  export interface ErrorDetails {
    /**
     * The type of error that occurred.
     */
    ErrorType?: ErrorType;
    /**
     * A message describing the error.
     */
    ErrorMessage?: ErrorMessage;
  }
  export type ErrorMessage = string;
  export type ErrorType = string;
  export interface Filter {
    /**
     * The name of the filter.
     */
    Name?: NonEmptyString;
    /**
     * One or more values for the filter.
     */
    Values?: ValueStringList;
  }
  export type FilterList = Filter[];
  export type GUID = string;
  export interface GetCompatibleVersionsRequest {
    /**
     * The name of an existing domain. Provide this parameter to limit the results to a single domain.
     */
    DomainName?: DomainName;
  }
  export interface GetCompatibleVersionsResponse {
    /**
     * A map of OpenSearch or Elasticsearch versions and the versions you can upgrade them to.
     */
    CompatibleVersions?: CompatibleVersionsList;
  }
  export interface GetPackageVersionHistoryRequest {
    /**
     * The unique identifier of the package.
     */
    PackageID: PackageID;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial GetPackageVersionHistory operation returns a nextToken, you can include the returned nextToken in subsequent GetPackageVersionHistory operations, which returns results in the next page. 
     */
    NextToken?: NextToken;
  }
  export interface GetPackageVersionHistoryResponse {
    /**
     * The unique identifier of the package.
     */
    PackageID?: PackageID;
    /**
     * A list of package versions, along with their creation time and commit message.
     */
    PackageVersionHistoryList?: PackageVersionHistoryList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: String;
  }
  export interface GetUpgradeHistoryRequest {
    /**
     * The name of an existing domain.
     */
    DomainName: DomainName;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial GetUpgradeHistory operation returns a nextToken, you can include the returned nextToken in subsequent GetUpgradeHistory operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface GetUpgradeHistoryResponse {
    /**
     * A list of objects corresponding to each upgrade or upgrade eligibility check performed on a domain.
     */
    UpgradeHistories?: UpgradeHistoryList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: String;
  }
  export interface GetUpgradeStatusRequest {
    /**
     * The domain of the domain to get upgrade status information for.
     */
    DomainName: DomainName;
  }
  export interface GetUpgradeStatusResponse {
    /**
     * One of three steps that an upgrade or upgrade eligibility check goes through.
     */
    UpgradeStep?: UpgradeStep;
    /**
     * The status of the current step that an upgrade is on.
     */
    StepStatus?: UpgradeStatus;
    /**
     * A string that describes the update.
     */
    UpgradeName?: UpgradeName;
  }
  export type IdentityPoolId = string;
  export interface InboundConnection {
    /**
     * Information about the source (local) domain.
     */
    LocalDomainInfo?: DomainInformationContainer;
    /**
     * Information about the destination (remote) domain.
     */
    RemoteDomainInfo?: DomainInformationContainer;
    /**
     * The unique identifier of the connection.
     */
    ConnectionId?: ConnectionId;
    /**
     * The current status of the connection.
     */
    ConnectionStatus?: InboundConnectionStatus;
    /**
     * The connection mode.
     */
    ConnectionMode?: ConnectionMode;
  }
  export interface InboundConnectionStatus {
    /**
     * The status code for the connection. Can be one of the following:    PENDING_ACCEPTANCE - Inbound connection is not yet accepted by the remote domain owner.    APPROVED: Inbound connection is pending acceptance by the remote domain owner.    PROVISIONING: Inbound connection is being provisioned.    ACTIVE: Inbound connection is active and ready to use.    REJECTING: Inbound connection rejection is in process.    REJECTED: Inbound connection is rejected.    DELETING: Inbound connection deletion is in progress.    DELETED: Inbound connection is deleted and can no longer be used.  
     */
    StatusCode?: InboundConnectionStatusCode;
    /**
     * Information about the connection.
     */
    Message?: ConnectionStatusMessage;
  }
  export type InboundConnectionStatusCode = "PENDING_ACCEPTANCE"|"APPROVED"|"PROVISIONING"|"ACTIVE"|"REJECTING"|"REJECTED"|"DELETING"|"DELETED"|string;
  export type InboundConnections = InboundConnection[];
  export type InstanceCount = number;
  export interface InstanceCountLimits {
    /**
     * The maximum allowed number of instances.
     */
    MinimumInstanceCount?: MinimumInstanceCount;
    /**
     * The minimum allowed number of instances.
     */
    MaximumInstanceCount?: MaximumInstanceCount;
  }
  export interface InstanceLimits {
    /**
     * Limits on the number of instances that can be created for a given instance type.
     */
    InstanceCountLimits?: InstanceCountLimits;
  }
  export type InstanceRole = string;
  export type InstanceRoleList = InstanceRole[];
  export interface InstanceTypeDetails {
    /**
     * The instance type.
     */
    InstanceType?: OpenSearchPartitionInstanceType;
    /**
     * Whether encryption at rest and node-to-node encryption are supported for the instance type.
     */
    EncryptionEnabled?: Boolean;
    /**
     * Whether Amazon Cognito access is supported for the instance type.
     */
    CognitoEnabled?: Boolean;
    /**
     * Whether logging is supported for the instance type.
     */
    AppLogsEnabled?: Boolean;
    /**
     * Whether fine-grained access control is supported for the instance type.
     */
    AdvancedSecurityEnabled?: Boolean;
    /**
     * Whether UltraWarm is supported for the instance type.
     */
    WarmEnabled?: Boolean;
    /**
     * Whether the instance acts as a data node, a dedicated master node, or an UltraWarm node.
     */
    InstanceRole?: InstanceRoleList;
    /**
     * The supported Availability Zones for the instance type.
     */
    AvailabilityZones?: AvailabilityZoneList;
  }
  export type InstanceTypeDetailsList = InstanceTypeDetails[];
  export type InstanceTypeString = string;
  export type Integer = number;
  export type IntegerClass = number;
  export type Issue = string;
  export type Issues = Issue[];
  export type KmsKeyId = string;
  export type LastUpdated = Date;
  export type LimitName = string;
  export type LimitValue = string;
  export type LimitValueList = LimitValue[];
  export interface Limits {
    /**
     * Storage-related attributes that are available for a given instance type.
     */
    StorageTypes?: StorageTypeList;
    /**
     * The limits for a given instance type.
     */
    InstanceLimits?: InstanceLimits;
    /**
     * List of additional limits that are specific to a given instance type for each of its instance roles.
     */
    AdditionalLimits?: AdditionalLimitList;
  }
  export type LimitsByRole = {[key: string]: Limits};
  export interface ListDomainNamesRequest {
    /**
     * Filters the output by domain engine type.
     */
    EngineType?: EngineType;
  }
  export interface ListDomainNamesResponse {
    /**
     * The names of all OpenSearch Service domains owned by the current user and their respective engine types.
     */
    DomainNames?: DomainInfoList;
  }
  export interface ListDomainsForPackageRequest {
    /**
     * The unique identifier of the package for which to list associated domains.
     */
    PackageID: PackageID;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial ListDomainsForPackage operation returns a nextToken, you can include the returned nextToken in subsequent ListDomainsForPackage operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListDomainsForPackageResponse {
    /**
     * Information about all domains associated with a package.
     */
    DomainPackageDetailsList?: DomainPackageDetailsList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: String;
  }
  export interface ListInstanceTypeDetailsRequest {
    /**
     * The version of OpenSearch or Elasticsearch, in the format Elasticsearch_X.Y or OpenSearch_X.Y. Defaults to the latest version of OpenSearch.
     */
    EngineVersion: VersionString;
    /**
     * The name of the domain.
     */
    DomainName?: DomainName;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial ListInstanceTypeDetails operation returns a nextToken, you can include the returned nextToken in subsequent ListInstanceTypeDetails operations, which returns results in the next page.
     */
    NextToken?: NextToken;
    /**
     * An optional parameter that specifies the Availability Zones for the domain.
     */
    RetrieveAZs?: Boolean;
    /**
     * An optional parameter that lists information for a given instance type.
     */
    InstanceType?: InstanceTypeString;
  }
  export interface ListInstanceTypeDetailsResponse {
    /**
     * Lists all supported instance types and features for the given OpenSearch or Elasticsearch version.
     */
    InstanceTypeDetails?: InstanceTypeDetailsList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListPackagesForDomainRequest {
    /**
     * The name of the domain for which you want to list associated packages.
     */
    DomainName: DomainName;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial ListPackagesForDomain operation returns a nextToken, you can include the returned nextToken in subsequent ListPackagesForDomain operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListPackagesForDomainResponse {
    /**
     * List of all packages associated with a domain.
     */
    DomainPackageDetailsList?: DomainPackageDetailsList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: String;
  }
  export interface ListScheduledActionsRequest {
    /**
     * The name of the domain.
     */
    DomainName: DomainName;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial ListScheduledActions operation returns a nextToken, you can include the returned nextToken in subsequent ListScheduledActions operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListScheduledActionsResponse {
    /**
     * A list of actions that are scheduled for the domain.
     */
    ScheduledActions?: ScheduledActionsList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsRequest {
    /**
     * Amazon Resource Name (ARN) for the domain to view tags for.
     */
    ARN: ARN;
  }
  export interface ListTagsResponse {
    /**
     * List of resource tags associated with the specified domain.
     */
    TagList?: TagList;
  }
  export interface ListVersionsRequest {
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial ListVersions operation returns a nextToken, you can include the returned nextToken in subsequent ListVersions operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListVersionsResponse {
    /**
     * A list of all versions of OpenSearch and Elasticsearch that Amazon OpenSearch Service supports.
     */
    Versions?: VersionList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListVpcEndpointAccessRequest {
    /**
     * The name of the OpenSearch Service domain to retrieve access information for.
     */
    DomainName: DomainName;
    /**
     * If your initial ListVpcEndpointAccess operation returns a nextToken, you can include the returned nextToken in subsequent ListVpcEndpointAccess operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListVpcEndpointAccessResponse {
    /**
     * A list of IAM principals that can currently access the domain.
     */
    AuthorizedPrincipalList: AuthorizedPrincipalList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken: NextToken;
  }
  export interface ListVpcEndpointsForDomainRequest {
    /**
     * The name of the domain to list associated VPC endpoints for.
     */
    DomainName: DomainName;
    /**
     * If your initial ListEndpointsForDomain operation returns a nextToken, you can include the returned nextToken in subsequent ListEndpointsForDomain operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListVpcEndpointsForDomainResponse {
    /**
     * Information about each endpoint associated with the domain.
     */
    VpcEndpointSummaryList: VpcEndpointSummaryList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken: NextToken;
  }
  export interface ListVpcEndpointsRequest {
    /**
     * If your initial ListVpcEndpoints operation returns a nextToken, you can include the returned nextToken in subsequent ListVpcEndpoints operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListVpcEndpointsResponse {
    /**
     * Information about each endpoint.
     */
    VpcEndpointSummaryList: VpcEndpointSummaryList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken: NextToken;
  }
  export interface LogPublishingOption {
    /**
     * The Amazon Resource Name (ARN) of the CloudWatch Logs group to publish logs to.
     */
    CloudWatchLogsLogGroupArn?: CloudWatchLogsLogGroupArn;
    /**
     * Whether the log should be published.
     */
    Enabled?: Boolean;
  }
  export type LogPublishingOptions = {[key: string]: LogPublishingOption};
  export interface LogPublishingOptionsStatus {
    /**
     * The log publishing options configured for the domain.
     */
    Options?: LogPublishingOptions;
    /**
     * The status of the log publishing options for the domain.
     */
    Status?: OptionStatus;
  }
  export type LogType = "INDEX_SLOW_LOGS"|"SEARCH_SLOW_LOGS"|"ES_APPLICATION_LOGS"|"AUDIT_LOGS"|string;
  export type Long = number;
  export type MasterNodeStatus = "Available"|"UnAvailable"|string;
  export interface MasterUserOptions {
    /**
     * Amazon Resource Name (ARN) for the master user. Only specify if InternalUserDatabaseEnabled is false.
     */
    MasterUserARN?: ARN;
    /**
     * User name for the master user. Only specify if InternalUserDatabaseEnabled is true.
     */
    MasterUserName?: Username;
    /**
     * Password for the master user. Only specify if InternalUserDatabaseEnabled is true.
     */
    MasterUserPassword?: Password;
  }
  export type MaxResults = number;
  export type MaximumInstanceCount = number;
  export type Message = string;
  export type MinimumInstanceCount = number;
  export type NextToken = string;
  export type NodeId = string;
  export type NodeStatus = "Active"|"StandBy"|"NotAvailable"|string;
  export interface NodeToNodeEncryptionOptions {
    /**
     * True to enable node-to-node encryption.
     */
    Enabled?: Boolean;
  }
  export interface NodeToNodeEncryptionOptionsStatus {
    /**
     * The node-to-node encryption options for the specified domain.
     */
    Options: NodeToNodeEncryptionOptions;
    /**
     * The status of the node-to-node encryption options for the specified domain.
     */
    Status: OptionStatus;
  }
  export type NodeType = "Data"|"Ultrawarm"|"Master"|string;
  export type NonEmptyString = string;
  export type NumberOfAZs = string;
  export type NumberOfNodes = string;
  export type NumberOfShards = string;
  export interface OffPeakWindow {
    /**
     * A custom start time for the off-peak window, in Coordinated Universal Time (UTC). The window length will always be 10 hours, so you can't specify an end time. For example, if you specify 11:00 P.M. UTC as a start time, the end time will automatically be set to 9:00 A.M.
     */
    WindowStartTime?: WindowStartTime;
  }
  export interface OffPeakWindowOptions {
    /**
     * Whether to enable an off-peak window. This option is only available when modifying a domain created prior to February 16, 2023, not when creating a new domain. All domains created after this date have the off-peak window enabled by default. You can't disable the off-peak window after it's enabled for a domain.
     */
    Enabled?: Boolean;
    /**
     * Off-peak window settings for the domain.
     */
    OffPeakWindow?: OffPeakWindow;
  }
  export interface OffPeakWindowOptionsStatus {
    /**
     * The domain's off-peak window configuration.
     */
    Options?: OffPeakWindowOptions;
    /**
     * The current status of off-peak window options.
     */
    Status?: OptionStatus;
  }
  export type OpenSearchPartitionInstanceType = "m3.medium.search"|"m3.large.search"|"m3.xlarge.search"|"m3.2xlarge.search"|"m4.large.search"|"m4.xlarge.search"|"m4.2xlarge.search"|"m4.4xlarge.search"|"m4.10xlarge.search"|"m5.large.search"|"m5.xlarge.search"|"m5.2xlarge.search"|"m5.4xlarge.search"|"m5.12xlarge.search"|"m5.24xlarge.search"|"r5.large.search"|"r5.xlarge.search"|"r5.2xlarge.search"|"r5.4xlarge.search"|"r5.12xlarge.search"|"r5.24xlarge.search"|"c5.large.search"|"c5.xlarge.search"|"c5.2xlarge.search"|"c5.4xlarge.search"|"c5.9xlarge.search"|"c5.18xlarge.search"|"t3.nano.search"|"t3.micro.search"|"t3.small.search"|"t3.medium.search"|"t3.large.search"|"t3.xlarge.search"|"t3.2xlarge.search"|"ultrawarm1.medium.search"|"ultrawarm1.large.search"|"ultrawarm1.xlarge.search"|"t2.micro.search"|"t2.small.search"|"t2.medium.search"|"r3.large.search"|"r3.xlarge.search"|"r3.2xlarge.search"|"r3.4xlarge.search"|"r3.8xlarge.search"|"i2.xlarge.search"|"i2.2xlarge.search"|"d2.xlarge.search"|"d2.2xlarge.search"|"d2.4xlarge.search"|"d2.8xlarge.search"|"c4.large.search"|"c4.xlarge.search"|"c4.2xlarge.search"|"c4.4xlarge.search"|"c4.8xlarge.search"|"r4.large.search"|"r4.xlarge.search"|"r4.2xlarge.search"|"r4.4xlarge.search"|"r4.8xlarge.search"|"r4.16xlarge.search"|"i3.large.search"|"i3.xlarge.search"|"i3.2xlarge.search"|"i3.4xlarge.search"|"i3.8xlarge.search"|"i3.16xlarge.search"|"r6g.large.search"|"r6g.xlarge.search"|"r6g.2xlarge.search"|"r6g.4xlarge.search"|"r6g.8xlarge.search"|"r6g.12xlarge.search"|"m6g.large.search"|"m6g.xlarge.search"|"m6g.2xlarge.search"|"m6g.4xlarge.search"|"m6g.8xlarge.search"|"m6g.12xlarge.search"|"c6g.large.search"|"c6g.xlarge.search"|"c6g.2xlarge.search"|"c6g.4xlarge.search"|"c6g.8xlarge.search"|"c6g.12xlarge.search"|"r6gd.large.search"|"r6gd.xlarge.search"|"r6gd.2xlarge.search"|"r6gd.4xlarge.search"|"r6gd.8xlarge.search"|"r6gd.12xlarge.search"|"r6gd.16xlarge.search"|"t4g.small.search"|"t4g.medium.search"|string;
  export type OpenSearchWarmPartitionInstanceType = "ultrawarm1.medium.search"|"ultrawarm1.large.search"|"ultrawarm1.xlarge.search"|string;
  export type OptionState = "RequiresIndexDocuments"|"Processing"|"Active"|string;
  export interface OptionStatus {
    /**
     * The timestamp when the entity was created.
     */
    CreationDate: UpdateTimestamp;
    /**
     * The timestamp of the last time the entity was updated.
     */
    UpdateDate: UpdateTimestamp;
    /**
     * The latest version of the entity.
     */
    UpdateVersion?: UIntValue;
    /**
     * The state of the entity.
     */
    State: OptionState;
    /**
     * Indicates whether the entity is being deleted.
     */
    PendingDeletion?: Boolean;
  }
  export interface OutboundConnection {
    /**
     * Information about the source (local) domain.
     */
    LocalDomainInfo?: DomainInformationContainer;
    /**
     * Information about the destination (remote) domain.
     */
    RemoteDomainInfo?: DomainInformationContainer;
    /**
     * Unique identifier of the connection.
     */
    ConnectionId?: ConnectionId;
    /**
     * Name of the connection.
     */
    ConnectionAlias?: ConnectionAlias;
    /**
     * Status of the connection.
     */
    ConnectionStatus?: OutboundConnectionStatus;
    /**
     * The connection mode.
     */
    ConnectionMode?: ConnectionMode;
    /**
     * Properties for the outbound connection.
     */
    ConnectionProperties?: ConnectionProperties;
  }
  export interface OutboundConnectionStatus {
    /**
     * The status code for the outbound connection. Can be one of the following:    VALIDATING - The outbound connection request is being validated.    VALIDATION_FAILED - Validation failed for the connection request.    PENDING_ACCEPTANCE: Outbound connection request is validated and is not yet accepted by the remote domain owner.    APPROVED - Outbound connection has been approved by the remote domain owner for getting provisioned.    PROVISIONING - Outbound connection request is in process.    ACTIVE - Outbound connection is active and ready to use.    REJECTING - Outbound connection rejection by remote domain owner is in progress.    REJECTED - Outbound connection request is rejected by remote domain owner.    DELETING - Outbound connection deletion is in progress.    DELETED - Outbound connection is deleted and can no longer be used.  
     */
    StatusCode?: OutboundConnectionStatusCode;
    /**
     * Verbose information for the outbound connection.
     */
    Message?: ConnectionStatusMessage;
  }
  export type OutboundConnectionStatusCode = "VALIDATING"|"VALIDATION_FAILED"|"PENDING_ACCEPTANCE"|"APPROVED"|"PROVISIONING"|"ACTIVE"|"REJECTING"|"REJECTED"|"DELETING"|"DELETED"|string;
  export type OutboundConnections = OutboundConnection[];
  export type OverallChangeStatus = "PENDING"|"PROCESSING"|"COMPLETED"|"FAILED"|string;
  export type OwnerId = string;
  export type PackageDescription = string;
  export interface PackageDetails {
    /**
     * The unique identifier of the package.
     */
    PackageID?: PackageID;
    /**
     * The user-specified name of the package.
     */
    PackageName?: PackageName;
    /**
     * The type of package.
     */
    PackageType?: PackageType;
    /**
     * User-specified description of the package.
     */
    PackageDescription?: PackageDescription;
    /**
     * The current status of the package. The available options are AVAILABLE, COPYING, COPY_FAILED, VALIDATNG, VALIDATION_FAILED, DELETING, and DELETE_FAILED.
     */
    PackageStatus?: PackageStatus;
    /**
     * The timestamp when the package was created.
     */
    CreatedAt?: CreatedAt;
    /**
     * Date and time when the package was last updated.
     */
    LastUpdatedAt?: LastUpdated;
    /**
     * The package version.
     */
    AvailablePackageVersion?: PackageVersion;
    /**
     * Additional information if the package is in an error state. Null otherwise.
     */
    ErrorDetails?: ErrorDetails;
  }
  export type PackageDetailsList = PackageDetails[];
  export type PackageID = string;
  export type PackageName = string;
  export interface PackageSource {
    /**
     * The name of the Amazon S3 bucket containing the package.
     */
    S3BucketName?: S3BucketName;
    /**
     * Key (file name) of the package.
     */
    S3Key?: S3Key;
  }
  export type PackageStatus = "COPYING"|"COPY_FAILED"|"VALIDATING"|"VALIDATION_FAILED"|"AVAILABLE"|"DELETING"|"DELETED"|"DELETE_FAILED"|string;
  export type PackageType = "TXT-DICTIONARY"|string;
  export type PackageVersion = string;
  export interface PackageVersionHistory {
    /**
     * The package version.
     */
    PackageVersion?: PackageVersion;
    /**
     * A message associated with the package version when it was uploaded.
     */
    CommitMessage?: CommitMessage;
    /**
     * The date and time when the package was created.
     */
    CreatedAt?: CreatedAt;
  }
  export type PackageVersionHistoryList = PackageVersionHistory[];
  export type Password = string;
  export type PolicyDocument = string;
  export type PrincipalType = "AWS_ACCOUNT"|"AWS_SERVICE"|string;
  export interface PurchaseReservedInstanceOfferingRequest {
    /**
     * The ID of the Reserved Instance offering to purchase.
     */
    ReservedInstanceOfferingId: GUID;
    /**
     * A customer-specified identifier to track this reservation.
     */
    ReservationName: ReservationToken;
    /**
     * The number of OpenSearch instances to reserve.
     */
    InstanceCount?: InstanceCount;
  }
  export interface PurchaseReservedInstanceOfferingResponse {
    /**
     * The ID of the Reserved Instance offering that was purchased.
     */
    ReservedInstanceId?: GUID;
    /**
     * The customer-specified identifier used to track this reservation.
     */
    ReservationName?: ReservationToken;
  }
  export interface RecurringCharge {
    /**
     * The monetary amount of the recurring charge.
     */
    RecurringChargeAmount?: Double;
    /**
     * The frequency of the recurring charge.
     */
    RecurringChargeFrequency?: String;
  }
  export type RecurringChargeList = RecurringCharge[];
  export type ReferencePath = string;
  export type Region = string;
  export interface RejectInboundConnectionRequest {
    /**
     * The unique identifier of the inbound connection to reject.
     */
    ConnectionId: ConnectionId;
  }
  export interface RejectInboundConnectionResponse {
    /**
     * Contains details about the rejected inbound connection.
     */
    Connection?: InboundConnection;
  }
  export interface RemoveTagsRequest {
    /**
     * The Amazon Resource Name (ARN) of the domain from which you want to delete the specified tags.
     */
    ARN: ARN;
    /**
     * The list of tag keys to remove from the domain.
     */
    TagKeys: StringList;
  }
  export type ReservationToken = string;
  export interface ReservedInstance {
    /**
     * The customer-specified identifier to track this reservation.
     */
    ReservationName?: ReservationToken;
    /**
     * The unique identifier for the reservation.
     */
    ReservedInstanceId?: GUID;
    /**
     * The unique identifier of the billing subscription.
     */
    BillingSubscriptionId?: Long;
    /**
     * The unique identifier of the Reserved Instance offering.
     */
    ReservedInstanceOfferingId?: String;
    /**
     * The OpenSearch instance type offered by theReserved Instance offering.
     */
    InstanceType?: OpenSearchPartitionInstanceType;
    /**
     * The date and time when the reservation was purchased.
     */
    StartTime?: UpdateTimestamp;
    /**
     * The duration, in seconds, for which the OpenSearch instance is reserved.
     */
    Duration?: Integer;
    /**
     * The upfront fixed charge you will paid to purchase the specific Reserved Instance offering.
     */
    FixedPrice?: Double;
    /**
     * The hourly rate at which you're charged for the domain using this Reserved Instance.
     */
    UsagePrice?: Double;
    /**
     * The currency code for the offering.
     */
    CurrencyCode?: String;
    /**
     * The number of OpenSearch instances that have been reserved.
     */
    InstanceCount?: Integer;
    /**
     * The state of the Reserved Instance.
     */
    State?: String;
    /**
     * The payment option as defined in the Reserved Instance offering.
     */
    PaymentOption?: ReservedInstancePaymentOption;
    /**
     * The recurring charge to your account, regardless of whether you create any domains using the Reserved Instance offering.
     */
    RecurringCharges?: RecurringChargeList;
  }
  export type ReservedInstanceList = ReservedInstance[];
  export interface ReservedInstanceOffering {
    /**
     * The unique identifier of the Reserved Instance offering.
     */
    ReservedInstanceOfferingId?: GUID;
    /**
     * The OpenSearch instance type offered by the Reserved Instance offering.
     */
    InstanceType?: OpenSearchPartitionInstanceType;
    /**
     * The duration, in seconds, for which the offering will reserve the OpenSearch instance.
     */
    Duration?: Integer;
    /**
     * The upfront fixed charge you will pay to purchase the specific Reserved Instance offering.
     */
    FixedPrice?: Double;
    /**
     * The hourly rate at which you're charged for the domain using this Reserved Instance.
     */
    UsagePrice?: Double;
    /**
     * The currency code for the Reserved Instance offering.
     */
    CurrencyCode?: String;
    /**
     * Payment option for the Reserved Instance offering
     */
    PaymentOption?: ReservedInstancePaymentOption;
    /**
     * The recurring charge to your account, regardless of whether you creates any domains using the offering.
     */
    RecurringCharges?: RecurringChargeList;
  }
  export type ReservedInstanceOfferingList = ReservedInstanceOffering[];
  export type ReservedInstancePaymentOption = "ALL_UPFRONT"|"PARTIAL_UPFRONT"|"NO_UPFRONT"|string;
  export interface RevokeVpcEndpointAccessRequest {
    /**
     * The name of the OpenSearch Service domain.
     */
    DomainName: DomainName;
    /**
     * The account ID to revoke access from.
     */
    Account: AWSAccount;
  }
  export interface RevokeVpcEndpointAccessResponse {
  }
  export type RoleArn = string;
  export type RollbackOnDisable = "NO_ROLLBACK"|"DEFAULT_ROLLBACK"|string;
  export type S3BucketName = string;
  export type S3Key = string;
  export type SAMLEntityId = string;
  export interface SAMLIdp {
    /**
     * The metadata of the SAML application, in XML format.
     */
    MetadataContent: SAMLMetadata;
    /**
     * The unique entity ID of the application in the SAML identity provider.
     */
    EntityId: SAMLEntityId;
  }
  export type SAMLMetadata = string;
  export interface SAMLOptionsInput {
    /**
     * True to enable SAML authentication for a domain.
     */
    Enabled?: Boolean;
    /**
     * The SAML Identity Provider's information.
     */
    Idp?: SAMLIdp;
    /**
     * The SAML master user name, which is stored in the domain's internal user database.
     */
    MasterUserName?: Username;
    /**
     * The backend role that the SAML master user is mapped to.
     */
    MasterBackendRole?: BackendRole;
    /**
     * Element of the SAML assertion to use for the user name. Default is NameID.
     */
    SubjectKey?: String;
    /**
     * Element of the SAML assertion to use for backend roles. Default is roles.
     */
    RolesKey?: String;
    /**
     * The duration, in minutes, after which a user session becomes inactive. Acceptable values are between 1 and 1440, and the default value is 60.
     */
    SessionTimeoutMinutes?: IntegerClass;
  }
  export interface SAMLOptionsOutput {
    /**
     * True if SAML is enabled.
     */
    Enabled?: Boolean;
    /**
     * Describes the SAML identity provider's information.
     */
    Idp?: SAMLIdp;
    /**
     * The key used for matching the SAML subject attribute.
     */
    SubjectKey?: String;
    /**
     * The key used for matching the SAML roles attribute.
     */
    RolesKey?: String;
    /**
     * The duration, in minutes, after which a user session becomes inactive.
     */
    SessionTimeoutMinutes?: IntegerClass;
  }
  export type ScheduleAt = "NOW"|"TIMESTAMP"|"OFF_PEAK_WINDOW"|string;
  export interface ScheduledAction {
    /**
     * The unique identifier of the scheduled action.
     */
    Id: String;
    /**
     * The type of action that will be taken on the domain.
     */
    Type: ActionType;
    /**
     * The severity of the action.
     */
    Severity: ActionSeverity;
    /**
     * The time when the change is scheduled to happen.
     */
    ScheduledTime: Long;
    /**
     * A description of the action to be taken.
     */
    Description?: String;
    /**
     * Whether the action was scheduled manually (CUSTOMER, or by OpenSearch Service automatically (SYSTEM).
     */
    ScheduledBy?: ScheduledBy;
    /**
     * The current status of the scheduled action.
     */
    Status?: ActionStatus;
    /**
     * Whether the action is required or optional.
     */
    Mandatory?: Boolean;
    /**
     * Whether or not the scheduled action is cancellable.
     */
    Cancellable?: Boolean;
  }
  export type ScheduledActionsList = ScheduledAction[];
  export type ScheduledAutoTuneActionType = "JVM_HEAP_SIZE_TUNING"|"JVM_YOUNG_GEN_TUNING"|string;
  export type ScheduledAutoTuneDescription = string;
  export interface ScheduledAutoTuneDetails {
    /**
     * The date and time when the Auto-Tune action is scheduled for the domain.
     */
    Date?: AutoTuneDate;
    /**
     * The type of Auto-Tune action.
     */
    ActionType?: ScheduledAutoTuneActionType;
    /**
     * A description of the Auto-Tune action.
     */
    Action?: ScheduledAutoTuneDescription;
    /**
     * The severity of the Auto-Tune action. Valid values are LOW, MEDIUM, and HIGH.
     */
    Severity?: ScheduledAutoTuneSeverityType;
  }
  export type ScheduledAutoTuneSeverityType = "LOW"|"MEDIUM"|"HIGH"|string;
  export type ScheduledBy = "CUSTOMER"|"SYSTEM"|string;
  export interface ServiceSoftwareOptions {
    /**
     * The current service software version present on the domain.
     */
    CurrentVersion?: String;
    /**
     * The new service software version, if one is available.
     */
    NewVersion?: String;
    /**
     * True if you're able to update your service software version. False if you can't update your service software version.
     */
    UpdateAvailable?: Boolean;
    /**
     *  True if you're able to cancel your service software version update. False if you can't cancel your service software update.
     */
    Cancellable?: Boolean;
    /**
     * The status of your service software update.
     */
    UpdateStatus?: DeploymentStatus;
    /**
     * A description of the service software update status.
     */
    Description?: String;
    /**
     * The timestamp, in Epoch time, until which you can manually request a service software update. After this date, we automatically update your service software.
     */
    AutomatedUpdateDate?: DeploymentCloseDateTimeStamp;
    /**
     * True if a service software is never automatically updated. False if a service software is automatically updated after the automated update date.
     */
    OptionalDeployment?: Boolean;
  }
  export type ServiceUrl = string;
  export type SkipUnavailableStatus = "ENABLED"|"DISABLED"|string;
  export interface SnapshotOptions {
    /**
     * The time, in UTC format, when OpenSearch Service takes a daily automated snapshot of the specified domain. Default is 0 hours.
     */
    AutomatedSnapshotStartHour?: IntegerClass;
  }
  export interface SnapshotOptionsStatus {
    /**
     * The daily snapshot options specified for the domain.
     */
    Options: SnapshotOptions;
    /**
     * The status of a daily automated snapshot.
     */
    Status: OptionStatus;
  }
  export interface SoftwareUpdateOptions {
    /**
     * Whether automatic service software updates are enabled for the domain.
     */
    AutoSoftwareUpdateEnabled?: Boolean;
  }
  export interface SoftwareUpdateOptionsStatus {
    /**
     * The service software update options for a domain.
     */
    Options?: SoftwareUpdateOptions;
    /**
     * The status of service software update options, including creation date and last updated date.
     */
    Status?: OptionStatus;
  }
  export type StartAt = Date;
  export interface StartServiceSoftwareUpdateRequest {
    /**
     * The name of the domain that you want to update to the latest service software.
     */
    DomainName: DomainName;
    /**
     * When to start the service software update.    NOW - Immediately schedules the update to happen in the current hour if there's capacity available.    TIMESTAMP - Lets you specify a custom date and time to apply the update. If you specify this value, you must also provide a value for DesiredStartTime.    OFF_PEAK_WINDOW - Marks the update to be picked up during an upcoming off-peak window. There's no guarantee that the update will happen during the next immediate window. Depending on capacity, it might happen in subsequent days.   Default: NOW if you don't specify a value for DesiredStartTime, and TIMESTAMP if you do.
     */
    ScheduleAt?: ScheduleAt;
    /**
     * The Epoch timestamp when you want the service software update to start. You only need to specify this parameter if you set ScheduleAt to TIMESTAMP.
     */
    DesiredStartTime?: Long;
  }
  export interface StartServiceSoftwareUpdateResponse {
    /**
     * The current status of the OpenSearch Service software update.
     */
    ServiceSoftwareOptions?: ServiceSoftwareOptions;
  }
  export type StartTimeHours = number;
  export type StartTimeMinutes = number;
  export type StartTimestamp = Date;
  export type StorageSubTypeName = string;
  export interface StorageType {
    /**
     * The name of the storage type.
     */
    StorageTypeName?: StorageTypeName;
    /**
     * The storage sub-type, such as gp3 or io1.
     */
    StorageSubTypeName?: StorageSubTypeName;
    /**
     * Limits that are applicable for the given storage type.
     */
    StorageTypeLimits?: StorageTypeLimitList;
  }
  export interface StorageTypeLimit {
    /**
     *  Name of storage limits that are applicable for the given storage type. If StorageType is ebs, the following options are available:    MinimumVolumeSize - Minimum volume size that is available for the given storage type. Can be empty if not applicable.    MaximumVolumeSize - Maximum volume size that is available for the given storage type. Can be empty if not applicable.    MaximumIops - Maximum amount of IOPS that is available for the given the storage type. Can be empty if not applicable.    MinimumIops - Minimum amount of IOPS that is available for the given the storage type. Can be empty if not applicable.    MaximumThroughput - Maximum amount of throughput that is available for the given the storage type. Can be empty if not applicable.    MinimumThroughput - Minimum amount of throughput that is available for the given the storage type. Can be empty if not applicable.  
     */
    LimitName?: LimitName;
    /**
     * The limit values.
     */
    LimitValues?: LimitValueList;
  }
  export type StorageTypeLimitList = StorageTypeLimit[];
  export type StorageTypeList = StorageType[];
  export type StorageTypeName = string;
  export type String = string;
  export type StringList = String[];
  export type TLSSecurityPolicy = "Policy-Min-TLS-1-0-2019-07"|"Policy-Min-TLS-1-2-2019-07"|string;
  export interface Tag {
    /**
     * The tag key. Tag keys must be unique for the domain to which they are attached.
     */
    Key: TagKey;
    /**
     * The value assigned to the corresponding tag key. Tag values can be null and don't have to be unique in a tag set. For example, you can have a key value pair in a tag set of project : Trinity and cost-center : Trinity 
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagList = Tag[];
  export type TagValue = string;
  export type TimeUnit = "HOURS"|string;
  export type TotalNumberOfStages = number;
  export type UIntValue = number;
  export interface UpdateDomainConfigRequest {
    /**
     * The name of the domain that you're updating.
     */
    DomainName: DomainName;
    /**
     * Changes that you want to make to the cluster configuration, such as the instance type and number of EC2 instances.
     */
    ClusterConfig?: ClusterConfig;
    /**
     * The type and size of the EBS volume to attach to instances in the domain.
     */
    EBSOptions?: EBSOptions;
    /**
     * Option to set the time, in UTC format, for the daily automated snapshot. Default value is 0 hours. 
     */
    SnapshotOptions?: SnapshotOptions;
    /**
     * Options to specify the subnets and security groups for a VPC endpoint. For more information, see Launching your Amazon OpenSearch Service domains using a VPC.
     */
    VPCOptions?: VPCOptions;
    /**
     * Key-value pairs to configure Amazon Cognito authentication for OpenSearch Dashboards.
     */
    CognitoOptions?: CognitoOptions;
    /**
     * Key-value pairs to specify advanced configuration options. The following key-value pairs are supported:    "rest.action.multi.allow_explicit_index": "true" | "false" - Note the use of a string rather than a boolean. Specifies whether explicit references to indexes are allowed inside the body of HTTP requests. If you want to configure access policies for domain sub-resources, such as specific indexes and domain APIs, you must disable this property. Default is true.    "indices.fielddata.cache.size": "80"  - Note the use of a string rather than a boolean. Specifies the percentage of heap space allocated to field data. Default is unbounded.    "indices.query.bool.max_clause_count": "1024" - Note the use of a string rather than a boolean. Specifies the maximum number of clauses allowed in a Lucene boolean query. Default is 1,024. Queries with more than the permitted number of clauses result in a TooManyClauses error.   For more information, see Advanced cluster parameters.
     */
    AdvancedOptions?: AdvancedOptions;
    /**
     * Identity and Access Management (IAM) access policy as a JSON-formatted string.
     */
    AccessPolicies?: PolicyDocument;
    /**
     * Options to publish OpenSearch logs to Amazon CloudWatch Logs.
     */
    LogPublishingOptions?: LogPublishingOptions;
    /**
     * Encryption at rest options for the domain.
     */
    EncryptionAtRestOptions?: EncryptionAtRestOptions;
    /**
     * Additional options for the domain endpoint, such as whether to require HTTPS for all traffic.
     */
    DomainEndpointOptions?: DomainEndpointOptions;
    /**
     * Node-to-node encryption options for the domain.
     */
    NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptions;
    /**
     * Options for fine-grained access control.
     */
    AdvancedSecurityOptions?: AdvancedSecurityOptionsInput;
    /**
     * Options for Auto-Tune.
     */
    AutoTuneOptions?: AutoTuneOptions;
    /**
     * This flag, when set to True, specifies whether the UpdateDomain request should return the results of a dry run analysis without actually applying the change. A dry run determines what type of deployment the update will cause.
     */
    DryRun?: DryRun;
    /**
     * The type of dry run to perform.    Basic only returns the type of deployment (blue/green or dynamic) that the update will cause.    Verbose runs an additional check to validate the changes you're making. For more information, see Validating a domain update.  
     */
    DryRunMode?: DryRunMode;
    /**
     * Off-peak window options for the domain.
     */
    OffPeakWindowOptions?: OffPeakWindowOptions;
    /**
     * Service software update options for the domain.
     */
    SoftwareUpdateOptions?: SoftwareUpdateOptions;
  }
  export interface UpdateDomainConfigResponse {
    /**
     * The status of the updated domain.
     */
    DomainConfig: DomainConfig;
    /**
     * Results of the dry run performed in the update domain request.
     */
    DryRunResults?: DryRunResults;
    /**
     * The status of the dry run being performed on the domain, if any.
     */
    DryRunProgressStatus?: DryRunProgressStatus;
  }
  export interface UpdatePackageRequest {
    /**
     * The unique identifier for the package.
     */
    PackageID: PackageID;
    /**
     * Amazon S3 bucket and key for the package.
     */
    PackageSource: PackageSource;
    /**
     * A new description of the package.
     */
    PackageDescription?: PackageDescription;
    /**
     * Commit message for the updated file, which is shown as part of GetPackageVersionHistoryResponse.
     */
    CommitMessage?: CommitMessage;
  }
  export interface UpdatePackageResponse {
    /**
     * Information about a package.
     */
    PackageDetails?: PackageDetails;
  }
  export interface UpdateScheduledActionRequest {
    /**
     * The name of the domain to reschedule an action for.
     */
    DomainName: DomainName;
    /**
     * The unique identifier of the action to reschedule. To retrieve this ID, send a ListScheduledActions request.
     */
    ActionID: String;
    /**
     * The type of action to reschedule. Can be one of SERVICE_SOFTWARE_UPDATE, JVM_HEAP_SIZE_TUNING, or JVM_YOUNG_GEN_TUNING. To retrieve this value, send a ListScheduledActions request.
     */
    ActionType: ActionType;
    /**
     * When to schedule the action.    NOW - Immediately schedules the update to happen in the current hour if there's capacity available.    TIMESTAMP - Lets you specify a custom date and time to apply the update. If you specify this value, you must also provide a value for DesiredStartTime.    OFF_PEAK_WINDOW - Marks the action to be picked up during an upcoming off-peak window. There's no guarantee that the change will be implemented during the next immediate window. Depending on capacity, it might happen in subsequent days.  
     */
    ScheduleAt: ScheduleAt;
    /**
     * The time to implement the change, in Coordinated Universal Time (UTC). Only specify this parameter if you set ScheduleAt to TIMESTAMP.
     */
    DesiredStartTime?: Long;
  }
  export interface UpdateScheduledActionResponse {
    /**
     * Information about the rescheduled action.
     */
    ScheduledAction?: ScheduledAction;
  }
  export type UpdateTimestamp = Date;
  export interface UpdateVpcEndpointRequest {
    /**
     * The unique identifier of the endpoint.
     */
    VpcEndpointId: VpcEndpointId;
    /**
     * The security groups and/or subnets to add, remove, or modify.
     */
    VpcOptions: VPCOptions;
  }
  export interface UpdateVpcEndpointResponse {
    /**
     * The endpoint to be updated.
     */
    VpcEndpoint: VpcEndpoint;
  }
  export interface UpgradeDomainRequest {
    /**
     * Name of the OpenSearch Service domain that you want to upgrade.
     */
    DomainName: DomainName;
    /**
     * OpenSearch or Elasticsearch version to which you want to upgrade, in the format Opensearch_X.Y or Elasticsearch_X.Y.
     */
    TargetVersion: VersionString;
    /**
     * When true, indicates that an upgrade eligibility check needs to be performed. Does not actually perform the upgrade.
     */
    PerformCheckOnly?: Boolean;
    /**
     * Only supports the override_main_response_version parameter and not other advanced options. You can only include this option when upgrading to an OpenSearch version. Specifies whether the domain reports its version as 7.10 so that it continues to work with Elasticsearch OSS clients and plugins.
     */
    AdvancedOptions?: AdvancedOptions;
  }
  export interface UpgradeDomainResponse {
    /**
     * The unique identifier of the domain upgrade.
     */
    UpgradeId?: String;
    /**
     * The name of the domain that was upgraded.
     */
    DomainName?: DomainName;
    /**
     * OpenSearch or Elasticsearch version that the domain was upgraded to.
     */
    TargetVersion?: VersionString;
    /**
     * When true, indicates that an upgrade eligibility check was performed.
     */
    PerformCheckOnly?: Boolean;
    /**
     * The advanced options configuration for the domain.
     */
    AdvancedOptions?: AdvancedOptions;
    /**
     * Container for information about a configuration change happening on a domain.
     */
    ChangeProgressDetails?: ChangeProgressDetails;
  }
  export interface UpgradeHistory {
    /**
     * A string that describes the upgrade.
     */
    UpgradeName?: UpgradeName;
    /**
     * UTC timestamp at which the upgrade API call was made, in the format yyyy-MM-ddTHH:mm:ssZ.
     */
    StartTimestamp?: StartTimestamp;
    /**
     *  The current status of the upgrade. The status can take one of the following values:    In Progress   Succeeded   Succeeded with Issues   Failed  
     */
    UpgradeStatus?: UpgradeStatus;
    /**
     * A list of each step performed as part of a specific upgrade or upgrade eligibility check.
     */
    StepsList?: UpgradeStepsList;
  }
  export type UpgradeHistoryList = UpgradeHistory[];
  export type UpgradeName = string;
  export type UpgradeStatus = "IN_PROGRESS"|"SUCCEEDED"|"SUCCEEDED_WITH_ISSUES"|"FAILED"|string;
  export type UpgradeStep = "PRE_UPGRADE_CHECK"|"SNAPSHOT"|"UPGRADE"|string;
  export interface UpgradeStepItem {
    /**
     *  One of three steps that an upgrade or upgrade eligibility check goes through:    PreUpgradeCheck   Snapshot   Upgrade  
     */
    UpgradeStep?: UpgradeStep;
    /**
     *  The current status of the upgrade. The status can take one of the following values:    In Progress   Succeeded   Succeeded with Issues   Failed  
     */
    UpgradeStepStatus?: UpgradeStatus;
    /**
     * A list of strings containing detailed information about the errors encountered in a particular step.
     */
    Issues?: Issues;
    /**
     * The floating point value representing the progress percentage of a particular step.
     */
    ProgressPercent?: Double;
  }
  export type UpgradeStepsList = UpgradeStepItem[];
  export type UserPoolId = string;
  export type Username = string;
  export interface VPCDerivedInfo {
    /**
     * The ID for your VPC. Amazon VPC generates this value when you create a VPC.
     */
    VPCId?: String;
    /**
     * A list of subnet IDs associated with the VPC endpoints for the domain.
     */
    SubnetIds?: StringList;
    /**
     * The list of Availability Zones associated with the VPC subnets.
     */
    AvailabilityZones?: StringList;
    /**
     * The list of security group IDs associated with the VPC endpoints for the domain.
     */
    SecurityGroupIds?: StringList;
  }
  export interface VPCDerivedInfoStatus {
    /**
     * The VPC options for the specified domain.
     */
    Options: VPCDerivedInfo;
    /**
     * The status of the VPC options for the specified domain.
     */
    Status: OptionStatus;
  }
  export interface VPCOptions {
    /**
     * A list of subnet IDs associated with the VPC endpoints for the domain. If your domain uses multiple Availability Zones, you need to provide two subnet IDs, one per zone. Otherwise, provide only one.
     */
    SubnetIds?: StringList;
    /**
     * The list of security group IDs associated with the VPC endpoints for the domain. If you do not provide a security group ID, OpenSearch Service uses the default security group for the VPC.
     */
    SecurityGroupIds?: StringList;
  }
  export interface ValidationFailure {
    /**
     * The error code of the failure.
     */
    Code?: String;
    /**
     * A message corresponding to the failure.
     */
    Message?: String;
  }
  export type ValidationFailures = ValidationFailure[];
  export type ValueStringList = NonEmptyString[];
  export type VersionList = VersionString[];
  export interface VersionStatus {
    /**
     * The OpenSearch or Elasticsearch version for the specified domain.
     */
    Options: VersionString;
    /**
     * The status of the version options for the specified domain.
     */
    Status: OptionStatus;
  }
  export type VersionString = string;
  export type VolumeSize = string;
  export type VolumeType = "standard"|"gp2"|"io1"|"gp3"|string;
  export interface VpcEndpoint {
    /**
     * The unique identifier of the endpoint.
     */
    VpcEndpointId?: VpcEndpointId;
    /**
     * The creator of the endpoint.
     */
    VpcEndpointOwner?: AWSAccount;
    /**
     * The Amazon Resource Name (ARN) of the domain associated with the endpoint.
     */
    DomainArn?: DomainArn;
    /**
     * Options to specify the subnets and security groups for an Amazon OpenSearch Service VPC endpoint.
     */
    VpcOptions?: VPCDerivedInfo;
    /**
     * The current status of the endpoint.
     */
    Status?: VpcEndpointStatus;
    /**
     * The connection endpoint ID for connecting to the domain.
     */
    Endpoint?: Endpoint;
  }
  export interface VpcEndpointError {
    /**
     * The unique identifier of the endpoint.
     */
    VpcEndpointId?: VpcEndpointId;
    /**
     * The code associated with the error.
     */
    ErrorCode?: VpcEndpointErrorCode;
    /**
     * A message describing the error.
     */
    ErrorMessage?: String;
  }
  export type VpcEndpointErrorCode = "ENDPOINT_NOT_FOUND"|"SERVER_ERROR"|string;
  export type VpcEndpointErrorList = VpcEndpointError[];
  export type VpcEndpointId = string;
  export type VpcEndpointIdList = VpcEndpointId[];
  export type VpcEndpointStatus = "CREATING"|"CREATE_FAILED"|"ACTIVE"|"UPDATING"|"UPDATE_FAILED"|"DELETING"|"DELETE_FAILED"|string;
  export interface VpcEndpointSummary {
    /**
     * The unique identifier of the endpoint.
     */
    VpcEndpointId?: VpcEndpointId;
    /**
     * The creator of the endpoint.
     */
    VpcEndpointOwner?: String;
    /**
     * The Amazon Resource Name (ARN) of the domain associated with the endpoint.
     */
    DomainArn?: DomainArn;
    /**
     * The current status of the endpoint.
     */
    Status?: VpcEndpointStatus;
  }
  export type VpcEndpointSummaryList = VpcEndpointSummary[];
  export type VpcEndpoints = VpcEndpoint[];
  export interface WindowStartTime {
    /**
     * The start hour of the window in Coordinated Universal Time (UTC), using 24-hour time. For example, 17 refers to 5:00 P.M. UTC.
     */
    Hours: StartTimeHours;
    /**
     * The start minute of the window, in UTC.
     */
    Minutes: StartTimeMinutes;
  }
  export interface ZoneAwarenessConfig {
    /**
     * If you enabled multiple Availability Zones, this value is the number of zones that you want the domain to use. Valid values are 2 and 3. If your domain is provisioned within a VPC, this value be equal to number of subnets.
     */
    AvailabilityZoneCount?: IntegerClass;
  }
  export type ZoneStatus = "Active"|"StandBy"|"NotAvailable"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-01-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the OpenSearch client.
   */
  export import Types = OpenSearch;
}
export = OpenSearch;
