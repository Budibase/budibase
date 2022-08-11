import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class KafkaConnect extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: KafkaConnect.Types.ClientConfiguration)
  config: Config & KafkaConnect.Types.ClientConfiguration;
  /**
   * Creates a connector using the specified properties.
   */
  createConnector(params: KafkaConnect.Types.CreateConnectorRequest, callback?: (err: AWSError, data: KafkaConnect.Types.CreateConnectorResponse) => void): Request<KafkaConnect.Types.CreateConnectorResponse, AWSError>;
  /**
   * Creates a connector using the specified properties.
   */
  createConnector(callback?: (err: AWSError, data: KafkaConnect.Types.CreateConnectorResponse) => void): Request<KafkaConnect.Types.CreateConnectorResponse, AWSError>;
  /**
   * Creates a custom plugin using the specified properties.
   */
  createCustomPlugin(params: KafkaConnect.Types.CreateCustomPluginRequest, callback?: (err: AWSError, data: KafkaConnect.Types.CreateCustomPluginResponse) => void): Request<KafkaConnect.Types.CreateCustomPluginResponse, AWSError>;
  /**
   * Creates a custom plugin using the specified properties.
   */
  createCustomPlugin(callback?: (err: AWSError, data: KafkaConnect.Types.CreateCustomPluginResponse) => void): Request<KafkaConnect.Types.CreateCustomPluginResponse, AWSError>;
  /**
   * Creates a worker configuration using the specified properties.
   */
  createWorkerConfiguration(params: KafkaConnect.Types.CreateWorkerConfigurationRequest, callback?: (err: AWSError, data: KafkaConnect.Types.CreateWorkerConfigurationResponse) => void): Request<KafkaConnect.Types.CreateWorkerConfigurationResponse, AWSError>;
  /**
   * Creates a worker configuration using the specified properties.
   */
  createWorkerConfiguration(callback?: (err: AWSError, data: KafkaConnect.Types.CreateWorkerConfigurationResponse) => void): Request<KafkaConnect.Types.CreateWorkerConfigurationResponse, AWSError>;
  /**
   * Deletes the specified connector.
   */
  deleteConnector(params: KafkaConnect.Types.DeleteConnectorRequest, callback?: (err: AWSError, data: KafkaConnect.Types.DeleteConnectorResponse) => void): Request<KafkaConnect.Types.DeleteConnectorResponse, AWSError>;
  /**
   * Deletes the specified connector.
   */
  deleteConnector(callback?: (err: AWSError, data: KafkaConnect.Types.DeleteConnectorResponse) => void): Request<KafkaConnect.Types.DeleteConnectorResponse, AWSError>;
  /**
   * Returns summary information about the connector.
   */
  describeConnector(params: KafkaConnect.Types.DescribeConnectorRequest, callback?: (err: AWSError, data: KafkaConnect.Types.DescribeConnectorResponse) => void): Request<KafkaConnect.Types.DescribeConnectorResponse, AWSError>;
  /**
   * Returns summary information about the connector.
   */
  describeConnector(callback?: (err: AWSError, data: KafkaConnect.Types.DescribeConnectorResponse) => void): Request<KafkaConnect.Types.DescribeConnectorResponse, AWSError>;
  /**
   * A summary description of the custom plugin.
   */
  describeCustomPlugin(params: KafkaConnect.Types.DescribeCustomPluginRequest, callback?: (err: AWSError, data: KafkaConnect.Types.DescribeCustomPluginResponse) => void): Request<KafkaConnect.Types.DescribeCustomPluginResponse, AWSError>;
  /**
   * A summary description of the custom plugin.
   */
  describeCustomPlugin(callback?: (err: AWSError, data: KafkaConnect.Types.DescribeCustomPluginResponse) => void): Request<KafkaConnect.Types.DescribeCustomPluginResponse, AWSError>;
  /**
   * Returns information about a worker configuration.
   */
  describeWorkerConfiguration(params: KafkaConnect.Types.DescribeWorkerConfigurationRequest, callback?: (err: AWSError, data: KafkaConnect.Types.DescribeWorkerConfigurationResponse) => void): Request<KafkaConnect.Types.DescribeWorkerConfigurationResponse, AWSError>;
  /**
   * Returns information about a worker configuration.
   */
  describeWorkerConfiguration(callback?: (err: AWSError, data: KafkaConnect.Types.DescribeWorkerConfigurationResponse) => void): Request<KafkaConnect.Types.DescribeWorkerConfigurationResponse, AWSError>;
  /**
   * Returns a list of all the connectors in this account and Region. The list is limited to connectors whose name starts with the specified prefix. The response also includes a description of each of the listed connectors.
   */
  listConnectors(params: KafkaConnect.Types.ListConnectorsRequest, callback?: (err: AWSError, data: KafkaConnect.Types.ListConnectorsResponse) => void): Request<KafkaConnect.Types.ListConnectorsResponse, AWSError>;
  /**
   * Returns a list of all the connectors in this account and Region. The list is limited to connectors whose name starts with the specified prefix. The response also includes a description of each of the listed connectors.
   */
  listConnectors(callback?: (err: AWSError, data: KafkaConnect.Types.ListConnectorsResponse) => void): Request<KafkaConnect.Types.ListConnectorsResponse, AWSError>;
  /**
   * Returns a list of all of the custom plugins in this account and Region.
   */
  listCustomPlugins(params: KafkaConnect.Types.ListCustomPluginsRequest, callback?: (err: AWSError, data: KafkaConnect.Types.ListCustomPluginsResponse) => void): Request<KafkaConnect.Types.ListCustomPluginsResponse, AWSError>;
  /**
   * Returns a list of all of the custom plugins in this account and Region.
   */
  listCustomPlugins(callback?: (err: AWSError, data: KafkaConnect.Types.ListCustomPluginsResponse) => void): Request<KafkaConnect.Types.ListCustomPluginsResponse, AWSError>;
  /**
   * Returns a list of all of the worker configurations in this account and Region.
   */
  listWorkerConfigurations(params: KafkaConnect.Types.ListWorkerConfigurationsRequest, callback?: (err: AWSError, data: KafkaConnect.Types.ListWorkerConfigurationsResponse) => void): Request<KafkaConnect.Types.ListWorkerConfigurationsResponse, AWSError>;
  /**
   * Returns a list of all of the worker configurations in this account and Region.
   */
  listWorkerConfigurations(callback?: (err: AWSError, data: KafkaConnect.Types.ListWorkerConfigurationsResponse) => void): Request<KafkaConnect.Types.ListWorkerConfigurationsResponse, AWSError>;
  /**
   * Updates the specified connector.
   */
  updateConnector(params: KafkaConnect.Types.UpdateConnectorRequest, callback?: (err: AWSError, data: KafkaConnect.Types.UpdateConnectorResponse) => void): Request<KafkaConnect.Types.UpdateConnectorResponse, AWSError>;
  /**
   * Updates the specified connector.
   */
  updateConnector(callback?: (err: AWSError, data: KafkaConnect.Types.UpdateConnectorResponse) => void): Request<KafkaConnect.Types.UpdateConnectorResponse, AWSError>;
}
declare namespace KafkaConnect {
  export interface ApacheKafkaCluster {
    /**
     * The bootstrap servers of the cluster.
     */
    bootstrapServers: __string;
    /**
     * Details of an Amazon VPC which has network connectivity to the Apache Kafka cluster.
     */
    vpc: Vpc;
  }
  export interface ApacheKafkaClusterDescription {
    /**
     * The bootstrap servers of the cluster.
     */
    bootstrapServers?: __string;
    /**
     * Details of an Amazon VPC which has network connectivity to the Apache Kafka cluster.
     */
    vpc?: VpcDescription;
  }
  export interface AutoScaling {
    /**
     * The maximum number of workers allocated to the connector.
     */
    maxWorkerCount: __integerMin1Max10;
    /**
     * The number of microcontroller units (MCUs) allocated to each connector worker. The valid values are 1,2,4,8.
     */
    mcuCount: __integerMin1Max8;
    /**
     * The minimum number of workers allocated to the connector.
     */
    minWorkerCount: __integerMin1Max10;
    /**
     * The sacle-in policy for the connector.
     */
    scaleInPolicy?: ScaleInPolicy;
    /**
     * The sacle-out policy for the connector.
     */
    scaleOutPolicy?: ScaleOutPolicy;
  }
  export interface AutoScalingDescription {
    /**
     * The maximum number of workers allocated to the connector.
     */
    maxWorkerCount?: __integer;
    /**
     * The number of microcontroller units (MCUs) allocated to each connector worker. The valid values are 1,2,4,8.
     */
    mcuCount?: __integer;
    /**
     * The minimum number of workers allocated to the connector.
     */
    minWorkerCount?: __integer;
    /**
     * The sacle-in policy for the connector.
     */
    scaleInPolicy?: ScaleInPolicyDescription;
    /**
     * The sacle-out policy for the connector.&gt;
     */
    scaleOutPolicy?: ScaleOutPolicyDescription;
  }
  export interface AutoScalingUpdate {
    /**
     * The target maximum number of workers allocated to the connector.
     */
    maxWorkerCount: __integerMin1Max10;
    /**
     * The target number of microcontroller units (MCUs) allocated to each connector worker. The valid values are 1,2,4,8.
     */
    mcuCount: __integerMin1Max8;
    /**
     * The target minimum number of workers allocated to the connector.
     */
    minWorkerCount: __integerMin1Max10;
    /**
     * The target sacle-in policy for the connector.
     */
    scaleInPolicy: ScaleInPolicyUpdate;
    /**
     * The target sacle-out policy for the connector.
     */
    scaleOutPolicy: ScaleOutPolicyUpdate;
  }
  export interface Capacity {
    /**
     * Information about the auto scaling parameters for the connector.
     */
    autoScaling?: AutoScaling;
    /**
     * Details about a fixed capacity allocated to a connector.
     */
    provisionedCapacity?: ProvisionedCapacity;
  }
  export interface CapacityDescription {
    /**
     * Describes the connector's auto scaling capacity.
     */
    autoScaling?: AutoScalingDescription;
    /**
     * Describes a connector's provisioned capacity.
     */
    provisionedCapacity?: ProvisionedCapacityDescription;
  }
  export interface CapacityUpdate {
    /**
     * The target auto scaling setting.
     */
    autoScaling?: AutoScalingUpdate;
    /**
     * The target settings for provisioned capacity.
     */
    provisionedCapacity?: ProvisionedCapacityUpdate;
  }
  export interface CloudWatchLogsLogDelivery {
    /**
     * Whether log delivery to Amazon CloudWatch Logs is enabled.
     */
    enabled: __boolean;
    /**
     * The name of the CloudWatch log group that is the destination for log delivery.
     */
    logGroup?: __string;
  }
  export interface CloudWatchLogsLogDeliveryDescription {
    /**
     * Whether log delivery to Amazon CloudWatch Logs is enabled.
     */
    enabled?: __boolean;
    /**
     * The name of the CloudWatch log group that is the destination for log delivery.
     */
    logGroup?: __string;
  }
  export type ConnectorState = "RUNNING"|"CREATING"|"UPDATING"|"DELETING"|"FAILED"|string;
  export interface ConnectorSummary {
    /**
     * The connector's compute capacity settings.
     */
    capacity?: CapacityDescription;
    /**
     * The Amazon Resource Name (ARN) of the connector.
     */
    connectorArn?: __string;
    /**
     * The description of the connector.
     */
    connectorDescription?: __string;
    /**
     * The name of the connector.
     */
    connectorName?: __string;
    /**
     * The state of the connector.
     */
    connectorState?: ConnectorState;
    /**
     * The time that the connector was created.
     */
    creationTime?: __timestampIso8601;
    /**
     * The current version of the connector.
     */
    currentVersion?: __string;
    /**
     * The details of the Apache Kafka cluster to which the connector is connected.
     */
    kafkaCluster?: KafkaClusterDescription;
    /**
     * The type of client authentication used to connect to the Apache Kafka cluster. The value is NONE when no client authentication is used.
     */
    kafkaClusterClientAuthentication?: KafkaClusterClientAuthenticationDescription;
    /**
     * Details of encryption in transit to the Apache Kafka cluster.
     */
    kafkaClusterEncryptionInTransit?: KafkaClusterEncryptionInTransitDescription;
    /**
     * The version of Kafka Connect. It has to be compatible with both the Apache Kafka cluster's version and the plugins.
     */
    kafkaConnectVersion?: __string;
    /**
     * The settings for delivering connector logs to Amazon CloudWatch Logs.
     */
    logDelivery?: LogDeliveryDescription;
    /**
     * Specifies which plugins were used for this connector.
     */
    plugins?: __listOfPluginDescription;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used by the connector to access Amazon Web Services resources.
     */
    serviceExecutionRoleArn?: __string;
    /**
     * The worker configurations that are in use with the connector.
     */
    workerConfiguration?: WorkerConfigurationDescription;
  }
  export interface CreateConnectorRequest {
    /**
     * Information about the capacity allocated to the connector. Exactly one of the two properties must be specified.
     */
    capacity: Capacity;
    /**
     * A map of keys to values that represent the configuration for the connector.
     */
    connectorConfiguration: __mapOf__string;
    /**
     * A summary description of the connector.
     */
    connectorDescription?: __stringMax1024;
    /**
     * The name of the connector.
     */
    connectorName: __stringMin1Max128;
    /**
     * Specifies which Apache Kafka cluster to connect to.
     */
    kafkaCluster: KafkaCluster;
    /**
     * Details of the client authentication used by the Apache Kafka cluster.
     */
    kafkaClusterClientAuthentication: KafkaClusterClientAuthentication;
    /**
     * Details of encryption in transit to the Apache Kafka cluster.
     */
    kafkaClusterEncryptionInTransit: KafkaClusterEncryptionInTransit;
    /**
     * The version of Kafka Connect. It has to be compatible with both the Apache Kafka cluster's version and the plugins.
     */
    kafkaConnectVersion: __string;
    /**
     * Details about log delivery.
     */
    logDelivery?: LogDelivery;
    /**
     * Specifies which plugins to use for the connector.
     */
    plugins: __listOfPlugin;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used by the connector to access the Amazon Web Services resources that it needs. The types of resources depends on the logic of the connector. For example, a connector that has Amazon S3 as a destination must have permissions that allow it to write to the S3 destination bucket.
     */
    serviceExecutionRoleArn: __string;
    /**
     * Specifies which worker configuration to use with the connector.
     */
    workerConfiguration?: WorkerConfiguration;
  }
  export interface CreateConnectorResponse {
    /**
     * The Amazon Resource Name (ARN) that Amazon assigned to the connector.
     */
    connectorArn?: __string;
    /**
     * The name of the connector.
     */
    connectorName?: __string;
    /**
     * The state of the connector.
     */
    connectorState?: ConnectorState;
  }
  export interface CreateCustomPluginRequest {
    /**
     * The type of the plugin file.
     */
    contentType: CustomPluginContentType;
    /**
     * A summary description of the custom plugin.
     */
    description?: __stringMax1024;
    /**
     * Information about the location of a custom plugin.
     */
    location: CustomPluginLocation;
    /**
     * The name of the custom plugin.
     */
    name: __stringMin1Max128;
  }
  export interface CreateCustomPluginResponse {
    /**
     * The Amazon Resource Name (ARN) that Amazon assigned to the custom plugin.
     */
    customPluginArn?: __string;
    /**
     * The state of the custom plugin.
     */
    customPluginState?: CustomPluginState;
    /**
     * The name of the custom plugin.
     */
    name?: __string;
    /**
     * The revision of the custom plugin.
     */
    revision?: __long;
  }
  export interface CreateWorkerConfigurationRequest {
    /**
     * A summary description of the worker configuration.
     */
    description?: __stringMax1024;
    /**
     * The name of the worker configuration.
     */
    name: __stringMin1Max128;
    /**
     * Base64 encoded contents of connect-distributed.properties file.
     */
    propertiesFileContent: __string;
  }
  export interface CreateWorkerConfigurationResponse {
    /**
     * The time that the worker configuration was created.
     */
    creationTime?: __timestampIso8601;
    /**
     * The latest revision of the worker configuration.
     */
    latestRevision?: WorkerConfigurationRevisionSummary;
    /**
     * The name of the worker configuration.
     */
    name?: __string;
    /**
     * The Amazon Resource Name (ARN) that Amazon assigned to the worker configuration.
     */
    workerConfigurationArn?: __string;
  }
  export interface CustomPlugin {
    /**
     * The Amazon Resource Name (ARN) of the custom plugin.
     */
    customPluginArn: __string;
    /**
     * The revision of the custom plugin.
     */
    revision: __longMin1;
  }
  export type CustomPluginContentType = "JAR"|"ZIP"|string;
  export interface CustomPluginDescription {
    /**
     * The Amazon Resource Name (ARN) of the custom plugin.
     */
    customPluginArn?: __string;
    /**
     * The revision of the custom plugin.
     */
    revision?: __long;
  }
  export interface CustomPluginFileDescription {
    /**
     * The hex-encoded MD5 checksum of the custom plugin file. You can use it to validate the file.
     */
    fileMd5?: __string;
    /**
     * The size in bytes of the custom plugin file. You can use it to validate the file.
     */
    fileSize?: __long;
  }
  export interface CustomPluginLocation {
    /**
     * The S3 bucket Amazon Resource Name (ARN), file key, and object version of the plugin file stored in Amazon S3.
     */
    s3Location: S3Location;
  }
  export interface CustomPluginLocationDescription {
    /**
     * The S3 bucket Amazon Resource Name (ARN), file key, and object version of the plugin file stored in Amazon S3.
     */
    s3Location?: S3LocationDescription;
  }
  export interface CustomPluginRevisionSummary {
    /**
     * The format of the plugin file.
     */
    contentType?: CustomPluginContentType;
    /**
     * The time that the custom plugin was created.
     */
    creationTime?: __timestampIso8601;
    /**
     * The description of the custom plugin.
     */
    description?: __string;
    /**
     * Details about the custom plugin file.
     */
    fileDescription?: CustomPluginFileDescription;
    /**
     * Information about the location of the custom plugin.
     */
    location?: CustomPluginLocationDescription;
    /**
     * The revision of the custom plugin.
     */
    revision?: __long;
  }
  export type CustomPluginState = "CREATING"|"CREATE_FAILED"|"ACTIVE"|"UPDATING"|"UPDATE_FAILED"|"DELETING"|string;
  export interface CustomPluginSummary {
    /**
     * The time that the custom plugin was created.
     */
    creationTime?: __timestampIso8601;
    /**
     * The Amazon Resource Name (ARN) of the custom plugin.
     */
    customPluginArn?: __string;
    /**
     * The state of the custom plugin.
     */
    customPluginState?: CustomPluginState;
    /**
     * A description of the custom plugin.
     */
    description?: __string;
    /**
     * The latest revision of the custom plugin.
     */
    latestRevision?: CustomPluginRevisionSummary;
    /**
     * The name of the custom plugin.
     */
    name?: __string;
  }
  export interface DeleteConnectorRequest {
    /**
     * The Amazon Resource Name (ARN) of the connector that you want to delete.
     */
    connectorArn: __string;
    /**
     * The current version of the connector that you want to delete.
     */
    currentVersion?: __string;
  }
  export interface DeleteConnectorResponse {
    /**
     * The Amazon Resource Name (ARN) of the connector that you requested to delete.
     */
    connectorArn?: __string;
    /**
     * The state of the connector that you requested to delete.
     */
    connectorState?: ConnectorState;
  }
  export interface DescribeConnectorRequest {
    /**
     * The Amazon Resource Name (ARN) of the connector that you want to describe.
     */
    connectorArn: __string;
  }
  export interface DescribeConnectorResponse {
    /**
     * Information about the capacity of the connector, whether it is auto scaled or provisioned.
     */
    capacity?: CapacityDescription;
    /**
     * The Amazon Resource Name (ARN) of the connector.
     */
    connectorArn?: __string;
    /**
     * A map of keys to values that represent the configuration for the connector.
     */
    connectorConfiguration?: __mapOf__string;
    /**
     * A summary description of the connector.
     */
    connectorDescription?: __string;
    /**
     * The name of the connector.
     */
    connectorName?: __string;
    /**
     * The state of the connector.
     */
    connectorState?: ConnectorState;
    /**
     * The time the connector was created.
     */
    creationTime?: __timestampIso8601;
    /**
     * The current version of the connector.
     */
    currentVersion?: __string;
    /**
     * The Apache Kafka cluster that the connector is connected to.
     */
    kafkaCluster?: KafkaClusterDescription;
    /**
     * The type of client authentication used to connect to the Apache Kafka cluster. The value is NONE when no client authentication is used.
     */
    kafkaClusterClientAuthentication?: KafkaClusterClientAuthenticationDescription;
    /**
     * Details of encryption in transit to the Apache Kafka cluster.
     */
    kafkaClusterEncryptionInTransit?: KafkaClusterEncryptionInTransitDescription;
    /**
     * The version of Kafka Connect. It has to be compatible with both the Apache Kafka cluster's version and the plugins.
     */
    kafkaConnectVersion?: __string;
    /**
     * Details about delivering logs to Amazon CloudWatch Logs.
     */
    logDelivery?: LogDeliveryDescription;
    /**
     * Specifies which plugins were used for this connector.
     */
    plugins?: __listOfPluginDescription;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used by the connector to access Amazon Web Services resources.
     */
    serviceExecutionRoleArn?: __string;
    /**
     * Specifies which worker configuration was used for the connector.
     */
    workerConfiguration?: WorkerConfigurationDescription;
  }
  export interface DescribeCustomPluginRequest {
    /**
     * Returns information about a custom plugin.
     */
    customPluginArn: __string;
  }
  export interface DescribeCustomPluginResponse {
    /**
     * The time that the custom plugin was created.
     */
    creationTime?: __timestampIso8601;
    /**
     * The Amazon Resource Name (ARN) of the custom plugin.
     */
    customPluginArn?: __string;
    /**
     * The state of the custom plugin.
     */
    customPluginState?: CustomPluginState;
    /**
     * The description of the custom plugin.
     */
    description?: __string;
    /**
     * The latest successfully created revision of the custom plugin. If there are no successfully created revisions, this field will be absent.
     */
    latestRevision?: CustomPluginRevisionSummary;
    /**
     * The name of the custom plugin.
     */
    name?: __string;
  }
  export interface DescribeWorkerConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the worker configuration that you want to get information about.
     */
    workerConfigurationArn: __string;
  }
  export interface DescribeWorkerConfigurationResponse {
    /**
     * The time that the worker configuration was created.
     */
    creationTime?: __timestampIso8601;
    /**
     * The description of the worker configuration.
     */
    description?: __string;
    /**
     * The latest revision of the custom configuration.
     */
    latestRevision?: WorkerConfigurationRevisionDescription;
    /**
     * The name of the worker configuration.
     */
    name?: __string;
    /**
     * The Amazon Resource Name (ARN) of the custom configuration.
     */
    workerConfigurationArn?: __string;
  }
  export interface FirehoseLogDelivery {
    /**
     * The name of the Kinesis Data Firehose delivery stream that is the destination for log delivery.
     */
    deliveryStream?: __string;
    /**
     * Specifies whether connector logs get delivered to Amazon Kinesis Data Firehose.
     */
    enabled: __boolean;
  }
  export interface FirehoseLogDeliveryDescription {
    /**
     * The name of the Kinesis Data Firehose delivery stream that is the destination for log delivery.
     */
    deliveryStream?: __string;
    /**
     * Specifies whether connector logs get delivered to Amazon Kinesis Data Firehose.
     */
    enabled?: __boolean;
  }
  export interface KafkaCluster {
    /**
     * The Apache Kafka cluster to which the connector is connected.
     */
    apacheKafkaCluster: ApacheKafkaCluster;
  }
  export interface KafkaClusterClientAuthentication {
    /**
     * The type of client authentication used to connect to the Apache Kafka cluster. Value NONE means that no client authentication is used.
     */
    authenticationType: KafkaClusterClientAuthenticationType;
  }
  export interface KafkaClusterClientAuthenticationDescription {
    /**
     * The type of client authentication used to connect to the Apache Kafka cluster. Value NONE means that no client authentication is used.
     */
    authenticationType?: KafkaClusterClientAuthenticationType;
  }
  export type KafkaClusterClientAuthenticationType = "NONE"|"IAM"|string;
  export interface KafkaClusterDescription {
    /**
     * The Apache Kafka cluster to which the connector is connected.
     */
    apacheKafkaCluster?: ApacheKafkaClusterDescription;
  }
  export interface KafkaClusterEncryptionInTransit {
    /**
     * The type of encryption in transit to the Apache Kafka cluster.
     */
    encryptionType: KafkaClusterEncryptionInTransitType;
  }
  export interface KafkaClusterEncryptionInTransitDescription {
    /**
     * The type of encryption in transit to the Apache Kafka cluster.
     */
    encryptionType?: KafkaClusterEncryptionInTransitType;
  }
  export type KafkaClusterEncryptionInTransitType = "PLAINTEXT"|"TLS"|string;
  export interface ListConnectorsRequest {
    /**
     * The name prefix that you want to use to search for and list connectors.
     */
    connectorNamePrefix?: __string;
    /**
     * The maximum number of connectors to list in one response.
     */
    maxResults?: MaxResults;
    /**
     * If the response of a ListConnectors operation is truncated, it will include a NextToken. Send this NextToken in a subsequent request to continue listing from where the previous operation left off.
     */
    nextToken?: __string;
  }
  export interface ListConnectorsResponse {
    /**
     * An array of connector descriptions.
     */
    connectors?: __listOfConnectorSummary;
    /**
     * If the response of a ListConnectors operation is truncated, it will include a NextToken. Send this NextToken in a subsequent request to continue listing from where it left off.
     */
    nextToken?: __string;
  }
  export interface ListCustomPluginsRequest {
    /**
     * The maximum number of custom plugins to list in one response.
     */
    maxResults?: MaxResults;
    /**
     * If the response of a ListCustomPlugins operation is truncated, it will include a NextToken. Send this NextToken in a subsequent request to continue listing from where the previous operation left off.
     */
    nextToken?: __string;
  }
  export interface ListCustomPluginsResponse {
    /**
     * An array of custom plugin descriptions.
     */
    customPlugins?: __listOfCustomPluginSummary;
    /**
     * If the response of a ListCustomPlugins operation is truncated, it will include a NextToken. Send this NextToken in a subsequent request to continue listing from where the previous operation left off.
     */
    nextToken?: __string;
  }
  export interface ListWorkerConfigurationsRequest {
    /**
     * The maximum number of worker configurations to list in one response.
     */
    maxResults?: MaxResults;
    /**
     * If the response of a ListWorkerConfigurations operation is truncated, it will include a NextToken. Send this NextToken in a subsequent request to continue listing from where the previous operation left off.
     */
    nextToken?: __string;
  }
  export interface ListWorkerConfigurationsResponse {
    /**
     * If the response of a ListWorkerConfigurations operation is truncated, it will include a NextToken. Send this NextToken in a subsequent request to continue listing from where the previous operation left off.
     */
    nextToken?: __string;
    /**
     * An array of worker configuration descriptions.
     */
    workerConfigurations?: __listOfWorkerConfigurationSummary;
  }
  export interface LogDelivery {
    /**
     * The workers can send worker logs to different destination types. This configuration specifies the details of these destinations.
     */
    workerLogDelivery: WorkerLogDelivery;
  }
  export interface LogDeliveryDescription {
    /**
     * The workers can send worker logs to different destination types. This configuration specifies the details of these destinations.
     */
    workerLogDelivery?: WorkerLogDeliveryDescription;
  }
  export type MaxResults = number;
  export interface Plugin {
    /**
     * Details about a custom plugin.
     */
    customPlugin: CustomPlugin;
  }
  export interface PluginDescription {
    /**
     * Details about a custom plugin.
     */
    customPlugin?: CustomPluginDescription;
  }
  export interface ProvisionedCapacity {
    /**
     * The number of microcontroller units (MCUs) allocated to each connector worker. The valid values are 1,2,4,8.
     */
    mcuCount: __integerMin1Max8;
    /**
     * The number of workers that are allocated to the connector.
     */
    workerCount: __integerMin1Max10;
  }
  export interface ProvisionedCapacityDescription {
    /**
     * The number of microcontroller units (MCUs) allocated to each connector worker. The valid values are 1,2,4,8.
     */
    mcuCount?: __integer;
    /**
     * The number of workers that are allocated to the connector.
     */
    workerCount?: __integer;
  }
  export interface ProvisionedCapacityUpdate {
    /**
     * The number of microcontroller units (MCUs) allocated to each connector worker. The valid values are 1,2,4,8.
     */
    mcuCount: __integerMin1Max8;
    /**
     * The number of workers that are allocated to the connector.
     */
    workerCount: __integerMin1Max10;
  }
  export interface S3Location {
    /**
     * The Amazon Resource Name (ARN) of an S3 bucket.
     */
    bucketArn: __string;
    /**
     * The file key for an object in an S3 bucket.
     */
    fileKey: __string;
    /**
     * The version of an object in an S3 bucket.
     */
    objectVersion?: __string;
  }
  export interface S3LocationDescription {
    /**
     * The Amazon Resource Name (ARN) of an S3 bucket.
     */
    bucketArn?: __string;
    /**
     * The file key for an object in an S3 bucket.
     */
    fileKey?: __string;
    /**
     * The version of an object in an S3 bucket.
     */
    objectVersion?: __string;
  }
  export interface S3LogDelivery {
    /**
     * The name of the S3 bucket that is the destination for log delivery.
     */
    bucket?: __string;
    /**
     * Specifies whether connector logs get sent to the specified Amazon S3 destination.
     */
    enabled: __boolean;
    /**
     * The S3 prefix that is the destination for log delivery.
     */
    prefix?: __string;
  }
  export interface S3LogDeliveryDescription {
    /**
     * The name of the S3 bucket that is the destination for log delivery.
     */
    bucket?: __string;
    /**
     * Specifies whether connector logs get sent to the specified Amazon S3 destination.
     */
    enabled?: __boolean;
    /**
     * The S3 prefix that is the destination for log delivery.
     */
    prefix?: __string;
  }
  export interface ScaleInPolicy {
    /**
     * Specifies the CPU utilization percentage threshold at which you want connector scale in to be triggered.
     */
    cpuUtilizationPercentage: __integerMin1Max100;
  }
  export interface ScaleInPolicyDescription {
    /**
     * Specifies the CPU utilization percentage threshold at which you want connector scale in to be triggered.
     */
    cpuUtilizationPercentage?: __integer;
  }
  export interface ScaleInPolicyUpdate {
    /**
     * The target CPU utilization percentage threshold at which you want connector scale in to be triggered.
     */
    cpuUtilizationPercentage: __integerMin1Max100;
  }
  export interface ScaleOutPolicy {
    /**
     * The CPU utilization percentage threshold at which you want connector scale out to be triggered.
     */
    cpuUtilizationPercentage: __integerMin1Max100;
  }
  export interface ScaleOutPolicyDescription {
    /**
     * The CPU utilization percentage threshold at which you want connector scale out to be triggered.
     */
    cpuUtilizationPercentage?: __integer;
  }
  export interface ScaleOutPolicyUpdate {
    /**
     * The target CPU utilization percentage threshold at which you want connector scale out to be triggered.
     */
    cpuUtilizationPercentage: __integerMin1Max100;
  }
  export interface UpdateConnectorRequest {
    /**
     * The target capacity.
     */
    capacity: CapacityUpdate;
    /**
     * The Amazon Resource Name (ARN) of the connector that you want to update.
     */
    connectorArn: __string;
    /**
     * The current version of the connector that you want to update.
     */
    currentVersion: __string;
  }
  export interface UpdateConnectorResponse {
    /**
     * The Amazon Resource Name (ARN) of the connector.
     */
    connectorArn?: __string;
    /**
     * The state of the connector.
     */
    connectorState?: ConnectorState;
  }
  export interface Vpc {
    /**
     * The security groups for the connector.
     */
    securityGroups?: __listOf__string;
    /**
     * The subnets for the connector.
     */
    subnets: __listOf__string;
  }
  export interface VpcDescription {
    /**
     * The security groups for the connector.
     */
    securityGroups?: __listOf__string;
    /**
     * The subnets for the connector.
     */
    subnets?: __listOf__string;
  }
  export interface WorkerConfiguration {
    /**
     * The revision of the worker configuration.
     */
    revision: __longMin1;
    /**
     * The Amazon Resource Name (ARN) of the worker configuration.
     */
    workerConfigurationArn: __string;
  }
  export interface WorkerConfigurationDescription {
    /**
     * The revision of the worker configuration.
     */
    revision?: __long;
    /**
     * The Amazon Resource Name (ARN) of the worker configuration.
     */
    workerConfigurationArn?: __string;
  }
  export interface WorkerConfigurationRevisionDescription {
    /**
     * The time that the worker configuration was created.
     */
    creationTime?: __timestampIso8601;
    /**
     * The description of the worker configuration revision.
     */
    description?: __string;
    /**
     * Base64 encoded contents of the connect-distributed.properties file.
     */
    propertiesFileContent?: __string;
    /**
     * The description of a revision of the worker configuration.
     */
    revision?: __long;
  }
  export interface WorkerConfigurationRevisionSummary {
    /**
     * The time that a worker configuration revision was created.
     */
    creationTime?: __timestampIso8601;
    /**
     * The description of a worker configuration revision.
     */
    description?: __string;
    /**
     * The revision of a worker configuration.
     */
    revision?: __long;
  }
  export interface WorkerConfigurationSummary {
    /**
     * The time that a worker configuration was created.
     */
    creationTime?: __timestampIso8601;
    /**
     * The description of a worker configuration.
     */
    description?: __string;
    /**
     * The latest revision of a worker configuration.
     */
    latestRevision?: WorkerConfigurationRevisionSummary;
    /**
     * The name of the worker configuration.
     */
    name?: __string;
    /**
     * The Amazon Resource Name (ARN) of the worker configuration.
     */
    workerConfigurationArn?: __string;
  }
  export interface WorkerLogDelivery {
    /**
     * Details about delivering logs to Amazon CloudWatch Logs.
     */
    cloudWatchLogs?: CloudWatchLogsLogDelivery;
    /**
     * Details about delivering logs to Amazon Kinesis Data Firehose.
     */
    firehose?: FirehoseLogDelivery;
    /**
     * Details about delivering logs to Amazon S3.
     */
    s3?: S3LogDelivery;
  }
  export interface WorkerLogDeliveryDescription {
    /**
     * Details about delivering logs to Amazon CloudWatch Logs.
     */
    cloudWatchLogs?: CloudWatchLogsLogDeliveryDescription;
    /**
     * Details about delivering logs to Amazon Kinesis Data Firehose.
     */
    firehose?: FirehoseLogDeliveryDescription;
    /**
     * Details about delivering logs to Amazon S3.
     */
    s3?: S3LogDeliveryDescription;
  }
  export type __boolean = boolean;
  export type __integer = number;
  export type __integerMin1Max10 = number;
  export type __integerMin1Max100 = number;
  export type __integerMin1Max8 = number;
  export type __listOfConnectorSummary = ConnectorSummary[];
  export type __listOfCustomPluginSummary = CustomPluginSummary[];
  export type __listOfPlugin = Plugin[];
  export type __listOfPluginDescription = PluginDescription[];
  export type __listOfWorkerConfigurationSummary = WorkerConfigurationSummary[];
  export type __listOf__string = __string[];
  export type __long = number;
  export type __longMin1 = number;
  export type __mapOf__string = {[key: string]: __string};
  export type __string = string;
  export type __stringMax1024 = string;
  export type __stringMin1Max128 = string;
  export type __timestampIso8601 = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-09-14"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the KafkaConnect client.
   */
  export import Types = KafkaConnect;
}
export = KafkaConnect;
