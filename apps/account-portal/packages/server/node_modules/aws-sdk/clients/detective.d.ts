import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Detective extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Detective.Types.ClientConfiguration)
  config: Config & Detective.Types.ClientConfiguration;
  /**
   * Accepts an invitation for the member account to contribute data to a behavior graph. This operation can only be called by an invited member account.  The request provides the ARN of behavior graph. The member account status in the graph must be INVITED.
   */
  acceptInvitation(params: Detective.Types.AcceptInvitationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Accepts an invitation for the member account to contribute data to a behavior graph. This operation can only be called by an invited member account.  The request provides the ARN of behavior graph. The member account status in the graph must be INVITED.
   */
  acceptInvitation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets data source package information for the behavior graph.
   */
  batchGetGraphMemberDatasources(params: Detective.Types.BatchGetGraphMemberDatasourcesRequest, callback?: (err: AWSError, data: Detective.Types.BatchGetGraphMemberDatasourcesResponse) => void): Request<Detective.Types.BatchGetGraphMemberDatasourcesResponse, AWSError>;
  /**
   * Gets data source package information for the behavior graph.
   */
  batchGetGraphMemberDatasources(callback?: (err: AWSError, data: Detective.Types.BatchGetGraphMemberDatasourcesResponse) => void): Request<Detective.Types.BatchGetGraphMemberDatasourcesResponse, AWSError>;
  /**
   * Gets information on the data source package history for an account.
   */
  batchGetMembershipDatasources(params: Detective.Types.BatchGetMembershipDatasourcesRequest, callback?: (err: AWSError, data: Detective.Types.BatchGetMembershipDatasourcesResponse) => void): Request<Detective.Types.BatchGetMembershipDatasourcesResponse, AWSError>;
  /**
   * Gets information on the data source package history for an account.
   */
  batchGetMembershipDatasources(callback?: (err: AWSError, data: Detective.Types.BatchGetMembershipDatasourcesResponse) => void): Request<Detective.Types.BatchGetMembershipDatasourcesResponse, AWSError>;
  /**
   * Creates a new behavior graph for the calling account, and sets that account as the administrator account. This operation is called by the account that is enabling Detective. Before you try to enable Detective, make sure that your account has been enrolled in Amazon GuardDuty for at least 48 hours. If you do not meet this requirement, you cannot enable Detective. If you do meet the GuardDuty prerequisite, then when you make the request to enable Detective, it checks whether your data volume is within the Detective quota. If it exceeds the quota, then you cannot enable Detective.  The operation also enables Detective for the calling account in the currently selected Region. It returns the ARN of the new behavior graph.  CreateGraph triggers a process to create the corresponding data tables for the new behavior graph. An account can only be the administrator account for one behavior graph within a Region. If the same account calls CreateGraph with the same administrator account, it always returns the same behavior graph ARN. It does not create a new behavior graph.
   */
  createGraph(params: Detective.Types.CreateGraphRequest, callback?: (err: AWSError, data: Detective.Types.CreateGraphResponse) => void): Request<Detective.Types.CreateGraphResponse, AWSError>;
  /**
   * Creates a new behavior graph for the calling account, and sets that account as the administrator account. This operation is called by the account that is enabling Detective. Before you try to enable Detective, make sure that your account has been enrolled in Amazon GuardDuty for at least 48 hours. If you do not meet this requirement, you cannot enable Detective. If you do meet the GuardDuty prerequisite, then when you make the request to enable Detective, it checks whether your data volume is within the Detective quota. If it exceeds the quota, then you cannot enable Detective.  The operation also enables Detective for the calling account in the currently selected Region. It returns the ARN of the new behavior graph.  CreateGraph triggers a process to create the corresponding data tables for the new behavior graph. An account can only be the administrator account for one behavior graph within a Region. If the same account calls CreateGraph with the same administrator account, it always returns the same behavior graph ARN. It does not create a new behavior graph.
   */
  createGraph(callback?: (err: AWSError, data: Detective.Types.CreateGraphResponse) => void): Request<Detective.Types.CreateGraphResponse, AWSError>;
  /**
   *  CreateMembers is used to send invitations to accounts. For the organization behavior graph, the Detective administrator account uses CreateMembers to enable organization accounts as member accounts. For invited accounts, CreateMembers sends a request to invite the specified Amazon Web Services accounts to be member accounts in the behavior graph. This operation can only be called by the administrator account for a behavior graph.   CreateMembers verifies the accounts and then invites the verified accounts. The administrator can optionally specify to not send invitation emails to the member accounts. This would be used when the administrator manages their member accounts centrally. For organization accounts in the organization behavior graph, CreateMembers attempts to enable the accounts. The organization accounts do not receive invitations. The request provides the behavior graph ARN and the list of accounts to invite or to enable. The response separates the requested accounts into two lists:   The accounts that CreateMembers was able to process. For invited accounts, includes member accounts that are being verified, that have passed verification and are to be invited, and that have failed verification. For organization accounts in the organization behavior graph, includes accounts that can be enabled and that cannot be enabled.   The accounts that CreateMembers was unable to process. This list includes accounts that were already invited to be member accounts in the behavior graph.  
   */
  createMembers(params: Detective.Types.CreateMembersRequest, callback?: (err: AWSError, data: Detective.Types.CreateMembersResponse) => void): Request<Detective.Types.CreateMembersResponse, AWSError>;
  /**
   *  CreateMembers is used to send invitations to accounts. For the organization behavior graph, the Detective administrator account uses CreateMembers to enable organization accounts as member accounts. For invited accounts, CreateMembers sends a request to invite the specified Amazon Web Services accounts to be member accounts in the behavior graph. This operation can only be called by the administrator account for a behavior graph.   CreateMembers verifies the accounts and then invites the verified accounts. The administrator can optionally specify to not send invitation emails to the member accounts. This would be used when the administrator manages their member accounts centrally. For organization accounts in the organization behavior graph, CreateMembers attempts to enable the accounts. The organization accounts do not receive invitations. The request provides the behavior graph ARN and the list of accounts to invite or to enable. The response separates the requested accounts into two lists:   The accounts that CreateMembers was able to process. For invited accounts, includes member accounts that are being verified, that have passed verification and are to be invited, and that have failed verification. For organization accounts in the organization behavior graph, includes accounts that can be enabled and that cannot be enabled.   The accounts that CreateMembers was unable to process. This list includes accounts that were already invited to be member accounts in the behavior graph.  
   */
  createMembers(callback?: (err: AWSError, data: Detective.Types.CreateMembersResponse) => void): Request<Detective.Types.CreateMembersResponse, AWSError>;
  /**
   * Disables the specified behavior graph and queues it to be deleted. This operation removes the behavior graph from each member account's list of behavior graphs.  DeleteGraph can only be called by the administrator account for a behavior graph.
   */
  deleteGraph(params: Detective.Types.DeleteGraphRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables the specified behavior graph and queues it to be deleted. This operation removes the behavior graph from each member account's list of behavior graphs.  DeleteGraph can only be called by the administrator account for a behavior graph.
   */
  deleteGraph(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified member accounts from the behavior graph. The removed accounts no longer contribute data to the behavior graph. This operation can only be called by the administrator account for the behavior graph. For invited accounts, the removed accounts are deleted from the list of accounts in the behavior graph. To restore the account, the administrator account must send another invitation. For organization accounts in the organization behavior graph, the Detective administrator account can always enable the organization account again. Organization accounts that are not enabled as member accounts are not included in the ListMembers results for the organization behavior graph. An administrator account cannot use DeleteMembers to remove their own account from the behavior graph. To disable a behavior graph, the administrator account uses the DeleteGraph API method.
   */
  deleteMembers(params: Detective.Types.DeleteMembersRequest, callback?: (err: AWSError, data: Detective.Types.DeleteMembersResponse) => void): Request<Detective.Types.DeleteMembersResponse, AWSError>;
  /**
   * Removes the specified member accounts from the behavior graph. The removed accounts no longer contribute data to the behavior graph. This operation can only be called by the administrator account for the behavior graph. For invited accounts, the removed accounts are deleted from the list of accounts in the behavior graph. To restore the account, the administrator account must send another invitation. For organization accounts in the organization behavior graph, the Detective administrator account can always enable the organization account again. Organization accounts that are not enabled as member accounts are not included in the ListMembers results for the organization behavior graph. An administrator account cannot use DeleteMembers to remove their own account from the behavior graph. To disable a behavior graph, the administrator account uses the DeleteGraph API method.
   */
  deleteMembers(callback?: (err: AWSError, data: Detective.Types.DeleteMembersResponse) => void): Request<Detective.Types.DeleteMembersResponse, AWSError>;
  /**
   * Returns information about the configuration for the organization behavior graph. Currently indicates whether to automatically enable new organization accounts as member accounts. Can only be called by the Detective administrator account for the organization. 
   */
  describeOrganizationConfiguration(params: Detective.Types.DescribeOrganizationConfigurationRequest, callback?: (err: AWSError, data: Detective.Types.DescribeOrganizationConfigurationResponse) => void): Request<Detective.Types.DescribeOrganizationConfigurationResponse, AWSError>;
  /**
   * Returns information about the configuration for the organization behavior graph. Currently indicates whether to automatically enable new organization accounts as member accounts. Can only be called by the Detective administrator account for the organization. 
   */
  describeOrganizationConfiguration(callback?: (err: AWSError, data: Detective.Types.DescribeOrganizationConfigurationResponse) => void): Request<Detective.Types.DescribeOrganizationConfigurationResponse, AWSError>;
  /**
   * Removes the Detective administrator account in the current Region. Deletes the organization behavior graph. Can only be called by the organization management account. Removing the Detective administrator account does not affect the delegated administrator account for Detective in Organizations. To remove the delegated administrator account in Organizations, use the Organizations API. Removing the delegated administrator account also removes the Detective administrator account in all Regions, except for Regions where the Detective administrator account is the organization management account.
   */
  disableOrganizationAdminAccount(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the member account from the specified behavior graph. This operation can only be called by an invited member account that has the ENABLED status.  DisassociateMembership cannot be called by an organization account in the organization behavior graph. For the organization behavior graph, the Detective administrator account determines which organization accounts to enable or disable as member accounts.
   */
  disassociateMembership(params: Detective.Types.DisassociateMembershipRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the member account from the specified behavior graph. This operation can only be called by an invited member account that has the ENABLED status.  DisassociateMembership cannot be called by an organization account in the organization behavior graph. For the organization behavior graph, the Detective administrator account determines which organization accounts to enable or disable as member accounts.
   */
  disassociateMembership(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Designates the Detective administrator account for the organization in the current Region. If the account does not have Detective enabled, then enables Detective for that account and creates a new behavior graph. Can only be called by the organization management account. If the organization has a delegated administrator account in Organizations, then the Detective administrator account must be either the delegated administrator account or the organization management account. If the organization does not have a delegated administrator account in Organizations, then you can choose any account in the organization. If you choose an account other than the organization management account, Detective calls Organizations to make that account the delegated administrator account for Detective. The organization management account cannot be the delegated administrator account.
   */
  enableOrganizationAdminAccount(params: Detective.Types.EnableOrganizationAdminAccountRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Designates the Detective administrator account for the organization in the current Region. If the account does not have Detective enabled, then enables Detective for that account and creates a new behavior graph. Can only be called by the organization management account. If the organization has a delegated administrator account in Organizations, then the Detective administrator account must be either the delegated administrator account or the organization management account. If the organization does not have a delegated administrator account in Organizations, then you can choose any account in the organization. If you choose an account other than the organization management account, Detective calls Organizations to make that account the delegated administrator account for Detective. The organization management account cannot be the delegated administrator account.
   */
  enableOrganizationAdminAccount(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns the membership details for specified member accounts for a behavior graph.
   */
  getMembers(params: Detective.Types.GetMembersRequest, callback?: (err: AWSError, data: Detective.Types.GetMembersResponse) => void): Request<Detective.Types.GetMembersResponse, AWSError>;
  /**
   * Returns the membership details for specified member accounts for a behavior graph.
   */
  getMembers(callback?: (err: AWSError, data: Detective.Types.GetMembersResponse) => void): Request<Detective.Types.GetMembersResponse, AWSError>;
  /**
   * Lists data source packages in the behavior graph.
   */
  listDatasourcePackages(params: Detective.Types.ListDatasourcePackagesRequest, callback?: (err: AWSError, data: Detective.Types.ListDatasourcePackagesResponse) => void): Request<Detective.Types.ListDatasourcePackagesResponse, AWSError>;
  /**
   * Lists data source packages in the behavior graph.
   */
  listDatasourcePackages(callback?: (err: AWSError, data: Detective.Types.ListDatasourcePackagesResponse) => void): Request<Detective.Types.ListDatasourcePackagesResponse, AWSError>;
  /**
   * Returns the list of behavior graphs that the calling account is an administrator account of. This operation can only be called by an administrator account. Because an account can currently only be the administrator of one behavior graph within a Region, the results always contain a single behavior graph.
   */
  listGraphs(params: Detective.Types.ListGraphsRequest, callback?: (err: AWSError, data: Detective.Types.ListGraphsResponse) => void): Request<Detective.Types.ListGraphsResponse, AWSError>;
  /**
   * Returns the list of behavior graphs that the calling account is an administrator account of. This operation can only be called by an administrator account. Because an account can currently only be the administrator of one behavior graph within a Region, the results always contain a single behavior graph.
   */
  listGraphs(callback?: (err: AWSError, data: Detective.Types.ListGraphsResponse) => void): Request<Detective.Types.ListGraphsResponse, AWSError>;
  /**
   * Retrieves the list of open and accepted behavior graph invitations for the member account. This operation can only be called by an invited member account. Open invitations are invitations that the member account has not responded to. The results do not include behavior graphs for which the member account declined the invitation. The results also do not include behavior graphs that the member account resigned from or was removed from.
   */
  listInvitations(params: Detective.Types.ListInvitationsRequest, callback?: (err: AWSError, data: Detective.Types.ListInvitationsResponse) => void): Request<Detective.Types.ListInvitationsResponse, AWSError>;
  /**
   * Retrieves the list of open and accepted behavior graph invitations for the member account. This operation can only be called by an invited member account. Open invitations are invitations that the member account has not responded to. The results do not include behavior graphs for which the member account declined the invitation. The results also do not include behavior graphs that the member account resigned from or was removed from.
   */
  listInvitations(callback?: (err: AWSError, data: Detective.Types.ListInvitationsResponse) => void): Request<Detective.Types.ListInvitationsResponse, AWSError>;
  /**
   * Retrieves the list of member accounts for a behavior graph. For invited accounts, the results do not include member accounts that were removed from the behavior graph. For the organization behavior graph, the results do not include organization accounts that the Detective administrator account has not enabled as member accounts.
   */
  listMembers(params: Detective.Types.ListMembersRequest, callback?: (err: AWSError, data: Detective.Types.ListMembersResponse) => void): Request<Detective.Types.ListMembersResponse, AWSError>;
  /**
   * Retrieves the list of member accounts for a behavior graph. For invited accounts, the results do not include member accounts that were removed from the behavior graph. For the organization behavior graph, the results do not include organization accounts that the Detective administrator account has not enabled as member accounts.
   */
  listMembers(callback?: (err: AWSError, data: Detective.Types.ListMembersResponse) => void): Request<Detective.Types.ListMembersResponse, AWSError>;
  /**
   * Returns information about the Detective administrator account for an organization. Can only be called by the organization management account.
   */
  listOrganizationAdminAccounts(params: Detective.Types.ListOrganizationAdminAccountsRequest, callback?: (err: AWSError, data: Detective.Types.ListOrganizationAdminAccountsResponse) => void): Request<Detective.Types.ListOrganizationAdminAccountsResponse, AWSError>;
  /**
   * Returns information about the Detective administrator account for an organization. Can only be called by the organization management account.
   */
  listOrganizationAdminAccounts(callback?: (err: AWSError, data: Detective.Types.ListOrganizationAdminAccountsResponse) => void): Request<Detective.Types.ListOrganizationAdminAccountsResponse, AWSError>;
  /**
   * Returns the tag values that are assigned to a behavior graph.
   */
  listTagsForResource(params: Detective.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Detective.Types.ListTagsForResourceResponse) => void): Request<Detective.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns the tag values that are assigned to a behavior graph.
   */
  listTagsForResource(callback?: (err: AWSError, data: Detective.Types.ListTagsForResourceResponse) => void): Request<Detective.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Rejects an invitation to contribute the account data to a behavior graph. This operation must be called by an invited member account that has the INVITED status.  RejectInvitation cannot be called by an organization account in the organization behavior graph. In the organization behavior graph, organization accounts do not receive an invitation.
   */
  rejectInvitation(params: Detective.Types.RejectInvitationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Rejects an invitation to contribute the account data to a behavior graph. This operation must be called by an invited member account that has the INVITED status.  RejectInvitation cannot be called by an organization account in the organization behavior graph. In the organization behavior graph, organization accounts do not receive an invitation.
   */
  rejectInvitation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sends a request to enable data ingest for a member account that has a status of ACCEPTED_BUT_DISABLED. For valid member accounts, the status is updated as follows.   If Detective enabled the member account, then the new status is ENABLED.   If Detective cannot enable the member account, the status remains ACCEPTED_BUT_DISABLED.   
   */
  startMonitoringMember(params: Detective.Types.StartMonitoringMemberRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sends a request to enable data ingest for a member account that has a status of ACCEPTED_BUT_DISABLED. For valid member accounts, the status is updated as follows.   If Detective enabled the member account, then the new status is ENABLED.   If Detective cannot enable the member account, the status remains ACCEPTED_BUT_DISABLED.   
   */
  startMonitoringMember(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Applies tag values to a behavior graph.
   */
  tagResource(params: Detective.Types.TagResourceRequest, callback?: (err: AWSError, data: Detective.Types.TagResourceResponse) => void): Request<Detective.Types.TagResourceResponse, AWSError>;
  /**
   * Applies tag values to a behavior graph.
   */
  tagResource(callback?: (err: AWSError, data: Detective.Types.TagResourceResponse) => void): Request<Detective.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from a behavior graph.
   */
  untagResource(params: Detective.Types.UntagResourceRequest, callback?: (err: AWSError, data: Detective.Types.UntagResourceResponse) => void): Request<Detective.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a behavior graph.
   */
  untagResource(callback?: (err: AWSError, data: Detective.Types.UntagResourceResponse) => void): Request<Detective.Types.UntagResourceResponse, AWSError>;
  /**
   * Starts a data source packages for the behavior graph.
   */
  updateDatasourcePackages(params: Detective.Types.UpdateDatasourcePackagesRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts a data source packages for the behavior graph.
   */
  updateDatasourcePackages(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the configuration for the Organizations integration in the current Region. Can only be called by the Detective administrator account for the organization.
   */
  updateOrganizationConfiguration(params: Detective.Types.UpdateOrganizationConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the configuration for the Organizations integration in the current Region. Can only be called by the Detective administrator account for the organization.
   */
  updateOrganizationConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace Detective {
  export interface AcceptInvitationRequest {
    /**
     * The ARN of the behavior graph that the member account is accepting the invitation for. The member account status in the behavior graph must be INVITED.
     */
    GraphArn: GraphArn;
  }
  export interface Account {
    /**
     * The account identifier of the Amazon Web Services account.
     */
    AccountId: AccountId;
    /**
     * The Amazon Web Services account root user email address for the Amazon Web Services account.
     */
    EmailAddress: EmailAddress;
  }
  export type AccountId = string;
  export type AccountIdExtendedList = AccountId[];
  export type AccountIdList = AccountId[];
  export type AccountList = Account[];
  export interface Administrator {
    /**
     * The Amazon Web Services account identifier of the Detective administrator account for the organization.
     */
    AccountId?: AccountId;
    /**
     * The ARN of the organization behavior graph.
     */
    GraphArn?: GraphArn;
    /**
     * The date and time when the Detective administrator account was enabled. The value is an ISO8601 formatted string. For example, 2021-08-18T16:35:56.284Z.
     */
    DelegationTime?: Timestamp;
  }
  export type AdministratorList = Administrator[];
  export interface BatchGetGraphMemberDatasourcesRequest {
    /**
     * The ARN of the behavior graph.
     */
    GraphArn: GraphArn;
    /**
     * The list of Amazon Web Services accounts to get data source package information on.
     */
    AccountIds: AccountIdExtendedList;
  }
  export interface BatchGetGraphMemberDatasourcesResponse {
    /**
     * Details on the status of data source packages for members of the behavior graph.
     */
    MemberDatasources?: MembershipDatasourcesList;
    /**
     * Accounts that data source package information could not be retrieved for.
     */
    UnprocessedAccounts?: UnprocessedAccountList;
  }
  export interface BatchGetMembershipDatasourcesRequest {
    /**
     * The ARN of the behavior graph.
     */
    GraphArns: GraphArnList;
  }
  export interface BatchGetMembershipDatasourcesResponse {
    /**
     * Details on the data source package history for an member of the behavior graph.
     */
    MembershipDatasources?: MembershipDatasourcesList;
    /**
     * Graphs that data source package information could not be retrieved for.
     */
    UnprocessedGraphs?: UnprocessedGraphList;
  }
  export type Boolean = boolean;
  export type ByteValue = number;
  export interface CreateGraphRequest {
    /**
     * The tags to assign to the new behavior graph. You can add up to 50 tags. For each tag, you provide the tag key and the tag value. Each tag key can contain up to 128 characters. Each tag value can contain up to 256 characters.
     */
    Tags?: TagMap;
  }
  export interface CreateGraphResponse {
    /**
     * The ARN of the new behavior graph.
     */
    GraphArn?: GraphArn;
  }
  export interface CreateMembersRequest {
    /**
     * The ARN of the behavior graph.
     */
    GraphArn: GraphArn;
    /**
     * Customized message text to include in the invitation email message to the invited member accounts.
     */
    Message?: EmailMessage;
    /**
     * if set to true, then the invited accounts do not receive email notifications. By default, this is set to false, and the invited accounts receive email notifications. Organization accounts in the organization behavior graph do not receive email notifications.
     */
    DisableEmailNotification?: Boolean;
    /**
     * The list of Amazon Web Services accounts to invite or to enable. You can invite or enable up to 50 accounts at a time. For each invited account, the account list contains the account identifier and the Amazon Web Services account root user email address. For organization accounts in the organization behavior graph, the email address is not required.
     */
    Accounts: AccountList;
  }
  export interface CreateMembersResponse {
    /**
     * The set of member account invitation or enablement requests that Detective was able to process. This includes accounts that are being verified, that failed verification, and that passed verification and are being sent an invitation or are being enabled.
     */
    Members?: MemberDetailList;
    /**
     * The list of accounts for which Detective was unable to process the invitation or enablement request. For each account, the list provides the reason why the request could not be processed. The list includes accounts that are already member accounts in the behavior graph.
     */
    UnprocessedAccounts?: UnprocessedAccountList;
  }
  export type DatasourcePackage = "DETECTIVE_CORE"|"EKS_AUDIT"|"ASFF_SECURITYHUB_FINDING"|string;
  export interface DatasourcePackageIngestDetail {
    /**
     * Details on which data source packages are ingested for a member account.
     */
    DatasourcePackageIngestState?: DatasourcePackageIngestState;
    /**
     * The date a data source package was enabled for this account
     */
    LastIngestStateChange?: LastIngestStateChangeDates;
  }
  export type DatasourcePackageIngestDetails = {[key: string]: DatasourcePackageIngestDetail};
  export type DatasourcePackageIngestHistory = {[key: string]: LastIngestStateChangeDates};
  export type DatasourcePackageIngestState = "STARTED"|"STOPPED"|"DISABLED"|string;
  export type DatasourcePackageIngestStates = {[key: string]: DatasourcePackageIngestState};
  export type DatasourcePackageList = DatasourcePackage[];
  export interface DatasourcePackageUsageInfo {
    /**
     * Total volume of data in bytes per day ingested for a given data source package.
     */
    VolumeUsageInBytes?: ByteValue;
    /**
     * The data and time when the member account data volume was last updated. The value is an ISO8601 formatted string. For example, 2021-08-18T16:35:56.284Z.
     */
    VolumeUsageUpdateTime?: Timestamp;
  }
  export interface DeleteGraphRequest {
    /**
     * The ARN of the behavior graph to disable.
     */
    GraphArn: GraphArn;
  }
  export interface DeleteMembersRequest {
    /**
     * The ARN of the behavior graph to remove members from.
     */
    GraphArn: GraphArn;
    /**
     * The list of Amazon Web Services account identifiers for the member accounts to remove from the behavior graph. You can remove up to 50 member accounts at a time.
     */
    AccountIds: AccountIdList;
  }
  export interface DeleteMembersResponse {
    /**
     * The list of Amazon Web Services account identifiers for the member accounts that Detective successfully removed from the behavior graph.
     */
    AccountIds?: AccountIdList;
    /**
     * The list of member accounts that Detective was not able to remove from the behavior graph. For each member account, provides the reason that the deletion could not be processed.
     */
    UnprocessedAccounts?: UnprocessedAccountList;
  }
  export interface DescribeOrganizationConfigurationRequest {
    /**
     * The ARN of the organization behavior graph.
     */
    GraphArn: GraphArn;
  }
  export interface DescribeOrganizationConfigurationResponse {
    /**
     * Indicates whether to automatically enable new organization accounts as member accounts in the organization behavior graph.
     */
    AutoEnable?: Boolean;
  }
  export interface DisassociateMembershipRequest {
    /**
     * The ARN of the behavior graph to remove the member account from. The member account's member status in the behavior graph must be ENABLED.
     */
    GraphArn: GraphArn;
  }
  export type EmailAddress = string;
  export type EmailMessage = string;
  export interface EnableOrganizationAdminAccountRequest {
    /**
     * The Amazon Web Services account identifier of the account to designate as the Detective administrator account for the organization.
     */
    AccountId: AccountId;
  }
  export interface GetMembersRequest {
    /**
     * The ARN of the behavior graph for which to request the member details.
     */
    GraphArn: GraphArn;
    /**
     * The list of Amazon Web Services account identifiers for the member account for which to return member details. You can request details for up to 50 member accounts at a time. You cannot use GetMembers to retrieve information about member accounts that were removed from the behavior graph.
     */
    AccountIds: AccountIdList;
  }
  export interface GetMembersResponse {
    /**
     * The member account details that Detective is returning in response to the request.
     */
    MemberDetails?: MemberDetailList;
    /**
     * The requested member accounts for which Detective was unable to return member details. For each account, provides the reason why the request could not be processed.
     */
    UnprocessedAccounts?: UnprocessedAccountList;
  }
  export interface Graph {
    /**
     * The ARN of the behavior graph.
     */
    Arn?: GraphArn;
    /**
     * The date and time that the behavior graph was created. The value is an ISO8601 formatted string. For example, 2021-08-18T16:35:56.284Z.
     */
    CreatedTime?: Timestamp;
  }
  export type GraphArn = string;
  export type GraphArnList = GraphArn[];
  export type GraphList = Graph[];
  export type InvitationType = "INVITATION"|"ORGANIZATION"|string;
  export type LastIngestStateChangeDates = {[key: string]: TimestampForCollection};
  export interface ListDatasourcePackagesRequest {
    /**
     * The ARN of the behavior graph.
     */
    GraphArn: GraphArn;
    /**
     * For requests to get the next page of results, the pagination token that was returned with the previous set of results. The initial request does not include a pagination token.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MemberResultsLimit;
  }
  export interface ListDatasourcePackagesResponse {
    /**
     * Details on the data source packages active in the behavior graph.
     */
    DatasourcePackages?: DatasourcePackageIngestDetails;
    /**
     * For requests to get the next page of results, the pagination token that was returned with the previous set of results. The initial request does not include a pagination token.
     */
    NextToken?: PaginationToken;
  }
  export interface ListGraphsRequest {
    /**
     * For requests to get the next page of results, the pagination token that was returned with the previous set of results. The initial request does not include a pagination token.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of graphs to return at a time. The total must be less than the overall limit on the number of results to return, which is currently 200.
     */
    MaxResults?: MemberResultsLimit;
  }
  export interface ListGraphsResponse {
    /**
     * A list of behavior graphs that the account is an administrator account for.
     */
    GraphList?: GraphList;
    /**
     * If there are more behavior graphs remaining in the results, then this is the pagination token to use to request the next page of behavior graphs.
     */
    NextToken?: PaginationToken;
  }
  export interface ListInvitationsRequest {
    /**
     * For requests to retrieve the next page of results, the pagination token that was returned with the previous page of results. The initial request does not include a pagination token.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of behavior graph invitations to return in the response. The total must be less than the overall limit on the number of results to return, which is currently 200.
     */
    MaxResults?: MemberResultsLimit;
  }
  export interface ListInvitationsResponse {
    /**
     * The list of behavior graphs for which the member account has open or accepted invitations.
     */
    Invitations?: MemberDetailList;
    /**
     * If there are more behavior graphs remaining in the results, then this is the pagination token to use to request the next page of behavior graphs.
     */
    NextToken?: PaginationToken;
  }
  export interface ListMembersRequest {
    /**
     * The ARN of the behavior graph for which to retrieve the list of member accounts.
     */
    GraphArn: GraphArn;
    /**
     * For requests to retrieve the next page of member account results, the pagination token that was returned with the previous page of results. The initial request does not include a pagination token.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of member accounts to include in the response. The total must be less than the overall limit on the number of results to return, which is currently 200.
     */
    MaxResults?: MemberResultsLimit;
  }
  export interface ListMembersResponse {
    /**
     * The list of member accounts in the behavior graph. For invited accounts, the results include member accounts that did not pass verification and member accounts that have not yet accepted the invitation to the behavior graph. The results do not include member accounts that were removed from the behavior graph. For the organization behavior graph, the results do not include organization accounts that the Detective administrator account has not enabled as member accounts.
     */
    MemberDetails?: MemberDetailList;
    /**
     * If there are more member accounts remaining in the results, then use this pagination token to request the next page of member accounts.
     */
    NextToken?: PaginationToken;
  }
  export interface ListOrganizationAdminAccountsRequest {
    /**
     * For requests to get the next page of results, the pagination token that was returned with the previous set of results. The initial request does not include a pagination token.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MemberResultsLimit;
  }
  export interface ListOrganizationAdminAccountsResponse {
    /**
     * The list of Detective administrator accounts.
     */
    Administrators?: AdministratorList;
    /**
     * If there are more accounts remaining in the results, then this is the pagination token to use to request the next page of accounts.
     */
    NextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the behavior graph for which to retrieve the tag values.
     */
    ResourceArn: GraphArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tag values that are assigned to the behavior graph. The request returns up to 50 tag values.
     */
    Tags?: TagMap;
  }
  export interface MemberDetail {
    /**
     * The Amazon Web Services account identifier for the member account.
     */
    AccountId?: AccountId;
    /**
     * The Amazon Web Services account root user email address for the member account.
     */
    EmailAddress?: EmailAddress;
    /**
     * The ARN of the behavior graph.
     */
    GraphArn?: GraphArn;
    /**
     * The Amazon Web Services account identifier of the administrator account for the behavior graph.
     */
    MasterId?: AccountId;
    /**
     * The Amazon Web Services account identifier of the administrator account for the behavior graph.
     */
    AdministratorId?: AccountId;
    /**
     * The current membership status of the member account. The status can have one of the following values:    INVITED - For invited accounts only. Indicates that the member was sent an invitation but has not yet responded.    VERIFICATION_IN_PROGRESS - For invited accounts only, indicates that Detective is verifying that the account identifier and email address provided for the member account match. If they do match, then Detective sends the invitation. If the email address and account identifier don't match, then the member cannot be added to the behavior graph. For organization accounts in the organization behavior graph, indicates that Detective is verifying that the account belongs to the organization.    VERIFICATION_FAILED - For invited accounts only. Indicates that the account and email address provided for the member account do not match, and Detective did not send an invitation to the account.    ENABLED - Indicates that the member account currently contributes data to the behavior graph. For invited accounts, the member account accepted the invitation. For organization accounts in the organization behavior graph, the Detective administrator account enabled the organization account as a member account.    ACCEPTED_BUT_DISABLED - The account accepted the invitation, or was enabled by the Detective administrator account, but is prevented from contributing data to the behavior graph. DisabledReason provides the reason why the member account is not enabled.   Invited accounts that declined an invitation or that were removed from the behavior graph are not included. In the organization behavior graph, organization accounts that the Detective administrator account did not enable are not included.
     */
    Status?: MemberStatus;
    /**
     * For member accounts with a status of ACCEPTED_BUT_DISABLED, the reason that the member account is not enabled. The reason can have one of the following values:    VOLUME_TOO_HIGH - Indicates that adding the member account would cause the data volume for the behavior graph to be too high.    VOLUME_UNKNOWN - Indicates that Detective is unable to verify the data volume for the member account. This is usually because the member account is not enrolled in Amazon GuardDuty.   
     */
    DisabledReason?: MemberDisabledReason;
    /**
     * For invited accounts, the date and time that Detective sent the invitation to the account. The value is an ISO8601 formatted string. For example, 2021-08-18T16:35:56.284Z.
     */
    InvitedTime?: Timestamp;
    /**
     * The date and time that the member account was last updated. The value is an ISO8601 formatted string. For example, 2021-08-18T16:35:56.284Z.
     */
    UpdatedTime?: Timestamp;
    /**
     * The data volume in bytes per day for the member account.
     */
    VolumeUsageInBytes?: ByteValue;
    /**
     * The data and time when the member account data volume was last updated. The value is an ISO8601 formatted string. For example, 2021-08-18T16:35:56.284Z.
     */
    VolumeUsageUpdatedTime?: Timestamp;
    /**
     * The member account data volume as a percentage of the maximum allowed data volume. 0 indicates 0 percent, and 100 indicates 100 percent. Note that this is not the percentage of the behavior graph data volume. For example, the data volume for the behavior graph is 80 GB per day. The maximum data volume is 160 GB per day. If the data volume for the member account is 40 GB per day, then PercentOfGraphUtilization is 25. It represents 25% of the maximum allowed data volume. 
     */
    PercentOfGraphUtilization?: Percentage;
    /**
     * The date and time when the graph utilization percentage was last updated. The value is an ISO8601 formatted string. For example, 2021-08-18T16:35:56.284Z.
     */
    PercentOfGraphUtilizationUpdatedTime?: Timestamp;
    /**
     * The type of behavior graph membership. For an organization account in the organization behavior graph, the type is ORGANIZATION. For an account that was invited to a behavior graph, the type is INVITATION. 
     */
    InvitationType?: InvitationType;
    /**
     * Details on the volume of usage for each data source package in a behavior graph.
     */
    VolumeUsageByDatasourcePackage?: VolumeUsageByDatasourcePackage;
    /**
     * The state of a data source package for the behavior graph.
     */
    DatasourcePackageIngestStates?: DatasourcePackageIngestStates;
  }
  export type MemberDetailList = MemberDetail[];
  export type MemberDisabledReason = "VOLUME_TOO_HIGH"|"VOLUME_UNKNOWN"|string;
  export type MemberResultsLimit = number;
  export type MemberStatus = "INVITED"|"VERIFICATION_IN_PROGRESS"|"VERIFICATION_FAILED"|"ENABLED"|"ACCEPTED_BUT_DISABLED"|string;
  export interface MembershipDatasources {
    /**
     * The account identifier of the Amazon Web Services account.
     */
    AccountId?: AccountId;
    /**
     * The ARN of the organization behavior graph.
     */
    GraphArn?: GraphArn;
    /**
     * Details on when a data source package was added to a behavior graph.
     */
    DatasourcePackageIngestHistory?: DatasourcePackageIngestHistory;
  }
  export type MembershipDatasourcesList = MembershipDatasources[];
  export type PaginationToken = string;
  export type Percentage = number;
  export interface RejectInvitationRequest {
    /**
     * The ARN of the behavior graph to reject the invitation to. The member account's current member status in the behavior graph must be INVITED.
     */
    GraphArn: GraphArn;
  }
  export interface StartMonitoringMemberRequest {
    /**
     * The ARN of the behavior graph.
     */
    GraphArn: GraphArn;
    /**
     * The account ID of the member account to try to enable. The account must be an invited member account with a status of ACCEPTED_BUT_DISABLED. 
     */
    AccountId: AccountId;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the behavior graph to assign the tags to.
     */
    ResourceArn: GraphArn;
    /**
     * The tags to assign to the behavior graph. You can add up to 50 tags. For each tag, you provide the tag key and the tag value. Each tag key can contain up to 128 characters. Each tag value can contain up to 256 characters.
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface TimestampForCollection {
    /**
     * The data and time when data collection began for a source package. The value is an ISO8601 formatted string. For example, 2021-08-18T16:35:56.284Z.
     */
    Timestamp?: Timestamp;
  }
  export interface UnprocessedAccount {
    /**
     * The Amazon Web Services account identifier of the member account that was not processed.
     */
    AccountId?: AccountId;
    /**
     * The reason that the member account request could not be processed.
     */
    Reason?: UnprocessedReason;
  }
  export type UnprocessedAccountList = UnprocessedAccount[];
  export interface UnprocessedGraph {
    /**
     * The ARN of the organization behavior graph.
     */
    GraphArn?: GraphArn;
    /**
     * The reason data source package information could not be processed for a behavior graph.
     */
    Reason?: UnprocessedReason;
  }
  export type UnprocessedGraphList = UnprocessedGraph[];
  export type UnprocessedReason = string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the behavior graph to remove the tags from.
     */
    ResourceArn: GraphArn;
    /**
     * The tag keys of the tags to remove from the behavior graph. You can remove up to 50 tags at a time.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDatasourcePackagesRequest {
    /**
     * The ARN of the behavior graph.
     */
    GraphArn: GraphArn;
    /**
     * The data source package start for the behavior graph.
     */
    DatasourcePackages: DatasourcePackageList;
  }
  export interface UpdateOrganizationConfigurationRequest {
    /**
     * The ARN of the organization behavior graph.
     */
    GraphArn: GraphArn;
    /**
     * Indicates whether to automatically enable new organization accounts as member accounts in the organization behavior graph.
     */
    AutoEnable?: Boolean;
  }
  export type VolumeUsageByDatasourcePackage = {[key: string]: DatasourcePackageUsageInfo};
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-10-26"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Detective client.
   */
  export import Types = Detective;
}
export = Detective;
