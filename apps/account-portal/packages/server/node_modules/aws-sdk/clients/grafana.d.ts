import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Grafana extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Grafana.Types.ClientConfiguration)
  config: Config & Grafana.Types.ClientConfiguration;
  /**
   * Assigns a Grafana Enterprise license to a workspace. Upgrading to Grafana Enterprise incurs additional fees. For more information, see Upgrade a workspace to Grafana Enterprise.
   */
  associateLicense(params: Grafana.Types.AssociateLicenseRequest, callback?: (err: AWSError, data: Grafana.Types.AssociateLicenseResponse) => void): Request<Grafana.Types.AssociateLicenseResponse, AWSError>;
  /**
   * Assigns a Grafana Enterprise license to a workspace. Upgrading to Grafana Enterprise incurs additional fees. For more information, see Upgrade a workspace to Grafana Enterprise.
   */
  associateLicense(callback?: (err: AWSError, data: Grafana.Types.AssociateLicenseResponse) => void): Request<Grafana.Types.AssociateLicenseResponse, AWSError>;
  /**
   * Creates a workspace. In a workspace, you can create Grafana dashboards and visualizations to analyze your metrics, logs, and traces. You don't have to build, package, or deploy any hardware to run the Grafana server. Don't use CreateWorkspace to modify an existing workspace. Instead, use UpdateWorkspace.
   */
  createWorkspace(params: Grafana.Types.CreateWorkspaceRequest, callback?: (err: AWSError, data: Grafana.Types.CreateWorkspaceResponse) => void): Request<Grafana.Types.CreateWorkspaceResponse, AWSError>;
  /**
   * Creates a workspace. In a workspace, you can create Grafana dashboards and visualizations to analyze your metrics, logs, and traces. You don't have to build, package, or deploy any hardware to run the Grafana server. Don't use CreateWorkspace to modify an existing workspace. Instead, use UpdateWorkspace.
   */
  createWorkspace(callback?: (err: AWSError, data: Grafana.Types.CreateWorkspaceResponse) => void): Request<Grafana.Types.CreateWorkspaceResponse, AWSError>;
  /**
   * Creates a Grafana API key for the workspace. This key can be used to authenticate requests sent to the workspace's HTTP API. See https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html for available APIs and example requests.
   */
  createWorkspaceApiKey(params: Grafana.Types.CreateWorkspaceApiKeyRequest, callback?: (err: AWSError, data: Grafana.Types.CreateWorkspaceApiKeyResponse) => void): Request<Grafana.Types.CreateWorkspaceApiKeyResponse, AWSError>;
  /**
   * Creates a Grafana API key for the workspace. This key can be used to authenticate requests sent to the workspace's HTTP API. See https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html for available APIs and example requests.
   */
  createWorkspaceApiKey(callback?: (err: AWSError, data: Grafana.Types.CreateWorkspaceApiKeyResponse) => void): Request<Grafana.Types.CreateWorkspaceApiKeyResponse, AWSError>;
  /**
   * Deletes an Amazon Managed Grafana workspace.
   */
  deleteWorkspace(params: Grafana.Types.DeleteWorkspaceRequest, callback?: (err: AWSError, data: Grafana.Types.DeleteWorkspaceResponse) => void): Request<Grafana.Types.DeleteWorkspaceResponse, AWSError>;
  /**
   * Deletes an Amazon Managed Grafana workspace.
   */
  deleteWorkspace(callback?: (err: AWSError, data: Grafana.Types.DeleteWorkspaceResponse) => void): Request<Grafana.Types.DeleteWorkspaceResponse, AWSError>;
  /**
   * Deletes a Grafana API key for the workspace.
   */
  deleteWorkspaceApiKey(params: Grafana.Types.DeleteWorkspaceApiKeyRequest, callback?: (err: AWSError, data: Grafana.Types.DeleteWorkspaceApiKeyResponse) => void): Request<Grafana.Types.DeleteWorkspaceApiKeyResponse, AWSError>;
  /**
   * Deletes a Grafana API key for the workspace.
   */
  deleteWorkspaceApiKey(callback?: (err: AWSError, data: Grafana.Types.DeleteWorkspaceApiKeyResponse) => void): Request<Grafana.Types.DeleteWorkspaceApiKeyResponse, AWSError>;
  /**
   * Displays information about one Amazon Managed Grafana workspace.
   */
  describeWorkspace(params: Grafana.Types.DescribeWorkspaceRequest, callback?: (err: AWSError, data: Grafana.Types.DescribeWorkspaceResponse) => void): Request<Grafana.Types.DescribeWorkspaceResponse, AWSError>;
  /**
   * Displays information about one Amazon Managed Grafana workspace.
   */
  describeWorkspace(callback?: (err: AWSError, data: Grafana.Types.DescribeWorkspaceResponse) => void): Request<Grafana.Types.DescribeWorkspaceResponse, AWSError>;
  /**
   * Displays information about the authentication methods used in one Amazon Managed Grafana workspace.
   */
  describeWorkspaceAuthentication(params: Grafana.Types.DescribeWorkspaceAuthenticationRequest, callback?: (err: AWSError, data: Grafana.Types.DescribeWorkspaceAuthenticationResponse) => void): Request<Grafana.Types.DescribeWorkspaceAuthenticationResponse, AWSError>;
  /**
   * Displays information about the authentication methods used in one Amazon Managed Grafana workspace.
   */
  describeWorkspaceAuthentication(callback?: (err: AWSError, data: Grafana.Types.DescribeWorkspaceAuthenticationResponse) => void): Request<Grafana.Types.DescribeWorkspaceAuthenticationResponse, AWSError>;
  /**
   * Gets the current configuration string for the given workspace.
   */
  describeWorkspaceConfiguration(params: Grafana.Types.DescribeWorkspaceConfigurationRequest, callback?: (err: AWSError, data: Grafana.Types.DescribeWorkspaceConfigurationResponse) => void): Request<Grafana.Types.DescribeWorkspaceConfigurationResponse, AWSError>;
  /**
   * Gets the current configuration string for the given workspace.
   */
  describeWorkspaceConfiguration(callback?: (err: AWSError, data: Grafana.Types.DescribeWorkspaceConfigurationResponse) => void): Request<Grafana.Types.DescribeWorkspaceConfigurationResponse, AWSError>;
  /**
   * Removes the Grafana Enterprise license from a workspace.
   */
  disassociateLicense(params: Grafana.Types.DisassociateLicenseRequest, callback?: (err: AWSError, data: Grafana.Types.DisassociateLicenseResponse) => void): Request<Grafana.Types.DisassociateLicenseResponse, AWSError>;
  /**
   * Removes the Grafana Enterprise license from a workspace.
   */
  disassociateLicense(callback?: (err: AWSError, data: Grafana.Types.DisassociateLicenseResponse) => void): Request<Grafana.Types.DisassociateLicenseResponse, AWSError>;
  /**
   * Lists the users and groups who have the Grafana Admin and Editor roles in this workspace. If you use this operation without specifying userId or groupId, the operation returns the roles of all users and groups. If you specify a userId or a groupId, only the roles for that user or group are returned. If you do this, you can specify only one userId or one groupId.
   */
  listPermissions(params: Grafana.Types.ListPermissionsRequest, callback?: (err: AWSError, data: Grafana.Types.ListPermissionsResponse) => void): Request<Grafana.Types.ListPermissionsResponse, AWSError>;
  /**
   * Lists the users and groups who have the Grafana Admin and Editor roles in this workspace. If you use this operation without specifying userId or groupId, the operation returns the roles of all users and groups. If you specify a userId or a groupId, only the roles for that user or group are returned. If you do this, you can specify only one userId or one groupId.
   */
  listPermissions(callback?: (err: AWSError, data: Grafana.Types.ListPermissionsResponse) => void): Request<Grafana.Types.ListPermissionsResponse, AWSError>;
  /**
   * The ListTagsForResource operation returns the tags that are associated with the Amazon Managed Service for Grafana resource specified by the resourceArn. Currently, the only resource that can be tagged is a workspace. 
   */
  listTagsForResource(params: Grafana.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Grafana.Types.ListTagsForResourceResponse) => void): Request<Grafana.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * The ListTagsForResource operation returns the tags that are associated with the Amazon Managed Service for Grafana resource specified by the resourceArn. Currently, the only resource that can be tagged is a workspace. 
   */
  listTagsForResource(callback?: (err: AWSError, data: Grafana.Types.ListTagsForResourceResponse) => void): Request<Grafana.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists available versions of Grafana. These are available when calling CreateWorkspace. Optionally, include a workspace to list the versions to which it can be upgraded.
   */
  listVersions(params: Grafana.Types.ListVersionsRequest, callback?: (err: AWSError, data: Grafana.Types.ListVersionsResponse) => void): Request<Grafana.Types.ListVersionsResponse, AWSError>;
  /**
   * Lists available versions of Grafana. These are available when calling CreateWorkspace. Optionally, include a workspace to list the versions to which it can be upgraded.
   */
  listVersions(callback?: (err: AWSError, data: Grafana.Types.ListVersionsResponse) => void): Request<Grafana.Types.ListVersionsResponse, AWSError>;
  /**
   * Returns a list of Amazon Managed Grafana workspaces in the account, with some information about each workspace. For more complete information about one workspace, use DescribeWorkspace.
   */
  listWorkspaces(params: Grafana.Types.ListWorkspacesRequest, callback?: (err: AWSError, data: Grafana.Types.ListWorkspacesResponse) => void): Request<Grafana.Types.ListWorkspacesResponse, AWSError>;
  /**
   * Returns a list of Amazon Managed Grafana workspaces in the account, with some information about each workspace. For more complete information about one workspace, use DescribeWorkspace.
   */
  listWorkspaces(callback?: (err: AWSError, data: Grafana.Types.ListWorkspacesResponse) => void): Request<Grafana.Types.ListWorkspacesResponse, AWSError>;
  /**
   * The TagResource operation associates tags with an Amazon Managed Grafana resource. Currently, the only resource that can be tagged is workspaces.  If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
   */
  tagResource(params: Grafana.Types.TagResourceRequest, callback?: (err: AWSError, data: Grafana.Types.TagResourceResponse) => void): Request<Grafana.Types.TagResourceResponse, AWSError>;
  /**
   * The TagResource operation associates tags with an Amazon Managed Grafana resource. Currently, the only resource that can be tagged is workspaces.  If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
   */
  tagResource(callback?: (err: AWSError, data: Grafana.Types.TagResourceResponse) => void): Request<Grafana.Types.TagResourceResponse, AWSError>;
  /**
   * The UntagResource operation removes the association of the tag with the Amazon Managed Grafana resource. 
   */
  untagResource(params: Grafana.Types.UntagResourceRequest, callback?: (err: AWSError, data: Grafana.Types.UntagResourceResponse) => void): Request<Grafana.Types.UntagResourceResponse, AWSError>;
  /**
   * The UntagResource operation removes the association of the tag with the Amazon Managed Grafana resource. 
   */
  untagResource(callback?: (err: AWSError, data: Grafana.Types.UntagResourceResponse) => void): Request<Grafana.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates which users in a workspace have the Grafana Admin or Editor roles.
   */
  updatePermissions(params: Grafana.Types.UpdatePermissionsRequest, callback?: (err: AWSError, data: Grafana.Types.UpdatePermissionsResponse) => void): Request<Grafana.Types.UpdatePermissionsResponse, AWSError>;
  /**
   * Updates which users in a workspace have the Grafana Admin or Editor roles.
   */
  updatePermissions(callback?: (err: AWSError, data: Grafana.Types.UpdatePermissionsResponse) => void): Request<Grafana.Types.UpdatePermissionsResponse, AWSError>;
  /**
   * Modifies an existing Amazon Managed Grafana workspace. If you use this operation and omit any optional parameters, the existing values of those parameters are not changed. To modify the user authentication methods that the workspace uses, such as SAML or IAM Identity Center, use UpdateWorkspaceAuthentication. To modify which users in the workspace have the Admin and Editor Grafana roles, use UpdatePermissions.
   */
  updateWorkspace(params: Grafana.Types.UpdateWorkspaceRequest, callback?: (err: AWSError, data: Grafana.Types.UpdateWorkspaceResponse) => void): Request<Grafana.Types.UpdateWorkspaceResponse, AWSError>;
  /**
   * Modifies an existing Amazon Managed Grafana workspace. If you use this operation and omit any optional parameters, the existing values of those parameters are not changed. To modify the user authentication methods that the workspace uses, such as SAML or IAM Identity Center, use UpdateWorkspaceAuthentication. To modify which users in the workspace have the Admin and Editor Grafana roles, use UpdatePermissions.
   */
  updateWorkspace(callback?: (err: AWSError, data: Grafana.Types.UpdateWorkspaceResponse) => void): Request<Grafana.Types.UpdateWorkspaceResponse, AWSError>;
  /**
   * Use this operation to define the identity provider (IdP) that this workspace authenticates users from, using SAML. You can also map SAML assertion attributes to workspace user information and define which groups in the assertion attribute are to have the Admin and Editor roles in the workspace.  Changes to the authentication method for a workspace may take a few minutes to take effect. 
   */
  updateWorkspaceAuthentication(params: Grafana.Types.UpdateWorkspaceAuthenticationRequest, callback?: (err: AWSError, data: Grafana.Types.UpdateWorkspaceAuthenticationResponse) => void): Request<Grafana.Types.UpdateWorkspaceAuthenticationResponse, AWSError>;
  /**
   * Use this operation to define the identity provider (IdP) that this workspace authenticates users from, using SAML. You can also map SAML assertion attributes to workspace user information and define which groups in the assertion attribute are to have the Admin and Editor roles in the workspace.  Changes to the authentication method for a workspace may take a few minutes to take effect. 
   */
  updateWorkspaceAuthentication(callback?: (err: AWSError, data: Grafana.Types.UpdateWorkspaceAuthenticationResponse) => void): Request<Grafana.Types.UpdateWorkspaceAuthenticationResponse, AWSError>;
  /**
   * Updates the configuration string for the given workspace
   */
  updateWorkspaceConfiguration(params: Grafana.Types.UpdateWorkspaceConfigurationRequest, callback?: (err: AWSError, data: Grafana.Types.UpdateWorkspaceConfigurationResponse) => void): Request<Grafana.Types.UpdateWorkspaceConfigurationResponse, AWSError>;
  /**
   * Updates the configuration string for the given workspace
   */
  updateWorkspaceConfiguration(callback?: (err: AWSError, data: Grafana.Types.UpdateWorkspaceConfigurationResponse) => void): Request<Grafana.Types.UpdateWorkspaceConfigurationResponse, AWSError>;
}
declare namespace Grafana {
  export type AccountAccessType = "CURRENT_ACCOUNT"|"ORGANIZATION"|string;
  export type AllowedOrganization = string;
  export type AllowedOrganizations = AllowedOrganization[];
  export type ApiKeyName = string;
  export type ApiKeyToken = string;
  export type AssertionAttribute = string;
  export interface AssertionAttributes {
    /**
     * The name of the attribute within the SAML assertion to use as the email names for SAML users.
     */
    email?: AssertionAttribute;
    /**
     * The name of the attribute within the SAML assertion to use as the user full "friendly" names for user groups.
     */
    groups?: AssertionAttribute;
    /**
     * The name of the attribute within the SAML assertion to use as the login names for SAML users.
     */
    login?: AssertionAttribute;
    /**
     * The name of the attribute within the SAML assertion to use as the user full "friendly" names for SAML users.
     */
    name?: AssertionAttribute;
    /**
     * The name of the attribute within the SAML assertion to use as the user full "friendly" names for the users' organizations.
     */
    org?: AssertionAttribute;
    /**
     * The name of the attribute within the SAML assertion to use as the user roles.
     */
    role?: AssertionAttribute;
  }
  export interface AssociateLicenseRequest {
    /**
     * The type of license to associate with the workspace.
     */
    licenseType: LicenseType;
    /**
     * The ID of the workspace to associate the license with.
     */
    workspaceId: WorkspaceId;
  }
  export interface AssociateLicenseResponse {
    /**
     * A structure containing data about the workspace.
     */
    workspace: WorkspaceDescription;
  }
  export interface AuthenticationDescription {
    /**
     * A structure containing information about how this workspace works with IAM Identity Center. 
     */
    awsSso?: AwsSsoAuthentication;
    /**
     * Specifies whether this workspace uses IAM Identity Center, SAML, or both methods to authenticate users to use the Grafana console in the Amazon Managed Grafana workspace.
     */
    providers: AuthenticationProviders;
    /**
     * A structure containing information about how this workspace works with SAML, including what attributes within the assertion are to be mapped to user information in the workspace. 
     */
    saml?: SamlAuthentication;
  }
  export type AuthenticationProviderTypes = "AWS_SSO"|"SAML"|string;
  export type AuthenticationProviders = AuthenticationProviderTypes[];
  export interface AuthenticationSummary {
    /**
     * Specifies whether the workspace uses SAML, IAM Identity Center, or both methods for user authentication.
     */
    providers: AuthenticationProviders;
    /**
     * Specifies whether the workplace's user authentication method is fully configured.
     */
    samlConfigurationStatus?: SamlConfigurationStatus;
  }
  export interface AwsSsoAuthentication {
    /**
     * The ID of the IAM Identity Center-managed application that is created by Amazon Managed Grafana.
     */
    ssoClientId?: SSOClientId;
  }
  export type Boolean = boolean;
  export type ClientToken = string;
  export interface CreateWorkspaceApiKeyRequest {
    /**
     * Specifies the name of the key. Keynames must be unique to the workspace.
     */
    keyName: ApiKeyName;
    /**
     * Specifies the permission level of the key.  Valid values: VIEWER|EDITOR|ADMIN 
     */
    keyRole: String;
    /**
     * Specifies the time in seconds until the key expires. Keys can be valid for up to 30 days.
     */
    secondsToLive: CreateWorkspaceApiKeyRequestSecondsToLiveInteger;
    /**
     * The ID of the workspace to create an API key.
     */
    workspaceId: WorkspaceId;
  }
  export type CreateWorkspaceApiKeyRequestSecondsToLiveInteger = number;
  export interface CreateWorkspaceApiKeyResponse {
    /**
     * The key token. Use this value as a bearer token to authenticate HTTP requests to the workspace.
     */
    key: ApiKeyToken;
    /**
     * The name of the key that was created.
     */
    keyName: ApiKeyName;
    /**
     * The ID of the workspace that the key is valid for.
     */
    workspaceId: WorkspaceId;
  }
  export interface CreateWorkspaceRequest {
    /**
     * Specifies whether the workspace can access Amazon Web Services resources in this Amazon Web Services account only, or whether it can also access Amazon Web Services resources in other accounts in the same organization. If you specify ORGANIZATION, you must specify which organizational units the workspace can access in the workspaceOrganizationalUnits parameter.
     */
    accountAccessType: AccountAccessType;
    /**
     * Specifies whether this workspace uses SAML 2.0, IAM Identity Center (successor to Single Sign-On), or both to authenticate users for using the Grafana console within a workspace. For more information, see User authentication in Amazon Managed Grafana.
     */
    authenticationProviders: AuthenticationProviders;
    /**
     * A unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The configuration string for the workspace that you create. For more information about the format and configuration options available, see Working in your Grafana workspace.
     */
    configuration?: OverridableConfigurationJson;
    /**
     * Specifies the version of Grafana to support in the new workspace. To get a list of supported version, use the ListVersions operation.
     */
    grafanaVersion?: GrafanaVersion;
    /**
     * Configuration for network access to your workspace. When this is configured, only listed IP addresses and VPC endpoints will be able to access your workspace. Standard Grafana authentication and authorization will still be required. If this is not configured, or is removed, then all IP addresses and VPC endpoints will be allowed. Standard Grafana authentication and authorization will still be required.
     */
    networkAccessControl?: NetworkAccessConfiguration;
    /**
     * The name of an IAM role that already exists to use with Organizations to access Amazon Web Services data sources and notification channels in other accounts in an organization.
     */
    organizationRoleName?: OrganizationRoleName;
    /**
     * When creating a workspace through the Amazon Web Services API, CLI or Amazon Web Services CloudFormation, you must manage IAM roles and provision the permissions that the workspace needs to use Amazon Web Services data sources and notification channels. You must also specify a workspaceRoleArn for a role that you will manage for the workspace to use when accessing those datasources and notification channels. The ability for Amazon Managed Grafana to create and update IAM roles on behalf of the user is supported only in the Amazon Managed Grafana console, where this value may be set to SERVICE_MANAGED.  Use only the CUSTOMER_MANAGED permission type when creating a workspace with the API, CLI or Amazon Web Services CloudFormation.   For more information, see Amazon Managed Grafana permissions and policies for Amazon Web Services data sources and notification channels.
     */
    permissionType: PermissionType;
    /**
     * The name of the CloudFormation stack set to use to generate IAM roles to be used for this workspace.
     */
    stackSetName?: StackSetName;
    /**
     * The list of tags associated with the workspace.
     */
    tags?: TagMap;
    /**
     * The configuration settings for an Amazon VPC that contains data sources for your Grafana workspace to connect to.  Connecting to a private VPC is not yet available in the Asia Pacific (Seoul) Region (ap-northeast-2). 
     */
    vpcConfiguration?: VpcConfiguration;
    /**
     * This parameter is for internal use only, and should not be used.
     */
    workspaceDataSources?: DataSourceTypesList;
    /**
     * A description for the workspace. This is used only to help you identify this workspace. Pattern: ^[\\p{L}\\p{Z}\\p{N}\\p{P}]{0,2048}$ 
     */
    workspaceDescription?: Description;
    /**
     * The name for the workspace. It does not have to be unique.
     */
    workspaceName?: WorkspaceName;
    /**
     * Specify the Amazon Web Services notification channels that you plan to use in this workspace. Specifying these data sources here enables Amazon Managed Grafana to create IAM roles and permissions that allow Amazon Managed Grafana to use these channels.
     */
    workspaceNotificationDestinations?: NotificationDestinationsList;
    /**
     * Specifies the organizational units that this workspace is allowed to use data sources from, if this workspace is in an account that is part of an organization.
     */
    workspaceOrganizationalUnits?: OrganizationalUnitList;
    /**
     * Specified the IAM role that grants permissions to the Amazon Web Services resources that the workspace will view data from, including both data sources and notification channels. You are responsible for managing the permissions for this role as new data sources or notification channels are added. 
     */
    workspaceRoleArn?: IamRoleArn;
  }
  export interface CreateWorkspaceResponse {
    /**
     * A structure containing data about the workspace that was created.
     */
    workspace: WorkspaceDescription;
  }
  export type DataSourceType = "AMAZON_OPENSEARCH_SERVICE"|"CLOUDWATCH"|"PROMETHEUS"|"XRAY"|"TIMESTREAM"|"SITEWISE"|"ATHENA"|"REDSHIFT"|"TWINMAKER"|string;
  export type DataSourceTypesList = DataSourceType[];
  export interface DeleteWorkspaceApiKeyRequest {
    /**
     * The name of the API key to delete.
     */
    keyName: ApiKeyName;
    /**
     * The ID of the workspace to delete.
     */
    workspaceId: WorkspaceId;
  }
  export interface DeleteWorkspaceApiKeyResponse {
    /**
     * The name of the key that was deleted.
     */
    keyName: ApiKeyName;
    /**
     * The ID of the workspace where the key was deleted.
     */
    workspaceId: WorkspaceId;
  }
  export interface DeleteWorkspaceRequest {
    /**
     * The ID of the workspace to delete.
     */
    workspaceId: WorkspaceId;
  }
  export interface DeleteWorkspaceResponse {
    /**
     * A structure containing information about the workspace that was deleted.
     */
    workspace: WorkspaceDescription;
  }
  export interface DescribeWorkspaceAuthenticationRequest {
    /**
     * The ID of the workspace to return authentication information about.
     */
    workspaceId: WorkspaceId;
  }
  export interface DescribeWorkspaceAuthenticationResponse {
    /**
     * A structure containing information about the authentication methods used in the workspace.
     */
    authentication: AuthenticationDescription;
  }
  export interface DescribeWorkspaceConfigurationRequest {
    /**
     * The ID of the workspace to get configuration information for.
     */
    workspaceId: WorkspaceId;
  }
  export interface DescribeWorkspaceConfigurationResponse {
    /**
     * The configuration string for the workspace that you requested. For more information about the format and configuration options available, see Working in your Grafana workspace.
     */
    configuration: OverridableConfigurationJson;
    /**
     * The supported Grafana version for the workspace.
     */
    grafanaVersion?: GrafanaVersion;
  }
  export interface DescribeWorkspaceRequest {
    /**
     * The ID of the workspace to display information about.
     */
    workspaceId: WorkspaceId;
  }
  export interface DescribeWorkspaceResponse {
    /**
     * A structure containing information about the workspace.
     */
    workspace: WorkspaceDescription;
  }
  export type Description = string;
  export interface DisassociateLicenseRequest {
    /**
     * The type of license to remove from the workspace.
     */
    licenseType: LicenseType;
    /**
     * The ID of the workspace to remove the Grafana Enterprise license from.
     */
    workspaceId: WorkspaceId;
  }
  export interface DisassociateLicenseResponse {
    /**
     * A structure containing information about the workspace.
     */
    workspace: WorkspaceDescription;
  }
  export type Endpoint = string;
  export type GrafanaVersion = string;
  export type GrafanaVersionList = GrafanaVersion[];
  export type IamRoleArn = string;
  export interface IdpMetadata {
    /**
     * The URL of the location containing the IdP metadata.
     */
    url?: IdpMetadataUrl;
    /**
     * The full IdP metadata, in XML format.
     */
    xml?: String;
  }
  export type IdpMetadataUrl = string;
  export type LicenseType = "ENTERPRISE"|"ENTERPRISE_FREE_TRIAL"|string;
  export interface ListPermissionsRequest {
    /**
     * (Optional) Limits the results to only the group that matches this ID.
     */
    groupId?: SsoId;
    /**
     * The maximum number of results to include in the response.
     */
    maxResults?: ListPermissionsRequestMaxResultsInteger;
    /**
     * The token to use when requesting the next set of results. You received this token from a previous ListPermissions operation.
     */
    nextToken?: PaginationToken;
    /**
     * (Optional) Limits the results to only the user that matches this ID.
     */
    userId?: SsoId;
    /**
     * (Optional) If you specify SSO_USER, then only the permissions of IAM Identity Center users are returned. If you specify SSO_GROUP, only the permissions of IAM Identity Center groups are returned.
     */
    userType?: UserType;
    /**
     * The ID of the workspace to list permissions for. This parameter is required.
     */
    workspaceId: WorkspaceId;
  }
  export type ListPermissionsRequestMaxResultsInteger = number;
  export interface ListPermissionsResponse {
    /**
     * The token to use in a subsequent ListPermissions operation to return the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * The permissions returned by the operation.
     */
    permissions: PermissionEntryList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource the list of tags are associated with.
     */
    resourceArn: String;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of tags that are associated with the resource.
     */
    tags?: TagMap;
  }
  export interface ListVersionsRequest {
    /**
     * The maximum number of results to include in the response.
     */
    maxResults?: ListVersionsRequestMaxResultsInteger;
    /**
     * The token to use when requesting the next set of results. You receive this token from a previous ListVersions operation.
     */
    nextToken?: PaginationToken;
    /**
     * The ID of the workspace to list the available upgrade versions. If not included, lists all versions of Grafana that are supported for CreateWorkspace.
     */
    workspaceId?: WorkspaceId;
  }
  export type ListVersionsRequestMaxResultsInteger = number;
  export interface ListVersionsResponse {
    /**
     * The Grafana versions available to create. If a workspace ID is included in the request, the Grafana versions to which this workspace can be upgraded.
     */
    grafanaVersions?: GrafanaVersionList;
    /**
     * The token to use in a subsequent ListVersions operation to return the next set of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListWorkspacesRequest {
    /**
     * The maximum number of workspaces to include in the results.
     */
    maxResults?: ListWorkspacesRequestMaxResultsInteger;
    /**
     * The token for the next set of workspaces to return. (You receive this token from a previous ListWorkspaces operation.)
     */
    nextToken?: PaginationToken;
  }
  export type ListWorkspacesRequestMaxResultsInteger = number;
  export interface ListWorkspacesResponse {
    /**
     * The token to use when requesting the next set of workspaces.
     */
    nextToken?: PaginationToken;
    /**
     * An array of structures that contain some information about the workspaces in the account.
     */
    workspaces: WorkspaceList;
  }
  export type LoginValidityDuration = number;
  export interface NetworkAccessConfiguration {
    /**
     * An array of prefix list IDs. A prefix list is a list of CIDR ranges of IP addresses. The IP addresses specified are allowed to access your workspace. If the list is not included in the configuration (passed an empty array) then no IP addresses are allowed to access the workspace. You create a prefix list using the Amazon VPC console. Prefix list IDs have the format pl-1a2b3c4d . For more information about prefix lists, see Group CIDR blocks using managed prefix listsin the Amazon Virtual Private Cloud User Guide.
     */
    prefixListIds: PrefixListIds;
    /**
     * An array of Amazon VPC endpoint IDs for the workspace. You can create VPC endpoints to your Amazon Managed Grafana workspace for access from within a VPC. If a NetworkAccessConfiguration is specified then only VPC endpoints specified here are allowed to access the workspace. If you pass in an empty array of strings, then no VPCs are allowed to access the workspace. VPC endpoint IDs have the format vpce-1a2b3c4d . For more information about creating an interface VPC endpoint, see Interface VPC endpoints in the Amazon Managed Grafana User Guide.  The only VPC endpoints that can be specified here are interface VPC endpoints for Grafana workspaces (using the com.amazonaws.[region].grafana-workspace service endpoint). Other VPC endpoints are ignored. 
     */
    vpceIds: VpceIds;
  }
  export type NotificationDestinationType = "SNS"|string;
  export type NotificationDestinationsList = NotificationDestinationType[];
  export type OrganizationRoleName = string;
  export type OrganizationalUnit = string;
  export type OrganizationalUnitList = OrganizationalUnit[];
  export type OverridableConfigurationJson = string;
  export type PaginationToken = string;
  export interface PermissionEntry {
    /**
     * Specifies whether the user or group has the Admin, Editor, or Viewer role.
     */
    role: Role;
    /**
     * A structure with the ID of the user or group with this role.
     */
    user: User;
  }
  export type PermissionEntryList = PermissionEntry[];
  export type PermissionType = "CUSTOMER_MANAGED"|"SERVICE_MANAGED"|string;
  export type PrefixListId = string;
  export type PrefixListIds = PrefixListId[];
  export type Role = "ADMIN"|"EDITOR"|"VIEWER"|string;
  export type RoleValue = string;
  export type RoleValueList = RoleValue[];
  export interface RoleValues {
    /**
     * A list of groups from the SAML assertion attribute to grant the Grafana Admin role to.
     */
    admin?: RoleValueList;
    /**
     * A list of groups from the SAML assertion attribute to grant the Grafana Editor role to.
     */
    editor?: RoleValueList;
  }
  export type SSOClientId = string;
  export interface SamlAuthentication {
    /**
     * A structure containing details about how this workspace works with SAML. 
     */
    configuration?: SamlConfiguration;
    /**
     * Specifies whether the workspace's SAML configuration is complete.
     */
    status: SamlConfigurationStatus;
  }
  export interface SamlConfiguration {
    /**
     * Lists which organizations defined in the SAML assertion are allowed to use the Amazon Managed Grafana workspace. If this is empty, all organizations in the assertion attribute have access.
     */
    allowedOrganizations?: AllowedOrganizations;
    /**
     * A structure that defines which attributes in the SAML assertion are to be used to define information about the users authenticated by that IdP to use the workspace.
     */
    assertionAttributes?: AssertionAttributes;
    /**
     * A structure containing the identity provider (IdP) metadata used to integrate the identity provider with this workspace.
     */
    idpMetadata: IdpMetadata;
    /**
     * How long a sign-on session by a SAML user is valid, before the user has to sign on again.
     */
    loginValidityDuration?: LoginValidityDuration;
    /**
     * A structure containing arrays that map group names in the SAML assertion to the Grafana Admin and Editor roles in the workspace.
     */
    roleValues?: RoleValues;
  }
  export type SamlConfigurationStatus = "CONFIGURED"|"NOT_CONFIGURED"|string;
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export type SsoId = string;
  export type StackSetName = string;
  export type String = string;
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the resource the tag is associated with.
     */
    resourceArn: String;
    /**
     * The list of tag keys and values to associate with the resource. You can associate tag keys only, tags (key and values) only or a combination of tag keys and tags.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource the tag association is removed from. 
     */
    resourceArn: String;
    /**
     * The key values of the tag to be removed from the resource.
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export type UpdateAction = "ADD"|"REVOKE"|string;
  export interface UpdateError {
    /**
     * Specifies which permission update caused the error.
     */
    causedBy: UpdateInstruction;
    /**
     * The error code.
     */
    code: UpdateErrorCodeInteger;
    /**
     * The message for this error.
     */
    message: String;
  }
  export type UpdateErrorCodeInteger = number;
  export type UpdateErrorList = UpdateError[];
  export interface UpdateInstruction {
    /**
     * Specifies whether this update is to add or revoke role permissions.
     */
    action: UpdateAction;
    /**
     * The role to add or revoke for the user or the group specified in users.
     */
    role: Role;
    /**
     * A structure that specifies the user or group to add or revoke the role for.
     */
    users: UserList;
  }
  export type UpdateInstructionBatch = UpdateInstruction[];
  export interface UpdatePermissionsRequest {
    /**
     * An array of structures that contain the permission updates to make.
     */
    updateInstructionBatch: UpdateInstructionBatch;
    /**
     * The ID of the workspace to update.
     */
    workspaceId: WorkspaceId;
  }
  export interface UpdatePermissionsResponse {
    /**
     * An array of structures that contain the errors from the operation, if any.
     */
    errors: UpdateErrorList;
  }
  export interface UpdateWorkspaceAuthenticationRequest {
    /**
     * Specifies whether this workspace uses SAML 2.0, IAM Identity Center (successor to Single Sign-On), or both to authenticate users for using the Grafana console within a workspace. For more information, see User authentication in Amazon Managed Grafana.
     */
    authenticationProviders: AuthenticationProviders;
    /**
     * If the workspace uses SAML, use this structure to map SAML assertion attributes to workspace user information and define which groups in the assertion attribute are to have the Admin and Editor roles in the workspace.
     */
    samlConfiguration?: SamlConfiguration;
    /**
     * The ID of the workspace to update the authentication for.
     */
    workspaceId: WorkspaceId;
  }
  export interface UpdateWorkspaceAuthenticationResponse {
    /**
     * A structure that describes the user authentication for this workspace after the update is made.
     */
    authentication: AuthenticationDescription;
  }
  export interface UpdateWorkspaceConfigurationRequest {
    /**
     * The new configuration string for the workspace. For more information about the format and configuration options available, see Working in your Grafana workspace.
     */
    configuration: OverridableConfigurationJson;
    /**
     * Specifies the version of Grafana to support in the new workspace. Can only be used to upgrade (for example, from 8.4 to 9.4), not downgrade (for example, from 9.4 to 8.4). To know what versions are available to upgrade to for a specific workspace, see the ListVersions operation.
     */
    grafanaVersion?: GrafanaVersion;
    /**
     * The ID of the workspace to update.
     */
    workspaceId: WorkspaceId;
  }
  export interface UpdateWorkspaceConfigurationResponse {
  }
  export interface UpdateWorkspaceRequest {
    /**
     * Specifies whether the workspace can access Amazon Web Services resources in this Amazon Web Services account only, or whether it can also access Amazon Web Services resources in other accounts in the same organization. If you specify ORGANIZATION, you must specify which organizational units the workspace can access in the workspaceOrganizationalUnits parameter.
     */
    accountAccessType?: AccountAccessType;
    /**
     * The configuration settings for network access to your workspace. When this is configured, only listed IP addresses and VPC endpoints will be able to access your workspace. Standard Grafana authentication and authorization will still be required. If this is not configured, or is removed, then all IP addresses and VPC endpoints will be allowed. Standard Grafana authentication and authorization will still be required.
     */
    networkAccessControl?: NetworkAccessConfiguration;
    /**
     * The name of an IAM role that already exists to use to access resources through Organizations. This can only be used with a workspace that has the permissionType set to CUSTOMER_MANAGED.
     */
    organizationRoleName?: OrganizationRoleName;
    /**
     * Use this parameter if you want to change a workspace from SERVICE_MANAGED to CUSTOMER_MANAGED. This allows you to manage the permissions that the workspace uses to access datasources and notification channels. If the workspace is in a member Amazon Web Services account of an organization, and that account is not a delegated administrator account, and you want the workspace to access data sources in other Amazon Web Services accounts in the organization, you must choose CUSTOMER_MANAGED. If you specify this as CUSTOMER_MANAGED, you must also specify a workspaceRoleArn that the workspace will use for accessing Amazon Web Services resources. For more information on the role and permissions needed, see Amazon Managed Grafana permissions and policies for Amazon Web Services data sources and notification channels   Do not use this to convert a CUSTOMER_MANAGED workspace to SERVICE_MANAGED. Do not include this parameter if you want to leave the workspace as SERVICE_MANAGED. You can convert a CUSTOMER_MANAGED workspace to SERVICE_MANAGED using the Amazon Managed Grafana console. For more information, see Managing permissions for data sources and notification channels. 
     */
    permissionType?: PermissionType;
    /**
     * Whether to remove the network access configuration from the workspace. Setting this to true and providing a networkAccessControl to set will return an error. If you remove this configuration by setting this to true, then all IP addresses and VPC endpoints will be allowed. Standard Grafana authentication and authorization will still be required.
     */
    removeNetworkAccessConfiguration?: Boolean;
    /**
     * Whether to remove the VPC configuration from the workspace. Setting this to true and providing a vpcConfiguration to set will return an error.
     */
    removeVpcConfiguration?: Boolean;
    /**
     * The name of the CloudFormation stack set to use to generate IAM roles to be used for this workspace.
     */
    stackSetName?: StackSetName;
    /**
     * The configuration settings for an Amazon VPC that contains data sources for your Grafana workspace to connect to.
     */
    vpcConfiguration?: VpcConfiguration;
    /**
     * This parameter is for internal use only, and should not be used.
     */
    workspaceDataSources?: DataSourceTypesList;
    /**
     * A description for the workspace. This is used only to help you identify this workspace.
     */
    workspaceDescription?: Description;
    /**
     * The ID of the workspace to update.
     */
    workspaceId: WorkspaceId;
    /**
     * A new name for the workspace to update.
     */
    workspaceName?: WorkspaceName;
    /**
     * Specify the Amazon Web Services notification channels that you plan to use in this workspace. Specifying these data sources here enables Amazon Managed Grafana to create IAM roles and permissions that allow Amazon Managed Grafana to use these channels.
     */
    workspaceNotificationDestinations?: NotificationDestinationsList;
    /**
     * Specifies the organizational units that this workspace is allowed to use data sources from, if this workspace is in an account that is part of an organization.
     */
    workspaceOrganizationalUnits?: OrganizationalUnitList;
    /**
     * Specifies an IAM role that grants permissions to Amazon Web Services resources that the workspace accesses, such as data sources and notification channels. If this workspace has permissionType CUSTOMER_MANAGED, then this role is required.
     */
    workspaceRoleArn?: IamRoleArn;
  }
  export interface UpdateWorkspaceResponse {
    /**
     * A structure containing data about the workspace that was created.
     */
    workspace: WorkspaceDescription;
  }
  export interface User {
    /**
     * The ID of the user or group. Pattern: ^([0-9a-fA-F]{10}-|)[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}$ 
     */
    id: SsoId;
    /**
     * Specifies whether this is a single user or a group.
     */
    type: UserType;
  }
  export type UserList = User[];
  export type UserType = "SSO_USER"|"SSO_GROUP"|string;
  export interface VpcConfiguration {
    /**
     * The list of Amazon EC2 security group IDs attached to the Amazon VPC for your Grafana workspace to connect. Duplicates not allowed.
     */
    securityGroupIds: SecurityGroupIds;
    /**
     * The list of Amazon EC2 subnet IDs created in the Amazon VPC for your Grafana workspace to connect. Duplicates not allowed.
     */
    subnetIds: SubnetIds;
  }
  export type VpceId = string;
  export type VpceIds = VpceId[];
  export interface WorkspaceDescription {
    /**
     * Specifies whether the workspace can access Amazon Web Services resources in this Amazon Web Services account only, or whether it can also access Amazon Web Services resources in other accounts in the same organization. If this is ORGANIZATION, the workspaceOrganizationalUnits parameter specifies which organizational units the workspace can access.
     */
    accountAccessType?: AccountAccessType;
    /**
     * A structure that describes whether the workspace uses SAML, IAM Identity Center, or both methods for user authentication.
     */
    authentication: AuthenticationSummary;
    /**
     * The date that the workspace was created.
     */
    created: Timestamp;
    /**
     * Specifies the Amazon Web Services data sources that have been configured to have IAM roles and permissions created to allow Amazon Managed Grafana to read data from these sources. This list is only used when the workspace was created through the Amazon Web Services console, and the permissionType is SERVICE_MANAGED.
     */
    dataSources: DataSourceTypesList;
    /**
     * The user-defined description of the workspace.
     */
    description?: Description;
    /**
     * The URL that users can use to access the Grafana console in the workspace.
     */
    endpoint: Endpoint;
    /**
     * Specifies whether this workspace has already fully used its free trial for Grafana Enterprise.
     */
    freeTrialConsumed?: Boolean;
    /**
     * If this workspace is currently in the free trial period for Grafana Enterprise, this value specifies when that free trial ends.
     */
    freeTrialExpiration?: Timestamp;
    /**
     * The version of Grafana supported in this workspace.
     */
    grafanaVersion: GrafanaVersion;
    /**
     * The unique ID of this workspace.
     */
    id: WorkspaceId;
    /**
     * If this workspace has a full Grafana Enterprise license, this specifies when the license ends and will need to be renewed.
     */
    licenseExpiration?: Timestamp;
    /**
     * Specifies whether this workspace has a full Grafana Enterprise license or a free trial license.
     */
    licenseType?: LicenseType;
    /**
     * The most recent date that the workspace was modified.
     */
    modified: Timestamp;
    /**
     * The name of the workspace.
     */
    name?: WorkspaceName;
    /**
     * The configuration settings for network access to your workspace.
     */
    networkAccessControl?: NetworkAccessConfiguration;
    /**
     * The Amazon Web Services notification channels that Amazon Managed Grafana can automatically create IAM roles and permissions for, to allow Amazon Managed Grafana to use these channels.
     */
    notificationDestinations?: NotificationDestinationsList;
    /**
     * The name of the IAM role that is used to access resources through Organizations.
     */
    organizationRoleName?: OrganizationRoleName;
    /**
     * Specifies the organizational units that this workspace is allowed to use data sources from, if this workspace is in an account that is part of an organization.
     */
    organizationalUnits?: OrganizationalUnitList;
    /**
     * If this is SERVICE_MANAGED, and the workplace was created through the Amazon Managed Grafana console, then Amazon Managed Grafana automatically creates the IAM roles and provisions the permissions that the workspace needs to use Amazon Web Services data sources and notification channels. If this is CUSTOMER_MANAGED, you must manage those roles and permissions yourself. If you are working with a workspace in a member account of an organization and that account is not a delegated administrator account, and you want the workspace to access data sources in other Amazon Web Services accounts in the organization, this parameter must be set to CUSTOMER_MANAGED. For more information about converting between customer and service managed, see Managing permissions for data sources and notification channels. For more information about the roles and permissions that must be managed for customer managed workspaces, see Amazon Managed Grafana permissions and policies for Amazon Web Services data sources and notification channels 
     */
    permissionType?: PermissionType;
    /**
     * The name of the CloudFormation stack set that is used to generate IAM roles to be used for this workspace.
     */
    stackSetName?: StackSetName;
    /**
     * The current status of the workspace.
     */
    status: WorkspaceStatus;
    /**
     * The list of tags associated with the workspace.
     */
    tags?: TagMap;
    /**
     * The configuration for connecting to data sources in a private VPC (Amazon Virtual Private Cloud).
     */
    vpcConfiguration?: VpcConfiguration;
    /**
     * The IAM role that grants permissions to the Amazon Web Services resources that the workspace will view data from. This role must already exist.
     */
    workspaceRoleArn?: IamRoleArn;
  }
  export type WorkspaceId = string;
  export type WorkspaceList = WorkspaceSummary[];
  export type WorkspaceName = string;
  export type WorkspaceStatus = "ACTIVE"|"CREATING"|"DELETING"|"FAILED"|"UPDATING"|"UPGRADING"|"DELETION_FAILED"|"CREATION_FAILED"|"UPDATE_FAILED"|"UPGRADE_FAILED"|"LICENSE_REMOVAL_FAILED"|"VERSION_UPDATING"|"VERSION_UPDATE_FAILED"|string;
  export interface WorkspaceSummary {
    /**
     * A structure containing information about the authentication methods used in the workspace.
     */
    authentication: AuthenticationSummary;
    /**
     * The date that the workspace was created.
     */
    created: Timestamp;
    /**
     * The customer-entered description of the workspace.
     */
    description?: Description;
    /**
     * The URL endpoint to use to access the Grafana console in the workspace.
     */
    endpoint: Endpoint;
    /**
     * The Grafana version that the workspace is running.
     */
    grafanaVersion: GrafanaVersion;
    /**
     * The unique ID of the workspace.
     */
    id: WorkspaceId;
    /**
     * The most recent date that the workspace was modified.
     */
    modified: Timestamp;
    /**
     * The name of the workspace.
     */
    name?: WorkspaceName;
    /**
     * The Amazon Web Services notification channels that Amazon Managed Grafana can automatically create IAM roles and permissions for, which allows Amazon Managed Grafana to use these channels.
     */
    notificationDestinations?: NotificationDestinationsList;
    /**
     * The current status of the workspace.
     */
    status: WorkspaceStatus;
    /**
     * The list of tags associated with the workspace.
     */
    tags?: TagMap;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-08-18"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Grafana client.
   */
  export import Types = Grafana;
}
export = Grafana;
