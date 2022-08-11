import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class HealthLake extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: HealthLake.Types.ClientConfiguration)
  config: Config & HealthLake.Types.ClientConfiguration;
  /**
   * Creates a Data Store that can ingest and export FHIR formatted data.
   */
  createFHIRDatastore(params: HealthLake.Types.CreateFHIRDatastoreRequest, callback?: (err: AWSError, data: HealthLake.Types.CreateFHIRDatastoreResponse) => void): Request<HealthLake.Types.CreateFHIRDatastoreResponse, AWSError>;
  /**
   * Creates a Data Store that can ingest and export FHIR formatted data.
   */
  createFHIRDatastore(callback?: (err: AWSError, data: HealthLake.Types.CreateFHIRDatastoreResponse) => void): Request<HealthLake.Types.CreateFHIRDatastoreResponse, AWSError>;
  /**
   * Deletes a Data Store. 
   */
  deleteFHIRDatastore(params: HealthLake.Types.DeleteFHIRDatastoreRequest, callback?: (err: AWSError, data: HealthLake.Types.DeleteFHIRDatastoreResponse) => void): Request<HealthLake.Types.DeleteFHIRDatastoreResponse, AWSError>;
  /**
   * Deletes a Data Store. 
   */
  deleteFHIRDatastore(callback?: (err: AWSError, data: HealthLake.Types.DeleteFHIRDatastoreResponse) => void): Request<HealthLake.Types.DeleteFHIRDatastoreResponse, AWSError>;
  /**
   * Gets the properties associated with the FHIR Data Store, including the Data Store ID, Data Store ARN, Data Store name, Data Store status, created at, Data Store type version, and Data Store endpoint.
   */
  describeFHIRDatastore(params: HealthLake.Types.DescribeFHIRDatastoreRequest, callback?: (err: AWSError, data: HealthLake.Types.DescribeFHIRDatastoreResponse) => void): Request<HealthLake.Types.DescribeFHIRDatastoreResponse, AWSError>;
  /**
   * Gets the properties associated with the FHIR Data Store, including the Data Store ID, Data Store ARN, Data Store name, Data Store status, created at, Data Store type version, and Data Store endpoint.
   */
  describeFHIRDatastore(callback?: (err: AWSError, data: HealthLake.Types.DescribeFHIRDatastoreResponse) => void): Request<HealthLake.Types.DescribeFHIRDatastoreResponse, AWSError>;
  /**
   * Displays the properties of a FHIR export job, including the ID, ARN, name, and the status of the job.
   */
  describeFHIRExportJob(params: HealthLake.Types.DescribeFHIRExportJobRequest, callback?: (err: AWSError, data: HealthLake.Types.DescribeFHIRExportJobResponse) => void): Request<HealthLake.Types.DescribeFHIRExportJobResponse, AWSError>;
  /**
   * Displays the properties of a FHIR export job, including the ID, ARN, name, and the status of the job.
   */
  describeFHIRExportJob(callback?: (err: AWSError, data: HealthLake.Types.DescribeFHIRExportJobResponse) => void): Request<HealthLake.Types.DescribeFHIRExportJobResponse, AWSError>;
  /**
   * Displays the properties of a FHIR import job, including the ID, ARN, name, and the status of the job. 
   */
  describeFHIRImportJob(params: HealthLake.Types.DescribeFHIRImportJobRequest, callback?: (err: AWSError, data: HealthLake.Types.DescribeFHIRImportJobResponse) => void): Request<HealthLake.Types.DescribeFHIRImportJobResponse, AWSError>;
  /**
   * Displays the properties of a FHIR import job, including the ID, ARN, name, and the status of the job. 
   */
  describeFHIRImportJob(callback?: (err: AWSError, data: HealthLake.Types.DescribeFHIRImportJobResponse) => void): Request<HealthLake.Types.DescribeFHIRImportJobResponse, AWSError>;
  /**
   * Lists all FHIR Data Stores that are in the user’s account, regardless of Data Store status.
   */
  listFHIRDatastores(params: HealthLake.Types.ListFHIRDatastoresRequest, callback?: (err: AWSError, data: HealthLake.Types.ListFHIRDatastoresResponse) => void): Request<HealthLake.Types.ListFHIRDatastoresResponse, AWSError>;
  /**
   * Lists all FHIR Data Stores that are in the user’s account, regardless of Data Store status.
   */
  listFHIRDatastores(callback?: (err: AWSError, data: HealthLake.Types.ListFHIRDatastoresResponse) => void): Request<HealthLake.Types.ListFHIRDatastoresResponse, AWSError>;
  /**
   *  Lists all FHIR export jobs associated with an account and their statuses. 
   */
  listFHIRExportJobs(params: HealthLake.Types.ListFHIRExportJobsRequest, callback?: (err: AWSError, data: HealthLake.Types.ListFHIRExportJobsResponse) => void): Request<HealthLake.Types.ListFHIRExportJobsResponse, AWSError>;
  /**
   *  Lists all FHIR export jobs associated with an account and their statuses. 
   */
  listFHIRExportJobs(callback?: (err: AWSError, data: HealthLake.Types.ListFHIRExportJobsResponse) => void): Request<HealthLake.Types.ListFHIRExportJobsResponse, AWSError>;
  /**
   *  Lists all FHIR import jobs associated with an account and their statuses. 
   */
  listFHIRImportJobs(params: HealthLake.Types.ListFHIRImportJobsRequest, callback?: (err: AWSError, data: HealthLake.Types.ListFHIRImportJobsResponse) => void): Request<HealthLake.Types.ListFHIRImportJobsResponse, AWSError>;
  /**
   *  Lists all FHIR import jobs associated with an account and their statuses. 
   */
  listFHIRImportJobs(callback?: (err: AWSError, data: HealthLake.Types.ListFHIRImportJobsResponse) => void): Request<HealthLake.Types.ListFHIRImportJobsResponse, AWSError>;
  /**
   *  Returns a list of all existing tags associated with a Data Store. 
   */
  listTagsForResource(params: HealthLake.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: HealthLake.Types.ListTagsForResourceResponse) => void): Request<HealthLake.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Returns a list of all existing tags associated with a Data Store. 
   */
  listTagsForResource(callback?: (err: AWSError, data: HealthLake.Types.ListTagsForResourceResponse) => void): Request<HealthLake.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Begins a FHIR export job.
   */
  startFHIRExportJob(params: HealthLake.Types.StartFHIRExportJobRequest, callback?: (err: AWSError, data: HealthLake.Types.StartFHIRExportJobResponse) => void): Request<HealthLake.Types.StartFHIRExportJobResponse, AWSError>;
  /**
   * Begins a FHIR export job.
   */
  startFHIRExportJob(callback?: (err: AWSError, data: HealthLake.Types.StartFHIRExportJobResponse) => void): Request<HealthLake.Types.StartFHIRExportJobResponse, AWSError>;
  /**
   * Begins a FHIR Import job.
   */
  startFHIRImportJob(params: HealthLake.Types.StartFHIRImportJobRequest, callback?: (err: AWSError, data: HealthLake.Types.StartFHIRImportJobResponse) => void): Request<HealthLake.Types.StartFHIRImportJobResponse, AWSError>;
  /**
   * Begins a FHIR Import job.
   */
  startFHIRImportJob(callback?: (err: AWSError, data: HealthLake.Types.StartFHIRImportJobResponse) => void): Request<HealthLake.Types.StartFHIRImportJobResponse, AWSError>;
  /**
   *  Adds a user specifed key and value tag to a Data Store. 
   */
  tagResource(params: HealthLake.Types.TagResourceRequest, callback?: (err: AWSError, data: HealthLake.Types.TagResourceResponse) => void): Request<HealthLake.Types.TagResourceResponse, AWSError>;
  /**
   *  Adds a user specifed key and value tag to a Data Store. 
   */
  tagResource(callback?: (err: AWSError, data: HealthLake.Types.TagResourceResponse) => void): Request<HealthLake.Types.TagResourceResponse, AWSError>;
  /**
   *  Removes tags from a Data Store. 
   */
  untagResource(params: HealthLake.Types.UntagResourceRequest, callback?: (err: AWSError, data: HealthLake.Types.UntagResourceResponse) => void): Request<HealthLake.Types.UntagResourceResponse, AWSError>;
  /**
   *  Removes tags from a Data Store. 
   */
  untagResource(callback?: (err: AWSError, data: HealthLake.Types.UntagResourceResponse) => void): Request<HealthLake.Types.UntagResourceResponse, AWSError>;
}
declare namespace HealthLake {
  export type AmazonResourceName = string;
  export type BoundedLengthString = string;
  export type ClientTokenString = string;
  export type CmkType = "CUSTOMER_MANAGED_KMS_KEY"|"AWS_OWNED_KMS_KEY"|string;
  export interface CreateFHIRDatastoreRequest {
    /**
     * The user generated name for the Data Store.
     */
    DatastoreName?: DatastoreName;
    /**
     * The FHIR version of the Data Store. The only supported version is R4.
     */
    DatastoreTypeVersion: FHIRVersion;
    /**
     *  The server-side encryption key configuration for a customer provided encryption key specified for creating a Data Store. 
     */
    SseConfiguration?: SseConfiguration;
    /**
     * Optional parameter to preload data upon creation of the Data Store. Currently, the only supported preloaded data is synthetic data generated from Synthea.
     */
    PreloadDataConfig?: PreloadDataConfig;
    /**
     * Optional user provided token used for ensuring idempotency.
     */
    ClientToken?: ClientTokenString;
    /**
     *  Resource tags that are applied to a Data Store when it is created. 
     */
    Tags?: TagList;
  }
  export interface CreateFHIRDatastoreResponse {
    /**
     * The AWS-generated Data Store id. This id is in the output from the initial Data Store creation call.
     */
    DatastoreId: DatastoreId;
    /**
     * The datastore ARN is generated during the creation of the Data Store and can be found in the output from the initial Data Store creation call.
     */
    DatastoreArn: DatastoreArn;
    /**
     * The status of the FHIR Data Store. Possible statuses are ‘CREATING’, ‘ACTIVE’, ‘DELETING’, ‘DELETED’.
     */
    DatastoreStatus: DatastoreStatus;
    /**
     * The AWS endpoint for the created Data Store. For preview, only US-east-1 endpoints are supported.
     */
    DatastoreEndpoint: BoundedLengthString;
  }
  export type DatastoreArn = string;
  export interface DatastoreFilter {
    /**
     * Allows the user to filter Data Store results by name.
     */
    DatastoreName?: DatastoreName;
    /**
     * Allows the user to filter Data Store results by status.
     */
    DatastoreStatus?: DatastoreStatus;
    /**
     * A filter that allows the user to set cutoff dates for records. All Data Stores created before the specified date will be included in the results. 
     */
    CreatedBefore?: Timestamp;
    /**
     * A filter that allows the user to set cutoff dates for records. All Data Stores created after the specified date will be included in the results.
     */
    CreatedAfter?: Timestamp;
  }
  export type DatastoreId = string;
  export type DatastoreName = string;
  export interface DatastoreProperties {
    /**
     * The AWS-generated ID number for the Data Store.
     */
    DatastoreId: DatastoreId;
    /**
     * The Amazon Resource Name used in the creation of the Data Store.
     */
    DatastoreArn: DatastoreArn;
    /**
     * The user-generated name for the Data Store.
     */
    DatastoreName?: DatastoreName;
    /**
     * The status of the Data Store. Possible statuses are 'CREATING', 'ACTIVE', 'DELETING', or 'DELETED'.
     */
    DatastoreStatus: DatastoreStatus;
    /**
     * The time that a Data Store was created. 
     */
    CreatedAt?: Timestamp;
    /**
     * The FHIR version. Only R4 version data is supported.
     */
    DatastoreTypeVersion: FHIRVersion;
    /**
     * The AWS endpoint for the Data Store. Each Data Store will have it's own endpoint with Data Store ID in the endpoint URL.
     */
    DatastoreEndpoint: String;
    /**
     *  The server-side encryption key configuration for a customer provided encryption key (CMK). 
     */
    SseConfiguration?: SseConfiguration;
    /**
     * The preloaded data configuration for the Data Store. Only data preloaded from Synthea is supported.
     */
    PreloadDataConfig?: PreloadDataConfig;
  }
  export type DatastorePropertiesList = DatastoreProperties[];
  export type DatastoreStatus = "CREATING"|"ACTIVE"|"DELETING"|"DELETED"|string;
  export interface DeleteFHIRDatastoreRequest {
    /**
     *  The AWS-generated ID for the Data Store to be deleted.
     */
    DatastoreId?: DatastoreId;
  }
  export interface DeleteFHIRDatastoreResponse {
    /**
     * The AWS-generated ID for the Data Store to be deleted.
     */
    DatastoreId: DatastoreId;
    /**
     * The Amazon Resource Name (ARN) that gives Amazon HealthLake access permission.
     */
    DatastoreArn: DatastoreArn;
    /**
     * The status of the Data Store that the user has requested to be deleted. 
     */
    DatastoreStatus: DatastoreStatus;
    /**
     * The AWS endpoint for the Data Store the user has requested to be deleted.
     */
    DatastoreEndpoint: BoundedLengthString;
  }
  export interface DescribeFHIRDatastoreRequest {
    /**
     * The AWS-generated Data Store id. This is part of the ‘CreateFHIRDatastore’ output.
     */
    DatastoreId?: DatastoreId;
  }
  export interface DescribeFHIRDatastoreResponse {
    /**
     * All properties associated with a Data Store, including the Data Store ID, Data Store ARN, Data Store name, Data Store status, created at, Data Store type version, and Data Store endpoint.
     */
    DatastoreProperties: DatastoreProperties;
  }
  export interface DescribeFHIRExportJobRequest {
    /**
     * The AWS generated ID for the Data Store from which files are being exported from for an export job.
     */
    DatastoreId: DatastoreId;
    /**
     * The AWS generated ID for an export job.
     */
    JobId: JobId;
  }
  export interface DescribeFHIRExportJobResponse {
    /**
     * Displays the properties of the export job, including the ID, Arn, Name, and the status of the job. 
     */
    ExportJobProperties: ExportJobProperties;
  }
  export interface DescribeFHIRImportJobRequest {
    /**
     * The AWS-generated ID of the Data Store.
     */
    DatastoreId: DatastoreId;
    /**
     * The AWS-generated job ID.
     */
    JobId: JobId;
  }
  export interface DescribeFHIRImportJobResponse {
    /**
     * The properties of the Import job request, including the ID, ARN, name, and the status of the job.
     */
    ImportJobProperties: ImportJobProperties;
  }
  export type EncryptionKeyID = string;
  export interface ExportJobProperties {
    /**
     * The AWS generated ID for an export job.
     */
    JobId: JobId;
    /**
     * The user generated name for an export job.
     */
    JobName?: JobName;
    /**
     * The status of a FHIR export job. Possible statuses are SUBMITTED, IN_PROGRESS, COMPLETED, or FAILED.
     */
    JobStatus: JobStatus;
    /**
     * The time an export job was initiated.
     */
    SubmitTime: Timestamp;
    /**
     * The time an export job completed.
     */
    EndTime?: Timestamp;
    /**
     * The AWS generated ID for the Data Store from which files are being exported for an export job.
     */
    DatastoreId: DatastoreId;
    /**
     * The output data configuration that was supplied when the export job was created.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name used during the initiation of the job.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * An explanation of any errors that may have occurred during the export job.
     */
    Message?: Message;
  }
  export type ExportJobPropertiesList = ExportJobProperties[];
  export type FHIRVersion = "R4"|string;
  export type IamRoleArn = string;
  export interface ImportJobProperties {
    /**
     * The AWS-generated id number for the Import job.
     */
    JobId: JobId;
    /**
     * The user-generated name for an Import job.
     */
    JobName?: JobName;
    /**
     * The job status for an Import job. Possible statuses are SUBMITTED, IN_PROGRESS, COMPLETED, FAILED.
     */
    JobStatus: JobStatus;
    /**
     * The time that the Import job was submitted for processing.
     */
    SubmitTime: Timestamp;
    /**
     * The time that the Import job was completed.
     */
    EndTime?: Timestamp;
    /**
     * The datastore id used when the Import job was created. 
     */
    DatastoreId: DatastoreId;
    /**
     * The input data configuration that was supplied when the Import job was created.
     */
    InputDataConfig: InputDataConfig;
    JobOutputDataConfig?: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) that gives Amazon HealthLake access to your input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * An explanation of any errors that may have occurred during the FHIR import job. 
     */
    Message?: Message;
  }
  export type ImportJobPropertiesList = ImportJobProperties[];
  export interface InputDataConfig {
    /**
     * The S3Uri is the user specified S3 location of the FHIR data to be imported into Amazon HealthLake. 
     */
    S3Uri?: S3Uri;
  }
  export type JobId = string;
  export type JobName = string;
  export type JobStatus = "SUBMITTED"|"IN_PROGRESS"|"COMPLETED_WITH_ERRORS"|"COMPLETED"|"FAILED"|string;
  export interface KmsEncryptionConfig {
    /**
     *  The type of customer-managed-key(CMK) used for encyrption. The two types of supported CMKs are customer owned CMKs and AWS owned CMKs. 
     */
    CmkType: CmkType;
    /**
     *  The KMS encryption key id/alias used to encrypt the Data Store contents at rest. 
     */
    KmsKeyId?: EncryptionKeyID;
  }
  export interface ListFHIRDatastoresRequest {
    /**
     * Lists all filters associated with a FHIR Data Store request.
     */
    Filter?: DatastoreFilter;
    /**
     * Fetches the next page of Data Stores when results are paginated.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of Data Stores returned in a single page of a ListFHIRDatastoresRequest call.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListFHIRDatastoresResponse {
    /**
     * All properties associated with the listed Data Stores.
     */
    DatastorePropertiesList: DatastorePropertiesList;
    /**
     * Pagination token that can be used to retrieve the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListFHIRExportJobsRequest {
    /**
     *  This parameter limits the response to the export job with the specified Data Store ID. 
     */
    DatastoreId: DatastoreId;
    /**
     *  A pagination token used to identify the next page of results to return for a ListFHIRExportJobs query. 
     */
    NextToken?: NextToken;
    /**
     *  This parameter limits the number of results returned for a ListFHIRExportJobs to a maximum quantity specified by the user. 
     */
    MaxResults?: MaxResultsInteger;
    /**
     *  This parameter limits the response to the export job with the specified job name. 
     */
    JobName?: JobName;
    /**
     *  This parameter limits the response to the export jobs with the specified job status. 
     */
    JobStatus?: JobStatus;
    /**
     *  This parameter limits the response to FHIR export jobs submitted before a user specified date. 
     */
    SubmittedBefore?: Timestamp;
    /**
     *  This parameter limits the response to FHIR export jobs submitted after a user specified date. 
     */
    SubmittedAfter?: Timestamp;
  }
  export interface ListFHIRExportJobsResponse {
    /**
     *  The properties of listed FHIR export jobs, including the ID, ARN, name, and the status of the job. 
     */
    ExportJobPropertiesList: ExportJobPropertiesList;
    /**
     *  A pagination token used to identify the next page of results to return for a ListFHIRExportJobs query. 
     */
    NextToken?: NextToken;
  }
  export interface ListFHIRImportJobsRequest {
    /**
     *  This parameter limits the response to the import job with the specified Data Store ID. 
     */
    DatastoreId: DatastoreId;
    /**
     *  A pagination token used to identify the next page of results to return for a ListFHIRImportJobs query. 
     */
    NextToken?: NextToken;
    /**
     *  This parameter limits the number of results returned for a ListFHIRImportJobs to a maximum quantity specified by the user. 
     */
    MaxResults?: MaxResultsInteger;
    /**
     *  This parameter limits the response to the import job with the specified job name. 
     */
    JobName?: JobName;
    /**
     *  This parameter limits the response to the import job with the specified job status. 
     */
    JobStatus?: JobStatus;
    /**
     *  This parameter limits the response to FHIR import jobs submitted before a user specified date. 
     */
    SubmittedBefore?: Timestamp;
    /**
     *  This parameter limits the response to FHIR import jobs submitted after a user specified date. 
     */
    SubmittedAfter?: Timestamp;
  }
  export interface ListFHIRImportJobsResponse {
    /**
     *  The properties of a listed FHIR import jobs, including the ID, ARN, name, and the status of the job. 
     */
    ImportJobPropertiesList: ImportJobPropertiesList;
    /**
     *  A pagination token used to identify the next page of results to return for a ListFHIRImportJobs query. 
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     *  The Amazon Resource Name(ARN) of the Data Store for which tags are being added. 
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     *  Returns a list of tags associated with a Data Store. 
     */
    Tags?: TagList;
  }
  export type MaxResultsInteger = number;
  export type Message = string;
  export type NextToken = string;
  export interface OutputDataConfig {
    /**
     *  The output data configuration that was supplied when the export job was created. 
     */
    S3Configuration?: S3Configuration;
  }
  export interface PreloadDataConfig {
    /**
     * The type of preloaded data. Only Synthea preloaded data is supported.
     */
    PreloadDataType: PreloadDataType;
  }
  export type PreloadDataType = "SYNTHEA"|string;
  export interface S3Configuration {
    /**
     *  The S3Uri is the user specified S3 location of the FHIR data to be imported into Amazon HealthLake. 
     */
    S3Uri: S3Uri;
    /**
     *  The KMS key ID used to access the S3 bucket. 
     */
    KmsKeyId: EncryptionKeyID;
  }
  export type S3Uri = string;
  export interface SseConfiguration {
    /**
     *  The KMS encryption configuration used to provide details for data encryption. 
     */
    KmsEncryptionConfig: KmsEncryptionConfig;
  }
  export interface StartFHIRExportJobRequest {
    /**
     * The user generated name for an export job.
     */
    JobName?: JobName;
    /**
     * The output data configuration that was supplied when the export job was created.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The AWS generated ID for the Data Store from which files are being exported for an export job.
     */
    DatastoreId: DatastoreId;
    /**
     * The Amazon Resource Name used during the initiation of the job.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * An optional user provided token used for ensuring idempotency.
     */
    ClientToken: ClientTokenString;
  }
  export interface StartFHIRExportJobResponse {
    /**
     * The AWS generated ID for an export job.
     */
    JobId: JobId;
    /**
     * The status of a FHIR export job. Possible statuses are SUBMITTED, IN_PROGRESS, COMPLETED, or FAILED.
     */
    JobStatus: JobStatus;
    /**
     * The AWS generated ID for the Data Store from which files are being exported for an export job.
     */
    DatastoreId?: DatastoreId;
  }
  export interface StartFHIRImportJobRequest {
    /**
     * The name of the FHIR Import job in the StartFHIRImport job request.
     */
    JobName?: JobName;
    /**
     * The input properties of the FHIR Import job in the StartFHIRImport job request.
     */
    InputDataConfig: InputDataConfig;
    JobOutputDataConfig: OutputDataConfig;
    /**
     * The AWS-generated Data Store ID.
     */
    DatastoreId: DatastoreId;
    /**
     * The Amazon Resource Name (ARN) that gives Amazon HealthLake access permission.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * Optional user provided token used for ensuring idempotency.
     */
    ClientToken: ClientTokenString;
  }
  export interface StartFHIRImportJobResponse {
    /**
     * The AWS-generated job ID.
     */
    JobId: JobId;
    /**
     * The status of an import job.
     */
    JobStatus: JobStatus;
    /**
     * The AWS-generated Data Store ID.
     */
    DatastoreId?: DatastoreId;
  }
  export type String = string;
  export interface Tag {
    /**
     *  The key portion of a tag. Tag keys are case sensitive. 
     */
    Key: TagKey;
    /**
     *  The value portion of tag. Tag values are case sensitive. 
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     *  The Amazon Resource Name(ARN)that gives Amazon HealthLake access to the Data Store which tags are being added to. 
     */
    ResourceARN: AmazonResourceName;
    /**
     *  The user specified key and value pair tags being added to a Data Store. 
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     *  "The Amazon Resource Name(ARN) of the Data Store for which tags are being removed 
     */
    ResourceARN: AmazonResourceName;
    /**
     *  The keys for the tags to be removed from the Healthlake Data Store. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-07-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the HealthLake client.
   */
  export import Types = HealthLake;
}
export = HealthLake;
