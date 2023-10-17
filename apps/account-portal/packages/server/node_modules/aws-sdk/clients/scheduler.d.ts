import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Scheduler extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Scheduler.Types.ClientConfiguration)
  config: Config & Scheduler.Types.ClientConfiguration;
  /**
   * Creates the specified schedule.
   */
  createSchedule(params: Scheduler.Types.CreateScheduleInput, callback?: (err: AWSError, data: Scheduler.Types.CreateScheduleOutput) => void): Request<Scheduler.Types.CreateScheduleOutput, AWSError>;
  /**
   * Creates the specified schedule.
   */
  createSchedule(callback?: (err: AWSError, data: Scheduler.Types.CreateScheduleOutput) => void): Request<Scheduler.Types.CreateScheduleOutput, AWSError>;
  /**
   * Creates the specified schedule group.
   */
  createScheduleGroup(params: Scheduler.Types.CreateScheduleGroupInput, callback?: (err: AWSError, data: Scheduler.Types.CreateScheduleGroupOutput) => void): Request<Scheduler.Types.CreateScheduleGroupOutput, AWSError>;
  /**
   * Creates the specified schedule group.
   */
  createScheduleGroup(callback?: (err: AWSError, data: Scheduler.Types.CreateScheduleGroupOutput) => void): Request<Scheduler.Types.CreateScheduleGroupOutput, AWSError>;
  /**
   * Deletes the specified schedule.
   */
  deleteSchedule(params: Scheduler.Types.DeleteScheduleInput, callback?: (err: AWSError, data: Scheduler.Types.DeleteScheduleOutput) => void): Request<Scheduler.Types.DeleteScheduleOutput, AWSError>;
  /**
   * Deletes the specified schedule.
   */
  deleteSchedule(callback?: (err: AWSError, data: Scheduler.Types.DeleteScheduleOutput) => void): Request<Scheduler.Types.DeleteScheduleOutput, AWSError>;
  /**
   * Deletes the specified schedule group. Deleting a schedule group results in EventBridge Scheduler deleting all schedules associated with the group. When you delete a group, it remains in a DELETING state until all of its associated schedules are deleted. Schedules associated with the group that are set to run while the schedule group is in the process of being deleted might continue to invoke their targets until the schedule group and its associated schedules are deleted.   This operation is eventually consistent.  
   */
  deleteScheduleGroup(params: Scheduler.Types.DeleteScheduleGroupInput, callback?: (err: AWSError, data: Scheduler.Types.DeleteScheduleGroupOutput) => void): Request<Scheduler.Types.DeleteScheduleGroupOutput, AWSError>;
  /**
   * Deletes the specified schedule group. Deleting a schedule group results in EventBridge Scheduler deleting all schedules associated with the group. When you delete a group, it remains in a DELETING state until all of its associated schedules are deleted. Schedules associated with the group that are set to run while the schedule group is in the process of being deleted might continue to invoke their targets until the schedule group and its associated schedules are deleted.   This operation is eventually consistent.  
   */
  deleteScheduleGroup(callback?: (err: AWSError, data: Scheduler.Types.DeleteScheduleGroupOutput) => void): Request<Scheduler.Types.DeleteScheduleGroupOutput, AWSError>;
  /**
   * Retrieves the specified schedule.
   */
  getSchedule(params: Scheduler.Types.GetScheduleInput, callback?: (err: AWSError, data: Scheduler.Types.GetScheduleOutput) => void): Request<Scheduler.Types.GetScheduleOutput, AWSError>;
  /**
   * Retrieves the specified schedule.
   */
  getSchedule(callback?: (err: AWSError, data: Scheduler.Types.GetScheduleOutput) => void): Request<Scheduler.Types.GetScheduleOutput, AWSError>;
  /**
   * Retrieves the specified schedule group.
   */
  getScheduleGroup(params: Scheduler.Types.GetScheduleGroupInput, callback?: (err: AWSError, data: Scheduler.Types.GetScheduleGroupOutput) => void): Request<Scheduler.Types.GetScheduleGroupOutput, AWSError>;
  /**
   * Retrieves the specified schedule group.
   */
  getScheduleGroup(callback?: (err: AWSError, data: Scheduler.Types.GetScheduleGroupOutput) => void): Request<Scheduler.Types.GetScheduleGroupOutput, AWSError>;
  /**
   * Returns a paginated list of your schedule groups.
   */
  listScheduleGroups(params: Scheduler.Types.ListScheduleGroupsInput, callback?: (err: AWSError, data: Scheduler.Types.ListScheduleGroupsOutput) => void): Request<Scheduler.Types.ListScheduleGroupsOutput, AWSError>;
  /**
   * Returns a paginated list of your schedule groups.
   */
  listScheduleGroups(callback?: (err: AWSError, data: Scheduler.Types.ListScheduleGroupsOutput) => void): Request<Scheduler.Types.ListScheduleGroupsOutput, AWSError>;
  /**
   * Returns a paginated list of your EventBridge Scheduler schedules.
   */
  listSchedules(params: Scheduler.Types.ListSchedulesInput, callback?: (err: AWSError, data: Scheduler.Types.ListSchedulesOutput) => void): Request<Scheduler.Types.ListSchedulesOutput, AWSError>;
  /**
   * Returns a paginated list of your EventBridge Scheduler schedules.
   */
  listSchedules(callback?: (err: AWSError, data: Scheduler.Types.ListSchedulesOutput) => void): Request<Scheduler.Types.ListSchedulesOutput, AWSError>;
  /**
   * Lists the tags associated with the Scheduler resource.
   */
  listTagsForResource(params: Scheduler.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: Scheduler.Types.ListTagsForResourceOutput) => void): Request<Scheduler.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists the tags associated with the Scheduler resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Scheduler.Types.ListTagsForResourceOutput) => void): Request<Scheduler.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified EventBridge Scheduler resource. You can only assign tags to schedule groups.
   */
  tagResource(params: Scheduler.Types.TagResourceInput, callback?: (err: AWSError, data: Scheduler.Types.TagResourceOutput) => void): Request<Scheduler.Types.TagResourceOutput, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified EventBridge Scheduler resource. You can only assign tags to schedule groups.
   */
  tagResource(callback?: (err: AWSError, data: Scheduler.Types.TagResourceOutput) => void): Request<Scheduler.Types.TagResourceOutput, AWSError>;
  /**
   * Removes one or more tags from the specified EventBridge Scheduler schedule group.
   */
  untagResource(params: Scheduler.Types.UntagResourceInput, callback?: (err: AWSError, data: Scheduler.Types.UntagResourceOutput) => void): Request<Scheduler.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes one or more tags from the specified EventBridge Scheduler schedule group.
   */
  untagResource(callback?: (err: AWSError, data: Scheduler.Types.UntagResourceOutput) => void): Request<Scheduler.Types.UntagResourceOutput, AWSError>;
  /**
   *  Updates the specified schedule. When you call UpdateSchedule, EventBridge Scheduler uses all values, including empty values, specified in the request and overrides the existing schedule. This is by design. This means that if you do not set an optional field in your request, that field will be set to its system-default value after the update.   Before calling this operation, we recommend that you call the GetSchedule API operation and make a note of all optional parameters for your UpdateSchedule call. 
   */
  updateSchedule(params: Scheduler.Types.UpdateScheduleInput, callback?: (err: AWSError, data: Scheduler.Types.UpdateScheduleOutput) => void): Request<Scheduler.Types.UpdateScheduleOutput, AWSError>;
  /**
   *  Updates the specified schedule. When you call UpdateSchedule, EventBridge Scheduler uses all values, including empty values, specified in the request and overrides the existing schedule. This is by design. This means that if you do not set an optional field in your request, that field will be set to its system-default value after the update.   Before calling this operation, we recommend that you call the GetSchedule API operation and make a note of all optional parameters for your UpdateSchedule call. 
   */
  updateSchedule(callback?: (err: AWSError, data: Scheduler.Types.UpdateScheduleOutput) => void): Request<Scheduler.Types.UpdateScheduleOutput, AWSError>;
}
declare namespace Scheduler {
  export type ActionAfterCompletion = "NONE"|"DELETE"|string;
  export type AssignPublicIp = "ENABLED"|"DISABLED"|string;
  export interface AwsVpcConfiguration {
    /**
     * Specifies whether the task's elastic network interface receives a public IP address. You can specify ENABLED only when LaunchType in EcsParameters is set to FARGATE.
     */
    AssignPublicIp?: AssignPublicIp;
    /**
     * Specifies the security groups associated with the task. These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
     */
    SecurityGroups?: SecurityGroups;
    /**
     * Specifies the subnets associated with the task. These subnets must all be in the same VPC. You can specify as many as 16 subnets.
     */
    Subnets: Subnets;
  }
  export type CapacityProvider = string;
  export type CapacityProviderStrategy = CapacityProviderStrategyItem[];
  export interface CapacityProviderStrategyItem {
    /**
     * The base value designates how many tasks, at a minimum, to run on the specified capacity provider. Only one capacity provider in a capacity provider strategy can have a base defined. If no value is specified, the default value of 0 is used.
     */
    base?: CapacityProviderStrategyItemBase;
    /**
     * The short name of the capacity provider.
     */
    capacityProvider: CapacityProvider;
    /**
     * The weight value designates the relative percentage of the total number of tasks launched that should use the specified capacity provider. The weight value is taken into consideration after the base value, if defined, is satisfied.
     */
    weight?: CapacityProviderStrategyItemWeight;
  }
  export type CapacityProviderStrategyItemBase = number;
  export type CapacityProviderStrategyItemWeight = number;
  export type ClientToken = string;
  export interface CreateScheduleGroupInput {
    /**
     *  Unique, case-sensitive identifier you provide to ensure the idempotency of the request. If you do not specify a client token, EventBridge Scheduler uses a randomly generated token for the request to ensure idempotency. 
     */
    ClientToken?: ClientToken;
    /**
     * The name of the schedule group that you are creating.
     */
    Name: ScheduleGroupName;
    /**
     * The list of tags to associate with the schedule group.
     */
    Tags?: TagList;
  }
  export interface CreateScheduleGroupOutput {
    /**
     * The Amazon Resource Name (ARN) of the schedule group.
     */
    ScheduleGroupArn: ScheduleGroupArn;
  }
  export interface CreateScheduleInput {
    /**
     * Specifies the action that EventBridge Scheduler applies to the schedule after the schedule completes invoking the target.
     */
    ActionAfterCompletion?: ActionAfterCompletion;
    /**
     *  Unique, case-sensitive identifier you provide to ensure the idempotency of the request. If you do not specify a client token, EventBridge Scheduler uses a randomly generated token for the request to ensure idempotency. 
     */
    ClientToken?: ClientToken;
    /**
     * The description you specify for the schedule.
     */
    Description?: Description;
    /**
     * The date, in UTC, before which the schedule can invoke its target. Depending on the schedule's recurrence expression, invocations might stop on, or before, the EndDate you specify. EventBridge Scheduler ignores EndDate for one-time schedules.
     */
    EndDate?: EndDate;
    /**
     * Allows you to configure a time window during which EventBridge Scheduler invokes the schedule.
     */
    FlexibleTimeWindow: FlexibleTimeWindow;
    /**
     * The name of the schedule group to associate with this schedule. If you omit this, the default schedule group is used.
     */
    GroupName?: ScheduleGroupName;
    /**
     * The Amazon Resource Name (ARN) for the customer managed KMS key that EventBridge Scheduler will use to encrypt and decrypt your data.
     */
    KmsKeyArn?: KmsKeyArn;
    /**
     * The name of the schedule that you are creating.
     */
    Name: Name;
    /**
     *  The expression that defines when the schedule runs. The following formats are supported.     at expression - at(yyyy-mm-ddThh:mm:ss)     rate expression - rate(value unit)     cron expression - cron(fields)     You can use at expressions to create one-time schedules that invoke a target once, at the time and in the time zone, that you specify. You can use rate and cron expressions to create recurring schedules. Rate-based schedules are useful when you want to invoke a target at regular intervals, such as every 15 minutes or every five days. Cron-based schedules are useful when you want to invoke a target periodically at a specific time, such as at 8:00 am (UTC+0) every 1st day of the month.   A cron expression consists of six fields separated by white spaces: (minutes hours day_of_month month day_of_week year).   A rate expression consists of a value as a positive integer, and a unit with the following options: minute | minutes | hour | hours | day | days   For more information and examples, see Schedule types on EventBridge Scheduler in the EventBridge Scheduler User Guide. 
     */
    ScheduleExpression: ScheduleExpression;
    /**
     * The timezone in which the scheduling expression is evaluated.
     */
    ScheduleExpressionTimezone?: ScheduleExpressionTimezone;
    /**
     * The date, in UTC, after which the schedule can begin invoking its target. Depending on the schedule's recurrence expression, invocations might occur on, or after, the StartDate you specify. EventBridge Scheduler ignores StartDate for one-time schedules.
     */
    StartDate?: StartDate;
    /**
     * Specifies whether the schedule is enabled or disabled.
     */
    State?: ScheduleState;
    /**
     * The schedule's target.
     */
    Target: Target;
  }
  export interface CreateScheduleOutput {
    /**
     * The Amazon Resource Name (ARN) of the schedule.
     */
    ScheduleArn: ScheduleArn;
  }
  export type CreationDate = Date;
  export interface DeadLetterConfig {
    /**
     * The Amazon Resource Name (ARN) of the SQS queue specified as the destination for the dead-letter queue.
     */
    Arn?: DeadLetterConfigArnString;
  }
  export type DeadLetterConfigArnString = string;
  export interface DeleteScheduleGroupInput {
    /**
     *  Unique, case-sensitive identifier you provide to ensure the idempotency of the request. If you do not specify a client token, EventBridge Scheduler uses a randomly generated token for the request to ensure idempotency. 
     */
    ClientToken?: ClientToken;
    /**
     * The name of the schedule group to delete.
     */
    Name: ScheduleGroupName;
  }
  export interface DeleteScheduleGroupOutput {
  }
  export interface DeleteScheduleInput {
    /**
     *  Unique, case-sensitive identifier you provide to ensure the idempotency of the request. If you do not specify a client token, EventBridge Scheduler uses a randomly generated token for the request to ensure idempotency. 
     */
    ClientToken?: ClientToken;
    /**
     * The name of the schedule group associated with this schedule. If you omit this, the default schedule group is used.
     */
    GroupName?: ScheduleGroupName;
    /**
     * The name of the schedule to delete.
     */
    Name: Name;
  }
  export interface DeleteScheduleOutput {
  }
  export type Description = string;
  export type DetailType = string;
  export interface EcsParameters {
    /**
     * The capacity provider strategy to use for the task.
     */
    CapacityProviderStrategy?: CapacityProviderStrategy;
    /**
     * Specifies whether to enable Amazon ECS managed tags for the task. For more information, see Tagging Your Amazon ECS Resources in the Amazon ECS Developer Guide.
     */
    EnableECSManagedTags?: EnableECSManagedTags;
    /**
     * Whether or not to enable the execute command functionality for the containers in this task. If true, this enables execute command functionality on all containers in the task.
     */
    EnableExecuteCommand?: EnableExecuteCommand;
    /**
     * Specifies an ECS task group for the task. The maximum length is 255 characters.
     */
    Group?: Group;
    /**
     * Specifies the launch type on which your task is running. The launch type that you specify here must match one of the launch type (compatibilities) of the target task. The FARGATE value is supported only in the Regions where Fargate with Amazon ECS is supported. For more information, see AWS Fargate on Amazon ECS in the Amazon ECS Developer Guide.
     */
    LaunchType?: LaunchType;
    /**
     * This structure specifies the network configuration for an ECS task.
     */
    NetworkConfiguration?: NetworkConfiguration;
    /**
     * An array of placement constraint objects to use for the task. You can specify up to 10 constraints per task (including constraints in the task definition and those specified at runtime).
     */
    PlacementConstraints?: PlacementConstraints;
    /**
     * The task placement strategy for a task or service.
     */
    PlacementStrategy?: PlacementStrategies;
    /**
     * Specifies the platform version for the task. Specify only the numeric portion of the platform version, such as 1.1.0.
     */
    PlatformVersion?: PlatformVersion;
    /**
     * Specifies whether to propagate the tags from the task definition to the task. If no value is specified, the tags are not propagated. Tags can only be propagated to the task during task creation. To add tags to a task after task creation, use Amazon ECS's  TagResource  API action. 
     */
    PropagateTags?: PropagateTags;
    /**
     * The reference ID to use for the task.
     */
    ReferenceId?: ReferenceId;
    /**
     * The metadata that you apply to the task to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. For more information, see  RunTask  in the Amazon ECS API Reference.
     */
    Tags?: Tags;
    /**
     * The number of tasks to create based on TaskDefinition. The default is 1.
     */
    TaskCount?: TaskCount;
    /**
     * The Amazon Resource Name (ARN) of the task definition to use if the event target is an Amazon ECS task.
     */
    TaskDefinitionArn: TaskDefinitionArn;
  }
  export type EnableECSManagedTags = boolean;
  export type EnableExecuteCommand = boolean;
  export type EndDate = Date;
  export interface EventBridgeParameters {
    /**
     * A free-form string, with a maximum of 128 characters, used to decide what fields to expect in the event detail.
     */
    DetailType: DetailType;
    /**
     * The source of the event.
     */
    Source: Source;
  }
  export interface FlexibleTimeWindow {
    /**
     * The maximum time window during which a schedule can be invoked.
     */
    MaximumWindowInMinutes?: MaximumWindowInMinutes;
    /**
     * Determines whether the schedule is invoked within a flexible time window.
     */
    Mode: FlexibleTimeWindowMode;
  }
  export type FlexibleTimeWindowMode = "OFF"|"FLEXIBLE"|string;
  export interface GetScheduleGroupInput {
    /**
     * The name of the schedule group to retrieve.
     */
    Name: ScheduleGroupName;
  }
  export interface GetScheduleGroupOutput {
    /**
     * The Amazon Resource Name (ARN) of the schedule group.
     */
    Arn?: ScheduleGroupArn;
    /**
     * The time at which the schedule group was created.
     */
    CreationDate?: CreationDate;
    /**
     * The time at which the schedule group was last modified.
     */
    LastModificationDate?: LastModificationDate;
    /**
     * The name of the schedule group.
     */
    Name?: ScheduleGroupName;
    /**
     * Specifies the state of the schedule group.
     */
    State?: ScheduleGroupState;
  }
  export interface GetScheduleInput {
    /**
     * The name of the schedule group associated with this schedule. If you omit this, EventBridge Scheduler assumes that the schedule is associated with the default group.
     */
    GroupName?: ScheduleGroupName;
    /**
     * The name of the schedule to retrieve.
     */
    Name: Name;
  }
  export interface GetScheduleOutput {
    /**
     * Indicates the action that EventBridge Scheduler applies to the schedule after the schedule completes invoking the target.
     */
    ActionAfterCompletion?: ActionAfterCompletion;
    /**
     * The Amazon Resource Name (ARN) of the schedule.
     */
    Arn?: ScheduleArn;
    /**
     * The time at which the schedule was created.
     */
    CreationDate?: CreationDate;
    /**
     * The description of the schedule.
     */
    Description?: Description;
    /**
     * The date, in UTC, before which the schedule can invoke its target. Depending on the schedule's recurrence expression, invocations might stop on, or before, the EndDate you specify. EventBridge Scheduler ignores EndDate for one-time schedules.
     */
    EndDate?: EndDate;
    /**
     * Allows you to configure a time window during which EventBridge Scheduler invokes the schedule.
     */
    FlexibleTimeWindow?: FlexibleTimeWindow;
    /**
     * The name of the schedule group associated with this schedule.
     */
    GroupName?: ScheduleGroupName;
    /**
     * The ARN for a customer managed KMS Key that is be used to encrypt and decrypt your data.
     */
    KmsKeyArn?: KmsKeyArn;
    /**
     * The time at which the schedule was last modified.
     */
    LastModificationDate?: LastModificationDate;
    /**
     * The name of the schedule.
     */
    Name?: Name;
    /**
     *  The expression that defines when the schedule runs. The following formats are supported.     at expression - at(yyyy-mm-ddThh:mm:ss)     rate expression - rate(value unit)     cron expression - cron(fields)     You can use at expressions to create one-time schedules that invoke a target once, at the time and in the time zone, that you specify. You can use rate and cron expressions to create recurring schedules. Rate-based schedules are useful when you want to invoke a target at regular intervals, such as every 15 minutes or every five days. Cron-based schedules are useful when you want to invoke a target periodically at a specific time, such as at 8:00 am (UTC+0) every 1st day of the month.   A cron expression consists of six fields separated by white spaces: (minutes hours day_of_month month day_of_week year).   A rate expression consists of a value as a positive integer, and a unit with the following options: minute | minutes | hour | hours | day | days   For more information and examples, see Schedule types on EventBridge Scheduler in the EventBridge Scheduler User Guide. 
     */
    ScheduleExpression?: ScheduleExpression;
    /**
     * The timezone in which the scheduling expression is evaluated.
     */
    ScheduleExpressionTimezone?: ScheduleExpressionTimezone;
    /**
     * The date, in UTC, after which the schedule can begin invoking its target. Depending on the schedule's recurrence expression, invocations might occur on, or after, the StartDate you specify. EventBridge Scheduler ignores StartDate for one-time schedules.
     */
    StartDate?: StartDate;
    /**
     * Specifies whether the schedule is enabled or disabled.
     */
    State?: ScheduleState;
    /**
     * The schedule target.
     */
    Target?: Target;
  }
  export type Group = string;
  export interface KinesisParameters {
    /**
     * Specifies the shard to which EventBridge Scheduler sends the event. For more information, see Amazon Kinesis Data Streams terminology and concepts in the Amazon Kinesis Streams Developer Guide.
     */
    PartitionKey: TargetPartitionKey;
  }
  export type KmsKeyArn = string;
  export type LastModificationDate = Date;
  export type LaunchType = "EC2"|"FARGATE"|"EXTERNAL"|string;
  export interface ListScheduleGroupsInput {
    /**
     * If specified, limits the number of results returned by this operation. The operation also returns a NextToken which you can use in a subsequent operation to retrieve the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * The name prefix that you can use to return a filtered list of your schedule groups.
     */
    NamePrefix?: ScheduleGroupNamePrefix;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListScheduleGroupsOutput {
    /**
     * Indicates whether there are additional results to retrieve. If the value is null, there are no more results.
     */
    NextToken?: NextToken;
    /**
     * The schedule groups that match the specified criteria.
     */
    ScheduleGroups: ScheduleGroupList;
  }
  export interface ListSchedulesInput {
    /**
     * If specified, only lists the schedules whose associated schedule group matches the given filter.
     */
    GroupName?: ScheduleGroupName;
    /**
     * If specified, limits the number of results returned by this operation. The operation also returns a NextToken which you can use in a subsequent operation to retrieve the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * Schedule name prefix to return the filtered list of resources.
     */
    NamePrefix?: NamePrefix;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * If specified, only lists the schedules whose current state matches the given filter.
     */
    State?: ScheduleState;
  }
  export interface ListSchedulesOutput {
    /**
     * Indicates whether there are additional results to retrieve. If the value is null, there are no more results.
     */
    NextToken?: NextToken;
    /**
     * The schedules that match the specified criteria.
     */
    Schedules: ScheduleList;
  }
  export interface ListTagsForResourceInput {
    /**
     * The ARN of the EventBridge Scheduler resource for which you want to view tags.
     */
    ResourceArn: TagResourceArn;
  }
  export interface ListTagsForResourceOutput {
    /**
     * The list of tags associated with the specified resource.
     */
    Tags?: TagList;
  }
  export type MaxResults = number;
  export type MaximumEventAgeInSeconds = number;
  export type MaximumRetryAttempts = number;
  export type MaximumWindowInMinutes = number;
  export type MessageGroupId = string;
  export type Name = string;
  export type NamePrefix = string;
  export interface NetworkConfiguration {
    /**
     * Specifies the Amazon VPC subnets and security groups for the task, and whether a public IP address is to be used. This structure is relevant only for ECS tasks that use the awsvpc network mode.
     */
    awsvpcConfiguration?: AwsVpcConfiguration;
  }
  export type NextToken = string;
  export interface PlacementConstraint {
    /**
     * A cluster query language expression to apply to the constraint. You cannot specify an expression if the constraint type is distinctInstance. For more information, see Cluster query language in the Amazon ECS Developer Guide.
     */
    expression?: PlacementConstraintExpression;
    /**
     * The type of constraint. Use distinctInstance to ensure that each task in a particular group is running on a different container instance. Use memberOf to restrict the selection to a group of valid candidates.
     */
    type?: PlacementConstraintType;
  }
  export type PlacementConstraintExpression = string;
  export type PlacementConstraintType = "distinctInstance"|"memberOf"|string;
  export type PlacementConstraints = PlacementConstraint[];
  export type PlacementStrategies = PlacementStrategy[];
  export interface PlacementStrategy {
    /**
     * The field to apply the placement strategy against. For the spread placement strategy, valid values are instanceId (or instanceId, which has the same effect), or any platform or custom attribute that is applied to a container instance, such as attribute:ecs.availability-zone. For the binpack placement strategy, valid values are cpu and memory. For the random placement strategy, this field is not used.
     */
    field?: PlacementStrategyField;
    /**
     * The type of placement strategy. The random placement strategy randomly places tasks on available candidates. The spread placement strategy spreads placement across available candidates evenly based on the field parameter. The binpack strategy places tasks on available candidates that have the least available amount of the resource that is specified with the field parameter. For example, if you binpack on memory, a task is placed on the instance with the least amount of remaining memory (but still enough to run the task).
     */
    type?: PlacementStrategyType;
  }
  export type PlacementStrategyField = string;
  export type PlacementStrategyType = "random"|"spread"|"binpack"|string;
  export type PlatformVersion = string;
  export type PropagateTags = "TASK_DEFINITION"|string;
  export type ReferenceId = string;
  export interface RetryPolicy {
    /**
     * The maximum amount of time, in seconds, to continue to make retry attempts.
     */
    MaximumEventAgeInSeconds?: MaximumEventAgeInSeconds;
    /**
     * The maximum number of retry attempts to make before the request fails. Retry attempts with exponential backoff continue until either the maximum number of attempts is made or until the duration of the MaximumEventAgeInSeconds is reached.
     */
    MaximumRetryAttempts?: MaximumRetryAttempts;
  }
  export type RoleArn = string;
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
     * List of parameter names and values to use when executing the SageMaker Model Building Pipeline.
     */
    PipelineParameterList?: SageMakerPipelineParameterList;
  }
  export type ScheduleArn = string;
  export type ScheduleExpression = string;
  export type ScheduleExpressionTimezone = string;
  export type ScheduleGroupArn = string;
  export type ScheduleGroupList = ScheduleGroupSummary[];
  export type ScheduleGroupName = string;
  export type ScheduleGroupNamePrefix = string;
  export type ScheduleGroupState = "ACTIVE"|"DELETING"|string;
  export interface ScheduleGroupSummary {
    /**
     * The Amazon Resource Name (ARN) of the schedule group.
     */
    Arn?: ScheduleGroupArn;
    /**
     * The time at which the schedule group was created.
     */
    CreationDate?: CreationDate;
    /**
     * The time at which the schedule group was last modified.
     */
    LastModificationDate?: LastModificationDate;
    /**
     * The name of the schedule group.
     */
    Name?: ScheduleGroupName;
    /**
     * Specifies the state of the schedule group.
     */
    State?: ScheduleGroupState;
  }
  export type ScheduleList = ScheduleSummary[];
  export type ScheduleState = "ENABLED"|"DISABLED"|string;
  export interface ScheduleSummary {
    /**
     * The Amazon Resource Name (ARN) of the schedule.
     */
    Arn?: ScheduleArn;
    /**
     * The time at which the schedule was created.
     */
    CreationDate?: CreationDate;
    /**
     * The name of the schedule group associated with this schedule.
     */
    GroupName?: ScheduleGroupName;
    /**
     * The time at which the schedule was last modified.
     */
    LastModificationDate?: LastModificationDate;
    /**
     * The name of the schedule.
     */
    Name?: Name;
    /**
     * Specifies whether the schedule is enabled or disabled.
     */
    State?: ScheduleState;
    /**
     * The schedule's target details.
     */
    Target?: TargetSummary;
  }
  export type SecurityGroup = string;
  export type SecurityGroups = SecurityGroup[];
  export type Source = string;
  export interface SqsParameters {
    /**
     * The FIFO message group ID to use as the target.
     */
    MessageGroupId?: MessageGroupId;
  }
  export type StartDate = Date;
  export type Subnet = string;
  export type Subnets = Subnet[];
  export interface Tag {
    /**
     * The key for the tag.
     */
    Key: TagKey;
    /**
     * The value for the tag.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export type TagMap = {[key: string]: TagValue};
  export type TagResourceArn = string;
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the schedule group that you are adding tags to.
     */
    ResourceArn: TagResourceArn;
    /**
     * The list of tags to associate with the schedule group.
     */
    Tags: TagList;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type Tags = TagMap[];
  export interface Target {
    /**
     * The Amazon Resource Name (ARN) of the target.
     */
    Arn: TargetArn;
    /**
     * An object that contains information about an Amazon SQS queue that EventBridge Scheduler uses as a dead-letter queue for your schedule. If specified, EventBridge Scheduler delivers failed events that could not be successfully delivered to a target to the queue.
     */
    DeadLetterConfig?: DeadLetterConfig;
    /**
     * The templated target type for the Amazon ECS  RunTask  API operation.
     */
    EcsParameters?: EcsParameters;
    /**
     * The templated target type for the EventBridge  PutEvents  API operation.
     */
    EventBridgeParameters?: EventBridgeParameters;
    /**
     * The text, or well-formed JSON, passed to the target. If you are configuring a templated Lambda, AWS Step Functions, or Amazon EventBridge target, the input must be a well-formed JSON. For all other target types, a JSON is not required. If you do not specify anything for this field, EventBridge Scheduler delivers a default notification to the target.
     */
    Input?: TargetInput;
    /**
     * The templated target type for the Amazon Kinesis  PutRecord  API operation.
     */
    KinesisParameters?: KinesisParameters;
    /**
     * A RetryPolicy object that includes information about the retry policy settings, including the maximum age of an event, and the maximum number of times EventBridge Scheduler will try to deliver the event to a target.
     */
    RetryPolicy?: RetryPolicy;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that EventBridge Scheduler will use for this target when the schedule is invoked.
     */
    RoleArn: RoleArn;
    /**
     * The templated target type for the Amazon SageMaker  StartPipelineExecution  API operation.
     */
    SageMakerPipelineParameters?: SageMakerPipelineParameters;
    /**
     * The templated target type for the Amazon SQS  SendMessage  API operation. Contains the message group ID to use when the target is a FIFO queue. If you specify an Amazon SQS FIFO queue as a target, the queue must have content-based deduplication enabled. For more information, see Using the Amazon SQS message deduplication ID in the Amazon SQS Developer Guide.
     */
    SqsParameters?: SqsParameters;
  }
  export type TargetArn = string;
  export type TargetInput = string;
  export type TargetPartitionKey = string;
  export interface TargetSummary {
    /**
     * The Amazon Resource Name (ARN) of the target.
     */
    Arn: TargetArn;
  }
  export type TaskCount = number;
  export type TaskDefinitionArn = string;
  export interface UntagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the schedule group from which you are removing tags.
     */
    ResourceArn: TagResourceArn;
    /**
     * The list of tag keys to remove from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateScheduleInput {
    /**
     * Specifies the action that EventBridge Scheduler applies to the schedule after the schedule completes invoking the target.
     */
    ActionAfterCompletion?: ActionAfterCompletion;
    /**
     *  Unique, case-sensitive identifier you provide to ensure the idempotency of the request. If you do not specify a client token, EventBridge Scheduler uses a randomly generated token for the request to ensure idempotency. 
     */
    ClientToken?: ClientToken;
    /**
     * The description you specify for the schedule.
     */
    Description?: Description;
    /**
     * The date, in UTC, before which the schedule can invoke its target. Depending on the schedule's recurrence expression, invocations might stop on, or before, the EndDate you specify. EventBridge Scheduler ignores EndDate for one-time schedules.
     */
    EndDate?: EndDate;
    /**
     * Allows you to configure a time window during which EventBridge Scheduler invokes the schedule.
     */
    FlexibleTimeWindow: FlexibleTimeWindow;
    /**
     * The name of the schedule group with which the schedule is associated. You must provide this value in order for EventBridge Scheduler to find the schedule you want to update. If you omit this value, EventBridge Scheduler assumes the group is associated to the default group.
     */
    GroupName?: ScheduleGroupName;
    /**
     * The ARN for the customer managed KMS key that that you want EventBridge Scheduler to use to encrypt and decrypt your data.
     */
    KmsKeyArn?: KmsKeyArn;
    /**
     * The name of the schedule that you are updating.
     */
    Name: Name;
    /**
     *  The expression that defines when the schedule runs. The following formats are supported.     at expression - at(yyyy-mm-ddThh:mm:ss)     rate expression - rate(value unit)     cron expression - cron(fields)     You can use at expressions to create one-time schedules that invoke a target once, at the time and in the time zone, that you specify. You can use rate and cron expressions to create recurring schedules. Rate-based schedules are useful when you want to invoke a target at regular intervals, such as every 15 minutes or every five days. Cron-based schedules are useful when you want to invoke a target periodically at a specific time, such as at 8:00 am (UTC+0) every 1st day of the month.   A cron expression consists of six fields separated by white spaces: (minutes hours day_of_month month day_of_week year).   A rate expression consists of a value as a positive integer, and a unit with the following options: minute | minutes | hour | hours | day | days   For more information and examples, see Schedule types on EventBridge Scheduler in the EventBridge Scheduler User Guide. 
     */
    ScheduleExpression: ScheduleExpression;
    /**
     * The timezone in which the scheduling expression is evaluated.
     */
    ScheduleExpressionTimezone?: ScheduleExpressionTimezone;
    /**
     * The date, in UTC, after which the schedule can begin invoking its target. Depending on the schedule's recurrence expression, invocations might occur on, or after, the StartDate you specify. EventBridge Scheduler ignores StartDate for one-time schedules.
     */
    StartDate?: StartDate;
    /**
     * Specifies whether the schedule is enabled or disabled.
     */
    State?: ScheduleState;
    /**
     * The schedule target. You can use this operation to change the target that your schedule invokes.
     */
    Target: Target;
  }
  export interface UpdateScheduleOutput {
    /**
     * The Amazon Resource Name (ARN) of the schedule that you updated.
     */
    ScheduleArn: ScheduleArn;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-06-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Scheduler client.
   */
  export import Types = Scheduler;
}
export = Scheduler;
