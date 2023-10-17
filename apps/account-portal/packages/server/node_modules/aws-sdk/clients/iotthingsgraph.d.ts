import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IoTThingsGraph extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IoTThingsGraph.Types.ClientConfiguration)
  config: Config & IoTThingsGraph.Types.ClientConfiguration;
  /**
   * Associates a device with a concrete thing that is in the user's registry. A thing can be associated with only one device at a time. If you associate a thing with a new device id, its previous association will be removed.
   */
  associateEntityToThing(params: IoTThingsGraph.Types.AssociateEntityToThingRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.AssociateEntityToThingResponse) => void): Request<IoTThingsGraph.Types.AssociateEntityToThingResponse, AWSError>;
  /**
   * Associates a device with a concrete thing that is in the user's registry. A thing can be associated with only one device at a time. If you associate a thing with a new device id, its previous association will be removed.
   */
  associateEntityToThing(callback?: (err: AWSError, data: IoTThingsGraph.Types.AssociateEntityToThingResponse) => void): Request<IoTThingsGraph.Types.AssociateEntityToThingResponse, AWSError>;
  /**
   * Creates a workflow template. Workflows can be created only in the user's namespace. (The public namespace contains only entities.) The workflow can contain only entities in the specified namespace. The workflow is validated against the entities in the latest version of the user's namespace unless another namespace version is specified in the request.
   */
  createFlowTemplate(params: IoTThingsGraph.Types.CreateFlowTemplateRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.CreateFlowTemplateResponse) => void): Request<IoTThingsGraph.Types.CreateFlowTemplateResponse, AWSError>;
  /**
   * Creates a workflow template. Workflows can be created only in the user's namespace. (The public namespace contains only entities.) The workflow can contain only entities in the specified namespace. The workflow is validated against the entities in the latest version of the user's namespace unless another namespace version is specified in the request.
   */
  createFlowTemplate(callback?: (err: AWSError, data: IoTThingsGraph.Types.CreateFlowTemplateResponse) => void): Request<IoTThingsGraph.Types.CreateFlowTemplateResponse, AWSError>;
  /**
   * Creates a system instance.  This action validates the system instance, prepares the deployment-related resources. For Greengrass deployments, it updates the Greengrass group that is specified by the greengrassGroupName parameter. It also adds a file to the S3 bucket specified by the s3BucketName parameter. You need to call DeploySystemInstance after running this action. For Greengrass deployments, since this action modifies and adds resources to a Greengrass group and an S3 bucket on the caller's behalf, the calling identity must have write permissions to both the specified Greengrass group and S3 bucket. Otherwise, the call will fail with an authorization error. For cloud deployments, this action requires a flowActionsRoleArn value. This is an IAM role that has permissions to access AWS services, such as AWS Lambda and AWS IoT, that the flow uses when it executes. If the definition document doesn't specify a version of the user's namespace, the latest version will be used by default.
   */
  createSystemInstance(params: IoTThingsGraph.Types.CreateSystemInstanceRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.CreateSystemInstanceResponse) => void): Request<IoTThingsGraph.Types.CreateSystemInstanceResponse, AWSError>;
  /**
   * Creates a system instance.  This action validates the system instance, prepares the deployment-related resources. For Greengrass deployments, it updates the Greengrass group that is specified by the greengrassGroupName parameter. It also adds a file to the S3 bucket specified by the s3BucketName parameter. You need to call DeploySystemInstance after running this action. For Greengrass deployments, since this action modifies and adds resources to a Greengrass group and an S3 bucket on the caller's behalf, the calling identity must have write permissions to both the specified Greengrass group and S3 bucket. Otherwise, the call will fail with an authorization error. For cloud deployments, this action requires a flowActionsRoleArn value. This is an IAM role that has permissions to access AWS services, such as AWS Lambda and AWS IoT, that the flow uses when it executes. If the definition document doesn't specify a version of the user's namespace, the latest version will be used by default.
   */
  createSystemInstance(callback?: (err: AWSError, data: IoTThingsGraph.Types.CreateSystemInstanceResponse) => void): Request<IoTThingsGraph.Types.CreateSystemInstanceResponse, AWSError>;
  /**
   * Creates a system. The system is validated against the entities in the latest version of the user's namespace unless another namespace version is specified in the request.
   */
  createSystemTemplate(params: IoTThingsGraph.Types.CreateSystemTemplateRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.CreateSystemTemplateResponse) => void): Request<IoTThingsGraph.Types.CreateSystemTemplateResponse, AWSError>;
  /**
   * Creates a system. The system is validated against the entities in the latest version of the user's namespace unless another namespace version is specified in the request.
   */
  createSystemTemplate(callback?: (err: AWSError, data: IoTThingsGraph.Types.CreateSystemTemplateResponse) => void): Request<IoTThingsGraph.Types.CreateSystemTemplateResponse, AWSError>;
  /**
   * Deletes a workflow. Any new system or deployment that contains this workflow will fail to update or deploy. Existing deployments that contain the workflow will continue to run (since they use a snapshot of the workflow taken at the time of deployment).
   */
  deleteFlowTemplate(params: IoTThingsGraph.Types.DeleteFlowTemplateRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.DeleteFlowTemplateResponse) => void): Request<IoTThingsGraph.Types.DeleteFlowTemplateResponse, AWSError>;
  /**
   * Deletes a workflow. Any new system or deployment that contains this workflow will fail to update or deploy. Existing deployments that contain the workflow will continue to run (since they use a snapshot of the workflow taken at the time of deployment).
   */
  deleteFlowTemplate(callback?: (err: AWSError, data: IoTThingsGraph.Types.DeleteFlowTemplateResponse) => void): Request<IoTThingsGraph.Types.DeleteFlowTemplateResponse, AWSError>;
  /**
   * Deletes the specified namespace. This action deletes all of the entities in the namespace. Delete the systems and flows that use entities in the namespace before performing this action. This action takes no request parameters.
   */
  deleteNamespace(params: IoTThingsGraph.Types.DeleteNamespaceRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.DeleteNamespaceResponse) => void): Request<IoTThingsGraph.Types.DeleteNamespaceResponse, AWSError>;
  /**
   * Deletes the specified namespace. This action deletes all of the entities in the namespace. Delete the systems and flows that use entities in the namespace before performing this action. This action takes no request parameters.
   */
  deleteNamespace(callback?: (err: AWSError, data: IoTThingsGraph.Types.DeleteNamespaceResponse) => void): Request<IoTThingsGraph.Types.DeleteNamespaceResponse, AWSError>;
  /**
   * Deletes a system instance. Only system instances that have never been deployed, or that have been undeployed can be deleted. Users can create a new system instance that has the same ID as a deleted system instance.
   */
  deleteSystemInstance(params: IoTThingsGraph.Types.DeleteSystemInstanceRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.DeleteSystemInstanceResponse) => void): Request<IoTThingsGraph.Types.DeleteSystemInstanceResponse, AWSError>;
  /**
   * Deletes a system instance. Only system instances that have never been deployed, or that have been undeployed can be deleted. Users can create a new system instance that has the same ID as a deleted system instance.
   */
  deleteSystemInstance(callback?: (err: AWSError, data: IoTThingsGraph.Types.DeleteSystemInstanceResponse) => void): Request<IoTThingsGraph.Types.DeleteSystemInstanceResponse, AWSError>;
  /**
   * Deletes a system. New deployments can't contain the system after its deletion. Existing deployments that contain the system will continue to work because they use a snapshot of the system that is taken when it is deployed.
   */
  deleteSystemTemplate(params: IoTThingsGraph.Types.DeleteSystemTemplateRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.DeleteSystemTemplateResponse) => void): Request<IoTThingsGraph.Types.DeleteSystemTemplateResponse, AWSError>;
  /**
   * Deletes a system. New deployments can't contain the system after its deletion. Existing deployments that contain the system will continue to work because they use a snapshot of the system that is taken when it is deployed.
   */
  deleteSystemTemplate(callback?: (err: AWSError, data: IoTThingsGraph.Types.DeleteSystemTemplateResponse) => void): Request<IoTThingsGraph.Types.DeleteSystemTemplateResponse, AWSError>;
  /**
   *  Greengrass and Cloud Deployments  Deploys the system instance to the target specified in CreateSystemInstance.   Greengrass Deployments  If the system or any workflows and entities have been updated before this action is called, then the deployment will create a new Amazon Simple Storage Service resource file and then deploy it. Since this action creates a Greengrass deployment on the caller's behalf, the calling identity must have write permissions to the specified Greengrass group. Otherwise, the call will fail with an authorization error. For information about the artifacts that get added to your Greengrass core device when you use this API, see AWS IoT Things Graph and AWS IoT Greengrass.
   */
  deploySystemInstance(params: IoTThingsGraph.Types.DeploySystemInstanceRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.DeploySystemInstanceResponse) => void): Request<IoTThingsGraph.Types.DeploySystemInstanceResponse, AWSError>;
  /**
   *  Greengrass and Cloud Deployments  Deploys the system instance to the target specified in CreateSystemInstance.   Greengrass Deployments  If the system or any workflows and entities have been updated before this action is called, then the deployment will create a new Amazon Simple Storage Service resource file and then deploy it. Since this action creates a Greengrass deployment on the caller's behalf, the calling identity must have write permissions to the specified Greengrass group. Otherwise, the call will fail with an authorization error. For information about the artifacts that get added to your Greengrass core device when you use this API, see AWS IoT Things Graph and AWS IoT Greengrass.
   */
  deploySystemInstance(callback?: (err: AWSError, data: IoTThingsGraph.Types.DeploySystemInstanceResponse) => void): Request<IoTThingsGraph.Types.DeploySystemInstanceResponse, AWSError>;
  /**
   * Deprecates the specified workflow. This action marks the workflow for deletion. Deprecated flows can't be deployed, but existing deployments will continue to run.
   */
  deprecateFlowTemplate(params: IoTThingsGraph.Types.DeprecateFlowTemplateRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.DeprecateFlowTemplateResponse) => void): Request<IoTThingsGraph.Types.DeprecateFlowTemplateResponse, AWSError>;
  /**
   * Deprecates the specified workflow. This action marks the workflow for deletion. Deprecated flows can't be deployed, but existing deployments will continue to run.
   */
  deprecateFlowTemplate(callback?: (err: AWSError, data: IoTThingsGraph.Types.DeprecateFlowTemplateResponse) => void): Request<IoTThingsGraph.Types.DeprecateFlowTemplateResponse, AWSError>;
  /**
   * Deprecates the specified system.
   */
  deprecateSystemTemplate(params: IoTThingsGraph.Types.DeprecateSystemTemplateRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.DeprecateSystemTemplateResponse) => void): Request<IoTThingsGraph.Types.DeprecateSystemTemplateResponse, AWSError>;
  /**
   * Deprecates the specified system.
   */
  deprecateSystemTemplate(callback?: (err: AWSError, data: IoTThingsGraph.Types.DeprecateSystemTemplateResponse) => void): Request<IoTThingsGraph.Types.DeprecateSystemTemplateResponse, AWSError>;
  /**
   * Gets the latest version of the user's namespace and the public version that it is tracking.
   */
  describeNamespace(params: IoTThingsGraph.Types.DescribeNamespaceRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.DescribeNamespaceResponse) => void): Request<IoTThingsGraph.Types.DescribeNamespaceResponse, AWSError>;
  /**
   * Gets the latest version of the user's namespace and the public version that it is tracking.
   */
  describeNamespace(callback?: (err: AWSError, data: IoTThingsGraph.Types.DescribeNamespaceResponse) => void): Request<IoTThingsGraph.Types.DescribeNamespaceResponse, AWSError>;
  /**
   * Dissociates a device entity from a concrete thing. The action takes only the type of the entity that you need to dissociate because only one entity of a particular type can be associated with a thing.
   */
  dissociateEntityFromThing(params: IoTThingsGraph.Types.DissociateEntityFromThingRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.DissociateEntityFromThingResponse) => void): Request<IoTThingsGraph.Types.DissociateEntityFromThingResponse, AWSError>;
  /**
   * Dissociates a device entity from a concrete thing. The action takes only the type of the entity that you need to dissociate because only one entity of a particular type can be associated with a thing.
   */
  dissociateEntityFromThing(callback?: (err: AWSError, data: IoTThingsGraph.Types.DissociateEntityFromThingResponse) => void): Request<IoTThingsGraph.Types.DissociateEntityFromThingResponse, AWSError>;
  /**
   * Gets definitions of the specified entities. Uses the latest version of the user's namespace by default. This API returns the following TDM entities.   Properties   States   Events   Actions   Capabilities   Mappings   Devices   Device Models   Services   This action doesn't return definitions for systems, flows, and deployments.
   */
  getEntities(params: IoTThingsGraph.Types.GetEntitiesRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.GetEntitiesResponse) => void): Request<IoTThingsGraph.Types.GetEntitiesResponse, AWSError>;
  /**
   * Gets definitions of the specified entities. Uses the latest version of the user's namespace by default. This API returns the following TDM entities.   Properties   States   Events   Actions   Capabilities   Mappings   Devices   Device Models   Services   This action doesn't return definitions for systems, flows, and deployments.
   */
  getEntities(callback?: (err: AWSError, data: IoTThingsGraph.Types.GetEntitiesResponse) => void): Request<IoTThingsGraph.Types.GetEntitiesResponse, AWSError>;
  /**
   * Gets the latest version of the DefinitionDocument and FlowTemplateSummary for the specified workflow.
   */
  getFlowTemplate(params: IoTThingsGraph.Types.GetFlowTemplateRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.GetFlowTemplateResponse) => void): Request<IoTThingsGraph.Types.GetFlowTemplateResponse, AWSError>;
  /**
   * Gets the latest version of the DefinitionDocument and FlowTemplateSummary for the specified workflow.
   */
  getFlowTemplate(callback?: (err: AWSError, data: IoTThingsGraph.Types.GetFlowTemplateResponse) => void): Request<IoTThingsGraph.Types.GetFlowTemplateResponse, AWSError>;
  /**
   * Gets revisions of the specified workflow. Only the last 100 revisions are stored. If the workflow has been deprecated, this action will return revisions that occurred before the deprecation. This action won't work for workflows that have been deleted.
   */
  getFlowTemplateRevisions(params: IoTThingsGraph.Types.GetFlowTemplateRevisionsRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.GetFlowTemplateRevisionsResponse) => void): Request<IoTThingsGraph.Types.GetFlowTemplateRevisionsResponse, AWSError>;
  /**
   * Gets revisions of the specified workflow. Only the last 100 revisions are stored. If the workflow has been deprecated, this action will return revisions that occurred before the deprecation. This action won't work for workflows that have been deleted.
   */
  getFlowTemplateRevisions(callback?: (err: AWSError, data: IoTThingsGraph.Types.GetFlowTemplateRevisionsResponse) => void): Request<IoTThingsGraph.Types.GetFlowTemplateRevisionsResponse, AWSError>;
  /**
   * Gets the status of a namespace deletion task.
   */
  getNamespaceDeletionStatus(params: IoTThingsGraph.Types.GetNamespaceDeletionStatusRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.GetNamespaceDeletionStatusResponse) => void): Request<IoTThingsGraph.Types.GetNamespaceDeletionStatusResponse, AWSError>;
  /**
   * Gets the status of a namespace deletion task.
   */
  getNamespaceDeletionStatus(callback?: (err: AWSError, data: IoTThingsGraph.Types.GetNamespaceDeletionStatusResponse) => void): Request<IoTThingsGraph.Types.GetNamespaceDeletionStatusResponse, AWSError>;
  /**
   * Gets a system instance.
   */
  getSystemInstance(params: IoTThingsGraph.Types.GetSystemInstanceRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.GetSystemInstanceResponse) => void): Request<IoTThingsGraph.Types.GetSystemInstanceResponse, AWSError>;
  /**
   * Gets a system instance.
   */
  getSystemInstance(callback?: (err: AWSError, data: IoTThingsGraph.Types.GetSystemInstanceResponse) => void): Request<IoTThingsGraph.Types.GetSystemInstanceResponse, AWSError>;
  /**
   * Gets a system.
   */
  getSystemTemplate(params: IoTThingsGraph.Types.GetSystemTemplateRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.GetSystemTemplateResponse) => void): Request<IoTThingsGraph.Types.GetSystemTemplateResponse, AWSError>;
  /**
   * Gets a system.
   */
  getSystemTemplate(callback?: (err: AWSError, data: IoTThingsGraph.Types.GetSystemTemplateResponse) => void): Request<IoTThingsGraph.Types.GetSystemTemplateResponse, AWSError>;
  /**
   * Gets revisions made to the specified system template. Only the previous 100 revisions are stored. If the system has been deprecated, this action will return the revisions that occurred before its deprecation. This action won't work with systems that have been deleted.
   */
  getSystemTemplateRevisions(params: IoTThingsGraph.Types.GetSystemTemplateRevisionsRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.GetSystemTemplateRevisionsResponse) => void): Request<IoTThingsGraph.Types.GetSystemTemplateRevisionsResponse, AWSError>;
  /**
   * Gets revisions made to the specified system template. Only the previous 100 revisions are stored. If the system has been deprecated, this action will return the revisions that occurred before its deprecation. This action won't work with systems that have been deleted.
   */
  getSystemTemplateRevisions(callback?: (err: AWSError, data: IoTThingsGraph.Types.GetSystemTemplateRevisionsResponse) => void): Request<IoTThingsGraph.Types.GetSystemTemplateRevisionsResponse, AWSError>;
  /**
   * Gets the status of the specified upload.
   */
  getUploadStatus(params: IoTThingsGraph.Types.GetUploadStatusRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.GetUploadStatusResponse) => void): Request<IoTThingsGraph.Types.GetUploadStatusResponse, AWSError>;
  /**
   * Gets the status of the specified upload.
   */
  getUploadStatus(callback?: (err: AWSError, data: IoTThingsGraph.Types.GetUploadStatusResponse) => void): Request<IoTThingsGraph.Types.GetUploadStatusResponse, AWSError>;
  /**
   * Returns a list of objects that contain information about events in a flow execution.
   */
  listFlowExecutionMessages(params: IoTThingsGraph.Types.ListFlowExecutionMessagesRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.ListFlowExecutionMessagesResponse) => void): Request<IoTThingsGraph.Types.ListFlowExecutionMessagesResponse, AWSError>;
  /**
   * Returns a list of objects that contain information about events in a flow execution.
   */
  listFlowExecutionMessages(callback?: (err: AWSError, data: IoTThingsGraph.Types.ListFlowExecutionMessagesResponse) => void): Request<IoTThingsGraph.Types.ListFlowExecutionMessagesResponse, AWSError>;
  /**
   * Lists all tags on an AWS IoT Things Graph resource.
   */
  listTagsForResource(params: IoTThingsGraph.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.ListTagsForResourceResponse) => void): Request<IoTThingsGraph.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags on an AWS IoT Things Graph resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: IoTThingsGraph.Types.ListTagsForResourceResponse) => void): Request<IoTThingsGraph.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Searches for entities of the specified type. You can search for entities in your namespace and the public namespace that you're tracking.
   */
  searchEntities(params: IoTThingsGraph.Types.SearchEntitiesRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.SearchEntitiesResponse) => void): Request<IoTThingsGraph.Types.SearchEntitiesResponse, AWSError>;
  /**
   * Searches for entities of the specified type. You can search for entities in your namespace and the public namespace that you're tracking.
   */
  searchEntities(callback?: (err: AWSError, data: IoTThingsGraph.Types.SearchEntitiesResponse) => void): Request<IoTThingsGraph.Types.SearchEntitiesResponse, AWSError>;
  /**
   * Searches for AWS IoT Things Graph workflow execution instances.
   */
  searchFlowExecutions(params: IoTThingsGraph.Types.SearchFlowExecutionsRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.SearchFlowExecutionsResponse) => void): Request<IoTThingsGraph.Types.SearchFlowExecutionsResponse, AWSError>;
  /**
   * Searches for AWS IoT Things Graph workflow execution instances.
   */
  searchFlowExecutions(callback?: (err: AWSError, data: IoTThingsGraph.Types.SearchFlowExecutionsResponse) => void): Request<IoTThingsGraph.Types.SearchFlowExecutionsResponse, AWSError>;
  /**
   * Searches for summary information about workflows.
   */
  searchFlowTemplates(params: IoTThingsGraph.Types.SearchFlowTemplatesRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.SearchFlowTemplatesResponse) => void): Request<IoTThingsGraph.Types.SearchFlowTemplatesResponse, AWSError>;
  /**
   * Searches for summary information about workflows.
   */
  searchFlowTemplates(callback?: (err: AWSError, data: IoTThingsGraph.Types.SearchFlowTemplatesResponse) => void): Request<IoTThingsGraph.Types.SearchFlowTemplatesResponse, AWSError>;
  /**
   * Searches for system instances in the user's account.
   */
  searchSystemInstances(params: IoTThingsGraph.Types.SearchSystemInstancesRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.SearchSystemInstancesResponse) => void): Request<IoTThingsGraph.Types.SearchSystemInstancesResponse, AWSError>;
  /**
   * Searches for system instances in the user's account.
   */
  searchSystemInstances(callback?: (err: AWSError, data: IoTThingsGraph.Types.SearchSystemInstancesResponse) => void): Request<IoTThingsGraph.Types.SearchSystemInstancesResponse, AWSError>;
  /**
   * Searches for summary information about systems in the user's account. You can filter by the ID of a workflow to return only systems that use the specified workflow.
   */
  searchSystemTemplates(params: IoTThingsGraph.Types.SearchSystemTemplatesRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.SearchSystemTemplatesResponse) => void): Request<IoTThingsGraph.Types.SearchSystemTemplatesResponse, AWSError>;
  /**
   * Searches for summary information about systems in the user's account. You can filter by the ID of a workflow to return only systems that use the specified workflow.
   */
  searchSystemTemplates(callback?: (err: AWSError, data: IoTThingsGraph.Types.SearchSystemTemplatesResponse) => void): Request<IoTThingsGraph.Types.SearchSystemTemplatesResponse, AWSError>;
  /**
   * Searches for things associated with the specified entity. You can search by both device and device model. For example, if two different devices, camera1 and camera2, implement the camera device model, the user can associate thing1 to camera1 and thing2 to camera2. SearchThings(camera2) will return only thing2, but SearchThings(camera) will return both thing1 and thing2. This action searches for exact matches and doesn't perform partial text matching.
   */
  searchThings(params: IoTThingsGraph.Types.SearchThingsRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.SearchThingsResponse) => void): Request<IoTThingsGraph.Types.SearchThingsResponse, AWSError>;
  /**
   * Searches for things associated with the specified entity. You can search by both device and device model. For example, if two different devices, camera1 and camera2, implement the camera device model, the user can associate thing1 to camera1 and thing2 to camera2. SearchThings(camera2) will return only thing2, but SearchThings(camera) will return both thing1 and thing2. This action searches for exact matches and doesn't perform partial text matching.
   */
  searchThings(callback?: (err: AWSError, data: IoTThingsGraph.Types.SearchThingsResponse) => void): Request<IoTThingsGraph.Types.SearchThingsResponse, AWSError>;
  /**
   * Creates a tag for the specified resource.
   */
  tagResource(params: IoTThingsGraph.Types.TagResourceRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.TagResourceResponse) => void): Request<IoTThingsGraph.Types.TagResourceResponse, AWSError>;
  /**
   * Creates a tag for the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: IoTThingsGraph.Types.TagResourceResponse) => void): Request<IoTThingsGraph.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a system instance from its target (Cloud or Greengrass).
   */
  undeploySystemInstance(params: IoTThingsGraph.Types.UndeploySystemInstanceRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.UndeploySystemInstanceResponse) => void): Request<IoTThingsGraph.Types.UndeploySystemInstanceResponse, AWSError>;
  /**
   * Removes a system instance from its target (Cloud or Greengrass).
   */
  undeploySystemInstance(callback?: (err: AWSError, data: IoTThingsGraph.Types.UndeploySystemInstanceResponse) => void): Request<IoTThingsGraph.Types.UndeploySystemInstanceResponse, AWSError>;
  /**
   * Removes a tag from the specified resource.
   */
  untagResource(params: IoTThingsGraph.Types.UntagResourceRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.UntagResourceResponse) => void): Request<IoTThingsGraph.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a tag from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: IoTThingsGraph.Types.UntagResourceResponse) => void): Request<IoTThingsGraph.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the specified workflow. All deployed systems and system instances that use the workflow will see the changes in the flow when it is redeployed. If you don't want this behavior, copy the workflow (creating a new workflow with a different ID), and update the copy. The workflow can contain only entities in the specified namespace. 
   */
  updateFlowTemplate(params: IoTThingsGraph.Types.UpdateFlowTemplateRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.UpdateFlowTemplateResponse) => void): Request<IoTThingsGraph.Types.UpdateFlowTemplateResponse, AWSError>;
  /**
   * Updates the specified workflow. All deployed systems and system instances that use the workflow will see the changes in the flow when it is redeployed. If you don't want this behavior, copy the workflow (creating a new workflow with a different ID), and update the copy. The workflow can contain only entities in the specified namespace. 
   */
  updateFlowTemplate(callback?: (err: AWSError, data: IoTThingsGraph.Types.UpdateFlowTemplateResponse) => void): Request<IoTThingsGraph.Types.UpdateFlowTemplateResponse, AWSError>;
  /**
   * Updates the specified system. You don't need to run this action after updating a workflow. Any deployment that uses the system will see the changes in the system when it is redeployed.
   */
  updateSystemTemplate(params: IoTThingsGraph.Types.UpdateSystemTemplateRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.UpdateSystemTemplateResponse) => void): Request<IoTThingsGraph.Types.UpdateSystemTemplateResponse, AWSError>;
  /**
   * Updates the specified system. You don't need to run this action after updating a workflow. Any deployment that uses the system will see the changes in the system when it is redeployed.
   */
  updateSystemTemplate(callback?: (err: AWSError, data: IoTThingsGraph.Types.UpdateSystemTemplateResponse) => void): Request<IoTThingsGraph.Types.UpdateSystemTemplateResponse, AWSError>;
  /**
   * Asynchronously uploads one or more entity definitions to the user's namespace. The document parameter is required if syncWithPublicNamespace and deleteExistingEntites are false. If the syncWithPublicNamespace parameter is set to true, the user's namespace will synchronize with the latest version of the public namespace. If deprecateExistingEntities is set to true, all entities in the latest version will be deleted before the new DefinitionDocument is uploaded. When a user uploads entity definitions for the first time, the service creates a new namespace for the user. The new namespace tracks the public namespace. Currently users can have only one namespace. The namespace version increments whenever a user uploads entity definitions that are backwards-incompatible and whenever a user sets the syncWithPublicNamespace parameter or the deprecateExistingEntities parameter to true. The IDs for all of the entities should be in URN format. Each entity must be in the user's namespace. Users can't create entities in the public namespace, but entity definitions can refer to entities in the public namespace. Valid entities are Device, DeviceModel, Service, Capability, State, Action, Event, Property, Mapping, Enum. 
   */
  uploadEntityDefinitions(params: IoTThingsGraph.Types.UploadEntityDefinitionsRequest, callback?: (err: AWSError, data: IoTThingsGraph.Types.UploadEntityDefinitionsResponse) => void): Request<IoTThingsGraph.Types.UploadEntityDefinitionsResponse, AWSError>;
  /**
   * Asynchronously uploads one or more entity definitions to the user's namespace. The document parameter is required if syncWithPublicNamespace and deleteExistingEntites are false. If the syncWithPublicNamespace parameter is set to true, the user's namespace will synchronize with the latest version of the public namespace. If deprecateExistingEntities is set to true, all entities in the latest version will be deleted before the new DefinitionDocument is uploaded. When a user uploads entity definitions for the first time, the service creates a new namespace for the user. The new namespace tracks the public namespace. Currently users can have only one namespace. The namespace version increments whenever a user uploads entity definitions that are backwards-incompatible and whenever a user sets the syncWithPublicNamespace parameter or the deprecateExistingEntities parameter to true. The IDs for all of the entities should be in URN format. Each entity must be in the user's namespace. Users can't create entities in the public namespace, but entity definitions can refer to entities in the public namespace. Valid entities are Device, DeviceModel, Service, Capability, State, Action, Event, Property, Mapping, Enum. 
   */
  uploadEntityDefinitions(callback?: (err: AWSError, data: IoTThingsGraph.Types.UploadEntityDefinitionsResponse) => void): Request<IoTThingsGraph.Types.UploadEntityDefinitionsResponse, AWSError>;
}
declare namespace IoTThingsGraph {
  export type Arn = string;
  export interface AssociateEntityToThingRequest {
    /**
     * The name of the thing to which the entity is to be associated.
     */
    thingName: ThingName;
    /**
     * The ID of the device to be associated with the thing. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:device:DEVICENAME 
     */
    entityId: Urn;
    /**
     * The version of the user's namespace. Defaults to the latest version of the user's namespace.
     */
    namespaceVersion?: Version;
  }
  export interface AssociateEntityToThingResponse {
  }
  export interface CreateFlowTemplateRequest {
    /**
     * The workflow DefinitionDocument.
     */
    definition: DefinitionDocument;
    /**
     * The namespace version in which the workflow is to be created. If no value is specified, the latest version is used by default.
     */
    compatibleNamespaceVersion?: Version;
  }
  export interface CreateFlowTemplateResponse {
    /**
     * The summary object that describes the created workflow.
     */
    summary?: FlowTemplateSummary;
  }
  export interface CreateSystemInstanceRequest {
    /**
     * Metadata, consisting of key-value pairs, that can be used to categorize your system instances.
     */
    tags?: TagList;
    definition: DefinitionDocument;
    /**
     * The target type of the deployment. Valid values are GREENGRASS and CLOUD.
     */
    target: DeploymentTarget;
    /**
     * The name of the Greengrass group where the system instance will be deployed. This value is required if the value of the target parameter is GREENGRASS.
     */
    greengrassGroupName?: GroupName;
    /**
     * The name of the Amazon Simple Storage Service bucket that will be used to store and deploy the system instance's resource file. This value is required if the value of the target parameter is GREENGRASS.
     */
    s3BucketName?: S3BucketName;
    metricsConfiguration?: MetricsConfiguration;
    /**
     * The ARN of the IAM role that AWS IoT Things Graph will assume when it executes the flow. This role must have read and write access to AWS Lambda and AWS IoT and any other AWS services that the flow uses when it executes. This value is required if the value of the target parameter is CLOUD.
     */
    flowActionsRoleArn?: RoleArn;
  }
  export interface CreateSystemInstanceResponse {
    /**
     * The summary object that describes the new system instance.
     */
    summary?: SystemInstanceSummary;
  }
  export interface CreateSystemTemplateRequest {
    /**
     * The DefinitionDocument used to create the system.
     */
    definition: DefinitionDocument;
    /**
     * The namespace version in which the system is to be created. If no value is specified, the latest version is used by default.
     */
    compatibleNamespaceVersion?: Version;
  }
  export interface CreateSystemTemplateResponse {
    /**
     * The summary object that describes the created system.
     */
    summary?: SystemTemplateSummary;
  }
  export interface DefinitionDocument {
    /**
     * The language used to define the entity. GRAPHQL is the only valid value.
     */
    language: DefinitionLanguage;
    /**
     * The GraphQL text that defines the entity.
     */
    text: DefinitionText;
  }
  export type DefinitionLanguage = "GRAPHQL"|string;
  export type DefinitionText = string;
  export interface DeleteFlowTemplateRequest {
    /**
     * The ID of the workflow to be deleted. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:workflow:WORKFLOWNAME 
     */
    id: Urn;
  }
  export interface DeleteFlowTemplateResponse {
  }
  export interface DeleteNamespaceRequest {
  }
  export interface DeleteNamespaceResponse {
    /**
     * The ARN of the namespace to be deleted.
     */
    namespaceArn?: Arn;
    /**
     * The name of the namespace to be deleted.
     */
    namespaceName?: NamespaceName;
  }
  export interface DeleteSystemInstanceRequest {
    /**
     * The ID of the system instance to be deleted.
     */
    id?: Urn;
  }
  export interface DeleteSystemInstanceResponse {
  }
  export interface DeleteSystemTemplateRequest {
    /**
     * The ID of the system to be deleted. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:system:SYSTEMNAME 
     */
    id: Urn;
  }
  export interface DeleteSystemTemplateResponse {
  }
  export interface DependencyRevision {
    /**
     * The ID of the workflow or system.
     */
    id?: Urn;
    /**
     * The revision number of the workflow or system.
     */
    revisionNumber?: Version;
  }
  export type DependencyRevisions = DependencyRevision[];
  export interface DeploySystemInstanceRequest {
    /**
     * The ID of the system instance. This value is returned by the CreateSystemInstance action. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:deployment:DEPLOYMENTNAME 
     */
    id?: Urn;
  }
  export interface DeploySystemInstanceResponse {
    /**
     * An object that contains summary information about a system instance that was deployed. 
     */
    summary: SystemInstanceSummary;
    /**
     * The ID of the Greengrass deployment used to deploy the system instance.
     */
    greengrassDeploymentId?: GreengrassDeploymentId;
  }
  export type DeploymentTarget = "GREENGRASS"|"CLOUD"|string;
  export type DeprecateExistingEntities = boolean;
  export interface DeprecateFlowTemplateRequest {
    /**
     * The ID of the workflow to be deleted. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:workflow:WORKFLOWNAME 
     */
    id: Urn;
  }
  export interface DeprecateFlowTemplateResponse {
  }
  export interface DeprecateSystemTemplateRequest {
    /**
     * The ID of the system to delete. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:system:SYSTEMNAME 
     */
    id: Urn;
  }
  export interface DeprecateSystemTemplateResponse {
  }
  export interface DescribeNamespaceRequest {
    /**
     * The name of the user's namespace. Set this to aws to get the public namespace.
     */
    namespaceName?: NamespaceName;
  }
  export interface DescribeNamespaceResponse {
    /**
     * The ARN of the namespace.
     */
    namespaceArn?: Arn;
    /**
     * The name of the namespace.
     */
    namespaceName?: NamespaceName;
    /**
     * The name of the public namespace that the latest namespace version is tracking.
     */
    trackingNamespaceName?: NamespaceName;
    /**
     * The version of the public namespace that the latest version is tracking.
     */
    trackingNamespaceVersion?: Version;
    /**
     * The version of the user's namespace to describe.
     */
    namespaceVersion?: Version;
  }
  export interface DissociateEntityFromThingRequest {
    /**
     * The name of the thing to disassociate.
     */
    thingName: ThingName;
    /**
     * The entity type from which to disassociate the thing.
     */
    entityType: EntityType;
  }
  export interface DissociateEntityFromThingResponse {
  }
  export type Enabled = boolean;
  export interface EntityDescription {
    /**
     * The entity ID.
     */
    id?: Urn;
    /**
     * The entity ARN.
     */
    arn?: Arn;
    /**
     * The entity type.
     */
    type?: EntityType;
    /**
     * The time at which the entity was created.
     */
    createdAt?: Timestamp;
    /**
     * The definition document of the entity.
     */
    definition?: DefinitionDocument;
  }
  export type EntityDescriptions = EntityDescription[];
  export interface EntityFilter {
    /**
     * The name of the entity search filter field. REFERENCED_ENTITY_ID filters on entities that are used by the entity in the result set. For example, you can filter on the ID of a property that is used in a state.
     */
    name?: EntityFilterName;
    /**
     * An array of string values for the search filter field. Multiple values function as AND criteria in the search.
     */
    value?: EntityFilterValues;
  }
  export type EntityFilterName = "NAME"|"NAMESPACE"|"SEMANTIC_TYPE_PATH"|"REFERENCED_ENTITY_ID"|string;
  export type EntityFilterValue = string;
  export type EntityFilterValues = EntityFilterValue[];
  export type EntityFilters = EntityFilter[];
  export type EntityType = "DEVICE"|"SERVICE"|"DEVICE_MODEL"|"CAPABILITY"|"STATE"|"ACTION"|"EVENT"|"PROPERTY"|"MAPPING"|"ENUM"|string;
  export type EntityTypes = EntityType[];
  export type FlowExecutionEventType = "EXECUTION_STARTED"|"EXECUTION_FAILED"|"EXECUTION_ABORTED"|"EXECUTION_SUCCEEDED"|"STEP_STARTED"|"STEP_FAILED"|"STEP_SUCCEEDED"|"ACTIVITY_SCHEDULED"|"ACTIVITY_STARTED"|"ACTIVITY_FAILED"|"ACTIVITY_SUCCEEDED"|"START_FLOW_EXECUTION_TASK"|"SCHEDULE_NEXT_READY_STEPS_TASK"|"THING_ACTION_TASK"|"THING_ACTION_TASK_FAILED"|"THING_ACTION_TASK_SUCCEEDED"|"ACKNOWLEDGE_TASK_MESSAGE"|string;
  export type FlowExecutionId = string;
  export interface FlowExecutionMessage {
    /**
     * The unique identifier of the message.
     */
    messageId?: FlowExecutionMessageId;
    /**
     * The type of flow event .
     */
    eventType?: FlowExecutionEventType;
    /**
     * The date and time when the message was last updated.
     */
    timestamp?: Timestamp;
    /**
     * A string containing information about the flow event.
     */
    payload?: FlowExecutionMessagePayload;
  }
  export type FlowExecutionMessageId = string;
  export type FlowExecutionMessagePayload = string;
  export type FlowExecutionMessages = FlowExecutionMessage[];
  export type FlowExecutionStatus = "RUNNING"|"ABORTED"|"SUCCEEDED"|"FAILED"|string;
  export type FlowExecutionSummaries = FlowExecutionSummary[];
  export interface FlowExecutionSummary {
    /**
     * The ID of the flow execution.
     */
    flowExecutionId?: FlowExecutionId;
    /**
     * The current status of the flow execution.
     */
    status?: FlowExecutionStatus;
    /**
     * The ID of the system instance that contains the flow.
     */
    systemInstanceId?: Urn;
    /**
     * The ID of the flow.
     */
    flowTemplateId?: Urn;
    /**
     * The date and time when the flow execution summary was created.
     */
    createdAt?: Timestamp;
    /**
     * The date and time when the flow execution summary was last updated.
     */
    updatedAt?: Timestamp;
  }
  export interface FlowTemplateDescription {
    /**
     * An object that contains summary information about a workflow.
     */
    summary?: FlowTemplateSummary;
    /**
     * A workflow's definition document.
     */
    definition?: DefinitionDocument;
    /**
     * The version of the user's namespace against which the workflow was validated. Use this value in your system instance.
     */
    validatedNamespaceVersion?: Version;
  }
  export interface FlowTemplateFilter {
    /**
     * The name of the search filter field.
     */
    name: FlowTemplateFilterName;
    /**
     * An array of string values for the search filter field. Multiple values function as AND criteria in the search.
     */
    value: FlowTemplateFilterValues;
  }
  export type FlowTemplateFilterName = "DEVICE_MODEL_ID"|string;
  export type FlowTemplateFilterValue = string;
  export type FlowTemplateFilterValues = FlowTemplateFilterValue[];
  export type FlowTemplateFilters = FlowTemplateFilter[];
  export type FlowTemplateSummaries = FlowTemplateSummary[];
  export interface FlowTemplateSummary {
    /**
     * The ID of the workflow.
     */
    id?: Urn;
    /**
     * The ARN of the workflow.
     */
    arn?: Arn;
    /**
     * The revision number of the workflow.
     */
    revisionNumber?: Version;
    /**
     * The date when the workflow was created.
     */
    createdAt?: Timestamp;
  }
  export interface GetEntitiesRequest {
    /**
     * An array of entity IDs. The IDs should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:device:DEVICENAME 
     */
    ids: Urns;
    /**
     * The version of the user's namespace. Defaults to the latest version of the user's namespace.
     */
    namespaceVersion?: Version;
  }
  export interface GetEntitiesResponse {
    /**
     * An array of descriptions for the specified entities.
     */
    descriptions?: EntityDescriptions;
  }
  export interface GetFlowTemplateRequest {
    /**
     * The ID of the workflow. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:workflow:WORKFLOWNAME 
     */
    id: Urn;
    /**
     * The number of the workflow revision to retrieve.
     */
    revisionNumber?: Version;
  }
  export interface GetFlowTemplateResponse {
    /**
     * The object that describes the specified workflow.
     */
    description?: FlowTemplateDescription;
  }
  export interface GetFlowTemplateRevisionsRequest {
    /**
     * The ID of the workflow. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:workflow:WORKFLOWNAME 
     */
    id: Urn;
    /**
     * The string that specifies the next page of results. Use this when you're paginating results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in the response.
     */
    maxResults?: MaxResults;
  }
  export interface GetFlowTemplateRevisionsResponse {
    /**
     * An array of objects that provide summary data about each revision.
     */
    summaries?: FlowTemplateSummaries;
    /**
     * The string to specify as nextToken when you request the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface GetNamespaceDeletionStatusRequest {
  }
  export interface GetNamespaceDeletionStatusResponse {
    /**
     * The ARN of the namespace that is being deleted.
     */
    namespaceArn?: Arn;
    /**
     * The name of the namespace that is being deleted.
     */
    namespaceName?: NamespaceName;
    /**
     * The status of the deletion request.
     */
    status?: NamespaceDeletionStatus;
    /**
     * An error code returned by the namespace deletion task.
     */
    errorCode?: NamespaceDeletionStatusErrorCodes;
    /**
     * An error code returned by the namespace deletion task.
     */
    errorMessage?: String;
  }
  export interface GetSystemInstanceRequest {
    /**
     * The ID of the system deployment instance. This value is returned by CreateSystemInstance. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:deployment:DEPLOYMENTNAME 
     */
    id: Urn;
  }
  export interface GetSystemInstanceResponse {
    /**
     * An object that describes the system instance.
     */
    description?: SystemInstanceDescription;
  }
  export interface GetSystemTemplateRequest {
    /**
     * The ID of the system to get. This ID must be in the user's namespace. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:system:SYSTEMNAME 
     */
    id: Urn;
    /**
     * The number that specifies the revision of the system to get.
     */
    revisionNumber?: Version;
  }
  export interface GetSystemTemplateResponse {
    /**
     * An object that contains summary data about the system.
     */
    description?: SystemTemplateDescription;
  }
  export interface GetSystemTemplateRevisionsRequest {
    /**
     * The ID of the system template. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:system:SYSTEMNAME 
     */
    id: Urn;
    /**
     * The string that specifies the next page of results. Use this when you're paginating results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in the response.
     */
    maxResults?: MaxResults;
  }
  export interface GetSystemTemplateRevisionsResponse {
    /**
     * An array of objects that contain summary data about the system template revisions.
     */
    summaries?: SystemTemplateSummaries;
    /**
     * The string to specify as nextToken when you request the next page of results. 
     */
    nextToken?: NextToken;
  }
  export interface GetUploadStatusRequest {
    /**
     * The ID of the upload. This value is returned by the UploadEntityDefinitions action.
     */
    uploadId: UploadId;
  }
  export interface GetUploadStatusResponse {
    /**
     * The ID of the upload.
     */
    uploadId: UploadId;
    /**
     * The status of the upload. The initial status is IN_PROGRESS. The response show all validation failures if the upload fails.
     */
    uploadStatus: UploadStatus;
    /**
     * The ARN of the upload.
     */
    namespaceArn?: Arn;
    /**
     * The name of the upload's namespace.
     */
    namespaceName?: NamespaceName;
    /**
     * The version of the user's namespace. Defaults to the latest version of the user's namespace.
     */
    namespaceVersion?: Version;
    /**
     * The reason for an upload failure.
     */
    failureReason?: StringList;
    /**
     * The date at which the upload was created.
     */
    createdDate: Timestamp;
  }
  export type GreengrassDeploymentId = string;
  export type GreengrassGroupId = string;
  export type GreengrassGroupVersionId = string;
  export type GroupName = string;
  export interface ListFlowExecutionMessagesRequest {
    /**
     * The ID of the flow execution.
     */
    flowExecutionId: FlowExecutionId;
    /**
     * The string that specifies the next page of results. Use this when you're paginating results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in the response.
     */
    maxResults?: MaxResults;
  }
  export interface ListFlowExecutionMessagesResponse {
    /**
     * A list of objects that contain information about events in the specified flow execution.
     */
    messages?: FlowExecutionMessages;
    /**
     * The string to specify as nextToken when you request the next page of results. 
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The maximum number of tags to return.
     */
    maxResults?: MaxResults;
    /**
     * The Amazon Resource Name (ARN) of the resource whose tags are to be returned.
     */
    resourceArn: ResourceArn;
    /**
     * The token that specifies the next page of results to return.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceResponse {
    /**
     * List of tags returned by the ListTagsForResource operation.
     */
    tags?: TagList;
    /**
     * The token that specifies the next page of results to return.
     */
    nextToken?: NextToken;
  }
  export type MaxResults = number;
  export interface MetricsConfiguration {
    /**
     * A Boolean that specifies whether cloud metrics are collected.
     */
    cloudMetricEnabled?: Enabled;
    /**
     * The ARN of the role that is used to collect cloud metrics.
     */
    metricRuleRoleArn?: RoleArn;
  }
  export type NamespaceDeletionStatus = "IN_PROGRESS"|"SUCCEEDED"|"FAILED"|string;
  export type NamespaceDeletionStatusErrorCodes = "VALIDATION_FAILED"|string;
  export type NamespaceName = string;
  export type NextToken = string;
  export type ResourceArn = string;
  export type RoleArn = string;
  export type S3BucketName = string;
  export interface SearchEntitiesRequest {
    /**
     * The entity types for which to search.
     */
    entityTypes: EntityTypes;
    /**
     * Optional filter to apply to the search. Valid filters are NAME NAMESPACE, SEMANTIC_TYPE_PATH and REFERENCED_ENTITY_ID. REFERENCED_ENTITY_ID filters on entities that are used by the entity in the result set. For example, you can filter on the ID of a property that is used in a state. Multiple filters function as OR criteria in the query. Multiple values passed inside the filter function as AND criteria.
     */
    filters?: EntityFilters;
    /**
     * The string that specifies the next page of results. Use this when you're paginating results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in the response.
     */
    maxResults?: MaxResults;
    /**
     * The version of the user's namespace. Defaults to the latest version of the user's namespace.
     */
    namespaceVersion?: Version;
  }
  export interface SearchEntitiesResponse {
    /**
     * An array of descriptions for each entity returned in the search result.
     */
    descriptions?: EntityDescriptions;
    /**
     * The string to specify as nextToken when you request the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface SearchFlowExecutionsRequest {
    /**
     * The ID of the system instance that contains the flow.
     */
    systemInstanceId: Urn;
    /**
     * The ID of a flow execution.
     */
    flowExecutionId?: FlowExecutionId;
    /**
     * The date and time of the earliest flow execution to return.
     */
    startTime?: Timestamp;
    /**
     * The date and time of the latest flow execution to return.
     */
    endTime?: Timestamp;
    /**
     * The string that specifies the next page of results. Use this when you're paginating results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in the response.
     */
    maxResults?: MaxResults;
  }
  export interface SearchFlowExecutionsResponse {
    /**
     * An array of objects that contain summary information about each workflow execution in the result set.
     */
    summaries?: FlowExecutionSummaries;
    /**
     * The string to specify as nextToken when you request the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface SearchFlowTemplatesRequest {
    /**
     * An array of objects that limit the result set. The only valid filter is DEVICE_MODEL_ID.
     */
    filters?: FlowTemplateFilters;
    /**
     * The string that specifies the next page of results. Use this when you're paginating results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in the response.
     */
    maxResults?: MaxResults;
  }
  export interface SearchFlowTemplatesResponse {
    /**
     * An array of objects that contain summary information about each workflow in the result set.
     */
    summaries?: FlowTemplateSummaries;
    /**
     * The string to specify as nextToken when you request the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface SearchSystemInstancesRequest {
    /**
     * Optional filter to apply to the search. Valid filters are SYSTEM_TEMPLATE_ID, STATUS, and GREENGRASS_GROUP_NAME. Multiple filters function as OR criteria in the query. Multiple values passed inside the filter function as AND criteria.
     */
    filters?: SystemInstanceFilters;
    /**
     * The string that specifies the next page of results. Use this when you're paginating results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in the response.
     */
    maxResults?: MaxResults;
  }
  export interface SearchSystemInstancesResponse {
    /**
     * An array of objects that contain summary data abour the system instances in the result set.
     */
    summaries?: SystemInstanceSummaries;
    /**
     * The string to specify as nextToken when you request the next page of results. 
     */
    nextToken?: NextToken;
  }
  export interface SearchSystemTemplatesRequest {
    /**
     * An array of filters that limit the result set. The only valid filter is FLOW_TEMPLATE_ID.
     */
    filters?: SystemTemplateFilters;
    /**
     * The string that specifies the next page of results. Use this when you're paginating results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in the response.
     */
    maxResults?: MaxResults;
  }
  export interface SearchSystemTemplatesResponse {
    /**
     * An array of objects that contain summary information about each system deployment in the result set.
     */
    summaries?: SystemTemplateSummaries;
    /**
     * The string to specify as nextToken when you request the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface SearchThingsRequest {
    /**
     * The ID of the entity to which the things are associated. The IDs should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:device:DEVICENAME 
     */
    entityId: Urn;
    /**
     * The string that specifies the next page of results. Use this when you're paginating results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in the response.
     */
    maxResults?: MaxResults;
    /**
     * The version of the user's namespace. Defaults to the latest version of the user's namespace.
     */
    namespaceVersion?: Version;
  }
  export interface SearchThingsResponse {
    /**
     * An array of things in the result set.
     */
    things?: Things;
    /**
     * The string to specify as nextToken when you request the next page of results.
     */
    nextToken?: NextToken;
  }
  export type String = string;
  export type StringList = String[];
  export type SyncWithPublicNamespace = boolean;
  export type SystemInstanceDeploymentStatus = "NOT_DEPLOYED"|"BOOTSTRAP"|"DEPLOY_IN_PROGRESS"|"DEPLOYED_IN_TARGET"|"UNDEPLOY_IN_PROGRESS"|"FAILED"|"PENDING_DELETE"|"DELETED_IN_TARGET"|string;
  export interface SystemInstanceDescription {
    /**
     * An object that contains summary information about a system instance.
     */
    summary?: SystemInstanceSummary;
    definition?: DefinitionDocument;
    /**
     * The Amazon Simple Storage Service bucket where information about a system instance is stored.
     */
    s3BucketName?: S3BucketName;
    metricsConfiguration?: MetricsConfiguration;
    /**
     * The version of the user's namespace against which the system instance was validated.
     */
    validatedNamespaceVersion?: Version;
    /**
     * A list of objects that contain all of the IDs and revision numbers of workflows and systems that are used in a system instance.
     */
    validatedDependencyRevisions?: DependencyRevisions;
    /**
     * The AWS Identity and Access Management (IAM) role that AWS IoT Things Graph assumes during flow execution in a cloud deployment. This role must have read and write permissionss to AWS Lambda and AWS IoT and to any other AWS services that the flow uses.
     */
    flowActionsRoleArn?: RoleArn;
  }
  export interface SystemInstanceFilter {
    /**
     * The name of the search filter field.
     */
    name?: SystemInstanceFilterName;
    /**
     * An array of string values for the search filter field. Multiple values function as AND criteria in the search. 
     */
    value?: SystemInstanceFilterValues;
  }
  export type SystemInstanceFilterName = "SYSTEM_TEMPLATE_ID"|"STATUS"|"GREENGRASS_GROUP_NAME"|string;
  export type SystemInstanceFilterValue = string;
  export type SystemInstanceFilterValues = SystemInstanceFilterValue[];
  export type SystemInstanceFilters = SystemInstanceFilter[];
  export type SystemInstanceSummaries = SystemInstanceSummary[];
  export interface SystemInstanceSummary {
    /**
     * The ID of the system instance.
     */
    id?: Urn;
    /**
     * The ARN of the system instance.
     */
    arn?: Arn;
    /**
     * The status of the system instance.
     */
    status?: SystemInstanceDeploymentStatus;
    /**
     * The target of the system instance.
     */
    target?: DeploymentTarget;
    /**
     * The ID of the Greengrass group where the system instance is deployed.
     */
    greengrassGroupName?: GroupName;
    /**
     * The date when the system instance was created.
     */
    createdAt?: Timestamp;
    /**
     *  The date and time when the system instance was last updated.
     */
    updatedAt?: Timestamp;
    /**
     * The ID of the Greengrass group where the system instance is deployed.
     */
    greengrassGroupId?: GreengrassGroupId;
    /**
     * The version of the Greengrass group where the system instance is deployed.
     */
    greengrassGroupVersionId?: GreengrassGroupVersionId;
  }
  export interface SystemTemplateDescription {
    /**
     * An object that contains summary information about a system.
     */
    summary?: SystemTemplateSummary;
    /**
     * The definition document of a system.
     */
    definition?: DefinitionDocument;
    /**
     * The namespace version against which the system was validated. Use this value in your system instance.
     */
    validatedNamespaceVersion?: Version;
  }
  export interface SystemTemplateFilter {
    /**
     * The name of the system search filter field.
     */
    name: SystemTemplateFilterName;
    /**
     * An array of string values for the search filter field. Multiple values function as AND criteria in the search.
     */
    value: SystemTemplateFilterValues;
  }
  export type SystemTemplateFilterName = "FLOW_TEMPLATE_ID"|string;
  export type SystemTemplateFilterValue = string;
  export type SystemTemplateFilterValues = SystemTemplateFilterValue[];
  export type SystemTemplateFilters = SystemTemplateFilter[];
  export type SystemTemplateSummaries = SystemTemplateSummary[];
  export interface SystemTemplateSummary {
    /**
     * The ID of the system.
     */
    id?: Urn;
    /**
     * The ARN of the system.
     */
    arn?: Arn;
    /**
     * The revision number of the system.
     */
    revisionNumber?: Version;
    /**
     * The date when the system was created.
     */
    createdAt?: Timestamp;
  }
  export interface Tag {
    /**
     * The required name of the tag. The string value can be from 1 to 128 Unicode characters in length.
     */
    key: TagKey;
    /**
     * The optional value of the tag. The string value can be from 1 to 256 Unicode characters in length.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource whose tags are returned.
     */
    resourceArn: ResourceArn;
    /**
     * A list of tags to add to the resource.&gt;
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface Thing {
    /**
     * The ARN of the thing.
     */
    thingArn?: ThingArn;
    /**
     * The name of the thing.
     */
    thingName?: ThingName;
  }
  export type ThingArn = string;
  export type ThingName = string;
  export type Things = Thing[];
  export type Timestamp = Date;
  export interface UndeploySystemInstanceRequest {
    /**
     * The ID of the system instance to remove from its target.
     */
    id?: Urn;
  }
  export interface UndeploySystemInstanceResponse {
    /**
     * An object that contains summary information about the system instance that was removed from its target.
     */
    summary?: SystemInstanceSummary;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource whose tags are to be removed.
     */
    resourceArn: ResourceArn;
    /**
     * A list of tag key names to remove from the resource. You don't specify the value. Both the key and its associated value are removed.  This parameter to the API requires a JSON text string argument. For information on how to format a JSON parameter for the various command line tool environments, see Using JSON for Parameters in the AWS CLI User Guide. 
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateFlowTemplateRequest {
    /**
     * The ID of the workflow to be updated. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:workflow:WORKFLOWNAME 
     */
    id: Urn;
    /**
     * The DefinitionDocument that contains the updated workflow definition.
     */
    definition: DefinitionDocument;
    /**
     * The version of the user's namespace. If no value is specified, the latest version is used by default. Use the GetFlowTemplateRevisions if you want to find earlier revisions of the flow to update.
     */
    compatibleNamespaceVersion?: Version;
  }
  export interface UpdateFlowTemplateResponse {
    /**
     * An object containing summary information about the updated workflow.
     */
    summary?: FlowTemplateSummary;
  }
  export interface UpdateSystemTemplateRequest {
    /**
     * The ID of the system to be updated. The ID should be in the following format.  urn:tdm:REGION/ACCOUNT ID/default:system:SYSTEMNAME 
     */
    id: Urn;
    /**
     * The DefinitionDocument that contains the updated system definition.
     */
    definition: DefinitionDocument;
    /**
     * The version of the user's namespace. Defaults to the latest version of the user's namespace. If no value is specified, the latest version is used by default.
     */
    compatibleNamespaceVersion?: Version;
  }
  export interface UpdateSystemTemplateResponse {
    /**
     * An object containing summary information about the updated system.
     */
    summary?: SystemTemplateSummary;
  }
  export interface UploadEntityDefinitionsRequest {
    /**
     * The DefinitionDocument that defines the updated entities.
     */
    document?: DefinitionDocument;
    /**
     * A Boolean that specifies whether to synchronize with the latest version of the public namespace. If set to true, the upload will create a new namespace version.
     */
    syncWithPublicNamespace?: SyncWithPublicNamespace;
    /**
     * A Boolean that specifies whether to deprecate all entities in the latest version before uploading the new DefinitionDocument. If set to true, the upload will create a new namespace version.
     */
    deprecateExistingEntities?: DeprecateExistingEntities;
  }
  export interface UploadEntityDefinitionsResponse {
    /**
     * The ID that specifies the upload action. You can use this to track the status of the upload.
     */
    uploadId: UploadId;
  }
  export type UploadId = string;
  export type UploadStatus = "IN_PROGRESS"|"SUCCEEDED"|"FAILED"|string;
  export type Urn = string;
  export type Urns = Urn[];
  export type Version = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-09-06"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IoTThingsGraph client.
   */
  export import Types = IoTThingsGraph;
}
export = IoTThingsGraph;
