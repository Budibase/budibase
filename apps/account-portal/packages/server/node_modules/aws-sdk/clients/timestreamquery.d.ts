import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class TimestreamQuery extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: TimestreamQuery.Types.ClientConfiguration)
  config: Config & TimestreamQuery.Types.ClientConfiguration;
  /**
   *  Cancels a query that has been issued. Cancellation is provided only if the query has not completed running before the cancellation request was issued. Because cancellation is an idempotent operation, subsequent cancellation requests will return a CancellationMessage, indicating that the query has already been canceled. See code sample for details. 
   */
  cancelQuery(params: TimestreamQuery.Types.CancelQueryRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.CancelQueryResponse) => void): Request<TimestreamQuery.Types.CancelQueryResponse, AWSError>;
  /**
   *  Cancels a query that has been issued. Cancellation is provided only if the query has not completed running before the cancellation request was issued. Because cancellation is an idempotent operation, subsequent cancellation requests will return a CancellationMessage, indicating that the query has already been canceled. See code sample for details. 
   */
  cancelQuery(callback?: (err: AWSError, data: TimestreamQuery.Types.CancelQueryResponse) => void): Request<TimestreamQuery.Types.CancelQueryResponse, AWSError>;
  /**
   *  Create a scheduled query that will be run on your behalf at the configured schedule. Timestream assumes the execution role provided as part of the ScheduledQueryExecutionRoleArn parameter to run the query. You can use the NotificationConfiguration parameter to configure notification for your scheduled query operations.
   */
  createScheduledQuery(params: TimestreamQuery.Types.CreateScheduledQueryRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.CreateScheduledQueryResponse) => void): Request<TimestreamQuery.Types.CreateScheduledQueryResponse, AWSError>;
  /**
   *  Create a scheduled query that will be run on your behalf at the configured schedule. Timestream assumes the execution role provided as part of the ScheduledQueryExecutionRoleArn parameter to run the query. You can use the NotificationConfiguration parameter to configure notification for your scheduled query operations.
   */
  createScheduledQuery(callback?: (err: AWSError, data: TimestreamQuery.Types.CreateScheduledQueryResponse) => void): Request<TimestreamQuery.Types.CreateScheduledQueryResponse, AWSError>;
  /**
   * Deletes a given scheduled query. This is an irreversible operation. 
   */
  deleteScheduledQuery(params: TimestreamQuery.Types.DeleteScheduledQueryRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a given scheduled query. This is an irreversible operation. 
   */
  deleteScheduledQuery(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * DescribeEndpoints returns a list of available endpoints to make Timestream API calls against. This API is available through both Write and Query. Because the Timestream SDKs are designed to transparently work with the service’s architecture, including the management and mapping of the service endpoints, it is not recommended that you use this API unless:   You are using VPC endpoints (Amazon Web Services PrivateLink) with Timestream     Your application uses a programming language that does not yet have SDK support   You require better control over the client-side implementation   For detailed information on how and when to use and implement DescribeEndpoints, see The Endpoint Discovery Pattern.
   */
  describeEndpoints(params: TimestreamQuery.Types.DescribeEndpointsRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.DescribeEndpointsResponse) => void): Request<TimestreamQuery.Types.DescribeEndpointsResponse, AWSError>;
  /**
   * DescribeEndpoints returns a list of available endpoints to make Timestream API calls against. This API is available through both Write and Query. Because the Timestream SDKs are designed to transparently work with the service’s architecture, including the management and mapping of the service endpoints, it is not recommended that you use this API unless:   You are using VPC endpoints (Amazon Web Services PrivateLink) with Timestream     Your application uses a programming language that does not yet have SDK support   You require better control over the client-side implementation   For detailed information on how and when to use and implement DescribeEndpoints, see The Endpoint Discovery Pattern.
   */
  describeEndpoints(callback?: (err: AWSError, data: TimestreamQuery.Types.DescribeEndpointsResponse) => void): Request<TimestreamQuery.Types.DescribeEndpointsResponse, AWSError>;
  /**
   * Provides detailed information about a scheduled query.
   */
  describeScheduledQuery(params: TimestreamQuery.Types.DescribeScheduledQueryRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.DescribeScheduledQueryResponse) => void): Request<TimestreamQuery.Types.DescribeScheduledQueryResponse, AWSError>;
  /**
   * Provides detailed information about a scheduled query.
   */
  describeScheduledQuery(callback?: (err: AWSError, data: TimestreamQuery.Types.DescribeScheduledQueryResponse) => void): Request<TimestreamQuery.Types.DescribeScheduledQueryResponse, AWSError>;
  /**
   *  You can use this API to run a scheduled query manually. 
   */
  executeScheduledQuery(params: TimestreamQuery.Types.ExecuteScheduledQueryRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  You can use this API to run a scheduled query manually. 
   */
  executeScheduledQuery(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets a list of all scheduled queries in the caller's Amazon account and Region. ListScheduledQueries is eventually consistent. 
   */
  listScheduledQueries(params: TimestreamQuery.Types.ListScheduledQueriesRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.ListScheduledQueriesResponse) => void): Request<TimestreamQuery.Types.ListScheduledQueriesResponse, AWSError>;
  /**
   * Gets a list of all scheduled queries in the caller's Amazon account and Region. ListScheduledQueries is eventually consistent. 
   */
  listScheduledQueries(callback?: (err: AWSError, data: TimestreamQuery.Types.ListScheduledQueriesResponse) => void): Request<TimestreamQuery.Types.ListScheduledQueriesResponse, AWSError>;
  /**
   * List all tags on a Timestream query resource.
   */
  listTagsForResource(params: TimestreamQuery.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.ListTagsForResourceResponse) => void): Request<TimestreamQuery.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List all tags on a Timestream query resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: TimestreamQuery.Types.ListTagsForResourceResponse) => void): Request<TimestreamQuery.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * A synchronous operation that allows you to submit a query with parameters to be stored by Timestream for later running. Timestream only supports using this operation with the PrepareQueryRequest$ValidateOnly set to true. 
   */
  prepareQuery(params: TimestreamQuery.Types.PrepareQueryRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.PrepareQueryResponse) => void): Request<TimestreamQuery.Types.PrepareQueryResponse, AWSError>;
  /**
   * A synchronous operation that allows you to submit a query with parameters to be stored by Timestream for later running. Timestream only supports using this operation with the PrepareQueryRequest$ValidateOnly set to true. 
   */
  prepareQuery(callback?: (err: AWSError, data: TimestreamQuery.Types.PrepareQueryResponse) => void): Request<TimestreamQuery.Types.PrepareQueryResponse, AWSError>;
  /**
   *  Query is a synchronous operation that enables you to run a query against your Amazon Timestream data. Query will time out after 60 seconds. You must update the default timeout in the SDK to support a timeout of 60 seconds. See the code sample for details.  Your query request will fail in the following cases:    If you submit a Query request with the same client token outside of the 5-minute idempotency window.     If you submit a Query request with the same client token, but change other parameters, within the 5-minute idempotency window.     If the size of the row (including the query metadata) exceeds 1 MB, then the query will fail with the following error message:   Query aborted as max page response size has been exceeded by the output result row     If the IAM principal of the query initiator and the result reader are not the same and/or the query initiator and the result reader do not have the same query string in the query requests, the query will fail with an Invalid pagination token error.   
   */
  query(params: TimestreamQuery.Types.QueryRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.QueryResponse) => void): Request<TimestreamQuery.Types.QueryResponse, AWSError>;
  /**
   *  Query is a synchronous operation that enables you to run a query against your Amazon Timestream data. Query will time out after 60 seconds. You must update the default timeout in the SDK to support a timeout of 60 seconds. See the code sample for details.  Your query request will fail in the following cases:    If you submit a Query request with the same client token outside of the 5-minute idempotency window.     If you submit a Query request with the same client token, but change other parameters, within the 5-minute idempotency window.     If the size of the row (including the query metadata) exceeds 1 MB, then the query will fail with the following error message:   Query aborted as max page response size has been exceeded by the output result row     If the IAM principal of the query initiator and the result reader are not the same and/or the query initiator and the result reader do not have the same query string in the query requests, the query will fail with an Invalid pagination token error.   
   */
  query(callback?: (err: AWSError, data: TimestreamQuery.Types.QueryResponse) => void): Request<TimestreamQuery.Types.QueryResponse, AWSError>;
  /**
   * Associate a set of tags with a Timestream resource. You can then activate these user-defined tags so that they appear on the Billing and Cost Management console for cost allocation tracking. 
   */
  tagResource(params: TimestreamQuery.Types.TagResourceRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.TagResourceResponse) => void): Request<TimestreamQuery.Types.TagResourceResponse, AWSError>;
  /**
   * Associate a set of tags with a Timestream resource. You can then activate these user-defined tags so that they appear on the Billing and Cost Management console for cost allocation tracking. 
   */
  tagResource(callback?: (err: AWSError, data: TimestreamQuery.Types.TagResourceResponse) => void): Request<TimestreamQuery.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the association of tags from a Timestream query resource.
   */
  untagResource(params: TimestreamQuery.Types.UntagResourceRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.UntagResourceResponse) => void): Request<TimestreamQuery.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the association of tags from a Timestream query resource.
   */
  untagResource(callback?: (err: AWSError, data: TimestreamQuery.Types.UntagResourceResponse) => void): Request<TimestreamQuery.Types.UntagResourceResponse, AWSError>;
  /**
   * Update a scheduled query.
   */
  updateScheduledQuery(params: TimestreamQuery.Types.UpdateScheduledQueryRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Update a scheduled query.
   */
  updateScheduledQuery(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace TimestreamQuery {
  export type AmazonResourceName = string;
  export interface CancelQueryRequest {
    /**
     *  The ID of the query that needs to be cancelled. QueryID is returned as part of the query result. 
     */
    QueryId: QueryId;
  }
  export interface CancelQueryResponse {
    /**
     *  A CancellationMessage is returned when a CancelQuery request for the query specified by QueryId has already been issued. 
     */
    CancellationMessage?: String;
  }
  export type ClientRequestToken = string;
  export type ClientToken = string;
  export interface ColumnInfo {
    /**
     *  The name of the result set column. The name of the result set is available for columns of all data types except for arrays. 
     */
    Name?: String;
    /**
     * The data type of the result set column. The data type can be a scalar or complex. Scalar data types are integers, strings, doubles, Booleans, and others. Complex data types are types such as arrays, rows, and others. 
     */
    Type: Type;
  }
  export type ColumnInfoList = ColumnInfo[];
  export interface CreateScheduledQueryRequest {
    /**
     * Name of the scheduled query.
     */
    Name: ScheduledQueryName;
    /**
     * The query string to run. Parameter names can be specified in the query string @ character followed by an identifier. The named Parameter @scheduled_runtime is reserved and can be used in the query to get the time at which the query is scheduled to run. The timestamp calculated according to the ScheduleConfiguration parameter, will be the value of @scheduled_runtime paramater for each query run. For example, consider an instance of a scheduled query executing on 2021-12-01 00:00:00. For this instance, the @scheduled_runtime parameter is initialized to the timestamp 2021-12-01 00:00:00 when invoking the query.
     */
    QueryString: QueryString;
    /**
     * The schedule configuration for the query.
     */
    ScheduleConfiguration: ScheduleConfiguration;
    /**
     * Notification configuration for the scheduled query. A notification is sent by Timestream when a query run finishes, when the state is updated or when you delete it. 
     */
    NotificationConfiguration: NotificationConfiguration;
    /**
     * Configuration used for writing the result of a query.
     */
    TargetConfiguration?: TargetConfiguration;
    /**
     * Using a ClientToken makes the call to CreateScheduledQuery idempotent, in other words, making the same request repeatedly will produce the same result. Making multiple identical CreateScheduledQuery requests has the same effect as making a single request.     If CreateScheduledQuery is called without a ClientToken, the Query SDK generates a ClientToken on your behalf.    After 8 hours, any request with the same ClientToken is treated as a new request.   
     */
    ClientToken?: ClientToken;
    /**
     * The ARN for the IAM role that Timestream will assume when running the scheduled query. 
     */
    ScheduledQueryExecutionRoleArn: AmazonResourceName;
    /**
     * A list of key-value pairs to label the scheduled query.
     */
    Tags?: TagList;
    /**
     * The Amazon KMS key used to encrypt the scheduled query resource, at-rest. If the Amazon KMS key is not specified, the scheduled query resource will be encrypted with a Timestream owned Amazon KMS key. To specify a KMS key, use the key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix the name with alias/  If ErrorReportConfiguration uses SSE_KMS as encryption type, the same KmsKeyId is used to encrypt the error report at rest.
     */
    KmsKeyId?: StringValue2048;
    /**
     * Configuration for error reporting. Error reports will be generated when a problem is encountered when writing the query results. 
     */
    ErrorReportConfiguration: ErrorReportConfiguration;
  }
  export interface CreateScheduledQueryResponse {
    /**
     * ARN for the created scheduled query.
     */
    Arn: AmazonResourceName;
  }
  export interface Datum {
    /**
     *  Indicates if the data point is a scalar value such as integer, string, double, or Boolean. 
     */
    ScalarValue?: ScalarValue;
    /**
     *  Indicates if the data point is a timeseries data type. 
     */
    TimeSeriesValue?: TimeSeriesDataPointList;
    /**
     *  Indicates if the data point is an array. 
     */
    ArrayValue?: DatumList;
    /**
     *  Indicates if the data point is a row. 
     */
    RowValue?: Row;
    /**
     *  Indicates if the data point is null. 
     */
    NullValue?: NullableBoolean;
  }
  export type DatumList = Datum[];
  export interface DeleteScheduledQueryRequest {
    /**
     * The ARN of the scheduled query. 
     */
    ScheduledQueryArn: AmazonResourceName;
  }
  export interface DescribeEndpointsRequest {
  }
  export interface DescribeEndpointsResponse {
    /**
     * An Endpoints object is returned when a DescribeEndpoints request is made.
     */
    Endpoints: Endpoints;
  }
  export interface DescribeScheduledQueryRequest {
    /**
     * The ARN of the scheduled query.
     */
    ScheduledQueryArn: AmazonResourceName;
  }
  export interface DescribeScheduledQueryResponse {
    /**
     * The scheduled query.
     */
    ScheduledQuery: ScheduledQueryDescription;
  }
  export interface DimensionMapping {
    /**
     * Column name from query result.
     */
    Name: SchemaName;
    /**
     * Type for the dimension. 
     */
    DimensionValueType: DimensionValueType;
  }
  export type DimensionMappingList = DimensionMapping[];
  export type DimensionValueType = "VARCHAR"|string;
  export type Double = number;
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
  export type ErrorMessage = string;
  export interface ErrorReportConfiguration {
    /**
     * The S3 configuration for the error reports.
     */
    S3Configuration: S3Configuration;
  }
  export interface ErrorReportLocation {
    /**
     * The S3 location where error reports are written.
     */
    S3ReportLocation?: S3ReportLocation;
  }
  export interface ExecuteScheduledQueryRequest {
    /**
     * ARN of the scheduled query.
     */
    ScheduledQueryArn: AmazonResourceName;
    /**
     * The timestamp in UTC. Query will be run as if it was invoked at this timestamp. 
     */
    InvocationTime: Time;
    /**
     * Not used. 
     */
    ClientToken?: ClientToken;
  }
  export interface ExecutionStats {
    /**
     * Total time, measured in milliseconds, that was needed for the scheduled query run to complete.
     */
    ExecutionTimeInMillis?: Long;
    /**
     * Data writes metered for records ingested in a single scheduled query run.
     */
    DataWrites?: Long;
    /**
     * Bytes metered for a single scheduled query run.
     */
    BytesMetered?: Long;
    /**
     * The number of records ingested for a single scheduled query run. 
     */
    RecordsIngested?: Long;
    /**
     * Number of rows present in the output from running a query before ingestion to destination data source.
     */
    QueryResultRows?: Long;
  }
  export interface ListScheduledQueriesRequest {
    /**
     * The maximum number of items to return in the output. If the total number of items available is more than the value specified, a NextToken is provided in the output. To resume pagination, provide the NextToken value as the argument to the subsequent call to ListScheduledQueriesRequest.
     */
    MaxResults?: MaxScheduledQueriesResults;
    /**
     *  A pagination token to resume pagination.
     */
    NextToken?: NextScheduledQueriesResultsToken;
  }
  export interface ListScheduledQueriesResponse {
    /**
     * A list of scheduled queries.
     */
    ScheduledQueries: ScheduledQueryList;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    NextToken?: NextScheduledQueriesResultsToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Timestream resource with tags to be listed. This value is an Amazon Resource Name (ARN).
     */
    ResourceARN: AmazonResourceName;
    /**
     * The maximum number of tags to return.
     */
    MaxResults?: MaxTagsForResourceResult;
    /**
     * A pagination token to resume pagination.
     */
    NextToken?: NextTagsForResourceResultsToken;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags currently associated with the Timestream resource. 
     */
    Tags: TagList;
    /**
     * A pagination token to resume pagination with a subsequent call to ListTagsForResourceResponse.
     */
    NextToken?: NextTagsForResourceResultsToken;
  }
  export type Long = number;
  export type MaxQueryResults = number;
  export type MaxScheduledQueriesResults = number;
  export type MaxTagsForResourceResult = number;
  export type MeasureValueType = "BIGINT"|"BOOLEAN"|"DOUBLE"|"VARCHAR"|"MULTI"|string;
  export interface MixedMeasureMapping {
    /**
     * Refers to the value of measure_name in a result row. This field is required if MeasureNameColumn is provided.
     */
    MeasureName?: SchemaName;
    /**
     * This field refers to the source column from which measure-value is to be read for result materialization.
     */
    SourceColumn?: SchemaName;
    /**
     * Target measure name to be used. If not provided, the target measure name by default would be measure-name if provided, or sourceColumn otherwise. 
     */
    TargetMeasureName?: SchemaName;
    /**
     * Type of the value that is to be read from sourceColumn. If the mapping is for MULTI, use MeasureValueType.MULTI.
     */
    MeasureValueType: MeasureValueType;
    /**
     * Required when measureValueType is MULTI. Attribute mappings for MULTI value measures.
     */
    MultiMeasureAttributeMappings?: MultiMeasureAttributeMappingList;
  }
  export type MixedMeasureMappingList = MixedMeasureMapping[];
  export interface MultiMeasureAttributeMapping {
    /**
     * Source column from where the attribute value is to be read.
     */
    SourceColumn: SchemaName;
    /**
     * Custom name to be used for attribute name in derived table. If not provided, source column name would be used.
     */
    TargetMultiMeasureAttributeName?: SchemaName;
    /**
     * Type of the attribute to be read from the source column.
     */
    MeasureValueType: ScalarMeasureValueType;
  }
  export type MultiMeasureAttributeMappingList = MultiMeasureAttributeMapping[];
  export interface MultiMeasureMappings {
    /**
     * The name of the target multi-measure name in the derived table. This input is required when measureNameColumn is not provided. If MeasureNameColumn is provided, then value from that column will be used as multi-measure name.
     */
    TargetMultiMeasureName?: SchemaName;
    /**
     * Required. Attribute mappings to be used for mapping query results to ingest data for multi-measure attributes.
     */
    MultiMeasureAttributeMappings: MultiMeasureAttributeMappingList;
  }
  export type NextScheduledQueriesResultsToken = string;
  export type NextTagsForResourceResultsToken = string;
  export interface NotificationConfiguration {
    /**
     * Details on SNS configuration. 
     */
    SnsConfiguration: SnsConfiguration;
  }
  export type NullableBoolean = boolean;
  export type PaginationToken = string;
  export interface ParameterMapping {
    /**
     * Parameter name.
     */
    Name: String;
    Type: Type;
  }
  export type ParameterMappingList = ParameterMapping[];
  export interface PrepareQueryRequest {
    /**
     * The Timestream query string that you want to use as a prepared statement. Parameter names can be specified in the query string @ character followed by an identifier. 
     */
    QueryString: QueryString;
    /**
     * By setting this value to true, Timestream will only validate that the query string is a valid Timestream query, and not store the prepared query for later use.
     */
    ValidateOnly?: NullableBoolean;
  }
  export interface PrepareQueryResponse {
    /**
     * The query string that you want prepare.
     */
    QueryString: QueryString;
    /**
     * A list of SELECT clause columns of the submitted query string. 
     */
    Columns: SelectColumnList;
    /**
     * A list of parameters used in the submitted query string. 
     */
    Parameters: ParameterMappingList;
  }
  export type QueryId = string;
  export interface QueryRequest {
    /**
     *  The query to be run by Timestream. 
     */
    QueryString: QueryString;
    /**
     *  Unique, case-sensitive string of up to 64 ASCII characters specified when a Query request is made. Providing a ClientToken makes the call to Query idempotent. This means that running the same query repeatedly will produce the same result. In other words, making multiple identical Query requests has the same effect as making a single request. When using ClientToken in a query, note the following:     If the Query API is instantiated without a ClientToken, the Query SDK generates a ClientToken on your behalf.   If the Query invocation only contains the ClientToken but does not include a NextToken, that invocation of Query is assumed to be a new query run.   If the invocation contains NextToken, that particular invocation is assumed to be a subsequent invocation of a prior call to the Query API, and a result set is returned.    After 4 hours, any request with the same ClientToken is treated as a new request.   
     */
    ClientToken?: ClientRequestToken;
    /**
     *  A pagination token used to return a set of results. When the Query API is invoked using NextToken, that particular invocation is assumed to be a subsequent invocation of a prior call to Query, and a result set is returned. However, if the Query invocation only contains the ClientToken, that invocation of Query is assumed to be a new query run.  Note the following when using NextToken in a query:   A pagination token can be used for up to five Query invocations, OR for a duration of up to 1 hour – whichever comes first.   Using the same NextToken will return the same set of records. To keep paginating through the result set, you must to use the most recent nextToken.   Suppose a Query invocation returns two NextToken values, TokenA and TokenB. If TokenB is used in a subsequent Query invocation, then TokenA is invalidated and cannot be reused.   To request a previous result set from a query after pagination has begun, you must re-invoke the Query API.   The latest NextToken should be used to paginate until null is returned, at which point a new NextToken should be used.    If the IAM principal of the query initiator and the result reader are not the same and/or the query initiator and the result reader do not have the same query string in the query requests, the query will fail with an Invalid pagination token error.   
     */
    NextToken?: PaginationToken;
    /**
     *  The total number of rows to be returned in the Query output. The initial run of Query with a MaxRows value specified will return the result set of the query in two cases:    The size of the result is less than 1MB.   The number of rows in the result set is less than the value of maxRows.   Otherwise, the initial invocation of Query only returns a NextToken, which can then be used in subsequent calls to fetch the result set. To resume pagination, provide the NextToken value in the subsequent command. If the row size is large (e.g. a row has many columns), Timestream may return fewer rows to keep the response size from exceeding the 1 MB limit. If MaxRows is not provided, Timestream will send the necessary number of rows to meet the 1 MB limit.
     */
    MaxRows?: MaxQueryResults;
  }
  export interface QueryResponse {
    /**
     *  A unique ID for the given query. 
     */
    QueryId: QueryId;
    /**
     *  A pagination token that can be used again on a Query call to get the next set of results. 
     */
    NextToken?: PaginationToken;
    /**
     *  The result set rows returned by the query. 
     */
    Rows: RowList;
    /**
     *  The column data types of the returned result set. 
     */
    ColumnInfo: ColumnInfoList;
    /**
     * Information about the status of the query, including progress and bytes scanned.
     */
    QueryStatus?: QueryStatus;
  }
  export interface QueryStatus {
    /**
     * The progress of the query, expressed as a percentage.
     */
    ProgressPercentage?: Double;
    /**
     * The amount of data scanned by the query in bytes. This is a cumulative sum and represents the total amount of bytes scanned since the query was started. 
     */
    CumulativeBytesScanned?: Long;
    /**
     * The amount of data scanned by the query in bytes that you will be charged for. This is a cumulative sum and represents the total amount of data that you will be charged for since the query was started. The charge is applied only once and is either applied when the query completes running or when the query is cancelled. 
     */
    CumulativeBytesMetered?: Long;
  }
  export type QueryString = string;
  export type ResourceName = string;
  export interface Row {
    /**
     * List of data points in a single row of the result set.
     */
    Data: DatumList;
  }
  export type RowList = Row[];
  export type S3BucketName = string;
  export interface S3Configuration {
    /**
     *  Name of the S3 bucket under which error reports will be created.
     */
    BucketName: S3BucketName;
    /**
     *  Prefix for the error report key. Timestream by default adds the following prefix to the error report path. 
     */
    ObjectKeyPrefix?: S3ObjectKeyPrefix;
    /**
     *  Encryption at rest options for the error reports. If no encryption option is specified, Timestream will choose SSE_S3 as default. 
     */
    EncryptionOption?: S3EncryptionOption;
  }
  export type S3EncryptionOption = "SSE_S3"|"SSE_KMS"|string;
  export type S3ObjectKey = string;
  export type S3ObjectKeyPrefix = string;
  export interface S3ReportLocation {
    /**
     *  S3 bucket name. 
     */
    BucketName?: S3BucketName;
    /**
     * S3 key. 
     */
    ObjectKey?: S3ObjectKey;
  }
  export type ScalarMeasureValueType = "BIGINT"|"BOOLEAN"|"DOUBLE"|"VARCHAR"|"TIMESTAMP"|string;
  export type ScalarType = "VARCHAR"|"BOOLEAN"|"BIGINT"|"DOUBLE"|"TIMESTAMP"|"DATE"|"TIME"|"INTERVAL_DAY_TO_SECOND"|"INTERVAL_YEAR_TO_MONTH"|"UNKNOWN"|"INTEGER"|string;
  export type ScalarValue = string;
  export interface ScheduleConfiguration {
    /**
     * An expression that denotes when to trigger the scheduled query run. This can be a cron expression or a rate expression. 
     */
    ScheduleExpression: ScheduleExpression;
  }
  export type ScheduleExpression = string;
  export interface ScheduledQuery {
    /**
     * The Amazon Resource Name.
     */
    Arn: AmazonResourceName;
    /**
     * The name of the scheduled query.
     */
    Name: ScheduledQueryName;
    /**
     * The creation time of the scheduled query.
     */
    CreationTime?: Time;
    /**
     * State of scheduled query. 
     */
    State: ScheduledQueryState;
    /**
     * The last time the scheduled query was run.
     */
    PreviousInvocationTime?: Time;
    /**
     * The next time the scheduled query is to be run.
     */
    NextInvocationTime?: Time;
    /**
     * Configuration for scheduled query error reporting.
     */
    ErrorReportConfiguration?: ErrorReportConfiguration;
    /**
     * Target data source where final scheduled query result will be written.
     */
    TargetDestination?: TargetDestination;
    /**
     * Status of the last scheduled query run.
     */
    LastRunStatus?: ScheduledQueryRunStatus;
  }
  export interface ScheduledQueryDescription {
    /**
     * Scheduled query ARN.
     */
    Arn: AmazonResourceName;
    /**
     * Name of the scheduled query.
     */
    Name: ScheduledQueryName;
    /**
     * The query to be run.
     */
    QueryString: QueryString;
    /**
     * Creation time of the scheduled query.
     */
    CreationTime?: Time;
    /**
     * State of the scheduled query. 
     */
    State: ScheduledQueryState;
    /**
     * Last time the query was run.
     */
    PreviousInvocationTime?: Time;
    /**
     * The next time the scheduled query is scheduled to run.
     */
    NextInvocationTime?: Time;
    /**
     * Schedule configuration.
     */
    ScheduleConfiguration: ScheduleConfiguration;
    /**
     * Notification configuration.
     */
    NotificationConfiguration: NotificationConfiguration;
    /**
     * Scheduled query target store configuration.
     */
    TargetConfiguration?: TargetConfiguration;
    /**
     * IAM role that Timestream uses to run the schedule query.
     */
    ScheduledQueryExecutionRoleArn?: AmazonResourceName;
    /**
     * A customer provided KMS key used to encrypt the scheduled query resource.
     */
    KmsKeyId?: StringValue2048;
    /**
     * Error-reporting configuration for the scheduled query.
     */
    ErrorReportConfiguration?: ErrorReportConfiguration;
    /**
     * Runtime summary for the last scheduled query run. 
     */
    LastRunSummary?: ScheduledQueryRunSummary;
    /**
     * Runtime summary for the last five failed scheduled query runs.
     */
    RecentlyFailedRuns?: ScheduledQueryRunSummaryList;
  }
  export type ScheduledQueryList = ScheduledQuery[];
  export type ScheduledQueryName = string;
  export type ScheduledQueryRunStatus = "AUTO_TRIGGER_SUCCESS"|"AUTO_TRIGGER_FAILURE"|"MANUAL_TRIGGER_SUCCESS"|"MANUAL_TRIGGER_FAILURE"|string;
  export interface ScheduledQueryRunSummary {
    /**
     * InvocationTime for this run. This is the time at which the query is scheduled to run. Parameter @scheduled_runtime can be used in the query to get the value. 
     */
    InvocationTime?: Time;
    /**
     * The actual time when the query was run.
     */
    TriggerTime?: Time;
    /**
     * The status of a scheduled query run.
     */
    RunStatus?: ScheduledQueryRunStatus;
    /**
     * Runtime statistics for a scheduled run.
     */
    ExecutionStats?: ExecutionStats;
    /**
     * S3 location for error report.
     */
    ErrorReportLocation?: ErrorReportLocation;
    /**
     * Error message for the scheduled query in case of failure. You might have to look at the error report to get more detailed error reasons. 
     */
    FailureReason?: ErrorMessage;
  }
  export type ScheduledQueryRunSummaryList = ScheduledQueryRunSummary[];
  export type ScheduledQueryState = "ENABLED"|"DISABLED"|string;
  export type SchemaName = string;
  export interface SelectColumn {
    /**
     * Name of the column.
     */
    Name?: String;
    Type?: Type;
    /**
     *  Database that has this column.
     */
    DatabaseName?: ResourceName;
    /**
     * Table within the database that has this column. 
     */
    TableName?: ResourceName;
    /**
     * True, if the column name was aliased by the query. False otherwise.
     */
    Aliased?: NullableBoolean;
  }
  export type SelectColumnList = SelectColumn[];
  export interface SnsConfiguration {
    /**
     * SNS topic ARN that the scheduled query status notifications will be sent to.
     */
    TopicArn: AmazonResourceName;
  }
  export type String = string;
  export type StringValue2048 = string;
  export interface Tag {
    /**
     * The key of the tag. Tag keys are case sensitive. 
     */
    Key: TagKey;
    /**
     * The value of the tag. Tag values are case sensitive and can be null. 
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * Identifies the Timestream resource to which tags should be added. This value is an Amazon Resource Name (ARN).
     */
    ResourceARN: AmazonResourceName;
    /**
     * The tags to be assigned to the Timestream resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TargetConfiguration {
    /**
     * Configuration needed to write data into the Timestream database and table.
     */
    TimestreamConfiguration: TimestreamConfiguration;
  }
  export interface TargetDestination {
    /**
     * Query result destination details for Timestream data source.
     */
    TimestreamDestination?: TimestreamDestination;
  }
  export type Time = Date;
  export interface TimeSeriesDataPoint {
    /**
     * The timestamp when the measure value was collected.
     */
    Time: Timestamp;
    /**
     * The measure value for the data point.
     */
    Value: Datum;
  }
  export type TimeSeriesDataPointList = TimeSeriesDataPoint[];
  export type Timestamp = string;
  export interface TimestreamConfiguration {
    /**
     * Name of Timestream database to which the query result will be written.
     */
    DatabaseName: ResourceName;
    /**
     * Name of Timestream table that the query result will be written to. The table should be within the same database that is provided in Timestream configuration.
     */
    TableName: ResourceName;
    /**
     * Column from query result that should be used as the time column in destination table. Column type for this should be TIMESTAMP.
     */
    TimeColumn: SchemaName;
    /**
     *  This is to allow mapping column(s) from the query result to the dimension in the destination table. 
     */
    DimensionMappings: DimensionMappingList;
    /**
     * Multi-measure mappings.
     */
    MultiMeasureMappings?: MultiMeasureMappings;
    /**
     * Specifies how to map measures to multi-measure records.
     */
    MixedMeasureMappings?: MixedMeasureMappingList;
    /**
     * Name of the measure column.
     */
    MeasureNameColumn?: SchemaName;
  }
  export interface TimestreamDestination {
    /**
     * Timestream database name. 
     */
    DatabaseName?: ResourceName;
    /**
     * Timestream table name. 
     */
    TableName?: ResourceName;
  }
  export interface Type {
    /**
     * Indicates if the column is of type string, integer, Boolean, double, timestamp, date, time. 
     */
    ScalarType?: ScalarType;
    /**
     * Indicates if the column is an array.
     */
    ArrayColumnInfo?: ColumnInfo;
    /**
     * Indicates if the column is a timeseries data type.
     */
    TimeSeriesMeasureValueColumnInfo?: ColumnInfo;
    /**
     * Indicates if the column is a row.
     */
    RowColumnInfo?: ColumnInfoList;
  }
  export interface UntagResourceRequest {
    /**
     * The Timestream resource that the tags will be removed from. This value is an Amazon Resource Name (ARN). 
     */
    ResourceARN: AmazonResourceName;
    /**
     * A list of tags keys. Existing tags of the resource whose keys are members of this list will be removed from the Timestream resource. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateScheduledQueryRequest {
    /**
     * ARN of the scheuled query.
     */
    ScheduledQueryArn: AmazonResourceName;
    /**
     * State of the scheduled query. 
     */
    State: ScheduledQueryState;
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
   * Contains interfaces for use with the TimestreamQuery client.
   */
  export import Types = TimestreamQuery;
}
export = TimestreamQuery;
