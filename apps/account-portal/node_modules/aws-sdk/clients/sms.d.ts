import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SMS extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SMS.Types.ClientConfiguration)
  config: Config & SMS.Types.ClientConfiguration;
  /**
   * Creates an application. An application consists of one or more server groups. Each server group contain one or more servers.
   */
  createApp(params: SMS.Types.CreateAppRequest, callback?: (err: AWSError, data: SMS.Types.CreateAppResponse) => void): Request<SMS.Types.CreateAppResponse, AWSError>;
  /**
   * Creates an application. An application consists of one or more server groups. Each server group contain one or more servers.
   */
  createApp(callback?: (err: AWSError, data: SMS.Types.CreateAppResponse) => void): Request<SMS.Types.CreateAppResponse, AWSError>;
  /**
   * Creates a replication job. The replication job schedules periodic replication runs to replicate your server to AWS. Each replication run creates an Amazon Machine Image (AMI).
   */
  createReplicationJob(params: SMS.Types.CreateReplicationJobRequest, callback?: (err: AWSError, data: SMS.Types.CreateReplicationJobResponse) => void): Request<SMS.Types.CreateReplicationJobResponse, AWSError>;
  /**
   * Creates a replication job. The replication job schedules periodic replication runs to replicate your server to AWS. Each replication run creates an Amazon Machine Image (AMI).
   */
  createReplicationJob(callback?: (err: AWSError, data: SMS.Types.CreateReplicationJobResponse) => void): Request<SMS.Types.CreateReplicationJobResponse, AWSError>;
  /**
   * Deletes the specified application. Optionally deletes the launched stack associated with the application and all AWS SMS replication jobs for servers in the application.
   */
  deleteApp(params: SMS.Types.DeleteAppRequest, callback?: (err: AWSError, data: SMS.Types.DeleteAppResponse) => void): Request<SMS.Types.DeleteAppResponse, AWSError>;
  /**
   * Deletes the specified application. Optionally deletes the launched stack associated with the application and all AWS SMS replication jobs for servers in the application.
   */
  deleteApp(callback?: (err: AWSError, data: SMS.Types.DeleteAppResponse) => void): Request<SMS.Types.DeleteAppResponse, AWSError>;
  /**
   * Deletes the launch configuration for the specified application.
   */
  deleteAppLaunchConfiguration(params: SMS.Types.DeleteAppLaunchConfigurationRequest, callback?: (err: AWSError, data: SMS.Types.DeleteAppLaunchConfigurationResponse) => void): Request<SMS.Types.DeleteAppLaunchConfigurationResponse, AWSError>;
  /**
   * Deletes the launch configuration for the specified application.
   */
  deleteAppLaunchConfiguration(callback?: (err: AWSError, data: SMS.Types.DeleteAppLaunchConfigurationResponse) => void): Request<SMS.Types.DeleteAppLaunchConfigurationResponse, AWSError>;
  /**
   * Deletes the replication configuration for the specified application.
   */
  deleteAppReplicationConfiguration(params: SMS.Types.DeleteAppReplicationConfigurationRequest, callback?: (err: AWSError, data: SMS.Types.DeleteAppReplicationConfigurationResponse) => void): Request<SMS.Types.DeleteAppReplicationConfigurationResponse, AWSError>;
  /**
   * Deletes the replication configuration for the specified application.
   */
  deleteAppReplicationConfiguration(callback?: (err: AWSError, data: SMS.Types.DeleteAppReplicationConfigurationResponse) => void): Request<SMS.Types.DeleteAppReplicationConfigurationResponse, AWSError>;
  /**
   * Deletes the validation configuration for the specified application.
   */
  deleteAppValidationConfiguration(params: SMS.Types.DeleteAppValidationConfigurationRequest, callback?: (err: AWSError, data: SMS.Types.DeleteAppValidationConfigurationResponse) => void): Request<SMS.Types.DeleteAppValidationConfigurationResponse, AWSError>;
  /**
   * Deletes the validation configuration for the specified application.
   */
  deleteAppValidationConfiguration(callback?: (err: AWSError, data: SMS.Types.DeleteAppValidationConfigurationResponse) => void): Request<SMS.Types.DeleteAppValidationConfigurationResponse, AWSError>;
  /**
   * Deletes the specified replication job. After you delete a replication job, there are no further replication runs. AWS deletes the contents of the Amazon S3 bucket used to store AWS SMS artifacts. The AMIs created by the replication runs are not deleted.
   */
  deleteReplicationJob(params: SMS.Types.DeleteReplicationJobRequest, callback?: (err: AWSError, data: SMS.Types.DeleteReplicationJobResponse) => void): Request<SMS.Types.DeleteReplicationJobResponse, AWSError>;
  /**
   * Deletes the specified replication job. After you delete a replication job, there are no further replication runs. AWS deletes the contents of the Amazon S3 bucket used to store AWS SMS artifacts. The AMIs created by the replication runs are not deleted.
   */
  deleteReplicationJob(callback?: (err: AWSError, data: SMS.Types.DeleteReplicationJobResponse) => void): Request<SMS.Types.DeleteReplicationJobResponse, AWSError>;
  /**
   * Deletes all servers from your server catalog.
   */
  deleteServerCatalog(params: SMS.Types.DeleteServerCatalogRequest, callback?: (err: AWSError, data: SMS.Types.DeleteServerCatalogResponse) => void): Request<SMS.Types.DeleteServerCatalogResponse, AWSError>;
  /**
   * Deletes all servers from your server catalog.
   */
  deleteServerCatalog(callback?: (err: AWSError, data: SMS.Types.DeleteServerCatalogResponse) => void): Request<SMS.Types.DeleteServerCatalogResponse, AWSError>;
  /**
   * Disassociates the specified connector from AWS SMS. After you disassociate a connector, it is no longer available to support replication jobs.
   */
  disassociateConnector(params: SMS.Types.DisassociateConnectorRequest, callback?: (err: AWSError, data: SMS.Types.DisassociateConnectorResponse) => void): Request<SMS.Types.DisassociateConnectorResponse, AWSError>;
  /**
   * Disassociates the specified connector from AWS SMS. After you disassociate a connector, it is no longer available to support replication jobs.
   */
  disassociateConnector(callback?: (err: AWSError, data: SMS.Types.DisassociateConnectorResponse) => void): Request<SMS.Types.DisassociateConnectorResponse, AWSError>;
  /**
   * Generates a target change set for a currently launched stack and writes it to an Amazon S3 object in the customer’s Amazon S3 bucket.
   */
  generateChangeSet(params: SMS.Types.GenerateChangeSetRequest, callback?: (err: AWSError, data: SMS.Types.GenerateChangeSetResponse) => void): Request<SMS.Types.GenerateChangeSetResponse, AWSError>;
  /**
   * Generates a target change set for a currently launched stack and writes it to an Amazon S3 object in the customer’s Amazon S3 bucket.
   */
  generateChangeSet(callback?: (err: AWSError, data: SMS.Types.GenerateChangeSetResponse) => void): Request<SMS.Types.GenerateChangeSetResponse, AWSError>;
  /**
   * Generates an AWS CloudFormation template based on the current launch configuration and writes it to an Amazon S3 object in the customer’s Amazon S3 bucket.
   */
  generateTemplate(params: SMS.Types.GenerateTemplateRequest, callback?: (err: AWSError, data: SMS.Types.GenerateTemplateResponse) => void): Request<SMS.Types.GenerateTemplateResponse, AWSError>;
  /**
   * Generates an AWS CloudFormation template based on the current launch configuration and writes it to an Amazon S3 object in the customer’s Amazon S3 bucket.
   */
  generateTemplate(callback?: (err: AWSError, data: SMS.Types.GenerateTemplateResponse) => void): Request<SMS.Types.GenerateTemplateResponse, AWSError>;
  /**
   * Retrieve information about the specified application.
   */
  getApp(params: SMS.Types.GetAppRequest, callback?: (err: AWSError, data: SMS.Types.GetAppResponse) => void): Request<SMS.Types.GetAppResponse, AWSError>;
  /**
   * Retrieve information about the specified application.
   */
  getApp(callback?: (err: AWSError, data: SMS.Types.GetAppResponse) => void): Request<SMS.Types.GetAppResponse, AWSError>;
  /**
   * Retrieves the application launch configuration associated with the specified application.
   */
  getAppLaunchConfiguration(params: SMS.Types.GetAppLaunchConfigurationRequest, callback?: (err: AWSError, data: SMS.Types.GetAppLaunchConfigurationResponse) => void): Request<SMS.Types.GetAppLaunchConfigurationResponse, AWSError>;
  /**
   * Retrieves the application launch configuration associated with the specified application.
   */
  getAppLaunchConfiguration(callback?: (err: AWSError, data: SMS.Types.GetAppLaunchConfigurationResponse) => void): Request<SMS.Types.GetAppLaunchConfigurationResponse, AWSError>;
  /**
   * Retrieves the application replication configuration associated with the specified application.
   */
  getAppReplicationConfiguration(params: SMS.Types.GetAppReplicationConfigurationRequest, callback?: (err: AWSError, data: SMS.Types.GetAppReplicationConfigurationResponse) => void): Request<SMS.Types.GetAppReplicationConfigurationResponse, AWSError>;
  /**
   * Retrieves the application replication configuration associated with the specified application.
   */
  getAppReplicationConfiguration(callback?: (err: AWSError, data: SMS.Types.GetAppReplicationConfigurationResponse) => void): Request<SMS.Types.GetAppReplicationConfigurationResponse, AWSError>;
  /**
   * Retrieves information about a configuration for validating an application.
   */
  getAppValidationConfiguration(params: SMS.Types.GetAppValidationConfigurationRequest, callback?: (err: AWSError, data: SMS.Types.GetAppValidationConfigurationResponse) => void): Request<SMS.Types.GetAppValidationConfigurationResponse, AWSError>;
  /**
   * Retrieves information about a configuration for validating an application.
   */
  getAppValidationConfiguration(callback?: (err: AWSError, data: SMS.Types.GetAppValidationConfigurationResponse) => void): Request<SMS.Types.GetAppValidationConfigurationResponse, AWSError>;
  /**
   * Retrieves output from validating an application.
   */
  getAppValidationOutput(params: SMS.Types.GetAppValidationOutputRequest, callback?: (err: AWSError, data: SMS.Types.GetAppValidationOutputResponse) => void): Request<SMS.Types.GetAppValidationOutputResponse, AWSError>;
  /**
   * Retrieves output from validating an application.
   */
  getAppValidationOutput(callback?: (err: AWSError, data: SMS.Types.GetAppValidationOutputResponse) => void): Request<SMS.Types.GetAppValidationOutputResponse, AWSError>;
  /**
   * Describes the connectors registered with the AWS SMS.
   */
  getConnectors(params: SMS.Types.GetConnectorsRequest, callback?: (err: AWSError, data: SMS.Types.GetConnectorsResponse) => void): Request<SMS.Types.GetConnectorsResponse, AWSError>;
  /**
   * Describes the connectors registered with the AWS SMS.
   */
  getConnectors(callback?: (err: AWSError, data: SMS.Types.GetConnectorsResponse) => void): Request<SMS.Types.GetConnectorsResponse, AWSError>;
  /**
   * Describes the specified replication job or all of your replication jobs.
   */
  getReplicationJobs(params: SMS.Types.GetReplicationJobsRequest, callback?: (err: AWSError, data: SMS.Types.GetReplicationJobsResponse) => void): Request<SMS.Types.GetReplicationJobsResponse, AWSError>;
  /**
   * Describes the specified replication job or all of your replication jobs.
   */
  getReplicationJobs(callback?: (err: AWSError, data: SMS.Types.GetReplicationJobsResponse) => void): Request<SMS.Types.GetReplicationJobsResponse, AWSError>;
  /**
   * Describes the replication runs for the specified replication job.
   */
  getReplicationRuns(params: SMS.Types.GetReplicationRunsRequest, callback?: (err: AWSError, data: SMS.Types.GetReplicationRunsResponse) => void): Request<SMS.Types.GetReplicationRunsResponse, AWSError>;
  /**
   * Describes the replication runs for the specified replication job.
   */
  getReplicationRuns(callback?: (err: AWSError, data: SMS.Types.GetReplicationRunsResponse) => void): Request<SMS.Types.GetReplicationRunsResponse, AWSError>;
  /**
   * Describes the servers in your server catalog. Before you can describe your servers, you must import them using ImportServerCatalog.
   */
  getServers(params: SMS.Types.GetServersRequest, callback?: (err: AWSError, data: SMS.Types.GetServersResponse) => void): Request<SMS.Types.GetServersResponse, AWSError>;
  /**
   * Describes the servers in your server catalog. Before you can describe your servers, you must import them using ImportServerCatalog.
   */
  getServers(callback?: (err: AWSError, data: SMS.Types.GetServersResponse) => void): Request<SMS.Types.GetServersResponse, AWSError>;
  /**
   * Allows application import from AWS Migration Hub.
   */
  importAppCatalog(params: SMS.Types.ImportAppCatalogRequest, callback?: (err: AWSError, data: SMS.Types.ImportAppCatalogResponse) => void): Request<SMS.Types.ImportAppCatalogResponse, AWSError>;
  /**
   * Allows application import from AWS Migration Hub.
   */
  importAppCatalog(callback?: (err: AWSError, data: SMS.Types.ImportAppCatalogResponse) => void): Request<SMS.Types.ImportAppCatalogResponse, AWSError>;
  /**
   * Gathers a complete list of on-premises servers. Connectors must be installed and monitoring all servers to import. This call returns immediately, but might take additional time to retrieve all the servers.
   */
  importServerCatalog(params: SMS.Types.ImportServerCatalogRequest, callback?: (err: AWSError, data: SMS.Types.ImportServerCatalogResponse) => void): Request<SMS.Types.ImportServerCatalogResponse, AWSError>;
  /**
   * Gathers a complete list of on-premises servers. Connectors must be installed and monitoring all servers to import. This call returns immediately, but might take additional time to retrieve all the servers.
   */
  importServerCatalog(callback?: (err: AWSError, data: SMS.Types.ImportServerCatalogResponse) => void): Request<SMS.Types.ImportServerCatalogResponse, AWSError>;
  /**
   * Launches the specified application as a stack in AWS CloudFormation.
   */
  launchApp(params: SMS.Types.LaunchAppRequest, callback?: (err: AWSError, data: SMS.Types.LaunchAppResponse) => void): Request<SMS.Types.LaunchAppResponse, AWSError>;
  /**
   * Launches the specified application as a stack in AWS CloudFormation.
   */
  launchApp(callback?: (err: AWSError, data: SMS.Types.LaunchAppResponse) => void): Request<SMS.Types.LaunchAppResponse, AWSError>;
  /**
   * Retrieves summaries for all applications.
   */
  listApps(params: SMS.Types.ListAppsRequest, callback?: (err: AWSError, data: SMS.Types.ListAppsResponse) => void): Request<SMS.Types.ListAppsResponse, AWSError>;
  /**
   * Retrieves summaries for all applications.
   */
  listApps(callback?: (err: AWSError, data: SMS.Types.ListAppsResponse) => void): Request<SMS.Types.ListAppsResponse, AWSError>;
  /**
   * Provides information to AWS SMS about whether application validation is successful.
   */
  notifyAppValidationOutput(params: SMS.Types.NotifyAppValidationOutputRequest, callback?: (err: AWSError, data: SMS.Types.NotifyAppValidationOutputResponse) => void): Request<SMS.Types.NotifyAppValidationOutputResponse, AWSError>;
  /**
   * Provides information to AWS SMS about whether application validation is successful.
   */
  notifyAppValidationOutput(callback?: (err: AWSError, data: SMS.Types.NotifyAppValidationOutputResponse) => void): Request<SMS.Types.NotifyAppValidationOutputResponse, AWSError>;
  /**
   * Creates or updates the launch configuration for the specified application.
   */
  putAppLaunchConfiguration(params: SMS.Types.PutAppLaunchConfigurationRequest, callback?: (err: AWSError, data: SMS.Types.PutAppLaunchConfigurationResponse) => void): Request<SMS.Types.PutAppLaunchConfigurationResponse, AWSError>;
  /**
   * Creates or updates the launch configuration for the specified application.
   */
  putAppLaunchConfiguration(callback?: (err: AWSError, data: SMS.Types.PutAppLaunchConfigurationResponse) => void): Request<SMS.Types.PutAppLaunchConfigurationResponse, AWSError>;
  /**
   * Creates or updates the replication configuration for the specified application.
   */
  putAppReplicationConfiguration(params: SMS.Types.PutAppReplicationConfigurationRequest, callback?: (err: AWSError, data: SMS.Types.PutAppReplicationConfigurationResponse) => void): Request<SMS.Types.PutAppReplicationConfigurationResponse, AWSError>;
  /**
   * Creates or updates the replication configuration for the specified application.
   */
  putAppReplicationConfiguration(callback?: (err: AWSError, data: SMS.Types.PutAppReplicationConfigurationResponse) => void): Request<SMS.Types.PutAppReplicationConfigurationResponse, AWSError>;
  /**
   * Creates or updates a validation configuration for the specified application.
   */
  putAppValidationConfiguration(params: SMS.Types.PutAppValidationConfigurationRequest, callback?: (err: AWSError, data: SMS.Types.PutAppValidationConfigurationResponse) => void): Request<SMS.Types.PutAppValidationConfigurationResponse, AWSError>;
  /**
   * Creates or updates a validation configuration for the specified application.
   */
  putAppValidationConfiguration(callback?: (err: AWSError, data: SMS.Types.PutAppValidationConfigurationResponse) => void): Request<SMS.Types.PutAppValidationConfigurationResponse, AWSError>;
  /**
   * Starts replicating the specified application by creating replication jobs for each server in the application.
   */
  startAppReplication(params: SMS.Types.StartAppReplicationRequest, callback?: (err: AWSError, data: SMS.Types.StartAppReplicationResponse) => void): Request<SMS.Types.StartAppReplicationResponse, AWSError>;
  /**
   * Starts replicating the specified application by creating replication jobs for each server in the application.
   */
  startAppReplication(callback?: (err: AWSError, data: SMS.Types.StartAppReplicationResponse) => void): Request<SMS.Types.StartAppReplicationResponse, AWSError>;
  /**
   * Starts an on-demand replication run for the specified application.
   */
  startOnDemandAppReplication(params: SMS.Types.StartOnDemandAppReplicationRequest, callback?: (err: AWSError, data: SMS.Types.StartOnDemandAppReplicationResponse) => void): Request<SMS.Types.StartOnDemandAppReplicationResponse, AWSError>;
  /**
   * Starts an on-demand replication run for the specified application.
   */
  startOnDemandAppReplication(callback?: (err: AWSError, data: SMS.Types.StartOnDemandAppReplicationResponse) => void): Request<SMS.Types.StartOnDemandAppReplicationResponse, AWSError>;
  /**
   * Starts an on-demand replication run for the specified replication job. This replication run starts immediately. This replication run is in addition to the ones already scheduled. There is a limit on the number of on-demand replications runs that you can request in a 24-hour period.
   */
  startOnDemandReplicationRun(params: SMS.Types.StartOnDemandReplicationRunRequest, callback?: (err: AWSError, data: SMS.Types.StartOnDemandReplicationRunResponse) => void): Request<SMS.Types.StartOnDemandReplicationRunResponse, AWSError>;
  /**
   * Starts an on-demand replication run for the specified replication job. This replication run starts immediately. This replication run is in addition to the ones already scheduled. There is a limit on the number of on-demand replications runs that you can request in a 24-hour period.
   */
  startOnDemandReplicationRun(callback?: (err: AWSError, data: SMS.Types.StartOnDemandReplicationRunResponse) => void): Request<SMS.Types.StartOnDemandReplicationRunResponse, AWSError>;
  /**
   * Stops replicating the specified application by deleting the replication job for each server in the application.
   */
  stopAppReplication(params: SMS.Types.StopAppReplicationRequest, callback?: (err: AWSError, data: SMS.Types.StopAppReplicationResponse) => void): Request<SMS.Types.StopAppReplicationResponse, AWSError>;
  /**
   * Stops replicating the specified application by deleting the replication job for each server in the application.
   */
  stopAppReplication(callback?: (err: AWSError, data: SMS.Types.StopAppReplicationResponse) => void): Request<SMS.Types.StopAppReplicationResponse, AWSError>;
  /**
   * Terminates the stack for the specified application.
   */
  terminateApp(params: SMS.Types.TerminateAppRequest, callback?: (err: AWSError, data: SMS.Types.TerminateAppResponse) => void): Request<SMS.Types.TerminateAppResponse, AWSError>;
  /**
   * Terminates the stack for the specified application.
   */
  terminateApp(callback?: (err: AWSError, data: SMS.Types.TerminateAppResponse) => void): Request<SMS.Types.TerminateAppResponse, AWSError>;
  /**
   * Updates the specified application.
   */
  updateApp(params: SMS.Types.UpdateAppRequest, callback?: (err: AWSError, data: SMS.Types.UpdateAppResponse) => void): Request<SMS.Types.UpdateAppResponse, AWSError>;
  /**
   * Updates the specified application.
   */
  updateApp(callback?: (err: AWSError, data: SMS.Types.UpdateAppResponse) => void): Request<SMS.Types.UpdateAppResponse, AWSError>;
  /**
   * Updates the specified settings for the specified replication job.
   */
  updateReplicationJob(params: SMS.Types.UpdateReplicationJobRequest, callback?: (err: AWSError, data: SMS.Types.UpdateReplicationJobResponse) => void): Request<SMS.Types.UpdateReplicationJobResponse, AWSError>;
  /**
   * Updates the specified settings for the specified replication job.
   */
  updateReplicationJob(callback?: (err: AWSError, data: SMS.Types.UpdateReplicationJobResponse) => void): Request<SMS.Types.UpdateReplicationJobResponse, AWSError>;
}
declare namespace SMS {
  export type AmiId = string;
  export type AppDescription = string;
  export type AppId = string;
  export type AppIdWithValidation = string;
  export type AppIds = AppId[];
  export type AppLaunchConfigurationStatus = "NOT_CONFIGURED"|"CONFIGURED"|string;
  export type AppLaunchStatus = "READY_FOR_CONFIGURATION"|"CONFIGURATION_IN_PROGRESS"|"CONFIGURATION_INVALID"|"READY_FOR_LAUNCH"|"VALIDATION_IN_PROGRESS"|"LAUNCH_PENDING"|"LAUNCH_IN_PROGRESS"|"LAUNCHED"|"PARTIALLY_LAUNCHED"|"DELTA_LAUNCH_IN_PROGRESS"|"DELTA_LAUNCH_FAILED"|"LAUNCH_FAILED"|"TERMINATE_IN_PROGRESS"|"TERMINATE_FAILED"|"TERMINATED"|string;
  export type AppLaunchStatusMessage = string;
  export type AppName = string;
  export type AppReplicationConfigurationStatus = "NOT_CONFIGURED"|"CONFIGURED"|string;
  export type AppReplicationStatus = "READY_FOR_CONFIGURATION"|"CONFIGURATION_IN_PROGRESS"|"CONFIGURATION_INVALID"|"READY_FOR_REPLICATION"|"VALIDATION_IN_PROGRESS"|"REPLICATION_PENDING"|"REPLICATION_IN_PROGRESS"|"REPLICATED"|"PARTIALLY_REPLICATED"|"DELTA_REPLICATION_IN_PROGRESS"|"DELTA_REPLICATED"|"DELTA_REPLICATION_FAILED"|"REPLICATION_FAILED"|"REPLICATION_STOPPING"|"REPLICATION_STOP_FAILED"|"REPLICATION_STOPPED"|string;
  export type AppReplicationStatusMessage = string;
  export type AppStatus = "CREATING"|"ACTIVE"|"UPDATING"|"DELETING"|"DELETED"|"DELETE_FAILED"|string;
  export type AppStatusMessage = string;
  export interface AppSummary {
    /**
     * The unique ID of the application.
     */
    appId?: AppId;
    /**
     * The ID of the application.
     */
    importedAppId?: ImportedAppId;
    /**
     * The name of the application.
     */
    name?: AppName;
    /**
     * The description of the application.
     */
    description?: AppDescription;
    /**
     * Status of the application.
     */
    status?: AppStatus;
    /**
     * A message related to the status of the application
     */
    statusMessage?: AppStatusMessage;
    /**
     * Status of the replication configuration.
     */
    replicationConfigurationStatus?: AppReplicationConfigurationStatus;
    /**
     * The replication status of the application.
     */
    replicationStatus?: AppReplicationStatus;
    /**
     * A message related to the replication status of the application.
     */
    replicationStatusMessage?: AppReplicationStatusMessage;
    /**
     * The timestamp of the application's most recent successful replication.
     */
    latestReplicationTime?: Timestamp;
    /**
     * Status of the launch configuration.
     */
    launchConfigurationStatus?: AppLaunchConfigurationStatus;
    /**
     * The launch status of the application.
     */
    launchStatus?: AppLaunchStatus;
    /**
     * A message related to the launch status of the application.
     */
    launchStatusMessage?: AppLaunchStatusMessage;
    /**
     * Details about the latest launch of the application.
     */
    launchDetails?: LaunchDetails;
    /**
     * The creation time of the application.
     */
    creationTime?: Timestamp;
    /**
     * The last modified time of the application.
     */
    lastModified?: Timestamp;
    /**
     * The name of the service role in the customer's account used by AWS SMS.
     */
    roleName?: RoleName;
    /**
     * The number of server groups present in the application.
     */
    totalServerGroups?: TotalServerGroups;
    /**
     * The number of servers present in the application.
     */
    totalServers?: TotalServers;
  }
  export interface AppValidationConfiguration {
    /**
     * The ID of the validation.
     */
    validationId?: ValidationId;
    /**
     * The name of the configuration.
     */
    name?: NonEmptyStringWithMaxLen255;
    /**
     * The validation strategy.
     */
    appValidationStrategy?: AppValidationStrategy;
    /**
     * The validation parameters.
     */
    ssmValidationParameters?: SSMValidationParameters;
  }
  export type AppValidationConfigurations = AppValidationConfiguration[];
  export interface AppValidationOutput {
    /**
     * Output from using SSM to validate the application.
     */
    ssmOutput?: SSMOutput;
  }
  export type AppValidationStrategy = "SSM"|string;
  export type Apps = AppSummary[];
  export type AssociatePublicIpAddress = boolean;
  export type AutoLaunch = boolean;
  export type BucketName = string;
  export type ClientToken = string;
  export type Command = string;
  export interface Connector {
    /**
     * The ID of the connector.
     */
    connectorId?: ConnectorId;
    /**
     * The connector version.
     */
    version?: ConnectorVersion;
    /**
     * The status of the connector.
     */
    status?: ConnectorStatus;
    /**
     * The capabilities of the connector.
     */
    capabilityList?: ConnectorCapabilityList;
    /**
     * The name of the VM manager.
     */
    vmManagerName?: VmManagerName;
    /**
     * The VM management product.
     */
    vmManagerType?: VmManagerType;
    /**
     * The ID of the VM manager.
     */
    vmManagerId?: VmManagerId;
    /**
     * The IP address of the connector.
     */
    ipAddress?: IpAddress;
    /**
     * The MAC address of the connector.
     */
    macAddress?: MacAddress;
    /**
     * The time the connector was associated.
     */
    associatedOn?: Timestamp;
  }
  export type ConnectorCapability = "VSPHERE"|"SCVMM"|"HYPERV-MANAGER"|"SNAPSHOT_BATCHING"|"SMS_OPTIMIZED"|string;
  export type ConnectorCapabilityList = ConnectorCapability[];
  export type ConnectorId = string;
  export type ConnectorList = Connector[];
  export type ConnectorStatus = "HEALTHY"|"UNHEALTHY"|string;
  export type ConnectorVersion = string;
  export interface CreateAppRequest {
    /**
     * The name of the new application.
     */
    name?: AppName;
    /**
     * The description of the new application
     */
    description?: AppDescription;
    /**
     * The name of the service role in the customer's account to be used by AWS SMS.
     */
    roleName?: RoleName;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of application creation.
     */
    clientToken?: ClientToken;
    /**
     * The server groups to include in the application.
     */
    serverGroups?: ServerGroups;
    /**
     * The tags to be associated with the application.
     */
    tags?: Tags;
  }
  export interface CreateAppResponse {
    /**
     * A summary description of the application.
     */
    appSummary?: AppSummary;
    /**
     * The server groups included in the application.
     */
    serverGroups?: ServerGroups;
    /**
     * The tags associated with the application.
     */
    tags?: Tags;
  }
  export interface CreateReplicationJobRequest {
    /**
     * The ID of the server.
     */
    serverId: ServerId;
    /**
     * The seed replication time.
     */
    seedReplicationTime: Timestamp;
    /**
     * The time between consecutive replication runs, in hours.
     */
    frequency?: Frequency;
    /**
     * Indicates whether to run the replication job one time.
     */
    runOnce?: RunOnce;
    /**
     * The license type to be used for the AMI created by a successful replication run.
     */
    licenseType?: LicenseType;
    /**
     * The name of the IAM role to be used by the AWS SMS.
     */
    roleName?: RoleName;
    /**
     * The description of the replication job.
     */
    description?: Description;
    /**
     * The maximum number of SMS-created AMIs to retain. The oldest is deleted after the maximum number is reached and a new AMI is created.
     */
    numberOfRecentAmisToKeep?: NumberOfRecentAmisToKeep;
    /**
     * Indicates whether the replication job produces encrypted AMIs.
     */
    encrypted?: Encrypted;
    /**
     * The ID of the KMS key for replication jobs that produce encrypted AMIs. This value can be any of the following:   KMS key ID   KMS key alias   ARN referring to the KMS key ID   ARN referring to the KMS key alias    If encrypted is true but a KMS key ID is not specified, the customer's default KMS key for Amazon EBS is used. 
     */
    kmsKeyId?: KmsKeyId;
  }
  export interface CreateReplicationJobResponse {
    /**
     * The unique identifier of the replication job.
     */
    replicationJobId?: ReplicationJobId;
  }
  export interface DeleteAppLaunchConfigurationRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
  }
  export interface DeleteAppLaunchConfigurationResponse {
  }
  export interface DeleteAppReplicationConfigurationRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
  }
  export interface DeleteAppReplicationConfigurationResponse {
  }
  export interface DeleteAppRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
    /**
     * Indicates whether to stop all replication jobs corresponding to the servers in the application while deleting the application.
     */
    forceStopAppReplication?: ForceStopAppReplication;
    /**
     * Indicates whether to terminate the stack corresponding to the application while deleting the application.
     */
    forceTerminateApp?: ForceTerminateApp;
  }
  export interface DeleteAppResponse {
  }
  export interface DeleteAppValidationConfigurationRequest {
    /**
     * The ID of the application.
     */
    appId: AppIdWithValidation;
  }
  export interface DeleteAppValidationConfigurationResponse {
  }
  export interface DeleteReplicationJobRequest {
    /**
     * The ID of the replication job.
     */
    replicationJobId: ReplicationJobId;
  }
  export interface DeleteReplicationJobResponse {
  }
  export interface DeleteServerCatalogRequest {
  }
  export interface DeleteServerCatalogResponse {
  }
  export type Description = string;
  export interface DisassociateConnectorRequest {
    /**
     * The ID of the connector.
     */
    connectorId: ConnectorId;
  }
  export interface DisassociateConnectorResponse {
  }
  export type EC2KeyName = string;
  export type Encrypted = boolean;
  export type ExecutionTimeoutSeconds = number;
  export type ForceStopAppReplication = boolean;
  export type ForceTerminateApp = boolean;
  export type Frequency = number;
  export interface GenerateChangeSetRequest {
    /**
     * The ID of the application associated with the change set.
     */
    appId?: AppId;
    /**
     * The format for the change set.
     */
    changesetFormat?: OutputFormat;
  }
  export interface GenerateChangeSetResponse {
    /**
     * The location of the Amazon S3 object.
     */
    s3Location?: S3Location;
  }
  export interface GenerateTemplateRequest {
    /**
     * The ID of the application associated with the AWS CloudFormation template.
     */
    appId?: AppId;
    /**
     * The format for generating the AWS CloudFormation template.
     */
    templateFormat?: OutputFormat;
  }
  export interface GenerateTemplateResponse {
    /**
     * The location of the Amazon S3 object.
     */
    s3Location?: S3Location;
  }
  export interface GetAppLaunchConfigurationRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
  }
  export interface GetAppLaunchConfigurationResponse {
    /**
     * The ID of the application.
     */
    appId?: AppId;
    /**
     * The name of the service role in the customer's account that AWS CloudFormation uses to launch the application.
     */
    roleName?: RoleName;
    /**
     * Indicates whether the application is configured to launch automatically after replication is complete.
     */
    autoLaunch?: AutoLaunch;
    /**
     * The launch configurations for server groups in this application.
     */
    serverGroupLaunchConfigurations?: ServerGroupLaunchConfigurations;
  }
  export interface GetAppReplicationConfigurationRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
  }
  export interface GetAppReplicationConfigurationResponse {
    /**
     * The replication configurations associated with server groups in this application.
     */
    serverGroupReplicationConfigurations?: ServerGroupReplicationConfigurations;
  }
  export interface GetAppRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
  }
  export interface GetAppResponse {
    /**
     * Information about the application.
     */
    appSummary?: AppSummary;
    /**
     * The server groups that belong to the application.
     */
    serverGroups?: ServerGroups;
    /**
     * The tags associated with the application.
     */
    tags?: Tags;
  }
  export interface GetAppValidationConfigurationRequest {
    /**
     * The ID of the application.
     */
    appId: AppIdWithValidation;
  }
  export interface GetAppValidationConfigurationResponse {
    /**
     * The configuration for application validation.
     */
    appValidationConfigurations?: AppValidationConfigurations;
    /**
     * The configuration for instance validation.
     */
    serverGroupValidationConfigurations?: ServerGroupValidationConfigurations;
  }
  export interface GetAppValidationOutputRequest {
    /**
     * The ID of the application.
     */
    appId: AppIdWithValidation;
  }
  export interface GetAppValidationOutputResponse {
    /**
     * The validation output.
     */
    validationOutputList?: ValidationOutputList;
  }
  export interface GetConnectorsRequest {
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in a single call. The default value is 50. To retrieve the remaining results, make another call with the returned NextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface GetConnectorsResponse {
    /**
     * Information about the registered connectors.
     */
    connectorList?: ConnectorList;
    /**
     * The token required to retrieve the next set of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface GetReplicationJobsRequest {
    /**
     * The ID of the replication job.
     */
    replicationJobId?: ReplicationJobId;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in a single call. The default value is 50. To retrieve the remaining results, make another call with the returned NextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface GetReplicationJobsResponse {
    /**
     * Information about the replication jobs.
     */
    replicationJobList?: ReplicationJobList;
    /**
     * The token required to retrieve the next set of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface GetReplicationRunsRequest {
    /**
     * The ID of the replication job.
     */
    replicationJobId: ReplicationJobId;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in a single call. The default value is 50. To retrieve the remaining results, make another call with the returned NextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface GetReplicationRunsResponse {
    /**
     * Information about the replication job.
     */
    replicationJob?: ReplicationJob;
    /**
     * Information about the replication runs.
     */
    replicationRunList?: ReplicationRunList;
    /**
     * The token required to retrieve the next set of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface GetServersRequest {
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in a single call. The default value is 50. To retrieve the remaining results, make another call with the returned NextToken value.
     */
    maxResults?: MaxResults;
    /**
     * The server addresses.
     */
    vmServerAddressList?: VmServerAddressList;
  }
  export interface GetServersResponse {
    /**
     * The time when the server was last modified.
     */
    lastModifiedOn?: Timestamp;
    /**
     * The status of the server catalog.
     */
    serverCatalogStatus?: ServerCatalogStatus;
    /**
     * Information about the servers.
     */
    serverList?: ServerList;
    /**
     * The token required to retrieve the next set of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface ImportAppCatalogRequest {
    /**
     * The name of the service role. If you omit this parameter, we create a service-linked role for AWS Migration Hub in your account. Otherwise, the role that you provide must have the policy and trust policy described in the AWS Migration Hub User Guide.
     */
    roleName?: RoleName;
  }
  export interface ImportAppCatalogResponse {
  }
  export interface ImportServerCatalogRequest {
  }
  export interface ImportServerCatalogResponse {
  }
  export type ImportedAppId = string;
  export type InstanceId = string;
  export type InstanceType = string;
  export type IpAddress = string;
  export type KmsKeyId = string;
  export interface LaunchAppRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
  }
  export interface LaunchAppResponse {
  }
  export interface LaunchDetails {
    /**
     * The latest time that this application was launched successfully.
     */
    latestLaunchTime?: Timestamp;
    /**
     * The name of the latest stack launched for this application.
     */
    stackName?: StackName;
    /**
     * The ID of the latest stack launched for this application.
     */
    stackId?: StackId;
  }
  export type LaunchOrder = number;
  export type LicenseType = "AWS"|"BYOL"|string;
  export interface ListAppsRequest {
    /**
     * The unique application IDs.
     */
    appIds?: AppIds;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in a single call. The default value is 100. To retrieve the remaining results, make another call with the returned NextToken value. 
     */
    maxResults?: MaxResults;
  }
  export interface ListAppsResponse {
    /**
     * The application summaries.
     */
    apps?: Apps;
    /**
     * The token required to retrieve the next set of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export type LogicalId = string;
  export type MacAddress = string;
  export type MaxResults = number;
  export type NextToken = string;
  export type NonEmptyStringWithMaxLen255 = string;
  export interface NotificationContext {
    /**
     * The ID of the validation.
     */
    validationId?: ValidationId;
    /**
     * The status of the validation.
     */
    status?: ValidationStatus;
    /**
     * The status message.
     */
    statusMessage?: ValidationStatusMessage;
  }
  export interface NotifyAppValidationOutputRequest {
    /**
     * The ID of the application.
     */
    appId: AppIdWithValidation;
    /**
     * The notification information.
     */
    notificationContext?: NotificationContext;
  }
  export interface NotifyAppValidationOutputResponse {
  }
  export type NumberOfRecentAmisToKeep = number;
  export type OutputFormat = "JSON"|"YAML"|string;
  export interface PutAppLaunchConfigurationRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
    /**
     * The name of service role in the customer's account that AWS CloudFormation uses to launch the application.
     */
    roleName?: RoleName;
    /**
     * Indicates whether the application is configured to launch automatically after replication is complete.
     */
    autoLaunch?: AutoLaunch;
    /**
     * Information about the launch configurations for server groups in the application.
     */
    serverGroupLaunchConfigurations?: ServerGroupLaunchConfigurations;
  }
  export interface PutAppLaunchConfigurationResponse {
  }
  export interface PutAppReplicationConfigurationRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
    /**
     * Information about the replication configurations for server groups in the application.
     */
    serverGroupReplicationConfigurations?: ServerGroupReplicationConfigurations;
  }
  export interface PutAppReplicationConfigurationResponse {
  }
  export interface PutAppValidationConfigurationRequest {
    /**
     * The ID of the application.
     */
    appId: AppIdWithValidation;
    /**
     * The configuration for application validation.
     */
    appValidationConfigurations?: AppValidationConfigurations;
    /**
     * The configuration for instance validation.
     */
    serverGroupValidationConfigurations?: ServerGroupValidationConfigurations;
  }
  export interface PutAppValidationConfigurationResponse {
  }
  export interface ReplicationJob {
    /**
     * The ID of the replication job.
     */
    replicationJobId?: ReplicationJobId;
    /**
     * The ID of the server.
     */
    serverId?: ServerId;
    /**
     * The type of server.
     */
    serverType?: ServerType;
    /**
     * Information about the VM server.
     */
    vmServer?: VmServer;
    /**
     * The seed replication time.
     */
    seedReplicationTime?: Timestamp;
    /**
     * The time between consecutive replication runs, in hours.
     */
    frequency?: Frequency;
    /**
     * Indicates whether to run the replication job one time.
     */
    runOnce?: RunOnce;
    /**
     * The start time of the next replication run.
     */
    nextReplicationRunStartTime?: Timestamp;
    /**
     * The license type to be used for the AMI created by a successful replication run.
     */
    licenseType?: LicenseType;
    /**
     * The name of the IAM role to be used by AWS SMS.
     */
    roleName?: RoleName;
    /**
     * The ID of the latest Amazon Machine Image (AMI).
     */
    latestAmiId?: AmiId;
    /**
     * The state of the replication job.
     */
    state?: ReplicationJobState;
    /**
     * The description of the current status of the replication job.
     */
    statusMessage?: ReplicationJobStatusMessage;
    /**
     * The description of the replication job.
     */
    description?: Description;
    /**
     * The number of recent AMIs to keep in the customer's account for a replication job. By default, the value is set to zero, meaning that all AMIs are kept.
     */
    numberOfRecentAmisToKeep?: NumberOfRecentAmisToKeep;
    /**
     * Indicates whether the replication job should produce encrypted AMIs.
     */
    encrypted?: Encrypted;
    /**
     * The ID of the KMS key for replication jobs that produce encrypted AMIs. This value can be any of the following:    KMS key ID   KMS key alias   ARN referring to the KMS key ID   ARN referring to the KMS key alias   If encrypted is enabled but a KMS key ID is not specified, the customer's default KMS key for Amazon EBS is used.
     */
    kmsKeyId?: KmsKeyId;
    /**
     * Information about the replication runs.
     */
    replicationRunList?: ReplicationRunList;
  }
  export type ReplicationJobId = string;
  export type ReplicationJobList = ReplicationJob[];
  export type ReplicationJobState = "PENDING"|"ACTIVE"|"FAILED"|"DELETING"|"DELETED"|"COMPLETED"|"PAUSED_ON_FAILURE"|"FAILING"|string;
  export type ReplicationJobStatusMessage = string;
  export type ReplicationJobTerminated = boolean;
  export interface ReplicationRun {
    /**
     * The ID of the replication run.
     */
    replicationRunId?: ReplicationRunId;
    /**
     * The state of the replication run.
     */
    state?: ReplicationRunState;
    /**
     * The type of replication run.
     */
    type?: ReplicationRunType;
    /**
     * Details about the current stage of the replication run.
     */
    stageDetails?: ReplicationRunStageDetails;
    /**
     * The description of the current status of the replication job.
     */
    statusMessage?: ReplicationRunStatusMessage;
    /**
     * The ID of the Amazon Machine Image (AMI) from the replication run.
     */
    amiId?: AmiId;
    /**
     * The start time of the next replication run.
     */
    scheduledStartTime?: Timestamp;
    /**
     * The completion time of the last replication run.
     */
    completedTime?: Timestamp;
    /**
     * The description of the replication run.
     */
    description?: Description;
    /**
     * Indicates whether the replication run should produce an encrypted AMI.
     */
    encrypted?: Encrypted;
    /**
     * The ID of the KMS key for replication jobs that produce encrypted AMIs. This value can be any of the following:   KMS key ID   KMS key alias   ARN referring to the KMS key ID   ARN referring to the KMS key alias    If encrypted is true but a KMS key ID is not specified, the customer's default KMS key for Amazon EBS is used. 
     */
    kmsKeyId?: KmsKeyId;
  }
  export type ReplicationRunId = string;
  export type ReplicationRunList = ReplicationRun[];
  export type ReplicationRunStage = string;
  export interface ReplicationRunStageDetails {
    /**
     * The current stage of a replication run.
     */
    stage?: ReplicationRunStage;
    /**
     * The progress of the current stage of a replication run.
     */
    stageProgress?: ReplicationRunStageProgress;
  }
  export type ReplicationRunStageProgress = string;
  export type ReplicationRunState = "PENDING"|"MISSED"|"ACTIVE"|"FAILED"|"COMPLETED"|"DELETING"|"DELETED"|string;
  export type ReplicationRunStatusMessage = string;
  export type ReplicationRunType = "ON_DEMAND"|"AUTOMATIC"|string;
  export type RoleName = string;
  export type RunOnce = boolean;
  export type S3BucketName = string;
  export type S3KeyName = string;
  export interface S3Location {
    /**
     * The Amazon S3 bucket name.
     */
    bucket?: S3BucketName;
    /**
     * The Amazon S3 bucket key.
     */
    key?: S3KeyName;
  }
  export interface SSMOutput {
    s3Location?: S3Location;
  }
  export interface SSMValidationParameters {
    /**
     * The location of the validation script.
     */
    source?: Source;
    /**
     * The ID of the instance. The instance must have the following tag: UserForSMSApplicationValidation=true.
     */
    instanceId?: InstanceId;
    /**
     * The type of validation script.
     */
    scriptType?: ScriptType;
    /**
     * The command to run the validation script
     */
    command?: Command;
    /**
     * The timeout interval, in seconds.
     */
    executionTimeoutSeconds?: ExecutionTimeoutSeconds;
    /**
     * The name of the S3 bucket for output.
     */
    outputS3BucketName?: BucketName;
  }
  export type ScriptType = "SHELL_SCRIPT"|"POWERSHELL_SCRIPT"|string;
  export type SecurityGroup = string;
  export interface Server {
    /**
     * The ID of the server.
     */
    serverId?: ServerId;
    /**
     * The type of server.
     */
    serverType?: ServerType;
    /**
     * Information about the VM server.
     */
    vmServer?: VmServer;
    /**
     * The ID of the replication job.
     */
    replicationJobId?: ReplicationJobId;
    /**
     * Indicates whether the replication job is deleted or failed.
     */
    replicationJobTerminated?: ReplicationJobTerminated;
  }
  export type ServerCatalogStatus = "NOT_IMPORTED"|"IMPORTING"|"AVAILABLE"|"DELETED"|"EXPIRED"|string;
  export interface ServerGroup {
    /**
     * The ID of a server group.
     */
    serverGroupId?: ServerGroupId;
    /**
     * The name of a server group.
     */
    name?: ServerGroupName;
    /**
     * The servers that belong to a server group.
     */
    serverList?: ServerList;
  }
  export type ServerGroupId = string;
  export interface ServerGroupLaunchConfiguration {
    /**
     * The ID of the server group with which the launch configuration is associated.
     */
    serverGroupId?: ServerGroupId;
    /**
     * The launch order of servers in the server group.
     */
    launchOrder?: LaunchOrder;
    /**
     * The launch configuration for servers in the server group.
     */
    serverLaunchConfigurations?: ServerLaunchConfigurations;
  }
  export type ServerGroupLaunchConfigurations = ServerGroupLaunchConfiguration[];
  export type ServerGroupName = string;
  export interface ServerGroupReplicationConfiguration {
    /**
     * The ID of the server group with which this replication configuration is associated.
     */
    serverGroupId?: ServerGroupId;
    /**
     * The replication configuration for servers in the server group.
     */
    serverReplicationConfigurations?: ServerReplicationConfigurations;
  }
  export type ServerGroupReplicationConfigurations = ServerGroupReplicationConfiguration[];
  export interface ServerGroupValidationConfiguration {
    /**
     * The ID of the server group.
     */
    serverGroupId?: ServerGroupId;
    /**
     * The validation configuration.
     */
    serverValidationConfigurations?: ServerValidationConfigurations;
  }
  export type ServerGroupValidationConfigurations = ServerGroupValidationConfiguration[];
  export type ServerGroups = ServerGroup[];
  export type ServerId = string;
  export interface ServerLaunchConfiguration {
    /**
     * The ID of the server with which the launch configuration is associated.
     */
    server?: Server;
    /**
     * The logical ID of the server in the AWS CloudFormation template.
     */
    logicalId?: LogicalId;
    /**
     * The ID of the VPC into which the server should be launched.
     */
    vpc?: VPC;
    /**
     * The ID of the subnet the server should be launched into.
     */
    subnet?: Subnet;
    /**
     * The ID of the security group that applies to the launched server.
     */
    securityGroup?: SecurityGroup;
    /**
     * The name of the Amazon EC2 SSH key to be used for connecting to the launched server.
     */
    ec2KeyName?: EC2KeyName;
    /**
     * Location of the user-data script to be executed when launching the server.
     */
    userData?: UserData;
    /**
     * The instance type to use when launching the server.
     */
    instanceType?: InstanceType;
    /**
     * Indicates whether a publicly accessible IP address is created when launching the server.
     */
    associatePublicIpAddress?: AssociatePublicIpAddress;
    /**
     * The name of the IAM instance profile.
     */
    iamInstanceProfileName?: RoleName;
    configureScript?: S3Location;
    /**
     * The type of configuration script.
     */
    configureScriptType?: ScriptType;
  }
  export type ServerLaunchConfigurations = ServerLaunchConfiguration[];
  export type ServerList = Server[];
  export interface ServerReplicationConfiguration {
    /**
     * The ID of the server with which this replication configuration is associated.
     */
    server?: Server;
    /**
     * The parameters for replicating the server.
     */
    serverReplicationParameters?: ServerReplicationParameters;
  }
  export type ServerReplicationConfigurations = ServerReplicationConfiguration[];
  export interface ServerReplicationParameters {
    /**
     * The seed time for creating a replication job for the server.
     */
    seedTime?: Timestamp;
    /**
     * The frequency of creating replication jobs for the server.
     */
    frequency?: Frequency;
    /**
     * Indicates whether to run the replication job one time.
     */
    runOnce?: RunOnce;
    /**
     * The license type for creating a replication job for the server.
     */
    licenseType?: LicenseType;
    /**
     * The number of recent AMIs to keep when creating a replication job for this server.
     */
    numberOfRecentAmisToKeep?: NumberOfRecentAmisToKeep;
    /**
     * Indicates whether the replication job produces encrypted AMIs.
     */
    encrypted?: Encrypted;
    /**
     * The ID of the KMS key for replication jobs that produce encrypted AMIs. This value can be any of the following:   KMS key ID   KMS key alias   ARN referring to the KMS key ID   ARN referring to the KMS key alias   If encrypted is enabled but a KMS key ID is not specified, the customer's default KMS key for Amazon EBS is used.
     */
    kmsKeyId?: KmsKeyId;
  }
  export type ServerType = "VIRTUAL_MACHINE"|string;
  export interface ServerValidationConfiguration {
    server?: Server;
    /**
     * The ID of the validation.
     */
    validationId?: ValidationId;
    /**
     * The name of the configuration.
     */
    name?: NonEmptyStringWithMaxLen255;
    /**
     * The validation strategy.
     */
    serverValidationStrategy?: ServerValidationStrategy;
    /**
     * The validation parameters.
     */
    userDataValidationParameters?: UserDataValidationParameters;
  }
  export type ServerValidationConfigurations = ServerValidationConfiguration[];
  export interface ServerValidationOutput {
    server?: Server;
  }
  export type ServerValidationStrategy = "USERDATA"|string;
  export interface Source {
    s3Location?: S3Location;
  }
  export type StackId = string;
  export type StackName = string;
  export interface StartAppReplicationRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
  }
  export interface StartAppReplicationResponse {
  }
  export interface StartOnDemandAppReplicationRequest {
    /**
     * The ID of the application.
     */
    appId: AppId;
    /**
     * The description of the replication run.
     */
    description?: Description;
  }
  export interface StartOnDemandAppReplicationResponse {
  }
  export interface StartOnDemandReplicationRunRequest {
    /**
     * The ID of the replication job.
     */
    replicationJobId: ReplicationJobId;
    /**
     * The description of the replication run.
     */
    description?: Description;
  }
  export interface StartOnDemandReplicationRunResponse {
    /**
     * The ID of the replication run.
     */
    replicationRunId?: ReplicationRunId;
  }
  export interface StopAppReplicationRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
  }
  export interface StopAppReplicationResponse {
  }
  export type Subnet = string;
  export interface Tag {
    /**
     * The tag key.
     */
    key?: TagKey;
    /**
     * The tag value.
     */
    value?: TagValue;
  }
  export type TagKey = string;
  export type TagValue = string;
  export type Tags = Tag[];
  export interface TerminateAppRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
  }
  export interface TerminateAppResponse {
  }
  export type Timestamp = Date;
  export type TotalServerGroups = number;
  export type TotalServers = number;
  export interface UpdateAppRequest {
    /**
     * The ID of the application.
     */
    appId?: AppId;
    /**
     * The new name of the application.
     */
    name?: AppName;
    /**
     * The new description of the application.
     */
    description?: AppDescription;
    /**
     * The name of the service role in the customer's account used by AWS SMS.
     */
    roleName?: RoleName;
    /**
     * The server groups in the application to update.
     */
    serverGroups?: ServerGroups;
    /**
     * The tags to associate with the application.
     */
    tags?: Tags;
  }
  export interface UpdateAppResponse {
    /**
     * A summary description of the application.
     */
    appSummary?: AppSummary;
    /**
     * The updated server groups in the application.
     */
    serverGroups?: ServerGroups;
    /**
     * The tags associated with the application.
     */
    tags?: Tags;
  }
  export interface UpdateReplicationJobRequest {
    /**
     * The ID of the replication job.
     */
    replicationJobId: ReplicationJobId;
    /**
     * The time between consecutive replication runs, in hours.
     */
    frequency?: Frequency;
    /**
     * The start time of the next replication run.
     */
    nextReplicationRunStartTime?: Timestamp;
    /**
     * The license type to be used for the AMI created by a successful replication run.
     */
    licenseType?: LicenseType;
    /**
     * The name of the IAM role to be used by AWS SMS.
     */
    roleName?: RoleName;
    /**
     * The description of the replication job.
     */
    description?: Description;
    /**
     * The maximum number of SMS-created AMIs to retain. The oldest is deleted after the maximum number is reached and a new AMI is created.
     */
    numberOfRecentAmisToKeep?: NumberOfRecentAmisToKeep;
    /**
     * When true, the replication job produces encrypted AMIs. For more information, KmsKeyId.
     */
    encrypted?: Encrypted;
    /**
     * The ID of the KMS key for replication jobs that produce encrypted AMIs. This value can be any of the following:   KMS key ID   KMS key alias   ARN referring to the KMS key ID   ARN referring to the KMS key alias   If encrypted is enabled but a KMS key ID is not specified, the customer's default KMS key for Amazon EBS is used.
     */
    kmsKeyId?: KmsKeyId;
  }
  export interface UpdateReplicationJobResponse {
  }
  export interface UserData {
    /**
     * Amazon S3 location of the user-data script.
     */
    s3Location?: S3Location;
  }
  export interface UserDataValidationParameters {
    /**
     * The location of the validation script.
     */
    source?: Source;
    /**
     * The type of validation script.
     */
    scriptType?: ScriptType;
  }
  export type VPC = string;
  export type ValidationId = string;
  export interface ValidationOutput {
    /**
     * The ID of the validation.
     */
    validationId?: ValidationId;
    /**
     * The name of the validation.
     */
    name?: NonEmptyStringWithMaxLen255;
    /**
     * The status of the validation.
     */
    status?: ValidationStatus;
    /**
     * The status message.
     */
    statusMessage?: ValidationStatusMessage;
    /**
     * The latest time that the validation was performed.
     */
    latestValidationTime?: Timestamp;
    /**
     * The output from validating an application.
     */
    appValidationOutput?: AppValidationOutput;
    /**
     * The output from validation an instance.
     */
    serverValidationOutput?: ServerValidationOutput;
  }
  export type ValidationOutputList = ValidationOutput[];
  export type ValidationStatus = "READY_FOR_VALIDATION"|"PENDING"|"IN_PROGRESS"|"SUCCEEDED"|"FAILED"|string;
  export type ValidationStatusMessage = string;
  export type VmId = string;
  export type VmManagerId = string;
  export type VmManagerName = string;
  export type VmManagerType = "VSPHERE"|"SCVMM"|"HYPERV-MANAGER"|string;
  export type VmName = string;
  export type VmPath = string;
  export interface VmServer {
    /**
     * The VM server location.
     */
    vmServerAddress?: VmServerAddress;
    /**
     * The name of the VM.
     */
    vmName?: VmName;
    /**
     * The name of the VM manager.
     */
    vmManagerName?: VmManagerName;
    /**
     * The type of VM management product.
     */
    vmManagerType?: VmManagerType;
    /**
     * The VM folder path in the vCenter Server virtual machine inventory tree.
     */
    vmPath?: VmPath;
  }
  export interface VmServerAddress {
    /**
     * The ID of the VM manager.
     */
    vmManagerId?: VmManagerId;
    /**
     * The ID of the VM.
     */
    vmId?: VmId;
  }
  export type VmServerAddressList = VmServerAddress[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-10-24"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SMS client.
   */
  export import Types = SMS;
}
export = SMS;
