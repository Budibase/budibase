import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Account extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Account.Types.ClientConfiguration)
  config: Config & Account.Types.ClientConfiguration;
  /**
   * Deletes the specified alternate contact from an Amazon Web Services account. For complete details about how to use the alternate contact operations, see Access or updating the alternate contacts.  Before you can update the alternate contact information for an Amazon Web Services account that is managed by Organizations, you must first enable integration between Amazon Web Services Account Management and Organizations. For more information, see Enabling trusted access for Amazon Web Services Account Management. 
   */
  deleteAlternateContact(params: Account.Types.DeleteAlternateContactRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified alternate contact from an Amazon Web Services account. For complete details about how to use the alternate contact operations, see Access or updating the alternate contacts.  Before you can update the alternate contact information for an Amazon Web Services account that is managed by Organizations, you must first enable integration between Amazon Web Services Account Management and Organizations. For more information, see Enabling trusted access for Amazon Web Services Account Management. 
   */
  deleteAlternateContact(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables (opts-out) a particular Region for an account.
   */
  disableRegion(params: Account.Types.DisableRegionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables (opts-out) a particular Region for an account.
   */
  disableRegion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables (opts-in) a particular Region for an account.
   */
  enableRegion(params: Account.Types.EnableRegionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables (opts-in) a particular Region for an account.
   */
  enableRegion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieves the specified alternate contact attached to an Amazon Web Services account. For complete details about how to use the alternate contact operations, see Access or updating the alternate contacts.  Before you can update the alternate contact information for an Amazon Web Services account that is managed by Organizations, you must first enable integration between Amazon Web Services Account Management and Organizations. For more information, see Enabling trusted access for Amazon Web Services Account Management. 
   */
  getAlternateContact(params: Account.Types.GetAlternateContactRequest, callback?: (err: AWSError, data: Account.Types.GetAlternateContactResponse) => void): Request<Account.Types.GetAlternateContactResponse, AWSError>;
  /**
   * Retrieves the specified alternate contact attached to an Amazon Web Services account. For complete details about how to use the alternate contact operations, see Access or updating the alternate contacts.  Before you can update the alternate contact information for an Amazon Web Services account that is managed by Organizations, you must first enable integration between Amazon Web Services Account Management and Organizations. For more information, see Enabling trusted access for Amazon Web Services Account Management. 
   */
  getAlternateContact(callback?: (err: AWSError, data: Account.Types.GetAlternateContactResponse) => void): Request<Account.Types.GetAlternateContactResponse, AWSError>;
  /**
   * Retrieves the primary contact information of an Amazon Web Services account. For complete details about how to use the primary contact operations, see Update the primary and alternate contact information.
   */
  getContactInformation(params: Account.Types.GetContactInformationRequest, callback?: (err: AWSError, data: Account.Types.GetContactInformationResponse) => void): Request<Account.Types.GetContactInformationResponse, AWSError>;
  /**
   * Retrieves the primary contact information of an Amazon Web Services account. For complete details about how to use the primary contact operations, see Update the primary and alternate contact information.
   */
  getContactInformation(callback?: (err: AWSError, data: Account.Types.GetContactInformationResponse) => void): Request<Account.Types.GetContactInformationResponse, AWSError>;
  /**
   * Retrieves the opt-in status of a particular Region.
   */
  getRegionOptStatus(params: Account.Types.GetRegionOptStatusRequest, callback?: (err: AWSError, data: Account.Types.GetRegionOptStatusResponse) => void): Request<Account.Types.GetRegionOptStatusResponse, AWSError>;
  /**
   * Retrieves the opt-in status of a particular Region.
   */
  getRegionOptStatus(callback?: (err: AWSError, data: Account.Types.GetRegionOptStatusResponse) => void): Request<Account.Types.GetRegionOptStatusResponse, AWSError>;
  /**
   * Lists all the Regions for a given account and their respective opt-in statuses. Optionally, this list can be filtered by the region-opt-status-contains parameter. 
   */
  listRegions(params: Account.Types.ListRegionsRequest, callback?: (err: AWSError, data: Account.Types.ListRegionsResponse) => void): Request<Account.Types.ListRegionsResponse, AWSError>;
  /**
   * Lists all the Regions for a given account and their respective opt-in statuses. Optionally, this list can be filtered by the region-opt-status-contains parameter. 
   */
  listRegions(callback?: (err: AWSError, data: Account.Types.ListRegionsResponse) => void): Request<Account.Types.ListRegionsResponse, AWSError>;
  /**
   * Modifies the specified alternate contact attached to an Amazon Web Services account. For complete details about how to use the alternate contact operations, see Access or updating the alternate contacts.  Before you can update the alternate contact information for an Amazon Web Services account that is managed by Organizations, you must first enable integration between Amazon Web Services Account Management and Organizations. For more information, see Enabling trusted access for Amazon Web Services Account Management. 
   */
  putAlternateContact(params: Account.Types.PutAlternateContactRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Modifies the specified alternate contact attached to an Amazon Web Services account. For complete details about how to use the alternate contact operations, see Access or updating the alternate contacts.  Before you can update the alternate contact information for an Amazon Web Services account that is managed by Organizations, you must first enable integration between Amazon Web Services Account Management and Organizations. For more information, see Enabling trusted access for Amazon Web Services Account Management. 
   */
  putAlternateContact(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the primary contact information of an Amazon Web Services account. For complete details about how to use the primary contact operations, see Update the primary and alternate contact information.
   */
  putContactInformation(params: Account.Types.PutContactInformationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the primary contact information of an Amazon Web Services account. For complete details about how to use the primary contact operations, see Update the primary and alternate contact information.
   */
  putContactInformation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace Account {
  export type AccountId = string;
  export type AddressLine = string;
  export interface AlternateContact {
    /**
     * The type of alternate contact.
     */
    AlternateContactType?: AlternateContactType;
    /**
     * The email address associated with this alternate contact.
     */
    EmailAddress?: EmailAddress;
    /**
     * The name associated with this alternate contact.
     */
    Name?: Name;
    /**
     * The phone number associated with this alternate contact.
     */
    PhoneNumber?: PhoneNumber;
    /**
     * The title associated with this alternate contact.
     */
    Title?: Title;
  }
  export type AlternateContactType = "BILLING"|"OPERATIONS"|"SECURITY"|string;
  export type City = string;
  export type CompanyName = string;
  export interface ContactInformation {
    /**
     * The first line of the primary contact address.
     */
    AddressLine1: AddressLine;
    /**
     * The second line of the primary contact address, if any.
     */
    AddressLine2?: AddressLine;
    /**
     * The third line of the primary contact address, if any.
     */
    AddressLine3?: AddressLine;
    /**
     * The city of the primary contact address.
     */
    City: City;
    /**
     * The name of the company associated with the primary contact information, if any.
     */
    CompanyName?: CompanyName;
    /**
     * The ISO-3166 two-letter country code for the primary contact address.
     */
    CountryCode: CountryCode;
    /**
     * The district or county of the primary contact address, if any.
     */
    DistrictOrCounty?: DistrictOrCounty;
    /**
     * The full name of the primary contact address.
     */
    FullName: FullName;
    /**
     * The phone number of the primary contact information. The number will be validated and, in some countries, checked for activation.
     */
    PhoneNumber: ContactInformationPhoneNumber;
    /**
     * The postal code of the primary contact address.
     */
    PostalCode: PostalCode;
    /**
     * The state or region of the primary contact address. This field is required in selected countries.
     */
    StateOrRegion?: StateOrRegion;
    /**
     * The URL of the website associated with the primary contact information, if any.
     */
    WebsiteUrl?: WebsiteUrl;
  }
  export type ContactInformationPhoneNumber = string;
  export type CountryCode = string;
  export interface DeleteAlternateContactRequest {
    /**
     * Specifies the 12 digit account ID number of the Amazon Web Services account that you want to access or modify with this operation. If you do not specify this parameter, it defaults to the Amazon Web Services account of the identity used to call the operation. To use this parameter, the caller must be an identity in the organization's management account or a delegated administrator account, and the specified account ID must be a member account in the same organization. The organization must have all features enabled, and the organization must have trusted access enabled for the Account Management service, and optionally a delegated admin account assigned.  The management account can't specify its own AccountId; it must call the operation in standalone context by not including the AccountId parameter.  To call this operation on an account that is not a member of an organization, then don't specify this parameter, and call the operation using an identity belonging to the account whose contacts you wish to retrieve or modify.
     */
    AccountId?: AccountId;
    /**
     * Specifies which of the alternate contacts to delete. 
     */
    AlternateContactType: AlternateContactType;
  }
  export interface DisableRegionRequest {
    /**
     * Specifies the 12-digit account ID number of the Amazon Web Services account that you want to access or modify with this operation. If you don't specify this parameter, it defaults to the Amazon Web Services account of the identity used to call the operation. To use this parameter, the caller must be an identity in the organization's management account or a delegated administrator account. The specified account ID must also be a member account in the same organization. The organization must have all features enabled, and the organization must have trusted access enabled for the Account Management service, and optionally a delegated admin account assigned.  The management account can't specify its own AccountId. It must call the operation in standalone context by not including the AccountId parameter.  To call this operation on an account that is not a member of an organization, don't specify this parameter. Instead, call the operation using an identity belonging to the account whose contacts you wish to retrieve or modify.
     */
    AccountId?: AccountId;
    /**
     * Specifies the Region-code for a given Region name (for example, af-south-1). When you disable a Region, Amazon Web Services performs actions to deactivate that Region in your account, such as destroying IAM resources in the Region. This process takes a few minutes for most accounts, but this can take several hours. You cannot enable the Region until the disabling process is fully completed.
     */
    RegionName: RegionName;
  }
  export type DistrictOrCounty = string;
  export type EmailAddress = string;
  export interface EnableRegionRequest {
    /**
     * Specifies the 12-digit account ID number of the Amazon Web Services account that you want to access or modify with this operation. If you don't specify this parameter, it defaults to the Amazon Web Services account of the identity used to call the operation. To use this parameter, the caller must be an identity in the organization's management account or a delegated administrator account. The specified account ID must also be a member account in the same organization. The organization must have all features enabled, and the organization must have trusted access enabled for the Account Management service, and optionally a delegated admin account assigned.  The management account can't specify its own AccountId. It must call the operation in standalone context by not including the AccountId parameter.  To call this operation on an account that is not a member of an organization, don't specify this parameter. Instead, call the operation using an identity belonging to the account whose contacts you wish to retrieve or modify.
     */
    AccountId?: AccountId;
    /**
     * Specifies the Region-code for a given Region name (for example, af-south-1). When you enable a Region, Amazon Web Services performs actions to prepare your account in that Region, such as distributing your IAM resources to the Region. This process takes a few minutes for most accounts, but it can take several hours. You cannot use the Region until this process is complete. Furthermore, you cannot disable the Region until the enabling process is fully completed.
     */
    RegionName: RegionName;
  }
  export type FullName = string;
  export interface GetAlternateContactRequest {
    /**
     * Specifies the 12 digit account ID number of the Amazon Web Services account that you want to access or modify with this operation. If you do not specify this parameter, it defaults to the Amazon Web Services account of the identity used to call the operation. To use this parameter, the caller must be an identity in the organization's management account or a delegated administrator account, and the specified account ID must be a member account in the same organization. The organization must have all features enabled, and the organization must have trusted access enabled for the Account Management service, and optionally a delegated admin account assigned.  The management account can't specify its own AccountId; it must call the operation in standalone context by not including the AccountId parameter.  To call this operation on an account that is not a member of an organization, then don't specify this parameter, and call the operation using an identity belonging to the account whose contacts you wish to retrieve or modify.
     */
    AccountId?: AccountId;
    /**
     * Specifies which alternate contact you want to retrieve.
     */
    AlternateContactType: AlternateContactType;
  }
  export interface GetAlternateContactResponse {
    /**
     * A structure that contains the details for the specified alternate contact.
     */
    AlternateContact?: AlternateContact;
  }
  export interface GetContactInformationRequest {
    /**
     * Specifies the 12-digit account ID number of the Amazon Web Services account that you want to access or modify with this operation. If you don't specify this parameter, it defaults to the Amazon Web Services account of the identity used to call the operation. To use this parameter, the caller must be an identity in the organization's management account or a delegated administrator account. The specified account ID must also be a member account in the same organization. The organization must have all features enabled, and the organization must have trusted access enabled for the Account Management service, and optionally a delegated admin account assigned.  The management account can't specify its own AccountId. It must call the operation in standalone context by not including the AccountId parameter.  To call this operation on an account that is not a member of an organization, don't specify this parameter. Instead, call the operation using an identity belonging to the account whose contacts you wish to retrieve or modify.
     */
    AccountId?: AccountId;
  }
  export interface GetContactInformationResponse {
    /**
     * Contains the details of the primary contact information associated with an Amazon Web Services account.
     */
    ContactInformation?: ContactInformation;
  }
  export interface GetRegionOptStatusRequest {
    /**
     * Specifies the 12-digit account ID number of the Amazon Web Services account that you want to access or modify with this operation. If you don't specify this parameter, it defaults to the Amazon Web Services account of the identity used to call the operation. To use this parameter, the caller must be an identity in the organization's management account or a delegated administrator account. The specified account ID must also be a member account in the same organization. The organization must have all features enabled, and the organization must have trusted access enabled for the Account Management service, and optionally a delegated admin account assigned.  The management account can't specify its own AccountId. It must call the operation in standalone context by not including the AccountId parameter.  To call this operation on an account that is not a member of an organization, don't specify this parameter. Instead, call the operation using an identity belonging to the account whose contacts you wish to retrieve or modify.
     */
    AccountId?: AccountId;
    /**
     * Specifies the Region-code for a given Region name (for example, af-south-1). This function will return the status of whatever Region you pass into this parameter. 
     */
    RegionName: RegionName;
  }
  export interface GetRegionOptStatusResponse {
    /**
     * The Region code that was passed in.
     */
    RegionName?: RegionName;
    /**
     * One of the potential statuses a Region can undergo (Enabled, Enabling, Disabled, Disabling, Enabled_By_Default).
     */
    RegionOptStatus?: RegionOptStatus;
  }
  export interface ListRegionsRequest {
    /**
     * Specifies the 12-digit account ID number of the Amazon Web Services account that you want to access or modify with this operation. If you don't specify this parameter, it defaults to the Amazon Web Services account of the identity used to call the operation. To use this parameter, the caller must be an identity in the organization's management account or a delegated administrator account. The specified account ID must also be a member account in the same organization. The organization must have all features enabled, and the organization must have trusted access enabled for the Account Management service, and optionally a delegated admin account assigned.  The management account can't specify its own AccountId. It must call the operation in standalone context by not including the AccountId parameter.  To call this operation on an account that is not a member of an organization, don't specify this parameter. Instead, call the operation using an identity belonging to the account whose contacts you wish to retrieve or modify.
     */
    AccountId?: AccountId;
    /**
     * The total number of items to return in the command’s output. If the total number of items available is more than the value specified, a NextToken is provided in the command’s output. To resume pagination, provide the NextToken value in the starting-token argument of a subsequent command. Do not use the NextToken response element directly outside of the Amazon Web Services CLI. For usage examples, see Pagination in the Amazon Web Services Command Line Interface User Guide. 
     */
    MaxResults?: ListRegionsRequestMaxResultsInteger;
    /**
     * A token used to specify where to start paginating. This is the NextToken from a previously truncated response. For usage examples, see Pagination in the Amazon Web Services Command Line Interface User Guide.
     */
    NextToken?: ListRegionsRequestNextTokenString;
    /**
     * A list of Region statuses (Enabling, Enabled, Disabling, Disabled, Enabled_by_default) to use to filter the list of Regions for a given account. For example, passing in a value of ENABLING will only return a list of Regions with a Region status of ENABLING.
     */
    RegionOptStatusContains?: RegionOptStatusList;
  }
  export type ListRegionsRequestMaxResultsInteger = number;
  export type ListRegionsRequestNextTokenString = string;
  export interface ListRegionsResponse {
    /**
     * If there is more data to be returned, this will be populated. It should be passed into the next-token request parameter of list-regions.
     */
    NextToken?: String;
    /**
     * This is a list of Regions for a given account, or if the filtered parameter was used, a list of Regions that match the filter criteria set in the filter parameter.
     */
    Regions?: RegionOptList;
  }
  export type Name = string;
  export type PhoneNumber = string;
  export type PostalCode = string;
  export interface PutAlternateContactRequest {
    /**
     * Specifies the 12 digit account ID number of the Amazon Web Services account that you want to access or modify with this operation. If you do not specify this parameter, it defaults to the Amazon Web Services account of the identity used to call the operation. To use this parameter, the caller must be an identity in the organization's management account or a delegated administrator account, and the specified account ID must be a member account in the same organization. The organization must have all features enabled, and the organization must have trusted access enabled for the Account Management service, and optionally a delegated admin account assigned.  The management account can't specify its own AccountId; it must call the operation in standalone context by not including the AccountId parameter.  To call this operation on an account that is not a member of an organization, then don't specify this parameter, and call the operation using an identity belonging to the account whose contacts you wish to retrieve or modify.
     */
    AccountId?: AccountId;
    /**
     * Specifies which alternate contact you want to create or update.
     */
    AlternateContactType: AlternateContactType;
    /**
     * Specifies an email address for the alternate contact. 
     */
    EmailAddress: EmailAddress;
    /**
     * Specifies a name for the alternate contact.
     */
    Name: Name;
    /**
     * Specifies a phone number for the alternate contact.
     */
    PhoneNumber: PhoneNumber;
    /**
     * Specifies a title for the alternate contact.
     */
    Title: Title;
  }
  export interface PutContactInformationRequest {
    /**
     * Specifies the 12-digit account ID number of the Amazon Web Services account that you want to access or modify with this operation. If you don't specify this parameter, it defaults to the Amazon Web Services account of the identity used to call the operation. To use this parameter, the caller must be an identity in the organization's management account or a delegated administrator account. The specified account ID must also be a member account in the same organization. The organization must have all features enabled, and the organization must have trusted access enabled for the Account Management service, and optionally a delegated admin account assigned.  The management account can't specify its own AccountId. It must call the operation in standalone context by not including the AccountId parameter.  To call this operation on an account that is not a member of an organization, don't specify this parameter. Instead, call the operation using an identity belonging to the account whose contacts you wish to retrieve or modify.
     */
    AccountId?: AccountId;
    /**
     * Contains the details of the primary contact information associated with an Amazon Web Services account.
     */
    ContactInformation: ContactInformation;
  }
  export interface Region {
    /**
     * The Region code of a given Region (for example, us-east-1).
     */
    RegionName?: RegionName;
    /**
     * One of potential statuses a Region can undergo (Enabled, Enabling, Disabled, Disabling, Enabled_By_Default).
     */
    RegionOptStatus?: RegionOptStatus;
  }
  export type RegionName = string;
  export type RegionOptList = Region[];
  export type RegionOptStatus = "ENABLED"|"ENABLING"|"DISABLING"|"DISABLED"|"ENABLED_BY_DEFAULT"|string;
  export type RegionOptStatusList = RegionOptStatus[];
  export type StateOrRegion = string;
  export type String = string;
  export type Title = string;
  export type WebsiteUrl = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-02-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Account client.
   */
  export import Types = Account;
}
export = Account;
