import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class Omics extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Omics.Types.ClientConfiguration)
  config: Config & Omics.Types.ClientConfiguration;
  /**
   *  Stops a multipart upload. 
   */
  abortMultipartReadSetUpload(params: Omics.Types.AbortMultipartReadSetUploadRequest, callback?: (err: AWSError, data: Omics.Types.AbortMultipartReadSetUploadResponse) => void): Request<Omics.Types.AbortMultipartReadSetUploadResponse, AWSError>;
  /**
   *  Stops a multipart upload. 
   */
  abortMultipartReadSetUpload(callback?: (err: AWSError, data: Omics.Types.AbortMultipartReadSetUploadResponse) => void): Request<Omics.Types.AbortMultipartReadSetUploadResponse, AWSError>;
  /**
   *  Accepts a share for an analytics store. 
   */
  acceptShare(params: Omics.Types.AcceptShareRequest, callback?: (err: AWSError, data: Omics.Types.AcceptShareResponse) => void): Request<Omics.Types.AcceptShareResponse, AWSError>;
  /**
   *  Accepts a share for an analytics store. 
   */
  acceptShare(callback?: (err: AWSError, data: Omics.Types.AcceptShareResponse) => void): Request<Omics.Types.AcceptShareResponse, AWSError>;
  /**
   * Deletes one or more read sets.
   */
  batchDeleteReadSet(params: Omics.Types.BatchDeleteReadSetRequest, callback?: (err: AWSError, data: Omics.Types.BatchDeleteReadSetResponse) => void): Request<Omics.Types.BatchDeleteReadSetResponse, AWSError>;
  /**
   * Deletes one or more read sets.
   */
  batchDeleteReadSet(callback?: (err: AWSError, data: Omics.Types.BatchDeleteReadSetResponse) => void): Request<Omics.Types.BatchDeleteReadSetResponse, AWSError>;
  /**
   * Cancels an annotation import job.
   */
  cancelAnnotationImportJob(params: Omics.Types.CancelAnnotationImportRequest, callback?: (err: AWSError, data: Omics.Types.CancelAnnotationImportResponse) => void): Request<Omics.Types.CancelAnnotationImportResponse, AWSError>;
  /**
   * Cancels an annotation import job.
   */
  cancelAnnotationImportJob(callback?: (err: AWSError, data: Omics.Types.CancelAnnotationImportResponse) => void): Request<Omics.Types.CancelAnnotationImportResponse, AWSError>;
  /**
   * Cancels a run.
   */
  cancelRun(params: Omics.Types.CancelRunRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Cancels a run.
   */
  cancelRun(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Cancels a variant import job.
   */
  cancelVariantImportJob(params: Omics.Types.CancelVariantImportRequest, callback?: (err: AWSError, data: Omics.Types.CancelVariantImportResponse) => void): Request<Omics.Types.CancelVariantImportResponse, AWSError>;
  /**
   * Cancels a variant import job.
   */
  cancelVariantImportJob(callback?: (err: AWSError, data: Omics.Types.CancelVariantImportResponse) => void): Request<Omics.Types.CancelVariantImportResponse, AWSError>;
  /**
   *  Concludes a multipart upload once you have uploaded all the components. 
   */
  completeMultipartReadSetUpload(params: Omics.Types.CompleteMultipartReadSetUploadRequest, callback?: (err: AWSError, data: Omics.Types.CompleteMultipartReadSetUploadResponse) => void): Request<Omics.Types.CompleteMultipartReadSetUploadResponse, AWSError>;
  /**
   *  Concludes a multipart upload once you have uploaded all the components. 
   */
  completeMultipartReadSetUpload(callback?: (err: AWSError, data: Omics.Types.CompleteMultipartReadSetUploadResponse) => void): Request<Omics.Types.CompleteMultipartReadSetUploadResponse, AWSError>;
  /**
   * Creates an annotation store.
   */
  createAnnotationStore(params: Omics.Types.CreateAnnotationStoreRequest, callback?: (err: AWSError, data: Omics.Types.CreateAnnotationStoreResponse) => void): Request<Omics.Types.CreateAnnotationStoreResponse, AWSError>;
  /**
   * Creates an annotation store.
   */
  createAnnotationStore(callback?: (err: AWSError, data: Omics.Types.CreateAnnotationStoreResponse) => void): Request<Omics.Types.CreateAnnotationStoreResponse, AWSError>;
  /**
   *  Creates a new version of an annotation store. 
   */
  createAnnotationStoreVersion(params: Omics.Types.CreateAnnotationStoreVersionRequest, callback?: (err: AWSError, data: Omics.Types.CreateAnnotationStoreVersionResponse) => void): Request<Omics.Types.CreateAnnotationStoreVersionResponse, AWSError>;
  /**
   *  Creates a new version of an annotation store. 
   */
  createAnnotationStoreVersion(callback?: (err: AWSError, data: Omics.Types.CreateAnnotationStoreVersionResponse) => void): Request<Omics.Types.CreateAnnotationStoreVersionResponse, AWSError>;
  /**
   *  Begins a multipart read set upload. 
   */
  createMultipartReadSetUpload(params: Omics.Types.CreateMultipartReadSetUploadRequest, callback?: (err: AWSError, data: Omics.Types.CreateMultipartReadSetUploadResponse) => void): Request<Omics.Types.CreateMultipartReadSetUploadResponse, AWSError>;
  /**
   *  Begins a multipart read set upload. 
   */
  createMultipartReadSetUpload(callback?: (err: AWSError, data: Omics.Types.CreateMultipartReadSetUploadResponse) => void): Request<Omics.Types.CreateMultipartReadSetUploadResponse, AWSError>;
  /**
   * Creates a reference store.
   */
  createReferenceStore(params: Omics.Types.CreateReferenceStoreRequest, callback?: (err: AWSError, data: Omics.Types.CreateReferenceStoreResponse) => void): Request<Omics.Types.CreateReferenceStoreResponse, AWSError>;
  /**
   * Creates a reference store.
   */
  createReferenceStore(callback?: (err: AWSError, data: Omics.Types.CreateReferenceStoreResponse) => void): Request<Omics.Types.CreateReferenceStoreResponse, AWSError>;
  /**
   * Creates a run group.
   */
  createRunGroup(params: Omics.Types.CreateRunGroupRequest, callback?: (err: AWSError, data: Omics.Types.CreateRunGroupResponse) => void): Request<Omics.Types.CreateRunGroupResponse, AWSError>;
  /**
   * Creates a run group.
   */
  createRunGroup(callback?: (err: AWSError, data: Omics.Types.CreateRunGroupResponse) => void): Request<Omics.Types.CreateRunGroupResponse, AWSError>;
  /**
   * Creates a sequence store.
   */
  createSequenceStore(params: Omics.Types.CreateSequenceStoreRequest, callback?: (err: AWSError, data: Omics.Types.CreateSequenceStoreResponse) => void): Request<Omics.Types.CreateSequenceStoreResponse, AWSError>;
  /**
   * Creates a sequence store.
   */
  createSequenceStore(callback?: (err: AWSError, data: Omics.Types.CreateSequenceStoreResponse) => void): Request<Omics.Types.CreateSequenceStoreResponse, AWSError>;
  /**
   *  Creates a share offer that can be accepted outside the account by a subscriber. The share is created by the owner and accepted by the principal subscriber. 
   */
  createShare(params: Omics.Types.CreateShareRequest, callback?: (err: AWSError, data: Omics.Types.CreateShareResponse) => void): Request<Omics.Types.CreateShareResponse, AWSError>;
  /**
   *  Creates a share offer that can be accepted outside the account by a subscriber. The share is created by the owner and accepted by the principal subscriber. 
   */
  createShare(callback?: (err: AWSError, data: Omics.Types.CreateShareResponse) => void): Request<Omics.Types.CreateShareResponse, AWSError>;
  /**
   * Creates a variant store.
   */
  createVariantStore(params: Omics.Types.CreateVariantStoreRequest, callback?: (err: AWSError, data: Omics.Types.CreateVariantStoreResponse) => void): Request<Omics.Types.CreateVariantStoreResponse, AWSError>;
  /**
   * Creates a variant store.
   */
  createVariantStore(callback?: (err: AWSError, data: Omics.Types.CreateVariantStoreResponse) => void): Request<Omics.Types.CreateVariantStoreResponse, AWSError>;
  /**
   * Creates a workflow.
   */
  createWorkflow(params: Omics.Types.CreateWorkflowRequest, callback?: (err: AWSError, data: Omics.Types.CreateWorkflowResponse) => void): Request<Omics.Types.CreateWorkflowResponse, AWSError>;
  /**
   * Creates a workflow.
   */
  createWorkflow(callback?: (err: AWSError, data: Omics.Types.CreateWorkflowResponse) => void): Request<Omics.Types.CreateWorkflowResponse, AWSError>;
  /**
   * Deletes an annotation store.
   */
  deleteAnnotationStore(params: Omics.Types.DeleteAnnotationStoreRequest, callback?: (err: AWSError, data: Omics.Types.DeleteAnnotationStoreResponse) => void): Request<Omics.Types.DeleteAnnotationStoreResponse, AWSError>;
  /**
   * Deletes an annotation store.
   */
  deleteAnnotationStore(callback?: (err: AWSError, data: Omics.Types.DeleteAnnotationStoreResponse) => void): Request<Omics.Types.DeleteAnnotationStoreResponse, AWSError>;
  /**
   *  Deletes one or multiple versions of an annotation store. 
   */
  deleteAnnotationStoreVersions(params: Omics.Types.DeleteAnnotationStoreVersionsRequest, callback?: (err: AWSError, data: Omics.Types.DeleteAnnotationStoreVersionsResponse) => void): Request<Omics.Types.DeleteAnnotationStoreVersionsResponse, AWSError>;
  /**
   *  Deletes one or multiple versions of an annotation store. 
   */
  deleteAnnotationStoreVersions(callback?: (err: AWSError, data: Omics.Types.DeleteAnnotationStoreVersionsResponse) => void): Request<Omics.Types.DeleteAnnotationStoreVersionsResponse, AWSError>;
  /**
   * Deletes a genome reference.
   */
  deleteReference(params: Omics.Types.DeleteReferenceRequest, callback?: (err: AWSError, data: Omics.Types.DeleteReferenceResponse) => void): Request<Omics.Types.DeleteReferenceResponse, AWSError>;
  /**
   * Deletes a genome reference.
   */
  deleteReference(callback?: (err: AWSError, data: Omics.Types.DeleteReferenceResponse) => void): Request<Omics.Types.DeleteReferenceResponse, AWSError>;
  /**
   * Deletes a genome reference store.
   */
  deleteReferenceStore(params: Omics.Types.DeleteReferenceStoreRequest, callback?: (err: AWSError, data: Omics.Types.DeleteReferenceStoreResponse) => void): Request<Omics.Types.DeleteReferenceStoreResponse, AWSError>;
  /**
   * Deletes a genome reference store.
   */
  deleteReferenceStore(callback?: (err: AWSError, data: Omics.Types.DeleteReferenceStoreResponse) => void): Request<Omics.Types.DeleteReferenceStoreResponse, AWSError>;
  /**
   * Deletes a workflow run.
   */
  deleteRun(params: Omics.Types.DeleteRunRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a workflow run.
   */
  deleteRun(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a workflow run group.
   */
  deleteRunGroup(params: Omics.Types.DeleteRunGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a workflow run group.
   */
  deleteRunGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a sequence store.
   */
  deleteSequenceStore(params: Omics.Types.DeleteSequenceStoreRequest, callback?: (err: AWSError, data: Omics.Types.DeleteSequenceStoreResponse) => void): Request<Omics.Types.DeleteSequenceStoreResponse, AWSError>;
  /**
   * Deletes a sequence store.
   */
  deleteSequenceStore(callback?: (err: AWSError, data: Omics.Types.DeleteSequenceStoreResponse) => void): Request<Omics.Types.DeleteSequenceStoreResponse, AWSError>;
  /**
   *  Deletes a share of an analytics store. 
   */
  deleteShare(params: Omics.Types.DeleteShareRequest, callback?: (err: AWSError, data: Omics.Types.DeleteShareResponse) => void): Request<Omics.Types.DeleteShareResponse, AWSError>;
  /**
   *  Deletes a share of an analytics store. 
   */
  deleteShare(callback?: (err: AWSError, data: Omics.Types.DeleteShareResponse) => void): Request<Omics.Types.DeleteShareResponse, AWSError>;
  /**
   * Deletes a variant store.
   */
  deleteVariantStore(params: Omics.Types.DeleteVariantStoreRequest, callback?: (err: AWSError, data: Omics.Types.DeleteVariantStoreResponse) => void): Request<Omics.Types.DeleteVariantStoreResponse, AWSError>;
  /**
   * Deletes a variant store.
   */
  deleteVariantStore(callback?: (err: AWSError, data: Omics.Types.DeleteVariantStoreResponse) => void): Request<Omics.Types.DeleteVariantStoreResponse, AWSError>;
  /**
   * Deletes a workflow.
   */
  deleteWorkflow(params: Omics.Types.DeleteWorkflowRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a workflow.
   */
  deleteWorkflow(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets information about an annotation import job.
   */
  getAnnotationImportJob(params: Omics.Types.GetAnnotationImportRequest, callback?: (err: AWSError, data: Omics.Types.GetAnnotationImportResponse) => void): Request<Omics.Types.GetAnnotationImportResponse, AWSError>;
  /**
   * Gets information about an annotation import job.
   */
  getAnnotationImportJob(callback?: (err: AWSError, data: Omics.Types.GetAnnotationImportResponse) => void): Request<Omics.Types.GetAnnotationImportResponse, AWSError>;
  /**
   * Gets information about an annotation store.
   */
  getAnnotationStore(params: Omics.Types.GetAnnotationStoreRequest, callback?: (err: AWSError, data: Omics.Types.GetAnnotationStoreResponse) => void): Request<Omics.Types.GetAnnotationStoreResponse, AWSError>;
  /**
   * Gets information about an annotation store.
   */
  getAnnotationStore(callback?: (err: AWSError, data: Omics.Types.GetAnnotationStoreResponse) => void): Request<Omics.Types.GetAnnotationStoreResponse, AWSError>;
  /**
   *  Retrieves the metadata for an annotation store version. 
   */
  getAnnotationStoreVersion(params: Omics.Types.GetAnnotationStoreVersionRequest, callback?: (err: AWSError, data: Omics.Types.GetAnnotationStoreVersionResponse) => void): Request<Omics.Types.GetAnnotationStoreVersionResponse, AWSError>;
  /**
   *  Retrieves the metadata for an annotation store version. 
   */
  getAnnotationStoreVersion(callback?: (err: AWSError, data: Omics.Types.GetAnnotationStoreVersionResponse) => void): Request<Omics.Types.GetAnnotationStoreVersionResponse, AWSError>;
  /**
   * Gets a file from a read set.
   */
  getReadSet(params: Omics.Types.GetReadSetRequest, callback?: (err: AWSError, data: Omics.Types.GetReadSetResponse) => void): Request<Omics.Types.GetReadSetResponse, AWSError>;
  /**
   * Gets a file from a read set.
   */
  getReadSet(callback?: (err: AWSError, data: Omics.Types.GetReadSetResponse) => void): Request<Omics.Types.GetReadSetResponse, AWSError>;
  /**
   * Gets information about a read set activation job.
   */
  getReadSetActivationJob(params: Omics.Types.GetReadSetActivationJobRequest, callback?: (err: AWSError, data: Omics.Types.GetReadSetActivationJobResponse) => void): Request<Omics.Types.GetReadSetActivationJobResponse, AWSError>;
  /**
   * Gets information about a read set activation job.
   */
  getReadSetActivationJob(callback?: (err: AWSError, data: Omics.Types.GetReadSetActivationJobResponse) => void): Request<Omics.Types.GetReadSetActivationJobResponse, AWSError>;
  /**
   * Gets information about a read set export job.
   */
  getReadSetExportJob(params: Omics.Types.GetReadSetExportJobRequest, callback?: (err: AWSError, data: Omics.Types.GetReadSetExportJobResponse) => void): Request<Omics.Types.GetReadSetExportJobResponse, AWSError>;
  /**
   * Gets information about a read set export job.
   */
  getReadSetExportJob(callback?: (err: AWSError, data: Omics.Types.GetReadSetExportJobResponse) => void): Request<Omics.Types.GetReadSetExportJobResponse, AWSError>;
  /**
   * Gets information about a read set import job.
   */
  getReadSetImportJob(params: Omics.Types.GetReadSetImportJobRequest, callback?: (err: AWSError, data: Omics.Types.GetReadSetImportJobResponse) => void): Request<Omics.Types.GetReadSetImportJobResponse, AWSError>;
  /**
   * Gets information about a read set import job.
   */
  getReadSetImportJob(callback?: (err: AWSError, data: Omics.Types.GetReadSetImportJobResponse) => void): Request<Omics.Types.GetReadSetImportJobResponse, AWSError>;
  /**
   * Gets details about a read set.
   */
  getReadSetMetadata(params: Omics.Types.GetReadSetMetadataRequest, callback?: (err: AWSError, data: Omics.Types.GetReadSetMetadataResponse) => void): Request<Omics.Types.GetReadSetMetadataResponse, AWSError>;
  /**
   * Gets details about a read set.
   */
  getReadSetMetadata(callback?: (err: AWSError, data: Omics.Types.GetReadSetMetadataResponse) => void): Request<Omics.Types.GetReadSetMetadataResponse, AWSError>;
  /**
   * Gets a reference file.
   */
  getReference(params: Omics.Types.GetReferenceRequest, callback?: (err: AWSError, data: Omics.Types.GetReferenceResponse) => void): Request<Omics.Types.GetReferenceResponse, AWSError>;
  /**
   * Gets a reference file.
   */
  getReference(callback?: (err: AWSError, data: Omics.Types.GetReferenceResponse) => void): Request<Omics.Types.GetReferenceResponse, AWSError>;
  /**
   * Gets information about a reference import job.
   */
  getReferenceImportJob(params: Omics.Types.GetReferenceImportJobRequest, callback?: (err: AWSError, data: Omics.Types.GetReferenceImportJobResponse) => void): Request<Omics.Types.GetReferenceImportJobResponse, AWSError>;
  /**
   * Gets information about a reference import job.
   */
  getReferenceImportJob(callback?: (err: AWSError, data: Omics.Types.GetReferenceImportJobResponse) => void): Request<Omics.Types.GetReferenceImportJobResponse, AWSError>;
  /**
   * Gets information about a genome reference's metadata.
   */
  getReferenceMetadata(params: Omics.Types.GetReferenceMetadataRequest, callback?: (err: AWSError, data: Omics.Types.GetReferenceMetadataResponse) => void): Request<Omics.Types.GetReferenceMetadataResponse, AWSError>;
  /**
   * Gets information about a genome reference's metadata.
   */
  getReferenceMetadata(callback?: (err: AWSError, data: Omics.Types.GetReferenceMetadataResponse) => void): Request<Omics.Types.GetReferenceMetadataResponse, AWSError>;
  /**
   * Gets information about a reference store.
   */
  getReferenceStore(params: Omics.Types.GetReferenceStoreRequest, callback?: (err: AWSError, data: Omics.Types.GetReferenceStoreResponse) => void): Request<Omics.Types.GetReferenceStoreResponse, AWSError>;
  /**
   * Gets information about a reference store.
   */
  getReferenceStore(callback?: (err: AWSError, data: Omics.Types.GetReferenceStoreResponse) => void): Request<Omics.Types.GetReferenceStoreResponse, AWSError>;
  /**
   * Gets information about a workflow run.
   */
  getRun(params: Omics.Types.GetRunRequest, callback?: (err: AWSError, data: Omics.Types.GetRunResponse) => void): Request<Omics.Types.GetRunResponse, AWSError>;
  /**
   * Gets information about a workflow run.
   */
  getRun(callback?: (err: AWSError, data: Omics.Types.GetRunResponse) => void): Request<Omics.Types.GetRunResponse, AWSError>;
  /**
   * Gets information about a workflow run group.
   */
  getRunGroup(params: Omics.Types.GetRunGroupRequest, callback?: (err: AWSError, data: Omics.Types.GetRunGroupResponse) => void): Request<Omics.Types.GetRunGroupResponse, AWSError>;
  /**
   * Gets information about a workflow run group.
   */
  getRunGroup(callback?: (err: AWSError, data: Omics.Types.GetRunGroupResponse) => void): Request<Omics.Types.GetRunGroupResponse, AWSError>;
  /**
   * Gets information about a workflow run task.
   */
  getRunTask(params: Omics.Types.GetRunTaskRequest, callback?: (err: AWSError, data: Omics.Types.GetRunTaskResponse) => void): Request<Omics.Types.GetRunTaskResponse, AWSError>;
  /**
   * Gets information about a workflow run task.
   */
  getRunTask(callback?: (err: AWSError, data: Omics.Types.GetRunTaskResponse) => void): Request<Omics.Types.GetRunTaskResponse, AWSError>;
  /**
   * Gets information about a sequence store.
   */
  getSequenceStore(params: Omics.Types.GetSequenceStoreRequest, callback?: (err: AWSError, data: Omics.Types.GetSequenceStoreResponse) => void): Request<Omics.Types.GetSequenceStoreResponse, AWSError>;
  /**
   * Gets information about a sequence store.
   */
  getSequenceStore(callback?: (err: AWSError, data: Omics.Types.GetSequenceStoreResponse) => void): Request<Omics.Types.GetSequenceStoreResponse, AWSError>;
  /**
   *  Retrieves the metadata for a share. 
   */
  getShare(params: Omics.Types.GetShareRequest, callback?: (err: AWSError, data: Omics.Types.GetShareResponse) => void): Request<Omics.Types.GetShareResponse, AWSError>;
  /**
   *  Retrieves the metadata for a share. 
   */
  getShare(callback?: (err: AWSError, data: Omics.Types.GetShareResponse) => void): Request<Omics.Types.GetShareResponse, AWSError>;
  /**
   * Gets information about a variant import job.
   */
  getVariantImportJob(params: Omics.Types.GetVariantImportRequest, callback?: (err: AWSError, data: Omics.Types.GetVariantImportResponse) => void): Request<Omics.Types.GetVariantImportResponse, AWSError>;
  /**
   * Gets information about a variant import job.
   */
  getVariantImportJob(callback?: (err: AWSError, data: Omics.Types.GetVariantImportResponse) => void): Request<Omics.Types.GetVariantImportResponse, AWSError>;
  /**
   * Gets information about a variant store.
   */
  getVariantStore(params: Omics.Types.GetVariantStoreRequest, callback?: (err: AWSError, data: Omics.Types.GetVariantStoreResponse) => void): Request<Omics.Types.GetVariantStoreResponse, AWSError>;
  /**
   * Gets information about a variant store.
   */
  getVariantStore(callback?: (err: AWSError, data: Omics.Types.GetVariantStoreResponse) => void): Request<Omics.Types.GetVariantStoreResponse, AWSError>;
  /**
   * Gets information about a workflow.
   */
  getWorkflow(params: Omics.Types.GetWorkflowRequest, callback?: (err: AWSError, data: Omics.Types.GetWorkflowResponse) => void): Request<Omics.Types.GetWorkflowResponse, AWSError>;
  /**
   * Gets information about a workflow.
   */
  getWorkflow(callback?: (err: AWSError, data: Omics.Types.GetWorkflowResponse) => void): Request<Omics.Types.GetWorkflowResponse, AWSError>;
  /**
   * Retrieves a list of annotation import jobs.
   */
  listAnnotationImportJobs(params: Omics.Types.ListAnnotationImportJobsRequest, callback?: (err: AWSError, data: Omics.Types.ListAnnotationImportJobsResponse) => void): Request<Omics.Types.ListAnnotationImportJobsResponse, AWSError>;
  /**
   * Retrieves a list of annotation import jobs.
   */
  listAnnotationImportJobs(callback?: (err: AWSError, data: Omics.Types.ListAnnotationImportJobsResponse) => void): Request<Omics.Types.ListAnnotationImportJobsResponse, AWSError>;
  /**
   *  Lists the versions of an annotation store. 
   */
  listAnnotationStoreVersions(params: Omics.Types.ListAnnotationStoreVersionsRequest, callback?: (err: AWSError, data: Omics.Types.ListAnnotationStoreVersionsResponse) => void): Request<Omics.Types.ListAnnotationStoreVersionsResponse, AWSError>;
  /**
   *  Lists the versions of an annotation store. 
   */
  listAnnotationStoreVersions(callback?: (err: AWSError, data: Omics.Types.ListAnnotationStoreVersionsResponse) => void): Request<Omics.Types.ListAnnotationStoreVersionsResponse, AWSError>;
  /**
   * Retrieves a list of annotation stores.
   */
  listAnnotationStores(params: Omics.Types.ListAnnotationStoresRequest, callback?: (err: AWSError, data: Omics.Types.ListAnnotationStoresResponse) => void): Request<Omics.Types.ListAnnotationStoresResponse, AWSError>;
  /**
   * Retrieves a list of annotation stores.
   */
  listAnnotationStores(callback?: (err: AWSError, data: Omics.Types.ListAnnotationStoresResponse) => void): Request<Omics.Types.ListAnnotationStoresResponse, AWSError>;
  /**
   *  Lists all multipart read set uploads and their statuses. 
   */
  listMultipartReadSetUploads(params: Omics.Types.ListMultipartReadSetUploadsRequest, callback?: (err: AWSError, data: Omics.Types.ListMultipartReadSetUploadsResponse) => void): Request<Omics.Types.ListMultipartReadSetUploadsResponse, AWSError>;
  /**
   *  Lists all multipart read set uploads and their statuses. 
   */
  listMultipartReadSetUploads(callback?: (err: AWSError, data: Omics.Types.ListMultipartReadSetUploadsResponse) => void): Request<Omics.Types.ListMultipartReadSetUploadsResponse, AWSError>;
  /**
   * Retrieves a list of read set activation jobs.
   */
  listReadSetActivationJobs(params: Omics.Types.ListReadSetActivationJobsRequest, callback?: (err: AWSError, data: Omics.Types.ListReadSetActivationJobsResponse) => void): Request<Omics.Types.ListReadSetActivationJobsResponse, AWSError>;
  /**
   * Retrieves a list of read set activation jobs.
   */
  listReadSetActivationJobs(callback?: (err: AWSError, data: Omics.Types.ListReadSetActivationJobsResponse) => void): Request<Omics.Types.ListReadSetActivationJobsResponse, AWSError>;
  /**
   * Retrieves a list of read set export jobs.
   */
  listReadSetExportJobs(params: Omics.Types.ListReadSetExportJobsRequest, callback?: (err: AWSError, data: Omics.Types.ListReadSetExportJobsResponse) => void): Request<Omics.Types.ListReadSetExportJobsResponse, AWSError>;
  /**
   * Retrieves a list of read set export jobs.
   */
  listReadSetExportJobs(callback?: (err: AWSError, data: Omics.Types.ListReadSetExportJobsResponse) => void): Request<Omics.Types.ListReadSetExportJobsResponse, AWSError>;
  /**
   * Retrieves a list of read set import jobs.
   */
  listReadSetImportJobs(params: Omics.Types.ListReadSetImportJobsRequest, callback?: (err: AWSError, data: Omics.Types.ListReadSetImportJobsResponse) => void): Request<Omics.Types.ListReadSetImportJobsResponse, AWSError>;
  /**
   * Retrieves a list of read set import jobs.
   */
  listReadSetImportJobs(callback?: (err: AWSError, data: Omics.Types.ListReadSetImportJobsResponse) => void): Request<Omics.Types.ListReadSetImportJobsResponse, AWSError>;
  /**
   *  This operation will list all parts in a requested multipart upload for a sequence store. 
   */
  listReadSetUploadParts(params: Omics.Types.ListReadSetUploadPartsRequest, callback?: (err: AWSError, data: Omics.Types.ListReadSetUploadPartsResponse) => void): Request<Omics.Types.ListReadSetUploadPartsResponse, AWSError>;
  /**
   *  This operation will list all parts in a requested multipart upload for a sequence store. 
   */
  listReadSetUploadParts(callback?: (err: AWSError, data: Omics.Types.ListReadSetUploadPartsResponse) => void): Request<Omics.Types.ListReadSetUploadPartsResponse, AWSError>;
  /**
   * Retrieves a list of read sets.
   */
  listReadSets(params: Omics.Types.ListReadSetsRequest, callback?: (err: AWSError, data: Omics.Types.ListReadSetsResponse) => void): Request<Omics.Types.ListReadSetsResponse, AWSError>;
  /**
   * Retrieves a list of read sets.
   */
  listReadSets(callback?: (err: AWSError, data: Omics.Types.ListReadSetsResponse) => void): Request<Omics.Types.ListReadSetsResponse, AWSError>;
  /**
   * Retrieves a list of reference import jobs.
   */
  listReferenceImportJobs(params: Omics.Types.ListReferenceImportJobsRequest, callback?: (err: AWSError, data: Omics.Types.ListReferenceImportJobsResponse) => void): Request<Omics.Types.ListReferenceImportJobsResponse, AWSError>;
  /**
   * Retrieves a list of reference import jobs.
   */
  listReferenceImportJobs(callback?: (err: AWSError, data: Omics.Types.ListReferenceImportJobsResponse) => void): Request<Omics.Types.ListReferenceImportJobsResponse, AWSError>;
  /**
   * Retrieves a list of reference stores.
   */
  listReferenceStores(params: Omics.Types.ListReferenceStoresRequest, callback?: (err: AWSError, data: Omics.Types.ListReferenceStoresResponse) => void): Request<Omics.Types.ListReferenceStoresResponse, AWSError>;
  /**
   * Retrieves a list of reference stores.
   */
  listReferenceStores(callback?: (err: AWSError, data: Omics.Types.ListReferenceStoresResponse) => void): Request<Omics.Types.ListReferenceStoresResponse, AWSError>;
  /**
   * Retrieves a list of references.
   */
  listReferences(params: Omics.Types.ListReferencesRequest, callback?: (err: AWSError, data: Omics.Types.ListReferencesResponse) => void): Request<Omics.Types.ListReferencesResponse, AWSError>;
  /**
   * Retrieves a list of references.
   */
  listReferences(callback?: (err: AWSError, data: Omics.Types.ListReferencesResponse) => void): Request<Omics.Types.ListReferencesResponse, AWSError>;
  /**
   * Retrieves a list of run groups.
   */
  listRunGroups(params: Omics.Types.ListRunGroupsRequest, callback?: (err: AWSError, data: Omics.Types.ListRunGroupsResponse) => void): Request<Omics.Types.ListRunGroupsResponse, AWSError>;
  /**
   * Retrieves a list of run groups.
   */
  listRunGroups(callback?: (err: AWSError, data: Omics.Types.ListRunGroupsResponse) => void): Request<Omics.Types.ListRunGroupsResponse, AWSError>;
  /**
   * Retrieves a list of tasks for a run.
   */
  listRunTasks(params: Omics.Types.ListRunTasksRequest, callback?: (err: AWSError, data: Omics.Types.ListRunTasksResponse) => void): Request<Omics.Types.ListRunTasksResponse, AWSError>;
  /**
   * Retrieves a list of tasks for a run.
   */
  listRunTasks(callback?: (err: AWSError, data: Omics.Types.ListRunTasksResponse) => void): Request<Omics.Types.ListRunTasksResponse, AWSError>;
  /**
   * Retrieves a list of runs.
   */
  listRuns(params: Omics.Types.ListRunsRequest, callback?: (err: AWSError, data: Omics.Types.ListRunsResponse) => void): Request<Omics.Types.ListRunsResponse, AWSError>;
  /**
   * Retrieves a list of runs.
   */
  listRuns(callback?: (err: AWSError, data: Omics.Types.ListRunsResponse) => void): Request<Omics.Types.ListRunsResponse, AWSError>;
  /**
   * Retrieves a list of sequence stores.
   */
  listSequenceStores(params: Omics.Types.ListSequenceStoresRequest, callback?: (err: AWSError, data: Omics.Types.ListSequenceStoresResponse) => void): Request<Omics.Types.ListSequenceStoresResponse, AWSError>;
  /**
   * Retrieves a list of sequence stores.
   */
  listSequenceStores(callback?: (err: AWSError, data: Omics.Types.ListSequenceStoresResponse) => void): Request<Omics.Types.ListSequenceStoresResponse, AWSError>;
  /**
   *  Lists all shares associated with an account. 
   */
  listShares(params: Omics.Types.ListSharesRequest, callback?: (err: AWSError, data: Omics.Types.ListSharesResponse) => void): Request<Omics.Types.ListSharesResponse, AWSError>;
  /**
   *  Lists all shares associated with an account. 
   */
  listShares(callback?: (err: AWSError, data: Omics.Types.ListSharesResponse) => void): Request<Omics.Types.ListSharesResponse, AWSError>;
  /**
   * Retrieves a list of tags for a resource.
   */
  listTagsForResource(params: Omics.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Omics.Types.ListTagsForResourceResponse) => void): Request<Omics.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves a list of tags for a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Omics.Types.ListTagsForResourceResponse) => void): Request<Omics.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves a list of variant import jobs.
   */
  listVariantImportJobs(params: Omics.Types.ListVariantImportJobsRequest, callback?: (err: AWSError, data: Omics.Types.ListVariantImportJobsResponse) => void): Request<Omics.Types.ListVariantImportJobsResponse, AWSError>;
  /**
   * Retrieves a list of variant import jobs.
   */
  listVariantImportJobs(callback?: (err: AWSError, data: Omics.Types.ListVariantImportJobsResponse) => void): Request<Omics.Types.ListVariantImportJobsResponse, AWSError>;
  /**
   * Retrieves a list of variant stores.
   */
  listVariantStores(params: Omics.Types.ListVariantStoresRequest, callback?: (err: AWSError, data: Omics.Types.ListVariantStoresResponse) => void): Request<Omics.Types.ListVariantStoresResponse, AWSError>;
  /**
   * Retrieves a list of variant stores.
   */
  listVariantStores(callback?: (err: AWSError, data: Omics.Types.ListVariantStoresResponse) => void): Request<Omics.Types.ListVariantStoresResponse, AWSError>;
  /**
   * Retrieves a list of workflows.
   */
  listWorkflows(params: Omics.Types.ListWorkflowsRequest, callback?: (err: AWSError, data: Omics.Types.ListWorkflowsResponse) => void): Request<Omics.Types.ListWorkflowsResponse, AWSError>;
  /**
   * Retrieves a list of workflows.
   */
  listWorkflows(callback?: (err: AWSError, data: Omics.Types.ListWorkflowsResponse) => void): Request<Omics.Types.ListWorkflowsResponse, AWSError>;
  /**
   * Starts an annotation import job.
   */
  startAnnotationImportJob(params: Omics.Types.StartAnnotationImportRequest, callback?: (err: AWSError, data: Omics.Types.StartAnnotationImportResponse) => void): Request<Omics.Types.StartAnnotationImportResponse, AWSError>;
  /**
   * Starts an annotation import job.
   */
  startAnnotationImportJob(callback?: (err: AWSError, data: Omics.Types.StartAnnotationImportResponse) => void): Request<Omics.Types.StartAnnotationImportResponse, AWSError>;
  /**
   * Activates an archived read set. To reduce storage charges, Amazon Omics archives unused read sets after 30 days.
   */
  startReadSetActivationJob(params: Omics.Types.StartReadSetActivationJobRequest, callback?: (err: AWSError, data: Omics.Types.StartReadSetActivationJobResponse) => void): Request<Omics.Types.StartReadSetActivationJobResponse, AWSError>;
  /**
   * Activates an archived read set. To reduce storage charges, Amazon Omics archives unused read sets after 30 days.
   */
  startReadSetActivationJob(callback?: (err: AWSError, data: Omics.Types.StartReadSetActivationJobResponse) => void): Request<Omics.Types.StartReadSetActivationJobResponse, AWSError>;
  /**
   * Exports a read set to Amazon S3.
   */
  startReadSetExportJob(params: Omics.Types.StartReadSetExportJobRequest, callback?: (err: AWSError, data: Omics.Types.StartReadSetExportJobResponse) => void): Request<Omics.Types.StartReadSetExportJobResponse, AWSError>;
  /**
   * Exports a read set to Amazon S3.
   */
  startReadSetExportJob(callback?: (err: AWSError, data: Omics.Types.StartReadSetExportJobResponse) => void): Request<Omics.Types.StartReadSetExportJobResponse, AWSError>;
  /**
   * Starts a read set import job.
   */
  startReadSetImportJob(params: Omics.Types.StartReadSetImportJobRequest, callback?: (err: AWSError, data: Omics.Types.StartReadSetImportJobResponse) => void): Request<Omics.Types.StartReadSetImportJobResponse, AWSError>;
  /**
   * Starts a read set import job.
   */
  startReadSetImportJob(callback?: (err: AWSError, data: Omics.Types.StartReadSetImportJobResponse) => void): Request<Omics.Types.StartReadSetImportJobResponse, AWSError>;
  /**
   * Starts a reference import job.
   */
  startReferenceImportJob(params: Omics.Types.StartReferenceImportJobRequest, callback?: (err: AWSError, data: Omics.Types.StartReferenceImportJobResponse) => void): Request<Omics.Types.StartReferenceImportJobResponse, AWSError>;
  /**
   * Starts a reference import job.
   */
  startReferenceImportJob(callback?: (err: AWSError, data: Omics.Types.StartReferenceImportJobResponse) => void): Request<Omics.Types.StartReferenceImportJobResponse, AWSError>;
  /**
   * Starts a workflow run. To duplicate a run, specify the run's ID and a role ARN. The remaining parameters are copied from the previous run. The total number of runs in your account is subject to a quota per Region. To avoid needing to delete runs manually, you can set the retention mode to REMOVE. Runs with this setting are deleted automatically when the run quoata is exceeded.
   */
  startRun(params: Omics.Types.StartRunRequest, callback?: (err: AWSError, data: Omics.Types.StartRunResponse) => void): Request<Omics.Types.StartRunResponse, AWSError>;
  /**
   * Starts a workflow run. To duplicate a run, specify the run's ID and a role ARN. The remaining parameters are copied from the previous run. The total number of runs in your account is subject to a quota per Region. To avoid needing to delete runs manually, you can set the retention mode to REMOVE. Runs with this setting are deleted automatically when the run quoata is exceeded.
   */
  startRun(callback?: (err: AWSError, data: Omics.Types.StartRunResponse) => void): Request<Omics.Types.StartRunResponse, AWSError>;
  /**
   * Starts a variant import job.
   */
  startVariantImportJob(params: Omics.Types.StartVariantImportRequest, callback?: (err: AWSError, data: Omics.Types.StartVariantImportResponse) => void): Request<Omics.Types.StartVariantImportResponse, AWSError>;
  /**
   * Starts a variant import job.
   */
  startVariantImportJob(callback?: (err: AWSError, data: Omics.Types.StartVariantImportResponse) => void): Request<Omics.Types.StartVariantImportResponse, AWSError>;
  /**
   * Tags a resource.
   */
  tagResource(params: Omics.Types.TagResourceRequest, callback?: (err: AWSError, data: Omics.Types.TagResourceResponse) => void): Request<Omics.Types.TagResourceResponse, AWSError>;
  /**
   * Tags a resource.
   */
  tagResource(callback?: (err: AWSError, data: Omics.Types.TagResourceResponse) => void): Request<Omics.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(params: Omics.Types.UntagResourceRequest, callback?: (err: AWSError, data: Omics.Types.UntagResourceResponse) => void): Request<Omics.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: Omics.Types.UntagResourceResponse) => void): Request<Omics.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an annotation store.
   */
  updateAnnotationStore(params: Omics.Types.UpdateAnnotationStoreRequest, callback?: (err: AWSError, data: Omics.Types.UpdateAnnotationStoreResponse) => void): Request<Omics.Types.UpdateAnnotationStoreResponse, AWSError>;
  /**
   * Updates an annotation store.
   */
  updateAnnotationStore(callback?: (err: AWSError, data: Omics.Types.UpdateAnnotationStoreResponse) => void): Request<Omics.Types.UpdateAnnotationStoreResponse, AWSError>;
  /**
   *  Updates the description of an annotation store version. 
   */
  updateAnnotationStoreVersion(params: Omics.Types.UpdateAnnotationStoreVersionRequest, callback?: (err: AWSError, data: Omics.Types.UpdateAnnotationStoreVersionResponse) => void): Request<Omics.Types.UpdateAnnotationStoreVersionResponse, AWSError>;
  /**
   *  Updates the description of an annotation store version. 
   */
  updateAnnotationStoreVersion(callback?: (err: AWSError, data: Omics.Types.UpdateAnnotationStoreVersionResponse) => void): Request<Omics.Types.UpdateAnnotationStoreVersionResponse, AWSError>;
  /**
   * Updates a run group.
   */
  updateRunGroup(params: Omics.Types.UpdateRunGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a run group.
   */
  updateRunGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a variant store.
   */
  updateVariantStore(params: Omics.Types.UpdateVariantStoreRequest, callback?: (err: AWSError, data: Omics.Types.UpdateVariantStoreResponse) => void): Request<Omics.Types.UpdateVariantStoreResponse, AWSError>;
  /**
   * Updates a variant store.
   */
  updateVariantStore(callback?: (err: AWSError, data: Omics.Types.UpdateVariantStoreResponse) => void): Request<Omics.Types.UpdateVariantStoreResponse, AWSError>;
  /**
   * Updates a workflow.
   */
  updateWorkflow(params: Omics.Types.UpdateWorkflowRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a workflow.
   */
  updateWorkflow(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This operation uploads a specific part of a read set. If you upload a new part using a previously used part number, the previously uploaded part will be overwritten. 
   */
  uploadReadSetPart(params: Omics.Types.UploadReadSetPartRequest, callback?: (err: AWSError, data: Omics.Types.UploadReadSetPartResponse) => void): Request<Omics.Types.UploadReadSetPartResponse, AWSError>;
  /**
   *  This operation uploads a specific part of a read set. If you upload a new part using a previously used part number, the previously uploaded part will be overwritten. 
   */
  uploadReadSetPart(callback?: (err: AWSError, data: Omics.Types.UploadReadSetPartResponse) => void): Request<Omics.Types.UploadReadSetPartResponse, AWSError>;
  /**
   * Waits for the annotationImportJobCreated state by periodically calling the underlying Omics.getAnnotationImportJoboperation every 30 seconds (at most 20 times). Wait until an annotation import is completed
   */
  waitFor(state: "annotationImportJobCreated", params: Omics.Types.GetAnnotationImportRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetAnnotationImportResponse) => void): Request<Omics.Types.GetAnnotationImportResponse, AWSError>;
  /**
   * Waits for the annotationImportJobCreated state by periodically calling the underlying Omics.getAnnotationImportJoboperation every 30 seconds (at most 20 times). Wait until an annotation import is completed
   */
  waitFor(state: "annotationImportJobCreated", callback?: (err: AWSError, data: Omics.Types.GetAnnotationImportResponse) => void): Request<Omics.Types.GetAnnotationImportResponse, AWSError>;
  /**
   * Waits for the annotationStoreCreated state by periodically calling the underlying Omics.getAnnotationStoreoperation every 30 seconds (at most 20 times). Wait until an annotation store is created
   */
  waitFor(state: "annotationStoreCreated", params: Omics.Types.GetAnnotationStoreRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetAnnotationStoreResponse) => void): Request<Omics.Types.GetAnnotationStoreResponse, AWSError>;
  /**
   * Waits for the annotationStoreCreated state by periodically calling the underlying Omics.getAnnotationStoreoperation every 30 seconds (at most 20 times). Wait until an annotation store is created
   */
  waitFor(state: "annotationStoreCreated", callback?: (err: AWSError, data: Omics.Types.GetAnnotationStoreResponse) => void): Request<Omics.Types.GetAnnotationStoreResponse, AWSError>;
  /**
   * Waits for the annotationStoreDeleted state by periodically calling the underlying Omics.getAnnotationStoreoperation every 30 seconds (at most 20 times). Wait until an annotation store is deleted.
   */
  waitFor(state: "annotationStoreDeleted", params: Omics.Types.GetAnnotationStoreRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetAnnotationStoreResponse) => void): Request<Omics.Types.GetAnnotationStoreResponse, AWSError>;
  /**
   * Waits for the annotationStoreDeleted state by periodically calling the underlying Omics.getAnnotationStoreoperation every 30 seconds (at most 20 times). Wait until an annotation store is deleted.
   */
  waitFor(state: "annotationStoreDeleted", callback?: (err: AWSError, data: Omics.Types.GetAnnotationStoreResponse) => void): Request<Omics.Types.GetAnnotationStoreResponse, AWSError>;
  /**
   * Waits for the annotationStoreVersionCreated state by periodically calling the underlying Omics.getAnnotationStoreVersionoperation every 30 seconds (at most 20 times). Wait until an annotation store version is created
   */
  waitFor(state: "annotationStoreVersionCreated", params: Omics.Types.GetAnnotationStoreVersionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetAnnotationStoreVersionResponse) => void): Request<Omics.Types.GetAnnotationStoreVersionResponse, AWSError>;
  /**
   * Waits for the annotationStoreVersionCreated state by periodically calling the underlying Omics.getAnnotationStoreVersionoperation every 30 seconds (at most 20 times). Wait until an annotation store version is created
   */
  waitFor(state: "annotationStoreVersionCreated", callback?: (err: AWSError, data: Omics.Types.GetAnnotationStoreVersionResponse) => void): Request<Omics.Types.GetAnnotationStoreVersionResponse, AWSError>;
  /**
   * Waits for the annotationStoreVersionDeleted state by periodically calling the underlying Omics.getAnnotationStoreVersionoperation every 30 seconds (at most 20 times). Wait until an annotation store version is deleted.
   */
  waitFor(state: "annotationStoreVersionDeleted", params: Omics.Types.GetAnnotationStoreVersionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetAnnotationStoreVersionResponse) => void): Request<Omics.Types.GetAnnotationStoreVersionResponse, AWSError>;
  /**
   * Waits for the annotationStoreVersionDeleted state by periodically calling the underlying Omics.getAnnotationStoreVersionoperation every 30 seconds (at most 20 times). Wait until an annotation store version is deleted.
   */
  waitFor(state: "annotationStoreVersionDeleted", callback?: (err: AWSError, data: Omics.Types.GetAnnotationStoreVersionResponse) => void): Request<Omics.Types.GetAnnotationStoreVersionResponse, AWSError>;
  /**
   * Waits for the readSetActivationJobCompleted state by periodically calling the underlying Omics.getReadSetActivationJoboperation every 30 seconds (at most 20 times). Wait until a job is completed.
   */
  waitFor(state: "readSetActivationJobCompleted", params: Omics.Types.GetReadSetActivationJobRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetReadSetActivationJobResponse) => void): Request<Omics.Types.GetReadSetActivationJobResponse, AWSError>;
  /**
   * Waits for the readSetActivationJobCompleted state by periodically calling the underlying Omics.getReadSetActivationJoboperation every 30 seconds (at most 20 times). Wait until a job is completed.
   */
  waitFor(state: "readSetActivationJobCompleted", callback?: (err: AWSError, data: Omics.Types.GetReadSetActivationJobResponse) => void): Request<Omics.Types.GetReadSetActivationJobResponse, AWSError>;
  /**
   * Waits for the readSetExportJobCompleted state by periodically calling the underlying Omics.getReadSetExportJoboperation every 30 seconds (at most 20 times). Wait until a job is completed.
   */
  waitFor(state: "readSetExportJobCompleted", params: Omics.Types.GetReadSetExportJobRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetReadSetExportJobResponse) => void): Request<Omics.Types.GetReadSetExportJobResponse, AWSError>;
  /**
   * Waits for the readSetExportJobCompleted state by periodically calling the underlying Omics.getReadSetExportJoboperation every 30 seconds (at most 20 times). Wait until a job is completed.
   */
  waitFor(state: "readSetExportJobCompleted", callback?: (err: AWSError, data: Omics.Types.GetReadSetExportJobResponse) => void): Request<Omics.Types.GetReadSetExportJobResponse, AWSError>;
  /**
   * Waits for the readSetImportJobCompleted state by periodically calling the underlying Omics.getReadSetImportJoboperation every 30 seconds (at most 20 times). Wait until a job is completed.
   */
  waitFor(state: "readSetImportJobCompleted", params: Omics.Types.GetReadSetImportJobRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetReadSetImportJobResponse) => void): Request<Omics.Types.GetReadSetImportJobResponse, AWSError>;
  /**
   * Waits for the readSetImportJobCompleted state by periodically calling the underlying Omics.getReadSetImportJoboperation every 30 seconds (at most 20 times). Wait until a job is completed.
   */
  waitFor(state: "readSetImportJobCompleted", callback?: (err: AWSError, data: Omics.Types.GetReadSetImportJobResponse) => void): Request<Omics.Types.GetReadSetImportJobResponse, AWSError>;
  /**
   * Waits for the referenceImportJobCompleted state by periodically calling the underlying Omics.getReferenceImportJoboperation every 30 seconds (at most 20 times). Wait until a job is completed.
   */
  waitFor(state: "referenceImportJobCompleted", params: Omics.Types.GetReferenceImportJobRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetReferenceImportJobResponse) => void): Request<Omics.Types.GetReferenceImportJobResponse, AWSError>;
  /**
   * Waits for the referenceImportJobCompleted state by periodically calling the underlying Omics.getReferenceImportJoboperation every 30 seconds (at most 20 times). Wait until a job is completed.
   */
  waitFor(state: "referenceImportJobCompleted", callback?: (err: AWSError, data: Omics.Types.GetReferenceImportJobResponse) => void): Request<Omics.Types.GetReferenceImportJobResponse, AWSError>;
  /**
   * Waits for the runCompleted state by periodically calling the underlying Omics.getRunoperation every 30 seconds (at most 20 times). Wait until a run is completed.
   */
  waitFor(state: "runCompleted", params: Omics.Types.GetRunRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetRunResponse) => void): Request<Omics.Types.GetRunResponse, AWSError>;
  /**
   * Waits for the runCompleted state by periodically calling the underlying Omics.getRunoperation every 30 seconds (at most 20 times). Wait until a run is completed.
   */
  waitFor(state: "runCompleted", callback?: (err: AWSError, data: Omics.Types.GetRunResponse) => void): Request<Omics.Types.GetRunResponse, AWSError>;
  /**
   * Waits for the runRunning state by periodically calling the underlying Omics.getRunoperation every 30 seconds (at most 20 times). Wait until a run is running.
   */
  waitFor(state: "runRunning", params: Omics.Types.GetRunRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetRunResponse) => void): Request<Omics.Types.GetRunResponse, AWSError>;
  /**
   * Waits for the runRunning state by periodically calling the underlying Omics.getRunoperation every 30 seconds (at most 20 times). Wait until a run is running.
   */
  waitFor(state: "runRunning", callback?: (err: AWSError, data: Omics.Types.GetRunResponse) => void): Request<Omics.Types.GetRunResponse, AWSError>;
  /**
   * Waits for the taskCompleted state by periodically calling the underlying Omics.getRunTaskoperation every 30 seconds (at most 20 times). Wait until a task is completed.
   */
  waitFor(state: "taskCompleted", params: Omics.Types.GetRunTaskRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetRunTaskResponse) => void): Request<Omics.Types.GetRunTaskResponse, AWSError>;
  /**
   * Waits for the taskCompleted state by periodically calling the underlying Omics.getRunTaskoperation every 30 seconds (at most 20 times). Wait until a task is completed.
   */
  waitFor(state: "taskCompleted", callback?: (err: AWSError, data: Omics.Types.GetRunTaskResponse) => void): Request<Omics.Types.GetRunTaskResponse, AWSError>;
  /**
   * Waits for the taskRunning state by periodically calling the underlying Omics.getRunTaskoperation every 30 seconds (at most 20 times). Wait until a task is running.
   */
  waitFor(state: "taskRunning", params: Omics.Types.GetRunTaskRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetRunTaskResponse) => void): Request<Omics.Types.GetRunTaskResponse, AWSError>;
  /**
   * Waits for the taskRunning state by periodically calling the underlying Omics.getRunTaskoperation every 30 seconds (at most 20 times). Wait until a task is running.
   */
  waitFor(state: "taskRunning", callback?: (err: AWSError, data: Omics.Types.GetRunTaskResponse) => void): Request<Omics.Types.GetRunTaskResponse, AWSError>;
  /**
   * Waits for the variantImportJobCreated state by periodically calling the underlying Omics.getVariantImportJoboperation every 30 seconds (at most 20 times). Wait until variant import is completed
   */
  waitFor(state: "variantImportJobCreated", params: Omics.Types.GetVariantImportRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetVariantImportResponse) => void): Request<Omics.Types.GetVariantImportResponse, AWSError>;
  /**
   * Waits for the variantImportJobCreated state by periodically calling the underlying Omics.getVariantImportJoboperation every 30 seconds (at most 20 times). Wait until variant import is completed
   */
  waitFor(state: "variantImportJobCreated", callback?: (err: AWSError, data: Omics.Types.GetVariantImportResponse) => void): Request<Omics.Types.GetVariantImportResponse, AWSError>;
  /**
   * Waits for the variantStoreCreated state by periodically calling the underlying Omics.getVariantStoreoperation every 30 seconds (at most 20 times). Wait until a variant store is created
   */
  waitFor(state: "variantStoreCreated", params: Omics.Types.GetVariantStoreRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetVariantStoreResponse) => void): Request<Omics.Types.GetVariantStoreResponse, AWSError>;
  /**
   * Waits for the variantStoreCreated state by periodically calling the underlying Omics.getVariantStoreoperation every 30 seconds (at most 20 times). Wait until a variant store is created
   */
  waitFor(state: "variantStoreCreated", callback?: (err: AWSError, data: Omics.Types.GetVariantStoreResponse) => void): Request<Omics.Types.GetVariantStoreResponse, AWSError>;
  /**
   * Waits for the variantStoreDeleted state by periodically calling the underlying Omics.getVariantStoreoperation every 30 seconds (at most 20 times). Wait until a variant store is deleted.
   */
  waitFor(state: "variantStoreDeleted", params: Omics.Types.GetVariantStoreRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetVariantStoreResponse) => void): Request<Omics.Types.GetVariantStoreResponse, AWSError>;
  /**
   * Waits for the variantStoreDeleted state by periodically calling the underlying Omics.getVariantStoreoperation every 30 seconds (at most 20 times). Wait until a variant store is deleted.
   */
  waitFor(state: "variantStoreDeleted", callback?: (err: AWSError, data: Omics.Types.GetVariantStoreResponse) => void): Request<Omics.Types.GetVariantStoreResponse, AWSError>;
  /**
   * Waits for the workflowActive state by periodically calling the underlying Omics.getWorkflowoperation every 3 seconds (at most 10 times). Wait until a workflow is active.
   */
  waitFor(state: "workflowActive", params: Omics.Types.GetWorkflowRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Omics.Types.GetWorkflowResponse) => void): Request<Omics.Types.GetWorkflowResponse, AWSError>;
  /**
   * Waits for the workflowActive state by periodically calling the underlying Omics.getWorkflowoperation every 3 seconds (at most 10 times). Wait until a workflow is active.
   */
  waitFor(state: "workflowActive", callback?: (err: AWSError, data: Omics.Types.GetWorkflowResponse) => void): Request<Omics.Types.GetWorkflowResponse, AWSError>;
}
declare namespace Omics {
  export interface AbortMultipartReadSetUploadRequest {
    /**
     *  The sequence store ID for the store involved in the multipart upload. 
     */
    sequenceStoreId: SequenceStoreId;
    /**
     *  The ID for the multipart upload. 
     */
    uploadId: UploadId;
  }
  export interface AbortMultipartReadSetUploadResponse {
  }
  export type Accelerators = "GPU"|string;
  export interface AcceptShareRequest {
    /**
     *  The ID for a share offer for analytics store data. 
     */
    shareId: String;
  }
  export interface AcceptShareResponse {
    /**
     *  The status of an analytics store share. 
     */
    status?: ShareStatus;
  }
  export interface ActivateReadSetFilter {
    /**
     * The filter's status.
     */
    status?: ReadSetActivationJobStatus;
    /**
     * The filter's start date.
     */
    createdAfter?: SyntheticTimestamp_date_time;
    /**
     * The filter's end date.
     */
    createdBefore?: SyntheticTimestamp_date_time;
  }
  export interface ActivateReadSetJobItem {
    /**
     * The job's ID.
     */
    id: ActivationJobId;
    /**
     * The job's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The job's status.
     */
    status: ReadSetActivationJobStatus;
    /**
     * When the job was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     * When the job completed.
     */
    completionTime?: SyntheticTimestamp_date_time;
  }
  export type ActivateReadSetJobList = ActivateReadSetJobItem[];
  export interface ActivateReadSetSourceItem {
    /**
     * The source's read set ID.
     */
    readSetId: ReadSetId;
    /**
     * The source's status.
     */
    status: ReadSetActivationJobItemStatus;
    /**
     * The source's status message.
     */
    statusMessage?: JobStatusMessage;
  }
  export type ActivateReadSetSourceList = ActivateReadSetSourceItem[];
  export type ActivationJobId = string;
  export type AnnotationFieldMap = {[key: string]: AnnotationFieldMapValueString};
  export type AnnotationFieldMapKeyString = string;
  export type AnnotationFieldMapValueString = string;
  export interface AnnotationImportItemDetail {
    /**
     * The source file's location in Amazon S3.
     */
    source: S3Uri;
    /**
     * The item's job status.
     */
    jobStatus: JobStatus;
  }
  export type AnnotationImportItemDetails = AnnotationImportItemDetail[];
  export interface AnnotationImportItemSource {
    /**
     * The source file's location in Amazon S3.
     */
    source: S3Uri;
  }
  export type AnnotationImportItemSources = AnnotationImportItemSource[];
  export interface AnnotationImportJobItem {
    /**
     * The job's ID.
     */
    id: String;
    /**
     * The job's destination annotation store.
     */
    destinationName: String;
    /**
     *  The name of the annotation store version. 
     */
    versionName: VersionName;
    /**
     * The job's service role ARN.
     */
    roleArn: Arn;
    /**
     * The job's status.
     */
    status: JobStatus;
    /**
     * When the job was created.
     */
    creationTime: CreationTime;
    /**
     * When the job was updated.
     */
    updateTime: UpdateTime;
    /**
     * When the job completed.
     */
    completionTime?: CompletionTime;
    /**
     * The job's left normalization setting.
     */
    runLeftNormalization?: RunLeftNormalization;
    /**
     *  The annotation schema generated by the parsed annotation data. 
     */
    annotationFields?: AnnotationFieldMap;
  }
  export type AnnotationImportJobItems = AnnotationImportJobItem[];
  export interface AnnotationStoreItem {
    /**
     * The store's ID.
     */
    id: ResourceId;
    /**
     * The store's genome reference.
     */
    reference: ReferenceItem;
    /**
     * The store's status.
     */
    status: StoreStatus;
    /**
     * The store's ARN.
     */
    storeArn: Arn;
    /**
     * The store's name.
     */
    name: String;
    /**
     * The store's file format.
     */
    storeFormat: StoreFormat;
    /**
     * The store's description.
     */
    description: Description;
    /**
     * The store's server-side encryption (SSE) settings.
     */
    sseConfig: SseConfig;
    /**
     * The store's creation time.
     */
    creationTime: CreationTime;
    /**
     * When the store was updated.
     */
    updateTime: UpdateTime;
    /**
     * The store's status message.
     */
    statusMessage: StatusMessage;
    /**
     * The store's size in bytes.
     */
    storeSizeBytes: Long;
  }
  export type AnnotationStoreItems = AnnotationStoreItem[];
  export interface AnnotationStoreVersionItem {
    /**
     *  The store ID for an annotation store version. 
     */
    storeId: ResourceId;
    /**
     *  The annotation store version ID. 
     */
    id: ResourceId;
    /**
     *  The status of an annotation store version. 
     */
    status: VersionStatus;
    /**
     *  The Arn for an annotation store version. 
     */
    versionArn: Arn;
    /**
     *  A name given to an annotation store version to distinguish it from others. 
     */
    name: StoreName;
    /**
     *  The name of an annotation store version. 
     */
    versionName: VersionName;
    /**
     *  The description of an annotation store version. 
     */
    description: Description;
    /**
     *  The time stamp for when an annotation store version was created. 
     */
    creationTime: CreationTime;
    /**
     *  The time stamp for when an annotation store version was updated. 
     */
    updateTime: UpdateTime;
    /**
     *  The status of an annotation store version. 
     */
    statusMessage: StatusMessage;
    /**
     *  The size of an annotation store version in Bytes. 
     */
    versionSizeBytes: Long;
  }
  export type AnnotationStoreVersionItems = AnnotationStoreVersionItem[];
  export type AnnotationType = "GENERIC"|"CHR_POS"|"CHR_POS_REF_ALT"|"CHR_START_END_ONE_BASE"|"CHR_START_END_REF_ALT_ONE_BASE"|"CHR_START_END_ZERO_BASE"|"CHR_START_END_REF_ALT_ZERO_BASE"|string;
  export type Arn = string;
  export type ArnList = String[];
  export interface BatchDeleteReadSetRequest {
    /**
     * The read sets' IDs.
     */
    ids: ReadSetIdList;
    /**
     * The read sets' sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
  }
  export interface BatchDeleteReadSetResponse {
    /**
     * Errors returned by individual delete operations.
     */
    errors?: ReadSetBatchErrorList;
  }
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export type Boolean = boolean;
  export interface CancelAnnotationImportRequest {
    /**
     * The job's ID.
     */
    jobId: ResourceId;
  }
  export interface CancelAnnotationImportResponse {
  }
  export interface CancelRunRequest {
    /**
     * The run's ID.
     */
    id: RunId;
  }
  export interface CancelVariantImportRequest {
    /**
     * The job's ID.
     */
    jobId: ResourceId;
  }
  export interface CancelVariantImportResponse {
  }
  export type ClientToken = string;
  export type CommentChar = string;
  export interface CompleteMultipartReadSetUploadRequest {
    /**
     *  The sequence store ID for the store involved in the multipart upload. 
     */
    sequenceStoreId: SequenceStoreId;
    /**
     *  The ID for the multipart upload. 
     */
    uploadId: UploadId;
    /**
     *  The individual uploads or parts of a multipart upload. 
     */
    parts: CompleteReadSetUploadPartList;
  }
  export interface CompleteMultipartReadSetUploadResponse {
    /**
     *  The read set ID created for an uploaded read set. 
     */
    readSetId: ReadSetId;
  }
  export type CompleteReadSetUploadPartList = CompleteReadSetUploadPartListItem[];
  export interface CompleteReadSetUploadPartListItem {
    /**
     *  A number identifying the part in a read set upload. 
     */
    partNumber: CompleteReadSetUploadPartListItemPartNumberInteger;
    /**
     *  The source file of the part being uploaded. 
     */
    partSource: ReadSetPartSource;
    /**
     *  A unique identifier used to confirm that parts are being added to the correct upload. 
     */
    checksum: String;
  }
  export type CompleteReadSetUploadPartListItemPartNumberInteger = number;
  export type CompletionTime = Date;
  export interface CreateAnnotationStoreRequest {
    /**
     * The genome reference for the store's annotations.
     */
    reference?: ReferenceItem;
    /**
     * A name for the store.
     */
    name?: StoreName;
    /**
     * A description for the store.
     */
    description?: Description;
    /**
     * Tags for the store.
     */
    tags?: TagMap;
    /**
     *  The name given to an annotation store version to distinguish it from other versions. 
     */
    versionName?: VersionName;
    /**
     * Server-side encryption (SSE) settings for the store.
     */
    sseConfig?: SseConfig;
    /**
     * The annotation file format of the store.
     */
    storeFormat: StoreFormat;
    /**
     * File parsing options for the annotation store.
     */
    storeOptions?: StoreOptions;
  }
  export interface CreateAnnotationStoreResponse {
    /**
     * The store's ID.
     */
    id: ResourceId;
    /**
     * The store's genome reference. Required for all stores except TSV format with generic annotations.
     */
    reference?: ReferenceItem;
    /**
     * The annotation file format of the store.
     */
    storeFormat?: StoreFormat;
    /**
     * The store's file parsing options.
     */
    storeOptions?: StoreOptions;
    /**
     * The store's status.
     */
    status: StoreStatus;
    /**
     * The store's name.
     */
    name: String;
    /**
     *  The name given to an annotation store version to distinguish it from other versions. 
     */
    versionName: VersionName;
    /**
     * When the store was created.
     */
    creationTime: CreationTime;
  }
  export interface CreateAnnotationStoreVersionRequest {
    /**
     *  The name of an annotation store version from which versions are being created. 
     */
    name: StoreName;
    /**
     *  The name given to an annotation store version to distinguish it from other versions. 
     */
    versionName: VersionName;
    /**
     *  The description of an annotation store version. 
     */
    description?: Description;
    /**
     *  The options for an annotation store version. 
     */
    versionOptions?: VersionOptions;
    /**
     *  Any tags added to annotation store version. 
     */
    tags?: TagMap;
  }
  export interface CreateAnnotationStoreVersionResponse {
    /**
     *  A generated ID for the annotation store 
     */
    id: ResourceId;
    /**
     *  The name given to an annotation store version to distinguish it from other versions. 
     */
    versionName: VersionName;
    /**
     *  The ID for the annotation store from which new versions are being created. 
     */
    storeId: ResourceId;
    /**
     *  The options for an annotation store version. 
     */
    versionOptions?: VersionOptions;
    /**
     *  The name given to an annotation store version to distinguish it from other versions. 
     */
    name: StoreName;
    /**
     *  The status of a annotation store version. 
     */
    status: VersionStatus;
    /**
     *  The time stamp for the creation of an annotation store version. 
     */
    creationTime: CreationTime;
  }
  export interface CreateMultipartReadSetUploadRequest {
    /**
     *  The sequence store ID for the store that is the destination of the multipart uploads. 
     */
    sequenceStoreId: SequenceStoreId;
    /**
     *  An idempotency token that can be used to avoid triggering multiple multipart uploads. 
     */
    clientToken?: ClientToken;
    /**
     *  The type of file being uploaded. 
     */
    sourceFileType: FileType;
    /**
     *  The source's subject ID. 
     */
    subjectId: SubjectId;
    /**
     *  The source's sample ID. 
     */
    sampleId: SampleId;
    /**
     *  Where the source originated. 
     */
    generatedFrom?: GeneratedFrom;
    /**
     *  The ARN of the reference. 
     */
    referenceArn: ReferenceArn;
    /**
     *  The name of the read set. 
     */
    name: ReadSetName;
    /**
     *  The description of the read set. 
     */
    description?: ReadSetDescription;
    /**
     *  Any tags to add to the read set. 
     */
    tags?: TagMap;
  }
  export interface CreateMultipartReadSetUploadResponse {
    /**
     *  The sequence store ID for the store that the read set will be created in. 
     */
    sequenceStoreId: SequenceStoreId;
    /**
     *  he ID for the initiated multipart upload. 
     */
    uploadId: UploadId;
    /**
     *  The file type of the read set source. 
     */
    sourceFileType: FileType;
    /**
     *  The source's subject ID. 
     */
    subjectId: SubjectId;
    /**
     *  The source's sample ID. 
     */
    sampleId: SampleId;
    /**
     *  The source of the read set. 
     */
    generatedFrom?: GeneratedFrom;
    /**
     *  The read set source's reference ARN. 
     */
    referenceArn: ReferenceArn;
    /**
     *  The name of the read set. 
     */
    name?: ReadSetName;
    /**
     *  The description of the read set. 
     */
    description?: ReadSetDescription;
    /**
     *  The tags to add to the read set. 
     */
    tags?: TagMap;
    /**
     *  The creation time of the multipart upload. 
     */
    creationTime: SyntheticTimestamp_date_time;
  }
  export interface CreateReferenceStoreRequest {
    /**
     * A name for the store.
     */
    name: ReferenceStoreName;
    /**
     * A description for the store.
     */
    description?: ReferenceStoreDescription;
    /**
     * Server-side encryption (SSE) settings for the store.
     */
    sseConfig?: SseConfig;
    /**
     * Tags for the store.
     */
    tags?: TagMap;
    /**
     * To ensure that requests don't run multiple times, specify a unique token for each request.
     */
    clientToken?: ClientToken;
  }
  export interface CreateReferenceStoreResponse {
    /**
     * The store's ID.
     */
    id: ReferenceStoreId;
    /**
     * The store's ARN.
     */
    arn: ReferenceStoreArn;
    /**
     * The store's name.
     */
    name?: ReferenceStoreName;
    /**
     * The store's description.
     */
    description?: ReferenceStoreDescription;
    /**
     * The store's SSE settings.
     */
    sseConfig?: SseConfig;
    /**
     * When the store was created.
     */
    creationTime: SyntheticTimestamp_date_time;
  }
  export interface CreateRunGroupRequest {
    /**
     * A name for the group.
     */
    name?: RunGroupName;
    /**
     * The maximum number of CPUs to use in the group.
     */
    maxCpus?: CreateRunGroupRequestMaxCpusInteger;
    /**
     * The maximum number of concurrent runs for the group.
     */
    maxRuns?: CreateRunGroupRequestMaxRunsInteger;
    /**
     * A maximum run time for the group in minutes.
     */
    maxDuration?: CreateRunGroupRequestMaxDurationInteger;
    /**
     * Tags for the group.
     */
    tags?: TagMap;
    /**
     * To ensure that requests don't run multiple times, specify a unique ID for each request.
     */
    requestId: RunGroupRequestId;
    /**
     *  The maximum GPUs that can be used by a run group. 
     */
    maxGpus?: CreateRunGroupRequestMaxGpusInteger;
  }
  export type CreateRunGroupRequestMaxCpusInteger = number;
  export type CreateRunGroupRequestMaxDurationInteger = number;
  export type CreateRunGroupRequestMaxGpusInteger = number;
  export type CreateRunGroupRequestMaxRunsInteger = number;
  export interface CreateRunGroupResponse {
    /**
     * The group's ARN.
     */
    arn?: RunGroupArn;
    /**
     * The group's ID.
     */
    id?: RunGroupId;
    /**
     * Tags for the run group.
     */
    tags?: TagMap;
  }
  export interface CreateSequenceStoreRequest {
    /**
     * A name for the store.
     */
    name: SequenceStoreName;
    /**
     * A description for the store.
     */
    description?: SequenceStoreDescription;
    /**
     * Server-side encryption (SSE) settings for the store.
     */
    sseConfig?: SseConfig;
    /**
     * Tags for the store.
     */
    tags?: TagMap;
    /**
     * To ensure that requests don't run multiple times, specify a unique token for each request.
     */
    clientToken?: ClientToken;
    /**
     *  An S3 location that is used to store files that have failed a direct upload. 
     */
    fallbackLocation?: S3Destination;
  }
  export interface CreateSequenceStoreResponse {
    /**
     * The store's ID.
     */
    id: SequenceStoreId;
    /**
     * The store's ARN.
     */
    arn: SequenceStoreArn;
    /**
     * The store's name.
     */
    name?: SequenceStoreName;
    /**
     * The store's description.
     */
    description?: SequenceStoreDescription;
    /**
     * The store's SSE settings.
     */
    sseConfig?: SseConfig;
    /**
     * When the store was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     *  An S3 location that is used to store files that have failed a direct upload. 
     */
    fallbackLocation?: S3Destination;
  }
  export interface CreateShareRequest {
    /**
     *  The resource ARN for the analytics store to be shared. 
     */
    resourceArn: String;
    /**
     *  The principal subscriber is the account being given access to the analytics store data through the share offer. 
     */
    principalSubscriber: String;
    /**
     *  A name given to the share. 
     */
    shareName?: ShareName;
  }
  export interface CreateShareResponse {
    /**
     *  An ID generated for the share. 
     */
    shareId?: String;
    /**
     *  The status of a share. 
     */
    status?: ShareStatus;
    /**
     *  A name given to the share. 
     */
    shareName?: ShareName;
  }
  export interface CreateVariantStoreRequest {
    /**
     * The genome reference for the store's variants.
     */
    reference: ReferenceItem;
    /**
     * A name for the store.
     */
    name?: StoreName;
    /**
     * A description for the store.
     */
    description?: Description;
    /**
     * Tags for the store.
     */
    tags?: TagMap;
    /**
     * Server-side encryption (SSE) settings for the store.
     */
    sseConfig?: SseConfig;
  }
  export interface CreateVariantStoreResponse {
    /**
     * The store's ID.
     */
    id: ResourceId;
    /**
     * The store's genome reference.
     */
    reference?: ReferenceItem;
    /**
     * The store's status.
     */
    status: StoreStatus;
    /**
     * The store's name.
     */
    name: String;
    /**
     * When the store was created.
     */
    creationTime: CreationTime;
  }
  export interface CreateWorkflowRequest {
    /**
     * A name for the workflow.
     */
    name?: WorkflowName;
    /**
     * A description for the workflow.
     */
    description?: WorkflowDescription;
    /**
     * An engine for the workflow.
     */
    engine?: WorkflowEngine;
    /**
     * A ZIP archive for the workflow.
     */
    definitionZip?: _Blob;
    /**
     * The URI of a definition for the workflow.
     */
    definitionUri?: WorkflowDefinition;
    /**
     * The path of the main definition file for the workflow.
     */
    main?: WorkflowMain;
    /**
     * A parameter template for the workflow.
     */
    parameterTemplate?: WorkflowParameterTemplate;
    /**
     * A storage capacity for the workflow in gigabytes.
     */
    storageCapacity?: CreateWorkflowRequestStorageCapacityInteger;
    /**
     * Tags for the workflow.
     */
    tags?: TagMap;
    /**
     * To ensure that requests don't run multiple times, specify a unique ID for each request.
     */
    requestId: WorkflowRequestId;
    /**
     *  The computational accelerator specified to run the workflow. 
     */
    accelerators?: Accelerators;
  }
  export type CreateWorkflowRequestStorageCapacityInteger = number;
  export interface CreateWorkflowResponse {
    /**
     * The workflow's ARN.
     */
    arn?: WorkflowArn;
    /**
     * The workflow's ID.
     */
    id?: WorkflowId;
    /**
     * The workflow's status.
     */
    status?: WorkflowStatus;
    /**
     * The workflow's tags.
     */
    tags?: TagMap;
  }
  export type CreationTime = Date;
  export type CreationType = "IMPORT"|"UPLOAD"|string;
  export interface DeleteAnnotationStoreRequest {
    /**
     * The store's name.
     */
    name: String;
    /**
     * Whether to force deletion.
     */
    force?: PrimitiveBoolean;
  }
  export interface DeleteAnnotationStoreResponse {
    /**
     * The store's status.
     */
    status: StoreStatus;
  }
  export interface DeleteAnnotationStoreVersionsRequest {
    /**
     *  The name of the annotation store from which versions are being deleted. 
     */
    name: String;
    /**
     *  The versions of an annotation store to be deleted. 
     */
    versions: VersionList;
    /**
     *  Forces the deletion of an annotation store version when imports are in-progress.. 
     */
    force?: PrimitiveBoolean;
  }
  export interface DeleteAnnotationStoreVersionsResponse {
    /**
     *  Any errors that occur when attempting to delete an annotation store version. 
     */
    errors?: VersionDeleteErrorList;
  }
  export interface DeleteReferenceRequest {
    /**
     * The reference's ID.
     */
    id: ReferenceId;
    /**
     * The reference's store ID.
     */
    referenceStoreId: ReferenceStoreId;
  }
  export interface DeleteReferenceResponse {
  }
  export interface DeleteReferenceStoreRequest {
    /**
     * The store's ID.
     */
    id: ReferenceStoreId;
  }
  export interface DeleteReferenceStoreResponse {
  }
  export interface DeleteRunGroupRequest {
    /**
     * The run group's ID.
     */
    id: RunGroupId;
  }
  export interface DeleteRunRequest {
    /**
     * The run's ID.
     */
    id: RunId;
  }
  export interface DeleteSequenceStoreRequest {
    /**
     * The sequence store's ID.
     */
    id: SequenceStoreId;
  }
  export interface DeleteSequenceStoreResponse {
  }
  export interface DeleteShareRequest {
    /**
     *  The ID for the share request to be deleted. 
     */
    shareId: String;
  }
  export interface DeleteShareResponse {
    /**
     *  The status of the share being deleted. 
     */
    status?: ShareStatus;
  }
  export interface DeleteVariantStoreRequest {
    /**
     * The store's name.
     */
    name: String;
    /**
     * Whether to force deletion.
     */
    force?: PrimitiveBoolean;
  }
  export interface DeleteVariantStoreResponse {
    /**
     * The store's status.
     */
    status: StoreStatus;
  }
  export interface DeleteWorkflowRequest {
    /**
     * The workflow's ID.
     */
    id: WorkflowId;
  }
  export type Description = string;
  export interface ETag {
    /**
     *  The algorithm used to calculate the read set’s ETag(s). 
     */
    algorithm?: ETagAlgorithm;
    /**
     *  The ETag hash calculated on Source1 of the read set. 
     */
    source1?: String;
    /**
     *  The ETag hash calculated on Source2 of the read set. 
     */
    source2?: String;
  }
  export type ETagAlgorithm = "FASTQ_MD5up"|"BAM_MD5up"|"CRAM_MD5up"|string;
  export type Encoding = string;
  export type EncryptionType = "KMS"|string;
  export type EscapeChar = string;
  export type EscapeQuotes = boolean;
  export type ExportJobId = string;
  export interface ExportReadSet {
    /**
     * The set's ID.
     */
    readSetId: ReadSetId;
  }
  export interface ExportReadSetDetail {
    /**
     * The set's ID.
     */
    id: ReadSetId;
    /**
     * The set's status.
     */
    status: ReadSetExportJobItemStatus;
    /**
     * The set's status message.
     */
    statusMessage?: JobStatusMessage;
  }
  export type ExportReadSetDetailList = ExportReadSetDetail[];
  export interface ExportReadSetFilter {
    /**
     * A status to filter on.
     */
    status?: ReadSetExportJobStatus;
    /**
     * The filter's start date.
     */
    createdAfter?: SyntheticTimestamp_date_time;
    /**
     * The filter's end date.
     */
    createdBefore?: SyntheticTimestamp_date_time;
  }
  export interface ExportReadSetJobDetail {
    /**
     * The job's ID.
     */
    id: ExportJobId;
    /**
     * The job's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The job's destination in Amazon S3.
     */
    destination: S3Destination;
    /**
     * The job's status.
     */
    status: ReadSetExportJobStatus;
    /**
     * When the job was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     * When the job completed.
     */
    completionTime?: SyntheticTimestamp_date_time;
  }
  export type ExportReadSetJobDetailList = ExportReadSetJobDetail[];
  export interface FileInformation {
    /**
     * The file's total parts.
     */
    totalParts?: FileInformationTotalPartsInteger;
    /**
     * The file's part size.
     */
    partSize?: FileInformationPartSizeLong;
    /**
     * The file's content length.
     */
    contentLength?: FileInformationContentLengthLong;
  }
  export type FileInformationContentLengthLong = number;
  export type FileInformationPartSizeLong = number;
  export type FileInformationTotalPartsInteger = number;
  export type FileType = "FASTQ"|"BAM"|"CRAM"|string;
  export interface Filter {
    /**
     *  The Amazon Resource Number (Arn) for an analytics store. 
     */
    resourceArns?: ArnList;
    /**
     *  The status of an annotation store version. 
     */
    status?: StatusList;
  }
  export interface FormatOptions {
    /**
     * Options for a TSV file.
     */
    tsvOptions?: TsvOptions;
    /**
     * Options for a VCF file.
     */
    vcfOptions?: VcfOptions;
  }
  export type FormatToHeader = {[key: string]: FormatToHeaderValueString};
  export type FormatToHeaderKey = "CHR"|"START"|"END"|"REF"|"ALT"|"POS"|string;
  export type FormatToHeaderValueString = string;
  export type GeneratedFrom = string;
  export interface GetAnnotationImportRequest {
    /**
     * The job's ID.
     */
    jobId: ResourceId;
  }
  export interface GetAnnotationImportResponse {
    /**
     * The job's ID.
     */
    id: ResourceId;
    /**
     * The job's destination annotation store.
     */
    destinationName: StoreName;
    /**
     *  The name of the annotation store version. 
     */
    versionName: VersionName;
    /**
     * The job's service role ARN.
     */
    roleArn: Arn;
    /**
     * The job's status.
     */
    status: JobStatus;
    /**
     * The job's status message.
     */
    statusMessage: JobStatusMsg;
    /**
     * When the job was created.
     */
    creationTime: CreationTime;
    /**
     * When the job was updated.
     */
    updateTime: UpdateTime;
    /**
     * When the job completed.
     */
    completionTime: CompletionTime;
    /**
     * The job's imported items.
     */
    items: AnnotationImportItemDetails;
    /**
     * The job's left normalization setting.
     */
    runLeftNormalization: RunLeftNormalization;
    formatOptions: FormatOptions;
    /**
     *  The annotation schema generated by the parsed annotation data. 
     */
    annotationFields?: AnnotationFieldMap;
  }
  export interface GetAnnotationStoreRequest {
    /**
     * The store's name.
     */
    name: String;
  }
  export interface GetAnnotationStoreResponse {
    /**
     * The store's ID.
     */
    id: ResourceId;
    /**
     * The store's genome reference.
     */
    reference: ReferenceItem;
    /**
     * The store's status.
     */
    status: StoreStatus;
    /**
     * The store's ARN.
     */
    storeArn: Arn;
    /**
     * The store's name.
     */
    name: String;
    /**
     * The store's description.
     */
    description: Description;
    /**
     * The store's server-side encryption (SSE) settings.
     */
    sseConfig: SseConfig;
    /**
     * When the store was created.
     */
    creationTime: CreationTime;
    /**
     * When the store was updated.
     */
    updateTime: UpdateTime;
    /**
     * The store's tags.
     */
    tags: TagMap;
    /**
     * The store's parsing options.
     */
    storeOptions?: StoreOptions;
    /**
     * The store's annotation file format.
     */
    storeFormat?: StoreFormat;
    /**
     * A status message.
     */
    statusMessage: StatusMessage;
    /**
     * The store's size in bytes.
     */
    storeSizeBytes: Long;
    /**
     *  An integer indicating how many versions of an annotation store exist. 
     */
    numVersions: Integer;
  }
  export interface GetAnnotationStoreVersionRequest {
    /**
     *  The name given to an annotation store version to distinguish it from others. 
     */
    name: String;
    /**
     *  The name given to an annotation store version to distinguish it from others. 
     */
    versionName: String;
  }
  export interface GetAnnotationStoreVersionResponse {
    /**
     *  The store ID for annotation store version. 
     */
    storeId: ResourceId;
    /**
     *  The annotation store version ID. 
     */
    id: ResourceId;
    /**
     *  The status of an annotation store version. 
     */
    status: VersionStatus;
    /**
     *  The Arn for the annotation store. 
     */
    versionArn: Arn;
    /**
     *  The name of the annotation store. 
     */
    name: StoreName;
    /**
     *  The name given to an annotation store version to distinguish it from others. 
     */
    versionName: VersionName;
    /**
     *  The description for an annotation store version. 
     */
    description: Description;
    /**
     *  The time stamp for when an annotation store version was created. 
     */
    creationTime: CreationTime;
    /**
     *  The time stamp for when an annotation store version was updated. 
     */
    updateTime: UpdateTime;
    /**
     *  Any tags associated with an annotation store version. 
     */
    tags: TagMap;
    /**
     *  The options for an annotation store version. 
     */
    versionOptions?: VersionOptions;
    /**
     *  The status of an annotation store version. 
     */
    statusMessage: StatusMessage;
    /**
     *  The size of the annotation store version in Bytes. 
     */
    versionSizeBytes: Long;
  }
  export interface GetReadSetActivationJobRequest {
    /**
     * The job's ID.
     */
    id: ActivationJobId;
    /**
     * The job's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
  }
  export interface GetReadSetActivationJobResponse {
    /**
     * The job's ID.
     */
    id: ActivationJobId;
    /**
     * The job's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The job's status.
     */
    status: ReadSetActivationJobStatus;
    /**
     * The job's status message.
     */
    statusMessage?: JobStatusMessage;
    /**
     * When the job was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     * When the job completed.
     */
    completionTime?: SyntheticTimestamp_date_time;
    /**
     * The job's source files.
     */
    sources?: ActivateReadSetSourceList;
  }
  export interface GetReadSetExportJobRequest {
    /**
     * The job's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The job's ID.
     */
    id: ExportJobId;
  }
  export interface GetReadSetExportJobResponse {
    /**
     * The job's ID.
     */
    id: ExportJobId;
    /**
     * The job's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The job's destination in Amazon S3.
     */
    destination: S3Destination;
    /**
     * The job's status.
     */
    status: ReadSetExportJobStatus;
    /**
     * The job's status message.
     */
    statusMessage?: JobStatusMessage;
    /**
     * When the job was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     * When the job completed.
     */
    completionTime?: SyntheticTimestamp_date_time;
    /**
     * The job's read sets.
     */
    readSets?: ExportReadSetDetailList;
  }
  export interface GetReadSetImportJobRequest {
    /**
     * The job's ID.
     */
    id: ImportJobId;
    /**
     * The job's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
  }
  export interface GetReadSetImportJobResponse {
    /**
     * The job's ID.
     */
    id: ImportJobId;
    /**
     * The job's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The job's service role ARN.
     */
    roleArn: RoleArn;
    /**
     * The job's status.
     */
    status: ReadSetImportJobStatus;
    /**
     * The job's status message.
     */
    statusMessage?: JobStatusMessage;
    /**
     * When the job was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     * When the job completed.
     */
    completionTime?: SyntheticTimestamp_date_time;
    /**
     * The job's source files.
     */
    sources: ImportReadSetSourceList;
  }
  export interface GetReadSetMetadataRequest {
    /**
     * The read set's ID.
     */
    id: ReadSetId;
    /**
     * The read set's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
  }
  export interface GetReadSetMetadataResponse {
    /**
     * The read set's ID.
     */
    id: ReadSetId;
    /**
     * The read set's ARN.
     */
    arn: ReadSetArn;
    /**
     * The read set's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The read set's subject ID.
     */
    subjectId?: SubjectId;
    /**
     * The read set's sample ID.
     */
    sampleId?: SampleId;
    /**
     * The read set's status.
     */
    status: ReadSetStatus;
    /**
     * The read set's name.
     */
    name?: ReadSetName;
    /**
     * The read set's description.
     */
    description?: ReadSetDescription;
    /**
     * The read set's file type.
     */
    fileType: FileType;
    /**
     * When the read set was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     * The read set's sequence information.
     */
    sequenceInformation?: SequenceInformation;
    /**
     * The read set's genome reference ARN.
     */
    referenceArn?: ReferenceArn;
    /**
     * The read set's files.
     */
    files?: ReadSetFiles;
    /**
     *  The status message for a read set. It provides more detail as to why the read set has a status. 
     */
    statusMessage?: ReadSetStatusMessage;
    /**
     *  The creation type of the read set. 
     */
    creationType?: CreationType;
    /**
     *  The entity tag (ETag) is a hash of the object meant to represent its semantic content. 
     */
    etag?: ETag;
  }
  export interface GetReadSetRequest {
    /**
     * The read set's ID.
     */
    id: ReadSetId;
    /**
     * The read set's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The file to retrieve.
     */
    file?: ReadSetFile;
    /**
     * The part number to retrieve.
     */
    partNumber: GetReadSetRequestPartNumberInteger;
  }
  export type GetReadSetRequestPartNumberInteger = number;
  export interface GetReadSetResponse {
    /**
     * The read set file payload.
     */
    payload?: ReadSetStreamingBlob;
  }
  export interface GetReferenceImportJobRequest {
    /**
     * The job's ID.
     */
    id: ImportJobId;
    /**
     * The job's reference store ID.
     */
    referenceStoreId: ReferenceStoreId;
  }
  export interface GetReferenceImportJobResponse {
    /**
     * The job's ID.
     */
    id: ImportJobId;
    /**
     * The job's reference store ID.
     */
    referenceStoreId: ReferenceStoreId;
    /**
     * The job's service role ARN.
     */
    roleArn: RoleArn;
    /**
     * The job's status.
     */
    status: ReferenceImportJobStatus;
    /**
     * The job's status message.
     */
    statusMessage?: JobStatusMessage;
    /**
     * When the job was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     * When the job completed.
     */
    completionTime?: SyntheticTimestamp_date_time;
    /**
     * The job's source files.
     */
    sources: ImportReferenceSourceList;
  }
  export interface GetReferenceMetadataRequest {
    /**
     * The reference's ID.
     */
    id: ReferenceId;
    /**
     * The reference's reference store ID.
     */
    referenceStoreId: ReferenceStoreId;
  }
  export interface GetReferenceMetadataResponse {
    /**
     * The reference's ID.
     */
    id: ReferenceId;
    /**
     * The reference's ARN.
     */
    arn: ReferenceArn;
    /**
     * The reference's reference store ID.
     */
    referenceStoreId: ReferenceStoreId;
    /**
     * The reference's MD5 checksum.
     */
    md5: Md5;
    /**
     * The reference's status.
     */
    status?: ReferenceStatus;
    /**
     * The reference's name.
     */
    name?: ReferenceName;
    /**
     * The reference's description.
     */
    description?: ReferenceDescription;
    /**
     * When the reference was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     * When the reference was updated.
     */
    updateTime: SyntheticTimestamp_date_time;
    /**
     * The reference's files.
     */
    files?: ReferenceFiles;
  }
  export interface GetReferenceRequest {
    /**
     * The reference's ID.
     */
    id: ReferenceId;
    /**
     * The reference's store ID.
     */
    referenceStoreId: ReferenceStoreId;
    /**
     * The range to retrieve.
     */
    range?: Range;
    /**
     * The part number to retrieve.
     */
    partNumber: GetReferenceRequestPartNumberInteger;
    /**
     * The file to retrieve.
     */
    file?: ReferenceFile;
  }
  export type GetReferenceRequestPartNumberInteger = number;
  export interface GetReferenceResponse {
    /**
     * The reference file payload.
     */
    payload?: ReferenceStreamingBlob;
  }
  export interface GetReferenceStoreRequest {
    /**
     * The store's ID.
     */
    id: ReferenceStoreId;
  }
  export interface GetReferenceStoreResponse {
    /**
     * The store's ID.
     */
    id: ReferenceStoreId;
    /**
     * The store's ARN.
     */
    arn: ReferenceStoreArn;
    /**
     * The store's name.
     */
    name?: ReferenceStoreName;
    /**
     * The store's description.
     */
    description?: ReferenceStoreDescription;
    /**
     * The store's server-side encryption (SSE) settings.
     */
    sseConfig?: SseConfig;
    /**
     * When the store was created.
     */
    creationTime: SyntheticTimestamp_date_time;
  }
  export interface GetRunGroupRequest {
    /**
     * The group's ID.
     */
    id: RunGroupId;
  }
  export interface GetRunGroupResponse {
    /**
     * The group's ARN.
     */
    arn?: RunGroupArn;
    /**
     * The group's ID.
     */
    id?: RunGroupId;
    /**
     * The group's name.
     */
    name?: RunGroupName;
    /**
     * The group's maximum number of CPUs to use.
     */
    maxCpus?: GetRunGroupResponseMaxCpusInteger;
    /**
     * The maximum number of concurrent runs for the group.
     */
    maxRuns?: GetRunGroupResponseMaxRunsInteger;
    /**
     * The group's maximum run time in minutes.
     */
    maxDuration?: GetRunGroupResponseMaxDurationInteger;
    /**
     * When the group was created.
     */
    creationTime?: RunGroupTimestamp;
    /**
     * The group's tags.
     */
    tags?: TagMap;
    /**
     *  The maximum GPUs that can be used by a run group. 
     */
    maxGpus?: GetRunGroupResponseMaxGpusInteger;
  }
  export type GetRunGroupResponseMaxCpusInteger = number;
  export type GetRunGroupResponseMaxDurationInteger = number;
  export type GetRunGroupResponseMaxGpusInteger = number;
  export type GetRunGroupResponseMaxRunsInteger = number;
  export interface GetRunRequest {
    /**
     * The run's ID.
     */
    id: RunId;
    /**
     * The run's export format.
     */
    export?: RunExportList;
  }
  export interface GetRunResponse {
    /**
     * The run's ARN.
     */
    arn?: RunArn;
    /**
     * The run's ID.
     */
    id?: RunId;
    /**
     * The run's status.
     */
    status?: RunStatus;
    /**
     * The run's workflow ID.
     */
    workflowId?: WorkflowId;
    /**
     * The run's workflow type.
     */
    workflowType?: WorkflowType;
    /**
     * The run's ID.
     */
    runId?: RunId;
    /**
     * The run's service role ARN.
     */
    roleArn?: RunRoleArn;
    /**
     * The run's name.
     */
    name?: RunName;
    /**
     * The run's group ID.
     */
    runGroupId?: RunGroupId;
    /**
     * The run's priority.
     */
    priority?: GetRunResponsePriorityInteger;
    /**
     * The run's definition.
     */
    definition?: WorkflowDefinition;
    /**
     * The run's digest.
     */
    digest?: WorkflowDigest;
    /**
     * The run's parameters.
     */
    parameters?: RunParameters;
    /**
     * The run's storage capacity in gigabytes.
     */
    storageCapacity?: GetRunResponseStorageCapacityInteger;
    /**
     * The run's output URI.
     */
    outputUri?: RunOutputUri;
    /**
     * The run's log level.
     */
    logLevel?: RunLogLevel;
    /**
     * The run's resource digests.
     */
    resourceDigests?: RunResourceDigests;
    /**
     * Who started the run.
     */
    startedBy?: RunStartedBy;
    /**
     * When the run was created.
     */
    creationTime?: RunTimestamp;
    /**
     * When the run started.
     */
    startTime?: RunTimestamp;
    /**
     * The run's stop time.
     */
    stopTime?: RunTimestamp;
    /**
     * The run's status message.
     */
    statusMessage?: RunStatusMessage;
    /**
     * The run's tags.
     */
    tags?: TagMap;
    /**
     *  The computational accelerator used to run the workflow. 
     */
    accelerators?: Accelerators;
    /**
     * The run's retention mode.
     */
    retentionMode?: RunRetentionMode;
  }
  export type GetRunResponsePriorityInteger = number;
  export type GetRunResponseStorageCapacityInteger = number;
  export interface GetRunTaskRequest {
    /**
     * The task's ID.
     */
    id: RunId;
    /**
     * The task's ID.
     */
    taskId: TaskId;
  }
  export interface GetRunTaskResponse {
    /**
     * The task's ID.
     */
    taskId?: TaskId;
    /**
     * The task's status.
     */
    status?: TaskStatus;
    /**
     * The task's name.
     */
    name?: TaskName;
    /**
     * The task's CPU usage.
     */
    cpus?: GetRunTaskResponseCpusInteger;
    /**
     * The task's memory use in gigabytes.
     */
    memory?: GetRunTaskResponseMemoryInteger;
    /**
     * When the task was created.
     */
    creationTime?: TaskTimestamp;
    /**
     * The task's start time.
     */
    startTime?: TaskTimestamp;
    /**
     * The task's stop time.
     */
    stopTime?: TaskTimestamp;
    /**
     * The task's status message.
     */
    statusMessage?: TaskStatusMessage;
    /**
     * The task's log stream.
     */
    logStream?: TaskLogStream;
    /**
     *  The number of Graphics Processing Units (GPU) specified in the task. 
     */
    gpus?: GetRunTaskResponseGpusInteger;
    /**
     *  The instance type for a task. 
     */
    instanceType?: TaskInstanceType;
  }
  export type GetRunTaskResponseCpusInteger = number;
  export type GetRunTaskResponseGpusInteger = number;
  export type GetRunTaskResponseMemoryInteger = number;
  export interface GetSequenceStoreRequest {
    /**
     * The store's ID.
     */
    id: SequenceStoreId;
  }
  export interface GetSequenceStoreResponse {
    /**
     * The store's ID.
     */
    id: SequenceStoreId;
    /**
     * The store's ARN.
     */
    arn: SequenceStoreArn;
    /**
     * The store's name.
     */
    name?: SequenceStoreName;
    /**
     * The store's description.
     */
    description?: SequenceStoreDescription;
    /**
     * The store's server-side encryption (SSE) settings.
     */
    sseConfig?: SseConfig;
    /**
     * When the store was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     *  An S3 location that is used to store files that have failed a direct upload. 
     */
    fallbackLocation?: S3Destination;
  }
  export interface GetShareRequest {
    /**
     *  The generated ID for a share. 
     */
    shareId: String;
  }
  export interface GetShareResponse {
    /**
     *  An analytic store share details object. contains status, resourceArn, ownerId, etc. 
     */
    share?: ShareDetails;
  }
  export interface GetVariantImportRequest {
    /**
     * The job's ID.
     */
    jobId: ResourceId;
  }
  export interface GetVariantImportResponse {
    /**
     * The job's ID.
     */
    id: ResourceId;
    /**
     * The job's destination variant store.
     */
    destinationName: StoreName;
    /**
     * The job's service role ARN.
     */
    roleArn: Arn;
    /**
     * The job's status.
     */
    status: JobStatus;
    /**
     * The job's status message.
     */
    statusMessage: JobStatusMsg;
    /**
     * When the job was created.
     */
    creationTime: CreationTime;
    /**
     * When the job was updated.
     */
    updateTime: UpdateTime;
    /**
     * When the job completed.
     */
    completionTime?: CompletionTime;
    /**
     * The job's items.
     */
    items: VariantImportItemDetails;
    /**
     * The job's left normalization setting.
     */
    runLeftNormalization: RunLeftNormalization;
    /**
     *  The annotation schema generated by the parsed annotation data. 
     */
    annotationFields?: AnnotationFieldMap;
  }
  export interface GetVariantStoreRequest {
    /**
     * The store's name.
     */
    name: String;
  }
  export interface GetVariantStoreResponse {
    /**
     * The store's ID.
     */
    id: ResourceId;
    /**
     * The store's genome reference.
     */
    reference: ReferenceItem;
    /**
     * The store's status.
     */
    status: StoreStatus;
    /**
     * The store's ARN.
     */
    storeArn: Arn;
    /**
     * The store's name.
     */
    name: String;
    /**
     * The store's description.
     */
    description: Description;
    /**
     * The store's server-side encryption (SSE) settings.
     */
    sseConfig: SseConfig;
    /**
     * When the store was created.
     */
    creationTime: CreationTime;
    /**
     * When the store was updated.
     */
    updateTime: UpdateTime;
    /**
     * The store's tags.
     */
    tags: TagMap;
    /**
     * The store's status message.
     */
    statusMessage: StatusMessage;
    /**
     * The store's size in bytes.
     */
    storeSizeBytes: Long;
  }
  export interface GetWorkflowRequest {
    /**
     * The workflow's ID.
     */
    id: WorkflowId;
    /**
     * The workflow's type.
     */
    type?: WorkflowType;
    /**
     * The export format for the workflow.
     */
    export?: WorkflowExportList;
  }
  export interface GetWorkflowResponse {
    /**
     * The workflow's ARN.
     */
    arn?: WorkflowArn;
    /**
     * The workflow's ID.
     */
    id?: WorkflowId;
    /**
     * The workflow's status.
     */
    status?: WorkflowStatus;
    /**
     * The workflow's type.
     */
    type?: WorkflowType;
    /**
     * The workflow's name.
     */
    name?: WorkflowName;
    /**
     * The workflow's description.
     */
    description?: WorkflowDescription;
    /**
     * The workflow's engine.
     */
    engine?: WorkflowEngine;
    /**
     * The workflow's definition.
     */
    definition?: WorkflowDefinition;
    /**
     * The path of the main definition file for the workflow.
     */
    main?: WorkflowMain;
    /**
     * The workflow's digest.
     */
    digest?: WorkflowDigest;
    /**
     * The workflow's parameter template.
     */
    parameterTemplate?: WorkflowParameterTemplate;
    /**
     * The workflow's storage capacity in gigabytes.
     */
    storageCapacity?: GetWorkflowResponseStorageCapacityInteger;
    /**
     * When the workflow was created.
     */
    creationTime?: WorkflowTimestamp;
    /**
     * The workflow's status message.
     */
    statusMessage?: WorkflowStatusMessage;
    /**
     * The workflow's tags.
     */
    tags?: TagMap;
    /**
     *  Gets metadata for workflow. 
     */
    metadata?: WorkflowMetadata;
    /**
     *  The computational accelerator specified to run the workflow. 
     */
    accelerators?: Accelerators;
  }
  export type GetWorkflowResponseStorageCapacityInteger = number;
  export type Header = boolean;
  export type ImportJobId = string;
  export interface ImportReadSetFilter {
    /**
     * A status to filter on.
     */
    status?: ReadSetImportJobStatus;
    /**
     * The filter's start date.
     */
    createdAfter?: SyntheticTimestamp_date_time;
    /**
     * The filter's end date.
     */
    createdBefore?: SyntheticTimestamp_date_time;
  }
  export interface ImportReadSetJobItem {
    /**
     * The job's ID.
     */
    id: ImportJobId;
    /**
     * The job's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The job's service role ARN.
     */
    roleArn: RoleArn;
    /**
     * The job's status.
     */
    status: ReadSetImportJobStatus;
    /**
     * When the job was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     * When the job completed.
     */
    completionTime?: SyntheticTimestamp_date_time;
  }
  export type ImportReadSetJobList = ImportReadSetJobItem[];
  export interface ImportReadSetSourceItem {
    /**
     * The source files' location in Amazon S3.
     */
    sourceFiles: SourceFiles;
    /**
     * The source's file type.
     */
    sourceFileType: FileType;
    /**
     * The source's status.
     */
    status: ReadSetImportJobItemStatus;
    /**
     * The source's status message.
     */
    statusMessage?: JobStatusMessage;
    /**
     * The source's subject ID.
     */
    subjectId: SubjectId;
    /**
     * The source's sample ID.
     */
    sampleId: SampleId;
    /**
     * Where the source originated.
     */
    generatedFrom?: GeneratedFrom;
    /**
     * The source's genome reference ARN.
     */
    referenceArn?: ReferenceArn;
    /**
     * The source's name.
     */
    name?: ReadSetName;
    /**
     * The source's description.
     */
    description?: ReadSetDescription;
    /**
     * The source's tags.
     */
    tags?: TagMap;
  }
  export type ImportReadSetSourceList = ImportReadSetSourceItem[];
  export interface ImportReferenceFilter {
    /**
     * A status to filter on.
     */
    status?: ReferenceImportJobStatus;
    /**
     * The filter's start date.
     */
    createdAfter?: SyntheticTimestamp_date_time;
    /**
     * The filter's end date.
     */
    createdBefore?: SyntheticTimestamp_date_time;
  }
  export interface ImportReferenceJobItem {
    /**
     * The job's ID.
     */
    id: ImportJobId;
    /**
     * The job's reference store ID.
     */
    referenceStoreId: ReferenceStoreId;
    /**
     * The job's service role ARN.
     */
    roleArn: RoleArn;
    /**
     * The job's status.
     */
    status: ReferenceImportJobStatus;
    /**
     * When the job was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     * When the job completed.
     */
    completionTime?: SyntheticTimestamp_date_time;
  }
  export type ImportReferenceJobList = ImportReferenceJobItem[];
  export interface ImportReferenceSourceItem {
    /**
     * The source file's location in Amazon S3.
     */
    sourceFile?: S3Uri;
    /**
     * The source's status.
     */
    status: ReferenceImportJobItemStatus;
    /**
     * The source's status message.
     */
    statusMessage?: JobStatusMessage;
    /**
     * The source's name.
     */
    name?: ReferenceName;
    /**
     * The source's description.
     */
    description?: ReferenceDescription;
    /**
     * The source's tags.
     */
    tags?: TagMap;
  }
  export type ImportReferenceSourceList = ImportReferenceSourceItem[];
  export type Integer = number;
  export type JobStatus = "SUBMITTED"|"IN_PROGRESS"|"CANCELLED"|"COMPLETED"|"FAILED"|"COMPLETED_WITH_FAILURES"|string;
  export type JobStatusMessage = string;
  export type JobStatusMsg = string;
  export type LineSep = string;
  export interface ListAnnotationImportJobsFilter {
    /**
     * A status to filter on.
     */
    status?: JobStatus;
    /**
     * A store name to filter on.
     */
    storeName?: String;
  }
  export interface ListAnnotationImportJobsRequest {
    /**
     * The maximum number of jobs to return in one page of results.
     */
    maxResults?: ListAnnotationImportJobsRequestMaxResultsInteger;
    /**
     * IDs of annotation import jobs to retrieve.
     */
    ids?: ListAnnotationImportJobsRequestIdsList;
    /**
     * Specifies the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: ListAnnotationImportJobsRequestNextTokenString;
    /**
     * A filter to apply to the list.
     */
    filter?: ListAnnotationImportJobsFilter;
  }
  export type ListAnnotationImportJobsRequestIdsList = ResourceIdentifier[];
  export type ListAnnotationImportJobsRequestMaxResultsInteger = number;
  export type ListAnnotationImportJobsRequestNextTokenString = string;
  export interface ListAnnotationImportJobsResponse {
    /**
     * A list of jobs.
     */
    annotationImportJobs?: AnnotationImportJobItems;
    /**
     * Specifies the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: String;
  }
  export interface ListAnnotationStoreVersionsFilter {
    /**
     *  The status of an annotation store version. 
     */
    status?: VersionStatus;
  }
  export interface ListAnnotationStoreVersionsRequest {
    /**
     *  The name of an annotation store. 
     */
    name: String;
    /**
     *  The maximum number of annotation store versions to return in one page of results. 
     */
    maxResults?: ListAnnotationStoreVersionsRequestMaxResultsInteger;
    /**
     *  Specifies the pagination token from a previous request to retrieve the next page of results. 
     */
    nextToken?: ListAnnotationStoreVersionsRequestNextTokenString;
    /**
     *  A filter to apply to the list of annotation store versions. 
     */
    filter?: ListAnnotationStoreVersionsFilter;
  }
  export type ListAnnotationStoreVersionsRequestMaxResultsInteger = number;
  export type ListAnnotationStoreVersionsRequestNextTokenString = string;
  export interface ListAnnotationStoreVersionsResponse {
    /**
     *  Lists all versions of an annotation store. 
     */
    annotationStoreVersions?: AnnotationStoreVersionItems;
    /**
     *  Specifies the pagination token from a previous request to retrieve the next page of results. 
     */
    nextToken?: String;
  }
  export interface ListAnnotationStoresFilter {
    /**
     * A status to filter on.
     */
    status?: StoreStatus;
  }
  export interface ListAnnotationStoresRequest {
    /**
     * IDs of stores to list.
     */
    ids?: ListAnnotationStoresRequestIdsList;
    /**
     * The maximum number of stores to return in one page of results.
     */
    maxResults?: ListAnnotationStoresRequestMaxResultsInteger;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: ListAnnotationStoresRequestNextTokenString;
    /**
     * A filter to apply to the list.
     */
    filter?: ListAnnotationStoresFilter;
  }
  export type ListAnnotationStoresRequestIdsList = ResourceIdentifier[];
  export type ListAnnotationStoresRequestMaxResultsInteger = number;
  export type ListAnnotationStoresRequestNextTokenString = string;
  export interface ListAnnotationStoresResponse {
    /**
     * A list of stores.
     */
    annotationStores?: AnnotationStoreItems;
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: String;
  }
  export interface ListMultipartReadSetUploadsRequest {
    /**
     *  The Sequence Store ID used for the multipart uploads. 
     */
    sequenceStoreId: SequenceStoreId;
    /**
     *  The maximum number of multipart uploads returned in a page. 
     */
    maxResults?: ListMultipartReadSetUploadsRequestMaxResultsInteger;
    /**
     *  Next token returned in the response of a previous ListMultipartReadSetUploads call. Used to get the next page of results. 
     */
    nextToken?: NextToken;
  }
  export type ListMultipartReadSetUploadsRequestMaxResultsInteger = number;
  export interface ListMultipartReadSetUploadsResponse {
    /**
     *  Next token returned in the response of a previous ListMultipartReadSetUploads call. Used to get the next page of results. 
     */
    nextToken?: NextToken;
    /**
     *  An array of multipart uploads. 
     */
    uploads?: MultipartReadSetUploadList;
  }
  export interface ListReadSetActivationJobsRequest {
    /**
     * The read set's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The maximum number of read set activation jobs to return in one page of results.
     */
    maxResults?: ListReadSetActivationJobsRequestMaxResultsInteger;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: NextToken;
    /**
     * A filter to apply to the list.
     */
    filter?: ActivateReadSetFilter;
  }
  export type ListReadSetActivationJobsRequestMaxResultsInteger = number;
  export interface ListReadSetActivationJobsResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: NextToken;
    /**
     * A list of jobs.
     */
    activationJobs?: ActivateReadSetJobList;
  }
  export interface ListReadSetExportJobsRequest {
    /**
     * The jobs' sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The maximum number of jobs to return in one page of results.
     */
    maxResults?: ListReadSetExportJobsRequestMaxResultsInteger;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: NextToken;
    /**
     * A filter to apply to the list.
     */
    filter?: ExportReadSetFilter;
  }
  export type ListReadSetExportJobsRequestMaxResultsInteger = number;
  export interface ListReadSetExportJobsResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: NextToken;
    /**
     * A list of jobs.
     */
    exportJobs?: ExportReadSetJobDetailList;
  }
  export interface ListReadSetImportJobsRequest {
    /**
     * The maximum number of jobs to return in one page of results.
     */
    maxResults?: ListReadSetImportJobsRequestMaxResultsInteger;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The jobs' sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * A filter to apply to the list.
     */
    filter?: ImportReadSetFilter;
  }
  export type ListReadSetImportJobsRequestMaxResultsInteger = number;
  export interface ListReadSetImportJobsResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: NextToken;
    /**
     * A list of jobs.
     */
    importJobs?: ImportReadSetJobList;
  }
  export interface ListReadSetUploadPartsRequest {
    /**
     *  The Sequence Store ID used for the multipart uploads. 
     */
    sequenceStoreId: SequenceStoreId;
    /**
     *  The ID for the initiated multipart upload. 
     */
    uploadId: UploadId;
    /**
     *  The source file for the upload part. 
     */
    partSource: ReadSetPartSource;
    /**
     *  The maximum number of read set upload parts returned in a page. 
     */
    maxResults?: ListReadSetUploadPartsRequestMaxResultsInteger;
    /**
     *  Next token returned in the response of a previous ListReadSetUploadPartsRequest call. Used to get the next page of results. 
     */
    nextToken?: NextToken;
    /**
     *  Attributes used to filter for a specific subset of read set part uploads. 
     */
    filter?: ReadSetUploadPartListFilter;
  }
  export type ListReadSetUploadPartsRequestMaxResultsInteger = number;
  export interface ListReadSetUploadPartsResponse {
    /**
     *  Next token returned in the response of a previous ListReadSetUploadParts call. Used to get the next page of results. 
     */
    nextToken?: NextToken;
    /**
     *  An array of upload parts. 
     */
    parts?: ReadSetUploadPartList;
  }
  export interface ListReadSetsRequest {
    /**
     * The jobs' sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The maximum number of read sets to return in one page of results.
     */
    maxResults?: ListReadSetsRequestMaxResultsInteger;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: NextToken;
    /**
     * A filter to apply to the list.
     */
    filter?: ReadSetFilter;
  }
  export type ListReadSetsRequestMaxResultsInteger = number;
  export interface ListReadSetsResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: NextToken;
    /**
     * A list of read sets.
     */
    readSets: ReadSetList;
  }
  export interface ListReferenceImportJobsRequest {
    /**
     * The maximum number of jobs to return in one page of results.
     */
    maxResults?: ListReferenceImportJobsRequestMaxResultsInteger;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The job's reference store ID.
     */
    referenceStoreId: ReferenceStoreId;
    /**
     * A filter to apply to the list.
     */
    filter?: ImportReferenceFilter;
  }
  export type ListReferenceImportJobsRequestMaxResultsInteger = number;
  export interface ListReferenceImportJobsResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: NextToken;
    /**
     * A lis of jobs.
     */
    importJobs?: ImportReferenceJobList;
  }
  export interface ListReferenceStoresRequest {
    /**
     * The maximum number of stores to return in one page of results.
     */
    maxResults?: ListReferenceStoresRequestMaxResultsInteger;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: NextToken;
    /**
     * A filter to apply to the list.
     */
    filter?: ReferenceStoreFilter;
  }
  export type ListReferenceStoresRequestMaxResultsInteger = number;
  export interface ListReferenceStoresResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: NextToken;
    /**
     * A list of reference stores.
     */
    referenceStores: ReferenceStoreDetailList;
  }
  export interface ListReferencesRequest {
    /**
     * The references' reference store ID.
     */
    referenceStoreId: ReferenceStoreId;
    /**
     * The maximum number of references to return in one page of results.
     */
    maxResults?: ListReferencesRequestMaxResultsInteger;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: NextToken;
    /**
     * A filter to apply to the list.
     */
    filter?: ReferenceFilter;
  }
  export type ListReferencesRequestMaxResultsInteger = number;
  export interface ListReferencesResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: NextToken;
    /**
     * A list of references.
     */
    references: ReferenceList;
  }
  export interface ListRunGroupsRequest {
    /**
     * The run groups' name.
     */
    name?: RunGroupName;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    startingToken?: RunGroupListToken;
    /**
     * The maximum number of run groups to return in one page of results.
     */
    maxResults?: ListRunGroupsRequestMaxResultsInteger;
  }
  export type ListRunGroupsRequestMaxResultsInteger = number;
  export interface ListRunGroupsResponse {
    /**
     * A list of groups.
     */
    items?: RunGroupList;
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: RunGroupListToken;
  }
  export interface ListRunTasksRequest {
    /**
     * The run's ID.
     */
    id: RunId;
    /**
     * Filter the list by status.
     */
    status?: TaskStatus;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    startingToken?: TaskListToken;
    /**
     * The maximum number of run tasks to return in one page of results.
     */
    maxResults?: ListRunTasksRequestMaxResultsInteger;
  }
  export type ListRunTasksRequestMaxResultsInteger = number;
  export interface ListRunTasksResponse {
    /**
     * A list of tasks.
     */
    items?: TaskList;
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: TaskListToken;
  }
  export interface ListRunsRequest {
    /**
     * Filter the list by run name.
     */
    name?: RunName;
    /**
     * Filter the list by run group ID.
     */
    runGroupId?: RunGroupId;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    startingToken?: RunListToken;
    /**
     * The maximum number of runs to return in one page of results.
     */
    maxResults?: ListRunsRequestMaxResultsInteger;
    /**
     *  The status of a run. 
     */
    status?: RunStatus;
  }
  export type ListRunsRequestMaxResultsInteger = number;
  export interface ListRunsResponse {
    /**
     * A list of runs.
     */
    items?: RunList;
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: RunListToken;
  }
  export interface ListSequenceStoresRequest {
    /**
     * The maximum number of stores to return in one page of results.
     */
    maxResults?: ListSequenceStoresRequestMaxResultsInteger;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: NextToken;
    /**
     * A filter to apply to the list.
     */
    filter?: SequenceStoreFilter;
  }
  export type ListSequenceStoresRequestMaxResultsInteger = number;
  export interface ListSequenceStoresResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: NextToken;
    /**
     * A list of sequence stores.
     */
    sequenceStores: SequenceStoreDetailList;
  }
  export interface ListSharesRequest {
    /**
     *  The account that owns the analytics store shared. 
     */
    resourceOwner: ResourceOwner;
    /**
     *  Attributes used to filter for a specific subset of shares. 
     */
    filter?: Filter;
    /**
     *  Next token returned in the response of a previous ListReadSetUploadPartsRequest call. Used to get the next page of results. 
     */
    nextToken?: String;
    /**
     *  The maximum number of shares to return in one page of results. 
     */
    maxResults?: Integer;
  }
  export interface ListSharesResponse {
    /**
     *  The shares available and their meta details. 
     */
    shares: ShareDetailsList;
    /**
     *  Next token returned in the response of a previous ListSharesResponse call. Used to get the next page of results. 
     */
    nextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The resource's ARN.
     */
    resourceArn: TagArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of tags.
     */
    tags: TagMap;
  }
  export interface ListVariantImportJobsFilter {
    /**
     * A status to filter on.
     */
    status?: JobStatus;
    /**
     * A store name to filter on.
     */
    storeName?: String;
  }
  export interface ListVariantImportJobsRequest {
    /**
     * The maximum number of import jobs to return in one page of results.
     */
    maxResults?: ListVariantImportJobsRequestMaxResultsInteger;
    /**
     * A list of job IDs.
     */
    ids?: ListVariantImportJobsRequestIdsList;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: ListVariantImportJobsRequestNextTokenString;
    /**
     * A filter to apply to the list.
     */
    filter?: ListVariantImportJobsFilter;
  }
  export type ListVariantImportJobsRequestIdsList = ResourceIdentifier[];
  export type ListVariantImportJobsRequestMaxResultsInteger = number;
  export type ListVariantImportJobsRequestNextTokenString = string;
  export interface ListVariantImportJobsResponse {
    /**
     * A list of jobs.
     */
    variantImportJobs?: VariantImportJobItems;
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: String;
  }
  export interface ListVariantStoresFilter {
    /**
     * A status to filter on.
     */
    status?: StoreStatus;
  }
  export interface ListVariantStoresRequest {
    /**
     * The maximum number of stores to return in one page of results.
     */
    maxResults?: ListVariantStoresRequestMaxResultsInteger;
    /**
     * A list of store IDs.
     */
    ids?: ListVariantStoresRequestIdsList;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: ListVariantStoresRequestNextTokenString;
    /**
     * A filter to apply to the list.
     */
    filter?: ListVariantStoresFilter;
  }
  export type ListVariantStoresRequestIdsList = ResourceIdentifier[];
  export type ListVariantStoresRequestMaxResultsInteger = number;
  export type ListVariantStoresRequestNextTokenString = string;
  export interface ListVariantStoresResponse {
    /**
     * A list of variant stores.
     */
    variantStores?: VariantStoreItems;
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: String;
  }
  export interface ListWorkflowsRequest {
    /**
     * The workflows' type.
     */
    type?: WorkflowType;
    /**
     * The workflows' name.
     */
    name?: WorkflowName;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    startingToken?: WorkflowListToken;
    /**
     * The maximum number of workflows to return in one page of results.
     */
    maxResults?: ListWorkflowsRequestMaxResultsInteger;
  }
  export type ListWorkflowsRequestMaxResultsInteger = number;
  export interface ListWorkflowsResponse {
    /**
     * The workflows' items.
     */
    items?: WorkflowList;
    /**
     * A pagination token that's included if more results are available.
     */
    nextToken?: WorkflowListToken;
  }
  export type Long = number;
  export type Md5 = string;
  export type MultipartReadSetUploadList = MultipartReadSetUploadListItem[];
  export interface MultipartReadSetUploadListItem {
    /**
     *  The sequence store ID used for the multipart upload. 
     */
    sequenceStoreId: SequenceStoreId;
    /**
     *  The ID for the initiated multipart upload. 
     */
    uploadId: UploadId;
    /**
     *  The type of file the read set originated from. 
     */
    sourceFileType: FileType;
    /**
     *  The read set source's subject ID. 
     */
    subjectId: SubjectId;
    /**
     *  The read set source's sample ID. 
     */
    sampleId: SampleId;
    /**
     *  The source of an uploaded part. 
     */
    generatedFrom: GeneratedFrom;
    /**
     *  The source's reference ARN. 
     */
    referenceArn: ReferenceArn;
    /**
     *  The name of a read set. 
     */
    name?: ReadSetName;
    /**
     *  The description of a read set. 
     */
    description?: ReadSetDescription;
    /**
     *  Any tags you wish to add to a read set. 
     */
    tags?: TagMap;
    /**
     *  The time stamp for when a direct upload was created. 
     */
    creationTime: SyntheticTimestamp_date_time;
  }
  export type NextToken = string;
  export type PrimitiveBoolean = boolean;
  export type Quote = string;
  export type QuoteAll = boolean;
  export type Range = string;
  export interface ReadOptions {
    /**
     * The file's field separator.
     */
    sep?: Separator;
    /**
     * The file's encoding.
     */
    encoding?: Encoding;
    /**
     * The file's quote character.
     */
    quote?: Quote;
    /**
     * Whether all values need to be quoted, or just those that contain quotes.
     */
    quoteAll?: QuoteAll;
    /**
     * A character for escaping quotes in the file.
     */
    escape?: EscapeChar;
    /**
     * Whether quotes need to be escaped in the file.
     */
    escapeQuotes?: EscapeQuotes;
    /**
     * The file's comment character.
     */
    comment?: CommentChar;
    /**
     * Whether the file has a header row.
     */
    header?: Header;
    /**
     * A line separator for the file.
     */
    lineSep?: LineSep;
  }
  export type ReadSetActivationJobItemStatus = "NOT_STARTED"|"IN_PROGRESS"|"FINISHED"|"FAILED"|string;
  export type ReadSetActivationJobStatus = "SUBMITTED"|"IN_PROGRESS"|"CANCELLING"|"CANCELLED"|"FAILED"|"COMPLETED"|"COMPLETED_WITH_FAILURES"|string;
  export type ReadSetArn = string;
  export interface ReadSetBatchError {
    /**
     * The error's ID.
     */
    id: ReadSetId;
    /**
     * The error's code.
     */
    code: String;
    /**
     * The error's message.
     */
    message: String;
  }
  export type ReadSetBatchErrorList = ReadSetBatchError[];
  export type ReadSetDescription = string;
  export type ReadSetExportJobItemStatus = "NOT_STARTED"|"IN_PROGRESS"|"FINISHED"|"FAILED"|string;
  export type ReadSetExportJobStatus = "SUBMITTED"|"IN_PROGRESS"|"CANCELLING"|"CANCELLED"|"FAILED"|"COMPLETED"|"COMPLETED_WITH_FAILURES"|string;
  export type ReadSetFile = "SOURCE1"|"SOURCE2"|"INDEX"|string;
  export interface ReadSetFiles {
    /**
     * The location of the first file in Amazon S3.
     */
    source1?: FileInformation;
    /**
     * The location of the second file in Amazon S3.
     */
    source2?: FileInformation;
    /**
     * The files' index.
     */
    index?: FileInformation;
  }
  export interface ReadSetFilter {
    /**
     * A name to filter on.
     */
    name?: ReadSetName;
    /**
     * A status to filter on.
     */
    status?: ReadSetStatus;
    /**
     * A genome reference ARN to filter on.
     */
    referenceArn?: ReferenceArn;
    /**
     * The filter's start date.
     */
    createdAfter?: SyntheticTimestamp_date_time;
    /**
     * The filter's end date.
     */
    createdBefore?: SyntheticTimestamp_date_time;
    /**
     *  The read set source's sample ID. 
     */
    sampleId?: SampleId;
    /**
     *  The read set source's subject ID. 
     */
    subjectId?: SubjectId;
    /**
     *  Where the source originated. 
     */
    generatedFrom?: GeneratedFrom;
    /**
     *  The creation type of the read set. 
     */
    creationType?: CreationType;
  }
  export type ReadSetId = string;
  export type ReadSetIdList = ReadSetId[];
  export type ReadSetImportJobItemStatus = "NOT_STARTED"|"IN_PROGRESS"|"FINISHED"|"FAILED"|string;
  export type ReadSetImportJobStatus = "SUBMITTED"|"IN_PROGRESS"|"CANCELLING"|"CANCELLED"|"FAILED"|"COMPLETED"|"COMPLETED_WITH_FAILURES"|string;
  export type ReadSetList = ReadSetListItem[];
  export interface ReadSetListItem {
    /**
     * The read set's ID.
     */
    id: ReadSetId;
    /**
     * The read set's ARN.
     */
    arn: ReadSetArn;
    /**
     * The read set's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The read set's subject ID.
     */
    subjectId?: SubjectId;
    /**
     * The read set's sample ID.
     */
    sampleId?: SampleId;
    /**
     * The read set's status.
     */
    status: ReadSetStatus;
    /**
     * The read set's name.
     */
    name?: ReadSetName;
    /**
     * The read set's description.
     */
    description?: ReadSetDescription;
    /**
     * The read set's genome reference ARN.
     */
    referenceArn?: ReferenceArn;
    /**
     * The read set's file type.
     */
    fileType: FileType;
    sequenceInformation?: SequenceInformation;
    /**
     * When the read set was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     *  The status for a read set. It provides more detail as to why the read set has a status. 
     */
    statusMessage?: ReadSetStatusMessage;
    /**
     *  The creation type of the read set. 
     */
    creationType?: CreationType;
    /**
     *  The entity tag (ETag) is a hash of the object representing its semantic content. 
     */
    etag?: ETag;
  }
  export type ReadSetName = string;
  export type ReadSetPartSource = "SOURCE1"|"SOURCE2"|string;
  export type ReadSetPartStreamingBlob = Buffer|Uint8Array|Blob|string|Readable;
  export type ReadSetStatus = "ARCHIVED"|"ACTIVATING"|"ACTIVE"|"DELETING"|"DELETED"|"PROCESSING_UPLOAD"|"UPLOAD_FAILED"|string;
  export type ReadSetStatusMessage = string;
  export type ReadSetStreamingBlob = Buffer|Uint8Array|Blob|string|Readable;
  export type ReadSetUploadPartList = ReadSetUploadPartListItem[];
  export interface ReadSetUploadPartListFilter {
    /**
     *  Filters for read set uploads after a specified time. 
     */
    createdAfter?: SyntheticTimestamp_date_time;
    /**
     *  Filters for read set part uploads before a specified time. 
     */
    createdBefore?: SyntheticTimestamp_date_time;
  }
  export interface ReadSetUploadPartListItem {
    /**
     *  The number identifying the part in an upload. 
     */
    partNumber: ReadSetUploadPartListItemPartNumberInteger;
    /**
     *  The size of the the part in an upload. 
     */
    partSize: ReadSetUploadPartListItemPartSizeLong;
    /**
     *  The origin of the part being direct uploaded. 
     */
    partSource: ReadSetPartSource;
    /**
     *  A unique identifier used to confirm that parts are being added to the correct upload. 
     */
    checksum: String;
    /**
     *  The time stamp for when a direct upload was created. 
     */
    creationTime?: SyntheticTimestamp_date_time;
    /**
     *  The time stamp for the most recent update to an uploaded part. 
     */
    lastUpdatedTime?: SyntheticTimestamp_date_time;
  }
  export type ReadSetUploadPartListItemPartNumberInteger = number;
  export type ReadSetUploadPartListItemPartSizeLong = number;
  export type ReferenceArn = string;
  export type ReferenceDescription = string;
  export type ReferenceFile = "SOURCE"|"INDEX"|string;
  export interface ReferenceFiles {
    /**
     * The source file's location in Amazon S3.
     */
    source?: FileInformation;
    /**
     * The files' index.
     */
    index?: FileInformation;
  }
  export interface ReferenceFilter {
    /**
     * A name to filter on.
     */
    name?: ReferenceName;
    /**
     * An MD5 checksum to filter on.
     */
    md5?: Md5;
    /**
     * The filter's start date.
     */
    createdAfter?: SyntheticTimestamp_date_time;
    /**
     * The filter's end date.
     */
    createdBefore?: SyntheticTimestamp_date_time;
  }
  export type ReferenceId = string;
  export type ReferenceImportJobItemStatus = "NOT_STARTED"|"IN_PROGRESS"|"FINISHED"|"FAILED"|string;
  export type ReferenceImportJobStatus = "SUBMITTED"|"IN_PROGRESS"|"CANCELLING"|"CANCELLED"|"FAILED"|"COMPLETED"|"COMPLETED_WITH_FAILURES"|string;
  export interface ReferenceItem {
    /**
     * The reference's ARN.
     */
    referenceArn?: ReferenceArn;
  }
  export type ReferenceList = ReferenceListItem[];
  export interface ReferenceListItem {
    /**
     * The reference's ID.
     */
    id: ReferenceId;
    /**
     * The reference's ARN.
     */
    arn: ReferenceArn;
    /**
     * The reference's store ID.
     */
    referenceStoreId: ReferenceStoreId;
    /**
     * The reference's MD5 checksum.
     */
    md5: Md5;
    /**
     * The reference's status.
     */
    status?: ReferenceStatus;
    /**
     * The reference's name.
     */
    name?: ReferenceName;
    /**
     * The reference's description.
     */
    description?: ReferenceDescription;
    /**
     * When the reference was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     * When the reference was updated.
     */
    updateTime: SyntheticTimestamp_date_time;
  }
  export type ReferenceName = string;
  export type ReferenceStatus = "ACTIVE"|"DELETING"|"DELETED"|string;
  export type ReferenceStoreArn = string;
  export type ReferenceStoreDescription = string;
  export interface ReferenceStoreDetail {
    /**
     * The store's ARN.
     */
    arn: ReferenceStoreArn;
    /**
     * The store's ID.
     */
    id: ReferenceStoreId;
    /**
     * The store's name.
     */
    name?: ReferenceStoreName;
    /**
     * The store's description.
     */
    description?: ReferenceStoreDescription;
    /**
     * The store's server-side encryption (SSE) settings.
     */
    sseConfig?: SseConfig;
    /**
     * When the store was created.
     */
    creationTime: SyntheticTimestamp_date_time;
  }
  export type ReferenceStoreDetailList = ReferenceStoreDetail[];
  export interface ReferenceStoreFilter {
    /**
     * The name to filter on.
     */
    name?: ReferenceStoreName;
    /**
     * The filter's start date.
     */
    createdAfter?: SyntheticTimestamp_date_time;
    /**
     * The filter's end date.
     */
    createdBefore?: SyntheticTimestamp_date_time;
  }
  export type ReferenceStoreId = string;
  export type ReferenceStoreName = string;
  export type ReferenceStreamingBlob = Buffer|Uint8Array|Blob|string|Readable;
  export type ResourceId = string;
  export type ResourceIdentifier = string;
  export type ResourceOwner = "SELF"|"OTHER"|string;
  export type RoleArn = string;
  export type RunArn = string;
  export type RunExport = "DEFINITION"|string;
  export type RunExportList = RunExport[];
  export type RunGroupArn = string;
  export type RunGroupId = string;
  export type RunGroupList = RunGroupListItem[];
  export interface RunGroupListItem {
    /**
     * The group's ARN.
     */
    arn?: RunGroupArn;
    /**
     * The group's ID.
     */
    id?: RunGroupId;
    /**
     * The group's name.
     */
    name?: RunGroupName;
    /**
     * The group's maximum CPU count setting.
     */
    maxCpus?: RunGroupListItemMaxCpusInteger;
    /**
     * The group's maximum concurrent run setting.
     */
    maxRuns?: RunGroupListItemMaxRunsInteger;
    /**
     * The group's maximum duration setting in minutes.
     */
    maxDuration?: RunGroupListItemMaxDurationInteger;
    /**
     * When the group was created.
     */
    creationTime?: RunGroupTimestamp;
    /**
     *  The maximum GPUs that can be used by a run group. 
     */
    maxGpus?: RunGroupListItemMaxGpusInteger;
  }
  export type RunGroupListItemMaxCpusInteger = number;
  export type RunGroupListItemMaxDurationInteger = number;
  export type RunGroupListItemMaxGpusInteger = number;
  export type RunGroupListItemMaxRunsInteger = number;
  export type RunGroupListToken = string;
  export type RunGroupName = string;
  export type RunGroupRequestId = string;
  export type RunGroupTimestamp = Date;
  export type RunId = string;
  export type RunLeftNormalization = boolean;
  export type RunList = RunListItem[];
  export interface RunListItem {
    /**
     * The run's ARN.
     */
    arn?: RunArn;
    /**
     * The run's ID.
     */
    id?: RunId;
    /**
     * The run's status.
     */
    status?: RunStatus;
    /**
     * The run's workflow ID.
     */
    workflowId?: WorkflowId;
    /**
     * The run's name.
     */
    name?: RunName;
    /**
     * The run's priority.
     */
    priority?: RunListItemPriorityInteger;
    /**
     * The run's storage capacity.
     */
    storageCapacity?: RunListItemStorageCapacityInteger;
    /**
     * When the run was created.
     */
    creationTime?: RunTimestamp;
    /**
     * When the run started.
     */
    startTime?: RunTimestamp;
    /**
     * When the run stopped.
     */
    stopTime?: RunTimestamp;
  }
  export type RunListItemPriorityInteger = number;
  export type RunListItemStorageCapacityInteger = number;
  export type RunListToken = string;
  export type RunLogLevel = "OFF"|"FATAL"|"ERROR"|"ALL"|string;
  export type RunName = string;
  export type RunOutputUri = string;
  export interface RunParameters {
  }
  export type RunRequestId = string;
  export type RunResourceDigest = string;
  export type RunResourceDigestKey = string;
  export type RunResourceDigests = {[key: string]: RunResourceDigest};
  export type RunRetentionMode = "RETAIN"|"REMOVE"|string;
  export type RunRoleArn = string;
  export type RunStartedBy = string;
  export type RunStatus = "PENDING"|"STARTING"|"RUNNING"|"STOPPING"|"COMPLETED"|"DELETED"|"CANCELLED"|"FAILED"|string;
  export type RunStatusMessage = string;
  export type RunTimestamp = Date;
  export type S3Destination = string;
  export type S3Uri = string;
  export type SampleId = string;
  export type SchemaItem = {[key: string]: SchemaValueType};
  export type SchemaItemKeyString = string;
  export type SchemaValueType = "LONG"|"INT"|"STRING"|"FLOAT"|"DOUBLE"|"BOOLEAN"|string;
  export type Separator = string;
  export interface SequenceInformation {
    /**
     * The sequence's total read count.
     */
    totalReadCount?: Long;
    /**
     * The sequence's total base count.
     */
    totalBaseCount?: Long;
    /**
     * Where the sequence originated.
     */
    generatedFrom?: GeneratedFrom;
    /**
     * The sequence's alignment setting.
     */
    alignment?: String;
  }
  export type SequenceStoreArn = string;
  export type SequenceStoreDescription = string;
  export interface SequenceStoreDetail {
    /**
     * The store's ARN.
     */
    arn: SequenceStoreArn;
    /**
     * The store's ID.
     */
    id: SequenceStoreId;
    /**
     * The store's name.
     */
    name?: SequenceStoreName;
    /**
     * The store's description.
     */
    description?: SequenceStoreDescription;
    /**
     * The store's server-side encryption (SSE) settings.
     */
    sseConfig?: SseConfig;
    /**
     * When the store was created.
     */
    creationTime: SyntheticTimestamp_date_time;
    /**
     *  An S3 location that is used to store files that have failed a direct upload. 
     */
    fallbackLocation?: S3Destination;
  }
  export type SequenceStoreDetailList = SequenceStoreDetail[];
  export interface SequenceStoreFilter {
    /**
     * A name to filter on.
     */
    name?: SequenceStoreName;
    /**
     * The filter's start date.
     */
    createdAfter?: SyntheticTimestamp_date_time;
    /**
     * The filter's end date.
     */
    createdBefore?: SyntheticTimestamp_date_time;
  }
  export type SequenceStoreId = string;
  export type SequenceStoreName = string;
  export interface ShareDetails {
    /**
     *  The ID for a share offer for an analytics store . 
     */
    shareId?: String;
    /**
     *  The resource Arn of the analytics store being shared. 
     */
    resourceArn?: String;
    /**
     *  The principal subscriber is the account the analytics store data is being shared with. 
     */
    principalSubscriber?: String;
    /**
     *  The account ID for the data owner. The owner creates the share offer. 
     */
    ownerId?: String;
    /**
     *  The status of a share. 
     */
    status?: ShareStatus;
    /**
     *  The status message for a share. It provides more details on the status of the share. 
     */
    statusMessage?: StatusMessage;
    /**
     *  The name of the share. 
     */
    shareName?: ShareName;
    /**
     *  The timestamp for when the share was created. 
     */
    creationTime?: CreationTime;
    /**
     *  The timestamp of the share update. 
     */
    updateTime?: UpdateTime;
  }
  export type ShareDetailsList = ShareDetails[];
  export type ShareName = string;
  export type ShareStatus = "PENDING"|"ACTIVATING"|"ACTIVE"|"DELETING"|"DELETED"|"FAILED"|string;
  export interface SourceFiles {
    /**
     * The location of the first file in Amazon S3.
     */
    source1: S3Uri;
    /**
     * The location of the second file in Amazon S3.
     */
    source2?: S3Uri;
  }
  export interface SseConfig {
    /**
     * The encryption type.
     */
    type: EncryptionType;
    /**
     * An encryption key ARN.
     */
    keyArn?: SseConfigKeyArnString;
  }
  export type SseConfigKeyArnString = string;
  export interface StartAnnotationImportRequest {
    /**
     * A destination annotation store for the job.
     */
    destinationName: StoreName;
    /**
     * A service role for the job.
     */
    roleArn: Arn;
    /**
     * Items to import.
     */
    items: AnnotationImportItemSources;
    /**
     *  The name of the annotation store version. 
     */
    versionName?: VersionName;
    /**
     * Formatting options for the annotation file.
     */
    formatOptions?: FormatOptions;
    /**
     * The job's left normalization setting.
     */
    runLeftNormalization?: RunLeftNormalization;
    /**
     *  The annotation schema generated by the parsed annotation data. 
     */
    annotationFields?: AnnotationFieldMap;
  }
  export interface StartAnnotationImportResponse {
    /**
     * The job's ID.
     */
    jobId: ResourceId;
  }
  export interface StartReadSetActivationJobRequest {
    /**
     * The read set's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * To ensure that jobs don't run multiple times, specify a unique token for each job.
     */
    clientToken?: ClientToken;
    /**
     * The job's source files.
     */
    sources: StartReadSetActivationJobRequestSourcesList;
  }
  export type StartReadSetActivationJobRequestSourcesList = StartReadSetActivationJobSourceItem[];
  export interface StartReadSetActivationJobResponse {
    /**
     * The job's ID.
     */
    id: ActivationJobId;
    /**
     * The read set's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The job's status.
     */
    status: ReadSetActivationJobStatus;
    /**
     * When the job was created.
     */
    creationTime: SyntheticTimestamp_date_time;
  }
  export interface StartReadSetActivationJobSourceItem {
    /**
     * The source's read set ID.
     */
    readSetId: ReadSetId;
  }
  export interface StartReadSetExportJobRequest {
    /**
     * The read set's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * A location for exported files in Amazon S3.
     */
    destination: S3Destination;
    /**
     * A service role for the job.
     */
    roleArn: RoleArn;
    /**
     * To ensure that jobs don't run multiple times, specify a unique token for each job.
     */
    clientToken?: ClientToken;
    /**
     * The job's source files.
     */
    sources: StartReadSetExportJobRequestSourcesList;
  }
  export type StartReadSetExportJobRequestSourcesList = ExportReadSet[];
  export interface StartReadSetExportJobResponse {
    /**
     * The job's ID.
     */
    id: ExportJobId;
    /**
     * The read set's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The job's output location.
     */
    destination: S3Destination;
    /**
     * The job's status.
     */
    status: ReadSetExportJobStatus;
    /**
     * When the job was created.
     */
    creationTime: SyntheticTimestamp_date_time;
  }
  export interface StartReadSetImportJobRequest {
    /**
     * The read set's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * A service role for the job.
     */
    roleArn: RoleArn;
    /**
     * To ensure that jobs don't run multiple times, specify a unique token for each job.
     */
    clientToken?: ClientToken;
    /**
     * The job's source files.
     */
    sources: StartReadSetImportJobRequestSourcesList;
  }
  export type StartReadSetImportJobRequestSourcesList = StartReadSetImportJobSourceItem[];
  export interface StartReadSetImportJobResponse {
    /**
     * The job's ID.
     */
    id: ImportJobId;
    /**
     * The read set's sequence store ID.
     */
    sequenceStoreId: SequenceStoreId;
    /**
     * The job's service role ARN.
     */
    roleArn: RoleArn;
    /**
     * The job's status.
     */
    status: ReadSetImportJobStatus;
    /**
     * When the job was created.
     */
    creationTime: SyntheticTimestamp_date_time;
  }
  export interface StartReadSetImportJobSourceItem {
    /**
     * The source files' location in Amazon S3.
     */
    sourceFiles: SourceFiles;
    /**
     * The source's file type.
     */
    sourceFileType: FileType;
    /**
     * The source's subject ID.
     */
    subjectId: SubjectId;
    /**
     * The source's sample ID.
     */
    sampleId: SampleId;
    /**
     * Where the source originated.
     */
    generatedFrom?: GeneratedFrom;
    /**
     * The source's reference ARN.
     */
    referenceArn: ReferenceArn;
    /**
     * The source's name.
     */
    name?: ReadSetName;
    /**
     * The source's description.
     */
    description?: ReadSetDescription;
    /**
     * The source's tags.
     */
    tags?: TagMap;
  }
  export interface StartReferenceImportJobRequest {
    /**
     * The job's reference store ID.
     */
    referenceStoreId: ReferenceStoreId;
    /**
     * A service role for the job.
     */
    roleArn: RoleArn;
    /**
     * To ensure that jobs don't run multiple times, specify a unique token for each job.
     */
    clientToken?: ClientToken;
    /**
     * The job's source files.
     */
    sources: StartReferenceImportJobRequestSourcesList;
  }
  export type StartReferenceImportJobRequestSourcesList = StartReferenceImportJobSourceItem[];
  export interface StartReferenceImportJobResponse {
    /**
     * The job's ID.
     */
    id: ImportJobId;
    /**
     * The job's reference store ID.
     */
    referenceStoreId: ReferenceStoreId;
    /**
     * The job's service role ARN.
     */
    roleArn: RoleArn;
    /**
     * The job's status.
     */
    status: ReferenceImportJobStatus;
    /**
     * When the job was created.
     */
    creationTime: SyntheticTimestamp_date_time;
  }
  export interface StartReferenceImportJobSourceItem {
    /**
     * The source file's location in Amazon S3.
     */
    sourceFile: S3Uri;
    /**
     * The source's name.
     */
    name: ReferenceName;
    /**
     * The source's description.
     */
    description?: ReferenceDescription;
    /**
     * The source's tags.
     */
    tags?: TagMap;
  }
  export interface StartRunRequest {
    /**
     * The run's workflow ID.
     */
    workflowId?: WorkflowId;
    /**
     * The run's workflow type.
     */
    workflowType?: WorkflowType;
    /**
     * The ID of a run to duplicate.
     */
    runId?: RunId;
    /**
     * A service role for the run.
     */
    roleArn: RunRoleArn;
    /**
     * A name for the run.
     */
    name?: RunName;
    /**
     * The run's group ID.
     */
    runGroupId?: RunGroupId;
    /**
     * A priority for the run.
     */
    priority?: StartRunRequestPriorityInteger;
    /**
     * Parameters for the run.
     */
    parameters?: RunParameters;
    /**
     * A storage capacity for the run in gigabytes.
     */
    storageCapacity?: StartRunRequestStorageCapacityInteger;
    /**
     * An output URI for the run.
     */
    outputUri?: RunOutputUri;
    /**
     * A log level for the run.
     */
    logLevel?: RunLogLevel;
    /**
     * Tags for the run.
     */
    tags?: TagMap;
    /**
     * To ensure that requests don't run multiple times, specify a unique ID for each request.
     */
    requestId: RunRequestId;
    /**
     * The retention mode for the run.
     */
    retentionMode?: RunRetentionMode;
  }
  export type StartRunRequestPriorityInteger = number;
  export type StartRunRequestStorageCapacityInteger = number;
  export interface StartRunResponse {
    /**
     * The run's ARN.
     */
    arn?: RunArn;
    /**
     * The run's ID.
     */
    id?: RunId;
    /**
     * The run's status.
     */
    status?: RunStatus;
    /**
     * The run's tags.
     */
    tags?: TagMap;
  }
  export interface StartVariantImportRequest {
    /**
     * The destination variant store for the job.
     */
    destinationName: StoreName;
    /**
     * A service role for the job.
     */
    roleArn: Arn;
    /**
     * Items to import.
     */
    items: VariantImportItemSources;
    /**
     * The job's left normalization setting.
     */
    runLeftNormalization?: RunLeftNormalization;
    /**
     *  The annotation schema generated by the parsed annotation data. 
     */
    annotationFields?: AnnotationFieldMap;
  }
  export interface StartVariantImportResponse {
    /**
     * The job's ID.
     */
    jobId: ResourceId;
  }
  export type StatusList = ShareStatus[];
  export type StatusMessage = string;
  export type StoreFormat = "GFF"|"TSV"|"VCF"|string;
  export type StoreName = string;
  export interface StoreOptions {
    /**
     * File settings for a TSV store.
     */
    tsvStoreOptions?: TsvStoreOptions;
  }
  export type StoreStatus = "CREATING"|"UPDATING"|"DELETING"|"ACTIVE"|"FAILED"|string;
  export type String = string;
  export type SubjectId = string;
  export type SyntheticTimestamp_date_time = Date;
  export type TagArn = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The resource's ARN.
     */
    resourceArn: TagArn;
    /**
     * Tags for the resource.
     */
    tags: TagResourceRequestTagsMap;
  }
  export type TagResourceRequestTagsMap = {[key: string]: TagValue};
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TaskId = string;
  export type TaskInstanceType = string;
  export type TaskList = TaskListItem[];
  export interface TaskListItem {
    /**
     * The task's ID.
     */
    taskId?: TaskId;
    /**
     * The task's status.
     */
    status?: TaskStatus;
    /**
     * The task's name.
     */
    name?: TaskName;
    /**
     * The task's CPU count.
     */
    cpus?: TaskListItemCpusInteger;
    /**
     * The task's memory use in gigabyes.
     */
    memory?: TaskListItemMemoryInteger;
    /**
     * When the task was created.
     */
    creationTime?: TaskTimestamp;
    /**
     * When the task started.
     */
    startTime?: TaskTimestamp;
    /**
     * When the task stopped.
     */
    stopTime?: TaskTimestamp;
    /**
     *  The number of Graphics Processing Units (GPU) specified for the task. 
     */
    gpus?: TaskListItemGpusInteger;
    /**
     *  The instance type for a task. 
     */
    instanceType?: TaskInstanceType;
  }
  export type TaskListItemCpusInteger = number;
  export type TaskListItemGpusInteger = number;
  export type TaskListItemMemoryInteger = number;
  export type TaskListToken = string;
  export type TaskLogStream = string;
  export type TaskName = string;
  export type TaskStatus = "PENDING"|"STARTING"|"RUNNING"|"STOPPING"|"COMPLETED"|"CANCELLED"|"FAILED"|string;
  export type TaskStatusMessage = string;
  export type TaskTimestamp = Date;
  export interface TsvOptions {
    /**
     * The file's read options.
     */
    readOptions?: ReadOptions;
  }
  export interface TsvStoreOptions {
    /**
     * The store's annotation type.
     */
    annotationType?: AnnotationType;
    /**
     * The store's header key to column name mapping.
     */
    formatToHeader?: FormatToHeader;
    /**
     * The store's schema.
     */
    schema?: TsvStoreOptionsSchemaList;
  }
  export type TsvStoreOptionsSchemaList = SchemaItem[];
  export interface TsvVersionOptions {
    /**
     *  The store version's annotation type. 
     */
    annotationType?: AnnotationType;
    /**
     *  The annotation store version's header key to column name mapping. 
     */
    formatToHeader?: FormatToHeader;
    /**
     *  The TSV schema for an annotation store version. 
     */
    schema?: TsvVersionOptionsSchemaList;
  }
  export type TsvVersionOptionsSchemaList = SchemaItem[];
  export interface UntagResourceRequest {
    /**
     * The resource's ARN.
     */
    resourceArn: TagArn;
    /**
     * Keys of tags to remove.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAnnotationStoreRequest {
    /**
     * A name for the store.
     */
    name: String;
    /**
     * A description for the store.
     */
    description?: Description;
  }
  export interface UpdateAnnotationStoreResponse {
    /**
     * The store's ID.
     */
    id: ResourceId;
    /**
     * The store's genome reference.
     */
    reference: ReferenceItem;
    /**
     * The store's status.
     */
    status: StoreStatus;
    /**
     * The store's name.
     */
    name: String;
    /**
     * The store's description.
     */
    description: Description;
    /**
     * When the store was created.
     */
    creationTime: CreationTime;
    /**
     * When the store was updated.
     */
    updateTime: UpdateTime;
    /**
     * Parsing options for the store.
     */
    storeOptions?: StoreOptions;
    /**
     * The annotation file format of the store.
     */
    storeFormat?: StoreFormat;
  }
  export interface UpdateAnnotationStoreVersionRequest {
    /**
     *  The name of an annotation store. 
     */
    name: String;
    /**
     *  The name of an annotation store version. 
     */
    versionName: String;
    /**
     *  The description of an annotation store. 
     */
    description?: Description;
  }
  export interface UpdateAnnotationStoreVersionResponse {
    /**
     *  The annotation store ID. 
     */
    storeId: ResourceId;
    /**
     *  The annotation store version ID. 
     */
    id: ResourceId;
    /**
     *  The status of an annotation store version. 
     */
    status: VersionStatus;
    /**
     *  The name of an annotation store. 
     */
    name: StoreName;
    /**
     *  The name of an annotation store version. 
     */
    versionName: VersionName;
    /**
     *  The description of an annotation store version. 
     */
    description: Description;
    /**
     *  The time stamp for when an annotation store version was created. 
     */
    creationTime: CreationTime;
    /**
     *  The time stamp for when an annotation store version was updated. 
     */
    updateTime: UpdateTime;
  }
  export interface UpdateRunGroupRequest {
    /**
     * The group's ID.
     */
    id: RunGroupId;
    /**
     * A name for the group.
     */
    name?: RunGroupName;
    /**
     * The maximum number of CPUs to use.
     */
    maxCpus?: UpdateRunGroupRequestMaxCpusInteger;
    /**
     * The maximum number of concurrent runs for the group.
     */
    maxRuns?: UpdateRunGroupRequestMaxRunsInteger;
    /**
     * A maximum run time for the group in minutes.
     */
    maxDuration?: UpdateRunGroupRequestMaxDurationInteger;
    /**
     *  The maximum GPUs that can be used by a run group. 
     */
    maxGpus?: UpdateRunGroupRequestMaxGpusInteger;
  }
  export type UpdateRunGroupRequestMaxCpusInteger = number;
  export type UpdateRunGroupRequestMaxDurationInteger = number;
  export type UpdateRunGroupRequestMaxGpusInteger = number;
  export type UpdateRunGroupRequestMaxRunsInteger = number;
  export type UpdateTime = Date;
  export interface UpdateVariantStoreRequest {
    /**
     * A name for the store.
     */
    name: String;
    /**
     * A description for the store.
     */
    description?: Description;
  }
  export interface UpdateVariantStoreResponse {
    /**
     * The store's ID.
     */
    id: ResourceId;
    /**
     * The store's genome reference.
     */
    reference: ReferenceItem;
    /**
     * The store's status.
     */
    status: StoreStatus;
    /**
     * The store's name.
     */
    name: String;
    /**
     * The store's description.
     */
    description: Description;
    /**
     * When the store was created.
     */
    creationTime: CreationTime;
    /**
     * When the store was updated.
     */
    updateTime: UpdateTime;
  }
  export interface UpdateWorkflowRequest {
    /**
     * The workflow's ID.
     */
    id: WorkflowId;
    /**
     * A name for the workflow.
     */
    name?: WorkflowName;
    /**
     * A description for the workflow.
     */
    description?: WorkflowDescription;
  }
  export type UploadId = string;
  export interface UploadReadSetPartRequest {
    /**
     *  The Sequence Store ID used for the multipart upload. 
     */
    sequenceStoreId: SequenceStoreId;
    /**
     *  The ID for the initiated multipart upload. 
     */
    uploadId: UploadId;
    /**
     *  The source file for an upload part. 
     */
    partSource: ReadSetPartSource;
    /**
     *  The number of the part being uploaded. 
     */
    partNumber: UploadReadSetPartRequestPartNumberInteger;
    /**
     *  The read set data to upload for a part. 
     */
    payload: ReadSetPartStreamingBlob;
  }
  export type UploadReadSetPartRequestPartNumberInteger = number;
  export interface UploadReadSetPartResponse {
    /**
     *  An identifier used to confirm that parts are being added to the intended upload. 
     */
    checksum: String;
  }
  export interface VariantImportItemDetail {
    /**
     * The source file's location in Amazon S3.
     */
    source: S3Uri;
    /**
     * The item's job status.
     */
    jobStatus: JobStatus;
    /**
     *  A message that provides additional context about a job 
     */
    statusMessage?: JobStatusMsg;
  }
  export type VariantImportItemDetails = VariantImportItemDetail[];
  export interface VariantImportItemSource {
    /**
     * The source file's location in Amazon S3.
     */
    source: S3Uri;
  }
  export type VariantImportItemSources = VariantImportItemSource[];
  export interface VariantImportJobItem {
    /**
     * The job's ID.
     */
    id: String;
    /**
     * The job's destination variant store.
     */
    destinationName: String;
    /**
     * The job's service role ARN.
     */
    roleArn: Arn;
    /**
     * The job's status.
     */
    status: JobStatus;
    /**
     * When the job was created.
     */
    creationTime: CreationTime;
    /**
     * When the job was updated.
     */
    updateTime: UpdateTime;
    /**
     * When the job completed.
     */
    completionTime?: CompletionTime;
    /**
     * The job's left normalization setting.
     */
    runLeftNormalization?: RunLeftNormalization;
    /**
     *  The annotation schema generated by the parsed annotation data. 
     */
    annotationFields?: AnnotationFieldMap;
  }
  export type VariantImportJobItems = VariantImportJobItem[];
  export interface VariantStoreItem {
    /**
     * The store's ID.
     */
    id: ResourceId;
    /**
     * The store's genome reference.
     */
    reference: ReferenceItem;
    /**
     * The store's status.
     */
    status: StoreStatus;
    /**
     * The store's ARN.
     */
    storeArn: Arn;
    /**
     * The store's name.
     */
    name: String;
    /**
     * The store's description.
     */
    description: Description;
    /**
     * The store's server-side encryption (SSE) settings.
     */
    sseConfig: SseConfig;
    /**
     * When the store was created.
     */
    creationTime: CreationTime;
    /**
     * When the store was updated.
     */
    updateTime: UpdateTime;
    /**
     * The store's status message.
     */
    statusMessage: StatusMessage;
    /**
     * The store's size in bytes.
     */
    storeSizeBytes: Long;
  }
  export type VariantStoreItems = VariantStoreItem[];
  export interface VcfOptions {
    /**
     * The file's ignore qual field setting.
     */
    ignoreQualField?: Boolean;
    /**
     * The file's ignore filter field setting.
     */
    ignoreFilterField?: Boolean;
  }
  export interface VersionDeleteError {
    /**
     *  The name given to an annotation store version. 
     */
    versionName: VersionName;
    /**
     *  The message explaining the error in annotation store deletion. 
     */
    message: String;
  }
  export type VersionDeleteErrorList = VersionDeleteError[];
  export type VersionList = VersionName[];
  export type VersionName = string;
  export interface VersionOptions {
    /**
     *  File settings for a version of a TSV store. 
     */
    tsvVersionOptions?: TsvVersionOptions;
  }
  export type VersionStatus = "CREATING"|"UPDATING"|"DELETING"|"ACTIVE"|"FAILED"|string;
  export type WorkflowArn = string;
  export type WorkflowDefinition = string;
  export type WorkflowDescription = string;
  export type WorkflowDigest = string;
  export type WorkflowEngine = "WDL"|"NEXTFLOW"|"CWL"|string;
  export type WorkflowExport = "DEFINITION"|string;
  export type WorkflowExportList = WorkflowExport[];
  export type WorkflowId = string;
  export type WorkflowList = WorkflowListItem[];
  export interface WorkflowListItem {
    /**
     * The workflow's ARN.
     */
    arn?: WorkflowArn;
    /**
     * The workflow's ID.
     */
    id?: WorkflowId;
    /**
     * The workflow's name.
     */
    name?: WorkflowName;
    /**
     * The workflow's status.
     */
    status?: WorkflowStatus;
    /**
     * The workflow's type.
     */
    type?: WorkflowType;
    /**
     * The workflow's digest.
     */
    digest?: WorkflowDigest;
    /**
     * When the workflow was created.
     */
    creationTime?: WorkflowTimestamp;
    /**
     *  Any metadata available for workflow. The information listed may vary depending on the workflow, and there may also be no metadata to return. 
     */
    metadata?: WorkflowMetadata;
  }
  export type WorkflowListToken = string;
  export type WorkflowMain = string;
  export type WorkflowMetadata = {[key: string]: WorkflowMetadataValue};
  export type WorkflowMetadataKey = string;
  export type WorkflowMetadataValue = string;
  export type WorkflowName = string;
  export interface WorkflowParameter {
    /**
     * The parameter's description.
     */
    description?: WorkflowParameterDescription;
    /**
     * Whether the parameter is optional.
     */
    optional?: Boolean;
  }
  export type WorkflowParameterDescription = string;
  export type WorkflowParameterName = string;
  export type WorkflowParameterTemplate = {[key: string]: WorkflowParameter};
  export type WorkflowRequestId = string;
  export type WorkflowStatus = "CREATING"|"ACTIVE"|"UPDATING"|"DELETED"|"FAILED"|"INACTIVE"|string;
  export type WorkflowStatusMessage = string;
  export type WorkflowTimestamp = Date;
  export type WorkflowType = "PRIVATE"|"READY2RUN"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-11-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Omics client.
   */
  export import Types = Omics;
}
export = Omics;
