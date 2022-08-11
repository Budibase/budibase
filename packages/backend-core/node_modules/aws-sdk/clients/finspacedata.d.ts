import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Finspacedata extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Finspacedata.Types.ClientConfiguration)
  config: Config & Finspacedata.Types.ClientConfiguration;
  /**
   * Creates a new changeset in a FinSpace dataset.
   */
  createChangeset(params: Finspacedata.Types.CreateChangesetRequest, callback?: (err: AWSError, data: Finspacedata.Types.CreateChangesetResponse) => void): Request<Finspacedata.Types.CreateChangesetResponse, AWSError>;
  /**
   * Creates a new changeset in a FinSpace dataset.
   */
  createChangeset(callback?: (err: AWSError, data: Finspacedata.Types.CreateChangesetResponse) => void): Request<Finspacedata.Types.CreateChangesetResponse, AWSError>;
  /**
   * Request programmatic credentials to use with Habanero SDK.
   */
  getProgrammaticAccessCredentials(params: Finspacedata.Types.GetProgrammaticAccessCredentialsRequest, callback?: (err: AWSError, data: Finspacedata.Types.GetProgrammaticAccessCredentialsResponse) => void): Request<Finspacedata.Types.GetProgrammaticAccessCredentialsResponse, AWSError>;
  /**
   * Request programmatic credentials to use with Habanero SDK.
   */
  getProgrammaticAccessCredentials(callback?: (err: AWSError, data: Finspacedata.Types.GetProgrammaticAccessCredentialsResponse) => void): Request<Finspacedata.Types.GetProgrammaticAccessCredentialsResponse, AWSError>;
  /**
   * A temporary Amazon S3 location to copy your files from a source location to stage or use as a scratch space in Habanero notebook.
   */
  getWorkingLocation(params: Finspacedata.Types.GetWorkingLocationRequest, callback?: (err: AWSError, data: Finspacedata.Types.GetWorkingLocationResponse) => void): Request<Finspacedata.Types.GetWorkingLocationResponse, AWSError>;
  /**
   * A temporary Amazon S3 location to copy your files from a source location to stage or use as a scratch space in Habanero notebook.
   */
  getWorkingLocation(callback?: (err: AWSError, data: Finspacedata.Types.GetWorkingLocationResponse) => void): Request<Finspacedata.Types.GetWorkingLocationResponse, AWSError>;
}
declare namespace Finspacedata {
  export type ChangeType = "REPLACE"|"APPEND"|"MODIFY"|string;
  export interface ChangesetInfo {
    /**
     * Unique identifier for a changeset.
     */
    id?: IdType;
    /**
     * The ARN identifier of the changeset.
     */
    changesetArn?: arn;
    /**
     * The unique identifier for the FinSpace dataset in which the changeset is created.
     */
    datasetId?: IdType;
    /**
     * Change type indicates how a changeset is applied to a dataset.    REPLACE - Changeset is considered as a replacement to all prior loaded changesets.    APPEND - Changeset is considered as an addition to the end of all prior loaded changesets.    MODIFY - Changeset is considered as a replacement to a specific prior ingested changeset.  
     */
    changeType?: ChangeType;
    /**
     * Type of the data source from which the files to create the changeset are sourced.    S3 - Amazon S3.  
     */
    sourceType?: SourceType;
    /**
     * Source path from which the files to create the changeset are sourced.
     */
    sourceParams?: stringMap;
    /**
     * Format type of the input files loaded into the changeset.
     */
    formatType?: FormatType;
    /**
     * Structure of the source file(s).
     */
    formatParams?: stringMap;
    /**
     * The timestamp at which the changeset was created in FinSpace.
     */
    createTimestamp?: Timestamp;
    /**
     * The status of changeset creation operation.
     */
    status?: ChangesetStatus;
    /**
     * The structure with error messages.
     */
    errorInfo?: ErrorInfo;
    /**
     * Tags associated with the changeset.
     */
    changesetLabels?: stringMap;
    /**
     * Unique identifier of the changeset that is updated.
     */
    updatesChangesetId?: stringValue;
    /**
     * Unique identifier of the changeset that is updated a changeset.
     */
    updatedByChangesetId?: stringValue;
  }
  export type ChangesetStatus = "PENDING"|"FAILED"|"SUCCESS"|"RUNNING"|"STOP_REQUESTED"|string;
  export interface CreateChangesetRequest {
    /**
     * The unique identifier for the FinSpace dataset in which the changeset will be created.
     */
    datasetId: IdType;
    /**
     * Option to indicate how a changeset will be applied to a dataset.    REPLACE - Changeset will be considered as a replacement to all prior loaded changesets.    APPEND - Changeset will be considered as an addition to the end of all prior loaded changesets.  
     */
    changeType: ChangeType;
    /**
     * Type of the data source from which the files to create the changeset will be sourced.    S3 - Amazon S3.  
     */
    sourceType: SourceType;
    /**
     * Source path from which the files to create the changeset will be sourced.
     */
    sourceParams: stringMap;
    /**
     * Format type of the input files being loaded into the changeset.
     */
    formatType?: FormatType;
    /**
     * Options that define the structure of the source file(s).
     */
    formatParams?: stringMap;
    /**
     * Metadata tags to apply to this changeset.
     */
    tags?: stringMap;
  }
  export interface CreateChangesetResponse {
    /**
     * Returns the changeset details.
     */
    changeset?: ChangesetInfo;
  }
  export interface Credentials {
    /**
     * The access key identifier.
     */
    accessKeyId?: stringValueLength1to255;
    /**
     * The access key.
     */
    secretAccessKey?: stringValueMaxLength1000;
    /**
     * The session token.
     */
    sessionToken?: stringValueMaxLength1000;
  }
  export type ErrorCategory = "The_inputs_to_this_request_are_invalid"|"Service_limits_have_been_exceeded"|"Missing_required_permission_to_perform_this_request"|"One_or_more_inputs_to_this_request_were_not_found"|"The_system_temporarily_lacks_sufficient_resources_to_process_the_request"|"An_internal_error_has_occurred"|"Cancelled"|"A_user_recoverable_error_has_occurred"|string;
  export interface ErrorInfo {
    /**
     * The text of the error message.
     */
    errorMessage?: stringValueMaxLength1000;
    /**
     * The category of the error.    VALIDATION -The inputs to this request are invalid.    SERVICE_QUOTA_EXCEEDED - Service quotas have been exceeded. Please contact AWS support to increase quotas.    ACCESS_DENIED - Missing required permission to perform this request.    RESOURCE_NOT_FOUND - One or more inputs to this request were not found.    THROTTLING - The system temporarily lacks sufficient resources to process the request.    INTERNAL_SERVICE_EXCEPTION - An internal service error has occurred.    CANCELLED - A user recoverable error has occurred.  
     */
    errorCategory?: ErrorCategory;
  }
  export type FormatType = "CSV"|"JSON"|"PARQUET"|"XML"|string;
  export interface GetProgrammaticAccessCredentialsRequest {
    /**
     * The time duration in which the credentials remain valid. 
     */
    durationInMinutes?: SessionDuration;
    /**
     * The habanero environment identifier.
     */
    environmentId: IdType;
  }
  export interface GetProgrammaticAccessCredentialsResponse {
    /**
     * Returns the programmatic credentials.
     */
    credentials?: Credentials;
    /**
     * Returns the duration in which the credentials will remain valid.
     */
    durationInMinutes?: SessionDuration;
  }
  export interface GetWorkingLocationRequest {
    /**
     * Specify the type of the working location.    SAGEMAKER - Use the Amazon S3 location as a temporary location to store data content when working with FinSpace Notebooks that run on SageMaker studio.    INGESTION - Use the Amazon S3 location as a staging location to copy your data content and then use the location with the changeset creation operation.  
     */
    locationType?: locationType;
  }
  export interface GetWorkingLocationResponse {
    /**
     * Returns the Amazon S3 URI for the working location.
     */
    s3Uri?: stringValueLength1to1024;
    /**
     * Returns the Amazon S3 Path for the working location.
     */
    s3Path?: stringValueLength1to1024;
    /**
     * Returns the Amazon S3 bucket name for the working location.
     */
    s3Bucket?: stringValueLength1to63;
  }
  export type IdType = string;
  export type SessionDuration = number;
  export type SourceType = "S3"|string;
  export type Timestamp = Date;
  export type arn = string;
  export type locationType = "INGESTION"|"SAGEMAKER"|string;
  export type stringMap = {[key: string]: stringMapValue};
  export type stringMapKey = string;
  export type stringMapValue = string;
  export type stringValue = string;
  export type stringValueLength1to1024 = string;
  export type stringValueLength1to255 = string;
  export type stringValueLength1to63 = string;
  export type stringValueMaxLength1000 = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-07-13"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Finspacedata client.
   */
  export import Types = Finspacedata;
}
export = Finspacedata;
