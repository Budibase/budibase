import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Braket extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Braket.Types.ClientConfiguration)
  config: Config & Braket.Types.ClientConfiguration;
  /**
   * Cancels the specified task.
   */
  cancelQuantumTask(params: Braket.Types.CancelQuantumTaskRequest, callback?: (err: AWSError, data: Braket.Types.CancelQuantumTaskResponse) => void): Request<Braket.Types.CancelQuantumTaskResponse, AWSError>;
  /**
   * Cancels the specified task.
   */
  cancelQuantumTask(callback?: (err: AWSError, data: Braket.Types.CancelQuantumTaskResponse) => void): Request<Braket.Types.CancelQuantumTaskResponse, AWSError>;
  /**
   * Creates a quantum task.
   */
  createQuantumTask(params: Braket.Types.CreateQuantumTaskRequest, callback?: (err: AWSError, data: Braket.Types.CreateQuantumTaskResponse) => void): Request<Braket.Types.CreateQuantumTaskResponse, AWSError>;
  /**
   * Creates a quantum task.
   */
  createQuantumTask(callback?: (err: AWSError, data: Braket.Types.CreateQuantumTaskResponse) => void): Request<Braket.Types.CreateQuantumTaskResponse, AWSError>;
  /**
   * Retrieves the devices available in Amazon Braket.
   */
  getDevice(params: Braket.Types.GetDeviceRequest, callback?: (err: AWSError, data: Braket.Types.GetDeviceResponse) => void): Request<Braket.Types.GetDeviceResponse, AWSError>;
  /**
   * Retrieves the devices available in Amazon Braket.
   */
  getDevice(callback?: (err: AWSError, data: Braket.Types.GetDeviceResponse) => void): Request<Braket.Types.GetDeviceResponse, AWSError>;
  /**
   * Retrieves the specified quantum task.
   */
  getQuantumTask(params: Braket.Types.GetQuantumTaskRequest, callback?: (err: AWSError, data: Braket.Types.GetQuantumTaskResponse) => void): Request<Braket.Types.GetQuantumTaskResponse, AWSError>;
  /**
   * Retrieves the specified quantum task.
   */
  getQuantumTask(callback?: (err: AWSError, data: Braket.Types.GetQuantumTaskResponse) => void): Request<Braket.Types.GetQuantumTaskResponse, AWSError>;
  /**
   * Shows the tags associated with this resource.
   */
  listTagsForResource(params: Braket.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Braket.Types.ListTagsForResourceResponse) => void): Request<Braket.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Shows the tags associated with this resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Braket.Types.ListTagsForResourceResponse) => void): Request<Braket.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Searches for devices using the specified filters.
   */
  searchDevices(params: Braket.Types.SearchDevicesRequest, callback?: (err: AWSError, data: Braket.Types.SearchDevicesResponse) => void): Request<Braket.Types.SearchDevicesResponse, AWSError>;
  /**
   * Searches for devices using the specified filters.
   */
  searchDevices(callback?: (err: AWSError, data: Braket.Types.SearchDevicesResponse) => void): Request<Braket.Types.SearchDevicesResponse, AWSError>;
  /**
   * Searches for tasks that match the specified filter values.
   */
  searchQuantumTasks(params: Braket.Types.SearchQuantumTasksRequest, callback?: (err: AWSError, data: Braket.Types.SearchQuantumTasksResponse) => void): Request<Braket.Types.SearchQuantumTasksResponse, AWSError>;
  /**
   * Searches for tasks that match the specified filter values.
   */
  searchQuantumTasks(callback?: (err: AWSError, data: Braket.Types.SearchQuantumTasksResponse) => void): Request<Braket.Types.SearchQuantumTasksResponse, AWSError>;
  /**
   * Add a tag to the specified resource.
   */
  tagResource(params: Braket.Types.TagResourceRequest, callback?: (err: AWSError, data: Braket.Types.TagResourceResponse) => void): Request<Braket.Types.TagResourceResponse, AWSError>;
  /**
   * Add a tag to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: Braket.Types.TagResourceResponse) => void): Request<Braket.Types.TagResourceResponse, AWSError>;
  /**
   * Remove tags from a resource.
   */
  untagResource(params: Braket.Types.UntagResourceRequest, callback?: (err: AWSError, data: Braket.Types.UntagResourceResponse) => void): Request<Braket.Types.UntagResourceResponse, AWSError>;
  /**
   * Remove tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: Braket.Types.UntagResourceResponse) => void): Request<Braket.Types.UntagResourceResponse, AWSError>;
}
declare namespace Braket {
  export interface CancelQuantumTaskRequest {
    /**
     * The client token associated with the request.
     */
    clientToken: String64;
    /**
     * The ARN of the task to cancel.
     */
    quantumTaskArn: QuantumTaskArn;
  }
  export interface CancelQuantumTaskResponse {
    /**
     * The status of the cancellation request.
     */
    cancellationStatus: CancellationStatus;
    /**
     * The ARN of the task.
     */
    quantumTaskArn: QuantumTaskArn;
  }
  export type CancellationStatus = "CANCELLING"|"CANCELLED"|string;
  export interface CreateQuantumTaskRequest {
    /**
     * The action associated with the task.
     */
    action: JsonValue;
    /**
     * The client token associated with the request.
     */
    clientToken: String64;
    /**
     * The ARN of the device to run the task on.
     */
    deviceArn: DeviceArn;
    /**
     * The parameters for the device to run the task on.
     */
    deviceParameters?: CreateQuantumTaskRequestDeviceParametersString;
    /**
     * The S3 bucket to store task result files in.
     */
    outputS3Bucket: CreateQuantumTaskRequestOutputS3BucketString;
    /**
     * The key prefix for the location in the S3 bucket to store task results in.
     */
    outputS3KeyPrefix: CreateQuantumTaskRequestOutputS3KeyPrefixString;
    /**
     * The number of shots to use for the task.
     */
    shots: CreateQuantumTaskRequestShotsLong;
    /**
     * Tags to be added to the quantum task you're creating.
     */
    tags?: TagsMap;
  }
  export type CreateQuantumTaskRequestDeviceParametersString = string;
  export type CreateQuantumTaskRequestOutputS3BucketString = string;
  export type CreateQuantumTaskRequestOutputS3KeyPrefixString = string;
  export type CreateQuantumTaskRequestShotsLong = number;
  export interface CreateQuantumTaskResponse {
    /**
     * The ARN of the task created by the request.
     */
    quantumTaskArn: QuantumTaskArn;
  }
  export type DeviceArn = string;
  export type DeviceStatus = "ONLINE"|"OFFLINE"|"RETIRED"|string;
  export interface DeviceSummary {
    /**
     * The ARN of the device.
     */
    deviceArn: DeviceArn;
    /**
     * The name of the device.
     */
    deviceName: String;
    /**
     * The status of the device.
     */
    deviceStatus: DeviceStatus;
    /**
     * The type of the device.
     */
    deviceType: DeviceType;
    /**
     * The provider of the device.
     */
    providerName: String;
  }
  export type DeviceSummaryList = DeviceSummary[];
  export type DeviceType = "QPU"|"SIMULATOR"|string;
  export interface GetDeviceRequest {
    /**
     * The ARN of the device to retrieve.
     */
    deviceArn: DeviceArn;
  }
  export interface GetDeviceResponse {
    /**
     * The ARN of the device.
     */
    deviceArn: DeviceArn;
    /**
     * Details about the capabilities of the device.
     */
    deviceCapabilities: JsonValue;
    /**
     * The name of the device.
     */
    deviceName: String;
    /**
     * The status of the device.
     */
    deviceStatus: DeviceStatus;
    /**
     * The type of the device.
     */
    deviceType: DeviceType;
    /**
     * The name of the partner company for the device.
     */
    providerName: String;
  }
  export interface GetQuantumTaskRequest {
    /**
     * the ARN of the task to retrieve.
     */
    quantumTaskArn: QuantumTaskArn;
  }
  export interface GetQuantumTaskResponse {
    /**
     * The time at which the task was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The ARN of the device the task was run on.
     */
    deviceArn: DeviceArn;
    /**
     * The parameters for the device on which the task ran.
     */
    deviceParameters: JsonValue;
    /**
     * The time at which the task ended.
     */
    endedAt?: SyntheticTimestamp_date_time;
    /**
     * The reason that a task failed.
     */
    failureReason?: String;
    /**
     * The S3 bucket where task results are stored.
     */
    outputS3Bucket: String;
    /**
     * The folder in the S3 bucket where task results are stored.
     */
    outputS3Directory: String;
    /**
     * The ARN of the task.
     */
    quantumTaskArn: QuantumTaskArn;
    /**
     * The number of shots used in the task.
     */
    shots: Long;
    /**
     * The status of the task.
     */
    status: QuantumTaskStatus;
    /**
     * The tags that belong to this task.
     */
    tags?: TagsMap;
  }
  export type JsonValue = string;
  export interface ListTagsForResourceRequest {
    /**
     * Specify the resourceArn for the resource whose tags to display.
     */
    resourceArn: String;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Displays the key, value pairs of tags associated with this resource.
     */
    tags?: TagsMap;
  }
  export type Long = number;
  export type QuantumTaskArn = string;
  export type QuantumTaskStatus = "CREATED"|"QUEUED"|"RUNNING"|"COMPLETED"|"FAILED"|"CANCELLING"|"CANCELLED"|string;
  export interface QuantumTaskSummary {
    /**
     * The time at which the task was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The ARN of the device the task ran on.
     */
    deviceArn: DeviceArn;
    /**
     * The time at which the task finished.
     */
    endedAt?: SyntheticTimestamp_date_time;
    /**
     * The S3 bucket where the task result file is stored..
     */
    outputS3Bucket: String;
    /**
     * The folder in the S3 bucket where the task result file is stored.
     */
    outputS3Directory: String;
    /**
     * The ARN of the task.
     */
    quantumTaskArn: QuantumTaskArn;
    /**
     * The shots used for the task.
     */
    shots: Long;
    /**
     * The status of the task.
     */
    status: QuantumTaskStatus;
    /**
     * Displays the key, value pairs of tags associated with this quantum task.
     */
    tags?: TagsMap;
  }
  export type QuantumTaskSummaryList = QuantumTaskSummary[];
  export interface SearchDevicesFilter {
    /**
     * The name to use to filter results.
     */
    name: SearchDevicesFilterNameString;
    /**
     * The values to use to filter results.
     */
    values: SearchDevicesFilterValuesList;
  }
  export type SearchDevicesFilterNameString = string;
  export type SearchDevicesFilterValuesList = String256[];
  export interface SearchDevicesRequest {
    /**
     * The filter values to use to search for a device.
     */
    filters: SearchDevicesRequestFiltersList;
    /**
     * The maximum number of results to return in the response.
     */
    maxResults?: SearchDevicesRequestMaxResultsInteger;
    /**
     * A token used for pagination of results returned in the response. Use the token returned from the previous request continue results where the previous request ended.
     */
    nextToken?: String;
  }
  export type SearchDevicesRequestFiltersList = SearchDevicesFilter[];
  export type SearchDevicesRequestMaxResultsInteger = number;
  export interface SearchDevicesResponse {
    /**
     * An array of DeviceSummary objects for devices that match the specified filter values.
     */
    devices: DeviceSummaryList;
    /**
     * A token used for pagination of results, or null if there are no additional results. Use the token value in a subsequent request to continue results where the previous request ended.
     */
    nextToken?: String;
  }
  export interface SearchQuantumTasksFilter {
    /**
     * The name of the device used for the task.
     */
    name: String64;
    /**
     * An operator to use in the filter.
     */
    operator: SearchQuantumTasksFilterOperator;
    /**
     * The values to use for the filter.
     */
    values: SearchQuantumTasksFilterValuesList;
  }
  export type SearchQuantumTasksFilterOperator = "LT"|"LTE"|"EQUAL"|"GT"|"GTE"|"BETWEEN"|string;
  export type SearchQuantumTasksFilterValuesList = String256[];
  export interface SearchQuantumTasksRequest {
    /**
     * Array of SearchQuantumTasksFilter objects.
     */
    filters: SearchQuantumTasksRequestFiltersList;
    /**
     * Maximum number of results to return in the response.
     */
    maxResults?: SearchQuantumTasksRequestMaxResultsInteger;
    /**
     * A token used for pagination of results returned in the response. Use the token returned from the previous request continue results where the previous request ended.
     */
    nextToken?: String;
  }
  export type SearchQuantumTasksRequestFiltersList = SearchQuantumTasksFilter[];
  export type SearchQuantumTasksRequestMaxResultsInteger = number;
  export interface SearchQuantumTasksResponse {
    /**
     * A token used for pagination of results, or null if there are no additional results. Use the token value in a subsequent request to continue results where the previous request ended.
     */
    nextToken?: String;
    /**
     * An array of QuantumTaskSummary objects for tasks that match the specified filters.
     */
    quantumTasks: QuantumTaskSummaryList;
  }
  export type String = string;
  export type String256 = string;
  export type String64 = string;
  export type SyntheticTimestamp_date_time = Date;
  export type TagKeys = String[];
  export interface TagResourceRequest {
    /**
     * Specify the resourceArn of the resource to which a tag will be added.
     */
    resourceArn: String;
    /**
     * Specify the tags to add to the resource.
     */
    tags: TagsMap;
  }
  export interface TagResourceResponse {
  }
  export type TagsMap = {[key: string]: String};
  export interface UntagResourceRequest {
    /**
     * Specify the resourceArn for the resource from which to remove the tags.
     */
    resourceArn: String;
    /**
     * Specify the keys for the tags to remove from the resource.
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-09-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Braket client.
   */
  export import Types = Braket;
}
export = Braket;
