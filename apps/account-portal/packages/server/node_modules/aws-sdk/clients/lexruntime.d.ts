import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class LexRuntime extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: LexRuntime.Types.ClientConfiguration)
  config: Config & LexRuntime.Types.ClientConfiguration;
  /**
   * Removes session information for a specified bot, alias, and user ID. 
   */
  deleteSession(params: LexRuntime.Types.DeleteSessionRequest, callback?: (err: AWSError, data: LexRuntime.Types.DeleteSessionResponse) => void): Request<LexRuntime.Types.DeleteSessionResponse, AWSError>;
  /**
   * Removes session information for a specified bot, alias, and user ID. 
   */
  deleteSession(callback?: (err: AWSError, data: LexRuntime.Types.DeleteSessionResponse) => void): Request<LexRuntime.Types.DeleteSessionResponse, AWSError>;
  /**
   * Returns session information for a specified bot, alias, and user ID.
   */
  getSession(params: LexRuntime.Types.GetSessionRequest, callback?: (err: AWSError, data: LexRuntime.Types.GetSessionResponse) => void): Request<LexRuntime.Types.GetSessionResponse, AWSError>;
  /**
   * Returns session information for a specified bot, alias, and user ID.
   */
  getSession(callback?: (err: AWSError, data: LexRuntime.Types.GetSessionResponse) => void): Request<LexRuntime.Types.GetSessionResponse, AWSError>;
  /**
   *  Sends user input (text or speech) to Amazon Lex. Clients use this API to send text and audio requests to Amazon Lex at runtime. Amazon Lex interprets the user input using the machine learning model that it built for the bot.  The PostContent operation supports audio input at 8kHz and 16kHz. You can use 8kHz audio to achieve higher speech recognition accuracy in telephone audio applications.   In response, Amazon Lex returns the next message to convey to the user. Consider the following example messages:     For a user input "I would like a pizza," Amazon Lex might return a response with a message eliciting slot data (for example, PizzaSize): "What size pizza would you like?".     After the user provides all of the pizza order information, Amazon Lex might return a response with a message to get user confirmation: "Order the pizza?".     After the user replies "Yes" to the confirmation prompt, Amazon Lex might return a conclusion statement: "Thank you, your cheese pizza has been ordered.".     Not all Amazon Lex messages require a response from the user. For example, conclusion statements do not require a response. Some messages require only a yes or no response. In addition to the message, Amazon Lex provides additional context about the message in the response that you can use to enhance client behavior, such as displaying the appropriate client user interface. Consider the following examples:     If the message is to elicit slot data, Amazon Lex returns the following context information:     x-amz-lex-dialog-state header set to ElicitSlot     x-amz-lex-intent-name header set to the intent name in the current context     x-amz-lex-slot-to-elicit header set to the slot name for which the message is eliciting information     x-amz-lex-slots header set to a map of slots configured for the intent with their current values       If the message is a confirmation prompt, the x-amz-lex-dialog-state header is set to Confirmation and the x-amz-lex-slot-to-elicit header is omitted.     If the message is a clarification prompt configured for the intent, indicating that the user intent is not understood, the x-amz-dialog-state header is set to ElicitIntent and the x-amz-slot-to-elicit header is omitted.     In addition, Amazon Lex also returns your application-specific sessionAttributes. For more information, see Managing Conversation Context. 
   */
  postContent(params: LexRuntime.Types.PostContentRequest, callback?: (err: AWSError, data: LexRuntime.Types.PostContentResponse) => void): Request<LexRuntime.Types.PostContentResponse, AWSError>;
  /**
   *  Sends user input (text or speech) to Amazon Lex. Clients use this API to send text and audio requests to Amazon Lex at runtime. Amazon Lex interprets the user input using the machine learning model that it built for the bot.  The PostContent operation supports audio input at 8kHz and 16kHz. You can use 8kHz audio to achieve higher speech recognition accuracy in telephone audio applications.   In response, Amazon Lex returns the next message to convey to the user. Consider the following example messages:     For a user input "I would like a pizza," Amazon Lex might return a response with a message eliciting slot data (for example, PizzaSize): "What size pizza would you like?".     After the user provides all of the pizza order information, Amazon Lex might return a response with a message to get user confirmation: "Order the pizza?".     After the user replies "Yes" to the confirmation prompt, Amazon Lex might return a conclusion statement: "Thank you, your cheese pizza has been ordered.".     Not all Amazon Lex messages require a response from the user. For example, conclusion statements do not require a response. Some messages require only a yes or no response. In addition to the message, Amazon Lex provides additional context about the message in the response that you can use to enhance client behavior, such as displaying the appropriate client user interface. Consider the following examples:     If the message is to elicit slot data, Amazon Lex returns the following context information:     x-amz-lex-dialog-state header set to ElicitSlot     x-amz-lex-intent-name header set to the intent name in the current context     x-amz-lex-slot-to-elicit header set to the slot name for which the message is eliciting information     x-amz-lex-slots header set to a map of slots configured for the intent with their current values       If the message is a confirmation prompt, the x-amz-lex-dialog-state header is set to Confirmation and the x-amz-lex-slot-to-elicit header is omitted.     If the message is a clarification prompt configured for the intent, indicating that the user intent is not understood, the x-amz-dialog-state header is set to ElicitIntent and the x-amz-slot-to-elicit header is omitted.     In addition, Amazon Lex also returns your application-specific sessionAttributes. For more information, see Managing Conversation Context. 
   */
  postContent(callback?: (err: AWSError, data: LexRuntime.Types.PostContentResponse) => void): Request<LexRuntime.Types.PostContentResponse, AWSError>;
  /**
   * Sends user input to Amazon Lex. Client applications can use this API to send requests to Amazon Lex at runtime. Amazon Lex then interprets the user input using the machine learning model it built for the bot.   In response, Amazon Lex returns the next message to convey to the user an optional responseCard to display. Consider the following example messages:     For a user input "I would like a pizza", Amazon Lex might return a response with a message eliciting slot data (for example, PizzaSize): "What size pizza would you like?"     After the user provides all of the pizza order information, Amazon Lex might return a response with a message to obtain user confirmation "Proceed with the pizza order?".     After the user replies to a confirmation prompt with a "yes", Amazon Lex might return a conclusion statement: "Thank you, your cheese pizza has been ordered.".     Not all Amazon Lex messages require a user response. For example, a conclusion statement does not require a response. Some messages require only a "yes" or "no" user response. In addition to the message, Amazon Lex provides additional context about the message in the response that you might use to enhance client behavior, for example, to display the appropriate client user interface. These are the slotToElicit, dialogState, intentName, and slots fields in the response. Consider the following examples:    If the message is to elicit slot data, Amazon Lex returns the following context information:    dialogState set to ElicitSlot     intentName set to the intent name in the current context     slotToElicit set to the slot name for which the message is eliciting information     slots set to a map of slots, configured for the intent, with currently known values       If the message is a confirmation prompt, the dialogState is set to ConfirmIntent and SlotToElicit is set to null.    If the message is a clarification prompt (configured for the intent) that indicates that user intent is not understood, the dialogState is set to ElicitIntent and slotToElicit is set to null.     In addition, Amazon Lex also returns your application-specific sessionAttributes. For more information, see Managing Conversation Context. 
   */
  postText(params: LexRuntime.Types.PostTextRequest, callback?: (err: AWSError, data: LexRuntime.Types.PostTextResponse) => void): Request<LexRuntime.Types.PostTextResponse, AWSError>;
  /**
   * Sends user input to Amazon Lex. Client applications can use this API to send requests to Amazon Lex at runtime. Amazon Lex then interprets the user input using the machine learning model it built for the bot.   In response, Amazon Lex returns the next message to convey to the user an optional responseCard to display. Consider the following example messages:     For a user input "I would like a pizza", Amazon Lex might return a response with a message eliciting slot data (for example, PizzaSize): "What size pizza would you like?"     After the user provides all of the pizza order information, Amazon Lex might return a response with a message to obtain user confirmation "Proceed with the pizza order?".     After the user replies to a confirmation prompt with a "yes", Amazon Lex might return a conclusion statement: "Thank you, your cheese pizza has been ordered.".     Not all Amazon Lex messages require a user response. For example, a conclusion statement does not require a response. Some messages require only a "yes" or "no" user response. In addition to the message, Amazon Lex provides additional context about the message in the response that you might use to enhance client behavior, for example, to display the appropriate client user interface. These are the slotToElicit, dialogState, intentName, and slots fields in the response. Consider the following examples:    If the message is to elicit slot data, Amazon Lex returns the following context information:    dialogState set to ElicitSlot     intentName set to the intent name in the current context     slotToElicit set to the slot name for which the message is eliciting information     slots set to a map of slots, configured for the intent, with currently known values       If the message is a confirmation prompt, the dialogState is set to ConfirmIntent and SlotToElicit is set to null.    If the message is a clarification prompt (configured for the intent) that indicates that user intent is not understood, the dialogState is set to ElicitIntent and slotToElicit is set to null.     In addition, Amazon Lex also returns your application-specific sessionAttributes. For more information, see Managing Conversation Context. 
   */
  postText(callback?: (err: AWSError, data: LexRuntime.Types.PostTextResponse) => void): Request<LexRuntime.Types.PostTextResponse, AWSError>;
  /**
   * Creates a new session or modifies an existing session with an Amazon Lex bot. Use this operation to enable your application to set the state of the bot. For more information, see Managing Sessions.
   */
  putSession(params: LexRuntime.Types.PutSessionRequest, callback?: (err: AWSError, data: LexRuntime.Types.PutSessionResponse) => void): Request<LexRuntime.Types.PutSessionResponse, AWSError>;
  /**
   * Creates a new session or modifies an existing session with an Amazon Lex bot. Use this operation to enable your application to set the state of the bot. For more information, see Managing Sessions.
   */
  putSession(callback?: (err: AWSError, data: LexRuntime.Types.PutSessionResponse) => void): Request<LexRuntime.Types.PutSessionResponse, AWSError>;
}
declare namespace LexRuntime {
  export type Accept = string;
  export interface ActiveContext {
    /**
     * The name of the context.
     */
    name: ActiveContextName;
    /**
     * The length of time or number of turns that a context remains active.
     */
    timeToLive: ActiveContextTimeToLive;
    /**
     * State variables for the current context. You can use these values as default values for slots in subsequent events.
     */
    parameters: ActiveContextParametersMap;
  }
  export type ActiveContextName = string;
  export type ActiveContextParametersMap = {[key: string]: Text};
  export interface ActiveContextTimeToLive {
    /**
     * The number of seconds that the context should be active after it is first sent in a PostContent or PostText response. You can set the value between 5 and 86,400 seconds (24 hours).
     */
    timeToLiveInSeconds?: ActiveContextTimeToLiveInSeconds;
    /**
     * The number of conversation turns that the context should be active. A conversation turn is one PostContent or PostText request and the corresponding response from Amazon Lex.
     */
    turnsToLive?: ActiveContextTurnsToLive;
  }
  export type ActiveContextTimeToLiveInSeconds = number;
  export type ActiveContextTurnsToLive = number;
  export type ActiveContextsList = ActiveContext[];
  export type ActiveContextsString = string;
  export type AttributesString = string;
  export type BlobStream = Buffer|Uint8Array|Blob|string|Readable;
  export type BotAlias = string;
  export type BotName = string;
  export type BotVersion = string;
  export interface Button {
    /**
     * Text that is visible to the user on the button.
     */
    text: ButtonTextStringWithLength;
    /**
     * The value sent to Amazon Lex when a user chooses the button. For example, consider button text "NYC." When the user chooses the button, the value sent can be "New York City."
     */
    value: ButtonValueStringWithLength;
  }
  export type ButtonTextStringWithLength = string;
  export type ButtonValueStringWithLength = string;
  export type ConfirmationStatus = "None"|"Confirmed"|"Denied"|string;
  export type ContentType = "application/vnd.amazonaws.card.generic"|string;
  export interface DeleteSessionRequest {
    /**
     * The name of the bot that contains the session data.
     */
    botName: BotName;
    /**
     * The alias in use for the bot that contains the session data.
     */
    botAlias: BotAlias;
    /**
     * The identifier of the user associated with the session data.
     */
    userId: UserId;
  }
  export interface DeleteSessionResponse {
    /**
     * The name of the bot associated with the session data.
     */
    botName?: BotName;
    /**
     * The alias in use for the bot associated with the session data.
     */
    botAlias?: BotAlias;
    /**
     * The ID of the client application user.
     */
    userId?: UserId;
    /**
     * The unique identifier for the session.
     */
    sessionId?: String;
  }
  export interface DialogAction {
    /**
     * The next action that the bot should take in its interaction with the user. The possible values are:    ConfirmIntent - The next action is asking the user if the intent is complete and ready to be fulfilled. This is a yes/no question such as "Place the order?"    Close - Indicates that the there will not be a response from the user. For example, the statement "Your order has been placed" does not require a response.    Delegate - The next action is determined by Amazon Lex.    ElicitIntent - The next action is to determine the intent that the user wants to fulfill.    ElicitSlot - The next action is to elicit a slot value from the user.  
     */
    type: DialogActionType;
    /**
     * The name of the intent.
     */
    intentName?: IntentName;
    /**
     * Map of the slots that have been gathered and their values. 
     */
    slots?: StringMap;
    /**
     * The name of the slot that should be elicited from the user.
     */
    slotToElicit?: String;
    /**
     * The fulfillment state of the intent. The possible values are:    Failed - The Lambda function associated with the intent failed to fulfill the intent.    Fulfilled - The intent has fulfilled by the Lambda function associated with the intent.     ReadyForFulfillment - All of the information necessary for the intent is present and the intent ready to be fulfilled by the client application.  
     */
    fulfillmentState?: FulfillmentState;
    /**
     * The message that should be shown to the user. If you don't specify a message, Amazon Lex will use the message configured for the intent.
     */
    message?: Text;
    /**
     *    PlainText - The message contains plain UTF-8 text.    CustomPayload - The message is a custom format for the client.    SSML - The message contains text formatted for voice output.    Composite - The message contains an escaped JSON object containing one or more messages. For more information, see Message Groups.   
     */
    messageFormat?: MessageFormatType;
  }
  export type DialogActionType = "ElicitIntent"|"ConfirmIntent"|"ElicitSlot"|"Close"|"Delegate"|string;
  export type DialogState = "ElicitIntent"|"ConfirmIntent"|"ElicitSlot"|"Fulfilled"|"ReadyForFulfillment"|"Failed"|string;
  export type Double = number;
  export type FulfillmentState = "Fulfilled"|"Failed"|"ReadyForFulfillment"|string;
  export interface GenericAttachment {
    /**
     * The title of the option.
     */
    title?: StringWithLength;
    /**
     * The subtitle shown below the title.
     */
    subTitle?: StringWithLength;
    /**
     * The URL of an attachment to the response card.
     */
    attachmentLinkUrl?: StringUrlWithLength;
    /**
     * The URL of an image that is displayed to the user.
     */
    imageUrl?: StringUrlWithLength;
    /**
     * The list of options to show to the user.
     */
    buttons?: listOfButtons;
  }
  export interface GetSessionRequest {
    /**
     * The name of the bot that contains the session data.
     */
    botName: BotName;
    /**
     * The alias in use for the bot that contains the session data.
     */
    botAlias: BotAlias;
    /**
     * The ID of the client application user. Amazon Lex uses this to identify a user's conversation with your bot. 
     */
    userId: UserId;
    /**
     * A string used to filter the intents returned in the recentIntentSummaryView structure.  When you specify a filter, only intents with their checkpointLabel field set to that string are returned.
     */
    checkpointLabelFilter?: IntentSummaryCheckpointLabel;
  }
  export interface GetSessionResponse {
    /**
     * An array of information about the intents used in the session. The array can contain a maximum of three summaries. If more than three intents are used in the session, the recentIntentSummaryView operation contains information about the last three intents used. If you set the checkpointLabelFilter parameter in the request, the array contains only the intents with the specified label.
     */
    recentIntentSummaryView?: IntentSummaryList;
    /**
     * Map of key/value pairs representing the session-specific context information. It contains application information passed between Amazon Lex and a client application.
     */
    sessionAttributes?: StringMap;
    /**
     * A unique identifier for the session.
     */
    sessionId?: String;
    /**
     * Describes the current state of the bot.
     */
    dialogAction?: DialogAction;
    /**
     * A list of active contexts for the session. A context can be set when an intent is fulfilled or by calling the PostContent, PostText, or PutSession operation. You can use a context to control the intents that can follow up an intent, or to modify the operation of your application.
     */
    activeContexts?: ActiveContextsList;
  }
  export type HttpContentType = string;
  export interface IntentConfidence {
    /**
     * A score that indicates how confident Amazon Lex is that an intent satisfies the user's intent. Ranges between 0.00 and 1.00. Higher scores indicate higher confidence.
     */
    score?: Double;
  }
  export type IntentList = PredictedIntent[];
  export type IntentName = string;
  export interface IntentSummary {
    /**
     * The name of the intent.
     */
    intentName?: IntentName;
    /**
     * A user-defined label that identifies a particular intent. You can use this label to return to a previous intent.  Use the checkpointLabelFilter parameter of the GetSessionRequest operation to filter the intents returned by the operation to those with only the specified label.
     */
    checkpointLabel?: IntentSummaryCheckpointLabel;
    /**
     * Map of the slots that have been gathered and their values. 
     */
    slots?: StringMap;
    /**
     * The status of the intent after the user responds to the confirmation prompt. If the user confirms the intent, Amazon Lex sets this field to Confirmed. If the user denies the intent, Amazon Lex sets this value to Denied. The possible values are:    Confirmed - The user has responded "Yes" to the confirmation prompt, confirming that the intent is complete and that it is ready to be fulfilled.    Denied - The user has responded "No" to the confirmation prompt.    None - The user has never been prompted for confirmation; or, the user was prompted but did not confirm or deny the prompt.  
     */
    confirmationStatus?: ConfirmationStatus;
    /**
     * The next action that the bot should take in its interaction with the user. The possible values are:    ConfirmIntent - The next action is asking the user if the intent is complete and ready to be fulfilled. This is a yes/no question such as "Place the order?"    Close - Indicates that the there will not be a response from the user. For example, the statement "Your order has been placed" does not require a response.    ElicitIntent - The next action is to determine the intent that the user wants to fulfill.    ElicitSlot - The next action is to elicit a slot value from the user.  
     */
    dialogActionType: DialogActionType;
    /**
     * The fulfillment state of the intent. The possible values are:    Failed - The Lambda function associated with the intent failed to fulfill the intent.    Fulfilled - The intent has fulfilled by the Lambda function associated with the intent.     ReadyForFulfillment - All of the information necessary for the intent is present and the intent ready to be fulfilled by the client application.  
     */
    fulfillmentState?: FulfillmentState;
    /**
     * The next slot to elicit from the user. If there is not slot to elicit, the field is blank.
     */
    slotToElicit?: String;
  }
  export type IntentSummaryCheckpointLabel = string;
  export type IntentSummaryList = IntentSummary[];
  export type MessageFormatType = "PlainText"|"CustomPayload"|"SSML"|"Composite"|string;
  export type ParameterName = string;
  export interface PostContentRequest {
    /**
     * Name of the Amazon Lex bot.
     */
    botName: BotName;
    /**
     * Alias of the Amazon Lex bot.
     */
    botAlias: BotAlias;
    /**
     * The ID of the client application user. Amazon Lex uses this to identify a user's conversation with your bot. At runtime, each request must contain the userID field. To decide the user ID to use for your application, consider the following factors.   The userID field must not contain any personally identifiable information of the user, for example, name, personal identification numbers, or other end user personal information.   If you want a user to start a conversation on one device and continue on another device, use a user-specific identifier.   If you want the same user to be able to have two independent conversations on two different devices, choose a device-specific identifier.   A user can't have two independent conversations with two different versions of the same bot. For example, a user can't have a conversation with the PROD and BETA versions of the same bot. If you anticipate that a user will need to have conversation with two different versions, for example, while testing, include the bot alias in the user ID to separate the two conversations.  
     */
    userId: UserId;
    /**
     * You pass this value as the x-amz-lex-session-attributes HTTP header. Application-specific information passed between Amazon Lex and a client application. The value must be a JSON serialized and base64 encoded map with string keys and values. The total size of the sessionAttributes and requestAttributes headers is limited to 12 KB. For more information, see Setting Session Attributes.
     */
    sessionAttributes?: AttributesString;
    /**
     * You pass this value as the x-amz-lex-request-attributes HTTP header. Request-specific information passed between Amazon Lex and a client application. The value must be a JSON serialized and base64 encoded map with string keys and values. The total size of the requestAttributes and sessionAttributes headers is limited to 12 KB. The namespace x-amz-lex: is reserved for special attributes. Don't create any request attributes with the prefix x-amz-lex:. For more information, see Setting Request Attributes.
     */
    requestAttributes?: AttributesString;
    /**
     *  You pass this value as the Content-Type HTTP header.   Indicates the audio format or text. The header value must start with one of the following prefixes:    PCM format, audio data must be in little-endian byte order.   audio/l16; rate=16000; channels=1   audio/x-l16; sample-rate=16000; channel-count=1   audio/lpcm; sample-rate=8000; sample-size-bits=16; channel-count=1; is-big-endian=false      Opus format   audio/x-cbr-opus-with-preamble; preamble-size=0; bit-rate=256000; frame-size-milliseconds=4     Text format   text/plain; charset=utf-8    
     */
    contentType: HttpContentType;
    /**
     *  You pass this value as the Accept HTTP header.   The message Amazon Lex returns in the response can be either text or speech based on the Accept HTTP header value in the request.     If the value is text/plain; charset=utf-8, Amazon Lex returns text in the response.     If the value begins with audio/, Amazon Lex returns speech in the response. Amazon Lex uses Amazon Polly to generate the speech (using the configuration you specified in the Accept header). For example, if you specify audio/mpeg as the value, Amazon Lex returns speech in the MPEG format.   If the value is audio/pcm, the speech returned is audio/pcm in 16-bit, little endian format.    The following are the accepted values:   audio/mpeg   audio/ogg   audio/pcm   text/plain; charset=utf-8   audio/* (defaults to mpeg)    
     */
    accept?: Accept;
    /**
     *  User input in PCM or Opus audio format or text format as described in the Content-Type HTTP header.  You can stream audio data to Amazon Lex or you can create a local buffer that captures all of the audio data before sending. In general, you get better performance if you stream audio data rather than buffering the data locally.
     */
    inputStream: BlobStream;
    /**
     * A list of contexts active for the request. A context can be activated when a previous intent is fulfilled, or by including the context in the request, If you don't specify a list of contexts, Amazon Lex will use the current list of contexts for the session. If you specify an empty list, all contexts for the session are cleared.
     */
    activeContexts?: ActiveContextsString;
  }
  export interface PostContentResponse {
    /**
     * Content type as specified in the Accept HTTP header in the request.
     */
    contentType?: HttpContentType;
    /**
     * Current user intent that Amazon Lex is aware of.
     */
    intentName?: IntentName;
    /**
     * Provides a score that indicates how confident Amazon Lex is that the returned intent is the one that matches the user's intent. The score is between 0.0 and 1.0. The score is a relative score, not an absolute score. The score may change based on improvements to Amazon Lex. 
     */
    nluIntentConfidence?: String;
    /**
     * One to four alternative intents that may be applicable to the user's intent. Each alternative includes a score that indicates how confident Amazon Lex is that the intent matches the user's intent. The intents are sorted by the confidence score.
     */
    alternativeIntents?: String;
    /**
     * Map of zero or more intent slots (name/value pairs) Amazon Lex detected from the user input during the conversation. The field is base-64 encoded. Amazon Lex creates a resolution list containing likely values for a slot. The value that it returns is determined by the valueSelectionStrategy selected when the slot type was created or updated. If valueSelectionStrategy is set to ORIGINAL_VALUE, the value provided by the user is returned, if the user value is similar to the slot values. If valueSelectionStrategy is set to TOP_RESOLUTION Amazon Lex returns the first value in the resolution list or, if there is no resolution list, null. If you don't specify a valueSelectionStrategy, the default is ORIGINAL_VALUE.
     */
    slots?: String;
    /**
     *  Map of key/value pairs representing the session-specific context information. 
     */
    sessionAttributes?: String;
    /**
     * The sentiment expressed in an utterance. When the bot is configured to send utterances to Amazon Comprehend for sentiment analysis, this field contains the result of the analysis.
     */
    sentimentResponse?: String;
    /**
     * You can only use this field in the de-DE, en-AU, en-GB, en-US, es-419, es-ES, es-US, fr-CA, fr-FR, and it-IT locales. In all other locales, the message field is null. You should use the encodedMessage field instead. The message to convey to the user. The message can come from the bot's configuration or from a Lambda function. If the intent is not configured with a Lambda function, or if the Lambda function returned Delegate as the dialogAction.type in its response, Amazon Lex decides on the next course of action and selects an appropriate message from the bot's configuration based on the current interaction context. For example, if Amazon Lex isn't able to understand user input, it uses a clarification prompt message. When you create an intent you can assign messages to groups. When messages are assigned to groups Amazon Lex returns one message from each group in the response. The message field is an escaped JSON string containing the messages. For more information about the structure of the JSON string returned, see msg-prompts-formats. If the Lambda function returns a message, Amazon Lex passes it to the client in its response.
     */
    message?: Text;
    /**
     * The message to convey to the user. The message can come from the bot's configuration or from a Lambda function. If the intent is not configured with a Lambda function, or if the Lambda function returned Delegate as the dialogAction.type in its response, Amazon Lex decides on the next course of action and selects an appropriate message from the bot's configuration based on the current interaction context. For example, if Amazon Lex isn't able to understand user input, it uses a clarification prompt message. When you create an intent you can assign messages to groups. When messages are assigned to groups Amazon Lex returns one message from each group in the response. The message field is an escaped JSON string containing the messages. For more information about the structure of the JSON string returned, see msg-prompts-formats. If the Lambda function returns a message, Amazon Lex passes it to the client in its response. The encodedMessage field is base-64 encoded. You must decode the field before you can use the value.
     */
    encodedMessage?: SensitiveString;
    /**
     * The format of the response message. One of the following values:    PlainText - The message contains plain UTF-8 text.    CustomPayload - The message is a custom format for the client.    SSML - The message contains text formatted for voice output.    Composite - The message contains an escaped JSON object containing one or more messages from the groups that messages were assigned to when the intent was created.  
     */
    messageFormat?: MessageFormatType;
    /**
     * Identifies the current state of the user interaction. Amazon Lex returns one of the following values as dialogState. The client can optionally use this information to customize the user interface.     ElicitIntent - Amazon Lex wants to elicit the user's intent. Consider the following examples:   For example, a user might utter an intent ("I want to order a pizza"). If Amazon Lex cannot infer the user intent from this utterance, it will return this dialog state.     ConfirmIntent - Amazon Lex is expecting a "yes" or "no" response.  For example, Amazon Lex wants user confirmation before fulfilling an intent. Instead of a simple "yes" or "no" response, a user might respond with additional information. For example, "yes, but make it a thick crust pizza" or "no, I want to order a drink." Amazon Lex can process such additional information (in these examples, update the crust type slot or change the intent from OrderPizza to OrderDrink).     ElicitSlot - Amazon Lex is expecting the value of a slot for the current intent.   For example, suppose that in the response Amazon Lex sends this message: "What size pizza would you like?". A user might reply with the slot value (e.g., "medium"). The user might also provide additional information in the response (e.g., "medium thick crust pizza"). Amazon Lex can process such additional information appropriately.     Fulfilled - Conveys that the Lambda function has successfully fulfilled the intent.     ReadyForFulfillment - Conveys that the client has to fulfill the request.     Failed - Conveys that the conversation with the user failed.   This can happen for various reasons, including that the user does not provide an appropriate response to prompts from the service (you can configure how many times Amazon Lex can prompt a user for specific information), or if the Lambda function fails to fulfill the intent.   
     */
    dialogState?: DialogState;
    /**
     *  If the dialogState value is ElicitSlot, returns the name of the slot for which Amazon Lex is eliciting a value. 
     */
    slotToElicit?: String;
    /**
     * The text used to process the request. You can use this field only in the de-DE, en-AU, en-GB, en-US, es-419, es-ES, es-US, fr-CA, fr-FR, and it-IT locales. In all other locales, the inputTranscript field is null. You should use the encodedInputTranscript field instead. If the input was an audio stream, the inputTranscript field contains the text extracted from the audio stream. This is the text that is actually processed to recognize intents and slot values. You can use this information to determine if Amazon Lex is correctly processing the audio that you send.
     */
    inputTranscript?: String;
    /**
     * The text used to process the request. If the input was an audio stream, the encodedInputTranscript field contains the text extracted from the audio stream. This is the text that is actually processed to recognize intents and slot values. You can use this information to determine if Amazon Lex is correctly processing the audio that you send. The encodedInputTranscript field is base-64 encoded. You must decode the field before you can use the value.
     */
    encodedInputTranscript?: SensitiveStringUnbounded;
    /**
     * The prompt (or statement) to convey to the user. This is based on the bot configuration and context. For example, if Amazon Lex did not understand the user intent, it sends the clarificationPrompt configured for the bot. If the intent requires confirmation before taking the fulfillment action, it sends the confirmationPrompt. Another example: Suppose that the Lambda function successfully fulfilled the intent, and sent a message to convey to the user. Then Amazon Lex sends that message in the response. 
     */
    audioStream?: BlobStream;
    /**
     * The version of the bot that responded to the conversation. You can use this information to help determine if one version of a bot is performing better than another version.
     */
    botVersion?: BotVersion;
    /**
     * The unique identifier for the session.
     */
    sessionId?: String;
    /**
     * A list of active contexts for the session. A context can be set when an intent is fulfilled or by calling the PostContent, PostText, or PutSession operation. You can use a context to control the intents that can follow up an intent, or to modify the operation of your application.
     */
    activeContexts?: ActiveContextsString;
  }
  export interface PostTextRequest {
    /**
     * The name of the Amazon Lex bot.
     */
    botName: BotName;
    /**
     * The alias of the Amazon Lex bot.
     */
    botAlias: BotAlias;
    /**
     * The ID of the client application user. Amazon Lex uses this to identify a user's conversation with your bot. At runtime, each request must contain the userID field. To decide the user ID to use for your application, consider the following factors.   The userID field must not contain any personally identifiable information of the user, for example, name, personal identification numbers, or other end user personal information.   If you want a user to start a conversation on one device and continue on another device, use a user-specific identifier.   If you want the same user to be able to have two independent conversations on two different devices, choose a device-specific identifier.   A user can't have two independent conversations with two different versions of the same bot. For example, a user can't have a conversation with the PROD and BETA versions of the same bot. If you anticipate that a user will need to have conversation with two different versions, for example, while testing, include the bot alias in the user ID to separate the two conversations.  
     */
    userId: UserId;
    /**
     * Application-specific information passed between Amazon Lex and a client application. For more information, see Setting Session Attributes.
     */
    sessionAttributes?: StringMap;
    /**
     * Request-specific information passed between Amazon Lex and a client application. The namespace x-amz-lex: is reserved for special attributes. Don't create any request attributes with the prefix x-amz-lex:. For more information, see Setting Request Attributes.
     */
    requestAttributes?: StringMap;
    /**
     * The text that the user entered (Amazon Lex interprets this text).
     */
    inputText: Text;
    /**
     * A list of contexts active for the request. A context can be activated when a previous intent is fulfilled, or by including the context in the request, If you don't specify a list of contexts, Amazon Lex will use the current list of contexts for the session. If you specify an empty list, all contexts for the session are cleared.
     */
    activeContexts?: ActiveContextsList;
  }
  export interface PostTextResponse {
    /**
     * The current user intent that Amazon Lex is aware of.
     */
    intentName?: IntentName;
    /**
     * Provides a score that indicates how confident Amazon Lex is that the returned intent is the one that matches the user's intent. The score is between 0.0 and 1.0. For more information, see Confidence Scores. The score is a relative score, not an absolute score. The score may change based on improvements to Amazon Lex.
     */
    nluIntentConfidence?: IntentConfidence;
    /**
     * One to four alternative intents that may be applicable to the user's intent. Each alternative includes a score that indicates how confident Amazon Lex is that the intent matches the user's intent. The intents are sorted by the confidence score.
     */
    alternativeIntents?: IntentList;
    /**
     *  The intent slots that Amazon Lex detected from the user input in the conversation.  Amazon Lex creates a resolution list containing likely values for a slot. The value that it returns is determined by the valueSelectionStrategy selected when the slot type was created or updated. If valueSelectionStrategy is set to ORIGINAL_VALUE, the value provided by the user is returned, if the user value is similar to the slot values. If valueSelectionStrategy is set to TOP_RESOLUTION Amazon Lex returns the first value in the resolution list or, if there is no resolution list, null. If you don't specify a valueSelectionStrategy, the default is ORIGINAL_VALUE.
     */
    slots?: StringMap;
    /**
     * A map of key-value pairs representing the session-specific context information.
     */
    sessionAttributes?: StringMap;
    /**
     * The message to convey to the user. The message can come from the bot's configuration or from a Lambda function. If the intent is not configured with a Lambda function, or if the Lambda function returned Delegate as the dialogAction.type its response, Amazon Lex decides on the next course of action and selects an appropriate message from the bot's configuration based on the current interaction context. For example, if Amazon Lex isn't able to understand user input, it uses a clarification prompt message. When you create an intent you can assign messages to groups. When messages are assigned to groups Amazon Lex returns one message from each group in the response. The message field is an escaped JSON string containing the messages. For more information about the structure of the JSON string returned, see msg-prompts-formats. If the Lambda function returns a message, Amazon Lex passes it to the client in its response.
     */
    message?: Text;
    /**
     * The sentiment expressed in and utterance. When the bot is configured to send utterances to Amazon Comprehend for sentiment analysis, this field contains the result of the analysis.
     */
    sentimentResponse?: SentimentResponse;
    /**
     * The format of the response message. One of the following values:    PlainText - The message contains plain UTF-8 text.    CustomPayload - The message is a custom format defined by the Lambda function.    SSML - The message contains text formatted for voice output.    Composite - The message contains an escaped JSON object containing one or more messages from the groups that messages were assigned to when the intent was created.  
     */
    messageFormat?: MessageFormatType;
    /**
     *  Identifies the current state of the user interaction. Amazon Lex returns one of the following values as dialogState. The client can optionally use this information to customize the user interface.     ElicitIntent - Amazon Lex wants to elicit user intent.  For example, a user might utter an intent ("I want to order a pizza"). If Amazon Lex cannot infer the user intent from this utterance, it will return this dialogState.    ConfirmIntent - Amazon Lex is expecting a "yes" or "no" response.   For example, Amazon Lex wants user confirmation before fulfilling an intent.  Instead of a simple "yes" or "no," a user might respond with additional information. For example, "yes, but make it thick crust pizza" or "no, I want to order a drink". Amazon Lex can process such additional information (in these examples, update the crust type slot value, or change intent from OrderPizza to OrderDrink).    ElicitSlot - Amazon Lex is expecting a slot value for the current intent.  For example, suppose that in the response Amazon Lex sends this message: "What size pizza would you like?". A user might reply with the slot value (e.g., "medium"). The user might also provide additional information in the response (e.g., "medium thick crust pizza"). Amazon Lex can process such additional information appropriately.     Fulfilled - Conveys that the Lambda function configured for the intent has successfully fulfilled the intent.     ReadyForFulfillment - Conveys that the client has to fulfill the intent.     Failed - Conveys that the conversation with the user failed.   This can happen for various reasons including that the user did not provide an appropriate response to prompts from the service (you can configure how many times Amazon Lex can prompt a user for specific information), or the Lambda function failed to fulfill the intent.   
     */
    dialogState?: DialogState;
    /**
     * If the dialogState value is ElicitSlot, returns the name of the slot for which Amazon Lex is eliciting a value. 
     */
    slotToElicit?: String;
    /**
     * Represents the options that the user has to respond to the current prompt. Response Card can come from the bot configuration (in the Amazon Lex console, choose the settings button next to a slot) or from a code hook (Lambda function). 
     */
    responseCard?: ResponseCard;
    /**
     * A unique identifier for the session.
     */
    sessionId?: String;
    /**
     * The version of the bot that responded to the conversation. You can use this information to help determine if one version of a bot is performing better than another version.
     */
    botVersion?: BotVersion;
    /**
     * A list of active contexts for the session. A context can be set when an intent is fulfilled or by calling the PostContent, PostText, or PutSession operation. You can use a context to control the intents that can follow up an intent, or to modify the operation of your application.
     */
    activeContexts?: ActiveContextsList;
  }
  export interface PredictedIntent {
    /**
     * The name of the intent that Amazon Lex suggests satisfies the user's intent.
     */
    intentName?: IntentName;
    /**
     * Indicates how confident Amazon Lex is that an intent satisfies the user's intent.
     */
    nluIntentConfidence?: IntentConfidence;
    /**
     * The slot and slot values associated with the predicted intent.
     */
    slots?: StringMap;
  }
  export interface PutSessionRequest {
    /**
     * The name of the bot that contains the session data.
     */
    botName: BotName;
    /**
     * The alias in use for the bot that contains the session data.
     */
    botAlias: BotAlias;
    /**
     * The ID of the client application user. Amazon Lex uses this to identify a user's conversation with your bot. 
     */
    userId: UserId;
    /**
     * Map of key/value pairs representing the session-specific context information. It contains application information passed between Amazon Lex and a client application.
     */
    sessionAttributes?: StringMap;
    /**
     * Sets the next action that the bot should take to fulfill the conversation.
     */
    dialogAction?: DialogAction;
    /**
     * A summary of the recent intents for the bot. You can use the intent summary view to set a checkpoint label on an intent and modify attributes of intents. You can also use it to remove or add intent summary objects to the list. An intent that you modify or add to the list must make sense for the bot. For example, the intent name must be valid for the bot. You must provide valid values for:    intentName    slot names    slotToElict    If you send the recentIntentSummaryView parameter in a PutSession request, the contents of the new summary view replaces the old summary view. For example, if a GetSession request returns three intents in the summary view and you call PutSession with one intent in the summary view, the next call to GetSession will only return one intent.
     */
    recentIntentSummaryView?: IntentSummaryList;
    /**
     * The message that Amazon Lex returns in the response can be either text or speech based depending on the value of this field.   If the value is text/plain; charset=utf-8, Amazon Lex returns text in the response.   If the value begins with audio/, Amazon Lex returns speech in the response. Amazon Lex uses Amazon Polly to generate the speech in the configuration that you specify. For example, if you specify audio/mpeg as the value, Amazon Lex returns speech in the MPEG format.   If the value is audio/pcm, the speech is returned as audio/pcm in 16-bit, little endian format.   The following are the accepted values:    audio/mpeg     audio/ogg     audio/pcm     audio/* (defaults to mpeg)    text/plain; charset=utf-8     
     */
    accept?: Accept;
    /**
     * A list of contexts active for the request. A context can be activated when a previous intent is fulfilled, or by including the context in the request, If you don't specify a list of contexts, Amazon Lex will use the current list of contexts for the session. If you specify an empty list, all contexts for the session are cleared.
     */
    activeContexts?: ActiveContextsList;
  }
  export interface PutSessionResponse {
    /**
     * Content type as specified in the Accept HTTP header in the request.
     */
    contentType?: HttpContentType;
    /**
     * The name of the current intent.
     */
    intentName?: IntentName;
    /**
     * Map of zero or more intent slots Amazon Lex detected from the user input during the conversation. Amazon Lex creates a resolution list containing likely values for a slot. The value that it returns is determined by the valueSelectionStrategy selected when the slot type was created or updated. If valueSelectionStrategy is set to ORIGINAL_VALUE, the value provided by the user is returned, if the user value is similar to the slot values. If valueSelectionStrategy is set to TOP_RESOLUTION Amazon Lex returns the first value in the resolution list or, if there is no resolution list, null. If you don't specify a valueSelectionStrategy the default is ORIGINAL_VALUE. 
     */
    slots?: String;
    /**
     * Map of key/value pairs representing session-specific context information.
     */
    sessionAttributes?: String;
    /**
     * The next message that should be presented to the user. You can only use this field in the de-DE, en-AU, en-GB, en-US, es-419, es-ES, es-US, fr-CA, fr-FR, and it-IT locales. In all other locales, the message field is null. You should use the encodedMessage field instead.
     */
    message?: Text;
    /**
     * The next message that should be presented to the user. The encodedMessage field is base-64 encoded. You must decode the field before you can use the value.
     */
    encodedMessage?: SensitiveString;
    /**
     * The format of the response message. One of the following values:    PlainText - The message contains plain UTF-8 text.    CustomPayload - The message is a custom format for the client.    SSML - The message contains text formatted for voice output.    Composite - The message contains an escaped JSON object containing one or more messages from the groups that messages were assigned to when the intent was created.  
     */
    messageFormat?: MessageFormatType;
    /**
     *     ConfirmIntent - Amazon Lex is expecting a "yes" or "no" response to confirm the intent before fulfilling an intent.    ElicitIntent - Amazon Lex wants to elicit the user's intent.    ElicitSlot - Amazon Lex is expecting the value of a slot for the current intent.    Failed - Conveys that the conversation with the user has failed. This can happen for various reasons, including the user does not provide an appropriate response to prompts from the service, or if the Lambda function fails to fulfill the intent.    Fulfilled - Conveys that the Lambda function has sucessfully fulfilled the intent.    ReadyForFulfillment - Conveys that the client has to fulfill the intent.  
     */
    dialogState?: DialogState;
    /**
     * If the dialogState is ElicitSlot, returns the name of the slot for which Amazon Lex is eliciting a value.
     */
    slotToElicit?: String;
    /**
     * The audio version of the message to convey to the user.
     */
    audioStream?: BlobStream;
    /**
     * A unique identifier for the session.
     */
    sessionId?: String;
    /**
     * A list of active contexts for the session.
     */
    activeContexts?: ActiveContextsString;
  }
  export interface ResponseCard {
    /**
     * The version of the response card format.
     */
    version?: String;
    /**
     * The content type of the response.
     */
    contentType?: ContentType;
    /**
     * An array of attachment objects representing options.
     */
    genericAttachments?: genericAttachmentList;
  }
  export type SensitiveString = string;
  export type SensitiveStringUnbounded = string;
  export type SentimentLabel = string;
  export interface SentimentResponse {
    /**
     * The inferred sentiment that Amazon Comprehend has the highest confidence in.
     */
    sentimentLabel?: SentimentLabel;
    /**
     * The likelihood that the sentiment was correctly inferred.
     */
    sentimentScore?: SentimentScore;
  }
  export type SentimentScore = string;
  export type String = string;
  export type StringMap = {[key: string]: String};
  export type StringUrlWithLength = string;
  export type StringWithLength = string;
  export type Text = string;
  export type UserId = string;
  export type genericAttachmentList = GenericAttachment[];
  export type listOfButtons = Button[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-11-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the LexRuntime client.
   */
  export import Types = LexRuntime;
}
export = LexRuntime;
