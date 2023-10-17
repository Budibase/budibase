import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ChimeSDKMeetings extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ChimeSDKMeetings.Types.ClientConfiguration)
  config: Config & ChimeSDKMeetings.Types.ClientConfiguration;
  /**
   * Creates up to 100 attendees for an active Amazon Chime SDK meeting. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide.
   */
  batchCreateAttendee(params: ChimeSDKMeetings.Types.BatchCreateAttendeeRequest, callback?: (err: AWSError, data: ChimeSDKMeetings.Types.BatchCreateAttendeeResponse) => void): Request<ChimeSDKMeetings.Types.BatchCreateAttendeeResponse, AWSError>;
  /**
   * Creates up to 100 attendees for an active Amazon Chime SDK meeting. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide.
   */
  batchCreateAttendee(callback?: (err: AWSError, data: ChimeSDKMeetings.Types.BatchCreateAttendeeResponse) => void): Request<ChimeSDKMeetings.Types.BatchCreateAttendeeResponse, AWSError>;
  /**
   * Updates AttendeeCapabilities except the capabilities listed in an ExcludedAttendeeIds table.  You use the capabilities with a set of values that control what the capabilities can do, such as SendReceive data. For more information about those values, see .  When using capabilities, be aware of these corner cases:   You can't set content capabilities to SendReceive or Receive unless you also set video capabilities to SendReceive or Receive. If you don't set the video capability to receive, the response will contain an HTTP 400 Bad Request status code. However, you can set your video capability to receive and you set your content capability to not receive.   When you change an audio capability from None or Receive to Send or SendReceive , and if the attendee left their microphone unmuted, audio will flow from the attendee to the other meeting participants.   When you change a video or content capability from None or Receive to Send or SendReceive , and if the attendee turned on their video or content streams, remote attendees can receive those streams, but only after media renegotiation between the client and the Amazon Chime back-end server.  
   */
  batchUpdateAttendeeCapabilitiesExcept(params: ChimeSDKMeetings.Types.BatchUpdateAttendeeCapabilitiesExceptRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates AttendeeCapabilities except the capabilities listed in an ExcludedAttendeeIds table.  You use the capabilities with a set of values that control what the capabilities can do, such as SendReceive data. For more information about those values, see .  When using capabilities, be aware of these corner cases:   You can't set content capabilities to SendReceive or Receive unless you also set video capabilities to SendReceive or Receive. If you don't set the video capability to receive, the response will contain an HTTP 400 Bad Request status code. However, you can set your video capability to receive and you set your content capability to not receive.   When you change an audio capability from None or Receive to Send or SendReceive , and if the attendee left their microphone unmuted, audio will flow from the attendee to the other meeting participants.   When you change a video or content capability from None or Receive to Send or SendReceive , and if the attendee turned on their video or content streams, remote attendees can receive those streams, but only after media renegotiation between the client and the Amazon Chime back-end server.  
   */
  batchUpdateAttendeeCapabilitiesExcept(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Creates a new attendee for an active Amazon Chime SDK meeting. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide. 
   */
  createAttendee(params: ChimeSDKMeetings.Types.CreateAttendeeRequest, callback?: (err: AWSError, data: ChimeSDKMeetings.Types.CreateAttendeeResponse) => void): Request<ChimeSDKMeetings.Types.CreateAttendeeResponse, AWSError>;
  /**
   *  Creates a new attendee for an active Amazon Chime SDK meeting. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide. 
   */
  createAttendee(callback?: (err: AWSError, data: ChimeSDKMeetings.Types.CreateAttendeeResponse) => void): Request<ChimeSDKMeetings.Types.CreateAttendeeResponse, AWSError>;
  /**
   * Creates a new Amazon Chime SDK meeting in the specified media Region with no initial attendees. For more information about specifying media Regions, see Amazon Chime SDK Media Regions in the Amazon Chime Developer Guide. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide. 
   */
  createMeeting(params: ChimeSDKMeetings.Types.CreateMeetingRequest, callback?: (err: AWSError, data: ChimeSDKMeetings.Types.CreateMeetingResponse) => void): Request<ChimeSDKMeetings.Types.CreateMeetingResponse, AWSError>;
  /**
   * Creates a new Amazon Chime SDK meeting in the specified media Region with no initial attendees. For more information about specifying media Regions, see Amazon Chime SDK Media Regions in the Amazon Chime Developer Guide. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide. 
   */
  createMeeting(callback?: (err: AWSError, data: ChimeSDKMeetings.Types.CreateMeetingResponse) => void): Request<ChimeSDKMeetings.Types.CreateMeetingResponse, AWSError>;
  /**
   *  Creates a new Amazon Chime SDK meeting in the specified media Region, with attendees. For more information about specifying media Regions, see Amazon Chime SDK Media Regions in the Amazon Chime Developer Guide. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide. 
   */
  createMeetingWithAttendees(params: ChimeSDKMeetings.Types.CreateMeetingWithAttendeesRequest, callback?: (err: AWSError, data: ChimeSDKMeetings.Types.CreateMeetingWithAttendeesResponse) => void): Request<ChimeSDKMeetings.Types.CreateMeetingWithAttendeesResponse, AWSError>;
  /**
   *  Creates a new Amazon Chime SDK meeting in the specified media Region, with attendees. For more information about specifying media Regions, see Amazon Chime SDK Media Regions in the Amazon Chime Developer Guide. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide. 
   */
  createMeetingWithAttendees(callback?: (err: AWSError, data: ChimeSDKMeetings.Types.CreateMeetingWithAttendeesResponse) => void): Request<ChimeSDKMeetings.Types.CreateMeetingWithAttendeesResponse, AWSError>;
  /**
   * Deletes an attendee from the specified Amazon Chime SDK meeting and deletes their JoinToken. Attendees are automatically deleted when a Amazon Chime SDK meeting is deleted. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide.
   */
  deleteAttendee(params: ChimeSDKMeetings.Types.DeleteAttendeeRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an attendee from the specified Amazon Chime SDK meeting and deletes their JoinToken. Attendees are automatically deleted when a Amazon Chime SDK meeting is deleted. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide.
   */
  deleteAttendee(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified Amazon Chime SDK meeting. The operation deletes all attendees, disconnects all clients, and prevents new clients from joining the meeting. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide.
   */
  deleteMeeting(params: ChimeSDKMeetings.Types.DeleteMeetingRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified Amazon Chime SDK meeting. The operation deletes all attendees, disconnects all clients, and prevents new clients from joining the meeting. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide.
   */
  deleteMeeting(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Gets the Amazon Chime SDK attendee details for a specified meeting ID and attendee ID. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide. 
   */
  getAttendee(params: ChimeSDKMeetings.Types.GetAttendeeRequest, callback?: (err: AWSError, data: ChimeSDKMeetings.Types.GetAttendeeResponse) => void): Request<ChimeSDKMeetings.Types.GetAttendeeResponse, AWSError>;
  /**
   *  Gets the Amazon Chime SDK attendee details for a specified meeting ID and attendee ID. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide. 
   */
  getAttendee(callback?: (err: AWSError, data: ChimeSDKMeetings.Types.GetAttendeeResponse) => void): Request<ChimeSDKMeetings.Types.GetAttendeeResponse, AWSError>;
  /**
   * Gets the Amazon Chime SDK meeting details for the specified meeting ID. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide.
   */
  getMeeting(params: ChimeSDKMeetings.Types.GetMeetingRequest, callback?: (err: AWSError, data: ChimeSDKMeetings.Types.GetMeetingResponse) => void): Request<ChimeSDKMeetings.Types.GetMeetingResponse, AWSError>;
  /**
   * Gets the Amazon Chime SDK meeting details for the specified meeting ID. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide.
   */
  getMeeting(callback?: (err: AWSError, data: ChimeSDKMeetings.Types.GetMeetingResponse) => void): Request<ChimeSDKMeetings.Types.GetMeetingResponse, AWSError>;
  /**
   *  Lists the attendees for the specified Amazon Chime SDK meeting. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide. 
   */
  listAttendees(params: ChimeSDKMeetings.Types.ListAttendeesRequest, callback?: (err: AWSError, data: ChimeSDKMeetings.Types.ListAttendeesResponse) => void): Request<ChimeSDKMeetings.Types.ListAttendeesResponse, AWSError>;
  /**
   *  Lists the attendees for the specified Amazon Chime SDK meeting. For more information about the Amazon Chime SDK, see Using the Amazon Chime SDK in the Amazon Chime Developer Guide. 
   */
  listAttendees(callback?: (err: AWSError, data: ChimeSDKMeetings.Types.ListAttendeesResponse) => void): Request<ChimeSDKMeetings.Types.ListAttendeesResponse, AWSError>;
  /**
   * Returns a list of the tags available for the specified resource.
   */
  listTagsForResource(params: ChimeSDKMeetings.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ChimeSDKMeetings.Types.ListTagsForResourceResponse) => void): Request<ChimeSDKMeetings.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of the tags available for the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ChimeSDKMeetings.Types.ListTagsForResourceResponse) => void): Request<ChimeSDKMeetings.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Starts transcription for the specified meetingId. For more information, refer to  Using Amazon Chime SDK live transcription  in the Amazon Chime SDK Developer Guide. If you specify an invalid configuration, a TranscriptFailed event will be sent with the contents of the BadRequestException generated by Amazon Transcribe. For more information on each parameter and which combinations are valid, refer to the StartStreamTranscription API in the Amazon Transcribe Developer Guide.  Amazon Chime SDK live transcription is powered by Amazon Transcribe. Use of Amazon Transcribe is subject to the AWS Service Terms, including the terms specific to the AWS Machine Learning and Artificial Intelligence Services. 
   */
  startMeetingTranscription(params: ChimeSDKMeetings.Types.StartMeetingTranscriptionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts transcription for the specified meetingId. For more information, refer to  Using Amazon Chime SDK live transcription  in the Amazon Chime SDK Developer Guide. If you specify an invalid configuration, a TranscriptFailed event will be sent with the contents of the BadRequestException generated by Amazon Transcribe. For more information on each parameter and which combinations are valid, refer to the StartStreamTranscription API in the Amazon Transcribe Developer Guide.  Amazon Chime SDK live transcription is powered by Amazon Transcribe. Use of Amazon Transcribe is subject to the AWS Service Terms, including the terms specific to the AWS Machine Learning and Artificial Intelligence Services. 
   */
  startMeetingTranscription(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops transcription for the specified meetingId. For more information, refer to  Using Amazon Chime SDK live transcription  in the Amazon Chime SDK Developer Guide.  Amazon Chime SDK live transcription is powered by Amazon Transcribe. Use of Amazon Transcribe is subject to the AWS Service Terms, including the terms specific to the AWS Machine Learning and Artificial Intelligence Services. 
   */
  stopMeetingTranscription(params: ChimeSDKMeetings.Types.StopMeetingTranscriptionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops transcription for the specified meetingId. For more information, refer to  Using Amazon Chime SDK live transcription  in the Amazon Chime SDK Developer Guide.  Amazon Chime SDK live transcription is powered by Amazon Transcribe. Use of Amazon Transcribe is subject to the AWS Service Terms, including the terms specific to the AWS Machine Learning and Artificial Intelligence Services. 
   */
  stopMeetingTranscription(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * The resource that supports tags.
   */
  tagResource(params: ChimeSDKMeetings.Types.TagResourceRequest, callback?: (err: AWSError, data: ChimeSDKMeetings.Types.TagResourceResponse) => void): Request<ChimeSDKMeetings.Types.TagResourceResponse, AWSError>;
  /**
   * The resource that supports tags.
   */
  tagResource(callback?: (err: AWSError, data: ChimeSDKMeetings.Types.TagResourceResponse) => void): Request<ChimeSDKMeetings.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resources. When you specify a tag key, the action removes both that key and its associated value. The operation succeeds even if you attempt to remove tags from a resource that were already removed. Note the following:   To remove tags from a resource, you need the necessary permissions for the service that the resource belongs to as well as permissions for removing tags. For more information, see the documentation for the service whose resource you want to untag.   You can only tag resources that are located in the specified AWS Region for the calling AWS account.    Minimum permissions  In addition to the tag:UntagResources permission required by this operation, you must also have the remove tags permission defined by the service that created the resource. For example, to remove the tags from an Amazon EC2 instance using the UntagResources operation, you must have both of the following permissions:  tag:UntagResource   ChimeSDKMeetings:DeleteTags 
   */
  untagResource(params: ChimeSDKMeetings.Types.UntagResourceRequest, callback?: (err: AWSError, data: ChimeSDKMeetings.Types.UntagResourceResponse) => void): Request<ChimeSDKMeetings.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resources. When you specify a tag key, the action removes both that key and its associated value. The operation succeeds even if you attempt to remove tags from a resource that were already removed. Note the following:   To remove tags from a resource, you need the necessary permissions for the service that the resource belongs to as well as permissions for removing tags. For more information, see the documentation for the service whose resource you want to untag.   You can only tag resources that are located in the specified AWS Region for the calling AWS account.    Minimum permissions  In addition to the tag:UntagResources permission required by this operation, you must also have the remove tags permission defined by the service that created the resource. For example, to remove the tags from an Amazon EC2 instance using the UntagResources operation, you must have both of the following permissions:  tag:UntagResource   ChimeSDKMeetings:DeleteTags 
   */
  untagResource(callback?: (err: AWSError, data: ChimeSDKMeetings.Types.UntagResourceResponse) => void): Request<ChimeSDKMeetings.Types.UntagResourceResponse, AWSError>;
  /**
   * The capabilities that you want to update.  You use the capabilities with a set of values that control what the capabilities can do, such as SendReceive data. For more information about those values, see .  When using capabilities, be aware of these corner cases:   You can't set content capabilities to SendReceive or Receive unless you also set video capabilities to SendReceive or Receive. If you don't set the video capability to receive, the response will contain an HTTP 400 Bad Request status code. However, you can set your video capability to receive and you set your content capability to not receive.   When you change an audio capability from None or Receive to Send or SendReceive , and if the attendee left their microphone unmuted, audio will flow from the attendee to the other meeting participants.   When you change a video or content capability from None or Receive to Send or SendReceive , and if the attendee turned on their video or content streams, remote attendees can receive those streams, but only after media renegotiation between the client and the Amazon Chime back-end server.  
   */
  updateAttendeeCapabilities(params: ChimeSDKMeetings.Types.UpdateAttendeeCapabilitiesRequest, callback?: (err: AWSError, data: ChimeSDKMeetings.Types.UpdateAttendeeCapabilitiesResponse) => void): Request<ChimeSDKMeetings.Types.UpdateAttendeeCapabilitiesResponse, AWSError>;
  /**
   * The capabilities that you want to update.  You use the capabilities with a set of values that control what the capabilities can do, such as SendReceive data. For more information about those values, see .  When using capabilities, be aware of these corner cases:   You can't set content capabilities to SendReceive or Receive unless you also set video capabilities to SendReceive or Receive. If you don't set the video capability to receive, the response will contain an HTTP 400 Bad Request status code. However, you can set your video capability to receive and you set your content capability to not receive.   When you change an audio capability from None or Receive to Send or SendReceive , and if the attendee left their microphone unmuted, audio will flow from the attendee to the other meeting participants.   When you change a video or content capability from None or Receive to Send or SendReceive , and if the attendee turned on their video or content streams, remote attendees can receive those streams, but only after media renegotiation between the client and the Amazon Chime back-end server.  
   */
  updateAttendeeCapabilities(callback?: (err: AWSError, data: ChimeSDKMeetings.Types.UpdateAttendeeCapabilitiesResponse) => void): Request<ChimeSDKMeetings.Types.UpdateAttendeeCapabilitiesResponse, AWSError>;
}
declare namespace ChimeSDKMeetings {
  export type AmazonResourceName = string;
  export type Arn = string;
  export interface Attendee {
    /**
     * The Amazon Chime SDK external user ID. An idempotency token. Links the attendee to an identity managed by a builder application. Pattern: [-_&amp;@+=,(){}\[\]\/«».:|'"#a-zA-Z0-9À-ÿ\s]*  Values that begin with aws: are reserved. You can't configure a value that uses this prefix. Case insensitive.
     */
    ExternalUserId?: ExternalUserId;
    /**
     * The Amazon Chime SDK attendee ID.
     */
    AttendeeId?: GuidString;
    /**
     * The join token used by the Amazon Chime SDK attendee.
     */
    JoinToken?: JoinTokenString;
    /**
     * The capabilities assigned to an attendee: audio, video, or content.  You use the capabilities with a set of values that control what the capabilities can do, such as SendReceive data. For more information about those values, see .  When using capabilities, be aware of these corner cases:   You can't set content capabilities to SendReceive or Receive unless you also set video capabilities to SendReceive or Receive. If you don't set the video capability to receive, the response will contain an HTTP 400 Bad Request status code. However, you can set your video capability to receive and you set your content capability to not receive.   When you change an audio capability from None or Receive to Send or SendReceive , and if the attendee left their microphone unmuted, audio will flow from the attendee to the other meeting participants.   When you change a video or content capability from None or Receive to Send or SendReceive , and if the attendee turned on their video or content streams, remote attendees can receive those streams, but only after media renegotiation between the client and the Amazon Chime back-end server.  
     */
    Capabilities?: AttendeeCapabilities;
  }
  export interface AttendeeCapabilities {
    /**
     * The audio capability assigned to an attendee.
     */
    Audio: MediaCapabilities;
    /**
     * The video capability assigned to an attendee.
     */
    Video: MediaCapabilities;
    /**
     * The content capability assigned to an attendee.
     */
    Content: MediaCapabilities;
  }
  export interface AttendeeIdItem {
    /**
     * A list of one or more attendee IDs.
     */
    AttendeeId: GuidString;
  }
  export type AttendeeIdsList = AttendeeIdItem[];
  export type AttendeeList = Attendee[];
  export interface AudioFeatures {
    /**
     * Makes echo reduction available to clients who connect to the meeting.
     */
    EchoReduction?: MeetingFeatureStatus;
  }
  export type BatchCreateAttendeeErrorList = CreateAttendeeError[];
  export interface BatchCreateAttendeeRequest {
    /**
     * The Amazon Chime SDK ID of the meeting to which you're adding attendees.
     */
    MeetingId: GuidString;
    /**
     * The attendee information, including attendees' IDs and join tokens.
     */
    Attendees: CreateAttendeeRequestItemList;
  }
  export interface BatchCreateAttendeeResponse {
    /**
     * The attendee information, including attendees' IDs and join tokens.
     */
    Attendees?: AttendeeList;
    /**
     * If the action fails for one or more of the attendees in the request, a list of the attendees is returned, along with error codes and error messages.
     */
    Errors?: BatchCreateAttendeeErrorList;
  }
  export interface BatchUpdateAttendeeCapabilitiesExceptRequest {
    /**
     * The ID of the meeting associated with the update request.
     */
    MeetingId: GuidString;
    /**
     * The AttendeeIDs that you want to exclude from one or more capabilities.
     */
    ExcludedAttendeeIds: AttendeeIdsList;
    /**
     * The capabilities (audio, video, or content) that you want to update.
     */
    Capabilities: AttendeeCapabilities;
  }
  export type Boolean = boolean;
  export type ClientRequestToken = string;
  export interface CreateAttendeeError {
    /**
     * The Amazon Chime SDK external user ID. An idempotency token. Links the attendee to an identity managed by a builder application. Pattern: [-_&amp;@+=,(){}\[\]\/«».:|'"#a-zA-Z0-9À-ÿ\s]*  Values that begin with aws: are reserved. You can't configure a value that uses this prefix. Case insensitive.
     */
    ExternalUserId?: ExternalUserId;
    /**
     * The error code.
     */
    ErrorCode?: String;
    /**
     * The error message.
     */
    ErrorMessage?: String;
  }
  export interface CreateAttendeeRequest {
    /**
     * The unique ID of the meeting.
     */
    MeetingId: GuidString;
    /**
     * The Amazon Chime SDK external user ID. An idempotency token. Links the attendee to an identity managed by a builder application. Pattern: [-_&amp;@+=,(){}\[\]\/«».:|'"#a-zA-Z0-9À-ÿ\s]*  Values that begin with aws: are reserved. You can't configure a value that uses this prefix.
     */
    ExternalUserId: ExternalUserId;
    /**
     * The capabilities (audio, video, or content) that you want to grant an attendee. If you don't specify capabilities, all users have send and receive capabilities on all media channels by default.  You use the capabilities with a set of values that control what the capabilities can do, such as SendReceive data. For more information about those values, see .  When using capabilities, be aware of these corner cases:   You can't set content capabilities to SendReceive or Receive unless you also set video capabilities to SendReceive or Receive. If you don't set the video capability to receive, the response will contain an HTTP 400 Bad Request status code. However, you can set your video capability to receive and you set your content capability to not receive.   When you change an audio capability from None or Receive to Send or SendReceive , and if the attendee left their microphone unmuted, audio will flow from the attendee to the other meeting participants.   When you change a video or content capability from None or Receive to Send or SendReceive , and if the attendee turned on their video or content streams, remote attendees can receive those streams, but only after media renegotiation between the client and the Amazon Chime back-end server.  
     */
    Capabilities?: AttendeeCapabilities;
  }
  export interface CreateAttendeeRequestItem {
    /**
     * The Amazon Chime SDK external user ID. An idempotency token. Links the attendee to an identity managed by a builder application. Pattern: [-_&amp;@+=,(){}\[\]\/«».:|'"#a-zA-Z0-9À-ÿ\s]*  Values that begin with aws: are reserved. You can't configure a value that uses this prefix. Case insensitive.
     */
    ExternalUserId: ExternalUserId;
    /**
     * A list of one or more capabilities.
     */
    Capabilities?: AttendeeCapabilities;
  }
  export type CreateAttendeeRequestItemList = CreateAttendeeRequestItem[];
  export interface CreateAttendeeResponse {
    /**
     * The attendee information, including attendee ID and join token.
     */
    Attendee?: Attendee;
  }
  export interface CreateMeetingRequest {
    /**
     * The unique identifier for the client request. Use a different token for different meetings.
     */
    ClientRequestToken: ClientRequestToken;
    /**
     * The Region in which to create the meeting.  Available values: af-south-1, ap-northeast-1, ap-northeast-2, ap-south-1, ap-southeast-1, ap-southeast-2, ca-central-1, eu-central-1, eu-north-1, eu-south-1, eu-west-1, eu-west-2, eu-west-3, sa-east-1, us-east-1, us-east-2, us-west-1, us-west-2.  Available values in AWS GovCloud (US) Regions: us-gov-east-1, us-gov-west-1.
     */
    MediaRegion: MediaRegion;
    /**
     * Reserved.
     */
    MeetingHostId?: ExternalUserId;
    /**
     * The external meeting ID. Pattern: [-_&amp;@+=,(){}\[\]\/«».:|'"#a-zA-Z0-9À-ÿ\s]*  Values that begin with aws: are reserved. You can't configure a value that uses this prefix. Case insensitive.
     */
    ExternalMeetingId: ExternalMeetingId;
    /**
     * The configuration for resource targets to receive notifications when meeting and attendee events occur.
     */
    NotificationsConfiguration?: NotificationsConfiguration;
    /**
     * Lists the audio and video features enabled for a meeting, such as echo reduction.
     */
    MeetingFeatures?: MeetingFeaturesConfiguration;
    /**
     * When specified, replicates the media from the primary meeting to the new meeting.
     */
    PrimaryMeetingId?: PrimaryMeetingId;
    /**
     * A consistent and opaque identifier, created and maintained by the builder to represent a segment of their users.
     */
    TenantIds?: TenantIdList;
    /**
     * Applies one or more tags to an Amazon Chime SDK meeting. Note the following:   Not all resources have tags. For a list of services with resources that support tagging using this operation, see Services that support the Resource Groups Tagging API. If the resource doesn't yet support this operation, the resource's service might support tagging using its own API operations. For more information, refer to the documentation for that service.   Each resource can have up to 50 tags. For other limits, see Tag Naming and Usage Conventions in the AWS General Reference.   You can only tag resources that are located in the specified AWS Region for the AWS account.   To add tags to a resource, you need the necessary permissions for the service that the resource belongs to as well as permissions for adding tags. For more information, see the documentation for each service.    Do not store personally identifiable information (PII) or other confidential or sensitive information in tags. We use tags to provide you with billing and administration services. Tags are not intended to be used for private or sensitive data.   Minimum permissions  In addition to the tag:TagResources permission required by this operation, you must also have the tagging permission defined by the service that created the resource. For example, to tag a ChimeSDKMeetings instance using the TagResources operation, you must have both of the following permissions:  tag:TagResources   ChimeSDKMeetings:CreateTags   Some services might have specific requirements for tagging some resources. For example, to tag an Amazon S3 bucket, you must also have the s3:GetBucketTagging permission. If the expected minimum permissions don't work, check the documentation for that service's tagging APIs for more information. 
     */
    Tags?: TagList;
  }
  export interface CreateMeetingResponse {
    /**
     * The meeting information, including the meeting ID and MediaPlacement.
     */
    Meeting?: Meeting;
  }
  export interface CreateMeetingWithAttendeesRequest {
    /**
     * The unique identifier for the client request. Use a different token for different meetings.
     */
    ClientRequestToken: ClientRequestToken;
    /**
     * The Region in which to create the meeting.  Available values: af-south-1, ap-northeast-1, ap-northeast-2, ap-south-1, ap-southeast-1, ap-southeast-2, ca-central-1, eu-central-1, eu-north-1, eu-south-1, eu-west-1, eu-west-2, eu-west-3, sa-east-1, us-east-1, us-east-2, us-west-1, us-west-2.  Available values in AWS GovCloud (US) Regions: us-gov-east-1, us-gov-west-1.
     */
    MediaRegion: MediaRegion;
    /**
     * Reserved.
     */
    MeetingHostId?: ExternalUserId;
    /**
     * The external meeting ID. Pattern: [-_&amp;@+=,(){}\[\]\/«».:|'"#a-zA-Z0-9À-ÿ\s]*  Values that begin with aws: are reserved. You can't configure a value that uses this prefix. Case insensitive.
     */
    ExternalMeetingId: ExternalMeetingId;
    /**
     * Lists the audio and video features enabled for a meeting, such as echo reduction.
     */
    MeetingFeatures?: MeetingFeaturesConfiguration;
    /**
     * The configuration for resource targets to receive notifications when meeting and attendee events occur.
     */
    NotificationsConfiguration?: NotificationsConfiguration;
    /**
     * The attendee information, including attendees' IDs and join tokens.
     */
    Attendees: CreateMeetingWithAttendeesRequestItemList;
    /**
     * When specified, replicates the media from the primary meeting to the new meeting.
     */
    PrimaryMeetingId?: PrimaryMeetingId;
    /**
     * A consistent and opaque identifier, created and maintained by the builder to represent a segment of their users.
     */
    TenantIds?: TenantIdList;
    /**
     * The tags in the request.
     */
    Tags?: TagList;
  }
  export type CreateMeetingWithAttendeesRequestItemList = CreateAttendeeRequestItem[];
  export interface CreateMeetingWithAttendeesResponse {
    /**
     * The meeting information, including the meeting ID and MediaPlacement.
     */
    Meeting?: Meeting;
    /**
     * The attendee information, including attendees' IDs and join tokens.
     */
    Attendees?: AttendeeList;
    /**
     * If the action fails for one or more of the attendees in the request, a list of the attendees is returned, along with error codes and error messages.
     */
    Errors?: BatchCreateAttendeeErrorList;
  }
  export interface DeleteAttendeeRequest {
    /**
     * The Amazon Chime SDK meeting ID.
     */
    MeetingId: GuidString;
    /**
     * The Amazon Chime SDK attendee ID.
     */
    AttendeeId: GuidString;
  }
  export interface DeleteMeetingRequest {
    /**
     * The Amazon Chime SDK meeting ID.
     */
    MeetingId: GuidString;
  }
  export interface EngineTranscribeMedicalSettings {
    /**
     * The language code specified for the Amazon Transcribe Medical engine.
     */
    LanguageCode: TranscribeMedicalLanguageCode;
    /**
     * The specialty specified for the Amazon Transcribe Medical engine.
     */
    Specialty: TranscribeMedicalSpecialty;
    /**
     * The type of transcription.
     */
    Type: TranscribeMedicalType;
    /**
     * The name of the vocabulary passed to Amazon Transcribe Medical.
     */
    VocabularyName?: String;
    /**
     * The AWS Region passed to Amazon Transcribe Medical. If you don't specify a Region, Amazon Chime uses the meeting's Region. 
     */
    Region?: TranscribeMedicalRegion;
    /**
     * Set this field to PHI to identify personal health information in the transcription output.
     */
    ContentIdentificationType?: TranscribeMedicalContentIdentificationType;
  }
  export interface EngineTranscribeSettings {
    /**
     * Specify the language code that represents the language spoken. If you're unsure of the language spoken in your audio, consider using IdentifyLanguage to enable automatic language identification.
     */
    LanguageCode?: TranscribeLanguageCode;
    /**
     * Specify how you want your vocabulary filter applied to your transcript. To replace words with ***, choose mask. To delete words, choose remove. To flag words without changing them, choose tag.
     */
    VocabularyFilterMethod?: TranscribeVocabularyFilterMethod;
    /**
     * Specify the name of the custom vocabulary filter that you want to use when processing your transcription. Note that vocabulary filter names are case sensitive.  If you use Amazon Transcribe in multiple Regions, the vocabulary filter must be available in Amazon Transcribe in each Region. If you include IdentifyLanguage and want to use one or more vocabulary filters with your transcription, use the VocabularyFilterNames parameter instead.
     */
    VocabularyFilterName?: String;
    /**
     * Specify the name of the custom vocabulary that you want to use when processing your transcription. Note that vocabulary names are case sensitive. If you use Amazon Transcribe multiple Regions, the vocabulary must be available in Amazon Transcribe in each Region. If you include IdentifyLanguage and want to use one or more custom vocabularies with your transcription, use the VocabularyNames parameter instead.
     */
    VocabularyName?: String;
    /**
     * The AWS Region in which to use Amazon Transcribe. If you don't specify a Region, then the MediaRegion of the meeting is used. However, if Amazon Transcribe is not available in the MediaRegion, then a TranscriptFailed event is sent. Use auto to use Amazon Transcribe in a Region near the meeting’s MediaRegion. For more information, refer to Choosing a transcription Region in the Amazon Chime SDK Developer Guide.
     */
    Region?: TranscribeRegion;
    /**
     * Enables partial result stabilization for your transcription. Partial result stabilization can reduce latency in your output, but may impact accuracy.
     */
    EnablePartialResultsStabilization?: Boolean;
    /**
     * Specify the level of stability to use when you enable partial results stabilization (EnablePartialResultsStabilization). Low stability provides the highest accuracy. High stability transcribes faster, but with slightly lower accuracy.
     */
    PartialResultsStability?: TranscribePartialResultsStability;
    /**
     * Labels all personally identifiable information (PII) identified in your transcript. If you don't include PiiEntityTypes, all PII is identified.  You can’t set ContentIdentificationType and ContentRedactionType. 
     */
    ContentIdentificationType?: TranscribeContentIdentificationType;
    /**
     * Content redaction is performed at the segment level. If you don't include PiiEntityTypes, all PII is redacted.  You can’t set ContentRedactionType and ContentIdentificationType. 
     */
    ContentRedactionType?: TranscribeContentRedactionType;
    /**
     * Specify which types of personally identifiable information (PII) you want to redact in your transcript. You can include as many types as you'd like, or you can select ALL. Values must be comma-separated and can include: ADDRESS, BANK_ACCOUNT_NUMBER, BANK_ROUTING, CREDIT_DEBIT_CVV, CREDIT_DEBIT_EXPIRY CREDIT_DEBIT_NUMBER, EMAIL,NAME, PHONE, PIN, SSN, or ALL. Note that if you include PiiEntityTypes, you must also include ContentIdentificationType or ContentRedactionType. If you include ContentRedactionType or ContentIdentificationType, but do not include PiiEntityTypes, all PII is redacted or identified.
     */
    PiiEntityTypes?: TranscribePiiEntityTypes;
    /**
     * Specify the name of the custom language model that you want to use when processing your transcription. Note that language model names are case sensitive. The language of the specified language model must match the language code. If the languages don't match, the custom language model isn't applied. There are no errors or warnings associated with a language mismatch. If you use Amazon Transcribe in multiple Regions, the custom language model must be available in Amazon Transcribe in each Region.
     */
    LanguageModelName?: TranscribeLanguageModelName;
    /**
     * Enables automatic language identification for your transcription. If you include IdentifyLanguage, you can optionally use LanguageOptions to include a list of language codes that you think may be present in your audio stream. Including language options can improve transcription accuracy. You can also use PreferredLanguage to include a preferred language. Doing so can help Amazon Transcribe identify the language faster. You must include either LanguageCode or IdentifyLanguage. Language identification can't be combined with custom language models or redaction.
     */
    IdentifyLanguage?: Boolean;
    /**
     * Specify two or more language codes that represent the languages you think may be present in your media; including more than five is not recommended. If you're unsure what languages are present, do not include this parameter. Including language options can improve the accuracy of language identification. If you include LanguageOptions, you must also include IdentifyLanguage.  You can only include one language dialect per language. For example, you cannot include en-US and en-AU. 
     */
    LanguageOptions?: TranscribeLanguageOptions;
    /**
     * Specify a preferred language from the subset of languages codes you specified in LanguageOptions. You can only use this parameter if you include IdentifyLanguage and LanguageOptions.
     */
    PreferredLanguage?: TranscribeLanguageCode;
    /**
     * Specify the names of the custom vocabularies that you want to use when processing your transcription. Note that vocabulary names are case sensitive. If you use Amazon Transcribe in multiple Regions, the vocabulary must be available in Amazon Transcribe in each Region. If you don't include IdentifyLanguage and want to use a custom vocabulary with your transcription, use the VocabularyName parameter instead.
     */
    VocabularyNames?: TranscribeVocabularyNamesOrFilterNamesString;
    /**
     * Specify the names of the custom vocabulary filters that you want to use when processing your transcription. Note that vocabulary filter names are case sensitive. If you use Amazon Transcribe in multiple Regions, the vocabulary filter must be available in Amazon Transcribe in each Region.  If you're not including IdentifyLanguage and want to use a custom vocabulary filter with your transcription, use the VocabularyFilterName parameter instead.
     */
    VocabularyFilterNames?: TranscribeVocabularyNamesOrFilterNamesString;
  }
  export type ExternalMeetingId = string;
  export type ExternalUserId = string;
  export interface GetAttendeeRequest {
    /**
     * The Amazon Chime SDK meeting ID.
     */
    MeetingId: GuidString;
    /**
     * The Amazon Chime SDK attendee ID.
     */
    AttendeeId: GuidString;
  }
  export interface GetAttendeeResponse {
    /**
     * The Amazon Chime SDK attendee information.
     */
    Attendee?: Attendee;
  }
  export interface GetMeetingRequest {
    /**
     * The Amazon Chime SDK meeting ID.
     */
    MeetingId: GuidString;
  }
  export interface GetMeetingResponse {
    /**
     * The Amazon Chime SDK meeting information.
     */
    Meeting?: Meeting;
  }
  export type GuidString = string;
  export type JoinTokenString = string;
  export interface ListAttendeesRequest {
    /**
     * The Amazon Chime SDK meeting ID.
     */
    MeetingId: GuidString;
    /**
     * The token to use to retrieve the next page of results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in a single call.
     */
    MaxResults?: ResultMax;
  }
  export interface ListAttendeesResponse {
    /**
     * The Amazon Chime SDK attendee information.
     */
    Attendees?: AttendeeList;
    /**
     * The token to use to retrieve the next page of results.
     */
    NextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags requested for the specified resource.
     */
    Tags?: TagList;
  }
  export type MediaCapabilities = "SendReceive"|"Send"|"Receive"|"None"|string;
  export interface MediaPlacement {
    /**
     * The audio host URL.
     */
    AudioHostUrl?: String;
    /**
     * The audio fallback URL.
     */
    AudioFallbackUrl?: String;
    /**
     * The signaling URL.
     */
    SignalingUrl?: String;
    /**
     * The turn control URL.
     */
    TurnControlUrl?: String;
    /**
     * The screen data URL.
     */
    ScreenDataUrl?: String;
    /**
     * The screen viewing URL.
     */
    ScreenViewingUrl?: String;
    /**
     * The screen sharing URL.
     */
    ScreenSharingUrl?: String;
    /**
     * The event ingestion URL.
     */
    EventIngestionUrl?: String;
  }
  export type MediaRegion = string;
  export interface Meeting {
    /**
     * The Amazon Chime SDK meeting ID.
     */
    MeetingId?: GuidString;
    /**
     * Reserved.
     */
    MeetingHostId?: ExternalUserId;
    /**
     * The external meeting ID. Pattern: [-_&amp;@+=,(){}\[\]\/«».:|'"#a-zA-Z0-9À-ÿ\s]*  Values that begin with aws: are reserved. You can't configure a value that uses this prefix. Case insensitive.
     */
    ExternalMeetingId?: ExternalMeetingId;
    /**
     * The Region in which you create the meeting. Available values: af-south-1, ap-northeast-1, ap-northeast-2, ap-south-1, ap-southeast-1, ap-southeast-2, ca-central-1, eu-central-1, eu-north-1, eu-south-1, eu-west-1, eu-west-2, eu-west-3, sa-east-1, us-east-1, us-east-2, us-west-1, us-west-2. Available values in AWS GovCloud (US) Regions: us-gov-east-1, us-gov-west-1.
     */
    MediaRegion?: MediaRegion;
    /**
     * The media placement for the meeting.
     */
    MediaPlacement?: MediaPlacement;
    /**
     * The features available to a meeting, such as echo reduction.
     */
    MeetingFeatures?: MeetingFeaturesConfiguration;
    /**
     * When specified, replicates the media from the primary meeting to this meeting.
     */
    PrimaryMeetingId?: PrimaryMeetingId;
    /**
     * Array of strings.
     */
    TenantIds?: TenantIdList;
    /**
     * The ARN of the meeting.
     */
    MeetingArn?: AmazonResourceName;
  }
  export type MeetingFeatureStatus = "AVAILABLE"|"UNAVAILABLE"|string;
  export interface MeetingFeaturesConfiguration {
    /**
     * The configuration settings for the audio features available to a meeting.
     */
    Audio?: AudioFeatures;
  }
  export interface NotificationsConfiguration {
    /**
     * The ARN of the AWS Lambda function in the notifications configuration.
     */
    LambdaFunctionArn?: Arn;
    /**
     * The ARN of the SNS topic.
     */
    SnsTopicArn?: Arn;
    /**
     * The ARN of the SQS queue.
     */
    SqsQueueArn?: Arn;
  }
  export type PrimaryMeetingId = string;
  export type ResultMax = number;
  export interface StartMeetingTranscriptionRequest {
    /**
     * The unique ID of the meeting being transcribed.
     */
    MeetingId: GuidString;
    /**
     * The configuration for the current transcription operation. Must contain EngineTranscribeSettings or EngineTranscribeMedicalSettings.
     */
    TranscriptionConfiguration: TranscriptionConfiguration;
  }
  export interface StopMeetingTranscriptionRequest {
    /**
     * The unique ID of the meeting for which you stop transcription.
     */
    MeetingId: GuidString;
  }
  export type String = string;
  export interface Tag {
    /**
     * The tag's key.
     */
    Key: TagKey;
    /**
     * The tag's value.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The ARN of the resource.
     */
    ResourceARN: AmazonResourceName;
    /**
     * Lists the requested tags.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TenantId = string;
  export type TenantIdList = TenantId[];
  export type TranscribeContentIdentificationType = "PII"|string;
  export type TranscribeContentRedactionType = "PII"|string;
  export type TranscribeLanguageCode = "en-US"|"en-GB"|"es-US"|"fr-CA"|"fr-FR"|"en-AU"|"it-IT"|"de-DE"|"pt-BR"|"ja-JP"|"ko-KR"|"zh-CN"|"th-TH"|"hi-IN"|string;
  export type TranscribeLanguageModelName = string;
  export type TranscribeLanguageOptions = string;
  export type TranscribeMedicalContentIdentificationType = "PHI"|string;
  export type TranscribeMedicalLanguageCode = "en-US"|string;
  export type TranscribeMedicalRegion = "us-east-1"|"us-east-2"|"us-west-2"|"ap-southeast-2"|"ca-central-1"|"eu-west-1"|"auto"|string;
  export type TranscribeMedicalSpecialty = "PRIMARYCARE"|"CARDIOLOGY"|"NEUROLOGY"|"ONCOLOGY"|"RADIOLOGY"|"UROLOGY"|string;
  export type TranscribeMedicalType = "CONVERSATION"|"DICTATION"|string;
  export type TranscribePartialResultsStability = "low"|"medium"|"high"|string;
  export type TranscribePiiEntityTypes = string;
  export type TranscribeRegion = "us-east-2"|"us-east-1"|"us-west-2"|"ap-northeast-2"|"ap-southeast-2"|"ap-northeast-1"|"ca-central-1"|"eu-central-1"|"eu-west-1"|"eu-west-2"|"sa-east-1"|"auto"|"us-gov-west-1"|string;
  export type TranscribeVocabularyFilterMethod = "remove"|"mask"|"tag"|string;
  export type TranscribeVocabularyNamesOrFilterNamesString = string;
  export interface TranscriptionConfiguration {
    /**
     * The transcription configuration settings passed to Amazon Transcribe.
     */
    EngineTranscribeSettings?: EngineTranscribeSettings;
    /**
     * The transcription configuration settings passed to Amazon Transcribe Medical.
     */
    EngineTranscribeMedicalSettings?: EngineTranscribeMedicalSettings;
  }
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource that you're removing tags from.
     */
    ResourceARN: AmazonResourceName;
    /**
     * The tag keys being removed from the resources.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAttendeeCapabilitiesRequest {
    /**
     * The ID of the meeting associated with the update request.
     */
    MeetingId: GuidString;
    /**
     * The ID of the attendee associated with the update request.
     */
    AttendeeId: GuidString;
    /**
     * The capabilities that you want to update.
     */
    Capabilities: AttendeeCapabilities;
  }
  export interface UpdateAttendeeCapabilitiesResponse {
    /**
     * The updated attendee data.
     */
    Attendee?: Attendee;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-07-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ChimeSDKMeetings client.
   */
  export import Types = ChimeSDKMeetings;
}
export = ChimeSDKMeetings;
