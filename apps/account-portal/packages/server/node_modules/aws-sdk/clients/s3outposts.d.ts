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
   * Creates an endpoint and associates it with the specified Outpost.  It can take up to 5 minutes for this action to finish.   Related actions include:    DeleteEndpoint     ListEndpoints   
   */
  createEndpoint(params: S3Outposts.Types.CreateEndpointRequest, callback?: (err: AWSError, data: S3Outposts.Types.CreateEndpointResult) => void): Request<S3Outposts.Types.CreateEndpointResult, AWSError>;
  /**
   * Creates an endpoint and associates it with the specified Outpost.  It can take up to 5 minutes for this action to finish.   Related actions include:    DeleteEndpoint     ListEndpoints   
   */
  createEndpoint(callback?: (err: AWSError, data: S3Outposts.Types.CreateEndpointResult) => void): Request<S3Outposts.Types.CreateEndpointResult, AWSError>;
  /**
   * Deletes an endpoint.  It can take up to 5 minutes for this action to finish.   Related actions include:    CreateEndpoint     ListEndpoints   
   */
  deleteEndpoint(params: S3Outposts.Types.DeleteEndpointRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an endpoint.  It can take up to 5 minutes for this action to finish.   Related actions include:    CreateEndpoint     ListEndpoints   
   */
  deleteEndpoint(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Lists endpoints associated with the specified Outpost.  Related actions include:    CreateEndpoint     DeleteEndpoint   
   */
  listEndpoints(params: S3Outposts.Types.ListEndpointsRequest, callback?: (err: AWSError, data: S3Outposts.Types.ListEndpointsResult) => void): Request<S3Outposts.Types.ListEndpointsResult, AWSError>;
  /**
   * Lists endpoints associated with the specified Outpost.  Related actions include:    CreateEndpoint     DeleteEndpoint   
   */
  listEndpoints(callback?: (err: AWSError, data: S3Outposts.Types.ListEndpointsResult) => void): Request<S3Outposts.Types.ListEndpointsResult, AWSError>;
  /**
   * Lists the Outposts with S3 on Outposts capacity for your Amazon Web Services account. Includes S3 on Outposts that you have access to as the Outposts owner, or as a shared user from Resource Access Manager (RAM). 
   */
  listOutpostsWithS3(params: S3Outposts.Types.ListOutpostsWithS3Request, callback?: (err: AWSError, data: S3Outposts.Types.ListOutpostsWithS3Result) => void): Request<S3Outposts.Types.ListOutpostsWithS3Result, AWSError>;
  /**
   * Lists the Outposts with S3 on Outposts capacity for your Amazon Web Services account. Includes S3 on Outposts that you have access to as the Outposts owner, or as a shared user from Resource Access Manager (RAM). 
   */
  listOutpostsWithS3(callback?: (err: AWSError, data: S3Outposts.Types.ListOutpostsWithS3Result) => void): Request<S3Outposts.Types.ListOutpostsWithS3Result, AWSError>;
  /**
   * Lists all endpoints associated with an Outpost that has been shared by Amazon Web Services Resource Access Manager (RAM). Related actions include:    CreateEndpoint     DeleteEndpoint   
   */
  listSharedEndpoints(params: S3Outposts.Types.ListSharedEndpointsRequest, callback?: (err: AWSError, data: S3Outposts.Types.ListSharedEndpointsResult) => void): Request<S3Outposts.Types.ListSharedEndpointsResult, AWSError>;
  /**
   * Lists all endpoints associated with an Outpost that has been shared by Amazon Web Services Resource Access Manager (RAM). Related actions include:    CreateEndpoint     DeleteEndpoint   
   */
  listSharedEndpoints(callback?: (err: AWSError, data: S3Outposts.Types.ListSharedEndpointsResult) => void): Request<S3Outposts.Types.ListSharedEndpointsResult, AWSError>;
}
declare namespace S3Outposts {
  export type AwsAccountId = string;
  export type CapacityInBytes = number;
  export type CidrBlock = string;
  export interface CreateEndpointRequest {
    /**
     * The ID of the Outposts. 
     */
    OutpostId: OutpostId;
    /**
     * The ID of the subnet in the selected VPC. The endpoint subnet must belong to the Outpost that has Amazon S3 on Outposts provisioned.
     */
    SubnetId: SubnetId;
    /**
     * The ID of the security group to use with the endpoint.
     */
    SecurityGroupId: SecurityGroupId;
    /**
     * The type of access for the network connectivity for the Amazon S3 on Outposts endpoint. To use the Amazon Web Services VPC, choose Private. To use the endpoint with an on-premises network, choose CustomerOwnedIp. If you choose CustomerOwnedIp, you must also provide the customer-owned IP address pool (CoIP pool).   Private is the default access type value. 
     */
    AccessType?: EndpointAccessType;
    /**
     * The ID of the customer-owned IPv4 address pool (CoIP pool) for the endpoint. IP addresses are allocated from this pool for the endpoint.
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
     * The ID of the Outposts. 
     */
    OutpostId: OutpostId;
  }
  export interface Endpoint {
    /**
     * The Amazon Resource Name (ARN) of the endpoint.
     */
    EndpointArn?: EndpointArn;
    /**
     * The ID of the Outposts.
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
     * The type of connectivity used to access the Amazon S3 on Outposts endpoint.
     */
    AccessType?: EndpointAccessType;
    /**
     * The ID of the customer-owned IPv4 address pool used for the endpoint.
     */
    CustomerOwnedIpv4Pool?: CustomerOwnedIpv4Pool;
    /**
     * The failure reason, if any, for a create or delete endpoint operation.
     */
    FailedReason?: FailedReason;
  }
  export type EndpointAccessType = "Private"|"CustomerOwnedIp"|string;
  export type EndpointArn = string;
  export type EndpointId = string;
  export type EndpointStatus = "Pending"|"Available"|"Deleting"|"Create_Failed"|"Delete_Failed"|string;
  export type Endpoints = Endpoint[];
  export type ErrorCode = string;
  export interface FailedReason {
    /**
     * The failure code, if any, for a create or delete endpoint operation.
     */
    ErrorCode?: ErrorCode;
    /**
     * Additional error details describing the endpoint failure and recommended action.
     */
    Message?: Message;
  }
  export interface ListEndpointsRequest {
    /**
     * If a previous response from this operation included a NextToken value, provide that value here to retrieve the next page of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of endpoints that will be returned in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListEndpointsResult {
    /**
     * The list of endpoints associated with the specified Outpost.
     */
    Endpoints?: Endpoints;
    /**
     * If the number of endpoints associated with the specified Outpost exceeds MaxResults, you can include this value in subsequent calls to this operation to retrieve more results.
     */
    NextToken?: NextToken;
  }
  export interface ListOutpostsWithS3Request {
    /**
     * When you can get additional results from the ListOutpostsWithS3 call, a NextToken parameter is returned in the output. You can then pass in a subsequent command to the NextToken parameter to continue listing additional Outposts.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of Outposts to return. The limit is 100.
     */
    MaxResults?: MaxResults;
  }
  export interface ListOutpostsWithS3Result {
    /**
     * Returns the list of Outposts that have the following characteristics:   outposts that have S3 provisioned   outposts that are Active (not pending any provisioning nor decommissioned)   outposts to which the the calling Amazon Web Services account has access  
     */
    Outposts?: Outposts;
    /**
     * Returns a token that you can use to call ListOutpostsWithS3 again and receive additional results, if there are any.
     */
    NextToken?: NextToken;
  }
  export interface ListSharedEndpointsRequest {
    /**
     * If a previous response from this operation included a NextToken value, you can provide that value here to retrieve the next page of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of endpoints that will be returned in the response.
     */
    MaxResults?: MaxResults;
    /**
     * The ID of the Amazon Web Services Outpost.
     */
    OutpostId: OutpostId;
  }
  export interface ListSharedEndpointsResult {
    /**
     * The list of endpoints associated with the specified Outpost that have been shared by Amazon Web Services Resource Access Manager (RAM).
     */
    Endpoints?: Endpoints;
    /**
     * If the number of endpoints associated with the specified Outpost exceeds MaxResults, you can include this value in subsequent calls to this operation to retrieve more results.
     */
    NextToken?: NextToken;
  }
  export type MaxResults = number;
  export type Message = string;
  export interface NetworkInterface {
    /**
     * The ID for the network interface.
     */
    NetworkInterfaceId?: NetworkInterfaceId;
  }
  export type NetworkInterfaceId = string;
  export type NetworkInterfaces = NetworkInterface[];
  export type NextToken = string;
  export interface Outpost {
    /**
     * Specifies the unique Amazon Resource Name (ARN) for the outpost.
     */
    OutpostArn?: OutpostArn;
    /**
     * Specifies the unique identifier for the outpost.
     */
    OutpostId?: OutpostId;
    /**
     * Returns the Amazon Web Services account ID of the outpost owner. Useful for comparing owned versus shared outposts.
     */
    OwnerId?: AwsAccountId;
    /**
     * The Amazon S3 capacity of the outpost in bytes.
     */
    CapacityInBytes?: CapacityInBytes;
  }
  export type OutpostArn = string;
  export type OutpostId = string;
  export type Outposts = Outpost[];
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
