import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Discovery extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Discovery.Types.ClientConfiguration)
  config: Config & Discovery.Types.ClientConfiguration;
  /**
   * Associates one or more configuration items with an application.
   */
  associateConfigurationItemsToApplication(params: Discovery.Types.AssociateConfigurationItemsToApplicationRequest, callback?: (err: AWSError, data: Discovery.Types.AssociateConfigurationItemsToApplicationResponse) => void): Request<Discovery.Types.AssociateConfigurationItemsToApplicationResponse, AWSError>;
  /**
   * Associates one or more configuration items with an application.
   */
  associateConfigurationItemsToApplication(callback?: (err: AWSError, data: Discovery.Types.AssociateConfigurationItemsToApplicationResponse) => void): Request<Discovery.Types.AssociateConfigurationItemsToApplicationResponse, AWSError>;
  /**
   * Deletes one or more import tasks, each identified by their import ID. Each import task has a number of records that can identify servers or applications.  AWS Application Discovery Service has built-in matching logic that will identify when discovered servers match existing entries that you've previously discovered, the information for the already-existing discovered server is updated. When you delete an import task that contains records that were used to match, the information in those matched records that comes from the deleted records will also be deleted.
   */
  batchDeleteImportData(params: Discovery.Types.BatchDeleteImportDataRequest, callback?: (err: AWSError, data: Discovery.Types.BatchDeleteImportDataResponse) => void): Request<Discovery.Types.BatchDeleteImportDataResponse, AWSError>;
  /**
   * Deletes one or more import tasks, each identified by their import ID. Each import task has a number of records that can identify servers or applications.  AWS Application Discovery Service has built-in matching logic that will identify when discovered servers match existing entries that you've previously discovered, the information for the already-existing discovered server is updated. When you delete an import task that contains records that were used to match, the information in those matched records that comes from the deleted records will also be deleted.
   */
  batchDeleteImportData(callback?: (err: AWSError, data: Discovery.Types.BatchDeleteImportDataResponse) => void): Request<Discovery.Types.BatchDeleteImportDataResponse, AWSError>;
  /**
   * Creates an application with the given name and description.
   */
  createApplication(params: Discovery.Types.CreateApplicationRequest, callback?: (err: AWSError, data: Discovery.Types.CreateApplicationResponse) => void): Request<Discovery.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates an application with the given name and description.
   */
  createApplication(callback?: (err: AWSError, data: Discovery.Types.CreateApplicationResponse) => void): Request<Discovery.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates one or more tags for configuration items. Tags are metadata that help you categorize IT assets. This API accepts a list of multiple configuration items.
   */
  createTags(params: Discovery.Types.CreateTagsRequest, callback?: (err: AWSError, data: Discovery.Types.CreateTagsResponse) => void): Request<Discovery.Types.CreateTagsResponse, AWSError>;
  /**
   * Creates one or more tags for configuration items. Tags are metadata that help you categorize IT assets. This API accepts a list of multiple configuration items.
   */
  createTags(callback?: (err: AWSError, data: Discovery.Types.CreateTagsResponse) => void): Request<Discovery.Types.CreateTagsResponse, AWSError>;
  /**
   * Deletes a list of applications and their associations with configuration items.
   */
  deleteApplications(params: Discovery.Types.DeleteApplicationsRequest, callback?: (err: AWSError, data: Discovery.Types.DeleteApplicationsResponse) => void): Request<Discovery.Types.DeleteApplicationsResponse, AWSError>;
  /**
   * Deletes a list of applications and their associations with configuration items.
   */
  deleteApplications(callback?: (err: AWSError, data: Discovery.Types.DeleteApplicationsResponse) => void): Request<Discovery.Types.DeleteApplicationsResponse, AWSError>;
  /**
   * Deletes the association between configuration items and one or more tags. This API accepts a list of multiple configuration items.
   */
  deleteTags(params: Discovery.Types.DeleteTagsRequest, callback?: (err: AWSError, data: Discovery.Types.DeleteTagsResponse) => void): Request<Discovery.Types.DeleteTagsResponse, AWSError>;
  /**
   * Deletes the association between configuration items and one or more tags. This API accepts a list of multiple configuration items.
   */
  deleteTags(callback?: (err: AWSError, data: Discovery.Types.DeleteTagsResponse) => void): Request<Discovery.Types.DeleteTagsResponse, AWSError>;
  /**
   * Lists agents or connectors as specified by ID or other filters. All agents/connectors associated with your user account can be listed if you call DescribeAgents as is without passing any parameters.
   */
  describeAgents(params: Discovery.Types.DescribeAgentsRequest, callback?: (err: AWSError, data: Discovery.Types.DescribeAgentsResponse) => void): Request<Discovery.Types.DescribeAgentsResponse, AWSError>;
  /**
   * Lists agents or connectors as specified by ID or other filters. All agents/connectors associated with your user account can be listed if you call DescribeAgents as is without passing any parameters.
   */
  describeAgents(callback?: (err: AWSError, data: Discovery.Types.DescribeAgentsResponse) => void): Request<Discovery.Types.DescribeAgentsResponse, AWSError>;
  /**
   * Retrieves attributes for a list of configuration item IDs.  All of the supplied IDs must be for the same asset type from one of the following:   server   application   process   connection   Output fields are specific to the asset type specified. For example, the output for a server configuration item includes a list of attributes about the server, such as host name, operating system, number of network cards, etc. For a complete list of outputs for each asset type, see Using the DescribeConfigurations Action in the AWS Application Discovery Service User Guide. 
   */
  describeConfigurations(params: Discovery.Types.DescribeConfigurationsRequest, callback?: (err: AWSError, data: Discovery.Types.DescribeConfigurationsResponse) => void): Request<Discovery.Types.DescribeConfigurationsResponse, AWSError>;
  /**
   * Retrieves attributes for a list of configuration item IDs.  All of the supplied IDs must be for the same asset type from one of the following:   server   application   process   connection   Output fields are specific to the asset type specified. For example, the output for a server configuration item includes a list of attributes about the server, such as host name, operating system, number of network cards, etc. For a complete list of outputs for each asset type, see Using the DescribeConfigurations Action in the AWS Application Discovery Service User Guide. 
   */
  describeConfigurations(callback?: (err: AWSError, data: Discovery.Types.DescribeConfigurationsResponse) => void): Request<Discovery.Types.DescribeConfigurationsResponse, AWSError>;
  /**
   * Lists exports as specified by ID. All continuous exports associated with your user account can be listed if you call DescribeContinuousExports as is without passing any parameters.
   */
  describeContinuousExports(params: Discovery.Types.DescribeContinuousExportsRequest, callback?: (err: AWSError, data: Discovery.Types.DescribeContinuousExportsResponse) => void): Request<Discovery.Types.DescribeContinuousExportsResponse, AWSError>;
  /**
   * Lists exports as specified by ID. All continuous exports associated with your user account can be listed if you call DescribeContinuousExports as is without passing any parameters.
   */
  describeContinuousExports(callback?: (err: AWSError, data: Discovery.Types.DescribeContinuousExportsResponse) => void): Request<Discovery.Types.DescribeContinuousExportsResponse, AWSError>;
  /**
   *  DescribeExportConfigurations is deprecated. Use DescribeImportTasks, instead.
   */
  describeExportConfigurations(params: Discovery.Types.DescribeExportConfigurationsRequest, callback?: (err: AWSError, data: Discovery.Types.DescribeExportConfigurationsResponse) => void): Request<Discovery.Types.DescribeExportConfigurationsResponse, AWSError>;
  /**
   *  DescribeExportConfigurations is deprecated. Use DescribeImportTasks, instead.
   */
  describeExportConfigurations(callback?: (err: AWSError, data: Discovery.Types.DescribeExportConfigurationsResponse) => void): Request<Discovery.Types.DescribeExportConfigurationsResponse, AWSError>;
  /**
   * Retrieve status of one or more export tasks. You can retrieve the status of up to 100 export tasks.
   */
  describeExportTasks(params: Discovery.Types.DescribeExportTasksRequest, callback?: (err: AWSError, data: Discovery.Types.DescribeExportTasksResponse) => void): Request<Discovery.Types.DescribeExportTasksResponse, AWSError>;
  /**
   * Retrieve status of one or more export tasks. You can retrieve the status of up to 100 export tasks.
   */
  describeExportTasks(callback?: (err: AWSError, data: Discovery.Types.DescribeExportTasksResponse) => void): Request<Discovery.Types.DescribeExportTasksResponse, AWSError>;
  /**
   * Returns an array of import tasks for your account, including status information, times, IDs, the Amazon S3 Object URL for the import file, and more.
   */
  describeImportTasks(params: Discovery.Types.DescribeImportTasksRequest, callback?: (err: AWSError, data: Discovery.Types.DescribeImportTasksResponse) => void): Request<Discovery.Types.DescribeImportTasksResponse, AWSError>;
  /**
   * Returns an array of import tasks for your account, including status information, times, IDs, the Amazon S3 Object URL for the import file, and more.
   */
  describeImportTasks(callback?: (err: AWSError, data: Discovery.Types.DescribeImportTasksResponse) => void): Request<Discovery.Types.DescribeImportTasksResponse, AWSError>;
  /**
   * Retrieves a list of configuration items that have tags as specified by the key-value pairs, name and value, passed to the optional parameter filters. There are three valid tag filter names:   tagKey   tagValue   configurationId   Also, all configuration items associated with your user account that have tags can be listed if you call DescribeTags as is without passing any parameters.
   */
  describeTags(params: Discovery.Types.DescribeTagsRequest, callback?: (err: AWSError, data: Discovery.Types.DescribeTagsResponse) => void): Request<Discovery.Types.DescribeTagsResponse, AWSError>;
  /**
   * Retrieves a list of configuration items that have tags as specified by the key-value pairs, name and value, passed to the optional parameter filters. There are three valid tag filter names:   tagKey   tagValue   configurationId   Also, all configuration items associated with your user account that have tags can be listed if you call DescribeTags as is without passing any parameters.
   */
  describeTags(callback?: (err: AWSError, data: Discovery.Types.DescribeTagsResponse) => void): Request<Discovery.Types.DescribeTagsResponse, AWSError>;
  /**
   * Disassociates one or more configuration items from an application.
   */
  disassociateConfigurationItemsFromApplication(params: Discovery.Types.DisassociateConfigurationItemsFromApplicationRequest, callback?: (err: AWSError, data: Discovery.Types.DisassociateConfigurationItemsFromApplicationResponse) => void): Request<Discovery.Types.DisassociateConfigurationItemsFromApplicationResponse, AWSError>;
  /**
   * Disassociates one or more configuration items from an application.
   */
  disassociateConfigurationItemsFromApplication(callback?: (err: AWSError, data: Discovery.Types.DisassociateConfigurationItemsFromApplicationResponse) => void): Request<Discovery.Types.DisassociateConfigurationItemsFromApplicationResponse, AWSError>;
  /**
   * Deprecated. Use StartExportTask instead. Exports all discovered configuration data to an Amazon S3 bucket or an application that enables you to view and evaluate the data. Data includes tags and tag associations, processes, connections, servers, and system performance. This API returns an export ID that you can query using the DescribeExportConfigurations API. The system imposes a limit of two configuration exports in six hours.
   */
  exportConfigurations(callback?: (err: AWSError, data: Discovery.Types.ExportConfigurationsResponse) => void): Request<Discovery.Types.ExportConfigurationsResponse, AWSError>;
  /**
   * Retrieves a short summary of discovered assets. This API operation takes no request parameters and is called as is at the command prompt as shown in the example.
   */
  getDiscoverySummary(params: Discovery.Types.GetDiscoverySummaryRequest, callback?: (err: AWSError, data: Discovery.Types.GetDiscoverySummaryResponse) => void): Request<Discovery.Types.GetDiscoverySummaryResponse, AWSError>;
  /**
   * Retrieves a short summary of discovered assets. This API operation takes no request parameters and is called as is at the command prompt as shown in the example.
   */
  getDiscoverySummary(callback?: (err: AWSError, data: Discovery.Types.GetDiscoverySummaryResponse) => void): Request<Discovery.Types.GetDiscoverySummaryResponse, AWSError>;
  /**
   * Retrieves a list of configuration items as specified by the value passed to the required parameter configurationType. Optional filtering may be applied to refine search results.
   */
  listConfigurations(params: Discovery.Types.ListConfigurationsRequest, callback?: (err: AWSError, data: Discovery.Types.ListConfigurationsResponse) => void): Request<Discovery.Types.ListConfigurationsResponse, AWSError>;
  /**
   * Retrieves a list of configuration items as specified by the value passed to the required parameter configurationType. Optional filtering may be applied to refine search results.
   */
  listConfigurations(callback?: (err: AWSError, data: Discovery.Types.ListConfigurationsResponse) => void): Request<Discovery.Types.ListConfigurationsResponse, AWSError>;
  /**
   * Retrieves a list of servers that are one network hop away from a specified server.
   */
  listServerNeighbors(params: Discovery.Types.ListServerNeighborsRequest, callback?: (err: AWSError, data: Discovery.Types.ListServerNeighborsResponse) => void): Request<Discovery.Types.ListServerNeighborsResponse, AWSError>;
  /**
   * Retrieves a list of servers that are one network hop away from a specified server.
   */
  listServerNeighbors(callback?: (err: AWSError, data: Discovery.Types.ListServerNeighborsResponse) => void): Request<Discovery.Types.ListServerNeighborsResponse, AWSError>;
  /**
   * Start the continuous flow of agent's discovered data into Amazon Athena.
   */
  startContinuousExport(params: Discovery.Types.StartContinuousExportRequest, callback?: (err: AWSError, data: Discovery.Types.StartContinuousExportResponse) => void): Request<Discovery.Types.StartContinuousExportResponse, AWSError>;
  /**
   * Start the continuous flow of agent's discovered data into Amazon Athena.
   */
  startContinuousExport(callback?: (err: AWSError, data: Discovery.Types.StartContinuousExportResponse) => void): Request<Discovery.Types.StartContinuousExportResponse, AWSError>;
  /**
   * Instructs the specified agents or connectors to start collecting data.
   */
  startDataCollectionByAgentIds(params: Discovery.Types.StartDataCollectionByAgentIdsRequest, callback?: (err: AWSError, data: Discovery.Types.StartDataCollectionByAgentIdsResponse) => void): Request<Discovery.Types.StartDataCollectionByAgentIdsResponse, AWSError>;
  /**
   * Instructs the specified agents or connectors to start collecting data.
   */
  startDataCollectionByAgentIds(callback?: (err: AWSError, data: Discovery.Types.StartDataCollectionByAgentIdsResponse) => void): Request<Discovery.Types.StartDataCollectionByAgentIdsResponse, AWSError>;
  /**
   *  Begins the export of discovered data to an S3 bucket.  If you specify agentIds in a filter, the task exports up to 72 hours of detailed data collected by the identified Application Discovery Agent, including network, process, and performance details. A time range for exported agent data may be set by using startTime and endTime. Export of detailed agent data is limited to five concurrently running exports.   If you do not include an agentIds filter, summary data is exported that includes both AWS Agentless Discovery Connector data and summary data from AWS Discovery Agents. Export of summary data is limited to two exports per day. 
   */
  startExportTask(params: Discovery.Types.StartExportTaskRequest, callback?: (err: AWSError, data: Discovery.Types.StartExportTaskResponse) => void): Request<Discovery.Types.StartExportTaskResponse, AWSError>;
  /**
   *  Begins the export of discovered data to an S3 bucket.  If you specify agentIds in a filter, the task exports up to 72 hours of detailed data collected by the identified Application Discovery Agent, including network, process, and performance details. A time range for exported agent data may be set by using startTime and endTime. Export of detailed agent data is limited to five concurrently running exports.   If you do not include an agentIds filter, summary data is exported that includes both AWS Agentless Discovery Connector data and summary data from AWS Discovery Agents. Export of summary data is limited to two exports per day. 
   */
  startExportTask(callback?: (err: AWSError, data: Discovery.Types.StartExportTaskResponse) => void): Request<Discovery.Types.StartExportTaskResponse, AWSError>;
  /**
   * Starts an import task, which allows you to import details of your on-premises environment directly into AWS Migration Hub without having to use the Application Discovery Service (ADS) tools such as the Discovery Connector or Discovery Agent. This gives you the option to perform migration assessment and planning directly from your imported data, including the ability to group your devices as applications and track their migration status. To start an import request, do this:   Download the specially formatted comma separated value (CSV) import template, which you can find here: https://s3-us-west-2.amazonaws.com/templates-7cffcf56-bd96-4b1c-b45b-a5b42f282e46/import_template.csv.   Fill out the template with your server and application data.   Upload your import file to an Amazon S3 bucket, and make a note of it's Object URL. Your import file must be in the CSV format.   Use the console or the StartImportTask command with the AWS CLI or one of the AWS SDKs to import the records from your file.   For more information, including step-by-step procedures, see Migration Hub Import in the AWS Application Discovery Service User Guide.  There are limits to the number of import tasks you can create (and delete) in an AWS account. For more information, see AWS Application Discovery Service Limits in the AWS Application Discovery Service User Guide. 
   */
  startImportTask(params: Discovery.Types.StartImportTaskRequest, callback?: (err: AWSError, data: Discovery.Types.StartImportTaskResponse) => void): Request<Discovery.Types.StartImportTaskResponse, AWSError>;
  /**
   * Starts an import task, which allows you to import details of your on-premises environment directly into AWS Migration Hub without having to use the Application Discovery Service (ADS) tools such as the Discovery Connector or Discovery Agent. This gives you the option to perform migration assessment and planning directly from your imported data, including the ability to group your devices as applications and track their migration status. To start an import request, do this:   Download the specially formatted comma separated value (CSV) import template, which you can find here: https://s3-us-west-2.amazonaws.com/templates-7cffcf56-bd96-4b1c-b45b-a5b42f282e46/import_template.csv.   Fill out the template with your server and application data.   Upload your import file to an Amazon S3 bucket, and make a note of it's Object URL. Your import file must be in the CSV format.   Use the console or the StartImportTask command with the AWS CLI or one of the AWS SDKs to import the records from your file.   For more information, including step-by-step procedures, see Migration Hub Import in the AWS Application Discovery Service User Guide.  There are limits to the number of import tasks you can create (and delete) in an AWS account. For more information, see AWS Application Discovery Service Limits in the AWS Application Discovery Service User Guide. 
   */
  startImportTask(callback?: (err: AWSError, data: Discovery.Types.StartImportTaskResponse) => void): Request<Discovery.Types.StartImportTaskResponse, AWSError>;
  /**
   * Stop the continuous flow of agent's discovered data into Amazon Athena.
   */
  stopContinuousExport(params: Discovery.Types.StopContinuousExportRequest, callback?: (err: AWSError, data: Discovery.Types.StopContinuousExportResponse) => void): Request<Discovery.Types.StopContinuousExportResponse, AWSError>;
  /**
   * Stop the continuous flow of agent's discovered data into Amazon Athena.
   */
  stopContinuousExport(callback?: (err: AWSError, data: Discovery.Types.StopContinuousExportResponse) => void): Request<Discovery.Types.StopContinuousExportResponse, AWSError>;
  /**
   * Instructs the specified agents or connectors to stop collecting data.
   */
  stopDataCollectionByAgentIds(params: Discovery.Types.StopDataCollectionByAgentIdsRequest, callback?: (err: AWSError, data: Discovery.Types.StopDataCollectionByAgentIdsResponse) => void): Request<Discovery.Types.StopDataCollectionByAgentIdsResponse, AWSError>;
  /**
   * Instructs the specified agents or connectors to stop collecting data.
   */
  stopDataCollectionByAgentIds(callback?: (err: AWSError, data: Discovery.Types.StopDataCollectionByAgentIdsResponse) => void): Request<Discovery.Types.StopDataCollectionByAgentIdsResponse, AWSError>;
  /**
   * Updates metadata about an application.
   */
  updateApplication(params: Discovery.Types.UpdateApplicationRequest, callback?: (err: AWSError, data: Discovery.Types.UpdateApplicationResponse) => void): Request<Discovery.Types.UpdateApplicationResponse, AWSError>;
  /**
   * Updates metadata about an application.
   */
  updateApplication(callback?: (err: AWSError, data: Discovery.Types.UpdateApplicationResponse) => void): Request<Discovery.Types.UpdateApplicationResponse, AWSError>;
}
declare namespace Discovery {
  export interface AgentConfigurationStatus {
    /**
     * The agent/connector ID.
     */
    agentId?: String;
    /**
     * Information about the status of the StartDataCollection and StopDataCollection operations. The system has recorded the data collection operation. The agent/connector receives this command the next time it polls for a new command. 
     */
    operationSucceeded?: Boolean;
    /**
     * A description of the operation performed.
     */
    description?: String;
  }
  export type AgentConfigurationStatusList = AgentConfigurationStatus[];
  export type AgentId = string;
  export type AgentIds = AgentId[];
  export interface AgentInfo {
    /**
     * The agent or connector ID.
     */
    agentId?: AgentId;
    /**
     * The name of the host where the agent or connector resides. The host can be a server or virtual machine.
     */
    hostName?: String;
    /**
     * Network details about the host where the agent or connector resides.
     */
    agentNetworkInfoList?: AgentNetworkInfoList;
    /**
     * The ID of the connector.
     */
    connectorId?: String;
    /**
     * The agent or connector version.
     */
    version?: String;
    /**
     * The health of the agent or connector.
     */
    health?: AgentStatus;
    /**
     * Time since agent or connector health was reported.
     */
    lastHealthPingTime?: String;
    /**
     * Status of the collection process for an agent or connector.
     */
    collectionStatus?: String;
    /**
     * Type of agent.
     */
    agentType?: String;
    /**
     * Agent's first registration timestamp in UTC.
     */
    registeredTime?: String;
  }
  export interface AgentNetworkInfo {
    /**
     * The IP address for the host where the agent/connector resides.
     */
    ipAddress?: String;
    /**
     * The MAC address for the host where the agent/connector resides.
     */
    macAddress?: String;
  }
  export type AgentNetworkInfoList = AgentNetworkInfo[];
  export type AgentStatus = "HEALTHY"|"UNHEALTHY"|"RUNNING"|"UNKNOWN"|"BLACKLISTED"|"SHUTDOWN"|string;
  export type AgentsInfo = AgentInfo[];
  export type ApplicationId = string;
  export type ApplicationIdsList = ApplicationId[];
  export interface AssociateConfigurationItemsToApplicationRequest {
    /**
     * The configuration ID of an application with which items are to be associated.
     */
    applicationConfigurationId: ApplicationId;
    /**
     * The ID of each configuration item to be associated with an application.
     */
    configurationIds: ConfigurationIdList;
  }
  export interface AssociateConfigurationItemsToApplicationResponse {
  }
  export interface BatchDeleteImportDataError {
    /**
     * The unique import ID associated with the error that occurred.
     */
    importTaskId?: ImportTaskIdentifier;
    /**
     * The type of error that occurred for a specific import task.
     */
    errorCode?: BatchDeleteImportDataErrorCode;
    /**
     * The description of the error that occurred for a specific import task.
     */
    errorDescription?: BatchDeleteImportDataErrorDescription;
  }
  export type BatchDeleteImportDataErrorCode = "NOT_FOUND"|"INTERNAL_SERVER_ERROR"|"OVER_LIMIT"|string;
  export type BatchDeleteImportDataErrorDescription = string;
  export type BatchDeleteImportDataErrorList = BatchDeleteImportDataError[];
  export interface BatchDeleteImportDataRequest {
    /**
     * The IDs for the import tasks that you want to delete.
     */
    importTaskIds: ToDeleteIdentifierList;
  }
  export interface BatchDeleteImportDataResponse {
    /**
     * Error messages returned for each import task that you deleted as a response for this command.
     */
    errors?: BatchDeleteImportDataErrorList;
  }
  export type Boolean = boolean;
  export type BoxedInteger = number;
  export type ClientRequestToken = string;
  export type Condition = string;
  export type Configuration = {[key: string]: String};
  export type ConfigurationId = string;
  export type ConfigurationIdList = ConfigurationId[];
  export type ConfigurationItemType = "SERVER"|"PROCESS"|"CONNECTION"|"APPLICATION"|string;
  export interface ConfigurationTag {
    /**
     * A type of IT asset to tag.
     */
    configurationType?: ConfigurationItemType;
    /**
     * The configuration ID for the item to tag. You can specify a list of keys and values.
     */
    configurationId?: ConfigurationId;
    /**
     * A type of tag on which to filter. For example, serverType.
     */
    key?: TagKey;
    /**
     * A value on which to filter. For example key = serverType and value = web server.
     */
    value?: TagValue;
    /**
     * The time the configuration tag was created in Coordinated Universal Time (UTC).
     */
    timeOfCreation?: TimeStamp;
  }
  export type ConfigurationTagSet = ConfigurationTag[];
  export type Configurations = Configuration[];
  export type ConfigurationsDownloadUrl = string;
  export type ConfigurationsExportId = string;
  export interface ContinuousExportDescription {
    /**
     * The unique ID assigned to this export.
     */
    exportId?: ConfigurationsExportId;
    /**
     * Describes the status of the export. Can be one of the following values:   START_IN_PROGRESS - setting up resources to start continuous export.   START_FAILED - an error occurred setting up continuous export. To recover, call start-continuous-export again.   ACTIVE - data is being exported to the customer bucket.   ERROR - an error occurred during export. To fix the issue, call stop-continuous-export and start-continuous-export.   STOP_IN_PROGRESS - stopping the export.   STOP_FAILED - an error occurred stopping the export. To recover, call stop-continuous-export again.   INACTIVE - the continuous export has been stopped. Data is no longer being exported to the customer bucket.  
     */
    status?: ContinuousExportStatus;
    /**
     * Contains information about any errors that have occurred. This data type can have the following values:   ACCESS_DENIED - You don’t have permission to start Data Exploration in Amazon Athena. Contact your AWS administrator for help. For more information, see Setting Up AWS Application Discovery Service in the Application Discovery Service User Guide.   DELIVERY_STREAM_LIMIT_FAILURE - You reached the limit for Amazon Kinesis Data Firehose delivery streams. Reduce the number of streams or request a limit increase and try again. For more information, see Kinesis Data Streams Limits in the Amazon Kinesis Data Streams Developer Guide.   FIREHOSE_ROLE_MISSING - The Data Exploration feature is in an error state because your IAM User is missing the AWSApplicationDiscoveryServiceFirehose role. Turn on Data Exploration in Amazon Athena and try again. For more information, see Step 3: Provide Application Discovery Service Access to Non-Administrator Users by Attaching Policies in the Application Discovery Service User Guide.   FIREHOSE_STREAM_DOES_NOT_EXIST - The Data Exploration feature is in an error state because your IAM User is missing one or more of the Kinesis data delivery streams.   INTERNAL_FAILURE - The Data Exploration feature is in an error state because of an internal failure. Try again later. If this problem persists, contact AWS Support.   S3_BUCKET_LIMIT_FAILURE - You reached the limit for Amazon S3 buckets. Reduce the number of Amazon S3 buckets or request a limit increase and try again. For more information, see Bucket Restrictions and Limitations in the Amazon Simple Storage Service Developer Guide.   S3_NOT_SIGNED_UP - Your account is not signed up for the Amazon S3 service. You must sign up before you can use Amazon S3. You can sign up at the following URL: https://aws.amazon.com/s3.  
     */
    statusDetail?: StringMax255;
    /**
     * The name of the s3 bucket where the export data parquet files are stored.
     */
    s3Bucket?: S3Bucket;
    /**
     * The timestamp representing when the continuous export was started.
     */
    startTime?: TimeStamp;
    /**
     * The timestamp that represents when this continuous export was stopped.
     */
    stopTime?: TimeStamp;
    /**
     * The type of data collector used to gather this data (currently only offered for AGENT).
     */
    dataSource?: DataSource;
    /**
     * An object which describes how the data is stored.    databaseName - the name of the Glue database used to store the schema.  
     */
    schemaStorageConfig?: SchemaStorageConfig;
  }
  export type ContinuousExportDescriptions = ContinuousExportDescription[];
  export type ContinuousExportIds = ConfigurationsExportId[];
  export type ContinuousExportStatus = "START_IN_PROGRESS"|"START_FAILED"|"ACTIVE"|"ERROR"|"STOP_IN_PROGRESS"|"STOP_FAILED"|"INACTIVE"|string;
  export interface CreateApplicationRequest {
    /**
     * Name of the application to be created.
     */
    name: String;
    /**
     * Description of the application to be created.
     */
    description?: String;
  }
  export interface CreateApplicationResponse {
    /**
     * Configuration ID of an application to be created.
     */
    configurationId?: String;
  }
  export interface CreateTagsRequest {
    /**
     * A list of configuration items that you want to tag.
     */
    configurationIds: ConfigurationIdList;
    /**
     * Tags that you want to associate with one or more configuration items. Specify the tags that you want to create in a key-value format. For example:  {"key": "serverType", "value": "webServer"} 
     */
    tags: TagSet;
  }
  export interface CreateTagsResponse {
  }
  export interface CustomerAgentInfo {
    /**
     * Number of active discovery agents.
     */
    activeAgents: Integer;
    /**
     * Number of healthy discovery agents
     */
    healthyAgents: Integer;
    /**
     * Number of blacklisted discovery agents.
     */
    blackListedAgents: Integer;
    /**
     * Number of discovery agents with status SHUTDOWN.
     */
    shutdownAgents: Integer;
    /**
     * Number of unhealthy discovery agents.
     */
    unhealthyAgents: Integer;
    /**
     * Total number of discovery agents.
     */
    totalAgents: Integer;
    /**
     * Number of unknown discovery agents.
     */
    unknownAgents: Integer;
  }
  export interface CustomerConnectorInfo {
    /**
     * Number of active discovery connectors.
     */
    activeConnectors: Integer;
    /**
     * Number of healthy discovery connectors.
     */
    healthyConnectors: Integer;
    /**
     * Number of blacklisted discovery connectors.
     */
    blackListedConnectors: Integer;
    /**
     * Number of discovery connectors with status SHUTDOWN,
     */
    shutdownConnectors: Integer;
    /**
     * Number of unhealthy discovery connectors.
     */
    unhealthyConnectors: Integer;
    /**
     * Total number of discovery connectors.
     */
    totalConnectors: Integer;
    /**
     * Number of unknown discovery connectors.
     */
    unknownConnectors: Integer;
  }
  export type DataSource = "AGENT"|string;
  export type DatabaseName = string;
  export interface DeleteApplicationsRequest {
    /**
     * Configuration ID of an application to be deleted.
     */
    configurationIds: ApplicationIdsList;
  }
  export interface DeleteApplicationsResponse {
  }
  export interface DeleteTagsRequest {
    /**
     * A list of configuration items with tags that you want to delete.
     */
    configurationIds: ConfigurationIdList;
    /**
     * Tags that you want to delete from one or more configuration items. Specify the tags that you want to delete in a key-value format. For example:  {"key": "serverType", "value": "webServer"} 
     */
    tags?: TagSet;
  }
  export interface DeleteTagsResponse {
  }
  export interface DescribeAgentsRequest {
    /**
     * The agent or the Connector IDs for which you want information. If you specify no IDs, the system returns information about all agents/Connectors associated with your AWS user account.
     */
    agentIds?: AgentIds;
    /**
     * You can filter the request using various logical operators and a key-value format. For example:   {"key": "collectionStatus", "value": "STARTED"} 
     */
    filters?: Filters;
    /**
     * The total number of agents/Connectors to return in a single page of output. The maximum value is 100.
     */
    maxResults?: Integer;
    /**
     * Token to retrieve the next set of results. For example, if you previously specified 100 IDs for DescribeAgentsRequest$agentIds but set DescribeAgentsRequest$maxResults to 10, you received a set of 10 results along with a token. Use that token in this query to get the next set of 10.
     */
    nextToken?: NextToken;
  }
  export interface DescribeAgentsResponse {
    /**
     * Lists agents or the Connector by ID or lists all agents/Connectors associated with your user account if you did not specify an agent/Connector ID. The output includes agent/Connector IDs, IP addresses, media access control (MAC) addresses, agent/Connector health, host name where the agent/Connector resides, and the version number of each agent/Connector.
     */
    agentsInfo?: AgentsInfo;
    /**
     * Token to retrieve the next set of results. For example, if you specified 100 IDs for DescribeAgentsRequest$agentIds but set DescribeAgentsRequest$maxResults to 10, you received a set of 10 results along with this token. Use this token in the next query to retrieve the next set of 10.
     */
    nextToken?: NextToken;
  }
  export type DescribeConfigurationsAttribute = {[key: string]: String};
  export type DescribeConfigurationsAttributes = DescribeConfigurationsAttribute[];
  export interface DescribeConfigurationsRequest {
    /**
     * One or more configuration IDs.
     */
    configurationIds: ConfigurationIdList;
  }
  export interface DescribeConfigurationsResponse {
    /**
     * A key in the response map. The value is an array of data.
     */
    configurations?: DescribeConfigurationsAttributes;
  }
  export type DescribeContinuousExportsMaxResults = number;
  export interface DescribeContinuousExportsRequest {
    /**
     * The unique IDs assigned to the exports.
     */
    exportIds?: ContinuousExportIds;
    /**
     * A number between 1 and 100 specifying the maximum number of continuous export descriptions returned.
     */
    maxResults?: DescribeContinuousExportsMaxResults;
    /**
     * The token from the previous call to DescribeExportTasks.
     */
    nextToken?: NextToken;
  }
  export interface DescribeContinuousExportsResponse {
    /**
     * A list of continuous export descriptions.
     */
    descriptions?: ContinuousExportDescriptions;
    /**
     * The token from the previous call to DescribeExportTasks.
     */
    nextToken?: NextToken;
  }
  export interface DescribeExportConfigurationsRequest {
    /**
     * A list of continuous export IDs to search for.
     */
    exportIds?: ExportIds;
    /**
     * A number between 1 and 100 specifying the maximum number of continuous export descriptions returned.
     */
    maxResults?: Integer;
    /**
     * The token from the previous call to describe-export-tasks.
     */
    nextToken?: NextToken;
  }
  export interface DescribeExportConfigurationsResponse {
    /**
     * 
     */
    exportsInfo?: ExportsInfo;
    /**
     * The token from the previous call to describe-export-tasks.
     */
    nextToken?: NextToken;
  }
  export interface DescribeExportTasksRequest {
    /**
     * One or more unique identifiers used to query the status of an export request.
     */
    exportIds?: ExportIds;
    /**
     * One or more filters.    AgentId - ID of the agent whose collected data will be exported  
     */
    filters?: ExportFilters;
    /**
     * The maximum number of volume results returned by DescribeExportTasks in paginated output. When this parameter is used, DescribeExportTasks only returns maxResults results in a single page along with a nextToken response element.
     */
    maxResults?: Integer;
    /**
     * The nextToken value returned from a previous paginated DescribeExportTasks request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface DescribeExportTasksResponse {
    /**
     * Contains one or more sets of export request details. When the status of a request is SUCCEEDED, the response includes a URL for an Amazon S3 bucket where you can view the data in a CSV file.
     */
    exportsInfo?: ExportsInfo;
    /**
     * The nextToken value to include in a future DescribeExportTasks request. When the results of a DescribeExportTasks request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export type DescribeImportTasksFilterList = ImportTaskFilter[];
  export type DescribeImportTasksMaxResults = number;
  export interface DescribeImportTasksRequest {
    /**
     * An array of name-value pairs that you provide to filter the results for the DescribeImportTask request to a specific subset of results. Currently, wildcard values aren't supported for filters.
     */
    filters?: DescribeImportTasksFilterList;
    /**
     * The maximum number of results that you want this request to return, up to 100.
     */
    maxResults?: DescribeImportTasksMaxResults;
    /**
     * The token to request a specific page of results.
     */
    nextToken?: NextToken;
  }
  export interface DescribeImportTasksResponse {
    /**
     * The token to request the next page of results.
     */
    nextToken?: NextToken;
    /**
     * A returned array of import tasks that match any applied filters, up to the specified number of maximum results.
     */
    tasks?: ImportTaskList;
  }
  export interface DescribeTagsRequest {
    /**
     * You can filter the list using a key-value format. You can separate these items by using logical operators. Allowed filters include tagKey, tagValue, and configurationId. 
     */
    filters?: TagFilters;
    /**
     * The total number of items to return in a single page of output. The maximum value is 100.
     */
    maxResults?: Integer;
    /**
     * A token to start the list. Use this token to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface DescribeTagsResponse {
    /**
     * Depending on the input, this is a list of configuration items tagged with a specific tag, or a list of tags for a specific configuration item.
     */
    tags?: ConfigurationTagSet;
    /**
     * The call returns a token. Use this token to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface DisassociateConfigurationItemsFromApplicationRequest {
    /**
     * Configuration ID of an application from which each item is disassociated.
     */
    applicationConfigurationId: ApplicationId;
    /**
     * Configuration ID of each item to be disassociated from an application.
     */
    configurationIds: ConfigurationIdList;
  }
  export interface DisassociateConfigurationItemsFromApplicationResponse {
  }
  export interface ExportConfigurationsResponse {
    /**
     * A unique identifier that you can use to query the export status.
     */
    exportId?: ConfigurationsExportId;
  }
  export type ExportDataFormat = "CSV"|"GRAPHML"|string;
  export type ExportDataFormats = ExportDataFormat[];
  export interface ExportFilter {
    /**
     * A single ExportFilter name. Supported filters: agentId.
     */
    name: FilterName;
    /**
     * A single agentId for a Discovery Agent. An agentId can be found using the DescribeAgents action. Typically an ADS agentId is in the form o-0123456789abcdef0.
     */
    values: FilterValues;
    /**
     * Supported condition: EQUALS 
     */
    condition: Condition;
  }
  export type ExportFilters = ExportFilter[];
  export type ExportIds = ConfigurationsExportId[];
  export interface ExportInfo {
    /**
     * A unique identifier used to query an export.
     */
    exportId: ConfigurationsExportId;
    /**
     * The status of the data export job.
     */
    exportStatus: ExportStatus;
    /**
     * A status message provided for API callers.
     */
    statusMessage: ExportStatusMessage;
    /**
     * A URL for an Amazon S3 bucket where you can review the exported data. The URL is displayed only if the export succeeded.
     */
    configurationsDownloadUrl?: ConfigurationsDownloadUrl;
    /**
     * The time that the data export was initiated.
     */
    exportRequestTime: ExportRequestTime;
    /**
     * If true, the export of agent information exceeded the size limit for a single export and the exported data is incomplete for the requested time range. To address this, select a smaller time range for the export by using startDate and endDate.
     */
    isTruncated?: Boolean;
    /**
     * The value of startTime parameter in the StartExportTask request. If no startTime was requested, this result does not appear in ExportInfo.
     */
    requestedStartTime?: TimeStamp;
    /**
     * The endTime used in the StartExportTask request. If no endTime was requested, this result does not appear in ExportInfo.
     */
    requestedEndTime?: TimeStamp;
  }
  export type ExportRequestTime = Date;
  export type ExportStatus = "FAILED"|"SUCCEEDED"|"IN_PROGRESS"|string;
  export type ExportStatusMessage = string;
  export type ExportsInfo = ExportInfo[];
  export interface Filter {
    /**
     * The name of the filter.
     */
    name: String;
    /**
     * A string value on which to filter. For example, if you choose the destinationServer.osVersion filter name, you could specify Ubuntu for the value.
     */
    values: FilterValues;
    /**
     * A conditional operator. The following operators are valid: EQUALS, NOT_EQUALS, CONTAINS, NOT_CONTAINS. If you specify multiple filters, the system utilizes all filters as though concatenated by AND. If you specify multiple values for a particular filter, the system differentiates the values using OR. Calling either DescribeConfigurations or ListConfigurations returns attributes of matching configuration items.
     */
    condition: Condition;
  }
  export type FilterName = string;
  export type FilterValue = string;
  export type FilterValues = FilterValue[];
  export type Filters = Filter[];
  export interface GetDiscoverySummaryRequest {
  }
  export interface GetDiscoverySummaryResponse {
    /**
     * The number of servers discovered.
     */
    servers?: Long;
    /**
     * The number of applications discovered.
     */
    applications?: Long;
    /**
     * The number of servers mapped to applications.
     */
    serversMappedToApplications?: Long;
    /**
     * The number of servers mapped to tags.
     */
    serversMappedtoTags?: Long;
    /**
     * Details about discovered agents, including agent status and health.
     */
    agentSummary?: CustomerAgentInfo;
    /**
     * Details about discovered connectors, including connector status and health.
     */
    connectorSummary?: CustomerConnectorInfo;
  }
  export type ImportStatus = "IMPORT_IN_PROGRESS"|"IMPORT_COMPLETE"|"IMPORT_COMPLETE_WITH_ERRORS"|"IMPORT_FAILED"|"IMPORT_FAILED_SERVER_LIMIT_EXCEEDED"|"IMPORT_FAILED_RECORD_LIMIT_EXCEEDED"|"DELETE_IN_PROGRESS"|"DELETE_COMPLETE"|"DELETE_FAILED"|"DELETE_FAILED_LIMIT_EXCEEDED"|"INTERNAL_ERROR"|string;
  export interface ImportTask {
    /**
     * The unique ID for a specific import task. These IDs aren't globally unique, but they are unique within an AWS account.
     */
    importTaskId?: ImportTaskIdentifier;
    /**
     * A unique token used to prevent the same import request from occurring more than once. If you didn't provide a token, a token was automatically generated when the import task request was sent.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * A descriptive name for an import task. You can use this name to filter future requests related to this import task, such as identifying applications and servers that were included in this import task. We recommend that you use a meaningful name for each import task.
     */
    name?: ImportTaskName;
    /**
     * The URL for your import file that you've uploaded to Amazon S3.
     */
    importUrl?: ImportURL;
    /**
     * The status of the import task. An import can have the status of IMPORT_COMPLETE and still have some records fail to import from the overall request. More information can be found in the downloadable archive defined in the errorsAndFailedEntriesZip field, or in the Migration Hub management console.
     */
    status?: ImportStatus;
    /**
     * The time that the import task request was made, presented in the Unix time stamp format.
     */
    importRequestTime?: TimeStamp;
    /**
     * The time that the import task request finished, presented in the Unix time stamp format.
     */
    importCompletionTime?: TimeStamp;
    /**
     * The time that the import task request was deleted, presented in the Unix time stamp format.
     */
    importDeletedTime?: TimeStamp;
    /**
     * The total number of server records in the import file that were successfully imported.
     */
    serverImportSuccess?: Integer;
    /**
     * The total number of server records in the import file that failed to be imported.
     */
    serverImportFailure?: Integer;
    /**
     * The total number of application records in the import file that were successfully imported.
     */
    applicationImportSuccess?: Integer;
    /**
     * The total number of application records in the import file that failed to be imported.
     */
    applicationImportFailure?: Integer;
    /**
     * A link to a compressed archive folder (in the ZIP format) that contains an error log and a file of failed records. You can use these two files to quickly identify records that failed, why they failed, and correct those records. Afterward, you can upload the corrected file to your Amazon S3 bucket and create another import task request. This field also includes authorization information so you can confirm the authenticity of the compressed archive before you download it. If some records failed to be imported we recommend that you correct the records in the failed entries file and then imports that failed entries file. This prevents you from having to correct and update the larger original file and attempt importing it again.
     */
    errorsAndFailedEntriesZip?: S3PresignedUrl;
  }
  export interface ImportTaskFilter {
    /**
     * The name, status, or import task ID for a specific import task.
     */
    name?: ImportTaskFilterName;
    /**
     * An array of strings that you can provide to match against a specific name, status, or import task ID to filter the results for your import task queries.
     */
    values?: ImportTaskFilterValueList;
  }
  export type ImportTaskFilterName = "IMPORT_TASK_ID"|"STATUS"|"NAME"|string;
  export type ImportTaskFilterValue = string;
  export type ImportTaskFilterValueList = ImportTaskFilterValue[];
  export type ImportTaskIdentifier = string;
  export type ImportTaskList = ImportTask[];
  export type ImportTaskName = string;
  export type ImportURL = string;
  export type Integer = number;
  export interface ListConfigurationsRequest {
    /**
     * A valid configuration identified by Application Discovery Service. 
     */
    configurationType: ConfigurationItemType;
    /**
     * You can filter the request using various logical operators and a key-value format. For example:   {"key": "serverType", "value": "webServer"}  For a complete list of filter options and guidance about using them with this action, see Using the ListConfigurations Action in the AWS Application Discovery Service User Guide.
     */
    filters?: Filters;
    /**
     * The total number of items to return. The maximum value is 100.
     */
    maxResults?: Integer;
    /**
     * Token to retrieve the next set of results. For example, if a previous call to ListConfigurations returned 100 items, but you set ListConfigurationsRequest$maxResults to 10, you received a set of 10 results along with a token. Use that token in this query to get the next set of 10.
     */
    nextToken?: NextToken;
    /**
     * Certain filter criteria return output that can be sorted in ascending or descending order. For a list of output characteristics for each filter, see Using the ListConfigurations Action in the AWS Application Discovery Service User Guide.
     */
    orderBy?: OrderByList;
  }
  export interface ListConfigurationsResponse {
    /**
     * Returns configuration details, including the configuration ID, attribute names, and attribute values.
     */
    configurations?: Configurations;
    /**
     * Token to retrieve the next set of results. For example, if your call to ListConfigurations returned 100 items, but you set ListConfigurationsRequest$maxResults to 10, you received a set of 10 results along with this token. Use this token in the next query to retrieve the next set of 10.
     */
    nextToken?: NextToken;
  }
  export interface ListServerNeighborsRequest {
    /**
     * Configuration ID of the server for which neighbors are being listed.
     */
    configurationId: ConfigurationId;
    /**
     * Flag to indicate if port and protocol information is needed as part of the response.
     */
    portInformationNeeded?: Boolean;
    /**
     * List of configuration IDs to test for one-hop-away.
     */
    neighborConfigurationIds?: ConfigurationIdList;
    /**
     * Maximum number of results to return in a single page of output.
     */
    maxResults?: Integer;
    /**
     * Token to retrieve the next set of results. For example, if you previously specified 100 IDs for ListServerNeighborsRequest$neighborConfigurationIds but set ListServerNeighborsRequest$maxResults to 10, you received a set of 10 results along with a token. Use that token in this query to get the next set of 10.
     */
    nextToken?: String;
  }
  export interface ListServerNeighborsResponse {
    /**
     * List of distinct servers that are one hop away from the given server.
     */
    neighbors: NeighborDetailsList;
    /**
     * Token to retrieve the next set of results. For example, if you specified 100 IDs for ListServerNeighborsRequest$neighborConfigurationIds but set ListServerNeighborsRequest$maxResults to 10, you received a set of 10 results along with this token. Use this token in the next query to retrieve the next set of 10.
     */
    nextToken?: String;
    /**
     * Count of distinct servers that are one hop away from the given server.
     */
    knownDependencyCount?: Long;
  }
  export type Long = number;
  export interface NeighborConnectionDetail {
    /**
     * The ID of the server that opened the network connection.
     */
    sourceServerId: ConfigurationId;
    /**
     * The ID of the server that accepted the network connection.
     */
    destinationServerId: ConfigurationId;
    /**
     * The destination network port for the connection.
     */
    destinationPort?: BoxedInteger;
    /**
     * The network protocol used for the connection.
     */
    transportProtocol?: String;
    /**
     * The number of open network connections with the neighboring server.
     */
    connectionsCount: Long;
  }
  export type NeighborDetailsList = NeighborConnectionDetail[];
  export type NextToken = string;
  export interface OrderByElement {
    /**
     * The field on which to order.
     */
    fieldName: String;
    /**
     * Ordering direction.
     */
    sortOrder?: orderString;
  }
  export type OrderByList = OrderByElement[];
  export type S3Bucket = string;
  export type S3PresignedUrl = string;
  export type SchemaStorageConfig = {[key: string]: String};
  export interface StartContinuousExportRequest {
  }
  export interface StartContinuousExportResponse {
    /**
     * The unique ID assigned to this export.
     */
    exportId?: ConfigurationsExportId;
    /**
     * The name of the s3 bucket where the export data parquet files are stored.
     */
    s3Bucket?: S3Bucket;
    /**
     * The timestamp representing when the continuous export was started.
     */
    startTime?: TimeStamp;
    /**
     * The type of data collector used to gather this data (currently only offered for AGENT).
     */
    dataSource?: DataSource;
    /**
     * A dictionary which describes how the data is stored.    databaseName - the name of the Glue database used to store the schema.  
     */
    schemaStorageConfig?: SchemaStorageConfig;
  }
  export interface StartDataCollectionByAgentIdsRequest {
    /**
     * The IDs of the agents or connectors from which to start collecting data. If you send a request to an agent/connector ID that you do not have permission to contact, according to your AWS account, the service does not throw an exception. Instead, it returns the error in the Description field. If you send a request to multiple agents/connectors and you do not have permission to contact some of those agents/connectors, the system does not throw an exception. Instead, the system shows Failed in the Description field.
     */
    agentIds: AgentIds;
  }
  export interface StartDataCollectionByAgentIdsResponse {
    /**
     * Information about agents or the connector that were instructed to start collecting data. Information includes the agent/connector ID, a description of the operation performed, and whether the agent/connector configuration was updated.
     */
    agentsConfigurationStatus?: AgentConfigurationStatusList;
  }
  export interface StartExportTaskRequest {
    /**
     * The file format for the returned export data. Default value is CSV. Note: The GRAPHML option has been deprecated. 
     */
    exportDataFormat?: ExportDataFormats;
    /**
     * If a filter is present, it selects the single agentId of the Application Discovery Agent for which data is exported. The agentId can be found in the results of the DescribeAgents API or CLI. If no filter is present, startTime and endTime are ignored and exported data includes both Agentless Discovery Connector data and summary data from Application Discovery agents. 
     */
    filters?: ExportFilters;
    /**
     * The start timestamp for exported data from the single Application Discovery Agent selected in the filters. If no value is specified, data is exported starting from the first data collected by the agent.
     */
    startTime?: TimeStamp;
    /**
     * The end timestamp for exported data from the single Application Discovery Agent selected in the filters. If no value is specified, exported data includes the most recent data collected by the agent.
     */
    endTime?: TimeStamp;
  }
  export interface StartExportTaskResponse {
    /**
     * A unique identifier used to query the status of an export request.
     */
    exportId?: ConfigurationsExportId;
  }
  export interface StartImportTaskRequest {
    /**
     * Optional. A unique token that you can provide to prevent the same import request from occurring more than once. If you don't provide a token, a token is automatically generated. Sending more than one StartImportTask request with the same client request token will return information about the original import task with that client request token.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * A descriptive name for this request. You can use this name to filter future requests related to this import task, such as identifying applications and servers that were included in this import task. We recommend that you use a meaningful name for each import task.
     */
    name: ImportTaskName;
    /**
     * The URL for your import file that you've uploaded to Amazon S3.  If you're using the AWS CLI, this URL is structured as follows: s3://BucketName/ImportFileName.CSV  
     */
    importUrl: ImportURL;
  }
  export interface StartImportTaskResponse {
    /**
     * An array of information related to the import task request including status information, times, IDs, the Amazon S3 Object URL for the import file, and more. 
     */
    task?: ImportTask;
  }
  export interface StopContinuousExportRequest {
    /**
     * The unique ID assigned to this export.
     */
    exportId: ConfigurationsExportId;
  }
  export interface StopContinuousExportResponse {
    /**
     * Timestamp that represents when this continuous export started collecting data.
     */
    startTime?: TimeStamp;
    /**
     * Timestamp that represents when this continuous export was stopped.
     */
    stopTime?: TimeStamp;
  }
  export interface StopDataCollectionByAgentIdsRequest {
    /**
     * The IDs of the agents or connectors from which to stop collecting data.
     */
    agentIds: AgentIds;
  }
  export interface StopDataCollectionByAgentIdsResponse {
    /**
     * Information about the agents or connector that were instructed to stop collecting data. Information includes the agent/connector ID, a description of the operation performed, and whether the agent/connector configuration was updated.
     */
    agentsConfigurationStatus?: AgentConfigurationStatusList;
  }
  export type String = string;
  export type StringMax255 = string;
  export interface Tag {
    /**
     * The type of tag on which to filter.
     */
    key: TagKey;
    /**
     * A value for a tag key on which to filter.
     */
    value: TagValue;
  }
  export interface TagFilter {
    /**
     * A name of the tag filter.
     */
    name: FilterName;
    /**
     * Values for the tag filter.
     */
    values: FilterValues;
  }
  export type TagFilters = TagFilter[];
  export type TagKey = string;
  export type TagSet = Tag[];
  export type TagValue = string;
  export type TimeStamp = Date;
  export type ToDeleteIdentifierList = ImportTaskIdentifier[];
  export interface UpdateApplicationRequest {
    /**
     * Configuration ID of the application to be updated.
     */
    configurationId: ApplicationId;
    /**
     * New name of the application to be updated.
     */
    name?: String;
    /**
     * New description of the application to be updated.
     */
    description?: String;
  }
  export interface UpdateApplicationResponse {
  }
  export type orderString = "ASC"|"DESC"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-11-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Discovery client.
   */
  export import Types = Discovery;
}
export = Discovery;
