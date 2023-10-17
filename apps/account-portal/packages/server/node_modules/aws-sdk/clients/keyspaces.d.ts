import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Keyspaces extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Keyspaces.Types.ClientConfiguration)
  config: Config & Keyspaces.Types.ClientConfiguration;
  /**
   * The CreateKeyspace operation adds a new keyspace to your account. In an Amazon Web Services account, keyspace names must be unique within each Region.  CreateKeyspace is an asynchronous operation. You can monitor the creation status of the new keyspace by using the GetKeyspace operation. For more information, see Creating keyspaces in the Amazon Keyspaces Developer Guide.
   */
  createKeyspace(params: Keyspaces.Types.CreateKeyspaceRequest, callback?: (err: AWSError, data: Keyspaces.Types.CreateKeyspaceResponse) => void): Request<Keyspaces.Types.CreateKeyspaceResponse, AWSError>;
  /**
   * The CreateKeyspace operation adds a new keyspace to your account. In an Amazon Web Services account, keyspace names must be unique within each Region.  CreateKeyspace is an asynchronous operation. You can monitor the creation status of the new keyspace by using the GetKeyspace operation. For more information, see Creating keyspaces in the Amazon Keyspaces Developer Guide.
   */
  createKeyspace(callback?: (err: AWSError, data: Keyspaces.Types.CreateKeyspaceResponse) => void): Request<Keyspaces.Types.CreateKeyspaceResponse, AWSError>;
  /**
   * The CreateTable operation adds a new table to the specified keyspace. Within a keyspace, table names must be unique.  CreateTable is an asynchronous operation. When the request is received, the status of the table is set to CREATING. You can monitor the creation status of the new table by using the GetTable operation, which returns the current status of the table. You can start using a table when the status is ACTIVE. For more information, see Creating tables in the Amazon Keyspaces Developer Guide.
   */
  createTable(params: Keyspaces.Types.CreateTableRequest, callback?: (err: AWSError, data: Keyspaces.Types.CreateTableResponse) => void): Request<Keyspaces.Types.CreateTableResponse, AWSError>;
  /**
   * The CreateTable operation adds a new table to the specified keyspace. Within a keyspace, table names must be unique.  CreateTable is an asynchronous operation. When the request is received, the status of the table is set to CREATING. You can monitor the creation status of the new table by using the GetTable operation, which returns the current status of the table. You can start using a table when the status is ACTIVE. For more information, see Creating tables in the Amazon Keyspaces Developer Guide.
   */
  createTable(callback?: (err: AWSError, data: Keyspaces.Types.CreateTableResponse) => void): Request<Keyspaces.Types.CreateTableResponse, AWSError>;
  /**
   * The DeleteKeyspace operation deletes a keyspace and all of its tables. 
   */
  deleteKeyspace(params: Keyspaces.Types.DeleteKeyspaceRequest, callback?: (err: AWSError, data: Keyspaces.Types.DeleteKeyspaceResponse) => void): Request<Keyspaces.Types.DeleteKeyspaceResponse, AWSError>;
  /**
   * The DeleteKeyspace operation deletes a keyspace and all of its tables. 
   */
  deleteKeyspace(callback?: (err: AWSError, data: Keyspaces.Types.DeleteKeyspaceResponse) => void): Request<Keyspaces.Types.DeleteKeyspaceResponse, AWSError>;
  /**
   * The DeleteTable operation deletes a table and all of its data. After a DeleteTable request is received, the specified table is in the DELETING state until Amazon Keyspaces completes the deletion. If the table is in the ACTIVE state, you can delete it. If a table is either in the CREATING or UPDATING states, then Amazon Keyspaces returns a ResourceInUseException. If the specified table does not exist, Amazon Keyspaces returns a ResourceNotFoundException. If the table is already in the DELETING state, no error is returned.
   */
  deleteTable(params: Keyspaces.Types.DeleteTableRequest, callback?: (err: AWSError, data: Keyspaces.Types.DeleteTableResponse) => void): Request<Keyspaces.Types.DeleteTableResponse, AWSError>;
  /**
   * The DeleteTable operation deletes a table and all of its data. After a DeleteTable request is received, the specified table is in the DELETING state until Amazon Keyspaces completes the deletion. If the table is in the ACTIVE state, you can delete it. If a table is either in the CREATING or UPDATING states, then Amazon Keyspaces returns a ResourceInUseException. If the specified table does not exist, Amazon Keyspaces returns a ResourceNotFoundException. If the table is already in the DELETING state, no error is returned.
   */
  deleteTable(callback?: (err: AWSError, data: Keyspaces.Types.DeleteTableResponse) => void): Request<Keyspaces.Types.DeleteTableResponse, AWSError>;
  /**
   * Returns the name and the Amazon Resource Name (ARN) of the specified table.
   */
  getKeyspace(params: Keyspaces.Types.GetKeyspaceRequest, callback?: (err: AWSError, data: Keyspaces.Types.GetKeyspaceResponse) => void): Request<Keyspaces.Types.GetKeyspaceResponse, AWSError>;
  /**
   * Returns the name and the Amazon Resource Name (ARN) of the specified table.
   */
  getKeyspace(callback?: (err: AWSError, data: Keyspaces.Types.GetKeyspaceResponse) => void): Request<Keyspaces.Types.GetKeyspaceResponse, AWSError>;
  /**
   * Returns information about the table, including the table's name and current status, the keyspace name, configuration settings, and metadata. To read table metadata using GetTable, Select action permissions for the table and system tables are required to complete the operation.
   */
  getTable(params: Keyspaces.Types.GetTableRequest, callback?: (err: AWSError, data: Keyspaces.Types.GetTableResponse) => void): Request<Keyspaces.Types.GetTableResponse, AWSError>;
  /**
   * Returns information about the table, including the table's name and current status, the keyspace name, configuration settings, and metadata. To read table metadata using GetTable, Select action permissions for the table and system tables are required to complete the operation.
   */
  getTable(callback?: (err: AWSError, data: Keyspaces.Types.GetTableResponse) => void): Request<Keyspaces.Types.GetTableResponse, AWSError>;
  /**
   * Returns a list of keyspaces.
   */
  listKeyspaces(params: Keyspaces.Types.ListKeyspacesRequest, callback?: (err: AWSError, data: Keyspaces.Types.ListKeyspacesResponse) => void): Request<Keyspaces.Types.ListKeyspacesResponse, AWSError>;
  /**
   * Returns a list of keyspaces.
   */
  listKeyspaces(callback?: (err: AWSError, data: Keyspaces.Types.ListKeyspacesResponse) => void): Request<Keyspaces.Types.ListKeyspacesResponse, AWSError>;
  /**
   * Returns a list of tables for a specified keyspace.
   */
  listTables(params: Keyspaces.Types.ListTablesRequest, callback?: (err: AWSError, data: Keyspaces.Types.ListTablesResponse) => void): Request<Keyspaces.Types.ListTablesResponse, AWSError>;
  /**
   * Returns a list of tables for a specified keyspace.
   */
  listTables(callback?: (err: AWSError, data: Keyspaces.Types.ListTablesResponse) => void): Request<Keyspaces.Types.ListTablesResponse, AWSError>;
  /**
   * Returns a list of all tags associated with the specified Amazon Keyspaces resource.
   */
  listTagsForResource(params: Keyspaces.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Keyspaces.Types.ListTagsForResourceResponse) => void): Request<Keyspaces.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of all tags associated with the specified Amazon Keyspaces resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Keyspaces.Types.ListTagsForResourceResponse) => void): Request<Keyspaces.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Restores the specified table to the specified point in time within the earliest_restorable_timestamp and the current time. For more information about restore points, see  Time window for PITR continuous backups in the Amazon Keyspaces Developer Guide. Any number of users can execute up to 4 concurrent restores (any type of restore) in a given account. When you restore using point in time recovery, Amazon Keyspaces restores your source table's schema and data to the state based on the selected timestamp (day:hour:minute:second) to a new table. The Time to Live (TTL) settings are also restored to the state based on the selected timestamp. In addition to the table's schema, data, and TTL settings, RestoreTable restores the capacity mode, encryption, and point-in-time recovery settings from the source table. Unlike the table's schema data and TTL settings, which are restored based on the selected timestamp, these settings are always restored based on the table's settings as of the current time or when the table was deleted. You can also overwrite these settings during restore:   Read/write capacity mode   Provisioned throughput capacity settings   Point-in-time (PITR) settings   Tags   For more information, see PITR restore settings in the Amazon Keyspaces Developer Guide. Note that the following settings are not restored, and you must configure them manually for the new table:   Automatic scaling policies (for tables that use provisioned capacity mode)   Identity and Access Management (IAM) policies   Amazon CloudWatch metrics and alarms  
   */
  restoreTable(params: Keyspaces.Types.RestoreTableRequest, callback?: (err: AWSError, data: Keyspaces.Types.RestoreTableResponse) => void): Request<Keyspaces.Types.RestoreTableResponse, AWSError>;
  /**
   * Restores the specified table to the specified point in time within the earliest_restorable_timestamp and the current time. For more information about restore points, see  Time window for PITR continuous backups in the Amazon Keyspaces Developer Guide. Any number of users can execute up to 4 concurrent restores (any type of restore) in a given account. When you restore using point in time recovery, Amazon Keyspaces restores your source table's schema and data to the state based on the selected timestamp (day:hour:minute:second) to a new table. The Time to Live (TTL) settings are also restored to the state based on the selected timestamp. In addition to the table's schema, data, and TTL settings, RestoreTable restores the capacity mode, encryption, and point-in-time recovery settings from the source table. Unlike the table's schema data and TTL settings, which are restored based on the selected timestamp, these settings are always restored based on the table's settings as of the current time or when the table was deleted. You can also overwrite these settings during restore:   Read/write capacity mode   Provisioned throughput capacity settings   Point-in-time (PITR) settings   Tags   For more information, see PITR restore settings in the Amazon Keyspaces Developer Guide. Note that the following settings are not restored, and you must configure them manually for the new table:   Automatic scaling policies (for tables that use provisioned capacity mode)   Identity and Access Management (IAM) policies   Amazon CloudWatch metrics and alarms  
   */
  restoreTable(callback?: (err: AWSError, data: Keyspaces.Types.RestoreTableResponse) => void): Request<Keyspaces.Types.RestoreTableResponse, AWSError>;
  /**
   * Associates a set of tags with a Amazon Keyspaces resource. You can then activate these user-defined tags so that they appear on the Cost Management Console for cost allocation tracking. For more information, see Adding tags and labels to Amazon Keyspaces resources in the Amazon Keyspaces Developer Guide. For IAM policy examples that show how to control access to Amazon Keyspaces resources based on tags, see Amazon Keyspaces resource access based on tags in the Amazon Keyspaces Developer Guide.
   */
  tagResource(params: Keyspaces.Types.TagResourceRequest, callback?: (err: AWSError, data: Keyspaces.Types.TagResourceResponse) => void): Request<Keyspaces.Types.TagResourceResponse, AWSError>;
  /**
   * Associates a set of tags with a Amazon Keyspaces resource. You can then activate these user-defined tags so that they appear on the Cost Management Console for cost allocation tracking. For more information, see Adding tags and labels to Amazon Keyspaces resources in the Amazon Keyspaces Developer Guide. For IAM policy examples that show how to control access to Amazon Keyspaces resources based on tags, see Amazon Keyspaces resource access based on tags in the Amazon Keyspaces Developer Guide.
   */
  tagResource(callback?: (err: AWSError, data: Keyspaces.Types.TagResourceResponse) => void): Request<Keyspaces.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the association of tags from a Amazon Keyspaces resource.
   */
  untagResource(params: Keyspaces.Types.UntagResourceRequest, callback?: (err: AWSError, data: Keyspaces.Types.UntagResourceResponse) => void): Request<Keyspaces.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the association of tags from a Amazon Keyspaces resource.
   */
  untagResource(callback?: (err: AWSError, data: Keyspaces.Types.UntagResourceResponse) => void): Request<Keyspaces.Types.UntagResourceResponse, AWSError>;
  /**
   * Adds new columns to the table or updates one of the table's settings, for example capacity mode, encryption, point-in-time recovery, or ttl settings. Note that you can only update one specific table setting per update operation.
   */
  updateTable(params: Keyspaces.Types.UpdateTableRequest, callback?: (err: AWSError, data: Keyspaces.Types.UpdateTableResponse) => void): Request<Keyspaces.Types.UpdateTableResponse, AWSError>;
  /**
   * Adds new columns to the table or updates one of the table's settings, for example capacity mode, encryption, point-in-time recovery, or ttl settings. Note that you can only update one specific table setting per update operation.
   */
  updateTable(callback?: (err: AWSError, data: Keyspaces.Types.UpdateTableResponse) => void): Request<Keyspaces.Types.UpdateTableResponse, AWSError>;
}
declare namespace Keyspaces {
  export type ARN = string;
  export interface CapacitySpecification {
    /**
     * The read/write throughput capacity mode for a table. The options are:    throughputMode:PAY_PER_REQUEST and     throughputMode:PROVISIONED - Provisioned capacity mode requires readCapacityUnits and writeCapacityUnits as input.   The default is throughput_mode:PAY_PER_REQUEST. For more information, see Read/write capacity modes in the Amazon Keyspaces Developer Guide.
     */
    throughputMode: ThroughputMode;
    /**
     * The throughput capacity specified for read operations defined in read capacity units (RCUs).
     */
    readCapacityUnits?: CapacityUnits;
    /**
     * The throughput capacity specified for write operations defined in write capacity units (WCUs).
     */
    writeCapacityUnits?: CapacityUnits;
  }
  export interface CapacitySpecificationSummary {
    /**
     * The read/write throughput capacity mode for a table. The options are:    throughputMode:PAY_PER_REQUEST and     throughputMode:PROVISIONED - Provisioned capacity mode requires readCapacityUnits and writeCapacityUnits as input.    The default is throughput_mode:PAY_PER_REQUEST. For more information, see Read/write capacity modes in the Amazon Keyspaces Developer Guide.
     */
    throughputMode: ThroughputMode;
    /**
     * The throughput capacity specified for read operations defined in read capacity units (RCUs).
     */
    readCapacityUnits?: CapacityUnits;
    /**
     * The throughput capacity specified for write operations defined in write capacity units (WCUs).
     */
    writeCapacityUnits?: CapacityUnits;
    /**
     * The timestamp of the last operation that changed the provisioned throughput capacity of a table.
     */
    lastUpdateToPayPerRequestTimestamp?: Timestamp;
  }
  export type CapacityUnits = number;
  export interface ClientSideTimestamps {
    /**
     * Shows how to enable client-side timestamps settings for the specified table.
     */
    status: ClientSideTimestampsStatus;
  }
  export type ClientSideTimestampsStatus = "ENABLED"|string;
  export interface ClusteringKey {
    /**
     * The name(s) of the clustering column(s).
     */
    name: GenericString;
    /**
     * Sets the ascendant (ASC) or descendant (DESC) order modifier.
     */
    orderBy: SortOrder;
  }
  export type ClusteringKeyList = ClusteringKey[];
  export interface ColumnDefinition {
    /**
     * The name of the column.
     */
    name: GenericString;
    /**
     * The data type of the column. For a list of available data types, see Data types in the Amazon Keyspaces Developer Guide.
     */
    type: GenericString;
  }
  export type ColumnDefinitionList = ColumnDefinition[];
  export interface Comment {
    /**
     * An optional description of the table.
     */
    message: String;
  }
  export interface CreateKeyspaceRequest {
    /**
     * The name of the keyspace to be created.
     */
    keyspaceName: KeyspaceName;
    /**
     * A list of key-value pair tags to be attached to the keyspace. For more information, see Adding tags and labels to Amazon Keyspaces resources in the Amazon Keyspaces Developer Guide.
     */
    tags?: TagList;
    /**
     *  The replication specification of the keyspace includes:    replicationStrategy - the required value is SINGLE_REGION or MULTI_REGION.    regionList - if the replicationStrategy is MULTI_REGION, the regionList requires the current Region and at least one additional Amazon Web Services Region where the keyspace is going to be replicated in. The maximum number of supported replication Regions including the current Region is six.  
     */
    replicationSpecification?: ReplicationSpecification;
  }
  export interface CreateKeyspaceResponse {
    /**
     * The unique identifier of the keyspace in the format of an Amazon Resource Name (ARN).
     */
    resourceArn: ARN;
  }
  export interface CreateTableRequest {
    /**
     * The name of the keyspace that the table is going to be created in.
     */
    keyspaceName: KeyspaceName;
    /**
     * The name of the table.
     */
    tableName: TableName;
    /**
     * The schemaDefinition consists of the following parameters. For each column to be created:    name - The name of the column.    type - An Amazon Keyspaces data type. For more information, see Data types in the Amazon Keyspaces Developer Guide.   The primary key of the table consists of the following columns:    partitionKeys - The partition key can be a single column, or it can be a compound value composed of two or more columns. The partition key portion of the primary key is required and determines how Amazon Keyspaces stores your data.    name - The name of each partition key column.    clusteringKeys - The optional clustering column portion of your primary key determines how the data is clustered and sorted within each partition.    name - The name of the clustering column.     orderBy - Sets the ascendant (ASC) or descendant (DESC) order modifier. To define a column as static use staticColumns - Static columns store values that are shared by all rows in the same partition:    name - The name of the column.    type - An Amazon Keyspaces data type.  
     */
    schemaDefinition: SchemaDefinition;
    /**
     * This parameter allows to enter a description of the table.
     */
    comment?: Comment;
    /**
     * Specifies the read/write throughput capacity mode for the table. The options are:    throughputMode:PAY_PER_REQUEST and     throughputMode:PROVISIONED - Provisioned capacity mode requires readCapacityUnits and writeCapacityUnits as input.   The default is throughput_mode:PAY_PER_REQUEST. For more information, see Read/write capacity modes in the Amazon Keyspaces Developer Guide.
     */
    capacitySpecification?: CapacitySpecification;
    /**
     * Specifies how the encryption key for encryption at rest is managed for the table. You can choose one of the following KMS key (KMS key):    type:AWS_OWNED_KMS_KEY - This key is owned by Amazon Keyspaces.     type:CUSTOMER_MANAGED_KMS_KEY - This key is stored in your account and is created, owned, and managed by you. This option requires the kms_key_identifier of the KMS key in Amazon Resource Name (ARN) format as input.   The default is type:AWS_OWNED_KMS_KEY. For more information, see Encryption at rest in the Amazon Keyspaces Developer Guide.
     */
    encryptionSpecification?: EncryptionSpecification;
    /**
     * Specifies if pointInTimeRecovery is enabled or disabled for the table. The options are:    status=ENABLED     status=DISABLED    If it's not specified, the default is status=DISABLED. For more information, see Point-in-time recovery in the Amazon Keyspaces Developer Guide.
     */
    pointInTimeRecovery?: PointInTimeRecovery;
    /**
     * Enables Time to Live custom settings for the table. The options are:    status:enabled     status:disabled    The default is status:disabled. After ttl is enabled, you can't disable it for the table. For more information, see Expiring data by using Amazon Keyspaces Time to Live (TTL) in the Amazon Keyspaces Developer Guide.
     */
    ttl?: TimeToLive;
    /**
     * The default Time to Live setting in seconds for the table. For more information, see Setting the default TTL value for a table in the Amazon Keyspaces Developer Guide.
     */
    defaultTimeToLive?: DefaultTimeToLive;
    /**
     * A list of key-value pair tags to be attached to the resource.  For more information, see Adding tags and labels to Amazon Keyspaces resources in the Amazon Keyspaces Developer Guide.
     */
    tags?: TagList;
    /**
     *  Enables client-side timestamps for the table. By default, the setting is disabled. You can enable client-side timestamps with the following option:    status: "enabled"    Once client-side timestamps are enabled for a table, this setting cannot be disabled.
     */
    clientSideTimestamps?: ClientSideTimestamps;
  }
  export interface CreateTableResponse {
    /**
     * The unique identifier of the table in the format of an Amazon Resource Name (ARN).
     */
    resourceArn: ARN;
  }
  export type DefaultTimeToLive = number;
  export interface DeleteKeyspaceRequest {
    /**
     * The name of the keyspace to be deleted.
     */
    keyspaceName: KeyspaceName;
  }
  export interface DeleteKeyspaceResponse {
  }
  export interface DeleteTableRequest {
    /**
     * The name of the keyspace of the to be deleted table.
     */
    keyspaceName: KeyspaceName;
    /**
     * The name of the table to be deleted.
     */
    tableName: TableName;
  }
  export interface DeleteTableResponse {
  }
  export interface EncryptionSpecification {
    /**
     * The encryption option specified for the table. You can choose one of the following KMS keys (KMS keys):    type:AWS_OWNED_KMS_KEY - This key is owned by Amazon Keyspaces.     type:CUSTOMER_MANAGED_KMS_KEY - This key is stored in your account and is created, owned, and managed by you. This option requires the kms_key_identifier of the KMS key in Amazon Resource Name (ARN) format as input.    The default is type:AWS_OWNED_KMS_KEY.  For more information, see Encryption at rest in the Amazon Keyspaces Developer Guide.
     */
    type: EncryptionType;
    /**
     * The Amazon Resource Name (ARN) of the customer managed KMS key, for example kms_key_identifier:ARN.
     */
    kmsKeyIdentifier?: kmsKeyARN;
  }
  export type EncryptionType = "CUSTOMER_MANAGED_KMS_KEY"|"AWS_OWNED_KMS_KEY"|string;
  export type GenericString = string;
  export interface GetKeyspaceRequest {
    /**
     * The name of the keyspace.
     */
    keyspaceName: KeyspaceName;
  }
  export interface GetKeyspaceResponse {
    /**
     * The name of the keyspace.
     */
    keyspaceName: KeyspaceName;
    /**
     * Returns the ARN of the keyspace.
     */
    resourceArn: ARN;
    /**
     *  Returns the replication strategy of the keyspace. The options are SINGLE_REGION or MULTI_REGION. 
     */
    replicationStrategy: rs;
    /**
     *  If the replicationStrategy of the keyspace is MULTI_REGION, a list of replication Regions is returned. 
     */
    replicationRegions?: RegionList;
  }
  export interface GetTableRequest {
    /**
     * The name of the keyspace that the table is stored in.
     */
    keyspaceName: KeyspaceName;
    /**
     * The name of the table.
     */
    tableName: TableName;
  }
  export interface GetTableResponse {
    /**
     * The name of the keyspace that the specified table is stored in.
     */
    keyspaceName: KeyspaceName;
    /**
     * The name of the specified table.
     */
    tableName: TableName;
    /**
     * The Amazon Resource Name (ARN) of the specified table.
     */
    resourceArn: ARN;
    /**
     * The creation timestamp of the specified table.
     */
    creationTimestamp?: Timestamp;
    /**
     * The current status of the specified table.
     */
    status?: TableStatus;
    /**
     * The schema definition of the specified table.
     */
    schemaDefinition?: SchemaDefinition;
    /**
     * The read/write throughput capacity mode for a table. The options are:    throughputMode:PAY_PER_REQUEST     throughputMode:PROVISIONED   
     */
    capacitySpecification?: CapacitySpecificationSummary;
    /**
     * The encryption settings of the specified table.
     */
    encryptionSpecification?: EncryptionSpecification;
    /**
     * The point-in-time recovery status of the specified table.
     */
    pointInTimeRecovery?: PointInTimeRecoverySummary;
    /**
     * The custom Time to Live settings of the specified table.
     */
    ttl?: TimeToLive;
    /**
     * The default Time to Live settings in seconds of the specified table.
     */
    defaultTimeToLive?: DefaultTimeToLive;
    /**
     * The the description of the specified table.
     */
    comment?: Comment;
    /**
     *  The client-side timestamps setting of the table.
     */
    clientSideTimestamps?: ClientSideTimestamps;
  }
  export type KeyspaceName = string;
  export interface KeyspaceSummary {
    /**
     * The name of the keyspace.
     */
    keyspaceName: KeyspaceName;
    /**
     * The unique identifier of the keyspace in the format of an Amazon Resource Name (ARN).
     */
    resourceArn: ARN;
    /**
     *  This property specifies if a keyspace is a single Region keyspace or a multi-Region keyspace. The available values are SINGLE_REGION or MULTI_REGION. 
     */
    replicationStrategy: rs;
    /**
     *  If the replicationStrategy of the keyspace is MULTI_REGION, a list of replication Regions is returned. 
     */
    replicationRegions?: RegionList;
  }
  export type KeyspaceSummaryList = KeyspaceSummary[];
  export interface ListKeyspacesRequest {
    /**
     * The pagination token. To resume pagination, provide the NextToken value as argument of a subsequent API invocation.
     */
    nextToken?: NextToken;
    /**
     * The total number of keyspaces to return in the output. If the total number of keyspaces available is more than the value specified, a NextToken is provided in the output. To resume pagination, provide the NextToken value as an argument of a subsequent API invocation.
     */
    maxResults?: MaxResults;
  }
  export interface ListKeyspacesResponse {
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: NextToken;
    /**
     * A list of keyspaces.
     */
    keyspaces: KeyspaceSummaryList;
  }
  export interface ListTablesRequest {
    /**
     * The pagination token. To resume pagination, provide the NextToken value as an argument of a subsequent API invocation.
     */
    nextToken?: NextToken;
    /**
     * The total number of tables to return in the output. If the total number of tables available is more than the value specified, a NextToken is provided in the output. To resume pagination, provide the NextToken value as an argument of a subsequent API invocation.
     */
    maxResults?: MaxResults;
    /**
     * The name of the keyspace.
     */
    keyspaceName: KeyspaceName;
  }
  export interface ListTablesResponse {
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: NextToken;
    /**
     * A list of tables.
     */
    tables?: TableSummaryList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Keyspaces resource.
     */
    resourceArn: ARN;
    /**
     * The pagination token. To resume pagination, provide the NextToken value as argument of a subsequent API invocation.
     */
    nextToken?: NextToken;
    /**
     * The total number of tags to return in the output. If the total number of tags available is more than the value specified, a NextToken is provided in the output. To resume pagination, provide the NextToken value as an argument of a subsequent API invocation.
     */
    maxResults?: MaxResults;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: NextToken;
    /**
     * A list of tags.
     */
    tags?: TagList;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export interface PartitionKey {
    /**
     * The name(s) of the partition key column(s).
     */
    name: GenericString;
  }
  export type PartitionKeyList = PartitionKey[];
  export interface PointInTimeRecovery {
    /**
     * The options are:    status=ENABLED     status=DISABLED   
     */
    status: PointInTimeRecoveryStatus;
  }
  export type PointInTimeRecoveryStatus = "ENABLED"|"DISABLED"|string;
  export interface PointInTimeRecoverySummary {
    /**
     * Shows if point-in-time recovery is enabled or disabled for the specified table.
     */
    status: PointInTimeRecoveryStatus;
    /**
     * Specifies the earliest possible restore point of the table in ISO 8601 format.
     */
    earliestRestorableTimestamp?: Timestamp;
  }
  export type RegionList = region[];
  export interface ReplicationSpecification {
    /**
     *  The replicationStrategy of a keyspace, the required value is SINGLE_REGION or MULTI_REGION. 
     */
    replicationStrategy: rs;
    /**
     *  The regionList can contain up to six Amazon Web Services Regions where the keyspace is replicated in. 
     */
    regionList?: RegionList;
  }
  export interface RestoreTableRequest {
    /**
     * The keyspace name of the source table.
     */
    sourceKeyspaceName: KeyspaceName;
    /**
     * The name of the source table.
     */
    sourceTableName: TableName;
    /**
     * The name of the target keyspace.
     */
    targetKeyspaceName: KeyspaceName;
    /**
     * The name of the target table.
     */
    targetTableName: TableName;
    /**
     * The restore timestamp in ISO 8601 format.
     */
    restoreTimestamp?: Timestamp;
    /**
     * Specifies the read/write throughput capacity mode for the target table. The options are:    throughputMode:PAY_PER_REQUEST     throughputMode:PROVISIONED - Provisioned capacity mode requires readCapacityUnits and writeCapacityUnits as input.   The default is throughput_mode:PAY_PER_REQUEST. For more information, see Read/write capacity modes in the Amazon Keyspaces Developer Guide.
     */
    capacitySpecificationOverride?: CapacitySpecification;
    /**
     * Specifies the encryption settings for the target table. You can choose one of the following KMS key (KMS key):    type:AWS_OWNED_KMS_KEY - This key is owned by Amazon Keyspaces.     type:CUSTOMER_MANAGED_KMS_KEY - This key is stored in your account and is created, owned, and managed by you. This option requires the kms_key_identifier of the KMS key in Amazon Resource Name (ARN) format as input.    The default is type:AWS_OWNED_KMS_KEY. For more information, see Encryption at rest in the Amazon Keyspaces Developer Guide.
     */
    encryptionSpecificationOverride?: EncryptionSpecification;
    /**
     * Specifies the pointInTimeRecovery settings for the target table. The options are:    status=ENABLED     status=DISABLED    If it's not specified, the default is status=DISABLED. For more information, see Point-in-time recovery in the Amazon Keyspaces Developer Guide.
     */
    pointInTimeRecoveryOverride?: PointInTimeRecovery;
    /**
     * A list of key-value pair tags to be attached to the restored table.  For more information, see Adding tags and labels to Amazon Keyspaces resources in the Amazon Keyspaces Developer Guide.
     */
    tagsOverride?: TagList;
  }
  export interface RestoreTableResponse {
    /**
     * The Amazon Resource Name (ARN) of the restored table.
     */
    restoredTableARN: ARN;
  }
  export interface SchemaDefinition {
    /**
     * The regular columns of the table.
     */
    allColumns: ColumnDefinitionList;
    /**
     * The columns that are part of the partition key of the table .
     */
    partitionKeys: PartitionKeyList;
    /**
     * The columns that are part of the clustering key of the table.
     */
    clusteringKeys?: ClusteringKeyList;
    /**
     * The columns that have been defined as STATIC. Static columns store values that are shared by all rows in the same partition.
     */
    staticColumns?: StaticColumnList;
  }
  export type SortOrder = "ASC"|"DESC"|string;
  export interface StaticColumn {
    /**
     * The name of the static column.
     */
    name: GenericString;
  }
  export type StaticColumnList = StaticColumn[];
  export type String = string;
  export type TableName = string;
  export type TableStatus = "ACTIVE"|"CREATING"|"UPDATING"|"DELETING"|"DELETED"|"RESTORING"|"INACCESSIBLE_ENCRYPTION_CREDENTIALS"|string;
  export interface TableSummary {
    /**
     * The name of the keyspace that the table is stored in.
     */
    keyspaceName: KeyspaceName;
    /**
     * The name of the table.
     */
    tableName: TableName;
    /**
     * The unique identifier of the table in the format of an Amazon Resource Name (ARN).
     */
    resourceArn: ARN;
  }
  export type TableSummaryList = TableSummary[];
  export interface Tag {
    /**
     * The key of the tag. Tag keys are case sensitive. Each Amazon Keyspaces resource can only have up to one tag with the same key. If you try to add an existing tag (same key), the existing tag value will be updated to the new value.
     */
    key: TagKey;
    /**
     * The value of the tag. Tag values are case-sensitive and can be null.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Keyspaces resource to which to add tags.
     */
    resourceArn: ARN;
    /**
     * The tags to be assigned to the Amazon Keyspaces resource.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type ThroughputMode = "PAY_PER_REQUEST"|"PROVISIONED"|string;
  export interface TimeToLive {
    /**
     * Shows how to enable custom Time to Live (TTL) settings for the specified table.
     */
    status: TimeToLiveStatus;
  }
  export type TimeToLiveStatus = "ENABLED"|string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Keyspaces resource that the tags will be removed from. This value is an Amazon Resource Name (ARN).
     */
    resourceArn: ARN;
    /**
     * A list of existing tags to be removed from the Amazon Keyspaces resource.
     */
    tags: TagList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateTableRequest {
    /**
     * The name of the keyspace the specified table is stored in.
     */
    keyspaceName: KeyspaceName;
    /**
     * The name of the table.
     */
    tableName: TableName;
    /**
     * For each column to be added to the specified table:    name - The name of the column.    type - An Amazon Keyspaces data type. For more information, see Data types in the Amazon Keyspaces Developer Guide.  
     */
    addColumns?: ColumnDefinitionList;
    /**
     * Modifies the read/write throughput capacity mode for the table. The options are:    throughputMode:PAY_PER_REQUEST and     throughputMode:PROVISIONED - Provisioned capacity mode requires readCapacityUnits and writeCapacityUnits as input.   The default is throughput_mode:PAY_PER_REQUEST. For more information, see Read/write capacity modes in the Amazon Keyspaces Developer Guide.
     */
    capacitySpecification?: CapacitySpecification;
    /**
     * Modifies the encryption settings of the table. You can choose one of the following KMS key (KMS key):    type:AWS_OWNED_KMS_KEY - This key is owned by Amazon Keyspaces.     type:CUSTOMER_MANAGED_KMS_KEY - This key is stored in your account and is created, owned, and managed by you. This option requires the kms_key_identifier of the KMS key in Amazon Resource Name (ARN) format as input.    The default is AWS_OWNED_KMS_KEY. For more information, see Encryption at rest in the Amazon Keyspaces Developer Guide.
     */
    encryptionSpecification?: EncryptionSpecification;
    /**
     * Modifies the pointInTimeRecovery settings of the table. The options are:    status=ENABLED     status=DISABLED    If it's not specified, the default is status=DISABLED. For more information, see Point-in-time recovery in the Amazon Keyspaces Developer Guide.
     */
    pointInTimeRecovery?: PointInTimeRecovery;
    /**
     * Modifies Time to Live custom settings for the table. The options are:    status:enabled     status:disabled    The default is status:disabled. After ttl is enabled, you can't disable it for the table. For more information, see Expiring data by using Amazon Keyspaces Time to Live (TTL) in the Amazon Keyspaces Developer Guide.
     */
    ttl?: TimeToLive;
    /**
     * The default Time to Live setting in seconds for the table. For more information, see Setting the default TTL value for a table in the Amazon Keyspaces Developer Guide.
     */
    defaultTimeToLive?: DefaultTimeToLive;
    /**
     * Enables client-side timestamps for the table. By default, the setting is disabled. You can enable client-side timestamps with the following option:    status: "enabled"    Once client-side timestamps are enabled for a table, this setting cannot be disabled.
     */
    clientSideTimestamps?: ClientSideTimestamps;
  }
  export interface UpdateTableResponse {
    /**
     * The Amazon Resource Name (ARN) of the modified table.
     */
    resourceArn: ARN;
  }
  export type kmsKeyARN = string;
  export type region = string;
  export type rs = "SINGLE_REGION"|"MULTI_REGION"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-02-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Keyspaces client.
   */
  export import Types = Keyspaces;
}
export = Keyspaces;
