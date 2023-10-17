import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class LookoutVision extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: LookoutVision.Types.ClientConfiguration)
  config: Config & LookoutVision.Types.ClientConfiguration;
  /**
   * Creates a new dataset in an Amazon Lookout for Vision project. CreateDataset can create a training or a test dataset from a valid dataset source (DatasetSource). If you want a single dataset project, specify train for the value of DatasetType. To have a project with separate training and test datasets, call CreateDataset twice. On the first call, specify train for the value of DatasetType. On the second call, specify test for the value of DatasetType.  This operation requires permissions to perform the lookoutvision:CreateDataset operation.
   */
  createDataset(params: LookoutVision.Types.CreateDatasetRequest, callback?: (err: AWSError, data: LookoutVision.Types.CreateDatasetResponse) => void): Request<LookoutVision.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates a new dataset in an Amazon Lookout for Vision project. CreateDataset can create a training or a test dataset from a valid dataset source (DatasetSource). If you want a single dataset project, specify train for the value of DatasetType. To have a project with separate training and test datasets, call CreateDataset twice. On the first call, specify train for the value of DatasetType. On the second call, specify test for the value of DatasetType.  This operation requires permissions to perform the lookoutvision:CreateDataset operation.
   */
  createDataset(callback?: (err: AWSError, data: LookoutVision.Types.CreateDatasetResponse) => void): Request<LookoutVision.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates a new version of a model within an an Amazon Lookout for Vision project. CreateModel is an asynchronous operation in which Amazon Lookout for Vision trains, tests, and evaluates a new version of a model.  To get the current status, check the Status field returned in the response from DescribeModel. If the project has a single dataset, Amazon Lookout for Vision internally splits the dataset to create a training and a test dataset. If the project has a training and a test dataset, Lookout for Vision uses the respective datasets to train and test the model.  After training completes, the evaluation metrics are stored at the location specified in OutputConfig.  This operation requires permissions to perform the lookoutvision:CreateModel operation. If you want to tag your model, you also require permission to the lookoutvision:TagResource operation.
   */
  createModel(params: LookoutVision.Types.CreateModelRequest, callback?: (err: AWSError, data: LookoutVision.Types.CreateModelResponse) => void): Request<LookoutVision.Types.CreateModelResponse, AWSError>;
  /**
   * Creates a new version of a model within an an Amazon Lookout for Vision project. CreateModel is an asynchronous operation in which Amazon Lookout for Vision trains, tests, and evaluates a new version of a model.  To get the current status, check the Status field returned in the response from DescribeModel. If the project has a single dataset, Amazon Lookout for Vision internally splits the dataset to create a training and a test dataset. If the project has a training and a test dataset, Lookout for Vision uses the respective datasets to train and test the model.  After training completes, the evaluation metrics are stored at the location specified in OutputConfig.  This operation requires permissions to perform the lookoutvision:CreateModel operation. If you want to tag your model, you also require permission to the lookoutvision:TagResource operation.
   */
  createModel(callback?: (err: AWSError, data: LookoutVision.Types.CreateModelResponse) => void): Request<LookoutVision.Types.CreateModelResponse, AWSError>;
  /**
   * Creates an empty Amazon Lookout for Vision project. After you create the project, add a dataset by calling CreateDataset. This operation requires permissions to perform the lookoutvision:CreateProject operation.
   */
  createProject(params: LookoutVision.Types.CreateProjectRequest, callback?: (err: AWSError, data: LookoutVision.Types.CreateProjectResponse) => void): Request<LookoutVision.Types.CreateProjectResponse, AWSError>;
  /**
   * Creates an empty Amazon Lookout for Vision project. After you create the project, add a dataset by calling CreateDataset. This operation requires permissions to perform the lookoutvision:CreateProject operation.
   */
  createProject(callback?: (err: AWSError, data: LookoutVision.Types.CreateProjectResponse) => void): Request<LookoutVision.Types.CreateProjectResponse, AWSError>;
  /**
   * Deletes an existing Amazon Lookout for Vision dataset.  If your the project has a single dataset, you must create a new dataset before you can create a model. If you project has a training dataset and a test dataset consider the following.    If you delete the test dataset, your project reverts to a single dataset project. If you then train the model, Amazon Lookout for Vision internally splits the remaining dataset into a training and test dataset.   If you delete the training dataset, you must create a training dataset before you can create a model.   This operation requires permissions to perform the lookoutvision:DeleteDataset operation.
   */
  deleteDataset(params: LookoutVision.Types.DeleteDatasetRequest, callback?: (err: AWSError, data: LookoutVision.Types.DeleteDatasetResponse) => void): Request<LookoutVision.Types.DeleteDatasetResponse, AWSError>;
  /**
   * Deletes an existing Amazon Lookout for Vision dataset.  If your the project has a single dataset, you must create a new dataset before you can create a model. If you project has a training dataset and a test dataset consider the following.    If you delete the test dataset, your project reverts to a single dataset project. If you then train the model, Amazon Lookout for Vision internally splits the remaining dataset into a training and test dataset.   If you delete the training dataset, you must create a training dataset before you can create a model.   This operation requires permissions to perform the lookoutvision:DeleteDataset operation.
   */
  deleteDataset(callback?: (err: AWSError, data: LookoutVision.Types.DeleteDatasetResponse) => void): Request<LookoutVision.Types.DeleteDatasetResponse, AWSError>;
  /**
   * Deletes an Amazon Lookout for Vision model. You can't delete a running model. To stop a running model, use the StopModel operation. It might take a few seconds to delete a model. To determine if a model has been deleted, call ListModels and check if the version of the model (ModelVersion) is in the Models array.   This operation requires permissions to perform the lookoutvision:DeleteModel operation.
   */
  deleteModel(params: LookoutVision.Types.DeleteModelRequest, callback?: (err: AWSError, data: LookoutVision.Types.DeleteModelResponse) => void): Request<LookoutVision.Types.DeleteModelResponse, AWSError>;
  /**
   * Deletes an Amazon Lookout for Vision model. You can't delete a running model. To stop a running model, use the StopModel operation. It might take a few seconds to delete a model. To determine if a model has been deleted, call ListModels and check if the version of the model (ModelVersion) is in the Models array.   This operation requires permissions to perform the lookoutvision:DeleteModel operation.
   */
  deleteModel(callback?: (err: AWSError, data: LookoutVision.Types.DeleteModelResponse) => void): Request<LookoutVision.Types.DeleteModelResponse, AWSError>;
  /**
   * Deletes an Amazon Lookout for Vision project. To delete a project, you must first delete each version of the model associated with the project. To delete a model use the DeleteModel operation. You also have to delete the dataset(s) associated with the model. For more information, see DeleteDataset. The images referenced by the training and test datasets aren't deleted.  This operation requires permissions to perform the lookoutvision:DeleteProject operation.
   */
  deleteProject(params: LookoutVision.Types.DeleteProjectRequest, callback?: (err: AWSError, data: LookoutVision.Types.DeleteProjectResponse) => void): Request<LookoutVision.Types.DeleteProjectResponse, AWSError>;
  /**
   * Deletes an Amazon Lookout for Vision project. To delete a project, you must first delete each version of the model associated with the project. To delete a model use the DeleteModel operation. You also have to delete the dataset(s) associated with the model. For more information, see DeleteDataset. The images referenced by the training and test datasets aren't deleted.  This operation requires permissions to perform the lookoutvision:DeleteProject operation.
   */
  deleteProject(callback?: (err: AWSError, data: LookoutVision.Types.DeleteProjectResponse) => void): Request<LookoutVision.Types.DeleteProjectResponse, AWSError>;
  /**
   * Describe an Amazon Lookout for Vision dataset. This operation requires permissions to perform the lookoutvision:DescribeDataset operation.
   */
  describeDataset(params: LookoutVision.Types.DescribeDatasetRequest, callback?: (err: AWSError, data: LookoutVision.Types.DescribeDatasetResponse) => void): Request<LookoutVision.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Describe an Amazon Lookout for Vision dataset. This operation requires permissions to perform the lookoutvision:DescribeDataset operation.
   */
  describeDataset(callback?: (err: AWSError, data: LookoutVision.Types.DescribeDatasetResponse) => void): Request<LookoutVision.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Describes a version of an Amazon Lookout for Vision model. This operation requires permissions to perform the lookoutvision:DescribeModel operation.
   */
  describeModel(params: LookoutVision.Types.DescribeModelRequest, callback?: (err: AWSError, data: LookoutVision.Types.DescribeModelResponse) => void): Request<LookoutVision.Types.DescribeModelResponse, AWSError>;
  /**
   * Describes a version of an Amazon Lookout for Vision model. This operation requires permissions to perform the lookoutvision:DescribeModel operation.
   */
  describeModel(callback?: (err: AWSError, data: LookoutVision.Types.DescribeModelResponse) => void): Request<LookoutVision.Types.DescribeModelResponse, AWSError>;
  /**
   * Describes an Amazon Lookout for Vision model packaging job.  This operation requires permissions to perform the lookoutvision:DescribeModelPackagingJob operation. For more information, see Using your Amazon Lookout for Vision model on an edge device in the Amazon Lookout for Vision Developer Guide. 
   */
  describeModelPackagingJob(params: LookoutVision.Types.DescribeModelPackagingJobRequest, callback?: (err: AWSError, data: LookoutVision.Types.DescribeModelPackagingJobResponse) => void): Request<LookoutVision.Types.DescribeModelPackagingJobResponse, AWSError>;
  /**
   * Describes an Amazon Lookout for Vision model packaging job.  This operation requires permissions to perform the lookoutvision:DescribeModelPackagingJob operation. For more information, see Using your Amazon Lookout for Vision model on an edge device in the Amazon Lookout for Vision Developer Guide. 
   */
  describeModelPackagingJob(callback?: (err: AWSError, data: LookoutVision.Types.DescribeModelPackagingJobResponse) => void): Request<LookoutVision.Types.DescribeModelPackagingJobResponse, AWSError>;
  /**
   * Describes an Amazon Lookout for Vision project. This operation requires permissions to perform the lookoutvision:DescribeProject operation.
   */
  describeProject(params: LookoutVision.Types.DescribeProjectRequest, callback?: (err: AWSError, data: LookoutVision.Types.DescribeProjectResponse) => void): Request<LookoutVision.Types.DescribeProjectResponse, AWSError>;
  /**
   * Describes an Amazon Lookout for Vision project. This operation requires permissions to perform the lookoutvision:DescribeProject operation.
   */
  describeProject(callback?: (err: AWSError, data: LookoutVision.Types.DescribeProjectResponse) => void): Request<LookoutVision.Types.DescribeProjectResponse, AWSError>;
  /**
   * Detects anomalies in an image that you supply.  The response from DetectAnomalies includes a boolean prediction that the image contains one or more anomalies and a confidence value for the prediction. If the model is an image segmentation model, the response also includes segmentation information for each type of anomaly found in the image.  Before calling DetectAnomalies, you must first start your model with the StartModel operation. You are charged for the amount of time, in minutes, that a model runs and for the number of anomaly detection units that your model uses. If you are not using a model, use the StopModel operation to stop your model.   For more information, see Detecting anomalies in an image in the Amazon Lookout for Vision developer guide. This operation requires permissions to perform the lookoutvision:DetectAnomalies operation.
   */
  detectAnomalies(params: LookoutVision.Types.DetectAnomaliesRequest, callback?: (err: AWSError, data: LookoutVision.Types.DetectAnomaliesResponse) => void): Request<LookoutVision.Types.DetectAnomaliesResponse, AWSError>;
  /**
   * Detects anomalies in an image that you supply.  The response from DetectAnomalies includes a boolean prediction that the image contains one or more anomalies and a confidence value for the prediction. If the model is an image segmentation model, the response also includes segmentation information for each type of anomaly found in the image.  Before calling DetectAnomalies, you must first start your model with the StartModel operation. You are charged for the amount of time, in minutes, that a model runs and for the number of anomaly detection units that your model uses. If you are not using a model, use the StopModel operation to stop your model.   For more information, see Detecting anomalies in an image in the Amazon Lookout for Vision developer guide. This operation requires permissions to perform the lookoutvision:DetectAnomalies operation.
   */
  detectAnomalies(callback?: (err: AWSError, data: LookoutVision.Types.DetectAnomaliesResponse) => void): Request<LookoutVision.Types.DetectAnomaliesResponse, AWSError>;
  /**
   * Lists the JSON Lines within a dataset. An Amazon Lookout for Vision JSON Line contains the anomaly information for a single image, including the image location and the assigned label. This operation requires permissions to perform the lookoutvision:ListDatasetEntries operation.
   */
  listDatasetEntries(params: LookoutVision.Types.ListDatasetEntriesRequest, callback?: (err: AWSError, data: LookoutVision.Types.ListDatasetEntriesResponse) => void): Request<LookoutVision.Types.ListDatasetEntriesResponse, AWSError>;
  /**
   * Lists the JSON Lines within a dataset. An Amazon Lookout for Vision JSON Line contains the anomaly information for a single image, including the image location and the assigned label. This operation requires permissions to perform the lookoutvision:ListDatasetEntries operation.
   */
  listDatasetEntries(callback?: (err: AWSError, data: LookoutVision.Types.ListDatasetEntriesResponse) => void): Request<LookoutVision.Types.ListDatasetEntriesResponse, AWSError>;
  /**
   *  Lists the model packaging jobs created for an Amazon Lookout for Vision project.  This operation requires permissions to perform the lookoutvision:ListModelPackagingJobs operation.  For more information, see Using your Amazon Lookout for Vision model on an edge device in the Amazon Lookout for Vision Developer Guide. 
   */
  listModelPackagingJobs(params: LookoutVision.Types.ListModelPackagingJobsRequest, callback?: (err: AWSError, data: LookoutVision.Types.ListModelPackagingJobsResponse) => void): Request<LookoutVision.Types.ListModelPackagingJobsResponse, AWSError>;
  /**
   *  Lists the model packaging jobs created for an Amazon Lookout for Vision project.  This operation requires permissions to perform the lookoutvision:ListModelPackagingJobs operation.  For more information, see Using your Amazon Lookout for Vision model on an edge device in the Amazon Lookout for Vision Developer Guide. 
   */
  listModelPackagingJobs(callback?: (err: AWSError, data: LookoutVision.Types.ListModelPackagingJobsResponse) => void): Request<LookoutVision.Types.ListModelPackagingJobsResponse, AWSError>;
  /**
   * Lists the versions of a model in an Amazon Lookout for Vision project. The ListModels operation is eventually consistent. Recent calls to CreateModel might take a while to appear in the response from ListProjects. This operation requires permissions to perform the lookoutvision:ListModels operation.
   */
  listModels(params: LookoutVision.Types.ListModelsRequest, callback?: (err: AWSError, data: LookoutVision.Types.ListModelsResponse) => void): Request<LookoutVision.Types.ListModelsResponse, AWSError>;
  /**
   * Lists the versions of a model in an Amazon Lookout for Vision project. The ListModels operation is eventually consistent. Recent calls to CreateModel might take a while to appear in the response from ListProjects. This operation requires permissions to perform the lookoutvision:ListModels operation.
   */
  listModels(callback?: (err: AWSError, data: LookoutVision.Types.ListModelsResponse) => void): Request<LookoutVision.Types.ListModelsResponse, AWSError>;
  /**
   * Lists the Amazon Lookout for Vision projects in your AWS account that are in the AWS Region in which you call ListProjects. The ListProjects operation is eventually consistent. Recent calls to CreateProject and DeleteProject might take a while to appear in the response from ListProjects. This operation requires permissions to perform the lookoutvision:ListProjects operation.
   */
  listProjects(params: LookoutVision.Types.ListProjectsRequest, callback?: (err: AWSError, data: LookoutVision.Types.ListProjectsResponse) => void): Request<LookoutVision.Types.ListProjectsResponse, AWSError>;
  /**
   * Lists the Amazon Lookout for Vision projects in your AWS account that are in the AWS Region in which you call ListProjects. The ListProjects operation is eventually consistent. Recent calls to CreateProject and DeleteProject might take a while to appear in the response from ListProjects. This operation requires permissions to perform the lookoutvision:ListProjects operation.
   */
  listProjects(callback?: (err: AWSError, data: LookoutVision.Types.ListProjectsResponse) => void): Request<LookoutVision.Types.ListProjectsResponse, AWSError>;
  /**
   * Returns a list of tags attached to the specified Amazon Lookout for Vision model. This operation requires permissions to perform the lookoutvision:ListTagsForResource operation.
   */
  listTagsForResource(params: LookoutVision.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: LookoutVision.Types.ListTagsForResourceResponse) => void): Request<LookoutVision.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of tags attached to the specified Amazon Lookout for Vision model. This operation requires permissions to perform the lookoutvision:ListTagsForResource operation.
   */
  listTagsForResource(callback?: (err: AWSError, data: LookoutVision.Types.ListTagsForResourceResponse) => void): Request<LookoutVision.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Starts the running of the version of an Amazon Lookout for Vision model. Starting a model takes a while to complete. To check the current state of the model, use DescribeModel. A model is ready to use when its status is HOSTED. Once the model is running, you can detect custom labels in new images by calling DetectAnomalies.  You are charged for the amount of time that the model is running. To stop a running model, call StopModel.  This operation requires permissions to perform the lookoutvision:StartModel operation.
   */
  startModel(params: LookoutVision.Types.StartModelRequest, callback?: (err: AWSError, data: LookoutVision.Types.StartModelResponse) => void): Request<LookoutVision.Types.StartModelResponse, AWSError>;
  /**
   * Starts the running of the version of an Amazon Lookout for Vision model. Starting a model takes a while to complete. To check the current state of the model, use DescribeModel. A model is ready to use when its status is HOSTED. Once the model is running, you can detect custom labels in new images by calling DetectAnomalies.  You are charged for the amount of time that the model is running. To stop a running model, call StopModel.  This operation requires permissions to perform the lookoutvision:StartModel operation.
   */
  startModel(callback?: (err: AWSError, data: LookoutVision.Types.StartModelResponse) => void): Request<LookoutVision.Types.StartModelResponse, AWSError>;
  /**
   * Starts an Amazon Lookout for Vision model packaging job. A model packaging job creates an AWS IoT Greengrass component for a Lookout for Vision model. You can use the component to deploy your model to an edge device managed by Greengrass.  Use the DescribeModelPackagingJob API to determine the current status of the job. The model packaging job is complete if the value of Status is SUCCEEDED. To deploy the component to the target device, use the component name and component version with the AWS IoT Greengrass CreateDeployment API. This operation requires the following permissions:    lookoutvision:StartModelPackagingJob     s3:PutObject     s3:GetBucketLocation     kms:GenerateDataKey     greengrass:CreateComponentVersion     greengrass:DescribeComponent    (Optional) greengrass:TagResource. Only required if you want to tag the component.   For more information, see Using your Amazon Lookout for Vision model on an edge device in the Amazon Lookout for Vision Developer Guide. 
   */
  startModelPackagingJob(params: LookoutVision.Types.StartModelPackagingJobRequest, callback?: (err: AWSError, data: LookoutVision.Types.StartModelPackagingJobResponse) => void): Request<LookoutVision.Types.StartModelPackagingJobResponse, AWSError>;
  /**
   * Starts an Amazon Lookout for Vision model packaging job. A model packaging job creates an AWS IoT Greengrass component for a Lookout for Vision model. You can use the component to deploy your model to an edge device managed by Greengrass.  Use the DescribeModelPackagingJob API to determine the current status of the job. The model packaging job is complete if the value of Status is SUCCEEDED. To deploy the component to the target device, use the component name and component version with the AWS IoT Greengrass CreateDeployment API. This operation requires the following permissions:    lookoutvision:StartModelPackagingJob     s3:PutObject     s3:GetBucketLocation     kms:GenerateDataKey     greengrass:CreateComponentVersion     greengrass:DescribeComponent    (Optional) greengrass:TagResource. Only required if you want to tag the component.   For more information, see Using your Amazon Lookout for Vision model on an edge device in the Amazon Lookout for Vision Developer Guide. 
   */
  startModelPackagingJob(callback?: (err: AWSError, data: LookoutVision.Types.StartModelPackagingJobResponse) => void): Request<LookoutVision.Types.StartModelPackagingJobResponse, AWSError>;
  /**
   * Stops the hosting of a running model. The operation might take a while to complete. To check the current status, call DescribeModel.  After the model hosting stops, the Status of the model is TRAINED. This operation requires permissions to perform the lookoutvision:StopModel operation.
   */
  stopModel(params: LookoutVision.Types.StopModelRequest, callback?: (err: AWSError, data: LookoutVision.Types.StopModelResponse) => void): Request<LookoutVision.Types.StopModelResponse, AWSError>;
  /**
   * Stops the hosting of a running model. The operation might take a while to complete. To check the current status, call DescribeModel.  After the model hosting stops, the Status of the model is TRAINED. This operation requires permissions to perform the lookoutvision:StopModel operation.
   */
  stopModel(callback?: (err: AWSError, data: LookoutVision.Types.StopModelResponse) => void): Request<LookoutVision.Types.StopModelResponse, AWSError>;
  /**
   * Adds one or more key-value tags to an Amazon Lookout for Vision model. For more information, see Tagging a model in the Amazon Lookout for Vision Developer Guide.  This operation requires permissions to perform the lookoutvision:TagResource operation.
   */
  tagResource(params: LookoutVision.Types.TagResourceRequest, callback?: (err: AWSError, data: LookoutVision.Types.TagResourceResponse) => void): Request<LookoutVision.Types.TagResourceResponse, AWSError>;
  /**
   * Adds one or more key-value tags to an Amazon Lookout for Vision model. For more information, see Tagging a model in the Amazon Lookout for Vision Developer Guide.  This operation requires permissions to perform the lookoutvision:TagResource operation.
   */
  tagResource(callback?: (err: AWSError, data: LookoutVision.Types.TagResourceResponse) => void): Request<LookoutVision.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from an Amazon Lookout for Vision model. For more information, see Tagging a model in the Amazon Lookout for Vision Developer Guide.  This operation requires permissions to perform the lookoutvision:UntagResource operation.
   */
  untagResource(params: LookoutVision.Types.UntagResourceRequest, callback?: (err: AWSError, data: LookoutVision.Types.UntagResourceResponse) => void): Request<LookoutVision.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from an Amazon Lookout for Vision model. For more information, see Tagging a model in the Amazon Lookout for Vision Developer Guide.  This operation requires permissions to perform the lookoutvision:UntagResource operation.
   */
  untagResource(callback?: (err: AWSError, data: LookoutVision.Types.UntagResourceResponse) => void): Request<LookoutVision.Types.UntagResourceResponse, AWSError>;
  /**
   * Adds or updates one or more JSON Line entries in a dataset. A JSON Line includes information about an image used for training or testing an Amazon Lookout for Vision model. To update an existing JSON Line, use the source-ref field to identify the JSON Line. The JSON line that you supply replaces the existing JSON line. Any existing annotations that are not in the new JSON line are removed from the dataset.  For more information, see Defining JSON lines for anomaly classification in the Amazon Lookout for Vision Developer Guide.   The images you reference in the source-ref field of a JSON line, must be in the same S3 bucket as the existing images in the dataset.   Updating a dataset might take a while to complete. To check the current status, call DescribeDataset and check the Status field in the response. This operation requires permissions to perform the lookoutvision:UpdateDatasetEntries operation.
   */
  updateDatasetEntries(params: LookoutVision.Types.UpdateDatasetEntriesRequest, callback?: (err: AWSError, data: LookoutVision.Types.UpdateDatasetEntriesResponse) => void): Request<LookoutVision.Types.UpdateDatasetEntriesResponse, AWSError>;
  /**
   * Adds or updates one or more JSON Line entries in a dataset. A JSON Line includes information about an image used for training or testing an Amazon Lookout for Vision model. To update an existing JSON Line, use the source-ref field to identify the JSON Line. The JSON line that you supply replaces the existing JSON line. Any existing annotations that are not in the new JSON line are removed from the dataset.  For more information, see Defining JSON lines for anomaly classification in the Amazon Lookout for Vision Developer Guide.   The images you reference in the source-ref field of a JSON line, must be in the same S3 bucket as the existing images in the dataset.   Updating a dataset might take a while to complete. To check the current status, call DescribeDataset and check the Status field in the response. This operation requires permissions to perform the lookoutvision:UpdateDatasetEntries operation.
   */
  updateDatasetEntries(callback?: (err: AWSError, data: LookoutVision.Types.UpdateDatasetEntriesResponse) => void): Request<LookoutVision.Types.UpdateDatasetEntriesResponse, AWSError>;
}
declare namespace LookoutVision {
  export interface Anomaly {
    /**
     * The name of an anomaly type found in an image. Name maps to an anomaly type in the training dataset, apart from the anomaly type background. The service automatically inserts the background anomaly type into the response from DetectAnomalies. 
     */
    Name?: AnomalyName;
    /**
     * Information about the pixel mask that covers an anomaly type.
     */
    PixelAnomaly?: PixelAnomaly;
  }
  export type AnomalyClassFilter = string;
  export type AnomalyList = Anomaly[];
  export type AnomalyMask = Buffer|Uint8Array|Blob|string;
  export type AnomalyName = string;
  export type Boolean = boolean;
  export type ClientToken = string;
  export type Color = string;
  export type CompilerOptions = string;
  export type ComponentDescription = string;
  export type ComponentName = string;
  export type ComponentVersion = string;
  export type ComponentVersionArn = string;
  export type ContentType = string;
  export interface CreateDatasetRequest {
    /**
     * The name of the project in which you want to create a dataset.
     */
    ProjectName: ProjectName;
    /**
     * The type of the dataset. Specify train for a training dataset. Specify test for a test dataset.
     */
    DatasetType: DatasetType;
    /**
     * The location of the manifest file that Amazon Lookout for Vision uses to create the dataset. If you don't specify DatasetSource, an empty dataset is created and the operation synchronously returns. Later, you can add JSON Lines by calling UpdateDatasetEntries.  If you specify a value for DataSource, the manifest at the S3 location is validated and used to create the dataset. The call to CreateDataset is asynchronous and might take a while to complete. To find out the current status, Check the value of Status returned in a call to DescribeDataset.
     */
    DatasetSource?: DatasetSource;
    /**
     * ClientToken is an idempotency token that ensures a call to CreateDataset completes only once. You choose the value to pass. For example, An issue might prevent you from getting a response from CreateDataset. In this case, safely retry your call to CreateDataset by using the same ClientToken parameter value. If you don't supply a value for ClientToken, the AWS SDK you are using inserts a value for you. This prevents retries after a network error from making multiple dataset creation requests. You'll need to provide your own value for other use cases.  An error occurs if the other input parameters are not the same as in the first request. Using a different value for ClientToken is considered a new call to CreateDataset. An idempotency token is active for 8 hours. 
     */
    ClientToken?: ClientToken;
  }
  export interface CreateDatasetResponse {
    /**
     * Information about the dataset.
     */
    DatasetMetadata?: DatasetMetadata;
  }
  export interface CreateModelRequest {
    /**
     * The name of the project in which you want to create a model version.
     */
    ProjectName: ProjectName;
    /**
     * A description for the version of the model.
     */
    Description?: ModelDescriptionMessage;
    /**
     * ClientToken is an idempotency token that ensures a call to CreateModel completes only once. You choose the value to pass. For example, An issue might prevent you from getting a response from CreateModel. In this case, safely retry your call to CreateModel by using the same ClientToken parameter value.  If you don't supply a value for ClientToken, the AWS SDK you are using inserts a value for you. This prevents retries after a network error from starting multiple training jobs. You'll need to provide your own value for other use cases.  An error occurs if the other input parameters are not the same as in the first request. Using a different value for ClientToken is considered a new call to CreateModel. An idempotency token is active for 8 hours.
     */
    ClientToken?: ClientToken;
    /**
     * The location where Amazon Lookout for Vision saves the training results.
     */
    OutputConfig: OutputConfig;
    /**
     * The identifier for your AWS KMS key. The key is used to encrypt training and test images copied into the service for model training. Your source images are unaffected. If this parameter is not specified, the copied images are encrypted by a key that AWS owns and manages.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * A set of tags (key-value pairs) that you want to attach to the model.
     */
    Tags?: TagList;
  }
  export interface CreateModelResponse {
    /**
     * The response from a call to CreateModel.
     */
    ModelMetadata?: ModelMetadata;
  }
  export interface CreateProjectRequest {
    /**
     * The name for the project.
     */
    ProjectName: ProjectName;
    /**
     * ClientToken is an idempotency token that ensures a call to CreateProject completes only once. You choose the value to pass. For example, An issue might prevent you from getting a response from CreateProject. In this case, safely retry your call to CreateProject by using the same ClientToken parameter value.  If you don't supply a value for ClientToken, the AWS SDK you are using inserts a value for you. This prevents retries after a network error from making multiple project creation requests. You'll need to provide your own value for other use cases.  An error occurs if the other input parameters are not the same as in the first request. Using a different value for ClientToken is considered a new call to CreateProject. An idempotency token is active for 8 hours.
     */
    ClientToken?: ClientToken;
  }
  export interface CreateProjectResponse {
    /**
     * Information about the project.
     */
    ProjectMetadata?: ProjectMetadata;
  }
  export type DatasetChanges = Buffer|Uint8Array|Blob|string;
  export interface DatasetDescription {
    /**
     * The name of the project that contains the dataset.
     */
    ProjectName?: ProjectName;
    /**
     * The type of the dataset. The value train represents a training dataset or single dataset project. The value test represents a test dataset.
     */
    DatasetType?: DatasetType;
    /**
     * The Unix timestamp for the time and date that the dataset was created.
     */
    CreationTimestamp?: DateTime;
    /**
     * The Unix timestamp for the date and time that the dataset was last updated.
     */
    LastUpdatedTimestamp?: DateTime;
    /**
     * The status of the dataset.
     */
    Status?: DatasetStatus;
    /**
     * The status message for the dataset. 
     */
    StatusMessage?: DatasetStatusMessage;
    /**
     * Statistics about the images in a dataset.
     */
    ImageStats?: DatasetImageStats;
  }
  export type DatasetEntry = string;
  export type DatasetEntryList = DatasetEntry[];
  export interface DatasetGroundTruthManifest {
    /**
     * The S3 bucket location for the manifest file.
     */
    S3Object?: InputS3Object;
  }
  export interface DatasetImageStats {
    /**
     * The total number of images in the dataset.
     */
    Total?: Integer;
    /**
     * The total number of labeled images.
     */
    Labeled?: Integer;
    /**
     * The total number of images labeled as normal.
     */
    Normal?: Integer;
    /**
     * the total number of images labeled as an anomaly.
     */
    Anomaly?: Integer;
  }
  export interface DatasetMetadata {
    /**
     * The type of the dataset.
     */
    DatasetType?: DatasetType;
    /**
     * The Unix timestamp for the date and time that the dataset was created. 
     */
    CreationTimestamp?: DateTime;
    /**
     * The status for the dataset.
     */
    Status?: DatasetStatus;
    /**
     * The status message for the dataset.
     */
    StatusMessage?: DatasetStatusMessage;
  }
  export type DatasetMetadataList = DatasetMetadata[];
  export interface DatasetSource {
    /**
     * Location information for the manifest file.
     */
    GroundTruthManifest?: DatasetGroundTruthManifest;
  }
  export type DatasetStatus = "CREATE_IN_PROGRESS"|"CREATE_COMPLETE"|"CREATE_FAILED"|"UPDATE_IN_PROGRESS"|"UPDATE_COMPLETE"|"UPDATE_FAILED_ROLLBACK_IN_PROGRESS"|"UPDATE_FAILED_ROLLBACK_COMPLETE"|"DELETE_IN_PROGRESS"|"DELETE_COMPLETE"|"DELETE_FAILED"|string;
  export type DatasetStatusMessage = string;
  export type DatasetType = string;
  export type DateTime = Date;
  export interface DeleteDatasetRequest {
    /**
     * The name of the project that contains the dataset that you want to delete.
     */
    ProjectName: ProjectName;
    /**
     * The type of the dataset to delete. Specify train to delete the training dataset. Specify test to delete the test dataset. To delete the dataset in a single dataset project, specify train.
     */
    DatasetType: DatasetType;
    /**
     * ClientToken is an idempotency token that ensures a call to DeleteDataset completes only once. You choose the value to pass. For example, An issue might prevent you from getting a response from DeleteDataset. In this case, safely retry your call to DeleteDataset by using the same ClientToken parameter value.  If you don't supply a value for ClientToken, the AWS SDK you are using inserts a value for you. This prevents retries after a network error from making multiple deletetion requests. You'll need to provide your own value for other use cases.  An error occurs if the other input parameters are not the same as in the first request. Using a different value for ClientToken is considered a new call to DeleteDataset. An idempotency token is active for 8 hours.
     */
    ClientToken?: ClientToken;
  }
  export interface DeleteDatasetResponse {
  }
  export interface DeleteModelRequest {
    /**
     * The name of the project that contains the model that you want to delete.
     */
    ProjectName: ProjectName;
    /**
     * The version of the model that you want to delete.
     */
    ModelVersion: ModelVersionNoLatest;
    /**
     * ClientToken is an idempotency token that ensures a call to DeleteModel completes only once. You choose the value to pass. For example, an issue might prevent you from getting a response from DeleteModel. In this case, safely retry your call to DeleteModel by using the same ClientToken parameter value. If you don't supply a value for ClientToken, the AWS SDK you are using inserts a value for you. This prevents retries after a network error from making multiple model deletion requests. You'll need to provide your own value for other use cases.  An error occurs if the other input parameters are not the same as in the first request. Using a different value for ClientToken is considered a new call to DeleteModel. An idempotency token is active for 8 hours.
     */
    ClientToken?: ClientToken;
  }
  export interface DeleteModelResponse {
    /**
     * The Amazon Resource Name (ARN) of the model that was deleted.
     */
    ModelArn?: ModelArn;
  }
  export interface DeleteProjectRequest {
    /**
     * The name of the project to delete.
     */
    ProjectName: ProjectName;
    /**
     * ClientToken is an idempotency token that ensures a call to DeleteProject completes only once. You choose the value to pass. For example, An issue might prevent you from getting a response from DeleteProject. In this case, safely retry your call to DeleteProject by using the same ClientToken parameter value.  If you don't supply a value for ClientToken, the AWS SDK you are using inserts a value for you. This prevents retries after a network error from making multiple project deletion requests. You'll need to provide your own value for other use cases.  An error occurs if the other input parameters are not the same as in the first request. Using a different value for ClientToken is considered a new call to DeleteProject. An idempotency token is active for 8 hours.
     */
    ClientToken?: ClientToken;
  }
  export interface DeleteProjectResponse {
    /**
     * The Amazon Resource Name (ARN) of the project that was deleted.
     */
    ProjectArn?: ProjectArn;
  }
  export interface DescribeDatasetRequest {
    /**
     * The name of the project that contains the dataset that you want to describe.
     */
    ProjectName: ProjectName;
    /**
     * The type of the dataset to describe. Specify train to describe the training dataset. Specify test to describe the test dataset. If you have a single dataset project, specify train 
     */
    DatasetType: DatasetType;
  }
  export interface DescribeDatasetResponse {
    /**
     * The description of the requested dataset. 
     */
    DatasetDescription?: DatasetDescription;
  }
  export interface DescribeModelPackagingJobRequest {
    /**
     * The name of the project that contains the model packaging job that you want to describe. 
     */
    ProjectName: ProjectName;
    /**
     * The job name for the model packaging job. 
     */
    JobName: ModelPackagingJobName;
  }
  export interface DescribeModelPackagingJobResponse {
    /**
     * The description of the model packaging job. 
     */
    ModelPackagingDescription?: ModelPackagingDescription;
  }
  export interface DescribeModelRequest {
    /**
     * The project that contains the version of a model that you want to describe.
     */
    ProjectName: ProjectName;
    /**
     * The version of the model that you want to describe.
     */
    ModelVersion: ModelVersion;
  }
  export interface DescribeModelResponse {
    /**
     * Contains the description of the model.
     */
    ModelDescription?: ModelDescription;
  }
  export interface DescribeProjectRequest {
    /**
     * The name of the project that you want to describe.
     */
    ProjectName: ProjectName;
  }
  export interface DescribeProjectResponse {
    /**
     * The description of the project.
     */
    ProjectDescription?: ProjectDescription;
  }
  export interface DetectAnomaliesRequest {
    /**
     * The name of the project that contains the model version that you want to use.
     */
    ProjectName: ProjectName;
    /**
     * The version of the model that you want to use.
     */
    ModelVersion: ModelVersion;
    /**
     * The unencrypted image bytes that you want to analyze. 
     */
    Body: Stream;
    /**
     * The type of the image passed in Body. Valid values are image/png (PNG format images) and image/jpeg (JPG format images). 
     */
    ContentType: ContentType;
  }
  export interface DetectAnomaliesResponse {
    /**
     * The results of the DetectAnomalies operation.
     */
    DetectAnomalyResult?: DetectAnomalyResult;
  }
  export interface DetectAnomalyResult {
    /**
     * The source of the image that was analyzed. direct means that the images was supplied from the local computer. No other values are supported.
     */
    Source?: ImageSource;
    /**
     * True if Amazon Lookout for Vision classifies the image as containing an anomaly, otherwise false.
     */
    IsAnomalous?: Boolean;
    /**
     * The confidence that Lookout for Vision has in the accuracy of the classification in IsAnomalous.
     */
    Confidence?: Float;
    /**
     * If the model is an image segmentation model, Anomalies contains a list of anomaly types found in the image. There is one entry for each type of anomaly found (even if multiple instances of an anomaly type exist on the image). The first element in the list is always an anomaly type representing the image background ('background') and shouldn't be considered an anomaly. Amazon Lookout for Vision automatically add the background anomaly type to the response, and you don't need to declare a background anomaly type in your dataset. If the list has one entry ('background'), no anomalies were found on the image.  An image classification model doesn't return an Anomalies list. 
     */
    Anomalies?: AnomalyList;
    /**
     * If the model is an image segmentation model, AnomalyMask contains pixel masks that covers all anomaly types found on the image. Each anomaly type has a different mask color. To map a color to an anomaly type, see the color field of the PixelAnomaly object. An image classification model doesn't return an Anomalies list. 
     */
    AnomalyMask?: AnomalyMask;
  }
  export type Float = number;
  export interface GreengrassConfiguration {
    /**
     * Additional compiler options for the Greengrass component. Currently, only NVIDIA Graphics Processing Units (GPU) and CPU accelerators are supported. If you specify TargetDevice, don't specify CompilerOptions. For more information, see Compiler options in the Amazon Lookout for Vision Developer Guide. 
     */
    CompilerOptions?: CompilerOptions;
    /**
     * The target device for the model. Currently the only supported value is jetson_xavier. If you specify TargetDevice, you can't specify TargetPlatform. 
     */
    TargetDevice?: TargetDevice;
    /**
     * The target platform for the model. If you specify TargetPlatform, you can't specify TargetDevice. 
     */
    TargetPlatform?: TargetPlatform;
    /**
     *  An S3 location in which Lookout for Vision stores the component artifacts. 
     */
    S3OutputLocation: S3Location;
    /**
     *  A name for the AWS IoT Greengrass component. 
     */
    ComponentName: ComponentName;
    /**
     * A Version for the AWS IoT Greengrass component. If you don't provide a value, a default value of  Model Version.0.0 is used. 
     */
    ComponentVersion?: ComponentVersion;
    /**
     *  A description for the AWS IoT Greengrass component. 
     */
    ComponentDescription?: ComponentDescription;
    /**
     *  A set of tags (key-value pairs) that you want to attach to the AWS IoT Greengrass component. 
     */
    Tags?: TagList;
  }
  export interface GreengrassOutputDetails {
    /**
     *  The Amazon Resource Name (ARN) of the component. 
     */
    ComponentVersionArn?: ComponentVersionArn;
    /**
     *  The name of the component. 
     */
    ComponentName?: ComponentName;
    /**
     *  The version of the component. 
     */
    ComponentVersion?: ComponentVersion;
  }
  export interface ImageSource {
    /**
     * The type of the image.
     */
    Type?: ImageSourceType;
  }
  export type ImageSourceType = string;
  export type InferenceUnits = number;
  export interface InputS3Object {
    /**
     * The Amazon S3 bucket that contains the manifest.
     */
    Bucket: S3BucketName;
    /**
     * The name and location of the manifest file withiin the bucket.
     */
    Key: S3ObjectKey;
    /**
     * The version ID of the bucket.
     */
    VersionId?: S3ObjectVersion;
  }
  export type Integer = number;
  export type IsLabeled = boolean;
  export type KmsKeyId = string;
  export interface ListDatasetEntriesRequest {
    /**
     * The name of the project that contains the dataset that you want to list.
     */
    ProjectName: ProjectName;
    /**
     * The type of the dataset that you want to list. Specify train to list the training dataset. Specify test to list the test dataset. If you have a single dataset project, specify train.
     */
    DatasetType: DatasetType;
    /**
     * Specify true to include labeled entries, otherwise specify false. If you don't specify a value, Lookout for Vision returns all entries.
     */
    Labeled?: IsLabeled;
    /**
     * Specify normal to include only normal images. Specify anomaly to only include anomalous entries. If you don't specify a value, Amazon Lookout for Vision returns normal and anomalous images.
     */
    AnomalyClass?: AnomalyClassFilter;
    /**
     * Only includes entries before the specified date in the response. For example, 2020-06-23T00:00:00.
     */
    BeforeCreationDate?: DateTime;
    /**
     * Only includes entries after the specified date in the response. For example, 2020-06-23T00:00:00.
     */
    AfterCreationDate?: DateTime;
    /**
     * If the previous response was incomplete (because there is more data to retrieve), Amazon Lookout for Vision returns a pagination token in the response. You can use this pagination token to retrieve the next set of dataset entries.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return per paginated call. The largest value you can specify is 100. If you specify a value greater than 100, a ValidationException error occurs. The default value is 100.
     */
    MaxResults?: PageSize;
    /**
     * Perform a "contains" search on the values of the source-ref key within the dataset. For example a value of "IMG_17" returns all JSON Lines where the source-ref key value matches *IMG_17*.
     */
    SourceRefContains?: QueryString;
  }
  export interface ListDatasetEntriesResponse {
    /**
     * A list of the entries (JSON Lines) within the dataset.
     */
    DatasetEntries?: DatasetEntryList;
    /**
     * If the response is truncated, Amazon Lookout for Vision returns this token that you can use in the subsequent request to retrieve the next set ofdataset entries.
     */
    NextToken?: PaginationToken;
  }
  export interface ListModelPackagingJobsRequest {
    /**
     *  The name of the project for which you want to list the model packaging jobs. 
     */
    ProjectName: ProjectName;
    /**
     * If the previous response was incomplete (because there is more results to retrieve), Amazon Lookout for Vision returns a pagination token in the response. You can use this pagination token to retrieve the next set of results. 
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return per paginated call. The largest value you can specify is 100. If you specify a value greater than 100, a ValidationException error occurs. The default value is 100. 
     */
    MaxResults?: PageSize;
  }
  export interface ListModelPackagingJobsResponse {
    /**
     *  A list of the model packaging jobs created for the specified Amazon Lookout for Vision project. 
     */
    ModelPackagingJobs?: ModelPackagingJobsList;
    /**
     * If the previous response was incomplete (because there is more results to retrieve), Amazon Lookout for Vision returns a pagination token in the response. You can use this pagination token to retrieve the next set of results. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListModelsRequest {
    /**
     * The name of the project that contains the model versions that you want to list.
     */
    ProjectName: ProjectName;
    /**
     * If the previous response was incomplete (because there is more data to retrieve), Amazon Lookout for Vision returns a pagination token in the response. You can use this pagination token to retrieve the next set of models.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return per paginated call. The largest value you can specify is 100. If you specify a value greater than 100, a ValidationException error occurs. The default value is 100.
     */
    MaxResults?: PageSize;
  }
  export interface ListModelsResponse {
    /**
     * A list of model versions in the specified project. 
     */
    Models?: ModelMetadataList;
    /**
     * If the response is truncated, Amazon Lookout for Vision returns this token that you can use in the subsequent request to retrieve the next set of models. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListProjectsRequest {
    /**
     * If the previous response was incomplete (because there is more data to retrieve), Amazon Lookout for Vision returns a pagination token in the response. You can use this pagination token to retrieve the next set of projects.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return per paginated call. The largest value you can specify is 100. If you specify a value greater than 100, a ValidationException error occurs. The default value is 100.
     */
    MaxResults?: PageSize;
  }
  export interface ListProjectsResponse {
    /**
     * A list of projects in your AWS account.
     */
    Projects?: ProjectMetadataList;
    /**
     * If the response is truncated, Amazon Lookout for Vision returns this token that you can use in the subsequent request to retrieve the next set of projects.
     */
    NextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the model for which you want to list tags. 
     */
    ResourceArn: TagArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A map of tag keys and values attached to the specified model.
     */
    Tags?: TagList;
  }
  export type ModelArn = string;
  export interface ModelDescription {
    /**
     * The version of the model
     */
    ModelVersion?: ModelVersion;
    /**
     * The Amazon Resource Name (ARN) of the model.
     */
    ModelArn?: ModelArn;
    /**
     * The unix timestamp for the date and time that the model was created. 
     */
    CreationTimestamp?: DateTime;
    /**
     * The description for the model.
     */
    Description?: ModelDescriptionMessage;
    /**
     * The status of the model.
     */
    Status?: ModelStatus;
    /**
     * The status message for the model.
     */
    StatusMessage?: ModelStatusMessage;
    /**
     * Performance metrics for the model. Created during training.
     */
    Performance?: ModelPerformance;
    /**
     * The S3 location where Amazon Lookout for Vision saves model training files.
     */
    OutputConfig?: OutputConfig;
    /**
     * The S3 location where Amazon Lookout for Vision saves the manifest file that was used to test the trained model and generate the performance scores.
     */
    EvaluationManifest?: OutputS3Object;
    /**
     * The S3 location where Amazon Lookout for Vision saves the performance metrics.
     */
    EvaluationResult?: OutputS3Object;
    /**
     * The unix timestamp for the date and time that the evaluation ended. 
     */
    EvaluationEndTimestamp?: DateTime;
    /**
     * The identifer for the AWS Key Management Service (AWS KMS) key that was used to encrypt the model during training.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The minimum number of inference units used by the model. For more information, see StartModel 
     */
    MinInferenceUnits?: InferenceUnits;
    /**
     * The maximum number of inference units Amazon Lookout for Vision uses to auto-scale the model. For more information, see StartModel.
     */
    MaxInferenceUnits?: InferenceUnits;
  }
  export type ModelDescriptionMessage = string;
  export type ModelHostingStatus = "STARTING_HOSTING"|"HOSTED"|"HOSTING_FAILED"|"STOPPING_HOSTING"|"SYSTEM_UPDATING"|string;
  export interface ModelMetadata {
    /**
     * The unix timestamp for the date and time that the model was created. 
     */
    CreationTimestamp?: DateTime;
    /**
     * The version of the model.
     */
    ModelVersion?: ModelVersion;
    /**
     * The Amazon Resource Name (ARN) of the model.
     */
    ModelArn?: ModelArn;
    /**
     * The description for the model.
     */
    Description?: ModelDescriptionMessage;
    /**
     * The status of the model.
     */
    Status?: ModelStatus;
    /**
     * The status message for the model.
     */
    StatusMessage?: ModelStatusMessage;
    /**
     * Performance metrics for the model. Not available until training has successfully completed.
     */
    Performance?: ModelPerformance;
  }
  export type ModelMetadataList = ModelMetadata[];
  export interface ModelPackagingConfiguration {
    /**
     *  Configuration information for the AWS IoT Greengrass component in a model packaging job. 
     */
    Greengrass: GreengrassConfiguration;
  }
  export interface ModelPackagingDescription {
    /**
     *  The name of the model packaging job. 
     */
    JobName?: ModelPackagingJobName;
    /**
     * The name of the project that's associated with a model that's in the model package. 
     */
    ProjectName?: ProjectName;
    /**
     * The version of the model used in the model packaging job. 
     */
    ModelVersion?: ModelVersion;
    /**
     *  The configuration information used in the model packaging job. 
     */
    ModelPackagingConfiguration?: ModelPackagingConfiguration;
    /**
     * The description for the model packaging job. 
     */
    ModelPackagingJobDescription?: ModelPackagingJobDescription;
    /**
     * The AWS service used to package the job. Currently Lookout for Vision can package jobs with AWS IoT Greengrass. 
     */
    ModelPackagingMethod?: ModelPackagingMethod;
    /**
     * Information about the output of the model packaging job. For more information, see DescribeModelPackagingJob. 
     */
    ModelPackagingOutputDetails?: ModelPackagingOutputDetails;
    /**
     *  The status of the model packaging job. 
     */
    Status?: ModelPackagingJobStatus;
    /**
     *  The status message for the model packaging job. 
     */
    StatusMessage?: ModelPackagingStatusMessage;
    /**
     *  The Unix timestamp for the time and date that the model packaging job was created. 
     */
    CreationTimestamp?: DateTime;
    /**
     *  The Unix timestamp for the time and date that the model packaging job was last updated. 
     */
    LastUpdatedTimestamp?: DateTime;
  }
  export type ModelPackagingJobDescription = string;
  export interface ModelPackagingJobMetadata {
    /**
     *  The name of the model packaging job. 
     */
    JobName?: ModelPackagingJobName;
    /**
     *  The project that contains the model that is in the model package. 
     */
    ProjectName?: ProjectName;
    /**
     *  The version of the model that is in the model package. 
     */
    ModelVersion?: ModelVersion;
    /**
     *  The description for the model packaging job. 
     */
    ModelPackagingJobDescription?: ModelPackagingJobDescription;
    /**
     *  The AWS service used to package the job. Currently Lookout for Vision can package jobs with AWS IoT Greengrass. 
     */
    ModelPackagingMethod?: ModelPackagingMethod;
    /**
     * The status of the model packaging job. 
     */
    Status?: ModelPackagingJobStatus;
    /**
     * The status message for the model packaging job. 
     */
    StatusMessage?: ModelPackagingStatusMessage;
    /**
     * The Unix timestamp for the time and date that the model packaging job was created.
     */
    CreationTimestamp?: DateTime;
    /**
     * The Unix timestamp for the time and date that the model packaging job was last updated.
     */
    LastUpdatedTimestamp?: DateTime;
  }
  export type ModelPackagingJobName = string;
  export type ModelPackagingJobStatus = "CREATED"|"RUNNING"|"SUCCEEDED"|"FAILED"|string;
  export type ModelPackagingJobsList = ModelPackagingJobMetadata[];
  export type ModelPackagingMethod = string;
  export interface ModelPackagingOutputDetails {
    /**
     *  Information about the AWS IoT Greengrass component in a model packaging job. 
     */
    Greengrass?: GreengrassOutputDetails;
  }
  export type ModelPackagingStatusMessage = string;
  export interface ModelPerformance {
    /**
     * The overall F1 score metric for the trained model.
     */
    F1Score?: Float;
    /**
     * The overall recall metric value for the trained model. 
     */
    Recall?: Float;
    /**
     * The overall precision metric value for the trained model.
     */
    Precision?: Float;
  }
  export type ModelStatus = "TRAINING"|"TRAINED"|"TRAINING_FAILED"|"STARTING_HOSTING"|"HOSTED"|"HOSTING_FAILED"|"STOPPING_HOSTING"|"SYSTEM_UPDATING"|"DELETING"|string;
  export type ModelStatusMessage = string;
  export type ModelVersion = string;
  export type ModelVersionNoLatest = string;
  export interface OutputConfig {
    /**
     * The S3 location for the output.
     */
    S3Location: S3Location;
  }
  export interface OutputS3Object {
    /**
     * The bucket that contains the training output.
     */
    Bucket: S3BucketName;
    /**
     * The location of the training output in the bucket.
     */
    Key: S3ObjectKey;
  }
  export type PageSize = number;
  export type PaginationToken = string;
  export interface PixelAnomaly {
    /**
     * The percentage area of the image that the anomaly type covers.
     */
    TotalPercentageArea?: Float;
    /**
     * A hex color value for the mask that covers an anomaly type. Each anomaly type has a different mask color. The color maps to the color of the anomaly type used in the training dataset. 
     */
    Color?: Color;
  }
  export type ProjectArn = string;
  export interface ProjectDescription {
    /**
     * The Amazon Resource Name (ARN) of the project.
     */
    ProjectArn?: ProjectArn;
    /**
     * The name of the project.
     */
    ProjectName?: ProjectName;
    /**
     * The unix timestamp for the date and time that the project was created. 
     */
    CreationTimestamp?: DateTime;
    /**
     * A list of datasets in the project.
     */
    Datasets?: DatasetMetadataList;
  }
  export interface ProjectMetadata {
    /**
     * The Amazon Resource Name (ARN) of the project.
     */
    ProjectArn?: ProjectArn;
    /**
     * The name of the project.
     */
    ProjectName?: ProjectName;
    /**
     * The unix timestamp for the date and time that the project was created. 
     */
    CreationTimestamp?: DateTime;
  }
  export type ProjectMetadataList = ProjectMetadata[];
  export type ProjectName = string;
  export type QueryString = string;
  export type S3BucketName = string;
  export type S3KeyPrefix = string;
  export interface S3Location {
    /**
     * The S3 bucket that contains the training or model packaging job output. If you are training a model, the bucket must in your AWS account. If you use an S3 bucket for a model packaging job, the S3 bucket must be in the same AWS Region and AWS account in which you use AWS IoT Greengrass.
     */
    Bucket: S3BucketName;
    /**
     * The path of the folder, within the S3 bucket, that contains the output.
     */
    Prefix?: S3KeyPrefix;
  }
  export type S3ObjectKey = string;
  export type S3ObjectVersion = string;
  export interface StartModelPackagingJobRequest {
    /**
     *  The name of the project which contains the version of the model that you want to package. 
     */
    ProjectName: ProjectName;
    /**
     *  The version of the model within the project that you want to package. 
     */
    ModelVersion: ModelVersion;
    /**
     * A name for the model packaging job. If you don't supply a value, the service creates a job name for you. 
     */
    JobName?: ModelPackagingJobName;
    /**
     * The configuration for the model packaging job. 
     */
    Configuration: ModelPackagingConfiguration;
    /**
     * A description for the model packaging job. 
     */
    Description?: ModelPackagingJobDescription;
    /**
     * ClientToken is an idempotency token that ensures a call to StartModelPackagingJob completes only once. You choose the value to pass. For example, An issue might prevent you from getting a response from StartModelPackagingJob. In this case, safely retry your call to StartModelPackagingJob by using the same ClientToken parameter value. If you don't supply a value for ClientToken, the AWS SDK you are using inserts a value for you. This prevents retries after a network error from making multiple dataset creation requests. You'll need to provide your own value for other use cases.  An error occurs if the other input parameters are not the same as in the first request. Using a different value for ClientToken is considered a new call to StartModelPackagingJob. An idempotency token is active for 8 hours. 
     */
    ClientToken?: ClientToken;
  }
  export interface StartModelPackagingJobResponse {
    /**
     * The job name for the model packaging job. If you don't supply a job name in the JobName input parameter, the service creates a job name for you. 
     */
    JobName?: ModelPackagingJobName;
  }
  export interface StartModelRequest {
    /**
     * The name of the project that contains the model that you want to start.
     */
    ProjectName: ProjectName;
    /**
     * The version of the model that you want to start.
     */
    ModelVersion: ModelVersion;
    /**
     * The minimum number of inference units to use. A single inference unit represents 1 hour of processing. Use a higher number to increase the TPS throughput of your model. You are charged for the number of inference units that you use. 
     */
    MinInferenceUnits: InferenceUnits;
    /**
     * ClientToken is an idempotency token that ensures a call to StartModel completes only once. You choose the value to pass. For example, An issue might prevent you from getting a response from StartModel. In this case, safely retry your call to StartModel by using the same ClientToken parameter value.  If you don't supply a value for ClientToken, the AWS SDK you are using inserts a value for you. This prevents retries after a network error from making multiple start requests. You'll need to provide your own value for other use cases.  An error occurs if the other input parameters are not the same as in the first request. Using a different value for ClientToken is considered a new call to StartModel. An idempotency token is active for 8 hours. 
     */
    ClientToken?: ClientToken;
    /**
     * The maximum number of inference units to use for auto-scaling the model. If you don't specify a value, Amazon Lookout for Vision doesn't auto-scale the model.
     */
    MaxInferenceUnits?: InferenceUnits;
  }
  export interface StartModelResponse {
    /**
     * The current running status of the model.
     */
    Status?: ModelHostingStatus;
  }
  export interface StopModelRequest {
    /**
     * The name of the project that contains the model that you want to stop.
     */
    ProjectName: ProjectName;
    /**
     * The version of the model that you want to stop.
     */
    ModelVersion: ModelVersion;
    /**
     * ClientToken is an idempotency token that ensures a call to StopModel completes only once. You choose the value to pass. For example, An issue might prevent you from getting a response from StopModel. In this case, safely retry your call to StopModel by using the same ClientToken parameter value. If you don't supply a value for ClientToken, the AWS SDK you are using inserts a value for you. This prevents retries after a network error from making multiple stop requests. You'll need to provide your own value for other use cases.  An error occurs if the other input parameters are not the same as in the first request. Using a different value for ClientToken is considered a new call to StopModel. An idempotency token is active for 8 hours. 
     */
    ClientToken?: ClientToken;
  }
  export interface StopModelResponse {
    /**
     * The status of the model.
     */
    Status?: ModelHostingStatus;
  }
  export type Stream = Buffer|Uint8Array|Blob|string|Readable;
  export interface Tag {
    /**
     * The key of the tag that is attached to the specified model.
     */
    Key: TagKey;
    /**
     * The value of the tag that is attached to the specified model.
     */
    Value: TagValue;
  }
  export type TagArn = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the model to assign the tags.
     */
    ResourceArn: TagArn;
    /**
     * The key-value tags to assign to the model.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TargetDevice = "jetson_xavier"|string;
  export interface TargetPlatform {
    /**
     * The target operating system for the model. Linux is the only operating system that is currently supported. 
     */
    Os: TargetPlatformOs;
    /**
     * The target architecture for the model. The currently supported architectures are X86_64 (64-bit version of the x86 instruction set) and ARM_64 (ARMv8 64-bit CPU). 
     */
    Arch: TargetPlatformArch;
    /**
     * The target accelerator for the model. Currently, Amazon Lookout for Vision only supports NVIDIA (Nvidia graphics processing unit) and CPU accelerators. If you specify NVIDIA as an accelerator, you must also specify the gpu-code, trt-ver, and cuda-ver compiler options. If you don't specify an accelerator, Lookout for Vision uses the CPU for compilation and we highly recommend that you use the GreengrassConfiguration$CompilerOptions field. For example, you can use the following compiler options for CPU:     mcpu: CPU micro-architecture. For example, {'mcpu': 'skylake-avx512'}     mattr: CPU flags. For example, {'mattr': ['+neon', '+vfpv4']}   
     */
    Accelerator?: TargetPlatformAccelerator;
  }
  export type TargetPlatformAccelerator = "NVIDIA"|string;
  export type TargetPlatformArch = "ARM64"|"X86_64"|string;
  export type TargetPlatformOs = "LINUX"|string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the model from which you want to remove tags. 
     */
    ResourceArn: TagArn;
    /**
     * A list of the keys of the tags that you want to remove.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDatasetEntriesRequest {
    /**
     * The name of the project that contains the dataset that you want to update.
     */
    ProjectName: ProjectName;
    /**
     * The type of the dataset that you want to update. Specify train to update the training dataset. Specify test to update the test dataset. If you have a single dataset project, specify train.
     */
    DatasetType: DatasetType;
    /**
     * The entries to add to the dataset.
     */
    Changes: DatasetChanges;
    /**
     * ClientToken is an idempotency token that ensures a call to UpdateDatasetEntries completes only once. You choose the value to pass. For example, An issue might prevent you from getting a response from UpdateDatasetEntries. In this case, safely retry your call to UpdateDatasetEntries by using the same ClientToken parameter value. If you don't supply a value for ClientToken, the AWS SDK you are using inserts a value for you. This prevents retries after a network error from making multiple updates with the same dataset entries. You'll need to provide your own value for other use cases.  An error occurs if the other input parameters are not the same as in the first request. Using a different value for ClientToken is considered a new call to UpdateDatasetEntries. An idempotency token is active for 8 hours. 
     */
    ClientToken?: ClientToken;
  }
  export interface UpdateDatasetEntriesResponse {
    /**
     * The status of the dataset update.
     */
    Status?: DatasetStatus;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-11-20"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the LookoutVision client.
   */
  export import Types = LookoutVision;
}
export = LookoutVision;
