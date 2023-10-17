import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MediaPackageV2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MediaPackageV2.Types.ClientConfiguration)
  config: Config & MediaPackageV2.Types.ClientConfiguration;
  /**
   * Create a channel to start receiving content streams. The channel represents the input to MediaPackage for incoming live content from an encoder such as AWS Elemental MediaLive. The channel receives content, and after packaging it, outputs it through an origin endpoint to downstream devices (such as video players or CDNs) that request the content. You can create only one channel with each request. We recommend that you spread out channels between channel groups, such as putting redundant channels in the same AWS Region in different channel groups.
   */
  createChannel(params: MediaPackageV2.Types.CreateChannelRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.CreateChannelResponse) => void): Request<MediaPackageV2.Types.CreateChannelResponse, AWSError>;
  /**
   * Create a channel to start receiving content streams. The channel represents the input to MediaPackage for incoming live content from an encoder such as AWS Elemental MediaLive. The channel receives content, and after packaging it, outputs it through an origin endpoint to downstream devices (such as video players or CDNs) that request the content. You can create only one channel with each request. We recommend that you spread out channels between channel groups, such as putting redundant channels in the same AWS Region in different channel groups.
   */
  createChannel(callback?: (err: AWSError, data: MediaPackageV2.Types.CreateChannelResponse) => void): Request<MediaPackageV2.Types.CreateChannelResponse, AWSError>;
  /**
   * Create a channel group to group your channels and origin endpoints. A channel group is the top-level resource that consists of channels and origin endpoints that are associated with it and that provides predictable URLs for stream delivery. All channels and origin endpoints within the channel group are guaranteed to share the DNS. You can create only one channel group with each request. 
   */
  createChannelGroup(params: MediaPackageV2.Types.CreateChannelGroupRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.CreateChannelGroupResponse) => void): Request<MediaPackageV2.Types.CreateChannelGroupResponse, AWSError>;
  /**
   * Create a channel group to group your channels and origin endpoints. A channel group is the top-level resource that consists of channels and origin endpoints that are associated with it and that provides predictable URLs for stream delivery. All channels and origin endpoints within the channel group are guaranteed to share the DNS. You can create only one channel group with each request. 
   */
  createChannelGroup(callback?: (err: AWSError, data: MediaPackageV2.Types.CreateChannelGroupResponse) => void): Request<MediaPackageV2.Types.CreateChannelGroupResponse, AWSError>;
  /**
   * The endpoint is attached to a channel, and represents the output of the live content. You can associate multiple endpoints to a single channel. Each endpoint gives players and downstream CDNs (such as Amazon CloudFront) access to the content for playback. Content can't be served from a channel until it has an endpoint. You can create only one endpoint with each request. 
   */
  createOriginEndpoint(params: MediaPackageV2.Types.CreateOriginEndpointRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.CreateOriginEndpointResponse) => void): Request<MediaPackageV2.Types.CreateOriginEndpointResponse, AWSError>;
  /**
   * The endpoint is attached to a channel, and represents the output of the live content. You can associate multiple endpoints to a single channel. Each endpoint gives players and downstream CDNs (such as Amazon CloudFront) access to the content for playback. Content can't be served from a channel until it has an endpoint. You can create only one endpoint with each request. 
   */
  createOriginEndpoint(callback?: (err: AWSError, data: MediaPackageV2.Types.CreateOriginEndpointResponse) => void): Request<MediaPackageV2.Types.CreateOriginEndpointResponse, AWSError>;
  /**
   * Delete a channel to stop AWS Elemental MediaPackage from receiving further content. You must delete the channel's origin endpoints before you can delete the channel.
   */
  deleteChannel(params: MediaPackageV2.Types.DeleteChannelRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.DeleteChannelResponse) => void): Request<MediaPackageV2.Types.DeleteChannelResponse, AWSError>;
  /**
   * Delete a channel to stop AWS Elemental MediaPackage from receiving further content. You must delete the channel's origin endpoints before you can delete the channel.
   */
  deleteChannel(callback?: (err: AWSError, data: MediaPackageV2.Types.DeleteChannelResponse) => void): Request<MediaPackageV2.Types.DeleteChannelResponse, AWSError>;
  /**
   * Delete a channel group. You must delete the channel group's channels and origin endpoints before you can delete the channel group. If you delete a channel group, you'll lose access to the egress domain and will have to create a new channel group to replace it.
   */
  deleteChannelGroup(params: MediaPackageV2.Types.DeleteChannelGroupRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.DeleteChannelGroupResponse) => void): Request<MediaPackageV2.Types.DeleteChannelGroupResponse, AWSError>;
  /**
   * Delete a channel group. You must delete the channel group's channels and origin endpoints before you can delete the channel group. If you delete a channel group, you'll lose access to the egress domain and will have to create a new channel group to replace it.
   */
  deleteChannelGroup(callback?: (err: AWSError, data: MediaPackageV2.Types.DeleteChannelGroupResponse) => void): Request<MediaPackageV2.Types.DeleteChannelGroupResponse, AWSError>;
  /**
   * Delete a channel policy.
   */
  deleteChannelPolicy(params: MediaPackageV2.Types.DeleteChannelPolicyRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.DeleteChannelPolicyResponse) => void): Request<MediaPackageV2.Types.DeleteChannelPolicyResponse, AWSError>;
  /**
   * Delete a channel policy.
   */
  deleteChannelPolicy(callback?: (err: AWSError, data: MediaPackageV2.Types.DeleteChannelPolicyResponse) => void): Request<MediaPackageV2.Types.DeleteChannelPolicyResponse, AWSError>;
  /**
   * Origin endpoints can serve content until they're deleted. Delete the endpoint if it should no longer respond to playback requests. You must delete all endpoints from a channel before you can delete the channel.
   */
  deleteOriginEndpoint(params: MediaPackageV2.Types.DeleteOriginEndpointRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.DeleteOriginEndpointResponse) => void): Request<MediaPackageV2.Types.DeleteOriginEndpointResponse, AWSError>;
  /**
   * Origin endpoints can serve content until they're deleted. Delete the endpoint if it should no longer respond to playback requests. You must delete all endpoints from a channel before you can delete the channel.
   */
  deleteOriginEndpoint(callback?: (err: AWSError, data: MediaPackageV2.Types.DeleteOriginEndpointResponse) => void): Request<MediaPackageV2.Types.DeleteOriginEndpointResponse, AWSError>;
  /**
   * Delete an origin endpoint policy.
   */
  deleteOriginEndpointPolicy(params: MediaPackageV2.Types.DeleteOriginEndpointPolicyRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.DeleteOriginEndpointPolicyResponse) => void): Request<MediaPackageV2.Types.DeleteOriginEndpointPolicyResponse, AWSError>;
  /**
   * Delete an origin endpoint policy.
   */
  deleteOriginEndpointPolicy(callback?: (err: AWSError, data: MediaPackageV2.Types.DeleteOriginEndpointPolicyResponse) => void): Request<MediaPackageV2.Types.DeleteOriginEndpointPolicyResponse, AWSError>;
  /**
   * Retrieves the specified channel that's configured in AWS Elemental MediaPackage, including the origin endpoints that are associated with it.
   */
  getChannel(params: MediaPackageV2.Types.GetChannelRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.GetChannelResponse) => void): Request<MediaPackageV2.Types.GetChannelResponse, AWSError>;
  /**
   * Retrieves the specified channel that's configured in AWS Elemental MediaPackage, including the origin endpoints that are associated with it.
   */
  getChannel(callback?: (err: AWSError, data: MediaPackageV2.Types.GetChannelResponse) => void): Request<MediaPackageV2.Types.GetChannelResponse, AWSError>;
  /**
   * Retrieves the specified channel group that's configured in AWS Elemental MediaPackage, including the channels and origin endpoints that are associated with it.
   */
  getChannelGroup(params: MediaPackageV2.Types.GetChannelGroupRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.GetChannelGroupResponse) => void): Request<MediaPackageV2.Types.GetChannelGroupResponse, AWSError>;
  /**
   * Retrieves the specified channel group that's configured in AWS Elemental MediaPackage, including the channels and origin endpoints that are associated with it.
   */
  getChannelGroup(callback?: (err: AWSError, data: MediaPackageV2.Types.GetChannelGroupResponse) => void): Request<MediaPackageV2.Types.GetChannelGroupResponse, AWSError>;
  /**
   * Retrieves the specified channel policy that's configured in AWS Elemental MediaPackage. With policies, you can specify who has access to AWS resources and what actions they can perform on those resources.
   */
  getChannelPolicy(params: MediaPackageV2.Types.GetChannelPolicyRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.GetChannelPolicyResponse) => void): Request<MediaPackageV2.Types.GetChannelPolicyResponse, AWSError>;
  /**
   * Retrieves the specified channel policy that's configured in AWS Elemental MediaPackage. With policies, you can specify who has access to AWS resources and what actions they can perform on those resources.
   */
  getChannelPolicy(callback?: (err: AWSError, data: MediaPackageV2.Types.GetChannelPolicyResponse) => void): Request<MediaPackageV2.Types.GetChannelPolicyResponse, AWSError>;
  /**
   * Retrieves the specified origin endpoint that's configured in AWS Elemental MediaPackage to obtain its playback URL and to view the packaging settings that it's currently using.
   */
  getOriginEndpoint(params: MediaPackageV2.Types.GetOriginEndpointRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.GetOriginEndpointResponse) => void): Request<MediaPackageV2.Types.GetOriginEndpointResponse, AWSError>;
  /**
   * Retrieves the specified origin endpoint that's configured in AWS Elemental MediaPackage to obtain its playback URL and to view the packaging settings that it's currently using.
   */
  getOriginEndpoint(callback?: (err: AWSError, data: MediaPackageV2.Types.GetOriginEndpointResponse) => void): Request<MediaPackageV2.Types.GetOriginEndpointResponse, AWSError>;
  /**
   * Retrieves the specified origin endpoint policy that's configured in AWS Elemental MediaPackage.
   */
  getOriginEndpointPolicy(params: MediaPackageV2.Types.GetOriginEndpointPolicyRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.GetOriginEndpointPolicyResponse) => void): Request<MediaPackageV2.Types.GetOriginEndpointPolicyResponse, AWSError>;
  /**
   * Retrieves the specified origin endpoint policy that's configured in AWS Elemental MediaPackage.
   */
  getOriginEndpointPolicy(callback?: (err: AWSError, data: MediaPackageV2.Types.GetOriginEndpointPolicyResponse) => void): Request<MediaPackageV2.Types.GetOriginEndpointPolicyResponse, AWSError>;
  /**
   * Retrieves all channel groups that are configured in AWS Elemental MediaPackage, including the channels and origin endpoints that are associated with it.
   */
  listChannelGroups(params: MediaPackageV2.Types.ListChannelGroupsRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.ListChannelGroupsResponse) => void): Request<MediaPackageV2.Types.ListChannelGroupsResponse, AWSError>;
  /**
   * Retrieves all channel groups that are configured in AWS Elemental MediaPackage, including the channels and origin endpoints that are associated with it.
   */
  listChannelGroups(callback?: (err: AWSError, data: MediaPackageV2.Types.ListChannelGroupsResponse) => void): Request<MediaPackageV2.Types.ListChannelGroupsResponse, AWSError>;
  /**
   * Retrieves all channels in a specific channel group that are configured in AWS Elemental MediaPackage, including the origin endpoints that are associated with it.
   */
  listChannels(params: MediaPackageV2.Types.ListChannelsRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.ListChannelsResponse) => void): Request<MediaPackageV2.Types.ListChannelsResponse, AWSError>;
  /**
   * Retrieves all channels in a specific channel group that are configured in AWS Elemental MediaPackage, including the origin endpoints that are associated with it.
   */
  listChannels(callback?: (err: AWSError, data: MediaPackageV2.Types.ListChannelsResponse) => void): Request<MediaPackageV2.Types.ListChannelsResponse, AWSError>;
  /**
   * Retrieves all origin endpoints in a specific channel that are configured in AWS Elemental MediaPackage.
   */
  listOriginEndpoints(params: MediaPackageV2.Types.ListOriginEndpointsRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.ListOriginEndpointsResponse) => void): Request<MediaPackageV2.Types.ListOriginEndpointsResponse, AWSError>;
  /**
   * Retrieves all origin endpoints in a specific channel that are configured in AWS Elemental MediaPackage.
   */
  listOriginEndpoints(callback?: (err: AWSError, data: MediaPackageV2.Types.ListOriginEndpointsResponse) => void): Request<MediaPackageV2.Types.ListOriginEndpointsResponse, AWSError>;
  /**
   * Lists the tags assigned to a resource.
   */
  listTagsForResource(params: MediaPackageV2.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.ListTagsForResourceResponse) => void): Request<MediaPackageV2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags assigned to a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: MediaPackageV2.Types.ListTagsForResourceResponse) => void): Request<MediaPackageV2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Attaches an IAM policy to the specified channel. With policies, you can specify who has access to AWS resources and what actions they can perform on those resources. You can attach only one policy with each request.
   */
  putChannelPolicy(params: MediaPackageV2.Types.PutChannelPolicyRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.PutChannelPolicyResponse) => void): Request<MediaPackageV2.Types.PutChannelPolicyResponse, AWSError>;
  /**
   * Attaches an IAM policy to the specified channel. With policies, you can specify who has access to AWS resources and what actions they can perform on those resources. You can attach only one policy with each request.
   */
  putChannelPolicy(callback?: (err: AWSError, data: MediaPackageV2.Types.PutChannelPolicyResponse) => void): Request<MediaPackageV2.Types.PutChannelPolicyResponse, AWSError>;
  /**
   * Attaches an IAM policy to the specified origin endpoint. You can attach only one policy with each request.
   */
  putOriginEndpointPolicy(params: MediaPackageV2.Types.PutOriginEndpointPolicyRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.PutOriginEndpointPolicyResponse) => void): Request<MediaPackageV2.Types.PutOriginEndpointPolicyResponse, AWSError>;
  /**
   * Attaches an IAM policy to the specified origin endpoint. You can attach only one policy with each request.
   */
  putOriginEndpointPolicy(callback?: (err: AWSError, data: MediaPackageV2.Types.PutOriginEndpointPolicyResponse) => void): Request<MediaPackageV2.Types.PutOriginEndpointPolicyResponse, AWSError>;
  /**
   * Assigns one of more tags (key-value pairs) to the specified MediaPackage resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values. You can use the TagResource operation with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
   */
  tagResource(params: MediaPackageV2.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Assigns one of more tags (key-value pairs) to the specified MediaPackage resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values. You can use the TagResource operation with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes one or more tags from the specified resource.
   */
  untagResource(params: MediaPackageV2.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes one or more tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Update the specified channel. You can edit if MediaPackage sends ingest or egress access logs to the CloudWatch log group, if content will be encrypted, the description on a channel, and your channel's policy settings. You can't edit the name of the channel or CloudFront distribution details. Any edits you make that impact the video output may not be reflected for a few minutes.
   */
  updateChannel(params: MediaPackageV2.Types.UpdateChannelRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.UpdateChannelResponse) => void): Request<MediaPackageV2.Types.UpdateChannelResponse, AWSError>;
  /**
   * Update the specified channel. You can edit if MediaPackage sends ingest or egress access logs to the CloudWatch log group, if content will be encrypted, the description on a channel, and your channel's policy settings. You can't edit the name of the channel or CloudFront distribution details. Any edits you make that impact the video output may not be reflected for a few minutes.
   */
  updateChannel(callback?: (err: AWSError, data: MediaPackageV2.Types.UpdateChannelResponse) => void): Request<MediaPackageV2.Types.UpdateChannelResponse, AWSError>;
  /**
   * Update the specified channel group. You can edit the description on a channel group for easier identification later from the AWS Elemental MediaPackage console. You can't edit the name of the channel group. Any edits you make that impact the video output may not be reflected for a few minutes.
   */
  updateChannelGroup(params: MediaPackageV2.Types.UpdateChannelGroupRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.UpdateChannelGroupResponse) => void): Request<MediaPackageV2.Types.UpdateChannelGroupResponse, AWSError>;
  /**
   * Update the specified channel group. You can edit the description on a channel group for easier identification later from the AWS Elemental MediaPackage console. You can't edit the name of the channel group. Any edits you make that impact the video output may not be reflected for a few minutes.
   */
  updateChannelGroup(callback?: (err: AWSError, data: MediaPackageV2.Types.UpdateChannelGroupResponse) => void): Request<MediaPackageV2.Types.UpdateChannelGroupResponse, AWSError>;
  /**
   * Update the specified origin endpoint. Edit the packaging preferences on an endpoint to optimize the viewing experience. You can't edit the name of the endpoint. Any edits you make that impact the video output may not be reflected for a few minutes.
   */
  updateOriginEndpoint(params: MediaPackageV2.Types.UpdateOriginEndpointRequest, callback?: (err: AWSError, data: MediaPackageV2.Types.UpdateOriginEndpointResponse) => void): Request<MediaPackageV2.Types.UpdateOriginEndpointResponse, AWSError>;
  /**
   * Update the specified origin endpoint. Edit the packaging preferences on an endpoint to optimize the viewing experience. You can't edit the name of the endpoint. Any edits you make that impact the video output may not be reflected for a few minutes.
   */
  updateOriginEndpoint(callback?: (err: AWSError, data: MediaPackageV2.Types.UpdateOriginEndpointResponse) => void): Request<MediaPackageV2.Types.UpdateOriginEndpointResponse, AWSError>;
}
declare namespace MediaPackageV2 {
  export type AdMarkerHls = "DATERANGE"|string;
  export type Boolean = boolean;
  export interface ChannelGroupListConfiguration {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: String;
    /**
     * The Amazon Resource Name (ARN) associated with the resource.
     */
    Arn: String;
    /**
     * The date and time the channel group was created.
     */
    CreatedAt: Timestamp;
    /**
     * The date and time the channel group was modified.
     */
    ModifiedAt: Timestamp;
    /**
     * Any descriptive information that you want to add to the channel group for future identification purposes.
     */
    Description?: String;
  }
  export type ChannelGroupsList = ChannelGroupListConfiguration[];
  export type ChannelList = ChannelListConfiguration[];
  export interface ChannelListConfiguration {
    /**
     * The Amazon Resource Name (ARN) associated with the resource.
     */
    Arn: String;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: String;
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: String;
    /**
     * The date and time the channel was created.
     */
    CreatedAt: Timestamp;
    /**
     * The date and time the channel was modified.
     */
    ModifiedAt: Timestamp;
    /**
     * Any descriptive information that you want to add to the channel for future identification purposes.
     */
    Description?: String;
  }
  export type CmafEncryptionMethod = "CENC"|"CBCS"|string;
  export type ContainerType = "TS"|"CMAF"|string;
  export interface CreateChannelGroupRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region. You can't use spaces in the name. You can't change the name after you create the channel group.
     */
    ChannelGroupName: ResourceName;
    /**
     * A unique, case-sensitive token that you provide to ensure the idempotency of the request.
     */
    ClientToken?: IdempotencyToken;
    /**
     * Enter any descriptive text that helps you to identify the channel group.
     */
    Description?: ResourceDescription;
    /**
     * A comma-separated list of tag key:value pairs that you define. For example:  "Key1": "Value1",   "Key2": "Value2" 
     */
    Tags?: TagMap;
  }
  export interface CreateChannelGroupResponse {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: String;
    /**
     * The Amazon Resource Name (ARN) associated with the resource.
     */
    Arn: String;
    /**
     * The output domain where the source stream should be sent. Integrate the egress domain with a downstream CDN (such as Amazon CloudFront) or playback device.
     */
    EgressDomain: String;
    /**
     * The date and time the channel group was created.
     */
    CreatedAt: Timestamp;
    /**
     * The date and time the channel group was modified.
     */
    ModifiedAt: Timestamp;
    /**
     * The description for your channel group.
     */
    Description?: String;
    /**
     * The comma-separated list of tag key:value pairs assigned to the channel group.
     */
    Tags?: TagMap;
  }
  export interface CreateChannelRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. You can't change the name after you create the channel.
     */
    ChannelName: ResourceName;
    /**
     * A unique, case-sensitive token that you provide to ensure the idempotency of the request.
     */
    ClientToken?: IdempotencyToken;
    /**
     * Enter any descriptive text that helps you to identify the channel.
     */
    Description?: ResourceDescription;
    /**
     * A comma-separated list of tag key:value pairs that you define. For example:  "Key1": "Value1",   "Key2": "Value2" 
     */
    Tags?: TagMap;
  }
  export interface CreateChannelResponse {
    /**
     * The Amazon Resource Name (ARN) associated with the resource.
     */
    Arn: String;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group.
     */
    ChannelName: String;
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: String;
    /**
     * The date and time the channel was created.
     */
    CreatedAt: Timestamp;
    /**
     * The date and time the channel was modified.
     */
    ModifiedAt: Timestamp;
    /**
     * The description for your channel.
     */
    Description?: String;
    IngestEndpoints?: IngestEndpointList;
    /**
     * The comma-separated list of tag key:value pairs assigned to the channel.
     */
    Tags?: TagMap;
  }
  export interface CreateHlsManifestConfiguration {
    /**
     * A short short string that's appended to the endpoint URL. The manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default manifest name, index. MediaPackage automatically inserts the format extension, such as .m3u8. You can't use the same manifest name if you use HLS manifest and low-latency HLS manifest. The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
     */
    ManifestName: ManifestName;
    /**
     * A short string that's appended to the endpoint URL. The child manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default manifest name, index, with an added suffix to distinguish it from the manifest name. The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
     */
    ChildManifestName?: ManifestName;
    ScteHls?: ScteHls;
    /**
     * The total duration (in seconds) of the manifest's content.
     */
    ManifestWindowSeconds?: CreateHlsManifestConfigurationManifestWindowSecondsInteger;
    /**
     * Inserts EXT-X-PROGRAM-DATE-TIME tags in the output manifest at the interval that you specify. If you don't enter an interval, EXT-X-PROGRAM-DATE-TIME tags aren't included in the manifest. The tags sync the stream to the wall clock so that viewers can seek to a specific time in the playback timeline on the player. ID3Timed metadata messages generate every 5 seconds whenever the content is ingested. Irrespective of this parameter, if any ID3Timed metadata is in the HLS input, it is passed through to the HLS output.
     */
    ProgramDateTimeIntervalSeconds?: CreateHlsManifestConfigurationProgramDateTimeIntervalSecondsInteger;
  }
  export type CreateHlsManifestConfigurationManifestWindowSecondsInteger = number;
  export type CreateHlsManifestConfigurationProgramDateTimeIntervalSecondsInteger = number;
  export type CreateHlsManifests = CreateHlsManifestConfiguration[];
  export interface CreateLowLatencyHlsManifestConfiguration {
    /**
     * A short short string that's appended to the endpoint URL. The manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default manifest name, index. MediaPackage automatically inserts the format extension, such as .m3u8. You can't use the same manifest name if you use HLS manifest and low-latency HLS manifest. The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
     */
    ManifestName: ManifestName;
    /**
     * A short string that's appended to the endpoint URL. The child manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default manifest name, index, with an added suffix to distinguish it from the manifest name. The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
     */
    ChildManifestName?: ManifestName;
    ScteHls?: ScteHls;
    /**
     * The total duration (in seconds) of the manifest's content.
     */
    ManifestWindowSeconds?: CreateLowLatencyHlsManifestConfigurationManifestWindowSecondsInteger;
    /**
     * Inserts EXT-X-PROGRAM-DATE-TIME tags in the output manifest at the interval that you specify. If you don't enter an interval, EXT-X-PROGRAM-DATE-TIME tags aren't included in the manifest. The tags sync the stream to the wall clock so that viewers can seek to a specific time in the playback timeline on the player. ID3Timed metadata messages generate every 5 seconds whenever the content is ingested. Irrespective of this parameter, if any ID3Timed metadata is in the HLS input, it is passed through to the HLS output.
     */
    ProgramDateTimeIntervalSeconds?: CreateLowLatencyHlsManifestConfigurationProgramDateTimeIntervalSecondsInteger;
  }
  export type CreateLowLatencyHlsManifestConfigurationManifestWindowSecondsInteger = number;
  export type CreateLowLatencyHlsManifestConfigurationProgramDateTimeIntervalSecondsInteger = number;
  export type CreateLowLatencyHlsManifests = CreateLowLatencyHlsManifestConfiguration[];
  export interface CreateOriginEndpointRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
    /**
     * The name that describes the origin endpoint. The name is the primary identifier for the origin endpoint, and must be unique for your account in the AWS Region and channel. You can't use spaces in the name. You can't change the name after you create the endpoint.
     */
    OriginEndpointName: ResourceName;
    /**
     * The type of container to attach to this origin endpoint. A container type is a file format that encapsulates one or more media streams, such as audio and video, into a single file. You can't change the container type after you create the endpoint.
     */
    ContainerType: ContainerType;
    /**
     * The segment configuration, including the segment name, duration, and other configuration values.
     */
    Segment?: Segment;
    /**
     * A unique, case-sensitive token that you provide to ensure the idempotency of the request.
     */
    ClientToken?: IdempotencyToken;
    /**
     * Enter any descriptive text that helps you to identify the origin endpoint.
     */
    Description?: ResourceDescription;
    /**
     * The size of the window (in seconds) to create a window of the live stream that's available for on-demand viewing. Viewers can start-over or catch-up on content that falls within the window. The maximum startover window is 1,209,600 seconds (14 days).
     */
    StartoverWindowSeconds?: CreateOriginEndpointRequestStartoverWindowSecondsInteger;
    /**
     * An HTTP live streaming (HLS) manifest configuration.
     */
    HlsManifests?: CreateHlsManifests;
    /**
     * A low-latency HLS manifest configuration.
     */
    LowLatencyHlsManifests?: CreateLowLatencyHlsManifests;
    /**
     * A comma-separated list of tag key:value pairs that you define. For example:  "Key1": "Value1",   "Key2": "Value2" 
     */
    Tags?: TagMap;
  }
  export type CreateOriginEndpointRequestStartoverWindowSecondsInteger = number;
  export interface CreateOriginEndpointResponse {
    /**
     * The Amazon Resource Name (ARN) associated with the resource.
     */
    Arn: String;
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group.
     */
    ChannelName: ResourceName;
    /**
     * The name that describes the origin endpoint. The name is the primary identifier for the origin endpoint, and and must be unique for your account in the AWS Region and channel.
     */
    OriginEndpointName: ResourceName;
    /**
     * The type of container attached to this origin endpoint.
     */
    ContainerType: ContainerType;
    /**
     * The segment configuration, including the segment name, duration, and other configuration values.
     */
    Segment: Segment;
    /**
     * The date and time the origin endpoint was created.
     */
    CreatedAt: Timestamp;
    /**
     * The date and time the origin endpoint was modified.
     */
    ModifiedAt: Timestamp;
    /**
     * The description for your origin endpoint.
     */
    Description?: ResourceDescription;
    /**
     * The size of the window (in seconds) to create a window of the live stream that's available for on-demand viewing. Viewers can start-over or catch-up on content that falls within the window.
     */
    StartoverWindowSeconds?: Integer;
    /**
     * An HTTP live streaming (HLS) manifest configuration.
     */
    HlsManifests?: GetHlsManifests;
    /**
     * A low-latency HLS manifest configuration.
     */
    LowLatencyHlsManifests?: GetLowLatencyHlsManifests;
    /**
     * The comma-separated list of tag key:value pairs assigned to the origin endpoint.
     */
    Tags?: TagMap;
  }
  export interface DeleteChannelGroupRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
  }
  export interface DeleteChannelGroupResponse {
  }
  export interface DeleteChannelPolicyRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group.
     */
    ChannelName: ResourceName;
  }
  export interface DeleteChannelPolicyResponse {
  }
  export interface DeleteChannelRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group.
     */
    ChannelName: ResourceName;
  }
  export interface DeleteChannelResponse {
  }
  export interface DeleteOriginEndpointPolicyRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
    /**
     * The name that describes the origin endpoint. The name is the primary identifier for the origin endpoint, and and must be unique for your account in the AWS Region and channel. 
     */
    OriginEndpointName: ResourceName;
  }
  export interface DeleteOriginEndpointPolicyResponse {
  }
  export interface DeleteOriginEndpointRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
    /**
     * The name that describes the origin endpoint. The name is the primary identifier for the origin endpoint, and and must be unique for your account in the AWS Region and channel. 
     */
    OriginEndpointName: ResourceName;
  }
  export interface DeleteOriginEndpointResponse {
  }
  export type DrmSystem = "CLEAR_KEY_AES_128"|"FAIRPLAY"|"PLAYREADY"|"WIDEVINE"|string;
  export interface Encryption {
    /**
     * A 128-bit, 16-byte hex value represented by a 32-character string, used in conjunction with the key for encrypting content. If you don't specify a value, then MediaPackage creates the constant initialization vector (IV).
     */
    ConstantInitializationVector?: EncryptionConstantInitializationVectorString;
    /**
     * The encryption method to use.
     */
    EncryptionMethod: EncryptionMethod;
    /**
     * The frequency (in seconds) of key changes for live workflows, in which content is streamed real time. The service retrieves content keys before the live content begins streaming, and then retrieves them as needed over the lifetime of the workflow. By default, key rotation is set to 300 seconds (5 minutes), the minimum rotation interval, which is equivalent to setting it to 300. If you don't enter an interval, content keys aren't rotated. The following example setting causes the service to rotate keys every thirty minutes: 1800 
     */
    KeyRotationIntervalSeconds?: EncryptionKeyRotationIntervalSecondsInteger;
    /**
     * The parameters for the SPEKE key provider.
     */
    SpekeKeyProvider: SpekeKeyProvider;
  }
  export type EncryptionConstantInitializationVectorString = string;
  export interface EncryptionContractConfiguration {
    /**
     * A collection of audio encryption presets. Value description:    PRESET-AUDIO-1 - Use one content key to encrypt all of the audio tracks in your stream.   PRESET-AUDIO-2 - Use one content key to encrypt all of the stereo audio tracks and one content key to encrypt all of the multichannel audio tracks.   PRESET-AUDIO-3 - Use one content key to encrypt all of the stereo audio tracks, one content key to encrypt all of the multichannel audio tracks with 3 to 6 channels, and one content key to encrypt all of the multichannel audio tracks with more than 6 channels.   SHARED - Use the same content key for all of the audio and video tracks in your stream.   UNENCRYPTED - Don't encrypt any of the audio tracks in your stream.  
     */
    PresetSpeke20Audio: PresetSpeke20Audio;
    /**
     * A collection of video encryption presets. Value description:    PRESET-VIDEO-1 - Use one content key to encrypt all of the video tracks in your stream.   PRESET-VIDEO-2 - Use one content key to encrypt all of the SD video tracks and one content key for all HD and higher resolutions video tracks.   PRESET-VIDEO-3 - Use one content key to encrypt all of the SD video tracks, one content key for HD video tracks and one content key for all UHD video tracks.   PRESET-VIDEO-4 - Use one content key to encrypt all of the SD video tracks, one content key for HD video tracks, one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.   PRESET-VIDEO-5 - Use one content key to encrypt all of the SD video tracks, one content key for HD1 video tracks, one content key for HD2 video tracks, one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.   PRESET-VIDEO-6 - Use one content key to encrypt all of the SD video tracks, one content key for HD1 video tracks, one content key for HD2 video tracks and one content key for all UHD video tracks.   PRESET-VIDEO-7 - Use one content key to encrypt all of the SD+HD1 video tracks, one content key for HD2 video tracks and one content key for all UHD video tracks.   PRESET-VIDEO-8 - Use one content key to encrypt all of the SD+HD1 video tracks, one content key for HD2 video tracks, one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.   SHARED - Use the same content key for all of the video and audio tracks in your stream.   UNENCRYPTED - Don't encrypt any of the video tracks in your stream.  
     */
    PresetSpeke20Video: PresetSpeke20Video;
  }
  export type EncryptionKeyRotationIntervalSecondsInteger = number;
  export interface EncryptionMethod {
    /**
     * The encryption method to use.
     */
    TsEncryptionMethod?: TsEncryptionMethod;
    /**
     * The encryption method to use.
     */
    CmafEncryptionMethod?: CmafEncryptionMethod;
  }
  export interface GetChannelGroupRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
  }
  export interface GetChannelGroupResponse {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: String;
    /**
     * The Amazon Resource Name (ARN) associated with the resource.
     */
    Arn: String;
    /**
     * The output domain where the source stream should be sent. Integrate the domain with a downstream CDN (such as Amazon CloudFront) or playback device.
     */
    EgressDomain: String;
    /**
     * The date and time the channel group was created.
     */
    CreatedAt: Timestamp;
    /**
     * The date and time the channel group was modified.
     */
    ModifiedAt: Timestamp;
    /**
     * The description for your channel group.
     */
    Description?: String;
    /**
     * The comma-separated list of tag key:value pairs assigned to the channel group.
     */
    Tags?: TagMap;
  }
  export interface GetChannelPolicyRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
  }
  export interface GetChannelPolicyResponse {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: String;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group.
     */
    ChannelName: String;
    /**
     * The policy assigned to the channel.
     */
    Policy: String;
  }
  export interface GetChannelRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
  }
  export interface GetChannelResponse {
    /**
     * The Amazon Resource Name (ARN) associated with the resource.
     */
    Arn: String;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group.
     */
    ChannelName: String;
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: String;
    /**
     * The date and time the channel was created.
     */
    CreatedAt: Timestamp;
    /**
     * The date and time the channel was modified.
     */
    ModifiedAt: Timestamp;
    /**
     * The description for your channel.
     */
    Description?: String;
    IngestEndpoints?: IngestEndpointList;
    /**
     * The comma-separated list of tag key:value pairs assigned to the channel.
     */
    Tags?: TagMap;
  }
  export interface GetHlsManifestConfiguration {
    /**
     * A short short string that's appended to the endpoint URL. The manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default manifest name, index. MediaPackage automatically inserts the format extension, such as .m3u8. You can't use the same manifest name if you use HLS manifest and low-latency HLS manifest. The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
     */
    ManifestName: ResourceName;
    /**
     * The egress domain URL for stream delivery from MediaPackage.
     */
    Url: String;
    /**
     * A short string that's appended to the endpoint URL. The child manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default child manifest name, index_1. The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
     */
    ChildManifestName?: ResourceName;
    /**
     * The total duration (in seconds) of the manifest's content.
     */
    ManifestWindowSeconds?: Integer;
    /**
     * Inserts EXT-X-PROGRAM-DATE-TIME tags in the output manifest at the interval that you specify. If you don't enter an interval, EXT-X-PROGRAM-DATE-TIME tags aren't included in the manifest. The tags sync the stream to the wall clock so that viewers can seek to a specific time in the playback timeline on the player. ID3Timed metadata messages generate every 5 seconds whenever the content is ingested. Irrespective of this parameter, if any ID3Timed metadata is in the HLS input, it is passed through to the HLS output.
     */
    ProgramDateTimeIntervalSeconds?: Integer;
    ScteHls?: ScteHls;
  }
  export type GetHlsManifests = GetHlsManifestConfiguration[];
  export interface GetLowLatencyHlsManifestConfiguration {
    /**
     * A short short string that's appended to the endpoint URL. The manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default manifest name, index. MediaPackage automatically inserts the format extension, such as .m3u8. You can't use the same manifest name if you use HLS manifest and low-latency HLS manifest. The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
     */
    ManifestName: ResourceName;
    /**
     * The egress domain URL for stream delivery from MediaPackage.
     */
    Url: String;
    /**
     * A short string that's appended to the endpoint URL. The child manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default child manifest name, index_1. The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
     */
    ChildManifestName?: ResourceName;
    /**
     * The total duration (in seconds) of the manifest's content.
     */
    ManifestWindowSeconds?: Integer;
    /**
     * Inserts EXT-X-PROGRAM-DATE-TIME tags in the output manifest at the interval that you specify. If you don't enter an interval, EXT-X-PROGRAM-DATE-TIME tags aren't included in the manifest. The tags sync the stream to the wall clock so that viewers can seek to a specific time in the playback timeline on the player. ID3Timed metadata messages generate every 5 seconds whenever the content is ingested. Irrespective of this parameter, if any ID3Timed metadata is in the HLS input, it is passed through to the HLS output.
     */
    ProgramDateTimeIntervalSeconds?: Integer;
    ScteHls?: ScteHls;
  }
  export type GetLowLatencyHlsManifests = GetLowLatencyHlsManifestConfiguration[];
  export interface GetOriginEndpointPolicyRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
    /**
     * The name that describes the origin endpoint. The name is the primary identifier for the origin endpoint, and and must be unique for your account in the AWS Region and channel. 
     */
    OriginEndpointName: ResourceName;
  }
  export interface GetOriginEndpointPolicyResponse {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: String;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group.
     */
    ChannelName: String;
    /**
     * The name that describes the origin endpoint. The name is the primary identifier for the origin endpoint, and and must be unique for your account in the AWS Region and channel.
     */
    OriginEndpointName: String;
    /**
     * The policy assigned to the origin endpoint.
     */
    Policy: String;
  }
  export interface GetOriginEndpointRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
    /**
     * The name that describes the origin endpoint. The name is the primary identifier for the origin endpoint, and and must be unique for your account in the AWS Region and channel. 
     */
    OriginEndpointName: ResourceName;
  }
  export interface GetOriginEndpointResponse {
    /**
     * The Amazon Resource Name (ARN) associated with the resource.
     */
    Arn: String;
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group.
     */
    ChannelName: ResourceName;
    /**
     * The name that describes the origin endpoint. The name is the primary identifier for the origin endpoint, and and must be unique for your account in the AWS Region and channel.
     */
    OriginEndpointName: ResourceName;
    /**
     * The type of container attached to this origin endpoint.
     */
    ContainerType: ContainerType;
    Segment: Segment;
    /**
     * The date and time the origin endpoint was created.
     */
    CreatedAt: Timestamp;
    /**
     * The date and time the origin endpoint was modified.
     */
    ModifiedAt: Timestamp;
    /**
     * The description for your origin endpoint.
     */
    Description?: ResourceDescription;
    /**
     * The size of the window (in seconds) to create a window of the live stream that's available for on-demand viewing. Viewers can start-over or catch-up on content that falls within the window.
     */
    StartoverWindowSeconds?: Integer;
    /**
     * An HTTP live streaming (HLS) manifest configuration.
     */
    HlsManifests?: GetHlsManifests;
    /**
     * A low-latency HLS manifest configuration.
     */
    LowLatencyHlsManifests?: GetLowLatencyHlsManifests;
    /**
     * The comma-separated list of tag key:value pairs assigned to the origin endpoint.
     */
    Tags?: TagMap;
  }
  export type IdempotencyToken = string;
  export interface IngestEndpoint {
    /**
     * The system-generated unique identifier for the IngestEndpoint.
     */
    Id?: String;
    /**
     * The ingest domain URL where the source stream should be sent.
     */
    Url?: String;
  }
  export type IngestEndpointList = IngestEndpoint[];
  export type Integer = number;
  export interface ListChannelGroupsRequest {
    /**
     * The maximum number of results to return in the response.
     */
    MaxResults?: ListResourceMaxResults;
    /**
     * The pagination token from the GET list request. Use the token to fetch the next page of results.
     */
    NextToken?: String;
  }
  export interface ListChannelGroupsResponse {
    /**
     * The objects being returned.
     */
    Items?: ChannelGroupsList;
    /**
     * The pagination token from the GET list request. Use the token to fetch the next page of results.
     */
    NextToken?: String;
  }
  export interface ListChannelsRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The maximum number of results to return in the response.
     */
    MaxResults?: ListResourceMaxResults;
    /**
     * The pagination token from the GET list request. Use the token to fetch the next page of results.
     */
    NextToken?: String;
  }
  export interface ListChannelsResponse {
    /**
     * The objects being returned.
     */
    Items?: ChannelList;
    /**
     * The pagination token from the GET list request.
     */
    NextToken?: String;
  }
  export interface ListHlsManifestConfiguration {
    /**
     * A short short string that's appended to the endpoint URL. The manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default manifest name, index. MediaPackage automatically inserts the format extension, such as .m3u8. You can't use the same manifest name if you use HLS manifest and low-latency HLS manifest. The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
     */
    ManifestName: ResourceName;
    /**
     * A short string that's appended to the endpoint URL. The child manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default child manifest name, index_1. The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
     */
    ChildManifestName?: ResourceName;
    /**
     * The egress domain URL for stream delivery from MediaPackage.
     */
    Url?: String;
  }
  export type ListHlsManifests = ListHlsManifestConfiguration[];
  export interface ListLowLatencyHlsManifestConfiguration {
    /**
     * A short short string that's appended to the endpoint URL. The manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default manifest name, index. MediaPackage automatically inserts the format extension, such as .m3u8. You can't use the same manifest name if you use HLS manifest and low-latency HLS manifest. The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
     */
    ManifestName: ResourceName;
    /**
     * A short string that's appended to the endpoint URL. The child manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default child manifest name, index_1. The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
     */
    ChildManifestName?: ResourceName;
    /**
     * The egress domain URL for stream delivery from MediaPackage.
     */
    Url?: String;
  }
  export type ListLowLatencyHlsManifests = ListLowLatencyHlsManifestConfiguration[];
  export interface ListOriginEndpointsRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
    /**
     * The maximum number of results to return in the response.
     */
    MaxResults?: ListResourceMaxResults;
    /**
     * The pagination token from the GET list request. Use the token to fetch the next page of results.
     */
    NextToken?: String;
  }
  export interface ListOriginEndpointsResponse {
    /**
     * The objects being returned.
     */
    Items?: OriginEndpointsList;
    /**
     * The pagination token from the GET list request. Use the token to fetch the next page of results.
     */
    NextToken?: String;
  }
  export type ListResourceMaxResults = number;
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the CloudWatch resource that you want to view tags for.
     */
    ResourceArn: TagArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the resource.
     */
    Tags?: TagMap;
  }
  export type ManifestName = string;
  export interface OriginEndpointListConfiguration {
    /**
     * The Amazon Resource Name (ARN) associated with the resource.
     */
    Arn: String;
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
    /**
     * The name that describes the origin endpoint. The name is the primary identifier for the origin endpoint, and and must be unique for your account in the AWS Region and channel. 
     */
    OriginEndpointName: ResourceName;
    /**
     * The type of container attached to this origin endpoint. A container type is a file format that encapsulates one or more media streams, such as audio and video, into a single file. 
     */
    ContainerType: ContainerType;
    /**
     * Any descriptive information that you want to add to the origin endpoint for future identification purposes.
     */
    Description?: ResourceDescription;
    /**
     * The date and time the origin endpoint was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The date and time the origin endpoint was modified.
     */
    ModifiedAt?: Timestamp;
    /**
     * An HTTP live streaming (HLS) manifest configuration.
     */
    HlsManifests?: ListHlsManifests;
    /**
     * A low-latency HLS manifest configuration.
     */
    LowLatencyHlsManifests?: ListLowLatencyHlsManifests;
  }
  export type OriginEndpointsList = OriginEndpointListConfiguration[];
  export type PolicyText = string;
  export type PresetSpeke20Audio = "PRESET_AUDIO_1"|"PRESET_AUDIO_2"|"PRESET_AUDIO_3"|"SHARED"|"UNENCRYPTED"|string;
  export type PresetSpeke20Video = "PRESET_VIDEO_1"|"PRESET_VIDEO_2"|"PRESET_VIDEO_3"|"PRESET_VIDEO_4"|"PRESET_VIDEO_5"|"PRESET_VIDEO_6"|"PRESET_VIDEO_7"|"PRESET_VIDEO_8"|"SHARED"|"UNENCRYPTED"|string;
  export interface PutChannelPolicyRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
    /**
     * The policy to attach to the specified channel.
     */
    Policy: PolicyText;
  }
  export interface PutChannelPolicyResponse {
  }
  export interface PutOriginEndpointPolicyRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
    /**
     * The name that describes the origin endpoint. The name is the primary identifier for the origin endpoint, and and must be unique for your account in the AWS Region and channel. 
     */
    OriginEndpointName: ResourceName;
    /**
     * The policy to attach to the specified origin endpoint.
     */
    Policy: PolicyText;
  }
  export interface PutOriginEndpointPolicyResponse {
  }
  export type ResourceDescription = string;
  export type ResourceName = string;
  export interface Scte {
    /**
     * The SCTE-35 message types that you want to be treated as ad markers in the output.
     */
    ScteFilter?: ScteFilterList;
  }
  export type ScteFilter = "SPLICE_INSERT"|"BREAK"|"PROVIDER_ADVERTISEMENT"|"DISTRIBUTOR_ADVERTISEMENT"|"PROVIDER_PLACEMENT_OPPORTUNITY"|"DISTRIBUTOR_PLACEMENT_OPPORTUNITY"|"PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY"|"DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY"|"PROGRAM"|string;
  export type ScteFilterList = ScteFilter[];
  export interface ScteHls {
    /**
     * Ad markers indicate when ads should be inserted during playback. If you include ad markers in the content stream in your upstream encoders, then you need to inform MediaPackage what to do with the ad markers in the output. Choose what you want MediaPackage to do with the ad markers. Value description:    DATERANGE - Insert EXT-X-DATERANGE tags to signal ad and program transition events in TS and CMAF manifests. If you use DATERANGE, you must set a programDateTimeIntervalSeconds value of 1 or higher. To learn more about DATERANGE, see SCTE-35 Ad Marker EXT-X-DATERANGE.  
     */
    AdMarkerHls?: AdMarkerHls;
  }
  export interface Segment {
    /**
     * The duration (in seconds) of each segment. Enter a value equal to, or a multiple of, the input segment duration. If the value that you enter is different from the input segment duration, MediaPackage rounds segments to the nearest multiple of the input segment duration.
     */
    SegmentDurationSeconds?: SegmentSegmentDurationSecondsInteger;
    /**
     * The name that describes the segment. The name is the base name of the segment used in all content manifests inside of the endpoint. You can't use spaces in the name.
     */
    SegmentName?: SegmentSegmentNameString;
    /**
     * When selected, MediaPackage bundles all audio tracks in a rendition group. All other tracks in the stream can be used with any audio rendition from the group.
     */
    TsUseAudioRenditionGroup?: Boolean;
    /**
     * When selected, the stream set includes an additional I-frame only stream, along with the other tracks. If false, this extra stream is not included. MediaPackage generates an I-frame only stream from the first rendition in the manifest. The service inserts EXT-I-FRAMES-ONLY tags in the output manifest, and then generates and includes an I-frames only playlist in the stream. This playlist permits player functionality like fast forward and rewind.
     */
    IncludeIframeOnlyStreams?: Boolean;
    /**
     * By default, MediaPackage excludes all digital video broadcasting (DVB) subtitles from the output. When selected, MediaPackage passes through DVB subtitles into the output.
     */
    TsIncludeDvbSubtitles?: Boolean;
    /**
     * The SCTE configuration options in the segment settings.
     */
    Scte?: Scte;
    Encryption?: Encryption;
  }
  export type SegmentSegmentDurationSecondsInteger = number;
  export type SegmentSegmentNameString = string;
  export interface SpekeKeyProvider {
    /**
     * Configure one or more content encryption keys for your endpoints that use SPEKE Version 2.0. The encryption contract defines which content keys are used to encrypt the audio and video tracks in your stream. To configure the encryption contract, specify which audio and video encryption presets to use.
     */
    EncryptionContractConfiguration: EncryptionContractConfiguration;
    /**
     * The unique identifier for the content. The service sends this to the key server to identify the current endpoint. How unique you make this depends on how fine-grained you want access controls to be. The service does not permit you to use the same ID for two simultaneous encryption processes. The resource ID is also known as the content ID. The following example shows a resource ID: MovieNight20171126093045 
     */
    ResourceId: SpekeKeyProviderResourceIdString;
    /**
     * The DRM solution provider you're using to protect your content during distribution.
     */
    DrmSystems: SpekeKeyProviderDrmSystemsList;
    /**
     * The ARN for the IAM role granted by the key provider that provides access to the key provider API. This role must have a trust policy that allows MediaPackage to assume the role, and it must have a sufficient permissions policy to allow access to the specific key retrieval URL. Get this from your DRM solution provider. Valid format: arn:aws:iam::{accountID}:role/{name}. The following example shows a role ARN: arn:aws:iam::444455556666:role/SpekeAccess 
     */
    RoleArn: SpekeKeyProviderRoleArnString;
    /**
     * The URL of the API Gateway proxy that you set up to talk to your key server. The API Gateway proxy must reside in the same AWS Region as MediaPackage and must start with https://. The following example shows a URL: https://1wm2dx1f33.execute-api.us-west-2.amazonaws.com/SpekeSample/copyProtection 
     */
    Url: SpekeKeyProviderUrlString;
  }
  export type SpekeKeyProviderDrmSystemsList = DrmSystem[];
  export type SpekeKeyProviderResourceIdString = string;
  export type SpekeKeyProviderRoleArnString = string;
  export type SpekeKeyProviderUrlString = string;
  export type String = string;
  export type TagArn = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the MediaPackage resource that you're adding tags to.
     */
    ResourceArn: TagArn;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the resource.
     */
    Tags: TagMap;
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export type TsEncryptionMethod = "AES_128"|"SAMPLE_AES"|string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the MediaPackage resource that you're removing tags from.
     */
    ResourceArn: TagArn;
    /**
     * The list of tag keys to remove from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UpdateChannelGroupRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * Any descriptive information that you want to add to the channel group for future identification purposes.
     */
    Description?: ResourceDescription;
  }
  export interface UpdateChannelGroupResponse {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: String;
    /**
     * The Amazon Resource Name (ARN) associated with the resource.
     */
    Arn: String;
    /**
     * The output domain where the source stream is sent. Integrate the domain with a downstream CDN (such as Amazon CloudFront) or playback device.
     */
    EgressDomain: String;
    /**
     * The date and time the channel group was created.
     */
    CreatedAt: Timestamp;
    /**
     * The date and time the channel group was modified.
     */
    ModifiedAt: Timestamp;
    /**
     * The description for your channel group.
     */
    Description?: String;
    /**
     * The comma-separated list of tag key:value pairs assigned to the channel group.
     */
    Tags?: TagMap;
  }
  export interface UpdateChannelRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
    /**
     * Any descriptive information that you want to add to the channel for future identification purposes.
     */
    Description?: ResourceDescription;
  }
  export interface UpdateChannelResponse {
    /**
     * The Amazon Resource Name (ARN) associated with the resource.
     */
    Arn: String;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group.
     */
    ChannelName: String;
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: String;
    /**
     * The date and time the channel was created.
     */
    CreatedAt: Timestamp;
    /**
     * The date and time the channel was modified.
     */
    ModifiedAt: Timestamp;
    /**
     * The description for your channel.
     */
    Description?: String;
    IngestEndpoints?: IngestEndpointList;
    /**
     * The comma-separated list of tag key:value pairs assigned to the channel.
     */
    Tags?: TagMap;
  }
  export interface UpdateOriginEndpointRequest {
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group. 
     */
    ChannelName: ResourceName;
    /**
     * The name that describes the origin endpoint. The name is the primary identifier for the origin endpoint, and and must be unique for your account in the AWS Region and channel. 
     */
    OriginEndpointName: ResourceName;
    /**
     * The type of container attached to this origin endpoint. A container type is a file format that encapsulates one or more media streams, such as audio and video, into a single file. 
     */
    ContainerType: ContainerType;
    /**
     * The segment configuration, including the segment name, duration, and other configuration values.
     */
    Segment?: Segment;
    /**
     * Any descriptive information that you want to add to the origin endpoint for future identification purposes.
     */
    Description?: ResourceDescription;
    /**
     * The size of the window (in seconds) to create a window of the live stream that's available for on-demand viewing. Viewers can start-over or catch-up on content that falls within the window. The maximum startover window is 1,209,600 seconds (14 days).
     */
    StartoverWindowSeconds?: UpdateOriginEndpointRequestStartoverWindowSecondsInteger;
    /**
     * An HTTP live streaming (HLS) manifest configuration.
     */
    HlsManifests?: CreateHlsManifests;
    /**
     * A low-latency HLS manifest configuration.
     */
    LowLatencyHlsManifests?: CreateLowLatencyHlsManifests;
  }
  export type UpdateOriginEndpointRequestStartoverWindowSecondsInteger = number;
  export interface UpdateOriginEndpointResponse {
    /**
     * The ARN associated with the resource.
     */
    Arn: String;
    /**
     * The name that describes the channel group. The name is the primary identifier for the channel group, and must be unique for your account in the AWS Region.
     */
    ChannelGroupName: ResourceName;
    /**
     * The name that describes the channel. The name is the primary identifier for the channel, and must be unique for your account in the AWS Region and channel group.
     */
    ChannelName: ResourceName;
    /**
     * The name that describes the origin endpoint. The name is the primary identifier for the origin endpoint, and and must be unique for your account in the AWS Region and channel.
     */
    OriginEndpointName: ResourceName;
    /**
     * The type of container attached to this origin endpoint.
     */
    ContainerType: ContainerType;
    /**
     * The segment configuration, including the segment name, duration, and other configuration values.
     */
    Segment: Segment;
    /**
     * The date and time the origin endpoint was created.
     */
    CreatedAt: Timestamp;
    /**
     * The date and time the origin endpoint was modified.
     */
    ModifiedAt: Timestamp;
    /**
     * The description of the origin endpoint.
     */
    Description?: ResourceDescription;
    /**
     * The size of the window (in seconds) to create a window of the live stream that's available for on-demand viewing. Viewers can start-over or catch-up on content that falls within the window.
     */
    StartoverWindowSeconds?: Integer;
    /**
     * An HTTP live streaming (HLS) manifest configuration.
     */
    HlsManifests?: GetHlsManifests;
    /**
     * A low-latency HLS manifest configuration.
     */
    LowLatencyHlsManifests?: GetLowLatencyHlsManifests;
    /**
     * The comma-separated list of tag key:value pairs assigned to the origin endpoint.
     */
    Tags?: TagMap;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-12-25"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MediaPackageV2 client.
   */
  export import Types = MediaPackageV2;
}
export = MediaPackageV2;
