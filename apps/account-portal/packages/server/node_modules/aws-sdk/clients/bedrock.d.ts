import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Bedrock extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Bedrock.Types.ClientConfiguration)
  config: Config & Bedrock.Types.ClientConfiguration;
  /**
   * Creates a fine-tuning job to customize a base model. You specify the base foundation model and the location of the training data. After the model-customization job completes successfully, your custom model resource will be ready to use. Training data contains input and output text for each record in a JSONL format. Optionally, you can specify validation data in the same format as the training data. Bedrock returns validation loss metrics and output generations after the job completes.   Model-customization jobs are asynchronous and the completion time depends on the base model and the training/validation data size. To monitor a job, use the GetModelCustomizationJob operation to retrieve the job status. For more information, see Custom models in the Bedrock User Guide.
   */
  createModelCustomizationJob(params: Bedrock.Types.CreateModelCustomizationJobRequest, callback?: (err: AWSError, data: Bedrock.Types.CreateModelCustomizationJobResponse) => void): Request<Bedrock.Types.CreateModelCustomizationJobResponse, AWSError>;
  /**
   * Creates a fine-tuning job to customize a base model. You specify the base foundation model and the location of the training data. After the model-customization job completes successfully, your custom model resource will be ready to use. Training data contains input and output text for each record in a JSONL format. Optionally, you can specify validation data in the same format as the training data. Bedrock returns validation loss metrics and output generations after the job completes.   Model-customization jobs are asynchronous and the completion time depends on the base model and the training/validation data size. To monitor a job, use the GetModelCustomizationJob operation to retrieve the job status. For more information, see Custom models in the Bedrock User Guide.
   */
  createModelCustomizationJob(callback?: (err: AWSError, data: Bedrock.Types.CreateModelCustomizationJobResponse) => void): Request<Bedrock.Types.CreateModelCustomizationJobResponse, AWSError>;
  /**
   * Creates a provisioned throughput with dedicated capacity for a foundation model or a fine-tuned model. For more information, see Provisioned throughput in the Bedrock User Guide.
   */
  createProvisionedModelThroughput(params: Bedrock.Types.CreateProvisionedModelThroughputRequest, callback?: (err: AWSError, data: Bedrock.Types.CreateProvisionedModelThroughputResponse) => void): Request<Bedrock.Types.CreateProvisionedModelThroughputResponse, AWSError>;
  /**
   * Creates a provisioned throughput with dedicated capacity for a foundation model or a fine-tuned model. For more information, see Provisioned throughput in the Bedrock User Guide.
   */
  createProvisionedModelThroughput(callback?: (err: AWSError, data: Bedrock.Types.CreateProvisionedModelThroughputResponse) => void): Request<Bedrock.Types.CreateProvisionedModelThroughputResponse, AWSError>;
  /**
   * Deletes a custom model that you created earlier. For more information, see Custom models in the Bedrock User Guide.
   */
  deleteCustomModel(params: Bedrock.Types.DeleteCustomModelRequest, callback?: (err: AWSError, data: Bedrock.Types.DeleteCustomModelResponse) => void): Request<Bedrock.Types.DeleteCustomModelResponse, AWSError>;
  /**
   * Deletes a custom model that you created earlier. For more information, see Custom models in the Bedrock User Guide.
   */
  deleteCustomModel(callback?: (err: AWSError, data: Bedrock.Types.DeleteCustomModelResponse) => void): Request<Bedrock.Types.DeleteCustomModelResponse, AWSError>;
  /**
   * Delete the invocation logging. 
   */
  deleteModelInvocationLoggingConfiguration(params: Bedrock.Types.DeleteModelInvocationLoggingConfigurationRequest, callback?: (err: AWSError, data: Bedrock.Types.DeleteModelInvocationLoggingConfigurationResponse) => void): Request<Bedrock.Types.DeleteModelInvocationLoggingConfigurationResponse, AWSError>;
  /**
   * Delete the invocation logging. 
   */
  deleteModelInvocationLoggingConfiguration(callback?: (err: AWSError, data: Bedrock.Types.DeleteModelInvocationLoggingConfigurationResponse) => void): Request<Bedrock.Types.DeleteModelInvocationLoggingConfigurationResponse, AWSError>;
  /**
   * Deletes a provisioned throughput. For more information, see Provisioned throughput in the Bedrock User Guide.
   */
  deleteProvisionedModelThroughput(params: Bedrock.Types.DeleteProvisionedModelThroughputRequest, callback?: (err: AWSError, data: Bedrock.Types.DeleteProvisionedModelThroughputResponse) => void): Request<Bedrock.Types.DeleteProvisionedModelThroughputResponse, AWSError>;
  /**
   * Deletes a provisioned throughput. For more information, see Provisioned throughput in the Bedrock User Guide.
   */
  deleteProvisionedModelThroughput(callback?: (err: AWSError, data: Bedrock.Types.DeleteProvisionedModelThroughputResponse) => void): Request<Bedrock.Types.DeleteProvisionedModelThroughputResponse, AWSError>;
  /**
   * Get the properties associated with a Bedrock custom model that you have created.For more information, see Custom models in the Bedrock User Guide.
   */
  getCustomModel(params: Bedrock.Types.GetCustomModelRequest, callback?: (err: AWSError, data: Bedrock.Types.GetCustomModelResponse) => void): Request<Bedrock.Types.GetCustomModelResponse, AWSError>;
  /**
   * Get the properties associated with a Bedrock custom model that you have created.For more information, see Custom models in the Bedrock User Guide.
   */
  getCustomModel(callback?: (err: AWSError, data: Bedrock.Types.GetCustomModelResponse) => void): Request<Bedrock.Types.GetCustomModelResponse, AWSError>;
  /**
   * Get details about a Bedrock foundation model.
   */
  getFoundationModel(params: Bedrock.Types.GetFoundationModelRequest, callback?: (err: AWSError, data: Bedrock.Types.GetFoundationModelResponse) => void): Request<Bedrock.Types.GetFoundationModelResponse, AWSError>;
  /**
   * Get details about a Bedrock foundation model.
   */
  getFoundationModel(callback?: (err: AWSError, data: Bedrock.Types.GetFoundationModelResponse) => void): Request<Bedrock.Types.GetFoundationModelResponse, AWSError>;
  /**
   * Retrieves the properties associated with a model-customization job, including the status of the job. For more information, see Custom models in the Bedrock User Guide.
   */
  getModelCustomizationJob(params: Bedrock.Types.GetModelCustomizationJobRequest, callback?: (err: AWSError, data: Bedrock.Types.GetModelCustomizationJobResponse) => void): Request<Bedrock.Types.GetModelCustomizationJobResponse, AWSError>;
  /**
   * Retrieves the properties associated with a model-customization job, including the status of the job. For more information, see Custom models in the Bedrock User Guide.
   */
  getModelCustomizationJob(callback?: (err: AWSError, data: Bedrock.Types.GetModelCustomizationJobResponse) => void): Request<Bedrock.Types.GetModelCustomizationJobResponse, AWSError>;
  /**
   * Get the current configuration values for model invocation logging.
   */
  getModelInvocationLoggingConfiguration(params: Bedrock.Types.GetModelInvocationLoggingConfigurationRequest, callback?: (err: AWSError, data: Bedrock.Types.GetModelInvocationLoggingConfigurationResponse) => void): Request<Bedrock.Types.GetModelInvocationLoggingConfigurationResponse, AWSError>;
  /**
   * Get the current configuration values for model invocation logging.
   */
  getModelInvocationLoggingConfiguration(callback?: (err: AWSError, data: Bedrock.Types.GetModelInvocationLoggingConfigurationResponse) => void): Request<Bedrock.Types.GetModelInvocationLoggingConfigurationResponse, AWSError>;
  /**
   * Get details for a provisioned throughput. For more information, see Provisioned throughput in the Bedrock User Guide.
   */
  getProvisionedModelThroughput(params: Bedrock.Types.GetProvisionedModelThroughputRequest, callback?: (err: AWSError, data: Bedrock.Types.GetProvisionedModelThroughputResponse) => void): Request<Bedrock.Types.GetProvisionedModelThroughputResponse, AWSError>;
  /**
   * Get details for a provisioned throughput. For more information, see Provisioned throughput in the Bedrock User Guide.
   */
  getProvisionedModelThroughput(callback?: (err: AWSError, data: Bedrock.Types.GetProvisionedModelThroughputResponse) => void): Request<Bedrock.Types.GetProvisionedModelThroughputResponse, AWSError>;
  /**
   * Returns a list of the custom models that you have created with the CreateModelCustomizationJob operation. For more information, see Custom models in the Bedrock User Guide.
   */
  listCustomModels(params: Bedrock.Types.ListCustomModelsRequest, callback?: (err: AWSError, data: Bedrock.Types.ListCustomModelsResponse) => void): Request<Bedrock.Types.ListCustomModelsResponse, AWSError>;
  /**
   * Returns a list of the custom models that you have created with the CreateModelCustomizationJob operation. For more information, see Custom models in the Bedrock User Guide.
   */
  listCustomModels(callback?: (err: AWSError, data: Bedrock.Types.ListCustomModelsResponse) => void): Request<Bedrock.Types.ListCustomModelsResponse, AWSError>;
  /**
   * List of Bedrock foundation models that you can use. For more information, see Foundation models in the Bedrock User Guide.
   */
  listFoundationModels(params: Bedrock.Types.ListFoundationModelsRequest, callback?: (err: AWSError, data: Bedrock.Types.ListFoundationModelsResponse) => void): Request<Bedrock.Types.ListFoundationModelsResponse, AWSError>;
  /**
   * List of Bedrock foundation models that you can use. For more information, see Foundation models in the Bedrock User Guide.
   */
  listFoundationModels(callback?: (err: AWSError, data: Bedrock.Types.ListFoundationModelsResponse) => void): Request<Bedrock.Types.ListFoundationModelsResponse, AWSError>;
  /**
   * Returns a list of model customization jobs that you have submitted. You can filter the jobs to return based on one or more criteria. For more information, see Custom models in the Bedrock User Guide.
   */
  listModelCustomizationJobs(params: Bedrock.Types.ListModelCustomizationJobsRequest, callback?: (err: AWSError, data: Bedrock.Types.ListModelCustomizationJobsResponse) => void): Request<Bedrock.Types.ListModelCustomizationJobsResponse, AWSError>;
  /**
   * Returns a list of model customization jobs that you have submitted. You can filter the jobs to return based on one or more criteria. For more information, see Custom models in the Bedrock User Guide.
   */
  listModelCustomizationJobs(callback?: (err: AWSError, data: Bedrock.Types.ListModelCustomizationJobsResponse) => void): Request<Bedrock.Types.ListModelCustomizationJobsResponse, AWSError>;
  /**
   * List the provisioned capacities. For more information, see Provisioned throughput in the Bedrock User Guide.
   */
  listProvisionedModelThroughputs(params: Bedrock.Types.ListProvisionedModelThroughputsRequest, callback?: (err: AWSError, data: Bedrock.Types.ListProvisionedModelThroughputsResponse) => void): Request<Bedrock.Types.ListProvisionedModelThroughputsResponse, AWSError>;
  /**
   * List the provisioned capacities. For more information, see Provisioned throughput in the Bedrock User Guide.
   */
  listProvisionedModelThroughputs(callback?: (err: AWSError, data: Bedrock.Types.ListProvisionedModelThroughputsResponse) => void): Request<Bedrock.Types.ListProvisionedModelThroughputsResponse, AWSError>;
  /**
   * List the tags associated with the specified resource. For more information, see Tagging resources in the Bedrock User Guide.
   */
  listTagsForResource(params: Bedrock.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Bedrock.Types.ListTagsForResourceResponse) => void): Request<Bedrock.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List the tags associated with the specified resource. For more information, see Tagging resources in the Bedrock User Guide.
   */
  listTagsForResource(callback?: (err: AWSError, data: Bedrock.Types.ListTagsForResourceResponse) => void): Request<Bedrock.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Set the configuration values for model invocation logging.
   */
  putModelInvocationLoggingConfiguration(params: Bedrock.Types.PutModelInvocationLoggingConfigurationRequest, callback?: (err: AWSError, data: Bedrock.Types.PutModelInvocationLoggingConfigurationResponse) => void): Request<Bedrock.Types.PutModelInvocationLoggingConfigurationResponse, AWSError>;
  /**
   * Set the configuration values for model invocation logging.
   */
  putModelInvocationLoggingConfiguration(callback?: (err: AWSError, data: Bedrock.Types.PutModelInvocationLoggingConfigurationResponse) => void): Request<Bedrock.Types.PutModelInvocationLoggingConfigurationResponse, AWSError>;
  /**
   * Stops an active model customization job. For more information, see Custom models in the Bedrock User Guide.
   */
  stopModelCustomizationJob(params: Bedrock.Types.StopModelCustomizationJobRequest, callback?: (err: AWSError, data: Bedrock.Types.StopModelCustomizationJobResponse) => void): Request<Bedrock.Types.StopModelCustomizationJobResponse, AWSError>;
  /**
   * Stops an active model customization job. For more information, see Custom models in the Bedrock User Guide.
   */
  stopModelCustomizationJob(callback?: (err: AWSError, data: Bedrock.Types.StopModelCustomizationJobResponse) => void): Request<Bedrock.Types.StopModelCustomizationJobResponse, AWSError>;
  /**
   * Associate tags with a resource. For more information, see Tagging resources in the Bedrock User Guide.
   */
  tagResource(params: Bedrock.Types.TagResourceRequest, callback?: (err: AWSError, data: Bedrock.Types.TagResourceResponse) => void): Request<Bedrock.Types.TagResourceResponse, AWSError>;
  /**
   * Associate tags with a resource. For more information, see Tagging resources in the Bedrock User Guide.
   */
  tagResource(callback?: (err: AWSError, data: Bedrock.Types.TagResourceResponse) => void): Request<Bedrock.Types.TagResourceResponse, AWSError>;
  /**
   * Remove one or more tags from a resource. For more information, see Tagging resources in the Bedrock User Guide.
   */
  untagResource(params: Bedrock.Types.UntagResourceRequest, callback?: (err: AWSError, data: Bedrock.Types.UntagResourceResponse) => void): Request<Bedrock.Types.UntagResourceResponse, AWSError>;
  /**
   * Remove one or more tags from a resource. For more information, see Tagging resources in the Bedrock User Guide.
   */
  untagResource(callback?: (err: AWSError, data: Bedrock.Types.UntagResourceResponse) => void): Request<Bedrock.Types.UntagResourceResponse, AWSError>;
  /**
   * Update a provisioned throughput. For more information, see Provisioned throughput in the Bedrock User Guide.
   */
  updateProvisionedModelThroughput(params: Bedrock.Types.UpdateProvisionedModelThroughputRequest, callback?: (err: AWSError, data: Bedrock.Types.UpdateProvisionedModelThroughputResponse) => void): Request<Bedrock.Types.UpdateProvisionedModelThroughputResponse, AWSError>;
  /**
   * Update a provisioned throughput. For more information, see Provisioned throughput in the Bedrock User Guide.
   */
  updateProvisionedModelThroughput(callback?: (err: AWSError, data: Bedrock.Types.UpdateProvisionedModelThroughputResponse) => void): Request<Bedrock.Types.UpdateProvisionedModelThroughputResponse, AWSError>;
}
declare namespace Bedrock {
  export type BaseModelIdentifier = string;
  export type BedrockModelId = string;
  export type Boolean = boolean;
  export type BrandedName = string;
  export type BucketName = string;
  export interface CloudWatchConfig {
    /**
     * The log group name.
     */
    logGroupName: LogGroupName;
    /**
     * The role ARN.
     */
    roleArn: RoleArn;
    /**
     * S3 configuration for delivering a large amount of data.
     */
    largeDataDeliveryS3Config?: S3Config;
  }
  export type CommitmentDuration = "OneMonth"|"SixMonths"|string;
  export interface CreateModelCustomizationJobRequest {
    /**
     * Enter a unique name for the fine-tuning job.
     */
    jobName: JobName;
    /**
     * Enter a name for the custom model.
     */
    customModelName: CustomModelName;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Bedrock can assume to perform tasks on your behalf. For example, during model training, Bedrock needs your permission to read input data from an S3 bucket, write model artifacts to an S3 bucket. To pass this role to Bedrock, the caller of this API must have the iam:PassRole permission. 
     */
    roleArn: RoleArn;
    /**
     * Unique token value that you can provide. The GetModelCustomizationJob response includes the same token value.
     */
    clientRequestToken?: IdempotencyToken;
    /**
     * Name of the base model.
     */
    baseModelIdentifier: BaseModelIdentifier;
    /**
     * The custom model is encrypted at rest using this key.
     */
    customModelKmsKeyId?: KmsKeyId;
    /**
     * Assign tags to the job.
     */
    jobTags?: TagList;
    /**
     * Assign tags to the custom model.
     */
    customModelTags?: TagList;
    /**
     * Information about the training dataset.
     */
    trainingDataConfig: TrainingDataConfig;
    /**
     * Information about the validation dataset. 
     */
    validationDataConfig?: ValidationDataConfig;
    /**
     * S3 location for the output data.
     */
    outputDataConfig: OutputDataConfig;
    /**
     * Parameters related to tuning the model.
     */
    hyperParameters: ModelCustomizationHyperParameters;
    /**
     * VPC configuration (optional). Configuration parameters for the private Virtual Private Cloud (VPC) that contains the resources you are using for this job.
     */
    vpcConfig?: VpcConfig;
  }
  export interface CreateModelCustomizationJobResponse {
    /**
     * ARN of the fine tuning job
     */
    jobArn: ModelCustomizationJobArn;
  }
  export interface CreateProvisionedModelThroughputRequest {
    /**
     * Unique token value that you can provide. If this token matches a previous request, Bedrock ignores the request, but does not return an error.
     */
    clientRequestToken?: IdempotencyToken;
    /**
     * Number of model units to allocate.
     */
    modelUnits: PositiveInteger;
    /**
     * Unique name for this provisioned throughput.
     */
    provisionedModelName: ProvisionedModelName;
    /**
     * Name or ARN of the model to associate with this provisioned throughput.
     */
    modelId: ModelIdentifier;
    /**
     * Commitment duration requested for the provisioned throughput.
     */
    commitmentDuration?: CommitmentDuration;
    /**
     * Tags to associate with this provisioned throughput.
     */
    tags?: TagList;
  }
  export interface CreateProvisionedModelThroughputResponse {
    /**
     * The ARN for this provisioned throughput.
     */
    provisionedModelArn: ProvisionedModelArn;
  }
  export type CustomModelArn = string;
  export type CustomModelName = string;
  export interface CustomModelSummary {
    /**
     * The ARN of the custom model.
     */
    modelArn: CustomModelArn;
    /**
     * The name of the custom model.
     */
    modelName: CustomModelName;
    /**
     * Creation time of the model.
     */
    creationTime: Timestamp;
    /**
     * The base model ARN.
     */
    baseModelArn: ModelArn;
    /**
     * The base model name.
     */
    baseModelName: ModelName;
  }
  export type CustomModelSummaryList = CustomModelSummary[];
  export interface DeleteCustomModelRequest {
    /**
     * Name of the model to delete.
     */
    modelIdentifier: ModelIdentifier;
  }
  export interface DeleteCustomModelResponse {
  }
  export interface DeleteModelInvocationLoggingConfigurationRequest {
  }
  export interface DeleteModelInvocationLoggingConfigurationResponse {
  }
  export interface DeleteProvisionedModelThroughputRequest {
    /**
     * The ARN or name of the provisioned throughput.
     */
    provisionedModelId: ProvisionedModelId;
  }
  export interface DeleteProvisionedModelThroughputResponse {
  }
  export type ErrorMessage = string;
  export type FineTuningJobStatus = "InProgress"|"Completed"|"Failed"|"Stopping"|"Stopped"|string;
  export type FoundationModelArn = string;
  export interface FoundationModelDetails {
    /**
     * The model ARN.
     */
    modelArn: FoundationModelArn;
    /**
     * The model identifier.
     */
    modelId: BedrockModelId;
    /**
     * The model name.
     */
    modelName?: BrandedName;
    /**
     * he model's provider name.
     */
    providerName?: BrandedName;
    /**
     * The input modalities that the model supports.
     */
    inputModalities?: ModelModalityList;
    /**
     * The output modalities that the model supports.
     */
    outputModalities?: ModelModalityList;
    /**
     * Indicates whether the model supports streaming.
     */
    responseStreamingSupported?: Boolean;
    /**
     * The customization that the model supports.
     */
    customizationsSupported?: ModelCustomizationList;
    /**
     * The inference types that the model supports.
     */
    inferenceTypesSupported?: InferenceTypeList;
  }
  export interface FoundationModelSummary {
    /**
     * The ARN of the foundation model.
     */
    modelArn: FoundationModelArn;
    /**
     * The model Id of the foundation model.
     */
    modelId: BedrockModelId;
    /**
     * The name of the model.
     */
    modelName?: BrandedName;
    /**
     * The model's provider name.
     */
    providerName?: BrandedName;
    /**
     * The input modalities that the model supports.
     */
    inputModalities?: ModelModalityList;
    /**
     * The output modalities that the model supports.
     */
    outputModalities?: ModelModalityList;
    /**
     * Indicates whether the model supports streaming.
     */
    responseStreamingSupported?: Boolean;
    /**
     * Whether the model supports fine-tuning or continual pre-training.
     */
    customizationsSupported?: ModelCustomizationList;
    /**
     * The inference types that the model supports.
     */
    inferenceTypesSupported?: InferenceTypeList;
  }
  export type FoundationModelSummaryList = FoundationModelSummary[];
  export interface GetCustomModelRequest {
    /**
     * Name or ARN of the custom model.
     */
    modelIdentifier: ModelIdentifier;
  }
  export interface GetCustomModelResponse {
    /**
     * ARN associated with this model.
     */
    modelArn: ModelArn;
    /**
     * Model name associated with this model.
     */
    modelName: CustomModelName;
    /**
     * Job name associated with this model.
     */
    jobName?: JobName;
    /**
     * Job ARN associated with this model.
     */
    jobArn: ModelCustomizationJobArn;
    /**
     * ARN of the base model.
     */
    baseModelArn: ModelArn;
    /**
     * The custom model is encrypted at rest using this key.
     */
    modelKmsKeyArn?: KmsKeyArn;
    /**
     * Hyperparameter values associated with this model.
     */
    hyperParameters?: ModelCustomizationHyperParameters;
    /**
     * Information about the training dataset.
     */
    trainingDataConfig: TrainingDataConfig;
    validationDataConfig?: ValidationDataConfig;
    /**
     * Output data configuration associated with this custom model.
     */
    outputDataConfig: OutputDataConfig;
    /**
     * The training metrics from the job creation.
     */
    trainingMetrics?: TrainingMetrics;
    /**
     * The validation metrics from the job creation.
     */
    validationMetrics?: ValidationMetrics;
    /**
     * Creation time of the model.
     */
    creationTime: Timestamp;
  }
  export interface GetFoundationModelRequest {
    /**
     * The model identifier. 
     */
    modelIdentifier: ModelIdentifier;
  }
  export interface GetFoundationModelResponse {
    /**
     * Information about the foundation model.
     */
    modelDetails?: FoundationModelDetails;
  }
  export interface GetModelCustomizationJobRequest {
    /**
     * Identifier for the customization job.
     */
    jobIdentifier: ModelCustomizationJobIdentifier;
  }
  export interface GetModelCustomizationJobResponse {
    /**
     * The ARN of the customization job.
     */
    jobArn: ModelCustomizationJobArn;
    /**
     * The name of the customization job.
     */
    jobName: JobName;
    /**
     * The name of the output model.
     */
    outputModelName: CustomModelName;
    /**
     * The ARN of the output model.
     */
    outputModelArn?: CustomModelArn;
    /**
     * The token that you specified in the CreateCustomizationJob request.
     */
    clientRequestToken?: IdempotencyToken;
    /**
     * The ARN of the IAM role.
     */
    roleArn: RoleArn;
    /**
     * The status of the job. A successful job transitions from in-progress to completed when the output model is ready to use. If the job failed, the failure message contains information about why the job failed.
     */
    status?: ModelCustomizationJobStatus;
    /**
     * Information about why the job failed.
     */
    failureMessage?: ErrorMessage;
    /**
     * Time that the resource was created.
     */
    creationTime: Timestamp;
    /**
     * Time that the resource was last modified.
     */
    lastModifiedTime?: Timestamp;
    /**
     * Time that the resource transitioned to terminal state.
     */
    endTime?: Timestamp;
    /**
     * ARN of the base model.
     */
    baseModelArn: FoundationModelArn;
    /**
     * The hyperparameter values for the job.
     */
    hyperParameters: ModelCustomizationHyperParameters;
    trainingDataConfig: TrainingDataConfig;
    validationDataConfig: ValidationDataConfig;
    /**
     * Output data configuration 
     */
    outputDataConfig: OutputDataConfig;
    /**
     * The custom model is encrypted at rest using this key.
     */
    outputModelKmsKeyArn?: KmsKeyArn;
    trainingMetrics?: TrainingMetrics;
    /**
     * The loss metric for each validator that you provided in the createjob request.
     */
    validationMetrics?: ValidationMetrics;
    /**
     * VPC configuration for the custom model job.
     */
    vpcConfig?: VpcConfig;
  }
  export interface GetModelInvocationLoggingConfigurationRequest {
  }
  export interface GetModelInvocationLoggingConfigurationResponse {
    /**
     * The current configuration values.
     */
    loggingConfig?: LoggingConfig;
  }
  export interface GetProvisionedModelThroughputRequest {
    /**
     * The ARN or name of the provisioned throughput.
     */
    provisionedModelId: ProvisionedModelId;
  }
  export interface GetProvisionedModelThroughputResponse {
    /**
     * The current number of model units requested to be available for this provisioned throughput.
     */
    modelUnits: PositiveInteger;
    /**
     * The desired number of model units that was requested to be available for this provisioned throughput.
     */
    desiredModelUnits: PositiveInteger;
    /**
     * The name of the provisioned throughput.
     */
    provisionedModelName: ProvisionedModelName;
    /**
     * The ARN of the provisioned throughput.
     */
    provisionedModelArn: ProvisionedModelArn;
    /**
     * The ARN or name of the model associated with this provisioned throughput.
     */
    modelArn: ModelArn;
    /**
     * The ARN of the new model to asssociate with this provisioned throughput.
     */
    desiredModelArn: ModelArn;
    /**
     * ARN of the foundation model.
     */
    foundationModelArn: FoundationModelArn;
    /**
     * Status of the provisioned throughput. 
     */
    status: ProvisionedModelStatus;
    /**
     * The timestamp of the creation time for this provisioned throughput. 
     */
    creationTime: Timestamp;
    /**
     * The timestamp of the last modified time of this provisioned throughput. 
     */
    lastModifiedTime: Timestamp;
    /**
     * Failure message for any issues that the create operation encounters.
     */
    failureMessage?: ErrorMessage;
    /**
     * Commitment duration of the provisioned throughput.
     */
    commitmentDuration?: CommitmentDuration;
    /**
     * Commitment expiration time for the provisioned throughput.
     */
    commitmentExpirationTime?: Timestamp;
  }
  export type IdempotencyToken = string;
  export type InferenceType = "ON_DEMAND"|"PROVISIONED"|string;
  export type InferenceTypeList = InferenceType[];
  export type JobName = string;
  export type KeyPrefix = string;
  export type KmsKeyArn = string;
  export type KmsKeyId = string;
  export interface ListCustomModelsRequest {
    /**
     * Return custom models created before the specified time. 
     */
    creationTimeBefore?: Timestamp;
    /**
     * Return custom models created after the specified time. 
     */
    creationTimeAfter?: Timestamp;
    /**
     * Return custom models only if the job name contains these characters.
     */
    nameContains?: CustomModelName;
    /**
     * Return custom models only if the base model ARN matches this parameter.
     */
    baseModelArnEquals?: ModelArn;
    /**
     * Return custom models only if the foundation model ARN matches this parameter.
     */
    foundationModelArnEquals?: FoundationModelArn;
    /**
     * Maximum number of results to return in the response.
     */
    maxResults?: MaxResults;
    /**
     * Continuation token from the previous response, for Bedrock to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * The field to sort by in the returned list of models.
     */
    sortBy?: SortModelsBy;
    /**
     * The sort order of the results.
     */
    sortOrder?: SortOrder;
  }
  export interface ListCustomModelsResponse {
    /**
     * Continuation token for the next request to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * Model summaries.
     */
    modelSummaries?: CustomModelSummaryList;
  }
  export interface ListFoundationModelsRequest {
    /**
     * A Bedrock model provider.
     */
    byProvider?: Provider;
    /**
     * List by customization type.
     */
    byCustomizationType?: ModelCustomization;
    /**
     * List by output modality type.
     */
    byOutputModality?: ModelModality;
    /**
     * List by inference type.
     */
    byInferenceType?: InferenceType;
  }
  export interface ListFoundationModelsResponse {
    /**
     * A list of bedrock foundation models.
     */
    modelSummaries?: FoundationModelSummaryList;
  }
  export interface ListModelCustomizationJobsRequest {
    /**
     * Return customization jobs created after the specified time. 
     */
    creationTimeAfter?: Timestamp;
    /**
     * Return customization jobs created before the specified time. 
     */
    creationTimeBefore?: Timestamp;
    /**
     * Return customization jobs with the specified status. 
     */
    statusEquals?: FineTuningJobStatus;
    /**
     * Return customization jobs only if the job name contains these characters.
     */
    nameContains?: JobName;
    /**
     * Maximum number of results to return in the response.
     */
    maxResults?: MaxResults;
    /**
     * Continuation token from the previous response, for Bedrock to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * The field to sort by in the returned list of jobs.
     */
    sortBy?: SortJobsBy;
    /**
     * The sort order of the results.
     */
    sortOrder?: SortOrder;
  }
  export interface ListModelCustomizationJobsResponse {
    /**
     * Page continuation token to use in the next request.
     */
    nextToken?: PaginationToken;
    /**
     * Job summaries.
     */
    modelCustomizationJobSummaries?: ModelCustomizationJobSummaries;
  }
  export interface ListProvisionedModelThroughputsRequest {
    /**
     * Return provisioned capacities created after the specified time. 
     */
    creationTimeAfter?: Timestamp;
    /**
     * Return provisioned capacities created before the specified time. 
     */
    creationTimeBefore?: Timestamp;
    /**
     * Return the list of provisioned capacities that match the specified status.
     */
    statusEquals?: ProvisionedModelStatus;
    /**
     * Return the list of provisioned capacities where their model ARN is equal to this parameter.
     */
    modelArnEquals?: ModelArn;
    /**
     * Return the list of provisioned capacities if their name contains these characters.
     */
    nameContains?: ProvisionedModelName;
    /**
     * THe maximum number of results to return in the response.
     */
    maxResults?: MaxResults;
    /**
     * Continuation token from the previous response, for Bedrock to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * The field to sort by in the returned list of provisioned capacities.
     */
    sortBy?: SortByProvisionedModels;
    /**
     * The sort order of the results.
     */
    sortOrder?: SortOrder;
  }
  export interface ListProvisionedModelThroughputsResponse {
    /**
     * Continuation token for the next request to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * List of summaries, one for each provisioned throughput in the response.
     */
    provisionedModelSummaries?: ProvisionedModelSummaries;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceARN: TaggableResourcesArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * An array of the tags associated with this resource.
     */
    tags?: TagList;
  }
  export type LogGroupName = string;
  export interface LoggingConfig {
    /**
     * CloudWatch logging configuration.
     */
    cloudWatchConfig?: CloudWatchConfig;
    /**
     * S3 configuration for storing log data.
     */
    s3Config?: S3Config;
    /**
     * Set to include text data in the log delivery.
     */
    textDataDeliveryEnabled?: Boolean;
    /**
     * Set to include image data in the log delivery.
     */
    imageDataDeliveryEnabled?: Boolean;
    /**
     * Set to include embeddings data in the log delivery.
     */
    embeddingDataDeliveryEnabled?: Boolean;
  }
  export type MaxResults = number;
  export type MetricFloat = number;
  export type ModelArn = string;
  export type ModelCustomization = "FINE_TUNING"|string;
  export type ModelCustomizationHyperParameters = {[key: string]: String};
  export type ModelCustomizationJobArn = string;
  export type ModelCustomizationJobIdentifier = string;
  export type ModelCustomizationJobStatus = "InProgress"|"Completed"|"Failed"|"Stopping"|"Stopped"|string;
  export type ModelCustomizationJobSummaries = ModelCustomizationJobSummary[];
  export interface ModelCustomizationJobSummary {
    /**
     * ARN of the customization job.
     */
    jobArn: ModelCustomizationJobArn;
    /**
     * ARN of the base model.
     */
    baseModelArn: ModelArn;
    /**
     * Name of the customization job.
     */
    jobName: JobName;
    /**
     * Status of the customization job. 
     */
    status: ModelCustomizationJobStatus;
    /**
     * Time that the customization job was last modified.
     */
    lastModifiedTime?: Timestamp;
    /**
     * Creation time of the custom model. 
     */
    creationTime: Timestamp;
    /**
     * Time that the customization job ended.
     */
    endTime?: Timestamp;
    /**
     * ARN of the custom model.
     */
    customModelArn?: CustomModelArn;
    /**
     * Name of the custom model.
     */
    customModelName?: CustomModelName;
  }
  export type ModelCustomizationList = ModelCustomization[];
  export type ModelIdentifier = string;
  export type ModelModality = "TEXT"|"IMAGE"|"EMBEDDING"|string;
  export type ModelModalityList = ModelModality[];
  export type ModelName = string;
  export interface OutputDataConfig {
    /**
     * The S3 URI where the output data is stored.
     */
    s3Uri: S3Uri;
  }
  export type PaginationToken = string;
  export type PositiveInteger = number;
  export type Provider = string;
  export type ProvisionedModelArn = string;
  export type ProvisionedModelId = string;
  export type ProvisionedModelName = string;
  export type ProvisionedModelStatus = "Creating"|"InService"|"Updating"|"Failed"|string;
  export type ProvisionedModelSummaries = ProvisionedModelSummary[];
  export interface ProvisionedModelSummary {
    /**
     * The name of the provisioned throughput.
     */
    provisionedModelName: ProvisionedModelName;
    /**
     * The ARN of the provisioned throughput.
     */
    provisionedModelArn: ProvisionedModelArn;
    /**
     * The ARN of the model associated with this provisioned throughput.
     */
    modelArn: ModelArn;
    /**
     * Desired model ARN.
     */
    desiredModelArn: ModelArn;
    /**
     * Foundation model ARN.
     */
    foundationModelArn: FoundationModelArn;
    /**
     * The number of model units allocated.
     */
    modelUnits: PositiveInteger;
    /**
     * Desired model units.
     */
    desiredModelUnits: PositiveInteger;
    /**
     * Status of the provisioned throughput.
     */
    status: ProvisionedModelStatus;
    /**
     * Commitment duration for the provisioned throughput.
     */
    commitmentDuration?: CommitmentDuration;
    /**
     * Commitment expiration time for the provisioned throughput.
     */
    commitmentExpirationTime?: Timestamp;
    /**
     * The time that this provisioned throughput was created. 
     */
    creationTime: Timestamp;
    /**
     * The time that this provisioned throughput was last modified. 
     */
    lastModifiedTime: Timestamp;
  }
  export interface PutModelInvocationLoggingConfigurationRequest {
    /**
     * The logging configuration values to set.
     */
    loggingConfig: LoggingConfig;
  }
  export interface PutModelInvocationLoggingConfigurationResponse {
  }
  export type RoleArn = string;
  export interface S3Config {
    /**
     * S3 bucket name.
     */
    bucketName: BucketName;
    /**
     * S3 prefix. 
     */
    keyPrefix?: KeyPrefix;
  }
  export type S3Uri = string;
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export type SortByProvisionedModels = "CreationTime"|string;
  export type SortJobsBy = "CreationTime"|string;
  export type SortModelsBy = "CreationTime"|string;
  export type SortOrder = "Ascending"|"Descending"|string;
  export interface StopModelCustomizationJobRequest {
    /**
     * Job identifier of the job to stop.
     */
    jobIdentifier: ModelCustomizationJobIdentifier;
  }
  export interface StopModelCustomizationJobResponse {
  }
  export type String = string;
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
  export interface Tag {
    /**
     * Key for the tag.
     */
    key: TagKey;
    /**
     * Value for the tag.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The ARN of the resource to tag.
     */
    resourceARN: TaggableResourcesArn;
    /**
     * Tags to associate with the resource.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TaggableResourcesArn = string;
  export type Timestamp = Date;
  export interface TrainingDataConfig {
    /**
     * The S3 URI where the training data is stored.
     */
    s3Uri: S3Uri;
  }
  export interface TrainingMetrics {
    /**
     * Loss metric associated with the custom job.
     */
    trainingLoss?: MetricFloat;
  }
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource to untag.
     */
    resourceARN: TaggableResourcesArn;
    /**
     * Tag keys of the tags to remove from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateProvisionedModelThroughputRequest {
    /**
     * The ARN or name of the provisioned throughput to update.
     */
    provisionedModelId: ProvisionedModelId;
    /**
     * The new name for this provisioned throughput.
     */
    desiredProvisionedModelName?: ProvisionedModelName;
    /**
     * The ARN of the new model to associate with this provisioned throughput.
     */
    desiredModelId?: ModelIdentifier;
  }
  export interface UpdateProvisionedModelThroughputResponse {
  }
  export interface ValidationDataConfig {
    /**
     * Information about the validators.
     */
    validators: Validators;
  }
  export type ValidationMetrics = ValidatorMetric[];
  export interface Validator {
    /**
     * The S3 URI where the validation data is stored.
     */
    s3Uri: S3Uri;
  }
  export interface ValidatorMetric {
    /**
     * The validation loss associated with this validator.
     */
    validationLoss?: MetricFloat;
  }
  export type Validators = Validator[];
  export interface VpcConfig {
    /**
     * VPC configuration subnets.
     */
    subnetIds: SubnetIds;
    /**
     * VPC configuration security group Ids.
     */
    securityGroupIds: SecurityGroupIds;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2023-04-20"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Bedrock client.
   */
  export import Types = Bedrock;
}
export = Bedrock;
