import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IoT1ClickProjects extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IoT1ClickProjects.Types.ClientConfiguration)
  config: Config & IoT1ClickProjects.Types.ClientConfiguration;
  /**
   * Associates a physical device with a placement.
   */
  associateDeviceWithPlacement(params: IoT1ClickProjects.Types.AssociateDeviceWithPlacementRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.AssociateDeviceWithPlacementResponse) => void): Request<IoT1ClickProjects.Types.AssociateDeviceWithPlacementResponse, AWSError>;
  /**
   * Associates a physical device with a placement.
   */
  associateDeviceWithPlacement(callback?: (err: AWSError, data: IoT1ClickProjects.Types.AssociateDeviceWithPlacementResponse) => void): Request<IoT1ClickProjects.Types.AssociateDeviceWithPlacementResponse, AWSError>;
  /**
   * Creates an empty placement.
   */
  createPlacement(params: IoT1ClickProjects.Types.CreatePlacementRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.CreatePlacementResponse) => void): Request<IoT1ClickProjects.Types.CreatePlacementResponse, AWSError>;
  /**
   * Creates an empty placement.
   */
  createPlacement(callback?: (err: AWSError, data: IoT1ClickProjects.Types.CreatePlacementResponse) => void): Request<IoT1ClickProjects.Types.CreatePlacementResponse, AWSError>;
  /**
   * Creates an empty project with a placement template. A project contains zero or more placements that adhere to the placement template defined in the project.
   */
  createProject(params: IoT1ClickProjects.Types.CreateProjectRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.CreateProjectResponse) => void): Request<IoT1ClickProjects.Types.CreateProjectResponse, AWSError>;
  /**
   * Creates an empty project with a placement template. A project contains zero or more placements that adhere to the placement template defined in the project.
   */
  createProject(callback?: (err: AWSError, data: IoT1ClickProjects.Types.CreateProjectResponse) => void): Request<IoT1ClickProjects.Types.CreateProjectResponse, AWSError>;
  /**
   * Deletes a placement. To delete a placement, it must not have any devices associated with it.  When you delete a placement, all associated data becomes irretrievable. 
   */
  deletePlacement(params: IoT1ClickProjects.Types.DeletePlacementRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.DeletePlacementResponse) => void): Request<IoT1ClickProjects.Types.DeletePlacementResponse, AWSError>;
  /**
   * Deletes a placement. To delete a placement, it must not have any devices associated with it.  When you delete a placement, all associated data becomes irretrievable. 
   */
  deletePlacement(callback?: (err: AWSError, data: IoT1ClickProjects.Types.DeletePlacementResponse) => void): Request<IoT1ClickProjects.Types.DeletePlacementResponse, AWSError>;
  /**
   * Deletes a project. To delete a project, it must not have any placements associated with it.  When you delete a project, all associated data becomes irretrievable. 
   */
  deleteProject(params: IoT1ClickProjects.Types.DeleteProjectRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.DeleteProjectResponse) => void): Request<IoT1ClickProjects.Types.DeleteProjectResponse, AWSError>;
  /**
   * Deletes a project. To delete a project, it must not have any placements associated with it.  When you delete a project, all associated data becomes irretrievable. 
   */
  deleteProject(callback?: (err: AWSError, data: IoT1ClickProjects.Types.DeleteProjectResponse) => void): Request<IoT1ClickProjects.Types.DeleteProjectResponse, AWSError>;
  /**
   * Describes a placement in a project.
   */
  describePlacement(params: IoT1ClickProjects.Types.DescribePlacementRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.DescribePlacementResponse) => void): Request<IoT1ClickProjects.Types.DescribePlacementResponse, AWSError>;
  /**
   * Describes a placement in a project.
   */
  describePlacement(callback?: (err: AWSError, data: IoT1ClickProjects.Types.DescribePlacementResponse) => void): Request<IoT1ClickProjects.Types.DescribePlacementResponse, AWSError>;
  /**
   * Returns an object describing a project.
   */
  describeProject(params: IoT1ClickProjects.Types.DescribeProjectRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.DescribeProjectResponse) => void): Request<IoT1ClickProjects.Types.DescribeProjectResponse, AWSError>;
  /**
   * Returns an object describing a project.
   */
  describeProject(callback?: (err: AWSError, data: IoT1ClickProjects.Types.DescribeProjectResponse) => void): Request<IoT1ClickProjects.Types.DescribeProjectResponse, AWSError>;
  /**
   * Removes a physical device from a placement.
   */
  disassociateDeviceFromPlacement(params: IoT1ClickProjects.Types.DisassociateDeviceFromPlacementRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.DisassociateDeviceFromPlacementResponse) => void): Request<IoT1ClickProjects.Types.DisassociateDeviceFromPlacementResponse, AWSError>;
  /**
   * Removes a physical device from a placement.
   */
  disassociateDeviceFromPlacement(callback?: (err: AWSError, data: IoT1ClickProjects.Types.DisassociateDeviceFromPlacementResponse) => void): Request<IoT1ClickProjects.Types.DisassociateDeviceFromPlacementResponse, AWSError>;
  /**
   * Returns an object enumerating the devices in a placement.
   */
  getDevicesInPlacement(params: IoT1ClickProjects.Types.GetDevicesInPlacementRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.GetDevicesInPlacementResponse) => void): Request<IoT1ClickProjects.Types.GetDevicesInPlacementResponse, AWSError>;
  /**
   * Returns an object enumerating the devices in a placement.
   */
  getDevicesInPlacement(callback?: (err: AWSError, data: IoT1ClickProjects.Types.GetDevicesInPlacementResponse) => void): Request<IoT1ClickProjects.Types.GetDevicesInPlacementResponse, AWSError>;
  /**
   * Lists the placement(s) of a project.
   */
  listPlacements(params: IoT1ClickProjects.Types.ListPlacementsRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.ListPlacementsResponse) => void): Request<IoT1ClickProjects.Types.ListPlacementsResponse, AWSError>;
  /**
   * Lists the placement(s) of a project.
   */
  listPlacements(callback?: (err: AWSError, data: IoT1ClickProjects.Types.ListPlacementsResponse) => void): Request<IoT1ClickProjects.Types.ListPlacementsResponse, AWSError>;
  /**
   * Lists the AWS IoT 1-Click project(s) associated with your AWS account and region.
   */
  listProjects(params: IoT1ClickProjects.Types.ListProjectsRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.ListProjectsResponse) => void): Request<IoT1ClickProjects.Types.ListProjectsResponse, AWSError>;
  /**
   * Lists the AWS IoT 1-Click project(s) associated with your AWS account and region.
   */
  listProjects(callback?: (err: AWSError, data: IoT1ClickProjects.Types.ListProjectsResponse) => void): Request<IoT1ClickProjects.Types.ListProjectsResponse, AWSError>;
  /**
   * Lists the tags (metadata key/value pairs) which you have assigned to the resource.
   */
  listTagsForResource(params: IoT1ClickProjects.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.ListTagsForResourceResponse) => void): Request<IoT1ClickProjects.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags (metadata key/value pairs) which you have assigned to the resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: IoT1ClickProjects.Types.ListTagsForResourceResponse) => void): Request<IoT1ClickProjects.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Creates or modifies tags for a resource. Tags are key/value pairs (metadata) that can be used to manage a resource. For more information, see AWS Tagging Strategies.
   */
  tagResource(params: IoT1ClickProjects.Types.TagResourceRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.TagResourceResponse) => void): Request<IoT1ClickProjects.Types.TagResourceResponse, AWSError>;
  /**
   * Creates or modifies tags for a resource. Tags are key/value pairs (metadata) that can be used to manage a resource. For more information, see AWS Tagging Strategies.
   */
  tagResource(callback?: (err: AWSError, data: IoT1ClickProjects.Types.TagResourceResponse) => void): Request<IoT1ClickProjects.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags (metadata key/value pairs) from a resource.
   */
  untagResource(params: IoT1ClickProjects.Types.UntagResourceRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.UntagResourceResponse) => void): Request<IoT1ClickProjects.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags (metadata key/value pairs) from a resource.
   */
  untagResource(callback?: (err: AWSError, data: IoT1ClickProjects.Types.UntagResourceResponse) => void): Request<IoT1ClickProjects.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a placement with the given attributes. To clear an attribute, pass an empty value (i.e., "").
   */
  updatePlacement(params: IoT1ClickProjects.Types.UpdatePlacementRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.UpdatePlacementResponse) => void): Request<IoT1ClickProjects.Types.UpdatePlacementResponse, AWSError>;
  /**
   * Updates a placement with the given attributes. To clear an attribute, pass an empty value (i.e., "").
   */
  updatePlacement(callback?: (err: AWSError, data: IoT1ClickProjects.Types.UpdatePlacementResponse) => void): Request<IoT1ClickProjects.Types.UpdatePlacementResponse, AWSError>;
  /**
   * Updates a project associated with your AWS account and region. With the exception of device template names, you can pass just the values that need to be updated because the update request will change only the values that are provided. To clear a value, pass the empty string (i.e., "").
   */
  updateProject(params: IoT1ClickProjects.Types.UpdateProjectRequest, callback?: (err: AWSError, data: IoT1ClickProjects.Types.UpdateProjectResponse) => void): Request<IoT1ClickProjects.Types.UpdateProjectResponse, AWSError>;
  /**
   * Updates a project associated with your AWS account and region. With the exception of device template names, you can pass just the values that need to be updated because the update request will change only the values that are provided. To clear a value, pass the empty string (i.e., "").
   */
  updateProject(callback?: (err: AWSError, data: IoT1ClickProjects.Types.UpdateProjectResponse) => void): Request<IoT1ClickProjects.Types.UpdateProjectResponse, AWSError>;
}
declare namespace IoT1ClickProjects {
  export interface AssociateDeviceWithPlacementRequest {
    /**
     * The name of the project containing the placement in which to associate the device.
     */
    projectName: ProjectName;
    /**
     * The name of the placement in which to associate the device.
     */
    placementName: PlacementName;
    /**
     * The ID of the physical device to be associated with the given placement in the project. Note that a mandatory 4 character prefix is required for all deviceId values.
     */
    deviceId: DeviceId;
    /**
     * The device template name to associate with the device ID.
     */
    deviceTemplateName: DeviceTemplateName;
  }
  export interface AssociateDeviceWithPlacementResponse {
  }
  export type AttributeDefaultValue = string;
  export type AttributeName = string;
  export type AttributeValue = string;
  export interface CreatePlacementRequest {
    /**
     * The name of the placement to be created.
     */
    placementName: PlacementName;
    /**
     * The name of the project in which to create the placement.
     */
    projectName: ProjectName;
    /**
     * Optional user-defined key/value pairs providing contextual data (such as location or function) for the placement.
     */
    attributes?: PlacementAttributeMap;
  }
  export interface CreatePlacementResponse {
  }
  export interface CreateProjectRequest {
    /**
     * The name of the project to create.
     */
    projectName: ProjectName;
    /**
     * An optional description for the project.
     */
    description?: Description;
    /**
     * The schema defining the placement to be created. A placement template defines placement default attributes and device templates. You cannot add or remove device templates after the project has been created. However, you can update callbackOverrides for the device templates using the UpdateProject API.
     */
    placementTemplate?: PlacementTemplate;
    /**
     * Optional tags (metadata key/value pairs) to be associated with the project. For example, { {"key1": "value1", "key2": "value2"} }. For more information, see AWS Tagging Strategies.
     */
    tags?: TagMap;
  }
  export interface CreateProjectResponse {
  }
  export type DefaultPlacementAttributeMap = {[key: string]: AttributeDefaultValue};
  export interface DeletePlacementRequest {
    /**
     * The name of the empty placement to delete.
     */
    placementName: PlacementName;
    /**
     * The project containing the empty placement to delete.
     */
    projectName: ProjectName;
  }
  export interface DeletePlacementResponse {
  }
  export interface DeleteProjectRequest {
    /**
     * The name of the empty project to delete.
     */
    projectName: ProjectName;
  }
  export interface DeleteProjectResponse {
  }
  export interface DescribePlacementRequest {
    /**
     * The name of the placement within a project.
     */
    placementName: PlacementName;
    /**
     * The project containing the placement to be described.
     */
    projectName: ProjectName;
  }
  export interface DescribePlacementResponse {
    /**
     * An object describing the placement.
     */
    placement: PlacementDescription;
  }
  export interface DescribeProjectRequest {
    /**
     * The name of the project to be described.
     */
    projectName: ProjectName;
  }
  export interface DescribeProjectResponse {
    /**
     * An object describing the project.
     */
    project: ProjectDescription;
  }
  export type Description = string;
  export type DeviceCallbackKey = string;
  export type DeviceCallbackOverrideMap = {[key: string]: DeviceCallbackValue};
  export type DeviceCallbackValue = string;
  export type DeviceId = string;
  export type DeviceMap = {[key: string]: DeviceId};
  export interface DeviceTemplate {
    /**
     * The device type, which currently must be "button".
     */
    deviceType?: DeviceType;
    /**
     * An optional Lambda function to invoke instead of the default Lambda function provided by the placement template.
     */
    callbackOverrides?: DeviceCallbackOverrideMap;
  }
  export type DeviceTemplateMap = {[key: string]: DeviceTemplate};
  export type DeviceTemplateName = string;
  export type DeviceType = string;
  export interface DisassociateDeviceFromPlacementRequest {
    /**
     * The name of the project that contains the placement.
     */
    projectName: ProjectName;
    /**
     * The name of the placement that the device should be removed from.
     */
    placementName: PlacementName;
    /**
     * The device ID that should be removed from the placement.
     */
    deviceTemplateName: DeviceTemplateName;
  }
  export interface DisassociateDeviceFromPlacementResponse {
  }
  export interface GetDevicesInPlacementRequest {
    /**
     * The name of the project containing the placement.
     */
    projectName: ProjectName;
    /**
     * The name of the placement to get the devices from.
     */
    placementName: PlacementName;
  }
  export interface GetDevicesInPlacementResponse {
    /**
     * An object containing the devices (zero or more) within the placement.
     */
    devices: DeviceMap;
  }
  export interface ListPlacementsRequest {
    /**
     * The project containing the placements to be listed.
     */
    projectName: ProjectName;
    /**
     * The token to retrieve the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return per request. If not set, a default value of 100 is used.
     */
    maxResults?: MaxResults;
  }
  export interface ListPlacementsResponse {
    /**
     * An object listing the requested placements.
     */
    placements: PlacementSummaryList;
    /**
     * The token used to retrieve the next set of results - will be effectively empty if there are no further results.
     */
    nextToken?: NextToken;
  }
  export interface ListProjectsRequest {
    /**
     * The token to retrieve the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return per request. If not set, a default value of 100 is used.
     */
    maxResults?: MaxResults;
  }
  export interface ListProjectsResponse {
    /**
     * An object containing the list of projects.
     */
    projects: ProjectSummaryList;
    /**
     * The token used to retrieve the next set of results - will be effectively empty if there are no further results.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource whose tags you want to list.
     */
    resourceArn: ProjectArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags (metadata key/value pairs) which you have assigned to the resource.
     */
    tags?: TagMap;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export type PlacementAttributeMap = {[key: string]: AttributeValue};
  export interface PlacementDescription {
    /**
     * The name of the project containing the placement.
     */
    projectName: ProjectName;
    /**
     * The name of the placement.
     */
    placementName: PlacementName;
    /**
     * The user-defined attributes associated with the placement.
     */
    attributes: PlacementAttributeMap;
    /**
     * The date when the placement was initially created, in UNIX epoch time format.
     */
    createdDate: Time;
    /**
     * The date when the placement was last updated, in UNIX epoch time format. If the placement was not updated, then createdDate and updatedDate are the same.
     */
    updatedDate: Time;
  }
  export type PlacementName = string;
  export interface PlacementSummary {
    /**
     * The name of the project containing the placement.
     */
    projectName: ProjectName;
    /**
     * The name of the placement being summarized.
     */
    placementName: PlacementName;
    /**
     * The date when the placement was originally created, in UNIX epoch time format.
     */
    createdDate: Time;
    /**
     * The date when the placement was last updated, in UNIX epoch time format. If the placement was not updated, then createdDate and updatedDate are the same.
     */
    updatedDate: Time;
  }
  export type PlacementSummaryList = PlacementSummary[];
  export interface PlacementTemplate {
    /**
     * The default attributes (key/value pairs) to be applied to all placements using this template.
     */
    defaultAttributes?: DefaultPlacementAttributeMap;
    /**
     * An object specifying the DeviceTemplate for all placements using this (PlacementTemplate) template.
     */
    deviceTemplates?: DeviceTemplateMap;
  }
  export type ProjectArn = string;
  export interface ProjectDescription {
    /**
     * The ARN of the project.
     */
    arn?: ProjectArn;
    /**
     * The name of the project for which to obtain information from.
     */
    projectName: ProjectName;
    /**
     * The description of the project.
     */
    description?: Description;
    /**
     * The date when the project was originally created, in UNIX epoch time format.
     */
    createdDate: Time;
    /**
     * The date when the project was last updated, in UNIX epoch time format. If the project was not updated, then createdDate and updatedDate are the same.
     */
    updatedDate: Time;
    /**
     * An object describing the project's placement specifications.
     */
    placementTemplate?: PlacementTemplate;
    /**
     * The tags (metadata key/value pairs) associated with the project.
     */
    tags?: TagMap;
  }
  export type ProjectName = string;
  export interface ProjectSummary {
    /**
     * The ARN of the project.
     */
    arn?: ProjectArn;
    /**
     * The name of the project being summarized.
     */
    projectName: ProjectName;
    /**
     * The date when the project was originally created, in UNIX epoch time format.
     */
    createdDate: Time;
    /**
     * The date when the project was last updated, in UNIX epoch time format. If the project was not updated, then createdDate and updatedDate are the same.
     */
    updatedDate: Time;
    /**
     * The tags (metadata key/value pairs) associated with the project.
     */
    tags?: TagMap;
  }
  export type ProjectSummaryList = ProjectSummary[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the resouce for which tag(s) should be added or modified.
     */
    resourceArn: ProjectArn;
    /**
     * The new or modifying tag(s) for the resource. See AWS IoT 1-Click Service Limits for the maximum number of tags allowed per resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Time = Date;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource whose tag you want to remove.
     */
    resourceArn: ProjectArn;
    /**
     * The keys of those tags which you want to remove.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdatePlacementRequest {
    /**
     * The name of the placement to update.
     */
    placementName: PlacementName;
    /**
     * The name of the project containing the placement to be updated.
     */
    projectName: ProjectName;
    /**
     * The user-defined object of attributes used to update the placement. The maximum number of key/value pairs is 50.
     */
    attributes?: PlacementAttributeMap;
  }
  export interface UpdatePlacementResponse {
  }
  export interface UpdateProjectRequest {
    /**
     * The name of the project to be updated.
     */
    projectName: ProjectName;
    /**
     * An optional user-defined description for the project.
     */
    description?: Description;
    /**
     * An object defining the project update. Once a project has been created, you cannot add device template names to the project. However, for a given placementTemplate, you can update the associated callbackOverrides for the device definition using this API.
     */
    placementTemplate?: PlacementTemplate;
  }
  export interface UpdateProjectResponse {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-05-14"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IoT1ClickProjects client.
   */
  export import Types = IoT1ClickProjects;
}
export = IoT1ClickProjects;
