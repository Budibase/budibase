import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class KinesisVideo extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: KinesisVideo.Types.ClientConfiguration)
  config: Config & KinesisVideo.Types.ClientConfiguration;
  /**
   * Creates a signaling channel.   CreateSignalingChannel is an asynchronous operation.
   */
  createSignalingChannel(params: KinesisVideo.Types.CreateSignalingChannelInput, callback?: (err: AWSError, data: KinesisVideo.Types.CreateSignalingChannelOutput) => void): Request<KinesisVideo.Types.CreateSignalingChannelOutput, AWSError>;
  /**
   * Creates a signaling channel.   CreateSignalingChannel is an asynchronous operation.
   */
  createSignalingChannel(callback?: (err: AWSError, data: KinesisVideo.Types.CreateSignalingChannelOutput) => void): Request<KinesisVideo.Types.CreateSignalingChannelOutput, AWSError>;
  /**
   * Creates a new Kinesis video stream.  When you create a new stream, Kinesis Video Streams assigns it a version number. When you change the stream's metadata, Kinesis Video Streams updates the version.   CreateStream is an asynchronous operation. For information about how the service works, see How it Works.  You must have permissions for the KinesisVideo:CreateStream action.
   */
  createStream(params: KinesisVideo.Types.CreateStreamInput, callback?: (err: AWSError, data: KinesisVideo.Types.CreateStreamOutput) => void): Request<KinesisVideo.Types.CreateStreamOutput, AWSError>;
  /**
   * Creates a new Kinesis video stream.  When you create a new stream, Kinesis Video Streams assigns it a version number. When you change the stream's metadata, Kinesis Video Streams updates the version.   CreateStream is an asynchronous operation. For information about how the service works, see How it Works.  You must have permissions for the KinesisVideo:CreateStream action.
   */
  createStream(callback?: (err: AWSError, data: KinesisVideo.Types.CreateStreamOutput) => void): Request<KinesisVideo.Types.CreateStreamOutput, AWSError>;
  /**
   * An asynchronous API that deletes a stream’s existing edge configuration, as well as the corresponding media from the Edge Agent. When you invoke this API, the sync status is set to DELETING. A deletion process starts, in which active edge jobs are stopped and all media is deleted from the edge device. The time to delete varies, depending on the total amount of stored media. If the deletion process fails, the sync status changes to DELETE_FAILED. You will need to re-try the deletion. When the deletion process has completed successfully, the edge configuration is no longer accessible.
   */
  deleteEdgeConfiguration(params: KinesisVideo.Types.DeleteEdgeConfigurationInput, callback?: (err: AWSError, data: KinesisVideo.Types.DeleteEdgeConfigurationOutput) => void): Request<KinesisVideo.Types.DeleteEdgeConfigurationOutput, AWSError>;
  /**
   * An asynchronous API that deletes a stream’s existing edge configuration, as well as the corresponding media from the Edge Agent. When you invoke this API, the sync status is set to DELETING. A deletion process starts, in which active edge jobs are stopped and all media is deleted from the edge device. The time to delete varies, depending on the total amount of stored media. If the deletion process fails, the sync status changes to DELETE_FAILED. You will need to re-try the deletion. When the deletion process has completed successfully, the edge configuration is no longer accessible.
   */
  deleteEdgeConfiguration(callback?: (err: AWSError, data: KinesisVideo.Types.DeleteEdgeConfigurationOutput) => void): Request<KinesisVideo.Types.DeleteEdgeConfigurationOutput, AWSError>;
  /**
   * Deletes a specified signaling channel. DeleteSignalingChannel is an asynchronous operation. If you don't specify the channel's current version, the most recent version is deleted.
   */
  deleteSignalingChannel(params: KinesisVideo.Types.DeleteSignalingChannelInput, callback?: (err: AWSError, data: KinesisVideo.Types.DeleteSignalingChannelOutput) => void): Request<KinesisVideo.Types.DeleteSignalingChannelOutput, AWSError>;
  /**
   * Deletes a specified signaling channel. DeleteSignalingChannel is an asynchronous operation. If you don't specify the channel's current version, the most recent version is deleted.
   */
  deleteSignalingChannel(callback?: (err: AWSError, data: KinesisVideo.Types.DeleteSignalingChannelOutput) => void): Request<KinesisVideo.Types.DeleteSignalingChannelOutput, AWSError>;
  /**
   * Deletes a Kinesis video stream and the data contained in the stream.  This method marks the stream for deletion, and makes the data in the stream inaccessible immediately.    To ensure that you have the latest version of the stream before deleting it, you can specify the stream version. Kinesis Video Streams assigns a version to each stream. When you update a stream, Kinesis Video Streams assigns a new version number. To get the latest stream version, use the DescribeStream API.  This operation requires permission for the KinesisVideo:DeleteStream action.
   */
  deleteStream(params: KinesisVideo.Types.DeleteStreamInput, callback?: (err: AWSError, data: KinesisVideo.Types.DeleteStreamOutput) => void): Request<KinesisVideo.Types.DeleteStreamOutput, AWSError>;
  /**
   * Deletes a Kinesis video stream and the data contained in the stream.  This method marks the stream for deletion, and makes the data in the stream inaccessible immediately.    To ensure that you have the latest version of the stream before deleting it, you can specify the stream version. Kinesis Video Streams assigns a version to each stream. When you update a stream, Kinesis Video Streams assigns a new version number. To get the latest stream version, use the DescribeStream API.  This operation requires permission for the KinesisVideo:DeleteStream action.
   */
  deleteStream(callback?: (err: AWSError, data: KinesisVideo.Types.DeleteStreamOutput) => void): Request<KinesisVideo.Types.DeleteStreamOutput, AWSError>;
  /**
   * Describes a stream’s edge configuration that was set using the StartEdgeConfigurationUpdate API and the latest status of the edge agent's recorder and uploader jobs. Use this API to get the status of the configuration to determine if the configuration is in sync with the Edge Agent. Use this API to evaluate the health of the Edge Agent.
   */
  describeEdgeConfiguration(params: KinesisVideo.Types.DescribeEdgeConfigurationInput, callback?: (err: AWSError, data: KinesisVideo.Types.DescribeEdgeConfigurationOutput) => void): Request<KinesisVideo.Types.DescribeEdgeConfigurationOutput, AWSError>;
  /**
   * Describes a stream’s edge configuration that was set using the StartEdgeConfigurationUpdate API and the latest status of the edge agent's recorder and uploader jobs. Use this API to get the status of the configuration to determine if the configuration is in sync with the Edge Agent. Use this API to evaluate the health of the Edge Agent.
   */
  describeEdgeConfiguration(callback?: (err: AWSError, data: KinesisVideo.Types.DescribeEdgeConfigurationOutput) => void): Request<KinesisVideo.Types.DescribeEdgeConfigurationOutput, AWSError>;
  /**
   * Gets the ImageGenerationConfiguration for a given Kinesis video stream.
   */
  describeImageGenerationConfiguration(params: KinesisVideo.Types.DescribeImageGenerationConfigurationInput, callback?: (err: AWSError, data: KinesisVideo.Types.DescribeImageGenerationConfigurationOutput) => void): Request<KinesisVideo.Types.DescribeImageGenerationConfigurationOutput, AWSError>;
  /**
   * Gets the ImageGenerationConfiguration for a given Kinesis video stream.
   */
  describeImageGenerationConfiguration(callback?: (err: AWSError, data: KinesisVideo.Types.DescribeImageGenerationConfigurationOutput) => void): Request<KinesisVideo.Types.DescribeImageGenerationConfigurationOutput, AWSError>;
  /**
   * Returns the most current information about the stream. The streamName or streamARN should be provided in the input.
   */
  describeMappedResourceConfiguration(params: KinesisVideo.Types.DescribeMappedResourceConfigurationInput, callback?: (err: AWSError, data: KinesisVideo.Types.DescribeMappedResourceConfigurationOutput) => void): Request<KinesisVideo.Types.DescribeMappedResourceConfigurationOutput, AWSError>;
  /**
   * Returns the most current information about the stream. The streamName or streamARN should be provided in the input.
   */
  describeMappedResourceConfiguration(callback?: (err: AWSError, data: KinesisVideo.Types.DescribeMappedResourceConfigurationOutput) => void): Request<KinesisVideo.Types.DescribeMappedResourceConfigurationOutput, AWSError>;
  /**
   *  This API is related to WebRTC Ingestion and is only available in the us-west-2 region.  Returns the most current information about the channel. Specify the ChannelName or ChannelARN in the input.
   */
  describeMediaStorageConfiguration(params: KinesisVideo.Types.DescribeMediaStorageConfigurationInput, callback?: (err: AWSError, data: KinesisVideo.Types.DescribeMediaStorageConfigurationOutput) => void): Request<KinesisVideo.Types.DescribeMediaStorageConfigurationOutput, AWSError>;
  /**
   *  This API is related to WebRTC Ingestion and is only available in the us-west-2 region.  Returns the most current information about the channel. Specify the ChannelName or ChannelARN in the input.
   */
  describeMediaStorageConfiguration(callback?: (err: AWSError, data: KinesisVideo.Types.DescribeMediaStorageConfigurationOutput) => void): Request<KinesisVideo.Types.DescribeMediaStorageConfigurationOutput, AWSError>;
  /**
   * Gets the NotificationConfiguration for a given Kinesis video stream.
   */
  describeNotificationConfiguration(params: KinesisVideo.Types.DescribeNotificationConfigurationInput, callback?: (err: AWSError, data: KinesisVideo.Types.DescribeNotificationConfigurationOutput) => void): Request<KinesisVideo.Types.DescribeNotificationConfigurationOutput, AWSError>;
  /**
   * Gets the NotificationConfiguration for a given Kinesis video stream.
   */
  describeNotificationConfiguration(callback?: (err: AWSError, data: KinesisVideo.Types.DescribeNotificationConfigurationOutput) => void): Request<KinesisVideo.Types.DescribeNotificationConfigurationOutput, AWSError>;
  /**
   * Returns the most current information about the signaling channel. You must specify either the name or the Amazon Resource Name (ARN) of the channel that you want to describe.
   */
  describeSignalingChannel(params: KinesisVideo.Types.DescribeSignalingChannelInput, callback?: (err: AWSError, data: KinesisVideo.Types.DescribeSignalingChannelOutput) => void): Request<KinesisVideo.Types.DescribeSignalingChannelOutput, AWSError>;
  /**
   * Returns the most current information about the signaling channel. You must specify either the name or the Amazon Resource Name (ARN) of the channel that you want to describe.
   */
  describeSignalingChannel(callback?: (err: AWSError, data: KinesisVideo.Types.DescribeSignalingChannelOutput) => void): Request<KinesisVideo.Types.DescribeSignalingChannelOutput, AWSError>;
  /**
   * Returns the most current information about the specified stream. You must specify either the StreamName or the StreamARN. 
   */
  describeStream(params: KinesisVideo.Types.DescribeStreamInput, callback?: (err: AWSError, data: KinesisVideo.Types.DescribeStreamOutput) => void): Request<KinesisVideo.Types.DescribeStreamOutput, AWSError>;
  /**
   * Returns the most current information about the specified stream. You must specify either the StreamName or the StreamARN. 
   */
  describeStream(callback?: (err: AWSError, data: KinesisVideo.Types.DescribeStreamOutput) => void): Request<KinesisVideo.Types.DescribeStreamOutput, AWSError>;
  /**
   * Gets an endpoint for a specified stream for either reading or writing. Use this endpoint in your application to read from the specified stream (using the GetMedia or GetMediaForFragmentList operations) or write to it (using the PutMedia operation).   The returned endpoint does not have the API name appended. The client needs to add the API name to the returned endpoint.  In the request, specify the stream either by StreamName or StreamARN.
   */
  getDataEndpoint(params: KinesisVideo.Types.GetDataEndpointInput, callback?: (err: AWSError, data: KinesisVideo.Types.GetDataEndpointOutput) => void): Request<KinesisVideo.Types.GetDataEndpointOutput, AWSError>;
  /**
   * Gets an endpoint for a specified stream for either reading or writing. Use this endpoint in your application to read from the specified stream (using the GetMedia or GetMediaForFragmentList operations) or write to it (using the PutMedia operation).   The returned endpoint does not have the API name appended. The client needs to add the API name to the returned endpoint.  In the request, specify the stream either by StreamName or StreamARN.
   */
  getDataEndpoint(callback?: (err: AWSError, data: KinesisVideo.Types.GetDataEndpointOutput) => void): Request<KinesisVideo.Types.GetDataEndpointOutput, AWSError>;
  /**
   * Provides an endpoint for the specified signaling channel to send and receive messages. This API uses the SingleMasterChannelEndpointConfiguration input parameter, which consists of the Protocols and Role properties.  Protocols is used to determine the communication mechanism. For example, if you specify WSS as the protocol, this API produces a secure websocket endpoint. If you specify HTTPS as the protocol, this API generates an HTTPS endpoint.   Role determines the messaging permissions. A MASTER role results in this API generating an endpoint that a client can use to communicate with any of the viewers on the channel. A VIEWER role results in this API generating an endpoint that a client can use to communicate only with a MASTER. 
   */
  getSignalingChannelEndpoint(params: KinesisVideo.Types.GetSignalingChannelEndpointInput, callback?: (err: AWSError, data: KinesisVideo.Types.GetSignalingChannelEndpointOutput) => void): Request<KinesisVideo.Types.GetSignalingChannelEndpointOutput, AWSError>;
  /**
   * Provides an endpoint for the specified signaling channel to send and receive messages. This API uses the SingleMasterChannelEndpointConfiguration input parameter, which consists of the Protocols and Role properties.  Protocols is used to determine the communication mechanism. For example, if you specify WSS as the protocol, this API produces a secure websocket endpoint. If you specify HTTPS as the protocol, this API generates an HTTPS endpoint.   Role determines the messaging permissions. A MASTER role results in this API generating an endpoint that a client can use to communicate with any of the viewers on the channel. A VIEWER role results in this API generating an endpoint that a client can use to communicate only with a MASTER. 
   */
  getSignalingChannelEndpoint(callback?: (err: AWSError, data: KinesisVideo.Types.GetSignalingChannelEndpointOutput) => void): Request<KinesisVideo.Types.GetSignalingChannelEndpointOutput, AWSError>;
  /**
   * Returns an array of edge configurations associated with the specified Edge Agent. In the request, you must specify the Edge Agent HubDeviceArn.
   */
  listEdgeAgentConfigurations(params: KinesisVideo.Types.ListEdgeAgentConfigurationsInput, callback?: (err: AWSError, data: KinesisVideo.Types.ListEdgeAgentConfigurationsOutput) => void): Request<KinesisVideo.Types.ListEdgeAgentConfigurationsOutput, AWSError>;
  /**
   * Returns an array of edge configurations associated with the specified Edge Agent. In the request, you must specify the Edge Agent HubDeviceArn.
   */
  listEdgeAgentConfigurations(callback?: (err: AWSError, data: KinesisVideo.Types.ListEdgeAgentConfigurationsOutput) => void): Request<KinesisVideo.Types.ListEdgeAgentConfigurationsOutput, AWSError>;
  /**
   * Returns an array of ChannelInfo objects. Each object describes a signaling channel. To retrieve only those channels that satisfy a specific condition, you can specify a ChannelNameCondition.
   */
  listSignalingChannels(params: KinesisVideo.Types.ListSignalingChannelsInput, callback?: (err: AWSError, data: KinesisVideo.Types.ListSignalingChannelsOutput) => void): Request<KinesisVideo.Types.ListSignalingChannelsOutput, AWSError>;
  /**
   * Returns an array of ChannelInfo objects. Each object describes a signaling channel. To retrieve only those channels that satisfy a specific condition, you can specify a ChannelNameCondition.
   */
  listSignalingChannels(callback?: (err: AWSError, data: KinesisVideo.Types.ListSignalingChannelsOutput) => void): Request<KinesisVideo.Types.ListSignalingChannelsOutput, AWSError>;
  /**
   * Returns an array of StreamInfo objects. Each object describes a stream. To retrieve only streams that satisfy a specific condition, you can specify a StreamNameCondition. 
   */
  listStreams(params: KinesisVideo.Types.ListStreamsInput, callback?: (err: AWSError, data: KinesisVideo.Types.ListStreamsOutput) => void): Request<KinesisVideo.Types.ListStreamsOutput, AWSError>;
  /**
   * Returns an array of StreamInfo objects. Each object describes a stream. To retrieve only streams that satisfy a specific condition, you can specify a StreamNameCondition. 
   */
  listStreams(callback?: (err: AWSError, data: KinesisVideo.Types.ListStreamsOutput) => void): Request<KinesisVideo.Types.ListStreamsOutput, AWSError>;
  /**
   * Returns a list of tags associated with the specified signaling channel.
   */
  listTagsForResource(params: KinesisVideo.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: KinesisVideo.Types.ListTagsForResourceOutput) => void): Request<KinesisVideo.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Returns a list of tags associated with the specified signaling channel.
   */
  listTagsForResource(callback?: (err: AWSError, data: KinesisVideo.Types.ListTagsForResourceOutput) => void): Request<KinesisVideo.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Returns a list of tags associated with the specified stream. In the request, you must specify either the StreamName or the StreamARN. 
   */
  listTagsForStream(params: KinesisVideo.Types.ListTagsForStreamInput, callback?: (err: AWSError, data: KinesisVideo.Types.ListTagsForStreamOutput) => void): Request<KinesisVideo.Types.ListTagsForStreamOutput, AWSError>;
  /**
   * Returns a list of tags associated with the specified stream. In the request, you must specify either the StreamName or the StreamARN. 
   */
  listTagsForStream(callback?: (err: AWSError, data: KinesisVideo.Types.ListTagsForStreamOutput) => void): Request<KinesisVideo.Types.ListTagsForStreamOutput, AWSError>;
  /**
   * An asynchronous API that updates a stream’s existing edge configuration. The Kinesis Video Stream will sync the stream’s edge configuration with the Edge Agent IoT Greengrass component that runs on an IoT Hub Device, setup at your premise. The time to sync can vary and depends on the connectivity of the Hub Device. The SyncStatus will be updated as the edge configuration is acknowledged, and synced with the Edge Agent.  If this API is invoked for the first time, a new edge configuration will be created for the stream, and the sync status will be set to SYNCING. You will have to wait for the sync status to reach a terminal state such as: IN_SYNC, or SYNC_FAILED, before using this API again. If you invoke this API during the syncing process, a ResourceInUseException will be thrown. The connectivity of the stream’s edge configuration and the Edge Agent will be retried for 15 minutes. After 15 minutes, the status will transition into the SYNC_FAILED state. To move an edge configuration from one device to another, use DeleteEdgeConfiguration to delete the current edge configuration. You can then invoke StartEdgeConfigurationUpdate with an updated Hub Device ARN.
   */
  startEdgeConfigurationUpdate(params: KinesisVideo.Types.StartEdgeConfigurationUpdateInput, callback?: (err: AWSError, data: KinesisVideo.Types.StartEdgeConfigurationUpdateOutput) => void): Request<KinesisVideo.Types.StartEdgeConfigurationUpdateOutput, AWSError>;
  /**
   * An asynchronous API that updates a stream’s existing edge configuration. The Kinesis Video Stream will sync the stream’s edge configuration with the Edge Agent IoT Greengrass component that runs on an IoT Hub Device, setup at your premise. The time to sync can vary and depends on the connectivity of the Hub Device. The SyncStatus will be updated as the edge configuration is acknowledged, and synced with the Edge Agent.  If this API is invoked for the first time, a new edge configuration will be created for the stream, and the sync status will be set to SYNCING. You will have to wait for the sync status to reach a terminal state such as: IN_SYNC, or SYNC_FAILED, before using this API again. If you invoke this API during the syncing process, a ResourceInUseException will be thrown. The connectivity of the stream’s edge configuration and the Edge Agent will be retried for 15 minutes. After 15 minutes, the status will transition into the SYNC_FAILED state. To move an edge configuration from one device to another, use DeleteEdgeConfiguration to delete the current edge configuration. You can then invoke StartEdgeConfigurationUpdate with an updated Hub Device ARN.
   */
  startEdgeConfigurationUpdate(callback?: (err: AWSError, data: KinesisVideo.Types.StartEdgeConfigurationUpdateOutput) => void): Request<KinesisVideo.Types.StartEdgeConfigurationUpdateOutput, AWSError>;
  /**
   * Adds one or more tags to a signaling channel. A tag is a key-value pair (the value is optional) that you can define and assign to Amazon Web Services resources. If you specify a tag that already exists, the tag value is replaced with the value that you specify in the request. For more information, see Using Cost Allocation Tags in the Billing and Cost Management and Cost Management User Guide.
   */
  tagResource(params: KinesisVideo.Types.TagResourceInput, callback?: (err: AWSError, data: KinesisVideo.Types.TagResourceOutput) => void): Request<KinesisVideo.Types.TagResourceOutput, AWSError>;
  /**
   * Adds one or more tags to a signaling channel. A tag is a key-value pair (the value is optional) that you can define and assign to Amazon Web Services resources. If you specify a tag that already exists, the tag value is replaced with the value that you specify in the request. For more information, see Using Cost Allocation Tags in the Billing and Cost Management and Cost Management User Guide.
   */
  tagResource(callback?: (err: AWSError, data: KinesisVideo.Types.TagResourceOutput) => void): Request<KinesisVideo.Types.TagResourceOutput, AWSError>;
  /**
   * Adds one or more tags to a stream. A tag is a key-value pair (the value is optional) that you can define and assign to Amazon Web Services resources. If you specify a tag that already exists, the tag value is replaced with the value that you specify in the request. For more information, see Using Cost Allocation Tags in the Billing and Cost Management and Cost Management User Guide.  You must provide either the StreamName or the StreamARN. This operation requires permission for the KinesisVideo:TagStream action. A Kinesis video stream can support up to 50 tags.
   */
  tagStream(params: KinesisVideo.Types.TagStreamInput, callback?: (err: AWSError, data: KinesisVideo.Types.TagStreamOutput) => void): Request<KinesisVideo.Types.TagStreamOutput, AWSError>;
  /**
   * Adds one or more tags to a stream. A tag is a key-value pair (the value is optional) that you can define and assign to Amazon Web Services resources. If you specify a tag that already exists, the tag value is replaced with the value that you specify in the request. For more information, see Using Cost Allocation Tags in the Billing and Cost Management and Cost Management User Guide.  You must provide either the StreamName or the StreamARN. This operation requires permission for the KinesisVideo:TagStream action. A Kinesis video stream can support up to 50 tags.
   */
  tagStream(callback?: (err: AWSError, data: KinesisVideo.Types.TagStreamOutput) => void): Request<KinesisVideo.Types.TagStreamOutput, AWSError>;
  /**
   * Removes one or more tags from a signaling channel. In the request, specify only a tag key or keys; don't specify the value. If you specify a tag key that does not exist, it's ignored.
   */
  untagResource(params: KinesisVideo.Types.UntagResourceInput, callback?: (err: AWSError, data: KinesisVideo.Types.UntagResourceOutput) => void): Request<KinesisVideo.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes one or more tags from a signaling channel. In the request, specify only a tag key or keys; don't specify the value. If you specify a tag key that does not exist, it's ignored.
   */
  untagResource(callback?: (err: AWSError, data: KinesisVideo.Types.UntagResourceOutput) => void): Request<KinesisVideo.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes one or more tags from a stream. In the request, specify only a tag key or keys; don't specify the value. If you specify a tag key that does not exist, it's ignored. In the request, you must provide the StreamName or StreamARN.
   */
  untagStream(params: KinesisVideo.Types.UntagStreamInput, callback?: (err: AWSError, data: KinesisVideo.Types.UntagStreamOutput) => void): Request<KinesisVideo.Types.UntagStreamOutput, AWSError>;
  /**
   * Removes one or more tags from a stream. In the request, specify only a tag key or keys; don't specify the value. If you specify a tag key that does not exist, it's ignored. In the request, you must provide the StreamName or StreamARN.
   */
  untagStream(callback?: (err: AWSError, data: KinesisVideo.Types.UntagStreamOutput) => void): Request<KinesisVideo.Types.UntagStreamOutput, AWSError>;
  /**
   *  Increases or decreases the stream's data retention period by the value that you specify. To indicate whether you want to increase or decrease the data retention period, specify the Operation parameter in the request body. In the request, you must specify either the StreamName or the StreamARN.   The retention period that you specify replaces the current value.  This operation requires permission for the KinesisVideo:UpdateDataRetention action. Changing the data retention period affects the data in the stream as follows:   If the data retention period is increased, existing data is retained for the new retention period. For example, if the data retention period is increased from one hour to seven hours, all existing data is retained for seven hours.   If the data retention period is decreased, existing data is retained for the new retention period. For example, if the data retention period is decreased from seven hours to one hour, all existing data is retained for one hour, and any data older than one hour is deleted immediately.  
   */
  updateDataRetention(params: KinesisVideo.Types.UpdateDataRetentionInput, callback?: (err: AWSError, data: KinesisVideo.Types.UpdateDataRetentionOutput) => void): Request<KinesisVideo.Types.UpdateDataRetentionOutput, AWSError>;
  /**
   *  Increases or decreases the stream's data retention period by the value that you specify. To indicate whether you want to increase or decrease the data retention period, specify the Operation parameter in the request body. In the request, you must specify either the StreamName or the StreamARN.   The retention period that you specify replaces the current value.  This operation requires permission for the KinesisVideo:UpdateDataRetention action. Changing the data retention period affects the data in the stream as follows:   If the data retention period is increased, existing data is retained for the new retention period. For example, if the data retention period is increased from one hour to seven hours, all existing data is retained for seven hours.   If the data retention period is decreased, existing data is retained for the new retention period. For example, if the data retention period is decreased from seven hours to one hour, all existing data is retained for one hour, and any data older than one hour is deleted immediately.  
   */
  updateDataRetention(callback?: (err: AWSError, data: KinesisVideo.Types.UpdateDataRetentionOutput) => void): Request<KinesisVideo.Types.UpdateDataRetentionOutput, AWSError>;
  /**
   * Updates the StreamInfo and ImageProcessingConfiguration fields.
   */
  updateImageGenerationConfiguration(params: KinesisVideo.Types.UpdateImageGenerationConfigurationInput, callback?: (err: AWSError, data: KinesisVideo.Types.UpdateImageGenerationConfigurationOutput) => void): Request<KinesisVideo.Types.UpdateImageGenerationConfigurationOutput, AWSError>;
  /**
   * Updates the StreamInfo and ImageProcessingConfiguration fields.
   */
  updateImageGenerationConfiguration(callback?: (err: AWSError, data: KinesisVideo.Types.UpdateImageGenerationConfigurationOutput) => void): Request<KinesisVideo.Types.UpdateImageGenerationConfigurationOutput, AWSError>;
  /**
   *  This API is related to WebRTC Ingestion and is only available in the us-west-2 region.  Associates a SignalingChannel to a stream to store the media. There are two signaling modes that can specified :   If the StorageStatus is disabled, no data will be stored, and the StreamARN parameter will not be needed.    If the StorageStatus is enabled, the data will be stored in the StreamARN provided.     If StorageStatus is enabled, direct peer-to-peer (master-viewer) connections no longer occur. Peers connect directly to the storage session. You must call the JoinStorageSession API to trigger an SDP offer send and establish a connection between a peer and the storage session.  
   */
  updateMediaStorageConfiguration(params: KinesisVideo.Types.UpdateMediaStorageConfigurationInput, callback?: (err: AWSError, data: KinesisVideo.Types.UpdateMediaStorageConfigurationOutput) => void): Request<KinesisVideo.Types.UpdateMediaStorageConfigurationOutput, AWSError>;
  /**
   *  This API is related to WebRTC Ingestion and is only available in the us-west-2 region.  Associates a SignalingChannel to a stream to store the media. There are two signaling modes that can specified :   If the StorageStatus is disabled, no data will be stored, and the StreamARN parameter will not be needed.    If the StorageStatus is enabled, the data will be stored in the StreamARN provided.     If StorageStatus is enabled, direct peer-to-peer (master-viewer) connections no longer occur. Peers connect directly to the storage session. You must call the JoinStorageSession API to trigger an SDP offer send and establish a connection between a peer and the storage session.  
   */
  updateMediaStorageConfiguration(callback?: (err: AWSError, data: KinesisVideo.Types.UpdateMediaStorageConfigurationOutput) => void): Request<KinesisVideo.Types.UpdateMediaStorageConfigurationOutput, AWSError>;
  /**
   * Updates the notification information for a stream.
   */
  updateNotificationConfiguration(params: KinesisVideo.Types.UpdateNotificationConfigurationInput, callback?: (err: AWSError, data: KinesisVideo.Types.UpdateNotificationConfigurationOutput) => void): Request<KinesisVideo.Types.UpdateNotificationConfigurationOutput, AWSError>;
  /**
   * Updates the notification information for a stream.
   */
  updateNotificationConfiguration(callback?: (err: AWSError, data: KinesisVideo.Types.UpdateNotificationConfigurationOutput) => void): Request<KinesisVideo.Types.UpdateNotificationConfigurationOutput, AWSError>;
  /**
   * Updates the existing signaling channel. This is an asynchronous operation and takes time to complete.  If the MessageTtlSeconds value is updated (either increased or reduced), it only applies to new messages sent via this channel after it's been updated. Existing messages are still expired as per the previous MessageTtlSeconds value.
   */
  updateSignalingChannel(params: KinesisVideo.Types.UpdateSignalingChannelInput, callback?: (err: AWSError, data: KinesisVideo.Types.UpdateSignalingChannelOutput) => void): Request<KinesisVideo.Types.UpdateSignalingChannelOutput, AWSError>;
  /**
   * Updates the existing signaling channel. This is an asynchronous operation and takes time to complete.  If the MessageTtlSeconds value is updated (either increased or reduced), it only applies to new messages sent via this channel after it's been updated. Existing messages are still expired as per the previous MessageTtlSeconds value.
   */
  updateSignalingChannel(callback?: (err: AWSError, data: KinesisVideo.Types.UpdateSignalingChannelOutput) => void): Request<KinesisVideo.Types.UpdateSignalingChannelOutput, AWSError>;
  /**
   * Updates stream metadata, such as the device name and media type. You must provide the stream name or the Amazon Resource Name (ARN) of the stream. To make sure that you have the latest version of the stream before updating it, you can specify the stream version. Kinesis Video Streams assigns a version to each stream. When you update a stream, Kinesis Video Streams assigns a new version number. To get the latest stream version, use the DescribeStream API.   UpdateStream is an asynchronous operation, and takes time to complete.
   */
  updateStream(params: KinesisVideo.Types.UpdateStreamInput, callback?: (err: AWSError, data: KinesisVideo.Types.UpdateStreamOutput) => void): Request<KinesisVideo.Types.UpdateStreamOutput, AWSError>;
  /**
   * Updates stream metadata, such as the device name and media type. You must provide the stream name or the Amazon Resource Name (ARN) of the stream. To make sure that you have the latest version of the stream before updating it, you can specify the stream version. Kinesis Video Streams assigns a version to each stream. When you update a stream, Kinesis Video Streams assigns a new version number. To get the latest stream version, use the DescribeStream API.   UpdateStream is an asynchronous operation, and takes time to complete.
   */
  updateStream(callback?: (err: AWSError, data: KinesisVideo.Types.UpdateStreamOutput) => void): Request<KinesisVideo.Types.UpdateStreamOutput, AWSError>;
}
declare namespace KinesisVideo {
  export type APIName = "PUT_MEDIA"|"GET_MEDIA"|"LIST_FRAGMENTS"|"GET_MEDIA_FOR_FRAGMENT_LIST"|"GET_HLS_STREAMING_SESSION_URL"|"GET_DASH_STREAMING_SESSION_URL"|"GET_CLIP"|"GET_IMAGES"|string;
  export interface ChannelInfo {
    /**
     * The name of the signaling channel.
     */
    ChannelName?: ChannelName;
    /**
     * The Amazon Resource Name (ARN) of the signaling channel.
     */
    ChannelARN?: ResourceARN;
    /**
     * The type of the signaling channel.
     */
    ChannelType?: ChannelType;
    /**
     * Current status of the signaling channel.
     */
    ChannelStatus?: Status;
    /**
     * The time at which the signaling channel was created.
     */
    CreationTime?: Timestamp;
    /**
     * A structure that contains the configuration for the SINGLE_MASTER channel type.
     */
    SingleMasterConfiguration?: SingleMasterConfiguration;
    /**
     * The current version of the signaling channel.
     */
    Version?: Version;
  }
  export type ChannelInfoList = ChannelInfo[];
  export type ChannelName = string;
  export interface ChannelNameCondition {
    /**
     * A comparison operator. Currently, you can only specify the BEGINS_WITH operator, which finds signaling channels whose names begin with a given prefix.
     */
    ComparisonOperator?: ComparisonOperator;
    /**
     * A value to compare.
     */
    ComparisonValue?: ChannelName;
  }
  export type ChannelProtocol = "WSS"|"HTTPS"|"WEBRTC"|string;
  export type ChannelRole = "MASTER"|"VIEWER"|string;
  export type ChannelType = "SINGLE_MASTER"|"FULL_MESH"|string;
  export type ComparisonOperator = "BEGINS_WITH"|string;
  export type ConfigurationStatus = "ENABLED"|"DISABLED"|string;
  export interface CreateSignalingChannelInput {
    /**
     * A name for the signaling channel that you are creating. It must be unique for each Amazon Web Services account and Amazon Web Services Region.
     */
    ChannelName: ChannelName;
    /**
     * A type of the signaling channel that you are creating. Currently, SINGLE_MASTER is the only supported channel type. 
     */
    ChannelType?: ChannelType;
    /**
     * A structure containing the configuration for the SINGLE_MASTER channel type. 
     */
    SingleMasterConfiguration?: SingleMasterConfiguration;
    /**
     * A set of tags (key-value pairs) that you want to associate with this channel.
     */
    Tags?: TagOnCreateList;
  }
  export interface CreateSignalingChannelOutput {
    /**
     * The Amazon Resource Name (ARN) of the created channel.
     */
    ChannelARN?: ResourceARN;
  }
  export interface CreateStreamInput {
    /**
     * The name of the device that is writing to the stream.   In the current implementation, Kinesis Video Streams does not use this name. 
     */
    DeviceName?: DeviceName;
    /**
     * A name for the stream that you are creating. The stream name is an identifier for the stream, and must be unique for each account and region.
     */
    StreamName: StreamName;
    /**
     * The media type of the stream. Consumers of the stream can use this information when processing the stream. For more information about media types, see Media Types. If you choose to specify the MediaType, see Naming Requirements for guidelines. Example valid values include "video/h264" and "video/h264,audio/aac". This parameter is optional; the default value is null (or empty in JSON).
     */
    MediaType?: MediaType;
    /**
     * The ID of the Key Management Service (KMS) key that you want Kinesis Video Streams to use to encrypt stream data. If no key ID is specified, the default, Kinesis Video-managed key (Amazon Web Services/kinesisvideo) is used.  For more information, see DescribeKey. 
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The number of hours that you want to retain the data in the stream. Kinesis Video Streams retains the data in a data store that is associated with the stream. The default value is 0, indicating that the stream does not persist data. When the DataRetentionInHours value is 0, consumers can still consume the fragments that remain in the service host buffer, which has a retention time limit of 5 minutes and a retention memory limit of 200 MB. Fragments are removed from the buffer when either limit is reached.
     */
    DataRetentionInHours?: DataRetentionInHours;
    /**
     * A list of tags to associate with the specified stream. Each tag is a key-value pair (the value is optional).
     */
    Tags?: ResourceTags;
  }
  export interface CreateStreamOutput {
    /**
     * The Amazon Resource Name (ARN) of the stream.
     */
    StreamARN?: ResourceARN;
  }
  export type DataEndpoint = string;
  export type DataRetentionChangeInHours = number;
  export type DataRetentionInHours = number;
  export type DeleteAfterUpload = boolean;
  export interface DeleteEdgeConfigurationInput {
    /**
     * The name of the stream from which to delete the edge configuration. Specify either the StreamName or the StreamARN.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream. Specify either the StreamName or the StreamARN.
     */
    StreamARN?: ResourceARN;
  }
  export interface DeleteEdgeConfigurationOutput {
  }
  export interface DeleteSignalingChannelInput {
    /**
     * The Amazon Resource Name (ARN) of the signaling channel that you want to delete.
     */
    ChannelARN: ResourceARN;
    /**
     * The current version of the signaling channel that you want to delete. You can obtain the current version by invoking the DescribeSignalingChannel or ListSignalingChannels API operations.
     */
    CurrentVersion?: Version;
  }
  export interface DeleteSignalingChannelOutput {
  }
  export interface DeleteStreamInput {
    /**
     * The Amazon Resource Name (ARN) of the stream that you want to delete. 
     */
    StreamARN: ResourceARN;
    /**
     * Optional: The version of the stream that you want to delete.  Specify the version as a safeguard to ensure that your are deleting the correct stream. To get the stream version, use the DescribeStream API. If not specified, only the CreationTime is checked before deleting the stream.
     */
    CurrentVersion?: Version;
  }
  export interface DeleteStreamOutput {
  }
  export interface DeletionConfig {
    /**
     * The number of hours that you want to retain the data in the stream on the Edge Agent. The default value of the retention time is 720 hours, which translates to 30 days.
     */
    EdgeRetentionInHours?: EdgeRetentionInHours;
    /**
     * The value of the local size required in order to delete the edge configuration.
     */
    LocalSizeConfig?: LocalSizeConfig;
    /**
     * The boolean value used to indicate whether or not you want to mark the media for deletion, once it has been uploaded to the Kinesis Video Stream cloud. The media files can be deleted if any of the deletion configuration values are set to true, such as when the limit for the EdgeRetentionInHours, or the MaxLocalMediaSizeInMB, has been reached.  Since the default value is set to true, configure the uploader schedule such that the media files are not being deleted before they are initially uploaded to the Amazon Web Services cloud.
     */
    DeleteAfterUpload?: DeleteAfterUpload;
  }
  export interface DescribeEdgeConfigurationInput {
    /**
     * The name of the stream whose edge configuration you want to update. Specify either the StreamName or the StreamARN. 
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream. Specify either the StreamNameor the StreamARN.
     */
    StreamARN?: ResourceARN;
  }
  export interface DescribeEdgeConfigurationOutput {
    /**
     * The name of the stream from which the edge configuration was updated.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream.
     */
    StreamARN?: ResourceARN;
    /**
     * The timestamp at which a stream’s edge configuration was first created.
     */
    CreationTime?: Timestamp;
    /**
     * The timestamp at which a stream’s edge configuration was last updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The latest status of the edge configuration update.
     */
    SyncStatus?: SyncStatus;
    /**
     * A description of the generated failure status.
     */
    FailedStatusDetails?: FailedStatusDetails;
    /**
     * A description of the stream's edge configuration that will be used to sync with the Edge Agent IoT Greengrass component. The Edge Agent component will run on an IoT Hub Device setup at your premise.
     */
    EdgeConfig?: EdgeConfig;
    /**
     * An object that contains the latest status details for an edge agent's recorder and uploader jobs. Use this information to determine the current health of an edge agent.
     */
    EdgeAgentStatus?: EdgeAgentStatus;
  }
  export interface DescribeImageGenerationConfigurationInput {
    /**
     * The name of the stream from which to retrieve the image generation configuration. You must specify either the StreamName or the StreamARN. 
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the Kinesis video stream from which to retrieve the image generation configuration. You must specify either the StreamName or the StreamARN.
     */
    StreamARN?: ResourceARN;
  }
  export interface DescribeImageGenerationConfigurationOutput {
    /**
     * The structure that contains the information required for the Kinesis video stream (KVS) images delivery. If this structure is null, the configuration will be deleted from the stream.
     */
    ImageGenerationConfiguration?: ImageGenerationConfiguration;
  }
  export interface DescribeMappedResourceConfigurationInput {
    /**
     * The name of the stream.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream.
     */
    StreamARN?: ResourceARN;
    /**
     * The maximum number of results to return in the response.
     */
    MaxResults?: MappedResourceConfigurationListLimit;
    /**
     * The token to provide in your next request, to get another batch of results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeMappedResourceConfigurationOutput {
    /**
     * A structure that encapsulates, or contains, the media storage configuration properties.
     */
    MappedResourceConfigurationList?: MappedResourceConfigurationList;
    /**
     * The token that was used in the NextTokenrequest to fetch the next set of results. 
     */
    NextToken?: NextToken;
  }
  export interface DescribeMediaStorageConfigurationInput {
    /**
     * The name of the channel.
     */
    ChannelName?: ChannelName;
    /**
     * The Amazon Resource Name (ARN) of the channel.
     */
    ChannelARN?: ResourceARN;
  }
  export interface DescribeMediaStorageConfigurationOutput {
    /**
     * A structure that encapsulates, or contains, the media storage configuration properties.
     */
    MediaStorageConfiguration?: MediaStorageConfiguration;
  }
  export interface DescribeNotificationConfigurationInput {
    /**
     * The name of the stream from which to retrieve the notification configuration. You must specify either the StreamName or the StreamARN.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the Kinesis video stream from where you want to retrieve the notification configuration. You must specify either the StreamName or the StreamARN.
     */
    StreamARN?: ResourceARN;
  }
  export interface DescribeNotificationConfigurationOutput {
    /**
     * The structure that contains the information required for notifications. If the structure is null, the configuration will be deleted from the stream.
     */
    NotificationConfiguration?: NotificationConfiguration;
  }
  export interface DescribeSignalingChannelInput {
    /**
     * The name of the signaling channel that you want to describe.
     */
    ChannelName?: ChannelName;
    /**
     * The ARN of the signaling channel that you want to describe.
     */
    ChannelARN?: ResourceARN;
  }
  export interface DescribeSignalingChannelOutput {
    /**
     * A structure that encapsulates the specified signaling channel's metadata and properties.
     */
    ChannelInfo?: ChannelInfo;
  }
  export interface DescribeStreamInput {
    /**
     * The name of the stream.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream.
     */
    StreamARN?: ResourceARN;
  }
  export interface DescribeStreamOutput {
    /**
     * An object that describes the stream.
     */
    StreamInfo?: StreamInfo;
  }
  export type DestinationRegion = string;
  export type DestinationUri = string;
  export type DeviceName = string;
  export type DurationInSeconds = number;
  export interface EdgeAgentStatus {
    /**
     * The latest status of a stream’s edge recording job.
     */
    LastRecorderStatus?: LastRecorderStatus;
    /**
     * The latest status of a stream’s edge to cloud uploader job.
     */
    LastUploaderStatus?: LastUploaderStatus;
  }
  export interface EdgeConfig {
    /**
     * The "Internet of Things (IoT) Thing" Arn of the stream.
     */
    HubDeviceArn: HubDeviceArn;
    /**
     * The recorder configuration consists of the local MediaSourceConfig details, that are used as credentials to access the local media files streamed on the camera. 
     */
    RecorderConfig: RecorderConfig;
    /**
     * The uploader configuration contains the ScheduleExpression details that are used to schedule upload jobs for the recorded media files from the Edge Agent to a Kinesis Video Stream.
     */
    UploaderConfig?: UploaderConfig;
    /**
     * The deletion configuration is made up of the retention time (EdgeRetentionInHours) and local size configuration (LocalSizeConfig) details that are used to make the deletion.
     */
    DeletionConfig?: DeletionConfig;
  }
  export type EdgeRetentionInHours = number;
  export type FailedStatusDetails = string;
  export type Format = "JPEG"|"PNG"|string;
  export type FormatConfig = {[key: string]: FormatConfigValue};
  export type FormatConfigKey = "JPEGQuality"|string;
  export type FormatConfigValue = string;
  export interface GetDataEndpointInput {
    /**
     * The name of the stream that you want to get the endpoint for. You must specify either this parameter or a StreamARN in the request.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream that you want to get the endpoint for. You must specify either this parameter or a StreamName in the request. 
     */
    StreamARN?: ResourceARN;
    /**
     * The name of the API action for which to get an endpoint.
     */
    APIName: APIName;
  }
  export interface GetDataEndpointOutput {
    /**
     * The endpoint value. To read data from the stream or to write data to it, specify this endpoint in your application.
     */
    DataEndpoint?: DataEndpoint;
  }
  export interface GetSignalingChannelEndpointInput {
    /**
     * The Amazon Resource Name (ARN) of the signalling channel for which you want to get an endpoint.
     */
    ChannelARN: ResourceARN;
    /**
     * A structure containing the endpoint configuration for the SINGLE_MASTER channel type.
     */
    SingleMasterChannelEndpointConfiguration?: SingleMasterChannelEndpointConfiguration;
  }
  export interface GetSignalingChannelEndpointOutput {
    /**
     * A list of endpoints for the specified signaling channel.
     */
    ResourceEndpointList?: ResourceEndpointList;
  }
  export type HeightPixels = number;
  export type HubDeviceArn = string;
  export interface ImageGenerationConfiguration {
    /**
     * Indicates whether the ContinuousImageGenerationConfigurations API is enabled or disabled.
     */
    Status: ConfigurationStatus;
    /**
     * The origin of the Server or Producer timestamps to use to generate the images.
     */
    ImageSelectorType: ImageSelectorType;
    /**
     * The structure that contains the information required to deliver images to a customer.
     */
    DestinationConfig: ImageGenerationDestinationConfig;
    /**
     * The time interval in milliseconds (ms) at which the images need to be generated from the stream. The minimum value that can be provided is 200 ms. If the timestamp range is less than the sampling interval, the Image from the StartTimestamp will be returned if available. 
     */
    SamplingInterval: SamplingInterval;
    /**
     * The accepted image format.
     */
    Format: Format;
    /**
     * The list of a key-value pair structure that contains extra parameters that can be applied when the image is generated. The FormatConfig key is the JPEGQuality, which indicates the JPEG quality key to be used to generate the image. The FormatConfig value accepts ints from 1 to 100. If the value is 1, the image will be generated with less quality and the best compression. If the value is 100, the image will be generated with the best quality and less compression. If no value is provided, the default value of the JPEGQuality key will be set to 80.
     */
    FormatConfig?: FormatConfig;
    /**
     * The width of the output image that is used in conjunction with the HeightPixels parameter. When both WidthPixels and HeightPixels parameters are provided, the image will be stretched to fit the specified aspect ratio. If only the WidthPixels parameter is provided, its original aspect ratio will be used to calculate the HeightPixels ratio. If neither parameter is provided, the original image size will be returned.
     */
    WidthPixels?: WidthPixels;
    /**
     * The height of the output image that is used in conjunction with the WidthPixels parameter. When both HeightPixels and WidthPixels parameters are provided, the image will be stretched to fit the specified aspect ratio. If only the HeightPixels parameter is provided, its original aspect ratio will be used to calculate the WidthPixels ratio. If neither parameter is provided, the original image size will be returned.
     */
    HeightPixels?: HeightPixels;
  }
  export interface ImageGenerationDestinationConfig {
    /**
     * The Uniform Resource Identifier (URI) that identifies where the images will be delivered.
     */
    Uri: DestinationUri;
    /**
     * The Amazon Web Services Region of the S3 bucket where images will be delivered. This DestinationRegion must match the Region where the stream is located.
     */
    DestinationRegion: DestinationRegion;
  }
  export type ImageSelectorType = "SERVER_TIMESTAMP"|"PRODUCER_TIMESTAMP"|string;
  export type JobStatusDetails = string;
  export type KmsKeyId = string;
  export interface LastRecorderStatus {
    /**
     * A description of a recorder job’s latest status.
     */
    JobStatusDetails?: JobStatusDetails;
    /**
     * The timestamp at which the recorder job was last executed and media stored to local disk.
     */
    LastCollectedTime?: Timestamp;
    /**
     * The timestamp at which the recorder status was last updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The status of the latest recorder job.
     */
    RecorderStatus?: RecorderStatus;
  }
  export interface LastUploaderStatus {
    /**
     * A description of an uploader job’s latest status.
     */
    JobStatusDetails?: JobStatusDetails;
    /**
     * The timestamp at which the uploader job was last executed and media collected to the cloud.
     */
    LastCollectedTime?: Timestamp;
    /**
     * The timestamp at which the uploader status was last updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The status of the latest uploader job.
     */
    UploaderStatus?: UploaderStatus;
  }
  export interface ListEdgeAgentConfigurationsEdgeConfig {
    /**
     * The name of the stream.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream.
     */
    StreamARN?: ResourceARN;
    /**
     * The timestamp when the stream first created the edge config.
     */
    CreationTime?: Timestamp;
    /**
     * The timestamp when the stream last updated the edge config.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The current sync status of the stream's edge configuration.
     */
    SyncStatus?: SyncStatus;
    /**
     * A description of the generated failure status.
     */
    FailedStatusDetails?: FailedStatusDetails;
    EdgeConfig?: EdgeConfig;
  }
  export type ListEdgeAgentConfigurationsEdgeConfigList = ListEdgeAgentConfigurationsEdgeConfig[];
  export interface ListEdgeAgentConfigurationsInput {
    /**
     * The "Internet of Things (IoT) Thing" Arn of the edge agent.
     */
    HubDeviceArn: HubDeviceArn;
    /**
     * The maximum number of edge configurations to return in the response. The default is 5.
     */
    MaxResults?: ListEdgeAgentConfigurationsInputLimit;
    /**
     * If you specify this parameter, when the result of a ListEdgeAgentConfigurations operation is truncated, the call returns the NextToken in the response. To get another batch of edge configurations, provide this token in your next request. 
     */
    NextToken?: NextToken;
  }
  export type ListEdgeAgentConfigurationsInputLimit = number;
  export interface ListEdgeAgentConfigurationsOutput {
    /**
     * A description of a single stream's edge configuration.
     */
    EdgeConfigs?: ListEdgeAgentConfigurationsEdgeConfigList;
    /**
     * If the response is truncated, the call returns this element with a given token. To get the next batch of edge configurations, use this token in your next request.
     */
    NextToken?: NextToken;
  }
  export type ListOfProtocols = ChannelProtocol[];
  export interface ListSignalingChannelsInput {
    /**
     * The maximum number of channels to return in the response. The default is 500.
     */
    MaxResults?: ListStreamsInputLimit;
    /**
     * If you specify this parameter, when the result of a ListSignalingChannels operation is truncated, the call returns the NextToken in the response. To get another batch of channels, provide this token in your next request.
     */
    NextToken?: NextToken;
    /**
     * Optional: Returns only the channels that satisfy a specific condition.
     */
    ChannelNameCondition?: ChannelNameCondition;
  }
  export interface ListSignalingChannelsOutput {
    /**
     * An array of ChannelInfo objects.
     */
    ChannelInfoList?: ChannelInfoList;
    /**
     * If the response is truncated, the call returns this element with a token. To get the next batch of streams, use this token in your next request.
     */
    NextToken?: NextToken;
  }
  export interface ListStreamsInput {
    /**
     * The maximum number of streams to return in the response. The default is 10,000.
     */
    MaxResults?: ListStreamsInputLimit;
    /**
     * If you specify this parameter, when the result of a ListStreams operation is truncated, the call returns the NextToken in the response. To get another batch of streams, provide this token in your next request.
     */
    NextToken?: NextToken;
    /**
     * Optional: Returns only streams that satisfy a specific condition. Currently, you can specify only the prefix of a stream name as a condition. 
     */
    StreamNameCondition?: StreamNameCondition;
  }
  export type ListStreamsInputLimit = number;
  export interface ListStreamsOutput {
    /**
     * An array of StreamInfo objects.
     */
    StreamInfoList?: StreamInfoList;
    /**
     * If the response is truncated, the call returns this element with a token. To get the next batch of streams, use this token in your next request. 
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceInput {
    /**
     * If you specify this parameter and the result of a ListTagsForResource call is truncated, the response includes a token that you can use in the next request to fetch the next batch of tags. 
     */
    NextToken?: NextToken;
    /**
     * The Amazon Resource Name (ARN) of the signaling channel for which you want to list tags.
     */
    ResourceARN: ResourceARN;
  }
  export interface ListTagsForResourceOutput {
    /**
     * If you specify this parameter and the result of a ListTagsForResource call is truncated, the response includes a token that you can use in the next request to fetch the next set of tags. 
     */
    NextToken?: NextToken;
    /**
     * A map of tag keys and values associated with the specified signaling channel.
     */
    Tags?: ResourceTags;
  }
  export interface ListTagsForStreamInput {
    /**
     * If you specify this parameter and the result of a ListTagsForStream call is truncated, the response includes a token that you can use in the next request to fetch the next batch of tags.
     */
    NextToken?: NextToken;
    /**
     * The Amazon Resource Name (ARN) of the stream that you want to list tags for.
     */
    StreamARN?: ResourceARN;
    /**
     * The name of the stream that you want to list tags for.
     */
    StreamName?: StreamName;
  }
  export interface ListTagsForStreamOutput {
    /**
     * If you specify this parameter and the result of a ListTags call is truncated, the response includes a token that you can use in the next request to fetch the next set of tags.
     */
    NextToken?: NextToken;
    /**
     * A map of tag keys and values associated with the specified stream.
     */
    Tags?: ResourceTags;
  }
  export interface LocalSizeConfig {
    /**
     * The overall maximum size of the media that you want to store for a stream on the Edge Agent. 
     */
    MaxLocalMediaSizeInMB?: MaxLocalMediaSizeInMB;
    /**
     * The strategy to perform when a stream’s MaxLocalMediaSizeInMB limit is reached.
     */
    StrategyOnFullSize?: StrategyOnFullSize;
  }
  export type MappedResourceConfigurationList = MappedResourceConfigurationListItem[];
  export interface MappedResourceConfigurationListItem {
    /**
     * The type of the associated resource for the kinesis video stream.
     */
    Type?: Type;
    /**
     * The Amazon Resource Name (ARN) of the Kinesis Video Stream resource, associated with the stream.
     */
    ARN?: ResourceARN;
  }
  export type MappedResourceConfigurationListLimit = number;
  export type MaxLocalMediaSizeInMB = number;
  export interface MediaSourceConfig {
    /**
     * The Amazon Web Services Secrets Manager ARN for the username and password of the camera, or a local media file location.
     */
    MediaUriSecretArn: MediaUriSecretArn;
    /**
     * The Uniform Resource Identifier (URI) type. The FILE_URI value can be used to stream local media files.  Preview only supports the RTSP_URI media source URI format . 
     */
    MediaUriType: MediaUriType;
  }
  export interface MediaStorageConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the stream 
     */
    StreamARN?: ResourceARN;
    /**
     * The status of the media storage configuration.
     */
    Status: MediaStorageConfigurationStatus;
  }
  export type MediaStorageConfigurationStatus = "ENABLED"|"DISABLED"|string;
  export type MediaType = string;
  export type MediaUriSecretArn = string;
  export type MediaUriType = "RTSP_URI"|"FILE_URI"|string;
  export type MessageTtlSeconds = number;
  export type NextToken = string;
  export interface NotificationConfiguration {
    /**
     * Indicates if a notification configuration is enabled or disabled.
     */
    Status: ConfigurationStatus;
    /**
     * The destination information required to deliver a notification to a customer.
     */
    DestinationConfig: NotificationDestinationConfig;
  }
  export interface NotificationDestinationConfig {
    /**
     * The Uniform Resource Identifier (URI) that identifies where the images will be delivered.
     */
    Uri: DestinationUri;
  }
  export interface RecorderConfig {
    /**
     * The configuration details that consist of the credentials required (MediaUriSecretArn and MediaUriType) to access the media files streamed to the camera. 
     */
    MediaSourceConfig: MediaSourceConfig;
    /**
     * The configuration that consists of the ScheduleExpression and the DurationInMinutes details that specify the scheduling to record from a camera, or local media file, onto the Edge Agent. If the ScheduleExpression attribute is not provided, then the Edge Agent will always be set to recording mode.
     */
    ScheduleConfig?: ScheduleConfig;
  }
  export type RecorderStatus = "SUCCESS"|"USER_ERROR"|"SYSTEM_ERROR"|string;
  export type ResourceARN = string;
  export type ResourceEndpoint = string;
  export type ResourceEndpointList = ResourceEndpointListItem[];
  export interface ResourceEndpointListItem {
    /**
     * The protocol of the signaling channel returned by the GetSignalingChannelEndpoint API.
     */
    Protocol?: ChannelProtocol;
    /**
     * The endpoint of the signaling channel returned by the GetSignalingChannelEndpoint API.
     */
    ResourceEndpoint?: ResourceEndpoint;
  }
  export type ResourceTags = {[key: string]: TagValue};
  export type SamplingInterval = number;
  export interface ScheduleConfig {
    /**
     * The Quartz cron expression that takes care of scheduling jobs to record from the camera, or local media file, onto the Edge Agent. If the ScheduleExpression is not provided for the RecorderConfig, then the Edge Agent will always be set to recording mode. For more information about Quartz, refer to the  Cron Trigger Tutorial  page to understand the valid expressions and its use.
     */
    ScheduleExpression: ScheduleExpression;
    /**
     * The total duration to record the media. If the ScheduleExpression attribute is provided, then the DurationInSeconds attribute should also be specified.
     */
    DurationInSeconds: DurationInSeconds;
  }
  export type ScheduleExpression = string;
  export interface SingleMasterChannelEndpointConfiguration {
    /**
     * This property is used to determine the nature of communication over this SINGLE_MASTER signaling channel. If WSS is specified, this API returns a websocket endpoint. If HTTPS is specified, this API returns an HTTPS endpoint.
     */
    Protocols?: ListOfProtocols;
    /**
     * This property is used to determine messaging permissions in this SINGLE_MASTER signaling channel. If MASTER is specified, this API returns an endpoint that a client can use to receive offers from and send answers to any of the viewers on this signaling channel. If VIEWER is specified, this API returns an endpoint that a client can use only to send offers to another MASTER client on this signaling channel. 
     */
    Role?: ChannelRole;
  }
  export interface SingleMasterConfiguration {
    /**
     * The period of time a signaling channel retains undelivered messages before they are discarded.
     */
    MessageTtlSeconds?: MessageTtlSeconds;
  }
  export interface StartEdgeConfigurationUpdateInput {
    /**
     * The name of the stream whose edge configuration you want to update. Specify either the StreamName or the StreamARN.
     */
    StreamName?: StreamName;
    /**
     *  The Amazon Resource Name (ARN) of the stream. Specify either the StreamName or the StreamARN.
     */
    StreamARN?: ResourceARN;
    /**
     * The edge configuration details required to invoke the update process.
     */
    EdgeConfig: EdgeConfig;
  }
  export interface StartEdgeConfigurationUpdateOutput {
    /**
     * The name of the stream from which the edge configuration was updated.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream.
     */
    StreamARN?: ResourceARN;
    /**
     * The timestamp at which a stream’s edge configuration was first created.
     */
    CreationTime?: Timestamp;
    /**
     * The timestamp at which a stream’s edge configuration was last updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     *  The current sync status of the stream's edge configuration. When you invoke this API, the sync status will be set to the SYNCING state. Use the DescribeEdgeConfiguration API to get the latest status of the edge configuration.
     */
    SyncStatus?: SyncStatus;
    /**
     * A description of the generated failure status.
     */
    FailedStatusDetails?: FailedStatusDetails;
    /**
     * A description of the stream's edge configuration that will be used to sync with the Edge Agent IoT Greengrass component. The Edge Agent component will run on an IoT Hub Device setup at your premise.
     */
    EdgeConfig?: EdgeConfig;
  }
  export type Status = "CREATING"|"ACTIVE"|"UPDATING"|"DELETING"|string;
  export type StrategyOnFullSize = "DELETE_OLDEST_MEDIA"|"DENY_NEW_MEDIA"|string;
  export interface StreamInfo {
    /**
     * The name of the device that is associated with the stream.
     */
    DeviceName?: DeviceName;
    /**
     * The name of the stream.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream.
     */
    StreamARN?: ResourceARN;
    /**
     * The MediaType of the stream. 
     */
    MediaType?: MediaType;
    /**
     * The ID of the Key Management Service (KMS) key that Kinesis Video Streams uses to encrypt data on the stream.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The version of the stream.
     */
    Version?: Version;
    /**
     * The status of the stream.
     */
    Status?: Status;
    /**
     * A time stamp that indicates when the stream was created.
     */
    CreationTime?: Timestamp;
    /**
     * How long the stream retains data, in hours.
     */
    DataRetentionInHours?: DataRetentionInHours;
  }
  export type StreamInfoList = StreamInfo[];
  export type StreamName = string;
  export interface StreamNameCondition {
    /**
     * A comparison operator. Currently, you can specify only the BEGINS_WITH operator, which finds streams whose names start with a given prefix.
     */
    ComparisonOperator?: ComparisonOperator;
    /**
     * A value to compare.
     */
    ComparisonValue?: StreamName;
  }
  export type SyncStatus = "SYNCING"|"ACKNOWLEDGED"|"IN_SYNC"|"SYNC_FAILED"|"DELETING"|"DELETE_FAILED"|"DELETING_ACKNOWLEDGED"|string;
  export interface Tag {
    /**
     * The key of the tag that is associated with the specified signaling channel.
     */
    Key: TagKey;
    /**
     * The value of the tag that is associated with the specified signaling channel.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export type TagOnCreateList = Tag[];
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the signaling channel to which you want to add tags.
     */
    ResourceARN: ResourceARN;
    /**
     * A list of tags to associate with the specified signaling channel. Each tag is a key-value pair.
     */
    Tags: TagList;
  }
  export interface TagResourceOutput {
  }
  export interface TagStreamInput {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to add the tag or tags to.
     */
    StreamARN?: ResourceARN;
    /**
     * The name of the stream that you want to add the tag or tags to.
     */
    StreamName?: StreamName;
    /**
     * A list of tags to associate with the specified stream. Each tag is a key-value pair (the value is optional).
     */
    Tags: ResourceTags;
  }
  export interface TagStreamOutput {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export type Type = string;
  export interface UntagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the signaling channel from which you want to remove tags.
     */
    ResourceARN: ResourceARN;
    /**
     * A list of the keys of the tags that you want to remove.
     */
    TagKeyList: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  export interface UntagStreamInput {
    /**
     * The Amazon Resource Name (ARN) of the stream that you want to remove tags from.
     */
    StreamARN?: ResourceARN;
    /**
     * The name of the stream that you want to remove tags from.
     */
    StreamName?: StreamName;
    /**
     * A list of the keys of the tags that you want to remove.
     */
    TagKeyList: TagKeyList;
  }
  export interface UntagStreamOutput {
  }
  export interface UpdateDataRetentionInput {
    /**
     * The name of the stream whose retention period you want to change.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream whose retention period you want to change.
     */
    StreamARN?: ResourceARN;
    /**
     * The version of the stream whose retention period you want to change. To get the version, call either the DescribeStream or the ListStreams API.
     */
    CurrentVersion: Version;
    /**
     * Indicates whether you want to increase or decrease the retention period.
     */
    Operation: UpdateDataRetentionOperation;
    /**
     * The retention period, in hours. The value you specify replaces the current value. The maximum value for this parameter is 87600 (ten years).
     */
    DataRetentionChangeInHours: DataRetentionChangeInHours;
  }
  export type UpdateDataRetentionOperation = "INCREASE_DATA_RETENTION"|"DECREASE_DATA_RETENTION"|string;
  export interface UpdateDataRetentionOutput {
  }
  export interface UpdateImageGenerationConfigurationInput {
    /**
     * The name of the stream from which to update the image generation configuration. You must specify either the StreamName or the StreamARN.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the Kinesis video stream from where you want to update the image generation configuration. You must specify either the StreamName or the StreamARN.
     */
    StreamARN?: ResourceARN;
    /**
     * The structure that contains the information required for the KVS images delivery. If the structure is null, the configuration will be deleted from the stream.
     */
    ImageGenerationConfiguration?: ImageGenerationConfiguration;
  }
  export interface UpdateImageGenerationConfigurationOutput {
  }
  export interface UpdateMediaStorageConfigurationInput {
    /**
     * The Amazon Resource Name (ARN) of the channel.
     */
    ChannelARN: ResourceARN;
    /**
     * A structure that encapsulates, or contains, the media storage configuration properties.
     */
    MediaStorageConfiguration: MediaStorageConfiguration;
  }
  export interface UpdateMediaStorageConfigurationOutput {
  }
  export interface UpdateNotificationConfigurationInput {
    /**
     * The name of the stream from which to update the notification configuration. You must specify either the StreamName or the StreamARN.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the Kinesis video stream from where you want to update the notification configuration. You must specify either the StreamName or the StreamARN.
     */
    StreamARN?: ResourceARN;
    /**
     * The structure containing the information required for notifications. If the structure is null, the configuration will be deleted from the stream.
     */
    NotificationConfiguration?: NotificationConfiguration;
  }
  export interface UpdateNotificationConfigurationOutput {
  }
  export interface UpdateSignalingChannelInput {
    /**
     * The Amazon Resource Name (ARN) of the signaling channel that you want to update.
     */
    ChannelARN: ResourceARN;
    /**
     * The current version of the signaling channel that you want to update.
     */
    CurrentVersion: Version;
    /**
     * The structure containing the configuration for the SINGLE_MASTER type of the signaling channel that you want to update. 
     */
    SingleMasterConfiguration?: SingleMasterConfiguration;
  }
  export interface UpdateSignalingChannelOutput {
  }
  export interface UpdateStreamInput {
    /**
     * The name of the stream whose metadata you want to update. The stream name is an identifier for the stream, and must be unique for each account and region.
     */
    StreamName?: StreamName;
    /**
     * The ARN of the stream whose metadata you want to update.
     */
    StreamARN?: ResourceARN;
    /**
     * The version of the stream whose metadata you want to update.
     */
    CurrentVersion: Version;
    /**
     * The name of the device that is writing to the stream.    In the current implementation, Kinesis Video Streams does not use this name.  
     */
    DeviceName?: DeviceName;
    /**
     * The stream's media type. Use MediaType to specify the type of content that the stream contains to the consumers of the stream. For more information about media types, see Media Types. If you choose to specify the MediaType, see Naming Requirements. To play video on the console, you must specify the correct video type. For example, if the video in the stream is H.264, specify video/h264 as the MediaType.
     */
    MediaType?: MediaType;
  }
  export interface UpdateStreamOutput {
  }
  export interface UploaderConfig {
    /**
     * The configuration that consists of the ScheduleExpression and the DurationInMinutes details that specify the scheduling to record from a camera, or local media file, onto the Edge Agent. If the ScheduleConfig is not provided in this UploaderConfig, then the Edge Agent will upload at regular intervals (every 1 hour).
     */
    ScheduleConfig: ScheduleConfig;
  }
  export type UploaderStatus = "SUCCESS"|"USER_ERROR"|"SYSTEM_ERROR"|string;
  export type Version = string;
  export type WidthPixels = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-09-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the KinesisVideo client.
   */
  export import Types = KinesisVideo;
}
export = KinesisVideo;
