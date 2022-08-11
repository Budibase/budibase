import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ConnectContactLens extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ConnectContactLens.Types.ClientConfiguration)
  config: Config & ConnectContactLens.Types.ClientConfiguration;
  /**
   * Provides a list of analysis segments for a real-time analysis session.
   */
  listRealtimeContactAnalysisSegments(params: ConnectContactLens.Types.ListRealtimeContactAnalysisSegmentsRequest, callback?: (err: AWSError, data: ConnectContactLens.Types.ListRealtimeContactAnalysisSegmentsResponse) => void): Request<ConnectContactLens.Types.ListRealtimeContactAnalysisSegmentsResponse, AWSError>;
  /**
   * Provides a list of analysis segments for a real-time analysis session.
   */
  listRealtimeContactAnalysisSegments(callback?: (err: AWSError, data: ConnectContactLens.Types.ListRealtimeContactAnalysisSegmentsResponse) => void): Request<ConnectContactLens.Types.ListRealtimeContactAnalysisSegmentsResponse, AWSError>;
}
declare namespace ConnectContactLens {
  export interface Categories {
    /**
     * The category rules that have been matched in the analyzed segment.
     */
    MatchedCategories: MatchedCategories;
    /**
     * The category rule that was matched and when it occurred in the transcript.
     */
    MatchedDetails: MatchedDetails;
  }
  export interface CategoryDetails {
    /**
     * The section of audio where the category rule was detected.
     */
    PointsOfInterest: PointsOfInterest;
  }
  export type CategoryName = string;
  export type CharacterOffset = number;
  export interface CharacterOffsets {
    /**
     * The beginning of the issue.
     */
    BeginOffsetChar: CharacterOffset;
    /**
     * The end of the issue.
     */
    EndOffsetChar: CharacterOffset;
  }
  export type ContactId = string;
  export type InstanceId = string;
  export interface IssueDetected {
    /**
     * The offset for when the issue was detected in the segment.
     */
    CharacterOffsets: CharacterOffsets;
  }
  export type IssuesDetected = IssueDetected[];
  export interface ListRealtimeContactAnalysisSegmentsRequest {
    /**
     * The identifier of the Amazon Connect instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact.
     */
    ContactId: ContactId;
    /**
     * The maximimum number of results to return per page.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListRealtimeContactAnalysisSegmentsResponse {
    /**
     * An analyzed transcript or category.
     */
    Segments: RealtimeContactAnalysisSegments;
    /**
     * If there are additional results, this is the token for the next set of results. If response includes nextToken there are two possible scenarios:   There are more segments so another call is required to get them.   There are no more segments at this time, but more may be available later (real-time analysis is in progress) so the client should call the operation again to get new segments.   If response does not include nextToken, the analysis is completed (successfully or failed) and there are no more segments to retrieve.
     */
    NextToken?: NextToken;
  }
  export type MatchedCategories = CategoryName[];
  export type MatchedDetails = {[key: string]: CategoryDetails};
  export type MaxResults = number;
  export type NextToken = string;
  export type OffsetMillis = number;
  export type ParticipantId = string;
  export type ParticipantRole = string;
  export interface PointOfInterest {
    /**
     * The beginning offset in milliseconds where the category rule was detected.
     */
    BeginOffsetMillis: OffsetMillis;
    /**
     * The ending offset in milliseconds where the category rule was detected.
     */
    EndOffsetMillis: OffsetMillis;
  }
  export type PointsOfInterest = PointOfInterest[];
  export interface RealtimeContactAnalysisSegment {
    /**
     * The analyzed transcript.
     */
    Transcript?: Transcript;
    /**
     * The matched category rules.
     */
    Categories?: Categories;
  }
  export type RealtimeContactAnalysisSegments = RealtimeContactAnalysisSegment[];
  export type SentimentValue = "POSITIVE"|"NEUTRAL"|"NEGATIVE"|string;
  export interface Transcript {
    /**
     * The identifier of the transcript.
     */
    Id: TranscriptId;
    /**
     * The identifier of the participant.
     */
    ParticipantId: ParticipantId;
    /**
     * The role of participant. For example, is it a customer, agent, or system.
     */
    ParticipantRole: ParticipantRole;
    /**
     * The content of the transcript.
     */
    Content: TranscriptContent;
    /**
     * The beginning offset in the contact for this transcript.
     */
    BeginOffsetMillis: OffsetMillis;
    /**
     * The end offset in the contact for this transcript.
     */
    EndOffsetMillis: OffsetMillis;
    /**
     * The sentiment of the detected for this piece of transcript.
     */
    Sentiment: SentimentValue;
    /**
     * List of positions where issues were detected on the transcript.
     */
    IssuesDetected?: IssuesDetected;
  }
  export type TranscriptContent = string;
  export type TranscriptId = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-08-21"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ConnectContactLens client.
   */
  export import Types = ConnectContactLens;
}
export = ConnectContactLens;
