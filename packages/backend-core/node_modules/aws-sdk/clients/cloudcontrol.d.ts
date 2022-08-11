import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CloudControl extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CloudControl.Types.ClientConfiguration)
  config: Config & CloudControl.Types.ClientConfiguration;
  /**
   * Cancels the specified resource operation request. For more information, see Canceling resource operation requests in the Amazon Web Services Cloud Control API User Guide. Only resource operations requests with a status of PENDING or IN_PROGRESS can be cancelled.
   */
  cancelResourceRequest(params: CloudControl.Types.CancelResourceRequestInput, callback?: (err: AWSError, data: CloudControl.Types.CancelResourceRequestOutput) => void): Request<CloudControl.Types.CancelResourceRequestOutput, AWSError>;
  /**
   * Cancels the specified resource operation request. For more information, see Canceling resource operation requests in the Amazon Web Services Cloud Control API User Guide. Only resource operations requests with a status of PENDING or IN_PROGRESS can be cancelled.
   */
  cancelResourceRequest(callback?: (err: AWSError, data: CloudControl.Types.CancelResourceRequestOutput) => void): Request<CloudControl.Types.CancelResourceRequestOutput, AWSError>;
  /**
   * Creates the specified resource. For more information, see Creating a resource in the Amazon Web Services Cloud Control API User Guide. After you have initiated a resource creation request, you can monitor the progress of your request by calling GetResourceRequestStatus using the RequestToken of the ProgressEvent type returned by CreateResource.
   */
  createResource(params: CloudControl.Types.CreateResourceInput, callback?: (err: AWSError, data: CloudControl.Types.CreateResourceOutput) => void): Request<CloudControl.Types.CreateResourceOutput, AWSError>;
  /**
   * Creates the specified resource. For more information, see Creating a resource in the Amazon Web Services Cloud Control API User Guide. After you have initiated a resource creation request, you can monitor the progress of your request by calling GetResourceRequestStatus using the RequestToken of the ProgressEvent type returned by CreateResource.
   */
  createResource(callback?: (err: AWSError, data: CloudControl.Types.CreateResourceOutput) => void): Request<CloudControl.Types.CreateResourceOutput, AWSError>;
  /**
   * Deletes the specified resource. For details, see Deleting a resource in the Amazon Web Services Cloud Control API User Guide. After you have initiated a resource deletion request, you can monitor the progress of your request by calling GetResourceRequestStatus using the RequestToken of the ProgressEvent returned by DeleteResource.
   */
  deleteResource(params: CloudControl.Types.DeleteResourceInput, callback?: (err: AWSError, data: CloudControl.Types.DeleteResourceOutput) => void): Request<CloudControl.Types.DeleteResourceOutput, AWSError>;
  /**
   * Deletes the specified resource. For details, see Deleting a resource in the Amazon Web Services Cloud Control API User Guide. After you have initiated a resource deletion request, you can monitor the progress of your request by calling GetResourceRequestStatus using the RequestToken of the ProgressEvent returned by DeleteResource.
   */
  deleteResource(callback?: (err: AWSError, data: CloudControl.Types.DeleteResourceOutput) => void): Request<CloudControl.Types.DeleteResourceOutput, AWSError>;
  /**
   * Returns information about the current state of the specified resource. For details, see Reading a resource's current state. You can use this action to return information about an existing resource in your account and Amazon Web Services Region, whether or not those resources were provisioned using Cloud Control API.
   */
  getResource(params: CloudControl.Types.GetResourceInput, callback?: (err: AWSError, data: CloudControl.Types.GetResourceOutput) => void): Request<CloudControl.Types.GetResourceOutput, AWSError>;
  /**
   * Returns information about the current state of the specified resource. For details, see Reading a resource's current state. You can use this action to return information about an existing resource in your account and Amazon Web Services Region, whether or not those resources were provisioned using Cloud Control API.
   */
  getResource(callback?: (err: AWSError, data: CloudControl.Types.GetResourceOutput) => void): Request<CloudControl.Types.GetResourceOutput, AWSError>;
  /**
   * Returns the current status of a resource operation request. For more information, see Tracking the progress of resource operation requests in the Amazon Web Services Cloud Control API User Guide.
   */
  getResourceRequestStatus(params: CloudControl.Types.GetResourceRequestStatusInput, callback?: (err: AWSError, data: CloudControl.Types.GetResourceRequestStatusOutput) => void): Request<CloudControl.Types.GetResourceRequestStatusOutput, AWSError>;
  /**
   * Returns the current status of a resource operation request. For more information, see Tracking the progress of resource operation requests in the Amazon Web Services Cloud Control API User Guide.
   */
  getResourceRequestStatus(callback?: (err: AWSError, data: CloudControl.Types.GetResourceRequestStatusOutput) => void): Request<CloudControl.Types.GetResourceRequestStatusOutput, AWSError>;
  /**
   * Returns existing resource operation requests. This includes requests of all status types. For more information, see Listing active resource operation requests in the Amazon Web Services Cloud Control API User Guide.  Resource operation requests expire after seven days. 
   */
  listResourceRequests(params: CloudControl.Types.ListResourceRequestsInput, callback?: (err: AWSError, data: CloudControl.Types.ListResourceRequestsOutput) => void): Request<CloudControl.Types.ListResourceRequestsOutput, AWSError>;
  /**
   * Returns existing resource operation requests. This includes requests of all status types. For more information, see Listing active resource operation requests in the Amazon Web Services Cloud Control API User Guide.  Resource operation requests expire after seven days. 
   */
  listResourceRequests(callback?: (err: AWSError, data: CloudControl.Types.ListResourceRequestsOutput) => void): Request<CloudControl.Types.ListResourceRequestsOutput, AWSError>;
  /**
   * Returns information about the specified resources. For more information, see Discovering resources in the Amazon Web Services Cloud Control API User Guide. You can use this action to return information about existing resources in your account and Amazon Web Services Region, whether or not those resources were provisioned using Cloud Control API.
   */
  listResources(params: CloudControl.Types.ListResourcesInput, callback?: (err: AWSError, data: CloudControl.Types.ListResourcesOutput) => void): Request<CloudControl.Types.ListResourcesOutput, AWSError>;
  /**
   * Returns information about the specified resources. For more information, see Discovering resources in the Amazon Web Services Cloud Control API User Guide. You can use this action to return information about existing resources in your account and Amazon Web Services Region, whether or not those resources were provisioned using Cloud Control API.
   */
  listResources(callback?: (err: AWSError, data: CloudControl.Types.ListResourcesOutput) => void): Request<CloudControl.Types.ListResourcesOutput, AWSError>;
  /**
   * Updates the specified property values in the resource. You specify your resource property updates as a list of patch operations contained in a JSON patch document that adheres to the  RFC 6902 - JavaScript Object Notation (JSON) Patch  standard. For details on how Cloud Control API performs resource update operations, see Updating a resource in the Amazon Web Services Cloud Control API User Guide. After you have initiated a resource update request, you can monitor the progress of your request by calling GetResourceRequestStatus using the RequestToken of the ProgressEvent returned by UpdateResource. For more information about the properties of a specific resource, refer to the related topic for the resource in the Resource and property types reference in the Amazon Web Services CloudFormation Users Guide.
   */
  updateResource(params: CloudControl.Types.UpdateResourceInput, callback?: (err: AWSError, data: CloudControl.Types.UpdateResourceOutput) => void): Request<CloudControl.Types.UpdateResourceOutput, AWSError>;
  /**
   * Updates the specified property values in the resource. You specify your resource property updates as a list of patch operations contained in a JSON patch document that adheres to the  RFC 6902 - JavaScript Object Notation (JSON) Patch  standard. For details on how Cloud Control API performs resource update operations, see Updating a resource in the Amazon Web Services Cloud Control API User Guide. After you have initiated a resource update request, you can monitor the progress of your request by calling GetResourceRequestStatus using the RequestToken of the ProgressEvent returned by UpdateResource. For more information about the properties of a specific resource, refer to the related topic for the resource in the Resource and property types reference in the Amazon Web Services CloudFormation Users Guide.
   */
  updateResource(callback?: (err: AWSError, data: CloudControl.Types.UpdateResourceOutput) => void): Request<CloudControl.Types.UpdateResourceOutput, AWSError>;
  /**
   * Waits for the resourceRequestSuccess state by periodically calling the underlying CloudControl.getResourceRequestStatusoperation every 5 seconds (at most 720 times). Wait until resource operation request is successful
   */
  waitFor(state: "resourceRequestSuccess", params: CloudControl.Types.GetResourceRequestStatusInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CloudControl.Types.GetResourceRequestStatusOutput) => void): Request<CloudControl.Types.GetResourceRequestStatusOutput, AWSError>;
  /**
   * Waits for the resourceRequestSuccess state by periodically calling the underlying CloudControl.getResourceRequestStatusoperation every 5 seconds (at most 720 times). Wait until resource operation request is successful
   */
  waitFor(state: "resourceRequestSuccess", callback?: (err: AWSError, data: CloudControl.Types.GetResourceRequestStatusOutput) => void): Request<CloudControl.Types.GetResourceRequestStatusOutput, AWSError>;
}
declare namespace CloudControl {
  export interface CancelResourceRequestInput {
    /**
     * The RequestToken of the ProgressEvent object returned by the resource operation request.
     */
    RequestToken: RequestToken;
  }
  export interface CancelResourceRequestOutput {
    ProgressEvent?: ProgressEvent;
  }
  export type ClientToken = string;
  export interface CreateResourceInput {
    /**
     * The name of the resource type.
     */
    TypeName: TypeName;
    /**
     * For private resource types, the type version to use in this resource operation. If you do not specify a resource version, CloudFormation uses the default version.
     */
    TypeVersionId?: TypeVersionId;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) for Cloud Control API to use when performing this resource operation. The role specified must have the permissions required for this operation. The necessary permissions for each event handler are defined in the  handlers  section of the resource type definition schema. If you do not specify a role, Cloud Control API uses a temporary session created using your Amazon Web Services user credentials. For more information, see Specifying credentials in the Amazon Web Services Cloud Control API User Guide.
     */
    RoleArn?: RoleArn;
    /**
     * A unique identifier to ensure the idempotency of the resource request. As a best practice, specify this token to ensure idempotency, so that Amazon Web Services Cloud Control API can accurately distinguish between request retries and new resource requests. You might retry a resource request to ensure that it was successfully received. A client token is valid for 36 hours once used. After that, a resource request with the same client token is treated as a new request. If you do not specify a client token, one is generated for inclusion in the request. For more information, see Ensuring resource operation requests are unique in the Amazon Web Services Cloud Control API User Guide.
     */
    ClientToken?: ClientToken;
    /**
     * Structured data format representing the desired state of the resource, consisting of that resource's properties and their desired values.   Cloud Control API currently supports JSON as a structured data format.  Specify the desired state as one of the following:   A JSON blob   A local path containing the desired state in JSON data format   For more information, see Composing the desired state of the resource in the Amazon Web Services Cloud Control API User Guide. For more information about the properties of a specific resource, refer to the related topic for the resource in the Resource and property types reference in the Amazon Web Services CloudFormation Users Guide.
     */
    DesiredState: Properties;
  }
  export interface CreateResourceOutput {
    /**
     * Represents the current status of the resource creation request. After you have initiated a resource creation request, you can monitor the progress of your request by calling GetResourceRequestStatus using the RequestToken of the ProgressEvent returned by CreateResource.
     */
    ProgressEvent?: ProgressEvent;
  }
  export interface DeleteResourceInput {
    /**
     * The name of the resource type.
     */
    TypeName: TypeName;
    /**
     * For private resource types, the type version to use in this resource operation. If you do not specify a resource version, CloudFormation uses the default version.
     */
    TypeVersionId?: TypeVersionId;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) for Cloud Control API to use when performing this resource operation. The role specified must have the permissions required for this operation. The necessary permissions for each event handler are defined in the  handlers  section of the resource type definition schema. If you do not specify a role, Cloud Control API uses a temporary session created using your Amazon Web Services user credentials. For more information, see Specifying credentials in the Amazon Web Services Cloud Control API User Guide.
     */
    RoleArn?: RoleArn;
    /**
     * A unique identifier to ensure the idempotency of the resource request. As a best practice, specify this token to ensure idempotency, so that Amazon Web Services Cloud Control API can accurately distinguish between request retries and new resource requests. You might retry a resource request to ensure that it was successfully received. A client token is valid for 36 hours once used. After that, a resource request with the same client token is treated as a new request. If you do not specify a client token, one is generated for inclusion in the request. For more information, see Ensuring resource operation requests are unique in the Amazon Web Services Cloud Control API User Guide.
     */
    ClientToken?: ClientToken;
    /**
     * The identifier for the resource. You can specify the primary identifier, or any secondary identifier defined for the resource type in its resource schema. You can only specify one identifier. Primary identifiers can be specified as a string or JSON; secondary identifiers must be specified as JSON. For compound primary identifiers (that is, one that consists of multiple resource properties strung together), to specify the primary identifier as a string, list the property values in the order they are specified in the primary identifier definition, separated by |.  For more information, see Identifying resources in the Amazon Web Services Cloud Control API User Guide.
     */
    Identifier: Identifier;
  }
  export interface DeleteResourceOutput {
    /**
     * Represents the current status of the resource deletion request. After you have initiated a resource deletion request, you can monitor the progress of your request by calling GetResourceRequestStatus using the RequestToken of the ProgressEvent returned by DeleteResource.
     */
    ProgressEvent?: ProgressEvent;
  }
  export interface GetResourceInput {
    /**
     * The name of the resource type.
     */
    TypeName: TypeName;
    /**
     * For private resource types, the type version to use in this resource operation. If you do not specify a resource version, CloudFormation uses the default version.
     */
    TypeVersionId?: TypeVersionId;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) for Cloud Control API to use when performing this resource operation. The role specified must have the permissions required for this operation. The necessary permissions for each event handler are defined in the  handlers  section of the resource type definition schema. If you do not specify a role, Cloud Control API uses a temporary session created using your Amazon Web Services user credentials. For more information, see Specifying credentials in the Amazon Web Services Cloud Control API User Guide.
     */
    RoleArn?: RoleArn;
    /**
     * The identifier for the resource. You can specify the primary identifier, or any secondary identifier defined for the resource type in its resource schema. You can only specify one identifier. Primary identifiers can be specified as a string or JSON; secondary identifiers must be specified as JSON. For compound primary identifiers (that is, one that consists of multiple resource properties strung together), to specify the primary identifier as a string, list the property values in the order they are specified in the primary identifier definition, separated by |.  For more information, see Identifying resources in the Amazon Web Services Cloud Control API User Guide.
     */
    Identifier: Identifier;
  }
  export interface GetResourceOutput {
    /**
     * The name of the resource type.
     */
    TypeName?: TypeName;
    ResourceDescription?: ResourceDescription;
  }
  export interface GetResourceRequestStatusInput {
    /**
     * A unique token used to track the progress of the resource operation request. Request tokens are included in the ProgressEvent type returned by a resource operation request.
     */
    RequestToken: RequestToken;
  }
  export interface GetResourceRequestStatusOutput {
    /**
     * Represents the current status of the resource operation request.
     */
    ProgressEvent?: ProgressEvent;
  }
  export type HandlerErrorCode = "NotUpdatable"|"InvalidRequest"|"AccessDenied"|"InvalidCredentials"|"AlreadyExists"|"NotFound"|"ResourceConflict"|"Throttling"|"ServiceLimitExceeded"|"NotStabilized"|"GeneralServiceException"|"ServiceInternalError"|"ServiceTimeout"|"NetworkFailure"|"InternalFailure"|string;
  export type HandlerNextToken = string;
  export type Identifier = string;
  export interface ListResourceRequestsInput {
    /**
     * The maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results. The default is 20.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous paginated request didn't return all of the remaining results, the response object's NextToken parameter value is set to a token. To retrieve the next set of results, call this action again and assign that token to the request object's NextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null.
     */
    NextToken?: NextToken;
    /**
     * The filter criteria to apply to the requests returned.
     */
    ResourceRequestStatusFilter?: ResourceRequestStatusFilter;
  }
  export interface ListResourceRequestsOutput {
    /**
     * The requests that match the specified filter criteria.
     */
    ResourceRequestStatusSummaries?: ResourceRequestStatusSummaries;
    /**
     * If the request doesn't return all of the remaining results, NextToken is set to a token. To retrieve the next set of results, call ListResources again and assign that token to the request object's NextToken parameter. If the request returns all results, NextToken is set to null.
     */
    NextToken?: NextToken;
  }
  export interface ListResourcesInput {
    /**
     * The name of the resource type.
     */
    TypeName: TypeName;
    /**
     * For private resource types, the type version to use in this resource operation. If you do not specify a resource version, CloudFormation uses the default version.
     */
    TypeVersionId?: TypeVersionId;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) for Cloud Control API to use when performing this resource operation. The role specified must have the permissions required for this operation. The necessary permissions for each event handler are defined in the  handlers  section of the resource type definition schema. If you do not specify a role, Cloud Control API uses a temporary session created using your Amazon Web Services user credentials. For more information, see Specifying credentials in the Amazon Web Services Cloud Control API User Guide.
     */
    RoleArn?: RoleArn;
    /**
     * If the previous paginated request didn't return all of the remaining results, the response object's NextToken parameter value is set to a token. To retrieve the next set of results, call this action again and assign that token to the request object's NextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null.
     */
    NextToken?: HandlerNextToken;
    /**
     * The maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results. The default is 20.
     */
    MaxResults?: MaxResults;
    /**
     * The resource model to use to select the resources to return.
     */
    ResourceModel?: Properties;
  }
  export interface ListResourcesOutput {
    /**
     * The name of the resource type.
     */
    TypeName?: TypeName;
    /**
     * Information about the specified resources, including primary identifier and resource model.
     */
    ResourceDescriptions?: ResourceDescriptions;
    /**
     * If the request doesn't return all of the remaining results, NextToken is set to a token. To retrieve the next set of results, call ListResources again and assign that token to the request object's NextToken parameter. If the request returns all results, NextToken is set to null.
     */
    NextToken?: HandlerNextToken;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export type Operation = "CREATE"|"DELETE"|"UPDATE"|string;
  export type OperationStatus = "PENDING"|"IN_PROGRESS"|"SUCCESS"|"FAILED"|"CANCEL_IN_PROGRESS"|"CANCEL_COMPLETE"|string;
  export type OperationStatuses = OperationStatus[];
  export type Operations = Operation[];
  export type PatchDocument = string;
  export interface ProgressEvent {
    /**
     * The name of the resource type used in the operation.
     */
    TypeName?: TypeName;
    /**
     * The primary identifier for the resource.  In some cases, the resource identifier may be available before the resource operation has reached a status of SUCCESS. 
     */
    Identifier?: Identifier;
    /**
     * The unique token representing this resource operation request. Use the RequestToken with GetResourceRequestStatus to return the current status of a resource operation request.
     */
    RequestToken?: RequestToken;
    /**
     * The resource operation type.
     */
    Operation?: Operation;
    /**
     * The current status of the resource operation request.    PENDING: The resource operation has not yet started.    IN_PROGRESS: The resource operation is currently in progress.    SUCCESS: The resource operation has successfully completed.    FAILED: The resource operation has failed. Refer to the error code and status message for more information.    CANCEL_IN_PROGRESS: The resource operation is in the process of being canceled.    CANCEL_COMPLETE: The resource operation has been canceled.  
     */
    OperationStatus?: OperationStatus;
    /**
     * When the resource operation request was initiated.
     */
    EventTime?: Timestamp;
    /**
     * A JSON string containing the resource model, consisting of each resource property and its current value.
     */
    ResourceModel?: Properties;
    /**
     * Any message explaining the current status.
     */
    StatusMessage?: StatusMessage;
    /**
     * For requests with a status of FAILED, the associated error code. For error code definitions, see Handler error codes in the CloudFormation Command Line Interface User Guide for Extension Development.
     */
    ErrorCode?: HandlerErrorCode;
    /**
     * When to next request the status of this resource operation request.
     */
    RetryAfter?: Timestamp;
  }
  export type Properties = string;
  export type RequestToken = string;
  export interface ResourceDescription {
    /**
     * The primary identifier for the resource. For more information, see Identifying resources in the Amazon Web Services Cloud Control API User Guide.
     */
    Identifier?: Identifier;
    /**
     * A list of the resource properties and their current values.
     */
    Properties?: Properties;
  }
  export type ResourceDescriptions = ResourceDescription[];
  export interface ResourceRequestStatusFilter {
    /**
     * The operation types to include in the filter.
     */
    Operations?: Operations;
    /**
     * The operation statuses to include in the filter.    PENDING: The operation has been requested, but not yet initiated.    IN_PROGRESS: The operation is currently in progress.    SUCCESS: The operation has successfully completed.    FAILED: The operation has failed.    CANCEL_IN_PROGRESS: The operation is currently in the process of being canceled.    CANCEL_COMPLETE: The operation has been canceled.  
     */
    OperationStatuses?: OperationStatuses;
  }
  export type ResourceRequestStatusSummaries = ProgressEvent[];
  export type RoleArn = string;
  export type StatusMessage = string;
  export type Timestamp = Date;
  export type TypeName = string;
  export type TypeVersionId = string;
  export interface UpdateResourceInput {
    /**
     * The name of the resource type.
     */
    TypeName: TypeName;
    /**
     * For private resource types, the type version to use in this resource operation. If you do not specify a resource version, CloudFormation uses the default version.
     */
    TypeVersionId?: TypeVersionId;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) for Cloud Control API to use when performing this resource operation. The role specified must have the permissions required for this operation. The necessary permissions for each event handler are defined in the  handlers  section of the resource type definition schema. If you do not specify a role, Cloud Control API uses a temporary session created using your Amazon Web Services user credentials. For more information, see Specifying credentials in the Amazon Web Services Cloud Control API User Guide.
     */
    RoleArn?: RoleArn;
    /**
     * A unique identifier to ensure the idempotency of the resource request. As a best practice, specify this token to ensure idempotency, so that Amazon Web Services Cloud Control API can accurately distinguish between request retries and new resource requests. You might retry a resource request to ensure that it was successfully received. A client token is valid for 36 hours once used. After that, a resource request with the same client token is treated as a new request. If you do not specify a client token, one is generated for inclusion in the request. For more information, see Ensuring resource operation requests are unique in the Amazon Web Services Cloud Control API User Guide.
     */
    ClientToken?: ClientToken;
    /**
     * The identifier for the resource. You can specify the primary identifier, or any secondary identifier defined for the resource type in its resource schema. You can only specify one identifier. Primary identifiers can be specified as a string or JSON; secondary identifiers must be specified as JSON. For compound primary identifiers (that is, one that consists of multiple resource properties strung together), to specify the primary identifier as a string, list the property values in the order they are specified in the primary identifier definition, separated by |.  For more information, see Identifying resources in the Amazon Web Services Cloud Control API User Guide.
     */
    Identifier: Identifier;
    /**
     * A JavaScript Object Notation (JSON) document listing the patch operations that represent the updates to apply to the current resource properties. For details, see Composing the patch document in the Amazon Web Services Cloud Control API User Guide.
     */
    PatchDocument: PatchDocument;
  }
  export interface UpdateResourceOutput {
    /**
     * Represents the current status of the resource update request. Use the RequestToken of the ProgressEvent with GetResourceRequestStatus to return the current status of a resource operation request.
     */
    ProgressEvent?: ProgressEvent;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-09-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CloudControl client.
   */
  export import Types = CloudControl;
}
export = CloudControl;
