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
   *  Cancels a query that has been issued. Cancellation is guaranteed only if the query has not completed execution before the cancellation request was issued. Because cancellation is an idempotent operation, subsequent cancellation requests will return a CancellationMessage, indicating that the query has already been canceled. 
   */
  cancelQuery(params: TimestreamQuery.Types.CancelQueryRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.CancelQueryResponse) => void): Request<TimestreamQuery.Types.CancelQueryResponse, AWSError>;
  /**
   *  Cancels a query that has been issued. Cancellation is guaranteed only if the query has not completed execution before the cancellation request was issued. Because cancellation is an idempotent operation, subsequent cancellation requests will return a CancellationMessage, indicating that the query has already been canceled. 
   */
  cancelQuery(callback?: (err: AWSError, data: TimestreamQuery.Types.CancelQueryResponse) => void): Request<TimestreamQuery.Types.CancelQueryResponse, AWSError>;
  /**
   * DescribeEndpoints returns a list of available endpoints to make Timestream API calls against. This API is available through both Write and Query. Because Timestream’s SDKs are designed to transparently work with the service’s architecture, including the management and mapping of the service endpoints, it is not recommended that you use this API unless:   Your application uses a programming language that does not yet have SDK support   You require better control over the client-side implementation   For detailed information on how to use DescribeEndpoints, see The Endpoint Discovery Pattern and REST APIs.
   */
  describeEndpoints(params: TimestreamQuery.Types.DescribeEndpointsRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.DescribeEndpointsResponse) => void): Request<TimestreamQuery.Types.DescribeEndpointsResponse, AWSError>;
  /**
   * DescribeEndpoints returns a list of available endpoints to make Timestream API calls against. This API is available through both Write and Query. Because Timestream’s SDKs are designed to transparently work with the service’s architecture, including the management and mapping of the service endpoints, it is not recommended that you use this API unless:   Your application uses a programming language that does not yet have SDK support   You require better control over the client-side implementation   For detailed information on how to use DescribeEndpoints, see The Endpoint Discovery Pattern and REST APIs.
   */
  describeEndpoints(callback?: (err: AWSError, data: TimestreamQuery.Types.DescribeEndpointsResponse) => void): Request<TimestreamQuery.Types.DescribeEndpointsResponse, AWSError>;
  /**
   *  Query is a synchronous operation that enables you to execute a query. Query will timeout after 60 seconds. You must update the default timeout in the SDK to support a timeout of 60 seconds. The result set will be truncated to 1MB. Service quotas apply. For more information, see Quotas in the Timestream Developer Guide. 
   */
  query(params: TimestreamQuery.Types.QueryRequest, callback?: (err: AWSError, data: TimestreamQuery.Types.QueryResponse) => void): Request<TimestreamQuery.Types.QueryResponse, AWSError>;
  /**
   *  Query is a synchronous operation that enables you to execute a query. Query will timeout after 60 seconds. You must update the default timeout in the SDK to support a timeout of 60 seconds. The result set will be truncated to 1MB. Service quotas apply. For more information, see Quotas in the Timestream Developer Guide. 
   */
  query(callback?: (err: AWSError, data: TimestreamQuery.Types.QueryResponse) => void): Request<TimestreamQuery.Types.QueryResponse, AWSError>;
}
declare namespace TimestreamQuery {
  export interface CancelQueryRequest {
    /**
     *  The id of the query that needs to be cancelled. QueryID is returned as part of QueryResult. 
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
  export interface ColumnInfo {
    /**
     *  The name of the result set column. The name of the result set is available for columns of all data types except for arrays. 
     */
    Name?: String;
    /**
     *  The data type of the result set column. The data type can be a scalar or complex. Scalar data types are integers, strings, doubles, booleans, and others. Complex data types are types such as arrays, rows, and others. 
     */
    Type: Type;
  }
  export type ColumnInfoList = ColumnInfo[];
  export interface Datum {
    /**
     *  Indicates if the data point is a scalar value such as integer, string, double, or boolean. 
     */
    ScalarValue?: ScalarValue;
    /**
     *  Indicates if the data point is of timeseries data type. 
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
  export interface DescribeEndpointsRequest {
  }
  export interface DescribeEndpointsResponse {
    /**
     * An Endpoints object is returned when a DescribeEndpoints request is made.
     */
    Endpoints: Endpoints;
  }
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
  export type Long = number;
  export type MaxQueryResults = number;
  export type NullableBoolean = boolean;
  export type QueryId = string;
  export interface QueryRequest {
    /**
     *  The query to be executed by Timestream. 
     */
    QueryString: QueryString;
    /**
     *  Unique, case-sensitive string of up to 64 ASCII characters that you specify when you make a Query request. Providing a ClientToken makes the call to Query idempotent, meaning that multiple identical calls have the same effect as one single call.  Your query request will fail in the following cases:    If you submit a request with the same client token outside the 5-minute idepotency window.     If you submit a request with the same client token but a change in other parameters within the 5-minute idempotency window.     After 4 hours, any request with the same client token is treated as a new request. 
     */
    ClientToken?: ClientRequestToken;
    /**
     *  A pagination token passed to get a set of results. 
     */
    NextToken?: String;
    /**
     *  The total number of rows to return in the output. If the total number of rows available is more than the value specified, a NextToken is provided in the command's output. To resume pagination, provide the NextToken value in the starting-token argument of a subsequent command. 
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
    NextToken?: String;
    /**
     *  The result set rows returned by the query. 
     */
    Rows: RowList;
    /**
     *  The column data types of the returned result set. 
     */
    ColumnInfo: ColumnInfoList;
    /**
     * Information about the status of the query, including progress and bytes scannned.
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
     * The amount of data scanned by the query in bytes that you will be charged for. This is a cumulative sum and represents the total amount of data that you will be charged for since the query was started. The charge is applied only once and is either applied when the query completes execution or when the query is cancelled. 
     */
    CumulativeBytesMetered?: Long;
  }
  export type QueryString = string;
  export interface Row {
    /**
     * List of data points in a single row of the result set.
     */
    Data: DatumList;
  }
  export type RowList = Row[];
  export type ScalarType = "VARCHAR"|"BOOLEAN"|"BIGINT"|"DOUBLE"|"TIMESTAMP"|"DATE"|"TIME"|"INTERVAL_DAY_TO_SECOND"|"INTERVAL_YEAR_TO_MONTH"|"UNKNOWN"|"INTEGER"|string;
  export type ScalarValue = string;
  export type String = string;
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
  export interface Type {
    /**
     * Indicates if the column is of type string, integer, boolean, double, timestamp, date, time. 
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
