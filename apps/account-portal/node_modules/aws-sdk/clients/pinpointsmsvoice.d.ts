import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class PinpointSMSVoice extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: PinpointSMSVoice.Types.ClientConfiguration)
  config: Config & PinpointSMSVoice.Types.ClientConfiguration;
  /**
   * Create a new configuration set. After you create the configuration set, you can add one or more event destinations to it.
   */
  createConfigurationSet(params: PinpointSMSVoice.Types.CreateConfigurationSetRequest, callback?: (err: AWSError, data: PinpointSMSVoice.Types.CreateConfigurationSetResponse) => void): Request<PinpointSMSVoice.Types.CreateConfigurationSetResponse, AWSError>;
  /**
   * Create a new configuration set. After you create the configuration set, you can add one or more event destinations to it.
   */
  createConfigurationSet(callback?: (err: AWSError, data: PinpointSMSVoice.Types.CreateConfigurationSetResponse) => void): Request<PinpointSMSVoice.Types.CreateConfigurationSetResponse, AWSError>;
  /**
   * Create a new event destination in a configuration set.
   */
  createConfigurationSetEventDestination(params: PinpointSMSVoice.Types.CreateConfigurationSetEventDestinationRequest, callback?: (err: AWSError, data: PinpointSMSVoice.Types.CreateConfigurationSetEventDestinationResponse) => void): Request<PinpointSMSVoice.Types.CreateConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Create a new event destination in a configuration set.
   */
  createConfigurationSetEventDestination(callback?: (err: AWSError, data: PinpointSMSVoice.Types.CreateConfigurationSetEventDestinationResponse) => void): Request<PinpointSMSVoice.Types.CreateConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Deletes an existing configuration set.
   */
  deleteConfigurationSet(params: PinpointSMSVoice.Types.DeleteConfigurationSetRequest, callback?: (err: AWSError, data: PinpointSMSVoice.Types.DeleteConfigurationSetResponse) => void): Request<PinpointSMSVoice.Types.DeleteConfigurationSetResponse, AWSError>;
  /**
   * Deletes an existing configuration set.
   */
  deleteConfigurationSet(callback?: (err: AWSError, data: PinpointSMSVoice.Types.DeleteConfigurationSetResponse) => void): Request<PinpointSMSVoice.Types.DeleteConfigurationSetResponse, AWSError>;
  /**
   * Deletes an event destination in a configuration set.
   */
  deleteConfigurationSetEventDestination(params: PinpointSMSVoice.Types.DeleteConfigurationSetEventDestinationRequest, callback?: (err: AWSError, data: PinpointSMSVoice.Types.DeleteConfigurationSetEventDestinationResponse) => void): Request<PinpointSMSVoice.Types.DeleteConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Deletes an event destination in a configuration set.
   */
  deleteConfigurationSetEventDestination(callback?: (err: AWSError, data: PinpointSMSVoice.Types.DeleteConfigurationSetEventDestinationResponse) => void): Request<PinpointSMSVoice.Types.DeleteConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Obtain information about an event destination, including the types of events it reports, the Amazon Resource Name (ARN) of the destination, and the name of the event destination.
   */
  getConfigurationSetEventDestinations(params: PinpointSMSVoice.Types.GetConfigurationSetEventDestinationsRequest, callback?: (err: AWSError, data: PinpointSMSVoice.Types.GetConfigurationSetEventDestinationsResponse) => void): Request<PinpointSMSVoice.Types.GetConfigurationSetEventDestinationsResponse, AWSError>;
  /**
   * Obtain information about an event destination, including the types of events it reports, the Amazon Resource Name (ARN) of the destination, and the name of the event destination.
   */
  getConfigurationSetEventDestinations(callback?: (err: AWSError, data: PinpointSMSVoice.Types.GetConfigurationSetEventDestinationsResponse) => void): Request<PinpointSMSVoice.Types.GetConfigurationSetEventDestinationsResponse, AWSError>;
  /**
   * List all of the configuration sets associated with your Amazon Pinpoint account in the current region.
   */
  listConfigurationSets(params: PinpointSMSVoice.Types.ListConfigurationSetsRequest, callback?: (err: AWSError, data: PinpointSMSVoice.Types.ListConfigurationSetsResponse) => void): Request<PinpointSMSVoice.Types.ListConfigurationSetsResponse, AWSError>;
  /**
   * List all of the configuration sets associated with your Amazon Pinpoint account in the current region.
   */
  listConfigurationSets(callback?: (err: AWSError, data: PinpointSMSVoice.Types.ListConfigurationSetsResponse) => void): Request<PinpointSMSVoice.Types.ListConfigurationSetsResponse, AWSError>;
  /**
   * Create a new voice message and send it to a recipient's phone number.
   */
  sendVoiceMessage(params: PinpointSMSVoice.Types.SendVoiceMessageRequest, callback?: (err: AWSError, data: PinpointSMSVoice.Types.SendVoiceMessageResponse) => void): Request<PinpointSMSVoice.Types.SendVoiceMessageResponse, AWSError>;
  /**
   * Create a new voice message and send it to a recipient's phone number.
   */
  sendVoiceMessage(callback?: (err: AWSError, data: PinpointSMSVoice.Types.SendVoiceMessageResponse) => void): Request<PinpointSMSVoice.Types.SendVoiceMessageResponse, AWSError>;
  /**
   * Update an event destination in a configuration set. An event destination is a location that you publish information about your voice calls to. For example, you can log an event to an Amazon CloudWatch destination when a call fails.
   */
  updateConfigurationSetEventDestination(params: PinpointSMSVoice.Types.UpdateConfigurationSetEventDestinationRequest, callback?: (err: AWSError, data: PinpointSMSVoice.Types.UpdateConfigurationSetEventDestinationResponse) => void): Request<PinpointSMSVoice.Types.UpdateConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Update an event destination in a configuration set. An event destination is a location that you publish information about your voice calls to. For example, you can log an event to an Amazon CloudWatch destination when a call fails.
   */
  updateConfigurationSetEventDestination(callback?: (err: AWSError, data: PinpointSMSVoice.Types.UpdateConfigurationSetEventDestinationResponse) => void): Request<PinpointSMSVoice.Types.UpdateConfigurationSetEventDestinationResponse, AWSError>;
}
declare namespace PinpointSMSVoice {
  export type Boolean = boolean;
  export interface CallInstructionsMessageType {
    /**
     * The language to use when delivering the message. For a complete list of supported languages, see the Amazon Polly Developer Guide.
     */
    Text?: NonEmptyString;
  }
  export interface CloudWatchLogsDestination {
    /**
     * The Amazon Resource Name (ARN) of an Amazon Identity and Access Management (IAM) role that is able to write event data to an Amazon CloudWatch destination.
     */
    IamRoleArn?: String;
    /**
     * The name of the Amazon CloudWatch Log Group that you want to record events in.
     */
    LogGroupArn?: String;
  }
  export type ConfigurationSets = WordCharactersWithDelimiters[];
  export interface CreateConfigurationSetEventDestinationRequest {
    /**
     * ConfigurationSetName
     */
    ConfigurationSetName: __string;
    EventDestination?: EventDestinationDefinition;
    /**
     * A name that identifies the event destination.
     */
    EventDestinationName?: NonEmptyString;
  }
  export interface CreateConfigurationSetEventDestinationResponse {
  }
  export interface CreateConfigurationSetRequest {
    /**
     * The name that you want to give the configuration set.
     */
    ConfigurationSetName?: WordCharactersWithDelimiters;
  }
  export interface CreateConfigurationSetResponse {
  }
  export interface DeleteConfigurationSetEventDestinationRequest {
    /**
     * ConfigurationSetName
     */
    ConfigurationSetName: __string;
    /**
     * EventDestinationName
     */
    EventDestinationName: __string;
  }
  export interface DeleteConfigurationSetEventDestinationResponse {
  }
  export interface DeleteConfigurationSetRequest {
    /**
     * ConfigurationSetName
     */
    ConfigurationSetName: __string;
  }
  export interface DeleteConfigurationSetResponse {
  }
  export interface EventDestination {
    CloudWatchLogsDestination?: CloudWatchLogsDestination;
    /**
     * Indicates whether or not the event destination is enabled. If the event destination is enabled, then Amazon Pinpoint sends response data to the specified event destination.
     */
    Enabled?: Boolean;
    KinesisFirehoseDestination?: KinesisFirehoseDestination;
    MatchingEventTypes?: EventTypes;
    /**
     * A name that identifies the event destination configuration.
     */
    Name?: String;
    SnsDestination?: SnsDestination;
  }
  export interface EventDestinationDefinition {
    CloudWatchLogsDestination?: CloudWatchLogsDestination;
    /**
     * Indicates whether or not the event destination is enabled. If the event destination is enabled, then Amazon Pinpoint sends response data to the specified event destination.
     */
    Enabled?: Boolean;
    KinesisFirehoseDestination?: KinesisFirehoseDestination;
    MatchingEventTypes?: EventTypes;
    SnsDestination?: SnsDestination;
  }
  export type EventDestinations = EventDestination[];
  export type EventType = "INITIATED_CALL"|"RINGING"|"ANSWERED"|"COMPLETED_CALL"|"BUSY"|"FAILED"|"NO_ANSWER"|string;
  export type EventTypes = EventType[];
  export interface GetConfigurationSetEventDestinationsRequest {
    /**
     * ConfigurationSetName
     */
    ConfigurationSetName: __string;
  }
  export interface GetConfigurationSetEventDestinationsResponse {
    EventDestinations?: EventDestinations;
  }
  export interface KinesisFirehoseDestination {
    /**
     * The Amazon Resource Name (ARN) of an IAM role that can write data to an Amazon Kinesis Data Firehose stream.
     */
    DeliveryStreamArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Kinesis Data Firehose destination that you want to use in the event destination.
     */
    IamRoleArn?: String;
  }
  export interface ListConfigurationSetsRequest {
    /**
     * A token returned from a previous call to the API that indicates the position in the list of results.
     */
    NextToken?: __string;
    /**
     * Used to specify the number of items that should be returned in the response.
     */
    PageSize?: __string;
  }
  export interface ListConfigurationSetsResponse {
    /**
     * An object that contains a list of configuration sets for your account in the current region.
     */
    ConfigurationSets?: ConfigurationSets;
    /**
     * A token returned from a previous call to ListConfigurationSets to indicate the position in the list of configuration sets.
     */
    NextToken?: NextTokenString;
  }
  export type NextTokenString = string;
  export type NonEmptyString = string;
  export interface PlainTextMessageType {
    /**
     * The language to use when delivering the message. For a complete list of supported languages, see the Amazon Polly Developer Guide.
     */
    LanguageCode?: String;
    /**
     * The plain (not SSML-formatted) text to deliver to the recipient.
     */
    Text?: NonEmptyString;
    /**
     * The name of the voice that you want to use to deliver the message. For a complete list of supported voices, see the Amazon Polly Developer Guide.
     */
    VoiceId?: String;
  }
  export interface SSMLMessageType {
    /**
     * The language to use when delivering the message. For a complete list of supported languages, see the Amazon Polly Developer Guide.
     */
    LanguageCode?: String;
    /**
     * The SSML-formatted text to deliver to the recipient.
     */
    Text?: NonEmptyString;
    /**
     * The name of the voice that you want to use to deliver the message. For a complete list of supported voices, see the Amazon Polly Developer Guide.
     */
    VoiceId?: String;
  }
  export interface SendVoiceMessageRequest {
    /**
     * The phone number that appears on recipients' devices when they receive the message.
     */
    CallerId?: String;
    /**
     * The name of the configuration set that you want to use to send the message.
     */
    ConfigurationSetName?: WordCharactersWithDelimiters;
    Content?: VoiceMessageContent;
    /**
     * The phone number that you want to send the voice message to.
     */
    DestinationPhoneNumber?: NonEmptyString;
    /**
     * The phone number that Amazon Pinpoint should use to send the voice message. This isn't necessarily the phone number that appears on recipients' devices when they receive the message, because you can specify a CallerId parameter in the request.
     */
    OriginationPhoneNumber?: NonEmptyString;
  }
  export interface SendVoiceMessageResponse {
    /**
     * A unique identifier for the voice message.
     */
    MessageId?: String;
  }
  export interface SnsDestination {
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic that you want to publish events to.
     */
    TopicArn?: String;
  }
  export type String = string;
  export interface UpdateConfigurationSetEventDestinationRequest {
    /**
     * ConfigurationSetName
     */
    ConfigurationSetName: __string;
    EventDestination?: EventDestinationDefinition;
    /**
     * EventDestinationName
     */
    EventDestinationName: __string;
  }
  export interface UpdateConfigurationSetEventDestinationResponse {
  }
  export interface VoiceMessageContent {
    CallInstructionsMessage?: CallInstructionsMessageType;
    PlainTextMessage?: PlainTextMessageType;
    SSMLMessage?: SSMLMessageType;
  }
  export type WordCharactersWithDelimiters = string;
  export type __string = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-09-05"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the PinpointSMSVoice client.
   */
  export import Types = PinpointSMSVoice;
}
export = PinpointSMSVoice;
