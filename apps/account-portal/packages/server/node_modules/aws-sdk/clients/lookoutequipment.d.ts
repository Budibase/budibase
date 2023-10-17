import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class LookoutEquipment extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: LookoutEquipment.Types.ClientConfiguration)
  config: Config & LookoutEquipment.Types.ClientConfiguration;
  /**
   * Creates a container for a collection of data being ingested for analysis. The dataset contains the metadata describing where the data is and what the data actually looks like. For example, it contains the location of the data source, the data schema, and other information. A dataset also contains any tags associated with the ingested data. 
   */
  createDataset(params: LookoutEquipment.Types.CreateDatasetRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.CreateDatasetResponse) => void): Request<LookoutEquipment.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates a container for a collection of data being ingested for analysis. The dataset contains the metadata describing where the data is and what the data actually looks like. For example, it contains the location of the data source, the data schema, and other information. A dataset also contains any tags associated with the ingested data. 
   */
  createDataset(callback?: (err: AWSError, data: LookoutEquipment.Types.CreateDatasetResponse) => void): Request<LookoutEquipment.Types.CreateDatasetResponse, AWSError>;
  /**
   *  Creates a scheduled inference. Scheduling an inference is setting up a continuous real-time inference plan to analyze new measurement data. When setting up the schedule, you provide an S3 bucket location for the input data, assign it a delimiter between separate entries in the data, set an offset delay if desired, and set the frequency of inferencing. You must also provide an S3 bucket location for the output data. 
   */
  createInferenceScheduler(params: LookoutEquipment.Types.CreateInferenceSchedulerRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.CreateInferenceSchedulerResponse) => void): Request<LookoutEquipment.Types.CreateInferenceSchedulerResponse, AWSError>;
  /**
   *  Creates a scheduled inference. Scheduling an inference is setting up a continuous real-time inference plan to analyze new measurement data. When setting up the schedule, you provide an S3 bucket location for the input data, assign it a delimiter between separate entries in the data, set an offset delay if desired, and set the frequency of inferencing. You must also provide an S3 bucket location for the output data. 
   */
  createInferenceScheduler(callback?: (err: AWSError, data: LookoutEquipment.Types.CreateInferenceSchedulerResponse) => void): Request<LookoutEquipment.Types.CreateInferenceSchedulerResponse, AWSError>;
  /**
   *  Creates a label for an event. 
   */
  createLabel(params: LookoutEquipment.Types.CreateLabelRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.CreateLabelResponse) => void): Request<LookoutEquipment.Types.CreateLabelResponse, AWSError>;
  /**
   *  Creates a label for an event. 
   */
  createLabel(callback?: (err: AWSError, data: LookoutEquipment.Types.CreateLabelResponse) => void): Request<LookoutEquipment.Types.CreateLabelResponse, AWSError>;
  /**
   *  Creates a group of labels. 
   */
  createLabelGroup(params: LookoutEquipment.Types.CreateLabelGroupRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.CreateLabelGroupResponse) => void): Request<LookoutEquipment.Types.CreateLabelGroupResponse, AWSError>;
  /**
   *  Creates a group of labels. 
   */
  createLabelGroup(callback?: (err: AWSError, data: LookoutEquipment.Types.CreateLabelGroupResponse) => void): Request<LookoutEquipment.Types.CreateLabelGroupResponse, AWSError>;
  /**
   * Creates a machine learning model for data inference.  A machine-learning (ML) model is a mathematical model that finds patterns in your data. In Amazon Lookout for Equipment, the model learns the patterns of normal behavior and detects abnormal behavior that could be potential equipment failure (or maintenance events). The models are made by analyzing normal data and abnormalities in machine behavior that have already occurred. Your model is trained using a portion of the data from your dataset and uses that data to learn patterns of normal behavior and abnormal patterns that lead to equipment failure. Another portion of the data is used to evaluate the model's accuracy. 
   */
  createModel(params: LookoutEquipment.Types.CreateModelRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.CreateModelResponse) => void): Request<LookoutEquipment.Types.CreateModelResponse, AWSError>;
  /**
   * Creates a machine learning model for data inference.  A machine-learning (ML) model is a mathematical model that finds patterns in your data. In Amazon Lookout for Equipment, the model learns the patterns of normal behavior and detects abnormal behavior that could be potential equipment failure (or maintenance events). The models are made by analyzing normal data and abnormalities in machine behavior that have already occurred. Your model is trained using a portion of the data from your dataset and uses that data to learn patterns of normal behavior and abnormal patterns that lead to equipment failure. Another portion of the data is used to evaluate the model's accuracy. 
   */
  createModel(callback?: (err: AWSError, data: LookoutEquipment.Types.CreateModelResponse) => void): Request<LookoutEquipment.Types.CreateModelResponse, AWSError>;
  /**
   * Creates a retraining scheduler on the specified model. 
   */
  createRetrainingScheduler(params: LookoutEquipment.Types.CreateRetrainingSchedulerRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.CreateRetrainingSchedulerResponse) => void): Request<LookoutEquipment.Types.CreateRetrainingSchedulerResponse, AWSError>;
  /**
   * Creates a retraining scheduler on the specified model. 
   */
  createRetrainingScheduler(callback?: (err: AWSError, data: LookoutEquipment.Types.CreateRetrainingSchedulerResponse) => void): Request<LookoutEquipment.Types.CreateRetrainingSchedulerResponse, AWSError>;
  /**
   *  Deletes a dataset and associated artifacts. The operation will check to see if any inference scheduler or data ingestion job is currently using the dataset, and if there isn't, the dataset, its metadata, and any associated data stored in S3 will be deleted. This does not affect any models that used this dataset for training and evaluation, but does prevent it from being used in the future. 
   */
  deleteDataset(params: LookoutEquipment.Types.DeleteDatasetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Deletes a dataset and associated artifacts. The operation will check to see if any inference scheduler or data ingestion job is currently using the dataset, and if there isn't, the dataset, its metadata, and any associated data stored in S3 will be deleted. This does not affect any models that used this dataset for training and evaluation, but does prevent it from being used in the future. 
   */
  deleteDataset(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an inference scheduler that has been set up. Prior inference results will not be deleted.
   */
  deleteInferenceScheduler(params: LookoutEquipment.Types.DeleteInferenceSchedulerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an inference scheduler that has been set up. Prior inference results will not be deleted.
   */
  deleteInferenceScheduler(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Deletes a label. 
   */
  deleteLabel(params: LookoutEquipment.Types.DeleteLabelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Deletes a label. 
   */
  deleteLabel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Deletes a group of labels. 
   */
  deleteLabelGroup(params: LookoutEquipment.Types.DeleteLabelGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Deletes a group of labels. 
   */
  deleteLabelGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a machine learning model currently available for Amazon Lookout for Equipment. This will prevent it from being used with an inference scheduler, even one that is already set up. 
   */
  deleteModel(params: LookoutEquipment.Types.DeleteModelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a machine learning model currently available for Amazon Lookout for Equipment. This will prevent it from being used with an inference scheduler, even one that is already set up. 
   */
  deleteModel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the resource policy attached to the resource.
   */
  deleteResourcePolicy(params: LookoutEquipment.Types.DeleteResourcePolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the resource policy attached to the resource.
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a retraining scheduler from a model. The retraining scheduler must be in the STOPPED status. 
   */
  deleteRetrainingScheduler(params: LookoutEquipment.Types.DeleteRetrainingSchedulerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a retraining scheduler from a model. The retraining scheduler must be in the STOPPED status. 
   */
  deleteRetrainingScheduler(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Provides information on a specific data ingestion job such as creation time, dataset ARN, and status.
   */
  describeDataIngestionJob(params: LookoutEquipment.Types.DescribeDataIngestionJobRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeDataIngestionJobResponse) => void): Request<LookoutEquipment.Types.DescribeDataIngestionJobResponse, AWSError>;
  /**
   * Provides information on a specific data ingestion job such as creation time, dataset ARN, and status.
   */
  describeDataIngestionJob(callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeDataIngestionJobResponse) => void): Request<LookoutEquipment.Types.DescribeDataIngestionJobResponse, AWSError>;
  /**
   * Provides a JSON description of the data in each time series dataset, including names, column names, and data types.
   */
  describeDataset(params: LookoutEquipment.Types.DescribeDatasetRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeDatasetResponse) => void): Request<LookoutEquipment.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Provides a JSON description of the data in each time series dataset, including names, column names, and data types.
   */
  describeDataset(callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeDatasetResponse) => void): Request<LookoutEquipment.Types.DescribeDatasetResponse, AWSError>;
  /**
   *  Specifies information about the inference scheduler being used, including name, model, status, and associated metadata 
   */
  describeInferenceScheduler(params: LookoutEquipment.Types.DescribeInferenceSchedulerRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeInferenceSchedulerResponse) => void): Request<LookoutEquipment.Types.DescribeInferenceSchedulerResponse, AWSError>;
  /**
   *  Specifies information about the inference scheduler being used, including name, model, status, and associated metadata 
   */
  describeInferenceScheduler(callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeInferenceSchedulerResponse) => void): Request<LookoutEquipment.Types.DescribeInferenceSchedulerResponse, AWSError>;
  /**
   *  Returns the name of the label. 
   */
  describeLabel(params: LookoutEquipment.Types.DescribeLabelRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeLabelResponse) => void): Request<LookoutEquipment.Types.DescribeLabelResponse, AWSError>;
  /**
   *  Returns the name of the label. 
   */
  describeLabel(callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeLabelResponse) => void): Request<LookoutEquipment.Types.DescribeLabelResponse, AWSError>;
  /**
   *  Returns information about the label group. 
   */
  describeLabelGroup(params: LookoutEquipment.Types.DescribeLabelGroupRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeLabelGroupResponse) => void): Request<LookoutEquipment.Types.DescribeLabelGroupResponse, AWSError>;
  /**
   *  Returns information about the label group. 
   */
  describeLabelGroup(callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeLabelGroupResponse) => void): Request<LookoutEquipment.Types.DescribeLabelGroupResponse, AWSError>;
  /**
   * Provides a JSON containing the overall information about a specific machine learning model, including model name and ARN, dataset, training and evaluation information, status, and so on. 
   */
  describeModel(params: LookoutEquipment.Types.DescribeModelRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeModelResponse) => void): Request<LookoutEquipment.Types.DescribeModelResponse, AWSError>;
  /**
   * Provides a JSON containing the overall information about a specific machine learning model, including model name and ARN, dataset, training and evaluation information, status, and so on. 
   */
  describeModel(callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeModelResponse) => void): Request<LookoutEquipment.Types.DescribeModelResponse, AWSError>;
  /**
   * Retrieves information about a specific machine learning model version.
   */
  describeModelVersion(params: LookoutEquipment.Types.DescribeModelVersionRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeModelVersionResponse) => void): Request<LookoutEquipment.Types.DescribeModelVersionResponse, AWSError>;
  /**
   * Retrieves information about a specific machine learning model version.
   */
  describeModelVersion(callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeModelVersionResponse) => void): Request<LookoutEquipment.Types.DescribeModelVersionResponse, AWSError>;
  /**
   * Provides the details of a resource policy attached to a resource.
   */
  describeResourcePolicy(params: LookoutEquipment.Types.DescribeResourcePolicyRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeResourcePolicyResponse) => void): Request<LookoutEquipment.Types.DescribeResourcePolicyResponse, AWSError>;
  /**
   * Provides the details of a resource policy attached to a resource.
   */
  describeResourcePolicy(callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeResourcePolicyResponse) => void): Request<LookoutEquipment.Types.DescribeResourcePolicyResponse, AWSError>;
  /**
   * Provides a description of the retraining scheduler, including information such as the model name and retraining parameters. 
   */
  describeRetrainingScheduler(params: LookoutEquipment.Types.DescribeRetrainingSchedulerRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeRetrainingSchedulerResponse) => void): Request<LookoutEquipment.Types.DescribeRetrainingSchedulerResponse, AWSError>;
  /**
   * Provides a description of the retraining scheduler, including information such as the model name and retraining parameters. 
   */
  describeRetrainingScheduler(callback?: (err: AWSError, data: LookoutEquipment.Types.DescribeRetrainingSchedulerResponse) => void): Request<LookoutEquipment.Types.DescribeRetrainingSchedulerResponse, AWSError>;
  /**
   * Imports a dataset.
   */
  importDataset(params: LookoutEquipment.Types.ImportDatasetRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ImportDatasetResponse) => void): Request<LookoutEquipment.Types.ImportDatasetResponse, AWSError>;
  /**
   * Imports a dataset.
   */
  importDataset(callback?: (err: AWSError, data: LookoutEquipment.Types.ImportDatasetResponse) => void): Request<LookoutEquipment.Types.ImportDatasetResponse, AWSError>;
  /**
   * Imports a model that has been trained successfully.
   */
  importModelVersion(params: LookoutEquipment.Types.ImportModelVersionRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ImportModelVersionResponse) => void): Request<LookoutEquipment.Types.ImportModelVersionResponse, AWSError>;
  /**
   * Imports a model that has been trained successfully.
   */
  importModelVersion(callback?: (err: AWSError, data: LookoutEquipment.Types.ImportModelVersionResponse) => void): Request<LookoutEquipment.Types.ImportModelVersionResponse, AWSError>;
  /**
   * Provides a list of all data ingestion jobs, including dataset name and ARN, S3 location of the input data, status, and so on. 
   */
  listDataIngestionJobs(params: LookoutEquipment.Types.ListDataIngestionJobsRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ListDataIngestionJobsResponse) => void): Request<LookoutEquipment.Types.ListDataIngestionJobsResponse, AWSError>;
  /**
   * Provides a list of all data ingestion jobs, including dataset name and ARN, S3 location of the input data, status, and so on. 
   */
  listDataIngestionJobs(callback?: (err: AWSError, data: LookoutEquipment.Types.ListDataIngestionJobsResponse) => void): Request<LookoutEquipment.Types.ListDataIngestionJobsResponse, AWSError>;
  /**
   * Lists all datasets currently available in your account, filtering on the dataset name. 
   */
  listDatasets(params: LookoutEquipment.Types.ListDatasetsRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ListDatasetsResponse) => void): Request<LookoutEquipment.Types.ListDatasetsResponse, AWSError>;
  /**
   * Lists all datasets currently available in your account, filtering on the dataset name. 
   */
  listDatasets(callback?: (err: AWSError, data: LookoutEquipment.Types.ListDatasetsResponse) => void): Request<LookoutEquipment.Types.ListDatasetsResponse, AWSError>;
  /**
   *  Lists all inference events that have been found for the specified inference scheduler. 
   */
  listInferenceEvents(params: LookoutEquipment.Types.ListInferenceEventsRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ListInferenceEventsResponse) => void): Request<LookoutEquipment.Types.ListInferenceEventsResponse, AWSError>;
  /**
   *  Lists all inference events that have been found for the specified inference scheduler. 
   */
  listInferenceEvents(callback?: (err: AWSError, data: LookoutEquipment.Types.ListInferenceEventsResponse) => void): Request<LookoutEquipment.Types.ListInferenceEventsResponse, AWSError>;
  /**
   *  Lists all inference executions that have been performed by the specified inference scheduler. 
   */
  listInferenceExecutions(params: LookoutEquipment.Types.ListInferenceExecutionsRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ListInferenceExecutionsResponse) => void): Request<LookoutEquipment.Types.ListInferenceExecutionsResponse, AWSError>;
  /**
   *  Lists all inference executions that have been performed by the specified inference scheduler. 
   */
  listInferenceExecutions(callback?: (err: AWSError, data: LookoutEquipment.Types.ListInferenceExecutionsResponse) => void): Request<LookoutEquipment.Types.ListInferenceExecutionsResponse, AWSError>;
  /**
   * Retrieves a list of all inference schedulers currently available for your account. 
   */
  listInferenceSchedulers(params: LookoutEquipment.Types.ListInferenceSchedulersRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ListInferenceSchedulersResponse) => void): Request<LookoutEquipment.Types.ListInferenceSchedulersResponse, AWSError>;
  /**
   * Retrieves a list of all inference schedulers currently available for your account. 
   */
  listInferenceSchedulers(callback?: (err: AWSError, data: LookoutEquipment.Types.ListInferenceSchedulersResponse) => void): Request<LookoutEquipment.Types.ListInferenceSchedulersResponse, AWSError>;
  /**
   *  Returns a list of the label groups. 
   */
  listLabelGroups(params: LookoutEquipment.Types.ListLabelGroupsRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ListLabelGroupsResponse) => void): Request<LookoutEquipment.Types.ListLabelGroupsResponse, AWSError>;
  /**
   *  Returns a list of the label groups. 
   */
  listLabelGroups(callback?: (err: AWSError, data: LookoutEquipment.Types.ListLabelGroupsResponse) => void): Request<LookoutEquipment.Types.ListLabelGroupsResponse, AWSError>;
  /**
   *  Provides a list of labels. 
   */
  listLabels(params: LookoutEquipment.Types.ListLabelsRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ListLabelsResponse) => void): Request<LookoutEquipment.Types.ListLabelsResponse, AWSError>;
  /**
   *  Provides a list of labels. 
   */
  listLabels(callback?: (err: AWSError, data: LookoutEquipment.Types.ListLabelsResponse) => void): Request<LookoutEquipment.Types.ListLabelsResponse, AWSError>;
  /**
   * Generates a list of all model versions for a given model, including the model version, model version ARN, and status. To list a subset of versions, use the MaxModelVersion and MinModelVersion fields.
   */
  listModelVersions(params: LookoutEquipment.Types.ListModelVersionsRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ListModelVersionsResponse) => void): Request<LookoutEquipment.Types.ListModelVersionsResponse, AWSError>;
  /**
   * Generates a list of all model versions for a given model, including the model version, model version ARN, and status. To list a subset of versions, use the MaxModelVersion and MinModelVersion fields.
   */
  listModelVersions(callback?: (err: AWSError, data: LookoutEquipment.Types.ListModelVersionsResponse) => void): Request<LookoutEquipment.Types.ListModelVersionsResponse, AWSError>;
  /**
   * Generates a list of all models in the account, including model name and ARN, dataset, and status. 
   */
  listModels(params: LookoutEquipment.Types.ListModelsRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ListModelsResponse) => void): Request<LookoutEquipment.Types.ListModelsResponse, AWSError>;
  /**
   * Generates a list of all models in the account, including model name and ARN, dataset, and status. 
   */
  listModels(callback?: (err: AWSError, data: LookoutEquipment.Types.ListModelsResponse) => void): Request<LookoutEquipment.Types.ListModelsResponse, AWSError>;
  /**
   * Lists all retraining schedulers in your account, filtering by model name prefix and status. 
   */
  listRetrainingSchedulers(params: LookoutEquipment.Types.ListRetrainingSchedulersRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ListRetrainingSchedulersResponse) => void): Request<LookoutEquipment.Types.ListRetrainingSchedulersResponse, AWSError>;
  /**
   * Lists all retraining schedulers in your account, filtering by model name prefix and status. 
   */
  listRetrainingSchedulers(callback?: (err: AWSError, data: LookoutEquipment.Types.ListRetrainingSchedulersResponse) => void): Request<LookoutEquipment.Types.ListRetrainingSchedulersResponse, AWSError>;
  /**
   *  Lists statistics about the data collected for each of the sensors that have been successfully ingested in the particular dataset. Can also be used to retreive Sensor Statistics for a previous ingestion job. 
   */
  listSensorStatistics(params: LookoutEquipment.Types.ListSensorStatisticsRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ListSensorStatisticsResponse) => void): Request<LookoutEquipment.Types.ListSensorStatisticsResponse, AWSError>;
  /**
   *  Lists statistics about the data collected for each of the sensors that have been successfully ingested in the particular dataset. Can also be used to retreive Sensor Statistics for a previous ingestion job. 
   */
  listSensorStatistics(callback?: (err: AWSError, data: LookoutEquipment.Types.ListSensorStatisticsResponse) => void): Request<LookoutEquipment.Types.ListSensorStatisticsResponse, AWSError>;
  /**
   * Lists all the tags for a specified resource, including key and value. 
   */
  listTagsForResource(params: LookoutEquipment.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.ListTagsForResourceResponse) => void): Request<LookoutEquipment.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all the tags for a specified resource, including key and value. 
   */
  listTagsForResource(callback?: (err: AWSError, data: LookoutEquipment.Types.ListTagsForResourceResponse) => void): Request<LookoutEquipment.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Creates a resource control policy for a given resource.
   */
  putResourcePolicy(params: LookoutEquipment.Types.PutResourcePolicyRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.PutResourcePolicyResponse) => void): Request<LookoutEquipment.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Creates a resource control policy for a given resource.
   */
  putResourcePolicy(callback?: (err: AWSError, data: LookoutEquipment.Types.PutResourcePolicyResponse) => void): Request<LookoutEquipment.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Starts a data ingestion job. Amazon Lookout for Equipment returns the job status. 
   */
  startDataIngestionJob(params: LookoutEquipment.Types.StartDataIngestionJobRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.StartDataIngestionJobResponse) => void): Request<LookoutEquipment.Types.StartDataIngestionJobResponse, AWSError>;
  /**
   * Starts a data ingestion job. Amazon Lookout for Equipment returns the job status. 
   */
  startDataIngestionJob(callback?: (err: AWSError, data: LookoutEquipment.Types.StartDataIngestionJobResponse) => void): Request<LookoutEquipment.Types.StartDataIngestionJobResponse, AWSError>;
  /**
   * Starts an inference scheduler. 
   */
  startInferenceScheduler(params: LookoutEquipment.Types.StartInferenceSchedulerRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.StartInferenceSchedulerResponse) => void): Request<LookoutEquipment.Types.StartInferenceSchedulerResponse, AWSError>;
  /**
   * Starts an inference scheduler. 
   */
  startInferenceScheduler(callback?: (err: AWSError, data: LookoutEquipment.Types.StartInferenceSchedulerResponse) => void): Request<LookoutEquipment.Types.StartInferenceSchedulerResponse, AWSError>;
  /**
   * Starts a retraining scheduler. 
   */
  startRetrainingScheduler(params: LookoutEquipment.Types.StartRetrainingSchedulerRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.StartRetrainingSchedulerResponse) => void): Request<LookoutEquipment.Types.StartRetrainingSchedulerResponse, AWSError>;
  /**
   * Starts a retraining scheduler. 
   */
  startRetrainingScheduler(callback?: (err: AWSError, data: LookoutEquipment.Types.StartRetrainingSchedulerResponse) => void): Request<LookoutEquipment.Types.StartRetrainingSchedulerResponse, AWSError>;
  /**
   * Stops an inference scheduler. 
   */
  stopInferenceScheduler(params: LookoutEquipment.Types.StopInferenceSchedulerRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.StopInferenceSchedulerResponse) => void): Request<LookoutEquipment.Types.StopInferenceSchedulerResponse, AWSError>;
  /**
   * Stops an inference scheduler. 
   */
  stopInferenceScheduler(callback?: (err: AWSError, data: LookoutEquipment.Types.StopInferenceSchedulerResponse) => void): Request<LookoutEquipment.Types.StopInferenceSchedulerResponse, AWSError>;
  /**
   * Stops a retraining scheduler. 
   */
  stopRetrainingScheduler(params: LookoutEquipment.Types.StopRetrainingSchedulerRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.StopRetrainingSchedulerResponse) => void): Request<LookoutEquipment.Types.StopRetrainingSchedulerResponse, AWSError>;
  /**
   * Stops a retraining scheduler. 
   */
  stopRetrainingScheduler(callback?: (err: AWSError, data: LookoutEquipment.Types.StopRetrainingSchedulerResponse) => void): Request<LookoutEquipment.Types.StopRetrainingSchedulerResponse, AWSError>;
  /**
   * Associates a given tag to a resource in your account. A tag is a key-value pair which can be added to an Amazon Lookout for Equipment resource as metadata. Tags can be used for organizing your resources as well as helping you to search and filter by tag. Multiple tags can be added to a resource, either when you create it, or later. Up to 50 tags can be associated with each resource. 
   */
  tagResource(params: LookoutEquipment.Types.TagResourceRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.TagResourceResponse) => void): Request<LookoutEquipment.Types.TagResourceResponse, AWSError>;
  /**
   * Associates a given tag to a resource in your account. A tag is a key-value pair which can be added to an Amazon Lookout for Equipment resource as metadata. Tags can be used for organizing your resources as well as helping you to search and filter by tag. Multiple tags can be added to a resource, either when you create it, or later. Up to 50 tags can be associated with each resource. 
   */
  tagResource(callback?: (err: AWSError, data: LookoutEquipment.Types.TagResourceResponse) => void): Request<LookoutEquipment.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a specific tag from a given resource. The tag is specified by its key. 
   */
  untagResource(params: LookoutEquipment.Types.UntagResourceRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.UntagResourceResponse) => void): Request<LookoutEquipment.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a specific tag from a given resource. The tag is specified by its key. 
   */
  untagResource(callback?: (err: AWSError, data: LookoutEquipment.Types.UntagResourceResponse) => void): Request<LookoutEquipment.Types.UntagResourceResponse, AWSError>;
  /**
   * Sets the active model version for a given machine learning model.
   */
  updateActiveModelVersion(params: LookoutEquipment.Types.UpdateActiveModelVersionRequest, callback?: (err: AWSError, data: LookoutEquipment.Types.UpdateActiveModelVersionResponse) => void): Request<LookoutEquipment.Types.UpdateActiveModelVersionResponse, AWSError>;
  /**
   * Sets the active model version for a given machine learning model.
   */
  updateActiveModelVersion(callback?: (err: AWSError, data: LookoutEquipment.Types.UpdateActiveModelVersionResponse) => void): Request<LookoutEquipment.Types.UpdateActiveModelVersionResponse, AWSError>;
  /**
   * Updates an inference scheduler. 
   */
  updateInferenceScheduler(params: LookoutEquipment.Types.UpdateInferenceSchedulerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an inference scheduler. 
   */
  updateInferenceScheduler(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Updates the label group. 
   */
  updateLabelGroup(params: LookoutEquipment.Types.UpdateLabelGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Updates the label group. 
   */
  updateLabelGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a model in the account.
   */
  updateModel(params: LookoutEquipment.Types.UpdateModelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a model in the account.
   */
  updateModel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a retraining scheduler. 
   */
  updateRetrainingScheduler(params: LookoutEquipment.Types.UpdateRetrainingSchedulerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a retraining scheduler. 
   */
  updateRetrainingScheduler(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace LookoutEquipment {
  export type AmazonResourceArn = string;
  export type AutoPromotionResult = "MODEL_PROMOTED"|"MODEL_NOT_PROMOTED"|"RETRAINING_INTERNAL_ERROR"|"RETRAINING_CUSTOMER_ERROR"|"RETRAINING_CANCELLED"|string;
  export type AutoPromotionResultReason = string;
  export type Boolean = boolean;
  export type BoundedLengthString = string;
  export interface CategoricalValues {
    /**
     *  Indicates whether there is a potential data issue related to categorical values. 
     */
    Status: StatisticalIssueStatus;
    /**
     *  Indicates the number of categories in the data. 
     */
    NumberOfCategory?: Integer;
  }
  export type Comments = string;
  export type ComponentName = string;
  export type ComponentTimestampDelimiter = string;
  export interface CountPercent {
    /**
     *  Indicates the count of occurences of the given statistic. 
     */
    Count: Integer;
    /**
     *  Indicates the percentage of occurances of the given statistic. 
     */
    Percentage: Float;
  }
  export interface CreateDatasetRequest {
    /**
     * The name of the dataset being created. 
     */
    DatasetName: DatasetName;
    /**
     * A JSON description of the data that is in each time series dataset, including names, column names, and data types. 
     */
    DatasetSchema?: DatasetSchema;
    /**
     * Provides the identifier of the KMS key used to encrypt dataset data by Amazon Lookout for Equipment. 
     */
    ServerSideKmsKeyId?: NameOrArn;
    /**
     *  A unique identifier for the request. If you do not set the client request token, Amazon Lookout for Equipment generates one. 
     */
    ClientToken: IdempotenceToken;
    /**
     * Any tags associated with the ingested data described in the dataset. 
     */
    Tags?: TagList;
  }
  export interface CreateDatasetResponse {
    /**
     * The name of the dataset being created. 
     */
    DatasetName?: DatasetName;
    /**
     *  The Amazon Resource Name (ARN) of the dataset being created. 
     */
    DatasetArn?: DatasetArn;
    /**
     * Indicates the status of the CreateDataset operation. 
     */
    Status?: DatasetStatus;
  }
  export interface CreateInferenceSchedulerRequest {
    /**
     * The name of the previously trained machine learning model being used to create the inference scheduler. 
     */
    ModelName: ModelName;
    /**
     * The name of the inference scheduler being created. 
     */
    InferenceSchedulerName: InferenceSchedulerName;
    /**
     * The interval (in minutes) of planned delay at the start of each inference segment. For example, if inference is set to run every ten minutes, the delay is set to five minutes and the time is 09:08. The inference scheduler will wake up at the configured interval (which, without a delay configured, would be 09:10) plus the additional five minute delay time (so 09:15) to check your Amazon S3 bucket. The delay provides a buffer for you to upload data at the same frequency, so that you don't have to stop and restart the scheduler when uploading new data. For more information, see Understanding the inference process.
     */
    DataDelayOffsetInMinutes?: DataDelayOffsetInMinutes;
    /**
     *  How often data is uploaded to the source Amazon S3 bucket for the input data. The value chosen is the length of time between data uploads. For instance, if you select 5 minutes, Amazon Lookout for Equipment will upload the real-time data to the source bucket once every 5 minutes. This frequency also determines how often Amazon Lookout for Equipment runs inference on your data. For more information, see Understanding the inference process.
     */
    DataUploadFrequency: DataUploadFrequency;
    /**
     * Specifies configuration information for the input data for the inference scheduler, including delimiter, format, and dataset location. 
     */
    DataInputConfiguration: InferenceInputConfiguration;
    /**
     * Specifies configuration information for the output results for the inference scheduler, including the S3 location for the output. 
     */
    DataOutputConfiguration: InferenceOutputConfiguration;
    /**
     * The Amazon Resource Name (ARN) of a role with permission to access the data source being used for the inference. 
     */
    RoleArn: IamRoleArn;
    /**
     * Provides the identifier of the KMS key used to encrypt inference scheduler data by Amazon Lookout for Equipment. 
     */
    ServerSideKmsKeyId?: NameOrArn;
    /**
     *  A unique identifier for the request. If you do not set the client request token, Amazon Lookout for Equipment generates one. 
     */
    ClientToken: IdempotenceToken;
    /**
     * Any tags associated with the inference scheduler. 
     */
    Tags?: TagList;
  }
  export interface CreateInferenceSchedulerResponse {
    /**
     * The Amazon Resource Name (ARN) of the inference scheduler being created. 
     */
    InferenceSchedulerArn?: InferenceSchedulerArn;
    /**
     * The name of inference scheduler being created. 
     */
    InferenceSchedulerName?: InferenceSchedulerName;
    /**
     * Indicates the status of the CreateInferenceScheduler operation. 
     */
    Status?: InferenceSchedulerStatus;
  }
  export interface CreateLabelGroupRequest {
    /**
     *  Names a group of labels. Data in this field will be retained for service usage. Follow best practices for the security of your data. 
     */
    LabelGroupName: LabelGroupName;
    /**
     *  The acceptable fault codes (indicating the type of anomaly associated with the label) that can be used with this label group. Data in this field will be retained for service usage. Follow best practices for the security of your data.
     */
    FaultCodes?: FaultCodes;
    /**
     *  A unique identifier for the request to create a label group. If you do not set the client request token, Lookout for Equipment generates one. 
     */
    ClientToken: IdempotenceToken;
    /**
     *  Tags that provide metadata about the label group you are creating.  Data in this field will be retained for service usage. Follow best practices for the security of your data.
     */
    Tags?: TagList;
  }
  export interface CreateLabelGroupResponse {
    /**
     *  The name of the label group that you have created. Data in this field will be retained for service usage. Follow best practices for the security of your data. 
     */
    LabelGroupName?: LabelGroupName;
    /**
     *  The Amazon Resource Name (ARN) of the label group that you have created. 
     */
    LabelGroupArn?: LabelGroupArn;
  }
  export interface CreateLabelRequest {
    /**
     *  The name of a group of labels.  Data in this field will be retained for service usage. Follow best practices for the security of your data. 
     */
    LabelGroupName: LabelGroupName;
    /**
     *  The start time of the labeled event. 
     */
    StartTime: Timestamp;
    /**
     *  The end time of the labeled event. 
     */
    EndTime: Timestamp;
    /**
     *  Indicates whether a labeled event represents an anomaly. 
     */
    Rating: LabelRating;
    /**
     *  Provides additional information about the label. The fault code must be defined in the FaultCodes attribute of the label group. Data in this field will be retained for service usage. Follow best practices for the security of your data. 
     */
    FaultCode?: FaultCode;
    /**
     *  Metadata providing additional information about the label.  Data in this field will be retained for service usage. Follow best practices for the security of your data.
     */
    Notes?: Comments;
    /**
     *  Indicates that a label pertains to a particular piece of equipment.  Data in this field will be retained for service usage. Follow best practices for the security of your data.
     */
    Equipment?: Equipment;
    /**
     *  A unique identifier for the request to create a label. If you do not set the client request token, Lookout for Equipment generates one. 
     */
    ClientToken: IdempotenceToken;
  }
  export interface CreateLabelResponse {
    /**
     *  The ID of the label that you have created. 
     */
    LabelId?: LabelId;
  }
  export interface CreateModelRequest {
    /**
     * The name for the machine learning model to be created.
     */
    ModelName: ModelName;
    /**
     * The name of the dataset for the machine learning model being created. 
     */
    DatasetName: DatasetIdentifier;
    /**
     * The data schema for the machine learning model being created. 
     */
    DatasetSchema?: DatasetSchema;
    /**
     * The input configuration for the labels being used for the machine learning model that's being created. 
     */
    LabelsInputConfiguration?: LabelsInputConfiguration;
    /**
     * A unique identifier for the request. If you do not set the client request token, Amazon Lookout for Equipment generates one. 
     */
    ClientToken: IdempotenceToken;
    /**
     * Indicates the time reference in the dataset that should be used to begin the subset of training data for the machine learning model. 
     */
    TrainingDataStartTime?: Timestamp;
    /**
     * Indicates the time reference in the dataset that should be used to end the subset of training data for the machine learning model. 
     */
    TrainingDataEndTime?: Timestamp;
    /**
     * Indicates the time reference in the dataset that should be used to begin the subset of evaluation data for the machine learning model. 
     */
    EvaluationDataStartTime?: Timestamp;
    /**
     *  Indicates the time reference in the dataset that should be used to end the subset of evaluation data for the machine learning model. 
     */
    EvaluationDataEndTime?: Timestamp;
    /**
     *  The Amazon Resource Name (ARN) of a role with permission to access the data source being used to create the machine learning model. 
     */
    RoleArn?: IamRoleArn;
    /**
     * The configuration is the TargetSamplingRate, which is the sampling rate of the data after post processing by Amazon Lookout for Equipment. For example, if you provide data that has been collected at a 1 second level and you want the system to resample the data at a 1 minute rate before training, the TargetSamplingRate is 1 minute. When providing a value for the TargetSamplingRate, you must attach the prefix "PT" to the rate you want. The value for a 1 second rate is therefore PT1S, the value for a 15 minute rate is PT15M, and the value for a 1 hour rate is PT1H 
     */
    DataPreProcessingConfiguration?: DataPreProcessingConfiguration;
    /**
     * Provides the identifier of the KMS key used to encrypt model data by Amazon Lookout for Equipment. 
     */
    ServerSideKmsKeyId?: NameOrArn;
    /**
     *  Any tags associated with the machine learning model being created. 
     */
    Tags?: TagList;
    /**
     * Indicates that the asset associated with this sensor has been shut off. As long as this condition is met, Lookout for Equipment will not use data from this asset for training, evaluation, or inference.
     */
    OffCondition?: OffCondition;
  }
  export interface CreateModelResponse {
    /**
     * The Amazon Resource Name (ARN) of the model being created. 
     */
    ModelArn?: ModelArn;
    /**
     * Indicates the status of the CreateModel operation. 
     */
    Status?: ModelStatus;
  }
  export interface CreateRetrainingSchedulerRequest {
    /**
     * The name of the model to add the retraining scheduler to. 
     */
    ModelName: ModelName;
    /**
     * The start date for the retraining scheduler. Lookout for Equipment truncates the time you provide to the nearest UTC day.
     */
    RetrainingStartDate?: Timestamp;
    /**
     * This parameter uses the ISO 8601 standard to set the frequency at which you want retraining to occur in terms of Years, Months, and/or Days (note: other parameters like Time are not currently supported). The minimum value is 30 days (P30D) and the maximum value is 1 year (P1Y). For example, the following values are valid:   P3M15D – Every 3 months and 15 days   P2M – Every 2 months   P150D – Every 150 days  
     */
    RetrainingFrequency: RetrainingFrequency;
    /**
     * The number of past days of data that will be used for retraining.
     */
    LookbackWindow: LookbackWindow;
    /**
     * Indicates how the service will use new models. In MANAGED mode, new models will automatically be used for inference if they have better performance than the current model. In MANUAL mode, the new models will not be used until they are manually activated.
     */
    PromoteMode?: ModelPromoteMode;
    /**
     * A unique identifier for the request. If you do not set the client request token, Amazon Lookout for Equipment generates one. 
     */
    ClientToken: IdempotenceToken;
  }
  export interface CreateRetrainingSchedulerResponse {
    /**
     * The name of the model that you added the retraining scheduler to. 
     */
    ModelName?: ModelName;
    /**
     * The ARN of the model that you added the retraining scheduler to. 
     */
    ModelArn?: ModelArn;
    /**
     * The status of the retraining scheduler. 
     */
    Status?: RetrainingSchedulerStatus;
  }
  export type DataDelayOffsetInMinutes = number;
  export type DataIngestionJobSummaries = DataIngestionJobSummary[];
  export interface DataIngestionJobSummary {
    /**
     * Indicates the job ID of the data ingestion job. 
     */
    JobId?: IngestionJobId;
    /**
     * The name of the dataset used for the data ingestion job. 
     */
    DatasetName?: DatasetName;
    /**
     * The Amazon Resource Name (ARN) of the dataset used in the data ingestion job. 
     */
    DatasetArn?: DatasetArn;
    /**
     *  Specifies information for the input data for the data inference job, including data Amazon S3 location parameters. 
     */
    IngestionInputConfiguration?: IngestionInputConfiguration;
    /**
     * Indicates the status of the data ingestion job. 
     */
    Status?: IngestionJobStatus;
  }
  export interface DataPreProcessingConfiguration {
    /**
     * The sampling rate of the data after post processing by Amazon Lookout for Equipment. For example, if you provide data that has been collected at a 1 second level and you want the system to resample the data at a 1 minute rate before training, the TargetSamplingRate is 1 minute. When providing a value for the TargetSamplingRate, you must attach the prefix "PT" to the rate you want. The value for a 1 second rate is therefore PT1S, the value for a 15 minute rate is PT15M, and the value for a 1 hour rate is PT1H 
     */
    TargetSamplingRate?: TargetSamplingRate;
  }
  export interface DataQualitySummary {
    /**
     *  Parameter that gives information about insufficient data for sensors in the dataset. This includes information about those sensors that have complete data missing and those with a short date range. 
     */
    InsufficientSensorData: InsufficientSensorData;
    /**
     *  Parameter that gives information about data that is missing over all the sensors in the input data. 
     */
    MissingSensorData: MissingSensorData;
    /**
     *  Parameter that gives information about data that is invalid over all the sensors in the input data. 
     */
    InvalidSensorData: InvalidSensorData;
    /**
     *  Parameter that gives information about unsupported timestamps in the input data. 
     */
    UnsupportedTimestamps: UnsupportedTimestamps;
    /**
     *  Parameter that gives information about duplicate timestamps in the input data. 
     */
    DuplicateTimestamps: DuplicateTimestamps;
  }
  export type DataSizeInBytes = number;
  export type DataUploadFrequency = "PT5M"|"PT10M"|"PT15M"|"PT30M"|"PT1H"|string;
  export type DatasetArn = string;
  export type DatasetIdentifier = string;
  export type DatasetName = string;
  export interface DatasetSchema {
    /**
     * The data schema used within the given dataset.
     */
    InlineDataSchema?: InlineDataSchema;
  }
  export type DatasetStatus = "CREATED"|"INGESTION_IN_PROGRESS"|"ACTIVE"|"IMPORT_IN_PROGRESS"|string;
  export type DatasetSummaries = DatasetSummary[];
  export interface DatasetSummary {
    /**
     * The name of the dataset. 
     */
    DatasetName?: DatasetName;
    /**
     * The Amazon Resource Name (ARN) of the specified dataset. 
     */
    DatasetArn?: DatasetArn;
    /**
     * Indicates the status of the dataset. 
     */
    Status?: DatasetStatus;
    /**
     * The time at which the dataset was created in Amazon Lookout for Equipment. 
     */
    CreatedAt?: Timestamp;
  }
  export interface DeleteDatasetRequest {
    /**
     * The name of the dataset to be deleted. 
     */
    DatasetName: DatasetIdentifier;
  }
  export interface DeleteInferenceSchedulerRequest {
    /**
     * The name of the inference scheduler to be deleted. 
     */
    InferenceSchedulerName: InferenceSchedulerIdentifier;
  }
  export interface DeleteLabelGroupRequest {
    /**
     *  The name of the label group that you want to delete. Data in this field will be retained for service usage. Follow best practices for the security of your data. 
     */
    LabelGroupName: LabelGroupName;
  }
  export interface DeleteLabelRequest {
    /**
     *  The name of the label group that contains the label that you want to delete. Data in this field will be retained for service usage. Follow best practices for the security of your data. 
     */
    LabelGroupName: LabelGroupName;
    /**
     *  The ID of the label that you want to delete. 
     */
    LabelId: LabelId;
  }
  export interface DeleteModelRequest {
    /**
     * The name of the machine learning model to be deleted. 
     */
    ModelName: ModelName;
  }
  export interface DeleteResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource for which the resource policy should be deleted.
     */
    ResourceArn: ResourceArn;
  }
  export interface DeleteRetrainingSchedulerRequest {
    /**
     * The name of the model whose retraining scheduler you want to delete. 
     */
    ModelName: ModelName;
  }
  export interface DescribeDataIngestionJobRequest {
    /**
     * The job ID of the data ingestion job. 
     */
    JobId: IngestionJobId;
  }
  export interface DescribeDataIngestionJobResponse {
    /**
     * Indicates the job ID of the data ingestion job. 
     */
    JobId?: IngestionJobId;
    /**
     * The Amazon Resource Name (ARN) of the dataset being used in the data ingestion job. 
     */
    DatasetArn?: DatasetArn;
    /**
     * Specifies the S3 location configuration for the data input for the data ingestion job. 
     */
    IngestionInputConfiguration?: IngestionInputConfiguration;
    /**
     * The Amazon Resource Name (ARN) of an IAM role with permission to access the data source being ingested. 
     */
    RoleArn?: IamRoleArn;
    /**
     * The time at which the data ingestion job was created. 
     */
    CreatedAt?: Timestamp;
    /**
     * Indicates the status of the DataIngestionJob operation. 
     */
    Status?: IngestionJobStatus;
    /**
     * Specifies the reason for failure when a data ingestion job has failed. 
     */
    FailedReason?: BoundedLengthString;
    /**
     *  Gives statistics about a completed ingestion job. These statistics primarily relate to quantifying incorrect data such as MissingCompleteSensorData, MissingSensorData, UnsupportedDateFormats, InsufficientSensorData, and DuplicateTimeStamps. 
     */
    DataQualitySummary?: DataQualitySummary;
    IngestedFilesSummary?: IngestedFilesSummary;
    /**
     *  Provides details about status of the ingestion job that is currently in progress. 
     */
    StatusDetail?: BoundedLengthString;
    /**
     *  Indicates the size of the ingested dataset. 
     */
    IngestedDataSize?: DataSizeInBytes;
    /**
     *  Indicates the earliest timestamp corresponding to data that was successfully ingested during this specific ingestion job. 
     */
    DataStartTime?: Timestamp;
    /**
     *  Indicates the latest timestamp corresponding to data that was successfully ingested during this specific ingestion job. 
     */
    DataEndTime?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the source dataset from which the data used for the data ingestion job was imported from.
     */
    SourceDatasetArn?: DatasetArn;
  }
  export interface DescribeDatasetRequest {
    /**
     * The name of the dataset to be described. 
     */
    DatasetName: DatasetIdentifier;
  }
  export interface DescribeDatasetResponse {
    /**
     * The name of the dataset being described. 
     */
    DatasetName?: DatasetName;
    /**
     * The Amazon Resource Name (ARN) of the dataset being described. 
     */
    DatasetArn?: DatasetArn;
    /**
     * Specifies the time the dataset was created in Lookout for Equipment. 
     */
    CreatedAt?: Timestamp;
    /**
     * Specifies the time the dataset was last updated, if it was. 
     */
    LastUpdatedAt?: Timestamp;
    /**
     * Indicates the status of the dataset. 
     */
    Status?: DatasetStatus;
    /**
     * A JSON description of the data that is in each time series dataset, including names, column names, and data types. 
     */
    Schema?: InlineDataSchema;
    /**
     * Provides the identifier of the KMS key used to encrypt dataset data by Amazon Lookout for Equipment. 
     */
    ServerSideKmsKeyId?: KmsKeyArn;
    /**
     * Specifies the S3 location configuration for the data input for the data ingestion job. 
     */
    IngestionInputConfiguration?: IngestionInputConfiguration;
    /**
     *  Gives statistics associated with the given dataset for the latest successful associated ingestion job id. These statistics primarily relate to quantifying incorrect data such as MissingCompleteSensorData, MissingSensorData, UnsupportedDateFormats, InsufficientSensorData, and DuplicateTimeStamps. 
     */
    DataQualitySummary?: DataQualitySummary;
    /**
     *  IngestedFilesSummary associated with the given dataset for the latest successful associated ingestion job id. 
     */
    IngestedFilesSummary?: IngestedFilesSummary;
    /**
     *  The Amazon Resource Name (ARN) of the IAM role that you are using for this the data ingestion job. 
     */
    RoleArn?: IamRoleArn;
    /**
     *  Indicates the earliest timestamp corresponding to data that was successfully ingested during the most recent ingestion of this particular dataset. 
     */
    DataStartTime?: Timestamp;
    /**
     *  Indicates the latest timestamp corresponding to data that was successfully ingested during the most recent ingestion of this particular dataset. 
     */
    DataEndTime?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the source dataset from which the current data being described was imported from.
     */
    SourceDatasetArn?: DatasetArn;
  }
  export interface DescribeInferenceSchedulerRequest {
    /**
     * The name of the inference scheduler being described. 
     */
    InferenceSchedulerName: InferenceSchedulerIdentifier;
  }
  export interface DescribeInferenceSchedulerResponse {
    /**
     * The Amazon Resource Name (ARN) of the machine learning model of the inference scheduler being described. 
     */
    ModelArn?: ModelArn;
    /**
     * The name of the machine learning model of the inference scheduler being described. 
     */
    ModelName?: ModelName;
    /**
     * The name of the inference scheduler being described. 
     */
    InferenceSchedulerName?: InferenceSchedulerName;
    /**
     * The Amazon Resource Name (ARN) of the inference scheduler being described. 
     */
    InferenceSchedulerArn?: InferenceSchedulerArn;
    /**
     * Indicates the status of the inference scheduler. 
     */
    Status?: InferenceSchedulerStatus;
    /**
     *  A period of time (in minutes) by which inference on the data is delayed after the data starts. For instance, if you select an offset delay time of five minutes, inference will not begin on the data until the first data measurement after the five minute mark. For example, if five minutes is selected, the inference scheduler will wake up at the configured frequency with the additional five minute delay time to check the customer S3 bucket. The customer can upload data at the same frequency and they don't need to stop and restart the scheduler when uploading new data.
     */
    DataDelayOffsetInMinutes?: DataDelayOffsetInMinutes;
    /**
     * Specifies how often data is uploaded to the source S3 bucket for the input data. This value is the length of time between data uploads. For instance, if you select 5 minutes, Amazon Lookout for Equipment will upload the real-time data to the source bucket once every 5 minutes. This frequency also determines how often Amazon Lookout for Equipment starts a scheduled inference on your data. In this example, it starts once every 5 minutes. 
     */
    DataUploadFrequency?: DataUploadFrequency;
    /**
     * Specifies the time at which the inference scheduler was created. 
     */
    CreatedAt?: Timestamp;
    /**
     * Specifies the time at which the inference scheduler was last updated, if it was. 
     */
    UpdatedAt?: Timestamp;
    /**
     *  Specifies configuration information for the input data for the inference scheduler, including delimiter, format, and dataset location. 
     */
    DataInputConfiguration?: InferenceInputConfiguration;
    /**
     *  Specifies information for the output results for the inference scheduler, including the output S3 location. 
     */
    DataOutputConfiguration?: InferenceOutputConfiguration;
    /**
     *  The Amazon Resource Name (ARN) of a role with permission to access the data source for the inference scheduler being described. 
     */
    RoleArn?: IamRoleArn;
    /**
     * Provides the identifier of the KMS key used to encrypt inference scheduler data by Amazon Lookout for Equipment. 
     */
    ServerSideKmsKeyId?: KmsKeyArn;
    /**
     * Indicates whether the latest execution for the inference scheduler was Anomalous (anomalous events found) or Normal (no anomalous events found).
     */
    LatestInferenceResult?: LatestInferenceResult;
  }
  export interface DescribeLabelGroupRequest {
    /**
     *  Returns the name of the label group. 
     */
    LabelGroupName: LabelGroupName;
  }
  export interface DescribeLabelGroupResponse {
    /**
     *  The name of the label group. 
     */
    LabelGroupName?: LabelGroupName;
    /**
     *  The Amazon Resource Name (ARN) of the label group. 
     */
    LabelGroupArn?: LabelGroupArn;
    /**
     *  Codes indicating the type of anomaly associated with the labels in the lagbel group. 
     */
    FaultCodes?: FaultCodes;
    /**
     *  The time at which the label group was created. 
     */
    CreatedAt?: Timestamp;
    /**
     *  The time at which the label group was updated. 
     */
    UpdatedAt?: Timestamp;
  }
  export interface DescribeLabelRequest {
    /**
     *  Returns the name of the group containing the label. 
     */
    LabelGroupName: LabelGroupName;
    /**
     *  Returns the ID of the label. 
     */
    LabelId: LabelId;
  }
  export interface DescribeLabelResponse {
    /**
     *  The name of the requested label group. 
     */
    LabelGroupName?: LabelGroupName;
    /**
     *  The Amazon Resource Name (ARN) of the requested label group. 
     */
    LabelGroupArn?: LabelGroupArn;
    /**
     *  The ID of the requested label. 
     */
    LabelId?: LabelId;
    /**
     *  The start time of the requested label. 
     */
    StartTime?: Timestamp;
    /**
     *  The end time of the requested label. 
     */
    EndTime?: Timestamp;
    /**
     *  Indicates whether a labeled event represents an anomaly. 
     */
    Rating?: LabelRating;
    /**
     *  Indicates the type of anomaly associated with the label.  Data in this field will be retained for service usage. Follow best practices for the security of your data.
     */
    FaultCode?: FaultCode;
    /**
     * Metadata providing additional information about the label. Data in this field will be retained for service usage. Follow best practices for the security of your data.
     */
    Notes?: Comments;
    /**
     *  Indicates that a label pertains to a particular piece of equipment. 
     */
    Equipment?: Equipment;
    /**
     *  The time at which the label was created. 
     */
    CreatedAt?: Timestamp;
  }
  export interface DescribeModelRequest {
    /**
     * The name of the machine learning model to be described. 
     */
    ModelName: ModelName;
  }
  export interface DescribeModelResponse {
    /**
     * The name of the machine learning model being described. 
     */
    ModelName?: ModelName;
    /**
     * The Amazon Resource Name (ARN) of the machine learning model being described. 
     */
    ModelArn?: ModelArn;
    /**
     * The name of the dataset being used by the machine learning being described. 
     */
    DatasetName?: DatasetName;
    /**
     * The Amazon Resouce Name (ARN) of the dataset used to create the machine learning model being described. 
     */
    DatasetArn?: DatasetArn;
    /**
     * A JSON description of the data that is in each time series dataset, including names, column names, and data types. 
     */
    Schema?: InlineDataSchema;
    /**
     * Specifies configuration information about the labels input, including its S3 location. 
     */
    LabelsInputConfiguration?: LabelsInputConfiguration;
    /**
     *  Indicates the time reference in the dataset that was used to begin the subset of training data for the machine learning model. 
     */
    TrainingDataStartTime?: Timestamp;
    /**
     *  Indicates the time reference in the dataset that was used to end the subset of training data for the machine learning model. 
     */
    TrainingDataEndTime?: Timestamp;
    /**
     *  Indicates the time reference in the dataset that was used to begin the subset of evaluation data for the machine learning model. 
     */
    EvaluationDataStartTime?: Timestamp;
    /**
     *  Indicates the time reference in the dataset that was used to end the subset of evaluation data for the machine learning model. 
     */
    EvaluationDataEndTime?: Timestamp;
    /**
     *  The Amazon Resource Name (ARN) of a role with permission to access the data source for the machine learning model being described. 
     */
    RoleArn?: IamRoleArn;
    /**
     * The configuration is the TargetSamplingRate, which is the sampling rate of the data after post processing by Amazon Lookout for Equipment. For example, if you provide data that has been collected at a 1 second level and you want the system to resample the data at a 1 minute rate before training, the TargetSamplingRate is 1 minute. When providing a value for the TargetSamplingRate, you must attach the prefix "PT" to the rate you want. The value for a 1 second rate is therefore PT1S, the value for a 15 minute rate is PT15M, and the value for a 1 hour rate is PT1H 
     */
    DataPreProcessingConfiguration?: DataPreProcessingConfiguration;
    /**
     * Specifies the current status of the model being described. Status describes the status of the most recent action of the model. 
     */
    Status?: ModelStatus;
    /**
     * Indicates the time at which the training of the machine learning model began. 
     */
    TrainingExecutionStartTime?: Timestamp;
    /**
     * Indicates the time at which the training of the machine learning model was completed. 
     */
    TrainingExecutionEndTime?: Timestamp;
    /**
     * If the training of the machine learning model failed, this indicates the reason for that failure. 
     */
    FailedReason?: BoundedLengthString;
    /**
     * The Model Metrics show an aggregated summary of the model's performance within the evaluation time range. This is the JSON content of the metrics created when evaluating the model. 
     */
    ModelMetrics?: ModelMetrics;
    /**
     * Indicates the last time the machine learning model was updated. The type of update is not specified. 
     */
    LastUpdatedTime?: Timestamp;
    /**
     * Indicates the time and date at which the machine learning model was created. 
     */
    CreatedAt?: Timestamp;
    /**
     * Provides the identifier of the KMS key used to encrypt model data by Amazon Lookout for Equipment. 
     */
    ServerSideKmsKeyId?: KmsKeyArn;
    /**
     * Indicates that the asset associated with this sensor has been shut off. As long as this condition is met, Lookout for Equipment will not use data from this asset for training, evaluation, or inference.
     */
    OffCondition?: OffCondition;
    /**
     * The Amazon Resource Name (ARN) of the source model version. This field appears if the active model version was imported.
     */
    SourceModelVersionArn?: ModelVersionArn;
    /**
     * The date and time when the import job was started. This field appears if the active model version was imported.
     */
    ImportJobStartTime?: Timestamp;
    /**
     * The date and time when the import job was completed. This field appears if the active model version was imported.
     */
    ImportJobEndTime?: Timestamp;
    /**
     * The name of the model version used by the inference schedular when running a scheduled inference execution.
     */
    ActiveModelVersion?: ModelVersion;
    /**
     * The Amazon Resource Name (ARN) of the model version used by the inference scheduler when running a scheduled inference execution.
     */
    ActiveModelVersionArn?: ModelVersionArn;
    /**
     * The date the active model version was activated.
     */
    ModelVersionActivatedAt?: Timestamp;
    /**
     * The model version that was set as the active model version prior to the current active model version.
     */
    PreviousActiveModelVersion?: ModelVersion;
    /**
     * The ARN of the model version that was set as the active model version prior to the current active model version.
     */
    PreviousActiveModelVersionArn?: ModelVersionArn;
    /**
     * The date and time when the previous active model version was activated.
     */
    PreviousModelVersionActivatedAt?: Timestamp;
    /**
     * If the model version was retrained, this field shows a summary of the performance of the prior model on the new training range. You can use the information in this JSON-formatted object to compare the new model version and the prior model version.
     */
    PriorModelMetrics?: ModelMetrics;
    /**
     * If the model version was generated by retraining and the training failed, this indicates the reason for that failure. 
     */
    LatestScheduledRetrainingFailedReason?: BoundedLengthString;
    /**
     * Indicates the status of the most recent scheduled retraining run. 
     */
    LatestScheduledRetrainingStatus?: ModelVersionStatus;
    /**
     * Indicates the most recent model version that was generated by retraining. 
     */
    LatestScheduledRetrainingModelVersion?: ModelVersion;
    /**
     * Indicates the start time of the most recent scheduled retraining run. 
     */
    LatestScheduledRetrainingStartTime?: Timestamp;
    /**
     * Indicates the number of days of data used in the most recent scheduled retraining run. 
     */
    LatestScheduledRetrainingAvailableDataInDays?: Integer;
    /**
     * Indicates the date and time that the next scheduled retraining run will start on. Lookout for Equipment truncates the time you provide to the nearest UTC day.
     */
    NextScheduledRetrainingStartDate?: Timestamp;
    /**
     * Indicates the start time of the inference data that has been accumulated. 
     */
    AccumulatedInferenceDataStartTime?: Timestamp;
    /**
     * Indicates the end time of the inference data that has been accumulated. 
     */
    AccumulatedInferenceDataEndTime?: Timestamp;
    /**
     * Indicates the status of the retraining scheduler. 
     */
    RetrainingSchedulerStatus?: RetrainingSchedulerStatus;
  }
  export interface DescribeModelVersionRequest {
    /**
     * The name of the machine learning model that this version belongs to.
     */
    ModelName: ModelName;
    /**
     * The version of the machine learning model.
     */
    ModelVersion: ModelVersion;
  }
  export interface DescribeModelVersionResponse {
    /**
     * The name of the machine learning model that this version belongs to.
     */
    ModelName?: ModelName;
    /**
     * The Amazon Resource Name (ARN) of the parent machine learning model that this version belong to.
     */
    ModelArn?: ModelArn;
    /**
     * The version of the machine learning model.
     */
    ModelVersion?: ModelVersion;
    /**
     * The Amazon Resource Name (ARN) of the model version.
     */
    ModelVersionArn?: ModelVersionArn;
    /**
     * The current status of the model version.
     */
    Status?: ModelVersionStatus;
    /**
     * Indicates whether this model version was created by training or by importing.
     */
    SourceType?: ModelVersionSourceType;
    /**
     * The name of the dataset used to train the model version.
     */
    DatasetName?: DatasetName;
    /**
     * The Amazon Resource Name (ARN) of the dataset used to train the model version.
     */
    DatasetArn?: DatasetArn;
    /**
     * The schema of the data used to train the model version.
     */
    Schema?: InlineDataSchema;
    LabelsInputConfiguration?: LabelsInputConfiguration;
    /**
     * The date on which the training data began being gathered. If you imported the version, this is the date that the training data in the source version began being gathered.
     */
    TrainingDataStartTime?: Timestamp;
    /**
     * The date on which the training data finished being gathered. If you imported the version, this is the date that the training data in the source version finished being gathered.
     */
    TrainingDataEndTime?: Timestamp;
    /**
     * The date on which the data in the evaluation set began being gathered. If you imported the version, this is the date that the evaluation set data in the source version began being gathered.
     */
    EvaluationDataStartTime?: Timestamp;
    /**
     * The date on which the data in the evaluation set began being gathered. If you imported the version, this is the date that the evaluation set data in the source version finished being gathered.
     */
    EvaluationDataEndTime?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the role that was used to train the model version.
     */
    RoleArn?: IamRoleArn;
    DataPreProcessingConfiguration?: DataPreProcessingConfiguration;
    /**
     * The time when the training of the version began.
     */
    TrainingExecutionStartTime?: Timestamp;
    /**
     * The time when the training of the version completed.
     */
    TrainingExecutionEndTime?: Timestamp;
    /**
     * The failure message if the training of the model version failed.
     */
    FailedReason?: BoundedLengthString;
    /**
     * Shows an aggregated summary, in JSON format, of the model's performance within the evaluation time range. These metrics are created when evaluating the model.
     */
    ModelMetrics?: ModelMetrics;
    /**
     * Indicates the last time the machine learning model version was updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * Indicates the time and date at which the machine learning model version was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The identifier of the KMS key key used to encrypt model version data by Amazon Lookout for Equipment.
     */
    ServerSideKmsKeyId?: KmsKeyArn;
    /**
     * Indicates that the asset associated with this sensor has been shut off. As long as this condition is met, Lookout for Equipment will not use data from this asset for training, evaluation, or inference.
     */
    OffCondition?: OffCondition;
    /**
     * If model version was imported, then this field is the arn of the source model version.
     */
    SourceModelVersionArn?: ModelVersionArn;
    /**
     * The date and time when the import job began. This field appears if the model version was imported.
     */
    ImportJobStartTime?: Timestamp;
    /**
     * The date and time when the import job completed. This field appears if the model version was imported.
     */
    ImportJobEndTime?: Timestamp;
    /**
     * The size in bytes of the imported data. This field appears if the model version was imported.
     */
    ImportedDataSizeInBytes?: DataSizeInBytes;
    /**
     * If the model version was retrained, this field shows a summary of the performance of the prior model on the new training range. You can use the information in this JSON-formatted object to compare the new model version and the prior model version.
     */
    PriorModelMetrics?: ModelMetrics;
    /**
     * Indicates the number of days of data used in the most recent scheduled retraining run. 
     */
    RetrainingAvailableDataInDays?: Integer;
    /**
     * Indicates whether the model version was promoted to be the active version after retraining or if there was an error with or cancellation of the retraining. 
     */
    AutoPromotionResult?: AutoPromotionResult;
    /**
     * Indicates the reason for the AutoPromotionResult. For example, a model might not be promoted if its performance was worse than the active version, if there was an error during training, or if the retraining scheduler was using MANUAL promote mode. The model will be promoted in MANAGED promote mode if the performance is better than the previous model. 
     */
    AutoPromotionResultReason?: AutoPromotionResultReason;
  }
  export interface DescribeResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that is associated with the resource policy.
     */
    ResourceArn: ResourceArn;
  }
  export interface DescribeResourcePolicyResponse {
    /**
     * A unique identifier for a revision of the resource policy.
     */
    PolicyRevisionId?: PolicyRevisionId;
    /**
     * The resource policy in a JSON-formatted string.
     */
    ResourcePolicy?: Policy;
    /**
     * The time when the resource policy was created.
     */
    CreationTime?: Timestamp;
    /**
     * The time when the resource policy was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export interface DescribeRetrainingSchedulerRequest {
    /**
     * The name of the model that the retraining scheduler is attached to. 
     */
    ModelName: ModelName;
  }
  export interface DescribeRetrainingSchedulerResponse {
    /**
     * The name of the model that the retraining scheduler is attached to. 
     */
    ModelName?: ModelName;
    /**
     * The ARN of the model that the retraining scheduler is attached to. 
     */
    ModelArn?: ModelArn;
    /**
     * The start date for the retraining scheduler. Lookout for Equipment truncates the time you provide to the nearest UTC day.
     */
    RetrainingStartDate?: Timestamp;
    /**
     * The frequency at which the model retraining is set. This follows the ISO 8601 guidelines.
     */
    RetrainingFrequency?: RetrainingFrequency;
    /**
     * The number of past days of data used for retraining.
     */
    LookbackWindow?: LookbackWindow;
    /**
     * The status of the retraining scheduler. 
     */
    Status?: RetrainingSchedulerStatus;
    /**
     * Indicates how the service uses new models. In MANAGED mode, new models are used for inference if they have better performance than the current model. In MANUAL mode, the new models are not used until they are manually activated.
     */
    PromoteMode?: ModelPromoteMode;
    /**
     * Indicates the time and date at which the retraining scheduler was created. 
     */
    CreatedAt?: Timestamp;
    /**
     * Indicates the time and date at which the retraining scheduler was updated. 
     */
    UpdatedAt?: Timestamp;
  }
  export interface DuplicateTimestamps {
    /**
     *  Indicates the total number of duplicate timestamps. 
     */
    TotalNumberOfDuplicateTimestamps: Integer;
  }
  export type Equipment = string;
  export type EventDurationInSeconds = number;
  export type FaultCode = string;
  export type FaultCodes = FaultCode[];
  export type FileNameTimestampFormat = string;
  export type Float = number;
  export type IamRoleArn = string;
  export type IdempotenceToken = string;
  export interface ImportDatasetRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset to import.
     */
    SourceDatasetArn: DatasetArn;
    /**
     * The name of the machine learning dataset to be created. If the dataset already exists, Amazon Lookout for Equipment overwrites the existing dataset. If you don't specify this field, it is filled with the name of the source dataset.
     */
    DatasetName?: DatasetName;
    /**
     * A unique identifier for the request. If you do not set the client request token, Amazon Lookout for Equipment generates one. 
     */
    ClientToken: IdempotenceToken;
    /**
     * Provides the identifier of the KMS key key used to encrypt model data by Amazon Lookout for Equipment. 
     */
    ServerSideKmsKeyId?: NameOrArn;
    /**
     * Any tags associated with the dataset to be created.
     */
    Tags?: TagList;
  }
  export interface ImportDatasetResponse {
    /**
     * The name of the created machine learning dataset.
     */
    DatasetName?: DatasetName;
    /**
     * The Amazon Resource Name (ARN) of the dataset that was imported.
     */
    DatasetArn?: DatasetArn;
    /**
     * The status of the ImportDataset operation.
     */
    Status?: DatasetStatus;
    /**
     * A unique identifier for the job of importing the dataset.
     */
    JobId?: IngestionJobId;
  }
  export interface ImportModelVersionRequest {
    /**
     * The Amazon Resource Name (ARN) of the model version to import.
     */
    SourceModelVersionArn: ModelVersionArn;
    /**
     * The name for the machine learning model to be created. If the model already exists, Amazon Lookout for Equipment creates a new version. If you do not specify this field, it is filled with the name of the source model.
     */
    ModelName?: ModelName;
    /**
     * The name of the dataset for the machine learning model being imported. 
     */
    DatasetName: DatasetIdentifier;
    LabelsInputConfiguration?: LabelsInputConfiguration;
    /**
     * A unique identifier for the request. If you do not set the client request token, Amazon Lookout for Equipment generates one. 
     */
    ClientToken: IdempotenceToken;
    /**
     * The Amazon Resource Name (ARN) of a role with permission to access the data source being used to create the machine learning model. 
     */
    RoleArn?: IamRoleArn;
    /**
     * Provides the identifier of the KMS key key used to encrypt model data by Amazon Lookout for Equipment. 
     */
    ServerSideKmsKeyId?: NameOrArn;
    /**
     * The tags associated with the machine learning model to be created. 
     */
    Tags?: TagList;
    /**
     * Indicates how to import the accumulated inference data when a model version is imported. The possible values are as follows:   NO_IMPORT – Don't import the data.   ADD_WHEN_EMPTY – Only import the data from the source model if there is no existing data in the target model.   OVERWRITE – Import the data from the source model and overwrite the existing data in the target model.  
     */
    InferenceDataImportStrategy?: InferenceDataImportStrategy;
  }
  export interface ImportModelVersionResponse {
    /**
     * The name for the machine learning model.
     */
    ModelName?: ModelName;
    /**
     * The Amazon Resource Name (ARN) of the model being created. 
     */
    ModelArn?: ModelArn;
    /**
     * The Amazon Resource Name (ARN) of the model version being created. 
     */
    ModelVersionArn?: ModelVersionArn;
    /**
     * The version of the model being created.
     */
    ModelVersion?: ModelVersion;
    /**
     * The status of the ImportModelVersion operation. 
     */
    Status?: ModelVersionStatus;
  }
  export type InferenceDataImportStrategy = "NO_IMPORT"|"ADD_WHEN_EMPTY"|"OVERWRITE"|string;
  export type InferenceEventSummaries = InferenceEventSummary[];
  export interface InferenceEventSummary {
    /**
     *  The Amazon Resource Name (ARN) of the inference scheduler being used for the inference event. 
     */
    InferenceSchedulerArn?: InferenceSchedulerArn;
    /**
     * The name of the inference scheduler being used for the inference events. 
     */
    InferenceSchedulerName?: InferenceSchedulerName;
    /**
     * Indicates the starting time of an inference event. 
     */
    EventStartTime?: Timestamp;
    /**
     * Indicates the ending time of an inference event. 
     */
    EventEndTime?: Timestamp;
    /**
     *  An array which specifies the names and values of all sensors contributing to an inference event.
     */
    Diagnostics?: ModelMetrics;
    /**
     *  Indicates the size of an inference event in seconds. 
     */
    EventDurationInSeconds?: EventDurationInSeconds;
  }
  export type InferenceExecutionStatus = "IN_PROGRESS"|"SUCCESS"|"FAILED"|string;
  export type InferenceExecutionSummaries = InferenceExecutionSummary[];
  export interface InferenceExecutionSummary {
    /**
     * The name of the machine learning model being used for the inference execution. 
     */
    ModelName?: ModelName;
    /**
     * The Amazon Resource Name (ARN) of the machine learning model used for the inference execution. 
     */
    ModelArn?: ModelArn;
    /**
     * The name of the inference scheduler being used for the inference execution. 
     */
    InferenceSchedulerName?: InferenceSchedulerName;
    /**
     *  The Amazon Resource Name (ARN) of the inference scheduler being used for the inference execution. 
     */
    InferenceSchedulerArn?: InferenceSchedulerArn;
    /**
     * Indicates the start time at which the inference scheduler began the specific inference execution. 
     */
    ScheduledStartTime?: Timestamp;
    /**
     * Indicates the time reference in the dataset at which the inference execution began. 
     */
    DataStartTime?: Timestamp;
    /**
     * Indicates the time reference in the dataset at which the inference execution stopped. 
     */
    DataEndTime?: Timestamp;
    /**
     *  Specifies configuration information for the input data for the inference scheduler, including delimiter, format, and dataset location. 
     */
    DataInputConfiguration?: InferenceInputConfiguration;
    /**
     *  Specifies configuration information for the output results from for the inference execution, including the output Amazon S3 location. 
     */
    DataOutputConfiguration?: InferenceOutputConfiguration;
    /**
     * The S3 object that the inference execution results were uploaded to.
     */
    CustomerResultObject?: S3Object;
    /**
     * Indicates the status of the inference execution. 
     */
    Status?: InferenceExecutionStatus;
    /**
     *  Specifies the reason for failure when an inference execution has failed. 
     */
    FailedReason?: BoundedLengthString;
    /**
     * The model version used for the inference execution.
     */
    ModelVersion?: ModelVersion;
    /**
     * The Amazon Resource Number (ARN) of the model version used for the inference execution.
     */
    ModelVersionArn?: ModelVersionArn;
  }
  export interface InferenceInputConfiguration {
    /**
     *  Specifies configuration information for the input data for the inference, including Amazon S3 location of input data.
     */
    S3InputConfiguration?: InferenceS3InputConfiguration;
    /**
     * Indicates the difference between your time zone and Coordinated Universal Time (UTC).
     */
    InputTimeZoneOffset?: TimeZoneOffset;
    /**
     * Specifies configuration information for the input data for the inference, including timestamp format and delimiter. 
     */
    InferenceInputNameConfiguration?: InferenceInputNameConfiguration;
  }
  export interface InferenceInputNameConfiguration {
    /**
     * The format of the timestamp, whether Epoch time, or standard, with or without hyphens (-). 
     */
    TimestampFormat?: FileNameTimestampFormat;
    /**
     * Indicates the delimiter character used between items in the data. 
     */
    ComponentTimestampDelimiter?: ComponentTimestampDelimiter;
  }
  export interface InferenceOutputConfiguration {
    /**
     *  Specifies configuration information for the output results from for the inference, output S3 location. 
     */
    S3OutputConfiguration: InferenceS3OutputConfiguration;
    /**
     * The ID number for the KMS key key used to encrypt the inference output. 
     */
    KmsKeyId?: NameOrArn;
  }
  export interface InferenceS3InputConfiguration {
    /**
     * The bucket containing the input dataset for the inference. 
     */
    Bucket: S3Bucket;
    /**
     * The prefix for the S3 bucket used for the input data for the inference. 
     */
    Prefix?: S3Prefix;
  }
  export interface InferenceS3OutputConfiguration {
    /**
     *  The bucket containing the output results from the inference 
     */
    Bucket: S3Bucket;
    /**
     *  The prefix for the S3 bucket used for the output results from the inference. 
     */
    Prefix?: S3Prefix;
  }
  export type InferenceSchedulerArn = string;
  export type InferenceSchedulerIdentifier = string;
  export type InferenceSchedulerName = string;
  export type InferenceSchedulerStatus = "PENDING"|"RUNNING"|"STOPPING"|"STOPPED"|string;
  export type InferenceSchedulerSummaries = InferenceSchedulerSummary[];
  export interface InferenceSchedulerSummary {
    /**
     * The name of the machine learning model used for the inference scheduler. 
     */
    ModelName?: ModelName;
    /**
     *  The Amazon Resource Name (ARN) of the machine learning model used by the inference scheduler. 
     */
    ModelArn?: ModelArn;
    /**
     * The name of the inference scheduler. 
     */
    InferenceSchedulerName?: InferenceSchedulerName;
    /**
     *  The Amazon Resource Name (ARN) of the inference scheduler. 
     */
    InferenceSchedulerArn?: InferenceSchedulerArn;
    /**
     * Indicates the status of the inference scheduler. 
     */
    Status?: InferenceSchedulerStatus;
    /**
     * A period of time (in minutes) by which inference on the data is delayed after the data starts. For instance, if an offset delay time of five minutes was selected, inference will not begin on the data until the first data measurement after the five minute mark. For example, if five minutes is selected, the inference scheduler will wake up at the configured frequency with the additional five minute delay time to check the customer S3 bucket. The customer can upload data at the same frequency and they don't need to stop and restart the scheduler when uploading new data. 
     */
    DataDelayOffsetInMinutes?: DataDelayOffsetInMinutes;
    /**
     * How often data is uploaded to the source S3 bucket for the input data. This value is the length of time between data uploads. For instance, if you select 5 minutes, Amazon Lookout for Equipment will upload the real-time data to the source bucket once every 5 minutes. This frequency also determines how often Amazon Lookout for Equipment starts a scheduled inference on your data. In this example, it starts once every 5 minutes. 
     */
    DataUploadFrequency?: DataUploadFrequency;
    /**
     * Indicates whether the latest execution for the inference scheduler was Anomalous (anomalous events found) or Normal (no anomalous events found).
     */
    LatestInferenceResult?: LatestInferenceResult;
  }
  export interface IngestedFilesSummary {
    /**
     * Indicates the total number of files that were submitted for ingestion.
     */
    TotalNumberOfFiles: Integer;
    /**
     * Indicates the number of files that were successfully ingested.
     */
    IngestedNumberOfFiles: Integer;
    /**
     * Indicates the number of files that were discarded. A file could be discarded because its format is invalid (for example, a jpg or pdf) or not readable.
     */
    DiscardedFiles?: ListOfDiscardedFiles;
  }
  export interface IngestionInputConfiguration {
    /**
     * The location information for the S3 bucket used for input data for the data ingestion. 
     */
    S3InputConfiguration: IngestionS3InputConfiguration;
  }
  export type IngestionJobId = string;
  export type IngestionJobStatus = "IN_PROGRESS"|"SUCCESS"|"FAILED"|"IMPORT_IN_PROGRESS"|string;
  export interface IngestionS3InputConfiguration {
    /**
     * The name of the S3 bucket used for the input data for the data ingestion. 
     */
    Bucket: S3Bucket;
    /**
     * The prefix for the S3 location being used for the input data for the data ingestion. 
     */
    Prefix?: S3Prefix;
    /**
     *  The pattern for matching the Amazon S3 files that will be used for ingestion. If the schema was created previously without any KeyPattern, then the default KeyPattern {prefix}/{component_name}/* is used to download files from Amazon S3 according to the schema. This field is required when ingestion is being done for the first time. Valid Values: {prefix}/{component_name}_* | {prefix}/{component_name}/* | {prefix}/{component_name}[DELIMITER]* (Allowed delimiters : space, dot, underscore, hyphen)
     */
    KeyPattern?: KeyPattern;
  }
  export type InlineDataSchema = string;
  export interface InsufficientSensorData {
    /**
     *  Parameter that describes the total number of sensors that have data completely missing for it. 
     */
    MissingCompleteSensorData: MissingCompleteSensorData;
    /**
     *  Parameter that describes the total number of sensors that have a short date range of less than 90 days of data overall. 
     */
    SensorsWithShortDateRange: SensorsWithShortDateRange;
  }
  export type Integer = number;
  export interface InvalidSensorData {
    /**
     *  Indicates the number of sensors that have at least some invalid values. 
     */
    AffectedSensorCount: Integer;
    /**
     *  Indicates the total number of invalid values across all the sensors. 
     */
    TotalNumberOfInvalidValues: Integer;
  }
  export type KeyPattern = string;
  export type KmsKeyArn = string;
  export type LabelGroupArn = string;
  export type LabelGroupName = string;
  export type LabelGroupSummaries = LabelGroupSummary[];
  export interface LabelGroupSummary {
    /**
     *  The name of the label group. 
     */
    LabelGroupName?: LabelGroupName;
    /**
     *  The Amazon Resource Name (ARN) of the label group. 
     */
    LabelGroupArn?: LabelGroupArn;
    /**
     *  The time at which the label group was created. 
     */
    CreatedAt?: Timestamp;
    /**
     *  The time at which the label group was updated. 
     */
    UpdatedAt?: Timestamp;
  }
  export type LabelId = string;
  export type LabelRating = "ANOMALY"|"NO_ANOMALY"|"NEUTRAL"|string;
  export type LabelSummaries = LabelSummary[];
  export interface LabelSummary {
    /**
     *  The name of the label group. 
     */
    LabelGroupName?: LabelGroupName;
    /**
     *  The ID of the label. 
     */
    LabelId?: LabelId;
    /**
     *  The Amazon Resource Name (ARN) of the label group. 
     */
    LabelGroupArn?: LabelGroupArn;
    /**
     *  The timestamp indicating the start of the label. 
     */
    StartTime?: Timestamp;
    /**
     *  The timestamp indicating the end of the label. 
     */
    EndTime?: Timestamp;
    /**
     *  Indicates whether a labeled event represents an anomaly. 
     */
    Rating?: LabelRating;
    /**
     *  Indicates the type of anomaly associated with the label.  Data in this field will be retained for service usage. Follow best practices for the security of your data.
     */
    FaultCode?: FaultCode;
    /**
     *  Indicates that a label pertains to a particular piece of equipment. 
     */
    Equipment?: Equipment;
    /**
     *  The time at which the label was created. 
     */
    CreatedAt?: Timestamp;
  }
  export interface LabelsInputConfiguration {
    /**
     * Contains location information for the S3 location being used for label data. 
     */
    S3InputConfiguration?: LabelsS3InputConfiguration;
    /**
     *  The name of the label group to be used for label data. 
     */
    LabelGroupName?: LabelGroupName;
  }
  export interface LabelsS3InputConfiguration {
    /**
     * The name of the S3 bucket holding the label data. 
     */
    Bucket: S3Bucket;
    /**
     *  The prefix for the S3 bucket used for the label data. 
     */
    Prefix?: S3Prefix;
  }
  export interface LargeTimestampGaps {
    /**
     *  Indicates whether there is a potential data issue related to large gaps in timestamps. 
     */
    Status: StatisticalIssueStatus;
    /**
     *  Indicates the number of large timestamp gaps, if there are any. 
     */
    NumberOfLargeTimestampGaps?: Integer;
    /**
     *  Indicates the size of the largest timestamp gap, in days. 
     */
    MaxTimestampGapInDays?: Integer;
  }
  export type LatestInferenceResult = "ANOMALOUS"|"NORMAL"|string;
  export interface ListDataIngestionJobsRequest {
    /**
     * The name of the dataset being used for the data ingestion job. 
     */
    DatasetName?: DatasetName;
    /**
     * An opaque pagination token indicating where to continue the listing of data ingestion jobs. 
     */
    NextToken?: NextToken;
    /**
     *  Specifies the maximum number of data ingestion jobs to list. 
     */
    MaxResults?: MaxResults;
    /**
     * Indicates the status of the data ingestion job. 
     */
    Status?: IngestionJobStatus;
  }
  export interface ListDataIngestionJobsResponse {
    /**
     *  An opaque pagination token indicating where to continue the listing of data ingestion jobs. 
     */
    NextToken?: NextToken;
    /**
     * Specifies information about the specific data ingestion job, including dataset name and status. 
     */
    DataIngestionJobSummaries?: DataIngestionJobSummaries;
  }
  export interface ListDatasetsRequest {
    /**
     *  An opaque pagination token indicating where to continue the listing of datasets. 
     */
    NextToken?: NextToken;
    /**
     *  Specifies the maximum number of datasets to list. 
     */
    MaxResults?: MaxResults;
    /**
     * The beginning of the name of the datasets to be listed. 
     */
    DatasetNameBeginsWith?: DatasetName;
  }
  export interface ListDatasetsResponse {
    /**
     *  An opaque pagination token indicating where to continue the listing of datasets. 
     */
    NextToken?: NextToken;
    /**
     * Provides information about the specified dataset, including creation time, dataset ARN, and status. 
     */
    DatasetSummaries?: DatasetSummaries;
  }
  export interface ListInferenceEventsRequest {
    /**
     * An opaque pagination token indicating where to continue the listing of inference events.
     */
    NextToken?: NextToken;
    /**
     * Specifies the maximum number of inference events to list. 
     */
    MaxResults?: MaxResults;
    /**
     * The name of the inference scheduler for the inference events listed. 
     */
    InferenceSchedulerName: InferenceSchedulerIdentifier;
    /**
     *  Lookout for Equipment will return all the inference events with an end time equal to or greater than the start time given.
     */
    IntervalStartTime: Timestamp;
    /**
     * Returns all the inference events with an end start time equal to or greater than less than the end time given.
     */
    IntervalEndTime: Timestamp;
  }
  export interface ListInferenceEventsResponse {
    /**
     * An opaque pagination token indicating where to continue the listing of inference executions. 
     */
    NextToken?: NextToken;
    /**
     * Provides an array of information about the individual inference events returned from the ListInferenceEvents operation, including scheduler used, event start time, event end time, diagnostics, and so on. 
     */
    InferenceEventSummaries?: InferenceEventSummaries;
  }
  export interface ListInferenceExecutionsRequest {
    /**
     * An opaque pagination token indicating where to continue the listing of inference executions.
     */
    NextToken?: NextToken;
    /**
     * Specifies the maximum number of inference executions to list. 
     */
    MaxResults?: MaxResults;
    /**
     * The name of the inference scheduler for the inference execution listed. 
     */
    InferenceSchedulerName: InferenceSchedulerIdentifier;
    /**
     * The time reference in the inferenced dataset after which Amazon Lookout for Equipment started the inference execution. 
     */
    DataStartTimeAfter?: Timestamp;
    /**
     * The time reference in the inferenced dataset before which Amazon Lookout for Equipment stopped the inference execution. 
     */
    DataEndTimeBefore?: Timestamp;
    /**
     * The status of the inference execution. 
     */
    Status?: InferenceExecutionStatus;
  }
  export interface ListInferenceExecutionsResponse {
    /**
     *  An opaque pagination token indicating where to continue the listing of inference executions. 
     */
    NextToken?: NextToken;
    /**
     * Provides an array of information about the individual inference executions returned from the ListInferenceExecutions operation, including model used, inference scheduler, data configuration, and so on. 
     */
    InferenceExecutionSummaries?: InferenceExecutionSummaries;
  }
  export interface ListInferenceSchedulersRequest {
    /**
     *  An opaque pagination token indicating where to continue the listing of inference schedulers. 
     */
    NextToken?: NextToken;
    /**
     *  Specifies the maximum number of inference schedulers to list. 
     */
    MaxResults?: MaxResults;
    /**
     * The beginning of the name of the inference schedulers to be listed. 
     */
    InferenceSchedulerNameBeginsWith?: InferenceSchedulerIdentifier;
    /**
     * The name of the machine learning model used by the inference scheduler to be listed. 
     */
    ModelName?: ModelName;
    /**
     * Specifies the current status of the inference schedulers.
     */
    Status?: InferenceSchedulerStatus;
  }
  export interface ListInferenceSchedulersResponse {
    /**
     *  An opaque pagination token indicating where to continue the listing of inference schedulers. 
     */
    NextToken?: NextToken;
    /**
     * Provides information about the specified inference scheduler, including data upload frequency, model name and ARN, and status. 
     */
    InferenceSchedulerSummaries?: InferenceSchedulerSummaries;
  }
  export interface ListLabelGroupsRequest {
    /**
     *  The beginning of the name of the label groups to be listed. 
     */
    LabelGroupNameBeginsWith?: LabelGroupName;
    /**
     *  An opaque pagination token indicating where to continue the listing of label groups. 
     */
    NextToken?: NextToken;
    /**
     *  Specifies the maximum number of label groups to list. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListLabelGroupsResponse {
    /**
     *  An opaque pagination token indicating where to continue the listing of label groups. 
     */
    NextToken?: NextToken;
    /**
     *  A summary of the label groups. 
     */
    LabelGroupSummaries?: LabelGroupSummaries;
  }
  export interface ListLabelsRequest {
    /**
     *  Retruns the name of the label group. 
     */
    LabelGroupName: LabelGroupName;
    /**
     *  Returns all the labels with a end time equal to or later than the start time given. 
     */
    IntervalStartTime?: Timestamp;
    /**
     *  Returns all labels with a start time earlier than the end time given. 
     */
    IntervalEndTime?: Timestamp;
    /**
     *  Returns labels with a particular fault code. 
     */
    FaultCode?: FaultCode;
    /**
     *  Lists the labels that pertain to a particular piece of equipment. 
     */
    Equipment?: Equipment;
    /**
     *  An opaque pagination token indicating where to continue the listing of label groups. 
     */
    NextToken?: NextToken;
    /**
     *  Specifies the maximum number of labels to list. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListLabelsResponse {
    /**
     *  An opaque pagination token indicating where to continue the listing of datasets. 
     */
    NextToken?: NextToken;
    /**
     *  A summary of the items in the label group. 
     */
    LabelSummaries?: LabelSummaries;
  }
  export interface ListModelVersionsRequest {
    /**
     * Then name of the machine learning model for which the model versions are to be listed.
     */
    ModelName: ModelName;
    /**
     * If the total number of results exceeds the limit that the response can display, the response returns an opaque pagination token indicating where to continue the listing of machine learning model versions. Use this token in the NextToken field in the request to list the next page of results.
     */
    NextToken?: NextToken;
    /**
     * Specifies the maximum number of machine learning model versions to list.
     */
    MaxResults?: MaxResults;
    /**
     * Filter the results based on the current status of the model version.
     */
    Status?: ModelVersionStatus;
    /**
     * Filter the results based on the way the model version was generated.
     */
    SourceType?: ModelVersionSourceType;
    /**
     * Filter results to return all the model versions created before this time.
     */
    CreatedAtEndTime?: Timestamp;
    /**
     * Filter results to return all the model versions created after this time.
     */
    CreatedAtStartTime?: Timestamp;
    /**
     * Specifies the highest version of the model to return in the list.
     */
    MaxModelVersion?: ModelVersion;
    /**
     * Specifies the lowest version of the model to return in the list.
     */
    MinModelVersion?: ModelVersion;
  }
  export interface ListModelVersionsResponse {
    /**
     * If the total number of results exceeds the limit that the response can display, the response returns an opaque pagination token indicating where to continue the listing of machine learning model versions. Use this token in the NextToken field in the request to list the next page of results.
     */
    NextToken?: NextToken;
    /**
     * Provides information on the specified model version, including the created time, model and dataset ARNs, and status.
     */
    ModelVersionSummaries?: ModelVersionSummaries;
  }
  export interface ListModelsRequest {
    /**
     *  An opaque pagination token indicating where to continue the listing of machine learning models. 
     */
    NextToken?: NextToken;
    /**
     *  Specifies the maximum number of machine learning models to list. 
     */
    MaxResults?: MaxResults;
    /**
     * The status of the machine learning model. 
     */
    Status?: ModelStatus;
    /**
     * The beginning of the name of the machine learning models being listed. 
     */
    ModelNameBeginsWith?: ModelName;
    /**
     * The beginning of the name of the dataset of the machine learning models to be listed. 
     */
    DatasetNameBeginsWith?: DatasetName;
  }
  export interface ListModelsResponse {
    /**
     *  An opaque pagination token indicating where to continue the listing of machine learning models. 
     */
    NextToken?: NextToken;
    /**
     * Provides information on the specified model, including created time, model and dataset ARNs, and status. 
     */
    ModelSummaries?: ModelSummaries;
  }
  export type ListOfDiscardedFiles = S3Object[];
  export interface ListRetrainingSchedulersRequest {
    /**
     * Specify this field to only list retraining schedulers whose machine learning models begin with the value you specify. 
     */
    ModelNameBeginsWith?: ModelName;
    /**
     * Specify this field to only list retraining schedulers whose status matches the value you specify. 
     */
    Status?: RetrainingSchedulerStatus;
    /**
     * If the number of results exceeds the maximum, a pagination token is returned. Use the token in the request to show the next page of retraining schedulers.
     */
    NextToken?: NextToken;
    /**
     * Specifies the maximum number of retraining schedulers to list. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListRetrainingSchedulersResponse {
    /**
     * Provides information on the specified retraining scheduler, including the model name, model ARN, status, and start date. 
     */
    RetrainingSchedulerSummaries?: RetrainingSchedulerSummaries;
    /**
     * If the number of results exceeds the maximum, this pagination token is returned. Use this token in the request to show the next page of retraining schedulers.
     */
    NextToken?: NextToken;
  }
  export interface ListSensorStatisticsRequest {
    /**
     *  The name of the dataset associated with the list of Sensor Statistics. 
     */
    DatasetName: DatasetName;
    /**
     *  The ingestion job id associated with the list of Sensor Statistics. To get sensor statistics for a particular ingestion job id, both dataset name and ingestion job id must be submitted as inputs. 
     */
    IngestionJobId?: IngestionJobId;
    /**
     * Specifies the maximum number of sensors for which to retrieve statistics. 
     */
    MaxResults?: MaxResults;
    /**
     * An opaque pagination token indicating where to continue the listing of sensor statistics. 
     */
    NextToken?: NextToken;
  }
  export interface ListSensorStatisticsResponse {
    /**
     * Provides ingestion-based statistics regarding the specified sensor with respect to various validation types, such as whether data exists, the number and percentage of missing values, and the number and percentage of duplicate timestamps. 
     */
    SensorStatisticsSummaries?: SensorStatisticsSummaries;
    /**
     * An opaque pagination token indicating where to continue the listing of sensor statistics. 
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource (such as the dataset or model) that is the focus of the ListTagsForResource operation. 
     */
    ResourceArn: AmazonResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     *  Any tags associated with the resource. 
     */
    Tags?: TagList;
  }
  export type LookbackWindow = string;
  export type MaxResults = number;
  export interface MissingCompleteSensorData {
    /**
     *  Indicates the number of sensors that have data missing completely. 
     */
    AffectedSensorCount: Integer;
  }
  export interface MissingSensorData {
    /**
     *  Indicates the number of sensors that have atleast some data missing. 
     */
    AffectedSensorCount: Integer;
    /**
     *  Indicates the total number of missing values across all the sensors. 
     */
    TotalNumberOfMissingValues: Integer;
  }
  export type ModelArn = string;
  export type ModelMetrics = string;
  export type ModelName = string;
  export type ModelPromoteMode = "MANAGED"|"MANUAL"|string;
  export type ModelStatus = "IN_PROGRESS"|"SUCCESS"|"FAILED"|"IMPORT_IN_PROGRESS"|string;
  export type ModelSummaries = ModelSummary[];
  export interface ModelSummary {
    /**
     * The name of the machine learning model. 
     */
    ModelName?: ModelName;
    /**
     *  The Amazon Resource Name (ARN) of the machine learning model. 
     */
    ModelArn?: ModelArn;
    /**
     * The name of the dataset being used for the machine learning model. 
     */
    DatasetName?: DatasetName;
    /**
     *  The Amazon Resource Name (ARN) of the dataset used to create the model. 
     */
    DatasetArn?: DatasetArn;
    /**
     * Indicates the status of the machine learning model. 
     */
    Status?: ModelStatus;
    /**
     * The time at which the specific model was created. 
     */
    CreatedAt?: Timestamp;
    /**
     * The model version that the inference scheduler uses to run an inference execution.
     */
    ActiveModelVersion?: ModelVersion;
    /**
     * The Amazon Resource Name (ARN) of the model version that is set as active. The active model version is the model version that the inference scheduler uses to run an inference execution.
     */
    ActiveModelVersionArn?: ModelVersionArn;
    /**
     * Indicates the status of the most recent scheduled retraining run. 
     */
    LatestScheduledRetrainingStatus?: ModelVersionStatus;
    /**
     * Indicates the most recent model version that was generated by retraining. 
     */
    LatestScheduledRetrainingModelVersion?: ModelVersion;
    /**
     * Indicates the start time of the most recent scheduled retraining run. 
     */
    LatestScheduledRetrainingStartTime?: Timestamp;
    /**
     * Indicates the date that the next scheduled retraining run will start on. Lookout for Equipment truncates the time you provide to the nearest UTC day.
     */
    NextScheduledRetrainingStartDate?: Timestamp;
    /**
     * Indicates the status of the retraining scheduler. 
     */
    RetrainingSchedulerStatus?: RetrainingSchedulerStatus;
  }
  export type ModelVersion = number;
  export type ModelVersionArn = string;
  export type ModelVersionSourceType = "TRAINING"|"RETRAINING"|"IMPORT"|string;
  export type ModelVersionStatus = "IN_PROGRESS"|"SUCCESS"|"FAILED"|"IMPORT_IN_PROGRESS"|"CANCELED"|string;
  export type ModelVersionSummaries = ModelVersionSummary[];
  export interface ModelVersionSummary {
    /**
     * The name of the model that this model version is a version of.
     */
    ModelName?: ModelName;
    /**
     * The Amazon Resource Name (ARN) of the model that this model version is a version of.
     */
    ModelArn?: ModelArn;
    /**
     * The version of the model.
     */
    ModelVersion?: ModelVersion;
    /**
     * The Amazon Resource Name (ARN) of the model version.
     */
    ModelVersionArn?: ModelVersionArn;
    /**
     * The time when this model version was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The current status of the model version.
     */
    Status?: ModelVersionStatus;
    /**
     * Indicates how this model version was generated.
     */
    SourceType?: ModelVersionSourceType;
  }
  export interface MonotonicValues {
    /**
     *  Indicates whether there is a potential data issue related to having monotonic values. 
     */
    Status: StatisticalIssueStatus;
    /**
     *  Indicates the monotonicity of values. Can be INCREASING, DECREASING, or STATIC. 
     */
    Monotonicity?: Monotonicity;
  }
  export type Monotonicity = "DECREASING"|"INCREASING"|"STATIC"|string;
  export interface MultipleOperatingModes {
    /**
     *  Indicates whether there is a potential data issue related to having multiple operating modes. 
     */
    Status: StatisticalIssueStatus;
  }
  export type NameOrArn = string;
  export type NextToken = string;
  export type OffCondition = string;
  export type Policy = string;
  export type PolicyRevisionId = string;
  export interface PutResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource for which the policy is being created.
     */
    ResourceArn: ResourceArn;
    /**
     * The JSON-formatted resource policy to create.
     */
    ResourcePolicy: Policy;
    /**
     * A unique identifier for a revision of the resource policy.
     */
    PolicyRevisionId?: PolicyRevisionId;
    /**
     * A unique identifier for the request. If you do not set the client request token, Amazon Lookout for Equipment generates one. 
     */
    ClientToken: IdempotenceToken;
  }
  export interface PutResourcePolicyResponse {
    /**
     * The Amazon Resource Name (ARN) of the resource for which the policy was created.
     */
    ResourceArn?: ResourceArn;
    /**
     * A unique identifier for a revision of the resource policy.
     */
    PolicyRevisionId?: PolicyRevisionId;
  }
  export type ResourceArn = string;
  export type RetrainingFrequency = string;
  export type RetrainingSchedulerStatus = "PENDING"|"RUNNING"|"STOPPING"|"STOPPED"|string;
  export type RetrainingSchedulerSummaries = RetrainingSchedulerSummary[];
  export interface RetrainingSchedulerSummary {
    /**
     * The name of the model that the retraining scheduler is attached to. 
     */
    ModelName?: ModelName;
    /**
     * The ARN of the model that the retraining scheduler is attached to. 
     */
    ModelArn?: ModelArn;
    /**
     * The status of the retraining scheduler. 
     */
    Status?: RetrainingSchedulerStatus;
    /**
     * The start date for the retraining scheduler. Lookout for Equipment truncates the time you provide to the nearest UTC day.
     */
    RetrainingStartDate?: Timestamp;
    /**
     * The frequency at which the model retraining is set. This follows the ISO 8601 guidelines.
     */
    RetrainingFrequency?: RetrainingFrequency;
    /**
     * The number of past days of data used for retraining.
     */
    LookbackWindow?: LookbackWindow;
  }
  export type S3Bucket = string;
  export type S3Key = string;
  export interface S3Object {
    /**
     * The name of the specific S3 bucket. 
     */
    Bucket: S3Bucket;
    /**
     * The Amazon Web Services Key Management Service (KMS key) key being used to encrypt the S3 object. Without this key, data in the bucket is not accessible. 
     */
    Key: S3Key;
  }
  export type S3Prefix = string;
  export type SensorName = string;
  export type SensorStatisticsSummaries = SensorStatisticsSummary[];
  export interface SensorStatisticsSummary {
    /**
     *  Name of the component to which the particular sensor belongs for which the statistics belong to. 
     */
    ComponentName?: ComponentName;
    /**
     *  Name of the sensor that the statistics belong to. 
     */
    SensorName?: SensorName;
    /**
     *  Parameter that indicates whether data exists for the sensor that the statistics belong to. 
     */
    DataExists?: Boolean;
    /**
     *  Parameter that describes the total number of, and percentage of, values that are missing for the sensor that the statistics belong to. 
     */
    MissingValues?: CountPercent;
    /**
     *  Parameter that describes the total number of, and percentage of, values that are invalid for the sensor that the statistics belong to. 
     */
    InvalidValues?: CountPercent;
    /**
     *  Parameter that describes the total number of invalid date entries associated with the sensor that the statistics belong to. 
     */
    InvalidDateEntries?: CountPercent;
    /**
     *  Parameter that describes the total number of duplicate timestamp records associated with the sensor that the statistics belong to. 
     */
    DuplicateTimestamps?: CountPercent;
    /**
     *  Parameter that describes potential risk about whether data associated with the sensor is categorical. 
     */
    CategoricalValues?: CategoricalValues;
    /**
     *  Parameter that describes potential risk about whether data associated with the sensor has more than one operating mode. 
     */
    MultipleOperatingModes?: MultipleOperatingModes;
    /**
     *  Parameter that describes potential risk about whether data associated with the sensor contains one or more large gaps between consecutive timestamps. 
     */
    LargeTimestampGaps?: LargeTimestampGaps;
    /**
     *  Parameter that describes potential risk about whether data associated with the sensor is mostly monotonic. 
     */
    MonotonicValues?: MonotonicValues;
    /**
     *  Indicates the time reference to indicate the beginning of valid data associated with the sensor that the statistics belong to. 
     */
    DataStartTime?: Timestamp;
    /**
     *  Indicates the time reference to indicate the end of valid data associated with the sensor that the statistics belong to. 
     */
    DataEndTime?: Timestamp;
  }
  export interface SensorsWithShortDateRange {
    /**
     *  Indicates the number of sensors that have less than 90 days of data. 
     */
    AffectedSensorCount: Integer;
  }
  export interface StartDataIngestionJobRequest {
    /**
     * The name of the dataset being used by the data ingestion job. 
     */
    DatasetName: DatasetIdentifier;
    /**
     *  Specifies information for the input data for the data ingestion job, including dataset S3 location. 
     */
    IngestionInputConfiguration: IngestionInputConfiguration;
    /**
     *  The Amazon Resource Name (ARN) of a role with permission to access the data source for the data ingestion job. 
     */
    RoleArn: IamRoleArn;
    /**
     *  A unique identifier for the request. If you do not set the client request token, Amazon Lookout for Equipment generates one. 
     */
    ClientToken: IdempotenceToken;
  }
  export interface StartDataIngestionJobResponse {
    /**
     * Indicates the job ID of the data ingestion job. 
     */
    JobId?: IngestionJobId;
    /**
     * Indicates the status of the StartDataIngestionJob operation. 
     */
    Status?: IngestionJobStatus;
  }
  export interface StartInferenceSchedulerRequest {
    /**
     * The name of the inference scheduler to be started. 
     */
    InferenceSchedulerName: InferenceSchedulerIdentifier;
  }
  export interface StartInferenceSchedulerResponse {
    /**
     * The Amazon Resource Name (ARN) of the machine learning model being used by the inference scheduler. 
     */
    ModelArn?: ModelArn;
    /**
     * The name of the machine learning model being used by the inference scheduler. 
     */
    ModelName?: ModelName;
    /**
     * The name of the inference scheduler being started. 
     */
    InferenceSchedulerName?: InferenceSchedulerName;
    /**
     * The Amazon Resource Name (ARN) of the inference scheduler being started. 
     */
    InferenceSchedulerArn?: InferenceSchedulerArn;
    /**
     * Indicates the status of the inference scheduler. 
     */
    Status?: InferenceSchedulerStatus;
  }
  export interface StartRetrainingSchedulerRequest {
    /**
     * The name of the model whose retraining scheduler you want to start.
     */
    ModelName: ModelName;
  }
  export interface StartRetrainingSchedulerResponse {
    /**
     * The name of the model whose retraining scheduler is being started. 
     */
    ModelName?: ModelName;
    /**
     * The ARN of the model whose retraining scheduler is being started. 
     */
    ModelArn?: ModelArn;
    /**
     * The status of the retraining scheduler. 
     */
    Status?: RetrainingSchedulerStatus;
  }
  export type StatisticalIssueStatus = "POTENTIAL_ISSUE_DETECTED"|"NO_ISSUE_DETECTED"|string;
  export interface StopInferenceSchedulerRequest {
    /**
     * The name of the inference scheduler to be stopped. 
     */
    InferenceSchedulerName: InferenceSchedulerIdentifier;
  }
  export interface StopInferenceSchedulerResponse {
    /**
     * The Amazon Resource Name (ARN) of the machine learning model used by the inference scheduler being stopped. 
     */
    ModelArn?: ModelArn;
    /**
     * The name of the machine learning model used by the inference scheduler being stopped. 
     */
    ModelName?: ModelName;
    /**
     * The name of the inference scheduler being stopped. 
     */
    InferenceSchedulerName?: InferenceSchedulerName;
    /**
     * The Amazon Resource Name (ARN) of the inference schedule being stopped. 
     */
    InferenceSchedulerArn?: InferenceSchedulerArn;
    /**
     * Indicates the status of the inference scheduler. 
     */
    Status?: InferenceSchedulerStatus;
  }
  export interface StopRetrainingSchedulerRequest {
    /**
     * The name of the model whose retraining scheduler you want to stop.
     */
    ModelName: ModelName;
  }
  export interface StopRetrainingSchedulerResponse {
    /**
     * The name of the model whose retraining scheduler is being stopped. 
     */
    ModelName?: ModelName;
    /**
     * The ARN of the model whose retraining scheduler is being stopped. 
     */
    ModelArn?: ModelArn;
    /**
     * The status of the retraining scheduler. 
     */
    Status?: RetrainingSchedulerStatus;
  }
  export interface Tag {
    /**
     * The key for the specified tag. 
     */
    Key: TagKey;
    /**
     * The value for the specified tag. 
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the specific resource to which the tag should be associated. 
     */
    ResourceArn: AmazonResourceArn;
    /**
     * The tag or tags to be associated with a specific resource. Both the tag key and value are specified. 
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TargetSamplingRate = "PT1S"|"PT5S"|"PT10S"|"PT15S"|"PT30S"|"PT1M"|"PT5M"|"PT10M"|"PT15M"|"PT30M"|"PT1H"|string;
  export type TimeZoneOffset = string;
  export type Timestamp = Date;
  export interface UnsupportedTimestamps {
    /**
     *  Indicates the total number of unsupported timestamps across the ingested data. 
     */
    TotalNumberOfUnsupportedTimestamps: Integer;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to which the tag is currently associated. 
     */
    ResourceArn: AmazonResourceArn;
    /**
     * Specifies the key of the tag to be removed from a specified resource. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateActiveModelVersionRequest {
    /**
     * The name of the machine learning model for which the active model version is being set.
     */
    ModelName: ModelName;
    /**
     * The version of the machine learning model for which the active model version is being set.
     */
    ModelVersion: ModelVersion;
  }
  export interface UpdateActiveModelVersionResponse {
    /**
     * The name of the machine learning model for which the active model version was set.
     */
    ModelName?: ModelName;
    /**
     * The Amazon Resource Name (ARN) of the machine learning model for which the active model version was set.
     */
    ModelArn?: ModelArn;
    /**
     * The version that is currently active of the machine learning model for which the active model version was set.
     */
    CurrentActiveVersion?: ModelVersion;
    /**
     * The previous version that was active of the machine learning model for which the active model version was set.
     */
    PreviousActiveVersion?: ModelVersion;
    /**
     * The Amazon Resource Name (ARN) of the machine learning model version that is the current active model version.
     */
    CurrentActiveVersionArn?: ModelVersionArn;
    /**
     * The Amazon Resource Name (ARN) of the machine learning model version that was the previous active model version.
     */
    PreviousActiveVersionArn?: ModelVersionArn;
  }
  export interface UpdateInferenceSchedulerRequest {
    /**
     * The name of the inference scheduler to be updated. 
     */
    InferenceSchedulerName: InferenceSchedulerIdentifier;
    /**
     *  A period of time (in minutes) by which inference on the data is delayed after the data starts. For instance, if you select an offset delay time of five minutes, inference will not begin on the data until the first data measurement after the five minute mark. For example, if five minutes is selected, the inference scheduler will wake up at the configured frequency with the additional five minute delay time to check the customer S3 bucket. The customer can upload data at the same frequency and they don't need to stop and restart the scheduler when uploading new data.
     */
    DataDelayOffsetInMinutes?: DataDelayOffsetInMinutes;
    /**
     * How often data is uploaded to the source S3 bucket for the input data. The value chosen is the length of time between data uploads. For instance, if you select 5 minutes, Amazon Lookout for Equipment will upload the real-time data to the source bucket once every 5 minutes. This frequency also determines how often Amazon Lookout for Equipment starts a scheduled inference on your data. In this example, it starts once every 5 minutes. 
     */
    DataUploadFrequency?: DataUploadFrequency;
    /**
     *  Specifies information for the input data for the inference scheduler, including delimiter, format, and dataset location. 
     */
    DataInputConfiguration?: InferenceInputConfiguration;
    /**
     *  Specifies information for the output results from the inference scheduler, including the output S3 location. 
     */
    DataOutputConfiguration?: InferenceOutputConfiguration;
    /**
     *  The Amazon Resource Name (ARN) of a role with permission to access the data source for the inference scheduler. 
     */
    RoleArn?: IamRoleArn;
  }
  export interface UpdateLabelGroupRequest {
    /**
     *  The name of the label group to be updated. 
     */
    LabelGroupName: LabelGroupName;
    /**
     *  Updates the code indicating the type of anomaly associated with the label.  Data in this field will be retained for service usage. Follow best practices for the security of your data.
     */
    FaultCodes?: FaultCodes;
  }
  export interface UpdateModelRequest {
    /**
     * The name of the model to update.
     */
    ModelName: ModelName;
    LabelsInputConfiguration?: LabelsInputConfiguration;
    /**
     * The ARN of the model to update.
     */
    RoleArn?: IamRoleArn;
  }
  export interface UpdateRetrainingSchedulerRequest {
    /**
     * The name of the model whose retraining scheduler you want to update. 
     */
    ModelName: ModelName;
    /**
     * The start date for the retraining scheduler. Lookout for Equipment truncates the time you provide to the nearest UTC day.
     */
    RetrainingStartDate?: Timestamp;
    /**
     * This parameter uses the ISO 8601 standard to set the frequency at which you want retraining to occur in terms of Years, Months, and/or Days (note: other parameters like Time are not currently supported). The minimum value is 30 days (P30D) and the maximum value is 1 year (P1Y). For example, the following values are valid:   P3M15D – Every 3 months and 15 days   P2M – Every 2 months   P150D – Every 150 days  
     */
    RetrainingFrequency?: RetrainingFrequency;
    /**
     * The number of past days of data that will be used for retraining.
     */
    LookbackWindow?: LookbackWindow;
    /**
     * Indicates how the service will use new models. In MANAGED mode, new models will automatically be used for inference if they have better performance than the current model. In MANUAL mode, the new models will not be used until they are manually activated.
     */
    PromoteMode?: ModelPromoteMode;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-12-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the LookoutEquipment client.
   */
  export import Types = LookoutEquipment;
}
export = LookoutEquipment;
