import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CodeStarNotifications extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CodeStarNotifications.Types.ClientConfiguration)
  config: Config & CodeStarNotifications.Types.ClientConfiguration;
  /**
   * Creates a notification rule for a resource. The rule specifies the events you want notifications about and the targets (such as SNS topics) where you want to receive them.
   */
  createNotificationRule(params: CodeStarNotifications.Types.CreateNotificationRuleRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.CreateNotificationRuleResult) => void): Request<CodeStarNotifications.Types.CreateNotificationRuleResult, AWSError>;
  /**
   * Creates a notification rule for a resource. The rule specifies the events you want notifications about and the targets (such as SNS topics) where you want to receive them.
   */
  createNotificationRule(callback?: (err: AWSError, data: CodeStarNotifications.Types.CreateNotificationRuleResult) => void): Request<CodeStarNotifications.Types.CreateNotificationRuleResult, AWSError>;
  /**
   * Deletes a notification rule for a resource.
   */
  deleteNotificationRule(params: CodeStarNotifications.Types.DeleteNotificationRuleRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.DeleteNotificationRuleResult) => void): Request<CodeStarNotifications.Types.DeleteNotificationRuleResult, AWSError>;
  /**
   * Deletes a notification rule for a resource.
   */
  deleteNotificationRule(callback?: (err: AWSError, data: CodeStarNotifications.Types.DeleteNotificationRuleResult) => void): Request<CodeStarNotifications.Types.DeleteNotificationRuleResult, AWSError>;
  /**
   * Deletes a specified target for notifications.
   */
  deleteTarget(params: CodeStarNotifications.Types.DeleteTargetRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.DeleteTargetResult) => void): Request<CodeStarNotifications.Types.DeleteTargetResult, AWSError>;
  /**
   * Deletes a specified target for notifications.
   */
  deleteTarget(callback?: (err: AWSError, data: CodeStarNotifications.Types.DeleteTargetResult) => void): Request<CodeStarNotifications.Types.DeleteTargetResult, AWSError>;
  /**
   * Returns information about a specified notification rule.
   */
  describeNotificationRule(params: CodeStarNotifications.Types.DescribeNotificationRuleRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.DescribeNotificationRuleResult) => void): Request<CodeStarNotifications.Types.DescribeNotificationRuleResult, AWSError>;
  /**
   * Returns information about a specified notification rule.
   */
  describeNotificationRule(callback?: (err: AWSError, data: CodeStarNotifications.Types.DescribeNotificationRuleResult) => void): Request<CodeStarNotifications.Types.DescribeNotificationRuleResult, AWSError>;
  /**
   * Returns information about the event types available for configuring notifications.
   */
  listEventTypes(params: CodeStarNotifications.Types.ListEventTypesRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.ListEventTypesResult) => void): Request<CodeStarNotifications.Types.ListEventTypesResult, AWSError>;
  /**
   * Returns information about the event types available for configuring notifications.
   */
  listEventTypes(callback?: (err: AWSError, data: CodeStarNotifications.Types.ListEventTypesResult) => void): Request<CodeStarNotifications.Types.ListEventTypesResult, AWSError>;
  /**
   * Returns a list of the notification rules for an AWS account.
   */
  listNotificationRules(params: CodeStarNotifications.Types.ListNotificationRulesRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.ListNotificationRulesResult) => void): Request<CodeStarNotifications.Types.ListNotificationRulesResult, AWSError>;
  /**
   * Returns a list of the notification rules for an AWS account.
   */
  listNotificationRules(callback?: (err: AWSError, data: CodeStarNotifications.Types.ListNotificationRulesResult) => void): Request<CodeStarNotifications.Types.ListNotificationRulesResult, AWSError>;
  /**
   * Returns a list of the tags associated with a notification rule.
   */
  listTagsForResource(params: CodeStarNotifications.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.ListTagsForResourceResult) => void): Request<CodeStarNotifications.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Returns a list of the tags associated with a notification rule.
   */
  listTagsForResource(callback?: (err: AWSError, data: CodeStarNotifications.Types.ListTagsForResourceResult) => void): Request<CodeStarNotifications.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Returns a list of the notification rule targets for an AWS account.
   */
  listTargets(params: CodeStarNotifications.Types.ListTargetsRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.ListTargetsResult) => void): Request<CodeStarNotifications.Types.ListTargetsResult, AWSError>;
  /**
   * Returns a list of the notification rule targets for an AWS account.
   */
  listTargets(callback?: (err: AWSError, data: CodeStarNotifications.Types.ListTargetsResult) => void): Request<CodeStarNotifications.Types.ListTargetsResult, AWSError>;
  /**
   * Creates an association between a notification rule and an SNS topic so that the associated target can receive notifications when the events described in the rule are triggered.
   */
  subscribe(params: CodeStarNotifications.Types.SubscribeRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.SubscribeResult) => void): Request<CodeStarNotifications.Types.SubscribeResult, AWSError>;
  /**
   * Creates an association between a notification rule and an SNS topic so that the associated target can receive notifications when the events described in the rule are triggered.
   */
  subscribe(callback?: (err: AWSError, data: CodeStarNotifications.Types.SubscribeResult) => void): Request<CodeStarNotifications.Types.SubscribeResult, AWSError>;
  /**
   * Associates a set of provided tags with a notification rule.
   */
  tagResource(params: CodeStarNotifications.Types.TagResourceRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.TagResourceResult) => void): Request<CodeStarNotifications.Types.TagResourceResult, AWSError>;
  /**
   * Associates a set of provided tags with a notification rule.
   */
  tagResource(callback?: (err: AWSError, data: CodeStarNotifications.Types.TagResourceResult) => void): Request<CodeStarNotifications.Types.TagResourceResult, AWSError>;
  /**
   * Removes an association between a notification rule and an Amazon SNS topic so that subscribers to that topic stop receiving notifications when the events described in the rule are triggered.
   */
  unsubscribe(params: CodeStarNotifications.Types.UnsubscribeRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.UnsubscribeResult) => void): Request<CodeStarNotifications.Types.UnsubscribeResult, AWSError>;
  /**
   * Removes an association between a notification rule and an Amazon SNS topic so that subscribers to that topic stop receiving notifications when the events described in the rule are triggered.
   */
  unsubscribe(callback?: (err: AWSError, data: CodeStarNotifications.Types.UnsubscribeResult) => void): Request<CodeStarNotifications.Types.UnsubscribeResult, AWSError>;
  /**
   * Removes the association between one or more provided tags and a notification rule.
   */
  untagResource(params: CodeStarNotifications.Types.UntagResourceRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.UntagResourceResult) => void): Request<CodeStarNotifications.Types.UntagResourceResult, AWSError>;
  /**
   * Removes the association between one or more provided tags and a notification rule.
   */
  untagResource(callback?: (err: AWSError, data: CodeStarNotifications.Types.UntagResourceResult) => void): Request<CodeStarNotifications.Types.UntagResourceResult, AWSError>;
  /**
   * Updates a notification rule for a resource. You can change the events that trigger the notification rule, the status of the rule, and the targets that receive the notifications.  To add or remove tags for a notification rule, you must use TagResource and UntagResource. 
   */
  updateNotificationRule(params: CodeStarNotifications.Types.UpdateNotificationRuleRequest, callback?: (err: AWSError, data: CodeStarNotifications.Types.UpdateNotificationRuleResult) => void): Request<CodeStarNotifications.Types.UpdateNotificationRuleResult, AWSError>;
  /**
   * Updates a notification rule for a resource. You can change the events that trigger the notification rule, the status of the rule, and the targets that receive the notifications.  To add or remove tags for a notification rule, you must use TagResource and UntagResource. 
   */
  updateNotificationRule(callback?: (err: AWSError, data: CodeStarNotifications.Types.UpdateNotificationRuleResult) => void): Request<CodeStarNotifications.Types.UpdateNotificationRuleResult, AWSError>;
}
declare namespace CodeStarNotifications {
  export type ClientRequestToken = string;
  export interface CreateNotificationRuleRequest {
    /**
     * The name for the notification rule. Notifictaion rule names must be unique in your AWS account.
     */
    Name: NotificationRuleName;
    /**
     * A list of event types associated with this notification rule. For a list of allowed events, see EventTypeSummary.
     */
    EventTypeIds: EventTypeIds;
    /**
     * The Amazon Resource Name (ARN) of the resource to associate with the notification rule. Supported resources include pipelines in AWS CodePipeline, repositories in AWS CodeCommit, and build projects in AWS CodeBuild.
     */
    Resource: NotificationRuleResource;
    /**
     * A list of Amazon Resource Names (ARNs) of SNS topics to associate with the notification rule.
     */
    Targets: Targets;
    /**
     * The level of detail to include in the notifications for this resource. BASIC will include only the contents of the event as it would appear in AWS CloudWatch. FULL will include any supplemental information provided by AWS CodeStar Notifications and/or the service for the resource for which the notification is created.
     */
    DetailType: DetailType;
    /**
     * A unique, client-generated idempotency token that, when provided in a request, ensures the request cannot be repeated with a changed parameter. If a request with the same parameters is received and a token is included, the request returns information about the initial request that used that token.  The AWS SDKs prepopulate client request tokens. If you are using an AWS SDK, an idempotency token is created for you. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * A list of tags to apply to this notification rule. Key names cannot start with "aws". 
     */
    Tags?: Tags;
    /**
     * The status of the notification rule. The default value is ENABLED. If the status is set to DISABLED, notifications aren't sent for the notification rule.
     */
    Status?: NotificationRuleStatus;
  }
  export interface CreateNotificationRuleResult {
    /**
     * The Amazon Resource Name (ARN) of the notification rule.
     */
    Arn?: NotificationRuleArn;
  }
  export type CreatedTimestamp = Date;
  export interface DeleteNotificationRuleRequest {
    /**
     * The Amazon Resource Name (ARN) of the notification rule you want to delete.
     */
    Arn: NotificationRuleArn;
  }
  export interface DeleteNotificationRuleResult {
    /**
     * The Amazon Resource Name (ARN) of the deleted notification rule.
     */
    Arn?: NotificationRuleArn;
  }
  export interface DeleteTargetRequest {
    /**
     * The Amazon Resource Name (ARN) of the SNS topic to delete.
     */
    TargetAddress: TargetAddress;
    /**
     * A Boolean value that can be used to delete all associations with this SNS topic. The default value is FALSE. If set to TRUE, all associations between that target and every notification rule in your AWS account are deleted.
     */
    ForceUnsubscribeAll?: ForceUnsubscribeAll;
  }
  export interface DeleteTargetResult {
  }
  export interface DescribeNotificationRuleRequest {
    /**
     * The Amazon Resource Name (ARN) of the notification rule.
     */
    Arn: NotificationRuleArn;
  }
  export interface DescribeNotificationRuleResult {
    /**
     * The Amazon Resource Name (ARN) of the notification rule.
     */
    Arn: NotificationRuleArn;
    /**
     * The name of the notification rule.
     */
    Name?: NotificationRuleName;
    /**
     * A list of the event types associated with the notification rule.
     */
    EventTypes?: EventTypeBatch;
    /**
     * The Amazon Resource Name (ARN) of the resource associated with the notification rule.
     */
    Resource?: NotificationRuleResource;
    /**
     * A list of the SNS topics associated with the notification rule.
     */
    Targets?: TargetsBatch;
    /**
     * The level of detail included in the notifications for this resource. BASIC will include only the contents of the event as it would appear in AWS CloudWatch. FULL will include any supplemental information provided by AWS CodeStar Notifications and/or the service for the resource for which the notification is created.
     */
    DetailType?: DetailType;
    /**
     * The name or email alias of the person who created the notification rule.
     */
    CreatedBy?: NotificationRuleCreatedBy;
    /**
     * The status of the notification rule. Valid statuses are on (sending notifications) or off (not sending notifications).
     */
    Status?: NotificationRuleStatus;
    /**
     * The date and time the notification rule was created, in timestamp format.
     */
    CreatedTimestamp?: CreatedTimestamp;
    /**
     * The date and time the notification rule was most recently updated, in timestamp format.
     */
    LastModifiedTimestamp?: LastModifiedTimestamp;
    /**
     * The tags associated with the notification rule.
     */
    Tags?: Tags;
  }
  export type DetailType = "BASIC"|"FULL"|string;
  export type EventTypeBatch = EventTypeSummary[];
  export type EventTypeId = string;
  export type EventTypeIds = EventTypeId[];
  export type EventTypeName = string;
  export interface EventTypeSummary {
    /**
     * The system-generated ID of the event.
     */
    EventTypeId?: EventTypeId;
    /**
     * The name of the service for which the event applies.
     */
    ServiceName?: ServiceName;
    /**
     * The name of the event.
     */
    EventTypeName?: EventTypeName;
    /**
     * The resource type of the event.
     */
    ResourceType?: ResourceType;
  }
  export type ForceUnsubscribeAll = boolean;
  export type LastModifiedTimestamp = Date;
  export interface ListEventTypesFilter {
    /**
     * The system-generated name of the filter type you want to filter by.
     */
    Name: ListEventTypesFilterName;
    /**
     * The name of the resource type (for example, pipeline) or service name (for example, CodePipeline) that you want to filter by.
     */
    Value: ListEventTypesFilterValue;
  }
  export type ListEventTypesFilterName = "RESOURCE_TYPE"|"SERVICE_NAME"|string;
  export type ListEventTypesFilterValue = string;
  export type ListEventTypesFilters = ListEventTypesFilter[];
  export interface ListEventTypesRequest {
    /**
     * The filters to use to return information by service or resource type.
     */
    Filters?: ListEventTypesFilters;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    NextToken?: NextToken;
    /**
     * A non-negative integer used to limit the number of returned results. The default number is 50. The maximum number of results that can be returned is 100.
     */
    MaxResults?: MaxResults;
  }
  export interface ListEventTypesResult {
    /**
     * Information about each event, including service name, resource type, event ID, and event name.
     */
    EventTypes?: EventTypeBatch;
    /**
     * An enumeration token that can be used in a request to return the next batch of the results.
     */
    NextToken?: NextToken;
  }
  export interface ListNotificationRulesFilter {
    /**
     * The name of the attribute you want to use to filter the returned notification rules.
     */
    Name: ListNotificationRulesFilterName;
    /**
     * The value of the attribute you want to use to filter the returned notification rules. For example, if you specify filtering by RESOURCE in Name, you might specify the ARN of a pipeline in AWS CodePipeline for the value.
     */
    Value: ListNotificationRulesFilterValue;
  }
  export type ListNotificationRulesFilterName = "EVENT_TYPE_ID"|"CREATED_BY"|"RESOURCE"|"TARGET_ADDRESS"|string;
  export type ListNotificationRulesFilterValue = string;
  export type ListNotificationRulesFilters = ListNotificationRulesFilter[];
  export interface ListNotificationRulesRequest {
    /**
     * The filters to use to return information by service or resource type. For valid values, see ListNotificationRulesFilter.  A filter with the same name can appear more than once when used with OR statements. Filters with different names should be applied with AND statements. 
     */
    Filters?: ListNotificationRulesFilters;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    NextToken?: NextToken;
    /**
     * A non-negative integer used to limit the number of returned results. The maximum number of results that can be returned is 100.
     */
    MaxResults?: MaxResults;
  }
  export interface ListNotificationRulesResult {
    /**
     * An enumeration token that can be used in a request to return the next batch of the results.
     */
    NextToken?: NextToken;
    /**
     * The list of notification rules for the AWS account, by Amazon Resource Name (ARN) and ID. 
     */
    NotificationRules?: NotificationRuleBatch;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the notification rule.
     */
    Arn: NotificationRuleArn;
  }
  export interface ListTagsForResourceResult {
    /**
     * The tags associated with the notification rule.
     */
    Tags?: Tags;
  }
  export interface ListTargetsFilter {
    /**
     * The name of the attribute you want to use to filter the returned targets.
     */
    Name: ListTargetsFilterName;
    /**
     * The value of the attribute you want to use to filter the returned targets. For example, if you specify SNS for the Target type, you could specify an Amazon Resource Name (ARN) for a topic as the value.
     */
    Value: ListTargetsFilterValue;
  }
  export type ListTargetsFilterName = "TARGET_TYPE"|"TARGET_ADDRESS"|"TARGET_STATUS"|string;
  export type ListTargetsFilterValue = string;
  export type ListTargetsFilters = ListTargetsFilter[];
  export interface ListTargetsRequest {
    /**
     * The filters to use to return information by service or resource type. Valid filters include target type, target address, and target status.  A filter with the same name can appear more than once when used with OR statements. Filters with different names should be applied with AND statements. 
     */
    Filters?: ListTargetsFilters;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    NextToken?: NextToken;
    /**
     * A non-negative integer used to limit the number of returned results. The maximum number of results that can be returned is 100.
     */
    MaxResults?: MaxResults;
  }
  export interface ListTargetsResult {
    /**
     * The list of notification rule targets. 
     */
    Targets?: TargetsBatch;
    /**
     * An enumeration token that can be used in a request to return the next batch of results.
     */
    NextToken?: NextToken;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export type NotificationRuleArn = string;
  export type NotificationRuleBatch = NotificationRuleSummary[];
  export type NotificationRuleCreatedBy = string;
  export type NotificationRuleId = string;
  export type NotificationRuleName = string;
  export type NotificationRuleResource = string;
  export type NotificationRuleStatus = "ENABLED"|"DISABLED"|string;
  export interface NotificationRuleSummary {
    /**
     * The unique ID of the notification rule.
     */
    Id?: NotificationRuleId;
    /**
     * The Amazon Resource Name (ARN) of the notification rule.
     */
    Arn?: NotificationRuleArn;
  }
  export type ResourceType = string;
  export type ServiceName = string;
  export interface SubscribeRequest {
    /**
     * The Amazon Resource Name (ARN) of the notification rule for which you want to create the association.
     */
    Arn: NotificationRuleArn;
    Target: Target;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface SubscribeResult {
    /**
     * The Amazon Resource Name (ARN) of the notification rule for which you have created assocations.
     */
    Arn?: NotificationRuleArn;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the notification rule to tag.
     */
    Arn: NotificationRuleArn;
    /**
     * The list of tags to associate with the resource. Tag key names cannot start with "aws".
     */
    Tags: Tags;
  }
  export interface TagResourceResult {
    /**
     * The list of tags associated with the resource.
     */
    Tags?: Tags;
  }
  export type TagValue = string;
  export type Tags = {[key: string]: TagValue};
  export interface Target {
    /**
     * The target type. Can be an Amazon SNS topic.
     */
    TargetType?: TargetType;
    /**
     * The Amazon Resource Name (ARN) of the SNS topic.
     */
    TargetAddress?: TargetAddress;
  }
  export type TargetAddress = string;
  export type TargetStatus = "PENDING"|"ACTIVE"|"UNREACHABLE"|"INACTIVE"|"DEACTIVATED"|string;
  export interface TargetSummary {
    /**
     * The Amazon Resource Name (ARN) of the SNS topic.
     */
    TargetAddress?: TargetAddress;
    /**
     * The type of the target (for example, SNS).
     */
    TargetType?: TargetType;
    /**
     * The status of the target.
     */
    TargetStatus?: TargetStatus;
  }
  export type TargetType = string;
  export type Targets = Target[];
  export type TargetsBatch = TargetSummary[];
  export interface UnsubscribeRequest {
    /**
     * The Amazon Resource Name (ARN) of the notification rule.
     */
    Arn: NotificationRuleArn;
    /**
     * The ARN of the SNS topic to unsubscribe from the notification rule.
     */
    TargetAddress: TargetAddress;
  }
  export interface UnsubscribeResult {
    /**
     * The Amazon Resource Name (ARN) of the the notification rule from which you have removed a subscription.
     */
    Arn: NotificationRuleArn;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the notification rule from which to remove the tags.
     */
    Arn: NotificationRuleArn;
    /**
     * The key names of the tags to remove.
     */
    TagKeys: TagKeys;
  }
  export interface UntagResourceResult {
  }
  export interface UpdateNotificationRuleRequest {
    /**
     * The Amazon Resource Name (ARN) of the notification rule.
     */
    Arn: NotificationRuleArn;
    /**
     * The name of the notification rule.
     */
    Name?: NotificationRuleName;
    /**
     * The status of the notification rule. Valid statuses include enabled (sending notifications) or disabled (not sending notifications).
     */
    Status?: NotificationRuleStatus;
    /**
     * A list of event types associated with this notification rule.
     */
    EventTypeIds?: EventTypeIds;
    /**
     * The address and type of the targets to receive notifications from this notification rule.
     */
    Targets?: Targets;
    /**
     * The level of detail to include in the notifications for this resource. BASIC will include only the contents of the event as it would appear in AWS CloudWatch. FULL will include any supplemental information provided by AWS CodeStar Notifications and/or the service for the resource for which the notification is created.
     */
    DetailType?: DetailType;
  }
  export interface UpdateNotificationRuleResult {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-10-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CodeStarNotifications client.
   */
  export import Types = CodeStarNotifications;
}
export = CodeStarNotifications;
