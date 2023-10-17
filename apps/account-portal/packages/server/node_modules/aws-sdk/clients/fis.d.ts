import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Fis extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Fis.Types.ClientConfiguration)
  config: Config & Fis.Types.ClientConfiguration;
  /**
   * Creates an experiment template.  An experiment template includes the following components:    Targets: A target can be a specific resource in your Amazon Web Services environment, or one or more resources that match criteria that you specify, for example, resources that have specific tags.    Actions: The actions to carry out on the target. You can specify multiple actions, the duration of each action, and when to start each action during an experiment.    Stop conditions: If a stop condition is triggered while an experiment is running, the experiment is automatically stopped. You can define a stop condition as a CloudWatch alarm.   For more information, see Experiment templates in the Fault Injection Simulator User Guide.
   */
  createExperimentTemplate(params: Fis.Types.CreateExperimentTemplateRequest, callback?: (err: AWSError, data: Fis.Types.CreateExperimentTemplateResponse) => void): Request<Fis.Types.CreateExperimentTemplateResponse, AWSError>;
  /**
   * Creates an experiment template.  An experiment template includes the following components:    Targets: A target can be a specific resource in your Amazon Web Services environment, or one or more resources that match criteria that you specify, for example, resources that have specific tags.    Actions: The actions to carry out on the target. You can specify multiple actions, the duration of each action, and when to start each action during an experiment.    Stop conditions: If a stop condition is triggered while an experiment is running, the experiment is automatically stopped. You can define a stop condition as a CloudWatch alarm.   For more information, see Experiment templates in the Fault Injection Simulator User Guide.
   */
  createExperimentTemplate(callback?: (err: AWSError, data: Fis.Types.CreateExperimentTemplateResponse) => void): Request<Fis.Types.CreateExperimentTemplateResponse, AWSError>;
  /**
   * Deletes the specified experiment template.
   */
  deleteExperimentTemplate(params: Fis.Types.DeleteExperimentTemplateRequest, callback?: (err: AWSError, data: Fis.Types.DeleteExperimentTemplateResponse) => void): Request<Fis.Types.DeleteExperimentTemplateResponse, AWSError>;
  /**
   * Deletes the specified experiment template.
   */
  deleteExperimentTemplate(callback?: (err: AWSError, data: Fis.Types.DeleteExperimentTemplateResponse) => void): Request<Fis.Types.DeleteExperimentTemplateResponse, AWSError>;
  /**
   * Gets information about the specified FIS action.
   */
  getAction(params: Fis.Types.GetActionRequest, callback?: (err: AWSError, data: Fis.Types.GetActionResponse) => void): Request<Fis.Types.GetActionResponse, AWSError>;
  /**
   * Gets information about the specified FIS action.
   */
  getAction(callback?: (err: AWSError, data: Fis.Types.GetActionResponse) => void): Request<Fis.Types.GetActionResponse, AWSError>;
  /**
   * Gets information about the specified experiment.
   */
  getExperiment(params: Fis.Types.GetExperimentRequest, callback?: (err: AWSError, data: Fis.Types.GetExperimentResponse) => void): Request<Fis.Types.GetExperimentResponse, AWSError>;
  /**
   * Gets information about the specified experiment.
   */
  getExperiment(callback?: (err: AWSError, data: Fis.Types.GetExperimentResponse) => void): Request<Fis.Types.GetExperimentResponse, AWSError>;
  /**
   * Gets information about the specified experiment template.
   */
  getExperimentTemplate(params: Fis.Types.GetExperimentTemplateRequest, callback?: (err: AWSError, data: Fis.Types.GetExperimentTemplateResponse) => void): Request<Fis.Types.GetExperimentTemplateResponse, AWSError>;
  /**
   * Gets information about the specified experiment template.
   */
  getExperimentTemplate(callback?: (err: AWSError, data: Fis.Types.GetExperimentTemplateResponse) => void): Request<Fis.Types.GetExperimentTemplateResponse, AWSError>;
  /**
   * Gets information about the specified resource type.
   */
  getTargetResourceType(params: Fis.Types.GetTargetResourceTypeRequest, callback?: (err: AWSError, data: Fis.Types.GetTargetResourceTypeResponse) => void): Request<Fis.Types.GetTargetResourceTypeResponse, AWSError>;
  /**
   * Gets information about the specified resource type.
   */
  getTargetResourceType(callback?: (err: AWSError, data: Fis.Types.GetTargetResourceTypeResponse) => void): Request<Fis.Types.GetTargetResourceTypeResponse, AWSError>;
  /**
   * Lists the available FIS actions.
   */
  listActions(params: Fis.Types.ListActionsRequest, callback?: (err: AWSError, data: Fis.Types.ListActionsResponse) => void): Request<Fis.Types.ListActionsResponse, AWSError>;
  /**
   * Lists the available FIS actions.
   */
  listActions(callback?: (err: AWSError, data: Fis.Types.ListActionsResponse) => void): Request<Fis.Types.ListActionsResponse, AWSError>;
  /**
   * Lists your experiment templates.
   */
  listExperimentTemplates(params: Fis.Types.ListExperimentTemplatesRequest, callback?: (err: AWSError, data: Fis.Types.ListExperimentTemplatesResponse) => void): Request<Fis.Types.ListExperimentTemplatesResponse, AWSError>;
  /**
   * Lists your experiment templates.
   */
  listExperimentTemplates(callback?: (err: AWSError, data: Fis.Types.ListExperimentTemplatesResponse) => void): Request<Fis.Types.ListExperimentTemplatesResponse, AWSError>;
  /**
   * Lists your experiments.
   */
  listExperiments(params: Fis.Types.ListExperimentsRequest, callback?: (err: AWSError, data: Fis.Types.ListExperimentsResponse) => void): Request<Fis.Types.ListExperimentsResponse, AWSError>;
  /**
   * Lists your experiments.
   */
  listExperiments(callback?: (err: AWSError, data: Fis.Types.ListExperimentsResponse) => void): Request<Fis.Types.ListExperimentsResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(params: Fis.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Fis.Types.ListTagsForResourceResponse) => void): Request<Fis.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Fis.Types.ListTagsForResourceResponse) => void): Request<Fis.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the target resource types.
   */
  listTargetResourceTypes(params: Fis.Types.ListTargetResourceTypesRequest, callback?: (err: AWSError, data: Fis.Types.ListTargetResourceTypesResponse) => void): Request<Fis.Types.ListTargetResourceTypesResponse, AWSError>;
  /**
   * Lists the target resource types.
   */
  listTargetResourceTypes(callback?: (err: AWSError, data: Fis.Types.ListTargetResourceTypesResponse) => void): Request<Fis.Types.ListTargetResourceTypesResponse, AWSError>;
  /**
   * Starts running an experiment from the specified experiment template.
   */
  startExperiment(params: Fis.Types.StartExperimentRequest, callback?: (err: AWSError, data: Fis.Types.StartExperimentResponse) => void): Request<Fis.Types.StartExperimentResponse, AWSError>;
  /**
   * Starts running an experiment from the specified experiment template.
   */
  startExperiment(callback?: (err: AWSError, data: Fis.Types.StartExperimentResponse) => void): Request<Fis.Types.StartExperimentResponse, AWSError>;
  /**
   * Stops the specified experiment.
   */
  stopExperiment(params: Fis.Types.StopExperimentRequest, callback?: (err: AWSError, data: Fis.Types.StopExperimentResponse) => void): Request<Fis.Types.StopExperimentResponse, AWSError>;
  /**
   * Stops the specified experiment.
   */
  stopExperiment(callback?: (err: AWSError, data: Fis.Types.StopExperimentResponse) => void): Request<Fis.Types.StopExperimentResponse, AWSError>;
  /**
   * Applies the specified tags to the specified resource.
   */
  tagResource(params: Fis.Types.TagResourceRequest, callback?: (err: AWSError, data: Fis.Types.TagResourceResponse) => void): Request<Fis.Types.TagResourceResponse, AWSError>;
  /**
   * Applies the specified tags to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: Fis.Types.TagResourceResponse) => void): Request<Fis.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resource.
   */
  untagResource(params: Fis.Types.UntagResourceRequest, callback?: (err: AWSError, data: Fis.Types.UntagResourceResponse) => void): Request<Fis.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: Fis.Types.UntagResourceResponse) => void): Request<Fis.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the specified experiment template.
   */
  updateExperimentTemplate(params: Fis.Types.UpdateExperimentTemplateRequest, callback?: (err: AWSError, data: Fis.Types.UpdateExperimentTemplateResponse) => void): Request<Fis.Types.UpdateExperimentTemplateResponse, AWSError>;
  /**
   * Updates the specified experiment template.
   */
  updateExperimentTemplate(callback?: (err: AWSError, data: Fis.Types.UpdateExperimentTemplateResponse) => void): Request<Fis.Types.UpdateExperimentTemplateResponse, AWSError>;
}
declare namespace Fis {
  export interface Action {
    /**
     * The ID of the action.
     */
    id?: ActionId;
    /**
     * The description for the action.
     */
    description?: ActionDescription;
    /**
     * The action parameters, if applicable.
     */
    parameters?: ActionParameterMap;
    /**
     * The supported targets for the action.
     */
    targets?: ActionTargetMap;
    /**
     * The tags for the action.
     */
    tags?: TagMap;
  }
  export type ActionDescription = string;
  export type ActionId = string;
  export interface ActionParameter {
    /**
     * The parameter description.
     */
    description?: ActionParameterDescription;
    /**
     * Indicates whether the parameter is required.
     */
    required?: ActionParameterRequired;
  }
  export type ActionParameterDescription = string;
  export type ActionParameterMap = {[key: string]: ActionParameter};
  export type ActionParameterName = string;
  export type ActionParameterRequired = boolean;
  export interface ActionSummary {
    /**
     * The ID of the action.
     */
    id?: ActionId;
    /**
     * The description for the action.
     */
    description?: ActionDescription;
    /**
     * The targets for the action.
     */
    targets?: ActionTargetMap;
    /**
     * The tags for the action.
     */
    tags?: TagMap;
  }
  export type ActionSummaryList = ActionSummary[];
  export interface ActionTarget {
    /**
     * The resource type of the target.
     */
    resourceType?: TargetResourceTypeId;
  }
  export type ActionTargetMap = {[key: string]: ActionTarget};
  export type ActionTargetName = string;
  export type ClientToken = string;
  export type CloudWatchLogGroupArn = string;
  export interface CreateExperimentTemplateActionInput {
    /**
     * The ID of the action. The format of the action ID is: aws:service-name:action-type.
     */
    actionId: ActionId;
    /**
     * A description for the action.
     */
    description?: ExperimentTemplateActionDescription;
    /**
     * The parameters for the action, if applicable.
     */
    parameters?: ExperimentTemplateActionParameterMap;
    /**
     * The targets for the action.
     */
    targets?: ExperimentTemplateActionTargetMap;
    /**
     * The name of the action that must be completed before the current action starts. Omit this parameter to run the action at the start of the experiment.
     */
    startAfter?: ExperimentTemplateActionStartAfterList;
  }
  export type CreateExperimentTemplateActionInputMap = {[key: string]: CreateExperimentTemplateActionInput};
  export interface CreateExperimentTemplateLogConfigurationInput {
    /**
     * The configuration for experiment logging to Amazon CloudWatch Logs.
     */
    cloudWatchLogsConfiguration?: ExperimentTemplateCloudWatchLogsLogConfigurationInput;
    /**
     * The configuration for experiment logging to Amazon S3.
     */
    s3Configuration?: ExperimentTemplateS3LogConfigurationInput;
    /**
     * The schema version.
     */
    logSchemaVersion: LogSchemaVersion;
  }
  export interface CreateExperimentTemplateRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken: ClientToken;
    /**
     * A description for the experiment template.
     */
    description: ExperimentTemplateDescription;
    /**
     * The stop conditions.
     */
    stopConditions: CreateExperimentTemplateStopConditionInputList;
    /**
     * The targets for the experiment.
     */
    targets?: CreateExperimentTemplateTargetInputMap;
    /**
     * The actions for the experiment.
     */
    actions: CreateExperimentTemplateActionInputMap;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that grants the FIS service permission to perform service actions on your behalf.
     */
    roleArn: RoleArn;
    /**
     * The tags to apply to the experiment template.
     */
    tags?: TagMap;
    /**
     * The configuration for experiment logging.
     */
    logConfiguration?: CreateExperimentTemplateLogConfigurationInput;
  }
  export interface CreateExperimentTemplateResponse {
    /**
     * Information about the experiment template.
     */
    experimentTemplate?: ExperimentTemplate;
  }
  export interface CreateExperimentTemplateStopConditionInput {
    /**
     * The source for the stop condition. Specify aws:cloudwatch:alarm if the stop condition is defined by a CloudWatch alarm. Specify none if there is no stop condition.
     */
    source: StopConditionSource;
    /**
     * The Amazon Resource Name (ARN) of the CloudWatch alarm. This is required if the source is a CloudWatch alarm.
     */
    value?: StopConditionValue;
  }
  export type CreateExperimentTemplateStopConditionInputList = CreateExperimentTemplateStopConditionInput[];
  export interface CreateExperimentTemplateTargetInput {
    /**
     * The resource type. The resource type must be supported for the specified action.
     */
    resourceType: TargetResourceTypeId;
    /**
     * The Amazon Resource Names (ARNs) of the resources.
     */
    resourceArns?: ResourceArnList;
    /**
     * The tags for the target resources.
     */
    resourceTags?: TagMap;
    /**
     * The filters to apply to identify target resources using specific attributes.
     */
    filters?: ExperimentTemplateTargetFilterInputList;
    /**
     * Scopes the identified resources to a specific count of the resources at random, or a percentage of the resources. All identified resources are included in the target.   ALL - Run the action on all identified targets. This is the default.   COUNT(n) - Run the action on the specified number of targets, chosen from the identified targets at random. For example, COUNT(1) selects one of the targets.   PERCENT(n) - Run the action on the specified percentage of targets, chosen from the identified targets at random. For example, PERCENT(25) selects 25% of the targets.  
     */
    selectionMode: ExperimentTemplateTargetSelectionMode;
    /**
     * The resource type parameters.
     */
    parameters?: ExperimentTemplateTargetParameterMap;
  }
  export type CreateExperimentTemplateTargetInputMap = {[key: string]: CreateExperimentTemplateTargetInput};
  export type CreationTime = Date;
  export interface DeleteExperimentTemplateRequest {
    /**
     * The ID of the experiment template.
     */
    id: ExperimentTemplateId;
  }
  export interface DeleteExperimentTemplateResponse {
    /**
     * Information about the experiment template.
     */
    experimentTemplate?: ExperimentTemplate;
  }
  export interface Experiment {
    /**
     * The ID of the experiment.
     */
    id?: ExperimentId;
    /**
     * The ID of the experiment template.
     */
    experimentTemplateId?: ExperimentTemplateId;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that grants the FIS service permission to perform service actions on your behalf.
     */
    roleArn?: RoleArn;
    /**
     * The state of the experiment.
     */
    state?: ExperimentState;
    /**
     * The targets for the experiment.
     */
    targets?: ExperimentTargetMap;
    /**
     * The actions for the experiment.
     */
    actions?: ExperimentActionMap;
    /**
     * The stop conditions for the experiment.
     */
    stopConditions?: ExperimentStopConditionList;
    /**
     * The time that the experiment was created.
     */
    creationTime?: CreationTime;
    /**
     * The time that the experiment started.
     */
    startTime?: ExperimentStartTime;
    /**
     * The time that the experiment ended.
     */
    endTime?: ExperimentEndTime;
    /**
     * The tags for the experiment.
     */
    tags?: TagMap;
    /**
     * The configuration for experiment logging.
     */
    logConfiguration?: ExperimentLogConfiguration;
  }
  export interface ExperimentAction {
    /**
     * The ID of the action.
     */
    actionId?: ActionId;
    /**
     * The description for the action.
     */
    description?: ExperimentActionDescription;
    /**
     * The parameters for the action.
     */
    parameters?: ExperimentActionParameterMap;
    /**
     * The targets for the action.
     */
    targets?: ExperimentActionTargetMap;
    /**
     * The name of the action that must be completed before this action starts.
     */
    startAfter?: ExperimentActionStartAfterList;
    /**
     * The state of the action.
     */
    state?: ExperimentActionState;
    /**
     * The time that the action started.
     */
    startTime?: ExperimentActionStartTime;
    /**
     * The time that the action ended.
     */
    endTime?: ExperimentActionEndTime;
  }
  export type ExperimentActionDescription = string;
  export type ExperimentActionEndTime = Date;
  export type ExperimentActionMap = {[key: string]: ExperimentAction};
  export type ExperimentActionName = string;
  export type ExperimentActionParameter = string;
  export type ExperimentActionParameterMap = {[key: string]: ExperimentActionParameter};
  export type ExperimentActionParameterName = string;
  export type ExperimentActionStartAfter = string;
  export type ExperimentActionStartAfterList = ExperimentActionStartAfter[];
  export type ExperimentActionStartTime = Date;
  export interface ExperimentActionState {
    /**
     * The state of the action.
     */
    status?: ExperimentActionStatus;
    /**
     * The reason for the state.
     */
    reason?: ExperimentActionStatusReason;
  }
  export type ExperimentActionStatus = "pending"|"initiating"|"running"|"completed"|"cancelled"|"stopping"|"stopped"|"failed"|string;
  export type ExperimentActionStatusReason = string;
  export type ExperimentActionTargetMap = {[key: string]: ExperimentTargetName};
  export type ExperimentActionTargetName = string;
  export interface ExperimentCloudWatchLogsLogConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the destination Amazon CloudWatch Logs log group.
     */
    logGroupArn?: CloudWatchLogGroupArn;
  }
  export type ExperimentEndTime = Date;
  export type ExperimentId = string;
  export interface ExperimentLogConfiguration {
    /**
     * The configuration for experiment logging to Amazon CloudWatch Logs.
     */
    cloudWatchLogsConfiguration?: ExperimentCloudWatchLogsLogConfiguration;
    /**
     * The configuration for experiment logging to Amazon S3.
     */
    s3Configuration?: ExperimentS3LogConfiguration;
    /**
     * The schema version.
     */
    logSchemaVersion?: LogSchemaVersion;
  }
  export interface ExperimentS3LogConfiguration {
    /**
     * The name of the destination bucket.
     */
    bucketName?: S3BucketName;
    /**
     * The bucket prefix.
     */
    prefix?: S3ObjectKey;
  }
  export type ExperimentStartTime = Date;
  export interface ExperimentState {
    /**
     * The state of the experiment.
     */
    status?: ExperimentStatus;
    /**
     * The reason for the state.
     */
    reason?: ExperimentStatusReason;
  }
  export type ExperimentStatus = "pending"|"initiating"|"running"|"completed"|"stopping"|"stopped"|"failed"|string;
  export type ExperimentStatusReason = string;
  export interface ExperimentStopCondition {
    /**
     * The source for the stop condition.
     */
    source?: StopConditionSource;
    /**
     * The Amazon Resource Name (ARN) of the CloudWatch alarm, if applicable.
     */
    value?: StopConditionValue;
  }
  export type ExperimentStopConditionList = ExperimentStopCondition[];
  export interface ExperimentSummary {
    /**
     * The ID of the experiment.
     */
    id?: ExperimentId;
    /**
     * The ID of the experiment template.
     */
    experimentTemplateId?: ExperimentTemplateId;
    /**
     * The state of the experiment.
     */
    state?: ExperimentState;
    /**
     * The time that the experiment was created.
     */
    creationTime?: CreationTime;
    /**
     * The tags for the experiment.
     */
    tags?: TagMap;
  }
  export type ExperimentSummaryList = ExperimentSummary[];
  export interface ExperimentTarget {
    /**
     * The resource type.
     */
    resourceType?: TargetResourceTypeId;
    /**
     * The Amazon Resource Names (ARNs) of the resources.
     */
    resourceArns?: ResourceArnList;
    /**
     * The tags for the target resources.
     */
    resourceTags?: TagMap;
    /**
     * The filters to apply to identify target resources using specific attributes.
     */
    filters?: ExperimentTargetFilterList;
    /**
     * Scopes the identified resources to a specific count or percentage.
     */
    selectionMode?: ExperimentTargetSelectionMode;
    /**
     * The resource type parameters.
     */
    parameters?: ExperimentTargetParameterMap;
  }
  export interface ExperimentTargetFilter {
    /**
     * The attribute path for the filter.
     */
    path?: ExperimentTargetFilterPath;
    /**
     * The attribute values for the filter.
     */
    values?: ExperimentTargetFilterValues;
  }
  export type ExperimentTargetFilterList = ExperimentTargetFilter[];
  export type ExperimentTargetFilterPath = string;
  export type ExperimentTargetFilterValue = string;
  export type ExperimentTargetFilterValues = ExperimentTargetFilterValue[];
  export type ExperimentTargetMap = {[key: string]: ExperimentTarget};
  export type ExperimentTargetName = string;
  export type ExperimentTargetParameterMap = {[key: string]: ExperimentTargetParameterValue};
  export type ExperimentTargetParameterName = string;
  export type ExperimentTargetParameterValue = string;
  export type ExperimentTargetSelectionMode = string;
  export interface ExperimentTemplate {
    /**
     * The ID of the experiment template.
     */
    id?: ExperimentTemplateId;
    /**
     * The description for the experiment template.
     */
    description?: ExperimentTemplateDescription;
    /**
     * The targets for the experiment.
     */
    targets?: ExperimentTemplateTargetMap;
    /**
     * The actions for the experiment.
     */
    actions?: ExperimentTemplateActionMap;
    /**
     * The stop conditions for the experiment.
     */
    stopConditions?: ExperimentTemplateStopConditionList;
    /**
     * The time the experiment template was created.
     */
    creationTime?: CreationTime;
    /**
     * The time the experiment template was last updated.
     */
    lastUpdateTime?: LastUpdateTime;
    /**
     * The Amazon Resource Name (ARN) of an IAM role.
     */
    roleArn?: RoleArn;
    /**
     * The tags for the experiment template.
     */
    tags?: TagMap;
    /**
     * The configuration for experiment logging.
     */
    logConfiguration?: ExperimentTemplateLogConfiguration;
  }
  export interface ExperimentTemplateAction {
    /**
     * The ID of the action.
     */
    actionId?: ActionId;
    /**
     * A description for the action.
     */
    description?: ExperimentTemplateActionDescription;
    /**
     * The parameters for the action.
     */
    parameters?: ExperimentTemplateActionParameterMap;
    /**
     * The targets for the action.
     */
    targets?: ExperimentTemplateActionTargetMap;
    /**
     * The name of the action that must be completed before the current action starts.
     */
    startAfter?: ExperimentTemplateActionStartAfterList;
  }
  export type ExperimentTemplateActionDescription = string;
  export type ExperimentTemplateActionMap = {[key: string]: ExperimentTemplateAction};
  export type ExperimentTemplateActionName = string;
  export type ExperimentTemplateActionParameter = string;
  export type ExperimentTemplateActionParameterMap = {[key: string]: ExperimentTemplateActionParameter};
  export type ExperimentTemplateActionParameterName = string;
  export type ExperimentTemplateActionStartAfter = string;
  export type ExperimentTemplateActionStartAfterList = ExperimentTemplateActionStartAfter[];
  export type ExperimentTemplateActionTargetMap = {[key: string]: ExperimentTemplateTargetName};
  export type ExperimentTemplateActionTargetName = string;
  export interface ExperimentTemplateCloudWatchLogsLogConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the destination Amazon CloudWatch Logs log group.
     */
    logGroupArn?: CloudWatchLogGroupArn;
  }
  export interface ExperimentTemplateCloudWatchLogsLogConfigurationInput {
    /**
     * The Amazon Resource Name (ARN) of the destination Amazon CloudWatch Logs log group.
     */
    logGroupArn: CloudWatchLogGroupArn;
  }
  export type ExperimentTemplateDescription = string;
  export type ExperimentTemplateId = string;
  export interface ExperimentTemplateLogConfiguration {
    /**
     * The configuration for experiment logging to Amazon CloudWatch Logs.
     */
    cloudWatchLogsConfiguration?: ExperimentTemplateCloudWatchLogsLogConfiguration;
    /**
     * The configuration for experiment logging to Amazon S3.
     */
    s3Configuration?: ExperimentTemplateS3LogConfiguration;
    /**
     * The schema version.
     */
    logSchemaVersion?: LogSchemaVersion;
  }
  export interface ExperimentTemplateS3LogConfiguration {
    /**
     * The name of the destination bucket.
     */
    bucketName?: S3BucketName;
    /**
     * The bucket prefix.
     */
    prefix?: S3ObjectKey;
  }
  export interface ExperimentTemplateS3LogConfigurationInput {
    /**
     * The name of the destination bucket.
     */
    bucketName: S3BucketName;
    /**
     * The bucket prefix.
     */
    prefix?: S3ObjectKey;
  }
  export interface ExperimentTemplateStopCondition {
    /**
     * The source for the stop condition.
     */
    source?: StopConditionSource;
    /**
     * The Amazon Resource Name (ARN) of the CloudWatch alarm, if applicable.
     */
    value?: StopConditionValue;
  }
  export type ExperimentTemplateStopConditionList = ExperimentTemplateStopCondition[];
  export interface ExperimentTemplateSummary {
    /**
     * The ID of the experiment template.
     */
    id?: ExperimentTemplateId;
    /**
     * The description of the experiment template.
     */
    description?: ExperimentTemplateDescription;
    /**
     * The time that the experiment template was created.
     */
    creationTime?: CreationTime;
    /**
     * The time that the experiment template was last updated.
     */
    lastUpdateTime?: LastUpdateTime;
    /**
     * The tags for the experiment template.
     */
    tags?: TagMap;
  }
  export type ExperimentTemplateSummaryList = ExperimentTemplateSummary[];
  export interface ExperimentTemplateTarget {
    /**
     * The resource type.
     */
    resourceType?: TargetResourceTypeId;
    /**
     * The Amazon Resource Names (ARNs) of the targets.
     */
    resourceArns?: ResourceArnList;
    /**
     * The tags for the target resources.
     */
    resourceTags?: TagMap;
    /**
     * The filters to apply to identify target resources using specific attributes.
     */
    filters?: ExperimentTemplateTargetFilterList;
    /**
     * Scopes the identified resources to a specific count or percentage.
     */
    selectionMode?: ExperimentTemplateTargetSelectionMode;
    /**
     * The resource type parameters.
     */
    parameters?: ExperimentTemplateTargetParameterMap;
  }
  export interface ExperimentTemplateTargetFilter {
    /**
     * The attribute path for the filter.
     */
    path?: ExperimentTemplateTargetFilterPath;
    /**
     * The attribute values for the filter.
     */
    values?: ExperimentTemplateTargetFilterValues;
  }
  export type ExperimentTemplateTargetFilterInputList = ExperimentTemplateTargetInputFilter[];
  export type ExperimentTemplateTargetFilterList = ExperimentTemplateTargetFilter[];
  export type ExperimentTemplateTargetFilterPath = string;
  export type ExperimentTemplateTargetFilterValue = string;
  export type ExperimentTemplateTargetFilterValues = ExperimentTemplateTargetFilterValue[];
  export interface ExperimentTemplateTargetInputFilter {
    /**
     * The attribute path for the filter.
     */
    path: ExperimentTemplateTargetFilterPath;
    /**
     * The attribute values for the filter.
     */
    values: ExperimentTemplateTargetFilterValues;
  }
  export type ExperimentTemplateTargetMap = {[key: string]: ExperimentTemplateTarget};
  export type ExperimentTemplateTargetName = string;
  export type ExperimentTemplateTargetParameterMap = {[key: string]: ExperimentTemplateTargetParameterValue};
  export type ExperimentTemplateTargetParameterName = string;
  export type ExperimentTemplateTargetParameterValue = string;
  export type ExperimentTemplateTargetSelectionMode = string;
  export interface GetActionRequest {
    /**
     * The ID of the action.
     */
    id: ActionId;
  }
  export interface GetActionResponse {
    /**
     * Information about the action.
     */
    action?: Action;
  }
  export interface GetExperimentRequest {
    /**
     * The ID of the experiment.
     */
    id: ExperimentId;
  }
  export interface GetExperimentResponse {
    /**
     * Information about the experiment.
     */
    experiment?: Experiment;
  }
  export interface GetExperimentTemplateRequest {
    /**
     * The ID of the experiment template.
     */
    id: ExperimentTemplateId;
  }
  export interface GetExperimentTemplateResponse {
    /**
     * Information about the experiment template.
     */
    experimentTemplate?: ExperimentTemplate;
  }
  export interface GetTargetResourceTypeRequest {
    /**
     * The resource type.
     */
    resourceType: TargetResourceTypeId;
  }
  export interface GetTargetResourceTypeResponse {
    /**
     * Information about the resource type.
     */
    targetResourceType?: TargetResourceType;
  }
  export type LastUpdateTime = Date;
  export type ListActionsMaxResults = number;
  export interface ListActionsRequest {
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: ListActionsMaxResults;
    /**
     * The token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListActionsResponse {
    /**
     * The actions.
     */
    actions?: ActionSummaryList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export type ListExperimentTemplatesMaxResults = number;
  export interface ListExperimentTemplatesRequest {
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: ListExperimentTemplatesMaxResults;
    /**
     * The token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListExperimentTemplatesResponse {
    /**
     * The experiment templates.
     */
    experimentTemplates?: ExperimentTemplateSummaryList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export type ListExperimentsMaxResults = number;
  export interface ListExperimentsRequest {
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: ListExperimentsMaxResults;
    /**
     * The token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListExperimentsResponse {
    /**
     * The experiments.
     */
    experiments?: ExperimentSummaryList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags for the resource.
     */
    tags?: TagMap;
  }
  export type ListTargetResourceTypesMaxResults = number;
  export interface ListTargetResourceTypesRequest {
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: ListTargetResourceTypesMaxResults;
    /**
     * The token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTargetResourceTypesResponse {
    /**
     * The target resource types.
     */
    targetResourceTypes?: TargetResourceTypeSummaryList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export type LogSchemaVersion = number;
  export type NextToken = string;
  export type ResourceArn = string;
  export type ResourceArnList = ResourceArn[];
  export type RoleArn = string;
  export type S3BucketName = string;
  export type S3ObjectKey = string;
  export interface StartExperimentRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken: ClientToken;
    /**
     * The ID of the experiment template.
     */
    experimentTemplateId: ExperimentTemplateId;
    /**
     * The tags to apply to the experiment.
     */
    tags?: TagMap;
  }
  export interface StartExperimentResponse {
    /**
     * Information about the experiment.
     */
    experiment?: Experiment;
  }
  export type StopConditionSource = string;
  export type StopConditionValue = string;
  export interface StopExperimentRequest {
    /**
     * The ID of the experiment.
     */
    id: ExperimentId;
  }
  export interface StopExperimentResponse {
    /**
     * Information about the experiment.
     */
    experiment?: Experiment;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: ResourceArn;
    /**
     * The tags for the resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TargetResourceType {
    /**
     * The resource type.
     */
    resourceType?: TargetResourceTypeId;
    /**
     * A description of the resource type.
     */
    description?: TargetResourceTypeDescription;
    /**
     * The parameters for the resource type.
     */
    parameters?: TargetResourceTypeParameterMap;
  }
  export type TargetResourceTypeDescription = string;
  export type TargetResourceTypeId = string;
  export interface TargetResourceTypeParameter {
    /**
     * A description of the parameter.
     */
    description?: TargetResourceTypeParameterDescription;
    /**
     * Indicates whether the parameter is required.
     */
    required?: TargetResourceTypeParameterRequired;
  }
  export type TargetResourceTypeParameterDescription = string;
  export type TargetResourceTypeParameterMap = {[key: string]: TargetResourceTypeParameter};
  export type TargetResourceTypeParameterName = string;
  export type TargetResourceTypeParameterRequired = boolean;
  export interface TargetResourceTypeSummary {
    /**
     * The resource type.
     */
    resourceType?: TargetResourceTypeId;
    /**
     * A description of the resource type.
     */
    description?: TargetResourceTypeDescription;
  }
  export type TargetResourceTypeSummaryList = TargetResourceTypeSummary[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: ResourceArn;
    /**
     * The tag keys to remove.
     */
    tagKeys?: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateExperimentTemplateActionInputItem {
    /**
     * The ID of the action.
     */
    actionId?: ActionId;
    /**
     * A description for the action.
     */
    description?: ExperimentTemplateActionDescription;
    /**
     * The parameters for the action, if applicable.
     */
    parameters?: ExperimentTemplateActionParameterMap;
    /**
     * The targets for the action.
     */
    targets?: ExperimentTemplateActionTargetMap;
    /**
     * The name of the action that must be completed before the current action starts. Omit this parameter to run the action at the start of the experiment.
     */
    startAfter?: ExperimentTemplateActionStartAfterList;
  }
  export type UpdateExperimentTemplateActionInputMap = {[key: string]: UpdateExperimentTemplateActionInputItem};
  export interface UpdateExperimentTemplateLogConfigurationInput {
    /**
     * The configuration for experiment logging to Amazon CloudWatch Logs.
     */
    cloudWatchLogsConfiguration?: ExperimentTemplateCloudWatchLogsLogConfigurationInput;
    /**
     * The configuration for experiment logging to Amazon S3.
     */
    s3Configuration?: ExperimentTemplateS3LogConfigurationInput;
    /**
     * The schema version.
     */
    logSchemaVersion?: LogSchemaVersion;
  }
  export interface UpdateExperimentTemplateRequest {
    /**
     * The ID of the experiment template.
     */
    id: ExperimentTemplateId;
    /**
     * A description for the template.
     */
    description?: ExperimentTemplateDescription;
    /**
     * The stop conditions for the experiment.
     */
    stopConditions?: UpdateExperimentTemplateStopConditionInputList;
    /**
     * The targets for the experiment.
     */
    targets?: UpdateExperimentTemplateTargetInputMap;
    /**
     * The actions for the experiment.
     */
    actions?: UpdateExperimentTemplateActionInputMap;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that grants the FIS service permission to perform service actions on your behalf.
     */
    roleArn?: RoleArn;
    /**
     * The configuration for experiment logging.
     */
    logConfiguration?: UpdateExperimentTemplateLogConfigurationInput;
  }
  export interface UpdateExperimentTemplateResponse {
    /**
     * Information about the experiment template.
     */
    experimentTemplate?: ExperimentTemplate;
  }
  export interface UpdateExperimentTemplateStopConditionInput {
    /**
     * The source for the stop condition. Specify aws:cloudwatch:alarm if the stop condition is defined by a CloudWatch alarm. Specify none if there is no stop condition.
     */
    source: StopConditionSource;
    /**
     * The Amazon Resource Name (ARN) of the CloudWatch alarm.
     */
    value?: StopConditionValue;
  }
  export type UpdateExperimentTemplateStopConditionInputList = UpdateExperimentTemplateStopConditionInput[];
  export interface UpdateExperimentTemplateTargetInput {
    /**
     * The resource type. The resource type must be supported for the specified action.
     */
    resourceType: TargetResourceTypeId;
    /**
     * The Amazon Resource Names (ARNs) of the targets.
     */
    resourceArns?: ResourceArnList;
    /**
     * The tags for the target resources.
     */
    resourceTags?: TagMap;
    /**
     * The filters to apply to identify target resources using specific attributes.
     */
    filters?: ExperimentTemplateTargetFilterInputList;
    /**
     * Scopes the identified resources to a specific count or percentage.
     */
    selectionMode: ExperimentTemplateTargetSelectionMode;
    /**
     * The resource type parameters.
     */
    parameters?: ExperimentTemplateTargetParameterMap;
  }
  export type UpdateExperimentTemplateTargetInputMap = {[key: string]: UpdateExperimentTemplateTargetInput};
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-12-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Fis client.
   */
  export import Types = Fis;
}
export = Fis;
