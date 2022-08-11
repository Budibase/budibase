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
   * Allows the remote domain owner to accept an inbound cross-cluster connection request.
   */
  acceptInboundConnection(params: OpenSearch.Types.AcceptInboundConnectionRequest, callback?: (err: AWSError, data: OpenSearch.Types.AcceptInboundConnectionResponse) => void): Request<OpenSearch.Types.AcceptInboundConnectionResponse, AWSError>;
  /**
   * Allows the remote domain owner to accept an inbound cross-cluster connection request.
   */
  acceptInboundConnection(callback?: (err: AWSError, data: OpenSearch.Types.AcceptInboundConnectionResponse) => void): Request<OpenSearch.Types.AcceptInboundConnectionResponse, AWSError>;
  /**
   * Attaches tags to an existing domain. Tags are a set of case-sensitive key value pairs. An domain can have up to 10 tags. See  Tagging Amazon OpenSearch Service domains for more information. 
   */
  addTags(params: OpenSearch.Types.AddTagsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches tags to an existing domain. Tags are a set of case-sensitive key value pairs. An domain can have up to 10 tags. See  Tagging Amazon OpenSearch Service domains for more information. 
   */
  addTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates a package with an Amazon OpenSearch Service domain.
   */
  associatePackage(params: OpenSearch.Types.AssociatePackageRequest, callback?: (err: AWSError, data: OpenSearch.Types.AssociatePackageResponse) => void): Request<OpenSearch.Types.AssociatePackageResponse, AWSError>;
  /**
   * Associates a package with an Amazon OpenSearch Service domain.
   */
  associatePackage(callback?: (err: AWSError, data: OpenSearch.Types.AssociatePackageResponse) => void): Request<OpenSearch.Types.AssociatePackageResponse, AWSError>;
  /**
   * Cancels a scheduled service software update for an Amazon OpenSearch Service domain. You can only perform this operation before the AutomatedUpdateDate and when the UpdateStatus is in the PENDING_UPDATE state. 
   */
  cancelServiceSoftwareUpdate(params: OpenSearch.Types.CancelServiceSoftwareUpdateRequest, callback?: (err: AWSError, data: OpenSearch.Types.CancelServiceSoftwareUpdateResponse) => void): Request<OpenSearch.Types.CancelServiceSoftwareUpdateResponse, AWSError>;
  /**
   * Cancels a scheduled service software update for an Amazon OpenSearch Service domain. You can only perform this operation before the AutomatedUpdateDate and when the UpdateStatus is in the PENDING_UPDATE state. 
   */
  cancelServiceSoftwareUpdate(callback?: (err: AWSError, data: OpenSearch.Types.CancelServiceSoftwareUpdateResponse) => void): Request<OpenSearch.Types.CancelServiceSoftwareUpdateResponse, AWSError>;
  /**
   * Creates a new Amazon OpenSearch Service domain. For more information, see Creating and managing Amazon OpenSearch Service domains  in the Amazon OpenSearch Service Developer Guide. 
   */
  createDomain(params: OpenSearch.Types.CreateDomainRequest, callback?: (err: AWSError, data: OpenSearch.Types.CreateDomainResponse) => void): Request<OpenSearch.Types.CreateDomainResponse, AWSError>;
  /**
   * Creates a new Amazon OpenSearch Service domain. For more information, see Creating and managing Amazon OpenSearch Service domains  in the Amazon OpenSearch Service Developer Guide. 
   */
  createDomain(callback?: (err: AWSError, data: OpenSearch.Types.CreateDomainResponse) => void): Request<OpenSearch.Types.CreateDomainResponse, AWSError>;
  /**
   * Creates a new cross-cluster connection from a local OpenSearch domain to a remote OpenSearch domain.
   */
  createOutboundConnection(params: OpenSearch.Types.CreateOutboundConnectionRequest, callback?: (err: AWSError, data: OpenSearch.Types.CreateOutboundConnectionResponse) => void): Request<OpenSearch.Types.CreateOutboundConnectionResponse, AWSError>;
  /**
   * Creates a new cross-cluster connection from a local OpenSearch domain to a remote OpenSearch domain.
   */
  createOutboundConnection(callback?: (err: AWSError, data: OpenSearch.Types.CreateOutboundConnectionResponse) => void): Request<OpenSearch.Types.CreateOutboundConnectionResponse, AWSError>;
  /**
   * Create a package for use with Amazon OpenSearch Service domains.
   */
  createPackage(params: OpenSearch.Types.CreatePackageRequest, callback?: (err: AWSError, data: OpenSearch.Types.CreatePackageResponse) => void): Request<OpenSearch.Types.CreatePackageResponse, AWSError>;
  /**
   * Create a package for use with Amazon OpenSearch Service domains.
   */
  createPackage(callback?: (err: AWSError, data: OpenSearch.Types.CreatePackageResponse) => void): Request<OpenSearch.Types.CreatePackageResponse, AWSError>;
  /**
   * Permanently deletes the specified domain and all of its data. Once a domain is deleted, it cannot be recovered. 
   */
  deleteDomain(params: OpenSearch.Types.DeleteDomainRequest, callback?: (err: AWSError, data: OpenSearch.Types.DeleteDomainResponse) => void): Request<OpenSearch.Types.DeleteDomainResponse, AWSError>;
  /**
   * Permanently deletes the specified domain and all of its data. Once a domain is deleted, it cannot be recovered. 
   */
  deleteDomain(callback?: (err: AWSError, data: OpenSearch.Types.DeleteDomainResponse) => void): Request<OpenSearch.Types.DeleteDomainResponse, AWSError>;
  /**
   * Allows the remote domain owner to delete an existing inbound cross-cluster connection.
   */
  deleteInboundConnection(params: OpenSearch.Types.DeleteInboundConnectionRequest, callback?: (err: AWSError, data: OpenSearch.Types.DeleteInboundConnectionResponse) => void): Request<OpenSearch.Types.DeleteInboundConnectionResponse, AWSError>;
  /**
   * Allows the remote domain owner to delete an existing inbound cross-cluster connection.
   */
  deleteInboundConnection(callback?: (err: AWSError, data: OpenSearch.Types.DeleteInboundConnectionResponse) => void): Request<OpenSearch.Types.DeleteInboundConnectionResponse, AWSError>;
  /**
   * Allows the local domain owner to delete an existing outbound cross-cluster connection.
   */
  deleteOutboundConnection(params: OpenSearch.Types.DeleteOutboundConnectionRequest, callback?: (err: AWSError, data: OpenSearch.Types.DeleteOutboundConnectionResponse) => void): Request<OpenSearch.Types.DeleteOutboundConnectionResponse, AWSError>;
  /**
   * Allows the local domain owner to delete an existing outbound cross-cluster connection.
   */
  deleteOutboundConnection(callback?: (err: AWSError, data: OpenSearch.Types.DeleteOutboundConnectionResponse) => void): Request<OpenSearch.Types.DeleteOutboundConnectionResponse, AWSError>;
  /**
   * Deletes the package.
   */
  deletePackage(params: OpenSearch.Types.DeletePackageRequest, callback?: (err: AWSError, data: OpenSearch.Types.DeletePackageResponse) => void): Request<OpenSearch.Types.DeletePackageResponse, AWSError>;
  /**
   * Deletes the package.
   */
  deletePackage(callback?: (err: AWSError, data: OpenSearch.Types.DeletePackageResponse) => void): Request<OpenSearch.Types.DeletePackageResponse, AWSError>;
  /**
   * Returns domain configuration information about the specified domain, including the domain ID, domain endpoint, and domain ARN. 
   */
  describeDomain(params: OpenSearch.Types.DescribeDomainRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainResponse) => void): Request<OpenSearch.Types.DescribeDomainResponse, AWSError>;
  /**
   * Returns domain configuration information about the specified domain, including the domain ID, domain endpoint, and domain ARN. 
   */
  describeDomain(callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainResponse) => void): Request<OpenSearch.Types.DescribeDomainResponse, AWSError>;
  /**
   * Provides scheduled Auto-Tune action details for the domain, such as Auto-Tune action type, description, severity, and scheduled date. 
   */
  describeDomainAutoTunes(params: OpenSearch.Types.DescribeDomainAutoTunesRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainAutoTunesResponse) => void): Request<OpenSearch.Types.DescribeDomainAutoTunesResponse, AWSError>;
  /**
   * Provides scheduled Auto-Tune action details for the domain, such as Auto-Tune action type, description, severity, and scheduled date. 
   */
  describeDomainAutoTunes(callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainAutoTunesResponse) => void): Request<OpenSearch.Types.DescribeDomainAutoTunesResponse, AWSError>;
  /**
   * Provides cluster configuration information about the specified domain, such as the state, creation date, update version, and update date for cluster options. 
   */
  describeDomainConfig(params: OpenSearch.Types.DescribeDomainConfigRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainConfigResponse) => void): Request<OpenSearch.Types.DescribeDomainConfigResponse, AWSError>;
  /**
   * Provides cluster configuration information about the specified domain, such as the state, creation date, update version, and update date for cluster options. 
   */
  describeDomainConfig(callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainConfigResponse) => void): Request<OpenSearch.Types.DescribeDomainConfigResponse, AWSError>;
  /**
   * Returns domain configuration information about the specified domains, including the domain ID, domain endpoint, and domain ARN. 
   */
  describeDomains(params: OpenSearch.Types.DescribeDomainsRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainsResponse) => void): Request<OpenSearch.Types.DescribeDomainsResponse, AWSError>;
  /**
   * Returns domain configuration information about the specified domains, including the domain ID, domain endpoint, and domain ARN. 
   */
  describeDomains(callback?: (err: AWSError, data: OpenSearch.Types.DescribeDomainsResponse) => void): Request<OpenSearch.Types.DescribeDomainsResponse, AWSError>;
  /**
   * Lists all the inbound cross-cluster connections for a remote domain.
   */
  describeInboundConnections(params: OpenSearch.Types.DescribeInboundConnectionsRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeInboundConnectionsResponse) => void): Request<OpenSearch.Types.DescribeInboundConnectionsResponse, AWSError>;
  /**
   * Lists all the inbound cross-cluster connections for a remote domain.
   */
  describeInboundConnections(callback?: (err: AWSError, data: OpenSearch.Types.DescribeInboundConnectionsResponse) => void): Request<OpenSearch.Types.DescribeInboundConnectionsResponse, AWSError>;
  /**
   *  Describe the limits for a given instance type and OpenSearch or Elasticsearch version. When modifying an existing domain, specify the  DomainName  to see which limits you can modify. 
   */
  describeInstanceTypeLimits(params: OpenSearch.Types.DescribeInstanceTypeLimitsRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeInstanceTypeLimitsResponse) => void): Request<OpenSearch.Types.DescribeInstanceTypeLimitsResponse, AWSError>;
  /**
   *  Describe the limits for a given instance type and OpenSearch or Elasticsearch version. When modifying an existing domain, specify the  DomainName  to see which limits you can modify. 
   */
  describeInstanceTypeLimits(callback?: (err: AWSError, data: OpenSearch.Types.DescribeInstanceTypeLimitsResponse) => void): Request<OpenSearch.Types.DescribeInstanceTypeLimitsResponse, AWSError>;
  /**
   * Lists all the outbound cross-cluster connections for a local domain.
   */
  describeOutboundConnections(params: OpenSearch.Types.DescribeOutboundConnectionsRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeOutboundConnectionsResponse) => void): Request<OpenSearch.Types.DescribeOutboundConnectionsResponse, AWSError>;
  /**
   * Lists all the outbound cross-cluster connections for a local domain.
   */
  describeOutboundConnections(callback?: (err: AWSError, data: OpenSearch.Types.DescribeOutboundConnectionsResponse) => void): Request<OpenSearch.Types.DescribeOutboundConnectionsResponse, AWSError>;
  /**
   * Describes all packages available to Amazon OpenSearch Service domains. Includes options for filtering, limiting the number of results, and pagination. 
   */
  describePackages(params: OpenSearch.Types.DescribePackagesRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribePackagesResponse) => void): Request<OpenSearch.Types.DescribePackagesResponse, AWSError>;
  /**
   * Describes all packages available to Amazon OpenSearch Service domains. Includes options for filtering, limiting the number of results, and pagination. 
   */
  describePackages(callback?: (err: AWSError, data: OpenSearch.Types.DescribePackagesResponse) => void): Request<OpenSearch.Types.DescribePackagesResponse, AWSError>;
  /**
   * Lists available reserved OpenSearch instance offerings.
   */
  describeReservedInstanceOfferings(params: OpenSearch.Types.DescribeReservedInstanceOfferingsRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeReservedInstanceOfferingsResponse) => void): Request<OpenSearch.Types.DescribeReservedInstanceOfferingsResponse, AWSError>;
  /**
   * Lists available reserved OpenSearch instance offerings.
   */
  describeReservedInstanceOfferings(callback?: (err: AWSError, data: OpenSearch.Types.DescribeReservedInstanceOfferingsResponse) => void): Request<OpenSearch.Types.DescribeReservedInstanceOfferingsResponse, AWSError>;
  /**
   * Returns information about reserved OpenSearch instances for this account.
   */
  describeReservedInstances(params: OpenSearch.Types.DescribeReservedInstancesRequest, callback?: (err: AWSError, data: OpenSearch.Types.DescribeReservedInstancesResponse) => void): Request<OpenSearch.Types.DescribeReservedInstancesResponse, AWSError>;
  /**
   * Returns information about reserved OpenSearch instances for this account.
   */
  describeReservedInstances(callback?: (err: AWSError, data: OpenSearch.Types.DescribeReservedInstancesResponse) => void): Request<OpenSearch.Types.DescribeReservedInstancesResponse, AWSError>;
  /**
   * Dissociates a package from the Amazon OpenSearch Service domain.
   */
  dissociatePackage(params: OpenSearch.Types.DissociatePackageRequest, callback?: (err: AWSError, data: OpenSearch.Types.DissociatePackageResponse) => void): Request<OpenSearch.Types.DissociatePackageResponse, AWSError>;
  /**
   * Dissociates a package from the Amazon OpenSearch Service domain.
   */
  dissociatePackage(callback?: (err: AWSError, data: OpenSearch.Types.DissociatePackageResponse) => void): Request<OpenSearch.Types.DissociatePackageResponse, AWSError>;
  /**
   *  Returns a list of upgrade-compatible versions of OpenSearch/Elasticsearch. You can optionally pass a  DomainName  to get all upgrade-compatible versions of OpenSearch/Elasticsearch for that specific domain. 
   */
  getCompatibleVersions(params: OpenSearch.Types.GetCompatibleVersionsRequest, callback?: (err: AWSError, data: OpenSearch.Types.GetCompatibleVersionsResponse) => void): Request<OpenSearch.Types.GetCompatibleVersionsResponse, AWSError>;
  /**
   *  Returns a list of upgrade-compatible versions of OpenSearch/Elasticsearch. You can optionally pass a  DomainName  to get all upgrade-compatible versions of OpenSearch/Elasticsearch for that specific domain. 
   */
  getCompatibleVersions(callback?: (err: AWSError, data: OpenSearch.Types.GetCompatibleVersionsResponse) => void): Request<OpenSearch.Types.GetCompatibleVersionsResponse, AWSError>;
  /**
   * Returns a list of package versions, along with their creation time and commit message.
   */
  getPackageVersionHistory(params: OpenSearch.Types.GetPackageVersionHistoryRequest, callback?: (err: AWSError, data: OpenSearch.Types.GetPackageVersionHistoryResponse) => void): Request<OpenSearch.Types.GetPackageVersionHistoryResponse, AWSError>;
  /**
   * Returns a list of package versions, along with their creation time and commit message.
   */
  getPackageVersionHistory(callback?: (err: AWSError, data: OpenSearch.Types.GetPackageVersionHistoryResponse) => void): Request<OpenSearch.Types.GetPackageVersionHistoryResponse, AWSError>;
  /**
   * Retrieves the complete history of the last 10 upgrades performed on the domain.
   */
  getUpgradeHistory(params: OpenSearch.Types.GetUpgradeHistoryRequest, callback?: (err: AWSError, data: OpenSearch.Types.GetUpgradeHistoryResponse) => void): Request<OpenSearch.Types.GetUpgradeHistoryResponse, AWSError>;
  /**
   * Retrieves the complete history of the last 10 upgrades performed on the domain.
   */
  getUpgradeHistory(callback?: (err: AWSError, data: OpenSearch.Types.GetUpgradeHistoryResponse) => void): Request<OpenSearch.Types.GetUpgradeHistoryResponse, AWSError>;
  /**
   * Retrieves the latest status of the last upgrade or upgrade eligibility check performed on the domain. 
   */
  getUpgradeStatus(params: OpenSearch.Types.GetUpgradeStatusRequest, callback?: (err: AWSError, data: OpenSearch.Types.GetUpgradeStatusResponse) => void): Request<OpenSearch.Types.GetUpgradeStatusResponse, AWSError>;
  /**
   * Retrieves the latest status of the last upgrade or upgrade eligibility check performed on the domain. 
   */
  getUpgradeStatus(callback?: (err: AWSError, data: OpenSearch.Types.GetUpgradeStatusResponse) => void): Request<OpenSearch.Types.GetUpgradeStatusResponse, AWSError>;
  /**
   * Returns the names of all domains owned by the current user's account.
   */
  listDomainNames(params: OpenSearch.Types.ListDomainNamesRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListDomainNamesResponse) => void): Request<OpenSearch.Types.ListDomainNamesResponse, AWSError>;
  /**
   * Returns the names of all domains owned by the current user's account.
   */
  listDomainNames(callback?: (err: AWSError, data: OpenSearch.Types.ListDomainNamesResponse) => void): Request<OpenSearch.Types.ListDomainNamesResponse, AWSError>;
  /**
   * Lists all Amazon OpenSearch Service domains associated with the package.
   */
  listDomainsForPackage(params: OpenSearch.Types.ListDomainsForPackageRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListDomainsForPackageResponse) => void): Request<OpenSearch.Types.ListDomainsForPackageResponse, AWSError>;
  /**
   * Lists all Amazon OpenSearch Service domains associated with the package.
   */
  listDomainsForPackage(callback?: (err: AWSError, data: OpenSearch.Types.ListDomainsForPackageResponse) => void): Request<OpenSearch.Types.ListDomainsForPackageResponse, AWSError>;
  /**
   * 
   */
  listInstanceTypeDetails(params: OpenSearch.Types.ListInstanceTypeDetailsRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListInstanceTypeDetailsResponse) => void): Request<OpenSearch.Types.ListInstanceTypeDetailsResponse, AWSError>;
  /**
   * 
   */
  listInstanceTypeDetails(callback?: (err: AWSError, data: OpenSearch.Types.ListInstanceTypeDetailsResponse) => void): Request<OpenSearch.Types.ListInstanceTypeDetailsResponse, AWSError>;
  /**
   * Lists all packages associated with the Amazon OpenSearch Service domain.
   */
  listPackagesForDomain(params: OpenSearch.Types.ListPackagesForDomainRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListPackagesForDomainResponse) => void): Request<OpenSearch.Types.ListPackagesForDomainResponse, AWSError>;
  /**
   * Lists all packages associated with the Amazon OpenSearch Service domain.
   */
  listPackagesForDomain(callback?: (err: AWSError, data: OpenSearch.Types.ListPackagesForDomainResponse) => void): Request<OpenSearch.Types.ListPackagesForDomainResponse, AWSError>;
  /**
   * Returns all tags for the given domain.
   */
  listTags(params: OpenSearch.Types.ListTagsRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListTagsResponse) => void): Request<OpenSearch.Types.ListTagsResponse, AWSError>;
  /**
   * Returns all tags for the given domain.
   */
  listTags(callback?: (err: AWSError, data: OpenSearch.Types.ListTagsResponse) => void): Request<OpenSearch.Types.ListTagsResponse, AWSError>;
  /**
   * List all supported versions of OpenSearch and Elasticsearch.
   */
  listVersions(params: OpenSearch.Types.ListVersionsRequest, callback?: (err: AWSError, data: OpenSearch.Types.ListVersionsResponse) => void): Request<OpenSearch.Types.ListVersionsResponse, AWSError>;
  /**
   * List all supported versions of OpenSearch and Elasticsearch.
   */
  listVersions(callback?: (err: AWSError, data: OpenSearch.Types.ListVersionsResponse) => void): Request<OpenSearch.Types.ListVersionsResponse, AWSError>;
  /**
   * Allows you to purchase reserved OpenSearch instances.
   */
  purchaseReservedInstanceOffering(params: OpenSearch.Types.PurchaseReservedInstanceOfferingRequest, callback?: (err: AWSError, data: OpenSearch.Types.PurchaseReservedInstanceOfferingResponse) => void): Request<OpenSearch.Types.PurchaseReservedInstanceOfferingResponse, AWSError>;
  /**
   * Allows you to purchase reserved OpenSearch instances.
   */
  purchaseReservedInstanceOffering(callback?: (err: AWSError, data: OpenSearch.Types.PurchaseReservedInstanceOfferingResponse) => void): Request<OpenSearch.Types.PurchaseReservedInstanceOfferingResponse, AWSError>;
  /**
   * Allows the remote domain owner to reject an inbound cross-cluster connection request.
   */
  rejectInboundConnection(params: OpenSearch.Types.RejectInboundConnectionRequest, callback?: (err: AWSError, data: OpenSearch.Types.RejectInboundConnectionResponse) => void): Request<OpenSearch.Types.RejectInboundConnectionResponse, AWSError>;
  /**
   * Allows the remote domain owner to reject an inbound cross-cluster connection request.
   */
  rejectInboundConnection(callback?: (err: AWSError, data: OpenSearch.Types.RejectInboundConnectionResponse) => void): Request<OpenSearch.Types.RejectInboundConnectionResponse, AWSError>;
  /**
   * Removes the specified set of tags from the given domain.
   */
  removeTags(params: OpenSearch.Types.RemoveTagsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified set of tags from the given domain.
   */
  removeTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Schedules a service software update for an Amazon OpenSearch Service domain.
   */
  startServiceSoftwareUpdate(params: OpenSearch.Types.StartServiceSoftwareUpdateRequest, callback?: (err: AWSError, data: OpenSearch.Types.StartServiceSoftwareUpdateResponse) => void): Request<OpenSearch.Types.StartServiceSoftwareUpdateResponse, AWSError>;
  /**
   * Schedules a service software update for an Amazon OpenSearch Service domain.
   */
  startServiceSoftwareUpdate(callback?: (err: AWSError, data: OpenSearch.Types.StartServiceSoftwareUpdateResponse) => void): Request<OpenSearch.Types.StartServiceSoftwareUpdateResponse, AWSError>;
  /**
   * Modifies the cluster configuration of the specified domain, such as setting the instance type and the number of instances. 
   */
  updateDomainConfig(params: OpenSearch.Types.UpdateDomainConfigRequest, callback?: (err: AWSError, data: OpenSearch.Types.UpdateDomainConfigResponse) => void): Request<OpenSearch.Types.UpdateDomainConfigResponse, AWSError>;
  /**
   * Modifies the cluster configuration of the specified domain, such as setting the instance type and the number of instances. 
   */
  updateDomainConfig(callback?: (err: AWSError, data: OpenSearch.Types.UpdateDomainConfigResponse) => void): Request<OpenSearch.Types.UpdateDomainConfigResponse, AWSError>;
  /**
   * Updates a package for use with Amazon OpenSearch Service domains.
   */
  updatePackage(params: OpenSearch.Types.UpdatePackageRequest, callback?: (err: AWSError, data: OpenSearch.Types.UpdatePackageResponse) => void): Request<OpenSearch.Types.UpdatePackageResponse, AWSError>;
  /**
   * Updates a package for use with Amazon OpenSearch Service domains.
   */
  updatePackage(callback?: (err: AWSError, data: OpenSearch.Types.UpdatePackageResponse) => void): Request<OpenSearch.Types.UpdatePackageResponse, AWSError>;
  /**
   * Allows you to either upgrade your domain or perform an upgrade eligibility check to a compatible version of OpenSearch or Elasticsearch. 
   */
  upgradeDomain(params: OpenSearch.Types.UpgradeDomainRequest, callback?: (err: AWSError, data: OpenSearch.Types.UpgradeDomainResponse) => void): Request<OpenSearch.Types.UpgradeDomainResponse, AWSError>;
  /**
   * Allows you to either upgrade your domain or perform an upgrade eligibility check to a compatible version of OpenSearch or Elasticsearch. 
   */
  upgradeDomain(callback?: (err: AWSError, data: OpenSearch.Types.UpgradeDomainResponse) => void): Request<OpenSearch.Types.UpgradeDomainResponse, AWSError>;
}
declare namespace OpenSearch {
  export type ARN = string;
  export interface AWSDomainInformation {
    OwnerId?: OwnerId;
    DomainName: DomainName;
    Region?: Region;
  }
  export interface AcceptInboundConnectionRequest {
    /**
     * The ID of the inbound connection you want to accept.
     */
    ConnectionId: ConnectionId;
  }
  export interface AcceptInboundConnectionResponse {
    /**
     * The  InboundConnection  of the accepted inbound connection. 
     */
    Connection?: InboundConnection;
  }
  export interface AccessPoliciesStatus {
    /**
     * The access policy configured for the domain. Access policies can be resource-based, IP-based, or IAM-based. See  Configuring access policiesfor more information. 
     */
    Options: PolicyDocument;
    /**
     * The status of the access policy for the domain. See OptionStatus for the status information that's included. 
     */
    Status: OptionStatus;
  }
  export interface AddTagsRequest {
    /**
     * Specify the ARN of the domain you want to add tags to. 
     */
    ARN: ARN;
    /**
     * List of Tag to add to the domain. 
     */
    TagList: TagList;
  }
  export interface AdditionalLimit {
    /**
     *  Additional limit is specific to a given InstanceType and for each of its  InstanceRole  etc.  Attributes and their details:   MaximumNumberOfDataNodesSupported This attribute is present on the master node only to specify how much data nodes up to which given  ESPartitionInstanceType  can support as master node. MaximumNumberOfDataNodesWithoutMasterNode This attribute is present on data node only to specify how much data nodes of given  ESPartitionInstanceType  up to which you don't need any master nodes to govern them.  
     */
    LimitName?: LimitName;
    /**
     *  Value for a given  AdditionalLimit$LimitName  . 
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
     * The OptionStatus for advanced options for the specified domain. 
     */
    Status: OptionStatus;
  }
  export interface AdvancedSecurityOptions {
    /**
     * True if advanced security is enabled.
     */
    Enabled?: Boolean;
    /**
     * True if the internal user database is enabled.
     */
    InternalUserDatabaseEnabled?: Boolean;
    /**
     * Describes the SAML application configured for a domain.
     */
    SAMLOptions?: SAMLOptionsOutput;
  }
  export interface AdvancedSecurityOptionsInput {
    /**
     * True if advanced security is enabled.
     */
    Enabled?: Boolean;
    /**
     * True if the internal user database is enabled.
     */
    InternalUserDatabaseEnabled?: Boolean;
    /**
     * Credentials for the master user: username and password, ARN, or both.
     */
    MasterUserOptions?: MasterUserOptions;
    /**
     * The SAML application configuration for the domain.
     */
    SAMLOptions?: SAMLOptionsInput;
  }
  export interface AdvancedSecurityOptionsStatus {
    /**
     * Advanced security options for the specified domain.
     */
    Options: AdvancedSecurityOptions;
    /**
     * Status of the advanced security options for the specified domain.
     */
    Status: OptionStatus;
  }
  export interface AssociatePackageRequest {
    /**
     * Internal ID of the package to associate with a domain. Use DescribePackages to find this value. 
     */
    PackageID: PackageID;
    /**
     * The name of the domain to associate the package with.
     */
    DomainName: DomainName;
  }
  export interface AssociatePackageResponse {
    /**
     *  DomainPackageDetails 
     */
    DomainPackageDetails?: DomainPackageDetails;
  }
  export interface AutoTune {
    /**
     * Specifies the Auto-Tune type. Valid value is SCHEDULED_ACTION.
     */
    AutoTuneType?: AutoTuneType;
    /**
     * Specifies details about the Auto-Tune action. See  Auto-Tune for Amazon OpenSearch Service  for more information. 
     */
    AutoTuneDetails?: AutoTuneDetails;
  }
  export type AutoTuneDate = Date;
  export type AutoTuneDesiredState = "ENABLED"|"DISABLED"|string;
  export interface AutoTuneDetails {
    ScheduledAutoTuneDetails?: ScheduledAutoTuneDetails;
  }
  export type AutoTuneList = AutoTune[];
  export interface AutoTuneMaintenanceSchedule {
    /**
     * The timestamp at which the Auto-Tune maintenance schedule starts.
     */
    StartAt?: StartAt;
    /**
     * Specifies maintenance schedule duration: duration value and duration unit. See  Auto-Tune for Amazon OpenSearch Service  for more information. 
     */
    Duration?: Duration;
    /**
     * A cron expression for a recurring maintenance schedule. See  Auto-Tune for Amazon OpenSearch Service  for more information. 
     */
    CronExpressionForRecurrence?: String;
  }
  export type AutoTuneMaintenanceScheduleList = AutoTuneMaintenanceSchedule[];
  export interface AutoTuneOptions {
    /**
     * The Auto-Tune desired state. Valid values are ENABLED and DISABLED.
     */
    DesiredState?: AutoTuneDesiredState;
    /**
     * The rollback state while disabling Auto-Tune for the domain. Valid values are NO_ROLLBACK and DEFAULT_ROLLBACK. 
     */
    RollbackOnDisable?: RollbackOnDisable;
    /**
     * A list of maintenance schedules. See  Auto-Tune for Amazon OpenSearch Service  for more information. 
     */
    MaintenanceSchedules?: AutoTuneMaintenanceScheduleList;
  }
  export interface AutoTuneOptionsInput {
    /**
     * The Auto-Tune desired state. Valid values are ENABLED and DISABLED.
     */
    DesiredState?: AutoTuneDesiredState;
    /**
     * A list of maintenance schedules. See  Auto-Tune for Amazon OpenSearch Service  for more information. 
     */
    MaintenanceSchedules?: AutoTuneMaintenanceScheduleList;
  }
  export interface AutoTuneOptionsOutput {
    /**
     * The AutoTuneState for the domain. 
     */
    State?: AutoTuneState;
    /**
     * The error message while enabling or disabling Auto-Tune.
     */
    ErrorMessage?: String;
  }
  export interface AutoTuneOptionsStatus {
    /**
     * Specifies Auto-Tune options for the domain.
     */
    Options?: AutoTuneOptions;
    /**
     * The status of the Auto-Tune options for the domain.
     */
    Status?: AutoTuneStatus;
  }
  export type AutoTuneState = "ENABLED"|"DISABLED"|"ENABLE_IN_PROGRESS"|"DISABLE_IN_PROGRESS"|"DISABLED_AND_ROLLBACK_SCHEDULED"|"DISABLED_AND_ROLLBACK_IN_PROGRESS"|"DISABLED_AND_ROLLBACK_COMPLETE"|"DISABLED_AND_ROLLBACK_ERROR"|"ERROR"|string;
  export interface AutoTuneStatus {
    /**
     * The timestamp of the Auto-Tune options creation date.
     */
    CreationDate: UpdateTimestamp;
    /**
     * The timestamp of when the Auto-Tune options were last updated.
     */
    UpdateDate: UpdateTimestamp;
    /**
     * The latest version of the Auto-Tune options.
     */
    UpdateVersion?: UIntValue;
    /**
     * The AutoTuneState for the domain. 
     */
    State: AutoTuneState;
    /**
     * The error message while enabling or disabling Auto-Tune.
     */
    ErrorMessage?: String;
    /**
     * Indicates whether the domain is being deleted.
     */
    PendingDeletion?: Boolean;
  }
  export type AutoTuneType = "SCHEDULED_ACTION"|string;
  export type BackendRole = string;
  export type Boolean = boolean;
  export interface CancelServiceSoftwareUpdateRequest {
    /**
     * The name of the domain that you want to stop the latest service software update on.
     */
    DomainName: DomainName;
  }
  export interface CancelServiceSoftwareUpdateResponse {
    /**
     * The current status of the OpenSearch service software update.
     */
    ServiceSoftwareOptions?: ServiceSoftwareOptions;
  }
  export type CloudWatchLogsLogGroupArn = string;
  export interface ClusterConfig {
    /**
     * The instance type for an OpenSearch cluster. UltraWarm instance types are not supported for data instances. 
     */
    InstanceType?: OpenSearchPartitionInstanceType;
    /**
     * The number of instances in the specified domain cluster.
     */
    InstanceCount?: IntegerClass;
    /**
     * A boolean value to indicate whether a dedicated master node is enabled. See Dedicated master nodes in Amazon OpenSearch Service  for more information. 
     */
    DedicatedMasterEnabled?: Boolean;
    /**
     * A boolean value to indicate whether zone awareness is enabled. See Configuring a multi-AZ domain in Amazon OpenSearch Service  for more information. 
     */
    ZoneAwarenessEnabled?: Boolean;
    /**
     * The zone awareness configuration for a domain when zone awareness is enabled.
     */
    ZoneAwarenessConfig?: ZoneAwarenessConfig;
    /**
     * The instance type for a dedicated master node.
     */
    DedicatedMasterType?: OpenSearchPartitionInstanceType;
    /**
     * Total number of dedicated master nodes, active and on standby, for the cluster.
     */
    DedicatedMasterCount?: IntegerClass;
    /**
     * True to enable UltraWarm storage.
     */
    WarmEnabled?: Boolean;
    /**
     * The instance type for the OpenSearch cluster's warm nodes.
     */
    WarmType?: OpenSearchWarmPartitionInstanceType;
    /**
     * The number of UltraWarm nodes in the cluster.
     */
    WarmCount?: IntegerClass;
    /**
     * Specifies the ColdStorageOptions config for a Domain
     */
    ColdStorageOptions?: ColdStorageOptions;
  }
  export interface ClusterConfigStatus {
    /**
     * The cluster configuration for the specified domain.
     */
    Options: ClusterConfig;
    /**
     * The cluster configuration status for the specified domain.
     */
    Status: OptionStatus;
  }
  export interface CognitoOptions {
    /**
     * The option to enable Cognito for OpenSearch Dashboards authentication.
     */
    Enabled?: Boolean;
    /**
     * The Cognito user pool ID for OpenSearch Dashboards authentication.
     */
    UserPoolId?: UserPoolId;
    /**
     * The Cognito identity pool ID for OpenSearch Dashboards authentication.
     */
    IdentityPoolId?: IdentityPoolId;
    /**
     * The role ARN that provides OpenSearch permissions for accessing Cognito resources.
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
     * Enable cold storage option. Accepted values true or false
     */
    Enabled: Boolean;
  }
  export type CommitMessage = string;
  export type CompatibleVersionsList = CompatibleVersionsMap[];
  export interface CompatibleVersionsMap {
    /**
     * The current version of OpenSearch a domain is on.
     */
    SourceVersion?: VersionString;
    TargetVersions?: VersionList;
  }
  export type ConnectionAlias = string;
  export type ConnectionId = string;
  export type ConnectionStatusMessage = string;
  export interface CreateDomainRequest {
    /**
     * The name of the Amazon OpenSearch Service domain you're creating. Domain names are unique across the domains owned by an account within an AWS region. Domain names must start with a lowercase letter and can contain the following characters: a-z (lowercase), 0-9, and - (hyphen). 
     */
    DomainName: DomainName;
    /**
     * String of format Elasticsearch_X.Y or OpenSearch_X.Y to specify the engine version for the Amazon OpenSearch Service domain. For example, "OpenSearch_1.0" or "Elasticsearch_7.9". For more information, see Creating and managing Amazon OpenSearch Service domains . 
     */
    EngineVersion?: VersionString;
    /**
     * Configuration options for a domain. Specifies the instance type and number of instances in the domain. 
     */
    ClusterConfig?: ClusterConfig;
    /**
     * Options to enable, disable, and specify the type and size of EBS storage volumes.
     */
    EBSOptions?: EBSOptions;
    /**
     * IAM access policy as a JSON-formatted string.
     */
    AccessPolicies?: PolicyDocument;
    /**
     * Option to set time, in UTC format, of the daily automated snapshot. Default value is 0 hours.
     */
    SnapshotOptions?: SnapshotOptions;
    /**
     * Options to specify the subnets and security groups for a VPC endpoint. For more information, see Launching your Amazon OpenSearch Service domains using a VPC . 
     */
    VPCOptions?: VPCOptions;
    /**
     * Options to specify the Cognito user and identity pools for OpenSearch Dashboards authentication. For more information, see Configuring Amazon Cognito authentication for OpenSearch Dashboards. 
     */
    CognitoOptions?: CognitoOptions;
    /**
     * Options for encryption of data at rest.
     */
    EncryptionAtRestOptions?: EncryptionAtRestOptions;
    /**
     * Node-to-node encryption options.
     */
    NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptions;
    /**
     * Option to allow references to indices in an HTTP request body. Must be false when configuring access to individual sub-resources. By default, the value is true. See Advanced cluster parameters  for more information. 
     */
    AdvancedOptions?: AdvancedOptions;
    /**
     * Map of LogType and LogPublishingOption, each containing options to publish a given type of OpenSearch log. 
     */
    LogPublishingOptions?: LogPublishingOptions;
    /**
     * Options to specify configurations that will be applied to the domain endpoint.
     */
    DomainEndpointOptions?: DomainEndpointOptions;
    /**
     * Specifies advanced security options.
     */
    AdvancedSecurityOptions?: AdvancedSecurityOptionsInput;
    /**
     * A list of Tag added during domain creation. 
     */
    TagList?: TagList;
    /**
     * Specifies Auto-Tune options.
     */
    AutoTuneOptions?: AutoTuneOptionsInput;
  }
  export interface CreateDomainResponse {
    /**
     * The status of the newly created domain.
     */
    DomainStatus?: DomainStatus;
  }
  export interface CreateOutboundConnectionRequest {
    /**
     * The  AWSDomainInformation  for the local OpenSearch domain. 
     */
    LocalDomainInfo: DomainInformationContainer;
    /**
     * The  AWSDomainInformation  for the remote OpenSearch domain. 
     */
    RemoteDomainInfo: DomainInformationContainer;
    /**
     * The connection alias used used by the customer for this cross-cluster connection.
     */
    ConnectionAlias: ConnectionAlias;
  }
  export interface CreateOutboundConnectionResponse {
    /**
     * The  AWSDomainInformation  for the local OpenSearch domain. 
     */
    LocalDomainInfo?: DomainInformationContainer;
    /**
     * The  AWSDomainInformation  for the remote OpenSearch domain. 
     */
    RemoteDomainInfo?: DomainInformationContainer;
    /**
     * The connection alias provided during the create connection request.
     */
    ConnectionAlias?: ConnectionAlias;
    /**
     * The  OutboundConnectionStatus  for the newly created connection. 
     */
    ConnectionStatus?: OutboundConnectionStatus;
    /**
     * The unique ID for the created outbound connection, which is used for subsequent operations on the connection.
     */
    ConnectionId?: ConnectionId;
  }
  export interface CreatePackageRequest {
    /**
     * Unique identifier for the package.
     */
    PackageName: PackageName;
    /**
     * Type of package. Currently supports only TXT-DICTIONARY.
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
     * Information about the package. 
     */
    PackageDetails?: PackageDetails;
  }
  export type CreatedAt = Date;
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
     * The  InboundConnection  of the deleted inbound connection. 
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
     * The  OutboundConnection  of the deleted outbound connection. 
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
     *  PackageDetails 
     */
    PackageDetails?: PackageDetails;
  }
  export type DeploymentCloseDateTimeStamp = Date;
  export type DeploymentStatus = "PENDING_UPDATE"|"IN_PROGRESS"|"COMPLETED"|"NOT_ELIGIBLE"|"ELIGIBLE"|string;
  export interface DescribeDomainAutoTunesRequest {
    /**
     * The domain name for which you want Auto-Tune action details.
     */
    DomainName: DomainName;
    /**
     * Set this value to limit the number of results returned. If not specified, defaults to 100.
     */
    MaxResults?: MaxResults;
    /**
     * NextToken is sent in case the earlier API call results contain the NextToken. Used for pagination.
     */
    NextToken?: NextToken;
  }
  export interface DescribeDomainAutoTunesResponse {
    /**
     * The list of setting adjustments that Auto-Tune has made to the domain. See  Auto-Tune for Amazon OpenSearch Service  for more information. 
     */
    AutoTunes?: AutoTuneList;
    /**
     * An identifier to allow retrieval of paginated results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeDomainConfigRequest {
    /**
     * The domain you want to get information about.
     */
    DomainName: DomainName;
  }
  export interface DescribeDomainConfigResponse {
    /**
     * The configuration information of the domain requested in the DescribeDomainConfig request. 
     */
    DomainConfig: DomainConfig;
  }
  export interface DescribeDomainRequest {
    /**
     * The name of the domain for which you want information.
     */
    DomainName: DomainName;
  }
  export interface DescribeDomainResponse {
    /**
     * The current status of the domain.
     */
    DomainStatus: DomainStatus;
  }
  export interface DescribeDomainsRequest {
    /**
     * The domains for which you want information.
     */
    DomainNames: DomainNameList;
  }
  export interface DescribeDomainsResponse {
    /**
     * The status of the domains requested in the DescribeDomains request. 
     */
    DomainStatusList: DomainStatusList;
  }
  export interface DescribeInboundConnectionsRequest {
    /**
     *  A list of filters used to match properties for inbound cross-cluster connections. Available  Filter  values are:  connection-id local-domain-info.domain-name local-domain-info.owner-id local-domain-info.region remote-domain-info.domain-name  
     */
    Filters?: FilterList;
    /**
     * Set this value to limit the number of results returned. If not specified, defaults to 100.
     */
    MaxResults?: MaxResults;
    /**
     * If more results are available and NextToken is present, make the next request to the same API with the received NextToken to paginate the remaining results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeInboundConnectionsResponse {
    /**
     * A list of  InboundConnection  matching the specified filter criteria. 
     */
    Connections?: InboundConnections;
    /**
     * If more results are available and NextToken is present, make the next request to the same API with the received NextToken to paginate the remaining results. 
     */
    NextToken?: NextToken;
  }
  export interface DescribeInstanceTypeLimitsRequest {
    /**
     *  The name of the domain you want to modify. Only include this value if you're querying OpenSearch  Limits  for an existing domain. 
     */
    DomainName?: DomainName;
    /**
     *  The instance type for an OpenSearch cluster for which OpenSearch  Limits  are needed. 
     */
    InstanceType: OpenSearchPartitionInstanceType;
    /**
     *  Version of OpenSearch for which  Limits  are needed. 
     */
    EngineVersion: VersionString;
  }
  export interface DescribeInstanceTypeLimitsResponse {
    LimitsByRole?: LimitsByRole;
  }
  export interface DescribeOutboundConnectionsRequest {
    /**
     *  A list of filters used to match properties for outbound cross-cluster connections. Available  Filter  names for this operation are:  connection-id remote-domain-info.domain-name remote-domain-info.owner-id remote-domain-info.region local-domain-info.domain-name  
     */
    Filters?: FilterList;
    /**
     * Set this value to limit the number of results returned. If not specified, defaults to 100.
     */
    MaxResults?: MaxResults;
    /**
     * NextToken is sent in case the earlier API call results contain the NextToken parameter. Used for pagination.
     */
    NextToken?: NextToken;
  }
  export interface DescribeOutboundConnectionsResponse {
    /**
     * A list of  OutboundConnection  matching the specified filter criteria. 
     */
    Connections?: OutboundConnections;
    /**
     * If more results are available and NextToken is present, make the next request to the same API with the received NextToken to paginate the remaining results. 
     */
    NextToken?: NextToken;
  }
  export interface DescribePackagesFilter {
    /**
     * Any field from PackageDetails. 
     */
    Name?: DescribePackagesFilterName;
    /**
     * A list of values for the specified field.
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
     * Limits results to a maximum number of packages.
     */
    MaxResults?: MaxResults;
    /**
     * Used for pagination. Only necessary if a previous API call includes a non-null NextToken value. If provided, returns results for the next page. 
     */
    NextToken?: NextToken;
  }
  export interface DescribePackagesResponse {
    /**
     * List of PackageDetails objects. 
     */
    PackageDetailsList?: PackageDetailsList;
    NextToken?: String;
  }
  export interface DescribeReservedInstanceOfferingsRequest {
    /**
     * The offering identifier filter value. Use this parameter to show only the available offering that matches the specified reservation identifier. 
     */
    ReservedInstanceOfferingId?: GUID;
    /**
     * Set this value to limit the number of results returned. If not specified, defaults to 100.
     */
    MaxResults?: MaxResults;
    /**
     * Provides an identifier to allow retrieval of paginated results. 
     */
    NextToken?: NextToken;
  }
  export interface DescribeReservedInstanceOfferingsResponse {
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    NextToken?: NextToken;
    /**
     * List of reserved OpenSearch instance offerings
     */
    ReservedInstanceOfferings?: ReservedInstanceOfferingList;
  }
  export interface DescribeReservedInstancesRequest {
    /**
     * The reserved instance identifier filter value. Use this parameter to show only the reservation that matches the specified reserved OpenSearch instance ID. 
     */
    ReservedInstanceId?: GUID;
    /**
     * Set this value to limit the number of results returned. If not specified, defaults to 100.
     */
    MaxResults?: MaxResults;
    /**
     * Provides an identifier to allow retrieval of paginated results. 
     */
    NextToken?: NextToken;
  }
  export interface DescribeReservedInstancesResponse {
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    NextToken?: String;
    /**
     * List of reserved OpenSearch instances.
     */
    ReservedInstances?: ReservedInstanceList;
  }
  export interface DissociatePackageRequest {
    /**
     * The internal ID of the package to associate with a domain. Use DescribePackages to find this value. 
     */
    PackageID: PackageID;
    /**
     * The name of the domain to associate the package with.
     */
    DomainName: DomainName;
  }
  export interface DissociatePackageResponse {
    /**
     *  DomainPackageDetails 
     */
    DomainPackageDetails?: DomainPackageDetails;
  }
  export interface DomainConfig {
    /**
     * String of format Elasticsearch_X.Y or OpenSearch_X.Y to specify the engine version for the OpenSearch or Elasticsearch domain.
     */
    EngineVersion?: VersionStatus;
    /**
     * The ClusterConfig for the domain. 
     */
    ClusterConfig?: ClusterConfigStatus;
    /**
     * The EBSOptions for the domain. 
     */
    EBSOptions?: EBSOptionsStatus;
    /**
     * IAM access policy as a JSON-formatted string.
     */
    AccessPolicies?: AccessPoliciesStatus;
    /**
     * The SnapshotOptions for the domain. 
     */
    SnapshotOptions?: SnapshotOptionsStatus;
    /**
     * The VPCOptions for the specified domain. For more information, see  Launching your Amazon OpenSearch Service domains using a VPC. 
     */
    VPCOptions?: VPCDerivedInfoStatus;
    /**
     * The CognitoOptions for the specified domain. For more information, see Configuring Amazon Cognito authentication for OpenSearch Dashboards. 
     */
    CognitoOptions?: CognitoOptionsStatus;
    /**
     * The EncryptionAtRestOptions for the domain. 
     */
    EncryptionAtRestOptions?: EncryptionAtRestOptionsStatus;
    /**
     * The NodeToNodeEncryptionOptions for the domain. 
     */
    NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptionsStatus;
    /**
     * The AdvancedOptions for the domain. See Advanced options  for more information. 
     */
    AdvancedOptions?: AdvancedOptionsStatus;
    /**
     * Log publishing options for the given domain.
     */
    LogPublishingOptions?: LogPublishingOptionsStatus;
    /**
     * The DomainEndpointOptions for the domain. 
     */
    DomainEndpointOptions?: DomainEndpointOptionsStatus;
    /**
     * Specifies AdvancedSecurityOptions for the domain. 
     */
    AdvancedSecurityOptions?: AdvancedSecurityOptionsStatus;
    /**
     * Specifies AutoTuneOptions for the domain. 
     */
    AutoTuneOptions?: AutoTuneOptionsStatus;
  }
  export interface DomainEndpointOptions {
    /**
     * Whether only HTTPS endpoint should be enabled for the domain.
     */
    EnforceHTTPS?: Boolean;
    /**
     * Specify the TLS security policy to apply to the HTTPS endpoint of the domain.  Can be one of the following values:   Policy-Min-TLS-1-0-2019-07: TLS security policy which supports TLSv1.0 and higher.   Policy-Min-TLS-1-2-2019-07: TLS security policy which supports only TLSv1.2   
     */
    TLSSecurityPolicy?: TLSSecurityPolicy;
    /**
     * Whether to enable a custom endpoint for the domain.
     */
    CustomEndpointEnabled?: Boolean;
    /**
     * The fully qualified domain for your custom endpoint.
     */
    CustomEndpoint?: DomainNameFqdn;
    /**
     * The ACM certificate ARN for your custom endpoint.
     */
    CustomEndpointCertificateArn?: ARN;
  }
  export interface DomainEndpointOptionsStatus {
    /**
     * Options to configure the endpoint for the domain.
     */
    Options: DomainEndpointOptions;
    /**
     * The status of the endpoint options for the domain. See OptionStatus for the status information that's included. 
     */
    Status: OptionStatus;
  }
  export type DomainId = string;
  export interface DomainInfo {
    /**
     * The DomainName. 
     */
    DomainName?: DomainName;
    /**
     *  Specifies the EngineType of the domain.
     */
    EngineType?: EngineType;
  }
  export type DomainInfoList = DomainInfo[];
  export interface DomainInformationContainer {
    AWSDomainInformation?: AWSDomainInformation;
  }
  export type DomainName = string;
  export type DomainNameFqdn = string;
  export type DomainNameList = DomainName[];
  export interface DomainPackageDetails {
    /**
     * The internal ID of the package.
     */
    PackageID?: PackageID;
    /**
     * User-specified name of the package.
     */
    PackageName?: PackageName;
    /**
     * Currently supports only TXT-DICTIONARY.
     */
    PackageType?: PackageType;
    /**
     * The timestamp of the most recent update to the package association status.
     */
    LastUpdated?: LastUpdated;
    /**
     * The name of the domain you've associated a package with.
     */
    DomainName?: DomainName;
    /**
     * State of the association. Values are ASSOCIATING, ASSOCIATION_FAILED, ACTIVE, DISSOCIATING, and DISSOCIATION_FAILED.
     */
    DomainPackageStatus?: DomainPackageStatus;
    PackageVersion?: PackageVersion;
    /**
     * The relative path on Amazon OpenSearch Service nodes, which can be used as synonym_path when the package is a synonym file.
     */
    ReferencePath?: ReferencePath;
    /**
     * Additional information if the package is in an error state. Null otherwise.
     */
    ErrorDetails?: ErrorDetails;
  }
  export type DomainPackageDetailsList = DomainPackageDetails[];
  export type DomainPackageStatus = "ASSOCIATING"|"ASSOCIATION_FAILED"|"ACTIVE"|"DISSOCIATING"|"DISSOCIATION_FAILED"|string;
  export interface DomainStatus {
    /**
     * The unique identifier for the specified domain.
     */
    DomainId: DomainId;
    /**
     * The name of a domain. Domain names are unique across the domains owned by an account within an AWS region. Domain names start with a letter or number and can contain the following characters: a-z (lowercase), 0-9, and - (hyphen). 
     */
    DomainName: DomainName;
    /**
     * The Amazon Resource Name (ARN) of a domain. See IAM identifiers  in the AWS Identity and Access Management User Guide for more information. 
     */
    ARN: ARN;
    /**
     * The domain creation status. True if the creation of a domain is complete.  False  if domain creation is still in progress. 
     */
    Created?: Boolean;
    /**
     * The domain deletion status. True if a delete request has been received for the domain but resource cleanup is still in progress. False if the domain has not been deleted. Once domain deletion is complete, the status of the domain is no longer returned. 
     */
    Deleted?: Boolean;
    /**
     * The domain endpoint that you use to submit index and search requests.
     */
    Endpoint?: ServiceUrl;
    /**
     * Map containing the domain endpoints used to submit index and search requests. Example key, value: 'vpc','vpc-endpoint-h2dsd34efgyghrtguk5gt6j2foh4.us-east-1.es.amazonaws.com'. 
     */
    Endpoints?: EndpointsMap;
    /**
     * The status of the domain configuration. True if Amazon OpenSearch Service is processing configuration changes. False if the configuration is active. 
     */
    Processing?: Boolean;
    /**
     * The status of a domain version upgrade. True if Amazon OpenSearch Service is undergoing a version upgrade. False if the configuration is active. 
     */
    UpgradeProcessing?: Boolean;
    EngineVersion?: VersionString;
    /**
     * The type and number of instances in the domain.
     */
    ClusterConfig: ClusterConfig;
    /**
     * The EBSOptions for the specified domain. 
     */
    EBSOptions?: EBSOptions;
    /**
     * IAM access policy as a JSON-formatted string.
     */
    AccessPolicies?: PolicyDocument;
    /**
     * The status of the SnapshotOptions. 
     */
    SnapshotOptions?: SnapshotOptions;
    /**
     * The VPCOptions for the specified domain. For more information, see  Launching your Amazon OpenSearch Service domains using a VPC. 
     */
    VPCOptions?: VPCDerivedInfo;
    /**
     * The CognitoOptions for the specified domain. For more information, see Configuring Amazon Cognito authentication for OpenSearch Dashboards. 
     */
    CognitoOptions?: CognitoOptions;
    /**
     * The status of the EncryptionAtRestOptions. 
     */
    EncryptionAtRestOptions?: EncryptionAtRestOptions;
    /**
     * The status of the NodeToNodeEncryptionOptions. 
     */
    NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptions;
    /**
     * The status of the AdvancedOptions. 
     */
    AdvancedOptions?: AdvancedOptions;
    /**
     * Log publishing options for the given domain.
     */
    LogPublishingOptions?: LogPublishingOptions;
    /**
     * The current status of the domain's service software.
     */
    ServiceSoftwareOptions?: ServiceSoftwareOptions;
    /**
     * The current status of the domain's endpoint options.
     */
    DomainEndpointOptions?: DomainEndpointOptions;
    /**
     * The current status of the domain's advanced security options.
     */
    AdvancedSecurityOptions?: AdvancedSecurityOptions;
    /**
     * The current status of the domain's Auto-Tune options.
     */
    AutoTuneOptions?: AutoTuneOptionsOutput;
  }
  export type DomainStatusList = DomainStatus[];
  export type Double = number;
  export interface Duration {
    /**
     * Integer to specify the value of a maintenance schedule duration. See  Auto-Tune for Amazon OpenSearch Service  for more information. 
     */
    Value?: DurationValue;
    /**
     * The unit of a maintenance schedule duration. Valid value is HOURS. See  Auto-Tune for Amazon OpenSearch Service  for more information. 
     */
    Unit?: TimeUnit;
  }
  export type DurationValue = number;
  export interface EBSOptions {
    /**
     * Whether EBS-based storage is enabled.
     */
    EBSEnabled?: Boolean;
    /**
     * The volume type for EBS-based storage.
     */
    VolumeType?: VolumeType;
    /**
     * Integer to specify the size of an EBS volume.
     */
    VolumeSize?: IntegerClass;
    /**
     * The IOPD for a Provisioned IOPS EBS volume (SSD).
     */
    Iops?: IntegerClass;
  }
  export interface EBSOptionsStatus {
    /**
     * The EBS options for the specified domain.
     */
    Options: EBSOptions;
    /**
     * The status of the EBS options for the specified domain.
     */
    Status: OptionStatus;
  }
  export interface EncryptionAtRestOptions {
    /**
     * The option to enable encryption at rest.
     */
    Enabled?: Boolean;
    /**
     * The KMS key ID for encryption at rest options.
     */
    KmsKeyId?: KmsKeyId;
  }
  export interface EncryptionAtRestOptionsStatus {
    /**
     * The Encryption At Rest options for the specified domain.
     */
    Options: EncryptionAtRestOptions;
    /**
     * The status of the Encryption At Rest options for the specified domain.
     */
    Status: OptionStatus;
  }
  export type EndpointsMap = {[key: string]: ServiceUrl};
  export type EngineType = "OpenSearch"|"Elasticsearch"|string;
  export interface ErrorDetails {
    ErrorType?: ErrorType;
    ErrorMessage?: ErrorMessage;
  }
  export type ErrorMessage = string;
  export type ErrorType = string;
  export interface Filter {
    /**
     *  The name of the filter. 
     */
    Name?: NonEmptyString;
    /**
     *  Contains one or more values for the filter. 
     */
    Values?: ValueStringList;
  }
  export type FilterList = Filter[];
  export type GUID = string;
  export interface GetCompatibleVersionsRequest {
    DomainName?: DomainName;
  }
  export interface GetCompatibleVersionsResponse {
    /**
     *  A map of compatible OpenSearch versions returned as part of the  GetCompatibleVersions  operation. 
     */
    CompatibleVersions?: CompatibleVersionsList;
  }
  export interface GetPackageVersionHistoryRequest {
    /**
     * Returns an audit history of package versions.
     */
    PackageID: PackageID;
    /**
     * Limits results to a maximum number of package versions.
     */
    MaxResults?: MaxResults;
    /**
     * Used for pagination. Only necessary if a previous API call includes a non-null NextToken value. If provided, returns results for the next page. 
     */
    NextToken?: NextToken;
  }
  export interface GetPackageVersionHistoryResponse {
    PackageID?: PackageID;
    /**
     * List of PackageVersionHistory objects. 
     */
    PackageVersionHistoryList?: PackageVersionHistoryList;
    NextToken?: String;
  }
  export interface GetUpgradeHistoryRequest {
    DomainName: DomainName;
    MaxResults?: MaxResults;
    NextToken?: NextToken;
  }
  export interface GetUpgradeHistoryResponse {
    /**
     *  A list of  UpgradeHistory  objects corresponding to each upgrade or upgrade eligibility check performed on a domain returned as part of the  GetUpgradeHistoryResponse  object. 
     */
    UpgradeHistories?: UpgradeHistoryList;
    /**
     * Pagination token that needs to be supplied to the next call to get the next page of results.
     */
    NextToken?: String;
  }
  export interface GetUpgradeStatusRequest {
    DomainName: DomainName;
  }
  export interface GetUpgradeStatusResponse {
    /**
     *  One of three steps an upgrade or upgrade eligibility check goes through:  PreUpgradeCheck Snapshot Upgrade  
     */
    UpgradeStep?: UpgradeStep;
    /**
     *  One of four statuses an upgrade have, returned as part of the  GetUpgradeStatusResponse  object. The status can take one of the following values:  In Progress Succeeded Succeeded with Issues Failed  
     */
    StepStatus?: UpgradeStatus;
    /**
     * A string that briefly describes the update.
     */
    UpgradeName?: UpgradeName;
  }
  export type IdentityPoolId = string;
  export interface InboundConnection {
    /**
     * The  AWSDomainInformation  for the local OpenSearch domain. 
     */
    LocalDomainInfo?: DomainInformationContainer;
    /**
     * The  AWSDomainInformation  for the remote OpenSearch domain. 
     */
    RemoteDomainInfo?: DomainInformationContainer;
    /**
     * The connection ID for the inbound cross-cluster connection.
     */
    ConnectionId?: ConnectionId;
    /**
     * The  InboundConnectionStatus  for the outbound connection. 
     */
    ConnectionStatus?: InboundConnectionStatus;
  }
  export interface InboundConnectionStatus {
    /**
     * The state code for the inbound connection. Can be one of the following:  PENDING_ACCEPTANCE: Inbound connection is not yet accepted by the remote domain owner. APPROVED: Inbound connection is pending acceptance by the remote domain owner. PROVISIONING: Inbound connection provisioning is in progress. ACTIVE: Inbound connection is active and ready to use. REJECTING: Inbound connection rejection is in process. REJECTED: Inbound connection is rejected. DELETING: Inbound connection deletion is in progress. DELETED: Inbound connection is deleted and can no longer be used. 
     */
    StatusCode?: InboundConnectionStatusCode;
    /**
     * Verbose information for the inbound connection status.
     */
    Message?: ConnectionStatusMessage;
  }
  export type InboundConnectionStatusCode = "PENDING_ACCEPTANCE"|"APPROVED"|"PROVISIONING"|"ACTIVE"|"REJECTING"|"REJECTED"|"DELETING"|"DELETED"|string;
  export type InboundConnections = InboundConnection[];
  export type InstanceCount = number;
  export interface InstanceCountLimits {
    MinimumInstanceCount?: MinimumInstanceCount;
    MaximumInstanceCount?: MaximumInstanceCount;
  }
  export interface InstanceLimits {
    InstanceCountLimits?: InstanceCountLimits;
  }
  export type InstanceRole = string;
  export type InstanceRoleList = InstanceRole[];
  export interface InstanceTypeDetails {
    InstanceType?: OpenSearchPartitionInstanceType;
    EncryptionEnabled?: Boolean;
    CognitoEnabled?: Boolean;
    AppLogsEnabled?: Boolean;
    AdvancedSecurityEnabled?: Boolean;
    WarmEnabled?: Boolean;
    InstanceRole?: InstanceRoleList;
  }
  export type InstanceTypeDetailsList = InstanceTypeDetails[];
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
     * Storage-related types and attributes that are available for a given InstanceType. 
     */
    StorageTypes?: StorageTypeList;
    InstanceLimits?: InstanceLimits;
    /**
     *  List of additional limits that are specific to a given InstanceType and for each of its  InstanceRole  . 
     */
    AdditionalLimits?: AdditionalLimitList;
  }
  export type LimitsByRole = {[key: string]: Limits};
  export interface ListDomainNamesRequest {
    /**
     *  Optional parameter to filter the output by domain engine type. Acceptable values are 'Elasticsearch' and 'OpenSearch'. 
     */
    EngineType?: EngineType;
  }
  export interface ListDomainNamesResponse {
    /**
     * List of domain names and respective engine types.
     */
    DomainNames?: DomainInfoList;
  }
  export interface ListDomainsForPackageRequest {
    /**
     * The package for which to list associated domains.
     */
    PackageID: PackageID;
    /**
     * Limits the results to a maximum number of domains.
     */
    MaxResults?: MaxResults;
    /**
     * Used for pagination. Only necessary if a previous API call includes a non-null NextToken value. If provided, returns results for the next page. 
     */
    NextToken?: NextToken;
  }
  export interface ListDomainsForPackageResponse {
    /**
     * List of DomainPackageDetails objects. 
     */
    DomainPackageDetailsList?: DomainPackageDetailsList;
    NextToken?: String;
  }
  export interface ListInstanceTypeDetailsRequest {
    EngineVersion: VersionString;
    DomainName?: DomainName;
    MaxResults?: MaxResults;
    NextToken?: NextToken;
  }
  export interface ListInstanceTypeDetailsResponse {
    InstanceTypeDetails?: InstanceTypeDetailsList;
    NextToken?: NextToken;
  }
  export interface ListPackagesForDomainRequest {
    /**
     * The name of the domain for which you want to list associated packages.
     */
    DomainName: DomainName;
    /**
     * Limits results to a maximum number of packages.
     */
    MaxResults?: MaxResults;
    /**
     * Used for pagination. Only necessary if a previous API call includes a non-null NextToken value. If provided, returns results for the next page. 
     */
    NextToken?: NextToken;
  }
  export interface ListPackagesForDomainResponse {
    /**
     * List of DomainPackageDetails objects. 
     */
    DomainPackageDetailsList?: DomainPackageDetailsList;
    /**
     * Pagination token to supply to the next call to get the next page of results.
     */
    NextToken?: String;
  }
  export interface ListTagsRequest {
    /**
     * Specify the ARN of the domain that the tags you want to view are attached to. 
     */
    ARN: ARN;
  }
  export interface ListTagsResponse {
    /**
     * List of Tag for the requested domain. 
     */
    TagList?: TagList;
  }
  export interface ListVersionsRequest {
    /**
     *  Set this value to limit the number of results returned. Value must be greater than 10 or it won't be honored. 
     */
    MaxResults?: MaxResults;
    NextToken?: NextToken;
  }
  export interface ListVersionsResponse {
    Versions?: VersionList;
    NextToken?: NextToken;
  }
  export interface LogPublishingOption {
    CloudWatchLogsLogGroupArn?: CloudWatchLogsLogGroupArn;
    /**
     * Whether the given log publishing option is enabled or not.
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
     * The status of the log publishing options for the domain. See OptionStatus for the status information that's included. 
     */
    Status?: OptionStatus;
  }
  export type LogType = "INDEX_SLOW_LOGS"|"SEARCH_SLOW_LOGS"|"ES_APPLICATION_LOGS"|"AUDIT_LOGS"|string;
  export type Long = number;
  export interface MasterUserOptions {
    /**
     * ARN for the master user (if IAM is enabled).
     */
    MasterUserARN?: ARN;
    /**
     * The master user's username, which is stored in the Amazon OpenSearch Service domain's internal database.
     */
    MasterUserName?: Username;
    /**
     * The master user's password, which is stored in the Amazon OpenSearch Service domain's internal database.
     */
    MasterUserPassword?: Password;
  }
  export type MaxResults = number;
  export type MaximumInstanceCount = number;
  export type MinimumInstanceCount = number;
  export type NextToken = string;
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
  export type NonEmptyString = string;
  export type OpenSearchPartitionInstanceType = "m3.medium.search"|"m3.large.search"|"m3.xlarge.search"|"m3.2xlarge.search"|"m4.large.search"|"m4.xlarge.search"|"m4.2xlarge.search"|"m4.4xlarge.search"|"m4.10xlarge.search"|"m5.large.search"|"m5.xlarge.search"|"m5.2xlarge.search"|"m5.4xlarge.search"|"m5.12xlarge.search"|"m5.24xlarge.search"|"r5.large.search"|"r5.xlarge.search"|"r5.2xlarge.search"|"r5.4xlarge.search"|"r5.12xlarge.search"|"r5.24xlarge.search"|"c5.large.search"|"c5.xlarge.search"|"c5.2xlarge.search"|"c5.4xlarge.search"|"c5.9xlarge.search"|"c5.18xlarge.search"|"t3.nano.search"|"t3.micro.search"|"t3.small.search"|"t3.medium.search"|"t3.large.search"|"t3.xlarge.search"|"t3.2xlarge.search"|"ultrawarm1.medium.search"|"ultrawarm1.large.search"|"ultrawarm1.xlarge.search"|"t2.micro.search"|"t2.small.search"|"t2.medium.search"|"r3.large.search"|"r3.xlarge.search"|"r3.2xlarge.search"|"r3.4xlarge.search"|"r3.8xlarge.search"|"i2.xlarge.search"|"i2.2xlarge.search"|"d2.xlarge.search"|"d2.2xlarge.search"|"d2.4xlarge.search"|"d2.8xlarge.search"|"c4.large.search"|"c4.xlarge.search"|"c4.2xlarge.search"|"c4.4xlarge.search"|"c4.8xlarge.search"|"r4.large.search"|"r4.xlarge.search"|"r4.2xlarge.search"|"r4.4xlarge.search"|"r4.8xlarge.search"|"r4.16xlarge.search"|"i3.large.search"|"i3.xlarge.search"|"i3.2xlarge.search"|"i3.4xlarge.search"|"i3.8xlarge.search"|"i3.16xlarge.search"|"r6g.large.search"|"r6g.xlarge.search"|"r6g.2xlarge.search"|"r6g.4xlarge.search"|"r6g.8xlarge.search"|"r6g.12xlarge.search"|"m6g.large.search"|"m6g.xlarge.search"|"m6g.2xlarge.search"|"m6g.4xlarge.search"|"m6g.8xlarge.search"|"m6g.12xlarge.search"|"c6g.large.search"|"c6g.xlarge.search"|"c6g.2xlarge.search"|"c6g.4xlarge.search"|"c6g.8xlarge.search"|"c6g.12xlarge.search"|"r6gd.large.search"|"r6gd.xlarge.search"|"r6gd.2xlarge.search"|"r6gd.4xlarge.search"|"r6gd.8xlarge.search"|"r6gd.12xlarge.search"|"r6gd.16xlarge.search"|"t4g.small.search"|"t4g.medium.search"|string;
  export type OpenSearchWarmPartitionInstanceType = "ultrawarm1.medium.search"|"ultrawarm1.large.search"|"ultrawarm1.xlarge.search"|string;
  export type OptionState = "RequiresIndexDocuments"|"Processing"|"Active"|string;
  export interface OptionStatus {
    /**
     * The timestamp of when the entity was created.
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
     * Provides the OptionState for the domain. 
     */
    State: OptionState;
    /**
     * Indicates whether the domain is being deleted.
     */
    PendingDeletion?: Boolean;
  }
  export interface OutboundConnection {
    /**
     * The  DomainInformation  for the local OpenSearch domain. 
     */
    LocalDomainInfo?: DomainInformationContainer;
    /**
     * The  DomainInformation  for the remote OpenSearch domain. 
     */
    RemoteDomainInfo?: DomainInformationContainer;
    /**
     * The connection ID for the outbound cross-cluster connection.
     */
    ConnectionId?: ConnectionId;
    /**
     * The connection alias for the outbound cross-cluster connection.
     */
    ConnectionAlias?: ConnectionAlias;
    /**
     * The  OutboundConnectionStatus  for the outbound connection. 
     */
    ConnectionStatus?: OutboundConnectionStatus;
  }
  export interface OutboundConnectionStatus {
    /**
     * The state code for the outbound connection. Can be one of the following:  VALIDATING: The outbound connection request is being validated. VALIDATION_FAILED: Validation failed for the connection request. PENDING_ACCEPTANCE: Outbound connection request is validated and is not yet accepted by the remote domain owner.  APPROVED: Outbound connection has been approved by the remote domain owner for getting provisioned. PROVISIONING: Outbound connection request is in process. ACTIVE: Outbound connection is active and ready to use. REJECTING: Outbound connection rejection by remote domain owner is in progress. REJECTED: Outbound connection request is rejected by remote domain owner. DELETING: Outbound connection deletion is in progress. DELETED: Outbound connection is deleted and can no longer be used. 
     */
    StatusCode?: OutboundConnectionStatusCode;
    /**
     * Verbose information for the outbound connection status.
     */
    Message?: ConnectionStatusMessage;
  }
  export type OutboundConnectionStatusCode = "VALIDATING"|"VALIDATION_FAILED"|"PENDING_ACCEPTANCE"|"APPROVED"|"PROVISIONING"|"ACTIVE"|"REJECTING"|"REJECTED"|"DELETING"|"DELETED"|string;
  export type OutboundConnections = OutboundConnection[];
  export type OwnerId = string;
  export type PackageDescription = string;
  export interface PackageDetails {
    /**
     * Internal ID of the package.
     */
    PackageID?: PackageID;
    /**
     * User-specified name of the package.
     */
    PackageName?: PackageName;
    /**
     * Currently supports only TXT-DICTIONARY.
     */
    PackageType?: PackageType;
    /**
     * User-specified description of the package.
     */
    PackageDescription?: PackageDescription;
    /**
     * Current state of the package. Values are COPYING, COPY_FAILED, AVAILABLE, DELETING, and DELETE_FAILED.
     */
    PackageStatus?: PackageStatus;
    /**
     * The timestamp of when the package was created.
     */
    CreatedAt?: CreatedAt;
    LastUpdatedAt?: LastUpdated;
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
     * A message associated with the package version.
     */
    CommitMessage?: CommitMessage;
    /**
     * The timestamp of when the package was created.
     */
    CreatedAt?: CreatedAt;
  }
  export type PackageVersionHistoryList = PackageVersionHistory[];
  export type Password = string;
  export type PolicyDocument = string;
  export interface PurchaseReservedInstanceOfferingRequest {
    /**
     * The ID of the reserved OpenSearch instance offering to purchase.
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
     * Details of the reserved OpenSearch instance which was purchased.
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
     * The ID of the inbound connection to reject.
     */
    ConnectionId: ConnectionId;
  }
  export interface RejectInboundConnectionResponse {
    /**
     * The  InboundConnection  of the rejected inbound connection. 
     */
    Connection?: InboundConnection;
  }
  export interface RemoveTagsRequest {
    /**
     * The ARN of the domain from which you want to delete the specified tags. 
     */
    ARN: ARN;
    /**
     * The TagKey list you want to remove from the domain. 
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
    BillingSubscriptionId?: Long;
    /**
     * The offering identifier.
     */
    ReservedInstanceOfferingId?: String;
    /**
     * The OpenSearch instance type offered by the reserved instance offering.
     */
    InstanceType?: OpenSearchPartitionInstanceType;
    /**
     * The time the reservation started.
     */
    StartTime?: UpdateTimestamp;
    /**
     * The duration, in seconds, for which the OpenSearch instance is reserved.
     */
    Duration?: Integer;
    /**
     * The upfront fixed charge you will paid to purchase the specific reserved OpenSearch instance offering.
     */
    FixedPrice?: Double;
    /**
     * The rate you are charged for each hour for the domain that is using this reserved instance.
     */
    UsagePrice?: Double;
    /**
     * The currency code for the reserved OpenSearch instance offering.
     */
    CurrencyCode?: String;
    /**
     * The number of OpenSearch instances that have been reserved.
     */
    InstanceCount?: Integer;
    /**
     * The state of the reserved OpenSearch instance.
     */
    State?: String;
    /**
     * The payment option as defined in the reserved OpenSearch instance offering.
     */
    PaymentOption?: ReservedInstancePaymentOption;
    /**
     * The charge to your account regardless of whether you are creating any domains using the instance offering.
     */
    RecurringCharges?: RecurringChargeList;
  }
  export type ReservedInstanceList = ReservedInstance[];
  export interface ReservedInstanceOffering {
    /**
     * The OpenSearch reserved instance offering identifier.
     */
    ReservedInstanceOfferingId?: GUID;
    /**
     * The OpenSearch instance type offered by the reserved instance offering.
     */
    InstanceType?: OpenSearchPartitionInstanceType;
    /**
     * The duration, in seconds, for which the offering will reserve the OpenSearch instance.
     */
    Duration?: Integer;
    /**
     * The upfront fixed charge you will pay to purchase the specific reserved OpenSearch instance offering.
     */
    FixedPrice?: Double;
    /**
     * The rate you are charged for each hour the domain that is using the offering is running.
     */
    UsagePrice?: Double;
    /**
     * The currency code for the reserved OpenSearch instance offering.
     */
    CurrencyCode?: String;
    /**
     * Payment option for the reserved OpenSearch instance offering
     */
    PaymentOption?: ReservedInstancePaymentOption;
    /**
     * The charge to your account regardless of whether you are creating any domains using the instance offering.
     */
    RecurringCharges?: RecurringChargeList;
  }
  export type ReservedInstanceOfferingList = ReservedInstanceOffering[];
  export type ReservedInstancePaymentOption = "ALL_UPFRONT"|"PARTIAL_UPFRONT"|"NO_UPFRONT"|string;
  export type RoleArn = string;
  export type RollbackOnDisable = "NO_ROLLBACK"|"DEFAULT_ROLLBACK"|string;
  export type S3BucketName = string;
  export type S3Key = string;
  export type SAMLEntityId = string;
  export interface SAMLIdp {
    /**
     * The metadata of the SAML application in XML format.
     */
    MetadataContent: SAMLMetadata;
    /**
     * The unique entity ID of the application in SAML identity provider.
     */
    EntityId: SAMLEntityId;
  }
  export type SAMLMetadata = string;
  export interface SAMLOptionsInput {
    /**
     * True if SAML is enabled.
     */
    Enabled?: Boolean;
    /**
     * The SAML Identity Provider's information.
     */
    Idp?: SAMLIdp;
    /**
     * The SAML master username, which is stored in the Amazon OpenSearch Service domain's internal database.
     */
    MasterUserName?: Username;
    /**
     * The backend role that the SAML master user is mapped to.
     */
    MasterBackendRole?: BackendRole;
    /**
     * Element of the SAML assertion to use for username. Default is NameID.
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
  export type ScheduledAutoTuneActionType = "JVM_HEAP_SIZE_TUNING"|"JVM_YOUNG_GEN_TUNING"|string;
  export type ScheduledAutoTuneDescription = string;
  export interface ScheduledAutoTuneDetails {
    /**
     * The timestamp of the Auto-Tune action scheduled for the domain.
     */
    Date?: AutoTuneDate;
    /**
     * The Auto-Tune action type. Valid values are JVM_HEAP_SIZE_TUNING and JVM_YOUNG_GEN_TUNING.
     */
    ActionType?: ScheduledAutoTuneActionType;
    /**
     * The Auto-Tune action description.
     */
    Action?: ScheduledAutoTuneDescription;
    /**
     * The Auto-Tune action severity. Valid values are LOW, MEDIUM, and HIGH.
     */
    Severity?: ScheduledAutoTuneSeverityType;
  }
  export type ScheduledAutoTuneSeverityType = "LOW"|"MEDIUM"|"HIGH"|string;
  export interface ServiceSoftwareOptions {
    /**
     * The current service software version present on the domain.
     */
    CurrentVersion?: String;
    /**
     * The new service software version if one is available.
     */
    NewVersion?: String;
    /**
     *  True if you're able to update your service software version. False if you can't update your service software version. 
     */
    UpdateAvailable?: Boolean;
    /**
     *  True if you're able to cancel your service software version update. False if you can't cancel your service software update. 
     */
    Cancellable?: Boolean;
    /**
     * The status of your service software update. This field can take the following values:  ELIGIBLE, PENDING_UPDATE, IN_PROGRESS, COMPLETED, and  NOT_ELIGIBLE. 
     */
    UpdateStatus?: DeploymentStatus;
    /**
     * The description of the UpdateStatus. 
     */
    Description?: String;
    /**
     * The timestamp, in Epoch time, until which you can manually request a service software update. After this date, we automatically update your service software. 
     */
    AutomatedUpdateDate?: DeploymentCloseDateTimeStamp;
    /**
     *  True if a service software is never automatically updated. False if a service software is automatically updated after AutomatedUpdateDate. 
     */
    OptionalDeployment?: Boolean;
  }
  export type ServiceUrl = string;
  export interface SnapshotOptions {
    /**
     * The time, in UTC format, when the service takes a daily automated snapshot of the specified domain. Default is 0 hours. 
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
  export type StartAt = Date;
  export interface StartServiceSoftwareUpdateRequest {
    /**
     * The name of the domain that you want to update to the latest service software.
     */
    DomainName: DomainName;
  }
  export interface StartServiceSoftwareUpdateResponse {
    /**
     * The current status of the OpenSearch service software update.
     */
    ServiceSoftwareOptions?: ServiceSoftwareOptions;
  }
  export type StartTimestamp = Date;
  export type StorageSubTypeName = string;
  export interface StorageType {
    StorageTypeName?: StorageTypeName;
    StorageSubTypeName?: StorageSubTypeName;
    /**
     * Limits that are applicable for the given storage type. 
     */
    StorageTypeLimits?: StorageTypeLimitList;
  }
  export interface StorageTypeLimit {
    /**
     *  Name of storage limits that are applicable for the given storage type. If  StorageType  is "ebs", the following storage options are applicable:  MinimumVolumeSize Minimum amount of volume size that is applicable for the given storage type. Can be empty if not applicable. MaximumVolumeSize Maximum amount of volume size that is applicable for the given storage type. Can be empty if not applicable. MaximumIops Maximum amount of Iops that is applicable for given the storage type. Can be empty if not applicable. MinimumIops Minimum amount of Iops that is applicable for given the storage type. Can be empty if not applicable.  
     */
    LimitName?: LimitName;
    /**
     *  Values for the  StorageTypeLimit$LimitName  . 
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
     * The TagKey, the name of the tag. Tag keys must be unique for the domain to which they are attached. 
     */
    Key: TagKey;
    /**
     * The TagValue, the value assigned to the corresponding tag key. Tag values can be null and don't have to be unique in a tag set. For example, you can have a key value pair in a tag set of project : Trinity and cost-center : Trinity 
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagList = Tag[];
  export type TagValue = string;
  export type TimeUnit = "HOURS"|string;
  export type UIntValue = number;
  export interface UpdateDomainConfigRequest {
    /**
     * The name of the domain you're updating.
     */
    DomainName: DomainName;
    /**
     * The type and number of instances to instantiate for the domain cluster.
     */
    ClusterConfig?: ClusterConfig;
    /**
     * Specify the type and size of the EBS volume to use.
     */
    EBSOptions?: EBSOptions;
    /**
     * Option to set the time, in UTC format, for the daily automated snapshot. Default value is 0 hours. 
     */
    SnapshotOptions?: SnapshotOptions;
    /**
     * Options to specify the subnets and security groups for the VPC endpoint. For more information, see Launching your Amazon OpenSearch Service domains using a VPC . 
     */
    VPCOptions?: VPCOptions;
    /**
     * Options to specify the Cognito user and identity pools for OpenSearch Dashboards authentication. For more information, see Configuring Amazon Cognito authentication for OpenSearch Dashboards. 
     */
    CognitoOptions?: CognitoOptions;
    /**
     * Modifies the advanced option to allow references to indices in an HTTP request body. Must be false when configuring access to individual sub-resources. By default, the value is true. See Advanced options  for more information. 
     */
    AdvancedOptions?: AdvancedOptions;
    /**
     * IAM access policy as a JSON-formatted string.
     */
    AccessPolicies?: PolicyDocument;
    /**
     * Map of LogType and LogPublishingOption, each containing options to publish a given type of OpenSearch log. 
     */
    LogPublishingOptions?: LogPublishingOptions;
    /**
     * Specifies encryption of data at rest options.
     */
    EncryptionAtRestOptions?: EncryptionAtRestOptions;
    /**
     * Options to specify configuration that will be applied to the domain endpoint.
     */
    DomainEndpointOptions?: DomainEndpointOptions;
    /**
     * Specifies node-to-node encryption options.
     */
    NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptions;
    /**
     * Specifies advanced security options.
     */
    AdvancedSecurityOptions?: AdvancedSecurityOptionsInput;
    /**
     * Specifies Auto-Tune options.
     */
    AutoTuneOptions?: AutoTuneOptions;
  }
  export interface UpdateDomainConfigResponse {
    /**
     * The status of the updated domain.
     */
    DomainConfig: DomainConfig;
  }
  export interface UpdatePackageRequest {
    /**
     * The unique identifier for the package.
     */
    PackageID: PackageID;
    PackageSource: PackageSource;
    /**
     * A new description of the package.
     */
    PackageDescription?: PackageDescription;
    /**
     * A commit message for the new version which is shown as part of GetPackageVersionHistoryResponse. 
     */
    CommitMessage?: CommitMessage;
  }
  export interface UpdatePackageResponse {
    /**
     * Information about the package. 
     */
    PackageDetails?: PackageDetails;
  }
  export type UpdateTimestamp = Date;
  export interface UpgradeDomainRequest {
    DomainName: DomainName;
    /**
     * The version of OpenSearch you intend to upgrade the domain to.
     */
    TargetVersion: VersionString;
    /**
     *  When true, indicates that an upgrade eligibility check needs to be performed. Does not actually perform the upgrade. 
     */
    PerformCheckOnly?: Boolean;
    AdvancedOptions?: AdvancedOptions;
  }
  export interface UpgradeDomainResponse {
    UpgradeId?: String;
    DomainName?: DomainName;
    /**
     * The version of OpenSearch that you intend to upgrade the domain to.
     */
    TargetVersion?: VersionString;
    /**
     *  When true, indicates that an upgrade eligibility check needs to be performed. Does not actually perform the upgrade. 
     */
    PerformCheckOnly?: Boolean;
    AdvancedOptions?: AdvancedOptions;
  }
  export interface UpgradeHistory {
    /**
     * A string that briefly describes the upgrade.
     */
    UpgradeName?: UpgradeName;
    /**
     * UTC timestamp at which the upgrade API call was made in "yyyy-MM-ddTHH:mm:ssZ" format.
     */
    StartTimestamp?: StartTimestamp;
    /**
     *  The current status of the upgrade. The status can take one of the following values:  In Progress Succeeded Succeeded with Issues Failed  
     */
    UpgradeStatus?: UpgradeStatus;
    /**
     *  A list of  UpgradeStepItem  s representing information about each step performed as part of a specific upgrade or upgrade eligibility check. 
     */
    StepsList?: UpgradeStepsList;
  }
  export type UpgradeHistoryList = UpgradeHistory[];
  export type UpgradeName = string;
  export type UpgradeStatus = "IN_PROGRESS"|"SUCCEEDED"|"SUCCEEDED_WITH_ISSUES"|"FAILED"|string;
  export type UpgradeStep = "PRE_UPGRADE_CHECK"|"SNAPSHOT"|"UPGRADE"|string;
  export interface UpgradeStepItem {
    /**
     *  One of three steps an upgrade or upgrade eligibility check goes through:  PreUpgradeCheck Snapshot Upgrade  
     */
    UpgradeStep?: UpgradeStep;
    /**
     *  The current status of the upgrade. The status can take one of the following values:  In Progress Succeeded Succeeded with Issues Failed  
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
     * The VPC ID for the domain. Exists only if the domain was created with VPCOptions.
     */
    VPCId?: String;
    /**
     * The subnets for the VPC endpoint.
     */
    SubnetIds?: StringList;
    /**
     * The Availability Zones for the domain. Exists only if the domain was created with VPCOptions.
     */
    AvailabilityZones?: StringList;
    /**
     * The security groups for the VPC endpoint.
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
     * The subnets for the VPC endpoint.
     */
    SubnetIds?: StringList;
    /**
     * The security groups for the VPC endpoint.
     */
    SecurityGroupIds?: StringList;
  }
  export type ValueStringList = NonEmptyString[];
  export type VersionList = VersionString[];
  export interface VersionStatus {
    /**
     * The OpenSearch version for the specified OpenSearch domain.
     */
    Options: VersionString;
    /**
     * The status of the OpenSearch version options for the specified OpenSearch domain.
     */
    Status: OptionStatus;
  }
  export type VersionString = string;
  export type VolumeType = "standard"|"gp2"|"io1"|string;
  export interface ZoneAwarenessConfig {
    /**
     * An integer value to indicate the number of availability zones for a domain when zone awareness is enabled. This should be equal to number of subnets if VPC endpoints is enabled. 
     */
    AvailabilityZoneCount?: IntegerClass;
  }
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
