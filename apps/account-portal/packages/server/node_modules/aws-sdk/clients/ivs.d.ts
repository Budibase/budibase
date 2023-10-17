import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IVS extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IVS.Types.ClientConfiguration)
  config: Config & IVS.Types.ClientConfiguration;
  /**
   * Performs GetChannel on multiple ARNs simultaneously.
   */
  batchGetChannel(params: IVS.Types.BatchGetChannelRequest, callback?: (err: AWSError, data: IVS.Types.BatchGetChannelResponse) => void): Request<IVS.Types.BatchGetChannelResponse, AWSError>;
  /**
   * Performs GetChannel on multiple ARNs simultaneously.
   */
  batchGetChannel(callback?: (err: AWSError, data: IVS.Types.BatchGetChannelResponse) => void): Request<IVS.Types.BatchGetChannelResponse, AWSError>;
  /**
   * Performs GetStreamKey on multiple ARNs simultaneously.
   */
  batchGetStreamKey(params: IVS.Types.BatchGetStreamKeyRequest, callback?: (err: AWSError, data: IVS.Types.BatchGetStreamKeyResponse) => void): Request<IVS.Types.BatchGetStreamKeyResponse, AWSError>;
  /**
   * Performs GetStreamKey on multiple ARNs simultaneously.
   */
  batchGetStreamKey(callback?: (err: AWSError, data: IVS.Types.BatchGetStreamKeyResponse) => void): Request<IVS.Types.BatchGetStreamKeyResponse, AWSError>;
  /**
   * Performs StartViewerSessionRevocation on multiple channel ARN and viewer ID pairs simultaneously.
   */
  batchStartViewerSessionRevocation(params: IVS.Types.BatchStartViewerSessionRevocationRequest, callback?: (err: AWSError, data: IVS.Types.BatchStartViewerSessionRevocationResponse) => void): Request<IVS.Types.BatchStartViewerSessionRevocationResponse, AWSError>;
  /**
   * Performs StartViewerSessionRevocation on multiple channel ARN and viewer ID pairs simultaneously.
   */
  batchStartViewerSessionRevocation(callback?: (err: AWSError, data: IVS.Types.BatchStartViewerSessionRevocationResponse) => void): Request<IVS.Types.BatchStartViewerSessionRevocationResponse, AWSError>;
  /**
   * Creates a new channel and an associated stream key to start streaming.
   */
  createChannel(params: IVS.Types.CreateChannelRequest, callback?: (err: AWSError, data: IVS.Types.CreateChannelResponse) => void): Request<IVS.Types.CreateChannelResponse, AWSError>;
  /**
   * Creates a new channel and an associated stream key to start streaming.
   */
  createChannel(callback?: (err: AWSError, data: IVS.Types.CreateChannelResponse) => void): Request<IVS.Types.CreateChannelResponse, AWSError>;
  /**
   * Creates a new recording configuration, used to enable recording to Amazon S3.  Known issue: In the us-east-1 region, if you use the Amazon Web Services CLI to create a recording configuration, it returns success even if the S3 bucket is in a different region. In this case, the state of the recording configuration is CREATE_FAILED (instead of ACTIVE). (In other regions, the CLI correctly returns failure if the bucket is in a different region.)  Workaround: Ensure that your S3 bucket is in the same region as the recording configuration. If you create a recording configuration in a different region as your S3 bucket, delete that recording configuration and create a new one with an S3 bucket from the correct region.
   */
  createRecordingConfiguration(params: IVS.Types.CreateRecordingConfigurationRequest, callback?: (err: AWSError, data: IVS.Types.CreateRecordingConfigurationResponse) => void): Request<IVS.Types.CreateRecordingConfigurationResponse, AWSError>;
  /**
   * Creates a new recording configuration, used to enable recording to Amazon S3.  Known issue: In the us-east-1 region, if you use the Amazon Web Services CLI to create a recording configuration, it returns success even if the S3 bucket is in a different region. In this case, the state of the recording configuration is CREATE_FAILED (instead of ACTIVE). (In other regions, the CLI correctly returns failure if the bucket is in a different region.)  Workaround: Ensure that your S3 bucket is in the same region as the recording configuration. If you create a recording configuration in a different region as your S3 bucket, delete that recording configuration and create a new one with an S3 bucket from the correct region.
   */
  createRecordingConfiguration(callback?: (err: AWSError, data: IVS.Types.CreateRecordingConfigurationResponse) => void): Request<IVS.Types.CreateRecordingConfigurationResponse, AWSError>;
  /**
   * Creates a stream key, used to initiate a stream, for the specified channel ARN. Note that CreateChannel creates a stream key. If you subsequently use CreateStreamKey on the same channel, it will fail because a stream key already exists and there is a limit of 1 stream key per channel. To reset the stream key on a channel, use DeleteStreamKey and then CreateStreamKey.
   */
  createStreamKey(params: IVS.Types.CreateStreamKeyRequest, callback?: (err: AWSError, data: IVS.Types.CreateStreamKeyResponse) => void): Request<IVS.Types.CreateStreamKeyResponse, AWSError>;
  /**
   * Creates a stream key, used to initiate a stream, for the specified channel ARN. Note that CreateChannel creates a stream key. If you subsequently use CreateStreamKey on the same channel, it will fail because a stream key already exists and there is a limit of 1 stream key per channel. To reset the stream key on a channel, use DeleteStreamKey and then CreateStreamKey.
   */
  createStreamKey(callback?: (err: AWSError, data: IVS.Types.CreateStreamKeyResponse) => void): Request<IVS.Types.CreateStreamKeyResponse, AWSError>;
  /**
   * Deletes the specified channel and its associated stream keys. If you try to delete a live channel, you will get an error (409 ConflictException). To delete a channel that is live, call StopStream, wait for the Amazon EventBridge "Stream End" event (to verify that the stream's state is no longer Live), then call DeleteChannel. (See  Using EventBridge with Amazon IVS.) 
   */
  deleteChannel(params: IVS.Types.DeleteChannelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified channel and its associated stream keys. If you try to delete a live channel, you will get an error (409 ConflictException). To delete a channel that is live, call StopStream, wait for the Amazon EventBridge "Stream End" event (to verify that the stream's state is no longer Live), then call DeleteChannel. (See  Using EventBridge with Amazon IVS.) 
   */
  deleteChannel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a specified authorization key pair. This invalidates future viewer tokens generated using the key pair’s privateKey. For more information, see Setting Up Private Channels in the Amazon IVS User Guide.
   */
  deletePlaybackKeyPair(params: IVS.Types.DeletePlaybackKeyPairRequest, callback?: (err: AWSError, data: IVS.Types.DeletePlaybackKeyPairResponse) => void): Request<IVS.Types.DeletePlaybackKeyPairResponse, AWSError>;
  /**
   * Deletes a specified authorization key pair. This invalidates future viewer tokens generated using the key pair’s privateKey. For more information, see Setting Up Private Channels in the Amazon IVS User Guide.
   */
  deletePlaybackKeyPair(callback?: (err: AWSError, data: IVS.Types.DeletePlaybackKeyPairResponse) => void): Request<IVS.Types.DeletePlaybackKeyPairResponse, AWSError>;
  /**
   * Deletes the recording configuration for the specified ARN. If you try to delete a recording configuration that is associated with a channel, you will get an error (409 ConflictException). To avoid this, for all channels that reference the recording configuration, first use UpdateChannel to set the recordingConfigurationArn field to an empty string, then use DeleteRecordingConfiguration.
   */
  deleteRecordingConfiguration(params: IVS.Types.DeleteRecordingConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the recording configuration for the specified ARN. If you try to delete a recording configuration that is associated with a channel, you will get an error (409 ConflictException). To avoid this, for all channels that reference the recording configuration, first use UpdateChannel to set the recordingConfigurationArn field to an empty string, then use DeleteRecordingConfiguration.
   */
  deleteRecordingConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the stream key for the specified ARN, so it can no longer be used to stream.
   */
  deleteStreamKey(params: IVS.Types.DeleteStreamKeyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the stream key for the specified ARN, so it can no longer be used to stream.
   */
  deleteStreamKey(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets the channel configuration for the specified channel ARN. See also BatchGetChannel.
   */
  getChannel(params: IVS.Types.GetChannelRequest, callback?: (err: AWSError, data: IVS.Types.GetChannelResponse) => void): Request<IVS.Types.GetChannelResponse, AWSError>;
  /**
   * Gets the channel configuration for the specified channel ARN. See also BatchGetChannel.
   */
  getChannel(callback?: (err: AWSError, data: IVS.Types.GetChannelResponse) => void): Request<IVS.Types.GetChannelResponse, AWSError>;
  /**
   * Gets a specified playback authorization key pair and returns the arn and fingerprint. The privateKey held by the caller can be used to generate viewer authorization tokens, to grant viewers access to private channels. For more information, see Setting Up Private Channels in the Amazon IVS User Guide.
   */
  getPlaybackKeyPair(params: IVS.Types.GetPlaybackKeyPairRequest, callback?: (err: AWSError, data: IVS.Types.GetPlaybackKeyPairResponse) => void): Request<IVS.Types.GetPlaybackKeyPairResponse, AWSError>;
  /**
   * Gets a specified playback authorization key pair and returns the arn and fingerprint. The privateKey held by the caller can be used to generate viewer authorization tokens, to grant viewers access to private channels. For more information, see Setting Up Private Channels in the Amazon IVS User Guide.
   */
  getPlaybackKeyPair(callback?: (err: AWSError, data: IVS.Types.GetPlaybackKeyPairResponse) => void): Request<IVS.Types.GetPlaybackKeyPairResponse, AWSError>;
  /**
   * Gets the recording configuration for the specified ARN.
   */
  getRecordingConfiguration(params: IVS.Types.GetRecordingConfigurationRequest, callback?: (err: AWSError, data: IVS.Types.GetRecordingConfigurationResponse) => void): Request<IVS.Types.GetRecordingConfigurationResponse, AWSError>;
  /**
   * Gets the recording configuration for the specified ARN.
   */
  getRecordingConfiguration(callback?: (err: AWSError, data: IVS.Types.GetRecordingConfigurationResponse) => void): Request<IVS.Types.GetRecordingConfigurationResponse, AWSError>;
  /**
   * Gets information about the active (live) stream on a specified channel.
   */
  getStream(params: IVS.Types.GetStreamRequest, callback?: (err: AWSError, data: IVS.Types.GetStreamResponse) => void): Request<IVS.Types.GetStreamResponse, AWSError>;
  /**
   * Gets information about the active (live) stream on a specified channel.
   */
  getStream(callback?: (err: AWSError, data: IVS.Types.GetStreamResponse) => void): Request<IVS.Types.GetStreamResponse, AWSError>;
  /**
   * Gets stream-key information for a specified ARN.
   */
  getStreamKey(params: IVS.Types.GetStreamKeyRequest, callback?: (err: AWSError, data: IVS.Types.GetStreamKeyResponse) => void): Request<IVS.Types.GetStreamKeyResponse, AWSError>;
  /**
   * Gets stream-key information for a specified ARN.
   */
  getStreamKey(callback?: (err: AWSError, data: IVS.Types.GetStreamKeyResponse) => void): Request<IVS.Types.GetStreamKeyResponse, AWSError>;
  /**
   * Gets metadata on a specified stream.
   */
  getStreamSession(params: IVS.Types.GetStreamSessionRequest, callback?: (err: AWSError, data: IVS.Types.GetStreamSessionResponse) => void): Request<IVS.Types.GetStreamSessionResponse, AWSError>;
  /**
   * Gets metadata on a specified stream.
   */
  getStreamSession(callback?: (err: AWSError, data: IVS.Types.GetStreamSessionResponse) => void): Request<IVS.Types.GetStreamSessionResponse, AWSError>;
  /**
   * Imports the public portion of a new key pair and returns its arn and fingerprint. The privateKey can then be used to generate viewer authorization tokens, to grant viewers access to private channels. For more information, see Setting Up Private Channels in the Amazon IVS User Guide.
   */
  importPlaybackKeyPair(params: IVS.Types.ImportPlaybackKeyPairRequest, callback?: (err: AWSError, data: IVS.Types.ImportPlaybackKeyPairResponse) => void): Request<IVS.Types.ImportPlaybackKeyPairResponse, AWSError>;
  /**
   * Imports the public portion of a new key pair and returns its arn and fingerprint. The privateKey can then be used to generate viewer authorization tokens, to grant viewers access to private channels. For more information, see Setting Up Private Channels in the Amazon IVS User Guide.
   */
  importPlaybackKeyPair(callback?: (err: AWSError, data: IVS.Types.ImportPlaybackKeyPairResponse) => void): Request<IVS.Types.ImportPlaybackKeyPairResponse, AWSError>;
  /**
   * Gets summary information about all channels in your account, in the Amazon Web Services region where the API request is processed. This list can be filtered to match a specified name or recording-configuration ARN. Filters are mutually exclusive and cannot be used together. If you try to use both filters, you will get an error (409 ConflictException).
   */
  listChannels(params: IVS.Types.ListChannelsRequest, callback?: (err: AWSError, data: IVS.Types.ListChannelsResponse) => void): Request<IVS.Types.ListChannelsResponse, AWSError>;
  /**
   * Gets summary information about all channels in your account, in the Amazon Web Services region where the API request is processed. This list can be filtered to match a specified name or recording-configuration ARN. Filters are mutually exclusive and cannot be used together. If you try to use both filters, you will get an error (409 ConflictException).
   */
  listChannels(callback?: (err: AWSError, data: IVS.Types.ListChannelsResponse) => void): Request<IVS.Types.ListChannelsResponse, AWSError>;
  /**
   * Gets summary information about playback key pairs. For more information, see Setting Up Private Channels in the Amazon IVS User Guide.
   */
  listPlaybackKeyPairs(params: IVS.Types.ListPlaybackKeyPairsRequest, callback?: (err: AWSError, data: IVS.Types.ListPlaybackKeyPairsResponse) => void): Request<IVS.Types.ListPlaybackKeyPairsResponse, AWSError>;
  /**
   * Gets summary information about playback key pairs. For more information, see Setting Up Private Channels in the Amazon IVS User Guide.
   */
  listPlaybackKeyPairs(callback?: (err: AWSError, data: IVS.Types.ListPlaybackKeyPairsResponse) => void): Request<IVS.Types.ListPlaybackKeyPairsResponse, AWSError>;
  /**
   * Gets summary information about all recording configurations in your account, in the Amazon Web Services region where the API request is processed.
   */
  listRecordingConfigurations(params: IVS.Types.ListRecordingConfigurationsRequest, callback?: (err: AWSError, data: IVS.Types.ListRecordingConfigurationsResponse) => void): Request<IVS.Types.ListRecordingConfigurationsResponse, AWSError>;
  /**
   * Gets summary information about all recording configurations in your account, in the Amazon Web Services region where the API request is processed.
   */
  listRecordingConfigurations(callback?: (err: AWSError, data: IVS.Types.ListRecordingConfigurationsResponse) => void): Request<IVS.Types.ListRecordingConfigurationsResponse, AWSError>;
  /**
   * Gets summary information about stream keys for the specified channel.
   */
  listStreamKeys(params: IVS.Types.ListStreamKeysRequest, callback?: (err: AWSError, data: IVS.Types.ListStreamKeysResponse) => void): Request<IVS.Types.ListStreamKeysResponse, AWSError>;
  /**
   * Gets summary information about stream keys for the specified channel.
   */
  listStreamKeys(callback?: (err: AWSError, data: IVS.Types.ListStreamKeysResponse) => void): Request<IVS.Types.ListStreamKeysResponse, AWSError>;
  /**
   * Gets a summary of current and previous streams for a specified channel in your account, in the AWS region where the API request is processed.
   */
  listStreamSessions(params: IVS.Types.ListStreamSessionsRequest, callback?: (err: AWSError, data: IVS.Types.ListStreamSessionsResponse) => void): Request<IVS.Types.ListStreamSessionsResponse, AWSError>;
  /**
   * Gets a summary of current and previous streams for a specified channel in your account, in the AWS region where the API request is processed.
   */
  listStreamSessions(callback?: (err: AWSError, data: IVS.Types.ListStreamSessionsResponse) => void): Request<IVS.Types.ListStreamSessionsResponse, AWSError>;
  /**
   * Gets summary information about live streams in your account, in the Amazon Web Services region where the API request is processed.
   */
  listStreams(params: IVS.Types.ListStreamsRequest, callback?: (err: AWSError, data: IVS.Types.ListStreamsResponse) => void): Request<IVS.Types.ListStreamsResponse, AWSError>;
  /**
   * Gets summary information about live streams in your account, in the Amazon Web Services region where the API request is processed.
   */
  listStreams(callback?: (err: AWSError, data: IVS.Types.ListStreamsResponse) => void): Request<IVS.Types.ListStreamsResponse, AWSError>;
  /**
   * Gets information about Amazon Web Services tags for the specified ARN.
   */
  listTagsForResource(params: IVS.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: IVS.Types.ListTagsForResourceResponse) => void): Request<IVS.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Gets information about Amazon Web Services tags for the specified ARN.
   */
  listTagsForResource(callback?: (err: AWSError, data: IVS.Types.ListTagsForResourceResponse) => void): Request<IVS.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Inserts metadata into the active stream of the specified channel. At most 5 requests per second per channel are allowed, each with a maximum 1 KB payload. (If 5 TPS is not sufficient for your needs, we recommend batching your data into a single PutMetadata call.) At most 155 requests per second per account are allowed. Also see Embedding Metadata within a Video Stream in the Amazon IVS User Guide.
   */
  putMetadata(params: IVS.Types.PutMetadataRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Inserts metadata into the active stream of the specified channel. At most 5 requests per second per channel are allowed, each with a maximum 1 KB payload. (If 5 TPS is not sufficient for your needs, we recommend batching your data into a single PutMetadata call.) At most 155 requests per second per account are allowed. Also see Embedding Metadata within a Video Stream in the Amazon IVS User Guide.
   */
  putMetadata(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts the process of revoking the viewer session associated with a specified channel ARN and viewer ID. Optionally, you can provide a version to revoke viewer sessions less than and including that version. For instructions on associating a viewer ID with a viewer session, see Setting Up Private Channels.
   */
  startViewerSessionRevocation(params: IVS.Types.StartViewerSessionRevocationRequest, callback?: (err: AWSError, data: IVS.Types.StartViewerSessionRevocationResponse) => void): Request<IVS.Types.StartViewerSessionRevocationResponse, AWSError>;
  /**
   * Starts the process of revoking the viewer session associated with a specified channel ARN and viewer ID. Optionally, you can provide a version to revoke viewer sessions less than and including that version. For instructions on associating a viewer ID with a viewer session, see Setting Up Private Channels.
   */
  startViewerSessionRevocation(callback?: (err: AWSError, data: IVS.Types.StartViewerSessionRevocationResponse) => void): Request<IVS.Types.StartViewerSessionRevocationResponse, AWSError>;
  /**
   * Disconnects the incoming RTMPS stream for the specified channel. Can be used in conjunction with DeleteStreamKey to prevent further streaming to a channel.  Many streaming client-software libraries automatically reconnect a dropped RTMPS session, so to stop the stream permanently, you may want to first revoke the streamKey attached to the channel. 
   */
  stopStream(params: IVS.Types.StopStreamRequest, callback?: (err: AWSError, data: IVS.Types.StopStreamResponse) => void): Request<IVS.Types.StopStreamResponse, AWSError>;
  /**
   * Disconnects the incoming RTMPS stream for the specified channel. Can be used in conjunction with DeleteStreamKey to prevent further streaming to a channel.  Many streaming client-software libraries automatically reconnect a dropped RTMPS session, so to stop the stream permanently, you may want to first revoke the streamKey attached to the channel. 
   */
  stopStream(callback?: (err: AWSError, data: IVS.Types.StopStreamResponse) => void): Request<IVS.Types.StopStreamResponse, AWSError>;
  /**
   * Adds or updates tags for the Amazon Web Services resource with the specified ARN.
   */
  tagResource(params: IVS.Types.TagResourceRequest, callback?: (err: AWSError, data: IVS.Types.TagResourceResponse) => void): Request<IVS.Types.TagResourceResponse, AWSError>;
  /**
   * Adds or updates tags for the Amazon Web Services resource with the specified ARN.
   */
  tagResource(callback?: (err: AWSError, data: IVS.Types.TagResourceResponse) => void): Request<IVS.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from the resource with the specified ARN.
   */
  untagResource(params: IVS.Types.UntagResourceRequest, callback?: (err: AWSError, data: IVS.Types.UntagResourceResponse) => void): Request<IVS.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from the resource with the specified ARN.
   */
  untagResource(callback?: (err: AWSError, data: IVS.Types.UntagResourceResponse) => void): Request<IVS.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a channel's configuration. Live channels cannot be updated. You must stop the ongoing stream, update the channel, and restart the stream for the changes to take effect.
   */
  updateChannel(params: IVS.Types.UpdateChannelRequest, callback?: (err: AWSError, data: IVS.Types.UpdateChannelResponse) => void): Request<IVS.Types.UpdateChannelResponse, AWSError>;
  /**
   * Updates a channel's configuration. Live channels cannot be updated. You must stop the ongoing stream, update the channel, and restart the stream for the changes to take effect.
   */
  updateChannel(callback?: (err: AWSError, data: IVS.Types.UpdateChannelResponse) => void): Request<IVS.Types.UpdateChannelResponse, AWSError>;
}
declare namespace IVS {
  export interface AudioConfiguration {
    /**
     * Number of audio channels.
     */
    channels?: Integer;
    /**
     * Codec used for the audio encoding.
     */
    codec?: String;
    /**
     * Number of audio samples recorded per second.
     */
    sampleRate?: Integer;
    /**
     * The expected ingest bitrate (bits per second). This is configured in the encoder.
     */
    targetBitrate?: Integer;
  }
  export interface BatchError {
    /**
     * Channel ARN.
     */
    arn?: ResourceArn;
    /**
     * Error code.
     */
    code?: errorCode;
    /**
     * Error message, determined by the application.
     */
    message?: errorMessage;
  }
  export type BatchErrors = BatchError[];
  export interface BatchGetChannelRequest {
    /**
     * Array of ARNs, one per channel.
     */
    arns: ChannelArnList;
  }
  export interface BatchGetChannelResponse {
    /**
     * 
     */
    channels?: Channels;
    /**
     * Each error object is related to a specific ARN in the request.
     */
    errors?: BatchErrors;
  }
  export interface BatchGetStreamKeyRequest {
    /**
     * Array of ARNs, one per stream key.
     */
    arns: StreamKeyArnList;
  }
  export interface BatchGetStreamKeyResponse {
    /**
     * 
     */
    errors?: BatchErrors;
    /**
     * 
     */
    streamKeys?: StreamKeys;
  }
  export interface BatchStartViewerSessionRevocationError {
    /**
     * Channel ARN.
     */
    channelArn: ChannelArn;
    /**
     * Error code.
     */
    code?: errorCode;
    /**
     * Error message, determined by the application.
     */
    message?: errorMessage;
    /**
     * The ID of the viewer session to revoke.
     */
    viewerId: ViewerId;
  }
  export type BatchStartViewerSessionRevocationErrors = BatchStartViewerSessionRevocationError[];
  export interface BatchStartViewerSessionRevocationRequest {
    /**
     * Array of viewer sessions, one per channel-ARN and viewer-ID pair.
     */
    viewerSessions: BatchStartViewerSessionRevocationViewerSessionList;
  }
  export interface BatchStartViewerSessionRevocationResponse {
    /**
     * Each error object is related to a specific channelArn and viewerId pair in the request.
     */
    errors?: BatchStartViewerSessionRevocationErrors;
  }
  export interface BatchStartViewerSessionRevocationViewerSession {
    /**
     * The ARN of the channel associated with the viewer session to revoke.
     */
    channelArn: ChannelArn;
    /**
     * The ID of the viewer associated with the viewer session to revoke. Do not use this field for personally identifying, confidential, or sensitive information.
     */
    viewerId: ViewerId;
    /**
     * An optional filter on which versions of the viewer session to revoke. All versions less than or equal to the specified version will be revoked. Default: 0.
     */
    viewerSessionVersionsLessThanOrEqualTo?: ViewerSessionVersion;
  }
  export type BatchStartViewerSessionRevocationViewerSessionList = BatchStartViewerSessionRevocationViewerSession[];
  export type Boolean = boolean;
  export interface Channel {
    /**
     * Channel ARN.
     */
    arn?: ChannelArn;
    /**
     * Whether the channel is private (enabled for playback authorization). Default: false.
     */
    authorized?: IsAuthorized;
    /**
     * Channel ingest endpoint, part of the definition of an ingest server, used when you set up streaming software.
     */
    ingestEndpoint?: IngestEndpoint;
    /**
     * Whether the channel allows insecure RTMP ingest. Default: false.
     */
    insecureIngest?: InsecureIngest;
    /**
     * Channel latency mode. Use NORMAL to broadcast and deliver live video up to Full HD. Use LOW for near-real-time interaction with viewers. Default: LOW. (Note: In the Amazon IVS console, LOW and NORMAL correspond to Ultra-low and Standard, respectively.)
     */
    latencyMode?: ChannelLatencyMode;
    /**
     * Channel name.
     */
    name?: ChannelName;
    /**
     * Channel playback URL.
     */
    playbackUrl?: PlaybackURL;
    /**
     * Optional transcode preset for the channel. This is selectable only for ADVANCED_HD and ADVANCED_SD channel types. For those channel types, the default preset is HIGHER_BANDWIDTH_DELIVERY. For other channel types (BASIC and STANDARD), preset is the empty string ("").
     */
    preset?: TranscodePreset;
    /**
     * Recording-configuration ARN. A value other than an empty string indicates that recording is enabled. Default: "" (empty string, recording is disabled).
     */
    recordingConfigurationArn?: ChannelRecordingConfigurationArn;
    /**
     * Tags attached to the resource. Array of 1-50 maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags?: Tags;
    /**
     * Channel type, which determines the allowable resolution and bitrate. If you exceed the allowable input resolution or bitrate, the stream probably will disconnect immediately. Default: STANDARD. For details, see Channel Types.
     */
    type?: ChannelType;
  }
  export type ChannelArn = string;
  export type ChannelArnList = ChannelArn[];
  export type ChannelLatencyMode = "NORMAL"|"LOW"|string;
  export type ChannelList = ChannelSummary[];
  export type ChannelName = string;
  export type ChannelRecordingConfigurationArn = string;
  export interface ChannelSummary {
    /**
     * Channel ARN.
     */
    arn?: ChannelArn;
    /**
     * Whether the channel is private (enabled for playback authorization). Default: false.
     */
    authorized?: IsAuthorized;
    /**
     * Whether the channel allows insecure RTMP ingest. Default: false.
     */
    insecureIngest?: InsecureIngest;
    /**
     * Channel latency mode. Use NORMAL to broadcast and deliver live video up to Full HD. Use LOW for near-real-time interaction with viewers. Default: LOW. (Note: In the Amazon IVS console, LOW and NORMAL correspond to Ultra-low and Standard, respectively.)
     */
    latencyMode?: ChannelLatencyMode;
    /**
     * Channel name.
     */
    name?: ChannelName;
    /**
     * Optional transcode preset for the channel. This is selectable only for ADVANCED_HD and ADVANCED_SD channel types. For those channel types, the default preset is HIGHER_BANDWIDTH_DELIVERY. For other channel types (BASIC and STANDARD), preset is the empty string ("").
     */
    preset?: TranscodePreset;
    /**
     * Recording-configuration ARN. A value other than an empty string indicates that recording is enabled. Default: "" (empty string, recording is disabled).
     */
    recordingConfigurationArn?: ChannelRecordingConfigurationArn;
    /**
     * Tags attached to the resource. Array of 1-50 maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags?: Tags;
    /**
     * Channel type, which determines the allowable resolution and bitrate. If you exceed the allowable input resolution or bitrate, the stream probably will disconnect immediately. Default: STANDARD. For details, see Channel Types.
     */
    type?: ChannelType;
  }
  export type ChannelType = "BASIC"|"STANDARD"|"ADVANCED_SD"|"ADVANCED_HD"|string;
  export type Channels = Channel[];
  export interface CreateChannelRequest {
    /**
     * Whether the channel is private (enabled for playback authorization). Default: false.
     */
    authorized?: Boolean;
    /**
     * Whether the channel allows insecure RTMP ingest. Default: false.
     */
    insecureIngest?: Boolean;
    /**
     * Channel latency mode. Use NORMAL to broadcast and deliver live video up to Full HD. Use LOW for near-real-time interaction with viewers. (Note: In the Amazon IVS console, LOW and NORMAL correspond to Ultra-low and Standard, respectively.) Default: LOW.
     */
    latencyMode?: ChannelLatencyMode;
    /**
     * Channel name.
     */
    name?: ChannelName;
    /**
     * Optional transcode preset for the channel. This is selectable only for ADVANCED_HD and ADVANCED_SD channel types. For those channel types, the default preset is HIGHER_BANDWIDTH_DELIVERY. For other channel types (BASIC and STANDARD), preset is the empty string ("").
     */
    preset?: TranscodePreset;
    /**
     * Recording-configuration ARN. Default: "" (empty string, recording is disabled).
     */
    recordingConfigurationArn?: ChannelRecordingConfigurationArn;
    /**
     * Array of 1-50 maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags?: Tags;
    /**
     * Channel type, which determines the allowable resolution and bitrate. If you exceed the allowable input resolution or bitrate, the stream probably will disconnect immediately. Default: STANDARD. For details, see Channel Types.
     */
    type?: ChannelType;
  }
  export interface CreateChannelResponse {
    /**
     * 
     */
    channel?: Channel;
    /**
     * 
     */
    streamKey?: StreamKey;
  }
  export interface CreateRecordingConfigurationRequest {
    /**
     * A complex type that contains a destination configuration for where recorded video will be stored.
     */
    destinationConfiguration: DestinationConfiguration;
    /**
     * Recording-configuration name. The value does not need to be unique.
     */
    name?: RecordingConfigurationName;
    /**
     * If a broadcast disconnects and then reconnects within the specified interval, the multiple streams will be considered a single broadcast and merged together. Default: 0.
     */
    recordingReconnectWindowSeconds?: RecordingReconnectWindowSeconds;
    /**
     * Object that describes which renditions should be recorded for a stream.
     */
    renditionConfiguration?: RenditionConfiguration;
    /**
     * Array of 1-50 maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags?: Tags;
    /**
     * A complex type that allows you to enable/disable the recording of thumbnails for a live session and modify the interval at which thumbnails are generated for the live session.
     */
    thumbnailConfiguration?: ThumbnailConfiguration;
  }
  export interface CreateRecordingConfigurationResponse {
    /**
     * 
     */
    recordingConfiguration?: RecordingConfiguration;
  }
  export interface CreateStreamKeyRequest {
    /**
     * ARN of the channel for which to create the stream key.
     */
    channelArn: ChannelArn;
    /**
     * Array of 1-50 maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags?: Tags;
  }
  export interface CreateStreamKeyResponse {
    /**
     * Stream key used to authenticate an RTMPS stream for ingestion.
     */
    streamKey?: StreamKey;
  }
  export interface DeleteChannelRequest {
    /**
     * ARN of the channel to be deleted.
     */
    arn: ChannelArn;
  }
  export interface DeletePlaybackKeyPairRequest {
    /**
     * ARN of the key pair to be deleted.
     */
    arn: PlaybackKeyPairArn;
  }
  export interface DeletePlaybackKeyPairResponse {
  }
  export interface DeleteRecordingConfigurationRequest {
    /**
     * ARN of the recording configuration to be deleted.
     */
    arn: RecordingConfigurationArn;
  }
  export interface DeleteStreamKeyRequest {
    /**
     * ARN of the stream key to be deleted.
     */
    arn: StreamKeyArn;
  }
  export interface DestinationConfiguration {
    /**
     * An S3 destination configuration where recorded videos will be stored.
     */
    s3?: S3DestinationConfiguration;
  }
  export interface GetChannelRequest {
    /**
     * ARN of the channel for which the configuration is to be retrieved.
     */
    arn: ChannelArn;
  }
  export interface GetChannelResponse {
    /**
     * 
     */
    channel?: Channel;
  }
  export interface GetPlaybackKeyPairRequest {
    /**
     * ARN of the key pair to be returned.
     */
    arn: PlaybackKeyPairArn;
  }
  export interface GetPlaybackKeyPairResponse {
    /**
     * 
     */
    keyPair?: PlaybackKeyPair;
  }
  export interface GetRecordingConfigurationRequest {
    /**
     * ARN of the recording configuration to be retrieved.
     */
    arn: RecordingConfigurationArn;
  }
  export interface GetRecordingConfigurationResponse {
    /**
     * 
     */
    recordingConfiguration?: RecordingConfiguration;
  }
  export interface GetStreamKeyRequest {
    /**
     * ARN for the stream key to be retrieved.
     */
    arn: StreamKeyArn;
  }
  export interface GetStreamKeyResponse {
    /**
     * 
     */
    streamKey?: StreamKey;
  }
  export interface GetStreamRequest {
    /**
     * Channel ARN for stream to be accessed.
     */
    channelArn: ChannelArn;
  }
  export interface GetStreamResponse {
    /**
     * 
     */
    stream?: Stream;
  }
  export interface GetStreamSessionRequest {
    /**
     * ARN of the channel resource
     */
    channelArn: ChannelArn;
    /**
     * Unique identifier for a live or previously live stream in the specified channel. If no streamId is provided, this returns the most recent stream session for the channel, if it exists.
     */
    streamId?: StreamId;
  }
  export interface GetStreamSessionResponse {
    /**
     * List of stream details.
     */
    streamSession?: StreamSession;
  }
  export interface ImportPlaybackKeyPairRequest {
    /**
     * Playback-key-pair name. The value does not need to be unique.
     */
    name?: PlaybackKeyPairName;
    /**
     * The public portion of a customer-generated key pair.
     */
    publicKeyMaterial: PlaybackPublicKeyMaterial;
    /**
     * Any tags provided with the request are added to the playback key pair tags. See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags?: Tags;
  }
  export interface ImportPlaybackKeyPairResponse {
    /**
     * 
     */
    keyPair?: PlaybackKeyPair;
  }
  export interface IngestConfiguration {
    /**
     * Encoder settings for audio.
     */
    audio?: AudioConfiguration;
    /**
     * Encoder settings for video.
     */
    video?: VideoConfiguration;
  }
  export type IngestEndpoint = string;
  export type InsecureIngest = boolean;
  export type Integer = number;
  export type IsAuthorized = boolean;
  export interface ListChannelsRequest {
    /**
     * Filters the channel list to match the specified name.
     */
    filterByName?: ChannelName;
    /**
     * Filters the channel list to match the specified recording-configuration ARN.
     */
    filterByRecordingConfigurationArn?: ChannelRecordingConfigurationArn;
    /**
     * Maximum number of channels to return. Default: 100.
     */
    maxResults?: MaxChannelResults;
    /**
     * The first channel to retrieve. This is used for pagination; see the nextToken response field.
     */
    nextToken?: PaginationToken;
  }
  export interface ListChannelsResponse {
    /**
     * List of the matching channels.
     */
    channels: ChannelList;
    /**
     * If there are more channels than maxResults, use nextToken in the request to get the next set.
     */
    nextToken?: PaginationToken;
  }
  export interface ListPlaybackKeyPairsRequest {
    /**
     * Maximum number of key pairs to return. Default: your service quota or 100, whichever is smaller.
     */
    maxResults?: MaxPlaybackKeyPairResults;
    /**
     * The first key pair to retrieve. This is used for pagination; see the nextToken response field.
     */
    nextToken?: PaginationToken;
  }
  export interface ListPlaybackKeyPairsResponse {
    /**
     * List of key pairs.
     */
    keyPairs: PlaybackKeyPairList;
    /**
     * If there are more key pairs than maxResults, use nextToken in the request to get the next set.
     */
    nextToken?: PaginationToken;
  }
  export interface ListRecordingConfigurationsRequest {
    /**
     * Maximum number of recording configurations to return. Default: your service quota or 100, whichever is smaller. 
     */
    maxResults?: MaxRecordingConfigurationResults;
    /**
     * The first recording configuration to retrieve. This is used for pagination; see the nextToken response field.
     */
    nextToken?: PaginationToken;
  }
  export interface ListRecordingConfigurationsResponse {
    /**
     * If there are more recording configurations than maxResults, use nextToken in the request to get the next set.
     */
    nextToken?: PaginationToken;
    /**
     * List of the matching recording configurations.
     */
    recordingConfigurations: RecordingConfigurationList;
  }
  export interface ListStreamKeysRequest {
    /**
     * Channel ARN used to filter the list.
     */
    channelArn: ChannelArn;
    /**
     * Maximum number of streamKeys to return. Default: 1.
     */
    maxResults?: MaxStreamKeyResults;
    /**
     * The first stream key to retrieve. This is used for pagination; see the nextToken response field.
     */
    nextToken?: PaginationToken;
  }
  export interface ListStreamKeysResponse {
    /**
     * If there are more stream keys than maxResults, use nextToken in the request to get the next set.
     */
    nextToken?: PaginationToken;
    /**
     * List of stream keys.
     */
    streamKeys: StreamKeyList;
  }
  export interface ListStreamSessionsRequest {
    /**
     * Channel ARN used to filter the list.
     */
    channelArn: ChannelArn;
    /**
     * Maximum number of streams to return. Default: 100.
     */
    maxResults?: MaxStreamResults;
    /**
     * The first stream to retrieve. This is used for pagination; see the nextToken response field.
     */
    nextToken?: PaginationToken;
  }
  export interface ListStreamSessionsResponse {
    /**
     * If there are more streams than maxResults, use nextToken in the request to get the next set.
     */
    nextToken?: PaginationToken;
    /**
     * List of stream sessions.
     */
    streamSessions: StreamSessionList;
  }
  export interface ListStreamsRequest {
    /**
     * Filters the stream list to match the specified criterion.
     */
    filterBy?: StreamFilters;
    /**
     * Maximum number of streams to return. Default: 100.
     */
    maxResults?: MaxStreamResults;
    /**
     * The first stream to retrieve. This is used for pagination; see the nextToken response field.
     */
    nextToken?: PaginationToken;
  }
  export interface ListStreamsResponse {
    /**
     * If there are more streams than maxResults, use nextToken in the request to get the next set.
     */
    nextToken?: PaginationToken;
    /**
     * List of streams.
     */
    streams: StreamList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource to be retrieved. The ARN must be URL-encoded.
     */
    resourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Tags attached to the resource. Array of maps, each of the form string:string (key:value).
     */
    tags: Tags;
  }
  export type MaxChannelResults = number;
  export type MaxPlaybackKeyPairResults = number;
  export type MaxRecordingConfigurationResults = number;
  export type MaxStreamKeyResults = number;
  export type MaxStreamResults = number;
  export type PaginationToken = string;
  export interface PlaybackKeyPair {
    /**
     * Key-pair ARN.
     */
    arn?: PlaybackKeyPairArn;
    /**
     * Key-pair identifier.
     */
    fingerprint?: PlaybackKeyPairFingerprint;
    /**
     * Playback-key-pair name. The value does not need to be unique.
     */
    name?: PlaybackKeyPairName;
    /**
     * Tags attached to the resource. Array of 1-50 maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags?: Tags;
  }
  export type PlaybackKeyPairArn = string;
  export type PlaybackKeyPairFingerprint = string;
  export type PlaybackKeyPairList = PlaybackKeyPairSummary[];
  export type PlaybackKeyPairName = string;
  export interface PlaybackKeyPairSummary {
    /**
     * Key-pair ARN.
     */
    arn?: PlaybackKeyPairArn;
    /**
     * Playback-key-pair name. The value does not need to be unique.
     */
    name?: PlaybackKeyPairName;
    /**
     * Tags attached to the resource. Array of 1-50 maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags?: Tags;
  }
  export type PlaybackPublicKeyMaterial = string;
  export type PlaybackURL = string;
  export interface PutMetadataRequest {
    /**
     * ARN of the channel into which metadata is inserted. This channel must have an active stream.
     */
    channelArn: ChannelArn;
    /**
     * Metadata to insert into the stream. Maximum: 1 KB per request.
     */
    metadata: StreamMetadata;
  }
  export interface RecordingConfiguration {
    /**
     * Recording-configuration ARN.
     */
    arn: RecordingConfigurationArn;
    /**
     * A complex type that contains information about where recorded video will be stored.
     */
    destinationConfiguration: DestinationConfiguration;
    /**
     * Recording-configuration name. The value does not need to be unique.
     */
    name?: RecordingConfigurationName;
    /**
     * If a broadcast disconnects and then reconnects within the specified interval, the multiple streams will be considered a single broadcast and merged together. Default: 0.
     */
    recordingReconnectWindowSeconds?: RecordingReconnectWindowSeconds;
    /**
     * Object that describes which renditions should be recorded for a stream.
     */
    renditionConfiguration?: RenditionConfiguration;
    /**
     * Indicates the current state of the recording configuration. When the state is ACTIVE, the configuration is ready for recording a channel stream.
     */
    state: RecordingConfigurationState;
    /**
     * Tags attached to the resource. Array of 1-50 maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags?: Tags;
    /**
     * A complex type that allows you to enable/disable the recording of thumbnails for a live session and modify the interval at which thumbnails are generated for the live session.
     */
    thumbnailConfiguration?: ThumbnailConfiguration;
  }
  export type RecordingConfigurationArn = string;
  export type RecordingConfigurationList = RecordingConfigurationSummary[];
  export type RecordingConfigurationName = string;
  export type RecordingConfigurationState = "CREATING"|"CREATE_FAILED"|"ACTIVE"|string;
  export interface RecordingConfigurationSummary {
    /**
     * Recording-configuration ARN.
     */
    arn: RecordingConfigurationArn;
    /**
     * A complex type that contains information about where recorded video will be stored.
     */
    destinationConfiguration: DestinationConfiguration;
    /**
     * Recording-configuration name. The value does not need to be unique.
     */
    name?: RecordingConfigurationName;
    /**
     * Indicates the current state of the recording configuration. When the state is ACTIVE, the configuration is ready for recording a channel stream.
     */
    state: RecordingConfigurationState;
    /**
     * Tags attached to the resource. Array of 1-50 maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags?: Tags;
  }
  export type RecordingMode = "DISABLED"|"INTERVAL"|string;
  export type RecordingReconnectWindowSeconds = number;
  export interface RenditionConfiguration {
    /**
     * Indicates which set of renditions are recorded for a stream. For BASIC channels, the CUSTOM value has no effect. If CUSTOM is specified, a set of renditions must be specified in the renditions field. Default: ALL.
     */
    renditionSelection?: RenditionConfigurationRenditionSelection;
    /**
     * Indicates which renditions are recorded for a stream, if renditionSelection is CUSTOM; otherwise, this field is irrelevant. The selected renditions are recorded if they are available during the stream. If a selected rendition is unavailable, the best available rendition is recorded. For details on the resolution dimensions of each rendition, see Auto-Record to Amazon S3.
     */
    renditions?: RenditionConfigurationRenditionList;
  }
  export type RenditionConfigurationRendition = "FULL_HD"|"HD"|"SD"|"LOWEST_RESOLUTION"|string;
  export type RenditionConfigurationRenditionList = RenditionConfigurationRendition[];
  export type RenditionConfigurationRenditionSelection = "ALL"|"NONE"|"CUSTOM"|string;
  export type ResourceArn = string;
  export type S3DestinationBucketName = string;
  export interface S3DestinationConfiguration {
    /**
     * Location (S3 bucket name) where recorded videos will be stored.
     */
    bucketName: S3DestinationBucketName;
  }
  export interface StartViewerSessionRevocationRequest {
    /**
     * The ARN of the channel associated with the viewer session to revoke.
     */
    channelArn: ChannelArn;
    /**
     * The ID of the viewer associated with the viewer session to revoke. Do not use this field for personally identifying, confidential, or sensitive information.
     */
    viewerId: ViewerId;
    /**
     * An optional filter on which versions of the viewer session to revoke. All versions less than or equal to the specified version will be revoked. Default: 0.
     */
    viewerSessionVersionsLessThanOrEqualTo?: ViewerSessionVersion;
  }
  export interface StartViewerSessionRevocationResponse {
  }
  export interface StopStreamRequest {
    /**
     * ARN of the channel for which the stream is to be stopped.
     */
    channelArn: ChannelArn;
  }
  export interface StopStreamResponse {
  }
  export interface Stream {
    /**
     * Channel ARN for the stream.
     */
    channelArn?: ChannelArn;
    /**
     * The stream’s health.
     */
    health?: StreamHealth;
    /**
     * URL of the master playlist, required by the video player to play the HLS stream.
     */
    playbackUrl?: PlaybackURL;
    /**
     * Time of the stream’s start. This is an ISO 8601 timestamp; note that this is returned as a string.
     */
    startTime?: StreamStartTime;
    /**
     * The stream’s state. Do not rely on the OFFLINE state, as the API may not return it; instead, a "NotBroadcasting" error will indicate that the stream is not live.
     */
    state?: StreamState;
    /**
     * Unique identifier for a live or previously live stream in the specified channel.
     */
    streamId?: StreamId;
    /**
     * A count of concurrent views of the stream. Typically, a new view appears in viewerCount within 15 seconds of when video playback starts and a view is removed from viewerCount within 1 minute of when video playback ends. A value of -1 indicates that the request timed out; in this case, retry.
     */
    viewerCount?: StreamViewerCount;
  }
  export interface StreamEvent {
    /**
     * Time when the event occurred. This is an ISO 8601 timestamp; note that this is returned as a string.
     */
    eventTime?: Time;
    /**
     * Name that identifies the stream event within a type.
     */
    name?: String;
    /**
     * Logical group for certain events.
     */
    type?: String;
  }
  export type StreamEvents = StreamEvent[];
  export interface StreamFilters {
    /**
     * The stream’s health.
     */
    health?: StreamHealth;
  }
  export type StreamHealth = "HEALTHY"|"STARVING"|"UNKNOWN"|string;
  export type StreamId = string;
  export interface StreamKey {
    /**
     * Stream-key ARN.
     */
    arn?: StreamKeyArn;
    /**
     * Channel ARN for the stream.
     */
    channelArn?: ChannelArn;
    /**
     * Tags attached to the resource. Array of 1-50 maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags?: Tags;
    /**
     * Stream-key value.
     */
    value?: StreamKeyValue;
  }
  export type StreamKeyArn = string;
  export type StreamKeyArnList = StreamKeyArn[];
  export type StreamKeyList = StreamKeySummary[];
  export interface StreamKeySummary {
    /**
     * Stream-key ARN.
     */
    arn?: StreamKeyArn;
    /**
     * Channel ARN for the stream.
     */
    channelArn?: ChannelArn;
    /**
     * Tags attached to the resource. Array of 1-50 maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags?: Tags;
  }
  export type StreamKeyValue = string;
  export type StreamKeys = StreamKey[];
  export type StreamList = StreamSummary[];
  export type StreamMetadata = string;
  export interface StreamSession {
    /**
     * The properties of the channel at the time of going live.
     */
    channel?: Channel;
    /**
     * Time when the channel went offline. This is an ISO 8601 timestamp; note that this is returned as a string. For live streams, this is NULL.
     */
    endTime?: Time;
    /**
     * The properties of the incoming RTMP stream for the stream.
     */
    ingestConfiguration?: IngestConfiguration;
    /**
     * The properties of recording the live stream.
     */
    recordingConfiguration?: RecordingConfiguration;
    /**
     * Time when the channel went live. This is an ISO 8601 timestamp; note that this is returned as a string.
     */
    startTime?: Time;
    /**
     * Unique identifier for a live or previously live stream in the specified channel.
     */
    streamId?: StreamId;
    /**
     * List of Amazon IVS events that the stream encountered. The list is sorted by most recent events and contains up to 500 events. For Amazon IVS events, see Using Amazon EventBridge with Amazon IVS.
     */
    truncatedEvents?: StreamEvents;
  }
  export type StreamSessionList = StreamSessionSummary[];
  export interface StreamSessionSummary {
    /**
     * Time when the channel went offline. This is an ISO 8601 timestamp; note that this is returned as a string. For live streams, this is NULL.
     */
    endTime?: Time;
    /**
     * If true, this stream encountered a quota breach or failure.
     */
    hasErrorEvent?: Boolean;
    /**
     * Time when the channel went live. This is an ISO 8601 timestamp; note that this is returned as a string.
     */
    startTime?: Time;
    /**
     * Unique identifier for a live or previously live stream in the specified channel.
     */
    streamId?: StreamId;
  }
  export type StreamStartTime = Date;
  export type StreamState = "LIVE"|"OFFLINE"|string;
  export interface StreamSummary {
    /**
     * Channel ARN for the stream.
     */
    channelArn?: ChannelArn;
    /**
     * The stream’s health.
     */
    health?: StreamHealth;
    /**
     * Time of the stream’s start. This is an ISO 8601 timestamp; note that this is returned as a string. 
     */
    startTime?: StreamStartTime;
    /**
     * The stream’s state. Do not rely on the OFFLINE state, as the API may not return it; instead, a "NotBroadcasting" error will indicate that the stream is not live.
     */
    state?: StreamState;
    /**
     * Unique identifier for a live or previously live stream in the specified channel.
     */
    streamId?: StreamId;
    /**
     * A count of concurrent views of the stream. Typically, a new view appears in viewerCount within 15 seconds of when video playback starts and a view is removed from viewerCount within 1 minute of when video playback ends. A value of -1 indicates that the request timed out; in this case, retry.
     */
    viewerCount?: StreamViewerCount;
  }
  export type StreamViewerCount = number;
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export interface TagResourceRequest {
    /**
     * ARN of the resource for which tags are to be added or updated. The ARN must be URL-encoded.
     */
    resourceArn: ResourceArn;
    /**
     * Array of tags to be added or updated. Array of maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = {[key: string]: TagValue};
  export type TargetIntervalSeconds = number;
  export interface ThumbnailConfiguration {
    /**
     * Thumbnail recording mode. Default: INTERVAL.
     */
    recordingMode?: RecordingMode;
    /**
     * Indicates the desired resolution of recorded thumbnails. Thumbnails are recorded at the selected resolution if the corresponding rendition is available during the stream; otherwise, they are recorded at source resolution. For more information about resolution values and their corresponding height and width dimensions, see Auto-Record to Amazon S3. Default: Null (source resolution is returned).
     */
    resolution?: ThumbnailConfigurationResolution;
    /**
     * Indicates the format in which thumbnails are recorded. SEQUENTIAL records all generated thumbnails in a serial manner, to the media/thumbnails directory. LATEST saves the latest thumbnail in media/latest_thumbnail/thumb.jpg and overwrites it at the interval specified by targetIntervalSeconds. You can enable both SEQUENTIAL and LATEST. Default: SEQUENTIAL.
     */
    storage?: ThumbnailConfigurationStorageList;
    /**
     * The targeted thumbnail-generation interval in seconds. This is configurable (and required) only if recordingMode is INTERVAL. Default: 60.  Important: For the BASIC channel type, setting a value for targetIntervalSeconds does not guarantee that thumbnails are generated at the specified interval. For thumbnails to be generated at the targetIntervalSeconds interval, the IDR/Keyframe value for the input video must be less than the targetIntervalSeconds value. See  Amazon IVS Streaming Configuration for information on setting IDR/Keyframe to the recommended value in video-encoder settings.
     */
    targetIntervalSeconds?: TargetIntervalSeconds;
  }
  export type ThumbnailConfigurationResolution = "FULL_HD"|"HD"|"SD"|"LOWEST_RESOLUTION"|string;
  export type ThumbnailConfigurationStorage = "SEQUENTIAL"|"LATEST"|string;
  export type ThumbnailConfigurationStorageList = ThumbnailConfigurationStorage[];
  export type Time = Date;
  export type TranscodePreset = "HIGHER_BANDWIDTH_DELIVERY"|"CONSTRAINED_BANDWIDTH_DELIVERY"|string;
  export interface UntagResourceRequest {
    /**
     * ARN of the resource for which tags are to be removed. The ARN must be URL-encoded.
     */
    resourceArn: ResourceArn;
    /**
     * Array of tags to be removed. Array of maps, each of the form string:string (key:value). See Tagging Amazon Web Services Resources for more information, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no service-specific constraints beyond what is documented there.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateChannelRequest {
    /**
     * ARN of the channel to be updated.
     */
    arn: ChannelArn;
    /**
     * Whether the channel is private (enabled for playback authorization).
     */
    authorized?: Boolean;
    /**
     * Whether the channel allows insecure RTMP ingest. Default: false.
     */
    insecureIngest?: Boolean;
    /**
     * Channel latency mode. Use NORMAL to broadcast and deliver live video up to Full HD. Use LOW for near-real-time interaction with viewers. (Note: In the Amazon IVS console, LOW and NORMAL correspond to Ultra-low and Standard, respectively.)
     */
    latencyMode?: ChannelLatencyMode;
    /**
     * Channel name.
     */
    name?: ChannelName;
    /**
     * Optional transcode preset for the channel. This is selectable only for ADVANCED_HD and ADVANCED_SD channel types. For those channel types, the default preset is HIGHER_BANDWIDTH_DELIVERY. For other channel types (BASIC and STANDARD), preset is the empty string ("").
     */
    preset?: TranscodePreset;
    /**
     * Recording-configuration ARN. If this is set to an empty string, recording is disabled. A value other than an empty string indicates that recording is enabled
     */
    recordingConfigurationArn?: ChannelRecordingConfigurationArn;
    /**
     * Channel type, which determines the allowable resolution and bitrate. If you exceed the allowable input resolution or bitrate, the stream probably will disconnect immediately. Default: STANDARD. For details, see Channel Types.
     */
    type?: ChannelType;
  }
  export interface UpdateChannelResponse {
    channel?: Channel;
  }
  export interface VideoConfiguration {
    /**
     * Indicates the degree of required decoder performance for a profile. Normally this is set automatically by the encoder. For details, see the H.264 specification.
     */
    avcLevel?: String;
    /**
     * Indicates to the decoder the requirements for decoding the stream. For definitions of the valid values, see the H.264 specification.
     */
    avcProfile?: String;
    /**
     * Codec used for the video encoding.
     */
    codec?: String;
    /**
     * Software or hardware used to encode the video.
     */
    encoder?: String;
    /**
     * The expected ingest bitrate (bits per second). This is configured in the encoder.
     */
    targetBitrate?: Integer;
    /**
     * The expected ingest framerate. This is configured in the encoder.
     */
    targetFramerate?: Integer;
    /**
     * Video-resolution height in pixels.
     */
    videoHeight?: Integer;
    /**
     * Video-resolution width in pixels.
     */
    videoWidth?: Integer;
  }
  export type ViewerId = string;
  export type ViewerSessionVersion = number;
  export type errorCode = string;
  export type errorMessage = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-07-14"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IVS client.
   */
  export import Types = IVS;
}
export = IVS;
