import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ConnectParticipant extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ConnectParticipant.Types.ClientConfiguration)
  config: Config & ConnectParticipant.Types.ClientConfiguration;
  /**
   * Allows you to confirm that the attachment has been uploaded using the pre-signed URL provided in StartAttachmentUpload API.    ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  completeAttachmentUpload(params: ConnectParticipant.Types.CompleteAttachmentUploadRequest, callback?: (err: AWSError, data: ConnectParticipant.Types.CompleteAttachmentUploadResponse) => void): Request<ConnectParticipant.Types.CompleteAttachmentUploadResponse, AWSError>;
  /**
   * Allows you to confirm that the attachment has been uploaded using the pre-signed URL provided in StartAttachmentUpload API.    ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  completeAttachmentUpload(callback?: (err: AWSError, data: ConnectParticipant.Types.CompleteAttachmentUploadResponse) => void): Request<ConnectParticipant.Types.CompleteAttachmentUploadResponse, AWSError>;
  /**
   * Creates the participant's connection.    ParticipantToken is used for invoking this API instead of ConnectionToken.  The participant token is valid for the lifetime of the participant – until they are part of a contact. The response URL for WEBSOCKET Type has a connect expiry timeout of 100s. Clients must manually connect to the returned websocket URL and subscribe to the desired topic.  For chat, you need to publish the following on the established websocket connection:  {"topic":"aws/subscribe","content":{"topics":["aws/chat"]}}  Upon websocket URL expiry, as specified in the response ConnectionExpiry parameter, clients need to call this API again to obtain a new websocket URL and perform the same steps as before.  Message streaming support: This API can also be used together with the StartContactStreaming API to create a participant connection for chat contacts that are not using a websocket. For more information about message streaming, Enable real-time chat message streaming in the Amazon Connect Administrator Guide.  Feature specifications: For information about feature specifications, such as the allowed number of open websocket connections per participant, see Feature specifications in the Amazon Connect Administrator Guide.   The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication. 
   */
  createParticipantConnection(params: ConnectParticipant.Types.CreateParticipantConnectionRequest, callback?: (err: AWSError, data: ConnectParticipant.Types.CreateParticipantConnectionResponse) => void): Request<ConnectParticipant.Types.CreateParticipantConnectionResponse, AWSError>;
  /**
   * Creates the participant's connection.    ParticipantToken is used for invoking this API instead of ConnectionToken.  The participant token is valid for the lifetime of the participant – until they are part of a contact. The response URL for WEBSOCKET Type has a connect expiry timeout of 100s. Clients must manually connect to the returned websocket URL and subscribe to the desired topic.  For chat, you need to publish the following on the established websocket connection:  {"topic":"aws/subscribe","content":{"topics":["aws/chat"]}}  Upon websocket URL expiry, as specified in the response ConnectionExpiry parameter, clients need to call this API again to obtain a new websocket URL and perform the same steps as before.  Message streaming support: This API can also be used together with the StartContactStreaming API to create a participant connection for chat contacts that are not using a websocket. For more information about message streaming, Enable real-time chat message streaming in the Amazon Connect Administrator Guide.  Feature specifications: For information about feature specifications, such as the allowed number of open websocket connections per participant, see Feature specifications in the Amazon Connect Administrator Guide.   The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication. 
   */
  createParticipantConnection(callback?: (err: AWSError, data: ConnectParticipant.Types.CreateParticipantConnectionResponse) => void): Request<ConnectParticipant.Types.CreateParticipantConnectionResponse, AWSError>;
  /**
   * Retrieves the view for the specified view token.
   */
  describeView(params: ConnectParticipant.Types.DescribeViewRequest, callback?: (err: AWSError, data: ConnectParticipant.Types.DescribeViewResponse) => void): Request<ConnectParticipant.Types.DescribeViewResponse, AWSError>;
  /**
   * Retrieves the view for the specified view token.
   */
  describeView(callback?: (err: AWSError, data: ConnectParticipant.Types.DescribeViewResponse) => void): Request<ConnectParticipant.Types.DescribeViewResponse, AWSError>;
  /**
   * Disconnects a participant.    ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  disconnectParticipant(params: ConnectParticipant.Types.DisconnectParticipantRequest, callback?: (err: AWSError, data: ConnectParticipant.Types.DisconnectParticipantResponse) => void): Request<ConnectParticipant.Types.DisconnectParticipantResponse, AWSError>;
  /**
   * Disconnects a participant.    ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  disconnectParticipant(callback?: (err: AWSError, data: ConnectParticipant.Types.DisconnectParticipantResponse) => void): Request<ConnectParticipant.Types.DisconnectParticipantResponse, AWSError>;
  /**
   * Provides a pre-signed URL for download of a completed attachment. This is an asynchronous API for use with active contacts.   ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  getAttachment(params: ConnectParticipant.Types.GetAttachmentRequest, callback?: (err: AWSError, data: ConnectParticipant.Types.GetAttachmentResponse) => void): Request<ConnectParticipant.Types.GetAttachmentResponse, AWSError>;
  /**
   * Provides a pre-signed URL for download of a completed attachment. This is an asynchronous API for use with active contacts.   ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  getAttachment(callback?: (err: AWSError, data: ConnectParticipant.Types.GetAttachmentResponse) => void): Request<ConnectParticipant.Types.GetAttachmentResponse, AWSError>;
  /**
   * Retrieves a transcript of the session, including details about any attachments. For information about accessing past chat contact transcripts for a persistent chat, see Enable persistent chat.    ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  getTranscript(params: ConnectParticipant.Types.GetTranscriptRequest, callback?: (err: AWSError, data: ConnectParticipant.Types.GetTranscriptResponse) => void): Request<ConnectParticipant.Types.GetTranscriptResponse, AWSError>;
  /**
   * Retrieves a transcript of the session, including details about any attachments. For information about accessing past chat contact transcripts for a persistent chat, see Enable persistent chat.    ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  getTranscript(callback?: (err: AWSError, data: ConnectParticipant.Types.GetTranscriptResponse) => void): Request<ConnectParticipant.Types.GetTranscriptResponse, AWSError>;
  /**
   * Sends an event.    ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  sendEvent(params: ConnectParticipant.Types.SendEventRequest, callback?: (err: AWSError, data: ConnectParticipant.Types.SendEventResponse) => void): Request<ConnectParticipant.Types.SendEventResponse, AWSError>;
  /**
   * Sends an event.    ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  sendEvent(callback?: (err: AWSError, data: ConnectParticipant.Types.SendEventResponse) => void): Request<ConnectParticipant.Types.SendEventResponse, AWSError>;
  /**
   * Sends a message.   ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  sendMessage(params: ConnectParticipant.Types.SendMessageRequest, callback?: (err: AWSError, data: ConnectParticipant.Types.SendMessageResponse) => void): Request<ConnectParticipant.Types.SendMessageResponse, AWSError>;
  /**
   * Sends a message.   ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  sendMessage(callback?: (err: AWSError, data: ConnectParticipant.Types.SendMessageResponse) => void): Request<ConnectParticipant.Types.SendMessageResponse, AWSError>;
  /**
   * Provides a pre-signed Amazon S3 URL in response for uploading the file directly to S3.   ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  startAttachmentUpload(params: ConnectParticipant.Types.StartAttachmentUploadRequest, callback?: (err: AWSError, data: ConnectParticipant.Types.StartAttachmentUploadResponse) => void): Request<ConnectParticipant.Types.StartAttachmentUploadResponse, AWSError>;
  /**
   * Provides a pre-signed Amazon S3 URL in response for uploading the file directly to S3.   ConnectionToken is used for invoking this API instead of ParticipantToken.  The Amazon Connect Participant Service APIs do not use Signature Version 4 authentication.
   */
  startAttachmentUpload(callback?: (err: AWSError, data: ConnectParticipant.Types.StartAttachmentUploadResponse) => void): Request<ConnectParticipant.Types.StartAttachmentUploadResponse, AWSError>;
}
declare namespace ConnectParticipant {
  export type ARN = string;
  export type ArtifactId = string;
  export type ArtifactStatus = "APPROVED"|"REJECTED"|"IN_PROGRESS"|string;
  export type AttachmentIdList = ArtifactId[];
  export interface AttachmentItem {
    /**
     * Describes the MIME file type of the attachment. For a list of supported file types, see Feature specifications in the Amazon Connect Administrator Guide.
     */
    ContentType?: ContentType;
    /**
     * A unique identifier for the attachment.
     */
    AttachmentId?: ArtifactId;
    /**
     * A case-sensitive name of the attachment being uploaded.
     */
    AttachmentName?: AttachmentName;
    /**
     * Status of the attachment.
     */
    Status?: ArtifactStatus;
  }
  export type AttachmentName = string;
  export type AttachmentSizeInBytes = number;
  export type Attachments = AttachmentItem[];
  export type Bool = boolean;
  export type ChatContent = string;
  export type ChatContentType = string;
  export type ChatItemId = string;
  export type ChatItemType = "TYPING"|"PARTICIPANT_JOINED"|"PARTICIPANT_LEFT"|"CHAT_ENDED"|"TRANSFER_SUCCEEDED"|"TRANSFER_FAILED"|"MESSAGE"|"EVENT"|"ATTACHMENT"|"CONNECTION_ACK"|"MESSAGE_DELIVERED"|"MESSAGE_READ"|string;
  export type ClientToken = string;
  export interface CompleteAttachmentUploadRequest {
    /**
     * A list of unique identifiers for the attachments.
     */
    AttachmentIds: AttachmentIdList;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If not provided, the Amazon Web Services SDK populates this field. For more information about idempotency, see Making retries safe with idempotent APIs.
     */
    ClientToken: NonEmptyClientToken;
    /**
     * The authentication token associated with the participant's connection.
     */
    ConnectionToken: ParticipantToken;
  }
  export interface CompleteAttachmentUploadResponse {
  }
  export interface ConnectionCredentials {
    /**
     * The connection token.
     */
    ConnectionToken?: ParticipantToken;
    /**
     * The expiration of the token. It's specified in ISO 8601 format: yyyy-MM-ddThh:mm:ss.SSSZ. For example, 2019-11-08T02:41:28.172Z.
     */
    Expiry?: ISO8601Datetime;
  }
  export type ConnectionType = "WEBSOCKET"|"CONNECTION_CREDENTIALS"|string;
  export type ConnectionTypeList = ConnectionType[];
  export type ContactId = string;
  export type ContentType = string;
  export interface CreateParticipantConnectionRequest {
    /**
     * Type of connection information required. If you need CONNECTION_CREDENTIALS along with marking participant as connected, pass CONNECTION_CREDENTIALS in Type.
     */
    Type?: ConnectionTypeList;
    /**
     * This is a header parameter. The ParticipantToken as obtained from StartChatContact API response.
     */
    ParticipantToken: ParticipantToken;
    /**
     * Amazon Connect Participant is used to mark the participant as connected for customer participant in message streaming, as well as for agent or manager participant in non-streaming chats.
     */
    ConnectParticipant?: Bool;
  }
  export interface CreateParticipantConnectionResponse {
    /**
     * Creates the participant's websocket connection.
     */
    Websocket?: Websocket;
    /**
     * Creates the participant's connection credentials. The authentication token associated with the participant's connection.
     */
    ConnectionCredentials?: ConnectionCredentials;
  }
  export interface DescribeViewRequest {
    /**
     * An encrypted token originating from the interactive message of a ShowView block operation. Represents the desired view.
     */
    ViewToken: ViewToken;
    /**
     * The connection token.
     */
    ConnectionToken: ParticipantToken;
  }
  export interface DescribeViewResponse {
    /**
     * A view resource object. Contains metadata and content necessary to render the view.
     */
    View?: View;
  }
  export interface DisconnectParticipantRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If not provided, the Amazon Web Services SDK populates this field. For more information about idempotency, see Making retries safe with idempotent APIs.
     */
    ClientToken?: ClientToken;
    /**
     * The authentication token associated with the participant's connection.
     */
    ConnectionToken: ParticipantToken;
  }
  export interface DisconnectParticipantResponse {
  }
  export type DisplayName = string;
  export interface GetAttachmentRequest {
    /**
     * A unique identifier for the attachment.
     */
    AttachmentId: ArtifactId;
    /**
     * The authentication token associated with the participant's connection.
     */
    ConnectionToken: ParticipantToken;
  }
  export interface GetAttachmentResponse {
    /**
     * This is the pre-signed URL that can be used for uploading the file to Amazon S3 when used in response to StartAttachmentUpload.
     */
    Url?: PreSignedAttachmentUrl;
    /**
     * The expiration time of the URL in ISO timestamp. It's specified in ISO 8601 format: yyyy-MM-ddThh:mm:ss.SSSZ. For example, 2019-11-08T02:41:28.172Z.
     */
    UrlExpiry?: ISO8601Datetime;
  }
  export interface GetTranscriptRequest {
    /**
     * The contactId from the current contact chain for which transcript is needed.
     */
    ContactId?: ContactId;
    /**
     * The maximum number of results to return in the page. Default: 10. 
     */
    MaxResults?: MaxResults;
    /**
     * The pagination token. Use the value returned previously in the next subsequent request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The direction from StartPosition from which to retrieve message. Default: BACKWARD when no StartPosition is provided, FORWARD with StartPosition. 
     */
    ScanDirection?: ScanDirection;
    /**
     * The sort order for the records. Default: DESCENDING.
     */
    SortOrder?: SortKey;
    /**
     * A filtering option for where to start.
     */
    StartPosition?: StartPosition;
    /**
     * The authentication token associated with the participant's connection.
     */
    ConnectionToken: ParticipantToken;
  }
  export interface GetTranscriptResponse {
    /**
     * The initial contact ID for the contact. 
     */
    InitialContactId?: ContactId;
    /**
     * The list of messages in the session.
     */
    Transcript?: Transcript;
    /**
     * The pagination token. Use the value returned previously in the next subsequent request to retrieve the next set of results.
     */
    NextToken?: NextToken;
  }
  export type ISO8601Datetime = string;
  export type Instant = string;
  export interface Item {
    /**
     * The time when the message or event was sent. It's specified in ISO 8601 format: yyyy-MM-ddThh:mm:ss.SSSZ. For example, 2019-11-08T02:41:28.172Z.
     */
    AbsoluteTime?: Instant;
    /**
     * The content of the message or event.
     */
    Content?: ChatContent;
    /**
     * The type of content of the item.
     */
    ContentType?: ChatContentType;
    /**
     * The ID of the item.
     */
    Id?: ChatItemId;
    /**
     * Type of the item: message or event. 
     */
    Type?: ChatItemType;
    /**
     * The ID of the sender in the session.
     */
    ParticipantId?: ParticipantId;
    /**
     * The chat display name of the sender.
     */
    DisplayName?: DisplayName;
    /**
     * The role of the sender. For example, is it a customer, agent, or system.
     */
    ParticipantRole?: ParticipantRole;
    /**
     * Provides information about the attachments.
     */
    Attachments?: Attachments;
    /**
     * The metadata related to the message. Currently this supports only information related to message receipts.
     */
    MessageMetadata?: MessageMetadata;
    /**
     * The contactId on which the transcript item was originally sent. This field is only populated for persistent chats when the transcript item is from the past chat session. For more information, see Enable persistent chat.
     */
    RelatedContactId?: ContactId;
    /**
     * The contactId on which the transcript item was originally sent. This field is populated only when the transcript item is from the current chat session.
     */
    ContactId?: ContactId;
  }
  export type MaxResults = number;
  export interface MessageMetadata {
    /**
     * The identifier of the message that contains the metadata information. 
     */
    MessageId?: ChatItemId;
    /**
     * The list of receipt information for a message for different recipients.
     */
    Receipts?: Receipts;
  }
  export type MostRecent = number;
  export type NextToken = string;
  export type NonEmptyClientToken = string;
  export type ParticipantId = string;
  export type ParticipantRole = "AGENT"|"CUSTOMER"|"SYSTEM"|"CUSTOM_BOT"|string;
  export type ParticipantToken = string;
  export type PreSignedAttachmentUrl = string;
  export type PreSignedConnectionUrl = string;
  export interface Receipt {
    /**
     * The time when the message was delivered to the recipient.
     */
    DeliveredTimestamp?: Instant;
    /**
     * The time when the message was read by the recipient.
     */
    ReadTimestamp?: Instant;
    /**
     * The identifier of the recipient of the message. 
     */
    RecipientParticipantId?: ParticipantId;
  }
  export type Receipts = Receipt[];
  export type ScanDirection = "FORWARD"|"BACKWARD"|string;
  export interface SendEventRequest {
    /**
     * The content type of the request. Supported types are:   application/vnd.amazonaws.connect.event.typing   application/vnd.amazonaws.connect.event.connection.acknowledged   application/vnd.amazonaws.connect.event.message.delivered   application/vnd.amazonaws.connect.event.message.read  
     */
    ContentType: ChatContentType;
    /**
     * The content of the event to be sent (for example, message text). For content related to message receipts, this is supported in the form of a JSON string. Sample Content: "{\"messageId\":\"11111111-aaaa-bbbb-cccc-EXAMPLE01234\"}"
     */
    Content?: ChatContent;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If not provided, the Amazon Web Services SDK populates this field. For more information about idempotency, see Making retries safe with idempotent APIs.
     */
    ClientToken?: ClientToken;
    /**
     * The authentication token associated with the participant's connection.
     */
    ConnectionToken: ParticipantToken;
  }
  export interface SendEventResponse {
    /**
     * The ID of the response.
     */
    Id?: ChatItemId;
    /**
     * The time when the event was sent. It's specified in ISO 8601 format: yyyy-MM-ddThh:mm:ss.SSSZ. For example, 2019-11-08T02:41:28.172Z.
     */
    AbsoluteTime?: Instant;
  }
  export interface SendMessageRequest {
    /**
     * The type of the content. Supported types are text/plain, text/markdown, application/json, and application/vnd.amazonaws.connect.message.interactive.response.
     */
    ContentType: ChatContentType;
    /**
     * The content of the message.    For text/plain and text/markdown, the Length Constraints are Minimum of 1, Maximum of 1024.    For application/json, the Length Constraints are Minimum of 1, Maximum of 12000.    For application/vnd.amazonaws.connect.message.interactive.response, the Length Constraints are Minimum of 1, Maximum of 12288.  
     */
    Content: ChatContent;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If not provided, the Amazon Web Services SDK populates this field. For more information about idempotency, see Making retries safe with idempotent APIs.
     */
    ClientToken?: ClientToken;
    /**
     * The authentication token associated with the connection.
     */
    ConnectionToken: ParticipantToken;
  }
  export interface SendMessageResponse {
    /**
     * The ID of the message.
     */
    Id?: ChatItemId;
    /**
     * The time when the message was sent. It's specified in ISO 8601 format: yyyy-MM-ddThh:mm:ss.SSSZ. For example, 2019-11-08T02:41:28.172Z.
     */
    AbsoluteTime?: Instant;
  }
  export type SortKey = "DESCENDING"|"ASCENDING"|string;
  export interface StartAttachmentUploadRequest {
    /**
     * Describes the MIME file type of the attachment. For a list of supported file types, see Feature specifications in the Amazon Connect Administrator Guide.
     */
    ContentType: ContentType;
    /**
     * The size of the attachment in bytes.
     */
    AttachmentSizeInBytes: AttachmentSizeInBytes;
    /**
     * A case-sensitive name of the attachment being uploaded.
     */
    AttachmentName: AttachmentName;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If not provided, the Amazon Web Services SDK populates this field. For more information about idempotency, see Making retries safe with idempotent APIs.
     */
    ClientToken: NonEmptyClientToken;
    /**
     * The authentication token associated with the participant's connection.
     */
    ConnectionToken: ParticipantToken;
  }
  export interface StartAttachmentUploadResponse {
    /**
     * A unique identifier for the attachment.
     */
    AttachmentId?: ArtifactId;
    /**
     * Fields to be used while uploading the attachment.
     */
    UploadMetadata?: UploadMetadata;
  }
  export interface StartPosition {
    /**
     * The ID of the message or event where to start. 
     */
    Id?: ChatItemId;
    /**
     * The time in ISO format where to start. It's specified in ISO 8601 format: yyyy-MM-ddThh:mm:ss.SSSZ. For example, 2019-11-08T02:41:28.172Z.
     */
    AbsoluteTime?: Instant;
    /**
     * The start position of the most recent message where you want to start. 
     */
    MostRecent?: MostRecent;
  }
  export type Transcript = Item[];
  export interface UploadMetadata {
    /**
     * This is the pre-signed URL that can be used for uploading the file to Amazon S3 when used in response to StartAttachmentUpload.
     */
    Url?: UploadMetadataUrl;
    /**
     * The expiration time of the URL in ISO timestamp. It's specified in ISO 8601 format: yyyy-MM-ddThh:mm:ss.SSSZ. For example, 2019-11-08T02:41:28.172Z.
     */
    UrlExpiry?: ISO8601Datetime;
    /**
     * The headers to be provided while uploading the file to the URL.
     */
    HeadersToInclude?: UploadMetadataSignedHeaders;
  }
  export type UploadMetadataSignedHeaders = {[key: string]: UploadMetadataSignedHeadersValue};
  export type UploadMetadataSignedHeadersKey = string;
  export type UploadMetadataSignedHeadersValue = string;
  export type UploadMetadataUrl = string;
  export interface View {
    /**
     * The identifier of the view.
     */
    Id?: ViewId;
    /**
     * The Amazon Resource Name (ARN) of the view.
     */
    Arn?: ARN;
    /**
     * The name of the view.
     */
    Name?: ViewName;
    /**
     * The current version of the view.
     */
    Version?: ViewVersion;
    /**
     * View content containing all content necessary to render a view except for runtime input data.
     */
    Content?: ViewContent;
  }
  export type ViewAction = string;
  export type ViewActions = ViewAction[];
  export interface ViewContent {
    /**
     * The schema representing the input data that the view template must be supplied to render.
     */
    InputSchema?: ViewInputSchema;
    /**
     * The view template representing the structure of the view.
     */
    Template?: ViewTemplate;
    /**
     * A list of actions possible from the view
     */
    Actions?: ViewActions;
  }
  export type ViewId = string;
  export type ViewInputSchema = string;
  export type ViewName = string;
  export type ViewTemplate = string;
  export type ViewToken = string;
  export type ViewVersion = number;
  export interface Websocket {
    /**
     * The URL of the websocket.
     */
    Url?: PreSignedConnectionUrl;
    /**
     * The URL expiration timestamp in ISO date format. It's specified in ISO 8601 format: yyyy-MM-ddThh:mm:ss.SSSZ. For example, 2019-11-08T02:41:28.172Z.
     */
    ConnectionExpiry?: ISO8601Datetime;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-09-07"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ConnectParticipant client.
   */
  export import Types = ConnectParticipant;
}
export = ConnectParticipant;
