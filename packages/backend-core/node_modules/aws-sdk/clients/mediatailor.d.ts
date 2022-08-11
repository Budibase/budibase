import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MediaTailor extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MediaTailor.Types.ClientConfiguration)
  config: Config & MediaTailor.Types.ClientConfiguration;
  /**
   * Configures Amazon CloudWatch log settings for a playback configuration.
   */
  configureLogsForPlaybackConfiguration(params: MediaTailor.Types.ConfigureLogsForPlaybackConfigurationRequest, callback?: (err: AWSError, data: MediaTailor.Types.ConfigureLogsForPlaybackConfigurationResponse) => void): Request<MediaTailor.Types.ConfigureLogsForPlaybackConfigurationResponse, AWSError>;
  /**
   * Configures Amazon CloudWatch log settings for a playback configuration.
   */
  configureLogsForPlaybackConfiguration(callback?: (err: AWSError, data: MediaTailor.Types.ConfigureLogsForPlaybackConfigurationResponse) => void): Request<MediaTailor.Types.ConfigureLogsForPlaybackConfigurationResponse, AWSError>;
  /**
   * Creates a channel.
   */
  createChannel(params: MediaTailor.Types.CreateChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.CreateChannelResponse) => void): Request<MediaTailor.Types.CreateChannelResponse, AWSError>;
  /**
   * Creates a channel.
   */
  createChannel(callback?: (err: AWSError, data: MediaTailor.Types.CreateChannelResponse) => void): Request<MediaTailor.Types.CreateChannelResponse, AWSError>;
  /**
   * Creates a new prefetch schedule for the specified playback configuration.
   */
  createPrefetchSchedule(params: MediaTailor.Types.CreatePrefetchScheduleRequest, callback?: (err: AWSError, data: MediaTailor.Types.CreatePrefetchScheduleResponse) => void): Request<MediaTailor.Types.CreatePrefetchScheduleResponse, AWSError>;
  /**
   * Creates a new prefetch schedule for the specified playback configuration.
   */
  createPrefetchSchedule(callback?: (err: AWSError, data: MediaTailor.Types.CreatePrefetchScheduleResponse) => void): Request<MediaTailor.Types.CreatePrefetchScheduleResponse, AWSError>;
  /**
   * Creates a program.
   */
  createProgram(params: MediaTailor.Types.CreateProgramRequest, callback?: (err: AWSError, data: MediaTailor.Types.CreateProgramResponse) => void): Request<MediaTailor.Types.CreateProgramResponse, AWSError>;
  /**
   * Creates a program.
   */
  createProgram(callback?: (err: AWSError, data: MediaTailor.Types.CreateProgramResponse) => void): Request<MediaTailor.Types.CreateProgramResponse, AWSError>;
  /**
   * Creates a source location on a specific channel.
   */
  createSourceLocation(params: MediaTailor.Types.CreateSourceLocationRequest, callback?: (err: AWSError, data: MediaTailor.Types.CreateSourceLocationResponse) => void): Request<MediaTailor.Types.CreateSourceLocationResponse, AWSError>;
  /**
   * Creates a source location on a specific channel.
   */
  createSourceLocation(callback?: (err: AWSError, data: MediaTailor.Types.CreateSourceLocationResponse) => void): Request<MediaTailor.Types.CreateSourceLocationResponse, AWSError>;
  /**
   * Creates name for a specific VOD source in a source location.
   */
  createVodSource(params: MediaTailor.Types.CreateVodSourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.CreateVodSourceResponse) => void): Request<MediaTailor.Types.CreateVodSourceResponse, AWSError>;
  /**
   * Creates name for a specific VOD source in a source location.
   */
  createVodSource(callback?: (err: AWSError, data: MediaTailor.Types.CreateVodSourceResponse) => void): Request<MediaTailor.Types.CreateVodSourceResponse, AWSError>;
  /**
   * Deletes a channel. You must stop the channel before it can be deleted.
   */
  deleteChannel(params: MediaTailor.Types.DeleteChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeleteChannelResponse) => void): Request<MediaTailor.Types.DeleteChannelResponse, AWSError>;
  /**
   * Deletes a channel. You must stop the channel before it can be deleted.
   */
  deleteChannel(callback?: (err: AWSError, data: MediaTailor.Types.DeleteChannelResponse) => void): Request<MediaTailor.Types.DeleteChannelResponse, AWSError>;
  /**
   * Deletes a channel's IAM policy.
   */
  deleteChannelPolicy(params: MediaTailor.Types.DeleteChannelPolicyRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeleteChannelPolicyResponse) => void): Request<MediaTailor.Types.DeleteChannelPolicyResponse, AWSError>;
  /**
   * Deletes a channel's IAM policy.
   */
  deleteChannelPolicy(callback?: (err: AWSError, data: MediaTailor.Types.DeleteChannelPolicyResponse) => void): Request<MediaTailor.Types.DeleteChannelPolicyResponse, AWSError>;
  /**
   * Deletes the playback configuration for the specified name.  
   */
  deletePlaybackConfiguration(params: MediaTailor.Types.DeletePlaybackConfigurationRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeletePlaybackConfigurationResponse) => void): Request<MediaTailor.Types.DeletePlaybackConfigurationResponse, AWSError>;
  /**
   * Deletes the playback configuration for the specified name.  
   */
  deletePlaybackConfiguration(callback?: (err: AWSError, data: MediaTailor.Types.DeletePlaybackConfigurationResponse) => void): Request<MediaTailor.Types.DeletePlaybackConfigurationResponse, AWSError>;
  /**
   * Deletes a prefetch schedule for a specific playback configuration. If you call DeletePrefetchSchedule on an expired prefetch schedule, MediaTailor returns an HTTP 404 status code.
   */
  deletePrefetchSchedule(params: MediaTailor.Types.DeletePrefetchScheduleRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeletePrefetchScheduleResponse) => void): Request<MediaTailor.Types.DeletePrefetchScheduleResponse, AWSError>;
  /**
   * Deletes a prefetch schedule for a specific playback configuration. If you call DeletePrefetchSchedule on an expired prefetch schedule, MediaTailor returns an HTTP 404 status code.
   */
  deletePrefetchSchedule(callback?: (err: AWSError, data: MediaTailor.Types.DeletePrefetchScheduleResponse) => void): Request<MediaTailor.Types.DeletePrefetchScheduleResponse, AWSError>;
  /**
   * Deletes a specific program on a specific channel.
   */
  deleteProgram(params: MediaTailor.Types.DeleteProgramRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeleteProgramResponse) => void): Request<MediaTailor.Types.DeleteProgramResponse, AWSError>;
  /**
   * Deletes a specific program on a specific channel.
   */
  deleteProgram(callback?: (err: AWSError, data: MediaTailor.Types.DeleteProgramResponse) => void): Request<MediaTailor.Types.DeleteProgramResponse, AWSError>;
  /**
   * Deletes a source location on a specific channel.
   */
  deleteSourceLocation(params: MediaTailor.Types.DeleteSourceLocationRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeleteSourceLocationResponse) => void): Request<MediaTailor.Types.DeleteSourceLocationResponse, AWSError>;
  /**
   * Deletes a source location on a specific channel.
   */
  deleteSourceLocation(callback?: (err: AWSError, data: MediaTailor.Types.DeleteSourceLocationResponse) => void): Request<MediaTailor.Types.DeleteSourceLocationResponse, AWSError>;
  /**
   * Deletes a specific VOD source in a specific source location.
   */
  deleteVodSource(params: MediaTailor.Types.DeleteVodSourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeleteVodSourceResponse) => void): Request<MediaTailor.Types.DeleteVodSourceResponse, AWSError>;
  /**
   * Deletes a specific VOD source in a specific source location.
   */
  deleteVodSource(callback?: (err: AWSError, data: MediaTailor.Types.DeleteVodSourceResponse) => void): Request<MediaTailor.Types.DeleteVodSourceResponse, AWSError>;
  /**
   * Describes the properties of a specific channel.
   */
  describeChannel(params: MediaTailor.Types.DescribeChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.DescribeChannelResponse) => void): Request<MediaTailor.Types.DescribeChannelResponse, AWSError>;
  /**
   * Describes the properties of a specific channel.
   */
  describeChannel(callback?: (err: AWSError, data: MediaTailor.Types.DescribeChannelResponse) => void): Request<MediaTailor.Types.DescribeChannelResponse, AWSError>;
  /**
   * Retrieves the properties of the requested program.
   */
  describeProgram(params: MediaTailor.Types.DescribeProgramRequest, callback?: (err: AWSError, data: MediaTailor.Types.DescribeProgramResponse) => void): Request<MediaTailor.Types.DescribeProgramResponse, AWSError>;
  /**
   * Retrieves the properties of the requested program.
   */
  describeProgram(callback?: (err: AWSError, data: MediaTailor.Types.DescribeProgramResponse) => void): Request<MediaTailor.Types.DescribeProgramResponse, AWSError>;
  /**
   * Retrieves the properties of the requested source location.
   */
  describeSourceLocation(params: MediaTailor.Types.DescribeSourceLocationRequest, callback?: (err: AWSError, data: MediaTailor.Types.DescribeSourceLocationResponse) => void): Request<MediaTailor.Types.DescribeSourceLocationResponse, AWSError>;
  /**
   * Retrieves the properties of the requested source location.
   */
  describeSourceLocation(callback?: (err: AWSError, data: MediaTailor.Types.DescribeSourceLocationResponse) => void): Request<MediaTailor.Types.DescribeSourceLocationResponse, AWSError>;
  /**
   * Provides details about a specific VOD source in a specific source location.
   */
  describeVodSource(params: MediaTailor.Types.DescribeVodSourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.DescribeVodSourceResponse) => void): Request<MediaTailor.Types.DescribeVodSourceResponse, AWSError>;
  /**
   * Provides details about a specific VOD source in a specific source location.
   */
  describeVodSource(callback?: (err: AWSError, data: MediaTailor.Types.DescribeVodSourceResponse) => void): Request<MediaTailor.Types.DescribeVodSourceResponse, AWSError>;
  /**
   * Retrieves information about a channel's IAM policy.
   */
  getChannelPolicy(params: MediaTailor.Types.GetChannelPolicyRequest, callback?: (err: AWSError, data: MediaTailor.Types.GetChannelPolicyResponse) => void): Request<MediaTailor.Types.GetChannelPolicyResponse, AWSError>;
  /**
   * Retrieves information about a channel's IAM policy.
   */
  getChannelPolicy(callback?: (err: AWSError, data: MediaTailor.Types.GetChannelPolicyResponse) => void): Request<MediaTailor.Types.GetChannelPolicyResponse, AWSError>;
  /**
   * Retrieves information about your channel's schedule.
   */
  getChannelSchedule(params: MediaTailor.Types.GetChannelScheduleRequest, callback?: (err: AWSError, data: MediaTailor.Types.GetChannelScheduleResponse) => void): Request<MediaTailor.Types.GetChannelScheduleResponse, AWSError>;
  /**
   * Retrieves information about your channel's schedule.
   */
  getChannelSchedule(callback?: (err: AWSError, data: MediaTailor.Types.GetChannelScheduleResponse) => void): Request<MediaTailor.Types.GetChannelScheduleResponse, AWSError>;
  /**
   * Returns the playback configuration for the specified name.  
   */
  getPlaybackConfiguration(params: MediaTailor.Types.GetPlaybackConfigurationRequest, callback?: (err: AWSError, data: MediaTailor.Types.GetPlaybackConfigurationResponse) => void): Request<MediaTailor.Types.GetPlaybackConfigurationResponse, AWSError>;
  /**
   * Returns the playback configuration for the specified name.  
   */
  getPlaybackConfiguration(callback?: (err: AWSError, data: MediaTailor.Types.GetPlaybackConfigurationResponse) => void): Request<MediaTailor.Types.GetPlaybackConfigurationResponse, AWSError>;
  /**
   * Returns information about the prefetch schedule for a specific playback configuration. If you call GetPrefetchSchedule on an expired prefetch schedule, MediaTailor returns an HTTP 404 status code.
   */
  getPrefetchSchedule(params: MediaTailor.Types.GetPrefetchScheduleRequest, callback?: (err: AWSError, data: MediaTailor.Types.GetPrefetchScheduleResponse) => void): Request<MediaTailor.Types.GetPrefetchScheduleResponse, AWSError>;
  /**
   * Returns information about the prefetch schedule for a specific playback configuration. If you call GetPrefetchSchedule on an expired prefetch schedule, MediaTailor returns an HTTP 404 status code.
   */
  getPrefetchSchedule(callback?: (err: AWSError, data: MediaTailor.Types.GetPrefetchScheduleResponse) => void): Request<MediaTailor.Types.GetPrefetchScheduleResponse, AWSError>;
  /**
   * Returns a list of alerts for the given resource.
   */
  listAlerts(params: MediaTailor.Types.ListAlertsRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListAlertsResponse) => void): Request<MediaTailor.Types.ListAlertsResponse, AWSError>;
  /**
   * Returns a list of alerts for the given resource.
   */
  listAlerts(callback?: (err: AWSError, data: MediaTailor.Types.ListAlertsResponse) => void): Request<MediaTailor.Types.ListAlertsResponse, AWSError>;
  /**
   * Retrieves a list of channels that are associated with this account.
   */
  listChannels(params: MediaTailor.Types.ListChannelsRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListChannelsResponse) => void): Request<MediaTailor.Types.ListChannelsResponse, AWSError>;
  /**
   * Retrieves a list of channels that are associated with this account.
   */
  listChannels(callback?: (err: AWSError, data: MediaTailor.Types.ListChannelsResponse) => void): Request<MediaTailor.Types.ListChannelsResponse, AWSError>;
  /**
   * Returns a list of the playback configurations defined in AWS Elemental MediaTailor. You can specify a maximum number of configurations to return at a time. The default maximum is 50. Results are returned in pagefuls. If MediaTailor has more configurations than the specified maximum, it provides parameters in the response that you can use to retrieve the next pageful.  
   */
  listPlaybackConfigurations(params: MediaTailor.Types.ListPlaybackConfigurationsRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListPlaybackConfigurationsResponse) => void): Request<MediaTailor.Types.ListPlaybackConfigurationsResponse, AWSError>;
  /**
   * Returns a list of the playback configurations defined in AWS Elemental MediaTailor. You can specify a maximum number of configurations to return at a time. The default maximum is 50. Results are returned in pagefuls. If MediaTailor has more configurations than the specified maximum, it provides parameters in the response that you can use to retrieve the next pageful.  
   */
  listPlaybackConfigurations(callback?: (err: AWSError, data: MediaTailor.Types.ListPlaybackConfigurationsResponse) => void): Request<MediaTailor.Types.ListPlaybackConfigurationsResponse, AWSError>;
  /**
   * Creates a new prefetch schedule.
   */
  listPrefetchSchedules(params: MediaTailor.Types.ListPrefetchSchedulesRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListPrefetchSchedulesResponse) => void): Request<MediaTailor.Types.ListPrefetchSchedulesResponse, AWSError>;
  /**
   * Creates a new prefetch schedule.
   */
  listPrefetchSchedules(callback?: (err: AWSError, data: MediaTailor.Types.ListPrefetchSchedulesResponse) => void): Request<MediaTailor.Types.ListPrefetchSchedulesResponse, AWSError>;
  /**
   * Retrieves a list of source locations.
   */
  listSourceLocations(params: MediaTailor.Types.ListSourceLocationsRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListSourceLocationsResponse) => void): Request<MediaTailor.Types.ListSourceLocationsResponse, AWSError>;
  /**
   * Retrieves a list of source locations.
   */
  listSourceLocations(callback?: (err: AWSError, data: MediaTailor.Types.ListSourceLocationsResponse) => void): Request<MediaTailor.Types.ListSourceLocationsResponse, AWSError>;
  /**
   * Returns a list of the tags assigned to the specified playback configuration resource.  
   */
  listTagsForResource(params: MediaTailor.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListTagsForResourceResponse) => void): Request<MediaTailor.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of the tags assigned to the specified playback configuration resource.  
   */
  listTagsForResource(callback?: (err: AWSError, data: MediaTailor.Types.ListTagsForResourceResponse) => void): Request<MediaTailor.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all the VOD sources in a source location.
   */
  listVodSources(params: MediaTailor.Types.ListVodSourcesRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListVodSourcesResponse) => void): Request<MediaTailor.Types.ListVodSourcesResponse, AWSError>;
  /**
   * Lists all the VOD sources in a source location.
   */
  listVodSources(callback?: (err: AWSError, data: MediaTailor.Types.ListVodSourcesResponse) => void): Request<MediaTailor.Types.ListVodSourcesResponse, AWSError>;
  /**
   * Creates an IAM policy for the channel.
   */
  putChannelPolicy(params: MediaTailor.Types.PutChannelPolicyRequest, callback?: (err: AWSError, data: MediaTailor.Types.PutChannelPolicyResponse) => void): Request<MediaTailor.Types.PutChannelPolicyResponse, AWSError>;
  /**
   * Creates an IAM policy for the channel.
   */
  putChannelPolicy(callback?: (err: AWSError, data: MediaTailor.Types.PutChannelPolicyResponse) => void): Request<MediaTailor.Types.PutChannelPolicyResponse, AWSError>;
  /**
   * Adds a new playback configuration to AWS Elemental MediaTailor.  
   */
  putPlaybackConfiguration(params: MediaTailor.Types.PutPlaybackConfigurationRequest, callback?: (err: AWSError, data: MediaTailor.Types.PutPlaybackConfigurationResponse) => void): Request<MediaTailor.Types.PutPlaybackConfigurationResponse, AWSError>;
  /**
   * Adds a new playback configuration to AWS Elemental MediaTailor.  
   */
  putPlaybackConfiguration(callback?: (err: AWSError, data: MediaTailor.Types.PutPlaybackConfigurationResponse) => void): Request<MediaTailor.Types.PutPlaybackConfigurationResponse, AWSError>;
  /**
   * Starts a specific channel.
   */
  startChannel(params: MediaTailor.Types.StartChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.StartChannelResponse) => void): Request<MediaTailor.Types.StartChannelResponse, AWSError>;
  /**
   * Starts a specific channel.
   */
  startChannel(callback?: (err: AWSError, data: MediaTailor.Types.StartChannelResponse) => void): Request<MediaTailor.Types.StartChannelResponse, AWSError>;
  /**
   * Stops a specific channel.
   */
  stopChannel(params: MediaTailor.Types.StopChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.StopChannelResponse) => void): Request<MediaTailor.Types.StopChannelResponse, AWSError>;
  /**
   * Stops a specific channel.
   */
  stopChannel(callback?: (err: AWSError, data: MediaTailor.Types.StopChannelResponse) => void): Request<MediaTailor.Types.StopChannelResponse, AWSError>;
  /**
   * Adds tags to the specified playback configuration resource. You can specify one or more tags to add.  
   */
  tagResource(params: MediaTailor.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds tags to the specified playback configuration resource. You can specify one or more tags to add.  
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes tags from the specified playback configuration resource. You can specify one or more tags to remove.  
   */
  untagResource(params: MediaTailor.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes tags from the specified playback configuration resource. You can specify one or more tags to remove.  
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an existing channel.
   */
  updateChannel(params: MediaTailor.Types.UpdateChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.UpdateChannelResponse) => void): Request<MediaTailor.Types.UpdateChannelResponse, AWSError>;
  /**
   * Updates an existing channel.
   */
  updateChannel(callback?: (err: AWSError, data: MediaTailor.Types.UpdateChannelResponse) => void): Request<MediaTailor.Types.UpdateChannelResponse, AWSError>;
  /**
   * Updates a source location on a specific channel.
   */
  updateSourceLocation(params: MediaTailor.Types.UpdateSourceLocationRequest, callback?: (err: AWSError, data: MediaTailor.Types.UpdateSourceLocationResponse) => void): Request<MediaTailor.Types.UpdateSourceLocationResponse, AWSError>;
  /**
   * Updates a source location on a specific channel.
   */
  updateSourceLocation(callback?: (err: AWSError, data: MediaTailor.Types.UpdateSourceLocationResponse) => void): Request<MediaTailor.Types.UpdateSourceLocationResponse, AWSError>;
  /**
   * Updates a specific VOD source in a specific source location.
   */
  updateVodSource(params: MediaTailor.Types.UpdateVodSourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.UpdateVodSourceResponse) => void): Request<MediaTailor.Types.UpdateVodSourceResponse, AWSError>;
  /**
   * Updates a specific VOD source in a specific source location.
   */
  updateVodSource(callback?: (err: AWSError, data: MediaTailor.Types.UpdateVodSourceResponse) => void): Request<MediaTailor.Types.UpdateVodSourceResponse, AWSError>;
}
declare namespace MediaTailor {
  export interface AccessConfiguration {
    /**
     * The type of authentication used to access content from HttpConfiguration::BaseUrl on your source location. Accepted value: S3_SIGV4. S3_SIGV4 - AWS Signature Version 4 authentication for Amazon S3 hosted virtual-style access. If your source location base URL is an Amazon S3 bucket, MediaTailor can use AWS Signature Version 4 (SigV4) authentication to access the bucket where your source content is stored. Your MediaTailor source location baseURL must follow the S3 virtual hosted-style request URL format. For example, https://bucket-name.s3.Region.amazonaws.com/key-name. Before you can use S3_SIGV4, you must meet these requirements: • You must allow MediaTailor to access your S3 bucket by granting mediatailor.amazonaws.com principal access in IAM. For information about configuring access in IAM, see Access management in the IAM User Guide. • The mediatailor.amazonaws.com service principal must have permissions to read all top level manifests referenced by the VodSource packaging configurations. • The caller of the API must have s3:GetObject IAM permissions to read all top level manifests referenced by your MediaTailor VodSource packaging configurations.
     */
    AccessType?: AccessType;
    /**
     * AWS Secrets Manager access token configuration parameters.
     */
    SecretsManagerAccessTokenConfiguration?: SecretsManagerAccessTokenConfiguration;
  }
  export type AccessType = "S3_SIGV4"|"SECRETS_MANAGER_ACCESS_TOKEN"|string;
  export interface AdBreak {
    /**
     * The SCTE-35 ad insertion type. Accepted value: SPLICE_INSERT.
     */
    MessageType?: MessageType;
    /**
     * How long (in milliseconds) after the beginning of the program that an ad starts. This value must fall within 100ms of a segment boundary, otherwise the ad break will be skipped.
     */
    OffsetMillis?: __long;
    /**
     * Ad break slate configuration.
     */
    Slate?: SlateSource;
    /**
     * This defines the SCTE-35 splice_insert() message inserted around the ad. For information about using splice_insert(), see the SCTE-35 specficiaiton, section 9.7.3.1.
     */
    SpliceInsertMessage?: SpliceInsertMessage;
  }
  export interface AdMarkerPassthrough {
    /**
     * Enables ad marker passthrough for your configuration.
     */
    Enabled?: __boolean;
  }
  export interface Alert {
    /**
     * The code for the alert. For example, NOT_PROCESSED.
     */
    AlertCode: __string;
    /**
     * If an alert is generated for a resource, an explanation of the reason for the alert.
     */
    AlertMessage: __string;
    /**
     * The timestamp when the alert was last modified.
     */
    LastModifiedTime: __timestampUnix;
    /**
     * The Amazon Resource Names (ARNs) related to this alert.
     */
    RelatedResourceArns: __listOf__string;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: __string;
  }
  export interface AvailMatchingCriteria {
    /**
     * The dynamic variable(s) that MediaTailor should use as avail matching criteria. MediaTailor only places the prefetched ads into the avail if the avail matches the criteria defined by the dynamic variable. For information about dynamic variables, see Using dynamic ad variables in the MediaTailor User Guide. You can include up to 100 dynamic variables.
     */
    DynamicVariable: __string;
    /**
     * For the DynamicVariable specified in AvailMatchingCriteria, the Operator that is used for the comparison.
     */
    Operator: Operator;
  }
  export interface AvailSuppression {
    /**
     * Sets the ad suppression mode. By default, ad suppression is off and all ad breaks are filled with ads or slate. When Mode is set to BEHIND_LIVE_EDGE, ad suppression is active and MediaTailor won't fill ad breaks on or behind the ad suppression Value time in the manifest lookback window.
     */
    Mode?: Mode;
    /**
     * A live edge offset time in HH:MM:SS. MediaTailor won't fill ad breaks on or behind this time in the manifest lookback window. If Value is set to 00:00:00, it is in sync with the live edge, and MediaTailor won't fill any ad breaks on or behind the live edge. If you set a Value time, MediaTailor won't fill any ad breaks on or behind this time in the manifest lookback window. For example, if you set 00:45:00, then MediaTailor will fill ad breaks that occur within 45 minutes behind the live edge, but won't fill ad breaks on or behind 45 minutes behind the live edge.
     */
    Value?: __string;
  }
  export interface Bumper {
    /**
     * The URL for the end bumper asset.
     */
    EndUrl?: __string;
    /**
     * The URL for the start bumper asset.
     */
    StartUrl?: __string;
  }
  export interface CdnConfiguration {
    /**
     * A non-default content delivery network (CDN) to serve ad segments. By default, AWS Elemental MediaTailor uses Amazon CloudFront with default cache settings as its CDN for ad segments. To set up an alternate CDN, create a rule in your CDN for the origin ads.mediatailor.&amp;lt;region&gt;.amazonaws.com. Then specify the rule's name in this AdSegmentUrlPrefix. When AWS Elemental MediaTailor serves a manifest, it reports your CDN as the source for ad segments.
     */
    AdSegmentUrlPrefix?: __string;
    /**
     * A content delivery network (CDN) to cache content segments, so that content requests don’t always have to go to the origin server. First, create a rule in your CDN for the content segment origin server. Then specify the rule's name in this ContentSegmentUrlPrefix. When AWS Elemental MediaTailor serves a manifest, it reports your CDN as the source for content segments.
     */
    ContentSegmentUrlPrefix?: __string;
  }
  export interface Channel {
    /**
     * The ARN of the channel.
     */
    Arn: __string;
    /**
     * The name of the channel.
     */
    ChannelName: __string;
    /**
     * Returns the state whether the channel is running or not.
     */
    ChannelState: __string;
    /**
     * The timestamp of when the channel was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * Contains information about the slate used to fill gaps between programs in the schedule. You must configure FillerSlate if your channel uses an LINEAR PlaybackMode.
     */
    FillerSlate?: SlateSource;
    /**
     * The timestamp of when the channel was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The channel's output properties.
     */
    Outputs: ResponseOutputs;
    /**
     * The type of playback mode for this channel. LINEAR - Programs play back-to-back only once. LOOP - Programs play back-to-back in an endless loop. When the last program in the schedule plays, playback loops back to the first program in the schedule.
     */
    PlaybackMode: __string;
    /**
     * The tags to assign to the channel.
     */
    Tags?: __mapOf__string;
  }
  export type ChannelState = "RUNNING"|"STOPPED"|string;
  export type ConfigurationAliasesRequest = {[key: string]: __mapOf__string};
  export type ConfigurationAliasesResponse = {[key: string]: __mapOf__string};
  export interface ConfigureLogsForPlaybackConfigurationRequest {
    /**
     * The percentage of session logs that MediaTailor sends to your Cloudwatch Logs account. For example, if your playback configuration has 1000 sessions and percentEnabled is set to 60, MediaTailor sends logs for 600 of the sessions to CloudWatch Logs. MediaTailor decides at random which of the playback configuration sessions to send logs for. If you want to view logs for a specific session, you can use the debug log mode. Valid values: 0 - 100
     */
    PercentEnabled: __integer;
    /**
     * The name of the playback configuration.
     */
    PlaybackConfigurationName: __string;
  }
  export interface ConfigureLogsForPlaybackConfigurationResponse {
    /**
     * The percentage of session logs that MediaTailor sends to your Cloudwatch Logs account.
     */
    PercentEnabled?: __integer;
    /**
     * The name of the playback configuration.
     */
    PlaybackConfigurationName?: __string;
  }
  export interface CreateChannelRequest {
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
    /**
     * The slate used to fill gaps between programs in the schedule. You must configure filler slate if your channel uses a LINEAR PlaybackMode.
     */
    FillerSlate?: SlateSource;
    /**
     * The channel's output properties.
     */
    Outputs: RequestOutputs;
    /**
     * The type of playback mode to use for this channel. LINEAR - The programs in the schedule play once back-to-back in the schedule. LOOP - The programs in the schedule play back-to-back in an endless loop. When the last program in the schedule stops playing, playback loops back to the first program in the schedule.
     */
    PlaybackMode: PlaybackMode;
    /**
     * The tags to assign to the channel.
     */
    Tags?: __mapOf__string;
  }
  export interface CreateChannelResponse {
    /**
     * The ARN of the channel.
     */
    Arn?: __string;
    /**
     * The name of the channel.
     */
    ChannelName?: __string;
    /**
     * Indicates whether the channel is in a running state or not.
     */
    ChannelState?: ChannelState;
    /**
     * The timestamp of when the channel was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * Contains information about the slate used to fill gaps between programs in the schedule.
     */
    FillerSlate?: SlateSource;
    /**
     * The timestamp of when the channel was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The channel's output properties.
     */
    Outputs?: ResponseOutputs;
    /**
     * The channel's playback mode.
     */
    PlaybackMode?: __string;
    /**
     * The tags assigned to the channel.
     */
    Tags?: __mapOf__string;
  }
  export interface CreatePrefetchScheduleRequest {
    /**
     * The configuration settings for MediaTailor's consumption of the prefetched ads from the ad decision server. Each consumption configuration contains an end time and an optional start time that define the consumption window. Prefetch schedules automatically expire no earlier than seven days after the end time.
     */
    Consumption: PrefetchConsumption;
    /**
     * The identifier for the playback configuration.
     */
    Name: __string;
    /**
     * The name of the playback configuration.
     */
    PlaybackConfigurationName: __string;
    /**
     * The configuration settings for retrieval of prefetched ads from the ad decision server. Only one set of prefetched ads will be retrieved and subsequently consumed for each ad break.
     */
    Retrieval: PrefetchRetrieval;
    /**
     * An optional stream identifier that MediaTailor uses to prefetch ads for multiple streams that use the same playback configuration. If StreamId is specified, MediaTailor returns all of the prefetch schedules with an exact match on StreamId. If not specified, MediaTailor returns all of the prefetch schedules for the playback configuration, regardless of StreamId.
     */
    StreamId?: __string;
  }
  export interface CreatePrefetchScheduleResponse {
    /**
     * The Amazon Resource Name (ARN) of the prefetch schedule.
     */
    Arn?: __string;
    /**
     * Consumption settings determine how, and when, MediaTailor places the prefetched ads into ad breaks. Ad consumption occurs within a span of time that you define, called a consumption window. You can designate which ad breaks that MediaTailor fills with prefetch ads by setting avail matching criteria.
     */
    Consumption?: PrefetchConsumption;
    /**
     * The name of the prefetch schedule. The name must be unique among all prefetch schedules that are associated with the specified playback configuration.
     */
    Name?: __string;
    /**
     * The name of the playback configuration to create the prefetch schedule for.
     */
    PlaybackConfigurationName?: __string;
    /**
     * A complex type that contains settings for prefetch retrieval from the ad decision server (ADS).
     */
    Retrieval?: PrefetchRetrieval;
    /**
     * An optional stream identifier that you can specify in order to prefetch for multiple streams that use the same playback configuration.
     */
    StreamId?: __string;
  }
  export interface CreateProgramRequest {
    /**
     * The ad break configuration settings.
     */
    AdBreaks?: __listOfAdBreak;
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
    /**
     * The identifier for the program you are working on.
     */
    ProgramName: __string;
    /**
     * The schedule configuration settings.
     */
    ScheduleConfiguration: ScheduleConfiguration;
    /**
     * The name of the source location.
     */
    SourceLocationName: __string;
    /**
     * The name that's used to refer to a VOD source.
     */
    VodSourceName: __string;
  }
  export interface CreateProgramResponse {
    /**
     * The ad break configuration settings.
     */
    AdBreaks?: __listOfAdBreak;
    /**
     * The ARN of the program.
     */
    Arn?: __string;
    /**
     * The name of the channel that the program belongs to.
     */
    ChannelName?: __string;
    /**
     * The timestamp of when the program was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The name of the program.
     */
    ProgramName?: __string;
    /**
     * The date and time that the program is scheduled to start in ISO 8601 format and Coordinated Universal Time (UTC). For example, the value 2021-03-27T17:48:16.751Z represents March 27, 2021 at 17:48:16.751 UTC.
     */
    ScheduledStartTime?: __timestampUnix;
    /**
     * The source location name.
     */
    SourceLocationName?: __string;
    /**
     * The name that's used to refer to a VOD source.
     */
    VodSourceName?: __string;
  }
  export interface CreateSourceLocationRequest {
    /**
     * Access configuration parameters. Configures the type of authentication used to access content from your source location.
     */
    AccessConfiguration?: AccessConfiguration;
    /**
     * The optional configuration for the server that serves segments.
     */
    DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
    /**
     * The source's HTTP package configurations.
     */
    HttpConfiguration: HttpConfiguration;
    /**
     * The identifier for the source location you are working on.
     */
    SourceLocationName: __string;
    /**
     * The tags to assign to the source location.
     */
    Tags?: __mapOf__string;
  }
  export interface CreateSourceLocationResponse {
    /**
     * The access configuration for the source location.
     */
    AccessConfiguration?: AccessConfiguration;
    /**
     * The ARN of the source location.
     */
    Arn?: __string;
    /**
     * The timestamp that indicates when the source location was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The default segment delivery configuration settings.
     */
    DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
    /**
     * The HTTP package configuration settings for the source location.
     */
    HttpConfiguration?: HttpConfiguration;
    /**
     * The timestamp that indicates when the source location was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name of the source location.
     */
    SourceLocationName?: __string;
    /**
     * The tags assigned to the source location.
     */
    Tags?: __mapOf__string;
  }
  export interface CreateVodSourceRequest {
    /**
     * An array of HTTP package configuration parameters for this VOD source.
     */
    HttpPackageConfigurations: HttpPackageConfigurations;
    /**
     * The identifier for the source location you are working on.
     */
    SourceLocationName: __string;
    /**
     * The tags to assign to the VOD source.
     */
    Tags?: __mapOf__string;
    /**
     * The identifier for the VOD source you are working on.
     */
    VodSourceName: __string;
  }
  export interface CreateVodSourceResponse {
    /**
     * The ARN of the VOD source.
     */
    Arn?: __string;
    /**
     * The timestamp that indicates when the VOD source was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The HTTP package configurations.
     */
    HttpPackageConfigurations?: HttpPackageConfigurations;
    /**
     * The ARN for the VOD source.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name of the source location associated with the VOD source.
     */
    SourceLocationName?: __string;
    /**
     * The tags assigned to the VOD source.
     */
    Tags?: __mapOf__string;
    /**
     * The name of the VOD source.
     */
    VodSourceName?: __string;
  }
  export interface DashConfiguration {
    /**
     * The URL generated by MediaTailor to initiate a playback session. The session uses server-side reporting. This setting is ignored in PUT operations.
     */
    ManifestEndpointPrefix?: __string;
    /**
     * The setting that controls whether MediaTailor includes the Location tag in DASH manifests. MediaTailor populates the Location tag with the URL for manifest update requests, to be used by players that don't support sticky redirects. Disable this if you have CDN routing rules set up for accessing MediaTailor manifests, and you are either using client-side reporting or your players support sticky HTTP redirects. Valid values are DISABLED and EMT_DEFAULT. The EMT_DEFAULT setting enables the inclusion of the tag and is the default value.
     */
    MpdLocation?: __string;
    /**
     * The setting that controls whether MediaTailor handles manifests from the origin server as multi-period manifests or single-period manifests. If your origin server produces single-period manifests, set this to SINGLE_PERIOD. The default setting is MULTI_PERIOD. For multi-period manifests, omit this setting or set it to MULTI_PERIOD.
     */
    OriginManifestType?: OriginManifestType;
  }
  export interface DashConfigurationForPut {
    /**
     * The setting that controls whether MediaTailor includes the Location tag in DASH manifests. MediaTailor populates the Location tag with the URL for manifest update requests, to be used by players that don't support sticky redirects. Disable this if you have CDN routing rules set up for accessing MediaTailor manifests, and you are either using client-side reporting or your players support sticky HTTP redirects. Valid values are DISABLED and EMT_DEFAULT. The EMT_DEFAULT setting enables the inclusion of the tag and is the default value.
     */
    MpdLocation?: __string;
    /**
     * The setting that controls whether MediaTailor handles manifests from the origin server as multi-period manifests or single-period manifests. If your origin server produces single-period manifests, set this to SINGLE_PERIOD. The default setting is MULTI_PERIOD. For multi-period manifests, omit this setting or set it to MULTI_PERIOD.
     */
    OriginManifestType?: OriginManifestType;
  }
  export interface DashPlaylistSettings {
    /**
     * The total duration (in seconds) of each manifest. Minimum value: 30 seconds. Maximum value: 3600 seconds.
     */
    ManifestWindowSeconds?: __integer;
    /**
     * Minimum amount of content (measured in seconds) that a player must keep available in the buffer. Minimum value: 2 seconds. Maximum value: 60 seconds.
     */
    MinBufferTimeSeconds?: __integer;
    /**
     * Minimum amount of time (in seconds) that the player should wait before requesting updates to the manifest. Minimum value: 2 seconds. Maximum value: 60 seconds.
     */
    MinUpdatePeriodSeconds?: __integer;
    /**
     * Amount of time (in seconds) that the player should be from the live point at the end of the manifest. Minimum value: 2 seconds. Maximum value: 60 seconds.
     */
    SuggestedPresentationDelaySeconds?: __integer;
  }
  export interface DefaultSegmentDeliveryConfiguration {
    /**
     * The hostname of the server that will be used to serve segments. This string must include the protocol, such as https://.
     */
    BaseUrl?: __string;
  }
  export interface DeleteChannelPolicyRequest {
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
  }
  export interface DeleteChannelPolicyResponse {
  }
  export interface DeleteChannelRequest {
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
  }
  export interface DeleteChannelResponse {
  }
  export interface DeletePlaybackConfigurationRequest {
    /**
     * The identifier for the playback configuration.
     */
    Name: __string;
  }
  export interface DeletePlaybackConfigurationResponse {
  }
  export interface DeletePrefetchScheduleRequest {
    /**
     * The identifier for the playback configuration.
     */
    Name: __string;
    /**
     * The name of the playback configuration.
     */
    PlaybackConfigurationName: __string;
  }
  export interface DeletePrefetchScheduleResponse {
  }
  export interface DeleteProgramRequest {
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
    /**
     * The identifier for the program you are working on.
     */
    ProgramName: __string;
  }
  export interface DeleteProgramResponse {
  }
  export interface DeleteSourceLocationRequest {
    /**
     * The identifier for the source location you are working on.
     */
    SourceLocationName: __string;
  }
  export interface DeleteSourceLocationResponse {
  }
  export interface DeleteVodSourceRequest {
    /**
     * The identifier for the source location you are working on.
     */
    SourceLocationName: __string;
    /**
     * The identifier for the VOD source you are working on.
     */
    VodSourceName: __string;
  }
  export interface DeleteVodSourceResponse {
  }
  export interface DescribeChannelRequest {
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
  }
  export interface DescribeChannelResponse {
    /**
     * The ARN of the channel.
     */
    Arn?: __string;
    /**
     * The name of the channel.
     */
    ChannelName?: __string;
    /**
     * Indicates whether the channel is in a running state or not.
     */
    ChannelState?: ChannelState;
    /**
     * The timestamp of when the channel was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * Contains information about the slate used to fill gaps between programs in the schedule.
     */
    FillerSlate?: SlateSource;
    /**
     * The timestamp of when the channel was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The channel's output properties.
     */
    Outputs?: ResponseOutputs;
    /**
     * The channel's playback mode.
     */
    PlaybackMode?: __string;
    /**
     * The tags assigned to the channel.
     */
    Tags?: __mapOf__string;
  }
  export interface DescribeProgramRequest {
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
    /**
     * The identifier for the program you are working on.
     */
    ProgramName: __string;
  }
  export interface DescribeProgramResponse {
    /**
     * The ad break configuration settings.
     */
    AdBreaks?: __listOfAdBreak;
    /**
     * The ARN of the program.
     */
    Arn?: __string;
    /**
     * The name of the channel that the program belongs to.
     */
    ChannelName?: __string;
    /**
     * The timestamp of when the program was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The name of the program.
     */
    ProgramName?: __string;
    /**
     * The date and time that the program is scheduled to start in ISO 8601 format and Coordinated Universal Time (UTC). For example, the value 2021-03-27T17:48:16.751Z represents March 27, 2021 at 17:48:16.751 UTC.
     */
    ScheduledStartTime?: __timestampUnix;
    /**
     * The source location name.
     */
    SourceLocationName?: __string;
    /**
     * The name that's used to refer to a VOD source.
     */
    VodSourceName?: __string;
  }
  export interface DescribeSourceLocationRequest {
    /**
     * The identifier for the source location you are working on.
     */
    SourceLocationName: __string;
  }
  export interface DescribeSourceLocationResponse {
    /**
     * The access configuration for the source location.
     */
    AccessConfiguration?: AccessConfiguration;
    /**
     * The ARN of the source location.
     */
    Arn?: __string;
    /**
     * The timestamp that indicates when the source location was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The default segment delivery configuration settings.
     */
    DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
    /**
     * The HTTP package configuration settings for the source location.
     */
    HttpConfiguration?: HttpConfiguration;
    /**
     * The timestamp that indicates when the source location was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name of the source location.
     */
    SourceLocationName?: __string;
    /**
     * The tags assigned to the source location.
     */
    Tags?: __mapOf__string;
  }
  export interface DescribeVodSourceRequest {
    /**
     * The identifier for the source location you are working on.
     */
    SourceLocationName: __string;
    /**
     * The identifier for the VOD source you are working on.
     */
    VodSourceName: __string;
  }
  export interface DescribeVodSourceResponse {
    /**
     * The ARN of the VOD source.
     */
    Arn?: __string;
    /**
     * The timestamp that indicates when the VOD source was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The HTTP package configurations.
     */
    HttpPackageConfigurations?: HttpPackageConfigurations;
    /**
     * The ARN for the VOD source.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name of the source location associated with the VOD source.
     */
    SourceLocationName?: __string;
    /**
     * The tags assigned to the VOD source.
     */
    Tags?: __mapOf__string;
    /**
     * The name of the VOD source.
     */
    VodSourceName?: __string;
  }
  export interface GetChannelPolicyRequest {
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
  }
  export interface GetChannelPolicyResponse {
    /**
     * The IAM policy for the channel.
     */
    Policy?: __string;
  }
  export interface GetChannelScheduleRequest {
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
    /**
     * The schedule duration in minutes. The maximum duration is 4320 minutes (three days).
     */
    DurationMinutes?: __string;
    /**
     * Upper bound on number of records to return. The maximum number of results is 100.
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token from the GET list request. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface GetChannelScheduleResponse {
    /**
     * An array of schedule entries for the channel.
     */
    Items?: __listOfScheduleEntry;
    /**
     * Pagination token from the GET list request. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface GetPlaybackConfigurationRequest {
    /**
     * The identifier for the playback configuration.
     */
    Name: __string;
  }
  export interface GetPlaybackConfigurationResponse {
    /**
     * The URL for the ad decision server (ADS). This includes the specification of static parameters and placeholders for dynamic parameters. AWS Elemental MediaTailor substitutes player-specific and session-specific parameters as needed when calling the ADS. Alternately, for testing, you can provide a static VAST URL. The maximum length is 25,000 characters.
     */
    AdDecisionServerUrl?: __string;
    /**
     * The configuration for avail suppression, also known as ad suppression. For more information about ad suppression, see Ad Suppression.
     */
    AvailSuppression?: AvailSuppression;
    /**
     * The configuration for bumpers. Bumpers are short audio or video clips that play at the start or before the end of an ad break. To learn more about bumpers, see Bumpers.
     */
    Bumper?: Bumper;
    /**
     * The configuration for using a content delivery network (CDN), like Amazon CloudFront, for content and ad segment management.
     */
    CdnConfiguration?: CdnConfiguration;
    /**
     * The player parameters and aliases used as dynamic variables during session initialization. For more information, see Domain Variables.
     */
    ConfigurationAliases?: ConfigurationAliasesResponse;
    /**
     * The configuration for DASH content.
     */
    DashConfiguration?: DashConfiguration;
    /**
     * The configuration for HLS content.
     */
    HlsConfiguration?: HlsConfiguration;
    /**
     * The configuration for pre-roll ad insertion.
     */
    LivePreRollConfiguration?: LivePreRollConfiguration;
    /**
     * The Amazon CloudWatch log settings for a playback configuration.
     */
    LogConfiguration?: LogConfiguration;
    /**
     * The configuration for manifest processing rules. Manifest processing rules enable customization of the personalized manifests created by MediaTailor.
     */
    ManifestProcessingRules?: ManifestProcessingRules;
    /**
     * The identifier for the playback configuration.
     */
    Name?: __string;
    /**
     * Defines the maximum duration of underfilled ad time (in seconds) allowed in an ad break. If the duration of underfilled ad time exceeds the personalization threshold, then the personalization of the ad break is abandoned and the underlying content is shown. This feature applies to ad replacement in live and VOD streams, rather than ad insertion, because it relies on an underlying content stream. For more information about ad break behavior, including ad replacement and insertion, see Ad Behavior in AWS Elemental MediaTailor.
     */
    PersonalizationThresholdSeconds?: __integerMin1;
    /**
     * The Amazon Resource Name (ARN) for the playback configuration.
     */
    PlaybackConfigurationArn?: __string;
    /**
     * The URL that the player accesses to get a manifest from AWS Elemental MediaTailor. This session will use server-side reporting.
     */
    PlaybackEndpointPrefix?: __string;
    /**
     * The URL that the player uses to initialize a session that uses client-side reporting.
     */
    SessionInitializationEndpointPrefix?: __string;
    /**
     * The URL for a high-quality video asset to transcode and use to fill in time that's not used by ads. AWS Elemental MediaTailor shows the slate to fill in gaps in media content. Configuring the slate is optional for non-VPAID playback configurations. For VPAID, the slate is required because MediaTailor provides it in the slots designated for dynamic ad content. The slate must be a high-quality asset that contains both audio and video.
     */
    SlateAdUrl?: __string;
    /**
     * The tags assigned to the playback configuration.
     */
    Tags?: __mapOf__string;
    /**
     * The name that is used to associate this playback configuration with a custom transcode profile. This overrides the dynamic transcoding defaults of MediaTailor. Use this only if you have already set up custom profiles with the help of AWS Support.
     */
    TranscodeProfileName?: __string;
    /**
     * The URL prefix for the parent manifest for the stream, minus the asset ID. The maximum length is 512 characters.
     */
    VideoContentSourceUrl?: __string;
  }
  export interface GetPrefetchScheduleRequest {
    /**
     * The identifier for the playback configuration.
     */
    Name: __string;
    /**
     * The name of the playback configuration.
     */
    PlaybackConfigurationName: __string;
  }
  export interface GetPrefetchScheduleResponse {
    /**
     * The Amazon Resource Name (ARN) of the prefetch schedule.
     */
    Arn?: __string;
    /**
     * Consumption settings determine how, and when, MediaTailor places the prefetched ads into ad breaks. Ad consumption occurs within a span of time that you define, called a consumption window. You can designate which ad breaks that MediaTailor fills with prefetch ads by setting avail matching criteria.
     */
    Consumption?: PrefetchConsumption;
    /**
     * The name of the prefetch schedule. The name must be unique among all prefetch schedules that are associated with the specified playback configuration.
     */
    Name?: __string;
    /**
     * The name of the playback configuration to create the prefetch schedule for.
     */
    PlaybackConfigurationName?: __string;
    /**
     * A complex type that contains settings for prefetch retrieval from the ad decision server (ADS).
     */
    Retrieval?: PrefetchRetrieval;
    /**
     * An optional stream identifier that you can specify in order to prefetch for multiple streams that use the same playback configuration.
     */
    StreamId?: __string;
  }
  export interface HlsConfiguration {
    /**
     * The URL that is used to initiate a playback session for devices that support Apple HLS. The session uses server-side reporting.
     */
    ManifestEndpointPrefix?: __string;
  }
  export interface HlsPlaylistSettings {
    /**
     * The total duration (in seconds) of each manifest. Minimum value: 30 seconds. Maximum value: 3600 seconds.
     */
    ManifestWindowSeconds?: __integer;
  }
  export interface HttpConfiguration {
    /**
     * The base URL for the source location host server. This string must include the protocol, such as https://.
     */
    BaseUrl: __string;
  }
  export interface HttpPackageConfiguration {
    /**
     * The relative path to the URL for this VOD source. This is combined with SourceLocation::HttpConfiguration::BaseUrl to form a valid URL.
     */
    Path: __string;
    /**
     * The name of the source group. This has to match one of the Channel::Outputs::SourceGroup.
     */
    SourceGroup: __string;
    /**
     * The streaming protocol for this package configuration. Supported values are HLS and DASH.
     */
    Type: Type;
  }
  export type HttpPackageConfigurations = HttpPackageConfiguration[];
  export interface ListAlertsRequest {
    /**
     * Upper bound on number of records to return. The maximum number of results is 100.
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token from the GET list request. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: __string;
  }
  export interface ListAlertsResponse {
    /**
     * An array of alerts that are associated with this resource.
     */
    Items?: __listOfAlert;
    /**
     * Pagination token from the list request. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListChannelsRequest {
    /**
     * Upper bound on number of records to return. The maximum number of results is 100.
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token from the GET list request. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListChannelsResponse {
    /**
     * An array of channels that are associated with this account.
     */
    Items?: __listOfChannel;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListPlaybackConfigurationsRequest {
    /**
     * Maximum number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token returned by the GET list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListPlaybackConfigurationsResponse {
    /**
     * Array of playback configurations. This might be all the available configurations or a subset, depending on the settings that you provide and the total number of configurations stored.
     */
    Items?: __listOfPlaybackConfiguration;
    /**
     * Pagination token returned by the GET list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListPrefetchSchedulesRequest {
    /**
     * The maximum number of prefetch schedules that you want MediaTailor to return in response to the current request. If the playback configuration has more than MaxResults prefetch schedules, use the value of NextToken in the response to get the next page of results.
     */
    MaxResults?: __integerMin1Max100;
    /**
     * (Optional) If the playback configuration has more than MaxResults prefetch schedules, use NextToken to get the second and subsequent pages of results. For the first ListPrefetchSchedulesRequest request, omit this value. For the second and subsequent requests, get the value of NextToken from the previous response and specify that value for NextToken in the request. If the previous response didn't include a NextToken element, there are no more prefetch schedules to get.
     */
    NextToken?: __string;
    /**
     * The name of the playback configuration.
     */
    PlaybackConfigurationName: __string;
    /**
     * An optional filtering parameter whereby MediaTailor filters the prefetch schedules to include only specific streams.
     */
    StreamId?: __string;
  }
  export interface ListPrefetchSchedulesResponse {
    /**
     * Lists the prefetch schedules. An empty Items list doesn't mean there aren't more items to fetch, just that that page was empty.
     */
    Items?: __listOfPrefetchSchedule;
    /**
     * The value that you will use forNextToken in the next ListPrefetchSchedulesRequest request.
     */
    NextToken?: __string;
  }
  export interface ListSourceLocationsRequest {
    /**
     * Upper bound on number of records to return. The maximum number of results is 100.
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token from the GET list request. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListSourceLocationsResponse {
    /**
     * An array of source locations.
     */
    Items?: __listOfSourceLocation;
    /**
     * Pagination token from the list request. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the playback configuration. You can get this from the response to any playback configuration request.
     */
    ResourceArn: __string;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A comma-separated list of tag key:value pairs.
     */
    Tags?: __mapOf__string;
  }
  export interface ListVodSourcesRequest {
    /**
     * Upper bound on number of records to return. The maximum number of results is 100.
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token from the GET list request. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
    /**
     * The identifier for the source location you are working on.
     */
    SourceLocationName: __string;
  }
  export interface ListVodSourcesResponse {
    /**
     * Lists the VOD sources.
     */
    Items?: __listOfVodSource;
    /**
     * Pagination token from the list request. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface LivePreRollConfiguration {
    /**
     * The URL for the ad decision server (ADS) for pre-roll ads. This includes the specification of static parameters and placeholders for dynamic parameters. AWS Elemental MediaTailor substitutes player-specific and session-specific parameters as needed when calling the ADS. Alternately, for testing, you can provide a static VAST URL. The maximum length is 25,000 characters.
     */
    AdDecisionServerUrl?: __string;
    /**
     * The maximum allowed duration for the pre-roll ad avail. AWS Elemental MediaTailor won't play pre-roll ads to exceed this duration, regardless of the total duration of ads that the ADS returns.
     */
    MaxDurationSeconds?: __integer;
  }
  export interface LogConfiguration {
    /**
     * The percentage of session logs that MediaTailor sends to your Cloudwatch Logs account. For example, if your playback configuration has 1000 sessions and percentEnabled is set to 60, MediaTailor sends logs for 600 of the sessions to CloudWatch Logs. MediaTailor decides at random which of the playback configuration sessions to send logs for. If you want to view logs for a specific session, you can use the debug log mode. Valid values: 0 - 100
     */
    PercentEnabled: __integer;
  }
  export interface ManifestProcessingRules {
    /**
     * For HLS, when set to true, MediaTailor passes through EXT-X-CUE-IN, EXT-X-CUE-OUT, and EXT-X-SPLICEPOINT-SCTE35 ad markers from the origin manifest to the MediaTailor personalized manifest. No logic is applied to these ad markers. For example, if EXT-X-CUE-OUT has a value of 60, but no ads are filled for that ad break, MediaTailor will not set the value to 0.
     */
    AdMarkerPassthrough?: AdMarkerPassthrough;
  }
  export type MaxResults = number;
  export type MessageType = "SPLICE_INSERT"|string;
  export type Mode = "OFF"|"BEHIND_LIVE_EDGE"|string;
  export type Operator = "EQUALS"|string;
  export type OriginManifestType = "SINGLE_PERIOD"|"MULTI_PERIOD"|string;
  export interface PlaybackConfiguration {
    /**
     * The URL for the ad decision server (ADS). This includes the specification of static parameters and placeholders for dynamic parameters. AWS Elemental MediaTailor substitutes player-specific and session-specific parameters as needed when calling the ADS. Alternately, for testing you can provide a static VAST URL. The maximum length is 25,000 characters.
     */
    AdDecisionServerUrl?: __string;
    /**
     * The configuration for avail suppression, also known as ad suppression. For more information about ad suppression, see Ad Suppression.
     */
    AvailSuppression?: AvailSuppression;
    /**
     * The configuration for bumpers. Bumpers are short audio or video clips that play at the start or before the end of an ad break. To learn more about bumpers, see Bumpers.
     */
    Bumper?: Bumper;
    /**
     * The configuration for using a content delivery network (CDN), like Amazon CloudFront, for content and ad segment management.
     */
    CdnConfiguration?: CdnConfiguration;
    /**
     * The player parameters and aliases used as dynamic variables during session initialization. For more information, see Domain Variables.
     */
    ConfigurationAliases?: ConfigurationAliasesResponse;
    /**
     * The configuration for a DASH source.
     */
    DashConfiguration?: DashConfiguration;
    /**
     * The configuration for HLS content.
     */
    HlsConfiguration?: HlsConfiguration;
    /**
     * The configuration for pre-roll ad insertion.
     */
    LivePreRollConfiguration?: LivePreRollConfiguration;
    /**
     * The Amazon CloudWatch log settings for a playback configuration.
     */
    LogConfiguration?: LogConfiguration;
    /**
     * The configuration for manifest processing rules. Manifest processing rules enable customization of the personalized manifests created by MediaTailor.
     */
    ManifestProcessingRules?: ManifestProcessingRules;
    /**
     * The identifier for the playback configuration.
     */
    Name?: __string;
    /**
     * Defines the maximum duration of underfilled ad time (in seconds) allowed in an ad break. If the duration of underfilled ad time exceeds the personalization threshold, then the personalization of the ad break is abandoned and the underlying content is shown. This feature applies to ad replacement in live and VOD streams, rather than ad insertion, because it relies on an underlying content stream. For more information about ad break behavior, including ad replacement and insertion, see Ad Behavior in AWS Elemental MediaTailor.
     */
    PersonalizationThresholdSeconds?: __integerMin1;
    /**
     * The Amazon Resource Name (ARN) for the playback configuration.
     */
    PlaybackConfigurationArn?: __string;
    /**
     * The URL that the player accesses to get a manifest from AWS Elemental MediaTailor.
     */
    PlaybackEndpointPrefix?: __string;
    /**
     * The URL that the player uses to initialize a session that uses client-side reporting.
     */
    SessionInitializationEndpointPrefix?: __string;
    /**
     * The URL for a video asset to transcode and use to fill in time that's not used by ads. AWS Elemental MediaTailor shows the slate to fill in gaps in media content. Configuring the slate is optional for non-VPAID playback configurations. For VPAID, the slate is required because MediaTailor provides it in the slots designated for dynamic ad content. The slate must be a high-quality asset that contains both audio and video.
     */
    SlateAdUrl?: __string;
    /**
     * The tags to assign to the playback configuration.
     */
    Tags?: __mapOf__string;
    /**
     * The name that is used to associate this playback configuration with a custom transcode profile. This overrides the dynamic transcoding defaults of MediaTailor. Use this only if you have already set up custom profiles with the help of AWS Support.
     */
    TranscodeProfileName?: __string;
    /**
     * The URL prefix for the parent manifest for the stream, minus the asset ID. The maximum length is 512 characters.
     */
    VideoContentSourceUrl?: __string;
  }
  export type PlaybackMode = "LOOP"|"LINEAR"|string;
  export interface PrefetchConsumption {
    /**
     * If you only want MediaTailor to insert prefetched ads into avails (ad breaks) that match specific dynamic variables, such as scte.event_id, set the avail matching criteria.
     */
    AvailMatchingCriteria?: __listOfAvailMatchingCriteria;
    /**
     * The time when MediaTailor no longer considers the prefetched ads for use in an ad break. MediaTailor automatically deletes prefetch schedules no less than seven days after the end time. If you'd like to manually delete the prefetch schedule, you can call DeletePrefetchSchedule.
     */
    EndTime: __timestampUnix;
    /**
     * The time when prefetched ads are considered for use in an ad break. If you don't specify StartTime, the prefetched ads are available after MediaTailor retrives them from the ad decision server.
     */
    StartTime?: __timestampUnix;
  }
  export interface PrefetchRetrieval {
    /**
     * The dynamic variables to use for substitution during prefetch requests to the ad decision server (ADS). You intially configure dynamic variables for the ADS URL when you set up your playback configuration. When you specify DynamicVariables for prefetch retrieval, MediaTailor includes the dynamic variables in the request to the ADS.
     */
    DynamicVariables?: __mapOf__string;
    /**
     * The time when prefetch retrieval ends for the ad break. Prefetching will be attempted for manifest requests that occur at or before this time.
     */
    EndTime: __timestampUnix;
    /**
     * The time when prefetch retrievals can start for this break. Ad prefetching will be attempted for manifest requests that occur at or after this time. Defaults to the current time. If not specified, the prefetch retrieval starts as soon as possible.
     */
    StartTime?: __timestampUnix;
  }
  export interface PrefetchSchedule {
    /**
     * The Amazon Resource Name (ARN) of the prefetch schedule.
     */
    Arn: __string;
    /**
     * Consumption settings determine how, and when, MediaTailor places the prefetched ads into ad breaks. Ad consumption occurs within a span of time that you define, called a consumption window. You can designate which ad breaks that MediaTailor fills with prefetch ads by setting avail matching criteria.
     */
    Consumption: PrefetchConsumption;
    /**
     * The name of the prefetch schedule. The name must be unique among all prefetch schedules that are associated with the specified playback configuration.
     */
    Name: __string;
    /**
     * The name of the playback configuration to create the prefetch schedule for.
     */
    PlaybackConfigurationName: __string;
    /**
     * A complex type that contains settings for prefetch retrieval from the ad decision server (ADS).
     */
    Retrieval: PrefetchRetrieval;
    /**
     * An optional stream identifier that you can specify in order to prefetch for multiple streams that use the same playback configuration.
     */
    StreamId?: __string;
  }
  export interface PutChannelPolicyRequest {
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
    /**
     * Adds an IAM role that determines the permissions of your channel.
     */
    Policy: __string;
  }
  export interface PutChannelPolicyResponse {
  }
  export interface PutPlaybackConfigurationRequest {
    /**
     * The URL for the ad decision server (ADS). This includes the specification of static parameters and placeholders for dynamic parameters. AWS Elemental MediaTailor substitutes player-specific and session-specific parameters as needed when calling the ADS. Alternately, for testing you can provide a static VAST URL. The maximum length is 25,000 characters.
     */
    AdDecisionServerUrl?: __string;
    /**
     * The configuration for avail suppression, also known as ad suppression. For more information about ad suppression, see Ad Suppression.
     */
    AvailSuppression?: AvailSuppression;
    /**
     * The configuration for bumpers. Bumpers are short audio or video clips that play at the start or before the end of an ad break. To learn more about bumpers, see Bumpers.
     */
    Bumper?: Bumper;
    /**
     * The configuration for using a content delivery network (CDN), like Amazon CloudFront, for content and ad segment management.
     */
    CdnConfiguration?: CdnConfiguration;
    /**
     * The player parameters and aliases used as dynamic variables during session initialization. For more information, see Domain Variables. 
     */
    ConfigurationAliases?: ConfigurationAliasesRequest;
    /**
     * The configuration for DASH content.
     */
    DashConfiguration?: DashConfigurationForPut;
    /**
     * The configuration for pre-roll ad insertion.
     */
    LivePreRollConfiguration?: LivePreRollConfiguration;
    /**
     * The configuration for manifest processing rules. Manifest processing rules enable customization of the personalized manifests created by MediaTailor.
     */
    ManifestProcessingRules?: ManifestProcessingRules;
    /**
     * The identifier for the playback configuration.
     */
    Name?: __string;
    /**
     * Defines the maximum duration of underfilled ad time (in seconds) allowed in an ad break. If the duration of underfilled ad time exceeds the personalization threshold, then the personalization of the ad break is abandoned and the underlying content is shown. This feature applies to ad replacement in live and VOD streams, rather than ad insertion, because it relies on an underlying content stream. For more information about ad break behavior, including ad replacement and insertion, see Ad Behavior in AWS Elemental MediaTailor.
     */
    PersonalizationThresholdSeconds?: __integerMin1;
    /**
     * The URL for a high-quality video asset to transcode and use to fill in time that's not used by ads. AWS Elemental MediaTailor shows the slate to fill in gaps in media content. Configuring the slate is optional for non-VPAID configurations. For VPAID, the slate is required because MediaTailor provides it in the slots that are designated for dynamic ad content. The slate must be a high-quality asset that contains both audio and video.
     */
    SlateAdUrl?: __string;
    /**
     * The tags to assign to the playback configuration.
     */
    Tags?: __mapOf__string;
    /**
     * The name that is used to associate this playback configuration with a custom transcode profile. This overrides the dynamic transcoding defaults of MediaTailor. Use this only if you have already set up custom profiles with the help of AWS Support.
     */
    TranscodeProfileName?: __string;
    /**
     * The URL prefix for the parent manifest for the stream, minus the asset ID. The maximum length is 512 characters.
     */
    VideoContentSourceUrl?: __string;
  }
  export interface PutPlaybackConfigurationResponse {
    /**
     * The URL for the ad decision server (ADS). This includes the specification of static parameters and placeholders for dynamic parameters. AWS Elemental MediaTailor substitutes player-specific and session-specific parameters as needed when calling the ADS. Alternately, for testing, you can provide a static VAST URL. The maximum length is 25,000 characters.
     */
    AdDecisionServerUrl?: __string;
    /**
     * The configuration for avail suppression, also known as ad suppression. For more information about ad suppression, see Ad Suppression.
     */
    AvailSuppression?: AvailSuppression;
    /**
     * The configuration for bumpers. Bumpers are short audio or video clips that play at the start or before the end of an ad break. To learn more about bumpers, see Bumpers.
     */
    Bumper?: Bumper;
    /**
     * The configuration for using a content delivery network (CDN), like Amazon CloudFront, for content and ad segment management.
     */
    CdnConfiguration?: CdnConfiguration;
    /**
     * The player parameters and aliases used as dynamic variables during session initialization. For more information, see Domain Variables.
     */
    ConfigurationAliases?: ConfigurationAliasesResponse;
    /**
     * The configuration for DASH content.
     */
    DashConfiguration?: DashConfiguration;
    /**
     * The configuration for HLS content.
     */
    HlsConfiguration?: HlsConfiguration;
    /**
     * The configuration for pre-roll ad insertion.
     */
    LivePreRollConfiguration?: LivePreRollConfiguration;
    /**
     * The Amazon CloudWatch log settings for a playback configuration.
     */
    LogConfiguration?: LogConfiguration;
    /**
     * The configuration for manifest processing rules. Manifest processing rules enable customization of the personalized manifests created by MediaTailor.
     */
    ManifestProcessingRules?: ManifestProcessingRules;
    /**
     * The identifier for the playback configuration.
     */
    Name?: __string;
    /**
     * Defines the maximum duration of underfilled ad time (in seconds) allowed in an ad break. If the duration of underfilled ad time exceeds the personalization threshold, then the personalization of the ad break is abandoned and the underlying content is shown. This feature applies to ad replacement in live and VOD streams, rather than ad insertion, because it relies on an underlying content stream. For more information about ad break behavior, including ad replacement and insertion, see Ad Behavior in AWS Elemental MediaTailor.
     */
    PersonalizationThresholdSeconds?: __integerMin1;
    /**
     * The Amazon Resource Name (ARN) for the playback configuration.
     */
    PlaybackConfigurationArn?: __string;
    /**
     * The URL that the player accesses to get a manifest from AWS Elemental MediaTailor. This session will use server-side reporting.
     */
    PlaybackEndpointPrefix?: __string;
    /**
     * The URL that the player uses to initialize a session that uses client-side reporting.
     */
    SessionInitializationEndpointPrefix?: __string;
    /**
     * The URL for a high-quality video asset to transcode and use to fill in time that's not used by ads. AWS Elemental MediaTailor shows the slate to fill in gaps in media content. Configuring the slate is optional for non-VPAID playback configurations. For VPAID, the slate is required because MediaTailor provides it in the slots designated for dynamic ad content. The slate must be a high-quality asset that contains both audio and video.
     */
    SlateAdUrl?: __string;
    /**
     * The tags assigned to the playback configuration.
     */
    Tags?: __mapOf__string;
    /**
     * The name that is used to associate this playback configuration with a custom transcode profile. This overrides the dynamic transcoding defaults of MediaTailor. Use this only if you have already set up custom profiles with the help of AWS Support.
     */
    TranscodeProfileName?: __string;
    /**
     * The URL prefix for the parent manifest for the stream, minus the asset ID. The maximum length is 512 characters.
     */
    VideoContentSourceUrl?: __string;
  }
  export type RelativePosition = "BEFORE_PROGRAM"|"AFTER_PROGRAM"|string;
  export interface RequestOutputItem {
    /**
     * DASH manifest configuration parameters.
     */
    DashPlaylistSettings?: DashPlaylistSettings;
    /**
     * HLS playlist configuration parameters.
     */
    HlsPlaylistSettings?: HlsPlaylistSettings;
    /**
     * The name of the manifest for the channel. The name appears in the PlaybackUrl.
     */
    ManifestName: __string;
    /**
     * A string used to match which HttpPackageConfiguration is used for each VodSource.
     */
    SourceGroup: __string;
  }
  export type RequestOutputs = RequestOutputItem[];
  export interface ResponseOutputItem {
    /**
     * DASH manifest configuration settings.
     */
    DashPlaylistSettings?: DashPlaylistSettings;
    /**
     * HLS manifest configuration settings.
     */
    HlsPlaylistSettings?: HlsPlaylistSettings;
    /**
     * The name of the manifest for the channel that will appear in the channel output's playback URL.
     */
    ManifestName: __string;
    /**
     * The URL used for playback by content players.
     */
    PlaybackUrl: __string;
    /**
     * A string used to associate a package configuration source group with a channel output.
     */
    SourceGroup: __string;
  }
  export type ResponseOutputs = ResponseOutputItem[];
  export interface ScheduleAdBreak {
    /**
     * The approximate duration of the ad break, in seconds.
     */
    ApproximateDurationSeconds?: __long;
    /**
     * The approximate time that the ad will start playing.
     */
    ApproximateStartTime?: __timestampUnix;
    /**
     * The name of the source location containing the VOD source used for the ad break.
     */
    SourceLocationName?: __string;
    /**
     * The name of the VOD source used for the ad break.
     */
    VodSourceName?: __string;
  }
  export interface ScheduleConfiguration {
    /**
     * Program transition configurations.
     */
    Transition: Transition;
  }
  export interface ScheduleEntry {
    /**
     * The approximate duration of this program, in seconds.
     */
    ApproximateDurationSeconds?: __long;
    /**
     * The approximate time that the program will start playing.
     */
    ApproximateStartTime?: __timestampUnix;
    /**
     * The ARN of the program.
     */
    Arn: __string;
    /**
     * The name of the channel that uses this schedule.
     */
    ChannelName: __string;
    /**
     * The name of the program.
     */
    ProgramName: __string;
    /**
     * The schedule's ad break properties.
     */
    ScheduleAdBreaks?: __listOfScheduleAdBreak;
    /**
     * The type of schedule entry. Valid values: PROGRAM or FILLER_SLATE.
     */
    ScheduleEntryType?: ScheduleEntryType;
    /**
     * The name of the source location.
     */
    SourceLocationName: __string;
    /**
     * The name of the VOD source.
     */
    VodSourceName: __string;
  }
  export type ScheduleEntryType = "PROGRAM"|"FILLER_SLATE"|string;
  export interface SecretsManagerAccessTokenConfiguration {
    /**
     * The name of the HTTP header used to supply the access token in requests to the source location.
     */
    HeaderName?: __string;
    /**
     * The Amazon Resource Name (ARN) of the AWS Secrets Manager secret that contains the access token.
     */
    SecretArn?: __string;
    /**
     * The AWS Secrets Manager SecretString key associated with the access token. MediaTailor uses the key to look up SecretString key and value pair containing the access token.
     */
    SecretStringKey?: __string;
  }
  export interface SlateSource {
    /**
     * The name of the source location where the slate VOD source is stored.
     */
    SourceLocationName?: __string;
    /**
     * The slate VOD source name. The VOD source must already exist in a source location before it can be used for slate.
     */
    VodSourceName?: __string;
  }
  export interface SourceLocation {
    /**
     * The access configuration for the source location.
     */
    AccessConfiguration?: AccessConfiguration;
    /**
     * The ARN of the SourceLocation.
     */
    Arn: __string;
    /**
     * The timestamp that indicates when the source location was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The default segment delivery configuration.
     */
    DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
    /**
     * The HTTP configuration for the source location.
     */
    HttpConfiguration: HttpConfiguration;
    /**
     * The timestamp that indicates when the source location was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name of the source location.
     */
    SourceLocationName: __string;
    /**
     * The tags assigned to the source location.
     */
    Tags?: __mapOf__string;
  }
  export interface SpliceInsertMessage {
    /**
     * This is written to splice_insert.avail_num, as defined in section 9.7.3.1 of the SCTE-35 specification. The default value is 0. Values must be between 0 and 256, inclusive.
     */
    AvailNum?: __integer;
    /**
     * This is written to splice_insert.avails_expected, as defined in section 9.7.3.1 of the SCTE-35 specification. The default value is 0. Values must be between 0 and 256, inclusive.
     */
    AvailsExpected?: __integer;
    /**
     * This is written to splice_insert.splice_event_id, as defined in section 9.7.3.1 of the SCTE-35 specification. The default value is 1.
     */
    SpliceEventId?: __integer;
    /**
     * This is written to splice_insert.unique_program_id, as defined in section 9.7.3.1 of the SCTE-35 specification. The default value is 0. Values must be between 0 and 256, inclusive.
     */
    UniqueProgramId?: __integer;
  }
  export interface StartChannelRequest {
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
  }
  export interface StartChannelResponse {
  }
  export interface StopChannelRequest {
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
  }
  export interface StopChannelResponse {
  }
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the playback configuration. You can get this from the response to any playback configuration request.
     */
    ResourceArn: __string;
    /**
     * A comma-separated list of tag key:value pairs.
     */
    Tags: __mapOf__string;
  }
  export interface Transition {
    /**
     * The position where this program will be inserted relative to the RelativePosition.
     */
    RelativePosition: RelativePosition;
    /**
     * The name of the program that this program will be inserted next to, as defined by RelativePosition.
     */
    RelativeProgram?: __string;
    /**
     * The date and time that the program is scheduled to start, in epoch milliseconds.
     */
    ScheduledStartTimeMillis?: __long;
    /**
     * Defines when the program plays in the schedule. You can set the value to ABSOLUTE or RELATIVE. ABSOLUTE - The program plays at a specific wall clock time. This setting can only be used for channels using the LINEAR PlaybackMode. Note the following considerations when using ABSOLUTE transitions: If the preceding program in the schedule has a duration that extends past the wall clock time, MediaTailor truncates the preceding program on a common segment boundary. If there are gaps in playback, MediaTailor plays the FillerSlate you configured for your linear channel. RELATIVE - The program is inserted into the schedule either before or after a program that you specify via RelativePosition.
     */
    Type: __string;
  }
  export type Type = "DASH"|"HLS"|string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the playback configuration. You can get this from the response to any playback configuration request.
     */
    ResourceArn: __string;
    /**
     * A comma-separated list of the tag keys to remove from the playback configuration.
     */
    TagKeys: __listOf__string;
  }
  export interface UpdateChannelRequest {
    /**
     * The identifier for the channel you are working on.
     */
    ChannelName: __string;
    /**
     * The channel's output properties.
     */
    Outputs: RequestOutputs;
  }
  export interface UpdateChannelResponse {
    /**
     * The ARN of the channel.
     */
    Arn?: __string;
    /**
     * The name of the channel.
     */
    ChannelName?: __string;
    /**
     * Indicates whether the channel is in a running state or not.
     */
    ChannelState?: ChannelState;
    /**
     * The timestamp of when the channel was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * Contains information about the slate used to fill gaps between programs in the schedule.
     */
    FillerSlate?: SlateSource;
    /**
     * The timestamp of when the channel was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The channel's output properties.
     */
    Outputs?: ResponseOutputs;
    /**
     * The channel's playback mode.
     */
    PlaybackMode?: __string;
    /**
     * The tags assigned to the channel.
     */
    Tags?: __mapOf__string;
  }
  export interface UpdateSourceLocationRequest {
    /**
     * Access configuration parameters. Configures the type of authentication used to access content from your source location.
     */
    AccessConfiguration?: AccessConfiguration;
    /**
     * The optional configuration for the host server that serves segments.
     */
    DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
    /**
     * The HTTP configuration for the source location.
     */
    HttpConfiguration: HttpConfiguration;
    /**
     * The identifier for the source location you are working on.
     */
    SourceLocationName: __string;
  }
  export interface UpdateSourceLocationResponse {
    /**
     * The access configuration for the source location.
     */
    AccessConfiguration?: AccessConfiguration;
    /**
     * The ARN of the source location.
     */
    Arn?: __string;
    /**
     * The timestamp that indicates when the source location was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The default segment delivery configuration settings.
     */
    DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
    /**
     * The HTTP package configuration settings for the source location.
     */
    HttpConfiguration?: HttpConfiguration;
    /**
     * The timestamp that indicates when the source location was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name of the source location.
     */
    SourceLocationName?: __string;
    /**
     * The tags assigned to the source location.
     */
    Tags?: __mapOf__string;
  }
  export interface UpdateVodSourceRequest {
    /**
     * An array of HTTP package configurations for the VOD source on this account.
     */
    HttpPackageConfigurations: HttpPackageConfigurations;
    /**
     * The identifier for the source location you are working on.
     */
    SourceLocationName: __string;
    /**
     * The identifier for the VOD source you are working on.
     */
    VodSourceName: __string;
  }
  export interface UpdateVodSourceResponse {
    /**
     * The ARN of the VOD source.
     */
    Arn?: __string;
    /**
     * The timestamp that indicates when the VOD source was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The HTTP package configurations.
     */
    HttpPackageConfigurations?: HttpPackageConfigurations;
    /**
     * The ARN for the VOD source.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name of the source location associated with the VOD source.
     */
    SourceLocationName?: __string;
    /**
     * The tags assigned to the VOD source.
     */
    Tags?: __mapOf__string;
    /**
     * The name of the VOD source.
     */
    VodSourceName?: __string;
  }
  export interface VodSource {
    /**
     * The ARN for the VOD source.
     */
    Arn: __string;
    /**
     * The timestamp that indicates when the VOD source was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The HTTP package configurations for the VOD source.
     */
    HttpPackageConfigurations: HttpPackageConfigurations;
    /**
     * The timestamp that indicates when the VOD source was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name of the source location that the VOD source is associated with.
     */
    SourceLocationName: __string;
    /**
     * The tags assigned to the VOD source.
     */
    Tags?: __mapOf__string;
    /**
     * The name of the VOD source.
     */
    VodSourceName: __string;
  }
  export type __boolean = boolean;
  export type __integer = number;
  export type __integerMin1 = number;
  export type __integerMin1Max100 = number;
  export type __listOfAdBreak = AdBreak[];
  export type __listOfAlert = Alert[];
  export type __listOfAvailMatchingCriteria = AvailMatchingCriteria[];
  export type __listOfChannel = Channel[];
  export type __listOfPlaybackConfiguration = PlaybackConfiguration[];
  export type __listOfPrefetchSchedule = PrefetchSchedule[];
  export type __listOfScheduleAdBreak = ScheduleAdBreak[];
  export type __listOfScheduleEntry = ScheduleEntry[];
  export type __listOfSourceLocation = SourceLocation[];
  export type __listOfVodSource = VodSource[];
  export type __listOf__string = __string[];
  export type __long = number;
  export type __mapOf__string = {[key: string]: __string};
  export type __string = string;
  export type __timestampUnix = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-04-23"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MediaTailor client.
   */
  export import Types = MediaTailor;
}
export = MediaTailor;
