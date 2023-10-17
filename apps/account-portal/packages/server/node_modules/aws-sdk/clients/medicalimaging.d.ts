import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class MedicalImaging extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MedicalImaging.Types.ClientConfiguration)
  config: Config & MedicalImaging.Types.ClientConfiguration;
  /**
   * Copy an image set.
   */
  copyImageSet(params: MedicalImaging.Types.CopyImageSetRequest, callback?: (err: AWSError, data: MedicalImaging.Types.CopyImageSetResponse) => void): Request<MedicalImaging.Types.CopyImageSetResponse, AWSError>;
  /**
   * Copy an image set.
   */
  copyImageSet(callback?: (err: AWSError, data: MedicalImaging.Types.CopyImageSetResponse) => void): Request<MedicalImaging.Types.CopyImageSetResponse, AWSError>;
  /**
   * Create a data store.
   */
  createDatastore(params: MedicalImaging.Types.CreateDatastoreRequest, callback?: (err: AWSError, data: MedicalImaging.Types.CreateDatastoreResponse) => void): Request<MedicalImaging.Types.CreateDatastoreResponse, AWSError>;
  /**
   * Create a data store.
   */
  createDatastore(callback?: (err: AWSError, data: MedicalImaging.Types.CreateDatastoreResponse) => void): Request<MedicalImaging.Types.CreateDatastoreResponse, AWSError>;
  /**
   * Delete a data store.  Before a data store can be deleted, you must first delete all image sets within it. 
   */
  deleteDatastore(params: MedicalImaging.Types.DeleteDatastoreRequest, callback?: (err: AWSError, data: MedicalImaging.Types.DeleteDatastoreResponse) => void): Request<MedicalImaging.Types.DeleteDatastoreResponse, AWSError>;
  /**
   * Delete a data store.  Before a data store can be deleted, you must first delete all image sets within it. 
   */
  deleteDatastore(callback?: (err: AWSError, data: MedicalImaging.Types.DeleteDatastoreResponse) => void): Request<MedicalImaging.Types.DeleteDatastoreResponse, AWSError>;
  /**
   * Delete an image set.
   */
  deleteImageSet(params: MedicalImaging.Types.DeleteImageSetRequest, callback?: (err: AWSError, data: MedicalImaging.Types.DeleteImageSetResponse) => void): Request<MedicalImaging.Types.DeleteImageSetResponse, AWSError>;
  /**
   * Delete an image set.
   */
  deleteImageSet(callback?: (err: AWSError, data: MedicalImaging.Types.DeleteImageSetResponse) => void): Request<MedicalImaging.Types.DeleteImageSetResponse, AWSError>;
  /**
   * Get the import job properties to learn more about the job or job progress.
   */
  getDICOMImportJob(params: MedicalImaging.Types.GetDICOMImportJobRequest, callback?: (err: AWSError, data: MedicalImaging.Types.GetDICOMImportJobResponse) => void): Request<MedicalImaging.Types.GetDICOMImportJobResponse, AWSError>;
  /**
   * Get the import job properties to learn more about the job or job progress.
   */
  getDICOMImportJob(callback?: (err: AWSError, data: MedicalImaging.Types.GetDICOMImportJobResponse) => void): Request<MedicalImaging.Types.GetDICOMImportJobResponse, AWSError>;
  /**
   * Get data store properties.
   */
  getDatastore(params: MedicalImaging.Types.GetDatastoreRequest, callback?: (err: AWSError, data: MedicalImaging.Types.GetDatastoreResponse) => void): Request<MedicalImaging.Types.GetDatastoreResponse, AWSError>;
  /**
   * Get data store properties.
   */
  getDatastore(callback?: (err: AWSError, data: MedicalImaging.Types.GetDatastoreResponse) => void): Request<MedicalImaging.Types.GetDatastoreResponse, AWSError>;
  /**
   * Get an image frame (pixel data) for an image set.
   */
  getImageFrame(params: MedicalImaging.Types.GetImageFrameRequest, callback?: (err: AWSError, data: MedicalImaging.Types.GetImageFrameResponse) => void): Request<MedicalImaging.Types.GetImageFrameResponse, AWSError>;
  /**
   * Get an image frame (pixel data) for an image set.
   */
  getImageFrame(callback?: (err: AWSError, data: MedicalImaging.Types.GetImageFrameResponse) => void): Request<MedicalImaging.Types.GetImageFrameResponse, AWSError>;
  /**
   * Get image set properties.
   */
  getImageSet(params: MedicalImaging.Types.GetImageSetRequest, callback?: (err: AWSError, data: MedicalImaging.Types.GetImageSetResponse) => void): Request<MedicalImaging.Types.GetImageSetResponse, AWSError>;
  /**
   * Get image set properties.
   */
  getImageSet(callback?: (err: AWSError, data: MedicalImaging.Types.GetImageSetResponse) => void): Request<MedicalImaging.Types.GetImageSetResponse, AWSError>;
  /**
   * Get metadata attributes for an image set.
   */
  getImageSetMetadata(params: MedicalImaging.Types.GetImageSetMetadataRequest, callback?: (err: AWSError, data: MedicalImaging.Types.GetImageSetMetadataResponse) => void): Request<MedicalImaging.Types.GetImageSetMetadataResponse, AWSError>;
  /**
   * Get metadata attributes for an image set.
   */
  getImageSetMetadata(callback?: (err: AWSError, data: MedicalImaging.Types.GetImageSetMetadataResponse) => void): Request<MedicalImaging.Types.GetImageSetMetadataResponse, AWSError>;
  /**
   * List import jobs created by this AWS account for a specific data store.
   */
  listDICOMImportJobs(params: MedicalImaging.Types.ListDICOMImportJobsRequest, callback?: (err: AWSError, data: MedicalImaging.Types.ListDICOMImportJobsResponse) => void): Request<MedicalImaging.Types.ListDICOMImportJobsResponse, AWSError>;
  /**
   * List import jobs created by this AWS account for a specific data store.
   */
  listDICOMImportJobs(callback?: (err: AWSError, data: MedicalImaging.Types.ListDICOMImportJobsResponse) => void): Request<MedicalImaging.Types.ListDICOMImportJobsResponse, AWSError>;
  /**
   * List data stores created by this AWS account.
   */
  listDatastores(params: MedicalImaging.Types.ListDatastoresRequest, callback?: (err: AWSError, data: MedicalImaging.Types.ListDatastoresResponse) => void): Request<MedicalImaging.Types.ListDatastoresResponse, AWSError>;
  /**
   * List data stores created by this AWS account.
   */
  listDatastores(callback?: (err: AWSError, data: MedicalImaging.Types.ListDatastoresResponse) => void): Request<MedicalImaging.Types.ListDatastoresResponse, AWSError>;
  /**
   * List image set versions.
   */
  listImageSetVersions(params: MedicalImaging.Types.ListImageSetVersionsRequest, callback?: (err: AWSError, data: MedicalImaging.Types.ListImageSetVersionsResponse) => void): Request<MedicalImaging.Types.ListImageSetVersionsResponse, AWSError>;
  /**
   * List image set versions.
   */
  listImageSetVersions(callback?: (err: AWSError, data: MedicalImaging.Types.ListImageSetVersionsResponse) => void): Request<MedicalImaging.Types.ListImageSetVersionsResponse, AWSError>;
  /**
   * Lists all tags associated with a medical imaging resource.
   */
  listTagsForResource(params: MedicalImaging.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: MedicalImaging.Types.ListTagsForResourceResponse) => void): Request<MedicalImaging.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags associated with a medical imaging resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: MedicalImaging.Types.ListTagsForResourceResponse) => void): Request<MedicalImaging.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Search image sets based on defined input attributes.
   */
  searchImageSets(params: MedicalImaging.Types.SearchImageSetsRequest, callback?: (err: AWSError, data: MedicalImaging.Types.SearchImageSetsResponse) => void): Request<MedicalImaging.Types.SearchImageSetsResponse, AWSError>;
  /**
   * Search image sets based on defined input attributes.
   */
  searchImageSets(callback?: (err: AWSError, data: MedicalImaging.Types.SearchImageSetsResponse) => void): Request<MedicalImaging.Types.SearchImageSetsResponse, AWSError>;
  /**
   * Start importing bulk data into an ACTIVE data store. The import job imports DICOM P10 files found in the S3 prefix specified by the inputS3Uri parameter. The import job stores processing results in the file specified by the outputS3Uri parameter.
   */
  startDICOMImportJob(params: MedicalImaging.Types.StartDICOMImportJobRequest, callback?: (err: AWSError, data: MedicalImaging.Types.StartDICOMImportJobResponse) => void): Request<MedicalImaging.Types.StartDICOMImportJobResponse, AWSError>;
  /**
   * Start importing bulk data into an ACTIVE data store. The import job imports DICOM P10 files found in the S3 prefix specified by the inputS3Uri parameter. The import job stores processing results in the file specified by the outputS3Uri parameter.
   */
  startDICOMImportJob(callback?: (err: AWSError, data: MedicalImaging.Types.StartDICOMImportJobResponse) => void): Request<MedicalImaging.Types.StartDICOMImportJobResponse, AWSError>;
  /**
   * Adds a user-specifed key and value tag to a medical imaging resource.
   */
  tagResource(params: MedicalImaging.Types.TagResourceRequest, callback?: (err: AWSError, data: MedicalImaging.Types.TagResourceResponse) => void): Request<MedicalImaging.Types.TagResourceResponse, AWSError>;
  /**
   * Adds a user-specifed key and value tag to a medical imaging resource.
   */
  tagResource(callback?: (err: AWSError, data: MedicalImaging.Types.TagResourceResponse) => void): Request<MedicalImaging.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from a medical imaging resource.
   */
  untagResource(params: MedicalImaging.Types.UntagResourceRequest, callback?: (err: AWSError, data: MedicalImaging.Types.UntagResourceResponse) => void): Request<MedicalImaging.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a medical imaging resource.
   */
  untagResource(callback?: (err: AWSError, data: MedicalImaging.Types.UntagResourceResponse) => void): Request<MedicalImaging.Types.UntagResourceResponse, AWSError>;
  /**
   * Update image set metadata attributes.
   */
  updateImageSetMetadata(params: MedicalImaging.Types.UpdateImageSetMetadataRequest, callback?: (err: AWSError, data: MedicalImaging.Types.UpdateImageSetMetadataResponse) => void): Request<MedicalImaging.Types.UpdateImageSetMetadataResponse, AWSError>;
  /**
   * Update image set metadata attributes.
   */
  updateImageSetMetadata(callback?: (err: AWSError, data: MedicalImaging.Types.UpdateImageSetMetadataResponse) => void): Request<MedicalImaging.Types.UpdateImageSetMetadataResponse, AWSError>;
}
declare namespace MedicalImaging {
  export type Arn = string;
  export type ClientToken = string;
  export interface CopyDestinationImageSet {
    /**
     * The image set identifier for the destination image set.
     */
    imageSetId: ImageSetId;
    /**
     * The latest version identifier for the destination image set.
     */
    latestVersionId: ImageSetExternalVersionId;
  }
  export interface CopyDestinationImageSetProperties {
    /**
     * The image set identifier of the copied image set properties.
     */
    imageSetId: ImageSetId;
    /**
     * The latest version identifier for the destination image set properties.
     */
    latestVersionId: ImageSetExternalVersionId;
    /**
     * The image set state of the destination image set properties.
     */
    imageSetState?: ImageSetState;
    /**
     * The image set workflow status of the destination image set properties.
     */
    imageSetWorkflowStatus?: ImageSetWorkflowStatus;
    /**
     * The timestamp when the destination image set properties were created.
     */
    createdAt?: _Date;
    /**
     * The timestamp when the destination image set properties were last updated.
     */
    updatedAt?: _Date;
    /**
     * The Amazon Resource Name (ARN) assigned to the destination image set.
     */
    imageSetArn?: Arn;
  }
  export interface CopyImageSetInformation {
    /**
     * The source image set.
     */
    sourceImageSet: CopySourceImageSetInformation;
    /**
     * The destination image set.
     */
    destinationImageSet?: CopyDestinationImageSet;
  }
  export interface CopyImageSetRequest {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The source image set identifier.
     */
    sourceImageSetId: ImageSetId;
    /**
     * Copy image set information.
     */
    copyImageSetInformation: CopyImageSetInformation;
  }
  export interface CopyImageSetResponse {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The properties of the source image set.
     */
    sourceImageSetProperties: CopySourceImageSetProperties;
    /**
     * The properties of the destination image set.
     */
    destinationImageSetProperties: CopyDestinationImageSetProperties;
  }
  export interface CopySourceImageSetInformation {
    /**
     * The latest version identifier for the source image set.
     */
    latestVersionId: ImageSetExternalVersionId;
  }
  export interface CopySourceImageSetProperties {
    /**
     * The image set identifier for the copied source image set.
     */
    imageSetId: ImageSetId;
    /**
     * The latest version identifier for the copied source image set.
     */
    latestVersionId: ImageSetExternalVersionId;
    /**
     * The image set state of the copied source image set.
     */
    imageSetState?: ImageSetState;
    /**
     * The workflow status of the copied source image set.
     */
    imageSetWorkflowStatus?: ImageSetWorkflowStatus;
    /**
     * The timestamp when the source image set properties were created.
     */
    createdAt?: _Date;
    /**
     * The timestamp when the source image set properties were updated.
     */
    updatedAt?: _Date;
    /**
     * The Amazon Resource Name (ARN) assigned to the source image set.
     */
    imageSetArn?: Arn;
  }
  export interface CreateDatastoreRequest {
    /**
     * The data store name.
     */
    datastoreName?: DatastoreName;
    /**
     * A unique identifier for API idempotency.
     */
    clientToken: ClientToken;
    /**
     * The tags provided when creating a data store.
     */
    tags?: TagMap;
    /**
     * The Amazon Resource Name (ARN) assigned to the AWS Key Management Service (AWS KMS) key for accessing encrypted data.
     */
    kmsKeyArn?: KmsKeyArn;
  }
  export interface CreateDatastoreResponse {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The data store status.
     */
    datastoreStatus: DatastoreStatus;
  }
  export type DICOMAccessionNumber = string;
  export type DICOMAttribute = Buffer|Uint8Array|Blob|string;
  export interface DICOMImportJobProperties {
    /**
     * The import job identifier.
     */
    jobId: JobId;
    /**
     * The import job name.
     */
    jobName: JobName;
    /**
     * The filters for listing import jobs based on status.
     */
    jobStatus: JobStatus;
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The Amazon Resource Name (ARN) that grants permissions to access medical imaging resources.
     */
    dataAccessRoleArn: RoleArn;
    /**
     * The timestamp for when the import job was ended.
     */
    endedAt?: _Date;
    /**
     * The timestamp for when the import job was submitted.
     */
    submittedAt?: _Date;
    /**
     * The input prefix path for the S3 bucket that contains the DICOM P10 files to be imported.
     */
    inputS3Uri: S3Uri;
    /**
     * The output prefix of the S3 bucket to upload the results of the DICOM import job.
     */
    outputS3Uri: S3Uri;
    /**
     * The error message thrown if an import job fails.
     */
    message?: Message;
  }
  export type DICOMImportJobSummaries = DICOMImportJobSummary[];
  export interface DICOMImportJobSummary {
    /**
     * The import job identifier.
     */
    jobId: JobId;
    /**
     * The import job name.
     */
    jobName: JobName;
    /**
     * The filters for listing import jobs based on status.
     */
    jobStatus: JobStatus;
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The Amazon Resource Name (ARN) that grants permissions to access medical imaging resources.
     */
    dataAccessRoleArn?: RoleArn;
    /**
     * The timestamp when an import job ended.
     */
    endedAt?: _Date;
    /**
     * The timestamp when an import job was submitted.
     */
    submittedAt?: _Date;
    /**
     * The error message thrown if an import job fails.
     */
    message?: Message;
  }
  export type DICOMNumberOfStudyRelatedInstances = number;
  export type DICOMNumberOfStudyRelatedSeries = number;
  export type DICOMPatientBirthDate = string;
  export type DICOMPatientId = string;
  export type DICOMPatientName = string;
  export type DICOMPatientSex = string;
  export type DICOMStudyDate = string;
  export interface DICOMStudyDateAndTime {
    /**
     * The DICOM study date provided in yyMMdd format.
     */
    DICOMStudyDate: DICOMStudyDate;
    /**
     * The DICOM study time provided in HHmmss.FFFFFF format.
     */
    DICOMStudyTime?: DICOMStudyTime;
  }
  export type DICOMStudyDescription = string;
  export type DICOMStudyId = string;
  export type DICOMStudyInstanceUID = string;
  export type DICOMStudyTime = string;
  export interface DICOMTags {
    /**
     * The unique identifier for a patient in a DICOM Study.
     */
    DICOMPatientId?: DICOMPatientId;
    /**
     * The patient name.
     */
    DICOMPatientName?: DICOMPatientName;
    /**
     * The patient birth date.
     */
    DICOMPatientBirthDate?: DICOMPatientBirthDate;
    /**
     * The patient sex.
     */
    DICOMPatientSex?: DICOMPatientSex;
    /**
     * The DICOM provided identifier for studyInstanceUid.&gt;
     */
    DICOMStudyInstanceUID?: DICOMStudyInstanceUID;
    /**
     * The DICOM provided studyId.
     */
    DICOMStudyId?: DICOMStudyId;
    /**
     * The description of the study.
     */
    DICOMStudyDescription?: DICOMStudyDescription;
    /**
     * The total number of series in the DICOM study.
     */
    DICOMNumberOfStudyRelatedSeries?: DICOMNumberOfStudyRelatedSeries;
    /**
     * The total number of instances in the DICOM study.
     */
    DICOMNumberOfStudyRelatedInstances?: DICOMNumberOfStudyRelatedInstances;
    /**
     * The accession number for the DICOM study.
     */
    DICOMAccessionNumber?: DICOMAccessionNumber;
    /**
     * The study date.
     */
    DICOMStudyDate?: DICOMStudyDate;
    /**
     * The study time.
     */
    DICOMStudyTime?: DICOMStudyTime;
  }
  export interface DICOMUpdates {
    /**
     * The DICOM tags to be removed from ImageSetMetadata.
     */
    removableAttributes?: DICOMAttribute;
    /**
     * The DICOM tags that need to be updated in ImageSetMetadata.
     */
    updatableAttributes?: DICOMAttribute;
  }
  export type DatastoreId = string;
  export type DatastoreName = string;
  export interface DatastoreProperties {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The data store name.
     */
    datastoreName: DatastoreName;
    /**
     * The data store status.
     */
    datastoreStatus: DatastoreStatus;
    /**
     * The Amazon Resource Name (ARN) assigned to the AWS Key Management Service (AWS KMS) key for accessing encrypted data.
     */
    kmsKeyArn?: KmsKeyArn;
    /**
     * The Amazon Resource Name (ARN) for the data store.
     */
    datastoreArn?: Arn;
    /**
     * The timestamp when the data store was created.
     */
    createdAt?: _Date;
    /**
     * The timestamp when the data store was last updated.
     */
    updatedAt?: _Date;
  }
  export type DatastoreStatus = "CREATING"|"CREATE_FAILED"|"ACTIVE"|"DELETING"|"DELETED"|string;
  export type DatastoreSummaries = DatastoreSummary[];
  export interface DatastoreSummary {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The data store name.
     */
    datastoreName: DatastoreName;
    /**
     * The data store status.
     */
    datastoreStatus: DatastoreStatus;
    /**
     * The Amazon Resource Name (ARN) for the data store.
     */
    datastoreArn?: Arn;
    /**
     * The timestamp when the data store was created.
     */
    createdAt?: _Date;
    /**
     * The timestamp when the data store was last updated.
     */
    updatedAt?: _Date;
  }
  export type _Date = Date;
  export interface DeleteDatastoreRequest {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
  }
  export interface DeleteDatastoreResponse {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The data store status.
     */
    datastoreStatus: DatastoreStatus;
  }
  export interface DeleteImageSetRequest {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The image set identifier.
     */
    imageSetId: ImageSetId;
  }
  export interface DeleteImageSetResponse {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The image set identifier.
     */
    imageSetId: ImageSetId;
    /**
     * The image set state.
     */
    imageSetState: ImageSetState;
    /**
     * The image set workflow status.
     */
    imageSetWorkflowStatus: ImageSetWorkflowStatus;
  }
  export interface GetDICOMImportJobRequest {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The import job identifier.
     */
    jobId: JobId;
  }
  export interface GetDICOMImportJobResponse {
    /**
     * The properties of the import job.
     */
    jobProperties: DICOMImportJobProperties;
  }
  export interface GetDatastoreRequest {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
  }
  export interface GetDatastoreResponse {
    /**
     * The data store properties.
     */
    datastoreProperties: DatastoreProperties;
  }
  export interface GetImageFrameRequest {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The image set identifier.
     */
    imageSetId: ImageSetId;
    /**
     * Information about the image frame (pixel data) identifier.
     */
    imageFrameInformation: ImageFrameInformation;
  }
  export interface GetImageFrameResponse {
    /**
     * The blob containing the aggregated image frame information.
     */
    imageFrameBlob: PayloadBlob;
    /**
     * The format in which the image frame information is returned to the customer. Default is application/octet-stream.
     */
    contentType?: String;
  }
  export interface GetImageSetMetadataRequest {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The image set identifier.
     */
    imageSetId: ImageSetId;
    /**
     * The image set version identifier.
     */
    versionId?: ImageSetExternalVersionId;
  }
  export interface GetImageSetMetadataResponse {
    /**
     * The blob containing the aggregated metadata information for the image set.
     */
    imageSetMetadataBlob: ImageSetMetadataBlob;
    /**
     * The format in which the study metadata is returned to the customer. Default is text/plain.
     */
    contentType?: String;
    /**
     * The compression format in which image set metadata attributes are returned.
     */
    contentEncoding?: String;
  }
  export interface GetImageSetRequest {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The image set identifier.
     */
    imageSetId: ImageSetId;
    /**
     * The image set version identifier.
     */
    versionId?: ImageSetExternalVersionId;
  }
  export interface GetImageSetResponse {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The image set identifier.
     */
    imageSetId: ImageSetId;
    /**
     * The image set version identifier.
     */
    versionId: ImageSetExternalVersionId;
    /**
     * The image set state.
     */
    imageSetState: ImageSetState;
    /**
     * The image set workflow status.
     */
    imageSetWorkflowStatus?: ImageSetWorkflowStatus;
    /**
     * The timestamp when image set properties were created.
     */
    createdAt?: _Date;
    /**
     * The timestamp when image set properties were updated.
     */
    updatedAt?: _Date;
    /**
     * The timestamp when the image set properties were deleted.
     */
    deletedAt?: _Date;
    /**
     * The error message thrown if an image set action fails.
     */
    message?: Message;
    /**
     * The Amazon Resource Name (ARN) assigned to the image set.
     */
    imageSetArn?: Arn;
  }
  export type ImageFrameId = string;
  export interface ImageFrameInformation {
    /**
     * The image frame (pixel data) identifier.
     */
    imageFrameId: ImageFrameId;
  }
  export type ImageSetExternalVersionId = string;
  export type ImageSetId = string;
  export type ImageSetMetadataBlob = Buffer|Uint8Array|Blob|string|Readable;
  export interface ImageSetProperties {
    /**
     * The image set identifier.
     */
    imageSetId: ImageSetId;
    /**
     * The image set version identifier.
     */
    versionId: ImageSetExternalVersionId;
    /**
     * The image set state.
     */
    imageSetState: ImageSetState;
    /**
     * The image set workflow status.
     */
    ImageSetWorkflowStatus?: ImageSetWorkflowStatus;
    /**
     * The timestamp when the image set properties were created.
     */
    createdAt?: _Date;
    /**
     * The timestamp when the image set properties were updated.
     */
    updatedAt?: _Date;
    /**
     * The timestamp when the image set properties were deleted.
     */
    deletedAt?: _Date;
    /**
     * The error message thrown if an image set action fails.
     */
    message?: Message;
  }
  export type ImageSetPropertiesList = ImageSetProperties[];
  export type ImageSetState = "ACTIVE"|"LOCKED"|"DELETED"|string;
  export type ImageSetWorkflowStatus = "CREATED"|"COPIED"|"COPYING"|"COPYING_WITH_READ_ONLY_ACCESS"|"COPY_FAILED"|"UPDATING"|"UPDATED"|"UPDATE_FAILED"|"DELETING"|"DELETED"|string;
  export type ImageSetsMetadataSummaries = ImageSetsMetadataSummary[];
  export interface ImageSetsMetadataSummary {
    /**
     * The image set identifier.
     */
    imageSetId: ImageSetId;
    /**
     * The image set version.
     */
    version?: Integer;
    /**
     * The time an image set is created in AWS HealthImaging. Sample creation date is provided in 1985-04-12T23:20:50.52Z format.
     */
    createdAt?: _Date;
    /**
     * The time when an image was last updated in AWS HealthImaging.
     */
    updatedAt?: _Date;
    /**
     * The DICOM tags associated with the image set.
     */
    DICOMTags?: DICOMTags;
  }
  export type Integer = number;
  export type JobId = string;
  export type JobName = string;
  export type JobStatus = "SUBMITTED"|"IN_PROGRESS"|"COMPLETED"|"FAILED"|string;
  export type KmsKeyArn = string;
  export interface ListDICOMImportJobsRequest {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The filters for listing import jobs based on status.
     */
    jobStatus?: JobStatus;
    /**
     * The pagination token used to request the list of import jobs on the next page.
     */
    nextToken?: NextToken;
    /**
     * The max results count. The upper bound is determined by load testing.
     */
    maxResults?: ListDICOMImportJobsRequestMaxResultsInteger;
  }
  export type ListDICOMImportJobsRequestMaxResultsInteger = number;
  export interface ListDICOMImportJobsResponse {
    /**
     * A list of job summaries.
     */
    jobSummaries: DICOMImportJobSummaries;
    /**
     * The pagination token used to retrieve the list of import jobs on the next page.
     */
    nextToken?: NextToken;
  }
  export interface ListDatastoresRequest {
    /**
     * The data store status.
     */
    datastoreStatus?: DatastoreStatus;
    /**
     * The pagination token used to request the list of data stores on the next page.
     */
    nextToken?: NextToken;
    /**
     * Valid Range: Minimum value of 1. Maximum value of 50.
     */
    maxResults?: ListDatastoresRequestMaxResultsInteger;
  }
  export type ListDatastoresRequestMaxResultsInteger = number;
  export interface ListDatastoresResponse {
    /**
     * The list of summaries of data stores.
     */
    datastoreSummaries?: DatastoreSummaries;
    /**
     * The pagination token used to retrieve the list of data stores on the next page.
     */
    nextToken?: NextToken;
  }
  export interface ListImageSetVersionsRequest {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The image set identifier.
     */
    imageSetId: ImageSetId;
    /**
     * The pagination token used to request the list of image set versions on the next page.
     */
    nextToken?: NextToken;
    /**
     * The max results count.
     */
    maxResults?: ListImageSetVersionsRequestMaxResultsInteger;
  }
  export type ListImageSetVersionsRequestMaxResultsInteger = number;
  export interface ListImageSetVersionsResponse {
    /**
     * Lists all properties associated with an image set.
     */
    imageSetPropertiesList: ImageSetPropertiesList;
    /**
     * The pagination token used to retrieve the list of image set versions on the next page.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the medical imaging resource to list tags for.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of all tags associated with a medical imaging resource.
     */
    tags: TagMap;
  }
  export type Message = string;
  export interface MetadataUpdates {
    /**
     * The object containing removableAttributes and updatableAttributes.
     */
    DICOMUpdates?: DICOMUpdates;
  }
  export type NextToken = string;
  export type Operator = "EQUAL"|"BETWEEN"|string;
  export type PayloadBlob = Buffer|Uint8Array|Blob|string|Readable;
  export type RoleArn = string;
  export type S3Uri = string;
  export interface SearchByAttributeValue {
    /**
     * The patient ID input for search.
     */
    DICOMPatientId?: DICOMPatientId;
    /**
     * The DICOM accession number for search.
     */
    DICOMAccessionNumber?: DICOMAccessionNumber;
    /**
     * The DICOM study ID for search.
     */
    DICOMStudyId?: DICOMStudyId;
    /**
     * The DICOM study instance UID for search.
     */
    DICOMStudyInstanceUID?: DICOMStudyInstanceUID;
    /**
     * The created at time of the image set provided for search.
     */
    createdAt?: _Date;
    /**
     * The aggregated structure containing DICOM study date and study time for search.
     */
    DICOMStudyDateAndTime?: DICOMStudyDateAndTime;
  }
  export interface SearchCriteria {
    /**
     * The filters for the search criteria.
     */
    filters?: SearchCriteriaFiltersList;
  }
  export type SearchCriteriaFiltersList = SearchFilter[];
  export interface SearchFilter {
    /**
     * The search filter values.
     */
    values: SearchFilterValuesList;
    /**
     * The search filter operator for imageSetDateTime.
     */
    operator: Operator;
  }
  export type SearchFilterValuesList = SearchByAttributeValue[];
  export interface SearchImageSetsRequest {
    /**
     * The identifier of the data store where the image sets reside.
     */
    datastoreId: DatastoreId;
    /**
     * The search criteria that filters by applying a maximum of 1 item to SearchByAttribute.
     */
    searchCriteria?: SearchCriteria;
    /**
     * The maximum number of results that can be returned in a search.
     */
    maxResults?: SearchImageSetsRequestMaxResultsInteger;
    /**
     * The token used for pagination of results returned in the response. Use the token returned from the previous request to continue results where the previous request ended.
     */
    nextToken?: NextToken;
  }
  export type SearchImageSetsRequestMaxResultsInteger = number;
  export interface SearchImageSetsResponse {
    /**
     * The model containing the image set results.
     */
    imageSetsMetadataSummaries: ImageSetsMetadataSummaries;
    /**
     * The token for pagination results.
     */
    nextToken?: NextToken;
  }
  export interface StartDICOMImportJobRequest {
    /**
     * The import job name.
     */
    jobName?: JobName;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants permission to access medical imaging resources.
     */
    dataAccessRoleArn: RoleArn;
    /**
     * A unique identifier for API idempotency.
     */
    clientToken: ClientToken;
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The input prefix path for the S3 bucket that contains the DICOM files to be imported.
     */
    inputS3Uri: S3Uri;
    /**
     * The output prefix of the S3 bucket to upload the results of the DICOM import job.
     */
    outputS3Uri: S3Uri;
  }
  export interface StartDICOMImportJobResponse {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The import job identifier.
     */
    jobId: JobId;
    /**
     * The import job status.
     */
    jobStatus: JobStatus;
    /**
     * The timestamp when the import job was submitted.
     */
    submittedAt: _Date;
  }
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the medical imaging resource that tags are being added to.
     */
    resourceArn: Arn;
    /**
     * The user-specified key and value tag pairs added to a medical imaging resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the medical imaging resource that tags are being removed from.
     */
    resourceArn: Arn;
    /**
     * The keys for the tags to be removed from the medical imaging resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateImageSetMetadataRequest {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The image set identifier.
     */
    imageSetId: ImageSetId;
    /**
     * The latest image set version identifier.
     */
    latestVersionId: ImageSetExternalVersionId;
    /**
     * Update image set metadata updates.
     */
    updateImageSetMetadataUpdates: MetadataUpdates;
  }
  export interface UpdateImageSetMetadataResponse {
    /**
     * The data store identifier.
     */
    datastoreId: DatastoreId;
    /**
     * The image set identifier.
     */
    imageSetId: ImageSetId;
    /**
     * The latest image set version identifier.
     */
    latestVersionId: ImageSetExternalVersionId;
    /**
     * The image set state.
     */
    imageSetState: ImageSetState;
    /**
     * The image set workflow status.
     */
    imageSetWorkflowStatus?: ImageSetWorkflowStatus;
    /**
     * The timestamp when image set metadata was created.
     */
    createdAt?: _Date;
    /**
     * The timestamp when image set metadata was updated.
     */
    updatedAt?: _Date;
    /**
     * The error message thrown if an update image set metadata action fails.
     */
    message?: Message;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2023-07-19"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MedicalImaging client.
   */
  export import Types = MedicalImaging;
}
export = MedicalImaging;
