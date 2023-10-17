import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class DataBrew extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: DataBrew.Types.ClientConfiguration)
  config: Config & DataBrew.Types.ClientConfiguration;
  /**
   * Deletes one or more versions of a recipe at a time. The entire request will be rejected if:   The recipe does not exist.   There is an invalid version identifier in the list of versions.   The version list is empty.   The version list size exceeds 50.   The version list contains duplicate entries.   The request will complete successfully, but with partial failures, if:   A version does not exist.   A version is being used by a job.   You specify LATEST_WORKING, but it's being used by a project.   The version fails to be deleted.   The LATEST_WORKING version will only be deleted if the recipe has no other versions. If you try to delete LATEST_WORKING while other versions exist (or if they can't be deleted), then LATEST_WORKING will be listed as partial failure in the response.
   */
  batchDeleteRecipeVersion(params: DataBrew.Types.BatchDeleteRecipeVersionRequest, callback?: (err: AWSError, data: DataBrew.Types.BatchDeleteRecipeVersionResponse) => void): Request<DataBrew.Types.BatchDeleteRecipeVersionResponse, AWSError>;
  /**
   * Deletes one or more versions of a recipe at a time. The entire request will be rejected if:   The recipe does not exist.   There is an invalid version identifier in the list of versions.   The version list is empty.   The version list size exceeds 50.   The version list contains duplicate entries.   The request will complete successfully, but with partial failures, if:   A version does not exist.   A version is being used by a job.   You specify LATEST_WORKING, but it's being used by a project.   The version fails to be deleted.   The LATEST_WORKING version will only be deleted if the recipe has no other versions. If you try to delete LATEST_WORKING while other versions exist (or if they can't be deleted), then LATEST_WORKING will be listed as partial failure in the response.
   */
  batchDeleteRecipeVersion(callback?: (err: AWSError, data: DataBrew.Types.BatchDeleteRecipeVersionResponse) => void): Request<DataBrew.Types.BatchDeleteRecipeVersionResponse, AWSError>;
  /**
   * Creates a new DataBrew dataset.
   */
  createDataset(params: DataBrew.Types.CreateDatasetRequest, callback?: (err: AWSError, data: DataBrew.Types.CreateDatasetResponse) => void): Request<DataBrew.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates a new DataBrew dataset.
   */
  createDataset(callback?: (err: AWSError, data: DataBrew.Types.CreateDatasetResponse) => void): Request<DataBrew.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates a new job to analyze a dataset and create its data profile.
   */
  createProfileJob(params: DataBrew.Types.CreateProfileJobRequest, callback?: (err: AWSError, data: DataBrew.Types.CreateProfileJobResponse) => void): Request<DataBrew.Types.CreateProfileJobResponse, AWSError>;
  /**
   * Creates a new job to analyze a dataset and create its data profile.
   */
  createProfileJob(callback?: (err: AWSError, data: DataBrew.Types.CreateProfileJobResponse) => void): Request<DataBrew.Types.CreateProfileJobResponse, AWSError>;
  /**
   * Creates a new DataBrew project.
   */
  createProject(params: DataBrew.Types.CreateProjectRequest, callback?: (err: AWSError, data: DataBrew.Types.CreateProjectResponse) => void): Request<DataBrew.Types.CreateProjectResponse, AWSError>;
  /**
   * Creates a new DataBrew project.
   */
  createProject(callback?: (err: AWSError, data: DataBrew.Types.CreateProjectResponse) => void): Request<DataBrew.Types.CreateProjectResponse, AWSError>;
  /**
   * Creates a new DataBrew recipe.
   */
  createRecipe(params: DataBrew.Types.CreateRecipeRequest, callback?: (err: AWSError, data: DataBrew.Types.CreateRecipeResponse) => void): Request<DataBrew.Types.CreateRecipeResponse, AWSError>;
  /**
   * Creates a new DataBrew recipe.
   */
  createRecipe(callback?: (err: AWSError, data: DataBrew.Types.CreateRecipeResponse) => void): Request<DataBrew.Types.CreateRecipeResponse, AWSError>;
  /**
   * Creates a new job to transform input data, using steps defined in an existing Glue DataBrew recipe
   */
  createRecipeJob(params: DataBrew.Types.CreateRecipeJobRequest, callback?: (err: AWSError, data: DataBrew.Types.CreateRecipeJobResponse) => void): Request<DataBrew.Types.CreateRecipeJobResponse, AWSError>;
  /**
   * Creates a new job to transform input data, using steps defined in an existing Glue DataBrew recipe
   */
  createRecipeJob(callback?: (err: AWSError, data: DataBrew.Types.CreateRecipeJobResponse) => void): Request<DataBrew.Types.CreateRecipeJobResponse, AWSError>;
  /**
   * Creates a new schedule for one or more DataBrew jobs. Jobs can be run at a specific date and time, or at regular intervals.
   */
  createSchedule(params: DataBrew.Types.CreateScheduleRequest, callback?: (err: AWSError, data: DataBrew.Types.CreateScheduleResponse) => void): Request<DataBrew.Types.CreateScheduleResponse, AWSError>;
  /**
   * Creates a new schedule for one or more DataBrew jobs. Jobs can be run at a specific date and time, or at regular intervals.
   */
  createSchedule(callback?: (err: AWSError, data: DataBrew.Types.CreateScheduleResponse) => void): Request<DataBrew.Types.CreateScheduleResponse, AWSError>;
  /**
   * Deletes a dataset from DataBrew.
   */
  deleteDataset(params: DataBrew.Types.DeleteDatasetRequest, callback?: (err: AWSError, data: DataBrew.Types.DeleteDatasetResponse) => void): Request<DataBrew.Types.DeleteDatasetResponse, AWSError>;
  /**
   * Deletes a dataset from DataBrew.
   */
  deleteDataset(callback?: (err: AWSError, data: DataBrew.Types.DeleteDatasetResponse) => void): Request<DataBrew.Types.DeleteDatasetResponse, AWSError>;
  /**
   * Deletes the specified DataBrew job.
   */
  deleteJob(params: DataBrew.Types.DeleteJobRequest, callback?: (err: AWSError, data: DataBrew.Types.DeleteJobResponse) => void): Request<DataBrew.Types.DeleteJobResponse, AWSError>;
  /**
   * Deletes the specified DataBrew job.
   */
  deleteJob(callback?: (err: AWSError, data: DataBrew.Types.DeleteJobResponse) => void): Request<DataBrew.Types.DeleteJobResponse, AWSError>;
  /**
   * Deletes an existing DataBrew project.
   */
  deleteProject(params: DataBrew.Types.DeleteProjectRequest, callback?: (err: AWSError, data: DataBrew.Types.DeleteProjectResponse) => void): Request<DataBrew.Types.DeleteProjectResponse, AWSError>;
  /**
   * Deletes an existing DataBrew project.
   */
  deleteProject(callback?: (err: AWSError, data: DataBrew.Types.DeleteProjectResponse) => void): Request<DataBrew.Types.DeleteProjectResponse, AWSError>;
  /**
   * Deletes a single version of a DataBrew recipe.
   */
  deleteRecipeVersion(params: DataBrew.Types.DeleteRecipeVersionRequest, callback?: (err: AWSError, data: DataBrew.Types.DeleteRecipeVersionResponse) => void): Request<DataBrew.Types.DeleteRecipeVersionResponse, AWSError>;
  /**
   * Deletes a single version of a DataBrew recipe.
   */
  deleteRecipeVersion(callback?: (err: AWSError, data: DataBrew.Types.DeleteRecipeVersionResponse) => void): Request<DataBrew.Types.DeleteRecipeVersionResponse, AWSError>;
  /**
   * Deletes the specified DataBrew schedule.
   */
  deleteSchedule(params: DataBrew.Types.DeleteScheduleRequest, callback?: (err: AWSError, data: DataBrew.Types.DeleteScheduleResponse) => void): Request<DataBrew.Types.DeleteScheduleResponse, AWSError>;
  /**
   * Deletes the specified DataBrew schedule.
   */
  deleteSchedule(callback?: (err: AWSError, data: DataBrew.Types.DeleteScheduleResponse) => void): Request<DataBrew.Types.DeleteScheduleResponse, AWSError>;
  /**
   * Returns the definition of a specific DataBrew dataset.
   */
  describeDataset(params: DataBrew.Types.DescribeDatasetRequest, callback?: (err: AWSError, data: DataBrew.Types.DescribeDatasetResponse) => void): Request<DataBrew.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Returns the definition of a specific DataBrew dataset.
   */
  describeDataset(callback?: (err: AWSError, data: DataBrew.Types.DescribeDatasetResponse) => void): Request<DataBrew.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Returns the definition of a specific DataBrew job.
   */
  describeJob(params: DataBrew.Types.DescribeJobRequest, callback?: (err: AWSError, data: DataBrew.Types.DescribeJobResponse) => void): Request<DataBrew.Types.DescribeJobResponse, AWSError>;
  /**
   * Returns the definition of a specific DataBrew job.
   */
  describeJob(callback?: (err: AWSError, data: DataBrew.Types.DescribeJobResponse) => void): Request<DataBrew.Types.DescribeJobResponse, AWSError>;
  /**
   * Represents one run of a DataBrew job.
   */
  describeJobRun(params: DataBrew.Types.DescribeJobRunRequest, callback?: (err: AWSError, data: DataBrew.Types.DescribeJobRunResponse) => void): Request<DataBrew.Types.DescribeJobRunResponse, AWSError>;
  /**
   * Represents one run of a DataBrew job.
   */
  describeJobRun(callback?: (err: AWSError, data: DataBrew.Types.DescribeJobRunResponse) => void): Request<DataBrew.Types.DescribeJobRunResponse, AWSError>;
  /**
   * Returns the definition of a specific DataBrew project.
   */
  describeProject(params: DataBrew.Types.DescribeProjectRequest, callback?: (err: AWSError, data: DataBrew.Types.DescribeProjectResponse) => void): Request<DataBrew.Types.DescribeProjectResponse, AWSError>;
  /**
   * Returns the definition of a specific DataBrew project.
   */
  describeProject(callback?: (err: AWSError, data: DataBrew.Types.DescribeProjectResponse) => void): Request<DataBrew.Types.DescribeProjectResponse, AWSError>;
  /**
   * Returns the definition of a specific DataBrew recipe corresponding to a particular version.
   */
  describeRecipe(params: DataBrew.Types.DescribeRecipeRequest, callback?: (err: AWSError, data: DataBrew.Types.DescribeRecipeResponse) => void): Request<DataBrew.Types.DescribeRecipeResponse, AWSError>;
  /**
   * Returns the definition of a specific DataBrew recipe corresponding to a particular version.
   */
  describeRecipe(callback?: (err: AWSError, data: DataBrew.Types.DescribeRecipeResponse) => void): Request<DataBrew.Types.DescribeRecipeResponse, AWSError>;
  /**
   * Returns the definition of a specific DataBrew schedule.
   */
  describeSchedule(params: DataBrew.Types.DescribeScheduleRequest, callback?: (err: AWSError, data: DataBrew.Types.DescribeScheduleResponse) => void): Request<DataBrew.Types.DescribeScheduleResponse, AWSError>;
  /**
   * Returns the definition of a specific DataBrew schedule.
   */
  describeSchedule(callback?: (err: AWSError, data: DataBrew.Types.DescribeScheduleResponse) => void): Request<DataBrew.Types.DescribeScheduleResponse, AWSError>;
  /**
   * Lists all of the DataBrew datasets.
   */
  listDatasets(params: DataBrew.Types.ListDatasetsRequest, callback?: (err: AWSError, data: DataBrew.Types.ListDatasetsResponse) => void): Request<DataBrew.Types.ListDatasetsResponse, AWSError>;
  /**
   * Lists all of the DataBrew datasets.
   */
  listDatasets(callback?: (err: AWSError, data: DataBrew.Types.ListDatasetsResponse) => void): Request<DataBrew.Types.ListDatasetsResponse, AWSError>;
  /**
   * Lists all of the previous runs of a particular DataBrew job.
   */
  listJobRuns(params: DataBrew.Types.ListJobRunsRequest, callback?: (err: AWSError, data: DataBrew.Types.ListJobRunsResponse) => void): Request<DataBrew.Types.ListJobRunsResponse, AWSError>;
  /**
   * Lists all of the previous runs of a particular DataBrew job.
   */
  listJobRuns(callback?: (err: AWSError, data: DataBrew.Types.ListJobRunsResponse) => void): Request<DataBrew.Types.ListJobRunsResponse, AWSError>;
  /**
   * Lists all of the DataBrew jobs that are defined.
   */
  listJobs(params: DataBrew.Types.ListJobsRequest, callback?: (err: AWSError, data: DataBrew.Types.ListJobsResponse) => void): Request<DataBrew.Types.ListJobsResponse, AWSError>;
  /**
   * Lists all of the DataBrew jobs that are defined.
   */
  listJobs(callback?: (err: AWSError, data: DataBrew.Types.ListJobsResponse) => void): Request<DataBrew.Types.ListJobsResponse, AWSError>;
  /**
   * Lists all of the DataBrew projects that are defined.
   */
  listProjects(params: DataBrew.Types.ListProjectsRequest, callback?: (err: AWSError, data: DataBrew.Types.ListProjectsResponse) => void): Request<DataBrew.Types.ListProjectsResponse, AWSError>;
  /**
   * Lists all of the DataBrew projects that are defined.
   */
  listProjects(callback?: (err: AWSError, data: DataBrew.Types.ListProjectsResponse) => void): Request<DataBrew.Types.ListProjectsResponse, AWSError>;
  /**
   * Lists the versions of a particular DataBrew recipe, except for LATEST_WORKING.
   */
  listRecipeVersions(params: DataBrew.Types.ListRecipeVersionsRequest, callback?: (err: AWSError, data: DataBrew.Types.ListRecipeVersionsResponse) => void): Request<DataBrew.Types.ListRecipeVersionsResponse, AWSError>;
  /**
   * Lists the versions of a particular DataBrew recipe, except for LATEST_WORKING.
   */
  listRecipeVersions(callback?: (err: AWSError, data: DataBrew.Types.ListRecipeVersionsResponse) => void): Request<DataBrew.Types.ListRecipeVersionsResponse, AWSError>;
  /**
   * Lists all of the DataBrew recipes that are defined.
   */
  listRecipes(params: DataBrew.Types.ListRecipesRequest, callback?: (err: AWSError, data: DataBrew.Types.ListRecipesResponse) => void): Request<DataBrew.Types.ListRecipesResponse, AWSError>;
  /**
   * Lists all of the DataBrew recipes that are defined.
   */
  listRecipes(callback?: (err: AWSError, data: DataBrew.Types.ListRecipesResponse) => void): Request<DataBrew.Types.ListRecipesResponse, AWSError>;
  /**
   * Lists the DataBrew schedules that are defined.
   */
  listSchedules(params: DataBrew.Types.ListSchedulesRequest, callback?: (err: AWSError, data: DataBrew.Types.ListSchedulesResponse) => void): Request<DataBrew.Types.ListSchedulesResponse, AWSError>;
  /**
   * Lists the DataBrew schedules that are defined.
   */
  listSchedules(callback?: (err: AWSError, data: DataBrew.Types.ListSchedulesResponse) => void): Request<DataBrew.Types.ListSchedulesResponse, AWSError>;
  /**
   * Lists all the tags for a DataBrew resource. 
   */
  listTagsForResource(params: DataBrew.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: DataBrew.Types.ListTagsForResourceResponse) => void): Request<DataBrew.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all the tags for a DataBrew resource. 
   */
  listTagsForResource(callback?: (err: AWSError, data: DataBrew.Types.ListTagsForResourceResponse) => void): Request<DataBrew.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Publishes a new version of a DataBrew recipe.
   */
  publishRecipe(params: DataBrew.Types.PublishRecipeRequest, callback?: (err: AWSError, data: DataBrew.Types.PublishRecipeResponse) => void): Request<DataBrew.Types.PublishRecipeResponse, AWSError>;
  /**
   * Publishes a new version of a DataBrew recipe.
   */
  publishRecipe(callback?: (err: AWSError, data: DataBrew.Types.PublishRecipeResponse) => void): Request<DataBrew.Types.PublishRecipeResponse, AWSError>;
  /**
   * Performs a recipe step within an interactive DataBrew session that's currently open.
   */
  sendProjectSessionAction(params: DataBrew.Types.SendProjectSessionActionRequest, callback?: (err: AWSError, data: DataBrew.Types.SendProjectSessionActionResponse) => void): Request<DataBrew.Types.SendProjectSessionActionResponse, AWSError>;
  /**
   * Performs a recipe step within an interactive DataBrew session that's currently open.
   */
  sendProjectSessionAction(callback?: (err: AWSError, data: DataBrew.Types.SendProjectSessionActionResponse) => void): Request<DataBrew.Types.SendProjectSessionActionResponse, AWSError>;
  /**
   * Runs a DataBrew job.
   */
  startJobRun(params: DataBrew.Types.StartJobRunRequest, callback?: (err: AWSError, data: DataBrew.Types.StartJobRunResponse) => void): Request<DataBrew.Types.StartJobRunResponse, AWSError>;
  /**
   * Runs a DataBrew job.
   */
  startJobRun(callback?: (err: AWSError, data: DataBrew.Types.StartJobRunResponse) => void): Request<DataBrew.Types.StartJobRunResponse, AWSError>;
  /**
   * Creates an interactive session, enabling you to manipulate data in a DataBrew project.
   */
  startProjectSession(params: DataBrew.Types.StartProjectSessionRequest, callback?: (err: AWSError, data: DataBrew.Types.StartProjectSessionResponse) => void): Request<DataBrew.Types.StartProjectSessionResponse, AWSError>;
  /**
   * Creates an interactive session, enabling you to manipulate data in a DataBrew project.
   */
  startProjectSession(callback?: (err: AWSError, data: DataBrew.Types.StartProjectSessionResponse) => void): Request<DataBrew.Types.StartProjectSessionResponse, AWSError>;
  /**
   * Stops a particular run of a job.
   */
  stopJobRun(params: DataBrew.Types.StopJobRunRequest, callback?: (err: AWSError, data: DataBrew.Types.StopJobRunResponse) => void): Request<DataBrew.Types.StopJobRunResponse, AWSError>;
  /**
   * Stops a particular run of a job.
   */
  stopJobRun(callback?: (err: AWSError, data: DataBrew.Types.StopJobRunResponse) => void): Request<DataBrew.Types.StopJobRunResponse, AWSError>;
  /**
   * Adds metadata tags to a DataBrew resource, such as a dataset, project, recipe, job, or schedule.
   */
  tagResource(params: DataBrew.Types.TagResourceRequest, callback?: (err: AWSError, data: DataBrew.Types.TagResourceResponse) => void): Request<DataBrew.Types.TagResourceResponse, AWSError>;
  /**
   * Adds metadata tags to a DataBrew resource, such as a dataset, project, recipe, job, or schedule.
   */
  tagResource(callback?: (err: AWSError, data: DataBrew.Types.TagResourceResponse) => void): Request<DataBrew.Types.TagResourceResponse, AWSError>;
  /**
   * Removes metadata tags from a DataBrew resource.
   */
  untagResource(params: DataBrew.Types.UntagResourceRequest, callback?: (err: AWSError, data: DataBrew.Types.UntagResourceResponse) => void): Request<DataBrew.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes metadata tags from a DataBrew resource.
   */
  untagResource(callback?: (err: AWSError, data: DataBrew.Types.UntagResourceResponse) => void): Request<DataBrew.Types.UntagResourceResponse, AWSError>;
  /**
   * Modifies the definition of an existing DataBrew dataset.
   */
  updateDataset(params: DataBrew.Types.UpdateDatasetRequest, callback?: (err: AWSError, data: DataBrew.Types.UpdateDatasetResponse) => void): Request<DataBrew.Types.UpdateDatasetResponse, AWSError>;
  /**
   * Modifies the definition of an existing DataBrew dataset.
   */
  updateDataset(callback?: (err: AWSError, data: DataBrew.Types.UpdateDatasetResponse) => void): Request<DataBrew.Types.UpdateDatasetResponse, AWSError>;
  /**
   * Modifies the definition of an existing profile job.
   */
  updateProfileJob(params: DataBrew.Types.UpdateProfileJobRequest, callback?: (err: AWSError, data: DataBrew.Types.UpdateProfileJobResponse) => void): Request<DataBrew.Types.UpdateProfileJobResponse, AWSError>;
  /**
   * Modifies the definition of an existing profile job.
   */
  updateProfileJob(callback?: (err: AWSError, data: DataBrew.Types.UpdateProfileJobResponse) => void): Request<DataBrew.Types.UpdateProfileJobResponse, AWSError>;
  /**
   * Modifies the definition of an existing DataBrew project.
   */
  updateProject(params: DataBrew.Types.UpdateProjectRequest, callback?: (err: AWSError, data: DataBrew.Types.UpdateProjectResponse) => void): Request<DataBrew.Types.UpdateProjectResponse, AWSError>;
  /**
   * Modifies the definition of an existing DataBrew project.
   */
  updateProject(callback?: (err: AWSError, data: DataBrew.Types.UpdateProjectResponse) => void): Request<DataBrew.Types.UpdateProjectResponse, AWSError>;
  /**
   * Modifies the definition of the LATEST_WORKING version of a DataBrew recipe.
   */
  updateRecipe(params: DataBrew.Types.UpdateRecipeRequest, callback?: (err: AWSError, data: DataBrew.Types.UpdateRecipeResponse) => void): Request<DataBrew.Types.UpdateRecipeResponse, AWSError>;
  /**
   * Modifies the definition of the LATEST_WORKING version of a DataBrew recipe.
   */
  updateRecipe(callback?: (err: AWSError, data: DataBrew.Types.UpdateRecipeResponse) => void): Request<DataBrew.Types.UpdateRecipeResponse, AWSError>;
  /**
   * Modifies the definition of an existing DataBrew recipe job.
   */
  updateRecipeJob(params: DataBrew.Types.UpdateRecipeJobRequest, callback?: (err: AWSError, data: DataBrew.Types.UpdateRecipeJobResponse) => void): Request<DataBrew.Types.UpdateRecipeJobResponse, AWSError>;
  /**
   * Modifies the definition of an existing DataBrew recipe job.
   */
  updateRecipeJob(callback?: (err: AWSError, data: DataBrew.Types.UpdateRecipeJobResponse) => void): Request<DataBrew.Types.UpdateRecipeJobResponse, AWSError>;
  /**
   * Modifies the definition of an existing DataBrew schedule.
   */
  updateSchedule(params: DataBrew.Types.UpdateScheduleRequest, callback?: (err: AWSError, data: DataBrew.Types.UpdateScheduleResponse) => void): Request<DataBrew.Types.UpdateScheduleResponse, AWSError>;
  /**
   * Modifies the definition of an existing DataBrew schedule.
   */
  updateSchedule(callback?: (err: AWSError, data: DataBrew.Types.UpdateScheduleResponse) => void): Request<DataBrew.Types.UpdateScheduleResponse, AWSError>;
}
declare namespace DataBrew {
  export type AccountId = string;
  export type ActionId = number;
  export type Arn = string;
  export type AssumeControl = boolean;
  export type Attempt = number;
  export interface BatchDeleteRecipeVersionRequest {
    /**
     * The name of the recipe whose versions are to be deleted.
     */
    Name: RecipeName;
    /**
     * An array of version identifiers, for the recipe versions to be deleted. You can specify numeric versions (X.Y) or LATEST_WORKING. LATEST_PUBLISHED is not supported.
     */
    RecipeVersions: RecipeVersionList;
  }
  export interface BatchDeleteRecipeVersionResponse {
    /**
     * The name of the recipe that was modified.
     */
    Name: RecipeName;
    /**
     * Errors, if any, that occurred while attempting to delete the recipe versions.
     */
    Errors?: RecipeErrorList;
  }
  export type Bucket = string;
  export type CatalogId = string;
  export type ClientSessionId = string;
  export type ColumnName = string;
  export type ColumnNameList = ColumnName[];
  export type ColumnRange = number;
  export interface ColumnSelector {
    /**
     * A regular expression for selecting a column from a dataset.
     */
    Regex?: ColumnName;
    /**
     * The name of a column from a dataset.
     */
    Name?: ColumnName;
  }
  export type ColumnSelectorList = ColumnSelector[];
  export interface ColumnStatisticsConfiguration {
    /**
     * List of column selectors. Selectors can be used to select columns from the dataset. When selectors are undefined, configuration will be applied to all supported columns. 
     */
    Selectors?: ColumnSelectorList;
    /**
     * Configuration for evaluations. Statistics can be used to select evaluations and override parameters of evaluations. 
     */
    Statistics: StatisticsConfiguration;
  }
  export type ColumnStatisticsConfigurationList = ColumnStatisticsConfiguration[];
  export type CompressionFormat = "GZIP"|"LZ4"|"SNAPPY"|"BZIP2"|"DEFLATE"|"LZO"|"BROTLI"|"ZSTD"|"ZLIB"|string;
  export type Condition = string;
  export interface ConditionExpression {
    /**
     * A specific condition to apply to a recipe action. For more information, see Recipe structure in the Glue DataBrew Developer Guide.
     */
    Condition: Condition;
    /**
     * A value that the condition must evaluate to for the condition to succeed.
     */
    Value?: ConditionValue;
    /**
     * A column to apply this condition to.
     */
    TargetColumn: TargetColumn;
  }
  export type ConditionExpressionList = ConditionExpression[];
  export type ConditionValue = string;
  export type CreateColumn = boolean;
  export interface CreateDatasetRequest {
    /**
     * The name of the dataset to be created. Valid characters are alphanumeric (A-Z, a-z, 0-9), hyphen (-), period (.), and space.
     */
    Name: DatasetName;
    /**
     * The file format of a dataset that is created from an Amazon S3 file or folder.
     */
    Format?: InputFormat;
    FormatOptions?: FormatOptions;
    Input: Input;
    /**
     * A set of options that defines how DataBrew interprets an Amazon S3 path of the dataset.
     */
    PathOptions?: PathOptions;
    /**
     * Metadata tags to apply to this dataset.
     */
    Tags?: TagMap;
  }
  export interface CreateDatasetResponse {
    /**
     * The name of the dataset that you created.
     */
    Name: DatasetName;
  }
  export interface CreateProfileJobRequest {
    /**
     * The name of the dataset that this job is to act upon.
     */
    DatasetName: DatasetName;
    /**
     * The Amazon Resource Name (ARN) of an encryption key that is used to protect the job.
     */
    EncryptionKeyArn?: EncryptionKeyArn;
    /**
     * The encryption mode for the job, which can be one of the following:    SSE-KMS - SSE-KMS - Server-side encryption with KMS-managed keys.    SSE-S3 - Server-side encryption with keys managed by Amazon S3.  
     */
    EncryptionMode?: EncryptionMode;
    /**
     * The name of the job to be created. Valid characters are alphanumeric (A-Z, a-z, 0-9), hyphen (-), period (.), and space.
     */
    Name: JobName;
    /**
     * Enables or disables Amazon CloudWatch logging for the job. If logging is enabled, CloudWatch writes one log stream for each job run.
     */
    LogSubscription?: LogSubscription;
    /**
     * The maximum number of nodes that DataBrew can use when the job processes data.
     */
    MaxCapacity?: MaxCapacity;
    /**
     * The maximum number of times to retry the job after a job run fails.
     */
    MaxRetries?: MaxRetries;
    OutputLocation: S3Location;
    /**
     * Configuration for profile jobs. Used to select columns, do evaluations, and override default parameters of evaluations. When configuration is null, the profile job will run with default settings.
     */
    Configuration?: ProfileConfiguration;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role to be assumed when DataBrew runs the job.
     */
    RoleArn: Arn;
    /**
     * Metadata tags to apply to this job.
     */
    Tags?: TagMap;
    /**
     * The job's timeout in minutes. A job that attempts to run longer than this timeout period ends with a status of TIMEOUT.
     */
    Timeout?: Timeout;
    /**
     * Sample configuration for profile jobs only. Determines the number of rows on which the profile job will be executed. If a JobSample value is not provided, the default value will be used. The default value is CUSTOM_ROWS for the mode parameter and 20000 for the size parameter.
     */
    JobSample?: JobSample;
  }
  export interface CreateProfileJobResponse {
    /**
     * The name of the job that was created.
     */
    Name: JobName;
  }
  export interface CreateProjectRequest {
    /**
     * The name of an existing dataset to associate this project with.
     */
    DatasetName: DatasetName;
    /**
     * A unique name for the new project. Valid characters are alphanumeric (A-Z, a-z, 0-9), hyphen (-), period (.), and space.
     */
    Name: ProjectName;
    /**
     * The name of an existing recipe to associate with the project.
     */
    RecipeName: RecipeName;
    Sample?: Sample;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role to be assumed for this request.
     */
    RoleArn: Arn;
    /**
     * Metadata tags to apply to this project.
     */
    Tags?: TagMap;
  }
  export interface CreateProjectResponse {
    /**
     * The name of the project that you created.
     */
    Name: ProjectName;
  }
  export interface CreateRecipeJobRequest {
    /**
     * The name of the dataset that this job processes.
     */
    DatasetName?: DatasetName;
    /**
     * The Amazon Resource Name (ARN) of an encryption key that is used to protect the job.
     */
    EncryptionKeyArn?: EncryptionKeyArn;
    /**
     * The encryption mode for the job, which can be one of the following:    SSE-KMS - Server-side encryption with keys managed by KMS.    SSE-S3 - Server-side encryption with keys managed by Amazon S3.  
     */
    EncryptionMode?: EncryptionMode;
    /**
     * A unique name for the job. Valid characters are alphanumeric (A-Z, a-z, 0-9), hyphen (-), period (.), and space.
     */
    Name: JobName;
    /**
     * Enables or disables Amazon CloudWatch logging for the job. If logging is enabled, CloudWatch writes one log stream for each job run.
     */
    LogSubscription?: LogSubscription;
    /**
     * The maximum number of nodes that DataBrew can consume when the job processes data.
     */
    MaxCapacity?: MaxCapacity;
    /**
     * The maximum number of times to retry the job after a job run fails.
     */
    MaxRetries?: MaxRetries;
    /**
     * One or more artifacts that represent the output from running the job.
     */
    Outputs?: OutputList;
    /**
     * One or more artifacts that represent the Glue Data Catalog output from running the job.
     */
    DataCatalogOutputs?: DataCatalogOutputList;
    /**
     * Represents a list of JDBC database output objects which defines the output destination for a DataBrew recipe job to write to. 
     */
    DatabaseOutputs?: DatabaseOutputList;
    /**
     * Either the name of an existing project, or a combination of a recipe and a dataset to associate with the recipe.
     */
    ProjectName?: ProjectName;
    RecipeReference?: RecipeReference;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role to be assumed when DataBrew runs the job.
     */
    RoleArn: Arn;
    /**
     * Metadata tags to apply to this job.
     */
    Tags?: TagMap;
    /**
     * The job's timeout in minutes. A job that attempts to run longer than this timeout period ends with a status of TIMEOUT.
     */
    Timeout?: Timeout;
  }
  export interface CreateRecipeJobResponse {
    /**
     * The name of the job that you created.
     */
    Name: JobName;
  }
  export interface CreateRecipeRequest {
    /**
     * A description for the recipe.
     */
    Description?: RecipeDescription;
    /**
     * A unique name for the recipe. Valid characters are alphanumeric (A-Z, a-z, 0-9), hyphen (-), period (.), and space.
     */
    Name: RecipeName;
    /**
     * An array containing the steps to be performed by the recipe. Each recipe step consists of one recipe action and (optionally) an array of condition expressions.
     */
    Steps: RecipeStepList;
    /**
     * Metadata tags to apply to this recipe.
     */
    Tags?: TagMap;
  }
  export interface CreateRecipeResponse {
    /**
     * The name of the recipe that you created.
     */
    Name: RecipeName;
  }
  export interface CreateScheduleRequest {
    /**
     * The name or names of one or more jobs to be run.
     */
    JobNames?: JobNameList;
    /**
     * The date or dates and time or times when the jobs are to be run. For more information, see Cron expressions in the Glue DataBrew Developer Guide.
     */
    CronExpression: CronExpression;
    /**
     * Metadata tags to apply to this schedule.
     */
    Tags?: TagMap;
    /**
     * A unique name for the schedule. Valid characters are alphanumeric (A-Z, a-z, 0-9), hyphen (-), period (.), and space.
     */
    Name: ScheduleName;
  }
  export interface CreateScheduleResponse {
    /**
     * The name of the schedule that was created.
     */
    Name: ScheduleName;
  }
  export type CreatedBy = string;
  export type CronExpression = string;
  export interface CsvOptions {
    /**
     * A single character that specifies the delimiter being used in the CSV file.
     */
    Delimiter?: Delimiter;
    /**
     * A variable that specifies whether the first row in the file is parsed as the header. If this value is false, column names are auto-generated.
     */
    HeaderRow?: HeaderRow;
  }
  export interface CsvOutputOptions {
    /**
     * A single character that specifies the delimiter used to create CSV job output.
     */
    Delimiter?: Delimiter;
  }
  export interface DataCatalogInputDefinition {
    /**
     * The unique identifier of the Amazon Web Services account that holds the Data Catalog that stores the data.
     */
    CatalogId?: CatalogId;
    /**
     * The name of a database in the Data Catalog.
     */
    DatabaseName: DatabaseName;
    /**
     * The name of a database table in the Data Catalog. This table corresponds to a DataBrew dataset.
     */
    TableName: TableName;
    /**
     * Represents an Amazon location where DataBrew can store intermediate results.
     */
    TempDirectory?: S3Location;
  }
  export interface DataCatalogOutput {
    /**
     * The unique identifier of the Amazon Web Services account that holds the Data Catalog that stores the data.
     */
    CatalogId?: CatalogId;
    /**
     * The name of a database in the Data Catalog.
     */
    DatabaseName: DatabaseName;
    /**
     * The name of a table in the Data Catalog.
     */
    TableName: TableName;
    /**
     * Represents options that specify how and where DataBrew writes the Amazon S3 output generated by recipe jobs.
     */
    S3Options?: S3TableOutputOptions;
    /**
     * Represents options that specify how and where DataBrew writes the database output generated by recipe jobs.
     */
    DatabaseOptions?: DatabaseTableOutputOptions;
    /**
     * A value that, if true, means that any data in the location specified for output is overwritten with new output. Not supported with DatabaseOptions.
     */
    Overwrite?: OverwriteOutput;
  }
  export type DataCatalogOutputList = DataCatalogOutput[];
  export interface DatabaseInputDefinition {
    /**
     * The Glue Connection that stores the connection information for the target database.
     */
    GlueConnectionName: GlueConnectionName;
    /**
     * The table within the target database.
     */
    DatabaseTableName: DatabaseTableName;
    TempDirectory?: S3Location;
  }
  export type DatabaseName = string;
  export interface DatabaseOutput {
    /**
     * The Glue connection that stores the connection information for the target database.
     */
    GlueConnectionName: GlueConnectionName;
    /**
     * Represents options that specify how and where DataBrew writes the database output generated by recipe jobs.
     */
    DatabaseOptions: DatabaseTableOutputOptions;
    /**
     * The output mode to write into the database. Currently supported option: NEW_TABLE.
     */
    DatabaseOutputMode?: DatabaseOutputMode;
  }
  export type DatabaseOutputList = DatabaseOutput[];
  export type DatabaseOutputMode = "NEW_TABLE"|string;
  export type DatabaseTableName = string;
  export interface DatabaseTableOutputOptions {
    /**
     * Represents an Amazon S3 location (bucket name and object key) where DataBrew can store intermediate results.
     */
    TempDirectory?: S3Location;
    /**
     * A prefix for the name of a table DataBrew will create in the database.
     */
    TableName: DatabaseTableName;
  }
  export interface Dataset {
    /**
     * The ID of the Amazon Web Services account that owns the dataset.
     */
    AccountId?: AccountId;
    /**
     * The Amazon Resource Name (ARN) of the user who created the dataset.
     */
    CreatedBy?: CreatedBy;
    /**
     * The date and time that the dataset was created.
     */
    CreateDate?: _Date;
    /**
     * The unique name of the dataset.
     */
    Name: DatasetName;
    /**
     * The file format of a dataset that is created from an Amazon S3 file or folder.
     */
    Format?: InputFormat;
    /**
     * A set of options that define how DataBrew interprets the data in the dataset.
     */
    FormatOptions?: FormatOptions;
    /**
     * Information on how DataBrew can find the dataset, in either the Glue Data Catalog or Amazon S3.
     */
    Input: Input;
    /**
     * The last modification date and time of the dataset.
     */
    LastModifiedDate?: _Date;
    /**
     * The Amazon Resource Name (ARN) of the user who last modified the dataset.
     */
    LastModifiedBy?: LastModifiedBy;
    /**
     * The location of the data for the dataset, either Amazon S3 or the Glue Data Catalog.
     */
    Source?: Source;
    /**
     * A set of options that defines how DataBrew interprets an Amazon S3 path of the dataset.
     */
    PathOptions?: PathOptions;
    /**
     * Metadata tags that have been applied to the dataset.
     */
    Tags?: TagMap;
    /**
     * The unique Amazon Resource Name (ARN) for the dataset.
     */
    ResourceArn?: Arn;
  }
  export type DatasetList = Dataset[];
  export type DatasetName = string;
  export interface DatasetParameter {
    /**
     * The name of the parameter that is used in the dataset's Amazon S3 path.
     */
    Name: PathParameterName;
    /**
     * The type of the dataset parameter, can be one of a 'String', 'Number' or 'Datetime'.
     */
    Type: ParameterType;
    /**
     * Additional parameter options such as a format and a timezone. Required for datetime parameters.
     */
    DatetimeOptions?: DatetimeOptions;
    /**
     * Optional boolean value that defines whether the captured value of this parameter should be used to create a new column in a dataset.
     */
    CreateColumn?: CreateColumn;
    /**
     * The optional filter expression structure to apply additional matching criteria to the parameter.
     */
    Filter?: FilterExpression;
  }
  export type _Date = Date;
  export type DatetimeFormat = string;
  export interface DatetimeOptions {
    /**
     * Required option, that defines the datetime format used for a date parameter in the Amazon S3 path. Should use only supported datetime specifiers and separation characters, all literal a-z or A-Z characters should be escaped with single quotes. E.g. "MM.dd.yyyy-'at'-HH:mm".
     */
    Format: DatetimeFormat;
    /**
     * Optional value for a timezone offset of the datetime parameter value in the Amazon S3 path. Shouldn't be used if Format for this parameter includes timezone fields. If no offset specified, UTC is assumed.
     */
    TimezoneOffset?: TimezoneOffset;
    /**
     * Optional value for a non-US locale code, needed for correct interpretation of some date formats.
     */
    LocaleCode?: LocaleCode;
  }
  export interface DeleteDatasetRequest {
    /**
     * The name of the dataset to be deleted.
     */
    Name: DatasetName;
  }
  export interface DeleteDatasetResponse {
    /**
     * The name of the dataset that you deleted.
     */
    Name: DatasetName;
  }
  export interface DeleteJobRequest {
    /**
     * The name of the job to be deleted.
     */
    Name: JobName;
  }
  export interface DeleteJobResponse {
    /**
     * The name of the job that you deleted.
     */
    Name: JobName;
  }
  export interface DeleteProjectRequest {
    /**
     * The name of the project to be deleted.
     */
    Name: ProjectName;
  }
  export interface DeleteProjectResponse {
    /**
     * The name of the project that you deleted.
     */
    Name: ProjectName;
  }
  export interface DeleteRecipeVersionRequest {
    /**
     * The name of the recipe.
     */
    Name: RecipeName;
    /**
     * The version of the recipe to be deleted. You can specify a numeric versions (X.Y) or LATEST_WORKING. LATEST_PUBLISHED is not supported.
     */
    RecipeVersion: RecipeVersion;
  }
  export interface DeleteRecipeVersionResponse {
    /**
     * The name of the recipe that was deleted.
     */
    Name: RecipeName;
    /**
     * The version of the recipe that was deleted.
     */
    RecipeVersion: RecipeVersion;
  }
  export interface DeleteScheduleRequest {
    /**
     * The name of the schedule to be deleted.
     */
    Name: ScheduleName;
  }
  export interface DeleteScheduleResponse {
    /**
     * The name of the schedule that was deleted.
     */
    Name: ScheduleName;
  }
  export type Delimiter = string;
  export interface DescribeDatasetRequest {
    /**
     * The name of the dataset to be described.
     */
    Name: DatasetName;
  }
  export interface DescribeDatasetResponse {
    /**
     * The identifier (user name) of the user who created the dataset.
     */
    CreatedBy?: CreatedBy;
    /**
     * The date and time that the dataset was created.
     */
    CreateDate?: _Date;
    /**
     * The name of the dataset.
     */
    Name: DatasetName;
    /**
     * The file format of a dataset that is created from an Amazon S3 file or folder.
     */
    Format?: InputFormat;
    FormatOptions?: FormatOptions;
    Input: Input;
    /**
     * The date and time that the dataset was last modified.
     */
    LastModifiedDate?: _Date;
    /**
     * The identifier (user name) of the user who last modified the dataset.
     */
    LastModifiedBy?: LastModifiedBy;
    /**
     * The location of the data for this dataset, Amazon S3 or the Glue Data Catalog.
     */
    Source?: Source;
    /**
     * A set of options that defines how DataBrew interprets an Amazon S3 path of the dataset.
     */
    PathOptions?: PathOptions;
    /**
     * Metadata tags associated with this dataset.
     */
    Tags?: TagMap;
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    ResourceArn?: Arn;
  }
  export interface DescribeJobRequest {
    /**
     * The name of the job to be described.
     */
    Name: JobName;
  }
  export interface DescribeJobResponse {
    /**
     * The date and time that the job was created.
     */
    CreateDate?: _Date;
    /**
     * The identifier (user name) of the user associated with the creation of the job.
     */
    CreatedBy?: CreatedBy;
    /**
     * The dataset that the job acts upon.
     */
    DatasetName?: DatasetName;
    /**
     * The Amazon Resource Name (ARN) of an encryption key that is used to protect the job.
     */
    EncryptionKeyArn?: EncryptionKeyArn;
    /**
     * The encryption mode for the job, which can be one of the following:    SSE-KMS - Server-side encryption with keys managed by KMS.    SSE-S3 - Server-side encryption with keys managed by Amazon S3.  
     */
    EncryptionMode?: EncryptionMode;
    /**
     * The name of the job.
     */
    Name: JobName;
    /**
     * The job type, which must be one of the following:    PROFILE - The job analyzes the dataset to determine its size, data types, data distribution, and more.    RECIPE - The job applies one or more transformations to a dataset.  
     */
    Type?: JobType;
    /**
     * The identifier (user name) of the user who last modified the job.
     */
    LastModifiedBy?: LastModifiedBy;
    /**
     * The date and time that the job was last modified.
     */
    LastModifiedDate?: _Date;
    /**
     * Indicates whether Amazon CloudWatch logging is enabled for this job.
     */
    LogSubscription?: LogSubscription;
    /**
     * The maximum number of compute nodes that DataBrew can consume when the job processes data.
     */
    MaxCapacity?: MaxCapacity;
    /**
     * The maximum number of times to retry the job after a job run fails.
     */
    MaxRetries?: MaxRetries;
    /**
     * One or more artifacts that represent the output from running the job.
     */
    Outputs?: OutputList;
    /**
     * One or more artifacts that represent the Glue Data Catalog output from running the job.
     */
    DataCatalogOutputs?: DataCatalogOutputList;
    /**
     * Represents a list of JDBC database output objects which defines the output destination for a DataBrew recipe job to write into.
     */
    DatabaseOutputs?: DatabaseOutputList;
    /**
     * The DataBrew project associated with this job.
     */
    ProjectName?: ProjectName;
    /**
     * Configuration for profile jobs. Used to select columns, do evaluations, and override default parameters of evaluations. When configuration is null, the profile job will run with default settings.
     */
    ProfileConfiguration?: ProfileConfiguration;
    RecipeReference?: RecipeReference;
    /**
     * The Amazon Resource Name (ARN) of the job.
     */
    ResourceArn?: Arn;
    /**
     * The ARN of the Identity and Access Management (IAM) role to be assumed when DataBrew runs the job.
     */
    RoleArn?: Arn;
    /**
     * Metadata tags associated with this job.
     */
    Tags?: TagMap;
    /**
     * The job's timeout in minutes. A job that attempts to run longer than this timeout period ends with a status of TIMEOUT.
     */
    Timeout?: Timeout;
    /**
     * Sample configuration for profile jobs only. Determines the number of rows on which the profile job will be executed.
     */
    JobSample?: JobSample;
  }
  export interface DescribeJobRunRequest {
    /**
     * The name of the job being processed during this run.
     */
    Name: JobName;
    /**
     * The unique identifier of the job run.
     */
    RunId: JobRunId;
  }
  export interface DescribeJobRunResponse {
    /**
     * The number of times that DataBrew has attempted to run the job.
     */
    Attempt?: Attempt;
    /**
     * The date and time when the job completed processing.
     */
    CompletedOn?: _Date;
    /**
     * The name of the dataset for the job to process.
     */
    DatasetName?: DatasetName;
    /**
     * A message indicating an error (if any) that was encountered when the job ran.
     */
    ErrorMessage?: JobRunErrorMessage;
    /**
     * The amount of time, in seconds, during which the job run consumed resources.
     */
    ExecutionTime?: ExecutionTime;
    /**
     * The name of the job being processed during this run.
     */
    JobName: JobName;
    /**
     * Configuration for profile jobs. Used to select columns, do evaluations, and override default parameters of evaluations. When configuration is null, the profile job will run with default settings.
     */
    ProfileConfiguration?: ProfileConfiguration;
    /**
     * The unique identifier of the job run.
     */
    RunId?: JobRunId;
    /**
     * The current state of the job run entity itself.
     */
    State?: JobRunState;
    /**
     * The current status of Amazon CloudWatch logging for the job run.
     */
    LogSubscription?: LogSubscription;
    /**
     * The name of an Amazon CloudWatch log group, where the job writes diagnostic messages when it runs.
     */
    LogGroupName?: LogGroupName;
    /**
     * One or more output artifacts from a job run.
     */
    Outputs?: OutputList;
    /**
     * One or more artifacts that represent the Glue Data Catalog output from running the job.
     */
    DataCatalogOutputs?: DataCatalogOutputList;
    /**
     * Represents a list of JDBC database output objects which defines the output destination for a DataBrew recipe job to write into.
     */
    DatabaseOutputs?: DatabaseOutputList;
    RecipeReference?: RecipeReference;
    /**
     * The Amazon Resource Name (ARN) of the user who started the job run.
     */
    StartedBy?: StartedBy;
    /**
     * The date and time when the job run began.
     */
    StartedOn?: _Date;
    /**
     * Sample configuration for profile jobs only. Determines the number of rows on which the profile job will be executed. If a JobSample value is not provided, the default value will be used. The default value is CUSTOM_ROWS for the mode parameter and 20000 for the size parameter.
     */
    JobSample?: JobSample;
  }
  export interface DescribeProjectRequest {
    /**
     * The name of the project to be described.
     */
    Name: ProjectName;
  }
  export interface DescribeProjectResponse {
    /**
     * The date and time that the project was created.
     */
    CreateDate?: _Date;
    /**
     * The identifier (user name) of the user who created the project.
     */
    CreatedBy?: CreatedBy;
    /**
     * The dataset associated with the project.
     */
    DatasetName?: DatasetName;
    /**
     * The date and time that the project was last modified.
     */
    LastModifiedDate?: _Date;
    /**
     * The identifier (user name) of the user who last modified the project.
     */
    LastModifiedBy?: LastModifiedBy;
    /**
     * The name of the project.
     */
    Name: ProjectName;
    /**
     * The recipe associated with this job.
     */
    RecipeName?: RecipeName;
    /**
     * The Amazon Resource Name (ARN) of the project.
     */
    ResourceArn?: Arn;
    Sample?: Sample;
    /**
     * The ARN of the Identity and Access Management (IAM) role to be assumed when DataBrew runs the job.
     */
    RoleArn?: Arn;
    /**
     * Metadata tags associated with this project.
     */
    Tags?: TagMap;
    /**
     * Describes the current state of the session:    PROVISIONING - allocating resources for the session.    INITIALIZING - getting the session ready for first use.    ASSIGNED - the session is ready for use.  
     */
    SessionStatus?: SessionStatus;
    /**
     * The identifier (user name) of the user that opened the project for use. 
     */
    OpenedBy?: OpenedBy;
    /**
     * The date and time when the project was opened. 
     */
    OpenDate?: _Date;
  }
  export interface DescribeRecipeRequest {
    /**
     * The name of the recipe to be described.
     */
    Name: RecipeName;
    /**
     * The recipe version identifier. If this parameter isn't specified, then the latest published version is returned.
     */
    RecipeVersion?: RecipeVersion;
  }
  export interface DescribeRecipeResponse {
    /**
     * The identifier (user name) of the user who created the recipe.
     */
    CreatedBy?: CreatedBy;
    /**
     * The date and time that the recipe was created.
     */
    CreateDate?: _Date;
    /**
     * The identifier (user name) of the user who last modified the recipe.
     */
    LastModifiedBy?: LastModifiedBy;
    /**
     * The date and time that the recipe was last modified.
     */
    LastModifiedDate?: _Date;
    /**
     * The name of the project associated with this recipe.
     */
    ProjectName?: ProjectName;
    /**
     * The identifier (user name) of the user who last published the recipe.
     */
    PublishedBy?: PublishedBy;
    /**
     * The date and time when the recipe was last published.
     */
    PublishedDate?: _Date;
    /**
     * The description of the recipe.
     */
    Description?: RecipeDescription;
    /**
     * The name of the recipe.
     */
    Name: RecipeName;
    /**
     * One or more steps to be performed by the recipe. Each step consists of an action, and the conditions under which the action should succeed.
     */
    Steps?: RecipeStepList;
    /**
     * Metadata tags associated with this project.
     */
    Tags?: TagMap;
    /**
     * The ARN of the recipe.
     */
    ResourceArn?: Arn;
    /**
     * The recipe version identifier.
     */
    RecipeVersion?: RecipeVersion;
  }
  export interface DescribeScheduleRequest {
    /**
     * The name of the schedule to be described.
     */
    Name: ScheduleName;
  }
  export interface DescribeScheduleResponse {
    /**
     * The date and time that the schedule was created.
     */
    CreateDate?: _Date;
    /**
     * The identifier (user name) of the user who created the schedule. 
     */
    CreatedBy?: CreatedBy;
    /**
     * The name or names of one or more jobs to be run by using the schedule.
     */
    JobNames?: JobNameList;
    /**
     * The identifier (user name) of the user who last modified the schedule.
     */
    LastModifiedBy?: LastModifiedBy;
    /**
     * The date and time that the schedule was last modified.
     */
    LastModifiedDate?: _Date;
    /**
     * The Amazon Resource Name (ARN) of the schedule.
     */
    ResourceArn?: Arn;
    /**
     * The date or dates and time or times when the jobs are to be run for the schedule. For more information, see Cron expressions in the Glue DataBrew Developer Guide.
     */
    CronExpression?: CronExpression;
    /**
     * Metadata tags associated with this schedule.
     */
    Tags?: TagMap;
    /**
     * The name of the schedule.
     */
    Name: ScheduleName;
  }
  export type EncryptionKeyArn = string;
  export type EncryptionMode = "SSE-KMS"|"SSE-S3"|string;
  export type ErrorCode = string;
  export interface ExcelOptions {
    /**
     * One or more named sheets in the Excel file that will be included in the dataset.
     */
    SheetNames?: SheetNameList;
    /**
     * One or more sheet numbers in the Excel file that will be included in the dataset.
     */
    SheetIndexes?: SheetIndexList;
    /**
     * A variable that specifies whether the first row in the file is parsed as the header. If this value is false, column names are auto-generated.
     */
    HeaderRow?: HeaderRow;
  }
  export type ExecutionTime = number;
  export type Expression = string;
  export interface FilesLimit {
    /**
     * The number of Amazon S3 files to select.
     */
    MaxFiles: MaxFiles;
    /**
     * A criteria to use for Amazon S3 files sorting before their selection. By default uses LAST_MODIFIED_DATE as a sorting criteria. Currently it's the only allowed value.
     */
    OrderedBy?: OrderedBy;
    /**
     * A criteria to use for Amazon S3 files sorting before their selection. By default uses DESCENDING order, i.e. most recent files are selected first. Anotherpossible value is ASCENDING.
     */
    Order?: Order;
  }
  export interface FilterExpression {
    /**
     * The expression which includes condition names followed by substitution variables, possibly grouped and combined with other conditions. For example, "(starts_with :prefix1 or starts_with :prefix2) and (ends_with :suffix1 or ends_with :suffix2)". Substitution variables should start with ':' symbol.
     */
    Expression: Expression;
    /**
     * The map of substitution variable names to their values used in this filter expression.
     */
    ValuesMap: ValuesMap;
  }
  export interface FormatOptions {
    /**
     * Options that define how JSON input is to be interpreted by DataBrew.
     */
    Json?: JsonOptions;
    /**
     * Options that define how Excel input is to be interpreted by DataBrew.
     */
    Excel?: ExcelOptions;
    /**
     * Options that define how CSV input is to be interpreted by DataBrew.
     */
    Csv?: CsvOptions;
  }
  export type GlueConnectionName = string;
  export type HeaderRow = boolean;
  export type HiddenColumnList = ColumnName[];
  export interface Input {
    /**
     * The Amazon S3 location where the data is stored.
     */
    S3InputDefinition?: S3Location;
    /**
     * The Glue Data Catalog parameters for the data.
     */
    DataCatalogInputDefinition?: DataCatalogInputDefinition;
    /**
     * Connection information for dataset input files stored in a database.
     */
    DatabaseInputDefinition?: DatabaseInputDefinition;
  }
  export type InputFormat = "CSV"|"JSON"|"PARQUET"|"EXCEL"|string;
  export interface Job {
    /**
     * The ID of the Amazon Web Services account that owns the job.
     */
    AccountId?: AccountId;
    /**
     * The Amazon Resource Name (ARN) of the user who created the job.
     */
    CreatedBy?: CreatedBy;
    /**
     * The date and time that the job was created.
     */
    CreateDate?: _Date;
    /**
     * A dataset that the job is to process.
     */
    DatasetName?: DatasetName;
    /**
     * The Amazon Resource Name (ARN) of an encryption key that is used to protect the job output. For more information, see Encrypting data written by DataBrew jobs 
     */
    EncryptionKeyArn?: EncryptionKeyArn;
    /**
     * The encryption mode for the job, which can be one of the following:    SSE-KMS - Server-side encryption with keys managed by KMS.    SSE-S3 - Server-side encryption with keys managed by Amazon S3.  
     */
    EncryptionMode?: EncryptionMode;
    /**
     * The unique name of the job.
     */
    Name: JobName;
    /**
     * The job type of the job, which must be one of the following:    PROFILE - A job to analyze a dataset, to determine its size, data types, data distribution, and more.    RECIPE - A job to apply one or more transformations to a dataset.  
     */
    Type?: JobType;
    /**
     * The Amazon Resource Name (ARN) of the user who last modified the job.
     */
    LastModifiedBy?: LastModifiedBy;
    /**
     * The modification date and time of the job.
     */
    LastModifiedDate?: _Date;
    /**
     * The current status of Amazon CloudWatch logging for the job.
     */
    LogSubscription?: LogSubscription;
    /**
     * The maximum number of nodes that can be consumed when the job processes data.
     */
    MaxCapacity?: MaxCapacity;
    /**
     * The maximum number of times to retry the job after a job run fails.
     */
    MaxRetries?: MaxRetries;
    /**
     * One or more artifacts that represent output from running the job.
     */
    Outputs?: OutputList;
    /**
     * One or more artifacts that represent the Glue Data Catalog output from running the job.
     */
    DataCatalogOutputs?: DataCatalogOutputList;
    /**
     * Represents a list of JDBC database output objects which defines the output destination for a DataBrew recipe job to write into.
     */
    DatabaseOutputs?: DatabaseOutputList;
    /**
     * The name of the project that the job is associated with.
     */
    ProjectName?: ProjectName;
    /**
     * A set of steps that the job runs.
     */
    RecipeReference?: RecipeReference;
    /**
     * The unique Amazon Resource Name (ARN) for the job.
     */
    ResourceArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the role to be assumed for this job.
     */
    RoleArn?: Arn;
    /**
     * The job's timeout in minutes. A job that attempts to run longer than this timeout period ends with a status of TIMEOUT.
     */
    Timeout?: Timeout;
    /**
     * Metadata tags that have been applied to the job.
     */
    Tags?: TagMap;
    /**
     * A sample configuration for profile jobs only, which determines the number of rows on which the profile job is run. If a JobSample value isn't provided, the default value is used. The default value is CUSTOM_ROWS for the mode parameter and 20,000 for the size parameter.
     */
    JobSample?: JobSample;
  }
  export type JobList = Job[];
  export type JobName = string;
  export type JobNameList = JobName[];
  export interface JobRun {
    /**
     * The number of times that DataBrew has attempted to run the job.
     */
    Attempt?: Attempt;
    /**
     * The date and time when the job completed processing.
     */
    CompletedOn?: _Date;
    /**
     * The name of the dataset for the job to process.
     */
    DatasetName?: DatasetName;
    /**
     * A message indicating an error (if any) that was encountered when the job ran.
     */
    ErrorMessage?: JobRunErrorMessage;
    /**
     * The amount of time, in seconds, during which a job run consumed resources.
     */
    ExecutionTime?: ExecutionTime;
    /**
     * The name of the job being processed during this run.
     */
    JobName?: JobName;
    /**
     * The unique identifier of the job run.
     */
    RunId?: JobRunId;
    /**
     * The current state of the job run entity itself.
     */
    State?: JobRunState;
    /**
     * The current status of Amazon CloudWatch logging for the job run.
     */
    LogSubscription?: LogSubscription;
    /**
     * The name of an Amazon CloudWatch log group, where the job writes diagnostic messages when it runs.
     */
    LogGroupName?: LogGroupName;
    /**
     * One or more output artifacts from a job run.
     */
    Outputs?: OutputList;
    /**
     * One or more artifacts that represent the Glue Data Catalog output from running the job.
     */
    DataCatalogOutputs?: DataCatalogOutputList;
    /**
     * Represents a list of JDBC database output objects which defines the output destination for a DataBrew recipe job to write into.
     */
    DatabaseOutputs?: DatabaseOutputList;
    /**
     * The set of steps processed by the job.
     */
    RecipeReference?: RecipeReference;
    /**
     * The Amazon Resource Name (ARN) of the user who initiated the job run. 
     */
    StartedBy?: StartedBy;
    /**
     * The date and time when the job run began. 
     */
    StartedOn?: _Date;
    /**
     * A sample configuration for profile jobs only, which determines the number of rows on which the profile job is run. If a JobSample value isn't provided, the default is used. The default value is CUSTOM_ROWS for the mode parameter and 20,000 for the size parameter.
     */
    JobSample?: JobSample;
  }
  export type JobRunErrorMessage = string;
  export type JobRunId = string;
  export type JobRunList = JobRun[];
  export type JobRunState = "STARTING"|"RUNNING"|"STOPPING"|"STOPPED"|"SUCCEEDED"|"FAILED"|"TIMEOUT"|string;
  export interface JobSample {
    /**
     * A value that determines whether the profile job is run on the entire dataset or a specified number of rows. This value must be one of the following:   FULL_DATASET - The profile job is run on the entire dataset.   CUSTOM_ROWS - The profile job is run on the number of rows specified in the Size parameter.  
     */
    Mode?: SampleMode;
    /**
     * The Size parameter is only required when the mode is CUSTOM_ROWS. The profile job is run on the specified number of rows. The maximum value for size is Long.MAX_VALUE. Long.MAX_VALUE = 9223372036854775807
     */
    Size?: JobSize;
  }
  export type JobSize = number;
  export type JobType = "PROFILE"|"RECIPE"|string;
  export interface JsonOptions {
    /**
     * A value that specifies whether JSON input contains embedded new line characters.
     */
    MultiLine?: MultiLine;
  }
  export type Key = string;
  export type LastModifiedBy = string;
  export interface ListDatasetsRequest {
    /**
     * The maximum number of results to return in this request. 
     */
    MaxResults?: MaxResults100;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListDatasetsResponse {
    /**
     * A list of datasets that are defined.
     */
    Datasets: DatasetList;
    /**
     * A token that you can use in a subsequent call to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListJobRunsRequest {
    /**
     * The name of the job.
     */
    Name: JobName;
    /**
     * The maximum number of results to return in this request. 
     */
    MaxResults?: MaxResults100;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListJobRunsResponse {
    /**
     * A list of job runs that have occurred for the specified job.
     */
    JobRuns: JobRunList;
    /**
     * A token that you can use in a subsequent call to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListJobsRequest {
    /**
     * The name of a dataset. Using this parameter indicates to return only those jobs that act on the specified dataset.
     */
    DatasetName?: DatasetName;
    /**
     * The maximum number of results to return in this request. 
     */
    MaxResults?: MaxResults100;
    /**
     * A token generated by DataBrew that specifies where to continue pagination if a previous request was truncated. To get the next set of pages, pass in the NextToken value from the response object of the previous page call. 
     */
    NextToken?: NextToken;
    /**
     * The name of a project. Using this parameter indicates to return only those jobs that are associated with the specified project.
     */
    ProjectName?: ProjectName;
  }
  export interface ListJobsResponse {
    /**
     * A list of jobs that are defined.
     */
    Jobs: JobList;
    /**
     * A token that you can use in a subsequent call to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListProjectsRequest {
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return in this request. 
     */
    MaxResults?: MaxResults100;
  }
  export interface ListProjectsResponse {
    /**
     * A list of projects that are defined .
     */
    Projects: ProjectList;
    /**
     * A token that you can use in a subsequent call to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListRecipeVersionsRequest {
    /**
     * The maximum number of results to return in this request. 
     */
    MaxResults?: MaxResults100;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The name of the recipe for which to return version information.
     */
    Name: RecipeName;
  }
  export interface ListRecipeVersionsResponse {
    /**
     * A token that you can use in a subsequent call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * A list of versions for the specified recipe.
     */
    Recipes: RecipeList;
  }
  export interface ListRecipesRequest {
    /**
     * The maximum number of results to return in this request. 
     */
    MaxResults?: MaxResults100;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * Return only those recipes with a version identifier of LATEST_WORKING or LATEST_PUBLISHED. If RecipeVersion is omitted, ListRecipes returns all of the LATEST_PUBLISHED recipe versions. Valid values: LATEST_WORKING | LATEST_PUBLISHED 
     */
    RecipeVersion?: RecipeVersion;
  }
  export interface ListRecipesResponse {
    /**
     * A list of recipes that are defined.
     */
    Recipes: RecipeList;
    /**
     * A token that you can use in a subsequent call to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListSchedulesRequest {
    /**
     * The name of the job that these schedules apply to.
     */
    JobName?: JobName;
    /**
     * The maximum number of results to return in this request. 
     */
    MaxResults?: MaxResults100;
    /**
     * The token returned by a previous call to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListSchedulesResponse {
    /**
     * A list of schedules that are defined.
     */
    Schedules: ScheduleList;
    /**
     * A token that you can use in a subsequent call to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) string that uniquely identifies the DataBrew resource. 
     */
    ResourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of tags associated with the DataBrew resource.
     */
    Tags?: TagMap;
  }
  export type LocaleCode = string;
  export type LogGroupName = string;
  export type LogSubscription = "ENABLE"|"DISABLE"|string;
  export type MaxCapacity = number;
  export type MaxFiles = number;
  export type MaxResults100 = number;
  export type MaxRetries = number;
  export type MultiLine = boolean;
  export type NextToken = string;
  export type OpenedBy = string;
  export type Operation = string;
  export type Order = "DESCENDING"|"ASCENDING"|string;
  export type OrderedBy = "LAST_MODIFIED_DATE"|string;
  export interface Output {
    /**
     * The compression algorithm used to compress the output text of the job.
     */
    CompressionFormat?: CompressionFormat;
    /**
     * The data format of the output of the job.
     */
    Format?: OutputFormat;
    /**
     * The names of one or more partition columns for the output of the job.
     */
    PartitionColumns?: ColumnNameList;
    /**
     * The location in Amazon S3 where the job writes its output.
     */
    Location: S3Location;
    /**
     * A value that, if true, means that any data in the location specified for output is overwritten with new output.
     */
    Overwrite?: OverwriteOutput;
    /**
     * Represents options that define how DataBrew formats job output files.
     */
    FormatOptions?: OutputFormatOptions;
  }
  export type OutputFormat = "CSV"|"JSON"|"PARQUET"|"GLUEPARQUET"|"AVRO"|"ORC"|"XML"|"TABLEAUHYPER"|string;
  export interface OutputFormatOptions {
    /**
     * Represents a set of options that define the structure of comma-separated value (CSV) job output.
     */
    Csv?: CsvOutputOptions;
  }
  export type OutputList = Output[];
  export type OverwriteOutput = boolean;
  export type ParameterMap = {[key: string]: ParameterValue};
  export type ParameterName = string;
  export type ParameterType = "Datetime"|"Number"|"String"|string;
  export type ParameterValue = string;
  export interface PathOptions {
    /**
     * If provided, this structure defines a date range for matching Amazon S3 objects based on their LastModifiedDate attribute in Amazon S3.
     */
    LastModifiedDateCondition?: FilterExpression;
    /**
     * If provided, this structure imposes a limit on a number of files that should be selected.
     */
    FilesLimit?: FilesLimit;
    /**
     * A structure that maps names of parameters used in the Amazon S3 path of a dataset to their definitions.
     */
    Parameters?: PathParametersMap;
  }
  export type PathParameterName = string;
  export type PathParametersMap = {[key: string]: DatasetParameter};
  export type Preview = boolean;
  export interface ProfileConfiguration {
    /**
     * Configuration for inter-column evaluations. Configuration can be used to select evaluations and override parameters of evaluations. When configuration is undefined, the profile job will run all supported inter-column evaluations. 
     */
    DatasetStatisticsConfiguration?: StatisticsConfiguration;
    /**
     * List of column selectors. ProfileColumns can be used to select columns from the dataset. When ProfileColumns is undefined, the profile job will profile all supported columns. 
     */
    ProfileColumns?: ColumnSelectorList;
    /**
     * List of configurations for column evaluations. ColumnStatisticsConfigurations are used to select evaluations and override parameters of evaluations for particular columns. When ColumnStatisticsConfigurations is undefined, the profile job will profile all supported columns and run all supported evaluations. 
     */
    ColumnStatisticsConfigurations?: ColumnStatisticsConfigurationList;
  }
  export interface Project {
    /**
     * The ID of the Amazon Web Services account that owns the project.
     */
    AccountId?: AccountId;
    /**
     * The date and time that the project was created.
     */
    CreateDate?: _Date;
    /**
     * The Amazon Resource Name (ARN) of the user who crated the project.
     */
    CreatedBy?: CreatedBy;
    /**
     * The dataset that the project is to act upon.
     */
    DatasetName?: DatasetName;
    /**
     * The last modification date and time for the project.
     */
    LastModifiedDate?: _Date;
    /**
     * The Amazon Resource Name (ARN) of the user who last modified the project.
     */
    LastModifiedBy?: LastModifiedBy;
    /**
     * The unique name of a project.
     */
    Name: ProjectName;
    /**
     * The name of a recipe that will be developed during a project session.
     */
    RecipeName: RecipeName;
    /**
     * The Amazon Resource Name (ARN) for the project.
     */
    ResourceArn?: Arn;
    /**
     * The sample size and sampling type to apply to the data. If this parameter isn't specified, then the sample consists of the first 500 rows from the dataset.
     */
    Sample?: Sample;
    /**
     * Metadata tags that have been applied to the project.
     */
    Tags?: TagMap;
    /**
     * The Amazon Resource Name (ARN) of the role that will be assumed for this project.
     */
    RoleArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the user that opened the project for use.
     */
    OpenedBy?: OpenedBy;
    /**
     * The date and time when the project was opened.
     */
    OpenDate?: _Date;
  }
  export type ProjectList = Project[];
  export type ProjectName = string;
  export interface PublishRecipeRequest {
    /**
     * A description of the recipe to be published, for this version of the recipe.
     */
    Description?: RecipeDescription;
    /**
     * The name of the recipe to be published.
     */
    Name: RecipeName;
  }
  export interface PublishRecipeResponse {
    /**
     * The name of the recipe that you published.
     */
    Name: RecipeName;
  }
  export type PublishedBy = string;
  export interface Recipe {
    /**
     * The Amazon Resource Name (ARN) of the user who created the recipe.
     */
    CreatedBy?: CreatedBy;
    /**
     * The date and time that the recipe was created.
     */
    CreateDate?: _Date;
    /**
     * The Amazon Resource Name (ARN) of the user who last modified the recipe.
     */
    LastModifiedBy?: LastModifiedBy;
    /**
     * The last modification date and time of the recipe.
     */
    LastModifiedDate?: _Date;
    /**
     * The name of the project that the recipe is associated with.
     */
    ProjectName?: ProjectName;
    /**
     * The Amazon Resource Name (ARN) of the user who published the recipe.
     */
    PublishedBy?: PublishedBy;
    /**
     * The date and time when the recipe was published.
     */
    PublishedDate?: _Date;
    /**
     * The description of the recipe.
     */
    Description?: RecipeDescription;
    /**
     * The unique name for the recipe.
     */
    Name: RecipeName;
    /**
     * The Amazon Resource Name (ARN) for the recipe.
     */
    ResourceArn?: Arn;
    /**
     * A list of steps that are defined by the recipe.
     */
    Steps?: RecipeStepList;
    /**
     * Metadata tags that have been applied to the recipe.
     */
    Tags?: TagMap;
    /**
     * The identifier for the version for the recipe. Must be one of the following:   Numeric version (X.Y) - X and Y stand for major and minor version numbers. The maximum length of each is 6 digits, and neither can be negative values. Both X and Y are required, and "0.0" isn't a valid version.    LATEST_WORKING - the most recent valid version being developed in a DataBrew project.    LATEST_PUBLISHED - the most recent published version.  
     */
    RecipeVersion?: RecipeVersion;
  }
  export interface RecipeAction {
    /**
     * The name of a valid DataBrew transformation to be performed on the data.
     */
    Operation: Operation;
    /**
     * Contextual parameters for the transformation.
     */
    Parameters?: ParameterMap;
  }
  export type RecipeDescription = string;
  export type RecipeErrorList = RecipeVersionErrorDetail[];
  export type RecipeErrorMessage = string;
  export type RecipeList = Recipe[];
  export type RecipeName = string;
  export interface RecipeReference {
    /**
     * The name of the recipe.
     */
    Name: RecipeName;
    /**
     * The identifier for the version for the recipe. 
     */
    RecipeVersion?: RecipeVersion;
  }
  export interface RecipeStep {
    /**
     * The particular action to be performed in the recipe step.
     */
    Action: RecipeAction;
    /**
     * One or more conditions that must be met for the recipe step to succeed.  All of the conditions in the array must be met. In other words, all of the conditions must be combined using a logical AND operation. 
     */
    ConditionExpressions?: ConditionExpressionList;
  }
  export type RecipeStepList = RecipeStep[];
  export type RecipeVersion = string;
  export interface RecipeVersionErrorDetail {
    /**
     * The HTTP status code for the error.
     */
    ErrorCode?: ErrorCode;
    /**
     * The text of the error message.
     */
    ErrorMessage?: RecipeErrorMessage;
    /**
     * The identifier for the recipe version associated with this error.
     */
    RecipeVersion?: RecipeVersion;
  }
  export type RecipeVersionList = RecipeVersion[];
  export type Result = string;
  export interface S3Location {
    /**
     * The Amazon S3 bucket name.
     */
    Bucket: Bucket;
    /**
     * The unique name of the object in the bucket.
     */
    Key?: Key;
  }
  export interface S3TableOutputOptions {
    /**
     * Represents an Amazon S3 location (bucket name and object key) where DataBrew can write output from a job.
     */
    Location: S3Location;
  }
  export interface Sample {
    /**
     * The number of rows in the sample.
     */
    Size?: SampleSize;
    /**
     * The way in which DataBrew obtains rows from a dataset.
     */
    Type: SampleType;
  }
  export type SampleMode = "FULL_DATASET"|"CUSTOM_ROWS"|string;
  export type SampleSize = number;
  export type SampleType = "FIRST_N"|"LAST_N"|"RANDOM"|string;
  export interface Schedule {
    /**
     * The ID of the Amazon Web Services account that owns the schedule.
     */
    AccountId?: AccountId;
    /**
     * The Amazon Resource Name (ARN) of the user who created the schedule.
     */
    CreatedBy?: CreatedBy;
    /**
     * The date and time that the schedule was created.
     */
    CreateDate?: _Date;
    /**
     * A list of jobs to be run, according to the schedule.
     */
    JobNames?: JobNameList;
    /**
     * The Amazon Resource Name (ARN) of the user who last modified the schedule.
     */
    LastModifiedBy?: LastModifiedBy;
    /**
     * The date and time when the schedule was last modified.
     */
    LastModifiedDate?: _Date;
    /**
     * The Amazon Resource Name (ARN) of the schedule.
     */
    ResourceArn?: Arn;
    /**
     * The dates and times when the job is to run. For more information, see Cron expressions in the Glue DataBrew Developer Guide.
     */
    CronExpression?: CronExpression;
    /**
     * Metadata tags that have been applied to the schedule.
     */
    Tags?: TagMap;
    /**
     * The name of the schedule.
     */
    Name: ScheduleName;
  }
  export type ScheduleList = Schedule[];
  export type ScheduleName = string;
  export interface SendProjectSessionActionRequest {
    /**
     * If true, the result of the recipe step will be returned, but not applied.
     */
    Preview?: Preview;
    /**
     * The name of the project to apply the action to.
     */
    Name: ProjectName;
    RecipeStep?: RecipeStep;
    /**
     * The index from which to preview a step. This index is used to preview the result of steps that have already been applied, so that the resulting view frame is from earlier in the view frame stack.
     */
    StepIndex?: StepIndex;
    /**
     * A unique identifier for an interactive session that's currently open and ready for work. The action will be performed on this session.
     */
    ClientSessionId?: ClientSessionId;
    ViewFrame?: ViewFrame;
  }
  export interface SendProjectSessionActionResponse {
    /**
     * A message indicating the result of performing the action.
     */
    Result?: Result;
    /**
     * The name of the project that was affected by the action.
     */
    Name: ProjectName;
    /**
     * A unique identifier for the action that was performed.
     */
    ActionId?: ActionId;
  }
  export type SessionStatus = "ASSIGNED"|"FAILED"|"INITIALIZING"|"PROVISIONING"|"READY"|"RECYCLING"|"ROTATING"|"TERMINATED"|"TERMINATING"|"UPDATING"|string;
  export type SheetIndex = number;
  export type SheetIndexList = SheetIndex[];
  export type SheetName = string;
  export type SheetNameList = SheetName[];
  export type Source = "S3"|"DATA-CATALOG"|"DATABASE"|string;
  export type StartColumnIndex = number;
  export interface StartJobRunRequest {
    /**
     * The name of the job to be run.
     */
    Name: JobName;
  }
  export interface StartJobRunResponse {
    /**
     * A system-generated identifier for this particular job run.
     */
    RunId: JobRunId;
  }
  export interface StartProjectSessionRequest {
    /**
     * The name of the project to act upon.
     */
    Name: ProjectName;
    /**
     * A value that, if true, enables you to take control of a session, even if a different client is currently accessing the project.
     */
    AssumeControl?: AssumeControl;
  }
  export interface StartProjectSessionResponse {
    /**
     * The name of the project to be acted upon.
     */
    Name: ProjectName;
    /**
     * A system-generated identifier for the session.
     */
    ClientSessionId?: ClientSessionId;
  }
  export type StartedBy = string;
  export type Statistic = string;
  export type StatisticList = Statistic[];
  export interface StatisticOverride {
    /**
     * The name of an evaluation
     */
    Statistic: Statistic;
    /**
     * A map that includes overrides of an evaluation’s parameters.
     */
    Parameters: ParameterMap;
  }
  export type StatisticOverrideList = StatisticOverride[];
  export interface StatisticsConfiguration {
    /**
     * List of included evaluations. When the list is undefined, all supported evaluations will be included.
     */
    IncludedStatistics?: StatisticList;
    /**
     * List of overrides for evaluations.
     */
    Overrides?: StatisticOverrideList;
  }
  export type StepIndex = number;
  export interface StopJobRunRequest {
    /**
     * The name of the job to be stopped.
     */
    Name: JobName;
    /**
     * The ID of the job run to be stopped.
     */
    RunId: JobRunId;
  }
  export interface StopJobRunResponse {
    /**
     * The ID of the job run that you stopped.
     */
    RunId: JobRunId;
  }
  export type TableName = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The DataBrew resource to which tags should be added. The value for this parameter is an Amazon Resource Name (ARN). For DataBrew, you can tag a dataset, a job, a project, or a recipe.
     */
    ResourceArn: Arn;
    /**
     * One or more tags to be assigned to the resource.
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TargetColumn = string;
  export type Timeout = number;
  export type TimezoneOffset = string;
  export interface UntagResourceRequest {
    /**
     * A DataBrew resource from which you want to remove a tag or tags. The value for this parameter is an Amazon Resource Name (ARN). 
     */
    ResourceArn: Arn;
    /**
     * The tag keys (names) of one or more tags to be removed.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDatasetRequest {
    /**
     * The name of the dataset to be updated.
     */
    Name: DatasetName;
    /**
     * The file format of a dataset that is created from an Amazon S3 file or folder.
     */
    Format?: InputFormat;
    FormatOptions?: FormatOptions;
    Input: Input;
    /**
     * A set of options that defines how DataBrew interprets an Amazon S3 path of the dataset.
     */
    PathOptions?: PathOptions;
  }
  export interface UpdateDatasetResponse {
    /**
     * The name of the dataset that you updated.
     */
    Name: DatasetName;
  }
  export interface UpdateProfileJobRequest {
    /**
     * Configuration for profile jobs. Used to select columns, do evaluations, and override default parameters of evaluations. When configuration is null, the profile job will run with default settings.
     */
    Configuration?: ProfileConfiguration;
    /**
     * The Amazon Resource Name (ARN) of an encryption key that is used to protect the job.
     */
    EncryptionKeyArn?: EncryptionKeyArn;
    /**
     * The encryption mode for the job, which can be one of the following:    SSE-KMS - Server-side encryption with keys managed by KMS.    SSE-S3 - Server-side encryption with keys managed by Amazon S3.  
     */
    EncryptionMode?: EncryptionMode;
    /**
     * The name of the job to be updated.
     */
    Name: JobName;
    /**
     * Enables or disables Amazon CloudWatch logging for the job. If logging is enabled, CloudWatch writes one log stream for each job run.
     */
    LogSubscription?: LogSubscription;
    /**
     * The maximum number of compute nodes that DataBrew can use when the job processes data.
     */
    MaxCapacity?: MaxCapacity;
    /**
     * The maximum number of times to retry the job after a job run fails.
     */
    MaxRetries?: MaxRetries;
    OutputLocation: S3Location;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role to be assumed when DataBrew runs the job.
     */
    RoleArn: Arn;
    /**
     * The job's timeout in minutes. A job that attempts to run longer than this timeout period ends with a status of TIMEOUT.
     */
    Timeout?: Timeout;
    /**
     * Sample configuration for Profile Jobs only. Determines the number of rows on which the Profile job will be executed. If a JobSample value is not provided for profile jobs, the default value will be used. The default value is CUSTOM_ROWS for the mode parameter and 20000 for the size parameter.
     */
    JobSample?: JobSample;
  }
  export interface UpdateProfileJobResponse {
    /**
     * The name of the job that was updated.
     */
    Name: JobName;
  }
  export interface UpdateProjectRequest {
    Sample?: Sample;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to be assumed for this request.
     */
    RoleArn: Arn;
    /**
     * The name of the project to be updated.
     */
    Name: ProjectName;
  }
  export interface UpdateProjectResponse {
    /**
     * The date and time that the project was last modified.
     */
    LastModifiedDate?: _Date;
    /**
     * The name of the project that you updated.
     */
    Name: ProjectName;
  }
  export interface UpdateRecipeJobRequest {
    /**
     * The Amazon Resource Name (ARN) of an encryption key that is used to protect the job.
     */
    EncryptionKeyArn?: EncryptionKeyArn;
    /**
     * The encryption mode for the job, which can be one of the following:    SSE-KMS - Server-side encryption with keys managed by KMS.    SSE-S3 - Server-side encryption with keys managed by Amazon S3.  
     */
    EncryptionMode?: EncryptionMode;
    /**
     * The name of the job to update.
     */
    Name: JobName;
    /**
     * Enables or disables Amazon CloudWatch logging for the job. If logging is enabled, CloudWatch writes one log stream for each job run.
     */
    LogSubscription?: LogSubscription;
    /**
     * The maximum number of nodes that DataBrew can consume when the job processes data.
     */
    MaxCapacity?: MaxCapacity;
    /**
     * The maximum number of times to retry the job after a job run fails.
     */
    MaxRetries?: MaxRetries;
    /**
     * One or more artifacts that represent the output from running the job. 
     */
    Outputs?: OutputList;
    /**
     * One or more artifacts that represent the Glue Data Catalog output from running the job.
     */
    DataCatalogOutputs?: DataCatalogOutputList;
    /**
     * Represents a list of JDBC database output objects which defines the output destination for a DataBrew recipe job to write into.
     */
    DatabaseOutputs?: DatabaseOutputList;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role to be assumed when DataBrew runs the job.
     */
    RoleArn: Arn;
    /**
     * The job's timeout in minutes. A job that attempts to run longer than this timeout period ends with a status of TIMEOUT.
     */
    Timeout?: Timeout;
  }
  export interface UpdateRecipeJobResponse {
    /**
     * The name of the job that you updated.
     */
    Name: JobName;
  }
  export interface UpdateRecipeRequest {
    /**
     * A description of the recipe.
     */
    Description?: RecipeDescription;
    /**
     * The name of the recipe to be updated.
     */
    Name: RecipeName;
    /**
     * One or more steps to be performed by the recipe. Each step consists of an action, and the conditions under which the action should succeed.
     */
    Steps?: RecipeStepList;
  }
  export interface UpdateRecipeResponse {
    /**
     * The name of the recipe that was updated.
     */
    Name: RecipeName;
  }
  export interface UpdateScheduleRequest {
    /**
     * The name or names of one or more jobs to be run for this schedule.
     */
    JobNames?: JobNameList;
    /**
     * The date or dates and time or times when the jobs are to be run. For more information, see Cron expressions in the Glue DataBrew Developer Guide.
     */
    CronExpression: CronExpression;
    /**
     * The name of the schedule to update.
     */
    Name: ScheduleName;
  }
  export interface UpdateScheduleResponse {
    /**
     * The name of the schedule that was updated.
     */
    Name: ScheduleName;
  }
  export type ValueReference = string;
  export type ValuesMap = {[key: string]: ConditionValue};
  export interface ViewFrame {
    /**
     * The starting index for the range of columns to return in the view frame.
     */
    StartColumnIndex: StartColumnIndex;
    /**
     * The number of columns to include in the view frame, beginning with the StartColumnIndex value and ignoring any columns in the HiddenColumns list.
     */
    ColumnRange?: ColumnRange;
    /**
     * A list of columns to hide in the view frame.
     */
    HiddenColumns?: HiddenColumnList;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-07-25"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the DataBrew client.
   */
  export import Types = DataBrew;
}
export = DataBrew;
