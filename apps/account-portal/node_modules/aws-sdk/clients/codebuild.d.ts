import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CodeBuild extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CodeBuild.Types.ClientConfiguration)
  config: Config & CodeBuild.Types.ClientConfiguration;
  /**
   * Deletes one or more builds.
   */
  batchDeleteBuilds(params: CodeBuild.Types.BatchDeleteBuildsInput, callback?: (err: AWSError, data: CodeBuild.Types.BatchDeleteBuildsOutput) => void): Request<CodeBuild.Types.BatchDeleteBuildsOutput, AWSError>;
  /**
   * Deletes one or more builds.
   */
  batchDeleteBuilds(callback?: (err: AWSError, data: CodeBuild.Types.BatchDeleteBuildsOutput) => void): Request<CodeBuild.Types.BatchDeleteBuildsOutput, AWSError>;
  /**
   * Retrieves information about one or more batch builds.
   */
  batchGetBuildBatches(params: CodeBuild.Types.BatchGetBuildBatchesInput, callback?: (err: AWSError, data: CodeBuild.Types.BatchGetBuildBatchesOutput) => void): Request<CodeBuild.Types.BatchGetBuildBatchesOutput, AWSError>;
  /**
   * Retrieves information about one or more batch builds.
   */
  batchGetBuildBatches(callback?: (err: AWSError, data: CodeBuild.Types.BatchGetBuildBatchesOutput) => void): Request<CodeBuild.Types.BatchGetBuildBatchesOutput, AWSError>;
  /**
   * Gets information about one or more builds.
   */
  batchGetBuilds(params: CodeBuild.Types.BatchGetBuildsInput, callback?: (err: AWSError, data: CodeBuild.Types.BatchGetBuildsOutput) => void): Request<CodeBuild.Types.BatchGetBuildsOutput, AWSError>;
  /**
   * Gets information about one or more builds.
   */
  batchGetBuilds(callback?: (err: AWSError, data: CodeBuild.Types.BatchGetBuildsOutput) => void): Request<CodeBuild.Types.BatchGetBuildsOutput, AWSError>;
  /**
   * Gets information about one or more build projects.
   */
  batchGetProjects(params: CodeBuild.Types.BatchGetProjectsInput, callback?: (err: AWSError, data: CodeBuild.Types.BatchGetProjectsOutput) => void): Request<CodeBuild.Types.BatchGetProjectsOutput, AWSError>;
  /**
   * Gets information about one or more build projects.
   */
  batchGetProjects(callback?: (err: AWSError, data: CodeBuild.Types.BatchGetProjectsOutput) => void): Request<CodeBuild.Types.BatchGetProjectsOutput, AWSError>;
  /**
   *  Returns an array of report groups. 
   */
  batchGetReportGroups(params: CodeBuild.Types.BatchGetReportGroupsInput, callback?: (err: AWSError, data: CodeBuild.Types.BatchGetReportGroupsOutput) => void): Request<CodeBuild.Types.BatchGetReportGroupsOutput, AWSError>;
  /**
   *  Returns an array of report groups. 
   */
  batchGetReportGroups(callback?: (err: AWSError, data: CodeBuild.Types.BatchGetReportGroupsOutput) => void): Request<CodeBuild.Types.BatchGetReportGroupsOutput, AWSError>;
  /**
   *  Returns an array of reports. 
   */
  batchGetReports(params: CodeBuild.Types.BatchGetReportsInput, callback?: (err: AWSError, data: CodeBuild.Types.BatchGetReportsOutput) => void): Request<CodeBuild.Types.BatchGetReportsOutput, AWSError>;
  /**
   *  Returns an array of reports. 
   */
  batchGetReports(callback?: (err: AWSError, data: CodeBuild.Types.BatchGetReportsOutput) => void): Request<CodeBuild.Types.BatchGetReportsOutput, AWSError>;
  /**
   * Creates a build project.
   */
  createProject(params: CodeBuild.Types.CreateProjectInput, callback?: (err: AWSError, data: CodeBuild.Types.CreateProjectOutput) => void): Request<CodeBuild.Types.CreateProjectOutput, AWSError>;
  /**
   * Creates a build project.
   */
  createProject(callback?: (err: AWSError, data: CodeBuild.Types.CreateProjectOutput) => void): Request<CodeBuild.Types.CreateProjectOutput, AWSError>;
  /**
   *  Creates a report group. A report group contains a collection of reports. 
   */
  createReportGroup(params: CodeBuild.Types.CreateReportGroupInput, callback?: (err: AWSError, data: CodeBuild.Types.CreateReportGroupOutput) => void): Request<CodeBuild.Types.CreateReportGroupOutput, AWSError>;
  /**
   *  Creates a report group. A report group contains a collection of reports. 
   */
  createReportGroup(callback?: (err: AWSError, data: CodeBuild.Types.CreateReportGroupOutput) => void): Request<CodeBuild.Types.CreateReportGroupOutput, AWSError>;
  /**
   * For an existing CodeBuild build project that has its source code stored in a GitHub or Bitbucket repository, enables CodeBuild to start rebuilding the source code every time a code change is pushed to the repository.  If you enable webhooks for an CodeBuild project, and the project is used as a build step in CodePipeline, then two identical builds are created for each commit. One build is triggered through webhooks, and one through CodePipeline. Because billing is on a per-build basis, you are billed for both builds. Therefore, if you are using CodePipeline, we recommend that you disable webhooks in CodeBuild. In the CodeBuild console, clear the Webhook box. For more information, see step 5 in Change a Build Project's Settings. 
   */
  createWebhook(params: CodeBuild.Types.CreateWebhookInput, callback?: (err: AWSError, data: CodeBuild.Types.CreateWebhookOutput) => void): Request<CodeBuild.Types.CreateWebhookOutput, AWSError>;
  /**
   * For an existing CodeBuild build project that has its source code stored in a GitHub or Bitbucket repository, enables CodeBuild to start rebuilding the source code every time a code change is pushed to the repository.  If you enable webhooks for an CodeBuild project, and the project is used as a build step in CodePipeline, then two identical builds are created for each commit. One build is triggered through webhooks, and one through CodePipeline. Because billing is on a per-build basis, you are billed for both builds. Therefore, if you are using CodePipeline, we recommend that you disable webhooks in CodeBuild. In the CodeBuild console, clear the Webhook box. For more information, see step 5 in Change a Build Project's Settings. 
   */
  createWebhook(callback?: (err: AWSError, data: CodeBuild.Types.CreateWebhookOutput) => void): Request<CodeBuild.Types.CreateWebhookOutput, AWSError>;
  /**
   * Deletes a batch build.
   */
  deleteBuildBatch(params: CodeBuild.Types.DeleteBuildBatchInput, callback?: (err: AWSError, data: CodeBuild.Types.DeleteBuildBatchOutput) => void): Request<CodeBuild.Types.DeleteBuildBatchOutput, AWSError>;
  /**
   * Deletes a batch build.
   */
  deleteBuildBatch(callback?: (err: AWSError, data: CodeBuild.Types.DeleteBuildBatchOutput) => void): Request<CodeBuild.Types.DeleteBuildBatchOutput, AWSError>;
  /**
   *  Deletes a build project. When you delete a project, its builds are not deleted. 
   */
  deleteProject(params: CodeBuild.Types.DeleteProjectInput, callback?: (err: AWSError, data: CodeBuild.Types.DeleteProjectOutput) => void): Request<CodeBuild.Types.DeleteProjectOutput, AWSError>;
  /**
   *  Deletes a build project. When you delete a project, its builds are not deleted. 
   */
  deleteProject(callback?: (err: AWSError, data: CodeBuild.Types.DeleteProjectOutput) => void): Request<CodeBuild.Types.DeleteProjectOutput, AWSError>;
  /**
   *  Deletes a report. 
   */
  deleteReport(params: CodeBuild.Types.DeleteReportInput, callback?: (err: AWSError, data: CodeBuild.Types.DeleteReportOutput) => void): Request<CodeBuild.Types.DeleteReportOutput, AWSError>;
  /**
   *  Deletes a report. 
   */
  deleteReport(callback?: (err: AWSError, data: CodeBuild.Types.DeleteReportOutput) => void): Request<CodeBuild.Types.DeleteReportOutput, AWSError>;
  /**
   * Deletes a report group. Before you delete a report group, you must delete its reports. 
   */
  deleteReportGroup(params: CodeBuild.Types.DeleteReportGroupInput, callback?: (err: AWSError, data: CodeBuild.Types.DeleteReportGroupOutput) => void): Request<CodeBuild.Types.DeleteReportGroupOutput, AWSError>;
  /**
   * Deletes a report group. Before you delete a report group, you must delete its reports. 
   */
  deleteReportGroup(callback?: (err: AWSError, data: CodeBuild.Types.DeleteReportGroupOutput) => void): Request<CodeBuild.Types.DeleteReportGroupOutput, AWSError>;
  /**
   *  Deletes a resource policy that is identified by its resource ARN. 
   */
  deleteResourcePolicy(params: CodeBuild.Types.DeleteResourcePolicyInput, callback?: (err: AWSError, data: CodeBuild.Types.DeleteResourcePolicyOutput) => void): Request<CodeBuild.Types.DeleteResourcePolicyOutput, AWSError>;
  /**
   *  Deletes a resource policy that is identified by its resource ARN. 
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: CodeBuild.Types.DeleteResourcePolicyOutput) => void): Request<CodeBuild.Types.DeleteResourcePolicyOutput, AWSError>;
  /**
   *  Deletes a set of GitHub, GitHub Enterprise, or Bitbucket source credentials. 
   */
  deleteSourceCredentials(params: CodeBuild.Types.DeleteSourceCredentialsInput, callback?: (err: AWSError, data: CodeBuild.Types.DeleteSourceCredentialsOutput) => void): Request<CodeBuild.Types.DeleteSourceCredentialsOutput, AWSError>;
  /**
   *  Deletes a set of GitHub, GitHub Enterprise, or Bitbucket source credentials. 
   */
  deleteSourceCredentials(callback?: (err: AWSError, data: CodeBuild.Types.DeleteSourceCredentialsOutput) => void): Request<CodeBuild.Types.DeleteSourceCredentialsOutput, AWSError>;
  /**
   * For an existing CodeBuild build project that has its source code stored in a GitHub or Bitbucket repository, stops CodeBuild from rebuilding the source code every time a code change is pushed to the repository.
   */
  deleteWebhook(params: CodeBuild.Types.DeleteWebhookInput, callback?: (err: AWSError, data: CodeBuild.Types.DeleteWebhookOutput) => void): Request<CodeBuild.Types.DeleteWebhookOutput, AWSError>;
  /**
   * For an existing CodeBuild build project that has its source code stored in a GitHub or Bitbucket repository, stops CodeBuild from rebuilding the source code every time a code change is pushed to the repository.
   */
  deleteWebhook(callback?: (err: AWSError, data: CodeBuild.Types.DeleteWebhookOutput) => void): Request<CodeBuild.Types.DeleteWebhookOutput, AWSError>;
  /**
   * Retrieves one or more code coverage reports.
   */
  describeCodeCoverages(params: CodeBuild.Types.DescribeCodeCoveragesInput, callback?: (err: AWSError, data: CodeBuild.Types.DescribeCodeCoveragesOutput) => void): Request<CodeBuild.Types.DescribeCodeCoveragesOutput, AWSError>;
  /**
   * Retrieves one or more code coverage reports.
   */
  describeCodeCoverages(callback?: (err: AWSError, data: CodeBuild.Types.DescribeCodeCoveragesOutput) => void): Request<CodeBuild.Types.DescribeCodeCoveragesOutput, AWSError>;
  /**
   *  Returns a list of details about test cases for a report. 
   */
  describeTestCases(params: CodeBuild.Types.DescribeTestCasesInput, callback?: (err: AWSError, data: CodeBuild.Types.DescribeTestCasesOutput) => void): Request<CodeBuild.Types.DescribeTestCasesOutput, AWSError>;
  /**
   *  Returns a list of details about test cases for a report. 
   */
  describeTestCases(callback?: (err: AWSError, data: CodeBuild.Types.DescribeTestCasesOutput) => void): Request<CodeBuild.Types.DescribeTestCasesOutput, AWSError>;
  /**
   * Analyzes and accumulates test report values for the specified test reports.
   */
  getReportGroupTrend(params: CodeBuild.Types.GetReportGroupTrendInput, callback?: (err: AWSError, data: CodeBuild.Types.GetReportGroupTrendOutput) => void): Request<CodeBuild.Types.GetReportGroupTrendOutput, AWSError>;
  /**
   * Analyzes and accumulates test report values for the specified test reports.
   */
  getReportGroupTrend(callback?: (err: AWSError, data: CodeBuild.Types.GetReportGroupTrendOutput) => void): Request<CodeBuild.Types.GetReportGroupTrendOutput, AWSError>;
  /**
   *  Gets a resource policy that is identified by its resource ARN. 
   */
  getResourcePolicy(params: CodeBuild.Types.GetResourcePolicyInput, callback?: (err: AWSError, data: CodeBuild.Types.GetResourcePolicyOutput) => void): Request<CodeBuild.Types.GetResourcePolicyOutput, AWSError>;
  /**
   *  Gets a resource policy that is identified by its resource ARN. 
   */
  getResourcePolicy(callback?: (err: AWSError, data: CodeBuild.Types.GetResourcePolicyOutput) => void): Request<CodeBuild.Types.GetResourcePolicyOutput, AWSError>;
  /**
   *  Imports the source repository credentials for an CodeBuild project that has its source code stored in a GitHub, GitHub Enterprise, or Bitbucket repository. 
   */
  importSourceCredentials(params: CodeBuild.Types.ImportSourceCredentialsInput, callback?: (err: AWSError, data: CodeBuild.Types.ImportSourceCredentialsOutput) => void): Request<CodeBuild.Types.ImportSourceCredentialsOutput, AWSError>;
  /**
   *  Imports the source repository credentials for an CodeBuild project that has its source code stored in a GitHub, GitHub Enterprise, or Bitbucket repository. 
   */
  importSourceCredentials(callback?: (err: AWSError, data: CodeBuild.Types.ImportSourceCredentialsOutput) => void): Request<CodeBuild.Types.ImportSourceCredentialsOutput, AWSError>;
  /**
   * Resets the cache for a project.
   */
  invalidateProjectCache(params: CodeBuild.Types.InvalidateProjectCacheInput, callback?: (err: AWSError, data: CodeBuild.Types.InvalidateProjectCacheOutput) => void): Request<CodeBuild.Types.InvalidateProjectCacheOutput, AWSError>;
  /**
   * Resets the cache for a project.
   */
  invalidateProjectCache(callback?: (err: AWSError, data: CodeBuild.Types.InvalidateProjectCacheOutput) => void): Request<CodeBuild.Types.InvalidateProjectCacheOutput, AWSError>;
  /**
   * Retrieves the identifiers of your build batches in the current region.
   */
  listBuildBatches(params: CodeBuild.Types.ListBuildBatchesInput, callback?: (err: AWSError, data: CodeBuild.Types.ListBuildBatchesOutput) => void): Request<CodeBuild.Types.ListBuildBatchesOutput, AWSError>;
  /**
   * Retrieves the identifiers of your build batches in the current region.
   */
  listBuildBatches(callback?: (err: AWSError, data: CodeBuild.Types.ListBuildBatchesOutput) => void): Request<CodeBuild.Types.ListBuildBatchesOutput, AWSError>;
  /**
   * Retrieves the identifiers of the build batches for a specific project.
   */
  listBuildBatchesForProject(params: CodeBuild.Types.ListBuildBatchesForProjectInput, callback?: (err: AWSError, data: CodeBuild.Types.ListBuildBatchesForProjectOutput) => void): Request<CodeBuild.Types.ListBuildBatchesForProjectOutput, AWSError>;
  /**
   * Retrieves the identifiers of the build batches for a specific project.
   */
  listBuildBatchesForProject(callback?: (err: AWSError, data: CodeBuild.Types.ListBuildBatchesForProjectOutput) => void): Request<CodeBuild.Types.ListBuildBatchesForProjectOutput, AWSError>;
  /**
   * Gets a list of build IDs, with each build ID representing a single build.
   */
  listBuilds(params: CodeBuild.Types.ListBuildsInput, callback?: (err: AWSError, data: CodeBuild.Types.ListBuildsOutput) => void): Request<CodeBuild.Types.ListBuildsOutput, AWSError>;
  /**
   * Gets a list of build IDs, with each build ID representing a single build.
   */
  listBuilds(callback?: (err: AWSError, data: CodeBuild.Types.ListBuildsOutput) => void): Request<CodeBuild.Types.ListBuildsOutput, AWSError>;
  /**
   * Gets a list of build identifiers for the specified build project, with each build identifier representing a single build.
   */
  listBuildsForProject(params: CodeBuild.Types.ListBuildsForProjectInput, callback?: (err: AWSError, data: CodeBuild.Types.ListBuildsForProjectOutput) => void): Request<CodeBuild.Types.ListBuildsForProjectOutput, AWSError>;
  /**
   * Gets a list of build identifiers for the specified build project, with each build identifier representing a single build.
   */
  listBuildsForProject(callback?: (err: AWSError, data: CodeBuild.Types.ListBuildsForProjectOutput) => void): Request<CodeBuild.Types.ListBuildsForProjectOutput, AWSError>;
  /**
   * Gets information about Docker images that are managed by CodeBuild.
   */
  listCuratedEnvironmentImages(params: CodeBuild.Types.ListCuratedEnvironmentImagesInput, callback?: (err: AWSError, data: CodeBuild.Types.ListCuratedEnvironmentImagesOutput) => void): Request<CodeBuild.Types.ListCuratedEnvironmentImagesOutput, AWSError>;
  /**
   * Gets information about Docker images that are managed by CodeBuild.
   */
  listCuratedEnvironmentImages(callback?: (err: AWSError, data: CodeBuild.Types.ListCuratedEnvironmentImagesOutput) => void): Request<CodeBuild.Types.ListCuratedEnvironmentImagesOutput, AWSError>;
  /**
   * Gets a list of build project names, with each build project name representing a single build project.
   */
  listProjects(params: CodeBuild.Types.ListProjectsInput, callback?: (err: AWSError, data: CodeBuild.Types.ListProjectsOutput) => void): Request<CodeBuild.Types.ListProjectsOutput, AWSError>;
  /**
   * Gets a list of build project names, with each build project name representing a single build project.
   */
  listProjects(callback?: (err: AWSError, data: CodeBuild.Types.ListProjectsOutput) => void): Request<CodeBuild.Types.ListProjectsOutput, AWSError>;
  /**
   *  Gets a list ARNs for the report groups in the current Amazon Web Services account. 
   */
  listReportGroups(params: CodeBuild.Types.ListReportGroupsInput, callback?: (err: AWSError, data: CodeBuild.Types.ListReportGroupsOutput) => void): Request<CodeBuild.Types.ListReportGroupsOutput, AWSError>;
  /**
   *  Gets a list ARNs for the report groups in the current Amazon Web Services account. 
   */
  listReportGroups(callback?: (err: AWSError, data: CodeBuild.Types.ListReportGroupsOutput) => void): Request<CodeBuild.Types.ListReportGroupsOutput, AWSError>;
  /**
   *  Returns a list of ARNs for the reports in the current Amazon Web Services account. 
   */
  listReports(params: CodeBuild.Types.ListReportsInput, callback?: (err: AWSError, data: CodeBuild.Types.ListReportsOutput) => void): Request<CodeBuild.Types.ListReportsOutput, AWSError>;
  /**
   *  Returns a list of ARNs for the reports in the current Amazon Web Services account. 
   */
  listReports(callback?: (err: AWSError, data: CodeBuild.Types.ListReportsOutput) => void): Request<CodeBuild.Types.ListReportsOutput, AWSError>;
  /**
   *  Returns a list of ARNs for the reports that belong to a ReportGroup. 
   */
  listReportsForReportGroup(params: CodeBuild.Types.ListReportsForReportGroupInput, callback?: (err: AWSError, data: CodeBuild.Types.ListReportsForReportGroupOutput) => void): Request<CodeBuild.Types.ListReportsForReportGroupOutput, AWSError>;
  /**
   *  Returns a list of ARNs for the reports that belong to a ReportGroup. 
   */
  listReportsForReportGroup(callback?: (err: AWSError, data: CodeBuild.Types.ListReportsForReportGroupOutput) => void): Request<CodeBuild.Types.ListReportsForReportGroupOutput, AWSError>;
  /**
   *  Gets a list of projects that are shared with other Amazon Web Services accounts or users. 
   */
  listSharedProjects(params: CodeBuild.Types.ListSharedProjectsInput, callback?: (err: AWSError, data: CodeBuild.Types.ListSharedProjectsOutput) => void): Request<CodeBuild.Types.ListSharedProjectsOutput, AWSError>;
  /**
   *  Gets a list of projects that are shared with other Amazon Web Services accounts or users. 
   */
  listSharedProjects(callback?: (err: AWSError, data: CodeBuild.Types.ListSharedProjectsOutput) => void): Request<CodeBuild.Types.ListSharedProjectsOutput, AWSError>;
  /**
   *  Gets a list of report groups that are shared with other Amazon Web Services accounts or users. 
   */
  listSharedReportGroups(params: CodeBuild.Types.ListSharedReportGroupsInput, callback?: (err: AWSError, data: CodeBuild.Types.ListSharedReportGroupsOutput) => void): Request<CodeBuild.Types.ListSharedReportGroupsOutput, AWSError>;
  /**
   *  Gets a list of report groups that are shared with other Amazon Web Services accounts or users. 
   */
  listSharedReportGroups(callback?: (err: AWSError, data: CodeBuild.Types.ListSharedReportGroupsOutput) => void): Request<CodeBuild.Types.ListSharedReportGroupsOutput, AWSError>;
  /**
   *  Returns a list of SourceCredentialsInfo objects. 
   */
  listSourceCredentials(params: CodeBuild.Types.ListSourceCredentialsInput, callback?: (err: AWSError, data: CodeBuild.Types.ListSourceCredentialsOutput) => void): Request<CodeBuild.Types.ListSourceCredentialsOutput, AWSError>;
  /**
   *  Returns a list of SourceCredentialsInfo objects. 
   */
  listSourceCredentials(callback?: (err: AWSError, data: CodeBuild.Types.ListSourceCredentialsOutput) => void): Request<CodeBuild.Types.ListSourceCredentialsOutput, AWSError>;
  /**
   *  Stores a resource policy for the ARN of a Project or ReportGroup object. 
   */
  putResourcePolicy(params: CodeBuild.Types.PutResourcePolicyInput, callback?: (err: AWSError, data: CodeBuild.Types.PutResourcePolicyOutput) => void): Request<CodeBuild.Types.PutResourcePolicyOutput, AWSError>;
  /**
   *  Stores a resource policy for the ARN of a Project or ReportGroup object. 
   */
  putResourcePolicy(callback?: (err: AWSError, data: CodeBuild.Types.PutResourcePolicyOutput) => void): Request<CodeBuild.Types.PutResourcePolicyOutput, AWSError>;
  /**
   * Restarts a build.
   */
  retryBuild(params: CodeBuild.Types.RetryBuildInput, callback?: (err: AWSError, data: CodeBuild.Types.RetryBuildOutput) => void): Request<CodeBuild.Types.RetryBuildOutput, AWSError>;
  /**
   * Restarts a build.
   */
  retryBuild(callback?: (err: AWSError, data: CodeBuild.Types.RetryBuildOutput) => void): Request<CodeBuild.Types.RetryBuildOutput, AWSError>;
  /**
   * Restarts a failed batch build. Only batch builds that have failed can be retried.
   */
  retryBuildBatch(params: CodeBuild.Types.RetryBuildBatchInput, callback?: (err: AWSError, data: CodeBuild.Types.RetryBuildBatchOutput) => void): Request<CodeBuild.Types.RetryBuildBatchOutput, AWSError>;
  /**
   * Restarts a failed batch build. Only batch builds that have failed can be retried.
   */
  retryBuildBatch(callback?: (err: AWSError, data: CodeBuild.Types.RetryBuildBatchOutput) => void): Request<CodeBuild.Types.RetryBuildBatchOutput, AWSError>;
  /**
   * Starts running a build.
   */
  startBuild(params: CodeBuild.Types.StartBuildInput, callback?: (err: AWSError, data: CodeBuild.Types.StartBuildOutput) => void): Request<CodeBuild.Types.StartBuildOutput, AWSError>;
  /**
   * Starts running a build.
   */
  startBuild(callback?: (err: AWSError, data: CodeBuild.Types.StartBuildOutput) => void): Request<CodeBuild.Types.StartBuildOutput, AWSError>;
  /**
   * Starts a batch build for a project.
   */
  startBuildBatch(params: CodeBuild.Types.StartBuildBatchInput, callback?: (err: AWSError, data: CodeBuild.Types.StartBuildBatchOutput) => void): Request<CodeBuild.Types.StartBuildBatchOutput, AWSError>;
  /**
   * Starts a batch build for a project.
   */
  startBuildBatch(callback?: (err: AWSError, data: CodeBuild.Types.StartBuildBatchOutput) => void): Request<CodeBuild.Types.StartBuildBatchOutput, AWSError>;
  /**
   * Attempts to stop running a build.
   */
  stopBuild(params: CodeBuild.Types.StopBuildInput, callback?: (err: AWSError, data: CodeBuild.Types.StopBuildOutput) => void): Request<CodeBuild.Types.StopBuildOutput, AWSError>;
  /**
   * Attempts to stop running a build.
   */
  stopBuild(callback?: (err: AWSError, data: CodeBuild.Types.StopBuildOutput) => void): Request<CodeBuild.Types.StopBuildOutput, AWSError>;
  /**
   * Stops a running batch build.
   */
  stopBuildBatch(params: CodeBuild.Types.StopBuildBatchInput, callback?: (err: AWSError, data: CodeBuild.Types.StopBuildBatchOutput) => void): Request<CodeBuild.Types.StopBuildBatchOutput, AWSError>;
  /**
   * Stops a running batch build.
   */
  stopBuildBatch(callback?: (err: AWSError, data: CodeBuild.Types.StopBuildBatchOutput) => void): Request<CodeBuild.Types.StopBuildBatchOutput, AWSError>;
  /**
   * Changes the settings of a build project.
   */
  updateProject(params: CodeBuild.Types.UpdateProjectInput, callback?: (err: AWSError, data: CodeBuild.Types.UpdateProjectOutput) => void): Request<CodeBuild.Types.UpdateProjectOutput, AWSError>;
  /**
   * Changes the settings of a build project.
   */
  updateProject(callback?: (err: AWSError, data: CodeBuild.Types.UpdateProjectOutput) => void): Request<CodeBuild.Types.UpdateProjectOutput, AWSError>;
  /**
   * Changes the public visibility for a project. The project's build results, logs, and artifacts are available to the general public. For more information, see Public build projects in the CodeBuild User Guide.  The following should be kept in mind when making your projects public:   All of a project's build results, logs, and artifacts, including builds that were run when the project was private, are available to the general public.   All build logs and artifacts are available to the public. Environment variables, source code, and other sensitive information may have been output to the build logs and artifacts. You must be careful about what information is output to the build logs. Some best practice are:   Do not store sensitive values, especially Amazon Web Services access key IDs and secret access keys, in environment variables. We recommend that you use an Amazon EC2 Systems Manager Parameter Store or Secrets Manager to store sensitive values.   Follow Best practices for using webhooks in the CodeBuild User Guide to limit which entities can trigger a build, and do not store the buildspec in the project itself, to ensure that your webhooks are as secure as possible.     A malicious user can use public builds to distribute malicious artifacts. We recommend that you review all pull requests to verify that the pull request is a legitimate change. We also recommend that you validate any artifacts with their checksums to make sure that the correct artifacts are being downloaded.   
   */
  updateProjectVisibility(params: CodeBuild.Types.UpdateProjectVisibilityInput, callback?: (err: AWSError, data: CodeBuild.Types.UpdateProjectVisibilityOutput) => void): Request<CodeBuild.Types.UpdateProjectVisibilityOutput, AWSError>;
  /**
   * Changes the public visibility for a project. The project's build results, logs, and artifacts are available to the general public. For more information, see Public build projects in the CodeBuild User Guide.  The following should be kept in mind when making your projects public:   All of a project's build results, logs, and artifacts, including builds that were run when the project was private, are available to the general public.   All build logs and artifacts are available to the public. Environment variables, source code, and other sensitive information may have been output to the build logs and artifacts. You must be careful about what information is output to the build logs. Some best practice are:   Do not store sensitive values, especially Amazon Web Services access key IDs and secret access keys, in environment variables. We recommend that you use an Amazon EC2 Systems Manager Parameter Store or Secrets Manager to store sensitive values.   Follow Best practices for using webhooks in the CodeBuild User Guide to limit which entities can trigger a build, and do not store the buildspec in the project itself, to ensure that your webhooks are as secure as possible.     A malicious user can use public builds to distribute malicious artifacts. We recommend that you review all pull requests to verify that the pull request is a legitimate change. We also recommend that you validate any artifacts with their checksums to make sure that the correct artifacts are being downloaded.   
   */
  updateProjectVisibility(callback?: (err: AWSError, data: CodeBuild.Types.UpdateProjectVisibilityOutput) => void): Request<CodeBuild.Types.UpdateProjectVisibilityOutput, AWSError>;
  /**
   *  Updates a report group. 
   */
  updateReportGroup(params: CodeBuild.Types.UpdateReportGroupInput, callback?: (err: AWSError, data: CodeBuild.Types.UpdateReportGroupOutput) => void): Request<CodeBuild.Types.UpdateReportGroupOutput, AWSError>;
  /**
   *  Updates a report group. 
   */
  updateReportGroup(callback?: (err: AWSError, data: CodeBuild.Types.UpdateReportGroupOutput) => void): Request<CodeBuild.Types.UpdateReportGroupOutput, AWSError>;
  /**
   *  Updates the webhook associated with an CodeBuild build project.    If you use Bitbucket for your repository, rotateSecret is ignored.  
   */
  updateWebhook(params: CodeBuild.Types.UpdateWebhookInput, callback?: (err: AWSError, data: CodeBuild.Types.UpdateWebhookOutput) => void): Request<CodeBuild.Types.UpdateWebhookOutput, AWSError>;
  /**
   *  Updates the webhook associated with an CodeBuild build project.    If you use Bitbucket for your repository, rotateSecret is ignored.  
   */
  updateWebhook(callback?: (err: AWSError, data: CodeBuild.Types.UpdateWebhookOutput) => void): Request<CodeBuild.Types.UpdateWebhookOutput, AWSError>;
}
declare namespace CodeBuild {
  export type ArtifactNamespace = "NONE"|"BUILD_ID"|string;
  export type ArtifactPackaging = "NONE"|"ZIP"|string;
  export type ArtifactsType = "CODEPIPELINE"|"S3"|"NO_ARTIFACTS"|string;
  export type AuthType = "OAUTH"|"BASIC_AUTH"|"PERSONAL_ACCESS_TOKEN"|string;
  export interface BatchDeleteBuildsInput {
    /**
     * The IDs of the builds to delete.
     */
    ids: BuildIds;
  }
  export interface BatchDeleteBuildsOutput {
    /**
     * The IDs of the builds that were successfully deleted.
     */
    buildsDeleted?: BuildIds;
    /**
     * Information about any builds that could not be successfully deleted.
     */
    buildsNotDeleted?: BuildsNotDeleted;
  }
  export interface BatchGetBuildBatchesInput {
    /**
     * An array that contains the batch build identifiers to retrieve.
     */
    ids: BuildBatchIds;
  }
  export interface BatchGetBuildBatchesOutput {
    /**
     * An array of BuildBatch objects that represent the retrieved batch builds.
     */
    buildBatches?: BuildBatches;
    /**
     * An array that contains the identifiers of any batch builds that are not found.
     */
    buildBatchesNotFound?: BuildBatchIds;
  }
  export interface BatchGetBuildsInput {
    /**
     * The IDs of the builds.
     */
    ids: BuildIds;
  }
  export interface BatchGetBuildsOutput {
    /**
     * Information about the requested builds.
     */
    builds?: Builds;
    /**
     * The IDs of builds for which information could not be found.
     */
    buildsNotFound?: BuildIds;
  }
  export interface BatchGetProjectsInput {
    /**
     * The names or ARNs of the build projects. To get information about a project shared with your Amazon Web Services account, its ARN must be specified. You cannot specify a shared project using its name.
     */
    names: ProjectNames;
  }
  export interface BatchGetProjectsOutput {
    /**
     * Information about the requested build projects.
     */
    projects?: Projects;
    /**
     * The names of build projects for which information could not be found.
     */
    projectsNotFound?: ProjectNames;
  }
  export interface BatchGetReportGroupsInput {
    /**
     *  An array of report group ARNs that identify the report groups to return. 
     */
    reportGroupArns: ReportGroupArns;
  }
  export interface BatchGetReportGroupsOutput {
    /**
     *  The array of report groups returned by BatchGetReportGroups. 
     */
    reportGroups?: ReportGroups;
    /**
     *  An array of ARNs passed to BatchGetReportGroups that are not associated with a ReportGroup. 
     */
    reportGroupsNotFound?: ReportGroupArns;
  }
  export interface BatchGetReportsInput {
    /**
     *  An array of ARNs that identify the Report objects to return. 
     */
    reportArns: ReportArns;
  }
  export interface BatchGetReportsOutput {
    /**
     *  The array of Report objects returned by BatchGetReports. 
     */
    reports?: Reports;
    /**
     *  An array of ARNs passed to BatchGetReportGroups that are not associated with a Report. 
     */
    reportsNotFound?: ReportArns;
  }
  export type BatchReportModeType = "REPORT_INDIVIDUAL_BUILDS"|"REPORT_AGGREGATED_BATCH"|string;
  export interface BatchRestrictions {
    /**
     * Specifies the maximum number of builds allowed.
     */
    maximumBuildsAllowed?: WrapperInt;
    /**
     * An array of strings that specify the compute types that are allowed for the batch build. See Build environment compute types in the CodeBuild User Guide for these values. 
     */
    computeTypesAllowed?: ComputeTypesAllowed;
  }
  export type Boolean = boolean;
  export type BucketOwnerAccess = "NONE"|"READ_ONLY"|"FULL"|string;
  export interface Build {
    /**
     * The unique ID for the build.
     */
    id?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the build.
     */
    arn?: NonEmptyString;
    /**
     * The number of the build. For each project, the buildNumber of its first build is 1. The buildNumber of each subsequent build is incremented by 1. If a build is deleted, the buildNumber of other builds does not change.
     */
    buildNumber?: WrapperLong;
    /**
     * When the build process started, expressed in Unix time format.
     */
    startTime?: Timestamp;
    /**
     * When the build process ended, expressed in Unix time format.
     */
    endTime?: Timestamp;
    /**
     * The current build phase.
     */
    currentPhase?: String;
    /**
     * The current status of the build. Valid values include:    FAILED: The build failed.    FAULT: The build faulted.    IN_PROGRESS: The build is still in progress.    STOPPED: The build stopped.    SUCCEEDED: The build succeeded.    TIMED_OUT: The build timed out.  
     */
    buildStatus?: StatusType;
    /**
     * Any version identifier for the version of the source code to be built. If sourceVersion is specified at the project level, then this sourceVersion (at the build level) takes precedence.   For more information, see Source Version Sample with CodeBuild in the CodeBuild User Guide. 
     */
    sourceVersion?: NonEmptyString;
    /**
     *  An identifier for the version of this build's source code.     For CodeCommit, GitHub, GitHub Enterprise, and BitBucket, the commit ID.     For CodePipeline, the source revision provided by CodePipeline.     For Amazon S3, this does not apply.   
     */
    resolvedSourceVersion?: NonEmptyString;
    /**
     * The name of the CodeBuild project.
     */
    projectName?: NonEmptyString;
    /**
     * Information about all previous build phases that are complete and information about any current build phase that is not yet complete.
     */
    phases?: BuildPhases;
    /**
     * Information about the source code to be built.
     */
    source?: ProjectSource;
    /**
     *  An array of ProjectSource objects. 
     */
    secondarySources?: ProjectSources;
    /**
     *  An array of ProjectSourceVersion objects. Each ProjectSourceVersion must be one of:    For CodeCommit: the commit ID, branch, or Git tag to use.   For GitHub: the commit ID, pull request ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a pull request ID is specified, it must use the format pr/pull-request-ID (for example, pr/25). If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.   For Bitbucket: the commit ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.   For Amazon S3: the version ID of the object that represents the build input ZIP file to use.  
     */
    secondarySourceVersions?: ProjectSecondarySourceVersions;
    /**
     * Information about the output artifacts for the build.
     */
    artifacts?: BuildArtifacts;
    /**
     *  An array of ProjectArtifacts objects. 
     */
    secondaryArtifacts?: BuildArtifactsList;
    /**
     * Information about the cache for the build.
     */
    cache?: ProjectCache;
    /**
     * Information about the build environment for this build.
     */
    environment?: ProjectEnvironment;
    /**
     * The name of a service role used for this build.
     */
    serviceRole?: NonEmptyString;
    /**
     * Information about the build's logs in CloudWatch Logs.
     */
    logs?: LogsLocation;
    /**
     * How long, in minutes, for CodeBuild to wait before timing out this build if it does not get marked as completed.
     */
    timeoutInMinutes?: WrapperInt;
    /**
     *  The number of minutes a build is allowed to be queued before it times out. 
     */
    queuedTimeoutInMinutes?: WrapperInt;
    /**
     * Whether the build is complete. True if complete; otherwise, false.
     */
    buildComplete?: Boolean;
    /**
     * The entity that started the build. Valid values include:   If CodePipeline started the build, the pipeline's name (for example, codepipeline/my-demo-pipeline).   If an IAM user started the build, the user's name (for example, MyUserName).   If the Jenkins plugin for CodeBuild started the build, the string CodeBuild-Jenkins-Plugin.  
     */
    initiator?: String;
    /**
     * If your CodeBuild project accesses resources in an Amazon VPC, you provide this parameter that identifies the VPC ID and the list of security group IDs and subnet IDs. The security groups and subnets must belong to the same VPC. You must provide at least one security group and one subnet ID.
     */
    vpcConfig?: VpcConfig;
    /**
     * Describes a network interface.
     */
    networkInterface?: NetworkInterface;
    /**
     * The Key Management Service customer master key (CMK) to be used for encrypting the build output artifacts.   You can use a cross-account KMS key to encrypt the build output artifacts if your service role has permission to that key.   You can specify either the Amazon Resource Name (ARN) of the CMK or, if available, the CMK's alias (using the format alias/&lt;alias-name&gt;).
     */
    encryptionKey?: NonEmptyString;
    /**
     * A list of exported environment variables for this build. Exported environment variables are used in conjunction with CodePipeline to export environment variables from the current build stage to subsequent stages in the pipeline. For more information, see Working with variables in the CodePipeline User Guide.
     */
    exportedEnvironmentVariables?: ExportedEnvironmentVariables;
    /**
     *  An array of the ARNs associated with this build's reports. 
     */
    reportArns?: BuildReportArns;
    /**
     *  An array of ProjectFileSystemLocation objects for a CodeBuild build project. A ProjectFileSystemLocation object specifies the identifier, location, mountOptions, mountPoint, and type of a file system created using Amazon Elastic File System. 
     */
    fileSystemLocations?: ProjectFileSystemLocations;
    /**
     * Contains information about the debug session for this build.
     */
    debugSession?: DebugSession;
    /**
     * The ARN of the batch build that this build is a member of, if applicable.
     */
    buildBatchArn?: String;
  }
  export interface BuildArtifacts {
    /**
     * Information about the location of the build artifacts.
     */
    location?: String;
    /**
     * The SHA-256 hash of the build artifact. You can use this hash along with a checksum tool to confirm file integrity and authenticity.  This value is available only if the build project's packaging value is set to ZIP. 
     */
    sha256sum?: String;
    /**
     * The MD5 hash of the build artifact. You can use this hash along with a checksum tool to confirm file integrity and authenticity.  This value is available only if the build project's packaging value is set to ZIP. 
     */
    md5sum?: String;
    /**
     *  If this flag is set, a name specified in the buildspec file overrides the artifact name. The name specified in a buildspec file is calculated at build time and uses the Shell Command Language. For example, you can append a date and time to your artifact name so that it is always unique. 
     */
    overrideArtifactName?: WrapperBoolean;
    /**
     *  Information that tells you if encryption for build artifacts is disabled. 
     */
    encryptionDisabled?: WrapperBoolean;
    /**
     *  An identifier for this artifact definition. 
     */
    artifactIdentifier?: String;
    bucketOwnerAccess?: BucketOwnerAccess;
  }
  export type BuildArtifactsList = BuildArtifacts[];
  export interface BuildBatch {
    /**
     * The identifier of the batch build.
     */
    id?: NonEmptyString;
    /**
     * The ARN of the batch build.
     */
    arn?: NonEmptyString;
    /**
     * The date and time that the batch build started.
     */
    startTime?: Timestamp;
    /**
     * The date and time that the batch build ended.
     */
    endTime?: Timestamp;
    /**
     * The current phase of the batch build.
     */
    currentPhase?: String;
    /**
     * The status of the batch build.
     */
    buildBatchStatus?: StatusType;
    /**
     * The identifier of the version of the source code to be built.
     */
    sourceVersion?: NonEmptyString;
    /**
     * The identifier of the resolved version of this batch build's source code.   For CodeCommit, GitHub, GitHub Enterprise, and BitBucket, the commit ID.   For CodePipeline, the source revision provided by CodePipeline.   For Amazon S3, this does not apply.  
     */
    resolvedSourceVersion?: NonEmptyString;
    /**
     * The name of the batch build project.
     */
    projectName?: NonEmptyString;
    /**
     * An array of BuildBatchPhase objects the specify the phases of the batch build.
     */
    phases?: BuildBatchPhases;
    source?: ProjectSource;
    /**
     * An array of ProjectSource objects that define the sources for the batch build.
     */
    secondarySources?: ProjectSources;
    /**
     * An array of ProjectSourceVersion objects. Each ProjectSourceVersion must be one of:    For CodeCommit: the commit ID, branch, or Git tag to use.   For GitHub: the commit ID, pull request ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a pull request ID is specified, it must use the format pr/pull-request-ID (for example, pr/25). If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.   For Bitbucket: the commit ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.   For Amazon S3: the version ID of the object that represents the build input ZIP file to use.  
     */
    secondarySourceVersions?: ProjectSecondarySourceVersions;
    /**
     * A BuildArtifacts object the defines the build artifacts for this batch build.
     */
    artifacts?: BuildArtifacts;
    /**
     * An array of BuildArtifacts objects the define the build artifacts for this batch build.
     */
    secondaryArtifacts?: BuildArtifactsList;
    cache?: ProjectCache;
    environment?: ProjectEnvironment;
    /**
     * The name of a service role used for builds in the batch.
     */
    serviceRole?: NonEmptyString;
    logConfig?: LogsConfig;
    /**
     * Specifies the maximum amount of time, in minutes, that the build in a batch must be completed in.
     */
    buildTimeoutInMinutes?: WrapperInt;
    /**
     * Specifies the amount of time, in minutes, that the batch build is allowed to be queued before it times out.
     */
    queuedTimeoutInMinutes?: WrapperInt;
    /**
     * Indicates if the batch build is complete.
     */
    complete?: Boolean;
    /**
     * The entity that started the batch build. Valid values include:   If CodePipeline started the build, the pipeline's name (for example, codepipeline/my-demo-pipeline).   If an IAM user started the build, the user's name.   If the Jenkins plugin for CodeBuild started the build, the string CodeBuild-Jenkins-Plugin.  
     */
    initiator?: String;
    vpcConfig?: VpcConfig;
    /**
     * The Key Management Service customer master key (CMK) to be used for encrypting the batch build output artifacts.  You can use a cross-account KMS key to encrypt the build output artifacts if your service role has permission to that key.   You can specify either the Amazon Resource Name (ARN) of the CMK or, if available, the CMK's alias (using the format alias/&lt;alias-name&gt;).
     */
    encryptionKey?: NonEmptyString;
    /**
     * The number of the batch build. For each project, the buildBatchNumber of its first batch build is 1. The buildBatchNumber of each subsequent batch build is incremented by 1. If a batch build is deleted, the buildBatchNumber of other batch builds does not change.
     */
    buildBatchNumber?: WrapperLong;
    /**
     * An array of ProjectFileSystemLocation objects for the batch build project. A ProjectFileSystemLocation object specifies the identifier, location, mountOptions, mountPoint, and type of a file system created using Amazon Elastic File System. 
     */
    fileSystemLocations?: ProjectFileSystemLocations;
    buildBatchConfig?: ProjectBuildBatchConfig;
    /**
     * An array of BuildGroup objects that define the build groups for the batch build.
     */
    buildGroups?: BuildGroups;
    /**
     * Specifies if session debugging is enabled for this batch build. For more information, see Viewing a running build in Session Manager. Batch session debugging is not supported for matrix batch builds.
     */
    debugSessionEnabled?: WrapperBoolean;
  }
  export interface BuildBatchFilter {
    /**
     * The status of the batch builds to retrieve. Only batch builds that have this status will be retrieved.
     */
    status?: StatusType;
  }
  export type BuildBatchIds = NonEmptyString[];
  export interface BuildBatchPhase {
    /**
     * The name of the batch build phase. Valid values include:  COMBINE_ARTIFACTS  Build output artifacts are being combined and uploaded to the output location.  DOWNLOAD_BATCHSPEC  The batch build specification is being downloaded.  FAILED  One or more of the builds failed.  IN_PROGRESS  The batch build is in progress.  STOPPED  The batch build was stopped.  SUBMITTED  The btach build has been submitted.  SUCCEEDED  The batch build succeeded.  
     */
    phaseType?: BuildBatchPhaseType;
    /**
     * The current status of the batch build phase. Valid values include:  FAILED  The build phase failed.  FAULT  The build phase faulted.  IN_PROGRESS  The build phase is still in progress.  STOPPED  The build phase stopped.  SUCCEEDED  The build phase succeeded.  TIMED_OUT  The build phase timed out.  
     */
    phaseStatus?: StatusType;
    /**
     * When the batch build phase started, expressed in Unix time format.
     */
    startTime?: Timestamp;
    /**
     * When the batch build phase ended, expressed in Unix time format.
     */
    endTime?: Timestamp;
    /**
     * How long, in seconds, between the starting and ending times of the batch build's phase.
     */
    durationInSeconds?: WrapperLong;
    /**
     * Additional information about the batch build phase. Especially to help troubleshoot a failed batch build.
     */
    contexts?: PhaseContexts;
  }
  export type BuildBatchPhaseType = "SUBMITTED"|"DOWNLOAD_BATCHSPEC"|"IN_PROGRESS"|"COMBINE_ARTIFACTS"|"SUCCEEDED"|"FAILED"|"STOPPED"|string;
  export type BuildBatchPhases = BuildBatchPhase[];
  export type BuildBatches = BuildBatch[];
  export interface BuildGroup {
    /**
     * Contains the identifier of the build group.
     */
    identifier?: String;
    /**
     * An array of strings that contain the identifiers of the build groups that this build group depends on.
     */
    dependsOn?: Identifiers;
    /**
     * Specifies if failures in this build group can be ignored.
     */
    ignoreFailure?: Boolean;
    /**
     * A BuildSummary object that contains a summary of the current build group.
     */
    currentBuildSummary?: BuildSummary;
    /**
     * An array of BuildSummary objects that contain summaries of previous build groups.
     */
    priorBuildSummaryList?: BuildSummaries;
  }
  export type BuildGroups = BuildGroup[];
  export type BuildIds = NonEmptyString[];
  export interface BuildNotDeleted {
    /**
     * The ID of the build that could not be successfully deleted.
     */
    id?: NonEmptyString;
    /**
     * Additional information about the build that could not be successfully deleted.
     */
    statusCode?: String;
  }
  export interface BuildPhase {
    /**
     * The name of the build phase. Valid values include:  BUILD  Core build activities typically occur in this build phase.  COMPLETED  The build has been completed.  DOWNLOAD_SOURCE  Source code is being downloaded in this build phase.  FINALIZING  The build process is completing in this build phase.  INSTALL  Installation activities typically occur in this build phase.  POST_BUILD  Post-build activities typically occur in this build phase.  PRE_BUILD  Pre-build activities typically occur in this build phase.  PROVISIONING  The build environment is being set up.  QUEUED  The build has been submitted and is queued behind other submitted builds.  SUBMITTED  The build has been submitted.  UPLOAD_ARTIFACTS  Build output artifacts are being uploaded to the output location.  
     */
    phaseType?: BuildPhaseType;
    /**
     * The current status of the build phase. Valid values include:  FAILED  The build phase failed.  FAULT  The build phase faulted.  IN_PROGRESS  The build phase is still in progress.  STOPPED  The build phase stopped.  SUCCEEDED  The build phase succeeded.  TIMED_OUT  The build phase timed out.  
     */
    phaseStatus?: StatusType;
    /**
     * When the build phase started, expressed in Unix time format.
     */
    startTime?: Timestamp;
    /**
     * When the build phase ended, expressed in Unix time format.
     */
    endTime?: Timestamp;
    /**
     * How long, in seconds, between the starting and ending times of the build's phase.
     */
    durationInSeconds?: WrapperLong;
    /**
     * Additional information about a build phase, especially to help troubleshoot a failed build.
     */
    contexts?: PhaseContexts;
  }
  export type BuildPhaseType = "SUBMITTED"|"QUEUED"|"PROVISIONING"|"DOWNLOAD_SOURCE"|"INSTALL"|"PRE_BUILD"|"BUILD"|"POST_BUILD"|"UPLOAD_ARTIFACTS"|"FINALIZING"|"COMPLETED"|string;
  export type BuildPhases = BuildPhase[];
  export type BuildReportArns = String[];
  export interface BuildStatusConfig {
    /**
     * Specifies the context of the build status CodeBuild sends to the source provider. The usage of this parameter depends on the source provider.  Bitbucket  This parameter is used for the name parameter in the Bitbucket commit status. For more information, see build in the Bitbucket API documentation.  GitHub/GitHub Enterprise Server  This parameter is used for the context parameter in the GitHub commit status. For more information, see Create a commit status in the GitHub developer guide.  
     */
    context?: String;
    /**
     * Specifies the target url of the build status CodeBuild sends to the source provider. The usage of this parameter depends on the source provider.  Bitbucket  This parameter is used for the url parameter in the Bitbucket commit status. For more information, see build in the Bitbucket API documentation.  GitHub/GitHub Enterprise Server  This parameter is used for the target_url parameter in the GitHub commit status. For more information, see Create a commit status in the GitHub developer guide.  
     */
    targetUrl?: String;
  }
  export type BuildSummaries = BuildSummary[];
  export interface BuildSummary {
    /**
     * The batch build ARN.
     */
    arn?: String;
    /**
     * When the build was started, expressed in Unix time format.
     */
    requestedOn?: Timestamp;
    /**
     * The status of the build group.  FAILED  The build group failed.  FAULT  The build group faulted.  IN_PROGRESS  The build group is still in progress.  STOPPED  The build group stopped.  SUCCEEDED  The build group succeeded.  TIMED_OUT  The build group timed out.  
     */
    buildStatus?: StatusType;
    /**
     * A ResolvedArtifact object that represents the primary build artifacts for the build group.
     */
    primaryArtifact?: ResolvedArtifact;
    /**
     * An array of ResolvedArtifact objects that represents the secondary build artifacts for the build group.
     */
    secondaryArtifacts?: ResolvedSecondaryArtifacts;
  }
  export type Builds = Build[];
  export type BuildsNotDeleted = BuildNotDeleted[];
  export type CacheMode = "LOCAL_DOCKER_LAYER_CACHE"|"LOCAL_SOURCE_CACHE"|"LOCAL_CUSTOM_CACHE"|string;
  export type CacheType = "NO_CACHE"|"S3"|"LOCAL"|string;
  export interface CloudWatchLogsConfig {
    /**
     * The current status of the logs in CloudWatch Logs for a build project. Valid values are:    ENABLED: CloudWatch Logs are enabled for this build project.    DISABLED: CloudWatch Logs are not enabled for this build project.  
     */
    status: LogsConfigStatusType;
    /**
     *  The group name of the logs in CloudWatch Logs. For more information, see Working with Log Groups and Log Streams. 
     */
    groupName?: String;
    /**
     *  The prefix of the stream name of the CloudWatch Logs. For more information, see Working with Log Groups and Log Streams. 
     */
    streamName?: String;
  }
  export interface CodeCoverage {
    /**
     * The identifier of the code coverage report.
     */
    id?: NonEmptyString;
    /**
     * The ARN of the report.
     */
    reportARN?: NonEmptyString;
    /**
     * The path of the test report file.
     */
    filePath?: NonEmptyString;
    /**
     * The percentage of lines that are covered by your tests.
     */
    lineCoveragePercentage?: Percentage;
    /**
     * The number of lines that are covered by your tests.
     */
    linesCovered?: NonNegativeInt;
    /**
     * The number of lines that are not covered by your tests.
     */
    linesMissed?: NonNegativeInt;
    /**
     * The percentage of branches that are covered by your tests.
     */
    branchCoveragePercentage?: Percentage;
    /**
     * The number of conditional branches that are covered by your tests.
     */
    branchesCovered?: NonNegativeInt;
    /**
     * The number of conditional branches that are not covered by your tests.
     */
    branchesMissed?: NonNegativeInt;
    /**
     * The date and time that the tests were run.
     */
    expired?: Timestamp;
  }
  export interface CodeCoverageReportSummary {
    /**
     * The percentage of lines that are covered by your tests.
     */
    lineCoveragePercentage?: Percentage;
    /**
     * The number of lines that are covered by your tests.
     */
    linesCovered?: NonNegativeInt;
    /**
     * The number of lines that are not covered by your tests.
     */
    linesMissed?: NonNegativeInt;
    /**
     * The percentage of branches that are covered by your tests.
     */
    branchCoveragePercentage?: Percentage;
    /**
     * The number of conditional branches that are covered by your tests.
     */
    branchesCovered?: NonNegativeInt;
    /**
     * The number of conditional branches that are not covered by your tests.
     */
    branchesMissed?: NonNegativeInt;
  }
  export type CodeCoverages = CodeCoverage[];
  export type ComputeType = "BUILD_GENERAL1_SMALL"|"BUILD_GENERAL1_MEDIUM"|"BUILD_GENERAL1_LARGE"|"BUILD_GENERAL1_2XLARGE"|string;
  export type ComputeTypesAllowed = NonEmptyString[];
  export interface CreateProjectInput {
    /**
     * The name of the build project.
     */
    name: ProjectName;
    /**
     * A description that makes the build project easy to identify.
     */
    description?: ProjectDescription;
    /**
     * Information about the build input source code for the build project.
     */
    source: ProjectSource;
    /**
     * An array of ProjectSource objects. 
     */
    secondarySources?: ProjectSources;
    /**
     * A version of the build input to be built for this project. If not specified, the latest version is used. If specified, it must be one of:    For CodeCommit: the commit ID, branch, or Git tag to use.   For GitHub: the commit ID, pull request ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a pull request ID is specified, it must use the format pr/pull-request-ID (for example pr/25). If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.   For Bitbucket: the commit ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.   For Amazon S3: the version ID of the object that represents the build input ZIP file to use.   If sourceVersion is specified at the build level, then that version takes precedence over this sourceVersion (at the project level).  For more information, see Source Version Sample with CodeBuild in the CodeBuild User Guide. 
     */
    sourceVersion?: String;
    /**
     * An array of ProjectSourceVersion objects. If secondarySourceVersions is specified at the build level, then they take precedence over these secondarySourceVersions (at the project level). 
     */
    secondarySourceVersions?: ProjectSecondarySourceVersions;
    /**
     * Information about the build output artifacts for the build project.
     */
    artifacts: ProjectArtifacts;
    /**
     * An array of ProjectArtifacts objects. 
     */
    secondaryArtifacts?: ProjectArtifactsList;
    /**
     * Stores recently used information so that it can be quickly accessed at a later time.
     */
    cache?: ProjectCache;
    /**
     * Information about the build environment for the build project.
     */
    environment: ProjectEnvironment;
    /**
     * The ARN of the IAM role that enables CodeBuild to interact with dependent Amazon Web Services services on behalf of the Amazon Web Services account.
     */
    serviceRole: NonEmptyString;
    /**
     * How long, in minutes, from 5 to 480 (8 hours), for CodeBuild to wait before it times out any build that has not been marked as completed. The default is 60 minutes.
     */
    timeoutInMinutes?: TimeOut;
    /**
     * The number of minutes a build is allowed to be queued before it times out. 
     */
    queuedTimeoutInMinutes?: TimeOut;
    /**
     * The Key Management Service customer master key (CMK) to be used for encrypting the build output artifacts.  You can use a cross-account KMS key to encrypt the build output artifacts if your service role has permission to that key.   You can specify either the Amazon Resource Name (ARN) of the CMK or, if available, the CMK's alias (using the format alias/&lt;alias-name&gt;). 
     */
    encryptionKey?: NonEmptyString;
    /**
     * A list of tag key and value pairs associated with this build project. These tags are available for use by Amazon Web Services services that support CodeBuild build project tags.
     */
    tags?: TagList;
    /**
     * VpcConfig enables CodeBuild to access resources in an Amazon VPC.
     */
    vpcConfig?: VpcConfig;
    /**
     * Set this to true to generate a publicly accessible URL for your project's build badge.
     */
    badgeEnabled?: WrapperBoolean;
    /**
     * Information about logs for the build project. These can be logs in CloudWatch Logs, logs uploaded to a specified S3 bucket, or both. 
     */
    logsConfig?: LogsConfig;
    /**
     *  An array of ProjectFileSystemLocation objects for a CodeBuild build project. A ProjectFileSystemLocation object specifies the identifier, location, mountOptions, mountPoint, and type of a file system created using Amazon Elastic File System. 
     */
    fileSystemLocations?: ProjectFileSystemLocations;
    /**
     * A ProjectBuildBatchConfig object that defines the batch build options for the project.
     */
    buildBatchConfig?: ProjectBuildBatchConfig;
    /**
     * The maximum number of concurrent builds that are allowed for this project. New builds are only started if the current number of builds is less than or equal to this limit. If the current build count meets this limit, new builds are throttled and are not run.
     */
    concurrentBuildLimit?: WrapperInt;
  }
  export interface CreateProjectOutput {
    /**
     * Information about the build project that was created.
     */
    project?: Project;
  }
  export interface CreateReportGroupInput {
    /**
     *  The name of the report group. 
     */
    name: ReportGroupName;
    /**
     *  The type of report group. 
     */
    type: ReportType;
    /**
     *  A ReportExportConfig object that contains information about where the report group test results are exported. 
     */
    exportConfig: ReportExportConfig;
    /**
     *  A list of tag key and value pairs associated with this report group.  These tags are available for use by Amazon Web Services services that support CodeBuild report group tags.
     */
    tags?: TagList;
  }
  export interface CreateReportGroupOutput {
    /**
     *  Information about the report group that was created. 
     */
    reportGroup?: ReportGroup;
  }
  export interface CreateWebhookInput {
    /**
     * The name of the CodeBuild project.
     */
    projectName: ProjectName;
    /**
     * A regular expression used to determine which repository branches are built when a webhook is triggered. If the name of a branch matches the regular expression, then it is built. If branchFilter is empty, then all branches are built.  It is recommended that you use filterGroups instead of branchFilter.  
     */
    branchFilter?: String;
    /**
     * An array of arrays of WebhookFilter objects used to determine which webhooks are triggered. At least one WebhookFilter in the array must specify EVENT as its type.  For a build to be triggered, at least one filter group in the filterGroups array must pass. For a filter group to pass, each of its filters must pass. 
     */
    filterGroups?: FilterGroups;
    /**
     * Specifies the type of build this webhook will trigger.
     */
    buildType?: WebhookBuildType;
  }
  export interface CreateWebhookOutput {
    /**
     * Information about a webhook that connects repository events to a build project in CodeBuild.
     */
    webhook?: Webhook;
  }
  export type CredentialProviderType = "SECRETS_MANAGER"|string;
  export interface DebugSession {
    /**
     * Specifies if session debugging is enabled for this build.
     */
    sessionEnabled?: WrapperBoolean;
    /**
     * Contains the identifier of the Session Manager session used for the build. To work with the paused build, you open this session to examine, control, and resume the build.
     */
    sessionTarget?: NonEmptyString;
  }
  export interface DeleteBuildBatchInput {
    /**
     * The identifier of the batch build to delete.
     */
    id: NonEmptyString;
  }
  export interface DeleteBuildBatchOutput {
    /**
     * The status code.
     */
    statusCode?: String;
    /**
     * An array of strings that contain the identifiers of the builds that were deleted.
     */
    buildsDeleted?: BuildIds;
    /**
     * An array of BuildNotDeleted objects that specify the builds that could not be deleted.
     */
    buildsNotDeleted?: BuildsNotDeleted;
  }
  export interface DeleteProjectInput {
    /**
     * The name of the build project.
     */
    name: NonEmptyString;
  }
  export interface DeleteProjectOutput {
  }
  export interface DeleteReportGroupInput {
    /**
     * The ARN of the report group to delete. 
     */
    arn: NonEmptyString;
    /**
     * If true, deletes any reports that belong to a report group before deleting the report group.  If false, you must delete any reports in the report group. Use ListReportsForReportGroup to get the reports in a report group. Use DeleteReport to delete the reports. If you call DeleteReportGroup for a report group that contains one or more reports, an exception is thrown. 
     */
    deleteReports?: Boolean;
  }
  export interface DeleteReportGroupOutput {
  }
  export interface DeleteReportInput {
    /**
     *  The ARN of the report to delete. 
     */
    arn: NonEmptyString;
  }
  export interface DeleteReportOutput {
  }
  export interface DeleteResourcePolicyInput {
    /**
     *  The ARN of the resource that is associated with the resource policy. 
     */
    resourceArn: NonEmptyString;
  }
  export interface DeleteResourcePolicyOutput {
  }
  export interface DeleteSourceCredentialsInput {
    /**
     *  The Amazon Resource Name (ARN) of the token.
     */
    arn: NonEmptyString;
  }
  export interface DeleteSourceCredentialsOutput {
    /**
     *  The Amazon Resource Name (ARN) of the token. 
     */
    arn?: NonEmptyString;
  }
  export interface DeleteWebhookInput {
    /**
     * The name of the CodeBuild project.
     */
    projectName: ProjectName;
  }
  export interface DeleteWebhookOutput {
  }
  export interface DescribeCodeCoveragesInput {
    /**
     *  The ARN of the report for which test cases are returned. 
     */
    reportArn: NonEmptyString;
    /**
     * The nextToken value returned from a previous call to DescribeCodeCoverages. This specifies the next item to return. To return the beginning of the list, exclude this parameter.
     */
    nextToken?: String;
    /**
     * The maximum number of results to return.
     */
    maxResults?: PageSize;
    /**
     * Specifies if the results are sorted in ascending or descending order.
     */
    sortOrder?: SortOrderType;
    /**
     * Specifies how the results are sorted. Possible values are:  FILE_PATH  The results are sorted by file path.  LINE_COVERAGE_PERCENTAGE  The results are sorted by the percentage of lines that are covered.  
     */
    sortBy?: ReportCodeCoverageSortByType;
    /**
     * The minimum line coverage percentage to report.
     */
    minLineCoveragePercentage?: Percentage;
    /**
     * The maximum line coverage percentage to report.
     */
    maxLineCoveragePercentage?: Percentage;
  }
  export interface DescribeCodeCoveragesOutput {
    /**
     * If there are more items to return, this contains a token that is passed to a subsequent call to DescribeCodeCoverages to retrieve the next set of items.
     */
    nextToken?: String;
    /**
     * An array of CodeCoverage objects that contain the results.
     */
    codeCoverages?: CodeCoverages;
  }
  export interface DescribeTestCasesInput {
    /**
     *  The ARN of the report for which test cases are returned. 
     */
    reportArn: String;
    /**
     *  During a previous call, the maximum number of items that can be returned is the value specified in maxResults. If there more items in the list, then a unique string called a nextToken is returned. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned. 
     */
    nextToken?: String;
    /**
     *  The maximum number of paginated test cases returned per response. Use nextToken to iterate pages in the list of returned TestCase objects. The default value is 100. 
     */
    maxResults?: PageSize;
    /**
     *  A TestCaseFilter object used to filter the returned reports. 
     */
    filter?: TestCaseFilter;
  }
  export interface DescribeTestCasesOutput {
    /**
     *  During a previous call, the maximum number of items that can be returned is the value specified in maxResults. If there more items in the list, then a unique string called a nextToken is returned. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned. 
     */
    nextToken?: String;
    /**
     *  The returned list of test cases. 
     */
    testCases?: TestCases;
  }
  export interface EnvironmentImage {
    /**
     * The name of the Docker image.
     */
    name?: String;
    /**
     * The description of the Docker image.
     */
    description?: String;
    /**
     * A list of environment image versions.
     */
    versions?: ImageVersions;
  }
  export type EnvironmentImages = EnvironmentImage[];
  export interface EnvironmentLanguage {
    /**
     * The programming language for the Docker images.
     */
    language?: LanguageType;
    /**
     * The list of Docker images that are related by the specified programming language.
     */
    images?: EnvironmentImages;
  }
  export type EnvironmentLanguages = EnvironmentLanguage[];
  export interface EnvironmentPlatform {
    /**
     * The platform's name.
     */
    platform?: PlatformType;
    /**
     * The list of programming languages that are available for the specified platform.
     */
    languages?: EnvironmentLanguages;
  }
  export type EnvironmentPlatforms = EnvironmentPlatform[];
  export type EnvironmentType = "WINDOWS_CONTAINER"|"LINUX_CONTAINER"|"LINUX_GPU_CONTAINER"|"ARM_CONTAINER"|"WINDOWS_SERVER_2019_CONTAINER"|string;
  export interface EnvironmentVariable {
    /**
     * The name or key of the environment variable.
     */
    name: NonEmptyString;
    /**
     * The value of the environment variable.  We strongly discourage the use of PLAINTEXT environment variables to store sensitive values, especially Amazon Web Services secret key IDs and secret access keys. PLAINTEXT environment variables can be displayed in plain text using the CodeBuild console and the CLI. For sensitive values, we recommend you use an environment variable of type PARAMETER_STORE or SECRETS_MANAGER.  
     */
    value: String;
    /**
     * The type of environment variable. Valid values include:    PARAMETER_STORE: An environment variable stored in Systems Manager Parameter Store. To learn how to specify a parameter store environment variable, see env/parameter-store in the CodeBuild User Guide.    PLAINTEXT: An environment variable in plain text format. This is the default value.    SECRETS_MANAGER: An environment variable stored in Secrets Manager. To learn how to specify a secrets manager environment variable, see env/secrets-manager in the CodeBuild User Guide.  
     */
    type?: EnvironmentVariableType;
  }
  export type EnvironmentVariableType = "PLAINTEXT"|"PARAMETER_STORE"|"SECRETS_MANAGER"|string;
  export type EnvironmentVariables = EnvironmentVariable[];
  export interface ExportedEnvironmentVariable {
    /**
     * The name of the exported environment variable.
     */
    name?: NonEmptyString;
    /**
     * The value assigned to the exported environment variable.
     */
    value?: String;
  }
  export type ExportedEnvironmentVariables = ExportedEnvironmentVariable[];
  export type FileSystemType = "EFS"|string;
  export type FilterGroup = WebhookFilter[];
  export type FilterGroups = FilterGroup[];
  export interface GetReportGroupTrendInput {
    /**
     * The ARN of the report group that contains the reports to analyze.
     */
    reportGroupArn: NonEmptyString;
    /**
     * The number of reports to analyze. This operation always retrieves the most recent reports. If this parameter is omitted, the most recent 100 reports are analyzed.
     */
    numOfReports?: PageSize;
    /**
     * The test report value to accumulate. This must be one of the following values:  Test reports:   DURATION  Accumulate the test run times for the specified reports.  PASS_RATE  Accumulate the percentage of tests that passed for the specified test reports.  TOTAL  Accumulate the total number of tests for the specified test reports.      Code coverage reports:   BRANCH_COVERAGE  Accumulate the branch coverage percentages for the specified test reports.  BRANCHES_COVERED  Accumulate the branches covered values for the specified test reports.  BRANCHES_MISSED  Accumulate the branches missed values for the specified test reports.  LINE_COVERAGE  Accumulate the line coverage percentages for the specified test reports.  LINES_COVERED  Accumulate the lines covered values for the specified test reports.  LINES_MISSED  Accumulate the lines not covered values for the specified test reports.    
     */
    trendField: ReportGroupTrendFieldType;
  }
  export interface GetReportGroupTrendOutput {
    /**
     * Contains the accumulated trend data.
     */
    stats?: ReportGroupTrendStats;
    /**
     * An array that contains the raw data for each report.
     */
    rawData?: ReportGroupTrendRawDataList;
  }
  export interface GetResourcePolicyInput {
    /**
     *  The ARN of the resource that is associated with the resource policy. 
     */
    resourceArn: NonEmptyString;
  }
  export interface GetResourcePolicyOutput {
    /**
     *  The resource policy for the resource identified by the input ARN parameter. 
     */
    policy?: NonEmptyString;
  }
  export type GitCloneDepth = number;
  export interface GitSubmodulesConfig {
    /**
     *  Set to true to fetch Git submodules for your CodeBuild build project. 
     */
    fetchSubmodules: WrapperBoolean;
  }
  export type Identifiers = NonEmptyString[];
  export type ImagePullCredentialsType = "CODEBUILD"|"SERVICE_ROLE"|string;
  export type ImageVersions = String[];
  export interface ImportSourceCredentialsInput {
    /**
     *  The Bitbucket username when the authType is BASIC_AUTH. This parameter is not valid for other types of source providers or connections. 
     */
    username?: NonEmptyString;
    /**
     *  For GitHub or GitHub Enterprise, this is the personal access token. For Bitbucket, this is the app password. 
     */
    token: SensitiveNonEmptyString;
    /**
     *  The source provider used for this project. 
     */
    serverType: ServerType;
    /**
     *  The type of authentication used to connect to a GitHub, GitHub Enterprise, or Bitbucket repository. An OAUTH connection is not supported by the API and must be created using the CodeBuild console. 
     */
    authType: AuthType;
    /**
     *  Set to false to prevent overwriting the repository source credentials. Set to true to overwrite the repository source credentials. The default value is true. 
     */
    shouldOverwrite?: WrapperBoolean;
  }
  export interface ImportSourceCredentialsOutput {
    /**
     *  The Amazon Resource Name (ARN) of the token. 
     */
    arn?: NonEmptyString;
  }
  export interface InvalidateProjectCacheInput {
    /**
     * The name of the CodeBuild build project that the cache is reset for.
     */
    projectName: NonEmptyString;
  }
  export interface InvalidateProjectCacheOutput {
  }
  export type KeyInput = string;
  export type LanguageType = "JAVA"|"PYTHON"|"NODE_JS"|"RUBY"|"GOLANG"|"DOCKER"|"ANDROID"|"DOTNET"|"BASE"|"PHP"|string;
  export interface ListBuildBatchesForProjectInput {
    /**
     * The name of the project.
     */
    projectName?: NonEmptyString;
    /**
     * A BuildBatchFilter object that specifies the filters for the search.
     */
    filter?: BuildBatchFilter;
    /**
     * The maximum number of results to return.
     */
    maxResults?: PageSize;
    /**
     * Specifies the sort order of the returned items. Valid values include:    ASCENDING: List the batch build identifiers in ascending order by identifier.    DESCENDING: List the batch build identifiers in descending order by identifier.  
     */
    sortOrder?: SortOrderType;
    /**
     * The nextToken value returned from a previous call to ListBuildBatchesForProject. This specifies the next item to return. To return the beginning of the list, exclude this parameter.
     */
    nextToken?: String;
  }
  export interface ListBuildBatchesForProjectOutput {
    /**
     * An array of strings that contains the batch build identifiers.
     */
    ids?: BuildBatchIds;
    /**
     * If there are more items to return, this contains a token that is passed to a subsequent call to ListBuildBatchesForProject to retrieve the next set of items.
     */
    nextToken?: String;
  }
  export interface ListBuildBatchesInput {
    /**
     * A BuildBatchFilter object that specifies the filters for the search.
     */
    filter?: BuildBatchFilter;
    /**
     * The maximum number of results to return.
     */
    maxResults?: PageSize;
    /**
     * Specifies the sort order of the returned items. Valid values include:    ASCENDING: List the batch build identifiers in ascending order by identifier.    DESCENDING: List the batch build identifiers in descending order by identifier.  
     */
    sortOrder?: SortOrderType;
    /**
     * The nextToken value returned from a previous call to ListBuildBatches. This specifies the next item to return. To return the beginning of the list, exclude this parameter.
     */
    nextToken?: String;
  }
  export interface ListBuildBatchesOutput {
    /**
     * An array of strings that contains the batch build identifiers.
     */
    ids?: BuildBatchIds;
    /**
     * If there are more items to return, this contains a token that is passed to a subsequent call to ListBuildBatches to retrieve the next set of items.
     */
    nextToken?: String;
  }
  export interface ListBuildsForProjectInput {
    /**
     * The name of the CodeBuild project.
     */
    projectName: NonEmptyString;
    /**
     * The order to sort the results in. The results are sorted by build number, not the build identifier. If this is not specified, the results are sorted in descending order. Valid values include:    ASCENDING: List the build identifiers in ascending order, by build number.    DESCENDING: List the build identifiers in descending order, by build number.   If the project has more than 100 builds, setting the sort order will result in an error. 
     */
    sortOrder?: SortOrderType;
    /**
     * During a previous call, if there are more than 100 items in the list, only the first 100 items are returned, along with a unique string called a nextToken. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned.
     */
    nextToken?: String;
  }
  export interface ListBuildsForProjectOutput {
    /**
     * A list of build identifiers for the specified build project, with each build ID representing a single build.
     */
    ids?: BuildIds;
    /**
     * If there are more than 100 items in the list, only the first 100 items are returned, along with a unique string called a nextToken. To get the next batch of items in the list, call this operation again, adding the next token to the call.
     */
    nextToken?: String;
  }
  export interface ListBuildsInput {
    /**
     * The order to list build IDs. Valid values include:    ASCENDING: List the build IDs in ascending order by build ID.    DESCENDING: List the build IDs in descending order by build ID.  
     */
    sortOrder?: SortOrderType;
    /**
     * During a previous call, if there are more than 100 items in the list, only the first 100 items are returned, along with a unique string called a nextToken. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned.
     */
    nextToken?: String;
  }
  export interface ListBuildsOutput {
    /**
     * A list of build IDs, with each build ID representing a single build.
     */
    ids?: BuildIds;
    /**
     * If there are more than 100 items in the list, only the first 100 items are returned, along with a unique string called a nextToken. To get the next batch of items in the list, call this operation again, adding the next token to the call.
     */
    nextToken?: String;
  }
  export interface ListCuratedEnvironmentImagesInput {
  }
  export interface ListCuratedEnvironmentImagesOutput {
    /**
     * Information about supported platforms for Docker images that are managed by CodeBuild.
     */
    platforms?: EnvironmentPlatforms;
  }
  export interface ListProjectsInput {
    /**
     * The criterion to be used to list build project names. Valid values include:    CREATED_TIME: List based on when each build project was created.    LAST_MODIFIED_TIME: List based on when information about each build project was last changed.    NAME: List based on each build project's name.   Use sortOrder to specify in what order to list the build project names based on the preceding criteria.
     */
    sortBy?: ProjectSortByType;
    /**
     * The order in which to list build projects. Valid values include:    ASCENDING: List in ascending order.    DESCENDING: List in descending order.   Use sortBy to specify the criterion to be used to list build project names.
     */
    sortOrder?: SortOrderType;
    /**
     * During a previous call, if there are more than 100 items in the list, only the first 100 items are returned, along with a unique string called a nextToken. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned.
     */
    nextToken?: NonEmptyString;
  }
  export interface ListProjectsOutput {
    /**
     * If there are more than 100 items in the list, only the first 100 items are returned, along with a unique string called a nextToken. To get the next batch of items in the list, call this operation again, adding the next token to the call.
     */
    nextToken?: String;
    /**
     * The list of build project names, with each build project name representing a single build project.
     */
    projects?: ProjectNames;
  }
  export interface ListReportGroupsInput {
    /**
     *  Used to specify the order to sort the list of returned report groups. Valid values are ASCENDING and DESCENDING. 
     */
    sortOrder?: SortOrderType;
    /**
     *  The criterion to be used to list build report groups. Valid values include:     CREATED_TIME: List based on when each report group was created.    LAST_MODIFIED_TIME: List based on when each report group was last changed.    NAME: List based on each report group's name.  
     */
    sortBy?: ReportGroupSortByType;
    /**
     *  During a previous call, the maximum number of items that can be returned is the value specified in maxResults. If there more items in the list, then a unique string called a nextToken is returned. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned. 
     */
    nextToken?: String;
    /**
     *  The maximum number of paginated report groups returned per response. Use nextToken to iterate pages in the list of returned ReportGroup objects. The default value is 100. 
     */
    maxResults?: PageSize;
  }
  export interface ListReportGroupsOutput {
    /**
     *  During a previous call, the maximum number of items that can be returned is the value specified in maxResults. If there more items in the list, then a unique string called a nextToken is returned. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned. 
     */
    nextToken?: String;
    /**
     *  The list of ARNs for the report groups in the current Amazon Web Services account. 
     */
    reportGroups?: ReportGroupArns;
  }
  export interface ListReportsForReportGroupInput {
    /**
     *  The ARN of the report group for which you want to return report ARNs. 
     */
    reportGroupArn: String;
    /**
     *  During a previous call, the maximum number of items that can be returned is the value specified in maxResults. If there more items in the list, then a unique string called a nextToken is returned. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned. 
     */
    nextToken?: String;
    /**
     *  Use to specify whether the results are returned in ascending or descending order. 
     */
    sortOrder?: SortOrderType;
    /**
     *  The maximum number of paginated reports in this report group returned per response. Use nextToken to iterate pages in the list of returned Report objects. The default value is 100. 
     */
    maxResults?: PageSize;
    /**
     *  A ReportFilter object used to filter the returned reports. 
     */
    filter?: ReportFilter;
  }
  export interface ListReportsForReportGroupOutput {
    /**
     *  During a previous call, the maximum number of items that can be returned is the value specified in maxResults. If there more items in the list, then a unique string called a nextToken is returned. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned. 
     */
    nextToken?: String;
    /**
     *  The list of report ARNs. 
     */
    reports?: ReportArns;
  }
  export interface ListReportsInput {
    /**
     *  Specifies the sort order for the list of returned reports. Valid values are:     ASCENDING: return reports in chronological order based on their creation date.     DESCENDING: return reports in the reverse chronological order based on their creation date.   
     */
    sortOrder?: SortOrderType;
    /**
     *  During a previous call, the maximum number of items that can be returned is the value specified in maxResults. If there more items in the list, then a unique string called a nextToken is returned. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned. 
     */
    nextToken?: String;
    /**
     *  The maximum number of paginated reports returned per response. Use nextToken to iterate pages in the list of returned Report objects. The default value is 100. 
     */
    maxResults?: PageSize;
    /**
     *  A ReportFilter object used to filter the returned reports. 
     */
    filter?: ReportFilter;
  }
  export interface ListReportsOutput {
    /**
     *  During a previous call, the maximum number of items that can be returned is the value specified in maxResults. If there more items in the list, then a unique string called a nextToken is returned. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned. 
     */
    nextToken?: String;
    /**
     *  The list of returned ARNs for the reports in the current Amazon Web Services account. 
     */
    reports?: ReportArns;
  }
  export interface ListSharedProjectsInput {
    /**
     *  The criterion to be used to list build projects shared with the current Amazon Web Services account or user. Valid values include:     ARN: List based on the ARN.     MODIFIED_TIME: List based on when information about the shared project was last changed.   
     */
    sortBy?: SharedResourceSortByType;
    /**
     * The order in which to list shared build projects. Valid values include:    ASCENDING: List in ascending order.    DESCENDING: List in descending order.  
     */
    sortOrder?: SortOrderType;
    /**
     *  The maximum number of paginated shared build projects returned per response. Use nextToken to iterate pages in the list of returned Project objects. The default value is 100. 
     */
    maxResults?: PageSize;
    /**
     *  During a previous call, the maximum number of items that can be returned is the value specified in maxResults. If there more items in the list, then a unique string called a nextToken is returned. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned. 
     */
    nextToken?: NonEmptyString;
  }
  export interface ListSharedProjectsOutput {
    /**
     *  During a previous call, the maximum number of items that can be returned is the value specified in maxResults. If there more items in the list, then a unique string called a nextToken is returned. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned. 
     */
    nextToken?: String;
    /**
     *  The list of ARNs for the build projects shared with the current Amazon Web Services account or user. 
     */
    projects?: ProjectArns;
  }
  export interface ListSharedReportGroupsInput {
    /**
     * The order in which to list shared report groups. Valid values include:    ASCENDING: List in ascending order.    DESCENDING: List in descending order.  
     */
    sortOrder?: SortOrderType;
    /**
     *  The criterion to be used to list report groups shared with the current Amazon Web Services account or user. Valid values include:     ARN: List based on the ARN.     MODIFIED_TIME: List based on when information about the shared report group was last changed.   
     */
    sortBy?: SharedResourceSortByType;
    /**
     *  During a previous call, the maximum number of items that can be returned is the value specified in maxResults. If there more items in the list, then a unique string called a nextToken is returned. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned. 
     */
    nextToken?: String;
    /**
     *  The maximum number of paginated shared report groups per response. Use nextToken to iterate pages in the list of returned ReportGroup objects. The default value is 100. 
     */
    maxResults?: PageSize;
  }
  export interface ListSharedReportGroupsOutput {
    /**
     *  During a previous call, the maximum number of items that can be returned is the value specified in maxResults. If there more items in the list, then a unique string called a nextToken is returned. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned. 
     */
    nextToken?: String;
    /**
     *  The list of ARNs for the report groups shared with the current Amazon Web Services account or user. 
     */
    reportGroups?: ReportGroupArns;
  }
  export interface ListSourceCredentialsInput {
  }
  export interface ListSourceCredentialsOutput {
    /**
     *  A list of SourceCredentialsInfo objects. Each SourceCredentialsInfo object includes the authentication type, token ARN, and type of source provider for one set of credentials. 
     */
    sourceCredentialsInfos?: SourceCredentialsInfos;
  }
  export interface LogsConfig {
    /**
     *  Information about CloudWatch Logs for a build project. CloudWatch Logs are enabled by default. 
     */
    cloudWatchLogs?: CloudWatchLogsConfig;
    /**
     *  Information about logs built to an S3 bucket for a build project. S3 logs are not enabled by default. 
     */
    s3Logs?: S3LogsConfig;
  }
  export type LogsConfigStatusType = "ENABLED"|"DISABLED"|string;
  export interface LogsLocation {
    /**
     * The name of the CloudWatch Logs group for the build logs.
     */
    groupName?: String;
    /**
     * The name of the CloudWatch Logs stream for the build logs.
     */
    streamName?: String;
    /**
     * The URL to an individual build log in CloudWatch Logs.
     */
    deepLink?: String;
    /**
     *  The URL to a build log in an S3 bucket. 
     */
    s3DeepLink?: String;
    /**
     *  The ARN of CloudWatch Logs for a build project. Its format is arn:${Partition}:logs:${Region}:${Account}:log-group:${LogGroupName}:log-stream:${LogStreamName}. For more information, see Resources Defined by CloudWatch Logs. 
     */
    cloudWatchLogsArn?: String;
    /**
     *  The ARN of S3 logs for a build project. Its format is arn:${Partition}:s3:::${BucketName}/${ObjectName}. For more information, see Resources Defined by Amazon S3. 
     */
    s3LogsArn?: String;
    /**
     *  Information about CloudWatch Logs for a build project. 
     */
    cloudWatchLogs?: CloudWatchLogsConfig;
    /**
     *  Information about S3 logs for a build project. 
     */
    s3Logs?: S3LogsConfig;
  }
  export interface NetworkInterface {
    /**
     * The ID of the subnet.
     */
    subnetId?: NonEmptyString;
    /**
     * The ID of the network interface.
     */
    networkInterfaceId?: NonEmptyString;
  }
  export type NonEmptyString = string;
  export type NonNegativeInt = number;
  export type PageSize = number;
  export type Percentage = number;
  export interface PhaseContext {
    /**
     * The status code for the context of the build phase.
     */
    statusCode?: String;
    /**
     * An explanation of the build phase's context. This might include a command ID and an exit code.
     */
    message?: String;
  }
  export type PhaseContexts = PhaseContext[];
  export type PlatformType = "DEBIAN"|"AMAZON_LINUX"|"UBUNTU"|"WINDOWS_SERVER"|string;
  export interface Project {
    /**
     * The name of the build project.
     */
    name?: ProjectName;
    /**
     * The Amazon Resource Name (ARN) of the build project.
     */
    arn?: String;
    /**
     * A description that makes the build project easy to identify.
     */
    description?: ProjectDescription;
    /**
     * Information about the build input source code for this build project.
     */
    source?: ProjectSource;
    /**
     * An array of ProjectSource objects. 
     */
    secondarySources?: ProjectSources;
    /**
     * A version of the build input to be built for this project. If not specified, the latest version is used. If specified, it must be one of:   For CodeCommit: the commit ID, branch, or Git tag to use.   For GitHub: the commit ID, pull request ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a pull request ID is specified, it must use the format pr/pull-request-ID (for example pr/25). If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.   For Bitbucket: the commit ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.   For Amazon S3: the version ID of the object that represents the build input ZIP file to use.   If sourceVersion is specified at the build level, then that version takes precedence over this sourceVersion (at the project level).  For more information, see Source Version Sample with CodeBuild in the CodeBuild User Guide. 
     */
    sourceVersion?: String;
    /**
     * An array of ProjectSourceVersion objects. If secondarySourceVersions is specified at the build level, then they take over these secondarySourceVersions (at the project level). 
     */
    secondarySourceVersions?: ProjectSecondarySourceVersions;
    /**
     * Information about the build output artifacts for the build project.
     */
    artifacts?: ProjectArtifacts;
    /**
     * An array of ProjectArtifacts objects. 
     */
    secondaryArtifacts?: ProjectArtifactsList;
    /**
     * Information about the cache for the build project.
     */
    cache?: ProjectCache;
    /**
     * Information about the build environment for this build project.
     */
    environment?: ProjectEnvironment;
    /**
     * The ARN of the IAM role that enables CodeBuild to interact with dependent Amazon Web Services services on behalf of the Amazon Web Services account.
     */
    serviceRole?: NonEmptyString;
    /**
     * How long, in minutes, from 5 to 480 (8 hours), for CodeBuild to wait before timing out any related build that did not get marked as completed. The default is 60 minutes.
     */
    timeoutInMinutes?: TimeOut;
    /**
     * The number of minutes a build is allowed to be queued before it times out. 
     */
    queuedTimeoutInMinutes?: TimeOut;
    /**
     * The Key Management Service customer master key (CMK) to be used for encrypting the build output artifacts.  You can use a cross-account KMS key to encrypt the build output artifacts if your service role has permission to that key.   You can specify either the Amazon Resource Name (ARN) of the CMK or, if available, the CMK's alias (using the format alias/&lt;alias-name&gt;). If you don't specify a value, CodeBuild uses the managed CMK for Amazon Simple Storage Service (Amazon S3). 
     */
    encryptionKey?: NonEmptyString;
    /**
     * A list of tag key and value pairs associated with this build project. These tags are available for use by Amazon Web Services services that support CodeBuild build project tags.
     */
    tags?: TagList;
    /**
     * When the build project was created, expressed in Unix time format.
     */
    created?: Timestamp;
    /**
     * When the build project's settings were last modified, expressed in Unix time format.
     */
    lastModified?: Timestamp;
    /**
     * Information about a webhook that connects repository events to a build project in CodeBuild.
     */
    webhook?: Webhook;
    /**
     * Information about the VPC configuration that CodeBuild accesses.
     */
    vpcConfig?: VpcConfig;
    /**
     * Information about the build badge for the build project.
     */
    badge?: ProjectBadge;
    /**
     * Information about logs for the build project. A project can create logs in CloudWatch Logs, an S3 bucket, or both. 
     */
    logsConfig?: LogsConfig;
    /**
     *  An array of ProjectFileSystemLocation objects for a CodeBuild build project. A ProjectFileSystemLocation object specifies the identifier, location, mountOptions, mountPoint, and type of a file system created using Amazon Elastic File System. 
     */
    fileSystemLocations?: ProjectFileSystemLocations;
    /**
     * A ProjectBuildBatchConfig object that defines the batch build options for the project.
     */
    buildBatchConfig?: ProjectBuildBatchConfig;
    /**
     * The maximum number of concurrent builds that are allowed for this project. New builds are only started if the current number of builds is less than or equal to this limit. If the current build count meets this limit, new builds are throttled and are not run.
     */
    concurrentBuildLimit?: WrapperInt;
    projectVisibility?: ProjectVisibilityType;
    /**
     * Contains the project identifier used with the public build APIs. 
     */
    publicProjectAlias?: NonEmptyString;
    /**
     * The ARN of the IAM role that enables CodeBuild to access the CloudWatch Logs and Amazon S3 artifacts for the project's builds.
     */
    resourceAccessRole?: NonEmptyString;
  }
  export type ProjectArns = NonEmptyString[];
  export interface ProjectArtifacts {
    /**
     * The type of build output artifact. Valid values include:    CODEPIPELINE: The build project has build output generated through CodePipeline.   The CODEPIPELINE type is not supported for secondaryArtifacts.     NO_ARTIFACTS: The build project does not produce any build output.    S3: The build project stores build output in Amazon S3.  
     */
    type: ArtifactsType;
    /**
     * Information about the build output artifact location:   If type is set to CODEPIPELINE, CodePipeline ignores this value if specified. This is because CodePipeline manages its build output locations instead of CodeBuild.   If type is set to NO_ARTIFACTS, this value is ignored if specified, because no build output is produced.   If type is set to S3, this is the name of the output bucket.  
     */
    location?: String;
    /**
     * Along with namespaceType and name, the pattern that CodeBuild uses to name and store the output artifact:   If type is set to CODEPIPELINE, CodePipeline ignores this value if specified. This is because CodePipeline manages its build output names instead of CodeBuild.   If type is set to NO_ARTIFACTS, this value is ignored if specified, because no build output is produced.   If type is set to S3, this is the path to the output artifact. If path is not specified, path is not used.   For example, if path is set to MyArtifacts, namespaceType is set to NONE, and name is set to MyArtifact.zip, the output artifact is stored in the output bucket at MyArtifacts/MyArtifact.zip.
     */
    path?: String;
    /**
     * Along with path and name, the pattern that CodeBuild uses to determine the name and location to store the output artifact:   If type is set to CODEPIPELINE, CodePipeline ignores this value if specified. This is because CodePipeline manages its build output names instead of CodeBuild.   If type is set to NO_ARTIFACTS, this value is ignored if specified, because no build output is produced.   If type is set to S3, valid values include:    BUILD_ID: Include the build ID in the location of the build output artifact.    NONE: Do not include the build ID. This is the default if namespaceType is not specified.     For example, if path is set to MyArtifacts, namespaceType is set to BUILD_ID, and name is set to MyArtifact.zip, the output artifact is stored in MyArtifacts/&lt;build-ID&gt;/MyArtifact.zip.
     */
    namespaceType?: ArtifactNamespace;
    /**
     * Along with path and namespaceType, the pattern that CodeBuild uses to name and store the output artifact:   If type is set to CODEPIPELINE, CodePipeline ignores this value if specified. This is because CodePipeline manages its build output names instead of CodeBuild.   If type is set to NO_ARTIFACTS, this value is ignored if specified, because no build output is produced.   If type is set to S3, this is the name of the output artifact object. If you set the name to be a forward slash ("/"), the artifact is stored in the root of the output bucket.   For example:    If path is set to MyArtifacts, namespaceType is set to BUILD_ID, and name is set to MyArtifact.zip, then the output artifact is stored in MyArtifacts/&lt;build-ID&gt;/MyArtifact.zip.     If path is empty, namespaceType is set to NONE, and name is set to "/", the output artifact is stored in the root of the output bucket.     If path is set to MyArtifacts, namespaceType is set to BUILD_ID, and name is set to "/", the output artifact is stored in MyArtifacts/&lt;build-ID&gt;.   
     */
    name?: String;
    /**
     * The type of build output artifact to create:   If type is set to CODEPIPELINE, CodePipeline ignores this value if specified. This is because CodePipeline manages its build output artifacts instead of CodeBuild.   If type is set to NO_ARTIFACTS, this value is ignored if specified, because no build output is produced.   If type is set to S3, valid values include:    NONE: CodeBuild creates in the output bucket a folder that contains the build output. This is the default if packaging is not specified.    ZIP: CodeBuild creates in the output bucket a ZIP file that contains the build output.    
     */
    packaging?: ArtifactPackaging;
    /**
     *  If this flag is set, a name specified in the buildspec file overrides the artifact name. The name specified in a buildspec file is calculated at build time and uses the Shell Command Language. For example, you can append a date and time to your artifact name so that it is always unique. 
     */
    overrideArtifactName?: WrapperBoolean;
    /**
     *  Set to true if you do not want your output artifacts encrypted. This option is valid only if your artifacts type is Amazon S3. If this is set with another artifacts type, an invalidInputException is thrown. 
     */
    encryptionDisabled?: WrapperBoolean;
    /**
     *  An identifier for this artifact definition. 
     */
    artifactIdentifier?: String;
    bucketOwnerAccess?: BucketOwnerAccess;
  }
  export type ProjectArtifactsList = ProjectArtifacts[];
  export interface ProjectBadge {
    /**
     * Set this to true to generate a publicly accessible URL for your project's build badge.
     */
    badgeEnabled?: Boolean;
    /**
     * The publicly-accessible URL through which you can access the build badge for your project. 
     */
    badgeRequestUrl?: String;
  }
  export interface ProjectBuildBatchConfig {
    /**
     * Specifies the service role ARN for the batch build project.
     */
    serviceRole?: NonEmptyString;
    /**
     * Specifies if the build artifacts for the batch build should be combined into a single artifact location.
     */
    combineArtifacts?: WrapperBoolean;
    /**
     * A BatchRestrictions object that specifies the restrictions for the batch build.
     */
    restrictions?: BatchRestrictions;
    /**
     * Specifies the maximum amount of time, in minutes, that the batch build must be completed in.
     */
    timeoutInMins?: WrapperInt;
    /**
     * Specifies how build status reports are sent to the source provider for the batch build. This property is only used when the source provider for your project is Bitbucket, GitHub, or GitHub Enterprise, and your project is configured to report build statuses to the source provider.  REPORT_AGGREGATED_BATCH  (Default) Aggregate all of the build statuses into a single status report.  REPORT_INDIVIDUAL_BUILDS  Send a separate status report for each individual build.  
     */
    batchReportMode?: BatchReportModeType;
  }
  export interface ProjectCache {
    /**
     * The type of cache used by the build project. Valid values include:    NO_CACHE: The build project does not use any cache.    S3: The build project reads and writes from and to S3.    LOCAL: The build project stores a cache locally on a build host that is only available to that build host.  
     */
    type: CacheType;
    /**
     * Information about the cache location:     NO_CACHE or LOCAL: This value is ignored.    S3: This is the S3 bucket name/prefix.  
     */
    location?: String;
    /**
     * An array of strings that specify the local cache modes. You can use one or more local cache modes at the same time. This is only used for LOCAL cache types. Possible values are:  LOCAL_SOURCE_CACHE  Caches Git metadata for primary and secondary sources. After the cache is created, subsequent builds pull only the change between commits. This mode is a good choice for projects with a clean working directory and a source that is a large Git repository. If you choose this option and your project does not use a Git repository (GitHub, GitHub Enterprise, or Bitbucket), the option is ignored.   LOCAL_DOCKER_LAYER_CACHE  Caches existing Docker layers. This mode is a good choice for projects that build or pull large Docker images. It can prevent the performance issues caused by pulling large Docker images down from the network.     You can use a Docker layer cache in the Linux environment only.    The privileged flag must be set so that your project has the required Docker permissions.    You should consider the security implications before you use a Docker layer cache.      LOCAL_CUSTOM_CACHE  Caches directories you specify in the buildspec file. This mode is a good choice if your build scenario is not suited to one of the other three local cache modes. If you use a custom cache:    Only directories can be specified for caching. You cannot specify individual files.    Symlinks are used to reference cached directories.    Cached directories are linked to your build before it downloads its project sources. Cached items are overridden if a source item has the same name. Directories are specified using cache paths in the buildspec file.     
     */
    modes?: ProjectCacheModes;
  }
  export type ProjectCacheModes = CacheMode[];
  export type ProjectDescription = string;
  export interface ProjectEnvironment {
    /**
     * The type of build environment to use for related builds.   The environment type ARM_CONTAINER is available only in regions US East (N. Virginia), US East (Ohio), US West (Oregon), EU (Ireland), Asia Pacific (Mumbai), Asia Pacific (Tokyo), Asia Pacific (Sydney), and EU (Frankfurt).   The environment type LINUX_CONTAINER with compute type build.general1.2xlarge is available only in regions US East (N. Virginia), US East (Ohio), US West (Oregon), Canada (Central), EU (Ireland), EU (London), EU (Frankfurt), Asia Pacific (Tokyo), Asia Pacific (Seoul), Asia Pacific (Singapore), Asia Pacific (Sydney), China (Beijing), and China (Ningxia).   The environment type LINUX_GPU_CONTAINER is available only in regions US East (N. Virginia), US East (Ohio), US West (Oregon), Canada (Central), EU (Ireland), EU (London), EU (Frankfurt), Asia Pacific (Tokyo), Asia Pacific (Seoul), Asia Pacific (Singapore), Asia Pacific (Sydney) , China (Beijing), and China (Ningxia).     The environment types WINDOWS_CONTAINER and WINDOWS_SERVER_2019_CONTAINER are available only in regions US East (N. Virginia), US East (Ohio), US West (Oregon), and EU (Ireland).   For more information, see Build environment compute types in the CodeBuild user guide.
     */
    type: EnvironmentType;
    /**
     * The image tag or image digest that identifies the Docker image to use for this build project. Use the following formats:   For an image tag: &lt;registry&gt;/&lt;repository&gt;:&lt;tag&gt;. For example, in the Docker repository that CodeBuild uses to manage its Docker images, this would be aws/codebuild/standard:4.0.    For an image digest: &lt;registry&gt;/&lt;repository&gt;@&lt;digest&gt;. For example, to specify an image with the digest "sha256:cbbf2f9a99b47fc460d422812b6a5adff7dfee951d8fa2e4a98caa0382cfbdbf," use &lt;registry&gt;/&lt;repository&gt;@sha256:cbbf2f9a99b47fc460d422812b6a5adff7dfee951d8fa2e4a98caa0382cfbdbf.   For more information, see Docker images provided by CodeBuild in the CodeBuild user guide.
     */
    image: NonEmptyString;
    /**
     * Information about the compute resources the build project uses. Available values include:    BUILD_GENERAL1_SMALL: Use up to 3 GB memory and 2 vCPUs for builds.    BUILD_GENERAL1_MEDIUM: Use up to 7 GB memory and 4 vCPUs for builds.    BUILD_GENERAL1_LARGE: Use up to 16 GB memory and 8 vCPUs for builds, depending on your environment type.    BUILD_GENERAL1_2XLARGE: Use up to 145 GB memory, 72 vCPUs, and 824 GB of SSD storage for builds. This compute type supports Docker images up to 100 GB uncompressed.    If you use BUILD_GENERAL1_LARGE:     For environment type LINUX_CONTAINER, you can use up to 15 GB memory and 8 vCPUs for builds.     For environment type LINUX_GPU_CONTAINER, you can use up to 255 GB memory, 32 vCPUs, and 4 NVIDIA Tesla V100 GPUs for builds.    For environment type ARM_CONTAINER, you can use up to 16 GB memory and 8 vCPUs on ARM-based processors for builds.   For more information, see Build Environment Compute Types in the CodeBuild User Guide. 
     */
    computeType: ComputeType;
    /**
     * A set of environment variables to make available to builds for this build project.
     */
    environmentVariables?: EnvironmentVariables;
    /**
     * Enables running the Docker daemon inside a Docker container. Set to true only if the build project is used to build Docker images. Otherwise, a build that attempts to interact with the Docker daemon fails. The default setting is false. You can initialize the Docker daemon during the install phase of your build by adding one of the following sets of commands to the install phase of your buildspec file: If the operating system's base image is Ubuntu Linux:  - nohup /usr/local/bin/dockerd --host=unix:///var/run/docker.sock --host=tcp://0.0.0.0:2375 --storage-driver=overlay&amp;   - timeout 15 sh -c "until docker info; do echo .; sleep 1; done"  If the operating system's base image is Alpine Linux and the previous command does not work, add the -t argument to timeout:  - nohup /usr/local/bin/dockerd --host=unix:///var/run/docker.sock --host=tcp://0.0.0.0:2375 --storage-driver=overlay&amp;   - timeout -t 15 sh -c "until docker info; do echo .; sleep 1; done" 
     */
    privilegedMode?: WrapperBoolean;
    /**
     * The ARN of the Amazon S3 bucket, path prefix, and object key that contains the PEM-encoded certificate for the build project. For more information, see certificate in the CodeBuild User Guide.
     */
    certificate?: String;
    /**
     *  The credentials for access to a private registry.
     */
    registryCredential?: RegistryCredential;
    /**
     *  The type of credentials CodeBuild uses to pull images in your build. There are two valid values:     CODEBUILD specifies that CodeBuild uses its own credentials. This requires that you modify your ECR repository policy to trust CodeBuild service principal.     SERVICE_ROLE specifies that CodeBuild uses your build project's service role.     When you use a cross-account or private registry image, you must use SERVICE_ROLE credentials. When you use an CodeBuild curated image, you must use CODEBUILD credentials. 
     */
    imagePullCredentialsType?: ImagePullCredentialsType;
  }
  export interface ProjectFileSystemLocation {
    /**
     *  The type of the file system. The one supported type is EFS. 
     */
    type?: FileSystemType;
    /**
     * A string that specifies the location of the file system created by Amazon EFS. Its format is efs-dns-name:/directory-path. You can find the DNS name of file system when you view it in the Amazon EFS console. The directory path is a path to a directory in the file system that CodeBuild mounts. For example, if the DNS name of a file system is fs-abcd1234.efs.us-west-2.amazonaws.com, and its mount directory is my-efs-mount-directory, then the location is fs-abcd1234.efs.us-west-2.amazonaws.com:/my-efs-mount-directory.  The directory path in the format efs-dns-name:/directory-path is optional. If you do not specify a directory path, the location is only the DNS name and CodeBuild mounts the entire file system. 
     */
    location?: String;
    /**
     * The location in the container where you mount the file system. 
     */
    mountPoint?: String;
    /**
     * The name used to access a file system created by Amazon EFS. CodeBuild creates an environment variable by appending the identifier in all capital letters to CODEBUILD_. For example, if you specify my_efs for identifier, a new environment variable is create named CODEBUILD_MY_EFS.   The identifier is used to mount your file system. 
     */
    identifier?: String;
    /**
     *  The mount options for a file system created by Amazon EFS. The default mount options used by CodeBuild are nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2. For more information, see Recommended NFS Mount Options. 
     */
    mountOptions?: String;
  }
  export type ProjectFileSystemLocations = ProjectFileSystemLocation[];
  export type ProjectName = string;
  export type ProjectNames = NonEmptyString[];
  export type ProjectSecondarySourceVersions = ProjectSourceVersion[];
  export type ProjectSortByType = "NAME"|"CREATED_TIME"|"LAST_MODIFIED_TIME"|string;
  export interface ProjectSource {
    /**
     * The type of repository that contains the source code to be built. Valid values include:    BITBUCKET: The source code is in a Bitbucket repository.    CODECOMMIT: The source code is in an CodeCommit repository.    CODEPIPELINE: The source code settings are specified in the source action of a pipeline in CodePipeline.    GITHUB: The source code is in a GitHub or GitHub Enterprise Cloud repository.    GITHUB_ENTERPRISE: The source code is in a GitHub Enterprise Server repository.    NO_SOURCE: The project does not have input source code.    S3: The source code is in an Amazon S3 bucket.  
     */
    type: SourceType;
    /**
     * Information about the location of the source code to be built. Valid values include:   For source code settings that are specified in the source action of a pipeline in CodePipeline, location should not be specified. If it is specified, CodePipeline ignores it. This is because CodePipeline uses the settings in a pipeline's source action instead of this value.   For source code in an CodeCommit repository, the HTTPS clone URL to the repository that contains the source code and the buildspec file (for example, https://git-codecommit.&lt;region-ID&gt;.amazonaws.com/v1/repos/&lt;repo-name&gt;).   For source code in an Amazon S3 input bucket, one of the following.    The path to the ZIP file that contains the source code (for example, &lt;bucket-name&gt;/&lt;path&gt;/&lt;object-name&gt;.zip).    The path to the folder that contains the source code (for example, &lt;bucket-name&gt;/&lt;path-to-source-code&gt;/&lt;folder&gt;/).      For source code in a GitHub repository, the HTTPS clone URL to the repository that contains the source and the buildspec file. You must connect your Amazon Web Services account to your GitHub account. Use the CodeBuild console to start creating a build project. When you use the console to connect (or reconnect) with GitHub, on the GitHub Authorize application page, for Organization access, choose Request access next to each repository you want to allow CodeBuild to have access to, and then choose Authorize application. (After you have connected to your GitHub account, you do not need to finish creating the build project. You can leave the CodeBuild console.) To instruct CodeBuild to use this connection, in the source object, set the auth object's type value to OAUTH.   For source code in a Bitbucket repository, the HTTPS clone URL to the repository that contains the source and the buildspec file. You must connect your Amazon Web Services account to your Bitbucket account. Use the CodeBuild console to start creating a build project. When you use the console to connect (or reconnect) with Bitbucket, on the Bitbucket Confirm access to your account page, choose Grant access. (After you have connected to your Bitbucket account, you do not need to finish creating the build project. You can leave the CodeBuild console.) To instruct CodeBuild to use this connection, in the source object, set the auth object's type value to OAUTH.    If you specify CODEPIPELINE for the Type property, don't specify this property. For all of the other types, you must specify Location. 
     */
    location?: String;
    /**
     * Information about the Git clone depth for the build project.
     */
    gitCloneDepth?: GitCloneDepth;
    /**
     *  Information about the Git submodules configuration for the build project. 
     */
    gitSubmodulesConfig?: GitSubmodulesConfig;
    /**
     * The buildspec file declaration to use for the builds in this build project.  If this value is set, it can be either an inline buildspec definition, the path to an alternate buildspec file relative to the value of the built-in CODEBUILD_SRC_DIR environment variable, or the path to an S3 bucket. The bucket must be in the same Amazon Web Services Region as the build project. Specify the buildspec file using its ARN (for example, arn:aws:s3:::my-codebuild-sample2/buildspec.yml). If this value is not provided or is set to an empty string, the source code must contain a buildspec file in its root directory. For more information, see Buildspec File Name and Storage Location. 
     */
    buildspec?: String;
    /**
     * Information about the authorization settings for CodeBuild to access the source code to be built. This information is for the CodeBuild console's use only. Your code should not get or set this information directly.
     */
    auth?: SourceAuth;
    /**
     *  Set to true to report the status of a build's start and finish to your source provider. This option is valid only when your source provider is GitHub, GitHub Enterprise, or Bitbucket. If this is set and you use a different source provider, an invalidInputException is thrown.  To be able to report the build status to the source provider, the user associated with the source provider must have write access to the repo. If the user does not have write access, the build status cannot be updated. For more information, see Source provider access in the CodeBuild User Guide. The status of a build triggered by a webhook is always reported to your source provider.  If your project's builds are triggered by a webhook, you must push a new commit to the repo for a change to this property to take effect.
     */
    reportBuildStatus?: WrapperBoolean;
    /**
     * Contains information that defines how the build project reports the build status to the source provider. This option is only used when the source provider is GITHUB, GITHUB_ENTERPRISE, or BITBUCKET.
     */
    buildStatusConfig?: BuildStatusConfig;
    /**
     * Enable this flag to ignore SSL warnings while connecting to the project source code.
     */
    insecureSsl?: WrapperBoolean;
    /**
     * An identifier for this project source. The identifier can only contain alphanumeric characters and underscores, and must be less than 128 characters in length. 
     */
    sourceIdentifier?: String;
  }
  export interface ProjectSourceVersion {
    /**
     * An identifier for a source in the build project. The identifier can only contain alphanumeric characters and underscores, and must be less than 128 characters in length. 
     */
    sourceIdentifier: String;
    /**
     * The source version for the corresponding source identifier. If specified, must be one of:   For CodeCommit: the commit ID, branch, or Git tag to use.   For GitHub: the commit ID, pull request ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a pull request ID is specified, it must use the format pr/pull-request-ID (for example, pr/25). If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.   For Bitbucket: the commit ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.   For Amazon S3: the version ID of the object that represents the build input ZIP file to use.    For more information, see Source Version Sample with CodeBuild in the CodeBuild User Guide. 
     */
    sourceVersion: String;
  }
  export type ProjectSources = ProjectSource[];
  export type ProjectVisibilityType = "PUBLIC_READ"|"PRIVATE"|string;
  export type Projects = Project[];
  export interface PutResourcePolicyInput {
    /**
     *  A JSON-formatted resource policy. For more information, see Sharing a Project and Sharing a Report Group in the CodeBuild User Guide. 
     */
    policy: NonEmptyString;
    /**
     *  The ARN of the Project or ReportGroup resource you want to associate with a resource policy. 
     */
    resourceArn: NonEmptyString;
  }
  export interface PutResourcePolicyOutput {
    /**
     *  The ARN of the Project or ReportGroup resource that is associated with a resource policy. 
     */
    resourceArn?: NonEmptyString;
  }
  export interface RegistryCredential {
    /**
     *  The Amazon Resource Name (ARN) or name of credentials created using Secrets Manager.    The credential can use the name of the credentials only if they exist in your current Amazon Web Services Region.  
     */
    credential: NonEmptyString;
    /**
     *  The service that created the credentials to access a private Docker registry. The valid value, SECRETS_MANAGER, is for Secrets Manager. 
     */
    credentialProvider: CredentialProviderType;
  }
  export interface Report {
    /**
     *  The ARN of the report run. 
     */
    arn?: NonEmptyString;
    /**
     * The type of the report that was run.  CODE_COVERAGE  A code coverage report.  TEST  A test report.  
     */
    type?: ReportType;
    /**
     *  The name of the report that was run. 
     */
    name?: String;
    /**
     *  The ARN of the report group associated with this report. 
     */
    reportGroupArn?: NonEmptyString;
    /**
     *  The ARN of the build run that generated this report. 
     */
    executionId?: String;
    /**
     *  The status of this report. 
     */
    status?: ReportStatusType;
    /**
     *  The date and time this report run occurred. 
     */
    created?: Timestamp;
    /**
     *  The date and time a report expires. A report expires 30 days after it is created. An expired report is not available to view in CodeBuild. 
     */
    expired?: Timestamp;
    /**
     *  Information about where the raw data used to generate this report was exported. 
     */
    exportConfig?: ReportExportConfig;
    /**
     *  A boolean that specifies if this report run is truncated. The list of test cases is truncated after the maximum number of test cases is reached. 
     */
    truncated?: WrapperBoolean;
    /**
     *  A TestReportSummary object that contains information about this test report. 
     */
    testSummary?: TestReportSummary;
    /**
     * A CodeCoverageReportSummary object that contains a code coverage summary for this report.
     */
    codeCoverageSummary?: CodeCoverageReportSummary;
  }
  export type ReportArns = NonEmptyString[];
  export type ReportCodeCoverageSortByType = "LINE_COVERAGE_PERCENTAGE"|"FILE_PATH"|string;
  export interface ReportExportConfig {
    /**
     *  The export configuration type. Valid values are:     S3: The report results are exported to an S3 bucket.     NO_EXPORT: The report results are not exported.   
     */
    exportConfigType?: ReportExportConfigType;
    /**
     *  A S3ReportExportConfig object that contains information about the S3 bucket where the run of a report is exported. 
     */
    s3Destination?: S3ReportExportConfig;
  }
  export type ReportExportConfigType = "S3"|"NO_EXPORT"|string;
  export interface ReportFilter {
    /**
     *  The status used to filter reports. You can filter using one status only. 
     */
    status?: ReportStatusType;
  }
  export interface ReportGroup {
    /**
     * The ARN of the ReportGroup. 
     */
    arn?: NonEmptyString;
    /**
     * The name of the ReportGroup. 
     */
    name?: ReportGroupName;
    /**
     * The type of the ReportGroup. This can be one of the following values:  CODE_COVERAGE  The report group contains code coverage reports.  TEST  The report group contains test reports.  
     */
    type?: ReportType;
    /**
     * Information about the destination where the raw data of this ReportGroup is exported. 
     */
    exportConfig?: ReportExportConfig;
    /**
     * The date and time this ReportGroup was created. 
     */
    created?: Timestamp;
    /**
     * The date and time this ReportGroup was last modified. 
     */
    lastModified?: Timestamp;
    /**
     * A list of tag key and value pairs associated with this report group.  These tags are available for use by Amazon Web Services services that support CodeBuild report group tags.
     */
    tags?: TagList;
    /**
     * The status of the report group. This property is read-only. This can be one of the following values:  ACTIVE  The report group is active.  DELETING  The report group is in the process of being deleted.  
     */
    status?: ReportGroupStatusType;
  }
  export type ReportGroupArns = NonEmptyString[];
  export type ReportGroupName = string;
  export type ReportGroupSortByType = "NAME"|"CREATED_TIME"|"LAST_MODIFIED_TIME"|string;
  export type ReportGroupStatusType = "ACTIVE"|"DELETING"|string;
  export type ReportGroupTrendFieldType = "PASS_RATE"|"DURATION"|"TOTAL"|"LINE_COVERAGE"|"LINES_COVERED"|"LINES_MISSED"|"BRANCH_COVERAGE"|"BRANCHES_COVERED"|"BRANCHES_MISSED"|string;
  export type ReportGroupTrendRawDataList = ReportWithRawData[];
  export interface ReportGroupTrendStats {
    /**
     * Contains the average of all values analyzed.
     */
    average?: String;
    /**
     * Contains the maximum value analyzed.
     */
    max?: String;
    /**
     * Contains the minimum value analyzed.
     */
    min?: String;
  }
  export type ReportGroups = ReportGroup[];
  export type ReportPackagingType = "ZIP"|"NONE"|string;
  export type ReportStatusCounts = {[key: string]: WrapperInt};
  export type ReportStatusType = "GENERATING"|"SUCCEEDED"|"FAILED"|"INCOMPLETE"|"DELETING"|string;
  export type ReportType = "TEST"|"CODE_COVERAGE"|string;
  export interface ReportWithRawData {
    /**
     * The ARN of the report.
     */
    reportArn?: NonEmptyString;
    /**
     * The value of the requested data field from the report.
     */
    data?: String;
  }
  export type Reports = Report[];
  export interface ResolvedArtifact {
    /**
     * Specifies the type of artifact.
     */
    type?: ArtifactsType;
    /**
     * The location of the artifact.
     */
    location?: String;
    /**
     * The identifier of the artifact.
     */
    identifier?: String;
  }
  export type ResolvedSecondaryArtifacts = ResolvedArtifact[];
  export interface RetryBuildBatchInput {
    /**
     * Specifies the identifier of the batch build to restart.
     */
    id?: NonEmptyString;
    /**
     * A unique, case sensitive identifier you provide to ensure the idempotency of the RetryBuildBatch request. The token is included in the RetryBuildBatch request and is valid for five minutes. If you repeat the RetryBuildBatch request with the same token, but change a parameter, CodeBuild returns a parameter mismatch error.
     */
    idempotencyToken?: String;
    /**
     * Specifies the type of retry to perform.
     */
    retryType?: RetryBuildBatchType;
  }
  export interface RetryBuildBatchOutput {
    buildBatch?: BuildBatch;
  }
  export type RetryBuildBatchType = "RETRY_ALL_BUILDS"|"RETRY_FAILED_BUILDS"|string;
  export interface RetryBuildInput {
    /**
     * Specifies the identifier of the build to restart.
     */
    id?: NonEmptyString;
    /**
     * A unique, case sensitive identifier you provide to ensure the idempotency of the RetryBuild request. The token is included in the RetryBuild request and is valid for five minutes. If you repeat the RetryBuild request with the same token, but change a parameter, CodeBuild returns a parameter mismatch error.
     */
    idempotencyToken?: String;
  }
  export interface RetryBuildOutput {
    build?: Build;
  }
  export interface S3LogsConfig {
    /**
     * The current status of the S3 build logs. Valid values are:    ENABLED: S3 build logs are enabled for this build project.    DISABLED: S3 build logs are not enabled for this build project.  
     */
    status: LogsConfigStatusType;
    /**
     *  The ARN of an S3 bucket and the path prefix for S3 logs. If your Amazon S3 bucket name is my-bucket, and your path prefix is build-log, then acceptable formats are my-bucket/build-log or arn:aws:s3:::my-bucket/build-log. 
     */
    location?: String;
    /**
     *  Set to true if you do not want your S3 build log output encrypted. By default S3 build logs are encrypted. 
     */
    encryptionDisabled?: WrapperBoolean;
    bucketOwnerAccess?: BucketOwnerAccess;
  }
  export interface S3ReportExportConfig {
    /**
     *  The name of the S3 bucket where the raw data of a report are exported. 
     */
    bucket?: NonEmptyString;
    /**
     * The Amazon Web Services account identifier of the owner of the Amazon S3 bucket. This allows report data to be exported to an Amazon S3 bucket that is owned by an account other than the account running the build.
     */
    bucketOwner?: String;
    /**
     *  The path to the exported report's raw data results. 
     */
    path?: String;
    /**
     *  The type of build output artifact to create. Valid values include:     NONE: CodeBuild creates the raw data in the output bucket. This is the default if packaging is not specified.     ZIP: CodeBuild creates a ZIP file with the raw data in the output bucket.   
     */
    packaging?: ReportPackagingType;
    /**
     *  The encryption key for the report's encrypted raw data. 
     */
    encryptionKey?: NonEmptyString;
    /**
     *  A boolean value that specifies if the results of a report are encrypted. 
     */
    encryptionDisabled?: WrapperBoolean;
  }
  export type SecurityGroupIds = NonEmptyString[];
  export type SensitiveNonEmptyString = string;
  export type ServerType = "GITHUB"|"BITBUCKET"|"GITHUB_ENTERPRISE"|string;
  export type SharedResourceSortByType = "ARN"|"MODIFIED_TIME"|string;
  export type SortOrderType = "ASCENDING"|"DESCENDING"|string;
  export interface SourceAuth {
    /**
     *   This data type is deprecated and is no longer accurate or used.   The authorization type to use. The only valid value is OAUTH, which represents the OAuth authorization type.
     */
    type: SourceAuthType;
    /**
     * The resource value that applies to the specified authorization type.
     */
    resource?: String;
  }
  export type SourceAuthType = "OAUTH"|string;
  export interface SourceCredentialsInfo {
    /**
     *  The Amazon Resource Name (ARN) of the token. 
     */
    arn?: NonEmptyString;
    /**
     *  The type of source provider. The valid options are GITHUB, GITHUB_ENTERPRISE, or BITBUCKET. 
     */
    serverType?: ServerType;
    /**
     *  The type of authentication used by the credentials. Valid options are OAUTH, BASIC_AUTH, or PERSONAL_ACCESS_TOKEN. 
     */
    authType?: AuthType;
  }
  export type SourceCredentialsInfos = SourceCredentialsInfo[];
  export type SourceType = "CODECOMMIT"|"CODEPIPELINE"|"GITHUB"|"S3"|"BITBUCKET"|"GITHUB_ENTERPRISE"|"NO_SOURCE"|string;
  export interface StartBuildBatchInput {
    /**
     * The name of the project.
     */
    projectName: NonEmptyString;
    /**
     * An array of ProjectSource objects that override the secondary sources defined in the batch build project.
     */
    secondarySourcesOverride?: ProjectSources;
    /**
     * An array of ProjectSourceVersion objects that override the secondary source versions in the batch build project.
     */
    secondarySourcesVersionOverride?: ProjectSecondarySourceVersions;
    /**
     * The version of the batch build input to be built, for this build only. If not specified, the latest version is used. If specified, the contents depends on the source provider:  CodeCommit  The commit ID, branch, or Git tag to use.  GitHub  The commit ID, pull request ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a pull request ID is specified, it must use the format pr/pull-request-ID (for example pr/25). If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.  Bitbucket  The commit ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.  Amazon S3  The version ID of the object that represents the build input ZIP file to use.   If sourceVersion is specified at the project level, then this sourceVersion (at the build level) takes precedence.  For more information, see Source Version Sample with CodeBuild in the CodeBuild User Guide. 
     */
    sourceVersion?: String;
    /**
     * An array of ProjectArtifacts objects that contains information about the build output artifact overrides for the build project.
     */
    artifactsOverride?: ProjectArtifacts;
    /**
     * An array of ProjectArtifacts objects that override the secondary artifacts defined in the batch build project.
     */
    secondaryArtifactsOverride?: ProjectArtifactsList;
    /**
     * An array of EnvironmentVariable objects that override, or add to, the environment variables defined in the batch build project.
     */
    environmentVariablesOverride?: EnvironmentVariables;
    /**
     * The source input type that overrides the source input defined in the batch build project.
     */
    sourceTypeOverride?: SourceType;
    /**
     * A location that overrides, for this batch build, the source location defined in the batch build project.
     */
    sourceLocationOverride?: String;
    /**
     * A SourceAuth object that overrides the one defined in the batch build project. This override applies only if the build project's source is BitBucket or GitHub.
     */
    sourceAuthOverride?: SourceAuth;
    /**
     * The user-defined depth of history, with a minimum value of 0, that overrides, for this batch build only, any previous depth of history defined in the batch build project.
     */
    gitCloneDepthOverride?: GitCloneDepth;
    /**
     * A GitSubmodulesConfig object that overrides the Git submodules configuration for this batch build.
     */
    gitSubmodulesConfigOverride?: GitSubmodulesConfig;
    /**
     * A buildspec file declaration that overrides, for this build only, the latest one already defined in the build project. If this value is set, it can be either an inline buildspec definition, the path to an alternate buildspec file relative to the value of the built-in CODEBUILD_SRC_DIR environment variable, or the path to an S3 bucket. The bucket must be in the same Amazon Web Services Region as the build project. Specify the buildspec file using its ARN (for example, arn:aws:s3:::my-codebuild-sample2/buildspec.yml). If this value is not provided or is set to an empty string, the source code must contain a buildspec file in its root directory. For more information, see Buildspec File Name and Storage Location. 
     */
    buildspecOverride?: String;
    /**
     * Enable this flag to override the insecure SSL setting that is specified in the batch build project. The insecure SSL setting determines whether to ignore SSL warnings while connecting to the project source code. This override applies only if the build's source is GitHub Enterprise.
     */
    insecureSslOverride?: WrapperBoolean;
    /**
     * Set to true to report to your source provider the status of a batch build's start and completion. If you use this option with a source provider other than GitHub, GitHub Enterprise, or Bitbucket, an invalidInputException is thrown.   The status of a build triggered by a webhook is always reported to your source provider.  
     */
    reportBuildBatchStatusOverride?: WrapperBoolean;
    /**
     * A container type for this batch build that overrides the one specified in the batch build project.
     */
    environmentTypeOverride?: EnvironmentType;
    /**
     * The name of an image for this batch build that overrides the one specified in the batch build project.
     */
    imageOverride?: NonEmptyString;
    /**
     * The name of a compute type for this batch build that overrides the one specified in the batch build project.
     */
    computeTypeOverride?: ComputeType;
    /**
     * The name of a certificate for this batch build that overrides the one specified in the batch build project.
     */
    certificateOverride?: String;
    /**
     * A ProjectCache object that specifies cache overrides.
     */
    cacheOverride?: ProjectCache;
    /**
     * The name of a service role for this batch build that overrides the one specified in the batch build project.
     */
    serviceRoleOverride?: NonEmptyString;
    /**
     * Enable this flag to override privileged mode in the batch build project.
     */
    privilegedModeOverride?: WrapperBoolean;
    /**
     * Overrides the build timeout specified in the batch build project.
     */
    buildTimeoutInMinutesOverride?: TimeOut;
    /**
     * The number of minutes a batch build is allowed to be queued before it times out.
     */
    queuedTimeoutInMinutesOverride?: TimeOut;
    /**
     * The Key Management Service customer master key (CMK) that overrides the one specified in the batch build project. The CMK key encrypts the build output artifacts.  You can use a cross-account KMS key to encrypt the build output artifacts if your service role has permission to that key.   You can specify either the Amazon Resource Name (ARN) of the CMK or, if available, the CMK's alias (using the format alias/&lt;alias-name&gt;).
     */
    encryptionKeyOverride?: NonEmptyString;
    /**
     * A unique, case sensitive identifier you provide to ensure the idempotency of the StartBuildBatch request. The token is included in the StartBuildBatch request and is valid for five minutes. If you repeat the StartBuildBatch request with the same token, but change a parameter, CodeBuild returns a parameter mismatch error.
     */
    idempotencyToken?: String;
    /**
     * A LogsConfig object that override the log settings defined in the batch build project.
     */
    logsConfigOverride?: LogsConfig;
    /**
     * A RegistryCredential object that overrides credentials for access to a private registry.
     */
    registryCredentialOverride?: RegistryCredential;
    /**
     * The type of credentials CodeBuild uses to pull images in your batch build. There are two valid values:   CODEBUILD  Specifies that CodeBuild uses its own credentials. This requires that you modify your ECR repository policy to trust CodeBuild's service principal.  SERVICE_ROLE  Specifies that CodeBuild uses your build project's service role.    When using a cross-account or private registry image, you must use SERVICE_ROLE credentials. When using an CodeBuild curated image, you must use CODEBUILD credentials. 
     */
    imagePullCredentialsTypeOverride?: ImagePullCredentialsType;
    /**
     * A BuildBatchConfigOverride object that contains batch build configuration overrides.
     */
    buildBatchConfigOverride?: ProjectBuildBatchConfig;
    /**
     * Specifies if session debugging is enabled for this batch build. For more information, see Viewing a running build in Session Manager. Batch session debugging is not supported for matrix batch builds.
     */
    debugSessionEnabled?: WrapperBoolean;
  }
  export interface StartBuildBatchOutput {
    /**
     * A BuildBatch object that contains information about the batch build.
     */
    buildBatch?: BuildBatch;
  }
  export interface StartBuildInput {
    /**
     * The name of the CodeBuild build project to start running a build.
     */
    projectName: NonEmptyString;
    /**
     *  An array of ProjectSource objects. 
     */
    secondarySourcesOverride?: ProjectSources;
    /**
     *  An array of ProjectSourceVersion objects that specify one or more versions of the project's secondary sources to be used for this build only. 
     */
    secondarySourcesVersionOverride?: ProjectSecondarySourceVersions;
    /**
     * The version of the build input to be built, for this build only. If not specified, the latest version is used. If specified, the contents depends on the source provider:  CodeCommit  The commit ID, branch, or Git tag to use.  GitHub  The commit ID, pull request ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a pull request ID is specified, it must use the format pr/pull-request-ID (for example pr/25). If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.  Bitbucket  The commit ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.  Amazon S3  The version ID of the object that represents the build input ZIP file to use.   If sourceVersion is specified at the project level, then this sourceVersion (at the build level) takes precedence.  For more information, see Source Version Sample with CodeBuild in the CodeBuild User Guide. 
     */
    sourceVersion?: String;
    /**
     * Build output artifact settings that override, for this build only, the latest ones already defined in the build project.
     */
    artifactsOverride?: ProjectArtifacts;
    /**
     *  An array of ProjectArtifacts objects. 
     */
    secondaryArtifactsOverride?: ProjectArtifactsList;
    /**
     * A set of environment variables that overrides, for this build only, the latest ones already defined in the build project.
     */
    environmentVariablesOverride?: EnvironmentVariables;
    /**
     * A source input type, for this build, that overrides the source input defined in the build project.
     */
    sourceTypeOverride?: SourceType;
    /**
     * A location that overrides, for this build, the source location for the one defined in the build project.
     */
    sourceLocationOverride?: String;
    /**
     * An authorization type for this build that overrides the one defined in the build project. This override applies only if the build project's source is BitBucket or GitHub.
     */
    sourceAuthOverride?: SourceAuth;
    /**
     * The user-defined depth of history, with a minimum value of 0, that overrides, for this build only, any previous depth of history defined in the build project.
     */
    gitCloneDepthOverride?: GitCloneDepth;
    /**
     *  Information about the Git submodules configuration for this build of an CodeBuild build project. 
     */
    gitSubmodulesConfigOverride?: GitSubmodulesConfig;
    /**
     * A buildspec file declaration that overrides, for this build only, the latest one already defined in the build project.  If this value is set, it can be either an inline buildspec definition, the path to an alternate buildspec file relative to the value of the built-in CODEBUILD_SRC_DIR environment variable, or the path to an S3 bucket. The bucket must be in the same Amazon Web Services Region as the build project. Specify the buildspec file using its ARN (for example, arn:aws:s3:::my-codebuild-sample2/buildspec.yml). If this value is not provided or is set to an empty string, the source code must contain a buildspec file in its root directory. For more information, see Buildspec File Name and Storage Location. 
     */
    buildspecOverride?: String;
    /**
     * Enable this flag to override the insecure SSL setting that is specified in the build project. The insecure SSL setting determines whether to ignore SSL warnings while connecting to the project source code. This override applies only if the build's source is GitHub Enterprise.
     */
    insecureSslOverride?: WrapperBoolean;
    /**
     *  Set to true to report to your source provider the status of a build's start and completion. If you use this option with a source provider other than GitHub, GitHub Enterprise, or Bitbucket, an invalidInputException is thrown.  To be able to report the build status to the source provider, the user associated with the source provider must have write access to the repo. If the user does not have write access, the build status cannot be updated. For more information, see Source provider access in the CodeBuild User Guide.   The status of a build triggered by a webhook is always reported to your source provider.  
     */
    reportBuildStatusOverride?: WrapperBoolean;
    /**
     * Contains information that defines how the build project reports the build status to the source provider. This option is only used when the source provider is GITHUB, GITHUB_ENTERPRISE, or BITBUCKET.
     */
    buildStatusConfigOverride?: BuildStatusConfig;
    /**
     * A container type for this build that overrides the one specified in the build project.
     */
    environmentTypeOverride?: EnvironmentType;
    /**
     * The name of an image for this build that overrides the one specified in the build project.
     */
    imageOverride?: NonEmptyString;
    /**
     * The name of a compute type for this build that overrides the one specified in the build project.
     */
    computeTypeOverride?: ComputeType;
    /**
     * The name of a certificate for this build that overrides the one specified in the build project.
     */
    certificateOverride?: String;
    /**
     * A ProjectCache object specified for this build that overrides the one defined in the build project.
     */
    cacheOverride?: ProjectCache;
    /**
     * The name of a service role for this build that overrides the one specified in the build project.
     */
    serviceRoleOverride?: NonEmptyString;
    /**
     * Enable this flag to override privileged mode in the build project.
     */
    privilegedModeOverride?: WrapperBoolean;
    /**
     * The number of build timeout minutes, from 5 to 480 (8 hours), that overrides, for this build only, the latest setting already defined in the build project.
     */
    timeoutInMinutesOverride?: TimeOut;
    /**
     *  The number of minutes a build is allowed to be queued before it times out. 
     */
    queuedTimeoutInMinutesOverride?: TimeOut;
    /**
     * The Key Management Service customer master key (CMK) that overrides the one specified in the build project. The CMK key encrypts the build output artifacts.   You can use a cross-account KMS key to encrypt the build output artifacts if your service role has permission to that key.   You can specify either the Amazon Resource Name (ARN) of the CMK or, if available, the CMK's alias (using the format alias/&lt;alias-name&gt;).
     */
    encryptionKeyOverride?: NonEmptyString;
    /**
     * A unique, case sensitive identifier you provide to ensure the idempotency of the StartBuild request. The token is included in the StartBuild request and is valid for 5 minutes. If you repeat the StartBuild request with the same token, but change a parameter, CodeBuild returns a parameter mismatch error. 
     */
    idempotencyToken?: String;
    /**
     *  Log settings for this build that override the log settings defined in the build project. 
     */
    logsConfigOverride?: LogsConfig;
    /**
     *  The credentials for access to a private registry. 
     */
    registryCredentialOverride?: RegistryCredential;
    /**
     * The type of credentials CodeBuild uses to pull images in your build. There are two valid values:   CODEBUILD  Specifies that CodeBuild uses its own credentials. This requires that you modify your ECR repository policy to trust CodeBuild's service principal.  SERVICE_ROLE  Specifies that CodeBuild uses your build project's service role.    When using a cross-account or private registry image, you must use SERVICE_ROLE credentials. When using an CodeBuild curated image, you must use CODEBUILD credentials. 
     */
    imagePullCredentialsTypeOverride?: ImagePullCredentialsType;
    /**
     * Specifies if session debugging is enabled for this build. For more information, see Viewing a running build in Session Manager.
     */
    debugSessionEnabled?: WrapperBoolean;
  }
  export interface StartBuildOutput {
    /**
     * Information about the build to be run.
     */
    build?: Build;
  }
  export type StatusType = "SUCCEEDED"|"FAILED"|"FAULT"|"TIMED_OUT"|"IN_PROGRESS"|"STOPPED"|string;
  export interface StopBuildBatchInput {
    /**
     * The identifier of the batch build to stop.
     */
    id: NonEmptyString;
  }
  export interface StopBuildBatchOutput {
    buildBatch?: BuildBatch;
  }
  export interface StopBuildInput {
    /**
     * The ID of the build.
     */
    id: NonEmptyString;
  }
  export interface StopBuildOutput {
    /**
     * Information about the build.
     */
    build?: Build;
  }
  export type String = string;
  export type Subnets = NonEmptyString[];
  export interface Tag {
    /**
     * The tag's key.
     */
    key?: KeyInput;
    /**
     * The tag's value.
     */
    value?: ValueInput;
  }
  export type TagList = Tag[];
  export interface TestCase {
    /**
     *  The ARN of the report to which the test case belongs. 
     */
    reportArn?: NonEmptyString;
    /**
     *  The path to the raw data file that contains the test result. 
     */
    testRawDataPath?: String;
    /**
     *  A string that is applied to a series of related test cases. CodeBuild generates the prefix. The prefix depends on the framework used to generate the tests. 
     */
    prefix?: String;
    /**
     *  The name of the test case. 
     */
    name?: String;
    /**
     *  The status returned by the test case after it was run. Valid statuses are SUCCEEDED, FAILED, ERROR, SKIPPED, and UNKNOWN. 
     */
    status?: String;
    /**
     *  The number of nanoseconds it took to run this test case. 
     */
    durationInNanoSeconds?: WrapperLong;
    /**
     *  A message associated with a test case. For example, an error message or stack trace. 
     */
    message?: String;
    /**
     *  The date and time a test case expires. A test case expires 30 days after it is created. An expired test case is not available to view in CodeBuild. 
     */
    expired?: Timestamp;
  }
  export interface TestCaseFilter {
    /**
     * The status used to filter test cases. A TestCaseFilter can have one status. Valid values are:    SUCCEEDED     FAILED     ERROR     SKIPPED     UNKNOWN   
     */
    status?: String;
    /**
     * A keyword that is used to filter on the name or the prefix of the test cases. Only test cases where the keyword is a substring of the name or the prefix will be returned.
     */
    keyword?: String;
  }
  export type TestCases = TestCase[];
  export interface TestReportSummary {
    /**
     *  The number of test cases in this TestReportSummary. The total includes truncated test cases. 
     */
    total: WrapperInt;
    /**
     *  A map that contains the number of each type of status returned by the test results in this TestReportSummary. 
     */
    statusCounts: ReportStatusCounts;
    /**
     *  The number of nanoseconds it took to run all of the test cases in this report. 
     */
    durationInNanoSeconds: WrapperLong;
  }
  export type TimeOut = number;
  export type Timestamp = Date;
  export interface UpdateProjectInput {
    /**
     * The name of the build project.  You cannot change a build project's name. 
     */
    name: NonEmptyString;
    /**
     * A new or replacement description of the build project.
     */
    description?: ProjectDescription;
    /**
     * Information to be changed about the build input source code for the build project.
     */
    source?: ProjectSource;
    /**
     *  An array of ProjectSource objects. 
     */
    secondarySources?: ProjectSources;
    /**
     *  A version of the build input to be built for this project. If not specified, the latest version is used. If specified, it must be one of:    For CodeCommit: the commit ID, branch, or Git tag to use.   For GitHub: the commit ID, pull request ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a pull request ID is specified, it must use the format pr/pull-request-ID (for example pr/25). If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.   For Bitbucket: the commit ID, branch name, or tag name that corresponds to the version of the source code you want to build. If a branch name is specified, the branch's HEAD commit ID is used. If not specified, the default branch's HEAD commit ID is used.   For Amazon S3: the version ID of the object that represents the build input ZIP file to use.    If sourceVersion is specified at the build level, then that version takes precedence over this sourceVersion (at the project level).   For more information, see Source Version Sample with CodeBuild in the CodeBuild User Guide. 
     */
    sourceVersion?: String;
    /**
     *  An array of ProjectSourceVersion objects. If secondarySourceVersions is specified at the build level, then they take over these secondarySourceVersions (at the project level). 
     */
    secondarySourceVersions?: ProjectSecondarySourceVersions;
    /**
     * Information to be changed about the build output artifacts for the build project.
     */
    artifacts?: ProjectArtifacts;
    /**
     *  An array of ProjectArtifact objects. 
     */
    secondaryArtifacts?: ProjectArtifactsList;
    /**
     * Stores recently used information so that it can be quickly accessed at a later time.
     */
    cache?: ProjectCache;
    /**
     * Information to be changed about the build environment for the build project.
     */
    environment?: ProjectEnvironment;
    /**
     * The replacement ARN of the IAM role that enables CodeBuild to interact with dependent Amazon Web Services services on behalf of the Amazon Web Services account.
     */
    serviceRole?: NonEmptyString;
    /**
     * The replacement value in minutes, from 5 to 480 (8 hours), for CodeBuild to wait before timing out any related build that did not get marked as completed.
     */
    timeoutInMinutes?: TimeOut;
    /**
     *  The number of minutes a build is allowed to be queued before it times out. 
     */
    queuedTimeoutInMinutes?: TimeOut;
    /**
     * The Key Management Service customer master key (CMK) to be used for encrypting the build output artifacts.   You can use a cross-account KMS key to encrypt the build output artifacts if your service role has permission to that key.   You can specify either the Amazon Resource Name (ARN) of the CMK or, if available, the CMK's alias (using the format alias/&lt;alias-name&gt;). 
     */
    encryptionKey?: NonEmptyString;
    /**
     * An updated list of tag key and value pairs associated with this build project. These tags are available for use by Amazon Web Services services that support CodeBuild build project tags.
     */
    tags?: TagList;
    /**
     * VpcConfig enables CodeBuild to access resources in an Amazon VPC.
     */
    vpcConfig?: VpcConfig;
    /**
     * Set this to true to generate a publicly accessible URL for your project's build badge.
     */
    badgeEnabled?: WrapperBoolean;
    /**
     *  Information about logs for the build project. A project can create logs in CloudWatch Logs, logs in an S3 bucket, or both. 
     */
    logsConfig?: LogsConfig;
    /**
     *  An array of ProjectFileSystemLocation objects for a CodeBuild build project. A ProjectFileSystemLocation object specifies the identifier, location, mountOptions, mountPoint, and type of a file system created using Amazon Elastic File System. 
     */
    fileSystemLocations?: ProjectFileSystemLocations;
    buildBatchConfig?: ProjectBuildBatchConfig;
    /**
     * The maximum number of concurrent builds that are allowed for this project. New builds are only started if the current number of builds is less than or equal to this limit. If the current build count meets this limit, new builds are throttled and are not run. To remove this limit, set this value to -1.
     */
    concurrentBuildLimit?: WrapperInt;
  }
  export interface UpdateProjectOutput {
    /**
     * Information about the build project that was changed.
     */
    project?: Project;
  }
  export interface UpdateProjectVisibilityInput {
    /**
     * The Amazon Resource Name (ARN) of the build project.
     */
    projectArn: NonEmptyString;
    projectVisibility: ProjectVisibilityType;
    /**
     * The ARN of the IAM role that enables CodeBuild to access the CloudWatch Logs and Amazon S3 artifacts for the project's builds.
     */
    resourceAccessRole?: NonEmptyString;
  }
  export interface UpdateProjectVisibilityOutput {
    /**
     * The Amazon Resource Name (ARN) of the build project.
     */
    projectArn?: NonEmptyString;
    /**
     * Contains the project identifier used with the public build APIs. 
     */
    publicProjectAlias?: NonEmptyString;
    projectVisibility?: ProjectVisibilityType;
  }
  export interface UpdateReportGroupInput {
    /**
     *  The ARN of the report group to update. 
     */
    arn: NonEmptyString;
    /**
     *  Used to specify an updated export type. Valid values are:     S3: The report results are exported to an S3 bucket.     NO_EXPORT: The report results are not exported.   
     */
    exportConfig?: ReportExportConfig;
    /**
     *  An updated list of tag key and value pairs associated with this report group.  These tags are available for use by Amazon Web Services services that support CodeBuild report group tags.
     */
    tags?: TagList;
  }
  export interface UpdateReportGroupOutput {
    /**
     *  Information about the updated report group. 
     */
    reportGroup?: ReportGroup;
  }
  export interface UpdateWebhookInput {
    /**
     * The name of the CodeBuild project.
     */
    projectName: ProjectName;
    /**
     * A regular expression used to determine which repository branches are built when a webhook is triggered. If the name of a branch matches the regular expression, then it is built. If branchFilter is empty, then all branches are built.   It is recommended that you use filterGroups instead of branchFilter.  
     */
    branchFilter?: String;
    /**
     *  A boolean value that specifies whether the associated GitHub repository's secret token should be updated. If you use Bitbucket for your repository, rotateSecret is ignored. 
     */
    rotateSecret?: Boolean;
    /**
     *  An array of arrays of WebhookFilter objects used to determine if a webhook event can trigger a build. A filter group must contain at least one EVENT WebhookFilter. 
     */
    filterGroups?: FilterGroups;
    /**
     * Specifies the type of build this webhook will trigger.
     */
    buildType?: WebhookBuildType;
  }
  export interface UpdateWebhookOutput {
    /**
     *  Information about a repository's webhook that is associated with a project in CodeBuild. 
     */
    webhook?: Webhook;
  }
  export type ValueInput = string;
  export interface VpcConfig {
    /**
     * The ID of the Amazon VPC.
     */
    vpcId?: NonEmptyString;
    /**
     * A list of one or more subnet IDs in your Amazon VPC.
     */
    subnets?: Subnets;
    /**
     * A list of one or more security groups IDs in your Amazon VPC.
     */
    securityGroupIds?: SecurityGroupIds;
  }
  export interface Webhook {
    /**
     * The URL to the webhook.
     */
    url?: NonEmptyString;
    /**
     * The CodeBuild endpoint where webhook events are sent.
     */
    payloadUrl?: NonEmptyString;
    /**
     * The secret token of the associated repository.   A Bitbucket webhook does not support secret.  
     */
    secret?: NonEmptyString;
    /**
     * A regular expression used to determine which repository branches are built when a webhook is triggered. If the name of a branch matches the regular expression, then it is built. If branchFilter is empty, then all branches are built.  It is recommended that you use filterGroups instead of branchFilter.  
     */
    branchFilter?: String;
    /**
     * An array of arrays of WebhookFilter objects used to determine which webhooks are triggered. At least one WebhookFilter in the array must specify EVENT as its type.  For a build to be triggered, at least one filter group in the filterGroups array must pass. For a filter group to pass, each of its filters must pass. 
     */
    filterGroups?: FilterGroups;
    /**
     * Specifies the type of build this webhook will trigger.
     */
    buildType?: WebhookBuildType;
    /**
     * A timestamp that indicates the last time a repository's secret token was modified. 
     */
    lastModifiedSecret?: Timestamp;
  }
  export type WebhookBuildType = "BUILD"|"BUILD_BATCH"|string;
  export interface WebhookFilter {
    /**
     *  The type of webhook filter. There are six webhook filter types: EVENT, ACTOR_ACCOUNT_ID, HEAD_REF, BASE_REF, FILE_PATH, and COMMIT_MESSAGE.    EVENT    A webhook event triggers a build when the provided pattern matches one of five event types: PUSH, PULL_REQUEST_CREATED, PULL_REQUEST_UPDATED, PULL_REQUEST_REOPENED, and PULL_REQUEST_MERGED. The EVENT patterns are specified as a comma-separated string. For example, PUSH, PULL_REQUEST_CREATED, PULL_REQUEST_UPDATED filters all push, pull request created, and pull request updated events.    The PULL_REQUEST_REOPENED works with GitHub and GitHub Enterprise only.     ACTOR_ACCOUNT_ID    A webhook event triggers a build when a GitHub, GitHub Enterprise, or Bitbucket account ID matches the regular expression pattern.    HEAD_REF    A webhook event triggers a build when the head reference matches the regular expression pattern. For example, refs/heads/branch-name and refs/tags/tag-name.   Works with GitHub and GitHub Enterprise push, GitHub and GitHub Enterprise pull request, Bitbucket push, and Bitbucket pull request events.    BASE_REF    A webhook event triggers a build when the base reference matches the regular expression pattern. For example, refs/heads/branch-name.    Works with pull request events only.     FILE_PATH    A webhook triggers a build when the path of a changed file matches the regular expression pattern.    Works with GitHub and Bitbucket events push and pull requests events. Also works with GitHub Enterprise push events, but does not work with GitHub Enterprise pull request events.    COMMIT_MESSAGE  A webhook triggers a build when the head commit message matches the regular expression pattern.   Works with GitHub and Bitbucket events push and pull requests events. Also works with GitHub Enterprise push events, but does not work with GitHub Enterprise pull request events.    
     */
    type: WebhookFilterType;
    /**
     *  For a WebHookFilter that uses EVENT type, a comma-separated string that specifies one or more events. For example, the webhook filter PUSH, PULL_REQUEST_CREATED, PULL_REQUEST_UPDATED allows all push, pull request created, and pull request updated events to trigger a build.   For a WebHookFilter that uses any of the other filter types, a regular expression pattern. For example, a WebHookFilter that uses HEAD_REF for its type and the pattern ^refs/heads/ triggers a build when the head reference is a branch with a reference name refs/heads/branch-name. 
     */
    pattern: String;
    /**
     *  Used to indicate that the pattern determines which webhook events do not trigger a build. If true, then a webhook event that does not match the pattern triggers a build. If false, then a webhook event that matches the pattern triggers a build. 
     */
    excludeMatchedPattern?: WrapperBoolean;
  }
  export type WebhookFilterType = "EVENT"|"BASE_REF"|"HEAD_REF"|"ACTOR_ACCOUNT_ID"|"FILE_PATH"|"COMMIT_MESSAGE"|string;
  export type WrapperBoolean = boolean;
  export type WrapperInt = number;
  export type WrapperLong = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-10-06"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CodeBuild client.
   */
  export import Types = CodeBuild;
}
export = CodeBuild;
