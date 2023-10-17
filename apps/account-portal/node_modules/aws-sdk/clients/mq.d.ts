import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MQ extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MQ.Types.ClientConfiguration)
  config: Config & MQ.Types.ClientConfiguration;
  /**
   * Creates a broker. Note: This API is asynchronous. To create a broker, you must either use the AmazonMQFullAccess IAM policy or include the following EC2 permissions in your IAM policy. ec2:CreateNetworkInterface This permission is required to allow Amazon MQ to create an elastic network interface (ENI) on behalf of your account. ec2:CreateNetworkInterfacePermission This permission is required to attach the ENI to the broker instance. ec2:DeleteNetworkInterface ec2:DeleteNetworkInterfacePermission ec2:DetachNetworkInterface ec2:DescribeInternetGateways ec2:DescribeNetworkInterfaces ec2:DescribeNetworkInterfacePermissions ec2:DescribeRouteTables ec2:DescribeSecurityGroups ec2:DescribeSubnets ec2:DescribeVpcs For more information, see Create an IAM User and Get Your AWS Credentials and Never Modify or Delete the Amazon MQ Elastic Network Interface in the Amazon MQ Developer Guide.
   */
  createBroker(params: MQ.Types.CreateBrokerRequest, callback?: (err: AWSError, data: MQ.Types.CreateBrokerResponse) => void): Request<MQ.Types.CreateBrokerResponse, AWSError>;
  /**
   * Creates a broker. Note: This API is asynchronous. To create a broker, you must either use the AmazonMQFullAccess IAM policy or include the following EC2 permissions in your IAM policy. ec2:CreateNetworkInterface This permission is required to allow Amazon MQ to create an elastic network interface (ENI) on behalf of your account. ec2:CreateNetworkInterfacePermission This permission is required to attach the ENI to the broker instance. ec2:DeleteNetworkInterface ec2:DeleteNetworkInterfacePermission ec2:DetachNetworkInterface ec2:DescribeInternetGateways ec2:DescribeNetworkInterfaces ec2:DescribeNetworkInterfacePermissions ec2:DescribeRouteTables ec2:DescribeSecurityGroups ec2:DescribeSubnets ec2:DescribeVpcs For more information, see Create an IAM User and Get Your AWS Credentials and Never Modify or Delete the Amazon MQ Elastic Network Interface in the Amazon MQ Developer Guide.
   */
  createBroker(callback?: (err: AWSError, data: MQ.Types.CreateBrokerResponse) => void): Request<MQ.Types.CreateBrokerResponse, AWSError>;
  /**
   * Creates a new configuration for the specified configuration name. Amazon MQ uses the default configuration (the engine type and version).
   */
  createConfiguration(params: MQ.Types.CreateConfigurationRequest, callback?: (err: AWSError, data: MQ.Types.CreateConfigurationResponse) => void): Request<MQ.Types.CreateConfigurationResponse, AWSError>;
  /**
   * Creates a new configuration for the specified configuration name. Amazon MQ uses the default configuration (the engine type and version).
   */
  createConfiguration(callback?: (err: AWSError, data: MQ.Types.CreateConfigurationResponse) => void): Request<MQ.Types.CreateConfigurationResponse, AWSError>;
  /**
   * Add a tag to a resource.
   */
  createTags(params: MQ.Types.CreateTagsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Add a tag to a resource.
   */
  createTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates an ActiveMQ user.
   */
  createUser(params: MQ.Types.CreateUserRequest, callback?: (err: AWSError, data: MQ.Types.CreateUserResponse) => void): Request<MQ.Types.CreateUserResponse, AWSError>;
  /**
   * Creates an ActiveMQ user.
   */
  createUser(callback?: (err: AWSError, data: MQ.Types.CreateUserResponse) => void): Request<MQ.Types.CreateUserResponse, AWSError>;
  /**
   * Deletes a broker. Note: This API is asynchronous.
   */
  deleteBroker(params: MQ.Types.DeleteBrokerRequest, callback?: (err: AWSError, data: MQ.Types.DeleteBrokerResponse) => void): Request<MQ.Types.DeleteBrokerResponse, AWSError>;
  /**
   * Deletes a broker. Note: This API is asynchronous.
   */
  deleteBroker(callback?: (err: AWSError, data: MQ.Types.DeleteBrokerResponse) => void): Request<MQ.Types.DeleteBrokerResponse, AWSError>;
  /**
   * Removes a tag from a resource.
   */
  deleteTags(params: MQ.Types.DeleteTagsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a tag from a resource.
   */
  deleteTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an ActiveMQ user.
   */
  deleteUser(params: MQ.Types.DeleteUserRequest, callback?: (err: AWSError, data: MQ.Types.DeleteUserResponse) => void): Request<MQ.Types.DeleteUserResponse, AWSError>;
  /**
   * Deletes an ActiveMQ user.
   */
  deleteUser(callback?: (err: AWSError, data: MQ.Types.DeleteUserResponse) => void): Request<MQ.Types.DeleteUserResponse, AWSError>;
  /**
   * Returns information about the specified broker.
   */
  describeBroker(params: MQ.Types.DescribeBrokerRequest, callback?: (err: AWSError, data: MQ.Types.DescribeBrokerResponse) => void): Request<MQ.Types.DescribeBrokerResponse, AWSError>;
  /**
   * Returns information about the specified broker.
   */
  describeBroker(callback?: (err: AWSError, data: MQ.Types.DescribeBrokerResponse) => void): Request<MQ.Types.DescribeBrokerResponse, AWSError>;
  /**
   * Describe available engine types and versions.
   */
  describeBrokerEngineTypes(params: MQ.Types.DescribeBrokerEngineTypesRequest, callback?: (err: AWSError, data: MQ.Types.DescribeBrokerEngineTypesResponse) => void): Request<MQ.Types.DescribeBrokerEngineTypesResponse, AWSError>;
  /**
   * Describe available engine types and versions.
   */
  describeBrokerEngineTypes(callback?: (err: AWSError, data: MQ.Types.DescribeBrokerEngineTypesResponse) => void): Request<MQ.Types.DescribeBrokerEngineTypesResponse, AWSError>;
  /**
   * Describe available broker instance options.
   */
  describeBrokerInstanceOptions(params: MQ.Types.DescribeBrokerInstanceOptionsRequest, callback?: (err: AWSError, data: MQ.Types.DescribeBrokerInstanceOptionsResponse) => void): Request<MQ.Types.DescribeBrokerInstanceOptionsResponse, AWSError>;
  /**
   * Describe available broker instance options.
   */
  describeBrokerInstanceOptions(callback?: (err: AWSError, data: MQ.Types.DescribeBrokerInstanceOptionsResponse) => void): Request<MQ.Types.DescribeBrokerInstanceOptionsResponse, AWSError>;
  /**
   * Returns information about the specified configuration.
   */
  describeConfiguration(params: MQ.Types.DescribeConfigurationRequest, callback?: (err: AWSError, data: MQ.Types.DescribeConfigurationResponse) => void): Request<MQ.Types.DescribeConfigurationResponse, AWSError>;
  /**
   * Returns information about the specified configuration.
   */
  describeConfiguration(callback?: (err: AWSError, data: MQ.Types.DescribeConfigurationResponse) => void): Request<MQ.Types.DescribeConfigurationResponse, AWSError>;
  /**
   * Returns the specified configuration revision for the specified configuration.
   */
  describeConfigurationRevision(params: MQ.Types.DescribeConfigurationRevisionRequest, callback?: (err: AWSError, data: MQ.Types.DescribeConfigurationRevisionResponse) => void): Request<MQ.Types.DescribeConfigurationRevisionResponse, AWSError>;
  /**
   * Returns the specified configuration revision for the specified configuration.
   */
  describeConfigurationRevision(callback?: (err: AWSError, data: MQ.Types.DescribeConfigurationRevisionResponse) => void): Request<MQ.Types.DescribeConfigurationRevisionResponse, AWSError>;
  /**
   * Returns information about an ActiveMQ user.
   */
  describeUser(params: MQ.Types.DescribeUserRequest, callback?: (err: AWSError, data: MQ.Types.DescribeUserResponse) => void): Request<MQ.Types.DescribeUserResponse, AWSError>;
  /**
   * Returns information about an ActiveMQ user.
   */
  describeUser(callback?: (err: AWSError, data: MQ.Types.DescribeUserResponse) => void): Request<MQ.Types.DescribeUserResponse, AWSError>;
  /**
   * Returns a list of all brokers.
   */
  listBrokers(params: MQ.Types.ListBrokersRequest, callback?: (err: AWSError, data: MQ.Types.ListBrokersResponse) => void): Request<MQ.Types.ListBrokersResponse, AWSError>;
  /**
   * Returns a list of all brokers.
   */
  listBrokers(callback?: (err: AWSError, data: MQ.Types.ListBrokersResponse) => void): Request<MQ.Types.ListBrokersResponse, AWSError>;
  /**
   * Returns a list of all revisions for the specified configuration.
   */
  listConfigurationRevisions(params: MQ.Types.ListConfigurationRevisionsRequest, callback?: (err: AWSError, data: MQ.Types.ListConfigurationRevisionsResponse) => void): Request<MQ.Types.ListConfigurationRevisionsResponse, AWSError>;
  /**
   * Returns a list of all revisions for the specified configuration.
   */
  listConfigurationRevisions(callback?: (err: AWSError, data: MQ.Types.ListConfigurationRevisionsResponse) => void): Request<MQ.Types.ListConfigurationRevisionsResponse, AWSError>;
  /**
   * Returns a list of all configurations.
   */
  listConfigurations(params: MQ.Types.ListConfigurationsRequest, callback?: (err: AWSError, data: MQ.Types.ListConfigurationsResponse) => void): Request<MQ.Types.ListConfigurationsResponse, AWSError>;
  /**
   * Returns a list of all configurations.
   */
  listConfigurations(callback?: (err: AWSError, data: MQ.Types.ListConfigurationsResponse) => void): Request<MQ.Types.ListConfigurationsResponse, AWSError>;
  /**
   * Lists tags for a resource.
   */
  listTags(params: MQ.Types.ListTagsRequest, callback?: (err: AWSError, data: MQ.Types.ListTagsResponse) => void): Request<MQ.Types.ListTagsResponse, AWSError>;
  /**
   * Lists tags for a resource.
   */
  listTags(callback?: (err: AWSError, data: MQ.Types.ListTagsResponse) => void): Request<MQ.Types.ListTagsResponse, AWSError>;
  /**
   * Returns a list of all ActiveMQ users.
   */
  listUsers(params: MQ.Types.ListUsersRequest, callback?: (err: AWSError, data: MQ.Types.ListUsersResponse) => void): Request<MQ.Types.ListUsersResponse, AWSError>;
  /**
   * Returns a list of all ActiveMQ users.
   */
  listUsers(callback?: (err: AWSError, data: MQ.Types.ListUsersResponse) => void): Request<MQ.Types.ListUsersResponse, AWSError>;
  /**
   * Reboots a broker. Note: This API is asynchronous.
   */
  rebootBroker(params: MQ.Types.RebootBrokerRequest, callback?: (err: AWSError, data: MQ.Types.RebootBrokerResponse) => void): Request<MQ.Types.RebootBrokerResponse, AWSError>;
  /**
   * Reboots a broker. Note: This API is asynchronous.
   */
  rebootBroker(callback?: (err: AWSError, data: MQ.Types.RebootBrokerResponse) => void): Request<MQ.Types.RebootBrokerResponse, AWSError>;
  /**
   * Adds a pending configuration change to a broker.
   */
  updateBroker(params: MQ.Types.UpdateBrokerRequest, callback?: (err: AWSError, data: MQ.Types.UpdateBrokerResponse) => void): Request<MQ.Types.UpdateBrokerResponse, AWSError>;
  /**
   * Adds a pending configuration change to a broker.
   */
  updateBroker(callback?: (err: AWSError, data: MQ.Types.UpdateBrokerResponse) => void): Request<MQ.Types.UpdateBrokerResponse, AWSError>;
  /**
   * Updates the specified configuration.
   */
  updateConfiguration(params: MQ.Types.UpdateConfigurationRequest, callback?: (err: AWSError, data: MQ.Types.UpdateConfigurationResponse) => void): Request<MQ.Types.UpdateConfigurationResponse, AWSError>;
  /**
   * Updates the specified configuration.
   */
  updateConfiguration(callback?: (err: AWSError, data: MQ.Types.UpdateConfigurationResponse) => void): Request<MQ.Types.UpdateConfigurationResponse, AWSError>;
  /**
   * Updates the information for an ActiveMQ user.
   */
  updateUser(params: MQ.Types.UpdateUserRequest, callback?: (err: AWSError, data: MQ.Types.UpdateUserResponse) => void): Request<MQ.Types.UpdateUserResponse, AWSError>;
  /**
   * Updates the information for an ActiveMQ user.
   */
  updateUser(callback?: (err: AWSError, data: MQ.Types.UpdateUserResponse) => void): Request<MQ.Types.UpdateUserResponse, AWSError>;
}
declare namespace MQ {
  export type AuthenticationStrategy = "SIMPLE"|"LDAP"|string;
  export interface AvailabilityZone {
    /**
     * Id for the availability zone.
     */
    Name?: __string;
  }
  export interface BrokerEngineType {
    /**
     * The broker's engine type.
     */
    EngineType?: EngineType;
    /**
     * The list of engine versions.
     */
    EngineVersions?: __listOfEngineVersion;
  }
  export interface BrokerInstance {
    /**
     * The brokers web console URL.
     */
    ConsoleURL?: __string;
    /**
     * The broker's wire-level protocol endpoints.
     */
    Endpoints?: __listOf__string;
    /**
     * The IP address of the Elastic Network Interface (ENI) attached to the broker. Does not apply to RabbitMQ brokers.
     */
    IpAddress?: __string;
  }
  export interface BrokerInstanceOption {
    /**
     * The list of available az.
     */
    AvailabilityZones?: __listOfAvailabilityZone;
    /**
     * The broker's engine type.
     */
    EngineType?: EngineType;
    /**
     * The broker's instance type.
     */
    HostInstanceType?: __string;
    /**
     * The broker's storage type.
     */
    StorageType?: BrokerStorageType;
    /**
     * The list of supported deployment modes.
     */
    SupportedDeploymentModes?: __listOfDeploymentMode;
    /**
     * The list of supported engine versions.
     */
    SupportedEngineVersions?: __listOf__string;
  }
  export type BrokerState = "CREATION_IN_PROGRESS"|"CREATION_FAILED"|"DELETION_IN_PROGRESS"|"RUNNING"|"REBOOT_IN_PROGRESS"|string;
  export type BrokerStorageType = "EBS"|"EFS"|string;
  export interface BrokerSummary {
    /**
     * The broker's Amazon Resource Name (ARN).
     */
    BrokerArn?: __string;
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId?: __string;
    /**
     * The broker's name. This value is unique in your AWS account, 1-50 characters long, and containing only letters, numbers, dashes, and underscores, and must not contain white spaces, brackets, wildcard characters, or special characters.
     */
    BrokerName?: __string;
    /**
     * The broker's status.
     */
    BrokerState?: BrokerState;
    /**
     * The time when the broker was created.
     */
    Created?: __timestampIso8601;
    /**
     * The broker's deployment mode.
     */
    DeploymentMode: DeploymentMode;
    /**
     * The type of broker engine.
     */
    EngineType: EngineType;
    /**
     * The broker's instance type.
     */
    HostInstanceType?: __string;
  }
  export type ChangeType = "CREATE"|"UPDATE"|"DELETE"|string;
  export interface Configuration {
    /**
     * Required. The ARN of the configuration.
     */
    Arn: __string;
    /**
     * Optional. The authentication strategy associated with the configuration. The default is SIMPLE.
     */
    AuthenticationStrategy: AuthenticationStrategy;
    /**
     * Required. The date and time of the configuration revision.
     */
    Created: __timestampIso8601;
    /**
     * Required. The description of the configuration.
     */
    Description: __string;
    /**
     * Required. The type of broker engine. Currently, Amazon MQ supports ACTIVEMQ and RABBITMQ.
     */
    EngineType: EngineType;
    /**
     * Required. The broker engine's version. For a list of supported engine versions, see, Supported engines.
     */
    EngineVersion: __string;
    /**
     * Required. The unique ID that Amazon MQ generates for the configuration.
     */
    Id: __string;
    /**
     * Required. The latest revision of the configuration.
     */
    LatestRevision: ConfigurationRevision;
    /**
     * Required. The name of the configuration. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 1-150 characters long.
     */
    Name: __string;
    /**
     * The list of all tags associated with this configuration.
     */
    Tags?: __mapOf__string;
  }
  export interface ConfigurationId {
    /**
     * Required. The unique ID that Amazon MQ generates for the configuration.
     */
    Id: __string;
    /**
     * The revision number of the configuration.
     */
    Revision?: __integer;
  }
  export interface ConfigurationRevision {
    /**
     * Required. The date and time of the configuration revision.
     */
    Created: __timestampIso8601;
    /**
     * The description of the configuration revision.
     */
    Description?: __string;
    /**
     * Required. The revision number of the configuration.
     */
    Revision: __integer;
  }
  export interface Configurations {
    /**
     * The broker's current configuration.
     */
    Current?: ConfigurationId;
    /**
     * The history of configurations applied to the broker.
     */
    History?: __listOfConfigurationId;
    /**
     * The broker's pending configuration.
     */
    Pending?: ConfigurationId;
  }
  export interface CreateBrokerRequest {
    /**
     * Optional. The authentication strategy used to secure the broker. The default is SIMPLE.
     */
    AuthenticationStrategy?: AuthenticationStrategy;
    /**
     * Enables automatic upgrades to new minor versions for brokers, as new versions are released and supported by Amazon MQ. Automatic upgrades occur during the scheduled maintenance window of the broker or after a manual broker reboot. Set to true by default, if no value is specified.
     */
    AutoMinorVersionUpgrade: __boolean;
    /**
     * Required. The broker's name. This value must be unique in your AWS account, 1-50 characters long, must contain only letters, numbers, dashes, and underscores, and must not contain white spaces, brackets, wildcard characters, or special characters.
     */
    BrokerName: __string;
    /**
     * A list of information about the configuration.
     */
    Configuration?: ConfigurationId;
    /**
     * The unique ID that the requester receives for the created broker. Amazon MQ passes your ID with the API action. Note: We recommend using a Universally Unique Identifier (UUID) for the creatorRequestId. You may omit the creatorRequestId if your application doesn't require idempotency.
     */
    CreatorRequestId?: __string;
    /**
     * Required. The broker's deployment mode.
     */
    DeploymentMode: DeploymentMode;
    /**
     * Encryption options for the broker. Does not apply to RabbitMQ brokers.
     */
    EncryptionOptions?: EncryptionOptions;
    /**
     * Required. The type of broker engine. Currently, Amazon MQ supports ACTIVEMQ and RABBITMQ.
     */
    EngineType: EngineType;
    /**
     * Required. The broker engine's version. For a list of supported engine versions, see Supported engines.
     */
    EngineVersion: __string;
    /**
     * Required. The broker's instance type.
     */
    HostInstanceType: __string;
    /**
     * Optional. The metadata of the LDAP server used to authenticate and authorize connections to the broker. Does not apply to RabbitMQ brokers.
     */
    LdapServerMetadata?: LdapServerMetadataInput;
    /**
     * Enables Amazon CloudWatch logging for brokers.
     */
    Logs?: Logs;
    /**
     * The parameters that determine the WeeklyStartTime.
     */
    MaintenanceWindowStartTime?: WeeklyStartTime;
    /**
     * Enables connections from applications outside of the VPC that hosts the broker's subnets. Set to false by default, if no value is provided.
     */
    PubliclyAccessible: __boolean;
    /**
     * The list of rules (1 minimum, 125 maximum) that authorize connections to brokers.
     */
    SecurityGroups?: __listOf__string;
    /**
     * The broker's storage type.
     */
    StorageType?: BrokerStorageType;
    /**
     * The list of groups that define which subnets and IP ranges the broker can use from different Availability Zones. If you specify more than one subnet, the subnets must be in different Availability Zones. Amazon MQ will not be able to create VPC endpoints for your broker with multiple subnets in the same Availability Zone. A SINGLE_INSTANCE deployment requires one subnet (for example, the default subnet). An ACTIVE_STANDBY_MULTI_AZ Amazon MQ for ActiveMQ deployment requires two subnets. A CLUSTER_MULTI_AZ Amazon MQ for RabbitMQ deployment has no subnet requirements when deployed with public accessibility. Deployment without public accessibility requires at least one subnet. If you specify subnets in a shared VPC for a RabbitMQ broker, the associated VPC to which the specified subnets belong must be owned by your AWS account. Amazon MQ will not be able to create VPC endpoints in VPCs that are not owned by your AWS account.
     */
    SubnetIds?: __listOf__string;
    /**
     * Create tags when creating the broker.
     */
    Tags?: __mapOf__string;
    /**
     * Required. The list of broker users (persons or applications) who can access queues and topics. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long. Amazon MQ for RabbitMQ When you create an Amazon MQ for RabbitMQ broker, one and only one administrative user is accepted and created when a broker is first provisioned. All subsequent broker users are created by making RabbitMQ API calls directly to brokers or via the RabbitMQ web console.
     */
    Users: __listOfUser;
  }
  export interface CreateBrokerResponse {
    /**
     * The broker's Amazon Resource Name (ARN).
     */
    BrokerArn?: __string;
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId?: __string;
  }
  export interface CreateConfigurationRequest {
    /**
     * Optional. The authentication strategy associated with the configuration. The default is SIMPLE.
     */
    AuthenticationStrategy?: AuthenticationStrategy;
    /**
     * Required. The type of broker engine. Currently, Amazon MQ supports ACTIVEMQ and RABBITMQ.
     */
    EngineType: EngineType;
    /**
     * Required. The broker engine's version. For a list of supported engine versions, see Supported engines.
     */
    EngineVersion: __string;
    /**
     * Required. The name of the configuration. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 1-150 characters long.
     */
    Name: __string;
    /**
     * Create tags when creating the configuration.
     */
    Tags?: __mapOf__string;
  }
  export interface CreateConfigurationResponse {
    /**
     * Required. The Amazon Resource Name (ARN) of the configuration.
     */
    Arn?: __string;
    /**
     * Optional. The authentication strategy associated with the configuration. The default is SIMPLE.
     */
    AuthenticationStrategy?: AuthenticationStrategy;
    /**
     * Required. The date and time of the configuration.
     */
    Created?: __timestampIso8601;
    /**
     * Required. The unique ID that Amazon MQ generates for the configuration.
     */
    Id?: __string;
    /**
     * The latest revision of the configuration.
     */
    LatestRevision?: ConfigurationRevision;
    /**
     * Required. The name of the configuration. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 1-150 characters long.
     */
    Name?: __string;
  }
  export interface CreateTagsRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource tag.
     */
    ResourceArn: __string;
    /**
     * The key-value pair for the resource tag.
     */
    Tags?: __mapOf__string;
  }
  export interface CreateUserRequest {
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId: __string;
    /**
     * Enables access to the ActiveMQ Web Console for the ActiveMQ user.
     */
    ConsoleAccess?: __boolean;
    /**
     * The list of groups (20 maximum) to which the ActiveMQ user belongs. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long.
     */
    Groups?: __listOf__string;
    /**
     * Required. The password of the user. This value must be at least 12 characters long, must contain at least 4 unique characters, and must not contain commas, colons, or equal signs (,:=).
     */
    Password: __string;
    /**
     * The username of the ActiveMQ user. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long.
     */
    Username: __string;
  }
  export interface CreateUserResponse {
  }
  export type DayOfWeek = "MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|"SUNDAY"|string;
  export interface DeleteBrokerRequest {
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId: __string;
  }
  export interface DeleteBrokerResponse {
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId?: __string;
  }
  export interface DeleteTagsRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource tag.
     */
    ResourceArn: __string;
    /**
     * An array of tag keys to delete
     */
    TagKeys: __listOf__string;
  }
  export interface DeleteUserRequest {
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId: __string;
    /**
     * The username of the ActiveMQ user. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long.
     */
    Username: __string;
  }
  export interface DeleteUserResponse {
  }
  export type DeploymentMode = "SINGLE_INSTANCE"|"ACTIVE_STANDBY_MULTI_AZ"|"CLUSTER_MULTI_AZ"|string;
  export interface DescribeBrokerEngineTypesRequest {
    /**
     * Filter response by engine type.
     */
    EngineType?: __string;
    /**
     * The maximum number of brokers that Amazon MQ can return per page (20 by default). This value must be an integer from 5 to 100.
     */
    MaxResults?: MaxResults;
    /**
     * The token that specifies the next page of results Amazon MQ should return. To request the first page, leave nextToken empty.
     */
    NextToken?: __string;
  }
  export interface DescribeBrokerEngineTypesResponse {
    /**
     * List of available engine types and versions.
     */
    BrokerEngineTypes?: __listOfBrokerEngineType;
    /**
     * Required. The maximum number of engine types that can be returned per page (20 by default). This value must be an integer from 5 to 100.
     */
    MaxResults?: __integerMin5Max100;
    /**
     * The token that specifies the next page of results Amazon MQ should return. To request the first page, leave nextToken empty.
     */
    NextToken?: __string;
  }
  export interface DescribeBrokerInstanceOptionsRequest {
    /**
     * Filter response by engine type.
     */
    EngineType?: __string;
    /**
     * Filter response by host instance type.
     */
    HostInstanceType?: __string;
    /**
     * The maximum number of brokers that Amazon MQ can return per page (20 by default). This value must be an integer from 5 to 100.
     */
    MaxResults?: MaxResults;
    /**
     * The token that specifies the next page of results Amazon MQ should return. To request the first page, leave nextToken empty.
     */
    NextToken?: __string;
    /**
     * Filter response by storage type.
     */
    StorageType?: __string;
  }
  export interface DescribeBrokerInstanceOptionsResponse {
    /**
     * List of available broker instance options.
     */
    BrokerInstanceOptions?: __listOfBrokerInstanceOption;
    /**
     * Required. The maximum number of instance options that can be returned per page (20 by default). This value must be an integer from 5 to 100.
     */
    MaxResults?: __integerMin5Max100;
    /**
     * The token that specifies the next page of results Amazon MQ should return. To request the first page, leave nextToken empty.
     */
    NextToken?: __string;
  }
  export interface DescribeBrokerRequest {
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId: __string;
  }
  export interface DescribeBrokerResponse {
    /**
     * The authentication strategy used to secure the broker. The default is SIMPLE.
     */
    AuthenticationStrategy?: AuthenticationStrategy;
    /**
     * Enables automatic upgrades to new minor versions for brokers, as new versions are released and supported by Amazon MQ. Automatic upgrades occur during the scheduled maintenance window of the broker or after a manual broker reboot.
     */
    AutoMinorVersionUpgrade?: __boolean;
    /**
     * The broker's Amazon Resource Name (ARN).
     */
    BrokerArn?: __string;
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId?: __string;
    /**
     * A list of information about allocated brokers.
     */
    BrokerInstances?: __listOfBrokerInstance;
    /**
     * The broker's name. This value must be unique in your AWS account, 1-50 characters long, must contain only letters, numbers, dashes, and underscores, and must not contain white spaces, brackets, wildcard characters, or special characters.
     */
    BrokerName?: __string;
    /**
     * The broker's status.
     */
    BrokerState?: BrokerState;
    /**
     * The list of all revisions for the specified configuration.
     */
    Configurations?: Configurations;
    /**
     * The time when the broker was created.
     */
    Created?: __timestampIso8601;
    /**
     * The broker's deployment mode.
     */
    DeploymentMode?: DeploymentMode;
    /**
     * Encryption options for the broker. Does not apply to RabbitMQ brokers.
     */
    EncryptionOptions?: EncryptionOptions;
    /**
     * The type of broker engine. Currently, Amazon MQ supports ACTIVEMQ and RABBITMQ.
     */
    EngineType?: EngineType;
    /**
     * The broker engine's version. For a list of supported engine versions, see Supported engines.
     */
    EngineVersion?: __string;
    /**
     * The broker's instance type.
     */
    HostInstanceType?: __string;
    /**
     * The metadata of the LDAP server used to authenticate and authorize connections to the broker.
     */
    LdapServerMetadata?: LdapServerMetadataOutput;
    /**
     * The list of information about logs currently enabled and pending to be deployed for the specified broker.
     */
    Logs?: LogsSummary;
    /**
     * The parameters that determine the WeeklyStartTime.
     */
    MaintenanceWindowStartTime?: WeeklyStartTime;
    /**
     * The authentication strategy that will be applied when the broker is rebooted. The default is SIMPLE.
     */
    PendingAuthenticationStrategy?: AuthenticationStrategy;
    /**
     * The broker engine version to upgrade to. For a list of supported engine versions, see Supported engines.
     */
    PendingEngineVersion?: __string;
    /**
     * The broker's host instance type to upgrade to. For a list of supported instance types, see Broker instance types.
     */
    PendingHostInstanceType?: __string;
    /**
     * The metadata of the LDAP server that will be used to authenticate and authorize connections to the broker after it is rebooted.
     */
    PendingLdapServerMetadata?: LdapServerMetadataOutput;
    /**
     * The list of pending security groups to authorize connections to brokers.
     */
    PendingSecurityGroups?: __listOf__string;
    /**
     * Enables connections from applications outside of the VPC that hosts the broker's subnets.
     */
    PubliclyAccessible?: __boolean;
    /**
     * The list of rules (1 minimum, 125 maximum) that authorize connections to brokers.
     */
    SecurityGroups?: __listOf__string;
    /**
     * The broker's storage type.
     */
    StorageType?: BrokerStorageType;
    /**
     * The list of groups that define which subnets and IP ranges the broker can use from different Availability Zones.
     */
    SubnetIds?: __listOf__string;
    /**
     * The list of all tags associated with this broker.
     */
    Tags?: __mapOf__string;
    /**
     * The list of all broker usernames for the specified broker.
     */
    Users?: __listOfUserSummary;
  }
  export interface DescribeConfigurationRequest {
    /**
     * The unique ID that Amazon MQ generates for the configuration.
     */
    ConfigurationId: __string;
  }
  export interface DescribeConfigurationResponse {
    /**
     * Required. The ARN of the configuration.
     */
    Arn?: __string;
    /**
     * Optional. The authentication strategy associated with the configuration. The default is SIMPLE.
     */
    AuthenticationStrategy?: AuthenticationStrategy;
    /**
     * Required. The date and time of the configuration revision.
     */
    Created?: __timestampIso8601;
    /**
     * Required. The description of the configuration.
     */
    Description?: __string;
    /**
     * Required. The type of broker engine. Currently, Amazon MQ supports ACTIVEMQ and RABBITMQ.
     */
    EngineType?: EngineType;
    /**
     * Required. The broker engine's version. For a list of supported engine versions, see, Supported engines.
     */
    EngineVersion?: __string;
    /**
     * Required. The unique ID that Amazon MQ generates for the configuration.
     */
    Id?: __string;
    /**
     * Required. The latest revision of the configuration.
     */
    LatestRevision?: ConfigurationRevision;
    /**
     * Required. The name of the configuration. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 1-150 characters long.
     */
    Name?: __string;
    /**
     * The list of all tags associated with this configuration.
     */
    Tags?: __mapOf__string;
  }
  export interface DescribeConfigurationRevisionRequest {
    /**
     * The unique ID that Amazon MQ generates for the configuration.
     */
    ConfigurationId: __string;
    /**
     * The revision of the configuration.
     */
    ConfigurationRevision: __string;
  }
  export interface DescribeConfigurationRevisionResponse {
    /**
     * Required. The unique ID that Amazon MQ generates for the configuration.
     */
    ConfigurationId?: __string;
    /**
     * Required. The date and time of the configuration.
     */
    Created?: __timestampIso8601;
    /**
     * Required. The base64-encoded XML configuration.
     */
    Data?: __string;
    /**
     * The description of the configuration.
     */
    Description?: __string;
  }
  export interface DescribeUserRequest {
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId: __string;
    /**
     * The username of the ActiveMQ user. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long.
     */
    Username: __string;
  }
  export interface DescribeUserResponse {
    /**
     * Required. The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId?: __string;
    /**
     * Enables access to the the ActiveMQ Web Console for the ActiveMQ user.
     */
    ConsoleAccess?: __boolean;
    /**
     * The list of groups (20 maximum) to which the ActiveMQ user belongs. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long.
     */
    Groups?: __listOf__string;
    /**
     * The status of the changes pending for the ActiveMQ user.
     */
    Pending?: UserPendingChanges;
    /**
     * Required. The username of the ActiveMQ user. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long.
     */
    Username?: __string;
  }
  export interface EncryptionOptions {
    /**
     * The customer master key (CMK) to use for the AWS Key Management Service (KMS). This key is used to encrypt your data at rest. If not provided, Amazon MQ will use a default CMK to encrypt your data.
     */
    KmsKeyId?: __string;
    /**
     * Enables the use of an AWS owned CMK using AWS Key Management Service (KMS). Set to true by default, if no value is provided, for example, for RabbitMQ brokers.
     */
    UseAwsOwnedKey: __boolean;
  }
  export type EngineType = "ACTIVEMQ"|"RABBITMQ"|string;
  export interface EngineVersion {
    /**
     * Id for the version.
     */
    Name?: __string;
  }
  export interface LdapServerMetadataInput {
    /**
     * Specifies the location of the LDAP server such as AWS Directory Service for Microsoft Active Directory . Optional failover server.
     */
    Hosts: __listOf__string;
    /**
     * The distinguished name of the node in the directory information tree (DIT) to search for roles or groups. For example, ou=group, ou=corp, dc=corp,
                  dc=example, dc=com.
     */
    RoleBase: __string;
    /**
     * Specifies the LDAP attribute that identifies the group name attribute in the object returned from the group membership query.
     */
    RoleName?: __string;
    /**
     * The LDAP search filter used to find roles within the roleBase. The distinguished name of the user matched by userSearchMatching is substituted into the {0} placeholder in the search filter. The client's username is substituted into the {1} placeholder. For example, if you set this option to (member=uid={1})for the user janedoe, the search filter becomes (member=uid=janedoe) after string substitution. It matches all role entries that have a member attribute equal to uid=janedoe under the subtree selected by the roleBase.
     */
    RoleSearchMatching: __string;
    /**
     * The directory search scope for the role. If set to true, scope is to search the entire subtree.
     */
    RoleSearchSubtree?: __boolean;
    /**
     * Service account password. A service account is an account in your LDAP server that has access to initiate a connection. For example, cn=admin,dc=corp, dc=example,
                  dc=com.
     */
    ServiceAccountPassword: __string;
    /**
     * Service account username. A service account is an account in your LDAP server that has access to initiate a connection. For example, cn=admin,dc=corp, dc=example,
                  dc=com.
     */
    ServiceAccountUsername: __string;
    /**
     * Select a particular subtree of the directory information tree (DIT) to search for user entries. The subtree is specified by a DN, which specifies the base node of the subtree. For example, by setting this option to ou=Users,ou=corp, dc=corp,
                  dc=example, dc=com, the search for user entries is restricted to the subtree beneath ou=Users, ou=corp, dc=corp, dc=example, dc=com.
     */
    UserBase: __string;
    /**
     * Specifies the name of the LDAP attribute for the user group membership.
     */
    UserRoleName?: __string;
    /**
     * The LDAP search filter used to find users within the userBase. The client's username is substituted into the {0} placeholder in the search filter. For example, if this option is set to (uid={0}) and the received username is janedoe, the search filter becomes (uid=janedoe) after string substitution. It will result in matching an entry like uid=janedoe, ou=Users,ou=corp, dc=corp, dc=example,
                  dc=com.
     */
    UserSearchMatching: __string;
    /**
     * The directory search scope for the user. If set to true, scope is to search the entire subtree.
     */
    UserSearchSubtree?: __boolean;
  }
  export interface LdapServerMetadataOutput {
    /**
     * Specifies the location of the LDAP server such as AWS Directory Service for Microsoft Active Directory . Optional failover server.
     */
    Hosts: __listOf__string;
    /**
     * The distinguished name of the node in the directory information tree (DIT) to search for roles or groups. For example, ou=group, ou=corp, dc=corp,
                  dc=example, dc=com.
     */
    RoleBase: __string;
    /**
     * Specifies the LDAP attribute that identifies the group name attribute in the object returned from the group membership query.
     */
    RoleName?: __string;
    /**
     * The LDAP search filter used to find roles within the roleBase. The distinguished name of the user matched by userSearchMatching is substituted into the {0} placeholder in the search filter. The client's username is substituted into the {1} placeholder. For example, if you set this option to (member=uid={1})for the user janedoe, the search filter becomes (member=uid=janedoe) after string substitution. It matches all role entries that have a member attribute equal to uid=janedoe under the subtree selected by the roleBase.
     */
    RoleSearchMatching: __string;
    /**
     * The directory search scope for the role. If set to true, scope is to search the entire subtree.
     */
    RoleSearchSubtree?: __boolean;
    /**
     * Service account username. A service account is an account in your LDAP server that has access to initiate a connection. For example, cn=admin,dc=corp, dc=example,
                  dc=com.
     */
    ServiceAccountUsername: __string;
    /**
     * Select a particular subtree of the directory information tree (DIT) to search for user entries. The subtree is specified by a DN, which specifies the base node of the subtree. For example, by setting this option to ou=Users,ou=corp, dc=corp,
                  dc=example, dc=com, the search for user entries is restricted to the subtree beneath ou=Users, ou=corp, dc=corp, dc=example, dc=com.
     */
    UserBase: __string;
    /**
     * Specifies the name of the LDAP attribute for the user group membership.
     */
    UserRoleName?: __string;
    /**
     * The LDAP search filter used to find users within the userBase. The client's username is substituted into the {0} placeholder in the search filter. For example, if this option is set to (uid={0}) and the received username is janedoe, the search filter becomes (uid=janedoe) after string substitution. It will result in matching an entry like uid=janedoe, ou=Users,ou=corp, dc=corp, dc=example,
               dc=com.
     */
    UserSearchMatching: __string;
    /**
     * The directory search scope for the user. If set to true, scope is to search the entire subtree.
     */
    UserSearchSubtree?: __boolean;
  }
  export interface ListBrokersRequest {
    /**
     * The maximum number of brokers that Amazon MQ can return per page (20 by default). This value must be an integer from 5 to 100.
     */
    MaxResults?: MaxResults;
    /**
     * The token that specifies the next page of results Amazon MQ should return. To request the first page, leave nextToken empty.
     */
    NextToken?: __string;
  }
  export interface ListBrokersResponse {
    /**
     * A list of information about all brokers.
     */
    BrokerSummaries?: __listOfBrokerSummary;
    /**
     * The token that specifies the next page of results Amazon MQ should return. To request the first page, leave nextToken empty.
     */
    NextToken?: __string;
  }
  export interface ListConfigurationRevisionsRequest {
    /**
     * The unique ID that Amazon MQ generates for the configuration.
     */
    ConfigurationId: __string;
    /**
     * The maximum number of brokers that Amazon MQ can return per page (20 by default). This value must be an integer from 5 to 100.
     */
    MaxResults?: MaxResults;
    /**
     * The token that specifies the next page of results Amazon MQ should return. To request the first page, leave nextToken empty.
     */
    NextToken?: __string;
  }
  export interface ListConfigurationRevisionsResponse {
    /**
     * The unique ID that Amazon MQ generates for the configuration.
     */
    ConfigurationId?: __string;
    /**
     * The maximum number of configuration revisions that can be returned per page (20 by default). This value must be an integer from 5 to 100.
     */
    MaxResults?: __integer;
    /**
     * The token that specifies the next page of results Amazon MQ should return. To request the first page, leave nextToken empty.
     */
    NextToken?: __string;
    /**
     * The list of all revisions for the specified configuration.
     */
    Revisions?: __listOfConfigurationRevision;
  }
  export interface ListConfigurationsRequest {
    /**
     * The maximum number of brokers that Amazon MQ can return per page (20 by default). This value must be an integer from 5 to 100.
     */
    MaxResults?: MaxResults;
    /**
     * The token that specifies the next page of results Amazon MQ should return. To request the first page, leave nextToken empty.
     */
    NextToken?: __string;
  }
  export interface ListConfigurationsResponse {
    /**
     * The list of all revisions for the specified configuration.
     */
    Configurations?: __listOfConfiguration;
    /**
     * The maximum number of configurations that Amazon MQ can return per page (20 by default). This value must be an integer from 5 to 100.
     */
    MaxResults?: __integer;
    /**
     * The token that specifies the next page of results Amazon MQ should return. To request the first page, leave nextToken empty.
     */
    NextToken?: __string;
  }
  export interface ListTagsRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource tag.
     */
    ResourceArn: __string;
  }
  export interface ListTagsResponse {
    /**
     * The key-value pair for the resource tag.
     */
    Tags?: __mapOf__string;
  }
  export interface ListUsersRequest {
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId: __string;
    /**
     * The maximum number of brokers that Amazon MQ can return per page (20 by default). This value must be an integer from 5 to 100.
     */
    MaxResults?: MaxResults;
    /**
     * The token that specifies the next page of results Amazon MQ should return. To request the first page, leave nextToken empty.
     */
    NextToken?: __string;
  }
  export interface ListUsersResponse {
    /**
     * Required. The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId?: __string;
    /**
     * Required. The maximum number of ActiveMQ users that can be returned per page (20 by default). This value must be an integer from 5 to 100.
     */
    MaxResults?: __integerMin5Max100;
    /**
     * The token that specifies the next page of results Amazon MQ should return. To request the first page, leave nextToken empty.
     */
    NextToken?: __string;
    /**
     * Required. The list of all ActiveMQ usernames for the specified broker. Does not apply to RabbitMQ brokers.
     */
    Users?: __listOfUserSummary;
  }
  export interface Logs {
    /**
     * Enables audit logging. Every user management action made using JMX or the ActiveMQ Web Console is logged. Does not apply to RabbitMQ brokers.
     */
    Audit?: __boolean;
    /**
     * Enables general logging.
     */
    General?: __boolean;
  }
  export interface LogsSummary {
    /**
     * Enables audit logging. Every user management action made using JMX or the ActiveMQ Web Console is logged.
     */
    Audit?: __boolean;
    /**
     * The location of the CloudWatch Logs log group where audit logs are sent.
     */
    AuditLogGroup?: __string;
    /**
     * Enables general logging.
     */
    General: __boolean;
    /**
     * The location of the CloudWatch Logs log group where general logs are sent.
     */
    GeneralLogGroup: __string;
    /**
     * The list of information about logs pending to be deployed for the specified broker.
     */
    Pending?: PendingLogs;
  }
  export type MaxResults = number;
  export interface PendingLogs {
    /**
     * Enables audit logging. Every user management action made using JMX or the ActiveMQ Web Console is logged.
     */
    Audit?: __boolean;
    /**
     * Enables general logging.
     */
    General?: __boolean;
  }
  export interface RebootBrokerRequest {
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId: __string;
  }
  export interface RebootBrokerResponse {
  }
  export interface SanitizationWarning {
    /**
     * The name of the XML attribute that has been sanitized.
     */
    AttributeName?: __string;
    /**
     * The name of the XML element that has been sanitized.
     */
    ElementName?: __string;
    /**
     * Required. The reason for which the XML elements or attributes were sanitized.
     */
    Reason: SanitizationWarningReason;
  }
  export type SanitizationWarningReason = "DISALLOWED_ELEMENT_REMOVED"|"DISALLOWED_ATTRIBUTE_REMOVED"|"INVALID_ATTRIBUTE_VALUE_REMOVED"|string;
  export interface UpdateBrokerRequest {
    /**
     * Optional. The authentication strategy used to secure the broker. The default is SIMPLE.
     */
    AuthenticationStrategy?: AuthenticationStrategy;
    /**
     * Enables automatic upgrades to new minor versions for brokers, as new versions are released and supported by Amazon MQ. Automatic upgrades occur during the scheduled maintenance window of the broker or after a manual broker reboot.
     */
    AutoMinorVersionUpgrade?: __boolean;
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId: __string;
    /**
     * A list of information about the configuration.
     */
    Configuration?: ConfigurationId;
    /**
     * The broker engine version. For a list of supported engine versions, see Supported engines.
     */
    EngineVersion?: __string;
    /**
     * The broker's host instance type to upgrade to. For a list of supported instance types, see Broker instance types.
     */
    HostInstanceType?: __string;
    /**
     * Optional. The metadata of the LDAP server used to authenticate and authorize connections to the broker. Does not apply to RabbitMQ brokers.
     */
    LdapServerMetadata?: LdapServerMetadataInput;
    /**
     * Enables Amazon CloudWatch logging for brokers.
     */
    Logs?: Logs;
    /**
     * The parameters that determine the WeeklyStartTime.
     */
    MaintenanceWindowStartTime?: WeeklyStartTime;
    /**
     * The list of security groups (1 minimum, 5 maximum) that authorizes connections to brokers.
     */
    SecurityGroups?: __listOf__string;
  }
  export interface UpdateBrokerResponse {
    /**
     * Optional. The authentication strategy used to secure the broker. The default is SIMPLE.
     */
    AuthenticationStrategy?: AuthenticationStrategy;
    /**
     * The new boolean value that specifies whether broker engines automatically upgrade to new minor versions as new versions are released and supported by Amazon MQ.
     */
    AutoMinorVersionUpgrade?: __boolean;
    /**
     * Required. The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId?: __string;
    /**
     * The ID of the updated configuration.
     */
    Configuration?: ConfigurationId;
    /**
     * The broker engine version to upgrade to. For a list of supported engine versions, see Supported engines.
     */
    EngineVersion?: __string;
    /**
     * The broker's host instance type to upgrade to. For a list of supported instance types, see Broker instance types.
     */
    HostInstanceType?: __string;
    /**
     * Optional. The metadata of the LDAP server used to authenticate and authorize connections to the broker. Does not apply to RabbitMQ brokers.
     */
    LdapServerMetadata?: LdapServerMetadataOutput;
    /**
     * The list of information about logs to be enabled for the specified broker.
     */
    Logs?: Logs;
    /**
     * The parameters that determine the WeeklyStartTime.
     */
    MaintenanceWindowStartTime?: WeeklyStartTime;
    /**
     * The list of security groups (1 minimum, 5 maximum) that authorizes connections to brokers.
     */
    SecurityGroups?: __listOf__string;
  }
  export interface UpdateConfigurationRequest {
    /**
     * The unique ID that Amazon MQ generates for the configuration.
     */
    ConfigurationId: __string;
    /**
     * Required. The base64-encoded XML configuration.
     */
    Data: __string;
    /**
     * The description of the configuration.
     */
    Description?: __string;
  }
  export interface UpdateConfigurationResponse {
    /**
     * Required. The Amazon Resource Name (ARN) of the configuration.
     */
    Arn?: __string;
    /**
     * Required. The date and time of the configuration.
     */
    Created?: __timestampIso8601;
    /**
     * Required. The unique ID that Amazon MQ generates for the configuration.
     */
    Id?: __string;
    /**
     * The latest revision of the configuration.
     */
    LatestRevision?: ConfigurationRevision;
    /**
     * Required. The name of the configuration. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 1-150 characters long.
     */
    Name?: __string;
    /**
     * The list of the first 20 warnings about the configuration XML elements or attributes that were sanitized.
     */
    Warnings?: __listOfSanitizationWarning;
  }
  export interface UpdateUserRequest {
    /**
     * The unique ID that Amazon MQ generates for the broker.
     */
    BrokerId: __string;
    /**
     * Enables access to the the ActiveMQ Web Console for the ActiveMQ user.
     */
    ConsoleAccess?: __boolean;
    /**
     * The list of groups (20 maximum) to which the ActiveMQ user belongs. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long.
     */
    Groups?: __listOf__string;
    /**
     * The password of the user. This value must be at least 12 characters long, must contain at least 4 unique characters, and must not contain commas, colons, or equal signs (,:=).
     */
    Password?: __string;
    /**
     * The username of the ActiveMQ user. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long.
     */
    Username: __string;
  }
  export interface UpdateUserResponse {
  }
  export interface User {
    /**
     * Enables access to the ActiveMQ Web Console for the ActiveMQ user. Does not apply to RabbitMQ brokers.
     */
    ConsoleAccess?: __boolean;
    /**
     * The list of groups (20 maximum) to which the ActiveMQ user belongs. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long. Does not apply to RabbitMQ brokers.
     */
    Groups?: __listOf__string;
    /**
     * Required. The password of the user. This value must be at least 12 characters long, must contain at least 4 unique characters, and must not contain commas, colons, or equal signs (,:=).
     */
    Password: __string;
    /**
     * important>Amazon MQ for ActiveMQ For ActiveMQ brokers, this value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long./important> Amazon MQ for RabbitMQ For RabbitMQ brokers, this value can contain only alphanumeric characters, dashes, periods, underscores (- . _). This value must not contain a tilde (~) character. Amazon MQ prohibts using guest as a valid usename. This value must be 2-100 characters long.
     */
    Username: __string;
  }
  export interface UserPendingChanges {
    /**
     * Enables access to the the ActiveMQ Web Console for the ActiveMQ user.
     */
    ConsoleAccess?: __boolean;
    /**
     * The list of groups (20 maximum) to which the ActiveMQ user belongs. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long.
     */
    Groups?: __listOf__string;
    /**
     * Required. The type of change pending for the ActiveMQ user.
     */
    PendingChange: ChangeType;
  }
  export interface UserSummary {
    /**
     * The type of change pending for the broker user.
     */
    PendingChange?: ChangeType;
    /**
     * Required. The username of the broker user. This value can contain only alphanumeric characters, dashes, periods, underscores, and tildes (- . _ ~). This value must be 2-100 characters long.
     */
    Username: __string;
  }
  export interface WeeklyStartTime {
    /**
     * Required. The day of the week.
     */
    DayOfWeek: DayOfWeek;
    /**
     * Required. The time, in 24-hour format.
     */
    TimeOfDay: __string;
    /**
     * The time zone, UTC by default, in either the Country/City format, or the UTC offset format.
     */
    TimeZone?: __string;
  }
  export type __boolean = boolean;
  export type __integer = number;
  export type __integerMin5Max100 = number;
  export type __listOfAvailabilityZone = AvailabilityZone[];
  export type __listOfBrokerEngineType = BrokerEngineType[];
  export type __listOfBrokerInstance = BrokerInstance[];
  export type __listOfBrokerInstanceOption = BrokerInstanceOption[];
  export type __listOfBrokerSummary = BrokerSummary[];
  export type __listOfConfiguration = Configuration[];
  export type __listOfConfigurationId = ConfigurationId[];
  export type __listOfConfigurationRevision = ConfigurationRevision[];
  export type __listOfDeploymentMode = DeploymentMode[];
  export type __listOfEngineVersion = EngineVersion[];
  export type __listOfSanitizationWarning = SanitizationWarning[];
  export type __listOfUser = User[];
  export type __listOfUserSummary = UserSummary[];
  export type __listOf__string = __string[];
  export type __mapOf__string = {[key: string]: __string};
  export type __string = string;
  export type __timestampIso8601 = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-11-27"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MQ client.
   */
  export import Types = MQ;
}
export = MQ;
