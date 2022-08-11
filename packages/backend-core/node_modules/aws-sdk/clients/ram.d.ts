import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class RAM extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: RAM.Types.ClientConfiguration)
  config: Config & RAM.Types.ClientConfiguration;
  /**
   * Accepts an invitation to a resource share from another Amazon Web Services account.
   */
  acceptResourceShareInvitation(params: RAM.Types.AcceptResourceShareInvitationRequest, callback?: (err: AWSError, data: RAM.Types.AcceptResourceShareInvitationResponse) => void): Request<RAM.Types.AcceptResourceShareInvitationResponse, AWSError>;
  /**
   * Accepts an invitation to a resource share from another Amazon Web Services account.
   */
  acceptResourceShareInvitation(callback?: (err: AWSError, data: RAM.Types.AcceptResourceShareInvitationResponse) => void): Request<RAM.Types.AcceptResourceShareInvitationResponse, AWSError>;
  /**
   * Associates the specified resource share with the specified principals and resources.
   */
  associateResourceShare(params: RAM.Types.AssociateResourceShareRequest, callback?: (err: AWSError, data: RAM.Types.AssociateResourceShareResponse) => void): Request<RAM.Types.AssociateResourceShareResponse, AWSError>;
  /**
   * Associates the specified resource share with the specified principals and resources.
   */
  associateResourceShare(callback?: (err: AWSError, data: RAM.Types.AssociateResourceShareResponse) => void): Request<RAM.Types.AssociateResourceShareResponse, AWSError>;
  /**
   * Associates a permission with a resource share.
   */
  associateResourceSharePermission(params: RAM.Types.AssociateResourceSharePermissionRequest, callback?: (err: AWSError, data: RAM.Types.AssociateResourceSharePermissionResponse) => void): Request<RAM.Types.AssociateResourceSharePermissionResponse, AWSError>;
  /**
   * Associates a permission with a resource share.
   */
  associateResourceSharePermission(callback?: (err: AWSError, data: RAM.Types.AssociateResourceSharePermissionResponse) => void): Request<RAM.Types.AssociateResourceSharePermissionResponse, AWSError>;
  /**
   * Creates a resource share. You must provide a list of the Amazon Resource Names (ARNs) for the resources you want to share. You must also specify who you want to share the resources with, and the permissions that you grant them.  Sharing a resource makes it available for use by principals outside of the Amazon Web Services account that created the resource. Sharing doesn't change any permissions or quotas that apply to the resource in the account that created it. 
   */
  createResourceShare(params: RAM.Types.CreateResourceShareRequest, callback?: (err: AWSError, data: RAM.Types.CreateResourceShareResponse) => void): Request<RAM.Types.CreateResourceShareResponse, AWSError>;
  /**
   * Creates a resource share. You must provide a list of the Amazon Resource Names (ARNs) for the resources you want to share. You must also specify who you want to share the resources with, and the permissions that you grant them.  Sharing a resource makes it available for use by principals outside of the Amazon Web Services account that created the resource. Sharing doesn't change any permissions or quotas that apply to the resource in the account that created it. 
   */
  createResourceShare(callback?: (err: AWSError, data: RAM.Types.CreateResourceShareResponse) => void): Request<RAM.Types.CreateResourceShareResponse, AWSError>;
  /**
   * Deletes the specified resource share.
   */
  deleteResourceShare(params: RAM.Types.DeleteResourceShareRequest, callback?: (err: AWSError, data: RAM.Types.DeleteResourceShareResponse) => void): Request<RAM.Types.DeleteResourceShareResponse, AWSError>;
  /**
   * Deletes the specified resource share.
   */
  deleteResourceShare(callback?: (err: AWSError, data: RAM.Types.DeleteResourceShareResponse) => void): Request<RAM.Types.DeleteResourceShareResponse, AWSError>;
  /**
   * Disassociates the specified principals or resources from the specified resource share.
   */
  disassociateResourceShare(params: RAM.Types.DisassociateResourceShareRequest, callback?: (err: AWSError, data: RAM.Types.DisassociateResourceShareResponse) => void): Request<RAM.Types.DisassociateResourceShareResponse, AWSError>;
  /**
   * Disassociates the specified principals or resources from the specified resource share.
   */
  disassociateResourceShare(callback?: (err: AWSError, data: RAM.Types.DisassociateResourceShareResponse) => void): Request<RAM.Types.DisassociateResourceShareResponse, AWSError>;
  /**
   * Disassociates an RAM permission from a resource share.
   */
  disassociateResourceSharePermission(params: RAM.Types.DisassociateResourceSharePermissionRequest, callback?: (err: AWSError, data: RAM.Types.DisassociateResourceSharePermissionResponse) => void): Request<RAM.Types.DisassociateResourceSharePermissionResponse, AWSError>;
  /**
   * Disassociates an RAM permission from a resource share.
   */
  disassociateResourceSharePermission(callback?: (err: AWSError, data: RAM.Types.DisassociateResourceSharePermissionResponse) => void): Request<RAM.Types.DisassociateResourceSharePermissionResponse, AWSError>;
  /**
   * Enables resource sharing within your organization in Organizations. The caller must be the master account for the organization.
   */
  enableSharingWithAwsOrganization(params: RAM.Types.EnableSharingWithAwsOrganizationRequest, callback?: (err: AWSError, data: RAM.Types.EnableSharingWithAwsOrganizationResponse) => void): Request<RAM.Types.EnableSharingWithAwsOrganizationResponse, AWSError>;
  /**
   * Enables resource sharing within your organization in Organizations. The caller must be the master account for the organization.
   */
  enableSharingWithAwsOrganization(callback?: (err: AWSError, data: RAM.Types.EnableSharingWithAwsOrganizationResponse) => void): Request<RAM.Types.EnableSharingWithAwsOrganizationResponse, AWSError>;
  /**
   * Gets the contents of an RAM permission in JSON format.
   */
  getPermission(params: RAM.Types.GetPermissionRequest, callback?: (err: AWSError, data: RAM.Types.GetPermissionResponse) => void): Request<RAM.Types.GetPermissionResponse, AWSError>;
  /**
   * Gets the contents of an RAM permission in JSON format.
   */
  getPermission(callback?: (err: AWSError, data: RAM.Types.GetPermissionResponse) => void): Request<RAM.Types.GetPermissionResponse, AWSError>;
  /**
   * Gets the policies for the specified resources that you own and have shared.
   */
  getResourcePolicies(params: RAM.Types.GetResourcePoliciesRequest, callback?: (err: AWSError, data: RAM.Types.GetResourcePoliciesResponse) => void): Request<RAM.Types.GetResourcePoliciesResponse, AWSError>;
  /**
   * Gets the policies for the specified resources that you own and have shared.
   */
  getResourcePolicies(callback?: (err: AWSError, data: RAM.Types.GetResourcePoliciesResponse) => void): Request<RAM.Types.GetResourcePoliciesResponse, AWSError>;
  /**
   * Gets the resources or principals for the resource shares that you own.
   */
  getResourceShareAssociations(params: RAM.Types.GetResourceShareAssociationsRequest, callback?: (err: AWSError, data: RAM.Types.GetResourceShareAssociationsResponse) => void): Request<RAM.Types.GetResourceShareAssociationsResponse, AWSError>;
  /**
   * Gets the resources or principals for the resource shares that you own.
   */
  getResourceShareAssociations(callback?: (err: AWSError, data: RAM.Types.GetResourceShareAssociationsResponse) => void): Request<RAM.Types.GetResourceShareAssociationsResponse, AWSError>;
  /**
   * Gets the invitations that you have received for resource shares.
   */
  getResourceShareInvitations(params: RAM.Types.GetResourceShareInvitationsRequest, callback?: (err: AWSError, data: RAM.Types.GetResourceShareInvitationsResponse) => void): Request<RAM.Types.GetResourceShareInvitationsResponse, AWSError>;
  /**
   * Gets the invitations that you have received for resource shares.
   */
  getResourceShareInvitations(callback?: (err: AWSError, data: RAM.Types.GetResourceShareInvitationsResponse) => void): Request<RAM.Types.GetResourceShareInvitationsResponse, AWSError>;
  /**
   * Gets the resource shares that you own or the resource shares that are shared with you.
   */
  getResourceShares(params: RAM.Types.GetResourceSharesRequest, callback?: (err: AWSError, data: RAM.Types.GetResourceSharesResponse) => void): Request<RAM.Types.GetResourceSharesResponse, AWSError>;
  /**
   * Gets the resource shares that you own or the resource shares that are shared with you.
   */
  getResourceShares(callback?: (err: AWSError, data: RAM.Types.GetResourceSharesResponse) => void): Request<RAM.Types.GetResourceSharesResponse, AWSError>;
  /**
   * Lists the resources in a resource share that is shared with you but that the invitation is still pending for.
   */
  listPendingInvitationResources(params: RAM.Types.ListPendingInvitationResourcesRequest, callback?: (err: AWSError, data: RAM.Types.ListPendingInvitationResourcesResponse) => void): Request<RAM.Types.ListPendingInvitationResourcesResponse, AWSError>;
  /**
   * Lists the resources in a resource share that is shared with you but that the invitation is still pending for.
   */
  listPendingInvitationResources(callback?: (err: AWSError, data: RAM.Types.ListPendingInvitationResourcesResponse) => void): Request<RAM.Types.ListPendingInvitationResourcesResponse, AWSError>;
  /**
   * Lists the RAM permissions.
   */
  listPermissions(params: RAM.Types.ListPermissionsRequest, callback?: (err: AWSError, data: RAM.Types.ListPermissionsResponse) => void): Request<RAM.Types.ListPermissionsResponse, AWSError>;
  /**
   * Lists the RAM permissions.
   */
  listPermissions(callback?: (err: AWSError, data: RAM.Types.ListPermissionsResponse) => void): Request<RAM.Types.ListPermissionsResponse, AWSError>;
  /**
   * Lists the principals that you have shared resources with or that have shared resources with you.
   */
  listPrincipals(params: RAM.Types.ListPrincipalsRequest, callback?: (err: AWSError, data: RAM.Types.ListPrincipalsResponse) => void): Request<RAM.Types.ListPrincipalsResponse, AWSError>;
  /**
   * Lists the principals that you have shared resources with or that have shared resources with you.
   */
  listPrincipals(callback?: (err: AWSError, data: RAM.Types.ListPrincipalsResponse) => void): Request<RAM.Types.ListPrincipalsResponse, AWSError>;
  /**
   * Lists the RAM permissions that are associated with a resource share.
   */
  listResourceSharePermissions(params: RAM.Types.ListResourceSharePermissionsRequest, callback?: (err: AWSError, data: RAM.Types.ListResourceSharePermissionsResponse) => void): Request<RAM.Types.ListResourceSharePermissionsResponse, AWSError>;
  /**
   * Lists the RAM permissions that are associated with a resource share.
   */
  listResourceSharePermissions(callback?: (err: AWSError, data: RAM.Types.ListResourceSharePermissionsResponse) => void): Request<RAM.Types.ListResourceSharePermissionsResponse, AWSError>;
  /**
   * Lists the shareable resource types supported by RAM.
   */
  listResourceTypes(params: RAM.Types.ListResourceTypesRequest, callback?: (err: AWSError, data: RAM.Types.ListResourceTypesResponse) => void): Request<RAM.Types.ListResourceTypesResponse, AWSError>;
  /**
   * Lists the shareable resource types supported by RAM.
   */
  listResourceTypes(callback?: (err: AWSError, data: RAM.Types.ListResourceTypesResponse) => void): Request<RAM.Types.ListResourceTypesResponse, AWSError>;
  /**
   * Lists the resources that you added to a resource shares or the resources that are shared with you.
   */
  listResources(params: RAM.Types.ListResourcesRequest, callback?: (err: AWSError, data: RAM.Types.ListResourcesResponse) => void): Request<RAM.Types.ListResourcesResponse, AWSError>;
  /**
   * Lists the resources that you added to a resource shares or the resources that are shared with you.
   */
  listResources(callback?: (err: AWSError, data: RAM.Types.ListResourcesResponse) => void): Request<RAM.Types.ListResourcesResponse, AWSError>;
  /**
   * Resource shares that were created by attaching a policy to a resource are visible only to the resource share owner, and the resource share cannot be modified in RAM. Use this API action to promote the resource share. When you promote the resource share, it becomes:   Visible to all principals that it is shared with.   Modifiable in RAM.  
   */
  promoteResourceShareCreatedFromPolicy(params: RAM.Types.PromoteResourceShareCreatedFromPolicyRequest, callback?: (err: AWSError, data: RAM.Types.PromoteResourceShareCreatedFromPolicyResponse) => void): Request<RAM.Types.PromoteResourceShareCreatedFromPolicyResponse, AWSError>;
  /**
   * Resource shares that were created by attaching a policy to a resource are visible only to the resource share owner, and the resource share cannot be modified in RAM. Use this API action to promote the resource share. When you promote the resource share, it becomes:   Visible to all principals that it is shared with.   Modifiable in RAM.  
   */
  promoteResourceShareCreatedFromPolicy(callback?: (err: AWSError, data: RAM.Types.PromoteResourceShareCreatedFromPolicyResponse) => void): Request<RAM.Types.PromoteResourceShareCreatedFromPolicyResponse, AWSError>;
  /**
   * Rejects an invitation to a resource share from another Amazon Web Services account.
   */
  rejectResourceShareInvitation(params: RAM.Types.RejectResourceShareInvitationRequest, callback?: (err: AWSError, data: RAM.Types.RejectResourceShareInvitationResponse) => void): Request<RAM.Types.RejectResourceShareInvitationResponse, AWSError>;
  /**
   * Rejects an invitation to a resource share from another Amazon Web Services account.
   */
  rejectResourceShareInvitation(callback?: (err: AWSError, data: RAM.Types.RejectResourceShareInvitationResponse) => void): Request<RAM.Types.RejectResourceShareInvitationResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource share that you own.
   */
  tagResource(params: RAM.Types.TagResourceRequest, callback?: (err: AWSError, data: RAM.Types.TagResourceResponse) => void): Request<RAM.Types.TagResourceResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource share that you own.
   */
  tagResource(callback?: (err: AWSError, data: RAM.Types.TagResourceResponse) => void): Request<RAM.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resource share that you own.
   */
  untagResource(params: RAM.Types.UntagResourceRequest, callback?: (err: AWSError, data: RAM.Types.UntagResourceResponse) => void): Request<RAM.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resource share that you own.
   */
  untagResource(callback?: (err: AWSError, data: RAM.Types.UntagResourceResponse) => void): Request<RAM.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the specified resource share that you own.
   */
  updateResourceShare(params: RAM.Types.UpdateResourceShareRequest, callback?: (err: AWSError, data: RAM.Types.UpdateResourceShareResponse) => void): Request<RAM.Types.UpdateResourceShareResponse, AWSError>;
  /**
   * Updates the specified resource share that you own.
   */
  updateResourceShare(callback?: (err: AWSError, data: RAM.Types.UpdateResourceShareResponse) => void): Request<RAM.Types.UpdateResourceShareResponse, AWSError>;
}
declare namespace RAM {
  export interface AcceptResourceShareInvitationRequest {
    /**
     * The Amazon Resource Name (ARN) of the invitation.
     */
    resourceShareInvitationArn: String;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface AcceptResourceShareInvitationResponse {
    /**
     * Information about the invitation.
     */
    resourceShareInvitation?: ResourceShareInvitation;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface AssociateResourceSharePermissionRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn: String;
    /**
     * The Amazon Resource Name (ARN) of the RAM permission to associate with the resource share.
     */
    permissionArn: String;
    /**
     * Indicates whether the permission should replace the permissions that are currently associated with the resource share. Use true to replace the current permissions. Use false to add the permission to the current permission.
     */
    replace?: Boolean;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * The version of the RAM permissions to associate with the resource share.
     */
    permissionVersion?: Integer;
  }
  export interface AssociateResourceSharePermissionResponse {
    /**
     * Indicates whether the request succeeded.
     */
    returnValue?: Boolean;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface AssociateResourceShareRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn: String;
    /**
     * The Amazon Resource Names (ARNs) of the resources.
     */
    resourceArns?: ResourceArnList;
    /**
     * The principals to associate with the resource share. The possible values are:   An Amazon Web Services account ID   An Amazon Resource Name (ARN) of an organization in Organizations   An ARN of an organizational unit (OU) in Organizations   An ARN of an IAM role   An ARN of an IAM user    Not all resource types can be shared with IAM roles and IAM users. For more information, see Sharing with IAM roles and IAM users in the Resource Access Manager User Guide. 
     */
    principals?: PrincipalArnOrIdList;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface AssociateResourceShareResponse {
    /**
     * Information about the associations.
     */
    resourceShareAssociations?: ResourceShareAssociationList;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export type Boolean = boolean;
  export interface CreateResourceShareRequest {
    /**
     * The name of the resource share.
     */
    name: String;
    /**
     * The ARNs of the resources to associate with the resource share.
     */
    resourceArns?: ResourceArnList;
    /**
     * The principals to associate with the resource share. The possible values are:   An Amazon Web Services account ID   An Amazon Resource Name (ARN) of an organization in Organizations   An ARN of an organizational unit (OU) in Organizations   An ARN of an IAM role   An ARN of an IAM user    Not all resource types can be shared with IAM roles and IAM users. For more information, see Sharing with IAM roles and IAM users in the Resource Access Manager User Guide. 
     */
    principals?: PrincipalArnOrIdList;
    /**
     * One or more tags.
     */
    tags?: TagList;
    /**
     * Indicates whether principals outside your organization in Organizations can be associated with a resource share.
     */
    allowExternalPrincipals?: Boolean;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * The Amazon Resource Names (ARNs) of the permissions to associate with the resource share. If you do not specify an ARN for the permission, RAM automatically attaches the default version of the permission for each resource type. Only one permission can be associated with each resource type in a resource share.
     */
    permissionArns?: PermissionArnList;
  }
  export interface CreateResourceShareResponse {
    /**
     * Information about the resource share.
     */
    resourceShare?: ResourceShare;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export type DateTime = Date;
  export interface DeleteResourceShareRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn: String;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface DeleteResourceShareResponse {
    /**
     * Indicates whether the request succeeded.
     */
    returnValue?: Boolean;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface DisassociateResourceSharePermissionRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn: String;
    /**
     * The Amazon Resource Name (ARN) of the permission to disassociate from the resource share.
     */
    permissionArn: String;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface DisassociateResourceSharePermissionResponse {
    /**
     * Indicates whether the request succeeded.
     */
    returnValue?: Boolean;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface DisassociateResourceShareRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn: String;
    /**
     * The Amazon Resource Names (ARNs) of the resources.
     */
    resourceArns?: ResourceArnList;
    /**
     * The principals.
     */
    principals?: PrincipalArnOrIdList;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface DisassociateResourceShareResponse {
    /**
     * Information about the associations.
     */
    resourceShareAssociations?: ResourceShareAssociationList;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface EnableSharingWithAwsOrganizationRequest {
  }
  export interface EnableSharingWithAwsOrganizationResponse {
    /**
     * Indicates whether the request succeeded.
     */
    returnValue?: Boolean;
  }
  export interface GetPermissionRequest {
    /**
     * The Amazon Resource Name (ARN) of the permission.
     */
    permissionArn: String;
    /**
     * The identifier for the version of the permission.
     */
    permissionVersion?: Integer;
  }
  export interface GetPermissionResponse {
    /**
     * Information about the permission.
     */
    permission?: ResourceSharePermissionDetail;
  }
  export interface GetResourcePoliciesRequest {
    /**
     * The Amazon Resource Names (ARNs) of the resources.
     */
    resourceArns: ResourceArnList;
    /**
     * The principal.
     */
    principal?: String;
    /**
     * The token for the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface GetResourcePoliciesResponse {
    /**
     * A key policy document, in JSON format.
     */
    policies?: PolicyList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface GetResourceShareAssociationsRequest {
    /**
     * The association type. Specify PRINCIPAL to list the principals that are associated with the specified resource share. Specify RESOURCE to list the resources that are associated with the specified resource share.
     */
    associationType: ResourceShareAssociationType;
    /**
     * The Amazon Resource Names (ARN) of the resource shares.
     */
    resourceShareArns?: ResourceShareArnList;
    /**
     * The Amazon Resource Name (ARN) of the resource. You cannot specify this parameter if the association type is PRINCIPAL.
     */
    resourceArn?: String;
    /**
     * The principal. You cannot specify this parameter if the association type is RESOURCE.
     */
    principal?: String;
    /**
     * The association status.
     */
    associationStatus?: ResourceShareAssociationStatus;
    /**
     * The token for the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface GetResourceShareAssociationsResponse {
    /**
     * Information about the associations.
     */
    resourceShareAssociations?: ResourceShareAssociationList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface GetResourceShareInvitationsRequest {
    /**
     * The Amazon Resource Names (ARN) of the invitations.
     */
    resourceShareInvitationArns?: ResourceShareInvitationArnList;
    /**
     * The Amazon Resource Names (ARN) of the resource shares.
     */
    resourceShareArns?: ResourceShareArnList;
    /**
     * The token for the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface GetResourceShareInvitationsResponse {
    /**
     * Information about the invitations.
     */
    resourceShareInvitations?: ResourceShareInvitationList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface GetResourceSharesRequest {
    /**
     * The Amazon Resource Names (ARNs) of the resource shares.
     */
    resourceShareArns?: ResourceShareArnList;
    /**
     * The status of the resource share.
     */
    resourceShareStatus?: ResourceShareStatus;
    /**
     * The type of owner.
     */
    resourceOwner: ResourceOwner;
    /**
     * The name of the resource share.
     */
    name?: String;
    /**
     * One or more tag filters.
     */
    tagFilters?: TagFilters;
    /**
     * The token for the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: MaxResults;
    /**
     * The Amazon Resource Name (ARN) of the RAM permission that is associated with the resource share.
     */
    permissionArn?: String;
  }
  export interface GetResourceSharesResponse {
    /**
     * Information about the resource shares.
     */
    resourceShares?: ResourceShareList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export type Integer = number;
  export interface ListPendingInvitationResourcesRequest {
    /**
     * The Amazon Resource Name (ARN) of the invitation.
     */
    resourceShareInvitationArn: String;
    /**
     * The token for the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface ListPendingInvitationResourcesResponse {
    /**
     * Information about the resources included the resource share.
     */
    resources?: ResourceList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface ListPermissionsRequest {
    /**
     * Specifies the resource type for which to list permissions. For example, to list only permissions that apply to EC2 subnets, specify ec2:Subnet.
     */
    resourceType?: String;
    /**
     * The token for the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface ListPermissionsResponse {
    /**
     * Information about the permissions.
     */
    permissions?: ResourceSharePermissionList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface ListPrincipalsRequest {
    /**
     * The type of owner.
     */
    resourceOwner: ResourceOwner;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn?: String;
    /**
     * The principals.
     */
    principals?: PrincipalArnOrIdList;
    /**
     * The resource type. Valid values: acm-pca:CertificateAuthority | appmesh:Mesh | codebuild:Project | codebuild:ReportGroup | ec2:CapacityReservation | ec2:DedicatedHost | ec2:LocalGatewayRouteTable | ec2:PrefixList | ec2:Subnet | ec2:TrafficMirrorTarget | ec2:TransitGateway | imagebuilder:Component | imagebuilder:Image | imagebuilder:ImageRecipe | imagebuilder:ContainerRecipe | glue:Catalog | glue:Database | glue:Table | license-manager:LicenseConfiguration I network-firewall:FirewallPolicy | network-firewall:StatefulRuleGroup | network-firewall:StatelessRuleGroup | outposts:Outpost | resource-groups:Group | rds:Cluster | route53resolver:FirewallRuleGroup |route53resolver:ResolverQueryLogConfig | route53resolver:ResolverRule | s3-outposts:Outpost | ssm-contacts:Contact | ssm-incidents:ResponsePlan 
     */
    resourceType?: String;
    /**
     * The Amazon Resource Names (ARN) of the resource shares.
     */
    resourceShareArns?: ResourceShareArnList;
    /**
     * The token for the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface ListPrincipalsResponse {
    /**
     * The principals.
     */
    principals?: PrincipalList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface ListResourceSharePermissionsRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn: String;
    /**
     * The token for the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface ListResourceSharePermissionsResponse {
    /**
     * The permissions associated with the resource share.
     */
    permissions?: ResourceSharePermissionList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface ListResourceTypesRequest {
    /**
     * The token for the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface ListResourceTypesResponse {
    /**
     * The shareable resource types supported by RAM.
     */
    resourceTypes?: ServiceNameAndResourceTypeList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface ListResourcesRequest {
    /**
     * The type of owner.
     */
    resourceOwner: ResourceOwner;
    /**
     * The principal.
     */
    principal?: String;
    /**
     * The resource type. Valid values: acm-pca:CertificateAuthority | appmesh:Mesh | codebuild:Project | codebuild:ReportGroup | ec2:CapacityReservation | ec2:DedicatedHost | ec2:LocalGatewayRouteTable | ec2:PrefixList | ec2:Subnet | ec2:TrafficMirrorTarget | ec2:TransitGateway | imagebuilder:Component | imagebuilder:Image | imagebuilder:ImageRecipe | imagebuilder:ContainerRecipe | glue:Catalog | glue:Database | glue:Table | license-manager:LicenseConfiguration I network-firewall:FirewallPolicy | network-firewall:StatefulRuleGroup | network-firewall:StatelessRuleGroup | outposts:Outpost | resource-groups:Group | rds:Cluster | route53resolver:FirewallRuleGroup |route53resolver:ResolverQueryLogConfig | route53resolver:ResolverRule | s3-outposts:Outpost | ssm-contacts:Contact | ssm-incidents:ResponsePlan 
     */
    resourceType?: String;
    /**
     * The Amazon Resource Names (ARNs) of the resources.
     */
    resourceArns?: ResourceArnList;
    /**
     * The Amazon Resource Names (ARN) of the resource shares.
     */
    resourceShareArns?: ResourceShareArnList;
    /**
     * The token for the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface ListResourcesResponse {
    /**
     * Information about the resources.
     */
    resources?: ResourceList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export type MaxResults = number;
  export type PermissionArnList = String[];
  export type Policy = string;
  export type PolicyList = Policy[];
  export interface Principal {
    /**
     * The ID of the principal.
     */
    id?: String;
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn?: String;
    /**
     * The time when the principal was associated with the resource share.
     */
    creationTime?: DateTime;
    /**
     * The time when the association was last updated.
     */
    lastUpdatedTime?: DateTime;
    /**
     * Indicates whether the principal belongs to the same organization in Organizations as the Amazon Web Services account that owns the resource share.
     */
    external?: Boolean;
  }
  export type PrincipalArnOrIdList = String[];
  export type PrincipalList = Principal[];
  export interface PromoteResourceShareCreatedFromPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource share to promote.
     */
    resourceShareArn: String;
  }
  export interface PromoteResourceShareCreatedFromPolicyResponse {
    /**
     * Indicates whether the request succeeded.
     */
    returnValue?: Boolean;
  }
  export interface RejectResourceShareInvitationRequest {
    /**
     * The Amazon Resource Name (ARN) of the invitation.
     */
    resourceShareInvitationArn: String;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface RejectResourceShareInvitationResponse {
    /**
     * Information about the invitation.
     */
    resourceShareInvitation?: ResourceShareInvitation;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface Resource {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    arn?: String;
    /**
     * The resource type.
     */
    type?: String;
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the resource group. This value is returned only if the resource is a resource group.
     */
    resourceGroupArn?: String;
    /**
     * The status of the resource.
     */
    status?: ResourceStatus;
    /**
     * A message about the status of the resource.
     */
    statusMessage?: String;
    /**
     * The time when the resource was associated with the resource share.
     */
    creationTime?: DateTime;
    /**
     * The time when the association was last updated.
     */
    lastUpdatedTime?: DateTime;
  }
  export type ResourceArnList = String[];
  export type ResourceList = Resource[];
  export type ResourceOwner = "SELF"|"OTHER-ACCOUNTS"|string;
  export interface ResourceShare {
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn?: String;
    /**
     * The name of the resource share.
     */
    name?: String;
    /**
     * The ID of the Amazon Web Services account that owns the resource share.
     */
    owningAccountId?: String;
    /**
     * Indicates whether principals outside your organization in Organizations can be associated with a resource share.
     */
    allowExternalPrincipals?: Boolean;
    /**
     * The status of the resource share.
     */
    status?: ResourceShareStatus;
    /**
     * A message about the status of the resource share.
     */
    statusMessage?: String;
    /**
     * The tags for the resource share.
     */
    tags?: TagList;
    /**
     * The time when the resource share was created.
     */
    creationTime?: DateTime;
    /**
     * The time when the resource share was last updated.
     */
    lastUpdatedTime?: DateTime;
    /**
     * Indicates how the resource share was created. Possible values include:    CREATED_FROM_POLICY - Indicates that the resource share was created from an Amazon Web Services Identity and Access Management (Amazon Web Services IAM) policy attached to a resource. These resource shares are visible only to the Amazon Web Services account that created it. They cannot be modified in RAM.    PROMOTING_TO_STANDARD - The resource share is in the process of being promoted. For more information, see PromoteResourceShareCreatedFromPolicy.    STANDARD - Indicates that the resource share was created in RAM using the console or APIs. These resource shares are visible to all principals. They can be modified in RAM.  
     */
    featureSet?: ResourceShareFeatureSet;
  }
  export type ResourceShareArnList = String[];
  export interface ResourceShareAssociation {
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn?: String;
    /**
     * The name of the resource share.
     */
    resourceShareName?: String;
    /**
     * The associated entity. For resource associations, this is the Amazon Resource Name (ARN) of the resource. For principal associations, this is one of the following:   An Amazon Web Services account ID   An ARN of an organization in Organizations   An ARN of an organizational unit (OU) in Organizations   An ARN of an IAM role   An ARN of an IAM user  
     */
    associatedEntity?: String;
    /**
     * The association type.
     */
    associationType?: ResourceShareAssociationType;
    /**
     * The status of the association.
     */
    status?: ResourceShareAssociationStatus;
    /**
     * A message about the status of the association.
     */
    statusMessage?: String;
    /**
     * The time when the association was created.
     */
    creationTime?: DateTime;
    /**
     * The time when the association was last updated.
     */
    lastUpdatedTime?: DateTime;
    /**
     * Indicates whether the principal belongs to the same organization in Organizations as the Amazon Web Services account that owns the resource share.
     */
    external?: Boolean;
  }
  export type ResourceShareAssociationList = ResourceShareAssociation[];
  export type ResourceShareAssociationStatus = "ASSOCIATING"|"ASSOCIATED"|"FAILED"|"DISASSOCIATING"|"DISASSOCIATED"|string;
  export type ResourceShareAssociationType = "PRINCIPAL"|"RESOURCE"|string;
  export type ResourceShareFeatureSet = "CREATED_FROM_POLICY"|"PROMOTING_TO_STANDARD"|"STANDARD"|string;
  export interface ResourceShareInvitation {
    /**
     * The Amazon Resource Name (ARN) of the invitation.
     */
    resourceShareInvitationArn?: String;
    /**
     * The name of the resource share.
     */
    resourceShareName?: String;
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn?: String;
    /**
     * The ID of the Amazon Web Services account that sent the invitation.
     */
    senderAccountId?: String;
    /**
     * The ID of the Amazon Web Services account that received the invitation.
     */
    receiverAccountId?: String;
    /**
     * The date and time when the invitation was sent.
     */
    invitationTimestamp?: DateTime;
    /**
     * The status of the invitation.
     */
    status?: ResourceShareInvitationStatus;
    /**
     * To view the resources associated with a pending resource share invitation, use  ListPendingInvitationResources.
     */
    resourceShareAssociations?: ResourceShareAssociationList;
    /**
     * The Amazon Resource Name (ARN) of the IAM user or IAM role that received the invitation.
     */
    receiverArn?: String;
  }
  export type ResourceShareInvitationArnList = String[];
  export type ResourceShareInvitationList = ResourceShareInvitation[];
  export type ResourceShareInvitationStatus = "PENDING"|"ACCEPTED"|"REJECTED"|"EXPIRED"|string;
  export type ResourceShareList = ResourceShare[];
  export interface ResourceSharePermissionDetail {
    /**
     * The Amazon Resource Name (ARN) of the permission.
     */
    arn?: String;
    /**
     * The identifier for the version of the permission.
     */
    version?: String;
    /**
     * Specifies whether the version of the permission is set to the default version for this permission.
     */
    defaultVersion?: Boolean;
    /**
     * The name of the permission.
     */
    name?: String;
    /**
     * The resource type to which the permission applies.
     */
    resourceType?: String;
    /**
     * The permission's effect and actions in JSON format. The effect indicates whether the actions are allowed or denied. The actions list the API actions to which the principal is granted or denied access.
     */
    permission?: String;
    /**
     * The date and time when the permission was created.
     */
    creationTime?: DateTime;
    /**
     * The date and time when the permission was last updated.
     */
    lastUpdatedTime?: DateTime;
    /**
     * Specifies whether the version of the permission is set to the default version for this resource type.
     */
    isResourceTypeDefault?: Boolean;
  }
  export type ResourceSharePermissionList = ResourceSharePermissionSummary[];
  export interface ResourceSharePermissionSummary {
    /**
     * The Amazon Resource Name (ARN) of the permission.
     */
    arn?: String;
    /**
     * The identifier for the version of the permission.
     */
    version?: String;
    /**
     * Specifies whether the version of the permission is set to the default version for this permission.
     */
    defaultVersion?: Boolean;
    /**
     * The name of the permission.
     */
    name?: String;
    /**
     * The type of resource to which the permission applies.
     */
    resourceType?: String;
    /**
     * The current status of the permission.
     */
    status?: String;
    /**
     * The date and time when the permission was created.
     */
    creationTime?: DateTime;
    /**
     * The date and time when the permission was last updated.
     */
    lastUpdatedTime?: DateTime;
    /**
     * Specifies whether the version of the permission is set to the default version for this resource type.
     */
    isResourceTypeDefault?: Boolean;
  }
  export type ResourceShareStatus = "PENDING"|"ACTIVE"|"FAILED"|"DELETING"|"DELETED"|string;
  export type ResourceStatus = "AVAILABLE"|"ZONAL_RESOURCE_INACCESSIBLE"|"LIMIT_EXCEEDED"|"UNAVAILABLE"|"PENDING"|string;
  export interface ServiceNameAndResourceType {
    /**
     * The shareable resource types.
     */
    resourceType?: String;
    /**
     * The name of the Amazon Web Services services to which the resources belong.
     */
    serviceName?: String;
  }
  export type ServiceNameAndResourceTypeList = ServiceNameAndResourceType[];
  export type String = string;
  export interface Tag {
    /**
     * The key of the tag.
     */
    key?: TagKey;
    /**
     * The value of the tag.
     */
    value?: TagValue;
  }
  export interface TagFilter {
    /**
     * The tag key.
     */
    tagKey?: TagKey;
    /**
     * The tag values.
     */
    tagValues?: TagValueList;
  }
  export type TagFilters = TagFilter[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn: String;
    /**
     * One or more tags.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TagValueList = TagValue[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn: String;
    /**
     * The tag keys of the tags to remove.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateResourceShareRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     */
    resourceShareArn: String;
    /**
     * The name of the resource share.
     */
    name?: String;
    /**
     * Indicates whether principals outside your organization in Organizations can be associated with a resource share.
     */
    allowExternalPrincipals?: Boolean;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  export interface UpdateResourceShareResponse {
    /**
     * Information about the resource share.
     */
    resourceShare?: ResourceShare;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: String;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-01-04"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the RAM client.
   */
  export import Types = RAM;
}
export = RAM;
