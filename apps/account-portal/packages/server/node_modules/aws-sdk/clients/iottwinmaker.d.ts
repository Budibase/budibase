import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IoTTwinMaker extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IoTTwinMaker.Types.ClientConfiguration)
  config: Config & IoTTwinMaker.Types.ClientConfiguration;
  /**
   * Sets values for multiple time series properties.
   */
  batchPutPropertyValues(params: IoTTwinMaker.Types.BatchPutPropertyValuesRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.BatchPutPropertyValuesResponse) => void): Request<IoTTwinMaker.Types.BatchPutPropertyValuesResponse, AWSError>;
  /**
   * Sets values for multiple time series properties.
   */
  batchPutPropertyValues(callback?: (err: AWSError, data: IoTTwinMaker.Types.BatchPutPropertyValuesResponse) => void): Request<IoTTwinMaker.Types.BatchPutPropertyValuesResponse, AWSError>;
  /**
   * Creates a component type.
   */
  createComponentType(params: IoTTwinMaker.Types.CreateComponentTypeRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.CreateComponentTypeResponse) => void): Request<IoTTwinMaker.Types.CreateComponentTypeResponse, AWSError>;
  /**
   * Creates a component type.
   */
  createComponentType(callback?: (err: AWSError, data: IoTTwinMaker.Types.CreateComponentTypeResponse) => void): Request<IoTTwinMaker.Types.CreateComponentTypeResponse, AWSError>;
  /**
   * Creates an entity.
   */
  createEntity(params: IoTTwinMaker.Types.CreateEntityRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.CreateEntityResponse) => void): Request<IoTTwinMaker.Types.CreateEntityResponse, AWSError>;
  /**
   * Creates an entity.
   */
  createEntity(callback?: (err: AWSError, data: IoTTwinMaker.Types.CreateEntityResponse) => void): Request<IoTTwinMaker.Types.CreateEntityResponse, AWSError>;
  /**
   * Creates a scene.
   */
  createScene(params: IoTTwinMaker.Types.CreateSceneRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.CreateSceneResponse) => void): Request<IoTTwinMaker.Types.CreateSceneResponse, AWSError>;
  /**
   * Creates a scene.
   */
  createScene(callback?: (err: AWSError, data: IoTTwinMaker.Types.CreateSceneResponse) => void): Request<IoTTwinMaker.Types.CreateSceneResponse, AWSError>;
  /**
   * This action creates a SyncJob.
   */
  createSyncJob(params: IoTTwinMaker.Types.CreateSyncJobRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.CreateSyncJobResponse) => void): Request<IoTTwinMaker.Types.CreateSyncJobResponse, AWSError>;
  /**
   * This action creates a SyncJob.
   */
  createSyncJob(callback?: (err: AWSError, data: IoTTwinMaker.Types.CreateSyncJobResponse) => void): Request<IoTTwinMaker.Types.CreateSyncJobResponse, AWSError>;
  /**
   * Creates a workplace.
   */
  createWorkspace(params: IoTTwinMaker.Types.CreateWorkspaceRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.CreateWorkspaceResponse) => void): Request<IoTTwinMaker.Types.CreateWorkspaceResponse, AWSError>;
  /**
   * Creates a workplace.
   */
  createWorkspace(callback?: (err: AWSError, data: IoTTwinMaker.Types.CreateWorkspaceResponse) => void): Request<IoTTwinMaker.Types.CreateWorkspaceResponse, AWSError>;
  /**
   * Deletes a component type.
   */
  deleteComponentType(params: IoTTwinMaker.Types.DeleteComponentTypeRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.DeleteComponentTypeResponse) => void): Request<IoTTwinMaker.Types.DeleteComponentTypeResponse, AWSError>;
  /**
   * Deletes a component type.
   */
  deleteComponentType(callback?: (err: AWSError, data: IoTTwinMaker.Types.DeleteComponentTypeResponse) => void): Request<IoTTwinMaker.Types.DeleteComponentTypeResponse, AWSError>;
  /**
   * Deletes an entity.
   */
  deleteEntity(params: IoTTwinMaker.Types.DeleteEntityRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.DeleteEntityResponse) => void): Request<IoTTwinMaker.Types.DeleteEntityResponse, AWSError>;
  /**
   * Deletes an entity.
   */
  deleteEntity(callback?: (err: AWSError, data: IoTTwinMaker.Types.DeleteEntityResponse) => void): Request<IoTTwinMaker.Types.DeleteEntityResponse, AWSError>;
  /**
   * Deletes a scene.
   */
  deleteScene(params: IoTTwinMaker.Types.DeleteSceneRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.DeleteSceneResponse) => void): Request<IoTTwinMaker.Types.DeleteSceneResponse, AWSError>;
  /**
   * Deletes a scene.
   */
  deleteScene(callback?: (err: AWSError, data: IoTTwinMaker.Types.DeleteSceneResponse) => void): Request<IoTTwinMaker.Types.DeleteSceneResponse, AWSError>;
  /**
   * Delete the SyncJob.
   */
  deleteSyncJob(params: IoTTwinMaker.Types.DeleteSyncJobRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.DeleteSyncJobResponse) => void): Request<IoTTwinMaker.Types.DeleteSyncJobResponse, AWSError>;
  /**
   * Delete the SyncJob.
   */
  deleteSyncJob(callback?: (err: AWSError, data: IoTTwinMaker.Types.DeleteSyncJobResponse) => void): Request<IoTTwinMaker.Types.DeleteSyncJobResponse, AWSError>;
  /**
   * Deletes a workspace.
   */
  deleteWorkspace(params: IoTTwinMaker.Types.DeleteWorkspaceRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.DeleteWorkspaceResponse) => void): Request<IoTTwinMaker.Types.DeleteWorkspaceResponse, AWSError>;
  /**
   * Deletes a workspace.
   */
  deleteWorkspace(callback?: (err: AWSError, data: IoTTwinMaker.Types.DeleteWorkspaceResponse) => void): Request<IoTTwinMaker.Types.DeleteWorkspaceResponse, AWSError>;
  /**
   * Run queries to access information from your knowledge graph of entities within individual workspaces.
   */
  executeQuery(params: IoTTwinMaker.Types.ExecuteQueryRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.ExecuteQueryResponse) => void): Request<IoTTwinMaker.Types.ExecuteQueryResponse, AWSError>;
  /**
   * Run queries to access information from your knowledge graph of entities within individual workspaces.
   */
  executeQuery(callback?: (err: AWSError, data: IoTTwinMaker.Types.ExecuteQueryResponse) => void): Request<IoTTwinMaker.Types.ExecuteQueryResponse, AWSError>;
  /**
   * Retrieves information about a component type.
   */
  getComponentType(params: IoTTwinMaker.Types.GetComponentTypeRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.GetComponentTypeResponse) => void): Request<IoTTwinMaker.Types.GetComponentTypeResponse, AWSError>;
  /**
   * Retrieves information about a component type.
   */
  getComponentType(callback?: (err: AWSError, data: IoTTwinMaker.Types.GetComponentTypeResponse) => void): Request<IoTTwinMaker.Types.GetComponentTypeResponse, AWSError>;
  /**
   * Retrieves information about an entity.
   */
  getEntity(params: IoTTwinMaker.Types.GetEntityRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.GetEntityResponse) => void): Request<IoTTwinMaker.Types.GetEntityResponse, AWSError>;
  /**
   * Retrieves information about an entity.
   */
  getEntity(callback?: (err: AWSError, data: IoTTwinMaker.Types.GetEntityResponse) => void): Request<IoTTwinMaker.Types.GetEntityResponse, AWSError>;
  /**
   * Gets the pricing plan.
   */
  getPricingPlan(params: IoTTwinMaker.Types.GetPricingPlanRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.GetPricingPlanResponse) => void): Request<IoTTwinMaker.Types.GetPricingPlanResponse, AWSError>;
  /**
   * Gets the pricing plan.
   */
  getPricingPlan(callback?: (err: AWSError, data: IoTTwinMaker.Types.GetPricingPlanResponse) => void): Request<IoTTwinMaker.Types.GetPricingPlanResponse, AWSError>;
  /**
   * Gets the property values for a component, component type, entity, or workspace. You must specify a value for either componentName, componentTypeId, entityId, or workspaceId.
   */
  getPropertyValue(params: IoTTwinMaker.Types.GetPropertyValueRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.GetPropertyValueResponse) => void): Request<IoTTwinMaker.Types.GetPropertyValueResponse, AWSError>;
  /**
   * Gets the property values for a component, component type, entity, or workspace. You must specify a value for either componentName, componentTypeId, entityId, or workspaceId.
   */
  getPropertyValue(callback?: (err: AWSError, data: IoTTwinMaker.Types.GetPropertyValueResponse) => void): Request<IoTTwinMaker.Types.GetPropertyValueResponse, AWSError>;
  /**
   * Retrieves information about the history of a time series property value for a component, component type, entity, or workspace. You must specify a value for workspaceId. For entity-specific queries, specify values for componentName and entityId. For cross-entity quries, specify a value for componentTypeId.
   */
  getPropertyValueHistory(params: IoTTwinMaker.Types.GetPropertyValueHistoryRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.GetPropertyValueHistoryResponse) => void): Request<IoTTwinMaker.Types.GetPropertyValueHistoryResponse, AWSError>;
  /**
   * Retrieves information about the history of a time series property value for a component, component type, entity, or workspace. You must specify a value for workspaceId. For entity-specific queries, specify values for componentName and entityId. For cross-entity quries, specify a value for componentTypeId.
   */
  getPropertyValueHistory(callback?: (err: AWSError, data: IoTTwinMaker.Types.GetPropertyValueHistoryResponse) => void): Request<IoTTwinMaker.Types.GetPropertyValueHistoryResponse, AWSError>;
  /**
   * Retrieves information about a scene.
   */
  getScene(params: IoTTwinMaker.Types.GetSceneRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.GetSceneResponse) => void): Request<IoTTwinMaker.Types.GetSceneResponse, AWSError>;
  /**
   * Retrieves information about a scene.
   */
  getScene(callback?: (err: AWSError, data: IoTTwinMaker.Types.GetSceneResponse) => void): Request<IoTTwinMaker.Types.GetSceneResponse, AWSError>;
  /**
   * Gets the SyncJob.
   */
  getSyncJob(params: IoTTwinMaker.Types.GetSyncJobRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.GetSyncJobResponse) => void): Request<IoTTwinMaker.Types.GetSyncJobResponse, AWSError>;
  /**
   * Gets the SyncJob.
   */
  getSyncJob(callback?: (err: AWSError, data: IoTTwinMaker.Types.GetSyncJobResponse) => void): Request<IoTTwinMaker.Types.GetSyncJobResponse, AWSError>;
  /**
   * Retrieves information about a workspace.
   */
  getWorkspace(params: IoTTwinMaker.Types.GetWorkspaceRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.GetWorkspaceResponse) => void): Request<IoTTwinMaker.Types.GetWorkspaceResponse, AWSError>;
  /**
   * Retrieves information about a workspace.
   */
  getWorkspace(callback?: (err: AWSError, data: IoTTwinMaker.Types.GetWorkspaceResponse) => void): Request<IoTTwinMaker.Types.GetWorkspaceResponse, AWSError>;
  /**
   * Lists all component types in a workspace.
   */
  listComponentTypes(params: IoTTwinMaker.Types.ListComponentTypesRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.ListComponentTypesResponse) => void): Request<IoTTwinMaker.Types.ListComponentTypesResponse, AWSError>;
  /**
   * Lists all component types in a workspace.
   */
  listComponentTypes(callback?: (err: AWSError, data: IoTTwinMaker.Types.ListComponentTypesResponse) => void): Request<IoTTwinMaker.Types.ListComponentTypesResponse, AWSError>;
  /**
   * Lists all entities in a workspace.
   */
  listEntities(params: IoTTwinMaker.Types.ListEntitiesRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.ListEntitiesResponse) => void): Request<IoTTwinMaker.Types.ListEntitiesResponse, AWSError>;
  /**
   * Lists all entities in a workspace.
   */
  listEntities(callback?: (err: AWSError, data: IoTTwinMaker.Types.ListEntitiesResponse) => void): Request<IoTTwinMaker.Types.ListEntitiesResponse, AWSError>;
  /**
   * Lists all scenes in a workspace.
   */
  listScenes(params: IoTTwinMaker.Types.ListScenesRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.ListScenesResponse) => void): Request<IoTTwinMaker.Types.ListScenesResponse, AWSError>;
  /**
   * Lists all scenes in a workspace.
   */
  listScenes(callback?: (err: AWSError, data: IoTTwinMaker.Types.ListScenesResponse) => void): Request<IoTTwinMaker.Types.ListScenesResponse, AWSError>;
  /**
   * List all SyncJobs.
   */
  listSyncJobs(params: IoTTwinMaker.Types.ListSyncJobsRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.ListSyncJobsResponse) => void): Request<IoTTwinMaker.Types.ListSyncJobsResponse, AWSError>;
  /**
   * List all SyncJobs.
   */
  listSyncJobs(callback?: (err: AWSError, data: IoTTwinMaker.Types.ListSyncJobsResponse) => void): Request<IoTTwinMaker.Types.ListSyncJobsResponse, AWSError>;
  /**
   * Lists the sync resources.
   */
  listSyncResources(params: IoTTwinMaker.Types.ListSyncResourcesRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.ListSyncResourcesResponse) => void): Request<IoTTwinMaker.Types.ListSyncResourcesResponse, AWSError>;
  /**
   * Lists the sync resources.
   */
  listSyncResources(callback?: (err: AWSError, data: IoTTwinMaker.Types.ListSyncResourcesResponse) => void): Request<IoTTwinMaker.Types.ListSyncResourcesResponse, AWSError>;
  /**
   * Lists all tags associated with a resource.
   */
  listTagsForResource(params: IoTTwinMaker.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.ListTagsForResourceResponse) => void): Request<IoTTwinMaker.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags associated with a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: IoTTwinMaker.Types.ListTagsForResourceResponse) => void): Request<IoTTwinMaker.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves information about workspaces in the current account.
   */
  listWorkspaces(params: IoTTwinMaker.Types.ListWorkspacesRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.ListWorkspacesResponse) => void): Request<IoTTwinMaker.Types.ListWorkspacesResponse, AWSError>;
  /**
   * Retrieves information about workspaces in the current account.
   */
  listWorkspaces(callback?: (err: AWSError, data: IoTTwinMaker.Types.ListWorkspacesResponse) => void): Request<IoTTwinMaker.Types.ListWorkspacesResponse, AWSError>;
  /**
   * Adds tags to a resource.
   */
  tagResource(params: IoTTwinMaker.Types.TagResourceRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.TagResourceResponse) => void): Request<IoTTwinMaker.Types.TagResourceResponse, AWSError>;
  /**
   * Adds tags to a resource.
   */
  tagResource(callback?: (err: AWSError, data: IoTTwinMaker.Types.TagResourceResponse) => void): Request<IoTTwinMaker.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(params: IoTTwinMaker.Types.UntagResourceRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.UntagResourceResponse) => void): Request<IoTTwinMaker.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: IoTTwinMaker.Types.UntagResourceResponse) => void): Request<IoTTwinMaker.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates information in a component type.
   */
  updateComponentType(params: IoTTwinMaker.Types.UpdateComponentTypeRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.UpdateComponentTypeResponse) => void): Request<IoTTwinMaker.Types.UpdateComponentTypeResponse, AWSError>;
  /**
   * Updates information in a component type.
   */
  updateComponentType(callback?: (err: AWSError, data: IoTTwinMaker.Types.UpdateComponentTypeResponse) => void): Request<IoTTwinMaker.Types.UpdateComponentTypeResponse, AWSError>;
  /**
   * Updates an entity.
   */
  updateEntity(params: IoTTwinMaker.Types.UpdateEntityRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.UpdateEntityResponse) => void): Request<IoTTwinMaker.Types.UpdateEntityResponse, AWSError>;
  /**
   * Updates an entity.
   */
  updateEntity(callback?: (err: AWSError, data: IoTTwinMaker.Types.UpdateEntityResponse) => void): Request<IoTTwinMaker.Types.UpdateEntityResponse, AWSError>;
  /**
   * Update the pricing plan.
   */
  updatePricingPlan(params: IoTTwinMaker.Types.UpdatePricingPlanRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.UpdatePricingPlanResponse) => void): Request<IoTTwinMaker.Types.UpdatePricingPlanResponse, AWSError>;
  /**
   * Update the pricing plan.
   */
  updatePricingPlan(callback?: (err: AWSError, data: IoTTwinMaker.Types.UpdatePricingPlanResponse) => void): Request<IoTTwinMaker.Types.UpdatePricingPlanResponse, AWSError>;
  /**
   * Updates a scene.
   */
  updateScene(params: IoTTwinMaker.Types.UpdateSceneRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.UpdateSceneResponse) => void): Request<IoTTwinMaker.Types.UpdateSceneResponse, AWSError>;
  /**
   * Updates a scene.
   */
  updateScene(callback?: (err: AWSError, data: IoTTwinMaker.Types.UpdateSceneResponse) => void): Request<IoTTwinMaker.Types.UpdateSceneResponse, AWSError>;
  /**
   * Updates a workspace.
   */
  updateWorkspace(params: IoTTwinMaker.Types.UpdateWorkspaceRequest, callback?: (err: AWSError, data: IoTTwinMaker.Types.UpdateWorkspaceResponse) => void): Request<IoTTwinMaker.Types.UpdateWorkspaceResponse, AWSError>;
  /**
   * Updates a workspace.
   */
  updateWorkspace(callback?: (err: AWSError, data: IoTTwinMaker.Types.UpdateWorkspaceResponse) => void): Request<IoTTwinMaker.Types.UpdateWorkspaceResponse, AWSError>;
}
declare namespace IoTTwinMaker {
  export interface BatchPutPropertyError {
    /**
     * The error code.
     */
    errorCode: String;
    /**
     * The error message.
     */
    errorMessage: String;
    /**
     * An object that contains information about errors returned by the BatchPutProperty action.
     */
    entry: PropertyValueEntry;
  }
  export interface BatchPutPropertyErrorEntry {
    /**
     * A list of objects that contain information about errors returned by the BatchPutProperty action.
     */
    errors: Errors;
  }
  export interface BatchPutPropertyValuesRequest {
    /**
     * The ID of the workspace that contains the properties to set.
     */
    workspaceId: Id;
    /**
     * An object that maps strings to the property value entries to set. Each string in the mapping must be unique to this object.
     */
    entries: Entries;
  }
  export interface BatchPutPropertyValuesResponse {
    /**
     * Entries that caused errors in the batch put operation.
     */
    errorEntries: ErrorEntries;
  }
  export type Boolean = boolean;
  export interface BundleInformation {
    /**
     * The bundle names.
     */
    bundleNames: PricingBundles;
    /**
     * The pricing tier.
     */
    pricingTier?: PricingTier;
  }
  export type BundleName = string;
  export interface ColumnDescription {
    /**
     * The name of the column description.
     */
    name?: ColumnName;
    /**
     * The type of the column description.
     */
    type?: ColumnType;
  }
  export type ColumnDescriptions = ColumnDescription[];
  export type ColumnName = string;
  export type ColumnType = "NODE"|"EDGE"|"VALUE"|string;
  export interface ComponentPropertyGroupRequest {
    /**
     * The group type.
     */
    groupType?: GroupType;
    /**
     * The property names.
     */
    propertyNames?: PropertyNames;
    /**
     * The update type.
     */
    updateType?: PropertyGroupUpdateType;
  }
  export type ComponentPropertyGroupRequests = {[key: string]: ComponentPropertyGroupRequest};
  export interface ComponentPropertyGroupResponse {
    /**
     * The group type.
     */
    groupType: GroupType;
    /**
     * The names of properties
     */
    propertyNames: PropertyNames;
    /**
     * A Boolean value that specifies whether the property group is inherited from a parent entity
     */
    isInherited: Boolean;
  }
  export type ComponentPropertyGroupResponses = {[key: string]: ComponentPropertyGroupResponse};
  export interface ComponentRequest {
    /**
     * The description of the component request.
     */
    description?: Description;
    /**
     * The ID of the component type.
     */
    componentTypeId?: ComponentTypeId;
    /**
     * An object that maps strings to the properties to set in the component type. Each string in the mapping must be unique to this object.
     */
    properties?: PropertyRequests;
    /**
     * The property groups.
     */
    propertyGroups?: ComponentPropertyGroupRequests;
  }
  export interface ComponentResponse {
    /**
     * The name of the component.
     */
    componentName?: Name;
    /**
     * The description of the component type.
     */
    description?: Description;
    /**
     * The ID of the component type.
     */
    componentTypeId?: ComponentTypeId;
    /**
     * The status of the component type.
     */
    status?: Status;
    /**
     * The name of the property definition set in the request.
     */
    definedIn?: String;
    /**
     * An object that maps strings to the properties to set in the component type. Each string in the mapping must be unique to this object.
     */
    properties?: PropertyResponses;
    /**
     * The property groups.
     */
    propertyGroups?: ComponentPropertyGroupResponses;
    /**
     * The syncSource of the sync job, if this entity was created by a sync job.
     */
    syncSource?: SyncSource;
  }
  export type ComponentTypeId = string;
  export type ComponentTypeName = string;
  export type ComponentTypeSummaries = ComponentTypeSummary[];
  export interface ComponentTypeSummary {
    /**
     * The ARN of the component type.
     */
    arn: TwinMakerArn;
    /**
     * The ID of the component type.
     */
    componentTypeId: ComponentTypeId;
    /**
     * The date and time when the component type was created.
     */
    creationDateTime: Timestamp;
    /**
     * The date and time when the component type was last updated.
     */
    updateDateTime: Timestamp;
    /**
     * The description of the component type.
     */
    description?: Description;
    /**
     * The current status of the component type.
     */
    status?: Status;
    /**
     * The component type name.
     */
    componentTypeName?: ComponentTypeName;
  }
  export interface ComponentUpdateRequest {
    /**
     * The update type of the component update request.
     */
    updateType?: ComponentUpdateType;
    /**
     * The description of the component type.
     */
    description?: Description;
    /**
     * The ID of the component type.
     */
    componentTypeId?: ComponentTypeId;
    /**
     * An object that maps strings to the properties to set in the component type update. Each string in the mapping must be unique to this object.
     */
    propertyUpdates?: PropertyRequests;
    /**
     * The property group updates.
     */
    propertyGroupUpdates?: ComponentPropertyGroupRequests;
  }
  export type ComponentUpdateType = "CREATE"|"UPDATE"|"DELETE"|string;
  export type ComponentUpdatesMapRequest = {[key: string]: ComponentUpdateRequest};
  export type ComponentsMap = {[key: string]: ComponentResponse};
  export type ComponentsMapRequest = {[key: string]: ComponentRequest};
  export type Configuration = {[key: string]: Value};
  export interface CreateComponentTypeRequest {
    /**
     * The ID of the workspace that contains the component type.
     */
    workspaceId: Id;
    /**
     * A Boolean value that specifies whether an entity can have more than one component of this type.
     */
    isSingleton?: Boolean;
    /**
     * The ID of the component type.
     */
    componentTypeId: ComponentTypeId;
    /**
     * The description of the component type.
     */
    description?: Description;
    /**
     * An object that maps strings to the property definitions in the component type. Each string in the mapping must be unique to this object.
     */
    propertyDefinitions?: PropertyDefinitionsRequest;
    /**
     * Specifies the parent component type to extend.
     */
    extendsFrom?: ExtendsFrom;
    /**
     * An object that maps strings to the functions in the component type. Each string in the mapping must be unique to this object.
     */
    functions?: FunctionsRequest;
    /**
     * Metadata that you can use to manage the component type.
     */
    tags?: TagMap;
    /**
     * 
     */
    propertyGroups?: PropertyGroupsRequest;
    /**
     * A friendly name for the component type.
     */
    componentTypeName?: ComponentTypeName;
  }
  export interface CreateComponentTypeResponse {
    /**
     * The ARN of the component type.
     */
    arn: TwinMakerArn;
    /**
     * The date and time when the entity was created.
     */
    creationDateTime: Timestamp;
    /**
     * The current state of the component type.
     */
    state: State;
  }
  export interface CreateEntityRequest {
    /**
     * The ID of the workspace that contains the entity.
     */
    workspaceId: Id;
    /**
     * The ID of the entity.
     */
    entityId?: EntityId;
    /**
     * The name of the entity.
     */
    entityName: EntityName;
    /**
     * The description of the entity.
     */
    description?: Description;
    /**
     * An object that maps strings to the components in the entity. Each string in the mapping must be unique to this object.
     */
    components?: ComponentsMapRequest;
    /**
     * The ID of the entity's parent entity.
     */
    parentEntityId?: ParentEntityId;
    /**
     * Metadata that you can use to manage the entity.
     */
    tags?: TagMap;
  }
  export interface CreateEntityResponse {
    /**
     * The ID of the entity.
     */
    entityId: EntityId;
    /**
     * The ARN of the entity.
     */
    arn: TwinMakerArn;
    /**
     * The date and time when the entity was created.
     */
    creationDateTime: Timestamp;
    /**
     * The current state of the entity.
     */
    state: State;
  }
  export interface CreateSceneRequest {
    /**
     * The ID of the workspace that contains the scene.
     */
    workspaceId: Id;
    /**
     * The ID of the scene.
     */
    sceneId: Id;
    /**
     * The relative path that specifies the location of the content definition file.
     */
    contentLocation: S3Url;
    /**
     * The description for this scene.
     */
    description?: Description;
    /**
     * A list of capabilities that the scene uses to render itself.
     */
    capabilities?: SceneCapabilities;
    /**
     * Metadata that you can use to manage the scene.
     */
    tags?: TagMap;
    /**
     * The request metadata.
     */
    sceneMetadata?: SceneMetadataMap;
  }
  export interface CreateSceneResponse {
    /**
     * The ARN of the scene.
     */
    arn: TwinMakerArn;
    /**
     * The date and time when the scene was created.
     */
    creationDateTime: Timestamp;
  }
  export interface CreateSyncJobRequest {
    /**
     * The workspace ID.
     */
    workspaceId: Id;
    /**
     * The sync source.  Currently the only supported syncSoource is SITEWISE . 
     */
    syncSource: SyncSource;
    /**
     * The SyncJob IAM role. This IAM role is used by the SyncJob to read from the syncSource, and create, update, or delete the corresponding resources.
     */
    syncRole: RoleArn;
    /**
     * The SyncJob tags.
     */
    tags?: TagMap;
  }
  export interface CreateSyncJobResponse {
    /**
     * The SyncJob ARN.
     */
    arn: TwinMakerArn;
    /**
     * The date and time for the SyncJob creation.
     */
    creationDateTime: Timestamp;
    /**
     * The SyncJob response state.
     */
    state: SyncJobState;
  }
  export interface CreateWorkspaceRequest {
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * The description of the workspace.
     */
    description?: Description;
    /**
     * The ARN of the S3 bucket where resources associated with the workspace are stored.
     */
    s3Location: S3Location;
    /**
     * The ARN of the execution role associated with the workspace.
     */
    role: RoleArn;
    /**
     * Metadata that you can use to manage the workspace
     */
    tags?: TagMap;
  }
  export interface CreateWorkspaceResponse {
    /**
     * The ARN of the workspace.
     */
    arn: TwinMakerArn;
    /**
     * The date and time when the workspace was created.
     */
    creationDateTime: Timestamp;
  }
  export interface DataConnector {
    /**
     * The Lambda function associated with this data connector.
     */
    lambda?: LambdaFunction;
    /**
     * A Boolean value that specifies whether the data connector is native to IoT TwinMaker.
     */
    isNative?: Boolean;
  }
  export interface DataType {
    /**
     * The underlying type of the data type.
     */
    type: Type;
    /**
     * The nested type in the data type.
     */
    nestedType?: DataType;
    /**
     * The allowed values for this data type.
     */
    allowedValues?: DataValueList;
    /**
     * The unit of measure used in this data type.
     */
    unitOfMeasure?: String;
    /**
     * A relationship that associates a component with another component.
     */
    relationship?: Relationship;
  }
  export interface DataValue {
    /**
     * A Boolean value.
     */
    booleanValue?: Boolean;
    /**
     * A double value.
     */
    doubleValue?: Double;
    /**
     * An integer value.
     */
    integerValue?: Integer;
    /**
     * A long value.
     */
    longValue?: Long;
    /**
     * A string value.
     */
    stringValue?: String;
    /**
     * A list of multiple values.
     */
    listValue?: DataValueList;
    /**
     * An object that maps strings to multiple DataValue objects.
     */
    mapValue?: DataValueMap;
    /**
     * A value that relates a component to another component.
     */
    relationshipValue?: RelationshipValue;
    /**
     * An expression that produces the value.
     */
    expression?: Expression;
  }
  export type DataValueList = DataValue[];
  export type DataValueMap = {[key: string]: DataValue};
  export interface DeleteComponentTypeRequest {
    /**
     * The ID of the workspace that contains the component type.
     */
    workspaceId: Id;
    /**
     * The ID of the component type to delete.
     */
    componentTypeId: ComponentTypeId;
  }
  export interface DeleteComponentTypeResponse {
    /**
     * The current state of the component type to be deleted.
     */
    state: State;
  }
  export interface DeleteEntityRequest {
    /**
     * The ID of the workspace that contains the entity to delete.
     */
    workspaceId: Id;
    /**
     * The ID of the entity to delete.
     */
    entityId: EntityId;
    /**
     * A Boolean value that specifies whether the operation deletes child entities.
     */
    isRecursive?: Boolean;
  }
  export interface DeleteEntityResponse {
    /**
     * The current state of the deleted entity.
     */
    state: State;
  }
  export interface DeleteSceneRequest {
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * The ID of the scene to delete.
     */
    sceneId: Id;
  }
  export interface DeleteSceneResponse {
  }
  export interface DeleteSyncJobRequest {
    /**
     * The workspace ID.
     */
    workspaceId: Id;
    /**
     * The sync source.  Currently the only supported syncSource is SITEWISE . 
     */
    syncSource: SyncSource;
  }
  export interface DeleteSyncJobResponse {
    /**
     * The SyncJob response state.
     */
    state: SyncJobState;
  }
  export interface DeleteWorkspaceRequest {
    /**
     * The ID of the workspace to delete.
     */
    workspaceId: Id;
  }
  export interface DeleteWorkspaceResponse {
  }
  export type Description = string;
  export type Double = number;
  export type EntityId = string;
  export type EntityName = string;
  export interface EntityPropertyReference {
    /**
     * The name of the component.
     */
    componentName?: Name;
    /**
     * A mapping of external IDs to property names. External IDs uniquely identify properties from external data stores.
     */
    externalIdProperty?: ExternalIdProperty;
    /**
     * The ID of the entity.
     */
    entityId?: EntityId;
    /**
     * The name of the property.
     */
    propertyName: Name;
  }
  export type EntitySummaries = EntitySummary[];
  export interface EntitySummary {
    /**
     * The ID of the entity.
     */
    entityId: EntityId;
    /**
     * The name of the entity.
     */
    entityName: EntityName;
    /**
     * The ARN of the entity.
     */
    arn: TwinMakerArn;
    /**
     * The ID of the parent entity.
     */
    parentEntityId?: ParentEntityId;
    /**
     * The current status of the entity.
     */
    status: Status;
    /**
     * The description of the entity.
     */
    description?: Description;
    /**
     * A Boolean value that specifies whether the entity has child entities or not.
     */
    hasChildEntities?: Boolean;
    /**
     * The date and time when the entity was created.
     */
    creationDateTime: Timestamp;
    /**
     * The last date and time when the entity was updated.
     */
    updateDateTime: Timestamp;
  }
  export type Entries = PropertyValueEntry[];
  export type ErrorCode = "VALIDATION_ERROR"|"INTERNAL_FAILURE"|"SYNC_INITIALIZING_ERROR"|"SYNC_CREATING_ERROR"|"SYNC_PROCESSING_ERROR"|string;
  export interface ErrorDetails {
    /**
     * The error code.
     */
    code?: ErrorCode;
    /**
     * The error message.
     */
    message?: ErrorMessage;
  }
  export type ErrorEntries = BatchPutPropertyErrorEntry[];
  export type ErrorMessage = string;
  export type Errors = BatchPutPropertyError[];
  export interface ExecuteQueryRequest {
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * The query statement.
     */
    queryStatement: QueryStatement;
    /**
     * The maximum number of results to return at one time. The default is 25. Valid Range: Minimum value of 1. Maximum value of 250.
     */
    maxResults?: QueryServiceMaxResults;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ExecuteQueryResponse {
    /**
     * A list of ColumnDescription objects.
     */
    columnDescriptions?: ColumnDescriptions;
    /**
     * Represents a single row in the query results.
     */
    rows?: Rows;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export type Expression = string;
  export type ExtendsFrom = ComponentTypeId[];
  export type ExternalIdProperty = {[key: string]: String};
  export interface FunctionRequest {
    /**
     * The required properties of the function.
     */
    requiredProperties?: RequiredProperties;
    /**
     * The scope of the function.
     */
    scope?: Scope;
    /**
     * The data connector.
     */
    implementedBy?: DataConnector;
  }
  export interface FunctionResponse {
    /**
     * The required properties of the function.
     */
    requiredProperties?: RequiredProperties;
    /**
     * The scope of the function.
     */
    scope?: Scope;
    /**
     * The data connector.
     */
    implementedBy?: DataConnector;
    /**
     * Indicates whether this function is inherited.
     */
    isInherited?: Boolean;
  }
  export type FunctionsRequest = {[key: string]: FunctionRequest};
  export type FunctionsResponse = {[key: string]: FunctionResponse};
  export type GeneratedSceneMetadataMap = {[key: string]: SceneMetadataValue};
  export interface GetComponentTypeRequest {
    /**
     * The ID of the workspace that contains the component type.
     */
    workspaceId: Id;
    /**
     * The ID of the component type.
     */
    componentTypeId: ComponentTypeId;
  }
  export interface GetComponentTypeResponse {
    /**
     * The ID of the workspace that contains the component type.
     */
    workspaceId: Id;
    /**
     * A Boolean value that specifies whether an entity can have more than one component of this type.
     */
    isSingleton?: Boolean;
    /**
     * The ID of the component type.
     */
    componentTypeId: ComponentTypeId;
    /**
     * The description of the component type.
     */
    description?: Description;
    /**
     * An object that maps strings to the property definitions in the component type. Each string in the mapping must be unique to this object.
     */
    propertyDefinitions?: PropertyDefinitionsResponse;
    /**
     * The name of the parent component type that this component type extends.
     */
    extendsFrom?: ExtendsFrom;
    /**
     * An object that maps strings to the functions in the component type. Each string in the mapping must be unique to this object.
     */
    functions?: FunctionsResponse;
    /**
     * The date and time when the component type was created.
     */
    creationDateTime: Timestamp;
    /**
     * The date and time when the component was last updated.
     */
    updateDateTime: Timestamp;
    /**
     * The ARN of the component type.
     */
    arn: TwinMakerArn;
    /**
     * A Boolean value that specifies whether the component type is abstract.
     */
    isAbstract?: Boolean;
    /**
     * A Boolean value that specifies whether the component type has a schema initializer and that the schema initializer has run.
     */
    isSchemaInitialized?: Boolean;
    /**
     * The current status of the component type.
     */
    status?: Status;
    /**
     * The maximum number of results to return at one time. The default is 25. Valid Range: Minimum value of 1. Maximum value of 250.
     */
    propertyGroups?: PropertyGroupsResponse;
    /**
     * The syncSource of the SyncJob, if this entity was created by a SyncJob.
     */
    syncSource?: SyncSource;
    /**
     * The component type name.
     */
    componentTypeName?: ComponentTypeName;
  }
  export interface GetEntityRequest {
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * The ID of the entity.
     */
    entityId: EntityId;
  }
  export interface GetEntityResponse {
    /**
     * The ID of the entity.
     */
    entityId: EntityId;
    /**
     * The name of the entity.
     */
    entityName: EntityName;
    /**
     * The ARN of the entity.
     */
    arn: TwinMakerArn;
    /**
     * The current status of the entity.
     */
    status: Status;
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * The description of the entity.
     */
    description?: Description;
    /**
     * An object that maps strings to the components in the entity. Each string in the mapping must be unique to this object.
     */
    components?: ComponentsMap;
    /**
     * The ID of the parent entity for this entity.
     */
    parentEntityId: ParentEntityId;
    /**
     * A Boolean value that specifies whether the entity has associated child entities.
     */
    hasChildEntities: Boolean;
    /**
     * The date and time when the entity was created.
     */
    creationDateTime: Timestamp;
    /**
     * The date and time when the entity was last updated.
     */
    updateDateTime: Timestamp;
    /**
     * The syncSource of the sync job, if this entity was created by a sync job.
     */
    syncSource?: SyncSource;
  }
  export interface GetPricingPlanRequest {
  }
  export interface GetPricingPlanResponse {
    /**
     * The chosen pricing plan for the current billing cycle.
     */
    currentPricingPlan: PricingPlan;
    /**
     * The pending pricing plan.
     */
    pendingPricingPlan?: PricingPlan;
  }
  export interface GetPropertyValueHistoryRequest {
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * The ID of the entity.
     */
    entityId?: EntityId;
    /**
     * The name of the component.
     */
    componentName?: Name;
    /**
     * The ID of the component type.
     */
    componentTypeId?: ComponentTypeId;
    /**
     * A list of properties whose value histories the request retrieves.
     */
    selectedProperties: SelectedPropertyList;
    /**
     * A list of objects that filter the property value history request.
     */
    propertyFilters?: PropertyFilters;
    /**
     * The date and time of the earliest property value to return.
     */
    startDateTime?: Timestamp;
    /**
     * The date and time of the latest property value to return.
     */
    endDateTime?: Timestamp;
    /**
     * An object that specifies the interpolation type and the interval over which to interpolate data.
     */
    interpolation?: InterpolationParameters;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time. The default is 25. Valid Range: Minimum value of 1. Maximum value of 250.
     */
    maxResults?: MaxResults;
    /**
     * The time direction to use in the result order.
     */
    orderByTime?: OrderByTime;
    /**
     * The ISO8601 DateTime of the earliest property value to return. For more information about the ISO8601 DateTime format, see the data type PropertyValue.
     */
    startTime?: Time;
    /**
     * The ISO8601 DateTime of the latest property value to return. For more information about the ISO8601 DateTime format, see the data type PropertyValue.
     */
    endTime?: Time;
  }
  export interface GetPropertyValueHistoryResponse {
    /**
     * An object that maps strings to the property definitions in the component type. Each string in the mapping must be unique to this object.
     */
    propertyValues: PropertyValueList;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface GetPropertyValueRequest {
    /**
     * The name of the component whose property values the operation returns.
     */
    componentName?: Name;
    /**
     * The ID of the component type whose property values the operation returns.
     */
    componentTypeId?: ComponentTypeId;
    /**
     * The ID of the entity whose property values the operation returns.
     */
    entityId?: EntityId;
    /**
     * The properties whose values the operation returns.
     */
    selectedProperties: SelectedPropertyList;
    /**
     * The ID of the workspace whose values the operation returns.
     */
    workspaceId: Id;
    /**
     * The maximum number of results to return at one time. The default is 25. Valid Range: Minimum value of 1. Maximum value of 250.
     */
    maxResults?: MaxResults;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The property group name.
     */
    propertyGroupName?: Name;
    /**
     * The tabular conditions.
     */
    tabularConditions?: TabularConditions;
  }
  export interface GetPropertyValueResponse {
    /**
     * An object that maps strings to the properties and latest property values in the response. Each string in the mapping must be unique to this object.
     */
    propertyValues?: PropertyLatestValueMap;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
    /**
     * A table of property values.
     */
    tabularPropertyValues?: TabularPropertyValues;
  }
  export interface GetSceneRequest {
    /**
     * The ID of the workspace that contains the scene.
     */
    workspaceId: Id;
    /**
     * The ID of the scene.
     */
    sceneId: Id;
  }
  export interface GetSceneResponse {
    /**
     * The ID of the workspace that contains the scene.
     */
    workspaceId: Id;
    /**
     * The ID of the scene.
     */
    sceneId: Id;
    /**
     * The relative path that specifies the location of the content definition file.
     */
    contentLocation: S3Url;
    /**
     * The ARN of the scene.
     */
    arn: TwinMakerArn;
    /**
     * The date and time when the scene was created.
     */
    creationDateTime: Timestamp;
    /**
     * The date and time when the scene was last updated.
     */
    updateDateTime: Timestamp;
    /**
     * The description of the scene.
     */
    description?: Description;
    /**
     * A list of capabilities that the scene uses to render.
     */
    capabilities?: SceneCapabilities;
    /**
     * The response metadata.
     */
    sceneMetadata?: SceneMetadataMap;
    /**
     * The generated scene metadata.
     */
    generatedSceneMetadata?: GeneratedSceneMetadataMap;
    /**
     * The SceneResponse error.
     */
    error?: SceneError;
  }
  export interface GetSyncJobRequest {
    /**
     * The sync source.  Currently the only supported syncSource is SITEWISE . 
     */
    syncSource: SyncSource;
    /**
     * The workspace ID.
     */
    workspaceId?: Id;
  }
  export interface GetSyncJobResponse {
    /**
     * The sync job ARN.
     */
    arn: TwinMakerArn;
    /**
     * The ID of the workspace that contains the sync job.
     */
    workspaceId: Id;
    /**
     * The sync soucre.  Currently the only supported syncSource is SITEWISE . 
     */
    syncSource: SyncSource;
    /**
     * The sync IAM role.
     */
    syncRole: RoleArn;
    /**
     * The SyncJob response status.
     */
    status: SyncJobStatus;
    /**
     * The creation date and time.
     */
    creationDateTime: Timestamp;
    /**
     * The update date and time.
     */
    updateDateTime: Timestamp;
  }
  export interface GetWorkspaceRequest {
    /**
     * The ID of the workspace.
     */
    workspaceId: IdOrArn;
  }
  export interface GetWorkspaceResponse {
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * The ARN of the workspace.
     */
    arn: TwinMakerArn;
    /**
     * The description of the workspace.
     */
    description?: Description;
    /**
     * The ARN of the S3 bucket where resources associated with the workspace are stored.
     */
    s3Location: S3Location;
    /**
     * The ARN of the execution role associated with the workspace.
     */
    role: RoleArn;
    /**
     * The date and time when the workspace was created.
     */
    creationDateTime: Timestamp;
    /**
     * The date and time when the workspace was last updated.
     */
    updateDateTime: Timestamp;
  }
  export type GroupType = "TABULAR"|string;
  export type Id = string;
  export type IdOrArn = string;
  export type Integer = number;
  export interface InterpolationParameters {
    /**
     * The interpolation type.
     */
    interpolationType?: InterpolationType;
    /**
     * The interpolation time interval in seconds.
     */
    intervalInSeconds?: IntervalInSeconds;
  }
  export type InterpolationType = "LINEAR"|string;
  export type IntervalInSeconds = number;
  export type LambdaArn = string;
  export interface LambdaFunction {
    /**
     * The ARN of the Lambda function.
     */
    arn: LambdaArn;
  }
  export interface ListComponentTypesFilter {
    /**
     * The component type that the component types in the list extend.
     */
    extendsFrom?: ComponentTypeId;
    /**
     * The namespace to which the component types in the list belong.
     */
    namespace?: String;
    /**
     * A Boolean value that specifies whether the component types in the list are abstract.
     */
    isAbstract?: Boolean;
  }
  export type ListComponentTypesFilters = ListComponentTypesFilter[];
  export interface ListComponentTypesRequest {
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * A list of objects that filter the request.
     */
    filters?: ListComponentTypesFilters;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time. The default is 25. Valid Range: Minimum value of 1. Maximum value of 250.
     */
    maxResults?: MaxResults;
  }
  export interface ListComponentTypesResponse {
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * A list of objects that contain information about the component types.
     */
    componentTypeSummaries: ComponentTypeSummaries;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
    /**
     * Specifies the maximum number of results to display.
     */
    maxResults?: MaxResults;
  }
  export interface ListEntitiesFilter {
    /**
     * The parent of the entities in the list.
     */
    parentEntityId?: ParentEntityId;
    /**
     * The ID of the component type in the entities in the list.
     */
    componentTypeId?: ComponentTypeId;
    /**
     * The external-Id property of a component. The external-Id property is the primary key of an external storage system.
     */
    externalId?: String;
  }
  export type ListEntitiesFilters = ListEntitiesFilter[];
  export interface ListEntitiesRequest {
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * A list of objects that filter the request.  Only one object is accepted as a valid input. 
     */
    filters?: ListEntitiesFilters;
    /**
     * The maximum number of results to return at one time. The default is 25. Valid Range: Minimum value of 1. Maximum value of 250.
     */
    maxResults?: MaxResults;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListEntitiesResponse {
    /**
     * A list of objects that contain information about the entities.
     */
    entitySummaries?: EntitySummaries;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListScenesRequest {
    /**
     * The ID of the workspace that contains the scenes.
     */
    workspaceId: Id;
    /**
     * Specifies the maximum number of results to display.
     */
    maxResults?: MaxResults;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListScenesResponse {
    /**
     * A list of objects that contain information about the scenes.
     */
    sceneSummaries?: SceneSummaries;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListSyncJobsRequest {
    /**
     * The ID of the workspace that contains the sync job.
     */
    workspaceId: Id;
    /**
     * The maximum number of results to return at one time. The default is 50. Valid Range: Minimum value of 0. Maximum value of 200.
     */
    maxResults?: MaxResults;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListSyncJobsResponse {
    /**
     * The listed SyncJob summaries.
     */
    syncJobSummaries?: SyncJobSummaries;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListSyncResourcesRequest {
    /**
     * The ID of the workspace that contains the sync job.
     */
    workspaceId: Id;
    /**
     * The sync source.  Currently the only supported syncSource is SITEWISE . 
     */
    syncSource: SyncSource;
    /**
     * A list of objects that filter the request. The following filter combinations are supported:   Filter with state   Filter with ResourceType and ResourceId   Filter with ResourceType and ExternalId  
     */
    filters?: SyncResourceFilters;
    /**
     * The maximum number of results to return at one time. The default is 50. Valid Range: Minimum value of 0. Maximum value of 200.
     */
    maxResults?: MaxResults;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListSyncResourcesResponse {
    /**
     * The sync resources.
     */
    syncResources?: SyncResourceSummaries;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceARN: TwinMakerArn;
    /**
     * The maximum number of results to return at one time. The default is 25. Valid Range: Minimum value of 1. Maximum value of 250.
     */
    maxResults?: MaxResults;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Metadata that you can use to manage a resource.
     */
    tags?: TagMap;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListWorkspacesRequest {
    /**
     * The maximum number of results to return at one time. The default is 25. Valid Range: Minimum value of 1. Maximum value of 250.
     */
    maxResults?: MaxResults;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListWorkspacesResponse {
    /**
     * A list of objects that contain information about the workspaces.
     */
    workspaceSummaries?: WorkspaceSummaries;
    /**
     * The string that specifies the next page of results.
     */
    nextToken?: NextToken;
  }
  export type Long = number;
  export type MaxResults = number;
  export type Name = string;
  export type NextToken = string;
  export type Order = "ASCENDING"|"DESCENDING"|string;
  export interface OrderBy {
    /**
     * The set order that filters results.
     */
    order?: Order;
    /**
     * The property name.
     */
    propertyName: String;
  }
  export type OrderByList = OrderBy[];
  export type OrderByTime = "ASCENDING"|"DESCENDING"|string;
  export type ParentEntityId = string;
  export interface ParentEntityUpdateRequest {
    /**
     * The type of the update.
     */
    updateType: ParentEntityUpdateType;
    /**
     * The ID of the parent entity.
     */
    parentEntityId?: ParentEntityId;
  }
  export type ParentEntityUpdateType = "UPDATE"|"DELETE"|string;
  export type PricingBundles = BundleName[];
  export type PricingMode = "BASIC"|"STANDARD"|"TIERED_BUNDLE"|string;
  export interface PricingPlan {
    /**
     * The billable entity count.
     */
    billableEntityCount?: Long;
    /**
     * The pricing plan's bundle information.
     */
    bundleInformation?: BundleInformation;
    /**
     * The effective date and time of the pricing plan.
     */
    effectiveDateTime: Timestamp;
    /**
     * The pricing mode.
     */
    pricingMode: PricingMode;
    /**
     * The set date and time for updating a pricing plan.
     */
    updateDateTime: Timestamp;
    /**
     * The update reason for changing a pricing plan.
     */
    updateReason: UpdateReason;
  }
  export type PricingTier = "TIER_1"|"TIER_2"|"TIER_3"|"TIER_4"|string;
  export interface PropertyDefinitionRequest {
    /**
     * An object that contains information about the data type.
     */
    dataType?: DataType;
    /**
     * A Boolean value that specifies whether the property is required.
     */
    isRequiredInEntity?: Boolean;
    /**
     * A Boolean value that specifies whether the property ID comes from an external data store.
     */
    isExternalId?: Boolean;
    /**
     * A Boolean value that specifies whether the property is stored externally.
     */
    isStoredExternally?: Boolean;
    /**
     * A Boolean value that specifies whether the property consists of time series data.
     */
    isTimeSeries?: Boolean;
    /**
     * An object that contains the default value.
     */
    defaultValue?: DataValue;
    /**
     * A mapping that specifies configuration information about the property. Use this field to specify information that you read from and write to an external source.
     */
    configuration?: Configuration;
    /**
     * A friendly name for the property.
     */
    displayName?: PropertyDisplayName;
  }
  export interface PropertyDefinitionResponse {
    /**
     * An object that contains information about the data type.
     */
    dataType: DataType;
    /**
     * A Boolean value that specifies whether the property consists of time series data.
     */
    isTimeSeries: Boolean;
    /**
     * A Boolean value that specifies whether the property is required in an entity.
     */
    isRequiredInEntity: Boolean;
    /**
     * A Boolean value that specifies whether the property ID comes from an external data store.
     */
    isExternalId: Boolean;
    /**
     * A Boolean value that specifies whether the property is stored externally.
     */
    isStoredExternally: Boolean;
    /**
     * A Boolean value that specifies whether the property definition is imported from an external data store.
     */
    isImported: Boolean;
    /**
     * A Boolean value that specifies whether the property definition can be updated.
     */
    isFinal: Boolean;
    /**
     * A Boolean value that specifies whether the property definition is inherited from a parent entity.
     */
    isInherited: Boolean;
    /**
     * An object that contains the default value.
     */
    defaultValue?: DataValue;
    /**
     * A mapping that specifies configuration information about the property.
     */
    configuration?: Configuration;
    /**
     * A friendly name for the property.
     */
    displayName?: PropertyDisplayName;
  }
  export type PropertyDefinitionsRequest = {[key: string]: PropertyDefinitionRequest};
  export type PropertyDefinitionsResponse = {[key: string]: PropertyDefinitionResponse};
  export type PropertyDisplayName = string;
  export interface PropertyFilter {
    /**
     * The property name associated with this property filter.
     */
    propertyName?: String;
    /**
     * The operator associated with this property filter.
     */
    operator?: String;
    /**
     * The value associated with this property filter.
     */
    value?: DataValue;
  }
  export type PropertyFilters = PropertyFilter[];
  export interface PropertyGroupRequest {
    /**
     * The group type.
     */
    groupType?: GroupType;
    /**
     * The names of properties.
     */
    propertyNames?: PropertyNames;
  }
  export interface PropertyGroupResponse {
    /**
     * The group types.
     */
    groupType: GroupType;
    /**
     * The names of properties.
     */
    propertyNames: PropertyNames;
    /**
     * A Boolean value that specifies whether the property group is inherited from a parent entity
     */
    isInherited: Boolean;
  }
  export type PropertyGroupUpdateType = "UPDATE"|"DELETE"|"CREATE"|string;
  export type PropertyGroupsRequest = {[key: string]: PropertyGroupRequest};
  export type PropertyGroupsResponse = {[key: string]: PropertyGroupResponse};
  export interface PropertyLatestValue {
    /**
     * An object that specifies information about a property.
     */
    propertyReference: EntityPropertyReference;
    /**
     * The value of the property.
     */
    propertyValue?: DataValue;
  }
  export type PropertyLatestValueMap = {[key: string]: PropertyLatestValue};
  export type PropertyNames = Name[];
  export interface PropertyRequest {
    /**
     * An object that specifies information about a property.
     */
    definition?: PropertyDefinitionRequest;
    /**
     * The value of the property.
     */
    value?: DataValue;
    /**
     * The update type of the update property request.
     */
    updateType?: PropertyUpdateType;
  }
  export type PropertyRequests = {[key: string]: PropertyRequest};
  export interface PropertyResponse {
    /**
     * An object that specifies information about a property.
     */
    definition?: PropertyDefinitionResponse;
    /**
     * The value of the property.
     */
    value?: DataValue;
  }
  export type PropertyResponses = {[key: string]: PropertyResponse};
  export type PropertyTableValue = {[key: string]: DataValue};
  export type PropertyUpdateType = "UPDATE"|"DELETE"|"CREATE"|string;
  export interface PropertyValue {
    /**
     * The timestamp of a value for a time series property.
     */
    timestamp?: Timestamp;
    /**
     * An object that specifies a value for a time series property.
     */
    value: DataValue;
    /**
     * ISO8601 DateTime of a value for a time series property. The time for when the property value was recorded in ISO 8601 format: YYYY-MM-DDThh:mm:ss[.SSSSSSSSS][Z/±HH:mm].    [YYYY]: year    [MM]: month    [DD]: day    [hh]: hour    [mm]: minute    [ss]: seconds    [.SSSSSSSSS]: additional precision, where precedence is maintained. For example: [.573123] is equal to 573123000 nanoseconds.    Z: default timezone UTC    ± HH:mm: time zone offset in Hours and Minutes.    Required sub-fields: YYYY-MM-DDThh:mm:ss and [Z/±HH:mm]
     */
    time?: Time;
  }
  export interface PropertyValueEntry {
    /**
     * An object that contains information about the entity that has the property.
     */
    entityPropertyReference: EntityPropertyReference;
    /**
     * A list of objects that specify time series property values.
     */
    propertyValues?: PropertyValues;
  }
  export interface PropertyValueHistory {
    /**
     * An object that uniquely identifies an entity property.
     */
    entityPropertyReference: EntityPropertyReference;
    /**
     * A list of objects that contain information about the values in the history of a time series property.
     */
    values?: Values;
  }
  export type PropertyValueList = PropertyValueHistory[];
  export type PropertyValues = PropertyValue[];
  export interface QueryResultValue {
  }
  export type QueryServiceMaxResults = number;
  export type QueryStatement = string;
  export interface Relationship {
    /**
     * The ID of the target component type associated with this relationship.
     */
    targetComponentTypeId?: ComponentTypeId;
    /**
     * The type of the relationship.
     */
    relationshipType?: String;
  }
  export interface RelationshipValue {
    /**
     * The ID of the target entity associated with this relationship value.
     */
    targetEntityId?: EntityId;
    /**
     * The name of the target component associated with the relationship value.
     */
    targetComponentName?: Name;
  }
  export type RequiredProperties = Name[];
  export type RoleArn = string;
  export interface Row {
    /**
     * The data in a row of query results.
     */
    rowData?: RowData;
  }
  export type RowData = QueryResultValue[];
  export type Rows = Row[];
  export type S3Location = string;
  export type S3Url = string;
  export type SceneCapabilities = SceneCapability[];
  export type SceneCapability = string;
  export interface SceneError {
    /**
     * The SceneError code.
     */
    code?: SceneErrorCode;
    /**
     * The SceneError message.
     */
    message?: ErrorMessage;
  }
  export type SceneErrorCode = "MATTERPORT_ERROR"|string;
  export type SceneMetadataMap = {[key: string]: SceneMetadataValue};
  export type SceneMetadataValue = string;
  export type SceneSummaries = SceneSummary[];
  export interface SceneSummary {
    /**
     * The ID of the scene.
     */
    sceneId: Id;
    /**
     * The relative path that specifies the location of the content definition file.
     */
    contentLocation: S3Url;
    /**
     * The ARN of the scene.
     */
    arn: TwinMakerArn;
    /**
     * The date and time when the scene was created.
     */
    creationDateTime: Timestamp;
    /**
     * The date and time when the scene was last updated.
     */
    updateDateTime: Timestamp;
    /**
     * The scene description.
     */
    description?: Description;
  }
  export type Scope = "ENTITY"|"WORKSPACE"|string;
  export type SelectedPropertyList = String[];
  export type State = "CREATING"|"UPDATING"|"DELETING"|"ACTIVE"|"ERROR"|string;
  export interface Status {
    /**
     * The current state of the entity, component, component type, or workspace.
     */
    state?: State;
    /**
     * The error message.
     */
    error?: ErrorDetails;
  }
  export type String = string;
  export type SyncJobState = "CREATING"|"INITIALIZING"|"ACTIVE"|"DELETING"|"ERROR"|string;
  export interface SyncJobStatus {
    /**
     * The SyncJob status state.
     */
    state?: SyncJobState;
    /**
     * The SyncJob error.
     */
    error?: ErrorDetails;
  }
  export type SyncJobSummaries = SyncJobSummary[];
  export interface SyncJobSummary {
    /**
     * The SyncJob summary ARN.
     */
    arn?: TwinMakerArn;
    /**
     * The ID of the workspace that contains the sync job.
     */
    workspaceId?: Id;
    /**
     * The sync source.
     */
    syncSource?: SyncSource;
    /**
     * The SyncJob summaries status.
     */
    status?: SyncJobStatus;
    /**
     * The creation date and time.
     */
    creationDateTime?: Timestamp;
    /**
     * The update date and time.
     */
    updateDateTime?: Timestamp;
  }
  export interface SyncResourceFilter {
    /**
     * The sync resource filter's state.
     */
    state?: SyncResourceState;
    /**
     * The sync resource filter resource type
     */
    resourceType?: SyncResourceType;
    /**
     * The sync resource filter resource ID.
     */
    resourceId?: Id;
    /**
     * The external ID.
     */
    externalId?: Id;
  }
  export type SyncResourceFilters = SyncResourceFilter[];
  export type SyncResourceState = "INITIALIZING"|"PROCESSING"|"DELETED"|"IN_SYNC"|"ERROR"|string;
  export interface SyncResourceStatus {
    /**
     * The sync resource status state.
     */
    state?: SyncResourceState;
    /**
     * The status error.
     */
    error?: ErrorDetails;
  }
  export type SyncResourceSummaries = SyncResourceSummary[];
  export interface SyncResourceSummary {
    /**
     * The resource type.
     */
    resourceType?: SyncResourceType;
    /**
     * The external ID.
     */
    externalId?: Id;
    /**
     * The resource ID.
     */
    resourceId?: Id;
    /**
     * The sync resource summary status.
     */
    status?: SyncResourceStatus;
    /**
     * The update date and time.
     */
    updateDateTime?: Timestamp;
  }
  export type SyncResourceType = "ENTITY"|"COMPONENT_TYPE"|string;
  export type SyncSource = string;
  export interface TabularConditions {
    /**
     * Filter criteria that orders the output. It can be sorted in ascending or descending order.
     */
    orderBy?: OrderByList;
    /**
     * You can filter the request using various logical operators and a key-value format. For example:  {"key": "serverType", "value": "webServer"} 
     */
    propertyFilters?: PropertyFilters;
  }
  export type TabularPropertyValue = PropertyTableValue[];
  export type TabularPropertyValues = TabularPropertyValue[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceARN: TwinMakerArn;
    /**
     * Metadata to add to this resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Time = string;
  export type Timestamp = Date;
  export type TwinMakerArn = string;
  export type Type = "RELATIONSHIP"|"STRING"|"LONG"|"BOOLEAN"|"INTEGER"|"DOUBLE"|"LIST"|"MAP"|string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceARN: TwinMakerArn;
    /**
     * A list of tag key names to remove from the resource. You don't specify the value. Both the key and its associated value are removed.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateComponentTypeRequest {
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * A Boolean value that specifies whether an entity can have more than one component of this type.
     */
    isSingleton?: Boolean;
    /**
     * The ID of the component type.
     */
    componentTypeId: ComponentTypeId;
    /**
     * The description of the component type.
     */
    description?: Description;
    /**
     * An object that maps strings to the property definitions in the component type. Each string in the mapping must be unique to this object.
     */
    propertyDefinitions?: PropertyDefinitionsRequest;
    /**
     * Specifies the component type that this component type extends.
     */
    extendsFrom?: ExtendsFrom;
    /**
     * An object that maps strings to the functions in the component type. Each string in the mapping must be unique to this object.
     */
    functions?: FunctionsRequest;
    /**
     * The property groups.
     */
    propertyGroups?: PropertyGroupsRequest;
    /**
     * The component type name.
     */
    componentTypeName?: ComponentTypeName;
  }
  export interface UpdateComponentTypeResponse {
    /**
     * The ID of the workspace that contains the component type.
     */
    workspaceId: Id;
    /**
     * The ARN of the component type.
     */
    arn: TwinMakerArn;
    /**
     * The ID of the component type.
     */
    componentTypeId: ComponentTypeId;
    /**
     * The current state of the component type.
     */
    state: State;
  }
  export interface UpdateEntityRequest {
    /**
     * The ID of the workspace that contains the entity.
     */
    workspaceId: Id;
    /**
     * The ID of the entity.
     */
    entityId: EntityId;
    /**
     * The name of the entity.
     */
    entityName?: EntityName;
    /**
     * The description of the entity.
     */
    description?: Description;
    /**
     * An object that maps strings to the component updates in the request. Each string in the mapping must be unique to this object.
     */
    componentUpdates?: ComponentUpdatesMapRequest;
    /**
     * An object that describes the update request for a parent entity.
     */
    parentEntityUpdate?: ParentEntityUpdateRequest;
  }
  export interface UpdateEntityResponse {
    /**
     * The date and time when the entity was last updated.
     */
    updateDateTime: Timestamp;
    /**
     * The current state of the entity update.
     */
    state: State;
  }
  export interface UpdatePricingPlanRequest {
    /**
     * The pricing mode.
     */
    pricingMode: PricingMode;
    /**
     * The bundle names.
     */
    bundleNames?: PricingBundles;
  }
  export interface UpdatePricingPlanResponse {
    /**
     * Update the current pricing plan.
     */
    currentPricingPlan: PricingPlan;
    /**
     * Update the pending pricing plan.
     */
    pendingPricingPlan?: PricingPlan;
  }
  export type UpdateReason = "DEFAULT"|"PRICING_TIER_UPDATE"|"ENTITY_COUNT_UPDATE"|"PRICING_MODE_UPDATE"|"OVERWRITTEN"|string;
  export interface UpdateSceneRequest {
    /**
     * The ID of the workspace that contains the scene.
     */
    workspaceId: Id;
    /**
     * The ID of the scene.
     */
    sceneId: Id;
    /**
     * The relative path that specifies the location of the content definition file.
     */
    contentLocation?: S3Url;
    /**
     * The description of this scene.
     */
    description?: Description;
    /**
     * A list of capabilities that the scene uses to render.
     */
    capabilities?: SceneCapabilities;
    /**
     * The scene metadata.
     */
    sceneMetadata?: SceneMetadataMap;
  }
  export interface UpdateSceneResponse {
    /**
     * The date and time when the scene was last updated.
     */
    updateDateTime: Timestamp;
  }
  export interface UpdateWorkspaceRequest {
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * The description of the workspace.
     */
    description?: Description;
    /**
     * The ARN of the execution role associated with the workspace.
     */
    role?: RoleArn;
  }
  export interface UpdateWorkspaceResponse {
    /**
     * The date and time of the current update.
     */
    updateDateTime: Timestamp;
  }
  export type Value = string;
  export type Values = PropertyValue[];
  export type WorkspaceSummaries = WorkspaceSummary[];
  export interface WorkspaceSummary {
    /**
     * The ID of the workspace.
     */
    workspaceId: Id;
    /**
     * The ARN of the workspace.
     */
    arn: TwinMakerArn;
    /**
     * The description of the workspace.
     */
    description?: Description;
    /**
     * The date and time when the workspace was created.
     */
    creationDateTime: Timestamp;
    /**
     * The date and time when the workspace was last updated.
     */
    updateDateTime: Timestamp;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-11-29"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IoTTwinMaker client.
   */
  export import Types = IoTTwinMaker;
}
export = IoTTwinMaker;
