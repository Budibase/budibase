import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CUR extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CUR.Types.ClientConfiguration)
  config: Config & CUR.Types.ClientConfiguration;
  /**
   * Deletes the specified report.
   */
  deleteReportDefinition(params: CUR.Types.DeleteReportDefinitionRequest, callback?: (err: AWSError, data: CUR.Types.DeleteReportDefinitionResponse) => void): Request<CUR.Types.DeleteReportDefinitionResponse, AWSError>;
  /**
   * Deletes the specified report.
   */
  deleteReportDefinition(callback?: (err: AWSError, data: CUR.Types.DeleteReportDefinitionResponse) => void): Request<CUR.Types.DeleteReportDefinitionResponse, AWSError>;
  /**
   * Lists the AWS Cost and Usage reports available to this account.
   */
  describeReportDefinitions(params: CUR.Types.DescribeReportDefinitionsRequest, callback?: (err: AWSError, data: CUR.Types.DescribeReportDefinitionsResponse) => void): Request<CUR.Types.DescribeReportDefinitionsResponse, AWSError>;
  /**
   * Lists the AWS Cost and Usage reports available to this account.
   */
  describeReportDefinitions(callback?: (err: AWSError, data: CUR.Types.DescribeReportDefinitionsResponse) => void): Request<CUR.Types.DescribeReportDefinitionsResponse, AWSError>;
  /**
   * Allows you to programatically update your report preferences.
   */
  modifyReportDefinition(params: CUR.Types.ModifyReportDefinitionRequest, callback?: (err: AWSError, data: CUR.Types.ModifyReportDefinitionResponse) => void): Request<CUR.Types.ModifyReportDefinitionResponse, AWSError>;
  /**
   * Allows you to programatically update your report preferences.
   */
  modifyReportDefinition(callback?: (err: AWSError, data: CUR.Types.ModifyReportDefinitionResponse) => void): Request<CUR.Types.ModifyReportDefinitionResponse, AWSError>;
  /**
   * Creates a new report using the description that you provide.
   */
  putReportDefinition(params: CUR.Types.PutReportDefinitionRequest, callback?: (err: AWSError, data: CUR.Types.PutReportDefinitionResponse) => void): Request<CUR.Types.PutReportDefinitionResponse, AWSError>;
  /**
   * Creates a new report using the description that you provide.
   */
  putReportDefinition(callback?: (err: AWSError, data: CUR.Types.PutReportDefinitionResponse) => void): Request<CUR.Types.PutReportDefinitionResponse, AWSError>;
}
declare namespace CUR {
  export type AWSRegion = "af-south-1"|"ap-east-1"|"ap-south-1"|"ap-south-2"|"ap-southeast-1"|"ap-southeast-2"|"ap-southeast-3"|"ap-northeast-1"|"ap-northeast-2"|"ap-northeast-3"|"ca-central-1"|"eu-central-1"|"eu-central-2"|"eu-west-1"|"eu-west-2"|"eu-west-3"|"eu-north-1"|"eu-south-1"|"eu-south-2"|"me-central-1"|"me-south-1"|"sa-east-1"|"us-east-1"|"us-east-2"|"us-west-1"|"us-west-2"|"cn-north-1"|"cn-northwest-1"|string;
  export type AdditionalArtifact = "REDSHIFT"|"QUICKSIGHT"|"ATHENA"|string;
  export type AdditionalArtifactList = AdditionalArtifact[];
  export type BillingViewArn = string;
  export type CompressionFormat = "ZIP"|"GZIP"|"Parquet"|string;
  export interface DeleteReportDefinitionRequest {
    /**
     * The name of the report that you want to delete. The name must be unique, is case sensitive, and can't include spaces.
     */
    ReportName?: ReportName;
  }
  export interface DeleteReportDefinitionResponse {
    ResponseMessage?: DeleteResponseMessage;
  }
  export type DeleteResponseMessage = string;
  export interface DescribeReportDefinitionsRequest {
    MaxResults?: MaxResults;
    NextToken?: GenericString;
  }
  export interface DescribeReportDefinitionsResponse {
    /**
     * A list of AWS Cost and Usage reports owned by the account.
     */
    ReportDefinitions?: ReportDefinitionList;
    NextToken?: GenericString;
  }
  export type GenericString = string;
  export type MaxResults = number;
  export interface ModifyReportDefinitionRequest {
    ReportName: ReportName;
    ReportDefinition: ReportDefinition;
  }
  export interface ModifyReportDefinitionResponse {
  }
  export interface PutReportDefinitionRequest {
    /**
     * Represents the output of the PutReportDefinition operation. The content consists of the detailed metadata and data file information. 
     */
    ReportDefinition: ReportDefinition;
  }
  export interface PutReportDefinitionResponse {
  }
  export type RefreshClosedReports = boolean;
  export interface ReportDefinition {
    ReportName: ReportName;
    TimeUnit: TimeUnit;
    Format: ReportFormat;
    Compression: CompressionFormat;
    /**
     * A list of strings that indicate additional content that Amazon Web Services includes in the report, such as individual resource IDs. 
     */
    AdditionalSchemaElements: SchemaElementList;
    S3Bucket: S3Bucket;
    S3Prefix: S3Prefix;
    S3Region: AWSRegion;
    /**
     * A list of manifests that you want Amazon Web Services to create for this report.
     */
    AdditionalArtifacts?: AdditionalArtifactList;
    /**
     * Whether you want Amazon Web Services to update your reports after they have been finalized if Amazon Web Services detects charges related to previous months. These charges can include refunds, credits, or support fees.
     */
    RefreshClosedReports?: RefreshClosedReports;
    /**
     * Whether you want Amazon Web Services to overwrite the previous version of each report or to deliver the report in addition to the previous versions.
     */
    ReportVersioning?: ReportVersioning;
    /**
     *  The Amazon resource name of the billing view. You can get this value by using the billing view service public APIs. 
     */
    BillingViewArn?: BillingViewArn;
  }
  export type ReportDefinitionList = ReportDefinition[];
  export type ReportFormat = "textORcsv"|"Parquet"|string;
  export type ReportName = string;
  export type ReportVersioning = "CREATE_NEW_REPORT"|"OVERWRITE_REPORT"|string;
  export type S3Bucket = string;
  export type S3Prefix = string;
  export type SchemaElement = "RESOURCES"|"SPLIT_COST_ALLOCATION_DATA"|string;
  export type SchemaElementList = SchemaElement[];
  export type TimeUnit = "HOURLY"|"DAILY"|"MONTHLY"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-01-06"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CUR client.
   */
  export import Types = CUR;
}
export = CUR;
