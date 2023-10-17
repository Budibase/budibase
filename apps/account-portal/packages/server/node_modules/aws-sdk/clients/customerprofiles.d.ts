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
   * Associates a new key value with a specific profile, such as a Contact Record ContactId. A profile object can have a single unique key and any number of additional keys that can be used to identify the profile that it belongs to.
   */
  addProfileKey(params: CustomerProfiles.Types.AddProfileKeyRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.AddProfileKeyResponse) => void): Request<CustomerProfiles.Types.AddProfileKeyResponse, AWSError>;
  /**
   * Associates a new key value with a specific profile, such as a Contact Record ContactId. A profile object can have a single unique key and any number of additional keys that can be used to identify the profile that it belongs to.
   */
  addProfileKey(callback?: (err: AWSError, data: CustomerProfiles.Types.AddProfileKeyResponse) => void): Request<CustomerProfiles.Types.AddProfileKeyResponse, AWSError>;
  /**
   * Creates a new calculated attribute definition. After creation, new object data ingested into Customer Profiles will be included in the calculated attribute, which can be retrieved for a profile using the GetCalculatedAttributeForProfile API. Defining a calculated attribute makes it available for all profiles within a domain. Each calculated attribute can only reference one ObjectType and at most, two fields from that ObjectType.
   */
  createCalculatedAttributeDefinition(params: CustomerProfiles.Types.CreateCalculatedAttributeDefinitionRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.CreateCalculatedAttributeDefinitionResponse) => void): Request<CustomerProfiles.Types.CreateCalculatedAttributeDefinitionResponse, AWSError>;
  /**
   * Creates a new calculated attribute definition. After creation, new object data ingested into Customer Profiles will be included in the calculated attribute, which can be retrieved for a profile using the GetCalculatedAttributeForProfile API. Defining a calculated attribute makes it available for all profiles within a domain. Each calculated attribute can only reference one ObjectType and at most, two fields from that ObjectType.
   */
  createCalculatedAttributeDefinition(callback?: (err: AWSError, data: CustomerProfiles.Types.CreateCalculatedAttributeDefinitionResponse) => void): Request<CustomerProfiles.Types.CreateCalculatedAttributeDefinitionResponse, AWSError>;
  /**
   * Creates a domain, which is a container for all customer data, such as customer profile attributes, object types, profile keys, and encryption keys. You can create multiple domains, and each domain can have multiple third-party integrations. Each Amazon Connect instance can be associated with only one domain. Multiple Amazon Connect instances can be associated with one domain. Use this API or UpdateDomain to enable identity resolution: set Matching to true. To prevent cross-service impersonation when you call this API, see Cross-service confused deputy prevention for sample policies that you should apply. 
   */
  createDomain(params: CustomerProfiles.Types.CreateDomainRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.CreateDomainResponse) => void): Request<CustomerProfiles.Types.CreateDomainResponse, AWSError>;
  /**
   * Creates a domain, which is a container for all customer data, such as customer profile attributes, object types, profile keys, and encryption keys. You can create multiple domains, and each domain can have multiple third-party integrations. Each Amazon Connect instance can be associated with only one domain. Multiple Amazon Connect instances can be associated with one domain. Use this API or UpdateDomain to enable identity resolution: set Matching to true. To prevent cross-service impersonation when you call this API, see Cross-service confused deputy prevention for sample policies that you should apply. 
   */
  createDomain(callback?: (err: AWSError, data: CustomerProfiles.Types.CreateDomainResponse) => void): Request<CustomerProfiles.Types.CreateDomainResponse, AWSError>;
  /**
   * Creates an event stream, which is a subscription to real-time events, such as when profiles are created and updated through Amazon Connect Customer Profiles. Each event stream can be associated with only one Kinesis Data Stream destination in the same region and Amazon Web Services account as the customer profiles domain
   */
  createEventStream(params: CustomerProfiles.Types.CreateEventStreamRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.CreateEventStreamResponse) => void): Request<CustomerProfiles.Types.CreateEventStreamResponse, AWSError>;
  /**
   * Creates an event stream, which is a subscription to real-time events, such as when profiles are created and updated through Amazon Connect Customer Profiles. Each event stream can be associated with only one Kinesis Data Stream destination in the same region and Amazon Web Services account as the customer profiles domain
   */
  createEventStream(callback?: (err: AWSError, data: CustomerProfiles.Types.CreateEventStreamResponse) => void): Request<CustomerProfiles.Types.CreateEventStreamResponse, AWSError>;
  /**
   *  Creates an integration workflow. An integration workflow is an async process which ingests historic data and sets up an integration for ongoing updates. The supported Amazon AppFlow sources are Salesforce, ServiceNow, and Marketo. 
   */
  createIntegrationWorkflow(params: CustomerProfiles.Types.CreateIntegrationWorkflowRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.CreateIntegrationWorkflowResponse) => void): Request<CustomerProfiles.Types.CreateIntegrationWorkflowResponse, AWSError>;
  /**
   *  Creates an integration workflow. An integration workflow is an async process which ingests historic data and sets up an integration for ongoing updates. The supported Amazon AppFlow sources are Salesforce, ServiceNow, and Marketo. 
   */
  createIntegrationWorkflow(callback?: (err: AWSError, data: CustomerProfiles.Types.CreateIntegrationWorkflowResponse) => void): Request<CustomerProfiles.Types.CreateIntegrationWorkflowResponse, AWSError>;
  /**
   * Creates a standard profile. A standard profile represents the following attributes for a customer profile in a domain.
   */
  createProfile(params: CustomerProfiles.Types.CreateProfileRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.CreateProfileResponse) => void): Request<CustomerProfiles.Types.CreateProfileResponse, AWSError>;
  /**
   * Creates a standard profile. A standard profile represents the following attributes for a customer profile in a domain.
   */
  createProfile(callback?: (err: AWSError, data: CustomerProfiles.Types.CreateProfileResponse) => void): Request<CustomerProfiles.Types.CreateProfileResponse, AWSError>;
  /**
   * Deletes an existing calculated attribute definition. Note that deleting a default calculated attribute is possible, however once deleted, you will be unable to undo that action and will need to recreate it on your own using the CreateCalculatedAttributeDefinition API if you want it back.
   */
  deleteCalculatedAttributeDefinition(params: CustomerProfiles.Types.DeleteCalculatedAttributeDefinitionRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteCalculatedAttributeDefinitionResponse) => void): Request<CustomerProfiles.Types.DeleteCalculatedAttributeDefinitionResponse, AWSError>;
  /**
   * Deletes an existing calculated attribute definition. Note that deleting a default calculated attribute is possible, however once deleted, you will be unable to undo that action and will need to recreate it on your own using the CreateCalculatedAttributeDefinition API if you want it back.
   */
  deleteCalculatedAttributeDefinition(callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteCalculatedAttributeDefinitionResponse) => void): Request<CustomerProfiles.Types.DeleteCalculatedAttributeDefinitionResponse, AWSError>;
  /**
   * Deletes a specific domain and all of its customer data, such as customer profile attributes and their related objects.
   */
  deleteDomain(params: CustomerProfiles.Types.DeleteDomainRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteDomainResponse) => void): Request<CustomerProfiles.Types.DeleteDomainResponse, AWSError>;
  /**
   * Deletes a specific domain and all of its customer data, such as customer profile attributes and their related objects.
   */
  deleteDomain(callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteDomainResponse) => void): Request<CustomerProfiles.Types.DeleteDomainResponse, AWSError>;
  /**
   * Disables and deletes the specified event stream.
   */
  deleteEventStream(params: CustomerProfiles.Types.DeleteEventStreamRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteEventStreamResponse) => void): Request<CustomerProfiles.Types.DeleteEventStreamResponse, AWSError>;
  /**
   * Disables and deletes the specified event stream.
   */
  deleteEventStream(callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteEventStreamResponse) => void): Request<CustomerProfiles.Types.DeleteEventStreamResponse, AWSError>;
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
   * Deletes the specified workflow and all its corresponding resources. This is an async process.
   */
  deleteWorkflow(params: CustomerProfiles.Types.DeleteWorkflowRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteWorkflowResponse) => void): Request<CustomerProfiles.Types.DeleteWorkflowResponse, AWSError>;
  /**
   * Deletes the specified workflow and all its corresponding resources. This is an async process.
   */
  deleteWorkflow(callback?: (err: AWSError, data: CustomerProfiles.Types.DeleteWorkflowResponse) => void): Request<CustomerProfiles.Types.DeleteWorkflowResponse, AWSError>;
  /**
   * Tests the auto-merging settings of your Identity Resolution Job without merging your data. It randomly selects a sample of matching groups from the existing matching results, and applies the automerging settings that you provided. You can then view the number of profiles in the sample, the number of matches, and the number of profiles identified to be merged. This enables you to evaluate the accuracy of the attributes in your matching list.  You can't view which profiles are matched and would be merged.  We strongly recommend you use this API to do a dry run of the automerging process before running the Identity Resolution Job. Include at least two matching attributes. If your matching list includes too few attributes (such as only FirstName or only LastName), there may be a large number of matches. This increases the chances of erroneous merges. 
   */
  getAutoMergingPreview(params: CustomerProfiles.Types.GetAutoMergingPreviewRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetAutoMergingPreviewResponse) => void): Request<CustomerProfiles.Types.GetAutoMergingPreviewResponse, AWSError>;
  /**
   * Tests the auto-merging settings of your Identity Resolution Job without merging your data. It randomly selects a sample of matching groups from the existing matching results, and applies the automerging settings that you provided. You can then view the number of profiles in the sample, the number of matches, and the number of profiles identified to be merged. This enables you to evaluate the accuracy of the attributes in your matching list.  You can't view which profiles are matched and would be merged.  We strongly recommend you use this API to do a dry run of the automerging process before running the Identity Resolution Job. Include at least two matching attributes. If your matching list includes too few attributes (such as only FirstName or only LastName), there may be a large number of matches. This increases the chances of erroneous merges. 
   */
  getAutoMergingPreview(callback?: (err: AWSError, data: CustomerProfiles.Types.GetAutoMergingPreviewResponse) => void): Request<CustomerProfiles.Types.GetAutoMergingPreviewResponse, AWSError>;
  /**
   * Provides more information on a calculated attribute definition for Customer Profiles.
   */
  getCalculatedAttributeDefinition(params: CustomerProfiles.Types.GetCalculatedAttributeDefinitionRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetCalculatedAttributeDefinitionResponse) => void): Request<CustomerProfiles.Types.GetCalculatedAttributeDefinitionResponse, AWSError>;
  /**
   * Provides more information on a calculated attribute definition for Customer Profiles.
   */
  getCalculatedAttributeDefinition(callback?: (err: AWSError, data: CustomerProfiles.Types.GetCalculatedAttributeDefinitionResponse) => void): Request<CustomerProfiles.Types.GetCalculatedAttributeDefinitionResponse, AWSError>;
  /**
   * Retrieve a calculated attribute for a customer profile.
   */
  getCalculatedAttributeForProfile(params: CustomerProfiles.Types.GetCalculatedAttributeForProfileRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetCalculatedAttributeForProfileResponse) => void): Request<CustomerProfiles.Types.GetCalculatedAttributeForProfileResponse, AWSError>;
  /**
   * Retrieve a calculated attribute for a customer profile.
   */
  getCalculatedAttributeForProfile(callback?: (err: AWSError, data: CustomerProfiles.Types.GetCalculatedAttributeForProfileResponse) => void): Request<CustomerProfiles.Types.GetCalculatedAttributeForProfileResponse, AWSError>;
  /**
   * Returns information about a specific domain.
   */
  getDomain(params: CustomerProfiles.Types.GetDomainRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetDomainResponse) => void): Request<CustomerProfiles.Types.GetDomainResponse, AWSError>;
  /**
   * Returns information about a specific domain.
   */
  getDomain(callback?: (err: AWSError, data: CustomerProfiles.Types.GetDomainResponse) => void): Request<CustomerProfiles.Types.GetDomainResponse, AWSError>;
  /**
   * Returns information about the specified event stream in a specific domain.
   */
  getEventStream(params: CustomerProfiles.Types.GetEventStreamRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetEventStreamResponse) => void): Request<CustomerProfiles.Types.GetEventStreamResponse, AWSError>;
  /**
   * Returns information about the specified event stream in a specific domain.
   */
  getEventStream(callback?: (err: AWSError, data: CustomerProfiles.Types.GetEventStreamResponse) => void): Request<CustomerProfiles.Types.GetEventStreamResponse, AWSError>;
  /**
   * Returns information about an Identity Resolution Job in a specific domain.  Identity Resolution Jobs are set up using the Amazon Connect admin console. For more information, see Use Identity Resolution to consolidate similar profiles.
   */
  getIdentityResolutionJob(params: CustomerProfiles.Types.GetIdentityResolutionJobRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetIdentityResolutionJobResponse) => void): Request<CustomerProfiles.Types.GetIdentityResolutionJobResponse, AWSError>;
  /**
   * Returns information about an Identity Resolution Job in a specific domain.  Identity Resolution Jobs are set up using the Amazon Connect admin console. For more information, see Use Identity Resolution to consolidate similar profiles.
   */
  getIdentityResolutionJob(callback?: (err: AWSError, data: CustomerProfiles.Types.GetIdentityResolutionJobResponse) => void): Request<CustomerProfiles.Types.GetIdentityResolutionJobResponse, AWSError>;
  /**
   * Returns an integration for a domain.
   */
  getIntegration(params: CustomerProfiles.Types.GetIntegrationRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetIntegrationResponse) => void): Request<CustomerProfiles.Types.GetIntegrationResponse, AWSError>;
  /**
   * Returns an integration for a domain.
   */
  getIntegration(callback?: (err: AWSError, data: CustomerProfiles.Types.GetIntegrationResponse) => void): Request<CustomerProfiles.Types.GetIntegrationResponse, AWSError>;
  /**
   * Before calling this API, use CreateDomain or UpdateDomain to enable identity resolution: set Matching to true. GetMatches returns potentially matching profiles, based on the results of the latest run of a machine learning process.   The process of matching duplicate profiles. If Matching = true, Amazon Connect Customer Profiles starts a weekly batch process called Identity Resolution Job. If you do not specify a date and time for Identity Resolution Job to run, by default it runs every Saturday at 12AM UTC to detect duplicate profiles in your domains.  After the Identity Resolution Job completes, use the GetMatches API to return and review the results. Or, if you have configured ExportingConfig in the MatchingRequest, you can download the results from S3.  Amazon Connect uses the following profile attributes to identify matches:   PhoneNumber   HomePhoneNumber   BusinessPhoneNumber   MobilePhoneNumber   EmailAddress   PersonalEmailAddress   BusinessEmailAddress   FullName   For example, two or more profiles—with spelling mistakes such as John Doe and Jhn Doe, or different casing email addresses such as JOHN_DOE@ANYCOMPANY.COM and johndoe@anycompany.com, or different phone number formats such as 555-010-0000 and +1-555-010-0000—can be detected as belonging to the same customer John Doe and merged into a unified profile.
   */
  getMatches(params: CustomerProfiles.Types.GetMatchesRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetMatchesResponse) => void): Request<CustomerProfiles.Types.GetMatchesResponse, AWSError>;
  /**
   * Before calling this API, use CreateDomain or UpdateDomain to enable identity resolution: set Matching to true. GetMatches returns potentially matching profiles, based on the results of the latest run of a machine learning process.   The process of matching duplicate profiles. If Matching = true, Amazon Connect Customer Profiles starts a weekly batch process called Identity Resolution Job. If you do not specify a date and time for Identity Resolution Job to run, by default it runs every Saturday at 12AM UTC to detect duplicate profiles in your domains.  After the Identity Resolution Job completes, use the GetMatches API to return and review the results. Or, if you have configured ExportingConfig in the MatchingRequest, you can download the results from S3.  Amazon Connect uses the following profile attributes to identify matches:   PhoneNumber   HomePhoneNumber   BusinessPhoneNumber   MobilePhoneNumber   EmailAddress   PersonalEmailAddress   BusinessEmailAddress   FullName   For example, two or more profiles—with spelling mistakes such as John Doe and Jhn Doe, or different casing email addresses such as JOHN_DOE@ANYCOMPANY.COM and johndoe@anycompany.com, or different phone number formats such as 555-010-0000 and +1-555-010-0000—can be detected as belonging to the same customer John Doe and merged into a unified profile.
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
   * Returns a set of profiles that belong to the same matching group using the matchId or profileId. You can also specify the type of matching that you want for finding similar profiles using either RULE_BASED_MATCHING or ML_BASED_MATCHING.
   */
  getSimilarProfiles(params: CustomerProfiles.Types.GetSimilarProfilesRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetSimilarProfilesResponse) => void): Request<CustomerProfiles.Types.GetSimilarProfilesResponse, AWSError>;
  /**
   * Returns a set of profiles that belong to the same matching group using the matchId or profileId. You can also specify the type of matching that you want for finding similar profiles using either RULE_BASED_MATCHING or ML_BASED_MATCHING.
   */
  getSimilarProfiles(callback?: (err: AWSError, data: CustomerProfiles.Types.GetSimilarProfilesResponse) => void): Request<CustomerProfiles.Types.GetSimilarProfilesResponse, AWSError>;
  /**
   * Get details of specified workflow.
   */
  getWorkflow(params: CustomerProfiles.Types.GetWorkflowRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetWorkflowResponse) => void): Request<CustomerProfiles.Types.GetWorkflowResponse, AWSError>;
  /**
   * Get details of specified workflow.
   */
  getWorkflow(callback?: (err: AWSError, data: CustomerProfiles.Types.GetWorkflowResponse) => void): Request<CustomerProfiles.Types.GetWorkflowResponse, AWSError>;
  /**
   * Get granular list of steps in workflow.
   */
  getWorkflowSteps(params: CustomerProfiles.Types.GetWorkflowStepsRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.GetWorkflowStepsResponse) => void): Request<CustomerProfiles.Types.GetWorkflowStepsResponse, AWSError>;
  /**
   * Get granular list of steps in workflow.
   */
  getWorkflowSteps(callback?: (err: AWSError, data: CustomerProfiles.Types.GetWorkflowStepsResponse) => void): Request<CustomerProfiles.Types.GetWorkflowStepsResponse, AWSError>;
  /**
   * Lists all of the integrations associated to a specific URI in the AWS account.
   */
  listAccountIntegrations(params: CustomerProfiles.Types.ListAccountIntegrationsRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListAccountIntegrationsResponse) => void): Request<CustomerProfiles.Types.ListAccountIntegrationsResponse, AWSError>;
  /**
   * Lists all of the integrations associated to a specific URI in the AWS account.
   */
  listAccountIntegrations(callback?: (err: AWSError, data: CustomerProfiles.Types.ListAccountIntegrationsResponse) => void): Request<CustomerProfiles.Types.ListAccountIntegrationsResponse, AWSError>;
  /**
   * Lists calculated attribute definitions for Customer Profiles
   */
  listCalculatedAttributeDefinitions(params: CustomerProfiles.Types.ListCalculatedAttributeDefinitionsRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListCalculatedAttributeDefinitionsResponse) => void): Request<CustomerProfiles.Types.ListCalculatedAttributeDefinitionsResponse, AWSError>;
  /**
   * Lists calculated attribute definitions for Customer Profiles
   */
  listCalculatedAttributeDefinitions(callback?: (err: AWSError, data: CustomerProfiles.Types.ListCalculatedAttributeDefinitionsResponse) => void): Request<CustomerProfiles.Types.ListCalculatedAttributeDefinitionsResponse, AWSError>;
  /**
   * Retrieve a list of calculated attributes for a customer profile.
   */
  listCalculatedAttributesForProfile(params: CustomerProfiles.Types.ListCalculatedAttributesForProfileRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListCalculatedAttributesForProfileResponse) => void): Request<CustomerProfiles.Types.ListCalculatedAttributesForProfileResponse, AWSError>;
  /**
   * Retrieve a list of calculated attributes for a customer profile.
   */
  listCalculatedAttributesForProfile(callback?: (err: AWSError, data: CustomerProfiles.Types.ListCalculatedAttributesForProfileResponse) => void): Request<CustomerProfiles.Types.ListCalculatedAttributesForProfileResponse, AWSError>;
  /**
   * Returns a list of all the domains for an AWS account that have been created.
   */
  listDomains(params: CustomerProfiles.Types.ListDomainsRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListDomainsResponse) => void): Request<CustomerProfiles.Types.ListDomainsResponse, AWSError>;
  /**
   * Returns a list of all the domains for an AWS account that have been created.
   */
  listDomains(callback?: (err: AWSError, data: CustomerProfiles.Types.ListDomainsResponse) => void): Request<CustomerProfiles.Types.ListDomainsResponse, AWSError>;
  /**
   * Returns a list of all the event streams in a specific domain.
   */
  listEventStreams(params: CustomerProfiles.Types.ListEventStreamsRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListEventStreamsResponse) => void): Request<CustomerProfiles.Types.ListEventStreamsResponse, AWSError>;
  /**
   * Returns a list of all the event streams in a specific domain.
   */
  listEventStreams(callback?: (err: AWSError, data: CustomerProfiles.Types.ListEventStreamsResponse) => void): Request<CustomerProfiles.Types.ListEventStreamsResponse, AWSError>;
  /**
   * Lists all of the Identity Resolution Jobs in your domain. The response sorts the list by JobStartTime.
   */
  listIdentityResolutionJobs(params: CustomerProfiles.Types.ListIdentityResolutionJobsRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListIdentityResolutionJobsResponse) => void): Request<CustomerProfiles.Types.ListIdentityResolutionJobsResponse, AWSError>;
  /**
   * Lists all of the Identity Resolution Jobs in your domain. The response sorts the list by JobStartTime.
   */
  listIdentityResolutionJobs(callback?: (err: AWSError, data: CustomerProfiles.Types.ListIdentityResolutionJobsResponse) => void): Request<CustomerProfiles.Types.ListIdentityResolutionJobsResponse, AWSError>;
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
   * Returns a set of MatchIds that belong to the given domain.
   */
  listRuleBasedMatches(params: CustomerProfiles.Types.ListRuleBasedMatchesRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListRuleBasedMatchesResponse) => void): Request<CustomerProfiles.Types.ListRuleBasedMatchesResponse, AWSError>;
  /**
   * Returns a set of MatchIds that belong to the given domain.
   */
  listRuleBasedMatches(callback?: (err: AWSError, data: CustomerProfiles.Types.ListRuleBasedMatchesResponse) => void): Request<CustomerProfiles.Types.ListRuleBasedMatchesResponse, AWSError>;
  /**
   * Displays the tags associated with an Amazon Connect Customer Profiles resource. In Connect Customer Profiles, domains, profile object types, and integrations can be tagged.
   */
  listTagsForResource(params: CustomerProfiles.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListTagsForResourceResponse) => void): Request<CustomerProfiles.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Displays the tags associated with an Amazon Connect Customer Profiles resource. In Connect Customer Profiles, domains, profile object types, and integrations can be tagged.
   */
  listTagsForResource(callback?: (err: AWSError, data: CustomerProfiles.Types.ListTagsForResourceResponse) => void): Request<CustomerProfiles.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Query to list all workflows.
   */
  listWorkflows(params: CustomerProfiles.Types.ListWorkflowsRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.ListWorkflowsResponse) => void): Request<CustomerProfiles.Types.ListWorkflowsResponse, AWSError>;
  /**
   * Query to list all workflows.
   */
  listWorkflows(callback?: (err: AWSError, data: CustomerProfiles.Types.ListWorkflowsResponse) => void): Request<CustomerProfiles.Types.ListWorkflowsResponse, AWSError>;
  /**
   * Runs an AWS Lambda job that does the following:   All the profileKeys in the ProfileToBeMerged will be moved to the main profile.   All the objects in the ProfileToBeMerged will be moved to the main profile.   All the ProfileToBeMerged will be deleted at the end.   All the profileKeys in the ProfileIdsToBeMerged will be moved to the main profile.   Standard fields are merged as follows:   Fields are always "union"-ed if there are no conflicts in standard fields or attributeKeys.   When there are conflicting fields:   If no SourceProfileIds entry is specified, the main Profile value is always taken.    If a SourceProfileIds entry is specified, the specified profileId is always taken, even if it is a NULL value.       You can use MergeProfiles together with GetMatches, which returns potentially matching profiles, or use it with the results of another matching system. After profiles have been merged, they cannot be separated (unmerged).
   */
  mergeProfiles(params: CustomerProfiles.Types.MergeProfilesRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.MergeProfilesResponse) => void): Request<CustomerProfiles.Types.MergeProfilesResponse, AWSError>;
  /**
   * Runs an AWS Lambda job that does the following:   All the profileKeys in the ProfileToBeMerged will be moved to the main profile.   All the objects in the ProfileToBeMerged will be moved to the main profile.   All the ProfileToBeMerged will be deleted at the end.   All the profileKeys in the ProfileIdsToBeMerged will be moved to the main profile.   Standard fields are merged as follows:   Fields are always "union"-ed if there are no conflicts in standard fields or attributeKeys.   When there are conflicting fields:   If no SourceProfileIds entry is specified, the main Profile value is always taken.    If a SourceProfileIds entry is specified, the specified profileId is always taken, even if it is a NULL value.       You can use MergeProfiles together with GetMatches, which returns potentially matching profiles, or use it with the results of another matching system. After profiles have been merged, they cannot be separated (unmerged).
   */
  mergeProfiles(callback?: (err: AWSError, data: CustomerProfiles.Types.MergeProfilesResponse) => void): Request<CustomerProfiles.Types.MergeProfilesResponse, AWSError>;
  /**
   * Adds an integration between the service and a third-party service, which includes Amazon AppFlow and Amazon Connect. An integration can belong to only one domain. To add or remove tags on an existing Integration, see  TagResource / UntagResource.
   */
  putIntegration(params: CustomerProfiles.Types.PutIntegrationRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.PutIntegrationResponse) => void): Request<CustomerProfiles.Types.PutIntegrationResponse, AWSError>;
  /**
   * Adds an integration between the service and a third-party service, which includes Amazon AppFlow and Amazon Connect. An integration can belong to only one domain. To add or remove tags on an existing Integration, see  TagResource / UntagResource.
   */
  putIntegration(callback?: (err: AWSError, data: CustomerProfiles.Types.PutIntegrationResponse) => void): Request<CustomerProfiles.Types.PutIntegrationResponse, AWSError>;
  /**
   * Adds additional objects to customer profiles of a given ObjectType. When adding a specific profile object, like a Contact Record, an inferred profile can get created if it is not mapped to an existing profile. The resulting profile will only have a phone number populated in the standard ProfileObject. Any additional Contact Records with the same phone number will be mapped to the same inferred profile. When a ProfileObject is created and if a ProfileObjectType already exists for the ProfileObject, it will provide data to a standard profile depending on the ProfileObjectType definition. PutProfileObject needs an ObjectType, which can be created using PutProfileObjectType.
   */
  putProfileObject(params: CustomerProfiles.Types.PutProfileObjectRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.PutProfileObjectResponse) => void): Request<CustomerProfiles.Types.PutProfileObjectResponse, AWSError>;
  /**
   * Adds additional objects to customer profiles of a given ObjectType. When adding a specific profile object, like a Contact Record, an inferred profile can get created if it is not mapped to an existing profile. The resulting profile will only have a phone number populated in the standard ProfileObject. Any additional Contact Records with the same phone number will be mapped to the same inferred profile. When a ProfileObject is created and if a ProfileObjectType already exists for the ProfileObject, it will provide data to a standard profile depending on the ProfileObjectType definition. PutProfileObject needs an ObjectType, which can be created using PutProfileObjectType.
   */
  putProfileObject(callback?: (err: AWSError, data: CustomerProfiles.Types.PutProfileObjectResponse) => void): Request<CustomerProfiles.Types.PutProfileObjectResponse, AWSError>;
  /**
   * Defines a ProfileObjectType. To add or remove tags on an existing ObjectType, see  TagResource/UntagResource.
   */
  putProfileObjectType(params: CustomerProfiles.Types.PutProfileObjectTypeRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.PutProfileObjectTypeResponse) => void): Request<CustomerProfiles.Types.PutProfileObjectTypeResponse, AWSError>;
  /**
   * Defines a ProfileObjectType. To add or remove tags on an existing ObjectType, see  TagResource/UntagResource.
   */
  putProfileObjectType(callback?: (err: AWSError, data: CustomerProfiles.Types.PutProfileObjectTypeResponse) => void): Request<CustomerProfiles.Types.PutProfileObjectTypeResponse, AWSError>;
  /**
   * Searches for profiles within a specific domain using one or more predefined search keys (e.g., _fullName, _phone, _email, _account, etc.) and/or custom-defined search keys. A search key is a data type pair that consists of a KeyName and Values list. This operation supports searching for profiles with a minimum of 1 key-value(s) pair and up to 5 key-value(s) pairs using either AND or OR logic.
   */
  searchProfiles(params: CustomerProfiles.Types.SearchProfilesRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.SearchProfilesResponse) => void): Request<CustomerProfiles.Types.SearchProfilesResponse, AWSError>;
  /**
   * Searches for profiles within a specific domain using one or more predefined search keys (e.g., _fullName, _phone, _email, _account, etc.) and/or custom-defined search keys. A search key is a data type pair that consists of a KeyName and Values list. This operation supports searching for profiles with a minimum of 1 key-value(s) pair and up to 5 key-value(s) pairs using either AND or OR logic.
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
   * Updates an existing calculated attribute definition. When updating the Conditions, note that increasing the date range of a calculated attribute will not trigger inclusion of historical data greater than the current date range.
   */
  updateCalculatedAttributeDefinition(params: CustomerProfiles.Types.UpdateCalculatedAttributeDefinitionRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.UpdateCalculatedAttributeDefinitionResponse) => void): Request<CustomerProfiles.Types.UpdateCalculatedAttributeDefinitionResponse, AWSError>;
  /**
   * Updates an existing calculated attribute definition. When updating the Conditions, note that increasing the date range of a calculated attribute will not trigger inclusion of historical data greater than the current date range.
   */
  updateCalculatedAttributeDefinition(callback?: (err: AWSError, data: CustomerProfiles.Types.UpdateCalculatedAttributeDefinitionResponse) => void): Request<CustomerProfiles.Types.UpdateCalculatedAttributeDefinitionResponse, AWSError>;
  /**
   * Updates the properties of a domain, including creating or selecting a dead letter queue or an encryption key. After a domain is created, the name can’t be changed. Use this API or CreateDomain to enable identity resolution: set Matching to true. To prevent cross-service impersonation when you call this API, see Cross-service confused deputy prevention for sample policies that you should apply.  To add or remove tags on an existing Domain, see TagResource/UntagResource.
   */
  updateDomain(params: CustomerProfiles.Types.UpdateDomainRequest, callback?: (err: AWSError, data: CustomerProfiles.Types.UpdateDomainResponse) => void): Request<CustomerProfiles.Types.UpdateDomainResponse, AWSError>;
  /**
   * Updates the properties of a domain, including creating or selecting a dead letter queue or an encryption key. After a domain is created, the name can’t be changed. Use this API or CreateDomain to enable identity resolution: set Matching to true. To prevent cross-service impersonation when you call this API, see Cross-service confused deputy prevention for sample policies that you should apply.  To add or remove tags on an existing Domain, see TagResource/UntagResource.
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
     * A searchable identifier of a customer profile. The predefined keys you can use include: _account, _profileId, _assetId, _caseId, _orderId, _fullName, _phone, _email, _ctrContactId, _marketoLeadId, _salesforceAccountId, _salesforceContactId, _salesforceAssetId, _zendeskUserId, _zendeskExternalId, _zendeskTicketId, _serviceNowSystemId, _serviceNowIncidentId, _segmentUserId, _shopifyCustomerId, _shopifyOrderId.
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
  export interface AdditionalSearchKey {
    /**
     * A searchable identifier of a customer profile.
     */
    KeyName: name;
    /**
     * A list of key values.
     */
    Values: requestValueList;
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
  export type AddressList = string1To255[];
  export interface AppflowIntegration {
    FlowDefinition: FlowDefinition;
    /**
     * Batches in workflow of type APPFLOW_INTEGRATION.
     */
    Batches?: Batches;
  }
  export interface AppflowIntegrationWorkflowAttributes {
    /**
     * Specifies the source connector type, such as Salesforce, ServiceNow, and Marketo. Indicates source of ingestion.
     */
    SourceConnectorType: SourceConnectorType;
    /**
     * The name of the AppFlow connector profile used for ingestion.
     */
    ConnectorProfileName: ConnectorProfileName;
    /**
     * The Amazon Resource Name (ARN) of the IAM role. Customer Profiles assumes this role to create resources on your behalf as part of workflow execution.
     */
    RoleArn?: string1To255;
  }
  export interface AppflowIntegrationWorkflowMetrics {
    /**
     * Number of records processed in APPFLOW_INTEGRATION workflow.
     */
    RecordsProcessed: long;
    /**
     * Total steps completed in APPFLOW_INTEGRATION workflow.
     */
    StepsCompleted: long;
    /**
     * Total steps in APPFLOW_INTEGRATION workflow.
     */
    TotalSteps: long;
  }
  export interface AppflowIntegrationWorkflowStep {
    /**
     * Name of the flow created during execution of workflow step. APPFLOW_INTEGRATION workflow type creates an appflow flow during workflow step execution on the customers behalf.
     */
    FlowName: FlowName;
    /**
     * Workflow step status for APPFLOW_INTEGRATION workflow.
     */
    Status: Status;
    /**
     * Message indicating execution of workflow step for APPFLOW_INTEGRATION workflow.
     */
    ExecutionMessage: string1To255;
    /**
     * Total number of records processed during execution of workflow step for APPFLOW_INTEGRATION workflow.
     */
    RecordsProcessed: long;
    /**
     * Start datetime of records pulled in batch during execution of workflow step for APPFLOW_INTEGRATION workflow.
     */
    BatchRecordsStartTime: string1To255;
    /**
     * End datetime of records pulled in batch during execution of workflow step for APPFLOW_INTEGRATION workflow.
     */
    BatchRecordsEndTime: string1To255;
    /**
     * Creation timestamp of workflow step for APPFLOW_INTEGRATION workflow.
     */
    CreatedAt: timestamp;
    /**
     * Last updated timestamp for workflow step for APPFLOW_INTEGRATION workflow.
     */
    LastUpdatedAt: timestamp;
  }
  export interface AttributeDetails {
    /**
     * A list of attribute items specified in the mathematical expression.
     */
    Attributes: AttributeList;
    /**
     * Mathematical expression that is performed on attribute items provided in the attribute list. Each element in the expression should follow the structure of \"{ObjectTypeName.AttributeName}\".
     */
    Expression: string1To255;
  }
  export interface AttributeItem {
    /**
     * The name of an attribute defined in a profile object type.
     */
    Name: attributeName;
  }
  export type AttributeList = AttributeItem[];
  export type AttributeMatchingModel = "ONE_TO_ONE"|"MANY_TO_MANY"|string;
  export type AttributeSourceIdMap = {[key: string]: uuid};
  export interface AttributeTypesSelector {
    /**
     * Configures the AttributeMatchingModel, you can either choose ONE_TO_ONE or MANY_TO_MANY.
     */
    AttributeMatchingModel: AttributeMatchingModel;
    /**
     * The Address type. You can choose from Address, BusinessAddress, MaillingAddress, and ShippingAddress. You only can use the Address type in the MatchingRule. For example, if you want to match profile based on BusinessAddress.City or MaillingAddress.City, you need to choose the BusinessAddress and the MaillingAddress to represent the Address type and specify the Address.City on the matching rule.
     */
    Address?: AddressList;
    /**
     * The PhoneNumber type. You can choose from PhoneNumber, HomePhoneNumber, and MobilePhoneNumber. You only can use the PhoneNumber type in the MatchingRule. For example, if you want to match a profile based on Phone or HomePhone, you need to choose the Phone and the HomePhone to represent the PhoneNumber type and only specify the PhoneNumber on the matching rule.
     */
    PhoneNumber?: PhoneNumberList;
    /**
     * The Email type. You can choose from EmailAddress, BusinessEmailAddress and PersonalEmailAddress. You only can use the EmailAddress type in the MatchingRule. For example, if you want to match profile based on PersonalEmailAddress or BusinessEmailAddress, you need to choose the PersonalEmailAddress and the BusinessEmailAddress to represent the EmailAddress type and only specify the EmailAddress on the matching rule.
     */
    EmailAddress?: EmailList;
  }
  export type Attributes = {[key: string]: string1To255};
  export interface AutoMerging {
    /**
     * The flag that enables the auto-merging of duplicate profiles.
     */
    Enabled: optionalBoolean;
    /**
     * A list of matching attributes that represent matching criteria. If two profiles meet at least one of the requirements in the matching attributes list, they will be merged.
     */
    Consolidation?: Consolidation;
    /**
     * How the auto-merging process should resolve conflicts between different profiles. For example, if Profile A and Profile B have the same FirstName and LastName (and that is the matching criteria), which EmailAddress should be used? 
     */
    ConflictResolution?: ConflictResolution;
    /**
     * A number between 0 and 1 that represents the minimum confidence score required for profiles within a matching group to be merged during the auto-merge process. A higher score means higher similarity required to merge profiles. 
     */
    MinAllowedConfidenceScoreForMerging?: Double0To1;
  }
  export interface Batch {
    /**
     * Start time of batch to split ingestion.
     */
    StartTime: timestamp;
    /**
     * End time of batch to split ingestion.
     */
    EndTime: timestamp;
  }
  export type Batches = Batch[];
  export type BucketName = string;
  export type BucketPrefix = string;
  export type CalculatedAttributeDefinitionsList = ListCalculatedAttributeDefinitionItem[];
  export type CalculatedAttributesForProfileList = ListCalculatedAttributeForProfileItem[];
  export interface Conditions {
    /**
     * The relative time period over which data is included in the aggregation.
     */
    Range?: Range;
    /**
     * The number of profile objects used for the calculated attribute.
     */
    ObjectCount?: ObjectCount;
    /**
     * The threshold for the calculated attribute.
     */
    Threshold?: Threshold;
  }
  export interface ConflictResolution {
    /**
     * How the auto-merging process should resolve conflicts between different profiles.    RECENCY: Uses the data that was most recently updated.    SOURCE: Uses the data from a specific source. For example, if a company has been aquired or two departments have merged, data from the specified source is used. If two duplicate profiles are from the same source, then RECENCY is used again.  
     */
    ConflictResolvingModel: ConflictResolvingModel;
    /**
     * The ObjectType name that is used to resolve profile merging conflicts when choosing SOURCE as the ConflictResolvingModel.
     */
    SourceName?: string1To255;
  }
  export type ConflictResolvingModel = "RECENCY"|"SOURCE"|string;
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
  export interface Consolidation {
    /**
     * A list of matching criteria.
     */
    MatchingAttributesList: MatchingAttributesList;
  }
  export interface CreateCalculatedAttributeDefinitionRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The unique name of the calculated attribute.
     */
    CalculatedAttributeName: typeName;
    /**
     * The display name of the calculated attribute.
     */
    DisplayName?: displayName;
    /**
     * The description of the calculated attribute.
     */
    Description?: sensitiveText;
    /**
     * Mathematical expression and a list of attribute items specified in that expression.
     */
    AttributeDetails: AttributeDetails;
    /**
     * The conditions including range, object count, and threshold for the calculated attribute.
     */
    Conditions?: Conditions;
    /**
     * The aggregation operation to perform for the calculated attribute.
     */
    Statistic: Statistic;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface CreateCalculatedAttributeDefinitionResponse {
    /**
     * The unique name of the calculated attribute.
     */
    CalculatedAttributeName?: typeName;
    /**
     * The display name of the calculated attribute.
     */
    DisplayName?: displayName;
    /**
     * The description of the calculated attribute.
     */
    Description?: sensitiveText;
    /**
     * Mathematical expression and a list of attribute items specified in that expression.
     */
    AttributeDetails?: AttributeDetails;
    /**
     * The conditions including range, object count, and threshold for the calculated attribute.
     */
    Conditions?: Conditions;
    /**
     * The aggregation operation to perform for the calculated attribute.
     */
    Statistic?: Statistic;
    /**
     * The timestamp of when the calculated attribute definition was created.
     */
    CreatedAt?: timestamp;
    /**
     * The timestamp of when the calculated attribute definition was most recently edited.
     */
    LastUpdatedAt?: timestamp;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
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
     * The process of matching duplicate profiles. If Matching = true, Amazon Connect Customer Profiles starts a weekly batch process called Identity Resolution Job. If you do not specify a date and time for Identity Resolution Job to run, by default it runs every Saturday at 12AM UTC to detect duplicate profiles in your domains.  After the Identity Resolution Job completes, use the GetMatches API to return and review the results. Or, if you have configured ExportingConfig in the MatchingRequest, you can download the results from S3.
     */
    Matching?: MatchingRequest;
    /**
     * The process of matching duplicate profiles using the Rule-Based matching. If RuleBasedMatching = true, Amazon Connect Customer Profiles will start to match and merge your profiles according to your configuration in the RuleBasedMatchingRequest. You can use the ListRuleBasedMatches and GetSimilarProfiles API to return and review the results. Also, if you have configured ExportingConfig in the RuleBasedMatchingRequest, you can download the results from S3.
     */
    RuleBasedMatching?: RuleBasedMatchingRequest;
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
     * The process of matching duplicate profiles. If Matching = true, Amazon Connect Customer Profiles starts a weekly batch process called Identity Resolution Job. If you do not specify a date and time for Identity Resolution Job to run, by default it runs every Saturday at 12AM UTC to detect duplicate profiles in your domains.  After the Identity Resolution Job completes, use the GetMatches API to return and review the results. Or, if you have configured ExportingConfig in the MatchingRequest, you can download the results from S3.
     */
    Matching?: MatchingResponse;
    /**
     * The process of matching duplicate profiles using the Rule-Based matching. If RuleBasedMatching = true, Amazon Connect Customer Profiles will start to match and merge your profiles according to your configuration in the RuleBasedMatchingRequest. You can use the ListRuleBasedMatches and GetSimilarProfiles API to return and review the results. Also, if you have configured ExportingConfig in the RuleBasedMatchingRequest, you can download the results from S3.
     */
    RuleBasedMatching?: RuleBasedMatchingResponse;
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
  export interface CreateEventStreamRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The StreamARN of the destination to deliver profile events to. For example, arn:aws:kinesis:region:account-id:stream/stream-name
     */
    Uri: string1To255;
    /**
     * The name of the event stream.
     */
    EventStreamName: name;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface CreateEventStreamResponse {
    /**
     * A unique identifier for the event stream.
     */
    EventStreamArn: string1To255;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface CreateIntegrationWorkflowRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The type of workflow. The only supported value is APPFLOW_INTEGRATION.
     */
    WorkflowType: WorkflowType;
    /**
     * Configuration data for integration workflow.
     */
    IntegrationConfig: IntegrationConfig;
    /**
     * The name of the profile object type.
     */
    ObjectTypeName: typeName;
    /**
     * The Amazon Resource Name (ARN) of the IAM role. Customer Profiles assumes this role to create resources on your behalf as part of workflow execution.
     */
    RoleArn: RoleArn;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface CreateIntegrationWorkflowResponse {
    /**
     * Unique identifier for the workflow.
     */
    WorkflowId: uuid;
    /**
     * A message indicating create request was received.
     */
    Message: string1To255;
  }
  export interface CreateProfileRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * A unique account number that you have given to the customer.
     */
    AccountNumber?: sensitiveString1To255;
    /**
     * Any additional information relevant to the customer’s profile.
     */
    AdditionalInformation?: sensitiveString1To1000;
    /**
     * The type of profile used to describe the customer.
     */
    PartyType?: PartyType;
    /**
     * The name of the customer’s business.
     */
    BusinessName?: sensitiveString1To255;
    /**
     * The customer’s first name.
     */
    FirstName?: sensitiveString1To255;
    /**
     * The customer’s middle name.
     */
    MiddleName?: sensitiveString1To255;
    /**
     * The customer’s last name.
     */
    LastName?: sensitiveString1To255;
    /**
     * The customer’s birth date. 
     */
    BirthDate?: sensitiveString1To255;
    /**
     * The gender with which the customer identifies. 
     */
    Gender?: Gender;
    /**
     * The customer’s phone number, which has not been specified as a mobile, home, or business number. 
     */
    PhoneNumber?: sensitiveString1To255;
    /**
     * The customer’s mobile phone number.
     */
    MobilePhoneNumber?: sensitiveString1To255;
    /**
     * The customer’s home phone number.
     */
    HomePhoneNumber?: sensitiveString1To255;
    /**
     * The customer’s business phone number.
     */
    BusinessPhoneNumber?: sensitiveString1To255;
    /**
     * The customer’s email address, which has not been specified as a personal or business address. 
     */
    EmailAddress?: sensitiveString1To255;
    /**
     * The customer’s personal email address.
     */
    PersonalEmailAddress?: sensitiveString1To255;
    /**
     * The customer’s business email address.
     */
    BusinessEmailAddress?: sensitiveString1To255;
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
    /**
     * An alternative to PartyType which accepts any string as input.
     */
    PartyTypeString?: sensitiveString1To255;
    /**
     * An alternative to Gender which accepts any string as input.
     */
    GenderString?: sensitiveString1To255;
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
  export interface DeleteCalculatedAttributeDefinitionRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The unique name of the calculated attribute.
     */
    CalculatedAttributeName: typeName;
  }
  export interface DeleteCalculatedAttributeDefinitionResponse {
  }
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
  export interface DeleteEventStreamRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The name of the event stream
     */
    EventStreamName: name;
  }
  export interface DeleteEventStreamResponse {
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
  export interface DeleteWorkflowRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * Unique identifier for the workflow.
     */
    WorkflowId: string1To255;
  }
  export interface DeleteWorkflowResponse {
  }
  export type DestinationField = string;
  export interface DestinationSummary {
    /**
     * The StreamARN of the destination to deliver profile events to. For example, arn:aws:kinesis:region:account-id:stream/stream-name.
     */
    Uri: string1To255;
    /**
     * The status of enabling the Kinesis stream as a destination for export.
     */
    Status: EventStreamDestinationStatus;
    /**
     * The timestamp when the status last changed to UNHEALHY.
     */
    UnhealthySince?: timestamp;
  }
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
  export type Double = number;
  export type Double0To1 = number;
  export type EmailList = string1To255[];
  export interface EventStreamDestinationDetails {
    /**
     * The StreamARN of the destination to deliver profile events to. For example, arn:aws:kinesis:region:account-id:stream/stream-name.
     */
    Uri: string1To255;
    /**
     * The status of enabling the Kinesis stream as a destination for export.
     */
    Status: EventStreamDestinationStatus;
    /**
     * The timestamp when the status last changed to UNHEALHY.
     */
    UnhealthySince?: timestamp;
    /**
     * The human-readable string that corresponds to the error or success while enabling the streaming destination.
     */
    Message?: string1To1000;
  }
  export type EventStreamDestinationStatus = "HEALTHY"|"UNHEALTHY"|string;
  export type EventStreamState = "RUNNING"|"STOPPED"|string;
  export interface EventStreamSummary {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The name of the event stream.
     */
    EventStreamName: name;
    /**
     * A unique identifier for the event stream.
     */
    EventStreamArn: string1To255;
    /**
     * The operational state of destination stream for export.
     */
    State: EventStreamState;
    /**
     * The timestamp when the State changed to STOPPED.
     */
    StoppedSince?: timestamp;
    /**
     * Summary information about the Kinesis data stream.
     */
    DestinationSummary?: DestinationSummary;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export type EventStreamSummaryList = EventStreamSummary[];
  export interface ExportingConfig {
    /**
     * The S3 location where Identity Resolution Jobs write result files.
     */
    S3Exporting?: S3ExportingConfig;
  }
  export interface ExportingLocation {
    /**
     * Information about the S3 location where Identity Resolution Jobs write result files.
     */
    S3Exporting?: S3ExportingLocation;
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
  export interface FoundByKeyValue {
    /**
     * A searchable identifier of a customer profile.
     */
    KeyName?: name;
    /**
     * A list of key values.
     */
    Values?: requestValueList;
  }
  export type Gender = "MALE"|"FEMALE"|"UNSPECIFIED"|string;
  export interface GetAutoMergingPreviewRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * A list of matching attributes that represent matching criteria.
     */
    Consolidation: Consolidation;
    /**
     * How the auto-merging process should resolve conflicts between different profiles.
     */
    ConflictResolution: ConflictResolution;
    /**
     * Minimum confidence score required for profiles within a matching group to be merged during the auto-merge process.
     */
    MinAllowedConfidenceScoreForMerging?: Double0To1;
  }
  export interface GetAutoMergingPreviewResponse {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The number of match groups in the domain that have been reviewed in this preview dry run.
     */
    NumberOfMatchesInSample?: long;
    /**
     * The number of profiles found in this preview dry run.
     */
    NumberOfProfilesInSample?: long;
    /**
     * The number of profiles that would be merged if this wasn't a preview dry run.
     */
    NumberOfProfilesWillBeMerged?: long;
  }
  export interface GetCalculatedAttributeDefinitionRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The unique name of the calculated attribute.
     */
    CalculatedAttributeName: typeName;
  }
  export interface GetCalculatedAttributeDefinitionResponse {
    /**
     * The unique name of the calculated attribute.
     */
    CalculatedAttributeName?: typeName;
    /**
     * The display name of the calculated attribute.
     */
    DisplayName?: displayName;
    /**
     * The description of the calculated attribute.
     */
    Description?: sensitiveText;
    /**
     * The timestamp of when the calculated attribute definition was created.
     */
    CreatedAt?: timestamp;
    /**
     * The timestamp of when the calculated attribute definition was most recently edited.
     */
    LastUpdatedAt?: timestamp;
    /**
     * The aggregation operation to perform for the calculated attribute.
     */
    Statistic?: Statistic;
    /**
     * The conditions including range, object count, and threshold for the calculated attribute.
     */
    Conditions?: Conditions;
    /**
     * Mathematical expression and a list of attribute items specified in that expression.
     */
    AttributeDetails?: AttributeDetails;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface GetCalculatedAttributeForProfileRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId: uuid;
    /**
     * The unique name of the calculated attribute.
     */
    CalculatedAttributeName: typeName;
  }
  export interface GetCalculatedAttributeForProfileResponse {
    /**
     * The unique name of the calculated attribute.
     */
    CalculatedAttributeName?: typeName;
    /**
     * The display name of the calculated attribute.
     */
    DisplayName?: displayName;
    /**
     * Indicates whether the calculated attribute’s value is based on partial data. If data is partial, it is set to true.
     */
    IsDataPartial?: string1To255;
    /**
     * The value of the calculated attribute.
     */
    Value?: string1To255;
  }
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
     * The process of matching duplicate profiles. If Matching = true, Amazon Connect Customer Profiles starts a weekly batch process called Identity Resolution Job. If you do not specify a date and time for Identity Resolution Job to run, by default it runs every Saturday at 12AM UTC to detect duplicate profiles in your domains.  After the Identity Resolution Job completes, use the GetMatches API to return and review the results. Or, if you have configured ExportingConfig in the MatchingRequest, you can download the results from S3.
     */
    Matching?: MatchingResponse;
    /**
     * The process of matching duplicate profiles using the Rule-Based matching. If RuleBasedMatching = true, Amazon Connect Customer Profiles will start to match and merge your profiles according to your configuration in the RuleBasedMatchingRequest. You can use the ListRuleBasedMatches and GetSimilarProfiles API to return and review the results. Also, if you have configured ExportingConfig in the RuleBasedMatchingRequest, you can download the results from S3.
     */
    RuleBasedMatching?: RuleBasedMatchingResponse;
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
  export interface GetEventStreamRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The name of the event stream provided during create operations.
     */
    EventStreamName: name;
  }
  export interface GetEventStreamResponse {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * A unique identifier for the event stream.
     */
    EventStreamArn: string1To255;
    /**
     * The timestamp of when the export was created.
     */
    CreatedAt: timestamp;
    /**
     * The operational state of destination stream for export.
     */
    State: EventStreamState;
    /**
     * The timestamp when the State changed to STOPPED.
     */
    StoppedSince?: timestamp;
    /**
     * Details regarding the Kinesis stream.
     */
    DestinationDetails: EventStreamDestinationDetails;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface GetIdentityResolutionJobRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The unique identifier of the Identity Resolution Job.
     */
    JobId: uuid;
  }
  export interface GetIdentityResolutionJobResponse {
    /**
     * The unique name of the domain.
     */
    DomainName?: name;
    /**
     * The unique identifier of the Identity Resolution Job.
     */
    JobId?: uuid;
    /**
     * The status of the Identity Resolution Job.    PENDING: The Identity Resolution Job is scheduled but has not started yet. If you turn off the Identity Resolution feature in your domain, jobs in the PENDING state are deleted.    PREPROCESSING: The Identity Resolution Job is loading your data.    FIND_MATCHING: The Identity Resolution Job is using the machine learning model to identify profiles that belong to the same matching group.    MERGING: The Identity Resolution Job is merging duplicate profiles.    COMPLETED: The Identity Resolution Job completed successfully.    PARTIAL_SUCCESS: There's a system error and not all of the data is merged. The Identity Resolution Job writes a message indicating the source of the problem.    FAILED: The Identity Resolution Job did not merge any data. It writes a message indicating the source of the problem.  
     */
    Status?: IdentityResolutionJobStatus;
    /**
     * The error messages that are generated when the Identity Resolution Job runs.
     */
    Message?: stringTo2048;
    /**
     * The timestamp of when the Identity Resolution Job was started or will be started.
     */
    JobStartTime?: timestamp;
    /**
     * The timestamp of when the Identity Resolution Job was completed.
     */
    JobEndTime?: timestamp;
    /**
     * The timestamp of when the Identity Resolution Job was most recently edited.
     */
    LastUpdatedAt?: timestamp;
    /**
     * The timestamp of when the Identity Resolution Job will expire.
     */
    JobExpirationTime?: timestamp;
    /**
     * Configuration settings for how to perform the auto-merging of profiles.
     */
    AutoMerging?: AutoMerging;
    /**
     * The S3 location where the Identity Resolution Job writes result files.
     */
    ExportingLocation?: ExportingLocation;
    /**
     * Statistics about the Identity Resolution Job.
     */
    JobStats?: JobStats;
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
    ObjectTypeName?: typeName;
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
    /**
     * A map in which each key is an event type from an external application such as Segment or Shopify, and each value is an ObjectTypeName (template) used to ingest the event. It supports the following event types: SegmentIdentify, ShopifyCreateCustomers, ShopifyUpdateCustomers, ShopifyCreateDraftOrders, ShopifyUpdateDraftOrders, ShopifyCreateOrders, and ShopifyUpdatedOrders.
     */
    ObjectTypeNames?: ObjectTypeNames;
    /**
     * Unique identifier for the workflow.
     */
    WorkflowId?: string1To255;
    /**
     * Boolean that shows if the Flow that's associated with the Integration is created in Amazon Appflow, or with ObjectTypeName equals _unstructured via API/CLI in flowDefinition.
     */
    IsUnstructured?: optionalBoolean;
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
    Description: sensitiveText;
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
     * The format of your sourceLastUpdatedTimestamp that was previously set up.
     */
    SourceLastUpdatedTimestampFormat?: string1To255;
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
     * The format of your sourceLastUpdatedTimestamp that was previously set up.
     */
    SourceLastUpdatedTimestampFormat?: string1To255;
    /**
     * A map of the name and ObjectType field.
     */
    Fields?: FieldMap;
    /**
     * A list of unique keys that can be used to map data to the profile.
     */
    Keys?: KeyMap;
  }
  export interface GetSimilarProfilesRequest {
    /**
     * The pagination token from the previous GetSimilarProfiles API call.
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
     * Specify the type of matching to get similar profiles for.
     */
    MatchType: MatchType;
    /**
     * The string indicating the search key to be used.
     */
    SearchKey: string1To255;
    /**
     * The string based on SearchKey to be searched for similar profiles.
     */
    SearchValue: string1To255;
  }
  export interface GetSimilarProfilesResponse {
    /**
     * Set of profileIds that belong to the same matching group.
     */
    ProfileIds?: ProfileIdList;
    /**
     * The string matchId that the similar profiles belong to.
     */
    MatchId?: string1To255;
    /**
     * Specify the type of matching to get similar profiles for.
     */
    MatchType?: MatchType;
    /**
     * The integer rule level that the profiles matched on.
     */
    RuleLevel?: RuleLevel;
    /**
     * It only has value when the MatchType is ML_BASED_MATCHING.A number between 0 and 1, where a higher score means higher similarity. Examining match confidence scores lets you distinguish between groups of similar records in which the system is highly confident (which you may decide to merge), groups of similar records about which the system is uncertain (which you may decide to have reviewed by a human), and groups of similar records that the system deems to be unlikely (which you may decide to reject). Given confidence scores vary as per the data input, it should not be used as an absolute measure of matching quality.
     */
    ConfidenceScore?: Double;
    /**
     * The pagination token from the previous GetSimilarProfiles API call.
     */
    NextToken?: token;
  }
  export interface GetWorkflowRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * Unique identifier for the workflow.
     */
    WorkflowId: uuid;
  }
  export interface GetWorkflowResponse {
    /**
     * Unique identifier for the workflow.
     */
    WorkflowId?: uuid;
    /**
     * The type of workflow. The only supported value is APPFLOW_INTEGRATION.
     */
    WorkflowType?: WorkflowType;
    /**
     * Status of workflow execution.
     */
    Status?: Status;
    /**
     * Workflow error messages during execution (if any).
     */
    ErrorDescription?: string1To255;
    /**
     * The timestamp that represents when workflow execution started.
     */
    StartDate?: timestamp;
    /**
     * The timestamp that represents when workflow execution last updated.
     */
    LastUpdatedAt?: timestamp;
    /**
     * Attributes provided for workflow execution.
     */
    Attributes?: WorkflowAttributes;
    /**
     * Workflow specific execution metrics.
     */
    Metrics?: WorkflowMetrics;
  }
  export interface GetWorkflowStepsRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * Unique identifier for the workflow.
     */
    WorkflowId: uuid;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: token;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: maxSize100;
  }
  export interface GetWorkflowStepsResponse {
    /**
     * Unique identifier for the workflow.
     */
    WorkflowId?: uuid;
    /**
     * The type of workflow. The only supported value is APPFLOW_INTEGRATION.
     */
    WorkflowType?: WorkflowType;
    /**
     * List containing workflow step details.
     */
    Items?: WorkflowStepsList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: token;
  }
  export interface IdentityResolutionJob {
    /**
     * The unique name of the domain.
     */
    DomainName?: name;
    /**
     * The unique identifier of the Identity Resolution Job.
     */
    JobId?: uuid;
    /**
     * The status of the Identity Resolution Job.    PENDING: The Identity Resolution Job is scheduled but has not started yet. If you turn off the Identity Resolution feature in your domain, jobs in the PENDING state are deleted.    PREPROCESSING: The Identity Resolution Job is loading your data.    FIND_MATCHING: The Identity Resolution Job is using the machine learning model to identify profiles that belong to the same matching group.    MERGING: The Identity Resolution Job is merging duplicate profiles.    COMPLETED: The Identity Resolution Job completed successfully.    PARTIAL_SUCCESS: There's a system error and not all of the data is merged. The Identity Resolution Job writes a message indicating the source of the problem.    FAILED: The Identity Resolution Job did not merge any data. It writes a message indicating the source of the problem.  
     */
    Status?: IdentityResolutionJobStatus;
    /**
     * The timestamp of when the job was started or will be started.
     */
    JobStartTime?: timestamp;
    /**
     * The timestamp of when the job was completed.
     */
    JobEndTime?: timestamp;
    /**
     * Statistics about an Identity Resolution Job.
     */
    JobStats?: JobStats;
    /**
     * The S3 location where the Identity Resolution Job writes result files.
     */
    ExportingLocation?: ExportingLocation;
    /**
     * The error messages that are generated when the Identity Resolution Job runs.
     */
    Message?: stringTo2048;
  }
  export type IdentityResolutionJobStatus = "PENDING"|"PREPROCESSING"|"FIND_MATCHING"|"MERGING"|"COMPLETED"|"PARTIAL_SUCCESS"|"FAILED"|string;
  export type IdentityResolutionJobsList = IdentityResolutionJob[];
  export interface IncrementalPullConfig {
    /**
     * A field that specifies the date time or timestamp field as the criteria to use when importing incremental records from the source.
     */
    DatetimeTypeFieldName?: DatetimeTypeFieldName;
  }
  export interface IntegrationConfig {
    /**
     * Configuration data for APPFLOW_INTEGRATION workflow type.
     */
    AppflowIntegration?: AppflowIntegration;
  }
  export type IntegrationList = ListIntegrationItem[];
  export interface JobSchedule {
    /**
     * The day when the Identity Resolution Job should run every week.
     */
    DayOfTheWeek: JobScheduleDayOfTheWeek;
    /**
     * The time when the Identity Resolution Job should run every week.
     */
    Time: JobScheduleTime;
  }
  export type JobScheduleDayOfTheWeek = "SUNDAY"|"MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|string;
  export type JobScheduleTime = string;
  export interface JobStats {
    /**
     * The number of profiles reviewed.
     */
    NumberOfProfilesReviewed?: long;
    /**
     * The number of matches found.
     */
    NumberOfMatchesFound?: long;
    /**
     * The number of merges completed.
     */
    NumberOfMergesDone?: long;
  }
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
    /**
     * Boolean to indicate if hidden integration should be returned. Defaults to False.
     */
    IncludeHidden?: optionalBoolean;
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
  export interface ListCalculatedAttributeDefinitionItem {
    /**
     * The unique name of the calculated attribute.
     */
    CalculatedAttributeName?: typeName;
    /**
     * The display name of the calculated attribute.
     */
    DisplayName?: displayName;
    /**
     * The threshold for the calculated attribute.
     */
    Description?: sensitiveText;
    /**
     * The threshold for the calculated attribute.
     */
    CreatedAt?: timestamp;
    /**
     * The timestamp of when the calculated attribute definition was most recently edited.
     */
    LastUpdatedAt?: timestamp;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
  export interface ListCalculatedAttributeDefinitionsRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The pagination token from the previous call to ListCalculatedAttributeDefinitions.
     */
    NextToken?: token;
    /**
     * The maximum number of calculated attribute definitions returned per page.
     */
    MaxResults?: maxSize100;
  }
  export interface ListCalculatedAttributeDefinitionsResponse {
    /**
     * The list of calculated attribute definitions.
     */
    Items?: CalculatedAttributeDefinitionsList;
    /**
     * The pagination token from the previous call to ListCalculatedAttributeDefinitions.
     */
    NextToken?: token;
  }
  export interface ListCalculatedAttributeForProfileItem {
    /**
     * The unique name of the calculated attribute.
     */
    CalculatedAttributeName?: typeName;
    /**
     * The display name of the calculated attribute.
     */
    DisplayName?: displayName;
    /**
     * Indicates whether the calculated attribute’s value is based on partial data. If data is partial, it is set to true.
     */
    IsDataPartial?: string1To255;
    /**
     * The value of the calculated attribute.
     */
    Value?: string1To255;
  }
  export interface ListCalculatedAttributesForProfileRequest {
    /**
     * The pagination token from the previous call to ListCalculatedAttributesForProfile.
     */
    NextToken?: token;
    /**
     * The maximum number of calculated attributes returned per page.
     */
    MaxResults?: maxSize100;
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId: uuid;
  }
  export interface ListCalculatedAttributesForProfileResponse {
    /**
     * The list of calculated attributes.
     */
    Items?: CalculatedAttributesForProfileList;
    /**
     * The pagination token from the previous call to ListCalculatedAttributesForProfile.
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
  export interface ListEventStreamsRequest {
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
  export interface ListEventStreamsResponse {
    /**
     * Contains summary information about an EventStream.
     */
    Items?: EventStreamSummaryList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: token;
  }
  export interface ListIdentityResolutionJobsRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: token;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: maxSize100;
  }
  export interface ListIdentityResolutionJobsResponse {
    /**
     * A list of Identity Resolution Jobs.
     */
    IdentityResolutionJobsList?: IdentityResolutionJobsList;
    /**
     * If there are additional results, this is the token for the next set of results.
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
    ObjectTypeName?: typeName;
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
    /**
     * A map in which each key is an event type from an external application such as Segment or Shopify, and each value is an ObjectTypeName (template) used to ingest the event. It supports the following event types: SegmentIdentify, ShopifyCreateCustomers, ShopifyUpdateCustomers, ShopifyCreateDraftOrders, ShopifyUpdateDraftOrders, ShopifyCreateOrders, and ShopifyUpdatedOrders.
     */
    ObjectTypeNames?: ObjectTypeNames;
    /**
     * Unique identifier for the workflow.
     */
    WorkflowId?: string1To255;
    /**
     * Boolean that shows if the Flow that's associated with the Integration is created in Amazon Appflow, or with ObjectTypeName equals _unstructured via API/CLI in flowDefinition.
     */
    IsUnstructured?: optionalBoolean;
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
    /**
     * Boolean to indicate if hidden integration should be returned. Defaults to False.
     */
    IncludeHidden?: optionalBoolean;
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
     * Applies a filter to the response to include profile objects with the specified index values.
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
  export interface ListRuleBasedMatchesRequest {
    /**
     * The pagination token from the previous ListRuleBasedMatches API call.
     */
    NextToken?: token;
    /**
     * The maximum number of MatchIds returned per page.
     */
    MaxResults?: maxSize100;
    /**
     * The unique name of the domain.
     */
    DomainName: name;
  }
  export interface ListRuleBasedMatchesResponse {
    /**
     * The list of MatchIds for the given domain.
     */
    MatchIds?: MatchIdList;
    /**
     * The pagination token from the previous ListRuleBasedMatches API call.
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
  export interface ListWorkflowsItem {
    /**
     * The type of workflow. The only supported value is APPFLOW_INTEGRATION.
     */
    WorkflowType: WorkflowType;
    /**
     * Unique identifier for the workflow.
     */
    WorkflowId: string1To255;
    /**
     * Status of workflow execution.
     */
    Status: Status;
    /**
     * Description for workflow execution status.
     */
    StatusDescription: string1To255;
    /**
     * Creation timestamp for workflow.
     */
    CreatedAt: timestamp;
    /**
     * Last updated timestamp for workflow.
     */
    LastUpdatedAt: timestamp;
  }
  export interface ListWorkflowsRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The type of workflow. The only supported value is APPFLOW_INTEGRATION.
     */
    WorkflowType?: WorkflowType;
    /**
     * Status of workflow execution.
     */
    Status?: Status;
    /**
     * Retrieve workflows started after timestamp.
     */
    QueryStartDate?: timestamp;
    /**
     * Retrieve workflows ended after timestamp.
     */
    QueryEndDate?: timestamp;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: token;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: maxSize100;
  }
  export interface ListWorkflowsResponse {
    /**
     * List containing workflow details.
     */
    Items?: WorkflowList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: token;
  }
  export type MarketoConnectorOperator = "PROJECTION"|"LESS_THAN"|"GREATER_THAN"|"BETWEEN"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface MarketoSourceProperties {
    /**
     * The object specified in the Marketo flow source.
     */
    Object: Object;
  }
  export type MatchIdList = string1To255[];
  export interface MatchItem {
    /**
     * The unique identifiers for this group of profiles that match.
     */
    MatchId?: string1To255;
    /**
     * A list of identifiers for profiles that match.
     */
    ProfileIds?: ProfileIdList;
    /**
     * A number between 0 and 1, where a higher score means higher similarity. Examining match confidence scores lets you distinguish between groups of similar records in which the system is highly confident (which you may decide to merge), groups of similar records about which the system is uncertain (which you may decide to have reviewed by a human), and groups of similar records that the system deems to be unlikely (which you may decide to reject). Given confidence scores vary as per the data input, it should not be used an absolute measure of matching quality.
     */
    ConfidenceScore?: Double;
  }
  export type MatchType = "RULE_BASED_MATCHING"|"ML_BASED_MATCHING"|string;
  export type MatchesList = MatchItem[];
  export type MatchingAttributes = string1To255[];
  export type MatchingAttributesList = MatchingAttributes[];
  export interface MatchingRequest {
    /**
     * The flag that enables the matching process of duplicate profiles.
     */
    Enabled: optionalBoolean;
    /**
     * The day and time when do you want to start the Identity Resolution Job every week.
     */
    JobSchedule?: JobSchedule;
    /**
     * Configuration information about the auto-merging process.
     */
    AutoMerging?: AutoMerging;
    /**
     * Configuration information for exporting Identity Resolution results, for example, to an S3 bucket.
     */
    ExportingConfig?: ExportingConfig;
  }
  export interface MatchingResponse {
    /**
     * The flag that enables the matching process of duplicate profiles.
     */
    Enabled?: optionalBoolean;
    /**
     * The day and time when do you want to start the Identity Resolution Job every week.
     */
    JobSchedule?: JobSchedule;
    /**
     * Configuration information about the auto-merging process.
     */
    AutoMerging?: AutoMerging;
    /**
     * Configuration information for exporting Identity Resolution results, for example, to an S3 bucket.
     */
    ExportingConfig?: ExportingConfig;
  }
  export interface MatchingRule {
    /**
     * A single rule level of the MatchRules. Configures how the rule-based matching process should match profiles.
     */
    Rule: MatchingRuleAttributeList;
  }
  export type MatchingRuleAttributeList = string1To255[];
  export type MatchingRules = MatchingRule[];
  export type MaxAllowedRuleLevelForMatching = number;
  export type MaxAllowedRuleLevelForMerging = number;
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
  export type ObjectCount = number;
  export interface ObjectFilter {
    /**
     * A searchable identifier of a profile object. The predefined keys you can use to search for _asset include: _assetId, _assetName, and _serialNumber. The predefined keys you can use to search for _case include: _caseId. The predefined keys you can use to search for _order include: _orderId.
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
     * The types of keys that a ProfileObject can have. Each ProfileObject can have only 1 UNIQUE key but multiple PROFILE keys. PROFILE, ASSET, CASE, or ORDER means that this key can be used to tie an object to a PROFILE, ASSET, CASE, or ORDER respectively. UNIQUE means that it can be used to uniquely identify an object. If a key a is marked as SECONDARY, it will be used to search for profiles after all other PROFILE keys have been searched. A LOOKUP_ONLY key is only used to match a profile but is not persisted to be used for searching of the profile. A NEW_ONLY key is only used if the profile does not already exist before the object is ingested, otherwise it is only used for matching objects to profiles.
     */
    StandardIdentifiers?: StandardIdentifierList;
    /**
     * The reference for the key name of the fields map.
     */
    FieldNames?: FieldNameList;
  }
  export type ObjectTypeKeyList = ObjectTypeKey[];
  export type ObjectTypeNames = {[key: string]: typeName};
  export type Operator = "EQUAL_TO"|"GREATER_THAN"|"LESS_THAN"|"NOT_EQUAL_TO"|string;
  export type OperatorPropertiesKeys = "VALUE"|"VALUES"|"DATA_TYPE"|"UPPER_BOUND"|"LOWER_BOUND"|"SOURCE_DATA_TYPE"|"DESTINATION_DATA_TYPE"|"VALIDATION_ACTION"|"MASK_VALUE"|"MASK_LENGTH"|"TRUNCATE_LENGTH"|"MATH_OPERATION_FIELDS_ORDER"|"CONCAT_FORMAT"|"SUBFIELD_CATEGORY_MAP"|string;
  export type PartyType = "INDIVIDUAL"|"BUSINESS"|"OTHER"|string;
  export type PhoneNumberList = string1To255[];
  export interface Profile {
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId?: uuid;
    /**
     * A unique account number that you have given to the customer.
     */
    AccountNumber?: sensitiveString1To255;
    /**
     * Any additional information relevant to the customer’s profile.
     */
    AdditionalInformation?: sensitiveString1To1000;
    /**
     * The type of profile used to describe the customer.
     */
    PartyType?: PartyType;
    /**
     * The name of the customer’s business.
     */
    BusinessName?: sensitiveString1To255;
    /**
     * The customer’s first name.
     */
    FirstName?: sensitiveString1To255;
    /**
     * The customer’s middle name.
     */
    MiddleName?: sensitiveString1To255;
    /**
     * The customer’s last name.
     */
    LastName?: sensitiveString1To255;
    /**
     * The customer’s birth date. 
     */
    BirthDate?: sensitiveString1To255;
    /**
     * The gender with which the customer identifies. 
     */
    Gender?: Gender;
    /**
     * The customer's phone number, which has not been specified as a mobile, home, or business number.
     */
    PhoneNumber?: sensitiveString1To255;
    /**
     * The customer’s mobile phone number.
     */
    MobilePhoneNumber?: sensitiveString1To255;
    /**
     * The customer’s home phone number.
     */
    HomePhoneNumber?: sensitiveString1To255;
    /**
     * The customer’s home phone number.
     */
    BusinessPhoneNumber?: sensitiveString1To255;
    /**
     * The customer’s email address, which has not been specified as a personal or business address. 
     */
    EmailAddress?: sensitiveString1To255;
    /**
     * The customer’s personal email address.
     */
    PersonalEmailAddress?: sensitiveString1To255;
    /**
     * The customer’s business email address.
     */
    BusinessEmailAddress?: sensitiveString1To255;
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
    /**
     * A list of items used to find a profile returned in a SearchProfiles response. An item is a key-value(s) pair that matches an attribute in the profile. If the optional AdditionalSearchKeys parameter was included in the SearchProfiles request, the FoundByItems list should be interpreted based on the LogicalOperator used in the request:    AND - The profile included in the response matched all of the search keys specified in the request. The FoundByItems will include all of the key-value(s) pairs that were specified in the request (as this is a requirement of AND search logic).    OR - The profile included in the response matched at least one of the search keys specified in the request. The FoundByItems will include each of the key-value(s) pairs that the profile was found by.   The OR relationship is the default behavior if the LogicalOperator parameter is not included in the SearchProfiles request.
     */
    FoundByItems?: foundByList;
    /**
     * An alternative to PartyType which accepts any string as input.
     */
    PartyTypeString?: sensitiveString1To255;
    /**
     * An alternative to Gender which accepts any string as input.
     */
    GenderString?: sensitiveString1To255;
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
    ObjectTypeName?: typeName;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
    /**
     * The configuration that controls how Customer Profiles retrieves data from the source.
     */
    FlowDefinition?: FlowDefinition;
    /**
     * A map in which each key is an event type from an external application such as Segment or Shopify, and each value is an ObjectTypeName (template) used to ingest the event. It supports the following event types: SegmentIdentify, ShopifyCreateCustomers, ShopifyUpdateCustomers, ShopifyCreateDraftOrders, ShopifyUpdateDraftOrders, ShopifyCreateOrders, and ShopifyUpdatedOrders.
     */
    ObjectTypeNames?: ObjectTypeNames;
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
    ObjectTypeName?: typeName;
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
    /**
     * A map in which each key is an event type from an external application such as Segment or Shopify, and each value is an ObjectTypeName (template) used to ingest the event. It supports the following event types: SegmentIdentify, ShopifyCreateCustomers, ShopifyUpdateCustomers, ShopifyCreateDraftOrders, ShopifyUpdateDraftOrders, ShopifyCreateOrders, and ShopifyUpdatedOrders.
     */
    ObjectTypeNames?: ObjectTypeNames;
    /**
     * Unique identifier for the workflow.
     */
    WorkflowId?: string1To255;
    /**
     * Boolean that shows if the Flow that's associated with the Integration is created in Amazon Appflow, or with ObjectTypeName equals _unstructured via API/CLI in flowDefinition.
     */
    IsUnstructured?: optionalBoolean;
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
    Description: sensitiveText;
    /**
     * A unique identifier for the object template. For some attributes in the request, the service will use the default value from the object template when TemplateId is present. If these attributes are present in the request, the service may return a BadRequestException. These attributes include: AllowProfileCreation, SourceLastUpdatedTimestampFormat, Fields, and Keys. For example, if AllowProfileCreation is set to true when TemplateId is set, the service may return a BadRequestException.
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
     * The format of your sourceLastUpdatedTimestamp that was previously set up. 
     */
    SourceLastUpdatedTimestampFormat?: string1To255;
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
    Description: sensitiveText;
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
     * The format of your sourceLastUpdatedTimestamp that was previously set up in fields that were parsed using SimpleDateFormat. If you have sourceLastUpdatedTimestamp in your field, you must set up sourceLastUpdatedTimestampFormat.
     */
    SourceLastUpdatedTimestampFormat?: string1To255;
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
  export interface Range {
    /**
     * The amount of time of the specified unit.
     */
    Value: Value;
    /**
     * The unit of time.
     */
    Unit: Unit;
  }
  export type RoleArn = string;
  export interface RuleBasedMatchingRequest {
    /**
     * The flag that enables the rule-based matching process of duplicate profiles.
     */
    Enabled: optionalBoolean;
    /**
     * Configures how the rule-based matching process should match profiles. You can have up to 15 MatchingRule in the MatchingRules.
     */
    MatchingRules?: MatchingRules;
    /**
     *  MatchingRule 
     */
    MaxAllowedRuleLevelForMerging?: MaxAllowedRuleLevelForMerging;
    /**
     * Indicates the maximum allowed rule level.
     */
    MaxAllowedRuleLevelForMatching?: MaxAllowedRuleLevelForMatching;
    /**
     * Configures information about the AttributeTypesSelector where the rule-based identity resolution uses to match profiles.
     */
    AttributeTypesSelector?: AttributeTypesSelector;
    ConflictResolution?: ConflictResolution;
    ExportingConfig?: ExportingConfig;
  }
  export interface RuleBasedMatchingResponse {
    /**
     * The flag that enables the rule-based matching process of duplicate profiles.
     */
    Enabled?: optionalBoolean;
    /**
     * Configures how the rule-based matching process should match profiles. You can have up to 15 MatchingRule in the MatchingRules.
     */
    MatchingRules?: MatchingRules;
    /**
     * PENDING   The first status after configuration a rule-based matching rule. If it is an existing domain, the rule-based Identity Resolution waits one hour before creating the matching rule. If it is a new domain, the system will skip the PENDING stage.   IN_PROGRESS   The system is creating the rule-based matching rule. Under this status, the system is evaluating the existing data and you can no longer change the Rule-based matching configuration.   ACTIVE   The rule is ready to use. You can change the rule a day after the status is in ACTIVE.  
     */
    Status?: RuleBasedMatchingStatus;
    /**
     *  MatchingRule 
     */
    MaxAllowedRuleLevelForMerging?: MaxAllowedRuleLevelForMerging;
    /**
     * Indicates the maximum allowed rule level.
     */
    MaxAllowedRuleLevelForMatching?: MaxAllowedRuleLevelForMatching;
    /**
     * Configures information about the AttributeTypesSelector where the rule-based identity resolution uses to match profiles.
     */
    AttributeTypesSelector?: AttributeTypesSelector;
    ConflictResolution?: ConflictResolution;
    ExportingConfig?: ExportingConfig;
  }
  export type RuleBasedMatchingStatus = "PENDING"|"IN_PROGRESS"|"ACTIVE"|string;
  export type RuleLevel = number;
  export type S3ConnectorOperator = "PROJECTION"|"LESS_THAN"|"GREATER_THAN"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"NOT_EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface S3ExportingConfig {
    /**
     * The name of the S3 bucket where Identity Resolution Jobs write result files.
     */
    S3BucketName: s3BucketName;
    /**
     * The S3 key name of the location where Identity Resolution Jobs write result files.
     */
    S3KeyName?: s3KeyNameCustomerOutputConfig;
  }
  export interface S3ExportingLocation {
    /**
     * The name of the S3 bucket name where Identity Resolution Jobs write result files.
     */
    S3BucketName?: s3BucketName;
    /**
     * The S3 key name of the location where Identity Resolution Jobs write result files.
     */
    S3KeyName?: s3KeyName;
  }
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
     * The maximum number of objects returned per page. The default is 20 if this parameter is not included in the request.
     */
    MaxResults?: maxSize100;
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * A searchable identifier of a customer profile. The predefined keys you can use to search include: _account, _profileId, _assetId, _caseId, _orderId, _fullName, _phone, _email, _ctrContactId, _marketoLeadId, _salesforceAccountId, _salesforceContactId, _salesforceAssetId, _zendeskUserId, _zendeskExternalId, _zendeskTicketId, _serviceNowSystemId, _serviceNowIncidentId, _segmentUserId, _shopifyCustomerId, _shopifyOrderId.
     */
    KeyName: name;
    /**
     * A list of key values.
     */
    Values: requestValueList;
    /**
     * A list of AdditionalSearchKey objects that are each searchable identifiers of a profile. Each AdditionalSearchKey object contains a KeyName and a list of Values associated with that specific key (i.e., a key-value(s) pair). These additional search keys will be used in conjunction with the LogicalOperator and the required KeyName and Values parameters to search for profiles that satisfy the search criteria. 
     */
    AdditionalSearchKeys?: additionalSearchKeysList;
    /**
     * Relationship between all specified search keys that will be used to search for profiles. This includes the required KeyName and Values parameters as well as any key-value(s) pairs specified in the AdditionalSearchKeys list. This parameter influences which profiles will be returned in the response in the following manner:    AND - The response only includes profiles that match all of the search keys.    OR - The response includes profiles that match at least one of the search keys.   The OR relationship is the default behavior if this parameter is not included in the request.
     */
    LogicalOperator?: logicalOperator;
  }
  export interface SearchProfilesResponse {
    /**
     * The list of Profiles matching the search criteria.
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
  export type StandardIdentifier = "PROFILE"|"ASSET"|"CASE"|"UNIQUE"|"SECONDARY"|"LOOKUP_ONLY"|"NEW_ONLY"|"ORDER"|string;
  export type StandardIdentifierList = StandardIdentifier[];
  export type Statistic = "FIRST_OCCURRENCE"|"LAST_OCCURRENCE"|"COUNT"|"SUM"|"MINIMUM"|"MAXIMUM"|"AVERAGE"|"MAX_OCCURRENCE"|string;
  export type Status = "NOT_STARTED"|"IN_PROGRESS"|"COMPLETE"|"FAILED"|"SPLIT"|"RETRY"|"CANCELLED"|string;
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
  export interface Threshold {
    /**
     * The value of the threshold.
     */
    Value: string1To255;
    /**
     * The operator of the threshold.
     */
    Operator: Operator;
  }
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
  export type Unit = "DAYS"|string;
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
  export interface UpdateCalculatedAttributeDefinitionRequest {
    /**
     * The unique name of the domain.
     */
    DomainName: name;
    /**
     * The unique name of the calculated attribute.
     */
    CalculatedAttributeName: typeName;
    /**
     * The display name of the calculated attribute.
     */
    DisplayName?: displayName;
    /**
     * The description of the calculated attribute.
     */
    Description?: sensitiveText;
    /**
     * The conditions including range, object count, and threshold for the calculated attribute.
     */
    Conditions?: Conditions;
  }
  export interface UpdateCalculatedAttributeDefinitionResponse {
    /**
     * The unique name of the calculated attribute.
     */
    CalculatedAttributeName?: typeName;
    /**
     * The display name of the calculated attribute.
     */
    DisplayName?: displayName;
    /**
     * The description of the calculated attribute.
     */
    Description?: sensitiveText;
    /**
     * The timestamp of when the calculated attribute definition was created.
     */
    CreatedAt?: timestamp;
    /**
     * The timestamp of when the calculated attribute definition was most recently edited.
     */
    LastUpdatedAt?: timestamp;
    /**
     * The aggregation operation to perform for the calculated attribute.
     */
    Statistic?: Statistic;
    /**
     * The conditions including range, object count, and threshold for the calculated attribute.
     */
    Conditions?: Conditions;
    /**
     * The mathematical expression and a list of attribute items specified in that expression.
     */
    AttributeDetails?: AttributeDetails;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    Tags?: TagMap;
  }
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
     * The process of matching duplicate profiles. If Matching = true, Amazon Connect Customer Profiles starts a weekly batch process called Identity Resolution Job. If you do not specify a date and time for Identity Resolution Job to run, by default it runs every Saturday at 12AM UTC to detect duplicate profiles in your domains.  After the Identity Resolution Job completes, use the GetMatches API to return and review the results. Or, if you have configured ExportingConfig in the MatchingRequest, you can download the results from S3.
     */
    Matching?: MatchingRequest;
    /**
     * The process of matching duplicate profiles using the rule-Based matching. If RuleBasedMatching = true, Amazon Connect Customer Profiles will start to match and merge your profiles according to your configuration in the RuleBasedMatchingRequest. You can use the ListRuleBasedMatches and GetSimilarProfiles API to return and review the results. Also, if you have configured ExportingConfig in the RuleBasedMatchingRequest, you can download the results from S3.
     */
    RuleBasedMatching?: RuleBasedMatchingRequest;
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
     * The process of matching duplicate profiles. If Matching = true, Amazon Connect Customer Profiles starts a weekly batch process called Identity Resolution Job. If you do not specify a date and time for Identity Resolution Job to run, by default it runs every Saturday at 12AM UTC to detect duplicate profiles in your domains.  After the Identity Resolution Job completes, use the GetMatches API to return and review the results. Or, if you have configured ExportingConfig in the MatchingRequest, you can download the results from S3.
     */
    Matching?: MatchingResponse;
    /**
     * The process of matching duplicate profiles using the rule-Based matching. If RuleBasedMatching = true, Amazon Connect Customer Profiles will start to match and merge your profiles according to your configuration in the RuleBasedMatchingRequest. You can use the ListRuleBasedMatches and GetSimilarProfiles API to return and review the results. Also, if you have configured ExportingConfig in the RuleBasedMatchingRequest, you can download the results from S3.
     */
    RuleBasedMatching?: RuleBasedMatchingResponse;
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
    AdditionalInformation?: sensitiveString0To1000;
    /**
     * A unique account number that you have given to the customer.
     */
    AccountNumber?: sensitiveString0To255;
    /**
     * The type of profile used to describe the customer.
     */
    PartyType?: PartyType;
    /**
     * The name of the customer’s business.
     */
    BusinessName?: sensitiveString0To255;
    /**
     * The customer’s first name.
     */
    FirstName?: sensitiveString0To255;
    /**
     * The customer’s middle name.
     */
    MiddleName?: sensitiveString0To255;
    /**
     * The customer’s last name.
     */
    LastName?: sensitiveString0To255;
    /**
     * The customer’s birth date. 
     */
    BirthDate?: sensitiveString0To255;
    /**
     * The gender with which the customer identifies. 
     */
    Gender?: Gender;
    /**
     * The customer’s phone number, which has not been specified as a mobile, home, or business number. 
     */
    PhoneNumber?: sensitiveString0To255;
    /**
     * The customer’s mobile phone number.
     */
    MobilePhoneNumber?: sensitiveString0To255;
    /**
     * The customer’s home phone number.
     */
    HomePhoneNumber?: sensitiveString0To255;
    /**
     * The customer’s business phone number.
     */
    BusinessPhoneNumber?: sensitiveString0To255;
    /**
     * The customer’s email address, which has not been specified as a personal or business address. 
     */
    EmailAddress?: sensitiveString0To255;
    /**
     * The customer’s personal email address.
     */
    PersonalEmailAddress?: sensitiveString0To255;
    /**
     * The customer’s business email address.
     */
    BusinessEmailAddress?: sensitiveString0To255;
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
    /**
     * An alternative to PartyType which accepts any string as input.
     */
    PartyTypeString?: sensitiveString0To255;
    /**
     * An alternative to Gender which accepts any string as input.
     */
    GenderString?: sensitiveString0To255;
  }
  export interface UpdateProfileResponse {
    /**
     * The unique identifier of a customer profile.
     */
    ProfileId: uuid;
  }
  export type Value = number;
  export interface WorkflowAttributes {
    /**
     * Workflow attributes specific to APPFLOW_INTEGRATION workflow.
     */
    AppflowIntegration?: AppflowIntegrationWorkflowAttributes;
  }
  export type WorkflowList = ListWorkflowsItem[];
  export interface WorkflowMetrics {
    /**
     * Workflow execution metrics for APPFLOW_INTEGRATION workflow.
     */
    AppflowIntegration?: AppflowIntegrationWorkflowMetrics;
  }
  export interface WorkflowStepItem {
    /**
     * Workflow step information specific to APPFLOW_INTEGRATION workflow.
     */
    AppflowIntegration?: AppflowIntegrationWorkflowStep;
  }
  export type WorkflowStepsList = WorkflowStepItem[];
  export type WorkflowType = "APPFLOW_INTEGRATION"|string;
  export type ZendeskConnectorOperator = "PROJECTION"|"GREATER_THAN"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface ZendeskSourceProperties {
    /**
     * The object specified in the Zendesk flow source.
     */
    Object: Object;
  }
  export type additionalSearchKeysList = AdditionalSearchKey[];
  export type attributeName = string;
  export type displayName = string;
  export type encryptionKey = string;
  export type expirationDaysInteger = number;
  export type foundByList = FoundByKeyValue[];
  export type logicalOperator = "AND"|"OR"|string;
  export type long = number;
  export type matchesNumber = number;
  export type maxSize100 = number;
  export type message = string;
  export type optionalBoolean = boolean;
  export type requestValueList = string1To255[];
  export type s3BucketName = string;
  export type s3KeyName = string;
  export type s3KeyNameCustomerOutputConfig = string;
  export type sensitiveString0To1000 = string;
  export type sensitiveString0To255 = string;
  export type sensitiveString1To1000 = string;
  export type sensitiveString1To255 = string;
  export type sensitiveText = string;
  export type sqsQueueUrl = string;
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
