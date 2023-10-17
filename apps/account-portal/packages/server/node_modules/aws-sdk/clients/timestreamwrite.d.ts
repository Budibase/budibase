import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class TimestreamWrite extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: TimestreamWrite.Types.ClientConfiguration)
  config: Config & TimestreamWrite.Types.ClientConfiguration;
  /**
   * Creates a new Timestream batch load task. A batch load task processes data from a CSV source in an S3 location and writes to a Timestream table. A mapping from source to target is defined in a batch load task. Errors and events are written to a report at an S3 location. For the report, if the KMS key is not specified, the report will be encrypted with an S3 managed key when SSE_S3 is the option. Otherwise an error is thrown. For more information, see Amazon Web Services managed keys. Service quotas apply. For details, see code sample.
   */
  createBatchLoadTask(params: TimestreamWrite.Types.CreateBatchLoadTaskRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.CreateBatchLoadTaskResponse) => void): Request<TimestreamWrite.Types.CreateBatchLoadTaskResponse, AWSError>;
  /**
   * Creates a new Timestream batch load task. A batch load task processes data from a CSV source in an S3 location and writes to a Timestream table. A mapping from source to target is defined in a batch load task. Errors and events are written to a report at an S3 location. For the report, if the KMS key is not specified, the report will be encrypted with an S3 managed key when SSE_S3 is the option. Otherwise an error is thrown. For more information, see Amazon Web Services managed keys. Service quotas apply. For details, see code sample.
   */
  createBatchLoadTask(callback?: (err: AWSError, data: TimestreamWrite.Types.CreateBatchLoadTaskResponse) => void): Request<TimestreamWrite.Types.CreateBatchLoadTaskResponse, AWSError>;
  /**
   * Creates a new Timestream database. If the KMS key is not specified, the database will be encrypted with a Timestream managed KMS key located in your account. For more information, see Amazon Web Services managed keys. Service quotas apply. For details, see code sample. 
   */
  createDatabase(params: TimestreamWrite.Types.CreateDatabaseRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.CreateDatabaseResponse) => void): Request<TimestreamWrite.Types.CreateDatabaseResponse, AWSError>;
  /**
   * Creates a new Timestream database. If the KMS key is not specified, the database will be encrypted with a Timestream managed KMS key located in your account. For more information, see Amazon Web Services managed keys. Service quotas apply. For details, see code sample. 
   */
  createDatabase(callback?: (err: AWSError, data: TimestreamWrite.Types.CreateDatabaseResponse) => void): Request<TimestreamWrite.Types.CreateDatabaseResponse, AWSError>;
  /**
   * Adds a new table to an existing database in your account. In an Amazon Web Services account, table names must be at least unique within each Region if they are in the same database. You might have identical table names in the same Region if the tables are in separate databases. While creating the table, you must specify the table name, database name, and the retention properties. Service quotas apply. See code sample for details. 
   */
  createTable(params: TimestreamWrite.Types.CreateTableRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.CreateTableResponse) => void): Request<TimestreamWrite.Types.CreateTableResponse, AWSError>;
  /**
   * Adds a new table to an existing database in your account. In an Amazon Web Services account, table names must be at least unique within each Region if they are in the same database. You might have identical table names in the same Region if the tables are in separate databases. While creating the table, you must specify the table name, database name, and the retention properties. Service quotas apply. See code sample for details. 
   */
  createTable(callback?: (err: AWSError, data: TimestreamWrite.Types.CreateTableResponse) => void): Request<TimestreamWrite.Types.CreateTableResponse, AWSError>;
  /**
   * Deletes a given Timestream database. This is an irreversible operation. After a database is deleted, the time-series data from its tables cannot be recovered.   All tables in the database must be deleted first, or a ValidationException error will be thrown.  Due to the nature of distributed retries, the operation can return either success or a ResourceNotFoundException. Clients should consider them equivalent.  See code sample for details.
   */
  deleteDatabase(params: TimestreamWrite.Types.DeleteDatabaseRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a given Timestream database. This is an irreversible operation. After a database is deleted, the time-series data from its tables cannot be recovered.   All tables in the database must be deleted first, or a ValidationException error will be thrown.  Due to the nature of distributed retries, the operation can return either success or a ResourceNotFoundException. Clients should consider them equivalent.  See code sample for details.
   */
  deleteDatabase(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a given Timestream table. This is an irreversible operation. After a Timestream database table is deleted, the time-series data stored in the table cannot be recovered.   Due to the nature of distributed retries, the operation can return either success or a ResourceNotFoundException. Clients should consider them equivalent.  See code sample for details.
   */
  deleteTable(params: TimestreamWrite.Types.DeleteTableRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a given Timestream table. This is an irreversible operation. After a Timestream database table is deleted, the time-series data stored in the table cannot be recovered.   Due to the nature of distributed retries, the operation can return either success or a ResourceNotFoundException. Clients should consider them equivalent.  See code sample for details.
   */
  deleteTable(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns information about the batch load task, including configurations, mappings, progress, and other details. Service quotas apply. See code sample for details.
   */
  describeBatchLoadTask(params: TimestreamWrite.Types.DescribeBatchLoadTaskRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.DescribeBatchLoadTaskResponse) => void): Request<TimestreamWrite.Types.DescribeBatchLoadTaskResponse, AWSError>;
  /**
   * Returns information about the batch load task, including configurations, mappings, progress, and other details. Service quotas apply. See code sample for details.
   */
  describeBatchLoadTask(callback?: (err: AWSError, data: TimestreamWrite.Types.DescribeBatchLoadTaskResponse) => void): Request<TimestreamWrite.Types.DescribeBatchLoadTaskResponse, AWSError>;
  /**
   * Returns information about the database, including the database name, time that the database was created, and the total number of tables found within the database. Service quotas apply. See code sample for details.
   */
  describeDatabase(params: TimestreamWrite.Types.DescribeDatabaseRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.DescribeDatabaseResponse) => void): Request<TimestreamWrite.Types.DescribeDatabaseResponse, AWSError>;
  /**
   * Returns information about the database, including the database name, time that the database was created, and the total number of tables found within the database. Service quotas apply. See code sample for details.
   */
  describeDatabase(callback?: (err: AWSError, data: TimestreamWrite.Types.DescribeDatabaseResponse) => void): Request<TimestreamWrite.Types.DescribeDatabaseResponse, AWSError>;
  /**
   * Returns a list of available endpoints to make Timestream API calls against. This API operation is available through both the Write and Query APIs. Because the Timestream SDKs are designed to transparently work with the service’s architecture, including the management and mapping of the service endpoints, we don't recommend that you use this API operation unless:   You are using VPC endpoints (Amazon Web Services PrivateLink) with Timestream    Your application uses a programming language that does not yet have SDK support   You require better control over the client-side implementation   For detailed information on how and when to use and implement DescribeEndpoints, see The Endpoint Discovery Pattern.
   */
  describeEndpoints(params: TimestreamWrite.Types.DescribeEndpointsRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.DescribeEndpointsResponse) => void): Request<TimestreamWrite.Types.DescribeEndpointsResponse, AWSError>;
  /**
   * Returns a list of available endpoints to make Timestream API calls against. This API operation is available through both the Write and Query APIs. Because the Timestream SDKs are designed to transparently work with the service’s architecture, including the management and mapping of the service endpoints, we don't recommend that you use this API operation unless:   You are using VPC endpoints (Amazon Web Services PrivateLink) with Timestream    Your application uses a programming language that does not yet have SDK support   You require better control over the client-side implementation   For detailed information on how and when to use and implement DescribeEndpoints, see The Endpoint Discovery Pattern.
   */
  describeEndpoints(callback?: (err: AWSError, data: TimestreamWrite.Types.DescribeEndpointsResponse) => void): Request<TimestreamWrite.Types.DescribeEndpointsResponse, AWSError>;
  /**
   * Returns information about the table, including the table name, database name, retention duration of the memory store and the magnetic store. Service quotas apply. See code sample for details. 
   */
  describeTable(params: TimestreamWrite.Types.DescribeTableRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.DescribeTableResponse) => void): Request<TimestreamWrite.Types.DescribeTableResponse, AWSError>;
  /**
   * Returns information about the table, including the table name, database name, retention duration of the memory store and the magnetic store. Service quotas apply. See code sample for details. 
   */
  describeTable(callback?: (err: AWSError, data: TimestreamWrite.Types.DescribeTableResponse) => void): Request<TimestreamWrite.Types.DescribeTableResponse, AWSError>;
  /**
   * Provides a list of batch load tasks, along with the name, status, when the task is resumable until, and other details. See code sample for details.
   */
  listBatchLoadTasks(params: TimestreamWrite.Types.ListBatchLoadTasksRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.ListBatchLoadTasksResponse) => void): Request<TimestreamWrite.Types.ListBatchLoadTasksResponse, AWSError>;
  /**
   * Provides a list of batch load tasks, along with the name, status, when the task is resumable until, and other details. See code sample for details.
   */
  listBatchLoadTasks(callback?: (err: AWSError, data: TimestreamWrite.Types.ListBatchLoadTasksResponse) => void): Request<TimestreamWrite.Types.ListBatchLoadTasksResponse, AWSError>;
  /**
   * Returns a list of your Timestream databases. Service quotas apply. See code sample for details. 
   */
  listDatabases(params: TimestreamWrite.Types.ListDatabasesRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.ListDatabasesResponse) => void): Request<TimestreamWrite.Types.ListDatabasesResponse, AWSError>;
  /**
   * Returns a list of your Timestream databases. Service quotas apply. See code sample for details. 
   */
  listDatabases(callback?: (err: AWSError, data: TimestreamWrite.Types.ListDatabasesResponse) => void): Request<TimestreamWrite.Types.ListDatabasesResponse, AWSError>;
  /**
   * Provides a list of tables, along with the name, status, and retention properties of each table. See code sample for details. 
   */
  listTables(params: TimestreamWrite.Types.ListTablesRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.ListTablesResponse) => void): Request<TimestreamWrite.Types.ListTablesResponse, AWSError>;
  /**
   * Provides a list of tables, along with the name, status, and retention properties of each table. See code sample for details. 
   */
  listTables(callback?: (err: AWSError, data: TimestreamWrite.Types.ListTablesResponse) => void): Request<TimestreamWrite.Types.ListTablesResponse, AWSError>;
  /**
   *  Lists all tags on a Timestream resource. 
   */
  listTagsForResource(params: TimestreamWrite.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.ListTagsForResourceResponse) => void): Request<TimestreamWrite.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Lists all tags on a Timestream resource. 
   */
  listTagsForResource(callback?: (err: AWSError, data: TimestreamWrite.Types.ListTagsForResourceResponse) => void): Request<TimestreamWrite.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  
   */
  resumeBatchLoadTask(params: TimestreamWrite.Types.ResumeBatchLoadTaskRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.ResumeBatchLoadTaskResponse) => void): Request<TimestreamWrite.Types.ResumeBatchLoadTaskResponse, AWSError>;
  /**
   *  
   */
  resumeBatchLoadTask(callback?: (err: AWSError, data: TimestreamWrite.Types.ResumeBatchLoadTaskResponse) => void): Request<TimestreamWrite.Types.ResumeBatchLoadTaskResponse, AWSError>;
  /**
   *  Associates a set of tags with a Timestream resource. You can then activate these user-defined tags so that they appear on the Billing and Cost Management console for cost allocation tracking. 
   */
  tagResource(params: TimestreamWrite.Types.TagResourceRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.TagResourceResponse) => void): Request<TimestreamWrite.Types.TagResourceResponse, AWSError>;
  /**
   *  Associates a set of tags with a Timestream resource. You can then activate these user-defined tags so that they appear on the Billing and Cost Management console for cost allocation tracking. 
   */
  tagResource(callback?: (err: AWSError, data: TimestreamWrite.Types.TagResourceResponse) => void): Request<TimestreamWrite.Types.TagResourceResponse, AWSError>;
  /**
   *  Removes the association of tags from a Timestream resource. 
   */
  untagResource(params: TimestreamWrite.Types.UntagResourceRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.UntagResourceResponse) => void): Request<TimestreamWrite.Types.UntagResourceResponse, AWSError>;
  /**
   *  Removes the association of tags from a Timestream resource. 
   */
  untagResource(callback?: (err: AWSError, data: TimestreamWrite.Types.UntagResourceResponse) => void): Request<TimestreamWrite.Types.UntagResourceResponse, AWSError>;
  /**
   *  Modifies the KMS key for an existing database. While updating the database, you must specify the database name and the identifier of the new KMS key to be used (KmsKeyId). If there are any concurrent UpdateDatabase requests, first writer wins.  See code sample for details.
   */
  updateDatabase(params: TimestreamWrite.Types.UpdateDatabaseRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.UpdateDatabaseResponse) => void): Request<TimestreamWrite.Types.UpdateDatabaseResponse, AWSError>;
  /**
   *  Modifies the KMS key for an existing database. While updating the database, you must specify the database name and the identifier of the new KMS key to be used (KmsKeyId). If there are any concurrent UpdateDatabase requests, first writer wins.  See code sample for details.
   */
  updateDatabase(callback?: (err: AWSError, data: TimestreamWrite.Types.UpdateDatabaseResponse) => void): Request<TimestreamWrite.Types.UpdateDatabaseResponse, AWSError>;
  /**
   * Modifies the retention duration of the memory store and magnetic store for your Timestream table. Note that the change in retention duration takes effect immediately. For example, if the retention period of the memory store was initially set to 2 hours and then changed to 24 hours, the memory store will be capable of holding 24 hours of data, but will be populated with 24 hours of data 22 hours after this change was made. Timestream does not retrieve data from the magnetic store to populate the memory store.  See code sample for details.
   */
  updateTable(params: TimestreamWrite.Types.UpdateTableRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.UpdateTableResponse) => void): Request<TimestreamWrite.Types.UpdateTableResponse, AWSError>;
  /**
   * Modifies the retention duration of the memory store and magnetic store for your Timestream table. Note that the change in retention duration takes effect immediately. For example, if the retention period of the memory store was initially set to 2 hours and then changed to 24 hours, the memory store will be capable of holding 24 hours of data, but will be populated with 24 hours of data 22 hours after this change was made. Timestream does not retrieve data from the magnetic store to populate the memory store.  See code sample for details.
   */
  updateTable(callback?: (err: AWSError, data: TimestreamWrite.Types.UpdateTableResponse) => void): Request<TimestreamWrite.Types.UpdateTableResponse, AWSError>;
  /**
   * Enables you to write your time-series data into Timestream. You can specify a single data point or a batch of data points to be inserted into the system. Timestream offers you a flexible schema that auto detects the column names and data types for your Timestream tables based on the dimension names and data types of the data points you specify when invoking writes into the database.  Timestream supports eventual consistency read semantics. This means that when you query data immediately after writing a batch of data into Timestream, the query results might not reflect the results of a recently completed write operation. The results may also include some stale data. If you repeat the query request after a short time, the results should return the latest data. Service quotas apply.  See code sample for details.  Upserts  You can use the Version parameter in a WriteRecords request to update data points. Timestream tracks a version number with each record. Version defaults to 1 when it's not specified for the record in the request. Timestream updates an existing record’s measure value along with its Version when it receives a write request with a higher Version number for that record. When it receives an update request where the measure value is the same as that of the existing record, Timestream still updates Version, if it is greater than the existing value of Version. You can update a data point as many times as desired, as long as the value of Version continuously increases.   For example, suppose you write a new record without indicating Version in the request. Timestream stores this record, and set Version to 1. Now, suppose you try to update this record with a WriteRecords request of the same record with a different measure value but, like before, do not provide Version. In this case, Timestream will reject this update with a RejectedRecordsException since the updated record’s version is not greater than the existing value of Version.  However, if you were to resend the update request with Version set to 2, Timestream would then succeed in updating the record’s value, and the Version would be set to 2. Next, suppose you sent a WriteRecords request with this same record and an identical measure value, but with Version set to 3. In this case, Timestream would only update Version to 3. Any further updates would need to send a version number greater than 3, or the update requests would receive a RejectedRecordsException. 
   */
  writeRecords(params: TimestreamWrite.Types.WriteRecordsRequest, callback?: (err: AWSError, data: TimestreamWrite.Types.WriteRecordsResponse) => void): Request<TimestreamWrite.Types.WriteRecordsResponse, AWSError>;
  /**
   * Enables you to write your time-series data into Timestream. You can specify a single data point or a batch of data points to be inserted into the system. Timestream offers you a flexible schema that auto detects the column names and data types for your Timestream tables based on the dimension names and data types of the data points you specify when invoking writes into the database.  Timestream supports eventual consistency read semantics. This means that when you query data immediately after writing a batch of data into Timestream, the query results might not reflect the results of a recently completed write operation. The results may also include some stale data. If you repeat the query request after a short time, the results should return the latest data. Service quotas apply.  See code sample for details.  Upserts  You can use the Version parameter in a WriteRecords request to update data points. Timestream tracks a version number with each record. Version defaults to 1 when it's not specified for the record in the request. Timestream updates an existing record’s measure value along with its Version when it receives a write request with a higher Version number for that record. When it receives an update request where the measure value is the same as that of the existing record, Timestream still updates Version, if it is greater than the existing value of Version. You can update a data point as many times as desired, as long as the value of Version continuously increases.   For example, suppose you write a new record without indicating Version in the request. Timestream stores this record, and set Version to 1. Now, suppose you try to update this record with a WriteRecords request of the same record with a different measure value but, like before, do not provide Version. In this case, Timestream will reject this update with a RejectedRecordsException since the updated record’s version is not greater than the existing value of Version.  However, if you were to resend the update request with Version set to 2, Timestream would then succeed in updating the record’s value, and the Version would be set to 2. Next, suppose you sent a WriteRecords request with this same record and an identical measure value, but with Version set to 3. In this case, Timestream would only update Version to 3. Any further updates would need to send a version number greater than 3, or the update requests would receive a RejectedRecordsException. 
   */
  writeRecords(callback?: (err: AWSError, data: TimestreamWrite.Types.WriteRecordsResponse) => void): Request<TimestreamWrite.Types.WriteRecordsResponse, AWSError>;
}
declare namespace TimestreamWrite {
  export type AmazonResourceName = string;
  export type BatchLoadDataFormat = "CSV"|string;
  export interface BatchLoadProgressReport {
    /**
     * 
     */
    RecordsProcessed?: Long;
    /**
     * 
     */
    RecordsIngested?: Long;
    /**
     * 
     */
    ParseFailures?: Long;
    /**
     * 
     */
    RecordIngestionFailures?: Long;
    /**
     * 
     */
    FileFailures?: Long;
    /**
     * 
     */
    BytesMetered?: Long;
  }
  export type BatchLoadStatus = "CREATED"|"IN_PROGRESS"|"FAILED"|"SUCCEEDED"|"PROGRESS_STOPPED"|"PENDING_RESUME"|string;
  export interface BatchLoadTask {
    /**
     * The ID of the batch load task.
     */
    TaskId?: BatchLoadTaskId;
    /**
     * Status of the batch load task.
     */
    TaskStatus?: BatchLoadStatus;
    /**
     * Database name for the database into which a batch load task loads data.
     */
    DatabaseName?: ResourceName;
    /**
     * Table name for the table into which a batch load task loads data.
     */
    TableName?: ResourceName;
    /**
     * The time when the Timestream batch load task was created.
     */
    CreationTime?: _Date;
    /**
     * The time when the Timestream batch load task was last updated.
     */
    LastUpdatedTime?: _Date;
    /**
     *  
     */
    ResumableUntil?: _Date;
  }
  export interface BatchLoadTaskDescription {
    /**
     * The ID of the batch load task.
     */
    TaskId?: BatchLoadTaskId;
    /**
     * 
     */
    ErrorMessage?: StringValue2048;
    /**
     * Configuration details about the data source for a batch load task.
     */
    DataSourceConfiguration?: DataSourceConfiguration;
    /**
     * 
     */
    ProgressReport?: BatchLoadProgressReport;
    /**
     * Report configuration for a batch load task. This contains details about where error reports are stored.
     */
    ReportConfiguration?: ReportConfiguration;
    /**
     * Data model configuration for a batch load task. This contains details about where a data model for a batch load task is stored.
     */
    DataModelConfiguration?: DataModelConfiguration;
    /**
     * 
     */
    TargetDatabaseName?: ResourceName;
    /**
     * 
     */
    TargetTableName?: ResourceName;
    /**
     * Status of the batch load task.
     */
    TaskStatus?: BatchLoadStatus;
    /**
     * 
     */
    RecordVersion?: RecordVersion;
    /**
     * The time when the Timestream batch load task was created.
     */
    CreationTime?: _Date;
    /**
     * The time when the Timestream batch load task was last updated.
     */
    LastUpdatedTime?: _Date;
    /**
     *  
     */
    ResumableUntil?: _Date;
  }
  export type BatchLoadTaskId = string;
  export type BatchLoadTaskList = BatchLoadTask[];
  export type Boolean = boolean;
  export type ClientRequestToken = string;
  export interface CreateBatchLoadTaskRequest {
    /**
     * 
     */
    ClientToken?: ClientRequestToken;
    DataModelConfiguration?: DataModelConfiguration;
    /**
     * Defines configuration details about the data source for a batch load task.
     */
    DataSourceConfiguration: DataSourceConfiguration;
    ReportConfiguration: ReportConfiguration;
    /**
     * Target Timestream database for a batch load task.
     */
    TargetDatabaseName: ResourceCreateAPIName;
    /**
     * Target Timestream table for a batch load task.
     */
    TargetTableName: ResourceCreateAPIName;
    /**
     * 
     */
    RecordVersion?: RecordVersion;
  }
  export interface CreateBatchLoadTaskResponse {
    /**
     * The ID of the batch load task.
     */
    TaskId: BatchLoadTaskId;
  }
  export interface CreateDatabaseRequest {
    /**
     * The name of the Timestream database.
     */
    DatabaseName: ResourceCreateAPIName;
    /**
     * The KMS key for the database. If the KMS key is not specified, the database will be encrypted with a Timestream managed KMS key located in your account. For more information, see Amazon Web Services managed keys.
     */
    KmsKeyId?: StringValue2048;
    /**
     *  A list of key-value pairs to label the table. 
     */
    Tags?: TagList;
  }
  export interface CreateDatabaseResponse {
    /**
     * The newly created Timestream database.
     */
    Database?: Database;
  }
  export interface CreateTableRequest {
    /**
     * The name of the Timestream database.
     */
    DatabaseName: ResourceCreateAPIName;
    /**
     * The name of the Timestream table.
     */
    TableName: ResourceCreateAPIName;
    /**
     * The duration for which your time-series data must be stored in the memory store and the magnetic store.
     */
    RetentionProperties?: RetentionProperties;
    /**
     *  A list of key-value pairs to label the table. 
     */
    Tags?: TagList;
    /**
     * Contains properties to set on the table when enabling magnetic store writes.
     */
    MagneticStoreWriteProperties?: MagneticStoreWriteProperties;
    /**
     *  The schema of the table. 
     */
    Schema?: Schema;
  }
  export interface CreateTableResponse {
    /**
     * The newly created Timestream table.
     */
    Table?: Table;
  }
  export interface CsvConfiguration {
    /**
     * Column separator can be one of comma (','), pipe ('|), semicolon (';'), tab('/t'), or blank space (' '). 
     */
    ColumnSeparator?: StringValue1;
    /**
     * Escape character can be one of 
     */
    EscapeChar?: StringValue1;
    /**
     * Can be single quote (') or double quote (").
     */
    QuoteChar?: StringValue1;
    /**
     * Can be blank space (' ').
     */
    NullValue?: StringValue256;
    /**
     * Specifies to trim leading and trailing white space.
     */
    TrimWhiteSpace?: Boolean;
  }
  export interface DataModel {
    /**
     * Source column to be mapped to time.
     */
    TimeColumn?: StringValue256;
    /**
     *  The granularity of the timestamp unit. It indicates if the time value is in seconds, milliseconds, nanoseconds, or other supported values. Default is MILLISECONDS. 
     */
    TimeUnit?: TimeUnit;
    /**
     * Source to target mappings for dimensions.
     */
    DimensionMappings: DimensionMappings;
    /**
     * Source to target mappings for multi-measure records.
     */
    MultiMeasureMappings?: MultiMeasureMappings;
    /**
     * Source to target mappings for measures.
     */
    MixedMeasureMappings?: MixedMeasureMappingList;
    /**
     * 
     */
    MeasureNameColumn?: StringValue256;
  }
  export interface DataModelConfiguration {
    /**
     * 
     */
    DataModel?: DataModel;
    /**
     * 
     */
    DataModelS3Configuration?: DataModelS3Configuration;
  }
  export interface DataModelS3Configuration {
    /**
     * 
     */
    BucketName?: S3BucketName;
    /**
     * 
     */
    ObjectKey?: S3ObjectKey;
  }
  export interface DataSourceConfiguration {
    /**
     * Configuration of an S3 location for a file which contains data to load.
     */
    DataSourceS3Configuration: DataSourceS3Configuration;
    CsvConfiguration?: CsvConfiguration;
    /**
     * This is currently CSV.
     */
    DataFormat: BatchLoadDataFormat;
  }
  export interface DataSourceS3Configuration {
    /**
     * The bucket name of the customer S3 bucket.
     */
    BucketName: S3BucketName;
    /**
     *  
     */
    ObjectKeyPrefix?: S3ObjectKey;
  }
  export interface Database {
    /**
     * The Amazon Resource Name that uniquely identifies this database.
     */
    Arn?: String;
    /**
     * The name of the Timestream database.
     */
    DatabaseName?: ResourceName;
    /**
     * The total number of tables found within a Timestream database. 
     */
    TableCount?: Long;
    /**
     * The identifier of the KMS key used to encrypt the data stored in the database.
     */
    KmsKeyId?: StringValue2048;
    /**
     * The time when the database was created, calculated from the Unix epoch time.
     */
    CreationTime?: _Date;
    /**
     *  The last time that this database was updated. 
     */
    LastUpdatedTime?: _Date;
  }
  export type DatabaseList = Database[];
  export type _Date = Date;
  export interface DeleteDatabaseRequest {
    /**
     * The name of the Timestream database to be deleted.
     */
    DatabaseName: ResourceName;
  }
  export interface DeleteTableRequest {
    /**
     * The name of the database where the Timestream database is to be deleted.
     */
    DatabaseName: ResourceName;
    /**
     * The name of the Timestream table to be deleted.
     */
    TableName: ResourceName;
  }
  export interface DescribeBatchLoadTaskRequest {
    /**
     * The ID of the batch load task.
     */
    TaskId: BatchLoadTaskId;
  }
  export interface DescribeBatchLoadTaskResponse {
    /**
     * Description of the batch load task.
     */
    BatchLoadTaskDescription: BatchLoadTaskDescription;
  }
  export interface DescribeDatabaseRequest {
    /**
     * The name of the Timestream database.
     */
    DatabaseName: ResourceName;
  }
  export interface DescribeDatabaseResponse {
    /**
     * The name of the Timestream table.
     */
    Database?: Database;
  }
  export interface DescribeEndpointsRequest {
  }
  export interface DescribeEndpointsResponse {
    /**
     * An Endpoints object is returned when a DescribeEndpoints request is made.
     */
    Endpoints: Endpoints;
  }
  export interface DescribeTableRequest {
    /**
     * The name of the Timestream database.
     */
    DatabaseName: ResourceName;
    /**
     * The name of the Timestream table.
     */
    TableName: ResourceName;
  }
  export interface DescribeTableResponse {
    /**
     * The Timestream table.
     */
    Table?: Table;
  }
  export interface Dimension {
    /**
     *  Dimension represents the metadata attributes of the time series. For example, the name and Availability Zone of an EC2 instance or the name of the manufacturer of a wind turbine are dimensions.  For constraints on dimension names, see Naming Constraints.
     */
    Name: SchemaName;
    /**
     * The value of the dimension.
     */
    Value: SchemaValue;
    /**
     * The data type of the dimension for the time-series data point.
     */
    DimensionValueType?: DimensionValueType;
  }
  export interface DimensionMapping {
    /**
     * 
     */
    SourceColumn?: SchemaName;
    /**
     *  
     */
    DestinationColumn?: SchemaName;
  }
  export type DimensionMappings = DimensionMapping[];
  export type DimensionValueType = "VARCHAR"|string;
  export type Dimensions = Dimension[];
  export interface Endpoint {
    /**
     * An endpoint address.
     */
    Address: String;
    /**
     * The TTL for the endpoint, in minutes.
     */
    CachePeriodInMinutes: Long;
  }
  export type Endpoints = Endpoint[];
  export type Integer = number;
  export interface ListBatchLoadTasksRequest {
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    NextToken?: String;
    /**
     * The total number of items to return in the output. If the total number of items available is more than the value specified, a NextToken is provided in the output. To resume pagination, provide the NextToken value as argument of a subsequent API invocation.
     */
    MaxResults?: PageLimit;
    /**
     * Status of the batch load task.
     */
    TaskStatus?: BatchLoadStatus;
  }
  export interface ListBatchLoadTasksResponse {
    /**
     * A token to specify where to start paginating. Provide the next ListBatchLoadTasksRequest.
     */
    NextToken?: String;
    /**
     * A list of batch load task details.
     */
    BatchLoadTasks?: BatchLoadTaskList;
  }
  export interface ListDatabasesRequest {
    /**
     * The pagination token. To resume pagination, provide the NextToken value as argument of a subsequent API invocation.
     */
    NextToken?: String;
    /**
     * The total number of items to return in the output. If the total number of items available is more than the value specified, a NextToken is provided in the output. To resume pagination, provide the NextToken value as argument of a subsequent API invocation.
     */
    MaxResults?: PaginationLimit;
  }
  export interface ListDatabasesResponse {
    /**
     * A list of database names.
     */
    Databases?: DatabaseList;
    /**
     * The pagination token. This parameter is returned when the response is truncated.
     */
    NextToken?: String;
  }
  export interface ListTablesRequest {
    /**
     * The name of the Timestream database.
     */
    DatabaseName?: ResourceName;
    /**
     * The pagination token. To resume pagination, provide the NextToken value as argument of a subsequent API invocation.
     */
    NextToken?: String;
    /**
     * The total number of items to return in the output. If the total number of items available is more than the value specified, a NextToken is provided in the output. To resume pagination, provide the NextToken value as argument of a subsequent API invocation.
     */
    MaxResults?: PaginationLimit;
  }
  export interface ListTablesResponse {
    /**
     * A list of tables.
     */
    Tables?: TableList;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    NextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     *  The Timestream resource with tags to be listed. This value is an Amazon Resource Name (ARN). 
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     *  The tags currently associated with the Timestream resource. 
     */
    Tags?: TagList;
  }
  export type Long = number;
  export interface MagneticStoreRejectedDataLocation {
    /**
     * Configuration of an S3 location to write error reports for records rejected, asynchronously, during magnetic store writes.
     */
    S3Configuration?: S3Configuration;
  }
  export type MagneticStoreRetentionPeriodInDays = number;
  export interface MagneticStoreWriteProperties {
    /**
     * A flag to enable magnetic store writes.
     */
    EnableMagneticStoreWrites: Boolean;
    /**
     * The location to write error reports for records rejected asynchronously during magnetic store writes.
     */
    MagneticStoreRejectedDataLocation?: MagneticStoreRejectedDataLocation;
  }
  export interface MeasureValue {
    /**
     *  The name of the MeasureValue.   For constraints on MeasureValue names, see  Naming Constraints in the Amazon Timestream Developer Guide.
     */
    Name: SchemaName;
    /**
     *  The value for the MeasureValue. For information, see Data types.
     */
    Value: StringValue2048;
    /**
     * Contains the data type of the MeasureValue for the time-series data point.
     */
    Type: MeasureValueType;
  }
  export type MeasureValueType = "DOUBLE"|"BIGINT"|"VARCHAR"|"BOOLEAN"|"TIMESTAMP"|"MULTI"|string;
  export type MeasureValues = MeasureValue[];
  export type MemoryStoreRetentionPeriodInHours = number;
  export interface MixedMeasureMapping {
    /**
     * 
     */
    MeasureName?: SchemaName;
    /**
     * 
     */
    SourceColumn?: SchemaName;
    /**
     * 
     */
    TargetMeasureName?: SchemaName;
    /**
     * 
     */
    MeasureValueType: MeasureValueType;
    /**
     * 
     */
    MultiMeasureAttributeMappings?: MultiMeasureAttributeMappingList;
  }
  export type MixedMeasureMappingList = MixedMeasureMapping[];
  export interface MultiMeasureAttributeMapping {
    /**
     * 
     */
    SourceColumn: SchemaName;
    /**
     * 
     */
    TargetMultiMeasureAttributeName?: SchemaName;
    /**
     * 
     */
    MeasureValueType?: ScalarMeasureValueType;
  }
  export type MultiMeasureAttributeMappingList = MultiMeasureAttributeMapping[];
  export interface MultiMeasureMappings {
    /**
     * 
     */
    TargetMultiMeasureName?: SchemaName;
    /**
     * 
     */
    MultiMeasureAttributeMappings: MultiMeasureAttributeMappingList;
  }
  export type PageLimit = number;
  export type PaginationLimit = number;
  export interface PartitionKey {
    /**
     *  The type of the partition key. Options are DIMENSION (dimension key) and MEASURE (measure key). 
     */
    Type: PartitionKeyType;
    /**
     *  The name of the attribute used for a dimension key. 
     */
    Name?: SchemaName;
    /**
     *  The level of enforcement for the specification of a dimension key in ingested records. Options are REQUIRED (dimension key must be specified) and OPTIONAL (dimension key does not have to be specified). 
     */
    EnforcementInRecord?: PartitionKeyEnforcementLevel;
  }
  export type PartitionKeyEnforcementLevel = "REQUIRED"|"OPTIONAL"|string;
  export type PartitionKeyList = PartitionKey[];
  export type PartitionKeyType = "DIMENSION"|"MEASURE"|string;
  export interface Record {
    /**
     * Contains the list of dimensions for time-series data points.
     */
    Dimensions?: Dimensions;
    /**
     * Measure represents the data attribute of the time series. For example, the CPU utilization of an EC2 instance or the RPM of a wind turbine are measures. 
     */
    MeasureName?: SchemaName;
    /**
     *  Contains the measure value for the time-series data point. 
     */
    MeasureValue?: StringValue2048;
    /**
     *  Contains the data type of the measure value for the time-series data point. Default type is DOUBLE. For more information, see Data types.
     */
    MeasureValueType?: MeasureValueType;
    /**
     *  Contains the time at which the measure value for the data point was collected. The time value plus the unit provides the time elapsed since the epoch. For example, if the time value is 12345 and the unit is ms, then 12345 ms have elapsed since the epoch. 
     */
    Time?: StringValue256;
    /**
     *  The granularity of the timestamp unit. It indicates if the time value is in seconds, milliseconds, nanoseconds, or other supported values. Default is MILLISECONDS. 
     */
    TimeUnit?: TimeUnit;
    /**
     * 64-bit attribute used for record updates. Write requests for duplicate data with a higher version number will update the existing measure value and version. In cases where the measure value is the same, Version will still be updated. Default value is 1.   Version must be 1 or greater, or you will receive a ValidationException error. 
     */
    Version?: RecordVersion;
    /**
     *  Contains the list of MeasureValue for time-series data points.   This is only allowed for type MULTI. For scalar values, use MeasureValue attribute of the record directly. 
     */
    MeasureValues?: MeasureValues;
  }
  export type RecordVersion = number;
  export type Records = Record[];
  export interface RecordsIngested {
    /**
     * Total count of successfully ingested records.
     */
    Total?: Integer;
    /**
     * Count of records ingested into the memory store.
     */
    MemoryStore?: Integer;
    /**
     * Count of records ingested into the magnetic store.
     */
    MagneticStore?: Integer;
  }
  export interface ReportConfiguration {
    /**
     * Configuration of an S3 location to write error reports and events for a batch load.
     */
    ReportS3Configuration?: ReportS3Configuration;
  }
  export interface ReportS3Configuration {
    /**
     * 
     */
    BucketName: S3BucketName;
    /**
     * 
     */
    ObjectKeyPrefix?: S3ObjectKeyPrefix;
    /**
     * 
     */
    EncryptionOption?: S3EncryptionOption;
    /**
     * 
     */
    KmsKeyId?: StringValue2048;
  }
  export type ResourceCreateAPIName = string;
  export type ResourceName = string;
  export interface ResumeBatchLoadTaskRequest {
    /**
     * The ID of the batch load task to resume.
     */
    TaskId: BatchLoadTaskId;
  }
  export interface ResumeBatchLoadTaskResponse {
  }
  export interface RetentionProperties {
    /**
     * The duration for which data must be stored in the memory store. 
     */
    MemoryStoreRetentionPeriodInHours: MemoryStoreRetentionPeriodInHours;
    /**
     * The duration for which data must be stored in the magnetic store. 
     */
    MagneticStoreRetentionPeriodInDays: MagneticStoreRetentionPeriodInDays;
  }
  export type S3BucketName = string;
  export interface S3Configuration {
    /**
     * The bucket name of the customer S3 bucket.
     */
    BucketName?: S3BucketName;
    /**
     * The object key preview for the customer S3 location.
     */
    ObjectKeyPrefix?: S3ObjectKeyPrefix;
    /**
     * The encryption option for the customer S3 location. Options are S3 server-side encryption with an S3 managed key or Amazon Web Services managed key.
     */
    EncryptionOption?: S3EncryptionOption;
    /**
     * The KMS key ID for the customer S3 location when encrypting with an Amazon Web Services managed key.
     */
    KmsKeyId?: StringValue2048;
  }
  export type S3EncryptionOption = "SSE_S3"|"SSE_KMS"|string;
  export type S3ObjectKey = string;
  export type S3ObjectKeyPrefix = string;
  export type ScalarMeasureValueType = "DOUBLE"|"BIGINT"|"BOOLEAN"|"VARCHAR"|"TIMESTAMP"|string;
  export interface Schema {
    /**
     * A non-empty list of partition keys defining the attributes used to partition the table data. The order of the list determines the partition hierarchy. The name and type of each partition key as well as the partition key order cannot be changed after the table is created. However, the enforcement level of each partition key can be changed. 
     */
    CompositePartitionKey?: PartitionKeyList;
  }
  export type SchemaName = string;
  export type SchemaValue = string;
  export type String = string;
  export type StringValue1 = string;
  export type StringValue2048 = string;
  export type StringValue256 = string;
  export interface Table {
    /**
     * The Amazon Resource Name that uniquely identifies this table.
     */
    Arn?: String;
    /**
     * The name of the Timestream table.
     */
    TableName?: ResourceName;
    /**
     * The name of the Timestream database that contains this table.
     */
    DatabaseName?: ResourceName;
    /**
     * The current state of the table:    DELETING - The table is being deleted.    ACTIVE - The table is ready for use.  
     */
    TableStatus?: TableStatus;
    /**
     * The retention duration for the memory store and magnetic store.
     */
    RetentionProperties?: RetentionProperties;
    /**
     * The time when the Timestream table was created. 
     */
    CreationTime?: _Date;
    /**
     * The time when the Timestream table was last updated.
     */
    LastUpdatedTime?: _Date;
    /**
     * Contains properties to set on the table when enabling magnetic store writes.
     */
    MagneticStoreWriteProperties?: MagneticStoreWriteProperties;
    /**
     *  The schema of the table. 
     */
    Schema?: Schema;
  }
  export type TableList = Table[];
  export type TableStatus = "ACTIVE"|"DELETING"|"RESTORING"|string;
  export interface Tag {
    /**
     *  The key of the tag. Tag keys are case sensitive. 
     */
    Key: TagKey;
    /**
     *  The value of the tag. Tag values are case-sensitive and can be null. 
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     *  Identifies the Timestream resource to which tags should be added. This value is an Amazon Resource Name (ARN). 
     */
    ResourceARN: AmazonResourceName;
    /**
     *  The tags to be assigned to the Timestream resource. 
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TimeUnit = "MILLISECONDS"|"SECONDS"|"MICROSECONDS"|"NANOSECONDS"|string;
  export interface UntagResourceRequest {
    /**
     *  The Timestream resource that the tags will be removed from. This value is an Amazon Resource Name (ARN). 
     */
    ResourceARN: AmazonResourceName;
    /**
     *  A list of tags keys. Existing tags of the resource whose keys are members of this list will be removed from the Timestream resource. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDatabaseRequest {
    /**
     *  The name of the database. 
     */
    DatabaseName: ResourceName;
    /**
     *  The identifier of the new KMS key (KmsKeyId) to be used to encrypt the data stored in the database. If the KmsKeyId currently registered with the database is the same as the KmsKeyId in the request, there will not be any update.  You can specify the KmsKeyId using any of the following:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-1:111122223333:alias/ExampleAlias   
     */
    KmsKeyId: StringValue2048;
  }
  export interface UpdateDatabaseResponse {
    Database?: Database;
  }
  export interface UpdateTableRequest {
    /**
     * The name of the Timestream database.
     */
    DatabaseName: ResourceName;
    /**
     * The name of the Timestream table.
     */
    TableName: ResourceName;
    /**
     * The retention duration of the memory store and the magnetic store.
     */
    RetentionProperties?: RetentionProperties;
    /**
     * Contains properties to set on the table when enabling magnetic store writes.
     */
    MagneticStoreWriteProperties?: MagneticStoreWriteProperties;
    /**
     *  The schema of the table. 
     */
    Schema?: Schema;
  }
  export interface UpdateTableResponse {
    /**
     * The updated Timestream table.
     */
    Table?: Table;
  }
  export interface WriteRecordsRequest {
    /**
     * The name of the Timestream database.
     */
    DatabaseName: ResourceName;
    /**
     * The name of the Timestream table.
     */
    TableName: ResourceName;
    /**
     * A record that contains the common measure, dimension, time, and version attributes shared across all the records in the request. The measure and dimension attributes specified will be merged with the measure and dimension attributes in the records object when the data is written into Timestream. Dimensions may not overlap, or a ValidationException will be thrown. In other words, a record must contain dimensions with unique names. 
     */
    CommonAttributes?: Record;
    /**
     * An array of records that contain the unique measure, dimension, time, and version attributes for each time-series data point. 
     */
    Records: Records;
  }
  export interface WriteRecordsResponse {
    /**
     * Information on the records ingested by this request.
     */
    RecordsIngested?: RecordsIngested;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-11-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the TimestreamWrite client.
   */
  export import Types = TimestreamWrite;
}
export = TimestreamWrite;
