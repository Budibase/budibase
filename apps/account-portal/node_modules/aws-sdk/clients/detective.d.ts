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
   * Creates a new behavior graph for the calling account, and sets that account as the administrator account. This operation is called by the account that is enabling Detective. Before you try to enable Detective, make sure that your account has been enrolled in Amazon GuardDuty for at least 48 hours. If you do not meet this requirement, you cannot enable Detective. If you do meet the GuardDuty prerequisite, then when you make the request to enable Detective, it checks whether your data volume is within the Detective quota. If it exceeds the quota, then you cannot enable Detective.  The operation also enables Detective for the calling account in the currently selected Region. It returns the ARN of the new behavior graph.  CreateGraph triggers a process to create the corresponding data tables for the new behavior graph. An account can only be the administrator account for one behavior graph within a Region. If the same account calls CreateGraph with the same administrator account, it always returns the same behavior graph ARN. It does not create a new behavior graph.
   */
  createGraph(params: Detective.Types.CreateGraphRequest, callback?: (err: AWSError, data: Detective.Types.CreateGraphResponse) => void): Request<Detective.Types.CreateGraphResponse, AWSError>;
  /**
   * Creates a new behavior graph for the calling account, and sets that account as the administrator account. This operation is called by the account that is enabling Detective. Before you try to enable Detective, make sure that your account has been enrolled in Amazon GuardDuty for at least 48 hours. If you do not meet this requirement, you cannot enable Detective. If you do meet the GuardDuty prerequisite, then when you make the request to enable Detective, it checks whether your data volume is within the Detective quota. If it exceeds the quota, then you cannot enable Detective.  The operation also enables Detective for the calling account in the currently selected Region. It returns the ARN of the new behavior graph.  CreateGraph triggers a process to create the corresponding data tables for the new behavior graph. An account can only be the administrator account for one behavior graph within a Region. If the same account calls CreateGraph with the same administrator account, it always returns the same behavior graph ARN. It does not create a new behavior graph.
   */
  createGraph(callback?: (err: AWSError, data: Detective.Types.CreateGraphResponse) => void): Request<Detective.Types.CreateGraphResponse, AWSError>;
  /**
   * Sends a request to invite the specified AWS accounts to be member accounts in the behavior graph. This operation can only be called by the administrator account for a behavior graph.   CreateMembers verifies the accounts and then invites the verified accounts. The administrator can optionally specify to not send invitation emails to the member accounts. This would be used when the administrator manages their member accounts centrally. The request provides the behavior graph ARN and the list of accounts to invite. The response separates the requested accounts into two lists:   The accounts that CreateMembers was able to start the verification for. This list includes member accounts that are being verified, that have passed verification and are to be invited, and that have failed verification.   The accounts that CreateMembers was unable to process. This list includes accounts that were already invited to be member accounts in the behavior graph.  
   */
  createMembers(params: Detective.Types.CreateMembersRequest, callback?: (err: AWSError, data: Detective.Types.CreateMembersResponse) => void): Request<Detective.Types.CreateMembersResponse, AWSError>;
  /**
   * Sends a request to invite the specified AWS accounts to be member accounts in the behavior graph. This operation can only be called by the administrator account for a behavior graph.   CreateMembers verifies the accounts and then invites the verified accounts. The administrator can optionally specify to not send invitation emails to the member accounts. This would be used when the administrator manages their member accounts centrally. The request provides the behavior graph ARN and the list of accounts to invite. The response separates the requested accounts into two lists:   The accounts that CreateMembers was able to start the verification for. This list includes member accounts that are being verified, that have passed verification and are to be invited, and that have failed verification.   The accounts that CreateMembers was unable to process. This list includes accounts that were already invited to be member accounts in the behavior graph.  
   */
  createMembers(callback?: (err: AWSError, data: Detective.Types.CreateMembersResponse) => void): Request<Detective.Types.CreateMembersResponse, AWSError>;
  /**
   * Disables the specified behavior graph and queues it to be deleted. This operation removes the graph from each member account's list of behavior graphs.  DeleteGraph can only be called by the administrator account for a behavior graph.
   */
  deleteGraph(params: Detective.Types.DeleteGraphRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables the specified behavior graph and queues it to be deleted. This operation removes the graph from each member account's list of behavior graphs.  DeleteGraph can only be called by the administrator account for a behavior graph.
   */
  deleteGraph(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes one or more member accounts from the administrator account's behavior graph. This operation can only be called by a Detective administrator account. That account cannot use DeleteMembers to delete their own account from the behavior graph. To disable a behavior graph, the administrator account uses the DeleteGraph API method.
   */
  deleteMembers(params: Detective.Types.DeleteMembersRequest, callback?: (err: AWSError, data: Detective.Types.DeleteMembersResponse) => void): Request<Detective.Types.DeleteMembersResponse, AWSError>;
  /**
   * Deletes one or more member accounts from the administrator account's behavior graph. This operation can only be called by a Detective administrator account. That account cannot use DeleteMembers to delete their own account from the behavior graph. To disable a behavior graph, the administrator account uses the DeleteGraph API method.
   */
  deleteMembers(callback?: (err: AWSError, data: Detective.Types.DeleteMembersResponse) => void): Request<Detective.Types.DeleteMembersResponse, AWSError>;
  /**
   * Removes the member account from the specified behavior graph. This operation can only be called by a member account that has the ENABLED status.
   */
  disassociateMembership(params: Detective.Types.DisassociateMembershipRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the member account from the specified behavior graph. This operation can only be called by a member account that has the ENABLED status.
   */
  disassociateMembership(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns the membership details for specified member accounts for a behavior graph.
   */
  getMembers(params: Detective.Types.GetMembersRequest, callback?: (err: AWSError, data: Detective.Types.GetMembersResponse) => void): Request<Detective.Types.GetMembersResponse, AWSError>;
  /**
   * Returns the membership details for specified member accounts for a behavior graph.
   */
  getMembers(callback?: (err: AWSError, data: Detective.Types.GetMembersResponse) => void): Request<Detective.Types.GetMembersResponse, AWSError>;
  /**
   * Returns the list of behavior graphs that the calling account is an administrator account of. This operation can only be called by an administrator account. Because an account can currently only be the administrator of one behavior graph within a Region, the results always contain a single behavior graph.
   */
  listGraphs(params: Detective.Types.ListGraphsRequest, callback?: (err: AWSError, data: Detective.Types.ListGraphsResponse) => void): Request<Detective.Types.ListGraphsResponse, AWSError>;
  /**
   * Returns the list of behavior graphs that the calling account is an administrator account of. This operation can only be called by an administrator account. Because an account can currently only be the administrator of one behavior graph within a Region, the results always contain a single behavior graph.
   */
  listGraphs(callback?: (err: AWSError, data: Detective.Types.ListGraphsResponse) => void): Request<Detective.Types.ListGraphsResponse, AWSError>;
  /**
   * Retrieves the list of open and accepted behavior graph invitations for the member account. This operation can only be called by a member account. Open invitations are invitations that the member account has not responded to. The results do not include behavior graphs for which the member account declined the invitation. The results also do not include behavior graphs that the member account resigned from or was removed from.
   */
  listInvitations(params: Detective.Types.ListInvitationsRequest, callback?: (err: AWSError, data: Detective.Types.ListInvitationsResponse) => void): Request<Detective.Types.ListInvitationsResponse, AWSError>;
  /**
   * Retrieves the list of open and accepted behavior graph invitations for the member account. This operation can only be called by a member account. Open invitations are invitations that the member account has not responded to. The results do not include behavior graphs for which the member account declined the invitation. The results also do not include behavior graphs that the member account resigned from or was removed from.
   */
  listInvitations(callback?: (err: AWSError, data: Detective.Types.ListInvitationsResponse) => void): Request<Detective.Types.ListInvitationsResponse, AWSError>;
  /**
   * Retrieves the list of member accounts for a behavior graph. Does not return member accounts that were removed from the behavior graph.
   */
  listMembers(params: Detective.Types.ListMembersRequest, callback?: (err: AWSError, data: Detective.Types.ListMembersResponse) => void): Request<Detective.Types.ListMembersResponse, AWSError>;
  /**
   * Retrieves the list of member accounts for a behavior graph. Does not return member accounts that were removed from the behavior graph.
   */
  listMembers(callback?: (err: AWSError, data: Detective.Types.ListMembersResponse) => void): Request<Detective.Types.ListMembersResponse, AWSError>;
  /**
   * Returns the tag values that are assigned to a behavior graph.
   */
  listTagsForResource(params: Detective.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Detective.Types.ListTagsForResourceResponse) => void): Request<Detective.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns the tag values that are assigned to a behavior graph.
   */
  listTagsForResource(callback?: (err: AWSError, data: Detective.Types.ListTagsForResourceResponse) => void): Request<Detective.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Rejects an invitation to contribute the account data to a behavior graph. This operation must be called by a member account that has the INVITED status.
   */
  rejectInvitation(params: Detective.Types.RejectInvitationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Rejects an invitation to contribute the account data to a behavior graph. This operation must be called by a member account that has the INVITED status.
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
     * The account identifier of the AWS account.
     */
    AccountId: AccountId;
    /**
     * The AWS account root user email address for the AWS account.
     */
    EmailAddress: EmailAddress;
  }
  export type AccountId = string;
  export type AccountIdList = AccountId[];
  export type AccountList = Account[];
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
     * The ARN of the behavior graph to invite the member accounts to contribute their data to.
     */
    GraphArn: GraphArn;
    /**
     * Customized message text to include in the invitation email message to the invited member accounts.
     */
    Message?: EmailMessage;
    /**
     * if set to true, then the member accounts do not receive email notifications. By default, this is set to false, and the member accounts receive email notifications.
     */
    DisableEmailNotification?: Boolean;
    /**
     * The list of AWS accounts to invite to become member accounts in the behavior graph. You can invite up to 50 accounts at a time. For each invited account, the account list contains the account identifier and the AWS account root user email address.
     */
    Accounts: AccountList;
  }
  export interface CreateMembersResponse {
    /**
     * The set of member account invitation requests that Detective was able to process. This includes accounts that are being verified, that failed verification, and that passed verification and are being sent an invitation.
     */
    Members?: MemberDetailList;
    /**
     * The list of accounts for which Detective was unable to process the invitation request. For each account, the list provides the reason why the request could not be processed. The list includes accounts that are already member accounts in the behavior graph.
     */
    UnprocessedAccounts?: UnprocessedAccountList;
  }
  export interface DeleteGraphRequest {
    /**
     * The ARN of the behavior graph to disable.
     */
    GraphArn: GraphArn;
  }
  export interface DeleteMembersRequest {
    /**
     * The ARN of the behavior graph to delete members from.
     */
    GraphArn: GraphArn;
    /**
     * The list of AWS account identifiers for the member accounts to delete from the behavior graph. You can delete up to 50 member accounts at a time.
     */
    AccountIds: AccountIdList;
  }
  export interface DeleteMembersResponse {
    /**
     * The list of AWS account identifiers for the member accounts that Detective successfully deleted from the behavior graph.
     */
    AccountIds?: AccountIdList;
    /**
     * The list of member accounts that Detective was not able to delete from the behavior graph. For each member account, provides the reason that the deletion could not be processed.
     */
    UnprocessedAccounts?: UnprocessedAccountList;
  }
  export interface DisassociateMembershipRequest {
    /**
     * The ARN of the behavior graph to remove the member account from. The member account's member status in the behavior graph must be ENABLED.
     */
    GraphArn: GraphArn;
  }
  export type EmailAddress = string;
  export type EmailMessage = string;
  export interface GetMembersRequest {
    /**
     * The ARN of the behavior graph for which to request the member details.
     */
    GraphArn: GraphArn;
    /**
     * The list of AWS account identifiers for the member account for which to return member details. You can request details for up to 50 member accounts at a time. You cannot use GetMembers to retrieve information about member accounts that were removed from the behavior graph.
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
     * The date and time that the behavior graph was created. The value is in milliseconds since the epoch.
     */
    CreatedTime?: Timestamp;
  }
  export type GraphArn = string;
  export type GraphList = Graph[];
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
     * The list of member accounts in the behavior graph. The results include member accounts that did not pass verification and member accounts that have not yet accepted the invitation to the behavior graph. The results do not include member accounts that were removed from the behavior graph.
     */
    MemberDetails?: MemberDetailList;
    /**
     * If there are more member accounts remaining in the results, then this is the pagination token to use to request the next page of member accounts.
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
     * The AWS account identifier for the member account.
     */
    AccountId?: AccountId;
    /**
     * The AWS account root user email address for the member account.
     */
    EmailAddress?: EmailAddress;
    /**
     * The ARN of the behavior graph that the member account was invited to.
     */
    GraphArn?: GraphArn;
    /**
     * The AWS account identifier of the administrator account for the behavior graph.
     */
    MasterId?: AccountId;
    /**
     * The AWS account identifier of the administrator account for the behavior graph.
     */
    AdministratorId?: AccountId;
    /**
     * The current membership status of the member account. The status can have one of the following values:    INVITED - Indicates that the member was sent an invitation but has not yet responded.    VERIFICATION_IN_PROGRESS - Indicates that Detective is verifying that the account identifier and email address provided for the member account match. If they do match, then Detective sends the invitation. If the email address and account identifier don't match, then the member cannot be added to the behavior graph.    VERIFICATION_FAILED - Indicates that the account and email address provided for the member account do not match, and Detective did not send an invitation to the account.    ENABLED - Indicates that the member account accepted the invitation to contribute to the behavior graph.    ACCEPTED_BUT_DISABLED - Indicates that the member account accepted the invitation but is prevented from contributing data to the behavior graph. DisabledReason provides the reason why the member account is not enabled.   Member accounts that declined an invitation or that were removed from the behavior graph are not included.
     */
    Status?: MemberStatus;
    /**
     * For member accounts with a status of ACCEPTED_BUT_DISABLED, the reason that the member account is not enabled. The reason can have one of the following values:    VOLUME_TOO_HIGH - Indicates that adding the member account would cause the data volume for the behavior graph to be too high.    VOLUME_UNKNOWN - Indicates that Detective is unable to verify the data volume for the member account. This is usually because the member account is not enrolled in Amazon GuardDuty.   
     */
    DisabledReason?: MemberDisabledReason;
    /**
     * The date and time that Detective sent the invitation to the member account. The value is in milliseconds since the epoch.
     */
    InvitedTime?: Timestamp;
    /**
     * The date and time that the member account was last updated. The value is in milliseconds since the epoch.
     */
    UpdatedTime?: Timestamp;
    /**
     * The data volume in bytes per day for the member account.
     */
    VolumeUsageInBytes?: ByteValue;
    /**
     * The data and time when the member account data volume was last updated.
     */
    VolumeUsageUpdatedTime?: Timestamp;
    /**
     * The member account data volume as a percentage of the maximum allowed data volume. 0 indicates 0 percent, and 100 indicates 100 percent. Note that this is not the percentage of the behavior graph data volume. For example, the data volume for the behavior graph is 80 GB per day. The maximum data volume is 160 GB per day. If the data volume for the member account is 40 GB per day, then PercentOfGraphUtilization is 25. It represents 25% of the maximum allowed data volume. 
     */
    PercentOfGraphUtilization?: Percentage;
    /**
     * The date and time when the graph utilization percentage was last updated.
     */
    PercentOfGraphUtilizationUpdatedTime?: Timestamp;
  }
  export type MemberDetailList = MemberDetail[];
  export type MemberDisabledReason = "VOLUME_TOO_HIGH"|"VOLUME_UNKNOWN"|string;
  export type MemberResultsLimit = number;
  export type MemberStatus = "INVITED"|"VERIFICATION_IN_PROGRESS"|"VERIFICATION_FAILED"|"ENABLED"|"ACCEPTED_BUT_DISABLED"|string;
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
  export interface UnprocessedAccount {
    /**
     * The AWS account identifier of the member account that was not processed.
     */
    AccountId?: AccountId;
    /**
     * The reason that the member account request could not be processed.
     */
    Reason?: UnprocessedReason;
  }
  export type UnprocessedAccountList = UnprocessedAccount[];
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
