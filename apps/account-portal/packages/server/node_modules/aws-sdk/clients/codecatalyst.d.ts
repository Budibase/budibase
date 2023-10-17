import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CodeCatalyst extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CodeCatalyst.Types.ClientConfiguration)
  config: Config & CodeCatalyst.Types.ClientConfiguration;
  /**
   * Creates a personal access token (PAT) for the current user. A personal access token (PAT) is similar to a password. It is associated with your user identity for use across all spaces and projects in Amazon CodeCatalyst. You use PATs to access CodeCatalyst from resources that include integrated development environments (IDEs) and Git-based source repositories. PATs represent you in Amazon CodeCatalyst and you can manage them in your user settings.For more information, see Managing personal access tokens in Amazon CodeCatalyst.
   */
  createAccessToken(params: CodeCatalyst.Types.CreateAccessTokenRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.CreateAccessTokenResponse) => void): Request<CodeCatalyst.Types.CreateAccessTokenResponse, AWSError>;
  /**
   * Creates a personal access token (PAT) for the current user. A personal access token (PAT) is similar to a password. It is associated with your user identity for use across all spaces and projects in Amazon CodeCatalyst. You use PATs to access CodeCatalyst from resources that include integrated development environments (IDEs) and Git-based source repositories. PATs represent you in Amazon CodeCatalyst and you can manage them in your user settings.For more information, see Managing personal access tokens in Amazon CodeCatalyst.
   */
  createAccessToken(callback?: (err: AWSError, data: CodeCatalyst.Types.CreateAccessTokenResponse) => void): Request<CodeCatalyst.Types.CreateAccessTokenResponse, AWSError>;
  /**
   * Creates a Dev Environment in Amazon CodeCatalyst, a cloud-based development environment that you can use to quickly work on the code stored in the source repositories of your project.   When created in the Amazon CodeCatalyst console, by default a Dev Environment is configured to have a 2 core processor, 4GB of RAM, and 16GB of persistent storage. None of these defaults apply to a Dev Environment created programmatically. 
   */
  createDevEnvironment(params: CodeCatalyst.Types.CreateDevEnvironmentRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.CreateDevEnvironmentResponse) => void): Request<CodeCatalyst.Types.CreateDevEnvironmentResponse, AWSError>;
  /**
   * Creates a Dev Environment in Amazon CodeCatalyst, a cloud-based development environment that you can use to quickly work on the code stored in the source repositories of your project.   When created in the Amazon CodeCatalyst console, by default a Dev Environment is configured to have a 2 core processor, 4GB of RAM, and 16GB of persistent storage. None of these defaults apply to a Dev Environment created programmatically. 
   */
  createDevEnvironment(callback?: (err: AWSError, data: CodeCatalyst.Types.CreateDevEnvironmentResponse) => void): Request<CodeCatalyst.Types.CreateDevEnvironmentResponse, AWSError>;
  /**
   * Creates a project in a specified space.
   */
  createProject(params: CodeCatalyst.Types.CreateProjectRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.CreateProjectResponse) => void): Request<CodeCatalyst.Types.CreateProjectResponse, AWSError>;
  /**
   * Creates a project in a specified space.
   */
  createProject(callback?: (err: AWSError, data: CodeCatalyst.Types.CreateProjectResponse) => void): Request<CodeCatalyst.Types.CreateProjectResponse, AWSError>;
  /**
   * Creates an empty Git-based source repository in a specified project. The repository is created with an initial empty commit with a default branch named main.
   */
  createSourceRepository(params: CodeCatalyst.Types.CreateSourceRepositoryRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.CreateSourceRepositoryResponse) => void): Request<CodeCatalyst.Types.CreateSourceRepositoryResponse, AWSError>;
  /**
   * Creates an empty Git-based source repository in a specified project. The repository is created with an initial empty commit with a default branch named main.
   */
  createSourceRepository(callback?: (err: AWSError, data: CodeCatalyst.Types.CreateSourceRepositoryResponse) => void): Request<CodeCatalyst.Types.CreateSourceRepositoryResponse, AWSError>;
  /**
   * Creates a branch in a specified source repository in Amazon CodeCatalyst.   This API only creates a branch in a source repository hosted in Amazon CodeCatalyst. You cannot use this API to create a branch in a linked repository. 
   */
  createSourceRepositoryBranch(params: CodeCatalyst.Types.CreateSourceRepositoryBranchRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.CreateSourceRepositoryBranchResponse) => void): Request<CodeCatalyst.Types.CreateSourceRepositoryBranchResponse, AWSError>;
  /**
   * Creates a branch in a specified source repository in Amazon CodeCatalyst.   This API only creates a branch in a source repository hosted in Amazon CodeCatalyst. You cannot use this API to create a branch in a linked repository. 
   */
  createSourceRepositoryBranch(callback?: (err: AWSError, data: CodeCatalyst.Types.CreateSourceRepositoryBranchResponse) => void): Request<CodeCatalyst.Types.CreateSourceRepositoryBranchResponse, AWSError>;
  /**
   * Deletes a specified personal access token (PAT). A personal access token can only be deleted by the user who created it.
   */
  deleteAccessToken(params: CodeCatalyst.Types.DeleteAccessTokenRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.DeleteAccessTokenResponse) => void): Request<CodeCatalyst.Types.DeleteAccessTokenResponse, AWSError>;
  /**
   * Deletes a specified personal access token (PAT). A personal access token can only be deleted by the user who created it.
   */
  deleteAccessToken(callback?: (err: AWSError, data: CodeCatalyst.Types.DeleteAccessTokenResponse) => void): Request<CodeCatalyst.Types.DeleteAccessTokenResponse, AWSError>;
  /**
   * Deletes a Dev Environment. 
   */
  deleteDevEnvironment(params: CodeCatalyst.Types.DeleteDevEnvironmentRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.DeleteDevEnvironmentResponse) => void): Request<CodeCatalyst.Types.DeleteDevEnvironmentResponse, AWSError>;
  /**
   * Deletes a Dev Environment. 
   */
  deleteDevEnvironment(callback?: (err: AWSError, data: CodeCatalyst.Types.DeleteDevEnvironmentResponse) => void): Request<CodeCatalyst.Types.DeleteDevEnvironmentResponse, AWSError>;
  /**
   * Deletes a project in a space.
   */
  deleteProject(params: CodeCatalyst.Types.DeleteProjectRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.DeleteProjectResponse) => void): Request<CodeCatalyst.Types.DeleteProjectResponse, AWSError>;
  /**
   * Deletes a project in a space.
   */
  deleteProject(callback?: (err: AWSError, data: CodeCatalyst.Types.DeleteProjectResponse) => void): Request<CodeCatalyst.Types.DeleteProjectResponse, AWSError>;
  /**
   * Deletes a source repository in Amazon CodeCatalyst. You cannot use this API to delete a linked repository. It can only be used to delete a Amazon CodeCatalyst source repository.
   */
  deleteSourceRepository(params: CodeCatalyst.Types.DeleteSourceRepositoryRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.DeleteSourceRepositoryResponse) => void): Request<CodeCatalyst.Types.DeleteSourceRepositoryResponse, AWSError>;
  /**
   * Deletes a source repository in Amazon CodeCatalyst. You cannot use this API to delete a linked repository. It can only be used to delete a Amazon CodeCatalyst source repository.
   */
  deleteSourceRepository(callback?: (err: AWSError, data: CodeCatalyst.Types.DeleteSourceRepositoryResponse) => void): Request<CodeCatalyst.Types.DeleteSourceRepositoryResponse, AWSError>;
  /**
   * Deletes a space.  Deleting a space cannot be undone. Additionally, since space names must be unique across Amazon CodeCatalyst, you cannot reuse names of deleted spaces. 
   */
  deleteSpace(params: CodeCatalyst.Types.DeleteSpaceRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.DeleteSpaceResponse) => void): Request<CodeCatalyst.Types.DeleteSpaceResponse, AWSError>;
  /**
   * Deletes a space.  Deleting a space cannot be undone. Additionally, since space names must be unique across Amazon CodeCatalyst, you cannot reuse names of deleted spaces. 
   */
  deleteSpace(callback?: (err: AWSError, data: CodeCatalyst.Types.DeleteSpaceResponse) => void): Request<CodeCatalyst.Types.DeleteSpaceResponse, AWSError>;
  /**
   * Returns information about a Dev Environment for a source repository in a project. Dev Environments are specific to the user who creates them.
   */
  getDevEnvironment(params: CodeCatalyst.Types.GetDevEnvironmentRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.GetDevEnvironmentResponse) => void): Request<CodeCatalyst.Types.GetDevEnvironmentResponse, AWSError>;
  /**
   * Returns information about a Dev Environment for a source repository in a project. Dev Environments are specific to the user who creates them.
   */
  getDevEnvironment(callback?: (err: AWSError, data: CodeCatalyst.Types.GetDevEnvironmentResponse) => void): Request<CodeCatalyst.Types.GetDevEnvironmentResponse, AWSError>;
  /**
   * Returns information about a project.
   */
  getProject(params: CodeCatalyst.Types.GetProjectRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.GetProjectResponse) => void): Request<CodeCatalyst.Types.GetProjectResponse, AWSError>;
  /**
   * Returns information about a project.
   */
  getProject(callback?: (err: AWSError, data: CodeCatalyst.Types.GetProjectResponse) => void): Request<CodeCatalyst.Types.GetProjectResponse, AWSError>;
  /**
   * Returns information about a source repository.
   */
  getSourceRepository(params: CodeCatalyst.Types.GetSourceRepositoryRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.GetSourceRepositoryResponse) => void): Request<CodeCatalyst.Types.GetSourceRepositoryResponse, AWSError>;
  /**
   * Returns information about a source repository.
   */
  getSourceRepository(callback?: (err: AWSError, data: CodeCatalyst.Types.GetSourceRepositoryResponse) => void): Request<CodeCatalyst.Types.GetSourceRepositoryResponse, AWSError>;
  /**
   * Returns information about the URLs that can be used with a Git client to clone a source repository.
   */
  getSourceRepositoryCloneUrls(params: CodeCatalyst.Types.GetSourceRepositoryCloneUrlsRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.GetSourceRepositoryCloneUrlsResponse) => void): Request<CodeCatalyst.Types.GetSourceRepositoryCloneUrlsResponse, AWSError>;
  /**
   * Returns information about the URLs that can be used with a Git client to clone a source repository.
   */
  getSourceRepositoryCloneUrls(callback?: (err: AWSError, data: CodeCatalyst.Types.GetSourceRepositoryCloneUrlsResponse) => void): Request<CodeCatalyst.Types.GetSourceRepositoryCloneUrlsResponse, AWSError>;
  /**
   * Returns information about an space.
   */
  getSpace(params: CodeCatalyst.Types.GetSpaceRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.GetSpaceResponse) => void): Request<CodeCatalyst.Types.GetSpaceResponse, AWSError>;
  /**
   * Returns information about an space.
   */
  getSpace(callback?: (err: AWSError, data: CodeCatalyst.Types.GetSpaceResponse) => void): Request<CodeCatalyst.Types.GetSpaceResponse, AWSError>;
  /**
   * Returns information about the Amazon Web Services account used for billing purposes and the billing plan for the space.
   */
  getSubscription(params: CodeCatalyst.Types.GetSubscriptionRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.GetSubscriptionResponse) => void): Request<CodeCatalyst.Types.GetSubscriptionResponse, AWSError>;
  /**
   * Returns information about the Amazon Web Services account used for billing purposes and the billing plan for the space.
   */
  getSubscription(callback?: (err: AWSError, data: CodeCatalyst.Types.GetSubscriptionResponse) => void): Request<CodeCatalyst.Types.GetSubscriptionResponse, AWSError>;
  /**
   * Returns information about a user. 
   */
  getUserDetails(params: CodeCatalyst.Types.GetUserDetailsRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.GetUserDetailsResponse) => void): Request<CodeCatalyst.Types.GetUserDetailsResponse, AWSError>;
  /**
   * Returns information about a user. 
   */
  getUserDetails(callback?: (err: AWSError, data: CodeCatalyst.Types.GetUserDetailsResponse) => void): Request<CodeCatalyst.Types.GetUserDetailsResponse, AWSError>;
  /**
   * Lists all personal access tokens (PATs) associated with the user who calls the API. You can only list PATs associated with your Amazon Web Services Builder ID.
   */
  listAccessTokens(params: CodeCatalyst.Types.ListAccessTokensRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.ListAccessTokensResponse) => void): Request<CodeCatalyst.Types.ListAccessTokensResponse, AWSError>;
  /**
   * Lists all personal access tokens (PATs) associated with the user who calls the API. You can only list PATs associated with your Amazon Web Services Builder ID.
   */
  listAccessTokens(callback?: (err: AWSError, data: CodeCatalyst.Types.ListAccessTokensResponse) => void): Request<CodeCatalyst.Types.ListAccessTokensResponse, AWSError>;
  /**
   * Retrieves a list of active sessions for a Dev Environment in a project.
   */
  listDevEnvironmentSessions(params: CodeCatalyst.Types.ListDevEnvironmentSessionsRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.ListDevEnvironmentSessionsResponse) => void): Request<CodeCatalyst.Types.ListDevEnvironmentSessionsResponse, AWSError>;
  /**
   * Retrieves a list of active sessions for a Dev Environment in a project.
   */
  listDevEnvironmentSessions(callback?: (err: AWSError, data: CodeCatalyst.Types.ListDevEnvironmentSessionsResponse) => void): Request<CodeCatalyst.Types.ListDevEnvironmentSessionsResponse, AWSError>;
  /**
   * Retrieves a list of Dev Environments in a project.
   */
  listDevEnvironments(params: CodeCatalyst.Types.ListDevEnvironmentsRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.ListDevEnvironmentsResponse) => void): Request<CodeCatalyst.Types.ListDevEnvironmentsResponse, AWSError>;
  /**
   * Retrieves a list of Dev Environments in a project.
   */
  listDevEnvironments(callback?: (err: AWSError, data: CodeCatalyst.Types.ListDevEnvironmentsResponse) => void): Request<CodeCatalyst.Types.ListDevEnvironmentsResponse, AWSError>;
  /**
   * Retrieves a list of events that occurred during a specified time period in a space. You can use these events to audit user and system activity in a space.
   */
  listEventLogs(params: CodeCatalyst.Types.ListEventLogsRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.ListEventLogsResponse) => void): Request<CodeCatalyst.Types.ListEventLogsResponse, AWSError>;
  /**
   * Retrieves a list of events that occurred during a specified time period in a space. You can use these events to audit user and system activity in a space.
   */
  listEventLogs(callback?: (err: AWSError, data: CodeCatalyst.Types.ListEventLogsResponse) => void): Request<CodeCatalyst.Types.ListEventLogsResponse, AWSError>;
  /**
   * Retrieves a list of projects.
   */
  listProjects(params: CodeCatalyst.Types.ListProjectsRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.ListProjectsResponse) => void): Request<CodeCatalyst.Types.ListProjectsResponse, AWSError>;
  /**
   * Retrieves a list of projects.
   */
  listProjects(callback?: (err: AWSError, data: CodeCatalyst.Types.ListProjectsResponse) => void): Request<CodeCatalyst.Types.ListProjectsResponse, AWSError>;
  /**
   * Retrieves a list of source repositories in a project.
   */
  listSourceRepositories(params: CodeCatalyst.Types.ListSourceRepositoriesRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.ListSourceRepositoriesResponse) => void): Request<CodeCatalyst.Types.ListSourceRepositoriesResponse, AWSError>;
  /**
   * Retrieves a list of source repositories in a project.
   */
  listSourceRepositories(callback?: (err: AWSError, data: CodeCatalyst.Types.ListSourceRepositoriesResponse) => void): Request<CodeCatalyst.Types.ListSourceRepositoriesResponse, AWSError>;
  /**
   * Retrieves a list of branches in a specified source repository.
   */
  listSourceRepositoryBranches(params: CodeCatalyst.Types.ListSourceRepositoryBranchesRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.ListSourceRepositoryBranchesResponse) => void): Request<CodeCatalyst.Types.ListSourceRepositoryBranchesResponse, AWSError>;
  /**
   * Retrieves a list of branches in a specified source repository.
   */
  listSourceRepositoryBranches(callback?: (err: AWSError, data: CodeCatalyst.Types.ListSourceRepositoryBranchesResponse) => void): Request<CodeCatalyst.Types.ListSourceRepositoryBranchesResponse, AWSError>;
  /**
   * Retrieves a list of spaces.
   */
  listSpaces(params: CodeCatalyst.Types.ListSpacesRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.ListSpacesResponse) => void): Request<CodeCatalyst.Types.ListSpacesResponse, AWSError>;
  /**
   * Retrieves a list of spaces.
   */
  listSpaces(callback?: (err: AWSError, data: CodeCatalyst.Types.ListSpacesResponse) => void): Request<CodeCatalyst.Types.ListSpacesResponse, AWSError>;
  /**
   * Starts a specified Dev Environment and puts it into an active state. 
   */
  startDevEnvironment(params: CodeCatalyst.Types.StartDevEnvironmentRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.StartDevEnvironmentResponse) => void): Request<CodeCatalyst.Types.StartDevEnvironmentResponse, AWSError>;
  /**
   * Starts a specified Dev Environment and puts it into an active state. 
   */
  startDevEnvironment(callback?: (err: AWSError, data: CodeCatalyst.Types.StartDevEnvironmentResponse) => void): Request<CodeCatalyst.Types.StartDevEnvironmentResponse, AWSError>;
  /**
   * Starts a session for a specified Dev Environment.
   */
  startDevEnvironmentSession(params: CodeCatalyst.Types.StartDevEnvironmentSessionRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.StartDevEnvironmentSessionResponse) => void): Request<CodeCatalyst.Types.StartDevEnvironmentSessionResponse, AWSError>;
  /**
   * Starts a session for a specified Dev Environment.
   */
  startDevEnvironmentSession(callback?: (err: AWSError, data: CodeCatalyst.Types.StartDevEnvironmentSessionResponse) => void): Request<CodeCatalyst.Types.StartDevEnvironmentSessionResponse, AWSError>;
  /**
   * Pauses a specified Dev Environment and places it in a non-running state. Stopped Dev Environments do not consume compute minutes.
   */
  stopDevEnvironment(params: CodeCatalyst.Types.StopDevEnvironmentRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.StopDevEnvironmentResponse) => void): Request<CodeCatalyst.Types.StopDevEnvironmentResponse, AWSError>;
  /**
   * Pauses a specified Dev Environment and places it in a non-running state. Stopped Dev Environments do not consume compute minutes.
   */
  stopDevEnvironment(callback?: (err: AWSError, data: CodeCatalyst.Types.StopDevEnvironmentResponse) => void): Request<CodeCatalyst.Types.StopDevEnvironmentResponse, AWSError>;
  /**
   * Stops a session for a specified Dev Environment.
   */
  stopDevEnvironmentSession(params: CodeCatalyst.Types.StopDevEnvironmentSessionRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.StopDevEnvironmentSessionResponse) => void): Request<CodeCatalyst.Types.StopDevEnvironmentSessionResponse, AWSError>;
  /**
   * Stops a session for a specified Dev Environment.
   */
  stopDevEnvironmentSession(callback?: (err: AWSError, data: CodeCatalyst.Types.StopDevEnvironmentSessionResponse) => void): Request<CodeCatalyst.Types.StopDevEnvironmentSessionResponse, AWSError>;
  /**
   * Changes one or more values for a Dev Environment. Updating certain values of the Dev Environment will cause a restart.
   */
  updateDevEnvironment(params: CodeCatalyst.Types.UpdateDevEnvironmentRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.UpdateDevEnvironmentResponse) => void): Request<CodeCatalyst.Types.UpdateDevEnvironmentResponse, AWSError>;
  /**
   * Changes one or more values for a Dev Environment. Updating certain values of the Dev Environment will cause a restart.
   */
  updateDevEnvironment(callback?: (err: AWSError, data: CodeCatalyst.Types.UpdateDevEnvironmentResponse) => void): Request<CodeCatalyst.Types.UpdateDevEnvironmentResponse, AWSError>;
  /**
   * Changes one or more values for a project.
   */
  updateProject(params: CodeCatalyst.Types.UpdateProjectRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.UpdateProjectResponse) => void): Request<CodeCatalyst.Types.UpdateProjectResponse, AWSError>;
  /**
   * Changes one or more values for a project.
   */
  updateProject(callback?: (err: AWSError, data: CodeCatalyst.Types.UpdateProjectResponse) => void): Request<CodeCatalyst.Types.UpdateProjectResponse, AWSError>;
  /**
   * Changes one or more values for a space.
   */
  updateSpace(params: CodeCatalyst.Types.UpdateSpaceRequest, callback?: (err: AWSError, data: CodeCatalyst.Types.UpdateSpaceResponse) => void): Request<CodeCatalyst.Types.UpdateSpaceResponse, AWSError>;
  /**
   * Changes one or more values for a space.
   */
  updateSpace(callback?: (err: AWSError, data: CodeCatalyst.Types.UpdateSpaceResponse) => void): Request<CodeCatalyst.Types.UpdateSpaceResponse, AWSError>;
  /**
   * Verifies whether the calling user has a valid Amazon CodeCatalyst login and session. If successful, this returns the ID of the user in Amazon CodeCatalyst.
   */
  verifySession(callback?: (err: AWSError, data: CodeCatalyst.Types.VerifySessionResponse) => void): Request<CodeCatalyst.Types.VerifySessionResponse, AWSError>;
}
declare namespace CodeCatalyst {
  export type AccessTokenId = string;
  export type AccessTokenName = string;
  export type AccessTokenSecret = string;
  export type AccessTokenSummaries = AccessTokenSummary[];
  export interface AccessTokenSummary {
    /**
     * The system-generated ID of the personal access token.
     */
    id: AccessTokenId;
    /**
     * The friendly name of the personal access token.
     */
    name: AccessTokenName;
    /**
     * The date and time when the personal access token will expire, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    expiresTime?: SyntheticTimestamp_date_time;
  }
  export type Boolean = boolean;
  export type ClientToken = string;
  export type ComparisonOperator = "EQ"|"GT"|"GE"|"LT"|"LE"|string;
  export interface CreateAccessTokenRequest {
    /**
     * The friendly name of the personal access token.
     */
    name: AccessTokenName;
    /**
     * The date and time the personal access token expires, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    expiresTime?: SyntheticTimestamp_date_time;
  }
  export interface CreateAccessTokenResponse {
    /**
     * The secret value of the personal access token.
     */
    secret: AccessTokenSecret;
    /**
     * The friendly name of the personal access token.
     */
    name: AccessTokenName;
    /**
     * The date and time the personal access token expires, in coordinated universal time (UTC) timestamp format as specified in RFC 3339. If not specified, the default is one year from creation.
     */
    expiresTime: SyntheticTimestamp_date_time;
    /**
     * The system-generated unique ID of the access token.
     */
    accessTokenId: AccessTokenId;
  }
  export interface CreateDevEnvironmentRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The source repository that contains the branch to clone into the Dev Environment. 
     */
    repositories?: RepositoriesInput;
    /**
     * A user-specified idempotency token. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, the subsequent retries return the result from the original successful request and have no additional effect.
     */
    clientToken?: ClientToken;
    /**
     * The user-defined alias for a Dev Environment.
     */
    alias?: CreateDevEnvironmentRequestAliasString;
    /**
     * Information about the integrated development environment (IDE) configured for a Dev Environment.  An IDE is required to create a Dev Environment. For Dev Environment creation, this field contains configuration information and must be provided.  
     */
    ides?: IdeConfigurationList;
    /**
     * The Amazon EC2 instace type to use for the Dev Environment. 
     */
    instanceType: InstanceType;
    /**
     * The amount of time the Dev Environment will run without any activity detected before stopping, in minutes. Only whole integers are allowed. Dev Environments consume compute minutes when running.
     */
    inactivityTimeoutMinutes?: InactivityTimeoutMinutes;
    /**
     * Information about the amount of storage allocated to the Dev Environment.   By default, a Dev Environment is configured to have 16GB of persistent storage when created from the Amazon CodeCatalyst console, but there is no default when programmatically creating a Dev Environment. Valid values for persistent storage are based on memory sizes in 16GB increments. Valid values are 16, 32, and 64. 
     */
    persistentStorage: PersistentStorageConfiguration;
  }
  export type CreateDevEnvironmentRequestAliasString = string;
  export interface CreateDevEnvironmentResponse {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment. 
     */
    id: Uuid;
  }
  export interface CreateProjectRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The friendly name of the project that will be displayed to users.
     */
    displayName: ProjectDisplayName;
    /**
     * The description of the project. This description will be displayed to all users of the project. We recommend providing a brief description of the project and its intended purpose.
     */
    description?: ProjectDescription;
  }
  export interface CreateProjectResponse {
    /**
     * The name of the space.
     */
    spaceName?: NameString;
    /**
     * The name of the project in the space.
     */
    name: NameString;
    /**
     * The friendly name of the project.
     */
    displayName?: String;
    /**
     * The description of the project.
     */
    description?: String;
  }
  export interface CreateSourceRepositoryBranchRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The name of the repository where you want to create a branch.
     */
    sourceRepositoryName: SourceRepositoryNameString;
    /**
     * The name for the branch you're creating.
     */
    name: SourceRepositoryBranchString;
    /**
     * The commit ID in an existing branch from which you want to create the new branch.
     */
    headCommitId?: String;
  }
  export interface CreateSourceRepositoryBranchResponse {
    /**
     * The Git reference name of the branch.
     */
    ref?: SourceRepositoryBranchRefString;
    /**
     * The name of the newly created branch.
     */
    name?: SourceRepositoryBranchString;
    /**
     * The time the branch was last updated, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    lastUpdatedTime?: SyntheticTimestamp_date_time;
    /**
     * The commit ID of the tip of the newly created branch.
     */
    headCommitId?: String;
  }
  export interface CreateSourceRepositoryRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The name of the source repository. For more information about name requirements, see Quotas for source repositories.
     */
    name: SourceRepositoryNameString;
    /**
     * The description of the source repository.
     */
    description?: SourceRepositoryDescriptionString;
  }
  export interface CreateSourceRepositoryResponse {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The name of the source repository.
     */
    name: SourceRepositoryNameString;
    /**
     * The description of the source repository.
     */
    description?: SourceRepositoryDescriptionString;
  }
  export interface DeleteAccessTokenRequest {
    /**
     * The ID of the personal access token to delete. You can find the IDs of all PATs associated with your Amazon Web Services Builder ID in a space by calling ListAccessTokens.
     */
    id: AccessTokenId;
  }
  export interface DeleteAccessTokenResponse {
  }
  export interface DeleteDevEnvironmentRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment you want to delete. To retrieve a list of Dev Environment IDs, use ListDevEnvironments.
     */
    id: Uuid;
  }
  export interface DeleteDevEnvironmentResponse {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the deleted Dev Environment. 
     */
    id: Uuid;
  }
  export interface DeleteProjectRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space. To retrieve a list of project names, use ListProjects.
     */
    name: NameString;
  }
  export interface DeleteProjectResponse {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    name: NameString;
    /**
     * The friendly name displayed to users of the project in Amazon CodeCatalyst.
     */
    displayName?: String;
  }
  export interface DeleteSourceRepositoryRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The name of the source repository.
     */
    name: SourceRepositoryNameString;
  }
  export interface DeleteSourceRepositoryResponse {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The name of the repository.
     */
    name: SourceRepositoryNameString;
  }
  export interface DeleteSpaceRequest {
    /**
     * The name of the space. To retrieve a list of space names, use ListSpaces.
     */
    name: NameString;
  }
  export interface DeleteSpaceResponse {
    /**
     * The name of the space.
     */
    name: NameString;
    /**
     * The friendly name of the space displayed to users of the space in Amazon CodeCatalyst.
     */
    displayName?: String;
  }
  export interface DevEnvironmentAccessDetails {
    /**
     * The URL used to send commands to and from the Dev Environment.
     */
    streamUrl: SensitiveString;
    /**
     * An encrypted token value that contains session and caller information used to authenticate the connection.
     */
    tokenValue: SensitiveString;
  }
  export type DevEnvironmentRepositorySummaries = DevEnvironmentRepositorySummary[];
  export interface DevEnvironmentRepositorySummary {
    /**
     * The name of the source repository.
     */
    repositoryName: SourceRepositoryNameString;
    /**
     * The name of the branch in a source repository cloned into the Dev Environment. 
     */
    branchName?: SourceRepositoryBranchString;
  }
  export interface DevEnvironmentSessionConfiguration {
    /**
     * The type of the session.
     */
    sessionType: DevEnvironmentSessionType;
    /**
     * Information about optional commands that will be run on the Dev Environment when the SSH session begins.
     */
    executeCommandSessionConfiguration?: ExecuteCommandSessionConfiguration;
  }
  export interface DevEnvironmentSessionSummary {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment.
     */
    devEnvironmentId: Uuid;
    /**
     * The date and time the session started, in coordinated universal time (UTC) timestamp format as specified in RFC 3339 
     */
    startedTime: SyntheticTimestamp_date_time;
    /**
     * The system-generated unique ID of the Dev Environment session.
     */
    id: DevEnvironmentSessionSummaryIdString;
  }
  export type DevEnvironmentSessionSummaryIdString = string;
  export type DevEnvironmentSessionType = "SSM"|"SSH"|string;
  export type DevEnvironmentSessionsSummaryList = DevEnvironmentSessionSummary[];
  export type DevEnvironmentStatus = "PENDING"|"RUNNING"|"STARTING"|"STOPPING"|"STOPPED"|"FAILED"|"DELETING"|"DELETED"|string;
  export interface DevEnvironmentSummary {
    /**
     * The name of the space.
     */
    spaceName?: NameString;
    /**
     * The name of the project in the space.
     */
    projectName?: NameString;
    /**
     * The system-generated unique ID for the Dev Environment. 
     */
    id: Uuid;
    /**
     * The time when the Dev Environment was last updated, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    lastUpdatedTime: SyntheticTimestamp_date_time;
    /**
     * The system-generated unique ID of the user who created the Dev Environment. 
     */
    creatorId: DevEnvironmentSummaryCreatorIdString;
    /**
     * The status of the Dev Environment. 
     */
    status: DevEnvironmentStatus;
    /**
     * The reason for the status.
     */
    statusReason?: StatusReason;
    /**
     * Information about the repositories that will be cloned into the Dev Environment. If no rvalue is specified, no repository is cloned.
     */
    repositories: DevEnvironmentRepositorySummaries;
    /**
     * The user-specified alias for the Dev Environment.
     */
    alias?: DevEnvironmentSummaryAliasString;
    /**
     * Information about the integrated development environment (IDE) configured for a Dev Environment.
     */
    ides?: Ides;
    /**
     * The Amazon EC2 instace type used for the Dev Environment. 
     */
    instanceType: InstanceType;
    /**
     * The amount of time the Dev Environment will run without any activity detected before stopping, in minutes. Dev Environments consume compute minutes when running.
     */
    inactivityTimeoutMinutes: InactivityTimeoutMinutes;
    /**
     * Information about the configuration of persistent storage for the Dev Environment.
     */
    persistentStorage: PersistentStorage;
  }
  export type DevEnvironmentSummaryAliasString = string;
  export type DevEnvironmentSummaryCreatorIdString = string;
  export type DevEnvironmentSummaryList = DevEnvironmentSummary[];
  export interface EmailAddress {
    /**
     * The email address.
     */
    email?: String;
    /**
     * Whether the email address has been verified.
     */
    verified?: Boolean;
  }
  export type EventLogEntries = EventLogEntry[];
  export interface EventLogEntry {
    /**
     * The system-generated unique ID of the event.
     */
    id: String;
    /**
     * The name of the event.
     */
    eventName: String;
    /**
     * The type of the event.
     */
    eventType: String;
    /**
     * The category for the event.
     */
    eventCategory: String;
    /**
     * The source of the event.
     */
    eventSource: String;
    /**
     * The time the event took place, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    eventTime: SyntheticTimestamp_date_time;
    /**
     * The type of the event.
     */
    operationType: OperationType;
    /**
     * The system-generated unique ID of the user whose actions are recorded in the event.
     */
    userIdentity: UserIdentity;
    /**
     * Information about the project where the event occurred.
     */
    projectInformation?: ProjectInformation;
    /**
     * The system-generated unique ID of the request.
     */
    requestId?: String;
    /**
     * Information about the payload of the request.
     */
    requestPayload?: EventPayload;
    /**
     * Information about the payload of the response, if any.
     */
    responsePayload?: EventPayload;
    /**
     * The code of the error, if any.
     */
    errorCode?: String;
    /**
     * The IP address of the user whose actions are recorded in the event.
     */
    sourceIpAddress?: String;
    /**
     * The user agent whose actions are recorded in the event.
     */
    userAgent?: String;
  }
  export interface EventPayload {
    /**
     * The type of content in the event payload.
     */
    contentType?: String;
    /**
     * The data included in the event payload.
     */
    data?: String;
  }
  export interface ExecuteCommandSessionConfiguration {
    /**
     * The command used at the beginning of the SSH session to a Dev Environment.
     */
    command: ExecuteCommandSessionConfigurationCommandString;
    /**
     * An array of arguments containing arguments and members.
     */
    arguments?: ExecuteCommandSessionConfigurationArguments;
  }
  export type ExecuteCommandSessionConfigurationArguments = ExecuteCommandSessionConfigurationArgumentsMemberString[];
  export type ExecuteCommandSessionConfigurationArgumentsMemberString = string;
  export type ExecuteCommandSessionConfigurationCommandString = string;
  export interface Filter {
    /**
     * A key that can be used to sort results.
     */
    key: String;
    /**
     * The values of the key.
     */
    values: StringList;
    /**
     * The operator used to compare the fields.
     */
    comparisonOperator?: String;
  }
  export type FilterKey = "hasAccessTo"|string;
  export type Filters = Filter[];
  export interface GetDevEnvironmentRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment for which you want to view information. To retrieve a list of Dev Environment IDs, use ListDevEnvironments.
     */
    id: Uuid;
  }
  export interface GetDevEnvironmentResponse {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment. 
     */
    id: Uuid;
    /**
     * The time when the Dev Environment was last updated, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    lastUpdatedTime: SyntheticTimestamp_date_time;
    /**
     * The system-generated unique ID of the user who created the Dev Environment. 
     */
    creatorId: GetDevEnvironmentResponseCreatorIdString;
    /**
     * The current status of the Dev Environment.
     */
    status: DevEnvironmentStatus;
    /**
     * The reason for the status.
     */
    statusReason?: StatusReason;
    /**
     * The source repository that contains the branch cloned into the Dev Environment. 
     */
    repositories: DevEnvironmentRepositorySummaries;
    /**
     * The user-specified alias for the Dev Environment. 
     */
    alias?: GetDevEnvironmentResponseAliasString;
    /**
     * Information about the integrated development environment (IDE) configured for the Dev Environment. 
     */
    ides?: Ides;
    /**
     * The Amazon EC2 instace type to use for the Dev Environment. 
     */
    instanceType: InstanceType;
    /**
     * The amount of time the Dev Environment will run without any activity detected before stopping, in minutes.
     */
    inactivityTimeoutMinutes: InactivityTimeoutMinutes;
    /**
     * Information about the amount of storage allocated to the Dev Environment. By default, a Dev Environment is configured to have 16GB of persistent storage.
     */
    persistentStorage: PersistentStorage;
  }
  export type GetDevEnvironmentResponseAliasString = string;
  export type GetDevEnvironmentResponseCreatorIdString = string;
  export interface GetProjectRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    name: NameString;
  }
  export interface GetProjectResponse {
    /**
     * The name of the space.
     */
    spaceName?: NameString;
    /**
     * The name of the project in the space.
     */
    name: String;
    /**
     * The friendly name of the project displayed to users in Amazon CodeCatalyst.
     */
    displayName?: String;
    /**
     * The description of the project.
     */
    description?: String;
  }
  export interface GetSourceRepositoryCloneUrlsRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The name of the source repository.
     */
    sourceRepositoryName: SourceRepositoryNameString;
  }
  export interface GetSourceRepositoryCloneUrlsResponse {
    /**
     * The HTTPS URL to use when cloning the source repository.
     */
    https: String;
  }
  export interface GetSourceRepositoryRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The name of the source repository.
     */
    name: SourceRepositoryNameString;
  }
  export interface GetSourceRepositoryResponse {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The name of the source repository.
     */
    name: SourceRepositoryNameString;
    /**
     * The description of the source repository.
     */
    description?: SourceRepositoryDescriptionString;
    /**
     * The time the source repository was last updated, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    lastUpdatedTime: Timestamp;
    /**
     * The time the source repository was created, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    createdTime: Timestamp;
  }
  export interface GetSpaceRequest {
    /**
     * The name of the space.
     */
    name: NameString;
  }
  export interface GetSpaceResponse {
    /**
     * The name of the space.
     */
    name: NameString;
    /**
     * The Amazon Web Services Region where the space exists.
     */
    regionName: RegionString;
    /**
     * The friendly name of the space displayed to users.
     */
    displayName?: String;
    /**
     * The description of the space.
     */
    description?: String;
  }
  export interface GetSubscriptionRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
  }
  export interface GetSubscriptionResponse {
    /**
     * The type of the billing plan for the space.
     */
    subscriptionType?: String;
    /**
     * The display name of the Amazon Web Services account used for billing for the space.
     */
    awsAccountName?: NameString;
  }
  export interface GetUserDetailsRequest {
    /**
     * The system-generated unique ID of the user. 
     */
    id?: GetUserDetailsRequestIdString;
    /**
     * The name of the user as displayed in Amazon CodeCatalyst.
     */
    userName?: GetUserDetailsRequestUserNameString;
  }
  export type GetUserDetailsRequestIdString = string;
  export type GetUserDetailsRequestUserNameString = string;
  export interface GetUserDetailsResponse {
    /**
     * The system-generated unique ID of the user.
     */
    userId?: String;
    /**
     * The name of the user as displayed in Amazon CodeCatalyst.
     */
    userName?: String;
    /**
     * The friendly name displayed for the user in Amazon CodeCatalyst.
     */
    displayName?: String;
    /**
     * The email address provided by the user when they signed up.
     */
    primaryEmail?: EmailAddress;
    /**
     * 
     */
    version?: String;
  }
  export interface Ide {
    /**
     * A link to the IDE runtime image.
     */
    runtime?: IdeRuntimeString;
    /**
     * The name of the IDE.
     */
    name?: IdeNameString;
  }
  export interface IdeConfiguration {
    /**
     * A link to the IDE runtime image.   This parameter is not required for VSCode. 
     */
    runtime?: IdeConfigurationRuntimeString;
    /**
     * The name of the IDE. Valid values include Cloud9, IntelliJ, PyCharm, GoLand, and VSCode.
     */
    name?: IdeConfigurationNameString;
  }
  export type IdeConfigurationList = IdeConfiguration[];
  export type IdeConfigurationNameString = string;
  export type IdeConfigurationRuntimeString = string;
  export type IdeNameString = string;
  export type IdeRuntimeString = string;
  export type Ides = Ide[];
  export type InactivityTimeoutMinutes = number;
  export type InstanceType = "dev.standard1.small"|"dev.standard1.medium"|"dev.standard1.large"|"dev.standard1.xlarge"|string;
  export interface ListAccessTokensRequest {
    /**
     * The maximum number of results to show in a single call to this API. If the number of results is larger than the number you specified, the response will include a NextToken element, which you can use to obtain additional results.
     */
    maxResults?: ListAccessTokensRequestMaxResultsInteger;
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: ListAccessTokensRequestNextTokenString;
  }
  export type ListAccessTokensRequestMaxResultsInteger = number;
  export type ListAccessTokensRequestNextTokenString = string;
  export interface ListAccessTokensResponse {
    /**
     * A list of personal access tokens (PATs) associated with the calling user identity.
     */
    items: AccessTokenSummaries;
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: String;
  }
  export interface ListDevEnvironmentSessionsRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment.
     */
    devEnvironmentId: Uuid;
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: ListDevEnvironmentSessionsRequestNextTokenString;
    /**
     * The maximum number of results to show in a single call to this API. If the number of results is larger than the number you specified, the response will include a NextToken element, which you can use to obtain additional results.
     */
    maxResults?: ListDevEnvironmentSessionsRequestMaxResultsInteger;
  }
  export type ListDevEnvironmentSessionsRequestMaxResultsInteger = number;
  export type ListDevEnvironmentSessionsRequestNextTokenString = string;
  export interface ListDevEnvironmentSessionsResponse {
    /**
     * Information about each session retrieved in the list.
     */
    items: DevEnvironmentSessionsSummaryList;
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: String;
  }
  export interface ListDevEnvironmentsRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * Information about filters to apply to narrow the results returned in the list.
     */
    filters?: Filters;
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: ListDevEnvironmentsRequestNextTokenString;
    /**
     * The maximum number of results to show in a single call to this API. If the number of results is larger than the number you specified, the response will include a NextToken element, which you can use to obtain additional results.
     */
    maxResults?: ListDevEnvironmentsRequestMaxResultsInteger;
  }
  export type ListDevEnvironmentsRequestMaxResultsInteger = number;
  export type ListDevEnvironmentsRequestNextTokenString = string;
  export interface ListDevEnvironmentsResponse {
    /**
     * Information about the Dev Environments in a project.
     */
    items: DevEnvironmentSummaryList;
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: String;
  }
  export interface ListEventLogsRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The date and time when you want to start retrieving events, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    startTime: SyntheticTimestamp_date_time;
    /**
     * The time after which you do not want any events retrieved, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    endTime: SyntheticTimestamp_date_time;
    /**
     * The name of the event.
     */
    eventName?: String;
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: ListEventLogsRequestNextTokenString;
    /**
     * The maximum number of results to show in a single call to this API. If the number of results is larger than the number you specified, the response will include a NextToken element, which you can use to obtain additional results.
     */
    maxResults?: ListEventLogsRequestMaxResultsInteger;
  }
  export type ListEventLogsRequestMaxResultsInteger = number;
  export type ListEventLogsRequestNextTokenString = string;
  export interface ListEventLogsResponse {
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: String;
    /**
     * Information about each event retrieved in the list.
     */
    items: EventLogEntries;
  }
  export interface ListProjectsRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: ListProjectsRequestNextTokenString;
    /**
     * The maximum number of results to show in a single call to this API. If the number of results is larger than the number you specified, the response will include a NextToken element, which you can use to obtain additional results.
     */
    maxResults?: ListProjectsRequestMaxResultsInteger;
    /**
     * Information about filters to apply to narrow the results returned in the list.
     */
    filters?: ProjectListFilters;
  }
  export type ListProjectsRequestMaxResultsInteger = number;
  export type ListProjectsRequestNextTokenString = string;
  export interface ListProjectsResponse {
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: String;
    /**
     * Information about the projects.
     */
    items?: ProjectSummaries;
  }
  export interface ListSourceRepositoriesItem {
    /**
     * The system-generated unique ID of the source repository.
     */
    id: SourceRepositoryIdString;
    /**
     * The name of the source repository.
     */
    name: SourceRepositoryNameString;
    /**
     * The description of the repository, if any.
     */
    description?: SourceRepositoryDescriptionString;
    /**
     * The time the source repository was last updated, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    lastUpdatedTime: Timestamp;
    /**
     * The time the source repository was created, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    createdTime: Timestamp;
  }
  export type ListSourceRepositoriesItems = ListSourceRepositoriesItem[];
  export interface ListSourceRepositoriesRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: ListSourceRepositoriesRequestNextTokenString;
    /**
     * The maximum number of results to show in a single call to this API. If the number of results is larger than the number you specified, the response will include a NextToken element, which you can use to obtain additional results.
     */
    maxResults?: ListSourceRepositoriesRequestMaxResultsInteger;
  }
  export type ListSourceRepositoriesRequestMaxResultsInteger = number;
  export type ListSourceRepositoriesRequestNextTokenString = string;
  export interface ListSourceRepositoriesResponse {
    /**
     * Information about the source repositories.
     */
    items?: ListSourceRepositoriesItems;
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: String;
  }
  export interface ListSourceRepositoryBranchesItem {
    /**
     * The Git reference name of the branch.
     */
    ref?: SourceRepositoryBranchRefString;
    /**
     * The name of the branch.
     */
    name?: SourceRepositoryBranchString;
    /**
     * The time the branch was last updated, in coordinated universal time (UTC) timestamp format as specified in RFC 3339.
     */
    lastUpdatedTime?: SyntheticTimestamp_date_time;
    /**
     * The commit ID of the tip of the branch at the time of the request, also known as the head commit.
     */
    headCommitId?: String;
  }
  export type ListSourceRepositoryBranchesItems = ListSourceRepositoryBranchesItem[];
  export interface ListSourceRepositoryBranchesRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The name of the source repository.
     */
    sourceRepositoryName: SourceRepositoryNameString;
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: ListSourceRepositoryBranchesRequestNextTokenString;
    /**
     * The maximum number of results to show in a single call to this API. If the number of results is larger than the number you specified, the response will include a NextToken element, which you can use to obtain additional results.
     */
    maxResults?: ListSourceRepositoryBranchesRequestMaxResultsInteger;
  }
  export type ListSourceRepositoryBranchesRequestMaxResultsInteger = number;
  export type ListSourceRepositoryBranchesRequestNextTokenString = string;
  export interface ListSourceRepositoryBranchesResponse {
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: String;
    /**
     * Information about the source branches.
     */
    items: ListSourceRepositoryBranchesItems;
  }
  export interface ListSpacesRequest {
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: ListSpacesRequestNextTokenString;
  }
  export type ListSpacesRequestNextTokenString = string;
  export interface ListSpacesResponse {
    /**
     * A token returned from a call to this API to indicate the next batch of results to return, if any.
     */
    nextToken?: String;
    /**
     * Information about the spaces. 
     */
    items?: SpaceSummaries;
  }
  export type NameString = string;
  export type OperationType = "READONLY"|"MUTATION"|string;
  export interface PersistentStorage {
    /**
     * The size of the persistent storage in gigabytes (specifically GiB).  Valid values for storage are based on memory sizes in 16GB increments. Valid values are 16, 32, and 64. 
     */
    sizeInGiB: PersistentStorageSizeInGiBInteger;
  }
  export interface PersistentStorageConfiguration {
    /**
     * The size of the persistent storage in gigabytes (specifically GiB).  Valid values for storage are based on memory sizes in 16GB increments. Valid values are 16, 32, and 64. 
     */
    sizeInGiB: PersistentStorageConfigurationSizeInGiBInteger;
  }
  export type PersistentStorageConfigurationSizeInGiBInteger = number;
  export type PersistentStorageSizeInGiBInteger = number;
  export type ProjectDescription = string;
  export type ProjectDisplayName = string;
  export interface ProjectInformation {
    /**
     * The name of the project in the space.
     */
    name?: String;
    /**
     * The system-generated unique ID of the project.
     */
    projectId?: String;
  }
  export interface ProjectListFilter {
    /**
     * A key that can be used to sort results.
     */
    key: FilterKey;
    /**
     * The values of the key.
     */
    values: StringList;
    /**
     * The operator used to compare the fields.
     */
    comparisonOperator?: ComparisonOperator;
  }
  export type ProjectListFilters = ProjectListFilter[];
  export type ProjectSummaries = ProjectSummary[];
  export interface ProjectSummary {
    /**
     * The name of the project in the space.
     */
    name: String;
    /**
     * The friendly name displayed to users of the project in Amazon CodeCatalyst.
     */
    displayName?: String;
    /**
     * The description of the project.
     */
    description?: String;
  }
  export type RegionString = string;
  export type RepositoriesInput = RepositoryInput[];
  export interface RepositoryInput {
    /**
     * The name of the source repository.
     */
    repositoryName: SourceRepositoryNameString;
    /**
     * The name of the branch in a source repository.
     */
    branchName?: SourceRepositoryBranchString;
  }
  export type SensitiveString = string;
  export type SourceRepositoryBranchRefString = string;
  export type SourceRepositoryBranchString = string;
  export type SourceRepositoryDescriptionString = string;
  export type SourceRepositoryIdString = string;
  export type SourceRepositoryNameString = string;
  export type SpaceDescription = string;
  export type SpaceSummaries = SpaceSummary[];
  export interface SpaceSummary {
    /**
     * The name of the space.
     */
    name: NameString;
    /**
     * The Amazon Web Services Region where the space exists.
     */
    regionName: RegionString;
    /**
     * The friendly name of the space displayed to users.
     */
    displayName?: String;
    /**
     * The description of the space.
     */
    description?: String;
  }
  export interface StartDevEnvironmentRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment. 
     */
    id: Uuid;
    /**
     * Information about the integrated development environment (IDE) configured for a Dev Environment. 
     */
    ides?: IdeConfigurationList;
    /**
     * The Amazon EC2 instace type to use for the Dev Environment. 
     */
    instanceType?: InstanceType;
    /**
     * The amount of time the Dev Environment will run without any activity detected before stopping, in minutes. Only whole integers are allowed. Dev Environments consume compute minutes when running.
     */
    inactivityTimeoutMinutes?: InactivityTimeoutMinutes;
  }
  export interface StartDevEnvironmentResponse {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment. 
     */
    id: Uuid;
    /**
     * The status of the Dev Environment. 
     */
    status: DevEnvironmentStatus;
  }
  export interface StartDevEnvironmentSessionRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment.
     */
    id: Uuid;
    sessionConfiguration: DevEnvironmentSessionConfiguration;
  }
  export interface StartDevEnvironmentSessionResponse {
    accessDetails: DevEnvironmentAccessDetails;
    /**
     * The system-generated unique ID of the Dev Environment session.
     */
    sessionId?: StartDevEnvironmentSessionResponseSessionIdString;
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment.
     */
    id: Uuid;
  }
  export type StartDevEnvironmentSessionResponseSessionIdString = string;
  export type StatusReason = string;
  export interface StopDevEnvironmentRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment. 
     */
    id: Uuid;
  }
  export interface StopDevEnvironmentResponse {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment. 
     */
    id: Uuid;
    /**
     * The status of the Dev Environment. 
     */
    status: DevEnvironmentStatus;
  }
  export interface StopDevEnvironmentSessionRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment. To obtain this ID, use ListDevEnvironments.
     */
    id: Uuid;
    /**
     * The system-generated unique ID of the Dev Environment session. This ID is returned by StartDevEnvironmentSession.
     */
    sessionId: StopDevEnvironmentSessionRequestSessionIdString;
  }
  export type StopDevEnvironmentSessionRequestSessionIdString = string;
  export interface StopDevEnvironmentSessionResponse {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment.
     */
    id: Uuid;
    /**
     * The system-generated unique ID of the Dev Environment session.
     */
    sessionId: StopDevEnvironmentSessionResponseSessionIdString;
  }
  export type StopDevEnvironmentSessionResponseSessionIdString = string;
  export type String = string;
  export type StringList = String[];
  export type SyntheticTimestamp_date_time = Date;
  export type Timestamp = Date;
  export interface UpdateDevEnvironmentRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The system-generated unique ID of the Dev Environment. 
     */
    id: Uuid;
    /**
     * The user-specified alias for the Dev Environment. Changing this value will not cause a restart.
     */
    alias?: UpdateDevEnvironmentRequestAliasString;
    /**
     * Information about the integrated development environment (IDE) configured for a Dev Environment.
     */
    ides?: IdeConfigurationList;
    /**
     * The Amazon EC2 instace type to use for the Dev Environment.   Changing this value will cause a restart of the Dev Environment if it is running. 
     */
    instanceType?: InstanceType;
    /**
     * The amount of time the Dev Environment will run without any activity detected before stopping, in minutes. Only whole integers are allowed. Dev Environments consume compute minutes when running.  Changing this value will cause a restart of the Dev Environment if it is running. 
     */
    inactivityTimeoutMinutes?: InactivityTimeoutMinutes;
    /**
     * A user-specified idempotency token. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, the subsequent retries return the result from the original successful request and have no additional effect.
     */
    clientToken?: ClientToken;
  }
  export type UpdateDevEnvironmentRequestAliasString = string;
  export interface UpdateDevEnvironmentResponse {
    /**
     * The system-generated unique ID of the Dev Environment. 
     */
    id: Uuid;
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project in the space.
     */
    projectName: NameString;
    /**
     * The user-specified alias for the Dev Environment.
     */
    alias?: UpdateDevEnvironmentResponseAliasString;
    /**
     * Information about the integrated development environment (IDE) configured for the Dev Environment.
     */
    ides?: IdeConfigurationList;
    /**
     * The Amazon EC2 instace type to use for the Dev Environment. 
     */
    instanceType?: InstanceType;
    /**
     * The amount of time the Dev Environment will run without any activity detected before stopping, in minutes. 
     */
    inactivityTimeoutMinutes?: InactivityTimeoutMinutes;
    /**
     * A user-specified idempotency token. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, the subsequent retries return the result from the original successful request and have no additional effect.
     */
    clientToken?: ClientToken;
  }
  export type UpdateDevEnvironmentResponseAliasString = string;
  export interface UpdateProjectRequest {
    /**
     * The name of the space.
     */
    spaceName: NameString;
    /**
     * The name of the project.
     */
    name: NameString;
    /**
     * The description of the project.
     */
    description?: ProjectDescription;
  }
  export interface UpdateProjectResponse {
    /**
     * The name of the space.
     */
    spaceName?: NameString;
    /**
     * The name of the project.
     */
    name?: NameString;
    /**
     * The friendly name of the project displayed to users in Amazon CodeCatalyst.
     */
    displayName?: String;
    /**
     * The description of the project.
     */
    description?: String;
  }
  export interface UpdateSpaceRequest {
    /**
     * The name of the space.
     */
    name: NameString;
    /**
     * The description of the space.
     */
    description?: SpaceDescription;
  }
  export interface UpdateSpaceResponse {
    /**
     * The name of the space.
     */
    name?: NameString;
    /**
     * The friendly name of the space displayed to users in Amazon CodeCatalyst.
     */
    displayName?: String;
    /**
     * The description of the space.
     */
    description?: String;
  }
  export interface UserIdentity {
    /**
     * The role assigned to the user in a Amazon CodeCatalyst space or project when the event occurred.
     */
    userType: UserType;
    /**
     * The ID of the Amazon CodeCatalyst service principal.
     */
    principalId: String;
    /**
     * The display name of the user in Amazon CodeCatalyst.
     */
    userName?: String;
    /**
     * The Amazon Web Services account number of the user in Amazon Web Services, if any.
     */
    awsAccountId?: String;
  }
  export type UserType = "USER"|"AWS_ACCOUNT"|"UNKNOWN"|string;
  export type Uuid = string;
  export interface VerifySessionResponse {
    /**
     * The system-generated unique ID of the user in Amazon CodeCatalyst.
     */
    identity?: VerifySessionResponseIdentityString;
  }
  export type VerifySessionResponseIdentityString = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-09-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CodeCatalyst client.
   */
  export import Types = CodeCatalyst;
}
export = CodeCatalyst;
