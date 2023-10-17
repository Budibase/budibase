import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IVSRealTime extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IVSRealTime.Types.ClientConfiguration)
  config: Config & IVSRealTime.Types.ClientConfiguration;
  /**
   * Creates an additional token for a specified stage. This can be done after stage creation or when tokens expire. Tokens always are scoped to the stage for which they are created. Encryption keys are owned by Amazon IVS and never used directly by your application.
   */
  createParticipantToken(params: IVSRealTime.Types.CreateParticipantTokenRequest, callback?: (err: AWSError, data: IVSRealTime.Types.CreateParticipantTokenResponse) => void): Request<IVSRealTime.Types.CreateParticipantTokenResponse, AWSError>;
  /**
   * Creates an additional token for a specified stage. This can be done after stage creation or when tokens expire. Tokens always are scoped to the stage for which they are created. Encryption keys are owned by Amazon IVS and never used directly by your application.
   */
  createParticipantToken(callback?: (err: AWSError, data: IVSRealTime.Types.CreateParticipantTokenResponse) => void): Request<IVSRealTime.Types.CreateParticipantTokenResponse, AWSError>;
  /**
   * Creates a new stage (and optionally participant tokens).
   */
  createStage(params: IVSRealTime.Types.CreateStageRequest, callback?: (err: AWSError, data: IVSRealTime.Types.CreateStageResponse) => void): Request<IVSRealTime.Types.CreateStageResponse, AWSError>;
  /**
   * Creates a new stage (and optionally participant tokens).
   */
  createStage(callback?: (err: AWSError, data: IVSRealTime.Types.CreateStageResponse) => void): Request<IVSRealTime.Types.CreateStageResponse, AWSError>;
  /**
   * Shuts down and deletes the specified stage (disconnecting all participants).
   */
  deleteStage(params: IVSRealTime.Types.DeleteStageRequest, callback?: (err: AWSError, data: IVSRealTime.Types.DeleteStageResponse) => void): Request<IVSRealTime.Types.DeleteStageResponse, AWSError>;
  /**
   * Shuts down and deletes the specified stage (disconnecting all participants).
   */
  deleteStage(callback?: (err: AWSError, data: IVSRealTime.Types.DeleteStageResponse) => void): Request<IVSRealTime.Types.DeleteStageResponse, AWSError>;
  /**
   * Disconnects a specified participant and revokes the participant permanently from a specified stage.
   */
  disconnectParticipant(params: IVSRealTime.Types.DisconnectParticipantRequest, callback?: (err: AWSError, data: IVSRealTime.Types.DisconnectParticipantResponse) => void): Request<IVSRealTime.Types.DisconnectParticipantResponse, AWSError>;
  /**
   * Disconnects a specified participant and revokes the participant permanently from a specified stage.
   */
  disconnectParticipant(callback?: (err: AWSError, data: IVSRealTime.Types.DisconnectParticipantResponse) => void): Request<IVSRealTime.Types.DisconnectParticipantResponse, AWSError>;
  /**
   * Gets information about the specified participant token.
   */
  getParticipant(params: IVSRealTime.Types.GetParticipantRequest, callback?: (err: AWSError, data: IVSRealTime.Types.GetParticipantResponse) => void): Request<IVSRealTime.Types.GetParticipantResponse, AWSError>;
  /**
   * Gets information about the specified participant token.
   */
  getParticipant(callback?: (err: AWSError, data: IVSRealTime.Types.GetParticipantResponse) => void): Request<IVSRealTime.Types.GetParticipantResponse, AWSError>;
  /**
   * Gets information for the specified stage.
   */
  getStage(params: IVSRealTime.Types.GetStageRequest, callback?: (err: AWSError, data: IVSRealTime.Types.GetStageResponse) => void): Request<IVSRealTime.Types.GetStageResponse, AWSError>;
  /**
   * Gets information for the specified stage.
   */
  getStage(callback?: (err: AWSError, data: IVSRealTime.Types.GetStageResponse) => void): Request<IVSRealTime.Types.GetStageResponse, AWSError>;
  /**
   * Gets information for the specified stage session.
   */
  getStageSession(params: IVSRealTime.Types.GetStageSessionRequest, callback?: (err: AWSError, data: IVSRealTime.Types.GetStageSessionResponse) => void): Request<IVSRealTime.Types.GetStageSessionResponse, AWSError>;
  /**
   * Gets information for the specified stage session.
   */
  getStageSession(callback?: (err: AWSError, data: IVSRealTime.Types.GetStageSessionResponse) => void): Request<IVSRealTime.Types.GetStageSessionResponse, AWSError>;
  /**
   * Lists events for a specified participant that occurred during a specified stage session.
   */
  listParticipantEvents(params: IVSRealTime.Types.ListParticipantEventsRequest, callback?: (err: AWSError, data: IVSRealTime.Types.ListParticipantEventsResponse) => void): Request<IVSRealTime.Types.ListParticipantEventsResponse, AWSError>;
  /**
   * Lists events for a specified participant that occurred during a specified stage session.
   */
  listParticipantEvents(callback?: (err: AWSError, data: IVSRealTime.Types.ListParticipantEventsResponse) => void): Request<IVSRealTime.Types.ListParticipantEventsResponse, AWSError>;
  /**
   * Lists all participants in a specified stage session.
   */
  listParticipants(params: IVSRealTime.Types.ListParticipantsRequest, callback?: (err: AWSError, data: IVSRealTime.Types.ListParticipantsResponse) => void): Request<IVSRealTime.Types.ListParticipantsResponse, AWSError>;
  /**
   * Lists all participants in a specified stage session.
   */
  listParticipants(callback?: (err: AWSError, data: IVSRealTime.Types.ListParticipantsResponse) => void): Request<IVSRealTime.Types.ListParticipantsResponse, AWSError>;
  /**
   * Gets all sessions for a specified stage.
   */
  listStageSessions(params: IVSRealTime.Types.ListStageSessionsRequest, callback?: (err: AWSError, data: IVSRealTime.Types.ListStageSessionsResponse) => void): Request<IVSRealTime.Types.ListStageSessionsResponse, AWSError>;
  /**
   * Gets all sessions for a specified stage.
   */
  listStageSessions(callback?: (err: AWSError, data: IVSRealTime.Types.ListStageSessionsResponse) => void): Request<IVSRealTime.Types.ListStageSessionsResponse, AWSError>;
  /**
   * Gets summary information about all stages in your account, in the AWS region where the API request is processed.
   */
  listStages(params: IVSRealTime.Types.ListStagesRequest, callback?: (err: AWSError, data: IVSRealTime.Types.ListStagesResponse) => void): Request<IVSRealTime.Types.ListStagesResponse, AWSError>;
  /**
   * Gets summary information about all stages in your account, in the AWS region where the API request is processed.
   */
  listStages(callback?: (err: AWSError, data: IVSRealTime.Types.ListStagesResponse) => void): Request<IVSRealTime.Types.ListStagesResponse, AWSError>;
  /**
   * Gets information about AWS tags for the specified ARN.
   */
  listTagsForResource(params: IVSRealTime.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: IVSRealTime.Types.ListTagsForResourceResponse) => void): Request<IVSRealTime.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Gets information about AWS tags for the specified ARN.
   */
  listTagsForResource(callback?: (err: AWSError, data: IVSRealTime.Types.ListTagsForResourceResponse) => void): Request<IVSRealTime.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Adds or updates tags for the AWS resource with the specified ARN.
   */
  tagResource(params: IVSRealTime.Types.TagResourceRequest, callback?: (err: AWSError, data: IVSRealTime.Types.TagResourceResponse) => void): Request<IVSRealTime.Types.TagResourceResponse, AWSError>;
  /**
   * Adds or updates tags for the AWS resource with the specified ARN.
   */
  tagResource(callback?: (err: AWSError, data: IVSRealTime.Types.TagResourceResponse) => void): Request<IVSRealTime.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from the resource with the specified ARN.
   */
  untagResource(params: IVSRealTime.Types.UntagResourceRequest, callback?: (err: AWSError, data: IVSRealTime.Types.UntagResourceResponse) => void): Request<IVSRealTime.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from the resource with the specified ARN.
   */
  untagResource(callback?: (err: AWSError, data: IVSRealTime.Types.UntagResourceResponse) => void): Request<IVSRealTime.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a stage’s configuration.
   */
  updateStage(params: IVSRealTime.Types.UpdateStageRequest, callback?: (err: AWSError, data: IVSRealTime.Types.UpdateStageResponse) => void): Request<IVSRealTime.Types.UpdateStageResponse, AWSError>;
  /**
   * Updates a stage’s configuration.
   */
  updateStage(callback?: (err: AWSError, data: IVSRealTime.Types.UpdateStageResponse) => void): Request<IVSRealTime.Types.UpdateStageResponse, AWSError>;
}
declare namespace IVSRealTime {
  export interface CreateParticipantTokenRequest {
    /**
     * Application-provided attributes to encode into the token and attach to a stage. Map keys and values can contain UTF-8 encoded text. The maximum length of this field is 1 KB total. This field is exposed to all stage participants and should not be used for personally identifying, confidential, or sensitive information. 
     */
    attributes?: ParticipantTokenAttributes;
    /**
     * Set of capabilities that the user is allowed to perform in the stage. Default: PUBLISH, SUBSCRIBE.
     */
    capabilities?: ParticipantTokenCapabilities;
    /**
     * Duration (in minutes), after which the token expires. Default: 720 (12 hours).
     */
    duration?: ParticipantTokenDurationMinutes;
    /**
     * ARN of the stage to which this token is scoped.
     */
    stageArn: StageArn;
    /**
     * Name that can be specified to help identify the token. This can be any UTF-8 encoded text. This field is exposed to all stage participants and should not be used for personally identifying, confidential, or sensitive information. 
     */
    userId?: ParticipantTokenUserId;
  }
  export interface CreateParticipantTokenResponse {
    /**
     * The participant token that was created.
     */
    participantToken?: ParticipantToken;
  }
  export interface CreateStageRequest {
    /**
     * Optional name that can be specified for the stage being created.
     */
    name?: StageName;
    /**
     * Array of participant token configuration objects to attach to the new stage.
     */
    participantTokenConfigurations?: ParticipantTokenConfigurations;
    /**
     * Tags attached to the resource. Array of maps, each of the form string:string (key:value). See Tagging AWS Resources for details, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no constraints on tags beyond what is documented there. 
     */
    tags?: Tags;
  }
  export interface CreateStageResponse {
    /**
     * Participant tokens attached to the stage. These correspond to the participants in the request.
     */
    participantTokens?: ParticipantTokenList;
    /**
     * The stage that was created.
     */
    stage?: Stage;
  }
  export interface DeleteStageRequest {
    /**
     * ARN of the stage to be deleted.
     */
    arn: StageArn;
  }
  export interface DeleteStageResponse {
  }
  export type DisconnectParticipantReason = string;
  export interface DisconnectParticipantRequest {
    /**
     * Identifier of the participant to be disconnected. This is assigned by IVS and returned by CreateParticipantToken.
     */
    participantId: ParticipantTokenId;
    /**
     * Description of why this participant is being disconnected.
     */
    reason?: DisconnectParticipantReason;
    /**
     * ARN of the stage to which the participant is attached.
     */
    stageArn: StageArn;
  }
  export interface DisconnectParticipantResponse {
  }
  export interface Event {
    /**
     * If the event is an error event, the error code is provided to give insight into the specific error that occurred. If the event is not an error event, this field is null. INSUFFICIENT_CAPABILITIES indicates that the participant tried to take an action that the participant’s token is not allowed to do. For more information about participant capabilities, see the capabilities field in CreateParticipantToken. QUOTA_EXCEEDED indicates that the number of participants who want to publish/subscribe to a stage exceeds the quota; for more information, see Service Quotas. PUBLISHER_NOT_FOUND indicates that the participant tried to subscribe to a publisher that doesn’t exist. 
     */
    errorCode?: EventErrorCode;
    /**
     * ISO 8601 timestamp (returned as a string) for when the event occurred.
     */
    eventTime?: Time;
    /**
     * The name of the event.
     */
    name?: EventName;
    /**
     * Unique identifier for the participant who triggered the event. This is assigned by IVS.
     */
    participantId?: ParticipantId;
    /**
     * Unique identifier for the remote participant. For a subscribe event, this is the publisher. For a publish or join event, this is null. This is assigned by IVS.
     */
    remoteParticipantId?: ParticipantId;
  }
  export type EventErrorCode = "INSUFFICIENT_CAPABILITIES"|"QUOTA_EXCEEDED"|"PUBLISHER_NOT_FOUND"|string;
  export type EventList = Event[];
  export type EventName = "JOINED"|"LEFT"|"PUBLISH_STARTED"|"PUBLISH_STOPPED"|"SUBSCRIBE_STARTED"|"SUBSCRIBE_STOPPED"|"PUBLISH_ERROR"|"SUBSCRIBE_ERROR"|"JOIN_ERROR"|string;
  export interface GetParticipantRequest {
    /**
     * Unique identifier for the participant. This is assigned by IVS and returned by CreateParticipantToken.
     */
    participantId: ParticipantId;
    /**
     * ID of a session within the stage.
     */
    sessionId: StageSessionId;
    /**
     * Stage ARN.
     */
    stageArn: StageArn;
  }
  export interface GetParticipantResponse {
    /**
     * The participant that is returned.
     */
    participant?: Participant;
  }
  export interface GetStageRequest {
    /**
     * ARN of the stage for which the information is to be retrieved.
     */
    arn: StageArn;
  }
  export interface GetStageResponse {
    /**
     * The stage that is returned.
     */
    stage?: Stage;
  }
  export interface GetStageSessionRequest {
    /**
     * ID of a session within the stage.
     */
    sessionId: StageSessionId;
    /**
     * ARN of the stage for which the information is to be retrieved.
     */
    stageArn: StageArn;
  }
  export interface GetStageSessionResponse {
    /**
     * The stage session that is returned.
     */
    stageSession?: StageSession;
  }
  export interface ListParticipantEventsRequest {
    /**
     * Maximum number of results to return. Default: 50.
     */
    maxResults?: MaxParticipantEventResults;
    /**
     * The first participant to retrieve. This is used for pagination; see the nextToken response field.
     */
    nextToken?: PaginationToken;
    /**
     * Unique identifier for this participant. This is assigned by IVS and returned by CreateParticipantToken.
     */
    participantId: ParticipantId;
    /**
     * ID of a session within the stage.
     */
    sessionId: StageSessionId;
    /**
     * Stage ARN.
     */
    stageArn: StageArn;
  }
  export interface ListParticipantEventsResponse {
    /**
     * List of the matching events.
     */
    events: EventList;
    /**
     * If there are more rooms than maxResults, use nextToken in the request to get the next set. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListParticipantsRequest {
    /**
     * Filters the response list to only show participants who published during the stage session. Only one of filterByUserId, filterByPublished, or filterByState can be provided per request.
     */
    filterByPublished?: Published;
    /**
     * Filters the response list to only show participants in the specified state. Only one of filterByUserId, filterByPublished, or filterByState can be provided per request.
     */
    filterByState?: ParticipantState;
    /**
     * Filters the response list to match the specified user ID. Only one of filterByUserId, filterByPublished, or filterByState can be provided per request. A userId is a customer-assigned name to help identify the token; this can be used to link a participant to a user in the customer’s own systems.
     */
    filterByUserId?: UserId;
    /**
     * Maximum number of results to return. Default: 50.
     */
    maxResults?: MaxParticipantResults;
    /**
     * The first participant to retrieve. This is used for pagination; see the nextToken response field.
     */
    nextToken?: PaginationToken;
    /**
     * ID of the session within the stage.
     */
    sessionId: StageSessionId;
    /**
     * Stage ARN.
     */
    stageArn: StageArn;
  }
  export interface ListParticipantsResponse {
    /**
     * If there are more rooms than maxResults, use nextToken in the request to get the next set.
     */
    nextToken?: PaginationToken;
    /**
     * List of the matching participants (summary information only).
     */
    participants: ParticipantList;
  }
  export interface ListStageSessionsRequest {
    /**
     * Maximum number of results to return. Default: 50.
     */
    maxResults?: MaxStageSessionResults;
    /**
     * The first stage to retrieve. This is used for pagination; see the nextToken response field.
     */
    nextToken?: PaginationToken;
    /**
     * Stage ARN.
     */
    stageArn: StageArn;
  }
  export interface ListStageSessionsResponse {
    /**
     * If there are more rooms than maxResults, use nextToken in the request to get the next set.
     */
    nextToken?: PaginationToken;
    /**
     * List of matching stage sessions.
     */
    stageSessions: StageSessionList;
  }
  export interface ListStagesRequest {
    /**
     * Maximum number of results to return. Default: 50.
     */
    maxResults?: MaxStageResults;
    /**
     * The first stage to retrieve. This is used for pagination; see the nextToken response field.
     */
    nextToken?: PaginationToken;
  }
  export interface ListStagesResponse {
    /**
     * If there are more rooms than maxResults, use nextToken in the request to get the next set.
     */
    nextToken?: PaginationToken;
    /**
     * List of the matching stages (summary information only).
     */
    stages: StageSummaryList;
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
  export type MaxParticipantEventResults = number;
  export type MaxParticipantResults = number;
  export type MaxStageResults = number;
  export type MaxStageSessionResults = number;
  export type PaginationToken = string;
  export interface Participant {
    /**
     * Application-provided attributes to encode into the token and attach to a stage. Map keys and values can contain UTF-8 encoded text. The maximum length of this field is 1 KB total. This field is exposed to all stage participants and should not be used for personally identifying, confidential, or sensitive information.
     */
    attributes?: ParticipantAttributes;
    /**
     * The participant’s browser.
     */
    browserName?: ParticipantClientAttribute;
    /**
     * The participant’s browser version.
     */
    browserVersion?: ParticipantClientAttribute;
    /**
     * ISO 8601 timestamp (returned as a string) when the participant first joined the stage session.
     */
    firstJoinTime?: Time;
    /**
     * The participant’s Internet Service Provider.
     */
    ispName?: ParticipantClientAttribute;
    /**
     * The participant’s operating system.
     */
    osName?: ParticipantClientAttribute;
    /**
     * The participant’s operating system version.
     */
    osVersion?: ParticipantClientAttribute;
    /**
     * Unique identifier for this participant, assigned by IVS.
     */
    participantId?: ParticipantId;
    /**
     * Whether the participant ever published to the stage session.
     */
    published?: Published;
    /**
     * The participant’s SDK version.
     */
    sdkVersion?: ParticipantClientAttribute;
    /**
     * Whether the participant is connected to or disconnected from the stage.
     */
    state?: ParticipantState;
    /**
     * Customer-assigned name to help identify the token; this can be used to link a participant to a user in the customer’s own systems. This can be any UTF-8 encoded text. This field is exposed to all stage participants and should not be used for personally identifying, confidential, or sensitive information.
     */
    userId?: UserId;
  }
  export type ParticipantAttributes = {[key: string]: String};
  export type ParticipantClientAttribute = string;
  export type ParticipantId = string;
  export type ParticipantList = ParticipantSummary[];
  export type ParticipantState = "CONNECTED"|"DISCONNECTED"|string;
  export interface ParticipantSummary {
    /**
     * ISO 8601 timestamp (returned as a string) when the participant first joined the stage session.
     */
    firstJoinTime?: Time;
    /**
     * Unique identifier for this participant, assigned by IVS.
     */
    participantId?: ParticipantId;
    /**
     * Whether the participant ever published to the stage session.
     */
    published?: Published;
    /**
     * Whether the participant is connected to or disconnected from the stage.
     */
    state?: ParticipantState;
    /**
     * Customer-assigned name to help identify the token; this can be used to link a participant to a user in the customer’s own systems. This can be any UTF-8 encoded text. This field is exposed to all stage participants and should not be used for personally identifying, confidential, or sensitive information.
     */
    userId?: UserId;
  }
  export interface ParticipantToken {
    /**
     * Application-provided attributes to encode into the token and attach to a stage. This field is exposed to all stage participants and should not be used for personally identifying, confidential, or sensitive information. 
     */
    attributes?: ParticipantTokenAttributes;
    /**
     * Set of capabilities that the user is allowed to perform in the stage.
     */
    capabilities?: ParticipantTokenCapabilities;
    /**
     * Duration (in minutes), after which the participant token expires. Default: 720 (12 hours).
     */
    duration?: ParticipantTokenDurationMinutes;
    /**
     * ISO 8601 timestamp (returned as a string) for when this token expires.
     */
    expirationTime?: ParticipantTokenExpirationTime;
    /**
     * Unique identifier for this participant token, assigned by IVS.
     */
    participantId?: ParticipantTokenId;
    /**
     * The issued client token, encrypted.
     */
    token?: ParticipantTokenString;
    /**
     * Customer-assigned name to help identify the token; this can be used to link a participant to a user in the customer’s own systems. This can be any UTF-8 encoded text. This field is exposed to all stage participants and should not be used for personally identifying, confidential, or sensitive information. 
     */
    userId?: ParticipantTokenUserId;
  }
  export type ParticipantTokenAttributes = {[key: string]: String};
  export type ParticipantTokenCapabilities = ParticipantTokenCapability[];
  export type ParticipantTokenCapability = "PUBLISH"|"SUBSCRIBE"|string;
  export interface ParticipantTokenConfiguration {
    /**
     * Application-provided attributes to encode into the corresponding participant token and attach to a stage. Map keys and values can contain UTF-8 encoded text. The maximum length of this field is 1 KB total. This field is exposed to all stage participants and should not be used for personally identifying, confidential, or sensitive information. 
     */
    attributes?: ParticipantTokenAttributes;
    /**
     * Set of capabilities that the user is allowed to perform in the stage.
     */
    capabilities?: ParticipantTokenCapabilities;
    /**
     * Duration (in minutes), after which the corresponding participant token expires. Default: 720 (12 hours).
     */
    duration?: ParticipantTokenDurationMinutes;
    /**
     * Customer-assigned name to help identify the token; this can be used to link a participant to a user in the customer’s own systems. This can be any UTF-8 encoded text. This field is exposed to all stage participants and should not be used for personally identifying, confidential, or sensitive information. 
     */
    userId?: ParticipantTokenUserId;
  }
  export type ParticipantTokenConfigurations = ParticipantTokenConfiguration[];
  export type ParticipantTokenDurationMinutes = number;
  export type ParticipantTokenExpirationTime = Date;
  export type ParticipantTokenId = string;
  export type ParticipantTokenList = ParticipantToken[];
  export type ParticipantTokenString = string;
  export type ParticipantTokenUserId = string;
  export type Published = boolean;
  export type ResourceArn = string;
  export interface Stage {
    /**
     * ID of the active session within the stage.
     */
    activeSessionId?: StageSessionId;
    /**
     * Stage ARN.
     */
    arn: StageArn;
    /**
     * Stage name.
     */
    name?: StageName;
    /**
     * Tags attached to the resource. Array of maps, each of the form string:string (key:value). See Tagging AWS Resources for details, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no constraints on tags beyond what is documented there.
     */
    tags?: Tags;
  }
  export type StageArn = string;
  export type StageName = string;
  export interface StageSession {
    /**
     * ISO 8601 timestamp (returned as a string) when the stage session ended. This is null if the stage is active.
     */
    endTime?: Time;
    /**
     * ID of the session within the stage.
     */
    sessionId?: StageSessionId;
    /**
     *  ISO 8601 timestamp (returned as a string) when this stage session began.
     */
    startTime?: Time;
  }
  export type StageSessionId = string;
  export type StageSessionList = StageSessionSummary[];
  export interface StageSessionSummary {
    /**
     * ISO 8601 timestamp (returned as a string) when the stage session ended. This is null if the stage is active.
     */
    endTime?: Time;
    /**
     * ID of the session within the stage.
     */
    sessionId?: StageSessionId;
    /**
     *  ISO 8601 timestamp (returned as a string) when this stage session began.
     */
    startTime?: Time;
  }
  export interface StageSummary {
    /**
     * ID of the active session within the stage.
     */
    activeSessionId?: StageSessionId;
    /**
     * Stage ARN.
     */
    arn: StageArn;
    /**
     * Stage name.
     */
    name?: StageName;
    /**
     * Tags attached to the resource. Array of maps, each of the form string:string (key:value). See Tagging AWS Resources for details, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no constraints on tags beyond what is documented there.
     */
    tags?: Tags;
  }
  export type StageSummaryList = StageSummary[];
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export interface TagResourceRequest {
    /**
     * The ARN of the resource to be tagged. The ARN must be URL-encoded.
     */
    resourceArn: ResourceArn;
    /**
     * Array of tags to be added or updated. Array of maps, each of the form string:string (key:value). See Tagging AWS Resources for details, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no constraints beyond what is documented there.
     */
    tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = {[key: string]: TagValue};
  export type Time = Date;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource to be untagged. The ARN must be URL-encoded.
     */
    resourceArn: ResourceArn;
    /**
     * Array of tags to be removed. Array of maps, each of the form string:string (key:value). See Tagging AWS Resources for details, including restrictions that apply to tags and "Tag naming limits and requirements"; Amazon IVS has no constraints beyond what is documented there.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateStageRequest {
    /**
     * ARN of the stage to be updated.
     */
    arn: StageArn;
    /**
     * Name of the stage to be updated.
     */
    name?: StageName;
  }
  export interface UpdateStageResponse {
    /**
     * The updated stage.
     */
    stage?: Stage;
  }
  export type UserId = string;
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
   * Contains interfaces for use with the IVSRealTime client.
   */
  export import Types = IVSRealTime;
}
export = IVSRealTime;
