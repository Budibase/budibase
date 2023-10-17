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
   * Configures Amazon CloudWatch log settings for a channel.
   */
  configureLogsForChannel(params: MediaTailor.Types.ConfigureLogsForChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.ConfigureLogsForChannelResponse) => void): Request<MediaTailor.Types.ConfigureLogsForChannelResponse, AWSError>;
  /**
   * Configures Amazon CloudWatch log settings for a channel.
   */
  configureLogsForChannel(callback?: (err: AWSError, data: MediaTailor.Types.ConfigureLogsForChannelResponse) => void): Request<MediaTailor.Types.ConfigureLogsForChannelResponse, AWSError>;
  /**
   * Amazon CloudWatch log settings for a playback configuration.
   */
  configureLogsForPlaybackConfiguration(params: MediaTailor.Types.ConfigureLogsForPlaybackConfigurationRequest, callback?: (err: AWSError, data: MediaTailor.Types.ConfigureLogsForPlaybackConfigurationResponse) => void): Request<MediaTailor.Types.ConfigureLogsForPlaybackConfigurationResponse, AWSError>;
  /**
   * Amazon CloudWatch log settings for a playback configuration.
   */
  configureLogsForPlaybackConfiguration(callback?: (err: AWSError, data: MediaTailor.Types.ConfigureLogsForPlaybackConfigurationResponse) => void): Request<MediaTailor.Types.ConfigureLogsForPlaybackConfigurationResponse, AWSError>;
  /**
   * Creates a channel. For information about MediaTailor channels, see Working with channels in the MediaTailor User Guide.
   */
  createChannel(params: MediaTailor.Types.CreateChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.CreateChannelResponse) => void): Request<MediaTailor.Types.CreateChannelResponse, AWSError>;
  /**
   * Creates a channel. For information about MediaTailor channels, see Working with channels in the MediaTailor User Guide.
   */
  createChannel(callback?: (err: AWSError, data: MediaTailor.Types.CreateChannelResponse) => void): Request<MediaTailor.Types.CreateChannelResponse, AWSError>;
  /**
   * The live source configuration.
   */
  createLiveSource(params: MediaTailor.Types.CreateLiveSourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.CreateLiveSourceResponse) => void): Request<MediaTailor.Types.CreateLiveSourceResponse, AWSError>;
  /**
   * The live source configuration.
   */
  createLiveSource(callback?: (err: AWSError, data: MediaTailor.Types.CreateLiveSourceResponse) => void): Request<MediaTailor.Types.CreateLiveSourceResponse, AWSError>;
  /**
   * Creates a prefetch schedule for a playback configuration. A prefetch schedule allows you to tell MediaTailor to fetch and prepare certain ads before an ad break happens. For more information about ad prefetching, see Using ad prefetching in the MediaTailor User Guide.
   */
  createPrefetchSchedule(params: MediaTailor.Types.CreatePrefetchScheduleRequest, callback?: (err: AWSError, data: MediaTailor.Types.CreatePrefetchScheduleResponse) => void): Request<MediaTailor.Types.CreatePrefetchScheduleResponse, AWSError>;
  /**
   * Creates a prefetch schedule for a playback configuration. A prefetch schedule allows you to tell MediaTailor to fetch and prepare certain ads before an ad break happens. For more information about ad prefetching, see Using ad prefetching in the MediaTailor User Guide.
   */
  createPrefetchSchedule(callback?: (err: AWSError, data: MediaTailor.Types.CreatePrefetchScheduleResponse) => void): Request<MediaTailor.Types.CreatePrefetchScheduleResponse, AWSError>;
  /**
   * Creates a program within a channel. For information about programs, see Working with programs in the MediaTailor User Guide.
   */
  createProgram(params: MediaTailor.Types.CreateProgramRequest, callback?: (err: AWSError, data: MediaTailor.Types.CreateProgramResponse) => void): Request<MediaTailor.Types.CreateProgramResponse, AWSError>;
  /**
   * Creates a program within a channel. For information about programs, see Working with programs in the MediaTailor User Guide.
   */
  createProgram(callback?: (err: AWSError, data: MediaTailor.Types.CreateProgramResponse) => void): Request<MediaTailor.Types.CreateProgramResponse, AWSError>;
  /**
   * Creates a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the MediaTailor User Guide.
   */
  createSourceLocation(params: MediaTailor.Types.CreateSourceLocationRequest, callback?: (err: AWSError, data: MediaTailor.Types.CreateSourceLocationResponse) => void): Request<MediaTailor.Types.CreateSourceLocationResponse, AWSError>;
  /**
   * Creates a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the MediaTailor User Guide.
   */
  createSourceLocation(callback?: (err: AWSError, data: MediaTailor.Types.CreateSourceLocationResponse) => void): Request<MediaTailor.Types.CreateSourceLocationResponse, AWSError>;
  /**
   * The VOD source configuration parameters.
   */
  createVodSource(params: MediaTailor.Types.CreateVodSourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.CreateVodSourceResponse) => void): Request<MediaTailor.Types.CreateVodSourceResponse, AWSError>;
  /**
   * The VOD source configuration parameters.
   */
  createVodSource(callback?: (err: AWSError, data: MediaTailor.Types.CreateVodSourceResponse) => void): Request<MediaTailor.Types.CreateVodSourceResponse, AWSError>;
  /**
   * Deletes a channel. For information about MediaTailor channels, see Working with channels in the MediaTailor User Guide.
   */
  deleteChannel(params: MediaTailor.Types.DeleteChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeleteChannelResponse) => void): Request<MediaTailor.Types.DeleteChannelResponse, AWSError>;
  /**
   * Deletes a channel. For information about MediaTailor channels, see Working with channels in the MediaTailor User Guide.
   */
  deleteChannel(callback?: (err: AWSError, data: MediaTailor.Types.DeleteChannelResponse) => void): Request<MediaTailor.Types.DeleteChannelResponse, AWSError>;
  /**
   * The channel policy to delete.
   */
  deleteChannelPolicy(params: MediaTailor.Types.DeleteChannelPolicyRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeleteChannelPolicyResponse) => void): Request<MediaTailor.Types.DeleteChannelPolicyResponse, AWSError>;
  /**
   * The channel policy to delete.
   */
  deleteChannelPolicy(callback?: (err: AWSError, data: MediaTailor.Types.DeleteChannelPolicyResponse) => void): Request<MediaTailor.Types.DeleteChannelPolicyResponse, AWSError>;
  /**
   * The live source to delete.
   */
  deleteLiveSource(params: MediaTailor.Types.DeleteLiveSourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeleteLiveSourceResponse) => void): Request<MediaTailor.Types.DeleteLiveSourceResponse, AWSError>;
  /**
   * The live source to delete.
   */
  deleteLiveSource(callback?: (err: AWSError, data: MediaTailor.Types.DeleteLiveSourceResponse) => void): Request<MediaTailor.Types.DeleteLiveSourceResponse, AWSError>;
  /**
   * Deletes a playback configuration. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
   */
  deletePlaybackConfiguration(params: MediaTailor.Types.DeletePlaybackConfigurationRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeletePlaybackConfigurationResponse) => void): Request<MediaTailor.Types.DeletePlaybackConfigurationResponse, AWSError>;
  /**
   * Deletes a playback configuration. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
   */
  deletePlaybackConfiguration(callback?: (err: AWSError, data: MediaTailor.Types.DeletePlaybackConfigurationResponse) => void): Request<MediaTailor.Types.DeletePlaybackConfigurationResponse, AWSError>;
  /**
   * Deletes a prefetch schedule for a specific playback configuration. If you call DeletePrefetchSchedule on an expired prefetch schedule, MediaTailor returns an HTTP 404 status code. For more information about ad prefetching, see Using ad prefetching in the MediaTailor User Guide.
   */
  deletePrefetchSchedule(params: MediaTailor.Types.DeletePrefetchScheduleRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeletePrefetchScheduleResponse) => void): Request<MediaTailor.Types.DeletePrefetchScheduleResponse, AWSError>;
  /**
   * Deletes a prefetch schedule for a specific playback configuration. If you call DeletePrefetchSchedule on an expired prefetch schedule, MediaTailor returns an HTTP 404 status code. For more information about ad prefetching, see Using ad prefetching in the MediaTailor User Guide.
   */
  deletePrefetchSchedule(callback?: (err: AWSError, data: MediaTailor.Types.DeletePrefetchScheduleResponse) => void): Request<MediaTailor.Types.DeletePrefetchScheduleResponse, AWSError>;
  /**
   * Deletes a program within a channel. For information about programs, see Working with programs in the MediaTailor User Guide.
   */
  deleteProgram(params: MediaTailor.Types.DeleteProgramRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeleteProgramResponse) => void): Request<MediaTailor.Types.DeleteProgramResponse, AWSError>;
  /**
   * Deletes a program within a channel. For information about programs, see Working with programs in the MediaTailor User Guide.
   */
  deleteProgram(callback?: (err: AWSError, data: MediaTailor.Types.DeleteProgramResponse) => void): Request<MediaTailor.Types.DeleteProgramResponse, AWSError>;
  /**
   * Deletes a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the MediaTailor User Guide.
   */
  deleteSourceLocation(params: MediaTailor.Types.DeleteSourceLocationRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeleteSourceLocationResponse) => void): Request<MediaTailor.Types.DeleteSourceLocationResponse, AWSError>;
  /**
   * Deletes a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the MediaTailor User Guide.
   */
  deleteSourceLocation(callback?: (err: AWSError, data: MediaTailor.Types.DeleteSourceLocationResponse) => void): Request<MediaTailor.Types.DeleteSourceLocationResponse, AWSError>;
  /**
   * The video on demand (VOD) source to delete.
   */
  deleteVodSource(params: MediaTailor.Types.DeleteVodSourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.DeleteVodSourceResponse) => void): Request<MediaTailor.Types.DeleteVodSourceResponse, AWSError>;
  /**
   * The video on demand (VOD) source to delete.
   */
  deleteVodSource(callback?: (err: AWSError, data: MediaTailor.Types.DeleteVodSourceResponse) => void): Request<MediaTailor.Types.DeleteVodSourceResponse, AWSError>;
  /**
   * Describes a channel. For information about MediaTailor channels, see Working with channels in the MediaTailor User Guide.
   */
  describeChannel(params: MediaTailor.Types.DescribeChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.DescribeChannelResponse) => void): Request<MediaTailor.Types.DescribeChannelResponse, AWSError>;
  /**
   * Describes a channel. For information about MediaTailor channels, see Working with channels in the MediaTailor User Guide.
   */
  describeChannel(callback?: (err: AWSError, data: MediaTailor.Types.DescribeChannelResponse) => void): Request<MediaTailor.Types.DescribeChannelResponse, AWSError>;
  /**
   * The live source to describe.
   */
  describeLiveSource(params: MediaTailor.Types.DescribeLiveSourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.DescribeLiveSourceResponse) => void): Request<MediaTailor.Types.DescribeLiveSourceResponse, AWSError>;
  /**
   * The live source to describe.
   */
  describeLiveSource(callback?: (err: AWSError, data: MediaTailor.Types.DescribeLiveSourceResponse) => void): Request<MediaTailor.Types.DescribeLiveSourceResponse, AWSError>;
  /**
   * Describes a program within a channel. For information about programs, see Working with programs in the MediaTailor User Guide.
   */
  describeProgram(params: MediaTailor.Types.DescribeProgramRequest, callback?: (err: AWSError, data: MediaTailor.Types.DescribeProgramResponse) => void): Request<MediaTailor.Types.DescribeProgramResponse, AWSError>;
  /**
   * Describes a program within a channel. For information about programs, see Working with programs in the MediaTailor User Guide.
   */
  describeProgram(callback?: (err: AWSError, data: MediaTailor.Types.DescribeProgramResponse) => void): Request<MediaTailor.Types.DescribeProgramResponse, AWSError>;
  /**
   * Describes a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the MediaTailor User Guide.
   */
  describeSourceLocation(params: MediaTailor.Types.DescribeSourceLocationRequest, callback?: (err: AWSError, data: MediaTailor.Types.DescribeSourceLocationResponse) => void): Request<MediaTailor.Types.DescribeSourceLocationResponse, AWSError>;
  /**
   * Describes a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the MediaTailor User Guide.
   */
  describeSourceLocation(callback?: (err: AWSError, data: MediaTailor.Types.DescribeSourceLocationResponse) => void): Request<MediaTailor.Types.DescribeSourceLocationResponse, AWSError>;
  /**
   * Provides details about a specific video on demand (VOD) source in a specific source location.
   */
  describeVodSource(params: MediaTailor.Types.DescribeVodSourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.DescribeVodSourceResponse) => void): Request<MediaTailor.Types.DescribeVodSourceResponse, AWSError>;
  /**
   * Provides details about a specific video on demand (VOD) source in a specific source location.
   */
  describeVodSource(callback?: (err: AWSError, data: MediaTailor.Types.DescribeVodSourceResponse) => void): Request<MediaTailor.Types.DescribeVodSourceResponse, AWSError>;
  /**
   * Returns the channel's IAM policy. IAM policies are used to control access to your channel.
   */
  getChannelPolicy(params: MediaTailor.Types.GetChannelPolicyRequest, callback?: (err: AWSError, data: MediaTailor.Types.GetChannelPolicyResponse) => void): Request<MediaTailor.Types.GetChannelPolicyResponse, AWSError>;
  /**
   * Returns the channel's IAM policy. IAM policies are used to control access to your channel.
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
   * Retrieves a playback configuration. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
   */
  getPlaybackConfiguration(params: MediaTailor.Types.GetPlaybackConfigurationRequest, callback?: (err: AWSError, data: MediaTailor.Types.GetPlaybackConfigurationResponse) => void): Request<MediaTailor.Types.GetPlaybackConfigurationResponse, AWSError>;
  /**
   * Retrieves a playback configuration. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
   */
  getPlaybackConfiguration(callback?: (err: AWSError, data: MediaTailor.Types.GetPlaybackConfigurationResponse) => void): Request<MediaTailor.Types.GetPlaybackConfigurationResponse, AWSError>;
  /**
   * Retrieves a prefetch schedule for a playback configuration. A prefetch schedule allows you to tell MediaTailor to fetch and prepare certain ads before an ad break happens. For more information about ad prefetching, see Using ad prefetching in the MediaTailor User Guide.
   */
  getPrefetchSchedule(params: MediaTailor.Types.GetPrefetchScheduleRequest, callback?: (err: AWSError, data: MediaTailor.Types.GetPrefetchScheduleResponse) => void): Request<MediaTailor.Types.GetPrefetchScheduleResponse, AWSError>;
  /**
   * Retrieves a prefetch schedule for a playback configuration. A prefetch schedule allows you to tell MediaTailor to fetch and prepare certain ads before an ad break happens. For more information about ad prefetching, see Using ad prefetching in the MediaTailor User Guide.
   */
  getPrefetchSchedule(callback?: (err: AWSError, data: MediaTailor.Types.GetPrefetchScheduleResponse) => void): Request<MediaTailor.Types.GetPrefetchScheduleResponse, AWSError>;
  /**
   * Lists the alerts that are associated with a MediaTailor channel assembly resource.
   */
  listAlerts(params: MediaTailor.Types.ListAlertsRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListAlertsResponse) => void): Request<MediaTailor.Types.ListAlertsResponse, AWSError>;
  /**
   * Lists the alerts that are associated with a MediaTailor channel assembly resource.
   */
  listAlerts(callback?: (err: AWSError, data: MediaTailor.Types.ListAlertsResponse) => void): Request<MediaTailor.Types.ListAlertsResponse, AWSError>;
  /**
   * Retrieves information about the channels that are associated with the current AWS account.
   */
  listChannels(params: MediaTailor.Types.ListChannelsRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListChannelsResponse) => void): Request<MediaTailor.Types.ListChannelsResponse, AWSError>;
  /**
   * Retrieves information about the channels that are associated with the current AWS account.
   */
  listChannels(callback?: (err: AWSError, data: MediaTailor.Types.ListChannelsResponse) => void): Request<MediaTailor.Types.ListChannelsResponse, AWSError>;
  /**
   * Lists the live sources contained in a source location. A source represents a piece of content.
   */
  listLiveSources(params: MediaTailor.Types.ListLiveSourcesRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListLiveSourcesResponse) => void): Request<MediaTailor.Types.ListLiveSourcesResponse, AWSError>;
  /**
   * Lists the live sources contained in a source location. A source represents a piece of content.
   */
  listLiveSources(callback?: (err: AWSError, data: MediaTailor.Types.ListLiveSourcesResponse) => void): Request<MediaTailor.Types.ListLiveSourcesResponse, AWSError>;
  /**
   * Retrieves existing playback configurations. For information about MediaTailor configurations, see Working with Configurations in AWS Elemental MediaTailor.
   */
  listPlaybackConfigurations(params: MediaTailor.Types.ListPlaybackConfigurationsRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListPlaybackConfigurationsResponse) => void): Request<MediaTailor.Types.ListPlaybackConfigurationsResponse, AWSError>;
  /**
   * Retrieves existing playback configurations. For information about MediaTailor configurations, see Working with Configurations in AWS Elemental MediaTailor.
   */
  listPlaybackConfigurations(callback?: (err: AWSError, data: MediaTailor.Types.ListPlaybackConfigurationsResponse) => void): Request<MediaTailor.Types.ListPlaybackConfigurationsResponse, AWSError>;
  /**
   * Lists the prefetch schedules for a playback configuration.
   */
  listPrefetchSchedules(params: MediaTailor.Types.ListPrefetchSchedulesRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListPrefetchSchedulesResponse) => void): Request<MediaTailor.Types.ListPrefetchSchedulesResponse, AWSError>;
  /**
   * Lists the prefetch schedules for a playback configuration.
   */
  listPrefetchSchedules(callback?: (err: AWSError, data: MediaTailor.Types.ListPrefetchSchedulesResponse) => void): Request<MediaTailor.Types.ListPrefetchSchedulesResponse, AWSError>;
  /**
   * Lists the source locations for a channel. A source location defines the host server URL, and contains a list of sources.
   */
  listSourceLocations(params: MediaTailor.Types.ListSourceLocationsRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListSourceLocationsResponse) => void): Request<MediaTailor.Types.ListSourceLocationsResponse, AWSError>;
  /**
   * Lists the source locations for a channel. A source location defines the host server URL, and contains a list of sources.
   */
  listSourceLocations(callback?: (err: AWSError, data: MediaTailor.Types.ListSourceLocationsResponse) => void): Request<MediaTailor.Types.ListSourceLocationsResponse, AWSError>;
  /**
   * A list of tags that are associated with this resource. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
   */
  listTagsForResource(params: MediaTailor.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListTagsForResourceResponse) => void): Request<MediaTailor.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * A list of tags that are associated with this resource. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
   */
  listTagsForResource(callback?: (err: AWSError, data: MediaTailor.Types.ListTagsForResourceResponse) => void): Request<MediaTailor.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the VOD sources contained in a source location. A source represents a piece of content.
   */
  listVodSources(params: MediaTailor.Types.ListVodSourcesRequest, callback?: (err: AWSError, data: MediaTailor.Types.ListVodSourcesResponse) => void): Request<MediaTailor.Types.ListVodSourcesResponse, AWSError>;
  /**
   * Lists the VOD sources contained in a source location. A source represents a piece of content.
   */
  listVodSources(callback?: (err: AWSError, data: MediaTailor.Types.ListVodSourcesResponse) => void): Request<MediaTailor.Types.ListVodSourcesResponse, AWSError>;
  /**
   * Creates an IAM policy for the channel. IAM policies are used to control access to your channel.
   */
  putChannelPolicy(params: MediaTailor.Types.PutChannelPolicyRequest, callback?: (err: AWSError, data: MediaTailor.Types.PutChannelPolicyResponse) => void): Request<MediaTailor.Types.PutChannelPolicyResponse, AWSError>;
  /**
   * Creates an IAM policy for the channel. IAM policies are used to control access to your channel.
   */
  putChannelPolicy(callback?: (err: AWSError, data: MediaTailor.Types.PutChannelPolicyResponse) => void): Request<MediaTailor.Types.PutChannelPolicyResponse, AWSError>;
  /**
   * Creates a playback configuration. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
   */
  putPlaybackConfiguration(params: MediaTailor.Types.PutPlaybackConfigurationRequest, callback?: (err: AWSError, data: MediaTailor.Types.PutPlaybackConfigurationResponse) => void): Request<MediaTailor.Types.PutPlaybackConfigurationResponse, AWSError>;
  /**
   * Creates a playback configuration. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
   */
  putPlaybackConfiguration(callback?: (err: AWSError, data: MediaTailor.Types.PutPlaybackConfigurationResponse) => void): Request<MediaTailor.Types.PutPlaybackConfigurationResponse, AWSError>;
  /**
   * Starts a channel. For information about MediaTailor channels, see Working with channels in the MediaTailor User Guide.
   */
  startChannel(params: MediaTailor.Types.StartChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.StartChannelResponse) => void): Request<MediaTailor.Types.StartChannelResponse, AWSError>;
  /**
   * Starts a channel. For information about MediaTailor channels, see Working with channels in the MediaTailor User Guide.
   */
  startChannel(callback?: (err: AWSError, data: MediaTailor.Types.StartChannelResponse) => void): Request<MediaTailor.Types.StartChannelResponse, AWSError>;
  /**
   * Stops a channel. For information about MediaTailor channels, see Working with channels in the MediaTailor User Guide.
   */
  stopChannel(params: MediaTailor.Types.StopChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.StopChannelResponse) => void): Request<MediaTailor.Types.StopChannelResponse, AWSError>;
  /**
   * Stops a channel. For information about MediaTailor channels, see Working with channels in the MediaTailor User Guide.
   */
  stopChannel(callback?: (err: AWSError, data: MediaTailor.Types.StopChannelResponse) => void): Request<MediaTailor.Types.StopChannelResponse, AWSError>;
  /**
   * The resource to tag. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
   */
  tagResource(params: MediaTailor.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * The resource to tag. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * The resource to untag.
   */
  untagResource(params: MediaTailor.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * The resource to untag.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a channel. For information about MediaTailor channels, see Working with channels in the MediaTailor User Guide.
   */
  updateChannel(params: MediaTailor.Types.UpdateChannelRequest, callback?: (err: AWSError, data: MediaTailor.Types.UpdateChannelResponse) => void): Request<MediaTailor.Types.UpdateChannelResponse, AWSError>;
  /**
   * Updates a channel. For information about MediaTailor channels, see Working with channels in the MediaTailor User Guide.
   */
  updateChannel(callback?: (err: AWSError, data: MediaTailor.Types.UpdateChannelResponse) => void): Request<MediaTailor.Types.UpdateChannelResponse, AWSError>;
  /**
   * Updates a live source's configuration.
   */
  updateLiveSource(params: MediaTailor.Types.UpdateLiveSourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.UpdateLiveSourceResponse) => void): Request<MediaTailor.Types.UpdateLiveSourceResponse, AWSError>;
  /**
   * Updates a live source's configuration.
   */
  updateLiveSource(callback?: (err: AWSError, data: MediaTailor.Types.UpdateLiveSourceResponse) => void): Request<MediaTailor.Types.UpdateLiveSourceResponse, AWSError>;
  /**
   * Updates a program within a channel.
   */
  updateProgram(params: MediaTailor.Types.UpdateProgramRequest, callback?: (err: AWSError, data: MediaTailor.Types.UpdateProgramResponse) => void): Request<MediaTailor.Types.UpdateProgramResponse, AWSError>;
  /**
   * Updates a program within a channel.
   */
  updateProgram(callback?: (err: AWSError, data: MediaTailor.Types.UpdateProgramResponse) => void): Request<MediaTailor.Types.UpdateProgramResponse, AWSError>;
  /**
   * Updates a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the MediaTailor User Guide.
   */
  updateSourceLocation(params: MediaTailor.Types.UpdateSourceLocationRequest, callback?: (err: AWSError, data: MediaTailor.Types.UpdateSourceLocationResponse) => void): Request<MediaTailor.Types.UpdateSourceLocationResponse, AWSError>;
  /**
   * Updates a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the MediaTailor User Guide.
   */
  updateSourceLocation(callback?: (err: AWSError, data: MediaTailor.Types.UpdateSourceLocationResponse) => void): Request<MediaTailor.Types.UpdateSourceLocationResponse, AWSError>;
  /**
   * Updates a VOD source's configuration.
   */
  updateVodSource(params: MediaTailor.Types.UpdateVodSourceRequest, callback?: (err: AWSError, data: MediaTailor.Types.UpdateVodSourceResponse) => void): Request<MediaTailor.Types.UpdateVodSourceResponse, AWSError>;
  /**
   * Updates a VOD source's configuration.
   */
  updateVodSource(callback?: (err: AWSError, data: MediaTailor.Types.UpdateVodSourceResponse) => void): Request<MediaTailor.Types.UpdateVodSourceResponse, AWSError>;
}
declare namespace MediaTailor {
  export interface AccessConfiguration {
    /**
     * The type of authentication used to access content from HttpConfiguration::BaseUrl on your source location.  S3_SIGV4 - AWS Signature Version 4 authentication for Amazon S3 hosted virtual-style access. If your source location base URL is an Amazon S3 bucket, MediaTailor can use AWS Signature Version 4 (SigV4) authentication to access the bucket where your source content is stored. Your MediaTailor source location baseURL must follow the S3 virtual hosted-style request URL format. For example, https://bucket-name.s3.Region.amazonaws.com/key-name. Before you can use S3_SIGV4, you must meet these requirements: • You must allow MediaTailor to access your S3 bucket by granting mediatailor.amazonaws.com principal access in IAM. For information about configuring access in IAM, see Access management in the IAM User Guide. • The mediatailor.amazonaws.com service principal must have permissions to read all top level manifests referenced by the VodSource packaging configurations. • The caller of the API must have s3:GetObject IAM permissions to read all top level manifests referenced by your MediaTailor VodSource packaging configurations.  AUTODETECT_SIGV4 - AWS Signature Version 4 authentication for a set of supported services: MediaPackage Version 2 and Amazon S3 hosted virtual-style access. If your source location base URL is a MediaPackage Version 2 endpoint or an Amazon S3 bucket, MediaTailor can use AWS Signature Version 4 (SigV4) authentication to access the resource where your source content is stored. Before you can use AUTODETECT_SIGV4 with a MediaPackage Version 2 endpoint, you must meet these requirements: • You must grant MediaTailor access to your MediaPackage endpoint by granting mediatailor.amazonaws.com principal access in an Origin Access policy on the endpoint. • Your MediaTailor source location base URL must be a MediaPackage V2 endpoint. • The caller of the API must have mediapackagev2:GetObject IAM permissions to read all top level manifests referenced by the MediaTailor source packaging configurations. Before you can use AUTODETECT_SIGV4 with an Amazon S3 bucket, you must meet these requirements: • You must grant MediaTailor access to your S3 bucket by granting mediatailor.amazonaws.com principal access in IAM. For more information about configuring access in IAM, see Access management in the IAM User Guide.. • The mediatailor.amazonaws.com service principal must have permissions to read all top-level manifests referenced by the VodSource packaging configurations. • The caller of the API must have s3:GetObject IAM permissions to read all top level manifests referenced by your MediaTailor VodSource packaging configurations.
     */
    AccessType?: AccessType;
    /**
     * AWS Secrets Manager access token configuration parameters.
     */
    SecretsManagerAccessTokenConfiguration?: SecretsManagerAccessTokenConfiguration;
  }
  export type AccessType = "S3_SIGV4"|"SECRETS_MANAGER_ACCESS_TOKEN"|"AUTODETECT_SIGV4"|string;
  export interface AdBreak {
    /**
     * Defines a list of key/value pairs that MediaTailor generates within the EXT-X-ASSETtag for SCTE35_ENHANCED output.
     */
    AdBreakMetadata?: AdBreakMetadataList;
    /**
     * The SCTE-35 ad insertion type. Accepted value: SPLICE_INSERT, TIME_SIGNAL.
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
    /**
     * Defines the SCTE-35 time_signal message inserted around the ad. Programs on a channel's schedule can be configured with one or more ad breaks. You can attach a splice_insert SCTE-35 message to the ad break. This message provides basic metadata about the ad break. See section 9.7.4 of the 2022 SCTE-35 specification for more information.
     */
    TimeSignalMessage?: TimeSignalMessage;
  }
  export type AdBreakMetadataList = KeyValuePair[];
  export type AdBreakOpportunities = AdBreakOpportunity[];
  export interface AdBreakOpportunity {
    /**
     * The offset in milliseconds from the start of the VOD source at which an ad marker was detected.
     */
    OffsetMillis: __long;
  }
  export interface AdMarkerPassthrough {
    /**
     * Enables ad marker passthrough for your configuration.
     */
    Enabled?: __boolean;
  }
  export type AdMarkupType = "DATERANGE"|"SCTE35_ENHANCED"|string;
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
     * The category that MediaTailor assigns to the alert.
     */
    Category?: AlertCategory;
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
  export type AlertCategory = "SCHEDULING_ERROR"|"PLAYBACK_WARNING"|"INFO"|string;
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
     * Defines the policy to apply to the avail suppression mode. BEHIND_LIVE_EDGE will always use the full avail suppression policy. AFTER_LIVE_EDGE mode can be used to invoke partial ad break fills when a session starts mid-break.
     */
    FillPolicy?: FillPolicy;
    /**
     * Sets the ad suppression mode. By default, ad suppression is off and all ad breaks are filled with ads or slate. When Mode is set to BEHIND_LIVE_EDGE, ad suppression is active and MediaTailor won't fill ad breaks on or behind the ad suppression Value time in the manifest lookback window. When Mode is set to AFTER_LIVE_EDGE, ad suppression is active and MediaTailor won't fill ad breaks that are within the live edge plus the avail suppression value.
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
     * A non-default content delivery network (CDN) to serve ad segments. By default, AWS Elemental MediaTailor uses Amazon CloudFront with default cache settings as its CDN for ad segments. To set up an alternate CDN, create a rule in your CDN for the origin ads.mediatailor.&lt;region&gt;.amazonaws.com. Then specify the rule's name in this AdSegmentUrlPrefix. When AWS Elemental MediaTailor serves a manifest, it reports your CDN as the source for ad segments.
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
     * The slate used to fill gaps between programs in the schedule. You must configure filler slate if your channel uses the LINEAR PlaybackMode. MediaTailor doesn't support filler slate for channels using the LOOP PlaybackMode.
     */
    FillerSlate?: SlateSource;
    /**
     * The timestamp of when the channel was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The log configuration.
     */
    LogConfiguration: LogConfigurationForChannel;
    /**
     * The channel's output properties.
     */
    Outputs: ResponseOutputs;
    /**
     * The type of playback mode for this channel.  LINEAR - Programs play back-to-back only once.  LOOP - Programs play back-to-back in an endless loop. When the last program in the schedule plays, playback loops back to the first program in the schedule.
     */
    PlaybackMode: __string;
    /**
     * The tags to assign to the channel. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
    /**
     * The tier for this channel. STANDARD tier channels can contain live programs.
     */
    Tier: __string;
  }
  export type ChannelState = "RUNNING"|"STOPPED"|string;
  export interface ClipRange {
    /**
     * The end offset of the clip range, in milliseconds, starting from the beginning of the VOD source associated with the program.
     */
    EndOffsetMillis: __long;
  }
  export type ConfigurationAliasesRequest = {[key: string]: __mapOf__string};
  export type ConfigurationAliasesResponse = {[key: string]: __mapOf__string};
  export interface ConfigureLogsForChannelRequest {
    /**
     * The name of the channel.
     */
    ChannelName: __string;
    /**
     * The types of logs to collect.
     */
    LogTypes: LogTypes;
  }
  export interface ConfigureLogsForChannelResponse {
    /**
     * The name of the channel.
     */
    ChannelName?: __string;
    /**
     * The types of logs collected.
     */
    LogTypes?: LogTypes;
  }
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
    PercentEnabled: __integer;
    /**
     * The name of the playback configuration.
     */
    PlaybackConfigurationName?: __string;
  }
  export interface CreateChannelRequest {
    /**
     * The name of the channel.
     */
    ChannelName: __string;
    /**
     * The slate used to fill gaps between programs in the schedule. You must configure filler slate if your channel uses the LINEAR PlaybackMode. MediaTailor doesn't support filler slate for channels using the LOOP PlaybackMode.
     */
    FillerSlate?: SlateSource;
    /**
     * The channel's output properties.
     */
    Outputs: RequestOutputs;
    /**
     * The type of playback mode to use for this channel.  LINEAR - The programs in the schedule play once back-to-back in the schedule.  LOOP - The programs in the schedule play back-to-back in an endless loop. When the last program in the schedule stops playing, playback loops back to the first program in the schedule.
     */
    PlaybackMode: PlaybackMode;
    /**
     * The tags to assign to the channel. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
    /**
     * The tier of the channel.
     */
    Tier?: Tier;
  }
  export interface CreateChannelResponse {
    /**
     * The Amazon Resource Name (ARN) to assign to the channel.
     */
    Arn?: __string;
    /**
     * The name to assign to the channel.
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
     * The output properties to assign to the channel.
     */
    Outputs?: ResponseOutputs;
    /**
     * The playback mode to assign to the channel.
     */
    PlaybackMode?: __string;
    /**
     * The tags to assign to the channel. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
    /**
     * The tier of the channel.
     */
    Tier?: __string;
  }
  export interface CreateLiveSourceRequest {
    /**
     * A list of HTTP package configuration parameters for this live source.
     */
    HttpPackageConfigurations: HttpPackageConfigurations;
    /**
     * The name of the live source.
     */
    LiveSourceName: __string;
    /**
     * The name of the source location.
     */
    SourceLocationName: __string;
    /**
     * The tags to assign to the live source. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
  }
  export interface CreateLiveSourceResponse {
    /**
     * The ARN to assign to the live source.
     */
    Arn?: __string;
    /**
     * The time the live source was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * A list of HTTP package configuration parameters for this live source.
     */
    HttpPackageConfigurations?: HttpPackageConfigurations;
    /**
     * The time the live source was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name to assign to the live source.
     */
    LiveSourceName?: __string;
    /**
     * The name to assign to the source location of the live source.
     */
    SourceLocationName?: __string;
    /**
     * The tags to assign to the live source. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
  }
  export interface CreatePrefetchScheduleRequest {
    /**
     * The configuration settings for MediaTailor's consumption of the prefetched ads from the ad decision server. Each consumption configuration contains an end time and an optional start time that define the consumption window. Prefetch schedules automatically expire no earlier than seven days after the end time.
     */
    Consumption: PrefetchConsumption;
    /**
     * The name to assign to the schedule request.
     */
    Name: __string;
    /**
     * The name to assign to the playback configuration.
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
     * The ARN to assign to the prefetch schedule.
     */
    Arn?: __string;
    /**
     * The configuration settings for MediaTailor's consumption of the prefetched ads from the ad decision server. Each consumption configuration contains an end time and an optional start time that define the consumption window. Prefetch schedules automatically expire no earlier than seven days after the end time.
     */
    Consumption?: PrefetchConsumption;
    /**
     * The name to assign to the prefetch schedule.
     */
    Name?: __string;
    /**
     * The name to assign to the playback configuration.
     */
    PlaybackConfigurationName?: __string;
    /**
     * The configuration settings for retrieval of prefetched ads from the ad decision server. Only one set of prefetched ads will be retrieved and subsequently consumed for each ad break.
     */
    Retrieval?: PrefetchRetrieval;
    /**
     * An optional stream identifier that MediaTailor uses to prefetch ads for multiple streams that use the same playback configuration. If StreamId is specified, MediaTailor returns all of the prefetch schedules with an exact match on StreamId. If not specified, MediaTailor returns all of the prefetch schedules for the playback configuration, regardless of StreamId.
     */
    StreamId?: __string;
  }
  export interface CreateProgramRequest {
    /**
     * The ad break configuration settings.
     */
    AdBreaks?: __listOfAdBreak;
    /**
     * The name of the channel for this Program.
     */
    ChannelName: __string;
    /**
     * The name of the LiveSource for this Program.
     */
    LiveSourceName?: __string;
    /**
     * The name of the Program.
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
    VodSourceName?: __string;
  }
  export interface CreateProgramResponse {
    /**
     * The ad break configuration settings.
     */
    AdBreaks?: __listOfAdBreak;
    /**
     * The ARN to assign to the program.
     */
    Arn?: __string;
    /**
     * The name to assign to the channel for this program.
     */
    ChannelName?: __string;
    /**
     * The clip range configuration settings.
     */
    ClipRange?: ClipRange;
    /**
     * The time the program was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The duration of the live program in milliseconds.
     */
    DurationMillis?: __long;
    /**
     * The name of the LiveSource for this Program.
     */
    LiveSourceName?: __string;
    /**
     * The name to assign to this program.
     */
    ProgramName?: __string;
    /**
     * The scheduled start time for this Program.
     */
    ScheduledStartTime?: __timestampUnix;
    /**
     * The name to assign to the source location for this program.
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
     * A list of the segment delivery configurations associated with this resource.
     */
    SegmentDeliveryConfigurations?: __listOfSegmentDeliveryConfiguration;
    /**
     * The name associated with the source location.
     */
    SourceLocationName: __string;
    /**
     * The tags to assign to the source location. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
  }
  export interface CreateSourceLocationResponse {
    /**
     * Access configuration parameters. Configures the type of authentication used to access content from your source location.
     */
    AccessConfiguration?: AccessConfiguration;
    /**
     * The ARN to assign to the source location.
     */
    Arn?: __string;
    /**
     * The time the source location was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The optional configuration for the server that serves segments.
     */
    DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
    /**
     * The source's HTTP package configurations.
     */
    HttpConfiguration?: HttpConfiguration;
    /**
     * The time the source location was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The segment delivery configurations for the source location. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
     */
    SegmentDeliveryConfigurations?: __listOfSegmentDeliveryConfiguration;
    /**
     * The name to assign to the source location.
     */
    SourceLocationName?: __string;
    /**
     * The tags to assign to the source location. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
  }
  export interface CreateVodSourceRequest {
    /**
     * A list of HTTP package configuration parameters for this VOD source.
     */
    HttpPackageConfigurations: HttpPackageConfigurations;
    /**
     * The name of the source location for this VOD source.
     */
    SourceLocationName: __string;
    /**
     * The tags to assign to the VOD source. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
    /**
     * The name associated with the VOD source.&gt;
     */
    VodSourceName: __string;
  }
  export interface CreateVodSourceResponse {
    /**
     * The ARN to assign to this VOD source.
     */
    Arn?: __string;
    /**
     * The time the VOD source was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * A list of HTTP package configuration parameters for this VOD source.
     */
    HttpPackageConfigurations?: HttpPackageConfigurations;
    /**
     * The time the VOD source was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name to assign to the source location for this VOD source.
     */
    SourceLocationName?: __string;
    /**
     * The tags to assign to the VOD source. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
    /**
     * The name to assign to the VOD source.
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
     * The name of the channel associated with this channel policy.
     */
    ChannelName: __string;
  }
  export interface DeleteChannelPolicyResponse {
  }
  export interface DeleteChannelRequest {
    /**
     * The name of the channel.
     */
    ChannelName: __string;
  }
  export interface DeleteChannelResponse {
  }
  export interface DeleteLiveSourceRequest {
    /**
     * The name of the live source.
     */
    LiveSourceName: __string;
    /**
     * The name of the source location associated with this Live Source.
     */
    SourceLocationName: __string;
  }
  export interface DeleteLiveSourceResponse {
  }
  export interface DeletePlaybackConfigurationRequest {
    /**
     * The name of the playback configuration.
     */
    Name: __string;
  }
  export interface DeletePlaybackConfigurationResponse {
  }
  export interface DeletePrefetchScheduleRequest {
    /**
     * The name of the prefetch schedule. If the action is successful, the service sends back an HTTP 204 response with an empty HTTP body.
     */
    Name: __string;
    /**
     * The name of the playback configuration for this prefetch schedule.
     */
    PlaybackConfigurationName: __string;
  }
  export interface DeletePrefetchScheduleResponse {
  }
  export interface DeleteProgramRequest {
    /**
     * The name of the channel.
     */
    ChannelName: __string;
    /**
     * The name of the program.
     */
    ProgramName: __string;
  }
  export interface DeleteProgramResponse {
  }
  export interface DeleteSourceLocationRequest {
    /**
     * The name of the source location.
     */
    SourceLocationName: __string;
  }
  export interface DeleteSourceLocationResponse {
  }
  export interface DeleteVodSourceRequest {
    /**
     * The name of the source location associated with this VOD Source.
     */
    SourceLocationName: __string;
    /**
     * The name of the VOD source.
     */
    VodSourceName: __string;
  }
  export interface DeleteVodSourceResponse {
  }
  export interface DescribeChannelRequest {
    /**
     * The name of the channel.
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
     * The log configuration for the channel.
     */
    LogConfiguration: LogConfigurationForChannel;
    /**
     * The channel's output properties.
     */
    Outputs?: ResponseOutputs;
    /**
     * The channel's playback mode.
     */
    PlaybackMode?: __string;
    /**
     * The tags assigned to the channel. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
    /**
     * The channel's tier.
     */
    Tier?: __string;
  }
  export interface DescribeLiveSourceRequest {
    /**
     * The name of the live source.
     */
    LiveSourceName: __string;
    /**
     * The name of the source location associated with this Live Source.
     */
    SourceLocationName: __string;
  }
  export interface DescribeLiveSourceResponse {
    /**
     * The ARN of the live source.
     */
    Arn?: __string;
    /**
     * The timestamp that indicates when the live source was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The HTTP package configurations.
     */
    HttpPackageConfigurations?: HttpPackageConfigurations;
    /**
     * The timestamp that indicates when the live source was modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name of the live source.
     */
    LiveSourceName?: __string;
    /**
     * The name of the source location associated with the live source.
     */
    SourceLocationName?: __string;
    /**
     * The tags assigned to the live source. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
  }
  export interface DescribeProgramRequest {
    /**
     * The name of the channel associated with this Program.
     */
    ChannelName: __string;
    /**
     * The name of the program.
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
     * The clip range configuration settings.
     */
    ClipRange?: ClipRange;
    /**
     * The timestamp of when the program was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The duration of the live program in milliseconds.
     */
    DurationMillis?: Long;
    /**
     * The name of the LiveSource for this Program.
     */
    LiveSourceName?: __string;
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
     * The name of the source location.
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
     * A list of the segment delivery configurations associated with this resource.
     */
    SegmentDeliveryConfigurations?: __listOfSegmentDeliveryConfiguration;
    /**
     * The name of the source location.
     */
    SourceLocationName?: __string;
    /**
     * The tags assigned to the source location. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
  }
  export interface DescribeVodSourceRequest {
    /**
     * The name of the source location associated with this VOD Source.
     */
    SourceLocationName: __string;
    /**
     * The name of the VOD Source.
     */
    VodSourceName: __string;
  }
  export interface DescribeVodSourceResponse {
    /**
     * The ad break opportunities within the VOD source.
     */
    AdBreakOpportunities?: AdBreakOpportunities;
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
     * The last modified time of the VOD source.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name of the source location associated with the VOD source.
     */
    SourceLocationName?: __string;
    /**
     * The tags assigned to the VOD source. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
    /**
     * The name of the VOD source.
     */
    VodSourceName?: __string;
  }
  export type FillPolicy = "FULL_AVAIL_ONLY"|"PARTIAL_AVAIL"|string;
  export interface GetChannelPolicyRequest {
    /**
     * The name of the channel associated with this Channel Policy.
     */
    ChannelName: __string;
  }
  export interface GetChannelPolicyResponse {
    /**
     * The IAM policy for the channel. IAM policies are used to control access to your channel.
     */
    Policy?: __string;
  }
  export interface GetChannelScheduleRequest {
    /**
     * The name of the channel associated with this Channel Schedule.
     */
    ChannelName: __string;
    /**
     * The duration in minutes of the channel schedule.
     */
    DurationMinutes?: __string;
    /**
     * The maximum number of channel schedules that you want MediaTailor to return in response to the current request. If there are more than MaxResults channel schedules, use the value of NextToken in the response to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * (Optional) If the playback configuration has more than MaxResults channel schedules, use NextToken to get the second and subsequent pages of results. For the first GetChannelScheduleRequest request, omit this value. For the second and subsequent requests, get the value of NextToken from the previous response and specify that value for NextToken in the request. If the previous response didn't include a NextToken element, there are no more channel schedules to get.
     */
    NextToken?: __string;
  }
  export interface GetChannelScheduleResponse {
    /**
     * A list of schedule entries for the channel.
     */
    Items?: __listOfScheduleEntry;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
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
     * The tags assigned to the playback configuration. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
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
     * The name of the prefetch schedule. The name must be unique among all prefetch schedules that are associated with the specified playback configuration.
     */
    Name: __string;
    /**
     * Returns information about the prefetch schedule for a specific playback configuration. If you call GetPrefetchSchedule on an expired prefetch schedule, MediaTailor returns an HTTP 404 status code.
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
     * Determines the type of SCTE 35 tags to use in ad markup. Specify DATERANGE to use DATERANGE tags (for live or VOD content). Specify SCTE35_ENHANCED to use EXT-X-CUE-OUT and EXT-X-CUE-IN tags (for VOD content only).
     */
    AdMarkupType?: adMarkupTypes;
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
  export type Integer = number;
  export interface KeyValuePair {
    /**
     * For SCTE35_ENHANCED output, defines a key. MediaTailor takes this key, and its associated value, and generates the key/value pair within the EXT-X-ASSETtag. If you specify a key, you must also specify a corresponding value.
     */
    Key: String;
    /**
     * For SCTE35_ENHANCED output, defines a value. MediaTailor; takes this value, and its associated key, and generates the key/value pair within the EXT-X-ASSETtag. If you specify a value, you must also specify a corresponding key.
     */
    Value: String;
  }
  export interface ListAlertsRequest {
    /**
     * The maximum number of alerts that you want MediaTailor to return in response to the current request. If there are more than MaxResults alerts, use the value of NextToken in the response to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: __string;
  }
  export interface ListAlertsResponse {
    /**
     * A list of alerts that are associated with this resource.
     */
    Items?: __listOfAlert;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListChannelsRequest {
    /**
     * The maximum number of channels that you want MediaTailor to return in response to the current request. If there are more than MaxResults channels, use the value of NextToken in the response to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListChannelsResponse {
    /**
     * A list of channels that are associated with this account.
     */
    Items?: __listOfChannel;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListLiveSourcesRequest {
    /**
     * The maximum number of live sources that you want MediaTailor to return in response to the current request. If there are more than MaxResults live sources, use the value of NextToken in the response to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
    /**
     * The name of the source location associated with this Live Sources list.
     */
    SourceLocationName: __string;
  }
  export interface ListLiveSourcesResponse {
    /**
     * Lists the live sources.
     */
    Items?: __listOfLiveSource;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListPlaybackConfigurationsRequest {
    /**
     * The maximum number of playback configurations that you want MediaTailor to return in response to the current request. If there are more than MaxResults playback configurations, use the value of NextToken in the response to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
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
     * The maximum number of prefetch schedules that you want MediaTailor to return in response to the current request. If there are more than MaxResults prefetch schedules, use the value of NextToken in the response to get the next page of results.
     */
    MaxResults?: __integerMin1Max100;
    /**
     * (Optional) If the playback configuration has more than MaxResults prefetch schedules, use NextToken to get the second and subsequent pages of results.  For the first ListPrefetchSchedulesRequest request, omit this value.  For the second and subsequent requests, get the value of NextToken from the previous response and specify that value for NextToken in the request.  If the previous response didn't include a NextToken element, there are no more prefetch schedules to get.
     */
    NextToken?: __string;
    /**
     * Retrieves the prefetch schedule(s) for a specific playback configuration.
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
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListSourceLocationsRequest {
    /**
     *  The maximum number of source locations that you want MediaTailor to return in response to the current request. If there are more than MaxResults source locations, use the value of NextToken in the response to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListSourceLocationsResponse {
    /**
     * A list of source locations.
     */
    Items?: __listOfSourceLocation;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) associated with this resource.
     */
    ResourceArn: __string;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags associated with this resource. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
  }
  export interface ListVodSourcesRequest {
    /**
     *  The maximum number of VOD sources that you want MediaTailor to return in response to the current request. If there are more than MaxResults VOD sources, use the value of NextToken in the response to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
     */
    NextToken?: __string;
    /**
     * The name of the source location associated with this VOD Source list.
     */
    SourceLocationName: __string;
  }
  export interface ListVodSourcesResponse {
    /**
     * Lists the VOD sources.
     */
    Items?: __listOfVodSource;
    /**
     * Pagination token returned by the list request when results exceed the maximum allowed. Use the token to fetch the next page of results.
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
  export interface LiveSource {
    /**
     * The ARN for the live source.
     */
    Arn: __string;
    /**
     * The timestamp that indicates when the live source was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The HTTP package configurations for the live source.
     */
    HttpPackageConfigurations: HttpPackageConfigurations;
    /**
     * The timestamp that indicates when the live source was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name that's used to refer to a live source.
     */
    LiveSourceName: __string;
    /**
     * The name of the source location.
     */
    SourceLocationName: __string;
    /**
     * The tags assigned to the live source. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
  }
  export interface LogConfiguration {
    /**
     * The percentage of session logs that MediaTailor sends to your Cloudwatch Logs account. For example, if your playback configuration has 1000 sessions and percentEnabled is set to 60, MediaTailor sends logs for 600 of the sessions to CloudWatch Logs. MediaTailor decides at random which of the playback configuration sessions to send logs for. If you want to view logs for a specific session, you can use the debug log mode. Valid values: 0 - 100 
     */
    PercentEnabled: __integer;
  }
  export interface LogConfigurationForChannel {
    /**
     * The log types.
     */
    LogTypes?: LogTypes;
  }
  export type LogType = "AS_RUN"|string;
  export type LogTypes = LogType[];
  export type Long = number;
  export interface ManifestProcessingRules {
    /**
     * For HLS, when set to true, MediaTailor passes through EXT-X-CUE-IN, EXT-X-CUE-OUT, and EXT-X-SPLICEPOINT-SCTE35 ad markers from the origin manifest to the MediaTailor personalized manifest. No logic is applied to these ad markers. For example, if EXT-X-CUE-OUT has a value of 60, but no ads are filled for that ad break, MediaTailor will not set the value to 0.
     */
    AdMarkerPassthrough?: AdMarkerPassthrough;
  }
  export type MaxResults = number;
  export type MessageType = "SPLICE_INSERT"|"TIME_SIGNAL"|string;
  export type Mode = "OFF"|"BEHIND_LIVE_EDGE"|"AFTER_LIVE_EDGE"|string;
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
     * The tags to assign to the playback configuration. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
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
     * The dynamic variables to use for substitution during prefetch requests to the ad decision server (ADS). You initially configure dynamic variables for the ADS URL when you set up your playback configuration. When you specify DynamicVariables for prefetch retrieval, MediaTailor includes the dynamic variables in the request to the ADS.
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
     * The channel name associated with this Channel Policy.
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
    Name: __string;
    /**
     * Defines the maximum duration of underfilled ad time (in seconds) allowed in an ad break. If the duration of underfilled ad time exceeds the personalization threshold, then the personalization of the ad break is abandoned and the underlying content is shown. This feature applies to ad replacement in live and VOD streams, rather than ad insertion, because it relies on an underlying content stream. For more information about ad break behavior, including ad replacement and insertion, see Ad Behavior in AWS Elemental MediaTailor.
     */
    PersonalizationThresholdSeconds?: __integerMin1;
    /**
     * The URL for a high-quality video asset to transcode and use to fill in time that's not used by ads. AWS Elemental MediaTailor shows the slate to fill in gaps in media content. Configuring the slate is optional for non-VPAID configurations. For VPAID, the slate is required because MediaTailor provides it in the slots that are designated for dynamic ad content. The slate must be a high-quality asset that contains both audio and video.
     */
    SlateAdUrl?: __string;
    /**
     * The tags to assign to the playback configuration. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
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
     * The Amazon Resource Name (ARN) associated with the playback configuration.
     */
    PlaybackConfigurationArn?: __string;
    /**
     * The playback endpoint prefix associated with the playback configuration.
     */
    PlaybackEndpointPrefix?: __string;
    /**
     * The session initialization endpoint prefix associated with the playback configuration.
     */
    SessionInitializationEndpointPrefix?: __string;
    /**
     * The URL for a high-quality video asset to transcode and use to fill in time that's not used by ads. AWS Elemental MediaTailor shows the slate to fill in gaps in media content. Configuring the slate is optional for non-VPAID configurations. For VPAID, the slate is required because MediaTailor provides it in the slots that are designated for dynamic ad content. The slate must be a high-quality asset that contains both audio and video.
     */
    SlateAdUrl?: __string;
    /**
     * The tags to assign to the playback configuration. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
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
     * Program clip range configuration.
     */
    ClipRange?: ClipRange;
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
     * The name of the live source used for the program.
     */
    LiveSourceName?: __string;
    /**
     * The name of the program.
     */
    ProgramName: __string;
    /**
     * The schedule's ad break properties.
     */
    ScheduleAdBreaks?: __listOfScheduleAdBreak;
    /**
     * The type of schedule entry.
     */
    ScheduleEntryType?: ScheduleEntryType;
    /**
     * The name of the source location.
     */
    SourceLocationName: __string;
    /**
     * The name of the VOD source.
     */
    VodSourceName?: __string;
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
  export interface SegmentDeliveryConfiguration {
    /**
     * The base URL of the host or path of the segment delivery server that you're using to serve segments. This is typically a content delivery network (CDN). The URL can be absolute or relative. To use an absolute URL include the protocol, such as https://example.com/some/path. To use a relative URL specify the relative path, such as /some/path*.
     */
    BaseUrl?: __string;
    /**
     * A unique identifier used to distinguish between multiple segment delivery configurations in a source location.
     */
    Name?: __string;
  }
  export interface SegmentationDescriptor {
    /**
     * The segment number to assign to the segmentation_descriptor.segment_num message, as defined in section 10.3.3.1 of the 2022 SCTE-35 specification Values must be between 0 and 256, inclusive. The default value is 0.
     */
    SegmentNum?: Integer;
    /**
     * The Event Identifier to assign to the segmentation_descriptor.segmentation_event_id message, as defined in section 10.3.3.1 of the 2022 SCTE-35 specification. The default value is 1.
     */
    SegmentationEventId?: Integer;
    /**
     * The Type Identifier to assign to the segmentation_descriptor.segmentation_type_id message, as defined in section 10.3.3.1 of the 2022 SCTE-35 specification. Values must be between 0 and 256, inclusive. The default value is 48.
     */
    SegmentationTypeId?: Integer;
    /**
     * The Upid to assign to the segmentation_descriptor.segmentation_upid message, as defined in section 10.3.3.1 of the 2022 SCTE-35 specification. The value must be a hexadecimal string containing only the characters 0 though 9 and A through F. The default value is "" (an empty string).
     */
    SegmentationUpid?: String;
    /**
     * The Upid Type to assign to the segmentation_descriptor.segmentation_upid_type message, as defined in section 10.3.3.1 of the 2022 SCTE-35 specification. Values must be between 0 and 256, inclusive. The default value is 14.
     */
    SegmentationUpidType?: Integer;
    /**
     * The number of segments expected, which is assigned to the segmentation_descriptor.segments_expectedS message, as defined in section 10.3.3.1 of the 2022 SCTE-35 specification Values must be between 0 and 256, inclusive. The default value is 0.
     */
    SegmentsExpected?: Integer;
    /**
     * The sub-segment number to assign to the segmentation_descriptor.sub_segment_num message, as defined in section 10.3.3.1 of the 2022 SCTE-35 specification. Values must be between 0 and 256, inclusive. The defualt value is null.
     */
    SubSegmentNum?: Integer;
    /**
     * The number of sub-segments expected, which is assigned to the segmentation_descriptor.sub_segments_expected message, as defined in section 10.3.3.1 of the 2022 SCTE-35 specification. Values must be between 0 and 256, inclusive. The default value is null.
     */
    SubSegmentsExpected?: Integer;
  }
  export type SegmentationDescriptorList = SegmentationDescriptor[];
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
     * The segment delivery configurations for the source location.
     */
    SegmentDeliveryConfigurations?: __listOfSegmentDeliveryConfiguration;
    /**
     * The name of the source location.
     */
    SourceLocationName: __string;
    /**
     * The tags assigned to the source location. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
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
     * The name of the channel.
     */
    ChannelName: __string;
  }
  export interface StartChannelResponse {
  }
  export interface StopChannelRequest {
    /**
     * The name of the channel.
     */
    ChannelName: __string;
  }
  export interface StopChannelResponse {
  }
  export type String = string;
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) associated with the resource.
     */
    ResourceArn: __string;
    /**
     * The tags to assign to the resource. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags: __mapOf__string;
  }
  export type Tier = "BASIC"|"STANDARD"|string;
  export interface TimeSignalMessage {
    /**
     * The configurations for the SCTE-35 segmentation_descriptor message(s) sent with the time_signal message.
     */
    SegmentationDescriptors?: SegmentationDescriptorList;
  }
  export interface Transition {
    /**
     * The duration of the live program in seconds.
     */
    DurationMillis?: __long;
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
     * Defines when the program plays in the schedule. You can set the value to ABSOLUTE or RELATIVE.  ABSOLUTE - The program plays at a specific wall clock time. This setting can only be used for channels using the LINEAR PlaybackMode. Note the following considerations when using ABSOLUTE transitions: If the preceding program in the schedule has a duration that extends past the wall clock time, MediaTailor truncates the preceding program on a common segment boundary. If there are gaps in playback, MediaTailor plays the FillerSlate you configured for your linear channel.  RELATIVE - The program is inserted into the schedule either before or after a program that you specify via RelativePosition.
     */
    Type: __string;
  }
  export type Type = "DASH"|"HLS"|string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to untag.
     */
    ResourceArn: __string;
    /**
     * The tag keys associated with the resource.
     */
    TagKeys: __listOf__string;
  }
  export interface UpdateChannelRequest {
    /**
     * The name of the channel.
     */
    ChannelName: __string;
    /**
     * The slate used to fill gaps between programs in the schedule. You must configure filler slate if your channel uses the LINEAR PlaybackMode. MediaTailor doesn't support filler slate for channels using the LOOP PlaybackMode.
     */
    FillerSlate?: SlateSource;
    /**
     * The channel's output properties.
     */
    Outputs: RequestOutputs;
  }
  export interface UpdateChannelResponse {
    /**
     * The Amazon Resource Name (ARN) associated with the channel.
     */
    Arn?: __string;
    /**
     * The name of the channel.
     */
    ChannelName?: __string;
    /**
     * Returns the state whether the channel is running or not.
     */
    ChannelState?: ChannelState;
    /**
     * The timestamp of when the channel was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The slate used to fill gaps between programs in the schedule. You must configure filler slate if your channel uses the LINEAR PlaybackMode. MediaTailor doesn't support filler slate for channels using the LOOP PlaybackMode.
     */
    FillerSlate?: SlateSource;
    /**
     * The timestamp that indicates when the channel was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The channel's output properties.
     */
    Outputs?: ResponseOutputs;
    /**
     * The type of playback mode for this channel.  LINEAR - Programs play back-to-back only once.  LOOP - Programs play back-to-back in an endless loop. When the last program in the schedule plays, playback loops back to the first program in the schedule.
     */
    PlaybackMode?: __string;
    /**
     * The tags to assign to the channel. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
    /**
     * The tier associated with this Channel.
     */
    Tier?: __string;
  }
  export interface UpdateLiveSourceRequest {
    /**
     * A list of HTTP package configurations for the live source on this account.
     */
    HttpPackageConfigurations: HttpPackageConfigurations;
    /**
     * The name of the live source.
     */
    LiveSourceName: __string;
    /**
     * The name of the source location associated with this Live Source.
     */
    SourceLocationName: __string;
  }
  export interface UpdateLiveSourceResponse {
    /**
     * The Amazon Resource Name (ARN) associated with this live source.
     */
    Arn?: __string;
    /**
     * The timestamp that indicates when the live source was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * A list of HTTP package configurations for the live source on this account.
     */
    HttpPackageConfigurations?: HttpPackageConfigurations;
    /**
     * The timestamp that indicates when the live source was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name of the live source.
     */
    LiveSourceName?: __string;
    /**
     * The name of the source location associated with the live source.
     */
    SourceLocationName?: __string;
    /**
     * The tags to assign to the live source. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
  }
  export interface UpdateProgramRequest {
    /**
     * The ad break configuration settings.
     */
    AdBreaks?: __listOfAdBreak;
    /**
     * The name of the channel for this Program.
     */
    ChannelName: __string;
    /**
     * The name of the Program.
     */
    ProgramName: __string;
    /**
     * The schedule configuration settings.
     */
    ScheduleConfiguration: UpdateProgramScheduleConfiguration;
  }
  export interface UpdateProgramResponse {
    /**
     * The ad break configuration settings.
     */
    AdBreaks?: __listOfAdBreak;
    /**
     * The ARN to assign to the program.
     */
    Arn?: __string;
    /**
     * The name to assign to the channel for this program.
     */
    ChannelName?: __string;
    /**
     * The clip range configuration settings.
     */
    ClipRange?: ClipRange;
    /**
     * The time the program was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The duration of the live program in milliseconds.
     */
    DurationMillis?: __long;
    /**
     * The name of the LiveSource for this Program.
     */
    LiveSourceName?: __string;
    /**
     * The name to assign to this program.
     */
    ProgramName?: __string;
    /**
     * The scheduled start time for this Program.
     */
    ScheduledStartTime?: __timestampUnix;
    /**
     * The name to assign to the source location for this program.
     */
    SourceLocationName?: __string;
    /**
     * The name that's used to refer to a VOD source.
     */
    VodSourceName?: __string;
  }
  export interface UpdateProgramScheduleConfiguration {
    /**
     * Program clip range configuration.
     */
    ClipRange?: ClipRange;
    /**
     * Program transition configuration.
     */
    Transition?: UpdateProgramTransition;
  }
  export interface UpdateProgramTransition {
    /**
     * The duration of the live program in seconds.
     */
    DurationMillis?: __long;
    /**
     * The date and time that the program is scheduled to start, in epoch milliseconds.
     */
    ScheduledStartTimeMillis?: __long;
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
     * A list of the segment delivery configurations associated with this resource.
     */
    SegmentDeliveryConfigurations?: __listOfSegmentDeliveryConfiguration;
    /**
     * The name of the source location.
     */
    SourceLocationName: __string;
  }
  export interface UpdateSourceLocationResponse {
    /**
     * Access configuration parameters. Configures the type of authentication used to access content from your source location.
     */
    AccessConfiguration?: AccessConfiguration;
    /**
     * The Amazon Resource Name (ARN) associated with the source location.
     */
    Arn?: __string;
    /**
     * The timestamp that indicates when the source location was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * The optional configuration for the host server that serves segments.
     */
    DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
    /**
     * The HTTP configuration for the source location.
     */
    HttpConfiguration?: HttpConfiguration;
    /**
     * The timestamp that indicates when the source location was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The segment delivery configurations for the source location. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
     */
    SegmentDeliveryConfigurations?: __listOfSegmentDeliveryConfiguration;
    /**
     * The name of the source location.
     */
    SourceLocationName?: __string;
    /**
     * The tags to assign to the source location. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
     */
    Tags?: __mapOf__string;
  }
  export interface UpdateVodSourceRequest {
    /**
     * A list of HTTP package configurations for the VOD source on this account.
     */
    HttpPackageConfigurations: HttpPackageConfigurations;
    /**
     * The name of the source location associated with this VOD Source.
     */
    SourceLocationName: __string;
    /**
     * The name of the VOD source.
     */
    VodSourceName: __string;
  }
  export interface UpdateVodSourceResponse {
    /**
     * The Amazon Resource Name (ARN) associated with the VOD source.
     */
    Arn?: __string;
    /**
     * The timestamp that indicates when the VOD source was created.
     */
    CreationTime?: __timestampUnix;
    /**
     * A list of HTTP package configurations for the VOD source on this account.
     */
    HttpPackageConfigurations?: HttpPackageConfigurations;
    /**
     * The timestamp that indicates when the VOD source was last modified.
     */
    LastModifiedTime?: __timestampUnix;
    /**
     * The name of the source location associated with the VOD source.
     */
    SourceLocationName?: __string;
    /**
     * The tags to assign to the VOD source. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
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
     * The tags assigned to the VOD source. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
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
  export type __listOfLiveSource = LiveSource[];
  export type __listOfPlaybackConfiguration = PlaybackConfiguration[];
  export type __listOfPrefetchSchedule = PrefetchSchedule[];
  export type __listOfScheduleAdBreak = ScheduleAdBreak[];
  export type __listOfScheduleEntry = ScheduleEntry[];
  export type __listOfSegmentDeliveryConfiguration = SegmentDeliveryConfiguration[];
  export type __listOfSourceLocation = SourceLocation[];
  export type __listOfVodSource = VodSource[];
  export type __listOf__string = __string[];
  export type __long = number;
  export type __mapOf__string = {[key: string]: __string};
  export type __string = string;
  export type __timestampUnix = Date;
  export type adMarkupTypes = AdMarkupType[];
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
