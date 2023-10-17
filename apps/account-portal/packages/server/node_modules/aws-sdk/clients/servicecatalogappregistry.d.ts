import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ServiceCatalogAppRegistry extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ServiceCatalogAppRegistry.Types.ClientConfiguration)
  config: Config & ServiceCatalogAppRegistry.Types.ClientConfiguration;
  /**
   * Associates an attribute group with an application to augment the application's metadata with the group's attributes. This feature enables applications to be described with user-defined details that are machine-readable, such as third-party integrations.
   */
  associateAttributeGroup(params: ServiceCatalogAppRegistry.Types.AssociateAttributeGroupRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.AssociateAttributeGroupResponse) => void): Request<ServiceCatalogAppRegistry.Types.AssociateAttributeGroupResponse, AWSError>;
  /**
   * Associates an attribute group with an application to augment the application's metadata with the group's attributes. This feature enables applications to be described with user-defined details that are machine-readable, such as third-party integrations.
   */
  associateAttributeGroup(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.AssociateAttributeGroupResponse) => void): Request<ServiceCatalogAppRegistry.Types.AssociateAttributeGroupResponse, AWSError>;
  /**
   *  Associates a resource with an application. The resource can be specified by its ARN or name. The application can be specified by ARN, ID, or name. 
   */
  associateResource(params: ServiceCatalogAppRegistry.Types.AssociateResourceRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.AssociateResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.AssociateResourceResponse, AWSError>;
  /**
   *  Associates a resource with an application. The resource can be specified by its ARN or name. The application can be specified by ARN, ID, or name. 
   */
  associateResource(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.AssociateResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.AssociateResourceResponse, AWSError>;
  /**
   * Creates a new application that is the top-level node in a hierarchy of related cloud resource abstractions.
   */
  createApplication(params: ServiceCatalogAppRegistry.Types.CreateApplicationRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.CreateApplicationResponse) => void): Request<ServiceCatalogAppRegistry.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates a new application that is the top-level node in a hierarchy of related cloud resource abstractions.
   */
  createApplication(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.CreateApplicationResponse) => void): Request<ServiceCatalogAppRegistry.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates a new attribute group as a container for user-defined attributes. This feature enables users to have full control over their cloud application's metadata in a rich machine-readable format to facilitate integration with automated workflows and third-party tools.
   */
  createAttributeGroup(params: ServiceCatalogAppRegistry.Types.CreateAttributeGroupRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.CreateAttributeGroupResponse) => void): Request<ServiceCatalogAppRegistry.Types.CreateAttributeGroupResponse, AWSError>;
  /**
   * Creates a new attribute group as a container for user-defined attributes. This feature enables users to have full control over their cloud application's metadata in a rich machine-readable format to facilitate integration with automated workflows and third-party tools.
   */
  createAttributeGroup(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.CreateAttributeGroupResponse) => void): Request<ServiceCatalogAppRegistry.Types.CreateAttributeGroupResponse, AWSError>;
  /**
   * Deletes an application that is specified either by its application ID, name, or ARN. All associated attribute groups and resources must be disassociated from it before deleting an application.
   */
  deleteApplication(params: ServiceCatalogAppRegistry.Types.DeleteApplicationRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.DeleteApplicationResponse) => void): Request<ServiceCatalogAppRegistry.Types.DeleteApplicationResponse, AWSError>;
  /**
   * Deletes an application that is specified either by its application ID, name, or ARN. All associated attribute groups and resources must be disassociated from it before deleting an application.
   */
  deleteApplication(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.DeleteApplicationResponse) => void): Request<ServiceCatalogAppRegistry.Types.DeleteApplicationResponse, AWSError>;
  /**
   * Deletes an attribute group, specified either by its attribute group ID, name, or ARN.
   */
  deleteAttributeGroup(params: ServiceCatalogAppRegistry.Types.DeleteAttributeGroupRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.DeleteAttributeGroupResponse) => void): Request<ServiceCatalogAppRegistry.Types.DeleteAttributeGroupResponse, AWSError>;
  /**
   * Deletes an attribute group, specified either by its attribute group ID, name, or ARN.
   */
  deleteAttributeGroup(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.DeleteAttributeGroupResponse) => void): Request<ServiceCatalogAppRegistry.Types.DeleteAttributeGroupResponse, AWSError>;
  /**
   * Disassociates an attribute group from an application to remove the extra attributes contained in the attribute group from the application's metadata. This operation reverts AssociateAttributeGroup.
   */
  disassociateAttributeGroup(params: ServiceCatalogAppRegistry.Types.DisassociateAttributeGroupRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.DisassociateAttributeGroupResponse) => void): Request<ServiceCatalogAppRegistry.Types.DisassociateAttributeGroupResponse, AWSError>;
  /**
   * Disassociates an attribute group from an application to remove the extra attributes contained in the attribute group from the application's metadata. This operation reverts AssociateAttributeGroup.
   */
  disassociateAttributeGroup(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.DisassociateAttributeGroupResponse) => void): Request<ServiceCatalogAppRegistry.Types.DisassociateAttributeGroupResponse, AWSError>;
  /**
   * Disassociates a resource from application. Both the resource and the application can be specified either by ID or name.
   */
  disassociateResource(params: ServiceCatalogAppRegistry.Types.DisassociateResourceRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.DisassociateResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.DisassociateResourceResponse, AWSError>;
  /**
   * Disassociates a resource from application. Both the resource and the application can be specified either by ID or name.
   */
  disassociateResource(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.DisassociateResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.DisassociateResourceResponse, AWSError>;
  /**
   *  Retrieves metadata information about one of your applications. The application can be specified by its ARN, ID, or name (which is unique within one account in one region at a given point in time). Specify by ARN or ID in automated workflows if you want to make sure that the exact same application is returned or a ResourceNotFoundException is thrown, avoiding the ABA addressing problem. 
   */
  getApplication(params: ServiceCatalogAppRegistry.Types.GetApplicationRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.GetApplicationResponse) => void): Request<ServiceCatalogAppRegistry.Types.GetApplicationResponse, AWSError>;
  /**
   *  Retrieves metadata information about one of your applications. The application can be specified by its ARN, ID, or name (which is unique within one account in one region at a given point in time). Specify by ARN or ID in automated workflows if you want to make sure that the exact same application is returned or a ResourceNotFoundException is thrown, avoiding the ABA addressing problem. 
   */
  getApplication(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.GetApplicationResponse) => void): Request<ServiceCatalogAppRegistry.Types.GetApplicationResponse, AWSError>;
  /**
   * Gets the resource associated with the application.
   */
  getAssociatedResource(params: ServiceCatalogAppRegistry.Types.GetAssociatedResourceRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.GetAssociatedResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.GetAssociatedResourceResponse, AWSError>;
  /**
   * Gets the resource associated with the application.
   */
  getAssociatedResource(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.GetAssociatedResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.GetAssociatedResourceResponse, AWSError>;
  /**
   *  Retrieves an attribute group by its ARN, ID, or name. The attribute group can be specified by its ARN, ID, or name. 
   */
  getAttributeGroup(params: ServiceCatalogAppRegistry.Types.GetAttributeGroupRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.GetAttributeGroupResponse) => void): Request<ServiceCatalogAppRegistry.Types.GetAttributeGroupResponse, AWSError>;
  /**
   *  Retrieves an attribute group by its ARN, ID, or name. The attribute group can be specified by its ARN, ID, or name. 
   */
  getAttributeGroup(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.GetAttributeGroupResponse) => void): Request<ServiceCatalogAppRegistry.Types.GetAttributeGroupResponse, AWSError>;
  /**
   *  Retrieves a TagKey configuration from an account. 
   */
  getConfiguration(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.GetConfigurationResponse) => void): Request<ServiceCatalogAppRegistry.Types.GetConfigurationResponse, AWSError>;
  /**
   * Retrieves a list of all of your applications. Results are paginated.
   */
  listApplications(params: ServiceCatalogAppRegistry.Types.ListApplicationsRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.ListApplicationsResponse) => void): Request<ServiceCatalogAppRegistry.Types.ListApplicationsResponse, AWSError>;
  /**
   * Retrieves a list of all of your applications. Results are paginated.
   */
  listApplications(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.ListApplicationsResponse) => void): Request<ServiceCatalogAppRegistry.Types.ListApplicationsResponse, AWSError>;
  /**
   * Lists all attribute groups that are associated with specified application. Results are paginated.
   */
  listAssociatedAttributeGroups(params: ServiceCatalogAppRegistry.Types.ListAssociatedAttributeGroupsRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.ListAssociatedAttributeGroupsResponse) => void): Request<ServiceCatalogAppRegistry.Types.ListAssociatedAttributeGroupsResponse, AWSError>;
  /**
   * Lists all attribute groups that are associated with specified application. Results are paginated.
   */
  listAssociatedAttributeGroups(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.ListAssociatedAttributeGroupsResponse) => void): Request<ServiceCatalogAppRegistry.Types.ListAssociatedAttributeGroupsResponse, AWSError>;
  /**
   *  Lists all of the resources that are associated with the specified application. Results are paginated.    If you share an application, and a consumer account associates a tag query to the application, all of the users who can access the application can also view the tag values in all accounts that are associated with it using this API.  
   */
  listAssociatedResources(params: ServiceCatalogAppRegistry.Types.ListAssociatedResourcesRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.ListAssociatedResourcesResponse) => void): Request<ServiceCatalogAppRegistry.Types.ListAssociatedResourcesResponse, AWSError>;
  /**
   *  Lists all of the resources that are associated with the specified application. Results are paginated.    If you share an application, and a consumer account associates a tag query to the application, all of the users who can access the application can also view the tag values in all accounts that are associated with it using this API.  
   */
  listAssociatedResources(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.ListAssociatedResourcesResponse) => void): Request<ServiceCatalogAppRegistry.Types.ListAssociatedResourcesResponse, AWSError>;
  /**
   * Lists all attribute groups which you have access to. Results are paginated.
   */
  listAttributeGroups(params: ServiceCatalogAppRegistry.Types.ListAttributeGroupsRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.ListAttributeGroupsResponse) => void): Request<ServiceCatalogAppRegistry.Types.ListAttributeGroupsResponse, AWSError>;
  /**
   * Lists all attribute groups which you have access to. Results are paginated.
   */
  listAttributeGroups(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.ListAttributeGroupsResponse) => void): Request<ServiceCatalogAppRegistry.Types.ListAttributeGroupsResponse, AWSError>;
  /**
   * Lists the details of all attribute groups associated with a specific application. The results display in pages.
   */
  listAttributeGroupsForApplication(params: ServiceCatalogAppRegistry.Types.ListAttributeGroupsForApplicationRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.ListAttributeGroupsForApplicationResponse) => void): Request<ServiceCatalogAppRegistry.Types.ListAttributeGroupsForApplicationResponse, AWSError>;
  /**
   * Lists the details of all attribute groups associated with a specific application. The results display in pages.
   */
  listAttributeGroupsForApplication(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.ListAttributeGroupsForApplicationResponse) => void): Request<ServiceCatalogAppRegistry.Types.ListAttributeGroupsForApplicationResponse, AWSError>;
  /**
   * Lists all of the tags on the resource.
   */
  listTagsForResource(params: ServiceCatalogAppRegistry.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.ListTagsForResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all of the tags on the resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.ListTagsForResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Associates a TagKey configuration to an account. 
   */
  putConfiguration(params: ServiceCatalogAppRegistry.Types.PutConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Associates a TagKey configuration to an account. 
   */
  putConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Syncs the resource with current AppRegistry records. Specifically, the resource’s AppRegistry system tags sync with its associated application. We remove the resource's AppRegistry system tags if it does not associate with the application. The caller must have permissions to read and update the resource.
   */
  syncResource(params: ServiceCatalogAppRegistry.Types.SyncResourceRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.SyncResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.SyncResourceResponse, AWSError>;
  /**
   * Syncs the resource with current AppRegistry records. Specifically, the resource’s AppRegistry system tags sync with its associated application. We remove the resource's AppRegistry system tags if it does not associate with the application. The caller must have permissions to read and update the resource.
   */
  syncResource(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.SyncResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.SyncResourceResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified resource. Each tag consists of a key and an optional value. If a tag with the same key is already associated with the resource, this action updates its value. This operation returns an empty response if the call was successful.
   */
  tagResource(params: ServiceCatalogAppRegistry.Types.TagResourceRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.TagResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified resource. Each tag consists of a key and an optional value. If a tag with the same key is already associated with the resource, this action updates its value. This operation returns an empty response if the call was successful.
   */
  tagResource(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.TagResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource. This operation returns an empty response if the call was successful.
   */
  untagResource(params: ServiceCatalogAppRegistry.Types.UntagResourceRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.UntagResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource. This operation returns an empty response if the call was successful.
   */
  untagResource(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.UntagResourceResponse) => void): Request<ServiceCatalogAppRegistry.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an existing application with new attributes.
   */
  updateApplication(params: ServiceCatalogAppRegistry.Types.UpdateApplicationRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.UpdateApplicationResponse) => void): Request<ServiceCatalogAppRegistry.Types.UpdateApplicationResponse, AWSError>;
  /**
   * Updates an existing application with new attributes.
   */
  updateApplication(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.UpdateApplicationResponse) => void): Request<ServiceCatalogAppRegistry.Types.UpdateApplicationResponse, AWSError>;
  /**
   * Updates an existing attribute group with new details. 
   */
  updateAttributeGroup(params: ServiceCatalogAppRegistry.Types.UpdateAttributeGroupRequest, callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.UpdateAttributeGroupResponse) => void): Request<ServiceCatalogAppRegistry.Types.UpdateAttributeGroupResponse, AWSError>;
  /**
   * Updates an existing attribute group with new details. 
   */
  updateAttributeGroup(callback?: (err: AWSError, data: ServiceCatalogAppRegistry.Types.UpdateAttributeGroupResponse) => void): Request<ServiceCatalogAppRegistry.Types.UpdateAttributeGroupResponse, AWSError>;
}
declare namespace ServiceCatalogAppRegistry {
  export interface AppRegistryConfiguration {
    /**
     *  Includes the definition of a tagQuery. 
     */
    tagQueryConfiguration?: TagQueryConfiguration;
  }
  export interface Application {
    /**
     * The identifier of the application.
     */
    id?: ApplicationId;
    /**
     * The Amazon resource name (ARN) that specifies the application across services.
     */
    arn?: ApplicationArn;
    /**
     * The name of the application. The name must be unique in the region in which you are creating the application.
     */
    name?: Name;
    /**
     * The description of the application.
     */
    description?: Description;
    /**
     * The ISO-8601 formatted timestamp of the moment when the application was created.
     */
    creationTime?: Timestamp;
    /**
     *  The ISO-8601 formatted timestamp of the moment when the application was last updated.
     */
    lastUpdateTime?: Timestamp;
    /**
     * Key-value pairs you can use to associate with the application.
     */
    tags?: Tags;
  }
  export type ApplicationArn = string;
  export type ApplicationId = string;
  export type ApplicationSpecifier = string;
  export type ApplicationSummaries = ApplicationSummary[];
  export interface ApplicationSummary {
    /**
     * The identifier of the application.
     */
    id?: ApplicationId;
    /**
     * The Amazon resource name (ARN) that specifies the application across services.
     */
    arn?: ApplicationArn;
    /**
     * The name of the application. The name must be unique in the region in which you are creating the application.
     */
    name?: Name;
    /**
     * The description of the application.
     */
    description?: Description;
    /**
     * The ISO-8601 formatted timestamp of the moment when the application was created.
     */
    creationTime?: Timestamp;
    /**
     *  The ISO-8601 formatted timestamp of the moment when the application was last updated.
     */
    lastUpdateTime?: Timestamp;
  }
  export type Arn = string;
  export interface AssociateAttributeGroupRequest {
    /**
     *  The name, ID, or ARN of the application. 
     */
    application: ApplicationSpecifier;
    /**
     *  The name, ID, or ARN of the attribute group that holds the attributes to describe the application. 
     */
    attributeGroup: AttributeGroupSpecifier;
  }
  export interface AssociateAttributeGroupResponse {
    /**
     * The Amazon resource name (ARN) of the application that was augmented with attributes.
     */
    applicationArn?: ApplicationArn;
    /**
     * The Amazon resource name (ARN) of the attribute group that contains the application's new attributes.
     */
    attributeGroupArn?: AttributeGroupArn;
  }
  export interface AssociateResourceRequest {
    /**
     *  The name, ID, or ARN of the application. 
     */
    application: ApplicationSpecifier;
    /**
     * The type of resource of which the application will be associated.
     */
    resourceType: ResourceType;
    /**
     * The name or ID of the resource of which the application will be associated.
     */
    resource: ResourceSpecifier;
  }
  export interface AssociateResourceResponse {
    /**
     * The Amazon resource name (ARN) of the application that was augmented with attributes.
     */
    applicationArn?: ApplicationArn;
    /**
     * The Amazon resource name (ARN) that specifies the resource.
     */
    resourceArn?: Arn;
  }
  export type AssociationCount = number;
  export interface AttributeGroup {
    /**
     * The globally unique attribute group identifier of the attribute group.
     */
    id?: AttributeGroupId;
    /**
     * The Amazon resource name (ARN) that specifies the attribute group across services.
     */
    arn?: AttributeGroupArn;
    /**
     * The name of the attribute group.
     */
    name?: Name;
    /**
     * The description of the attribute group that the user provides.
     */
    description?: Description;
    /**
     * The ISO-8601 formatted timestamp of the moment the attribute group was created.
     */
    creationTime?: Timestamp;
    /**
     * The ISO-8601 formatted timestamp of the moment the attribute group was last updated. This time is the same as the creationTime for a newly created attribute group.
     */
    lastUpdateTime?: Timestamp;
    /**
     * Key-value pairs you can use to associate with the attribute group.
     */
    tags?: Tags;
  }
  export type AttributeGroupArn = string;
  export interface AttributeGroupDetails {
    /**
     * The unique identifier of the attribute group.
     */
    id?: AttributeGroupId;
    /**
     * The Amazon resource name (ARN) that specifies the attribute group.
     */
    arn?: AttributeGroupArn;
    /**
     *   This field is no longer supported. We recommend you don't use the field when using ListAttributeGroupsForApplication.    The name of the attribute group. 
     */
    name?: Name;
    /**
     * The service principal that created the attribute group.
     */
    createdBy?: CreatedBy;
  }
  export type AttributeGroupDetailsList = AttributeGroupDetails[];
  export type AttributeGroupId = string;
  export type AttributeGroupIds = AttributeGroupId[];
  export type AttributeGroupSpecifier = string;
  export type AttributeGroupSummaries = AttributeGroupSummary[];
  export interface AttributeGroupSummary {
    /**
     * The globally unique attribute group identifier of the attribute group.
     */
    id?: AttributeGroupId;
    /**
     * The Amazon resource name (ARN) that specifies the attribute group across services.
     */
    arn?: AttributeGroupArn;
    /**
     * The name of the attribute group.
     */
    name?: Name;
    /**
     * The description of the attribute group that the user provides.
     */
    description?: Description;
    /**
     * The ISO-8601 formatted timestamp of the moment the attribute group was created.
     */
    creationTime?: Timestamp;
    /**
     * The ISO-8601 formatted timestamp of the moment the attribute group was last updated. This time is the same as the creationTime for a newly created attribute group.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The service principal that created the attribute group.
     */
    createdBy?: CreatedBy;
  }
  export type Attributes = string;
  export type ClientToken = string;
  export interface CreateApplicationRequest {
    /**
     * The name of the application. The name must be unique in the region in which you are creating the application.
     */
    name: Name;
    /**
     * The description of the application.
     */
    description?: Description;
    /**
     * Key-value pairs you can use to associate with the application.
     */
    tags?: Tags;
    /**
     * A unique identifier that you provide to ensure idempotency. If you retry a request that completed successfully using the same client token and the same parameters, the retry succeeds without performing any further actions. If you retry a successful request using the same client token, but one or more of the parameters are different, the retry fails.
     */
    clientToken: ClientToken;
  }
  export interface CreateApplicationResponse {
    /**
     * Information about the application.
     */
    application?: Application;
  }
  export interface CreateAttributeGroupRequest {
    /**
     * The name of the attribute group.
     */
    name: Name;
    /**
     * The description of the attribute group that the user provides.
     */
    description?: Description;
    /**
     * A JSON string in the form of nested key-value pairs that represent the attributes in the group and describes an application and its components.
     */
    attributes: Attributes;
    /**
     * Key-value pairs you can use to associate with the attribute group.
     */
    tags?: Tags;
    /**
     * A unique identifier that you provide to ensure idempotency. If you retry a request that completed successfully using the same client token and the same parameters, the retry succeeds without performing any further actions. If you retry a successful request using the same client token, but one or more of the parameters are different, the retry fails.
     */
    clientToken: ClientToken;
  }
  export interface CreateAttributeGroupResponse {
    /**
     * Information about the attribute group.
     */
    attributeGroup?: AttributeGroup;
  }
  export type CreatedBy = string;
  export interface DeleteApplicationRequest {
    /**
     *  The name, ID, or ARN of the application. 
     */
    application: ApplicationSpecifier;
  }
  export interface DeleteApplicationResponse {
    /**
     * Information about the deleted application.
     */
    application?: ApplicationSummary;
  }
  export interface DeleteAttributeGroupRequest {
    /**
     *  The name, ID, or ARN of the attribute group that holds the attributes to describe the application. 
     */
    attributeGroup: AttributeGroupSpecifier;
  }
  export interface DeleteAttributeGroupResponse {
    /**
     * Information about the deleted attribute group.
     */
    attributeGroup?: AttributeGroupSummary;
  }
  export type Description = string;
  export interface DisassociateAttributeGroupRequest {
    /**
     *  The name, ID, or ARN of the application. 
     */
    application: ApplicationSpecifier;
    /**
     *  The name, ID, or ARN of the attribute group that holds the attributes to describe the application. 
     */
    attributeGroup: AttributeGroupSpecifier;
  }
  export interface DisassociateAttributeGroupResponse {
    /**
     * The Amazon resource name (ARN) that specifies the application.
     */
    applicationArn?: ApplicationArn;
    /**
     * The Amazon resource name (ARN) that specifies the attribute group.
     */
    attributeGroupArn?: AttributeGroupArn;
  }
  export interface DisassociateResourceRequest {
    /**
     * The name or ID of the application.
     */
    application: ApplicationSpecifier;
    /**
     * The type of the resource that is being disassociated.
     */
    resourceType: ResourceType;
    /**
     * The name or ID of the resource.
     */
    resource: ResourceSpecifier;
  }
  export interface DisassociateResourceResponse {
    /**
     * The Amazon resource name (ARN) that specifies the application.
     */
    applicationArn?: ApplicationArn;
    /**
     * The Amazon resource name (ARN) that specifies the resource.
     */
    resourceArn?: Arn;
  }
  export interface GetApplicationRequest {
    /**
     *  The name, ID, or ARN of the application. 
     */
    application: ApplicationSpecifier;
  }
  export interface GetApplicationResponse {
    /**
     * The identifier of the application.
     */
    id?: ApplicationId;
    /**
     * The Amazon resource name (ARN) that specifies the application across services.
     */
    arn?: ApplicationArn;
    /**
     * The name of the application. The name must be unique in the region in which you are creating the application.
     */
    name?: Name;
    /**
     * The description of the application.
     */
    description?: Description;
    /**
     * The ISO-8601 formatted timestamp of the moment when the application was created.
     */
    creationTime?: Timestamp;
    /**
     * The ISO-8601 formatted timestamp of the moment when the application was last updated.
     */
    lastUpdateTime?: Timestamp;
    /**
     * The number of top-level resources that were registered as part of this application.
     */
    associatedResourceCount?: AssociationCount;
    /**
     * Key-value pairs associated with the application.
     */
    tags?: Tags;
    /**
     *  The information about the integration of the application with other services, such as Resource Groups. 
     */
    integrations?: Integrations;
  }
  export interface GetAssociatedResourceRequest {
    /**
     *  The name, ID, or ARN of the application. 
     */
    application: ApplicationSpecifier;
    /**
     * The type of resource associated with the application.
     */
    resourceType: ResourceType;
    /**
     * The name or ID of the resource associated with the application.
     */
    resource: ResourceSpecifier;
  }
  export interface GetAssociatedResourceResponse {
    /**
     * The resource associated with the application.
     */
    resource?: Resource;
  }
  export interface GetAttributeGroupRequest {
    /**
     *  The name, ID, or ARN of the attribute group that holds the attributes to describe the application. 
     */
    attributeGroup: AttributeGroupSpecifier;
  }
  export interface GetAttributeGroupResponse {
    /**
     * The identifier of the attribute group.
     */
    id?: AttributeGroupId;
    /**
     * The Amazon resource name (ARN) that specifies the attribute group across services.
     */
    arn?: AttributeGroupArn;
    /**
     * The name of the attribute group.
     */
    name?: Name;
    /**
     * The description of the attribute group that the user provides.
     */
    description?: Description;
    /**
     * A JSON string in the form of nested key-value pairs that represent the attributes in the group and describes an application and its components.
     */
    attributes?: Attributes;
    /**
     * The ISO-8601 formatted timestamp of the moment the attribute group was created.
     */
    creationTime?: Timestamp;
    /**
     * The ISO-8601 formatted timestamp of the moment the attribute group was last updated. This time is the same as the creationTime for a newly created attribute group.
     */
    lastUpdateTime?: Timestamp;
    /**
     * Key-value pairs associated with the attribute group.
     */
    tags?: Tags;
    /**
     * The service principal that created the attribute group.
     */
    createdBy?: CreatedBy;
  }
  export interface GetConfigurationResponse {
    /**
     *  Retrieves TagKey configuration from an account. 
     */
    configuration?: AppRegistryConfiguration;
  }
  export interface Integrations {
    /**
     *  The information about the resource group integration.
     */
    resourceGroup?: ResourceGroup;
  }
  export interface ListApplicationsRequest {
    /**
     * The token to use to get the next page of results after a previous API call. 
     */
    nextToken?: NextToken;
    /**
     * The upper bound of the number of results to return (cannot exceed 25). If this parameter is omitted, it defaults to 25. This value is optional.
     */
    maxResults?: MaxResults;
  }
  export interface ListApplicationsResponse {
    /**
     * This list of applications.
     */
    applications?: ApplicationSummaries;
    /**
     * The token to use to get the next page of results after a previous API call. 
     */
    nextToken?: NextToken;
  }
  export interface ListAssociatedAttributeGroupsRequest {
    /**
     * The name or ID of the application.
     */
    application: ApplicationSpecifier;
    /**
     * The token to use to get the next page of results after a previous API call. 
     */
    nextToken?: NextToken;
    /**
     * The upper bound of the number of results to return (cannot exceed 25). If this parameter is omitted, it defaults to 25. This value is optional.
     */
    maxResults?: MaxResults;
  }
  export interface ListAssociatedAttributeGroupsResponse {
    /**
     * A list of attribute group IDs.
     */
    attributeGroups?: AttributeGroupIds;
    /**
     * The token to use to get the next page of results after a previous API call. 
     */
    nextToken?: NextToken;
  }
  export interface ListAssociatedResourcesRequest {
    /**
     *  The name, ID, or ARN of the application. 
     */
    application: ApplicationSpecifier;
    /**
     * The token to use to get the next page of results after a previous API call. 
     */
    nextToken?: NextToken;
    /**
     * The upper bound of the number of results to return (cannot exceed 25). If this parameter is omitted, it defaults to 25. This value is optional.
     */
    maxResults?: MaxResults;
  }
  export interface ListAssociatedResourcesResponse {
    /**
     * Information about the resources.
     */
    resources?: Resources;
    /**
     * The token to use to get the next page of results after a previous API call. 
     */
    nextToken?: NextToken;
  }
  export interface ListAttributeGroupsForApplicationRequest {
    /**
     * The name or ID of the application.
     */
    application: ApplicationSpecifier;
    /**
     * This token retrieves the next page of results after a previous API call.
     */
    nextToken?: NextToken;
    /**
     * The upper bound of the number of results to return. The value cannot exceed 25. If you omit this parameter, it defaults to 25. This value is optional.
     */
    maxResults?: MaxResults;
  }
  export interface ListAttributeGroupsForApplicationResponse {
    /**
     *  The details related to a specific attribute group. 
     */
    attributeGroupsDetails?: AttributeGroupDetailsList;
    /**
     * The token to use to get the next page of results after a previous API call.
     */
    nextToken?: NextToken;
  }
  export interface ListAttributeGroupsRequest {
    /**
     * The token to use to get the next page of results after a previous API call. 
     */
    nextToken?: NextToken;
    /**
     * The upper bound of the number of results to return (cannot exceed 25). If this parameter is omitted, it defaults to 25. This value is optional.
     */
    maxResults?: MaxResults;
  }
  export interface ListAttributeGroupsResponse {
    /**
     * This list of attribute groups.
     */
    attributeGroups?: AttributeGroupSummaries;
    /**
     * The token to use to get the next page of results after a previous API call. 
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon resource name (ARN) that specifies the resource.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags on the resource.
     */
    tags?: Tags;
  }
  export type MaxResults = number;
  export type Name = string;
  export type NextToken = string;
  export interface PutConfigurationRequest {
    /**
     *  Associates a TagKey configuration to an account. 
     */
    configuration: AppRegistryConfiguration;
  }
  export interface Resource {
    /**
     * The name of the resource.
     */
    name?: ResourceSpecifier;
    /**
     * The Amazon resource name (ARN) of the resource.
     */
    arn?: StackArn;
    /**
     * The time the resource was associated with the application.
     */
    associationTime?: Timestamp;
    /**
     * The service integration information about the resource. 
     */
    integrations?: ResourceIntegrations;
  }
  export interface ResourceDetails {
    /**
     * The value of the tag.
     */
    tagValue?: TagValue;
  }
  export interface ResourceGroup {
    /**
     * The state of the propagation process for the resource group. The states includes:  CREATING if the resource group is in the process of being created.  CREATE_COMPLETE if the resource group was created successfully.  CREATE_FAILED if the resource group failed to be created.  UPDATING if the resource group is in the process of being updated.  UPDATE_COMPLETE if the resource group updated successfully.  UPDATE_FAILED if the resource group could not update successfully.
     */
    state?: ResourceGroupState;
    /**
     * The Amazon resource name (ARN) of the resource group.
     */
    arn?: Arn;
    /**
     * The error message that generates when the propagation process for the resource group fails.
     */
    errorMessage?: String;
  }
  export type ResourceGroupState = "CREATING"|"CREATE_COMPLETE"|"CREATE_FAILED"|"UPDATING"|"UPDATE_COMPLETE"|"UPDATE_FAILED"|string;
  export interface ResourceInfo {
    /**
     * The name of the resource.
     */
    name?: ResourceSpecifier;
    /**
     * The Amazon resource name (ARN) that specifies the resource across services.
     */
    arn?: Arn;
    /**
     *  Provides information about the Service Catalog App Registry resource type. 
     */
    resourceType?: ResourceType;
    /**
     *  The details related to the resource. 
     */
    resourceDetails?: ResourceDetails;
  }
  export interface ResourceIntegrations {
    /**
     * The information about the integration of Resource Groups.
     */
    resourceGroup?: ResourceGroup;
  }
  export type ResourceSpecifier = string;
  export type ResourceType = "CFN_STACK"|"RESOURCE_TAG_VALUE"|string;
  export type Resources = ResourceInfo[];
  export type StackArn = string;
  export type String = string;
  export type SyncAction = "START_SYNC"|"NO_ACTION"|string;
  export interface SyncResourceRequest {
    /**
     * The type of resource of which the application will be associated.
     */
    resourceType: ResourceType;
    /**
     * An entity you can work with and specify with a name or ID. Examples include an Amazon EC2 instance, an Amazon Web Services CloudFormation stack, or an Amazon S3 bucket.
     */
    resource: ResourceSpecifier;
  }
  export interface SyncResourceResponse {
    /**
     * The Amazon resource name (ARN) that specifies the application.
     */
    applicationArn?: ApplicationArn;
    /**
     * The Amazon resource name (ARN) that specifies the resource.
     */
    resourceArn?: Arn;
    /**
     * The results of the output if an application is associated with an ARN value, which could be syncStarted or None.
     */
    actionTaken?: SyncAction;
  }
  export type TagKey = string;
  export type TagKeyConfig = string;
  export type TagKeys = TagKey[];
  export interface TagQueryConfiguration {
    /**
     *  Condition in the IAM policy that associates resources to an application. 
     */
    tagKey?: TagKeyConfig;
  }
  export interface TagResourceRequest {
    /**
     * The Amazon resource name (ARN) that specifies the resource.
     */
    resourceArn: Arn;
    /**
     * The new or modified tags for the resource.
     */
    tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = {[key: string]: TagValue};
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon resource name (ARN) that specifies the resource.
     */
    resourceArn: Arn;
    /**
     * A list of the tag keys to remove from the specified resource.
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateApplicationRequest {
    /**
     *  The name, ID, or ARN of the application that will be updated. 
     */
    application: ApplicationSpecifier;
    /**
     * Deprecated: The new name of the application. The name must be unique in the region in which you are updating the application. Please do not use this field as we have stopped supporting name updates.
     */
    name?: Name;
    /**
     * The new description of the application.
     */
    description?: Description;
  }
  export interface UpdateApplicationResponse {
    /**
     * The updated information of the application.
     */
    application?: Application;
  }
  export interface UpdateAttributeGroupRequest {
    /**
     *  The name, ID, or ARN of the attribute group that holds the attributes to describe the application. 
     */
    attributeGroup: AttributeGroupSpecifier;
    /**
     * Deprecated: The new name of the attribute group. The name must be unique in the region in which you are updating the attribute group. Please do not use this field as we have stopped supporting name updates.
     */
    name?: Name;
    /**
     * The description of the attribute group that the user provides.
     */
    description?: Description;
    /**
     * A JSON string in the form of nested key-value pairs that represent the attributes in the group and describes an application and its components.
     */
    attributes?: Attributes;
  }
  export interface UpdateAttributeGroupResponse {
    /**
     * The updated information of the attribute group.
     */
    attributeGroup?: AttributeGroup;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-06-24"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ServiceCatalogAppRegistry client.
   */
  export import Types = ServiceCatalogAppRegistry;
}
export = ServiceCatalogAppRegistry;
