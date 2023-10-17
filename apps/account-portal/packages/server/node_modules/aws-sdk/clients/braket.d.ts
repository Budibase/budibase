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
   * Cancels an Amazon Braket job.
   */
  cancelJob(params: Braket.Types.CancelJobRequest, callback?: (err: AWSError, data: Braket.Types.CancelJobResponse) => void): Request<Braket.Types.CancelJobResponse, AWSError>;
  /**
   * Cancels an Amazon Braket job.
   */
  cancelJob(callback?: (err: AWSError, data: Braket.Types.CancelJobResponse) => void): Request<Braket.Types.CancelJobResponse, AWSError>;
  /**
   * Cancels the specified task.
   */
  cancelQuantumTask(params: Braket.Types.CancelQuantumTaskRequest, callback?: (err: AWSError, data: Braket.Types.CancelQuantumTaskResponse) => void): Request<Braket.Types.CancelQuantumTaskResponse, AWSError>;
  /**
   * Cancels the specified task.
   */
  cancelQuantumTask(callback?: (err: AWSError, data: Braket.Types.CancelQuantumTaskResponse) => void): Request<Braket.Types.CancelQuantumTaskResponse, AWSError>;
  /**
   * Creates an Amazon Braket job.
   */
  createJob(params: Braket.Types.CreateJobRequest, callback?: (err: AWSError, data: Braket.Types.CreateJobResponse) => void): Request<Braket.Types.CreateJobResponse, AWSError>;
  /**
   * Creates an Amazon Braket job.
   */
  createJob(callback?: (err: AWSError, data: Braket.Types.CreateJobResponse) => void): Request<Braket.Types.CreateJobResponse, AWSError>;
  /**
   * Creates a quantum task.
   */
  createQuantumTask(params: Braket.Types.CreateQuantumTaskRequest, callback?: (err: AWSError, data: Braket.Types.CreateQuantumTaskResponse) => void): Request<Braket.Types.CreateQuantumTaskResponse, AWSError>;
  /**
   * Creates a quantum task.
   */
  createQuantumTask(callback?: (err: AWSError, data: Braket.Types.CreateQuantumTaskResponse) => void): Request<Braket.Types.CreateQuantumTaskResponse, AWSError>;
  /**
   * Retrieves the devices available in Amazon Braket.  For backwards compatibility with older versions of BraketSchemas, OpenQASM information is omitted from GetDevice API calls. To get this information the user-agent needs to present a recent version of the BraketSchemas (1.8.0 or later). The Braket SDK automatically reports this for you. If you do not see OpenQASM results in the GetDevice response when using a Braket SDK, you may need to set AWS_EXECUTION_ENV environment variable to configure user-agent. See the code examples provided below for how to do this for the AWS CLI, Boto3, and the Go, Java, and JavaScript/TypeScript SDKs. 
   */
  getDevice(params: Braket.Types.GetDeviceRequest, callback?: (err: AWSError, data: Braket.Types.GetDeviceResponse) => void): Request<Braket.Types.GetDeviceResponse, AWSError>;
  /**
   * Retrieves the devices available in Amazon Braket.  For backwards compatibility with older versions of BraketSchemas, OpenQASM information is omitted from GetDevice API calls. To get this information the user-agent needs to present a recent version of the BraketSchemas (1.8.0 or later). The Braket SDK automatically reports this for you. If you do not see OpenQASM results in the GetDevice response when using a Braket SDK, you may need to set AWS_EXECUTION_ENV environment variable to configure user-agent. See the code examples provided below for how to do this for the AWS CLI, Boto3, and the Go, Java, and JavaScript/TypeScript SDKs. 
   */
  getDevice(callback?: (err: AWSError, data: Braket.Types.GetDeviceResponse) => void): Request<Braket.Types.GetDeviceResponse, AWSError>;
  /**
   * Retrieves the specified Amazon Braket job.
   */
  getJob(params: Braket.Types.GetJobRequest, callback?: (err: AWSError, data: Braket.Types.GetJobResponse) => void): Request<Braket.Types.GetJobResponse, AWSError>;
  /**
   * Retrieves the specified Amazon Braket job.
   */
  getJob(callback?: (err: AWSError, data: Braket.Types.GetJobResponse) => void): Request<Braket.Types.GetJobResponse, AWSError>;
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
   * Searches for Amazon Braket jobs that match the specified filter values.
   */
  searchJobs(params: Braket.Types.SearchJobsRequest, callback?: (err: AWSError, data: Braket.Types.SearchJobsResponse) => void): Request<Braket.Types.SearchJobsResponse, AWSError>;
  /**
   * Searches for Amazon Braket jobs that match the specified filter values.
   */
  searchJobs(callback?: (err: AWSError, data: Braket.Types.SearchJobsResponse) => void): Request<Braket.Types.SearchJobsResponse, AWSError>;
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
  export interface AlgorithmSpecification {
    /**
     * The container image used to create an Amazon Braket job.
     */
    containerImage?: ContainerImage;
    /**
     * Configures the paths to the Python scripts used for entry and training.
     */
    scriptModeConfig?: ScriptModeConfig;
  }
  export interface CancelJobRequest {
    /**
     * The ARN of the Amazon Braket job to cancel.
     */
    jobArn: JobArn;
  }
  export interface CancelJobResponse {
    /**
     * The status of the job cancellation request.
     */
    cancellationStatus: CancellationStatus;
    /**
     * The ARN of the Amazon Braket job.
     */
    jobArn: JobArn;
  }
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
  export type CompressionType = "NONE"|"GZIP"|string;
  export interface ContainerImage {
    /**
     * The URI locating the container image.
     */
    uri: Uri;
  }
  export interface CreateJobRequest {
    /**
     * Definition of the Amazon Braket job to be created. Specifies the container image the job uses and information about the Python scripts used for entry and training.
     */
    algorithmSpecification: AlgorithmSpecification;
    /**
     * Information about the output locations for job checkpoint data.
     */
    checkpointConfig?: JobCheckpointConfig;
    /**
     * A unique token that guarantees that the call to this API is idempotent.
     */
    clientToken: String64;
    /**
     * The quantum processing unit (QPU) or simulator used to create an Amazon Braket job.
     */
    deviceConfig: DeviceConfig;
    /**
     * Algorithm-specific parameters used by an Amazon Braket job that influence the quality of the training job. The values are set with a string of JSON key:value pairs, where the key is the name of the hyperparameter and the value is the value of th hyperparameter.
     */
    hyperParameters?: HyperParameters;
    /**
     * A list of parameters that specify the name and type of input data and where it is located.
     */
    inputDataConfig?: CreateJobRequestInputDataConfigList;
    /**
     * Configuration of the resource instances to use while running the hybrid job on Amazon Braket.
     */
    instanceConfig: InstanceConfig;
    /**
     * The name of the Amazon Braket job.
     */
    jobName: CreateJobRequestJobNameString;
    /**
     * The path to the S3 location where you want to store job artifacts and the encryption key used to store them.
     */
    outputDataConfig: JobOutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon Braket can assume to perform tasks on behalf of a user. It can access user resources, run an Amazon Braket job container on behalf of user, and output resources to the users' s3 buckets.
     */
    roleArn: RoleArn;
    /**
     *  The user-defined criteria that specifies when a job stops running.
     */
    stoppingCondition?: JobStoppingCondition;
    /**
     * A tag object that consists of a key and an optional value, used to manage metadata for Amazon Braket resources.
     */
    tags?: TagsMap;
  }
  export type CreateJobRequestInputDataConfigList = InputFileConfig[];
  export type CreateJobRequestJobNameString = string;
  export interface CreateJobResponse {
    /**
     * The ARN of the Amazon Braket job created.
     */
    jobArn: JobArn;
  }
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
     * The token for an Amazon Braket job that associates it with the quantum task.
     */
    jobToken?: JobToken;
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
  export interface DataSource {
    /**
     * Information about the data stored in Amazon S3 used by the Amazon Braket job.
     */
    s3DataSource: S3DataSource;
  }
  export type DeviceArn = string;
  export interface DeviceConfig {
    /**
     * The primary quantum processing unit (QPU) or simulator used to create and run an Amazon Braket job.
     */
    device: String256;
  }
  export interface DeviceQueueInfo {
    /**
     * The name of the queue. 
     */
    queue: QueueName;
    /**
     * Optional. Specifies the priority of the queue. Tasks in a priority queue are processed before the tasks in a normal queue.
     */
    queuePriority?: QueuePriority;
    /**
     * The number of jobs or tasks in the queue for a given device. 
     */
    queueSize: String;
  }
  export type DeviceQueueInfoList = DeviceQueueInfo[];
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
     * List of information about tasks and jobs queued on a device.
     */
    deviceQueueInfo?: DeviceQueueInfoList;
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
  export interface GetJobRequest {
    /**
     * A list of attributes to return information for.
     */
    additionalAttributeNames?: HybridJobAdditionalAttributeNamesList;
    /**
     * The ARN of the job to retrieve.
     */
    jobArn: JobArn;
  }
  export interface GetJobResponse {
    /**
     * Definition of the Amazon Braket job created. Specifies the container image the job uses, information about the Python scripts used for entry and training, and the user-defined metrics used to evaluation the job.
     */
    algorithmSpecification: AlgorithmSpecification;
    /**
     * The billable time the Amazon Braket job used to complete.
     */
    billableDuration?: Integer;
    /**
     * Information about the output locations for job checkpoint data.
     */
    checkpointConfig?: JobCheckpointConfig;
    /**
     * The date and time that the Amazon Braket job was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The quantum processing unit (QPU) or simulator used to run the Amazon Braket job.
     */
    deviceConfig?: DeviceConfig;
    /**
     * The date and time that the Amazon Braket job ended.
     */
    endedAt?: SyntheticTimestamp_date_time;
    /**
     * Details about the type and time events occurred related to the Amazon Braket job.
     */
    events?: JobEvents;
    /**
     * A description of the reason why an Amazon Braket job failed, if it failed.
     */
    failureReason?: String1024;
    /**
     * Algorithm-specific parameters used by an Amazon Braket job that influence the quality of the traiing job. The values are set with a string of JSON key:value pairs, where the key is the name of the hyperparameter and the value is the value of th hyperparameter.
     */
    hyperParameters?: HyperParameters;
    /**
     * A list of parameters that specify the name and type of input data and where it is located.
     */
    inputDataConfig?: InputConfigList;
    /**
     * The resource instances to use while running the hybrid job on Amazon Braket.
     */
    instanceConfig: InstanceConfig;
    /**
     * The ARN of the Amazon Braket job.
     */
    jobArn: JobArn;
    /**
     * The name of the Amazon Braket job.
     */
    jobName: GetJobResponseJobNameString;
    /**
     * The path to the S3 location where job artifacts are stored and the encryption key used to store them there.
     */
    outputDataConfig: JobOutputDataConfig;
    /**
     * Queue information for the requested job. Only returned if QueueInfo is specified in the additionalAttributeNames" field in the GetJob API request.
     */
    queueInfo?: HybridJobQueueInfo;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon Braket can assume to perform tasks on behalf of a user. It can access user resources, run an Amazon Braket job container on behalf of user, and output resources to the s3 buckets of a user.
     */
    roleArn: RoleArn;
    /**
     * The date and time that the Amazon Braket job was started.
     */
    startedAt?: SyntheticTimestamp_date_time;
    /**
     * The status of the Amazon Braket job.
     */
    status: JobPrimaryStatus;
    /**
     * The user-defined criteria that specifies when to stop a job running.
     */
    stoppingCondition?: JobStoppingCondition;
    /**
     * A tag object that consists of a key and an optional value, used to manage metadata for Amazon Braket resources.
     */
    tags?: TagsMap;
  }
  export type GetJobResponseJobNameString = string;
  export interface GetQuantumTaskRequest {
    /**
     * A list of attributes to return information for.
     */
    additionalAttributeNames?: QuantumTaskAdditionalAttributeNamesList;
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
     * The ARN of the Amazon Braket job associated with the quantum task.
     */
    jobArn?: JobArn;
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
     * Queue information for the requested quantum task. Only returned if QueueInfo is specified in the additionalAttributeNames" field in the GetQuantumTask API request.
     */
    queueInfo?: QuantumTaskQueueInfo;
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
  export type HybridJobAdditionalAttributeName = "QueueInfo"|string;
  export type HybridJobAdditionalAttributeNamesList = HybridJobAdditionalAttributeName[];
  export interface HybridJobQueueInfo {
    /**
     * Optional. Provides more information about the queue position. For example, if the job is complete and no longer in the queue, the message field contains that information.
     */
    message?: String;
    /**
     * Current position of the job in the jobs queue.
     */
    position: String;
    /**
     * The name of the queue.
     */
    queue: QueueName;
  }
  export type HyperParameters = {[key: string]: HyperParametersValueString};
  export type HyperParametersValueString = string;
  export type InputConfigList = InputFileConfig[];
  export interface InputFileConfig {
    /**
     * A named input source that an Amazon Braket job can consume.
     */
    channelName: InputFileConfigChannelNameString;
    /**
     * The MIME type of the data.
     */
    contentType?: String256;
    /**
     * The location of the channel data.
     */
    dataSource: DataSource;
  }
  export type InputFileConfigChannelNameString = string;
  export interface InstanceConfig {
    /**
     * Configures the number of resource instances to use while running an Amazon Braket job on Amazon Braket. The default value is 1.
     */
    instanceCount?: InstanceConfigInstanceCountInteger;
    /**
     * Configures the type resource instances to use while running an Amazon Braket hybrid job.
     */
    instanceType: InstanceType;
    /**
     * The size of the storage volume, in GB, that user wants to provision.
     */
    volumeSizeInGb: InstanceConfigVolumeSizeInGbInteger;
  }
  export type InstanceConfigInstanceCountInteger = number;
  export type InstanceConfigVolumeSizeInGbInteger = number;
  export type InstanceType = "ml.m4.xlarge"|"ml.m4.2xlarge"|"ml.m4.4xlarge"|"ml.m4.10xlarge"|"ml.m4.16xlarge"|"ml.g4dn.xlarge"|"ml.g4dn.2xlarge"|"ml.g4dn.4xlarge"|"ml.g4dn.8xlarge"|"ml.g4dn.12xlarge"|"ml.g4dn.16xlarge"|"ml.m5.large"|"ml.m5.xlarge"|"ml.m5.2xlarge"|"ml.m5.4xlarge"|"ml.m5.12xlarge"|"ml.m5.24xlarge"|"ml.c4.xlarge"|"ml.c4.2xlarge"|"ml.c4.4xlarge"|"ml.c4.8xlarge"|"ml.p2.xlarge"|"ml.p2.8xlarge"|"ml.p2.16xlarge"|"ml.p3.2xlarge"|"ml.p3.8xlarge"|"ml.p3.16xlarge"|"ml.p3dn.24xlarge"|"ml.p4d.24xlarge"|"ml.c5.xlarge"|"ml.c5.2xlarge"|"ml.c5.4xlarge"|"ml.c5.9xlarge"|"ml.c5.18xlarge"|"ml.c5n.xlarge"|"ml.c5n.2xlarge"|"ml.c5n.4xlarge"|"ml.c5n.9xlarge"|"ml.c5n.18xlarge"|string;
  export type Integer = number;
  export type JobArn = string;
  export interface JobCheckpointConfig {
    /**
     * (Optional) The local directory where checkpoints are written. The default directory is /opt/braket/checkpoints/.
     */
    localPath?: String4096;
    /**
     * Identifies the S3 path where you want Amazon Braket to store checkpoints. For example, s3://bucket-name/key-name-prefix.
     */
    s3Uri: S3Path;
  }
  export interface JobEventDetails {
    /**
     * The type of event that occurred related to the Amazon Braket job.
     */
    eventType?: JobEventType;
    /**
     * A message describing the event that occurred related to the Amazon Braket job.
     */
    message?: JobEventDetailsMessageString;
    /**
     * TThe type of event that occurred related to the Amazon Braket job.
     */
    timeOfEvent?: SyntheticTimestamp_date_time;
  }
  export type JobEventDetailsMessageString = string;
  export type JobEventType = "WAITING_FOR_PRIORITY"|"QUEUED_FOR_EXECUTION"|"STARTING_INSTANCE"|"DOWNLOADING_DATA"|"RUNNING"|"DEPRIORITIZED_DUE_TO_INACTIVITY"|"UPLOADING_RESULTS"|"COMPLETED"|"FAILED"|"MAX_RUNTIME_EXCEEDED"|"CANCELLED"|string;
  export type JobEvents = JobEventDetails[];
  export interface JobOutputDataConfig {
    /**
     * The AWS Key Management Service (AWS KMS) key that Amazon Braket uses to encrypt the job training artifacts at rest using Amazon S3 server-side encryption.
     */
    kmsKeyId?: String2048;
    /**
     * Identifies the S3 path where you want Amazon Braket to store the job training artifacts. For example, s3://bucket-name/key-name-prefix.
     */
    s3Path: S3Path;
  }
  export type JobPrimaryStatus = "QUEUED"|"RUNNING"|"COMPLETED"|"FAILED"|"CANCELLING"|"CANCELLED"|string;
  export interface JobStoppingCondition {
    /**
     * The maximum length of time, in seconds, that an Amazon Braket job can run.
     */
    maxRuntimeInSeconds?: JobStoppingConditionMaxRuntimeInSecondsInteger;
  }
  export type JobStoppingConditionMaxRuntimeInSecondsInteger = number;
  export interface JobSummary {
    /**
     * The date and time that the Amazon Braket job was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * Provides summary information about the primary device used by an Amazon Braket job.
     */
    device: String256;
    /**
     * The date and time that the Amazon Braket job ended.
     */
    endedAt?: SyntheticTimestamp_date_time;
    /**
     * The ARN of the Amazon Braket job.
     */
    jobArn: JobArn;
    /**
     * The name of the Amazon Braket job.
     */
    jobName: String;
    /**
     * The date and time that the Amazon Braket job was started.
     */
    startedAt?: SyntheticTimestamp_date_time;
    /**
     * The status of the Amazon Braket job.
     */
    status: JobPrimaryStatus;
    /**
     * A tag object that consists of a key and an optional value, used to manage metadata for Amazon Braket resources.
     */
    tags?: TagsMap;
  }
  export type JobSummaryList = JobSummary[];
  export type JobToken = string;
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
  export type QuantumTaskAdditionalAttributeName = "QueueInfo"|string;
  export type QuantumTaskAdditionalAttributeNamesList = QuantumTaskAdditionalAttributeName[];
  export type QuantumTaskArn = string;
  export interface QuantumTaskQueueInfo {
    /**
     * Optional. Provides more information about the queue position. For example, if the task is complete and no longer in the queue, the message field contains that information.
     */
    message?: String;
    /**
     * Current position of the task in the quantum tasks queue.
     */
    position: String;
    /**
     * The name of the queue. 
     */
    queue: QueueName;
    /**
     * Optional. Specifies the priority of the queue. Quantum tasks in a priority queue are processed before the tasks in a normal queue.
     */
    queuePriority?: QueuePriority;
  }
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
  export type QueueName = "QUANTUM_TASKS_QUEUE"|"JOBS_QUEUE"|string;
  export type QueuePriority = "Normal"|"Priority"|string;
  export type RoleArn = string;
  export interface S3DataSource {
    /**
     * Depending on the value specified for the S3DataType, identifies either a key name prefix or a manifest that locates the S3 data source.
     */
    s3Uri: S3Path;
  }
  export type S3Path = string;
  export interface ScriptModeConfig {
    /**
     * The type of compression used by the Python scripts for an Amazon Braket job.
     */
    compressionType?: CompressionType;
    /**
     * The path to the Python script that serves as the entry point for an Amazon Braket job.
     */
    entryPoint: String;
    /**
     * The URI that specifies the S3 path to the Python script module that contains the training script used by an Amazon Braket job.
     */
    s3Uri: S3Path;
  }
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
  export interface SearchJobsFilter {
    /**
     * The name to use for the jobs filter.
     */
    name: String64;
    /**
     * An operator to use for the jobs filter.
     */
    operator: SearchJobsFilterOperator;
    /**
     * The values to use for the jobs filter.
     */
    values: SearchJobsFilterValuesList;
  }
  export type SearchJobsFilterOperator = "LT"|"LTE"|"EQUAL"|"GT"|"GTE"|"BETWEEN"|"CONTAINS"|string;
  export type SearchJobsFilterValuesList = String256[];
  export interface SearchJobsRequest {
    /**
     * The filter values to use when searching for a job.
     */
    filters: SearchJobsRequestFiltersList;
    /**
     * The maximum number of results to return in the response.
     */
    maxResults?: SearchJobsRequestMaxResultsInteger;
    /**
     * A token used for pagination of results returned in the response. Use the token returned from the previous request to continue results where the previous request ended.
     */
    nextToken?: String;
  }
  export type SearchJobsRequestFiltersList = SearchJobsFilter[];
  export type SearchJobsRequestMaxResultsInteger = number;
  export interface SearchJobsResponse {
    /**
     * An array of JobSummary objects for devices that match the specified filter values.
     */
    jobs: JobSummaryList;
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
  export type String1024 = string;
  export type String2048 = string;
  export type String256 = string;
  export type String4096 = string;
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
  export type Uri = string;
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
