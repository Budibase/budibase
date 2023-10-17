import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class S3Outposts extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: S3Outposts.Types.ClientConfiguration)
  config: Config & S3Outposts.Types.ClientConfiguration;
  /**
   * Amazon S3 on Outposts Access Points simplify managing data access at scale for shared datasets in S3 on Outposts. S3 on Outposts uses endpoints to connect to Outposts buckets so that you can perform actions within your virtual private cloud (VPC). For more information, see  Accessing S3 on Outposts using VPC only access points. This action creates an endpoint and associates it with the specified Outposts.  It can take up to 5 minutes for this action to complete.   Related actions include:    DeleteEndpoint     ListEndpoints   
   */
  createEndpoint(params: S3Outposts.Types.CreateEndpointRequest, callback?: (err: AWSError, data: S3Outposts.Types.CreateEndpointResult) => void): Request<S3Outposts.Types.CreateEndpointResult, AWSError>;
  /**
   * Amazon S3 on Outposts Access Points simplify managing data access at scale for shared datasets in S3 on Outposts. S3 on Outposts uses endpoints to connect to Outposts buckets so that you can perform actions within your virtual private cloud (VPC). For more information, see  Accessing S3 on Outposts using VPC only access points. This action creates an endpoint and associates it with the specified Outposts.  It can take up to 5 minutes for this action to complete.   Related actions include:    DeleteEndpoint     ListEndpoints   
   */
  createEndpoint(callback?: (err: AWSError, data: S3Outposts.Types.CreateEndpointResult) => void): Request<S3Outposts.Types.CreateEndpointResult, AWSError>;
  /**
   * Amazon S3 on Outposts Access Points simplify managing data access at scale for shared datasets in S3 on Outposts. S3 on Outposts uses endpoints to connect to Outposts buckets so that you can perform actions within your virtual private cloud (VPC). For more information, see  Accessing S3 on Outposts using VPC only access points. This action deletes an endpoint.  It can take up to 5 minutes for this action to complete.   Related actions include:    CreateEndpoint     ListEndpoints   
   */
  deleteEndpoint(params: S3Outposts.Types.DeleteEndpointRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Amazon S3 on Outposts Access Points simplify managing data access at scale for shared datasets in S3 on Outposts. S3 on Outposts uses endpoints to connect to Outposts buckets so that you can perform actions within your virtual private cloud (VPC). For more information, see  Accessing S3 on Outposts using VPC only access points. This action deletes an endpoint.  It can take up to 5 minutes for this action to complete.   Related actions include:    CreateEndpoint     ListEndpoints   
   */
  deleteEndpoint(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Amazon S3 on Outposts Access Points simplify managing data access at scale for shared datasets in S3 on Outposts. S3 on Outposts uses endpoints to connect to Outposts buckets so that you can perform actions within your virtual private cloud (VPC). For more information, see  Accessing S3 on Outposts using VPC only access points. This action lists endpoints associated with the Outposts.   Related actions include:    CreateEndpoint     DeleteEndpoint   
   */
  listEndpoints(params: S3Outposts.Types.ListEndpointsRequest, callback?: (err: AWSError, data: S3Outposts.Types.ListEndpointsResult) => void): Request<S3Outposts.Types.ListEndpointsResult, AWSError>;
  /**
   * Amazon S3 on Outposts Access Points simplify managing data access at scale for shared datasets in S3 on Outposts. S3 on Outposts uses endpoints to connect to Outposts buckets so that you can perform actions within your virtual private cloud (VPC). For more information, see  Accessing S3 on Outposts using VPC only access points. This action lists endpoints associated with the Outposts.   Related actions include:    CreateEndpoint     DeleteEndpoint   
   */
  listEndpoints(callback?: (err: AWSError, data: S3Outposts.Types.ListEndpointsResult) => void): Request<S3Outposts.Types.ListEndpointsResult, AWSError>;
}
declare namespace S3Outposts {
  export type CidrBlock = string;
  export interface CreateEndpointRequest {
    /**
     * The ID of the AWS Outposts. 
     */
    OutpostId: OutpostId;
    /**
     * The ID of the subnet in the selected VPC. The endpoint subnet must belong to the Outpost that has the Amazon S3 on Outposts provisioned.
     */
    SubnetId: SubnetId;
    /**
     * The ID of the security group to use with the endpoint.
     */
    SecurityGroupId: SecurityGroupId;
    /**
     * The type of access for the on-premise network connectivity for the Outpost endpoint. To access the endpoint from an on-premises network, you must specify the access type and provide the customer owned IPv4 pool.
     */
    AccessType?: EndpointAccessType;
    /**
     * The ID of the customer-owned IPv4 pool for the endpoint. IP addresses will be allocated from this pool for the endpoint.
     */
    CustomerOwnedIpv4Pool?: CustomerOwnedIpv4Pool;
  }
  export interface CreateEndpointResult {
    /**
     * The Amazon Resource Name (ARN) of the endpoint.
     */
    EndpointArn?: EndpointArn;
  }
  export type CreationTime = Date;
  export type CustomerOwnedIpv4Pool = string;
  export interface DeleteEndpointRequest {
    /**
     * The ID of the endpoint.
     */
    EndpointId: EndpointId;
    /**
     * The ID of the AWS Outposts. 
     */
    OutpostId: OutpostId;
  }
  export interface Endpoint {
    /**
     * The Amazon Resource Name (ARN) of the endpoint.
     */
    EndpointArn?: EndpointArn;
    /**
     * The ID of the AWS Outposts.
     */
    OutpostsId?: OutpostId;
    /**
     * The VPC CIDR committed by this endpoint.
     */
    CidrBlock?: CidrBlock;
    /**
     * The status of the endpoint.
     */
    Status?: EndpointStatus;
    /**
     * The time the endpoint was created.
     */
    CreationTime?: CreationTime;
    /**
     * The network interface of the endpoint.
     */
    NetworkInterfaces?: NetworkInterfaces;
    /**
     * The ID of the VPC used for the endpoint.
     */
    VpcId?: VpcId;
    /**
     * The ID of the subnet used for the endpoint.
     */
    SubnetId?: SubnetId;
    /**
     * The ID of the security group used for the endpoint.
     */
    SecurityGroupId?: SecurityGroupId;
    /**
     * 
     */
    AccessType?: EndpointAccessType;
    /**
     * The ID of the customer-owned IPv4 pool used for the endpoint.
     */
    CustomerOwnedIpv4Pool?: CustomerOwnedIpv4Pool;
  }
  export type EndpointAccessType = "Private"|"CustomerOwnedIp"|string;
  export type EndpointArn = string;
  export type EndpointId = string;
  export type EndpointStatus = "Pending"|"Available"|"Deleting"|string;
  export type Endpoints = Endpoint[];
  export interface ListEndpointsRequest {
    /**
     * The next endpoint requested in the list.
     */
    NextToken?: NextToken;
    /**
     * The max number of endpoints that can be returned on the request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListEndpointsResult {
    /**
     * Returns an array of endpoints associated with AWS Outposts.
     */
    Endpoints?: Endpoints;
    /**
     * The next endpoint returned in the list.
     */
    NextToken?: NextToken;
  }
  export type MaxResults = number;
  export interface NetworkInterface {
    /**
     * The ID for the network interface.
     */
    NetworkInterfaceId?: NetworkInterfaceId;
  }
  export type NetworkInterfaceId = string;
  export type NetworkInterfaces = NetworkInterface[];
  export type NextToken = string;
  export type OutpostId = string;
  export type SecurityGroupId = string;
  export type SubnetId = string;
  export type VpcId = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-07-25"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the S3Outposts client.
   */
  export import Types = S3Outposts;
}
export = S3Outposts;
