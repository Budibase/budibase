import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Amp extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Amp.Types.ClientConfiguration)
  config: Config & Amp.Types.ClientConfiguration;
  /**
   * Create an alert manager definition.
   */
  createAlertManagerDefinition(params: Amp.Types.CreateAlertManagerDefinitionRequest, callback?: (err: AWSError, data: Amp.Types.CreateAlertManagerDefinitionResponse) => void): Request<Amp.Types.CreateAlertManagerDefinitionResponse, AWSError>;
  /**
   * Create an alert manager definition.
   */
  createAlertManagerDefinition(callback?: (err: AWSError, data: Amp.Types.CreateAlertManagerDefinitionResponse) => void): Request<Amp.Types.CreateAlertManagerDefinitionResponse, AWSError>;
  /**
   * Create a rule group namespace.
   */
  createRuleGroupsNamespace(params: Amp.Types.CreateRuleGroupsNamespaceRequest, callback?: (err: AWSError, data: Amp.Types.CreateRuleGroupsNamespaceResponse) => void): Request<Amp.Types.CreateRuleGroupsNamespaceResponse, AWSError>;
  /**
   * Create a rule group namespace.
   */
  createRuleGroupsNamespace(callback?: (err: AWSError, data: Amp.Types.CreateRuleGroupsNamespaceResponse) => void): Request<Amp.Types.CreateRuleGroupsNamespaceResponse, AWSError>;
  /**
   * Creates a new AMP workspace.
   */
  createWorkspace(params: Amp.Types.CreateWorkspaceRequest, callback?: (err: AWSError, data: Amp.Types.CreateWorkspaceResponse) => void): Request<Amp.Types.CreateWorkspaceResponse, AWSError>;
  /**
   * Creates a new AMP workspace.
   */
  createWorkspace(callback?: (err: AWSError, data: Amp.Types.CreateWorkspaceResponse) => void): Request<Amp.Types.CreateWorkspaceResponse, AWSError>;
  /**
   * Deletes an alert manager definition.
   */
  deleteAlertManagerDefinition(params: Amp.Types.DeleteAlertManagerDefinitionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an alert manager definition.
   */
  deleteAlertManagerDefinition(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a rule groups namespace.
   */
  deleteRuleGroupsNamespace(params: Amp.Types.DeleteRuleGroupsNamespaceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a rule groups namespace.
   */
  deleteRuleGroupsNamespace(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an AMP workspace.
   */
  deleteWorkspace(params: Amp.Types.DeleteWorkspaceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an AMP workspace.
   */
  deleteWorkspace(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Describes an alert manager definition.
   */
  describeAlertManagerDefinition(params: Amp.Types.DescribeAlertManagerDefinitionRequest, callback?: (err: AWSError, data: Amp.Types.DescribeAlertManagerDefinitionResponse) => void): Request<Amp.Types.DescribeAlertManagerDefinitionResponse, AWSError>;
  /**
   * Describes an alert manager definition.
   */
  describeAlertManagerDefinition(callback?: (err: AWSError, data: Amp.Types.DescribeAlertManagerDefinitionResponse) => void): Request<Amp.Types.DescribeAlertManagerDefinitionResponse, AWSError>;
  /**
   * Describe a rule groups namespace.
   */
  describeRuleGroupsNamespace(params: Amp.Types.DescribeRuleGroupsNamespaceRequest, callback?: (err: AWSError, data: Amp.Types.DescribeRuleGroupsNamespaceResponse) => void): Request<Amp.Types.DescribeRuleGroupsNamespaceResponse, AWSError>;
  /**
   * Describe a rule groups namespace.
   */
  describeRuleGroupsNamespace(callback?: (err: AWSError, data: Amp.Types.DescribeRuleGroupsNamespaceResponse) => void): Request<Amp.Types.DescribeRuleGroupsNamespaceResponse, AWSError>;
  /**
   * Describes an existing AMP workspace.
   */
  describeWorkspace(params: Amp.Types.DescribeWorkspaceRequest, callback?: (err: AWSError, data: Amp.Types.DescribeWorkspaceResponse) => void): Request<Amp.Types.DescribeWorkspaceResponse, AWSError>;
  /**
   * Describes an existing AMP workspace.
   */
  describeWorkspace(callback?: (err: AWSError, data: Amp.Types.DescribeWorkspaceResponse) => void): Request<Amp.Types.DescribeWorkspaceResponse, AWSError>;
  /**
   * Lists rule groups namespaces.
   */
  listRuleGroupsNamespaces(params: Amp.Types.ListRuleGroupsNamespacesRequest, callback?: (err: AWSError, data: Amp.Types.ListRuleGroupsNamespacesResponse) => void): Request<Amp.Types.ListRuleGroupsNamespacesResponse, AWSError>;
  /**
   * Lists rule groups namespaces.
   */
  listRuleGroupsNamespaces(callback?: (err: AWSError, data: Amp.Types.ListRuleGroupsNamespacesResponse) => void): Request<Amp.Types.ListRuleGroupsNamespacesResponse, AWSError>;
  /**
   * Lists the tags you have assigned to the resource.
   */
  listTagsForResource(params: Amp.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Amp.Types.ListTagsForResourceResponse) => void): Request<Amp.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags you have assigned to the resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Amp.Types.ListTagsForResourceResponse) => void): Request<Amp.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all AMP workspaces, including workspaces being created or deleted.
   */
  listWorkspaces(params: Amp.Types.ListWorkspacesRequest, callback?: (err: AWSError, data: Amp.Types.ListWorkspacesResponse) => void): Request<Amp.Types.ListWorkspacesResponse, AWSError>;
  /**
   * Lists all AMP workspaces, including workspaces being created or deleted.
   */
  listWorkspaces(callback?: (err: AWSError, data: Amp.Types.ListWorkspacesResponse) => void): Request<Amp.Types.ListWorkspacesResponse, AWSError>;
  /**
   * Update an alert manager definition.
   */
  putAlertManagerDefinition(params: Amp.Types.PutAlertManagerDefinitionRequest, callback?: (err: AWSError, data: Amp.Types.PutAlertManagerDefinitionResponse) => void): Request<Amp.Types.PutAlertManagerDefinitionResponse, AWSError>;
  /**
   * Update an alert manager definition.
   */
  putAlertManagerDefinition(callback?: (err: AWSError, data: Amp.Types.PutAlertManagerDefinitionResponse) => void): Request<Amp.Types.PutAlertManagerDefinitionResponse, AWSError>;
  /**
   * Update a rule groups namespace.
   */
  putRuleGroupsNamespace(params: Amp.Types.PutRuleGroupsNamespaceRequest, callback?: (err: AWSError, data: Amp.Types.PutRuleGroupsNamespaceResponse) => void): Request<Amp.Types.PutRuleGroupsNamespaceResponse, AWSError>;
  /**
   * Update a rule groups namespace.
   */
  putRuleGroupsNamespace(callback?: (err: AWSError, data: Amp.Types.PutRuleGroupsNamespaceResponse) => void): Request<Amp.Types.PutRuleGroupsNamespaceResponse, AWSError>;
  /**
   * Creates tags for the specified resource.
   */
  tagResource(params: Amp.Types.TagResourceRequest, callback?: (err: AWSError, data: Amp.Types.TagResourceResponse) => void): Request<Amp.Types.TagResourceResponse, AWSError>;
  /**
   * Creates tags for the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: Amp.Types.TagResourceResponse) => void): Request<Amp.Types.TagResourceResponse, AWSError>;
  /**
   * Deletes tags from the specified resource.
   */
  untagResource(params: Amp.Types.UntagResourceRequest, callback?: (err: AWSError, data: Amp.Types.UntagResourceResponse) => void): Request<Amp.Types.UntagResourceResponse, AWSError>;
  /**
   * Deletes tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: Amp.Types.UntagResourceResponse) => void): Request<Amp.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an AMP workspace alias.
   */
  updateWorkspaceAlias(params: Amp.Types.UpdateWorkspaceAliasRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an AMP workspace alias.
   */
  updateWorkspaceAlias(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Waits for the workspaceActive state by periodically calling the underlying Amp.describeWorkspaceoperation every 2 seconds (at most 60 times). Wait until a workspace reaches ACTIVE status
   */
  waitFor(state: "workspaceActive", params: Amp.Types.DescribeWorkspaceRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Amp.Types.DescribeWorkspaceResponse) => void): Request<Amp.Types.DescribeWorkspaceResponse, AWSError>;
  /**
   * Waits for the workspaceActive state by periodically calling the underlying Amp.describeWorkspaceoperation every 2 seconds (at most 60 times). Wait until a workspace reaches ACTIVE status
   */
  waitFor(state: "workspaceActive", callback?: (err: AWSError, data: Amp.Types.DescribeWorkspaceResponse) => void): Request<Amp.Types.DescribeWorkspaceResponse, AWSError>;
  /**
   * Waits for the workspaceDeleted state by periodically calling the underlying Amp.describeWorkspaceoperation every 2 seconds (at most 60 times). Wait until a workspace reaches DELETED status
   */
  waitFor(state: "workspaceDeleted", params: Amp.Types.DescribeWorkspaceRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Amp.Types.DescribeWorkspaceResponse) => void): Request<Amp.Types.DescribeWorkspaceResponse, AWSError>;
  /**
   * Waits for the workspaceDeleted state by periodically calling the underlying Amp.describeWorkspaceoperation every 2 seconds (at most 60 times). Wait until a workspace reaches DELETED status
   */
  waitFor(state: "workspaceDeleted", callback?: (err: AWSError, data: Amp.Types.DescribeWorkspaceResponse) => void): Request<Amp.Types.DescribeWorkspaceResponse, AWSError>;
}
declare namespace Amp {
  export type AlertManagerDefinitionData = Buffer|Uint8Array|Blob|string;
  export interface AlertManagerDefinitionDescription {
    /**
     * The time when the alert manager definition was created.
     */
    createdAt: Timestamp;
    /**
     * The alert manager definition.
     */
    data: AlertManagerDefinitionData;
    /**
     * The time when the alert manager definition was modified.
     */
    modifiedAt: Timestamp;
    /**
     * The status of alert manager definition.
     */
    status: AlertManagerDefinitionStatus;
  }
  export interface AlertManagerDefinitionStatus {
    /**
     * Status code of this definition.
     */
    statusCode: AlertManagerDefinitionStatusCode;
    /**
     * The reason for failure if any.
     */
    statusReason?: String;
  }
  export type AlertManagerDefinitionStatusCode = "CREATING"|"ACTIVE"|"UPDATING"|"DELETING"|"CREATION_FAILED"|"UPDATE_FAILED"|string;
  export interface CreateAlertManagerDefinitionRequest {
    /**
     * Optional, unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     */
    clientToken?: IdempotencyToken;
    /**
     * The alert manager definition data.
     */
    data: AlertManagerDefinitionData;
    /**
     * The ID of the workspace in which to create the alert manager definition.
     */
    workspaceId: WorkspaceId;
  }
  export interface CreateAlertManagerDefinitionResponse {
    /**
     * The status of alert manager definition.
     */
    status: AlertManagerDefinitionStatus;
  }
  export interface CreateRuleGroupsNamespaceRequest {
    /**
     * Optional, unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     */
    clientToken?: IdempotencyToken;
    /**
     * The namespace data that define the rule groups.
     */
    data: RuleGroupsNamespaceData;
    /**
     * The rule groups namespace name.
     */
    name: RuleGroupsNamespaceName;
    /**
     * Optional, user-provided tags for this rule groups namespace.
     */
    tags?: TagMap;
    /**
     * The ID of the workspace in which to create the rule group namespace.
     */
    workspaceId: WorkspaceId;
  }
  export interface CreateRuleGroupsNamespaceResponse {
    /**
     * The Amazon Resource Name (ARN) of this rule groups namespace.
     */
    arn: RuleGroupsNamespaceArn;
    /**
     * The rule groups namespace name.
     */
    name: RuleGroupsNamespaceName;
    /**
     * The status of rule groups namespace.
     */
    status: RuleGroupsNamespaceStatus;
    /**
     * The tags of this rule groups namespace.
     */
    tags?: TagMap;
  }
  export interface CreateWorkspaceRequest {
    /**
     * An optional user-assigned alias for this workspace. This alias is for user reference and does not need to be unique.
     */
    alias?: WorkspaceAlias;
    /**
     * Optional, unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     */
    clientToken?: IdempotencyToken;
    /**
     * Optional, user-provided tags for this workspace.
     */
    tags?: TagMap;
  }
  export interface CreateWorkspaceResponse {
    /**
     * The ARN of the workspace that was just created.
     */
    arn: WorkspaceArn;
    /**
     * The status of the workspace that was just created (usually CREATING).
     */
    status: WorkspaceStatus;
    /**
     * The tags of this workspace.
     */
    tags?: TagMap;
    /**
     * The generated ID of the workspace that was just created.
     */
    workspaceId: WorkspaceId;
  }
  export interface DeleteAlertManagerDefinitionRequest {
    /**
     * Optional, unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     */
    clientToken?: IdempotencyToken;
    /**
     * The ID of the workspace in which to delete the alert manager definition.
     */
    workspaceId: WorkspaceId;
  }
  export interface DeleteRuleGroupsNamespaceRequest {
    /**
     * Optional, unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     */
    clientToken?: IdempotencyToken;
    /**
     * The rule groups namespace name.
     */
    name: RuleGroupsNamespaceName;
    /**
     * The ID of the workspace to delete rule group definition.
     */
    workspaceId: WorkspaceId;
  }
  export interface DeleteWorkspaceRequest {
    /**
     * Optional, unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     */
    clientToken?: IdempotencyToken;
    /**
     * The ID of the workspace to delete.
     */
    workspaceId: WorkspaceId;
  }
  export interface DescribeAlertManagerDefinitionRequest {
    /**
     * The ID of the workspace to describe.
     */
    workspaceId: WorkspaceId;
  }
  export interface DescribeAlertManagerDefinitionResponse {
    /**
     * The properties of the selected workspace's alert manager definition.
     */
    alertManagerDefinition: AlertManagerDefinitionDescription;
  }
  export interface DescribeRuleGroupsNamespaceRequest {
    /**
     * The rule groups namespace.
     */
    name: RuleGroupsNamespaceName;
    /**
     * The ID of the workspace to describe.
     */
    workspaceId: WorkspaceId;
  }
  export interface DescribeRuleGroupsNamespaceResponse {
    /**
     * The selected rule groups namespace.
     */
    ruleGroupsNamespace: RuleGroupsNamespaceDescription;
  }
  export interface DescribeWorkspaceRequest {
    /**
     * The ID of the workspace to describe.
     */
    workspaceId: WorkspaceId;
  }
  export interface DescribeWorkspaceResponse {
    /**
     * The properties of the selected workspace.
     */
    workspace: WorkspaceDescription;
  }
  export type IdempotencyToken = string;
  export interface ListRuleGroupsNamespacesRequest {
    /**
     * Maximum results to return in response (default=100, maximum=1000).
     */
    maxResults?: ListRuleGroupsNamespacesRequestMaxResultsInteger;
    /**
     * Optional filter for rule groups namespace name. Only the rule groups namespace that begin with this value will be returned.
     */
    name?: RuleGroupsNamespaceName;
    /**
     * Pagination token to request the next page in a paginated list. This token is obtained from the output of the previous ListRuleGroupsNamespaces request.
     */
    nextToken?: PaginationToken;
    /**
     * The ID of the workspace.
     */
    workspaceId: WorkspaceId;
  }
  export type ListRuleGroupsNamespacesRequestMaxResultsInteger = number;
  export interface ListRuleGroupsNamespacesResponse {
    /**
     * Pagination token to use when requesting the next page in this list.
     */
    nextToken?: PaginationToken;
    /**
     * The list of the selected rule groups namespaces.
     */
    ruleGroupsNamespaces: RuleGroupsNamespaceSummaryList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: String;
  }
  export interface ListTagsForResourceResponse {
    tags?: TagMap;
  }
  export interface ListWorkspacesRequest {
    /**
     * Optional filter for workspace alias. Only the workspaces with aliases that begin with this value will be returned.
     */
    alias?: WorkspaceAlias;
    /**
     * Maximum results to return in response (default=100, maximum=1000).
     */
    maxResults?: ListWorkspacesRequestMaxResultsInteger;
    /**
     * Pagination token to request the next page in a paginated list. This token is obtained from the output of the previous ListWorkspaces request.
     */
    nextToken?: PaginationToken;
  }
  export type ListWorkspacesRequestMaxResultsInteger = number;
  export interface ListWorkspacesResponse {
    /**
     * Pagination token to use when requesting the next page in this list.
     */
    nextToken?: PaginationToken;
    /**
     * The list of existing workspaces, including those undergoing creation or deletion.
     */
    workspaces: WorkspaceSummaryList;
  }
  export type PaginationToken = string;
  export interface PutAlertManagerDefinitionRequest {
    /**
     * Optional, unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     */
    clientToken?: IdempotencyToken;
    /**
     * The alert manager definition data.
     */
    data: AlertManagerDefinitionData;
    /**
     * The ID of the workspace in which to update the alert manager definition.
     */
    workspaceId: WorkspaceId;
  }
  export interface PutAlertManagerDefinitionResponse {
    /**
     * The status of alert manager definition.
     */
    status: AlertManagerDefinitionStatus;
  }
  export interface PutRuleGroupsNamespaceRequest {
    /**
     * Optional, unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     */
    clientToken?: IdempotencyToken;
    /**
     * The namespace data that define the rule groups.
     */
    data: RuleGroupsNamespaceData;
    /**
     * The rule groups namespace name.
     */
    name: RuleGroupsNamespaceName;
    /**
     * The ID of the workspace in which to update the rule group namespace.
     */
    workspaceId: WorkspaceId;
  }
  export interface PutRuleGroupsNamespaceResponse {
    /**
     * The Amazon Resource Name (ARN) of this rule groups namespace.
     */
    arn: RuleGroupsNamespaceArn;
    /**
     * The rule groups namespace name.
     */
    name: RuleGroupsNamespaceName;
    /**
     * The status of rule groups namespace.
     */
    status: RuleGroupsNamespaceStatus;
    /**
     * The tags of this rule groups namespace.
     */
    tags?: TagMap;
  }
  export type RuleGroupsNamespaceArn = string;
  export type RuleGroupsNamespaceData = Buffer|Uint8Array|Blob|string;
  export interface RuleGroupsNamespaceDescription {
    /**
     * The Amazon Resource Name (ARN) of this rule groups namespace.
     */
    arn: RuleGroupsNamespaceArn;
    /**
     * The time when the rule groups namespace was created.
     */
    createdAt: Timestamp;
    /**
     * The rule groups namespace data.
     */
    data: RuleGroupsNamespaceData;
    /**
     * The time when the rule groups namespace was modified.
     */
    modifiedAt: Timestamp;
    /**
     * The rule groups namespace name.
     */
    name: RuleGroupsNamespaceName;
    /**
     * The status of rule groups namespace.
     */
    status: RuleGroupsNamespaceStatus;
    /**
     * The tags of this rule groups namespace.
     */
    tags?: TagMap;
  }
  export type RuleGroupsNamespaceName = string;
  export interface RuleGroupsNamespaceStatus {
    /**
     * Status code of this namespace.
     */
    statusCode: RuleGroupsNamespaceStatusCode;
    /**
     * The reason for failure if any.
     */
    statusReason?: String;
  }
  export type RuleGroupsNamespaceStatusCode = "CREATING"|"ACTIVE"|"UPDATING"|"DELETING"|"CREATION_FAILED"|"UPDATE_FAILED"|string;
  export interface RuleGroupsNamespaceSummary {
    /**
     * The Amazon Resource Name (ARN) of this rule groups namespace.
     */
    arn: RuleGroupsNamespaceArn;
    /**
     * The time when the rule groups namespace was created.
     */
    createdAt: Timestamp;
    /**
     * The time when the rule groups namespace was modified.
     */
    modifiedAt: Timestamp;
    /**
     * The rule groups namespace name.
     */
    name: RuleGroupsNamespaceName;
    /**
     * The status of rule groups namespace.
     */
    status: RuleGroupsNamespaceStatus;
    /**
     * The tags of this rule groups namespace.
     */
    tags?: TagMap;
  }
  export type RuleGroupsNamespaceSummaryList = RuleGroupsNamespaceSummary[];
  export type String = string;
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: String;
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: String;
    /**
     * One or more tag keys
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateWorkspaceAliasRequest {
    /**
     * The new alias of the workspace.
     */
    alias?: WorkspaceAlias;
    /**
     * Optional, unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     */
    clientToken?: IdempotencyToken;
    /**
     * The ID of the workspace being updated.
     */
    workspaceId: WorkspaceId;
  }
  export type Uri = string;
  export type WorkspaceAlias = string;
  export type WorkspaceArn = string;
  export interface WorkspaceDescription {
    /**
     * Alias of this workspace.
     */
    alias?: WorkspaceAlias;
    /**
     * The Amazon Resource Name (ARN) of this workspace.
     */
    arn: WorkspaceArn;
    /**
     * The time when the workspace was created.
     */
    createdAt: Timestamp;
    /**
     * Prometheus endpoint URI.
     */
    prometheusEndpoint?: Uri;
    /**
     * The status of this workspace.
     */
    status: WorkspaceStatus;
    /**
     * The tags of this workspace.
     */
    tags?: TagMap;
    /**
     * Unique string identifying this workspace.
     */
    workspaceId: WorkspaceId;
  }
  export type WorkspaceId = string;
  export interface WorkspaceStatus {
    /**
     * Status code of this workspace.
     */
    statusCode: WorkspaceStatusCode;
  }
  export type WorkspaceStatusCode = "CREATING"|"ACTIVE"|"UPDATING"|"DELETING"|"CREATION_FAILED"|string;
  export interface WorkspaceSummary {
    /**
     * Alias of this workspace.
     */
    alias?: WorkspaceAlias;
    /**
     * The AmazonResourceName of this workspace.
     */
    arn: WorkspaceArn;
    /**
     * The time when the workspace was created.
     */
    createdAt: Timestamp;
    /**
     * The status of this workspace.
     */
    status: WorkspaceStatus;
    /**
     * The tags of this workspace.
     */
    tags?: TagMap;
    /**
     * Unique string identifying this workspace.
     */
    workspaceId: WorkspaceId;
  }
  export type WorkspaceSummaryList = WorkspaceSummary[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-08-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Amp client.
   */
  export import Types = Amp;
}
export = Amp;
