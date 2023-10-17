import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MediaPackage extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MediaPackage.Types.ClientConfiguration)
  config: Config & MediaPackage.Types.ClientConfiguration;
  /**
   * Changes the Channel's properities to configure log subscription
   */
  configureLogs(params: MediaPackage.Types.ConfigureLogsRequest, callback?: (err: AWSError, data: MediaPackage.Types.ConfigureLogsResponse) => void): Request<MediaPackage.Types.ConfigureLogsResponse, AWSError>;
  /**
   * Changes the Channel's properities to configure log subscription
   */
  configureLogs(callback?: (err: AWSError, data: MediaPackage.Types.ConfigureLogsResponse) => void): Request<MediaPackage.Types.ConfigureLogsResponse, AWSError>;
  /**
   * Creates a new Channel.
   */
  createChannel(params: MediaPackage.Types.CreateChannelRequest, callback?: (err: AWSError, data: MediaPackage.Types.CreateChannelResponse) => void): Request<MediaPackage.Types.CreateChannelResponse, AWSError>;
  /**
   * Creates a new Channel.
   */
  createChannel(callback?: (err: AWSError, data: MediaPackage.Types.CreateChannelResponse) => void): Request<MediaPackage.Types.CreateChannelResponse, AWSError>;
  /**
   * Creates a new HarvestJob record.
   */
  createHarvestJob(params: MediaPackage.Types.CreateHarvestJobRequest, callback?: (err: AWSError, data: MediaPackage.Types.CreateHarvestJobResponse) => void): Request<MediaPackage.Types.CreateHarvestJobResponse, AWSError>;
  /**
   * Creates a new HarvestJob record.
   */
  createHarvestJob(callback?: (err: AWSError, data: MediaPackage.Types.CreateHarvestJobResponse) => void): Request<MediaPackage.Types.CreateHarvestJobResponse, AWSError>;
  /**
   * Creates a new OriginEndpoint record.
   */
  createOriginEndpoint(params: MediaPackage.Types.CreateOriginEndpointRequest, callback?: (err: AWSError, data: MediaPackage.Types.CreateOriginEndpointResponse) => void): Request<MediaPackage.Types.CreateOriginEndpointResponse, AWSError>;
  /**
   * Creates a new OriginEndpoint record.
   */
  createOriginEndpoint(callback?: (err: AWSError, data: MediaPackage.Types.CreateOriginEndpointResponse) => void): Request<MediaPackage.Types.CreateOriginEndpointResponse, AWSError>;
  /**
   * Deletes an existing Channel.
   */
  deleteChannel(params: MediaPackage.Types.DeleteChannelRequest, callback?: (err: AWSError, data: MediaPackage.Types.DeleteChannelResponse) => void): Request<MediaPackage.Types.DeleteChannelResponse, AWSError>;
  /**
   * Deletes an existing Channel.
   */
  deleteChannel(callback?: (err: AWSError, data: MediaPackage.Types.DeleteChannelResponse) => void): Request<MediaPackage.Types.DeleteChannelResponse, AWSError>;
  /**
   * Deletes an existing OriginEndpoint.
   */
  deleteOriginEndpoint(params: MediaPackage.Types.DeleteOriginEndpointRequest, callback?: (err: AWSError, data: MediaPackage.Types.DeleteOriginEndpointResponse) => void): Request<MediaPackage.Types.DeleteOriginEndpointResponse, AWSError>;
  /**
   * Deletes an existing OriginEndpoint.
   */
  deleteOriginEndpoint(callback?: (err: AWSError, data: MediaPackage.Types.DeleteOriginEndpointResponse) => void): Request<MediaPackage.Types.DeleteOriginEndpointResponse, AWSError>;
  /**
   * Gets details about a Channel.
   */
  describeChannel(params: MediaPackage.Types.DescribeChannelRequest, callback?: (err: AWSError, data: MediaPackage.Types.DescribeChannelResponse) => void): Request<MediaPackage.Types.DescribeChannelResponse, AWSError>;
  /**
   * Gets details about a Channel.
   */
  describeChannel(callback?: (err: AWSError, data: MediaPackage.Types.DescribeChannelResponse) => void): Request<MediaPackage.Types.DescribeChannelResponse, AWSError>;
  /**
   * Gets details about an existing HarvestJob.
   */
  describeHarvestJob(params: MediaPackage.Types.DescribeHarvestJobRequest, callback?: (err: AWSError, data: MediaPackage.Types.DescribeHarvestJobResponse) => void): Request<MediaPackage.Types.DescribeHarvestJobResponse, AWSError>;
  /**
   * Gets details about an existing HarvestJob.
   */
  describeHarvestJob(callback?: (err: AWSError, data: MediaPackage.Types.DescribeHarvestJobResponse) => void): Request<MediaPackage.Types.DescribeHarvestJobResponse, AWSError>;
  /**
   * Gets details about an existing OriginEndpoint.
   */
  describeOriginEndpoint(params: MediaPackage.Types.DescribeOriginEndpointRequest, callback?: (err: AWSError, data: MediaPackage.Types.DescribeOriginEndpointResponse) => void): Request<MediaPackage.Types.DescribeOriginEndpointResponse, AWSError>;
  /**
   * Gets details about an existing OriginEndpoint.
   */
  describeOriginEndpoint(callback?: (err: AWSError, data: MediaPackage.Types.DescribeOriginEndpointResponse) => void): Request<MediaPackage.Types.DescribeOriginEndpointResponse, AWSError>;
  /**
   * Returns a collection of Channels.
   */
  listChannels(params: MediaPackage.Types.ListChannelsRequest, callback?: (err: AWSError, data: MediaPackage.Types.ListChannelsResponse) => void): Request<MediaPackage.Types.ListChannelsResponse, AWSError>;
  /**
   * Returns a collection of Channels.
   */
  listChannels(callback?: (err: AWSError, data: MediaPackage.Types.ListChannelsResponse) => void): Request<MediaPackage.Types.ListChannelsResponse, AWSError>;
  /**
   * Returns a collection of HarvestJob records.
   */
  listHarvestJobs(params: MediaPackage.Types.ListHarvestJobsRequest, callback?: (err: AWSError, data: MediaPackage.Types.ListHarvestJobsResponse) => void): Request<MediaPackage.Types.ListHarvestJobsResponse, AWSError>;
  /**
   * Returns a collection of HarvestJob records.
   */
  listHarvestJobs(callback?: (err: AWSError, data: MediaPackage.Types.ListHarvestJobsResponse) => void): Request<MediaPackage.Types.ListHarvestJobsResponse, AWSError>;
  /**
   * Returns a collection of OriginEndpoint records.
   */
  listOriginEndpoints(params: MediaPackage.Types.ListOriginEndpointsRequest, callback?: (err: AWSError, data: MediaPackage.Types.ListOriginEndpointsResponse) => void): Request<MediaPackage.Types.ListOriginEndpointsResponse, AWSError>;
  /**
   * Returns a collection of OriginEndpoint records.
   */
  listOriginEndpoints(callback?: (err: AWSError, data: MediaPackage.Types.ListOriginEndpointsResponse) => void): Request<MediaPackage.Types.ListOriginEndpointsResponse, AWSError>;
  /**
   * 
   */
  listTagsForResource(params: MediaPackage.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: MediaPackage.Types.ListTagsForResourceResponse) => void): Request<MediaPackage.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * 
   */
  listTagsForResource(callback?: (err: AWSError, data: MediaPackage.Types.ListTagsForResourceResponse) => void): Request<MediaPackage.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Changes the Channel's first IngestEndpoint's username and password. WARNING - This API is deprecated. Please use RotateIngestEndpointCredentials instead
   */
  rotateChannelCredentials(params: MediaPackage.Types.RotateChannelCredentialsRequest, callback?: (err: AWSError, data: MediaPackage.Types.RotateChannelCredentialsResponse) => void): Request<MediaPackage.Types.RotateChannelCredentialsResponse, AWSError>;
  /**
   * Changes the Channel's first IngestEndpoint's username and password. WARNING - This API is deprecated. Please use RotateIngestEndpointCredentials instead
   */
  rotateChannelCredentials(callback?: (err: AWSError, data: MediaPackage.Types.RotateChannelCredentialsResponse) => void): Request<MediaPackage.Types.RotateChannelCredentialsResponse, AWSError>;
  /**
   * Rotate the IngestEndpoint's username and password, as specified by the IngestEndpoint's id.
   */
  rotateIngestEndpointCredentials(params: MediaPackage.Types.RotateIngestEndpointCredentialsRequest, callback?: (err: AWSError, data: MediaPackage.Types.RotateIngestEndpointCredentialsResponse) => void): Request<MediaPackage.Types.RotateIngestEndpointCredentialsResponse, AWSError>;
  /**
   * Rotate the IngestEndpoint's username and password, as specified by the IngestEndpoint's id.
   */
  rotateIngestEndpointCredentials(callback?: (err: AWSError, data: MediaPackage.Types.RotateIngestEndpointCredentialsResponse) => void): Request<MediaPackage.Types.RotateIngestEndpointCredentialsResponse, AWSError>;
  /**
   * 
   */
  tagResource(params: MediaPackage.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * 
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * 
   */
  untagResource(params: MediaPackage.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * 
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an existing Channel.
   */
  updateChannel(params: MediaPackage.Types.UpdateChannelRequest, callback?: (err: AWSError, data: MediaPackage.Types.UpdateChannelResponse) => void): Request<MediaPackage.Types.UpdateChannelResponse, AWSError>;
  /**
   * Updates an existing Channel.
   */
  updateChannel(callback?: (err: AWSError, data: MediaPackage.Types.UpdateChannelResponse) => void): Request<MediaPackage.Types.UpdateChannelResponse, AWSError>;
  /**
   * Updates an existing OriginEndpoint.
   */
  updateOriginEndpoint(params: MediaPackage.Types.UpdateOriginEndpointRequest, callback?: (err: AWSError, data: MediaPackage.Types.UpdateOriginEndpointResponse) => void): Request<MediaPackage.Types.UpdateOriginEndpointResponse, AWSError>;
  /**
   * Updates an existing OriginEndpoint.
   */
  updateOriginEndpoint(callback?: (err: AWSError, data: MediaPackage.Types.UpdateOriginEndpointResponse) => void): Request<MediaPackage.Types.UpdateOriginEndpointResponse, AWSError>;
}
declare namespace MediaPackage {
  export type AdMarkers = "NONE"|"SCTE35_ENHANCED"|"PASSTHROUGH"|"DATERANGE"|string;
  export type AdTriggers = __AdTriggersElement[];
  export type AdsOnDeliveryRestrictions = "NONE"|"RESTRICTED"|"UNRESTRICTED"|"BOTH"|string;
  export interface Authorization {
    /**
     * The Amazon Resource Name (ARN) for the secret in Secrets Manager that your Content Distribution Network (CDN) uses for authorization to access your endpoint.

     */
    CdnIdentifierSecret: __string;
    /**
     * The Amazon Resource Name (ARN) for the IAM role that allows MediaPackage to communicate with AWS Secrets Manager.

     */
    SecretsRoleArn: __string;
  }
  export interface Channel {
    /**
     * The Amazon Resource Name (ARN) assigned to the Channel.
     */
    Arn?: __string;
    /**
     * The date and time the Channel was created.
     */
    CreatedAt?: __string;
    /**
     * A short text description of the Channel.
     */
    Description?: __string;
    EgressAccessLogs?: EgressAccessLogs;
    HlsIngest?: HlsIngest;
    /**
     * The ID of the Channel.
     */
    Id?: __string;
    IngressAccessLogs?: IngressAccessLogs;
    Tags?: Tags;
  }
  export interface CmafEncryption {
    /**
     * An optional 128-bit, 16-byte hex value represented by a 32-character string, used in conjunction with the key for encrypting blocks. If you don't specify a value, then MediaPackage creates the constant initialization vector (IV).
     */
    ConstantInitializationVector?: __string;
    EncryptionMethod?: CmafEncryptionMethod;
    /**
     * Time (in seconds) between each encryption key rotation.
     */
    KeyRotationIntervalSeconds?: __integer;
    SpekeKeyProvider: SpekeKeyProvider;
  }
  export type CmafEncryptionMethod = "SAMPLE_AES"|"AES_CTR"|string;
  export interface CmafPackage {
    Encryption?: CmafEncryption;
    /**
     * A list of HLS manifest configurations
     */
    HlsManifests?: __listOfHlsManifest;
    /**
     * Duration (in seconds) of each segment. Actual segments will be
rounded to the nearest multiple of the source segment duration.

     */
    SegmentDurationSeconds?: __integer;
    /**
     * An optional custom string that is prepended to the name of each segment. If not specified, it defaults to the ChannelId.
     */
    SegmentPrefix?: __string;
    StreamSelection?: StreamSelection;
  }
  export interface CmafPackageCreateOrUpdateParameters {
    Encryption?: CmafEncryption;
    /**
     * A list of HLS manifest configurations
     */
    HlsManifests?: __listOfHlsManifestCreateOrUpdateParameters;
    /**
     * Duration (in seconds) of each segment. Actual segments will be
rounded to the nearest multiple of the source segment duration.

     */
    SegmentDurationSeconds?: __integer;
    /**
     * An optional custom string that is prepended to the name of each segment. If not specified, it defaults to the ChannelId.
     */
    SegmentPrefix?: __string;
    StreamSelection?: StreamSelection;
  }
  export interface ConfigureLogsRequest {
    EgressAccessLogs?: EgressAccessLogs;
    /**
     * The ID of the channel to log subscription.
     */
    Id: __string;
    IngressAccessLogs?: IngressAccessLogs;
  }
  export interface ConfigureLogsResponse {
    /**
     * The Amazon Resource Name (ARN) assigned to the Channel.
     */
    Arn?: __string;
    /**
     * The date and time the Channel was created.
     */
    CreatedAt?: __string;
    /**
     * A short text description of the Channel.
     */
    Description?: __string;
    EgressAccessLogs?: EgressAccessLogs;
    HlsIngest?: HlsIngest;
    /**
     * The ID of the Channel.
     */
    Id?: __string;
    IngressAccessLogs?: IngressAccessLogs;
    Tags?: Tags;
  }
  export interface CreateChannelRequest {
    /**
     * A short text description of the Channel.
     */
    Description?: __string;
    /**
     * The ID of the Channel. The ID must be unique within the region and it
cannot be changed after a Channel is created.

     */
    Id: __string;
    Tags?: Tags;
  }
  export interface CreateChannelResponse {
    /**
     * The Amazon Resource Name (ARN) assigned to the Channel.
     */
    Arn?: __string;
    /**
     * The date and time the Channel was created.
     */
    CreatedAt?: __string;
    /**
     * A short text description of the Channel.
     */
    Description?: __string;
    EgressAccessLogs?: EgressAccessLogs;
    HlsIngest?: HlsIngest;
    /**
     * The ID of the Channel.
     */
    Id?: __string;
    IngressAccessLogs?: IngressAccessLogs;
    Tags?: Tags;
  }
  export interface CreateHarvestJobRequest {
    /**
     * The end of the time-window which will be harvested

     */
    EndTime: __string;
    /**
     * The ID of the HarvestJob. The ID must be unique within the region
and it cannot be changed after the HarvestJob is submitted

     */
    Id: __string;
    /**
     * The ID of the OriginEndpoint that the HarvestJob will harvest from.
This cannot be changed after the HarvestJob is submitted.

     */
    OriginEndpointId: __string;
    S3Destination: S3Destination;
    /**
     * The start of the time-window which will be harvested

     */
    StartTime: __string;
  }
  export interface CreateHarvestJobResponse {
    /**
     * The Amazon Resource Name (ARN) assigned to the HarvestJob.

     */
    Arn?: __string;
    /**
     * The ID of the Channel that the HarvestJob will harvest from.

     */
    ChannelId?: __string;
    /**
     * The date and time the HarvestJob was submitted.

     */
    CreatedAt?: __string;
    /**
     * The end of the time-window which will be harvested.

     */
    EndTime?: __string;
    /**
     * The ID of the HarvestJob. The ID must be unique within the region
and it cannot be changed after the HarvestJob is submitted.

     */
    Id?: __string;
    /**
     * The ID of the OriginEndpoint that the HarvestJob will harvest from.
This cannot be changed after the HarvestJob is submitted.

     */
    OriginEndpointId?: __string;
    S3Destination?: S3Destination;
    /**
     * The start of the time-window which will be harvested.

     */
    StartTime?: __string;
    /**
     * The current status of the HarvestJob. Consider setting up a CloudWatch Event to listen for
HarvestJobs as they succeed or fail. In the event of failure, the CloudWatch Event will
include an explanation of why the HarvestJob failed.

     */
    Status?: Status;
  }
  export interface CreateOriginEndpointRequest {
    Authorization?: Authorization;
    /**
     * The ID of the Channel that the OriginEndpoint will be associated with.
This cannot be changed after the OriginEndpoint is created.

     */
    ChannelId: __string;
    CmafPackage?: CmafPackageCreateOrUpdateParameters;
    DashPackage?: DashPackage;
    /**
     * A short text description of the OriginEndpoint.
     */
    Description?: __string;
    HlsPackage?: HlsPackage;
    /**
     * The ID of the OriginEndpoint.  The ID must be unique within the region
and it cannot be changed after the OriginEndpoint is created.

     */
    Id: __string;
    /**
     * A short string that will be used as the filename of the OriginEndpoint URL (defaults to "index").
     */
    ManifestName?: __string;
    MssPackage?: MssPackage;
    /**
     * Control whether origination of video is allowed for this OriginEndpoint. If set to ALLOW, the OriginEndpoint
may by requested, pursuant to any other form of access control. If set to DENY, the OriginEndpoint may not be
requested. This can be helpful for Live to VOD harvesting, or for temporarily disabling origination

     */
    Origination?: Origination;
    /**
     * Maximum duration (seconds) of content to retain for startover playback.
If not specified, startover playback will be disabled for the OriginEndpoint.

     */
    StartoverWindowSeconds?: __integer;
    Tags?: Tags;
    /**
     * Amount of delay (seconds) to enforce on the playback of live content.
If not specified, there will be no time delay in effect for the OriginEndpoint.

     */
    TimeDelaySeconds?: __integer;
    /**
     * A list of source IP CIDR blocks that will be allowed to access the OriginEndpoint.
     */
    Whitelist?: __listOf__string;
  }
  export interface CreateOriginEndpointResponse {
    /**
     * The Amazon Resource Name (ARN) assigned to the OriginEndpoint.
     */
    Arn?: __string;
    Authorization?: Authorization;
    /**
     * The ID of the Channel the OriginEndpoint is associated with.
     */
    ChannelId?: __string;
    CmafPackage?: CmafPackage;
    /**
     * The date and time the OriginEndpoint was created.
     */
    CreatedAt?: __string;
    DashPackage?: DashPackage;
    /**
     * A short text description of the OriginEndpoint.
     */
    Description?: __string;
    HlsPackage?: HlsPackage;
    /**
     * The ID of the OriginEndpoint.
     */
    Id?: __string;
    /**
     * A short string appended to the end of the OriginEndpoint URL.
     */
    ManifestName?: __string;
    MssPackage?: MssPackage;
    /**
     * Control whether origination of video is allowed for this OriginEndpoint. If set to ALLOW, the OriginEndpoint
may by requested, pursuant to any other form of access control. If set to DENY, the OriginEndpoint may not be
requested. This can be helpful for Live to VOD harvesting, or for temporarily disabling origination

     */
    Origination?: Origination;
    /**
     * Maximum duration (seconds) of content to retain for startover playback.
If not specified, startover playback will be disabled for the OriginEndpoint.

     */
    StartoverWindowSeconds?: __integer;
    Tags?: Tags;
    /**
     * Amount of delay (seconds) to enforce on the playback of live content.
If not specified, there will be no time delay in effect for the OriginEndpoint.

     */
    TimeDelaySeconds?: __integer;
    /**
     * The URL of the packaged OriginEndpoint for consumption.
     */
    Url?: __string;
    /**
     * A list of source IP CIDR blocks that will be allowed to access the OriginEndpoint.
     */
    Whitelist?: __listOf__string;
  }
  export interface DashEncryption {
    /**
     * Time (in seconds) between each encryption key rotation.
     */
    KeyRotationIntervalSeconds?: __integer;
    SpekeKeyProvider: SpekeKeyProvider;
  }
  export interface DashPackage {
    AdTriggers?: AdTriggers;
    AdsOnDeliveryRestrictions?: AdsOnDeliveryRestrictions;
    Encryption?: DashEncryption;
    /**
     * When enabled, an I-Frame only stream will be included in the output.
     */
    IncludeIframeOnlyStream?: __boolean;
    /**
     * Determines the position of some tags in the Media Presentation Description (MPD).  When set to FULL, elements like SegmentTemplate and ContentProtection are included in each Representation.  When set to COMPACT, duplicate elements are combined and presented at the AdaptationSet level.
     */
    ManifestLayout?: ManifestLayout;
    /**
     * Time window (in seconds) contained in each manifest.
     */
    ManifestWindowSeconds?: __integer;
    /**
     * Minimum duration (in seconds) that a player will buffer media before starting the presentation.
     */
    MinBufferTimeSeconds?: __integer;
    /**
     * Minimum duration (in seconds) between potential changes to the Dynamic Adaptive Streaming over HTTP (DASH) Media Presentation Description (MPD).
     */
    MinUpdatePeriodSeconds?: __integer;
    /**
     * A list of triggers that controls when the outgoing Dynamic Adaptive Streaming over HTTP (DASH)
Media Presentation Description (MPD) will be partitioned into multiple periods. If empty, the content will not
be partitioned into more than one period. If the list contains "ADS", new periods will be created where
the Channel source contains SCTE-35 ad markers.

     */
    PeriodTriggers?: __listOf__PeriodTriggersElement;
    /**
     * The Dynamic Adaptive Streaming over HTTP (DASH) profile type.  When set to "HBBTV_1_5", HbbTV 1.5 compliant output is enabled. When set to "DVB-DASH_2014", DVB-DASH 2014 compliant output is enabled.
     */
    Profile?: Profile;
    /**
     * Duration (in seconds) of each segment. Actual segments will be
rounded to the nearest multiple of the source segment duration.

     */
    SegmentDurationSeconds?: __integer;
    /**
     * Determines the type of SegmentTemplate included in the Media Presentation Description (MPD).  When set to NUMBER_WITH_TIMELINE, a full timeline is presented in each SegmentTemplate, with $Number$ media URLs.  When set to TIME_WITH_TIMELINE, a full timeline is presented in each SegmentTemplate, with $Time$ media URLs. When set to NUMBER_WITH_DURATION, only a duration is included in each SegmentTemplate, with $Number$ media URLs.
     */
    SegmentTemplateFormat?: SegmentTemplateFormat;
    StreamSelection?: StreamSelection;
    /**
     * Duration (in seconds) to delay live content before presentation.
     */
    SuggestedPresentationDelaySeconds?: __integer;
    /**
     * Determines the type of UTCTiming included in the Media Presentation Description (MPD)
     */
    UtcTiming?: UtcTiming;
    /**
     * Specifies the value attribute of the UTCTiming field when utcTiming is set to HTTP-ISO, HTTP-HEAD or HTTP-XSDATE
     */
    UtcTimingUri?: __string;
  }
  export interface DeleteChannelRequest {
    /**
     * The ID of the Channel to delete.
     */
    Id: __string;
  }
  export interface DeleteChannelResponse {
  }
  export interface DeleteOriginEndpointRequest {
    /**
     * The ID of the OriginEndpoint to delete.
     */
    Id: __string;
  }
  export interface DeleteOriginEndpointResponse {
  }
  export interface DescribeChannelRequest {
    /**
     * The ID of a Channel.
     */
    Id: __string;
  }
  export interface DescribeChannelResponse {
    /**
     * The Amazon Resource Name (ARN) assigned to the Channel.
     */
    Arn?: __string;
    /**
     * The date and time the Channel was created.
     */
    CreatedAt?: __string;
    /**
     * A short text description of the Channel.
     */
    Description?: __string;
    EgressAccessLogs?: EgressAccessLogs;
    HlsIngest?: HlsIngest;
    /**
     * The ID of the Channel.
     */
    Id?: __string;
    IngressAccessLogs?: IngressAccessLogs;
    Tags?: Tags;
  }
  export interface DescribeHarvestJobRequest {
    /**
     * The ID of the HarvestJob.
     */
    Id: __string;
  }
  export interface DescribeHarvestJobResponse {
    /**
     * The Amazon Resource Name (ARN) assigned to the HarvestJob.

     */
    Arn?: __string;
    /**
     * The ID of the Channel that the HarvestJob will harvest from.

     */
    ChannelId?: __string;
    /**
     * The date and time the HarvestJob was submitted.

     */
    CreatedAt?: __string;
    /**
     * The end of the time-window which will be harvested.

     */
    EndTime?: __string;
    /**
     * The ID of the HarvestJob. The ID must be unique within the region
and it cannot be changed after the HarvestJob is submitted.

     */
    Id?: __string;
    /**
     * The ID of the OriginEndpoint that the HarvestJob will harvest from.
This cannot be changed after the HarvestJob is submitted.

     */
    OriginEndpointId?: __string;
    S3Destination?: S3Destination;
    /**
     * The start of the time-window which will be harvested.

     */
    StartTime?: __string;
    /**
     * The current status of the HarvestJob. Consider setting up a CloudWatch Event to listen for
HarvestJobs as they succeed or fail. In the event of failure, the CloudWatch Event will
include an explanation of why the HarvestJob failed.

     */
    Status?: Status;
  }
  export interface DescribeOriginEndpointRequest {
    /**
     * The ID of the OriginEndpoint.
     */
    Id: __string;
  }
  export interface DescribeOriginEndpointResponse {
    /**
     * The Amazon Resource Name (ARN) assigned to the OriginEndpoint.
     */
    Arn?: __string;
    Authorization?: Authorization;
    /**
     * The ID of the Channel the OriginEndpoint is associated with.
     */
    ChannelId?: __string;
    CmafPackage?: CmafPackage;
    /**
     * The date and time the OriginEndpoint was created.
     */
    CreatedAt?: __string;
    DashPackage?: DashPackage;
    /**
     * A short text description of the OriginEndpoint.
     */
    Description?: __string;
    HlsPackage?: HlsPackage;
    /**
     * The ID of the OriginEndpoint.
     */
    Id?: __string;
    /**
     * A short string appended to the end of the OriginEndpoint URL.
     */
    ManifestName?: __string;
    MssPackage?: MssPackage;
    /**
     * Control whether origination of video is allowed for this OriginEndpoint. If set to ALLOW, the OriginEndpoint
may by requested, pursuant to any other form of access control. If set to DENY, the OriginEndpoint may not be
requested. This can be helpful for Live to VOD harvesting, or for temporarily disabling origination

     */
    Origination?: Origination;
    /**
     * Maximum duration (seconds) of content to retain for startover playback.
If not specified, startover playback will be disabled for the OriginEndpoint.

     */
    StartoverWindowSeconds?: __integer;
    Tags?: Tags;
    /**
     * Amount of delay (seconds) to enforce on the playback of live content.
If not specified, there will be no time delay in effect for the OriginEndpoint.

     */
    TimeDelaySeconds?: __integer;
    /**
     * The URL of the packaged OriginEndpoint for consumption.
     */
    Url?: __string;
    /**
     * A list of source IP CIDR blocks that will be allowed to access the OriginEndpoint.
     */
    Whitelist?: __listOf__string;
  }
  export interface EgressAccessLogs {
    /**
     * Customize the log group name.
     */
    LogGroupName?: __string;
  }
  export interface EncryptionContractConfiguration {
    /**
     * A collection of audio encryption presets.
     */
    PresetSpeke20Audio: PresetSpeke20Audio;
    /**
     * A collection of video encryption presets.
     */
    PresetSpeke20Video: PresetSpeke20Video;
  }
  export type EncryptionMethod = "AES_128"|"SAMPLE_AES"|string;
  export interface HarvestJob {
    /**
     * The Amazon Resource Name (ARN) assigned to the HarvestJob.

     */
    Arn?: __string;
    /**
     * The ID of the Channel that the HarvestJob will harvest from.

     */
    ChannelId?: __string;
    /**
     * The date and time the HarvestJob was submitted.

     */
    CreatedAt?: __string;
    /**
     * The end of the time-window which will be harvested.

     */
    EndTime?: __string;
    /**
     * The ID of the HarvestJob. The ID must be unique within the region
and it cannot be changed after the HarvestJob is submitted.

     */
    Id?: __string;
    /**
     * The ID of the OriginEndpoint that the HarvestJob will harvest from.
This cannot be changed after the HarvestJob is submitted.

     */
    OriginEndpointId?: __string;
    S3Destination?: S3Destination;
    /**
     * The start of the time-window which will be harvested.

     */
    StartTime?: __string;
    /**
     * The current status of the HarvestJob. Consider setting up a CloudWatch Event to listen for
HarvestJobs as they succeed or fail. In the event of failure, the CloudWatch Event will
include an explanation of why the HarvestJob failed.

     */
    Status?: Status;
  }
  export interface HlsEncryption {
    /**
     * A constant initialization vector for encryption (optional).
When not specified the initialization vector will be periodically rotated.

     */
    ConstantInitializationVector?: __string;
    /**
     * The encryption method to use.
     */
    EncryptionMethod?: EncryptionMethod;
    /**
     * Interval (in seconds) between each encryption key rotation.
     */
    KeyRotationIntervalSeconds?: __integer;
    /**
     * When enabled, the EXT-X-KEY tag will be repeated in output manifests.
     */
    RepeatExtXKey?: __boolean;
    SpekeKeyProvider: SpekeKeyProvider;
  }
  export interface HlsIngest {
    /**
     * A list of endpoints to which the source stream should be sent.
     */
    IngestEndpoints?: __listOfIngestEndpoint;
  }
  export interface HlsManifest {
    /**
     * This setting controls how ad markers are included in the packaged OriginEndpoint.
"NONE" will omit all SCTE-35 ad markers from the output.
"PASSTHROUGH" causes the manifest to contain a copy of the SCTE-35 ad
markers (comments) taken directly from the input HTTP Live Streaming (HLS) manifest.
"SCTE35_ENHANCED" generates ad markers and blackout tags based on SCTE-35
messages in the input source.
"DATERANGE" inserts EXT-X-DATERANGE tags to signal ad and program transition events 
in HLS and CMAF manifests. For this option, you must set a programDateTimeIntervalSeconds value 
that is greater than 0.

     */
    AdMarkers?: AdMarkers;
    /**
     * The ID of the manifest. The ID must be unique within the OriginEndpoint and it cannot be changed after it is created.
     */
    Id: __string;
    /**
     * When enabled, an I-Frame only stream will be included in the output.
     */
    IncludeIframeOnlyStream?: __boolean;
    /**
     * An optional short string appended to the end of the OriginEndpoint URL. If not specified, defaults to the manifestName for the OriginEndpoint.
     */
    ManifestName?: __string;
    /**
     * The HTTP Live Streaming (HLS) playlist type.
When either "EVENT" or "VOD" is specified, a corresponding EXT-X-PLAYLIST-TYPE
entry will be included in the media playlist.

     */
    PlaylistType?: PlaylistType;
    /**
     * Time window (in seconds) contained in each parent manifest.
     */
    PlaylistWindowSeconds?: __integer;
    /**
     * The interval (in seconds) between each EXT-X-PROGRAM-DATE-TIME tag
inserted into manifests. Additionally, when an interval is specified
ID3Timed Metadata messages will be generated every 5 seconds using the
ingest time of the content.
If the interval is not specified, or set to 0, then
no EXT-X-PROGRAM-DATE-TIME tags will be inserted into manifests and no
ID3Timed Metadata messages will be generated. Note that irrespective
of this parameter, if any ID3 Timed Metadata is found in HTTP Live Streaming (HLS) input,
it will be passed through to HLS output.

     */
    ProgramDateTimeIntervalSeconds?: __integer;
    /**
     * The URL of the packaged OriginEndpoint for consumption.
     */
    Url?: __string;
    AdTriggers?: AdTriggers;
    AdsOnDeliveryRestrictions?: AdsOnDeliveryRestrictions;
  }
  export interface HlsManifestCreateOrUpdateParameters {
    /**
     * This setting controls how ad markers are included in the packaged OriginEndpoint.
"NONE" will omit all SCTE-35 ad markers from the output.
"PASSTHROUGH" causes the manifest to contain a copy of the SCTE-35 ad
markers (comments) taken directly from the input HTTP Live Streaming (HLS) manifest.
"SCTE35_ENHANCED" generates ad markers and blackout tags based on SCTE-35
messages in the input source.
"DATERANGE" inserts EXT-X-DATERANGE tags to signal ad and program transition events 
in HLS and CMAF manifests. For this option, you must set a programDateTimeIntervalSeconds value 
that is greater than 0.

     */
    AdMarkers?: AdMarkers;
    AdTriggers?: AdTriggers;
    AdsOnDeliveryRestrictions?: AdsOnDeliveryRestrictions;
    /**
     * The ID of the manifest. The ID must be unique within the OriginEndpoint and it cannot be changed after it is created.
     */
    Id: __string;
    /**
     * When enabled, an I-Frame only stream will be included in the output.
     */
    IncludeIframeOnlyStream?: __boolean;
    /**
     * An optional short string appended to the end of the OriginEndpoint URL. If not specified, defaults to the manifestName for the OriginEndpoint.
     */
    ManifestName?: __string;
    /**
     * The HTTP Live Streaming (HLS) playlist type.
When either "EVENT" or "VOD" is specified, a corresponding EXT-X-PLAYLIST-TYPE
entry will be included in the media playlist.

     */
    PlaylistType?: PlaylistType;
    /**
     * Time window (in seconds) contained in each parent manifest.
     */
    PlaylistWindowSeconds?: __integer;
    /**
     * The interval (in seconds) between each EXT-X-PROGRAM-DATE-TIME tag
inserted into manifests. Additionally, when an interval is specified
ID3Timed Metadata messages will be generated every 5 seconds using the
ingest time of the content.
If the interval is not specified, or set to 0, then
no EXT-X-PROGRAM-DATE-TIME tags will be inserted into manifests and no
ID3Timed Metadata messages will be generated. Note that irrespective
of this parameter, if any ID3 Timed Metadata is found in HTTP Live Streaming (HLS) input,
it will be passed through to HLS output.

     */
    ProgramDateTimeIntervalSeconds?: __integer;
  }
  export interface HlsPackage {
    /**
     * This setting controls how ad markers are included in the packaged OriginEndpoint.
"NONE" will omit all SCTE-35 ad markers from the output.
"PASSTHROUGH" causes the manifest to contain a copy of the SCTE-35 ad
markers (comments) taken directly from the input HTTP Live Streaming (HLS) manifest.
"SCTE35_ENHANCED" generates ad markers and blackout tags based on SCTE-35
messages in the input source.
"DATERANGE" inserts EXT-X-DATERANGE tags to signal ad and program transition events 
in HLS and CMAF manifests. For this option, you must set a programDateTimeIntervalSeconds value 
that is greater than 0.

     */
    AdMarkers?: AdMarkers;
    AdTriggers?: AdTriggers;
    AdsOnDeliveryRestrictions?: AdsOnDeliveryRestrictions;
    Encryption?: HlsEncryption;
    /**
     * When enabled, MediaPackage passes through digital video broadcasting (DVB) subtitles into the output.
     */
    IncludeDvbSubtitles?: __boolean;
    /**
     * When enabled, an I-Frame only stream will be included in the output.
     */
    IncludeIframeOnlyStream?: __boolean;
    /**
     * The HTTP Live Streaming (HLS) playlist type.
When either "EVENT" or "VOD" is specified, a corresponding EXT-X-PLAYLIST-TYPE
entry will be included in the media playlist.

     */
    PlaylistType?: PlaylistType;
    /**
     * Time window (in seconds) contained in each parent manifest.
     */
    PlaylistWindowSeconds?: __integer;
    /**
     * The interval (in seconds) between each EXT-X-PROGRAM-DATE-TIME tag
inserted into manifests. Additionally, when an interval is specified
ID3Timed Metadata messages will be generated every 5 seconds using the
ingest time of the content.
If the interval is not specified, or set to 0, then
no EXT-X-PROGRAM-DATE-TIME tags will be inserted into manifests and no
ID3Timed Metadata messages will be generated. Note that irrespective
of this parameter, if any ID3 Timed Metadata is found in HTTP Live Streaming (HLS) input,
it will be passed through to HLS output.

     */
    ProgramDateTimeIntervalSeconds?: __integer;
    /**
     * Duration (in seconds) of each fragment. Actual fragments will be
rounded to the nearest multiple of the source fragment duration.

     */
    SegmentDurationSeconds?: __integer;
    StreamSelection?: StreamSelection;
    /**
     * When enabled, audio streams will be placed in rendition groups in the output.
     */
    UseAudioRenditionGroup?: __boolean;
  }
  export interface IngestEndpoint {
    /**
     * The system generated unique identifier for the IngestEndpoint
     */
    Id?: __string;
    /**
     * The system generated password for ingest authentication.
     */
    Password?: SensitiveString;
    /**
     * The ingest URL to which the source stream should be sent.
     */
    Url?: __string;
    /**
     * The system generated username for ingest authentication.
     */
    Username?: SensitiveString;
  }
  export interface IngressAccessLogs {
    /**
     * Customize the log group name.
     */
    LogGroupName?: __string;
  }
  export interface ListChannelsRequest {
    /**
     * Upper bound on number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
  }
  export interface ListChannelsResponse {
    /**
     * A list of Channel records.
     */
    Channels?: __listOfChannel;
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
  }
  export interface ListHarvestJobsRequest {
    /**
     * When specified, the request will return only HarvestJobs associated with the given Channel ID.
     */
    IncludeChannelId?: __string;
    /**
     * When specified, the request will return only HarvestJobs in the given status.
     */
    IncludeStatus?: __string;
    /**
     * The upper bound on the number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
  }
  export interface ListHarvestJobsResponse {
    /**
     * A list of HarvestJob records.
     */
    HarvestJobs?: __listOfHarvestJob;
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
  }
  export interface ListOriginEndpointsRequest {
    /**
     * When specified, the request will return only OriginEndpoints associated with the given Channel ID.
     */
    ChannelId?: __string;
    /**
     * The upper bound on the number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
  }
  export interface ListOriginEndpointsResponse {
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
    /**
     * A list of OriginEndpoint records.
     */
    OriginEndpoints?: __listOfOriginEndpoint;
  }
  export interface ListTagsForResourceRequest {
    ResourceArn: __string;
  }
  export interface ListTagsForResourceResponse {
    Tags?: __mapOf__string;
  }
  export type ManifestLayout = "FULL"|"COMPACT"|string;
  export type MaxResults = number;
  export interface MssEncryption {
    SpekeKeyProvider: SpekeKeyProvider;
  }
  export interface MssPackage {
    Encryption?: MssEncryption;
    /**
     * The time window (in seconds) contained in each manifest.
     */
    ManifestWindowSeconds?: __integer;
    /**
     * The duration (in seconds) of each segment.
     */
    SegmentDurationSeconds?: __integer;
    StreamSelection?: StreamSelection;
  }
  export interface OriginEndpoint {
    /**
     * The Amazon Resource Name (ARN) assigned to the OriginEndpoint.
     */
    Arn?: __string;
    Authorization?: Authorization;
    /**
     * The ID of the Channel the OriginEndpoint is associated with.
     */
    ChannelId?: __string;
    CmafPackage?: CmafPackage;
    /**
     * The date and time the OriginEndpoint was created.
     */
    CreatedAt?: __string;
    DashPackage?: DashPackage;
    /**
     * A short text description of the OriginEndpoint.
     */
    Description?: __string;
    HlsPackage?: HlsPackage;
    /**
     * The ID of the OriginEndpoint.
     */
    Id?: __string;
    /**
     * A short string appended to the end of the OriginEndpoint URL.
     */
    ManifestName?: __string;
    MssPackage?: MssPackage;
    /**
     * Control whether origination of video is allowed for this OriginEndpoint. If set to ALLOW, the OriginEndpoint
may by requested, pursuant to any other form of access control. If set to DENY, the OriginEndpoint may not be
requested. This can be helpful for Live to VOD harvesting, or for temporarily disabling origination

     */
    Origination?: Origination;
    /**
     * Maximum duration (seconds) of content to retain for startover playback.
If not specified, startover playback will be disabled for the OriginEndpoint.

     */
    StartoverWindowSeconds?: __integer;
    Tags?: Tags;
    /**
     * Amount of delay (seconds) to enforce on the playback of live content.
If not specified, there will be no time delay in effect for the OriginEndpoint.

     */
    TimeDelaySeconds?: __integer;
    /**
     * The URL of the packaged OriginEndpoint for consumption.
     */
    Url?: __string;
    /**
     * A list of source IP CIDR blocks that will be allowed to access the OriginEndpoint.
     */
    Whitelist?: __listOf__string;
  }
  export type Origination = "ALLOW"|"DENY"|string;
  export type PlaylistType = "NONE"|"EVENT"|"VOD"|string;
  export type PresetSpeke20Audio = "PRESET-AUDIO-1"|"PRESET-AUDIO-2"|"PRESET-AUDIO-3"|"SHARED"|"UNENCRYPTED"|string;
  export type PresetSpeke20Video = "PRESET-VIDEO-1"|"PRESET-VIDEO-2"|"PRESET-VIDEO-3"|"PRESET-VIDEO-4"|"PRESET-VIDEO-5"|"PRESET-VIDEO-6"|"PRESET-VIDEO-7"|"PRESET-VIDEO-8"|"SHARED"|"UNENCRYPTED"|string;
  export type Profile = "NONE"|"HBBTV_1_5"|"HYBRIDCAST"|"DVB_DASH_2014"|string;
  export interface RotateChannelCredentialsRequest {
    /**
     * The ID of the channel to update.
     */
    Id: __string;
  }
  export interface RotateChannelCredentialsResponse {
    /**
     * The Amazon Resource Name (ARN) assigned to the Channel.
     */
    Arn?: __string;
    /**
     * The date and time the Channel was created.
     */
    CreatedAt?: __string;
    /**
     * A short text description of the Channel.
     */
    Description?: __string;
    EgressAccessLogs?: EgressAccessLogs;
    HlsIngest?: HlsIngest;
    /**
     * The ID of the Channel.
     */
    Id?: __string;
    IngressAccessLogs?: IngressAccessLogs;
    Tags?: Tags;
  }
  export interface RotateIngestEndpointCredentialsRequest {
    /**
     * The ID of the channel the IngestEndpoint is on.
     */
    Id: __string;
    /**
     * The id of the IngestEndpoint whose credentials should be rotated
     */
    IngestEndpointId: __string;
  }
  export interface RotateIngestEndpointCredentialsResponse {
    /**
     * The Amazon Resource Name (ARN) assigned to the Channel.
     */
    Arn?: __string;
    /**
     * The date and time the Channel was created.
     */
    CreatedAt?: __string;
    /**
     * A short text description of the Channel.
     */
    Description?: __string;
    EgressAccessLogs?: EgressAccessLogs;
    HlsIngest?: HlsIngest;
    /**
     * The ID of the Channel.
     */
    Id?: __string;
    IngressAccessLogs?: IngressAccessLogs;
    Tags?: Tags;
  }
  export interface S3Destination {
    /**
     * The name of an S3 bucket within which harvested content will be exported

     */
    BucketName: __string;
    /**
     * The key in the specified S3 bucket where the harvested top-level manifest will be placed.

     */
    ManifestKey: __string;
    /**
     * The IAM role used to write to the specified S3 bucket

     */
    RoleArn: __string;
  }
  export type SegmentTemplateFormat = "NUMBER_WITH_TIMELINE"|"TIME_WITH_TIMELINE"|"NUMBER_WITH_DURATION"|string;
  export type SensitiveString = string;
  export interface SpekeKeyProvider {
    /**
     * An Amazon Resource Name (ARN) of a Certificate Manager certificate
that MediaPackage will use for enforcing secure end-to-end data
transfer with the key provider service.

     */
    CertificateArn?: __string;
    EncryptionContractConfiguration?: EncryptionContractConfiguration;
    /**
     * The resource ID to include in key requests.
     */
    ResourceId: __string;
    /**
     * An Amazon Resource Name (ARN) of an IAM role that AWS Elemental
MediaPackage will assume when accessing the key provider service.

     */
    RoleArn: __string;
    /**
     * The system IDs to include in key requests.
     */
    SystemIds: __listOf__string;
    /**
     * The URL of the external key provider service.
     */
    Url: __string;
  }
  export type Status = "IN_PROGRESS"|"SUCCEEDED"|"FAILED"|string;
  export type StreamOrder = "ORIGINAL"|"VIDEO_BITRATE_ASCENDING"|"VIDEO_BITRATE_DESCENDING"|string;
  export interface StreamSelection {
    /**
     * The maximum video bitrate (bps) to include in output.
     */
    MaxVideoBitsPerSecond?: __integer;
    /**
     * The minimum video bitrate (bps) to include in output.
     */
    MinVideoBitsPerSecond?: __integer;
    /**
     * A directive that determines the order of streams in the output.
     */
    StreamOrder?: StreamOrder;
  }
  export interface TagResourceRequest {
    ResourceArn: __string;
    Tags: __mapOf__string;
  }
  export type Tags = {[key: string]: __string};
  export interface UntagResourceRequest {
    ResourceArn: __string;
    /**
     * The key(s) of tag to be deleted
     */
    TagKeys: __listOf__string;
  }
  export interface UpdateChannelRequest {
    /**
     * A short text description of the Channel.
     */
    Description?: __string;
    /**
     * The ID of the Channel to update.
     */
    Id: __string;
  }
  export interface UpdateChannelResponse {
    /**
     * The Amazon Resource Name (ARN) assigned to the Channel.
     */
    Arn?: __string;
    /**
     * The date and time the Channel was created.
     */
    CreatedAt?: __string;
    /**
     * A short text description of the Channel.
     */
    Description?: __string;
    EgressAccessLogs?: EgressAccessLogs;
    HlsIngest?: HlsIngest;
    /**
     * The ID of the Channel.
     */
    Id?: __string;
    IngressAccessLogs?: IngressAccessLogs;
    Tags?: Tags;
  }
  export interface UpdateOriginEndpointRequest {
    Authorization?: Authorization;
    CmafPackage?: CmafPackageCreateOrUpdateParameters;
    DashPackage?: DashPackage;
    /**
     * A short text description of the OriginEndpoint.
     */
    Description?: __string;
    HlsPackage?: HlsPackage;
    /**
     * The ID of the OriginEndpoint to update.
     */
    Id: __string;
    /**
     * A short string that will be appended to the end of the Endpoint URL.
     */
    ManifestName?: __string;
    MssPackage?: MssPackage;
    /**
     * Control whether origination of video is allowed for this OriginEndpoint. If set to ALLOW, the OriginEndpoint
may by requested, pursuant to any other form of access control. If set to DENY, the OriginEndpoint may not be
requested. This can be helpful for Live to VOD harvesting, or for temporarily disabling origination

     */
    Origination?: Origination;
    /**
     * Maximum duration (in seconds) of content to retain for startover playback.
If not specified, startover playback will be disabled for the OriginEndpoint.

     */
    StartoverWindowSeconds?: __integer;
    /**
     * Amount of delay (in seconds) to enforce on the playback of live content.
If not specified, there will be no time delay in effect for the OriginEndpoint.

     */
    TimeDelaySeconds?: __integer;
    /**
     * A list of source IP CIDR blocks that will be allowed to access the OriginEndpoint.
     */
    Whitelist?: __listOf__string;
  }
  export interface UpdateOriginEndpointResponse {
    /**
     * The Amazon Resource Name (ARN) assigned to the OriginEndpoint.
     */
    Arn?: __string;
    Authorization?: Authorization;
    /**
     * The ID of the Channel the OriginEndpoint is associated with.
     */
    ChannelId?: __string;
    CmafPackage?: CmafPackage;
    /**
     * The date and time the OriginEndpoint was created.
     */
    CreatedAt?: __string;
    DashPackage?: DashPackage;
    /**
     * A short text description of the OriginEndpoint.
     */
    Description?: __string;
    HlsPackage?: HlsPackage;
    /**
     * The ID of the OriginEndpoint.
     */
    Id?: __string;
    /**
     * A short string appended to the end of the OriginEndpoint URL.
     */
    ManifestName?: __string;
    MssPackage?: MssPackage;
    /**
     * Control whether origination of video is allowed for this OriginEndpoint. If set to ALLOW, the OriginEndpoint
may by requested, pursuant to any other form of access control. If set to DENY, the OriginEndpoint may not be
requested. This can be helpful for Live to VOD harvesting, or for temporarily disabling origination

     */
    Origination?: Origination;
    /**
     * Maximum duration (seconds) of content to retain for startover playback.
If not specified, startover playback will be disabled for the OriginEndpoint.

     */
    StartoverWindowSeconds?: __integer;
    Tags?: Tags;
    /**
     * Amount of delay (seconds) to enforce on the playback of live content.
If not specified, there will be no time delay in effect for the OriginEndpoint.

     */
    TimeDelaySeconds?: __integer;
    /**
     * The URL of the packaged OriginEndpoint for consumption.
     */
    Url?: __string;
    /**
     * A list of source IP CIDR blocks that will be allowed to access the OriginEndpoint.
     */
    Whitelist?: __listOf__string;
  }
  export type UtcTiming = "NONE"|"HTTP-HEAD"|"HTTP-ISO"|"HTTP-XSDATE"|string;
  export type __AdTriggersElement = "SPLICE_INSERT"|"BREAK"|"PROVIDER_ADVERTISEMENT"|"DISTRIBUTOR_ADVERTISEMENT"|"PROVIDER_PLACEMENT_OPPORTUNITY"|"DISTRIBUTOR_PLACEMENT_OPPORTUNITY"|"PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY"|"DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY"|string;
  export type __PeriodTriggersElement = "ADS"|string;
  export type __boolean = boolean;
  export type __integer = number;
  export type __listOfChannel = Channel[];
  export type __listOfHarvestJob = HarvestJob[];
  export type __listOfHlsManifest = HlsManifest[];
  export type __listOfHlsManifestCreateOrUpdateParameters = HlsManifestCreateOrUpdateParameters[];
  export type __listOfIngestEndpoint = IngestEndpoint[];
  export type __listOfOriginEndpoint = OriginEndpoint[];
  export type __listOf__PeriodTriggersElement = __PeriodTriggersElement[];
  export type __listOf__string = __string[];
  export type __mapOf__string = {[key: string]: __string};
  export type __string = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-10-12"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MediaPackage client.
   */
  export import Types = MediaPackage;
}
export = MediaPackage;
