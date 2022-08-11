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
   * Creates a group of meeting attendees.
   */
  batchCreateAttendee(params: ChimeSDKMeetings.Types.BatchCreateAttendeeRequest, callback?: (err: AWSError, data: ChimeSDKMeetings.Types.BatchCreateAttendeeResponse) => void): Request<ChimeSDKMeetings.Types.BatchCreateAttendeeResponse, AWSError>;
  /**
   * Creates a group of meeting attendees.
   */
  batchCreateAttendee(callback?: (err: AWSError, data: ChimeSDKMeetings.Types.BatchCreateAttendeeResponse) => void): Request<ChimeSDKMeetings.Types.BatchCreateAttendeeResponse, AWSError>;
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
   * Starts transcription for the specified meetingId.
   */
  startMeetingTranscription(params: ChimeSDKMeetings.Types.StartMeetingTranscriptionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts transcription for the specified meetingId.
   */
  startMeetingTranscription(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops transcription for the specified meetingId.
   */
  stopMeetingTranscription(params: ChimeSDKMeetings.Types.StopMeetingTranscriptionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops transcription for the specified meetingId.
   */
  stopMeetingTranscription(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace ChimeSDKMeetings {
  export type Arn = string;
  export interface Attendee {
    /**
     * The Amazon Chime SDK external user ID. An idempotency token. Links the attendee to an identity managed by a builder application.
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
  }
  export type AttendeeList = Attendee[];
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
  export type ClientRequestToken = string;
  export interface CreateAttendeeError {
    /**
     * The Amazon Chime SDK external user ID. An idempotency token. Links the attendee to an identity managed by a builder application.
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
     * The Amazon Chime SDK external user ID. An idempotency token. Links the attendee to an identity managed by a builder application.
     */
    ExternalUserId: ExternalUserId;
  }
  export interface CreateAttendeeRequestItem {
    /**
     * The Amazon Chime SDK external user ID. An idempotency token. Links the attendee to an identity managed by a builder application.
     */
    ExternalUserId: ExternalUserId;
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
     * The Region in which to create the meeting.  Available values: af-south-1 , ap-northeast-1 , ap-northeast-2 , ap-south-1 , ap-southeast-1 , ap-southeast-2 , ca-central-1 , eu-central-1 , eu-north-1 , eu-south-1 , eu-west-1 , eu-west-2 , eu-west-3 , sa-east-1 , us-east-1 , us-east-2 , us-west-1 , us-west-2 . 
     */
    MediaRegion: MediaRegion;
    /**
     * Reserved.
     */
    MeetingHostId?: ExternalUserId;
    /**
     * The external meeting ID.
     */
    ExternalMeetingId: ExternalMeetingId;
    /**
     * The configuration for resource targets to receive notifications when meeting and attendee events occur.
     */
    NotificationsConfiguration?: NotificationsConfiguration;
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
     * The Region in which to create the meeting.
     */
    MediaRegion: MediaRegion;
    /**
     * Reserved.
     */
    MeetingHostId?: ExternalUserId;
    /**
     * The external meeting ID.
     */
    ExternalMeetingId: ExternalMeetingId;
    /**
     * The configuration for resource targets to receive notifications when meeting and attendee events occur.
     */
    NotificationsConfiguration?: NotificationsConfiguration;
    /**
     * The attendee information, including attendees' IDs and join tokens.
     */
    Attendees: CreateMeetingWithAttendeesRequestItemList;
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
  }
  export interface EngineTranscribeSettings {
    /**
     * The language code specified for the Amazon Transcribe engine.
     */
    LanguageCode: TranscribeLanguageCode;
    /**
     * The filtering method passed to Amazon Transcribe.
     */
    VocabularyFilterMethod?: TranscribeVocabularyFilterMethod;
    /**
     * The name of the vocabulary filter passed to Amazon Transcribe.
     */
    VocabularyFilterName?: String;
    /**
     * The name of the vocabulary passed to Amazon Transcribe.
     */
    VocabularyName?: String;
    /**
     * The AWS Region passed to Amazon Transcribe. If you don't specify a Region, Amazon Chime uses the meeting's Region.
     */
    Region?: TranscribeRegion;
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
     * The external meeting ID.
     */
    ExternalMeetingId?: ExternalMeetingId;
    /**
     * The Region in which you create the meeting. Available values: af-south-1, ap-northeast-1, ap-northeast-2, ap-south-1, ap-southeast-1, ap-southeast-2, ca-central-1, eu-central-1, eu-north-1, eu-south-1, eu-west-1, eu-west-2, eu-west-3, sa-east-1, us-east-1, us-east-2, us-west-1, us-west-2.
     */
    MediaRegion?: MediaRegion;
    /**
     * The media placement for the meeting.
     */
    MediaPlacement?: MediaPlacement;
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
  export type TranscribeLanguageCode = "en-US"|"en-GB"|"es-US"|"fr-CA"|"fr-FR"|"en-AU"|"it-IT"|"de-DE"|"pt-BR"|"ja-JP"|"ko-KR"|"zh-CN"|string;
  export type TranscribeMedicalLanguageCode = "en-US"|string;
  export type TranscribeMedicalRegion = "us-east-1"|"us-east-2"|"us-west-2"|"ap-southeast-2"|"ca-central-1"|"eu-west-1"|"auto"|string;
  export type TranscribeMedicalSpecialty = "PRIMARYCARE"|"CARDIOLOGY"|"NEUROLOGY"|"ONCOLOGY"|"RADIOLOGY"|"UROLOGY"|string;
  export type TranscribeMedicalType = "CONVERSATION"|"DICTATION"|string;
  export type TranscribeRegion = "us-east-2"|"us-east-1"|"us-west-2"|"ap-northeast-2"|"ap-southeast-2"|"ap-northeast-1"|"ca-central-1"|"eu-central-1"|"eu-west-1"|"eu-west-2"|"sa-east-1"|"auto"|string;
  export type TranscribeVocabularyFilterMethod = "remove"|"mask"|"tag"|string;
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
