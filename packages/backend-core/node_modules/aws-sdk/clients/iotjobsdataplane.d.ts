import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IoTJobsDataPlane extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IoTJobsDataPlane.Types.ClientConfiguration)
  config: Config & IoTJobsDataPlane.Types.ClientConfiguration;
  /**
   * Gets details of a job execution.
   */
  describeJobExecution(params: IoTJobsDataPlane.Types.DescribeJobExecutionRequest, callback?: (err: AWSError, data: IoTJobsDataPlane.Types.DescribeJobExecutionResponse) => void): Request<IoTJobsDataPlane.Types.DescribeJobExecutionResponse, AWSError>;
  /**
   * Gets details of a job execution.
   */
  describeJobExecution(callback?: (err: AWSError, data: IoTJobsDataPlane.Types.DescribeJobExecutionResponse) => void): Request<IoTJobsDataPlane.Types.DescribeJobExecutionResponse, AWSError>;
  /**
   * Gets the list of all jobs for a thing that are not in a terminal status.
   */
  getPendingJobExecutions(params: IoTJobsDataPlane.Types.GetPendingJobExecutionsRequest, callback?: (err: AWSError, data: IoTJobsDataPlane.Types.GetPendingJobExecutionsResponse) => void): Request<IoTJobsDataPlane.Types.GetPendingJobExecutionsResponse, AWSError>;
  /**
   * Gets the list of all jobs for a thing that are not in a terminal status.
   */
  getPendingJobExecutions(callback?: (err: AWSError, data: IoTJobsDataPlane.Types.GetPendingJobExecutionsResponse) => void): Request<IoTJobsDataPlane.Types.GetPendingJobExecutionsResponse, AWSError>;
  /**
   * Gets and starts the next pending (status IN_PROGRESS or QUEUED) job execution for a thing.
   */
  startNextPendingJobExecution(params: IoTJobsDataPlane.Types.StartNextPendingJobExecutionRequest, callback?: (err: AWSError, data: IoTJobsDataPlane.Types.StartNextPendingJobExecutionResponse) => void): Request<IoTJobsDataPlane.Types.StartNextPendingJobExecutionResponse, AWSError>;
  /**
   * Gets and starts the next pending (status IN_PROGRESS or QUEUED) job execution for a thing.
   */
  startNextPendingJobExecution(callback?: (err: AWSError, data: IoTJobsDataPlane.Types.StartNextPendingJobExecutionResponse) => void): Request<IoTJobsDataPlane.Types.StartNextPendingJobExecutionResponse, AWSError>;
  /**
   * Updates the status of a job execution.
   */
  updateJobExecution(params: IoTJobsDataPlane.Types.UpdateJobExecutionRequest, callback?: (err: AWSError, data: IoTJobsDataPlane.Types.UpdateJobExecutionResponse) => void): Request<IoTJobsDataPlane.Types.UpdateJobExecutionResponse, AWSError>;
  /**
   * Updates the status of a job execution.
   */
  updateJobExecution(callback?: (err: AWSError, data: IoTJobsDataPlane.Types.UpdateJobExecutionResponse) => void): Request<IoTJobsDataPlane.Types.UpdateJobExecutionResponse, AWSError>;
}
declare namespace IoTJobsDataPlane {
  export type ApproximateSecondsBeforeTimedOut = number;
  export type DescribeJobExecutionJobId = string;
  export interface DescribeJobExecutionRequest {
    /**
     * The unique identifier assigned to this job when it was created.
     */
    jobId: DescribeJobExecutionJobId;
    /**
     * The thing name associated with the device the job execution is running on.
     */
    thingName: ThingName;
    /**
     * Optional. When set to true, the response contains the job document. The default is false.
     */
    includeJobDocument?: IncludeJobDocument;
    /**
     * Optional. A number that identifies a particular job execution on a particular device. If not specified, the latest job execution is returned.
     */
    executionNumber?: ExecutionNumber;
  }
  export interface DescribeJobExecutionResponse {
    /**
     * Contains data about a job execution.
     */
    execution?: JobExecution;
  }
  export type DetailsKey = string;
  export type DetailsMap = {[key: string]: DetailsValue};
  export type DetailsValue = string;
  export type ExecutionNumber = number;
  export type ExpectedVersion = number;
  export interface GetPendingJobExecutionsRequest {
    /**
     * The name of the thing that is executing the job.
     */
    thingName: ThingName;
  }
  export interface GetPendingJobExecutionsResponse {
    /**
     * A list of JobExecutionSummary objects with status IN_PROGRESS.
     */
    inProgressJobs?: JobExecutionSummaryList;
    /**
     * A list of JobExecutionSummary objects with status QUEUED.
     */
    queuedJobs?: JobExecutionSummaryList;
  }
  export type IncludeExecutionState = boolean;
  export type IncludeJobDocument = boolean;
  export type JobDocument = string;
  export interface JobExecution {
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId?: JobId;
    /**
     * The name of the thing that is executing the job.
     */
    thingName?: ThingName;
    /**
     * The status of the job execution. Can be one of: "QUEUED", "IN_PROGRESS", "FAILED", "SUCCESS", "CANCELED", "REJECTED", or "REMOVED".
     */
    status?: JobExecutionStatus;
    /**
     * A collection of name/value pairs that describe the status of the job execution.
     */
    statusDetails?: DetailsMap;
    /**
     * The time, in milliseconds since the epoch, when the job execution was enqueued.
     */
    queuedAt?: QueuedAt;
    /**
     * The time, in milliseconds since the epoch, when the job execution was started.
     */
    startedAt?: StartedAt;
    /**
     * The time, in milliseconds since the epoch, when the job execution was last updated. 
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The estimated number of seconds that remain before the job execution status will be changed to TIMED_OUT.
     */
    approximateSecondsBeforeTimedOut?: ApproximateSecondsBeforeTimedOut;
    /**
     * The version of the job execution. Job execution versions are incremented each time they are updated by a device.
     */
    versionNumber?: VersionNumber;
    /**
     * A number that identifies a particular job execution on a particular device. It can be used later in commands that return or update job execution information.
     */
    executionNumber?: ExecutionNumber;
    /**
     * The content of the job document.
     */
    jobDocument?: JobDocument;
  }
  export interface JobExecutionState {
    /**
     * The status of the job execution. Can be one of: "QUEUED", "IN_PROGRESS", "FAILED", "SUCCESS", "CANCELED", "REJECTED", or "REMOVED".
     */
    status?: JobExecutionStatus;
    /**
     * A collection of name/value pairs that describe the status of the job execution.
     */
    statusDetails?: DetailsMap;
    /**
     * The version of the job execution. Job execution versions are incremented each time they are updated by a device.
     */
    versionNumber?: VersionNumber;
  }
  export type JobExecutionStatus = "QUEUED"|"IN_PROGRESS"|"SUCCEEDED"|"FAILED"|"TIMED_OUT"|"REJECTED"|"REMOVED"|"CANCELED"|string;
  export interface JobExecutionSummary {
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId?: JobId;
    /**
     * The time, in milliseconds since the epoch, when the job execution was enqueued.
     */
    queuedAt?: QueuedAt;
    /**
     * The time, in milliseconds since the epoch, when the job execution started.
     */
    startedAt?: StartedAt;
    /**
     * The time, in milliseconds since the epoch, when the job execution was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The version of the job execution. Job execution versions are incremented each time AWS IoT Jobs receives an update from a device.
     */
    versionNumber?: VersionNumber;
    /**
     * A number that identifies a particular job execution on a particular device.
     */
    executionNumber?: ExecutionNumber;
  }
  export type JobExecutionSummaryList = JobExecutionSummary[];
  export type JobId = string;
  export type LastUpdatedAt = number;
  export type QueuedAt = number;
  export interface StartNextPendingJobExecutionRequest {
    /**
     * The name of the thing associated with the device.
     */
    thingName: ThingName;
    /**
     * A collection of name/value pairs that describe the status of the job execution. If not specified, the statusDetails are unchanged.
     */
    statusDetails?: DetailsMap;
    /**
     * Specifies the amount of time this device has to finish execution of this job. If the job execution status is not set to a terminal state before this timer expires, or before the timer is reset (by calling UpdateJobExecution, setting the status to IN_PROGRESS and specifying a new timeout value in field stepTimeoutInMinutes) the job execution status will be automatically set to TIMED_OUT. Note that setting this timeout has no effect on that job execution timeout which may have been specified when the job was created (CreateJob using field timeoutConfig).
     */
    stepTimeoutInMinutes?: StepTimeoutInMinutes;
  }
  export interface StartNextPendingJobExecutionResponse {
    /**
     * A JobExecution object.
     */
    execution?: JobExecution;
  }
  export type StartedAt = number;
  export type StepTimeoutInMinutes = number;
  export type ThingName = string;
  export interface UpdateJobExecutionRequest {
    /**
     * The unique identifier assigned to this job when it was created.
     */
    jobId: JobId;
    /**
     * The name of the thing associated with the device.
     */
    thingName: ThingName;
    /**
     * The new status for the job execution (IN_PROGRESS, FAILED, SUCCESS, or REJECTED). This must be specified on every update.
     */
    status: JobExecutionStatus;
    /**
     *  Optional. A collection of name/value pairs that describe the status of the job execution. If not specified, the statusDetails are unchanged.
     */
    statusDetails?: DetailsMap;
    /**
     * Specifies the amount of time this device has to finish execution of this job. If the job execution status is not set to a terminal state before this timer expires, or before the timer is reset (by again calling UpdateJobExecution, setting the status to IN_PROGRESS and specifying a new timeout value in this field) the job execution status will be automatically set to TIMED_OUT. Note that setting or resetting this timeout has no effect on that job execution timeout which may have been specified when the job was created (CreateJob using field timeoutConfig).
     */
    stepTimeoutInMinutes?: StepTimeoutInMinutes;
    /**
     * Optional. The expected current version of the job execution. Each time you update the job execution, its version is incremented. If the version of the job execution stored in Jobs does not match, the update is rejected with a VersionMismatch error, and an ErrorResponse that contains the current job execution status data is returned. (This makes it unnecessary to perform a separate DescribeJobExecution request in order to obtain the job execution status data.)
     */
    expectedVersion?: ExpectedVersion;
    /**
     * Optional. When included and set to true, the response contains the JobExecutionState data. The default is false.
     */
    includeJobExecutionState?: IncludeExecutionState;
    /**
     * Optional. When set to true, the response contains the job document. The default is false.
     */
    includeJobDocument?: IncludeJobDocument;
    /**
     * Optional. A number that identifies a particular job execution on a particular device.
     */
    executionNumber?: ExecutionNumber;
  }
  export interface UpdateJobExecutionResponse {
    /**
     * A JobExecutionState object.
     */
    executionState?: JobExecutionState;
    /**
     * The contents of the Job Documents.
     */
    jobDocument?: JobDocument;
  }
  export type VersionNumber = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-09-29"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IoTJobsDataPlane client.
   */
  export import Types = IoTJobsDataPlane;
}
export = IoTJobsDataPlane;
