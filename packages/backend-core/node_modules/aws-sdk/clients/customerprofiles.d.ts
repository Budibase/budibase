import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CustomerProfiles extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CustomerProfiles.Types.ClientConfiguration)
  config: Config & CustomerProfiles.Types.ClientConfiguration;
  /**
   * Associates a new key value with a specific profile, such as a Contact Trace Record (CTR) ContactId. A profile object can have a single unique key and any number of additional keys that can be used to identify the profile that it belongs to.
   */
  addProfileKey(params: CustomerProfiles.Types.AddProfileKeyRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.AddProfileKeyResponse) => void): Request<CustomerProfiles.Types.AddProfileKeyResponse, AWSError>;
  /**
   * Associates a new key value with a specific profile, such as a Contact Trace Record (CTR) ContactId. A profile object can have a single unique key and any number of additional keys that can be used to identify the profile that it belongs to.
   */
  addProfileKey(callback?: (err: AWSError, data: CustomerProfiles.Types.AddProfileKeyResponse) => void): Request<CustomerProfiles.Types.AddProfileKeyResponse, AWSError>;
  /**
   * Creates a domain, which is a container for all customer data, such as customer profile attributes, object types, profile keys, and encryption keys. You can create multiple domains, and each domain can have multiple third-party integrations. Each Amazon Connect instance can be associated with only one domain. Multiple Amazon Connect instances can be associated with one domain. Use this API or UpdateDomain to enable identity resolution: set Matching to true. 
   */
  createDomain(params: CustomerProfiles.Types.CreateDomainRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.CreateDomainResponse) => void): Request<CustomerProfiles.Types.CreateDomainResponse, AWSError>;
  /**
   * Creates a domain, which is a container for all customer data, such as customer profile attributes, object types, profile keys, and encryption keys. You can create multiple domains, and each domain can have multiple third-party integrations. Each Amazon Connect instance can be associated with only one domain. Multiple Amazon Connect instances can be associated with one domain. Use this API or UpdateDomain to enable identity resolution: set Matching to true. 
   */
  createDomain(callback?: (err: AWSError, data: CustomerProfiles.Types.CreateDomainResponse) => void): Request<CustomerProfiles.Types.CreateDomainResponse, AWSError>;
  /**
   * Creates a standard profile. A standard profile represents the following attributes for a customer profile in a domain.
   */
  createProfile(params: CustomerProfiles.Types.CreateProfileRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.CreateProfileResponse) => void): Request<CustomerProfiles.Types.CreateProfileResponse, AWSError>;
  /**
   * Creates a standard profile. A standard profile represents the following attributes for a customer profile in a domain.
   */
  createProfile(callback?: (err: AWSError, data: CustomerProfiles.Types.CreateProfileResponse) => void): Request<CustomerProfiles.Types.CreateProfileResponse, AWSError>;
  /**
   * Deletes a specific domain and all of its customer data, such as customer profile attributes and their related objects.
   */
  deleteDomain(params: CustomerProfiles.Types.DeleteDomainRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteDomainResponse) => void): Request<CustomerProfiles.Types.DeleteDomainResponse, AWSError>;
  /**
   * Deletes a specific domain and all of its customer data, such as customer profile attributes and their related objects.
   */
  deleteDomain(callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteDomainResponse) => void): Request<CustomerProfiles.Types.DeleteDomainResponse, AWSError>;
  /**
   * Removes an integration from a specific domain.
   */
  deleteIntegration(params: CustomerProfiles.Types.DeleteIntegrationRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteIntegrationResponse) => void): Request<CustomerProfiles.Types.DeleteIntegrationResponse, AWSError>;
  /**
   * Removes an integration from a specific domain.
   */
  deleteIntegration(callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteIntegrationResponse) => void): Request<CustomerProfiles.Types.DeleteIntegrationResponse, AWSError>;
  /**
   * Deletes the standard customer profile and all data pertaining to the profile.
   */
  deleteProfile(params: CustomerProfiles.Types.DeleteProfileRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteProfileResponse) => void): Request<CustomerProfiles.Types.DeleteProfileResponse, AWSError>;
  /**
   * Deletes the standard customer profile and all data pertaining to the profile.
   */
  deleteProfile(callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteProfileResponse) => void): Request<CustomerProfiles.Types.DeleteProfileResponse, AWSError>;
  /**
   * Removes a searchable key from a customer profile.
   */
  deleteProfileKey(params: CustomerProfiles.Types.DeleteProfileKeyRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteProfileKeyResponse) => void): Request<CustomerProfiles.Types.DeleteProfileKeyResponse, AWSError>;
  /**
   * Removes a searchable key from a customer profile.
   */
  deleteProfileKey(callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteProfileKeyResponse) => void): Request<CustomerProfiles.Types.DeleteProfileKeyResponse, AWSError>;
  /**
   * Removes an object associated with a profile of a given ProfileObjectType.
   */
  deleteProfileObject(params: CustomerProfiles.Types.DeleteProfileObjectRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteProfileObjectResponse) => void): Request<CustomerProfiles.Types.DeleteProfileObjectResponse, AWSError>;
  /**
   * Removes an object associated with a profile of a given ProfileObjectType.
   */
  deleteProfileObject(callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteProfileObjectResponse) => void): Request<CustomerProfiles.Types.DeleteProfileObjectResponse, AWSError>;
  /**
   * Removes a ProfileObjectType from a specific domain as well as removes all the ProfileObjects of that type. It also disables integrations from this specific ProfileObjectType. In addition, it scrubs all of the fields of the standard profile that were populated from this ProfileObjectType.
   */
  deleteProfileObjectType(params: CustomerProfiles.Types.DeleteProfileObjectTypeRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteProfileObjectTypeResponse) => void): Request<CustomerProfiles.Types.DeleteProfileObjectTypeResponse, AWSError>;
  /**
   * Removes a ProfileObjectType from a specific domain as well as removes all the ProfileObjects of that type. It also disables integrations from this specific ProfileObjectType. In addition, it scrubs all of the fields of the standard profile that were populated from this ProfileObjectType.
   */
  deleteProfileObjectType(callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteProfileObjectTypeResponse) => void): Request<CustomerProfiles.Types.DeleteProfileObjectTypeResponse, AWSError>;
  /**
   * Returns information about a specific domain.
   */
  getDomain(params: CustomerProfiles.Types.GetDomainRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetDomainResponse) => void): Request<CustomerProfiles.Types.GetDomainResponse, AWSError>;
  /**
   * Returns information about a specific domain.
   */
  getDomain(callback?: (err: AWSError, data: CustomerProfiles.Types.GetDomainResponse) => void): Request<CustomerProfiles.Types.GetDomainResponse, AWSError>;
  /**
   * Returns an integration for a domain.
   */
  getIntegration(params: CustomerProfiles.Types.GetIntegrationRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetIntegrationResponse) => void): Request<CustomerProfiles.Types.GetIntegrationResponse, AWSError>;
  /**
   * Returns an integration for a domain.
   */
  getIntegration(callback?: (err: AWSError, data: CustomerProfiles.Types.GetIntegrationResponse) => void): Request<CustomerProfiles.Types.GetIntegrationResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and subject to change. Before calling this API, use CreateDomain or UpdateDomain to enable identity resolution: set Matching to true. GetMatches returns potentially matching profiles, based on the results of the latest run of a machine learning process.   Amazon Connect starts a batch process every Saturday at 12AM UTC to identify matching profiles. The results are returned up to seven days after the Saturday run.  Amazon Connect uses the following profile attributes to identify matches:   PhoneNumber   HomePhoneNumber   BusinessPhoneNumber   MobilePhoneNumber   EmailAddress   PersonalEmailAddress   BusinessEmailAddress   FullName   BusinessName   For example, two or more profiles—with spelling mistakes such as John Doe and Jhn Doe, or different casing email addresses such as JOHN_DOE@ANYCOMPANY.COM and johndoe@anycompany.com, or different phone number formats such as 555-010-0000 and +1-555-010-0000—can be detected as belonging to the same customer John Doe and merged into a unified profile.
   */
  getMatches(params: CustomerProfiles.Types.GetMatchesRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetMatchesResponse) => void): Request<CustomerProfiles.Types.GetMatchesResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and subject to change. Before calling this API, use CreateDomain or UpdateDomain to enable identity resolution: set Matching to true. GetMatches returns potentially matching profiles, based on the results of the latest run of a machine learning process.   Amazon Connect starts a batch process every Saturday at 12AM UTC to identify matching profiles. The results are returned up to seven days after the Saturday run.  Amazon Connect uses the following profile attributes to identify matches:   PhoneNumber   HomePhoneNumber   BusinessPhoneNumber   MobilePhoneNumber   EmailAddress   PersonalEmailAddress   BusinessEmailAddress   FullName   BusinessName   For example, two or more profiles—with spelling mistakes such as John Doe and Jhn Doe, or different casing email addresses such as JOHN_DOE@ANYCOMPANY.COM and johndoe@anycompany.com, or different phone number formats such as 555-010-0000 and +1-555-010-0000—can be detected as belonging to the same customer John Doe and merged into a unified profile.
   */
  getMatches(callback?: (err: AWSError, data: CustomerProfiles.Types.GetMatchesResponse) => void): Request<CustomerProfiles.Types.GetMatchesResponse, AWSError>;
  /**
   * Returns the object types for a specific domain.
   */
  getProfileObjectType(params: CustomerProfiles.Types.GetProfileObjectTypeRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetProfileObjectTypeResponse) => void): Request<CustomerProfiles.Types.GetProfileObjectTypeResponse, AWSError>;
  /**
   * Returns the object types for a specific domain.
   */
  getProfileObjectType(callback?: (err: AWSError, data: CustomerProfiles.Types.GetProfileObjectTypeResponse) => void): Request<CustomerProfiles.Types.GetProfileObjectTypeResponse, AWSError>;
  /**
   * Returns the template information for a specific object type. A template is a predefined ProfileObjectType, such as “Salesforce-Account” or “Salesforce-Contact.” When a user sends a ProfileObject, using the PutProfileObject API, with an ObjectTypeName that matches one of the TemplateIds, it uses the mappings from the template.
   */
  getProfileObjectTypeTemplate(params: CustomerProfiles.Types.GetProfileObjectTypeTemplateRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetProfileObjectTypeTemplateResponse) => void): Request<CustomerProfiles.Types.GetProfileObjectTypeTemplateResponse, AWSError>;
  /**
   * Returns the template information for a specific object type. A template is a predefined ProfileObjectType, such as “Salesforce-Account” or “Salesforce-Contact.” When a user sends a ProfileObject, using the PutProfileObject API, with an ObjectTypeName that matches one of the TemplateIds, it uses the mappings from the template.
   */
  getProfileObjectTypeTemplate(callback?: (err: AWSError, data: CustomerProfiles.Types.GetProfileObjectTypeTemplateResponse) => void): Request<CustomerProfiles.Types.GetProfileObjectTypeTemplateResponse, AWSError>;
  /**
   * Lists all of the integrations associated to a specific URI in the AWS account.
   */
  listAccountIntegrations(params: CustomerProfiles.Types.ListAccountIntegrationsRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListAccountIntegrationsResponse) => void): Request<CustomerProfiles.Types.ListAccountIntegrationsResponse, AWSError>;
  /**
   * Lists all of the integrations associated to a specific URI in the AWS account.
   */
  listAccountIntegrations(callback?: (err: AWSError, data: CustomerProfiles.Types.ListAccountIntegrationsResponse) => void): Request<CustomerProfiles.Types.ListAccountIntegrationsResponse, AWSError>;
  /**
   * Returns a list of all the domains for an AWS account that have been created.
   */
  listDomains(params: CustomerProfiles.Types.ListDomainsRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListDomainsResponse) => void): Request<CustomerProfiles.Types.ListDomainsResponse, AWSError>;
  /**
   * Returns a list of all the domains for an AWS account that have been created.
   */
  listDomains(callback?: (err: AWSError, data: CustomerProfiles.Types.ListDomainsResponse) => void): Request<CustomerProfiles.Types.ListDomainsResponse, AWSError>;
  /**
   * Lists all of the integrations in your domain.
   */
  listIntegrations(params: CustomerProfiles.Types.ListIntegrationsRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListIntegrationsResponse) => void): Request<CustomerProfiles.Types.ListIntegrationsResponse, AWSError>;
  /**
   * Lists all of the integrations in your domain.
   */
  listIntegrations(callback?: (err: AWSError, data: CustomerProfiles.Types.ListIntegrationsResponse) => void): Request<CustomerProfiles.Types.ListIntegrationsResponse, AWSError>;
  /**
   * Lists all of the template information for object types.
   */
  listProfileObjectTypeTemplates(params: CustomerProfiles.Types.ListProfileObjectTypeTemplatesRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListProfileObjectTypeTemplatesResponse) => void): Request<CustomerProfiles.Types.ListProfileObjectTypeTemplatesResponse, AWSError>;
  /**
   * Lists all of the template information for object types.
   */
  listProfileObjectTypeTemplates(callback?: (err: AWSError, data: CustomerProfiles.Types.ListProfileObjectTypeTemplatesResponse) => void): Request<CustomerProfiles.Types.ListProfileObjectTypeTemplatesResponse, AWSError>;
  /**
   * Lists all of the templates available within the service.
   */
  listProfileObjectTypes(params: CustomerProfiles.Types.ListProfileObjectTypesRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListProfileObjectTypesResponse) => void): Request<CustomerProfiles.Types.ListProfileObjectTypesResponse, AWSError>;
  /**
   * Lists all of the templates available within the service.
   */
  listProfileObjectTypes(callback?: (err: AWSError, data: CustomerProfiles.Types.ListProfileObjectTypesResponse) => void): Request<CustomerProfiles.Types.ListProfileObjectTypesResponse, AWSError>;
  /**
   * Returns a list of objects associated with a profile of a given ProfileObjectType.
   */
  listProfileObjects(params: CustomerProfiles.Types.ListProfileObjectsRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListProfileObjectsResponse) => void): Request<CustomerProfiles.Types.ListProfileObjectsResponse, AWSError>;
  /**
   * Returns a list of objects associated with a profile of a given ProfileObjectType.
   */
  listProfileObjects(callback?: (err: AWSError, data: CustomerProfiles.Types.ListProfileObjectsResponse) => void): Request<CustomerProfiles.Types.ListProfileObjectsResponse, AWSError>;
  /**
   * Displays the tags associated with an Amazon Connect Customer Profiles resource. In Connect Customer Profiles, domains, profile object types, and integrations can be tagged.
   */
  listTagsForResource(params: CustomerProfiles.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListTagsForResourceResponse) => void): Request<CustomerProfiles.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Displays the tags associated with an Amazon Connect Customer Profiles resource. In Connect Customer Profiles, domains, profile object types, and integrations can be tagged.
   */
  listTagsForResource(callback?: (err: AWSError, data: CustomerProfiles.Types.ListTagsForResourceResponse) => void): Request<CustomerProfiles.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and subject to change. Runs an AWS Lambda job that does the following:   All the profileKeys in the ProfileToBeMerged will be moved to the main profile.   All the objects in the ProfileToBeMerged will be moved to the main profile.   All the ProfileToBeMerged will be deleted at the end.   All the profileKeys in the ProfileIdsToBeMerged will be moved to the main profile.   Standard fields are merged as follows:   Fields are always "union"-ed if there are no conflicts in standard fields or attributeKeys.   When there are conflicting fields:   If no SourceProfileIds entry is specified, the main Profile value is always taken.    If a SourceProfileIds entry is specified, the specified profileId is always taken, even if it is a NULL value.       You can use MergeProfiles together with GetMatches, which returns potentially matching profiles, or use it with the results of another matching system. After profiles have been merged, they cannot be separated (unmerged).
   */
  mergeProfiles(params: CustomerProfiles.Types.MergeProfilesRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.MergeProfilesResponse) => void): Request<CustomerProfiles.Types.MergeProfilesResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and subject to change. Runs an AWS Lambda job that does the following:   All the profileKeys in the ProfileToBeMerged will be moved to the main profile.   All the objects in the ProfileToBeMerged will be moved to the main profile.   All the ProfileToBeMerged will be deleted at the end.   All the profileKeys in the ProfileIdsToBeMerged will be moved to the main profile.   Standard fields are merged as follows:   Fields are always "union"-ed if there are no conflicts in standard fields or attributeKeys.   When there are conflicting fields:   If no SourceProfileIds entry is specified, the main Profile value is always taken.    If a SourceProfileIds entry is specified, the specified profileId is always taken, even if it is a NULL value.       You can use MergeProfiles together with GetMatches, which returns potentially matching profiles, or use it with the results of another matching system. After profiles have been merged, they cannot be separated (unmerged).
   */
  mergeProfiles(callback?: (err: AWSError, data: CustomerProfiles.Types.MergeProfilesResponse) => void): Request<CustomerProfiles.Types.MergeProfilesResponse, AWSError>;
  /**
   * Adds an integration between the service and a third-party service, which includes Amazon AppFlow and Amazon Connect. An integration can belong to only one domain.
   */
  putIntegration(params: CustomerProfiles.Types.PutIntegrationRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.PutIntegrationResponse) => void): Request<CustomerProfiles.Types.PutIntegrationResponse, AWSError>;
  /**
   * Adds an integration between the service and a third-party service, which includes Amazon AppFlow and Amazon Connect. An integration can belong to only one domain.
   */
  putIntegration(callback?: (err: AWSError, data: CustomerProfiles.Types.PutIntegrationResponse) => void): Request<CustomerProfiles.Types.PutIntegrationResponse, AWSError>;
  /**
   * Adds additional objects to customer profiles of a given ObjectType. When adding a specific profile object, like a Contact Trace Record (CTR), an inferred profile can get created if it is not mapped to an existing profile. The resulting profile will only have a phone number populated in the standard ProfileObject. Any additional CTRs with the same phone number will be mapped to the same inferred profile. When a ProfileObject is created and if a ProfileObjectType already exists for the ProfileObject, it will provide data to a standard profile depending on the ProfileObjectType definition. PutProfileObject needs an ObjectType, which can be created using PutProfileObjectType.
   */
  putProfileObject(params: CustomerProfiles.Types.PutProfileObjectRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.PutProfileObjectResponse) => void): Request<CustomerProfiles.Types.PutProfileObjectResponse, AWSError>;
  /**
   * Adds additional objects to customer profiles of a given ObjectType. When adding a specific profile object, like a Contact Trace Record (CTR), an inferred profile can get created if it is not mapped to an existing profile. The resulting profile will only have a phone number populated in the standard ProfileObject. Any additional CTRs with the same phone number will be mapped to the same inferred profile. When a ProfileObject is created and if a ProfileObjectType already exists for the ProfileObject, it will provide data to a standard profile depending on the ProfileObjectType definition. PutProfileObject needs an ObjectType, which can be created using PutProfileObjectType.
   */
  putProfileObject(callback?: (err: AWSError, data: CustomerProfiles.Types.PutProfileObjectResponse) => void): Request<CustomerProfiles.Types.PutProfileObjectResponse, AWSError>;
  /**
   * Defines a ProfileObjectType.
   */
  putProfileObjectType(params: CustomerProfiles.Types.PutProfileObjectTypeRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.PutProfileObjectTypeResponse) => void): Request<CustomerProfiles.Types.PutProfileObjectTypeResponse, AWSError>;
  /**
   * Defines a ProfileObjectType.
   */
  putProfileObjectType(callback?: (err: AWSError, data: CustomerProfiles.Types.PutProfileObjectTypeResponse) => void): Request<CustomerProfiles.Types.PutProfileObjectTypeResponse, AWSError>;
  /**
   * Searches for profiles within a specific domain name using name, phone number, email address, account number, or a custom defined index.
   */
  searchProfiles(params: CustomerProfiles.Types.SearchProfilesRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.SearchProfilesResponse) => void): Request<CustomerProfiles.Types.SearchProfilesResponse, AWSError>;
  /**
   * Searches for profiles within a specific domain name using name, phone number, email address, account number, or a custom defined index.
   */
  searchProfiles(callback?: (err: AWSError, data: CustomerProfiles.Types.SearchProfilesResponse) => void): Request<CustomerProfiles.Types.SearchProfilesResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified Amazon Connect Customer Profiles resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. In Connect Customer Profiles, domains, profile object types, and integrations can be tagged. Tags don't have any semantic meaning to AWS and are interpreted strictly as strings of characters. You can use the TagResource action with a resource that already has tags. If you specify a new tag key, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a resource.
   */
  tagResource(params: CustomerProfiles.Types.TagResourceRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.TagResourceResponse) => void): Request<CustomerProfiles.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified Amazon Connect Customer Profiles resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. In Connect Customer Profiles, domains, profile object types, and integrations can be tagged. Tags don't have any semantic meaning to AWS and are interpreted strictly as strings of characters. You can use the TagResource action with a resource that already has tags. If you specify a new tag key, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a resource.
   */
  tagResource(callback?: (err: AWSError, data: CustomerProfiles.Types.TagResourceResponse) => void): Request<CustomerProfiles.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified Amazon Connect Customer Profiles resource. In Connect Customer Profiles, domains, profile object types, and integrations can be tagged.
   */
  untagResource(params: CustomerProfiles.Types.UntagResourceRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.UntagResourceResponse) => void): Request<CustomerProfiles.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified Amazon Connect Customer Profiles resource. In Connect Customer Profiles, domains, profile object types, and integrations can be tagged.
   */
  untagResource(callback?: (err: AWSError, data: CustomerProfiles.Types.UntagResourceResponse) => void): Request<CustomerProfiles.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the properties of a domain, including creating or selecting a dead letter queue or an encryption key. After a domain is created, the name can’t be changed. Use this API or CreateDomain to enable identity resolution: set Matching to true. 
   */
  updateDomain(params: CustomerProfiles.Types.UpdateDomainRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.UpdateDomainResponse) => void): Request<CustomerProfiles.Types.UpdateDomainResponse, AWSError>;
  /**
   * Updates the properties of a domain, including creating or selecting a dead letter queue or an encryption key. After a domain is created, the name can’t be changed. Use this API or CreateDomain to enable identity resolution: set Matching to true. 
   */
  updateDomain(callback?: (err: AWSError, data: CustomerProfiles.Types.UpdateDomainResponse) => void): Request<CustomerProfiles.Types.UpdateDomainResponse, AWSError>;
  /**
   * Updates the properties of a profile. The ProfileId is required for updating a customer profile. When calling the UpdateProfile API, specifying an empty string value means that any existing value will be removed. Not specifying a string value means that any value already there will be kept.
   */
  updateProfile(params: CustomerProfiles.Types.UpdateProfileRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.UpdateProfileResponse) => void): Request<CustomerProfiles.Types.UpdateProfileResponse, AWSError>;
  /**
   * Updates the properties of a profile. The ProfileId is required for updating a customer profile. When calling the UpdateProfile API, specifying an empty string value means that any existing value will be removed. Not specifying a string value means that any value already there will be kept.
   */
  updateProfile(callback?: (err: AWSError, data: CustomerProfiles.Types.UpdateProfileResponse) => void): Request<CustomerProfiles.Types.UpdateProfileResponse, AWSError>;
}
declare namespace CustomerProfiles {
  export type name = string;
  export interface AddProfileKeyRequest {
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId: uuid;
    /**
     * A searchable identifier of a customer profile.
     */
    KeyName: name;
    /**
     * A list of key values.
     */
    Values: requestValueList;
    /**
     * The unique name of the domain.
     */
    DomainName: name;
  }
  export interface AddProfileKeyResponse {
    /**
     * A searchable identifier of a customer profile.
     */
    KeyName?: name;
    /**
     * A list of key values.
     */
    Values?: requestValueList;
  }
  export interface Address {
    /**
     * The first line of a customer address.
     */
    Address1?: string1To255;
    /**
     * The second line of a customer address.
     */
    Address2?: string1To255;
    /**
     * The third line of a customer address.
     */
    Address3?: string1To255;
    /**
     * The fourth line of a customer address.
     */
    Address4?: string1To255;
    /**
     * The city in which a customer lives.
     */
    City?: string1To255;
    /**
     * The county in which a customer lives.
     */
    County?: string1To255;
    /**
     * The state in which a customer lives.
     */
    State?: string1To255;
    /**
     * The province in which a customer lives.
     */
    Province?: string1To255;
    /**
     * The country in which a customer lives.
     */
    Country?: string1To255;
    /**
     * The postal code of a customer address.
     */
    PostalCode?: string1To255;
  }
  export type AttributeSourceIdMap = {[key: string]: uuid};
  export type Attributes = {[key: string]: string1To255};
  export type BucketName = string;
  export type BucketPrefix = string;
  export interface ConnectorOperator {
    /**
     * The operation to be performed on the provided Marketo source fields.
     */
    Marketo?: MarketoConnectorOperator;
    /**
     * The operation to be performed on the provided Amazon S3 source fields.
     */
    S3?: S3ConnectorOperator;
    /**
     * The operation to be performed on the provided Salesforce source fields.
     */
    Salesforce?: SalesforceConnectorOperator;
    /**
     * The operation to be performed on the provided ServiceNow source fields.
     */
    ServiceNow?: ServiceNowConnectorOperator;
    /**
     * The operation to be performed on the provided Zendesk source fields.
     */
    Zendesk?: ZendeskConnectorOperator;
  }
  export type ConnectorProfileName = string;
  export interface CreateDomainRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The default number of days until the data within the domain expires.
     */
    DefaultExpirationDays: expirationDaysInteger;
    /**
     * The default encryption key, which is an AWS managed key, is used when no specific type of encryption key is specified. It is used to encrypt all data before it is placed in permanent or semi-permanent storage.
     */
    DefaultEncryptionKey?: encryptionKey;
    /**
     * The URL of the SQS dead letter queue, which is used for reporting errors associated with ingesting data from third party applications. You must set up a policy on the DeadLetterQueue for the SendMessage operation to enable Amazon Connect Customer Profiles to send messages to the DeadLetterQueue.
     */
    DeadLetterQueueUrl?: sqsQueueUrl;
    /**
     * The process of matching duplicate profiles. If Matching = true, Amazon Connect Customer Profiles starts a weekly batch process every Saturday at 12AM UTC to detect duplicate profiles in your domains. After that batch process completes, use the GetMatches API to return and review the results. 
     */
    Matching?: MatchingRequest;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface CreateDomainResponse {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The default number of days until the data within the domain expires.
     */
    DefaultExpirationDays: expirationDaysInteger;
    /**
     * The default encryption key, which is an AWS managed key, is used when no specific type of encryption key is specified. It is used to encrypt all data before it is placed in permanent or semi-permanent storage.
     */
    DefaultEncryptionKey?: encryptionKey;
    /**
     * The URL of the SQS dead letter queue, which is used for reporting errors associated with ingesting data from third party applications.
     */
    DeadLetterQueueUrl?: sqsQueueUrl;
    /**
     * The process of matching duplicate profiles. If Matching = true, Amazon Connect Customer Profiles starts a weekly batch process every Saturday at 12AM UTC to detect duplicate profiles in your domains. After that batch process completes, use the GetMatches API to return and review the results. 
     */
    Matching?: MatchingResponse;
    /**
     * The timestamp of when the domain was created.
     */
    CreatedAt: timestamp;
    /**
     * The timestamp of when the domain was most recently edited.
     */
    LastUpdatedAt: timestamp;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface CreateProfileRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * A unique account number that you have given to the customer.
     */
    AccountNumber?: string1To255;
    /**
     * Any additional information relevant to the customer’s profile.
     */
    AdditionalInformation?: string1To1000;
    /**
     * The type of profile used to describe the customer.
     */
    PartyType?: PartyType;
    /**
     * The name of the customer’s business.
     */
    BusinessName?: string1To255;
    /**
     * The customer’s first name.
     */
    FirstName?: string1To255;
    /**
     * The customer’s middle name.
     */
    MiddleName?: string1To255;
    /**
     * The customer’s last name.
     */
    LastName?: string1To255;
    /**
     * The customer’s birth date. 
     */
    BirthDate?: string1To255;
    /**
     * The gender with which the customer identifies. 
     */
    Gender?: Gender;
    /**
     * The customer’s phone number, which has not been specified as a mobile, home, or business number. 
     */
    PhoneNumber?: string1To255;
    /**
     * The customer’s mobile phone number.
     */
    MobilePhoneNumber?: string1To255;
    /**
     * The customer’s home phone number.
     */
    HomePhoneNumber?: string1To255;
    /**
     * The customer’s business phone number.
     */
    BusinessPhoneNumber?: string1To255;
    /**
     * The customer’s email address, which has not been specified as a personal or business address. 
     */
    EmailAddress?: string1To255;
    /**
     * The customer’s personal email address.
     */
    PersonalEmailAddress?: string1To255;
    /**
     * The customer’s business email address.
     */
    BusinessEmailAddress?: string1To255;
    /**
     * A generic address associated with the customer that is not mailing, shipping, or billing.
     */
    Address?: Address;
    /**
     * The customer’s shipping address.
     */
    ShippingAddress?: Address;
    /**
     * The customer’s mailing address.
     */
    MailingAddress?: Address;
    /**
     * The customer’s billing address.
     */
    BillingAddress?: Address;
    /**
     * A key value pair of attributes of a customer profile.
     */
    Attributes?: Attributes;
  }
  export interface CreateProfileResponse {
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId: uuid;
  }
  export type DataPullMode = "Incremental"|"Complete"|string;
  export type _Date = Date;
  export type DatetimeTypeFieldName = string;
  export interface DeleteDomainRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
  }
  export interface DeleteDomainResponse {
    /**
     * A message that indicates the delete request is done.
     */
    Message: message;
  }
  export interface DeleteIntegrationRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The URI of the S3 bucket or any other type of data source.
     */
    Uri: string1To255;
  }
  export interface DeleteIntegrationResponse {
    /**
     * A message that indicates the delete request is done.
     */
    Message: message;
  }
  export interface DeleteProfileKeyRequest {
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId: uuid;
    /**
     * A searchable identifier of a customer profile.
     */
    KeyName: name;
    /**
     * A list of key values.
     */
    Values: requestValueList;
    /**
     * The unique name of the domain.
     */
    DomainName: name;
  }
  export interface DeleteProfileKeyResponse {
    /**
     * A message that indicates the delete request is done.
     */
    Message?: message;
  }
  export interface DeleteProfileObjectRequest {
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId: uuid;
    /**
     * The unique identifier of the profile object generated by the service.
     */
    ProfileObjectUniqueKey: string1To255;
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
    /**
     * The unique name of the domain.
     */
    DomainName: name;
  }
  export interface DeleteProfileObjectResponse {
    /**
     * A message that indicates the delete request is done.
     */
    Message?: message;
  }
  export interface DeleteProfileObjectTypeRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
  }
  export interface DeleteProfileObjectTypeResponse {
    /**
     * A message that indicates the delete request is done.
     */
    Message: message;
  }
  export interface DeleteProfileRequest {
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId: uuid;
    /**
     * The unique name of the domain.
     */
    DomainName: name;
  }
  export interface DeleteProfileResponse {
    /**
     * A message that indicates the delete request is done.
     */
    Message?: message;
  }
  export type DestinationField = string;
  export type DomainList = ListDomainItem[];
  export interface DomainStats {
    /**
     * The total number of profiles currently in the domain.
     */
    ProfileCount?: long;
    /**
     * The number of profiles that you are currently paying for in the domain. If you have more than 100 objects associated with a single profile, that profile counts as two profiles. If you have more than 200 objects, that profile counts as three, and so on.
     */
    MeteringProfileCount?: long;
    /**
     * The total number of objects in domain.
     */
    ObjectCount?: long;
    /**
     * The total size, in bytes, of all objects in the domain.
     */
    TotalSize?: long;
  }
  export type FieldContentType = "STRING"|"NUMBER"|"PHONE_NUMBER"|"EMAIL_ADDRESS"|"NAME"|string;
  export type FieldMap = {[key: string]: ObjectTypeField};
  export type FieldNameList = name[];
  export interface FieldSourceProfileIds {
    /**
     * A unique identifier for the account number field to be merged. 
     */
    AccountNumber?: uuid;
    /**
     * A unique identifier for the additional information field to be merged.
     */
    AdditionalInformation?: uuid;
    /**
     * A unique identifier for the party type field to be merged.
     */
    PartyType?: uuid;
    /**
     * A unique identifier for the business name field to be merged.
     */
    BusinessName?: uuid;
    /**
     * A unique identifier for the first name field to be merged.
     */
    FirstName?: uuid;
    /**
     * A unique identifier for the middle name field to be merged.
     */
    MiddleName?: uuid;
    /**
     * A unique identifier for the last name field to be merged.
     */
    LastName?: uuid;
    /**
     * A unique identifier for the birthdate field to be merged.
     */
    BirthDate?: uuid;
    /**
     * A unique identifier for the gender field to be merged.
     */
    Gender?: uuid;
    /**
     * A unique identifier for the phone number field to be merged.
     */
    PhoneNumber?: uuid;
    /**
     * A unique identifier for the mobile phone number field to be merged.
     */
    MobilePhoneNumber?: uuid;
    /**
     * A unique identifier for the home phone number field to be merged.
     */
    HomePhoneNumber?: uuid;
    /**
     * A unique identifier for the business phone number field to be merged.
     */
    BusinessPhoneNumber?: uuid;
    /**
     * A unique identifier for the email address field to be merged.
     */
    EmailAddress?: uuid;
    /**
     * A unique identifier for the personal email address field to be merged.
     */
    PersonalEmailAddress?: uuid;
    /**
     * A unique identifier for the party type field to be merged.
     */
    BusinessEmailAddress?: uuid;
    /**
     * A unique identifier for the party type field to be merged.
     */
    Address?: uuid;
    /**
     * A unique identifier for the shipping address field to be merged.
     */
    ShippingAddress?: uuid;
    /**
     * A unique identifier for the mailing address field to be merged.
     */
    MailingAddress?: uuid;
    /**
     * A unique identifier for the billing type field to be merged.
     */
    BillingAddress?: uuid;
    /**
     * A unique identifier for the attributes field to be merged.
     */
    Attributes?: AttributeSourceIdMap;
  }
  export interface FlowDefinition {
    /**
     * A description of the flow you want to create.
     */
    Description?: FlowDescription;
    /**
     * The specified name of the flow. Use underscores (_) or hyphens (-) only. Spaces are not allowed.
     */
    FlowName: FlowName;
    /**
     * The Amazon Resource Name of the AWS Key Management Service (KMS) key you provide for encryption.
     */
    KmsArn: KmsArn;
    /**
     * The configuration that controls how Customer Profiles retrieves data from the source.
     */
    SourceFlowConfig: SourceFlowConfig;
    /**
     * A list of tasks that Customer Profiles performs while transferring the data in the flow run.
     */
    Tasks: Tasks;
    /**
     * The trigger settings that determine how and when the flow runs.
     */
    TriggerConfig: TriggerConfig;
  }
  export type FlowDescription = string;
  export type FlowName = string;
  export type Gender = "MALE"|"FEMALE"|"UNSPECIFIED"|string;
  export interface GetDomainRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
  }
  export interface GetDomainResponse {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The default number of days until the data within the domain expires.
     */
    DefaultExpirationDays?: expirationDaysInteger;
    /**
     * The default encryption key, which is an AWS managed key, is used when no specific type of encryption key is specified. It is used to encrypt all data before it is placed in permanent or semi-permanent storage.
     */
    DefaultEncryptionKey?: encryptionKey;
    /**
     * The URL of the SQS dead letter queue, which is used for reporting errors associated with ingesting data from third party applications.
     */
    DeadLetterQueueUrl?: sqsQueueUrl;
    /**
     * Usage-specific statistics about the domain.
     */
    Stats?: DomainStats;
    /**
     * The process of matching duplicate profiles. If Matching = true, Amazon Connect Customer Profiles starts a weekly batch process every Saturday at 12AM UTC to detect duplicate profiles in your domains. After that batch process completes, use the GetMatches API to return and review the results. 
     */
    Matching?: MatchingResponse;
    /**
     * The timestamp of when the domain was created.
     */
    CreatedAt: timestamp;
    /**
     * The timestamp of when the domain was most recently edited.
     */
    LastUpdatedAt: timestamp;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface GetIntegrationRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The URI of the S3 bucket or any other type of data source.
     */
    Uri: string1To255;
  }
  export interface GetIntegrationResponse {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The URI of the S3 bucket or any other type of data source.
     */
    Uri: string1To255;
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
    /**
     * The timestamp of when the domain was created.
     */
    CreatedAt: timestamp;
    /**
     * The timestamp of when the domain was most recently edited.
     */
    LastUpdatedAt: timestamp;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface GetMatchesRequest {
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: token;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: maxSize100;
    /**
     * The unique name of the domain.
     */
    DomainName: name;
  }
  export interface GetMatchesResponse {
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: token;
    /**
     * The timestamp this version of Match Result generated.
     */
    MatchGenerationDate?: timestamp;
    /**
     * The number of potential matches found.
     */
    PotentialMatches?: matchesNumber;
    /**
     * The list of matched profiles for this instance.
     */
    Matches?: MatchesList;
  }
  export interface GetProfileObjectTypeRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
  }
  export interface GetProfileObjectTypeResponse {
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
    /**
     * The description of the profile object type.
     */
    Description: text;
    /**
     * A unique identifier for the object template.
     */
    TemplateId?: name;
    /**
     * The number of days until the data in the object expires.
     */
    ExpirationDays?: expirationDaysInteger;
    /**
     * The customer-provided key to encrypt the profile object that will be created in this profile object type.
     */
    EncryptionKey?: encryptionKey;
    /**
     * Indicates whether a profile should be created when data is received if one doesn’t exist for an object of this type. The default is FALSE. If the AllowProfileCreation flag is set to FALSE, then the service tries to fetch a standard profile and associate this object with the profile. If it is set to TRUE, and if no match is found, then the service creates a new standard profile.
     */
    AllowProfileCreation?: boolean;
    /**
     * A map of the name and ObjectType field.
     */
    Fields?: FieldMap;
    /**
     * A list of unique keys that can be used to map data to the profile.
     */
    Keys?: KeyMap;
    /**
     * The timestamp of when the domain was created.
     */
    CreatedAt?: timestamp;
    /**
     * The timestamp of when the domain was most recently edited.
     */
    LastUpdatedAt?: timestamp;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface GetProfileObjectTypeTemplateRequest {
    /**
     * A unique identifier for the object template.
     */
    TemplateId: name;
  }
  export interface GetProfileObjectTypeTemplateResponse {
    /**
     * A unique identifier for the object template.
     */
    TemplateId?: name;
    /**
     * The name of the source of the object template.
     */
    SourceName?: name;
    /**
     * The source of the object template.
     */
    SourceObject?: name;
    /**
     * Indicates whether a profile should be created when data is received if one doesn’t exist for an object of this type. The default is FALSE. If the AllowProfileCreation flag is set to FALSE, then the service tries to fetch a standard profile and associate this object with the profile. If it is set to TRUE, and if no match is found, then the service creates a new standard profile.
     */
    AllowProfileCreation?: boolean;
    /**
     * A map of the name and ObjectType field.
     */
    Fields?: FieldMap;
    /**
     * A list of unique keys that can be used to map data to the profile.
     */
    Keys?: KeyMap;
  }
  export interface IncrementalPullConfig {
    /**
     * A field that specifies the date time or timestamp field as the criteria to use when importing incremental records from the source.
     */
    DatetimeTypeFieldName?: DatetimeTypeFieldName;
  }
  export type IntegrationList = ListIntegrationItem[];
  export type KeyMap = {[key: string]: ObjectTypeKeyList};
  export type KmsArn = string;
  export interface ListAccountIntegrationsRequest {
    /**
     * The URI of the S3 bucket or any other type of data source.
     */
    Uri: string1To255;
    /**
     * The pagination token from the previous ListAccountIntegrations API call.
     */
    NextToken?: token;
    /**
     * The maximum number of objects returned per page.
     */
    MaxResults?: maxSize100;
  }
  export interface ListAccountIntegrationsResponse {
    /**
     * The list of ListAccountIntegration instances.
     */
    Items?: IntegrationList;
    /**
     * The pagination token from the previous ListAccountIntegrations API call.
     */
    NextToken?: token;
  }
  export interface ListDomainItem {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The timestamp of when the domain was created.
     */
    CreatedAt: timestamp;
    /**
     * The timestamp of when the domain was most recently edited.
     */
    LastUpdatedAt: timestamp;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface ListDomainsRequest {
    /**
     * The pagination token from the previous ListDomain API call.
     */
    NextToken?: token;
    /**
     * The maximum number of objects returned per page.
     */
    MaxResults?: maxSize100;
  }
  export interface ListDomainsResponse {
    /**
     * The list of ListDomains instances.
     */
    Items?: DomainList;
    /**
     * The pagination token from the previous ListDomains API call.
     */
    NextToken?: token;
  }
  export interface ListIntegrationItem {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The URI of the S3 bucket or any other type of data source.
     */
    Uri: string1To255;
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
    /**
     * The timestamp of when the domain was created.
     */
    CreatedAt: timestamp;
    /**
     * The timestamp of when the domain was most recently edited.
     */
    LastUpdatedAt: timestamp;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface ListIntegrationsRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The pagination token from the previous ListIntegrations API call.
     */
    NextToken?: token;
    /**
     * The maximum number of objects returned per page.
     */
    MaxResults?: maxSize100;
  }
  export interface ListIntegrationsResponse {
    /**
     * The list of ListIntegrations instances.
     */
    Items?: IntegrationList;
    /**
     * The pagination token from the previous ListIntegrations API call.
     */
    NextToken?: token;
  }
  export interface ListProfileObjectTypeItem {
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
    /**
     * Description of the profile object type.
     */
    Description: text;
    /**
     * The timestamp of when the domain was created.
     */
    CreatedAt?: timestamp;
    /**
     * The timestamp of when the domain was most recently edited.
     */
    LastUpdatedAt?: timestamp;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface ListProfileObjectTypeTemplateItem {
    /**
     * A unique identifier for the object template.
     */
    TemplateId?: name;
    /**
     * The name of the source of the object template.
     */
    SourceName?: name;
    /**
     * The source of the object template.
     */
    SourceObject?: name;
  }
  export interface ListProfileObjectTypeTemplatesRequest {
    /**
     * The pagination token from the previous ListObjectTypeTemplates API call.
     */
    NextToken?: token;
    /**
     * The maximum number of objects returned per page.
     */
    MaxResults?: maxSize100;
  }
  export interface ListProfileObjectTypeTemplatesResponse {
    /**
     * The list of ListProfileObjectType template instances.
     */
    Items?: ProfileObjectTypeTemplateList;
    /**
     * The pagination token from the previous ListObjectTypeTemplates API call. 
     */
    NextToken?: token;
  }
  export interface ListProfileObjectTypesRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: token;
    /**
     * The maximum number of objects returned per page.
     */
    MaxResults?: maxSize100;
  }
  export interface ListProfileObjectTypesResponse {
    /**
     * The list of ListProfileObjectTypes instances.
     */
    Items?: ProfileObjectTypeList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: token;
  }
  export interface ListProfileObjectsItem {
    /**
     * Specifies the kind of object being added to a profile, such as "Salesforce-Account."
     */
    ObjectTypeName?: typeName;
    /**
     * The unique identifier of the ProfileObject generated by the service.
     */
    ProfileObjectUniqueKey?: string1To255;
    /**
     * A JSON representation of a ProfileObject that belongs to a profile.
     */
    Object?: stringifiedJson;
  }
  export interface ListProfileObjectsRequest {
    /**
     * The pagination token from the previous call to ListProfileObjects.
     */
    NextToken?: token;
    /**
     * The maximum number of objects returned per page.
     */
    MaxResults?: maxSize100;
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId: uuid;
    /**
     * Applies a filter to the response to include profile objects with the specified index values. This filter is only supported for ObjectTypeName _asset and _case.
     */
    ObjectFilter?: ObjectFilter;
  }
  export interface ListProfileObjectsResponse {
    /**
     * The list of ListProfileObject instances.
     */
    Items?: ProfileObjectList;
    /**
     * The pagination token from the previous call to ListProfileObjects.
     */
    NextToken?: token;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource for which you want to view tags.
     */
    resourceArn: TagArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: TagMap;
  }
  export type MarketoConnectorOperator = "PROJECTION"|"LESS_THAN"|"GREATER_THAN"|"BETWEEN"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface MarketoSourceProperties {
    /**
     * The object specified in the Marketo flow source.
     */
    Object: Object;
  }
  export interface MatchItem {
    /**
     * The unique identifiers for this group of profiles that match.
     */
    MatchId?: string1To255;
    /**
     * A list of identifiers for profiles that match.
     */
    ProfileIds?: ProfileIdList;
  }
  export type MatchesList = MatchItem[];
  export interface MatchingRequest {
    /**
     * The flag that enables the matching process of duplicate profiles.
     */
    Enabled: optionalBoolean;
  }
  export interface MatchingResponse {
    /**
     * The flag that enables the matching process of duplicate profiles.
     */
    Enabled?: optionalBoolean;
  }
  export interface MergeProfilesRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The identifier of the profile to be taken.
     */
    MainProfileId: uuid;
    /**
     * The identifier of the profile to be merged into MainProfileId.
     */
    ProfileIdsToBeMerged: ProfileIdToBeMergedList;
    /**
     * The identifiers of the fields in the profile that has the information you want to apply to the merge. For example, say you want to merge EmailAddress from Profile1 into MainProfile. This would be the identifier of the EmailAddress field in Profile1. 
     */
    FieldSourceProfileIds?: FieldSourceProfileIds;
  }
  export interface MergeProfilesResponse {
    /**
     * A message that indicates the merge request is complete.
     */
    Message?: message;
  }
  export type Object = string;
  export interface ObjectFilter {
    /**
     * A searchable identifier of a standard profile object. The predefined keys you can use to search for _asset include: _assetId, _assetName, _serialNumber. The predefined keys you can use to search for _case include: _caseId.
     */
    KeyName: name;
    /**
     * A list of key values.
     */
    Values: requestValueList;
  }
  export interface ObjectTypeField {
    /**
     * A field of a ProfileObject. For example: _source.FirstName, where “_source” is a ProfileObjectType of a Zendesk user and “FirstName” is a field in that ObjectType.
     */
    Source?: text;
    /**
     * The location of the data in the standard ProfileObject model. For example: _profile.Address.PostalCode.
     */
    Target?: text;
    /**
     * The content type of the field. Used for determining equality when searching.
     */
    ContentType?: FieldContentType;
  }
  export interface ObjectTypeKey {
    /**
     * The types of keys that a ProfileObject can have. Each ProfileObject can have only 1 UNIQUE key but multiple PROFILE keys. PROFILE, ASSET or CASE means that this key can be used to tie an object to a PROFILE, ASSET or CASE respectively. UNIQUE means that it can be used to uniquely identify an object. If a key a is marked as SECONDARY, it will be used to search for profiles after all other PROFILE keys have been searched. A LOOKUP_ONLY key is only used to match a profile but is not persisted to be used for searching of the profile. A NEW_ONLY key is only used if the profile does not already exist before the object is ingested, otherwise it is only used for matching objects to profiles.
     */
    StandardIdentifiers?: StandardIdentifierList;
    /**
     * The reference for the key name of the fields map.
     */
    FieldNames?: FieldNameList;
  }
  export type ObjectTypeKeyList = ObjectTypeKey[];
  export type OperatorPropertiesKeys = "VALUE"|"VALUES"|"DATA_TYPE"|"UPPER_BOUND"|"LOWER_BOUND"|"SOURCE_DATA_TYPE"|"DESTINATION_DATA_TYPE"|"VALIDATION_ACTION"|"MASK_VALUE"|"MASK_LENGTH"|"TRUNCATE_LENGTH"|"MATH_OPERATION_FIELDS_ORDER"|"CONCAT_FORMAT"|"SUBFIELD_CATEGORY_MAP"|string;
  export type PartyType = "INDIVIDUAL"|"BUSINESS"|"OTHER"|string;
  export interface Profile {
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId?: uuid;
    /**
     * A unique account number that you have given to the customer.
     */
    AccountNumber?: string1To255;
    /**
     * Any additional information relevant to the customer’s profile.
     */
    AdditionalInformation?: string1To1000;
    /**
     * The type of profile used to describe the customer.
     */
    PartyType?: PartyType;
    /**
     * The name of the customer’s business.
     */
    BusinessName?: string1To255;
    /**
     * The customer’s first name.
     */
    FirstName?: string1To255;
    /**
     * The customer’s middle name.
     */
    MiddleName?: string1To255;
    /**
     * The customer’s last name.
     */
    LastName?: string1To255;
    /**
     * The customer’s birth date. 
     */
    BirthDate?: string1To255;
    /**
     * The gender with which the customer identifies. 
     */
    Gender?: Gender;
    /**
     * The customer's phone number, which has not been specified as a mobile, home, or business number.
     */
    PhoneNumber?: string1To255;
    /**
     * The customer’s mobile phone number.
     */
    MobilePhoneNumber?: string1To255;
    /**
     * The customer’s home phone number.
     */
    HomePhoneNumber?: string1To255;
    /**
     * The customer’s home phone number.
     */
    BusinessPhoneNumber?: string1To255;
    /**
     * The customer’s email address, which has not been specified as a personal or business address. 
     */
    EmailAddress?: string1To255;
    /**
     * The customer’s personal email address.
     */
    PersonalEmailAddress?: string1To255;
    /**
     * The customer’s business email address.
     */
    BusinessEmailAddress?: string1To255;
    /**
     * A generic address associated with the customer that is not mailing, shipping, or billing.
     */
    Address?: Address;
    /**
     * The customer’s shipping address.
     */
    ShippingAddress?: Address;
    /**
     * The customer’s mailing address.
     */
    MailingAddress?: Address;
    /**
     * The customer’s billing address.
     */
    BillingAddress?: Address;
    /**
     * A key value pair of attributes of a customer profile.
     */
    Attributes?: Attributes;
  }
  export type ProfileIdList = uuid[];
  export type ProfileIdToBeMergedList = uuid[];
  export type ProfileList = Profile[];
  export type ProfileObjectList = ListProfileObjectsItem[];
  export type ProfileObjectTypeList = ListProfileObjectTypeItem[];
  export type ProfileObjectTypeTemplateList = ListProfileObjectTypeTemplateItem[];
  export type Property = string;
  export interface PutIntegrationRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The URI of the S3 bucket or any other type of data source.
     */
    Uri?: string1To255;
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
    /**
     * The configuration that controls how Customer Profiles retrieves data from the source.
     */
    FlowDefinition?: FlowDefinition;
  }
  export interface PutIntegrationResponse {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The URI of the S3 bucket or any other type of data source.
     */
    Uri: string1To255;
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
    /**
     * The timestamp of when the domain was created.
     */
    CreatedAt: timestamp;
    /**
     * The timestamp of when the domain was most recently edited.
     */
    LastUpdatedAt: timestamp;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface PutProfileObjectRequest {
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
    /**
     * A string that is serialized from a JSON object.
     */
    Object: stringifiedJson;
    /**
     * The unique name of the domain.
     */
    DomainName: name;
  }
  export interface PutProfileObjectResponse {
    /**
     * The unique identifier of the profile object generated by the service.
     */
    ProfileObjectUniqueKey?: string1To255;
  }
  export interface PutProfileObjectTypeRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
    /**
     * Description of the profile object type.
     */
    Description: text;
    /**
     * A unique identifier for the object template.
     */
    TemplateId?: name;
    /**
     * The number of days until the data in the object expires.
     */
    ExpirationDays?: expirationDaysInteger;
    /**
     * The customer-provided key to encrypt the profile object that will be created in this profile object type.
     */
    EncryptionKey?: encryptionKey;
    /**
     * Indicates whether a profile should be created when data is received if one doesn’t exist for an object of this type. The default is FALSE. If the AllowProfileCreation flag is set to FALSE, then the service tries to fetch a standard profile and associate this object with the profile. If it is set to TRUE, and if no match is found, then the service creates a new standard profile.
     */
    AllowProfileCreation?: boolean;
    /**
     * A map of the name and ObjectType field.
     */
    Fields?: FieldMap;
    /**
     * A list of unique keys that can be used to map data to the profile.
     */
    Keys?: KeyMap;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface PutProfileObjectTypeResponse {
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
    /**
     * Description of the profile object type.
     */
    Description: text;
    /**
     * A unique identifier for the object template.
     */
    TemplateId?: name;
    /**
     * The number of days until the data in the object expires.
     */
    ExpirationDays?: expirationDaysInteger;
    /**
     * The customer-provided key to encrypt the profile object that will be created in this profile object type.
     */
    EncryptionKey?: encryptionKey;
    /**
     * Indicates whether a profile should be created when data is received if one doesn’t exist for an object of this type. The default is FALSE. If the AllowProfileCreation flag is set to FALSE, then the service tries to fetch a standard profile and associate this object with the profile. If it is set to TRUE, and if no match is found, then the service creates a new standard profile.
     */
    AllowProfileCreation?: boolean;
    /**
     * A map of the name and ObjectType field.
     */
    Fields?: FieldMap;
    /**
     * A list of unique keys that can be used to map data to the profile.
     */
    Keys?: KeyMap;
    /**
     * The timestamp of when the domain was created.
     */
    CreatedAt?: timestamp;
    /**
     * The timestamp of when the domain was most recently edited.
     */
    LastUpdatedAt?: timestamp;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export type S3ConnectorOperator = "PROJECTION"|"LESS_THAN"|"GREATER_THAN"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"NOT_EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface S3SourceProperties {
    /**
     * The Amazon S3 bucket name where the source files are stored.
     */
    BucketName: BucketName;
    /**
     * The object key for the Amazon S3 bucket in which the source files are stored.
     */
    BucketPrefix?: BucketPrefix;
  }
  export type SalesforceConnectorOperator = "PROJECTION"|"LESS_THAN"|"CONTAINS"|"GREATER_THAN"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"NOT_EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface SalesforceSourceProperties {
    /**
     * The object specified in the Salesforce flow source.
     */
    Object: Object;
    /**
     * The flag that enables dynamic fetching of new (recently added) fields in the Salesforce objects while running a flow.
     */
    EnableDynamicFieldUpdate?: boolean;
    /**
     * Indicates whether Amazon AppFlow includes deleted files in the flow run.
     */
    IncludeDeletedRecords?: boolean;
  }
  export type ScheduleExpression = string;
  export type ScheduleOffset = number;
  export interface ScheduledTriggerProperties {
    /**
     * The scheduling expression that determines the rate at which the schedule will run, for example rate (5 minutes).
     */
    ScheduleExpression: ScheduleExpression;
    /**
     * Specifies whether a scheduled flow has an incremental data transfer or a complete data transfer for each flow run.
     */
    DataPullMode?: DataPullMode;
    /**
     * Specifies the scheduled start time for a scheduled-trigger flow.
     */
    ScheduleStartTime?: _Date;
    /**
     * Specifies the scheduled end time for a scheduled-trigger flow.
     */
    ScheduleEndTime?: _Date;
    /**
     * Specifies the time zone used when referring to the date and time of a scheduled-triggered flow, such as America/New_York.
     */
    Timezone?: Timezone;
    /**
     * Specifies the optional offset that is added to the time interval for a schedule-triggered flow.
     */
    ScheduleOffset?: ScheduleOffset;
    /**
     * Specifies the date range for the records to import from the connector in the first flow run.
     */
    FirstExecutionFrom?: _Date;
  }
  export interface SearchProfilesRequest {
    /**
     * The pagination token from the previous SearchProfiles API call.
     */
    NextToken?: token;
    /**
     * The maximum number of objects returned per page.
     */
    MaxResults?: maxSize100;
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * A searchable identifier of a customer profile. The predefined keys you can use to search include: _account, _profileId, _fullName, _phone, _email, _ctrContactId, _marketoLeadId, _salesforceAccountId, _salesforceContactId, _zendeskUserId, _zendeskExternalId, _serviceNowSystemId.
     */
    KeyName: name;
    /**
     * A list of key values.
     */
    Values: requestValueList;
  }
  export interface SearchProfilesResponse {
    /**
     * The list of SearchProfiles instances.
     */
    Items?: ProfileList;
    /**
     * The pagination token from the previous SearchProfiles API call.
     */
    NextToken?: token;
  }
  export type ServiceNowConnectorOperator = "PROJECTION"|"CONTAINS"|"LESS_THAN"|"GREATER_THAN"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"NOT_EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface ServiceNowSourceProperties {
    /**
     * The object specified in the ServiceNow flow source.
     */
    Object: Object;
  }
  export interface SourceConnectorProperties {
    /**
     * The properties that are applied when Marketo is being used as a source.
     */
    Marketo?: MarketoSourceProperties;
    /**
     * The properties that are applied when Amazon S3 is being used as the flow source.
     */
    S3?: S3SourceProperties;
    /**
     * The properties that are applied when Salesforce is being used as a source.
     */
    Salesforce?: SalesforceSourceProperties;
    /**
     * The properties that are applied when ServiceNow is being used as a source.
     */
    ServiceNow?: ServiceNowSourceProperties;
    /**
     * The properties that are applied when using Zendesk as a flow source.
     */
    Zendesk?: ZendeskSourceProperties;
  }
  export type SourceConnectorType = "Salesforce"|"Marketo"|"Zendesk"|"Servicenow"|"S3"|string;
  export type SourceFields = stringTo2048[];
  export interface SourceFlowConfig {
    /**
     * The name of the AppFlow connector profile. This name must be unique for each connector profile in the AWS account.
     */
    ConnectorProfileName?: ConnectorProfileName;
    /**
     * The type of connector, such as Salesforce, Marketo, and so on.
     */
    ConnectorType: SourceConnectorType;
    /**
     * Defines the configuration for a scheduled incremental data pull. If a valid configuration is provided, the fields specified in the configuration are used when querying for the incremental data pull.
     */
    IncrementalPullConfig?: IncrementalPullConfig;
    /**
     * Specifies the information that is required to query a particular source connector.
     */
    SourceConnectorProperties: SourceConnectorProperties;
  }
  export type StandardIdentifier = "PROFILE"|"ASSET"|"CASE"|"UNIQUE"|"SECONDARY"|"LOOKUP_ONLY"|"NEW_ONLY"|string;
  export type StandardIdentifierList = StandardIdentifier[];
  export type TagArn = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the resource that you're adding tags to.
     */
    resourceArn: TagArn;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface Task {
    /**
     * The operation to be performed on the provided source fields.
     */
    ConnectorOperator?: ConnectorOperator;
    /**
     * A field in a destination connector, or a field value against which Amazon AppFlow validates a source field.
     */
    DestinationField?: DestinationField;
    /**
     * The source fields to which a particular task is applied.
     */
    SourceFields: SourceFields;
    /**
     * A map used to store task-related information. The service looks for particular information based on the TaskType.
     */
    TaskProperties?: TaskPropertiesMap;
    /**
     * Specifies the particular task implementation that Amazon AppFlow performs.
     */
    TaskType: TaskType;
  }
  export type TaskPropertiesMap = {[key: string]: Property};
  export type TaskType = "Arithmetic"|"Filter"|"Map"|"Mask"|"Merge"|"Truncate"|"Validate"|string;
  export type Tasks = Task[];
  export type Timezone = string;
  export interface TriggerConfig {
    /**
     * Specifies the type of flow trigger. It can be OnDemand, Scheduled, or Event.
     */
    TriggerType: TriggerType;
    /**
     * Specifies the configuration details of a schedule-triggered flow that you define. Currently, these settings only apply to the Scheduled trigger type.
     */
    TriggerProperties?: TriggerProperties;
  }
  export interface TriggerProperties {
    /**
     * Specifies the configuration details of a schedule-triggered flow that you define.
     */
    Scheduled?: ScheduledTriggerProperties;
  }
  export type TriggerType = "Scheduled"|"Event"|"OnDemand"|string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource from which you are removing tags.
     */
    resourceArn: TagArn;
    /**
     * The list of tag keys to remove from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAddress {
    /**
     * The first line of a customer address.
     */
    Address1?: string0To255;
    /**
     * The second line of a customer address.
     */
    Address2?: string0To255;
    /**
     * The third line of a customer address.
     */
    Address3?: string0To255;
    /**
     * The fourth line of a customer address.
     */
    Address4?: string0To255;
    /**
     * The city in which a customer lives.
     */
    City?: string0To255;
    /**
     * The county in which a customer lives.
     */
    County?: string0To255;
    /**
     * The state in which a customer lives.
     */
    State?: string0To255;
    /**
     * The province in which a customer lives.
     */
    Province?: string0To255;
    /**
     * The country in which a customer lives.
     */
    Country?: string0To255;
    /**
     * The postal code of a customer address.
     */
    PostalCode?: string0To255;
  }
  export type UpdateAttributes = {[key: string]: string0To255};
  export interface UpdateDomainRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The default number of days until the data within the domain expires.
     */
    DefaultExpirationDays?: expirationDaysInteger;
    /**
     * The default encryption key, which is an AWS managed key, is used when no specific type of encryption key is specified. It is used to encrypt all data before it is placed in permanent or semi-permanent storage. If specified as an empty string, it will clear any existing value.
     */
    DefaultEncryptionKey?: encryptionKey;
    /**
     * The URL of the SQS dead letter queue, which is used for reporting errors associated with ingesting data from third party applications. If specified as an empty string, it will clear any existing value. You must set up a policy on the DeadLetterQueue for the SendMessage operation to enable Amazon Connect Customer Profiles to send messages to the DeadLetterQueue.
     */
    DeadLetterQueueUrl?: sqsQueueUrl;
    /**
     * The process of matching duplicate profiles. If Matching = true, Amazon Connect Customer Profiles starts a weekly batch process every Saturday at 12AM UTC to detect duplicate profiles in your domains. After that batch process completes, use the GetMatches API to return and review the results. 
     */
    Matching?: MatchingRequest;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface UpdateDomainResponse {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The default number of days until the data within the domain expires.
     */
    DefaultExpirationDays?: expirationDaysInteger;
    /**
     * The default encryption key, which is an AWS managed key, is used when no specific type of encryption key is specified. It is used to encrypt all data before it is placed in permanent or semi-permanent storage.
     */
    DefaultEncryptionKey?: encryptionKey;
    /**
     * The URL of the SQS dead letter queue, which is used for reporting errors associated with ingesting data from third party applications.
     */
    DeadLetterQueueUrl?: sqsQueueUrl;
    /**
     * The process of matching duplicate profiles. If Matching = true, Amazon Connect Customer Profiles starts a weekly batch process every Saturday at 12AM UTC to detect duplicate profiles in your domains. After that batch process completes, use the GetMatches API to return and review the results. 
     */
    Matching?: MatchingResponse;
    /**
     * The timestamp of when the domain was created.
     */
    CreatedAt: timestamp;
    /**
     * The timestamp of when the domain was most recently edited.
     */
    LastUpdatedAt: timestamp;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface UpdateProfileRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId: uuid;
    /**
     * Any additional information relevant to the customer’s profile.
     */
    AdditionalInformation?: string0To1000;
    /**
     * A unique account number that you have given to the customer.
     */
    AccountNumber?: string0To255;
    /**
     * The type of profile used to describe the customer.
     */
    PartyType?: PartyType;
    /**
     * The name of the customer’s business.
     */
    BusinessName?: string0To255;
    /**
     * The customer’s first name.
     */
    FirstName?: string0To255;
    /**
     * The customer’s middle name.
     */
    MiddleName?: string0To255;
    /**
     * The customer’s last name.
     */
    LastName?: string0To255;
    /**
     * The customer’s birth date. 
     */
    BirthDate?: string0To255;
    /**
     * The gender with which the customer identifies. 
     */
    Gender?: Gender;
    /**
     * The customer’s phone number, which has not been specified as a mobile, home, or business number. 
     */
    PhoneNumber?: string0To255;
    /**
     * The customer’s mobile phone number.
     */
    MobilePhoneNumber?: string0To255;
    /**
     * The customer’s home phone number.
     */
    HomePhoneNumber?: string0To255;
    /**
     * The customer’s business phone number.
     */
    BusinessPhoneNumber?: string0To255;
    /**
     * The customer’s email address, which has not been specified as a personal or business address. 
     */
    EmailAddress?: string0To255;
    /**
     * The customer’s personal email address.
     */
    PersonalEmailAddress?: string0To255;
    /**
     * The customer’s business email address.
     */
    BusinessEmailAddress?: string0To255;
    /**
     * A generic address associated with the customer that is not mailing, shipping, or billing.
     */
    Address?: UpdateAddress;
    /**
     * The customer’s shipping address.
     */
    ShippingAddress?: UpdateAddress;
    /**
     * The customer’s mailing address.
     */
    MailingAddress?: UpdateAddress;
    /**
     * The customer’s billing address.
     */
    BillingAddress?: UpdateAddress;
    /**
     * A key value pair of attributes of a customer profile.
     */
    Attributes?: UpdateAttributes;
  }
  export interface UpdateProfileResponse {
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId: uuid;
  }
  export type ZendeskConnectorOperator = "PROJECTION"|"GREATER_THAN"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface ZendeskSourceProperties {
    /**
     * The object specified in the Zendesk flow source.
     */
    Object: Object;
  }
  export type encryptionKey = string;
  export type expirationDaysInteger = number;
  export type long = number;
  export type matchesNumber = number;
  export type maxSize100 = number;
  export type message = string;
  export type optionalBoolean = boolean;
  export type requestValueList = string1To255[];
  export type sqsQueueUrl = string;
  export type string0To1000 = string;
  export type string0To255 = string;
  export type string1To1000 = string;
  export type string1To255 = string;
  export type stringTo2048 = string;
  export type stringifiedJson = string;
  export type text = string;
  export type timestamp = Date;
  export type token = string;
  export type typeName = string;
  export type uuid = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-08-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CustomerProfiles client.
   */
  export import Types = CustomerProfiles;
}
export = CustomerProfiles;
