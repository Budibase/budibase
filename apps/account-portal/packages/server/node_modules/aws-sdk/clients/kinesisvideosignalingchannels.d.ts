import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class KinesisVideoSignalingChannels extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: KinesisVideoSignalingChannels.Types.ClientConfiguration)
  config: Config & KinesisVideoSignalingChannels.Types.ClientConfiguration;
  /**
   * Gets the Interactive Connectivity Establishment (ICE) server configuration information, including URIs, username, and password which can be used to configure the WebRTC connection. The ICE component uses this configuration information to setup the WebRTC connection, including authenticating with the Traversal Using Relays around NAT (TURN) relay server.  TURN is a protocol that is used to improve the connectivity of peer-to-peer applications. By providing a cloud-based relay service, TURN ensures that a connection can be established even when one or more peers are incapable of a direct peer-to-peer connection. For more information, see A REST API For Access To TURN Services.  You can invoke this API to establish a fallback mechanism in case either of the peers is unable to establish a direct peer-to-peer connection over a signaling channel. You must specify either a signaling channel ARN or the client ID in order to invoke this API.
   */
  getIceServerConfig(params: KinesisVideoSignalingChannels.Types.GetIceServerConfigRequest, callback?: (err: AWSError, data: KinesisVideoSignalingChannels.Types.GetIceServerConfigResponse) => void): Request<KinesisVideoSignalingChannels.Types.GetIceServerConfigResponse, AWSError>;
  /**
   * Gets the Interactive Connectivity Establishment (ICE) server configuration information, including URIs, username, and password which can be used to configure the WebRTC connection. The ICE component uses this configuration information to setup the WebRTC connection, including authenticating with the Traversal Using Relays around NAT (TURN) relay server.  TURN is a protocol that is used to improve the connectivity of peer-to-peer applications. By providing a cloud-based relay service, TURN ensures that a connection can be established even when one or more peers are incapable of a direct peer-to-peer connection. For more information, see A REST API For Access To TURN Services.  You can invoke this API to establish a fallback mechanism in case either of the peers is unable to establish a direct peer-to-peer connection over a signaling channel. You must specify either a signaling channel ARN or the client ID in order to invoke this API.
   */
  getIceServerConfig(callback?: (err: AWSError, data: KinesisVideoSignalingChannels.Types.GetIceServerConfigResponse) => void): Request<KinesisVideoSignalingChannels.Types.GetIceServerConfigResponse, AWSError>;
  /**
   * This API allows you to connect WebRTC-enabled devices with Alexa display devices. When invoked, it sends the Alexa Session Description Protocol (SDP) offer to the master peer. The offer is delivered as soon as the master is connected to the specified signaling channel. This API returns the SDP answer from the connected master. If the master is not connected to the signaling channel, redelivery requests are made until the message expires.
   */
  sendAlexaOfferToMaster(params: KinesisVideoSignalingChannels.Types.SendAlexaOfferToMasterRequest, callback?: (err: AWSError, data: KinesisVideoSignalingChannels.Types.SendAlexaOfferToMasterResponse) => void): Request<KinesisVideoSignalingChannels.Types.SendAlexaOfferToMasterResponse, AWSError>;
  /**
   * This API allows you to connect WebRTC-enabled devices with Alexa display devices. When invoked, it sends the Alexa Session Description Protocol (SDP) offer to the master peer. The offer is delivered as soon as the master is connected to the specified signaling channel. This API returns the SDP answer from the connected master. If the master is not connected to the signaling channel, redelivery requests are made until the message expires.
   */
  sendAlexaOfferToMaster(callback?: (err: AWSError, data: KinesisVideoSignalingChannels.Types.SendAlexaOfferToMasterResponse) => void): Request<KinesisVideoSignalingChannels.Types.SendAlexaOfferToMasterResponse, AWSError>;
}
declare namespace KinesisVideoSignalingChannels {
  export type Answer = string;
  export type ClientId = string;
  export interface GetIceServerConfigRequest {
    /**
     * The ARN of the signaling channel to be used for the peer-to-peer connection between configured peers. 
     */
    ChannelARN: ResourceARN;
    /**
     * Unique identifier for the viewer. Must be unique within the signaling channel.
     */
    ClientId?: ClientId;
    /**
     * Specifies the desired service. Currently, TURN is the only valid value.
     */
    Service?: Service;
    /**
     * An optional user ID to be associated with the credentials.
     */
    Username?: Username;
  }
  export interface GetIceServerConfigResponse {
    /**
     * The list of ICE server information objects.
     */
    IceServerList?: IceServerList;
  }
  export interface IceServer {
    /**
     * An array of URIs, in the form specified in the I-D.petithuguenin-behave-turn-uris spec. These URIs provide the different addresses and/or protocols that can be used to reach the TURN server.
     */
    Uris?: Uris;
    /**
     * A username to login to the ICE server.
     */
    Username?: Username;
    /**
     * A password to login to the ICE server.
     */
    Password?: Password;
    /**
     * The period of time, in seconds, during which the username and password are valid.
     */
    Ttl?: Ttl;
  }
  export type IceServerList = IceServer[];
  export type MessagePayload = string;
  export type Password = string;
  export type ResourceARN = string;
  export interface SendAlexaOfferToMasterRequest {
    /**
     * The ARN of the signaling channel by which Alexa and the master peer communicate.
     */
    ChannelARN: ResourceARN;
    /**
     * The unique identifier for the sender client.
     */
    SenderClientId: ClientId;
    /**
     * The base64-encoded SDP offer content.
     */
    MessagePayload: MessagePayload;
  }
  export interface SendAlexaOfferToMasterResponse {
    /**
     * The base64-encoded SDP answer content.
     */
    Answer?: Answer;
  }
  export type Service = "TURN"|string;
  export type Ttl = number;
  export type Uri = string;
  export type Uris = Uri[];
  export type Username = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-12-04"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the KinesisVideoSignalingChannels client.
   */
  export import Types = KinesisVideoSignalingChannels;
}
export = KinesisVideoSignalingChannels;
