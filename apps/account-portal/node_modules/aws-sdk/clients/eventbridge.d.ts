import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class EventBridge extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: EventBridge.Types.ClientConfiguration)
  config: Config & EventBridge.Types.ClientConfiguration;
  /**
   * Activates a partner event source that has been deactivated. Once activated, your matching event bus will start receiving events from the event source.
   */
  activateEventSource(params: EventBridge.Types.ActivateEventSourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Activates a partner event source that has been deactivated. Once activated, your matching event bus will start receiving events from the event source.
   */
  activateEventSource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Cancels the specified replay.
   */
  cancelReplay(params: EventBridge.Types.CancelReplayRequest, callback?: (err: AWSError, data: EventBridge.Types.CancelReplayResponse) => void): Request<EventBridge.Types.CancelReplayResponse, AWSError>;
  /**
   * Cancels the specified replay.
   */
  cancelReplay(callback?: (err: AWSError, data: EventBridge.Types.CancelReplayResponse) => void): Request<EventBridge.Types.CancelReplayResponse, AWSError>;
  /**
   * Creates an API destination, which is an HTTP invocation endpoint configured as a target for events.
   */
  createApiDestination(params: EventBridge.Types.CreateApiDestinationRequest, callback?: (err: AWSError, data: EventBridge.Types.CreateApiDestinationResponse) => void): Request<EventBridge.Types.CreateApiDestinationResponse, AWSError>;
  /**
   * Creates an API destination, which is an HTTP invocation endpoint configured as a target for events.
   */
  createApiDestination(callback?: (err: AWSError, data: EventBridge.Types.CreateApiDestinationResponse) => void): Request<EventBridge.Types.CreateApiDestinationResponse, AWSError>;
  /**
   * Creates an archive of events with the specified settings. When you create an archive, incoming events might not immediately start being sent to the archive. Allow a short period of time for changes to take effect. If you do not specify a pattern to filter events sent to the archive, all events are sent to the archive except replayed events. Replayed events are not sent to an archive.
   */
  createArchive(params: EventBridge.Types.CreateArchiveRequest, callback?: (err: AWSError, data: EventBridge.Types.CreateArchiveResponse) => void): Request<EventBridge.Types.CreateArchiveResponse, AWSError>;
  /**
   * Creates an archive of events with the specified settings. When you create an archive, incoming events might not immediately start being sent to the archive. Allow a short period of time for changes to take effect. If you do not specify a pattern to filter events sent to the archive, all events are sent to the archive except replayed events. Replayed events are not sent to an archive.
   */
  createArchive(callback?: (err: AWSError, data: EventBridge.Types.CreateArchiveResponse) => void): Request<EventBridge.Types.CreateArchiveResponse, AWSError>;
  /**
   * Creates a connection. A connection defines the authorization type and credentials to use for authorization with an API destination HTTP endpoint.
   */
  createConnection(params: EventBridge.Types.CreateConnectionRequest, callback?: (err: AWSError, data: EventBridge.Types.CreateConnectionResponse) => void): Request<EventBridge.Types.CreateConnectionResponse, AWSError>;
  /**
   * Creates a connection. A connection defines the authorization type and credentials to use for authorization with an API destination HTTP endpoint.
   */
  createConnection(callback?: (err: AWSError, data: EventBridge.Types.CreateConnectionResponse) => void): Request<EventBridge.Types.CreateConnectionResponse, AWSError>;
  /**
   * Creates a new event bus within your account. This can be a custom event bus which you can use to receive events from your custom applications and services, or it can be a partner event bus which can be matched to a partner event source.
   */
  createEventBus(params: EventBridge.Types.CreateEventBusRequest, callback?: (err: AWSError, data: EventBridge.Types.CreateEventBusResponse) => void): Request<EventBridge.Types.CreateEventBusResponse, AWSError>;
  /**
   * Creates a new event bus within your account. This can be a custom event bus which you can use to receive events from your custom applications and services, or it can be a partner event bus which can be matched to a partner event source.
   */
  createEventBus(callback?: (err: AWSError, data: EventBridge.Types.CreateEventBusResponse) => void): Request<EventBridge.Types.CreateEventBusResponse, AWSError>;
  /**
   * Called by an SaaS partner to create a partner event source. This operation is not used by Amazon Web Services customers. Each partner event source can be used by one Amazon Web Services account to create a matching partner event bus in that Amazon Web Services account. A SaaS partner must create one partner event source for each Amazon Web Services account that wants to receive those event types.  A partner event source creates events based on resources within the SaaS partner's service or application. An Amazon Web Services account that creates a partner event bus that matches the partner event source can use that event bus to receive events from the partner, and then process them using Amazon Web Services Events rules and targets. Partner event source names follow this format:   partner_name/event_namespace/event_name    partner_name is determined during partner registration and identifies the partner to Amazon Web Services customers. event_namespace is determined by the partner and is a way for the partner to categorize their events. event_name is determined by the partner, and should uniquely identify an event-generating resource within the partner system. The combination of event_namespace and event_name should help Amazon Web Services customers decide whether to create an event bus to receive these events.
   */
  createPartnerEventSource(params: EventBridge.Types.CreatePartnerEventSourceRequest, callback?: (err: AWSError, data: EventBridge.Types.CreatePartnerEventSourceResponse) => void): Request<EventBridge.Types.CreatePartnerEventSourceResponse, AWSError>;
  /**
   * Called by an SaaS partner to create a partner event source. This operation is not used by Amazon Web Services customers. Each partner event source can be used by one Amazon Web Services account to create a matching partner event bus in that Amazon Web Services account. A SaaS partner must create one partner event source for each Amazon Web Services account that wants to receive those event types.  A partner event source creates events based on resources within the SaaS partner's service or application. An Amazon Web Services account that creates a partner event bus that matches the partner event source can use that event bus to receive events from the partner, and then process them using Amazon Web Services Events rules and targets. Partner event source names follow this format:   partner_name/event_namespace/event_name    partner_name is determined during partner registration and identifies the partner to Amazon Web Services customers. event_namespace is determined by the partner and is a way for the partner to categorize their events. event_name is determined by the partner, and should uniquely identify an event-generating resource within the partner system. The combination of event_namespace and event_name should help Amazon Web Services customers decide whether to create an event bus to receive these events.
   */
  createPartnerEventSource(callback?: (err: AWSError, data: EventBridge.Types.CreatePartnerEventSourceResponse) => void): Request<EventBridge.Types.CreatePartnerEventSourceResponse, AWSError>;
  /**
   * You can use this operation to temporarily stop receiving events from the specified partner event source. The matching event bus is not deleted.  When you deactivate a partner event source, the source goes into PENDING state. If it remains in PENDING state for more than two weeks, it is deleted. To activate a deactivated partner event source, use ActivateEventSource.
   */
  deactivateEventSource(params: EventBridge.Types.DeactivateEventSourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * You can use this operation to temporarily stop receiving events from the specified partner event source. The matching event bus is not deleted.  When you deactivate a partner event source, the source goes into PENDING state. If it remains in PENDING state for more than two weeks, it is deleted. To activate a deactivated partner event source, use ActivateEventSource.
   */
  deactivateEventSource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes all authorization parameters from the connection. This lets you remove the secret from the connection so you can reuse it without having to create a new connection.
   */
  deauthorizeConnection(params: EventBridge.Types.DeauthorizeConnectionRequest, callback?: (err: AWSError, data: EventBridge.Types.DeauthorizeConnectionResponse) => void): Request<EventBridge.Types.DeauthorizeConnectionResponse, AWSError>;
  /**
   * Removes all authorization parameters from the connection. This lets you remove the secret from the connection so you can reuse it without having to create a new connection.
   */
  deauthorizeConnection(callback?: (err: AWSError, data: EventBridge.Types.DeauthorizeConnectionResponse) => void): Request<EventBridge.Types.DeauthorizeConnectionResponse, AWSError>;
  /**
   * Deletes the specified API destination.
   */
  deleteApiDestination(params: EventBridge.Types.DeleteApiDestinationRequest, callback?: (err: AWSError, data: EventBridge.Types.DeleteApiDestinationResponse) => void): Request<EventBridge.Types.DeleteApiDestinationResponse, AWSError>;
  /**
   * Deletes the specified API destination.
   */
  deleteApiDestination(callback?: (err: AWSError, data: EventBridge.Types.DeleteApiDestinationResponse) => void): Request<EventBridge.Types.DeleteApiDestinationResponse, AWSError>;
  /**
   * Deletes the specified archive.
   */
  deleteArchive(params: EventBridge.Types.DeleteArchiveRequest, callback?: (err: AWSError, data: EventBridge.Types.DeleteArchiveResponse) => void): Request<EventBridge.Types.DeleteArchiveResponse, AWSError>;
  /**
   * Deletes the specified archive.
   */
  deleteArchive(callback?: (err: AWSError, data: EventBridge.Types.DeleteArchiveResponse) => void): Request<EventBridge.Types.DeleteArchiveResponse, AWSError>;
  /**
   * Deletes a connection.
   */
  deleteConnection(params: EventBridge.Types.DeleteConnectionRequest, callback?: (err: AWSError, data: EventBridge.Types.DeleteConnectionResponse) => void): Request<EventBridge.Types.DeleteConnectionResponse, AWSError>;
  /**
   * Deletes a connection.
   */
  deleteConnection(callback?: (err: AWSError, data: EventBridge.Types.DeleteConnectionResponse) => void): Request<EventBridge.Types.DeleteConnectionResponse, AWSError>;
  /**
   * Deletes the specified custom event bus or partner event bus. All rules associated with this event bus need to be deleted. You can't delete your account's default event bus.
   */
  deleteEventBus(params: EventBridge.Types.DeleteEventBusRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified custom event bus or partner event bus. All rules associated with this event bus need to be deleted. You can't delete your account's default event bus.
   */
  deleteEventBus(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This operation is used by SaaS partners to delete a partner event source. This operation is not used by Amazon Web Services customers. When you delete an event source, the status of the corresponding partner event bus in the Amazon Web Services customer account becomes DELETED. 
   */
  deletePartnerEventSource(params: EventBridge.Types.DeletePartnerEventSourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This operation is used by SaaS partners to delete a partner event source. This operation is not used by Amazon Web Services customers. When you delete an event source, the status of the corresponding partner event bus in the Amazon Web Services customer account becomes DELETED. 
   */
  deletePartnerEventSource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified rule. Before you can delete the rule, you must remove all targets, using RemoveTargets. When you delete a rule, incoming events might continue to match to the deleted rule. Allow a short period of time for changes to take effect. If you call delete rule multiple times for the same rule, all calls will succeed. When you call delete rule for a non-existent custom eventbus, ResourceNotFoundException is returned. Managed rules are rules created and managed by another Amazon Web Services service on your behalf. These rules are created by those other Amazon Web Services services to support functionality in those services. You can delete these rules using the Force option, but you should do so only if you are sure the other service is not still using that rule.
   */
  deleteRule(params: EventBridge.Types.DeleteRuleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified rule. Before you can delete the rule, you must remove all targets, using RemoveTargets. When you delete a rule, incoming events might continue to match to the deleted rule. Allow a short period of time for changes to take effect. If you call delete rule multiple times for the same rule, all calls will succeed. When you call delete rule for a non-existent custom eventbus, ResourceNotFoundException is returned. Managed rules are rules created and managed by another Amazon Web Services service on your behalf. These rules are created by those other Amazon Web Services services to support functionality in those services. You can delete these rules using the Force option, but you should do so only if you are sure the other service is not still using that rule.
   */
  deleteRule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieves details about an API destination.
   */
  describeApiDestination(params: EventBridge.Types.DescribeApiDestinationRequest, callback?: (err: AWSError, data: EventBridge.Types.DescribeApiDestinationResponse) => void): Request<EventBridge.Types.DescribeApiDestinationResponse, AWSError>;
  /**
   * Retrieves details about an API destination.
   */
  describeApiDestination(callback?: (err: AWSError, data: EventBridge.Types.DescribeApiDestinationResponse) => void): Request<EventBridge.Types.DescribeApiDestinationResponse, AWSError>;
  /**
   * Retrieves details about an archive.
   */
  describeArchive(params: EventBridge.Types.DescribeArchiveRequest, callback?: (err: AWSError, data: EventBridge.Types.DescribeArchiveResponse) => void): Request<EventBridge.Types.DescribeArchiveResponse, AWSError>;
  /**
   * Retrieves details about an archive.
   */
  describeArchive(callback?: (err: AWSError, data: EventBridge.Types.DescribeArchiveResponse) => void): Request<EventBridge.Types.DescribeArchiveResponse, AWSError>;
  /**
   * Retrieves details about a connection.
   */
  describeConnection(params: EventBridge.Types.DescribeConnectionRequest, callback?: (err: AWSError, data: EventBridge.Types.DescribeConnectionResponse) => void): Request<EventBridge.Types.DescribeConnectionResponse, AWSError>;
  /**
   * Retrieves details about a connection.
   */
  describeConnection(callback?: (err: AWSError, data: EventBridge.Types.DescribeConnectionResponse) => void): Request<EventBridge.Types.DescribeConnectionResponse, AWSError>;
  /**
   * Displays details about an event bus in your account. This can include the external Amazon Web Services accounts that are permitted to write events to your default event bus, and the associated policy. For custom event buses and partner event buses, it displays the name, ARN, policy, state, and creation time.  To enable your account to receive events from other accounts on its default event bus, use PutPermission. For more information about partner event buses, see CreateEventBus.
   */
  describeEventBus(params: EventBridge.Types.DescribeEventBusRequest, callback?: (err: AWSError, data: EventBridge.Types.DescribeEventBusResponse) => void): Request<EventBridge.Types.DescribeEventBusResponse, AWSError>;
  /**
   * Displays details about an event bus in your account. This can include the external Amazon Web Services accounts that are permitted to write events to your default event bus, and the associated policy. For custom event buses and partner event buses, it displays the name, ARN, policy, state, and creation time.  To enable your account to receive events from other accounts on its default event bus, use PutPermission. For more information about partner event buses, see CreateEventBus.
   */
  describeEventBus(callback?: (err: AWSError, data: EventBridge.Types.DescribeEventBusResponse) => void): Request<EventBridge.Types.DescribeEventBusResponse, AWSError>;
  /**
   * This operation lists details about a partner event source that is shared with your account.
   */
  describeEventSource(params: EventBridge.Types.DescribeEventSourceRequest, callback?: (err: AWSError, data: EventBridge.Types.DescribeEventSourceResponse) => void): Request<EventBridge.Types.DescribeEventSourceResponse, AWSError>;
  /**
   * This operation lists details about a partner event source that is shared with your account.
   */
  describeEventSource(callback?: (err: AWSError, data: EventBridge.Types.DescribeEventSourceResponse) => void): Request<EventBridge.Types.DescribeEventSourceResponse, AWSError>;
  /**
   * An SaaS partner can use this operation to list details about a partner event source that they have created. Amazon Web Services customers do not use this operation. Instead, Amazon Web Services customers can use DescribeEventSource to see details about a partner event source that is shared with them.
   */
  describePartnerEventSource(params: EventBridge.Types.DescribePartnerEventSourceRequest, callback?: (err: AWSError, data: EventBridge.Types.DescribePartnerEventSourceResponse) => void): Request<EventBridge.Types.DescribePartnerEventSourceResponse, AWSError>;
  /**
   * An SaaS partner can use this operation to list details about a partner event source that they have created. Amazon Web Services customers do not use this operation. Instead, Amazon Web Services customers can use DescribeEventSource to see details about a partner event source that is shared with them.
   */
  describePartnerEventSource(callback?: (err: AWSError, data: EventBridge.Types.DescribePartnerEventSourceResponse) => void): Request<EventBridge.Types.DescribePartnerEventSourceResponse, AWSError>;
  /**
   * Retrieves details about a replay. Use DescribeReplay to determine the progress of a running replay. A replay processes events to replay based on the time in the event, and replays them using 1 minute intervals. If you use StartReplay and specify an EventStartTime and an EventEndTime that covers a 20 minute time range, the events are replayed from the first minute of that 20 minute range first. Then the events from the second minute are replayed. You can use DescribeReplay to determine the progress of a replay. The value returned for EventLastReplayedTime indicates the time within the specified time range associated with the last event replayed.
   */
  describeReplay(params: EventBridge.Types.DescribeReplayRequest, callback?: (err: AWSError, data: EventBridge.Types.DescribeReplayResponse) => void): Request<EventBridge.Types.DescribeReplayResponse, AWSError>;
  /**
   * Retrieves details about a replay. Use DescribeReplay to determine the progress of a running replay. A replay processes events to replay based on the time in the event, and replays them using 1 minute intervals. If you use StartReplay and specify an EventStartTime and an EventEndTime that covers a 20 minute time range, the events are replayed from the first minute of that 20 minute range first. Then the events from the second minute are replayed. You can use DescribeReplay to determine the progress of a replay. The value returned for EventLastReplayedTime indicates the time within the specified time range associated with the last event replayed.
   */
  describeReplay(callback?: (err: AWSError, data: EventBridge.Types.DescribeReplayResponse) => void): Request<EventBridge.Types.DescribeReplayResponse, AWSError>;
  /**
   * Describes the specified rule. DescribeRule does not list the targets of a rule. To see the targets associated with a rule, use ListTargetsByRule.
   */
  describeRule(params: EventBridge.Types.DescribeRuleRequest, callback?: (err: AWSError, data: EventBridge.Types.DescribeRuleResponse) => void): Request<EventBridge.Types.DescribeRuleResponse, AWSError>;
  /**
   * Describes the specified rule. DescribeRule does not list the targets of a rule. To see the targets associated with a rule, use ListTargetsByRule.
   */
  describeRule(callback?: (err: AWSError, data: EventBridge.Types.DescribeRuleResponse) => void): Request<EventBridge.Types.DescribeRuleResponse, AWSError>;
  /**
   * Disables the specified rule. A disabled rule won't match any events, and won't self-trigger if it has a schedule expression. When you disable a rule, incoming events might continue to match to the disabled rule. Allow a short period of time for changes to take effect.
   */
  disableRule(params: EventBridge.Types.DisableRuleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables the specified rule. A disabled rule won't match any events, and won't self-trigger if it has a schedule expression. When you disable a rule, incoming events might continue to match to the disabled rule. Allow a short period of time for changes to take effect.
   */
  disableRule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables the specified rule. If the rule does not exist, the operation fails. When you enable a rule, incoming events might not immediately start matching to a newly enabled rule. Allow a short period of time for changes to take effect.
   */
  enableRule(params: EventBridge.Types.EnableRuleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables the specified rule. If the rule does not exist, the operation fails. When you enable a rule, incoming events might not immediately start matching to a newly enabled rule. Allow a short period of time for changes to take effect.
   */
  enableRule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieves a list of API destination in the account in the current Region.
   */
  listApiDestinations(params: EventBridge.Types.ListApiDestinationsRequest, callback?: (err: AWSError, data: EventBridge.Types.ListApiDestinationsResponse) => void): Request<EventBridge.Types.ListApiDestinationsResponse, AWSError>;
  /**
   * Retrieves a list of API destination in the account in the current Region.
   */
  listApiDestinations(callback?: (err: AWSError, data: EventBridge.Types.ListApiDestinationsResponse) => void): Request<EventBridge.Types.ListApiDestinationsResponse, AWSError>;
  /**
   * Lists your archives. You can either list all the archives or you can provide a prefix to match to the archive names. Filter parameters are exclusive.
   */
  listArchives(params: EventBridge.Types.ListArchivesRequest, callback?: (err: AWSError, data: EventBridge.Types.ListArchivesResponse) => void): Request<EventBridge.Types.ListArchivesResponse, AWSError>;
  /**
   * Lists your archives. You can either list all the archives or you can provide a prefix to match to the archive names. Filter parameters are exclusive.
   */
  listArchives(callback?: (err: AWSError, data: EventBridge.Types.ListArchivesResponse) => void): Request<EventBridge.Types.ListArchivesResponse, AWSError>;
  /**
   * Retrieves a list of connections from the account.
   */
  listConnections(params: EventBridge.Types.ListConnectionsRequest, callback?: (err: AWSError, data: EventBridge.Types.ListConnectionsResponse) => void): Request<EventBridge.Types.ListConnectionsResponse, AWSError>;
  /**
   * Retrieves a list of connections from the account.
   */
  listConnections(callback?: (err: AWSError, data: EventBridge.Types.ListConnectionsResponse) => void): Request<EventBridge.Types.ListConnectionsResponse, AWSError>;
  /**
   * Lists all the event buses in your account, including the default event bus, custom event buses, and partner event buses.
   */
  listEventBuses(params: EventBridge.Types.ListEventBusesRequest, callback?: (err: AWSError, data: EventBridge.Types.ListEventBusesResponse) => void): Request<EventBridge.Types.ListEventBusesResponse, AWSError>;
  /**
   * Lists all the event buses in your account, including the default event bus, custom event buses, and partner event buses.
   */
  listEventBuses(callback?: (err: AWSError, data: EventBridge.Types.ListEventBusesResponse) => void): Request<EventBridge.Types.ListEventBusesResponse, AWSError>;
  /**
   * You can use this to see all the partner event sources that have been shared with your Amazon Web Services account. For more information about partner event sources, see CreateEventBus.
   */
  listEventSources(params: EventBridge.Types.ListEventSourcesRequest, callback?: (err: AWSError, data: EventBridge.Types.ListEventSourcesResponse) => void): Request<EventBridge.Types.ListEventSourcesResponse, AWSError>;
  /**
   * You can use this to see all the partner event sources that have been shared with your Amazon Web Services account. For more information about partner event sources, see CreateEventBus.
   */
  listEventSources(callback?: (err: AWSError, data: EventBridge.Types.ListEventSourcesResponse) => void): Request<EventBridge.Types.ListEventSourcesResponse, AWSError>;
  /**
   * An SaaS partner can use this operation to display the Amazon Web Services account ID that a particular partner event source name is associated with. This operation is not used by Amazon Web Services customers.
   */
  listPartnerEventSourceAccounts(params: EventBridge.Types.ListPartnerEventSourceAccountsRequest, callback?: (err: AWSError, data: EventBridge.Types.ListPartnerEventSourceAccountsResponse) => void): Request<EventBridge.Types.ListPartnerEventSourceAccountsResponse, AWSError>;
  /**
   * An SaaS partner can use this operation to display the Amazon Web Services account ID that a particular partner event source name is associated with. This operation is not used by Amazon Web Services customers.
   */
  listPartnerEventSourceAccounts(callback?: (err: AWSError, data: EventBridge.Types.ListPartnerEventSourceAccountsResponse) => void): Request<EventBridge.Types.ListPartnerEventSourceAccountsResponse, AWSError>;
  /**
   * An SaaS partner can use this operation to list all the partner event source names that they have created. This operation is not used by Amazon Web Services customers.
   */
  listPartnerEventSources(params: EventBridge.Types.ListPartnerEventSourcesRequest, callback?: (err: AWSError, data: EventBridge.Types.ListPartnerEventSourcesResponse) => void): Request<EventBridge.Types.ListPartnerEventSourcesResponse, AWSError>;
  /**
   * An SaaS partner can use this operation to list all the partner event source names that they have created. This operation is not used by Amazon Web Services customers.
   */
  listPartnerEventSources(callback?: (err: AWSError, data: EventBridge.Types.ListPartnerEventSourcesResponse) => void): Request<EventBridge.Types.ListPartnerEventSourcesResponse, AWSError>;
  /**
   * Lists your replays. You can either list all the replays or you can provide a prefix to match to the replay names. Filter parameters are exclusive.
   */
  listReplays(params: EventBridge.Types.ListReplaysRequest, callback?: (err: AWSError, data: EventBridge.Types.ListReplaysResponse) => void): Request<EventBridge.Types.ListReplaysResponse, AWSError>;
  /**
   * Lists your replays. You can either list all the replays or you can provide a prefix to match to the replay names. Filter parameters are exclusive.
   */
  listReplays(callback?: (err: AWSError, data: EventBridge.Types.ListReplaysResponse) => void): Request<EventBridge.Types.ListReplaysResponse, AWSError>;
  /**
   * Lists the rules for the specified target. You can see which of the rules in Amazon EventBridge can invoke a specific target in your account.
   */
  listRuleNamesByTarget(params: EventBridge.Types.ListRuleNamesByTargetRequest, callback?: (err: AWSError, data: EventBridge.Types.ListRuleNamesByTargetResponse) => void): Request<EventBridge.Types.ListRuleNamesByTargetResponse, AWSError>;
  /**
   * Lists the rules for the specified target. You can see which of the rules in Amazon EventBridge can invoke a specific target in your account.
   */
  listRuleNamesByTarget(callback?: (err: AWSError, data: EventBridge.Types.ListRuleNamesByTargetResponse) => void): Request<EventBridge.Types.ListRuleNamesByTargetResponse, AWSError>;
  /**
   * Lists your Amazon EventBridge rules. You can either list all the rules or you can provide a prefix to match to the rule names. ListRules does not list the targets of a rule. To see the targets associated with a rule, use ListTargetsByRule.
   */
  listRules(params: EventBridge.Types.ListRulesRequest, callback?: (err: AWSError, data: EventBridge.Types.ListRulesResponse) => void): Request<EventBridge.Types.ListRulesResponse, AWSError>;
  /**
   * Lists your Amazon EventBridge rules. You can either list all the rules or you can provide a prefix to match to the rule names. ListRules does not list the targets of a rule. To see the targets associated with a rule, use ListTargetsByRule.
   */
  listRules(callback?: (err: AWSError, data: EventBridge.Types.ListRulesResponse) => void): Request<EventBridge.Types.ListRulesResponse, AWSError>;
  /**
   * Displays the tags associated with an EventBridge resource. In EventBridge, rules and event buses can be tagged.
   */
  listTagsForResource(params: EventBridge.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: EventBridge.Types.ListTagsForResourceResponse) => void): Request<EventBridge.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Displays the tags associated with an EventBridge resource. In EventBridge, rules and event buses can be tagged.
   */
  listTagsForResource(callback?: (err: AWSError, data: EventBridge.Types.ListTagsForResourceResponse) => void): Request<EventBridge.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the targets assigned to the specified rule.
   */
  listTargetsByRule(params: EventBridge.Types.ListTargetsByRuleRequest, callback?: (err: AWSError, data: EventBridge.Types.ListTargetsByRuleResponse) => void): Request<EventBridge.Types.ListTargetsByRuleResponse, AWSError>;
  /**
   * Lists the targets assigned to the specified rule.
   */
  listTargetsByRule(callback?: (err: AWSError, data: EventBridge.Types.ListTargetsByRuleResponse) => void): Request<EventBridge.Types.ListTargetsByRuleResponse, AWSError>;
  /**
   * Sends custom events to Amazon EventBridge so that they can be matched to rules.
   */
  putEvents(params: EventBridge.Types.PutEventsRequest, callback?: (err: AWSError, data: EventBridge.Types.PutEventsResponse) => void): Request<EventBridge.Types.PutEventsResponse, AWSError>;
  /**
   * Sends custom events to Amazon EventBridge so that they can be matched to rules.
   */
  putEvents(callback?: (err: AWSError, data: EventBridge.Types.PutEventsResponse) => void): Request<EventBridge.Types.PutEventsResponse, AWSError>;
  /**
   * This is used by SaaS partners to write events to a customer's partner event bus. Amazon Web Services customers do not use this operation.
   */
  putPartnerEvents(params: EventBridge.Types.PutPartnerEventsRequest, callback?: (err: AWSError, data: EventBridge.Types.PutPartnerEventsResponse) => void): Request<EventBridge.Types.PutPartnerEventsResponse, AWSError>;
  /**
   * This is used by SaaS partners to write events to a customer's partner event bus. Amazon Web Services customers do not use this operation.
   */
  putPartnerEvents(callback?: (err: AWSError, data: EventBridge.Types.PutPartnerEventsResponse) => void): Request<EventBridge.Types.PutPartnerEventsResponse, AWSError>;
  /**
   * Running PutPermission permits the specified Amazon Web Services account or Amazon Web Services organization to put events to the specified event bus. Amazon EventBridge (CloudWatch Events) rules in your account are triggered by these events arriving to an event bus in your account.  For another account to send events to your account, that external account must have an EventBridge rule with your account's event bus as a target. To enable multiple Amazon Web Services accounts to put events to your event bus, run PutPermission once for each of these accounts. Or, if all the accounts are members of the same Amazon Web Services organization, you can run PutPermission once specifying Principal as "*" and specifying the Amazon Web Services organization ID in Condition, to grant permissions to all accounts in that organization. If you grant permissions using an organization, then accounts in that organization must specify a RoleArn with proper permissions when they use PutTarget to add your account's event bus as a target. For more information, see Sending and Receiving Events Between Amazon Web Services Accounts in the Amazon EventBridge User Guide. The permission policy on the event bus cannot exceed 10 KB in size.
   */
  putPermission(params: EventBridge.Types.PutPermissionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Running PutPermission permits the specified Amazon Web Services account or Amazon Web Services organization to put events to the specified event bus. Amazon EventBridge (CloudWatch Events) rules in your account are triggered by these events arriving to an event bus in your account.  For another account to send events to your account, that external account must have an EventBridge rule with your account's event bus as a target. To enable multiple Amazon Web Services accounts to put events to your event bus, run PutPermission once for each of these accounts. Or, if all the accounts are members of the same Amazon Web Services organization, you can run PutPermission once specifying Principal as "*" and specifying the Amazon Web Services organization ID in Condition, to grant permissions to all accounts in that organization. If you grant permissions using an organization, then accounts in that organization must specify a RoleArn with proper permissions when they use PutTarget to add your account's event bus as a target. For more information, see Sending and Receiving Events Between Amazon Web Services Accounts in the Amazon EventBridge User Guide. The permission policy on the event bus cannot exceed 10 KB in size.
   */
  putPermission(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or updates the specified rule. Rules are enabled by default, or based on value of the state. You can disable a rule using DisableRule. A single rule watches for events from a single event bus. Events generated by Amazon Web Services services go to your account's default event bus. Events generated by SaaS partner services or applications go to the matching partner event bus. If you have custom applications or services, you can specify whether their events go to your default event bus or a custom event bus that you have created. For more information, see CreateEventBus. If you are updating an existing rule, the rule is replaced with what you specify in this PutRule command. If you omit arguments in PutRule, the old values for those arguments are not kept. Instead, they are replaced with null values. When you create or update a rule, incoming events might not immediately start matching to new or updated rules. Allow a short period of time for changes to take effect. A rule must contain at least an EventPattern or ScheduleExpression. Rules with EventPatterns are triggered when a matching event is observed. Rules with ScheduleExpressions self-trigger based on the given schedule. A rule can have both an EventPattern and a ScheduleExpression, in which case the rule triggers on matching events as well as on a schedule. When you initially create a rule, you can optionally assign one or more tags to the rule. Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only rules with certain tag values. To use the PutRule operation and assign tags, you must have both the events:PutRule and events:TagResource permissions. If you are updating an existing rule, any tags you specify in the PutRule operation are ignored. To update the tags of an existing rule, use TagResource and UntagResource. Most services in Amazon Web Services treat : or / as the same character in Amazon Resource Names (ARNs). However, EventBridge uses an exact match in event patterns and rules. Be sure to use the correct ARN characters when creating event patterns so that they match the ARN syntax in the event you want to match. In EventBridge, it is possible to create rules that lead to infinite loops, where a rule is fired repeatedly. For example, a rule might detect that ACLs have changed on an S3 bucket, and trigger software to change them to the desired state. If the rule is not written carefully, the subsequent change to the ACLs fires the rule again, creating an infinite loop. To prevent this, write the rules so that the triggered actions do not re-fire the same rule. For example, your rule could fire only if ACLs are found to be in a bad state, instead of after any change.  An infinite loop can quickly cause higher than expected charges. We recommend that you use budgeting, which alerts you when charges exceed your specified limit. For more information, see Managing Your Costs with Budgets.
   */
  putRule(params: EventBridge.Types.PutRuleRequest, callback?: (err: AWSError, data: EventBridge.Types.PutRuleResponse) => void): Request<EventBridge.Types.PutRuleResponse, AWSError>;
  /**
   * Creates or updates the specified rule. Rules are enabled by default, or based on value of the state. You can disable a rule using DisableRule. A single rule watches for events from a single event bus. Events generated by Amazon Web Services services go to your account's default event bus. Events generated by SaaS partner services or applications go to the matching partner event bus. If you have custom applications or services, you can specify whether their events go to your default event bus or a custom event bus that you have created. For more information, see CreateEventBus. If you are updating an existing rule, the rule is replaced with what you specify in this PutRule command. If you omit arguments in PutRule, the old values for those arguments are not kept. Instead, they are replaced with null values. When you create or update a rule, incoming events might not immediately start matching to new or updated rules. Allow a short period of time for changes to take effect. A rule must contain at least an EventPattern or ScheduleExpression. Rules with EventPatterns are triggered when a matching event is observed. Rules with ScheduleExpressions self-trigger based on the given schedule. A rule can have both an EventPattern and a ScheduleExpression, in which case the rule triggers on matching events as well as on a schedule. When you initially create a rule, you can optionally assign one or more tags to the rule. Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only rules with certain tag values. To use the PutRule operation and assign tags, you must have both the events:PutRule and events:TagResource permissions. If you are updating an existing rule, any tags you specify in the PutRule operation are ignored. To update the tags of an existing rule, use TagResource and UntagResource. Most services in Amazon Web Services treat : or / as the same character in Amazon Resource Names (ARNs). However, EventBridge uses an exact match in event patterns and rules. Be sure to use the correct ARN characters when creating event patterns so that they match the ARN syntax in the event you want to match. In EventBridge, it is possible to create rules that lead to infinite loops, where a rule is fired repeatedly. For example, a rule might detect that ACLs have changed on an S3 bucket, and trigger software to change them to the desired state. If the rule is not written carefully, the subsequent change to the ACLs fires the rule again, creating an infinite loop. To prevent this, write the rules so that the triggered actions do not re-fire the same rule. For example, your rule could fire only if ACLs are found to be in a bad state, instead of after any change.  An infinite loop can quickly cause higher than expected charges. We recommend that you use budgeting, which alerts you when charges exceed your specified limit. For more information, see Managing Your Costs with Budgets.
   */
  putRule(callback?: (err: AWSError, data: EventBridge.Types.PutRuleResponse) => void): Request<EventBridge.Types.PutRuleResponse, AWSError>;
  /**
   * Adds the specified targets to the specified rule, or updates the targets if they are already associated with the rule. Targets are the resources that are invoked when a rule is triggered. You can configure the following as targets for Events:    API destination    Amazon API Gateway REST API endpoints   API Gateway   Batch job queue   CloudWatch Logs group   CodeBuild project   CodePipeline   Amazon EC2 CreateSnapshot API call   Amazon EC2 RebootInstances API call   Amazon EC2 StopInstances API call   Amazon EC2 TerminateInstances API call   Amazon ECS tasks   Event bus in a different Amazon Web Services account or Region. You can use an event bus in the US East (N. Virginia) us-east-1, US West (Oregon) us-west-2, or Europe (Ireland) eu-west-1 Regions as a target for a rule.   Firehose delivery stream (Kinesis Data Firehose)   Inspector assessment template (Amazon Inspector)   Kinesis stream (Kinesis Data Stream)   Lambda function   Redshift clusters (Data API statement execution)   Amazon SNS topic   Amazon SQS queues (includes FIFO queues   SSM Automation   SSM OpsItem   SSM Run Command   Step Functions state machines   Creating rules with built-in targets is supported only in the Amazon Web Services Management Console. The built-in targets are EC2 CreateSnapshot API call, EC2 RebootInstances API call, EC2 StopInstances API call, and EC2 TerminateInstances API call.  For some target types, PutTargets provides target-specific parameters. If the target is a Kinesis data stream, you can optionally specify which shard the event goes to by using the KinesisParameters argument. To invoke a command on multiple EC2 instances with one rule, you can use the RunCommandParameters field. To be able to make API calls against the resources that you own, Amazon EventBridge needs the appropriate permissions. For Lambda and Amazon SNS resources, EventBridge relies on resource-based policies. For EC2 instances, Kinesis Data Streams, Step Functions state machines and API Gateway REST APIs, EventBridge relies on IAM roles that you specify in the RoleARN argument in PutTargets. For more information, see Authentication and Access Control in the Amazon EventBridge User Guide. If another Amazon Web Services account is in the same region and has granted you permission (using PutPermission), you can send events to that account. Set that account's event bus as a target of the rules in your account. To send the matched events to the other account, specify that account's event bus as the Arn value when you run PutTargets. If your account sends events to another account, your account is charged for each sent event. Each event sent to another account is charged as a custom event. The account receiving the event is not charged. For more information, see Amazon EventBridge Pricing.   Input, InputPath, and InputTransformer are not available with PutTarget if the target is an event bus of a different Amazon Web Services account.  If you are setting the event bus of another account as the target, and that account granted permission to your account through an organization instead of directly by the account ID, then you must specify a RoleArn with proper permissions in the Target structure. For more information, see Sending and Receiving Events Between Amazon Web Services Accounts in the Amazon EventBridge User Guide. For more information about enabling cross-account events, see PutPermission.  Input, InputPath, and InputTransformer are mutually exclusive and optional parameters of a target. When a rule is triggered due to a matched event:   If none of the following arguments are specified for a target, then the entire event is passed to the target in JSON format (unless the target is Amazon EC2 Run Command or Amazon ECS task, in which case nothing from the event is passed to the target).   If Input is specified in the form of valid JSON, then the matched event is overridden with this constant.   If InputPath is specified in the form of JSONPath (for example, $.detail), then only the part of the event specified in the path is passed to the target (for example, only the detail part of the event is passed).   If InputTransformer is specified, then one or more specified JSONPaths are extracted from the event and used as values in a template that you specify as the input to the target.   When you specify InputPath or InputTransformer, you must use JSON dot notation, not bracket notation. When you add targets to a rule and the associated rule triggers soon after, new or updated targets might not be immediately invoked. Allow a short period of time for changes to take effect. This action can partially fail if too many requests are made at the same time. If that happens, FailedEntryCount is non-zero in the response and each entry in FailedEntries provides the ID of the failed target and the error code.
   */
  putTargets(params: EventBridge.Types.PutTargetsRequest, callback?: (err: AWSError, data: EventBridge.Types.PutTargetsResponse) => void): Request<EventBridge.Types.PutTargetsResponse, AWSError>;
  /**
   * Adds the specified targets to the specified rule, or updates the targets if they are already associated with the rule. Targets are the resources that are invoked when a rule is triggered. You can configure the following as targets for Events:    API destination    Amazon API Gateway REST API endpoints   API Gateway   Batch job queue   CloudWatch Logs group   CodeBuild project   CodePipeline   Amazon EC2 CreateSnapshot API call   Amazon EC2 RebootInstances API call   Amazon EC2 StopInstances API call   Amazon EC2 TerminateInstances API call   Amazon ECS tasks   Event bus in a different Amazon Web Services account or Region. You can use an event bus in the US East (N. Virginia) us-east-1, US West (Oregon) us-west-2, or Europe (Ireland) eu-west-1 Regions as a target for a rule.   Firehose delivery stream (Kinesis Data Firehose)   Inspector assessment template (Amazon Inspector)   Kinesis stream (Kinesis Data Stream)   Lambda function   Redshift clusters (Data API statement execution)   Amazon SNS topic   Amazon SQS queues (includes FIFO queues   SSM Automation   SSM OpsItem   SSM Run Command   Step Functions state machines   Creating rules with built-in targets is supported only in the Amazon Web Services Management Console. The built-in targets are EC2 CreateSnapshot API call, EC2 RebootInstances API call, EC2 StopInstances API call, and EC2 TerminateInstances API call.  For some target types, PutTargets provides target-specific parameters. If the target is a Kinesis data stream, you can optionally specify which shard the event goes to by using the KinesisParameters argument. To invoke a command on multiple EC2 instances with one rule, you can use the RunCommandParameters field. To be able to make API calls against the resources that you own, Amazon EventBridge needs the appropriate permissions. For Lambda and Amazon SNS resources, EventBridge relies on resource-based policies. For EC2 instances, Kinesis Data Streams, Step Functions state machines and API Gateway REST APIs, EventBridge relies on IAM roles that you specify in the RoleARN argument in PutTargets. For more information, see Authentication and Access Control in the Amazon EventBridge User Guide. If another Amazon Web Services account is in the same region and has granted you permission (using PutPermission), you can send events to that account. Set that account's event bus as a target of the rules in your account. To send the matched events to the other account, specify that account's event bus as the Arn value when you run PutTargets. If your account sends events to another account, your account is charged for each sent event. Each event sent to another account is charged as a custom event. The account receiving the event is not charged. For more information, see Amazon EventBridge Pricing.   Input, InputPath, and InputTransformer are not available with PutTarget if the target is an event bus of a different Amazon Web Services account.  If you are setting the event bus of another account as the target, and that account granted permission to your account through an organization instead of directly by the account ID, then you must specify a RoleArn with proper permissions in the Target structure. For more information, see Sending and Receiving Events Between Amazon Web Services Accounts in the Amazon EventBridge User Guide. For more information about enabling cross-account events, see PutPermission.  Input, InputPath, and InputTransformer are mutually exclusive and optional parameters of a target. When a rule is triggered due to a matched event:   If none of the following arguments are specified for a target, then the entire event is passed to the target in JSON format (unless the target is Amazon EC2 Run Command or Amazon ECS task, in which case nothing from the event is passed to the target).   If Input is specified in the form of valid JSON, then the matched event is overridden with this constant.   If InputPath is specified in the form of JSONPath (for example, $.detail), then only the part of the event specified in the path is passed to the target (for example, only the detail part of the event is passed).   If InputTransformer is specified, then one or more specified JSONPaths are extracted from the event and used as values in a template that you specify as the input to the target.   When you specify InputPath or InputTransformer, you must use JSON dot notation, not bracket notation. When you add targets to a rule and the associated rule triggers soon after, new or updated targets might not be immediately invoked. Allow a short period of time for changes to take effect. This action can partially fail if too many requests are made at the same time. If that happens, FailedEntryCount is non-zero in the response and each entry in FailedEntries provides the ID of the failed target and the error code.
   */
  putTargets(callback?: (err: AWSError, data: EventBridge.Types.PutTargetsResponse) => void): Request<EventBridge.Types.PutTargetsResponse, AWSError>;
  /**
   * Revokes the permission of another Amazon Web Services account to be able to put events to the specified event bus. Specify the account to revoke by the StatementId value that you associated with the account when you granted it permission with PutPermission. You can find the StatementId by using DescribeEventBus.
   */
  removePermission(params: EventBridge.Types.RemovePermissionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Revokes the permission of another Amazon Web Services account to be able to put events to the specified event bus. Specify the account to revoke by the StatementId value that you associated with the account when you granted it permission with PutPermission. You can find the StatementId by using DescribeEventBus.
   */
  removePermission(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified targets from the specified rule. When the rule is triggered, those targets are no longer be invoked. When you remove a target, when the associated rule triggers, removed targets might continue to be invoked. Allow a short period of time for changes to take effect. This action can partially fail if too many requests are made at the same time. If that happens, FailedEntryCount is non-zero in the response and each entry in FailedEntries provides the ID of the failed target and the error code.
   */
  removeTargets(params: EventBridge.Types.RemoveTargetsRequest, callback?: (err: AWSError, data: EventBridge.Types.RemoveTargetsResponse) => void): Request<EventBridge.Types.RemoveTargetsResponse, AWSError>;
  /**
   * Removes the specified targets from the specified rule. When the rule is triggered, those targets are no longer be invoked. When you remove a target, when the associated rule triggers, removed targets might continue to be invoked. Allow a short period of time for changes to take effect. This action can partially fail if too many requests are made at the same time. If that happens, FailedEntryCount is non-zero in the response and each entry in FailedEntries provides the ID of the failed target and the error code.
   */
  removeTargets(callback?: (err: AWSError, data: EventBridge.Types.RemoveTargetsResponse) => void): Request<EventBridge.Types.RemoveTargetsResponse, AWSError>;
  /**
   * Starts the specified replay. Events are not necessarily replayed in the exact same order that they were added to the archive. A replay processes events to replay based on the time in the event, and replays them using 1 minute intervals. If you specify an EventStartTime and an EventEndTime that covers a 20 minute time range, the events are replayed from the first minute of that 20 minute range first. Then the events from the second minute are replayed. You can use DescribeReplay to determine the progress of a replay. The value returned for EventLastReplayedTime indicates the time within the specified time range associated with the last event replayed.
   */
  startReplay(params: EventBridge.Types.StartReplayRequest, callback?: (err: AWSError, data: EventBridge.Types.StartReplayResponse) => void): Request<EventBridge.Types.StartReplayResponse, AWSError>;
  /**
   * Starts the specified replay. Events are not necessarily replayed in the exact same order that they were added to the archive. A replay processes events to replay based on the time in the event, and replays them using 1 minute intervals. If you specify an EventStartTime and an EventEndTime that covers a 20 minute time range, the events are replayed from the first minute of that 20 minute range first. Then the events from the second minute are replayed. You can use DescribeReplay to determine the progress of a replay. The value returned for EventLastReplayedTime indicates the time within the specified time range associated with the last event replayed.
   */
  startReplay(callback?: (err: AWSError, data: EventBridge.Types.StartReplayResponse) => void): Request<EventBridge.Types.StartReplayResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified EventBridge resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. In EventBridge, rules and event buses can be tagged. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the TagResource action with a resource that already has tags. If you specify a new tag key, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a resource.
   */
  tagResource(params: EventBridge.Types.TagResourceRequest, callback?: (err: AWSError, data: EventBridge.Types.TagResourceResponse) => void): Request<EventBridge.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified EventBridge resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. In EventBridge, rules and event buses can be tagged. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the TagResource action with a resource that already has tags. If you specify a new tag key, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a resource.
   */
  tagResource(callback?: (err: AWSError, data: EventBridge.Types.TagResourceResponse) => void): Request<EventBridge.Types.TagResourceResponse, AWSError>;
  /**
   * Tests whether the specified event pattern matches the provided event. Most services in Amazon Web Services treat : or / as the same character in Amazon Resource Names (ARNs). However, EventBridge uses an exact match in event patterns and rules. Be sure to use the correct ARN characters when creating event patterns so that they match the ARN syntax in the event you want to match.
   */
  testEventPattern(params: EventBridge.Types.TestEventPatternRequest, callback?: (err: AWSError, data: EventBridge.Types.TestEventPatternResponse) => void): Request<EventBridge.Types.TestEventPatternResponse, AWSError>;
  /**
   * Tests whether the specified event pattern matches the provided event. Most services in Amazon Web Services treat : or / as the same character in Amazon Resource Names (ARNs). However, EventBridge uses an exact match in event patterns and rules. Be sure to use the correct ARN characters when creating event patterns so that they match the ARN syntax in the event you want to match.
   */
  testEventPattern(callback?: (err: AWSError, data: EventBridge.Types.TestEventPatternResponse) => void): Request<EventBridge.Types.TestEventPatternResponse, AWSError>;
  /**
   * Removes one or more tags from the specified EventBridge resource. In Amazon EventBridge (CloudWatch Events), rules and event buses can be tagged.
   */
  untagResource(params: EventBridge.Types.UntagResourceRequest, callback?: (err: AWSError, data: EventBridge.Types.UntagResourceResponse) => void): Request<EventBridge.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified EventBridge resource. In Amazon EventBridge (CloudWatch Events), rules and event buses can be tagged.
   */
  untagResource(callback?: (err: AWSError, data: EventBridge.Types.UntagResourceResponse) => void): Request<EventBridge.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an API destination.
   */
  updateApiDestination(params: EventBridge.Types.UpdateApiDestinationRequest, callback?: (err: AWSError, data: EventBridge.Types.UpdateApiDestinationResponse) => void): Request<EventBridge.Types.UpdateApiDestinationResponse, AWSError>;
  /**
   * Updates an API destination.
   */
  updateApiDestination(callback?: (err: AWSError, data: EventBridge.Types.UpdateApiDestinationResponse) => void): Request<EventBridge.Types.UpdateApiDestinationResponse, AWSError>;
  /**
   * Updates the specified archive.
   */
  updateArchive(params: EventBridge.Types.UpdateArchiveRequest, callback?: (err: AWSError, data: EventBridge.Types.UpdateArchiveResponse) => void): Request<EventBridge.Types.UpdateArchiveResponse, AWSError>;
  /**
   * Updates the specified archive.
   */
  updateArchive(callback?: (err: AWSError, data: EventBridge.Types.UpdateArchiveResponse) => void): Request<EventBridge.Types.UpdateArchiveResponse, AWSError>;
  /**
   * Updates settings for a connection.
   */
  updateConnection(params: EventBridge.Types.UpdateConnectionRequest, callback?: (err: AWSError, data: EventBridge.Types.UpdateConnectionResponse) => void): Request<EventBridge.Types.UpdateConnectionResponse, AWSError>;
  /**
   * Updates settings for a connection.
   */
  updateConnection(callback?: (err: AWSError, data: EventBridge.Types.UpdateConnectionResponse) => void): Request<EventBridge.Types.UpdateConnectionResponse, AWSError>;
}
declare namespace EventBridge {
  export type AccountId = string;
  export type Action = string;
  export interface ActivateEventSourceRequest {
    /**
     * The name of the partner event source to activate.
     */
    Name: EventSourceName;
  }
  export interface ApiDestination {
    /**
     * The ARN of the API destination.
     */
    ApiDestinationArn?: ApiDestinationArn;
    /**
     * The name of the API destination.
     */
    Name?: ApiDestinationName;
    /**
     * The state of the API destination.
     */
    ApiDestinationState?: ApiDestinationState;
    /**
     * The ARN of the connection specified for the API destination.
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The URL to the endpoint for the API destination.
     */
    InvocationEndpoint?: HttpsEndpoint;
    /**
     * The method to use to connect to the HTTP endpoint.
     */
    HttpMethod?: ApiDestinationHttpMethod;
    /**
     * The maximum number of invocations per second to send to the HTTP endpoint.
     */
    InvocationRateLimitPerSecond?: ApiDestinationInvocationRateLimitPerSecond;
    /**
     * A time stamp for the time that the API destination was created.
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp for the time that the API destination was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export type ApiDestinationArn = string;
  export type ApiDestinationDescription = string;
  export type ApiDestinationHttpMethod = "POST"|"GET"|"HEAD"|"OPTIONS"|"PUT"|"PATCH"|"DELETE"|string;
  export type ApiDestinationInvocationRateLimitPerSecond = number;
  export type ApiDestinationName = string;
  export type ApiDestinationResponseList = ApiDestination[];
  export type ApiDestinationState = "ACTIVE"|"INACTIVE"|string;
  export interface Archive {
    /**
     * The name of the archive.
     */
    ArchiveName?: ArchiveName;
    /**
     * The ARN of the event bus associated with the archive. Only events from this event bus are sent to the archive.
     */
    EventSourceArn?: Arn;
    /**
     * The current state of the archive.
     */
    State?: ArchiveState;
    /**
     * A description for the reason that the archive is in the current state.
     */
    StateReason?: ArchiveStateReason;
    /**
     * The number of days to retain events in the archive before they are deleted.
     */
    RetentionDays?: RetentionDays;
    /**
     * The size of the archive, in bytes.
     */
    SizeBytes?: Long;
    /**
     * The number of events in the archive.
     */
    EventCount?: Long;
    /**
     * The time stamp for the time that the archive was created.
     */
    CreationTime?: Timestamp;
  }
  export type ArchiveArn = string;
  export type ArchiveDescription = string;
  export type ArchiveName = string;
  export type ArchiveResponseList = Archive[];
  export type ArchiveState = "ENABLED"|"DISABLED"|"CREATING"|"UPDATING"|"CREATE_FAILED"|"UPDATE_FAILED"|string;
  export type ArchiveStateReason = string;
  export type Arn = string;
  export type AssignPublicIp = "ENABLED"|"DISABLED"|string;
  export type AuthHeaderParameters = string;
  export interface AwsVpcConfiguration {
    /**
     * Specifies the subnets associated with the task. These subnets must all be in the same VPC. You can specify as many as 16 subnets.
     */
    Subnets: StringList;
    /**
     * Specifies the security groups associated with the task. These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
     */
    SecurityGroups?: StringList;
    /**
     * Specifies whether the task's elastic network interface receives a public IP address. You can specify ENABLED only when LaunchType in EcsParameters is set to FARGATE.
     */
    AssignPublicIp?: AssignPublicIp;
  }
  export interface BatchArrayProperties {
    /**
     * The size of the array, if this is an array batch job. Valid values are integers between 2 and 10,000.
     */
    Size?: Integer;
  }
  export interface BatchParameters {
    /**
     * The ARN or name of the job definition to use if the event target is an Batch job. This job definition must already exist.
     */
    JobDefinition: String;
    /**
     * The name to use for this execution of the job, if the target is an Batch job.
     */
    JobName: String;
    /**
     * The array properties for the submitted job, such as the size of the array. The array size can be between 2 and 10,000. If you specify array properties for a job, it becomes an array job. This parameter is used only if the target is an Batch job.
     */
    ArrayProperties?: BatchArrayProperties;
    /**
     * The retry strategy to use for failed jobs, if the target is an Batch job. The retry strategy is the number of times to retry the failed job execution. Valid values are 1–10. When you specify a retry strategy here, it overrides the retry strategy defined in the job definition.
     */
    RetryStrategy?: BatchRetryStrategy;
  }
  export interface BatchRetryStrategy {
    /**
     * The number of times to attempt to retry, if the job fails. Valid values are 1–10.
     */
    Attempts?: Integer;
  }
  export type Boolean = boolean;
  export interface CancelReplayRequest {
    /**
     * The name of the replay to cancel.
     */
    ReplayName: ReplayName;
  }
  export interface CancelReplayResponse {
    /**
     * The ARN of the replay to cancel.
     */
    ReplayArn?: ReplayArn;
    /**
     * The current state of the replay.
     */
    State?: ReplayState;
    /**
     * The reason that the replay is in the current state.
     */
    StateReason?: ReplayStateReason;
  }
  export type CapacityProvider = string;
  export type CapacityProviderStrategy = CapacityProviderStrategyItem[];
  export interface CapacityProviderStrategyItem {
    /**
     * The short name of the capacity provider.
     */
    capacityProvider: CapacityProvider;
    /**
     * The weight value designates the relative percentage of the total number of tasks launched that should use the specified capacity provider. The weight value is taken into consideration after the base value, if defined, is satisfied.
     */
    weight?: CapacityProviderStrategyItemWeight;
    /**
     * The base value designates how many tasks, at a minimum, to run on the specified capacity provider. Only one capacity provider in a capacity provider strategy can have a base defined. If no value is specified, the default value of 0 is used. 
     */
    base?: CapacityProviderStrategyItemBase;
  }
  export type CapacityProviderStrategyItemBase = number;
  export type CapacityProviderStrategyItemWeight = number;
  export interface Condition {
    /**
     * Specifies the type of condition. Currently the only supported value is StringEquals.
     */
    Type: String;
    /**
     * Specifies the key for the condition. Currently the only supported key is aws:PrincipalOrgID.
     */
    Key: String;
    /**
     * Specifies the value for the key. Currently, this must be the ID of the organization.
     */
    Value: String;
  }
  export interface Connection {
    /**
     * The ARN of the connection.
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The name of the connection.
     */
    Name?: ConnectionName;
    /**
     * The state of the connection.
     */
    ConnectionState?: ConnectionState;
    /**
     * The reason that the connection is in the connection state.
     */
    StateReason?: ConnectionStateReason;
    /**
     * The authorization type specified for the connection.
     */
    AuthorizationType?: ConnectionAuthorizationType;
    /**
     * A time stamp for the time that the connection was created.
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp for the time that the connection was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * A time stamp for the time that the connection was last authorized.
     */
    LastAuthorizedTime?: Timestamp;
  }
  export interface ConnectionApiKeyAuthResponseParameters {
    /**
     * The name of the header to use for the APIKeyValue used for authorization.
     */
    ApiKeyName?: AuthHeaderParameters;
  }
  export type ConnectionArn = string;
  export interface ConnectionAuthResponseParameters {
    /**
     * The authorization parameters for Basic authorization.
     */
    BasicAuthParameters?: ConnectionBasicAuthResponseParameters;
    /**
     * The OAuth parameters to use for authorization.
     */
    OAuthParameters?: ConnectionOAuthResponseParameters;
    /**
     * The API Key parameters to use for authorization.
     */
    ApiKeyAuthParameters?: ConnectionApiKeyAuthResponseParameters;
    /**
     * Additional parameters for the connection that are passed through with every invocation to the HTTP endpoint.
     */
    InvocationHttpParameters?: ConnectionHttpParameters;
  }
  export type ConnectionAuthorizationType = "BASIC"|"OAUTH_CLIENT_CREDENTIALS"|"API_KEY"|string;
  export interface ConnectionBasicAuthResponseParameters {
    /**
     * The user name to use for Basic authorization.
     */
    Username?: AuthHeaderParameters;
  }
  export interface ConnectionBodyParameter {
    /**
     * The key for the parameter.
     */
    Key?: String;
    /**
     * The value associated with the key.
     */
    Value?: String;
    /**
     * Specified whether the value is secret.
     */
    IsValueSecret?: Boolean;
  }
  export type ConnectionBodyParametersList = ConnectionBodyParameter[];
  export type ConnectionDescription = string;
  export interface ConnectionHeaderParameter {
    /**
     * The key for the parameter.
     */
    Key?: HeaderKey;
    /**
     * The value associated with the key.
     */
    Value?: HeaderValue;
    /**
     * Specified whether the value is a secret.
     */
    IsValueSecret?: Boolean;
  }
  export type ConnectionHeaderParametersList = ConnectionHeaderParameter[];
  export interface ConnectionHttpParameters {
    /**
     * Contains additional header parameters for the connection.
     */
    HeaderParameters?: ConnectionHeaderParametersList;
    /**
     * Contains additional query string parameters for the connection.
     */
    QueryStringParameters?: ConnectionQueryStringParametersList;
    /**
     * Contains additional body string parameters for the connection.
     */
    BodyParameters?: ConnectionBodyParametersList;
  }
  export type ConnectionName = string;
  export interface ConnectionOAuthClientResponseParameters {
    /**
     * The client ID associated with the response to the connection request.
     */
    ClientID?: AuthHeaderParameters;
  }
  export type ConnectionOAuthHttpMethod = "GET"|"POST"|"PUT"|string;
  export interface ConnectionOAuthResponseParameters {
    /**
     * A ConnectionOAuthClientResponseParameters object that contains details about the client parameters returned when OAuth is specified as the authorization type.
     */
    ClientParameters?: ConnectionOAuthClientResponseParameters;
    /**
     * The URL to the HTTP endpoint that authorized the request.
     */
    AuthorizationEndpoint?: HttpsEndpoint;
    /**
     * The method used to connect to the HTTP endpoint.
     */
    HttpMethod?: ConnectionOAuthHttpMethod;
    /**
     * The additional HTTP parameters used for the OAuth authorization request.
     */
    OAuthHttpParameters?: ConnectionHttpParameters;
  }
  export interface ConnectionQueryStringParameter {
    /**
     * The key for a query string parameter.
     */
    Key?: QueryStringKey;
    /**
     * The value associated with the key for the query string parameter.
     */
    Value?: QueryStringValue;
    /**
     * Specifies whether the value is secret.
     */
    IsValueSecret?: Boolean;
  }
  export type ConnectionQueryStringParametersList = ConnectionQueryStringParameter[];
  export type ConnectionResponseList = Connection[];
  export type ConnectionState = "CREATING"|"UPDATING"|"DELETING"|"AUTHORIZED"|"DEAUTHORIZED"|"AUTHORIZING"|"DEAUTHORIZING"|string;
  export type ConnectionStateReason = string;
  export interface CreateApiDestinationRequest {
    /**
     * The name for the API destination to create.
     */
    Name: ApiDestinationName;
    /**
     * A description for the API destination to create.
     */
    Description?: ApiDestinationDescription;
    /**
     * The ARN of the connection to use for the API destination. The destination endpoint must support the authorization type specified for the connection.
     */
    ConnectionArn: ConnectionArn;
    /**
     * The URL to the HTTP invocation endpoint for the API destination.
     */
    InvocationEndpoint: HttpsEndpoint;
    /**
     * The method to use for the request to the HTTP invocation endpoint.
     */
    HttpMethod: ApiDestinationHttpMethod;
    /**
     * The maximum number of requests per second to send to the HTTP invocation endpoint.
     */
    InvocationRateLimitPerSecond?: ApiDestinationInvocationRateLimitPerSecond;
  }
  export interface CreateApiDestinationResponse {
    /**
     * The ARN of the API destination that was created by the request.
     */
    ApiDestinationArn?: ApiDestinationArn;
    /**
     * The state of the API destination that was created by the request.
     */
    ApiDestinationState?: ApiDestinationState;
    /**
     * A time stamp indicating the time that the API destination was created.
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp indicating the time that the API destination was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export interface CreateArchiveRequest {
    /**
     * The name for the archive to create.
     */
    ArchiveName: ArchiveName;
    /**
     * The ARN of the event bus that sends events to the archive.
     */
    EventSourceArn: Arn;
    /**
     * A description for the archive.
     */
    Description?: ArchiveDescription;
    /**
     * An event pattern to use to filter events sent to the archive.
     */
    EventPattern?: EventPattern;
    /**
     * The number of days to retain events for. Default value is 0. If set to 0, events are retained indefinitely
     */
    RetentionDays?: RetentionDays;
  }
  export interface CreateArchiveResponse {
    /**
     * The ARN of the archive that was created.
     */
    ArchiveArn?: ArchiveArn;
    /**
     * The state of the archive that was created.
     */
    State?: ArchiveState;
    /**
     * The reason that the archive is in the state.
     */
    StateReason?: ArchiveStateReason;
    /**
     * The time at which the archive was created.
     */
    CreationTime?: Timestamp;
  }
  export interface CreateConnectionApiKeyAuthRequestParameters {
    /**
     * The name of the API key to use for authorization.
     */
    ApiKeyName: AuthHeaderParameters;
    /**
     * The value for the API key to use for authorization.
     */
    ApiKeyValue: AuthHeaderParameters;
  }
  export interface CreateConnectionAuthRequestParameters {
    /**
     * A CreateConnectionBasicAuthRequestParameters object that contains the Basic authorization parameters to use for the connection.
     */
    BasicAuthParameters?: CreateConnectionBasicAuthRequestParameters;
    /**
     * A CreateConnectionOAuthRequestParameters object that contains the OAuth authorization parameters to use for the connection.
     */
    OAuthParameters?: CreateConnectionOAuthRequestParameters;
    /**
     * A CreateConnectionApiKeyAuthRequestParameters object that contains the API key authorization parameters to use for the connection.
     */
    ApiKeyAuthParameters?: CreateConnectionApiKeyAuthRequestParameters;
    /**
     * A ConnectionHttpParameters object that contains the API key authorization parameters to use for the connection. Note that if you include additional parameters for the target of a rule via HttpParameters, including query strings, the parameters added for the connection take precedence.
     */
    InvocationHttpParameters?: ConnectionHttpParameters;
  }
  export interface CreateConnectionBasicAuthRequestParameters {
    /**
     * The user name to use for Basic authorization.
     */
    Username: AuthHeaderParameters;
    /**
     * The password associated with the user name to use for Basic authorization.
     */
    Password: AuthHeaderParameters;
  }
  export interface CreateConnectionOAuthClientRequestParameters {
    /**
     * The client ID to use for OAuth authorization for the connection.
     */
    ClientID: AuthHeaderParameters;
    /**
     * The client secret associated with the client ID to use for OAuth authorization for the connection.
     */
    ClientSecret: AuthHeaderParameters;
  }
  export interface CreateConnectionOAuthRequestParameters {
    /**
     * A CreateConnectionOAuthClientRequestParameters object that contains the client parameters for OAuth authorization.
     */
    ClientParameters: CreateConnectionOAuthClientRequestParameters;
    /**
     * The URL to the authorization endpoint when OAuth is specified as the authorization type.
     */
    AuthorizationEndpoint: HttpsEndpoint;
    /**
     * The method to use for the authorization request.
     */
    HttpMethod: ConnectionOAuthHttpMethod;
    /**
     * A ConnectionHttpParameters object that contains details about the additional parameters to use for the connection.
     */
    OAuthHttpParameters?: ConnectionHttpParameters;
  }
  export interface CreateConnectionRequest {
    /**
     * The name for the connection to create.
     */
    Name: ConnectionName;
    /**
     * A description for the connection to create.
     */
    Description?: ConnectionDescription;
    /**
     * The type of authorization to use for the connection.
     */
    AuthorizationType: ConnectionAuthorizationType;
    /**
     * A CreateConnectionAuthRequestParameters object that contains the authorization parameters to use to authorize with the endpoint. 
     */
    AuthParameters: CreateConnectionAuthRequestParameters;
  }
  export interface CreateConnectionResponse {
    /**
     * The ARN of the connection that was created by the request.
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The state of the connection that was created by the request.
     */
    ConnectionState?: ConnectionState;
    /**
     * A time stamp for the time that the connection was created.
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp for the time that the connection was last updated.
     */
    LastModifiedTime?: Timestamp;
  }
  export interface CreateEventBusRequest {
    /**
     * The name of the new event bus.  Event bus names cannot contain the / character. You can't use the name default for a custom event bus, as this name is already used for your account's default event bus. If this is a partner event bus, the name must exactly match the name of the partner event source that this event bus is matched to.
     */
    Name: EventBusName;
    /**
     * If you are creating a partner event bus, this specifies the partner event source that the new event bus will be matched with.
     */
    EventSourceName?: EventSourceName;
    /**
     * Tags to associate with the event bus.
     */
    Tags?: TagList;
  }
  export interface CreateEventBusResponse {
    /**
     * The ARN of the new event bus.
     */
    EventBusArn?: String;
  }
  export interface CreatePartnerEventSourceRequest {
    /**
     * The name of the partner event source. This name must be unique and must be in the format  partner_name/event_namespace/event_name . The Amazon Web Services account that wants to use this partner event source must create a partner event bus with a name that matches the name of the partner event source.
     */
    Name: EventSourceName;
    /**
     * The Amazon Web Services account ID that is permitted to create a matching partner event bus for this partner event source.
     */
    Account: AccountId;
  }
  export interface CreatePartnerEventSourceResponse {
    /**
     * The ARN of the partner event source.
     */
    EventSourceArn?: String;
  }
  export type CreatedBy = string;
  export type Database = string;
  export type DbUser = string;
  export interface DeactivateEventSourceRequest {
    /**
     * The name of the partner event source to deactivate.
     */
    Name: EventSourceName;
  }
  export interface DeadLetterConfig {
    /**
     * The ARN of the SQS queue specified as the target for the dead-letter queue.
     */
    Arn?: ResourceArn;
  }
  export interface DeauthorizeConnectionRequest {
    /**
     * The name of the connection to remove authorization from.
     */
    Name: ConnectionName;
  }
  export interface DeauthorizeConnectionResponse {
    /**
     * The ARN of the connection that authorization was removed from.
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The state of the connection.
     */
    ConnectionState?: ConnectionState;
    /**
     * A time stamp for the time that the connection was created.
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp for the time that the connection was last updated.
     */
    LastModifiedTime?: Timestamp;
    /**
     * A time stamp for the time that the connection was last authorized.
     */
    LastAuthorizedTime?: Timestamp;
  }
  export interface DeleteApiDestinationRequest {
    /**
     * The name of the destination to delete.
     */
    Name: ApiDestinationName;
  }
  export interface DeleteApiDestinationResponse {
  }
  export interface DeleteArchiveRequest {
    /**
     * The name of the archive to delete.
     */
    ArchiveName: ArchiveName;
  }
  export interface DeleteArchiveResponse {
  }
  export interface DeleteConnectionRequest {
    /**
     * The name of the connection to delete.
     */
    Name: ConnectionName;
  }
  export interface DeleteConnectionResponse {
    /**
     * The ARN of the connection that was deleted.
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The state of the connection before it was deleted.
     */
    ConnectionState?: ConnectionState;
    /**
     * A time stamp for the time that the connection was created.
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp for the time that the connection was last modified before it was deleted.
     */
    LastModifiedTime?: Timestamp;
    /**
     * A time stamp for the time that the connection was last authorized before it wa deleted.
     */
    LastAuthorizedTime?: Timestamp;
  }
  export interface DeleteEventBusRequest {
    /**
     * The name of the event bus to delete.
     */
    Name: EventBusName;
  }
  export interface DeletePartnerEventSourceRequest {
    /**
     * The name of the event source to delete.
     */
    Name: EventSourceName;
    /**
     * The Amazon Web Services account ID of the Amazon Web Services customer that the event source was created for.
     */
    Account: AccountId;
  }
  export interface DeleteRuleRequest {
    /**
     * The name of the rule.
     */
    Name: RuleName;
    /**
     * The name or ARN of the event bus associated with the rule. If you omit this, the default event bus is used.
     */
    EventBusName?: EventBusNameOrArn;
    /**
     * If this is a managed rule, created by an Amazon Web Services service on your behalf, you must specify Force as True to delete the rule. This parameter is ignored for rules that are not managed rules. You can check whether a rule is a managed rule by using DescribeRule or ListRules and checking the ManagedBy field of the response.
     */
    Force?: Boolean;
  }
  export interface DescribeApiDestinationRequest {
    /**
     * The name of the API destination to retrieve.
     */
    Name: ApiDestinationName;
  }
  export interface DescribeApiDestinationResponse {
    /**
     * The ARN of the API destination retrieved.
     */
    ApiDestinationArn?: ApiDestinationArn;
    /**
     * The name of the API destination retrieved.
     */
    Name?: ApiDestinationName;
    /**
     * The description for the API destination retrieved.
     */
    Description?: ApiDestinationDescription;
    /**
     * The state of the API destination retrieved.
     */
    ApiDestinationState?: ApiDestinationState;
    /**
     * The ARN of the connection specified for the API destination retrieved.
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The URL to use to connect to the HTTP endpoint.
     */
    InvocationEndpoint?: HttpsEndpoint;
    /**
     * The method to use to connect to the HTTP endpoint.
     */
    HttpMethod?: ApiDestinationHttpMethod;
    /**
     * The maximum number of invocations per second to specified for the API destination. Note that if you set the invocation rate maximum to a value lower the rate necessary to send all events received on to the destination HTTP endpoint, some events may not be delivered within the 24-hour retry window. If you plan to set the rate lower than the rate necessary to deliver all events, consider using a dead-letter queue to catch events that are not delivered within 24 hours.
     */
    InvocationRateLimitPerSecond?: ApiDestinationInvocationRateLimitPerSecond;
    /**
     * A time stamp for the time that the API destination was created.
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp for the time that the API destination was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export interface DescribeArchiveRequest {
    /**
     * The name of the archive to retrieve.
     */
    ArchiveName: ArchiveName;
  }
  export interface DescribeArchiveResponse {
    /**
     * The ARN of the archive.
     */
    ArchiveArn?: ArchiveArn;
    /**
     * The name of the archive.
     */
    ArchiveName?: ArchiveName;
    /**
     * The ARN of the event source associated with the archive.
     */
    EventSourceArn?: Arn;
    /**
     * The description of the archive.
     */
    Description?: ArchiveDescription;
    /**
     * The event pattern used to filter events sent to the archive.
     */
    EventPattern?: EventPattern;
    /**
     * The state of the archive.
     */
    State?: ArchiveState;
    /**
     * The reason that the archive is in the state.
     */
    StateReason?: ArchiveStateReason;
    /**
     * The number of days to retain events for in the archive.
     */
    RetentionDays?: RetentionDays;
    /**
     * The size of the archive in bytes.
     */
    SizeBytes?: Long;
    /**
     * The number of events in the archive.
     */
    EventCount?: Long;
    /**
     * The time at which the archive was created.
     */
    CreationTime?: Timestamp;
  }
  export interface DescribeConnectionRequest {
    /**
     * The name of the connection to retrieve.
     */
    Name: ConnectionName;
  }
  export interface DescribeConnectionResponse {
    /**
     * The ARN of the connection retrieved.
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The name of the connection retrieved.
     */
    Name?: ConnectionName;
    /**
     * The description for the connection retrieved.
     */
    Description?: ConnectionDescription;
    /**
     * The state of the connection retrieved.
     */
    ConnectionState?: ConnectionState;
    /**
     * The reason that the connection is in the current connection state.
     */
    StateReason?: ConnectionStateReason;
    /**
     * The type of authorization specified for the connection.
     */
    AuthorizationType?: ConnectionAuthorizationType;
    /**
     * The ARN of the secret created from the authorization parameters specified for the connection.
     */
    SecretArn?: SecretsManagerSecretArn;
    /**
     * The parameters to use for authorization for the connection.
     */
    AuthParameters?: ConnectionAuthResponseParameters;
    /**
     * A time stamp for the time that the connection was created.
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp for the time that the connection was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * A time stamp for the time that the connection was last authorized.
     */
    LastAuthorizedTime?: Timestamp;
  }
  export interface DescribeEventBusRequest {
    /**
     * The name or ARN of the event bus to show details for. If you omit this, the default event bus is displayed.
     */
    Name?: EventBusNameOrArn;
  }
  export interface DescribeEventBusResponse {
    /**
     * The name of the event bus. Currently, this is always default.
     */
    Name?: String;
    /**
     * The Amazon Resource Name (ARN) of the account permitted to write events to the current account.
     */
    Arn?: String;
    /**
     * The policy that enables the external account to send events to your account.
     */
    Policy?: String;
  }
  export interface DescribeEventSourceRequest {
    /**
     * The name of the partner event source to display the details of.
     */
    Name: EventSourceName;
  }
  export interface DescribeEventSourceResponse {
    /**
     * The ARN of the partner event source.
     */
    Arn?: String;
    /**
     * The name of the SaaS partner that created the event source.
     */
    CreatedBy?: String;
    /**
     * The date and time that the event source was created.
     */
    CreationTime?: Timestamp;
    /**
     * The date and time that the event source will expire if you do not create a matching event bus.
     */
    ExpirationTime?: Timestamp;
    /**
     * The name of the partner event source.
     */
    Name?: String;
    /**
     * The state of the event source. If it is ACTIVE, you have already created a matching event bus for this event source, and that event bus is active. If it is PENDING, either you haven't yet created a matching event bus, or that event bus is deactivated. If it is DELETED, you have created a matching event bus, but the event source has since been deleted.
     */
    State?: EventSourceState;
  }
  export interface DescribePartnerEventSourceRequest {
    /**
     * The name of the event source to display.
     */
    Name: EventSourceName;
  }
  export interface DescribePartnerEventSourceResponse {
    /**
     * The ARN of the event source.
     */
    Arn?: String;
    /**
     * The name of the event source.
     */
    Name?: String;
  }
  export interface DescribeReplayRequest {
    /**
     * The name of the replay to retrieve.
     */
    ReplayName: ReplayName;
  }
  export interface DescribeReplayResponse {
    /**
     * The name of the replay.
     */
    ReplayName?: ReplayName;
    /**
     * The ARN of the replay.
     */
    ReplayArn?: ReplayArn;
    /**
     * The description of the replay.
     */
    Description?: ReplayDescription;
    /**
     * The current state of the replay.
     */
    State?: ReplayState;
    /**
     * The reason that the replay is in the current state.
     */
    StateReason?: ReplayStateReason;
    /**
     * The ARN of the archive events were replayed from.
     */
    EventSourceArn?: Arn;
    /**
     * A ReplayDestination object that contains details about the replay.
     */
    Destination?: ReplayDestination;
    /**
     * The time stamp of the first event that was last replayed from the archive.
     */
    EventStartTime?: Timestamp;
    /**
     * The time stamp for the last event that was replayed from the archive.
     */
    EventEndTime?: Timestamp;
    /**
     * The time that the event was last replayed.
     */
    EventLastReplayedTime?: Timestamp;
    /**
     * A time stamp for the time that the replay started.
     */
    ReplayStartTime?: Timestamp;
    /**
     * A time stamp for the time that the replay stopped.
     */
    ReplayEndTime?: Timestamp;
  }
  export interface DescribeRuleRequest {
    /**
     * The name of the rule.
     */
    Name: RuleName;
    /**
     * The name or ARN of the event bus associated with the rule. If you omit this, the default event bus is used.
     */
    EventBusName?: EventBusNameOrArn;
  }
  export interface DescribeRuleResponse {
    /**
     * The name of the rule.
     */
    Name?: RuleName;
    /**
     * The Amazon Resource Name (ARN) of the rule.
     */
    Arn?: RuleArn;
    /**
     * The event pattern. For more information, see Events and Event Patterns in the Amazon EventBridge User Guide.
     */
    EventPattern?: EventPattern;
    /**
     * The scheduling expression. For example, "cron(0 20 * * ? *)", "rate(5 minutes)".
     */
    ScheduleExpression?: ScheduleExpression;
    /**
     * Specifies whether the rule is enabled or disabled.
     */
    State?: RuleState;
    /**
     * The description of the rule.
     */
    Description?: RuleDescription;
    /**
     * The Amazon Resource Name (ARN) of the IAM role associated with the rule.
     */
    RoleArn?: RoleArn;
    /**
     * If this is a managed rule, created by an Amazon Web Services service on your behalf, this field displays the principal name of the Amazon Web Services service that created the rule.
     */
    ManagedBy?: ManagedBy;
    /**
     * The name of the event bus associated with the rule.
     */
    EventBusName?: EventBusName;
    /**
     * The account ID of the user that created the rule. If you use PutRule to put a rule on an event bus in another account, the other account is the owner of the rule, and the rule ARN includes the account ID for that account. However, the value for CreatedBy is the account ID as the account that created the rule in the other account.
     */
    CreatedBy?: CreatedBy;
  }
  export interface DisableRuleRequest {
    /**
     * The name of the rule.
     */
    Name: RuleName;
    /**
     * The name or ARN of the event bus associated with the rule. If you omit this, the default event bus is used.
     */
    EventBusName?: EventBusNameOrArn;
  }
  export interface EcsParameters {
    /**
     * The ARN of the task definition to use if the event target is an Amazon ECS task. 
     */
    TaskDefinitionArn: Arn;
    /**
     * The number of tasks to create based on TaskDefinition. The default is 1.
     */
    TaskCount?: LimitMin1;
    /**
     * Specifies the launch type on which your task is running. The launch type that you specify here must match one of the launch type (compatibilities) of the target task. The FARGATE value is supported only in the Regions where Fargate witt Amazon ECS is supported. For more information, see Fargate on Amazon ECS in the Amazon Elastic Container Service Developer Guide.
     */
    LaunchType?: LaunchType;
    /**
     * Use this structure if the Amazon ECS task uses the awsvpc network mode. This structure specifies the VPC subnets and security groups associated with the task, and whether a public IP address is to be used. This structure is required if LaunchType is FARGATE because the awsvpc mode is required for Fargate tasks. If you specify NetworkConfiguration when the target ECS task does not use the awsvpc network mode, the task fails.
     */
    NetworkConfiguration?: NetworkConfiguration;
    /**
     * Specifies the platform version for the task. Specify only the numeric portion of the platform version, such as 1.1.0. This structure is used only if LaunchType is FARGATE. For more information about valid platform versions, see Fargate Platform Versions in the Amazon Elastic Container Service Developer Guide.
     */
    PlatformVersion?: String;
    /**
     * Specifies an ECS task group for the task. The maximum length is 255 characters.
     */
    Group?: String;
    /**
     * The capacity provider strategy to use for the task. If a capacityProviderStrategy is specified, the launchType parameter must be omitted. If no capacityProviderStrategy or launchType is specified, the defaultCapacityProviderStrategy for the cluster is used. 
     */
    CapacityProviderStrategy?: CapacityProviderStrategy;
    /**
     * Specifies whether to enable Amazon ECS managed tags for the task. For more information, see Tagging Your Amazon ECS Resources in the Amazon Elastic Container Service Developer Guide. 
     */
    EnableECSManagedTags?: Boolean;
    /**
     * Whether or not to enable the execute command functionality for the containers in this task. If true, this enables execute command functionality on all containers in the task.
     */
    EnableExecuteCommand?: Boolean;
    /**
     * An array of placement constraint objects to use for the task. You can specify up to 10 constraints per task (including constraints in the task definition and those specified at runtime).
     */
    PlacementConstraints?: PlacementConstraints;
    /**
     * The placement strategy objects to use for the task. You can specify a maximum of five strategy rules per task. 
     */
    PlacementStrategy?: PlacementStrategies;
    /**
     * Specifies whether to propagate the tags from the task definition to the task. If no value is specified, the tags are not propagated. Tags can only be propagated to the task during task creation. To add tags to a task after task creation, use the TagResource API action. 
     */
    PropagateTags?: PropagateTags;
    /**
     * The reference ID to use for the task.
     */
    ReferenceId?: ReferenceId;
    /**
     * The metadata that you apply to the task to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. To learn more, see RunTask in the Amazon ECS API Reference.
     */
    Tags?: TagList;
  }
  export interface EnableRuleRequest {
    /**
     * The name of the rule.
     */
    Name: RuleName;
    /**
     * The name or ARN of the event bus associated with the rule. If you omit this, the default event bus is used.
     */
    EventBusName?: EventBusNameOrArn;
  }
  export type ErrorCode = string;
  export type ErrorMessage = string;
  export interface EventBus {
    /**
     * The name of the event bus.
     */
    Name?: String;
    /**
     * The ARN of the event bus.
     */
    Arn?: String;
    /**
     * The permissions policy of the event bus, describing which other Amazon Web Services accounts can write events to this event bus.
     */
    Policy?: String;
  }
  export type EventBusList = EventBus[];
  export type EventBusName = string;
  export type EventBusNameOrArn = string;
  export type EventId = string;
  export type EventPattern = string;
  export type EventResource = string;
  export type EventResourceList = EventResource[];
  export interface EventSource {
    /**
     * The ARN of the event source.
     */
    Arn?: String;
    /**
     * The name of the partner that created the event source.
     */
    CreatedBy?: String;
    /**
     * The date and time the event source was created.
     */
    CreationTime?: Timestamp;
    /**
     * The date and time that the event source will expire, if the Amazon Web Services account doesn't create a matching event bus for it.
     */
    ExpirationTime?: Timestamp;
    /**
     * The name of the event source.
     */
    Name?: String;
    /**
     * The state of the event source. If it is ACTIVE, you have already created a matching event bus for this event source, and that event bus is active. If it is PENDING, either you haven't yet created a matching event bus, or that event bus is deactivated. If it is DELETED, you have created a matching event bus, but the event source has since been deleted.
     */
    State?: EventSourceState;
  }
  export type EventSourceList = EventSource[];
  export type EventSourceName = string;
  export type EventSourceNamePrefix = string;
  export type EventSourceState = "PENDING"|"ACTIVE"|"DELETED"|string;
  export type EventTime = Date;
  export type HeaderKey = string;
  export type HeaderParametersMap = {[key: string]: HeaderValue};
  export type HeaderValue = string;
  export interface HttpParameters {
    /**
     * The path parameter values to be used to populate API Gateway REST API or EventBridge ApiDestination path wildcards ("*").
     */
    PathParameterValues?: PathParameterList;
    /**
     * The headers that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
     */
    HeaderParameters?: HeaderParametersMap;
    /**
     * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
     */
    QueryStringParameters?: QueryStringParametersMap;
  }
  export type HttpsEndpoint = string;
  export interface InputTransformer {
    /**
     * Map of JSON paths to be extracted from the event. You can then insert these in the template in InputTemplate to produce the output you want to be sent to the target.  InputPathsMap is an array key-value pairs, where each value is a valid JSON path. You can have as many as 100 key-value pairs. You must use JSON dot notation, not bracket notation. The keys cannot start with "Amazon Web Services." 
     */
    InputPathsMap?: TransformerPaths;
    /**
     * Input template where you specify placeholders that will be filled with the values of the keys from InputPathsMap to customize the data sent to the target. Enclose each InputPathsMaps value in brackets: &lt;value&gt; The InputTemplate must be valid JSON. If InputTemplate is a JSON object (surrounded by curly braces), the following restrictions apply:   The placeholder cannot be used as an object key.   The following example shows the syntax for using InputPathsMap and InputTemplate.   "InputTransformer":   {   "InputPathsMap": {"instance": "$.detail.instance","status": "$.detail.status"},   "InputTemplate": "&lt;instance&gt; is in state &lt;status&gt;"   }  To have the InputTemplate include quote marks within a JSON string, escape each quote marks with a slash, as in the following example:   "InputTransformer":   {   "InputPathsMap": {"instance": "$.detail.instance","status": "$.detail.status"},   "InputTemplate": "&lt;instance&gt; is in state \"&lt;status&gt;\""   }  The InputTemplate can also be valid JSON with varibles in quotes or out, as in the following example:   "InputTransformer":   {   "InputPathsMap": {"instance": "$.detail.instance","status": "$.detail.status"},   "InputTemplate": '{"myInstance": &lt;instance&gt;,"myStatus": "&lt;instance&gt; is in state \"&lt;status&gt;\""}'   } 
     */
    InputTemplate: TransformerInput;
  }
  export type InputTransformerPathKey = string;
  export type Integer = number;
  export interface KinesisParameters {
    /**
     * The JSON path to be extracted from the event and used as the partition key. For more information, see Amazon Kinesis Streams Key Concepts in the Amazon Kinesis Streams Developer Guide.
     */
    PartitionKeyPath: TargetPartitionKeyPath;
  }
  export type LaunchType = "EC2"|"FARGATE"|"EXTERNAL"|string;
  export type LimitMax100 = number;
  export type LimitMin1 = number;
  export interface ListApiDestinationsRequest {
    /**
     * A name prefix to filter results returned. Only API destinations with a name that starts with the prefix are returned.
     */
    NamePrefix?: ApiDestinationName;
    /**
     * The ARN of the connection specified for the API destination.
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of API destinations to include in the response.
     */
    Limit?: LimitMax100;
  }
  export interface ListApiDestinationsResponse {
    /**
     * An array of ApiDestination objects that include information about an API destination.
     */
    ApiDestinations?: ApiDestinationResponseList;
    /**
     * A token you can use in a subsequent request to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListArchivesRequest {
    /**
     * A name prefix to filter the archives returned. Only archives with name that match the prefix are returned.
     */
    NamePrefix?: ArchiveName;
    /**
     * The ARN of the event source associated with the archive.
     */
    EventSourceArn?: Arn;
    /**
     * The state of the archive.
     */
    State?: ArchiveState;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return.
     */
    Limit?: LimitMax100;
  }
  export interface ListArchivesResponse {
    /**
     * An array of Archive objects that include details about an archive.
     */
    Archives?: ArchiveResponseList;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListConnectionsRequest {
    /**
     * A name prefix to filter results returned. Only connections with a name that starts with the prefix are returned.
     */
    NamePrefix?: ConnectionName;
    /**
     * The state of the connection.
     */
    ConnectionState?: ConnectionState;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of connections to return.
     */
    Limit?: LimitMax100;
  }
  export interface ListConnectionsResponse {
    /**
     * An array of connections objects that include details about the connections.
     */
    Connections?: ConnectionResponseList;
    /**
     * A token you can use in a subsequent request to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListEventBusesRequest {
    /**
     * Specifying this limits the results to only those event buses with names that start with the specified prefix.
     */
    NamePrefix?: EventBusName;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * Specifying this limits the number of results returned by this operation. The operation also returns a NextToken which you can use in a subsequent operation to retrieve the next set of results.
     */
    Limit?: LimitMax100;
  }
  export interface ListEventBusesResponse {
    /**
     * This list of event buses.
     */
    EventBuses?: EventBusList;
    /**
     * A token you can use in a subsequent operation to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListEventSourcesRequest {
    /**
     * Specifying this limits the results to only those partner event sources with names that start with the specified prefix.
     */
    NamePrefix?: EventSourceNamePrefix;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * Specifying this limits the number of results returned by this operation. The operation also returns a NextToken which you can use in a subsequent operation to retrieve the next set of results.
     */
    Limit?: LimitMax100;
  }
  export interface ListEventSourcesResponse {
    /**
     * The list of event sources.
     */
    EventSources?: EventSourceList;
    /**
     * A token you can use in a subsequent operation to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListPartnerEventSourceAccountsRequest {
    /**
     * The name of the partner event source to display account information about.
     */
    EventSourceName: EventSourceName;
    /**
     * The token returned by a previous call to this operation. Specifying this retrieves the next set of results.
     */
    NextToken?: NextToken;
    /**
     * Specifying this limits the number of results returned by this operation. The operation also returns a NextToken which you can use in a subsequent operation to retrieve the next set of results.
     */
    Limit?: LimitMax100;
  }
  export interface ListPartnerEventSourceAccountsResponse {
    /**
     * The list of partner event sources returned by the operation.
     */
    PartnerEventSourceAccounts?: PartnerEventSourceAccountList;
    /**
     * A token you can use in a subsequent operation to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListPartnerEventSourcesRequest {
    /**
     * If you specify this, the results are limited to only those partner event sources that start with the string you specify.
     */
    NamePrefix: PartnerEventSourceNamePrefix;
    /**
     * The token returned by a previous call to this operation. Specifying this retrieves the next set of results.
     */
    NextToken?: NextToken;
    /**
     * pecifying this limits the number of results returned by this operation. The operation also returns a NextToken which you can use in a subsequent operation to retrieve the next set of results.
     */
    Limit?: LimitMax100;
  }
  export interface ListPartnerEventSourcesResponse {
    /**
     * The list of partner event sources returned by the operation.
     */
    PartnerEventSources?: PartnerEventSourceList;
    /**
     * A token you can use in a subsequent operation to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListReplaysRequest {
    /**
     * A name prefix to filter the replays returned. Only replays with name that match the prefix are returned.
     */
    NamePrefix?: ReplayName;
    /**
     * The state of the replay.
     */
    State?: ReplayState;
    /**
     * The ARN of the archive from which the events are replayed.
     */
    EventSourceArn?: Arn;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of replays to retrieve.
     */
    Limit?: LimitMax100;
  }
  export interface ListReplaysResponse {
    /**
     * An array of Replay objects that contain information about the replay.
     */
    Replays?: ReplayList;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListRuleNamesByTargetRequest {
    /**
     * The Amazon Resource Name (ARN) of the target resource.
     */
    TargetArn: TargetArn;
    /**
     * The name or ARN of the event bus to list rules for. If you omit this, the default event bus is used.
     */
    EventBusName?: EventBusNameOrArn;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return.
     */
    Limit?: LimitMax100;
  }
  export interface ListRuleNamesByTargetResponse {
    /**
     * The names of the rules that can invoke the given target.
     */
    RuleNames?: RuleNameList;
    /**
     * Indicates whether there are additional results to retrieve. If there are no more results, the value is null.
     */
    NextToken?: NextToken;
  }
  export interface ListRulesRequest {
    /**
     * The prefix matching the rule name.
     */
    NamePrefix?: RuleName;
    /**
     * The name or ARN of the event bus to list the rules for. If you omit this, the default event bus is used.
     */
    EventBusName?: EventBusNameOrArn;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return.
     */
    Limit?: LimitMax100;
  }
  export interface ListRulesResponse {
    /**
     * The rules that match the specified criteria.
     */
    Rules?: RuleResponseList;
    /**
     * Indicates whether there are additional results to retrieve. If there are no more results, the value is null.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the EventBridge resource for which you want to view tags.
     */
    ResourceARN: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of tag keys and values associated with the resource you specified
     */
    Tags?: TagList;
  }
  export interface ListTargetsByRuleRequest {
    /**
     * The name of the rule.
     */
    Rule: RuleName;
    /**
     * The name or ARN of the event bus associated with the rule. If you omit this, the default event bus is used.
     */
    EventBusName?: EventBusNameOrArn;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return.
     */
    Limit?: LimitMax100;
  }
  export interface ListTargetsByRuleResponse {
    /**
     * The targets assigned to the rule.
     */
    Targets?: TargetList;
    /**
     * Indicates whether there are additional results to retrieve. If there are no more results, the value is null.
     */
    NextToken?: NextToken;
  }
  export type Long = number;
  export type ManagedBy = string;
  export type MaximumEventAgeInSeconds = number;
  export type MaximumRetryAttempts = number;
  export type MessageGroupId = string;
  export interface NetworkConfiguration {
    /**
     * Use this structure to specify the VPC subnets and security groups for the task, and whether a public IP address is to be used. This structure is relevant only for ECS tasks that use the awsvpc network mode.
     */
    awsvpcConfiguration?: AwsVpcConfiguration;
  }
  export type NextToken = string;
  export type NonPartnerEventBusName = string;
  export type NonPartnerEventBusNameOrArn = string;
  export interface PartnerEventSource {
    /**
     * The ARN of the partner event source.
     */
    Arn?: String;
    /**
     * The name of the partner event source.
     */
    Name?: String;
  }
  export interface PartnerEventSourceAccount {
    /**
     * The Amazon Web Services account ID that the partner event source was offered to.
     */
    Account?: AccountId;
    /**
     * The date and time the event source was created.
     */
    CreationTime?: Timestamp;
    /**
     * The date and time that the event source will expire, if the Amazon Web Services account doesn't create a matching event bus for it.
     */
    ExpirationTime?: Timestamp;
    /**
     * The state of the event source. If it is ACTIVE, you have already created a matching event bus for this event source, and that event bus is active. If it is PENDING, either you haven't yet created a matching event bus, or that event bus is deactivated. If it is DELETED, you have created a matching event bus, but the event source has since been deleted.
     */
    State?: EventSourceState;
  }
  export type PartnerEventSourceAccountList = PartnerEventSourceAccount[];
  export type PartnerEventSourceList = PartnerEventSource[];
  export type PartnerEventSourceNamePrefix = string;
  export type PathParameter = string;
  export type PathParameterList = PathParameter[];
  export interface PlacementConstraint {
    /**
     * The type of constraint. Use distinctInstance to ensure that each task in a particular group is running on a different container instance. Use memberOf to restrict the selection to a group of valid candidates. 
     */
    type?: PlacementConstraintType;
    /**
     * A cluster query language expression to apply to the constraint. You cannot specify an expression if the constraint type is distinctInstance. To learn more, see Cluster Query Language in the Amazon Elastic Container Service Developer Guide. 
     */
    expression?: PlacementConstraintExpression;
  }
  export type PlacementConstraintExpression = string;
  export type PlacementConstraintType = "distinctInstance"|"memberOf"|string;
  export type PlacementConstraints = PlacementConstraint[];
  export type PlacementStrategies = PlacementStrategy[];
  export interface PlacementStrategy {
    /**
     * The type of placement strategy. The random placement strategy randomly places tasks on available candidates. The spread placement strategy spreads placement across available candidates evenly based on the field parameter. The binpack strategy places tasks on available candidates that have the least available amount of the resource that is specified with the field parameter. For example, if you binpack on memory, a task is placed on the instance with the least amount of remaining memory (but still enough to run the task). 
     */
    type?: PlacementStrategyType;
    /**
     * The field to apply the placement strategy against. For the spread placement strategy, valid values are instanceId (or host, which has the same effect), or any platform or custom attribute that is applied to a container instance, such as attribute:ecs.availability-zone. For the binpack placement strategy, valid values are cpu and memory. For the random placement strategy, this field is not used. 
     */
    field?: PlacementStrategyField;
  }
  export type PlacementStrategyField = string;
  export type PlacementStrategyType = "random"|"spread"|"binpack"|string;
  export type Principal = string;
  export type PropagateTags = "TASK_DEFINITION"|string;
  export interface PutEventsRequest {
    /**
     * The entry that defines an event in your system. You can specify several parameters for the entry such as the source and type of the event, resources associated with the event, and so on.
     */
    Entries: PutEventsRequestEntryList;
  }
  export interface PutEventsRequestEntry {
    /**
     * The time stamp of the event, per RFC3339. If no time stamp is provided, the time stamp of the PutEvents call is used.
     */
    Time?: EventTime;
    /**
     * The source of the event.
     */
    Source?: String;
    /**
     * Amazon Web Services resources, identified by Amazon Resource Name (ARN), which the event primarily concerns. Any number, including zero, may be present.
     */
    Resources?: EventResourceList;
    /**
     * Free-form string used to decide what fields to expect in the event detail.
     */
    DetailType?: String;
    /**
     * A valid JSON string. There is no other schema imposed. The JSON string may contain fields and nested subobjects.
     */
    Detail?: String;
    /**
     * The name or ARN of the event bus to receive the event. Only the rules that are associated with this event bus are used to match the event. If you omit this, the default event bus is used.
     */
    EventBusName?: NonPartnerEventBusNameOrArn;
    /**
     * An X-Ray trade header, which is an http header (X-Amzn-Trace-Id) that contains the trace-id associated with the event. To learn more about X-Ray trace headers, see Tracing header in the X-Ray Developer Guide.
     */
    TraceHeader?: TraceHeader;
  }
  export type PutEventsRequestEntryList = PutEventsRequestEntry[];
  export interface PutEventsResponse {
    /**
     * The number of failed entries.
     */
    FailedEntryCount?: Integer;
    /**
     * The successfully and unsuccessfully ingested events results. If the ingestion was successful, the entry has the event ID in it. Otherwise, you can use the error code and error message to identify the problem with the entry.
     */
    Entries?: PutEventsResultEntryList;
  }
  export interface PutEventsResultEntry {
    /**
     * The ID of the event.
     */
    EventId?: EventId;
    /**
     * The error code that indicates why the event submission failed.
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message that explains why the event submission failed.
     */
    ErrorMessage?: ErrorMessage;
  }
  export type PutEventsResultEntryList = PutEventsResultEntry[];
  export interface PutPartnerEventsRequest {
    /**
     * The list of events to write to the event bus.
     */
    Entries: PutPartnerEventsRequestEntryList;
  }
  export interface PutPartnerEventsRequestEntry {
    /**
     * The date and time of the event.
     */
    Time?: EventTime;
    /**
     * The event source that is generating the entry.
     */
    Source?: EventSourceName;
    /**
     * Amazon Web Services resources, identified by Amazon Resource Name (ARN), which the event primarily concerns. Any number, including zero, may be present.
     */
    Resources?: EventResourceList;
    /**
     * A free-form string used to decide what fields to expect in the event detail.
     */
    DetailType?: String;
    /**
     * A valid JSON string. There is no other schema imposed. The JSON string may contain fields and nested subobjects.
     */
    Detail?: String;
  }
  export type PutPartnerEventsRequestEntryList = PutPartnerEventsRequestEntry[];
  export interface PutPartnerEventsResponse {
    /**
     * The number of events from this operation that could not be written to the partner event bus.
     */
    FailedEntryCount?: Integer;
    /**
     * The list of events from this operation that were successfully written to the partner event bus.
     */
    Entries?: PutPartnerEventsResultEntryList;
  }
  export interface PutPartnerEventsResultEntry {
    /**
     * The ID of the event.
     */
    EventId?: EventId;
    /**
     * The error code that indicates why the event submission failed.
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message that explains why the event submission failed.
     */
    ErrorMessage?: ErrorMessage;
  }
  export type PutPartnerEventsResultEntryList = PutPartnerEventsResultEntry[];
  export interface PutPermissionRequest {
    /**
     * The name of the event bus associated with the rule. If you omit this, the default event bus is used.
     */
    EventBusName?: NonPartnerEventBusName;
    /**
     * The action that you are enabling the other account to perform.
     */
    Action?: Action;
    /**
     * The 12-digit Amazon Web Services account ID that you are permitting to put events to your default event bus. Specify "*" to permit any account to put events to your default event bus. If you specify "*" without specifying Condition, avoid creating rules that may match undesirable events. To create more secure rules, make sure that the event pattern for each rule contains an account field with a specific account ID from which to receive events. Rules with an account field do not match any events sent from other accounts.
     */
    Principal?: Principal;
    /**
     * An identifier string for the external account that you are granting permissions to. If you later want to revoke the permission for this external account, specify this StatementId when you run RemovePermission.
     */
    StatementId?: StatementId;
    /**
     * This parameter enables you to limit the permission to accounts that fulfill a certain condition, such as being a member of a certain Amazon Web Services organization. For more information about Amazon Web Services Organizations, see What Is Amazon Web Services Organizations in the Amazon Web Services Organizations User Guide. If you specify Condition with an Amazon Web Services organization ID, and specify "*" as the value for Principal, you grant permission to all the accounts in the named organization. The Condition is a JSON string which must contain Type, Key, and Value fields.
     */
    Condition?: Condition;
    /**
     * A JSON string that describes the permission policy statement. You can include a Policy parameter in the request instead of using the StatementId, Action, Principal, or Condition parameters.
     */
    Policy?: String;
  }
  export interface PutRuleRequest {
    /**
     * The name of the rule that you are creating or updating.
     */
    Name: RuleName;
    /**
     * The scheduling expression. For example, "cron(0 20 * * ? *)" or "rate(5 minutes)".
     */
    ScheduleExpression?: ScheduleExpression;
    /**
     * The event pattern. For more information, see Events and Event Patterns in the Amazon EventBridge User Guide.
     */
    EventPattern?: EventPattern;
    /**
     * Indicates whether the rule is enabled or disabled.
     */
    State?: RuleState;
    /**
     * A description of the rule.
     */
    Description?: RuleDescription;
    /**
     * The Amazon Resource Name (ARN) of the IAM role associated with the rule. If you're setting an event bus in another account as the target and that account granted permission to your account through an organization instead of directly by the account ID, you must specify a RoleArn with proper permissions in the Target structure, instead of here in this parameter.
     */
    RoleArn?: RoleArn;
    /**
     * The list of key-value pairs to associate with the rule.
     */
    Tags?: TagList;
    /**
     * The name or ARN of the event bus to associate with this rule. If you omit this, the default event bus is used.
     */
    EventBusName?: EventBusNameOrArn;
  }
  export interface PutRuleResponse {
    /**
     * The Amazon Resource Name (ARN) of the rule.
     */
    RuleArn?: RuleArn;
  }
  export interface PutTargetsRequest {
    /**
     * The name of the rule.
     */
    Rule: RuleName;
    /**
     * The name or ARN of the event bus associated with the rule. If you omit this, the default event bus is used.
     */
    EventBusName?: EventBusNameOrArn;
    /**
     * The targets to update or add to the rule.
     */
    Targets: TargetList;
  }
  export interface PutTargetsResponse {
    /**
     * The number of failed entries.
     */
    FailedEntryCount?: Integer;
    /**
     * The failed target entries.
     */
    FailedEntries?: PutTargetsResultEntryList;
  }
  export interface PutTargetsResultEntry {
    /**
     * The ID of the target.
     */
    TargetId?: TargetId;
    /**
     * The error code that indicates why the target addition failed. If the value is ConcurrentModificationException, too many requests were made at the same time.
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message that explains why the target addition failed.
     */
    ErrorMessage?: ErrorMessage;
  }
  export type PutTargetsResultEntryList = PutTargetsResultEntry[];
  export type QueryStringKey = string;
  export type QueryStringParametersMap = {[key: string]: QueryStringValue};
  export type QueryStringValue = string;
  export interface RedshiftDataParameters {
    /**
     * The name or ARN of the secret that enables access to the database. Required when authenticating using Amazon Web Services Secrets Manager.
     */
    SecretManagerArn?: RedshiftSecretManagerArn;
    /**
     * The name of the database. Required when authenticating using temporary credentials.
     */
    Database: Database;
    /**
     * The database user name. Required when authenticating using temporary credentials.
     */
    DbUser?: DbUser;
    /**
     * The SQL statement text to run.
     */
    Sql: Sql;
    /**
     * The name of the SQL statement. You can name the SQL statement when you create it to identify the query.
     */
    StatementName?: StatementName;
    /**
     * Indicates whether to send an event back to EventBridge after the SQL statement runs.
     */
    WithEvent?: Boolean;
  }
  export type RedshiftSecretManagerArn = string;
  export type ReferenceId = string;
  export interface RemovePermissionRequest {
    /**
     * The statement ID corresponding to the account that is no longer allowed to put events to the default event bus.
     */
    StatementId?: StatementId;
    /**
     * Specifies whether to remove all permissions.
     */
    RemoveAllPermissions?: Boolean;
    /**
     * The name of the event bus to revoke permissions for. If you omit this, the default event bus is used.
     */
    EventBusName?: NonPartnerEventBusName;
  }
  export interface RemoveTargetsRequest {
    /**
     * The name of the rule.
     */
    Rule: RuleName;
    /**
     * The name or ARN of the event bus associated with the rule. If you omit this, the default event bus is used.
     */
    EventBusName?: EventBusNameOrArn;
    /**
     * The IDs of the targets to remove from the rule.
     */
    Ids: TargetIdList;
    /**
     * If this is a managed rule, created by an Amazon Web Services service on your behalf, you must specify Force as True to remove targets. This parameter is ignored for rules that are not managed rules. You can check whether a rule is a managed rule by using DescribeRule or ListRules and checking the ManagedBy field of the response.
     */
    Force?: Boolean;
  }
  export interface RemoveTargetsResponse {
    /**
     * The number of failed entries.
     */
    FailedEntryCount?: Integer;
    /**
     * The failed target entries.
     */
    FailedEntries?: RemoveTargetsResultEntryList;
  }
  export interface RemoveTargetsResultEntry {
    /**
     * The ID of the target.
     */
    TargetId?: TargetId;
    /**
     * The error code that indicates why the target removal failed. If the value is ConcurrentModificationException, too many requests were made at the same time.
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message that explains why the target removal failed.
     */
    ErrorMessage?: ErrorMessage;
  }
  export type RemoveTargetsResultEntryList = RemoveTargetsResultEntry[];
  export interface Replay {
    /**
     * The name of the replay.
     */
    ReplayName?: ReplayName;
    /**
     * The ARN of the archive to replay event from.
     */
    EventSourceArn?: Arn;
    /**
     * The current state of the replay.
     */
    State?: ReplayState;
    /**
     * A description of why the replay is in the current state.
     */
    StateReason?: ReplayStateReason;
    /**
     * A time stamp for the time to start replaying events. This is determined by the time in the event as described in Time.
     */
    EventStartTime?: Timestamp;
    /**
     * A time stamp for the time to start replaying events. Any event with a creation time prior to the EventEndTime specified is replayed.
     */
    EventEndTime?: Timestamp;
    /**
     * A time stamp for the time that the last event was replayed.
     */
    EventLastReplayedTime?: Timestamp;
    /**
     * A time stamp for the time that the replay started.
     */
    ReplayStartTime?: Timestamp;
    /**
     * A time stamp for the time that the replay completed.
     */
    ReplayEndTime?: Timestamp;
  }
  export type ReplayArn = string;
  export type ReplayDescription = string;
  export interface ReplayDestination {
    /**
     * The ARN of the event bus to replay event to. You can replay events only to the event bus specified to create the archive.
     */
    Arn: Arn;
    /**
     * A list of ARNs for rules to replay events to.
     */
    FilterArns?: ReplayDestinationFilters;
  }
  export type ReplayDestinationFilters = Arn[];
  export type ReplayList = Replay[];
  export type ReplayName = string;
  export type ReplayState = "STARTING"|"RUNNING"|"CANCELLING"|"COMPLETED"|"CANCELLED"|"FAILED"|string;
  export type ReplayStateReason = string;
  export type ResourceArn = string;
  export type RetentionDays = number;
  export interface RetryPolicy {
    /**
     * The maximum number of retry attempts to make before the request fails. Retry attempts continue until either the maximum number of attempts is made or until the duration of the MaximumEventAgeInSeconds is met.
     */
    MaximumRetryAttempts?: MaximumRetryAttempts;
    /**
     * The maximum amount of time, in seconds, to continue to make retry attempts.
     */
    MaximumEventAgeInSeconds?: MaximumEventAgeInSeconds;
  }
  export type RoleArn = string;
  export interface Rule {
    /**
     * The name of the rule.
     */
    Name?: RuleName;
    /**
     * The Amazon Resource Name (ARN) of the rule.
     */
    Arn?: RuleArn;
    /**
     * The event pattern of the rule. For more information, see Events and Event Patterns in the Amazon EventBridge User Guide.
     */
    EventPattern?: EventPattern;
    /**
     * The state of the rule.
     */
    State?: RuleState;
    /**
     * The description of the rule.
     */
    Description?: RuleDescription;
    /**
     * The scheduling expression. For example, "cron(0 20 * * ? *)", "rate(5 minutes)". For more information, see Creating an Amazon EventBridge rule that runs on a schedule.
     */
    ScheduleExpression?: ScheduleExpression;
    /**
     * The Amazon Resource Name (ARN) of the role that is used for target invocation. If you're setting an event bus in another account as the target and that account granted permission to your account through an organization instead of directly by the account ID, you must specify a RoleArn with proper permissions in the Target structure, instead of here in this parameter.
     */
    RoleArn?: RoleArn;
    /**
     * If the rule was created on behalf of your account by an Amazon Web Services service, this field displays the principal name of the service that created the rule.
     */
    ManagedBy?: ManagedBy;
    /**
     * The name or ARN of the event bus associated with the rule. If you omit this, the default event bus is used.
     */
    EventBusName?: EventBusName;
  }
  export type RuleArn = string;
  export type RuleDescription = string;
  export type RuleName = string;
  export type RuleNameList = RuleName[];
  export type RuleResponseList = Rule[];
  export type RuleState = "ENABLED"|"DISABLED"|string;
  export interface RunCommandParameters {
    /**
     * Currently, we support including only one RunCommandTarget block, which specifies either an array of InstanceIds or a tag.
     */
    RunCommandTargets: RunCommandTargets;
  }
  export interface RunCommandTarget {
    /**
     * Can be either tag: tag-key or InstanceIds.
     */
    Key: RunCommandTargetKey;
    /**
     * If Key is tag: tag-key, Values is a list of tag values. If Key is InstanceIds, Values is a list of Amazon EC2 instance IDs.
     */
    Values: RunCommandTargetValues;
  }
  export type RunCommandTargetKey = string;
  export type RunCommandTargetValue = string;
  export type RunCommandTargetValues = RunCommandTargetValue[];
  export type RunCommandTargets = RunCommandTarget[];
  export interface SageMakerPipelineParameter {
    /**
     * Name of parameter to start execution of a SageMaker Model Building Pipeline.
     */
    Name: SageMakerPipelineParameterName;
    /**
     * Value of parameter to start execution of a SageMaker Model Building Pipeline.
     */
    Value: SageMakerPipelineParameterValue;
  }
  export type SageMakerPipelineParameterList = SageMakerPipelineParameter[];
  export type SageMakerPipelineParameterName = string;
  export type SageMakerPipelineParameterValue = string;
  export interface SageMakerPipelineParameters {
    /**
     * List of Parameter names and values for SageMaker Model Building Pipeline execution.
     */
    PipelineParameterList?: SageMakerPipelineParameterList;
  }
  export type ScheduleExpression = string;
  export type SecretsManagerSecretArn = string;
  export type Sql = string;
  export interface SqsParameters {
    /**
     * The FIFO message group ID to use as the target.
     */
    MessageGroupId?: MessageGroupId;
  }
  export interface StartReplayRequest {
    /**
     * The name of the replay to start.
     */
    ReplayName: ReplayName;
    /**
     * A description for the replay to start.
     */
    Description?: ReplayDescription;
    /**
     * The ARN of the archive to replay events from.
     */
    EventSourceArn: Arn;
    /**
     * A time stamp for the time to start replaying events. Only events that occurred between the EventStartTime and EventEndTime are replayed.
     */
    EventStartTime: Timestamp;
    /**
     * A time stamp for the time to stop replaying events. Only events that occurred between the EventStartTime and EventEndTime are replayed.
     */
    EventEndTime: Timestamp;
    /**
     * A ReplayDestination object that includes details about the destination for the replay.
     */
    Destination: ReplayDestination;
  }
  export interface StartReplayResponse {
    /**
     * The ARN of the replay.
     */
    ReplayArn?: ReplayArn;
    /**
     * The state of the replay.
     */
    State?: ReplayState;
    /**
     * The reason that the replay is in the state.
     */
    StateReason?: ReplayStateReason;
    /**
     * The time at which the replay started.
     */
    ReplayStartTime?: Timestamp;
  }
  export type StatementId = string;
  export type StatementName = string;
  export type String = string;
  export type StringList = String[];
  export interface Tag {
    /**
     * A string you can use to assign a value. The combination of tag keys and values can help you organize and categorize your resources.
     */
    Key: TagKey;
    /**
     * The value for the specified tag key.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The ARN of the EventBridge resource that you're adding tags to.
     */
    ResourceARN: Arn;
    /**
     * The list of key-value pairs to associate with the resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface Target {
    /**
     * The ID of the target. We recommend using a memorable and unique string.
     */
    Id: TargetId;
    /**
     * The Amazon Resource Name (ARN) of the target.
     */
    Arn: TargetArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to be used for this target when the rule is triggered. If one rule triggers multiple targets, you can use a different IAM role for each target.
     */
    RoleArn?: RoleArn;
    /**
     * Valid JSON text passed to the target. In this case, nothing from the event itself is passed to the target. For more information, see The JavaScript Object Notation (JSON) Data Interchange Format.
     */
    Input?: TargetInput;
    /**
     * The value of the JSONPath that is used for extracting part of the matched event when passing it to the target. You must use JSON dot notation, not bracket notation. For more information about JSON paths, see JSONPath.
     */
    InputPath?: TargetInputPath;
    /**
     * Settings to enable you to provide custom input to a target based on certain event data. You can extract one or more key-value pairs from the event and then use that data to send customized input to the target.
     */
    InputTransformer?: InputTransformer;
    /**
     * The custom parameter you can use to control the shard assignment, when the target is a Kinesis data stream. If you do not include this parameter, the default is to use the eventId as the partition key.
     */
    KinesisParameters?: KinesisParameters;
    /**
     * Parameters used when you are using the rule to invoke Amazon EC2 Run Command.
     */
    RunCommandParameters?: RunCommandParameters;
    /**
     * Contains the Amazon ECS task definition and task count to be used, if the event target is an Amazon ECS task. For more information about Amazon ECS tasks, see Task Definitions  in the Amazon EC2 Container Service Developer Guide.
     */
    EcsParameters?: EcsParameters;
    /**
     * If the event target is an Batch job, this contains the job definition, job name, and other parameters. For more information, see Jobs in the Batch User Guide.
     */
    BatchParameters?: BatchParameters;
    /**
     * Contains the message group ID to use when the target is a FIFO queue. If you specify an SQS FIFO queue as a target, the queue must have content-based deduplication enabled.
     */
    SqsParameters?: SqsParameters;
    /**
     * Contains the HTTP parameters to use when the target is a API Gateway REST endpoint or EventBridge ApiDestination. If you specify an API Gateway REST API or EventBridge ApiDestination as a target, you can use this parameter to specify headers, path parameters, and query string keys/values as part of your target invoking request. If you're using ApiDestinations, the corresponding Connection can also have these values configured. In case of any conflicting keys, values from the Connection take precedence.
     */
    HttpParameters?: HttpParameters;
    /**
     * Contains the Amazon Redshift Data API parameters to use when the target is a Amazon Redshift cluster. If you specify a Amazon Redshift Cluster as a Target, you can use this to specify parameters to invoke the Amazon Redshift Data API ExecuteStatement based on EventBridge events.
     */
    RedshiftDataParameters?: RedshiftDataParameters;
    /**
     * Contains the SageMaker Model Building Pipeline parameters to start execution of a SageMaker Model Building Pipeline. If you specify a SageMaker Model Building Pipeline as a target, you can use this to specify parameters to start a pipeline execution based on EventBridge events.
     */
    SageMakerPipelineParameters?: SageMakerPipelineParameters;
    /**
     * The DeadLetterConfig that defines the target queue to send dead-letter queue events to.
     */
    DeadLetterConfig?: DeadLetterConfig;
    /**
     * The RetryPolicy object that contains the retry policy configuration to use for the dead-letter queue.
     */
    RetryPolicy?: RetryPolicy;
  }
  export type TargetArn = string;
  export type TargetId = string;
  export type TargetIdList = TargetId[];
  export type TargetInput = string;
  export type TargetInputPath = string;
  export type TargetList = Target[];
  export type TargetPartitionKeyPath = string;
  export interface TestEventPatternRequest {
    /**
     * The event pattern. For more information, see Events and Event Patterns in the Amazon EventBridge User Guide.
     */
    EventPattern: EventPattern;
    /**
     * The event, in JSON format, to test against the event pattern. The JSON must follow the format specified in Amazon Web Services Events, and the following fields are mandatory:    id     account     source     time     region     resources     detail-type   
     */
    Event: String;
  }
  export interface TestEventPatternResponse {
    /**
     * Indicates whether the event matches the event pattern.
     */
    Result?: Boolean;
  }
  export type Timestamp = Date;
  export type TraceHeader = string;
  export type TransformerInput = string;
  export type TransformerPaths = {[key: string]: TargetInputPath};
  export interface UntagResourceRequest {
    /**
     * The ARN of the EventBridge resource from which you are removing tags.
     */
    ResourceARN: Arn;
    /**
     * The list of tag keys to remove from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateApiDestinationRequest {
    /**
     * The name of the API destination to update.
     */
    Name: ApiDestinationName;
    /**
     * The name of the API destination to update.
     */
    Description?: ApiDestinationDescription;
    /**
     * The ARN of the connection to use for the API destination.
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The URL to the endpoint to use for the API destination.
     */
    InvocationEndpoint?: HttpsEndpoint;
    /**
     * The method to use for the API destination.
     */
    HttpMethod?: ApiDestinationHttpMethod;
    /**
     * The maximum number of invocations per second to send to the API destination.
     */
    InvocationRateLimitPerSecond?: ApiDestinationInvocationRateLimitPerSecond;
  }
  export interface UpdateApiDestinationResponse {
    /**
     * The ARN of the API destination that was updated.
     */
    ApiDestinationArn?: ApiDestinationArn;
    /**
     * The state of the API destination that was updated.
     */
    ApiDestinationState?: ApiDestinationState;
    /**
     * A time stamp for the time that the API destination was created.
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp for the time that the API destination was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export interface UpdateArchiveRequest {
    /**
     * The name of the archive to update.
     */
    ArchiveName: ArchiveName;
    /**
     * The description for the archive.
     */
    Description?: ArchiveDescription;
    /**
     * The event pattern to use to filter events sent to the archive.
     */
    EventPattern?: EventPattern;
    /**
     * The number of days to retain events in the archive.
     */
    RetentionDays?: RetentionDays;
  }
  export interface UpdateArchiveResponse {
    /**
     * The ARN of the archive.
     */
    ArchiveArn?: ArchiveArn;
    /**
     * The state of the archive.
     */
    State?: ArchiveState;
    /**
     * The reason that the archive is in the current state.
     */
    StateReason?: ArchiveStateReason;
    /**
     * The time at which the archive was updated.
     */
    CreationTime?: Timestamp;
  }
  export interface UpdateConnectionApiKeyAuthRequestParameters {
    /**
     * The name of the API key to use for authorization.
     */
    ApiKeyName?: AuthHeaderParameters;
    /**
     * The value associated with teh API key to use for authorization.
     */
    ApiKeyValue?: AuthHeaderParameters;
  }
  export interface UpdateConnectionAuthRequestParameters {
    /**
     * A UpdateConnectionBasicAuthRequestParameters object that contains the authorization parameters for Basic authorization.
     */
    BasicAuthParameters?: UpdateConnectionBasicAuthRequestParameters;
    /**
     * A UpdateConnectionOAuthRequestParameters object that contains the authorization parameters for OAuth authorization.
     */
    OAuthParameters?: UpdateConnectionOAuthRequestParameters;
    /**
     * A UpdateConnectionApiKeyAuthRequestParameters object that contains the authorization parameters for API key authorization.
     */
    ApiKeyAuthParameters?: UpdateConnectionApiKeyAuthRequestParameters;
    /**
     * A ConnectionHttpParameters object that contains the additional parameters to use for the connection.
     */
    InvocationHttpParameters?: ConnectionHttpParameters;
  }
  export interface UpdateConnectionBasicAuthRequestParameters {
    /**
     * The user name to use for Basic authorization.
     */
    Username?: AuthHeaderParameters;
    /**
     * The password associated with the user name to use for Basic authorization.
     */
    Password?: AuthHeaderParameters;
  }
  export interface UpdateConnectionOAuthClientRequestParameters {
    /**
     * The client ID to use for OAuth authorization.
     */
    ClientID?: AuthHeaderParameters;
    /**
     * The client secret assciated with the client ID to use for OAuth authorization.
     */
    ClientSecret?: AuthHeaderParameters;
  }
  export interface UpdateConnectionOAuthRequestParameters {
    /**
     * A UpdateConnectionOAuthClientRequestParameters object that contains the client parameters to use for the connection when OAuth is specified as the authorization type.
     */
    ClientParameters?: UpdateConnectionOAuthClientRequestParameters;
    /**
     * The URL to the authorization endpoint when OAuth is specified as the authorization type.
     */
    AuthorizationEndpoint?: HttpsEndpoint;
    /**
     * The method used to connect to the HTTP endpoint.
     */
    HttpMethod?: ConnectionOAuthHttpMethod;
    /**
     * The additional HTTP parameters used for the OAuth authorization request.
     */
    OAuthHttpParameters?: ConnectionHttpParameters;
  }
  export interface UpdateConnectionRequest {
    /**
     * The name of the connection to update.
     */
    Name: ConnectionName;
    /**
     * A description for the connection.
     */
    Description?: ConnectionDescription;
    /**
     * The type of authorization to use for the connection.
     */
    AuthorizationType?: ConnectionAuthorizationType;
    /**
     * The authorization parameters to use for the connection.
     */
    AuthParameters?: UpdateConnectionAuthRequestParameters;
  }
  export interface UpdateConnectionResponse {
    /**
     * The ARN of the connection that was updated.
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The state of the connection that was updated.
     */
    ConnectionState?: ConnectionState;
    /**
     * A time stamp for the time that the connection was created.
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp for the time that the connection was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * A time stamp for the time that the connection was last authorized.
     */
    LastAuthorizedTime?: Timestamp;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-10-07"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the EventBridge client.
   */
  export import Types = EventBridge;
}
export = EventBridge;
