import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class EMRServerless extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: EMRServerless.Types.ClientConfiguration)
  config: Config & EMRServerless.Types.ClientConfiguration;
  /**
   * Cancels a job run.
   */
  cancelJobRun(params: EMRServerless.Types.CancelJobRunRequest, callback?: (err: AWSError, data: EMRServerless.Types.CancelJobRunResponse) => void): Request<EMRServerless.Types.CancelJobRunResponse, AWSError>;
  /**
   * Cancels a job run.
   */
  cancelJobRun(callback?: (err: AWSError, data: EMRServerless.Types.CancelJobRunResponse) => void): Request<EMRServerless.Types.CancelJobRunResponse, AWSError>;
  /**
   * Creates an application.
   */
  createApplication(params: EMRServerless.Types.CreateApplicationRequest, callback?: (err: AWSError, data: EMRServerless.Types.CreateApplicationResponse) => void): Request<EMRServerless.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates an application.
   */
  createApplication(callback?: (err: AWSError, data: EMRServerless.Types.CreateApplicationResponse) => void): Request<EMRServerless.Types.CreateApplicationResponse, AWSError>;
  /**
   * Deletes an application. An application has to be in a stopped or created state in order to be deleted.
   */
  deleteApplication(params: EMRServerless.Types.DeleteApplicationRequest, callback?: (err: AWSError, data: EMRServerless.Types.DeleteApplicationResponse) => void): Request<EMRServerless.Types.DeleteApplicationResponse, AWSError>;
  /**
   * Deletes an application. An application has to be in a stopped or created state in order to be deleted.
   */
  deleteApplication(callback?: (err: AWSError, data: EMRServerless.Types.DeleteApplicationResponse) => void): Request<EMRServerless.Types.DeleteApplicationResponse, AWSError>;
  /**
   * Displays detailed information about a specified application.
   */
  getApplication(params: EMRServerless.Types.GetApplicationRequest, callback?: (err: AWSError, data: EMRServerless.Types.GetApplicationResponse) => void): Request<EMRServerless.Types.GetApplicationResponse, AWSError>;
  /**
   * Displays detailed information about a specified application.
   */
  getApplication(callback?: (err: AWSError, data: EMRServerless.Types.GetApplicationResponse) => void): Request<EMRServerless.Types.GetApplicationResponse, AWSError>;
  /**
   * Creates and returns a URL that you can use to access the application UIs for a job run. For jobs in a running state, the application UI is a live user interface such as the Spark or Tez web UI. For completed jobs, the application UI is a persistent application user interface such as the Spark History Server or persistent Tez UI.  The URL is valid for one hour after you generate it. To access the application UI after that hour elapses, you must invoke the API again to generate a new URL. 
   */
  getDashboardForJobRun(params: EMRServerless.Types.GetDashboardForJobRunRequest, callback?: (err: AWSError, data: EMRServerless.Types.GetDashboardForJobRunResponse) => void): Request<EMRServerless.Types.GetDashboardForJobRunResponse, AWSError>;
  /**
   * Creates and returns a URL that you can use to access the application UIs for a job run. For jobs in a running state, the application UI is a live user interface such as the Spark or Tez web UI. For completed jobs, the application UI is a persistent application user interface such as the Spark History Server or persistent Tez UI.  The URL is valid for one hour after you generate it. To access the application UI after that hour elapses, you must invoke the API again to generate a new URL. 
   */
  getDashboardForJobRun(callback?: (err: AWSError, data: EMRServerless.Types.GetDashboardForJobRunResponse) => void): Request<EMRServerless.Types.GetDashboardForJobRunResponse, AWSError>;
  /**
   * Displays detailed information about a job run.
   */
  getJobRun(params: EMRServerless.Types.GetJobRunRequest, callback?: (err: AWSError, data: EMRServerless.Types.GetJobRunResponse) => void): Request<EMRServerless.Types.GetJobRunResponse, AWSError>;
  /**
   * Displays detailed information about a job run.
   */
  getJobRun(callback?: (err: AWSError, data: EMRServerless.Types.GetJobRunResponse) => void): Request<EMRServerless.Types.GetJobRunResponse, AWSError>;
  /**
   * Lists applications based on a set of parameters.
   */
  listApplications(params: EMRServerless.Types.ListApplicationsRequest, callback?: (err: AWSError, data: EMRServerless.Types.ListApplicationsResponse) => void): Request<EMRServerless.Types.ListApplicationsResponse, AWSError>;
  /**
   * Lists applications based on a set of parameters.
   */
  listApplications(callback?: (err: AWSError, data: EMRServerless.Types.ListApplicationsResponse) => void): Request<EMRServerless.Types.ListApplicationsResponse, AWSError>;
  /**
   * Lists job runs based on a set of parameters.
   */
  listJobRuns(params: EMRServerless.Types.ListJobRunsRequest, callback?: (err: AWSError, data: EMRServerless.Types.ListJobRunsResponse) => void): Request<EMRServerless.Types.ListJobRunsResponse, AWSError>;
  /**
   * Lists job runs based on a set of parameters.
   */
  listJobRuns(callback?: (err: AWSError, data: EMRServerless.Types.ListJobRunsResponse) => void): Request<EMRServerless.Types.ListJobRunsResponse, AWSError>;
  /**
   * Lists the tags assigned to the resources.
   */
  listTagsForResource(params: EMRServerless.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: EMRServerless.Types.ListTagsForResourceResponse) => void): Request<EMRServerless.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags assigned to the resources.
   */
  listTagsForResource(callback?: (err: AWSError, data: EMRServerless.Types.ListTagsForResourceResponse) => void): Request<EMRServerless.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Starts a specified application and initializes initial capacity if configured.
   */
  startApplication(params: EMRServerless.Types.StartApplicationRequest, callback?: (err: AWSError, data: EMRServerless.Types.StartApplicationResponse) => void): Request<EMRServerless.Types.StartApplicationResponse, AWSError>;
  /**
   * Starts a specified application and initializes initial capacity if configured.
   */
  startApplication(callback?: (err: AWSError, data: EMRServerless.Types.StartApplicationResponse) => void): Request<EMRServerless.Types.StartApplicationResponse, AWSError>;
  /**
   * Starts a job run.
   */
  startJobRun(params: EMRServerless.Types.StartJobRunRequest, callback?: (err: AWSError, data: EMRServerless.Types.StartJobRunResponse) => void): Request<EMRServerless.Types.StartJobRunResponse, AWSError>;
  /**
   * Starts a job run.
   */
  startJobRun(callback?: (err: AWSError, data: EMRServerless.Types.StartJobRunResponse) => void): Request<EMRServerless.Types.StartJobRunResponse, AWSError>;
  /**
   * Stops a specified application and releases initial capacity if configured. All scheduled and running jobs must be completed or cancelled before stopping an application.
   */
  stopApplication(params: EMRServerless.Types.StopApplicationRequest, callback?: (err: AWSError, data: EMRServerless.Types.StopApplicationResponse) => void): Request<EMRServerless.Types.StopApplicationResponse, AWSError>;
  /**
   * Stops a specified application and releases initial capacity if configured. All scheduled and running jobs must be completed or cancelled before stopping an application.
   */
  stopApplication(callback?: (err: AWSError, data: EMRServerless.Types.StopApplicationResponse) => void): Request<EMRServerless.Types.StopApplicationResponse, AWSError>;
  /**
   * Assigns tags to resources. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value, both of which you define. Tags enable you to categorize your Amazon Web Services resources by attributes such as purpose, owner, or environment. When you have many resources of the same type, you can quickly identify a specific resource based on the tags you've assigned to it. 
   */
  tagResource(params: EMRServerless.Types.TagResourceRequest, callback?: (err: AWSError, data: EMRServerless.Types.TagResourceResponse) => void): Request<EMRServerless.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns tags to resources. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value, both of which you define. Tags enable you to categorize your Amazon Web Services resources by attributes such as purpose, owner, or environment. When you have many resources of the same type, you can quickly identify a specific resource based on the tags you've assigned to it. 
   */
  tagResource(callback?: (err: AWSError, data: EMRServerless.Types.TagResourceResponse) => void): Request<EMRServerless.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from resources.
   */
  untagResource(params: EMRServerless.Types.UntagResourceRequest, callback?: (err: AWSError, data: EMRServerless.Types.UntagResourceResponse) => void): Request<EMRServerless.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from resources.
   */
  untagResource(callback?: (err: AWSError, data: EMRServerless.Types.UntagResourceResponse) => void): Request<EMRServerless.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a specified application. An application has to be in a stopped or created state in order to be updated.
   */
  updateApplication(params: EMRServerless.Types.UpdateApplicationRequest, callback?: (err: AWSError, data: EMRServerless.Types.UpdateApplicationResponse) => void): Request<EMRServerless.Types.UpdateApplicationResponse, AWSError>;
  /**
   * Updates a specified application. An application has to be in a stopped or created state in order to be updated.
   */
  updateApplication(callback?: (err: AWSError, data: EMRServerless.Types.UpdateApplicationResponse) => void): Request<EMRServerless.Types.UpdateApplicationResponse, AWSError>;
}
declare namespace EMRServerless {
  export interface Application {
    /**
     * The ID of the application.
     */
    applicationId: ApplicationId;
    /**
     * The name of the application.
     */
    name?: ApplicationName;
    /**
     * The ARN of the application.
     */
    arn: ApplicationArn;
    /**
     * The Amazon EMR release associated with the application.
     */
    releaseLabel: ReleaseLabel;
    /**
     * The type of application, such as Spark or Hive.
     */
    type: EngineType;
    /**
     * The state of the application.
     */
    state: ApplicationState;
    /**
     * The state details of the application.
     */
    stateDetails?: String256;
    /**
     * The initial capacity of the application.
     */
    initialCapacity?: InitialCapacityConfigMap;
    /**
     * The maximum capacity of the application. This is cumulative across all workers at any given point in time during the lifespan of the application is created. No new resources will be created once any one of the defined limits is hit.
     */
    maximumCapacity?: MaximumAllowedResources;
    /**
     * The date and time when the application run was created.
     */
    createdAt: _Date;
    /**
     * The date and time when the application run was last updated.
     */
    updatedAt: _Date;
    /**
     * The tags assigned to the application.
     */
    tags?: TagMap;
    /**
     * The configuration for an application to automatically start on job submission.
     */
    autoStartConfiguration?: AutoStartConfig;
    /**
     * The configuration for an application to automatically stop after a certain amount of time being idle.
     */
    autoStopConfiguration?: AutoStopConfig;
    /**
     * The network configuration for customer VPC connectivity for the application.
     */
    networkConfiguration?: NetworkConfiguration;
    /**
     * The CPU architecture of an application.
     */
    architecture?: Architecture;
    /**
     * The image configuration applied to all worker types.
     */
    imageConfiguration?: ImageConfiguration;
    /**
     * The specification applied to each worker type.
     */
    workerTypeSpecifications?: WorkerTypeSpecificationMap;
    /**
     * The Configuration specifications of an application. Each configuration consists of a classification and properties. You use this parameter when creating or updating an application. To see the runtimeConfiguration object of an application, run the GetApplication API operation.
     */
    runtimeConfiguration?: ConfigurationList;
    monitoringConfiguration?: MonitoringConfiguration;
  }
  export type ApplicationArn = string;
  export type ApplicationId = string;
  export type ApplicationList = ApplicationSummary[];
  export type ApplicationName = string;
  export type ApplicationState = "CREATING"|"CREATED"|"STARTING"|"STARTED"|"STOPPING"|"STOPPED"|"TERMINATED"|string;
  export type ApplicationStateSet = ApplicationState[];
  export interface ApplicationSummary {
    /**
     * The ID of the application.
     */
    id: ApplicationId;
    /**
     * The name of the application.
     */
    name?: ApplicationName;
    /**
     * The ARN of the application.
     */
    arn: ApplicationArn;
    /**
     * The Amazon EMR release associated with the application.
     */
    releaseLabel: ReleaseLabel;
    /**
     * The type of application, such as Spark or Hive.
     */
    type: EngineType;
    /**
     * The state of the application.
     */
    state: ApplicationState;
    /**
     * The state details of the application.
     */
    stateDetails?: String256;
    /**
     * The date and time when the application was created.
     */
    createdAt: _Date;
    /**
     * The date and time when the application was last updated.
     */
    updatedAt: _Date;
    /**
     * The CPU architecture of an application.
     */
    architecture?: Architecture;
  }
  export type Architecture = "ARM64"|"X86_64"|string;
  export interface AutoStartConfig {
    /**
     * Enables the application to automatically start on job submission. Defaults to true.
     */
    enabled?: Boolean;
  }
  export interface AutoStopConfig {
    /**
     * Enables the application to automatically stop after a certain amount of time being idle. Defaults to true.
     */
    enabled?: Boolean;
    /**
     * The amount of idle time in minutes after which your application will automatically stop. Defaults to 15 minutes.
     */
    idleTimeoutMinutes?: AutoStopConfigIdleTimeoutMinutesInteger;
  }
  export type AutoStopConfigIdleTimeoutMinutesInteger = number;
  export type Boolean = boolean;
  export interface CancelJobRunRequest {
    /**
     * The ID of the application on which the job run will be canceled.
     */
    applicationId: ApplicationId;
    /**
     * The ID of the job run to cancel.
     */
    jobRunId: JobRunId;
  }
  export interface CancelJobRunResponse {
    /**
     * The output contains the application ID on which the job run is cancelled.
     */
    applicationId: ApplicationId;
    /**
     * The output contains the ID of the cancelled job run.
     */
    jobRunId: JobRunId;
  }
  export type ClientToken = string;
  export interface CloudWatchLoggingConfiguration {
    /**
     * Enables CloudWatch logging.
     */
    enabled: Boolean;
    /**
     * The name of the log group in Amazon CloudWatch Logs where you want to publish your logs.
     */
    logGroupName?: LogGroupName;
    /**
     * Prefix for the CloudWatch log stream name.
     */
    logStreamNamePrefix?: LogStreamNamePrefix;
    /**
     * The Key Management Service (KMS) key ARN to encrypt the logs that you store in CloudWatch Logs.
     */
    encryptionKeyArn?: EncryptionKeyArn;
    /**
     * The types of logs that you want to publish to CloudWatch. If you don't specify any log types, driver STDOUT and STDERR logs will be published to CloudWatch Logs by default. For more information including the supported worker types for Hive and Spark, see Logging for EMR Serverless with CloudWatch.    Key Valid Values: SPARK_DRIVER, SPARK_EXECUTOR, HIVE_DRIVER, TEZ_TASK     Array Members Valid Values: STDOUT, STDERR, HIVE_LOG, TEZ_AM, SYSTEM_LOGS   
     */
    logTypes?: LogTypeMap;
  }
  export interface Configuration {
    /**
     * The classification within a configuration.
     */
    classification: String1024;
    /**
     * A set of properties specified within a configuration classification.
     */
    properties?: SensitivePropertiesMap;
    /**
     * A list of additional configurations to apply within a configuration object.
     */
    configurations?: ConfigurationList;
  }
  export type ConfigurationList = Configuration[];
  export interface ConfigurationOverrides {
    /**
     * The override configurations for the application.
     */
    applicationConfiguration?: ConfigurationList;
    /**
     * The override configurations for monitoring.
     */
    monitoringConfiguration?: MonitoringConfiguration;
  }
  export type CpuSize = string;
  export interface CreateApplicationRequest {
    /**
     * The name of the application.
     */
    name?: ApplicationName;
    /**
     * The Amazon EMR release associated with the application.
     */
    releaseLabel: ReleaseLabel;
    /**
     * The type of application you want to start, such as Spark or Hive.
     */
    type: EngineType;
    /**
     * The client idempotency token of the application to create. Its value must be unique for each request.
     */
    clientToken: ClientToken;
    /**
     * The capacity to initialize when the application is created.
     */
    initialCapacity?: InitialCapacityConfigMap;
    /**
     * The maximum capacity to allocate when the application is created. This is cumulative across all workers at any given point in time, not just when an application is created. No new resources will be created once any one of the defined limits is hit.
     */
    maximumCapacity?: MaximumAllowedResources;
    /**
     * The tags assigned to the application.
     */
    tags?: TagMap;
    /**
     * The configuration for an application to automatically start on job submission.
     */
    autoStartConfiguration?: AutoStartConfig;
    /**
     * The configuration for an application to automatically stop after a certain amount of time being idle.
     */
    autoStopConfiguration?: AutoStopConfig;
    /**
     * The network configuration for customer VPC connectivity.
     */
    networkConfiguration?: NetworkConfiguration;
    /**
     * The CPU architecture of an application.
     */
    architecture?: Architecture;
    /**
     * The image configuration for all worker types. You can either set this parameter or imageConfiguration for each worker type in workerTypeSpecifications.
     */
    imageConfiguration?: ImageConfigurationInput;
    /**
     * The key-value pairs that specify worker type to WorkerTypeSpecificationInput. This parameter must contain all valid worker types for a Spark or Hive application. Valid worker types include Driver and Executor for Spark applications and HiveDriver and TezTask for Hive applications. You can either set image details in this parameter for each worker type, or in imageConfiguration for all worker types.
     */
    workerTypeSpecifications?: WorkerTypeSpecificationInputMap;
    /**
     * The Configuration specifications to use when creating an application. Each configuration consists of a classification and properties. This configuration is applied to all the job runs submitted under the application.
     */
    runtimeConfiguration?: ConfigurationList;
    /**
     * The configuration setting for monitoring.
     */
    monitoringConfiguration?: MonitoringConfiguration;
  }
  export interface CreateApplicationResponse {
    /**
     * The output contains the application ID.
     */
    applicationId: ApplicationId;
    /**
     * The output contains the name of the application.
     */
    name?: ApplicationName;
    /**
     * The output contains the ARN of the application.
     */
    arn: ApplicationArn;
  }
  export type _Date = Date;
  export interface DeleteApplicationRequest {
    /**
     * The ID of the application that will be deleted.
     */
    applicationId: ApplicationId;
  }
  export interface DeleteApplicationResponse {
  }
  export type DiskSize = string;
  export type Double = number;
  export type Duration = number;
  export type EncryptionKeyArn = string;
  export type EngineType = string;
  export type EntryPointArgument = string;
  export type EntryPointArguments = EntryPointArgument[];
  export type EntryPointPath = string;
  export interface GetApplicationRequest {
    /**
     * The ID of the application that will be described.
     */
    applicationId: ApplicationId;
  }
  export interface GetApplicationResponse {
    /**
     * The output displays information about the specified application.
     */
    application: Application;
  }
  export interface GetDashboardForJobRunRequest {
    /**
     * The ID of the application.
     */
    applicationId: ApplicationId;
    /**
     * The ID of the job run.
     */
    jobRunId: JobRunId;
  }
  export interface GetDashboardForJobRunResponse {
    /**
     * The URL to view job run's dashboard.
     */
    url?: Url;
  }
  export interface GetJobRunRequest {
    /**
     * The ID of the application on which the job run is submitted.
     */
    applicationId: ApplicationId;
    /**
     * The ID of the job run.
     */
    jobRunId: JobRunId;
  }
  export interface GetJobRunResponse {
    /**
     * The output displays information about the job run.
     */
    jobRun: JobRun;
  }
  export interface Hive {
    /**
     * The query for the Hive job run.
     */
    query: Query;
    /**
     * The query file for the Hive job run.
     */
    initQueryFile?: InitScriptPath;
    /**
     * The parameters for the Hive job run.
     */
    parameters?: HiveCliParameters;
  }
  export type HiveCliParameters = string;
  export type IAMRoleArn = string;
  export interface ImageConfiguration {
    /**
     * The image URI.
     */
    imageUri: ImageUri;
    /**
     * The SHA256 digest of the image URI. This indicates which specific image the application is configured for. The image digest doesn't exist until an application has started.
     */
    resolvedImageDigest?: ImageDigest;
  }
  export interface ImageConfigurationInput {
    /**
     * The URI of an image in the Amazon ECR registry. This field is required when you create a new application. If you leave this field blank in an update, Amazon EMR will remove the image configuration.
     */
    imageUri?: ImageUri;
  }
  export type ImageDigest = string;
  export type ImageUri = string;
  export type InitScriptPath = string;
  export interface InitialCapacityConfig {
    /**
     * The number of workers in the initial capacity configuration.
     */
    workerCount: WorkerCounts;
    /**
     * The resource configuration of the initial capacity configuration.
     */
    workerConfiguration?: WorkerResourceConfig;
  }
  export type InitialCapacityConfigMap = {[key: string]: InitialCapacityConfig};
  export type Integer = number;
  export type JobArn = string;
  export interface JobDriver {
    /**
     * The job driver parameters specified for Spark.
     */
    sparkSubmit?: SparkSubmit;
    /**
     * The job driver parameters specified for Hive.
     */
    hive?: Hive;
  }
  export interface JobRun {
    /**
     * The ID of the application the job is running on.
     */
    applicationId: ApplicationId;
    /**
     * The ID of the job run.
     */
    jobRunId: JobRunId;
    /**
     * The optional job run name. This doesn't have to be unique.
     */
    name?: String256;
    /**
     * The execution role ARN of the job run.
     */
    arn: JobArn;
    /**
     * The user who created the job run.
     */
    createdBy: RequestIdentityUserArn;
    /**
     * The date and time when the job run was created.
     */
    createdAt: _Date;
    /**
     * The date and time when the job run was updated.
     */
    updatedAt: _Date;
    /**
     * The execution role ARN of the job run.
     */
    executionRole: IAMRoleArn;
    /**
     * The state of the job run.
     */
    state: JobRunState;
    /**
     * The state details of the job run.
     */
    stateDetails: String256;
    /**
     * The Amazon EMR release associated with the application your job is running on.
     */
    releaseLabel: ReleaseLabel;
    /**
     * The configuration settings that are used to override default configuration.
     */
    configurationOverrides?: ConfigurationOverrides;
    /**
     * The job driver for the job run.
     */
    jobDriver: JobDriver;
    /**
     * The tags assigned to the job run.
     */
    tags?: TagMap;
    /**
     * The aggregate vCPU, memory, and storage resources used from the time the job starts to execute, until the time the job terminates, rounded up to the nearest second.
     */
    totalResourceUtilization?: TotalResourceUtilization;
    networkConfiguration?: NetworkConfiguration;
    /**
     * The job run total execution duration in seconds. This field is only available for job runs in a COMPLETED, FAILED, or CANCELLED state.
     */
    totalExecutionDurationSeconds?: Integer;
    /**
     * Returns the job run timeout value from the StartJobRun call. If no timeout was specified, then it returns the default timeout of 720 minutes.
     */
    executionTimeoutMinutes?: Duration;
    /**
     * The aggregate vCPU, memory, and storage that Amazon Web Services has billed for the job run. The billed resources include a 1-minute minimum usage for workers, plus additional storage over 20 GB per worker. Note that billed resources do not include usage for idle pre-initialized workers.
     */
    billedResourceUtilization?: ResourceUtilization;
  }
  export type JobRunId = string;
  export type JobRunState = "SUBMITTED"|"PENDING"|"SCHEDULED"|"RUNNING"|"SUCCESS"|"FAILED"|"CANCELLING"|"CANCELLED"|string;
  export type JobRunStateSet = JobRunState[];
  export interface JobRunSummary {
    /**
     * The ID of the application the job is running on.
     */
    applicationId: ApplicationId;
    /**
     * The ID of the job run.
     */
    id: JobRunId;
    /**
     * The optional job run name. This doesn't have to be unique.
     */
    name?: String256;
    /**
     * The ARN of the job run.
     */
    arn: JobArn;
    /**
     * The user who created the job run.
     */
    createdBy: RequestIdentityUserArn;
    /**
     * The date and time when the job run was created.
     */
    createdAt: _Date;
    /**
     * The date and time when the job run was last updated.
     */
    updatedAt: _Date;
    /**
     * The execution role ARN of the job run.
     */
    executionRole: IAMRoleArn;
    /**
     * The state of the job run.
     */
    state: JobRunState;
    /**
     * The state details of the job run.
     */
    stateDetails: String256;
    /**
     * The Amazon EMR release associated with the application your job is running on.
     */
    releaseLabel: ReleaseLabel;
    /**
     * The type of job run, such as Spark or Hive.
     */
    type?: JobRunType;
  }
  export type JobRunType = string;
  export type JobRuns = JobRunSummary[];
  export interface ListApplicationsRequest {
    /**
     * The token for the next set of application results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of applications that can be listed.
     */
    maxResults?: ListApplicationsRequestMaxResultsInteger;
    /**
     * An optional filter for application states. Note that if this filter contains multiple states, the resulting list will be grouped by the state.
     */
    states?: ApplicationStateSet;
  }
  export type ListApplicationsRequestMaxResultsInteger = number;
  export interface ListApplicationsResponse {
    /**
     * The output lists the specified applications.
     */
    applications: ApplicationList;
    /**
     * The output displays the token for the next set of application results. This is required for pagination and is available as a response of the previous request.
     */
    nextToken?: NextToken;
  }
  export interface ListJobRunsRequest {
    /**
     * The ID of the application for which to list the job run.
     */
    applicationId: ApplicationId;
    /**
     * The token for the next set of job run results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of job runs that can be listed.
     */
    maxResults?: ListJobRunsRequestMaxResultsInteger;
    /**
     * The lower bound of the option to filter by creation date and time.
     */
    createdAtAfter?: _Date;
    /**
     * The upper bound of the option to filter by creation date and time.
     */
    createdAtBefore?: _Date;
    /**
     * An optional filter for job run states. Note that if this filter contains multiple states, the resulting list will be grouped by the state.
     */
    states?: JobRunStateSet;
  }
  export type ListJobRunsRequestMaxResultsInteger = number;
  export interface ListJobRunsResponse {
    /**
     * The output lists information about the specified job runs.
     */
    jobRuns: JobRuns;
    /**
     * The output displays the token for the next set of job run results. This is required for pagination and is available as a response of the previous request.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource to list the tags for. Currently, the supported resources are Amazon EMR Serverless applications and job runs.
     */
    resourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags for the resource.
     */
    tags?: TagMap;
  }
  export type LogGroupName = string;
  export type LogStreamNamePrefix = string;
  export type LogTypeList = LogTypeString[];
  export type LogTypeMap = {[key: string]: LogTypeList};
  export type LogTypeString = string;
  export interface ManagedPersistenceMonitoringConfiguration {
    /**
     * Enables managed logging and defaults to true. If set to false, managed logging will be turned off.
     */
    enabled?: Boolean;
    /**
     * The KMS key ARN to encrypt the logs stored in managed log persistence.
     */
    encryptionKeyArn?: EncryptionKeyArn;
  }
  export interface MaximumAllowedResources {
    /**
     * The maximum allowed CPU for an application.
     */
    cpu: CpuSize;
    /**
     * The maximum allowed resources for an application.
     */
    memory: MemorySize;
    /**
     * The maximum allowed disk for an application.
     */
    disk?: DiskSize;
  }
  export type MemorySize = string;
  export interface MonitoringConfiguration {
    /**
     * The Amazon S3 configuration for monitoring log publishing.
     */
    s3MonitoringConfiguration?: S3MonitoringConfiguration;
    /**
     * The managed log persistence configuration for a job run.
     */
    managedPersistenceMonitoringConfiguration?: ManagedPersistenceMonitoringConfiguration;
    /**
     * The Amazon CloudWatch configuration for monitoring logs. You can configure your jobs to send log information to CloudWatch.
     */
    cloudWatchLoggingConfiguration?: CloudWatchLoggingConfiguration;
  }
  export interface NetworkConfiguration {
    /**
     * The array of subnet Ids for customer VPC connectivity.
     */
    subnetIds?: SubnetIds;
    /**
     * The array of security group Ids for customer VPC connectivity.
     */
    securityGroupIds?: SecurityGroupIds;
  }
  export type NextToken = string;
  export type Query = string;
  export type ReleaseLabel = string;
  export type RequestIdentityUserArn = string;
  export type ResourceArn = string;
  export interface ResourceUtilization {
    /**
     * The aggregated vCPU used per hour from the time the job starts executing until the job is terminated.
     */
    vCPUHour?: Double;
    /**
     * The aggregated memory used per hour from the time the job starts executing until the job is terminated.
     */
    memoryGBHour?: Double;
    /**
     * The aggregated storage used per hour from the time the job starts executing until the job is terminated.
     */
    storageGBHour?: Double;
  }
  export interface S3MonitoringConfiguration {
    /**
     * The Amazon S3 destination URI for log publishing.
     */
    logUri?: UriString;
    /**
     * The KMS key ARN to encrypt the logs published to the given Amazon S3 destination.
     */
    encryptionKeyArn?: EncryptionKeyArn;
  }
  export type SecurityGroupIds = SecurityGroupString[];
  export type SecurityGroupString = string;
  export type SensitivePropertiesMap = {[key: string]: String1024};
  export interface SparkSubmit {
    /**
     * The entry point for the Spark submit job run.
     */
    entryPoint: EntryPointPath;
    /**
     * The arguments for the Spark submit job run.
     */
    entryPointArguments?: EntryPointArguments;
    /**
     * The parameters for the Spark submit job run.
     */
    sparkSubmitParameters?: SparkSubmitParameters;
  }
  export type SparkSubmitParameters = string;
  export interface StartApplicationRequest {
    /**
     * The ID of the application to start.
     */
    applicationId: ApplicationId;
  }
  export interface StartApplicationResponse {
  }
  export interface StartJobRunRequest {
    /**
     * The ID of the application on which to run the job.
     */
    applicationId: ApplicationId;
    /**
     * The client idempotency token of the job run to start. Its value must be unique for each request.
     */
    clientToken: ClientToken;
    /**
     * The execution role ARN for the job run.
     */
    executionRoleArn: IAMRoleArn;
    /**
     * The job driver for the job run.
     */
    jobDriver?: JobDriver;
    /**
     * The configuration overrides for the job run.
     */
    configurationOverrides?: ConfigurationOverrides;
    /**
     * The tags assigned to the job run.
     */
    tags?: TagMap;
    /**
     * The maximum duration for the job run to run. If the job run runs beyond this duration, it will be automatically cancelled.
     */
    executionTimeoutMinutes?: Duration;
    /**
     * The optional job run name. This doesn't have to be unique.
     */
    name?: String256;
  }
  export interface StartJobRunResponse {
    /**
     * This output displays the application ID on which the job run was submitted.
     */
    applicationId: ApplicationId;
    /**
     * The output contains the ID of the started job run.
     */
    jobRunId: JobRunId;
    /**
     * This output displays the ARN of the job run..
     */
    arn: JobArn;
  }
  export interface StopApplicationRequest {
    /**
     * The ID of the application to stop.
     */
    applicationId: ApplicationId;
  }
  export interface StopApplicationResponse {
  }
  export type String1024 = string;
  export type String256 = string;
  export type SubnetIds = SubnetString[];
  export type SubnetString = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource to list the tags for. Currently, the supported resources are Amazon EMR Serverless applications and job runs.
     */
    resourceArn: ResourceArn;
    /**
     * The tags to add to the resource. A tag is an array of key-value pairs.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TotalResourceUtilization {
    /**
     * The aggregated vCPU used per hour from the time job start executing till the time job is terminated.
     */
    vCPUHour?: Double;
    /**
     * The aggregated memory used per hour from the time job start executing till the time job is terminated.
     */
    memoryGBHour?: Double;
    /**
     * The aggregated storage used per hour from the time job start executing till the time job is terminated.
     */
    storageGBHour?: Double;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource to list the tags for. Currently, the supported resources are Amazon EMR Serverless applications and job runs.
     */
    resourceArn: ResourceArn;
    /**
     * The keys of the tags to be removed.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateApplicationRequest {
    /**
     * The ID of the application to update.
     */
    applicationId: ApplicationId;
    /**
     * The client idempotency token of the application to update. Its value must be unique for each request.
     */
    clientToken: ClientToken;
    /**
     * The capacity to initialize when the application is updated.
     */
    initialCapacity?: InitialCapacityConfigMap;
    /**
     * The maximum capacity to allocate when the application is updated. This is cumulative across all workers at any given point in time during the lifespan of the application. No new resources will be created once any one of the defined limits is hit.
     */
    maximumCapacity?: MaximumAllowedResources;
    /**
     * The configuration for an application to automatically start on job submission.
     */
    autoStartConfiguration?: AutoStartConfig;
    /**
     * The configuration for an application to automatically stop after a certain amount of time being idle.
     */
    autoStopConfiguration?: AutoStopConfig;
    networkConfiguration?: NetworkConfiguration;
    /**
     * The CPU architecture of an application.
     */
    architecture?: Architecture;
    /**
     * The image configuration to be used for all worker types. You can either set this parameter or imageConfiguration for each worker type in WorkerTypeSpecificationInput.
     */
    imageConfiguration?: ImageConfigurationInput;
    /**
     * The key-value pairs that specify worker type to WorkerTypeSpecificationInput. This parameter must contain all valid worker types for a Spark or Hive application. Valid worker types include Driver and Executor for Spark applications and HiveDriver and TezTask for Hive applications. You can either set image details in this parameter for each worker type, or in imageConfiguration for all worker types.
     */
    workerTypeSpecifications?: WorkerTypeSpecificationInputMap;
    /**
     * The Amazon EMR release label for the application. You can change the release label to use a different release of Amazon EMR.
     */
    releaseLabel?: ReleaseLabel;
    /**
     * The Configuration specifications to use when updating an application. Each configuration consists of a classification and properties. This configuration is applied across all the job runs submitted under the application.
     */
    runtimeConfiguration?: ConfigurationList;
    /**
     * The configuration setting for monitoring.
     */
    monitoringConfiguration?: MonitoringConfiguration;
  }
  export interface UpdateApplicationResponse {
    /**
     * Information about the updated application.
     */
    application: Application;
  }
  export type UriString = string;
  export type Url = string;
  export type WorkerCounts = number;
  export interface WorkerResourceConfig {
    /**
     * The CPU requirements for every worker instance of the worker type.
     */
    cpu: CpuSize;
    /**
     * The memory requirements for every worker instance of the worker type.
     */
    memory: MemorySize;
    /**
     * The disk requirements for every worker instance of the worker type.
     */
    disk?: DiskSize;
  }
  export interface WorkerTypeSpecification {
    /**
     * The image configuration for a worker type.
     */
    imageConfiguration?: ImageConfiguration;
  }
  export interface WorkerTypeSpecificationInput {
    /**
     * The image configuration for a worker type.
     */
    imageConfiguration?: ImageConfigurationInput;
  }
  export type WorkerTypeSpecificationInputMap = {[key: string]: WorkerTypeSpecificationInput};
  export type WorkerTypeSpecificationMap = {[key: string]: WorkerTypeSpecification};
  export type WorkerTypeString = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-07-13"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the EMRServerless client.
   */
  export import Types = EMRServerless;
}
export = EMRServerless;
