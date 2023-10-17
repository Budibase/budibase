import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ApplicationCostProfiler extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ApplicationCostProfiler.Types.ClientConfiguration)
  config: Config & ApplicationCostProfiler.Types.ClientConfiguration;
  /**
   * Deletes the specified report definition in AWS Application Cost Profiler. This stops the report from being generated.
   */
  deleteReportDefinition(params: ApplicationCostProfiler.Types.DeleteReportDefinitionRequest, callback?: (err: AWSError, data: ApplicationCostProfiler.Types.DeleteReportDefinitionResult) => void): Request<ApplicationCostProfiler.Types.DeleteReportDefinitionResult, AWSError>;
  /**
   * Deletes the specified report definition in AWS Application Cost Profiler. This stops the report from being generated.
   */
  deleteReportDefinition(callback?: (err: AWSError, data: ApplicationCostProfiler.Types.DeleteReportDefinitionResult) => void): Request<ApplicationCostProfiler.Types.DeleteReportDefinitionResult, AWSError>;
  /**
   * Retrieves the definition of a report already configured in AWS Application Cost Profiler.
   */
  getReportDefinition(params: ApplicationCostProfiler.Types.GetReportDefinitionRequest, callback?: (err: AWSError, data: ApplicationCostProfiler.Types.GetReportDefinitionResult) => void): Request<ApplicationCostProfiler.Types.GetReportDefinitionResult, AWSError>;
  /**
   * Retrieves the definition of a report already configured in AWS Application Cost Profiler.
   */
  getReportDefinition(callback?: (err: AWSError, data: ApplicationCostProfiler.Types.GetReportDefinitionResult) => void): Request<ApplicationCostProfiler.Types.GetReportDefinitionResult, AWSError>;
  /**
   * Ingests application usage data from Amazon Simple Storage Service (Amazon S3). The data must already exist in the S3 location. As part of the action, AWS Application Cost Profiler copies the object from your S3 bucket to an S3 bucket owned by Amazon for processing asynchronously.
   */
  importApplicationUsage(params: ApplicationCostProfiler.Types.ImportApplicationUsageRequest, callback?: (err: AWSError, data: ApplicationCostProfiler.Types.ImportApplicationUsageResult) => void): Request<ApplicationCostProfiler.Types.ImportApplicationUsageResult, AWSError>;
  /**
   * Ingests application usage data from Amazon Simple Storage Service (Amazon S3). The data must already exist in the S3 location. As part of the action, AWS Application Cost Profiler copies the object from your S3 bucket to an S3 bucket owned by Amazon for processing asynchronously.
   */
  importApplicationUsage(callback?: (err: AWSError, data: ApplicationCostProfiler.Types.ImportApplicationUsageResult) => void): Request<ApplicationCostProfiler.Types.ImportApplicationUsageResult, AWSError>;
  /**
   * Retrieves a list of all reports and their configurations for your AWS account. The maximum number of reports is one.
   */
  listReportDefinitions(params: ApplicationCostProfiler.Types.ListReportDefinitionsRequest, callback?: (err: AWSError, data: ApplicationCostProfiler.Types.ListReportDefinitionsResult) => void): Request<ApplicationCostProfiler.Types.ListReportDefinitionsResult, AWSError>;
  /**
   * Retrieves a list of all reports and their configurations for your AWS account. The maximum number of reports is one.
   */
  listReportDefinitions(callback?: (err: AWSError, data: ApplicationCostProfiler.Types.ListReportDefinitionsResult) => void): Request<ApplicationCostProfiler.Types.ListReportDefinitionsResult, AWSError>;
  /**
   * Creates the report definition for a report in Application Cost Profiler.
   */
  putReportDefinition(params: ApplicationCostProfiler.Types.PutReportDefinitionRequest, callback?: (err: AWSError, data: ApplicationCostProfiler.Types.PutReportDefinitionResult) => void): Request<ApplicationCostProfiler.Types.PutReportDefinitionResult, AWSError>;
  /**
   * Creates the report definition for a report in Application Cost Profiler.
   */
  putReportDefinition(callback?: (err: AWSError, data: ApplicationCostProfiler.Types.PutReportDefinitionResult) => void): Request<ApplicationCostProfiler.Types.PutReportDefinitionResult, AWSError>;
  /**
   * Updates existing report in AWS Application Cost Profiler.
   */
  updateReportDefinition(params: ApplicationCostProfiler.Types.UpdateReportDefinitionRequest, callback?: (err: AWSError, data: ApplicationCostProfiler.Types.UpdateReportDefinitionResult) => void): Request<ApplicationCostProfiler.Types.UpdateReportDefinitionResult, AWSError>;
  /**
   * Updates existing report in AWS Application Cost Profiler.
   */
  updateReportDefinition(callback?: (err: AWSError, data: ApplicationCostProfiler.Types.UpdateReportDefinitionResult) => void): Request<ApplicationCostProfiler.Types.UpdateReportDefinitionResult, AWSError>;
}
declare namespace ApplicationCostProfiler {
  export interface DeleteReportDefinitionRequest {
    /**
     * Required. ID of the report to delete.
     */
    reportId: ReportId;
  }
  export interface DeleteReportDefinitionResult {
    /**
     * ID of the report that was deleted.
     */
    reportId?: ReportId;
  }
  export type Format = "CSV"|"PARQUET"|string;
  export interface GetReportDefinitionRequest {
    /**
     * ID of the report to retrieve.
     */
    reportId: ReportId;
  }
  export interface GetReportDefinitionResult {
    /**
     * ID of the report retrieved.
     */
    reportId: ReportId;
    /**
     * Description of the report.
     */
    reportDescription: ReportDescription;
    /**
     * Cadence used to generate the report.
     */
    reportFrequency: ReportFrequency;
    /**
     * Format of the generated report.
     */
    format: Format;
    /**
     * Amazon Simple Storage Service (Amazon S3) location where the report is uploaded.
     */
    destinationS3Location: S3Location;
    /**
     * Timestamp (milliseconds) when this report definition was created.
     */
    createdAt: Timestamp;
    /**
     * Timestamp (milliseconds) when this report definition was last updated.
     */
    lastUpdated: Timestamp;
  }
  export interface ImportApplicationUsageRequest {
    /**
     * Amazon S3 location to import application usage data from.
     */
    sourceS3Location: SourceS3Location;
  }
  export interface ImportApplicationUsageResult {
    /**
     * ID of the import request.
     */
    importId: ImportId;
  }
  export type ImportId = string;
  export type Integer = number;
  export interface ListReportDefinitionsRequest {
    /**
     * The token value from a previous call to access the next page of results.
     */
    nextToken?: Token;
    /**
     * The maximum number of results to return.
     */
    maxResults?: Integer;
  }
  export interface ListReportDefinitionsResult {
    /**
     * The retrieved reports.
     */
    reportDefinitions?: ReportDefinitionList;
    /**
     * The value of the next token, if it exists. Null if there are no more results.
     */
    nextToken?: Token;
  }
  export interface PutReportDefinitionRequest {
    /**
     * Required. ID of the report. You can choose any valid string matching the pattern for the ID.
     */
    reportId: ReportId;
    /**
     * Required. Description of the report.
     */
    reportDescription: ReportDescription;
    /**
     * Required. The cadence to generate the report.
     */
    reportFrequency: ReportFrequency;
    /**
     * Required. The format to use for the generated report.
     */
    format: Format;
    /**
     * Required. Amazon Simple Storage Service (Amazon S3) location where Application Cost Profiler uploads the report.
     */
    destinationS3Location: S3Location;
  }
  export interface PutReportDefinitionResult {
    /**
     * ID of the report.
     */
    reportId?: ReportId;
  }
  export interface ReportDefinition {
    /**
     * The ID of the report.
     */
    reportId?: ReportId;
    /**
     * Description of the report
     */
    reportDescription?: ReportDescription;
    /**
     * The cadence at which the report is generated.
     */
    reportFrequency?: ReportFrequency;
    /**
     * The format used for the generated reports.
     */
    format?: Format;
    /**
     * The location in Amazon Simple Storage Service (Amazon S3) the reports should be saved to.
     */
    destinationS3Location?: S3Location;
    /**
     * Timestamp (milliseconds) when this report definition was created.
     */
    createdAt?: Timestamp;
    /**
     * Timestamp (milliseconds) when this report definition was last updated.
     */
    lastUpdatedAt?: Timestamp;
  }
  export type ReportDefinitionList = ReportDefinition[];
  export type ReportDescription = string;
  export type ReportFrequency = "MONTHLY"|"DAILY"|"ALL"|string;
  export type ReportId = string;
  export type S3Bucket = string;
  export type S3BucketRegion = "ap-east-1"|"me-south-1"|"eu-south-1"|"af-south-1"|string;
  export type S3Key = string;
  export interface S3Location {
    /**
     * Name of the S3 bucket.
     */
    bucket: S3Bucket;
    /**
     * Prefix for the location to write to.
     */
    prefix: S3Prefix;
  }
  export type S3Prefix = string;
  export interface SourceS3Location {
    /**
     * Name of the bucket.
     */
    bucket: S3Bucket;
    /**
     * Key of the object.
     */
    key: S3Key;
    /**
     * Region of the bucket. Only required for Regions that are disabled by default. For more infomration about Regions that are disabled by default, see  Enabling a Region in the AWS General Reference guide.
     */
    region?: S3BucketRegion;
  }
  export type Timestamp = Date;
  export type Token = string;
  export interface UpdateReportDefinitionRequest {
    /**
     * Required. ID of the report to update.
     */
    reportId: ReportId;
    /**
     * Required. Description of the report.
     */
    reportDescription: ReportDescription;
    /**
     * Required. The cadence to generate the report.
     */
    reportFrequency: ReportFrequency;
    /**
     * Required. The format to use for the generated report.
     */
    format: Format;
    /**
     * Required. Amazon Simple Storage Service (Amazon S3) location where Application Cost Profiler uploads the report.
     */
    destinationS3Location: S3Location;
  }
  export interface UpdateReportDefinitionResult {
    /**
     * ID of the report.
     */
    reportId?: ReportId;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-09-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ApplicationCostProfiler client.
   */
  export import Types = ApplicationCostProfiler;
}
export = ApplicationCostProfiler;
