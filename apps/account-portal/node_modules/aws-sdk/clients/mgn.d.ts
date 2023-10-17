import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Mgn extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Mgn.Types.ClientConfiguration)
  config: Config & Mgn.Types.ClientConfiguration;
  /**
   * Allows the user to set the SourceServer.LifeCycle.state property for specific Source Server IDs to one of the following: READY_FOR_TEST or READY_FOR_CUTOVER. This command only works if the Source Server is already launchable (dataReplicationInfo.lagDuration is not null.)
   */
  changeServerLifeCycleState(params: Mgn.Types.ChangeServerLifeCycleStateRequest, callback?: (err: AWSError, data: Mgn.Types.SourceServer) => void): Request<Mgn.Types.SourceServer, AWSError>;
  /**
   * Allows the user to set the SourceServer.LifeCycle.state property for specific Source Server IDs to one of the following: READY_FOR_TEST or READY_FOR_CUTOVER. This command only works if the Source Server is already launchable (dataReplicationInfo.lagDuration is not null.)
   */
  changeServerLifeCycleState(callback?: (err: AWSError, data: Mgn.Types.SourceServer) => void): Request<Mgn.Types.SourceServer, AWSError>;
  /**
   * Creates a new ReplicationConfigurationTemplate.
   */
  createReplicationConfigurationTemplate(params: Mgn.Types.CreateReplicationConfigurationTemplateRequest, callback?: (err: AWSError, data: Mgn.Types.ReplicationConfigurationTemplate) => void): Request<Mgn.Types.ReplicationConfigurationTemplate, AWSError>;
  /**
   * Creates a new ReplicationConfigurationTemplate.
   */
  createReplicationConfigurationTemplate(callback?: (err: AWSError, data: Mgn.Types.ReplicationConfigurationTemplate) => void): Request<Mgn.Types.ReplicationConfigurationTemplate, AWSError>;
  /**
   * Deletes a single Job by ID.
   */
  deleteJob(params: Mgn.Types.DeleteJobRequest, callback?: (err: AWSError, data: Mgn.Types.DeleteJobResponse) => void): Request<Mgn.Types.DeleteJobResponse, AWSError>;
  /**
   * Deletes a single Job by ID.
   */
  deleteJob(callback?: (err: AWSError, data: Mgn.Types.DeleteJobResponse) => void): Request<Mgn.Types.DeleteJobResponse, AWSError>;
  /**
   * Deletes a single Replication Configuration Template by ID
   */
  deleteReplicationConfigurationTemplate(params: Mgn.Types.DeleteReplicationConfigurationTemplateRequest, callback?: (err: AWSError, data: Mgn.Types.DeleteReplicationConfigurationTemplateResponse) => void): Request<Mgn.Types.DeleteReplicationConfigurationTemplateResponse, AWSError>;
  /**
   * Deletes a single Replication Configuration Template by ID
   */
  deleteReplicationConfigurationTemplate(callback?: (err: AWSError, data: Mgn.Types.DeleteReplicationConfigurationTemplateResponse) => void): Request<Mgn.Types.DeleteReplicationConfigurationTemplateResponse, AWSError>;
  /**
   * Deletes a single source server by ID.
   */
  deleteSourceServer(params: Mgn.Types.DeleteSourceServerRequest, callback?: (err: AWSError, data: Mgn.Types.DeleteSourceServerResponse) => void): Request<Mgn.Types.DeleteSourceServerResponse, AWSError>;
  /**
   * Deletes a single source server by ID.
   */
  deleteSourceServer(callback?: (err: AWSError, data: Mgn.Types.DeleteSourceServerResponse) => void): Request<Mgn.Types.DeleteSourceServerResponse, AWSError>;
  /**
   * Retrieves detailed Job log with paging.
   */
  describeJobLogItems(params: Mgn.Types.DescribeJobLogItemsRequest, callback?: (err: AWSError, data: Mgn.Types.DescribeJobLogItemsResponse) => void): Request<Mgn.Types.DescribeJobLogItemsResponse, AWSError>;
  /**
   * Retrieves detailed Job log with paging.
   */
  describeJobLogItems(callback?: (err: AWSError, data: Mgn.Types.DescribeJobLogItemsResponse) => void): Request<Mgn.Types.DescribeJobLogItemsResponse, AWSError>;
  /**
   * Returns a list of Jobs. Use the JobsID and fromDate and toData filters to limit which jobs are returned. The response is sorted by creationDataTime - latest date first. Jobs are normaly created by the StartTest, StartCutover, and TerminateTargetInstances APIs. Jobs are also created by DiagnosticLaunch and TerminateDiagnosticInstances, which are APIs available only to *Support* and only used in response to relevant support tickets.
   */
  describeJobs(params: Mgn.Types.DescribeJobsRequest, callback?: (err: AWSError, data: Mgn.Types.DescribeJobsResponse) => void): Request<Mgn.Types.DescribeJobsResponse, AWSError>;
  /**
   * Returns a list of Jobs. Use the JobsID and fromDate and toData filters to limit which jobs are returned. The response is sorted by creationDataTime - latest date first. Jobs are normaly created by the StartTest, StartCutover, and TerminateTargetInstances APIs. Jobs are also created by DiagnosticLaunch and TerminateDiagnosticInstances, which are APIs available only to *Support* and only used in response to relevant support tickets.
   */
  describeJobs(callback?: (err: AWSError, data: Mgn.Types.DescribeJobsResponse) => void): Request<Mgn.Types.DescribeJobsResponse, AWSError>;
  /**
   * Lists all ReplicationConfigurationTemplates, filtered by Source Server IDs.
   */
  describeReplicationConfigurationTemplates(params: Mgn.Types.DescribeReplicationConfigurationTemplatesRequest, callback?: (err: AWSError, data: Mgn.Types.DescribeReplicationConfigurationTemplatesResponse) => void): Request<Mgn.Types.DescribeReplicationConfigurationTemplatesResponse, AWSError>;
  /**
   * Lists all ReplicationConfigurationTemplates, filtered by Source Server IDs.
   */
  describeReplicationConfigurationTemplates(callback?: (err: AWSError, data: Mgn.Types.DescribeReplicationConfigurationTemplatesResponse) => void): Request<Mgn.Types.DescribeReplicationConfigurationTemplatesResponse, AWSError>;
  /**
   * Retrieves all SourceServers or multiple SourceServers by ID.
   */
  describeSourceServers(params: Mgn.Types.DescribeSourceServersRequest, callback?: (err: AWSError, data: Mgn.Types.DescribeSourceServersResponse) => void): Request<Mgn.Types.DescribeSourceServersResponse, AWSError>;
  /**
   * Retrieves all SourceServers or multiple SourceServers by ID.
   */
  describeSourceServers(callback?: (err: AWSError, data: Mgn.Types.DescribeSourceServersResponse) => void): Request<Mgn.Types.DescribeSourceServersResponse, AWSError>;
  /**
   * Disconnects specific Source Servers from Application Migration Service. Data replication is stopped immediately. All AWS resources created by Application Migration Service for enabling the replication of these source servers will be terminated / deleted within 90 minutes. Launched Test or Cutover instances will NOT be terminated. If the agent on the source server has not been prevented from communciating with the Application Migration Service service, then it will receive a command to uninstall itself (within approximately 10 minutes). The following properties of the SourceServer will be changed immediately: dataReplicationInfo.dataReplicationState will be set to DISCONNECTED; The totalStorageBytes property for each of dataReplicationInfo.replicatedDisks will be set to zero; dataReplicationInfo.lagDuration and dataReplicationInfo.lagDurationwill be nullified.
   */
  disconnectFromService(params: Mgn.Types.DisconnectFromServiceRequest, callback?: (err: AWSError, data: Mgn.Types.SourceServer) => void): Request<Mgn.Types.SourceServer, AWSError>;
  /**
   * Disconnects specific Source Servers from Application Migration Service. Data replication is stopped immediately. All AWS resources created by Application Migration Service for enabling the replication of these source servers will be terminated / deleted within 90 minutes. Launched Test or Cutover instances will NOT be terminated. If the agent on the source server has not been prevented from communciating with the Application Migration Service service, then it will receive a command to uninstall itself (within approximately 10 minutes). The following properties of the SourceServer will be changed immediately: dataReplicationInfo.dataReplicationState will be set to DISCONNECTED; The totalStorageBytes property for each of dataReplicationInfo.replicatedDisks will be set to zero; dataReplicationInfo.lagDuration and dataReplicationInfo.lagDurationwill be nullified.
   */
  disconnectFromService(callback?: (err: AWSError, data: Mgn.Types.SourceServer) => void): Request<Mgn.Types.SourceServer, AWSError>;
  /**
   * Finalizes the cutover immediately for specific Source Servers. All AWS resources created by Application Migration Service for enabling the replication of these source servers will be terminated / deleted within 90 minutes. Launched Test or Cutover instances will NOT be terminated. The AWS Replication Agent will receive a command to uninstall itself (within 10 minutes). The following properties of the SourceServer will be changed immediately: dataReplicationInfo.dataReplicationState will be to DISCONNECTED; The SourceServer.lifeCycle.state will be changed to CUTOVER; The totalStorageBytes property fo each of dataReplicationInfo.replicatedDisks will be set to zero; dataReplicationInfo.lagDuration and dataReplicationInfo.lagDurationwill be nullified.
   */
  finalizeCutover(params: Mgn.Types.FinalizeCutoverRequest, callback?: (err: AWSError, data: Mgn.Types.SourceServer) => void): Request<Mgn.Types.SourceServer, AWSError>;
  /**
   * Finalizes the cutover immediately for specific Source Servers. All AWS resources created by Application Migration Service for enabling the replication of these source servers will be terminated / deleted within 90 minutes. Launched Test or Cutover instances will NOT be terminated. The AWS Replication Agent will receive a command to uninstall itself (within 10 minutes). The following properties of the SourceServer will be changed immediately: dataReplicationInfo.dataReplicationState will be to DISCONNECTED; The SourceServer.lifeCycle.state will be changed to CUTOVER; The totalStorageBytes property fo each of dataReplicationInfo.replicatedDisks will be set to zero; dataReplicationInfo.lagDuration and dataReplicationInfo.lagDurationwill be nullified.
   */
  finalizeCutover(callback?: (err: AWSError, data: Mgn.Types.SourceServer) => void): Request<Mgn.Types.SourceServer, AWSError>;
  /**
   * Lists all LaunchConfigurations available, filtered by Source Server IDs.
   */
  getLaunchConfiguration(params: Mgn.Types.GetLaunchConfigurationRequest, callback?: (err: AWSError, data: Mgn.Types.LaunchConfiguration) => void): Request<Mgn.Types.LaunchConfiguration, AWSError>;
  /**
   * Lists all LaunchConfigurations available, filtered by Source Server IDs.
   */
  getLaunchConfiguration(callback?: (err: AWSError, data: Mgn.Types.LaunchConfiguration) => void): Request<Mgn.Types.LaunchConfiguration, AWSError>;
  /**
   * Lists all ReplicationConfigurations, filtered by Source Server ID.
   */
  getReplicationConfiguration(params: Mgn.Types.GetReplicationConfigurationRequest, callback?: (err: AWSError, data: Mgn.Types.ReplicationConfiguration) => void): Request<Mgn.Types.ReplicationConfiguration, AWSError>;
  /**
   * Lists all ReplicationConfigurations, filtered by Source Server ID.
   */
  getReplicationConfiguration(callback?: (err: AWSError, data: Mgn.Types.ReplicationConfiguration) => void): Request<Mgn.Types.ReplicationConfiguration, AWSError>;
  /**
   * Initialize Application Migration Service.
   */
  initializeService(params: Mgn.Types.InitializeServiceRequest, callback?: (err: AWSError, data: Mgn.Types.InitializeServiceResponse) => void): Request<Mgn.Types.InitializeServiceResponse, AWSError>;
  /**
   * Initialize Application Migration Service.
   */
  initializeService(callback?: (err: AWSError, data: Mgn.Types.InitializeServiceResponse) => void): Request<Mgn.Types.InitializeServiceResponse, AWSError>;
  /**
   * List all tags for your Application Migration Service resources.
   */
  listTagsForResource(params: Mgn.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Mgn.Types.ListTagsForResourceResponse) => void): Request<Mgn.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List all tags for your Application Migration Service resources.
   */
  listTagsForResource(callback?: (err: AWSError, data: Mgn.Types.ListTagsForResourceResponse) => void): Request<Mgn.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Archives specific Source Servers by setting the SourceServer.isArchived property to true for specified SourceServers by ID. This command only works for SourceServers with a lifecycle.state which equals DISCONNECTED or CUTOVER.
   */
  markAsArchived(params: Mgn.Types.MarkAsArchivedRequest, callback?: (err: AWSError, data: Mgn.Types.SourceServer) => void): Request<Mgn.Types.SourceServer, AWSError>;
  /**
   * Archives specific Source Servers by setting the SourceServer.isArchived property to true for specified SourceServers by ID. This command only works for SourceServers with a lifecycle.state which equals DISCONNECTED or CUTOVER.
   */
  markAsArchived(callback?: (err: AWSError, data: Mgn.Types.SourceServer) => void): Request<Mgn.Types.SourceServer, AWSError>;
  /**
   * Causes the data replication initiation sequence to begin immediately upon next Handshake for specified SourceServer IDs, regardless of when the previous initiation started. This command will not work if the SourceServer is not stalled or is in a DISCONNECTED or STOPPED state.
   */
  retryDataReplication(params: Mgn.Types.RetryDataReplicationRequest, callback?: (err: AWSError, data: Mgn.Types.SourceServer) => void): Request<Mgn.Types.SourceServer, AWSError>;
  /**
   * Causes the data replication initiation sequence to begin immediately upon next Handshake for specified SourceServer IDs, regardless of when the previous initiation started. This command will not work if the SourceServer is not stalled or is in a DISCONNECTED or STOPPED state.
   */
  retryDataReplication(callback?: (err: AWSError, data: Mgn.Types.SourceServer) => void): Request<Mgn.Types.SourceServer, AWSError>;
  /**
   * Launches a Cutover Instance for specific Source Servers. This command starts a LAUNCH job whose initiatedBy property is StartCutover and changes the SourceServer.lifeCycle.state property to CUTTING_OVER.
   */
  startCutover(params: Mgn.Types.StartCutoverRequest, callback?: (err: AWSError, data: Mgn.Types.StartCutoverResponse) => void): Request<Mgn.Types.StartCutoverResponse, AWSError>;
  /**
   * Launches a Cutover Instance for specific Source Servers. This command starts a LAUNCH job whose initiatedBy property is StartCutover and changes the SourceServer.lifeCycle.state property to CUTTING_OVER.
   */
  startCutover(callback?: (err: AWSError, data: Mgn.Types.StartCutoverResponse) => void): Request<Mgn.Types.StartCutoverResponse, AWSError>;
  /**
   * Lauches a Test Instance for specific Source Servers. This command starts a LAUNCH job whose initiatedBy property is StartTest and changes the SourceServer.lifeCycle.state property to TESTING.
   */
  startTest(params: Mgn.Types.StartTestRequest, callback?: (err: AWSError, data: Mgn.Types.StartTestResponse) => void): Request<Mgn.Types.StartTestResponse, AWSError>;
  /**
   * Lauches a Test Instance for specific Source Servers. This command starts a LAUNCH job whose initiatedBy property is StartTest and changes the SourceServer.lifeCycle.state property to TESTING.
   */
  startTest(callback?: (err: AWSError, data: Mgn.Types.StartTestResponse) => void): Request<Mgn.Types.StartTestResponse, AWSError>;
  /**
   * Adds or overwrites only the specified tags for the specified Application Migration Service resource or resources. When you specify an existing tag key, the value is overwritten with the new value. Each resource can have a maximum of 50 tags. Each tag consists of a key and optional value.
   */
  tagResource(params: Mgn.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or overwrites only the specified tags for the specified Application Migration Service resource or resources. When you specify an existing tag key, the value is overwritten with the new value. Each resource can have a maximum of 50 tags. Each tag consists of a key and optional value.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts a job that terminates specific launched EC2 Test and Cutover instances. This command will not work for any Source Server with a lifecycle.state of TESTING, CUTTING_OVER, or CUTOVER.
   */
  terminateTargetInstances(params: Mgn.Types.TerminateTargetInstancesRequest, callback?: (err: AWSError, data: Mgn.Types.TerminateTargetInstancesResponse) => void): Request<Mgn.Types.TerminateTargetInstancesResponse, AWSError>;
  /**
   * Starts a job that terminates specific launched EC2 Test and Cutover instances. This command will not work for any Source Server with a lifecycle.state of TESTING, CUTTING_OVER, or CUTOVER.
   */
  terminateTargetInstances(callback?: (err: AWSError, data: Mgn.Types.TerminateTargetInstancesResponse) => void): Request<Mgn.Types.TerminateTargetInstancesResponse, AWSError>;
  /**
   * Deletes the specified set of tags from the specified set of Application Migration Service resources.
   */
  untagResource(params: Mgn.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified set of tags from the specified set of Application Migration Service resources.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates multiple LaunchConfigurations by Source Server ID.
   */
  updateLaunchConfiguration(params: Mgn.Types.UpdateLaunchConfigurationRequest, callback?: (err: AWSError, data: Mgn.Types.LaunchConfiguration) => void): Request<Mgn.Types.LaunchConfiguration, AWSError>;
  /**
   * Updates multiple LaunchConfigurations by Source Server ID.
   */
  updateLaunchConfiguration(callback?: (err: AWSError, data: Mgn.Types.LaunchConfiguration) => void): Request<Mgn.Types.LaunchConfiguration, AWSError>;
  /**
   * Allows you to update multiple ReplicationConfigurations by Source Server ID.
   */
  updateReplicationConfiguration(params: Mgn.Types.UpdateReplicationConfigurationRequest, callback?: (err: AWSError, data: Mgn.Types.ReplicationConfiguration) => void): Request<Mgn.Types.ReplicationConfiguration, AWSError>;
  /**
   * Allows you to update multiple ReplicationConfigurations by Source Server ID.
   */
  updateReplicationConfiguration(callback?: (err: AWSError, data: Mgn.Types.ReplicationConfiguration) => void): Request<Mgn.Types.ReplicationConfiguration, AWSError>;
  /**
   * Updates multiple ReplicationConfigurationTemplates by ID.
   */
  updateReplicationConfigurationTemplate(params: Mgn.Types.UpdateReplicationConfigurationTemplateRequest, callback?: (err: AWSError, data: Mgn.Types.ReplicationConfigurationTemplate) => void): Request<Mgn.Types.ReplicationConfigurationTemplate, AWSError>;
  /**
   * Updates multiple ReplicationConfigurationTemplates by ID.
   */
  updateReplicationConfigurationTemplate(callback?: (err: AWSError, data: Mgn.Types.ReplicationConfigurationTemplate) => void): Request<Mgn.Types.ReplicationConfigurationTemplate, AWSError>;
}
declare namespace Mgn {
  export type ARN = string;
  export type Boolean = boolean;
  export type BoundedString = string;
  export interface CPU {
    /**
     * The number of CPU cores on the source server.
     */
    cores?: PositiveInteger;
    /**
     * The source server's CPU model name.
     */
    modelName?: BoundedString;
  }
  export interface ChangeServerLifeCycleStateRequest {
    /**
     * The request to change the source server migration lifecycle state.
     */
    lifeCycle: ChangeServerLifeCycleStateSourceServerLifecycle;
    /**
     * The request to change the source server migration lifecycle state by source server ID.
     */
    sourceServerID: SourceServerID;
  }
  export interface ChangeServerLifeCycleStateSourceServerLifecycle {
    /**
     * The request to change the source server migration lifecycle state.
     */
    state: ChangeServerLifeCycleStateSourceServerLifecycleState;
  }
  export type ChangeServerLifeCycleStateSourceServerLifecycleState = "READY_FOR_TEST"|"READY_FOR_CUTOVER"|"CUTOVER"|string;
  export type Cpus = CPU[];
  export interface CreateReplicationConfigurationTemplateRequest {
    /**
     * Request to associate the default Application Migration Service Security group with the Replication Settings template.
     */
    associateDefaultSecurityGroup: Boolean;
    /**
     * Request to configure bandwidth throttling during Replication Settings template creation.
     */
    bandwidthThrottling: PositiveInteger;
    /**
     * Request to create Public IP during Replication Settings template creation.
     */
    createPublicIP: Boolean;
    /**
     * Request to configure data plane routing during Replication Settings template creation.
     */
    dataPlaneRouting: ReplicationConfigurationDataPlaneRouting;
    /**
     * Request to configure the Staging Disk EBS volume type to "gp2" during Replication Settings template creation.
     */
    defaultLargeStagingDiskType: ReplicationConfigurationDefaultLargeStagingDiskType;
    /**
     * Request to configure EBS enryption during Replication Settings template creation.
     */
    ebsEncryption: ReplicationConfigurationEbsEncryption;
    /**
     * Request to configure an EBS enryption key during Replication Settings template creation.
     */
    ebsEncryptionKeyArn?: ARN;
    /**
     * Request to configure the Replication Server instance type during Replication Settings template creation.
     */
    replicationServerInstanceType: EC2InstanceType;
    /**
     * Request to configure the Replication Server Secuirity group ID during Replication Settings template creation.
     */
    replicationServersSecurityGroupsIDs: ReplicationServersSecurityGroupsIDs;
    /**
     * Request to configure the Staging Area subnet ID during Replication Settings template creation.
     */
    stagingAreaSubnetId: SubnetID;
    /**
     * Request to configure Staiging Area tags during Replication Settings template creation.
     */
    stagingAreaTags: TagsMap;
    /**
     * Request to configure tags during Replication Settings template creation.
     */
    tags?: TagsMap;
    /**
     * Request to use Dedicated Replication Servers during Replication Settings template creation.
     */
    useDedicatedReplicationServer: Boolean;
  }
  export interface DataReplicationError {
    /**
     * Error in data replication.
     */
    error?: DataReplicationErrorString;
    /**
     * Error in data replication.
     */
    rawError?: LargeBoundedString;
  }
  export type DataReplicationErrorString = "AGENT_NOT_SEEN"|"SNAPSHOTS_FAILURE"|"NOT_CONVERGING"|"UNSTABLE_NETWORK"|"FAILED_TO_CREATE_SECURITY_GROUP"|"FAILED_TO_LAUNCH_REPLICATION_SERVER"|"FAILED_TO_BOOT_REPLICATION_SERVER"|"FAILED_TO_AUTHENTICATE_WITH_SERVICE"|"FAILED_TO_DOWNLOAD_REPLICATION_SOFTWARE"|"FAILED_TO_CREATE_STAGING_DISKS"|"FAILED_TO_ATTACH_STAGING_DISKS"|"FAILED_TO_PAIR_REPLICATION_SERVER_WITH_AGENT"|"FAILED_TO_CONNECT_AGENT_TO_REPLICATION_SERVER"|"FAILED_TO_START_DATA_TRANSFER"|string;
  export interface DataReplicationInfo {
    /**
     * Error in obtaining data replication info.
     */
    dataReplicationError?: DataReplicationError;
    /**
     * Request to query whether data replication has been initiated.
     */
    dataReplicationInitiation?: DataReplicationInitiation;
    /**
     * Request to query the data replication state.
     */
    dataReplicationState?: DataReplicationState;
    /**
     * Request to query the time when data replication will be complete.
     */
    etaDateTime?: ISO8601DatetimeString;
    /**
     * Request to query data replication lag durating.
     */
    lagDuration?: ISO8601DatetimeString;
    /**
     * Request to query disks replicated.
     */
    replicatedDisks?: DataReplicationInfoReplicatedDisks;
  }
  export interface DataReplicationInfoReplicatedDisk {
    /**
     * Request to query data replication backlog size in bytes.
     */
    backloggedStorageBytes?: PositiveInteger;
    /**
     * Request to query device name.
     */
    deviceName?: BoundedString;
    /**
     * Request to query amount of data replicated in bytes.
     */
    replicatedStorageBytes?: PositiveInteger;
    /**
     * Request to query amount of data rescanned in bytes.
     */
    rescannedStorageBytes?: PositiveInteger;
    /**
     * Request to query total amount of data replicated in bytes.
     */
    totalStorageBytes?: PositiveInteger;
  }
  export type DataReplicationInfoReplicatedDisks = DataReplicationInfoReplicatedDisk[];
  export interface DataReplicationInitiation {
    /**
     * Request to query next data initiation date and time.
     */
    nextAttemptDateTime?: ISO8601DatetimeString;
    /**
     * Request to query data initiation start date and time.
     */
    startDateTime?: ISO8601DatetimeString;
    /**
     * Request to query data initiation steps.
     */
    steps?: DataReplicationInitiationSteps;
  }
  export interface DataReplicationInitiationStep {
    /**
     * Request to query data initiation step name.
     */
    name?: DataReplicationInitiationStepName;
    /**
     * Request to query data initiation status.
     */
    status?: DataReplicationInitiationStepStatus;
  }
  export type DataReplicationInitiationStepName = "WAIT"|"CREATE_SECURITY_GROUP"|"LAUNCH_REPLICATION_SERVER"|"BOOT_REPLICATION_SERVER"|"AUTHENTICATE_WITH_SERVICE"|"DOWNLOAD_REPLICATION_SOFTWARE"|"CREATE_STAGING_DISKS"|"ATTACH_STAGING_DISKS"|"PAIR_REPLICATION_SERVER_WITH_AGENT"|"CONNECT_AGENT_TO_REPLICATION_SERVER"|"START_DATA_TRANSFER"|string;
  export type DataReplicationInitiationStepStatus = "NOT_STARTED"|"IN_PROGRESS"|"SUCCEEDED"|"FAILED"|"SKIPPED"|string;
  export type DataReplicationInitiationSteps = DataReplicationInitiationStep[];
  export type DataReplicationState = "STOPPED"|"INITIATING"|"INITIAL_SYNC"|"BACKLOG"|"CREATING_SNAPSHOT"|"CONTINUOUS"|"PAUSED"|"RESCAN"|"STALLED"|"DISCONNECTED"|string;
  export interface DeleteJobRequest {
    /**
     * Request to delete Job from service by Job ID.
     */
    jobID: JobID;
  }
  export interface DeleteJobResponse {
  }
  export interface DeleteReplicationConfigurationTemplateRequest {
    /**
     * Request to delete Replication Configuration Template from service by Replication Configuration Template ID.
     */
    replicationConfigurationTemplateID: ReplicationConfigurationTemplateID;
  }
  export interface DeleteReplicationConfigurationTemplateResponse {
  }
  export interface DeleteSourceServerRequest {
    /**
     * Request to delete Source Server from service by Server ID.
     */
    sourceServerID: SourceServerID;
  }
  export interface DeleteSourceServerResponse {
  }
  export interface DescribeJobLogItemsRequest {
    /**
     * Request to describe Job log job ID.
     */
    jobID: JobID;
    /**
     * Request to describe Job log item maximum results.
     */
    maxResults?: StrictlyPositiveInteger;
    /**
     * Request to describe Job log next token.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeJobLogItemsResponse {
    /**
     * Request to describe Job log response items.
     */
    items?: JobLogs;
    /**
     * Request to describe Job log response next token.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeJobsRequest {
    /**
     * Request to describe Job log filters.
     */
    filters: DescribeJobsRequestFilters;
    /**
     * Request to describe Job log by max results.
     */
    maxResults?: StrictlyPositiveInteger;
    /**
     * Request to describe Job logby next token.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeJobsRequestFilters {
    /**
     * Request to describe Job log filters by date.
     */
    fromDate?: ISO8601DatetimeString;
    /**
     * Request to describe Job log filters by job ID.
     */
    jobIDs?: DescribeJobsRequestFiltersJobIDs;
    /**
     * Request to describe Job log by last date.
     */
    toDate?: ISO8601DatetimeString;
  }
  export type DescribeJobsRequestFiltersJobIDs = JobID[];
  export interface DescribeJobsResponse {
    /**
     * Request to describe Job log items.
     */
    items?: JobsList;
    /**
     * Request to describe Job response by next token.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeReplicationConfigurationTemplatesRequest {
    /**
     * Request to describe Replication Configuration template by max results.
     */
    maxResults?: StrictlyPositiveInteger;
    /**
     * Request to describe Replication Configuration template by next token.
     */
    nextToken?: PaginationToken;
    /**
     * Request to describe Replication Configuration template by template IDs.
     */
    replicationConfigurationTemplateIDs: ReplicationConfigurationTemplateIDs;
  }
  export interface DescribeReplicationConfigurationTemplatesResponse {
    /**
     * Request to describe Replication Configuration template by items.
     */
    items?: ReplicationConfigurationTemplates;
    /**
     * Request to describe Replication Configuration template by next token.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeSourceServersRequest {
    /**
     * Request to filter Source Servers list.
     */
    filters: DescribeSourceServersRequestFilters;
    /**
     * Request to filter Source Servers list by maximum results.
     */
    maxResults?: StrictlyPositiveInteger;
    /**
     * Request to filter Source Servers list by next token.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeSourceServersRequestFilters {
    /**
     * Request to filter Source Servers list by archived.
     */
    isArchived?: Boolean;
    /**
     * Request to filter Source Servers list by Source Server ID.
     */
    sourceServerIDs?: DescribeSourceServersRequestFiltersIDs;
  }
  export type DescribeSourceServersRequestFiltersIDs = SourceServerID[];
  export interface DescribeSourceServersResponse {
    /**
     * Request to filter Source Servers list by item.
     */
    items?: SourceServersList;
    /**
     * Request to filter Source Servers next token.
     */
    nextToken?: PaginationToken;
  }
  export interface DisconnectFromServiceRequest {
    /**
     * Request to disconnect Source Server from service by Server ID.
     */
    sourceServerID: SourceServerID;
  }
  export interface Disk {
    /**
     * The amount of storage on the disk in bytes.
     */
    bytes?: PositiveInteger;
    /**
     * The disk or device name.
     */
    deviceName?: BoundedString;
  }
  export type Disks = Disk[];
  export type EC2InstanceID = string;
  export type EC2InstanceType = string;
  export interface FinalizeCutoverRequest {
    /**
     * Request to finalize Cutover by Soure Server ID.
     */
    sourceServerID: SourceServerID;
  }
  export type FirstBoot = "WAITING"|"SUCCEEDED"|"UNKNOWN"|"STOPPED"|string;
  export interface GetLaunchConfigurationRequest {
    /**
     * Request to get Launch Configuration information by Source Server ID.
     */
    sourceServerID: SourceServerID;
  }
  export interface GetReplicationConfigurationRequest {
    /**
     * Request to get Replication Configuaration by Source Server ID.
     */
    sourceServerID: SourceServerID;
  }
  export type IPsList = BoundedString[];
  export type ISO8601DatetimeString = string;
  export interface IdentificationHints {
    /**
     * AWS Instance ID identification hint.
     */
    awsInstanceID?: EC2InstanceID;
    /**
     * FQDN address identification hint.
     */
    fqdn?: BoundedString;
    /**
     * Hostname identification hint.
     */
    hostname?: BoundedString;
    /**
     * vmWare UUID identification hint.
     */
    vmWareUuid?: BoundedString;
  }
  export interface InitializeServiceRequest {
  }
  export interface InitializeServiceResponse {
  }
  export type InitiatedBy = "START_TEST"|"START_CUTOVER"|"DIAGNOSTIC"|"TERMINATE"|string;
  export interface Job {
    /**
     * the ARN of the specific Job.
     */
    arn?: ARN;
    /**
     * Job creation time.
     */
    creationDateTime?: ISO8601DatetimeString;
    /**
     * Job end time.
     */
    endDateTime?: ISO8601DatetimeString;
    /**
     * Job initiated by field.
     */
    initiatedBy?: InitiatedBy;
    /**
     * Job ID.
     */
    jobID: JobID;
    /**
     * Servers participating in a specific Job.
     */
    participatingServers?: ParticipatingServers;
    /**
     * Job status.
     */
    status?: JobStatus;
    /**
     * Tags associated with spcific Job.
     */
    tags?: TagsMap;
    /**
     * Job type.
     */
    type?: JobType;
  }
  export type JobID = string;
  export interface JobLog {
    /**
     * Job log event.
     */
    event?: JobLogEvent;
    /**
     * Job event data
     */
    eventData?: JobLogEventData;
    /**
     * Job log event date and time.
     */
    logDateTime?: ISO8601DatetimeString;
  }
  export type JobLogEvent = "JOB_START"|"SERVER_SKIPPED"|"CLEANUP_START"|"CLEANUP_END"|"CLEANUP_FAIL"|"SNAPSHOT_START"|"SNAPSHOT_END"|"SNAPSHOT_FAIL"|"USING_PREVIOUS_SNAPSHOT"|"CONVERSION_START"|"CONVERSION_END"|"CONVERSION_FAIL"|"LAUNCH_START"|"LAUNCH_FAILED"|"JOB_CANCEL"|"JOB_END"|string;
  export interface JobLogEventData {
    /**
     * Job Event conversion Server ID.
     */
    conversionServerID?: EC2InstanceID;
    /**
     * Job error.
     */
    rawError?: LargeBoundedString;
    /**
     * Job Event Source Server ID.
     */
    sourceServerID?: SourceServerID;
    /**
     * Job Event Target instance ID.
     */
    targetInstanceID?: EC2InstanceID;
  }
  export type JobLogs = JobLog[];
  export type JobStatus = "PENDING"|"STARTED"|"COMPLETED"|string;
  export type JobType = "LAUNCH"|"TERMINATE"|string;
  export type JobsList = Job[];
  export type LargeBoundedString = string;
  export interface LaunchConfiguration {
    /**
     * Copy Private IP during Launch Configuration.
     */
    copyPrivateIp?: Boolean;
    /**
     * Copy Tags during Launch Configuration.
     */
    copyTags?: Boolean;
    /**
     * Configure EC2 lauch configuration template ID.
     */
    ec2LaunchTemplateID?: BoundedString;
    /**
     * Configure launch dispostion for launch configuration.
     */
    launchDisposition?: LaunchDisposition;
    /**
     * Configure launch configuration OS licensing.
     */
    licensing?: Licensing;
    /**
     * Configure launch configuration name.
     */
    name?: SmallBoundedString;
    /**
     * Configure launch configuration Source Server ID.
     */
    sourceServerID?: SourceServerID;
    /**
     * Configure launch configuration Target instance type right sizing method.
     */
    targetInstanceTypeRightSizingMethod?: TargetInstanceTypeRightSizingMethod;
  }
  export type LaunchDisposition = "STOPPED"|"STARTED"|string;
  export type LaunchStatus = "PENDING"|"IN_PROGRESS"|"LAUNCHED"|"FAILED"|"TERMINATED"|string;
  export interface LaunchedInstance {
    /**
     * Configure launced instance EC2 ID.
     */
    ec2InstanceID?: EC2InstanceID;
    /**
     * Configure launced instance first boot.
     */
    firstBoot?: FirstBoot;
    /**
     * Configure launced instance Job ID.
     */
    jobID?: JobID;
  }
  export interface Licensing {
    /**
     * Configure BYOL OS licensing.
     */
    osByol?: Boolean;
  }
  export interface LifeCycle {
    /**
     * Lifecycle added to service data and time.
     */
    addedToServiceDateTime?: ISO8601DatetimeString;
    /**
     * Lifecycle elapsed time and duration.
     */
    elapsedReplicationDuration?: ISO8601DatetimeString;
    /**
     * Lifecycle replication initiation date and time.
     */
    firstByteDateTime?: ISO8601DatetimeString;
    /**
     * Lifecycle last Cutover.
     */
    lastCutover?: LifeCycleLastCutover;
    /**
     * Lifecycle last seen date and time.
     */
    lastSeenByServiceDateTime?: ISO8601DatetimeString;
    /**
     * Lifecycle last Test.
     */
    lastTest?: LifeCycleLastTest;
    /**
     * Lifecycle state.
     */
    state?: LifeCycleState;
  }
  export interface LifeCycleLastCutover {
    /**
     * Lifecycle Cutover finalized date and time.
     */
    finalized?: LifeCycleLastCutoverFinalized;
    /**
     * Lifecycle last Cutover initiated.
     */
    initiated?: LifeCycleLastCutoverInitiated;
    /**
     * Lifecycle last Cutover reverted.
     */
    reverted?: LifeCycleLastCutoverReverted;
  }
  export interface LifeCycleLastCutoverFinalized {
    /**
     * Lifecycle Cutover finalized date and time.
     */
    apiCallDateTime?: ISO8601DatetimeString;
  }
  export interface LifeCycleLastCutoverInitiated {
    /**
     * 
     */
    apiCallDateTime?: ISO8601DatetimeString;
    /**
     * Lifecycle last Cutover initiated by Job ID.
     */
    jobID?: JobID;
  }
  export interface LifeCycleLastCutoverReverted {
    /**
     * Lifecycle last Cutover reverted API call date time.
     */
    apiCallDateTime?: ISO8601DatetimeString;
  }
  export interface LifeCycleLastTest {
    /**
     * Lifecycle last Test finlized.
     */
    finalized?: LifeCycleLastTestFinalized;
    /**
     * Lifecycle last Test initiated.
     */
    initiated?: LifeCycleLastTestInitiated;
    /**
     * Lifecycle last Test reverted.
     */
    reverted?: LifeCycleLastTestReverted;
  }
  export interface LifeCycleLastTestFinalized {
    /**
     * Lifecycle Test failed API call date and time.
     */
    apiCallDateTime?: ISO8601DatetimeString;
  }
  export interface LifeCycleLastTestInitiated {
    /**
     * Lifecycle last Test initiated API call date and time.
     */
    apiCallDateTime?: ISO8601DatetimeString;
    /**
     * Lifecycle last Test initiated Job ID.
     */
    jobID?: JobID;
  }
  export interface LifeCycleLastTestReverted {
    /**
     * Lifecycle last Test reverted API call date and time.
     */
    apiCallDateTime?: ISO8601DatetimeString;
  }
  export type LifeCycleState = "STOPPED"|"NOT_READY"|"READY_FOR_TEST"|"TESTING"|"READY_FOR_CUTOVER"|"CUTTING_OVER"|"CUTOVER"|"DISCONNECTED"|string;
  export interface ListTagsForResourceRequest {
    /**
     * List tags for resource request by ARN.
     */
    resourceArn: ARN;
  }
  export interface ListTagsForResourceResponse {
    /**
     * List tags for resource response.
     */
    tags?: TagsMap;
  }
  export interface MarkAsArchivedRequest {
    /**
     * Mark as archived by Source Server ID.
     */
    sourceServerID: SourceServerID;
  }
  export interface NetworkInterface {
    /**
     * Network interface IPs.
     */
    ips?: IPsList;
    /**
     * Network interface primary IP.
     */
    isPrimary?: Boolean;
    /**
     * Network interface Mac address.
     */
    macAddress?: BoundedString;
  }
  export type NetworkInterfaces = NetworkInterface[];
  export interface OS {
    /**
     * OS full string.
     */
    fullString?: BoundedString;
  }
  export type PaginationToken = string;
  export interface ParticipatingServer {
    /**
     * Participating server launch status.
     */
    launchStatus?: LaunchStatus;
    /**
     * Participating server Source Server ID.
     */
    sourceServerID?: SourceServerID;
  }
  export type ParticipatingServers = ParticipatingServer[];
  export type PositiveInteger = number;
  export interface ReplicationConfiguration {
    /**
     * Replication Configuration associate default Application Migration Service Security Group.
     */
    associateDefaultSecurityGroup?: Boolean;
    /**
     * Replication Configuration set bandwidth throttling.
     */
    bandwidthThrottling?: PositiveInteger;
    /**
     * Replication Configuration create Public IP.
     */
    createPublicIP?: Boolean;
    /**
     * Replication Configuration data plane routing.
     */
    dataPlaneRouting?: ReplicationConfigurationDataPlaneRouting;
    /**
     * Replication Configuration use default large Staging Disks.
     */
    defaultLargeStagingDiskType?: ReplicationConfigurationDefaultLargeStagingDiskType;
    /**
     * Replication Configuration EBS encryption.
     */
    ebsEncryption?: ReplicationConfigurationEbsEncryption;
    /**
     * Replication Configuration EBS encryption key ARN.
     */
    ebsEncryptionKeyArn?: ARN;
    /**
     * Replication Configuration name.
     */
    name?: SmallBoundedString;
    /**
     * Replication Configuration replicated disks.
     */
    replicatedDisks?: ReplicationConfigurationReplicatedDisks;
    /**
     * Replication Configuration Replication Server instance type.
     */
    replicationServerInstanceType?: EC2InstanceType;
    /**
     * Replication Configuration Replication Server Security Group IDs.
     */
    replicationServersSecurityGroupsIDs?: ReplicationServersSecurityGroupsIDs;
    /**
     * Replication Configuration Source Server ID.
     */
    sourceServerID?: SourceServerID;
    /**
     * Replication Configuration Staging Area subnet ID.
     */
    stagingAreaSubnetId?: SubnetID;
    /**
     * Replication Configuration Staging Area tags.
     */
    stagingAreaTags?: TagsMap;
    /**
     * Replication Configuration use Dedicated Replication Server.
     */
    useDedicatedReplicationServer?: Boolean;
  }
  export type ReplicationConfigurationDataPlaneRouting = "PRIVATE_IP"|"PUBLIC_IP"|string;
  export type ReplicationConfigurationDefaultLargeStagingDiskType = "GP2"|"ST1"|string;
  export type ReplicationConfigurationEbsEncryption = "DEFAULT"|"CUSTOM"|string;
  export interface ReplicationConfigurationReplicatedDisk {
    /**
     * Replication Configuration replicated disk device name.
     */
    deviceName?: BoundedString;
    /**
     * Replication Configuration replicated disk IOPs.
     */
    iops?: PositiveInteger;
    /**
     * Replication Configuration replicated disk boot disk.
     */
    isBootDisk?: Boolean;
    /**
     * Replication Configuration replicated disk staging disk type.
     */
    stagingDiskType?: ReplicationConfigurationReplicatedDiskStagingDiskType;
  }
  export type ReplicationConfigurationReplicatedDiskStagingDiskType = "AUTO"|"GP2"|"IO1"|"SC1"|"ST1"|"STANDARD"|string;
  export type ReplicationConfigurationReplicatedDisks = ReplicationConfigurationReplicatedDisk[];
  export interface ReplicationConfigurationTemplate {
    /**
     * Replication Configuration template ARN.
     */
    arn?: ARN;
    /**
     * Replication Configuration template associate default Application Migration Service Security group.
     */
    associateDefaultSecurityGroup?: Boolean;
    /**
     * Replication Configuration template bandwidth throtting.
     */
    bandwidthThrottling?: PositiveInteger;
    /**
     * Replication Configuration template create Public IP.
     */
    createPublicIP?: Boolean;
    /**
     * Replication Configuration template data plane routing.
     */
    dataPlaneRouting?: ReplicationConfigurationDataPlaneRouting;
    /**
     * Replication Configuration template use dedault large Staging Disk type.
     */
    defaultLargeStagingDiskType?: ReplicationConfigurationDefaultLargeStagingDiskType;
    /**
     * Replication Configuration template EBS encryption.
     */
    ebsEncryption?: ReplicationConfigurationEbsEncryption;
    /**
     * Replication Configuration template EBS encryption key ARN.
     */
    ebsEncryptionKeyArn?: ARN;
    /**
     * Replication Configuration template template ID.
     */
    replicationConfigurationTemplateID: ReplicationConfigurationTemplateID;
    /**
     * Replication Configuration template server instance type.
     */
    replicationServerInstanceType?: EC2InstanceType;
    /**
     * Replication Configuration template server Security Groups IDs.
     */
    replicationServersSecurityGroupsIDs?: ReplicationServersSecurityGroupsIDs;
    /**
     * Replication Configuration template Staging Area subnet ID.
     */
    stagingAreaSubnetId?: SubnetID;
    /**
     * Replication Configuration template Staging Area Tags.
     */
    stagingAreaTags?: TagsMap;
    /**
     * Replication Configuration template Tags.
     */
    tags?: TagsMap;
    /**
     * Replication Configuration template use Dedicated Replication Server.
     */
    useDedicatedReplicationServer?: Boolean;
  }
  export type ReplicationConfigurationTemplateID = string;
  export type ReplicationConfigurationTemplateIDs = ReplicationConfigurationTemplateID[];
  export type ReplicationConfigurationTemplates = ReplicationConfigurationTemplate[];
  export type ReplicationServersSecurityGroupsIDs = SecurityGroupID[];
  export interface RetryDataReplicationRequest {
    /**
     * Retry data replication for Source Server ID.
     */
    sourceServerID: SourceServerID;
  }
  export type SecurityGroupID = string;
  export type SmallBoundedString = string;
  export interface SourceProperties {
    /**
     * Source Server CPUs.
     */
    cpus?: Cpus;
    /**
     * Source Server disks.
     */
    disks?: Disks;
    /**
     * Source server identification hints.
     */
    identificationHints?: IdentificationHints;
    /**
     * Source server last update date and time.
     */
    lastUpdatedDateTime?: ISO8601DatetimeString;
    /**
     * Source server network interfaces.
     */
    networkInterfaces?: NetworkInterfaces;
    /**
     * Source server OS.
     */
    os?: OS;
    /**
     * Source server RAM in bytes.
     */
    ramBytes?: PositiveInteger;
    /**
     * Source server recommended instance type.
     */
    recommendedInstanceType?: EC2InstanceType;
  }
  export interface SourceServer {
    /**
     * Source server ARN.
     */
    arn?: ARN;
    /**
     * Source server data replication info.
     */
    dataReplicationInfo?: DataReplicationInfo;
    /**
     * Source server archived status.
     */
    isArchived?: Boolean;
    /**
     * Source server launched instance.
     */
    launchedInstance?: LaunchedInstance;
    /**
     * Source server lifecycle state.
     */
    lifeCycle?: LifeCycle;
    /**
     * Source server properties.
     */
    sourceProperties?: SourceProperties;
    /**
     * Source server ID.
     */
    sourceServerID?: SourceServerID;
    /**
     * Source server Tags.
     */
    tags?: TagsMap;
  }
  export type SourceServerID = string;
  export type SourceServersList = SourceServer[];
  export interface StartCutoverRequest {
    /**
     * Start Cutover by Source Server IDs.
     */
    sourceServerIDs: StartCutoverRequestSourceServerIDs;
    /**
     * Start Cutover by Tags.
     */
    tags?: TagsMap;
  }
  export type StartCutoverRequestSourceServerIDs = SourceServerID[];
  export interface StartCutoverResponse {
    /**
     * Start Cutover Job response.
     */
    job?: Job;
  }
  export interface StartTestRequest {
    /**
     * Start Test for Source Server IDs.
     */
    sourceServerIDs: StartTestRequestSourceServerIDs;
    /**
     * Start Test by Tags.
     */
    tags?: TagsMap;
  }
  export type StartTestRequestSourceServerIDs = SourceServerID[];
  export interface StartTestResponse {
    /**
     * Start Test Job response.
     */
    job?: Job;
  }
  export type StrictlyPositiveInteger = number;
  export type SubnetID = string;
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceRequest {
    /**
     * Tag resource by ARN.
     */
    resourceArn: ARN;
    /**
     * Tag resource by Tags.
     */
    tags: TagsMap;
  }
  export type TagValue = string;
  export type TagsMap = {[key: string]: TagValue};
  export type TargetInstanceTypeRightSizingMethod = "NONE"|"BASIC"|string;
  export interface TerminateTargetInstancesRequest {
    /**
     * Terminate Target instance by Source Server IDs.
     */
    sourceServerIDs: TerminateTargetInstancesRequestSourceServerIDs;
    /**
     * Terminate Target instance by Tags.
     */
    tags?: TagsMap;
  }
  export type TerminateTargetInstancesRequestSourceServerIDs = SourceServerID[];
  export interface TerminateTargetInstancesResponse {
    /**
     * Terminate Target instance Job response.
     */
    job?: Job;
  }
  export interface UntagResourceRequest {
    /**
     * Untag resource by ARN.
     */
    resourceArn: ARN;
    /**
     * Untag resource by Keys.
     */
    tagKeys: TagKeys;
  }
  export interface UpdateLaunchConfigurationRequest {
    /**
     * Update Launch configuration copy Private IP request.
     */
    copyPrivateIp?: Boolean;
    /**
     * Update Launch configuration copy Tags request.
     */
    copyTags?: Boolean;
    /**
     * Update Launch configuration launch disposition request.
     */
    launchDisposition?: LaunchDisposition;
    /**
     * Update Launch configuration licensing request.
     */
    licensing?: Licensing;
    /**
     * Update Launch configuration name request.
     */
    name?: SmallBoundedString;
    /**
     * Update Launch configuration by Source Server ID request.
     */
    sourceServerID: SourceServerID;
    /**
     * Update Launch configuration Target instance right sizing request.
     */
    targetInstanceTypeRightSizingMethod?: TargetInstanceTypeRightSizingMethod;
  }
  export interface UpdateReplicationConfigurationRequest {
    /**
     * Update replication configuration associate default Application Migration Service Security group request.
     */
    associateDefaultSecurityGroup?: Boolean;
    /**
     * Update replication configuration bandwidth throttling request.
     */
    bandwidthThrottling?: PositiveInteger;
    /**
     * Update replication configuration create Public IP request.
     */
    createPublicIP?: Boolean;
    /**
     * Update replication configuration data plane routing request.
     */
    dataPlaneRouting?: ReplicationConfigurationDataPlaneRouting;
    /**
     * Update replication configuration use default large Staging Disk type request.
     */
    defaultLargeStagingDiskType?: ReplicationConfigurationDefaultLargeStagingDiskType;
    /**
     * Update replication configuration EBS encryption request.
     */
    ebsEncryption?: ReplicationConfigurationEbsEncryption;
    /**
     * Update replication configuration EBS encryption key ARN request.
     */
    ebsEncryptionKeyArn?: ARN;
    /**
     * Update replication configuration name request.
     */
    name?: SmallBoundedString;
    /**
     * Update replication configuration replicated disks request.
     */
    replicatedDisks?: ReplicationConfigurationReplicatedDisks;
    /**
     * Update replication configuration Replication Server instance type request.
     */
    replicationServerInstanceType?: EC2InstanceType;
    /**
     * Update replication configuration Replication Server Security Groups IDs request.
     */
    replicationServersSecurityGroupsIDs?: ReplicationServersSecurityGroupsIDs;
    /**
     * Update replication configuration Source Server ID request.
     */
    sourceServerID: SourceServerID;
    /**
     * Update replication configuration Staging Area subnet request.
     */
    stagingAreaSubnetId?: SubnetID;
    /**
     * Update replication configuration Staging Area Tags request.
     */
    stagingAreaTags?: TagsMap;
    /**
     * Update replication configuration use dedicated Replication Server request.
     */
    useDedicatedReplicationServer?: Boolean;
  }
  export interface UpdateReplicationConfigurationTemplateRequest {
    /**
     * Update replication configuration template ARN request.
     */
    arn?: ARN;
    /**
     * Update replication configuration template associate default Application Migration Service Security group request.
     */
    associateDefaultSecurityGroup?: Boolean;
    /**
     * Update replication configuration template bandwidth throttling request.
     */
    bandwidthThrottling?: PositiveInteger;
    /**
     * Update replication configuration template create Public IP request.
     */
    createPublicIP?: Boolean;
    /**
     * Update replication configuration template data plane routing request.
     */
    dataPlaneRouting?: ReplicationConfigurationDataPlaneRouting;
    /**
     * Update replication configuration template use default large Staging Disk type request.
     */
    defaultLargeStagingDiskType?: ReplicationConfigurationDefaultLargeStagingDiskType;
    /**
     * Update replication configuration template EBS encryption request.
     */
    ebsEncryption?: ReplicationConfigurationEbsEncryption;
    /**
     * Update replication configuration template EBS encryption key ARN request.
     */
    ebsEncryptionKeyArn?: ARN;
    /**
     * Update replication configuration template template ID request.
     */
    replicationConfigurationTemplateID: ReplicationConfigurationTemplateID;
    /**
     * Update replication configuration template Replication Server instance type request.
     */
    replicationServerInstanceType?: EC2InstanceType;
    /**
     * Update replication configuration template Replication Server Security groups IDs request.
     */
    replicationServersSecurityGroupsIDs?: ReplicationServersSecurityGroupsIDs;
    /**
     * Update replication configuration template Staging Area subnet ID request.
     */
    stagingAreaSubnetId?: SubnetID;
    /**
     * Update replication configuration template Staging Area Tags request.
     */
    stagingAreaTags?: TagsMap;
    /**
     * Update replication configuration template use dedicated Replication Server request.
     */
    useDedicatedReplicationServer?: Boolean;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-02-26"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Mgn client.
   */
  export import Types = Mgn;
}
export = Mgn;
