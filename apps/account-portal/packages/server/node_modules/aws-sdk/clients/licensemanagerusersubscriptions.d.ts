import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class LicenseManagerUserSubscriptions extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: LicenseManagerUserSubscriptions.Types.ClientConfiguration)
  config: Config & LicenseManagerUserSubscriptions.Types.ClientConfiguration;
  /**
   * Associates the user to an EC2 instance to utilize user-based subscriptions.  Your estimated bill for charges on the number of users and related costs will take 48 hours to appear for billing periods that haven't closed (marked as Pending billing status) in Amazon Web Services Billing. For more information, see Viewing your monthly charges in the Amazon Web Services Billing User Guide. 
   */
  associateUser(params: LicenseManagerUserSubscriptions.Types.AssociateUserRequest, callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.AssociateUserResponse) => void): Request<LicenseManagerUserSubscriptions.Types.AssociateUserResponse, AWSError>;
  /**
   * Associates the user to an EC2 instance to utilize user-based subscriptions.  Your estimated bill for charges on the number of users and related costs will take 48 hours to appear for billing periods that haven't closed (marked as Pending billing status) in Amazon Web Services Billing. For more information, see Viewing your monthly charges in the Amazon Web Services Billing User Guide. 
   */
  associateUser(callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.AssociateUserResponse) => void): Request<LicenseManagerUserSubscriptions.Types.AssociateUserResponse, AWSError>;
  /**
   * Deregisters the identity provider from providing user-based subscriptions.
   */
  deregisterIdentityProvider(params: LicenseManagerUserSubscriptions.Types.DeregisterIdentityProviderRequest, callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.DeregisterIdentityProviderResponse) => void): Request<LicenseManagerUserSubscriptions.Types.DeregisterIdentityProviderResponse, AWSError>;
  /**
   * Deregisters the identity provider from providing user-based subscriptions.
   */
  deregisterIdentityProvider(callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.DeregisterIdentityProviderResponse) => void): Request<LicenseManagerUserSubscriptions.Types.DeregisterIdentityProviderResponse, AWSError>;
  /**
   * Disassociates the user from an EC2 instance providing user-based subscriptions.
   */
  disassociateUser(params: LicenseManagerUserSubscriptions.Types.DisassociateUserRequest, callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.DisassociateUserResponse) => void): Request<LicenseManagerUserSubscriptions.Types.DisassociateUserResponse, AWSError>;
  /**
   * Disassociates the user from an EC2 instance providing user-based subscriptions.
   */
  disassociateUser(callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.DisassociateUserResponse) => void): Request<LicenseManagerUserSubscriptions.Types.DisassociateUserResponse, AWSError>;
  /**
   * Lists the identity providers for user-based subscriptions.
   */
  listIdentityProviders(params: LicenseManagerUserSubscriptions.Types.ListIdentityProvidersRequest, callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.ListIdentityProvidersResponse) => void): Request<LicenseManagerUserSubscriptions.Types.ListIdentityProvidersResponse, AWSError>;
  /**
   * Lists the identity providers for user-based subscriptions.
   */
  listIdentityProviders(callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.ListIdentityProvidersResponse) => void): Request<LicenseManagerUserSubscriptions.Types.ListIdentityProvidersResponse, AWSError>;
  /**
   * Lists the EC2 instances providing user-based subscriptions.
   */
  listInstances(params: LicenseManagerUserSubscriptions.Types.ListInstancesRequest, callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.ListInstancesResponse) => void): Request<LicenseManagerUserSubscriptions.Types.ListInstancesResponse, AWSError>;
  /**
   * Lists the EC2 instances providing user-based subscriptions.
   */
  listInstances(callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.ListInstancesResponse) => void): Request<LicenseManagerUserSubscriptions.Types.ListInstancesResponse, AWSError>;
  /**
   * Lists the user-based subscription products available from an identity provider.
   */
  listProductSubscriptions(params: LicenseManagerUserSubscriptions.Types.ListProductSubscriptionsRequest, callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.ListProductSubscriptionsResponse) => void): Request<LicenseManagerUserSubscriptions.Types.ListProductSubscriptionsResponse, AWSError>;
  /**
   * Lists the user-based subscription products available from an identity provider.
   */
  listProductSubscriptions(callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.ListProductSubscriptionsResponse) => void): Request<LicenseManagerUserSubscriptions.Types.ListProductSubscriptionsResponse, AWSError>;
  /**
   * Lists user associations for an identity provider.
   */
  listUserAssociations(params: LicenseManagerUserSubscriptions.Types.ListUserAssociationsRequest, callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.ListUserAssociationsResponse) => void): Request<LicenseManagerUserSubscriptions.Types.ListUserAssociationsResponse, AWSError>;
  /**
   * Lists user associations for an identity provider.
   */
  listUserAssociations(callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.ListUserAssociationsResponse) => void): Request<LicenseManagerUserSubscriptions.Types.ListUserAssociationsResponse, AWSError>;
  /**
   * Registers an identity provider for user-based subscriptions.
   */
  registerIdentityProvider(params: LicenseManagerUserSubscriptions.Types.RegisterIdentityProviderRequest, callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.RegisterIdentityProviderResponse) => void): Request<LicenseManagerUserSubscriptions.Types.RegisterIdentityProviderResponse, AWSError>;
  /**
   * Registers an identity provider for user-based subscriptions.
   */
  registerIdentityProvider(callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.RegisterIdentityProviderResponse) => void): Request<LicenseManagerUserSubscriptions.Types.RegisterIdentityProviderResponse, AWSError>;
  /**
   * Starts a product subscription for a user with the specified identity provider.  Your estimated bill for charges on the number of users and related costs will take 48 hours to appear for billing periods that haven't closed (marked as Pending billing status) in Amazon Web Services Billing. For more information, see Viewing your monthly charges in the Amazon Web Services Billing User Guide. 
   */
  startProductSubscription(params: LicenseManagerUserSubscriptions.Types.StartProductSubscriptionRequest, callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.StartProductSubscriptionResponse) => void): Request<LicenseManagerUserSubscriptions.Types.StartProductSubscriptionResponse, AWSError>;
  /**
   * Starts a product subscription for a user with the specified identity provider.  Your estimated bill for charges on the number of users and related costs will take 48 hours to appear for billing periods that haven't closed (marked as Pending billing status) in Amazon Web Services Billing. For more information, see Viewing your monthly charges in the Amazon Web Services Billing User Guide. 
   */
  startProductSubscription(callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.StartProductSubscriptionResponse) => void): Request<LicenseManagerUserSubscriptions.Types.StartProductSubscriptionResponse, AWSError>;
  /**
   * Stops a product subscription for a user with the specified identity provider.
   */
  stopProductSubscription(params: LicenseManagerUserSubscriptions.Types.StopProductSubscriptionRequest, callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.StopProductSubscriptionResponse) => void): Request<LicenseManagerUserSubscriptions.Types.StopProductSubscriptionResponse, AWSError>;
  /**
   * Stops a product subscription for a user with the specified identity provider.
   */
  stopProductSubscription(callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.StopProductSubscriptionResponse) => void): Request<LicenseManagerUserSubscriptions.Types.StopProductSubscriptionResponse, AWSError>;
  /**
   * Updates additional product configuration settings for the registered identity provider.
   */
  updateIdentityProviderSettings(params: LicenseManagerUserSubscriptions.Types.UpdateIdentityProviderSettingsRequest, callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.UpdateIdentityProviderSettingsResponse) => void): Request<LicenseManagerUserSubscriptions.Types.UpdateIdentityProviderSettingsResponse, AWSError>;
  /**
   * Updates additional product configuration settings for the registered identity provider.
   */
  updateIdentityProviderSettings(callback?: (err: AWSError, data: LicenseManagerUserSubscriptions.Types.UpdateIdentityProviderSettingsResponse) => void): Request<LicenseManagerUserSubscriptions.Types.UpdateIdentityProviderSettingsResponse, AWSError>;
}
declare namespace LicenseManagerUserSubscriptions {
  export interface ActiveDirectoryIdentityProvider {
    /**
     * The directory ID for an Active Directory identity provider.
     */
    DirectoryId?: String;
  }
  export interface AssociateUserRequest {
    /**
     * The domain name of the user.
     */
    Domain?: String;
    /**
     * The identity provider of the user.
     */
    IdentityProvider: IdentityProvider;
    /**
     * The ID of the EC2 instance, which provides user-based subscriptions.
     */
    InstanceId: String;
    /**
     * The user name from the identity provider for the user.
     */
    Username: String;
  }
  export interface AssociateUserResponse {
    /**
     * Metadata that describes the associate user operation.
     */
    InstanceUserSummary: InstanceUserSummary;
  }
  export type BoxInteger = number;
  export interface DeregisterIdentityProviderRequest {
    /**
     * An object that specifies details for the identity provider.
     */
    IdentityProvider: IdentityProvider;
    /**
     * The name of the user-based subscription product.
     */
    Product: String;
  }
  export interface DeregisterIdentityProviderResponse {
    /**
     * Metadata that describes the results of an identity provider operation.
     */
    IdentityProviderSummary: IdentityProviderSummary;
  }
  export interface DisassociateUserRequest {
    /**
     * The domain name of the user.
     */
    Domain?: String;
    /**
     * An object that specifies details for the identity provider.
     */
    IdentityProvider: IdentityProvider;
    /**
     * The ID of the EC2 instance, which provides user-based subscriptions.
     */
    InstanceId: String;
    /**
     * The user name from the identity provider for the user.
     */
    Username: String;
  }
  export interface DisassociateUserResponse {
    /**
     * Metadata that describes the associate user operation.
     */
    InstanceUserSummary: InstanceUserSummary;
  }
  export interface Filter {
    /**
     * The name of an attribute to use as a filter.
     */
    Attribute?: String;
    /**
     * The type of search (For example, eq, geq, leq)
     */
    Operation?: String;
    /**
     * Value of the filter.
     */
    Value?: String;
  }
  export type FilterList = Filter[];
  export interface IdentityProvider {
    /**
     * An object that details an Active Directory identity provider.
     */
    ActiveDirectoryIdentityProvider?: ActiveDirectoryIdentityProvider;
  }
  export interface IdentityProviderSummary {
    /**
     * The failure message associated with an identity provider.
     */
    FailureMessage?: String;
    /**
     * An object that specifies details for the identity provider.
     */
    IdentityProvider: IdentityProvider;
    /**
     * The name of the user-based subscription product.
     */
    Product: String;
    /**
     * An object that details the registered identity provider’s product related configuration settings such as the subnets to provision VPC endpoints.
     */
    Settings: Settings;
    /**
     * The status of an identity provider.
     */
    Status: String;
  }
  export type IdentityProviderSummaryList = IdentityProviderSummary[];
  export interface InstanceSummary {
    /**
     * The ID of the EC2 instance, which provides user-based subscriptions.
     */
    InstanceId: String;
    /**
     * The date of the last status check.
     */
    LastStatusCheckDate?: String;
    /**
     * A list of provided user-based subscription products.
     */
    Products: StringList;
    /**
     * The status of an EC2 instance resource.
     */
    Status: String;
    /**
     * The status message for an EC2 instance.
     */
    StatusMessage?: String;
  }
  export type InstanceSummaryList = InstanceSummary[];
  export interface InstanceUserSummary {
    /**
     * The date a user was associated with an EC2 instance.
     */
    AssociationDate?: String;
    /**
     * The date a user was disassociated from an EC2 instance.
     */
    DisassociationDate?: String;
    /**
     * The domain name of the user.
     */
    Domain?: String;
    /**
     * An object that specifies details for the identity provider.
     */
    IdentityProvider: IdentityProvider;
    /**
     * The ID of the EC2 instance, which provides user-based subscriptions.
     */
    InstanceId: String;
    /**
     * The status of a user associated with an EC2 instance.
     */
    Status: String;
    /**
     * The status message for users of an EC2 instance.
     */
    StatusMessage?: String;
    /**
     * The user name from the identity provider for the user.
     */
    Username: String;
  }
  export type InstanceUserSummaryList = InstanceUserSummary[];
  export interface ListIdentityProvidersRequest {
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListIdentityProvidersResponse {
    /**
     * Metadata that describes the list identity providers operation.
     */
    IdentityProviderSummaries: IdentityProviderSummaryList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListInstancesRequest {
    /**
     * An array of structures that you can use to filter the results to those that match one or more sets of key-value pairs that you specify.
     */
    Filters?: FilterList;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListInstancesResponse {
    /**
     * Metadata that describes the list instances operation.
     */
    InstanceSummaries?: InstanceSummaryList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListProductSubscriptionsRequest {
    /**
     * An array of structures that you can use to filter the results to those that match one or more sets of key-value pairs that you specify.
     */
    Filters?: FilterList;
    /**
     * An object that specifies details for the identity provider.
     */
    IdentityProvider: IdentityProvider;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * The name of the user-based subscription product.
     */
    Product: String;
  }
  export interface ListProductSubscriptionsResponse {
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Metadata that describes the list product subscriptions operation.
     */
    ProductUserSummaries?: ProductUserSummaryList;
  }
  export interface ListUserAssociationsRequest {
    /**
     * An array of structures that you can use to filter the results to those that match one or more sets of key-value pairs that you specify.
     */
    Filters?: FilterList;
    /**
     * An object that specifies details for the identity provider.
     */
    IdentityProvider: IdentityProvider;
    /**
     * The ID of the EC2 instance, which provides user-based subscriptions.
     */
    InstanceId: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListUserAssociationsResponse {
    /**
     * Metadata that describes the list user association operation.
     */
    InstanceUserSummaries?: InstanceUserSummaryList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ProductUserSummary {
    /**
     * The domain name of the user.
     */
    Domain?: String;
    /**
     * An object that specifies details for the identity provider.
     */
    IdentityProvider: IdentityProvider;
    /**
     * The name of the user-based subscription product.
     */
    Product: String;
    /**
     * The status of a product for a user.
     */
    Status: String;
    /**
     * The status message for a product for a user.
     */
    StatusMessage?: String;
    /**
     * The end date of a subscription.
     */
    SubscriptionEndDate?: String;
    /**
     * The start date of a subscription.
     */
    SubscriptionStartDate?: String;
    /**
     * The user name from the identity provider of the user.
     */
    Username: String;
  }
  export type ProductUserSummaryList = ProductUserSummary[];
  export interface RegisterIdentityProviderRequest {
    /**
     * An object that specifies details for the identity provider.
     */
    IdentityProvider: IdentityProvider;
    /**
     * The name of the user-based subscription product.
     */
    Product: String;
    /**
     * The registered identity provider’s product related configuration settings such as the subnets to provision VPC endpoints.
     */
    Settings?: Settings;
  }
  export interface RegisterIdentityProviderResponse {
    /**
     * Metadata that describes the results of an identity provider operation.
     */
    IdentityProviderSummary: IdentityProviderSummary;
  }
  export type SecurityGroup = string;
  export interface Settings {
    /**
     * A security group ID that allows inbound TCP port 1688 communication between resources in your VPC and the VPC endpoint for activation servers.
     */
    SecurityGroupId: SecurityGroup;
    /**
     * The subnets defined for the registered identity provider.
     */
    Subnets: SettingsSubnetsList;
  }
  export type SettingsSubnetsList = Subnet[];
  export interface StartProductSubscriptionRequest {
    /**
     * The domain name of the user.
     */
    Domain?: String;
    /**
     * An object that specifies details for the identity provider.
     */
    IdentityProvider: IdentityProvider;
    /**
     * The name of the user-based subscription product.
     */
    Product: String;
    /**
     * The user name from the identity provider of the user.
     */
    Username: String;
  }
  export interface StartProductSubscriptionResponse {
    /**
     * Metadata that describes the start product subscription operation.
     */
    ProductUserSummary: ProductUserSummary;
  }
  export interface StopProductSubscriptionRequest {
    /**
     * The domain name of the user.
     */
    Domain?: String;
    /**
     * An object that specifies details for the identity provider.
     */
    IdentityProvider: IdentityProvider;
    /**
     * The name of the user-based subscription product.
     */
    Product: String;
    /**
     * The user name from the identity provider for the user.
     */
    Username: String;
  }
  export interface StopProductSubscriptionResponse {
    /**
     * Metadata that describes the start product subscription operation.
     */
    ProductUserSummary: ProductUserSummary;
  }
  export type String = string;
  export type StringList = String[];
  export type Subnet = string;
  export type Subnets = Subnet[];
  export interface UpdateIdentityProviderSettingsRequest {
    IdentityProvider: IdentityProvider;
    /**
     * The name of the user-based subscription product.
     */
    Product: String;
    /**
     * Updates the registered identity provider’s product related configuration settings. You can update any combination of settings in a single operation such as the:   Subnets which you want to add to provision VPC endpoints.   Subnets which you want to remove the VPC endpoints from.   Security group ID which permits traffic to the VPC endpoints.  
     */
    UpdateSettings: UpdateSettings;
  }
  export interface UpdateIdentityProviderSettingsResponse {
    IdentityProviderSummary: IdentityProviderSummary;
  }
  export interface UpdateSettings {
    /**
     * The ID of one or more subnets in which License Manager will create a VPC endpoint for products that require connectivity to activation servers.
     */
    AddSubnets: Subnets;
    /**
     * The ID of one or more subnets to remove.
     */
    RemoveSubnets: Subnets;
    /**
     * A security group ID that allows inbound TCP port 1688 communication between resources in your VPC and the VPC endpoints for activation servers.
     */
    SecurityGroupId?: SecurityGroup;
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
   * Contains interfaces for use with the LicenseManagerUserSubscriptions client.
   */
  export import Types = LicenseManagerUserSubscriptions;
}
export = LicenseManagerUserSubscriptions;
