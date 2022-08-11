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
   * Deletes an Amazon Managed Grafana workspace.
   */
  deleteWorkspace(params: Grafana.Types.DeleteWorkspaceRequest, callback?: (err: AWSError, data: Grafana.Types.DeleteWorkspaceResponse) => void): Request<Grafana.Types.DeleteWorkspaceResponse, AWSError>;
  /**
   * Deletes an Amazon Managed Grafana workspace.
   */
  deleteWorkspace(callback?: (err: AWSError, data: Grafana.Types.DeleteWorkspaceResponse) => void): Request<Grafana.Types.DeleteWorkspaceResponse, AWSError>;
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
   * Returns a list of Amazon Managed Grafana workspaces in the account, with some information about each workspace. For more complete information about one workspace, use DescribeWorkspace.
   */
  listWorkspaces(params: Grafana.Types.ListWorkspacesRequest, callback?: (err: AWSError, data: Grafana.Types.ListWorkspacesResponse) => void): Request<Grafana.Types.ListWorkspacesResponse, AWSError>;
  /**
   * Returns a list of Amazon Managed Grafana workspaces in the account, with some information about each workspace. For more complete information about one workspace, use DescribeWorkspace.
   */
  listWorkspaces(callback?: (err: AWSError, data: Grafana.Types.ListWorkspacesResponse) => void): Request<Grafana.Types.ListWorkspacesResponse, AWSError>;
  /**
   * Updates which users in a workspace have the Grafana Admin or Editor roles.
   */
  updatePermissions(params: Grafana.Types.UpdatePermissionsRequest, callback?: (err: AWSError, data: Grafana.Types.UpdatePermissionsResponse) => void): Request<Grafana.Types.UpdatePermissionsResponse, AWSError>;
  /**
   * Updates which users in a workspace have the Grafana Admin or Editor roles.
   */
  updatePermissions(callback?: (err: AWSError, data: Grafana.Types.UpdatePermissionsResponse) => void): Request<Grafana.Types.UpdatePermissionsResponse, AWSError>;
  /**
   * Modifies an existing Amazon Managed Grafana workspace. If you use this operation and omit any optional parameters, the existing values of those parameters are not changed. To modify the user authentication methods that the workspace uses, such as SAML or Amazon Web Services SSO, use UpdateWorkspaceAuthentication. To modify which users in the workspace have the Admin and Editor Grafana roles, use UpdatePermissions.
   */
  updateWorkspace(params: Grafana.Types.UpdateWorkspaceRequest, callback?: (err: AWSError, data: Grafana.Types.UpdateWorkspaceResponse) => void): Request<Grafana.Types.UpdateWorkspaceResponse, AWSError>;
  /**
   * Modifies an existing Amazon Managed Grafana workspace. If you use this operation and omit any optional parameters, the existing values of those parameters are not changed. To modify the user authentication methods that the workspace uses, such as SAML or Amazon Web Services SSO, use UpdateWorkspaceAuthentication. To modify which users in the workspace have the Admin and Editor Grafana roles, use UpdatePermissions.
   */
  updateWorkspace(callback?: (err: AWSError, data: Grafana.Types.UpdateWorkspaceResponse) => void): Request<Grafana.Types.UpdateWorkspaceResponse, AWSError>;
  /**
   * Use this operation to define the identity provider (IdP) that this workspace authenticates users from, using SAML. You can also map SAML assertion attributes to workspace user information and define which groups in the assertion attribute are to have the Admin and Editor roles in the workspace.
   */
  updateWorkspaceAuthentication(params: Grafana.Types.UpdateWorkspaceAuthenticationRequest, callback?: (err: AWSError, data: Grafana.Types.UpdateWorkspaceAuthenticationResponse) => void): Request<Grafana.Types.UpdateWorkspaceAuthenticationResponse, AWSError>;
  /**
   * Use this operation to define the identity provider (IdP) that this workspace authenticates users from, using SAML. You can also map SAML assertion attributes to workspace user information and define which groups in the assertion attribute are to have the Admin and Editor roles in the workspace.
   */
  updateWorkspaceAuthentication(callback?: (err: AWSError, data: Grafana.Types.UpdateWorkspaceAuthenticationResponse) => void): Request<Grafana.Types.UpdateWorkspaceAuthenticationResponse, AWSError>;
}
declare namespace Grafana {
  export type AccountAccessType = "CURRENT_ACCOUNT"|"ORGANIZATION"|string;
  export type AllowedOrganization = string;
  export type AllowedOrganizations = AllowedOrganization[];
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
     * A structure containing information about how this workspace works with Amazon Web Services SSO. 
     */
    awsSso?: AwsSsoAuthentication;
    /**
     * Specifies whether this workspace uses Amazon Web Services SSO, SAML, or both methods to authenticate users to use the Grafana console in the Amazon Managed Grafana workspace.
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
     * Specifies whether the workspace uses SAML, Amazon Web Services SSO, or both methods for user authentication.
     */
    providers: AuthenticationProviders;
    /**
     * Specifies whether the workplace's user authentication method is fully configured.
     */
    samlConfigurationStatus?: SamlConfigurationStatus;
  }
  export interface AwsSsoAuthentication {
    /**
     * The ID of the Amazon Web Services SSO-managed application that is created by Amazon Managed Grafana.
     */
    ssoClientId?: SSOClientId;
  }
  export type Boolean = boolean;
  export type ClientToken = string;
  export interface CreateWorkspaceRequest {
    /**
     * Specifies whether the workspace can access Amazon Web Services resources in this Amazon Web Services account only, or whether it can also access Amazon Web Services resources in other accounts in the same organization. If you specify ORGANIZATION, you must specify which organizational units the workspace can access in the workspaceOrganizationalUnits parameter.
     */
    accountAccessType: AccountAccessType;
    /**
     * Specifies whether this workspace uses SAML 2.0, Amazon Web Services Single Sign On, or both to authenticate users for using the Grafana console within a workspace. For more information, see User authentication in Amazon Managed Grafana.
     */
    authenticationProviders: AuthenticationProviders;
    /**
     * A unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The name of an IAM role that already exists to use with Organizations to access Amazon Web Services data sources and notification channels in other accounts in an organization.
     */
    organizationRoleName?: OrganizationRoleName;
    /**
     * If you specify Service Managed, Amazon Managed Grafana automatically creates the IAM roles and provisions the permissions that the workspace needs to use Amazon Web Services data sources and notification channels. If you specify CUSTOMER_MANAGED, you will manage those roles and permissions yourself. If you are creating this workspace in a member account of an organization that is not a delegated administrator account, and you want the workspace to access data sources in other Amazon Web Services accounts in the organization, you must choose CUSTOMER_MANAGED. For more information, see Amazon Managed Grafana permissions and policies for Amazon Web Services data sources and notification channels 
     */
    permissionType: PermissionType;
    /**
     * The name of the CloudFormation stack set to use to generate IAM roles to be used for this workspace.
     */
    stackSetName?: StackSetName;
    /**
     * Specify the Amazon Web Services data sources that you want to be queried in this workspace. Specifying these data sources here enables Amazon Managed Grafana to create IAM roles and permissions that allow Amazon Managed Grafana to read data from these sources. You must still add them as data sources in the Grafana console in the workspace. If you don't specify a data source here, you can still add it as a data source in the workspace console later. However, you will then have to manually configure permissions for it.
     */
    workspaceDataSources?: DataSourceTypesList;
    /**
     * A description for the workspace. This is used only to help you identify this workspace.
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
     * The workspace needs an IAM role that grants permissions to the Amazon Web Services resources that the workspace will view data from. If you already have a role that you want to use, specify it here. If you omit this field and you specify some Amazon Web Services resources in workspaceDataSources or workspaceNotificationDestinations, a new IAM role with the necessary permissions is automatically created.
     */
    workspaceRoleArn?: IamRoleArn;
  }
  export interface CreateWorkspaceResponse {
    /**
     * A structure containing data about the workspace that was created.
     */
    workspace: WorkspaceDescription;
  }
  export type DataSourceType = "AMAZON_OPENSEARCH_SERVICE"|"CLOUDWATCH"|"PROMETHEUS"|"XRAY"|"TIMESTREAM"|"SITEWISE"|string;
  export type DataSourceTypesList = DataSourceType[];
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
  export type IamRoleArn = string;
  export interface IdpMetadata {
    /**
     * The URL of the location containing the metadata.
     */
    url?: IdpMetadataUrl;
    /**
     * The actual full metadata file, in XML format.
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
     * (Optional) If you specify SSO_USER, then only the permissions of Amazon Web Services SSO users are returned. If you specify SSO_GROUP, only the permissions of Amazon Web Services SSO groups are returned.
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
  export type NotificationDestinationType = "SNS"|string;
  export type NotificationDestinationsList = NotificationDestinationType[];
  export type OrganizationRoleName = string;
  export type OrganizationalUnit = string;
  export type OrganizationalUnitList = OrganizationalUnit[];
  export type PaginationToken = string;
  export interface PermissionEntry {
    /**
     * Specifies whether the user or group has the Admin or Editor role.
     */
    role: Role;
    /**
     * A structure with the ID of the user or group with this role.
     */
    user: User;
  }
  export type PermissionEntryList = PermissionEntry[];
  export type PermissionType = "CUSTOMER_MANAGED"|"SERVICE_MANAGED"|string;
  export type Role = "ADMIN"|"EDITOR"|string;
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
  export type SsoId = string;
  export type StackSetName = string;
  export type String = string;
  export type Timestamp = Date;
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
     * Specifies whether this workspace uses SAML 2.0, Amazon Web Services Single Sign On, or both to authenticate users for using the Grafana console within a workspace. For more information, see User authentication in Amazon Managed Grafana.
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
  export interface UpdateWorkspaceRequest {
    /**
     * Specifies whether the workspace can access Amazon Web Services resources in this Amazon Web Services account only, or whether it can also access Amazon Web Services resources in other accounts in the same organization. If you specify ORGANIZATION, you must specify which organizational units the workspace can access in the workspaceOrganizationalUnits parameter.
     */
    accountAccessType?: AccountAccessType;
    /**
     * The name of an IAM role that already exists to use to access resources through Organizations.
     */
    organizationRoleName?: OrganizationRoleName;
    /**
     * If you specify Service Managed, Amazon Managed Grafana automatically creates the IAM roles and provisions the permissions that the workspace needs to use Amazon Web Services data sources and notification channels. If you specify CUSTOMER_MANAGED, you will manage those roles and permissions yourself. If you are creating this workspace in a member account of an organization and that account is not a delegated administrator account, and you want the workspace to access data sources in other Amazon Web Services accounts in the organization, you must choose CUSTOMER_MANAGED. For more information, see Amazon Managed Grafana permissions and policies for Amazon Web Services data sources and notification channels 
     */
    permissionType?: PermissionType;
    /**
     * The name of the CloudFormation stack set to use to generate IAM roles to be used for this workspace.
     */
    stackSetName?: StackSetName;
    /**
     * Specify the Amazon Web Services data sources that you want to be queried in this workspace. Specifying these data sources here enables Amazon Managed Grafana to create IAM roles and permissions that allow Amazon Managed Grafana to read data from these sources. You must still add them as data sources in the Grafana console in the workspace. If you don't specify a data source here, you can still add it as a data source later in the workspace console. However, you will then have to manually configure permissions for it.
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
     * The workspace needs an IAM role that grants permissions to the Amazon Web Services resources that the workspace will view data from. If you already have a role that you want to use, specify it here. If you omit this field and you specify some Amazon Web Services resources in workspaceDataSources or workspaceNotificationDestinations, a new IAM role with the necessary permissions is automatically created.
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
     * The ID of the user or group.
     */
    id: SsoId;
    /**
     * Specifies whether this is a single user or a group.
     */
    type: UserType;
  }
  export type UserList = User[];
  export type UserType = "SSO_USER"|"SSO_GROUP"|string;
  export interface WorkspaceDescription {
    /**
     * Specifies whether the workspace can access Amazon Web Services resources in this Amazon Web Services account only, or whether it can also access Amazon Web Services resources in other accounts in the same organization. If this is ORGANIZATION, the workspaceOrganizationalUnits parameter specifies which organizational units the workspace can access.
     */
    accountAccessType?: AccountAccessType;
    /**
     * A structure that describes whether the workspace uses SAML, Amazon Web Services SSO, or both methods for user authentication.
     */
    authentication: AuthenticationSummary;
    /**
     * The date that the workspace was created.
     */
    created: Timestamp;
    /**
     * Specifies the Amazon Web Services data sources that have been configured to have IAM roles and permissions created to allow Amazon Managed Grafana to read data from these sources.
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
     * If this is Service Managed, Amazon Managed Grafana automatically creates the IAM roles and provisions the permissions that the workspace needs to use Amazon Web Services data sources and notification channels. If this is CUSTOMER_MANAGED, you manage those roles and permissions yourself. If you are creating this workspace in a member account of an organization and that account is not a delegated administrator account, and you want the workspace to access data sources in other Amazon Web Services accounts in the organization, you must choose CUSTOMER_MANAGED. For more information, see Amazon Managed Grafana permissions and policies for Amazon Web Services data sources and notification channels 
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
     * The IAM role that grants permissions to the Amazon Web Services resources that the workspace will view data from. This role must already exist.
     */
    workspaceRoleArn?: IamRoleArn;
  }
  export type WorkspaceId = string;
  export type WorkspaceList = WorkspaceSummary[];
  export type WorkspaceName = string;
  export type WorkspaceStatus = "ACTIVE"|"CREATING"|"DELETING"|"FAILED"|"UPDATING"|"UPGRADING"|"DELETION_FAILED"|"CREATION_FAILED"|"UPDATE_FAILED"|"UPGRADE_FAILED"|"LICENSE_REMOVAL_FAILED"|string;
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
