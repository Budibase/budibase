import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class LicenseManagerLinuxSubscriptions extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: LicenseManagerLinuxSubscriptions.Types.ClientConfiguration)
  config: Config & LicenseManagerLinuxSubscriptions.Types.ClientConfiguration;
  /**
   * Lists the Linux subscriptions service settings.
   */
  getServiceSettings(params: LicenseManagerLinuxSubscriptions.Types.GetServiceSettingsRequest, callback?: (err: AWSError, data: LicenseManagerLinuxSubscriptions.Types.GetServiceSettingsResponse) => void): Request<LicenseManagerLinuxSubscriptions.Types.GetServiceSettingsResponse, AWSError>;
  /**
   * Lists the Linux subscriptions service settings.
   */
  getServiceSettings(callback?: (err: AWSError, data: LicenseManagerLinuxSubscriptions.Types.GetServiceSettingsResponse) => void): Request<LicenseManagerLinuxSubscriptions.Types.GetServiceSettingsResponse, AWSError>;
  /**
   * Lists the running Amazon EC2 instances that were discovered with commercial Linux subscriptions.
   */
  listLinuxSubscriptionInstances(params: LicenseManagerLinuxSubscriptions.Types.ListLinuxSubscriptionInstancesRequest, callback?: (err: AWSError, data: LicenseManagerLinuxSubscriptions.Types.ListLinuxSubscriptionInstancesResponse) => void): Request<LicenseManagerLinuxSubscriptions.Types.ListLinuxSubscriptionInstancesResponse, AWSError>;
  /**
   * Lists the running Amazon EC2 instances that were discovered with commercial Linux subscriptions.
   */
  listLinuxSubscriptionInstances(callback?: (err: AWSError, data: LicenseManagerLinuxSubscriptions.Types.ListLinuxSubscriptionInstancesResponse) => void): Request<LicenseManagerLinuxSubscriptions.Types.ListLinuxSubscriptionInstancesResponse, AWSError>;
  /**
   * Lists the Linux subscriptions that have been discovered. If you have linked your organization, the returned results will include data aggregated across your accounts in Organizations.
   */
  listLinuxSubscriptions(params: LicenseManagerLinuxSubscriptions.Types.ListLinuxSubscriptionsRequest, callback?: (err: AWSError, data: LicenseManagerLinuxSubscriptions.Types.ListLinuxSubscriptionsResponse) => void): Request<LicenseManagerLinuxSubscriptions.Types.ListLinuxSubscriptionsResponse, AWSError>;
  /**
   * Lists the Linux subscriptions that have been discovered. If you have linked your organization, the returned results will include data aggregated across your accounts in Organizations.
   */
  listLinuxSubscriptions(callback?: (err: AWSError, data: LicenseManagerLinuxSubscriptions.Types.ListLinuxSubscriptionsResponse) => void): Request<LicenseManagerLinuxSubscriptions.Types.ListLinuxSubscriptionsResponse, AWSError>;
  /**
   * Updates the service settings for Linux subscriptions.
   */
  updateServiceSettings(params: LicenseManagerLinuxSubscriptions.Types.UpdateServiceSettingsRequest, callback?: (err: AWSError, data: LicenseManagerLinuxSubscriptions.Types.UpdateServiceSettingsResponse) => void): Request<LicenseManagerLinuxSubscriptions.Types.UpdateServiceSettingsResponse, AWSError>;
  /**
   * Updates the service settings for Linux subscriptions.
   */
  updateServiceSettings(callback?: (err: AWSError, data: LicenseManagerLinuxSubscriptions.Types.UpdateServiceSettingsResponse) => void): Request<LicenseManagerLinuxSubscriptions.Types.UpdateServiceSettingsResponse, AWSError>;
}
declare namespace LicenseManagerLinuxSubscriptions {
  export type Boolean = boolean;
  export type BoxInteger = number;
  export type BoxLong = number;
  export interface Filter {
    /**
     * The type of name to filter by.
     */
    Name?: String;
    /**
     * An operator for filtering results.
     */
    Operator?: Operator;
    /**
     * One or more values for the name to filter by.
     */
    Values?: StringList;
  }
  export type FilterList = Filter[];
  export interface GetServiceSettingsRequest {
  }
  export interface GetServiceSettingsResponse {
    /**
     * The Region in which License Manager displays the aggregated data for Linux subscriptions.
     */
    HomeRegions?: StringList;
    /**
     * Lists if discovery has been enabled for Linux subscriptions.
     */
    LinuxSubscriptionsDiscovery?: LinuxSubscriptionsDiscovery;
    /**
     * Lists the settings defined for Linux subscriptions discovery. The settings include if Organizations integration has been enabled, and which Regions data will be aggregated from.
     */
    LinuxSubscriptionsDiscoverySettings?: LinuxSubscriptionsDiscoverySettings;
    /**
     * Indicates the status of Linux subscriptions settings being applied.
     */
    Status?: Status;
    /**
     * A message which details the Linux subscriptions service settings current status.
     */
    StatusMessage?: StringMap;
  }
  export interface Instance {
    /**
     * The account ID which owns the instance.
     */
    AccountID?: String;
    /**
     * The AMI ID used to launch the instance.
     */
    AmiId?: String;
    /**
     * The instance ID of the resource.
     */
    InstanceID?: String;
    /**
     * The instance type of the resource.
     */
    InstanceType?: String;
    /**
     * The time in which the last discovery updated the instance details.
     */
    LastUpdatedTime?: String;
    /**
     * The product code for the instance. For more information, see Usage operation values in the License Manager User Guide .
     */
    ProductCode?: ProductCodeList;
    /**
     * The Region the instance is running in.
     */
    Region?: String;
    /**
     * The status of the instance.
     */
    Status?: String;
    /**
     * The name of the subscription being used by the instance.
     */
    SubscriptionName?: String;
    /**
     * The usage operation of the instance. For more information, see For more information, see Usage operation values in the License Manager User Guide.
     */
    UsageOperation?: String;
  }
  export type InstanceList = Instance[];
  export type LinuxSubscriptionsDiscovery = "Enabled"|"Disabled"|string;
  export interface LinuxSubscriptionsDiscoverySettings {
    /**
     * Details if you have enabled resource discovery across your accounts in Organizations.
     */
    OrganizationIntegration: OrganizationIntegration;
    /**
     * The Regions in which to discover data for Linux subscriptions.
     */
    SourceRegions: StringList;
  }
  export interface ListLinuxSubscriptionInstancesRequest {
    /**
     * An array of structures that you can use to filter the results to those that match one or more sets of key-value pairs that you specify. For example, you can filter by the name of AmiID with an optional operator to see subscriptions that match, partially match, or don't match a certain Amazon Machine Image (AMI) ID. The valid names for this filter are:    AmiID     InstanceID     AccountID     Status     Region     UsageOperation     ProductCode     InstanceType    The valid Operators for this filter are:    contains     equals     Notequal   
     */
    Filters?: FilterList;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     * Token for the next set of results.
     */
    NextToken?: ListLinuxSubscriptionInstancesRequestNextTokenString;
  }
  export type ListLinuxSubscriptionInstancesRequestNextTokenString = string;
  export interface ListLinuxSubscriptionInstancesResponse {
    /**
     * An array that contains instance objects.
     */
    Instances?: InstanceList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListLinuxSubscriptionsRequest {
    /**
     * An array of structures that you can use to filter the results to those that match one or more sets of key-value pairs that you specify. For example, you can filter by the name of Subscription with an optional operator to see subscriptions that match, partially match, or don't match a certain subscription's name. The valid names for this filter are:    Subscription    The valid Operators for this filter are:    contains     equals     Notequal   
     */
    Filters?: FilterList;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     * Token for the next set of results.
     */
    NextToken?: ListLinuxSubscriptionsRequestNextTokenString;
  }
  export type ListLinuxSubscriptionsRequestNextTokenString = string;
  export interface ListLinuxSubscriptionsResponse {
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * An array that contains subscription objects.
     */
    Subscriptions?: SubscriptionList;
  }
  export type Operator = "Equal"|"NotEqual"|"Contains"|string;
  export type OrganizationIntegration = "Enabled"|"Disabled"|string;
  export type ProductCodeList = String[];
  export type Status = "InProgress"|"Completed"|"Successful"|"Failed"|string;
  export type String = string;
  export type StringList = StringListMemberString[];
  export type StringListMemberString = string;
  export type StringMap = {[key: string]: String};
  export interface Subscription {
    /**
     * The total amount of running instances using this subscription.
     */
    InstanceCount?: BoxLong;
    /**
     * The name of the subscription.
     */
    Name?: String;
    /**
     * The type of subscription. The type can be subscription-included with Amazon EC2, Bring Your Own Subscription model (BYOS), or from the Amazon Web Services Marketplace. Certain subscriptions may use licensing from the Amazon Web Services Marketplace as well as OS licensing from Amazon EC2 or BYOS.
     */
    Type?: String;
  }
  export type SubscriptionList = Subscription[];
  export interface UpdateServiceSettingsRequest {
    /**
     * Describes if updates are allowed to the service settings for Linux subscriptions. If you allow updates, you can aggregate Linux subscription data in more than one home Region.
     */
    AllowUpdate?: Boolean;
    /**
     * Describes if the discovery of Linux subscriptions is enabled.
     */
    LinuxSubscriptionsDiscovery: LinuxSubscriptionsDiscovery;
    /**
     * The settings defined for Linux subscriptions discovery. The settings include if Organizations integration has been enabled, and which Regions data will be aggregated from.
     */
    LinuxSubscriptionsDiscoverySettings: LinuxSubscriptionsDiscoverySettings;
  }
  export interface UpdateServiceSettingsResponse {
    /**
     * The Region in which License Manager displays the aggregated data for Linux subscriptions.
     */
    HomeRegions?: StringList;
    /**
     * Lists if discovery has been enabled for Linux subscriptions.
     */
    LinuxSubscriptionsDiscovery?: LinuxSubscriptionsDiscovery;
    /**
     * The settings defined for Linux subscriptions discovery. The settings include if Organizations integration has been enabled, and which Regions data will be aggregated from.
     */
    LinuxSubscriptionsDiscoverySettings?: LinuxSubscriptionsDiscoverySettings;
    /**
     * Indicates the status of Linux subscriptions settings being applied.
     */
    Status?: Status;
    /**
     * A message which details the Linux subscriptions service settings current status.
     */
    StatusMessage?: StringMap;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-05-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the LicenseManagerLinuxSubscriptions client.
   */
  export import Types = LicenseManagerLinuxSubscriptions;
}
export = LicenseManagerLinuxSubscriptions;
