import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class M2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: M2.Types.ClientConfiguration)
  config: Config & M2.Types.ClientConfiguration;
  /**
   * Cancels the running of a specific batch job execution.
   */
  cancelBatchJobExecution(params: M2.Types.CancelBatchJobExecutionRequest, callback?: (err: AWSError, data: M2.Types.CancelBatchJobExecutionResponse) => void): Request<M2.Types.CancelBatchJobExecutionResponse, AWSError>;
  /**
   * Cancels the running of a specific batch job execution.
   */
  cancelBatchJobExecution(callback?: (err: AWSError, data: M2.Types.CancelBatchJobExecutionResponse) => void): Request<M2.Types.CancelBatchJobExecutionResponse, AWSError>;
  /**
   * Creates a new application with given parameters. Requires an existing runtime environment and application definition file.
   */
  createApplication(params: M2.Types.CreateApplicationRequest, callback?: (err: AWSError, data: M2.Types.CreateApplicationResponse) => void): Request<M2.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates a new application with given parameters. Requires an existing runtime environment and application definition file.
   */
  createApplication(callback?: (err: AWSError, data: M2.Types.CreateApplicationResponse) => void): Request<M2.Types.CreateApplicationResponse, AWSError>;
  /**
   * Starts a data set import task for a specific application.
   */
  createDataSetImportTask(params: M2.Types.CreateDataSetImportTaskRequest, callback?: (err: AWSError, data: M2.Types.CreateDataSetImportTaskResponse) => void): Request<M2.Types.CreateDataSetImportTaskResponse, AWSError>;
  /**
   * Starts a data set import task for a specific application.
   */
  createDataSetImportTask(callback?: (err: AWSError, data: M2.Types.CreateDataSetImportTaskResponse) => void): Request<M2.Types.CreateDataSetImportTaskResponse, AWSError>;
  /**
   * Creates and starts a deployment to deploy an application into a runtime environment.
   */
  createDeployment(params: M2.Types.CreateDeploymentRequest, callback?: (err: AWSError, data: M2.Types.CreateDeploymentResponse) => void): Request<M2.Types.CreateDeploymentResponse, AWSError>;
  /**
   * Creates and starts a deployment to deploy an application into a runtime environment.
   */
  createDeployment(callback?: (err: AWSError, data: M2.Types.CreateDeploymentResponse) => void): Request<M2.Types.CreateDeploymentResponse, AWSError>;
  /**
   * Creates a runtime environment for a given runtime engine.
   */
  createEnvironment(params: M2.Types.CreateEnvironmentRequest, callback?: (err: AWSError, data: M2.Types.CreateEnvironmentResponse) => void): Request<M2.Types.CreateEnvironmentResponse, AWSError>;
  /**
   * Creates a runtime environment for a given runtime engine.
   */
  createEnvironment(callback?: (err: AWSError, data: M2.Types.CreateEnvironmentResponse) => void): Request<M2.Types.CreateEnvironmentResponse, AWSError>;
  /**
   * Deletes a specific application. You cannot delete a running application.
   */
  deleteApplication(params: M2.Types.DeleteApplicationRequest, callback?: (err: AWSError, data: M2.Types.DeleteApplicationResponse) => void): Request<M2.Types.DeleteApplicationResponse, AWSError>;
  /**
   * Deletes a specific application. You cannot delete a running application.
   */
  deleteApplication(callback?: (err: AWSError, data: M2.Types.DeleteApplicationResponse) => void): Request<M2.Types.DeleteApplicationResponse, AWSError>;
  /**
   * Deletes a specific application from the specific runtime environment where it was previously deployed. You cannot delete a runtime environment using DeleteEnvironment if any application has ever been deployed to it. This API removes the association of the application with the runtime environment so you can delete the environment smoothly.
   */
  deleteApplicationFromEnvironment(params: M2.Types.DeleteApplicationFromEnvironmentRequest, callback?: (err: AWSError, data: M2.Types.DeleteApplicationFromEnvironmentResponse) => void): Request<M2.Types.DeleteApplicationFromEnvironmentResponse, AWSError>;
  /**
   * Deletes a specific application from the specific runtime environment where it was previously deployed. You cannot delete a runtime environment using DeleteEnvironment if any application has ever been deployed to it. This API removes the association of the application with the runtime environment so you can delete the environment smoothly.
   */
  deleteApplicationFromEnvironment(callback?: (err: AWSError, data: M2.Types.DeleteApplicationFromEnvironmentResponse) => void): Request<M2.Types.DeleteApplicationFromEnvironmentResponse, AWSError>;
  /**
   * Deletes a specific runtime environment. The environment cannot contain deployed applications. If it does, you must delete those applications before you delete the environment.
   */
  deleteEnvironment(params: M2.Types.DeleteEnvironmentRequest, callback?: (err: AWSError, data: M2.Types.DeleteEnvironmentResponse) => void): Request<M2.Types.DeleteEnvironmentResponse, AWSError>;
  /**
   * Deletes a specific runtime environment. The environment cannot contain deployed applications. If it does, you must delete those applications before you delete the environment.
   */
  deleteEnvironment(callback?: (err: AWSError, data: M2.Types.DeleteEnvironmentResponse) => void): Request<M2.Types.DeleteEnvironmentResponse, AWSError>;
  /**
   * Describes the details of a specific application.
   */
  getApplication(params: M2.Types.GetApplicationRequest, callback?: (err: AWSError, data: M2.Types.GetApplicationResponse) => void): Request<M2.Types.GetApplicationResponse, AWSError>;
  /**
   * Describes the details of a specific application.
   */
  getApplication(callback?: (err: AWSError, data: M2.Types.GetApplicationResponse) => void): Request<M2.Types.GetApplicationResponse, AWSError>;
  /**
   * Returns details about a specific version of a specific application.
   */
  getApplicationVersion(params: M2.Types.GetApplicationVersionRequest, callback?: (err: AWSError, data: M2.Types.GetApplicationVersionResponse) => void): Request<M2.Types.GetApplicationVersionResponse, AWSError>;
  /**
   * Returns details about a specific version of a specific application.
   */
  getApplicationVersion(callback?: (err: AWSError, data: M2.Types.GetApplicationVersionResponse) => void): Request<M2.Types.GetApplicationVersionResponse, AWSError>;
  /**
   * Gets the details of a specific batch job execution for a specific application.
   */
  getBatchJobExecution(params: M2.Types.GetBatchJobExecutionRequest, callback?: (err: AWSError, data: M2.Types.GetBatchJobExecutionResponse) => void): Request<M2.Types.GetBatchJobExecutionResponse, AWSError>;
  /**
   * Gets the details of a specific batch job execution for a specific application.
   */
  getBatchJobExecution(callback?: (err: AWSError, data: M2.Types.GetBatchJobExecutionResponse) => void): Request<M2.Types.GetBatchJobExecutionResponse, AWSError>;
  /**
   * Gets the details of a specific data set.
   */
  getDataSetDetails(params: M2.Types.GetDataSetDetailsRequest, callback?: (err: AWSError, data: M2.Types.GetDataSetDetailsResponse) => void): Request<M2.Types.GetDataSetDetailsResponse, AWSError>;
  /**
   * Gets the details of a specific data set.
   */
  getDataSetDetails(callback?: (err: AWSError, data: M2.Types.GetDataSetDetailsResponse) => void): Request<M2.Types.GetDataSetDetailsResponse, AWSError>;
  /**
   * Gets the status of a data set import task initiated with the CreateDataSetImportTask operation.
   */
  getDataSetImportTask(params: M2.Types.GetDataSetImportTaskRequest, callback?: (err: AWSError, data: M2.Types.GetDataSetImportTaskResponse) => void): Request<M2.Types.GetDataSetImportTaskResponse, AWSError>;
  /**
   * Gets the status of a data set import task initiated with the CreateDataSetImportTask operation.
   */
  getDataSetImportTask(callback?: (err: AWSError, data: M2.Types.GetDataSetImportTaskResponse) => void): Request<M2.Types.GetDataSetImportTaskResponse, AWSError>;
  /**
   * Gets details of a specific deployment with a given deployment identifier.
   */
  getDeployment(params: M2.Types.GetDeploymentRequest, callback?: (err: AWSError, data: M2.Types.GetDeploymentResponse) => void): Request<M2.Types.GetDeploymentResponse, AWSError>;
  /**
   * Gets details of a specific deployment with a given deployment identifier.
   */
  getDeployment(callback?: (err: AWSError, data: M2.Types.GetDeploymentResponse) => void): Request<M2.Types.GetDeploymentResponse, AWSError>;
  /**
   * Describes a specific runtime environment.
   */
  getEnvironment(params: M2.Types.GetEnvironmentRequest, callback?: (err: AWSError, data: M2.Types.GetEnvironmentResponse) => void): Request<M2.Types.GetEnvironmentResponse, AWSError>;
  /**
   * Describes a specific runtime environment.
   */
  getEnvironment(callback?: (err: AWSError, data: M2.Types.GetEnvironmentResponse) => void): Request<M2.Types.GetEnvironmentResponse, AWSError>;
  /**
   * Gets a single sign-on URL that can be used to connect to AWS Blu Insights.
   */
  getSignedBluinsightsUrl(callback?: (err: AWSError, data: M2.Types.GetSignedBluinsightsUrlResponse) => void): Request<M2.Types.GetSignedBluinsightsUrlResponse, AWSError>;
  /**
   * Returns a list of the application versions for a specific application.
   */
  listApplicationVersions(params: M2.Types.ListApplicationVersionsRequest, callback?: (err: AWSError, data: M2.Types.ListApplicationVersionsResponse) => void): Request<M2.Types.ListApplicationVersionsResponse, AWSError>;
  /**
   * Returns a list of the application versions for a specific application.
   */
  listApplicationVersions(callback?: (err: AWSError, data: M2.Types.ListApplicationVersionsResponse) => void): Request<M2.Types.ListApplicationVersionsResponse, AWSError>;
  /**
   * Lists the applications associated with a specific Amazon Web Services account. You can provide the unique identifier of a specific runtime environment in a query parameter to see all applications associated with that environment.
   */
  listApplications(params: M2.Types.ListApplicationsRequest, callback?: (err: AWSError, data: M2.Types.ListApplicationsResponse) => void): Request<M2.Types.ListApplicationsResponse, AWSError>;
  /**
   * Lists the applications associated with a specific Amazon Web Services account. You can provide the unique identifier of a specific runtime environment in a query parameter to see all applications associated with that environment.
   */
  listApplications(callback?: (err: AWSError, data: M2.Types.ListApplicationsResponse) => void): Request<M2.Types.ListApplicationsResponse, AWSError>;
  /**
   * Lists all the available batch job definitions based on the batch job resources uploaded during the application creation. You can use the batch job definitions in the list to start a batch job.
   */
  listBatchJobDefinitions(params: M2.Types.ListBatchJobDefinitionsRequest, callback?: (err: AWSError, data: M2.Types.ListBatchJobDefinitionsResponse) => void): Request<M2.Types.ListBatchJobDefinitionsResponse, AWSError>;
  /**
   * Lists all the available batch job definitions based on the batch job resources uploaded during the application creation. You can use the batch job definitions in the list to start a batch job.
   */
  listBatchJobDefinitions(callback?: (err: AWSError, data: M2.Types.ListBatchJobDefinitionsResponse) => void): Request<M2.Types.ListBatchJobDefinitionsResponse, AWSError>;
  /**
   * Lists historical, current, and scheduled batch job executions for a specific application.
   */
  listBatchJobExecutions(params: M2.Types.ListBatchJobExecutionsRequest, callback?: (err: AWSError, data: M2.Types.ListBatchJobExecutionsResponse) => void): Request<M2.Types.ListBatchJobExecutionsResponse, AWSError>;
  /**
   * Lists historical, current, and scheduled batch job executions for a specific application.
   */
  listBatchJobExecutions(callback?: (err: AWSError, data: M2.Types.ListBatchJobExecutionsResponse) => void): Request<M2.Types.ListBatchJobExecutionsResponse, AWSError>;
  /**
   * Lists the data set imports for the specified application.
   */
  listDataSetImportHistory(params: M2.Types.ListDataSetImportHistoryRequest, callback?: (err: AWSError, data: M2.Types.ListDataSetImportHistoryResponse) => void): Request<M2.Types.ListDataSetImportHistoryResponse, AWSError>;
  /**
   * Lists the data set imports for the specified application.
   */
  listDataSetImportHistory(callback?: (err: AWSError, data: M2.Types.ListDataSetImportHistoryResponse) => void): Request<M2.Types.ListDataSetImportHistoryResponse, AWSError>;
  /**
   * Lists the data sets imported for a specific application. In Amazon Web Services Mainframe Modernization, data sets are associated with applications deployed on runtime environments. This is known as importing data sets. Currently, Amazon Web Services Mainframe Modernization can import data sets into catalogs using CreateDataSetImportTask.
   */
  listDataSets(params: M2.Types.ListDataSetsRequest, callback?: (err: AWSError, data: M2.Types.ListDataSetsResponse) => void): Request<M2.Types.ListDataSetsResponse, AWSError>;
  /**
   * Lists the data sets imported for a specific application. In Amazon Web Services Mainframe Modernization, data sets are associated with applications deployed on runtime environments. This is known as importing data sets. Currently, Amazon Web Services Mainframe Modernization can import data sets into catalogs using CreateDataSetImportTask.
   */
  listDataSets(callback?: (err: AWSError, data: M2.Types.ListDataSetsResponse) => void): Request<M2.Types.ListDataSetsResponse, AWSError>;
  /**
   * Returns a list of all deployments of a specific application. A deployment is a combination of a specific application and a specific version of that application. Each deployment is mapped to a particular application version.
   */
  listDeployments(params: M2.Types.ListDeploymentsRequest, callback?: (err: AWSError, data: M2.Types.ListDeploymentsResponse) => void): Request<M2.Types.ListDeploymentsResponse, AWSError>;
  /**
   * Returns a list of all deployments of a specific application. A deployment is a combination of a specific application and a specific version of that application. Each deployment is mapped to a particular application version.
   */
  listDeployments(callback?: (err: AWSError, data: M2.Types.ListDeploymentsResponse) => void): Request<M2.Types.ListDeploymentsResponse, AWSError>;
  /**
   * Lists the available engine versions.
   */
  listEngineVersions(params: M2.Types.ListEngineVersionsRequest, callback?: (err: AWSError, data: M2.Types.ListEngineVersionsResponse) => void): Request<M2.Types.ListEngineVersionsResponse, AWSError>;
  /**
   * Lists the available engine versions.
   */
  listEngineVersions(callback?: (err: AWSError, data: M2.Types.ListEngineVersionsResponse) => void): Request<M2.Types.ListEngineVersionsResponse, AWSError>;
  /**
   * Lists the runtime environments.
   */
  listEnvironments(params: M2.Types.ListEnvironmentsRequest, callback?: (err: AWSError, data: M2.Types.ListEnvironmentsResponse) => void): Request<M2.Types.ListEnvironmentsResponse, AWSError>;
  /**
   * Lists the runtime environments.
   */
  listEnvironments(callback?: (err: AWSError, data: M2.Types.ListEnvironmentsResponse) => void): Request<M2.Types.ListEnvironmentsResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(params: M2.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: M2.Types.ListTagsForResourceResponse) => void): Request<M2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: M2.Types.ListTagsForResourceResponse) => void): Request<M2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Starts an application that is currently stopped.
   */
  startApplication(params: M2.Types.StartApplicationRequest, callback?: (err: AWSError, data: M2.Types.StartApplicationResponse) => void): Request<M2.Types.StartApplicationResponse, AWSError>;
  /**
   * Starts an application that is currently stopped.
   */
  startApplication(callback?: (err: AWSError, data: M2.Types.StartApplicationResponse) => void): Request<M2.Types.StartApplicationResponse, AWSError>;
  /**
   * Starts a batch job and returns the unique identifier of this execution of the batch job. The associated application must be running in order to start the batch job.
   */
  startBatchJob(params: M2.Types.StartBatchJobRequest, callback?: (err: AWSError, data: M2.Types.StartBatchJobResponse) => void): Request<M2.Types.StartBatchJobResponse, AWSError>;
  /**
   * Starts a batch job and returns the unique identifier of this execution of the batch job. The associated application must be running in order to start the batch job.
   */
  startBatchJob(callback?: (err: AWSError, data: M2.Types.StartBatchJobResponse) => void): Request<M2.Types.StartBatchJobResponse, AWSError>;
  /**
   * Stops a running application.
   */
  stopApplication(params: M2.Types.StopApplicationRequest, callback?: (err: AWSError, data: M2.Types.StopApplicationResponse) => void): Request<M2.Types.StopApplicationResponse, AWSError>;
  /**
   * Stops a running application.
   */
  stopApplication(callback?: (err: AWSError, data: M2.Types.StopApplicationResponse) => void): Request<M2.Types.StopApplicationResponse, AWSError>;
  /**
   * Adds one or more tags to the specified resource.
   */
  tagResource(params: M2.Types.TagResourceRequest, callback?: (err: AWSError, data: M2.Types.TagResourceResponse) => void): Request<M2.Types.TagResourceResponse, AWSError>;
  /**
   * Adds one or more tags to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: M2.Types.TagResourceResponse) => void): Request<M2.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified resource.
   */
  untagResource(params: M2.Types.UntagResourceRequest, callback?: (err: AWSError, data: M2.Types.UntagResourceResponse) => void): Request<M2.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: M2.Types.UntagResourceResponse) => void): Request<M2.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an application and creates a new version.
   */
  updateApplication(params: M2.Types.UpdateApplicationRequest, callback?: (err: AWSError, data: M2.Types.UpdateApplicationResponse) => void): Request<M2.Types.UpdateApplicationResponse, AWSError>;
  /**
   * Updates an application and creates a new version.
   */
  updateApplication(callback?: (err: AWSError, data: M2.Types.UpdateApplicationResponse) => void): Request<M2.Types.UpdateApplicationResponse, AWSError>;
  /**
   * Updates the configuration details for a specific runtime environment.
   */
  updateEnvironment(params: M2.Types.UpdateEnvironmentRequest, callback?: (err: AWSError, data: M2.Types.UpdateEnvironmentResponse) => void): Request<M2.Types.UpdateEnvironmentResponse, AWSError>;
  /**
   * Updates the configuration details for a specific runtime environment.
   */
  updateEnvironment(callback?: (err: AWSError, data: M2.Types.UpdateEnvironmentResponse) => void): Request<M2.Types.UpdateEnvironmentResponse, AWSError>;
}
declare namespace M2 {
  export interface AlternateKey {
    /**
     * Indicates whether the alternate key values are supposed to be unique for the given data set.
     */
    allowDuplicates?: Boolean;
    /**
     * A strictly positive integer value representing the length of the alternate key.
     */
    length: Integer;
    /**
     * The name of the alternate key.
     */
    name?: String;
    /**
     * A positive integer value representing the offset to mark the start of the alternate key part in the record byte array.
     */
    offset: Integer;
  }
  export type AlternateKeyList = AlternateKey[];
  export type ApplicationDeploymentLifecycle = "Deploying"|"Deployed"|string;
  export type ApplicationLifecycle = "Creating"|"Created"|"Available"|"Ready"|"Starting"|"Running"|"Stopping"|"Stopped"|"Failed"|"Deleting"|"Deleting From Environment"|string;
  export interface ApplicationSummary {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    applicationArn: Arn;
    /**
     * The unique identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The version of the application.
     */
    applicationVersion: Version;
    /**
     * The timestamp when the application was created.
     */
    creationTime: Timestamp;
    /**
     * Indicates either an ongoing deployment or if the application has ever deployed successfully.
     */
    deploymentStatus?: ApplicationDeploymentLifecycle;
    /**
     * The description of the application.
     */
    description?: EntityDescription;
    /**
     * The type of the target platform for this application.
     */
    engineType: EngineType;
    /**
     * The unique identifier of the runtime environment that hosts this application.
     */
    environmentId?: Identifier;
    /**
     * The timestamp when you last started the application. Null until the application runs for the first time.
     */
    lastStartTime?: Timestamp;
    /**
     * The name of the application.
     */
    name: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the role associated with the application.
     */
    roleArn?: Arn;
    /**
     * The status of the application.
     */
    status: ApplicationLifecycle;
    /**
     * Indicates the status of the latest version of the application.
     */
    versionStatus?: ApplicationVersionLifecycle;
  }
  export type ApplicationSummaryList = ApplicationSummary[];
  export type ApplicationVersionLifecycle = "Creating"|"Available"|"Failed"|string;
  export interface ApplicationVersionSummary {
    /**
     * The application version.
     */
    applicationVersion: Version;
    /**
     * The timestamp when the application version was created.
     */
    creationTime: Timestamp;
    /**
     * The status of the application.
     */
    status: ApplicationVersionLifecycle;
    /**
     * The reason for the reported status.
     */
    statusReason?: String;
  }
  export type ApplicationVersionSummaryList = ApplicationVersionSummary[];
  export type Arn = string;
  export type ArnList = Arn[];
  export interface BatchJobDefinition {
    /**
     * Specifies a file containing a batch job definition.
     */
    fileBatchJobDefinition?: FileBatchJobDefinition;
    /**
     * A script containing a batch job definition.
     */
    scriptBatchJobDefinition?: ScriptBatchJobDefinition;
  }
  export type BatchJobDefinitions = BatchJobDefinition[];
  export type BatchJobExecutionStatus = "Submitting"|"Holding"|"Dispatching"|"Running"|"Cancelling"|"Cancelled"|"Succeeded"|"Failed"|"Succeeded With Warning"|string;
  export interface BatchJobExecutionSummary {
    /**
     * The unique identifier of the application that hosts this batch job.
     */
    applicationId: Identifier;
    /**
     * The unique identifier of this batch job.
     */
    batchJobIdentifier?: BatchJobIdentifier;
    /**
     * The timestamp when this batch job execution ended.
     */
    endTime?: Timestamp;
    /**
     * The unique identifier of this execution of the batch job.
     */
    executionId: Identifier;
    /**
     * The unique identifier of a particular batch job.
     */
    jobId?: String100;
    /**
     * The name of a particular batch job.
     */
    jobName?: String100;
    /**
     * The type of a particular batch job execution.
     */
    jobType?: BatchJobType;
    /**
     * The batch job return code from either the Blu Age or Micro Focus runtime engines. For more information, see Batch return codes in the IBM WebSphere Application Server documentation.
     */
    returnCode?: String;
    /**
     * The timestamp when a particular batch job execution started.
     */
    startTime: Timestamp;
    /**
     * The status of a particular batch job execution.
     */
    status: BatchJobExecutionStatus;
  }
  export type BatchJobExecutionSummaryList = BatchJobExecutionSummary[];
  export interface BatchJobIdentifier {
    /**
     * Specifies a file associated with a specific batch job.
     */
    fileBatchJobIdentifier?: FileBatchJobIdentifier;
    /**
     * A batch job identifier in which the batch job to run is identified by the script name.
     */
    scriptBatchJobIdentifier?: ScriptBatchJobIdentifier;
  }
  export type BatchJobParametersMap = {[key: string]: BatchParamValue};
  export type BatchJobType = "VSE"|"JES2"|"JES3"|string;
  export type BatchParamKey = string;
  export type BatchParamValue = string;
  export type Boolean = boolean;
  export interface CancelBatchJobExecutionRequest {
    /**
     * The unique identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The unique identifier of the batch job execution.
     */
    executionId: Identifier;
  }
  export interface CancelBatchJobExecutionResponse {
  }
  export type CapacityValue = number;
  export interface CreateApplicationRequest {
    /**
     * Unique, case-sensitive identifier the service generates to ensure the idempotency of the request to create an application. The service generates the clientToken when the API call is triggered. The token expires after one hour, so if you retry the API within this timeframe with the same clientToken, you will get the same response. The service also handles deleting the clientToken after it expires. 
     */
    clientToken?: String;
    /**
     * The application definition for this application. You can specify either inline JSON or an S3 bucket location.
     */
    definition: Definition;
    /**
     * The description of the application.
     */
    description?: EntityDescription;
    /**
     * The type of the target platform for this application.
     */
    engineType: EngineType;
    /**
     * The identifier of a customer managed key.
     */
    kmsKeyId?: String;
    /**
     * The unique identifier of the application.
     */
    name: EntityName;
    /**
     * The Amazon Resource Name (ARN) that identifies a role that the application uses to access Amazon Web Services resources that are not part of the application or are in a different Amazon Web Services account.
     */
    roleArn?: Arn;
    /**
     * A list of tags to apply to the application.
     */
    tags?: TagMap;
  }
  export interface CreateApplicationResponse {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    applicationArn: Arn;
    /**
     * The unique application identifier.
     */
    applicationId: Identifier;
    /**
     * The version number of the application.
     */
    applicationVersion: Version;
  }
  export interface CreateDataSetImportTaskRequest {
    /**
     * The unique identifier of the application for which you want to import data sets.
     */
    applicationId: Identifier;
    /**
     *  Unique, case-sensitive identifier you provide to ensure the idempotency of the request to create a data set import. The service generates the clientToken when the API call is triggered. The token expires after one hour, so if you retry the API within this timeframe with the same clientToken, you will get the same response. The service also handles deleting the clientToken after it expires. 
     */
    clientToken?: String;
    /**
     * The data set import task configuration.
     */
    importConfig: DataSetImportConfig;
  }
  export interface CreateDataSetImportTaskResponse {
    /**
     * The task identifier. This operation is asynchronous. Use this identifier with the GetDataSetImportTask operation to obtain the status of this task.
     */
    taskId: Identifier;
  }
  export interface CreateDeploymentRequest {
    /**
     * The application identifier.
     */
    applicationId: Identifier;
    /**
     * The version of the application to deploy.
     */
    applicationVersion: Version;
    /**
     * Unique, case-sensitive identifier you provide to ensure the idempotency of the request to create a deployment. The service generates the clientToken when the API call is triggered. The token expires after one hour, so if you retry the API within this timeframe with the same clientToken, you will get the same response. The service also handles deleting the clientToken after it expires. 
     */
    clientToken?: String;
    /**
     * The identifier of the runtime environment where you want to deploy this application.
     */
    environmentId: Identifier;
  }
  export interface CreateDeploymentResponse {
    /**
     * The unique identifier of the deployment.
     */
    deploymentId: Identifier;
  }
  export interface CreateEnvironmentRequest {
    /**
     * Unique, case-sensitive identifier you provide to ensure the idempotency of the request to create an environment. The service generates the clientToken when the API call is triggered. The token expires after one hour, so if you retry the API within this timeframe with the same clientToken, you will get the same response. The service also handles deleting the clientToken after it expires. 
     */
    clientToken?: String;
    /**
     * The description of the runtime environment.
     */
    description?: EntityDescription;
    /**
     * The engine type for the runtime environment.
     */
    engineType: EngineType;
    /**
     * The version of the engine type for the runtime environment.
     */
    engineVersion?: EngineVersion;
    /**
     * The details of a high availability configuration for this runtime environment.
     */
    highAvailabilityConfig?: HighAvailabilityConfig;
    /**
     * The type of instance for the runtime environment.
     */
    instanceType: String20;
    /**
     * The identifier of a customer managed key.
     */
    kmsKeyId?: String;
    /**
     * The name of the runtime environment. Must be unique within the account.
     */
    name: EntityName;
    /**
     * Configures the maintenance window you want for the runtime environment. If you do not provide a value, a random system-generated value will be assigned.
     */
    preferredMaintenanceWindow?: String50;
    /**
     * Specifies whether the runtime environment is publicly accessible.
     */
    publiclyAccessible?: Boolean;
    /**
     * The list of security groups for the VPC associated with this runtime environment.
     */
    securityGroupIds?: String50List;
    /**
     * Optional. The storage configurations for this runtime environment.
     */
    storageConfigurations?: StorageConfigurationList;
    /**
     * The list of subnets associated with the VPC for this runtime environment.
     */
    subnetIds?: String50List;
    /**
     * The tags for the runtime environment.
     */
    tags?: TagMap;
  }
  export interface CreateEnvironmentResponse {
    /**
     * The unique identifier of the runtime environment.
     */
    environmentId: Identifier;
  }
  export interface DataSet {
    /**
     * The logical identifier for a specific data set (in mainframe format).
     */
    datasetName: String;
    /**
     * The type of dataset. The only supported value is VSAM.
     */
    datasetOrg: DatasetOrgAttributes;
    /**
     * The length of a record.
     */
    recordLength: RecordLength;
    /**
     * The relative location of the data set in the database or file system. 
     */
    relativePath?: String;
    /**
     * The storage type of the data set: database or file system. For Micro Focus, database corresponds to datastore and file system corresponds to EFS/FSX. For Blu Age, there is no support of file system and database corresponds to Blusam. 
     */
    storageType?: String;
  }
  export interface DataSetImportConfig {
    /**
     * The data sets.
     */
    dataSets?: DataSetImportList;
    /**
     * The Amazon S3 location of the data sets.
     */
    s3Location?: String2000;
  }
  export interface DataSetImportItem {
    /**
     * The data set.
     */
    dataSet: DataSet;
    /**
     * The location of the data set.
     */
    externalLocation: ExternalLocation;
  }
  export type DataSetImportList = DataSetImportItem[];
  export interface DataSetImportSummary {
    /**
     * The number of data set imports that have failed.
     */
    failed: Integer;
    /**
     * The number of data set imports that are in progress.
     */
    inProgress: Integer;
    /**
     * The number of data set imports that are pending.
     */
    pending: Integer;
    /**
     * The number of data set imports that have succeeded.
     */
    succeeded: Integer;
    /**
     * The total number of data set imports.
     */
    total: Integer;
  }
  export interface DataSetImportTask {
    /**
     * The status of the data set import task.
     */
    status: DataSetTaskLifecycle;
    /**
     * A summary of the data set import task.
     */
    summary: DataSetImportSummary;
    /**
     * The identifier of the data set import task.
     */
    taskId: Identifier;
  }
  export type DataSetImportTaskList = DataSetImportTask[];
  export interface DataSetSummary {
    /**
     * The timestamp when the data set was created.
     */
    creationTime?: Timestamp;
    /**
     * The name of the data set.
     */
    dataSetName: String200;
    /**
     * The type of data set. The only supported value is VSAM.
     */
    dataSetOrg?: String20;
    /**
     * The format of the data set. 
     */
    format?: String20;
    /**
     * The last time the data set was referenced.
     */
    lastReferencedTime?: Timestamp;
    /**
     * The last time the data set was updated.
     */
    lastUpdatedTime?: Timestamp;
  }
  export type DataSetTaskLifecycle = "Creating"|"Running"|"Completed"|string;
  export type DataSetsSummaryList = DataSetSummary[];
  export interface DatasetDetailOrgAttributes {
    /**
     * The generation data group of the data set.
     */
    gdg?: GdgDetailAttributes;
    /**
     * The details of a PO type data set.
     */
    po?: PoDetailAttributes;
    /**
     * The details of a PS type data set.
     */
    ps?: PsDetailAttributes;
    /**
     * The details of a VSAM data set.
     */
    vsam?: VsamDetailAttributes;
  }
  export interface DatasetOrgAttributes {
    /**
     * The generation data group of the data set.
     */
    gdg?: GdgAttributes;
    /**
     * The details of a PO type data set.
     */
    po?: PoAttributes;
    /**
     * The details of a PS type data set.
     */
    ps?: PsAttributes;
    /**
     * The details of a VSAM data set.
     */
    vsam?: VsamAttributes;
  }
  export interface Definition {
    /**
     * The content of the application definition. This is a JSON object that contains the resource configuration/definitions that identify an application.
     */
    content?: StringFree65000;
    /**
     * The S3 bucket that contains the application definition.
     */
    s3Location?: String2000;
  }
  export interface DeleteApplicationFromEnvironmentRequest {
    /**
     * The unique identifier of the application you want to delete.
     */
    applicationId: Identifier;
    /**
     * The unique identifier of the runtime environment where the application was previously deployed.
     */
    environmentId: Identifier;
  }
  export interface DeleteApplicationFromEnvironmentResponse {
  }
  export interface DeleteApplicationRequest {
    /**
     * The unique identifier of the application you want to delete.
     */
    applicationId: Identifier;
  }
  export interface DeleteApplicationResponse {
  }
  export interface DeleteEnvironmentRequest {
    /**
     * The unique identifier of the runtime environment you want to delete.
     */
    environmentId: Identifier;
  }
  export interface DeleteEnvironmentResponse {
  }
  export interface DeployedVersionSummary {
    /**
     * The version of the deployed application.
     */
    applicationVersion: Version;
    /**
     * The status of the deployment.
     */
    status: DeploymentLifecycle;
    /**
     * The reason for the reported status.
     */
    statusReason?: String;
  }
  export type DeploymentLifecycle = "Deploying"|"Succeeded"|"Failed"|string;
  export type DeploymentList = DeploymentSummary[];
  export interface DeploymentSummary {
    /**
     * The unique identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The version of the application.
     */
    applicationVersion: Version;
    /**
     * The timestamp when the deployment was created.
     */
    creationTime: Timestamp;
    /**
     * The unique identifier of the deployment.
     */
    deploymentId: Identifier;
    /**
     * The unique identifier of the runtime environment.
     */
    environmentId: Identifier;
    /**
     * The current status of the deployment.
     */
    status: DeploymentLifecycle;
    /**
     * The reason for the reported status.
     */
    statusReason?: String;
  }
  export interface EfsStorageConfiguration {
    /**
     * The file system identifier.
     */
    fileSystemId: String200;
    /**
     * The mount point for the file system.
     */
    mountPoint: String200;
  }
  export type EngineType = "microfocus"|"bluage"|string;
  export type EngineVersion = string;
  export interface EngineVersionsSummary {
    /**
     * The type of target platform for the application.
     */
    engineType: String;
    /**
     * The version of the engine type used by the application.
     */
    engineVersion: String;
  }
  export type EngineVersionsSummaryList = EngineVersionsSummary[];
  export type EntityDescription = string;
  export type EntityName = string;
  export type EntityNameList = EntityName[];
  export type EnvironmentLifecycle = "Creating"|"Available"|"Updating"|"Deleting"|"Failed"|string;
  export interface EnvironmentSummary {
    /**
     * The timestamp when the runtime environment was created.
     */
    creationTime: Timestamp;
    /**
     * The target platform for the runtime environment.
     */
    engineType: EngineType;
    /**
     * The version of the runtime engine.
     */
    engineVersion: EngineVersion;
    /**
     * The Amazon Resource Name (ARN) of a particular runtime environment.
     */
    environmentArn: Arn;
    /**
     * The unique identifier of a particular runtime environment.
     */
    environmentId: Identifier;
    /**
     * The instance type of the runtime environment.
     */
    instanceType: String20;
    /**
     * The name of the runtime environment.
     */
    name: EntityName;
    /**
     * The status of the runtime environment
     */
    status: EnvironmentLifecycle;
  }
  export type EnvironmentSummaryList = EnvironmentSummary[];
  export interface ExternalLocation {
    /**
     * The URI of the Amazon S3 bucket.
     */
    s3Location?: String2000;
  }
  export interface FileBatchJobDefinition {
    /**
     * The name of the file containing the batch job definition.
     */
    fileName: String;
    /**
     * The path to the file containing the batch job definition.
     */
    folderPath?: String;
  }
  export interface FileBatchJobIdentifier {
    /**
     * The file name for the batch job identifier.
     */
    fileName: String;
    /**
     * The relative path to the file name for the batch job identifier.
     */
    folderPath?: String;
  }
  export interface FsxStorageConfiguration {
    /**
     * The file system identifier.
     */
    fileSystemId: String200;
    /**
     * The mount point for the file system.
     */
    mountPoint: String200;
  }
  export interface GdgAttributes {
    /**
     * The maximum number of generation data sets, up to 255, in a GDG.
     */
    limit?: Integer;
    /**
     * The disposition of the data set in the catalog.
     */
    rollDisposition?: String;
  }
  export interface GdgDetailAttributes {
    /**
     * The maximum number of generation data sets, up to 255, in a GDG.
     */
    limit?: Integer;
    /**
     * The disposition of the data set in the catalog.
     */
    rollDisposition?: String50;
  }
  export interface GetApplicationRequest {
    /**
     * The identifier of the application.
     */
    applicationId: Identifier;
  }
  export interface GetApplicationResponse {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    applicationArn: Arn;
    /**
     * The identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The timestamp when this application was created.
     */
    creationTime: Timestamp;
    /**
     * The version of the application that is deployed.
     */
    deployedVersion?: DeployedVersionSummary;
    /**
     * The description of the application.
     */
    description?: EntityDescription;
    /**
     * The type of the target platform for the application.
     */
    engineType: EngineType;
    /**
     * The identifier of the runtime environment where you want to deploy the application.
     */
    environmentId?: Identifier;
    /**
     * The identifier of a customer managed key.
     */
    kmsKeyId?: String;
    /**
     * The timestamp when you last started the application. Null until the application runs for the first time.
     */
    lastStartTime?: Timestamp;
    /**
     * The latest version of the application.
     */
    latestVersion: ApplicationVersionSummary;
    /**
     * The Amazon Resource Name (ARN) for the network load balancer listener created in your Amazon Web Services account. Amazon Web Services Mainframe Modernization creates this listener for you the first time you deploy an application.
     */
    listenerArns?: ArnList;
    /**
     * The port associated with the network load balancer listener created in your Amazon Web Services account.
     */
    listenerPorts?: PortList;
    /**
     * The public DNS name of the load balancer created in your Amazon Web Services account.
     */
    loadBalancerDnsName?: String100;
    /**
     * The list of log summaries. Each log summary includes the log type as well as the log group identifier. These are CloudWatch logs. Amazon Web Services Mainframe Modernization pushes the application log to CloudWatch under the customer's account.
     */
    logGroups?: LogGroupSummaries;
    /**
     * The unique identifier of the application.
     */
    name: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the role associated with the application.
     */
    roleArn?: Arn;
    /**
     * The status of the application.
     */
    status: ApplicationLifecycle;
    /**
     * The reason for the reported status.
     */
    statusReason?: String;
    /**
     * A list of tags associated with the application.
     */
    tags?: TagMap;
    /**
     * Returns the Amazon Resource Names (ARNs) of the target groups that are attached to the network load balancer.
     */
    targetGroupArns?: ArnList;
  }
  export interface GetApplicationVersionRequest {
    /**
     * The unique identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The specific version of the application.
     */
    applicationVersion: Version;
  }
  export interface GetApplicationVersionResponse {
    /**
     * The specific version of the application.
     */
    applicationVersion: Version;
    /**
     * The timestamp when the application version was created.
     */
    creationTime: Timestamp;
    /**
     * The content of the application definition. This is a JSON object that contains the resource configuration and definitions that identify an application.
     */
    definitionContent: StringFree65000;
    /**
     * The application description.
     */
    description?: EntityDescription;
    /**
     * The name of the application version.
     */
    name: EntityName;
    /**
     * The status of the application version.
     */
    status: ApplicationVersionLifecycle;
    /**
     * The reason for the reported status.
     */
    statusReason?: String;
  }
  export interface GetBatchJobExecutionRequest {
    /**
     * The identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The unique identifier of the batch job execution.
     */
    executionId: Identifier;
  }
  export interface GetBatchJobExecutionResponse {
    /**
     * The identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The unique identifier of this batch job.
     */
    batchJobIdentifier?: BatchJobIdentifier;
    /**
     * The timestamp when the batch job execution ended.
     */
    endTime?: Timestamp;
    /**
     * The unique identifier for this batch job execution.
     */
    executionId: Identifier;
    /**
     * The unique identifier for this batch job.
     */
    jobId?: String100;
    /**
     * The name of this batch job.
     */
    jobName?: String100;
    /**
     * The type of job.
     */
    jobType?: BatchJobType;
    /**
     * The user for the job.
     */
    jobUser?: String100;
    /**
     * The batch job return code from either the Blu Age or Micro Focus runtime engines. For more information, see Batch return codes in the IBM WebSphere Application Server documentation.
     */
    returnCode?: String;
    /**
     * The timestamp when the batch job execution started.
     */
    startTime: Timestamp;
    /**
     * The status of the batch job execution.
     */
    status: BatchJobExecutionStatus;
    /**
     * The reason for the reported status.
     */
    statusReason?: String;
  }
  export interface GetDataSetDetailsRequest {
    /**
     * The unique identifier of the application that this data set is associated with.
     */
    applicationId: Identifier;
    /**
     * The name of the data set.
     */
    dataSetName: String200;
  }
  export interface GetDataSetDetailsResponse {
    /**
     * The size of the block on disk. 
     */
    blocksize?: Integer;
    /**
     * The timestamp when the data set was created.
     */
    creationTime?: Timestamp;
    /**
     * The name of the data set.
     */
    dataSetName: String200;
    /**
     * The type of data set. The only supported value is VSAM.
     */
    dataSetOrg?: DatasetDetailOrgAttributes;
    /**
     * The last time the data set was referenced.
     */
    lastReferencedTime?: Timestamp;
    /**
     * The last time the data set was updated.
     */
    lastUpdatedTime?: Timestamp;
    /**
     * The location where the data set is stored.
     */
    location?: String2000;
    /**
     * The length of records in the data set.
     */
    recordLength?: Integer;
  }
  export interface GetDataSetImportTaskRequest {
    /**
     * The application identifier.
     */
    applicationId: Identifier;
    /**
     * The task identifier returned by the CreateDataSetImportTask operation. 
     */
    taskId: Identifier;
  }
  export interface GetDataSetImportTaskResponse {
    /**
     * The status of the task.
     */
    status: DataSetTaskLifecycle;
    /**
     * A summary of the status of the task.
     */
    summary?: DataSetImportSummary;
    /**
     * The task identifier.
     */
    taskId: Identifier;
  }
  export interface GetDeploymentRequest {
    /**
     * The unique identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The unique identifier for the deployment.
     */
    deploymentId: Identifier;
  }
  export interface GetDeploymentResponse {
    /**
     * The unique identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The application version.
     */
    applicationVersion: Version;
    /**
     * The timestamp when the deployment was created.
     */
    creationTime: Timestamp;
    /**
     * The unique identifier of the deployment.
     */
    deploymentId: Identifier;
    /**
     * The unique identifier of the runtime environment.
     */
    environmentId: Identifier;
    /**
     * The status of the deployment.
     */
    status: DeploymentLifecycle;
    /**
     * The reason for the reported status.
     */
    statusReason?: String;
  }
  export interface GetEnvironmentRequest {
    /**
     * The unique identifier of the runtime environment.
     */
    environmentId: Identifier;
  }
  export interface GetEnvironmentResponse {
    /**
     * The number of instances included in the runtime environment. A standalone runtime environment has a maxiumum of one instance. Currently, a high availability runtime environment has a maximum of two instances. 
     */
    actualCapacity?: CapacityValue;
    /**
     * The timestamp when the runtime environment was created.
     */
    creationTime: Timestamp;
    /**
     * The description of the runtime environment.
     */
    description?: EntityDescription;
    /**
     * The target platform for the runtime environment.
     */
    engineType: EngineType;
    /**
     * The version of the runtime engine.
     */
    engineVersion: EngineVersion;
    /**
     * The Amazon Resource Name (ARN) of the runtime environment.
     */
    environmentArn: Arn;
    /**
     * The unique identifier of the runtime environment.
     */
    environmentId: Identifier;
    /**
     * The desired capacity of the high availability configuration for the runtime environment.
     */
    highAvailabilityConfig?: HighAvailabilityConfig;
    /**
     * The type of instance underlying the runtime environment.
     */
    instanceType: String20;
    /**
     * The identifier of a customer managed key.
     */
    kmsKeyId?: String;
    /**
     * The Amazon Resource Name (ARN) for the load balancer used with the runtime environment.
     */
    loadBalancerArn?: String;
    /**
     * The name of the runtime environment. Must be unique within the account.
     */
    name: EntityName;
    /**
     * Indicates the pending maintenance scheduled on this environment.
     */
    pendingMaintenance?: PendingMaintenance;
    /**
     * Configures the maintenance window you want for the runtime environment. If you do not provide a value, a random system-generated value will be assigned.
     */
    preferredMaintenanceWindow?: String50;
    /**
     * Whether applications running in this runtime environment are publicly accessible. 
     */
    publiclyAccessible?: Boolean;
    /**
     * The unique identifiers of the security groups assigned to this runtime environment.
     */
    securityGroupIds: String50List;
    /**
     * The status of the runtime environment.
     */
    status: EnvironmentLifecycle;
    /**
     * The reason for the reported status.
     */
    statusReason?: String;
    /**
     * The storage configurations defined for the runtime environment.
     */
    storageConfigurations?: StorageConfigurationList;
    /**
     * The unique identifiers of the subnets assigned to this runtime environment.
     */
    subnetIds: String50List;
    /**
     * The tags defined for this runtime environment.
     */
    tags?: TagMap;
    /**
     * The unique identifier for the VPC used with this runtime environment.
     */
    vpcId: String50;
  }
  export interface GetSignedBluinsightsUrlResponse {
    /**
     * Single sign-on AWS Blu Insights URL.
     */
    signedBiUrl: String;
  }
  export interface HighAvailabilityConfig {
    /**
     * The number of instances in a high availability configuration. The minimum possible value is 1 and the maximum is 100.
     */
    desiredCapacity: CapacityValue;
  }
  export type Identifier = string;
  export type IdentifierList = Identifier[];
  export type Integer = number;
  export interface ListApplicationVersionsRequest {
    /**
     * The unique identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The maximum number of application versions to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token returned from a previous call to this operation. This specifies the next item to return. To return to the beginning of the list, exclude this parameter.
     */
    nextToken?: NextToken;
  }
  export interface ListApplicationVersionsResponse {
    /**
     * The list of application versions.
     */
    applicationVersions: ApplicationVersionSummaryList;
    /**
     * If there are more items to return, this contains a token that is passed to a subsequent call to this operation to retrieve the next set of items.
     */
    nextToken?: NextToken;
  }
  export interface ListApplicationsRequest {
    /**
     * The unique identifier of the runtime environment where the applications are deployed.
     */
    environmentId?: Identifier;
    /**
     * The maximum number of applications to return.
     */
    maxResults?: MaxResults;
    /**
     * The names of the applications.
     */
    names?: EntityNameList;
    /**
     * A pagination token to control the number of applications displayed in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListApplicationsResponse {
    /**
     * Returns a list of summary details for all the applications in a runtime environment.
     */
    applications: ApplicationSummaryList;
    /**
     * A pagination token that's returned when the response doesn't contain all applications.
     */
    nextToken?: NextToken;
  }
  export interface ListBatchJobDefinitionsRequest {
    /**
     * The identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The maximum number of batch job definitions to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token returned from a previous call to this operation. This specifies the next item to return. To return to the beginning of the list, exclude this parameter.
     */
    nextToken?: NextToken;
    /**
     * If the batch job definition is a FileBatchJobDefinition, the prefix allows you to search on the file names of FileBatchJobDefinitions.
     */
    prefix?: String;
  }
  export interface ListBatchJobDefinitionsResponse {
    /**
     * The list of batch job definitions.
     */
    batchJobDefinitions: BatchJobDefinitions;
    /**
     * If there are more items to return, this contains a token that is passed to a subsequent call to this operation to retrieve the next set of items.
     */
    nextToken?: NextToken;
  }
  export interface ListBatchJobExecutionsRequest {
    /**
     * The unique identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The unique identifier of each batch job execution.
     */
    executionIds?: IdentifierList;
    /**
     * The name of each batch job execution.
     */
    jobName?: String100;
    /**
     * The maximum number of batch job executions to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token to control the number of batch job executions displayed in the list.
     */
    nextToken?: NextToken;
    /**
     * The time after which the batch job executions started.
     */
    startedAfter?: Timestamp;
    /**
     * The time before the batch job executions started.
     */
    startedBefore?: Timestamp;
    /**
     * The status of the batch job executions.
     */
    status?: BatchJobExecutionStatus;
  }
  export interface ListBatchJobExecutionsResponse {
    /**
     * Returns a list of batch job executions for an application.
     */
    batchJobExecutions: BatchJobExecutionSummaryList;
    /**
     * A pagination token that's returned when the response doesn't contain all batch job executions.
     */
    nextToken?: NextToken;
  }
  export interface ListDataSetImportHistoryRequest {
    /**
     * The unique identifier of the application.
     */
    applicationId: Identifier;
    /**
     * The maximum number of objects to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token returned from a previous call to this operation. This specifies the next item to return. To return to the beginning of the list, exclude this parameter.
     */
    nextToken?: NextToken;
  }
  export interface ListDataSetImportHistoryResponse {
    /**
     * The data set import tasks.
     */
    dataSetImportTasks: DataSetImportTaskList;
    /**
     * If there are more items to return, this contains a token that is passed to a subsequent call to this operation to retrieve the next set of items.
     */
    nextToken?: NextToken;
  }
  export interface ListDataSetsRequest {
    /**
     * The unique identifier of the application for which you want to list the associated data sets.
     */
    applicationId: Identifier;
    /**
     * The maximum number of objects to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token returned from a previous call to this operation. This specifies the next item to return. To return to the beginning of the list, exclude this parameter.
     */
    nextToken?: NextToken;
    /**
     * The prefix of the data set name, which you can use to filter the list of data sets.
     */
    prefix?: String200;
  }
  export interface ListDataSetsResponse {
    /**
     * The list of data sets, containing information including the creation time, the data set name, the data set organization, the data set format, and the last time the data set was referenced or updated.
     */
    dataSets: DataSetsSummaryList;
    /**
     * If there are more items to return, this contains a token that is passed to a subsequent call to this operation to retrieve the next set of items.
     */
    nextToken?: NextToken;
  }
  export interface ListDeploymentsRequest {
    /**
     * The application identifier.
     */
    applicationId: Identifier;
    /**
     * The maximum number of objects to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token returned from a previous call to this operation. This specifies the next item to return. To return to the beginning of the list, exclude this parameter.
     */
    nextToken?: NextToken;
  }
  export interface ListDeploymentsResponse {
    /**
     * The list of deployments that is returned.
     */
    deployments: DeploymentList;
    /**
     * If there are more items to return, this contains a token that is passed to a subsequent call to this operation to retrieve the next set of items.
     */
    nextToken?: NextToken;
  }
  export interface ListEngineVersionsRequest {
    /**
     * The type of target platform.
     */
    engineType?: EngineType;
    /**
     * The maximum number of objects to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token returned from a previous call to this operation. This specifies the next item to return. To return to the beginning of the list, exclude this parameter.
     */
    nextToken?: NextToken;
  }
  export interface ListEngineVersionsResponse {
    /**
     * Returns the engine versions.
     */
    engineVersions: EngineVersionsSummaryList;
    /**
     * If there are more items to return, this contains a token that is passed to a subsequent call to this operation to retrieve the next set of items.
     */
    nextToken?: NextToken;
  }
  export interface ListEnvironmentsRequest {
    /**
     * The engine type for the runtime environment.
     */
    engineType?: EngineType;
    /**
     * The maximum number of runtime environments to return.
     */
    maxResults?: MaxResults;
    /**
     * The names of the runtime environments. Must be unique within the account.
     */
    names?: EntityNameList;
    /**
     * A pagination token to control the number of runtime environments displayed in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListEnvironmentsResponse {
    /**
     * Returns a list of summary details for all the runtime environments in your account. 
     */
    environments: EnvironmentSummaryList;
    /**
     * A pagination token that's returned when the response doesn't contain all the runtime environments.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags for the resource.
     */
    tags: TagMap;
  }
  export type LogGroupIdentifier = string;
  export type LogGroupSummaries = LogGroupSummary[];
  export interface LogGroupSummary {
    /**
     * The name of the log group.
     */
    logGroupName: LogGroupIdentifier;
    /**
     * The type of log.
     */
    logType: String20;
  }
  export interface MaintenanceSchedule {
    /**
     * The time the scheduled maintenance is to end.
     */
    endTime?: Timestamp;
    /**
     * The time the scheduled maintenance is to start.
     */
    startTime?: Timestamp;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export interface PendingMaintenance {
    /**
     * The specific runtime engine that the maintenance schedule applies to.
     */
    engineVersion?: String;
    /**
     * The maintenance schedule for the runtime engine version.
     */
    schedule?: MaintenanceSchedule;
  }
  export interface PoAttributes {
    /**
     * The character set encoding of the data set.
     */
    encoding?: String;
    /**
     * The format of the data set records.
     */
    format: String;
    /**
     * An array containing one or more filename extensions, allowing you to specify which files to be included as PDS member.
     */
    memberFileExtensions: String20List;
  }
  export interface PoDetailAttributes {
    /**
     * The character set encoding of the data set.
     */
    encoding: String;
    /**
     * The format of the data set records.
     */
    format: String;
  }
  export type PortList = Integer[];
  export interface PrimaryKey {
    /**
     * A strictly positive integer value representing the length of the primary key. 
     */
    length: Integer;
    /**
     * A name for the Primary Key.
     */
    name?: String;
    /**
     * A positive integer value representing the offset to mark the start of the primary key in the record byte array.
     */
    offset: Integer;
  }
  export interface PsAttributes {
    /**
     * The character set encoding of the data set.
     */
    encoding?: String;
    /**
     * The format of the data set records.
     */
    format: String;
  }
  export interface PsDetailAttributes {
    /**
     * The character set encoding of the data set.
     */
    encoding: String;
    /**
     * The format of the data set records.
     */
    format: String;
  }
  export interface RecordLength {
    /**
     * The maximum record length. In case of fixed, both minimum and maximum are the same.
     */
    max: Integer;
    /**
     * The minimum record length of a record.
     */
    min: Integer;
  }
  export interface ScriptBatchJobDefinition {
    /**
     * The name of the script containing the batch job definition.
     */
    scriptName: String;
  }
  export interface ScriptBatchJobIdentifier {
    /**
     * The name of the script containing the batch job definition.
     */
    scriptName: String;
  }
  export interface StartApplicationRequest {
    /**
     * The unique identifier of the application you want to start.
     */
    applicationId: Identifier;
  }
  export interface StartApplicationResponse {
  }
  export interface StartBatchJobRequest {
    /**
     * The unique identifier of the application associated with this batch job.
     */
    applicationId: Identifier;
    /**
     * The unique identifier of the batch job.
     */
    batchJobIdentifier: BatchJobIdentifier;
    /**
     * The collection of batch job parameters. For details about limits for keys and values, see Coding variables in JCL.
     */
    jobParams?: BatchJobParametersMap;
  }
  export interface StartBatchJobResponse {
    /**
     * The unique identifier of this execution of the batch job.
     */
    executionId: Identifier;
  }
  export interface StopApplicationRequest {
    /**
     * The unique identifier of the application you want to stop.
     */
    applicationId: Identifier;
    /**
     * Stopping an application process can take a long time. Setting this parameter to true lets you force stop the application so you don't need to wait until the process finishes to apply another action on the application. The default value is false.
     */
    forceStop?: Boolean;
  }
  export interface StopApplicationResponse {
  }
  export interface StorageConfiguration {
    /**
     * Defines the storage configuration for an Amazon EFS file system.
     */
    efs?: EfsStorageConfiguration;
    /**
     * Defines the storage configuration for an Amazon FSx file system.
     */
    fsx?: FsxStorageConfiguration;
  }
  export type StorageConfigurationList = StorageConfiguration[];
  export type String = string;
  export type String100 = string;
  export type String20 = string;
  export type String200 = string;
  export type String2000 = string;
  export type String20List = String20[];
  export type String50 = string;
  export type String50List = String50[];
  export type StringFree65000 = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: Arn;
    /**
     * The tags to add to the resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: Arn;
    /**
     * The keys of the tags to remove.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateApplicationRequest {
    /**
     * The unique identifier of the application you want to update.
     */
    applicationId: Identifier;
    /**
     * The current version of the application to update.
     */
    currentApplicationVersion: Version;
    /**
     * The application definition for this application. You can specify either inline JSON or an S3 bucket location.
     */
    definition?: Definition;
    /**
     * The description of the application to update.
     */
    description?: EntityDescription;
  }
  export interface UpdateApplicationResponse {
    /**
     * The new version of the application.
     */
    applicationVersion: Version;
  }
  export interface UpdateEnvironmentRequest {
    /**
     * Indicates whether to update the runtime environment during the maintenance window. The default is false. Currently, Amazon Web Services Mainframe Modernization accepts the engineVersion parameter only if applyDuringMaintenanceWindow is true. If any parameter other than engineVersion is provided in UpdateEnvironmentRequest, it will fail if applyDuringMaintenanceWindow is set to true.
     */
    applyDuringMaintenanceWindow?: Boolean;
    /**
     * The desired capacity for the runtime environment to update. The minimum possible value is 0 and the maximum is 100.
     */
    desiredCapacity?: CapacityValue;
    /**
     * The version of the runtime engine for the runtime environment.
     */
    engineVersion?: EngineVersion;
    /**
     * The unique identifier of the runtime environment that you want to update.
     */
    environmentId: Identifier;
    /**
     * The instance type for the runtime environment to update.
     */
    instanceType?: String20;
    /**
     * Configures the maintenance window you want for the runtime environment. If you do not provide a value, a random system-generated value will be assigned.
     */
    preferredMaintenanceWindow?: String;
  }
  export interface UpdateEnvironmentResponse {
    /**
     * The unique identifier of the runtime environment that was updated.
     */
    environmentId: Identifier;
  }
  export type Version = number;
  export interface VsamAttributes {
    /**
     * The alternate key definitions, if any. A legacy dataset might not have any alternate key defined, but if those alternate keys definitions exist, provide them as some applications will make use of them.
     */
    alternateKeys?: AlternateKeyList;
    /**
     * Indicates whether indexes for this dataset are stored as compressed values. If you have a large data set (typically &gt; 100 Mb), consider setting this flag to True.
     */
    compressed?: Boolean;
    /**
     * The character set used by the data set. Can be ASCII, EBCDIC, or unknown.
     */
    encoding?: String;
    /**
     * The record format of the data set.
     */
    format: String;
    /**
     * The primary key of the data set.
     */
    primaryKey?: PrimaryKey;
  }
  export interface VsamDetailAttributes {
    /**
     * The alternate key definitions, if any. A legacy dataset might not have any alternate key defined, but if those alternate keys definitions exist, provide them as some applications will make use of them.
     */
    alternateKeys?: AlternateKeyList;
    /**
     * If set to True, enforces loading the data set into cache before it’s used by the application.
     */
    cacheAtStartup?: Boolean;
    /**
     * Indicates whether indexes for this dataset are stored as compressed values. If you have a large data set (typically &gt; 100 Mb), consider setting this flag to True.
     */
    compressed?: Boolean;
    /**
     * The character set used by the data set. Can be ASCII, EBCDIC, or unknown.
     */
    encoding?: String20;
    /**
     * The primary key of the data set.
     */
    primaryKey?: PrimaryKey;
    /**
     * The record format of the data set.
     */
    recordFormat?: String20;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-04-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the M2 client.
   */
  export import Types = M2;
}
export = M2;
