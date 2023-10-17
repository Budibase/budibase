import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CodeStarconnections extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CodeStarconnections.Types.ClientConfiguration)
  config: Config & CodeStarconnections.Types.ClientConfiguration;
  /**
   * Creates a connection that can then be given to other AWS services like CodePipeline so that it can access third-party code repositories. The connection is in pending status until the third-party connection handshake is completed from the console.
   */
  createConnection(params: CodeStarconnections.Types.CreateConnectionInput, callback?: (err: AWSError, data: CodeStarconnections.Types.CreateConnectionOutput) => void): Request<CodeStarconnections.Types.CreateConnectionOutput, AWSError>;
  /**
   * Creates a connection that can then be given to other AWS services like CodePipeline so that it can access third-party code repositories. The connection is in pending status until the third-party connection handshake is completed from the console.
   */
  createConnection(callback?: (err: AWSError, data: CodeStarconnections.Types.CreateConnectionOutput) => void): Request<CodeStarconnections.Types.CreateConnectionOutput, AWSError>;
  /**
   * Creates a resource that represents the infrastructure where a third-party provider is installed. The host is used when you create connections to an installed third-party provider type, such as GitHub Enterprise Server. You create one host for all connections to that provider.  A host created through the CLI or the SDK is in `PENDING` status by default. You can make its status `AVAILABLE` by setting up the host in the console. 
   */
  createHost(params: CodeStarconnections.Types.CreateHostInput, callback?: (err: AWSError, data: CodeStarconnections.Types.CreateHostOutput) => void): Request<CodeStarconnections.Types.CreateHostOutput, AWSError>;
  /**
   * Creates a resource that represents the infrastructure where a third-party provider is installed. The host is used when you create connections to an installed third-party provider type, such as GitHub Enterprise Server. You create one host for all connections to that provider.  A host created through the CLI or the SDK is in `PENDING` status by default. You can make its status `AVAILABLE` by setting up the host in the console. 
   */
  createHost(callback?: (err: AWSError, data: CodeStarconnections.Types.CreateHostOutput) => void): Request<CodeStarconnections.Types.CreateHostOutput, AWSError>;
  /**
   * The connection to be deleted.
   */
  deleteConnection(params: CodeStarconnections.Types.DeleteConnectionInput, callback?: (err: AWSError, data: CodeStarconnections.Types.DeleteConnectionOutput) => void): Request<CodeStarconnections.Types.DeleteConnectionOutput, AWSError>;
  /**
   * The connection to be deleted.
   */
  deleteConnection(callback?: (err: AWSError, data: CodeStarconnections.Types.DeleteConnectionOutput) => void): Request<CodeStarconnections.Types.DeleteConnectionOutput, AWSError>;
  /**
   * The host to be deleted. Before you delete a host, all connections associated to the host must be deleted.  A host cannot be deleted if it is in the VPC_CONFIG_INITIALIZING or VPC_CONFIG_DELETING state. 
   */
  deleteHost(params: CodeStarconnections.Types.DeleteHostInput, callback?: (err: AWSError, data: CodeStarconnections.Types.DeleteHostOutput) => void): Request<CodeStarconnections.Types.DeleteHostOutput, AWSError>;
  /**
   * The host to be deleted. Before you delete a host, all connections associated to the host must be deleted.  A host cannot be deleted if it is in the VPC_CONFIG_INITIALIZING or VPC_CONFIG_DELETING state. 
   */
  deleteHost(callback?: (err: AWSError, data: CodeStarconnections.Types.DeleteHostOutput) => void): Request<CodeStarconnections.Types.DeleteHostOutput, AWSError>;
  /**
   * Returns the connection ARN and details such as status, owner, and provider type.
   */
  getConnection(params: CodeStarconnections.Types.GetConnectionInput, callback?: (err: AWSError, data: CodeStarconnections.Types.GetConnectionOutput) => void): Request<CodeStarconnections.Types.GetConnectionOutput, AWSError>;
  /**
   * Returns the connection ARN and details such as status, owner, and provider type.
   */
  getConnection(callback?: (err: AWSError, data: CodeStarconnections.Types.GetConnectionOutput) => void): Request<CodeStarconnections.Types.GetConnectionOutput, AWSError>;
  /**
   * Returns the host ARN and details such as status, provider type, endpoint, and, if applicable, the VPC configuration.
   */
  getHost(params: CodeStarconnections.Types.GetHostInput, callback?: (err: AWSError, data: CodeStarconnections.Types.GetHostOutput) => void): Request<CodeStarconnections.Types.GetHostOutput, AWSError>;
  /**
   * Returns the host ARN and details such as status, provider type, endpoint, and, if applicable, the VPC configuration.
   */
  getHost(callback?: (err: AWSError, data: CodeStarconnections.Types.GetHostOutput) => void): Request<CodeStarconnections.Types.GetHostOutput, AWSError>;
  /**
   * Lists the connections associated with your account.
   */
  listConnections(params: CodeStarconnections.Types.ListConnectionsInput, callback?: (err: AWSError, data: CodeStarconnections.Types.ListConnectionsOutput) => void): Request<CodeStarconnections.Types.ListConnectionsOutput, AWSError>;
  /**
   * Lists the connections associated with your account.
   */
  listConnections(callback?: (err: AWSError, data: CodeStarconnections.Types.ListConnectionsOutput) => void): Request<CodeStarconnections.Types.ListConnectionsOutput, AWSError>;
  /**
   * Lists the hosts associated with your account.
   */
  listHosts(params: CodeStarconnections.Types.ListHostsInput, callback?: (err: AWSError, data: CodeStarconnections.Types.ListHostsOutput) => void): Request<CodeStarconnections.Types.ListHostsOutput, AWSError>;
  /**
   * Lists the hosts associated with your account.
   */
  listHosts(callback?: (err: AWSError, data: CodeStarconnections.Types.ListHostsOutput) => void): Request<CodeStarconnections.Types.ListHostsOutput, AWSError>;
  /**
   * Gets the set of key-value pairs (metadata) that are used to manage the resource.
   */
  listTagsForResource(params: CodeStarconnections.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: CodeStarconnections.Types.ListTagsForResourceOutput) => void): Request<CodeStarconnections.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Gets the set of key-value pairs (metadata) that are used to manage the resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: CodeStarconnections.Types.ListTagsForResourceOutput) => void): Request<CodeStarconnections.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata that can be used to manage a resource.
   */
  tagResource(params: CodeStarconnections.Types.TagResourceInput, callback?: (err: AWSError, data: CodeStarconnections.Types.TagResourceOutput) => void): Request<CodeStarconnections.Types.TagResourceOutput, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata that can be used to manage a resource.
   */
  tagResource(callback?: (err: AWSError, data: CodeStarconnections.Types.TagResourceOutput) => void): Request<CodeStarconnections.Types.TagResourceOutput, AWSError>;
  /**
   * Removes tags from an AWS resource.
   */
  untagResource(params: CodeStarconnections.Types.UntagResourceInput, callback?: (err: AWSError, data: CodeStarconnections.Types.UntagResourceOutput) => void): Request<CodeStarconnections.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes tags from an AWS resource.
   */
  untagResource(callback?: (err: AWSError, data: CodeStarconnections.Types.UntagResourceOutput) => void): Request<CodeStarconnections.Types.UntagResourceOutput, AWSError>;
  /**
   * Updates a specified host with the provided configurations.
   */
  updateHost(params: CodeStarconnections.Types.UpdateHostInput, callback?: (err: AWSError, data: CodeStarconnections.Types.UpdateHostOutput) => void): Request<CodeStarconnections.Types.UpdateHostOutput, AWSError>;
  /**
   * Updates a specified host with the provided configurations.
   */
  updateHost(callback?: (err: AWSError, data: CodeStarconnections.Types.UpdateHostOutput) => void): Request<CodeStarconnections.Types.UpdateHostOutput, AWSError>;
}
declare namespace CodeStarconnections {
  export type AccountId = string;
  export type AmazonResourceName = string;
  export interface Connection {
    /**
     * The name of the connection. Connection names must be unique in an AWS user account.
     */
    ConnectionName?: ConnectionName;
    /**
     * The Amazon Resource Name (ARN) of the connection. The ARN is used as the connection reference when the connection is shared between AWS services.  The ARN is never reused if the connection is deleted. 
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The name of the external provider where your third-party code repository is configured.
     */
    ProviderType?: ProviderType;
    /**
     * The identifier of the external provider where your third-party code repository is configured. For Bitbucket, this is the account ID of the owner of the Bitbucket repository.
     */
    OwnerAccountId?: AccountId;
    /**
     * The current status of the connection. 
     */
    ConnectionStatus?: ConnectionStatus;
    /**
     * The Amazon Resource Name (ARN) of the host associated with the connection.
     */
    HostArn?: HostArn;
  }
  export type ConnectionArn = string;
  export type ConnectionList = Connection[];
  export type ConnectionName = string;
  export type ConnectionStatus = "PENDING"|"AVAILABLE"|"ERROR"|string;
  export interface CreateConnectionInput {
    /**
     * The name of the external provider where your third-party code repository is configured.
     */
    ProviderType?: ProviderType;
    /**
     * The name of the connection to be created. The name must be unique in the calling AWS account.
     */
    ConnectionName: ConnectionName;
    /**
     * The key-value pair to use when tagging the resource.
     */
    Tags?: TagList;
    /**
     * The Amazon Resource Name (ARN) of the host associated with the connection to be created.
     */
    HostArn?: HostArn;
  }
  export interface CreateConnectionOutput {
    /**
     * The Amazon Resource Name (ARN) of the connection to be created. The ARN is used as the connection reference when the connection is shared between AWS services.  The ARN is never reused if the connection is deleted. 
     */
    ConnectionArn: ConnectionArn;
    /**
     * Specifies the tags applied to the resource.
     */
    Tags?: TagList;
  }
  export interface CreateHostInput {
    /**
     * The name of the host to be created. The name must be unique in the calling AWS account.
     */
    Name: HostName;
    /**
     * The name of the installed provider to be associated with your connection. The host resource represents the infrastructure where your provider type is installed. The valid provider type is GitHub Enterprise Server.
     */
    ProviderType: ProviderType;
    /**
     * The endpoint of the infrastructure to be represented by the host after it is created.
     */
    ProviderEndpoint: Url;
    /**
     * The VPC configuration to be provisioned for the host. A VPC must be configured and the infrastructure to be represented by the host must already be connected to the VPC.
     */
    VpcConfiguration?: VpcConfiguration;
    Tags?: TagList;
  }
  export interface CreateHostOutput {
    /**
     * The Amazon Resource Name (ARN) of the host to be created.
     */
    HostArn?: HostArn;
    Tags?: TagList;
  }
  export interface DeleteConnectionInput {
    /**
     * The Amazon Resource Name (ARN) of the connection to be deleted.  The ARN is never reused if the connection is deleted. 
     */
    ConnectionArn: ConnectionArn;
  }
  export interface DeleteConnectionOutput {
  }
  export interface DeleteHostInput {
    /**
     * The Amazon Resource Name (ARN) of the host to be deleted.
     */
    HostArn: HostArn;
  }
  export interface DeleteHostOutput {
  }
  export interface GetConnectionInput {
    /**
     * The Amazon Resource Name (ARN) of a connection.
     */
    ConnectionArn: ConnectionArn;
  }
  export interface GetConnectionOutput {
    /**
     * The connection details, such as status, owner, and provider type.
     */
    Connection?: Connection;
  }
  export interface GetHostInput {
    /**
     * The Amazon Resource Name (ARN) of the requested host.
     */
    HostArn: HostArn;
  }
  export interface GetHostOutput {
    /**
     * The name of the requested host.
     */
    Name?: HostName;
    /**
     * The status of the requested host.
     */
    Status?: HostStatus;
    /**
     * The provider type of the requested host, such as GitHub Enterprise Server.
     */
    ProviderType?: ProviderType;
    /**
     * The endpoint of the infrastructure represented by the requested host.
     */
    ProviderEndpoint?: Url;
    /**
     * The VPC configuration of the requested host.
     */
    VpcConfiguration?: VpcConfiguration;
  }
  export interface Host {
    /**
     * The name of the host.
     */
    Name?: HostName;
    /**
     * The Amazon Resource Name (ARN) of the host.
     */
    HostArn?: HostArn;
    /**
     * The name of the installed provider to be associated with your connection. The host resource represents the infrastructure where your provider type is installed. The valid provider type is GitHub Enterprise Server.
     */
    ProviderType?: ProviderType;
    /**
     * The endpoint of the infrastructure where your provider type is installed.
     */
    ProviderEndpoint?: Url;
    /**
     * The VPC configuration provisioned for the host.
     */
    VpcConfiguration?: VpcConfiguration;
    /**
     * The status of the host, such as PENDING, AVAILABLE, VPC_CONFIG_DELETING, VPC_CONFIG_INITIALIZING, and VPC_CONFIG_FAILED_INITIALIZATION.
     */
    Status?: HostStatus;
    /**
     * The status description for the host.
     */
    StatusMessage?: HostStatusMessage;
  }
  export type HostArn = string;
  export type HostList = Host[];
  export type HostName = string;
  export type HostStatus = string;
  export type HostStatusMessage = string;
  export interface ListConnectionsInput {
    /**
     * Filters the list of connections to those associated with a specified provider, such as Bitbucket.
     */
    ProviderTypeFilter?: ProviderType;
    /**
     * Filters the list of connections to those associated with a specified host.
     */
    HostArnFilter?: HostArn;
    /**
     * The maximum number of results to return in a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: MaxResults;
    /**
     * The token that was returned from the previous ListConnections call, which can be used to return the next set of connections in the list.
     */
    NextToken?: NextToken;
  }
  export interface ListConnectionsOutput {
    /**
     * A list of connections and the details for each connection, such as status, owner, and provider type.
     */
    Connections?: ConnectionList;
    /**
     * A token that can be used in the next ListConnections call. To view all items in the list, continue to call this operation with each subsequent token until no more nextToken values are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListHostsInput {
    /**
     * The maximum number of results to return in a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: MaxResults;
    /**
     * The token that was returned from the previous ListHosts call, which can be used to return the next set of hosts in the list.
     */
    NextToken?: NextToken;
  }
  export interface ListHostsOutput {
    /**
     * A list of hosts and the details for each host, such as status, endpoint, and provider type.
     */
    Hosts?: HostList;
    /**
     * A token that can be used in the next ListHosts call. To view all items in the list, continue to call this operation with each subsequent token until no more nextToken values are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource for which you want to get information about tags, if any.
     */
    ResourceArn: AmazonResourceName;
  }
  export interface ListTagsForResourceOutput {
    /**
     * A list of tag key and value pairs associated with the specified resource.
     */
    Tags?: TagList;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export type ProviderType = "Bitbucket"|"GitHub"|"GitHubEnterpriseServer"|string;
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
  export interface Tag {
    /**
     * The tag's key.
     */
    Key: TagKey;
    /**
     * The tag's value.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource to which you want to add or update tags.
     */
    ResourceArn: AmazonResourceName;
    /**
     * The tags you want to modify or add to the resource.
     */
    Tags: TagList;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type TlsCertificate = string;
  export interface UntagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource to remove tags from.
     */
    ResourceArn: AmazonResourceName;
    /**
     * The list of keys for the tags to be removed from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateHostInput {
    /**
     * The Amazon Resource Name (ARN) of the host to be updated.
     */
    HostArn: HostArn;
    /**
     * The URL or endpoint of the host to be updated.
     */
    ProviderEndpoint?: Url;
    /**
     * The VPC configuration of the host to be updated. A VPC must be configured and the infrastructure to be represented by the host must already be connected to the VPC.
     */
    VpcConfiguration?: VpcConfiguration;
  }
  export interface UpdateHostOutput {
  }
  export type Url = string;
  export interface VpcConfiguration {
    /**
     * The ID of the Amazon VPC connected to the infrastructure where your provider type is installed.
     */
    VpcId: VpcId;
    /**
     * The ID of the subnet or subnets associated with the Amazon VPC connected to the infrastructure where your provider type is installed.
     */
    SubnetIds: SubnetIds;
    /**
     * The ID of the security group or security groups associated with the Amazon VPC connected to the infrastructure where your provider type is installed.
     */
    SecurityGroupIds: SecurityGroupIds;
    /**
     * The value of the Transport Layer Security (TLS) certificate associated with the infrastructure where your provider type is installed.
     */
    TlsCertificate?: TlsCertificate;
  }
  export type VpcId = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-12-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CodeStarconnections client.
   */
  export import Types = CodeStarconnections;
}
export = CodeStarconnections;
