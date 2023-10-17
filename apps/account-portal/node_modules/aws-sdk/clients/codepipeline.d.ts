import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CodePipeline extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CodePipeline.Types.ClientConfiguration)
  config: Config & CodePipeline.Types.ClientConfiguration;
  /**
   * Returns information about a specified job and whether that job has been received by the job worker. Used for custom actions only.
   */
  acknowledgeJob(params: CodePipeline.Types.AcknowledgeJobInput, callback?: (err: AWSError, data: CodePipeline.Types.AcknowledgeJobOutput) => void): Request<CodePipeline.Types.AcknowledgeJobOutput, AWSError>;
  /**
   * Returns information about a specified job and whether that job has been received by the job worker. Used for custom actions only.
   */
  acknowledgeJob(callback?: (err: AWSError, data: CodePipeline.Types.AcknowledgeJobOutput) => void): Request<CodePipeline.Types.AcknowledgeJobOutput, AWSError>;
  /**
   * Confirms a job worker has received the specified job. Used for partner actions only.
   */
  acknowledgeThirdPartyJob(params: CodePipeline.Types.AcknowledgeThirdPartyJobInput, callback?: (err: AWSError, data: CodePipeline.Types.AcknowledgeThirdPartyJobOutput) => void): Request<CodePipeline.Types.AcknowledgeThirdPartyJobOutput, AWSError>;
  /**
   * Confirms a job worker has received the specified job. Used for partner actions only.
   */
  acknowledgeThirdPartyJob(callback?: (err: AWSError, data: CodePipeline.Types.AcknowledgeThirdPartyJobOutput) => void): Request<CodePipeline.Types.AcknowledgeThirdPartyJobOutput, AWSError>;
  /**
   * Creates a new custom action that can be used in all pipelines associated with the AWS account. Only used for custom actions.
   */
  createCustomActionType(params: CodePipeline.Types.CreateCustomActionTypeInput, callback?: (err: AWSError, data: CodePipeline.Types.CreateCustomActionTypeOutput) => void): Request<CodePipeline.Types.CreateCustomActionTypeOutput, AWSError>;
  /**
   * Creates a new custom action that can be used in all pipelines associated with the AWS account. Only used for custom actions.
   */
  createCustomActionType(callback?: (err: AWSError, data: CodePipeline.Types.CreateCustomActionTypeOutput) => void): Request<CodePipeline.Types.CreateCustomActionTypeOutput, AWSError>;
  /**
   * Creates a pipeline.  In the pipeline structure, you must include either artifactStore or artifactStores in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use artifactStores. 
   */
  createPipeline(params: CodePipeline.Types.CreatePipelineInput, callback?: (err: AWSError, data: CodePipeline.Types.CreatePipelineOutput) => void): Request<CodePipeline.Types.CreatePipelineOutput, AWSError>;
  /**
   * Creates a pipeline.  In the pipeline structure, you must include either artifactStore or artifactStores in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use artifactStores. 
   */
  createPipeline(callback?: (err: AWSError, data: CodePipeline.Types.CreatePipelineOutput) => void): Request<CodePipeline.Types.CreatePipelineOutput, AWSError>;
  /**
   * Marks a custom action as deleted. PollForJobs for the custom action fails after the action is marked for deletion. Used for custom actions only.  To re-create a custom action after it has been deleted you must use a string in the version field that has never been used before. This string can be an incremented version number, for example. To restore a deleted custom action, use a JSON file that is identical to the deleted action, including the original string in the version field. 
   */
  deleteCustomActionType(params: CodePipeline.Types.DeleteCustomActionTypeInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Marks a custom action as deleted. PollForJobs for the custom action fails after the action is marked for deletion. Used for custom actions only.  To re-create a custom action after it has been deleted you must use a string in the version field that has never been used before. This string can be an incremented version number, for example. To restore a deleted custom action, use a JSON file that is identical to the deleted action, including the original string in the version field. 
   */
  deleteCustomActionType(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified pipeline.
   */
  deletePipeline(params: CodePipeline.Types.DeletePipelineInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified pipeline.
   */
  deletePipeline(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a previously created webhook by name. Deleting the webhook stops AWS CodePipeline from starting a pipeline every time an external event occurs. The API returns successfully when trying to delete a webhook that is already deleted. If a deleted webhook is re-created by calling PutWebhook with the same name, it will have a different URL.
   */
  deleteWebhook(params: CodePipeline.Types.DeleteWebhookInput, callback?: (err: AWSError, data: CodePipeline.Types.DeleteWebhookOutput) => void): Request<CodePipeline.Types.DeleteWebhookOutput, AWSError>;
  /**
   * Deletes a previously created webhook by name. Deleting the webhook stops AWS CodePipeline from starting a pipeline every time an external event occurs. The API returns successfully when trying to delete a webhook that is already deleted. If a deleted webhook is re-created by calling PutWebhook with the same name, it will have a different URL.
   */
  deleteWebhook(callback?: (err: AWSError, data: CodePipeline.Types.DeleteWebhookOutput) => void): Request<CodePipeline.Types.DeleteWebhookOutput, AWSError>;
  /**
   * Removes the connection between the webhook that was created by CodePipeline and the external tool with events to be detected. Currently supported only for webhooks that target an action type of GitHub.
   */
  deregisterWebhookWithThirdParty(params: CodePipeline.Types.DeregisterWebhookWithThirdPartyInput, callback?: (err: AWSError, data: CodePipeline.Types.DeregisterWebhookWithThirdPartyOutput) => void): Request<CodePipeline.Types.DeregisterWebhookWithThirdPartyOutput, AWSError>;
  /**
   * Removes the connection between the webhook that was created by CodePipeline and the external tool with events to be detected. Currently supported only for webhooks that target an action type of GitHub.
   */
  deregisterWebhookWithThirdParty(callback?: (err: AWSError, data: CodePipeline.Types.DeregisterWebhookWithThirdPartyOutput) => void): Request<CodePipeline.Types.DeregisterWebhookWithThirdPartyOutput, AWSError>;
  /**
   * Prevents artifacts in a pipeline from transitioning to the next stage in the pipeline.
   */
  disableStageTransition(params: CodePipeline.Types.DisableStageTransitionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Prevents artifacts in a pipeline from transitioning to the next stage in the pipeline.
   */
  disableStageTransition(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables artifacts in a pipeline to transition to a stage in a pipeline.
   */
  enableStageTransition(params: CodePipeline.Types.EnableStageTransitionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables artifacts in a pipeline to transition to a stage in a pipeline.
   */
  enableStageTransition(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns information about an action type created for an external provider, where the action is to be used by customers of the external provider. The action can be created with any supported integration model.
   */
  getActionType(params: CodePipeline.Types.GetActionTypeInput, callback?: (err: AWSError, data: CodePipeline.Types.GetActionTypeOutput) => void): Request<CodePipeline.Types.GetActionTypeOutput, AWSError>;
  /**
   * Returns information about an action type created for an external provider, where the action is to be used by customers of the external provider. The action can be created with any supported integration model.
   */
  getActionType(callback?: (err: AWSError, data: CodePipeline.Types.GetActionTypeOutput) => void): Request<CodePipeline.Types.GetActionTypeOutput, AWSError>;
  /**
   * Returns information about a job. Used for custom actions only.  When this API is called, AWS CodePipeline returns temporary credentials for the S3 bucket used to store artifacts for the pipeline, if the action requires access to that S3 bucket for input or output artifacts. This API also returns any secret values defined for the action. 
   */
  getJobDetails(params: CodePipeline.Types.GetJobDetailsInput, callback?: (err: AWSError, data: CodePipeline.Types.GetJobDetailsOutput) => void): Request<CodePipeline.Types.GetJobDetailsOutput, AWSError>;
  /**
   * Returns information about a job. Used for custom actions only.  When this API is called, AWS CodePipeline returns temporary credentials for the S3 bucket used to store artifacts for the pipeline, if the action requires access to that S3 bucket for input or output artifacts. This API also returns any secret values defined for the action. 
   */
  getJobDetails(callback?: (err: AWSError, data: CodePipeline.Types.GetJobDetailsOutput) => void): Request<CodePipeline.Types.GetJobDetailsOutput, AWSError>;
  /**
   * Returns the metadata, structure, stages, and actions of a pipeline. Can be used to return the entire structure of a pipeline in JSON format, which can then be modified and used to update the pipeline structure with UpdatePipeline.
   */
  getPipeline(params: CodePipeline.Types.GetPipelineInput, callback?: (err: AWSError, data: CodePipeline.Types.GetPipelineOutput) => void): Request<CodePipeline.Types.GetPipelineOutput, AWSError>;
  /**
   * Returns the metadata, structure, stages, and actions of a pipeline. Can be used to return the entire structure of a pipeline in JSON format, which can then be modified and used to update the pipeline structure with UpdatePipeline.
   */
  getPipeline(callback?: (err: AWSError, data: CodePipeline.Types.GetPipelineOutput) => void): Request<CodePipeline.Types.GetPipelineOutput, AWSError>;
  /**
   * Returns information about an execution of a pipeline, including details about artifacts, the pipeline execution ID, and the name, version, and status of the pipeline.
   */
  getPipelineExecution(params: CodePipeline.Types.GetPipelineExecutionInput, callback?: (err: AWSError, data: CodePipeline.Types.GetPipelineExecutionOutput) => void): Request<CodePipeline.Types.GetPipelineExecutionOutput, AWSError>;
  /**
   * Returns information about an execution of a pipeline, including details about artifacts, the pipeline execution ID, and the name, version, and status of the pipeline.
   */
  getPipelineExecution(callback?: (err: AWSError, data: CodePipeline.Types.GetPipelineExecutionOutput) => void): Request<CodePipeline.Types.GetPipelineExecutionOutput, AWSError>;
  /**
   * Returns information about the state of a pipeline, including the stages and actions.  Values returned in the revisionId and revisionUrl fields indicate the source revision information, such as the commit ID, for the current state. 
   */
  getPipelineState(params: CodePipeline.Types.GetPipelineStateInput, callback?: (err: AWSError, data: CodePipeline.Types.GetPipelineStateOutput) => void): Request<CodePipeline.Types.GetPipelineStateOutput, AWSError>;
  /**
   * Returns information about the state of a pipeline, including the stages and actions.  Values returned in the revisionId and revisionUrl fields indicate the source revision information, such as the commit ID, for the current state. 
   */
  getPipelineState(callback?: (err: AWSError, data: CodePipeline.Types.GetPipelineStateOutput) => void): Request<CodePipeline.Types.GetPipelineStateOutput, AWSError>;
  /**
   * Requests the details of a job for a third party action. Used for partner actions only.  When this API is called, AWS CodePipeline returns temporary credentials for the S3 bucket used to store artifacts for the pipeline, if the action requires access to that S3 bucket for input or output artifacts. This API also returns any secret values defined for the action. 
   */
  getThirdPartyJobDetails(params: CodePipeline.Types.GetThirdPartyJobDetailsInput, callback?: (err: AWSError, data: CodePipeline.Types.GetThirdPartyJobDetailsOutput) => void): Request<CodePipeline.Types.GetThirdPartyJobDetailsOutput, AWSError>;
  /**
   * Requests the details of a job for a third party action. Used for partner actions only.  When this API is called, AWS CodePipeline returns temporary credentials for the S3 bucket used to store artifacts for the pipeline, if the action requires access to that S3 bucket for input or output artifacts. This API also returns any secret values defined for the action. 
   */
  getThirdPartyJobDetails(callback?: (err: AWSError, data: CodePipeline.Types.GetThirdPartyJobDetailsOutput) => void): Request<CodePipeline.Types.GetThirdPartyJobDetailsOutput, AWSError>;
  /**
   * Lists the action executions that have occurred in a pipeline.
   */
  listActionExecutions(params: CodePipeline.Types.ListActionExecutionsInput, callback?: (err: AWSError, data: CodePipeline.Types.ListActionExecutionsOutput) => void): Request<CodePipeline.Types.ListActionExecutionsOutput, AWSError>;
  /**
   * Lists the action executions that have occurred in a pipeline.
   */
  listActionExecutions(callback?: (err: AWSError, data: CodePipeline.Types.ListActionExecutionsOutput) => void): Request<CodePipeline.Types.ListActionExecutionsOutput, AWSError>;
  /**
   * Gets a summary of all AWS CodePipeline action types associated with your account.
   */
  listActionTypes(params: CodePipeline.Types.ListActionTypesInput, callback?: (err: AWSError, data: CodePipeline.Types.ListActionTypesOutput) => void): Request<CodePipeline.Types.ListActionTypesOutput, AWSError>;
  /**
   * Gets a summary of all AWS CodePipeline action types associated with your account.
   */
  listActionTypes(callback?: (err: AWSError, data: CodePipeline.Types.ListActionTypesOutput) => void): Request<CodePipeline.Types.ListActionTypesOutput, AWSError>;
  /**
   * Gets a summary of the most recent executions for a pipeline.
   */
  listPipelineExecutions(params: CodePipeline.Types.ListPipelineExecutionsInput, callback?: (err: AWSError, data: CodePipeline.Types.ListPipelineExecutionsOutput) => void): Request<CodePipeline.Types.ListPipelineExecutionsOutput, AWSError>;
  /**
   * Gets a summary of the most recent executions for a pipeline.
   */
  listPipelineExecutions(callback?: (err: AWSError, data: CodePipeline.Types.ListPipelineExecutionsOutput) => void): Request<CodePipeline.Types.ListPipelineExecutionsOutput, AWSError>;
  /**
   * Gets a summary of all of the pipelines associated with your account.
   */
  listPipelines(params: CodePipeline.Types.ListPipelinesInput, callback?: (err: AWSError, data: CodePipeline.Types.ListPipelinesOutput) => void): Request<CodePipeline.Types.ListPipelinesOutput, AWSError>;
  /**
   * Gets a summary of all of the pipelines associated with your account.
   */
  listPipelines(callback?: (err: AWSError, data: CodePipeline.Types.ListPipelinesOutput) => void): Request<CodePipeline.Types.ListPipelinesOutput, AWSError>;
  /**
   * Gets the set of key-value pairs (metadata) that are used to manage the resource.
   */
  listTagsForResource(params: CodePipeline.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: CodePipeline.Types.ListTagsForResourceOutput) => void): Request<CodePipeline.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Gets the set of key-value pairs (metadata) that are used to manage the resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: CodePipeline.Types.ListTagsForResourceOutput) => void): Request<CodePipeline.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Gets a listing of all the webhooks in this AWS Region for this account. The output lists all webhooks and includes the webhook URL and ARN and the configuration for each webhook.
   */
  listWebhooks(params: CodePipeline.Types.ListWebhooksInput, callback?: (err: AWSError, data: CodePipeline.Types.ListWebhooksOutput) => void): Request<CodePipeline.Types.ListWebhooksOutput, AWSError>;
  /**
   * Gets a listing of all the webhooks in this AWS Region for this account. The output lists all webhooks and includes the webhook URL and ARN and the configuration for each webhook.
   */
  listWebhooks(callback?: (err: AWSError, data: CodePipeline.Types.ListWebhooksOutput) => void): Request<CodePipeline.Types.ListWebhooksOutput, AWSError>;
  /**
   * Returns information about any jobs for AWS CodePipeline to act on. PollForJobs is valid only for action types with "Custom" in the owner field. If the action type contains "AWS" or "ThirdParty" in the owner field, the PollForJobs action returns an error.  When this API is called, AWS CodePipeline returns temporary credentials for the S3 bucket used to store artifacts for the pipeline, if the action requires access to that S3 bucket for input or output artifacts. This API also returns any secret values defined for the action. 
   */
  pollForJobs(params: CodePipeline.Types.PollForJobsInput, callback?: (err: AWSError, data: CodePipeline.Types.PollForJobsOutput) => void): Request<CodePipeline.Types.PollForJobsOutput, AWSError>;
  /**
   * Returns information about any jobs for AWS CodePipeline to act on. PollForJobs is valid only for action types with "Custom" in the owner field. If the action type contains "AWS" or "ThirdParty" in the owner field, the PollForJobs action returns an error.  When this API is called, AWS CodePipeline returns temporary credentials for the S3 bucket used to store artifacts for the pipeline, if the action requires access to that S3 bucket for input or output artifacts. This API also returns any secret values defined for the action. 
   */
  pollForJobs(callback?: (err: AWSError, data: CodePipeline.Types.PollForJobsOutput) => void): Request<CodePipeline.Types.PollForJobsOutput, AWSError>;
  /**
   * Determines whether there are any third party jobs for a job worker to act on. Used for partner actions only.  When this API is called, AWS CodePipeline returns temporary credentials for the S3 bucket used to store artifacts for the pipeline, if the action requires access to that S3 bucket for input or output artifacts. 
   */
  pollForThirdPartyJobs(params: CodePipeline.Types.PollForThirdPartyJobsInput, callback?: (err: AWSError, data: CodePipeline.Types.PollForThirdPartyJobsOutput) => void): Request<CodePipeline.Types.PollForThirdPartyJobsOutput, AWSError>;
  /**
   * Determines whether there are any third party jobs for a job worker to act on. Used for partner actions only.  When this API is called, AWS CodePipeline returns temporary credentials for the S3 bucket used to store artifacts for the pipeline, if the action requires access to that S3 bucket for input or output artifacts. 
   */
  pollForThirdPartyJobs(callback?: (err: AWSError, data: CodePipeline.Types.PollForThirdPartyJobsOutput) => void): Request<CodePipeline.Types.PollForThirdPartyJobsOutput, AWSError>;
  /**
   * Provides information to AWS CodePipeline about new revisions to a source.
   */
  putActionRevision(params: CodePipeline.Types.PutActionRevisionInput, callback?: (err: AWSError, data: CodePipeline.Types.PutActionRevisionOutput) => void): Request<CodePipeline.Types.PutActionRevisionOutput, AWSError>;
  /**
   * Provides information to AWS CodePipeline about new revisions to a source.
   */
  putActionRevision(callback?: (err: AWSError, data: CodePipeline.Types.PutActionRevisionOutput) => void): Request<CodePipeline.Types.PutActionRevisionOutput, AWSError>;
  /**
   * Provides the response to a manual approval request to AWS CodePipeline. Valid responses include Approved and Rejected.
   */
  putApprovalResult(params: CodePipeline.Types.PutApprovalResultInput, callback?: (err: AWSError, data: CodePipeline.Types.PutApprovalResultOutput) => void): Request<CodePipeline.Types.PutApprovalResultOutput, AWSError>;
  /**
   * Provides the response to a manual approval request to AWS CodePipeline. Valid responses include Approved and Rejected.
   */
  putApprovalResult(callback?: (err: AWSError, data: CodePipeline.Types.PutApprovalResultOutput) => void): Request<CodePipeline.Types.PutApprovalResultOutput, AWSError>;
  /**
   * Represents the failure of a job as returned to the pipeline by a job worker. Used for custom actions only.
   */
  putJobFailureResult(params: CodePipeline.Types.PutJobFailureResultInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Represents the failure of a job as returned to the pipeline by a job worker. Used for custom actions only.
   */
  putJobFailureResult(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Represents the success of a job as returned to the pipeline by a job worker. Used for custom actions only.
   */
  putJobSuccessResult(params: CodePipeline.Types.PutJobSuccessResultInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Represents the success of a job as returned to the pipeline by a job worker. Used for custom actions only.
   */
  putJobSuccessResult(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Represents the failure of a third party job as returned to the pipeline by a job worker. Used for partner actions only.
   */
  putThirdPartyJobFailureResult(params: CodePipeline.Types.PutThirdPartyJobFailureResultInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Represents the failure of a third party job as returned to the pipeline by a job worker. Used for partner actions only.
   */
  putThirdPartyJobFailureResult(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Represents the success of a third party job as returned to the pipeline by a job worker. Used for partner actions only.
   */
  putThirdPartyJobSuccessResult(params: CodePipeline.Types.PutThirdPartyJobSuccessResultInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Represents the success of a third party job as returned to the pipeline by a job worker. Used for partner actions only.
   */
  putThirdPartyJobSuccessResult(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Defines a webhook and returns a unique webhook URL generated by CodePipeline. This URL can be supplied to third party source hosting providers to call every time there's a code change. When CodePipeline receives a POST request on this URL, the pipeline defined in the webhook is started as long as the POST request satisfied the authentication and filtering requirements supplied when defining the webhook. RegisterWebhookWithThirdParty and DeregisterWebhookWithThirdParty APIs can be used to automatically configure supported third parties to call the generated webhook URL.
   */
  putWebhook(params: CodePipeline.Types.PutWebhookInput, callback?: (err: AWSError, data: CodePipeline.Types.PutWebhookOutput) => void): Request<CodePipeline.Types.PutWebhookOutput, AWSError>;
  /**
   * Defines a webhook and returns a unique webhook URL generated by CodePipeline. This URL can be supplied to third party source hosting providers to call every time there's a code change. When CodePipeline receives a POST request on this URL, the pipeline defined in the webhook is started as long as the POST request satisfied the authentication and filtering requirements supplied when defining the webhook. RegisterWebhookWithThirdParty and DeregisterWebhookWithThirdParty APIs can be used to automatically configure supported third parties to call the generated webhook URL.
   */
  putWebhook(callback?: (err: AWSError, data: CodePipeline.Types.PutWebhookOutput) => void): Request<CodePipeline.Types.PutWebhookOutput, AWSError>;
  /**
   * Configures a connection between the webhook that was created and the external tool with events to be detected.
   */
  registerWebhookWithThirdParty(params: CodePipeline.Types.RegisterWebhookWithThirdPartyInput, callback?: (err: AWSError, data: CodePipeline.Types.RegisterWebhookWithThirdPartyOutput) => void): Request<CodePipeline.Types.RegisterWebhookWithThirdPartyOutput, AWSError>;
  /**
   * Configures a connection between the webhook that was created and the external tool with events to be detected.
   */
  registerWebhookWithThirdParty(callback?: (err: AWSError, data: CodePipeline.Types.RegisterWebhookWithThirdPartyOutput) => void): Request<CodePipeline.Types.RegisterWebhookWithThirdPartyOutput, AWSError>;
  /**
   * Resumes the pipeline execution by retrying the last failed actions in a stage. You can retry a stage immediately if any of the actions in the stage fail. When you retry, all actions that are still in progress continue working, and failed actions are triggered again.
   */
  retryStageExecution(params: CodePipeline.Types.RetryStageExecutionInput, callback?: (err: AWSError, data: CodePipeline.Types.RetryStageExecutionOutput) => void): Request<CodePipeline.Types.RetryStageExecutionOutput, AWSError>;
  /**
   * Resumes the pipeline execution by retrying the last failed actions in a stage. You can retry a stage immediately if any of the actions in the stage fail. When you retry, all actions that are still in progress continue working, and failed actions are triggered again.
   */
  retryStageExecution(callback?: (err: AWSError, data: CodePipeline.Types.RetryStageExecutionOutput) => void): Request<CodePipeline.Types.RetryStageExecutionOutput, AWSError>;
  /**
   * Starts the specified pipeline. Specifically, it begins processing the latest commit to the source location specified as part of the pipeline.
   */
  startPipelineExecution(params: CodePipeline.Types.StartPipelineExecutionInput, callback?: (err: AWSError, data: CodePipeline.Types.StartPipelineExecutionOutput) => void): Request<CodePipeline.Types.StartPipelineExecutionOutput, AWSError>;
  /**
   * Starts the specified pipeline. Specifically, it begins processing the latest commit to the source location specified as part of the pipeline.
   */
  startPipelineExecution(callback?: (err: AWSError, data: CodePipeline.Types.StartPipelineExecutionOutput) => void): Request<CodePipeline.Types.StartPipelineExecutionOutput, AWSError>;
  /**
   * Stops the specified pipeline execution. You choose to either stop the pipeline execution by completing in-progress actions without starting subsequent actions, or by abandoning in-progress actions. While completing or abandoning in-progress actions, the pipeline execution is in a Stopping state. After all in-progress actions are completed or abandoned, the pipeline execution is in a Stopped state.
   */
  stopPipelineExecution(params: CodePipeline.Types.StopPipelineExecutionInput, callback?: (err: AWSError, data: CodePipeline.Types.StopPipelineExecutionOutput) => void): Request<CodePipeline.Types.StopPipelineExecutionOutput, AWSError>;
  /**
   * Stops the specified pipeline execution. You choose to either stop the pipeline execution by completing in-progress actions without starting subsequent actions, or by abandoning in-progress actions. While completing or abandoning in-progress actions, the pipeline execution is in a Stopping state. After all in-progress actions are completed or abandoned, the pipeline execution is in a Stopped state.
   */
  stopPipelineExecution(callback?: (err: AWSError, data: CodePipeline.Types.StopPipelineExecutionOutput) => void): Request<CodePipeline.Types.StopPipelineExecutionOutput, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata that can be used to manage a resource. 
   */
  tagResource(params: CodePipeline.Types.TagResourceInput, callback?: (err: AWSError, data: CodePipeline.Types.TagResourceOutput) => void): Request<CodePipeline.Types.TagResourceOutput, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata that can be used to manage a resource. 
   */
  tagResource(callback?: (err: AWSError, data: CodePipeline.Types.TagResourceOutput) => void): Request<CodePipeline.Types.TagResourceOutput, AWSError>;
  /**
   * Removes tags from an AWS resource.
   */
  untagResource(params: CodePipeline.Types.UntagResourceInput, callback?: (err: AWSError, data: CodePipeline.Types.UntagResourceOutput) => void): Request<CodePipeline.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes tags from an AWS resource.
   */
  untagResource(callback?: (err: AWSError, data: CodePipeline.Types.UntagResourceOutput) => void): Request<CodePipeline.Types.UntagResourceOutput, AWSError>;
  /**
   * Updates an action type that was created with any supported integration model, where the action type is to be used by customers of the action type provider. Use a JSON file with the action definition and UpdateActionType to provide the full structure.
   */
  updateActionType(params: CodePipeline.Types.UpdateActionTypeInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an action type that was created with any supported integration model, where the action type is to be used by customers of the action type provider. Use a JSON file with the action definition and UpdateActionType to provide the full structure.
   */
  updateActionType(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a specified pipeline with edits or changes to its structure. Use a JSON file with the pipeline structure and UpdatePipeline to provide the full structure of the pipeline. Updating the pipeline increases the version number of the pipeline by 1.
   */
  updatePipeline(params: CodePipeline.Types.UpdatePipelineInput, callback?: (err: AWSError, data: CodePipeline.Types.UpdatePipelineOutput) => void): Request<CodePipeline.Types.UpdatePipelineOutput, AWSError>;
  /**
   * Updates a specified pipeline with edits or changes to its structure. Use a JSON file with the pipeline structure and UpdatePipeline to provide the full structure of the pipeline. Updating the pipeline increases the version number of the pipeline by 1.
   */
  updatePipeline(callback?: (err: AWSError, data: CodePipeline.Types.UpdatePipelineOutput) => void): Request<CodePipeline.Types.UpdatePipelineOutput, AWSError>;
}
declare namespace CodePipeline {
  export type AWSRegionName = string;
  export interface AWSSessionCredentials {
    /**
     * The access key for the session.
     */
    accessKeyId: AccessKeyId;
    /**
     * The secret access key for the session.
     */
    secretAccessKey: SecretAccessKey;
    /**
     * The token for the session.
     */
    sessionToken: SessionToken;
  }
  export type AccessKeyId = string;
  export type AccountId = string;
  export interface AcknowledgeJobInput {
    /**
     * The unique system-generated ID of the job for which you want to confirm receipt.
     */
    jobId: JobId;
    /**
     * A system-generated random number that AWS CodePipeline uses to ensure that the job is being worked on by only one job worker. Get this number from the response of the PollForJobs request that returned this job.
     */
    nonce: Nonce;
  }
  export interface AcknowledgeJobOutput {
    /**
     * Whether the job worker has received the specified job.
     */
    status?: JobStatus;
  }
  export interface AcknowledgeThirdPartyJobInput {
    /**
     * The unique system-generated ID of the job.
     */
    jobId: ThirdPartyJobId;
    /**
     * A system-generated random number that AWS CodePipeline uses to ensure that the job is being worked on by only one job worker. Get this number from the response to a GetThirdPartyJobDetails request.
     */
    nonce: Nonce;
    /**
     * The clientToken portion of the clientId and clientToken pair used to verify that the calling entity is allowed access to the job and its details.
     */
    clientToken: ClientToken;
  }
  export interface AcknowledgeThirdPartyJobOutput {
    /**
     * The status information for the third party job, if any.
     */
    status?: JobStatus;
  }
  export type ActionCategory = "Source"|"Build"|"Deploy"|"Test"|"Invoke"|"Approval"|string;
  export interface ActionConfiguration {
    /**
     * The configuration data for the action.
     */
    configuration?: ActionConfigurationMap;
  }
  export type ActionConfigurationKey = string;
  export type ActionConfigurationMap = {[key: string]: ActionConfigurationValue};
  export interface ActionConfigurationProperty {
    /**
     * The name of the action configuration property.
     */
    name: ActionConfigurationKey;
    /**
     * Whether the configuration property is a required value.
     */
    required: Boolean;
    /**
     * Whether the configuration property is a key.
     */
    key: Boolean;
    /**
     * Whether the configuration property is secret. Secrets are hidden from all calls except for GetJobDetails, GetThirdPartyJobDetails, PollForJobs, and PollForThirdPartyJobs. When updating a pipeline, passing * * * * * without changing any other values of the action preserves the previous value of the secret.
     */
    secret: Boolean;
    /**
     * Indicates that the property is used with PollForJobs. When creating a custom action, an action can have up to one queryable property. If it has one, that property must be both required and not secret. If you create a pipeline with a custom action type, and that custom action contains a queryable property, the value for that configuration property is subject to other restrictions. The value must be less than or equal to twenty (20) characters. The value can contain only alphanumeric characters, underscores, and hyphens.
     */
    queryable?: Boolean;
    /**
     * The description of the action configuration property that is displayed to users.
     */
    description?: Description;
    /**
     * The type of the configuration property.
     */
    type?: ActionConfigurationPropertyType;
  }
  export type ActionConfigurationPropertyList = ActionConfigurationProperty[];
  export type ActionConfigurationPropertyType = "String"|"Number"|"Boolean"|string;
  export type ActionConfigurationQueryableValue = string;
  export type ActionConfigurationValue = string;
  export interface ActionContext {
    /**
     * The name of the action in the context of a job.
     */
    name?: ActionName;
    /**
     * The system-generated unique ID that corresponds to an action's execution.
     */
    actionExecutionId?: ActionExecutionId;
  }
  export interface ActionDeclaration {
    /**
     * The action declaration's name.
     */
    name: ActionName;
    /**
     * Specifies the action type and the provider of the action.
     */
    actionTypeId: ActionTypeId;
    /**
     * The order in which actions are run.
     */
    runOrder?: ActionRunOrder;
    /**
     * The action's configuration. These are key-value pairs that specify input values for an action. For more information, see Action Structure Requirements in CodePipeline. For the list of configuration properties for the AWS CloudFormation action type in CodePipeline, see Configuration Properties Reference in the AWS CloudFormation User Guide. For template snippets with examples, see Using Parameter Override Functions with CodePipeline Pipelines in the AWS CloudFormation User Guide. The values can be represented in either JSON or YAML format. For example, the JSON configuration item format is as follows:   JSON:   "Configuration" : { Key : Value }, 
     */
    configuration?: ActionConfigurationMap;
    /**
     * The name or ID of the result of the action declaration, such as a test or build artifact.
     */
    outputArtifacts?: OutputArtifactList;
    /**
     * The name or ID of the artifact consumed by the action, such as a test or build artifact.
     */
    inputArtifacts?: InputArtifactList;
    /**
     * The ARN of the IAM service role that performs the declared action. This is assumed through the roleArn for the pipeline.
     */
    roleArn?: RoleArn;
    /**
     * The action declaration's AWS Region, such as us-east-1.
     */
    region?: AWSRegionName;
    /**
     * The variable namespace associated with the action. All variables produced as output by this action fall under this namespace.
     */
    namespace?: ActionNamespace;
  }
  export interface ActionExecution {
    /**
     * ID of the workflow action execution in the current stage. Use the GetPipelineState action to retrieve the current action execution details of the current stage.  For older executions, this field might be empty. The action execution ID is available for executions run on or after March 2020. 
     */
    actionExecutionId?: ActionExecutionId;
    /**
     * The status of the action, or for a completed action, the last status of the action.
     */
    status?: ActionExecutionStatus;
    /**
     * A summary of the run of the action.
     */
    summary?: ExecutionSummary;
    /**
     * The last status change of the action.
     */
    lastStatusChange?: Timestamp;
    /**
     * The system-generated token used to identify a unique approval request. The token for each open approval request can be obtained using the GetPipelineState command. It is used to validate that the approval request corresponding to this token is still valid.
     */
    token?: ActionExecutionToken;
    /**
     * The ARN of the user who last changed the pipeline.
     */
    lastUpdatedBy?: LastUpdatedBy;
    /**
     * The external ID of the run of the action.
     */
    externalExecutionId?: ExecutionId;
    /**
     * The URL of a resource external to AWS that is used when running the action (for example, an external repository URL).
     */
    externalExecutionUrl?: Url;
    /**
     * A percentage of completeness of the action as it runs.
     */
    percentComplete?: Percentage;
    /**
     * The details of an error returned by a URL external to AWS.
     */
    errorDetails?: ErrorDetails;
  }
  export interface ActionExecutionDetail {
    /**
     * The pipeline execution ID for the action execution.
     */
    pipelineExecutionId?: PipelineExecutionId;
    /**
     * The action execution ID.
     */
    actionExecutionId?: ActionExecutionId;
    /**
     * The version of the pipeline where the action was run.
     */
    pipelineVersion?: PipelineVersion;
    /**
     * The name of the stage that contains the action.
     */
    stageName?: StageName;
    /**
     * The name of the action.
     */
    actionName?: ActionName;
    /**
     * The start time of the action execution.
     */
    startTime?: Timestamp;
    /**
     * The last update time of the action execution.
     */
    lastUpdateTime?: Timestamp;
    /**
     *  The status of the action execution. Status categories are InProgress, Succeeded, and Failed.
     */
    status?: ActionExecutionStatus;
    /**
     * Input details for the action execution, such as role ARN, Region, and input artifacts.
     */
    input?: ActionExecutionInput;
    /**
     * Output details for the action execution, such as the action execution result.
     */
    output?: ActionExecutionOutput;
  }
  export type ActionExecutionDetailList = ActionExecutionDetail[];
  export interface ActionExecutionFilter {
    /**
     * The pipeline execution ID used to filter action execution history.
     */
    pipelineExecutionId?: PipelineExecutionId;
  }
  export type ActionExecutionId = string;
  export interface ActionExecutionInput {
    actionTypeId?: ActionTypeId;
    /**
     * Configuration data for an action execution.
     */
    configuration?: ActionConfigurationMap;
    /**
     * Configuration data for an action execution with all variable references replaced with their real values for the execution.
     */
    resolvedConfiguration?: ResolvedActionConfigurationMap;
    /**
     * The ARN of the IAM service role that performs the declared action. This is assumed through the roleArn for the pipeline. 
     */
    roleArn?: RoleArn;
    /**
     * The AWS Region for the action, such as us-east-1.
     */
    region?: AWSRegionName;
    /**
     * Details of input artifacts of the action that correspond to the action execution.
     */
    inputArtifacts?: ArtifactDetailList;
    /**
     * The variable namespace associated with the action. All variables produced as output by this action fall under this namespace.
     */
    namespace?: ActionNamespace;
  }
  export interface ActionExecutionOutput {
    /**
     * Details of output artifacts of the action that correspond to the action execution.
     */
    outputArtifacts?: ArtifactDetailList;
    /**
     * Execution result information listed in the output details for an action execution.
     */
    executionResult?: ActionExecutionResult;
    /**
     * The outputVariables field shows the key-value pairs that were output as part of that execution.
     */
    outputVariables?: OutputVariablesMap;
  }
  export interface ActionExecutionResult {
    /**
     * The action provider's external ID for the action execution.
     */
    externalExecutionId?: ExternalExecutionId;
    /**
     * The action provider's summary for the action execution.
     */
    externalExecutionSummary?: ExternalExecutionSummary;
    /**
     * The deepest external link to the external resource (for example, a repository URL or deployment endpoint) that is used when running the action.
     */
    externalExecutionUrl?: Url;
  }
  export type ActionExecutionStatus = "InProgress"|"Abandoned"|"Succeeded"|"Failed"|string;
  export type ActionExecutionToken = string;
  export type ActionName = string;
  export type ActionNamespace = string;
  export type ActionOwner = "AWS"|"ThirdParty"|"Custom"|string;
  export type ActionProvider = string;
  export interface ActionRevision {
    /**
     * The system-generated unique ID that identifies the revision number of the action.
     */
    revisionId: Revision;
    /**
     * The unique identifier of the change that set the state to this revision (for example, a deployment ID or timestamp).
     */
    revisionChangeId: RevisionChangeIdentifier;
    /**
     * The date and time when the most recent version of the action was created, in timestamp format.
     */
    created: Timestamp;
  }
  export type ActionRunOrder = number;
  export interface ActionState {
    /**
     * The name of the action.
     */
    actionName?: ActionName;
    /**
     * Represents information about the version (or revision) of an action.
     */
    currentRevision?: ActionRevision;
    /**
     * Represents information about the run of an action.
     */
    latestExecution?: ActionExecution;
    /**
     * A URL link for more information about the state of the action, such as a deployment group details page.
     */
    entityUrl?: Url;
    /**
     * A URL link for more information about the revision, such as a commit details page.
     */
    revisionUrl?: Url;
  }
  export type ActionStateList = ActionState[];
  export interface ActionType {
    /**
     * Represents information about an action type.
     */
    id: ActionTypeId;
    /**
     * The settings for the action type.
     */
    settings?: ActionTypeSettings;
    /**
     * The configuration properties for the action type.
     */
    actionConfigurationProperties?: ActionConfigurationPropertyList;
    /**
     * The details of the input artifact for the action, such as its commit ID.
     */
    inputArtifactDetails: ArtifactDetails;
    /**
     * The details of the output artifact of the action, such as its commit ID.
     */
    outputArtifactDetails: ArtifactDetails;
  }
  export interface ActionTypeArtifactDetails {
    /**
     * The minimum number of artifacts that can be used with the action type. For example, you should specify a minimum and maximum of zero input artifacts for an action type with a category of source.
     */
    minimumCount: MinimumActionTypeArtifactCount;
    /**
     * The maximum number of artifacts that can be used with the actiontype. For example, you should specify a minimum and maximum of zero input artifacts for an action type with a category of source.
     */
    maximumCount: MaximumActionTypeArtifactCount;
  }
  export interface ActionTypeDeclaration {
    /**
     * The description for the action type to be updated.
     */
    description?: ActionTypeDescription;
    /**
     * Information about the executor for an action type that was created with any supported integration model.
     */
    executor: ActionTypeExecutor;
    /**
     * The action category, owner, provider, and version of the action type to be updated.
     */
    id: ActionTypeIdentifier;
    /**
     * Details for the artifacts, such as application files, to be worked on by the action. For example, the minimum and maximum number of input artifacts allowed.
     */
    inputArtifactDetails: ActionTypeArtifactDetails;
    /**
     * Details for the output artifacts, such as a built application, that are the result of the action. For example, the minimum and maximum number of output artifacts allowed.
     */
    outputArtifactDetails: ActionTypeArtifactDetails;
    /**
     * Details identifying the accounts with permissions to use the action type.
     */
    permissions?: ActionTypePermissions;
    /**
     * The properties of the action type to be updated.
     */
    properties?: ActionTypeProperties;
    /**
     * The links associated with the action type to be updated.
     */
    urls?: ActionTypeUrls;
  }
  export type ActionTypeDescription = string;
  export interface ActionTypeExecutor {
    /**
     * The action configuration properties for the action type. These properties are specified in the action definition when the action type is created.
     */
    configuration: ExecutorConfiguration;
    /**
     * The integration model used to create and update the action type, Lambda or JobWorker. 
     */
    type: ExecutorType;
    /**
     * The policy statement that specifies the permissions in the CodePipeline customer’s account that are needed to successfully run an action. To grant permission to another account, specify the account ID as the Principal, a domain-style identifier defined by the service, for example codepipeline.amazonaws.com.  The size of the passed JSON policy document cannot exceed 2048 characters. 
     */
    policyStatementsTemplate?: PolicyStatementsTemplate;
    /**
     * The timeout in seconds for the job. An action execution can have multiple jobs. This is the timeout for a single job, not the entire action execution.
     */
    jobTimeout?: JobTimeout;
  }
  export interface ActionTypeId {
    /**
     * A category defines what kind of action can be taken in the stage, and constrains the provider type for the action. Valid categories are limited to one of the following values.    Source   Build   Test   Deploy   Invoke   Approval  
     */
    category: ActionCategory;
    /**
     * The creator of the action being called. There are three valid values for the Owner field in the action category section within your pipeline structure: AWS, ThirdParty, and Custom. For more information, see Valid Action Types and Providers in CodePipeline.
     */
    owner: ActionOwner;
    /**
     * The provider of the service being called by the action. Valid providers are determined by the action category. For example, an action in the Deploy category type might have a provider of AWS CodeDeploy, which would be specified as CodeDeploy. For more information, see Valid Action Types and Providers in CodePipeline.
     */
    provider: ActionProvider;
    /**
     * A string that describes the action version.
     */
    version: Version;
  }
  export interface ActionTypeIdentifier {
    /**
     * Defines what kind of action can be taken in the stage, one of the following:    Source     Build     Test     Deploy     Approval     Invoke   
     */
    category: ActionCategory;
    /**
     * The creator of the action type being called: AWS or ThirdParty.
     */
    owner: ActionTypeOwner;
    /**
     * The provider of the action type being called. The provider name is supplied when the action type is created.
     */
    provider: ActionProvider;
    /**
     * A string that describes the action type version.
     */
    version: Version;
  }
  export type ActionTypeList = ActionType[];
  export type ActionTypeOwner = string;
  export interface ActionTypePermissions {
    /**
     * A list of AWS account IDs with access to use the action type in their pipelines.
     */
    allowedAccounts: AllowedAccounts;
  }
  export type ActionTypeProperties = ActionTypeProperty[];
  export interface ActionTypeProperty {
    /**
     * The property name that is displayed to users.
     */
    name: ActionConfigurationKey;
    /**
     * Whether the configuration property is an optional value.
     */
    optional: Boolean;
    /**
     * Whether the configuration property is a key.
     */
    key: Boolean;
    /**
     * Whether to omit the field value entered by the customer in the log. If true, the value is not saved in CloudTrail logs for the action execution.
     */
    noEcho: Boolean;
    /**
     * Indicates that the property is used with polling. An action type can have up to one queryable property. If it has one, that property must be both required and not secret.
     */
    queryable?: Boolean;
    /**
     * The description of the property that is displayed to users.
     */
    description?: PropertyDescription;
  }
  export interface ActionTypeSettings {
    /**
     * The URL of a sign-up page where users can sign up for an external service and perform initial configuration of the action provided by that service.
     */
    thirdPartyConfigurationUrl?: Url;
    /**
     * The URL returned to the AWS CodePipeline console that provides a deep link to the resources of the external system, such as the configuration page for an AWS CodeDeploy deployment group. This link is provided as part of the action display in the pipeline.
     */
    entityUrlTemplate?: UrlTemplate;
    /**
     * The URL returned to the AWS CodePipeline console that contains a link to the top-level landing page for the external system, such as the console page for AWS CodeDeploy. This link is shown on the pipeline view page in the AWS CodePipeline console and provides a link to the execution entity of the external action.
     */
    executionUrlTemplate?: UrlTemplate;
    /**
     * The URL returned to the AWS CodePipeline console that contains a link to the page where customers can update or change the configuration of the external action.
     */
    revisionUrlTemplate?: UrlTemplate;
  }
  export interface ActionTypeUrls {
    /**
     * The URL returned to the CodePipeline console that contains a link to the page where customers can configure the external action.
     */
    configurationUrl?: Url;
    /**
     * The URL returned to the CodePipeline console that provides a deep link to the resources of the external system, such as a status page. This link is provided as part of the action display in the pipeline.
     */
    entityUrlTemplate?: UrlTemplate;
    /**
     * The link to an execution page for the action type in progress. For example, for a CodeDeploy action, this link is shown on the pipeline view page in the CodePipeline console, and it links to a CodeDeploy status page.
     */
    executionUrlTemplate?: UrlTemplate;
    /**
     * The URL returned to the CodePipeline console that contains a link to the page where customers can update or change the configuration of the external action.
     */
    revisionUrlTemplate?: UrlTemplate;
  }
  export type AllowedAccount = string;
  export type AllowedAccounts = AllowedAccount[];
  export interface ApprovalResult {
    /**
     * The summary of the current status of the approval request.
     */
    summary: ApprovalSummary;
    /**
     * The response submitted by a reviewer assigned to an approval action request.
     */
    status: ApprovalStatus;
  }
  export type ApprovalStatus = "Approved"|"Rejected"|string;
  export type ApprovalSummary = string;
  export type ApprovalToken = string;
  export interface Artifact {
    /**
     * The artifact's name.
     */
    name?: ArtifactName;
    /**
     * The artifact's revision ID. Depending on the type of object, this could be a commit ID (GitHub) or a revision ID (Amazon S3).
     */
    revision?: Revision;
    /**
     * The location of an artifact.
     */
    location?: ArtifactLocation;
  }
  export interface ArtifactDetail {
    /**
     * The artifact object name for the action execution.
     */
    name?: ArtifactName;
    /**
     * The Amazon S3 artifact location for the action execution.
     */
    s3location?: S3Location;
  }
  export type ArtifactDetailList = ArtifactDetail[];
  export interface ArtifactDetails {
    /**
     * The minimum number of artifacts allowed for the action type.
     */
    minimumCount: MinimumArtifactCount;
    /**
     * The maximum number of artifacts allowed for the action type.
     */
    maximumCount: MaximumArtifactCount;
  }
  export type ArtifactList = Artifact[];
  export interface ArtifactLocation {
    /**
     * The type of artifact in the location.
     */
    type?: ArtifactLocationType;
    /**
     * The S3 bucket that contains the artifact.
     */
    s3Location?: S3ArtifactLocation;
  }
  export type ArtifactLocationType = "S3"|string;
  export type ArtifactName = string;
  export interface ArtifactRevision {
    /**
     * The name of an artifact. This name might be system-generated, such as "MyApp", or defined by the user when an action is created.
     */
    name?: ArtifactName;
    /**
     * The revision ID of the artifact.
     */
    revisionId?: Revision;
    /**
     * An additional identifier for a revision, such as a commit date or, for artifacts stored in Amazon S3 buckets, the ETag value.
     */
    revisionChangeIdentifier?: RevisionChangeIdentifier;
    /**
     * Summary information about the most recent revision of the artifact. For GitHub and AWS CodeCommit repositories, the commit message. For Amazon S3 buckets or actions, the user-provided content of a codepipeline-artifact-revision-summary key specified in the object metadata.
     */
    revisionSummary?: RevisionSummary;
    /**
     * The date and time when the most recent revision of the artifact was created, in timestamp format.
     */
    created?: Timestamp;
    /**
     * The commit ID for the artifact revision. For artifacts stored in GitHub or AWS CodeCommit repositories, the commit ID is linked to a commit details page.
     */
    revisionUrl?: Url;
  }
  export type ArtifactRevisionList = ArtifactRevision[];
  export interface ArtifactStore {
    /**
     * The type of the artifact store, such as S3.
     */
    type: ArtifactStoreType;
    /**
     * The S3 bucket used for storing the artifacts for a pipeline. You can specify the name of an S3 bucket but not a folder in the bucket. A folder to contain the pipeline artifacts is created for you based on the name of the pipeline. You can use any S3 bucket in the same AWS Region as the pipeline to store your pipeline artifacts.
     */
    location: ArtifactStoreLocation;
    /**
     * The encryption key used to encrypt the data in the artifact store, such as an AWS Key Management Service (AWS KMS) key. If this is undefined, the default key for Amazon S3 is used.
     */
    encryptionKey?: EncryptionKey;
  }
  export type ArtifactStoreLocation = string;
  export type ArtifactStoreMap = {[key: string]: ArtifactStore};
  export type ArtifactStoreType = "S3"|string;
  export interface BlockerDeclaration {
    /**
     * Reserved for future use.
     */
    name: BlockerName;
    /**
     * Reserved for future use.
     */
    type: BlockerType;
  }
  export type BlockerName = string;
  export type BlockerType = "Schedule"|string;
  export type Boolean = boolean;
  export type ClientId = string;
  export type ClientRequestToken = string;
  export type ClientToken = string;
  export type Code = string;
  export type ContinuationToken = string;
  export interface CreateCustomActionTypeInput {
    /**
     * The category of the custom action, such as a build action or a test action.
     */
    category: ActionCategory;
    /**
     * The provider of the service used in the custom action, such as AWS CodeDeploy.
     */
    provider: ActionProvider;
    /**
     * The version identifier of the custom action.
     */
    version: Version;
    /**
     * URLs that provide users information about this custom action.
     */
    settings?: ActionTypeSettings;
    /**
     * The configuration properties for the custom action.  You can refer to a name in the configuration properties of the custom action within the URL templates by following the format of {Config:name}, as long as the configuration property is both required and not secret. For more information, see Create a Custom Action for a Pipeline. 
     */
    configurationProperties?: ActionConfigurationPropertyList;
    /**
     * The details of the input artifact for the action, such as its commit ID.
     */
    inputArtifactDetails: ArtifactDetails;
    /**
     * The details of the output artifact of the action, such as its commit ID.
     */
    outputArtifactDetails: ArtifactDetails;
    /**
     * The tags for the custom action.
     */
    tags?: TagList;
  }
  export interface CreateCustomActionTypeOutput {
    /**
     * Returns information about the details of an action type.
     */
    actionType: ActionType;
    /**
     * Specifies the tags applied to the custom action.
     */
    tags?: TagList;
  }
  export interface CreatePipelineInput {
    /**
     * Represents the structure of actions and stages to be performed in the pipeline. 
     */
    pipeline: PipelineDeclaration;
    /**
     * The tags for the pipeline.
     */
    tags?: TagList;
  }
  export interface CreatePipelineOutput {
    /**
     * Represents the structure of actions and stages to be performed in the pipeline. 
     */
    pipeline?: PipelineDeclaration;
    /**
     * Specifies the tags applied to the pipeline.
     */
    tags?: TagList;
  }
  export interface CurrentRevision {
    /**
     * The revision ID of the current version of an artifact.
     */
    revision: Revision;
    /**
     * The change identifier for the current revision.
     */
    changeIdentifier: RevisionChangeIdentifier;
    /**
     * The date and time when the most recent revision of the artifact was created, in timestamp format.
     */
    created?: Time;
    /**
     * The summary of the most recent revision of the artifact.
     */
    revisionSummary?: RevisionSummary;
  }
  export interface DeleteCustomActionTypeInput {
    /**
     * The category of the custom action that you want to delete, such as source or deploy.
     */
    category: ActionCategory;
    /**
     * The provider of the service used in the custom action, such as AWS CodeDeploy.
     */
    provider: ActionProvider;
    /**
     * The version of the custom action to delete.
     */
    version: Version;
  }
  export interface DeletePipelineInput {
    /**
     * The name of the pipeline to be deleted.
     */
    name: PipelineName;
  }
  export interface DeleteWebhookInput {
    /**
     * The name of the webhook you want to delete.
     */
    name: WebhookName;
  }
  export interface DeleteWebhookOutput {
  }
  export interface DeregisterWebhookWithThirdPartyInput {
    /**
     * The name of the webhook you want to deregister.
     */
    webhookName?: WebhookName;
  }
  export interface DeregisterWebhookWithThirdPartyOutput {
  }
  export type Description = string;
  export interface DisableStageTransitionInput {
    /**
     * The name of the pipeline in which you want to disable the flow of artifacts from one stage to another.
     */
    pipelineName: PipelineName;
    /**
     * The name of the stage where you want to disable the inbound or outbound transition of artifacts.
     */
    stageName: StageName;
    /**
     * Specifies whether artifacts are prevented from transitioning into the stage and being processed by the actions in that stage (inbound), or prevented from transitioning from the stage after they have been processed by the actions in that stage (outbound).
     */
    transitionType: StageTransitionType;
    /**
     * The reason given to the user that a stage is disabled, such as waiting for manual approval or manual tests. This message is displayed in the pipeline console UI.
     */
    reason: DisabledReason;
  }
  export type DisabledReason = string;
  export interface EnableStageTransitionInput {
    /**
     * The name of the pipeline in which you want to enable the flow of artifacts from one stage to another.
     */
    pipelineName: PipelineName;
    /**
     * The name of the stage where you want to enable the transition of artifacts, either into the stage (inbound) or from that stage to the next stage (outbound).
     */
    stageName: StageName;
    /**
     * Specifies whether artifacts are allowed to enter the stage and be processed by the actions in that stage (inbound) or whether already processed artifacts are allowed to transition to the next stage (outbound).
     */
    transitionType: StageTransitionType;
  }
  export type Enabled = boolean;
  export interface EncryptionKey {
    /**
     * The ID used to identify the key. For an AWS KMS key, you can use the key ID, the key ARN, or the alias ARN.  Aliases are recognized only in the account that created the customer master key (CMK). For cross-account actions, you can only use the key ID or key ARN to identify the key. 
     */
    id: EncryptionKeyId;
    /**
     * The type of encryption key, such as an AWS Key Management Service (AWS KMS) key. When creating or updating a pipeline, the value must be set to 'KMS'.
     */
    type: EncryptionKeyType;
  }
  export type EncryptionKeyId = string;
  export type EncryptionKeyType = "KMS"|string;
  export interface ErrorDetails {
    /**
     * The system ID or number code of the error.
     */
    code?: Code;
    /**
     * The text of the error message.
     */
    message?: Message;
  }
  export interface ExecutionDetails {
    /**
     * The summary of the current status of the actions.
     */
    summary?: ExecutionSummary;
    /**
     * The system-generated unique ID of this action used to identify this job worker in any external systems, such as AWS CodeDeploy.
     */
    externalExecutionId?: ExecutionId;
    /**
     * The percentage of work completed on the action, represented on a scale of 0 to 100 percent.
     */
    percentComplete?: Percentage;
  }
  export type ExecutionId = string;
  export type ExecutionSummary = string;
  export interface ExecutionTrigger {
    /**
     * The type of change-detection method, command, or user interaction that started a pipeline execution.
     */
    triggerType?: TriggerType;
    /**
     * Detail related to the event that started a pipeline execution, such as the webhook ARN of the webhook that triggered the pipeline execution or the user ARN for a user-initiated start-pipeline-execution CLI command.
     */
    triggerDetail?: TriggerDetail;
  }
  export interface ExecutorConfiguration {
    /**
     * Details about the Lambda executor of the action type.
     */
    lambdaExecutorConfiguration?: LambdaExecutorConfiguration;
    /**
     * Details about the JobWorker executor of the action type.
     */
    jobWorkerExecutorConfiguration?: JobWorkerExecutorConfiguration;
  }
  export type ExecutorType = "JobWorker"|"Lambda"|string;
  export type ExternalExecutionId = string;
  export type ExternalExecutionSummary = string;
  export interface FailureDetails {
    /**
     * The type of the failure.
     */
    type: FailureType;
    /**
     * The message about the failure.
     */
    message: Message;
    /**
     * The external ID of the run of the action that failed.
     */
    externalExecutionId?: ExecutionId;
  }
  export type FailureType = "JobFailed"|"ConfigurationError"|"PermissionError"|"RevisionOutOfSync"|"RevisionUnavailable"|"SystemUnavailable"|string;
  export interface GetActionTypeInput {
    /**
     * Defines what kind of action can be taken in the stage. The following are the valid values:    Source     Build     Test     Deploy     Approval     Invoke   
     */
    category: ActionCategory;
    /**
     * The creator of an action type that was created with any supported integration model. There are two valid values: AWS and ThirdParty.
     */
    owner: ActionTypeOwner;
    /**
     * The provider of the action type being called. The provider name is specified when the action type is created.
     */
    provider: ActionProvider;
    /**
     * A string that describes the action type version.
     */
    version: Version;
  }
  export interface GetActionTypeOutput {
    /**
     * The action type information for the requested action type, such as the action type ID.
     */
    actionType?: ActionTypeDeclaration;
  }
  export interface GetJobDetailsInput {
    /**
     * The unique system-generated ID for the job.
     */
    jobId: JobId;
  }
  export interface GetJobDetailsOutput {
    /**
     * The details of the job.  If AWSSessionCredentials is used, a long-running job can call GetJobDetails again to obtain new credentials. 
     */
    jobDetails?: JobDetails;
  }
  export interface GetPipelineExecutionInput {
    /**
     * The name of the pipeline about which you want to get execution details.
     */
    pipelineName: PipelineName;
    /**
     * The ID of the pipeline execution about which you want to get execution details.
     */
    pipelineExecutionId: PipelineExecutionId;
  }
  export interface GetPipelineExecutionOutput {
    /**
     * Represents information about the execution of a pipeline.
     */
    pipelineExecution?: PipelineExecution;
  }
  export interface GetPipelineInput {
    /**
     * The name of the pipeline for which you want to get information. Pipeline names must be unique under an AWS user account.
     */
    name: PipelineName;
    /**
     * The version number of the pipeline. If you do not specify a version, defaults to the current version.
     */
    version?: PipelineVersion;
  }
  export interface GetPipelineOutput {
    /**
     * Represents the structure of actions and stages to be performed in the pipeline. 
     */
    pipeline?: PipelineDeclaration;
    /**
     * Represents the pipeline metadata information returned as part of the output of a GetPipeline action.
     */
    metadata?: PipelineMetadata;
  }
  export interface GetPipelineStateInput {
    /**
     * The name of the pipeline about which you want to get information.
     */
    name: PipelineName;
  }
  export interface GetPipelineStateOutput {
    /**
     * The name of the pipeline for which you want to get the state.
     */
    pipelineName?: PipelineName;
    /**
     * The version number of the pipeline.  A newly created pipeline is always assigned a version number of 1. 
     */
    pipelineVersion?: PipelineVersion;
    /**
     * A list of the pipeline stage output information, including stage name, state, most recent run details, whether the stage is disabled, and other data.
     */
    stageStates?: StageStateList;
    /**
     * The date and time the pipeline was created, in timestamp format.
     */
    created?: Timestamp;
    /**
     * The date and time the pipeline was last updated, in timestamp format.
     */
    updated?: Timestamp;
  }
  export interface GetThirdPartyJobDetailsInput {
    /**
     * The unique system-generated ID used for identifying the job.
     */
    jobId: ThirdPartyJobId;
    /**
     * The clientToken portion of the clientId and clientToken pair used to verify that the calling entity is allowed access to the job and its details.
     */
    clientToken: ClientToken;
  }
  export interface GetThirdPartyJobDetailsOutput {
    /**
     * The details of the job, including any protected values defined for the job.
     */
    jobDetails?: ThirdPartyJobDetails;
  }
  export interface InputArtifact {
    /**
     * The name of the artifact to be worked on (for example, "My App"). The input artifact of an action must exactly match the output artifact declared in a preceding action, but the input artifact does not have to be the next action in strict sequence from the action that provided the output artifact. Actions in parallel can declare different output artifacts, which are in turn consumed by different following actions.
     */
    name: ArtifactName;
  }
  export type InputArtifactList = InputArtifact[];
  export interface Job {
    /**
     * The unique system-generated ID of the job.
     */
    id?: JobId;
    /**
     * Other data about a job.
     */
    data?: JobData;
    /**
     * A system-generated random number that AWS CodePipeline uses to ensure that the job is being worked on by only one job worker. Use this number in an AcknowledgeJob request.
     */
    nonce?: Nonce;
    /**
     * The ID of the AWS account to use when performing the job.
     */
    accountId?: AccountId;
  }
  export interface JobData {
    /**
     * Represents information about an action type.
     */
    actionTypeId?: ActionTypeId;
    /**
     * Represents information about an action configuration.
     */
    actionConfiguration?: ActionConfiguration;
    /**
     * Represents information about a pipeline to a job worker.  Includes pipelineArn and pipelineExecutionId for custom jobs. 
     */
    pipelineContext?: PipelineContext;
    /**
     * The artifact supplied to the job.
     */
    inputArtifacts?: ArtifactList;
    /**
     * The output of the job.
     */
    outputArtifacts?: ArtifactList;
    /**
     * Represents an AWS session credentials object. These credentials are temporary credentials that are issued by AWS Secure Token Service (STS). They can be used to access input and output artifacts in the S3 bucket used to store artifacts for the pipeline in AWS CodePipeline.
     */
    artifactCredentials?: AWSSessionCredentials;
    /**
     * A system-generated token, such as a AWS CodeDeploy deployment ID, required by a job to continue the job asynchronously.
     */
    continuationToken?: ContinuationToken;
    /**
     * Represents information about the key used to encrypt data in the artifact store, such as an AWS Key Management Service (AWS KMS) key. 
     */
    encryptionKey?: EncryptionKey;
  }
  export interface JobDetails {
    /**
     * The unique system-generated ID of the job.
     */
    id?: JobId;
    /**
     * Represents other information about a job required for a job worker to complete the job. 
     */
    data?: JobData;
    /**
     * The AWS account ID associated with the job.
     */
    accountId?: AccountId;
  }
  export type JobId = string;
  export type JobList = Job[];
  export type JobStatus = "Created"|"Queued"|"Dispatched"|"InProgress"|"TimedOut"|"Succeeded"|"Failed"|string;
  export type JobTimeout = number;
  export interface JobWorkerExecutorConfiguration {
    /**
     * The accounts in which the job worker is configured and might poll for jobs as part of the action execution.
     */
    pollingAccounts?: PollingAccountList;
    /**
     * The service Principals in which the job worker is configured and might poll for jobs as part of the action execution.
     */
    pollingServicePrincipals?: PollingServicePrincipalList;
  }
  export type JsonPath = string;
  export interface LambdaExecutorConfiguration {
    /**
     * The ARN of the Lambda function used by the action engine.
     */
    lambdaFunctionArn: LambdaFunctionArn;
  }
  export type LambdaFunctionArn = string;
  export type LastChangedAt = Date;
  export type LastChangedBy = string;
  export type LastUpdatedBy = string;
  export interface ListActionExecutionsInput {
    /**
     *  The name of the pipeline for which you want to list action execution history.
     */
    pipelineName: PipelineName;
    /**
     * Input information used to filter action execution history.
     */
    filter?: ActionExecutionFilter;
    /**
     * The maximum number of results to return in a single call. To retrieve the remaining results, make another call with the returned nextToken value. Action execution history is retained for up to 12 months, based on action execution start times. Default value is 100.   Detailed execution history is available for executions run on or after February 21, 2019. 
     */
    maxResults?: MaxResults;
    /**
     * The token that was returned from the previous ListActionExecutions call, which can be used to return the next set of action executions in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListActionExecutionsOutput {
    /**
     * The details for a list of recent executions, such as action execution ID.
     */
    actionExecutionDetails?: ActionExecutionDetailList;
    /**
     * If the amount of returned information is significantly large, an identifier is also returned and can be used in a subsequent ListActionExecutions call to return the next set of action executions in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListActionTypesInput {
    /**
     * Filters the list of action types to those created by a specified entity.
     */
    actionOwnerFilter?: ActionOwner;
    /**
     * An identifier that was returned from the previous list action types call, which can be used to return the next set of action types in the list.
     */
    nextToken?: NextToken;
    /**
     * The Region to filter on for the list of action types.
     */
    regionFilter?: AWSRegionName;
  }
  export interface ListActionTypesOutput {
    /**
     * Provides details of the action types.
     */
    actionTypes: ActionTypeList;
    /**
     * If the amount of returned information is significantly large, an identifier is also returned. It can be used in a subsequent list action types call to return the next set of action types in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListPipelineExecutionsInput {
    /**
     * The name of the pipeline for which you want to get execution summary information.
     */
    pipelineName: PipelineName;
    /**
     * The maximum number of results to return in a single call. To retrieve the remaining results, make another call with the returned nextToken value. Pipeline history is limited to the most recent 12 months, based on pipeline execution start times. Default value is 100.
     */
    maxResults?: MaxResults;
    /**
     * The token that was returned from the previous ListPipelineExecutions call, which can be used to return the next set of pipeline executions in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListPipelineExecutionsOutput {
    /**
     * A list of executions in the history of a pipeline.
     */
    pipelineExecutionSummaries?: PipelineExecutionSummaryList;
    /**
     * A token that can be used in the next ListPipelineExecutions call. To view all items in the list, continue to call this operation with each subsequent token until no more nextToken values are returned.
     */
    nextToken?: NextToken;
  }
  export interface ListPipelinesInput {
    /**
     * An identifier that was returned from the previous list pipelines call. It can be used to return the next set of pipelines in the list.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of pipelines to return in a single call. To retrieve the remaining pipelines, make another call with the returned nextToken value. The minimum value you can specify is 1. The maximum accepted value is 1000.
     */
    maxResults?: MaxPipelines;
  }
  export interface ListPipelinesOutput {
    /**
     * The list of pipelines.
     */
    pipelines?: PipelineList;
    /**
     * If the amount of returned information is significantly large, an identifier is also returned. It can be used in a subsequent list pipelines call to return the next set of pipelines in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource to get tags for.
     */
    resourceArn: ResourceArn;
    /**
     * The token that was returned from the previous API call, which would be used to return the next page of the list. The ListTagsforResource call lists all available tags in one call and does not use pagination.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in a single call.
     */
    maxResults?: MaxResults;
  }
  export interface ListTagsForResourceOutput {
    /**
     * The tags for the resource.
     */
    tags?: TagList;
    /**
     * If the amount of returned information is significantly large, an identifier is also returned and can be used in a subsequent API call to return the next page of the list. The ListTagsforResource call lists all available tags in one call and does not use pagination.
     */
    nextToken?: NextToken;
  }
  export interface ListWebhookItem {
    /**
     * The detail returned for each webhook, such as the webhook authentication type and filter rules.
     */
    definition: WebhookDefinition;
    /**
     * A unique URL generated by CodePipeline. When a POST request is made to this URL, the defined pipeline is started as long as the body of the post request satisfies the defined authentication and filtering conditions. Deleting and re-creating a webhook makes the old URL invalid and generates a new one.
     */
    url: WebhookUrl;
    /**
     * The text of the error message about the webhook.
     */
    errorMessage?: WebhookErrorMessage;
    /**
     * The number code of the error.
     */
    errorCode?: WebhookErrorCode;
    /**
     * The date and time a webhook was last successfully triggered, in timestamp format.
     */
    lastTriggered?: WebhookLastTriggered;
    /**
     * The Amazon Resource Name (ARN) of the webhook.
     */
    arn?: WebhookArn;
    /**
     * Specifies the tags applied to the webhook.
     */
    tags?: TagList;
  }
  export interface ListWebhooksInput {
    /**
     * The token that was returned from the previous ListWebhooks call, which can be used to return the next set of webhooks in the list.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return in a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: MaxResults;
  }
  export interface ListWebhooksOutput {
    /**
     * The JSON detail returned for each webhook in the list output for the ListWebhooks call.
     */
    webhooks?: WebhookList;
    /**
     * If the amount of returned information is significantly large, an identifier is also returned and can be used in a subsequent ListWebhooks call to return the next set of webhooks in the list. 
     */
    NextToken?: NextToken;
  }
  export type MatchEquals = string;
  export type MaxBatchSize = number;
  export type MaxPipelines = number;
  export type MaxResults = number;
  export type MaximumActionTypeArtifactCount = number;
  export type MaximumArtifactCount = number;
  export type Message = string;
  export type MinimumActionTypeArtifactCount = number;
  export type MinimumArtifactCount = number;
  export type NextToken = string;
  export type Nonce = string;
  export interface OutputArtifact {
    /**
     * The name of the output of an artifact, such as "My App". The input artifact of an action must exactly match the output artifact declared in a preceding action, but the input artifact does not have to be the next action in strict sequence from the action that provided the output artifact. Actions in parallel can declare different output artifacts, which are in turn consumed by different following actions. Output artifact names must be unique within a pipeline.
     */
    name: ArtifactName;
  }
  export type OutputArtifactList = OutputArtifact[];
  export type OutputVariablesKey = string;
  export type OutputVariablesMap = {[key: string]: OutputVariablesValue};
  export type OutputVariablesValue = string;
  export type Percentage = number;
  export type PipelineArn = string;
  export interface PipelineContext {
    /**
     * The name of the pipeline. This is a user-specified value. Pipeline names must be unique across all pipeline names under an Amazon Web Services account.
     */
    pipelineName?: PipelineName;
    /**
     * The stage of the pipeline.
     */
    stage?: StageContext;
    /**
     * The context of an action to a job worker in the stage of a pipeline.
     */
    action?: ActionContext;
    /**
     * The Amazon Resource Name (ARN) of the pipeline.
     */
    pipelineArn?: PipelineArn;
    /**
     * The execution ID of the pipeline.
     */
    pipelineExecutionId?: PipelineExecutionId;
  }
  export interface PipelineDeclaration {
    /**
     * The name of the pipeline.
     */
    name: PipelineName;
    /**
     * The Amazon Resource Name (ARN) for AWS CodePipeline to use to either perform actions with no actionRoleArn, or to use to assume roles for actions with an actionRoleArn.
     */
    roleArn: RoleArn;
    /**
     * Represents information about the S3 bucket where artifacts are stored for the pipeline.  You must include either artifactStore or artifactStores in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use artifactStores. 
     */
    artifactStore?: ArtifactStore;
    /**
     * A mapping of artifactStore objects and their corresponding AWS Regions. There must be an artifact store for the pipeline Region and for each cross-region action in the pipeline.  You must include either artifactStore or artifactStores in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use artifactStores. 
     */
    artifactStores?: ArtifactStoreMap;
    /**
     * The stage in which to perform the action.
     */
    stages: PipelineStageDeclarationList;
    /**
     * The version number of the pipeline. A new pipeline always has a version number of 1. This number is incremented when a pipeline is updated.
     */
    version?: PipelineVersion;
  }
  export interface PipelineExecution {
    /**
     * The name of the pipeline with the specified pipeline execution.
     */
    pipelineName?: PipelineName;
    /**
     * The version number of the pipeline with the specified pipeline execution.
     */
    pipelineVersion?: PipelineVersion;
    /**
     * The ID of the pipeline execution.
     */
    pipelineExecutionId?: PipelineExecutionId;
    /**
     * The status of the pipeline execution.   Cancelled: The pipeline’s definition was updated before the pipeline execution could be completed.   InProgress: The pipeline execution is currently running.   Stopped: The pipeline execution was manually stopped. For more information, see Stopped Executions.   Stopping: The pipeline execution received a request to be manually stopped. Depending on the selected stop mode, the execution is either completing or abandoning in-progress actions. For more information, see Stopped Executions.   Succeeded: The pipeline execution was completed successfully.    Superseded: While this pipeline execution was waiting for the next stage to be completed, a newer pipeline execution advanced and continued through the pipeline instead. For more information, see Superseded Executions.   Failed: The pipeline execution was not completed successfully.  
     */
    status?: PipelineExecutionStatus;
    /**
     * A summary that contains a description of the pipeline execution status.
     */
    statusSummary?: PipelineExecutionStatusSummary;
    /**
     * A list of ArtifactRevision objects included in a pipeline execution.
     */
    artifactRevisions?: ArtifactRevisionList;
  }
  export type PipelineExecutionId = string;
  export type PipelineExecutionStatus = "Cancelled"|"InProgress"|"Stopped"|"Stopping"|"Succeeded"|"Superseded"|"Failed"|string;
  export type PipelineExecutionStatusSummary = string;
  export interface PipelineExecutionSummary {
    /**
     * The ID of the pipeline execution.
     */
    pipelineExecutionId?: PipelineExecutionId;
    /**
     * The status of the pipeline execution.   InProgress: The pipeline execution is currently running.   Stopped: The pipeline execution was manually stopped. For more information, see Stopped Executions.   Stopping: The pipeline execution received a request to be manually stopped. Depending on the selected stop mode, the execution is either completing or abandoning in-progress actions. For more information, see Stopped Executions.   Succeeded: The pipeline execution was completed successfully.    Superseded: While this pipeline execution was waiting for the next stage to be completed, a newer pipeline execution advanced and continued through the pipeline instead. For more information, see Superseded Executions.   Failed: The pipeline execution was not completed successfully.  
     */
    status?: PipelineExecutionStatus;
    /**
     * The date and time when the pipeline execution began, in timestamp format.
     */
    startTime?: Timestamp;
    /**
     * The date and time of the last change to the pipeline execution, in timestamp format.
     */
    lastUpdateTime?: Timestamp;
    /**
     * A list of the source artifact revisions that initiated a pipeline execution.
     */
    sourceRevisions?: SourceRevisionList;
    /**
     * The interaction or event that started a pipeline execution, such as automated change detection or a StartPipelineExecution API call.
     */
    trigger?: ExecutionTrigger;
    /**
     * The interaction that stopped a pipeline execution.
     */
    stopTrigger?: StopExecutionTrigger;
  }
  export type PipelineExecutionSummaryList = PipelineExecutionSummary[];
  export type PipelineList = PipelineSummary[];
  export interface PipelineMetadata {
    /**
     * The Amazon Resource Name (ARN) of the pipeline.
     */
    pipelineArn?: PipelineArn;
    /**
     * The date and time the pipeline was created, in timestamp format.
     */
    created?: Timestamp;
    /**
     * The date and time the pipeline was last updated, in timestamp format.
     */
    updated?: Timestamp;
  }
  export type PipelineName = string;
  export type PipelineStageDeclarationList = StageDeclaration[];
  export interface PipelineSummary {
    /**
     * The name of the pipeline.
     */
    name?: PipelineName;
    /**
     * The version number of the pipeline.
     */
    version?: PipelineVersion;
    /**
     * The date and time the pipeline was created, in timestamp format.
     */
    created?: Timestamp;
    /**
     * The date and time of the last update to the pipeline, in timestamp format.
     */
    updated?: Timestamp;
  }
  export type PipelineVersion = number;
  export type PolicyStatementsTemplate = string;
  export interface PollForJobsInput {
    /**
     * Represents information about an action type.
     */
    actionTypeId: ActionTypeId;
    /**
     * The maximum number of jobs to return in a poll for jobs call.
     */
    maxBatchSize?: MaxBatchSize;
    /**
     * A map of property names and values. For an action type with no queryable properties, this value must be null or an empty map. For an action type with a queryable property, you must supply that property as a key in the map. Only jobs whose action configuration matches the mapped value are returned.
     */
    queryParam?: QueryParamMap;
  }
  export interface PollForJobsOutput {
    /**
     * Information about the jobs to take action on.
     */
    jobs?: JobList;
  }
  export interface PollForThirdPartyJobsInput {
    /**
     * Represents information about an action type.
     */
    actionTypeId: ActionTypeId;
    /**
     * The maximum number of jobs to return in a poll for jobs call.
     */
    maxBatchSize?: MaxBatchSize;
  }
  export interface PollForThirdPartyJobsOutput {
    /**
     * Information about the jobs to take action on.
     */
    jobs?: ThirdPartyJobList;
  }
  export type PollingAccountList = AccountId[];
  export type PollingServicePrincipalList = ServicePrincipal[];
  export type PropertyDescription = string;
  export interface PutActionRevisionInput {
    /**
     * The name of the pipeline that starts processing the revision to the source.
     */
    pipelineName: PipelineName;
    /**
     * The name of the stage that contains the action that acts on the revision.
     */
    stageName: StageName;
    /**
     * The name of the action that processes the revision.
     */
    actionName: ActionName;
    /**
     * Represents information about the version (or revision) of an action.
     */
    actionRevision: ActionRevision;
  }
  export interface PutActionRevisionOutput {
    /**
     * Indicates whether the artifact revision was previously used in an execution of the specified pipeline.
     */
    newRevision?: Boolean;
    /**
     * The ID of the current workflow state of the pipeline.
     */
    pipelineExecutionId?: PipelineExecutionId;
  }
  export interface PutApprovalResultInput {
    /**
     * The name of the pipeline that contains the action. 
     */
    pipelineName: PipelineName;
    /**
     * The name of the stage that contains the action.
     */
    stageName: StageName;
    /**
     * The name of the action for which approval is requested.
     */
    actionName: ActionName;
    /**
     * Represents information about the result of the approval request.
     */
    result: ApprovalResult;
    /**
     * The system-generated token used to identify a unique approval request. The token for each open approval request can be obtained using the GetPipelineState action. It is used to validate that the approval request corresponding to this token is still valid.
     */
    token: ApprovalToken;
  }
  export interface PutApprovalResultOutput {
    /**
     * The timestamp showing when the approval or rejection was submitted.
     */
    approvedAt?: Timestamp;
  }
  export interface PutJobFailureResultInput {
    /**
     * The unique system-generated ID of the job that failed. This is the same ID returned from PollForJobs.
     */
    jobId: JobId;
    /**
     * The details about the failure of a job.
     */
    failureDetails: FailureDetails;
  }
  export interface PutJobSuccessResultInput {
    /**
     * The unique system-generated ID of the job that succeeded. This is the same ID returned from PollForJobs.
     */
    jobId: JobId;
    /**
     * The ID of the current revision of the artifact successfully worked on by the job.
     */
    currentRevision?: CurrentRevision;
    /**
     * A token generated by a job worker, such as an AWS CodeDeploy deployment ID, that a successful job provides to identify a custom action in progress. Future jobs use this token to identify the running instance of the action. It can be reused to return more information about the progress of the custom action. When the action is complete, no continuation token should be supplied.
     */
    continuationToken?: ContinuationToken;
    /**
     * The execution details of the successful job, such as the actions taken by the job worker.
     */
    executionDetails?: ExecutionDetails;
    /**
     * Key-value pairs produced as output by a job worker that can be made available to a downstream action configuration. outputVariables can be included only when there is no continuation token on the request.
     */
    outputVariables?: OutputVariablesMap;
  }
  export interface PutThirdPartyJobFailureResultInput {
    /**
     * The ID of the job that failed. This is the same ID returned from PollForThirdPartyJobs.
     */
    jobId: ThirdPartyJobId;
    /**
     * The clientToken portion of the clientId and clientToken pair used to verify that the calling entity is allowed access to the job and its details.
     */
    clientToken: ClientToken;
    /**
     * Represents information about failure details.
     */
    failureDetails: FailureDetails;
  }
  export interface PutThirdPartyJobSuccessResultInput {
    /**
     * The ID of the job that successfully completed. This is the same ID returned from PollForThirdPartyJobs.
     */
    jobId: ThirdPartyJobId;
    /**
     * The clientToken portion of the clientId and clientToken pair used to verify that the calling entity is allowed access to the job and its details.
     */
    clientToken: ClientToken;
    /**
     * Represents information about a current revision.
     */
    currentRevision?: CurrentRevision;
    /**
     * A token generated by a job worker, such as an AWS CodeDeploy deployment ID, that a successful job provides to identify a partner action in progress. Future jobs use this token to identify the running instance of the action. It can be reused to return more information about the progress of the partner action. When the action is complete, no continuation token should be supplied.
     */
    continuationToken?: ContinuationToken;
    /**
     * The details of the actions taken and results produced on an artifact as it passes through stages in the pipeline. 
     */
    executionDetails?: ExecutionDetails;
  }
  export interface PutWebhookInput {
    /**
     * The detail provided in an input file to create the webhook, such as the webhook name, the pipeline name, and the action name. Give the webhook a unique name that helps you identify it. You might name the webhook after the pipeline and action it targets so that you can easily recognize what it's used for later.
     */
    webhook: WebhookDefinition;
    /**
     * The tags for the webhook.
     */
    tags?: TagList;
  }
  export interface PutWebhookOutput {
    /**
     * The detail returned from creating the webhook, such as the webhook name, webhook URL, and webhook ARN.
     */
    webhook?: ListWebhookItem;
  }
  export type QueryParamMap = {[key: string]: ActionConfigurationQueryableValue};
  export interface RegisterWebhookWithThirdPartyInput {
    /**
     * The name of an existing webhook created with PutWebhook to register with a supported third party. 
     */
    webhookName?: WebhookName;
  }
  export interface RegisterWebhookWithThirdPartyOutput {
  }
  export type ResolvedActionConfigurationMap = {[key: string]: String};
  export type ResourceArn = string;
  export interface RetryStageExecutionInput {
    /**
     * The name of the pipeline that contains the failed stage.
     */
    pipelineName: PipelineName;
    /**
     * The name of the failed stage to be retried.
     */
    stageName: StageName;
    /**
     * The ID of the pipeline execution in the failed stage to be retried. Use the GetPipelineState action to retrieve the current pipelineExecutionId of the failed stage
     */
    pipelineExecutionId: PipelineExecutionId;
    /**
     * The scope of the retry attempt. Currently, the only supported value is FAILED_ACTIONS.
     */
    retryMode: StageRetryMode;
  }
  export interface RetryStageExecutionOutput {
    /**
     * The ID of the current workflow execution in the failed stage.
     */
    pipelineExecutionId?: PipelineExecutionId;
  }
  export type Revision = string;
  export type RevisionChangeIdentifier = string;
  export type RevisionSummary = string;
  export type RoleArn = string;
  export interface S3ArtifactLocation {
    /**
     * The name of the S3 bucket.
     */
    bucketName: S3BucketName;
    /**
     * The key of the object in the S3 bucket, which uniquely identifies the object in the bucket.
     */
    objectKey: S3ObjectKey;
  }
  export type S3Bucket = string;
  export type S3BucketName = string;
  export type S3Key = string;
  export interface S3Location {
    /**
     * The Amazon S3 artifact bucket for an action's artifacts.
     */
    bucket?: S3Bucket;
    /**
     * The artifact name.
     */
    key?: S3Key;
  }
  export type S3ObjectKey = string;
  export type SecretAccessKey = string;
  export type ServicePrincipal = string;
  export type SessionToken = string;
  export interface SourceRevision {
    /**
     * The name of the action that processed the revision to the source artifact.
     */
    actionName: ActionName;
    /**
     * The system-generated unique ID that identifies the revision number of the artifact.
     */
    revisionId?: Revision;
    /**
     * Summary information about the most recent revision of the artifact. For GitHub and AWS CodeCommit repositories, the commit message. For Amazon S3 buckets or actions, the user-provided content of a codepipeline-artifact-revision-summary key specified in the object metadata.
     */
    revisionSummary?: RevisionSummary;
    /**
     * The commit ID for the artifact revision. For artifacts stored in GitHub or AWS CodeCommit repositories, the commit ID is linked to a commit details page.
     */
    revisionUrl?: Url;
  }
  export type SourceRevisionList = SourceRevision[];
  export type StageActionDeclarationList = ActionDeclaration[];
  export type StageBlockerDeclarationList = BlockerDeclaration[];
  export interface StageContext {
    /**
     * The name of the stage.
     */
    name?: StageName;
  }
  export interface StageDeclaration {
    /**
     * The name of the stage.
     */
    name: StageName;
    /**
     * Reserved for future use.
     */
    blockers?: StageBlockerDeclarationList;
    /**
     * The actions included in a stage.
     */
    actions: StageActionDeclarationList;
  }
  export interface StageExecution {
    /**
     * The ID of the pipeline execution associated with the stage.
     */
    pipelineExecutionId: PipelineExecutionId;
    /**
     * The status of the stage, or for a completed stage, the last status of the stage.  A status of cancelled means that the pipeline’s definition was updated before the stage execution could be completed. 
     */
    status: StageExecutionStatus;
  }
  export type StageExecutionStatus = "Cancelled"|"InProgress"|"Failed"|"Stopped"|"Stopping"|"Succeeded"|string;
  export type StageName = string;
  export type StageRetryMode = "FAILED_ACTIONS"|string;
  export interface StageState {
    /**
     * The name of the stage.
     */
    stageName?: StageName;
    inboundExecution?: StageExecution;
    /**
     * The state of the inbound transition, which is either enabled or disabled.
     */
    inboundTransitionState?: TransitionState;
    /**
     * The state of the stage.
     */
    actionStates?: ActionStateList;
    /**
     * Information about the latest execution in the stage, including its ID and status.
     */
    latestExecution?: StageExecution;
  }
  export type StageStateList = StageState[];
  export type StageTransitionType = "Inbound"|"Outbound"|string;
  export interface StartPipelineExecutionInput {
    /**
     * The name of the pipeline to start.
     */
    name: PipelineName;
    /**
     * The system-generated unique ID used to identify a unique execution request.
     */
    clientRequestToken?: ClientRequestToken;
  }
  export interface StartPipelineExecutionOutput {
    /**
     * The unique system-generated ID of the pipeline execution that was started.
     */
    pipelineExecutionId?: PipelineExecutionId;
  }
  export interface StopExecutionTrigger {
    /**
     * The user-specified reason the pipeline was stopped.
     */
    reason?: StopPipelineExecutionReason;
  }
  export interface StopPipelineExecutionInput {
    /**
     * The name of the pipeline to stop.
     */
    pipelineName: PipelineName;
    /**
     * The ID of the pipeline execution to be stopped in the current stage. Use the GetPipelineState action to retrieve the current pipelineExecutionId.
     */
    pipelineExecutionId: PipelineExecutionId;
    /**
     * Use this option to stop the pipeline execution by abandoning, rather than finishing, in-progress actions.  This option can lead to failed or out-of-sequence tasks. 
     */
    abandon?: Boolean;
    /**
     * Use this option to enter comments, such as the reason the pipeline was stopped.
     */
    reason?: StopPipelineExecutionReason;
  }
  export interface StopPipelineExecutionOutput {
    /**
     * The unique system-generated ID of the pipeline execution that was stopped.
     */
    pipelineExecutionId?: PipelineExecutionId;
  }
  export type StopPipelineExecutionReason = string;
  export type String = string;
  export interface Tag {
    /**
     * The tag's key.
     */
    key: TagKey;
    /**
     * The tag's value.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource you want to add tags to.
     */
    resourceArn: ResourceArn;
    /**
     * The tags you want to modify or add to the resource.
     */
    tags: TagList;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export interface ThirdPartyJob {
    /**
     * The clientToken portion of the clientId and clientToken pair used to verify that the calling entity is allowed access to the job and its details.
     */
    clientId?: ClientId;
    /**
     * The identifier used to identify the job in AWS CodePipeline.
     */
    jobId?: JobId;
  }
  export interface ThirdPartyJobData {
    /**
     * Represents information about an action type.
     */
    actionTypeId?: ActionTypeId;
    /**
     * Represents information about an action configuration.
     */
    actionConfiguration?: ActionConfiguration;
    /**
     * Represents information about a pipeline to a job worker.  Does not include pipelineArn and pipelineExecutionId for ThirdParty jobs. 
     */
    pipelineContext?: PipelineContext;
    /**
     * The name of the artifact that is worked on by the action, if any. This name might be system-generated, such as "MyApp", or it might be defined by the user when the action is created. The input artifact name must match the name of an output artifact generated by an action in an earlier action or stage of the pipeline.
     */
    inputArtifacts?: ArtifactList;
    /**
     * The name of the artifact that is the result of the action, if any. This name might be system-generated, such as "MyBuiltApp", or it might be defined by the user when the action is created.
     */
    outputArtifacts?: ArtifactList;
    /**
     * Represents an AWS session credentials object. These credentials are temporary credentials that are issued by AWS Secure Token Service (STS). They can be used to access input and output artifacts in the S3 bucket used to store artifact for the pipeline in AWS CodePipeline. 
     */
    artifactCredentials?: AWSSessionCredentials;
    /**
     * A system-generated token, such as a AWS CodeDeploy deployment ID, that a job requires to continue the job asynchronously.
     */
    continuationToken?: ContinuationToken;
    /**
     * The encryption key used to encrypt and decrypt data in the artifact store for the pipeline, such as an AWS Key Management Service (AWS KMS) key. This is optional and might not be present.
     */
    encryptionKey?: EncryptionKey;
  }
  export interface ThirdPartyJobDetails {
    /**
     * The identifier used to identify the job details in AWS CodePipeline.
     */
    id?: ThirdPartyJobId;
    /**
     * The data to be returned by the third party job worker.
     */
    data?: ThirdPartyJobData;
    /**
     * A system-generated random number that AWS CodePipeline uses to ensure that the job is being worked on by only one job worker. Use this number in an AcknowledgeThirdPartyJob request.
     */
    nonce?: Nonce;
  }
  export type ThirdPartyJobId = string;
  export type ThirdPartyJobList = ThirdPartyJob[];
  export type Time = Date;
  export type Timestamp = Date;
  export interface TransitionState {
    /**
     * Whether the transition between stages is enabled (true) or disabled (false).
     */
    enabled?: Enabled;
    /**
     * The ID of the user who last changed the transition state.
     */
    lastChangedBy?: LastChangedBy;
    /**
     * The timestamp when the transition state was last changed.
     */
    lastChangedAt?: LastChangedAt;
    /**
     * The user-specified reason why the transition between two stages of a pipeline was disabled.
     */
    disabledReason?: DisabledReason;
  }
  export type TriggerDetail = string;
  export type TriggerType = "CreatePipeline"|"StartPipelineExecution"|"PollForSourceChanges"|"Webhook"|"CloudWatchEvent"|"PutActionRevision"|string;
  export interface UntagResourceInput {
    /**
     *  The Amazon Resource Name (ARN) of the resource to remove tags from.
     */
    resourceArn: ResourceArn;
    /**
     * The list of keys for the tags to be removed from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateActionTypeInput {
    /**
     * The action type definition for the action type to be updated.
     */
    actionType: ActionTypeDeclaration;
  }
  export interface UpdatePipelineInput {
    /**
     * The name of the pipeline to be updated.
     */
    pipeline: PipelineDeclaration;
  }
  export interface UpdatePipelineOutput {
    /**
     * The structure of the updated pipeline.
     */
    pipeline?: PipelineDeclaration;
  }
  export type Url = string;
  export type UrlTemplate = string;
  export type Version = string;
  export type WebhookArn = string;
  export interface WebhookAuthConfiguration {
    /**
     * The property used to configure acceptance of webhooks in an IP address range. For IP, only the AllowedIPRange property must be set. This property must be set to a valid CIDR range.
     */
    AllowedIPRange?: WebhookAuthConfigurationAllowedIPRange;
    /**
     * The property used to configure GitHub authentication. For GITHUB_HMAC, only the SecretToken property must be set.
     */
    SecretToken?: WebhookAuthConfigurationSecretToken;
  }
  export type WebhookAuthConfigurationAllowedIPRange = string;
  export type WebhookAuthConfigurationSecretToken = string;
  export type WebhookAuthenticationType = "GITHUB_HMAC"|"IP"|"UNAUTHENTICATED"|string;
  export interface WebhookDefinition {
    /**
     * The name of the webhook.
     */
    name: WebhookName;
    /**
     * The name of the pipeline you want to connect to the webhook.
     */
    targetPipeline: PipelineName;
    /**
     * The name of the action in a pipeline you want to connect to the webhook. The action must be from the source (first) stage of the pipeline.
     */
    targetAction: ActionName;
    /**
     * A list of rules applied to the body/payload sent in the POST request to a webhook URL. All defined rules must pass for the request to be accepted and the pipeline started.
     */
    filters: WebhookFilters;
    /**
     * Supported options are GITHUB_HMAC, IP, and UNAUTHENTICATED.   For information about the authentication scheme implemented by GITHUB_HMAC, see Securing your webhooks on the GitHub Developer website.    IP rejects webhooks trigger requests unless they originate from an IP address in the IP range whitelisted in the authentication configuration.    UNAUTHENTICATED accepts all webhook trigger requests regardless of origin.  
     */
    authentication: WebhookAuthenticationType;
    /**
     * Properties that configure the authentication applied to incoming webhook trigger requests. The required properties depend on the authentication type. For GITHUB_HMAC, only the SecretToken property must be set. For IP, only the AllowedIPRange property must be set to a valid CIDR range. For UNAUTHENTICATED, no properties can be set.
     */
    authenticationConfiguration: WebhookAuthConfiguration;
  }
  export type WebhookErrorCode = string;
  export type WebhookErrorMessage = string;
  export interface WebhookFilterRule {
    /**
     * A JsonPath expression that is applied to the body/payload of the webhook. The value selected by the JsonPath expression must match the value specified in the MatchEquals field. Otherwise, the request is ignored. For more information, see Java JsonPath implementation in GitHub.
     */
    jsonPath: JsonPath;
    /**
     * The value selected by the JsonPath expression must match what is supplied in the MatchEquals field. Otherwise, the request is ignored. Properties from the target action configuration can be included as placeholders in this value by surrounding the action configuration key with curly brackets. For example, if the value supplied here is "refs/heads/{Branch}" and the target action has an action configuration property called "Branch" with a value of "master", the MatchEquals value is evaluated as "refs/heads/master". For a list of action configuration properties for built-in action types, see Pipeline Structure Reference Action Requirements.
     */
    matchEquals?: MatchEquals;
  }
  export type WebhookFilters = WebhookFilterRule[];
  export type WebhookLastTriggered = Date;
  export type WebhookList = ListWebhookItem[];
  export type WebhookName = string;
  export type WebhookUrl = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-07-09"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CodePipeline client.
   */
  export import Types = CodePipeline;
}
export = CodePipeline;
