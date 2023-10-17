import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IoTSecureTunneling extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IoTSecureTunneling.Types.ClientConfiguration)
  config: Config & IoTSecureTunneling.Types.ClientConfiguration;
  /**
   * Closes a tunnel identified by the unique tunnel id. When a CloseTunnel request is received, we close the WebSocket connections between the client and proxy server so no data can be transmitted. Requires permission to access the CloseTunnel action.
   */
  closeTunnel(params: IoTSecureTunneling.Types.CloseTunnelRequest, callback?: (err: AWSError, data: IoTSecureTunneling.Types.CloseTunnelResponse) => void): Request<IoTSecureTunneling.Types.CloseTunnelResponse, AWSError>;
  /**
   * Closes a tunnel identified by the unique tunnel id. When a CloseTunnel request is received, we close the WebSocket connections between the client and proxy server so no data can be transmitted. Requires permission to access the CloseTunnel action.
   */
  closeTunnel(callback?: (err: AWSError, data: IoTSecureTunneling.Types.CloseTunnelResponse) => void): Request<IoTSecureTunneling.Types.CloseTunnelResponse, AWSError>;
  /**
   * Gets information about a tunnel identified by the unique tunnel id. Requires permission to access the DescribeTunnel action.
   */
  describeTunnel(params: IoTSecureTunneling.Types.DescribeTunnelRequest, callback?: (err: AWSError, data: IoTSecureTunneling.Types.DescribeTunnelResponse) => void): Request<IoTSecureTunneling.Types.DescribeTunnelResponse, AWSError>;
  /**
   * Gets information about a tunnel identified by the unique tunnel id. Requires permission to access the DescribeTunnel action.
   */
  describeTunnel(callback?: (err: AWSError, data: IoTSecureTunneling.Types.DescribeTunnelResponse) => void): Request<IoTSecureTunneling.Types.DescribeTunnelResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(params: IoTSecureTunneling.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: IoTSecureTunneling.Types.ListTagsForResourceResponse) => void): Request<IoTSecureTunneling.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: IoTSecureTunneling.Types.ListTagsForResourceResponse) => void): Request<IoTSecureTunneling.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List all tunnels for an Amazon Web Services account. Tunnels are listed by creation time in descending order, newer tunnels will be listed before older tunnels. Requires permission to access the ListTunnels action.
   */
  listTunnels(params: IoTSecureTunneling.Types.ListTunnelsRequest, callback?: (err: AWSError, data: IoTSecureTunneling.Types.ListTunnelsResponse) => void): Request<IoTSecureTunneling.Types.ListTunnelsResponse, AWSError>;
  /**
   * List all tunnels for an Amazon Web Services account. Tunnels are listed by creation time in descending order, newer tunnels will be listed before older tunnels. Requires permission to access the ListTunnels action.
   */
  listTunnels(callback?: (err: AWSError, data: IoTSecureTunneling.Types.ListTunnelsResponse) => void): Request<IoTSecureTunneling.Types.ListTunnelsResponse, AWSError>;
  /**
   * Creates a new tunnel, and returns two client access tokens for clients to use to connect to the IoT Secure Tunneling proxy server. Requires permission to access the OpenTunnel action.
   */
  openTunnel(params: IoTSecureTunneling.Types.OpenTunnelRequest, callback?: (err: AWSError, data: IoTSecureTunneling.Types.OpenTunnelResponse) => void): Request<IoTSecureTunneling.Types.OpenTunnelResponse, AWSError>;
  /**
   * Creates a new tunnel, and returns two client access tokens for clients to use to connect to the IoT Secure Tunneling proxy server. Requires permission to access the OpenTunnel action.
   */
  openTunnel(callback?: (err: AWSError, data: IoTSecureTunneling.Types.OpenTunnelResponse) => void): Request<IoTSecureTunneling.Types.OpenTunnelResponse, AWSError>;
  /**
   * Revokes the current client access token (CAT) and returns new CAT for clients to use when reconnecting to secure tunneling to access the same tunnel. Requires permission to access the RotateTunnelAccessToken action.  Rotating the CAT doesn't extend the tunnel duration. For example, say the tunnel duration is 12 hours and the tunnel has already been open for 4 hours. When you rotate the access tokens, the new tokens that are generated can only be used for the remaining 8 hours. 
   */
  rotateTunnelAccessToken(params: IoTSecureTunneling.Types.RotateTunnelAccessTokenRequest, callback?: (err: AWSError, data: IoTSecureTunneling.Types.RotateTunnelAccessTokenResponse) => void): Request<IoTSecureTunneling.Types.RotateTunnelAccessTokenResponse, AWSError>;
  /**
   * Revokes the current client access token (CAT) and returns new CAT for clients to use when reconnecting to secure tunneling to access the same tunnel. Requires permission to access the RotateTunnelAccessToken action.  Rotating the CAT doesn't extend the tunnel duration. For example, say the tunnel duration is 12 hours and the tunnel has already been open for 4 hours. When you rotate the access tokens, the new tokens that are generated can only be used for the remaining 8 hours. 
   */
  rotateTunnelAccessToken(callback?: (err: AWSError, data: IoTSecureTunneling.Types.RotateTunnelAccessTokenResponse) => void): Request<IoTSecureTunneling.Types.RotateTunnelAccessTokenResponse, AWSError>;
  /**
   * A resource tag.
   */
  tagResource(params: IoTSecureTunneling.Types.TagResourceRequest, callback?: (err: AWSError, data: IoTSecureTunneling.Types.TagResourceResponse) => void): Request<IoTSecureTunneling.Types.TagResourceResponse, AWSError>;
  /**
   * A resource tag.
   */
  tagResource(callback?: (err: AWSError, data: IoTSecureTunneling.Types.TagResourceResponse) => void): Request<IoTSecureTunneling.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a tag from a resource.
   */
  untagResource(params: IoTSecureTunneling.Types.UntagResourceRequest, callback?: (err: AWSError, data: IoTSecureTunneling.Types.UntagResourceResponse) => void): Request<IoTSecureTunneling.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a tag from a resource.
   */
  untagResource(callback?: (err: AWSError, data: IoTSecureTunneling.Types.UntagResourceResponse) => void): Request<IoTSecureTunneling.Types.UntagResourceResponse, AWSError>;
}
declare namespace IoTSecureTunneling {
  export type AmazonResourceName = string;
  export type ClientAccessToken = string;
  export type ClientMode = "SOURCE"|"DESTINATION"|"ALL"|string;
  export interface CloseTunnelRequest {
    /**
     * The ID of the tunnel to close.
     */
    tunnelId: TunnelId;
    /**
     * When set to true, IoT Secure Tunneling deletes the tunnel data immediately.
     */
    delete?: DeleteFlag;
  }
  export interface CloseTunnelResponse {
  }
  export interface ConnectionState {
    /**
     * The connection status of the tunnel. Valid values are CONNECTED and DISCONNECTED.
     */
    status?: ConnectionStatus;
    /**
     * The last time the connection status was updated.
     */
    lastUpdatedAt?: DateType;
  }
  export type ConnectionStatus = "CONNECTED"|"DISCONNECTED"|string;
  export type DateType = Date;
  export type DeleteFlag = boolean;
  export interface DescribeTunnelRequest {
    /**
     * The tunnel to describe.
     */
    tunnelId: TunnelId;
  }
  export interface DescribeTunnelResponse {
    /**
     * The tunnel being described.
     */
    tunnel?: Tunnel;
  }
  export type Description = string;
  export interface DestinationConfig {
    /**
     * The name of the IoT thing to which you want to connect.
     */
    thingName?: ThingName;
    /**
     * A list of service names that identify the target application. The IoT client running on the destination device reads this value and uses it to look up a port or an IP address and a port. The IoT client instantiates the local proxy, which uses this information to connect to the destination application.
     */
    services: ServiceList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The resource ARN.
     */
    resourceArn: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags for the specified resource.
     */
    tags?: TagList;
  }
  export interface ListTunnelsRequest {
    /**
     * The name of the IoT thing associated with the destination device.
     */
    thingName?: ThingName;
    /**
     * The maximum number of results to return at once.
     */
    maxResults?: MaxResults;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTunnelsResponse {
    /**
     * A short description of the tunnels in an Amazon Web Services account.
     */
    tunnelSummaries?: TunnelSummaryList;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export interface OpenTunnelRequest {
    /**
     * A short text description of the tunnel. 
     */
    description?: Description;
    /**
     * A collection of tag metadata.
     */
    tags?: TagList;
    /**
     * The destination configuration for the OpenTunnel request.
     */
    destinationConfig?: DestinationConfig;
    /**
     * Timeout configuration for a tunnel.
     */
    timeoutConfig?: TimeoutConfig;
  }
  export interface OpenTunnelResponse {
    /**
     * A unique alpha-numeric tunnel ID.
     */
    tunnelId?: TunnelId;
    /**
     * The Amazon Resource Name for the tunnel.
     */
    tunnelArn?: TunnelArn;
    /**
     * The access token the source local proxy uses to connect to IoT Secure Tunneling.
     */
    sourceAccessToken?: ClientAccessToken;
    /**
     * The access token the destination local proxy uses to connect to IoT Secure Tunneling.
     */
    destinationAccessToken?: ClientAccessToken;
  }
  export interface RotateTunnelAccessTokenRequest {
    /**
     * The tunnel for which you want to rotate the access tokens.
     */
    tunnelId: TunnelId;
    /**
     * The mode of the client that will use the client token, which can be either the source or destination, or both source and destination.
     */
    clientMode: ClientMode;
    destinationConfig?: DestinationConfig;
  }
  export interface RotateTunnelAccessTokenResponse {
    /**
     * The Amazon Resource Name for the tunnel.
     */
    tunnelArn?: TunnelArn;
    /**
     * The client access token that the source local proxy uses to connect to IoT Secure Tunneling.
     */
    sourceAccessToken?: ClientAccessToken;
    /**
     * The client access token that the destination local proxy uses to connect to IoT Secure Tunneling.
     */
    destinationAccessToken?: ClientAccessToken;
  }
  export type Service = string;
  export type ServiceList = Service[];
  export interface Tag {
    /**
     * The key of the tag.
     */
    key: TagKey;
    /**
     * The value of the tag.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: AmazonResourceName;
    /**
     * The tags for the resource.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type ThingName = string;
  export interface TimeoutConfig {
    /**
     * The maximum amount of time (in minutes) a tunnel can remain open. If not specified, maxLifetimeTimeoutMinutes defaults to 720 minutes. Valid values are from 1 minute to 12 hours (720 minutes) 
     */
    maxLifetimeTimeoutMinutes?: TimeoutInMin;
  }
  export type TimeoutInMin = number;
  export interface Tunnel {
    /**
     * A unique alpha-numeric ID that identifies a tunnel.
     */
    tunnelId?: TunnelId;
    /**
     * The Amazon Resource Name (ARN) of a tunnel.
     */
    tunnelArn?: TunnelArn;
    /**
     * The status of a tunnel. Valid values are: Open and Closed.
     */
    status?: TunnelStatus;
    /**
     * The connection state of the source application.
     */
    sourceConnectionState?: ConnectionState;
    /**
     * The connection state of the destination application.
     */
    destinationConnectionState?: ConnectionState;
    /**
     * A description of the tunnel.
     */
    description?: Description;
    /**
     * The destination configuration that specifies the thing name of the destination device and a service name that the local proxy uses to connect to the destination application.
     */
    destinationConfig?: DestinationConfig;
    /**
     * Timeout configuration for the tunnel.
     */
    timeoutConfig?: TimeoutConfig;
    /**
     * A list of tag metadata associated with the secure tunnel.
     */
    tags?: TagList;
    /**
     * The time when the tunnel was created.
     */
    createdAt?: DateType;
    /**
     * The last time the tunnel was updated.
     */
    lastUpdatedAt?: DateType;
  }
  export type TunnelArn = string;
  export type TunnelId = string;
  export type TunnelStatus = "OPEN"|"CLOSED"|string;
  export interface TunnelSummary {
    /**
     * The unique alpha-numeric identifier for the tunnel.
     */
    tunnelId?: TunnelId;
    /**
     * The Amazon Resource Name of the tunnel. 
     */
    tunnelArn?: TunnelArn;
    /**
     * The status of a tunnel. Valid values are: Open and Closed.
     */
    status?: TunnelStatus;
    /**
     * A description of the tunnel.
     */
    description?: Description;
    /**
     * The time the tunnel was created.
     */
    createdAt?: DateType;
    /**
     * The time the tunnel was last updated.
     */
    lastUpdatedAt?: DateType;
  }
  export type TunnelSummaryList = TunnelSummary[];
  export interface UntagResourceRequest {
    /**
     * The resource ARN.
     */
    resourceArn: AmazonResourceName;
    /**
     * The keys of the tags to remove.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-10-05"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IoTSecureTunneling client.
   */
  export import Types = IoTSecureTunneling;
}
export = IoTSecureTunneling;
