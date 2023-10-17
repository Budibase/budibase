import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class EC2InstanceConnect extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: EC2InstanceConnect.Types.ClientConfiguration)
  config: Config & EC2InstanceConnect.Types.ClientConfiguration;
  /**
   * Pushes an SSH public key to the specified EC2 instance for use by the specified user. The key remains for 60 seconds. For more information, see Connect to your Linux instance using EC2 Instance Connect in the Amazon EC2 User Guide.
   */
  sendSSHPublicKey(params: EC2InstanceConnect.Types.SendSSHPublicKeyRequest, callback?: (err: AWSError, data: EC2InstanceConnect.Types.SendSSHPublicKeyResponse) => void): Request<EC2InstanceConnect.Types.SendSSHPublicKeyResponse, AWSError>;
  /**
   * Pushes an SSH public key to the specified EC2 instance for use by the specified user. The key remains for 60 seconds. For more information, see Connect to your Linux instance using EC2 Instance Connect in the Amazon EC2 User Guide.
   */
  sendSSHPublicKey(callback?: (err: AWSError, data: EC2InstanceConnect.Types.SendSSHPublicKeyResponse) => void): Request<EC2InstanceConnect.Types.SendSSHPublicKeyResponse, AWSError>;
  /**
   * Pushes an SSH public key to the specified EC2 instance. The key remains for 60 seconds, which gives you 60 seconds to establish a serial console connection to the instance using SSH. For more information, see EC2 Serial Console in the Amazon EC2 User Guide.
   */
  sendSerialConsoleSSHPublicKey(params: EC2InstanceConnect.Types.SendSerialConsoleSSHPublicKeyRequest, callback?: (err: AWSError, data: EC2InstanceConnect.Types.SendSerialConsoleSSHPublicKeyResponse) => void): Request<EC2InstanceConnect.Types.SendSerialConsoleSSHPublicKeyResponse, AWSError>;
  /**
   * Pushes an SSH public key to the specified EC2 instance. The key remains for 60 seconds, which gives you 60 seconds to establish a serial console connection to the instance using SSH. For more information, see EC2 Serial Console in the Amazon EC2 User Guide.
   */
  sendSerialConsoleSSHPublicKey(callback?: (err: AWSError, data: EC2InstanceConnect.Types.SendSerialConsoleSSHPublicKeyResponse) => void): Request<EC2InstanceConnect.Types.SendSerialConsoleSSHPublicKeyResponse, AWSError>;
}
declare namespace EC2InstanceConnect {
  export type AvailabilityZone = string;
  export type InstanceId = string;
  export type InstanceOSUser = string;
  export type RequestId = string;
  export type SSHPublicKey = string;
  export interface SendSSHPublicKeyRequest {
    /**
     * The ID of the EC2 instance.
     */
    InstanceId: InstanceId;
    /**
     * The OS user on the EC2 instance for whom the key can be used to authenticate.
     */
    InstanceOSUser: InstanceOSUser;
    /**
     * The public key material. To use the public key, you must have the matching private key.
     */
    SSHPublicKey: SSHPublicKey;
    /**
     * The Availability Zone in which the EC2 instance was launched.
     */
    AvailabilityZone: AvailabilityZone;
  }
  export interface SendSSHPublicKeyResponse {
    /**
     * The ID of the request. Please provide this ID when contacting AWS Support for assistance.
     */
    RequestId?: RequestId;
    /**
     * Is true if the request succeeds and an error otherwise.
     */
    Success?: Success;
  }
  export interface SendSerialConsoleSSHPublicKeyRequest {
    /**
     * The ID of the EC2 instance.
     */
    InstanceId: InstanceId;
    /**
     * The serial port of the EC2 instance. Currently only port 0 is supported. Default: 0
     */
    SerialPort?: SerialPort;
    /**
     * The public key material. To use the public key, you must have the matching private key. For information about the supported key formats and lengths, see Requirements for key pairs in the Amazon EC2 User Guide.
     */
    SSHPublicKey: SSHPublicKey;
  }
  export interface SendSerialConsoleSSHPublicKeyResponse {
    /**
     * The ID of the request. Please provide this ID when contacting AWS Support for assistance.
     */
    RequestId?: RequestId;
    /**
     * Is true if the request succeeds and an error otherwise.
     */
    Success?: Success;
  }
  export type SerialPort = number;
  export type Success = boolean;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-04-02"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the EC2InstanceConnect client.
   */
  export import Types = EC2InstanceConnect;
}
export = EC2InstanceConnect;
