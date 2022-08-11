import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class FraudDetector extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: FraudDetector.Types.ClientConfiguration)
  config: Config & FraudDetector.Types.ClientConfiguration;
  /**
   * Creates a batch of variables.
   */
  batchCreateVariable(params: FraudDetector.Types.BatchCreateVariableRequest, callback?: (err: AWSError, data: FraudDetector.Types.BatchCreateVariableResult) => void): Request<FraudDetector.Types.BatchCreateVariableResult, AWSError>;
  /**
   * Creates a batch of variables.
   */
  batchCreateVariable(callback?: (err: AWSError, data: FraudDetector.Types.BatchCreateVariableResult) => void): Request<FraudDetector.Types.BatchCreateVariableResult, AWSError>;
  /**
   * Gets a batch of variables.
   */
  batchGetVariable(params: FraudDetector.Types.BatchGetVariableRequest, callback?: (err: AWSError, data: FraudDetector.Types.BatchGetVariableResult) => void): Request<FraudDetector.Types.BatchGetVariableResult, AWSError>;
  /**
   * Gets a batch of variables.
   */
  batchGetVariable(callback?: (err: AWSError, data: FraudDetector.Types.BatchGetVariableResult) => void): Request<FraudDetector.Types.BatchGetVariableResult, AWSError>;
  /**
   *  Cancels an in-progress batch import job.
   */
  cancelBatchImportJob(params: FraudDetector.Types.CancelBatchImportJobRequest, callback?: (err: AWSError, data: FraudDetector.Types.CancelBatchImportJobResult) => void): Request<FraudDetector.Types.CancelBatchImportJobResult, AWSError>;
  /**
   *  Cancels an in-progress batch import job.
   */
  cancelBatchImportJob(callback?: (err: AWSError, data: FraudDetector.Types.CancelBatchImportJobResult) => void): Request<FraudDetector.Types.CancelBatchImportJobResult, AWSError>;
  /**
   * Cancels the specified batch prediction job.
   */
  cancelBatchPredictionJob(params: FraudDetector.Types.CancelBatchPredictionJobRequest, callback?: (err: AWSError, data: FraudDetector.Types.CancelBatchPredictionJobResult) => void): Request<FraudDetector.Types.CancelBatchPredictionJobResult, AWSError>;
  /**
   * Cancels the specified batch prediction job.
   */
  cancelBatchPredictionJob(callback?: (err: AWSError, data: FraudDetector.Types.CancelBatchPredictionJobResult) => void): Request<FraudDetector.Types.CancelBatchPredictionJobResult, AWSError>;
  /**
   * Creates a batch import job. 
   */
  createBatchImportJob(params: FraudDetector.Types.CreateBatchImportJobRequest, callback?: (err: AWSError, data: FraudDetector.Types.CreateBatchImportJobResult) => void): Request<FraudDetector.Types.CreateBatchImportJobResult, AWSError>;
  /**
   * Creates a batch import job. 
   */
  createBatchImportJob(callback?: (err: AWSError, data: FraudDetector.Types.CreateBatchImportJobResult) => void): Request<FraudDetector.Types.CreateBatchImportJobResult, AWSError>;
  /**
   * Creates a batch prediction job.
   */
  createBatchPredictionJob(params: FraudDetector.Types.CreateBatchPredictionJobRequest, callback?: (err: AWSError, data: FraudDetector.Types.CreateBatchPredictionJobResult) => void): Request<FraudDetector.Types.CreateBatchPredictionJobResult, AWSError>;
  /**
   * Creates a batch prediction job.
   */
  createBatchPredictionJob(callback?: (err: AWSError, data: FraudDetector.Types.CreateBatchPredictionJobResult) => void): Request<FraudDetector.Types.CreateBatchPredictionJobResult, AWSError>;
  /**
   * Creates a detector version. The detector version starts in a DRAFT status.
   */
  createDetectorVersion(params: FraudDetector.Types.CreateDetectorVersionRequest, callback?: (err: AWSError, data: FraudDetector.Types.CreateDetectorVersionResult) => void): Request<FraudDetector.Types.CreateDetectorVersionResult, AWSError>;
  /**
   * Creates a detector version. The detector version starts in a DRAFT status.
   */
  createDetectorVersion(callback?: (err: AWSError, data: FraudDetector.Types.CreateDetectorVersionResult) => void): Request<FraudDetector.Types.CreateDetectorVersionResult, AWSError>;
  /**
   * Creates a model using the specified model type.
   */
  createModel(params: FraudDetector.Types.CreateModelRequest, callback?: (err: AWSError, data: FraudDetector.Types.CreateModelResult) => void): Request<FraudDetector.Types.CreateModelResult, AWSError>;
  /**
   * Creates a model using the specified model type.
   */
  createModel(callback?: (err: AWSError, data: FraudDetector.Types.CreateModelResult) => void): Request<FraudDetector.Types.CreateModelResult, AWSError>;
  /**
   * Creates a version of the model using the specified model type and model id. 
   */
  createModelVersion(params: FraudDetector.Types.CreateModelVersionRequest, callback?: (err: AWSError, data: FraudDetector.Types.CreateModelVersionResult) => void): Request<FraudDetector.Types.CreateModelVersionResult, AWSError>;
  /**
   * Creates a version of the model using the specified model type and model id. 
   */
  createModelVersion(callback?: (err: AWSError, data: FraudDetector.Types.CreateModelVersionResult) => void): Request<FraudDetector.Types.CreateModelVersionResult, AWSError>;
  /**
   * Creates a rule for use with the specified detector. 
   */
  createRule(params: FraudDetector.Types.CreateRuleRequest, callback?: (err: AWSError, data: FraudDetector.Types.CreateRuleResult) => void): Request<FraudDetector.Types.CreateRuleResult, AWSError>;
  /**
   * Creates a rule for use with the specified detector. 
   */
  createRule(callback?: (err: AWSError, data: FraudDetector.Types.CreateRuleResult) => void): Request<FraudDetector.Types.CreateRuleResult, AWSError>;
  /**
   * Creates a variable.
   */
  createVariable(params: FraudDetector.Types.CreateVariableRequest, callback?: (err: AWSError, data: FraudDetector.Types.CreateVariableResult) => void): Request<FraudDetector.Types.CreateVariableResult, AWSError>;
  /**
   * Creates a variable.
   */
  createVariable(callback?: (err: AWSError, data: FraudDetector.Types.CreateVariableResult) => void): Request<FraudDetector.Types.CreateVariableResult, AWSError>;
  /**
   * Deletes data that was batch imported to Amazon Fraud Detector. 
   */
  deleteBatchImportJob(params: FraudDetector.Types.DeleteBatchImportJobRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteBatchImportJobResult) => void): Request<FraudDetector.Types.DeleteBatchImportJobResult, AWSError>;
  /**
   * Deletes data that was batch imported to Amazon Fraud Detector. 
   */
  deleteBatchImportJob(callback?: (err: AWSError, data: FraudDetector.Types.DeleteBatchImportJobResult) => void): Request<FraudDetector.Types.DeleteBatchImportJobResult, AWSError>;
  /**
   * Deletes a batch prediction job.
   */
  deleteBatchPredictionJob(params: FraudDetector.Types.DeleteBatchPredictionJobRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteBatchPredictionJobResult) => void): Request<FraudDetector.Types.DeleteBatchPredictionJobResult, AWSError>;
  /**
   * Deletes a batch prediction job.
   */
  deleteBatchPredictionJob(callback?: (err: AWSError, data: FraudDetector.Types.DeleteBatchPredictionJobResult) => void): Request<FraudDetector.Types.DeleteBatchPredictionJobResult, AWSError>;
  /**
   * Deletes the detector. Before deleting a detector, you must first delete all detector versions and rule versions associated with the detector. When you delete a detector, Amazon Fraud Detector permanently deletes the detector and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteDetector(params: FraudDetector.Types.DeleteDetectorRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteDetectorResult) => void): Request<FraudDetector.Types.DeleteDetectorResult, AWSError>;
  /**
   * Deletes the detector. Before deleting a detector, you must first delete all detector versions and rule versions associated with the detector. When you delete a detector, Amazon Fraud Detector permanently deletes the detector and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteDetector(callback?: (err: AWSError, data: FraudDetector.Types.DeleteDetectorResult) => void): Request<FraudDetector.Types.DeleteDetectorResult, AWSError>;
  /**
   * Deletes the detector version. You cannot delete detector versions that are in ACTIVE status. When you delete a detector version, Amazon Fraud Detector permanently deletes the detector and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteDetectorVersion(params: FraudDetector.Types.DeleteDetectorVersionRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteDetectorVersionResult) => void): Request<FraudDetector.Types.DeleteDetectorVersionResult, AWSError>;
  /**
   * Deletes the detector version. You cannot delete detector versions that are in ACTIVE status. When you delete a detector version, Amazon Fraud Detector permanently deletes the detector and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteDetectorVersion(callback?: (err: AWSError, data: FraudDetector.Types.DeleteDetectorVersionResult) => void): Request<FraudDetector.Types.DeleteDetectorVersionResult, AWSError>;
  /**
   * Deletes an entity type. You cannot delete an entity type that is included in an event type. When you delete an entity type, Amazon Fraud Detector permanently deletes that entity type and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteEntityType(params: FraudDetector.Types.DeleteEntityTypeRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteEntityTypeResult) => void): Request<FraudDetector.Types.DeleteEntityTypeResult, AWSError>;
  /**
   * Deletes an entity type. You cannot delete an entity type that is included in an event type. When you delete an entity type, Amazon Fraud Detector permanently deletes that entity type and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteEntityType(callback?: (err: AWSError, data: FraudDetector.Types.DeleteEntityTypeResult) => void): Request<FraudDetector.Types.DeleteEntityTypeResult, AWSError>;
  /**
   * Deletes the specified event. When you delete an event, Amazon Fraud Detector permanently deletes that event and the event data is no longer stored in Amazon Fraud Detector.
   */
  deleteEvent(params: FraudDetector.Types.DeleteEventRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteEventResult) => void): Request<FraudDetector.Types.DeleteEventResult, AWSError>;
  /**
   * Deletes the specified event. When you delete an event, Amazon Fraud Detector permanently deletes that event and the event data is no longer stored in Amazon Fraud Detector.
   */
  deleteEvent(callback?: (err: AWSError, data: FraudDetector.Types.DeleteEventResult) => void): Request<FraudDetector.Types.DeleteEventResult, AWSError>;
  /**
   * Deletes an event type. You cannot delete an event type that is used in a detector or a model. When you delete an event type, Amazon Fraud Detector permanently deletes that event type and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteEventType(params: FraudDetector.Types.DeleteEventTypeRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteEventTypeResult) => void): Request<FraudDetector.Types.DeleteEventTypeResult, AWSError>;
  /**
   * Deletes an event type. You cannot delete an event type that is used in a detector or a model. When you delete an event type, Amazon Fraud Detector permanently deletes that event type and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteEventType(callback?: (err: AWSError, data: FraudDetector.Types.DeleteEventTypeResult) => void): Request<FraudDetector.Types.DeleteEventTypeResult, AWSError>;
  /**
   * Deletes all events of a particular event type.
   */
  deleteEventsByEventType(params: FraudDetector.Types.DeleteEventsByEventTypeRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteEventsByEventTypeResult) => void): Request<FraudDetector.Types.DeleteEventsByEventTypeResult, AWSError>;
  /**
   * Deletes all events of a particular event type.
   */
  deleteEventsByEventType(callback?: (err: AWSError, data: FraudDetector.Types.DeleteEventsByEventTypeResult) => void): Request<FraudDetector.Types.DeleteEventsByEventTypeResult, AWSError>;
  /**
   * Removes a SageMaker model from Amazon Fraud Detector. You can remove an Amazon SageMaker model if it is not associated with a detector version. Removing a SageMaker model disconnects it from Amazon Fraud Detector, but the model remains available in SageMaker.
   */
  deleteExternalModel(params: FraudDetector.Types.DeleteExternalModelRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteExternalModelResult) => void): Request<FraudDetector.Types.DeleteExternalModelResult, AWSError>;
  /**
   * Removes a SageMaker model from Amazon Fraud Detector. You can remove an Amazon SageMaker model if it is not associated with a detector version. Removing a SageMaker model disconnects it from Amazon Fraud Detector, but the model remains available in SageMaker.
   */
  deleteExternalModel(callback?: (err: AWSError, data: FraudDetector.Types.DeleteExternalModelResult) => void): Request<FraudDetector.Types.DeleteExternalModelResult, AWSError>;
  /**
   * Deletes a label. You cannot delete labels that are included in an event type in Amazon Fraud Detector. You cannot delete a label assigned to an event ID. You must first delete the relevant event ID. When you delete a label, Amazon Fraud Detector permanently deletes that label and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteLabel(params: FraudDetector.Types.DeleteLabelRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteLabelResult) => void): Request<FraudDetector.Types.DeleteLabelResult, AWSError>;
  /**
   * Deletes a label. You cannot delete labels that are included in an event type in Amazon Fraud Detector. You cannot delete a label assigned to an event ID. You must first delete the relevant event ID. When you delete a label, Amazon Fraud Detector permanently deletes that label and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteLabel(callback?: (err: AWSError, data: FraudDetector.Types.DeleteLabelResult) => void): Request<FraudDetector.Types.DeleteLabelResult, AWSError>;
  /**
   * Deletes a model. You can delete models and model versions in Amazon Fraud Detector, provided that they are not associated with a detector version.  When you delete a model, Amazon Fraud Detector permanently deletes that model and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteModel(params: FraudDetector.Types.DeleteModelRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteModelResult) => void): Request<FraudDetector.Types.DeleteModelResult, AWSError>;
  /**
   * Deletes a model. You can delete models and model versions in Amazon Fraud Detector, provided that they are not associated with a detector version.  When you delete a model, Amazon Fraud Detector permanently deletes that model and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteModel(callback?: (err: AWSError, data: FraudDetector.Types.DeleteModelResult) => void): Request<FraudDetector.Types.DeleteModelResult, AWSError>;
  /**
   * Deletes a model version. You can delete models and model versions in Amazon Fraud Detector, provided that they are not associated with a detector version.  When you delete a model version, Amazon Fraud Detector permanently deletes that model version and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteModelVersion(params: FraudDetector.Types.DeleteModelVersionRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteModelVersionResult) => void): Request<FraudDetector.Types.DeleteModelVersionResult, AWSError>;
  /**
   * Deletes a model version. You can delete models and model versions in Amazon Fraud Detector, provided that they are not associated with a detector version.  When you delete a model version, Amazon Fraud Detector permanently deletes that model version and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteModelVersion(callback?: (err: AWSError, data: FraudDetector.Types.DeleteModelVersionResult) => void): Request<FraudDetector.Types.DeleteModelVersionResult, AWSError>;
  /**
   * Deletes an outcome. You cannot delete an outcome that is used in a rule version. When you delete an outcome, Amazon Fraud Detector permanently deletes that outcome and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteOutcome(params: FraudDetector.Types.DeleteOutcomeRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteOutcomeResult) => void): Request<FraudDetector.Types.DeleteOutcomeResult, AWSError>;
  /**
   * Deletes an outcome. You cannot delete an outcome that is used in a rule version. When you delete an outcome, Amazon Fraud Detector permanently deletes that outcome and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteOutcome(callback?: (err: AWSError, data: FraudDetector.Types.DeleteOutcomeResult) => void): Request<FraudDetector.Types.DeleteOutcomeResult, AWSError>;
  /**
   * Deletes the rule. You cannot delete a rule if it is used by an ACTIVE or INACTIVE detector version. When you delete a rule, Amazon Fraud Detector permanently deletes that rule and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteRule(params: FraudDetector.Types.DeleteRuleRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteRuleResult) => void): Request<FraudDetector.Types.DeleteRuleResult, AWSError>;
  /**
   * Deletes the rule. You cannot delete a rule if it is used by an ACTIVE or INACTIVE detector version. When you delete a rule, Amazon Fraud Detector permanently deletes that rule and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteRule(callback?: (err: AWSError, data: FraudDetector.Types.DeleteRuleResult) => void): Request<FraudDetector.Types.DeleteRuleResult, AWSError>;
  /**
   * Deletes a variable. You can't delete variables that are included in an event type in Amazon Fraud Detector. Amazon Fraud Detector automatically deletes model output variables and SageMaker model output variables when you delete the model. You can't delete these variables manually. When you delete a variable, Amazon Fraud Detector permanently deletes that variable and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteVariable(params: FraudDetector.Types.DeleteVariableRequest, callback?: (err: AWSError, data: FraudDetector.Types.DeleteVariableResult) => void): Request<FraudDetector.Types.DeleteVariableResult, AWSError>;
  /**
   * Deletes a variable. You can't delete variables that are included in an event type in Amazon Fraud Detector. Amazon Fraud Detector automatically deletes model output variables and SageMaker model output variables when you delete the model. You can't delete these variables manually. When you delete a variable, Amazon Fraud Detector permanently deletes that variable and the data is no longer stored in Amazon Fraud Detector.
   */
  deleteVariable(callback?: (err: AWSError, data: FraudDetector.Types.DeleteVariableResult) => void): Request<FraudDetector.Types.DeleteVariableResult, AWSError>;
  /**
   * Gets all versions for a specified detector.
   */
  describeDetector(params: FraudDetector.Types.DescribeDetectorRequest, callback?: (err: AWSError, data: FraudDetector.Types.DescribeDetectorResult) => void): Request<FraudDetector.Types.DescribeDetectorResult, AWSError>;
  /**
   * Gets all versions for a specified detector.
   */
  describeDetector(callback?: (err: AWSError, data: FraudDetector.Types.DescribeDetectorResult) => void): Request<FraudDetector.Types.DescribeDetectorResult, AWSError>;
  /**
   * Gets all of the model versions for the specified model type or for the specified model type and model ID. You can also get details for a single, specified model version. 
   */
  describeModelVersions(params: FraudDetector.Types.DescribeModelVersionsRequest, callback?: (err: AWSError, data: FraudDetector.Types.DescribeModelVersionsResult) => void): Request<FraudDetector.Types.DescribeModelVersionsResult, AWSError>;
  /**
   * Gets all of the model versions for the specified model type or for the specified model type and model ID. You can also get details for a single, specified model version. 
   */
  describeModelVersions(callback?: (err: AWSError, data: FraudDetector.Types.DescribeModelVersionsResult) => void): Request<FraudDetector.Types.DescribeModelVersionsResult, AWSError>;
  /**
   * Gets all batch import jobs or a specific job of the specified ID. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 50 records per page. If you provide a maxResults, the value must be between 1 and 50. To get the next page results, provide the pagination token from the GetBatchImportJobsResponse as part of your request. A null pagination token fetches the records from the beginning.
   */
  getBatchImportJobs(params: FraudDetector.Types.GetBatchImportJobsRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetBatchImportJobsResult) => void): Request<FraudDetector.Types.GetBatchImportJobsResult, AWSError>;
  /**
   * Gets all batch import jobs or a specific job of the specified ID. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 50 records per page. If you provide a maxResults, the value must be between 1 and 50. To get the next page results, provide the pagination token from the GetBatchImportJobsResponse as part of your request. A null pagination token fetches the records from the beginning.
   */
  getBatchImportJobs(callback?: (err: AWSError, data: FraudDetector.Types.GetBatchImportJobsResult) => void): Request<FraudDetector.Types.GetBatchImportJobsResult, AWSError>;
  /**
   * Gets all batch prediction jobs or a specific job if you specify a job ID. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 50 records per page. If you provide a maxResults, the value must be between 1 and 50. To get the next page results, provide the pagination token from the GetBatchPredictionJobsResponse as part of your request. A null pagination token fetches the records from the beginning.
   */
  getBatchPredictionJobs(params: FraudDetector.Types.GetBatchPredictionJobsRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetBatchPredictionJobsResult) => void): Request<FraudDetector.Types.GetBatchPredictionJobsResult, AWSError>;
  /**
   * Gets all batch prediction jobs or a specific job if you specify a job ID. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 50 records per page. If you provide a maxResults, the value must be between 1 and 50. To get the next page results, provide the pagination token from the GetBatchPredictionJobsResponse as part of your request. A null pagination token fetches the records from the beginning.
   */
  getBatchPredictionJobs(callback?: (err: AWSError, data: FraudDetector.Types.GetBatchPredictionJobsResult) => void): Request<FraudDetector.Types.GetBatchPredictionJobsResult, AWSError>;
  /**
   * Retrieves the status of a DeleteEventsByEventType action.
   */
  getDeleteEventsByEventTypeStatus(params: FraudDetector.Types.GetDeleteEventsByEventTypeStatusRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetDeleteEventsByEventTypeStatusResult) => void): Request<FraudDetector.Types.GetDeleteEventsByEventTypeStatusResult, AWSError>;
  /**
   * Retrieves the status of a DeleteEventsByEventType action.
   */
  getDeleteEventsByEventTypeStatus(callback?: (err: AWSError, data: FraudDetector.Types.GetDeleteEventsByEventTypeStatusResult) => void): Request<FraudDetector.Types.GetDeleteEventsByEventTypeStatusResult, AWSError>;
  /**
   * Gets a particular detector version. 
   */
  getDetectorVersion(params: FraudDetector.Types.GetDetectorVersionRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetDetectorVersionResult) => void): Request<FraudDetector.Types.GetDetectorVersionResult, AWSError>;
  /**
   * Gets a particular detector version. 
   */
  getDetectorVersion(callback?: (err: AWSError, data: FraudDetector.Types.GetDetectorVersionResult) => void): Request<FraudDetector.Types.GetDetectorVersionResult, AWSError>;
  /**
   * Gets all detectors or a single detector if a detectorId is specified. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 10 records per page. If you provide a maxResults, the value must be between 5 and 10. To get the next page results, provide the pagination token from the GetDetectorsResponse as part of your request. A null pagination token fetches the records from the beginning. 
   */
  getDetectors(params: FraudDetector.Types.GetDetectorsRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetDetectorsResult) => void): Request<FraudDetector.Types.GetDetectorsResult, AWSError>;
  /**
   * Gets all detectors or a single detector if a detectorId is specified. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 10 records per page. If you provide a maxResults, the value must be between 5 and 10. To get the next page results, provide the pagination token from the GetDetectorsResponse as part of your request. A null pagination token fetches the records from the beginning. 
   */
  getDetectors(callback?: (err: AWSError, data: FraudDetector.Types.GetDetectorsResult) => void): Request<FraudDetector.Types.GetDetectorsResult, AWSError>;
  /**
   * Gets all entity types or a specific entity type if a name is specified. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 10 records per page. If you provide a maxResults, the value must be between 5 and 10. To get the next page results, provide the pagination token from the GetEntityTypesResponse as part of your request. A null pagination token fetches the records from the beginning. 
   */
  getEntityTypes(params: FraudDetector.Types.GetEntityTypesRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetEntityTypesResult) => void): Request<FraudDetector.Types.GetEntityTypesResult, AWSError>;
  /**
   * Gets all entity types or a specific entity type if a name is specified. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 10 records per page. If you provide a maxResults, the value must be between 5 and 10. To get the next page results, provide the pagination token from the GetEntityTypesResponse as part of your request. A null pagination token fetches the records from the beginning. 
   */
  getEntityTypes(callback?: (err: AWSError, data: FraudDetector.Types.GetEntityTypesResult) => void): Request<FraudDetector.Types.GetEntityTypesResult, AWSError>;
  /**
   * Retrieves details of events stored with Amazon Fraud Detector. This action does not retrieve prediction results.
   */
  getEvent(params: FraudDetector.Types.GetEventRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetEventResult) => void): Request<FraudDetector.Types.GetEventResult, AWSError>;
  /**
   * Retrieves details of events stored with Amazon Fraud Detector. This action does not retrieve prediction results.
   */
  getEvent(callback?: (err: AWSError, data: FraudDetector.Types.GetEventResult) => void): Request<FraudDetector.Types.GetEventResult, AWSError>;
  /**
   * Evaluates an event against a detector version. If a version ID is not provided, the detector’s (ACTIVE) version is used.
   */
  getEventPrediction(params: FraudDetector.Types.GetEventPredictionRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetEventPredictionResult) => void): Request<FraudDetector.Types.GetEventPredictionResult, AWSError>;
  /**
   * Evaluates an event against a detector version. If a version ID is not provided, the detector’s (ACTIVE) version is used.
   */
  getEventPrediction(callback?: (err: AWSError, data: FraudDetector.Types.GetEventPredictionResult) => void): Request<FraudDetector.Types.GetEventPredictionResult, AWSError>;
  /**
   * Gets all event types or a specific event type if name is provided. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 10 records per page. If you provide a maxResults, the value must be between 5 and 10. To get the next page results, provide the pagination token from the GetEventTypesResponse as part of your request. A null pagination token fetches the records from the beginning. 
   */
  getEventTypes(params: FraudDetector.Types.GetEventTypesRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetEventTypesResult) => void): Request<FraudDetector.Types.GetEventTypesResult, AWSError>;
  /**
   * Gets all event types or a specific event type if name is provided. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 10 records per page. If you provide a maxResults, the value must be between 5 and 10. To get the next page results, provide the pagination token from the GetEventTypesResponse as part of your request. A null pagination token fetches the records from the beginning. 
   */
  getEventTypes(callback?: (err: AWSError, data: FraudDetector.Types.GetEventTypesResult) => void): Request<FraudDetector.Types.GetEventTypesResult, AWSError>;
  /**
   * Gets the details for one or more Amazon SageMaker models that have been imported into the service. This is a paginated API. If you provide a null maxResults, this actions retrieves a maximum of 10 records per page. If you provide a maxResults, the value must be between 5 and 10. To get the next page results, provide the pagination token from the GetExternalModelsResult as part of your request. A null pagination token fetches the records from the beginning. 
   */
  getExternalModels(params: FraudDetector.Types.GetExternalModelsRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetExternalModelsResult) => void): Request<FraudDetector.Types.GetExternalModelsResult, AWSError>;
  /**
   * Gets the details for one or more Amazon SageMaker models that have been imported into the service. This is a paginated API. If you provide a null maxResults, this actions retrieves a maximum of 10 records per page. If you provide a maxResults, the value must be between 5 and 10. To get the next page results, provide the pagination token from the GetExternalModelsResult as part of your request. A null pagination token fetches the records from the beginning. 
   */
  getExternalModels(callback?: (err: AWSError, data: FraudDetector.Types.GetExternalModelsResult) => void): Request<FraudDetector.Types.GetExternalModelsResult, AWSError>;
  /**
   * Gets the encryption key if a KMS key has been specified to be used to encrypt content in Amazon Fraud Detector.
   */
  getKMSEncryptionKey(callback?: (err: AWSError, data: FraudDetector.Types.GetKMSEncryptionKeyResult) => void): Request<FraudDetector.Types.GetKMSEncryptionKeyResult, AWSError>;
  /**
   * Gets all labels or a specific label if name is provided. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 50 records per page. If you provide a maxResults, the value must be between 10 and 50. To get the next page results, provide the pagination token from the GetGetLabelsResponse as part of your request. A null pagination token fetches the records from the beginning. 
   */
  getLabels(params: FraudDetector.Types.GetLabelsRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetLabelsResult) => void): Request<FraudDetector.Types.GetLabelsResult, AWSError>;
  /**
   * Gets all labels or a specific label if name is provided. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 50 records per page. If you provide a maxResults, the value must be between 10 and 50. To get the next page results, provide the pagination token from the GetGetLabelsResponse as part of your request. A null pagination token fetches the records from the beginning. 
   */
  getLabels(callback?: (err: AWSError, data: FraudDetector.Types.GetLabelsResult) => void): Request<FraudDetector.Types.GetLabelsResult, AWSError>;
  /**
   * Gets the details of the specified model version.
   */
  getModelVersion(params: FraudDetector.Types.GetModelVersionRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetModelVersionResult) => void): Request<FraudDetector.Types.GetModelVersionResult, AWSError>;
  /**
   * Gets the details of the specified model version.
   */
  getModelVersion(callback?: (err: AWSError, data: FraudDetector.Types.GetModelVersionResult) => void): Request<FraudDetector.Types.GetModelVersionResult, AWSError>;
  /**
   * Gets one or more models. Gets all models for the Amazon Web Services account if no model type and no model id provided. Gets all models for the Amazon Web Services account and model type, if the model type is specified but model id is not provided. Gets a specific model if (model type, model id) tuple is specified.  This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 10 records per page. If you provide a maxResults, the value must be between 1 and 10. To get the next page results, provide the pagination token from the response as part of your request. A null pagination token fetches the records from the beginning.
   */
  getModels(params: FraudDetector.Types.GetModelsRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetModelsResult) => void): Request<FraudDetector.Types.GetModelsResult, AWSError>;
  /**
   * Gets one or more models. Gets all models for the Amazon Web Services account if no model type and no model id provided. Gets all models for the Amazon Web Services account and model type, if the model type is specified but model id is not provided. Gets a specific model if (model type, model id) tuple is specified.  This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 10 records per page. If you provide a maxResults, the value must be between 1 and 10. To get the next page results, provide the pagination token from the response as part of your request. A null pagination token fetches the records from the beginning.
   */
  getModels(callback?: (err: AWSError, data: FraudDetector.Types.GetModelsResult) => void): Request<FraudDetector.Types.GetModelsResult, AWSError>;
  /**
   * Gets one or more outcomes. This is a paginated API. If you provide a null maxResults, this actions retrieves a maximum of 100 records per page. If you provide a maxResults, the value must be between 50 and 100. To get the next page results, provide the pagination token from the GetOutcomesResult as part of your request. A null pagination token fetches the records from the beginning. 
   */
  getOutcomes(params: FraudDetector.Types.GetOutcomesRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetOutcomesResult) => void): Request<FraudDetector.Types.GetOutcomesResult, AWSError>;
  /**
   * Gets one or more outcomes. This is a paginated API. If you provide a null maxResults, this actions retrieves a maximum of 100 records per page. If you provide a maxResults, the value must be between 50 and 100. To get the next page results, provide the pagination token from the GetOutcomesResult as part of your request. A null pagination token fetches the records from the beginning. 
   */
  getOutcomes(callback?: (err: AWSError, data: FraudDetector.Types.GetOutcomesResult) => void): Request<FraudDetector.Types.GetOutcomesResult, AWSError>;
  /**
   * Get all rules for a detector (paginated) if ruleId and ruleVersion are not specified. Gets all rules for the detector and the ruleId if present (paginated). Gets a specific rule if both the ruleId and the ruleVersion are specified. This is a paginated API. Providing null maxResults results in retrieving maximum of 100 records per page. If you provide maxResults the value must be between 50 and 100. To get the next page result, a provide a pagination token from GetRulesResult as part of your request. Null pagination token fetches the records from the beginning.
   */
  getRules(params: FraudDetector.Types.GetRulesRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetRulesResult) => void): Request<FraudDetector.Types.GetRulesResult, AWSError>;
  /**
   * Get all rules for a detector (paginated) if ruleId and ruleVersion are not specified. Gets all rules for the detector and the ruleId if present (paginated). Gets a specific rule if both the ruleId and the ruleVersion are specified. This is a paginated API. Providing null maxResults results in retrieving maximum of 100 records per page. If you provide maxResults the value must be between 50 and 100. To get the next page result, a provide a pagination token from GetRulesResult as part of your request. Null pagination token fetches the records from the beginning.
   */
  getRules(callback?: (err: AWSError, data: FraudDetector.Types.GetRulesResult) => void): Request<FraudDetector.Types.GetRulesResult, AWSError>;
  /**
   * Gets all of the variables or the specific variable. This is a paginated API. Providing null maxSizePerPage results in retrieving maximum of 100 records per page. If you provide maxSizePerPage the value must be between 50 and 100. To get the next page result, a provide a pagination token from GetVariablesResult as part of your request. Null pagination token fetches the records from the beginning. 
   */
  getVariables(params: FraudDetector.Types.GetVariablesRequest, callback?: (err: AWSError, data: FraudDetector.Types.GetVariablesResult) => void): Request<FraudDetector.Types.GetVariablesResult, AWSError>;
  /**
   * Gets all of the variables or the specific variable. This is a paginated API. Providing null maxSizePerPage results in retrieving maximum of 100 records per page. If you provide maxSizePerPage the value must be between 50 and 100. To get the next page result, a provide a pagination token from GetVariablesResult as part of your request. Null pagination token fetches the records from the beginning. 
   */
  getVariables(callback?: (err: AWSError, data: FraudDetector.Types.GetVariablesResult) => void): Request<FraudDetector.Types.GetVariablesResult, AWSError>;
  /**
   * Lists all tags associated with the resource. This is a paginated API. To get the next page results, provide the pagination token from the response as part of your request. A null pagination token fetches the records from the beginning. 
   */
  listTagsForResource(params: FraudDetector.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: FraudDetector.Types.ListTagsForResourceResult) => void): Request<FraudDetector.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Lists all tags associated with the resource. This is a paginated API. To get the next page results, provide the pagination token from the response as part of your request. A null pagination token fetches the records from the beginning. 
   */
  listTagsForResource(callback?: (err: AWSError, data: FraudDetector.Types.ListTagsForResourceResult) => void): Request<FraudDetector.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Creates or updates a detector. 
   */
  putDetector(params: FraudDetector.Types.PutDetectorRequest, callback?: (err: AWSError, data: FraudDetector.Types.PutDetectorResult) => void): Request<FraudDetector.Types.PutDetectorResult, AWSError>;
  /**
   * Creates or updates a detector. 
   */
  putDetector(callback?: (err: AWSError, data: FraudDetector.Types.PutDetectorResult) => void): Request<FraudDetector.Types.PutDetectorResult, AWSError>;
  /**
   * Creates or updates an entity type. An entity represents who is performing the event. As part of a fraud prediction, you pass the entity ID to indicate the specific entity who performed the event. An entity type classifies the entity. Example classifications include customer, merchant, or account.
   */
  putEntityType(params: FraudDetector.Types.PutEntityTypeRequest, callback?: (err: AWSError, data: FraudDetector.Types.PutEntityTypeResult) => void): Request<FraudDetector.Types.PutEntityTypeResult, AWSError>;
  /**
   * Creates or updates an entity type. An entity represents who is performing the event. As part of a fraud prediction, you pass the entity ID to indicate the specific entity who performed the event. An entity type classifies the entity. Example classifications include customer, merchant, or account.
   */
  putEntityType(callback?: (err: AWSError, data: FraudDetector.Types.PutEntityTypeResult) => void): Request<FraudDetector.Types.PutEntityTypeResult, AWSError>;
  /**
   * Creates or updates an event type. An event is a business activity that is evaluated for fraud risk. With Amazon Fraud Detector, you generate fraud predictions for events. An event type defines the structure for an event sent to Amazon Fraud Detector. This includes the variables sent as part of the event, the entity performing the event (such as a customer), and the labels that classify the event. Example event types include online payment transactions, account registrations, and authentications.
   */
  putEventType(params: FraudDetector.Types.PutEventTypeRequest, callback?: (err: AWSError, data: FraudDetector.Types.PutEventTypeResult) => void): Request<FraudDetector.Types.PutEventTypeResult, AWSError>;
  /**
   * Creates or updates an event type. An event is a business activity that is evaluated for fraud risk. With Amazon Fraud Detector, you generate fraud predictions for events. An event type defines the structure for an event sent to Amazon Fraud Detector. This includes the variables sent as part of the event, the entity performing the event (such as a customer), and the labels that classify the event. Example event types include online payment transactions, account registrations, and authentications.
   */
  putEventType(callback?: (err: AWSError, data: FraudDetector.Types.PutEventTypeResult) => void): Request<FraudDetector.Types.PutEventTypeResult, AWSError>;
  /**
   * Creates or updates an Amazon SageMaker model endpoint. You can also use this action to update the configuration of the model endpoint, including the IAM role and/or the mapped variables. 
   */
  putExternalModel(params: FraudDetector.Types.PutExternalModelRequest, callback?: (err: AWSError, data: FraudDetector.Types.PutExternalModelResult) => void): Request<FraudDetector.Types.PutExternalModelResult, AWSError>;
  /**
   * Creates or updates an Amazon SageMaker model endpoint. You can also use this action to update the configuration of the model endpoint, including the IAM role and/or the mapped variables. 
   */
  putExternalModel(callback?: (err: AWSError, data: FraudDetector.Types.PutExternalModelResult) => void): Request<FraudDetector.Types.PutExternalModelResult, AWSError>;
  /**
   * Specifies the KMS key to be used to encrypt content in Amazon Fraud Detector.
   */
  putKMSEncryptionKey(params: FraudDetector.Types.PutKMSEncryptionKeyRequest, callback?: (err: AWSError, data: FraudDetector.Types.PutKMSEncryptionKeyResult) => void): Request<FraudDetector.Types.PutKMSEncryptionKeyResult, AWSError>;
  /**
   * Specifies the KMS key to be used to encrypt content in Amazon Fraud Detector.
   */
  putKMSEncryptionKey(callback?: (err: AWSError, data: FraudDetector.Types.PutKMSEncryptionKeyResult) => void): Request<FraudDetector.Types.PutKMSEncryptionKeyResult, AWSError>;
  /**
   * Creates or updates label. A label classifies an event as fraudulent or legitimate. Labels are associated with event types and used to train supervised machine learning models in Amazon Fraud Detector. 
   */
  putLabel(params: FraudDetector.Types.PutLabelRequest, callback?: (err: AWSError, data: FraudDetector.Types.PutLabelResult) => void): Request<FraudDetector.Types.PutLabelResult, AWSError>;
  /**
   * Creates or updates label. A label classifies an event as fraudulent or legitimate. Labels are associated with event types and used to train supervised machine learning models in Amazon Fraud Detector. 
   */
  putLabel(callback?: (err: AWSError, data: FraudDetector.Types.PutLabelResult) => void): Request<FraudDetector.Types.PutLabelResult, AWSError>;
  /**
   * Creates or updates an outcome. 
   */
  putOutcome(params: FraudDetector.Types.PutOutcomeRequest, callback?: (err: AWSError, data: FraudDetector.Types.PutOutcomeResult) => void): Request<FraudDetector.Types.PutOutcomeResult, AWSError>;
  /**
   * Creates or updates an outcome. 
   */
  putOutcome(callback?: (err: AWSError, data: FraudDetector.Types.PutOutcomeResult) => void): Request<FraudDetector.Types.PutOutcomeResult, AWSError>;
  /**
   * Stores events in Amazon Fraud Detector without generating fraud predictions for those events. For example, you can use SendEvent to upload a historical dataset, which you can then later use to train a model.
   */
  sendEvent(params: FraudDetector.Types.SendEventRequest, callback?: (err: AWSError, data: FraudDetector.Types.SendEventResult) => void): Request<FraudDetector.Types.SendEventResult, AWSError>;
  /**
   * Stores events in Amazon Fraud Detector without generating fraud predictions for those events. For example, you can use SendEvent to upload a historical dataset, which you can then later use to train a model.
   */
  sendEvent(callback?: (err: AWSError, data: FraudDetector.Types.SendEventResult) => void): Request<FraudDetector.Types.SendEventResult, AWSError>;
  /**
   * Assigns tags to a resource.
   */
  tagResource(params: FraudDetector.Types.TagResourceRequest, callback?: (err: AWSError, data: FraudDetector.Types.TagResourceResult) => void): Request<FraudDetector.Types.TagResourceResult, AWSError>;
  /**
   * Assigns tags to a resource.
   */
  tagResource(callback?: (err: AWSError, data: FraudDetector.Types.TagResourceResult) => void): Request<FraudDetector.Types.TagResourceResult, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(params: FraudDetector.Types.UntagResourceRequest, callback?: (err: AWSError, data: FraudDetector.Types.UntagResourceResult) => void): Request<FraudDetector.Types.UntagResourceResult, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: FraudDetector.Types.UntagResourceResult) => void): Request<FraudDetector.Types.UntagResourceResult, AWSError>;
  /**
   *  Updates a detector version. The detector version attributes that you can update include models, external model endpoints, rules, rule execution mode, and description. You can only update a DRAFT detector version.
   */
  updateDetectorVersion(params: FraudDetector.Types.UpdateDetectorVersionRequest, callback?: (err: AWSError, data: FraudDetector.Types.UpdateDetectorVersionResult) => void): Request<FraudDetector.Types.UpdateDetectorVersionResult, AWSError>;
  /**
   *  Updates a detector version. The detector version attributes that you can update include models, external model endpoints, rules, rule execution mode, and description. You can only update a DRAFT detector version.
   */
  updateDetectorVersion(callback?: (err: AWSError, data: FraudDetector.Types.UpdateDetectorVersionResult) => void): Request<FraudDetector.Types.UpdateDetectorVersionResult, AWSError>;
  /**
   * Updates the detector version's description. You can update the metadata for any detector version (DRAFT, ACTIVE, or INACTIVE). 
   */
  updateDetectorVersionMetadata(params: FraudDetector.Types.UpdateDetectorVersionMetadataRequest, callback?: (err: AWSError, data: FraudDetector.Types.UpdateDetectorVersionMetadataResult) => void): Request<FraudDetector.Types.UpdateDetectorVersionMetadataResult, AWSError>;
  /**
   * Updates the detector version's description. You can update the metadata for any detector version (DRAFT, ACTIVE, or INACTIVE). 
   */
  updateDetectorVersionMetadata(callback?: (err: AWSError, data: FraudDetector.Types.UpdateDetectorVersionMetadataResult) => void): Request<FraudDetector.Types.UpdateDetectorVersionMetadataResult, AWSError>;
  /**
   * Updates the detector version’s status. You can perform the following promotions or demotions using UpdateDetectorVersionStatus: DRAFT to ACTIVE, ACTIVE to INACTIVE, and INACTIVE to ACTIVE.
   */
  updateDetectorVersionStatus(params: FraudDetector.Types.UpdateDetectorVersionStatusRequest, callback?: (err: AWSError, data: FraudDetector.Types.UpdateDetectorVersionStatusResult) => void): Request<FraudDetector.Types.UpdateDetectorVersionStatusResult, AWSError>;
  /**
   * Updates the detector version’s status. You can perform the following promotions or demotions using UpdateDetectorVersionStatus: DRAFT to ACTIVE, ACTIVE to INACTIVE, and INACTIVE to ACTIVE.
   */
  updateDetectorVersionStatus(callback?: (err: AWSError, data: FraudDetector.Types.UpdateDetectorVersionStatusResult) => void): Request<FraudDetector.Types.UpdateDetectorVersionStatusResult, AWSError>;
  /**
   * Updates the specified event with a new label.
   */
  updateEventLabel(params: FraudDetector.Types.UpdateEventLabelRequest, callback?: (err: AWSError, data: FraudDetector.Types.UpdateEventLabelResult) => void): Request<FraudDetector.Types.UpdateEventLabelResult, AWSError>;
  /**
   * Updates the specified event with a new label.
   */
  updateEventLabel(callback?: (err: AWSError, data: FraudDetector.Types.UpdateEventLabelResult) => void): Request<FraudDetector.Types.UpdateEventLabelResult, AWSError>;
  /**
   * Updates model description.
   */
  updateModel(params: FraudDetector.Types.UpdateModelRequest, callback?: (err: AWSError, data: FraudDetector.Types.UpdateModelResult) => void): Request<FraudDetector.Types.UpdateModelResult, AWSError>;
  /**
   * Updates model description.
   */
  updateModel(callback?: (err: AWSError, data: FraudDetector.Types.UpdateModelResult) => void): Request<FraudDetector.Types.UpdateModelResult, AWSError>;
  /**
   * Updates a model version. Updating a model version retrains an existing model version using updated training data and produces a new minor version of the model. You can update the training data set location and data access role attributes using this action. This action creates and trains a new minor version of the model, for example version 1.01, 1.02, 1.03.
   */
  updateModelVersion(params: FraudDetector.Types.UpdateModelVersionRequest, callback?: (err: AWSError, data: FraudDetector.Types.UpdateModelVersionResult) => void): Request<FraudDetector.Types.UpdateModelVersionResult, AWSError>;
  /**
   * Updates a model version. Updating a model version retrains an existing model version using updated training data and produces a new minor version of the model. You can update the training data set location and data access role attributes using this action. This action creates and trains a new minor version of the model, for example version 1.01, 1.02, 1.03.
   */
  updateModelVersion(callback?: (err: AWSError, data: FraudDetector.Types.UpdateModelVersionResult) => void): Request<FraudDetector.Types.UpdateModelVersionResult, AWSError>;
  /**
   * Updates the status of a model version. You can perform the following status updates:   Change the TRAINING_COMPLETE status to ACTIVE.   Change ACTIVE to INACTIVE.  
   */
  updateModelVersionStatus(params: FraudDetector.Types.UpdateModelVersionStatusRequest, callback?: (err: AWSError, data: FraudDetector.Types.UpdateModelVersionStatusResult) => void): Request<FraudDetector.Types.UpdateModelVersionStatusResult, AWSError>;
  /**
   * Updates the status of a model version. You can perform the following status updates:   Change the TRAINING_COMPLETE status to ACTIVE.   Change ACTIVE to INACTIVE.  
   */
  updateModelVersionStatus(callback?: (err: AWSError, data: FraudDetector.Types.UpdateModelVersionStatusResult) => void): Request<FraudDetector.Types.UpdateModelVersionStatusResult, AWSError>;
  /**
   * Updates a rule's metadata. The description attribute can be updated.
   */
  updateRuleMetadata(params: FraudDetector.Types.UpdateRuleMetadataRequest, callback?: (err: AWSError, data: FraudDetector.Types.UpdateRuleMetadataResult) => void): Request<FraudDetector.Types.UpdateRuleMetadataResult, AWSError>;
  /**
   * Updates a rule's metadata. The description attribute can be updated.
   */
  updateRuleMetadata(callback?: (err: AWSError, data: FraudDetector.Types.UpdateRuleMetadataResult) => void): Request<FraudDetector.Types.UpdateRuleMetadataResult, AWSError>;
  /**
   * Updates a rule version resulting in a new rule version. Updates a rule version resulting in a new rule version (version 1, 2, 3 ...). 
   */
  updateRuleVersion(params: FraudDetector.Types.UpdateRuleVersionRequest, callback?: (err: AWSError, data: FraudDetector.Types.UpdateRuleVersionResult) => void): Request<FraudDetector.Types.UpdateRuleVersionResult, AWSError>;
  /**
   * Updates a rule version resulting in a new rule version. Updates a rule version resulting in a new rule version (version 1, 2, 3 ...). 
   */
  updateRuleVersion(callback?: (err: AWSError, data: FraudDetector.Types.UpdateRuleVersionResult) => void): Request<FraudDetector.Types.UpdateRuleVersionResult, AWSError>;
  /**
   * Updates a variable.
   */
  updateVariable(params: FraudDetector.Types.UpdateVariableRequest, callback?: (err: AWSError, data: FraudDetector.Types.UpdateVariableResult) => void): Request<FraudDetector.Types.UpdateVariableResult, AWSError>;
  /**
   * Updates a variable.
   */
  updateVariable(callback?: (err: AWSError, data: FraudDetector.Types.UpdateVariableResult) => void): Request<FraudDetector.Types.UpdateVariableResult, AWSError>;
}
declare namespace FraudDetector {
  export type AsyncJobStatus = "IN_PROGRESS_INITIALIZING"|"IN_PROGRESS"|"CANCEL_IN_PROGRESS"|"CANCELED"|"COMPLETE"|"FAILED"|string;
  export interface BatchCreateVariableError {
    /**
     * The name.
     */
    name?: string;
    /**
     * The error code. 
     */
    code?: integer;
    /**
     * The error message.
     */
    message?: string;
  }
  export type BatchCreateVariableErrorList = BatchCreateVariableError[];
  export interface BatchCreateVariableRequest {
    /**
     * The list of variables for the batch create variable request.
     */
    variableEntries: VariableEntryList;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface BatchCreateVariableResult {
    /**
     * Provides the errors for the BatchCreateVariable request.
     */
    errors?: BatchCreateVariableErrorList;
  }
  export interface BatchGetVariableError {
    /**
     * The error name. 
     */
    name?: string;
    /**
     * The error code. 
     */
    code?: integer;
    /**
     * The error message.
     */
    message?: string;
  }
  export type BatchGetVariableErrorList = BatchGetVariableError[];
  export interface BatchGetVariableRequest {
    /**
     * The list of variable names to get.
     */
    names: NameList;
  }
  export interface BatchGetVariableResult {
    /**
     * The returned variables.
     */
    variables?: VariableList;
    /**
     * The errors from the request.
     */
    errors?: BatchGetVariableErrorList;
  }
  export interface BatchImport {
    /**
     * The ID of the batch import job. 
     */
    jobId?: identifier;
    /**
     * The status of the batch import job.
     */
    status?: AsyncJobStatus;
    /**
     * The reason batch import job failed.
     */
    failureReason?: string;
    /**
     * Timestamp of when the batch import job started.
     */
    startTime?: time;
    /**
     * Timestamp of when batch import job completed.
     */
    completionTime?: time;
    /**
     * The Amazon S3 location of your data file for batch import.
     */
    inputPath?: s3BucketLocation;
    /**
     * The Amazon S3 location of your output file.
     */
    outputPath?: s3BucketLocation;
    /**
     * The name of the event type.
     */
    eventTypeName?: identifier;
    /**
     * The ARN of the IAM role to use for this job request.
     */
    iamRoleArn?: iamRoleArn;
    /**
     * The ARN of the batch import job.
     */
    arn?: fraudDetectorArn;
    /**
     * The number of records processed by batch import job.
     */
    processedRecordsCount?: Integer;
    /**
     * The number of records that failed to import. 
     */
    failedRecordsCount?: Integer;
    /**
     * The total number of records in the batch import job.
     */
    totalRecordsCount?: Integer;
  }
  export type BatchImportList = BatchImport[];
  export interface BatchPrediction {
    /**
     * The job ID for the batch prediction.
     */
    jobId?: identifier;
    /**
     * The batch prediction status.
     */
    status?: AsyncJobStatus;
    /**
     * The reason a batch prediction job failed.
     */
    failureReason?: string;
    /**
     * Timestamp of when the batch prediction job started.
     */
    startTime?: time;
    /**
     * Timestamp of when the batch prediction job completed.
     */
    completionTime?: time;
    /**
     * Timestamp of most recent heartbeat indicating the batch prediction job was making progress.
     */
    lastHeartbeatTime?: time;
    /**
     * The Amazon S3 location of your training file.
     */
    inputPath?: s3BucketLocation;
    /**
     * The Amazon S3 location of your output file.
     */
    outputPath?: s3BucketLocation;
    /**
     * The name of the event type.
     */
    eventTypeName?: identifier;
    /**
     * The name of the detector.
     */
    detectorName?: identifier;
    /**
     * The detector version. 
     */
    detectorVersion?: floatVersionString;
    /**
     * The ARN of the IAM role to use for this job request.
     */
    iamRoleArn?: iamRoleArn;
    /**
     * The ARN of batch prediction job.
     */
    arn?: fraudDetectorArn;
    /**
     * The number of records processed by the batch prediction job.
     */
    processedRecordsCount?: Integer;
    /**
     * The total number of records in the batch prediction job.
     */
    totalRecordsCount?: Integer;
  }
  export type BatchPredictionList = BatchPrediction[];
  export interface CancelBatchImportJobRequest {
    /**
     *  The ID of an in-progress batch import job to cancel.  Amazon Fraud Detector will throw an error if the batch import job is in FAILED, CANCELED, or COMPLETED state.
     */
    jobId: identifier;
  }
  export interface CancelBatchImportJobResult {
  }
  export interface CancelBatchPredictionJobRequest {
    /**
     * The ID of the batch prediction job to cancel.
     */
    jobId: identifier;
  }
  export interface CancelBatchPredictionJobResult {
  }
  export interface CreateBatchImportJobRequest {
    /**
     * The ID of the batch import job. The ID cannot be of a past job, unless the job exists in CREATE_FAILED state.
     */
    jobId: identifier;
    /**
     * The URI that points to the Amazon S3 location of your data file.
     */
    inputPath: s3BucketLocation;
    /**
     * The URI that points to the Amazon S3 location for storing your results. 
     */
    outputPath: s3BucketLocation;
    /**
     * The name of the event type.
     */
    eventTypeName: identifier;
    /**
     * The ARN of the IAM role created for Amazon S3 bucket that holds your data file. The IAM role must have read and write permissions to both input and output S3 buckets.
     */
    iamRoleArn: iamRoleArn;
    /**
     * A collection of key-value pairs associated with this request. 
     */
    tags?: tagList;
  }
  export interface CreateBatchImportJobResult {
  }
  export interface CreateBatchPredictionJobRequest {
    /**
     * The ID of the batch prediction job.
     */
    jobId: identifier;
    /**
     * The Amazon S3 location of your training file.
     */
    inputPath: s3BucketLocation;
    /**
     * The Amazon S3 location of your output file.
     */
    outputPath: s3BucketLocation;
    /**
     * The name of the event type.
     */
    eventTypeName: identifier;
    /**
     * The name of the detector.
     */
    detectorName: identifier;
    /**
     * The detector version.
     */
    detectorVersion?: wholeNumberVersionString;
    /**
     * The ARN of the IAM role to use for this job request.
     */
    iamRoleArn: iamRoleArn;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface CreateBatchPredictionJobResult {
  }
  export interface CreateDetectorVersionRequest {
    /**
     * The ID of the detector under which you want to create a new version.
     */
    detectorId: identifier;
    /**
     * The description of the detector version.
     */
    description?: description;
    /**
     * The Amazon Sagemaker model endpoints to include in the detector version.
     */
    externalModelEndpoints?: ListOfStrings;
    /**
     * The rules to include in the detector version.
     */
    rules: RuleList;
    /**
     * The model versions to include in the detector version.
     */
    modelVersions?: ListOfModelVersions;
    /**
     * The rule execution mode for the rules included in the detector version. You can define and edit the rule mode at the detector version level, when it is in draft status. If you specify FIRST_MATCHED, Amazon Fraud Detector evaluates rules sequentially, first to last, stopping at the first matched rule. Amazon Fraud dectector then provides the outcomes for that single rule. If you specifiy ALL_MATCHED, Amazon Fraud Detector evaluates all rules and returns the outcomes for all matched rules.  The default behavior is FIRST_MATCHED.
     */
    ruleExecutionMode?: RuleExecutionMode;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface CreateDetectorVersionResult {
    /**
     * The ID for the created version's parent detector.
     */
    detectorId?: identifier;
    /**
     * The ID for the created detector. 
     */
    detectorVersionId?: wholeNumberVersionString;
    /**
     * The status of the detector version.
     */
    status?: DetectorVersionStatus;
  }
  export interface CreateModelRequest {
    /**
     * The model ID.
     */
    modelId: modelIdentifier;
    /**
     * The model type. 
     */
    modelType: ModelTypeEnum;
    /**
     * The model description. 
     */
    description?: description;
    /**
     * The name of the event type.
     */
    eventTypeName: string;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface CreateModelResult {
  }
  export interface CreateModelVersionRequest {
    /**
     * The model ID. 
     */
    modelId: modelIdentifier;
    /**
     * The model type.
     */
    modelType: ModelTypeEnum;
    /**
     * The training data source location in Amazon S3. 
     */
    trainingDataSource: TrainingDataSourceEnum;
    /**
     * The training data schema.
     */
    trainingDataSchema: TrainingDataSchema;
    /**
     * Details of the external events data used for model version training. Required if trainingDataSource is EXTERNAL_EVENTS.
     */
    externalEventsDetail?: ExternalEventsDetail;
    /**
     * Details of the ingested events data used for model version training. Required if trainingDataSource is INGESTED_EVENTS.
     */
    ingestedEventsDetail?: IngestedEventsDetail;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface CreateModelVersionResult {
    /**
     * The model ID.
     */
    modelId?: modelIdentifier;
    /**
     * The model type.
     */
    modelType?: ModelTypeEnum;
    /**
     * The model version number of the model version created.
     */
    modelVersionNumber?: floatVersionString;
    /**
     * The model version status. 
     */
    status?: string;
  }
  export interface CreateRuleRequest {
    /**
     * The rule ID.
     */
    ruleId: identifier;
    /**
     * The detector ID for the rule's parent detector.
     */
    detectorId: identifier;
    /**
     * The rule description.
     */
    description?: description;
    /**
     * The rule expression.
     */
    expression: ruleExpression;
    /**
     * The language of the rule.
     */
    language: Language;
    /**
     * The outcome or outcomes returned when the rule expression matches.
     */
    outcomes: NonEmptyListOfStrings;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface CreateRuleResult {
    /**
     * The created rule.
     */
    rule?: Rule;
  }
  export interface CreateVariableRequest {
    /**
     * The name of the variable.
     */
    name: string;
    /**
     * The data type.
     */
    dataType: DataType;
    /**
     * The source of the data.
     */
    dataSource: DataSource;
    /**
     * The default value for the variable when no value is received.
     */
    defaultValue: string;
    /**
     * The description.
     */
    description?: string;
    /**
     * The variable type. For more information see Variable types.  Valid Values: AUTH_CODE | AVS | BILLING_ADDRESS_L1 | BILLING_ADDRESS_L2 | BILLING_CITY | BILLING_COUNTRY | BILLING_NAME | BILLING_PHONE | BILLING_STATE | BILLING_ZIP | CARD_BIN | CATEGORICAL | CURRENCY_CODE | EMAIL_ADDRESS | FINGERPRINT | FRAUD_LABEL | FREE_FORM_TEXT | IP_ADDRESS | NUMERIC | ORDER_ID | PAYMENT_TYPE | PHONE_NUMBER | PRICE | PRODUCT_CATEGORY | SHIPPING_ADDRESS_L1 | SHIPPING_ADDRESS_L2 | SHIPPING_CITY | SHIPPING_COUNTRY | SHIPPING_NAME | SHIPPING_PHONE | SHIPPING_STATE | SHIPPING_ZIP | USERAGENT 
     */
    variableType?: string;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface CreateVariableResult {
  }
  export type CsvIndexToVariableMap = {[key: string]: string};
  export type DataSource = "EVENT"|"MODEL_SCORE"|"EXTERNAL_MODEL_SCORE"|string;
  export type DataType = "STRING"|"INTEGER"|"FLOAT"|"BOOLEAN"|string;
  export interface DataValidationMetrics {
    /**
     * The file-specific model training validation messages.
     */
    fileLevelMessages?: fileValidationMessageList;
    /**
     * The field-specific model training validation messages.
     */
    fieldLevelMessages?: fieldValidationMessageList;
  }
  export type DeleteAuditHistory = boolean;
  export interface DeleteBatchImportJobRequest {
    /**
     * The ID of the batch import job to delete. 
     */
    jobId: identifier;
  }
  export interface DeleteBatchImportJobResult {
  }
  export interface DeleteBatchPredictionJobRequest {
    /**
     * The ID of the batch prediction job to delete.
     */
    jobId: identifier;
  }
  export interface DeleteBatchPredictionJobResult {
  }
  export interface DeleteDetectorRequest {
    /**
     * The ID of the detector to delete.
     */
    detectorId: identifier;
  }
  export interface DeleteDetectorResult {
  }
  export interface DeleteDetectorVersionRequest {
    /**
     * The ID of the parent detector for the detector version to delete.
     */
    detectorId: identifier;
    /**
     * The ID of the detector version to delete.
     */
    detectorVersionId: wholeNumberVersionString;
  }
  export interface DeleteDetectorVersionResult {
  }
  export interface DeleteEntityTypeRequest {
    /**
     * The name of the entity type to delete.
     */
    name: identifier;
  }
  export interface DeleteEntityTypeResult {
  }
  export interface DeleteEventRequest {
    /**
     * The ID of the event to delete.
     */
    eventId: identifier;
    /**
     * The name of the event type.
     */
    eventTypeName: identifier;
    /**
     * Specifies whether or not to delete any predictions associated with the event.
     */
    deleteAuditHistory?: DeleteAuditHistory;
  }
  export interface DeleteEventResult {
  }
  export interface DeleteEventTypeRequest {
    /**
     * The name of the event type to delete.
     */
    name: identifier;
  }
  export interface DeleteEventTypeResult {
  }
  export interface DeleteEventsByEventTypeRequest {
    /**
     * The name of the event type.
     */
    eventTypeName: identifier;
  }
  export interface DeleteEventsByEventTypeResult {
    /**
     * Name of event type for which to delete the events.
     */
    eventTypeName?: identifier;
    /**
     * The status of the delete request.
     */
    eventsDeletionStatus?: string;
  }
  export interface DeleteExternalModelRequest {
    /**
     * The endpoint of the Amazon Sagemaker model to delete.
     */
    modelEndpoint: sageMakerEndpointIdentifier;
  }
  export interface DeleteExternalModelResult {
  }
  export interface DeleteLabelRequest {
    /**
     * The name of the label to delete.
     */
    name: identifier;
  }
  export interface DeleteLabelResult {
  }
  export interface DeleteModelRequest {
    /**
     * The model ID of the model to delete.
     */
    modelId: modelIdentifier;
    /**
     * The model type of the model to delete.
     */
    modelType: ModelTypeEnum;
  }
  export interface DeleteModelResult {
  }
  export interface DeleteModelVersionRequest {
    /**
     * The model ID of the model version to delete.
     */
    modelId: modelIdentifier;
    /**
     * The model type of the model version to delete.
     */
    modelType: ModelTypeEnum;
    /**
     * The model version number of the model version to delete.
     */
    modelVersionNumber: floatVersionString;
  }
  export interface DeleteModelVersionResult {
  }
  export interface DeleteOutcomeRequest {
    /**
     * The name of the outcome to delete.
     */
    name: identifier;
  }
  export interface DeleteOutcomeResult {
  }
  export interface DeleteRuleRequest {
    rule: Rule;
  }
  export interface DeleteRuleResult {
  }
  export interface DeleteVariableRequest {
    /**
     * The name of the variable to delete.
     */
    name: string;
  }
  export interface DeleteVariableResult {
  }
  export interface DescribeDetectorRequest {
    /**
     * The detector ID.
     */
    detectorId: identifier;
    /**
     * The next token from the previous response.
     */
    nextToken?: string;
    /**
     * The maximum number of results to return for the request.
     */
    maxResults?: DetectorVersionMaxResults;
  }
  export interface DescribeDetectorResult {
    /**
     * The detector ID.
     */
    detectorId?: identifier;
    /**
     * The status and description for each detector version.
     */
    detectorVersionSummaries?: DetectorVersionSummaryList;
    /**
     * The next token to be used for subsequent requests.
     */
    nextToken?: string;
    /**
     * The detector ARN.
     */
    arn?: fraudDetectorArn;
  }
  export interface DescribeModelVersionsRequest {
    /**
     * The model ID.
     */
    modelId?: modelIdentifier;
    /**
     * The model version number.
     */
    modelVersionNumber?: floatVersionString;
    /**
     * The model type.
     */
    modelType?: ModelTypeEnum;
    /**
     * The next token from the previous results.
     */
    nextToken?: string;
    /**
     * The maximum number of results to return.
     */
    maxResults?: modelsMaxPageSize;
  }
  export interface DescribeModelVersionsResult {
    /**
     * The model version details.
     */
    modelVersionDetails?: modelVersionDetailList;
    /**
     * The next token.
     */
    nextToken?: string;
  }
  export interface Detector {
    /**
     * The detector ID.
     */
    detectorId?: identifier;
    /**
     * The detector description.
     */
    description?: description;
    /**
     * The name of the event type.
     */
    eventTypeName?: identifier;
    /**
     * Timestamp of when the detector was last updated.
     */
    lastUpdatedTime?: time;
    /**
     * Timestamp of when the detector was created.
     */
    createdTime?: time;
    /**
     * The detector ARN.
     */
    arn?: fraudDetectorArn;
  }
  export type DetectorList = Detector[];
  export type DetectorVersionMaxResults = number;
  export type DetectorVersionStatus = "DRAFT"|"ACTIVE"|"INACTIVE"|string;
  export interface DetectorVersionSummary {
    /**
     * The detector version ID. 
     */
    detectorVersionId?: wholeNumberVersionString;
    /**
     * The detector version status. 
     */
    status?: DetectorVersionStatus;
    /**
     * The detector version description. 
     */
    description?: description;
    /**
     * Timestamp of when the detector version was last updated.
     */
    lastUpdatedTime?: time;
  }
  export type DetectorVersionSummaryList = DetectorVersionSummary[];
  export type DetectorsMaxResults = number;
  export interface Entity {
    /**
     * The entity type.
     */
    entityType: string;
    /**
     * The entity ID. If you do not know the entityId, you can pass unknown, which is areserved string literal.
     */
    entityId: entityRestrictedString;
  }
  export interface EntityType {
    /**
     * The entity type name.
     */
    name?: string;
    /**
     * The entity type description.
     */
    description?: description;
    /**
     * Timestamp of when the entity type was last updated.
     */
    lastUpdatedTime?: time;
    /**
     * Timestamp of when the entity type was created.
     */
    createdTime?: time;
    /**
     * The entity type ARN.
     */
    arn?: fraudDetectorArn;
  }
  export interface Event {
    /**
     * The event ID.
     */
    eventId?: string;
    /**
     * The event type.
     */
    eventTypeName?: string;
    /**
     * The timestamp that defines when the event under evaluation occurred. The timestamp must be specified using ISO 8601 standard in UTC.
     */
    eventTimestamp?: string;
    /**
     * Names of the event type's variables you defined in Amazon Fraud Detector to represent data elements and their corresponding values for the event you are sending for evaluation.
     */
    eventVariables?: EventAttributeMap;
    /**
     * The label associated with the event.
     */
    currentLabel?: string;
    /**
     * The timestamp associated with the label to update. The timestamp must be specified using ISO 8601 standard in UTC.
     */
    labelTimestamp?: string;
    /**
     * The event entities.
     */
    entities?: listOfEntities;
  }
  export type EventAttributeMap = {[key: string]: attributeValue};
  export type EventIngestion = "ENABLED"|"DISABLED"|string;
  export interface EventType {
    /**
     * The event type name.
     */
    name?: string;
    /**
     * The event type description.
     */
    description?: description;
    /**
     * The event type event variables.
     */
    eventVariables?: ListOfStrings;
    /**
     * The event type labels.
     */
    labels?: ListOfStrings;
    /**
     * The event type entity types.
     */
    entityTypes?: NonEmptyListOfStrings;
    /**
     * If Enabled, Amazon Fraud Detector stores event data when you generate a prediction and uses that data to update calculated variables in near real-time. Amazon Fraud Detector uses this data, known as INGESTED_EVENTS, to train your model and improve fraud predictions.
     */
    eventIngestion?: EventIngestion;
    /**
     * Data about the stored events.
     */
    ingestedEventStatistics?: IngestedEventStatistics;
    /**
     * Timestamp of when the event type was last updated.
     */
    lastUpdatedTime?: time;
    /**
     * Timestamp of when the event type was created.
     */
    createdTime?: time;
    /**
     * The entity type ARN.
     */
    arn?: fraudDetectorArn;
  }
  export type EventVariableMap = {[key: string]: variableValue};
  export interface ExternalEventsDetail {
    /**
     * The Amazon S3 bucket location for the data.
     */
    dataLocation: s3BucketLocation;
    /**
     * The ARN of the role that provides Amazon Fraud Detector access to the data location.
     */
    dataAccessRoleArn: iamRoleArn;
  }
  export interface ExternalModel {
    /**
     * The Amazon SageMaker model endpoints.
     */
    modelEndpoint?: string;
    /**
     * The source of the model.
     */
    modelSource?: ModelSource;
    /**
     * The role used to invoke the model. 
     */
    invokeModelEndpointRoleArn?: string;
    /**
     * The input configuration.
     */
    inputConfiguration?: ModelInputConfiguration;
    /**
     * The output configuration.
     */
    outputConfiguration?: ModelOutputConfiguration;
    /**
     * The Amazon Fraud Detector status for the external model endpoint
     */
    modelEndpointStatus?: ModelEndpointStatus;
    /**
     * Timestamp of when the model was last updated.
     */
    lastUpdatedTime?: time;
    /**
     * Timestamp of when the model was last created.
     */
    createdTime?: time;
    /**
     * The model ARN.
     */
    arn?: fraudDetectorArn;
  }
  export type ExternalModelEndpointDataBlobMap = {[key: string]: ModelEndpointDataBlob};
  export type ExternalModelList = ExternalModel[];
  export interface ExternalModelOutputs {
    /**
     * The Amazon SageMaker model.
     */
    externalModel?: ExternalModelSummary;
    /**
     * The fraud prediction scores from Amazon SageMaker model.
     */
    outputs?: ExternalModelPredictionMap;
  }
  export type ExternalModelPredictionMap = {[key: string]: string};
  export interface ExternalModelSummary {
    /**
     * The endpoint of the Amazon SageMaker model.
     */
    modelEndpoint?: string;
    /**
     * The source of the model.
     */
    modelSource?: ModelSource;
  }
  export type ExternalModelsMaxResults = number;
  export interface FieldValidationMessage {
    /**
     * The field name.
     */
    fieldName?: string;
    /**
     * The message ID.
     */
    identifier?: string;
    /**
     * The message title.
     */
    title?: string;
    /**
     * The message content.
     */
    content?: string;
    /**
     * The message type.
     */
    type?: string;
  }
  export interface FileValidationMessage {
    /**
     * The message title.
     */
    title?: string;
    /**
     * The message content.
     */
    content?: string;
    /**
     * The message type.
     */
    type?: string;
  }
  export interface GetBatchImportJobsRequest {
    /**
     * The ID of the batch import job to get.
     */
    jobId?: identifier;
    /**
     * The maximum number of objects to return for request.
     */
    maxResults?: batchImportsMaxPageSize;
    /**
     * The next token from the previous request.
     */
    nextToken?: string;
  }
  export interface GetBatchImportJobsResult {
    /**
     * An array containing the details of each batch import job.
     */
    batchImports?: BatchImportList;
    /**
     * The next token for the subsequent resquest.
     */
    nextToken?: string;
  }
  export interface GetBatchPredictionJobsRequest {
    /**
     * The batch prediction job for which to get the details.
     */
    jobId?: identifier;
    /**
     * The maximum number of objects to return for the request.
     */
    maxResults?: batchPredictionsMaxPageSize;
    /**
     * The next token from the previous request.
     */
    nextToken?: string;
  }
  export interface GetBatchPredictionJobsResult {
    /**
     * An array containing the details of each batch prediction job.
     */
    batchPredictions?: BatchPredictionList;
    /**
     * The next token for the subsequent request.
     */
    nextToken?: string;
  }
  export interface GetDeleteEventsByEventTypeStatusRequest {
    /**
     * Name of event type for which to get the deletion status.
     */
    eventTypeName: identifier;
  }
  export interface GetDeleteEventsByEventTypeStatusResult {
    /**
     * The event type name.
     */
    eventTypeName?: identifier;
    /**
     * The deletion status.
     */
    eventsDeletionStatus?: AsyncJobStatus;
  }
  export interface GetDetectorVersionRequest {
    /**
     * The detector ID.
     */
    detectorId: identifier;
    /**
     * The detector version ID.
     */
    detectorVersionId: wholeNumberVersionString;
  }
  export interface GetDetectorVersionResult {
    /**
     * The detector ID.
     */
    detectorId?: identifier;
    /**
     * The detector version ID.
     */
    detectorVersionId?: wholeNumberVersionString;
    /**
     * The detector version description.
     */
    description?: description;
    /**
     * The Amazon SageMaker model endpoints included in the detector version.
     */
    externalModelEndpoints?: ListOfStrings;
    /**
     * The model versions included in the detector version. 
     */
    modelVersions?: ListOfModelVersions;
    /**
     * The rules included in the detector version.
     */
    rules?: RuleList;
    /**
     * The status of the detector version.
     */
    status?: DetectorVersionStatus;
    /**
     * The timestamp when the detector version was last updated. 
     */
    lastUpdatedTime?: time;
    /**
     * The timestamp when the detector version was created. 
     */
    createdTime?: time;
    /**
     * The execution mode of the rule in the dectector  FIRST_MATCHED indicates that Amazon Fraud Detector evaluates rules sequentially, first to last, stopping at the first matched rule. Amazon Fraud dectector then provides the outcomes for that single rule.  ALL_MATCHED indicates that Amazon Fraud Detector evaluates all rules and returns the outcomes for all matched rules. You can define and edit the rule mode at the detector version level, when it is in draft status.
     */
    ruleExecutionMode?: RuleExecutionMode;
    /**
     * The detector version ARN.
     */
    arn?: fraudDetectorArn;
  }
  export interface GetDetectorsRequest {
    /**
     * The detector ID.
     */
    detectorId?: identifier;
    /**
     * The next token for the subsequent request.
     */
    nextToken?: string;
    /**
     * The maximum number of objects to return for the request.
     */
    maxResults?: DetectorsMaxResults;
  }
  export interface GetDetectorsResult {
    /**
     * The detectors.
     */
    detectors?: DetectorList;
    /**
     * The next page token.
     */
    nextToken?: string;
  }
  export interface GetEntityTypesRequest {
    /**
     * The name.
     */
    name?: identifier;
    /**
     * The next token for the subsequent request.
     */
    nextToken?: string;
    /**
     * The maximum number of objects to return for the request.
     */
    maxResults?: entityTypesMaxResults;
  }
  export interface GetEntityTypesResult {
    /**
     * An array of entity types.
     */
    entityTypes?: entityTypeList;
    /**
     * The next page token.
     */
    nextToken?: string;
  }
  export interface GetEventPredictionRequest {
    /**
     * The detector ID.
     */
    detectorId: string;
    /**
     * The detector version ID.
     */
    detectorVersionId?: wholeNumberVersionString;
    /**
     * The unique ID used to identify the event.
     */
    eventId: string;
    /**
     * The event type associated with the detector specified for the prediction.
     */
    eventTypeName: string;
    /**
     * The entity type (associated with the detector's event type) and specific entity ID representing who performed the event. If an entity id is not available, use "UNKNOWN."
     */
    entities: listOfEntities;
    /**
     * Timestamp that defines when the event under evaluation occurred. The timestamp must be specified using ISO 8601 standard in UTC.
     */
    eventTimestamp: utcTimestampISO8601;
    /**
     * Names of the event type's variables you defined in Amazon Fraud Detector to represent data elements and their corresponding values for the event you are sending for evaluation.  You must provide at least one eventVariable  To ensure most accurate fraud prediction and to simplify your data preparation, Amazon Fraud Detector will replace all missing variables or values as follows:  For Amazon Fraud Detector trained models:  If a null value is provided explicitly for a variable or if a variable is missing, model will replace the null value or the missing variable (no variable name in the eventVariables map) with calculated default mean/medians for numeric variables and with special values for categorical variables.  For imported SageMaker models:  If a null value is provided explicitly for a variable, the model and rules will use “null” as the value. If a variable is not provided (no variable name in the eventVariables map), model and rules will use the default value that is provided for the variable. 
     */
    eventVariables: EventVariableMap;
    /**
     * The Amazon SageMaker model endpoint input data blobs.
     */
    externalModelEndpointDataBlobs?: ExternalModelEndpointDataBlobMap;
  }
  export interface GetEventPredictionResult {
    /**
     * The model scores. Amazon Fraud Detector generates model scores between 0 and 1000, where 0 is low fraud risk and 1000 is high fraud risk. Model scores are directly related to the false positive rate (FPR). For example, a score of 600 corresponds to an estimated 10% false positive rate whereas a score of 900 corresponds to an estimated 2% false positive rate.
     */
    modelScores?: ListOfModelScores;
    /**
     * The results from the rules.
     */
    ruleResults?: ListOfRuleResults;
    /**
     * The model scores for Amazon SageMaker models.
     */
    externalModelOutputs?: ListOfExternalModelOutputs;
  }
  export interface GetEventRequest {
    /**
     * The ID of the event to retrieve.
     */
    eventId: string;
    /**
     * The event type of the event to retrieve.
     */
    eventTypeName: string;
  }
  export interface GetEventResult {
    /**
     * The details of the event.
     */
    event?: Event;
  }
  export interface GetEventTypesRequest {
    /**
     * The name.
     */
    name?: identifier;
    /**
     * The next token for the subsequent request.
     */
    nextToken?: string;
    /**
     * The maximum number of objects to return for the request.
     */
    maxResults?: eventTypesMaxResults;
  }
  export interface GetEventTypesResult {
    /**
     * An array of event types.
     */
    eventTypes?: eventTypeList;
    /**
     * The next page token.
     */
    nextToken?: string;
  }
  export interface GetExternalModelsRequest {
    /**
     * The Amazon SageMaker model endpoint.
     */
    modelEndpoint?: string;
    /**
     * The next page token for the request.
     */
    nextToken?: string;
    /**
     * The maximum number of objects to return for the request.
     */
    maxResults?: ExternalModelsMaxResults;
  }
  export interface GetExternalModelsResult {
    /**
     * Gets the Amazon SageMaker models.
     */
    externalModels?: ExternalModelList;
    /**
     * The next page token to be used in subsequent requests.
     */
    nextToken?: string;
  }
  export interface GetKMSEncryptionKeyResult {
    /**
     * The KMS encryption key.
     */
    kmsKey?: KMSKey;
  }
  export interface GetLabelsRequest {
    /**
     * The name of the label or labels to get.
     */
    name?: identifier;
    /**
     * The next token for the subsequent request.
     */
    nextToken?: string;
    /**
     * The maximum number of objects to return for the request.
     */
    maxResults?: labelsMaxResults;
  }
  export interface GetLabelsResult {
    /**
     * An array of labels.
     */
    labels?: labelList;
    /**
     * The next page token.
     */
    nextToken?: string;
  }
  export interface GetModelVersionRequest {
    /**
     * The model ID.
     */
    modelId: modelIdentifier;
    /**
     * The model type.
     */
    modelType: ModelTypeEnum;
    /**
     * The model version number.
     */
    modelVersionNumber: floatVersionString;
  }
  export interface GetModelVersionResult {
    /**
     * The model ID.
     */
    modelId?: modelIdentifier;
    /**
     * The model type.
     */
    modelType?: ModelTypeEnum;
    /**
     * The model version number.
     */
    modelVersionNumber?: floatVersionString;
    /**
     * The training data source.
     */
    trainingDataSource?: TrainingDataSourceEnum;
    /**
     * The training data schema.
     */
    trainingDataSchema?: TrainingDataSchema;
    /**
     * The details of the external events data used for training the model version. This will be populated if the trainingDataSource is EXTERNAL_EVENTS 
     */
    externalEventsDetail?: ExternalEventsDetail;
    /**
     * The details of the ingested events data used for training the model version. This will be populated if the trainingDataSource is INGESTED_EVENTS.
     */
    ingestedEventsDetail?: IngestedEventsDetail;
    /**
     * The model version status. Possible values are:    TRAINING_IN_PROGRESS     TRAINING_COMPLETE     ACTIVATE_REQUESTED     ACTIVATE_IN_PROGRESS     ACTIVE     INACTIVATE_REQUESTED     INACTIVATE_IN_PROGRESS     INACTIVE     ERROR   
     */
    status?: string;
    /**
     * The model version ARN.
     */
    arn?: fraudDetectorArn;
  }
  export interface GetModelsRequest {
    /**
     * The model ID.
     */
    modelId?: modelIdentifier;
    /**
     * The model type.
     */
    modelType?: ModelTypeEnum;
    /**
     * The next token for the subsequent request.
     */
    nextToken?: string;
    /**
     * The maximum number of objects to return for the request. 
     */
    maxResults?: modelsMaxPageSize;
  }
  export interface GetModelsResult {
    /**
     * The next page token to be used in subsequent requests.
     */
    nextToken?: string;
    /**
     * The array of models.
     */
    models?: modelList;
  }
  export interface GetOutcomesRequest {
    /**
     * The name of the outcome or outcomes to get.
     */
    name?: identifier;
    /**
     * The next page token for the request. 
     */
    nextToken?: string;
    /**
     * The maximum number of objects to return for the request. 
     */
    maxResults?: OutcomesMaxResults;
  }
  export interface GetOutcomesResult {
    /**
     * The outcomes. 
     */
    outcomes?: OutcomeList;
    /**
     * The next page token for subsequent requests.
     */
    nextToken?: string;
  }
  export interface GetRulesRequest {
    /**
     * The rule ID.
     */
    ruleId?: identifier;
    /**
     * The detector ID.
     */
    detectorId: identifier;
    /**
     * The rule version.
     */
    ruleVersion?: wholeNumberVersionString;
    /**
     * The next page token.
     */
    nextToken?: string;
    /**
     * The maximum number of rules to return for the request.
     */
    maxResults?: RulesMaxResults;
  }
  export interface GetRulesResult {
    /**
     * The details of the requested rule.
     */
    ruleDetails?: RuleDetailList;
    /**
     * The next page token to be used in subsequent requests.
     */
    nextToken?: string;
  }
  export interface GetVariablesRequest {
    /**
     * The name of the variable. 
     */
    name?: string;
    /**
     * The next page token of the get variable request. 
     */
    nextToken?: string;
    /**
     * The max size per page determined for the get variable request. 
     */
    maxResults?: VariablesMaxResults;
  }
  export interface GetVariablesResult {
    /**
     * The names of the variables returned. 
     */
    variables?: VariableList;
    /**
     * The next page token to be used in subsequent requests. 
     */
    nextToken?: string;
  }
  export interface IngestedEventStatistics {
    /**
     * The number of stored events.
     */
    numberOfEvents?: Long;
    /**
     * The total size of the stored events.
     */
    eventDataSizeInBytes?: Long;
    /**
     * The oldest stored event.
     */
    leastRecentEvent?: time;
    /**
     * The newest stored event.
     */
    mostRecentEvent?: time;
    /**
     * Timestamp of when the stored event was last updated. 
     */
    lastUpdatedTime?: time;
  }
  export interface IngestedEventsDetail {
    /**
     * The start and stop time of the ingested events.
     */
    ingestedEventsTimeWindow: IngestedEventsTimeWindow;
  }
  export interface IngestedEventsTimeWindow {
    /**
     * Timestamp of the first ingensted event.
     */
    startTime: time;
    /**
     * Timestamp of the final ingested event.
     */
    endTime: time;
  }
  export type Integer = number;
  export type JsonKeyToVariableMap = {[key: string]: string};
  export interface KMSKey {
    /**
     * The encryption key ARN.
     */
    kmsEncryptionKeyArn?: KmsEncryptionKeyArn;
  }
  export type KmsEncryptionKeyArn = string;
  export interface Label {
    /**
     * The label name.
     */
    name?: string;
    /**
     * The label description.
     */
    description?: description;
    /**
     * Timestamp of when the label was last updated.
     */
    lastUpdatedTime?: time;
    /**
     * Timestamp of when the event type was created.
     */
    createdTime?: time;
    /**
     * The label ARN.
     */
    arn?: fraudDetectorArn;
  }
  export interface LabelSchema {
    /**
     * The label mapper maps the Amazon Fraud Detector supported model classification labels (FRAUD, LEGIT) to the appropriate event type labels. For example, if "FRAUD" and "LEGIT" are Amazon Fraud Detector supported labels, this mapper could be: {"FRAUD" =&gt; ["0"], "LEGIT" =&gt; ["1"]} or {"FRAUD" =&gt; ["false"], "LEGIT" =&gt; ["true"]} or {"FRAUD" =&gt; ["fraud", "abuse"], "LEGIT" =&gt; ["legit", "safe"]}. The value part of the mapper is a list, because you may have multiple label variants from your event type for a single Amazon Fraud Detector label. 
     */
    labelMapper: labelMapper;
    /**
     * The action to take for unlabeled events.
     */
    unlabeledEventsTreatment?: UnlabeledEventsTreatment;
  }
  export type Language = "DETECTORPL"|string;
  export type ListOfExternalModelOutputs = ExternalModelOutputs[];
  export type ListOfLogOddsMetrics = LogOddsMetric[];
  export type ListOfModelScores = ModelScores[];
  export type ListOfModelVersions = ModelVersion[];
  export type ListOfRuleResults = RuleResult[];
  export type ListOfStrings = string[];
  export interface ListTagsForResourceRequest {
    /**
     * The ARN that specifies the resource whose tags you want to list.
     */
    resourceARN: fraudDetectorArn;
    /**
     * The next token from the previous results.
     */
    nextToken?: string;
    /**
     * The maximum number of objects to return for the request. 
     */
    maxResults?: TagsMaxResults;
  }
  export interface ListTagsForResourceResult {
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
    /**
     * The next token for subsequent requests. 
     */
    nextToken?: string;
  }
  export interface LogOddsMetric {
    /**
     * The name of the variable.
     */
    variableName: string;
    /**
     * The type of variable.
     */
    variableType: string;
    /**
     * The relative importance of the variable. For more information, see Model variable importance.
     */
    variableImportance: float;
  }
  export type Long = number;
  export interface MetricDataPoint {
    /**
     * The false positive rate. This is the percentage of total legitimate events that are incorrectly predicted as fraud.
     */
    fpr?: float;
    /**
     * The percentage of fraud events correctly predicted as fraudulent as compared to all events predicted as fraudulent.
     */
    precision?: float;
    /**
     * The true positive rate. This is the percentage of total fraud the model detects. Also known as capture rate.
     */
    tpr?: float;
    /**
     * The model threshold that specifies an acceptable fraud capture rate. For example, a threshold of 500 means any model score 500 or above is labeled as fraud.
     */
    threshold?: float;
  }
  export interface Model {
    /**
     * The model ID.
     */
    modelId?: modelIdentifier;
    /**
     * The model type.
     */
    modelType?: ModelTypeEnum;
    /**
     * The model description.
     */
    description?: description;
    /**
     * The name of the event type.
     */
    eventTypeName?: string;
    /**
     * Timestamp of when the model was created.
     */
    createdTime?: time;
    /**
     * Timestamp of last time the model was updated.
     */
    lastUpdatedTime?: time;
    /**
     * The ARN of the model.
     */
    arn?: fraudDetectorArn;
  }
  export interface ModelEndpointDataBlob {
    /**
     * The byte buffer of the Amazon SageMaker model endpoint input data blob.
     */
    byteBuffer?: blob;
    /**
     * The content type of the Amazon SageMaker model endpoint input data blob. 
     */
    contentType?: contentType;
  }
  export type ModelEndpointStatus = "ASSOCIATED"|"DISSOCIATED"|string;
  export interface ModelInputConfiguration {
    /**
     * The event type name.
     */
    eventTypeName?: identifier;
    /**
     *  The format of the model input configuration. The format differs depending on if it is passed through to SageMaker or constructed by Amazon Fraud Detector.
     */
    format?: ModelInputDataFormat;
    /**
     * The event variables.
     */
    useEventVariables: UseEventVariables;
    /**
     *  Template for constructing the JSON input-data sent to SageMaker. At event-evaluation, the placeholders for variable names in the template will be replaced with the variable values before being sent to SageMaker. 
     */
    jsonInputTemplate?: modelInputTemplate;
    /**
     *  Template for constructing the CSV input-data sent to SageMaker. At event-evaluation, the placeholders for variable-names in the template will be replaced with the variable values before being sent to SageMaker. 
     */
    csvInputTemplate?: modelInputTemplate;
  }
  export type ModelInputDataFormat = "TEXT_CSV"|"APPLICATION_JSON"|string;
  export interface ModelOutputConfiguration {
    /**
     * The format of the model output configuration.
     */
    format: ModelOutputDataFormat;
    /**
     * A map of JSON keys in response from SageMaker to the Amazon Fraud Detector variables. 
     */
    jsonKeyToVariableMap?: JsonKeyToVariableMap;
    /**
     * A map of CSV index values in the SageMaker response to the Amazon Fraud Detector variables. 
     */
    csvIndexToVariableMap?: CsvIndexToVariableMap;
  }
  export type ModelOutputDataFormat = "TEXT_CSV"|"APPLICATION_JSONLINES"|string;
  export type ModelPredictionMap = {[key: string]: float};
  export interface ModelScores {
    /**
     * The model version.
     */
    modelVersion?: ModelVersion;
    /**
     * The model's fraud prediction scores.
     */
    scores?: ModelPredictionMap;
  }
  export type ModelSource = "SAGEMAKER"|string;
  export type ModelTypeEnum = "ONLINE_FRAUD_INSIGHTS"|"TRANSACTION_FRAUD_INSIGHTS"|string;
  export interface ModelVersion {
    /**
     * The model ID.
     */
    modelId: modelIdentifier;
    /**
     * The model type.
     */
    modelType: ModelTypeEnum;
    /**
     * The model version number.
     */
    modelVersionNumber: floatVersionString;
    /**
     * The model version ARN.
     */
    arn?: fraudDetectorArn;
  }
  export interface ModelVersionDetail {
    /**
     * The model ID.
     */
    modelId?: modelIdentifier;
    /**
     * The model type.
     */
    modelType?: ModelTypeEnum;
    /**
     * The model version number.
     */
    modelVersionNumber?: floatVersionString;
    /**
     * The status of the model version.
     */
    status?: string;
    /**
     * The model version training data source.
     */
    trainingDataSource?: TrainingDataSourceEnum;
    /**
     * The training data schema.
     */
    trainingDataSchema?: TrainingDataSchema;
    /**
     * The external events data details. This will be populated if the trainingDataSource for the model version is specified as EXTERNAL_EVENTS.
     */
    externalEventsDetail?: ExternalEventsDetail;
    /**
     * The ingested events data details. This will be populated if the trainingDataSource for the model version is specified as INGESTED_EVENTS.
     */
    ingestedEventsDetail?: IngestedEventsDetail;
    /**
     * The training results.
     */
    trainingResult?: TrainingResult;
    /**
     * The timestamp when the model was last updated.
     */
    lastUpdatedTime?: time;
    /**
     * The timestamp when the model was created.
     */
    createdTime?: time;
    /**
     * The model version ARN.
     */
    arn?: fraudDetectorArn;
  }
  export type ModelVersionStatus = "ACTIVE"|"INACTIVE"|"TRAINING_CANCELLED"|string;
  export type NameList = string[];
  export type NonEmptyListOfStrings = string[];
  export interface Outcome {
    /**
     * The outcome name.
     */
    name?: identifier;
    /**
     * The outcome description.
     */
    description?: description;
    /**
     * The timestamp when the outcome was last updated.
     */
    lastUpdatedTime?: time;
    /**
     * The timestamp when the outcome was created.
     */
    createdTime?: time;
    /**
     * The outcome ARN.
     */
    arn?: fraudDetectorArn;
  }
  export type OutcomeList = Outcome[];
  export type OutcomesMaxResults = number;
  export interface PutDetectorRequest {
    /**
     * The detector ID. 
     */
    detectorId: identifier;
    /**
     * The description of the detector.
     */
    description?: description;
    /**
     * The name of the event type.
     */
    eventTypeName: identifier;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface PutDetectorResult {
  }
  export interface PutEntityTypeRequest {
    /**
     * The name of the entity type.
     */
    name: identifier;
    /**
     * The description.
     */
    description?: description;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface PutEntityTypeResult {
  }
  export interface PutEventTypeRequest {
    /**
     * The name.
     */
    name: identifier;
    /**
     * The description of the event type.
     */
    description?: description;
    /**
     * The event type variables.
     */
    eventVariables: NonEmptyListOfStrings;
    /**
     * The event type labels.
     */
    labels?: ListOfStrings;
    /**
     * The entity type for the event type. Example entity types: customer, merchant, account.
     */
    entityTypes: NonEmptyListOfStrings;
    /**
     * Specifies if ingenstion is enabled or disabled.
     */
    eventIngestion?: EventIngestion;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface PutEventTypeResult {
  }
  export interface PutExternalModelRequest {
    /**
     * The model endpoints name.
     */
    modelEndpoint: sageMakerEndpointIdentifier;
    /**
     * The source of the model.
     */
    modelSource: ModelSource;
    /**
     * The IAM role used to invoke the model endpoint.
     */
    invokeModelEndpointRoleArn: string;
    /**
     * The model endpoint input configuration.
     */
    inputConfiguration: ModelInputConfiguration;
    /**
     * The model endpoint output configuration.
     */
    outputConfiguration: ModelOutputConfiguration;
    /**
     * The model endpoint’s status in Amazon Fraud Detector.
     */
    modelEndpointStatus: ModelEndpointStatus;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface PutExternalModelResult {
  }
  export interface PutKMSEncryptionKeyRequest {
    /**
     * The KMS encryption key ARN.
     */
    kmsEncryptionKeyArn: KmsEncryptionKeyArn;
  }
  export interface PutKMSEncryptionKeyResult {
  }
  export interface PutLabelRequest {
    /**
     * The label name.
     */
    name: identifier;
    /**
     * The label description.
     */
    description?: description;
    /**
     * 
     */
    tags?: tagList;
  }
  export interface PutLabelResult {
  }
  export interface PutOutcomeRequest {
    /**
     * The name of the outcome.
     */
    name: identifier;
    /**
     * The outcome description.
     */
    description?: description;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface PutOutcomeResult {
  }
  export interface Rule {
    /**
     * The detector for which the rule is associated.
     */
    detectorId: identifier;
    /**
     * The rule ID.
     */
    ruleId: identifier;
    /**
     * The rule version.
     */
    ruleVersion: wholeNumberVersionString;
  }
  export interface RuleDetail {
    /**
     * The rule ID.
     */
    ruleId?: identifier;
    /**
     * The rule description.
     */
    description?: description;
    /**
     * The detector for which the rule is associated.
     */
    detectorId?: identifier;
    /**
     * The rule version.
     */
    ruleVersion?: wholeNumberVersionString;
    /**
     * The rule expression.
     */
    expression?: ruleExpression;
    /**
     * The rule language.
     */
    language?: Language;
    /**
     * The rule outcomes.
     */
    outcomes?: NonEmptyListOfStrings;
    /**
     * Timestamp of the last time the rule was updated.
     */
    lastUpdatedTime?: time;
    /**
     * The timestamp of when the rule was created.
     */
    createdTime?: time;
    /**
     * The rule ARN.
     */
    arn?: fraudDetectorArn;
  }
  export type RuleDetailList = RuleDetail[];
  export type RuleExecutionMode = "ALL_MATCHED"|"FIRST_MATCHED"|string;
  export type RuleList = Rule[];
  export interface RuleResult {
    /**
     * The rule ID that was matched, based on the rule execution mode.
     */
    ruleId?: string;
    /**
     * The outcomes of the matched rule, based on the rule execution mode.
     */
    outcomes?: ListOfStrings;
  }
  export type RulesMaxResults = number;
  export interface SendEventRequest {
    /**
     * The event ID to upload.
     */
    eventId: identifier;
    /**
     * The event type name of the event.
     */
    eventTypeName: identifier;
    /**
     * The timestamp that defines when the event under evaluation occurred. The timestamp must be specified using ISO 8601 standard in UTC.
     */
    eventTimestamp: utcTimestampISO8601;
    /**
     * Names of the event type's variables you defined in Amazon Fraud Detector to represent data elements and their corresponding values for the event you are sending for evaluation.
     */
    eventVariables: EventVariableMap;
    /**
     * The label to associate with the event. Required if specifying labelTimestamp.
     */
    assignedLabel?: identifier;
    /**
     * The timestamp associated with the label. Required if specifying assignedLabel.
     */
    labelTimestamp?: utcTimestampISO8601;
    /**
     * An array of entities.
     */
    entities: listOfEntities;
  }
  export interface SendEventResult {
  }
  export interface Tag {
    /**
     * A tag key.
     */
    key: tagKey;
    /**
     * A value assigned to a tag key.
     */
    value: tagValue;
  }
  export interface TagResourceRequest {
    /**
     * The resource ARN.
     */
    resourceARN: fraudDetectorArn;
    /**
     * The tags to assign to the resource.
     */
    tags: tagList;
  }
  export interface TagResourceResult {
  }
  export type TagsMaxResults = number;
  export interface TrainingDataSchema {
    /**
     * The training data schema variables.
     */
    modelVariables: ListOfStrings;
    labelSchema: LabelSchema;
  }
  export type TrainingDataSourceEnum = "EXTERNAL_EVENTS"|"INGESTED_EVENTS"|string;
  export interface TrainingMetrics {
    /**
     * The area under the curve. This summarizes true positive rate (TPR) and false positive rate (FPR) across all possible model score thresholds. A model with no predictive power has an AUC of 0.5, whereas a perfect model has a score of 1.0.
     */
    auc?: float;
    /**
     * The data points details.
     */
    metricDataPoints?: metricDataPointsList;
  }
  export interface TrainingResult {
    /**
     * The validation metrics.
     */
    dataValidationMetrics?: DataValidationMetrics;
    /**
     * The training metric details.
     */
    trainingMetrics?: TrainingMetrics;
    /**
     * The variable importance metrics.
     */
    variableImportanceMetrics?: VariableImportanceMetrics;
  }
  export type UnlabeledEventsTreatment = "IGNORE"|"FRAUD"|"LEGIT"|string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource from which to remove the tag.
     */
    resourceARN: fraudDetectorArn;
    /**
     * The resource ARN.
     */
    tagKeys: tagKeyList;
  }
  export interface UntagResourceResult {
  }
  export interface UpdateDetectorVersionMetadataRequest {
    /**
     * The detector ID.
     */
    detectorId: identifier;
    /**
     * The detector version ID. 
     */
    detectorVersionId: wholeNumberVersionString;
    /**
     * The description.
     */
    description: description;
  }
  export interface UpdateDetectorVersionMetadataResult {
  }
  export interface UpdateDetectorVersionRequest {
    /**
     * The parent detector ID for the detector version you want to update.
     */
    detectorId: identifier;
    /**
     * The detector version ID. 
     */
    detectorVersionId: wholeNumberVersionString;
    /**
     * The Amazon SageMaker model endpoints to include in the detector version.
     */
    externalModelEndpoints: ListOfStrings;
    /**
     * The rules to include in the detector version.
     */
    rules: RuleList;
    /**
     * The detector version description. 
     */
    description?: description;
    /**
     * The model versions to include in the detector version.
     */
    modelVersions?: ListOfModelVersions;
    /**
     * The rule execution mode to add to the detector. If you specify FIRST_MATCHED, Amazon Fraud Detector evaluates rules sequentially, first to last, stopping at the first matched rule. Amazon Fraud dectector then provides the outcomes for that single rule. If you specifiy ALL_MATCHED, Amazon Fraud Detector evaluates all rules and returns the outcomes for all matched rules. You can define and edit the rule mode at the detector version level, when it is in draft status. The default behavior is FIRST_MATCHED.
     */
    ruleExecutionMode?: RuleExecutionMode;
  }
  export interface UpdateDetectorVersionResult {
  }
  export interface UpdateDetectorVersionStatusRequest {
    /**
     * The detector ID. 
     */
    detectorId: identifier;
    /**
     * The detector version ID. 
     */
    detectorVersionId: wholeNumberVersionString;
    /**
     * The new status.
     */
    status: DetectorVersionStatus;
  }
  export interface UpdateDetectorVersionStatusResult {
  }
  export interface UpdateEventLabelRequest {
    /**
     * The ID of the event associated with the label to update.
     */
    eventId: identifier;
    /**
     * The event type of the event associated with the label to update.
     */
    eventTypeName: identifier;
    /**
     * The new label to assign to the event.
     */
    assignedLabel: identifier;
    /**
     * The timestamp associated with the label. The timestamp must be specified using ISO 8601 standard in UTC. 
     */
    labelTimestamp: utcTimestampISO8601;
  }
  export interface UpdateEventLabelResult {
  }
  export interface UpdateModelRequest {
    /**
     * The model ID.
     */
    modelId: modelIdentifier;
    /**
     * The model type.
     */
    modelType: ModelTypeEnum;
    /**
     * The new model description.
     */
    description?: description;
  }
  export interface UpdateModelResult {
  }
  export interface UpdateModelVersionRequest {
    /**
     * The model ID.
     */
    modelId: modelIdentifier;
    /**
     * The model type.
     */
    modelType: ModelTypeEnum;
    /**
     * The major version number.
     */
    majorVersionNumber: wholeNumberVersionString;
    /**
     * The details of the external events data used for training the model version. Required if trainingDataSource is EXTERNAL_EVENTS.
     */
    externalEventsDetail?: ExternalEventsDetail;
    /**
     * The details of the ingested event used for training the model version. Required if your trainingDataSource is INGESTED_EVENTS.
     */
    ingestedEventsDetail?: IngestedEventsDetail;
    /**
     * A collection of key and value pairs.
     */
    tags?: tagList;
  }
  export interface UpdateModelVersionResult {
    /**
     * The model ID.
     */
    modelId?: modelIdentifier;
    /**
     * The model type.
     */
    modelType?: ModelTypeEnum;
    /**
     * The model version number of the model version updated.
     */
    modelVersionNumber?: floatVersionString;
    /**
     * The status of the updated model version.
     */
    status?: string;
  }
  export interface UpdateModelVersionStatusRequest {
    /**
     * The model ID of the model version to update.
     */
    modelId: modelIdentifier;
    /**
     * The model type.
     */
    modelType: ModelTypeEnum;
    /**
     * The model version number.
     */
    modelVersionNumber: floatVersionString;
    /**
     * The model version status.
     */
    status: ModelVersionStatus;
  }
  export interface UpdateModelVersionStatusResult {
  }
  export interface UpdateRuleMetadataRequest {
    /**
     * The rule to update.
     */
    rule: Rule;
    /**
     * The rule description.
     */
    description: description;
  }
  export interface UpdateRuleMetadataResult {
  }
  export interface UpdateRuleVersionRequest {
    /**
     * The rule to update.
     */
    rule: Rule;
    /**
     * The description.
     */
    description?: description;
    /**
     * The rule expression.
     */
    expression: ruleExpression;
    /**
     * The language.
     */
    language: Language;
    /**
     * The outcomes.
     */
    outcomes: NonEmptyListOfStrings;
    /**
     * The tags to assign to the rule version.
     */
    tags?: tagList;
  }
  export interface UpdateRuleVersionResult {
    /**
     * The new rule version that was created.
     */
    rule?: Rule;
  }
  export interface UpdateVariableRequest {
    /**
     * The name of the variable.
     */
    name: string;
    /**
     * The new default value of the variable.
     */
    defaultValue?: string;
    /**
     * The new description.
     */
    description?: string;
    /**
     * The variable type. For more information see Variable types.
     */
    variableType?: string;
  }
  export interface UpdateVariableResult {
  }
  export type UseEventVariables = boolean;
  export interface Variable {
    /**
     * The name of the variable.
     */
    name?: string;
    /**
     * The data type of the variable. For more information see Variable types.
     */
    dataType?: DataType;
    /**
     * The data source of the variable.
     */
    dataSource?: DataSource;
    /**
     * The default value of the variable.
     */
    defaultValue?: string;
    /**
     * The description of the variable. 
     */
    description?: string;
    /**
     * The variable type of the variable. Valid Values: AUTH_CODE | AVS | BILLING_ADDRESS_L1 | BILLING_ADDRESS_L2 | BILLING_CITY | BILLING_COUNTRY | BILLING_NAME | BILLING_PHONE | BILLING_STATE | BILLING_ZIP | CARD_BIN | CATEGORICAL | CURRENCY_CODE | EMAIL_ADDRESS | FINGERPRINT | FRAUD_LABEL | FREE_FORM_TEXT | IP_ADDRESS | NUMERIC | ORDER_ID | PAYMENT_TYPE | PHONE_NUMBER | PRICE | PRODUCT_CATEGORY | SHIPPING_ADDRESS_L1 | SHIPPING_ADDRESS_L2 | SHIPPING_CITY | SHIPPING_COUNTRY | SHIPPING_NAME | SHIPPING_PHONE | SHIPPING_STATE | SHIPPING_ZIP | USERAGENT  
     */
    variableType?: string;
    /**
     * The time when variable was last updated.
     */
    lastUpdatedTime?: time;
    /**
     * The time when the variable was created.
     */
    createdTime?: time;
    /**
     * The ARN of the variable.
     */
    arn?: fraudDetectorArn;
  }
  export interface VariableEntry {
    /**
     * The name of the variable.
     */
    name?: string;
    /**
     * The data type of the variable.
     */
    dataType?: string;
    /**
     * The data source of the variable.
     */
    dataSource?: string;
    /**
     * The default value of the variable.
     */
    defaultValue?: string;
    /**
     * The description of the variable.
     */
    description?: string;
    /**
     * The type of the variable. For more information see Variable types. Valid Values: AUTH_CODE | AVS | BILLING_ADDRESS_L1 | BILLING_ADDRESS_L2 | BILLING_CITY | BILLING_COUNTRY | BILLING_NAME | BILLING_PHONE | BILLING_STATE | BILLING_ZIP | CARD_BIN | CATEGORICAL | CURRENCY_CODE | EMAIL_ADDRESS | FINGERPRINT | FRAUD_LABEL | FREE_FORM_TEXT | IP_ADDRESS | NUMERIC | ORDER_ID | PAYMENT_TYPE | PHONE_NUMBER | PRICE | PRODUCT_CATEGORY | SHIPPING_ADDRESS_L1 | SHIPPING_ADDRESS_L2 | SHIPPING_CITY | SHIPPING_COUNTRY | SHIPPING_NAME | SHIPPING_PHONE | SHIPPING_STATE | SHIPPING_ZIP | USERAGENT  
     */
    variableType?: string;
  }
  export type VariableEntryList = VariableEntry[];
  export interface VariableImportanceMetrics {
    /**
     * List of variable metrics.
     */
    logOddsMetrics?: ListOfLogOddsMetrics;
  }
  export type VariableList = Variable[];
  export type VariablesMaxResults = number;
  export type attributeKey = string;
  export type attributeValue = string;
  export type batchImportsMaxPageSize = number;
  export type batchPredictionsMaxPageSize = number;
  export type blob = Buffer|Uint8Array|Blob|string;
  export type contentType = string;
  export type description = string;
  export type entityRestrictedString = string;
  export type entityTypeList = EntityType[];
  export type entityTypesMaxResults = number;
  export type eventTypeList = EventType[];
  export type eventTypesMaxResults = number;
  export type fieldValidationMessageList = FieldValidationMessage[];
  export type fileValidationMessageList = FileValidationMessage[];
  export type float = number;
  export type floatVersionString = string;
  export type fraudDetectorArn = string;
  export type iamRoleArn = string;
  export type identifier = string;
  export type integer = number;
  export type labelList = Label[];
  export type labelMapper = {[key: string]: NonEmptyListOfStrings};
  export type labelsMaxResults = number;
  export type listOfEntities = Entity[];
  export type metricDataPointsList = MetricDataPoint[];
  export type modelIdentifier = string;
  export type modelInputTemplate = string;
  export type modelList = Model[];
  export type modelVersionDetailList = ModelVersionDetail[];
  export type modelsMaxPageSize = number;
  export type ruleExpression = string;
  export type s3BucketLocation = string;
  export type sageMakerEndpointIdentifier = string;
  export type tagKey = string;
  export type tagKeyList = tagKey[];
  export type tagList = Tag[];
  export type tagValue = string;
  export type time = string;
  export type utcTimestampISO8601 = string;
  export type variableName = string;
  export type variableValue = string;
  export type wholeNumberVersionString = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-11-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the FraudDetector client.
   */
  export import Types = FraudDetector;
}
export = FraudDetector;
