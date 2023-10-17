import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Rbin extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Rbin.Types.ClientConfiguration)
  config: Config & Rbin.Types.ClientConfiguration;
  /**
   * Creates a Recycle Bin retention rule. For more information, see  Create Recycle Bin retention rules in the Amazon Elastic Compute Cloud User Guide.
   */
  createRule(params: Rbin.Types.CreateRuleRequest, callback?: (err: AWSError, data: Rbin.Types.CreateRuleResponse) => void): Request<Rbin.Types.CreateRuleResponse, AWSError>;
  /**
   * Creates a Recycle Bin retention rule. For more information, see  Create Recycle Bin retention rules in the Amazon Elastic Compute Cloud User Guide.
   */
  createRule(callback?: (err: AWSError, data: Rbin.Types.CreateRuleResponse) => void): Request<Rbin.Types.CreateRuleResponse, AWSError>;
  /**
   * Deletes a Recycle Bin retention rule. For more information, see  Delete Recycle Bin retention rules in the Amazon Elastic Compute Cloud User Guide.
   */
  deleteRule(params: Rbin.Types.DeleteRuleRequest, callback?: (err: AWSError, data: Rbin.Types.DeleteRuleResponse) => void): Request<Rbin.Types.DeleteRuleResponse, AWSError>;
  /**
   * Deletes a Recycle Bin retention rule. For more information, see  Delete Recycle Bin retention rules in the Amazon Elastic Compute Cloud User Guide.
   */
  deleteRule(callback?: (err: AWSError, data: Rbin.Types.DeleteRuleResponse) => void): Request<Rbin.Types.DeleteRuleResponse, AWSError>;
  /**
   * Gets information about a Recycle Bin retention rule.
   */
  getRule(params: Rbin.Types.GetRuleRequest, callback?: (err: AWSError, data: Rbin.Types.GetRuleResponse) => void): Request<Rbin.Types.GetRuleResponse, AWSError>;
  /**
   * Gets information about a Recycle Bin retention rule.
   */
  getRule(callback?: (err: AWSError, data: Rbin.Types.GetRuleResponse) => void): Request<Rbin.Types.GetRuleResponse, AWSError>;
  /**
   * Lists the Recycle Bin retention rules in the Region.
   */
  listRules(params: Rbin.Types.ListRulesRequest, callback?: (err: AWSError, data: Rbin.Types.ListRulesResponse) => void): Request<Rbin.Types.ListRulesResponse, AWSError>;
  /**
   * Lists the Recycle Bin retention rules in the Region.
   */
  listRules(callback?: (err: AWSError, data: Rbin.Types.ListRulesResponse) => void): Request<Rbin.Types.ListRulesResponse, AWSError>;
  /**
   * Lists the tags assigned to a retention rule.
   */
  listTagsForResource(params: Rbin.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Rbin.Types.ListTagsForResourceResponse) => void): Request<Rbin.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags assigned to a retention rule.
   */
  listTagsForResource(callback?: (err: AWSError, data: Rbin.Types.ListTagsForResourceResponse) => void): Request<Rbin.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Locks a retention rule. A locked retention rule can't be modified or deleted.
   */
  lockRule(params: Rbin.Types.LockRuleRequest, callback?: (err: AWSError, data: Rbin.Types.LockRuleResponse) => void): Request<Rbin.Types.LockRuleResponse, AWSError>;
  /**
   * Locks a retention rule. A locked retention rule can't be modified or deleted.
   */
  lockRule(callback?: (err: AWSError, data: Rbin.Types.LockRuleResponse) => void): Request<Rbin.Types.LockRuleResponse, AWSError>;
  /**
   * Assigns tags to the specified retention rule.
   */
  tagResource(params: Rbin.Types.TagResourceRequest, callback?: (err: AWSError, data: Rbin.Types.TagResourceResponse) => void): Request<Rbin.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns tags to the specified retention rule.
   */
  tagResource(callback?: (err: AWSError, data: Rbin.Types.TagResourceResponse) => void): Request<Rbin.Types.TagResourceResponse, AWSError>;
  /**
   * Unlocks a retention rule. After a retention rule is unlocked, it can be modified or deleted only after the unlock delay period expires.
   */
  unlockRule(params: Rbin.Types.UnlockRuleRequest, callback?: (err: AWSError, data: Rbin.Types.UnlockRuleResponse) => void): Request<Rbin.Types.UnlockRuleResponse, AWSError>;
  /**
   * Unlocks a retention rule. After a retention rule is unlocked, it can be modified or deleted only after the unlock delay period expires.
   */
  unlockRule(callback?: (err: AWSError, data: Rbin.Types.UnlockRuleResponse) => void): Request<Rbin.Types.UnlockRuleResponse, AWSError>;
  /**
   * Unassigns a tag from a retention rule.
   */
  untagResource(params: Rbin.Types.UntagResourceRequest, callback?: (err: AWSError, data: Rbin.Types.UntagResourceResponse) => void): Request<Rbin.Types.UntagResourceResponse, AWSError>;
  /**
   * Unassigns a tag from a retention rule.
   */
  untagResource(callback?: (err: AWSError, data: Rbin.Types.UntagResourceResponse) => void): Request<Rbin.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an existing Recycle Bin retention rule. You can update a retention rule's description, resource tags, and retention period at any time after creation. You can't update a retention rule's resource type after creation. For more information, see  Update Recycle Bin retention rules in the Amazon Elastic Compute Cloud User Guide.
   */
  updateRule(params: Rbin.Types.UpdateRuleRequest, callback?: (err: AWSError, data: Rbin.Types.UpdateRuleResponse) => void): Request<Rbin.Types.UpdateRuleResponse, AWSError>;
  /**
   * Updates an existing Recycle Bin retention rule. You can update a retention rule's description, resource tags, and retention period at any time after creation. You can't update a retention rule's resource type after creation. For more information, see  Update Recycle Bin retention rules in the Amazon Elastic Compute Cloud User Guide.
   */
  updateRule(callback?: (err: AWSError, data: Rbin.Types.UpdateRuleResponse) => void): Request<Rbin.Types.UpdateRuleResponse, AWSError>;
}
declare namespace Rbin {
  export interface CreateRuleRequest {
    /**
     * Information about the retention period for which the retention rule is to retain resources.
     */
    RetentionPeriod: RetentionPeriod;
    /**
     * The retention rule description.
     */
    Description?: Description;
    /**
     * Information about the tags to assign to the retention rule.
     */
    Tags?: TagList;
    /**
     * The resource type to be retained by the retention rule. Currently, only Amazon EBS snapshots and EBS-backed AMIs are supported. To retain snapshots, specify EBS_SNAPSHOT. To retain EBS-backed AMIs, specify EC2_IMAGE.
     */
    ResourceType: ResourceType;
    /**
     * Specifies the resource tags to use to identify resources that are to be retained by a tag-level retention rule. For tag-level retention rules, only deleted resources, of the specified resource type, that have one or more of the specified tag key and value pairs are retained. If a resource is deleted, but it does not have any of the specified tag key and value pairs, it is immediately deleted without being retained by the retention rule. You can add the same tag key and value pair to a maximum or five retention rules. To create a Region-level retention rule, omit this parameter. A Region-level retention rule does not have any resource tags specified. It retains all deleted resources of the specified resource type in the Region in which the rule is created, even if the resources are not tagged.
     */
    ResourceTags?: ResourceTags;
    /**
     * Information about the retention rule lock configuration.
     */
    LockConfiguration?: LockConfiguration;
  }
  export interface CreateRuleResponse {
    /**
     * The unique ID of the retention rule.
     */
    Identifier?: RuleIdentifier;
    RetentionPeriod?: RetentionPeriod;
    /**
     * The retention rule description.
     */
    Description?: Description;
    /**
     * Information about the tags assigned to the retention rule.
     */
    Tags?: TagList;
    /**
     * The resource type retained by the retention rule.
     */
    ResourceType?: ResourceType;
    /**
     * Information about the resource tags used to identify resources that are retained by the retention rule.
     */
    ResourceTags?: ResourceTags;
    /**
     * The state of the retention rule. Only retention rules that are in the available state retain resources.
     */
    Status?: RuleStatus;
    /**
     * Information about the retention rule lock configuration.
     */
    LockConfiguration?: LockConfiguration;
    /**
     * The lock state for the retention rule.    locked - The retention rule is locked and can't be modified or deleted.    pending_unlock - The retention rule has been unlocked but it is still within the unlock delay period. The retention rule can be modified or deleted only after the unlock delay period has expired.    unlocked - The retention rule is unlocked and it can be modified or deleted by any user with the required permissions.    null - The retention rule has never been locked. Once a retention rule has been locked, it can transition between the locked and unlocked states only; it can never transition back to null.  
     */
    LockState?: LockState;
  }
  export interface DeleteRuleRequest {
    /**
     * The unique ID of the retention rule.
     */
    Identifier: RuleIdentifier;
  }
  export interface DeleteRuleResponse {
  }
  export type Description = string;
  export interface GetRuleRequest {
    /**
     * The unique ID of the retention rule.
     */
    Identifier: RuleIdentifier;
  }
  export interface GetRuleResponse {
    /**
     * The unique ID of the retention rule.
     */
    Identifier?: RuleIdentifier;
    /**
     * The retention rule description.
     */
    Description?: Description;
    /**
     * The resource type retained by the retention rule.
     */
    ResourceType?: ResourceType;
    /**
     * Information about the retention period for which the retention rule is to retain resources.
     */
    RetentionPeriod?: RetentionPeriod;
    /**
     * Information about the resource tags used to identify resources that are retained by the retention rule.
     */
    ResourceTags?: ResourceTags;
    /**
     * The state of the retention rule. Only retention rules that are in the available state retain resources.
     */
    Status?: RuleStatus;
    /**
     * Information about the retention rule lock configuration.
     */
    LockConfiguration?: LockConfiguration;
    /**
     * The lock state for the retention rule.    locked - The retention rule is locked and can't be modified or deleted.    pending_unlock - The retention rule has been unlocked but it is still within the unlock delay period. The retention rule can be modified or deleted only after the unlock delay period has expired.    unlocked - The retention rule is unlocked and it can be modified or deleted by any user with the required permissions.    null - The retention rule has never been locked. Once a retention rule has been locked, it can transition between the locked and unlocked states only; it can never transition back to null.  
     */
    LockState?: LockState;
    /**
     * The date and time at which the unlock delay is set to expire. Only returned for retention rules that have been unlocked and that are still within the unlock delay period.
     */
    LockEndTime?: TimeStamp;
  }
  export interface ListRulesRequest {
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned NextToken value.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
    /**
     * The resource type retained by the retention rule. Only retention rules that retain the specified resource type are listed. Currently, only Amazon EBS snapshots and EBS-backed AMIs are supported. To list retention rules that retain snapshots, specify EBS_SNAPSHOT. To list retention rules that retain EBS-backed AMIs, specify EC2_IMAGE.
     */
    ResourceType: ResourceType;
    /**
     * Information about the resource tags used to identify resources that are retained by the retention rule.
     */
    ResourceTags?: ResourceTags;
    /**
     * The lock state of the retention rules to list. Only retention rules with the specified lock state are returned.
     */
    LockState?: LockState;
  }
  export interface ListRulesResponse {
    /**
     * Information about the retention rules.
     */
    Rules?: RuleSummaryList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the retention rule.
     */
    ResourceArn: RuleArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Information about the tags assigned to the retention rule.
     */
    Tags?: TagList;
  }
  export interface LockConfiguration {
    /**
     * Information about the retention rule unlock delay.
     */
    UnlockDelay: UnlockDelay;
  }
  export interface LockRuleRequest {
    /**
     * The unique ID of the retention rule.
     */
    Identifier: RuleIdentifier;
    /**
     * Information about the retention rule lock configuration.
     */
    LockConfiguration: LockConfiguration;
  }
  export interface LockRuleResponse {
    /**
     * The unique ID of the retention rule.
     */
    Identifier?: RuleIdentifier;
    /**
     * The retention rule description.
     */
    Description?: Description;
    /**
     * The resource type retained by the retention rule.
     */
    ResourceType?: ResourceType;
    RetentionPeriod?: RetentionPeriod;
    /**
     * Information about the resource tags used to identify resources that are retained by the retention rule.
     */
    ResourceTags?: ResourceTags;
    /**
     * The state of the retention rule. Only retention rules that are in the available state retain resources.
     */
    Status?: RuleStatus;
    /**
     * Information about the retention rule lock configuration.
     */
    LockConfiguration?: LockConfiguration;
    /**
     * The lock state for the retention rule.    locked - The retention rule is locked and can't be modified or deleted.    pending_unlock - The retention rule has been unlocked but it is still within the unlock delay period. The retention rule can be modified or deleted only after the unlock delay period has expired.    unlocked - The retention rule is unlocked and it can be modified or deleted by any user with the required permissions.    null - The retention rule has never been locked. Once a retention rule has been locked, it can transition between the locked and unlocked states only; it can never transition back to null.  
     */
    LockState?: LockState;
  }
  export type LockState = "locked"|"pending_unlock"|"unlocked"|string;
  export type MaxResults = number;
  export type NextToken = string;
  export interface ResourceTag {
    /**
     * The tag key.
     */
    ResourceTagKey: ResourceTagKey;
    /**
     * The tag value.
     */
    ResourceTagValue?: ResourceTagValue;
  }
  export type ResourceTagKey = string;
  export type ResourceTagValue = string;
  export type ResourceTags = ResourceTag[];
  export type ResourceType = "EBS_SNAPSHOT"|"EC2_IMAGE"|string;
  export interface RetentionPeriod {
    /**
     * The period value for which the retention rule is to retain resources. The period is measured using the unit specified for RetentionPeriodUnit.
     */
    RetentionPeriodValue: RetentionPeriodValue;
    /**
     * The unit of time in which the retention period is measured. Currently, only DAYS is supported.
     */
    RetentionPeriodUnit: RetentionPeriodUnit;
  }
  export type RetentionPeriodUnit = "DAYS"|string;
  export type RetentionPeriodValue = number;
  export type RuleArn = string;
  export type RuleIdentifier = string;
  export type RuleStatus = "pending"|"available"|string;
  export interface RuleSummary {
    /**
     * The unique ID of the retention rule.
     */
    Identifier?: RuleIdentifier;
    /**
     * The retention rule description.
     */
    Description?: Description;
    /**
     * Information about the retention period for which the retention rule is to retain resources.
     */
    RetentionPeriod?: RetentionPeriod;
    /**
     * The lock state for the retention rule.    locked - The retention rule is locked and can't be modified or deleted.    pending_unlock - The retention rule has been unlocked but it is still within the unlock delay period. The retention rule can be modified or deleted only after the unlock delay period has expired.    unlocked - The retention rule is unlocked and it can be modified or deleted by any user with the required permissions.    null - The retention rule has never been locked. Once a retention rule has been locked, it can transition between the locked and unlocked states only; it can never transition back to null.  
     */
    LockState?: LockState;
  }
  export type RuleSummaryList = RuleSummary[];
  export interface Tag {
    /**
     * The tag key.
     */
    Key: TagKey;
    /**
     * The tag value.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the retention rule.
     */
    ResourceArn: RuleArn;
    /**
     * Information about the tags to assign to the retention rule.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TimeStamp = Date;
  export interface UnlockDelay {
    /**
     * The unlock delay period, measured in the unit specified for  UnlockDelayUnit.
     */
    UnlockDelayValue: UnlockDelayValue;
    /**
     * The unit of time in which to measure the unlock delay. Currently, the unlock delay can be measure only in days.
     */
    UnlockDelayUnit: UnlockDelayUnit;
  }
  export type UnlockDelayUnit = "DAYS"|string;
  export type UnlockDelayValue = number;
  export interface UnlockRuleRequest {
    /**
     * The unique ID of the retention rule.
     */
    Identifier: RuleIdentifier;
  }
  export interface UnlockRuleResponse {
    /**
     * The unique ID of the retention rule.
     */
    Identifier?: RuleIdentifier;
    /**
     * The retention rule description.
     */
    Description?: Description;
    /**
     * The resource type retained by the retention rule.
     */
    ResourceType?: ResourceType;
    RetentionPeriod?: RetentionPeriod;
    /**
     * Information about the resource tags used to identify resources that are retained by the retention rule.
     */
    ResourceTags?: ResourceTags;
    /**
     * The state of the retention rule. Only retention rules that are in the available state retain resources.
     */
    Status?: RuleStatus;
    /**
     * Information about the retention rule lock configuration.
     */
    LockConfiguration?: LockConfiguration;
    /**
     * The lock state for the retention rule.    locked - The retention rule is locked and can't be modified or deleted.    pending_unlock - The retention rule has been unlocked but it is still within the unlock delay period. The retention rule can be modified or deleted only after the unlock delay period has expired.    unlocked - The retention rule is unlocked and it can be modified or deleted by any user with the required permissions.    null - The retention rule has never been locked. Once a retention rule has been locked, it can transition between the locked and unlocked states only; it can never transition back to null.  
     */
    LockState?: LockState;
    /**
     * The date and time at which the unlock delay is set to expire. Only returned for retention rules that have been unlocked and that are still within the unlock delay period.
     */
    LockEndTime?: TimeStamp;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the retention rule.
     */
    ResourceArn: RuleArn;
    /**
     * The tag keys of the tags to unassign. All tags that have the specified tag key are unassigned.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateRuleRequest {
    /**
     * The unique ID of the retention rule.
     */
    Identifier: RuleIdentifier;
    /**
     * Information about the retention period for which the retention rule is to retain resources.
     */
    RetentionPeriod?: RetentionPeriod;
    /**
     * The retention rule description.
     */
    Description?: Description;
    /**
     *  This parameter is currently not supported. You can't update a retention rule's resource type after creation. 
     */
    ResourceType?: ResourceType;
    /**
     * Specifies the resource tags to use to identify resources that are to be retained by a tag-level retention rule. For tag-level retention rules, only deleted resources, of the specified resource type, that have one or more of the specified tag key and value pairs are retained. If a resource is deleted, but it does not have any of the specified tag key and value pairs, it is immediately deleted without being retained by the retention rule. You can add the same tag key and value pair to a maximum or five retention rules. To create a Region-level retention rule, omit this parameter. A Region-level retention rule does not have any resource tags specified. It retains all deleted resources of the specified resource type in the Region in which the rule is created, even if the resources are not tagged.
     */
    ResourceTags?: ResourceTags;
  }
  export interface UpdateRuleResponse {
    /**
     * The unique ID of the retention rule.
     */
    Identifier?: RuleIdentifier;
    RetentionPeriod?: RetentionPeriod;
    /**
     * The retention rule description.
     */
    Description?: Description;
    /**
     * The resource type retained by the retention rule.
     */
    ResourceType?: ResourceType;
    /**
     * Information about the resource tags used to identify resources that are retained by the retention rule.
     */
    ResourceTags?: ResourceTags;
    /**
     * The state of the retention rule. Only retention rules that are in the available state retain resources.
     */
    Status?: RuleStatus;
    /**
     * The lock state for the retention rule.    locked - The retention rule is locked and can't be modified or deleted.    pending_unlock - The retention rule has been unlocked but it is still within the unlock delay period. The retention rule can be modified or deleted only after the unlock delay period has expired.    unlocked - The retention rule is unlocked and it can be modified or deleted by any user with the required permissions.    null - The retention rule has never been locked. Once a retention rule has been locked, it can transition between the locked and unlocked states only; it can never transition back to null.  
     */
    LockState?: LockState;
    /**
     * The date and time at which the unlock delay is set to expire. Only returned for retention rules that have been unlocked and that are still within the unlock delay period.
     */
    LockEndTime?: TimeStamp;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-06-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Rbin client.
   */
  export import Types = Rbin;
}
export = Rbin;
