import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IotData extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IotData.Types.ClientConfiguration)
  config: Config & IotData.Types.ClientConfiguration;
  /**
   * Deletes the shadow for the specified thing. Requires permission to access the DeleteThingShadow action. For more information, see DeleteThingShadow in the IoT Developer Guide.
   */
  deleteThingShadow(params: IotData.Types.DeleteThingShadowRequest, callback?: (err: AWSError, data: IotData.Types.DeleteThingShadowResponse) => void): Request<IotData.Types.DeleteThingShadowResponse, AWSError>;
  /**
   * Deletes the shadow for the specified thing. Requires permission to access the DeleteThingShadow action. For more information, see DeleteThingShadow in the IoT Developer Guide.
   */
  deleteThingShadow(callback?: (err: AWSError, data: IotData.Types.DeleteThingShadowResponse) => void): Request<IotData.Types.DeleteThingShadowResponse, AWSError>;
  /**
   * Gets the details of a single retained message for the specified topic. This action returns the message payload of the retained message, which can incur messaging costs. To list only the topic names of the retained messages, call ListRetainedMessages. Requires permission to access the GetRetainedMessage action. For more information about messaging costs, see IoT Core pricing - Messaging.
   */
  getRetainedMessage(params: IotData.Types.GetRetainedMessageRequest, callback?: (err: AWSError, data: IotData.Types.GetRetainedMessageResponse) => void): Request<IotData.Types.GetRetainedMessageResponse, AWSError>;
  /**
   * Gets the details of a single retained message for the specified topic. This action returns the message payload of the retained message, which can incur messaging costs. To list only the topic names of the retained messages, call ListRetainedMessages. Requires permission to access the GetRetainedMessage action. For more information about messaging costs, see IoT Core pricing - Messaging.
   */
  getRetainedMessage(callback?: (err: AWSError, data: IotData.Types.GetRetainedMessageResponse) => void): Request<IotData.Types.GetRetainedMessageResponse, AWSError>;
  /**
   * Gets the shadow for the specified thing. Requires permission to access the GetThingShadow action. For more information, see GetThingShadow in the IoT Developer Guide.
   */
  getThingShadow(params: IotData.Types.GetThingShadowRequest, callback?: (err: AWSError, data: IotData.Types.GetThingShadowResponse) => void): Request<IotData.Types.GetThingShadowResponse, AWSError>;
  /**
   * Gets the shadow for the specified thing. Requires permission to access the GetThingShadow action. For more information, see GetThingShadow in the IoT Developer Guide.
   */
  getThingShadow(callback?: (err: AWSError, data: IotData.Types.GetThingShadowResponse) => void): Request<IotData.Types.GetThingShadowResponse, AWSError>;
  /**
   * Lists the shadows for the specified thing. Requires permission to access the ListNamedShadowsForThing action.
   */
  listNamedShadowsForThing(params: IotData.Types.ListNamedShadowsForThingRequest, callback?: (err: AWSError, data: IotData.Types.ListNamedShadowsForThingResponse) => void): Request<IotData.Types.ListNamedShadowsForThingResponse, AWSError>;
  /**
   * Lists the shadows for the specified thing. Requires permission to access the ListNamedShadowsForThing action.
   */
  listNamedShadowsForThing(callback?: (err: AWSError, data: IotData.Types.ListNamedShadowsForThingResponse) => void): Request<IotData.Types.ListNamedShadowsForThingResponse, AWSError>;
  /**
   * Lists summary information about the retained messages stored for the account. This action returns only the topic names of the retained messages. It doesn't return any message payloads. Although this action doesn't return a message payload, it can still incur messaging costs. To get the message payload of a retained message, call GetRetainedMessage with the topic name of the retained message. Requires permission to access the ListRetainedMessages action. For more information about messaging costs, see IoT Core pricing - Messaging.
   */
  listRetainedMessages(params: IotData.Types.ListRetainedMessagesRequest, callback?: (err: AWSError, data: IotData.Types.ListRetainedMessagesResponse) => void): Request<IotData.Types.ListRetainedMessagesResponse, AWSError>;
  /**
   * Lists summary information about the retained messages stored for the account. This action returns only the topic names of the retained messages. It doesn't return any message payloads. Although this action doesn't return a message payload, it can still incur messaging costs. To get the message payload of a retained message, call GetRetainedMessage with the topic name of the retained message. Requires permission to access the ListRetainedMessages action. For more information about messaging costs, see IoT Core pricing - Messaging.
   */
  listRetainedMessages(callback?: (err: AWSError, data: IotData.Types.ListRetainedMessagesResponse) => void): Request<IotData.Types.ListRetainedMessagesResponse, AWSError>;
  /**
   * Publishes an MQTT message. Requires permission to access the Publish action. For more information about MQTT messages, see MQTT Protocol in the IoT Developer Guide. For more information about messaging costs, see IoT Core pricing - Messaging.
   */
  publish(params: IotData.Types.PublishRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Publishes an MQTT message. Requires permission to access the Publish action. For more information about MQTT messages, see MQTT Protocol in the IoT Developer Guide. For more information about messaging costs, see IoT Core pricing - Messaging.
   */
  publish(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the shadow for the specified thing. Requires permission to access the UpdateThingShadow action. For more information, see UpdateThingShadow in the IoT Developer Guide.
   */
  updateThingShadow(params: IotData.Types.UpdateThingShadowRequest, callback?: (err: AWSError, data: IotData.Types.UpdateThingShadowResponse) => void): Request<IotData.Types.UpdateThingShadowResponse, AWSError>;
  /**
   * Updates the shadow for the specified thing. Requires permission to access the UpdateThingShadow action. For more information, see UpdateThingShadow in the IoT Developer Guide.
   */
  updateThingShadow(callback?: (err: AWSError, data: IotData.Types.UpdateThingShadowResponse) => void): Request<IotData.Types.UpdateThingShadowResponse, AWSError>;
}
declare namespace IotData {
  export interface DeleteThingShadowRequest {
    /**
     * The name of the thing.
     */
    thingName: ThingName;
    /**
     * The name of the shadow.
     */
    shadowName?: ShadowName;
  }
  export interface DeleteThingShadowResponse {
    /**
     * The state information, in JSON format.
     */
    payload: JsonDocument;
  }
  export interface GetRetainedMessageRequest {
    /**
     * The topic name of the retained message to retrieve.
     */
    topic: Topic;
  }
  export interface GetRetainedMessageResponse {
    /**
     * The topic name to which the retained message was published.
     */
    topic?: Topic;
    /**
     * The Base64-encoded message payload of the retained message body.
     */
    payload?: Payload;
    /**
     * The quality of service (QoS) level used to publish the retained message.
     */
    qos?: Qos;
    /**
     * The Epoch date and time, in milliseconds, when the retained message was stored by IoT.
     */
    lastModifiedTime?: Timestamp;
  }
  export interface GetThingShadowRequest {
    /**
     * The name of the thing.
     */
    thingName: ThingName;
    /**
     * The name of the shadow.
     */
    shadowName?: ShadowName;
  }
  export interface GetThingShadowResponse {
    /**
     * The state information, in JSON format.
     */
    payload?: JsonDocument;
  }
  export type JsonDocument = Buffer|Uint8Array|Blob|string;
  export interface ListNamedShadowsForThingRequest {
    /**
     * The name of the thing.
     */
    thingName: ThingName;
    /**
     * The token to retrieve the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The result page size.
     */
    pageSize?: PageSize;
  }
  export interface ListNamedShadowsForThingResponse {
    /**
     * The list of shadows for the specified thing.
     */
    results?: NamedShadowList;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
    /**
     * The Epoch date and time the response was generated by IoT.
     */
    timestamp?: Timestamp;
  }
  export interface ListRetainedMessagesRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: MaxResults;
  }
  export interface ListRetainedMessagesResponse {
    /**
     * A summary list the account's retained messages. The information returned doesn't include the message payloads of the retained messages.
     */
    retainedTopics?: RetainedMessageList;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export type MaxResults = number;
  export type NamedShadowList = ShadowName[];
  export type NextToken = string;
  export type PageSize = number;
  export type Payload = Buffer|Uint8Array|Blob|string;
  export type PayloadSize = number;
  export interface PublishRequest {
    /**
     * The name of the MQTT topic.
     */
    topic: Topic;
    /**
     * The Quality of Service (QoS) level.
     */
    qos?: Qos;
    /**
     * A Boolean value that determines whether to set the RETAIN flag when the message is published. Setting the RETAIN flag causes the message to be retained and sent to new subscribers to the topic. Valid values: true | false  Default value: false 
     */
    retain?: Retain;
    /**
     * The message body. MQTT accepts text, binary, and empty (null) message payloads. Publishing an empty (null) payload with retain = true deletes the retained message identified by topic from IoT Core.
     */
    payload?: Payload;
  }
  export type Qos = number;
  export type Retain = boolean;
  export type RetainedMessageList = RetainedMessageSummary[];
  export interface RetainedMessageSummary {
    /**
     * The topic name to which the retained message was published.
     */
    topic?: Topic;
    /**
     * The size of the retained message's payload in bytes.
     */
    payloadSize?: PayloadSize;
    /**
     * The quality of service (QoS) level used to publish the retained message.
     */
    qos?: Qos;
    /**
     * The Epoch date and time, in milliseconds, when the retained message was stored by IoT.
     */
    lastModifiedTime?: Timestamp;
  }
  export type ShadowName = string;
  export type ThingName = string;
  export type Timestamp = number;
  export type Topic = string;
  export interface UpdateThingShadowRequest {
    /**
     * The name of the thing.
     */
    thingName: ThingName;
    /**
     * The name of the shadow.
     */
    shadowName?: ShadowName;
    /**
     * The state information, in JSON format.
     */
    payload: JsonDocument;
  }
  export interface UpdateThingShadowResponse {
    /**
     * The state information, in JSON format.
     */
    payload?: JsonDocument;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-05-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IotData client.
   */
  export import Types = IotData;
}
export = IotData;
