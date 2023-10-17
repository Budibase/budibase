import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AugmentedAIRuntime extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AugmentedAIRuntime.Types.ClientConfiguration)
  config: Config & AugmentedAIRuntime.Types.ClientConfiguration;
  /**
   * Deletes the specified human loop for a flow definition. If the human loop was deleted, this operation will return a ResourceNotFoundException. 
   */
  deleteHumanLoop(params: AugmentedAIRuntime.Types.DeleteHumanLoopRequest, callback?: (err: AWSError, data: AugmentedAIRuntime.Types.DeleteHumanLoopResponse) => void): Request<AugmentedAIRuntime.Types.DeleteHumanLoopResponse, AWSError>;
  /**
   * Deletes the specified human loop for a flow definition. If the human loop was deleted, this operation will return a ResourceNotFoundException. 
   */
  deleteHumanLoop(callback?: (err: AWSError, data: AugmentedAIRuntime.Types.DeleteHumanLoopResponse) => void): Request<AugmentedAIRuntime.Types.DeleteHumanLoopResponse, AWSError>;
  /**
   * Returns information about the specified human loop. If the human loop was deleted, this operation will return a ResourceNotFoundException error. 
   */
  describeHumanLoop(params: AugmentedAIRuntime.Types.DescribeHumanLoopRequest, callback?: (err: AWSError, data: AugmentedAIRuntime.Types.DescribeHumanLoopResponse) => void): Request<AugmentedAIRuntime.Types.DescribeHumanLoopResponse, AWSError>;
  /**
   * Returns information about the specified human loop. If the human loop was deleted, this operation will return a ResourceNotFoundException error. 
   */
  describeHumanLoop(callback?: (err: AWSError, data: AugmentedAIRuntime.Types.DescribeHumanLoopResponse) => void): Request<AugmentedAIRuntime.Types.DescribeHumanLoopResponse, AWSError>;
  /**
   * Returns information about human loops, given the specified parameters. If a human loop was deleted, it will not be included.
   */
  listHumanLoops(params: AugmentedAIRuntime.Types.ListHumanLoopsRequest, callback?: (err: AWSError, data: AugmentedAIRuntime.Types.ListHumanLoopsResponse) => void): Request<AugmentedAIRuntime.Types.ListHumanLoopsResponse, AWSError>;
  /**
   * Returns information about human loops, given the specified parameters. If a human loop was deleted, it will not be included.
   */
  listHumanLoops(callback?: (err: AWSError, data: AugmentedAIRuntime.Types.ListHumanLoopsResponse) => void): Request<AugmentedAIRuntime.Types.ListHumanLoopsResponse, AWSError>;
  /**
   * Starts a human loop, provided that at least one activation condition is met.
   */
  startHumanLoop(params: AugmentedAIRuntime.Types.StartHumanLoopRequest, callback?: (err: AWSError, data: AugmentedAIRuntime.Types.StartHumanLoopResponse) => void): Request<AugmentedAIRuntime.Types.StartHumanLoopResponse, AWSError>;
  /**
   * Starts a human loop, provided that at least one activation condition is met.
   */
  startHumanLoop(callback?: (err: AWSError, data: AugmentedAIRuntime.Types.StartHumanLoopResponse) => void): Request<AugmentedAIRuntime.Types.StartHumanLoopResponse, AWSError>;
  /**
   * Stops the specified human loop.
   */
  stopHumanLoop(params: AugmentedAIRuntime.Types.StopHumanLoopRequest, callback?: (err: AWSError, data: AugmentedAIRuntime.Types.StopHumanLoopResponse) => void): Request<AugmentedAIRuntime.Types.StopHumanLoopResponse, AWSError>;
  /**
   * Stops the specified human loop.
   */
  stopHumanLoop(callback?: (err: AWSError, data: AugmentedAIRuntime.Types.StopHumanLoopResponse) => void): Request<AugmentedAIRuntime.Types.StopHumanLoopResponse, AWSError>;
}
declare namespace AugmentedAIRuntime {
  export type ContentClassifier = "FreeOfPersonallyIdentifiableInformation"|"FreeOfAdultContent"|string;
  export type ContentClassifiers = ContentClassifier[];
  export interface DeleteHumanLoopRequest {
    /**
     * The name of the human loop that you want to delete.
     */
    HumanLoopName: HumanLoopName;
  }
  export interface DeleteHumanLoopResponse {
  }
  export interface DescribeHumanLoopRequest {
    /**
     * The name of the human loop that you want information about.
     */
    HumanLoopName: HumanLoopName;
  }
  export interface DescribeHumanLoopResponse {
    /**
     * The creation time when Amazon Augmented AI created the human loop.
     */
    CreationTime: Timestamp;
    /**
     * The reason why a human loop failed. The failure reason is returned when the status of the human loop is Failed.
     */
    FailureReason?: String;
    /**
     * A failure code that identifies the type of failure. Possible values: ValidationError, Expired, InternalError 
     */
    FailureCode?: String;
    /**
     * The status of the human loop. 
     */
    HumanLoopStatus: HumanLoopStatus;
    /**
     * The name of the human loop. The name must be lowercase, unique within the Region in your account, and can have up to 63 characters. Valid characters: a-z, 0-9, and - (hyphen).
     */
    HumanLoopName: HumanLoopName;
    /**
     * The Amazon Resource Name (ARN) of the human loop.
     */
    HumanLoopArn: HumanLoopArn;
    /**
     * The Amazon Resource Name (ARN) of the flow definition.
     */
    FlowDefinitionArn: FlowDefinitionArn;
    /**
     * An object that contains information about the output of the human loop.
     */
    HumanLoopOutput?: HumanLoopOutput;
  }
  export type FailureReason = string;
  export type FlowDefinitionArn = string;
  export type HumanLoopArn = string;
  export interface HumanLoopDataAttributes {
    /**
     * Declares that your content is free of personally identifiable information or adult content. Amazon SageMaker can restrict the Amazon Mechanical Turk workers who can view your task based on this information.
     */
    ContentClassifiers: ContentClassifiers;
  }
  export interface HumanLoopInput {
    /**
     * Serialized input from the human loop. The input must be a string representation of a file in JSON format.
     */
    InputContent: InputContent;
  }
  export type HumanLoopName = string;
  export interface HumanLoopOutput {
    /**
     * The location of the Amazon S3 object where Amazon Augmented AI stores your human loop output.
     */
    OutputS3Uri: String;
  }
  export type HumanLoopStatus = "InProgress"|"Failed"|"Completed"|"Stopped"|"Stopping"|string;
  export type HumanLoopSummaries = HumanLoopSummary[];
  export interface HumanLoopSummary {
    /**
     * The name of the human loop.
     */
    HumanLoopName?: HumanLoopName;
    /**
     * The status of the human loop. 
     */
    HumanLoopStatus?: HumanLoopStatus;
    /**
     * When Amazon Augmented AI created the human loop.
     */
    CreationTime?: Timestamp;
    /**
     * The reason why the human loop failed. A failure reason is returned when the status of the human loop is Failed.
     */
    FailureReason?: FailureReason;
    /**
     * The Amazon Resource Name (ARN) of the flow definition used to configure the human loop.
     */
    FlowDefinitionArn?: FlowDefinitionArn;
  }
  export type InputContent = string;
  export interface ListHumanLoopsRequest {
    /**
     * (Optional) The timestamp of the date when you want the human loops to begin in ISO 8601 format. For example, 2020-02-24.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * (Optional) The timestamp of the date before which you want the human loops to begin in ISO 8601 format. For example, 2020-02-24.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of a flow definition.
     */
    FlowDefinitionArn: FlowDefinitionArn;
    /**
     * Optional. The order for displaying results. Valid values: Ascending and Descending.
     */
    SortOrder?: SortOrder;
    /**
     * A token to display the next page of results.
     */
    NextToken?: NextToken;
    /**
     * The total number of items to return. If the total number of available items is more than the value specified in MaxResults, then a NextToken is returned in the output. You can use this token to display the next page of results. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListHumanLoopsResponse {
    /**
     * An array of objects that contain information about the human loops.
     */
    HumanLoopSummaries: HumanLoopSummaries;
    /**
     * A token to display the next page of results.
     */
    NextToken?: NextToken;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export type SortOrder = "Ascending"|"Descending"|string;
  export interface StartHumanLoopRequest {
    /**
     * The name of the human loop.
     */
    HumanLoopName: HumanLoopName;
    /**
     * The Amazon Resource Name (ARN) of the flow definition associated with this human loop.
     */
    FlowDefinitionArn: FlowDefinitionArn;
    /**
     * An object that contains information about the human loop.
     */
    HumanLoopInput: HumanLoopInput;
    /**
     * Attributes of the specified data. Use DataAttributes to specify if your data is free of personally identifiable information and/or free of adult content.
     */
    DataAttributes?: HumanLoopDataAttributes;
  }
  export interface StartHumanLoopResponse {
    /**
     * The Amazon Resource Name (ARN) of the human loop.
     */
    HumanLoopArn?: HumanLoopArn;
  }
  export interface StopHumanLoopRequest {
    /**
     * The name of the human loop that you want to stop.
     */
    HumanLoopName: HumanLoopName;
  }
  export interface StopHumanLoopResponse {
  }
  export type String = string;
  export type Timestamp = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-11-07"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AugmentedAIRuntime client.
   */
  export import Types = AugmentedAIRuntime;
}
export = AugmentedAIRuntime;
