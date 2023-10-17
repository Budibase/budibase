import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MigrationHubOrchestrator extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MigrationHubOrchestrator.Types.ClientConfiguration)
  config: Config & MigrationHubOrchestrator.Types.ClientConfiguration;
  /**
   * Create a workflow to orchestrate your migrations.
   */
  createWorkflow(params: MigrationHubOrchestrator.Types.CreateMigrationWorkflowRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.CreateMigrationWorkflowResponse) => void): Request<MigrationHubOrchestrator.Types.CreateMigrationWorkflowResponse, AWSError>;
  /**
   * Create a workflow to orchestrate your migrations.
   */
  createWorkflow(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.CreateMigrationWorkflowResponse) => void): Request<MigrationHubOrchestrator.Types.CreateMigrationWorkflowResponse, AWSError>;
  /**
   * Create a step in the migration workflow.
   */
  createWorkflowStep(params: MigrationHubOrchestrator.Types.CreateWorkflowStepRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.CreateWorkflowStepResponse) => void): Request<MigrationHubOrchestrator.Types.CreateWorkflowStepResponse, AWSError>;
  /**
   * Create a step in the migration workflow.
   */
  createWorkflowStep(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.CreateWorkflowStepResponse) => void): Request<MigrationHubOrchestrator.Types.CreateWorkflowStepResponse, AWSError>;
  /**
   * Create a step group in a migration workflow.
   */
  createWorkflowStepGroup(params: MigrationHubOrchestrator.Types.CreateWorkflowStepGroupRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.CreateWorkflowStepGroupResponse) => void): Request<MigrationHubOrchestrator.Types.CreateWorkflowStepGroupResponse, AWSError>;
  /**
   * Create a step group in a migration workflow.
   */
  createWorkflowStepGroup(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.CreateWorkflowStepGroupResponse) => void): Request<MigrationHubOrchestrator.Types.CreateWorkflowStepGroupResponse, AWSError>;
  /**
   * Delete a migration workflow. You must pause a running workflow in Migration Hub Orchestrator console to delete it.
   */
  deleteWorkflow(params: MigrationHubOrchestrator.Types.DeleteMigrationWorkflowRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.DeleteMigrationWorkflowResponse) => void): Request<MigrationHubOrchestrator.Types.DeleteMigrationWorkflowResponse, AWSError>;
  /**
   * Delete a migration workflow. You must pause a running workflow in Migration Hub Orchestrator console to delete it.
   */
  deleteWorkflow(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.DeleteMigrationWorkflowResponse) => void): Request<MigrationHubOrchestrator.Types.DeleteMigrationWorkflowResponse, AWSError>;
  /**
   * Delete a step in a migration workflow. Pause the workflow to delete a running step.
   */
  deleteWorkflowStep(params: MigrationHubOrchestrator.Types.DeleteWorkflowStepRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.DeleteWorkflowStepResponse) => void): Request<MigrationHubOrchestrator.Types.DeleteWorkflowStepResponse, AWSError>;
  /**
   * Delete a step in a migration workflow. Pause the workflow to delete a running step.
   */
  deleteWorkflowStep(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.DeleteWorkflowStepResponse) => void): Request<MigrationHubOrchestrator.Types.DeleteWorkflowStepResponse, AWSError>;
  /**
   * Delete a step group in a migration workflow.
   */
  deleteWorkflowStepGroup(params: MigrationHubOrchestrator.Types.DeleteWorkflowStepGroupRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.DeleteWorkflowStepGroupResponse) => void): Request<MigrationHubOrchestrator.Types.DeleteWorkflowStepGroupResponse, AWSError>;
  /**
   * Delete a step group in a migration workflow.
   */
  deleteWorkflowStepGroup(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.DeleteWorkflowStepGroupResponse) => void): Request<MigrationHubOrchestrator.Types.DeleteWorkflowStepGroupResponse, AWSError>;
  /**
   * Get the template you want to use for creating a migration workflow.
   */
  getTemplate(params: MigrationHubOrchestrator.Types.GetMigrationWorkflowTemplateRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.GetMigrationWorkflowTemplateResponse) => void): Request<MigrationHubOrchestrator.Types.GetMigrationWorkflowTemplateResponse, AWSError>;
  /**
   * Get the template you want to use for creating a migration workflow.
   */
  getTemplate(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.GetMigrationWorkflowTemplateResponse) => void): Request<MigrationHubOrchestrator.Types.GetMigrationWorkflowTemplateResponse, AWSError>;
  /**
   * Get a specific step in a template.
   */
  getTemplateStep(params: MigrationHubOrchestrator.Types.GetTemplateStepRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.GetTemplateStepResponse) => void): Request<MigrationHubOrchestrator.Types.GetTemplateStepResponse, AWSError>;
  /**
   * Get a specific step in a template.
   */
  getTemplateStep(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.GetTemplateStepResponse) => void): Request<MigrationHubOrchestrator.Types.GetTemplateStepResponse, AWSError>;
  /**
   * Get a step group in a template.
   */
  getTemplateStepGroup(params: MigrationHubOrchestrator.Types.GetTemplateStepGroupRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.GetTemplateStepGroupResponse) => void): Request<MigrationHubOrchestrator.Types.GetTemplateStepGroupResponse, AWSError>;
  /**
   * Get a step group in a template.
   */
  getTemplateStepGroup(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.GetTemplateStepGroupResponse) => void): Request<MigrationHubOrchestrator.Types.GetTemplateStepGroupResponse, AWSError>;
  /**
   * Get migration workflow.
   */
  getWorkflow(params: MigrationHubOrchestrator.Types.GetMigrationWorkflowRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.GetMigrationWorkflowResponse) => void): Request<MigrationHubOrchestrator.Types.GetMigrationWorkflowResponse, AWSError>;
  /**
   * Get migration workflow.
   */
  getWorkflow(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.GetMigrationWorkflowResponse) => void): Request<MigrationHubOrchestrator.Types.GetMigrationWorkflowResponse, AWSError>;
  /**
   * Get a step in the migration workflow.
   */
  getWorkflowStep(params: MigrationHubOrchestrator.Types.GetWorkflowStepRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.GetWorkflowStepResponse) => void): Request<MigrationHubOrchestrator.Types.GetWorkflowStepResponse, AWSError>;
  /**
   * Get a step in the migration workflow.
   */
  getWorkflowStep(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.GetWorkflowStepResponse) => void): Request<MigrationHubOrchestrator.Types.GetWorkflowStepResponse, AWSError>;
  /**
   * Get the step group of a migration workflow.
   */
  getWorkflowStepGroup(params: MigrationHubOrchestrator.Types.GetWorkflowStepGroupRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.GetWorkflowStepGroupResponse) => void): Request<MigrationHubOrchestrator.Types.GetWorkflowStepGroupResponse, AWSError>;
  /**
   * Get the step group of a migration workflow.
   */
  getWorkflowStepGroup(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.GetWorkflowStepGroupResponse) => void): Request<MigrationHubOrchestrator.Types.GetWorkflowStepGroupResponse, AWSError>;
  /**
   * List AWS Migration Hub Orchestrator plugins.
   */
  listPlugins(params: MigrationHubOrchestrator.Types.ListPluginsRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListPluginsResponse) => void): Request<MigrationHubOrchestrator.Types.ListPluginsResponse, AWSError>;
  /**
   * List AWS Migration Hub Orchestrator plugins.
   */
  listPlugins(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListPluginsResponse) => void): Request<MigrationHubOrchestrator.Types.ListPluginsResponse, AWSError>;
  /**
   * List the tags added to a resource.
   */
  listTagsForResource(params: MigrationHubOrchestrator.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListTagsForResourceResponse) => void): Request<MigrationHubOrchestrator.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List the tags added to a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListTagsForResourceResponse) => void): Request<MigrationHubOrchestrator.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List the step groups in a template.
   */
  listTemplateStepGroups(params: MigrationHubOrchestrator.Types.ListTemplateStepGroupsRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListTemplateStepGroupsResponse) => void): Request<MigrationHubOrchestrator.Types.ListTemplateStepGroupsResponse, AWSError>;
  /**
   * List the step groups in a template.
   */
  listTemplateStepGroups(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListTemplateStepGroupsResponse) => void): Request<MigrationHubOrchestrator.Types.ListTemplateStepGroupsResponse, AWSError>;
  /**
   * List the steps in a template.
   */
  listTemplateSteps(params: MigrationHubOrchestrator.Types.ListTemplateStepsRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListTemplateStepsResponse) => void): Request<MigrationHubOrchestrator.Types.ListTemplateStepsResponse, AWSError>;
  /**
   * List the steps in a template.
   */
  listTemplateSteps(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListTemplateStepsResponse) => void): Request<MigrationHubOrchestrator.Types.ListTemplateStepsResponse, AWSError>;
  /**
   * List the templates available in Migration Hub Orchestrator to create a migration workflow.
   */
  listTemplates(params: MigrationHubOrchestrator.Types.ListMigrationWorkflowTemplatesRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListMigrationWorkflowTemplatesResponse) => void): Request<MigrationHubOrchestrator.Types.ListMigrationWorkflowTemplatesResponse, AWSError>;
  /**
   * List the templates available in Migration Hub Orchestrator to create a migration workflow.
   */
  listTemplates(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListMigrationWorkflowTemplatesResponse) => void): Request<MigrationHubOrchestrator.Types.ListMigrationWorkflowTemplatesResponse, AWSError>;
  /**
   * List the step groups in a migration workflow.
   */
  listWorkflowStepGroups(params: MigrationHubOrchestrator.Types.ListWorkflowStepGroupsRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListWorkflowStepGroupsResponse) => void): Request<MigrationHubOrchestrator.Types.ListWorkflowStepGroupsResponse, AWSError>;
  /**
   * List the step groups in a migration workflow.
   */
  listWorkflowStepGroups(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListWorkflowStepGroupsResponse) => void): Request<MigrationHubOrchestrator.Types.ListWorkflowStepGroupsResponse, AWSError>;
  /**
   * List the steps in a workflow.
   */
  listWorkflowSteps(params: MigrationHubOrchestrator.Types.ListWorkflowStepsRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListWorkflowStepsResponse) => void): Request<MigrationHubOrchestrator.Types.ListWorkflowStepsResponse, AWSError>;
  /**
   * List the steps in a workflow.
   */
  listWorkflowSteps(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListWorkflowStepsResponse) => void): Request<MigrationHubOrchestrator.Types.ListWorkflowStepsResponse, AWSError>;
  /**
   * List the migration workflows.
   */
  listWorkflows(params: MigrationHubOrchestrator.Types.ListMigrationWorkflowsRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListMigrationWorkflowsResponse) => void): Request<MigrationHubOrchestrator.Types.ListMigrationWorkflowsResponse, AWSError>;
  /**
   * List the migration workflows.
   */
  listWorkflows(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.ListMigrationWorkflowsResponse) => void): Request<MigrationHubOrchestrator.Types.ListMigrationWorkflowsResponse, AWSError>;
  /**
   * Retry a failed step in a migration workflow.
   */
  retryWorkflowStep(params: MigrationHubOrchestrator.Types.RetryWorkflowStepRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.RetryWorkflowStepResponse) => void): Request<MigrationHubOrchestrator.Types.RetryWorkflowStepResponse, AWSError>;
  /**
   * Retry a failed step in a migration workflow.
   */
  retryWorkflowStep(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.RetryWorkflowStepResponse) => void): Request<MigrationHubOrchestrator.Types.RetryWorkflowStepResponse, AWSError>;
  /**
   * Start a migration workflow.
   */
  startWorkflow(params: MigrationHubOrchestrator.Types.StartMigrationWorkflowRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.StartMigrationWorkflowResponse) => void): Request<MigrationHubOrchestrator.Types.StartMigrationWorkflowResponse, AWSError>;
  /**
   * Start a migration workflow.
   */
  startWorkflow(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.StartMigrationWorkflowResponse) => void): Request<MigrationHubOrchestrator.Types.StartMigrationWorkflowResponse, AWSError>;
  /**
   * Stop an ongoing migration workflow.
   */
  stopWorkflow(params: MigrationHubOrchestrator.Types.StopMigrationWorkflowRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.StopMigrationWorkflowResponse) => void): Request<MigrationHubOrchestrator.Types.StopMigrationWorkflowResponse, AWSError>;
  /**
   * Stop an ongoing migration workflow.
   */
  stopWorkflow(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.StopMigrationWorkflowResponse) => void): Request<MigrationHubOrchestrator.Types.StopMigrationWorkflowResponse, AWSError>;
  /**
   * Tag a resource by specifying its Amazon Resource Name (ARN).
   */
  tagResource(params: MigrationHubOrchestrator.Types.TagResourceRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.TagResourceResponse) => void): Request<MigrationHubOrchestrator.Types.TagResourceResponse, AWSError>;
  /**
   * Tag a resource by specifying its Amazon Resource Name (ARN).
   */
  tagResource(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.TagResourceResponse) => void): Request<MigrationHubOrchestrator.Types.TagResourceResponse, AWSError>;
  /**
   * Deletes the tags for a resource.
   */
  untagResource(params: MigrationHubOrchestrator.Types.UntagResourceRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.UntagResourceResponse) => void): Request<MigrationHubOrchestrator.Types.UntagResourceResponse, AWSError>;
  /**
   * Deletes the tags for a resource.
   */
  untagResource(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.UntagResourceResponse) => void): Request<MigrationHubOrchestrator.Types.UntagResourceResponse, AWSError>;
  /**
   * Update a migration workflow.
   */
  updateWorkflow(params: MigrationHubOrchestrator.Types.UpdateMigrationWorkflowRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.UpdateMigrationWorkflowResponse) => void): Request<MigrationHubOrchestrator.Types.UpdateMigrationWorkflowResponse, AWSError>;
  /**
   * Update a migration workflow.
   */
  updateWorkflow(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.UpdateMigrationWorkflowResponse) => void): Request<MigrationHubOrchestrator.Types.UpdateMigrationWorkflowResponse, AWSError>;
  /**
   * Update a step in a migration workflow.
   */
  updateWorkflowStep(params: MigrationHubOrchestrator.Types.UpdateWorkflowStepRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.UpdateWorkflowStepResponse) => void): Request<MigrationHubOrchestrator.Types.UpdateWorkflowStepResponse, AWSError>;
  /**
   * Update a step in a migration workflow.
   */
  updateWorkflowStep(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.UpdateWorkflowStepResponse) => void): Request<MigrationHubOrchestrator.Types.UpdateWorkflowStepResponse, AWSError>;
  /**
   * Update the step group in a migration workflow.
   */
  updateWorkflowStepGroup(params: MigrationHubOrchestrator.Types.UpdateWorkflowStepGroupRequest, callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.UpdateWorkflowStepGroupResponse) => void): Request<MigrationHubOrchestrator.Types.UpdateWorkflowStepGroupResponse, AWSError>;
  /**
   * Update the step group in a migration workflow.
   */
  updateWorkflowStepGroup(callback?: (err: AWSError, data: MigrationHubOrchestrator.Types.UpdateWorkflowStepGroupResponse) => void): Request<MigrationHubOrchestrator.Types.UpdateWorkflowStepGroupResponse, AWSError>;
}
declare namespace MigrationHubOrchestrator {
  export type ApplicationConfigurationName = string;
  export type Boolean = boolean;
  export interface CreateMigrationWorkflowRequest {
    /**
     * The name of the migration workflow.
     */
    name: CreateMigrationWorkflowRequestNameString;
    /**
     * The description of the migration workflow.
     */
    description?: CreateMigrationWorkflowRequestDescriptionString;
    /**
     * The ID of the template.
     */
    templateId: CreateMigrationWorkflowRequestTemplateIdString;
    /**
     * The configuration ID of the application configured in Application Discovery Service.
     */
    applicationConfigurationId: CreateMigrationWorkflowRequestApplicationConfigurationIdString;
    /**
     * The input parameters required to create a migration workflow.
     */
    inputParameters: StepInputParameters;
    /**
     * The servers on which a step will be run.
     */
    stepTargets?: StringList;
    /**
     * The tags to add on a migration workflow.
     */
    tags?: StringMap;
  }
  export type CreateMigrationWorkflowRequestApplicationConfigurationIdString = string;
  export type CreateMigrationWorkflowRequestDescriptionString = string;
  export type CreateMigrationWorkflowRequestNameString = string;
  export type CreateMigrationWorkflowRequestTemplateIdString = string;
  export interface CreateMigrationWorkflowResponse {
    /**
     * The ID of the migration workflow.
     */
    id?: MigrationWorkflowId;
    /**
     * The Amazon Resource Name (ARN) of the migration workflow.
     */
    arn?: String;
    /**
     * The name of the migration workflow.
     */
    name?: String;
    /**
     * The description of the migration workflow.
     */
    description?: String;
    /**
     * The ID of the template.
     */
    templateId?: String;
    /**
     * The configuration ID of the application configured in Application Discovery Service.
     */
    adsApplicationConfigurationId?: String;
    /**
     * The inputs for creating a migration workflow.
     */
    workflowInputs?: StepInputParameters;
    /**
     * The servers on which a step will be run.
     */
    stepTargets?: StringList;
    /**
     * The status of the migration workflow.
     */
    status?: MigrationWorkflowStatusEnum;
    /**
     * The time at which the migration workflow was created.
     */
    creationTime?: Timestamp;
    /**
     * The tags to add on a migration workflow.
     */
    tags?: StringMap;
  }
  export interface CreateWorkflowStepGroupRequest {
    /**
     * The ID of the migration workflow that will contain the step group.
     */
    workflowId: MigrationWorkflowId;
    /**
     * The name of the step group.
     */
    name: StepGroupName;
    /**
     * The description of the step group.
     */
    description?: StepGroupDescription;
    /**
     * The next step group.
     */
    next?: StringList;
    /**
     * The previous step group.
     */
    previous?: StringList;
  }
  export interface CreateWorkflowStepGroupResponse {
    /**
     * The ID of the migration workflow that contains the step group.
     */
    workflowId?: String;
    /**
     * The name of the step group.
     */
    name?: String;
    /**
     * The ID of the step group.
     */
    id?: String;
    /**
     * The description of the step group.
     */
    description?: String;
    /**
     * List of AWS services utilized in a migration workflow.
     */
    tools?: ToolsList;
    /**
     * The next step group.
     */
    next?: StringList;
    /**
     * The previous step group.
     */
    previous?: StringList;
    /**
     * The time at which the step group is created.
     */
    creationTime?: Timestamp;
  }
  export interface CreateWorkflowStepRequest {
    /**
     * The name of the step.
     */
    name: MigrationWorkflowName;
    /**
     * The ID of the step group.
     */
    stepGroupId: StepGroupId;
    /**
     * The ID of the migration workflow.
     */
    workflowId: MigrationWorkflowId;
    /**
     * The action type of the step. You must run and update the status of a manual step for the workflow to continue after the completion of the step.
     */
    stepActionType: StepActionType;
    /**
     * The description of the step.
     */
    description?: MigrationWorkflowDescription;
    /**
     * The custom script to run tests on source or target environments.
     */
    workflowStepAutomationConfiguration?: WorkflowStepAutomationConfiguration;
    /**
     * The servers on which a step will be run.
     */
    stepTarget?: StringList;
    /**
     * The key value pairs added for the expected output.
     */
    outputs?: WorkflowStepOutputList;
    /**
     * The previous step.
     */
    previous?: StringList;
    /**
     * The next step.
     */
    next?: StringList;
  }
  export interface CreateWorkflowStepResponse {
    /**
     * The ID of the step.
     */
    id?: String;
    /**
     * The ID of the step group.
     */
    stepGroupId?: String;
    /**
     * The ID of the migration workflow.
     */
    workflowId?: String;
    /**
     * The name of the step.
     */
    name?: String;
  }
  export type DataType = "STRING"|"INTEGER"|"STRINGLIST"|"STRINGMAP"|string;
  export interface DeleteMigrationWorkflowRequest {
    /**
     * The ID of the migration workflow you want to delete.
     */
    id: MigrationWorkflowId;
  }
  export interface DeleteMigrationWorkflowResponse {
    /**
     * The ID of the migration workflow.
     */
    id?: MigrationWorkflowId;
    /**
     * The Amazon Resource Name (ARN) of the migration workflow.
     */
    arn?: String;
    /**
     * The status of the migration workflow.
     */
    status?: MigrationWorkflowStatusEnum;
  }
  export interface DeleteWorkflowStepGroupRequest {
    /**
     * The ID of the migration workflow.
     */
    workflowId: MigrationWorkflowId;
    /**
     * The ID of the step group you want to delete.
     */
    id: StepGroupId;
  }
  export interface DeleteWorkflowStepGroupResponse {
  }
  export interface DeleteWorkflowStepRequest {
    /**
     * The ID of the step you want to delete.
     */
    id: StepId;
    /**
     * The ID of the step group that contains the step you want to delete.
     */
    stepGroupId: StepGroupId;
    /**
     * The ID of the migration workflow.
     */
    workflowId: MigrationWorkflowId;
  }
  export interface DeleteWorkflowStepResponse {
  }
  export interface GetMigrationWorkflowRequest {
    /**
     * The ID of the migration workflow.
     */
    id: MigrationWorkflowId;
  }
  export interface GetMigrationWorkflowResponse {
    /**
     * The ID of the migration workflow.
     */
    id?: MigrationWorkflowId;
    /**
     * The Amazon Resource Name (ARN) of the migration workflow.
     */
    arn?: String;
    /**
     * The name of the migration workflow.
     */
    name?: String;
    /**
     * The description of the migration workflow.
     */
    description?: String;
    /**
     * The ID of the template.
     */
    templateId?: String;
    /**
     * The configuration ID of the application configured in Application Discovery Service.
     */
    adsApplicationConfigurationId?: String;
    /**
     * The name of the application configured in Application Discovery Service.
     */
    adsApplicationName?: String;
    /**
     * The status of the migration workflow.
     */
    status?: MigrationWorkflowStatusEnum;
    /**
     * The status message of the migration workflow.
     */
    statusMessage?: String;
    /**
     * The time at which the migration workflow was created.
     */
    creationTime?: Timestamp;
    /**
     * The time at which the migration workflow was last started.
     */
    lastStartTime?: Timestamp;
    /**
     * The time at which the migration workflow was last stopped.
     */
    lastStopTime?: Timestamp;
    /**
     * The time at which the migration workflow was last modified.
     */
    lastModifiedTime?: Timestamp;
    /**
     * The time at which the migration workflow ended.
     */
    endTime?: Timestamp;
    /**
     * List of AWS services utilized in a migration workflow.
     */
    tools?: ToolsList;
    /**
     * The total number of steps in the migration workflow.
     */
    totalSteps?: Integer;
    /**
     * Get a list of completed steps in the migration workflow.
     */
    completedSteps?: Integer;
    /**
     * The inputs required for creating the migration workflow.
     */
    workflowInputs?: StepInputParameters;
    /**
     * The tags added to the migration workflow.
     */
    tags?: StringMap;
    /**
     * The Amazon S3 bucket where the migration logs are stored.
     */
    workflowBucket?: String;
  }
  export interface GetMigrationWorkflowTemplateRequest {
    /**
     * The ID of the template.
     */
    id: TemplateId;
  }
  export interface GetMigrationWorkflowTemplateResponse {
    /**
     * The ID of the template.
     */
    id?: String;
    /**
     * The name of the template.
     */
    name?: String;
    /**
     * The time at which the template was last created.
     */
    description?: String;
    /**
     * The inputs provided for the creation of the migration workflow.
     */
    inputs?: TemplateInputList;
    /**
     * List of AWS services utilized in a migration workflow.
     */
    tools?: ToolsList;
    /**
     * The status of the template.
     */
    status?: TemplateStatus;
    /**
     * The time at which the template was last created.
     */
    creationTime?: Timestamp;
  }
  export interface GetTemplateStepGroupRequest {
    /**
     * The ID of the template.
     */
    templateId: TemplateId;
    /**
     * The ID of the step group.
     */
    id: StepGroupId;
  }
  export interface GetTemplateStepGroupResponse {
    /**
     * The ID of the template.
     */
    templateId?: String;
    /**
     * The ID of the step group.
     */
    id?: String;
    /**
     * The name of the step group.
     */
    name?: String;
    /**
     * The description of the step group.
     */
    description?: String;
    /**
     * The status of the step group.
     */
    status?: StepGroupStatus;
    /**
     * The time at which the step group was created.
     */
    creationTime?: Timestamp;
    /**
     * The time at which the step group was last modified.
     */
    lastModifiedTime?: Timestamp;
    /**
     * List of AWS services utilized in a migration workflow.
     */
    tools?: ToolsList;
    /**
     * The previous step group.
     */
    previous?: StringList;
    /**
     * The next step group.
     */
    next?: StringList;
  }
  export interface GetTemplateStepRequest {
    /**
     * The ID of the step.
     */
    id: StepId;
    /**
     * The ID of the template.
     */
    templateId: TemplateId;
    /**
     * The ID of the step group.
     */
    stepGroupId: StepGroupId;
  }
  export interface GetTemplateStepResponse {
    /**
     * The ID of the step.
     */
    id?: StepId;
    /**
     * The ID of the step group.
     */
    stepGroupId?: StepGroupId;
    /**
     * The ID of the template.
     */
    templateId?: TemplateId;
    /**
     * The name of the step.
     */
    name?: String;
    /**
     * The description of the step.
     */
    description?: String;
    /**
     * The action type of the step. You must run and update the status of a manual step for the workflow to continue after the completion of the step.
     */
    stepActionType?: StepActionType;
    /**
     * The time at which the step was created.
     */
    creationTime?: String;
    /**
     * The previous step.
     */
    previous?: StringList;
    /**
     * The next step.
     */
    next?: StringList;
    /**
     * The outputs of the step.
     */
    outputs?: StepOutputList;
    /**
     * The custom script to run tests on source or target environments.
     */
    stepAutomationConfiguration?: StepAutomationConfiguration;
  }
  export interface GetWorkflowStepGroupRequest {
    /**
     * The ID of the step group.
     */
    id: StepGroupId;
    /**
     * The ID of the migration workflow.
     */
    workflowId: MigrationWorkflowId;
  }
  export interface GetWorkflowStepGroupResponse {
    /**
     * The ID of the step group.
     */
    id?: StepGroupId;
    /**
     * The ID of the migration workflow.
     */
    workflowId?: String;
    /**
     * The name of the step group.
     */
    name?: String;
    /**
     * The description of the step group.
     */
    description?: String;
    /**
     * The status of the step group.
     */
    status?: StepGroupStatus;
    /**
     * The owner of the step group.
     */
    owner?: Owner;
    /**
     * The time at which the step group was created.
     */
    creationTime?: Timestamp;
    /**
     * The time at which the step group was last modified.
     */
    lastModifiedTime?: Timestamp;
    /**
     * The time at which the step group ended.
     */
    endTime?: Timestamp;
    /**
     * List of AWS services utilized in a migration workflow.
     */
    tools?: ToolsList;
    /**
     * The previous step group.
     */
    previous?: StringList;
    /**
     * The next step group.
     */
    next?: StringList;
  }
  export interface GetWorkflowStepRequest {
    /**
     * The ID of the migration workflow.
     */
    workflowId: MigrationWorkflowId;
    /**
     * desThe ID of the step group.
     */
    stepGroupId: StepGroupId;
    /**
     * The ID of the step.
     */
    id: StepId;
  }
  export interface GetWorkflowStepResponse {
    /**
     * The name of the step.
     */
    name?: String;
    /**
     * The ID of the step group.
     */
    stepGroupId?: String;
    /**
     * The ID of the migration workflow.
     */
    workflowId?: String;
    /**
     * The ID of the step.
     */
    stepId?: String;
    /**
     * The description of the step.
     */
    description?: String;
    /**
     * The action type of the step. You must run and update the status of a manual step for the workflow to continue after the completion of the step.
     */
    stepActionType?: StepActionType;
    /**
     * The owner of the step.
     */
    owner?: Owner;
    /**
     * The custom script to run tests on source or target environments.
     */
    workflowStepAutomationConfiguration?: WorkflowStepAutomationConfiguration;
    /**
     * The servers on which a step will be run.
     */
    stepTarget?: StringList;
    /**
     * The outputs of the step.
     */
    outputs?: GetWorkflowStepResponseOutputsList;
    /**
     * The previous step.
     */
    previous?: StringList;
    /**
     * The next step.
     */
    next?: StringList;
    /**
     * The status of the step.
     */
    status?: StepStatus;
    /**
     * The status message of the migration workflow.
     */
    statusMessage?: String;
    /**
     * The output location of the script.
     */
    scriptOutputLocation?: String;
    /**
     * The time at which the step was created.
     */
    creationTime?: Timestamp;
    /**
     * The time at which the workflow was last started.
     */
    lastStartTime?: Timestamp;
    /**
     * The time at which the step ended.
     */
    endTime?: Timestamp;
    /**
     * The number of servers that have been migrated.
     */
    noOfSrvCompleted?: Integer;
    /**
     * The number of servers that have failed to migrate.
     */
    noOfSrvFailed?: Integer;
    /**
     * The total number of servers that have been migrated.
     */
    totalNoOfSrv?: Integer;
  }
  export type GetWorkflowStepResponseOutputsList = WorkflowStepOutput[];
  export type IPAddress = string;
  export type Integer = number;
  export interface ListMigrationWorkflowTemplatesRequest {
    /**
     * The maximum number of results that can be returned.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * The name of the template.
     */
    name?: TemplateName;
  }
  export interface ListMigrationWorkflowTemplatesResponse {
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * The summary of the template.
     */
    templateSummary: TemplateSummaryList;
  }
  export interface ListMigrationWorkflowsRequest {
    /**
     * The maximum number of results that can be returned.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * The ID of the template.
     */
    templateId?: TemplateId;
    /**
     * The name of the application configured in Application Discovery Service.
     */
    adsApplicationConfigurationName?: ApplicationConfigurationName;
    /**
     * The status of the migration workflow.
     */
    status?: MigrationWorkflowStatusEnum;
    /**
     * The name of the migration workflow.
     */
    name?: String;
  }
  export interface ListMigrationWorkflowsResponse {
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * The summary of the migration workflow.
     */
    migrationWorkflowSummary: MigrationWorkflowSummaryList;
  }
  export interface ListPluginsRequest {
    /**
     * The maximum number of plugins that can be returned.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
  }
  export interface ListPluginsResponse {
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * Migration Hub Orchestrator plugins.
     */
    plugins?: PluginSummaries;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags added to a resource.
     */
    tags?: TagMap;
  }
  export interface ListTemplateStepGroupsRequest {
    /**
     * The maximum number of results that can be returned.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * The ID of the template.
     */
    templateId: TemplateId;
  }
  export interface ListTemplateStepGroupsResponse {
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * The summary of the step group in the template.
     */
    templateStepGroupSummary: TemplateStepGroupSummaryList;
  }
  export interface ListTemplateStepsRequest {
    /**
     * The maximum number of results that can be returned.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * The ID of the template.
     */
    templateId: TemplateId;
    /**
     * The ID of the step group.
     */
    stepGroupId: StepGroupId;
  }
  export interface ListTemplateStepsResponse {
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * The list of summaries of steps in a template.
     */
    templateStepSummaryList?: TemplateStepSummaryList;
  }
  export interface ListWorkflowStepGroupsRequest {
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results that can be returned.
     */
    maxResults?: MaxResults;
    /**
     * The ID of the migration workflow.
     */
    workflowId: MigrationWorkflowId;
  }
  export interface ListWorkflowStepGroupsResponse {
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * The summary of step groups in a migration workflow.
     */
    workflowStepGroupsSummary: WorkflowStepGroupsSummaryList;
  }
  export interface ListWorkflowStepsRequest {
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results that can be returned.
     */
    maxResults?: MaxResults;
    /**
     * The ID of the migration workflow.
     */
    workflowId: MigrationWorkflowId;
    /**
     * The ID of the step group.
     */
    stepGroupId: StepGroupId;
  }
  export interface ListWorkflowStepsResponse {
    /**
     * The pagination token.
     */
    nextToken?: NextToken;
    /**
     * The summary of steps in a migration workflow.
     */
    workflowStepsSummary: WorkflowStepsSummaryList;
  }
  export type MaxResults = number;
  export type MigrationWorkflowDescription = string;
  export type MigrationWorkflowId = string;
  export type MigrationWorkflowName = string;
  export type MigrationWorkflowStatusEnum = "CREATING"|"NOT_STARTED"|"CREATION_FAILED"|"STARTING"|"IN_PROGRESS"|"WORKFLOW_FAILED"|"PAUSED"|"PAUSING"|"PAUSING_FAILED"|"USER_ATTENTION_REQUIRED"|"DELETING"|"DELETION_FAILED"|"DELETED"|"COMPLETED"|string;
  export interface MigrationWorkflowSummary {
    /**
     * The ID of the migration workflow.
     */
    id?: MigrationWorkflowId;
    /**
     * The name of the migration workflow.
     */
    name?: String;
    /**
     * The ID of the template.
     */
    templateId?: String;
    /**
     * The name of the application configured in Application Discovery Service.
     */
    adsApplicationConfigurationName?: String;
    /**
     * The status of the migration workflow.
     */
    status?: MigrationWorkflowStatusEnum;
    /**
     * The time at which the migration workflow was created.
     */
    creationTime?: Timestamp;
    /**
     * The time at which the migration workflow ended.
     */
    endTime?: Timestamp;
    /**
     * The status message of the migration workflow.
     */
    statusMessage?: String;
    /**
     * The steps completed in the migration workflow.
     */
    completedSteps?: Integer;
    /**
     * All the steps in a migration workflow.
     */
    totalSteps?: Integer;
  }
  export type MigrationWorkflowSummaryList = MigrationWorkflowSummary[];
  export type NextToken = string;
  export type Owner = "AWS_MANAGED"|"CUSTOM"|string;
  export interface PlatformCommand {
    /**
     * Command for Linux.
     */
    linux?: String;
    /**
     * Command for Windows.
     */
    windows?: String;
  }
  export interface PlatformScriptKey {
    /**
     * The script location for Linux.
     */
    linux?: S3Key;
    /**
     * The script location for Windows.
     */
    windows?: S3Key;
  }
  export type PluginHealth = "HEALTHY"|"UNHEALTHY"|string;
  export type PluginId = string;
  export type PluginSummaries = PluginSummary[];
  export interface PluginSummary {
    /**
     * The ID of the plugin.
     */
    pluginId?: PluginId;
    /**
     * The name of the host.
     */
    hostname?: String;
    /**
     * The status of the plugin.
     */
    status?: PluginHealth;
    /**
     * The IP address at which the plugin is located.
     */
    ipAddress?: IPAddress;
    /**
     * The version of the plugin.
     */
    version?: PluginVersion;
    /**
     * The time at which the plugin was registered.
     */
    registeredTime?: String;
  }
  export type PluginVersion = string;
  export type ResourceArn = string;
  export interface RetryWorkflowStepRequest {
    /**
     * The ID of the migration workflow.
     */
    workflowId: MigrationWorkflowId;
    /**
     * The ID of the step group.
     */
    stepGroupId: StepGroupId;
    /**
     * The ID of the step.
     */
    id: StepId;
  }
  export interface RetryWorkflowStepResponse {
    /**
     * The ID of the step group.
     */
    stepGroupId?: String;
    /**
     * The ID of the migration workflow.
     */
    workflowId?: String;
    /**
     * The ID of the step.
     */
    id?: String;
    /**
     * The status of the step.
     */
    status?: StepStatus;
  }
  export type RunEnvironment = "AWS"|"ONPREMISE"|string;
  export type S3Bucket = string;
  export type S3Key = string;
  export interface StartMigrationWorkflowRequest {
    /**
     * The ID of the migration workflow.
     */
    id: MigrationWorkflowId;
  }
  export interface StartMigrationWorkflowResponse {
    /**
     * The ID of the migration workflow.
     */
    id?: MigrationWorkflowId;
    /**
     * The Amazon Resource Name (ARN) of the migration workflow.
     */
    arn?: String;
    /**
     * The status of the migration workflow.
     */
    status?: MigrationWorkflowStatusEnum;
    /**
     * The status message of the migration workflow.
     */
    statusMessage?: String;
    /**
     * The time at which the migration workflow was last started.
     */
    lastStartTime?: Timestamp;
  }
  export type StepActionType = "MANUAL"|"AUTOMATED"|string;
  export interface StepAutomationConfiguration {
    /**
     * The Amazon S3 bucket where the script is located.
     */
    scriptLocationS3Bucket?: String;
    /**
     * The Amazon S3 key for the script location.
     */
    scriptLocationS3Key?: PlatformScriptKey;
    /**
     * The command to run the script.
     */
    command?: PlatformCommand;
    /**
     * The source or target environment.
     */
    runEnvironment?: RunEnvironment;
    /**
     * The servers on which to run the script.
     */
    targetType?: TargetType;
  }
  export type StepDescription = string;
  export type StepGroupDescription = string;
  export type StepGroupId = string;
  export type StepGroupName = string;
  export type StepGroupStatus = "AWAITING_DEPENDENCIES"|"READY"|"IN_PROGRESS"|"COMPLETED"|"FAILED"|"PAUSED"|"PAUSING"|"USER_ATTENTION_REQUIRED"|string;
  export type StepId = string;
  export interface StepInput {
    /**
     * The value of the integer.
     */
    integerValue?: Integer;
    /**
     * String value.
     */
    stringValue?: StringValue;
    /**
     * List of string values.
     */
    listOfStringsValue?: StringList;
    /**
     * Map of string values.
     */
    mapOfStringValue?: StringMap;
  }
  export type StepInputParameters = {[key: string]: StepInput};
  export type StepInputParametersKey = string;
  export type StepName = string;
  export interface StepOutput {
    /**
     * The name of the step.
     */
    name?: String;
    /**
     * The data type of the step output.
     */
    dataType?: DataType;
    /**
     * Determine if an output is required from a step.
     */
    required?: Boolean;
  }
  export type StepOutputList = StepOutput[];
  export type StepStatus = "AWAITING_DEPENDENCIES"|"READY"|"IN_PROGRESS"|"COMPLETED"|"FAILED"|"PAUSED"|"USER_ATTENTION_REQUIRED"|string;
  export interface StopMigrationWorkflowRequest {
    /**
     * The ID of the migration workflow.
     */
    id: MigrationWorkflowId;
  }
  export interface StopMigrationWorkflowResponse {
    /**
     * The ID of the migration workflow.
     */
    id?: MigrationWorkflowId;
    /**
     * The Amazon Resource Name (ARN) of the migration workflow.
     */
    arn?: String;
    /**
     * The status of the migration workflow.
     */
    status?: MigrationWorkflowStatusEnum;
    /**
     * The status message of the migration workflow.
     */
    statusMessage?: String;
    /**
     * The time at which the migration workflow was stopped.
     */
    lastStopTime?: Timestamp;
  }
  export type String = string;
  export type StringList = StringListMember[];
  export type StringListMember = string;
  export type StringMap = {[key: string]: StringMapValue};
  export type StringMapKey = string;
  export type StringMapValue = string;
  export type StringValue = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to which you want to add tags.
     */
    resourceArn: ResourceArn;
    /**
     * A collection of labels, in the form of key:value pairs, that apply to this resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TargetType = "SINGLE"|"ALL"|"NONE"|string;
  export type TemplateId = string;
  export interface TemplateInput {
    /**
     * The name of the template.
     */
    inputName?: TemplateInputName;
    /**
     * The data type of the template input.
     */
    dataType?: DataType;
    /**
     * Determine if an input is required from the template.
     */
    required?: Boolean;
  }
  export type TemplateInputList = TemplateInput[];
  export type TemplateInputName = string;
  export type TemplateName = string;
  export type TemplateStatus = "CREATED"|string;
  export interface TemplateStepGroupSummary {
    /**
     * The ID of the step group.
     */
    id?: String;
    /**
     * The name of the step group.
     */
    name?: String;
    /**
     * The previous step group.
     */
    previous?: StringList;
    /**
     * The next step group.
     */
    next?: StringList;
  }
  export type TemplateStepGroupSummaryList = TemplateStepGroupSummary[];
  export interface TemplateStepSummary {
    /**
     * The ID of the step.
     */
    id?: String;
    /**
     * The ID of the step group.
     */
    stepGroupId?: String;
    /**
     * The ID of the template.
     */
    templateId?: String;
    /**
     * The name of the step.
     */
    name?: String;
    /**
     * The action type of the step. You must run and update the status of a manual step for the workflow to continue after the completion of the step.
     */
    stepActionType?: StepActionType;
    /**
     * The servers on which to run the script.
     */
    targetType?: TargetType;
    /**
     * The owner of the step.
     */
    owner?: Owner;
    /**
     * The previous step.
     */
    previous?: StringList;
    /**
     * The next step.
     */
    next?: StringList;
  }
  export type TemplateStepSummaryList = TemplateStepSummary[];
  export interface TemplateSummary {
    /**
     * The ID of the template.
     */
    id?: String;
    /**
     * The name of the template.
     */
    name?: String;
    /**
     * The Amazon Resource Name (ARN) of the template.
     */
    arn?: String;
    /**
     * The description of the template.
     */
    description?: String;
  }
  export type TemplateSummaryList = TemplateSummary[];
  export type Timestamp = Date;
  export interface Tool {
    /**
     * The name of an AWS service. 
     */
    name?: String;
    /**
     * The URL of an AWS service.
     */
    url?: String;
  }
  export type ToolsList = Tool[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource from which you want to remove tags.
     */
    resourceArn: ResourceArn;
    /**
     * One or more tag keys. Specify only the tag keys, not the tag values.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateMigrationWorkflowRequest {
    /**
     * The ID of the migration workflow.
     */
    id: MigrationWorkflowId;
    /**
     * The name of the migration workflow.
     */
    name?: UpdateMigrationWorkflowRequestNameString;
    /**
     * The description of the migration workflow.
     */
    description?: UpdateMigrationWorkflowRequestDescriptionString;
    /**
     * The input parameters required to update a migration workflow.
     */
    inputParameters?: StepInputParameters;
    /**
     * The servers on which a step will be run.
     */
    stepTargets?: StringList;
  }
  export type UpdateMigrationWorkflowRequestDescriptionString = string;
  export type UpdateMigrationWorkflowRequestNameString = string;
  export interface UpdateMigrationWorkflowResponse {
    /**
     * The ID of the migration workflow.
     */
    id?: MigrationWorkflowId;
    /**
     * The Amazon Resource Name (ARN) of the migration workflow.
     */
    arn?: String;
    /**
     * The name of the migration workflow.
     */
    name?: String;
    /**
     * The description of the migration workflow.
     */
    description?: String;
    /**
     * The ID of the template.
     */
    templateId?: String;
    /**
     * The ID of the application configured in Application Discovery Service.
     */
    adsApplicationConfigurationId?: String;
    /**
     * The inputs required to update a migration workflow.
     */
    workflowInputs?: StepInputParameters;
    /**
     * The servers on which a step will be run.
     */
    stepTargets?: StringList;
    /**
     * The status of the migration workflow.
     */
    status?: MigrationWorkflowStatusEnum;
    /**
     * The time at which the migration workflow was created.
     */
    creationTime?: Timestamp;
    /**
     * The time at which the migration workflow was last modified.
     */
    lastModifiedTime?: Timestamp;
    /**
     * The tags added to the migration workflow.
     */
    tags?: StringMap;
  }
  export interface UpdateWorkflowStepGroupRequest {
    /**
     * The ID of the migration workflow.
     */
    workflowId: MigrationWorkflowId;
    /**
     * The ID of the step group.
     */
    id: StepGroupId;
    /**
     * The name of the step group.
     */
    name?: StepGroupName;
    /**
     * The description of the step group.
     */
    description?: StepGroupDescription;
    /**
     * The next step group.
     */
    next?: StringList;
    /**
     * The previous step group.
     */
    previous?: StringList;
  }
  export interface UpdateWorkflowStepGroupResponse {
    /**
     * The ID of the migration workflow.
     */
    workflowId?: String;
    /**
     * The name of the step group.
     */
    name?: String;
    /**
     * The ID of the step group.
     */
    id?: String;
    /**
     * The description of the step group.
     */
    description?: String;
    /**
     * List of AWS services utilized in a migration workflow.
     */
    tools?: ToolsList;
    /**
     * The next step group.
     */
    next?: StringList;
    /**
     * The previous step group.
     */
    previous?: StringList;
    /**
     * The time at which the step group was last modified.
     */
    lastModifiedTime?: Timestamp;
  }
  export interface UpdateWorkflowStepRequest {
    /**
     * The ID of the step.
     */
    id: StepId;
    /**
     * The ID of the step group.
     */
    stepGroupId: StepGroupId;
    /**
     * The ID of the migration workflow.
     */
    workflowId: MigrationWorkflowId;
    /**
     * The name of the step.
     */
    name?: StepName;
    /**
     * The description of the step.
     */
    description?: StepDescription;
    /**
     * The action type of the step. You must run and update the status of a manual step for the workflow to continue after the completion of the step.
     */
    stepActionType?: StepActionType;
    /**
     * The custom script to run tests on the source and target environments.
     */
    workflowStepAutomationConfiguration?: WorkflowStepAutomationConfiguration;
    /**
     * The servers on which a step will be run.
     */
    stepTarget?: StringList;
    /**
     * The outputs of a step.
     */
    outputs?: WorkflowStepOutputList;
    /**
     * The previous step.
     */
    previous?: StringList;
    /**
     * The next step.
     */
    next?: StringList;
    /**
     * The status of the step.
     */
    status?: StepStatus;
  }
  export interface UpdateWorkflowStepResponse {
    /**
     * The ID of the step.
     */
    id?: StepId;
    /**
     * The ID of the step group.
     */
    stepGroupId?: String;
    /**
     * The ID of the migration workflow.
     */
    workflowId?: String;
    /**
     * The name of the step.
     */
    name?: String;
  }
  export interface WorkflowStepAutomationConfiguration {
    /**
     * The Amazon S3 bucket where the script is located.
     */
    scriptLocationS3Bucket?: S3Bucket;
    /**
     * The Amazon S3 key for the script location.
     */
    scriptLocationS3Key?: PlatformScriptKey;
    /**
     * The command required to run the script.
     */
    command?: PlatformCommand;
    /**
     * The source or target environment.
     */
    runEnvironment?: RunEnvironment;
    /**
     * The servers on which to run the script.
     */
    targetType?: TargetType;
  }
  export interface WorkflowStepGroupSummary {
    /**
     * The ID of the step group.
     */
    id?: String;
    /**
     * The name of the step group.
     */
    name?: String;
    /**
     * The owner of the step group.
     */
    owner?: Owner;
    /**
     * The status of the step group.
     */
    status?: StepGroupStatus;
    /**
     * The previous step group.
     */
    previous?: StringList;
    /**
     * The next step group.
     */
    next?: StringList;
  }
  export type WorkflowStepGroupsSummaryList = WorkflowStepGroupSummary[];
  export interface WorkflowStepOutput {
    /**
     * The name of the step.
     */
    name?: WorkflowStepOutputName;
    /**
     * The data type of the output.
     */
    dataType?: DataType;
    /**
     * Determine if an output is required from a step.
     */
    required?: Boolean;
    /**
     * The value of the output.
     */
    value?: WorkflowStepOutputUnion;
  }
  export type WorkflowStepOutputList = WorkflowStepOutput[];
  export type WorkflowStepOutputName = string;
  export interface WorkflowStepOutputUnion {
    /**
     * The integer value. 
     */
    integerValue?: Integer;
    /**
     * The string value.
     */
    stringValue?: StringValue;
    /**
     * The list of string value.
     */
    listOfStringValue?: StringList;
  }
  export interface WorkflowStepSummary {
    /**
     * The ID of the step.
     */
    stepId?: String;
    /**
     * The name of the step.
     */
    name?: String;
    /**
     * The action type of the step. You must run and update the status of a manual step for the workflow to continue after the completion of the step.
     */
    stepActionType?: StepActionType;
    /**
     * The owner of the step.
     */
    owner?: Owner;
    /**
     * The previous step.
     */
    previous?: StringList;
    /**
     * The next step.
     */
    next?: StringList;
    /**
     * The status of the step.
     */
    status?: StepStatus;
    /**
     * The status message of the migration workflow.
     */
    statusMessage?: String;
    /**
     * The number of servers that have been migrated.
     */
    noOfSrvCompleted?: Integer;
    /**
     * The number of servers that have failed to migrate.
     */
    noOfSrvFailed?: Integer;
    /**
     * The total number of servers that have been migrated.
     */
    totalNoOfSrv?: Integer;
    /**
     * The description of the step.
     */
    description?: String;
    /**
     * The location of the script.
     */
    scriptLocation?: String;
  }
  export type WorkflowStepsSummaryList = WorkflowStepSummary[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-08-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MigrationHubOrchestrator client.
   */
  export import Types = MigrationHubOrchestrator;
}
export = MigrationHubOrchestrator;
