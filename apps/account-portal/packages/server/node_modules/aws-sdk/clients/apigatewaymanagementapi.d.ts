import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ApiGatewayManagementApi extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ApiGatewayManagementApi.Types.ClientConfiguration)
  config: Config & ApiGatewayManagementApi.Types.ClientConfiguration;
  /**
   * Delete the connection with the provided id.
   */
  deleteConnection(params: ApiGatewayManagementApi.Types.DeleteConnectionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete the connection with the provided id.
   */
  deleteConnection(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Get information about the connection with the provided id.
   */
  getConnection(params: ApiGatewayManagementApi.Types.GetConnectionRequest, callback?: (err: AWSError, data: ApiGatewayManagementApi.Types.GetConnectionResponse) => void): Request<ApiGatewayManagementApi.Types.GetConnectionResponse, AWSError>;
  /**
   * Get information about the connection with the provided id.
   */
  getConnection(callback?: (err: AWSError, data: ApiGatewayManagementApi.Types.GetConnectionResponse) => void): Request<ApiGatewayManagementApi.Types.GetConnectionResponse, AWSError>;
  /**
   * Sends the provided data to the specified connection.
   */
  postToConnection(params: ApiGatewayManagementApi.Types.PostToConnectionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sends the provided data to the specified connection.
   */
  postToConnection(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace ApiGatewayManagementApi {
  export type Data = Buffer|Uint8Array|Blob|string;
  export interface DeleteConnectionRequest {
    ConnectionId: __string;
  }
  export interface GetConnectionRequest {
    ConnectionId: __string;
  }
  export interface GetConnectionResponse {
    /**
     * The time in ISO 8601 format for when the connection was established.
     */
    ConnectedAt?: __timestampIso8601;
    Identity?: Identity;
    /**
     * The time in ISO 8601 format for when the connection was last active.
     */
    LastActiveAt?: __timestampIso8601;
  }
  export interface Identity {
    /**
     * The source IP address of the TCP connection making the request to API Gateway.
     */
    SourceIp: __string;
    /**
     * The User Agent of the API caller.
     */
    UserAgent: __string;
  }
  export interface PostToConnectionRequest {
    /**
     * The data to be sent to the client specified by its connection id.
     */
    Data: Data;
    /**
     * The identifier of the connection that a specific client is using.
     */
    ConnectionId: __string;
  }
  export type __string = string;
  export type __timestampIso8601 = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-11-29"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ApiGatewayManagementApi client.
   */
  export import Types = ApiGatewayManagementApi;
}
export = ApiGatewayManagementApi;
