import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class PI extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: PI.Types.ClientConfiguration)
  config: Config & PI.Types.ClientConfiguration;
  /**
   * Creates a new performance analysis report for a specific time period for the DB instance.
   */
  createPerformanceAnalysisReport(params: PI.Types.CreatePerformanceAnalysisReportRequest, callback?: (err: AWSError, data: PI.Types.CreatePerformanceAnalysisReportResponse) => void): Request<PI.Types.CreatePerformanceAnalysisReportResponse, AWSError>;
  /**
   * Creates a new performance analysis report for a specific time period for the DB instance.
   */
  createPerformanceAnalysisReport(callback?: (err: AWSError, data: PI.Types.CreatePerformanceAnalysisReportResponse) => void): Request<PI.Types.CreatePerformanceAnalysisReportResponse, AWSError>;
  /**
   * Deletes a performance analysis report.
   */
  deletePerformanceAnalysisReport(params: PI.Types.DeletePerformanceAnalysisReportRequest, callback?: (err: AWSError, data: PI.Types.DeletePerformanceAnalysisReportResponse) => void): Request<PI.Types.DeletePerformanceAnalysisReportResponse, AWSError>;
  /**
   * Deletes a performance analysis report.
   */
  deletePerformanceAnalysisReport(callback?: (err: AWSError, data: PI.Types.DeletePerformanceAnalysisReportResponse) => void): Request<PI.Types.DeletePerformanceAnalysisReportResponse, AWSError>;
  /**
   * For a specific time period, retrieve the top N dimension keys for a metric.   Each response element returns a maximum of 500 bytes. For larger elements, such as SQL statements, only the first 500 bytes are returned. 
   */
  describeDimensionKeys(params: PI.Types.DescribeDimensionKeysRequest, callback?: (err: AWSError, data: PI.Types.DescribeDimensionKeysResponse) => void): Request<PI.Types.DescribeDimensionKeysResponse, AWSError>;
  /**
   * For a specific time period, retrieve the top N dimension keys for a metric.   Each response element returns a maximum of 500 bytes. For larger elements, such as SQL statements, only the first 500 bytes are returned. 
   */
  describeDimensionKeys(callback?: (err: AWSError, data: PI.Types.DescribeDimensionKeysResponse) => void): Request<PI.Types.DescribeDimensionKeysResponse, AWSError>;
  /**
   * Get the attributes of the specified dimension group for a DB instance or data source. For example, if you specify a SQL ID, GetDimensionKeyDetails retrieves the full text of the dimension db.sql.statement associated with this ID. This operation is useful because GetResourceMetrics and DescribeDimensionKeys don't support retrieval of large SQL statement text.
   */
  getDimensionKeyDetails(params: PI.Types.GetDimensionKeyDetailsRequest, callback?: (err: AWSError, data: PI.Types.GetDimensionKeyDetailsResponse) => void): Request<PI.Types.GetDimensionKeyDetailsResponse, AWSError>;
  /**
   * Get the attributes of the specified dimension group for a DB instance or data source. For example, if you specify a SQL ID, GetDimensionKeyDetails retrieves the full text of the dimension db.sql.statement associated with this ID. This operation is useful because GetResourceMetrics and DescribeDimensionKeys don't support retrieval of large SQL statement text.
   */
  getDimensionKeyDetails(callback?: (err: AWSError, data: PI.Types.GetDimensionKeyDetailsResponse) => void): Request<PI.Types.GetDimensionKeyDetailsResponse, AWSError>;
  /**
   * Retrieves the report including the report ID, status, time details, and the insights with recommendations. The report status can be RUNNING, SUCCEEDED, or FAILED. The insights include the description and recommendation fields. 
   */
  getPerformanceAnalysisReport(params: PI.Types.GetPerformanceAnalysisReportRequest, callback?: (err: AWSError, data: PI.Types.GetPerformanceAnalysisReportResponse) => void): Request<PI.Types.GetPerformanceAnalysisReportResponse, AWSError>;
  /**
   * Retrieves the report including the report ID, status, time details, and the insights with recommendations. The report status can be RUNNING, SUCCEEDED, or FAILED. The insights include the description and recommendation fields. 
   */
  getPerformanceAnalysisReport(callback?: (err: AWSError, data: PI.Types.GetPerformanceAnalysisReportResponse) => void): Request<PI.Types.GetPerformanceAnalysisReportResponse, AWSError>;
  /**
   * Retrieve the metadata for different features. For example, the metadata might indicate that a feature is turned on or off on a specific DB instance. 
   */
  getResourceMetadata(params: PI.Types.GetResourceMetadataRequest, callback?: (err: AWSError, data: PI.Types.GetResourceMetadataResponse) => void): Request<PI.Types.GetResourceMetadataResponse, AWSError>;
  /**
   * Retrieve the metadata for different features. For example, the metadata might indicate that a feature is turned on or off on a specific DB instance. 
   */
  getResourceMetadata(callback?: (err: AWSError, data: PI.Types.GetResourceMetadataResponse) => void): Request<PI.Types.GetResourceMetadataResponse, AWSError>;
  /**
   * Retrieve Performance Insights metrics for a set of data sources over a time period. You can provide specific dimension groups and dimensions, and provide aggregation and filtering criteria for each group.  Each response element returns a maximum of 500 bytes. For larger elements, such as SQL statements, only the first 500 bytes are returned. 
   */
  getResourceMetrics(params: PI.Types.GetResourceMetricsRequest, callback?: (err: AWSError, data: PI.Types.GetResourceMetricsResponse) => void): Request<PI.Types.GetResourceMetricsResponse, AWSError>;
  /**
   * Retrieve Performance Insights metrics for a set of data sources over a time period. You can provide specific dimension groups and dimensions, and provide aggregation and filtering criteria for each group.  Each response element returns a maximum of 500 bytes. For larger elements, such as SQL statements, only the first 500 bytes are returned. 
   */
  getResourceMetrics(callback?: (err: AWSError, data: PI.Types.GetResourceMetricsResponse) => void): Request<PI.Types.GetResourceMetricsResponse, AWSError>;
  /**
   * Retrieve the dimensions that can be queried for each specified metric type on a specified DB instance.
   */
  listAvailableResourceDimensions(params: PI.Types.ListAvailableResourceDimensionsRequest, callback?: (err: AWSError, data: PI.Types.ListAvailableResourceDimensionsResponse) => void): Request<PI.Types.ListAvailableResourceDimensionsResponse, AWSError>;
  /**
   * Retrieve the dimensions that can be queried for each specified metric type on a specified DB instance.
   */
  listAvailableResourceDimensions(callback?: (err: AWSError, data: PI.Types.ListAvailableResourceDimensionsResponse) => void): Request<PI.Types.ListAvailableResourceDimensionsResponse, AWSError>;
  /**
   * Retrieve metrics of the specified types that can be queried for a specified DB instance. 
   */
  listAvailableResourceMetrics(params: PI.Types.ListAvailableResourceMetricsRequest, callback?: (err: AWSError, data: PI.Types.ListAvailableResourceMetricsResponse) => void): Request<PI.Types.ListAvailableResourceMetricsResponse, AWSError>;
  /**
   * Retrieve metrics of the specified types that can be queried for a specified DB instance. 
   */
  listAvailableResourceMetrics(callback?: (err: AWSError, data: PI.Types.ListAvailableResourceMetricsResponse) => void): Request<PI.Types.ListAvailableResourceMetricsResponse, AWSError>;
  /**
   * Lists all the analysis reports created for the DB instance. The reports are sorted based on the start time of each report.
   */
  listPerformanceAnalysisReports(params: PI.Types.ListPerformanceAnalysisReportsRequest, callback?: (err: AWSError, data: PI.Types.ListPerformanceAnalysisReportsResponse) => void): Request<PI.Types.ListPerformanceAnalysisReportsResponse, AWSError>;
  /**
   * Lists all the analysis reports created for the DB instance. The reports are sorted based on the start time of each report.
   */
  listPerformanceAnalysisReports(callback?: (err: AWSError, data: PI.Types.ListPerformanceAnalysisReportsResponse) => void): Request<PI.Types.ListPerformanceAnalysisReportsResponse, AWSError>;
  /**
   * Retrieves all the metadata tags associated with Amazon RDS Performance Insights resource.
   */
  listTagsForResource(params: PI.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: PI.Types.ListTagsForResourceResponse) => void): Request<PI.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves all the metadata tags associated with Amazon RDS Performance Insights resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: PI.Types.ListTagsForResourceResponse) => void): Request<PI.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Adds metadata tags to the Amazon RDS Performance Insights resource.
   */
  tagResource(params: PI.Types.TagResourceRequest, callback?: (err: AWSError, data: PI.Types.TagResourceResponse) => void): Request<PI.Types.TagResourceResponse, AWSError>;
  /**
   * Adds metadata tags to the Amazon RDS Performance Insights resource.
   */
  tagResource(callback?: (err: AWSError, data: PI.Types.TagResourceResponse) => void): Request<PI.Types.TagResourceResponse, AWSError>;
  /**
   * Deletes the metadata tags from the Amazon RDS Performance Insights resource.
   */
  untagResource(params: PI.Types.UntagResourceRequest, callback?: (err: AWSError, data: PI.Types.UntagResourceResponse) => void): Request<PI.Types.UntagResourceResponse, AWSError>;
  /**
   * Deletes the metadata tags from the Amazon RDS Performance Insights resource.
   */
  untagResource(callback?: (err: AWSError, data: PI.Types.UntagResourceResponse) => void): Request<PI.Types.UntagResourceResponse, AWSError>;
}
declare namespace PI {
  export type AcceptLanguage = "EN_US"|string;
  export type AdditionalMetricsList = RequestString[];
  export type AdditionalMetricsMap = {[key: string]: Double};
  export type AmazonResourceName = string;
  export interface AnalysisReport {
    /**
     * The name of the analysis report.
     */
    AnalysisReportId: AnalysisReportId;
    /**
     * The unique identifier of the analysis report.
     */
    Identifier?: IdentifierString;
    /**
     * List the tags for the Amazon Web Services service for which Performance Insights returns metrics. Valid values are as follows:    RDS     DOCDB   
     */
    ServiceType?: ServiceType;
    /**
     * The time you created the analysis report.
     */
    CreateTime?: ISOTimestamp;
    /**
     * The analysis start time in the report.
     */
    StartTime?: ISOTimestamp;
    /**
     * The analysis end time in the report.
     */
    EndTime?: ISOTimestamp;
    /**
     * The status of the created analysis report.
     */
    Status?: AnalysisStatus;
    /**
     * The list of identified insights in the analysis report.
     */
    Insights?: InsightList;
  }
  export type AnalysisReportId = string;
  export interface AnalysisReportSummary {
    /**
     * The name of the analysis report.
     */
    AnalysisReportId?: String;
    /**
     * The time you created the analysis report.
     */
    CreateTime?: ISOTimestamp;
    /**
     * The start time of the analysis in the report.
     */
    StartTime?: ISOTimestamp;
    /**
     * The end time of the analysis in the report.
     */
    EndTime?: ISOTimestamp;
    /**
     * The status of the analysis report.
     */
    Status?: AnalysisStatus;
    /**
     * List of all the tags added to the analysis report.
     */
    Tags?: TagList;
  }
  export type AnalysisReportSummaryList = AnalysisReportSummary[];
  export type AnalysisStatus = "RUNNING"|"SUCCEEDED"|"FAILED"|string;
  export type Boolean = boolean;
  export type ContextType = "CAUSAL"|"CONTEXTUAL"|string;
  export interface CreatePerformanceAnalysisReportRequest {
    /**
     * The Amazon Web Services service for which Performance Insights will return metrics. Valid value is RDS.
     */
    ServiceType: ServiceType;
    /**
     * An immutable, Amazon Web Services Region-unique identifier for a data source. Performance Insights gathers metrics from this data source. To use an Amazon RDS instance as a data source, you specify its DbiResourceId value. For example, specify db-ADECBTYHKTSAUMUZQYPDS2GW4A.
     */
    Identifier: IdentifierString;
    /**
     * The start time defined for the analysis report.
     */
    StartTime: ISOTimestamp;
    /**
     * The end time defined for the analysis report.
     */
    EndTime: ISOTimestamp;
    /**
     * The metadata assigned to the analysis report consisting of a key-value pair.
     */
    Tags?: TagList;
  }
  export interface CreatePerformanceAnalysisReportResponse {
    /**
     * A unique identifier for the created analysis report.
     */
    AnalysisReportId?: AnalysisReportId;
  }
  export interface Data {
    /**
     * This field determines the Performance Insights metric to render for the insight. The name field refers to a Performance Insights metric. 
     */
    PerformanceInsightsMetric?: PerformanceInsightsMetric;
  }
  export type DataList = Data[];
  export interface DataPoint {
    /**
     * The time, in epoch format, associated with a particular Value.
     */
    Timestamp: ISOTimestamp;
    /**
     * The actual value associated with a particular Timestamp.
     */
    Value: Double;
  }
  export type DataPointsList = DataPoint[];
  export interface DeletePerformanceAnalysisReportRequest {
    /**
     * The Amazon Web Services service for which Performance Insights will return metrics. Valid value is RDS.
     */
    ServiceType: ServiceType;
    /**
     * An immutable identifier for a data source that is unique for an Amazon Web Services Region. Performance Insights gathers metrics from this data source. In the console, the identifier is shown as ResourceID. When you call DescribeDBInstances, the identifier is returned as DbiResourceId. To use a DB instance as a data source, specify its DbiResourceId value. For example, specify db-ABCDEFGHIJKLMNOPQRSTU1VW2X.
     */
    Identifier: IdentifierString;
    /**
     * The unique identifier of the analysis report for deletion.
     */
    AnalysisReportId: AnalysisReportId;
  }
  export interface DeletePerformanceAnalysisReportResponse {
  }
  export interface DescribeDimensionKeysRequest {
    /**
     * The Amazon Web Services service for which Performance Insights will return metrics. Valid values are as follows:    RDS     DOCDB   
     */
    ServiceType: ServiceType;
    /**
     * An immutable, Amazon Web Services Region-unique identifier for a data source. Performance Insights gathers metrics from this data source. To use an Amazon RDS instance as a data source, you specify its DbiResourceId value. For example, specify db-FAIHNTYBKTGAUSUZQYPDS2GW4A. 
     */
    Identifier: IdentifierString;
    /**
     * The date and time specifying the beginning of the requested time series data. You must specify a StartTime within the past 7 days. The value specified is inclusive, which means that data points equal to or greater than StartTime are returned.  The value for StartTime must be earlier than the value for EndTime. 
     */
    StartTime: ISOTimestamp;
    /**
     * The date and time specifying the end of the requested time series data. The value specified is exclusive, which means that data points less than (but not equal to) EndTime are returned. The value for EndTime must be later than the value for StartTime.
     */
    EndTime: ISOTimestamp;
    /**
     * The name of a Performance Insights metric to be measured. Valid values for Metric are:    db.load.avg - A scaled representation of the number of active sessions for the database engine.     db.sampledload.avg - The raw number of active sessions for the database engine.    If the number of active sessions is less than an internal Performance Insights threshold, db.load.avg and db.sampledload.avg are the same value. If the number of active sessions is greater than the internal threshold, Performance Insights samples the active sessions, with db.load.avg showing the scaled values, db.sampledload.avg showing the raw values, and db.sampledload.avg less than db.load.avg. For most use cases, you can query db.load.avg only. 
     */
    Metric: RequestString;
    /**
     * The granularity, in seconds, of the data points returned from Performance Insights. A period can be as short as one second, or as long as one day (86400 seconds). Valid values are:     1 (one second)    60 (one minute)    300 (five minutes)    3600 (one hour)    86400 (twenty-four hours)   If you don't specify PeriodInSeconds, then Performance Insights chooses a value for you, with a goal of returning roughly 100-200 data points in the response. 
     */
    PeriodInSeconds?: Integer;
    /**
     * A specification for how to aggregate the data points from a query result. You must specify a valid dimension group. Performance Insights returns all dimensions within this group, unless you provide the names of specific dimensions within this group. You can also request that Performance Insights return a limited number of values for a dimension. 
     */
    GroupBy: DimensionGroup;
    /**
     * Additional metrics for the top N dimension keys. If the specified dimension group in the GroupBy parameter is db.sql_tokenized, you can specify per-SQL metrics to get the values for the top N SQL digests. The response syntax is as follows: "AdditionalMetrics" : { "string" : "string" }. 
     */
    AdditionalMetrics?: AdditionalMetricsList;
    /**
     * For each dimension specified in GroupBy, specify a secondary dimension to further subdivide the partition keys in the response. 
     */
    PartitionBy?: DimensionGroup;
    /**
     * One or more filters to apply in the request. Restrictions:   Any number of filters by the same dimension, as specified in the GroupBy or Partition parameters.   A single filter for any other dimension in this dimension group.  
     */
    Filter?: MetricQueryFilterMap;
    /**
     * The maximum number of items to return in the response. If more items exist than the specified MaxRecords value, a pagination token is included in the response so that the remaining results can be retrieved. 
     */
    MaxResults?: MaxResults;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the token, up to the value specified by MaxRecords.
     */
    NextToken?: NextToken;
  }
  export interface DescribeDimensionKeysResponse {
    /**
     * The start time for the returned dimension keys, after alignment to a granular boundary (as specified by PeriodInSeconds). AlignedStartTime will be less than or equal to the value of the user-specified StartTime. 
     */
    AlignedStartTime?: ISOTimestamp;
    /**
     * The end time for the returned dimension keys, after alignment to a granular boundary (as specified by PeriodInSeconds). AlignedEndTime will be greater than or equal to the value of the user-specified Endtime. 
     */
    AlignedEndTime?: ISOTimestamp;
    /**
     * If PartitionBy was present in the request, PartitionKeys contains the breakdown of dimension keys by the specified partitions. 
     */
    PartitionKeys?: ResponsePartitionKeyList;
    /**
     * The dimension keys that were requested.
     */
    Keys?: DimensionKeyDescriptionList;
    /**
     * A pagination token that indicates the response didn’t return all available records because MaxRecords was specified in the previous request. To get the remaining records, specify NextToken in a separate request with this value. 
     */
    NextToken?: NextToken;
  }
  export type Description = string;
  export type DescriptiveMap = {[key: string]: DescriptiveString};
  export type DescriptiveString = string;
  export type DetailStatus = "AVAILABLE"|"PROCESSING"|"UNAVAILABLE"|string;
  export interface DimensionDetail {
    /**
     * The identifier of a dimension.
     */
    Identifier?: String;
  }
  export type DimensionDetailList = DimensionDetail[];
  export interface DimensionGroup {
    /**
     * The name of the dimension group. Valid values are as follows:    db - The name of the database to which the client is connected. The following values are permitted:   Aurora PostgreSQL   Amazon RDS PostgreSQL   Aurora MySQL   Amazon RDS MySQL   Amazon RDS MariaDB   Amazon DocumentDB      db.application - The name of the application that is connected to the database. The following values are permitted:   Aurora PostgreSQL   Amazon RDS PostgreSQL   Amazon DocumentDB      db.host - The host name of the connected client (all engines).    db.query - The query that is currently running (only Amazon DocumentDB).    db.query_tokenized - The digest query (only Amazon DocumentDB).    db.session_type - The type of the current session (only Aurora PostgreSQL and RDS PostgreSQL).    db.sql - The text of the SQL statement that is currently running (all engines except Amazon DocumentDB).    db.sql_tokenized - The SQL digest (all engines except Amazon DocumentDB).    db.user - The user logged in to the database (all engines except Amazon DocumentDB).    db.wait_event - The event for which the database backend is waiting (all engines except Amazon DocumentDB).    db.wait_event_type - The type of event for which the database backend is waiting (all engines except Amazon DocumentDB).    db.wait_state - The event for which the database backend is waiting (only Amazon DocumentDB).  
     */
    Group: RequestString;
    /**
     * A list of specific dimensions from a dimension group. If this parameter is not present, then it signifies that all of the dimensions in the group were requested, or are present in the response. Valid values for elements in the Dimensions array are:    db.application.name - The name of the application that is connected to the database. Valid values are as follows:    Aurora PostgreSQL   Amazon RDS PostgreSQL   Amazon DocumentDB      db.host.id - The host ID of the connected client (all engines).    db.host.name - The host name of the connected client (all engines).    db.name - The name of the database to which the client is connected. Valid values are as follows:   Aurora PostgreSQL   Amazon RDS PostgreSQL   Aurora MySQL   Amazon RDS MySQL   Amazon RDS MariaDB   Amazon DocumentDB      db.query.id - The query ID generated by Performance Insights (only Amazon DocumentDB).    db.query.db_id - The query ID generated by the database (only Amazon DocumentDB).    db.query.statement - The text of the query that is being run (only Amazon DocumentDB).    db.query.tokenized_id     db.query.tokenized.id - The query digest ID generated by Performance Insights (only Amazon DocumentDB).    db.query.tokenized.db_id - The query digest ID generated by Performance Insights (only Amazon DocumentDB).    db.query.tokenized.statement - The text of the query digest (only Amazon DocumentDB).    db.session_type.name - The type of the current session (only Amazon DocumentDB).    db.sql.id - The hash of the full, non-tokenized SQL statement generated by Performance Insights (all engines except Amazon DocumentDB).    db.sql.db_id - Either the SQL ID generated by the database engine, or a value generated by Performance Insights that begins with pi- (all engines except Amazon DocumentDB).    db.sql.statement - The full text of the SQL statement that is running, as in SELECT * FROM employees (all engines except Amazon DocumentDB)    db.sql.tokenized_id     db.sql_tokenized.id - The hash of the SQL digest generated by Performance Insights (all engines except Amazon DocumentDB). In the console, db.sql_tokenized.id is called the Support ID because Amazon Web Services Support can look at this data to help you troubleshoot database issues.    db.sql_tokenized.db_id - Either the native database ID used to refer to the SQL statement, or a synthetic ID such as pi-2372568224 that Performance Insights generates if the native database ID isn't available (all engines except Amazon DocumentDB).    db.sql_tokenized.statement - The text of the SQL digest, as in SELECT * FROM employees WHERE employee_id = ? (all engines except Amazon DocumentDB)    db.user.id - The ID of the user logged in to the database (all engines except Amazon DocumentDB).    db.user.name - The name of the user logged in to the database (all engines except Amazon DocumentDB).    db.wait_event.name - The event for which the backend is waiting (all engines except Amazon DocumentDB).    db.wait_event.type - The type of event for which the backend is waiting (all engines except Amazon DocumentDB).    db.wait_event_type.name - The name of the event type for which the backend is waiting (all engines except Amazon DocumentDB).    db.wait_state.name - The event for which the backend is waiting (only Amazon DocumentDB).  
     */
    Dimensions?: RequestStringList;
    /**
     * The maximum number of items to fetch for this dimension group.
     */
    Limit?: Limit;
  }
  export interface DimensionGroupDetail {
    /**
     * The name of the dimension group.
     */
    Group?: String;
    /**
     * The dimensions within a dimension group.
     */
    Dimensions?: DimensionDetailList;
  }
  export type DimensionGroupDetailList = DimensionGroupDetail[];
  export interface DimensionKeyDescription {
    /**
     * A map of name-value pairs for the dimensions in the group.
     */
    Dimensions?: DimensionMap;
    /**
     * The aggregated metric value for the dimensions, over the requested time range.
     */
    Total?: Double;
    /**
     * A map that contains the value for each additional metric.
     */
    AdditionalMetrics?: AdditionalMetricsMap;
    /**
     * If PartitionBy was specified, PartitionKeys contains the dimensions that were.
     */
    Partitions?: MetricValuesList;
  }
  export type DimensionKeyDescriptionList = DimensionKeyDescription[];
  export interface DimensionKeyDetail {
    /**
     * The value of the dimension detail data. Depending on the return status, this value is either the full or truncated SQL query for the following dimensions:    db.query.statement (Amazon DocumentDB)    db.sql.statement (Amazon RDS and Aurora)  
     */
    Value?: String;
    /**
     * The full name of the dimension. The full name includes the group name and key name. The following values are valid:    db.query.statement (Amazon DocumentDB)    db.sql.statement (Amazon RDS and Aurora)  
     */
    Dimension?: String;
    /**
     * The status of the dimension detail data. Possible values include the following:    AVAILABLE - The dimension detail data is ready to be retrieved.    PROCESSING - The dimension detail data isn't ready to be retrieved because more processing time is required. If the requested detail data has the status PROCESSING, Performance Insights returns the truncated query.    UNAVAILABLE - The dimension detail data could not be collected successfully.  
     */
    Status?: DetailStatus;
  }
  export type DimensionKeyDetailList = DimensionKeyDetail[];
  export type DimensionMap = {[key: string]: RequestString};
  export type DimensionsMetricList = RequestString[];
  export type Double = number;
  export interface FeatureMetadata {
    /**
     * The status of the feature on the DB instance. Possible values include the following:    ENABLED - The feature is enabled on the instance.    DISABLED - The feature is disabled on the instance.    UNSUPPORTED - The feature isn't supported on the instance.    ENABLED_PENDING_REBOOT - The feature is enabled on the instance but requires a reboot to take effect.    DISABLED_PENDING_REBOOT - The feature is disabled on the instance but requires a reboot to take effect.    UNKNOWN - The feature status couldn't be determined.  
     */
    Status?: FeatureStatus;
  }
  export type FeatureMetadataMap = {[key: string]: FeatureMetadata};
  export type FeatureStatus = "ENABLED"|"DISABLED"|"UNSUPPORTED"|"ENABLED_PENDING_REBOOT"|"DISABLED_PENDING_REBOOT"|"UNKNOWN"|string;
  export interface GetDimensionKeyDetailsRequest {
    /**
     * The Amazon Web Services service for which Performance Insights returns data. The only valid value is RDS.
     */
    ServiceType: ServiceType;
    /**
     * The ID for a data source from which to gather dimension data. This ID must be immutable and unique within an Amazon Web Services Region. When a DB instance is the data source, specify its DbiResourceId value. For example, specify db-ABCDEFGHIJKLMNOPQRSTU1VW2X. 
     */
    Identifier: IdentifierString;
    /**
     * The name of the dimension group. Performance Insights searches the specified group for the dimension group ID. The following group name values are valid:    db.query (Amazon DocumentDB only)    db.sql (Amazon RDS and Aurora only)  
     */
    Group: RequestString;
    /**
     * The ID of the dimension group from which to retrieve dimension details. For dimension group db.sql, the group ID is db.sql.id. The following group ID values are valid:    db.sql.id for dimension group db.sql (Aurora and RDS only)    db.query.id for dimension group db.query (DocumentDB only)  
     */
    GroupIdentifier: RequestString;
    /**
     * A list of dimensions to retrieve the detail data for within the given dimension group. If you don't specify this parameter, Performance Insights returns all dimension data within the specified dimension group. Specify dimension names for the following dimension groups:    db.sql - Specify either the full dimension name db.sql.statement or the short dimension name statement (Aurora and RDS only).    db.query - Specify either the full dimension name db.query.statement or the short dimension name statement (DocumentDB only).  
     */
    RequestedDimensions?: RequestedDimensionList;
  }
  export interface GetDimensionKeyDetailsResponse {
    /**
     * The details for the requested dimensions.
     */
    Dimensions?: DimensionKeyDetailList;
  }
  export interface GetPerformanceAnalysisReportRequest {
    /**
     * The Amazon Web Services service for which Performance Insights will return metrics. Valid value is RDS.
     */
    ServiceType: ServiceType;
    /**
     * An immutable identifier for a data source that is unique for an Amazon Web Services Region. Performance Insights gathers metrics from this data source. In the console, the identifier is shown as ResourceID. When you call DescribeDBInstances, the identifier is returned as DbiResourceId. To use a DB instance as a data source, specify its DbiResourceId value. For example, specify db-ABCDEFGHIJKLMNOPQRSTU1VW2X.
     */
    Identifier: IdentifierString;
    /**
     * A unique identifier of the created analysis report. For example, report-12345678901234567 
     */
    AnalysisReportId: AnalysisReportId;
    /**
     * Indicates the text format in the report. The options are PLAIN_TEXT or MARKDOWN. The default value is plain text.
     */
    TextFormat?: TextFormat;
    /**
     * The text language in the report. The default language is EN_US (English). 
     */
    AcceptLanguage?: AcceptLanguage;
  }
  export interface GetPerformanceAnalysisReportResponse {
    /**
     * The summary of the performance analysis report created for a time period.
     */
    AnalysisReport?: AnalysisReport;
  }
  export interface GetResourceMetadataRequest {
    /**
     * The Amazon Web Services service for which Performance Insights returns metrics.
     */
    ServiceType: ServiceType;
    /**
     * An immutable identifier for a data source that is unique for an Amazon Web Services Region. Performance Insights gathers metrics from this data source. To use a DB instance as a data source, specify its DbiResourceId value. For example, specify db-ABCDEFGHIJKLMNOPQRSTU1VW2X. 
     */
    Identifier: IdentifierString;
  }
  export interface GetResourceMetadataResponse {
    /**
     * An immutable identifier for a data source that is unique for an Amazon Web Services Region. Performance Insights gathers metrics from this data source. To use a DB instance as a data source, specify its DbiResourceId value. For example, specify db-ABCDEFGHIJKLMNOPQRSTU1VW2X. 
     */
    Identifier?: String;
    /**
     * The metadata for different features. For example, the metadata might indicate that a feature is turned on or off on a specific DB instance.
     */
    Features?: FeatureMetadataMap;
  }
  export interface GetResourceMetricsRequest {
    /**
     * The Amazon Web Services service for which Performance Insights returns metrics. Valid values are as follows:    RDS     DOCDB   
     */
    ServiceType: ServiceType;
    /**
     * An immutable identifier for a data source that is unique for an Amazon Web Services Region. Performance Insights gathers metrics from this data source. In the console, the identifier is shown as ResourceID. When you call DescribeDBInstances, the identifier is returned as DbiResourceId. To use a DB instance as a data source, specify its DbiResourceId value. For example, specify db-ABCDEFGHIJKLMNOPQRSTU1VW2X.
     */
    Identifier: IdentifierString;
    /**
     * An array of one or more queries to perform. Each query must specify a Performance Insights metric, and can optionally specify aggregation and filtering criteria.
     */
    MetricQueries: MetricQueryList;
    /**
     * The date and time specifying the beginning of the requested time series query range. You can't specify a StartTime that is earlier than 7 days ago. By default, Performance Insights has 7 days of retention, but you can extend this range up to 2 years. The value specified is inclusive. Thus, the command returns data points equal to or greater than StartTime. The value for StartTime must be earlier than the value for EndTime.
     */
    StartTime: ISOTimestamp;
    /**
     * The date and time specifying the end of the requested time series query range. The value specified is exclusive. Thus, the command returns data points less than (but not equal to) EndTime. The value for EndTime must be later than the value for StartTime.
     */
    EndTime: ISOTimestamp;
    /**
     * The granularity, in seconds, of the data points returned from Performance Insights. A period can be as short as one second, or as long as one day (86400 seconds). Valid values are:    1 (one second)    60 (one minute)    300 (five minutes)    3600 (one hour)    86400 (twenty-four hours)   If you don't specify PeriodInSeconds, then Performance Insights will choose a value for you, with a goal of returning roughly 100-200 data points in the response.
     */
    PeriodInSeconds?: Integer;
    /**
     * The maximum number of items to return in the response. If more items exist than the specified MaxRecords value, a pagination token is included in the response so that the remaining results can be retrieved. 
     */
    MaxResults?: MaxResults;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the token, up to the value specified by MaxRecords.
     */
    NextToken?: NextToken;
    /**
     * The returned timestamp which is the start or end time of the time periods. The default value is END_TIME.
     */
    PeriodAlignment?: PeriodAlignment;
  }
  export interface GetResourceMetricsResponse {
    /**
     * The start time for the returned metrics, after alignment to a granular boundary (as specified by PeriodInSeconds). AlignedStartTime will be less than or equal to the value of the user-specified StartTime.
     */
    AlignedStartTime?: ISOTimestamp;
    /**
     * The end time for the returned metrics, after alignment to a granular boundary (as specified by PeriodInSeconds). AlignedEndTime will be greater than or equal to the value of the user-specified Endtime.
     */
    AlignedEndTime?: ISOTimestamp;
    /**
     * An immutable identifier for a data source that is unique for an Amazon Web Services Region. Performance Insights gathers metrics from this data source. In the console, the identifier is shown as ResourceID. When you call DescribeDBInstances, the identifier is returned as DbiResourceId.
     */
    Identifier?: String;
    /**
     * An array of metric results, where each array element contains all of the data points for a particular dimension.
     */
    MetricList?: MetricKeyDataPointsList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the token, up to the value specified by MaxRecords. 
     */
    NextToken?: NextToken;
  }
  export type ISOTimestamp = Date;
  export type IdentifierString = string;
  export interface Insight {
    /**
     * The unique identifier for the insight. For example, insight-12345678901234567.
     */
    InsightId: String;
    /**
     * The type of insight. For example, HighDBLoad, HighCPU, or DominatingSQLs.
     */
    InsightType?: String;
    /**
     * Indicates if the insight is causal or correlated insight.
     */
    Context?: ContextType;
    /**
     * The start time of the insight. For example, 2018-10-30T00:00:00Z.
     */
    StartTime?: ISOTimestamp;
    /**
     * The end time of the insight. For example, 2018-10-30T00:00:00Z.
     */
    EndTime?: ISOTimestamp;
    /**
     * The severity of the insight. The values are: Low, Medium, or High.
     */
    Severity?: Severity;
    /**
     * List of supporting insights that provide additional factors for the insight.
     */
    SupportingInsights?: InsightList;
    /**
     * Description of the insight. For example: A high severity Insight found between 02:00 to 02:30, where there was an unusually high DB load 600x above baseline. Likely performance impact.
     */
    Description?: MarkdownString;
    /**
     * List of recommendations for the insight. For example, Investigate the following SQLs that contributed to 100% of the total DBLoad during that time period: sql-id.
     */
    Recommendations?: RecommendationList;
    /**
     * List of data objects containing metrics and references from the time range while generating the insight.
     */
    InsightData?: DataList;
    /**
     *  Metric names and values from the timeframe used as baseline to generate the insight.
     */
    BaselineData?: DataList;
  }
  export type InsightList = Insight[];
  export type Integer = number;
  export type Limit = number;
  export interface ListAvailableResourceDimensionsRequest {
    /**
     * The Amazon Web Services service for which Performance Insights returns metrics.
     */
    ServiceType: ServiceType;
    /**
     * An immutable identifier for a data source that is unique within an Amazon Web Services Region. Performance Insights gathers metrics from this data source. To use an Amazon RDS DB instance as a data source, specify its DbiResourceId value. For example, specify db-ABCDEFGHIJKLMNOPQRSTU1VWZ. 
     */
    Identifier: IdentifierString;
    /**
     * The types of metrics for which to retrieve dimensions. Valid values include db.load.
     */
    Metrics: DimensionsMetricList;
    /**
     * The maximum number of items to return in the response. If more items exist than the specified MaxRecords value, a pagination token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: MaxResults;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the token, up to the value specified by MaxRecords. 
     */
    NextToken?: NextToken;
  }
  export interface ListAvailableResourceDimensionsResponse {
    /**
     * The dimension information returned for requested metric types.
     */
    MetricDimensions?: MetricDimensionsList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the token, up to the value specified by MaxRecords.
     */
    NextToken?: NextToken;
  }
  export interface ListAvailableResourceMetricsRequest {
    /**
     * The Amazon Web Services service for which Performance Insights returns metrics.
     */
    ServiceType: ServiceType;
    /**
     * An immutable identifier for a data source that is unique within an Amazon Web Services Region. Performance Insights gathers metrics from this data source. To use an Amazon RDS DB instance as a data source, specify its DbiResourceId value. For example, specify db-ABCDEFGHIJKLMNOPQRSTU1VWZ. 
     */
    Identifier: IdentifierString;
    /**
     * The types of metrics to return in the response. Valid values in the array include the following:    os (OS counter metrics) - All engines    db (DB load metrics) - All engines except for Amazon DocumentDB    db.sql.stats (per-SQL metrics) - All engines except for Amazon DocumentDB    db.sql_tokenized.stats (per-SQL digest metrics) - All engines except for Amazon DocumentDB  
     */
    MetricTypes: MetricTypeList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the token, up to the value specified by MaxRecords. 
     */
    NextToken?: NextToken;
    /**
     * The maximum number of items to return. If the MaxRecords value is less than the number of existing items, the response includes a pagination token. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListAvailableResourceMetricsResponse {
    /**
     * An array of metrics available to query. Each array element contains the full name, description, and unit of the metric. 
     */
    Metrics?: ResponseResourceMetricList;
    /**
     * A pagination token that indicates the response didn’t return all available records because MaxRecords was specified in the previous request. To get the remaining records, specify NextToken in a separate request with this value. 
     */
    NextToken?: NextToken;
  }
  export interface ListPerformanceAnalysisReportsRequest {
    /**
     * The Amazon Web Services service for which Performance Insights returns metrics. Valid value is RDS.
     */
    ServiceType: ServiceType;
    /**
     * An immutable identifier for a data source that is unique for an Amazon Web Services Region. Performance Insights gathers metrics from this data source. In the console, the identifier is shown as ResourceID. When you call DescribeDBInstances, the identifier is returned as DbiResourceId. To use a DB instance as a data source, specify its DbiResourceId value. For example, specify db-ABCDEFGHIJKLMNOPQRSTU1VW2X.
     */
    Identifier: IdentifierString;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the token, up to the value specified by MaxResults.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of items to return in the response. If more items exist than the specified MaxResults value, a pagination token is included in the response so that the remaining results can be retrieved. 
     */
    MaxResults?: MaxResults;
    /**
     * Specifies whether or not to include the list of tags in the response.
     */
    ListTags?: Boolean;
  }
  export interface ListPerformanceAnalysisReportsResponse {
    /**
     * List of reports including the report identifier, start and end time, creation time, and status.
     */
    AnalysisReports?: AnalysisReportSummaryList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the token, up to the value specified by MaxResults.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * List the tags for the Amazon Web Services service for which Performance Insights returns metrics. Valid value is RDS.
     */
    ServiceType: ServiceType;
    /**
     * Lists all the tags for the Amazon RDS Performance Insights resource. This value is an Amazon Resource Name (ARN). For information about creating an ARN, see  Constructing an RDS Amazon Resource Name (ARN).
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The metadata assigned to an Amazon RDS resource consisting of a key-value pair.
     */
    Tags?: TagList;
  }
  export type MarkdownString = string;
  export type MaxResults = number;
  export interface MetricDimensionGroups {
    /**
     * The metric type to which the dimension information belongs.
     */
    Metric?: String;
    /**
     * The available dimension groups for a metric type.
     */
    Groups?: DimensionGroupDetailList;
  }
  export type MetricDimensionsList = MetricDimensionGroups[];
  export interface MetricKeyDataPoints {
    /**
     * The dimensions to which the data points apply.
     */
    Key?: ResponseResourceMetricKey;
    /**
     * An array of timestamp-value pairs, representing measurements over a period of time.
     */
    DataPoints?: DataPointsList;
  }
  export type MetricKeyDataPointsList = MetricKeyDataPoints[];
  export interface MetricQuery {
    /**
     * The name of a Performance Insights metric to be measured. Valid values for Metric are:    db.load.avg - A scaled representation of the number of active sessions for the database engine.    db.sampledload.avg - The raw number of active sessions for the database engine.   The counter metrics listed in Performance Insights operating system counters in the Amazon Aurora User Guide.   If the number of active sessions is less than an internal Performance Insights threshold, db.load.avg and db.sampledload.avg are the same value. If the number of active sessions is greater than the internal threshold, Performance Insights samples the active sessions, with db.load.avg showing the scaled values, db.sampledload.avg showing the raw values, and db.sampledload.avg less than db.load.avg. For most use cases, you can query db.load.avg only.
     */
    Metric: RequestString;
    /**
     * A specification for how to aggregate the data points from a query result. You must specify a valid dimension group. Performance Insights will return all of the dimensions within that group, unless you provide the names of specific dimensions within that group. You can also request that Performance Insights return a limited number of values for a dimension.
     */
    GroupBy?: DimensionGroup;
    /**
     * One or more filters to apply in the request. Restrictions:   Any number of filters by the same dimension, as specified in the GroupBy parameter.   A single filter for any other dimension in this dimension group.  
     */
    Filter?: MetricQueryFilterMap;
  }
  export type MetricQueryFilterMap = {[key: string]: RequestString};
  export type MetricQueryList = MetricQuery[];
  export type MetricTypeList = RequestString[];
  export type MetricValuesList = Double[];
  export type NextToken = string;
  export interface PerformanceInsightsMetric {
    /**
     * The Performance Insights metric.
     */
    Metric?: DescriptiveString;
    /**
     * The Performance Insights metric name.
     */
    DisplayName?: DescriptiveString;
    /**
     * A dimension map that contains the dimensions for this partition.
     */
    Dimensions?: DescriptiveMap;
    /**
     * The value of the metric. For example, 9 for db.load.avg.
     */
    Value?: Double;
  }
  export type PeriodAlignment = "END_TIME"|"START_TIME"|string;
  export interface Recommendation {
    /**
     * The unique identifier for the recommendation.
     */
    RecommendationId?: String;
    /**
     * The recommendation details to help resolve the performance issue. For example, Investigate the following SQLs that contributed to 100% of the total DBLoad during that time period: sql-id 
     */
    RecommendationDescription?: MarkdownString;
  }
  export type RecommendationList = Recommendation[];
  export type RequestString = string;
  export type RequestStringList = RequestString[];
  export type RequestedDimensionList = RequestString[];
  export interface ResponsePartitionKey {
    /**
     * A dimension map that contains the dimensions for this partition.
     */
    Dimensions: DimensionMap;
  }
  export type ResponsePartitionKeyList = ResponsePartitionKey[];
  export interface ResponseResourceMetric {
    /**
     * The full name of the metric.
     */
    Metric?: String;
    /**
     * The description of the metric.
     */
    Description?: Description;
    /**
     * The unit of the metric.
     */
    Unit?: String;
  }
  export interface ResponseResourceMetricKey {
    /**
     * The name of a Performance Insights metric to be measured. Valid values for Metric are:    db.load.avg - A scaled representation of the number of active sessions for the database engine.    db.sampledload.avg - The raw number of active sessions for the database engine.   The counter metrics listed in Performance Insights operating system counters in the Amazon Aurora User Guide.   If the number of active sessions is less than an internal Performance Insights threshold, db.load.avg and db.sampledload.avg are the same value. If the number of active sessions is greater than the internal threshold, Performance Insights samples the active sessions, with db.load.avg showing the scaled values, db.sampledload.avg showing the raw values, and db.sampledload.avg less than db.load.avg. For most use cases, you can query db.load.avg only. 
     */
    Metric: String;
    /**
     * The valid dimensions for the metric.
     */
    Dimensions?: DimensionMap;
  }
  export type ResponseResourceMetricList = ResponseResourceMetric[];
  export type ServiceType = "RDS"|"DOCDB"|string;
  export type Severity = "LOW"|"MEDIUM"|"HIGH"|string;
  export type String = string;
  export interface Tag {
    /**
     * A key is the required name of the tag. The string value can be from 1 to 128 Unicode characters in length and can't be prefixed with aws: or rds:. The string can only contain only the set of Unicode letters, digits, white-space, '_', '.', ':', '/', '=', '+', '-', '@' (Java regex: "^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-@]*)$").
     */
    Key: TagKey;
    /**
     * A value is the optional value of the tag. The string value can be from 1 to 256 Unicode characters in length and can't be prefixed with aws: or rds:. The string can only contain only the set of Unicode letters, digits, white-space, '_', '.', ':', '/', '=', '+', '-', '@' (Java regex: "^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-@]*)$").
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Web Services service for which Performance Insights returns metrics. Valid value is RDS.
     */
    ServiceType: ServiceType;
    /**
     * The Amazon RDS Performance Insights resource that the tags are added to. This value is an Amazon Resource Name (ARN). For information about creating an ARN, see  Constructing an RDS Amazon Resource Name (ARN).
     */
    ResourceARN: AmazonResourceName;
    /**
     * The metadata assigned to an Amazon RDS resource consisting of a key-value pair.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TextFormat = "PLAIN_TEXT"|"MARKDOWN"|string;
  export interface UntagResourceRequest {
    /**
     * List the tags for the Amazon Web Services service for which Performance Insights returns metrics. Valid value is RDS.
     */
    ServiceType: ServiceType;
    /**
     * The Amazon RDS Performance Insights resource that the tags are added to. This value is an Amazon Resource Name (ARN). For information about creating an ARN, see  Constructing an RDS Amazon Resource Name (ARN).
     */
    ResourceARN: AmazonResourceName;
    /**
     * The metadata assigned to an Amazon RDS Performance Insights resource consisting of a key-value pair.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-02-27"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the PI client.
   */
  export import Types = PI;
}
export = PI;
