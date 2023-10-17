import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Cloud9 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Cloud9.Types.ClientConfiguration)
  config: Config & Cloud9.Types.ClientConfiguration;
  /**
   * Creates an Cloud9 development environment, launches an Amazon Elastic Compute Cloud (Amazon EC2) instance, and then connects from the instance to the environment.
   */
  createEnvironmentEC2(params: Cloud9.Types.CreateEnvironmentEC2Request, callback?: (err: AWSError, data: Cloud9.Types.CreateEnvironmentEC2Result) => void): Request<Cloud9.Types.CreateEnvironmentEC2Result, AWSError>;
  /**
   * Creates an Cloud9 development environment, launches an Amazon Elastic Compute Cloud (Amazon EC2) instance, and then connects from the instance to the environment.
   */
  createEnvironmentEC2(callback?: (err: AWSError, data: Cloud9.Types.CreateEnvironmentEC2Result) => void): Request<Cloud9.Types.CreateEnvironmentEC2Result, AWSError>;
  /**
   * Adds an environment member to an Cloud9 development environment.
   */
  createEnvironmentMembership(params: Cloud9.Types.CreateEnvironmentMembershipRequest, callback?: (err: AWSError, data: Cloud9.Types.CreateEnvironmentMembershipResult) => void): Request<Cloud9.Types.CreateEnvironmentMembershipResult, AWSError>;
  /**
   * Adds an environment member to an Cloud9 development environment.
   */
  createEnvironmentMembership(callback?: (err: AWSError, data: Cloud9.Types.CreateEnvironmentMembershipResult) => void): Request<Cloud9.Types.CreateEnvironmentMembershipResult, AWSError>;
  /**
   * Deletes an Cloud9 development environment. If an Amazon EC2 instance is connected to the environment, also terminates the instance.
   */
  deleteEnvironment(params: Cloud9.Types.DeleteEnvironmentRequest, callback?: (err: AWSError, data: Cloud9.Types.DeleteEnvironmentResult) => void): Request<Cloud9.Types.DeleteEnvironmentResult, AWSError>;
  /**
   * Deletes an Cloud9 development environment. If an Amazon EC2 instance is connected to the environment, also terminates the instance.
   */
  deleteEnvironment(callback?: (err: AWSError, data: Cloud9.Types.DeleteEnvironmentResult) => void): Request<Cloud9.Types.DeleteEnvironmentResult, AWSError>;
  /**
   * Deletes an environment member from an Cloud9 development environment.
   */
  deleteEnvironmentMembership(params: Cloud9.Types.DeleteEnvironmentMembershipRequest, callback?: (err: AWSError, data: Cloud9.Types.DeleteEnvironmentMembershipResult) => void): Request<Cloud9.Types.DeleteEnvironmentMembershipResult, AWSError>;
  /**
   * Deletes an environment member from an Cloud9 development environment.
   */
  deleteEnvironmentMembership(callback?: (err: AWSError, data: Cloud9.Types.DeleteEnvironmentMembershipResult) => void): Request<Cloud9.Types.DeleteEnvironmentMembershipResult, AWSError>;
  /**
   * Gets information about environment members for an Cloud9 development environment.
   */
  describeEnvironmentMemberships(params: Cloud9.Types.DescribeEnvironmentMembershipsRequest, callback?: (err: AWSError, data: Cloud9.Types.DescribeEnvironmentMembershipsResult) => void): Request<Cloud9.Types.DescribeEnvironmentMembershipsResult, AWSError>;
  /**
   * Gets information about environment members for an Cloud9 development environment.
   */
  describeEnvironmentMemberships(callback?: (err: AWSError, data: Cloud9.Types.DescribeEnvironmentMembershipsResult) => void): Request<Cloud9.Types.DescribeEnvironmentMembershipsResult, AWSError>;
  /**
   * Gets status information for an Cloud9 development environment.
   */
  describeEnvironmentStatus(params: Cloud9.Types.DescribeEnvironmentStatusRequest, callback?: (err: AWSError, data: Cloud9.Types.DescribeEnvironmentStatusResult) => void): Request<Cloud9.Types.DescribeEnvironmentStatusResult, AWSError>;
  /**
   * Gets status information for an Cloud9 development environment.
   */
  describeEnvironmentStatus(callback?: (err: AWSError, data: Cloud9.Types.DescribeEnvironmentStatusResult) => void): Request<Cloud9.Types.DescribeEnvironmentStatusResult, AWSError>;
  /**
   * Gets information about Cloud9 development environments.
   */
  describeEnvironments(params: Cloud9.Types.DescribeEnvironmentsRequest, callback?: (err: AWSError, data: Cloud9.Types.DescribeEnvironmentsResult) => void): Request<Cloud9.Types.DescribeEnvironmentsResult, AWSError>;
  /**
   * Gets information about Cloud9 development environments.
   */
  describeEnvironments(callback?: (err: AWSError, data: Cloud9.Types.DescribeEnvironmentsResult) => void): Request<Cloud9.Types.DescribeEnvironmentsResult, AWSError>;
  /**
   * Gets a list of Cloud9 development environment identifiers.
   */
  listEnvironments(params: Cloud9.Types.ListEnvironmentsRequest, callback?: (err: AWSError, data: Cloud9.Types.ListEnvironmentsResult) => void): Request<Cloud9.Types.ListEnvironmentsResult, AWSError>;
  /**
   * Gets a list of Cloud9 development environment identifiers.
   */
  listEnvironments(callback?: (err: AWSError, data: Cloud9.Types.ListEnvironmentsResult) => void): Request<Cloud9.Types.ListEnvironmentsResult, AWSError>;
  /**
   * Gets a list of the tags associated with an Cloud9 development environment.
   */
  listTagsForResource(params: Cloud9.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Cloud9.Types.ListTagsForResourceResponse) => void): Request<Cloud9.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Gets a list of the tags associated with an Cloud9 development environment.
   */
  listTagsForResource(callback?: (err: AWSError, data: Cloud9.Types.ListTagsForResourceResponse) => void): Request<Cloud9.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Adds tags to an Cloud9 development environment.  Tags that you add to an Cloud9 environment by using this method will NOT be automatically propagated to underlying resources. 
   */
  tagResource(params: Cloud9.Types.TagResourceRequest, callback?: (err: AWSError, data: Cloud9.Types.TagResourceResponse) => void): Request<Cloud9.Types.TagResourceResponse, AWSError>;
  /**
   * Adds tags to an Cloud9 development environment.  Tags that you add to an Cloud9 environment by using this method will NOT be automatically propagated to underlying resources. 
   */
  tagResource(callback?: (err: AWSError, data: Cloud9.Types.TagResourceResponse) => void): Request<Cloud9.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from an Cloud9 development environment.
   */
  untagResource(params: Cloud9.Types.UntagResourceRequest, callback?: (err: AWSError, data: Cloud9.Types.UntagResourceResponse) => void): Request<Cloud9.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from an Cloud9 development environment.
   */
  untagResource(callback?: (err: AWSError, data: Cloud9.Types.UntagResourceResponse) => void): Request<Cloud9.Types.UntagResourceResponse, AWSError>;
  /**
   * Changes the settings of an existing Cloud9 development environment.
   */
  updateEnvironment(params: Cloud9.Types.UpdateEnvironmentRequest, callback?: (err: AWSError, data: Cloud9.Types.UpdateEnvironmentResult) => void): Request<Cloud9.Types.UpdateEnvironmentResult, AWSError>;
  /**
   * Changes the settings of an existing Cloud9 development environment.
   */
  updateEnvironment(callback?: (err: AWSError, data: Cloud9.Types.UpdateEnvironmentResult) => void): Request<Cloud9.Types.UpdateEnvironmentResult, AWSError>;
  /**
   * Changes the settings of an existing environment member for an Cloud9 development environment.
   */
  updateEnvironmentMembership(params: Cloud9.Types.UpdateEnvironmentMembershipRequest, callback?: (err: AWSError, data: Cloud9.Types.UpdateEnvironmentMembershipResult) => void): Request<Cloud9.Types.UpdateEnvironmentMembershipResult, AWSError>;
  /**
   * Changes the settings of an existing environment member for an Cloud9 development environment.
   */
  updateEnvironmentMembership(callback?: (err: AWSError, data: Cloud9.Types.UpdateEnvironmentMembershipResult) => void): Request<Cloud9.Types.UpdateEnvironmentMembershipResult, AWSError>;
}
declare namespace Cloud9 {
  export type AutomaticStopTimeMinutes = number;
  export type BoundedEnvironmentIdList = EnvironmentId[];
  export type ClientRequestToken = string;
  export type ConnectionType = "CONNECT_SSH"|"CONNECT_SSM"|string;
  export interface CreateEnvironmentEC2Request {
    /**
     * The name of the environment to create. This name is visible to other IAM users in the same Amazon Web Services account.
     */
    name: EnvironmentName;
    /**
     * The description of the environment to create.
     */
    description?: EnvironmentDescription;
    /**
     * A unique, case-sensitive string that helps Cloud9 to ensure this operation completes no more than one time. For more information, see Client Tokens in the Amazon EC2 API Reference.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The type of instance to connect to the environment (for example, t2.micro).
     */
    instanceType: InstanceType;
    /**
     * The ID of the subnet in Amazon VPC that Cloud9 will use to communicate with the Amazon EC2 instance.
     */
    subnetId?: SubnetId;
    /**
     * The identifier for the Amazon Machine Image (AMI) that's used to create the EC2 instance. To choose an AMI for the instance, you must specify a valid AMI alias or a valid Amazon EC2 Systems Manager (SSM) path. The default AMI is used if the parameter isn't explicitly assigned a value in the request. Because Amazon Linux AMI has ended standard support as of December 31, 2020, we recommend you choose Amazon Linux 2, which includes long term support through 2023.  AMI aliases      Amazon Linux (default): amazonlinux-1-x86_64     Amazon Linux 2: amazonlinux-2-x86_64    Ubuntu 18.04: ubuntu-18.04-x86_64     SSM paths     Amazon Linux (default): resolve:ssm:/aws/service/cloud9/amis/amazonlinux-1-x86_64     Amazon Linux 2: resolve:ssm:/aws/service/cloud9/amis/amazonlinux-2-x86_64    Ubuntu 18.04: resolve:ssm:/aws/service/cloud9/amis/ubuntu-18.04-x86_64   
     */
    imageId?: ImageId;
    /**
     * The number of minutes until the running instance is shut down after the environment has last been used.
     */
    automaticStopTimeMinutes?: AutomaticStopTimeMinutes;
    /**
     * The Amazon Resource Name (ARN) of the environment owner. This ARN can be the ARN of any IAM principal. If this value is not specified, the ARN defaults to this environment's creator.
     */
    ownerArn?: UserArn;
    /**
     * An array of key-value pairs that will be associated with the new Cloud9 development environment.
     */
    tags?: TagList;
    /**
     * The connection type used for connecting to an Amazon EC2 environment. Valid values are CONNECT_SSH (default) and CONNECT_SSM (connected through Amazon EC2 Systems Manager). For more information, see Accessing no-ingress EC2 instances with Amazon EC2 Systems Manager in the Cloud9 User Guide.
     */
    connectionType?: ConnectionType;
    /**
     * Checks whether you have the required permissions for the action, without actually making the request, and provides an error response. If you have the required permissions, the error response is DryRunOperation. Otherwise, it is UnauthorizedOperation.
     */
    dryRun?: NullableBoolean;
  }
  export interface CreateEnvironmentEC2Result {
    /**
     * The ID of the environment that was created.
     */
    environmentId?: EnvironmentId;
  }
  export interface CreateEnvironmentMembershipRequest {
    /**
     * The ID of the environment that contains the environment member you want to add.
     */
    environmentId: EnvironmentId;
    /**
     * The Amazon Resource Name (ARN) of the environment member you want to add.
     */
    userArn: UserArn;
    /**
     * The type of environment member permissions you want to associate with this environment member. Available values include:    read-only: Has read-only access to the environment.    read-write: Has read-write access to the environment.  
     */
    permissions: MemberPermissions;
  }
  export interface CreateEnvironmentMembershipResult {
    /**
     * Information about the environment member that was added.
     */
    membership: EnvironmentMember;
  }
  export interface DeleteEnvironmentMembershipRequest {
    /**
     * The ID of the environment to delete the environment member from.
     */
    environmentId: EnvironmentId;
    /**
     * The Amazon Resource Name (ARN) of the environment member to delete from the environment.
     */
    userArn: UserArn;
  }
  export interface DeleteEnvironmentMembershipResult {
  }
  export interface DeleteEnvironmentRequest {
    /**
     * The ID of the environment to delete.
     */
    environmentId: EnvironmentId;
  }
  export interface DeleteEnvironmentResult {
  }
  export interface DescribeEnvironmentMembershipsRequest {
    /**
     * The Amazon Resource Name (ARN) of an individual environment member to get information about. If no value is specified, information about all environment members are returned.
     */
    userArn?: UserArn;
    /**
     * The ID of the environment to get environment member information about.
     */
    environmentId?: EnvironmentId;
    /**
     * The type of environment member permissions to get information about. Available values include:    owner: Owns the environment.    read-only: Has read-only access to the environment.    read-write: Has read-write access to the environment.   If no value is specified, information about all environment members are returned.
     */
    permissions?: PermissionsList;
    /**
     * During a previous call, if there are more than 25 items in the list, only the first 25 items are returned, along with a unique string called a next token. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned.
     */
    nextToken?: String;
    /**
     * The maximum number of environment members to get information about.
     */
    maxResults?: MaxResults;
  }
  export interface DescribeEnvironmentMembershipsResult {
    /**
     * Information about the environment members for the environment.
     */
    memberships?: EnvironmentMembersList;
    /**
     * If there are more than 25 items in the list, only the first 25 items are returned, along with a unique string called a next token. To get the next batch of items in the list, call this operation again, adding the next token to the call.
     */
    nextToken?: String;
  }
  export interface DescribeEnvironmentStatusRequest {
    /**
     * The ID of the environment to get status information about.
     */
    environmentId: EnvironmentId;
  }
  export interface DescribeEnvironmentStatusResult {
    /**
     * The status of the environment. Available values include:    connecting: The environment is connecting.    creating: The environment is being created.    deleting: The environment is being deleted.    error: The environment is in an error state.    ready: The environment is ready.    stopped: The environment is stopped.    stopping: The environment is stopping.  
     */
    status: EnvironmentStatus;
    /**
     * Any informational message about the status of the environment.
     */
    message: String;
  }
  export interface DescribeEnvironmentsRequest {
    /**
     * The IDs of individual environments to get information about.
     */
    environmentIds: BoundedEnvironmentIdList;
  }
  export interface DescribeEnvironmentsResult {
    /**
     * Information about the environments that are returned.
     */
    environments?: EnvironmentList;
  }
  export interface Environment {
    /**
     * The ID of the environment.
     */
    id?: EnvironmentId;
    /**
     * The name of the environment.
     */
    name?: EnvironmentName;
    /**
     * The description for the environment.
     */
    description?: EnvironmentDescription;
    /**
     * The type of environment. Valid values include the following:    ec2: An Amazon Elastic Compute Cloud (Amazon EC2) instance connects to the environment.    ssh: Your own server connects to the environment.  
     */
    type: EnvironmentType;
    /**
     * The connection type used for connecting to an Amazon EC2 environment. CONNECT_SSH is selected by default.
     */
    connectionType?: ConnectionType;
    /**
     * The Amazon Resource Name (ARN) of the environment.
     */
    arn: String;
    /**
     * The Amazon Resource Name (ARN) of the environment owner.
     */
    ownerArn: String;
    /**
     * The state of the environment in its creation or deletion lifecycle.
     */
    lifecycle?: EnvironmentLifecycle;
    /**
     * Describes the status of Amazon Web Services managed temporary credentials for the Cloud9 environment. Available values are:    ENABLED_ON_CREATE     ENABLED_BY_OWNER     DISABLED_BY_DEFAULT     DISABLED_BY_OWNER     DISABLED_BY_COLLABORATOR     PENDING_REMOVAL_BY_COLLABORATOR     PENDING_REMOVAL_BY_OWNER     FAILED_REMOVAL_BY_COLLABORATOR     ENABLED_BY_OWNER     DISABLED_BY_DEFAULT   
     */
    managedCredentialsStatus?: ManagedCredentialsStatus;
  }
  export type EnvironmentArn = string;
  export type EnvironmentDescription = string;
  export type EnvironmentId = string;
  export type EnvironmentIdList = EnvironmentId[];
  export interface EnvironmentLifecycle {
    /**
     * The current creation or deletion lifecycle state of the environment.    CREATING: The environment is in the process of being created.    CREATED: The environment was successfully created.    CREATE_FAILED: The environment failed to be created.    DELETING: The environment is in the process of being deleted.    DELETE_FAILED: The environment failed to delete.  
     */
    status?: EnvironmentLifecycleStatus;
    /**
     * Any informational message about the lifecycle state of the environment.
     */
    reason?: String;
    /**
     * If the environment failed to delete, the Amazon Resource Name (ARN) of the related Amazon Web Services resource.
     */
    failureResource?: String;
  }
  export type EnvironmentLifecycleStatus = "CREATING"|"CREATED"|"CREATE_FAILED"|"DELETING"|"DELETE_FAILED"|string;
  export type EnvironmentList = Environment[];
  export interface EnvironmentMember {
    /**
     * The type of environment member permissions associated with this environment member. Available values include:    owner: Owns the environment.    read-only: Has read-only access to the environment.    read-write: Has read-write access to the environment.  
     */
    permissions: Permissions;
    /**
     * The user ID in Identity and Access Management (IAM) of the environment member.
     */
    userId: String;
    /**
     * The Amazon Resource Name (ARN) of the environment member.
     */
    userArn: UserArn;
    /**
     * The ID of the environment for the environment member.
     */
    environmentId: EnvironmentId;
    /**
     * The time, expressed in epoch time format, when the environment member last opened the environment.
     */
    lastAccess?: Timestamp;
  }
  export type EnvironmentMembersList = EnvironmentMember[];
  export type EnvironmentName = string;
  export type EnvironmentStatus = "error"|"creating"|"connecting"|"ready"|"stopping"|"stopped"|"deleting"|string;
  export type EnvironmentType = "ssh"|"ec2"|string;
  export type ImageId = string;
  export type InstanceType = string;
  export interface ListEnvironmentsRequest {
    /**
     * During a previous call, if there are more than 25 items in the list, only the first 25 items are returned, along with a unique string called a next token. To get the next batch of items in the list, call this operation again, adding the next token to the call. To get all of the items in the list, keep calling this operation with each subsequent next token that is returned, until no more next tokens are returned.
     */
    nextToken?: String;
    /**
     * The maximum number of environments to get identifiers for.
     */
    maxResults?: MaxResults;
  }
  export interface ListEnvironmentsResult {
    /**
     * If there are more than 25 items in the list, only the first 25 items are returned, along with a unique string called a next token. To get the next batch of items in the list, call this operation again, adding the next token to the call.
     */
    nextToken?: String;
    /**
     * The list of environment identifiers.
     */
    environmentIds?: EnvironmentIdList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Cloud9 development environment to get the tags for.
     */
    ResourceARN: EnvironmentArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of tags associated with the Cloud9 development environment.
     */
    Tags?: TagList;
  }
  export type ManagedCredentialsAction = "ENABLE"|"DISABLE"|string;
  export type ManagedCredentialsStatus = "ENABLED_ON_CREATE"|"ENABLED_BY_OWNER"|"DISABLED_BY_DEFAULT"|"DISABLED_BY_OWNER"|"DISABLED_BY_COLLABORATOR"|"PENDING_REMOVAL_BY_COLLABORATOR"|"PENDING_START_REMOVAL_BY_COLLABORATOR"|"PENDING_REMOVAL_BY_OWNER"|"PENDING_START_REMOVAL_BY_OWNER"|"FAILED_REMOVAL_BY_COLLABORATOR"|"FAILED_REMOVAL_BY_OWNER"|string;
  export type MaxResults = number;
  export type MemberPermissions = "read-write"|"read-only"|string;
  export type NullableBoolean = boolean;
  export type Permissions = "owner"|"read-write"|"read-only"|string;
  export type PermissionsList = Permissions[];
  export type String = string;
  export type SubnetId = string;
  export interface Tag {
    /**
     * The name part of a tag.
     */
    Key: TagKey;
    /**
     * The value part of a tag.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Cloud9 development environment to add tags to.
     */
    ResourceARN: EnvironmentArn;
    /**
     * The list of tags to add to the given Cloud9 development environment.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Cloud9 development environment to remove tags from.
     */
    ResourceARN: EnvironmentArn;
    /**
     * The tag names of the tags to remove from the given Cloud9 development environment.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateEnvironmentMembershipRequest {
    /**
     * The ID of the environment for the environment member whose settings you want to change.
     */
    environmentId: EnvironmentId;
    /**
     * The Amazon Resource Name (ARN) of the environment member whose settings you want to change.
     */
    userArn: UserArn;
    /**
     * The replacement type of environment member permissions you want to associate with this environment member. Available values include:    read-only: Has read-only access to the environment.    read-write: Has read-write access to the environment.  
     */
    permissions: MemberPermissions;
  }
  export interface UpdateEnvironmentMembershipResult {
    /**
     * Information about the environment member whose settings were changed.
     */
    membership?: EnvironmentMember;
  }
  export interface UpdateEnvironmentRequest {
    /**
     * The ID of the environment to change settings.
     */
    environmentId: EnvironmentId;
    /**
     * A replacement name for the environment.
     */
    name?: EnvironmentName;
    /**
     * Any new or replacement description for the environment.
     */
    description?: EnvironmentDescription;
    /**
     * Allows the environment owner to turn on or turn off the Amazon Web Services managed temporary credentials for an Cloud9 environment by using one of the following values:    ENABLE     DISABLE     Only the environment owner can change the status of managed temporary credentials. An AccessDeniedException is thrown if an attempt to turn on or turn off managed temporary credentials is made by an account that's not the environment owner. 
     */
    managedCredentialsAction?: ManagedCredentialsAction;
  }
  export interface UpdateEnvironmentResult {
  }
  export type UserArn = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-09-23"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Cloud9 client.
   */
  export import Types = Cloud9;
}
export = Cloud9;
