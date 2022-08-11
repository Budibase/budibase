import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IoTAnalytics extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IoTAnalytics.Types.ClientConfiguration)
  config: Config & IoTAnalytics.Types.ClientConfiguration;
  /**
   * Sends messages to a channel.
   */
  batchPutMessage(params: IoTAnalytics.Types.BatchPutMessageRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.BatchPutMessageResponse) => void): Request<IoTAnalytics.Types.BatchPutMessageResponse, AWSError>;
  /**
   * Sends messages to a channel.
   */
  batchPutMessage(callback?: (err: AWSError, data: IoTAnalytics.Types.BatchPutMessageResponse) => void): Request<IoTAnalytics.Types.BatchPutMessageResponse, AWSError>;
  /**
   * Cancels the reprocessing of data through the pipeline.
   */
  cancelPipelineReprocessing(params: IoTAnalytics.Types.CancelPipelineReprocessingRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.CancelPipelineReprocessingResponse) => void): Request<IoTAnalytics.Types.CancelPipelineReprocessingResponse, AWSError>;
  /**
   * Cancels the reprocessing of data through the pipeline.
   */
  cancelPipelineReprocessing(callback?: (err: AWSError, data: IoTAnalytics.Types.CancelPipelineReprocessingResponse) => void): Request<IoTAnalytics.Types.CancelPipelineReprocessingResponse, AWSError>;
  /**
   * Used to create a channel. A channel collects data from an MQTT topic and archives the raw, unprocessed messages before publishing the data to a pipeline.
   */
  createChannel(params: IoTAnalytics.Types.CreateChannelRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.CreateChannelResponse) => void): Request<IoTAnalytics.Types.CreateChannelResponse, AWSError>;
  /**
   * Used to create a channel. A channel collects data from an MQTT topic and archives the raw, unprocessed messages before publishing the data to a pipeline.
   */
  createChannel(callback?: (err: AWSError, data: IoTAnalytics.Types.CreateChannelResponse) => void): Request<IoTAnalytics.Types.CreateChannelResponse, AWSError>;
  /**
   * Used to create a dataset. A dataset stores data retrieved from a data store by applying a queryAction (a SQL query) or a containerAction (executing a containerized application). This operation creates the skeleton of a dataset. The dataset can be populated manually by calling CreateDatasetContent or automatically according to a trigger you specify.
   */
  createDataset(params: IoTAnalytics.Types.CreateDatasetRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.CreateDatasetResponse) => void): Request<IoTAnalytics.Types.CreateDatasetResponse, AWSError>;
  /**
   * Used to create a dataset. A dataset stores data retrieved from a data store by applying a queryAction (a SQL query) or a containerAction (executing a containerized application). This operation creates the skeleton of a dataset. The dataset can be populated manually by calling CreateDatasetContent or automatically according to a trigger you specify.
   */
  createDataset(callback?: (err: AWSError, data: IoTAnalytics.Types.CreateDatasetResponse) => void): Request<IoTAnalytics.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates the content of a dataset by applying a queryAction (a SQL query) or a containerAction (executing a containerized application).
   */
  createDatasetContent(params: IoTAnalytics.Types.CreateDatasetContentRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.CreateDatasetContentResponse) => void): Request<IoTAnalytics.Types.CreateDatasetContentResponse, AWSError>;
  /**
   * Creates the content of a dataset by applying a queryAction (a SQL query) or a containerAction (executing a containerized application).
   */
  createDatasetContent(callback?: (err: AWSError, data: IoTAnalytics.Types.CreateDatasetContentResponse) => void): Request<IoTAnalytics.Types.CreateDatasetContentResponse, AWSError>;
  /**
   * Creates a data store, which is a repository for messages.
   */
  createDatastore(params: IoTAnalytics.Types.CreateDatastoreRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.CreateDatastoreResponse) => void): Request<IoTAnalytics.Types.CreateDatastoreResponse, AWSError>;
  /**
   * Creates a data store, which is a repository for messages.
   */
  createDatastore(callback?: (err: AWSError, data: IoTAnalytics.Types.CreateDatastoreResponse) => void): Request<IoTAnalytics.Types.CreateDatastoreResponse, AWSError>;
  /**
   * Creates a pipeline. A pipeline consumes messages from a channel and allows you to process the messages before storing them in a data store. You must specify both a channel and a datastore activity and, optionally, as many as 23 additional activities in the pipelineActivities array.
   */
  createPipeline(params: IoTAnalytics.Types.CreatePipelineRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.CreatePipelineResponse) => void): Request<IoTAnalytics.Types.CreatePipelineResponse, AWSError>;
  /**
   * Creates a pipeline. A pipeline consumes messages from a channel and allows you to process the messages before storing them in a data store. You must specify both a channel and a datastore activity and, optionally, as many as 23 additional activities in the pipelineActivities array.
   */
  createPipeline(callback?: (err: AWSError, data: IoTAnalytics.Types.CreatePipelineResponse) => void): Request<IoTAnalytics.Types.CreatePipelineResponse, AWSError>;
  /**
   * Deletes the specified channel.
   */
  deleteChannel(params: IoTAnalytics.Types.DeleteChannelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified channel.
   */
  deleteChannel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified dataset. You do not have to delete the content of the dataset before you perform this operation.
   */
  deleteDataset(params: IoTAnalytics.Types.DeleteDatasetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified dataset. You do not have to delete the content of the dataset before you perform this operation.
   */
  deleteDataset(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the content of the specified dataset.
   */
  deleteDatasetContent(params: IoTAnalytics.Types.DeleteDatasetContentRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the content of the specified dataset.
   */
  deleteDatasetContent(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified data store.
   */
  deleteDatastore(params: IoTAnalytics.Types.DeleteDatastoreRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified data store.
   */
  deleteDatastore(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified pipeline.
   */
  deletePipeline(params: IoTAnalytics.Types.DeletePipelineRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified pipeline.
   */
  deletePipeline(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieves information about a channel.
   */
  describeChannel(params: IoTAnalytics.Types.DescribeChannelRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.DescribeChannelResponse) => void): Request<IoTAnalytics.Types.DescribeChannelResponse, AWSError>;
  /**
   * Retrieves information about a channel.
   */
  describeChannel(callback?: (err: AWSError, data: IoTAnalytics.Types.DescribeChannelResponse) => void): Request<IoTAnalytics.Types.DescribeChannelResponse, AWSError>;
  /**
   * Retrieves information about a dataset.
   */
  describeDataset(params: IoTAnalytics.Types.DescribeDatasetRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.DescribeDatasetResponse) => void): Request<IoTAnalytics.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Retrieves information about a dataset.
   */
  describeDataset(callback?: (err: AWSError, data: IoTAnalytics.Types.DescribeDatasetResponse) => void): Request<IoTAnalytics.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Retrieves information about a data store.
   */
  describeDatastore(params: IoTAnalytics.Types.DescribeDatastoreRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.DescribeDatastoreResponse) => void): Request<IoTAnalytics.Types.DescribeDatastoreResponse, AWSError>;
  /**
   * Retrieves information about a data store.
   */
  describeDatastore(callback?: (err: AWSError, data: IoTAnalytics.Types.DescribeDatastoreResponse) => void): Request<IoTAnalytics.Types.DescribeDatastoreResponse, AWSError>;
  /**
   * Retrieves the current settings of the IoT Analytics logging options.
   */
  describeLoggingOptions(params: IoTAnalytics.Types.DescribeLoggingOptionsRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.DescribeLoggingOptionsResponse) => void): Request<IoTAnalytics.Types.DescribeLoggingOptionsResponse, AWSError>;
  /**
   * Retrieves the current settings of the IoT Analytics logging options.
   */
  describeLoggingOptions(callback?: (err: AWSError, data: IoTAnalytics.Types.DescribeLoggingOptionsResponse) => void): Request<IoTAnalytics.Types.DescribeLoggingOptionsResponse, AWSError>;
  /**
   * Retrieves information about a pipeline.
   */
  describePipeline(params: IoTAnalytics.Types.DescribePipelineRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.DescribePipelineResponse) => void): Request<IoTAnalytics.Types.DescribePipelineResponse, AWSError>;
  /**
   * Retrieves information about a pipeline.
   */
  describePipeline(callback?: (err: AWSError, data: IoTAnalytics.Types.DescribePipelineResponse) => void): Request<IoTAnalytics.Types.DescribePipelineResponse, AWSError>;
  /**
   * Retrieves the contents of a dataset as presigned URIs.
   */
  getDatasetContent(params: IoTAnalytics.Types.GetDatasetContentRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.GetDatasetContentResponse) => void): Request<IoTAnalytics.Types.GetDatasetContentResponse, AWSError>;
  /**
   * Retrieves the contents of a dataset as presigned URIs.
   */
  getDatasetContent(callback?: (err: AWSError, data: IoTAnalytics.Types.GetDatasetContentResponse) => void): Request<IoTAnalytics.Types.GetDatasetContentResponse, AWSError>;
  /**
   * Retrieves a list of channels.
   */
  listChannels(params: IoTAnalytics.Types.ListChannelsRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.ListChannelsResponse) => void): Request<IoTAnalytics.Types.ListChannelsResponse, AWSError>;
  /**
   * Retrieves a list of channels.
   */
  listChannels(callback?: (err: AWSError, data: IoTAnalytics.Types.ListChannelsResponse) => void): Request<IoTAnalytics.Types.ListChannelsResponse, AWSError>;
  /**
   * Lists information about dataset contents that have been created.
   */
  listDatasetContents(params: IoTAnalytics.Types.ListDatasetContentsRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.ListDatasetContentsResponse) => void): Request<IoTAnalytics.Types.ListDatasetContentsResponse, AWSError>;
  /**
   * Lists information about dataset contents that have been created.
   */
  listDatasetContents(callback?: (err: AWSError, data: IoTAnalytics.Types.ListDatasetContentsResponse) => void): Request<IoTAnalytics.Types.ListDatasetContentsResponse, AWSError>;
  /**
   * Retrieves information about datasets.
   */
  listDatasets(params: IoTAnalytics.Types.ListDatasetsRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.ListDatasetsResponse) => void): Request<IoTAnalytics.Types.ListDatasetsResponse, AWSError>;
  /**
   * Retrieves information about datasets.
   */
  listDatasets(callback?: (err: AWSError, data: IoTAnalytics.Types.ListDatasetsResponse) => void): Request<IoTAnalytics.Types.ListDatasetsResponse, AWSError>;
  /**
   * Retrieves a list of data stores.
   */
  listDatastores(params: IoTAnalytics.Types.ListDatastoresRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.ListDatastoresResponse) => void): Request<IoTAnalytics.Types.ListDatastoresResponse, AWSError>;
  /**
   * Retrieves a list of data stores.
   */
  listDatastores(callback?: (err: AWSError, data: IoTAnalytics.Types.ListDatastoresResponse) => void): Request<IoTAnalytics.Types.ListDatastoresResponse, AWSError>;
  /**
   * Retrieves a list of pipelines.
   */
  listPipelines(params: IoTAnalytics.Types.ListPipelinesRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.ListPipelinesResponse) => void): Request<IoTAnalytics.Types.ListPipelinesResponse, AWSError>;
  /**
   * Retrieves a list of pipelines.
   */
  listPipelines(callback?: (err: AWSError, data: IoTAnalytics.Types.ListPipelinesResponse) => void): Request<IoTAnalytics.Types.ListPipelinesResponse, AWSError>;
  /**
   * Lists the tags (metadata) that you have assigned to the resource.
   */
  listTagsForResource(params: IoTAnalytics.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.ListTagsForResourceResponse) => void): Request<IoTAnalytics.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags (metadata) that you have assigned to the resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: IoTAnalytics.Types.ListTagsForResourceResponse) => void): Request<IoTAnalytics.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Sets or updates the IoT Analytics logging options. If you update the value of any loggingOptions field, it takes up to one minute for the change to take effect. Also, if you change the policy attached to the role you specified in the roleArn field (for example, to correct an invalid policy), it takes up to five minutes for that change to take effect. 
   */
  putLoggingOptions(params: IoTAnalytics.Types.PutLoggingOptionsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets or updates the IoT Analytics logging options. If you update the value of any loggingOptions field, it takes up to one minute for the change to take effect. Also, if you change the policy attached to the role you specified in the roleArn field (for example, to correct an invalid policy), it takes up to five minutes for that change to take effect. 
   */
  putLoggingOptions(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Simulates the results of running a pipeline activity on a message payload.
   */
  runPipelineActivity(params: IoTAnalytics.Types.RunPipelineActivityRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.RunPipelineActivityResponse) => void): Request<IoTAnalytics.Types.RunPipelineActivityResponse, AWSError>;
  /**
   * Simulates the results of running a pipeline activity on a message payload.
   */
  runPipelineActivity(callback?: (err: AWSError, data: IoTAnalytics.Types.RunPipelineActivityResponse) => void): Request<IoTAnalytics.Types.RunPipelineActivityResponse, AWSError>;
  /**
   * Retrieves a sample of messages from the specified channel ingested during the specified timeframe. Up to 10 messages can be retrieved.
   */
  sampleChannelData(params: IoTAnalytics.Types.SampleChannelDataRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.SampleChannelDataResponse) => void): Request<IoTAnalytics.Types.SampleChannelDataResponse, AWSError>;
  /**
   * Retrieves a sample of messages from the specified channel ingested during the specified timeframe. Up to 10 messages can be retrieved.
   */
  sampleChannelData(callback?: (err: AWSError, data: IoTAnalytics.Types.SampleChannelDataResponse) => void): Request<IoTAnalytics.Types.SampleChannelDataResponse, AWSError>;
  /**
   * Starts the reprocessing of raw message data through the pipeline.
   */
  startPipelineReprocessing(params: IoTAnalytics.Types.StartPipelineReprocessingRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.StartPipelineReprocessingResponse) => void): Request<IoTAnalytics.Types.StartPipelineReprocessingResponse, AWSError>;
  /**
   * Starts the reprocessing of raw message data through the pipeline.
   */
  startPipelineReprocessing(callback?: (err: AWSError, data: IoTAnalytics.Types.StartPipelineReprocessingResponse) => void): Request<IoTAnalytics.Types.StartPipelineReprocessingResponse, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata that can be used to manage a resource.
   */
  tagResource(params: IoTAnalytics.Types.TagResourceRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.TagResourceResponse) => void): Request<IoTAnalytics.Types.TagResourceResponse, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata that can be used to manage a resource.
   */
  tagResource(callback?: (err: AWSError, data: IoTAnalytics.Types.TagResourceResponse) => void): Request<IoTAnalytics.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the given tags (metadata) from the resource.
   */
  untagResource(params: IoTAnalytics.Types.UntagResourceRequest, callback?: (err: AWSError, data: IoTAnalytics.Types.UntagResourceResponse) => void): Request<IoTAnalytics.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the given tags (metadata) from the resource.
   */
  untagResource(callback?: (err: AWSError, data: IoTAnalytics.Types.UntagResourceResponse) => void): Request<IoTAnalytics.Types.UntagResourceResponse, AWSError>;
  /**
   * Used to update the settings of a channel.
   */
  updateChannel(params: IoTAnalytics.Types.UpdateChannelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Used to update the settings of a channel.
   */
  updateChannel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the settings of a dataset.
   */
  updateDataset(params: IoTAnalytics.Types.UpdateDatasetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the settings of a dataset.
   */
  updateDataset(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Used to update the settings of a data store.
   */
  updateDatastore(params: IoTAnalytics.Types.UpdateDatastoreRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Used to update the settings of a data store.
   */
  updateDatastore(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the settings of a pipeline. You must specify both a channel and a datastore activity and, optionally, as many as 23 additional activities in the pipelineActivities array.
   */
  updatePipeline(params: IoTAnalytics.Types.UpdatePipelineRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the settings of a pipeline. You must specify both a channel and a datastore activity and, optionally, as many as 23 additional activities in the pipelineActivities array.
   */
  updatePipeline(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace IoTAnalytics {
  export type ActivityBatchSize = number;
  export type ActivityName = string;
  export interface AddAttributesActivity {
    /**
     * The name of the addAttributes activity.
     */
    name: ActivityName;
    /**
     * A list of 1-50 AttributeNameMapping objects that map an existing attribute to a new attribute.  The existing attributes remain in the message, so if you want to remove the originals, use RemoveAttributeActivity. 
     */
    attributes: AttributeNameMapping;
    /**
     * The next activity in the pipeline.
     */
    next?: ActivityName;
  }
  export type AttributeName = string;
  export type AttributeNameMapping = {[key: string]: AttributeName};
  export type AttributeNames = AttributeName[];
  export type BatchPutMessageErrorEntries = BatchPutMessageErrorEntry[];
  export interface BatchPutMessageErrorEntry {
    /**
     * The ID of the message that caused the error. See the value corresponding to the messageId key in the message object.
     */
    messageId?: MessageId;
    /**
     * The code associated with the error.
     */
    errorCode?: ErrorCode;
    /**
     * The message associated with the error.
     */
    errorMessage?: ErrorMessage;
  }
  export interface BatchPutMessageRequest {
    /**
     * The name of the channel where the messages are sent.
     */
    channelName: ChannelName;
    /**
     * The list of messages to be sent. Each message has the format: { "messageId": "string", "payload": "string"}. The field names of message payloads (data) that you send to IoT Analytics:   Must contain only alphanumeric characters and undescores (_). No other special characters are allowed.   Must begin with an alphabetic character or single underscore (_).   Cannot contain hyphens (-).   In regular expression terms: "^[A-Za-z_]([A-Za-z0-9]*|[A-Za-z0-9][A-Za-z0-9_]*)$".    Cannot be more than 255 characters.   Are case insensitive. (Fields named foo and FOO in the same payload are considered duplicates.)   For example, {"temp_01": 29} or {"_temp_01": 29} are valid, but {"temp-01": 29}, {"01_temp": 29} or {"__temp_01": 29} are invalid in message payloads. 
     */
    messages: Messages;
  }
  export interface BatchPutMessageResponse {
    /**
     * A list of any errors encountered when sending the messages to the channel.
     */
    batchPutMessageErrorEntries?: BatchPutMessageErrorEntries;
  }
  export type BucketKeyExpression = string;
  export type BucketName = string;
  export interface CancelPipelineReprocessingRequest {
    /**
     * The name of pipeline for which data reprocessing is canceled.
     */
    pipelineName: PipelineName;
    /**
     * The ID of the reprocessing task (returned by StartPipelineReprocessing).
     */
    reprocessingId: ReprocessingId;
  }
  export interface CancelPipelineReprocessingResponse {
  }
  export interface Channel {
    /**
     * The name of the channel.
     */
    name?: ChannelName;
    /**
     * Where channel data is stored. You can choose one of serviceManagedS3 or customerManagedS3 storage. If not specified, the default is serviceManagedS3. You can't change this storage option after the channel is created.
     */
    storage?: ChannelStorage;
    /**
     * The ARN of the channel.
     */
    arn?: ChannelArn;
    /**
     * The status of the channel.
     */
    status?: ChannelStatus;
    /**
     * How long, in days, message data is kept for the channel.
     */
    retentionPeriod?: RetentionPeriod;
    /**
     * When the channel was created.
     */
    creationTime?: Timestamp;
    /**
     * When the channel was last updated.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The last time when a new message arrived in the channel. IoT Analytics updates this value at most once per minute for one channel. Hence, the lastMessageArrivalTime value is an approximation. This feature only applies to messages that arrived in the data store after October 23, 2020. 
     */
    lastMessageArrivalTime?: Timestamp;
  }
  export interface ChannelActivity {
    /**
     * The name of the channel activity.
     */
    name: ActivityName;
    /**
     * The name of the channel from which the messages are processed.
     */
    channelName: ChannelName;
    /**
     * The next activity in the pipeline.
     */
    next?: ActivityName;
  }
  export type ChannelArn = string;
  export interface ChannelMessages {
    /**
     * Specifies one or more keys that identify the Amazon Simple Storage Service (Amazon S3) objects that save your channel messages. You must use the full path for the key. Example path: channel/mychannel/__dt=2020-02-29 00:00:00/1582940490000_1582940520000_123456789012_mychannel_0_2118.0.json.gz 
     */
    s3Paths?: S3PathChannelMessages;
  }
  export type ChannelName = string;
  export interface ChannelStatistics {
    /**
     * The estimated size of the channel.
     */
    size?: EstimatedResourceSize;
  }
  export type ChannelStatus = "CREATING"|"ACTIVE"|"DELETING"|string;
  export interface ChannelStorage {
    /**
     * Used to store channel data in an S3 bucket managed by IoT Analytics. You can't change the choice of S3 storage after the data store is created.
     */
    serviceManagedS3?: ServiceManagedChannelS3Storage;
    /**
     * Used to store channel data in an S3 bucket that you manage. If customer managed storage is selected, the retentionPeriod parameter is ignored. You can't change the choice of S3 storage after the data store is created.
     */
    customerManagedS3?: CustomerManagedChannelS3Storage;
  }
  export interface ChannelStorageSummary {
    /**
     * Used to store channel data in an S3 bucket managed by IoT Analytics.
     */
    serviceManagedS3?: ServiceManagedChannelS3StorageSummary;
    /**
     * Used to store channel data in an S3 bucket that you manage.
     */
    customerManagedS3?: CustomerManagedChannelS3StorageSummary;
  }
  export type ChannelSummaries = ChannelSummary[];
  export interface ChannelSummary {
    /**
     * The name of the channel.
     */
    channelName?: ChannelName;
    /**
     * Where channel data is stored.
     */
    channelStorage?: ChannelStorageSummary;
    /**
     * The status of the channel.
     */
    status?: ChannelStatus;
    /**
     * When the channel was created.
     */
    creationTime?: Timestamp;
    /**
     * The last time the channel was updated.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The last time when a new message arrived in the channel. IoT Analytics updates this value at most once per minute for one channel. Hence, the lastMessageArrivalTime value is an approximation. This feature only applies to messages that arrived in the data store after October 23, 2020. 
     */
    lastMessageArrivalTime?: Timestamp;
  }
  export interface Column {
    /**
     * The name of the column.
     */
    name: ColumnName;
    /**
     * The type of data. For more information about the supported data types, see Common data types in the Glue Developer Guide.
     */
    type: ColumnDataType;
  }
  export type ColumnDataType = string;
  export type ColumnName = string;
  export type Columns = Column[];
  export type ComputeType = "ACU_1"|"ACU_2"|string;
  export interface ContainerDatasetAction {
    /**
     * The ARN of the Docker container stored in your account. The Docker container contains an application and required support libraries and is used to generate dataset contents.
     */
    image: Image;
    /**
     * The ARN of the role that gives permission to the system to access required resources to run the containerAction. This includes, at minimum, permission to retrieve the dataset contents that are the input to the containerized application.
     */
    executionRoleArn: RoleArn;
    /**
     * Configuration of the resource that executes the containerAction.
     */
    resourceConfiguration: ResourceConfiguration;
    /**
     * The values of variables used in the context of the execution of the containerized application (basically, parameters passed to the application). Each variable must have a name and a value given by one of stringValue, datasetContentVersionValue, or outputFileUriValue.
     */
    variables?: Variables;
  }
  export interface CreateChannelRequest {
    /**
     * The name of the channel.
     */
    channelName: ChannelName;
    /**
     * Where channel data is stored. You can choose one of serviceManagedS3 or customerManagedS3 storage. If not specified, the default is serviceManagedS3. You can't change this storage option after the channel is created.
     */
    channelStorage?: ChannelStorage;
    /**
     * How long, in days, message data is kept for the channel. When customerManagedS3 storage is selected, this parameter is ignored.
     */
    retentionPeriod?: RetentionPeriod;
    /**
     * Metadata which can be used to manage the channel.
     */
    tags?: TagList;
  }
  export interface CreateChannelResponse {
    /**
     * The name of the channel.
     */
    channelName?: ChannelName;
    /**
     * The ARN of the channel.
     */
    channelArn?: ChannelArn;
    /**
     * How long, in days, message data is kept for the channel.
     */
    retentionPeriod?: RetentionPeriod;
  }
  export interface CreateDatasetContentRequest {
    /**
     * The name of the dataset.
     */
    datasetName: DatasetName;
    /**
     * The version ID of the dataset content. To specify versionId for a dataset content, the dataset must use a DeltaTimer filter.
     */
    versionId?: DatasetContentVersion;
  }
  export interface CreateDatasetContentResponse {
    /**
     * The version ID of the dataset contents that are being created.
     */
    versionId?: DatasetContentVersion;
  }
  export interface CreateDatasetRequest {
    /**
     * The name of the dataset.
     */
    datasetName: DatasetName;
    /**
     * A list of actions that create the dataset contents.
     */
    actions: DatasetActions;
    /**
     * A list of triggers. A trigger causes dataset contents to be populated at a specified time interval or when another dataset's contents are created. The list of triggers can be empty or contain up to five DataSetTrigger objects.
     */
    triggers?: DatasetTriggers;
    /**
     * When dataset contents are created, they are delivered to destinations specified here.
     */
    contentDeliveryRules?: DatasetContentDeliveryRules;
    /**
     * Optional. How long, in days, versions of dataset contents are kept for the dataset. If not specified or set to null, versions of dataset contents are retained for at most 90 days. The number of versions of dataset contents retained is determined by the versioningConfiguration parameter. For more information, see  Keeping Multiple Versions of IoT Analytics datasets in the IoT Analytics User Guide.
     */
    retentionPeriod?: RetentionPeriod;
    /**
     * Optional. How many versions of dataset contents are kept. If not specified or set to null, only the latest version plus the latest succeeded version (if they are different) are kept for the time period specified by the retentionPeriod parameter. For more information, see Keeping Multiple Versions of IoT Analytics datasets in the IoT Analytics User Guide.
     */
    versioningConfiguration?: VersioningConfiguration;
    /**
     * Metadata which can be used to manage the dataset.
     */
    tags?: TagList;
    /**
     * A list of data rules that send notifications to CloudWatch, when data arrives late. To specify lateDataRules, the dataset must use a DeltaTimer filter.
     */
    lateDataRules?: LateDataRules;
  }
  export interface CreateDatasetResponse {
    /**
     * The name of the dataset.
     */
    datasetName?: DatasetName;
    /**
     * The ARN of the dataset.
     */
    datasetArn?: DatasetArn;
    /**
     * How long, in days, dataset contents are kept for the dataset.
     */
    retentionPeriod?: RetentionPeriod;
  }
  export interface CreateDatastoreRequest {
    /**
     * The name of the data store.
     */
    datastoreName: DatastoreName;
    /**
     * Where data in a data store is stored.. You can choose serviceManagedS3 storage, customerManagedS3 storage, or iotSiteWiseMultiLayerStorage storage. The default is serviceManagedS3. You can't change the choice of Amazon S3 storage after your data store is created. 
     */
    datastoreStorage?: DatastoreStorage;
    /**
     * How long, in days, message data is kept for the data store. When customerManagedS3 storage is selected, this parameter is ignored.
     */
    retentionPeriod?: RetentionPeriod;
    /**
     * Metadata which can be used to manage the data store.
     */
    tags?: TagList;
    /**
     * Contains the configuration information of file formats. IoT Analytics data stores support JSON and Parquet. The default file format is JSON. You can specify only one format. You can't change the file format after you create the data store.
     */
    fileFormatConfiguration?: FileFormatConfiguration;
    /**
     *  Contains information about the partition dimensions in a data store. 
     */
    datastorePartitions?: DatastorePartitions;
  }
  export interface CreateDatastoreResponse {
    /**
     * The name of the data store.
     */
    datastoreName?: DatastoreName;
    /**
     * The ARN of the data store.
     */
    datastoreArn?: DatastoreArn;
    /**
     * How long, in days, message data is kept for the data store.
     */
    retentionPeriod?: RetentionPeriod;
  }
  export interface CreatePipelineRequest {
    /**
     * The name of the pipeline.
     */
    pipelineName: PipelineName;
    /**
     * A list of PipelineActivity objects. Activities perform transformations on your messages, such as removing, renaming or adding message attributes; filtering messages based on attribute values; invoking your Lambda unctions on messages for advanced processing; or performing mathematical transformations to normalize device data. The list can be 2-25 PipelineActivity objects and must contain both a channel and a datastore activity. Each entry in the list must contain only one activity. For example:  pipelineActivities = [ { "channel": { ... } }, { "lambda": { ... } }, ... ] 
     */
    pipelineActivities: PipelineActivities;
    /**
     * Metadata which can be used to manage the pipeline.
     */
    tags?: TagList;
  }
  export interface CreatePipelineResponse {
    /**
     * The name of the pipeline.
     */
    pipelineName?: PipelineName;
    /**
     * The ARN of the pipeline.
     */
    pipelineArn?: PipelineArn;
  }
  export interface CustomerManagedChannelS3Storage {
    /**
     * The name of the S3 bucket in which channel data is stored.
     */
    bucket: BucketName;
    /**
     * (Optional) The prefix used to create the keys of the channel data objects. Each object in an S3 bucket has a key that is its unique identifier in the bucket. Each object in a bucket has exactly one key. The prefix must end with a forward slash (/).
     */
    keyPrefix?: S3KeyPrefix;
    /**
     * The ARN of the role that grants IoT Analytics permission to interact with your Amazon S3 resources.
     */
    roleArn: RoleArn;
  }
  export interface CustomerManagedChannelS3StorageSummary {
    /**
     * The name of the S3 bucket in which channel data is stored.
     */
    bucket?: BucketName;
    /**
     * (Optional) The prefix used to create the keys of the channel data objects. Each object in an S3 bucket has a key that is its unique identifier within the bucket (each object in a bucket has exactly one key). The prefix must end with a forward slash (/).
     */
    keyPrefix?: S3KeyPrefix;
    /**
     * The ARN of the role that grants IoT Analytics permission to interact with your Amazon S3 resources.
     */
    roleArn?: RoleArn;
  }
  export interface CustomerManagedDatastoreS3Storage {
    /**
     * The name of the Amazon S3 bucket where your data is stored.
     */
    bucket: BucketName;
    /**
     * (Optional) The prefix used to create the keys of the data store data objects. Each object in an Amazon S3 bucket has a key that is its unique identifier in the bucket. Each object in a bucket has exactly one key. The prefix must end with a forward slash (/).
     */
    keyPrefix?: S3KeyPrefix;
    /**
     * The ARN of the role that grants IoT Analytics permission to interact with your Amazon S3 resources.
     */
    roleArn: RoleArn;
  }
  export interface CustomerManagedDatastoreS3StorageSummary {
    /**
     * The name of the Amazon S3 bucket where your data is stored.
     */
    bucket?: BucketName;
    /**
     * (Optional) The prefix used to create the keys of the data store data objects. Each object in an Amazon S3 bucket has a key that is its unique identifier in the bucket. Each object in a bucket has exactly one key. The prefix must end with a forward slash (/).
     */
    keyPrefix?: S3KeyPrefix;
    /**
     * The ARN of the role that grants IoT Analytics permission to interact with your Amazon S3 resources.
     */
    roleArn?: RoleArn;
  }
  export interface Dataset {
    /**
     * The name of the dataset.
     */
    name?: DatasetName;
    /**
     * The ARN of the dataset.
     */
    arn?: DatasetArn;
    /**
     * The DatasetAction objects that automatically create the dataset contents.
     */
    actions?: DatasetActions;
    /**
     * The DatasetTrigger objects that specify when the dataset is automatically updated.
     */
    triggers?: DatasetTriggers;
    /**
     * When dataset contents are created they are delivered to destinations specified here.
     */
    contentDeliveryRules?: DatasetContentDeliveryRules;
    /**
     * The status of the dataset.
     */
    status?: DatasetStatus;
    /**
     * When the dataset was created.
     */
    creationTime?: Timestamp;
    /**
     * The last time the dataset was updated.
     */
    lastUpdateTime?: Timestamp;
    /**
     * Optional. How long, in days, message data is kept for the dataset.
     */
    retentionPeriod?: RetentionPeriod;
    /**
     * Optional. How many versions of dataset contents are kept. If not specified or set to null, only the latest version plus the latest succeeded version (if they are different) are kept for the time period specified by the retentionPeriod parameter. For more information, see  Keeping Multiple Versions of IoT Analytics datasets in the IoT Analytics User Guide.
     */
    versioningConfiguration?: VersioningConfiguration;
    /**
     * A list of data rules that send notifications to CloudWatch, when data arrives late. To specify lateDataRules, the dataset must use a DeltaTimer filter.
     */
    lateDataRules?: LateDataRules;
  }
  export interface DatasetAction {
    /**
     * The name of the dataset action by which dataset contents are automatically created.
     */
    actionName?: DatasetActionName;
    /**
     * An SqlQueryDatasetAction object that uses an SQL query to automatically create dataset contents.
     */
    queryAction?: SqlQueryDatasetAction;
    /**
     * Information that allows the system to run a containerized application to create the dataset contents. The application must be in a Docker container along with any required support libraries.
     */
    containerAction?: ContainerDatasetAction;
  }
  export type DatasetActionName = string;
  export type DatasetActionSummaries = DatasetActionSummary[];
  export interface DatasetActionSummary {
    /**
     * The name of the action that automatically creates the dataset's contents.
     */
    actionName?: DatasetActionName;
    /**
     * The type of action by which the dataset's contents are automatically created.
     */
    actionType?: DatasetActionType;
  }
  export type DatasetActionType = "QUERY"|"CONTAINER"|string;
  export type DatasetActions = DatasetAction[];
  export type DatasetArn = string;
  export interface DatasetContentDeliveryDestination {
    /**
     * Configuration information for delivery of dataset contents to IoT Events.
     */
    iotEventsDestinationConfiguration?: IotEventsDestinationConfiguration;
    /**
     * Configuration information for delivery of dataset contents to Amazon S3.
     */
    s3DestinationConfiguration?: S3DestinationConfiguration;
  }
  export interface DatasetContentDeliveryRule {
    /**
     * The name of the dataset content delivery rules entry.
     */
    entryName?: EntryName;
    /**
     * The destination to which dataset contents are delivered.
     */
    destination: DatasetContentDeliveryDestination;
  }
  export type DatasetContentDeliveryRules = DatasetContentDeliveryRule[];
  export type DatasetContentState = "CREATING"|"SUCCEEDED"|"FAILED"|string;
  export interface DatasetContentStatus {
    /**
     * The state of the dataset contents. Can be one of READY, CREATING, SUCCEEDED, or FAILED.
     */
    state?: DatasetContentState;
    /**
     * The reason the dataset contents are in this state.
     */
    reason?: Reason;
  }
  export type DatasetContentSummaries = DatasetContentSummary[];
  export interface DatasetContentSummary {
    /**
     * The version of the dataset contents.
     */
    version?: DatasetContentVersion;
    /**
     * The status of the dataset contents.
     */
    status?: DatasetContentStatus;
    /**
     * The actual time the creation of the dataset contents was started.
     */
    creationTime?: Timestamp;
    /**
     * The time the creation of the dataset contents was scheduled to start.
     */
    scheduleTime?: Timestamp;
    /**
     * The time the dataset content status was updated to SUCCEEDED or FAILED.
     */
    completionTime?: Timestamp;
  }
  export type DatasetContentVersion = string;
  export interface DatasetContentVersionValue {
    /**
     * The name of the dataset whose latest contents are used as input to the notebook or application.
     */
    datasetName: DatasetName;
  }
  export type DatasetEntries = DatasetEntry[];
  export interface DatasetEntry {
    /**
     * The name of the dataset item.
     */
    entryName?: EntryName;
    /**
     * The presigned URI of the dataset item.
     */
    dataURI?: PresignedURI;
  }
  export type DatasetName = string;
  export type DatasetStatus = "CREATING"|"ACTIVE"|"DELETING"|string;
  export type DatasetSummaries = DatasetSummary[];
  export interface DatasetSummary {
    /**
     * The name of the dataset.
     */
    datasetName?: DatasetName;
    /**
     * The status of the dataset.
     */
    status?: DatasetStatus;
    /**
     * The time the dataset was created.
     */
    creationTime?: Timestamp;
    /**
     * The last time the dataset was updated.
     */
    lastUpdateTime?: Timestamp;
    /**
     * A list of triggers. A trigger causes dataset content to be populated at a specified time interval or when another dataset is populated. The list of triggers can be empty or contain up to five DataSetTrigger objects
     */
    triggers?: DatasetTriggers;
    /**
     * A list of DataActionSummary objects.
     */
    actions?: DatasetActionSummaries;
  }
  export interface DatasetTrigger {
    /**
     * The Schedule when the trigger is initiated.
     */
    schedule?: Schedule;
    /**
     * The dataset whose content creation triggers the creation of this dataset's contents.
     */
    dataset?: TriggeringDataset;
  }
  export type DatasetTriggers = DatasetTrigger[];
  export interface Datastore {
    /**
     * The name of the data store.
     */
    name?: DatastoreName;
    /**
     * Where data in a data store is stored.. You can choose serviceManagedS3 storage, customerManagedS3 storage, or iotSiteWiseMultiLayerStorage storage. The default is serviceManagedS3. You can't change the choice of Amazon S3 storage after your data store is created. 
     */
    storage?: DatastoreStorage;
    /**
     * The ARN of the data store.
     */
    arn?: DatastoreArn;
    /**
     * The status of a data store:  CREATING  The data store is being created.  ACTIVE  The data store has been created and can be used.  DELETING  The data store is being deleted.  
     */
    status?: DatastoreStatus;
    /**
     * How long, in days, message data is kept for the data store. When customerManagedS3 storage is selected, this parameter is ignored.
     */
    retentionPeriod?: RetentionPeriod;
    /**
     * When the data store was created.
     */
    creationTime?: Timestamp;
    /**
     * The last time the data store was updated.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The last time when a new message arrived in the data store. IoT Analytics updates this value at most once per minute for Amazon Simple Storage Service one data store. Hence, the lastMessageArrivalTime value is an approximation. This feature only applies to messages that arrived in the data store after October 23, 2020. 
     */
    lastMessageArrivalTime?: Timestamp;
    /**
     * Contains the configuration information of file formats. IoT Analytics data stores support JSON and Parquet. The default file format is JSON. You can specify only one format. You can't change the file format after you create the data store.
     */
    fileFormatConfiguration?: FileFormatConfiguration;
    /**
     *  Contains information about the partition dimensions in a data store. 
     */
    datastorePartitions?: DatastorePartitions;
  }
  export interface DatastoreActivity {
    /**
     * The name of the datastore activity.
     */
    name: ActivityName;
    /**
     * The name of the data store where processed messages are stored.
     */
    datastoreName: DatastoreName;
  }
  export type DatastoreArn = string;
  export interface DatastoreIotSiteWiseMultiLayerStorage {
    /**
     *  Used to store data used by IoT SiteWise in an Amazon S3 bucket that you manage. 
     */
    customerManagedS3Storage: IotSiteWiseCustomerManagedDatastoreS3Storage;
  }
  export interface DatastoreIotSiteWiseMultiLayerStorageSummary {
    /**
     * Used to store data used by IoT SiteWise in an Amazon S3 bucket that you manage.
     */
    customerManagedS3Storage?: IotSiteWiseCustomerManagedDatastoreS3StorageSummary;
  }
  export type DatastoreName = string;
  export interface DatastorePartition {
    /**
     *  A partition dimension defined by an attributeName. 
     */
    attributePartition?: Partition;
    /**
     *  A partition dimension defined by a timestamp attribute. 
     */
    timestampPartition?: TimestampPartition;
  }
  export interface DatastorePartitions {
    /**
     *  A list of partition dimensions in a data store. 
     */
    partitions?: Partitions;
  }
  export interface DatastoreStatistics {
    /**
     * The estimated size of the data store.
     */
    size?: EstimatedResourceSize;
  }
  export type DatastoreStatus = "CREATING"|"ACTIVE"|"DELETING"|string;
  export interface DatastoreStorage {
    /**
     * Used to store data in an Amazon S3 bucket managed by IoT Analytics. You can't change the choice of Amazon S3 storage after your data store is created. 
     */
    serviceManagedS3?: ServiceManagedDatastoreS3Storage;
    /**
     * S3-customer-managed; When you choose customer-managed storage, the retentionPeriod parameter is ignored. You can't change the choice of Amazon S3 storage after your data store is created. 
     */
    customerManagedS3?: CustomerManagedDatastoreS3Storage;
    /**
     *  Used to store data used by IoT SiteWise in an Amazon S3 bucket that you manage. You can't change the choice of Amazon S3 storage after your data store is created. 
     */
    iotSiteWiseMultiLayerStorage?: DatastoreIotSiteWiseMultiLayerStorage;
  }
  export interface DatastoreStorageSummary {
    /**
     * Used to store data in an Amazon S3 bucket managed by IoT Analytics.
     */
    serviceManagedS3?: ServiceManagedDatastoreS3StorageSummary;
    /**
     * Used to store data in an Amazon S3 bucket managed by IoT Analytics.
     */
    customerManagedS3?: CustomerManagedDatastoreS3StorageSummary;
    /**
     *  Used to store data used by IoT SiteWise in an Amazon S3 bucket that you manage. 
     */
    iotSiteWiseMultiLayerStorage?: DatastoreIotSiteWiseMultiLayerStorageSummary;
  }
  export type DatastoreSummaries = DatastoreSummary[];
  export interface DatastoreSummary {
    /**
     * The name of the data store.
     */
    datastoreName?: DatastoreName;
    /**
     * Where data in a data store is stored.
     */
    datastoreStorage?: DatastoreStorageSummary;
    /**
     * The status of the data store.
     */
    status?: DatastoreStatus;
    /**
     * When the data store was created.
     */
    creationTime?: Timestamp;
    /**
     * The last time the data store was updated.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The last time when a new message arrived in the data store. IoT Analytics updates this value at most once per minute for Amazon Simple Storage Service one data store. Hence, the lastMessageArrivalTime value is an approximation. This feature only applies to messages that arrived in the data store after October 23, 2020. 
     */
    lastMessageArrivalTime?: Timestamp;
    /**
     * The file format of the data in the data store.
     */
    fileFormatType?: FileFormatType;
    /**
     *  Contains information about the partition dimensions in a data store. 
     */
    datastorePartitions?: DatastorePartitions;
  }
  export interface DeleteChannelRequest {
    /**
     * The name of the channel to delete.
     */
    channelName: ChannelName;
  }
  export interface DeleteDatasetContentRequest {
    /**
     * The name of the dataset whose content is deleted.
     */
    datasetName: DatasetName;
    /**
     * The version of the dataset whose content is deleted. You can also use the strings "$LATEST" or "$LATEST_SUCCEEDED" to delete the latest or latest successfully completed data set. If not specified, "$LATEST_SUCCEEDED" is the default.
     */
    versionId?: DatasetContentVersion;
  }
  export interface DeleteDatasetRequest {
    /**
     * The name of the dataset to delete.
     */
    datasetName: DatasetName;
  }
  export interface DeleteDatastoreRequest {
    /**
     * The name of the data store to delete.
     */
    datastoreName: DatastoreName;
  }
  export interface DeletePipelineRequest {
    /**
     * The name of the pipeline to delete.
     */
    pipelineName: PipelineName;
  }
  export interface DeltaTime {
    /**
     * The number of seconds of estimated in-flight lag time of message data. When you create dataset contents using message data from a specified timeframe, some message data might still be in flight when processing begins, and so do not arrive in time to be processed. Use this field to make allowances for the in flight time of your message data, so that data not processed from a previous timeframe is included with the next timeframe. Otherwise, missed message data would be excluded from processing during the next timeframe too, because its timestamp places it within the previous timeframe.
     */
    offsetSeconds: OffsetSeconds;
    /**
     * An expression by which the time of the message data might be determined. This can be the name of a timestamp field or a SQL expression that is used to derive the time the message data was generated.
     */
    timeExpression: TimeExpression;
  }
  export interface DeltaTimeSessionWindowConfiguration {
    /**
     * A time interval. You can use timeoutInMinutes so that IoT Analytics can batch up late data notifications that have been generated since the last execution. IoT Analytics sends one batch of notifications to Amazon CloudWatch Events at one time. For more information about how to write a timestamp expression, see Date and Time Functions and Operators, in the Presto 0.172 Documentation.
     */
    timeoutInMinutes: SessionTimeoutInMinutes;
  }
  export interface DescribeChannelRequest {
    /**
     * The name of the channel whose information is retrieved.
     */
    channelName: ChannelName;
    /**
     * If true, additional statistical information about the channel is included in the response. This feature can't be used with a channel whose S3 storage is customer-managed.
     */
    includeStatistics?: IncludeStatisticsFlag;
  }
  export interface DescribeChannelResponse {
    /**
     * An object that contains information about the channel.
     */
    channel?: Channel;
    /**
     * Statistics about the channel. Included if the includeStatistics parameter is set to true in the request.
     */
    statistics?: ChannelStatistics;
  }
  export interface DescribeDatasetRequest {
    /**
     * The name of the dataset whose information is retrieved.
     */
    datasetName: DatasetName;
  }
  export interface DescribeDatasetResponse {
    /**
     * An object that contains information about the dataset.
     */
    dataset?: Dataset;
  }
  export interface DescribeDatastoreRequest {
    /**
     * The name of the data store
     */
    datastoreName: DatastoreName;
    /**
     * If true, additional statistical information about the data store is included in the response. This feature can't be used with a data store whose S3 storage is customer-managed.
     */
    includeStatistics?: IncludeStatisticsFlag;
  }
  export interface DescribeDatastoreResponse {
    /**
     * Information about the data store.
     */
    datastore?: Datastore;
    /**
     * Additional statistical information about the data store. Included if the includeStatistics parameter is set to true in the request.
     */
    statistics?: DatastoreStatistics;
  }
  export interface DescribeLoggingOptionsRequest {
  }
  export interface DescribeLoggingOptionsResponse {
    /**
     * The current settings of the IoT Analytics logging options.
     */
    loggingOptions?: LoggingOptions;
  }
  export interface DescribePipelineRequest {
    /**
     * The name of the pipeline whose information is retrieved.
     */
    pipelineName: PipelineName;
  }
  export interface DescribePipelineResponse {
    /**
     * A Pipeline object that contains information about the pipeline.
     */
    pipeline?: Pipeline;
  }
  export interface DeviceRegistryEnrichActivity {
    /**
     * The name of the deviceRegistryEnrich activity.
     */
    name: ActivityName;
    /**
     * The name of the attribute that is added to the message.
     */
    attribute: AttributeName;
    /**
     * The name of the IoT device whose registry information is added to the message.
     */
    thingName: AttributeName;
    /**
     * The ARN of the role that allows access to the device's registry information.
     */
    roleArn: RoleArn;
    /**
     * The next activity in the pipeline.
     */
    next?: ActivityName;
  }
  export interface DeviceShadowEnrichActivity {
    /**
     * The name of the deviceShadowEnrich activity.
     */
    name: ActivityName;
    /**
     * The name of the attribute that is added to the message.
     */
    attribute: AttributeName;
    /**
     * The name of the IoT device whose shadow information is added to the message.
     */
    thingName: AttributeName;
    /**
     * The ARN of the role that allows access to the device's shadow.
     */
    roleArn: RoleArn;
    /**
     * The next activity in the pipeline.
     */
    next?: ActivityName;
  }
  export type DoubleValue = number;
  export type EndTime = Date;
  export type EntryName = string;
  export type ErrorCode = string;
  export type ErrorMessage = string;
  export interface EstimatedResourceSize {
    /**
     * The estimated size of the resource, in bytes.
     */
    estimatedSizeInBytes?: SizeInBytes;
    /**
     * The time when the estimate of the size of the resource was made.
     */
    estimatedOn?: Timestamp;
  }
  export interface FileFormatConfiguration {
    /**
     * Contains the configuration information of the JSON format.
     */
    jsonConfiguration?: JsonConfiguration;
    /**
     * Contains the configuration information of the Parquet format.
     */
    parquetConfiguration?: ParquetConfiguration;
  }
  export type FileFormatType = "JSON"|"PARQUET"|string;
  export interface FilterActivity {
    /**
     * The name of the filter activity.
     */
    name: ActivityName;
    /**
     * An expression that looks like a SQL WHERE clause that must return a Boolean value. Messages that satisfy the condition are passed to the next activity. 
     */
    filter: FilterExpression;
    /**
     * The next activity in the pipeline.
     */
    next?: ActivityName;
  }
  export type FilterExpression = string;
  export interface GetDatasetContentRequest {
    /**
     * The name of the dataset whose contents are retrieved.
     */
    datasetName: DatasetName;
    /**
     * The version of the dataset whose contents are retrieved. You can also use the strings "$LATEST" or "$LATEST_SUCCEEDED" to retrieve the contents of the latest or latest successfully completed dataset. If not specified, "$LATEST_SUCCEEDED" is the default.
     */
    versionId?: DatasetContentVersion;
  }
  export interface GetDatasetContentResponse {
    /**
     * A list of DatasetEntry objects.
     */
    entries?: DatasetEntries;
    /**
     * The time when the request was made.
     */
    timestamp?: Timestamp;
    /**
     * The status of the dataset content.
     */
    status?: DatasetContentStatus;
  }
  export interface GlueConfiguration {
    /**
     * The name of the table in your Glue Data Catalog that is used to perform the ETL operations. An Glue Data Catalog table contains partitioned data and descriptions of data sources and targets.
     */
    tableName: GlueTableName;
    /**
     * The name of the database in your Glue Data Catalog in which the table is located. An Glue Data Catalog database contains metadata tables.
     */
    databaseName: GlueDatabaseName;
  }
  export type GlueDatabaseName = string;
  export type GlueTableName = string;
  export type Image = string;
  export type IncludeStatisticsFlag = boolean;
  export interface IotEventsDestinationConfiguration {
    /**
     * The name of the IoT Events input to which dataset contents are delivered.
     */
    inputName: IotEventsInputName;
    /**
     * The ARN of the role that grants IoT Analytics permission to deliver dataset contents to an IoT Events input.
     */
    roleArn: RoleArn;
  }
  export type IotEventsInputName = string;
  export interface IotSiteWiseCustomerManagedDatastoreS3Storage {
    /**
     *  The name of the Amazon S3 bucket where your data is stored. 
     */
    bucket: BucketName;
    /**
     *  (Optional) The prefix used to create the keys of the data store data objects. Each object in an Amazon S3 bucket has a key that is its unique identifier in the bucket. Each object in a bucket has exactly one key. The prefix must end with a forward slash (/). 
     */
    keyPrefix?: S3KeyPrefix;
  }
  export interface IotSiteWiseCustomerManagedDatastoreS3StorageSummary {
    /**
     *  The name of the Amazon S3 bucket where your data is stored. 
     */
    bucket?: BucketName;
    /**
     *  (Optional) The prefix used to create the keys of the data store data objects. Each object in an Amazon S3 bucket has a key that is its unique identifier in the bucket. Each object in a bucket has exactly one key. The prefix must end with a forward slash (/). 
     */
    keyPrefix?: S3KeyPrefix;
  }
  export interface JsonConfiguration {
  }
  export interface LambdaActivity {
    /**
     * The name of the lambda activity.
     */
    name: ActivityName;
    /**
     * The name of the Lambda function that is run on the message.
     */
    lambdaName: LambdaName;
    /**
     * The number of messages passed to the Lambda function for processing. The Lambda function must be able to process all of these messages within five minutes, which is the maximum timeout duration for Lambda functions.
     */
    batchSize: ActivityBatchSize;
    /**
     * The next activity in the pipeline.
     */
    next?: ActivityName;
  }
  export type LambdaName = string;
  export interface LateDataRule {
    /**
     * The name of the late data rule.
     */
    ruleName?: LateDataRuleName;
    /**
     * The information needed to configure the late data rule.
     */
    ruleConfiguration: LateDataRuleConfiguration;
  }
  export interface LateDataRuleConfiguration {
    /**
     * The information needed to configure a delta time session window.
     */
    deltaTimeSessionWindowConfiguration?: DeltaTimeSessionWindowConfiguration;
  }
  export type LateDataRuleName = string;
  export type LateDataRules = LateDataRule[];
  export interface ListChannelsRequest {
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in this request. The default value is 100.
     */
    maxResults?: MaxResults;
  }
  export interface ListChannelsResponse {
    /**
     * A list of ChannelSummary objects.
     */
    channelSummaries?: ChannelSummaries;
    /**
     * The token to retrieve the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListDatasetContentsRequest {
    /**
     * The name of the dataset whose contents information you want to list.
     */
    datasetName: DatasetName;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in this request.
     */
    maxResults?: MaxResults;
    /**
     * A filter to limit results to those dataset contents whose creation is scheduled on or after the given time. See the field triggers.schedule in the CreateDataset request. (timestamp)
     */
    scheduledOnOrAfter?: Timestamp;
    /**
     * A filter to limit results to those dataset contents whose creation is scheduled before the given time. See the field triggers.schedule in the CreateDataset request. (timestamp)
     */
    scheduledBefore?: Timestamp;
  }
  export interface ListDatasetContentsResponse {
    /**
     * Summary information about dataset contents that have been created.
     */
    datasetContentSummaries?: DatasetContentSummaries;
    /**
     * The token to retrieve the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListDatasetsRequest {
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in this request. The default value is 100.
     */
    maxResults?: MaxResults;
  }
  export interface ListDatasetsResponse {
    /**
     * A list of DatasetSummary objects.
     */
    datasetSummaries?: DatasetSummaries;
    /**
     * The token to retrieve the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListDatastoresRequest {
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in this request. The default value is 100.
     */
    maxResults?: MaxResults;
  }
  export interface ListDatastoresResponse {
    /**
     * A list of DatastoreSummary objects.
     */
    datastoreSummaries?: DatastoreSummaries;
    /**
     * The token to retrieve the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListPipelinesRequest {
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in this request. The default value is 100.
     */
    maxResults?: MaxResults;
  }
  export interface ListPipelinesResponse {
    /**
     * A list of PipelineSummary objects.
     */
    pipelineSummaries?: PipelineSummaries;
    /**
     * The token to retrieve the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource whose tags you want to list.
     */
    resourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags (metadata) that you have assigned to the resource.
     */
    tags?: TagList;
  }
  export type LogResult = string;
  export type LoggingEnabled = boolean;
  export type LoggingLevel = "ERROR"|string;
  export interface LoggingOptions {
    /**
     * The ARN of the role that grants permission to IoT Analytics to perform logging.
     */
    roleArn: RoleArn;
    /**
     * The logging level. Currently, only ERROR is supported.
     */
    level: LoggingLevel;
    /**
     * If true, logging is enabled for IoT Analytics.
     */
    enabled: LoggingEnabled;
  }
  export interface MathActivity {
    /**
     * The name of the math activity.
     */
    name: ActivityName;
    /**
     * The name of the attribute that contains the result of the math operation.
     */
    attribute: AttributeName;
    /**
     * An expression that uses one or more existing attributes and must return an integer value.
     */
    math: MathExpression;
    /**
     * The next activity in the pipeline.
     */
    next?: ActivityName;
  }
  export type MathExpression = string;
  export type MaxMessages = number;
  export type MaxResults = number;
  export type MaxVersions = number;
  export interface Message {
    /**
     * The ID you want to assign to the message. Each messageId must be unique within each batch sent.
     */
    messageId: MessageId;
    /**
     * The payload of the message. This can be a JSON string or a base64-encoded string representing binary data, in which case you must decode it by means of a pipeline activity.
     */
    payload: MessagePayload;
  }
  export type MessageId = string;
  export type MessagePayload = Buffer|Uint8Array|Blob|string;
  export type MessagePayloads = MessagePayload[];
  export type Messages = Message[];
  export type NextToken = string;
  export type OffsetSeconds = number;
  export type OutputFileName = string;
  export interface OutputFileUriValue {
    /**
     * The URI of the location where dataset contents are stored, usually the URI of a file in an S3 bucket.
     */
    fileName: OutputFileName;
  }
  export interface ParquetConfiguration {
    /**
     * Information needed to define a schema.
     */
    schemaDefinition?: SchemaDefinition;
  }
  export interface Partition {
    /**
     *  The name of the attribute that defines a partition dimension. 
     */
    attributeName: PartitionAttributeName;
  }
  export type PartitionAttributeName = string;
  export type Partitions = DatastorePartition[];
  export interface Pipeline {
    /**
     * The name of the pipeline.
     */
    name?: PipelineName;
    /**
     * The ARN of the pipeline.
     */
    arn?: PipelineArn;
    /**
     * The activities that perform transformations on the messages.
     */
    activities?: PipelineActivities;
    /**
     * A summary of information about the pipeline reprocessing.
     */
    reprocessingSummaries?: ReprocessingSummaries;
    /**
     * When the pipeline was created.
     */
    creationTime?: Timestamp;
    /**
     * The last time the pipeline was updated.
     */
    lastUpdateTime?: Timestamp;
  }
  export type PipelineActivities = PipelineActivity[];
  export interface PipelineActivity {
    /**
     * Determines the source of the messages to be processed.
     */
    channel?: ChannelActivity;
    /**
     * Runs a Lambda function to modify the message.
     */
    lambda?: LambdaActivity;
    /**
     * Specifies where to store the processed message data.
     */
    datastore?: DatastoreActivity;
    /**
     * Adds other attributes based on existing attributes in the message.
     */
    addAttributes?: AddAttributesActivity;
    /**
     * Removes attributes from a message.
     */
    removeAttributes?: RemoveAttributesActivity;
    /**
     * Used to create a new message using only the specified attributes from the original message. 
     */
    selectAttributes?: SelectAttributesActivity;
    /**
     * Filters a message based on its attributes.
     */
    filter?: FilterActivity;
    /**
     * Computes an arithmetic expression using the message's attributes and adds it to the message.
     */
    math?: MathActivity;
    /**
     * Adds data from the IoT device registry to your message.
     */
    deviceRegistryEnrich?: DeviceRegistryEnrichActivity;
    /**
     * Adds information from the IoT Device Shadow service to a message.
     */
    deviceShadowEnrich?: DeviceShadowEnrichActivity;
  }
  export type PipelineArn = string;
  export type PipelineName = string;
  export type PipelineSummaries = PipelineSummary[];
  export interface PipelineSummary {
    /**
     * The name of the pipeline.
     */
    pipelineName?: PipelineName;
    /**
     * A summary of information about the pipeline reprocessing.
     */
    reprocessingSummaries?: ReprocessingSummaries;
    /**
     * When the pipeline was created.
     */
    creationTime?: Timestamp;
    /**
     * When the pipeline was last updated.
     */
    lastUpdateTime?: Timestamp;
  }
  export type PresignedURI = string;
  export interface PutLoggingOptionsRequest {
    /**
     * The new values of the IoT Analytics logging options.
     */
    loggingOptions: LoggingOptions;
  }
  export interface QueryFilter {
    /**
     * Used to limit data to that which has arrived since the last execution of the action.
     */
    deltaTime?: DeltaTime;
  }
  export type QueryFilters = QueryFilter[];
  export type Reason = string;
  export interface RemoveAttributesActivity {
    /**
     * The name of the removeAttributes activity.
     */
    name: ActivityName;
    /**
     * A list of 1-50 attributes to remove from the message.
     */
    attributes: AttributeNames;
    /**
     * The next activity in the pipeline.
     */
    next?: ActivityName;
  }
  export type ReprocessingId = string;
  export type ReprocessingStatus = "RUNNING"|"SUCCEEDED"|"CANCELLED"|"FAILED"|string;
  export type ReprocessingSummaries = ReprocessingSummary[];
  export interface ReprocessingSummary {
    /**
     * The reprocessingId returned by StartPipelineReprocessing.
     */
    id?: ReprocessingId;
    /**
     * The status of the pipeline reprocessing.
     */
    status?: ReprocessingStatus;
    /**
     * The time the pipeline reprocessing was created.
     */
    creationTime?: Timestamp;
  }
  export type ResourceArn = string;
  export interface ResourceConfiguration {
    /**
     * The type of the compute resource used to execute the containerAction. Possible values are: ACU_1 (vCPU=4, memory=16 GiB) or ACU_2 (vCPU=8, memory=32 GiB).
     */
    computeType: ComputeType;
    /**
     * The size, in GB, of the persistent storage available to the resource instance used to execute the containerAction (min: 1, max: 50).
     */
    volumeSizeInGB: VolumeSizeInGB;
  }
  export interface RetentionPeriod {
    /**
     * If true, message data is kept indefinitely.
     */
    unlimited?: UnlimitedRetentionPeriod;
    /**
     * The number of days that message data is kept. The unlimited parameter must be false.
     */
    numberOfDays?: RetentionPeriodInDays;
  }
  export type RetentionPeriodInDays = number;
  export type RoleArn = string;
  export interface RunPipelineActivityRequest {
    /**
     * The pipeline activity that is run. This must not be a channel activity or a data store activity because these activities are used in a pipeline only to load the original message and to store the (possibly) transformed message. If a Lambda activity is specified, only short-running Lambda functions (those with a timeout of less than 30 seconds or less) can be used.
     */
    pipelineActivity: PipelineActivity;
    /**
     * The sample message payloads on which the pipeline activity is run.
     */
    payloads: MessagePayloads;
  }
  export interface RunPipelineActivityResponse {
    /**
     * The enriched or transformed sample message payloads as base64-encoded strings. (The results of running the pipeline activity on each input sample message payload, encoded in base64.)
     */
    payloads?: MessagePayloads;
    /**
     * In case the pipeline activity fails, the log message that is generated.
     */
    logResult?: LogResult;
  }
  export interface S3DestinationConfiguration {
    /**
     * The name of the S3 bucket to which dataset contents are delivered.
     */
    bucket: BucketName;
    /**
     * The key of the dataset contents object in an S3 bucket. Each object has a key that is a unique identifier. Each object has exactly one key. You can create a unique key with the following options:   Use !{iotanalytics:scheduleTime} to insert the time of a scheduled SQL query run.   Use !{iotanalytics:versionId} to insert a unique hash that identifies a dataset content.   Use !{iotanalytics:creationTime} to insert the creation time of a dataset content.   The following example creates a unique key for a CSV file: dataset/mydataset/!{iotanalytics:scheduleTime}/!{iotanalytics:versionId}.csv   If you don't use !{iotanalytics:versionId} to specify the key, you might get duplicate keys. For example, you might have two dataset contents with the same scheduleTime but different versionIds. This means that one dataset content overwrites the other.  
     */
    key: BucketKeyExpression;
    /**
     * Configuration information for coordination with Glue, a fully managed extract, transform and load (ETL) service.
     */
    glueConfiguration?: GlueConfiguration;
    /**
     * The ARN of the role that grants IoT Analytics permission to interact with your Amazon S3 and Glue resources.
     */
    roleArn: RoleArn;
  }
  export type S3KeyPrefix = string;
  export type S3PathChannelMessage = string;
  export type S3PathChannelMessages = S3PathChannelMessage[];
  export interface SampleChannelDataRequest {
    /**
     * The name of the channel whose message samples are retrieved.
     */
    channelName: ChannelName;
    /**
     * The number of sample messages to be retrieved. The limit is 10. The default is also 10.
     */
    maxMessages?: MaxMessages;
    /**
     * The start of the time window from which sample messages are retrieved.
     */
    startTime?: StartTime;
    /**
     * The end of the time window from which sample messages are retrieved.
     */
    endTime?: EndTime;
  }
  export interface SampleChannelDataResponse {
    /**
     * The list of message samples. Each sample message is returned as a base64-encoded string.
     */
    payloads?: MessagePayloads;
  }
  export interface Schedule {
    /**
     * The expression that defines when to trigger an update. For more information, see Schedule Expressions for Rules in the Amazon CloudWatch Events User Guide.
     */
    expression?: ScheduleExpression;
  }
  export type ScheduleExpression = string;
  export interface SchemaDefinition {
    /**
     * Specifies one or more columns that store your data. Each schema can have up to 100 columns. Each column can have up to 100 nested types.
     */
    columns?: Columns;
  }
  export interface SelectAttributesActivity {
    /**
     * The name of the selectAttributes activity.
     */
    name: ActivityName;
    /**
     * A list of the attributes to select from the message.
     */
    attributes: AttributeNames;
    /**
     * The next activity in the pipeline.
     */
    next?: ActivityName;
  }
  export interface ServiceManagedChannelS3Storage {
  }
  export interface ServiceManagedChannelS3StorageSummary {
  }
  export interface ServiceManagedDatastoreS3Storage {
  }
  export interface ServiceManagedDatastoreS3StorageSummary {
  }
  export type SessionTimeoutInMinutes = number;
  export type SizeInBytes = number;
  export type SqlQuery = string;
  export interface SqlQueryDatasetAction {
    /**
     * A SQL query string.
     */
    sqlQuery: SqlQuery;
    /**
     * Prefilters applied to message data.
     */
    filters?: QueryFilters;
  }
  export interface StartPipelineReprocessingRequest {
    /**
     * The name of the pipeline on which to start reprocessing.
     */
    pipelineName: PipelineName;
    /**
     * The start time (inclusive) of raw message data that is reprocessed. If you specify a value for the startTime parameter, you must not use the channelMessages object.
     */
    startTime?: StartTime;
    /**
     * The end time (exclusive) of raw message data that is reprocessed. If you specify a value for the endTime parameter, you must not use the channelMessages object.
     */
    endTime?: EndTime;
    /**
     * Specifies one or more sets of channel messages that you want to reprocess. If you use the channelMessages object, you must not specify a value for startTime and endTime.
     */
    channelMessages?: ChannelMessages;
  }
  export interface StartPipelineReprocessingResponse {
    /**
     * The ID of the pipeline reprocessing activity that was started.
     */
    reprocessingId?: ReprocessingId;
  }
  export type StartTime = Date;
  export type StringValue = string;
  export interface Tag {
    /**
     * The tag's key.
     */
    key: TagKey;
    /**
     * The tag's value.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The ARN of the resource whose tags you want to modify.
     */
    resourceArn: ResourceArn;
    /**
     * The new or modified tags for the resource.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TimeExpression = string;
  export type Timestamp = Date;
  export type TimestampFormat = string;
  export interface TimestampPartition {
    /**
     *  The attribute name of the partition defined by a timestamp. 
     */
    attributeName: PartitionAttributeName;
    /**
     *  The timestamp format of a partition defined by a timestamp. The default format is seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    timestampFormat?: TimestampFormat;
  }
  export interface TriggeringDataset {
    /**
     * The name of the dataset whose content generation triggers the new dataset content generation.
     */
    name: DatasetName;
  }
  export type UnlimitedRetentionPeriod = boolean;
  export type UnlimitedVersioning = boolean;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource whose tags you want to remove.
     */
    resourceArn: ResourceArn;
    /**
     * The keys of those tags which you want to remove.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateChannelRequest {
    /**
     * The name of the channel to be updated.
     */
    channelName: ChannelName;
    /**
     * Where channel data is stored. You can choose one of serviceManagedS3 or customerManagedS3 storage. If not specified, the default is serviceManagedS3. You can't change this storage option after the channel is created.
     */
    channelStorage?: ChannelStorage;
    /**
     * How long, in days, message data is kept for the channel. The retention period can't be updated if the channel's Amazon S3 storage is customer-managed.
     */
    retentionPeriod?: RetentionPeriod;
  }
  export interface UpdateDatasetRequest {
    /**
     * The name of the dataset to update.
     */
    datasetName: DatasetName;
    /**
     * A list of DatasetAction objects.
     */
    actions: DatasetActions;
    /**
     * A list of DatasetTrigger objects. The list can be empty or can contain up to five DatasetTrigger objects.
     */
    triggers?: DatasetTriggers;
    /**
     * When dataset contents are created, they are delivered to destinations specified here.
     */
    contentDeliveryRules?: DatasetContentDeliveryRules;
    /**
     * How long, in days, dataset contents are kept for the dataset.
     */
    retentionPeriod?: RetentionPeriod;
    /**
     * Optional. How many versions of dataset contents are kept. If not specified or set to null, only the latest version plus the latest succeeded version (if they are different) are kept for the time period specified by the retentionPeriod parameter. For more information, see Keeping Multiple Versions of IoT Analytics datasets in the IoT Analytics User Guide.
     */
    versioningConfiguration?: VersioningConfiguration;
    /**
     * A list of data rules that send notifications to CloudWatch, when data arrives late. To specify lateDataRules, the dataset must use a DeltaTimer filter.
     */
    lateDataRules?: LateDataRules;
  }
  export interface UpdateDatastoreRequest {
    /**
     * The name of the data store to be updated.
     */
    datastoreName: DatastoreName;
    /**
     * How long, in days, message data is kept for the data store. The retention period can't be updated if the data store's Amazon S3 storage is customer-managed.
     */
    retentionPeriod?: RetentionPeriod;
    /**
     * Where data in a data store is stored.. You can choose serviceManagedS3 storage, customerManagedS3 storage, or iotSiteWiseMultiLayerStorage storage. The default is serviceManagedS3. You can't change the choice of Amazon S3 storage after your data store is created. 
     */
    datastoreStorage?: DatastoreStorage;
    /**
     * Contains the configuration information of file formats. IoT Analytics data stores support JSON and Parquet. The default file format is JSON. You can specify only one format. You can't change the file format after you create the data store.
     */
    fileFormatConfiguration?: FileFormatConfiguration;
  }
  export interface UpdatePipelineRequest {
    /**
     * The name of the pipeline to update.
     */
    pipelineName: PipelineName;
    /**
     * A list of PipelineActivity objects. Activities perform transformations on your messages, such as removing, renaming or adding message attributes; filtering messages based on attribute values; invoking your Lambda functions on messages for advanced processing; or performing mathematical transformations to normalize device data. The list can be 2-25 PipelineActivity objects and must contain both a channel and a datastore activity. Each entry in the list must contain only one activity. For example:  pipelineActivities = [ { "channel": { ... } }, { "lambda": { ... } }, ... ] 
     */
    pipelineActivities: PipelineActivities;
  }
  export interface Variable {
    /**
     * The name of the variable.
     */
    name: VariableName;
    /**
     * The value of the variable as a string.
     */
    stringValue?: StringValue;
    /**
     * The value of the variable as a double (numeric).
     */
    doubleValue?: DoubleValue;
    /**
     * The value of the variable as a structure that specifies a dataset content version.
     */
    datasetContentVersionValue?: DatasetContentVersionValue;
    /**
     * The value of the variable as a structure that specifies an output file URI.
     */
    outputFileUriValue?: OutputFileUriValue;
  }
  export type VariableName = string;
  export type Variables = Variable[];
  export interface VersioningConfiguration {
    /**
     * If true, unlimited versions of dataset contents are kept.
     */
    unlimited?: UnlimitedVersioning;
    /**
     * How many versions of dataset contents are kept. The unlimited parameter must be false.
     */
    maxVersions?: MaxVersions;
  }
  export type VolumeSizeInGB = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-11-27"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IoTAnalytics client.
   */
  export import Types = IoTAnalytics;
}
export = IoTAnalytics;
