import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CloudTrail extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CloudTrail.Types.ClientConfiguration)
  config: Config & CloudTrail.Types.ClientConfiguration;
  /**
   * Adds one or more tags to a trail, event data store, or channel, up to a limit of 50. Overwrites an existing tag's value when a new value is specified for an existing tag key. Tag key names must be unique; you cannot have two keys with the same name but different values. If you specify a key without a value, the tag will be created with the specified key and a value of null. You can tag a trail or event data store that applies to all Amazon Web Services Regions only from the Region in which the trail or event data store was created (also known as its home Region).
   */
  addTags(params: CloudTrail.Types.AddTagsRequest, callback?: (err: AWSError, data: CloudTrail.Types.AddTagsResponse) => void): Request<CloudTrail.Types.AddTagsResponse, AWSError>;
  /**
   * Adds one or more tags to a trail, event data store, or channel, up to a limit of 50. Overwrites an existing tag's value when a new value is specified for an existing tag key. Tag key names must be unique; you cannot have two keys with the same name but different values. If you specify a key without a value, the tag will be created with the specified key and a value of null. You can tag a trail or event data store that applies to all Amazon Web Services Regions only from the Region in which the trail or event data store was created (also known as its home Region).
   */
  addTags(callback?: (err: AWSError, data: CloudTrail.Types.AddTagsResponse) => void): Request<CloudTrail.Types.AddTagsResponse, AWSError>;
  /**
   * Cancels a query if the query is not in a terminated state, such as CANCELLED, FAILED, TIMED_OUT, or FINISHED. You must specify an ARN value for EventDataStore. The ID of the query that you want to cancel is also required. When you run CancelQuery, the query status might show as CANCELLED even if the operation is not yet finished.
   */
  cancelQuery(params: CloudTrail.Types.CancelQueryRequest, callback?: (err: AWSError, data: CloudTrail.Types.CancelQueryResponse) => void): Request<CloudTrail.Types.CancelQueryResponse, AWSError>;
  /**
   * Cancels a query if the query is not in a terminated state, such as CANCELLED, FAILED, TIMED_OUT, or FINISHED. You must specify an ARN value for EventDataStore. The ID of the query that you want to cancel is also required. When you run CancelQuery, the query status might show as CANCELLED even if the operation is not yet finished.
   */
  cancelQuery(callback?: (err: AWSError, data: CloudTrail.Types.CancelQueryResponse) => void): Request<CloudTrail.Types.CancelQueryResponse, AWSError>;
  /**
   * Creates a channel for CloudTrail to ingest events from a partner or external source. After you create a channel, a CloudTrail Lake event data store can log events from the partner or source that you specify.
   */
  createChannel(params: CloudTrail.Types.CreateChannelRequest, callback?: (err: AWSError, data: CloudTrail.Types.CreateChannelResponse) => void): Request<CloudTrail.Types.CreateChannelResponse, AWSError>;
  /**
   * Creates a channel for CloudTrail to ingest events from a partner or external source. After you create a channel, a CloudTrail Lake event data store can log events from the partner or source that you specify.
   */
  createChannel(callback?: (err: AWSError, data: CloudTrail.Types.CreateChannelResponse) => void): Request<CloudTrail.Types.CreateChannelResponse, AWSError>;
  /**
   * Creates a new event data store.
   */
  createEventDataStore(params: CloudTrail.Types.CreateEventDataStoreRequest, callback?: (err: AWSError, data: CloudTrail.Types.CreateEventDataStoreResponse) => void): Request<CloudTrail.Types.CreateEventDataStoreResponse, AWSError>;
  /**
   * Creates a new event data store.
   */
  createEventDataStore(callback?: (err: AWSError, data: CloudTrail.Types.CreateEventDataStoreResponse) => void): Request<CloudTrail.Types.CreateEventDataStoreResponse, AWSError>;
  /**
   * Creates a trail that specifies the settings for delivery of log data to an Amazon S3 bucket. 
   */
  createTrail(params: CloudTrail.Types.CreateTrailRequest, callback?: (err: AWSError, data: CloudTrail.Types.CreateTrailResponse) => void): Request<CloudTrail.Types.CreateTrailResponse, AWSError>;
  /**
   * Creates a trail that specifies the settings for delivery of log data to an Amazon S3 bucket. 
   */
  createTrail(callback?: (err: AWSError, data: CloudTrail.Types.CreateTrailResponse) => void): Request<CloudTrail.Types.CreateTrailResponse, AWSError>;
  /**
   * Deletes a channel.
   */
  deleteChannel(params: CloudTrail.Types.DeleteChannelRequest, callback?: (err: AWSError, data: CloudTrail.Types.DeleteChannelResponse) => void): Request<CloudTrail.Types.DeleteChannelResponse, AWSError>;
  /**
   * Deletes a channel.
   */
  deleteChannel(callback?: (err: AWSError, data: CloudTrail.Types.DeleteChannelResponse) => void): Request<CloudTrail.Types.DeleteChannelResponse, AWSError>;
  /**
   * Disables the event data store specified by EventDataStore, which accepts an event data store ARN. After you run DeleteEventDataStore, the event data store enters a PENDING_DELETION state, and is automatically deleted after a wait period of seven days. TerminationProtectionEnabled must be set to False on the event data store; this operation cannot work if TerminationProtectionEnabled is True. After you run DeleteEventDataStore on an event data store, you cannot run ListQueries, DescribeQuery, or GetQueryResults on queries that are using an event data store in a PENDING_DELETION state. An event data store in the PENDING_DELETION state does not incur costs.
   */
  deleteEventDataStore(params: CloudTrail.Types.DeleteEventDataStoreRequest, callback?: (err: AWSError, data: CloudTrail.Types.DeleteEventDataStoreResponse) => void): Request<CloudTrail.Types.DeleteEventDataStoreResponse, AWSError>;
  /**
   * Disables the event data store specified by EventDataStore, which accepts an event data store ARN. After you run DeleteEventDataStore, the event data store enters a PENDING_DELETION state, and is automatically deleted after a wait period of seven days. TerminationProtectionEnabled must be set to False on the event data store; this operation cannot work if TerminationProtectionEnabled is True. After you run DeleteEventDataStore on an event data store, you cannot run ListQueries, DescribeQuery, or GetQueryResults on queries that are using an event data store in a PENDING_DELETION state. An event data store in the PENDING_DELETION state does not incur costs.
   */
  deleteEventDataStore(callback?: (err: AWSError, data: CloudTrail.Types.DeleteEventDataStoreResponse) => void): Request<CloudTrail.Types.DeleteEventDataStoreResponse, AWSError>;
  /**
   *  Deletes the resource-based policy attached to the CloudTrail channel. 
   */
  deleteResourcePolicy(params: CloudTrail.Types.DeleteResourcePolicyRequest, callback?: (err: AWSError, data: CloudTrail.Types.DeleteResourcePolicyResponse) => void): Request<CloudTrail.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   *  Deletes the resource-based policy attached to the CloudTrail channel. 
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: CloudTrail.Types.DeleteResourcePolicyResponse) => void): Request<CloudTrail.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes a trail. This operation must be called from the Region in which the trail was created. DeleteTrail cannot be called on the shadow trails (replicated trails in other Regions) of a trail that is enabled in all Regions.
   */
  deleteTrail(params: CloudTrail.Types.DeleteTrailRequest, callback?: (err: AWSError, data: CloudTrail.Types.DeleteTrailResponse) => void): Request<CloudTrail.Types.DeleteTrailResponse, AWSError>;
  /**
   * Deletes a trail. This operation must be called from the Region in which the trail was created. DeleteTrail cannot be called on the shadow trails (replicated trails in other Regions) of a trail that is enabled in all Regions.
   */
  deleteTrail(callback?: (err: AWSError, data: CloudTrail.Types.DeleteTrailResponse) => void): Request<CloudTrail.Types.DeleteTrailResponse, AWSError>;
  /**
   * Removes CloudTrail delegated administrator permissions from a member account in an organization.
   */
  deregisterOrganizationDelegatedAdmin(params: CloudTrail.Types.DeregisterOrganizationDelegatedAdminRequest, callback?: (err: AWSError, data: CloudTrail.Types.DeregisterOrganizationDelegatedAdminResponse) => void): Request<CloudTrail.Types.DeregisterOrganizationDelegatedAdminResponse, AWSError>;
  /**
   * Removes CloudTrail delegated administrator permissions from a member account in an organization.
   */
  deregisterOrganizationDelegatedAdmin(callback?: (err: AWSError, data: CloudTrail.Types.DeregisterOrganizationDelegatedAdminResponse) => void): Request<CloudTrail.Types.DeregisterOrganizationDelegatedAdminResponse, AWSError>;
  /**
   * Returns metadata about a query, including query run time in milliseconds, number of events scanned and matched, and query status. If the query results were delivered to an S3 bucket, the response also provides the S3 URI and the delivery status. You must specify either a QueryID or a QueryAlias. Specifying the QueryAlias parameter returns information about the last query run for the alias.
   */
  describeQuery(params: CloudTrail.Types.DescribeQueryRequest, callback?: (err: AWSError, data: CloudTrail.Types.DescribeQueryResponse) => void): Request<CloudTrail.Types.DescribeQueryResponse, AWSError>;
  /**
   * Returns metadata about a query, including query run time in milliseconds, number of events scanned and matched, and query status. If the query results were delivered to an S3 bucket, the response also provides the S3 URI and the delivery status. You must specify either a QueryID or a QueryAlias. Specifying the QueryAlias parameter returns information about the last query run for the alias.
   */
  describeQuery(callback?: (err: AWSError, data: CloudTrail.Types.DescribeQueryResponse) => void): Request<CloudTrail.Types.DescribeQueryResponse, AWSError>;
  /**
   * Retrieves settings for one or more trails associated with the current Region for your account.
   */
  describeTrails(params: CloudTrail.Types.DescribeTrailsRequest, callback?: (err: AWSError, data: CloudTrail.Types.DescribeTrailsResponse) => void): Request<CloudTrail.Types.DescribeTrailsResponse, AWSError>;
  /**
   * Retrieves settings for one or more trails associated with the current Region for your account.
   */
  describeTrails(callback?: (err: AWSError, data: CloudTrail.Types.DescribeTrailsResponse) => void): Request<CloudTrail.Types.DescribeTrailsResponse, AWSError>;
  /**
   *  Returns information about a specific channel. 
   */
  getChannel(params: CloudTrail.Types.GetChannelRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetChannelResponse) => void): Request<CloudTrail.Types.GetChannelResponse, AWSError>;
  /**
   *  Returns information about a specific channel. 
   */
  getChannel(callback?: (err: AWSError, data: CloudTrail.Types.GetChannelResponse) => void): Request<CloudTrail.Types.GetChannelResponse, AWSError>;
  /**
   * Returns information about an event data store specified as either an ARN or the ID portion of the ARN.
   */
  getEventDataStore(params: CloudTrail.Types.GetEventDataStoreRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetEventDataStoreResponse) => void): Request<CloudTrail.Types.GetEventDataStoreResponse, AWSError>;
  /**
   * Returns information about an event data store specified as either an ARN or the ID portion of the ARN.
   */
  getEventDataStore(callback?: (err: AWSError, data: CloudTrail.Types.GetEventDataStoreResponse) => void): Request<CloudTrail.Types.GetEventDataStoreResponse, AWSError>;
  /**
   * Describes the settings for the event selectors that you configured for your trail. The information returned for your event selectors includes the following:   If your event selector includes read-only events, write-only events, or all events. This applies to both management events and data events.   If your event selector includes management events.   If your event selector includes data events, the resources on which you are logging data events.   For more information about logging management and data events, see the following topics in the CloudTrail User Guide:    Logging management events     Logging data events   
   */
  getEventSelectors(params: CloudTrail.Types.GetEventSelectorsRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetEventSelectorsResponse) => void): Request<CloudTrail.Types.GetEventSelectorsResponse, AWSError>;
  /**
   * Describes the settings for the event selectors that you configured for your trail. The information returned for your event selectors includes the following:   If your event selector includes read-only events, write-only events, or all events. This applies to both management events and data events.   If your event selector includes management events.   If your event selector includes data events, the resources on which you are logging data events.   For more information about logging management and data events, see the following topics in the CloudTrail User Guide:    Logging management events     Logging data events   
   */
  getEventSelectors(callback?: (err: AWSError, data: CloudTrail.Types.GetEventSelectorsResponse) => void): Request<CloudTrail.Types.GetEventSelectorsResponse, AWSError>;
  /**
   *  Returns information about a specific import. 
   */
  getImport(params: CloudTrail.Types.GetImportRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetImportResponse) => void): Request<CloudTrail.Types.GetImportResponse, AWSError>;
  /**
   *  Returns information about a specific import. 
   */
  getImport(callback?: (err: AWSError, data: CloudTrail.Types.GetImportResponse) => void): Request<CloudTrail.Types.GetImportResponse, AWSError>;
  /**
   * Describes the settings for the Insights event selectors that you configured for your trail. GetInsightSelectors shows if CloudTrail Insights event logging is enabled on the trail, and if it is, which insight types are enabled. If you run GetInsightSelectors on a trail that does not have Insights events enabled, the operation throws the exception InsightNotEnabledException  For more information, see Logging CloudTrail Insights Events for Trails  in the CloudTrail User Guide.
   */
  getInsightSelectors(params: CloudTrail.Types.GetInsightSelectorsRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetInsightSelectorsResponse) => void): Request<CloudTrail.Types.GetInsightSelectorsResponse, AWSError>;
  /**
   * Describes the settings for the Insights event selectors that you configured for your trail. GetInsightSelectors shows if CloudTrail Insights event logging is enabled on the trail, and if it is, which insight types are enabled. If you run GetInsightSelectors on a trail that does not have Insights events enabled, the operation throws the exception InsightNotEnabledException  For more information, see Logging CloudTrail Insights Events for Trails  in the CloudTrail User Guide.
   */
  getInsightSelectors(callback?: (err: AWSError, data: CloudTrail.Types.GetInsightSelectorsResponse) => void): Request<CloudTrail.Types.GetInsightSelectorsResponse, AWSError>;
  /**
   * Gets event data results of a query. You must specify the QueryID value returned by the StartQuery operation.
   */
  getQueryResults(params: CloudTrail.Types.GetQueryResultsRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetQueryResultsResponse) => void): Request<CloudTrail.Types.GetQueryResultsResponse, AWSError>;
  /**
   * Gets event data results of a query. You must specify the QueryID value returned by the StartQuery operation.
   */
  getQueryResults(callback?: (err: AWSError, data: CloudTrail.Types.GetQueryResultsResponse) => void): Request<CloudTrail.Types.GetQueryResultsResponse, AWSError>;
  /**
   *  Retrieves the JSON text of the resource-based policy document attached to the CloudTrail channel. 
   */
  getResourcePolicy(params: CloudTrail.Types.GetResourcePolicyRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetResourcePolicyResponse) => void): Request<CloudTrail.Types.GetResourcePolicyResponse, AWSError>;
  /**
   *  Retrieves the JSON text of the resource-based policy document attached to the CloudTrail channel. 
   */
  getResourcePolicy(callback?: (err: AWSError, data: CloudTrail.Types.GetResourcePolicyResponse) => void): Request<CloudTrail.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Returns settings information for a specified trail.
   */
  getTrail(params: CloudTrail.Types.GetTrailRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetTrailResponse) => void): Request<CloudTrail.Types.GetTrailResponse, AWSError>;
  /**
   * Returns settings information for a specified trail.
   */
  getTrail(callback?: (err: AWSError, data: CloudTrail.Types.GetTrailResponse) => void): Request<CloudTrail.Types.GetTrailResponse, AWSError>;
  /**
   * Returns a JSON-formatted list of information about the specified trail. Fields include information on delivery errors, Amazon SNS and Amazon S3 errors, and start and stop logging times for each trail. This operation returns trail status from a single Region. To return trail status from all Regions, you must call the operation on each Region.
   */
  getTrailStatus(params: CloudTrail.Types.GetTrailStatusRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetTrailStatusResponse) => void): Request<CloudTrail.Types.GetTrailStatusResponse, AWSError>;
  /**
   * Returns a JSON-formatted list of information about the specified trail. Fields include information on delivery errors, Amazon SNS and Amazon S3 errors, and start and stop logging times for each trail. This operation returns trail status from a single Region. To return trail status from all Regions, you must call the operation on each Region.
   */
  getTrailStatus(callback?: (err: AWSError, data: CloudTrail.Types.GetTrailStatusResponse) => void): Request<CloudTrail.Types.GetTrailStatusResponse, AWSError>;
  /**
   *  Lists the channels in the current account, and their source names. 
   */
  listChannels(params: CloudTrail.Types.ListChannelsRequest, callback?: (err: AWSError, data: CloudTrail.Types.ListChannelsResponse) => void): Request<CloudTrail.Types.ListChannelsResponse, AWSError>;
  /**
   *  Lists the channels in the current account, and their source names. 
   */
  listChannels(callback?: (err: AWSError, data: CloudTrail.Types.ListChannelsResponse) => void): Request<CloudTrail.Types.ListChannelsResponse, AWSError>;
  /**
   * Returns information about all event data stores in the account, in the current Region.
   */
  listEventDataStores(params: CloudTrail.Types.ListEventDataStoresRequest, callback?: (err: AWSError, data: CloudTrail.Types.ListEventDataStoresResponse) => void): Request<CloudTrail.Types.ListEventDataStoresResponse, AWSError>;
  /**
   * Returns information about all event data stores in the account, in the current Region.
   */
  listEventDataStores(callback?: (err: AWSError, data: CloudTrail.Types.ListEventDataStoresResponse) => void): Request<CloudTrail.Types.ListEventDataStoresResponse, AWSError>;
  /**
   *  Returns a list of failures for the specified import. 
   */
  listImportFailures(params: CloudTrail.Types.ListImportFailuresRequest, callback?: (err: AWSError, data: CloudTrail.Types.ListImportFailuresResponse) => void): Request<CloudTrail.Types.ListImportFailuresResponse, AWSError>;
  /**
   *  Returns a list of failures for the specified import. 
   */
  listImportFailures(callback?: (err: AWSError, data: CloudTrail.Types.ListImportFailuresResponse) => void): Request<CloudTrail.Types.ListImportFailuresResponse, AWSError>;
  /**
   *  Returns information on all imports, or a select set of imports by ImportStatus or Destination. 
   */
  listImports(params: CloudTrail.Types.ListImportsRequest, callback?: (err: AWSError, data: CloudTrail.Types.ListImportsResponse) => void): Request<CloudTrail.Types.ListImportsResponse, AWSError>;
  /**
   *  Returns information on all imports, or a select set of imports by ImportStatus or Destination. 
   */
  listImports(callback?: (err: AWSError, data: CloudTrail.Types.ListImportsResponse) => void): Request<CloudTrail.Types.ListImportsResponse, AWSError>;
  /**
   * Returns all public keys whose private keys were used to sign the digest files within the specified time range. The public key is needed to validate digest files that were signed with its corresponding private key.  CloudTrail uses different private and public key pairs per Region. Each digest file is signed with a private key unique to its Region. When you validate a digest file from a specific Region, you must look in the same Region for its corresponding public key. 
   */
  listPublicKeys(params: CloudTrail.Types.ListPublicKeysRequest, callback?: (err: AWSError, data: CloudTrail.Types.ListPublicKeysResponse) => void): Request<CloudTrail.Types.ListPublicKeysResponse, AWSError>;
  /**
   * Returns all public keys whose private keys were used to sign the digest files within the specified time range. The public key is needed to validate digest files that were signed with its corresponding private key.  CloudTrail uses different private and public key pairs per Region. Each digest file is signed with a private key unique to its Region. When you validate a digest file from a specific Region, you must look in the same Region for its corresponding public key. 
   */
  listPublicKeys(callback?: (err: AWSError, data: CloudTrail.Types.ListPublicKeysResponse) => void): Request<CloudTrail.Types.ListPublicKeysResponse, AWSError>;
  /**
   * Returns a list of queries and query statuses for the past seven days. You must specify an ARN value for EventDataStore. Optionally, to shorten the list of results, you can specify a time range, formatted as timestamps, by adding StartTime and EndTime parameters, and a QueryStatus value. Valid values for QueryStatus include QUEUED, RUNNING, FINISHED, FAILED, TIMED_OUT, or CANCELLED.
   */
  listQueries(params: CloudTrail.Types.ListQueriesRequest, callback?: (err: AWSError, data: CloudTrail.Types.ListQueriesResponse) => void): Request<CloudTrail.Types.ListQueriesResponse, AWSError>;
  /**
   * Returns a list of queries and query statuses for the past seven days. You must specify an ARN value for EventDataStore. Optionally, to shorten the list of results, you can specify a time range, formatted as timestamps, by adding StartTime and EndTime parameters, and a QueryStatus value. Valid values for QueryStatus include QUEUED, RUNNING, FINISHED, FAILED, TIMED_OUT, or CANCELLED.
   */
  listQueries(callback?: (err: AWSError, data: CloudTrail.Types.ListQueriesResponse) => void): Request<CloudTrail.Types.ListQueriesResponse, AWSError>;
  /**
   * Lists the tags for the specified trails, event data stores, or channels in the current Region.
   */
  listTags(params: CloudTrail.Types.ListTagsRequest, callback?: (err: AWSError, data: CloudTrail.Types.ListTagsResponse) => void): Request<CloudTrail.Types.ListTagsResponse, AWSError>;
  /**
   * Lists the tags for the specified trails, event data stores, or channels in the current Region.
   */
  listTags(callback?: (err: AWSError, data: CloudTrail.Types.ListTagsResponse) => void): Request<CloudTrail.Types.ListTagsResponse, AWSError>;
  /**
   * Lists trails that are in the current account.
   */
  listTrails(params: CloudTrail.Types.ListTrailsRequest, callback?: (err: AWSError, data: CloudTrail.Types.ListTrailsResponse) => void): Request<CloudTrail.Types.ListTrailsResponse, AWSError>;
  /**
   * Lists trails that are in the current account.
   */
  listTrails(callback?: (err: AWSError, data: CloudTrail.Types.ListTrailsResponse) => void): Request<CloudTrail.Types.ListTrailsResponse, AWSError>;
  /**
   * Looks up management events or CloudTrail Insights events that are captured by CloudTrail. You can look up events that occurred in a Region within the last 90 days. Lookup supports the following attributes for management events:   Amazon Web Services access key   Event ID   Event name   Event source   Read only   Resource name   Resource type   User name   Lookup supports the following attributes for Insights events:   Event ID   Event name   Event source   All attributes are optional. The default number of results returned is 50, with a maximum of 50 possible. The response includes a token that you can use to get the next page of results.  The rate of lookup requests is limited to two per second, per account, per Region. If this limit is exceeded, a throttling error occurs. 
   */
  lookupEvents(params: CloudTrail.Types.LookupEventsRequest, callback?: (err: AWSError, data: CloudTrail.Types.LookupEventsResponse) => void): Request<CloudTrail.Types.LookupEventsResponse, AWSError>;
  /**
   * Looks up management events or CloudTrail Insights events that are captured by CloudTrail. You can look up events that occurred in a Region within the last 90 days. Lookup supports the following attributes for management events:   Amazon Web Services access key   Event ID   Event name   Event source   Read only   Resource name   Resource type   User name   Lookup supports the following attributes for Insights events:   Event ID   Event name   Event source   All attributes are optional. The default number of results returned is 50, with a maximum of 50 possible. The response includes a token that you can use to get the next page of results.  The rate of lookup requests is limited to two per second, per account, per Region. If this limit is exceeded, a throttling error occurs. 
   */
  lookupEvents(callback?: (err: AWSError, data: CloudTrail.Types.LookupEventsResponse) => void): Request<CloudTrail.Types.LookupEventsResponse, AWSError>;
  /**
   * Configures an event selector or advanced event selectors for your trail. Use event selectors or advanced event selectors to specify management and data event settings for your trail. If you want your trail to log Insights events, be sure the event selector enables logging of the Insights event types you want configured for your trail. For more information about logging Insights events, see Logging Insights events for trails in the CloudTrail User Guide. By default, trails created without specific event selectors are configured to log all read and write management events, and no data events. When an event occurs in your account, CloudTrail evaluates the event selectors or advanced event selectors in all trails. For each trail, if the event matches any event selector, the trail processes and logs the event. If the event doesn't match any event selector, the trail doesn't log the event. Example   You create an event selector for a trail and specify that you want write-only events.   The EC2 GetConsoleOutput and RunInstances API operations occur in your account.   CloudTrail evaluates whether the events match your event selectors.   The RunInstances is a write-only event and it matches your event selector. The trail logs the event.   The GetConsoleOutput is a read-only event that doesn't match your event selector. The trail doesn't log the event.    The PutEventSelectors operation must be called from the Region in which the trail was created; otherwise, an InvalidHomeRegionException exception is thrown. You can configure up to five event selectors for each trail. For more information, see Logging management events, Logging data events, and Quotas in CloudTrail in the CloudTrail User Guide. You can add advanced event selectors, and conditions for your advanced event selectors, up to a maximum of 500 values for all conditions and selectors on a trail. You can use either AdvancedEventSelectors or EventSelectors, but not both. If you apply AdvancedEventSelectors to a trail, any existing EventSelectors are overwritten. For more information about advanced event selectors, see Logging data events in the CloudTrail User Guide.
   */
  putEventSelectors(params: CloudTrail.Types.PutEventSelectorsRequest, callback?: (err: AWSError, data: CloudTrail.Types.PutEventSelectorsResponse) => void): Request<CloudTrail.Types.PutEventSelectorsResponse, AWSError>;
  /**
   * Configures an event selector or advanced event selectors for your trail. Use event selectors or advanced event selectors to specify management and data event settings for your trail. If you want your trail to log Insights events, be sure the event selector enables logging of the Insights event types you want configured for your trail. For more information about logging Insights events, see Logging Insights events for trails in the CloudTrail User Guide. By default, trails created without specific event selectors are configured to log all read and write management events, and no data events. When an event occurs in your account, CloudTrail evaluates the event selectors or advanced event selectors in all trails. For each trail, if the event matches any event selector, the trail processes and logs the event. If the event doesn't match any event selector, the trail doesn't log the event. Example   You create an event selector for a trail and specify that you want write-only events.   The EC2 GetConsoleOutput and RunInstances API operations occur in your account.   CloudTrail evaluates whether the events match your event selectors.   The RunInstances is a write-only event and it matches your event selector. The trail logs the event.   The GetConsoleOutput is a read-only event that doesn't match your event selector. The trail doesn't log the event.    The PutEventSelectors operation must be called from the Region in which the trail was created; otherwise, an InvalidHomeRegionException exception is thrown. You can configure up to five event selectors for each trail. For more information, see Logging management events, Logging data events, and Quotas in CloudTrail in the CloudTrail User Guide. You can add advanced event selectors, and conditions for your advanced event selectors, up to a maximum of 500 values for all conditions and selectors on a trail. You can use either AdvancedEventSelectors or EventSelectors, but not both. If you apply AdvancedEventSelectors to a trail, any existing EventSelectors are overwritten. For more information about advanced event selectors, see Logging data events in the CloudTrail User Guide.
   */
  putEventSelectors(callback?: (err: AWSError, data: CloudTrail.Types.PutEventSelectorsResponse) => void): Request<CloudTrail.Types.PutEventSelectorsResponse, AWSError>;
  /**
   * Lets you enable Insights event logging by specifying the Insights selectors that you want to enable on an existing trail. You also use PutInsightSelectors to turn off Insights event logging, by passing an empty list of insight types. The valid Insights event types in this release are ApiErrorRateInsight and ApiCallRateInsight. To log CloudTrail Insights events on API call volume, the trail must log write management events. To log CloudTrail Insights events on API error rate, the trail must log read or write management events. You can call GetEventSelectors on a trail to check whether the trail logs management events.
   */
  putInsightSelectors(params: CloudTrail.Types.PutInsightSelectorsRequest, callback?: (err: AWSError, data: CloudTrail.Types.PutInsightSelectorsResponse) => void): Request<CloudTrail.Types.PutInsightSelectorsResponse, AWSError>;
  /**
   * Lets you enable Insights event logging by specifying the Insights selectors that you want to enable on an existing trail. You also use PutInsightSelectors to turn off Insights event logging, by passing an empty list of insight types. The valid Insights event types in this release are ApiErrorRateInsight and ApiCallRateInsight. To log CloudTrail Insights events on API call volume, the trail must log write management events. To log CloudTrail Insights events on API error rate, the trail must log read or write management events. You can call GetEventSelectors on a trail to check whether the trail logs management events.
   */
  putInsightSelectors(callback?: (err: AWSError, data: CloudTrail.Types.PutInsightSelectorsResponse) => void): Request<CloudTrail.Types.PutInsightSelectorsResponse, AWSError>;
  /**
   *  Attaches a resource-based permission policy to a CloudTrail channel that is used for an integration with an event source outside of Amazon Web Services. For more information about resource-based policies, see CloudTrail resource-based policy examples in the CloudTrail User Guide. 
   */
  putResourcePolicy(params: CloudTrail.Types.PutResourcePolicyRequest, callback?: (err: AWSError, data: CloudTrail.Types.PutResourcePolicyResponse) => void): Request<CloudTrail.Types.PutResourcePolicyResponse, AWSError>;
  /**
   *  Attaches a resource-based permission policy to a CloudTrail channel that is used for an integration with an event source outside of Amazon Web Services. For more information about resource-based policies, see CloudTrail resource-based policy examples in the CloudTrail User Guide. 
   */
  putResourcePolicy(callback?: (err: AWSError, data: CloudTrail.Types.PutResourcePolicyResponse) => void): Request<CloudTrail.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Registers an organization’s member account as the CloudTrail delegated administrator.
   */
  registerOrganizationDelegatedAdmin(params: CloudTrail.Types.RegisterOrganizationDelegatedAdminRequest, callback?: (err: AWSError, data: CloudTrail.Types.RegisterOrganizationDelegatedAdminResponse) => void): Request<CloudTrail.Types.RegisterOrganizationDelegatedAdminResponse, AWSError>;
  /**
   * Registers an organization’s member account as the CloudTrail delegated administrator.
   */
  registerOrganizationDelegatedAdmin(callback?: (err: AWSError, data: CloudTrail.Types.RegisterOrganizationDelegatedAdminResponse) => void): Request<CloudTrail.Types.RegisterOrganizationDelegatedAdminResponse, AWSError>;
  /**
   * Removes the specified tags from a trail, event data store, or channel.
   */
  removeTags(params: CloudTrail.Types.RemoveTagsRequest, callback?: (err: AWSError, data: CloudTrail.Types.RemoveTagsResponse) => void): Request<CloudTrail.Types.RemoveTagsResponse, AWSError>;
  /**
   * Removes the specified tags from a trail, event data store, or channel.
   */
  removeTags(callback?: (err: AWSError, data: CloudTrail.Types.RemoveTagsResponse) => void): Request<CloudTrail.Types.RemoveTagsResponse, AWSError>;
  /**
   * Restores a deleted event data store specified by EventDataStore, which accepts an event data store ARN. You can only restore a deleted event data store within the seven-day wait period after deletion. Restoring an event data store can take several minutes, depending on the size of the event data store.
   */
  restoreEventDataStore(params: CloudTrail.Types.RestoreEventDataStoreRequest, callback?: (err: AWSError, data: CloudTrail.Types.RestoreEventDataStoreResponse) => void): Request<CloudTrail.Types.RestoreEventDataStoreResponse, AWSError>;
  /**
   * Restores a deleted event data store specified by EventDataStore, which accepts an event data store ARN. You can only restore a deleted event data store within the seven-day wait period after deletion. Restoring an event data store can take several minutes, depending on the size of the event data store.
   */
  restoreEventDataStore(callback?: (err: AWSError, data: CloudTrail.Types.RestoreEventDataStoreResponse) => void): Request<CloudTrail.Types.RestoreEventDataStoreResponse, AWSError>;
  /**
   * Starts the ingestion of live events on an event data store specified as either an ARN or the ID portion of the ARN. To start ingestion, the event data store Status must be STOPPED_INGESTION and the eventCategory must be Management, Data, or ConfigurationItem.
   */
  startEventDataStoreIngestion(params: CloudTrail.Types.StartEventDataStoreIngestionRequest, callback?: (err: AWSError, data: CloudTrail.Types.StartEventDataStoreIngestionResponse) => void): Request<CloudTrail.Types.StartEventDataStoreIngestionResponse, AWSError>;
  /**
   * Starts the ingestion of live events on an event data store specified as either an ARN or the ID portion of the ARN. To start ingestion, the event data store Status must be STOPPED_INGESTION and the eventCategory must be Management, Data, or ConfigurationItem.
   */
  startEventDataStoreIngestion(callback?: (err: AWSError, data: CloudTrail.Types.StartEventDataStoreIngestionResponse) => void): Request<CloudTrail.Types.StartEventDataStoreIngestionResponse, AWSError>;
  /**
   *  Starts an import of logged trail events from a source S3 bucket to a destination event data store. By default, CloudTrail only imports events contained in the S3 bucket's CloudTrail prefix and the prefixes inside the CloudTrail prefix, and does not check prefixes for other Amazon Web Services services. If you want to import CloudTrail events contained in another prefix, you must include the prefix in the S3LocationUri. For more considerations about importing trail events, see Considerations.   When you start a new import, the Destinations and ImportSource parameters are required. Before starting a new import, disable any access control lists (ACLs) attached to the source S3 bucket. For more information about disabling ACLs, see Controlling ownership of objects and disabling ACLs for your bucket.   When you retry an import, the ImportID parameter is required.    If the destination event data store is for an organization, you must use the management account to import trail events. You cannot use the delegated administrator account for the organization.  
   */
  startImport(params: CloudTrail.Types.StartImportRequest, callback?: (err: AWSError, data: CloudTrail.Types.StartImportResponse) => void): Request<CloudTrail.Types.StartImportResponse, AWSError>;
  /**
   *  Starts an import of logged trail events from a source S3 bucket to a destination event data store. By default, CloudTrail only imports events contained in the S3 bucket's CloudTrail prefix and the prefixes inside the CloudTrail prefix, and does not check prefixes for other Amazon Web Services services. If you want to import CloudTrail events contained in another prefix, you must include the prefix in the S3LocationUri. For more considerations about importing trail events, see Considerations.   When you start a new import, the Destinations and ImportSource parameters are required. Before starting a new import, disable any access control lists (ACLs) attached to the source S3 bucket. For more information about disabling ACLs, see Controlling ownership of objects and disabling ACLs for your bucket.   When you retry an import, the ImportID parameter is required.    If the destination event data store is for an organization, you must use the management account to import trail events. You cannot use the delegated administrator account for the organization.  
   */
  startImport(callback?: (err: AWSError, data: CloudTrail.Types.StartImportResponse) => void): Request<CloudTrail.Types.StartImportResponse, AWSError>;
  /**
   * Starts the recording of Amazon Web Services API calls and log file delivery for a trail. For a trail that is enabled in all Regions, this operation must be called from the Region in which the trail was created. This operation cannot be called on the shadow trails (replicated trails in other Regions) of a trail that is enabled in all Regions.
   */
  startLogging(params: CloudTrail.Types.StartLoggingRequest, callback?: (err: AWSError, data: CloudTrail.Types.StartLoggingResponse) => void): Request<CloudTrail.Types.StartLoggingResponse, AWSError>;
  /**
   * Starts the recording of Amazon Web Services API calls and log file delivery for a trail. For a trail that is enabled in all Regions, this operation must be called from the Region in which the trail was created. This operation cannot be called on the shadow trails (replicated trails in other Regions) of a trail that is enabled in all Regions.
   */
  startLogging(callback?: (err: AWSError, data: CloudTrail.Types.StartLoggingResponse) => void): Request<CloudTrail.Types.StartLoggingResponse, AWSError>;
  /**
   * Starts a CloudTrail Lake query. Use the QueryStatement parameter to provide your SQL query, enclosed in single quotation marks. Use the optional DeliveryS3Uri parameter to deliver the query results to an S3 bucket.  StartQuery requires you specify either the QueryStatement parameter, or a QueryAlias and any QueryParameters. In the current release, the QueryAlias and QueryParameters parameters are used only for the queries that populate the CloudTrail Lake dashboards.
   */
  startQuery(params: CloudTrail.Types.StartQueryRequest, callback?: (err: AWSError, data: CloudTrail.Types.StartQueryResponse) => void): Request<CloudTrail.Types.StartQueryResponse, AWSError>;
  /**
   * Starts a CloudTrail Lake query. Use the QueryStatement parameter to provide your SQL query, enclosed in single quotation marks. Use the optional DeliveryS3Uri parameter to deliver the query results to an S3 bucket.  StartQuery requires you specify either the QueryStatement parameter, or a QueryAlias and any QueryParameters. In the current release, the QueryAlias and QueryParameters parameters are used only for the queries that populate the CloudTrail Lake dashboards.
   */
  startQuery(callback?: (err: AWSError, data: CloudTrail.Types.StartQueryResponse) => void): Request<CloudTrail.Types.StartQueryResponse, AWSError>;
  /**
   * Stops the ingestion of live events on an event data store specified as either an ARN or the ID portion of the ARN. To stop ingestion, the event data store Status must be ENABLED and the eventCategory must be Management, Data, or ConfigurationItem.
   */
  stopEventDataStoreIngestion(params: CloudTrail.Types.StopEventDataStoreIngestionRequest, callback?: (err: AWSError, data: CloudTrail.Types.StopEventDataStoreIngestionResponse) => void): Request<CloudTrail.Types.StopEventDataStoreIngestionResponse, AWSError>;
  /**
   * Stops the ingestion of live events on an event data store specified as either an ARN or the ID portion of the ARN. To stop ingestion, the event data store Status must be ENABLED and the eventCategory must be Management, Data, or ConfigurationItem.
   */
  stopEventDataStoreIngestion(callback?: (err: AWSError, data: CloudTrail.Types.StopEventDataStoreIngestionResponse) => void): Request<CloudTrail.Types.StopEventDataStoreIngestionResponse, AWSError>;
  /**
   *  Stops a specified import. 
   */
  stopImport(params: CloudTrail.Types.StopImportRequest, callback?: (err: AWSError, data: CloudTrail.Types.StopImportResponse) => void): Request<CloudTrail.Types.StopImportResponse, AWSError>;
  /**
   *  Stops a specified import. 
   */
  stopImport(callback?: (err: AWSError, data: CloudTrail.Types.StopImportResponse) => void): Request<CloudTrail.Types.StopImportResponse, AWSError>;
  /**
   * Suspends the recording of Amazon Web Services API calls and log file delivery for the specified trail. Under most circumstances, there is no need to use this action. You can update a trail without stopping it first. This action is the only way to stop recording. For a trail enabled in all Regions, this operation must be called from the Region in which the trail was created, or an InvalidHomeRegionException will occur. This operation cannot be called on the shadow trails (replicated trails in other Regions) of a trail enabled in all Regions.
   */
  stopLogging(params: CloudTrail.Types.StopLoggingRequest, callback?: (err: AWSError, data: CloudTrail.Types.StopLoggingResponse) => void): Request<CloudTrail.Types.StopLoggingResponse, AWSError>;
  /**
   * Suspends the recording of Amazon Web Services API calls and log file delivery for the specified trail. Under most circumstances, there is no need to use this action. You can update a trail without stopping it first. This action is the only way to stop recording. For a trail enabled in all Regions, this operation must be called from the Region in which the trail was created, or an InvalidHomeRegionException will occur. This operation cannot be called on the shadow trails (replicated trails in other Regions) of a trail enabled in all Regions.
   */
  stopLogging(callback?: (err: AWSError, data: CloudTrail.Types.StopLoggingResponse) => void): Request<CloudTrail.Types.StopLoggingResponse, AWSError>;
  /**
   * Updates a channel specified by a required channel ARN or UUID.
   */
  updateChannel(params: CloudTrail.Types.UpdateChannelRequest, callback?: (err: AWSError, data: CloudTrail.Types.UpdateChannelResponse) => void): Request<CloudTrail.Types.UpdateChannelResponse, AWSError>;
  /**
   * Updates a channel specified by a required channel ARN or UUID.
   */
  updateChannel(callback?: (err: AWSError, data: CloudTrail.Types.UpdateChannelResponse) => void): Request<CloudTrail.Types.UpdateChannelResponse, AWSError>;
  /**
   * Updates an event data store. The required EventDataStore value is an ARN or the ID portion of the ARN. Other parameters are optional, but at least one optional parameter must be specified, or CloudTrail throws an error. RetentionPeriod is in days, and valid values are integers between 90 and 2557. By default, TerminationProtection is enabled. For event data stores for CloudTrail events, AdvancedEventSelectors includes or excludes management and data events in your event data store. For more information about AdvancedEventSelectors, see AdvancedEventSelectors.  For event data stores for Config configuration items, Audit Manager evidence, or non-Amazon Web Services events, AdvancedEventSelectors includes events of that type in your event data store.
   */
  updateEventDataStore(params: CloudTrail.Types.UpdateEventDataStoreRequest, callback?: (err: AWSError, data: CloudTrail.Types.UpdateEventDataStoreResponse) => void): Request<CloudTrail.Types.UpdateEventDataStoreResponse, AWSError>;
  /**
   * Updates an event data store. The required EventDataStore value is an ARN or the ID portion of the ARN. Other parameters are optional, but at least one optional parameter must be specified, or CloudTrail throws an error. RetentionPeriod is in days, and valid values are integers between 90 and 2557. By default, TerminationProtection is enabled. For event data stores for CloudTrail events, AdvancedEventSelectors includes or excludes management and data events in your event data store. For more information about AdvancedEventSelectors, see AdvancedEventSelectors.  For event data stores for Config configuration items, Audit Manager evidence, or non-Amazon Web Services events, AdvancedEventSelectors includes events of that type in your event data store.
   */
  updateEventDataStore(callback?: (err: AWSError, data: CloudTrail.Types.UpdateEventDataStoreResponse) => void): Request<CloudTrail.Types.UpdateEventDataStoreResponse, AWSError>;
  /**
   * Updates trail settings that control what events you are logging, and how to handle log files. Changes to a trail do not require stopping the CloudTrail service. Use this action to designate an existing bucket for log delivery. If the existing bucket has previously been a target for CloudTrail log files, an IAM policy exists for the bucket. UpdateTrail must be called from the Region in which the trail was created; otherwise, an InvalidHomeRegionException is thrown.
   */
  updateTrail(params: CloudTrail.Types.UpdateTrailRequest, callback?: (err: AWSError, data: CloudTrail.Types.UpdateTrailResponse) => void): Request<CloudTrail.Types.UpdateTrailResponse, AWSError>;
  /**
   * Updates trail settings that control what events you are logging, and how to handle log files. Changes to a trail do not require stopping the CloudTrail service. Use this action to designate an existing bucket for log delivery. If the existing bucket has previously been a target for CloudTrail log files, an IAM policy exists for the bucket. UpdateTrail must be called from the Region in which the trail was created; otherwise, an InvalidHomeRegionException is thrown.
   */
  updateTrail(callback?: (err: AWSError, data: CloudTrail.Types.UpdateTrailResponse) => void): Request<CloudTrail.Types.UpdateTrailResponse, AWSError>;
}
declare namespace CloudTrail {
  export type AccountId = string;
  export interface AddTagsRequest {
    /**
     * Specifies the ARN of the trail, event data store, or channel to which one or more tags will be added. The format of a trail ARN is: arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail  The format of an event data store ARN is: arn:aws:cloudtrail:us-east-2:123456789012:eventdatastore/EXAMPLE-f852-4e8f-8bd1-bcf6cEXAMPLE  The format of a channel ARN is: arn:aws:cloudtrail:us-east-2:123456789012:channel/01234567890 
     */
    ResourceId: String;
    /**
     * Contains a list of tags, up to a limit of 50
     */
    TagsList: TagsList;
  }
  export interface AddTagsResponse {
  }
  export interface AdvancedEventSelector {
    /**
     * An optional, descriptive name for an advanced event selector, such as "Log data events for only two S3 buckets".
     */
    Name?: SelectorName;
    /**
     * Contains all selector statements in an advanced event selector.
     */
    FieldSelectors: AdvancedFieldSelectors;
  }
  export type AdvancedEventSelectors = AdvancedEventSelector[];
  export interface AdvancedFieldSelector {
    /**
     *  A field in a CloudTrail event record on which to filter events to be logged. For event data stores for Config configuration items, Audit Manager evidence, or non-Amazon Web Services events, the field is used only for selecting events as filtering is not supported.   For CloudTrail event records, supported fields include readOnly, eventCategory, eventSource (for management events), eventName, resources.type, and resources.ARN.   For event data stores for Config configuration items, Audit Manager evidence, or non-Amazon Web Services events, the only supported field is eventCategory.      readOnly  - Optional. Can be set to Equals a value of true or false. If you do not add this field, CloudTrail logs both read and write events. A value of true logs only read events. A value of false logs only write events.     eventSource  - For filtering management events only. This can be set only to NotEquals kms.amazonaws.com.     eventName  - Can use any operator. You can use it to ﬁlter in or ﬁlter out any data event logged to CloudTrail, such as PutBucket or GetSnapshotBlock. You can have multiple values for this ﬁeld, separated by commas.     eventCategory  - This is required and must be set to Equals.     For CloudTrail event records, the value must be Management or Data.     For Config configuration items, the value must be ConfigurationItem.     For Audit Manager evidence, the value must be Evidence.     For non-Amazon Web Services events, the value must be ActivityAuditLog.        resources.type  - This ﬁeld is required for CloudTrail data events. resources.type can only use the Equals operator, and the value can be one of the following:    AWS::DynamoDB::Table     AWS::Lambda::Function     AWS::S3::Object     AWS::CloudTrail::Channel     AWS::CodeWhisperer::Profile     AWS::Cognito::IdentityPool     AWS::DynamoDB::Stream     AWS::EC2::Snapshot     AWS::EMRWAL::Workspace     AWS::FinSpace::Environment     AWS::Glue::Table     AWS::GuardDuty::Detector     AWS::KendraRanking::ExecutionPlan     AWS::ManagedBlockchain::Network     AWS::ManagedBlockchain::Node     AWS::MedicalImaging::Datastore     AWS::SageMaker::ExperimentTrialComponent     AWS::SageMaker::FeatureGroup     AWS::S3::AccessPoint     AWS::S3ObjectLambda::AccessPoint     AWS::S3Outposts::Object     AWS::SSMMessages::ControlChannel     AWS::VerifiedPermissions::PolicyStore     You can have only one resources.type ﬁeld per selector. To log data events on more than one resource type, add another selector.     resources.ARN  - You can use any operator with resources.ARN, but if you use Equals or NotEquals, the value must exactly match the ARN of a valid resource of the type you've speciﬁed in the template as the value of resources.type. For example, if resources.type equals AWS::S3::Object, the ARN must be in one of the following formats. To log all data events for all objects in a specific S3 bucket, use the StartsWith operator, and include only the bucket ARN as the matching value. The trailing slash is intentional; do not exclude it. Replace the text between less than and greater than symbols (&lt;&gt;) with resource-specific information.     arn:&lt;partition&gt;:s3:::&lt;bucket_name&gt;/     arn:&lt;partition&gt;:s3:::&lt;bucket_name&gt;/&lt;object_path&gt;/    When resources.type equals AWS::DynamoDB::Table, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:dynamodb:&lt;region&gt;:&lt;account_ID&gt;:table/&lt;table_name&gt;    When resources.type equals AWS::Lambda::Function, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:lambda:&lt;region&gt;:&lt;account_ID&gt;:function:&lt;function_name&gt;    When resources.type equals AWS::CloudTrail::Channel, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:cloudtrail:&lt;region&gt;:&lt;account_ID&gt;:channel/&lt;channel_UUID&gt;    When resources.type equals AWS::CodeWhisperer::Profile, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:codewhisperer:&lt;region&gt;:&lt;account_ID&gt;:profile/&lt;profile_ID&gt;    When resources.type equals AWS::Cognito::IdentityPool, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:cognito-identity:&lt;region&gt;:&lt;account_ID&gt;:identitypool/&lt;identity_pool_ID&gt;    When resources.type equals AWS::DynamoDB::Stream, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:dynamodb:&lt;region&gt;:&lt;account_ID&gt;:table/&lt;table_name&gt;/stream/&lt;date_time&gt;    When resources.type equals AWS::EC2::Snapshot, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:ec2:&lt;region&gt;::snapshot/&lt;snapshot_ID&gt;    When resources.type equals AWS::EMRWAL::Workspace, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:emrwal:&lt;region&gt;::workspace/&lt;workspace_name&gt;    When resources.type equals AWS::FinSpace::Environment, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:finspace:&lt;region&gt;:&lt;account_ID&gt;:environment/&lt;environment_ID&gt;    When resources.type equals AWS::Glue::Table, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:glue:&lt;region&gt;:&lt;account_ID&gt;:table/&lt;database_name&gt;/&lt;table_name&gt;    When resources.type equals AWS::GuardDuty::Detector, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:guardduty:&lt;region&gt;:&lt;account_ID&gt;:detector/&lt;detector_ID&gt;    When resources.type equals AWS::KendraRanking::ExecutionPlan, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:kendra-ranking:&lt;region&gt;:&lt;account_ID&gt;:rescore-execution-plan/&lt;rescore_execution_plan_ID&gt;    When resources.type equals AWS::ManagedBlockchain::Network, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:managedblockchain:::networks/&lt;network_name&gt;    When resources.type equals AWS::ManagedBlockchain::Node, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:managedblockchain:&lt;region&gt;:&lt;account_ID&gt;:nodes/&lt;node_ID&gt;    When resources.type equals AWS::MedicalImaging::Datastore, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:medical-imaging:&lt;region&gt;:&lt;account_ID&gt;:datastore/&lt;data_store_ID&gt;    When resources.type equals AWS::SageMaker::ExperimentTrialComponent, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:sagemaker:&lt;region&gt;:&lt;account_ID&gt;:experiment-trial-component/&lt;experiment_trial_component_name&gt;    When resources.type equals AWS::SageMaker::FeatureGroup, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:sagemaker:&lt;region&gt;:&lt;account_ID&gt;:feature-group/&lt;feature_group_name&gt;    When resources.type equals AWS::S3::AccessPoint, and the operator is set to Equals or NotEquals, the ARN must be in one of the following formats. To log events on all objects in an S3 access point, we recommend that you use only the access point ARN, don’t include the object path, and use the StartsWith or NotStartsWith operators.    arn:&lt;partition&gt;:s3:&lt;region&gt;:&lt;account_ID&gt;:accesspoint/&lt;access_point_name&gt;     arn:&lt;partition&gt;:s3:&lt;region&gt;:&lt;account_ID&gt;:accesspoint/&lt;access_point_name&gt;/object/&lt;object_path&gt;    When resources.type equals AWS::S3ObjectLambda::AccessPoint, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:s3-object-lambda:&lt;region&gt;:&lt;account_ID&gt;:accesspoint/&lt;access_point_name&gt;    When resources.type equals AWS::S3Outposts::Object, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:s3-outposts:&lt;region&gt;:&lt;account_ID&gt;:&lt;object_path&gt;    When resources.type equals AWS::SSMMessages::ControlChannel, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:ssmmessages:&lt;region&gt;:&lt;account_ID&gt;:control-channel/&lt;channel_ID&gt;    When resources.type equals AWS::VerifiedPermissions::PolicyStore, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:verifiedpermissions:&lt;region&gt;:&lt;account_ID&gt;:policy-store/&lt;policy_store_UUID&gt;     
     */
    Field: SelectorField;
    /**
     *  An operator that includes events that match the exact value of the event record field specified as the value of Field. This is the only valid operator that you can use with the readOnly, eventCategory, and resources.type fields.
     */
    Equals?: Operator;
    /**
     * An operator that includes events that match the first few characters of the event record field specified as the value of Field.
     */
    StartsWith?: Operator;
    /**
     * An operator that includes events that match the last few characters of the event record field specified as the value of Field.
     */
    EndsWith?: Operator;
    /**
     *  An operator that excludes events that match the exact value of the event record field specified as the value of Field. 
     */
    NotEquals?: Operator;
    /**
     *  An operator that excludes events that match the first few characters of the event record field specified as the value of Field. 
     */
    NotStartsWith?: Operator;
    /**
     *  An operator that excludes events that match the last few characters of the event record field specified as the value of Field. 
     */
    NotEndsWith?: Operator;
  }
  export type AdvancedFieldSelectors = AdvancedFieldSelector[];
  export type Boolean = boolean;
  export type ByteBuffer = Buffer|Uint8Array|Blob|string;
  export interface CancelQueryRequest {
    /**
     * The ARN (or the ID suffix of the ARN) of an event data store on which the specified query is running.
     */
    EventDataStore?: EventDataStoreArn;
    /**
     * The ID of the query that you want to cancel. The QueryId comes from the response of a StartQuery operation.
     */
    QueryId: UUID;
  }
  export interface CancelQueryResponse {
    /**
     * The ID of the canceled query.
     */
    QueryId: UUID;
    /**
     * Shows the status of a query after a CancelQuery request. Typically, the values shown are either RUNNING or CANCELLED.
     */
    QueryStatus: QueryStatus;
  }
  export interface Channel {
    /**
     * The Amazon Resource Name (ARN) of a channel.
     */
    ChannelArn?: ChannelArn;
    /**
     *  The name of the CloudTrail channel. For service-linked channels, the name is aws-service-channel/service-name/custom-suffix where service-name represents the name of the Amazon Web Services service that created the channel and custom-suffix represents the suffix created by the Amazon Web Services service. 
     */
    Name?: ChannelName;
  }
  export type ChannelArn = string;
  export type ChannelName = string;
  export type Channels = Channel[];
  export interface CreateChannelRequest {
    /**
     * The name of the channel.
     */
    Name: ChannelName;
    /**
     * The name of the partner or external event source. You cannot change this name after you create the channel. A maximum of one channel is allowed per source.  A source can be either Custom for all valid non-Amazon Web Services events, or the name of a partner event source. For information about the source names for available partners, see Additional information about integration partners in the CloudTrail User Guide. 
     */
    Source: Source;
    /**
     * One or more event data stores to which events arriving through a channel will be logged.
     */
    Destinations: Destinations;
    Tags?: TagsList;
  }
  export interface CreateChannelResponse {
    /**
     * The Amazon Resource Name (ARN) of the new channel.
     */
    ChannelArn?: ChannelArn;
    /**
     * The name of the new channel.
     */
    Name?: ChannelName;
    /**
     * The partner or external event source name.
     */
    Source?: Source;
    /**
     * The event data stores that log the events arriving through the channel.
     */
    Destinations?: Destinations;
    Tags?: TagsList;
  }
  export interface CreateEventDataStoreRequest {
    /**
     * The name of the event data store.
     */
    Name: EventDataStoreName;
    /**
     * The advanced event selectors to use to select the events for the data store. You can configure up to five advanced event selectors for each event data store.  For more information about how to use advanced event selectors to log CloudTrail events, see Log events by using advanced event selectors in the CloudTrail User Guide. For more information about how to use advanced event selectors to include Config configuration items in your event data store, see Create an event data store for Config configuration items in the CloudTrail User Guide. For more information about how to use advanced event selectors to include non-Amazon Web Services events in your event data store, see Create an integration to log events from outside Amazon Web Services in the CloudTrail User Guide.
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
    /**
     * Specifies whether the event data store includes events from all Regions, or only from the Region in which the event data store is created.
     */
    MultiRegionEnabled?: Boolean;
    /**
     * Specifies whether an event data store collects events logged for an organization in Organizations.
     */
    OrganizationEnabled?: Boolean;
    /**
     * The retention period of the event data store, in days. You can set a retention period of up to 2557 days, the equivalent of seven years. CloudTrail Lake determines whether to retain an event by checking if the eventTime of the event is within the specified retention period. For example, if you set a retention period of 90 days, CloudTrail will remove events when the eventTime is older than 90 days.  If you plan to copy trail events to this event data store, we recommend that you consider both the age of the events that you want to copy as well as how long you want to keep the copied events in your event data store. For example, if you copy trail events that are 5 years old and specify a retention period of 7 years, the event data store will retain those events for two years. 
     */
    RetentionPeriod?: RetentionPeriod;
    /**
     * Specifies whether termination protection is enabled for the event data store. If termination protection is enabled, you cannot delete the event data store until termination protection is disabled.
     */
    TerminationProtectionEnabled?: TerminationProtectionEnabled;
    TagsList?: TagsList;
    /**
     * Specifies the KMS key ID to use to encrypt the events delivered by CloudTrail. The value can be an alias name prefixed by alias/, a fully specified ARN to an alias, a fully specified ARN to a key, or a globally unique identifier.  Disabling or deleting the KMS key, or removing CloudTrail permissions on the key, prevents CloudTrail from logging events to the event data store, and prevents users from querying the data in the event data store that was encrypted with the key. After you associate an event data store with a KMS key, the KMS key cannot be removed or changed. Before you disable or delete a KMS key that you are using with an event data store, delete or back up your event data store.  CloudTrail also supports KMS multi-Region keys. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. Examples:    alias/MyAliasName     arn:aws:kms:us-east-2:123456789012:alias/MyAliasName     arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012     12345678-1234-1234-1234-123456789012   
     */
    KmsKeyId?: EventDataStoreKmsKeyId;
    /**
     * Specifies whether the event data store should start ingesting live events. The default is true.
     */
    StartIngestion?: Boolean;
  }
  export interface CreateEventDataStoreResponse {
    /**
     * The ARN of the event data store.
     */
    EventDataStoreArn?: EventDataStoreArn;
    /**
     * The name of the event data store.
     */
    Name?: EventDataStoreName;
    /**
     * The status of event data store creation.
     */
    Status?: EventDataStoreStatus;
    /**
     * The advanced event selectors that were used to select the events for the data store.
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
    /**
     * Indicates whether the event data store collects events from all Regions, or only from the Region in which it was created.
     */
    MultiRegionEnabled?: Boolean;
    /**
     * Indicates whether an event data store is collecting logged events for an organization in Organizations.
     */
    OrganizationEnabled?: Boolean;
    /**
     * The retention period of an event data store, in days.
     */
    RetentionPeriod?: RetentionPeriod;
    /**
     * Indicates whether termination protection is enabled for the event data store.
     */
    TerminationProtectionEnabled?: TerminationProtectionEnabled;
    TagsList?: TagsList;
    /**
     * The timestamp that shows when the event data store was created.
     */
    CreatedTimestamp?: _Date;
    /**
     * The timestamp that shows when an event data store was updated, if applicable. UpdatedTimestamp is always either the same or newer than the time shown in CreatedTimestamp.
     */
    UpdatedTimestamp?: _Date;
    /**
     * Specifies the KMS key ID that encrypts the events delivered by CloudTrail. The value is a fully specified ARN to a KMS key in the following format.  arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012 
     */
    KmsKeyId?: EventDataStoreKmsKeyId;
  }
  export interface CreateTrailRequest {
    /**
     * Specifies the name of the trail. The name must meet the following requirements:   Contain only ASCII letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), or dashes (-)   Start with a letter or number, and end with a letter or number   Be between 3 and 128 characters   Have no adjacent periods, underscores or dashes. Names like my-_namespace and my--namespace are not valid.   Not be in IP address format (for example, 192.168.5.4)  
     */
    Name: String;
    /**
     * Specifies the name of the Amazon S3 bucket designated for publishing log files. See Amazon S3 Bucket Naming Requirements.
     */
    S3BucketName: String;
    /**
     * Specifies the Amazon S3 key prefix that comes after the name of the bucket you have designated for log file delivery. For more information, see Finding Your CloudTrail Log Files. The maximum length is 200 characters.
     */
    S3KeyPrefix?: String;
    /**
     * Specifies the name of the Amazon SNS topic defined for notification of log file delivery. The maximum length is 256 characters.
     */
    SnsTopicName?: String;
    /**
     * Specifies whether the trail is publishing events from global services such as IAM to the log files.
     */
    IncludeGlobalServiceEvents?: Boolean;
    /**
     * Specifies whether the trail is created in the current Region or in all Regions. The default is false, which creates a trail only in the Region where you are signed in. As a best practice, consider creating trails that log events in all Regions.
     */
    IsMultiRegionTrail?: Boolean;
    /**
     * Specifies whether log file integrity validation is enabled. The default is false.  When you disable log file integrity validation, the chain of digest files is broken after one hour. CloudTrail does not create digest files for log files that were delivered during a period in which log file integrity validation was disabled. For example, if you enable log file integrity validation at noon on January 1, disable it at noon on January 2, and re-enable it at noon on January 10, digest files will not be created for the log files delivered from noon on January 2 to noon on January 10. The same applies whenever you stop CloudTrail logging or delete a trail. 
     */
    EnableLogFileValidation?: Boolean;
    /**
     * Specifies a log group name using an Amazon Resource Name (ARN), a unique identifier that represents the log group to which CloudTrail logs will be delivered. You must use a log group that exists in your account. Not required unless you specify CloudWatchLogsRoleArn.
     */
    CloudWatchLogsLogGroupArn?: String;
    /**
     * Specifies the role for the CloudWatch Logs endpoint to assume to write to a user's log group. You must use a role that exists in your account.
     */
    CloudWatchLogsRoleArn?: String;
    /**
     * Specifies the KMS key ID to use to encrypt the logs delivered by CloudTrail. The value can be an alias name prefixed by alias/, a fully specified ARN to an alias, a fully specified ARN to a key, or a globally unique identifier. CloudTrail also supports KMS multi-Region keys. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. Examples:    alias/MyAliasName     arn:aws:kms:us-east-2:123456789012:alias/MyAliasName     arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012     12345678-1234-1234-1234-123456789012   
     */
    KmsKeyId?: String;
    /**
     * Specifies whether the trail is created for all accounts in an organization in Organizations, or only for the current Amazon Web Services account. The default is false, and cannot be true unless the call is made on behalf of an Amazon Web Services account that is the management account or delegated administrator account for an organization in Organizations.
     */
    IsOrganizationTrail?: Boolean;
    TagsList?: TagsList;
  }
  export interface CreateTrailResponse {
    /**
     * Specifies the name of the trail.
     */
    Name?: String;
    /**
     * Specifies the name of the Amazon S3 bucket designated for publishing log files.
     */
    S3BucketName?: String;
    /**
     * Specifies the Amazon S3 key prefix that comes after the name of the bucket you have designated for log file delivery. For more information, see Finding Your CloudTrail Log Files.
     */
    S3KeyPrefix?: String;
    /**
     * This field is no longer in use. Use SnsTopicARN.
     */
    SnsTopicName?: String;
    /**
     * Specifies the ARN of the Amazon SNS topic that CloudTrail uses to send notifications when log files are delivered. The format of a topic ARN is:  arn:aws:sns:us-east-2:123456789012:MyTopic 
     */
    SnsTopicARN?: String;
    /**
     * Specifies whether the trail is publishing events from global services such as IAM to the log files.
     */
    IncludeGlobalServiceEvents?: Boolean;
    /**
     * Specifies whether the trail exists in one Region or in all Regions.
     */
    IsMultiRegionTrail?: Boolean;
    /**
     * Specifies the ARN of the trail that was created. The format of a trail ARN is:  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailARN?: String;
    /**
     * Specifies whether log file integrity validation is enabled.
     */
    LogFileValidationEnabled?: Boolean;
    /**
     * Specifies the Amazon Resource Name (ARN) of the log group to which CloudTrail logs will be delivered.
     */
    CloudWatchLogsLogGroupArn?: String;
    /**
     * Specifies the role for the CloudWatch Logs endpoint to assume to write to a user's log group.
     */
    CloudWatchLogsRoleArn?: String;
    /**
     * Specifies the KMS key ID that encrypts the events delivered by CloudTrail. The value is a fully specified ARN to a KMS key in the following format.  arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012 
     */
    KmsKeyId?: String;
    /**
     * Specifies whether the trail is an organization trail.
     */
    IsOrganizationTrail?: Boolean;
  }
  export interface DataResource {
    /**
     * The resource type in which you want to log data events. You can specify the following basic event selector resource types:    AWS::DynamoDB::Table     AWS::Lambda::Function     AWS::S3::Object    The following resource types are also available through advanced event selectors. Basic event selector resource types are valid in advanced event selectors, but advanced event selector resource types are not valid in basic event selectors. For more information, see AdvancedFieldSelector.    AWS::CloudTrail::Channel     AWS::CodeWhisperer::Profile     AWS::Cognito::IdentityPool     AWS::DynamoDB::Stream     AWS::EC2::Snapshot     AWS::EMRWAL::Workspace     AWS::FinSpace::Environment     AWS::Glue::Table     AWS::GuardDuty::Detector     AWS::KendraRanking::ExecutionPlan     AWS::ManagedBlockchain::Network     AWS::ManagedBlockchain::Node     AWS::MedicalImaging::Datastore     AWS::SageMaker::ExperimentTrialComponent     AWS::SageMaker::FeatureGroup     AWS::S3::AccessPoint     AWS::S3ObjectLambda::AccessPoint     AWS::S3Outposts::Object     AWS::SSMMessages::ControlChannel     AWS::VerifiedPermissions::PolicyStore   
     */
    Type?: String;
    /**
     * An array of Amazon Resource Name (ARN) strings or partial ARN strings for the specified objects.   To log data events for all objects in all S3 buckets in your Amazon Web Services account, specify the prefix as arn:aws:s3.  This also enables logging of data event activity performed by any user or role in your Amazon Web Services account, even if that activity is performed on a bucket that belongs to another Amazon Web Services account.    To log data events for all objects in an S3 bucket, specify the bucket and an empty object prefix such as arn:aws:s3:::bucket-1/. The trail logs data events for all objects in this S3 bucket.   To log data events for specific objects, specify the S3 bucket and object prefix such as arn:aws:s3:::bucket-1/example-images. The trail logs data events for objects in this S3 bucket that match the prefix.   To log data events for all Lambda functions in your Amazon Web Services account, specify the prefix as arn:aws:lambda.  This also enables logging of Invoke activity performed by any user or role in your Amazon Web Services account, even if that activity is performed on a function that belongs to another Amazon Web Services account.     To log data events for a specific Lambda function, specify the function ARN.  Lambda function ARNs are exact. For example, if you specify a function ARN arn:aws:lambda:us-west-2:111111111111:function:helloworld, data events will only be logged for arn:aws:lambda:us-west-2:111111111111:function:helloworld. They will not be logged for arn:aws:lambda:us-west-2:111111111111:function:helloworld2.    To log data events for all DynamoDB tables in your Amazon Web Services account, specify the prefix as arn:aws:dynamodb.  
     */
    Values?: DataResourceValues;
  }
  export type DataResourceValues = String[];
  export type DataResources = DataResource[];
  export type _Date = Date;
  export interface DeleteChannelRequest {
    /**
     * The ARN or the UUID value of the channel that you want to delete.
     */
    Channel: ChannelArn;
  }
  export interface DeleteChannelResponse {
  }
  export interface DeleteEventDataStoreRequest {
    /**
     * The ARN (or the ID suffix of the ARN) of the event data store to delete.
     */
    EventDataStore: EventDataStoreArn;
  }
  export interface DeleteEventDataStoreResponse {
  }
  export interface DeleteResourcePolicyRequest {
    /**
     *  The Amazon Resource Name (ARN) of the CloudTrail channel you're deleting the resource-based policy from. The following is the format of a resource ARN: arn:aws:cloudtrail:us-east-2:123456789012:channel/MyChannel. 
     */
    ResourceArn: ResourceArn;
  }
  export interface DeleteResourcePolicyResponse {
  }
  export interface DeleteTrailRequest {
    /**
     * Specifies the name or the CloudTrail ARN of the trail to be deleted. The following is the format of a trail ARN. arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    Name: String;
  }
  export interface DeleteTrailResponse {
  }
  export type DeliveryS3Uri = string;
  export type DeliveryStatus = "SUCCESS"|"FAILED"|"FAILED_SIGNING_FILE"|"PENDING"|"RESOURCE_NOT_FOUND"|"ACCESS_DENIED"|"ACCESS_DENIED_SIGNING_FILE"|"CANCELLED"|"UNKNOWN"|string;
  export interface DeregisterOrganizationDelegatedAdminRequest {
    /**
     * A delegated administrator account ID. This is a member account in an organization that is currently designated as a delegated administrator.
     */
    DelegatedAdminAccountId: AccountId;
  }
  export interface DeregisterOrganizationDelegatedAdminResponse {
  }
  export interface DescribeQueryRequest {
    /**
     * The ARN (or the ID suffix of the ARN) of an event data store on which the specified query was run.
     */
    EventDataStore?: EventDataStoreArn;
    /**
     * The query ID.
     */
    QueryId?: UUID;
    /**
     *  The alias that identifies a query template. 
     */
    QueryAlias?: QueryAlias;
  }
  export interface DescribeQueryResponse {
    /**
     * The ID of the query.
     */
    QueryId?: UUID;
    /**
     * The SQL code of a query.
     */
    QueryString?: QueryStatement;
    /**
     * The status of a query. Values for QueryStatus include QUEUED, RUNNING, FINISHED, FAILED, TIMED_OUT, or CANCELLED 
     */
    QueryStatus?: QueryStatus;
    /**
     * Metadata about a query, including the number of events that were matched, the total number of events scanned, the query run time in milliseconds, and the query's creation time.
     */
    QueryStatistics?: QueryStatisticsForDescribeQuery;
    /**
     * The error message returned if a query failed.
     */
    ErrorMessage?: ErrorMessage;
    /**
     * The URI for the S3 bucket where CloudTrail delivered query results, if applicable.
     */
    DeliveryS3Uri?: DeliveryS3Uri;
    /**
     * The delivery status.
     */
    DeliveryStatus?: DeliveryStatus;
  }
  export interface DescribeTrailsRequest {
    /**
     * Specifies a list of trail names, trail ARNs, or both, of the trails to describe. The format of a trail ARN is:  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail  If an empty list is specified, information for the trail in the current Region is returned.   If an empty list is specified and IncludeShadowTrails is false, then information for all trails in the current Region is returned.   If an empty list is specified and IncludeShadowTrails is null or true, then information for all trails in the current Region and any associated shadow trails in other Regions is returned.    If one or more trail names are specified, information is returned only if the names match the names of trails belonging only to the current Region and current account. To return information about a trail in another Region, you must specify its trail ARN. 
     */
    trailNameList?: TrailNameList;
    /**
     * Specifies whether to include shadow trails in the response. A shadow trail is the replication in a Region of a trail that was created in a different Region, or in the case of an organization trail, the replication of an organization trail in member accounts. If you do not include shadow trails, organization trails in a member account and Region replication trails will not be returned. The default is true.
     */
    includeShadowTrails?: Boolean;
  }
  export interface DescribeTrailsResponse {
    /**
     * The list of trail objects. Trail objects with string values are only returned if values for the objects exist in a trail's configuration. For example, SNSTopicName and SNSTopicARN are only returned in results if a trail is configured to send SNS notifications. Similarly, KMSKeyId only appears in results if a trail's log files are encrypted with KMS customer managed keys.
     */
    trailList?: TrailList;
  }
  export interface Destination {
    /**
     * The type of destination for events arriving from a channel. For channels used for a CloudTrail Lake integration, the value is EventDataStore. For service-linked channels, the value is AWS_SERVICE. 
     */
    Type: DestinationType;
    /**
     *  For channels used for a CloudTrail Lake integration, the location is the ARN of an event data store that receives events from a channel. For service-linked channels, the location is the name of the Amazon Web Services service.
     */
    Location: Location;
  }
  export type DestinationType = "EVENT_DATA_STORE"|"AWS_SERVICE"|string;
  export type Destinations = Destination[];
  export type ErrorMessage = string;
  export interface Event {
    /**
     * The CloudTrail ID of the event returned.
     */
    EventId?: String;
    /**
     * The name of the event returned.
     */
    EventName?: String;
    /**
     * Information about whether the event is a write event or a read event. 
     */
    ReadOnly?: String;
    /**
     * The Amazon Web Services access key ID that was used to sign the request. If the request was made with temporary security credentials, this is the access key ID of the temporary credentials.
     */
    AccessKeyId?: String;
    /**
     * The date and time of the event returned.
     */
    EventTime?: _Date;
    /**
     * The Amazon Web Services service to which the request was made.
     */
    EventSource?: String;
    /**
     * A user name or role name of the requester that called the API in the event returned.
     */
    Username?: String;
    /**
     * A list of resources referenced by the event returned.
     */
    Resources?: ResourceList;
    /**
     * A JSON string that contains a representation of the event returned.
     */
    CloudTrailEvent?: String;
  }
  export type EventCategory = "insight"|string;
  export interface EventDataStore {
    /**
     * The ARN of the event data store.
     */
    EventDataStoreArn?: EventDataStoreArn;
    /**
     * The name of the event data store.
     */
    Name?: EventDataStoreName;
    /**
     * Indicates whether the event data store is protected from termination.
     */
    TerminationProtectionEnabled?: TerminationProtectionEnabled;
    /**
     * The status of an event data store.
     */
    Status?: EventDataStoreStatus;
    /**
     * The advanced event selectors that were used to select events for the data store.
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
    /**
     * Indicates whether the event data store includes events from all Regions, or only from the Region in which it was created.
     */
    MultiRegionEnabled?: Boolean;
    /**
     * Indicates that an event data store is collecting logged events for an organization.
     */
    OrganizationEnabled?: Boolean;
    /**
     * The retention period, in days.
     */
    RetentionPeriod?: RetentionPeriod;
    /**
     * The timestamp of the event data store's creation.
     */
    CreatedTimestamp?: _Date;
    /**
     * The timestamp showing when an event data store was updated, if applicable. UpdatedTimestamp is always either the same or newer than the time shown in CreatedTimestamp.
     */
    UpdatedTimestamp?: _Date;
  }
  export type EventDataStoreArn = string;
  export type EventDataStoreKmsKeyId = string;
  export type EventDataStoreName = string;
  export type EventDataStoreStatus = "CREATED"|"ENABLED"|"PENDING_DELETION"|"STARTING_INGESTION"|"STOPPING_INGESTION"|"STOPPED_INGESTION"|string;
  export type EventDataStores = EventDataStore[];
  export interface EventSelector {
    /**
     * Specify if you want your trail to log read-only events, write-only events, or all. For example, the EC2 GetConsoleOutput is a read-only API operation and RunInstances is a write-only API operation.  By default, the value is All.
     */
    ReadWriteType?: ReadWriteType;
    /**
     * Specify if you want your event selector to include management events for your trail.  For more information, see Management Events in the CloudTrail User Guide. By default, the value is true. The first copy of management events is free. You are charged for additional copies of management events that you are logging on any subsequent trail in the same Region. For more information about CloudTrail pricing, see CloudTrail Pricing.
     */
    IncludeManagementEvents?: Boolean;
    /**
     * CloudTrail supports data event logging for Amazon S3 objects, Lambda functions, and Amazon DynamoDB tables with basic event selectors. You can specify up to 250 resources for an individual event selector, but the total number of data resources cannot exceed 250 across all event selectors in a trail. This limit does not apply if you configure resource logging for all data events. For more information, see Data Events and Limits in CloudTrail in the CloudTrail User Guide.
     */
    DataResources?: DataResources;
    /**
     * An optional list of service event sources from which you do not want management events to be logged on your trail. In this release, the list can be empty (disables the filter), or it can filter out Key Management Service or Amazon RDS Data API events by containing kms.amazonaws.com or rdsdata.amazonaws.com. By default, ExcludeManagementEventSources is empty, and KMS and Amazon RDS Data API events are logged to your trail. You can exclude management event sources only in Regions that support the event source.
     */
    ExcludeManagementEventSources?: ExcludeManagementEventSources;
  }
  export type EventSelectors = EventSelector[];
  export type EventsList = Event[];
  export type ExcludeManagementEventSources = String[];
  export interface GetChannelRequest {
    /**
     * The ARN or UUID of a channel.
     */
    Channel: ChannelArn;
  }
  export interface GetChannelResponse {
    /**
     * The ARN of an channel returned by a GetChannel request.
     */
    ChannelArn?: ChannelArn;
    /**
     *  The name of the CloudTrail channel. For service-linked channels, the name is aws-service-channel/service-name/custom-suffix where service-name represents the name of the Amazon Web Services service that created the channel and custom-suffix represents the suffix generated by the Amazon Web Services service. 
     */
    Name?: ChannelName;
    /**
     * The source for the CloudTrail channel.
     */
    Source?: Source;
    /**
     *  Provides information about the advanced event selectors configured for the channel, and whether the channel applies to all Regions or a single Region. 
     */
    SourceConfig?: SourceConfig;
    /**
     * The destinations for the channel. For channels created for integrations, the destinations are the event data stores that log events arriving through the channel. For service-linked channels, the destination is the Amazon Web Services service that created the service-linked channel to receive events.
     */
    Destinations?: Destinations;
    /**
     * A table showing information about the most recent successful and failed attempts to ingest events.
     */
    IngestionStatus?: IngestionStatus;
  }
  export interface GetEventDataStoreRequest {
    /**
     * The ARN (or ID suffix of the ARN) of the event data store about which you want information.
     */
    EventDataStore: EventDataStoreArn;
  }
  export interface GetEventDataStoreResponse {
    /**
     * The event data store Amazon Resource Number (ARN).
     */
    EventDataStoreArn?: EventDataStoreArn;
    /**
     * The name of the event data store.
     */
    Name?: EventDataStoreName;
    /**
     * The status of an event data store.
     */
    Status?: EventDataStoreStatus;
    /**
     * The advanced event selectors used to select events for the data store.
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
    /**
     * Indicates whether the event data store includes events from all Regions, or only from the Region in which it was created.
     */
    MultiRegionEnabled?: Boolean;
    /**
     * Indicates whether an event data store is collecting logged events for an organization in Organizations.
     */
    OrganizationEnabled?: Boolean;
    /**
     * The retention period of the event data store, in days.
     */
    RetentionPeriod?: RetentionPeriod;
    /**
     * Indicates that termination protection is enabled.
     */
    TerminationProtectionEnabled?: TerminationProtectionEnabled;
    /**
     * The timestamp of the event data store's creation.
     */
    CreatedTimestamp?: _Date;
    /**
     * Shows the time that an event data store was updated, if applicable. UpdatedTimestamp is always either the same or newer than the time shown in CreatedTimestamp.
     */
    UpdatedTimestamp?: _Date;
    /**
     * Specifies the KMS key ID that encrypts the events delivered by CloudTrail. The value is a fully specified ARN to a KMS key in the following format.  arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012 
     */
    KmsKeyId?: EventDataStoreKmsKeyId;
  }
  export interface GetEventSelectorsRequest {
    /**
     * Specifies the name of the trail or trail ARN. If you specify a trail name, the string must meet the following requirements:   Contain only ASCII letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), or dashes (-)   Start with a letter or number, and end with a letter or number   Be between 3 and 128 characters   Have no adjacent periods, underscores or dashes. Names like my-_namespace and my--namespace are not valid.   Not be in IP address format (for example, 192.168.5.4)   If you specify a trail ARN, it must be in the format:  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailName: String;
  }
  export interface GetEventSelectorsResponse {
    /**
     * The specified trail ARN that has the event selectors.
     */
    TrailARN?: String;
    /**
     * The event selectors that are configured for the trail.
     */
    EventSelectors?: EventSelectors;
    /**
     *  The advanced event selectors that are configured for the trail. 
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
  }
  export interface GetImportRequest {
    /**
     *  The ID for the import. 
     */
    ImportId: UUID;
  }
  export interface GetImportResponse {
    /**
     *  The ID of the import. 
     */
    ImportId?: UUID;
    /**
     *  The ARN of the destination event data store. 
     */
    Destinations?: ImportDestinations;
    /**
     *  The source S3 bucket. 
     */
    ImportSource?: ImportSource;
    /**
     *  Used with EndEventTime to bound a StartImport request, and limit imported trail events to only those events logged within a specified time period. 
     */
    StartEventTime?: _Date;
    /**
     *  Used with StartEventTime to bound a StartImport request, and limit imported trail events to only those events logged within a specified time period. 
     */
    EndEventTime?: _Date;
    /**
     *  The status of the import. 
     */
    ImportStatus?: ImportStatus;
    /**
     *  The timestamp of the import's creation. 
     */
    CreatedTimestamp?: _Date;
    /**
     *  The timestamp of when the import was updated. 
     */
    UpdatedTimestamp?: _Date;
    /**
     *  Provides statistics for the import. CloudTrail does not update import statistics in real-time. Returned values for parameters such as EventsCompleted may be lower than the actual value, because CloudTrail updates statistics incrementally over the course of the import. 
     */
    ImportStatistics?: ImportStatistics;
  }
  export interface GetInsightSelectorsRequest {
    /**
     * Specifies the name of the trail or trail ARN. If you specify a trail name, the string must meet the following requirements:   Contain only ASCII letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), or dashes (-)   Start with a letter or number, and end with a letter or number   Be between 3 and 128 characters   Have no adjacent periods, underscores or dashes. Names like my-_namespace and my--namespace are not valid.   Not be in IP address format (for example, 192.168.5.4)   If you specify a trail ARN, it must be in the format:  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailName: String;
  }
  export interface GetInsightSelectorsResponse {
    /**
     * The Amazon Resource Name (ARN) of a trail for which you want to get Insights selectors.
     */
    TrailARN?: String;
    /**
     * A JSON string that contains the insight types you want to log on a trail. In this release, ApiErrorRateInsight and ApiCallRateInsight are supported as insight types.
     */
    InsightSelectors?: InsightSelectors;
  }
  export interface GetQueryResultsRequest {
    /**
     * The ARN (or ID suffix of the ARN) of the event data store against which the query was run.
     */
    EventDataStore?: EventDataStoreArn;
    /**
     * The ID of the query for which you want to get results.
     */
    QueryId: UUID;
    /**
     * A token you can use to get the next page of query results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of query results to display on a single page.
     */
    MaxQueryResults?: MaxQueryResults;
  }
  export interface GetQueryResultsResponse {
    /**
     * The status of the query. Values include QUEUED, RUNNING, FINISHED, FAILED, TIMED_OUT, or CANCELLED.
     */
    QueryStatus?: QueryStatus;
    /**
     * Shows the count of query results.
     */
    QueryStatistics?: QueryStatistics;
    /**
     * Contains the individual event results of the query.
     */
    QueryResultRows?: QueryResultRows;
    /**
     * A token you can use to get the next page of query results.
     */
    NextToken?: PaginationToken;
    /**
     * The error message returned if a query failed.
     */
    ErrorMessage?: ErrorMessage;
  }
  export interface GetResourcePolicyRequest {
    /**
     *  The Amazon Resource Name (ARN) of the CloudTrail channel attached to the resource-based policy. The following is the format of a resource ARN: arn:aws:cloudtrail:us-east-2:123456789012:channel/MyChannel. 
     */
    ResourceArn: ResourceArn;
  }
  export interface GetResourcePolicyResponse {
    /**
     *  The Amazon Resource Name (ARN) of the CloudTrail channel attached to resource-based policy. 
     */
    ResourceArn?: ResourceArn;
    /**
     *  A JSON-formatted string that contains the resource-based policy attached to the CloudTrail channel. 
     */
    ResourcePolicy?: ResourcePolicy;
  }
  export interface GetTrailRequest {
    /**
     * The name or the Amazon Resource Name (ARN) of the trail for which you want to retrieve settings information.
     */
    Name: String;
  }
  export interface GetTrailResponse {
    Trail?: Trail;
  }
  export interface GetTrailStatusRequest {
    /**
     * Specifies the name or the CloudTrail ARN of the trail for which you are requesting status. To get the status of a shadow trail (a replication of the trail in another Region), you must specify its ARN. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    Name: String;
  }
  export interface GetTrailStatusResponse {
    /**
     * Whether the CloudTrail trail is currently logging Amazon Web Services API calls.
     */
    IsLogging?: Boolean;
    /**
     * Displays any Amazon S3 error that CloudTrail encountered when attempting to deliver log files to the designated bucket. For more information, see Error Responses in the Amazon S3 API Reference.   This error occurs only when there is a problem with the destination S3 bucket, and does not occur for requests that time out. To resolve the issue, create a new bucket, and then call UpdateTrail to specify the new bucket; or fix the existing objects so that CloudTrail can again write to the bucket. 
     */
    LatestDeliveryError?: String;
    /**
     * Displays any Amazon SNS error that CloudTrail encountered when attempting to send a notification. For more information about Amazon SNS errors, see the Amazon SNS Developer Guide. 
     */
    LatestNotificationError?: String;
    /**
     * Specifies the date and time that CloudTrail last delivered log files to an account's Amazon S3 bucket.
     */
    LatestDeliveryTime?: _Date;
    /**
     * Specifies the date and time of the most recent Amazon SNS notification that CloudTrail has written a new log file to an account's Amazon S3 bucket.
     */
    LatestNotificationTime?: _Date;
    /**
     * Specifies the most recent date and time when CloudTrail started recording API calls for an Amazon Web Services account.
     */
    StartLoggingTime?: _Date;
    /**
     * Specifies the most recent date and time when CloudTrail stopped recording API calls for an Amazon Web Services account.
     */
    StopLoggingTime?: _Date;
    /**
     * Displays any CloudWatch Logs error that CloudTrail encountered when attempting to deliver logs to CloudWatch Logs.
     */
    LatestCloudWatchLogsDeliveryError?: String;
    /**
     * Displays the most recent date and time when CloudTrail delivered logs to CloudWatch Logs.
     */
    LatestCloudWatchLogsDeliveryTime?: _Date;
    /**
     * Specifies the date and time that CloudTrail last delivered a digest file to an account's Amazon S3 bucket.
     */
    LatestDigestDeliveryTime?: _Date;
    /**
     * Displays any Amazon S3 error that CloudTrail encountered when attempting to deliver a digest file to the designated bucket. For more information, see Error Responses in the Amazon S3 API Reference.   This error occurs only when there is a problem with the destination S3 bucket, and does not occur for requests that time out. To resolve the issue, create a new bucket, and then call UpdateTrail to specify the new bucket; or fix the existing objects so that CloudTrail can again write to the bucket. 
     */
    LatestDigestDeliveryError?: String;
    /**
     * This field is no longer in use.
     */
    LatestDeliveryAttemptTime?: String;
    /**
     * This field is no longer in use.
     */
    LatestNotificationAttemptTime?: String;
    /**
     * This field is no longer in use.
     */
    LatestNotificationAttemptSucceeded?: String;
    /**
     * This field is no longer in use.
     */
    LatestDeliveryAttemptSucceeded?: String;
    /**
     * This field is no longer in use.
     */
    TimeLoggingStarted?: String;
    /**
     * This field is no longer in use.
     */
    TimeLoggingStopped?: String;
  }
  export type ImportDestinations = EventDataStoreArn[];
  export type ImportFailureList = ImportFailureListItem[];
  export interface ImportFailureListItem {
    /**
     *  The location of the failure in the S3 bucket. 
     */
    Location?: String;
    /**
     *  The status of the import. 
     */
    Status?: ImportFailureStatus;
    /**
     *  The type of import error. 
     */
    ErrorType?: String;
    /**
     *  Provides the reason the import failed. 
     */
    ErrorMessage?: String;
    /**
     *  When the import was last updated. 
     */
    LastUpdatedTime?: _Date;
  }
  export type ImportFailureStatus = "FAILED"|"RETRY"|"SUCCEEDED"|string;
  export interface ImportSource {
    /**
     *  The source S3 bucket. 
     */
    S3: S3ImportSource;
  }
  export interface ImportStatistics {
    /**
     *  The number of S3 prefixes found for the import. 
     */
    PrefixesFound?: Long;
    /**
     *  The number of S3 prefixes that completed import. 
     */
    PrefixesCompleted?: Long;
    /**
     * The number of log files that completed import.
     */
    FilesCompleted?: Long;
    /**
     *  The number of trail events imported into the event data store. 
     */
    EventsCompleted?: Long;
    /**
     *  The number of failed entries. 
     */
    FailedEntries?: Long;
  }
  export type ImportStatus = "INITIALIZING"|"IN_PROGRESS"|"FAILED"|"STOPPED"|"COMPLETED"|string;
  export type ImportsList = ImportsListItem[];
  export interface ImportsListItem {
    /**
     *  The ID of the import. 
     */
    ImportId?: UUID;
    /**
     *  The status of the import. 
     */
    ImportStatus?: ImportStatus;
    /**
     *  The ARN of the destination event data store. 
     */
    Destinations?: ImportDestinations;
    /**
     *  The timestamp of the import's creation. 
     */
    CreatedTimestamp?: _Date;
    /**
     *  The timestamp of the import's last update. 
     */
    UpdatedTimestamp?: _Date;
  }
  export interface IngestionStatus {
    /**
     * The time stamp of the most recent successful ingestion of events for the channel.
     */
    LatestIngestionSuccessTime?: _Date;
    /**
     * The event ID of the most recent successful ingestion of events.
     */
    LatestIngestionSuccessEventID?: UUID;
    /**
     * The error code for the most recent failure to ingest events.
     */
    LatestIngestionErrorCode?: ErrorMessage;
    /**
     * The time stamp of the most recent attempt to ingest events on the channel.
     */
    LatestIngestionAttemptTime?: _Date;
    /**
     * The event ID of the most recent attempt to ingest events.
     */
    LatestIngestionAttemptEventID?: UUID;
  }
  export interface InsightSelector {
    /**
     * The type of Insights events to log on a trail. ApiCallRateInsight and ApiErrorRateInsight are valid Insight types. The ApiCallRateInsight Insights type analyzes write-only management API calls that are aggregated per minute against a baseline API call volume. The ApiErrorRateInsight Insights type analyzes management API calls that result in error codes. The error is shown if the API call is unsuccessful.
     */
    InsightType?: InsightType;
  }
  export type InsightSelectors = InsightSelector[];
  export type InsightType = "ApiCallRateInsight"|"ApiErrorRateInsight"|string;
  export type Integer = number;
  export type ListChannelsMaxResultsCount = number;
  export interface ListChannelsRequest {
    /**
     *  The maximum number of CloudTrail channels to display on a single page. 
     */
    MaxResults?: ListChannelsMaxResultsCount;
    /**
     * The token to use to get the next page of results after a previous API call. This token must be passed in with the same parameters that were specified in the original call. For example, if the original call specified an AttributeKey of 'Username' with a value of 'root', the call with NextToken should include those same parameters.
     */
    NextToken?: PaginationToken;
  }
  export interface ListChannelsResponse {
    /**
     *  The list of channels in the account. 
     */
    Channels?: Channels;
    /**
     * The token to use to get the next page of results after a previous API call.
     */
    NextToken?: PaginationToken;
  }
  export type ListEventDataStoresMaxResultsCount = number;
  export interface ListEventDataStoresRequest {
    /**
     * A token you can use to get the next page of event data store results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of event data stores to display on a single page.
     */
    MaxResults?: ListEventDataStoresMaxResultsCount;
  }
  export interface ListEventDataStoresResponse {
    /**
     * Contains information about event data stores in the account, in the current Region.
     */
    EventDataStores?: EventDataStores;
    /**
     * A token you can use to get the next page of results.
     */
    NextToken?: PaginationToken;
  }
  export type ListImportFailuresMaxResultsCount = number;
  export interface ListImportFailuresRequest {
    /**
     *  The ID of the import. 
     */
    ImportId: UUID;
    /**
     *  The maximum number of failures to display on a single page. 
     */
    MaxResults?: ListImportFailuresMaxResultsCount;
    /**
     *  A token you can use to get the next page of import failures. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListImportFailuresResponse {
    /**
     *  Contains information about the import failures. 
     */
    Failures?: ImportFailureList;
    /**
     *  A token you can use to get the next page of results. 
     */
    NextToken?: PaginationToken;
  }
  export type ListImportsMaxResultsCount = number;
  export interface ListImportsRequest {
    /**
     *  The maximum number of imports to display on a single page. 
     */
    MaxResults?: ListImportsMaxResultsCount;
    /**
     *  The ARN of the destination event data store. 
     */
    Destination?: EventDataStoreArn;
    /**
     *  The status of the import. 
     */
    ImportStatus?: ImportStatus;
    /**
     *  A token you can use to get the next page of import results. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListImportsResponse {
    /**
     *  The list of returned imports. 
     */
    Imports?: ImportsList;
    /**
     *  A token you can use to get the next page of import results. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListPublicKeysRequest {
    /**
     * Optionally specifies, in UTC, the start of the time range to look up public keys for CloudTrail digest files. If not specified, the current time is used, and the current public key is returned.
     */
    StartTime?: _Date;
    /**
     * Optionally specifies, in UTC, the end of the time range to look up public keys for CloudTrail digest files. If not specified, the current time is used.
     */
    EndTime?: _Date;
    /**
     * Reserved for future use.
     */
    NextToken?: String;
  }
  export interface ListPublicKeysResponse {
    /**
     * Contains an array of PublicKey objects.  The returned public keys may have validity time ranges that overlap. 
     */
    PublicKeyList?: PublicKeyList;
    /**
     * Reserved for future use.
     */
    NextToken?: String;
  }
  export type ListQueriesMaxResultsCount = number;
  export interface ListQueriesRequest {
    /**
     * The ARN (or the ID suffix of the ARN) of an event data store on which queries were run.
     */
    EventDataStore: EventDataStoreArn;
    /**
     * A token you can use to get the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of queries to show on a page.
     */
    MaxResults?: ListQueriesMaxResultsCount;
    /**
     * Use with EndTime to bound a ListQueries request, and limit its results to only those queries run within a specified time period.
     */
    StartTime?: _Date;
    /**
     * Use with StartTime to bound a ListQueries request, and limit its results to only those queries run within a specified time period.
     */
    EndTime?: _Date;
    /**
     * The status of queries that you want to return in results. Valid values for QueryStatus include QUEUED, RUNNING, FINISHED, FAILED, TIMED_OUT, or CANCELLED.
     */
    QueryStatus?: QueryStatus;
  }
  export interface ListQueriesResponse {
    /**
     * Lists matching query results, and shows query ID, status, and creation time of each query.
     */
    Queries?: Queries;
    /**
     * A token you can use to get the next page of results.
     */
    NextToken?: PaginationToken;
  }
  export interface ListTagsRequest {
    /**
     * Specifies a list of trail, event data store, or channel ARNs whose tags will be listed. The list has a limit of 20 ARNs.  Example trail ARN format: arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail  Example event data store ARN format: arn:aws:cloudtrail:us-east-2:123456789012:eventdatastore/EXAMPLE-f852-4e8f-8bd1-bcf6cEXAMPLE  Example channel ARN format: arn:aws:cloudtrail:us-east-2:123456789012:channel/01234567890 
     */
    ResourceIdList: ResourceIdList;
    /**
     * Reserved for future use.
     */
    NextToken?: String;
  }
  export interface ListTagsResponse {
    /**
     * A list of resource tags.
     */
    ResourceTagList?: ResourceTagList;
    /**
     * Reserved for future use.
     */
    NextToken?: String;
  }
  export interface ListTrailsRequest {
    /**
     * The token to use to get the next page of results after a previous API call. This token must be passed in with the same parameters that were specified in the original call. For example, if the original call specified an AttributeKey of 'Username' with a value of 'root', the call with NextToken should include those same parameters.
     */
    NextToken?: String;
  }
  export interface ListTrailsResponse {
    /**
     * Returns the name, ARN, and home Region of trails in the current account.
     */
    Trails?: Trails;
    /**
     * The token to use to get the next page of results after a previous API call. If the token does not appear, there are no more results to return. The token must be passed in with the same parameters as the previous call. For example, if the original call specified an AttributeKey of 'Username' with a value of 'root', the call with NextToken should include those same parameters.
     */
    NextToken?: String;
  }
  export type Location = string;
  export type Long = number;
  export interface LookupAttribute {
    /**
     * Specifies an attribute on which to filter the events returned.
     */
    AttributeKey: LookupAttributeKey;
    /**
     * Specifies a value for the specified AttributeKey.
     */
    AttributeValue: LookupAttributeValue;
  }
  export type LookupAttributeKey = "EventId"|"EventName"|"ReadOnly"|"Username"|"ResourceType"|"ResourceName"|"EventSource"|"AccessKeyId"|string;
  export type LookupAttributeValue = string;
  export type LookupAttributesList = LookupAttribute[];
  export interface LookupEventsRequest {
    /**
     * Contains a list of lookup attributes. Currently the list can contain only one item.
     */
    LookupAttributes?: LookupAttributesList;
    /**
     * Specifies that only events that occur after or at the specified time are returned. If the specified start time is after the specified end time, an error is returned.
     */
    StartTime?: _Date;
    /**
     * Specifies that only events that occur before or at the specified time are returned. If the specified end time is before the specified start time, an error is returned.
     */
    EndTime?: _Date;
    /**
     * Specifies the event category. If you do not specify an event category, events of the category are not returned in the response. For example, if you do not specify insight as the value of EventCategory, no Insights events are returned.
     */
    EventCategory?: EventCategory;
    /**
     * The number of events to return. Possible values are 1 through 50. The default is 50.
     */
    MaxResults?: MaxResults;
    /**
     * The token to use to get the next page of results after a previous API call. This token must be passed in with the same parameters that were specified in the original call. For example, if the original call specified an AttributeKey of 'Username' with a value of 'root', the call with NextToken should include those same parameters.
     */
    NextToken?: NextToken;
  }
  export interface LookupEventsResponse {
    /**
     * A list of events returned based on the lookup attributes specified and the CloudTrail event. The events list is sorted by time. The most recent event is listed first.
     */
    Events?: EventsList;
    /**
     * The token to use to get the next page of results after a previous API call. If the token does not appear, there are no more results to return. The token must be passed in with the same parameters as the previous call. For example, if the original call specified an AttributeKey of 'Username' with a value of 'root', the call with NextToken should include those same parameters.
     */
    NextToken?: NextToken;
  }
  export type MaxQueryResults = number;
  export type MaxResults = number;
  export type NextToken = string;
  export type Operator = OperatorValue[];
  export type OperatorValue = string;
  export type PaginationToken = string;
  export interface PublicKey {
    /**
     * The DER encoded public key value in PKCS#1 format.
     */
    Value?: ByteBuffer;
    /**
     * The starting time of validity of the public key.
     */
    ValidityStartTime?: _Date;
    /**
     * The ending time of validity of the public key.
     */
    ValidityEndTime?: _Date;
    /**
     * The fingerprint of the public key.
     */
    Fingerprint?: String;
  }
  export type PublicKeyList = PublicKey[];
  export interface PutEventSelectorsRequest {
    /**
     * Specifies the name of the trail or trail ARN. If you specify a trail name, the string must meet the following requirements:   Contain only ASCII letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), or dashes (-)   Start with a letter or number, and end with a letter or number   Be between 3 and 128 characters   Have no adjacent periods, underscores or dashes. Names like my-_namespace and my--namespace are not valid.   Not be in IP address format (for example, 192.168.5.4)   If you specify a trail ARN, it must be in the following format.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailName: String;
    /**
     * Specifies the settings for your event selectors. You can configure up to five event selectors for a trail. You can use either EventSelectors or AdvancedEventSelectors in a PutEventSelectors request, but not both. If you apply EventSelectors to a trail, any existing AdvancedEventSelectors are overwritten.
     */
    EventSelectors?: EventSelectors;
    /**
     *  Specifies the settings for advanced event selectors. You can add advanced event selectors, and conditions for your advanced event selectors, up to a maximum of 500 values for all conditions and selectors on a trail. You can use either AdvancedEventSelectors or EventSelectors, but not both. If you apply AdvancedEventSelectors to a trail, any existing EventSelectors are overwritten. For more information about advanced event selectors, see Logging data events in the CloudTrail User Guide. 
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
  }
  export interface PutEventSelectorsResponse {
    /**
     * Specifies the ARN of the trail that was updated with event selectors. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailARN?: String;
    /**
     * Specifies the event selectors configured for your trail.
     */
    EventSelectors?: EventSelectors;
    /**
     * Specifies the advanced event selectors configured for your trail.
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
  }
  export interface PutInsightSelectorsRequest {
    /**
     * The name of the CloudTrail trail for which you want to change or add Insights selectors.
     */
    TrailName: String;
    /**
     * A JSON string that contains the insight types you want to log on a trail. ApiCallRateInsight and ApiErrorRateInsight are valid Insight types. The ApiCallRateInsight Insights type analyzes write-only management API calls that are aggregated per minute against a baseline API call volume. The ApiErrorRateInsight Insights type analyzes management API calls that result in error codes. The error is shown if the API call is unsuccessful.
     */
    InsightSelectors: InsightSelectors;
  }
  export interface PutInsightSelectorsResponse {
    /**
     * The Amazon Resource Name (ARN) of a trail for which you want to change or add Insights selectors.
     */
    TrailARN?: String;
    /**
     * A JSON string that contains the Insights event types that you want to log on a trail. The valid Insights types in this release are ApiErrorRateInsight and ApiCallRateInsight.
     */
    InsightSelectors?: InsightSelectors;
  }
  export interface PutResourcePolicyRequest {
    /**
     *  The Amazon Resource Name (ARN) of the CloudTrail channel attached to the resource-based policy. The following is the format of a resource ARN: arn:aws:cloudtrail:us-east-2:123456789012:channel/MyChannel. 
     */
    ResourceArn: ResourceArn;
    /**
     *  A JSON-formatted string for an Amazon Web Services resource-based policy.  The following are requirements for the resource policy:    Contains only one action: cloudtrail-data:PutAuditEvents     Contains at least one statement. The policy can have a maximum of 20 statements.     Each statement contains at least one principal. A statement can have a maximum of 50 principals.   
     */
    ResourcePolicy: ResourcePolicy;
  }
  export interface PutResourcePolicyResponse {
    /**
     *  The Amazon Resource Name (ARN) of the CloudTrail channel attached to the resource-based policy. 
     */
    ResourceArn?: ResourceArn;
    /**
     *  The JSON-formatted string of the Amazon Web Services resource-based policy attached to the CloudTrail channel. 
     */
    ResourcePolicy?: ResourcePolicy;
  }
  export type Queries = Query[];
  export interface Query {
    /**
     * The ID of a query.
     */
    QueryId?: UUID;
    /**
     * The status of the query. This can be QUEUED, RUNNING, FINISHED, FAILED, TIMED_OUT, or CANCELLED.
     */
    QueryStatus?: QueryStatus;
    /**
     * The creation time of a query.
     */
    CreationTime?: _Date;
  }
  export type QueryAlias = string;
  export type QueryParameter = string;
  export type QueryParameters = QueryParameter[];
  export type QueryResultColumn = {[key: string]: QueryResultValue};
  export type QueryResultKey = string;
  export type QueryResultRow = QueryResultColumn[];
  export type QueryResultRows = QueryResultRow[];
  export type QueryResultValue = string;
  export type QueryStatement = string;
  export interface QueryStatistics {
    /**
     * The number of results returned.
     */
    ResultsCount?: Integer;
    /**
     * The total number of results returned by a query.
     */
    TotalResultsCount?: Integer;
    /**
     * The total bytes that the query scanned in the event data store. This value matches the number of bytes for which your account is billed for the query, unless the query is still running.
     */
    BytesScanned?: Long;
  }
  export interface QueryStatisticsForDescribeQuery {
    /**
     * The number of events that matched a query.
     */
    EventsMatched?: Long;
    /**
     * The number of events that the query scanned in the event data store.
     */
    EventsScanned?: Long;
    /**
     * The total bytes that the query scanned in the event data store. This value matches the number of bytes for which your account is billed for the query, unless the query is still running.
     */
    BytesScanned?: Long;
    /**
     * The query's run time, in milliseconds.
     */
    ExecutionTimeInMillis?: Integer;
    /**
     * The creation time of the query.
     */
    CreationTime?: _Date;
  }
  export type QueryStatus = "QUEUED"|"RUNNING"|"FINISHED"|"FAILED"|"CANCELLED"|"TIMED_OUT"|string;
  export type ReadWriteType = "ReadOnly"|"WriteOnly"|"All"|string;
  export interface RegisterOrganizationDelegatedAdminRequest {
    /**
     * An organization member account ID that you want to designate as a delegated administrator.
     */
    MemberAccountId: AccountId;
  }
  export interface RegisterOrganizationDelegatedAdminResponse {
  }
  export interface RemoveTagsRequest {
    /**
     * Specifies the ARN of the trail, event data store, or channel from which tags should be removed.  Example trail ARN format: arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail  Example event data store ARN format: arn:aws:cloudtrail:us-east-2:123456789012:eventdatastore/EXAMPLE-f852-4e8f-8bd1-bcf6cEXAMPLE  Example channel ARN format: arn:aws:cloudtrail:us-east-2:123456789012:channel/01234567890 
     */
    ResourceId: String;
    /**
     * Specifies a list of tags to be removed.
     */
    TagsList: TagsList;
  }
  export interface RemoveTagsResponse {
  }
  export interface Resource {
    /**
     * The type of a resource referenced by the event returned. When the resource type cannot be determined, null is returned. Some examples of resource types are: Instance for EC2, Trail for CloudTrail, DBInstance for Amazon RDS, and AccessKey for IAM. To learn more about how to look up and filter events by the resource types supported for a service, see Filtering CloudTrail Events.
     */
    ResourceType?: String;
    /**
     * The name of the resource referenced by the event returned. These are user-created names whose values will depend on the environment. For example, the resource name might be "auto-scaling-test-group" for an Auto Scaling Group or "i-1234567" for an EC2 Instance.
     */
    ResourceName?: String;
  }
  export type ResourceArn = string;
  export type ResourceIdList = String[];
  export type ResourceList = Resource[];
  export type ResourcePolicy = string;
  export interface ResourceTag {
    /**
     * Specifies the ARN of the resource.
     */
    ResourceId?: String;
    /**
     * A list of tags.
     */
    TagsList?: TagsList;
  }
  export type ResourceTagList = ResourceTag[];
  export interface RestoreEventDataStoreRequest {
    /**
     * The ARN (or the ID suffix of the ARN) of the event data store that you want to restore.
     */
    EventDataStore: EventDataStoreArn;
  }
  export interface RestoreEventDataStoreResponse {
    /**
     * The event data store ARN.
     */
    EventDataStoreArn?: EventDataStoreArn;
    /**
     * The name of the event data store.
     */
    Name?: EventDataStoreName;
    /**
     * The status of the event data store.
     */
    Status?: EventDataStoreStatus;
    /**
     * The advanced event selectors that were used to select events.
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
    /**
     * Indicates whether the event data store is collecting events from all Regions, or only from the Region in which the event data store was created.
     */
    MultiRegionEnabled?: Boolean;
    /**
     * Indicates whether an event data store is collecting logged events for an organization in Organizations.
     */
    OrganizationEnabled?: Boolean;
    /**
     * The retention period, in days.
     */
    RetentionPeriod?: RetentionPeriod;
    /**
     * Indicates that termination protection is enabled and the event data store cannot be automatically deleted.
     */
    TerminationProtectionEnabled?: TerminationProtectionEnabled;
    /**
     * The timestamp of an event data store's creation.
     */
    CreatedTimestamp?: _Date;
    /**
     * The timestamp that shows when an event data store was updated, if applicable. UpdatedTimestamp is always either the same or newer than the time shown in CreatedTimestamp.
     */
    UpdatedTimestamp?: _Date;
    /**
     * Specifies the KMS key ID that encrypts the events delivered by CloudTrail. The value is a fully specified ARN to a KMS key in the following format.  arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012 
     */
    KmsKeyId?: EventDataStoreKmsKeyId;
  }
  export type RetentionPeriod = number;
  export interface S3ImportSource {
    /**
     *  The URI for the source S3 bucket. 
     */
    S3LocationUri: String;
    /**
     *  The Region associated with the source S3 bucket. 
     */
    S3BucketRegion: String;
    /**
     *  The IAM ARN role used to access the source S3 bucket. 
     */
    S3BucketAccessRoleArn: String;
  }
  export type SelectorField = string;
  export type SelectorName = string;
  export type Source = string;
  export interface SourceConfig {
    /**
     *  Specifies whether the channel applies to a single Region or to all Regions.
     */
    ApplyToAllRegions?: Boolean;
    /**
     *  The advanced event selectors that are configured for the channel.
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
  }
  export interface StartEventDataStoreIngestionRequest {
    /**
     * The ARN (or ID suffix of the ARN) of the event data store for which you want to start ingestion.
     */
    EventDataStore: EventDataStoreArn;
  }
  export interface StartEventDataStoreIngestionResponse {
  }
  export interface StartImportRequest {
    /**
     *  The ARN of the destination event data store. Use this parameter for a new import. 
     */
    Destinations?: ImportDestinations;
    /**
     *  The source S3 bucket for the import. Use this parameter for a new import. 
     */
    ImportSource?: ImportSource;
    /**
     *  Use with EndEventTime to bound a StartImport request, and limit imported trail events to only those events logged within a specified time period. When you specify a time range, CloudTrail checks the prefix and log file names to verify the names contain a date between the specified StartEventTime and EndEventTime before attempting to import events. 
     */
    StartEventTime?: _Date;
    /**
     *  Use with StartEventTime to bound a StartImport request, and limit imported trail events to only those events logged within a specified time period. When you specify a time range, CloudTrail checks the prefix and log file names to verify the names contain a date between the specified StartEventTime and EndEventTime before attempting to import events. 
     */
    EndEventTime?: _Date;
    /**
     *  The ID of the import. Use this parameter when you are retrying an import. 
     */
    ImportId?: UUID;
  }
  export interface StartImportResponse {
    /**
     *  The ID of the import. 
     */
    ImportId?: UUID;
    /**
     *  The ARN of the destination event data store. 
     */
    Destinations?: ImportDestinations;
    /**
     *  The source S3 bucket for the import. 
     */
    ImportSource?: ImportSource;
    /**
     *  Used with EndEventTime to bound a StartImport request, and limit imported trail events to only those events logged within a specified time period. 
     */
    StartEventTime?: _Date;
    /**
     *  Used with StartEventTime to bound a StartImport request, and limit imported trail events to only those events logged within a specified time period. 
     */
    EndEventTime?: _Date;
    /**
     *  Shows the status of the import after a StartImport request. An import finishes with a status of COMPLETED if there were no failures, or FAILED if there were failures. 
     */
    ImportStatus?: ImportStatus;
    /**
     *  The timestamp for the import's creation. 
     */
    CreatedTimestamp?: _Date;
    /**
     *  The timestamp of the import's last update, if applicable. 
     */
    UpdatedTimestamp?: _Date;
  }
  export interface StartLoggingRequest {
    /**
     * Specifies the name or the CloudTrail ARN of the trail for which CloudTrail logs Amazon Web Services API calls. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    Name: String;
  }
  export interface StartLoggingResponse {
  }
  export interface StartQueryRequest {
    /**
     * The SQL code of your query.
     */
    QueryStatement?: QueryStatement;
    /**
     *  The URI for the S3 bucket where CloudTrail delivers the query results. 
     */
    DeliveryS3Uri?: DeliveryS3Uri;
    /**
     *  The alias that identifies a query template. 
     */
    QueryAlias?: QueryAlias;
    /**
     *  The query parameters for the specified QueryAlias. 
     */
    QueryParameters?: QueryParameters;
  }
  export interface StartQueryResponse {
    /**
     * The ID of the started query.
     */
    QueryId?: UUID;
  }
  export interface StopEventDataStoreIngestionRequest {
    /**
     * The ARN (or ID suffix of the ARN) of the event data store for which you want to stop ingestion.
     */
    EventDataStore: EventDataStoreArn;
  }
  export interface StopEventDataStoreIngestionResponse {
  }
  export interface StopImportRequest {
    /**
     *  The ID of the import. 
     */
    ImportId: UUID;
  }
  export interface StopImportResponse {
    /**
     *  The ID for the import. 
     */
    ImportId?: UUID;
    /**
     *  The source S3 bucket for the import. 
     */
    ImportSource?: ImportSource;
    /**
     *  The ARN of the destination event data store. 
     */
    Destinations?: ImportDestinations;
    /**
     *  The status of the import. 
     */
    ImportStatus?: ImportStatus;
    /**
     *  The timestamp of the import's creation. 
     */
    CreatedTimestamp?: _Date;
    /**
     *  The timestamp of the import's last update. 
     */
    UpdatedTimestamp?: _Date;
    /**
     *  Used with EndEventTime to bound a StartImport request, and limit imported trail events to only those events logged within a specified time period. 
     */
    StartEventTime?: _Date;
    /**
     *  Used with StartEventTime to bound a StartImport request, and limit imported trail events to only those events logged within a specified time period. 
     */
    EndEventTime?: _Date;
    /**
     *  Returns information on the stopped import. 
     */
    ImportStatistics?: ImportStatistics;
  }
  export interface StopLoggingRequest {
    /**
     * Specifies the name or the CloudTrail ARN of the trail for which CloudTrail will stop logging Amazon Web Services API calls. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    Name: String;
  }
  export interface StopLoggingResponse {
  }
  export type String = string;
  export interface Tag {
    /**
     * The key in a key-value pair. The key must be must be no longer than 128 Unicode characters. The key must be unique for the resource to which it applies.
     */
    Key: TagKey;
    /**
     * The value in a key-value pair of a tag. The value must be no longer than 256 Unicode characters.
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagValue = string;
  export type TagsList = Tag[];
  export type TerminationProtectionEnabled = boolean;
  export interface Trail {
    /**
     * Name of the trail set by calling CreateTrail. The maximum length is 128 characters.
     */
    Name?: String;
    /**
     * Name of the Amazon S3 bucket into which CloudTrail delivers your trail files. See Amazon S3 Bucket Naming Requirements.
     */
    S3BucketName?: String;
    /**
     * Specifies the Amazon S3 key prefix that comes after the name of the bucket you have designated for log file delivery. For more information, see Finding Your CloudTrail Log Files. The maximum length is 200 characters.
     */
    S3KeyPrefix?: String;
    /**
     * This field is no longer in use. Use SnsTopicARN.
     */
    SnsTopicName?: String;
    /**
     * Specifies the ARN of the Amazon SNS topic that CloudTrail uses to send notifications when log files are delivered. The following is the format of a topic ARN.  arn:aws:sns:us-east-2:123456789012:MyTopic 
     */
    SnsTopicARN?: String;
    /**
     * Set to True to include Amazon Web Services API calls from Amazon Web Services global services such as IAM. Otherwise, False.
     */
    IncludeGlobalServiceEvents?: Boolean;
    /**
     * Specifies whether the trail exists only in one Region or exists in all Regions.
     */
    IsMultiRegionTrail?: Boolean;
    /**
     * The Region in which the trail was created.
     */
    HomeRegion?: String;
    /**
     * Specifies the ARN of the trail. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailARN?: String;
    /**
     * Specifies whether log file validation is enabled.
     */
    LogFileValidationEnabled?: Boolean;
    /**
     * Specifies an Amazon Resource Name (ARN), a unique identifier that represents the log group to which CloudTrail logs will be delivered.
     */
    CloudWatchLogsLogGroupArn?: String;
    /**
     * Specifies the role for the CloudWatch Logs endpoint to assume to write to a user's log group.
     */
    CloudWatchLogsRoleArn?: String;
    /**
     * Specifies the KMS key ID that encrypts the logs delivered by CloudTrail. The value is a fully specified ARN to a KMS key in the following format.  arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012 
     */
    KmsKeyId?: String;
    /**
     * Specifies if the trail has custom event selectors.
     */
    HasCustomEventSelectors?: Boolean;
    /**
     * Specifies whether a trail has insight types specified in an InsightSelector list.
     */
    HasInsightSelectors?: Boolean;
    /**
     * Specifies whether the trail is an organization trail.
     */
    IsOrganizationTrail?: Boolean;
  }
  export interface TrailInfo {
    /**
     * The ARN of a trail.
     */
    TrailARN?: String;
    /**
     * The name of a trail.
     */
    Name?: String;
    /**
     * The Amazon Web Services Region in which a trail was created.
     */
    HomeRegion?: String;
  }
  export type TrailList = Trail[];
  export type TrailNameList = String[];
  export type Trails = TrailInfo[];
  export type UUID = string;
  export interface UpdateChannelRequest {
    /**
     * The ARN or ID (the ARN suffix) of the channel that you want to update.
     */
    Channel: ChannelArn;
    /**
     * The ARNs of event data stores that you want to log events arriving through the channel.
     */
    Destinations?: Destinations;
    /**
     *  Changes the name of the channel. 
     */
    Name?: ChannelName;
  }
  export interface UpdateChannelResponse {
    /**
     * The ARN of the channel that was updated.
     */
    ChannelArn?: ChannelArn;
    /**
     * The name of the channel that was updated.
     */
    Name?: ChannelName;
    /**
     * The event source of the channel that was updated.
     */
    Source?: Source;
    /**
     * The event data stores that log events arriving through the channel.
     */
    Destinations?: Destinations;
  }
  export interface UpdateEventDataStoreRequest {
    /**
     * The ARN (or the ID suffix of the ARN) of the event data store that you want to update.
     */
    EventDataStore: EventDataStoreArn;
    /**
     * The event data store name.
     */
    Name?: EventDataStoreName;
    /**
     * The advanced event selectors used to select events for the event data store. You can configure up to five advanced event selectors for each event data store.
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
    /**
     * Specifies whether an event data store collects events from all Regions, or only from the Region in which it was created.
     */
    MultiRegionEnabled?: Boolean;
    /**
     * Specifies whether an event data store collects events logged for an organization in Organizations.
     */
    OrganizationEnabled?: Boolean;
    /**
     * The retention period of the event data store, in days. You can set a retention period of up to 2557 days, the equivalent of seven years. CloudTrail Lake determines whether to retain an event by checking if the eventTime of the event is within the specified retention period. For example, if you set a retention period of 90 days, CloudTrail will remove events when the eventTime is older than 90 days.  If you decrease the retention period of an event data store, CloudTrail will remove any events with an eventTime older than the new retention period. For example, if the previous retention period was 365 days and you decrease it to 100 days, CloudTrail will remove events with an eventTime older than 100 days. 
     */
    RetentionPeriod?: RetentionPeriod;
    /**
     * Indicates that termination protection is enabled and the event data store cannot be automatically deleted.
     */
    TerminationProtectionEnabled?: TerminationProtectionEnabled;
    /**
     * Specifies the KMS key ID to use to encrypt the events delivered by CloudTrail. The value can be an alias name prefixed by alias/, a fully specified ARN to an alias, a fully specified ARN to a key, or a globally unique identifier.  Disabling or deleting the KMS key, or removing CloudTrail permissions on the key, prevents CloudTrail from logging events to the event data store, and prevents users from querying the data in the event data store that was encrypted with the key. After you associate an event data store with a KMS key, the KMS key cannot be removed or changed. Before you disable or delete a KMS key that you are using with an event data store, delete or back up your event data store.  CloudTrail also supports KMS multi-Region keys. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. Examples:    alias/MyAliasName     arn:aws:kms:us-east-2:123456789012:alias/MyAliasName     arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012     12345678-1234-1234-1234-123456789012   
     */
    KmsKeyId?: EventDataStoreKmsKeyId;
  }
  export interface UpdateEventDataStoreResponse {
    /**
     * The ARN of the event data store.
     */
    EventDataStoreArn?: EventDataStoreArn;
    /**
     * The name of the event data store.
     */
    Name?: EventDataStoreName;
    /**
     * The status of an event data store.
     */
    Status?: EventDataStoreStatus;
    /**
     * The advanced event selectors that are applied to the event data store.
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
    /**
     * Indicates whether the event data store includes events from all Regions, or only from the Region in which it was created.
     */
    MultiRegionEnabled?: Boolean;
    /**
     * Indicates whether an event data store is collecting logged events for an organization in Organizations.
     */
    OrganizationEnabled?: Boolean;
    /**
     * The retention period, in days.
     */
    RetentionPeriod?: RetentionPeriod;
    /**
     * Indicates whether termination protection is enabled for the event data store.
     */
    TerminationProtectionEnabled?: TerminationProtectionEnabled;
    /**
     * The timestamp that shows when an event data store was first created.
     */
    CreatedTimestamp?: _Date;
    /**
     * The timestamp that shows when the event data store was last updated. UpdatedTimestamp is always either the same or newer than the time shown in CreatedTimestamp.
     */
    UpdatedTimestamp?: _Date;
    /**
     * Specifies the KMS key ID that encrypts the events delivered by CloudTrail. The value is a fully specified ARN to a KMS key in the following format.  arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012 
     */
    KmsKeyId?: EventDataStoreKmsKeyId;
  }
  export interface UpdateTrailRequest {
    /**
     * Specifies the name of the trail or trail ARN. If Name is a trail name, the string must meet the following requirements:   Contain only ASCII letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), or dashes (-)   Start with a letter or number, and end with a letter or number   Be between 3 and 128 characters   Have no adjacent periods, underscores or dashes. Names like my-_namespace and my--namespace are not valid.   Not be in IP address format (for example, 192.168.5.4)   If Name is a trail ARN, it must be in the following format.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    Name: String;
    /**
     * Specifies the name of the Amazon S3 bucket designated for publishing log files. See Amazon S3 Bucket Naming Requirements.
     */
    S3BucketName?: String;
    /**
     * Specifies the Amazon S3 key prefix that comes after the name of the bucket you have designated for log file delivery. For more information, see Finding Your CloudTrail Log Files. The maximum length is 200 characters.
     */
    S3KeyPrefix?: String;
    /**
     * Specifies the name of the Amazon SNS topic defined for notification of log file delivery. The maximum length is 256 characters.
     */
    SnsTopicName?: String;
    /**
     * Specifies whether the trail is publishing events from global services such as IAM to the log files.
     */
    IncludeGlobalServiceEvents?: Boolean;
    /**
     * Specifies whether the trail applies only to the current Region or to all Regions. The default is false. If the trail exists only in the current Region and this value is set to true, shadow trails (replications of the trail) will be created in the other Regions. If the trail exists in all Regions and this value is set to false, the trail will remain in the Region where it was created, and its shadow trails in other Regions will be deleted. As a best practice, consider using trails that log events in all Regions.
     */
    IsMultiRegionTrail?: Boolean;
    /**
     * Specifies whether log file validation is enabled. The default is false.  When you disable log file integrity validation, the chain of digest files is broken after one hour. CloudTrail does not create digest files for log files that were delivered during a period in which log file integrity validation was disabled. For example, if you enable log file integrity validation at noon on January 1, disable it at noon on January 2, and re-enable it at noon on January 10, digest files will not be created for the log files delivered from noon on January 2 to noon on January 10. The same applies whenever you stop CloudTrail logging or delete a trail. 
     */
    EnableLogFileValidation?: Boolean;
    /**
     * Specifies a log group name using an Amazon Resource Name (ARN), a unique identifier that represents the log group to which CloudTrail logs are delivered. You must use a log group that exists in your account. Not required unless you specify CloudWatchLogsRoleArn.
     */
    CloudWatchLogsLogGroupArn?: String;
    /**
     * Specifies the role for the CloudWatch Logs endpoint to assume to write to a user's log group. You must use a role that exists in your account.
     */
    CloudWatchLogsRoleArn?: String;
    /**
     * Specifies the KMS key ID to use to encrypt the logs delivered by CloudTrail. The value can be an alias name prefixed by "alias/", a fully specified ARN to an alias, a fully specified ARN to a key, or a globally unique identifier. CloudTrail also supports KMS multi-Region keys. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. Examples:   alias/MyAliasName   arn:aws:kms:us-east-2:123456789012:alias/MyAliasName   arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012   12345678-1234-1234-1234-123456789012  
     */
    KmsKeyId?: String;
    /**
     * Specifies whether the trail is applied to all accounts in an organization in Organizations, or only for the current Amazon Web Services account. The default is false, and cannot be true unless the call is made on behalf of an Amazon Web Services account that is the management account or delegated administrator account for an organization in Organizations. If the trail is not an organization trail and this is set to true, the trail will be created in all Amazon Web Services accounts that belong to the organization. If the trail is an organization trail and this is set to false, the trail will remain in the current Amazon Web Services account but be deleted from all member accounts in the organization.
     */
    IsOrganizationTrail?: Boolean;
  }
  export interface UpdateTrailResponse {
    /**
     * Specifies the name of the trail.
     */
    Name?: String;
    /**
     * Specifies the name of the Amazon S3 bucket designated for publishing log files.
     */
    S3BucketName?: String;
    /**
     * Specifies the Amazon S3 key prefix that comes after the name of the bucket you have designated for log file delivery. For more information, see Finding Your IAM Log Files.
     */
    S3KeyPrefix?: String;
    /**
     * This field is no longer in use. Use SnsTopicARN.
     */
    SnsTopicName?: String;
    /**
     * Specifies the ARN of the Amazon SNS topic that CloudTrail uses to send notifications when log files are delivered. The following is the format of a topic ARN.  arn:aws:sns:us-east-2:123456789012:MyTopic 
     */
    SnsTopicARN?: String;
    /**
     * Specifies whether the trail is publishing events from global services such as IAM to the log files.
     */
    IncludeGlobalServiceEvents?: Boolean;
    /**
     * Specifies whether the trail exists in one Region or in all Regions.
     */
    IsMultiRegionTrail?: Boolean;
    /**
     * Specifies the ARN of the trail that was updated. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailARN?: String;
    /**
     * Specifies whether log file integrity validation is enabled.
     */
    LogFileValidationEnabled?: Boolean;
    /**
     * Specifies the Amazon Resource Name (ARN) of the log group to which CloudTrail logs are delivered.
     */
    CloudWatchLogsLogGroupArn?: String;
    /**
     * Specifies the role for the CloudWatch Logs endpoint to assume to write to a user's log group.
     */
    CloudWatchLogsRoleArn?: String;
    /**
     * Specifies the KMS key ID that encrypts the logs delivered by CloudTrail. The value is a fully specified ARN to a KMS key in the following format.  arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012 
     */
    KmsKeyId?: String;
    /**
     * Specifies whether the trail is an organization trail.
     */
    IsOrganizationTrail?: Boolean;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2013-11-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CloudTrail client.
   */
  export import Types = CloudTrail;
}
export = CloudTrail;
