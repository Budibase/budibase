import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class GameSparks extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: GameSparks.Types.ClientConfiguration)
  config: Config & GameSparks.Types.ClientConfiguration;
  /**
   *  Creates a new game with an empty configuration. After creating your game, you can update the configuration using UpdateGameConfiguration or ImportGameConfiguration. 
   */
  createGame(params: GameSparks.Types.CreateGameRequest, callback?: (err: AWSError, data: GameSparks.Types.CreateGameResult) => void): Request<GameSparks.Types.CreateGameResult, AWSError>;
  /**
   *  Creates a new game with an empty configuration. After creating your game, you can update the configuration using UpdateGameConfiguration or ImportGameConfiguration. 
   */
  createGame(callback?: (err: AWSError, data: GameSparks.Types.CreateGameResult) => void): Request<GameSparks.Types.CreateGameResult, AWSError>;
  /**
   * Creates a snapshot of the game configuration.
   */
  createSnapshot(params: GameSparks.Types.CreateSnapshotRequest, callback?: (err: AWSError, data: GameSparks.Types.CreateSnapshotResult) => void): Request<GameSparks.Types.CreateSnapshotResult, AWSError>;
  /**
   * Creates a snapshot of the game configuration.
   */
  createSnapshot(callback?: (err: AWSError, data: GameSparks.Types.CreateSnapshotResult) => void): Request<GameSparks.Types.CreateSnapshotResult, AWSError>;
  /**
   * Creates a new stage for stage-by-stage game development and deployment.
   */
  createStage(params: GameSparks.Types.CreateStageRequest, callback?: (err: AWSError, data: GameSparks.Types.CreateStageResult) => void): Request<GameSparks.Types.CreateStageResult, AWSError>;
  /**
   * Creates a new stage for stage-by-stage game development and deployment.
   */
  createStage(callback?: (err: AWSError, data: GameSparks.Types.CreateStageResult) => void): Request<GameSparks.Types.CreateStageResult, AWSError>;
  /**
   * Deletes a game.
   */
  deleteGame(params: GameSparks.Types.DeleteGameRequest, callback?: (err: AWSError, data: GameSparks.Types.DeleteGameResult) => void): Request<GameSparks.Types.DeleteGameResult, AWSError>;
  /**
   * Deletes a game.
   */
  deleteGame(callback?: (err: AWSError, data: GameSparks.Types.DeleteGameResult) => void): Request<GameSparks.Types.DeleteGameResult, AWSError>;
  /**
   * Deletes a stage from a game, along with the associated game runtime.
   */
  deleteStage(params: GameSparks.Types.DeleteStageRequest, callback?: (err: AWSError, data: GameSparks.Types.DeleteStageResult) => void): Request<GameSparks.Types.DeleteStageResult, AWSError>;
  /**
   * Deletes a stage from a game, along with the associated game runtime.
   */
  deleteStage(callback?: (err: AWSError, data: GameSparks.Types.DeleteStageResult) => void): Request<GameSparks.Types.DeleteStageResult, AWSError>;
  /**
   * Disconnects a player from the game runtime.  If a player has multiple connections, this operation attempts to close all of them. 
   */
  disconnectPlayer(params: GameSparks.Types.DisconnectPlayerRequest, callback?: (err: AWSError, data: GameSparks.Types.DisconnectPlayerResult) => void): Request<GameSparks.Types.DisconnectPlayerResult, AWSError>;
  /**
   * Disconnects a player from the game runtime.  If a player has multiple connections, this operation attempts to close all of them. 
   */
  disconnectPlayer(callback?: (err: AWSError, data: GameSparks.Types.DisconnectPlayerResult) => void): Request<GameSparks.Types.DisconnectPlayerResult, AWSError>;
  /**
   * Exports a game configuration snapshot.
   */
  exportSnapshot(params: GameSparks.Types.ExportSnapshotRequest, callback?: (err: AWSError, data: GameSparks.Types.ExportSnapshotResult) => void): Request<GameSparks.Types.ExportSnapshotResult, AWSError>;
  /**
   * Exports a game configuration snapshot.
   */
  exportSnapshot(callback?: (err: AWSError, data: GameSparks.Types.ExportSnapshotResult) => void): Request<GameSparks.Types.ExportSnapshotResult, AWSError>;
  /**
   * Gets details about a specified extension.
   */
  getExtension(params: GameSparks.Types.GetExtensionRequest, callback?: (err: AWSError, data: GameSparks.Types.GetExtensionResult) => void): Request<GameSparks.Types.GetExtensionResult, AWSError>;
  /**
   * Gets details about a specified extension.
   */
  getExtension(callback?: (err: AWSError, data: GameSparks.Types.GetExtensionResult) => void): Request<GameSparks.Types.GetExtensionResult, AWSError>;
  /**
   * Gets details about a specified extension version.
   */
  getExtensionVersion(params: GameSparks.Types.GetExtensionVersionRequest, callback?: (err: AWSError, data: GameSparks.Types.GetExtensionVersionResult) => void): Request<GameSparks.Types.GetExtensionVersionResult, AWSError>;
  /**
   * Gets details about a specified extension version.
   */
  getExtensionVersion(callback?: (err: AWSError, data: GameSparks.Types.GetExtensionVersionResult) => void): Request<GameSparks.Types.GetExtensionVersionResult, AWSError>;
  /**
   * Gets details about a game.
   */
  getGame(params: GameSparks.Types.GetGameRequest, callback?: (err: AWSError, data: GameSparks.Types.GetGameResult) => void): Request<GameSparks.Types.GetGameResult, AWSError>;
  /**
   * Gets details about a game.
   */
  getGame(callback?: (err: AWSError, data: GameSparks.Types.GetGameResult) => void): Request<GameSparks.Types.GetGameResult, AWSError>;
  /**
   * Gets the configuration of the game.
   */
  getGameConfiguration(params: GameSparks.Types.GetGameConfigurationRequest, callback?: (err: AWSError, data: GameSparks.Types.GetGameConfigurationResult) => void): Request<GameSparks.Types.GetGameConfigurationResult, AWSError>;
  /**
   * Gets the configuration of the game.
   */
  getGameConfiguration(callback?: (err: AWSError, data: GameSparks.Types.GetGameConfigurationResult) => void): Request<GameSparks.Types.GetGameConfigurationResult, AWSError>;
  /**
   * Gets details about a job that is generating code for a snapshot.
   */
  getGeneratedCodeJob(params: GameSparks.Types.GetGeneratedCodeJobRequest, callback?: (err: AWSError, data: GameSparks.Types.GetGeneratedCodeJobResult) => void): Request<GameSparks.Types.GetGeneratedCodeJobResult, AWSError>;
  /**
   * Gets details about a job that is generating code for a snapshot.
   */
  getGeneratedCodeJob(callback?: (err: AWSError, data: GameSparks.Types.GetGeneratedCodeJobResult) => void): Request<GameSparks.Types.GetGeneratedCodeJobResult, AWSError>;
  /**
   * Gets the status of a player's connection to the game runtime.  It's possible for a single player to have multiple connections to the game runtime. If a player is not connected, this operation returns an empty list. 
   */
  getPlayerConnectionStatus(params: GameSparks.Types.GetPlayerConnectionStatusRequest, callback?: (err: AWSError, data: GameSparks.Types.GetPlayerConnectionStatusResult) => void): Request<GameSparks.Types.GetPlayerConnectionStatusResult, AWSError>;
  /**
   * Gets the status of a player's connection to the game runtime.  It's possible for a single player to have multiple connections to the game runtime. If a player is not connected, this operation returns an empty list. 
   */
  getPlayerConnectionStatus(callback?: (err: AWSError, data: GameSparks.Types.GetPlayerConnectionStatusResult) => void): Request<GameSparks.Types.GetPlayerConnectionStatusResult, AWSError>;
  /**
   * Gets a copy of the game configuration in a snapshot.
   */
  getSnapshot(params: GameSparks.Types.GetSnapshotRequest, callback?: (err: AWSError, data: GameSparks.Types.GetSnapshotResult) => void): Request<GameSparks.Types.GetSnapshotResult, AWSError>;
  /**
   * Gets a copy of the game configuration in a snapshot.
   */
  getSnapshot(callback?: (err: AWSError, data: GameSparks.Types.GetSnapshotResult) => void): Request<GameSparks.Types.GetSnapshotResult, AWSError>;
  /**
   * Gets information about a stage.
   */
  getStage(params: GameSparks.Types.GetStageRequest, callback?: (err: AWSError, data: GameSparks.Types.GetStageResult) => void): Request<GameSparks.Types.GetStageResult, AWSError>;
  /**
   * Gets information about a stage.
   */
  getStage(callback?: (err: AWSError, data: GameSparks.Types.GetStageResult) => void): Request<GameSparks.Types.GetStageResult, AWSError>;
  /**
   * Gets information about a stage deployment.
   */
  getStageDeployment(params: GameSparks.Types.GetStageDeploymentRequest, callback?: (err: AWSError, data: GameSparks.Types.GetStageDeploymentResult) => void): Request<GameSparks.Types.GetStageDeploymentResult, AWSError>;
  /**
   * Gets information about a stage deployment.
   */
  getStageDeployment(callback?: (err: AWSError, data: GameSparks.Types.GetStageDeploymentResult) => void): Request<GameSparks.Types.GetStageDeploymentResult, AWSError>;
  /**
   * Imports a game configuration.  This operation replaces the current configuration of the game with the provided input. This is not a reversible operation. If you want to preserve the previous configuration, use CreateSnapshot to make a new snapshot before importing. 
   */
  importGameConfiguration(params: GameSparks.Types.ImportGameConfigurationRequest, callback?: (err: AWSError, data: GameSparks.Types.ImportGameConfigurationResult) => void): Request<GameSparks.Types.ImportGameConfigurationResult, AWSError>;
  /**
   * Imports a game configuration.  This operation replaces the current configuration of the game with the provided input. This is not a reversible operation. If you want to preserve the previous configuration, use CreateSnapshot to make a new snapshot before importing. 
   */
  importGameConfiguration(callback?: (err: AWSError, data: GameSparks.Types.ImportGameConfigurationResult) => void): Request<GameSparks.Types.ImportGameConfigurationResult, AWSError>;
  /**
   * Gets a paginated list of available versions for the extension.  Each time an API change is made to an extension, the version is incremented. The list retrieved by this operation shows the versions that are currently available. 
   */
  listExtensionVersions(params: GameSparks.Types.ListExtensionVersionsRequest, callback?: (err: AWSError, data: GameSparks.Types.ListExtensionVersionsResult) => void): Request<GameSparks.Types.ListExtensionVersionsResult, AWSError>;
  /**
   * Gets a paginated list of available versions for the extension.  Each time an API change is made to an extension, the version is incremented. The list retrieved by this operation shows the versions that are currently available. 
   */
  listExtensionVersions(callback?: (err: AWSError, data: GameSparks.Types.ListExtensionVersionsResult) => void): Request<GameSparks.Types.ListExtensionVersionsResult, AWSError>;
  /**
   * Gets a paginated list of available extensions.  Extensions provide features that games can use from scripts. 
   */
  listExtensions(params: GameSparks.Types.ListExtensionsRequest, callback?: (err: AWSError, data: GameSparks.Types.ListExtensionsResult) => void): Request<GameSparks.Types.ListExtensionsResult, AWSError>;
  /**
   * Gets a paginated list of available extensions.  Extensions provide features that games can use from scripts. 
   */
  listExtensions(callback?: (err: AWSError, data: GameSparks.Types.ListExtensionsResult) => void): Request<GameSparks.Types.ListExtensionsResult, AWSError>;
  /**
   * Gets a paginated list of games.
   */
  listGames(params: GameSparks.Types.ListGamesRequest, callback?: (err: AWSError, data: GameSparks.Types.ListGamesResult) => void): Request<GameSparks.Types.ListGamesResult, AWSError>;
  /**
   * Gets a paginated list of games.
   */
  listGames(callback?: (err: AWSError, data: GameSparks.Types.ListGamesResult) => void): Request<GameSparks.Types.ListGamesResult, AWSError>;
  /**
   * Gets a paginated list of code generation jobs for a snapshot.
   */
  listGeneratedCodeJobs(params: GameSparks.Types.ListGeneratedCodeJobsRequest, callback?: (err: AWSError, data: GameSparks.Types.ListGeneratedCodeJobsResult) => void): Request<GameSparks.Types.ListGeneratedCodeJobsResult, AWSError>;
  /**
   * Gets a paginated list of code generation jobs for a snapshot.
   */
  listGeneratedCodeJobs(callback?: (err: AWSError, data: GameSparks.Types.ListGeneratedCodeJobsResult) => void): Request<GameSparks.Types.ListGeneratedCodeJobsResult, AWSError>;
  /**
   * Gets a paginated list of snapshot summaries from the game.
   */
  listSnapshots(params: GameSparks.Types.ListSnapshotsRequest, callback?: (err: AWSError, data: GameSparks.Types.ListSnapshotsResult) => void): Request<GameSparks.Types.ListSnapshotsResult, AWSError>;
  /**
   * Gets a paginated list of snapshot summaries from the game.
   */
  listSnapshots(callback?: (err: AWSError, data: GameSparks.Types.ListSnapshotsResult) => void): Request<GameSparks.Types.ListSnapshotsResult, AWSError>;
  /**
   * Gets a paginated list of stage deployment summaries from the game.
   */
  listStageDeployments(params: GameSparks.Types.ListStageDeploymentsRequest, callback?: (err: AWSError, data: GameSparks.Types.ListStageDeploymentsResult) => void): Request<GameSparks.Types.ListStageDeploymentsResult, AWSError>;
  /**
   * Gets a paginated list of stage deployment summaries from the game.
   */
  listStageDeployments(callback?: (err: AWSError, data: GameSparks.Types.ListStageDeploymentsResult) => void): Request<GameSparks.Types.ListStageDeploymentsResult, AWSError>;
  /**
   * Gets a paginated list of stage summaries from the game.
   */
  listStages(params: GameSparks.Types.ListStagesRequest, callback?: (err: AWSError, data: GameSparks.Types.ListStagesResult) => void): Request<GameSparks.Types.ListStagesResult, AWSError>;
  /**
   * Gets a paginated list of stage summaries from the game.
   */
  listStages(callback?: (err: AWSError, data: GameSparks.Types.ListStagesResult) => void): Request<GameSparks.Types.ListStagesResult, AWSError>;
  /**
   * Lists the tags associated with a GameSparks resource.
   */
  listTagsForResource(params: GameSparks.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: GameSparks.Types.ListTagsForResourceResult) => void): Request<GameSparks.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Lists the tags associated with a GameSparks resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: GameSparks.Types.ListTagsForResourceResult) => void): Request<GameSparks.Types.ListTagsForResourceResult, AWSError>;
  /**
   *  Starts an asynchronous process that generates client code for system-defined and custom messages. The resulting code is collected as a .zip file and uploaded to a pre-signed Amazon S3 URL. 
   */
  startGeneratedCodeJob(params: GameSparks.Types.StartGeneratedCodeJobRequest, callback?: (err: AWSError, data: GameSparks.Types.StartGeneratedCodeJobResult) => void): Request<GameSparks.Types.StartGeneratedCodeJobResult, AWSError>;
  /**
   *  Starts an asynchronous process that generates client code for system-defined and custom messages. The resulting code is collected as a .zip file and uploaded to a pre-signed Amazon S3 URL. 
   */
  startGeneratedCodeJob(callback?: (err: AWSError, data: GameSparks.Types.StartGeneratedCodeJobResult) => void): Request<GameSparks.Types.StartGeneratedCodeJobResult, AWSError>;
  /**
   * Deploys a snapshot to the stage and creates a new game runtime.  After you call this operation, you can check the deployment status by using GetStageDeployment.   If there are any players connected to the previous game runtime, then both runtimes persist. Existing connections to the previous runtime are maintained. When players disconnect and reconnect, they connect to the new runtime. After there are no connections to the previous game runtime, it is deleted. 
   */
  startStageDeployment(params: GameSparks.Types.StartStageDeploymentRequest, callback?: (err: AWSError, data: GameSparks.Types.StartStageDeploymentResult) => void): Request<GameSparks.Types.StartStageDeploymentResult, AWSError>;
  /**
   * Deploys a snapshot to the stage and creates a new game runtime.  After you call this operation, you can check the deployment status by using GetStageDeployment.   If there are any players connected to the previous game runtime, then both runtimes persist. Existing connections to the previous runtime are maintained. When players disconnect and reconnect, they connect to the new runtime. After there are no connections to the previous game runtime, it is deleted. 
   */
  startStageDeployment(callback?: (err: AWSError, data: GameSparks.Types.StartStageDeploymentResult) => void): Request<GameSparks.Types.StartStageDeploymentResult, AWSError>;
  /**
   * Adds tags to a GameSparks resource.
   */
  tagResource(params: GameSparks.Types.TagResourceRequest, callback?: (err: AWSError, data: GameSparks.Types.TagResourceResult) => void): Request<GameSparks.Types.TagResourceResult, AWSError>;
  /**
   * Adds tags to a GameSparks resource.
   */
  tagResource(callback?: (err: AWSError, data: GameSparks.Types.TagResourceResult) => void): Request<GameSparks.Types.TagResourceResult, AWSError>;
  /**
   * Removes tags from a GameSparks resource.
   */
  untagResource(params: GameSparks.Types.UntagResourceRequest, callback?: (err: AWSError, data: GameSparks.Types.UntagResourceResult) => void): Request<GameSparks.Types.UntagResourceResult, AWSError>;
  /**
   * Removes tags from a GameSparks resource.
   */
  untagResource(callback?: (err: AWSError, data: GameSparks.Types.UntagResourceResult) => void): Request<GameSparks.Types.UntagResourceResult, AWSError>;
  /**
   * Updates details of the game.
   */
  updateGame(params: GameSparks.Types.UpdateGameRequest, callback?: (err: AWSError, data: GameSparks.Types.UpdateGameResult) => void): Request<GameSparks.Types.UpdateGameResult, AWSError>;
  /**
   * Updates details of the game.
   */
  updateGame(callback?: (err: AWSError, data: GameSparks.Types.UpdateGameResult) => void): Request<GameSparks.Types.UpdateGameResult, AWSError>;
  /**
   * Updates one or more sections of the game configuration.
   */
  updateGameConfiguration(params: GameSparks.Types.UpdateGameConfigurationRequest, callback?: (err: AWSError, data: GameSparks.Types.UpdateGameConfigurationResult) => void): Request<GameSparks.Types.UpdateGameConfigurationResult, AWSError>;
  /**
   * Updates one or more sections of the game configuration.
   */
  updateGameConfiguration(callback?: (err: AWSError, data: GameSparks.Types.UpdateGameConfigurationResult) => void): Request<GameSparks.Types.UpdateGameConfigurationResult, AWSError>;
  /**
   * Updates the metadata of a GameSparks snapshot.
   */
  updateSnapshot(params: GameSparks.Types.UpdateSnapshotRequest, callback?: (err: AWSError, data: GameSparks.Types.UpdateSnapshotResult) => void): Request<GameSparks.Types.UpdateSnapshotResult, AWSError>;
  /**
   * Updates the metadata of a GameSparks snapshot.
   */
  updateSnapshot(callback?: (err: AWSError, data: GameSparks.Types.UpdateSnapshotResult) => void): Request<GameSparks.Types.UpdateSnapshotResult, AWSError>;
  /**
   * Updates the metadata of a stage.
   */
  updateStage(params: GameSparks.Types.UpdateStageRequest, callback?: (err: AWSError, data: GameSparks.Types.UpdateStageResult) => void): Request<GameSparks.Types.UpdateStageResult, AWSError>;
  /**
   * Updates the metadata of a stage.
   */
  updateStage(callback?: (err: AWSError, data: GameSparks.Types.UpdateStageResult) => void): Request<GameSparks.Types.UpdateStageResult, AWSError>;
}
declare namespace GameSparks {
  export type ARN = string;
  export type ByteSize = number;
  export type ClientToken = string;
  export interface Connection {
    /**
     * The date and time when the connection was created.
     */
    Created?: DateTime;
    /**
     * The identifier used to indicate a specific WebSocket connection.
     */
    Id?: ConnectionId;
  }
  export type ConnectionId = string;
  export type ConnectionIdList = ConnectionId[];
  export type ConnectionList = Connection[];
  export interface CreateGameRequest {
    /**
     *  A client-defined token. With an active client token in the request, this action is idempotent. 
     */
    ClientToken?: ClientToken;
    /**
     * The description of the game.
     */
    Description?: GameDescription;
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The list of tags to apply to the game.
     */
    Tags?: TagMap;
  }
  export interface CreateGameResult {
    /**
     * Details about the game that was created.
     */
    Game?: GameDetails;
  }
  export interface CreateSnapshotRequest {
    /**
     * The description of the snapshot.
     */
    Description?: SnapshotDescription;
    /**
     * The name of the game.
     */
    GameName: GameName;
  }
  export interface CreateSnapshotResult {
    /**
     * Properties that provide details of the created snapshot.
     */
    Snapshot?: SnapshotDetails;
  }
  export interface CreateStageRequest {
    /**
     *  A client-defined token. With an active client token in the request, this action is idempotent. 
     */
    ClientToken?: ClientToken;
    /**
     * The description of the stage.
     */
    Description?: StageDescription;
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     *  The Amazon Resource Name (ARN) of the role to run the game with. This role can be a game-defined role or the default role that GameSparks created. 
     */
    Role: RoleARN;
    /**
     * The name of the stage.
     */
    StageName: StageName;
    /**
     * The list of tags to apply to the stage.
     */
    Tags?: TagMap;
  }
  export interface CreateStageResult {
    /**
     * Properties that describe the stage.
     */
    Stage?: StageDetails;
  }
  export type DateTime = Date;
  export interface DeleteGameRequest {
    /**
     * The name of the game to delete.
     */
    GameName: GameName;
  }
  export interface DeleteGameResult {
  }
  export interface DeleteStageRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The name of the stage to delete.
     */
    StageName: StageName;
  }
  export interface DeleteStageResult {
  }
  export type DeploymentAction = "DEPLOY"|"UNDEPLOY"|string;
  export type DeploymentId = string;
  export interface DeploymentResult {
    /**
     * Details about the deployment result.
     */
    Message?: Message;
    /**
     * The type of deployment result.
     */
    ResultCode?: ResultCode;
  }
  export type DeploymentState = "PENDING"|"IN_PROGRESS"|"COMPLETED"|"FAILED"|string;
  export interface DisconnectPlayerRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The unique identifier representing a player.
     */
    PlayerId: PlayerId;
    /**
     * The name of the stage.
     */
    StageName: StageName;
  }
  export interface DisconnectPlayerResult {
    /**
     * The list of the connection ids that could not be disconnected.
     */
    DisconnectFailures?: ConnectionIdList;
    /**
     * The list of the connection ids that were disconnected.
     */
    DisconnectSuccesses?: ConnectionIdList;
  }
  export interface Document {
  }
  export interface ExportSnapshotRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The identifier of the snapshot to export.
     */
    SnapshotId: SnapshotId;
  }
  export interface ExportSnapshotResult {
    /**
     * The presigned URL for the snapshot data.  This URL will be available for 10 minutes, and can be used to download the snapshot content. If the URL expires, a new one can be requested using the same operation. 
     */
    S3Url?: S3PresignedUrl;
  }
  export type ExtensionDescription = string;
  export interface ExtensionDetails {
    /**
     * The description of the extension.
     */
    Description?: ExtensionDescription;
    /**
     * The name of the extension.
     */
    Name?: ExtensionName;
    /**
     * The namespace (qualifier) of the extension.
     */
    Namespace?: ExtensionNamespace;
  }
  export type ExtensionDetailsList = ExtensionDetails[];
  export type ExtensionName = string;
  export type ExtensionNamespace = string;
  export type ExtensionVersion = string;
  export interface ExtensionVersionDetails {
    /**
     * The name of the extension.
     */
    Name?: ExtensionName;
    /**
     * The namespace (qualifier) of the extension.
     */
    Namespace?: ExtensionNamespace;
    /**
     * The model that defines the interface for this extension version.
     */
    Schema?: ExtensionVersionSchema;
    /**
     * The version of the extension.
     */
    Version?: ExtensionVersion;
  }
  export type ExtensionVersionDetailsList = ExtensionVersionDetails[];
  export type ExtensionVersionSchema = string;
  export interface GameConfigurationDetails {
    /**
     * The date when the game was created.
     */
    Created?: DateTime;
    /**
     * The date when the game was last modified.
     */
    LastUpdated?: DateTime;
    /**
     * Configuration data, organized by section name.
     */
    Sections?: Sections;
  }
  export type GameDescription = string;
  export interface GameDetails {
    /**
     * The Amazon Resource Name (ARN) of this game.
     */
    Arn?: ARN;
    /**
     * The date when the game was created.
     */
    Created?: DateTime;
    /**
     * The description of the game.
     */
    Description?: GameDescription;
    /**
     * Determines if the game can be deleted.
     */
    EnableTerminationProtection?: GameTerminationProtection;
    /**
     * The date when the game was last modified.
     */
    LastUpdated?: DateTime;
    /**
     * The name of the game.
     */
    Name?: GameName;
    /**
     * The state of the game.
     */
    State?: GameState;
    /**
     * The tags associated with the game.
     */
    Tags?: TagMap;
  }
  export type GameKey = string;
  export type GameName = string;
  export type GameSdkVersion = string;
  export type GameState = "ACTIVE"|"DELETING"|string;
  export interface GameSummary {
    /**
     * The description of the game.
     */
    Description?: GameDescription;
    /**
     * The name of the game.
     */
    Name?: GameName;
    /**
     * The state of the game.
     */
    State?: GameState;
    /**
     * The tags associated with the game.
     */
    Tags?: TagMap;
  }
  export type GameSummaryList = GameSummary[];
  export type GameTerminationProtection = boolean;
  export type GeneratedCodeJobDescription = string;
  export interface GeneratedCodeJobDetails {
    /**
     * The description of the generated code job.
     */
    Description?: GeneratedCodeJobDescription;
    /**
     * The expiration date and time for the download URL.  The download URL us guaranteed to be available until at least this time. 
     */
    ExpirationTime?: DateTime;
    /**
     * The identifier for the generated code job.
     */
    GeneratedCodeJobId?: GeneratedCodeJobId;
    /**
     * A presigned URL that can be used to download the generated code.
     */
    S3Url?: S3PresignedUrl;
    /**
     * The status of the generated code job
     */
    Status?: GeneratedCodeJobState;
  }
  export type GeneratedCodeJobDetailsList = GeneratedCodeJobDetails[];
  export type GeneratedCodeJobId = string;
  export type GeneratedCodeJobState = "IN_PROGRESS"|"COMPLETED"|"FAILED"|"PENDING"|string;
  export interface Generator {
    /**
     * The target version of the GameSparks Game SDK.
     */
    GameSdkVersion?: GameSdkVersion;
    /**
     * The programming language for the generated code.  Not all languages are supported for each platform. For cases where multiple languages are supported, this parameter specifies the language to be used. If this value is omitted, the default language for the target platform will be used. 
     */
    Language?: Language;
    /**
     * The platform that will be used to run the generated code.
     */
    TargetPlatform?: TargetPlatform;
  }
  export interface GetExtensionRequest {
    /**
     * The name of the extension.
     */
    Name: ExtensionName;
    /**
     * The namespace (qualifier) of the extension.
     */
    Namespace: ExtensionNamespace;
  }
  export interface GetExtensionResult {
    /**
     * Details about the extension.
     */
    Extension?: ExtensionDetails;
  }
  export interface GetExtensionVersionRequest {
    /**
     * The version of the extension.
     */
    ExtensionVersion: ExtensionVersion;
    /**
     * The name of the extension.
     */
    Name: ExtensionName;
    /**
     * The namespace (qualifier) of the extension.
     */
    Namespace: ExtensionNamespace;
  }
  export interface GetExtensionVersionResult {
    /**
     * The version of the extension.
     */
    ExtensionVersion?: ExtensionVersionDetails;
  }
  export interface GetGameConfigurationRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The list of sections to return.
     */
    Sections?: SectionList;
  }
  export interface GetGameConfigurationResult {
    /**
     * Details about the game configuration.
     */
    GameConfiguration?: GameConfigurationDetails;
  }
  export interface GetGameRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
  }
  export interface GetGameResult {
    /**
     * The details of the game.
     */
    Game?: GameDetails;
  }
  export interface GetGeneratedCodeJobRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The identifier of the code generation job.
     */
    JobId: GeneratedCodeJobId;
    /**
     * The identifier of the snapshot for the code generation job.
     */
    SnapshotId: SnapshotId;
  }
  export interface GetGeneratedCodeJobResult {
    /**
     * Details about the generated code job.
     */
    GeneratedCodeJob?: GeneratedCodeJobDetails;
  }
  export interface GetPlayerConnectionStatusRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The unique identifier representing a player.
     */
    PlayerId: PlayerId;
    /**
     * The name of the stage.
     */
    StageName: StageName;
  }
  export interface GetPlayerConnectionStatusResult {
    /**
     * The list of connection ids, one for each connection in use by the player.
     */
    Connections?: ConnectionList;
  }
  export interface GetSnapshotRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The list of game configuration sections to be described.
     */
    Sections?: SectionList;
    /**
     * The identifier of the snapshot.
     */
    SnapshotId: SnapshotId;
  }
  export interface GetSnapshotResult {
    /**
     * Properties that provide details of the snapshot.
     */
    Snapshot?: SnapshotDetails;
  }
  export interface GetStageDeploymentRequest {
    /**
     *  The identifier of the stage deployment. StartStageDeployment returns the identifier that you use here. 
     */
    DeploymentId?: DeploymentId;
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The name of the stage.
     */
    StageName: StageName;
  }
  export interface GetStageDeploymentResult {
    /**
     * Properties that provide details of the stage deployment.
     */
    StageDeployment?: StageDeploymentDetails;
  }
  export interface GetStageRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The name of the stage.
     */
    StageName: StageName;
  }
  export interface GetStageResult {
    /**
     * Properties that provide details of the stage.
     */
    Stage?: StageDetails;
  }
  export interface ImportGameConfigurationRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The source used to import configuration sections.
     */
    ImportSource: ImportGameConfigurationSource;
  }
  export interface ImportGameConfigurationResult {
    /**
     * Details about the game configuration.
     */
    GameConfiguration?: GameConfigurationDetails;
  }
  export interface ImportGameConfigurationSource {
    /**
     * The JSON string containing the configuration sections.
     */
    File: RawGameConfigurationData;
  }
  export type Language = string;
  export interface ListExtensionVersionsRequest {
    /**
     * The maximum number of results to return.  Use this parameter with NextToken to get results as a set of sequential pages. 
     */
    MaxResults?: MaxResults;
    /**
     * The name of the extension.
     */
    Name: ExtensionName;
    /**
     * The namespace (qualifier) of the extension.
     */
    Namespace: ExtensionNamespace;
    /**
     * The token that indicates the start of the next sequential page of results.  Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value. 
     */
    NextToken?: NextToken;
  }
  export interface ListExtensionVersionsResult {
    /**
     * The list of extension versions.
     */
    ExtensionVersions?: ExtensionVersionDetailsList;
    /**
     * The token that indicates the start of the next sequential page of results.  Use this value when making the next call to this operation to continue where the last one finished. 
     */
    NextToken?: NextToken;
  }
  export interface ListExtensionsRequest {
    /**
     * The maximum number of results to return.  Use this parameter with NextToken to get results as a set of sequential pages. 
     */
    MaxResults?: MaxResults;
    /**
     * The token that indicates the start of the next sequential page of results.  Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value. 
     */
    NextToken?: NextToken;
  }
  export interface ListExtensionsResult {
    /**
     * The list of extensions.
     */
    Extensions?: ExtensionDetailsList;
    /**
     * The token that indicates the start of the next sequential page of results.  Use this value when making the next call to this operation to continue where the last one finished. 
     */
    NextToken?: NextToken;
  }
  export interface ListGamesRequest {
    /**
     * The maximum number of results to return.  Use this parameter with NextToken to get results as a set of sequential pages. 
     */
    MaxResults?: MaxResults;
    /**
     * The token that indicates the start of the next sequential page of results.  Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value. 
     */
    NextToken?: NextToken;
  }
  export interface ListGamesResult {
    /**
     * The list of games.
     */
    Games?: GameSummaryList;
    /**
     * The token that indicates the start of the next sequential page of results.  Use this value when making the next call to this operation to continue where the last one finished. 
     */
    NextToken?: NextToken;
  }
  export interface ListGeneratedCodeJobsRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The maximum number of results to return.  Use this parameter with NextToken to get results as a set of sequential pages. 
     */
    MaxResults?: MaxResults;
    /**
     * The token that indicates the start of the next sequential page of results.  Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value. 
     */
    NextToken?: NextToken;
    /**
     * The identifier of the snapshot.
     */
    SnapshotId: SnapshotId;
  }
  export interface ListGeneratedCodeJobsResult {
    /**
     * The list of generated code jobs.
     */
    GeneratedCodeJobs?: GeneratedCodeJobDetailsList;
    /**
     * The token that indicates the start of the next sequential page of results.  Use this value when making the next call to this operation to continue where the last one finished. 
     */
    NextToken?: NextToken;
  }
  export interface ListSnapshotsRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The maximum number of results to return.  Use this parameter with NextToken to get results as a set of sequential pages. 
     */
    MaxResults?: MaxResults;
    /**
     * The token that indicates the start of the next sequential page of results.  Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value. 
     */
    NextToken?: NextToken;
  }
  export interface ListSnapshotsResult {
    /**
     * The token that indicates the start of the next sequential page of results.  Use this value when making the next call to this operation to continue where the last one finished. 
     */
    NextToken?: NextToken;
    /**
     *  A list of snapshot summaries. You can use the returned snapshot IDs in the UpdateSnapshot and GetSnapshot operations. 
     */
    Snapshots?: SnapshotSummaryList;
  }
  export interface ListStageDeploymentsRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The maximum number of results to return.  Use this parameter with NextToken to get results as a set of sequential pages. 
     */
    MaxResults?: MaxResults;
    /**
     * The token that indicates the start of the next sequential page of results.  Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value. 
     */
    NextToken?: NextToken;
    /**
     * The name of the stage.
     */
    StageName: StageName;
  }
  export interface ListStageDeploymentsResult {
    /**
     * The token that indicates the start of the next sequential page of results.  Use this value when making the next call to this operation to continue where the last one finished. 
     */
    NextToken?: NextToken;
    /**
     *  A list of stage deployment summaries. You can use the deployment IDs in the UpdateStageDeployment and GetStageDeployment actions. 
     */
    StageDeployments?: StageDeploymentList;
  }
  export interface ListStagesRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The maximum number of results to return.  Use this parameter with NextToken to get results as a set of sequential pages. 
     */
    MaxResults?: MaxResults;
    /**
     * The token that indicates the start of the next sequential page of results.  Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value. 
     */
    NextToken?: NextToken;
  }
  export interface ListStagesResult {
    /**
     * The token that indicates the start of the next sequential page of results.  Use this value when making the next call to this operation to continue where the last one finished. 
     */
    NextToken?: NextToken;
    /**
     *  A list of stage summaries. You can use the stage names in the UpdateStage and GetStage actions. 
     */
    Stages?: StageSummaryList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the GameSparks resource.
     */
    ResourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResult {
    /**
     * The tags associated with the resource.
     */
    tags?: TagMap;
  }
  export type LogGroupName = string;
  export type MaxResults = number;
  export type Message = string;
  export type NextToken = string;
  export type Operation = "ADD"|"REMOVE"|"REPLACE"|string;
  export type Path = string;
  export type PlayerId = string;
  export type RawGameConfigurationData = Buffer|Uint8Array|Blob|string;
  export type ResourceArn = string;
  export type ResultCode = "SUCCESS"|"INVALID_ROLE_FAILURE"|"UNSPECIFIED_FAILURE"|string;
  export type RoleARN = string;
  export type S3PresignedUrl = string;
  export interface Section {
    /**
     * The content of a configuration section.
     */
    Attributes?: Document;
    /**
     * The name of the section.
     */
    Name?: SectionName;
    /**
     * The size, in bytes, of the section contents.
     */
    Size?: ByteSize;
  }
  export type SectionList = SectionName[];
  export interface SectionModification {
    /**
     * The operation to be performed on a configuration section.  Content can be added, deleted, or replaced within a section. 
     */
    Operation: Operation;
    /**
     * The path within the section content to be modified.
     */
    Path: Path;
    /**
     * The name of the section to be modified.
     */
    Section: SectionName;
    /**
     * For add and replace operations, this is the value that will be used.  This field should be omitted for delete operations. 
     */
    Value?: Document;
  }
  export type SectionModificationList = SectionModification[];
  export type SectionName = string;
  export type Sections = {[key: string]: Section};
  export type SnapshotDescription = string;
  export interface SnapshotDetails {
    /**
     * The timestamp of when the snapshot was created.
     */
    Created?: DateTime;
    /**
     * The description of the snapshot.
     */
    Description?: SnapshotDescription;
    /**
     * The identifier of the snapshot.
     */
    Id?: SnapshotId;
    /**
     * The timestamp of when the snapshot was last updated.
     */
    LastUpdated?: DateTime;
    /**
     * The sections in the snapshot.
     */
    Sections?: Sections;
  }
  export type SnapshotId = string;
  export interface SnapshotSummary {
    /**
     * The timestamp of when the snapshot was created.
     */
    Created?: DateTime;
    /**
     * The description of the snapshot.
     */
    Description?: SnapshotDescription;
    /**
     * The identifier of the snapshot.
     */
    Id?: SnapshotId;
    /**
     * Then timestamp of when the snapshot was last updated.
     */
    LastUpdated?: DateTime;
  }
  export type SnapshotSummaryList = SnapshotSummary[];
  export interface StageDeploymentDetails {
    /**
     * The timestamp of when the stage deployment was created.
     */
    Created?: DateTime;
    /**
     * The type of action of the stage deployment.
     */
    DeploymentAction?: DeploymentAction;
    /**
     * The identifier of the deployment.
     */
    DeploymentId?: DeploymentId;
    /**
     * The result of the deployment.
     */
    DeploymentResult?: DeploymentResult;
    /**
     * The state of the deployment.
     */
    DeploymentState?: DeploymentState;
    /**
     * The timestamp of when the deployment was last updated.
     */
    LastUpdated?: DateTime;
    /**
     * The identifier of the snapshot associated with the stage deployment.
     */
    SnapshotId?: SnapshotId;
  }
  export type StageDeploymentList = StageDeploymentSummary[];
  export interface StageDeploymentSummary {
    /**
     * The type of action of the deployment.
     */
    DeploymentAction?: DeploymentAction;
    /**
     * The identifier of the deployment.
     */
    DeploymentId?: DeploymentId;
    /**
     * The result of the deployment.
     */
    DeploymentResult?: DeploymentResult;
    /**
     * The state of the deployment.
     */
    DeploymentState?: DeploymentState;
    /**
     * The timestamp of when the deployment was last updated.
     */
    LastUpdated?: DateTime;
    /**
     * The identifier of the snapshot associated with the stage deployment.
     */
    SnapshotId?: SnapshotId;
  }
  export type StageDescription = string;
  export interface StageDetails {
    /**
     * The Amazon Resource Name (ARN) of the stage.
     */
    Arn?: ARN;
    /**
     * The timestamp of when the stage was created.
     */
    Created?: DateTime;
    /**
     * The description of the stage.
     */
    Description?: StageDescription;
    /**
     * The game key associated with the stage.  The game key is a unique identifier that the game client uses to connect to the GameSparks backend. 
     */
    GameKey?: GameKey;
    /**
     * The timestamp of when the stage was last updated.
     */
    LastUpdated?: DateTime;
    /**
     * The Amazon CloudWatch log group for game runtimes deployed to the stage.
     */
    LogGroup?: LogGroupName;
    /**
     * The name of the stage.
     */
    Name?: StageName;
    /**
     * The Amazon Resource Name (ARN) of the role used to run the game runtimes deployed to the stage.
     */
    Role?: RoleARN;
    /**
     * The state of the stage.
     */
    State?: StageState;
    /**
     * The tags associated with the stage.
     */
    Tags?: TagMap;
  }
  export type StageName = string;
  export type StageState = "ACTIVE"|"DELETING"|string;
  export interface StageSummary {
    /**
     * The description of the stage.
     */
    Description?: StageDescription;
    /**
     * The game key associated with the stage.  The game key is a unique identifier that the game client uses to connect to the GameSparks backend. 
     */
    GameKey?: GameKey;
    /**
     * The name of the stage.
     */
    Name?: StageName;
    /**
     * The state of the stage.
     */
    State?: StageState;
    /**
     * The tags associated with the stage.
     */
    Tags?: TagMap;
  }
  export type StageSummaryList = StageSummary[];
  export interface StartGeneratedCodeJobRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * Properties of the generator to use for the job.
     */
    Generator: Generator;
    /**
     * The identifier of the snapshot for which to generate code.
     */
    SnapshotId: SnapshotId;
  }
  export interface StartGeneratedCodeJobResult {
    /**
     *  The identifier of the code generation job. You can use this identifier in the GetGeneratedCodeJob operation. 
     */
    GeneratedCodeJobId?: GeneratedCodeJobId;
  }
  export interface StartStageDeploymentRequest {
    /**
     *  A client-defined token. With an active client token in the request, this action is idempotent. 
     */
    ClientToken?: ClientToken;
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The identifier of the snapshot to deploy.
     */
    SnapshotId: SnapshotId;
    /**
     * The name of the stage to deploy the snapshot onto.
     */
    StageName: StageName;
  }
  export interface StartStageDeploymentResult {
    /**
     * Properties that describe the stage deployment.
     */
    StageDeployment?: StageDeploymentDetails;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to add the tags to.
     */
    ResourceArn: ResourceArn;
    /**
     * The tags to add to the resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResult {
  }
  export type TagValue = string;
  export type TargetPlatform = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to remove the tags from.
     */
    ResourceArn: ResourceArn;
    /**
     * The keys of the tags to remove.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResult {
  }
  export interface UpdateGameConfigurationRequest {
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The list of modifications to make.
     */
    Modifications: SectionModificationList;
  }
  export interface UpdateGameConfigurationResult {
    /**
     * Details about the game configuration.
     */
    GameConfiguration?: GameConfigurationDetails;
  }
  export interface UpdateGameRequest {
    /**
     * The description of the game.
     */
    Description?: GameDescription;
    /**
     * The name of the game.
     */
    GameName: GameName;
  }
  export interface UpdateGameResult {
    /**
     * The details of the game.
     */
    Game?: GameDetails;
  }
  export interface UpdateSnapshotRequest {
    /**
     * The description of the snapshot.
     */
    Description?: SnapshotDescription;
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The identifier of the snapshot.
     */
    SnapshotId: SnapshotId;
  }
  export interface UpdateSnapshotResult {
    /**
     * Properties that provide details of the updated snapshot.
     */
    Snapshot?: SnapshotDetails;
  }
  export interface UpdateStageRequest {
    /**
     * The description of the stage.
     */
    Description?: StageDescription;
    /**
     * The name of the game.
     */
    GameName: GameName;
    /**
     * The Amazon Resource Name (ARN) of the role to use for the game snapshots deployed to this stage.
     */
    Role?: RoleARN;
    /**
     * The name of the stage.
     */
    StageName: StageName;
  }
  export interface UpdateStageResult {
    /**
     * Properties that provide details of the updated stage.
     */
    Stage?: StageDetails;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-08-17"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the GameSparks client.
   */
  export import Types = GameSparks;
}
export = GameSparks;
