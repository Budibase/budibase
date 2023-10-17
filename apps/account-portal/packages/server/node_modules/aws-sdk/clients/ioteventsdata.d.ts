import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IoTEventsData extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IoTEventsData.Types.ClientConfiguration)
  config: Config & IoTEventsData.Types.ClientConfiguration;
  /**
   * Acknowledges one or more alarms. The alarms change to the ACKNOWLEDGED state after you acknowledge them.
   */
  batchAcknowledgeAlarm(params: IoTEventsData.Types.BatchAcknowledgeAlarmRequest, callback?: (err: AWSError, data: IoTEventsData.Types.BatchAcknowledgeAlarmResponse) => void): Request<IoTEventsData.Types.BatchAcknowledgeAlarmResponse, AWSError>;
  /**
   * Acknowledges one or more alarms. The alarms change to the ACKNOWLEDGED state after you acknowledge them.
   */
  batchAcknowledgeAlarm(callback?: (err: AWSError, data: IoTEventsData.Types.BatchAcknowledgeAlarmResponse) => void): Request<IoTEventsData.Types.BatchAcknowledgeAlarmResponse, AWSError>;
  /**
   * Deletes one or more detectors that were created. When a detector is deleted, its state will be cleared and the detector will be removed from the list of detectors. The deleted detector will no longer appear if referenced in the ListDetectors API call.
   */
  batchDeleteDetector(params: IoTEventsData.Types.BatchDeleteDetectorRequest, callback?: (err: AWSError, data: IoTEventsData.Types.BatchDeleteDetectorResponse) => void): Request<IoTEventsData.Types.BatchDeleteDetectorResponse, AWSError>;
  /**
   * Deletes one or more detectors that were created. When a detector is deleted, its state will be cleared and the detector will be removed from the list of detectors. The deleted detector will no longer appear if referenced in the ListDetectors API call.
   */
  batchDeleteDetector(callback?: (err: AWSError, data: IoTEventsData.Types.BatchDeleteDetectorResponse) => void): Request<IoTEventsData.Types.BatchDeleteDetectorResponse, AWSError>;
  /**
   * Disables one or more alarms. The alarms change to the DISABLED state after you disable them.
   */
  batchDisableAlarm(params: IoTEventsData.Types.BatchDisableAlarmRequest, callback?: (err: AWSError, data: IoTEventsData.Types.BatchDisableAlarmResponse) => void): Request<IoTEventsData.Types.BatchDisableAlarmResponse, AWSError>;
  /**
   * Disables one or more alarms. The alarms change to the DISABLED state after you disable them.
   */
  batchDisableAlarm(callback?: (err: AWSError, data: IoTEventsData.Types.BatchDisableAlarmResponse) => void): Request<IoTEventsData.Types.BatchDisableAlarmResponse, AWSError>;
  /**
   * Enables one or more alarms. The alarms change to the NORMAL state after you enable them.
   */
  batchEnableAlarm(params: IoTEventsData.Types.BatchEnableAlarmRequest, callback?: (err: AWSError, data: IoTEventsData.Types.BatchEnableAlarmResponse) => void): Request<IoTEventsData.Types.BatchEnableAlarmResponse, AWSError>;
  /**
   * Enables one or more alarms. The alarms change to the NORMAL state after you enable them.
   */
  batchEnableAlarm(callback?: (err: AWSError, data: IoTEventsData.Types.BatchEnableAlarmResponse) => void): Request<IoTEventsData.Types.BatchEnableAlarmResponse, AWSError>;
  /**
   * Sends a set of messages to the IoT Events system. Each message payload is transformed into the input you specify ("inputName") and ingested into any detectors that monitor that input. If multiple messages are sent, the order in which the messages are processed isn't guaranteed. To guarantee ordering, you must send messages one at a time and wait for a successful response.
   */
  batchPutMessage(params: IoTEventsData.Types.BatchPutMessageRequest, callback?: (err: AWSError, data: IoTEventsData.Types.BatchPutMessageResponse) => void): Request<IoTEventsData.Types.BatchPutMessageResponse, AWSError>;
  /**
   * Sends a set of messages to the IoT Events system. Each message payload is transformed into the input you specify ("inputName") and ingested into any detectors that monitor that input. If multiple messages are sent, the order in which the messages are processed isn't guaranteed. To guarantee ordering, you must send messages one at a time and wait for a successful response.
   */
  batchPutMessage(callback?: (err: AWSError, data: IoTEventsData.Types.BatchPutMessageResponse) => void): Request<IoTEventsData.Types.BatchPutMessageResponse, AWSError>;
  /**
   * Resets one or more alarms. The alarms return to the NORMAL state after you reset them.
   */
  batchResetAlarm(params: IoTEventsData.Types.BatchResetAlarmRequest, callback?: (err: AWSError, data: IoTEventsData.Types.BatchResetAlarmResponse) => void): Request<IoTEventsData.Types.BatchResetAlarmResponse, AWSError>;
  /**
   * Resets one or more alarms. The alarms return to the NORMAL state after you reset them.
   */
  batchResetAlarm(callback?: (err: AWSError, data: IoTEventsData.Types.BatchResetAlarmResponse) => void): Request<IoTEventsData.Types.BatchResetAlarmResponse, AWSError>;
  /**
   * Changes one or more alarms to the snooze mode. The alarms change to the SNOOZE_DISABLED state after you set them to the snooze mode.
   */
  batchSnoozeAlarm(params: IoTEventsData.Types.BatchSnoozeAlarmRequest, callback?: (err: AWSError, data: IoTEventsData.Types.BatchSnoozeAlarmResponse) => void): Request<IoTEventsData.Types.BatchSnoozeAlarmResponse, AWSError>;
  /**
   * Changes one or more alarms to the snooze mode. The alarms change to the SNOOZE_DISABLED state after you set them to the snooze mode.
   */
  batchSnoozeAlarm(callback?: (err: AWSError, data: IoTEventsData.Types.BatchSnoozeAlarmResponse) => void): Request<IoTEventsData.Types.BatchSnoozeAlarmResponse, AWSError>;
  /**
   * Updates the state, variable values, and timer settings of one or more detectors (instances) of a specified detector model.
   */
  batchUpdateDetector(params: IoTEventsData.Types.BatchUpdateDetectorRequest, callback?: (err: AWSError, data: IoTEventsData.Types.BatchUpdateDetectorResponse) => void): Request<IoTEventsData.Types.BatchUpdateDetectorResponse, AWSError>;
  /**
   * Updates the state, variable values, and timer settings of one or more detectors (instances) of a specified detector model.
   */
  batchUpdateDetector(callback?: (err: AWSError, data: IoTEventsData.Types.BatchUpdateDetectorResponse) => void): Request<IoTEventsData.Types.BatchUpdateDetectorResponse, AWSError>;
  /**
   * Retrieves information about an alarm.
   */
  describeAlarm(params: IoTEventsData.Types.DescribeAlarmRequest, callback?: (err: AWSError, data: IoTEventsData.Types.DescribeAlarmResponse) => void): Request<IoTEventsData.Types.DescribeAlarmResponse, AWSError>;
  /**
   * Retrieves information about an alarm.
   */
  describeAlarm(callback?: (err: AWSError, data: IoTEventsData.Types.DescribeAlarmResponse) => void): Request<IoTEventsData.Types.DescribeAlarmResponse, AWSError>;
  /**
   * Returns information about the specified detector (instance).
   */
  describeDetector(params: IoTEventsData.Types.DescribeDetectorRequest, callback?: (err: AWSError, data: IoTEventsData.Types.DescribeDetectorResponse) => void): Request<IoTEventsData.Types.DescribeDetectorResponse, AWSError>;
  /**
   * Returns information about the specified detector (instance).
   */
  describeDetector(callback?: (err: AWSError, data: IoTEventsData.Types.DescribeDetectorResponse) => void): Request<IoTEventsData.Types.DescribeDetectorResponse, AWSError>;
  /**
   * Lists one or more alarms. The operation returns only the metadata associated with each alarm.
   */
  listAlarms(params: IoTEventsData.Types.ListAlarmsRequest, callback?: (err: AWSError, data: IoTEventsData.Types.ListAlarmsResponse) => void): Request<IoTEventsData.Types.ListAlarmsResponse, AWSError>;
  /**
   * Lists one or more alarms. The operation returns only the metadata associated with each alarm.
   */
  listAlarms(callback?: (err: AWSError, data: IoTEventsData.Types.ListAlarmsResponse) => void): Request<IoTEventsData.Types.ListAlarmsResponse, AWSError>;
  /**
   * Lists detectors (the instances of a detector model).
   */
  listDetectors(params: IoTEventsData.Types.ListDetectorsRequest, callback?: (err: AWSError, data: IoTEventsData.Types.ListDetectorsResponse) => void): Request<IoTEventsData.Types.ListDetectorsResponse, AWSError>;
  /**
   * Lists detectors (the instances of a detector model).
   */
  listDetectors(callback?: (err: AWSError, data: IoTEventsData.Types.ListDetectorsResponse) => void): Request<IoTEventsData.Types.ListDetectorsResponse, AWSError>;
}
declare namespace IoTEventsData {
  export interface AcknowledgeActionConfiguration {
    /**
     * The note that you can leave when you acknowledge the alarm.
     */
    note?: Note;
  }
  export interface AcknowledgeAlarmActionRequest {
    /**
     * The request ID. Each ID must be unique within each batch.
     */
    requestId: RequestId;
    /**
     * The name of the alarm model.
     */
    alarmModelName: AlarmModelName;
    /**
     * The value of the key used as a filter to select only the alarms associated with the key.
     */
    keyValue?: KeyValue;
    /**
     * The note that you can leave when you acknowledge the alarm.
     */
    note?: Note;
  }
  export type AcknowledgeAlarmActionRequests = AcknowledgeAlarmActionRequest[];
  export interface Alarm {
    /**
     * The name of the alarm model.
     */
    alarmModelName?: AlarmModelName;
    /**
     * The version of the alarm model.
     */
    alarmModelVersion?: AlarmModelVersion;
    /**
     * The value of the key used as a filter to select only the alarms associated with the key.
     */
    keyValue?: KeyValue;
    /**
     * Contains information about the current state of the alarm.
     */
    alarmState?: AlarmState;
    /**
     * A non-negative integer that reflects the severity level of the alarm.
     */
    severity?: Severity;
    /**
     * The time the alarm was created, in the Unix epoch format.
     */
    creationTime?: Timestamp;
    /**
     * The time the alarm was last updated, in the Unix epoch format.
     */
    lastUpdateTime?: Timestamp;
  }
  export type AlarmModelName = string;
  export type AlarmModelVersion = string;
  export interface AlarmState {
    /**
     * The name of the alarm state. The state name can be one of the following values:    DISABLED - When the alarm is in the DISABLED state, it isn't ready to evaluate data. To enable the alarm, you must change the alarm to the NORMAL state.    NORMAL - When the alarm is in the NORMAL state, it's ready to evaluate data.    ACTIVE - If the alarm is in the ACTIVE state, the alarm is invoked.    ACKNOWLEDGED - When the alarm is in the ACKNOWLEDGED state, the alarm was invoked and you acknowledged the alarm.    SNOOZE_DISABLED - When the alarm is in the SNOOZE_DISABLED state, the alarm is disabled for a specified period of time. After the snooze time, the alarm automatically changes to the NORMAL state.     LATCHED - When the alarm is in the LATCHED state, the alarm was invoked. However, the data that the alarm is currently evaluating is within the specified range. To change the alarm to the NORMAL state, you must acknowledge the alarm.  
     */
    stateName?: AlarmStateName;
    /**
     * Information needed to evaluate data.
     */
    ruleEvaluation?: RuleEvaluation;
    /**
     * Contains information about the action that you can take to respond to the alarm.
     */
    customerAction?: CustomerAction;
    /**
     * Contains information about alarm state changes.
     */
    systemEvent?: SystemEvent;
  }
  export type AlarmStateName = "DISABLED"|"NORMAL"|"ACTIVE"|"ACKNOWLEDGED"|"SNOOZE_DISABLED"|"LATCHED"|string;
  export type AlarmSummaries = AlarmSummary[];
  export interface AlarmSummary {
    /**
     * The name of the alarm model.
     */
    alarmModelName?: AlarmModelName;
    /**
     * The version of the alarm model.
     */
    alarmModelVersion?: AlarmModelVersion;
    /**
     * The value of the key used as a filter to select only the alarms associated with the key.
     */
    keyValue?: KeyValue;
    /**
     * The name of the alarm state. The state name can be one of the following values:    DISABLED - When the alarm is in the DISABLED state, it isn't ready to evaluate data. To enable the alarm, you must change the alarm to the NORMAL state.    NORMAL - When the alarm is in the NORMAL state, it's ready to evaluate data.    ACTIVE - If the alarm is in the ACTIVE state, the alarm is invoked.    ACKNOWLEDGED - When the alarm is in the ACKNOWLEDGED state, the alarm was invoked and you acknowledged the alarm.    SNOOZE_DISABLED - When the alarm is in the SNOOZE_DISABLED state, the alarm is disabled for a specified period of time. After the snooze time, the alarm automatically changes to the NORMAL state.     LATCHED - When the alarm is in the LATCHED state, the alarm was invoked. However, the data that the alarm is currently evaluating is within the specified range. To change the alarm to the NORMAL state, you must acknowledge the alarm.  
     */
    stateName?: AlarmStateName;
    /**
     * The time the alarm was created, in the Unix epoch format.
     */
    creationTime?: Timestamp;
    /**
     * The time the alarm was last updated, in the Unix epoch format.
     */
    lastUpdateTime?: Timestamp;
  }
  export interface BatchAcknowledgeAlarmRequest {
    /**
     * The list of acknowledge action requests. You can specify up to 10 requests per operation.
     */
    acknowledgeActionRequests: AcknowledgeAlarmActionRequests;
  }
  export interface BatchAcknowledgeAlarmResponse {
    /**
     * A list of errors associated with the request, or null if there are no errors. Each error entry contains an entry ID that helps you identify the entry that failed.
     */
    errorEntries?: BatchAlarmActionErrorEntries;
  }
  export type BatchAlarmActionErrorEntries = BatchAlarmActionErrorEntry[];
  export interface BatchAlarmActionErrorEntry {
    /**
     * The request ID. Each ID must be unique within each batch.
     */
    requestId?: RequestId;
    /**
     * The error code.
     */
    errorCode?: ErrorCode;
    /**
     * A message that describes the error.
     */
    errorMessage?: ErrorMessage;
  }
  export type BatchDeleteDetectorErrorEntries = BatchDeleteDetectorErrorEntry[];
  export interface BatchDeleteDetectorErrorEntry {
    /**
     * The ID of the message that caused the error. (See the value of the "messageId" in the detectors object of the DeleteDetectorRequest.)
     */
    messageId?: MessageId;
    /**
     * The error code.
     */
    errorCode?: ErrorCode;
    /**
     * A message that describes the error.
     */
    errorMessage?: ErrorMessage;
  }
  export interface BatchDeleteDetectorRequest {
    /**
     * The list of one or more detectors to be deleted.
     */
    detectors: DeleteDetectorRequests;
  }
  export interface BatchDeleteDetectorResponse {
    /**
     * A list of errors associated with the request, or an empty array ([]) if there are no errors. Each error entry contains a messageId that helps you identify the entry that failed.
     */
    batchDeleteDetectorErrorEntries?: BatchDeleteDetectorErrorEntries;
  }
  export interface BatchDisableAlarmRequest {
    /**
     * The list of disable action requests. You can specify up to 10 requests per operation.
     */
    disableActionRequests: DisableAlarmActionRequests;
  }
  export interface BatchDisableAlarmResponse {
    /**
     * A list of errors associated with the request, or null if there are no errors. Each error entry contains an entry ID that helps you identify the entry that failed.
     */
    errorEntries?: BatchAlarmActionErrorEntries;
  }
  export interface BatchEnableAlarmRequest {
    /**
     * The list of enable action requests. You can specify up to 10 requests per operation.
     */
    enableActionRequests: EnableAlarmActionRequests;
  }
  export interface BatchEnableAlarmResponse {
    /**
     * A list of errors associated with the request, or null if there are no errors. Each error entry contains an entry ID that helps you identify the entry that failed.
     */
    errorEntries?: BatchAlarmActionErrorEntries;
  }
  export type BatchPutMessageErrorEntries = BatchPutMessageErrorEntry[];
  export interface BatchPutMessageErrorEntry {
    /**
     * The ID of the message that caused the error. (See the value corresponding to the "messageId" key in the "message" object.)
     */
    messageId?: MessageId;
    /**
     * The error code.
     */
    errorCode?: ErrorCode;
    /**
     * A message that describes the error.
     */
    errorMessage?: ErrorMessage;
  }
  export interface BatchPutMessageRequest {
    /**
     * The list of messages to send. Each message has the following format: '{ "messageId": "string", "inputName": "string", "payload": "string"}' 
     */
    messages: Messages;
  }
  export interface BatchPutMessageResponse {
    /**
     * A list of any errors encountered when sending the messages.
     */
    BatchPutMessageErrorEntries?: BatchPutMessageErrorEntries;
  }
  export interface BatchResetAlarmRequest {
    /**
     * The list of reset action requests. You can specify up to 10 requests per operation.
     */
    resetActionRequests: ResetAlarmActionRequests;
  }
  export interface BatchResetAlarmResponse {
    /**
     * A list of errors associated with the request, or null if there are no errors. Each error entry contains an entry ID that helps you identify the entry that failed.
     */
    errorEntries?: BatchAlarmActionErrorEntries;
  }
  export interface BatchSnoozeAlarmRequest {
    /**
     * The list of snooze action requests. You can specify up to 10 requests per operation.
     */
    snoozeActionRequests: SnoozeAlarmActionRequests;
  }
  export interface BatchSnoozeAlarmResponse {
    /**
     * A list of errors associated with the request, or null if there are no errors. Each error entry contains an entry ID that helps you identify the entry that failed.
     */
    errorEntries?: BatchAlarmActionErrorEntries;
  }
  export type BatchUpdateDetectorErrorEntries = BatchUpdateDetectorErrorEntry[];
  export interface BatchUpdateDetectorErrorEntry {
    /**
     * The "messageId" of the update request that caused the error. (The value of the "messageId" in the update request "Detector" object.)
     */
    messageId?: MessageId;
    /**
     * The error code.
     */
    errorCode?: ErrorCode;
    /**
     * A message that describes the error.
     */
    errorMessage?: ErrorMessage;
  }
  export interface BatchUpdateDetectorRequest {
    /**
     * The list of detectors (instances) to update, along with the values to update.
     */
    detectors: UpdateDetectorRequests;
  }
  export interface BatchUpdateDetectorResponse {
    /**
     * A list of those detector updates that resulted in errors. (If an error is listed here, the specific update did not occur.)
     */
    batchUpdateDetectorErrorEntries?: BatchUpdateDetectorErrorEntries;
  }
  export type ComparisonOperator = "GREATER"|"GREATER_OR_EQUAL"|"LESS"|"LESS_OR_EQUAL"|"EQUAL"|"NOT_EQUAL"|string;
  export interface CustomerAction {
    /**
     * The name of the action. The action name can be one of the following values:    SNOOZE - When you snooze the alarm, the alarm state changes to SNOOZE_DISABLED.    ENABLE - When you enable the alarm, the alarm state changes to NORMAL.    DISABLE - When you disable the alarm, the alarm state changes to DISABLED.    ACKNOWLEDGE - When you acknowledge the alarm, the alarm state changes to ACKNOWLEDGED.    RESET - When you reset the alarm, the alarm state changes to NORMAL.   For more information, see the AlarmState API.
     */
    actionName?: CustomerActionName;
    /**
     * Contains the configuration information of a snooze action.
     */
    snoozeActionConfiguration?: SnoozeActionConfiguration;
    /**
     * Contains the configuration information of an enable action.
     */
    enableActionConfiguration?: EnableActionConfiguration;
    /**
     * Contains the configuration information of a disable action.
     */
    disableActionConfiguration?: DisableActionConfiguration;
    /**
     * Contains the configuration information of an acknowledge action.
     */
    acknowledgeActionConfiguration?: AcknowledgeActionConfiguration;
    /**
     * Contains the configuration information of a reset action.
     */
    resetActionConfiguration?: ResetActionConfiguration;
  }
  export type CustomerActionName = "SNOOZE"|"ENABLE"|"DISABLE"|"ACKNOWLEDGE"|"RESET"|string;
  export interface DeleteDetectorRequest {
    /**
     * The ID to assign to the DeleteDetectorRequest. Each "messageId" must be unique within each batch sent.
     */
    messageId: MessageId;
    /**
     * The name of the detector model that was used to create the detector instance.
     */
    detectorModelName: DetectorModelName;
    /**
     * The value of the key used to identify the detector. 
     */
    keyValue?: KeyValue;
  }
  export type DeleteDetectorRequests = DeleteDetectorRequest[];
  export interface DescribeAlarmRequest {
    /**
     * The name of the alarm model.
     */
    alarmModelName: AlarmModelName;
    /**
     * The value of the key used as a filter to select only the alarms associated with the key.
     */
    keyValue?: KeyValue;
  }
  export interface DescribeAlarmResponse {
    /**
     * Contains information about an alarm.
     */
    alarm?: Alarm;
  }
  export interface DescribeDetectorRequest {
    /**
     * The name of the detector model whose detectors (instances) you want information about.
     */
    detectorModelName: DetectorModelName;
    /**
     * A filter used to limit results to detectors (instances) created because of the given key ID.
     */
    keyValue?: KeyValue;
  }
  export interface DescribeDetectorResponse {
    /**
     * Information about the detector (instance).
     */
    detector?: Detector;
  }
  export interface Detector {
    /**
     * The name of the detector model that created this detector (instance).
     */
    detectorModelName?: DetectorModelName;
    /**
     * The value of the key (identifying the device or system) that caused the creation of this detector (instance).
     */
    keyValue?: KeyValue;
    /**
     * The version of the detector model that created this detector (instance).
     */
    detectorModelVersion?: DetectorModelVersion;
    /**
     * The current state of the detector (instance).
     */
    state?: DetectorState;
    /**
     * The time the detector (instance) was created.
     */
    creationTime?: Timestamp;
    /**
     * The time the detector (instance) was last updated.
     */
    lastUpdateTime?: Timestamp;
  }
  export type DetectorModelName = string;
  export type DetectorModelVersion = string;
  export interface DetectorState {
    /**
     * The name of the state.
     */
    stateName: StateName;
    /**
     * The current values of the detector's variables.
     */
    variables: Variables;
    /**
     * The current state of the detector's timers.
     */
    timers: Timers;
  }
  export interface DetectorStateDefinition {
    /**
     * The name of the new state of the detector (instance).
     */
    stateName: StateName;
    /**
     * The new values of the detector's variables. Any variable whose value isn't specified is cleared.
     */
    variables: VariableDefinitions;
    /**
     * The new values of the detector's timers. Any timer whose value isn't specified is cleared, and its timeout event won't occur.
     */
    timers: TimerDefinitions;
  }
  export interface DetectorStateSummary {
    /**
     * The name of the state.
     */
    stateName?: StateName;
  }
  export type DetectorSummaries = DetectorSummary[];
  export interface DetectorSummary {
    /**
     * The name of the detector model that created this detector (instance).
     */
    detectorModelName?: DetectorModelName;
    /**
     * The value of the key (identifying the device or system) that caused the creation of this detector (instance).
     */
    keyValue?: KeyValue;
    /**
     * The version of the detector model that created this detector (instance).
     */
    detectorModelVersion?: DetectorModelVersion;
    /**
     * The current state of the detector (instance).
     */
    state?: DetectorStateSummary;
    /**
     * The time the detector (instance) was created.
     */
    creationTime?: Timestamp;
    /**
     * The time the detector (instance) was last updated.
     */
    lastUpdateTime?: Timestamp;
  }
  export interface DisableActionConfiguration {
    /**
     * The note that you can leave when you disable the alarm.
     */
    note?: Note;
  }
  export interface DisableAlarmActionRequest {
    /**
     * The request ID. Each ID must be unique within each batch.
     */
    requestId: RequestId;
    /**
     * The name of the alarm model.
     */
    alarmModelName: AlarmModelName;
    /**
     * The value of the key used as a filter to select only the alarms associated with the key.
     */
    keyValue?: KeyValue;
    /**
     * The note that you can leave when you disable the alarm.
     */
    note?: Note;
  }
  export type DisableAlarmActionRequests = DisableAlarmActionRequest[];
  export interface EnableActionConfiguration {
    /**
     * The note that you can leave when you enable the alarm.
     */
    note?: Note;
  }
  export interface EnableAlarmActionRequest {
    /**
     * The request ID. Each ID must be unique within each batch.
     */
    requestId: RequestId;
    /**
     * The name of the alarm model.
     */
    alarmModelName: AlarmModelName;
    /**
     * The value of the key used as a filter to select only the alarms associated with the key.
     */
    keyValue?: KeyValue;
    /**
     * The note that you can leave when you enable the alarm.
     */
    note?: Note;
  }
  export type EnableAlarmActionRequests = EnableAlarmActionRequest[];
  export type EphemeralInputName = string;
  export type EpochMilliTimestamp = number;
  export type ErrorCode = "ResourceNotFoundException"|"InvalidRequestException"|"InternalFailureException"|"ServiceUnavailableException"|"ThrottlingException"|string;
  export type ErrorMessage = string;
  export type EventType = "STATE_CHANGE"|string;
  export type InputPropertyValue = string;
  export type KeyValue = string;
  export interface ListAlarmsRequest {
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
  export interface ListAlarmsResponse {
    /**
     * A list that summarizes each alarm.
     */
    alarmSummaries?: AlarmSummaries;
    /**
     * The token that you can use to return the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListDetectorsRequest {
    /**
     * The name of the detector model whose detectors (instances) are listed.
     */
    detectorModelName: DetectorModelName;
    /**
     * A filter that limits results to those detectors (instances) in the given state.
     */
    stateName?: StateName;
    /**
     * The token that you can use to return the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to be returned per request.
     */
    maxResults?: MaxResults;
  }
  export interface ListDetectorsResponse {
    /**
     * A list of summary information about the detectors (instances).
     */
    detectorSummaries?: DetectorSummaries;
    /**
     * The token that you can use to return the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export type MaxResults = number;
  export interface Message {
    /**
     * The ID to assign to the message. Within each batch sent, each "messageId" must be unique.
     */
    messageId: MessageId;
    /**
     * The name of the input into which the message payload is transformed.
     */
    inputName: EphemeralInputName;
    /**
     * The payload of the message. This can be a JSON string or a Base-64-encoded string representing binary data (in which case you must decode it).
     */
    payload: Payload;
    /**
     * The timestamp associated with the message.
     */
    timestamp?: TimestampValue;
  }
  export type MessageId = string;
  export type Messages = Message[];
  export type NextToken = string;
  export type Note = string;
  export type Payload = Buffer|Uint8Array|Blob|string;
  export type RequestId = string;
  export interface ResetActionConfiguration {
    /**
     * The note that you can leave when you reset the alarm.
     */
    note?: Note;
  }
  export interface ResetAlarmActionRequest {
    /**
     * The request ID. Each ID must be unique within each batch.
     */
    requestId: RequestId;
    /**
     * The name of the alarm model.
     */
    alarmModelName: AlarmModelName;
    /**
     * The value of the key used as a filter to select only the alarms associated with the key.
     */
    keyValue?: KeyValue;
    /**
     * The note that you can leave when you reset the alarm.
     */
    note?: Note;
  }
  export type ResetAlarmActionRequests = ResetAlarmActionRequest[];
  export interface RuleEvaluation {
    /**
     * Information needed to compare two values with a comparison operator.
     */
    simpleRuleEvaluation?: SimpleRuleEvaluation;
  }
  export type Seconds = number;
  export type Severity = number;
  export interface SimpleRuleEvaluation {
    /**
     * The value of the input property, on the left side of the comparison operator.
     */
    inputPropertyValue?: InputPropertyValue;
    /**
     * The comparison operator.
     */
    operator?: ComparisonOperator;
    /**
     * The threshold value, on the right side of the comparison operator.
     */
    thresholdValue?: ThresholdValue;
  }
  export interface SnoozeActionConfiguration {
    /**
     * The snooze time in seconds. The alarm automatically changes to the NORMAL state after this duration.
     */
    snoozeDuration?: SnoozeDuration;
    /**
     * The note that you can leave when you snooze the alarm.
     */
    note?: Note;
  }
  export interface SnoozeAlarmActionRequest {
    /**
     * The request ID. Each ID must be unique within each batch.
     */
    requestId: RequestId;
    /**
     * The name of the alarm model.
     */
    alarmModelName: AlarmModelName;
    /**
     * The value of the key used as a filter to select only the alarms associated with the key.
     */
    keyValue?: KeyValue;
    /**
     * The note that you can leave when you snooze the alarm.
     */
    note?: Note;
    /**
     * The snooze time in seconds. The alarm automatically changes to the NORMAL state after this duration.
     */
    snoozeDuration: SnoozeDuration;
  }
  export type SnoozeAlarmActionRequests = SnoozeAlarmActionRequest[];
  export type SnoozeDuration = number;
  export interface StateChangeConfiguration {
    /**
     * The trigger type. If the value is SNOOZE_TIMEOUT, the snooze duration ends and the alarm automatically changes to the NORMAL state.
     */
    triggerType?: TriggerType;
  }
  export type StateName = string;
  export interface SystemEvent {
    /**
     * The event type. If the value is STATE_CHANGE, the event contains information about alarm state changes.
     */
    eventType?: EventType;
    /**
     * Contains the configuration information of alarm state changes.
     */
    stateChangeConfiguration?: StateChangeConfiguration;
  }
  export type ThresholdValue = string;
  export interface Timer {
    /**
     * The name of the timer.
     */
    name: TimerName;
    /**
     * The expiration time for the timer.
     */
    timestamp: Timestamp;
  }
  export interface TimerDefinition {
    /**
     * The name of the timer.
     */
    name: TimerName;
    /**
     * The new setting of the timer (the number of seconds before the timer elapses).
     */
    seconds: Seconds;
  }
  export type TimerDefinitions = TimerDefinition[];
  export type TimerName = string;
  export type Timers = Timer[];
  export type Timestamp = Date;
  export interface TimestampValue {
    /**
     * The value of the timestamp, in the Unix epoch format.
     */
    timeInMillis?: EpochMilliTimestamp;
  }
  export type TriggerType = "SNOOZE_TIMEOUT"|string;
  export interface UpdateDetectorRequest {
    /**
     * The ID to assign to the detector update "message". Each "messageId" must be unique within each batch sent.
     */
    messageId: MessageId;
    /**
     * The name of the detector model that created the detectors (instances).
     */
    detectorModelName: DetectorModelName;
    /**
     * The value of the input key attribute (identifying the device or system) that caused the creation of this detector (instance).
     */
    keyValue?: KeyValue;
    /**
     * The new state, variable values, and timer settings of the detector (instance).
     */
    state: DetectorStateDefinition;
  }
  export type UpdateDetectorRequests = UpdateDetectorRequest[];
  export interface Variable {
    /**
     * The name of the variable.
     */
    name: VariableName;
    /**
     * The current value of the variable.
     */
    value: VariableValue;
  }
  export interface VariableDefinition {
    /**
     * The name of the variable.
     */
    name: VariableName;
    /**
     * The new value of the variable.
     */
    value: VariableValue;
  }
  export type VariableDefinitions = VariableDefinition[];
  export type VariableName = string;
  export type VariableValue = string;
  export type Variables = Variable[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-10-23"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IoTEventsData client.
   */
  export import Types = IoTEventsData;
}
export = IoTEventsData;
