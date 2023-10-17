import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class LexRuntimeV2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: LexRuntimeV2.Types.ClientConfiguration)
  config: Config & LexRuntimeV2.Types.ClientConfiguration;
  /**
   * Removes session information for a specified bot, alias, and user ID.  You can use this operation to restart a conversation with a bot. When you remove a session, the entire history of the session is removed so that you can start again. You don't need to delete a session. Sessions have a time limit and will expire. Set the session time limit when you create the bot. The default is 5 minutes, but you can specify anything between 1 minute and 24 hours. If you specify a bot or alias ID that doesn't exist, you receive a BadRequestException.  If the locale doesn't exist in the bot, or if the locale hasn't been enables for the alias, you receive a BadRequestException.
   */
  deleteSession(params: LexRuntimeV2.Types.DeleteSessionRequest, callback?: (err: AWSError, data: LexRuntimeV2.Types.DeleteSessionResponse) => void): Request<LexRuntimeV2.Types.DeleteSessionResponse, AWSError>;
  /**
   * Removes session information for a specified bot, alias, and user ID.  You can use this operation to restart a conversation with a bot. When you remove a session, the entire history of the session is removed so that you can start again. You don't need to delete a session. Sessions have a time limit and will expire. Set the session time limit when you create the bot. The default is 5 minutes, but you can specify anything between 1 minute and 24 hours. If you specify a bot or alias ID that doesn't exist, you receive a BadRequestException.  If the locale doesn't exist in the bot, or if the locale hasn't been enables for the alias, you receive a BadRequestException.
   */
  deleteSession(callback?: (err: AWSError, data: LexRuntimeV2.Types.DeleteSessionResponse) => void): Request<LexRuntimeV2.Types.DeleteSessionResponse, AWSError>;
  /**
   * Returns session information for a specified bot, alias, and user. For example, you can use this operation to retrieve session information for a user that has left a long-running session in use. If the bot, alias, or session identifier doesn't exist, Amazon Lex V2 returns a BadRequestException. If the locale doesn't exist or is not enabled for the alias, you receive a BadRequestException.
   */
  getSession(params: LexRuntimeV2.Types.GetSessionRequest, callback?: (err: AWSError, data: LexRuntimeV2.Types.GetSessionResponse) => void): Request<LexRuntimeV2.Types.GetSessionResponse, AWSError>;
  /**
   * Returns session information for a specified bot, alias, and user. For example, you can use this operation to retrieve session information for a user that has left a long-running session in use. If the bot, alias, or session identifier doesn't exist, Amazon Lex V2 returns a BadRequestException. If the locale doesn't exist or is not enabled for the alias, you receive a BadRequestException.
   */
  getSession(callback?: (err: AWSError, data: LexRuntimeV2.Types.GetSessionResponse) => void): Request<LexRuntimeV2.Types.GetSessionResponse, AWSError>;
  /**
   * Creates a new session or modifies an existing session with an Amazon Lex V2 bot. Use this operation to enable your application to set the state of the bot.
   */
  putSession(params: LexRuntimeV2.Types.PutSessionRequest, callback?: (err: AWSError, data: LexRuntimeV2.Types.PutSessionResponse) => void): Request<LexRuntimeV2.Types.PutSessionResponse, AWSError>;
  /**
   * Creates a new session or modifies an existing session with an Amazon Lex V2 bot. Use this operation to enable your application to set the state of the bot.
   */
  putSession(callback?: (err: AWSError, data: LexRuntimeV2.Types.PutSessionResponse) => void): Request<LexRuntimeV2.Types.PutSessionResponse, AWSError>;
  /**
   * Sends user input to Amazon Lex V2. Client applications use this API to send requests to Amazon Lex V2 at runtime. Amazon Lex V2 then interprets the user input using the machine learning model that it build for the bot. In response, Amazon Lex V2 returns the next message to convey to the user and an optional response card to display. If the optional post-fulfillment response is specified, the messages are returned as follows. For more information, see PostFulfillmentStatusSpecification.    Success message - Returned if the Lambda function completes successfully and the intent state is fulfilled or ready fulfillment if the message is present.    Failed message - The failed message is returned if the Lambda function throws an exception or if the Lambda function returns a failed intent state without a message.    Timeout message - If you don't configure a timeout message and a timeout, and the Lambda function doesn't return within 30 seconds, the timeout message is returned. If you configure a timeout, the timeout message is returned when the period times out.    For more information, see Completion message.
   */
  recognizeText(params: LexRuntimeV2.Types.RecognizeTextRequest, callback?: (err: AWSError, data: LexRuntimeV2.Types.RecognizeTextResponse) => void): Request<LexRuntimeV2.Types.RecognizeTextResponse, AWSError>;
  /**
   * Sends user input to Amazon Lex V2. Client applications use this API to send requests to Amazon Lex V2 at runtime. Amazon Lex V2 then interprets the user input using the machine learning model that it build for the bot. In response, Amazon Lex V2 returns the next message to convey to the user and an optional response card to display. If the optional post-fulfillment response is specified, the messages are returned as follows. For more information, see PostFulfillmentStatusSpecification.    Success message - Returned if the Lambda function completes successfully and the intent state is fulfilled or ready fulfillment if the message is present.    Failed message - The failed message is returned if the Lambda function throws an exception or if the Lambda function returns a failed intent state without a message.    Timeout message - If you don't configure a timeout message and a timeout, and the Lambda function doesn't return within 30 seconds, the timeout message is returned. If you configure a timeout, the timeout message is returned when the period times out.    For more information, see Completion message.
   */
  recognizeText(callback?: (err: AWSError, data: LexRuntimeV2.Types.RecognizeTextResponse) => void): Request<LexRuntimeV2.Types.RecognizeTextResponse, AWSError>;
  /**
   * Sends user input to Amazon Lex V2. You can send text or speech. Clients use this API to send text and audio requests to Amazon Lex V2 at runtime. Amazon Lex V2 interprets the user input using the machine learning model built for the bot. The following request fields must be compressed with gzip and then base64 encoded before you send them to Amazon Lex V2.    requestAttributes   sessionState   The following response fields are compressed using gzip and then base64 encoded by Amazon Lex V2. Before you can use these fields, you must decode and decompress them.    inputTranscript   interpretations   messages   requestAttributes   sessionState   The example contains a Java application that compresses and encodes a Java object to send to Amazon Lex V2, and a second that decodes and decompresses a response from Amazon Lex V2. If the optional post-fulfillment response is specified, the messages are returned as follows. For more information, see PostFulfillmentStatusSpecification.    Success message - Returned if the Lambda function completes successfully and the intent state is fulfilled or ready fulfillment if the message is present.    Failed message - The failed message is returned if the Lambda function throws an exception or if the Lambda function returns a failed intent state without a message.    Timeout message - If you don't configure a timeout message and a timeout, and the Lambda function doesn't return within 30 seconds, the timeout message is returned. If you configure a timeout, the timeout message is returned when the period times out.    For more information, see Completion message.
   */
  recognizeUtterance(params: LexRuntimeV2.Types.RecognizeUtteranceRequest, callback?: (err: AWSError, data: LexRuntimeV2.Types.RecognizeUtteranceResponse) => void): Request<LexRuntimeV2.Types.RecognizeUtteranceResponse, AWSError>;
  /**
   * Sends user input to Amazon Lex V2. You can send text or speech. Clients use this API to send text and audio requests to Amazon Lex V2 at runtime. Amazon Lex V2 interprets the user input using the machine learning model built for the bot. The following request fields must be compressed with gzip and then base64 encoded before you send them to Amazon Lex V2.    requestAttributes   sessionState   The following response fields are compressed using gzip and then base64 encoded by Amazon Lex V2. Before you can use these fields, you must decode and decompress them.    inputTranscript   interpretations   messages   requestAttributes   sessionState   The example contains a Java application that compresses and encodes a Java object to send to Amazon Lex V2, and a second that decodes and decompresses a response from Amazon Lex V2. If the optional post-fulfillment response is specified, the messages are returned as follows. For more information, see PostFulfillmentStatusSpecification.    Success message - Returned if the Lambda function completes successfully and the intent state is fulfilled or ready fulfillment if the message is present.    Failed message - The failed message is returned if the Lambda function throws an exception or if the Lambda function returns a failed intent state without a message.    Timeout message - If you don't configure a timeout message and a timeout, and the Lambda function doesn't return within 30 seconds, the timeout message is returned. If you configure a timeout, the timeout message is returned when the period times out.    For more information, see Completion message.
   */
  recognizeUtterance(callback?: (err: AWSError, data: LexRuntimeV2.Types.RecognizeUtteranceResponse) => void): Request<LexRuntimeV2.Types.RecognizeUtteranceResponse, AWSError>;
}
declare namespace LexRuntimeV2 {
  export interface ActiveContext {
    /**
     * The name of the context.
     */
    name: ActiveContextName;
    /**
     * Indicates the number of turns or seconds that the context is active. Once the time to live expires, the context is no longer returned in a response.
     */
    timeToLive: ActiveContextTimeToLive;
    /**
     * A list of contexts active for the request. A context can be activated when a previous intent is fulfilled, or by including the context in the request. If you don't specify a list of contexts, Amazon Lex V2 will use the current list of contexts for the session. If you specify an empty list, all contexts for the session are cleared. 
     */
    contextAttributes: ActiveContextParametersMap;
  }
  export type ActiveContextName = string;
  export type ActiveContextParametersMap = {[key: string]: Text};
  export interface ActiveContextTimeToLive {
    /**
     * The number of seconds that the context is active. You can specify between 5 and 86400 seconds (24 hours).
     */
    timeToLiveInSeconds: ActiveContextTimeToLiveInSeconds;
    /**
     * The number of turns that the context is active. You can specify up to 20 turns. Each request and response from the bot is a turn.
     */
    turnsToLive: ActiveContextTurnsToLive;
  }
  export type ActiveContextTimeToLiveInSeconds = number;
  export type ActiveContextTurnsToLive = number;
  export type ActiveContextsList = ActiveContext[];
  export type AttachmentTitle = string;
  export type AttachmentUrl = string;
  export type BlobStream = Buffer|Uint8Array|Blob|string|Readable;
  export type BotAliasIdentifier = string;
  export type BotIdentifier = string;
  export interface Button {
    /**
     * The text that is displayed on the button.
     */
    text: ButtonText;
    /**
     * The value returned to Amazon Lex V2 when a user chooses the button.
     */
    value: ButtonValue;
  }
  export type ButtonText = string;
  export type ButtonValue = string;
  export type ButtonsList = Button[];
  export interface ConfidenceScore {
    /**
     * A score that indicates how confident Amazon Lex V2 is that an intent satisfies the user's intent. Ranges between 0.00 and 1.00. Higher scores indicate higher confidence.
     */
    score?: Double;
  }
  export type ConfirmationState = "Confirmed"|"Denied"|"None"|string;
  export interface DeleteSessionRequest {
    /**
     * The identifier of the bot that contains the session data.
     */
    botId: BotIdentifier;
    /**
     * The alias identifier in use for the bot that contains the session data.
     */
    botAliasId: BotAliasIdentifier;
    /**
     * The locale where the session is in use.
     */
    localeId: LocaleId;
    /**
     * The identifier of the session to delete.
     */
    sessionId: SessionId;
  }
  export interface DeleteSessionResponse {
    /**
     * The identifier of the bot that contained the session data.
     */
    botId?: BotIdentifier;
    /**
     * The alias identifier in use for the bot that contained the session data.
     */
    botAliasId?: BotAliasIdentifier;
    /**
     * The locale where the session was used.
     */
    localeId?: LocaleId;
    /**
     * The identifier of the deleted session.
     */
    sessionId?: SessionId;
  }
  export interface DialogAction {
    /**
     * The next action that the bot should take in its interaction with the user. The possible values are:    Close - Indicates that there will not be a response from the user. For example, the statement "Your order has been placed" does not require a response.    ConfirmIntent - The next action is asking the user if the intent is complete and ready to be fulfilled. This is a yes/no question such as "Place the order?"    Delegate - The next action is determined by Amazon Lex V2.    ElicitIntent - The next action is to elicit an intent from the user.    ElicitSlot - The next action is to elicit a slot value from the user.  
     */
    type: DialogActionType;
    /**
     * The name of the slot that should be elicited from the user.
     */
    slotToElicit?: NonEmptyString;
    /**
     * Configures the slot to use spell-by-letter or spell-by-word style. When you use a style on a slot, users can spell out their input to make it clear to your bot.   Spell by letter - "b" "o" "b"   Spell by word - "b as in boy" "o as in oscar" "b as in boy"   For more information, see  Using spelling to enter slot values .
     */
    slotElicitationStyle?: StyleType;
    /**
     * The name of the constituent sub slot of the composite slot specified in slotToElicit that should be elicited from the user.
     */
    subSlotToElicit?: ElicitSubSlot;
  }
  export type DialogActionType = "Close"|"ConfirmIntent"|"Delegate"|"ElicitIntent"|"ElicitSlot"|"None"|string;
  export type Double = number;
  export interface ElicitSubSlot {
    /**
     * The name of the slot that should be elicited from the user.
     */
    name: NonEmptyString;
    /**
     * The field is not supported.
     */
    subSlotToElicit?: ElicitSubSlot;
  }
  export interface GetSessionRequest {
    /**
     * The identifier of the bot that contains the session data.
     */
    botId: BotIdentifier;
    /**
     * The alias identifier in use for the bot that contains the session data.
     */
    botAliasId: BotAliasIdentifier;
    /**
     * The locale where the session is in use.
     */
    localeId: LocaleId;
    /**
     * The identifier of the session to return.
     */
    sessionId: SessionId;
  }
  export interface GetSessionResponse {
    /**
     * The identifier of the returned session.
     */
    sessionId?: NonEmptyString;
    /**
     * A list of messages that were last sent to the user. The messages are ordered based on the order that your returned the messages from your Lambda function or the order that messages are defined in the bot. 
     */
    messages?: Messages;
    /**
     * A list of intents that Amazon Lex V2 determined might satisfy the user's utterance.  Each interpretation includes the intent, a score that indicates how confident Amazon Lex V2 is that the interpretation is the correct one, and an optional sentiment response that indicates the sentiment expressed in the utterance.
     */
    interpretations?: Interpretations;
    /**
     * Represents the current state of the dialog between the user and the bot. You can use this to determine the progress of the conversation and what the next action might be.
     */
    sessionState?: SessionState;
  }
  export interface ImageResponseCard {
    /**
     * The title to display on the response card. The format of the title is determined by the platform displaying the response card.
     */
    title: AttachmentTitle;
    /**
     * The subtitle to display on the response card. The format of the subtitle is determined by the platform displaying the response card.
     */
    subtitle?: AttachmentTitle;
    /**
     * The URL of an image to display on the response card. The image URL must be publicly available so that the platform displaying the response card has access to the image.
     */
    imageUrl?: AttachmentUrl;
    /**
     * A list of buttons that should be displayed on the response card. The arrangement of the buttons is determined by the platform that displays the button.
     */
    buttons?: ButtonsList;
  }
  export interface Intent {
    /**
     * The name of the intent.
     */
    name: NonEmptyString;
    /**
     * A map of all of the slots for the intent. The name of the slot maps to the value of the slot. If a slot has not been filled, the value is null.
     */
    slots?: Slots;
    /**
     * Contains fulfillment information for the intent. 
     */
    state?: IntentState;
    /**
     * Contains information about whether fulfillment of the intent has been confirmed.
     */
    confirmationState?: ConfirmationState;
  }
  export type IntentState = "Failed"|"Fulfilled"|"InProgress"|"ReadyForFulfillment"|"Waiting"|"FulfillmentInProgress"|string;
  export interface Interpretation {
    /**
     * Determines the threshold where Amazon Lex V2 will insert the AMAZON.FallbackIntent, AMAZON.KendraSearchIntent, or both when returning alternative intents in a response. AMAZON.FallbackIntent and AMAZON.KendraSearchIntent are only inserted if they are configured for the bot.
     */
    nluConfidence?: ConfidenceScore;
    /**
     * The sentiment expressed in an utterance.  When the bot is configured to send utterances to Amazon Comprehend for sentiment analysis, this field contains the result of the analysis.
     */
    sentimentResponse?: SentimentResponse;
    /**
     * A list of intents that might satisfy the user's utterance. The intents are ordered by the confidence score.
     */
    intent?: Intent;
  }
  export type Interpretations = Interpretation[];
  export type LocaleId = string;
  export interface Message {
    /**
     * The text of the message.
     */
    content?: Text;
    /**
     * Indicates the type of response.
     */
    contentType: MessageContentType;
    imageResponseCard?: ImageResponseCard;
  }
  export type MessageContentType = "CustomPayload"|"ImageResponseCard"|"PlainText"|"SSML"|string;
  export type Messages = Message[];
  export type Name = string;
  export type NonEmptyString = string;
  export type ParameterName = string;
  export interface PutSessionRequest {
    /**
     * The identifier of the bot that receives the session data.
     */
    botId: BotIdentifier;
    /**
     * The alias identifier of the bot that receives the session data.
     */
    botAliasId: BotAliasIdentifier;
    /**
     * The locale where the session is in use.
     */
    localeId: LocaleId;
    /**
     * The identifier of the session that receives the session data.
     */
    sessionId: SessionId;
    /**
     * A list of messages to send to the user. Messages are sent in the order that they are defined in the list.
     */
    messages?: Messages;
    /**
     * Sets the state of the session with the user. You can use this to set the current intent, attributes, context, and dialog action. Use the dialog action to determine the next step that Amazon Lex V2 should use in the conversation with the user.
     */
    sessionState: SessionState;
    /**
     * Request-specific information passed between Amazon Lex V2 and the client application. The namespace x-amz-lex: is reserved for special attributes. Don't create any request attributes with the prefix x-amz-lex:.
     */
    requestAttributes?: StringMap;
    /**
     * The message that Amazon Lex V2 returns in the response can be either text or speech depending on the value of this parameter.    If the value is text/plain; charset=utf-8, Amazon Lex V2 returns text in the response.  
     */
    responseContentType?: NonEmptyString;
  }
  export interface PutSessionResponse {
    /**
     * The type of response. Same as the type specified in the responseContentType field in the request.
     */
    contentType?: NonEmptyString;
    /**
     * A list of messages that were last sent to the user. The messages are ordered based on how you return the messages from you Lambda function or the order that the messages are defined in the bot.
     */
    messages?: NonEmptyString;
    /**
     * Represents the current state of the dialog between the user and the bot. Use this to determine the progress of the conversation and what the next action may be.
     */
    sessionState?: NonEmptyString;
    /**
     * Request-specific information passed between the client application and Amazon Lex V2. These are the same as the requestAttribute parameter in the call to the PutSession operation.
     */
    requestAttributes?: NonEmptyString;
    /**
     * The identifier of the session that received the data.
     */
    sessionId?: SessionId;
    /**
     * If the requested content type was audio, the audio version of the message to convey to the user.
     */
    audioStream?: BlobStream;
  }
  export interface RecognizeTextRequest {
    /**
     * The identifier of the bot that processes the request.
     */
    botId: BotIdentifier;
    /**
     * The alias identifier in use for the bot that processes the request.
     */
    botAliasId: BotAliasIdentifier;
    /**
     * The locale where the session is in use.
     */
    localeId: LocaleId;
    /**
     * The identifier of the user session that is having the conversation.
     */
    sessionId: SessionId;
    /**
     * The text that the user entered. Amazon Lex V2 interprets this text.
     */
    text: Text;
    /**
     * The current state of the dialog between the user and the bot.
     */
    sessionState?: SessionState;
    /**
     * Request-specific information passed between the client application and Amazon Lex V2  The namespace x-amz-lex: is reserved for special attributes. Don't create any request attributes with the prefix x-amz-lex:.
     */
    requestAttributes?: StringMap;
  }
  export interface RecognizeTextResponse {
    /**
     * A list of messages last sent to the user. The messages are ordered based on the order that you returned the messages from your Lambda function or the order that the messages are defined in the bot.
     */
    messages?: Messages;
    /**
     * Represents the current state of the dialog between the user and the bot.  Use this to determine the progress of the conversation and what the next action may be.
     */
    sessionState?: SessionState;
    /**
     * A list of intents that Amazon Lex V2 determined might satisfy the user's utterance.  Each interpretation includes the intent, a score that indicates now confident Amazon Lex V2 is that the interpretation is the correct one, and an optional sentiment response that indicates the sentiment expressed in the utterance.
     */
    interpretations?: Interpretations;
    /**
     * The attributes sent in the request.
     */
    requestAttributes?: StringMap;
    /**
     * The identifier of the session in use.
     */
    sessionId?: SessionId;
    /**
     * The bot member that recognized the text.
     */
    recognizedBotMember?: RecognizedBotMember;
  }
  export interface RecognizeUtteranceRequest {
    /**
     * The identifier of the bot that should receive the request.
     */
    botId: BotIdentifier;
    /**
     * The alias identifier in use for the bot that should receive the request.
     */
    botAliasId: BotAliasIdentifier;
    /**
     * The locale where the session is in use.
     */
    localeId: LocaleId;
    /**
     * The identifier of the session in use.
     */
    sessionId: SessionId;
    /**
     * Sets the state of the session with the user. You can use this to set the current intent, attributes, context, and dialog action. Use the dialog action to determine the next step that Amazon Lex V2 should use in the conversation with the user. The sessionState field must be compressed using gzip and then base64 encoded before sending to Amazon Lex V2.
     */
    sessionState?: SensitiveNonEmptyString;
    /**
     * Request-specific information passed between the client application and Amazon Lex V2  The namespace x-amz-lex: is reserved for special attributes. Don't create any request attributes for prefix x-amz-lex:. The requestAttributes field must be compressed using gzip and then base64 encoded before sending to Amazon Lex V2.
     */
    requestAttributes?: SensitiveNonEmptyString;
    /**
     * Indicates the format for audio input or that the content is text. The header must start with one of the following prefixes:   PCM format, audio data must be in little-endian byte order.   audio/l16; rate=16000; channels=1   audio/x-l16; sample-rate=16000; channel-count=1   audio/lpcm; sample-rate=8000; sample-size-bits=16; channel-count=1; is-big-endian=false     Opus format   audio/x-cbr-opus-with-preamble;preamble-size=0;bit-rate=256000;frame-size-milliseconds=4     Text format   text/plain; charset=utf-8    
     */
    requestContentType: NonEmptyString;
    /**
     * The message that Amazon Lex V2 returns in the response can be either text or speech based on the responseContentType value.   If the value is text/plain;charset=utf-8, Amazon Lex V2 returns text in the response.   If the value begins with audio/, Amazon Lex V2 returns speech in the response. Amazon Lex V2 uses Amazon Polly to generate the speech using the configuration that you specified in the responseContentType parameter. For example, if you specify audio/mpeg as the value, Amazon Lex V2 returns speech in the MPEG format.   If the value is audio/pcm, the speech returned is audio/pcm at 16 KHz in 16-bit, little-endian format.   The following are the accepted values:   audio/mpeg   audio/ogg   audio/pcm (16 KHz)   audio/* (defaults to mpeg)   text/plain; charset=utf-8    
     */
    responseContentType?: NonEmptyString;
    /**
     * User input in PCM or Opus audio format or text format as described in the requestContentType parameter.
     */
    inputStream?: BlobStream;
  }
  export interface RecognizeUtteranceResponse {
    /**
     * Indicates whether the input mode to the operation was text or speech. 
     */
    inputMode?: NonEmptyString;
    /**
     * Content type as specified in the responseContentType in the request.
     */
    contentType?: NonEmptyString;
    /**
     * A list of messages that were last sent to the user. The messages are ordered based on the order that you returned the messages from your Lambda function or the order that the messages are defined in the bot. The messages field is compressed with gzip and then base64 encoded. Before you can use the contents of the field, you must decode and decompress the contents. See the example for a simple function to decode and decompress the contents.
     */
    messages?: NonEmptyString;
    /**
     * A list of intents that Amazon Lex V2 determined might satisfy the user's utterance. Each interpretation includes the intent, a score that indicates how confident Amazon Lex V2 is that the interpretation is the correct one, and an optional sentiment response that indicates the sentiment expressed in the utterance. The interpretations field is compressed with gzip and then base64 encoded. Before you can use the contents of the field, you must decode and decompress the contents. See the example for a simple function to decode and decompress the contents.
     */
    interpretations?: NonEmptyString;
    /**
     * Represents the current state of the dialog between the user and the bot. Use this to determine the progress of the conversation and what the next action might be. The sessionState field is compressed with gzip and then base64 encoded. Before you can use the contents of the field, you must decode and decompress the contents. See the example for a simple function to decode and decompress the contents.
     */
    sessionState?: NonEmptyString;
    /**
     * The attributes sent in the request. The requestAttributes field is compressed with gzip and then base64 encoded. Before you can use the contents of the field, you must decode and decompress the contents.
     */
    requestAttributes?: NonEmptyString;
    /**
     * The identifier of the session in use.
     */
    sessionId?: SessionId;
    /**
     * The text used to process the request. If the input was an audio stream, the inputTranscript field contains the text extracted from the audio stream. This is the text that is actually processed to recognize intents and slot values. You can use this information to determine if Amazon Lex V2 is correctly processing the audio that you send. The inputTranscript field is compressed with gzip and then base64 encoded. Before you can use the contents of the field, you must decode and decompress the contents. See the example for a simple function to decode and decompress the contents.
     */
    inputTranscript?: NonEmptyString;
    /**
     * The prompt or statement to send to the user. This is based on the bot configuration and context. For example, if Amazon Lex V2 did not understand the user intent, it sends the clarificationPrompt configured for the bot. If the intent requires confirmation before taking the fulfillment action, it sends the confirmationPrompt. Another example: Suppose that the Lambda function successfully fulfilled the intent, and sent a message to convey to the user. Then Amazon Lex V2 sends that message in the response.
     */
    audioStream?: BlobStream;
    /**
     * The bot member that recognized the utterance.
     */
    recognizedBotMember?: NonEmptyString;
  }
  export interface RecognizedBotMember {
    /**
     * The identifier of the bot member that processes the request.
     */
    botId: BotIdentifier;
    /**
     * The name of the bot member that processes the request.
     */
    botName?: Name;
  }
  export interface RuntimeHintDetails {
    /**
     * One or more strings that Amazon Lex V2 should look for in the input to the bot. Each phrase is given preference when deciding on slot values.
     */
    runtimeHintValues?: RuntimeHintValuesList;
    /**
     * A map of constituent sub slot names inside a composite slot in the intent and the phrases that should be added for each sub slot. Inside each composite slot hints, this structure provides a mechanism to add granular sub slot phrases. Only sub slot hints are supported for composite slots. The intent name, composite slot name and the constituent sub slot names must exist.
     */
    subSlotHints?: SlotHintsSlotMap;
  }
  export type RuntimeHintPhrase = string;
  export interface RuntimeHintValue {
    /**
     * The phrase that Amazon Lex V2 should look for in the user's input to the bot.
     */
    phrase: RuntimeHintPhrase;
  }
  export type RuntimeHintValuesList = RuntimeHintValue[];
  export interface RuntimeHints {
    /**
     * A list of the slots in the intent that should have runtime hints added, and the phrases that should be added for each slot. The first level of the slotHints map is the name of the intent. The second level is the name of the slot within the intent. For more information, see Using hints to improve accuracy. The intent name and slot name must exist.
     */
    slotHints?: SlotHintsIntentMap;
  }
  export type SensitiveNonEmptyString = string;
  export interface SentimentResponse {
    /**
     * The overall sentiment expressed in the user's response. This is the sentiment most likely expressed by the user based on the analysis by Amazon Comprehend.
     */
    sentiment?: SentimentType;
    sentimentScore?: SentimentScore;
  }
  export interface SentimentScore {
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of its detection of the POSITIVE sentiment.
     */
    positive?: Double;
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of its detection of the NEGATIVE sentiment.
     */
    negative?: Double;
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of its detection of the NEUTRAL sentiment.
     */
    neutral?: Double;
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of its detection of the MIXED sentiment.
     */
    mixed?: Double;
  }
  export type SentimentType = "MIXED"|"NEGATIVE"|"NEUTRAL"|"POSITIVE"|string;
  export type SessionId = string;
  export interface SessionState {
    /**
     * The next step that Amazon Lex V2 should take in the conversation with a user.
     */
    dialogAction?: DialogAction;
    /**
     * The active intent that Amazon Lex V2 is processing.
     */
    intent?: Intent;
    /**
     * One or more contexts that indicate to Amazon Lex V2 the context of a request. When a context is active, Amazon Lex V2 considers intents with the matching context as a trigger as the next intent in a session.
     */
    activeContexts?: ActiveContextsList;
    /**
     * Map of key/value pairs representing session-specific context information. It contains application information passed between Amazon Lex V2 and a client application.
     */
    sessionAttributes?: StringMap;
    /**
     * A unique identifier for a specific request.
     */
    originatingRequestId?: NonEmptyString;
    /**
     * Hints for phrases that a customer is likely to use for a slot. Amazon Lex V2 uses the hints to help determine the correct value of a slot.
     */
    runtimeHints?: RuntimeHints;
  }
  export type Shape = "Scalar"|"List"|"Composite"|string;
  export interface Slot {
    /**
     * The current value of the slot.
     */
    value?: Value;
    /**
     * When the shape value is List, it indicates that the values field contains a list of slot values. When the value is Scalar, it indicates that the value field contains a single value.
     */
    shape?: Shape;
    /**
     * A list of one or more values that the user provided for the slot. For example, if a for a slot that elicits pizza toppings, the values might be "pepperoni" and "pineapple." 
     */
    values?: Values;
    /**
     * The constituent sub slots of a composite slot.
     */
    subSlots?: Slots;
  }
  export type SlotHintsIntentMap = {[key: string]: SlotHintsSlotMap};
  export type SlotHintsSlotMap = {[key: string]: RuntimeHintDetails};
  export type Slots = {[key: string]: Slot};
  export type String = string;
  export type StringList = NonEmptyString[];
  export type StringMap = {[key: string]: String};
  export type StyleType = "Default"|"SpellByLetter"|"SpellByWord"|string;
  export type Text = string;
  export interface Value {
    /**
     * The text of the utterance from the user that was entered for the slot.
     */
    originalValue?: NonEmptyString;
    /**
     * The value that Amazon Lex V2 determines for the slot. The actual value depends on the setting of the value selection strategy for the bot. You can choose to use the value entered by the user, or you can have Amazon Lex V2 choose the first value in the resolvedValues list.
     */
    interpretedValue: NonEmptyString;
    /**
     * A list of additional values that have been recognized for the slot.
     */
    resolvedValues?: StringList;
  }
  export type Values = Slot[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-08-07"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the LexRuntimeV2 client.
   */
  export import Types = LexRuntimeV2;
}
export = LexRuntimeV2;
