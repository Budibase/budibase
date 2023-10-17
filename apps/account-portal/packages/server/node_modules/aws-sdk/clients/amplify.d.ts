import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Amplify extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Amplify.Types.ClientConfiguration)
  config: Config & Amplify.Types.ClientConfiguration;
  /**
   *  Creates a new Amplify app. 
   */
  createApp(params: Amplify.Types.CreateAppRequest, callback?: (err: AWSError, data: Amplify.Types.CreateAppResult) => void): Request<Amplify.Types.CreateAppResult, AWSError>;
  /**
   *  Creates a new Amplify app. 
   */
  createApp(callback?: (err: AWSError, data: Amplify.Types.CreateAppResult) => void): Request<Amplify.Types.CreateAppResult, AWSError>;
  /**
   *  Creates a new backend environment for an Amplify app. 
   */
  createBackendEnvironment(params: Amplify.Types.CreateBackendEnvironmentRequest, callback?: (err: AWSError, data: Amplify.Types.CreateBackendEnvironmentResult) => void): Request<Amplify.Types.CreateBackendEnvironmentResult, AWSError>;
  /**
   *  Creates a new backend environment for an Amplify app. 
   */
  createBackendEnvironment(callback?: (err: AWSError, data: Amplify.Types.CreateBackendEnvironmentResult) => void): Request<Amplify.Types.CreateBackendEnvironmentResult, AWSError>;
  /**
   *  Creates a new branch for an Amplify app. 
   */
  createBranch(params: Amplify.Types.CreateBranchRequest, callback?: (err: AWSError, data: Amplify.Types.CreateBranchResult) => void): Request<Amplify.Types.CreateBranchResult, AWSError>;
  /**
   *  Creates a new branch for an Amplify app. 
   */
  createBranch(callback?: (err: AWSError, data: Amplify.Types.CreateBranchResult) => void): Request<Amplify.Types.CreateBranchResult, AWSError>;
  /**
   *  Creates a deployment for a manually deployed Amplify app. Manually deployed apps are not connected to a repository. 
   */
  createDeployment(params: Amplify.Types.CreateDeploymentRequest, callback?: (err: AWSError, data: Amplify.Types.CreateDeploymentResult) => void): Request<Amplify.Types.CreateDeploymentResult, AWSError>;
  /**
   *  Creates a deployment for a manually deployed Amplify app. Manually deployed apps are not connected to a repository. 
   */
  createDeployment(callback?: (err: AWSError, data: Amplify.Types.CreateDeploymentResult) => void): Request<Amplify.Types.CreateDeploymentResult, AWSError>;
  /**
   *  Creates a new domain association for an Amplify app. This action associates a custom domain with the Amplify app 
   */
  createDomainAssociation(params: Amplify.Types.CreateDomainAssociationRequest, callback?: (err: AWSError, data: Amplify.Types.CreateDomainAssociationResult) => void): Request<Amplify.Types.CreateDomainAssociationResult, AWSError>;
  /**
   *  Creates a new domain association for an Amplify app. This action associates a custom domain with the Amplify app 
   */
  createDomainAssociation(callback?: (err: AWSError, data: Amplify.Types.CreateDomainAssociationResult) => void): Request<Amplify.Types.CreateDomainAssociationResult, AWSError>;
  /**
   *  Creates a new webhook on an Amplify app. 
   */
  createWebhook(params: Amplify.Types.CreateWebhookRequest, callback?: (err: AWSError, data: Amplify.Types.CreateWebhookResult) => void): Request<Amplify.Types.CreateWebhookResult, AWSError>;
  /**
   *  Creates a new webhook on an Amplify app. 
   */
  createWebhook(callback?: (err: AWSError, data: Amplify.Types.CreateWebhookResult) => void): Request<Amplify.Types.CreateWebhookResult, AWSError>;
  /**
   *  Deletes an existing Amplify app specified by an app ID. 
   */
  deleteApp(params: Amplify.Types.DeleteAppRequest, callback?: (err: AWSError, data: Amplify.Types.DeleteAppResult) => void): Request<Amplify.Types.DeleteAppResult, AWSError>;
  /**
   *  Deletes an existing Amplify app specified by an app ID. 
   */
  deleteApp(callback?: (err: AWSError, data: Amplify.Types.DeleteAppResult) => void): Request<Amplify.Types.DeleteAppResult, AWSError>;
  /**
   *  Deletes a backend environment for an Amplify app. 
   */
  deleteBackendEnvironment(params: Amplify.Types.DeleteBackendEnvironmentRequest, callback?: (err: AWSError, data: Amplify.Types.DeleteBackendEnvironmentResult) => void): Request<Amplify.Types.DeleteBackendEnvironmentResult, AWSError>;
  /**
   *  Deletes a backend environment for an Amplify app. 
   */
  deleteBackendEnvironment(callback?: (err: AWSError, data: Amplify.Types.DeleteBackendEnvironmentResult) => void): Request<Amplify.Types.DeleteBackendEnvironmentResult, AWSError>;
  /**
   *  Deletes a branch for an Amplify app. 
   */
  deleteBranch(params: Amplify.Types.DeleteBranchRequest, callback?: (err: AWSError, data: Amplify.Types.DeleteBranchResult) => void): Request<Amplify.Types.DeleteBranchResult, AWSError>;
  /**
   *  Deletes a branch for an Amplify app. 
   */
  deleteBranch(callback?: (err: AWSError, data: Amplify.Types.DeleteBranchResult) => void): Request<Amplify.Types.DeleteBranchResult, AWSError>;
  /**
   *  Deletes a domain association for an Amplify app. 
   */
  deleteDomainAssociation(params: Amplify.Types.DeleteDomainAssociationRequest, callback?: (err: AWSError, data: Amplify.Types.DeleteDomainAssociationResult) => void): Request<Amplify.Types.DeleteDomainAssociationResult, AWSError>;
  /**
   *  Deletes a domain association for an Amplify app. 
   */
  deleteDomainAssociation(callback?: (err: AWSError, data: Amplify.Types.DeleteDomainAssociationResult) => void): Request<Amplify.Types.DeleteDomainAssociationResult, AWSError>;
  /**
   *  Deletes a job for a branch of an Amplify app. 
   */
  deleteJob(params: Amplify.Types.DeleteJobRequest, callback?: (err: AWSError, data: Amplify.Types.DeleteJobResult) => void): Request<Amplify.Types.DeleteJobResult, AWSError>;
  /**
   *  Deletes a job for a branch of an Amplify app. 
   */
  deleteJob(callback?: (err: AWSError, data: Amplify.Types.DeleteJobResult) => void): Request<Amplify.Types.DeleteJobResult, AWSError>;
  /**
   *  Deletes a webhook. 
   */
  deleteWebhook(params: Amplify.Types.DeleteWebhookRequest, callback?: (err: AWSError, data: Amplify.Types.DeleteWebhookResult) => void): Request<Amplify.Types.DeleteWebhookResult, AWSError>;
  /**
   *  Deletes a webhook. 
   */
  deleteWebhook(callback?: (err: AWSError, data: Amplify.Types.DeleteWebhookResult) => void): Request<Amplify.Types.DeleteWebhookResult, AWSError>;
  /**
   *  Returns the website access logs for a specific time range using a presigned URL. 
   */
  generateAccessLogs(params: Amplify.Types.GenerateAccessLogsRequest, callback?: (err: AWSError, data: Amplify.Types.GenerateAccessLogsResult) => void): Request<Amplify.Types.GenerateAccessLogsResult, AWSError>;
  /**
   *  Returns the website access logs for a specific time range using a presigned URL. 
   */
  generateAccessLogs(callback?: (err: AWSError, data: Amplify.Types.GenerateAccessLogsResult) => void): Request<Amplify.Types.GenerateAccessLogsResult, AWSError>;
  /**
   *  Returns an existing Amplify app by appID. 
   */
  getApp(params: Amplify.Types.GetAppRequest, callback?: (err: AWSError, data: Amplify.Types.GetAppResult) => void): Request<Amplify.Types.GetAppResult, AWSError>;
  /**
   *  Returns an existing Amplify app by appID. 
   */
  getApp(callback?: (err: AWSError, data: Amplify.Types.GetAppResult) => void): Request<Amplify.Types.GetAppResult, AWSError>;
  /**
   *  Returns the artifact info that corresponds to an artifact id. 
   */
  getArtifactUrl(params: Amplify.Types.GetArtifactUrlRequest, callback?: (err: AWSError, data: Amplify.Types.GetArtifactUrlResult) => void): Request<Amplify.Types.GetArtifactUrlResult, AWSError>;
  /**
   *  Returns the artifact info that corresponds to an artifact id. 
   */
  getArtifactUrl(callback?: (err: AWSError, data: Amplify.Types.GetArtifactUrlResult) => void): Request<Amplify.Types.GetArtifactUrlResult, AWSError>;
  /**
   *  Returns a backend environment for an Amplify app. 
   */
  getBackendEnvironment(params: Amplify.Types.GetBackendEnvironmentRequest, callback?: (err: AWSError, data: Amplify.Types.GetBackendEnvironmentResult) => void): Request<Amplify.Types.GetBackendEnvironmentResult, AWSError>;
  /**
   *  Returns a backend environment for an Amplify app. 
   */
  getBackendEnvironment(callback?: (err: AWSError, data: Amplify.Types.GetBackendEnvironmentResult) => void): Request<Amplify.Types.GetBackendEnvironmentResult, AWSError>;
  /**
   *  Returns a branch for an Amplify app. 
   */
  getBranch(params: Amplify.Types.GetBranchRequest, callback?: (err: AWSError, data: Amplify.Types.GetBranchResult) => void): Request<Amplify.Types.GetBranchResult, AWSError>;
  /**
   *  Returns a branch for an Amplify app. 
   */
  getBranch(callback?: (err: AWSError, data: Amplify.Types.GetBranchResult) => void): Request<Amplify.Types.GetBranchResult, AWSError>;
  /**
   *  Returns the domain information for an Amplify app. 
   */
  getDomainAssociation(params: Amplify.Types.GetDomainAssociationRequest, callback?: (err: AWSError, data: Amplify.Types.GetDomainAssociationResult) => void): Request<Amplify.Types.GetDomainAssociationResult, AWSError>;
  /**
   *  Returns the domain information for an Amplify app. 
   */
  getDomainAssociation(callback?: (err: AWSError, data: Amplify.Types.GetDomainAssociationResult) => void): Request<Amplify.Types.GetDomainAssociationResult, AWSError>;
  /**
   *  Returns a job for a branch of an Amplify app. 
   */
  getJob(params: Amplify.Types.GetJobRequest, callback?: (err: AWSError, data: Amplify.Types.GetJobResult) => void): Request<Amplify.Types.GetJobResult, AWSError>;
  /**
   *  Returns a job for a branch of an Amplify app. 
   */
  getJob(callback?: (err: AWSError, data: Amplify.Types.GetJobResult) => void): Request<Amplify.Types.GetJobResult, AWSError>;
  /**
   *  Returns the webhook information that corresponds to a specified webhook ID. 
   */
  getWebhook(params: Amplify.Types.GetWebhookRequest, callback?: (err: AWSError, data: Amplify.Types.GetWebhookResult) => void): Request<Amplify.Types.GetWebhookResult, AWSError>;
  /**
   *  Returns the webhook information that corresponds to a specified webhook ID. 
   */
  getWebhook(callback?: (err: AWSError, data: Amplify.Types.GetWebhookResult) => void): Request<Amplify.Types.GetWebhookResult, AWSError>;
  /**
   *  Returns a list of the existing Amplify apps. 
   */
  listApps(params: Amplify.Types.ListAppsRequest, callback?: (err: AWSError, data: Amplify.Types.ListAppsResult) => void): Request<Amplify.Types.ListAppsResult, AWSError>;
  /**
   *  Returns a list of the existing Amplify apps. 
   */
  listApps(callback?: (err: AWSError, data: Amplify.Types.ListAppsResult) => void): Request<Amplify.Types.ListAppsResult, AWSError>;
  /**
   *  Returns a list of artifacts for a specified app, branch, and job. 
   */
  listArtifacts(params: Amplify.Types.ListArtifactsRequest, callback?: (err: AWSError, data: Amplify.Types.ListArtifactsResult) => void): Request<Amplify.Types.ListArtifactsResult, AWSError>;
  /**
   *  Returns a list of artifacts for a specified app, branch, and job. 
   */
  listArtifacts(callback?: (err: AWSError, data: Amplify.Types.ListArtifactsResult) => void): Request<Amplify.Types.ListArtifactsResult, AWSError>;
  /**
   *  Lists the backend environments for an Amplify app. 
   */
  listBackendEnvironments(params: Amplify.Types.ListBackendEnvironmentsRequest, callback?: (err: AWSError, data: Amplify.Types.ListBackendEnvironmentsResult) => void): Request<Amplify.Types.ListBackendEnvironmentsResult, AWSError>;
  /**
   *  Lists the backend environments for an Amplify app. 
   */
  listBackendEnvironments(callback?: (err: AWSError, data: Amplify.Types.ListBackendEnvironmentsResult) => void): Request<Amplify.Types.ListBackendEnvironmentsResult, AWSError>;
  /**
   *  Lists the branches of an Amplify app. 
   */
  listBranches(params: Amplify.Types.ListBranchesRequest, callback?: (err: AWSError, data: Amplify.Types.ListBranchesResult) => void): Request<Amplify.Types.ListBranchesResult, AWSError>;
  /**
   *  Lists the branches of an Amplify app. 
   */
  listBranches(callback?: (err: AWSError, data: Amplify.Types.ListBranchesResult) => void): Request<Amplify.Types.ListBranchesResult, AWSError>;
  /**
   *  Returns the domain associations for an Amplify app. 
   */
  listDomainAssociations(params: Amplify.Types.ListDomainAssociationsRequest, callback?: (err: AWSError, data: Amplify.Types.ListDomainAssociationsResult) => void): Request<Amplify.Types.ListDomainAssociationsResult, AWSError>;
  /**
   *  Returns the domain associations for an Amplify app. 
   */
  listDomainAssociations(callback?: (err: AWSError, data: Amplify.Types.ListDomainAssociationsResult) => void): Request<Amplify.Types.ListDomainAssociationsResult, AWSError>;
  /**
   *  Lists the jobs for a branch of an Amplify app. 
   */
  listJobs(params: Amplify.Types.ListJobsRequest, callback?: (err: AWSError, data: Amplify.Types.ListJobsResult) => void): Request<Amplify.Types.ListJobsResult, AWSError>;
  /**
   *  Lists the jobs for a branch of an Amplify app. 
   */
  listJobs(callback?: (err: AWSError, data: Amplify.Types.ListJobsResult) => void): Request<Amplify.Types.ListJobsResult, AWSError>;
  /**
   *  Returns a list of tags for a specified Amazon Resource Name (ARN). 
   */
  listTagsForResource(params: Amplify.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Amplify.Types.ListTagsForResourceResponse) => void): Request<Amplify.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Returns a list of tags for a specified Amazon Resource Name (ARN). 
   */
  listTagsForResource(callback?: (err: AWSError, data: Amplify.Types.ListTagsForResourceResponse) => void): Request<Amplify.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Returns a list of webhooks for an Amplify app. 
   */
  listWebhooks(params: Amplify.Types.ListWebhooksRequest, callback?: (err: AWSError, data: Amplify.Types.ListWebhooksResult) => void): Request<Amplify.Types.ListWebhooksResult, AWSError>;
  /**
   *  Returns a list of webhooks for an Amplify app. 
   */
  listWebhooks(callback?: (err: AWSError, data: Amplify.Types.ListWebhooksResult) => void): Request<Amplify.Types.ListWebhooksResult, AWSError>;
  /**
   *  Starts a deployment for a manually deployed app. Manually deployed apps are not connected to a repository. 
   */
  startDeployment(params: Amplify.Types.StartDeploymentRequest, callback?: (err: AWSError, data: Amplify.Types.StartDeploymentResult) => void): Request<Amplify.Types.StartDeploymentResult, AWSError>;
  /**
   *  Starts a deployment for a manually deployed app. Manually deployed apps are not connected to a repository. 
   */
  startDeployment(callback?: (err: AWSError, data: Amplify.Types.StartDeploymentResult) => void): Request<Amplify.Types.StartDeploymentResult, AWSError>;
  /**
   *  Starts a new job for a branch of an Amplify app. 
   */
  startJob(params: Amplify.Types.StartJobRequest, callback?: (err: AWSError, data: Amplify.Types.StartJobResult) => void): Request<Amplify.Types.StartJobResult, AWSError>;
  /**
   *  Starts a new job for a branch of an Amplify app. 
   */
  startJob(callback?: (err: AWSError, data: Amplify.Types.StartJobResult) => void): Request<Amplify.Types.StartJobResult, AWSError>;
  /**
   *  Stops a job that is in progress for a branch of an Amplify app. 
   */
  stopJob(params: Amplify.Types.StopJobRequest, callback?: (err: AWSError, data: Amplify.Types.StopJobResult) => void): Request<Amplify.Types.StopJobResult, AWSError>;
  /**
   *  Stops a job that is in progress for a branch of an Amplify app. 
   */
  stopJob(callback?: (err: AWSError, data: Amplify.Types.StopJobResult) => void): Request<Amplify.Types.StopJobResult, AWSError>;
  /**
   *  Tags the resource with a tag key and value. 
   */
  tagResource(params: Amplify.Types.TagResourceRequest, callback?: (err: AWSError, data: Amplify.Types.TagResourceResponse) => void): Request<Amplify.Types.TagResourceResponse, AWSError>;
  /**
   *  Tags the resource with a tag key and value. 
   */
  tagResource(callback?: (err: AWSError, data: Amplify.Types.TagResourceResponse) => void): Request<Amplify.Types.TagResourceResponse, AWSError>;
  /**
   *  Untags a resource with a specified Amazon Resource Name (ARN). 
   */
  untagResource(params: Amplify.Types.UntagResourceRequest, callback?: (err: AWSError, data: Amplify.Types.UntagResourceResponse) => void): Request<Amplify.Types.UntagResourceResponse, AWSError>;
  /**
   *  Untags a resource with a specified Amazon Resource Name (ARN). 
   */
  untagResource(callback?: (err: AWSError, data: Amplify.Types.UntagResourceResponse) => void): Request<Amplify.Types.UntagResourceResponse, AWSError>;
  /**
   *  Updates an existing Amplify app. 
   */
  updateApp(params: Amplify.Types.UpdateAppRequest, callback?: (err: AWSError, data: Amplify.Types.UpdateAppResult) => void): Request<Amplify.Types.UpdateAppResult, AWSError>;
  /**
   *  Updates an existing Amplify app. 
   */
  updateApp(callback?: (err: AWSError, data: Amplify.Types.UpdateAppResult) => void): Request<Amplify.Types.UpdateAppResult, AWSError>;
  /**
   *  Updates a branch for an Amplify app. 
   */
  updateBranch(params: Amplify.Types.UpdateBranchRequest, callback?: (err: AWSError, data: Amplify.Types.UpdateBranchResult) => void): Request<Amplify.Types.UpdateBranchResult, AWSError>;
  /**
   *  Updates a branch for an Amplify app. 
   */
  updateBranch(callback?: (err: AWSError, data: Amplify.Types.UpdateBranchResult) => void): Request<Amplify.Types.UpdateBranchResult, AWSError>;
  /**
   *  Creates a new domain association for an Amplify app.
   */
  updateDomainAssociation(params: Amplify.Types.UpdateDomainAssociationRequest, callback?: (err: AWSError, data: Amplify.Types.UpdateDomainAssociationResult) => void): Request<Amplify.Types.UpdateDomainAssociationResult, AWSError>;
  /**
   *  Creates a new domain association for an Amplify app.
   */
  updateDomainAssociation(callback?: (err: AWSError, data: Amplify.Types.UpdateDomainAssociationResult) => void): Request<Amplify.Types.UpdateDomainAssociationResult, AWSError>;
  /**
   *  Updates a webhook. 
   */
  updateWebhook(params: Amplify.Types.UpdateWebhookRequest, callback?: (err: AWSError, data: Amplify.Types.UpdateWebhookResult) => void): Request<Amplify.Types.UpdateWebhookResult, AWSError>;
  /**
   *  Updates a webhook. 
   */
  updateWebhook(callback?: (err: AWSError, data: Amplify.Types.UpdateWebhookResult) => void): Request<Amplify.Types.UpdateWebhookResult, AWSError>;
}
declare namespace Amplify {
  export type AccessToken = string;
  export type ActiveJobId = string;
  export interface App {
    /**
     *  The unique ID of the Amplify app. 
     */
    appId: AppId;
    /**
     *  The Amazon Resource Name (ARN) of the Amplify app. 
     */
    appArn: AppArn;
    /**
     *  The name for the Amplify app. 
     */
    name: Name;
    /**
     *  The tag for the Amplify app. 
     */
    tags?: TagMap;
    /**
     *  The description for the Amplify app. 
     */
    description: Description;
    /**
     *  The Git repository for the Amplify app. 
     */
    repository: Repository;
    /**
     *  The platform for the Amplify app. For a static app, set the platform type to WEB. For a dynamic server-side rendered (SSR) app, set the platform type to WEB_COMPUTE. For an app requiring Amplify Hosting's original SSR support only, set the platform type to WEB_DYNAMIC.
     */
    platform: Platform;
    /**
     *  Creates a date and time for the Amplify app. 
     */
    createTime: CreateTime;
    /**
     *  Updates the date and time for the Amplify app. 
     */
    updateTime: UpdateTime;
    /**
     *  The AWS Identity and Access Management (IAM) service role for the Amazon Resource Name (ARN) of the Amplify app. 
     */
    iamServiceRoleArn?: ServiceRoleArn;
    /**
     *  The environment variables for the Amplify app. 
     */
    environmentVariables: EnvironmentVariables;
    /**
     *  The default domain for the Amplify app. 
     */
    defaultDomain: DefaultDomain;
    /**
     *  Enables the auto-building of branches for the Amplify app. 
     */
    enableBranchAutoBuild: EnableBranchAutoBuild;
    /**
     *  Automatically disconnect a branch in the Amplify Console when you delete a branch from your Git repository. 
     */
    enableBranchAutoDeletion?: EnableBranchAutoDeletion;
    /**
     *  Enables basic authorization for the Amplify app's branches. 
     */
    enableBasicAuth: EnableBasicAuth;
    /**
     *  The basic authorization credentials for branches for the Amplify app. You must base64-encode the authorization credentials and provide them in the format user:password.
     */
    basicAuthCredentials?: BasicAuthCredentials;
    /**
     *  Describes the custom redirect and rewrite rules for the Amplify app. 
     */
    customRules?: CustomRules;
    /**
     *  Describes the information about a production branch of the Amplify app. 
     */
    productionBranch?: ProductionBranch;
    /**
     *  Describes the content of the build specification (build spec) for the Amplify app. 
     */
    buildSpec?: BuildSpec;
    /**
     * Describes the custom HTTP headers for the Amplify app.
     */
    customHeaders?: CustomHeaders;
    /**
     *  Enables automated branch creation for the Amplify app. 
     */
    enableAutoBranchCreation?: EnableAutoBranchCreation;
    /**
     *  Describes the automated branch creation glob patterns for the Amplify app. 
     */
    autoBranchCreationPatterns?: AutoBranchCreationPatterns;
    /**
     *  Describes the automated branch creation configuration for the Amplify app. 
     */
    autoBranchCreationConfig?: AutoBranchCreationConfig;
    /**
     *  This is for internal use.  The Amplify service uses this parameter to specify the authentication protocol to use to access the Git repository for an Amplify app. Amplify specifies TOKEN for a GitHub repository, SIGV4 for an Amazon Web Services CodeCommit repository, and SSH for GitLab and Bitbucket repositories.
     */
    repositoryCloneMethod?: RepositoryCloneMethod;
  }
  export type AppArn = string;
  export type AppId = string;
  export type Apps = App[];
  export interface Artifact {
    /**
     *  The file name for the artifact. 
     */
    artifactFileName: ArtifactFileName;
    /**
     *  The unique ID for the artifact. 
     */
    artifactId: ArtifactId;
  }
  export type ArtifactFileName = string;
  export type ArtifactId = string;
  export type ArtifactUrl = string;
  export type Artifacts = Artifact[];
  export type ArtifactsUrl = string;
  export type AssociatedResource = string;
  export type AssociatedResources = AssociatedResource[];
  export interface AutoBranchCreationConfig {
    /**
     *  Describes the current stage for the autocreated branch. 
     */
    stage?: Stage;
    /**
     *  The framework for the autocreated branch. 
     */
    framework?: Framework;
    /**
     *  Enables auto building for the autocreated branch. 
     */
    enableAutoBuild?: EnableAutoBuild;
    /**
     *  The environment variables for the autocreated branch. 
     */
    environmentVariables?: EnvironmentVariables;
    /**
     *  The basic authorization credentials for the autocreated branch. You must base64-encode the authorization credentials and provide them in the format user:password.
     */
    basicAuthCredentials?: BasicAuthCredentials;
    /**
     *  Enables basic authorization for the autocreated branch. 
     */
    enableBasicAuth?: EnableBasicAuth;
    /**
     * Enables performance mode for the branch. Performance mode optimizes for faster hosting performance by keeping content cached at the edge for a longer interval. When performance mode is enabled, hosting configuration or code changes can take up to 10 minutes to roll out. 
     */
    enablePerformanceMode?: EnablePerformanceMode;
    /**
     *  The build specification (build spec) for the autocreated branch. 
     */
    buildSpec?: BuildSpec;
    /**
     *  Enables pull request previews for the autocreated branch. 
     */
    enablePullRequestPreview?: EnablePullRequestPreview;
    /**
     *  The Amplify environment name for the pull request. 
     */
    pullRequestEnvironmentName?: PullRequestEnvironmentName;
  }
  export type AutoBranchCreationPattern = string;
  export type AutoBranchCreationPatterns = AutoBranchCreationPattern[];
  export type AutoSubDomainCreationPattern = string;
  export type AutoSubDomainCreationPatterns = AutoSubDomainCreationPattern[];
  export type AutoSubDomainIAMRole = string;
  export interface BackendEnvironment {
    /**
     *  The Amazon Resource Name (ARN) for a backend environment that is part of an Amplify app. 
     */
    backendEnvironmentArn: BackendEnvironmentArn;
    /**
     *  The name for a backend environment that is part of an Amplify app. 
     */
    environmentName: EnvironmentName;
    /**
     *  The AWS CloudFormation stack name of a backend environment. 
     */
    stackName?: StackName;
    /**
     *  The name of deployment artifacts. 
     */
    deploymentArtifacts?: DeploymentArtifacts;
    /**
     *  The creation date and time for a backend environment that is part of an Amplify app. 
     */
    createTime: CreateTime;
    /**
     *  The last updated date and time for a backend environment that is part of an Amplify app. 
     */
    updateTime: UpdateTime;
  }
  export type BackendEnvironmentArn = string;
  export type BackendEnvironments = BackendEnvironment[];
  export type BasicAuthCredentials = string;
  export interface Branch {
    /**
     *  The Amazon Resource Name (ARN) for a branch that is part of an Amplify app. 
     */
    branchArn: BranchArn;
    /**
     *  The name for the branch that is part of an Amplify app. 
     */
    branchName: BranchName;
    /**
     *  The description for the branch that is part of an Amplify app. 
     */
    description: Description;
    /**
     *  The tag for the branch of an Amplify app. 
     */
    tags?: TagMap;
    /**
     *  The current stage for the branch that is part of an Amplify app. 
     */
    stage: Stage;
    /**
     *  The display name for the branch. This is used as the default domain prefix. 
     */
    displayName: DisplayName;
    /**
     *  Enables notifications for a branch that is part of an Amplify app. 
     */
    enableNotification: EnableNotification;
    /**
     *  The creation date and time for a branch that is part of an Amplify app. 
     */
    createTime: CreateTime;
    /**
     *  The last updated date and time for a branch that is part of an Amplify app. 
     */
    updateTime: UpdateTime;
    /**
     *  The environment variables specific to a branch of an Amplify app. 
     */
    environmentVariables: EnvironmentVariables;
    /**
     *  Enables auto-building on push for a branch of an Amplify app. 
     */
    enableAutoBuild: EnableAutoBuild;
    /**
     *  The custom domains for a branch of an Amplify app. 
     */
    customDomains: CustomDomains;
    /**
     *  The framework for a branch of an Amplify app. 
     */
    framework: Framework;
    /**
     *  The ID of the active job for a branch of an Amplify app. 
     */
    activeJobId: ActiveJobId;
    /**
     *  The total number of jobs that are part of an Amplify app. 
     */
    totalNumberOfJobs: TotalNumberOfJobs;
    /**
     *  Enables basic authorization for a branch of an Amplify app. 
     */
    enableBasicAuth: EnableBasicAuth;
    /**
     * Enables performance mode for the branch. Performance mode optimizes for faster hosting performance by keeping content cached at the edge for a longer interval. When performance mode is enabled, hosting configuration or code changes can take up to 10 minutes to roll out. 
     */
    enablePerformanceMode?: EnablePerformanceMode;
    /**
     *  The thumbnail URL for the branch of an Amplify app. 
     */
    thumbnailUrl?: ThumbnailUrl;
    /**
     *  The basic authorization credentials for a branch of an Amplify app. You must base64-encode the authorization credentials and provide them in the format user:password.
     */
    basicAuthCredentials?: BasicAuthCredentials;
    /**
     *  The build specification (build spec) content for the branch of an Amplify app. 
     */
    buildSpec?: BuildSpec;
    /**
     *  The content Time to Live (TTL) for the website in seconds. 
     */
    ttl: TTL;
    /**
     *  A list of custom resources that are linked to this branch. 
     */
    associatedResources?: AssociatedResources;
    /**
     *  Enables pull request previews for the branch. 
     */
    enablePullRequestPreview: EnablePullRequestPreview;
    /**
     *  The Amplify environment name for the pull request. 
     */
    pullRequestEnvironmentName?: PullRequestEnvironmentName;
    /**
     *  The destination branch if the branch is a pull request branch. 
     */
    destinationBranch?: BranchName;
    /**
     *  The source branch if the branch is a pull request branch. 
     */
    sourceBranch?: BranchName;
    /**
     *  The Amazon Resource Name (ARN) for a backend environment that is part of an Amplify app. 
     */
    backendEnvironmentArn?: BackendEnvironmentArn;
  }
  export type BranchArn = string;
  export type BranchName = string;
  export type Branches = Branch[];
  export type BuildSpec = string;
  export type CertificateVerificationDNSRecord = string;
  export type CommitId = string;
  export type CommitMessage = string;
  export type CommitTime = Date;
  export type Condition = string;
  export type Context = string;
  export interface CreateAppRequest {
    /**
     *  The name for an Amplify app. 
     */
    name: Name;
    /**
     *  The description for an Amplify app. 
     */
    description?: Description;
    /**
     *  The repository for an Amplify app. 
     */
    repository?: Repository;
    /**
     *  The platform for the Amplify app. For a static app, set the platform type to WEB. For a dynamic server-side rendered (SSR) app, set the platform type to WEB_COMPUTE. For an app requiring Amplify Hosting's original SSR support only, set the platform type to WEB_DYNAMIC.
     */
    platform?: Platform;
    /**
     *  The AWS Identity and Access Management (IAM) service role for an Amplify app. 
     */
    iamServiceRoleArn?: ServiceRoleArn;
    /**
     * The OAuth token for a third-party source control system for an Amplify app. The OAuth token is used to create a webhook and a read-only deploy key using SSH cloning. The OAuth token is not stored. Use oauthToken for repository providers other than GitHub, such as Bitbucket or CodeCommit. To authorize access to GitHub as your repository provider, use accessToken. You must specify either oauthToken or accessToken when you create a new app. Existing Amplify apps deployed from a GitHub repository using OAuth continue to work with CI/CD. However, we strongly recommend that you migrate these apps to use the GitHub App. For more information, see Migrating an existing OAuth app to the Amplify GitHub App in the Amplify User Guide .
     */
    oauthToken?: OauthToken;
    /**
     * The personal access token for a GitHub repository for an Amplify app. The personal access token is used to authorize access to a GitHub repository using the Amplify GitHub App. The token is not stored. Use accessToken for GitHub repositories only. To authorize access to a repository provider such as Bitbucket or CodeCommit, use oauthToken. You must specify either accessToken or oauthToken when you create a new app. Existing Amplify apps deployed from a GitHub repository using OAuth continue to work with CI/CD. However, we strongly recommend that you migrate these apps to use the GitHub App. For more information, see Migrating an existing OAuth app to the Amplify GitHub App in the Amplify User Guide .
     */
    accessToken?: AccessToken;
    /**
     *  The environment variables map for an Amplify app. 
     */
    environmentVariables?: EnvironmentVariables;
    /**
     *  Enables the auto building of branches for an Amplify app. 
     */
    enableBranchAutoBuild?: EnableBranchAutoBuild;
    /**
     *  Automatically disconnects a branch in the Amplify Console when you delete a branch from your Git repository. 
     */
    enableBranchAutoDeletion?: EnableBranchAutoDeletion;
    /**
     *  Enables basic authorization for an Amplify app. This will apply to all branches that are part of this app. 
     */
    enableBasicAuth?: EnableBasicAuth;
    /**
     *  The credentials for basic authorization for an Amplify app. You must base64-encode the authorization credentials and provide them in the format user:password.
     */
    basicAuthCredentials?: BasicAuthCredentials;
    /**
     *  The custom rewrite and redirect rules for an Amplify app. 
     */
    customRules?: CustomRules;
    /**
     *  The tag for an Amplify app. 
     */
    tags?: TagMap;
    /**
     *  The build specification (build spec) for an Amplify app. 
     */
    buildSpec?: BuildSpec;
    /**
     * The custom HTTP headers for an Amplify app.
     */
    customHeaders?: CustomHeaders;
    /**
     *  Enables automated branch creation for an Amplify app. 
     */
    enableAutoBranchCreation?: EnableAutoBranchCreation;
    /**
     *  The automated branch creation glob patterns for an Amplify app. 
     */
    autoBranchCreationPatterns?: AutoBranchCreationPatterns;
    /**
     *  The automated branch creation configuration for an Amplify app. 
     */
    autoBranchCreationConfig?: AutoBranchCreationConfig;
  }
  export interface CreateAppResult {
    app: App;
  }
  export interface CreateBackendEnvironmentRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for the backend environment. 
     */
    environmentName: EnvironmentName;
    /**
     *  The AWS CloudFormation stack name of a backend environment. 
     */
    stackName?: StackName;
    /**
     *  The name of deployment artifacts. 
     */
    deploymentArtifacts?: DeploymentArtifacts;
  }
  export interface CreateBackendEnvironmentResult {
    /**
     *  Describes the backend environment for an Amplify app. 
     */
    backendEnvironment: BackendEnvironment;
  }
  export interface CreateBranchRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for the branch. 
     */
    branchName: BranchName;
    /**
     *  The description for the branch. 
     */
    description?: Description;
    /**
     *  Describes the current stage for the branch. 
     */
    stage?: Stage;
    /**
     *  The framework for the branch. 
     */
    framework?: Framework;
    /**
     *  Enables notifications for the branch. 
     */
    enableNotification?: EnableNotification;
    /**
     *  Enables auto building for the branch. 
     */
    enableAutoBuild?: EnableAutoBuild;
    /**
     *  The environment variables for the branch. 
     */
    environmentVariables?: EnvironmentVariables;
    /**
     *  The basic authorization credentials for the branch. You must base64-encode the authorization credentials and provide them in the format user:password.
     */
    basicAuthCredentials?: BasicAuthCredentials;
    /**
     *  Enables basic authorization for the branch. 
     */
    enableBasicAuth?: EnableBasicAuth;
    /**
     * Enables performance mode for the branch. Performance mode optimizes for faster hosting performance by keeping content cached at the edge for a longer interval. When performance mode is enabled, hosting configuration or code changes can take up to 10 minutes to roll out. 
     */
    enablePerformanceMode?: EnablePerformanceMode;
    /**
     *  The tag for the branch. 
     */
    tags?: TagMap;
    /**
     *  The build specification (build spec) for the branch. 
     */
    buildSpec?: BuildSpec;
    /**
     *  The content Time To Live (TTL) for the website in seconds. 
     */
    ttl?: TTL;
    /**
     *  The display name for a branch. This is used as the default domain prefix. 
     */
    displayName?: DisplayName;
    /**
     *  Enables pull request previews for this branch. 
     */
    enablePullRequestPreview?: EnablePullRequestPreview;
    /**
     *  The Amplify environment name for the pull request. 
     */
    pullRequestEnvironmentName?: PullRequestEnvironmentName;
    /**
     *  The Amazon Resource Name (ARN) for a backend environment that is part of an Amplify app. 
     */
    backendEnvironmentArn?: BackendEnvironmentArn;
  }
  export interface CreateBranchResult {
    /**
     *  Describes the branch for an Amplify app, which maps to a third-party repository branch. 
     */
    branch: Branch;
  }
  export interface CreateDeploymentRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for the branch, for the job. 
     */
    branchName: BranchName;
    /**
     *  An optional file map that contains the file name as the key and the file content md5 hash as the value. If this argument is provided, the service will generate a unique upload URL per file. Otherwise, the service will only generate a single upload URL for the zipped files. 
     */
    fileMap?: FileMap;
  }
  export interface CreateDeploymentResult {
    /**
     *  The job ID for this deployment. will supply to start deployment api. 
     */
    jobId?: JobId;
    /**
     *  When the fileMap argument is provided in the request, fileUploadUrls will contain a map of file names to upload URLs. 
     */
    fileUploadUrls: FileUploadUrls;
    /**
     *  When the fileMap argument is not provided in the request, this zipUploadUrl is returned. 
     */
    zipUploadUrl: UploadUrl;
  }
  export interface CreateDomainAssociationRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The domain name for the domain association. 
     */
    domainName: DomainName;
    /**
     *  Enables the automated creation of subdomains for branches. 
     */
    enableAutoSubDomain?: EnableAutoSubDomain;
    /**
     *  The setting for the subdomain. 
     */
    subDomainSettings: SubDomainSettings;
    /**
     *  Sets the branch patterns for automatic subdomain creation. 
     */
    autoSubDomainCreationPatterns?: AutoSubDomainCreationPatterns;
    /**
     *  The required AWS Identity and Access Management (IAM) service role for the Amazon Resource Name (ARN) for automatically creating subdomains. 
     */
    autoSubDomainIAMRole?: AutoSubDomainIAMRole;
  }
  export interface CreateDomainAssociationResult {
    /**
     *  Describes the structure of a domain association, which associates a custom domain with an Amplify app. 
     */
    domainAssociation: DomainAssociation;
  }
  export type CreateTime = Date;
  export interface CreateWebhookRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for a branch that is part of an Amplify app. 
     */
    branchName: BranchName;
    /**
     *  The description for a webhook. 
     */
    description?: Description;
  }
  export interface CreateWebhookResult {
    /**
     *  Describes a webhook that connects repository events to an Amplify app. 
     */
    webhook: Webhook;
  }
  export type CustomDomain = string;
  export type CustomDomains = CustomDomain[];
  export type CustomHeaders = string;
  export interface CustomRule {
    /**
     *  The source pattern for a URL rewrite or redirect rule. 
     */
    source: Source;
    /**
     *  The target pattern for a URL rewrite or redirect rule. 
     */
    target: Target;
    /**
     *  The status code for a URL rewrite or redirect rule.   200  Represents a 200 rewrite rule.  301  Represents a 301 (moved pemanently) redirect rule. This and all future requests should be directed to the target URL.   302  Represents a 302 temporary redirect rule.  404  Represents a 404 redirect rule.  404-200  Represents a 404 rewrite rule.  
     */
    status?: Status;
    /**
     *  The condition for a URL rewrite or redirect rule, such as a country code. 
     */
    condition?: Condition;
  }
  export type CustomRules = CustomRule[];
  export type DNSRecord = string;
  export type DefaultDomain = string;
  export interface DeleteAppRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
  }
  export interface DeleteAppResult {
    app: App;
  }
  export interface DeleteBackendEnvironmentRequest {
    /**
     *  The unique ID of an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name of a backend environment of an Amplify app. 
     */
    environmentName: EnvironmentName;
  }
  export interface DeleteBackendEnvironmentResult {
    /**
     *  Describes the backend environment for an Amplify app. 
     */
    backendEnvironment: BackendEnvironment;
  }
  export interface DeleteBranchRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for the branch. 
     */
    branchName: BranchName;
  }
  export interface DeleteBranchResult {
    /**
     *  The branch for an Amplify app, which maps to a third-party repository branch. 
     */
    branch: Branch;
  }
  export interface DeleteDomainAssociationRequest {
    /**
     *  The unique id for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name of the domain. 
     */
    domainName: DomainName;
  }
  export interface DeleteDomainAssociationResult {
    domainAssociation: DomainAssociation;
  }
  export interface DeleteJobRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for the branch, for the job. 
     */
    branchName: BranchName;
    /**
     *  The unique ID for the job. 
     */
    jobId: JobId;
  }
  export interface DeleteJobResult {
    jobSummary: JobSummary;
  }
  export interface DeleteWebhookRequest {
    /**
     *  The unique ID for a webhook. 
     */
    webhookId: WebhookId;
  }
  export interface DeleteWebhookResult {
    /**
     *  Describes a webhook that connects repository events to an Amplify app. 
     */
    webhook: Webhook;
  }
  export type DeploymentArtifacts = string;
  export type Description = string;
  export type DisplayName = string;
  export interface DomainAssociation {
    /**
     *  The Amazon Resource Name (ARN) for the domain association. 
     */
    domainAssociationArn: DomainAssociationArn;
    /**
     *  The name of the domain. 
     */
    domainName: DomainName;
    /**
     *  Enables the automated creation of subdomains for branches. 
     */
    enableAutoSubDomain: EnableAutoSubDomain;
    /**
     *  Sets branch patterns for automatic subdomain creation. 
     */
    autoSubDomainCreationPatterns?: AutoSubDomainCreationPatterns;
    /**
     *  The required AWS Identity and Access Management (IAM) service role for the Amazon Resource Name (ARN) for automatically creating subdomains. 
     */
    autoSubDomainIAMRole?: AutoSubDomainIAMRole;
    /**
     *  The current status of the domain association. 
     */
    domainStatus: DomainStatus;
    /**
     *  The reason for the current status of the domain association. 
     */
    statusReason: StatusReason;
    /**
     *  The DNS record for certificate verification. 
     */
    certificateVerificationDNSRecord?: CertificateVerificationDNSRecord;
    /**
     *  The subdomains for the domain association. 
     */
    subDomains: SubDomains;
  }
  export type DomainAssociationArn = string;
  export type DomainAssociations = DomainAssociation[];
  export type DomainName = string;
  export type DomainPrefix = string;
  export type DomainStatus = "PENDING_VERIFICATION"|"IN_PROGRESS"|"AVAILABLE"|"PENDING_DEPLOYMENT"|"FAILED"|"CREATING"|"REQUESTING_CERTIFICATE"|"UPDATING"|string;
  export type EnableAutoBranchCreation = boolean;
  export type EnableAutoBuild = boolean;
  export type EnableAutoSubDomain = boolean;
  export type EnableBasicAuth = boolean;
  export type EnableBranchAutoBuild = boolean;
  export type EnableBranchAutoDeletion = boolean;
  export type EnableNotification = boolean;
  export type EnablePerformanceMode = boolean;
  export type EnablePullRequestPreview = boolean;
  export type EndTime = Date;
  export type EnvKey = string;
  export type EnvValue = string;
  export type EnvironmentName = string;
  export type EnvironmentVariables = {[key: string]: EnvValue};
  export type FileMap = {[key: string]: MD5Hash};
  export type FileName = string;
  export type FileUploadUrls = {[key: string]: UploadUrl};
  export type Framework = string;
  export interface GenerateAccessLogsRequest {
    /**
     *  The time at which the logs should start. The time range specified is inclusive of the start time. 
     */
    startTime?: StartTime;
    /**
     *  The time at which the logs should end. The time range specified is inclusive of the end time. 
     */
    endTime?: EndTime;
    /**
     *  The name of the domain. 
     */
    domainName: DomainName;
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
  }
  export interface GenerateAccessLogsResult {
    /**
     *  The pre-signed URL for the requested access logs. 
     */
    logUrl?: LogUrl;
  }
  export interface GetAppRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
  }
  export interface GetAppResult {
    app: App;
  }
  export interface GetArtifactUrlRequest {
    /**
     *  The unique ID for an artifact. 
     */
    artifactId: ArtifactId;
  }
  export interface GetArtifactUrlResult {
    /**
     *  The unique ID for an artifact. 
     */
    artifactId: ArtifactId;
    /**
     *  The presigned URL for the artifact. 
     */
    artifactUrl: ArtifactUrl;
  }
  export interface GetBackendEnvironmentRequest {
    /**
     *  The unique id for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for the backend environment. 
     */
    environmentName: EnvironmentName;
  }
  export interface GetBackendEnvironmentResult {
    /**
     *  Describes the backend environment for an Amplify app. 
     */
    backendEnvironment: BackendEnvironment;
  }
  export interface GetBranchRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for the branch. 
     */
    branchName: BranchName;
  }
  export interface GetBranchResult {
    branch: Branch;
  }
  export interface GetDomainAssociationRequest {
    /**
     *  The unique id for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name of the domain. 
     */
    domainName: DomainName;
  }
  export interface GetDomainAssociationResult {
    /**
     *  Describes the structure of a domain association, which associates a custom domain with an Amplify app. 
     */
    domainAssociation: DomainAssociation;
  }
  export interface GetJobRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The branch name for the job. 
     */
    branchName: BranchName;
    /**
     *  The unique ID for the job. 
     */
    jobId: JobId;
  }
  export interface GetJobResult {
    job: Job;
  }
  export interface GetWebhookRequest {
    /**
     *  The unique ID for a webhook. 
     */
    webhookId: WebhookId;
  }
  export interface GetWebhookResult {
    /**
     *  Describes the structure of a webhook. 
     */
    webhook: Webhook;
  }
  export interface Job {
    /**
     *  Describes the summary for an execution job for an Amplify app. 
     */
    summary: JobSummary;
    /**
     *  The execution steps for an execution job, for an Amplify app. 
     */
    steps: Steps;
  }
  export type JobArn = string;
  export type JobId = string;
  export type JobReason = string;
  export type JobStatus = "PENDING"|"PROVISIONING"|"RUNNING"|"FAILED"|"SUCCEED"|"CANCELLING"|"CANCELLED"|string;
  export type JobSummaries = JobSummary[];
  export interface JobSummary {
    /**
     *  The Amazon Resource Name (ARN) for the job. 
     */
    jobArn: JobArn;
    /**
     *  The unique ID for the job. 
     */
    jobId: JobId;
    /**
     *  The commit ID from a third-party repository provider for the job. 
     */
    commitId: CommitId;
    /**
     *  The commit message from a third-party repository provider for the job. 
     */
    commitMessage: CommitMessage;
    /**
     *  The commit date and time for the job. 
     */
    commitTime: CommitTime;
    /**
     *  The start date and time for the job. 
     */
    startTime: StartTime;
    /**
     *  The current status for the job. 
     */
    status: JobStatus;
    /**
     *  The end date and time for the job. 
     */
    endTime?: EndTime;
    /**
     *  The type for the job. If the value is RELEASE, the job was manually released from its source by using the StartJob API. If the value is RETRY, the job was manually retried using the StartJob API. If the value is WEB_HOOK, the job was automatically triggered by webhooks. 
     */
    jobType: JobType;
  }
  export type JobType = "RELEASE"|"RETRY"|"MANUAL"|"WEB_HOOK"|string;
  export type LastDeployTime = Date;
  export interface ListAppsRequest {
    /**
     *  A pagination token. If non-null, the pagination token is returned in a result. Pass its value in another request to retrieve more entries. 
     */
    nextToken?: NextToken;
    /**
     *  The maximum number of records to list in a single response. 
     */
    maxResults?: MaxResults;
  }
  export interface ListAppsResult {
    /**
     *  A list of Amplify apps. 
     */
    apps: Apps;
    /**
     *  A pagination token. Set to null to start listing apps from start. If non-null, the pagination token is returned in a result. Pass its value in here to list more projects. 
     */
    nextToken?: NextToken;
  }
  export interface ListArtifactsRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name of a branch that is part of an Amplify app. 
     */
    branchName: BranchName;
    /**
     *  The unique ID for a job. 
     */
    jobId: JobId;
    /**
     *  A pagination token. Set to null to start listing artifacts from start. If a non-null pagination token is returned in a result, pass its value in here to list more artifacts. 
     */
    nextToken?: NextToken;
    /**
     *  The maximum number of records to list in a single response. 
     */
    maxResults?: MaxResults;
  }
  export interface ListArtifactsResult {
    /**
     *  A list of artifacts. 
     */
    artifacts: Artifacts;
    /**
     *  A pagination token. If a non-null pagination token is returned in a result, pass its value in another request to retrieve more entries. 
     */
    nextToken?: NextToken;
  }
  export interface ListBackendEnvironmentsRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name of the backend environment 
     */
    environmentName?: EnvironmentName;
    /**
     *  A pagination token. Set to null to start listing backend environments from the start. If a non-null pagination token is returned in a result, pass its value in here to list more backend environments. 
     */
    nextToken?: NextToken;
    /**
     *  The maximum number of records to list in a single response. 
     */
    maxResults?: MaxResults;
  }
  export interface ListBackendEnvironmentsResult {
    /**
     *  The list of backend environments for an Amplify app. 
     */
    backendEnvironments: BackendEnvironments;
    /**
     *  A pagination token. If a non-null pagination token is returned in a result, pass its value in another request to retrieve more entries. 
     */
    nextToken?: NextToken;
  }
  export interface ListBranchesRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  A pagination token. Set to null to start listing branches from the start. If a non-null pagination token is returned in a result, pass its value in here to list more branches. 
     */
    nextToken?: NextToken;
    /**
     *  The maximum number of records to list in a single response. 
     */
    maxResults?: MaxResults;
  }
  export interface ListBranchesResult {
    /**
     *  A list of branches for an Amplify app. 
     */
    branches: Branches;
    /**
     *  A pagination token. If a non-null pagination token is returned in a result, pass its value in another request to retrieve more entries. 
     */
    nextToken?: NextToken;
  }
  export interface ListDomainAssociationsRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  A pagination token. Set to null to start listing apps from the start. If non-null, a pagination token is returned in a result. Pass its value in here to list more projects. 
     */
    nextToken?: NextToken;
    /**
     *  The maximum number of records to list in a single response. 
     */
    maxResults?: MaxResults;
  }
  export interface ListDomainAssociationsResult {
    /**
     *  A list of domain associations. 
     */
    domainAssociations: DomainAssociations;
    /**
     *  A pagination token. If non-null, a pagination token is returned in a result. Pass its value in another request to retrieve more entries. 
     */
    nextToken?: NextToken;
  }
  export interface ListJobsRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for a branch. 
     */
    branchName: BranchName;
    /**
     *  A pagination token. Set to null to start listing steps from the start. If a non-null pagination token is returned in a result, pass its value in here to list more steps. 
     */
    nextToken?: NextToken;
    /**
     *  The maximum number of records to list in a single response. 
     */
    maxResults?: MaxResults;
  }
  export interface ListJobsResult {
    /**
     *  The result structure for the list job result request. 
     */
    jobSummaries: JobSummaries;
    /**
     *  A pagination token. If non-null the pagination token is returned in a result. Pass its value in another request to retrieve more entries. 
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) to use to list tags. 
     */
    resourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     *  A list of tags for the specified The Amazon Resource Name (ARN). 
     */
    tags?: TagMap;
  }
  export interface ListWebhooksRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  A pagination token. Set to null to start listing webhooks from the start. If non-null,the pagination token is returned in a result. Pass its value in here to list more webhooks. 
     */
    nextToken?: NextToken;
    /**
     *  The maximum number of records to list in a single response. 
     */
    maxResults?: MaxResults;
  }
  export interface ListWebhooksResult {
    /**
     *  A list of webhooks. 
     */
    webhooks: Webhooks;
    /**
     *  A pagination token. If non-null, the pagination token is returned in a result. Pass its value in another request to retrieve more entries. 
     */
    nextToken?: NextToken;
  }
  export type LogUrl = string;
  export type MD5Hash = string;
  export type MaxResults = number;
  export type Name = string;
  export type NextToken = string;
  export type OauthToken = string;
  export type Platform = "WEB"|"WEB_DYNAMIC"|"WEB_COMPUTE"|string;
  export interface ProductionBranch {
    /**
     *  The last deploy time of the production branch. 
     */
    lastDeployTime?: LastDeployTime;
    /**
     *  The status of the production branch. 
     */
    status?: Status;
    /**
     *  The thumbnail URL for the production branch. 
     */
    thumbnailUrl?: ThumbnailUrl;
    /**
     *  The branch name for the production branch. 
     */
    branchName?: BranchName;
  }
  export type PullRequestEnvironmentName = string;
  export type Repository = string;
  export type RepositoryCloneMethod = "SSH"|"TOKEN"|"SIGV4"|string;
  export type ResourceArn = string;
  export type Screenshots = {[key: string]: ThumbnailUrl};
  export type ServiceRoleArn = string;
  export type Source = string;
  export type SourceUrl = string;
  export type StackName = string;
  export type Stage = "PRODUCTION"|"BETA"|"DEVELOPMENT"|"EXPERIMENTAL"|"PULL_REQUEST"|string;
  export interface StartDeploymentRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for the branch, for the job. 
     */
    branchName: BranchName;
    /**
     *  The job ID for this deployment, generated by the create deployment request. 
     */
    jobId?: JobId;
    /**
     *  The source URL for this deployment, used when calling start deployment without create deployment. The source URL can be any HTTP GET URL that is publicly accessible and downloads a single .zip file. 
     */
    sourceUrl?: SourceUrl;
  }
  export interface StartDeploymentResult {
    /**
     *  The summary for the job. 
     */
    jobSummary: JobSummary;
  }
  export interface StartJobRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The branch name for the job. 
     */
    branchName: BranchName;
    /**
     *  The unique ID for an existing job. This is required if the value of jobType is RETRY. 
     */
    jobId?: JobId;
    /**
     *  Describes the type for the job. The job type RELEASE starts a new job with the latest change from the specified branch. This value is available only for apps that are connected to a repository. The job type RETRY retries an existing job. If the job type value is RETRY, the jobId is also required. 
     */
    jobType: JobType;
    /**
     *  A descriptive reason for starting this job. 
     */
    jobReason?: JobReason;
    /**
     *  The commit ID from a third-party repository provider for the job. 
     */
    commitId?: CommitId;
    /**
     *  The commit message from a third-party repository provider for the job. 
     */
    commitMessage?: CommitMessage;
    /**
     *  The commit date and time for the job. 
     */
    commitTime?: CommitTime;
  }
  export interface StartJobResult {
    /**
     *  The summary for the job. 
     */
    jobSummary: JobSummary;
  }
  export type StartTime = Date;
  export type Status = string;
  export type StatusReason = string;
  export interface Step {
    /**
     *  The name of the execution step. 
     */
    stepName: StepName;
    /**
     *  The start date and time of the execution step. 
     */
    startTime: StartTime;
    /**
     *  The status of the execution step. 
     */
    status: JobStatus;
    /**
     *  The end date and time of the execution step. 
     */
    endTime: EndTime;
    /**
     *  The URL to the logs for the execution step. 
     */
    logUrl?: LogUrl;
    /**
     *  The URL to the artifact for the execution step. 
     */
    artifactsUrl?: ArtifactsUrl;
    /**
     *  The URL to the test artifact for the execution step. 
     */
    testArtifactsUrl?: TestArtifactsUrl;
    /**
     *  The URL to the test configuration for the execution step. 
     */
    testConfigUrl?: TestConfigUrl;
    /**
     *  The list of screenshot URLs for the execution step, if relevant. 
     */
    screenshots?: Screenshots;
    /**
     *  The reason for the current step status. 
     */
    statusReason?: StatusReason;
    /**
     *  The context for the current step. Includes a build image if the step is build. 
     */
    context?: Context;
  }
  export type StepName = string;
  export type Steps = Step[];
  export interface StopJobRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for the branch, for the job. 
     */
    branchName: BranchName;
    /**
     *  The unique id for the job. 
     */
    jobId: JobId;
  }
  export interface StopJobResult {
    /**
     *  The summary for the job. 
     */
    jobSummary: JobSummary;
  }
  export interface SubDomain {
    /**
     *  Describes the settings for the subdomain. 
     */
    subDomainSetting: SubDomainSetting;
    /**
     *  The verified status of the subdomain 
     */
    verified: Verified;
    /**
     *  The DNS record for the subdomain. 
     */
    dnsRecord: DNSRecord;
  }
  export interface SubDomainSetting {
    /**
     *  The prefix setting for the subdomain. 
     */
    prefix: DomainPrefix;
    /**
     *  The branch name setting for the subdomain. 
     */
    branchName: BranchName;
  }
  export type SubDomainSettings = SubDomainSetting[];
  export type SubDomains = SubDomain[];
  export type TTL = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) to use to tag a resource. 
     */
    resourceArn: ResourceArn;
    /**
     *  The tags used to tag the resource. 
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Target = string;
  export type TestArtifactsUrl = string;
  export type TestConfigUrl = string;
  export type ThumbnailName = string;
  export type ThumbnailUrl = string;
  export type TotalNumberOfJobs = string;
  export interface UntagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) to use to untag a resource. 
     */
    resourceArn: ResourceArn;
    /**
     *  The tag keys to use to untag a resource. 
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAppRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for an Amplify app. 
     */
    name?: Name;
    /**
     *  The description for an Amplify app. 
     */
    description?: Description;
    /**
     *  The platform for the Amplify app. For a static app, set the platform type to WEB. For a dynamic server-side rendered (SSR) app, set the platform type to WEB_COMPUTE. For an app requiring Amplify Hosting's original SSR support only, set the platform type to WEB_DYNAMIC.
     */
    platform?: Platform;
    /**
     *  The AWS Identity and Access Management (IAM) service role for an Amplify app. 
     */
    iamServiceRoleArn?: ServiceRoleArn;
    /**
     *  The environment variables for an Amplify app. 
     */
    environmentVariables?: EnvironmentVariables;
    /**
     *  Enables branch auto-building for an Amplify app. 
     */
    enableBranchAutoBuild?: EnableAutoBuild;
    /**
     *  Automatically disconnects a branch in the Amplify Console when you delete a branch from your Git repository. 
     */
    enableBranchAutoDeletion?: EnableBranchAutoDeletion;
    /**
     *  Enables basic authorization for an Amplify app. 
     */
    enableBasicAuth?: EnableBasicAuth;
    /**
     *  The basic authorization credentials for an Amplify app. You must base64-encode the authorization credentials and provide them in the format user:password.
     */
    basicAuthCredentials?: BasicAuthCredentials;
    /**
     *  The custom redirect and rewrite rules for an Amplify app. 
     */
    customRules?: CustomRules;
    /**
     *  The build specification (build spec) for an Amplify app. 
     */
    buildSpec?: BuildSpec;
    /**
     * The custom HTTP headers for an Amplify app.
     */
    customHeaders?: CustomHeaders;
    /**
     *  Enables automated branch creation for an Amplify app. 
     */
    enableAutoBranchCreation?: EnableAutoBranchCreation;
    /**
     *  Describes the automated branch creation glob patterns for an Amplify app. 
     */
    autoBranchCreationPatterns?: AutoBranchCreationPatterns;
    /**
     *  The automated branch creation configuration for an Amplify app. 
     */
    autoBranchCreationConfig?: AutoBranchCreationConfig;
    /**
     *  The name of the repository for an Amplify app 
     */
    repository?: Repository;
    /**
     * The OAuth token for a third-party source control system for an Amplify app. The OAuth token is used to create a webhook and a read-only deploy key using SSH cloning. The OAuth token is not stored. Use oauthToken for repository providers other than GitHub, such as Bitbucket or CodeCommit. To authorize access to GitHub as your repository provider, use accessToken. You must specify either oauthToken or accessToken when you update an app. Existing Amplify apps deployed from a GitHub repository using OAuth continue to work with CI/CD. However, we strongly recommend that you migrate these apps to use the GitHub App. For more information, see Migrating an existing OAuth app to the Amplify GitHub App in the Amplify User Guide .
     */
    oauthToken?: OauthToken;
    /**
     * The personal access token for a GitHub repository for an Amplify app. The personal access token is used to authorize access to a GitHub repository using the Amplify GitHub App. The token is not stored. Use accessToken for GitHub repositories only. To authorize access to a repository provider such as Bitbucket or CodeCommit, use oauthToken. You must specify either accessToken or oauthToken when you update an app. Existing Amplify apps deployed from a GitHub repository using OAuth continue to work with CI/CD. However, we strongly recommend that you migrate these apps to use the GitHub App. For more information, see Migrating an existing OAuth app to the Amplify GitHub App in the Amplify User Guide .
     */
    accessToken?: AccessToken;
  }
  export interface UpdateAppResult {
    /**
     *  Represents the updated Amplify app. 
     */
    app: App;
  }
  export interface UpdateBranchRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name for the branch. 
     */
    branchName: BranchName;
    /**
     *  The description for the branch. 
     */
    description?: Description;
    /**
     *  The framework for the branch. 
     */
    framework?: Framework;
    /**
     *  Describes the current stage for the branch. 
     */
    stage?: Stage;
    /**
     *  Enables notifications for the branch. 
     */
    enableNotification?: EnableNotification;
    /**
     *  Enables auto building for the branch. 
     */
    enableAutoBuild?: EnableAutoBuild;
    /**
     *  The environment variables for the branch. 
     */
    environmentVariables?: EnvironmentVariables;
    /**
     *  The basic authorization credentials for the branch. You must base64-encode the authorization credentials and provide them in the format user:password.
     */
    basicAuthCredentials?: BasicAuthCredentials;
    /**
     *  Enables basic authorization for the branch. 
     */
    enableBasicAuth?: EnableBasicAuth;
    /**
     * Enables performance mode for the branch. Performance mode optimizes for faster hosting performance by keeping content cached at the edge for a longer interval. When performance mode is enabled, hosting configuration or code changes can take up to 10 minutes to roll out. 
     */
    enablePerformanceMode?: EnablePerformanceMode;
    /**
     *  The build specification (build spec) for the branch. 
     */
    buildSpec?: BuildSpec;
    /**
     *  The content Time to Live (TTL) for the website in seconds. 
     */
    ttl?: TTL;
    /**
     *  The display name for a branch. This is used as the default domain prefix. 
     */
    displayName?: DisplayName;
    /**
     *  Enables pull request previews for this branch. 
     */
    enablePullRequestPreview?: EnablePullRequestPreview;
    /**
     *  The Amplify environment name for the pull request. 
     */
    pullRequestEnvironmentName?: PullRequestEnvironmentName;
    /**
     *  The Amazon Resource Name (ARN) for a backend environment that is part of an Amplify app. 
     */
    backendEnvironmentArn?: BackendEnvironmentArn;
  }
  export interface UpdateBranchResult {
    /**
     *  The branch for an Amplify app, which maps to a third-party repository branch. 
     */
    branch: Branch;
  }
  export interface UpdateDomainAssociationRequest {
    /**
     *  The unique ID for an Amplify app. 
     */
    appId: AppId;
    /**
     *  The name of the domain. 
     */
    domainName: DomainName;
    /**
     *  Enables the automated creation of subdomains for branches. 
     */
    enableAutoSubDomain?: EnableAutoSubDomain;
    /**
     *  Describes the settings for the subdomain. 
     */
    subDomainSettings?: SubDomainSettings;
    /**
     *  Sets the branch patterns for automatic subdomain creation. 
     */
    autoSubDomainCreationPatterns?: AutoSubDomainCreationPatterns;
    /**
     *  The required AWS Identity and Access Management (IAM) service role for the Amazon Resource Name (ARN) for automatically creating subdomains. 
     */
    autoSubDomainIAMRole?: AutoSubDomainIAMRole;
  }
  export interface UpdateDomainAssociationResult {
    /**
     *  Describes a domain association, which associates a custom domain with an Amplify app. 
     */
    domainAssociation: DomainAssociation;
  }
  export type UpdateTime = Date;
  export interface UpdateWebhookRequest {
    /**
     *  The unique ID for a webhook. 
     */
    webhookId: WebhookId;
    /**
     *  The name for a branch that is part of an Amplify app. 
     */
    branchName?: BranchName;
    /**
     *  The description for a webhook. 
     */
    description?: Description;
  }
  export interface UpdateWebhookResult {
    /**
     *  Describes a webhook that connects repository events to an Amplify app. 
     */
    webhook: Webhook;
  }
  export type UploadUrl = string;
  export type Verified = boolean;
  export interface Webhook {
    /**
     *  The Amazon Resource Name (ARN) for the webhook. 
     */
    webhookArn: WebhookArn;
    /**
     *  The ID of the webhook. 
     */
    webhookId: WebhookId;
    /**
     *  The URL of the webhook. 
     */
    webhookUrl: WebhookUrl;
    /**
     *  The name for a branch that is part of an Amplify app. 
     */
    branchName: BranchName;
    /**
     *  The description for a webhook. 
     */
    description: Description;
    /**
     *  The create date and time for a webhook. 
     */
    createTime: CreateTime;
    /**
     *  Updates the date and time for a webhook. 
     */
    updateTime: UpdateTime;
  }
  export type WebhookArn = string;
  export type WebhookId = string;
  export type WebhookUrl = string;
  export type Webhooks = Webhook[];
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
   * Contains interfaces for use with the Amplify client.
   */
  export import Types = Amplify;
}
export = Amplify;
