import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IoTEvents extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IoTEvents.Types.ClientConfiguration)
  config: Config & IoTEvents.Types.ClientConfiguration;
  /**
   * Creates an alarm model to monitor an AWS IoT Events input attribute. You can use the alarm to get notified when the value is outside a specified range. For more information, see Create an alarm model in the AWS IoT Events Developer Guide.
   */
  createAlarmModel(params: IoTEvents.Types.CreateAlarmModelRequest, callback?: (err: AWSError, data: IoTEvents.Types.CreateAlarmModelResponse) => void): Request<IoTEvents.Types.CreateAlarmModelResponse, AWSError>;
  /**
   * Creates an alarm model to monitor an AWS IoT Events input attribute. You can use the alarm to get notified when the value is outside a specified range. For more information, see Create an alarm model in the AWS IoT Events Developer Guide.
   */
  createAlarmModel(callback?: (err: AWSError, data: IoTEvents.Types.CreateAlarmModelResponse) => void): Request<IoTEvents.Types.CreateAlarmModelResponse, AWSError>;
  /**
   * Creates a detector model.
   */
  createDetectorModel(params: IoTEvents.Types.CreateDetectorModelRequest, callback?: (err: AWSError, data: IoTEvents.Types.CreateDetectorModelResponse) => void): Request<IoTEvents.Types.CreateDetectorModelResponse, AWSError>;
  /**
   * Creates a detector model.
   */
  createDetectorModel(callback?: (err: AWSError, data: IoTEvents.Types.CreateDetectorModelResponse) => void): Request<IoTEvents.Types.CreateDetectorModelResponse, AWSError>;
  /**
   * Creates an input.
   */
  createInput(params: IoTEvents.Types.CreateInputRequest, callback?: (err: AWSError, data: IoTEvents.Types.CreateInputResponse) => void): Request<IoTEvents.Types.CreateInputResponse, AWSError>;
  /**
   * Creates an input.
   */
  createInput(callback?: (err: AWSError, data: IoTEvents.Types.CreateInputResponse) => void): Request<IoTEvents.Types.CreateInputResponse, AWSError>;
  /**
   * Deletes an alarm model. Any alarm instances that were created based on this alarm model are also deleted. This action can't be undone.
   */
  deleteAlarmModel(params: IoTEvents.Types.DeleteAlarmModelRequest, callback?: (err: AWSError, data: IoTEvents.Types.DeleteAlarmModelResponse) => void): Request<IoTEvents.Types.DeleteAlarmModelResponse, AWSError>;
  /**
   * Deletes an alarm model. Any alarm instances that were created based on this alarm model are also deleted. This action can't be undone.
   */
  deleteAlarmModel(callback?: (err: AWSError, data: IoTEvents.Types.DeleteAlarmModelResponse) => void): Request<IoTEvents.Types.DeleteAlarmModelResponse, AWSError>;
  /**
   * Deletes a detector model. Any active instances of the detector model are also deleted.
   */
  deleteDetectorModel(params: IoTEvents.Types.DeleteDetectorModelRequest, callback?: (err: AWSError, data: IoTEvents.Types.DeleteDetectorModelResponse) => void): Request<IoTEvents.Types.DeleteDetectorModelResponse, AWSError>;
  /**
   * Deletes a detector model. Any active instances of the detector model are also deleted.
   */
  deleteDetectorModel(callback?: (err: AWSError, data: IoTEvents.Types.DeleteDetectorModelResponse) => void): Request<IoTEvents.Types.DeleteDetectorModelResponse, AWSError>;
  /**
   * Deletes an input.
   */
  deleteInput(params: IoTEvents.Types.DeleteInputRequest, callback?: (err: AWSError, data: IoTEvents.Types.DeleteInputResponse) => void): Request<IoTEvents.Types.DeleteInputResponse, AWSError>;
  /**
   * Deletes an input.
   */
  deleteInput(callback?: (err: AWSError, data: IoTEvents.Types.DeleteInputResponse) => void): Request<IoTEvents.Types.DeleteInputResponse, AWSError>;
  /**
   * Retrieves information about an alarm model. If you don't specify a value for the alarmModelVersion parameter, the latest version is returned.
   */
  describeAlarmModel(params: IoTEvents.Types.DescribeAlarmModelRequest, callback?: (err: AWSError, data: IoTEvents.Types.DescribeAlarmModelResponse) => void): Request<IoTEvents.Types.DescribeAlarmModelResponse, AWSError>;
  /**
   * Retrieves information about an alarm model. If you don't specify a value for the alarmModelVersion parameter, the latest version is returned.
   */
  describeAlarmModel(callback?: (err: AWSError, data: IoTEvents.Types.DescribeAlarmModelResponse) => void): Request<IoTEvents.Types.DescribeAlarmModelResponse, AWSError>;
  /**
   * Describes a detector model. If the version parameter is not specified, information about the latest version is returned.
   */
  describeDetectorModel(params: IoTEvents.Types.DescribeDetectorModelRequest, callback?: (err: AWSError, data: IoTEvents.Types.DescribeDetectorModelResponse) => void): Request<IoTEvents.Types.DescribeDetectorModelResponse, AWSError>;
  /**
   * Describes a detector model. If the version parameter is not specified, information about the latest version is returned.
   */
  describeDetectorModel(callback?: (err: AWSError, data: IoTEvents.Types.DescribeDetectorModelResponse) => void): Request<IoTEvents.Types.DescribeDetectorModelResponse, AWSError>;
  /**
   * Retrieves runtime information about a detector model analysis.  After AWS IoT Events starts analyzing your detector model, you have up to 24 hours to retrieve the analysis results. 
   */
  describeDetectorModelAnalysis(params: IoTEvents.Types.DescribeDetectorModelAnalysisRequest, callback?: (err: AWSError, data: IoTEvents.Types.DescribeDetectorModelAnalysisResponse) => void): Request<IoTEvents.Types.DescribeDetectorModelAnalysisResponse, AWSError>;
  /**
   * Retrieves runtime information about a detector model analysis.  After AWS IoT Events starts analyzing your detector model, you have up to 24 hours to retrieve the analysis results. 
   */
  describeDetectorModelAnalysis(callback?: (err: AWSError, data: IoTEvents.Types.DescribeDetectorModelAnalysisResponse) => void): Request<IoTEvents.Types.DescribeDetectorModelAnalysisResponse, AWSError>;
  /**
   * Describes an input.
   */
  describeInput(params: IoTEvents.Types.DescribeInputRequest, callback?: (err: AWSError, data: IoTEvents.Types.DescribeInputResponse) => void): Request<IoTEvents.Types.DescribeInputResponse, AWSError>;
  /**
   * Describes an input.
   */
  describeInput(callback?: (err: AWSError, data: IoTEvents.Types.DescribeInputResponse) => void): Request<IoTEvents.Types.DescribeInputResponse, AWSError>;
  /**
   * Retrieves the current settings of the AWS IoT Events logging options.
   */
  describeLoggingOptions(params: IoTEvents.Types.DescribeLoggingOptionsRequest, callback?: (err: AWSError, data: IoTEvents.Types.DescribeLoggingOptionsResponse) => void): Request<IoTEvents.Types.DescribeLoggingOptionsResponse, AWSError>;
  /**
   * Retrieves the current settings of the AWS IoT Events logging options.
   */
  describeLoggingOptions(callback?: (err: AWSError, data: IoTEvents.Types.DescribeLoggingOptionsResponse) => void): Request<IoTEvents.Types.DescribeLoggingOptionsResponse, AWSError>;
  /**
   * Retrieves one or more analysis results of the detector model.  After AWS IoT Events starts analyzing your detector model, you have up to 24 hours to retrieve the analysis results. 
   */
  getDetectorModelAnalysisResults(params: IoTEvents.Types.GetDetectorModelAnalysisResultsRequest, callback?: (err: AWSError, data: IoTEvents.Types.GetDetectorModelAnalysisResultsResponse) => void): Request<IoTEvents.Types.GetDetectorModelAnalysisResultsResponse, AWSError>;
  /**
   * Retrieves one or more analysis results of the detector model.  After AWS IoT Events starts analyzing your detector model, you have up to 24 hours to retrieve the analysis results. 
   */
  getDetectorModelAnalysisResults(callback?: (err: AWSError, data: IoTEvents.Types.GetDetectorModelAnalysisResultsResponse) => void): Request<IoTEvents.Types.GetDetectorModelAnalysisResultsResponse, AWSError>;
  /**
   * Lists all the versions of an alarm model. The operation returns only the metadata associated with each alarm model version.
   */
  listAlarmModelVersions(params: IoTEvents.Types.ListAlarmModelVersionsRequest, callback?: (err: AWSError, data: IoTEvents.Types.ListAlarmModelVersionsResponse) => void): Request<IoTEvents.Types.ListAlarmModelVersionsResponse, AWSError>;
  /**
   * Lists all the versions of an alarm model. The operation returns only the metadata associated with each alarm model version.
   */
  listAlarmModelVersions(callback?: (err: AWSError, data: IoTEvents.Types.ListAlarmModelVersionsResponse) => void): Request<IoTEvents.Types.ListAlarmModelVersionsResponse, AWSError>;
  /**
   * Lists the alarm models that you created. The operation returns only the metadata associated with each alarm model.
   */
  listAlarmModels(params: IoTEvents.Types.ListAlarmModelsRequest, callback?: (err: AWSError, data: IoTEvents.Types.ListAlarmModelsResponse) => void): Request<IoTEvents.Types.ListAlarmModelsResponse, AWSError>;
  /**
   * Lists the alarm models that you created. The operation returns only the metadata associated with each alarm model.
   */
  listAlarmModels(callback?: (err: AWSError, data: IoTEvents.Types.ListAlarmModelsResponse) => void): Request<IoTEvents.Types.ListAlarmModelsResponse, AWSError>;
  /**
   * Lists all the versions of a detector model. Only the metadata associated with each detector model version is returned.
   */
  listDetectorModelVersions(params: IoTEvents.Types.ListDetectorModelVersionsRequest, callback?: (err: AWSError, data: IoTEvents.Types.ListDetectorModelVersionsResponse) => void): Request<IoTEvents.Types.ListDetectorModelVersionsResponse, AWSError>;
  /**
   * Lists all the versions of a detector model. Only the metadata associated with each detector model version is returned.
   */
  listDetectorModelVersions(callback?: (err: AWSError, data: IoTEvents.Types.ListDetectorModelVersionsResponse) => void): Request<IoTEvents.Types.ListDetectorModelVersionsResponse, AWSError>;
  /**
   * Lists the detector models you have created. Only the metadata associated with each detector model is returned.
   */
  listDetectorModels(params: IoTEvents.Types.ListDetectorModelsRequest, callback?: (err: AWSError, data: IoTEvents.Types.ListDetectorModelsResponse) => void): Request<IoTEvents.Types.ListDetectorModelsResponse, AWSError>;
  /**
   * Lists the detector models you have created. Only the metadata associated with each detector model is returned.
   */
  listDetectorModels(callback?: (err: AWSError, data: IoTEvents.Types.ListDetectorModelsResponse) => void): Request<IoTEvents.Types.ListDetectorModelsResponse, AWSError>;
  /**
   *  Lists one or more input routings. 
   */
  listInputRoutings(params: IoTEvents.Types.ListInputRoutingsRequest, callback?: (err: AWSError, data: IoTEvents.Types.ListInputRoutingsResponse) => void): Request<IoTEvents.Types.ListInputRoutingsResponse, AWSError>;
  /**
   *  Lists one or more input routings. 
   */
  listInputRoutings(callback?: (err: AWSError, data: IoTEvents.Types.ListInputRoutingsResponse) => void): Request<IoTEvents.Types.ListInputRoutingsResponse, AWSError>;
  /**
   * Lists the inputs you have created.
   */
  listInputs(params: IoTEvents.Types.ListInputsRequest, callback?: (err: AWSError, data: IoTEvents.Types.ListInputsResponse) => void): Request<IoTEvents.Types.ListInputsResponse, AWSError>;
  /**
   * Lists the inputs you have created.
   */
  listInputs(callback?: (err: AWSError, data: IoTEvents.Types.ListInputsResponse) => void): Request<IoTEvents.Types.ListInputsResponse, AWSError>;
  /**
   * Lists the tags (metadata) you have assigned to the resource.
   */
  listTagsForResource(params: IoTEvents.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: IoTEvents.Types.ListTagsForResourceResponse) => void): Request<IoTEvents.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags (metadata) you have assigned to the resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: IoTEvents.Types.ListTagsForResourceResponse) => void): Request<IoTEvents.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Sets or updates the AWS IoT Events logging options. If you update the value of any loggingOptions field, it takes up to one minute for the change to take effect. If you change the policy attached to the role you specified in the roleArn field (for example, to correct an invalid policy), it takes up to five minutes for that change to take effect.
   */
  putLoggingOptions(params: IoTEvents.Types.PutLoggingOptionsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets or updates the AWS IoT Events logging options. If you update the value of any loggingOptions field, it takes up to one minute for the change to take effect. If you change the policy attached to the role you specified in the roleArn field (for example, to correct an invalid policy), it takes up to five minutes for that change to take effect.
   */
  putLoggingOptions(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Performs an analysis of your detector model. For more information, see Troubleshooting a detector model in the AWS IoT Events Developer Guide.
   */
  startDetectorModelAnalysis(params: IoTEvents.Types.StartDetectorModelAnalysisRequest, callback?: (err: AWSError, data: IoTEvents.Types.StartDetectorModelAnalysisResponse) => void): Request<IoTEvents.Types.StartDetectorModelAnalysisResponse, AWSError>;
  /**
   * Performs an analysis of your detector model. For more information, see Troubleshooting a detector model in the AWS IoT Events Developer Guide.
   */
  startDetectorModelAnalysis(callback?: (err: AWSError, data: IoTEvents.Types.StartDetectorModelAnalysisResponse) => void): Request<IoTEvents.Types.StartDetectorModelAnalysisResponse, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata that can be used to manage a resource.
   */
  tagResource(params: IoTEvents.Types.TagResourceRequest, callback?: (err: AWSError, data: IoTEvents.Types.TagResourceResponse) => void): Request<IoTEvents.Types.TagResourceResponse, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata that can be used to manage a resource.
   */
  tagResource(callback?: (err: AWSError, data: IoTEvents.Types.TagResourceResponse) => void): Request<IoTEvents.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the given tags (metadata) from the resource.
   */
  untagResource(params: IoTEvents.Types.UntagResourceRequest, callback?: (err: AWSError, data: IoTEvents.Types.UntagResourceResponse) => void): Request<IoTEvents.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the given tags (metadata) from the resource.
   */
  untagResource(callback?: (err: AWSError, data: IoTEvents.Types.UntagResourceResponse) => void): Request<IoTEvents.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an alarm model. Any alarms that were created based on the previous version are deleted and then created again as new data arrives.
   */
  updateAlarmModel(params: IoTEvents.Types.UpdateAlarmModelRequest, callback?: (err: AWSError, data: IoTEvents.Types.UpdateAlarmModelResponse) => void): Request<IoTEvents.Types.UpdateAlarmModelResponse, AWSError>;
  /**
   * Updates an alarm model. Any alarms that were created based on the previous version are deleted and then created again as new data arrives.
   */
  updateAlarmModel(callback?: (err: AWSError, data: IoTEvents.Types.UpdateAlarmModelResponse) => void): Request<IoTEvents.Types.UpdateAlarmModelResponse, AWSError>;
  /**
   * Updates a detector model. Detectors (instances) spawned by the previous version are deleted and then re-created as new inputs arrive.
   */
  updateDetectorModel(params: IoTEvents.Types.UpdateDetectorModelRequest, callback?: (err: AWSError, data: IoTEvents.Types.UpdateDetectorModelResponse) => void): Request<IoTEvents.Types.UpdateDetectorModelResponse, AWSError>;
  /**
   * Updates a detector model. Detectors (instances) spawned by the previous version are deleted and then re-created as new inputs arrive.
   */
  updateDetectorModel(callback?: (err: AWSError, data: IoTEvents.Types.UpdateDetectorModelResponse) => void): Request<IoTEvents.Types.UpdateDetectorModelResponse, AWSError>;
  /**
   * Updates an input.
   */
  updateInput(params: IoTEvents.Types.UpdateInputRequest, callback?: (err: AWSError, data: IoTEvents.Types.UpdateInputResponse) => void): Request<IoTEvents.Types.UpdateInputResponse, AWSError>;
  /**
   * Updates an input.
   */
  updateInput(callback?: (err: AWSError, data: IoTEvents.Types.UpdateInputResponse) => void): Request<IoTEvents.Types.UpdateInputResponse, AWSError>;
}
declare namespace IoTEvents {
  export interface AcknowledgeFlow {
    /**
     * The value must be TRUE or FALSE. If TRUE, you receive a notification when the alarm state changes. You must choose to acknowledge the notification before the alarm state can return to NORMAL. If FALSE, you won't receive notifications. The alarm automatically changes to the NORMAL state when the input property value returns to the specified range.
     */
    enabled: AcknowledgeFlowEnabled;
  }
  export type AcknowledgeFlowEnabled = boolean;
  export interface Action {
    /**
     * Sets a variable to a specified value.
     */
    setVariable?: SetVariableAction;
    /**
     * Sends an Amazon SNS message.
     */
    sns?: SNSTopicPublishAction;
    /**
     * Publishes an MQTT message with the given topic to the AWS IoT message broker.
     */
    iotTopicPublish?: IotTopicPublishAction;
    /**
     * Information needed to set the timer.
     */
    setTimer?: SetTimerAction;
    /**
     * Information needed to clear the timer.
     */
    clearTimer?: ClearTimerAction;
    /**
     * Information needed to reset the timer.
     */
    resetTimer?: ResetTimerAction;
    /**
     * Calls a Lambda function, passing in information about the detector model instance and the event that triggered the action.
     */
    lambda?: LambdaAction;
    /**
     * Sends AWS IoT Events input, which passes information about the detector model instance and the event that triggered the action.
     */
    iotEvents?: IotEventsAction;
    /**
     * Sends information about the detector model instance and the event that triggered the action to an Amazon SQS queue.
     */
    sqs?: SqsAction;
    /**
     * Sends information about the detector model instance and the event that triggered the action to an Amazon Kinesis Data Firehose delivery stream.
     */
    firehose?: FirehoseAction;
    /**
     * Writes to the DynamoDB table that you created. The default action payload contains all attribute-value pairs that have the information about the detector model instance and the event that triggered the action. You can customize the payload. One column of the DynamoDB table receives all attribute-value pairs in the payload that you specify. For more information, see Actions in AWS IoT Events Developer Guide.
     */
    dynamoDB?: DynamoDBAction;
    /**
     * Writes to the DynamoDB table that you created. The default action payload contains all attribute-value pairs that have the information about the detector model instance and the event that triggered the action. You can customize the payload. A separate column of the DynamoDB table receives one attribute-value pair in the payload that you specify. For more information, see Actions in AWS IoT Events Developer Guide.
     */
    dynamoDBv2?: DynamoDBv2Action;
    /**
     * Sends information about the detector model instance and the event that triggered the action to an asset property in AWS IoT SiteWise .
     */
    iotSiteWise?: IotSiteWiseAction;
  }
  export type Actions = Action[];
  export interface AlarmAction {
    sns?: SNSTopicPublishAction;
    iotTopicPublish?: IotTopicPublishAction;
    lambda?: LambdaAction;
    iotEvents?: IotEventsAction;
    sqs?: SqsAction;
    firehose?: FirehoseAction;
    dynamoDB?: DynamoDBAction;
    dynamoDBv2?: DynamoDBv2Action;
    iotSiteWise?: IotSiteWiseAction;
  }
  export type AlarmActions = AlarmAction[];
  export interface AlarmCapabilities {
    /**
     * Specifies the default alarm state. The configuration applies to all alarms that were created based on this alarm model.
     */
    initializationConfiguration?: InitializationConfiguration;
    /**
     * Specifies whether to get notified for alarm state changes.
     */
    acknowledgeFlow?: AcknowledgeFlow;
  }
  export interface AlarmEventActions {
    /**
     * Specifies one or more supported actions to receive notifications when the alarm state changes.
     */
    alarmActions?: AlarmActions;
  }
  export type AlarmModelArn = string;
  export type AlarmModelDescription = string;
  export type AlarmModelName = string;
  export type AlarmModelSummaries = AlarmModelSummary[];
  export interface AlarmModelSummary {
    /**
     * The time the alarm model was created, in the Unix epoch format.
     */
    creationTime?: Timestamp;
    /**
     * The description of the alarm model.
     */
    alarmModelDescription?: AlarmModelDescription;
    /**
     * The name of the alarm model.
     */
    alarmModelName?: AlarmModelName;
  }
  export type AlarmModelVersion = string;
  export type AlarmModelVersionStatus = "ACTIVE"|"ACTIVATING"|"INACTIVE"|"FAILED"|string;
  export type AlarmModelVersionSummaries = AlarmModelVersionSummary[];
  export interface AlarmModelVersionSummary {
    /**
     * The name of the alarm model.
     */
    alarmModelName?: AlarmModelName;
    /**
     * The ARN of the alarm model. For more information, see Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    alarmModelArn?: AlarmModelArn;
    /**
     * The version of the alarm model.
     */
    alarmModelVersion?: AlarmModelVersion;
    /**
     * The ARN of the IAM role that allows the alarm to perform actions and access AWS resources. For more information, see Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    roleArn?: AmazonResourceName;
    /**
     * The time the alarm model was created, in the Unix epoch format.
     */
    creationTime?: Timestamp;
    /**
     * The time the alarm model was last updated, in the Unix epoch format.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The status of the alarm model. The status can be one of the following values:    ACTIVE - The alarm model is active and it's ready to evaluate data.    ACTIVATING - AWS IoT Events is activating your alarm model. Activating an alarm model can take up to a few minutes.    INACTIVE - The alarm model is inactive, so it isn't ready to evaluate data. Check your alarm model information and update the alarm model.    FAILED - You couldn't create or update the alarm model. Check your alarm model information and try again.  
     */
    status?: AlarmModelVersionStatus;
    /**
     *  Contains information about the status of the alarm model version. 
     */
    statusMessage?: StatusMessage;
  }
  export interface AlarmNotification {
    /**
     * Contains the notification settings of an alarm model. The settings apply to all alarms that were created based on this alarm model.
     */
    notificationActions?: NotificationActions;
  }
  export interface AlarmRule {
    /**
     * A rule that compares an input property value to a threshold value with a comparison operator.
     */
    simpleRule?: SimpleRule;
  }
  export type AmazonResourceName = string;
  export type AnalysisId = string;
  export type AnalysisMessage = string;
  export interface AnalysisResult {
    /**
     * The type of the analysis result. Analyses fall into the following types based on the validators used to generate the analysis result:    supported-actions - You must specify AWS IoT Events supported actions that work with other AWS services in a supported AWS Region.    service-limits - Resources or API operations can't exceed service quotas (also known as limits). Update your detector model or request a quota increase.    structure - The detector model must follow a structure that AWS IoT Events supports.     expression-syntax - Your expression must follow the required syntax.    data-type - Data types referenced in the detector model must be compatible.    referenced-data - You must define the data referenced in your detector model before you can use the data.    referenced-resource - Resources that the detector model uses must be available.   For more information, see Running detector model analyses in the AWS IoT Events Developer Guide.
     */
    type?: AnalysisType;
    /**
     * The severity level of the analysis result. Based on the severity level, analysis results fall into three general categories:    INFO - An information result tells you about a significant field in your detector model. This type of result usually doesn't require immediate action.    WARNING - A warning result draws special attention to fields that might cause issues for your detector model. We recommend that you review warnings and take necessary actions before you use your detector model in production environments. Otherwise, the detector model might not work as expected.    ERROR - An error result notifies you about a problem found in your detector model. You must fix all errors before you can publish your detector model.  
     */
    level?: AnalysisResultLevel;
    /**
     * Contains additional information about the analysis result.
     */
    message?: AnalysisMessage;
    /**
     * Contains one or more locations that you can use to locate the fields in your detector model that the analysis result references.
     */
    locations?: AnalysisResultLocations;
  }
  export type AnalysisResultLevel = "INFO"|"WARNING"|"ERROR"|string;
  export interface AnalysisResultLocation {
    /**
     * A JsonPath expression that identifies the error field in your detector model.
     */
    path?: AnalysisResultLocationPath;
  }
  export type AnalysisResultLocationPath = string;
  export type AnalysisResultLocations = AnalysisResultLocation[];
  export type AnalysisResults = AnalysisResult[];
  export type AnalysisStatus = "RUNNING"|"COMPLETE"|"FAILED"|string;
  export type AnalysisType = string;
  export type AssetId = string;
  export type AssetModelId = string;
  export type AssetPropertyAlias = string;
  export type AssetPropertyBooleanValue = string;
  export type AssetPropertyDoubleValue = string;
  export type AssetPropertyEntryId = string;
  export type AssetPropertyId = string;
  export type AssetPropertyIntegerValue = string;
  export type AssetPropertyOffsetInNanos = string;
  export type AssetPropertyQuality = string;
  export type AssetPropertyStringValue = string;
  export type AssetPropertyTimeInSeconds = string;
  export interface AssetPropertyTimestamp {
    /**
     * The timestamp, in seconds, in the Unix epoch format. The valid range is between 1-31556889864403199.
     */
    timeInSeconds: AssetPropertyTimeInSeconds;
    /**
     * The nanosecond offset converted from timeInSeconds. The valid range is between 0-999999999.
     */
    offsetInNanos?: AssetPropertyOffsetInNanos;
  }
  export interface AssetPropertyValue {
    /**
     * The value to send to an asset property.
     */
    value?: AssetPropertyVariant;
    /**
     * The timestamp associated with the asset property value. The default is the current event time.
     */
    timestamp?: AssetPropertyTimestamp;
    /**
     * The quality of the asset property value. The value must be 'GOOD', 'BAD', or 'UNCERTAIN'.
     */
    quality?: AssetPropertyQuality;
  }
  export interface AssetPropertyVariant {
    /**
     * The asset property value is a string. You must use an expression, and the evaluated result should be a string.
     */
    stringValue?: AssetPropertyStringValue;
    /**
     * The asset property value is an integer. You must use an expression, and the evaluated result should be an integer.
     */
    integerValue?: AssetPropertyIntegerValue;
    /**
     * The asset property value is a double. You must use an expression, and the evaluated result should be a double.
     */
    doubleValue?: AssetPropertyDoubleValue;
    /**
     * The asset property value is a Boolean value that must be 'TRUE' or 'FALSE'. You must use an expression, and the evaluated result should be a Boolean value.
     */
    booleanValue?: AssetPropertyBooleanValue;
  }
  export interface Attribute {
    /**
     * An expression that specifies an attribute-value pair in a JSON structure. Use this to specify an attribute from the JSON payload that is made available by the input. Inputs are derived from messages sent to AWS IoT Events (BatchPutMessage). Each such message contains a JSON payload. The attribute (and its paired value) specified here are available for use in the condition expressions used by detectors.  Syntax: &lt;field-name&gt;.&lt;field-name&gt;... 
     */
    jsonPath: AttributeJsonPath;
  }
  export type AttributeJsonPath = string;
  export type Attributes = Attribute[];
  export interface ClearTimerAction {
    /**
     * The name of the timer to clear.
     */
    timerName: TimerName;
  }
  export type ComparisonOperator = "GREATER"|"GREATER_OR_EQUAL"|"LESS"|"LESS_OR_EQUAL"|"EQUAL"|"NOT_EQUAL"|string;
  export type Condition = string;
  export type ContentExpression = string;
  export interface CreateAlarmModelRequest {
    /**
     * A unique name that helps you identify the alarm model. You can't change this name after you create the alarm model.
     */
    alarmModelName: AlarmModelName;
    /**
     * A description that tells you what the alarm model detects.
     */
    alarmModelDescription?: AlarmModelDescription;
    /**
     * The ARN of the IAM role that allows the alarm to perform actions and access AWS resources. For more information, see Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    roleArn: AmazonResourceName;
    /**
     * A list of key-value pairs that contain metadata for the alarm model. The tags help you manage the alarm model. For more information, see Tagging your AWS IoT Events resources in the AWS IoT Events Developer Guide. You can create up to 50 tags for one alarm model.
     */
    tags?: Tags;
    /**
     * An input attribute used as a key to create an alarm. AWS IoT Events routes inputs associated with this key to the alarm.
     */
    key?: AttributeJsonPath;
    /**
     * A non-negative integer that reflects the severity level of the alarm.
     */
    severity?: Severity;
    /**
     * Defines when your alarm is invoked.
     */
    alarmRule: AlarmRule;
    /**
     * Contains information about one or more notification actions.
     */
    alarmNotification?: AlarmNotification;
    /**
     * Contains information about one or more alarm actions.
     */
    alarmEventActions?: AlarmEventActions;
    /**
     * Contains the configuration information of alarm state changes.
     */
    alarmCapabilities?: AlarmCapabilities;
  }
  export interface CreateAlarmModelResponse {
    /**
     * The time the alarm model was created, in the Unix epoch format.
     */
    creationTime?: Timestamp;
    /**
     * The ARN of the alarm model. For more information, see Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    alarmModelArn?: AlarmModelArn;
    /**
     * The version of the alarm model.
     */
    alarmModelVersion?: AlarmModelVersion;
    /**
     * The time the alarm model was last updated, in the Unix epoch format.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The status of the alarm model. The status can be one of the following values:    ACTIVE - The alarm model is active and it's ready to evaluate data.    ACTIVATING - AWS IoT Events is activating your alarm model. Activating an alarm model can take up to a few minutes.    INACTIVE - The alarm model is inactive, so it isn't ready to evaluate data. Check your alarm model information and update the alarm model.    FAILED - You couldn't create or update the alarm model. Check your alarm model information and try again.  
     */
    status?: AlarmModelVersionStatus;
  }
  export interface CreateDetectorModelRequest {
    /**
     * The name of the detector model.
     */
    detectorModelName: DetectorModelName;
    /**
     * Information that defines how the detectors operate.
     */
    detectorModelDefinition: DetectorModelDefinition;
    /**
     * A brief description of the detector model.
     */
    detectorModelDescription?: DetectorModelDescription;
    /**
     * The input attribute key used to identify a device or system to create a detector (an instance of the detector model) and then to route each input received to the appropriate detector (instance). This parameter uses a JSON-path expression in the message payload of each input to specify the attribute-value pair that is used to identify the device associated with the input.
     */
    key?: AttributeJsonPath;
    /**
     * The ARN of the role that grants permission to AWS IoT Events to perform its operations.
     */
    roleArn: AmazonResourceName;
    /**
     * Metadata that can be used to manage the detector model.
     */
    tags?: Tags;
    /**
     * Information about the order in which events are evaluated and how actions are executed. 
     */
    evaluationMethod?: EvaluationMethod;
  }
  export interface CreateDetectorModelResponse {
    /**
     * Information about how the detector model is configured.
     */
    detectorModelConfiguration?: DetectorModelConfiguration;
  }
  export interface CreateInputRequest {
    /**
     * The name you want to give to the input.
     */
    inputName: InputName;
    /**
     * A brief description of the input.
     */
    inputDescription?: InputDescription;
    /**
     * The definition of the input.
     */
    inputDefinition: InputDefinition;
    /**
     * Metadata that can be used to manage the input.
     */
    tags?: Tags;
  }
  export interface CreateInputResponse {
    /**
     * Information about the configuration of the input.
     */
    inputConfiguration?: InputConfiguration;
  }
  export interface DeleteAlarmModelRequest {
    /**
     * The name of the alarm model.
     */
    alarmModelName: AlarmModelName;
  }
  export interface DeleteAlarmModelResponse {
  }
  export interface DeleteDetectorModelRequest {
    /**
     * The name of the detector model to be deleted.
     */
    detectorModelName: DetectorModelName;
  }
  export interface DeleteDetectorModelResponse {
  }
  export interface DeleteInputRequest {
    /**
     * The name of the input to delete.
     */
    inputName: InputName;
  }
  export interface DeleteInputResponse {
  }
  export type DeliveryStreamName = string;
  export interface DescribeAlarmModelRequest {
    /**
     * The name of the alarm model.
     */
    alarmModelName: AlarmModelName;
    /**
     * The version of the alarm model.
     */
    alarmModelVersion?: AlarmModelVersion;
  }
  export interface DescribeAlarmModelResponse {
    /**
     * The time the alarm model was created, in the Unix epoch format.
     */
    creationTime?: Timestamp;
    /**
     * The ARN of the alarm model. For more information, see Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    alarmModelArn?: AlarmModelArn;
    /**
     * The version of the alarm model.
     */
    alarmModelVersion?: AlarmModelVersion;
    /**
     * The time the alarm model was last updated, in the Unix epoch format.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The status of the alarm model. The status can be one of the following values:    ACTIVE - The alarm model is active and it's ready to evaluate data.    ACTIVATING - AWS IoT Events is activating your alarm model. Activating an alarm model can take up to a few minutes.    INACTIVE - The alarm model is inactive, so it isn't ready to evaluate data. Check your alarm model information and update the alarm model.    FAILED - You couldn't create or update the alarm model. Check your alarm model information and try again.  
     */
    status?: AlarmModelVersionStatus;
    /**
     *  Contains information about the status of the alarm model. 
     */
    statusMessage?: StatusMessage;
    /**
     * The name of the alarm model.
     */
    alarmModelName?: AlarmModelName;
    /**
     * The description of the alarm model.
     */
    alarmModelDescription?: AlarmModelDescription;
    /**
     * The ARN of the IAM role that allows the alarm to perform actions and access AWS resources. For more information, see Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    roleArn?: AmazonResourceName;
    /**
     * An input attribute used as a key to create an alarm. AWS IoT Events routes inputs associated with this key to the alarm.
     */
    key?: AttributeJsonPath;
    /**
     * A non-negative integer that reflects the severity level of the alarm.
     */
    severity?: Severity;
    /**
     * Defines when your alarm is invoked.
     */
    alarmRule?: AlarmRule;
    /**
     * Contains information about one or more notification actions.
     */
    alarmNotification?: AlarmNotification;
    /**
     * Contains information about one or more alarm actions.
     */
    alarmEventActions?: AlarmEventActions;
    /**
     * Contains the configuration information of alarm state changes.
     */
    alarmCapabilities?: AlarmCapabilities;
  }
  export interface DescribeDetectorModelAnalysisRequest {
    /**
     * The ID of the analysis result that you want to retrieve.
     */
    analysisId: AnalysisId;
  }
  export interface DescribeDetectorModelAnalysisResponse {
    /**
     * The status of the analysis activity. The status can be one of the following values:    RUNNING - AWS IoT Events is analyzing your detector model. This process can take several minutes to complete.    COMPLETE - AWS IoT Events finished analyzing your detector model.    FAILED - AWS IoT Events couldn't analyze your detector model. Try again later.  
     */
    status?: AnalysisStatus;
  }
  export interface DescribeDetectorModelRequest {
    /**
     * The name of the detector model.
     */
    detectorModelName: DetectorModelName;
    /**
     * The version of the detector model.
     */
    detectorModelVersion?: DetectorModelVersion;
  }
  export interface DescribeDetectorModelResponse {
    /**
     * Information about the detector model.
     */
    detectorModel?: DetectorModel;
  }
  export interface DescribeInputRequest {
    /**
     * The name of the input.
     */
    inputName: InputName;
  }
  export interface DescribeInputResponse {
    /**
     * Information about the input.
     */
    input?: Input;
  }
  export interface DescribeLoggingOptionsRequest {
  }
  export interface DescribeLoggingOptionsResponse {
    /**
     * The current settings of the AWS IoT Events logging options.
     */
    loggingOptions?: LoggingOptions;
  }
  export interface DetectorDebugOption {
    /**
     * The name of the detector model.
     */
    detectorModelName: DetectorModelName;
    /**
     * The value of the input attribute key used to create the detector (the instance of the detector model).
     */
    keyValue?: KeyValue;
  }
  export type DetectorDebugOptions = DetectorDebugOption[];
  export interface DetectorModel {
    /**
     * Information that defines how a detector operates.
     */
    detectorModelDefinition?: DetectorModelDefinition;
    /**
     * Information about how the detector is configured.
     */
    detectorModelConfiguration?: DetectorModelConfiguration;
  }
  export type DetectorModelArn = string;
  export interface DetectorModelConfiguration {
    /**
     * The name of the detector model.
     */
    detectorModelName?: DetectorModelName;
    /**
     * The version of the detector model.
     */
    detectorModelVersion?: DetectorModelVersion;
    /**
     * A brief description of the detector model.
     */
    detectorModelDescription?: DetectorModelDescription;
    /**
     * The ARN of the detector model.
     */
    detectorModelArn?: DetectorModelArn;
    /**
     * The ARN of the role that grants permission to AWS IoT Events to perform its operations.
     */
    roleArn?: AmazonResourceName;
    /**
     * The time the detector model was created.
     */
    creationTime?: Timestamp;
    /**
     * The time the detector model was last updated.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The status of the detector model.
     */
    status?: DetectorModelVersionStatus;
    /**
     * The value used to identify a detector instance. When a device or system sends input, a new detector instance with a unique key value is created. AWS IoT Events can continue to route input to its corresponding detector instance based on this identifying information.  This parameter uses a JSON-path expression to select the attribute-value pair in the message payload that is used for identification. To route the message to the correct detector instance, the device must send a message payload that contains the same attribute-value.
     */
    key?: AttributeJsonPath;
    /**
     * Information about the order in which events are evaluated and how actions are executed. 
     */
    evaluationMethod?: EvaluationMethod;
  }
  export interface DetectorModelDefinition {
    /**
     * Information about the states of the detector.
     */
    states: States;
    /**
     * The state that is entered at the creation of each detector (instance).
     */
    initialStateName: StateName;
  }
  export type DetectorModelDescription = string;
  export type DetectorModelName = string;
  export type DetectorModelSummaries = DetectorModelSummary[];
  export interface DetectorModelSummary {
    /**
     * The name of the detector model.
     */
    detectorModelName?: DetectorModelName;
    /**
     * A brief description of the detector model.
     */
    detectorModelDescription?: DetectorModelDescription;
    /**
     * The time the detector model was created.
     */
    creationTime?: Timestamp;
  }
  export type DetectorModelVersion = string;
  export type DetectorModelVersionStatus = "ACTIVE"|"ACTIVATING"|"INACTIVE"|"DEPRECATED"|"DRAFT"|"PAUSED"|"FAILED"|string;
  export type DetectorModelVersionSummaries = DetectorModelVersionSummary[];
  export interface DetectorModelVersionSummary {
    /**
     * The name of the detector model.
     */
    detectorModelName?: DetectorModelName;
    /**
     * The ID of the detector model version.
     */
    detectorModelVersion?: DetectorModelVersion;
    /**
     * The ARN of the detector model version.
     */
    detectorModelArn?: DetectorModelArn;
    /**
     * The ARN of the role that grants the detector model permission to perform its tasks.
     */
    roleArn?: AmazonResourceName;
    /**
     * The time the detector model version was created.
     */
    creationTime?: Timestamp;
    /**
     * The last time the detector model version was updated.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The status of the detector model version.
     */
    status?: DetectorModelVersionStatus;
    /**
     * Information about the order in which events are evaluated and how actions are executed. 
     */
    evaluationMethod?: EvaluationMethod;
  }
  export type DisabledOnInitialization = boolean;
  export interface DynamoDBAction {
    /**
     * The data type for the hash key (also called the partition key). You can specify the following values:    'STRING' - The hash key is a string.    'NUMBER' - The hash key is a number.   If you don't specify hashKeyType, the default value is 'STRING'.
     */
    hashKeyType?: DynamoKeyType;
    /**
     * The name of the hash key (also called the partition key). The hashKeyField value must match the partition key of the target DynamoDB table.
     */
    hashKeyField: DynamoKeyField;
    /**
     * The value of the hash key (also called the partition key).
     */
    hashKeyValue: DynamoKeyValue;
    /**
     * The data type for the range key (also called the sort key), You can specify the following values:    'STRING' - The range key is a string.    'NUMBER' - The range key is number.   If you don't specify rangeKeyField, the default value is 'STRING'.
     */
    rangeKeyType?: DynamoKeyType;
    /**
     * The name of the range key (also called the sort key). The rangeKeyField value must match the sort key of the target DynamoDB table. 
     */
    rangeKeyField?: DynamoKeyField;
    /**
     * The value of the range key (also called the sort key).
     */
    rangeKeyValue?: DynamoKeyValue;
    /**
     * The type of operation to perform. You can specify the following values:     'INSERT' - Insert data as a new item into the DynamoDB table. This item uses the specified hash key as a partition key. If you specified a range key, the item uses the range key as a sort key.    'UPDATE' - Update an existing item of the DynamoDB table with new data. This item's partition key must match the specified hash key. If you specified a range key, the range key must match the item's sort key.    'DELETE' - Delete an existing item of the DynamoDB table. This item's partition key must match the specified hash key. If you specified a range key, the range key must match the item's sort key.   If you don't specify this parameter, AWS IoT Events triggers the 'INSERT' operation.
     */
    operation?: DynamoOperation;
    /**
     * The name of the DynamoDB column that receives the action payload. If you don't specify this parameter, the name of the DynamoDB column is payload.
     */
    payloadField?: DynamoKeyField;
    /**
     * The name of the DynamoDB table. The tableName value must match the table name of the target DynamoDB table. 
     */
    tableName: DynamoTableName;
    payload?: Payload;
  }
  export interface DynamoDBv2Action {
    /**
     * The name of the DynamoDB table.
     */
    tableName: DynamoTableName;
    payload?: Payload;
  }
  export type DynamoKeyField = string;
  export type DynamoKeyType = string;
  export type DynamoKeyValue = string;
  export type DynamoOperation = string;
  export type DynamoTableName = string;
  export interface EmailConfiguration {
    /**
     * The email address that sends emails.  If you use the AWS IoT Events managed AWS Lambda function to manage your emails, you must verify the email address that sends emails in Amazon SES. 
     */
    from: FromEmail;
    /**
     * Contains the subject and message of an email.
     */
    content?: EmailContent;
    /**
     * Contains the information of one or more recipients who receive the emails.  You must add the users that receive emails to your AWS SSO store. 
     */
    recipients: EmailRecipients;
  }
  export type EmailConfigurations = EmailConfiguration[];
  export interface EmailContent {
    /**
     * The subject of the email.
     */
    subject?: EmailSubject;
    /**
     * The message that you want to send. The message can be up to 200 characters.
     */
    additionalMessage?: NotificationAdditionalMessage;
  }
  export interface EmailRecipients {
    /**
     * Specifies one or more recipients who receive the email.
     */
    to?: RecipientDetails;
  }
  export type EmailSubject = string;
  export type EvaluationMethod = "BATCH"|"SERIAL"|string;
  export interface Event {
    /**
     * The name of the event.
     */
    eventName: EventName;
    /**
     * Optional. The Boolean expression that, when TRUE, causes the actions to be performed. If not present, the actions are performed (=TRUE). If the expression result is not a Boolean value, the actions are not performed (=FALSE).
     */
    condition?: Condition;
    /**
     * The actions to be performed.
     */
    actions?: Actions;
  }
  export type EventName = string;
  export type Events = Event[];
  export interface FirehoseAction {
    /**
     * The name of the Kinesis Data Firehose delivery stream where the data is written.
     */
    deliveryStreamName: DeliveryStreamName;
    /**
     * A character separator that is used to separate records written to the Kinesis Data Firehose delivery stream. Valid values are: '\n' (newline), '\t' (tab), '\r\n' (Windows newline), ',' (comma).
     */
    separator?: FirehoseSeparator;
    /**
     * You can configure the action payload when you send a message to an Amazon Kinesis Data Firehose delivery stream.
     */
    payload?: Payload;
  }
  export type FirehoseSeparator = string;
  export type FromEmail = string;
  export interface GetDetectorModelAnalysisResultsRequest {
    /**
     * The ID of the analysis result that you want to retrieve.
     */
    analysisId: AnalysisId;
    /**
     * The token that you can use to return the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to be returned per request.
     */
    maxResults?: MaxAnalysisResults;
  }
  export interface GetDetectorModelAnalysisResultsResponse {
    /**
     * Contains information about one or more analysis results.
     */
    analysisResults?: AnalysisResults;
    /**
     * The token that you can use to return the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export type IdentityStoreId = string;
  export interface InitializationConfiguration {
    /**
     * The value must be TRUE or FALSE. If FALSE, all alarm instances created based on the alarm model are activated. The default value is TRUE.
     */
    disabledOnInitialization: DisabledOnInitialization;
  }
  export interface Input {
    /**
     * Information about the configuration of an input.
     */
    inputConfiguration?: InputConfiguration;
    /**
     * The definition of the input.
     */
    inputDefinition?: InputDefinition;
  }
  export type InputArn = string;
  export interface InputConfiguration {
    /**
     * The name of the input.
     */
    inputName: InputName;
    /**
     * A brief description of the input.
     */
    inputDescription?: InputDescription;
    /**
     * The ARN of the input.
     */
    inputArn: InputArn;
    /**
     * The time the input was created.
     */
    creationTime: Timestamp;
    /**
     * The last time the input was updated.
     */
    lastUpdateTime: Timestamp;
    /**
     * The status of the input.
     */
    status: InputStatus;
  }
  export interface InputDefinition {
    /**
     * The attributes from the JSON payload that are made available by the input. Inputs are derived from messages sent to the AWS IoT Events system using BatchPutMessage. Each such message contains a JSON payload, and those attributes (and their paired values) specified here are available for use in the condition expressions used by detectors that monitor this input. 
     */
    attributes: Attributes;
  }
  export type InputDescription = string;
  export interface InputIdentifier {
    /**
     *  The identifier of the input routed to AWS IoT Events. 
     */
    iotEventsInputIdentifier?: IotEventsInputIdentifier;
    /**
     *  The identifer of the input routed from AWS IoT SiteWise. 
     */
    iotSiteWiseInputIdentifier?: IotSiteWiseInputIdentifier;
  }
  export type InputName = string;
  export type InputProperty = string;
  export type InputStatus = "CREATING"|"UPDATING"|"ACTIVE"|"DELETING"|string;
  export type InputSummaries = InputSummary[];
  export interface InputSummary {
    /**
     * The name of the input.
     */
    inputName?: InputName;
    /**
     * A brief description of the input.
     */
    inputDescription?: InputDescription;
    /**
     * The ARN of the input.
     */
    inputArn?: InputArn;
    /**
     * The time the input was created.
     */
    creationTime?: Timestamp;
    /**
     * The last time the input was updated.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The status of the input.
     */
    status?: InputStatus;
  }
  export interface IotEventsAction {
    /**
     * The name of the AWS IoT Events input where the data is sent.
     */
    inputName: InputName;
    /**
     * You can configure the action payload when you send a message to an AWS IoT Events input.
     */
    payload?: Payload;
  }
  export interface IotEventsInputIdentifier {
    /**
     *  The name of the input routed to AWS IoT Events. 
     */
    inputName: InputName;
  }
  export interface IotSiteWiseAction {
    /**
     * A unique identifier for this entry. You can use the entry ID to track which data entry causes an error in case of failure. The default is a new unique identifier.
     */
    entryId?: AssetPropertyEntryId;
    /**
     * The ID of the asset that has the specified property.
     */
    assetId?: AssetId;
    /**
     * The ID of the asset property.
     */
    propertyId?: AssetPropertyId;
    /**
     * The alias of the asset property.
     */
    propertyAlias?: AssetPropertyAlias;
    /**
     * The value to send to the asset property. This value contains timestamp, quality, and value (TQV) information. 
     */
    propertyValue?: AssetPropertyValue;
  }
  export interface IotSiteWiseAssetModelPropertyIdentifier {
    /**
     *  The ID of the AWS IoT SiteWise asset model. 
     */
    assetModelId: AssetModelId;
    /**
     *  The ID of the AWS IoT SiteWise asset property. 
     */
    propertyId: AssetPropertyId;
  }
  export interface IotSiteWiseInputIdentifier {
    /**
     *  The identifier of the AWS IoT SiteWise asset model property. 
     */
    iotSiteWiseAssetModelPropertyIdentifier?: IotSiteWiseAssetModelPropertyIdentifier;
  }
  export interface IotTopicPublishAction {
    /**
     * The MQTT topic of the message. You can use a string expression that includes variables ($variable.&lt;variable-name&gt;) and input values ($input.&lt;input-name&gt;.&lt;path-to-datum&gt;) as the topic string.
     */
    mqttTopic: MQTTTopic;
    /**
     * You can configure the action payload when you publish a message to an AWS IoT Core topic.
     */
    payload?: Payload;
  }
  export type KeyValue = string;
  export interface LambdaAction {
    /**
     * The ARN of the Lambda function that is executed.
     */
    functionArn: AmazonResourceName;
    /**
     * You can configure the action payload when you send a message to a Lambda function.
     */
    payload?: Payload;
  }
  export interface ListAlarmModelVersionsRequest {
    /**
     * The name of the alarm model.
     */
    alarmModelName: AlarmModelName;
    /**
     * The token that you can use to return the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to be returned per request.
     */
    maxResults?: MaxResults;
  }
  export interface ListAlarmModelVersionsResponse {
    /**
     * A list that summarizes each alarm model version.
     */
    alarmModelVersionSummaries?: AlarmModelVersionSummaries;
    /**
     * The token that you can use to return the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAlarmModelsRequest {
    /**
     * The token that you can use to return the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to be returned per request.
     */
    maxResults?: MaxResults;
  }
  export interface ListAlarmModelsResponse {
    /**
     * A list that summarizes each alarm model.
     */
    alarmModelSummaries?: AlarmModelSummaries;
    /**
     * The token that you can use to return the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListDetectorModelVersionsRequest {
    /**
     * The name of the detector model whose versions are returned.
     */
    detectorModelName: DetectorModelName;
    /**
     * The token that you can use to return the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to be returned per request.
     */
    maxResults?: MaxResults;
  }
  export interface ListDetectorModelVersionsResponse {
    /**
     * Summary information about the detector model versions.
     */
    detectorModelVersionSummaries?: DetectorModelVersionSummaries;
    /**
     * The token that you can use to return the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListDetectorModelsRequest {
    /**
     * The token that you can use to return the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to be returned per request.
     */
    maxResults?: MaxResults;
  }
  export interface ListDetectorModelsResponse {
    /**
     * Summary information about the detector models.
     */
    detectorModelSummaries?: DetectorModelSummaries;
    /**
     * The token that you can use to return the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListInputRoutingsRequest {
    /**
     *  The identifer of the routed input. 
     */
    inputIdentifier: InputIdentifier;
    /**
     *  The maximum number of results to be returned per request. 
     */
    maxResults?: MaxResults;
    /**
     *  The token that you can use to return the next set of results. 
     */
    nextToken?: NextToken;
  }
  export interface ListInputRoutingsResponse {
    /**
     *  Summary information about the routed resources. 
     */
    routedResources?: RoutedResources;
    /**
     *  The token that you can use to return the next set of results, or null if there are no more results. 
     */
    nextToken?: NextToken;
  }
  export interface ListInputsRequest {
    /**
     * The token that you can use to return the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to be returned per request.
     */
    maxResults?: MaxResults;
  }
  export interface ListInputsResponse {
    /**
     * Summary information about the inputs.
     */
    inputSummaries?: InputSummaries;
    /**
     * The token that you can use to return the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of tags assigned to the resource.
     */
    tags?: Tags;
  }
  export type LoggingEnabled = boolean;
  export type LoggingLevel = "ERROR"|"INFO"|"DEBUG"|string;
  export interface LoggingOptions {
    /**
     * The ARN of the role that grants permission to AWS IoT Events to perform logging.
     */
    roleArn: AmazonResourceName;
    /**
     * The logging level.
     */
    level: LoggingLevel;
    /**
     * If TRUE, logging is enabled for AWS IoT Events.
     */
    enabled: LoggingEnabled;
    /**
     * Information that identifies those detector models and their detectors (instances) for which the logging level is given.
     */
    detectorDebugOptions?: DetectorDebugOptions;
  }
  export type MQTTTopic = string;
  export type MaxAnalysisResults = number;
  export type MaxResults = number;
  export type NextToken = string;
  export interface NotificationAction {
    /**
     * Specifies an AWS Lambda function to manage alarm notifications. You can create one or use the AWS Lambda function provided by AWS IoT Events.
     */
    action: NotificationTargetActions;
    /**
     * Contains the configuration information of SMS notifications.
     */
    smsConfigurations?: SMSConfigurations;
    /**
     * Contains the configuration information of email notifications.
     */
    emailConfigurations?: EmailConfigurations;
  }
  export type NotificationActions = NotificationAction[];
  export type NotificationAdditionalMessage = string;
  export interface NotificationTargetActions {
    lambdaAction?: LambdaAction;
  }
  export interface OnEnterLifecycle {
    /**
     * Specifies the actions that are performed when the state is entered and the condition is TRUE.
     */
    events?: Events;
  }
  export interface OnExitLifecycle {
    /**
     * Specifies the actions that are performed when the state is exited and the condition is TRUE.
     */
    events?: Events;
  }
  export interface OnInputLifecycle {
    /**
     * Specifies the actions performed when the condition evaluates to TRUE.
     */
    events?: Events;
    /**
     * Specifies the actions performed, and the next state entered, when a condition evaluates to TRUE.
     */
    transitionEvents?: TransitionEvents;
  }
  export interface Payload {
    /**
     * The content of the payload. You can use a string expression that includes quoted strings ('&lt;string&gt;'), variables ($variable.&lt;variable-name&gt;), input values ($input.&lt;input-name&gt;.&lt;path-to-datum&gt;), string concatenations, and quoted strings that contain ${} as the content. The recommended maximum size of a content expression is 1 KB.
     */
    contentExpression: ContentExpression;
    /**
     * The value of the payload type can be either STRING or JSON.
     */
    type: PayloadType;
  }
  export type PayloadType = "STRING"|"JSON"|string;
  export interface PutLoggingOptionsRequest {
    /**
     * The new values of the AWS IoT Events logging options.
     */
    loggingOptions: LoggingOptions;
  }
  export type QueueUrl = string;
  export interface RecipientDetail {
    /**
     * The AWS Single Sign-On (AWS SSO) authentication information.
     */
    ssoIdentity?: SSOIdentity;
  }
  export type RecipientDetails = RecipientDetail[];
  export interface ResetTimerAction {
    /**
     * The name of the timer to reset.
     */
    timerName: TimerName;
  }
  export type ResourceName = string;
  export interface RoutedResource {
    /**
     *  The name of the routed resource. 
     */
    name?: ResourceName;
    /**
     *  The ARN of the routed resource. For more information, see Amazon Resource Names (ARNs) in the AWS General Reference. 
     */
    arn?: AmazonResourceName;
  }
  export type RoutedResources = RoutedResource[];
  export interface SMSConfiguration {
    /**
     * The sender ID.
     */
    senderId?: SMSSenderId;
    /**
     * The message that you want to send. The message can be up to 200 characters.
     */
    additionalMessage?: NotificationAdditionalMessage;
    /**
     * Specifies one or more recipients who receive the message.  You must add the users that receive SMS messages to your AWS SSO store. 
     */
    recipients: RecipientDetails;
  }
  export type SMSConfigurations = SMSConfiguration[];
  export type SMSSenderId = string;
  export interface SNSTopicPublishAction {
    /**
     * The ARN of the Amazon SNS target where the message is sent.
     */
    targetArn: AmazonResourceName;
    /**
     * You can configure the action payload when you send a message as an Amazon SNS push notification.
     */
    payload?: Payload;
  }
  export interface SSOIdentity {
    /**
     * The ID of the AWS SSO identity store.
     */
    identityStoreId: IdentityStoreId;
    /**
     * The user ID.
     */
    userId?: SSOReferenceId;
  }
  export type SSOReferenceId = string;
  export type Seconds = number;
  export interface SetTimerAction {
    /**
     * The name of the timer.
     */
    timerName: TimerName;
    /**
     * The number of seconds until the timer expires. The minimum value is 60 seconds to ensure accuracy. The maximum value is 31622400 seconds. 
     */
    seconds?: Seconds;
    /**
     * The duration of the timer, in seconds. You can use a string expression that includes numbers, variables ($variable.&lt;variable-name&gt;), and input values ($input.&lt;input-name&gt;.&lt;path-to-datum&gt;) as the duration. The range of the duration is 1-31622400 seconds. To ensure accuracy, the minimum duration is 60 seconds. The evaluated result of the duration is rounded down to the nearest whole number. 
     */
    durationExpression?: VariableValue;
  }
  export interface SetVariableAction {
    /**
     * The name of the variable.
     */
    variableName: VariableName;
    /**
     * The new value of the variable.
     */
    value: VariableValue;
  }
  export type Severity = number;
  export interface SimpleRule {
    /**
     * The value on the left side of the comparison operator. You can specify an AWS IoT Events input attribute as an input property.
     */
    inputProperty: InputProperty;
    /**
     * The comparison operator.
     */
    comparisonOperator: ComparisonOperator;
    /**
     * The value on the right side of the comparison operator. You can enter a number or specify an AWS IoT Events input attribute.
     */
    threshold: Threshold;
  }
  export interface SqsAction {
    /**
     * The URL of the SQS queue where the data is written.
     */
    queueUrl: QueueUrl;
    /**
     * Set this to TRUE if you want the data to be base-64 encoded before it is written to the queue. Otherwise, set this to FALSE.
     */
    useBase64?: UseBase64;
    /**
     * You can configure the action payload when you send a message to an Amazon SQS queue.
     */
    payload?: Payload;
  }
  export interface StartDetectorModelAnalysisRequest {
    detectorModelDefinition: DetectorModelDefinition;
  }
  export interface StartDetectorModelAnalysisResponse {
    /**
     * The ID that you can use to retrieve the analysis result.
     */
    analysisId?: AnalysisId;
  }
  export interface State {
    /**
     * The name of the state.
     */
    stateName: StateName;
    /**
     * When an input is received and the condition is TRUE, perform the specified actions.
     */
    onInput?: OnInputLifecycle;
    /**
     * When entering this state, perform these actions if the condition is TRUE.
     */
    onEnter?: OnEnterLifecycle;
    /**
     * When exiting this state, perform these actions if the specified condition is TRUE.
     */
    onExit?: OnExitLifecycle;
  }
  export type StateName = string;
  export type States = State[];
  export type StatusMessage = string;
  export interface Tag {
    /**
     * The tag's key.
     */
    key: TagKey;
    /**
     * The tag's value.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: AmazonResourceName;
    /**
     * The new or modified tags for the resource.
     */
    tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export type Threshold = string;
  export type TimerName = string;
  export type Timestamp = Date;
  export interface TransitionEvent {
    /**
     * The name of the transition event.
     */
    eventName: EventName;
    /**
     * Required. A Boolean expression that when TRUE causes the actions to be performed and the nextState to be entered.
     */
    condition: Condition;
    /**
     * The actions to be performed.
     */
    actions?: Actions;
    /**
     * The next state to enter.
     */
    nextState: StateName;
  }
  export type TransitionEvents = TransitionEvent[];
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: AmazonResourceName;
    /**
     * A list of the keys of the tags to be removed from the resource.
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAlarmModelRequest {
    /**
     * The name of the alarm model.
     */
    alarmModelName: AlarmModelName;
    /**
     * The description of the alarm model.
     */
    alarmModelDescription?: AlarmModelDescription;
    /**
     * The ARN of the IAM role that allows the alarm to perform actions and access AWS resources. For more information, see Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    roleArn: AmazonResourceName;
    /**
     * A non-negative integer that reflects the severity level of the alarm.
     */
    severity?: Severity;
    /**
     * Defines when your alarm is invoked.
     */
    alarmRule: AlarmRule;
    /**
     * Contains information about one or more notification actions.
     */
    alarmNotification?: AlarmNotification;
    /**
     * Contains information about one or more alarm actions.
     */
    alarmEventActions?: AlarmEventActions;
    /**
     * Contains the configuration information of alarm state changes.
     */
    alarmCapabilities?: AlarmCapabilities;
  }
  export interface UpdateAlarmModelResponse {
    /**
     * The time the alarm model was created, in the Unix epoch format.
     */
    creationTime?: Timestamp;
    /**
     * The ARN of the alarm model. For more information, see Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    alarmModelArn?: AlarmModelArn;
    /**
     * The version of the alarm model.
     */
    alarmModelVersion?: AlarmModelVersion;
    /**
     * The time the alarm model was last updated, in the Unix epoch format.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The status of the alarm model. The status can be one of the following values:    ACTIVE - The alarm model is active and it's ready to evaluate data.    ACTIVATING - AWS IoT Events is activating your alarm model. Activating an alarm model can take up to a few minutes.    INACTIVE - The alarm model is inactive, so it isn't ready to evaluate data. Check your alarm model information and update the alarm model.    FAILED - You couldn't create or update the alarm model. Check your alarm model information and try again.  
     */
    status?: AlarmModelVersionStatus;
  }
  export interface UpdateDetectorModelRequest {
    /**
     * The name of the detector model that is updated.
     */
    detectorModelName: DetectorModelName;
    /**
     * Information that defines how a detector operates.
     */
    detectorModelDefinition: DetectorModelDefinition;
    /**
     * A brief description of the detector model.
     */
    detectorModelDescription?: DetectorModelDescription;
    /**
     * The ARN of the role that grants permission to AWS IoT Events to perform its operations.
     */
    roleArn: AmazonResourceName;
    /**
     * Information about the order in which events are evaluated and how actions are executed. 
     */
    evaluationMethod?: EvaluationMethod;
  }
  export interface UpdateDetectorModelResponse {
    /**
     * Information about how the detector model is configured.
     */
    detectorModelConfiguration?: DetectorModelConfiguration;
  }
  export interface UpdateInputRequest {
    /**
     * The name of the input you want to update.
     */
    inputName: InputName;
    /**
     * A brief description of the input.
     */
    inputDescription?: InputDescription;
    /**
     * The definition of the input.
     */
    inputDefinition: InputDefinition;
  }
  export interface UpdateInputResponse {
    /**
     * Information about the configuration of the input.
     */
    inputConfiguration?: InputConfiguration;
  }
  export type UseBase64 = boolean;
  export type VariableName = string;
  export type VariableValue = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-07-27"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IoTEvents client.
   */
  export import Types = IoTEvents;
}
export = IoTEvents;
