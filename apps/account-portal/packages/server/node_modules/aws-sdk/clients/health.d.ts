import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Health extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Health.Types.ClientConfiguration)
  config: Config & Health.Types.ClientConfiguration;
  /**
   * Returns a list of accounts in the organization from Organizations that are affected by the provided event. For more information about the different types of Health events, see Event.  Before you can call this operation, you must first enable Health to work with Organizations. To do this, call the EnableHealthServiceAccessForOrganization operation from your organization's management account.  This API operation uses pagination. Specify the nextToken parameter in the next request to return more results. 
   */
  describeAffectedAccountsForOrganization(params: Health.Types.DescribeAffectedAccountsForOrganizationRequest, callback?: (err: AWSError, data: Health.Types.DescribeAffectedAccountsForOrganizationResponse) => void): Request<Health.Types.DescribeAffectedAccountsForOrganizationResponse, AWSError>;
  /**
   * Returns a list of accounts in the organization from Organizations that are affected by the provided event. For more information about the different types of Health events, see Event.  Before you can call this operation, you must first enable Health to work with Organizations. To do this, call the EnableHealthServiceAccessForOrganization operation from your organization's management account.  This API operation uses pagination. Specify the nextToken parameter in the next request to return more results. 
   */
  describeAffectedAccountsForOrganization(callback?: (err: AWSError, data: Health.Types.DescribeAffectedAccountsForOrganizationResponse) => void): Request<Health.Types.DescribeAffectedAccountsForOrganizationResponse, AWSError>;
  /**
   * Returns a list of entities that have been affected by the specified events, based on the specified filter criteria. Entities can refer to individual customer resources, groups of customer resources, or any other construct, depending on the Amazon Web Service. Events that have impact beyond that of the affected entities, or where the extent of impact is unknown, include at least one entity indicating this. At least one event ARN is required.    This API operation uses pagination. Specify the nextToken parameter in the next request to return more results.   This operation supports resource-level permissions. You can use this operation to allow or deny access to specific Health events. For more information, see Resource- and action-based conditions in the Health User Guide.   
   */
  describeAffectedEntities(params: Health.Types.DescribeAffectedEntitiesRequest, callback?: (err: AWSError, data: Health.Types.DescribeAffectedEntitiesResponse) => void): Request<Health.Types.DescribeAffectedEntitiesResponse, AWSError>;
  /**
   * Returns a list of entities that have been affected by the specified events, based on the specified filter criteria. Entities can refer to individual customer resources, groups of customer resources, or any other construct, depending on the Amazon Web Service. Events that have impact beyond that of the affected entities, or where the extent of impact is unknown, include at least one entity indicating this. At least one event ARN is required.    This API operation uses pagination. Specify the nextToken parameter in the next request to return more results.   This operation supports resource-level permissions. You can use this operation to allow or deny access to specific Health events. For more information, see Resource- and action-based conditions in the Health User Guide.   
   */
  describeAffectedEntities(callback?: (err: AWSError, data: Health.Types.DescribeAffectedEntitiesResponse) => void): Request<Health.Types.DescribeAffectedEntitiesResponse, AWSError>;
  /**
   * Returns a list of entities that have been affected by one or more events for one or more accounts in your organization in Organizations, based on the filter criteria. Entities can refer to individual customer resources, groups of customer resources, or any other construct, depending on the Amazon Web Service. At least one event Amazon Resource Name (ARN) and account ID are required. Before you can call this operation, you must first enable Health to work with Organizations. To do this, call the EnableHealthServiceAccessForOrganization operation from your organization's management account.    This API operation uses pagination. Specify the nextToken parameter in the next request to return more results.   This operation doesn't support resource-level permissions. You can't use this operation to allow or deny access to specific Health events. For more information, see Resource- and action-based conditions in the Health User Guide.   
   */
  describeAffectedEntitiesForOrganization(params: Health.Types.DescribeAffectedEntitiesForOrganizationRequest, callback?: (err: AWSError, data: Health.Types.DescribeAffectedEntitiesForOrganizationResponse) => void): Request<Health.Types.DescribeAffectedEntitiesForOrganizationResponse, AWSError>;
  /**
   * Returns a list of entities that have been affected by one or more events for one or more accounts in your organization in Organizations, based on the filter criteria. Entities can refer to individual customer resources, groups of customer resources, or any other construct, depending on the Amazon Web Service. At least one event Amazon Resource Name (ARN) and account ID are required. Before you can call this operation, you must first enable Health to work with Organizations. To do this, call the EnableHealthServiceAccessForOrganization operation from your organization's management account.    This API operation uses pagination. Specify the nextToken parameter in the next request to return more results.   This operation doesn't support resource-level permissions. You can't use this operation to allow or deny access to specific Health events. For more information, see Resource- and action-based conditions in the Health User Guide.   
   */
  describeAffectedEntitiesForOrganization(callback?: (err: AWSError, data: Health.Types.DescribeAffectedEntitiesForOrganizationResponse) => void): Request<Health.Types.DescribeAffectedEntitiesForOrganizationResponse, AWSError>;
  /**
   * Returns the number of entities that are affected by each of the specified events.
   */
  describeEntityAggregates(params: Health.Types.DescribeEntityAggregatesRequest, callback?: (err: AWSError, data: Health.Types.DescribeEntityAggregatesResponse) => void): Request<Health.Types.DescribeEntityAggregatesResponse, AWSError>;
  /**
   * Returns the number of entities that are affected by each of the specified events.
   */
  describeEntityAggregates(callback?: (err: AWSError, data: Health.Types.DescribeEntityAggregatesResponse) => void): Request<Health.Types.DescribeEntityAggregatesResponse, AWSError>;
  /**
   * Returns a list of entity aggregates for your Organizations that are affected by each of the specified events.
   */
  describeEntityAggregatesForOrganization(params: Health.Types.DescribeEntityAggregatesForOrganizationRequest, callback?: (err: AWSError, data: Health.Types.DescribeEntityAggregatesForOrganizationResponse) => void): Request<Health.Types.DescribeEntityAggregatesForOrganizationResponse, AWSError>;
  /**
   * Returns a list of entity aggregates for your Organizations that are affected by each of the specified events.
   */
  describeEntityAggregatesForOrganization(callback?: (err: AWSError, data: Health.Types.DescribeEntityAggregatesForOrganizationResponse) => void): Request<Health.Types.DescribeEntityAggregatesForOrganizationResponse, AWSError>;
  /**
   * Returns the number of events of each event type (issue, scheduled change, and account notification). If no filter is specified, the counts of all events in each category are returned.  This API operation uses pagination. Specify the nextToken parameter in the next request to return more results. 
   */
  describeEventAggregates(params: Health.Types.DescribeEventAggregatesRequest, callback?: (err: AWSError, data: Health.Types.DescribeEventAggregatesResponse) => void): Request<Health.Types.DescribeEventAggregatesResponse, AWSError>;
  /**
   * Returns the number of events of each event type (issue, scheduled change, and account notification). If no filter is specified, the counts of all events in each category are returned.  This API operation uses pagination. Specify the nextToken parameter in the next request to return more results. 
   */
  describeEventAggregates(callback?: (err: AWSError, data: Health.Types.DescribeEventAggregatesResponse) => void): Request<Health.Types.DescribeEventAggregatesResponse, AWSError>;
  /**
   * Returns detailed information about one or more specified events. Information includes standard event data (Amazon Web Services Region, service, and so on, as returned by DescribeEvents), a detailed event description, and possible additional metadata that depends upon the nature of the event. Affected entities are not included. To retrieve the entities, use the DescribeAffectedEntities operation. If a specified event can't be retrieved, an error message is returned for that event.  This operation supports resource-level permissions. You can use this operation to allow or deny access to specific Health events. For more information, see Resource- and action-based conditions in the Health User Guide. 
   */
  describeEventDetails(params: Health.Types.DescribeEventDetailsRequest, callback?: (err: AWSError, data: Health.Types.DescribeEventDetailsResponse) => void): Request<Health.Types.DescribeEventDetailsResponse, AWSError>;
  /**
   * Returns detailed information about one or more specified events. Information includes standard event data (Amazon Web Services Region, service, and so on, as returned by DescribeEvents), a detailed event description, and possible additional metadata that depends upon the nature of the event. Affected entities are not included. To retrieve the entities, use the DescribeAffectedEntities operation. If a specified event can't be retrieved, an error message is returned for that event.  This operation supports resource-level permissions. You can use this operation to allow or deny access to specific Health events. For more information, see Resource- and action-based conditions in the Health User Guide. 
   */
  describeEventDetails(callback?: (err: AWSError, data: Health.Types.DescribeEventDetailsResponse) => void): Request<Health.Types.DescribeEventDetailsResponse, AWSError>;
  /**
   * Returns detailed information about one or more specified events for one or more Amazon Web Services accounts in your organization. This information includes standard event data (such as the Amazon Web Services Region and service), an event description, and (depending on the event) possible metadata. This operation doesn't return affected entities, such as the resources related to the event. To return affected entities, use the DescribeAffectedEntitiesForOrganization operation.  Before you can call this operation, you must first enable Health to work with Organizations. To do this, call the EnableHealthServiceAccessForOrganization operation from your organization's management account.  When you call the DescribeEventDetailsForOrganization operation, specify the organizationEventDetailFilters object in the request. Depending on the Health event type, note the following differences:   To return event details for a public event, you must specify a null value for the awsAccountId parameter. If you specify an account ID for a public event, Health returns an error message because public events aren't specific to an account.   To return event details for an event that is specific to an account in your organization, you must specify the awsAccountId parameter in the request. If you don't specify an account ID, Health returns an error message because the event is specific to an account in your organization.    For more information, see Event.  This operation doesn't support resource-level permissions. You can't use this operation to allow or deny access to specific Health events. For more information, see Resource- and action-based conditions in the Health User Guide. 
   */
  describeEventDetailsForOrganization(params: Health.Types.DescribeEventDetailsForOrganizationRequest, callback?: (err: AWSError, data: Health.Types.DescribeEventDetailsForOrganizationResponse) => void): Request<Health.Types.DescribeEventDetailsForOrganizationResponse, AWSError>;
  /**
   * Returns detailed information about one or more specified events for one or more Amazon Web Services accounts in your organization. This information includes standard event data (such as the Amazon Web Services Region and service), an event description, and (depending on the event) possible metadata. This operation doesn't return affected entities, such as the resources related to the event. To return affected entities, use the DescribeAffectedEntitiesForOrganization operation.  Before you can call this operation, you must first enable Health to work with Organizations. To do this, call the EnableHealthServiceAccessForOrganization operation from your organization's management account.  When you call the DescribeEventDetailsForOrganization operation, specify the organizationEventDetailFilters object in the request. Depending on the Health event type, note the following differences:   To return event details for a public event, you must specify a null value for the awsAccountId parameter. If you specify an account ID for a public event, Health returns an error message because public events aren't specific to an account.   To return event details for an event that is specific to an account in your organization, you must specify the awsAccountId parameter in the request. If you don't specify an account ID, Health returns an error message because the event is specific to an account in your organization.    For more information, see Event.  This operation doesn't support resource-level permissions. You can't use this operation to allow or deny access to specific Health events. For more information, see Resource- and action-based conditions in the Health User Guide. 
   */
  describeEventDetailsForOrganization(callback?: (err: AWSError, data: Health.Types.DescribeEventDetailsForOrganizationResponse) => void): Request<Health.Types.DescribeEventDetailsForOrganizationResponse, AWSError>;
  /**
   * Returns the event types that meet the specified filter criteria. You can use this API operation to find information about the Health event, such as the category, Amazon Web Service, and event code. The metadata for each event appears in the EventType object.  If you don't specify a filter criteria, the API operation returns all event types, in no particular order.   This API operation uses pagination. Specify the nextToken parameter in the next request to return more results. 
   */
  describeEventTypes(params: Health.Types.DescribeEventTypesRequest, callback?: (err: AWSError, data: Health.Types.DescribeEventTypesResponse) => void): Request<Health.Types.DescribeEventTypesResponse, AWSError>;
  /**
   * Returns the event types that meet the specified filter criteria. You can use this API operation to find information about the Health event, such as the category, Amazon Web Service, and event code. The metadata for each event appears in the EventType object.  If you don't specify a filter criteria, the API operation returns all event types, in no particular order.   This API operation uses pagination. Specify the nextToken parameter in the next request to return more results. 
   */
  describeEventTypes(callback?: (err: AWSError, data: Health.Types.DescribeEventTypesResponse) => void): Request<Health.Types.DescribeEventTypesResponse, AWSError>;
  /**
   *  Returns information about events that meet the specified filter criteria. Events are returned in a summary form and do not include the detailed description, any additional metadata that depends on the event type, or any affected resources. To retrieve that information, use the DescribeEventDetails and DescribeAffectedEntities operations. If no filter criteria are specified, all events are returned. Results are sorted by lastModifiedTime, starting with the most recent event.    When you call the DescribeEvents operation and specify an entity for the entityValues parameter, Health might return public events that aren't specific to that resource. For example, if you call DescribeEvents and specify an ID for an Amazon Elastic Compute Cloud (Amazon EC2) instance, Health might return events that aren't specific to that resource or service. To get events that are specific to a service, use the services parameter in the filter object. For more information, see Event.   This API operation uses pagination. Specify the nextToken parameter in the next request to return more results.   
   */
  describeEvents(params: Health.Types.DescribeEventsRequest, callback?: (err: AWSError, data: Health.Types.DescribeEventsResponse) => void): Request<Health.Types.DescribeEventsResponse, AWSError>;
  /**
   *  Returns information about events that meet the specified filter criteria. Events are returned in a summary form and do not include the detailed description, any additional metadata that depends on the event type, or any affected resources. To retrieve that information, use the DescribeEventDetails and DescribeAffectedEntities operations. If no filter criteria are specified, all events are returned. Results are sorted by lastModifiedTime, starting with the most recent event.    When you call the DescribeEvents operation and specify an entity for the entityValues parameter, Health might return public events that aren't specific to that resource. For example, if you call DescribeEvents and specify an ID for an Amazon Elastic Compute Cloud (Amazon EC2) instance, Health might return events that aren't specific to that resource or service. To get events that are specific to a service, use the services parameter in the filter object. For more information, see Event.   This API operation uses pagination. Specify the nextToken parameter in the next request to return more results.   
   */
  describeEvents(callback?: (err: AWSError, data: Health.Types.DescribeEventsResponse) => void): Request<Health.Types.DescribeEventsResponse, AWSError>;
  /**
   * Returns information about events across your organization in Organizations. You can use thefilters parameter to specify the events that you want to return. Events are returned in a summary form and don't include the affected accounts, detailed description, any additional metadata that depends on the event type, or any affected resources. To retrieve that information, use the following operations:    DescribeAffectedAccountsForOrganization     DescribeEventDetailsForOrganization     DescribeAffectedEntitiesForOrganization    If you don't specify a filter, the DescribeEventsForOrganizations returns all events across your organization. Results are sorted by lastModifiedTime, starting with the most recent event.  For more information about the different types of Health events, see Event. Before you can call this operation, you must first enable Health to work with Organizations. To do this, call the EnableHealthServiceAccessForOrganization operation from your organization's management account.  This API operation uses pagination. Specify the nextToken parameter in the next request to return more results. 
   */
  describeEventsForOrganization(params: Health.Types.DescribeEventsForOrganizationRequest, callback?: (err: AWSError, data: Health.Types.DescribeEventsForOrganizationResponse) => void): Request<Health.Types.DescribeEventsForOrganizationResponse, AWSError>;
  /**
   * Returns information about events across your organization in Organizations. You can use thefilters parameter to specify the events that you want to return. Events are returned in a summary form and don't include the affected accounts, detailed description, any additional metadata that depends on the event type, or any affected resources. To retrieve that information, use the following operations:    DescribeAffectedAccountsForOrganization     DescribeEventDetailsForOrganization     DescribeAffectedEntitiesForOrganization    If you don't specify a filter, the DescribeEventsForOrganizations returns all events across your organization. Results are sorted by lastModifiedTime, starting with the most recent event.  For more information about the different types of Health events, see Event. Before you can call this operation, you must first enable Health to work with Organizations. To do this, call the EnableHealthServiceAccessForOrganization operation from your organization's management account.  This API operation uses pagination. Specify the nextToken parameter in the next request to return more results. 
   */
  describeEventsForOrganization(callback?: (err: AWSError, data: Health.Types.DescribeEventsForOrganizationResponse) => void): Request<Health.Types.DescribeEventsForOrganizationResponse, AWSError>;
  /**
   * This operation provides status information on enabling or disabling Health to work with your organization. To call this operation, you must use the organization's management account.
   */
  describeHealthServiceStatusForOrganization(callback?: (err: AWSError, data: Health.Types.DescribeHealthServiceStatusForOrganizationResponse) => void): Request<Health.Types.DescribeHealthServiceStatusForOrganizationResponse, AWSError>;
  /**
   * Disables Health from working with Organizations. To call this operation, you must sign in to the organization's management account. For more information, see Aggregating Health events in the Health User Guide. This operation doesn't remove the service-linked role from the management account in your organization. You must use the IAM console, API, or Command Line Interface (CLI) to remove the service-linked role. For more information, see Deleting a Service-Linked Role in the IAM User Guide.  You can also disable the organizational feature by using the Organizations DisableAWSServiceAccess API operation. After you call this operation, Health stops aggregating events for all other Amazon Web Services accounts in your organization. If you call the Health API operations for organizational view, Health returns an error. Health continues to aggregate health events for your Amazon Web Services account. 
   */
  disableHealthServiceAccessForOrganization(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables Health to work with Organizations. You can use the organizational view feature to aggregate events from all Amazon Web Services accounts in your organization in a centralized location.  This operation also creates a service-linked role for the management account in the organization.   To call this operation, you must meet the following requirements:   You must have a Business, Enterprise On-Ramp, or Enterprise Support plan from Amazon Web Services Support to use the Health API. If you call the Health API from an Amazon Web Services account that doesn't have a Business, Enterprise On-Ramp, or Enterprise Support plan, you receive a SubscriptionRequiredException error.   You must have permission to call this operation from the organization's management account. For example IAM policies, see Health identity-based policy examples.    If you don't have the required support plan, you can instead use the Health console to enable the organizational view feature. For more information, see Aggregating Health events in the Health User Guide.
   */
  enableHealthServiceAccessForOrganization(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace Health {
  export interface AccountEntityAggregate {
    /**
     * The 12-digit Amazon Web Services account numbers that contains the affected entities.
     */
    accountId?: eventArn;
    /**
     * The number of entities that match the filter criteria for the specified events.
     */
    count?: count;
    /**
     * The number of affected entities aggregated by the entity status codes.
     */
    statuses?: entityStatuses;
  }
  export type AccountEntityAggregatesList = AccountEntityAggregate[];
  export interface AffectedEntity {
    /**
     * The unique identifier for the entity. Format: arn:aws:health:entity-region:aws-account:entity/entity-id . Example: arn:aws:health:us-east-1:111222333444:entity/AVh5GGT7ul1arKr1sE1K 
     */
    entityArn?: entityArn;
    /**
     * The unique identifier for the event. The event ARN has the arn:aws:health:event-region::event/SERVICE/EVENT_TYPE_CODE/EVENT_TYPE_PLUS_ID  format. For example, an event ARN might look like the following:  arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-DEF456 
     */
    eventArn?: eventArn;
    /**
     * The ID of the affected entity.
     */
    entityValue?: entityValue;
    /**
     * The URL of the affected entity.
     */
    entityUrl?: entityUrl;
    /**
     * The 12-digit Amazon Web Services account number that contains the affected entity.
     */
    awsAccountId?: accountId;
    /**
     * The most recent time that the entity was updated.
     */
    lastUpdatedTime?: timestamp;
    /**
     * The most recent status of the entity affected by the event. The possible values are IMPAIRED, UNIMPAIRED, and UNKNOWN.
     */
    statusCode?: entityStatusCode;
    /**
     * A map of entity tags attached to the affected entity.  Currently, the tags property isn't supported. 
     */
    tags?: tagSet;
  }
  export interface DateTimeRange {
    /**
     * The starting date and time of a time range.
     */
    from?: timestamp;
    /**
     * The ending date and time of a time range.
     */
    to?: timestamp;
  }
  export interface DescribeAffectedAccountsForOrganizationRequest {
    /**
     * The unique identifier for the event. The event ARN has the arn:aws:health:event-region::event/SERVICE/EVENT_TYPE_CODE/EVENT_TYPE_PLUS_ID  format. For example, an event ARN might look like the following:  arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-DEF456 
     */
    eventArn: eventArn;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
    /**
     * The maximum number of items to return in one batch, between 10 and 100, inclusive.
     */
    maxResults?: maxResults;
  }
  export interface DescribeAffectedAccountsForOrganizationResponse {
    /**
     * A JSON set of elements of the affected accounts.
     */
    affectedAccounts?: affectedAccountsList;
    /**
     * This parameter specifies if the Health event is a public Amazon Web Service event or an account-specific event.   If the eventScopeCode value is PUBLIC, then the affectedAccounts value is always empty.   If the eventScopeCode value is ACCOUNT_SPECIFIC, then the affectedAccounts value lists the affected Amazon Web Services accounts in your organization. For example, if an event affects a service such as Amazon Elastic Compute Cloud and you have Amazon Web Services accounts that use that service, those account IDs appear in the response.   If the eventScopeCode value is NONE, then the eventArn that you specified in the request is invalid or doesn't exist.  
     */
    eventScopeCode?: eventScopeCode;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
  }
  export type DescribeAffectedEntitiesForOrganizationFailedSet = OrganizationAffectedEntitiesErrorItem[];
  export interface DescribeAffectedEntitiesForOrganizationRequest {
    /**
     * A JSON set of elements including the awsAccountId and the eventArn.
     */
    organizationEntityFilters?: OrganizationEntityFiltersList;
    /**
     * The locale (language) to return information in. English (en) is the default and the only supported value at this time.
     */
    locale?: locale;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
    /**
     * The maximum number of items to return in one batch, between 10 and 100, inclusive.
     */
    maxResults?: maxResultsLowerRange;
    /**
     * A JSON set of elements including the awsAccountId, eventArn and a set of statusCodes.
     */
    organizationEntityAccountFilters?: OrganizationEntityAccountFiltersList;
  }
  export interface DescribeAffectedEntitiesForOrganizationResponse {
    /**
     * A JSON set of elements including the awsAccountId and its entityArn, entityValue and its entityArn, lastUpdatedTime, and statusCode.
     */
    entities?: EntityList;
    /**
     * A JSON set of elements of the failed response, including the awsAccountId, errorMessage, errorName, and eventArn.
     */
    failedSet?: DescribeAffectedEntitiesForOrganizationFailedSet;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
  }
  export interface DescribeAffectedEntitiesRequest {
    /**
     * Values to narrow the results returned. At least one event ARN is required.
     */
    filter: EntityFilter;
    /**
     * The locale (language) to return information in. English (en) is the default and the only supported value at this time.
     */
    locale?: locale;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
    /**
     * The maximum number of items to return in one batch, between 10 and 100, inclusive.
     */
    maxResults?: maxResults;
  }
  export interface DescribeAffectedEntitiesResponse {
    /**
     * The entities that match the filter criteria.
     */
    entities?: EntityList;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
  }
  export interface DescribeEntityAggregatesForOrganizationRequest {
    /**
     * A list of event ARNs (unique identifiers). For example: "arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-CDE456", "arn:aws:health:us-west-1::event/EBS/AWS_EBS_LOST_VOLUME/AWS_EBS_LOST_VOLUME_CHI789_JKL101" 
     */
    eventArns: OrganizationEventArnsList;
    /**
     * A list of 12-digit Amazon Web Services account numbers that contains the affected entities.
     */
    awsAccountIds?: OrganizationAccountIdsList;
  }
  export interface DescribeEntityAggregatesForOrganizationResponse {
    /**
     * The list of entity aggregates for each of the specified accounts that are affected by each of the specified events.
     */
    organizationEntityAggregates?: OrganizationEntityAggregatesList;
  }
  export interface DescribeEntityAggregatesRequest {
    /**
     * A list of event ARNs (unique identifiers). For example: "arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-CDE456", "arn:aws:health:us-west-1::event/EBS/AWS_EBS_LOST_VOLUME/AWS_EBS_LOST_VOLUME_CHI789_JKL101" 
     */
    eventArns?: EventArnsList;
  }
  export interface DescribeEntityAggregatesResponse {
    /**
     * The number of entities that are affected by each of the specified events.
     */
    entityAggregates?: EntityAggregateList;
  }
  export interface DescribeEventAggregatesRequest {
    /**
     * Values to narrow the results returned.
     */
    filter?: EventFilter;
    /**
     * The only currently supported value is eventTypeCategory.
     */
    aggregateField: eventAggregateField;
    /**
     * The maximum number of items to return in one batch, between 10 and 100, inclusive.
     */
    maxResults?: maxResults;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
  }
  export interface DescribeEventAggregatesResponse {
    /**
     * The number of events in each category that meet the optional filter criteria.
     */
    eventAggregates?: EventAggregateList;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
  }
  export type DescribeEventDetailsFailedSet = EventDetailsErrorItem[];
  export type DescribeEventDetailsForOrganizationFailedSet = OrganizationEventDetailsErrorItem[];
  export interface DescribeEventDetailsForOrganizationRequest {
    /**
     * A set of JSON elements that includes the awsAccountId and the eventArn.
     */
    organizationEventDetailFilters: OrganizationEventDetailFiltersList;
    /**
     * The locale (language) to return information in. English (en) is the default and the only supported value at this time.
     */
    locale?: locale;
  }
  export interface DescribeEventDetailsForOrganizationResponse {
    /**
     * Information about the events that could be retrieved.
     */
    successfulSet?: DescribeEventDetailsForOrganizationSuccessfulSet;
    /**
     * Error messages for any events that could not be retrieved.
     */
    failedSet?: DescribeEventDetailsForOrganizationFailedSet;
  }
  export type DescribeEventDetailsForOrganizationSuccessfulSet = OrganizationEventDetails[];
  export interface DescribeEventDetailsRequest {
    /**
     * A list of event ARNs (unique identifiers). For example: "arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-CDE456", "arn:aws:health:us-west-1::event/EBS/AWS_EBS_LOST_VOLUME/AWS_EBS_LOST_VOLUME_CHI789_JKL101" 
     */
    eventArns: eventArnList;
    /**
     * The locale (language) to return information in. English (en) is the default and the only supported value at this time.
     */
    locale?: locale;
  }
  export interface DescribeEventDetailsResponse {
    /**
     * Information about the events that could be retrieved.
     */
    successfulSet?: DescribeEventDetailsSuccessfulSet;
    /**
     * Error messages for any events that could not be retrieved.
     */
    failedSet?: DescribeEventDetailsFailedSet;
  }
  export type DescribeEventDetailsSuccessfulSet = EventDetails[];
  export interface DescribeEventTypesRequest {
    /**
     * Values to narrow the results returned.
     */
    filter?: EventTypeFilter;
    /**
     * The locale (language) to return information in. English (en) is the default and the only supported value at this time.
     */
    locale?: locale;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
    /**
     * The maximum number of items to return in one batch, between 10 and 100, inclusive.  If you don't specify the maxResults parameter, this operation returns a maximum of 30 items by default. 
     */
    maxResults?: maxResults;
  }
  export interface DescribeEventTypesResponse {
    /**
     * A list of event types that match the filter criteria. Event types have a category (issue, accountNotification, or scheduledChange), a service (for example, EC2, RDS, DATAPIPELINE, BILLING), and a code (in the format AWS_SERVICE_DESCRIPTION ; for example, AWS_EC2_SYSTEM_MAINTENANCE_EVENT).
     */
    eventTypes?: EventTypeList;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
  }
  export interface DescribeEventsForOrganizationRequest {
    /**
     * Values to narrow the results returned.
     */
    filter?: OrganizationEventFilter;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
    /**
     * The maximum number of items to return in one batch, between 10 and 100, inclusive.
     */
    maxResults?: maxResultsLowerRange;
    /**
     * The locale (language) to return information in. English (en) is the default and the only supported value at this time.
     */
    locale?: locale;
  }
  export interface DescribeEventsForOrganizationResponse {
    /**
     * The events that match the specified filter criteria.
     */
    events?: OrganizationEventList;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
  }
  export interface DescribeEventsRequest {
    /**
     * Values to narrow the results returned.
     */
    filter?: EventFilter;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
    /**
     * The maximum number of items to return in one batch, between 10 and 100, inclusive.
     */
    maxResults?: maxResults;
    /**
     * The locale (language) to return information in. English (en) is the default and the only supported value at this time.
     */
    locale?: locale;
  }
  export interface DescribeEventsResponse {
    /**
     * The events that match the specified filter criteria.
     */
    events?: EventList;
    /**
     * If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value.
     */
    nextToken?: nextToken;
  }
  export interface DescribeHealthServiceStatusForOrganizationResponse {
    /**
     * Information about the status of enabling or disabling the Health organizational view feature in your organization. Valid values are ENABLED | DISABLED | PENDING. 
     */
    healthServiceAccessStatusForOrganization?: healthServiceAccessStatusForOrganization;
  }
  export interface EntityAccountFilter {
    /**
     * The unique identifier for the event. The event ARN has the arn:aws:health:event-region::event/SERVICE/EVENT_TYPE_CODE/EVENT_TYPE_PLUS_ID  format. For example, an event ARN might look like the following:  arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-DEF456 
     */
    eventArn: eventArn;
    /**
     * The 12-digit Amazon Web Services account numbers that contains the affected entities.
     */
    awsAccountId?: accountId;
    /**
     * A list of entity status codes.
     */
    statusCodes?: entityStatusCodeList;
  }
  export interface EntityAggregate {
    /**
     * The unique identifier for the event. The event ARN has the arn:aws:health:event-region::event/SERVICE/EVENT_TYPE_CODE/EVENT_TYPE_PLUS_ID  format. For example, an event ARN might look like the following:  arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-DEF456 
     */
    eventArn?: eventArn;
    /**
     * The number of entities that match the criteria for the specified events.
     */
    count?: count;
    /**
     * The number of affected entities aggregated by the entity status codes.
     */
    statuses?: entityStatuses;
  }
  export type EntityAggregateList = EntityAggregate[];
  export interface EntityFilter {
    /**
     * A list of event ARNs (unique identifiers). For example: "arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-CDE456", "arn:aws:health:us-west-1::event/EBS/AWS_EBS_LOST_VOLUME/AWS_EBS_LOST_VOLUME_CHI789_JKL101" 
     */
    eventArns: eventArnList;
    /**
     * A list of entity ARNs (unique identifiers).
     */
    entityArns?: entityArnList;
    /**
     * A list of IDs for affected entities.
     */
    entityValues?: entityValueList;
    /**
     * A list of the most recent dates and times that the entity was updated.
     */
    lastUpdatedTimes?: dateTimeRangeList;
    /**
     * A map of entity tags attached to the affected entity.  Currently, the tags property isn't supported. 
     */
    tags?: tagFilter;
    /**
     * A list of entity status codes (IMPAIRED, UNIMPAIRED, or UNKNOWN).
     */
    statusCodes?: entityStatusCodeList;
  }
  export type EntityList = AffectedEntity[];
  export interface Event {
    /**
     * The unique identifier for the event. The event ARN has the arn:aws:health:event-region::event/SERVICE/EVENT_TYPE_CODE/EVENT_TYPE_PLUS_ID  format. For example, an event ARN might look like the following:  arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-DEF456 
     */
    arn?: eventArn;
    /**
     * The Amazon Web Service that is affected by the event. For example, EC2, RDS.
     */
    service?: service;
    /**
     * The unique identifier for the event type. The format is AWS_SERVICE_DESCRIPTION ; for example, AWS_EC2_SYSTEM_MAINTENANCE_EVENT.
     */
    eventTypeCode?: eventTypeCode;
    /**
     * A list of event type category codes. Possible values are issue, accountNotification, or scheduledChange. Currently, the investigation value isn't supported at this time.
     */
    eventTypeCategory?: eventTypeCategory;
    /**
     * The Amazon Web Services Region name of the event.
     */
    region?: region;
    /**
     * The Amazon Web Services Availability Zone of the event. For example, us-east-1a.
     */
    availabilityZone?: availabilityZone;
    /**
     * The date and time that the event began.
     */
    startTime?: timestamp;
    /**
     * The date and time that the event ended.
     */
    endTime?: timestamp;
    /**
     * The most recent date and time that the event was updated.
     */
    lastUpdatedTime?: timestamp;
    /**
     * The most recent status of the event. Possible values are open, closed, and upcoming.
     */
    statusCode?: eventStatusCode;
    /**
     * This parameter specifies if the Health event is a public Amazon Web Service event or an account-specific event.   If the eventScopeCode value is PUBLIC, then the affectedAccounts value is always empty.   If the eventScopeCode value is ACCOUNT_SPECIFIC, then the affectedAccounts value lists the affected Amazon Web Services accounts in your organization. For example, if an event affects a service such as Amazon Elastic Compute Cloud and you have Amazon Web Services accounts that use that service, those account IDs appear in the response.   If the eventScopeCode value is NONE, then the eventArn that you specified in the request is invalid or doesn't exist.  
     */
    eventScopeCode?: eventScopeCode;
  }
  export interface EventAccountFilter {
    /**
     * The unique identifier for the event. The event ARN has the arn:aws:health:event-region::event/SERVICE/EVENT_TYPE_CODE/EVENT_TYPE_PLUS_ID  format. For example, an event ARN might look like the following:  arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-DEF456 
     */
    eventArn: eventArn;
    /**
     * The 12-digit Amazon Web Services account numbers that contains the affected entities.
     */
    awsAccountId?: accountId;
  }
  export interface EventAggregate {
    /**
     * The issue type for the associated count.
     */
    aggregateValue?: aggregateValue;
    /**
     * The number of events of the associated issue type.
     */
    count?: count;
  }
  export type EventAggregateList = EventAggregate[];
  export type EventArnsList = eventArn[];
  export interface EventDescription {
    /**
     * The most recent description of the event.
     */
    latestDescription?: eventDescription;
  }
  export interface EventDetails {
    /**
     * Summary information about the event.
     */
    event?: Event;
    /**
     * The most recent description of the event.
     */
    eventDescription?: EventDescription;
    /**
     * Additional metadata about the event.
     */
    eventMetadata?: eventMetadata;
  }
  export interface EventDetailsErrorItem {
    /**
     * The unique identifier for the event. The event ARN has the arn:aws:health:event-region::event/SERVICE/EVENT_TYPE_CODE/EVENT_TYPE_PLUS_ID  format. For example, an event ARN might look like the following:  arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-DEF456 
     */
    eventArn?: eventArn;
    /**
     * The name of the error.
     */
    errorName?: string;
    /**
     * A message that describes the error.
     */
    errorMessage?: string;
  }
  export interface EventFilter {
    /**
     * A list of event ARNs (unique identifiers). For example: "arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-CDE456", "arn:aws:health:us-west-1::event/EBS/AWS_EBS_LOST_VOLUME/AWS_EBS_LOST_VOLUME_CHI789_JKL101" 
     */
    eventArns?: eventArnList;
    /**
     * A list of unique identifiers for event types. For example, "AWS_EC2_SYSTEM_MAINTENANCE_EVENT","AWS_RDS_MAINTENANCE_SCHEDULED". 
     */
    eventTypeCodes?: eventTypeList;
    /**
     * The Amazon Web Services associated with the event. For example, EC2, RDS.
     */
    services?: serviceList;
    /**
     * A list of Amazon Web Services Regions.
     */
    regions?: regionList;
    /**
     * A list of Amazon Web Services Availability Zones.
     */
    availabilityZones?: availabilityZones;
    /**
     * A list of dates and times that the event began.
     */
    startTimes?: dateTimeRangeList;
    /**
     * A list of dates and times that the event ended.
     */
    endTimes?: dateTimeRangeList;
    /**
     * A list of dates and times that the event was last updated.
     */
    lastUpdatedTimes?: dateTimeRangeList;
    /**
     * A list of entity ARNs (unique identifiers).
     */
    entityArns?: entityArnList;
    /**
     * A list of entity identifiers, such as EC2 instance IDs (i-34ab692e) or EBS volumes (vol-426ab23e).
     */
    entityValues?: entityValueList;
    /**
     * A list of event type category codes. Possible values are issue, accountNotification, or scheduledChange. Currently, the investigation value isn't supported at this time.
     */
    eventTypeCategories?: eventTypeCategoryList;
    /**
     * A map of entity tags attached to the affected entity.  Currently, the tags property isn't supported. 
     */
    tags?: tagFilter;
    /**
     * A list of event status codes.
     */
    eventStatusCodes?: eventStatusCodeList;
  }
  export type EventList = Event[];
  export interface EventType {
    /**
     * The Amazon Web Service that is affected by the event. For example, EC2, RDS.
     */
    service?: service;
    /**
     * The unique identifier for the event type. The format is AWS_SERVICE_DESCRIPTION ; for example, AWS_EC2_SYSTEM_MAINTENANCE_EVENT.
     */
    code?: eventTypeCode;
    /**
     * A list of event type category codes. Possible values are issue, accountNotification, or scheduledChange. Currently, the investigation value isn't supported at this time.
     */
    category?: eventTypeCategory;
  }
  export type EventTypeCategoryList = eventTypeCategory[];
  export type EventTypeCodeList = eventTypeCode[];
  export interface EventTypeFilter {
    /**
     * A list of event type codes.
     */
    eventTypeCodes?: EventTypeCodeList;
    /**
     * The Amazon Web Services associated with the event. For example, EC2, RDS.
     */
    services?: serviceList;
    /**
     * A list of event type category codes. Possible values are issue, accountNotification, or scheduledChange. Currently, the investigation value isn't supported at this time.
     */
    eventTypeCategories?: EventTypeCategoryList;
  }
  export type EventTypeList = EventType[];
  export type OrganizationAccountIdsList = accountId[];
  export interface OrganizationAffectedEntitiesErrorItem {
    /**
     * The 12-digit Amazon Web Services account numbers that contains the affected entities.
     */
    awsAccountId?: accountId;
    /**
     * The unique identifier for the event. The event ARN has the arn:aws:health:event-region::event/SERVICE/EVENT_TYPE_CODE/EVENT_TYPE_PLUS_ID  format. For example, an event ARN might look like the following:  arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-DEF456 
     */
    eventArn?: eventArn;
    /**
     * The name of the error.
     */
    errorName?: string;
    /**
     * A message that describes the error. Follow the error message and retry your request. For example, the InvalidAccountInputError error message appears if you call the DescribeAffectedEntitiesForOrganization operation and specify the AccountSpecific value for the EventScopeCode parameter, but don't specify an Amazon Web Services account.
     */
    errorMessage?: string;
  }
  export type OrganizationEntityAccountFiltersList = EntityAccountFilter[];
  export interface OrganizationEntityAggregate {
    /**
     * A list of event ARNs (unique identifiers). For example: "arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-CDE456", "arn:aws:health:us-west-1::event/EBS/AWS_EBS_LOST_VOLUME/AWS_EBS_LOST_VOLUME_CHI789_JKL101" 
     */
    eventArn?: eventArn;
    /**
     * The number of entities for the organization that match the filter criteria for the specified events.
     */
    count?: count;
    /**
     * The number of affected entities aggregated by the entitiy status codes.
     */
    statuses?: entityStatuses;
    /**
     * A list of entity aggregates for each of the specified accounts in your organization that are affected by a specific event. If there are no awsAccountIds provided in the request, this field will be empty in the response.
     */
    accounts?: AccountEntityAggregatesList;
  }
  export type OrganizationEntityAggregatesList = OrganizationEntityAggregate[];
  export type OrganizationEntityFiltersList = EventAccountFilter[];
  export interface OrganizationEvent {
    /**
     * The unique identifier for the event. The event ARN has the arn:aws:health:event-region::event/SERVICE/EVENT_TYPE_CODE/EVENT_TYPE_PLUS_ID  format. For example, an event ARN might look like the following:  arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-DEF456 
     */
    arn?: eventArn;
    /**
     * The Amazon Web Service that is affected by the event, such as EC2 and RDS.
     */
    service?: service;
    /**
     * The unique identifier for the event type. The format is AWS_SERVICE_DESCRIPTION. For example, AWS_EC2_SYSTEM_MAINTENANCE_EVENT.
     */
    eventTypeCode?: eventTypeCode;
    /**
     * A list of event type category codes. Possible values are issue, accountNotification, or scheduledChange. Currently, the investigation value isn't supported at this time.
     */
    eventTypeCategory?: eventTypeCategory;
    /**
     * This parameter specifies if the Health event is a public Amazon Web Service event or an account-specific event.   If the eventScopeCode value is PUBLIC, then the affectedAccounts value is always empty.   If the eventScopeCode value is ACCOUNT_SPECIFIC, then the affectedAccounts value lists the affected Amazon Web Services accounts in your organization. For example, if an event affects a service such as Amazon Elastic Compute Cloud and you have Amazon Web Services accounts that use that service, those account IDs appear in the response.   If the eventScopeCode value is NONE, then the eventArn that you specified in the request is invalid or doesn't exist.  
     */
    eventScopeCode?: eventScopeCode;
    /**
     * The Amazon Web Services Region name of the event.
     */
    region?: region;
    /**
     * The date and time that the event began.
     */
    startTime?: timestamp;
    /**
     * The date and time that the event ended.
     */
    endTime?: timestamp;
    /**
     * The most recent date and time that the event was updated.
     */
    lastUpdatedTime?: timestamp;
    /**
     * The most recent status of the event. Possible values are open, closed, and upcoming.
     */
    statusCode?: eventStatusCode;
  }
  export type OrganizationEventArnsList = eventArn[];
  export type OrganizationEventDetailFiltersList = EventAccountFilter[];
  export interface OrganizationEventDetails {
    /**
     * The 12-digit Amazon Web Services account numbers that contains the affected entities.
     */
    awsAccountId?: accountId;
    event?: Event;
    eventDescription?: EventDescription;
    /**
     * Additional metadata about the event.
     */
    eventMetadata?: eventMetadata;
  }
  export interface OrganizationEventDetailsErrorItem {
    /**
     * Error information returned when a DescribeEventDetailsForOrganization operation can't find a specified event.
     */
    awsAccountId?: accountId;
    /**
     * The unique identifier for the event. The event ARN has the arn:aws:health:event-region::event/SERVICE/EVENT_TYPE_CODE/EVENT_TYPE_PLUS_ID  format. For example, an event ARN might look like the following:  arn:aws:health:us-east-1::event/EC2/EC2_INSTANCE_RETIREMENT_SCHEDULED/EC2_INSTANCE_RETIREMENT_SCHEDULED_ABC123-DEF456 
     */
    eventArn?: eventArn;
    /**
     * The name of the error.
     */
    errorName?: string;
    /**
     * A message that describes the error. If you call the DescribeEventDetailsForOrganization operation and receive one of the following errors, follow the recommendations in the message:   We couldn't find a public event that matches your request. To find an event that is account specific, you must enter an Amazon Web Services account ID in the request.   We couldn't find an account specific event for the specified Amazon Web Services account. To find an event that is public, you must enter a null value for the Amazon Web Services account ID in the request.   Your Amazon Web Services account doesn't include the Amazon Web Services Support plan required to use the Health API. You must have either a Business, Enterprise On-Ramp, or Enterprise Support plan.  
     */
    errorMessage?: string;
  }
  export interface OrganizationEventFilter {
    /**
     * A list of unique identifiers for event types. For example, "AWS_EC2_SYSTEM_MAINTENANCE_EVENT","AWS_RDS_MAINTENANCE_SCHEDULED". 
     */
    eventTypeCodes?: eventTypeList;
    /**
     * A list of 12-digit Amazon Web Services account numbers that contains the affected entities.
     */
    awsAccountIds?: awsAccountIdsList;
    /**
     * The Amazon Web Services associated with the event. For example, EC2, RDS.
     */
    services?: serviceList;
    /**
     * A list of Amazon Web Services Regions.
     */
    regions?: regionList;
    startTime?: DateTimeRange;
    endTime?: DateTimeRange;
    lastUpdatedTime?: DateTimeRange;
    /**
     * A list of entity ARNs (unique identifiers).
     */
    entityArns?: entityArnList;
    /**
     * A list of entity identifiers, such as EC2 instance IDs (i-34ab692e) or EBS volumes (vol-426ab23e).
     */
    entityValues?: entityValueList;
    /**
     * A list of event type category codes. Possible values are issue, accountNotification, or scheduledChange. Currently, the investigation value isn't supported at this time.
     */
    eventTypeCategories?: eventTypeCategoryList;
    /**
     * A list of event status codes.
     */
    eventStatusCodes?: eventStatusCodeList;
  }
  export type OrganizationEventList = OrganizationEvent[];
  export type accountId = string;
  export type affectedAccountsList = accountId[];
  export type aggregateValue = string;
  export type availabilityZone = string;
  export type availabilityZones = availabilityZone[];
  export type awsAccountIdsList = accountId[];
  export type count = number;
  export type dateTimeRangeList = DateTimeRange[];
  export type entityArn = string;
  export type entityArnList = entityArn[];
  export type entityStatusCode = "IMPAIRED"|"UNIMPAIRED"|"UNKNOWN"|"PENDING"|"RESOLVED"|string;
  export type entityStatusCodeList = entityStatusCode[];
  export type entityStatuses = {[key: string]: count};
  export type entityUrl = string;
  export type entityValue = string;
  export type entityValueList = entityValue[];
  export type eventAggregateField = "eventTypeCategory"|string;
  export type eventArn = string;
  export type eventArnList = eventArn[];
  export type eventDescription = string;
  export type eventMetadata = {[key: string]: metadataValue};
  export type eventScopeCode = "PUBLIC"|"ACCOUNT_SPECIFIC"|"NONE"|string;
  export type eventStatusCode = "open"|"closed"|"upcoming"|string;
  export type eventStatusCodeList = eventStatusCode[];
  export type eventType = string;
  export type eventTypeCategory = "issue"|"accountNotification"|"scheduledChange"|"investigation"|string;
  export type eventTypeCategoryList = eventTypeCategory[];
  export type eventTypeCode = string;
  export type eventTypeList = eventType[];
  export type healthServiceAccessStatusForOrganization = string;
  export type locale = string;
  export type maxResults = number;
  export type maxResultsLowerRange = number;
  export type metadataKey = string;
  export type metadataValue = string;
  export type nextToken = string;
  export type region = string;
  export type regionList = region[];
  export type service = string;
  export type serviceList = service[];
  export type tagFilter = tagSet[];
  export type tagKey = string;
  export type tagSet = {[key: string]: tagValue};
  export type tagValue = string;
  export type timestamp = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-08-04"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Health client.
   */
  export import Types = Health;
}
export = Health;
