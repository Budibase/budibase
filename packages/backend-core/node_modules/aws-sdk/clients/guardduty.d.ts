import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class GuardDuty extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: GuardDuty.Types.ClientConfiguration)
  config: Config & GuardDuty.Types.ClientConfiguration;
  /**
   * Accepts the invitation to be monitored by a GuardDuty administrator account.
   */
  acceptInvitation(params: GuardDuty.Types.AcceptInvitationRequest, callback?: (err: AWSError, data: GuardDuty.Types.AcceptInvitationResponse) => void): Request<GuardDuty.Types.AcceptInvitationResponse, AWSError>;
  /**
   * Accepts the invitation to be monitored by a GuardDuty administrator account.
   */
  acceptInvitation(callback?: (err: AWSError, data: GuardDuty.Types.AcceptInvitationResponse) => void): Request<GuardDuty.Types.AcceptInvitationResponse, AWSError>;
  /**
   * Archives GuardDuty findings that are specified by the list of finding IDs.  Only the administrator account can archive findings. Member accounts don't have permission to archive findings from their accounts. 
   */
  archiveFindings(params: GuardDuty.Types.ArchiveFindingsRequest, callback?: (err: AWSError, data: GuardDuty.Types.ArchiveFindingsResponse) => void): Request<GuardDuty.Types.ArchiveFindingsResponse, AWSError>;
  /**
   * Archives GuardDuty findings that are specified by the list of finding IDs.  Only the administrator account can archive findings. Member accounts don't have permission to archive findings from their accounts. 
   */
  archiveFindings(callback?: (err: AWSError, data: GuardDuty.Types.ArchiveFindingsResponse) => void): Request<GuardDuty.Types.ArchiveFindingsResponse, AWSError>;
  /**
   * Creates a single Amazon GuardDuty detector. A detector is a resource that represents the GuardDuty service. To start using GuardDuty, you must create a detector in each Region where you enable the service. You can have only one detector per account per Region. All data sources are enabled in a new detector by default.
   */
  createDetector(params: GuardDuty.Types.CreateDetectorRequest, callback?: (err: AWSError, data: GuardDuty.Types.CreateDetectorResponse) => void): Request<GuardDuty.Types.CreateDetectorResponse, AWSError>;
  /**
   * Creates a single Amazon GuardDuty detector. A detector is a resource that represents the GuardDuty service. To start using GuardDuty, you must create a detector in each Region where you enable the service. You can have only one detector per account per Region. All data sources are enabled in a new detector by default.
   */
  createDetector(callback?: (err: AWSError, data: GuardDuty.Types.CreateDetectorResponse) => void): Request<GuardDuty.Types.CreateDetectorResponse, AWSError>;
  /**
   * Creates a filter using the specified finding criteria.
   */
  createFilter(params: GuardDuty.Types.CreateFilterRequest, callback?: (err: AWSError, data: GuardDuty.Types.CreateFilterResponse) => void): Request<GuardDuty.Types.CreateFilterResponse, AWSError>;
  /**
   * Creates a filter using the specified finding criteria.
   */
  createFilter(callback?: (err: AWSError, data: GuardDuty.Types.CreateFilterResponse) => void): Request<GuardDuty.Types.CreateFilterResponse, AWSError>;
  /**
   * Creates a new IPSet, which is called a trusted IP list in the console user interface. An IPSet is a list of IP addresses that are trusted for secure communication with AWS infrastructure and applications. GuardDuty doesn't generate findings for IP addresses that are included in IPSets. Only users from the administrator account can use this operation.
   */
  createIPSet(params: GuardDuty.Types.CreateIPSetRequest, callback?: (err: AWSError, data: GuardDuty.Types.CreateIPSetResponse) => void): Request<GuardDuty.Types.CreateIPSetResponse, AWSError>;
  /**
   * Creates a new IPSet, which is called a trusted IP list in the console user interface. An IPSet is a list of IP addresses that are trusted for secure communication with AWS infrastructure and applications. GuardDuty doesn't generate findings for IP addresses that are included in IPSets. Only users from the administrator account can use this operation.
   */
  createIPSet(callback?: (err: AWSError, data: GuardDuty.Types.CreateIPSetResponse) => void): Request<GuardDuty.Types.CreateIPSetResponse, AWSError>;
  /**
   * Creates member accounts of the current AWS account by specifying a list of AWS account IDs. This step is a prerequisite for managing the associated member accounts either by invitation or through an organization. When using Create Members as an organizations delegated administrator this action will enable GuardDuty in the added member accounts, with the exception of the organization delegated administrator account, which must enable GuardDuty prior to being added as a member. If you are adding accounts by invitation use this action after GuardDuty has been enabled in potential member accounts and before using  Invite Members .
   */
  createMembers(params: GuardDuty.Types.CreateMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.CreateMembersResponse) => void): Request<GuardDuty.Types.CreateMembersResponse, AWSError>;
  /**
   * Creates member accounts of the current AWS account by specifying a list of AWS account IDs. This step is a prerequisite for managing the associated member accounts either by invitation or through an organization. When using Create Members as an organizations delegated administrator this action will enable GuardDuty in the added member accounts, with the exception of the organization delegated administrator account, which must enable GuardDuty prior to being added as a member. If you are adding accounts by invitation use this action after GuardDuty has been enabled in potential member accounts and before using  Invite Members .
   */
  createMembers(callback?: (err: AWSError, data: GuardDuty.Types.CreateMembersResponse) => void): Request<GuardDuty.Types.CreateMembersResponse, AWSError>;
  /**
   * Creates a publishing destination to export findings to. The resource to export findings to must exist before you use this operation.
   */
  createPublishingDestination(params: GuardDuty.Types.CreatePublishingDestinationRequest, callback?: (err: AWSError, data: GuardDuty.Types.CreatePublishingDestinationResponse) => void): Request<GuardDuty.Types.CreatePublishingDestinationResponse, AWSError>;
  /**
   * Creates a publishing destination to export findings to. The resource to export findings to must exist before you use this operation.
   */
  createPublishingDestination(callback?: (err: AWSError, data: GuardDuty.Types.CreatePublishingDestinationResponse) => void): Request<GuardDuty.Types.CreatePublishingDestinationResponse, AWSError>;
  /**
   * Generates example findings of types specified by the list of finding types. If 'NULL' is specified for findingTypes, the API generates example findings of all supported finding types.
   */
  createSampleFindings(params: GuardDuty.Types.CreateSampleFindingsRequest, callback?: (err: AWSError, data: GuardDuty.Types.CreateSampleFindingsResponse) => void): Request<GuardDuty.Types.CreateSampleFindingsResponse, AWSError>;
  /**
   * Generates example findings of types specified by the list of finding types. If 'NULL' is specified for findingTypes, the API generates example findings of all supported finding types.
   */
  createSampleFindings(callback?: (err: AWSError, data: GuardDuty.Types.CreateSampleFindingsResponse) => void): Request<GuardDuty.Types.CreateSampleFindingsResponse, AWSError>;
  /**
   * Creates a new ThreatIntelSet. ThreatIntelSets consist of known malicious IP addresses. GuardDuty generates findings based on ThreatIntelSets. Only users of the administrator account can use this operation.
   */
  createThreatIntelSet(params: GuardDuty.Types.CreateThreatIntelSetRequest, callback?: (err: AWSError, data: GuardDuty.Types.CreateThreatIntelSetResponse) => void): Request<GuardDuty.Types.CreateThreatIntelSetResponse, AWSError>;
  /**
   * Creates a new ThreatIntelSet. ThreatIntelSets consist of known malicious IP addresses. GuardDuty generates findings based on ThreatIntelSets. Only users of the administrator account can use this operation.
   */
  createThreatIntelSet(callback?: (err: AWSError, data: GuardDuty.Types.CreateThreatIntelSetResponse) => void): Request<GuardDuty.Types.CreateThreatIntelSetResponse, AWSError>;
  /**
   * Declines invitations sent to the current member account by AWS accounts specified by their account IDs.
   */
  declineInvitations(params: GuardDuty.Types.DeclineInvitationsRequest, callback?: (err: AWSError, data: GuardDuty.Types.DeclineInvitationsResponse) => void): Request<GuardDuty.Types.DeclineInvitationsResponse, AWSError>;
  /**
   * Declines invitations sent to the current member account by AWS accounts specified by their account IDs.
   */
  declineInvitations(callback?: (err: AWSError, data: GuardDuty.Types.DeclineInvitationsResponse) => void): Request<GuardDuty.Types.DeclineInvitationsResponse, AWSError>;
  /**
   * Deletes an Amazon GuardDuty detector that is specified by the detector ID.
   */
  deleteDetector(params: GuardDuty.Types.DeleteDetectorRequest, callback?: (err: AWSError, data: GuardDuty.Types.DeleteDetectorResponse) => void): Request<GuardDuty.Types.DeleteDetectorResponse, AWSError>;
  /**
   * Deletes an Amazon GuardDuty detector that is specified by the detector ID.
   */
  deleteDetector(callback?: (err: AWSError, data: GuardDuty.Types.DeleteDetectorResponse) => void): Request<GuardDuty.Types.DeleteDetectorResponse, AWSError>;
  /**
   * Deletes the filter specified by the filter name.
   */
  deleteFilter(params: GuardDuty.Types.DeleteFilterRequest, callback?: (err: AWSError, data: GuardDuty.Types.DeleteFilterResponse) => void): Request<GuardDuty.Types.DeleteFilterResponse, AWSError>;
  /**
   * Deletes the filter specified by the filter name.
   */
  deleteFilter(callback?: (err: AWSError, data: GuardDuty.Types.DeleteFilterResponse) => void): Request<GuardDuty.Types.DeleteFilterResponse, AWSError>;
  /**
   * Deletes the IPSet specified by the ipSetId. IPSets are called trusted IP lists in the console user interface.
   */
  deleteIPSet(params: GuardDuty.Types.DeleteIPSetRequest, callback?: (err: AWSError, data: GuardDuty.Types.DeleteIPSetResponse) => void): Request<GuardDuty.Types.DeleteIPSetResponse, AWSError>;
  /**
   * Deletes the IPSet specified by the ipSetId. IPSets are called trusted IP lists in the console user interface.
   */
  deleteIPSet(callback?: (err: AWSError, data: GuardDuty.Types.DeleteIPSetResponse) => void): Request<GuardDuty.Types.DeleteIPSetResponse, AWSError>;
  /**
   * Deletes invitations sent to the current member account by AWS accounts specified by their account IDs.
   */
  deleteInvitations(params: GuardDuty.Types.DeleteInvitationsRequest, callback?: (err: AWSError, data: GuardDuty.Types.DeleteInvitationsResponse) => void): Request<GuardDuty.Types.DeleteInvitationsResponse, AWSError>;
  /**
   * Deletes invitations sent to the current member account by AWS accounts specified by their account IDs.
   */
  deleteInvitations(callback?: (err: AWSError, data: GuardDuty.Types.DeleteInvitationsResponse) => void): Request<GuardDuty.Types.DeleteInvitationsResponse, AWSError>;
  /**
   * Deletes GuardDuty member accounts (to the current GuardDuty administrator account) specified by the account IDs.
   */
  deleteMembers(params: GuardDuty.Types.DeleteMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.DeleteMembersResponse) => void): Request<GuardDuty.Types.DeleteMembersResponse, AWSError>;
  /**
   * Deletes GuardDuty member accounts (to the current GuardDuty administrator account) specified by the account IDs.
   */
  deleteMembers(callback?: (err: AWSError, data: GuardDuty.Types.DeleteMembersResponse) => void): Request<GuardDuty.Types.DeleteMembersResponse, AWSError>;
  /**
   * Deletes the publishing definition with the specified destinationId.
   */
  deletePublishingDestination(params: GuardDuty.Types.DeletePublishingDestinationRequest, callback?: (err: AWSError, data: GuardDuty.Types.DeletePublishingDestinationResponse) => void): Request<GuardDuty.Types.DeletePublishingDestinationResponse, AWSError>;
  /**
   * Deletes the publishing definition with the specified destinationId.
   */
  deletePublishingDestination(callback?: (err: AWSError, data: GuardDuty.Types.DeletePublishingDestinationResponse) => void): Request<GuardDuty.Types.DeletePublishingDestinationResponse, AWSError>;
  /**
   * Deletes the ThreatIntelSet specified by the ThreatIntelSet ID.
   */
  deleteThreatIntelSet(params: GuardDuty.Types.DeleteThreatIntelSetRequest, callback?: (err: AWSError, data: GuardDuty.Types.DeleteThreatIntelSetResponse) => void): Request<GuardDuty.Types.DeleteThreatIntelSetResponse, AWSError>;
  /**
   * Deletes the ThreatIntelSet specified by the ThreatIntelSet ID.
   */
  deleteThreatIntelSet(callback?: (err: AWSError, data: GuardDuty.Types.DeleteThreatIntelSetResponse) => void): Request<GuardDuty.Types.DeleteThreatIntelSetResponse, AWSError>;
  /**
   * Returns information about the account selected as the delegated administrator for GuardDuty.
   */
  describeOrganizationConfiguration(params: GuardDuty.Types.DescribeOrganizationConfigurationRequest, callback?: (err: AWSError, data: GuardDuty.Types.DescribeOrganizationConfigurationResponse) => void): Request<GuardDuty.Types.DescribeOrganizationConfigurationResponse, AWSError>;
  /**
   * Returns information about the account selected as the delegated administrator for GuardDuty.
   */
  describeOrganizationConfiguration(callback?: (err: AWSError, data: GuardDuty.Types.DescribeOrganizationConfigurationResponse) => void): Request<GuardDuty.Types.DescribeOrganizationConfigurationResponse, AWSError>;
  /**
   * Returns information about the publishing destination specified by the provided destinationId.
   */
  describePublishingDestination(params: GuardDuty.Types.DescribePublishingDestinationRequest, callback?: (err: AWSError, data: GuardDuty.Types.DescribePublishingDestinationResponse) => void): Request<GuardDuty.Types.DescribePublishingDestinationResponse, AWSError>;
  /**
   * Returns information about the publishing destination specified by the provided destinationId.
   */
  describePublishingDestination(callback?: (err: AWSError, data: GuardDuty.Types.DescribePublishingDestinationResponse) => void): Request<GuardDuty.Types.DescribePublishingDestinationResponse, AWSError>;
  /**
   * Disables an AWS account within the Organization as the GuardDuty delegated administrator.
   */
  disableOrganizationAdminAccount(params: GuardDuty.Types.DisableOrganizationAdminAccountRequest, callback?: (err: AWSError, data: GuardDuty.Types.DisableOrganizationAdminAccountResponse) => void): Request<GuardDuty.Types.DisableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Disables an AWS account within the Organization as the GuardDuty delegated administrator.
   */
  disableOrganizationAdminAccount(callback?: (err: AWSError, data: GuardDuty.Types.DisableOrganizationAdminAccountResponse) => void): Request<GuardDuty.Types.DisableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Disassociates the current GuardDuty member account from its administrator account.
   */
  disassociateFromMasterAccount(params: GuardDuty.Types.DisassociateFromMasterAccountRequest, callback?: (err: AWSError, data: GuardDuty.Types.DisassociateFromMasterAccountResponse) => void): Request<GuardDuty.Types.DisassociateFromMasterAccountResponse, AWSError>;
  /**
   * Disassociates the current GuardDuty member account from its administrator account.
   */
  disassociateFromMasterAccount(callback?: (err: AWSError, data: GuardDuty.Types.DisassociateFromMasterAccountResponse) => void): Request<GuardDuty.Types.DisassociateFromMasterAccountResponse, AWSError>;
  /**
   * Disassociates GuardDuty member accounts (to the current GuardDuty administrator account) specified by the account IDs.
   */
  disassociateMembers(params: GuardDuty.Types.DisassociateMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.DisassociateMembersResponse) => void): Request<GuardDuty.Types.DisassociateMembersResponse, AWSError>;
  /**
   * Disassociates GuardDuty member accounts (to the current GuardDuty administrator account) specified by the account IDs.
   */
  disassociateMembers(callback?: (err: AWSError, data: GuardDuty.Types.DisassociateMembersResponse) => void): Request<GuardDuty.Types.DisassociateMembersResponse, AWSError>;
  /**
   * Enables an AWS account within the organization as the GuardDuty delegated administrator.
   */
  enableOrganizationAdminAccount(params: GuardDuty.Types.EnableOrganizationAdminAccountRequest, callback?: (err: AWSError, data: GuardDuty.Types.EnableOrganizationAdminAccountResponse) => void): Request<GuardDuty.Types.EnableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Enables an AWS account within the organization as the GuardDuty delegated administrator.
   */
  enableOrganizationAdminAccount(callback?: (err: AWSError, data: GuardDuty.Types.EnableOrganizationAdminAccountResponse) => void): Request<GuardDuty.Types.EnableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Retrieves an Amazon GuardDuty detector specified by the detectorId.
   */
  getDetector(params: GuardDuty.Types.GetDetectorRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetDetectorResponse) => void): Request<GuardDuty.Types.GetDetectorResponse, AWSError>;
  /**
   * Retrieves an Amazon GuardDuty detector specified by the detectorId.
   */
  getDetector(callback?: (err: AWSError, data: GuardDuty.Types.GetDetectorResponse) => void): Request<GuardDuty.Types.GetDetectorResponse, AWSError>;
  /**
   * Returns the details of the filter specified by the filter name.
   */
  getFilter(params: GuardDuty.Types.GetFilterRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetFilterResponse) => void): Request<GuardDuty.Types.GetFilterResponse, AWSError>;
  /**
   * Returns the details of the filter specified by the filter name.
   */
  getFilter(callback?: (err: AWSError, data: GuardDuty.Types.GetFilterResponse) => void): Request<GuardDuty.Types.GetFilterResponse, AWSError>;
  /**
   * Describes Amazon GuardDuty findings specified by finding IDs.
   */
  getFindings(params: GuardDuty.Types.GetFindingsRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetFindingsResponse) => void): Request<GuardDuty.Types.GetFindingsResponse, AWSError>;
  /**
   * Describes Amazon GuardDuty findings specified by finding IDs.
   */
  getFindings(callback?: (err: AWSError, data: GuardDuty.Types.GetFindingsResponse) => void): Request<GuardDuty.Types.GetFindingsResponse, AWSError>;
  /**
   * Lists Amazon GuardDuty findings statistics for the specified detector ID.
   */
  getFindingsStatistics(params: GuardDuty.Types.GetFindingsStatisticsRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetFindingsStatisticsResponse) => void): Request<GuardDuty.Types.GetFindingsStatisticsResponse, AWSError>;
  /**
   * Lists Amazon GuardDuty findings statistics for the specified detector ID.
   */
  getFindingsStatistics(callback?: (err: AWSError, data: GuardDuty.Types.GetFindingsStatisticsResponse) => void): Request<GuardDuty.Types.GetFindingsStatisticsResponse, AWSError>;
  /**
   * Retrieves the IPSet specified by the ipSetId.
   */
  getIPSet(params: GuardDuty.Types.GetIPSetRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetIPSetResponse) => void): Request<GuardDuty.Types.GetIPSetResponse, AWSError>;
  /**
   * Retrieves the IPSet specified by the ipSetId.
   */
  getIPSet(callback?: (err: AWSError, data: GuardDuty.Types.GetIPSetResponse) => void): Request<GuardDuty.Types.GetIPSetResponse, AWSError>;
  /**
   * Returns the count of all GuardDuty membership invitations that were sent to the current member account except the currently accepted invitation.
   */
  getInvitationsCount(params: GuardDuty.Types.GetInvitationsCountRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetInvitationsCountResponse) => void): Request<GuardDuty.Types.GetInvitationsCountResponse, AWSError>;
  /**
   * Returns the count of all GuardDuty membership invitations that were sent to the current member account except the currently accepted invitation.
   */
  getInvitationsCount(callback?: (err: AWSError, data: GuardDuty.Types.GetInvitationsCountResponse) => void): Request<GuardDuty.Types.GetInvitationsCountResponse, AWSError>;
  /**
   * Provides the details for the GuardDuty administrator account associated with the current GuardDuty member account.
   */
  getMasterAccount(params: GuardDuty.Types.GetMasterAccountRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetMasterAccountResponse) => void): Request<GuardDuty.Types.GetMasterAccountResponse, AWSError>;
  /**
   * Provides the details for the GuardDuty administrator account associated with the current GuardDuty member account.
   */
  getMasterAccount(callback?: (err: AWSError, data: GuardDuty.Types.GetMasterAccountResponse) => void): Request<GuardDuty.Types.GetMasterAccountResponse, AWSError>;
  /**
   * Describes which data sources are enabled for the member account's detector.
   */
  getMemberDetectors(params: GuardDuty.Types.GetMemberDetectorsRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetMemberDetectorsResponse) => void): Request<GuardDuty.Types.GetMemberDetectorsResponse, AWSError>;
  /**
   * Describes which data sources are enabled for the member account's detector.
   */
  getMemberDetectors(callback?: (err: AWSError, data: GuardDuty.Types.GetMemberDetectorsResponse) => void): Request<GuardDuty.Types.GetMemberDetectorsResponse, AWSError>;
  /**
   * Retrieves GuardDuty member accounts (of the current GuardDuty administrator account) specified by the account IDs.
   */
  getMembers(params: GuardDuty.Types.GetMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetMembersResponse) => void): Request<GuardDuty.Types.GetMembersResponse, AWSError>;
  /**
   * Retrieves GuardDuty member accounts (of the current GuardDuty administrator account) specified by the account IDs.
   */
  getMembers(callback?: (err: AWSError, data: GuardDuty.Types.GetMembersResponse) => void): Request<GuardDuty.Types.GetMembersResponse, AWSError>;
  /**
   * Retrieves the ThreatIntelSet that is specified by the ThreatIntelSet ID.
   */
  getThreatIntelSet(params: GuardDuty.Types.GetThreatIntelSetRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetThreatIntelSetResponse) => void): Request<GuardDuty.Types.GetThreatIntelSetResponse, AWSError>;
  /**
   * Retrieves the ThreatIntelSet that is specified by the ThreatIntelSet ID.
   */
  getThreatIntelSet(callback?: (err: AWSError, data: GuardDuty.Types.GetThreatIntelSetResponse) => void): Request<GuardDuty.Types.GetThreatIntelSetResponse, AWSError>;
  /**
   * Lists Amazon GuardDuty usage statistics over the last 30 days for the specified detector ID. For newly enabled detectors or data sources the cost returned will include only the usage so far under 30 days, this may differ from the cost metrics in the console, which projects usage over 30 days to provide a monthly cost estimate. For more information see Understanding How Usage Costs are Calculated.
   */
  getUsageStatistics(params: GuardDuty.Types.GetUsageStatisticsRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetUsageStatisticsResponse) => void): Request<GuardDuty.Types.GetUsageStatisticsResponse, AWSError>;
  /**
   * Lists Amazon GuardDuty usage statistics over the last 30 days for the specified detector ID. For newly enabled detectors or data sources the cost returned will include only the usage so far under 30 days, this may differ from the cost metrics in the console, which projects usage over 30 days to provide a monthly cost estimate. For more information see Understanding How Usage Costs are Calculated.
   */
  getUsageStatistics(callback?: (err: AWSError, data: GuardDuty.Types.GetUsageStatisticsResponse) => void): Request<GuardDuty.Types.GetUsageStatisticsResponse, AWSError>;
  /**
   * Invites other AWS accounts (created as members of the current AWS account by CreateMembers) to enable GuardDuty, and allow the current AWS account to view and manage these accounts' findings on their behalf as the GuardDuty administrator account.
   */
  inviteMembers(params: GuardDuty.Types.InviteMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.InviteMembersResponse) => void): Request<GuardDuty.Types.InviteMembersResponse, AWSError>;
  /**
   * Invites other AWS accounts (created as members of the current AWS account by CreateMembers) to enable GuardDuty, and allow the current AWS account to view and manage these accounts' findings on their behalf as the GuardDuty administrator account.
   */
  inviteMembers(callback?: (err: AWSError, data: GuardDuty.Types.InviteMembersResponse) => void): Request<GuardDuty.Types.InviteMembersResponse, AWSError>;
  /**
   * Lists detectorIds of all the existing Amazon GuardDuty detector resources.
   */
  listDetectors(params: GuardDuty.Types.ListDetectorsRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListDetectorsResponse) => void): Request<GuardDuty.Types.ListDetectorsResponse, AWSError>;
  /**
   * Lists detectorIds of all the existing Amazon GuardDuty detector resources.
   */
  listDetectors(callback?: (err: AWSError, data: GuardDuty.Types.ListDetectorsResponse) => void): Request<GuardDuty.Types.ListDetectorsResponse, AWSError>;
  /**
   * Returns a paginated list of the current filters.
   */
  listFilters(params: GuardDuty.Types.ListFiltersRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListFiltersResponse) => void): Request<GuardDuty.Types.ListFiltersResponse, AWSError>;
  /**
   * Returns a paginated list of the current filters.
   */
  listFilters(callback?: (err: AWSError, data: GuardDuty.Types.ListFiltersResponse) => void): Request<GuardDuty.Types.ListFiltersResponse, AWSError>;
  /**
   * Lists Amazon GuardDuty findings for the specified detector ID.
   */
  listFindings(params: GuardDuty.Types.ListFindingsRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListFindingsResponse) => void): Request<GuardDuty.Types.ListFindingsResponse, AWSError>;
  /**
   * Lists Amazon GuardDuty findings for the specified detector ID.
   */
  listFindings(callback?: (err: AWSError, data: GuardDuty.Types.ListFindingsResponse) => void): Request<GuardDuty.Types.ListFindingsResponse, AWSError>;
  /**
   * Lists the IPSets of the GuardDuty service specified by the detector ID. If you use this operation from a member account, the IPSets returned are the IPSets from the associated administrator account.
   */
  listIPSets(params: GuardDuty.Types.ListIPSetsRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListIPSetsResponse) => void): Request<GuardDuty.Types.ListIPSetsResponse, AWSError>;
  /**
   * Lists the IPSets of the GuardDuty service specified by the detector ID. If you use this operation from a member account, the IPSets returned are the IPSets from the associated administrator account.
   */
  listIPSets(callback?: (err: AWSError, data: GuardDuty.Types.ListIPSetsResponse) => void): Request<GuardDuty.Types.ListIPSetsResponse, AWSError>;
  /**
   * Lists all GuardDuty membership invitations that were sent to the current AWS account.
   */
  listInvitations(params: GuardDuty.Types.ListInvitationsRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListInvitationsResponse) => void): Request<GuardDuty.Types.ListInvitationsResponse, AWSError>;
  /**
   * Lists all GuardDuty membership invitations that were sent to the current AWS account.
   */
  listInvitations(callback?: (err: AWSError, data: GuardDuty.Types.ListInvitationsResponse) => void): Request<GuardDuty.Types.ListInvitationsResponse, AWSError>;
  /**
   * Lists details about all member accounts for the current GuardDuty administrator account.
   */
  listMembers(params: GuardDuty.Types.ListMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListMembersResponse) => void): Request<GuardDuty.Types.ListMembersResponse, AWSError>;
  /**
   * Lists details about all member accounts for the current GuardDuty administrator account.
   */
  listMembers(callback?: (err: AWSError, data: GuardDuty.Types.ListMembersResponse) => void): Request<GuardDuty.Types.ListMembersResponse, AWSError>;
  /**
   * Lists the accounts configured as GuardDuty delegated administrators.
   */
  listOrganizationAdminAccounts(params: GuardDuty.Types.ListOrganizationAdminAccountsRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListOrganizationAdminAccountsResponse) => void): Request<GuardDuty.Types.ListOrganizationAdminAccountsResponse, AWSError>;
  /**
   * Lists the accounts configured as GuardDuty delegated administrators.
   */
  listOrganizationAdminAccounts(callback?: (err: AWSError, data: GuardDuty.Types.ListOrganizationAdminAccountsResponse) => void): Request<GuardDuty.Types.ListOrganizationAdminAccountsResponse, AWSError>;
  /**
   * Returns a list of publishing destinations associated with the specified dectectorId.
   */
  listPublishingDestinations(params: GuardDuty.Types.ListPublishingDestinationsRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListPublishingDestinationsResponse) => void): Request<GuardDuty.Types.ListPublishingDestinationsResponse, AWSError>;
  /**
   * Returns a list of publishing destinations associated with the specified dectectorId.
   */
  listPublishingDestinations(callback?: (err: AWSError, data: GuardDuty.Types.ListPublishingDestinationsResponse) => void): Request<GuardDuty.Types.ListPublishingDestinationsResponse, AWSError>;
  /**
   * Lists tags for a resource. Tagging is currently supported for detectors, finding filters, IP sets, and threat intel sets, with a limit of 50 tags per resource. When invoked, this operation returns all assigned tags for a given resource.
   */
  listTagsForResource(params: GuardDuty.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListTagsForResourceResponse) => void): Request<GuardDuty.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists tags for a resource. Tagging is currently supported for detectors, finding filters, IP sets, and threat intel sets, with a limit of 50 tags per resource. When invoked, this operation returns all assigned tags for a given resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: GuardDuty.Types.ListTagsForResourceResponse) => void): Request<GuardDuty.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the ThreatIntelSets of the GuardDuty service specified by the detector ID. If you use this operation from a member account, the ThreatIntelSets associated with the administrator account are returned.
   */
  listThreatIntelSets(params: GuardDuty.Types.ListThreatIntelSetsRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListThreatIntelSetsResponse) => void): Request<GuardDuty.Types.ListThreatIntelSetsResponse, AWSError>;
  /**
   * Lists the ThreatIntelSets of the GuardDuty service specified by the detector ID. If you use this operation from a member account, the ThreatIntelSets associated with the administrator account are returned.
   */
  listThreatIntelSets(callback?: (err: AWSError, data: GuardDuty.Types.ListThreatIntelSetsResponse) => void): Request<GuardDuty.Types.ListThreatIntelSetsResponse, AWSError>;
  /**
   * Turns on GuardDuty monitoring of the specified member accounts. Use this operation to restart monitoring of accounts that you stopped monitoring with the StopMonitoringMembers operation.
   */
  startMonitoringMembers(params: GuardDuty.Types.StartMonitoringMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.StartMonitoringMembersResponse) => void): Request<GuardDuty.Types.StartMonitoringMembersResponse, AWSError>;
  /**
   * Turns on GuardDuty monitoring of the specified member accounts. Use this operation to restart monitoring of accounts that you stopped monitoring with the StopMonitoringMembers operation.
   */
  startMonitoringMembers(callback?: (err: AWSError, data: GuardDuty.Types.StartMonitoringMembersResponse) => void): Request<GuardDuty.Types.StartMonitoringMembersResponse, AWSError>;
  /**
   * Stops GuardDuty monitoring for the specified member accounts. Use the StartMonitoringMembers operation to restart monitoring for those accounts.
   */
  stopMonitoringMembers(params: GuardDuty.Types.StopMonitoringMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.StopMonitoringMembersResponse) => void): Request<GuardDuty.Types.StopMonitoringMembersResponse, AWSError>;
  /**
   * Stops GuardDuty monitoring for the specified member accounts. Use the StartMonitoringMembers operation to restart monitoring for those accounts.
   */
  stopMonitoringMembers(callback?: (err: AWSError, data: GuardDuty.Types.StopMonitoringMembersResponse) => void): Request<GuardDuty.Types.StopMonitoringMembersResponse, AWSError>;
  /**
   * Adds tags to a resource.
   */
  tagResource(params: GuardDuty.Types.TagResourceRequest, callback?: (err: AWSError, data: GuardDuty.Types.TagResourceResponse) => void): Request<GuardDuty.Types.TagResourceResponse, AWSError>;
  /**
   * Adds tags to a resource.
   */
  tagResource(callback?: (err: AWSError, data: GuardDuty.Types.TagResourceResponse) => void): Request<GuardDuty.Types.TagResourceResponse, AWSError>;
  /**
   * Unarchives GuardDuty findings specified by the findingIds.
   */
  unarchiveFindings(params: GuardDuty.Types.UnarchiveFindingsRequest, callback?: (err: AWSError, data: GuardDuty.Types.UnarchiveFindingsResponse) => void): Request<GuardDuty.Types.UnarchiveFindingsResponse, AWSError>;
  /**
   * Unarchives GuardDuty findings specified by the findingIds.
   */
  unarchiveFindings(callback?: (err: AWSError, data: GuardDuty.Types.UnarchiveFindingsResponse) => void): Request<GuardDuty.Types.UnarchiveFindingsResponse, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(params: GuardDuty.Types.UntagResourceRequest, callback?: (err: AWSError, data: GuardDuty.Types.UntagResourceResponse) => void): Request<GuardDuty.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: GuardDuty.Types.UntagResourceResponse) => void): Request<GuardDuty.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the Amazon GuardDuty detector specified by the detectorId.
   */
  updateDetector(params: GuardDuty.Types.UpdateDetectorRequest, callback?: (err: AWSError, data: GuardDuty.Types.UpdateDetectorResponse) => void): Request<GuardDuty.Types.UpdateDetectorResponse, AWSError>;
  /**
   * Updates the Amazon GuardDuty detector specified by the detectorId.
   */
  updateDetector(callback?: (err: AWSError, data: GuardDuty.Types.UpdateDetectorResponse) => void): Request<GuardDuty.Types.UpdateDetectorResponse, AWSError>;
  /**
   * Updates the filter specified by the filter name.
   */
  updateFilter(params: GuardDuty.Types.UpdateFilterRequest, callback?: (err: AWSError, data: GuardDuty.Types.UpdateFilterResponse) => void): Request<GuardDuty.Types.UpdateFilterResponse, AWSError>;
  /**
   * Updates the filter specified by the filter name.
   */
  updateFilter(callback?: (err: AWSError, data: GuardDuty.Types.UpdateFilterResponse) => void): Request<GuardDuty.Types.UpdateFilterResponse, AWSError>;
  /**
   * Marks the specified GuardDuty findings as useful or not useful.
   */
  updateFindingsFeedback(params: GuardDuty.Types.UpdateFindingsFeedbackRequest, callback?: (err: AWSError, data: GuardDuty.Types.UpdateFindingsFeedbackResponse) => void): Request<GuardDuty.Types.UpdateFindingsFeedbackResponse, AWSError>;
  /**
   * Marks the specified GuardDuty findings as useful or not useful.
   */
  updateFindingsFeedback(callback?: (err: AWSError, data: GuardDuty.Types.UpdateFindingsFeedbackResponse) => void): Request<GuardDuty.Types.UpdateFindingsFeedbackResponse, AWSError>;
  /**
   * Updates the IPSet specified by the IPSet ID.
   */
  updateIPSet(params: GuardDuty.Types.UpdateIPSetRequest, callback?: (err: AWSError, data: GuardDuty.Types.UpdateIPSetResponse) => void): Request<GuardDuty.Types.UpdateIPSetResponse, AWSError>;
  /**
   * Updates the IPSet specified by the IPSet ID.
   */
  updateIPSet(callback?: (err: AWSError, data: GuardDuty.Types.UpdateIPSetResponse) => void): Request<GuardDuty.Types.UpdateIPSetResponse, AWSError>;
  /**
   * Contains information on member accounts to be updated.
   */
  updateMemberDetectors(params: GuardDuty.Types.UpdateMemberDetectorsRequest, callback?: (err: AWSError, data: GuardDuty.Types.UpdateMemberDetectorsResponse) => void): Request<GuardDuty.Types.UpdateMemberDetectorsResponse, AWSError>;
  /**
   * Contains information on member accounts to be updated.
   */
  updateMemberDetectors(callback?: (err: AWSError, data: GuardDuty.Types.UpdateMemberDetectorsResponse) => void): Request<GuardDuty.Types.UpdateMemberDetectorsResponse, AWSError>;
  /**
   * Updates the delegated administrator account with the values provided.
   */
  updateOrganizationConfiguration(params: GuardDuty.Types.UpdateOrganizationConfigurationRequest, callback?: (err: AWSError, data: GuardDuty.Types.UpdateOrganizationConfigurationResponse) => void): Request<GuardDuty.Types.UpdateOrganizationConfigurationResponse, AWSError>;
  /**
   * Updates the delegated administrator account with the values provided.
   */
  updateOrganizationConfiguration(callback?: (err: AWSError, data: GuardDuty.Types.UpdateOrganizationConfigurationResponse) => void): Request<GuardDuty.Types.UpdateOrganizationConfigurationResponse, AWSError>;
  /**
   * Updates information about the publishing destination specified by the destinationId.
   */
  updatePublishingDestination(params: GuardDuty.Types.UpdatePublishingDestinationRequest, callback?: (err: AWSError, data: GuardDuty.Types.UpdatePublishingDestinationResponse) => void): Request<GuardDuty.Types.UpdatePublishingDestinationResponse, AWSError>;
  /**
   * Updates information about the publishing destination specified by the destinationId.
   */
  updatePublishingDestination(callback?: (err: AWSError, data: GuardDuty.Types.UpdatePublishingDestinationResponse) => void): Request<GuardDuty.Types.UpdatePublishingDestinationResponse, AWSError>;
  /**
   * Updates the ThreatIntelSet specified by the ThreatIntelSet ID.
   */
  updateThreatIntelSet(params: GuardDuty.Types.UpdateThreatIntelSetRequest, callback?: (err: AWSError, data: GuardDuty.Types.UpdateThreatIntelSetResponse) => void): Request<GuardDuty.Types.UpdateThreatIntelSetResponse, AWSError>;
  /**
   * Updates the ThreatIntelSet specified by the ThreatIntelSet ID.
   */
  updateThreatIntelSet(callback?: (err: AWSError, data: GuardDuty.Types.UpdateThreatIntelSetResponse) => void): Request<GuardDuty.Types.UpdateThreatIntelSetResponse, AWSError>;
}
declare namespace GuardDuty {
  export interface AcceptInvitationRequest {
    /**
     * The unique ID of the detector of the GuardDuty member account.
     */
    DetectorId: DetectorId;
    /**
     * The account ID of the GuardDuty administrator account whose invitation you're accepting.
     */
    MasterId: String;
    /**
     * The value that is used to validate the administrator account to the member account.
     */
    InvitationId: String;
  }
  export interface AcceptInvitationResponse {
  }
  export interface AccessControlList {
    /**
     * A value that indicates whether public read access for the bucket is enabled through an Access Control List (ACL).
     */
    AllowsPublicReadAccess?: Boolean;
    /**
     * A value that indicates whether public write access for the bucket is enabled through an Access Control List (ACL).
     */
    AllowsPublicWriteAccess?: Boolean;
  }
  export interface AccessKeyDetails {
    /**
     * The access key ID of the user.
     */
    AccessKeyId?: String;
    /**
     * The principal ID of the user.
     */
    PrincipalId?: String;
    /**
     * The name of the user.
     */
    UserName?: String;
    /**
     * The type of the user.
     */
    UserType?: String;
  }
  export interface AccountDetail {
    /**
     * The member account ID.
     */
    AccountId: AccountId;
    /**
     * The email address of the member account.
     */
    Email: Email;
  }
  export type AccountDetails = AccountDetail[];
  export type AccountId = string;
  export type AccountIds = AccountId[];
  export interface AccountLevelPermissions {
    /**
     * Describes the S3 Block Public Access settings of the bucket's parent account.
     */
    BlockPublicAccess?: BlockPublicAccess;
  }
  export interface Action {
    /**
     * The GuardDuty finding activity type.
     */
    ActionType?: String;
    /**
     * Information about the AWS_API_CALL action described in this finding.
     */
    AwsApiCallAction?: AwsApiCallAction;
    /**
     * Information about the DNS_REQUEST action described in this finding.
     */
    DnsRequestAction?: DnsRequestAction;
    /**
     * Information about the NETWORK_CONNECTION action described in this finding.
     */
    NetworkConnectionAction?: NetworkConnectionAction;
    /**
     * Information about the PORT_PROBE action described in this finding.
     */
    PortProbeAction?: PortProbeAction;
  }
  export interface AdminAccount {
    /**
     * The AWS account ID for the account.
     */
    AdminAccountId?: String;
    /**
     * Indicates whether the account is enabled as the delegated administrator.
     */
    AdminStatus?: AdminStatus;
  }
  export type AdminAccounts = AdminAccount[];
  export type AdminStatus = "ENABLED"|"DISABLE_IN_PROGRESS"|string;
  export interface ArchiveFindingsRequest {
    /**
     * The ID of the detector that specifies the GuardDuty service whose findings you want to archive.
     */
    DetectorId: DetectorId;
    /**
     * The IDs of the findings that you want to archive.
     */
    FindingIds: FindingIds;
  }
  export interface ArchiveFindingsResponse {
  }
  export interface AwsApiCallAction {
    /**
     * The AWS API name.
     */
    Api?: String;
    /**
     * The AWS API caller type.
     */
    CallerType?: String;
    /**
     * The domain information for the AWS API call.
     */
    DomainDetails?: DomainDetails;
    /**
     * The error code of the failed AWS API action.
     */
    ErrorCode?: String;
    /**
     * The remote IP information of the connection that initiated the AWS API call.
     */
    RemoteIpDetails?: RemoteIpDetails;
    /**
     * The AWS service name whose API was invoked.
     */
    ServiceName?: String;
  }
  export interface BlockPublicAccess {
    /**
     * Indicates if S3 Block Public Access is set to IgnorePublicAcls.
     */
    IgnorePublicAcls?: Boolean;
    /**
     * Indicates if S3 Block Public Access is set to RestrictPublicBuckets.
     */
    RestrictPublicBuckets?: Boolean;
    /**
     * Indicates if S3 Block Public Access is set to BlockPublicAcls.
     */
    BlockPublicAcls?: Boolean;
    /**
     * Indicates if S3 Block Public Access is set to BlockPublicPolicy.
     */
    BlockPublicPolicy?: Boolean;
  }
  export type Boolean = boolean;
  export interface BucketLevelPermissions {
    /**
     * Contains information on how Access Control Policies are applied to the bucket.
     */
    AccessControlList?: AccessControlList;
    /**
     * Contains information on the bucket policies for the S3 bucket.
     */
    BucketPolicy?: BucketPolicy;
    /**
     * Contains information on which account level S3 Block Public Access settings are applied to the S3 bucket.
     */
    BlockPublicAccess?: BlockPublicAccess;
  }
  export interface BucketPolicy {
    /**
     * A value that indicates whether public read access for the bucket is enabled through a bucket policy.
     */
    AllowsPublicReadAccess?: Boolean;
    /**
     * A value that indicates whether public write access for the bucket is enabled through a bucket policy.
     */
    AllowsPublicWriteAccess?: Boolean;
  }
  export interface City {
    /**
     * The city name of the remote IP address.
     */
    CityName?: String;
  }
  export type ClientToken = string;
  export interface CloudTrailConfigurationResult {
    /**
     * Describes whether CloudTrail is enabled as a data source for the detector.
     */
    Status: DataSourceStatus;
  }
  export interface Condition {
    /**
     * Represents the equal condition to be applied to a single field when querying for findings.
     */
    Eq?: Eq;
    /**
     * Represents the not equal condition to be applied to a single field when querying for findings.
     */
    Neq?: Neq;
    /**
     * Represents a greater than condition to be applied to a single field when querying for findings.
     */
    Gt?: Integer;
    /**
     * Represents a greater than or equal condition to be applied to a single field when querying for findings.
     */
    Gte?: Integer;
    /**
     * Represents a less than condition to be applied to a single field when querying for findings.
     */
    Lt?: Integer;
    /**
     * Represents a less than or equal condition to be applied to a single field when querying for findings.
     */
    Lte?: Integer;
    /**
     * Represents an equal  condition to be applied to a single field when querying for findings.
     */
    Equals?: Equals;
    /**
     * Represents a not equal  condition to be applied to a single field when querying for findings.
     */
    NotEquals?: NotEquals;
    /**
     * Represents a greater than condition to be applied to a single field when querying for findings.
     */
    GreaterThan?: Long;
    /**
     * Represents a greater than or equal condition to be applied to a single field when querying for findings.
     */
    GreaterThanOrEqual?: Long;
    /**
     * Represents a less than condition to be applied to a single field when querying for findings.
     */
    LessThan?: Long;
    /**
     * Represents a less than or equal condition to be applied to a single field when querying for findings.
     */
    LessThanOrEqual?: Long;
  }
  export type CountBySeverity = {[key: string]: Integer};
  export interface Country {
    /**
     * The country code of the remote IP address.
     */
    CountryCode?: String;
    /**
     * The country name of the remote IP address.
     */
    CountryName?: String;
  }
  export interface CreateDetectorRequest {
    /**
     * A Boolean value that specifies whether the detector is to be enabled.
     */
    Enable: Boolean;
    /**
     * The idempotency token for the create request.
     */
    ClientToken?: ClientToken;
    /**
     * A value that specifies how frequently updated findings are exported.
     */
    FindingPublishingFrequency?: FindingPublishingFrequency;
    /**
     * Describes which data sources will be enabled for the detector.
     */
    DataSources?: DataSourceConfigurations;
    /**
     * The tags to be added to a new detector resource.
     */
    Tags?: TagMap;
  }
  export interface CreateDetectorResponse {
    /**
     * The unique ID of the created detector.
     */
    DetectorId?: DetectorId;
  }
  export interface CreateFilterRequest {
    /**
     * The ID of the detector belonging to the GuardDuty account that you want to create a filter for.
     */
    DetectorId: DetectorId;
    /**
     * The name of the filter. Minimum length of 3. Maximum length of 64. Valid characters include alphanumeric characters, dot (.), underscore (_), and dash (-). Spaces are not allowed.
     */
    Name: FilterName;
    /**
     * The description of the filter.
     */
    Description?: FilterDescription;
    /**
     * Specifies the action that is to be applied to the findings that match the filter.
     */
    Action?: FilterAction;
    /**
     * Specifies the position of the filter in the list of current filters. Also specifies the order in which this filter is applied to the findings.
     */
    Rank?: FilterRank;
    /**
     * Represents the criteria to be used in the filter for querying findings. You can only use the following attributes to query findings:   accountId   region   confidence   id   resource.accessKeyDetails.accessKeyId   resource.accessKeyDetails.principalId   resource.accessKeyDetails.userName   resource.accessKeyDetails.userType   resource.instanceDetails.iamInstanceProfile.id   resource.instanceDetails.imageId   resource.instanceDetails.instanceId   resource.instanceDetails.outpostArn   resource.instanceDetails.networkInterfaces.ipv6Addresses   resource.instanceDetails.networkInterfaces.privateIpAddresses.privateIpAddress   resource.instanceDetails.networkInterfaces.publicDnsName   resource.instanceDetails.networkInterfaces.publicIp   resource.instanceDetails.networkInterfaces.securityGroups.groupId   resource.instanceDetails.networkInterfaces.securityGroups.groupName   resource.instanceDetails.networkInterfaces.subnetId   resource.instanceDetails.networkInterfaces.vpcId   resource.instanceDetails.tags.key   resource.instanceDetails.tags.value   resource.resourceType   service.action.actionType   service.action.awsApiCallAction.api   service.action.awsApiCallAction.callerType   service.action.awsApiCallAction.errorCode   service.action.awsApiCallAction.remoteIpDetails.city.cityName   service.action.awsApiCallAction.remoteIpDetails.country.countryName   service.action.awsApiCallAction.remoteIpDetails.ipAddressV4   service.action.awsApiCallAction.remoteIpDetails.organization.asn   service.action.awsApiCallAction.remoteIpDetails.organization.asnOrg   service.action.awsApiCallAction.serviceName   service.action.dnsRequestAction.domain   service.action.networkConnectionAction.blocked   service.action.networkConnectionAction.connectionDirection   service.action.networkConnectionAction.localPortDetails.port   service.action.networkConnectionAction.protocol   service.action.networkConnectionAction.localIpDetails.ipAddressV4   service.action.networkConnectionAction.remoteIpDetails.city.cityName   service.action.networkConnectionAction.remoteIpDetails.country.countryName   service.action.networkConnectionAction.remoteIpDetails.ipAddressV4   service.action.networkConnectionAction.remoteIpDetails.organization.asn   service.action.networkConnectionAction.remoteIpDetails.organization.asnOrg   service.action.networkConnectionAction.remotePortDetails.port   service.additionalInfo.threatListName   service.archived When this attribute is set to TRUE, only archived findings are listed. When it's set to FALSE, only unarchived findings are listed. When this attribute is not set, all existing findings are listed.   service.resourceRole   severity   type   updatedAt Type: ISO 8601 string format: YYYY-MM-DDTHH:MM:SS.SSSZ or YYYY-MM-DDTHH:MM:SSZ depending on whether the value contains milliseconds.  
     */
    FindingCriteria: FindingCriteria;
    /**
     * The idempotency token for the create request.
     */
    ClientToken?: ClientToken;
    /**
     * The tags to be added to a new filter resource.
     */
    Tags?: TagMap;
  }
  export interface CreateFilterResponse {
    /**
     * The name of the successfully created filter.
     */
    Name: FilterName;
  }
  export interface CreateIPSetRequest {
    /**
     * The unique ID of the detector of the GuardDuty account that you want to create an IPSet for.
     */
    DetectorId: DetectorId;
    /**
     * The user-friendly name to identify the IPSet.  Allowed characters are alphanumerics, spaces, hyphens (-), and underscores (_).
     */
    Name: Name;
    /**
     * The format of the file that contains the IPSet.
     */
    Format: IpSetFormat;
    /**
     * The URI of the file that contains the IPSet. For example: https://s3.us-west-2.amazonaws.com/my-bucket/my-object-key.
     */
    Location: Location;
    /**
     * A Boolean value that indicates whether GuardDuty is to start using the uploaded IPSet.
     */
    Activate: Boolean;
    /**
     * The idempotency token for the create request.
     */
    ClientToken?: ClientToken;
    /**
     * The tags to be added to a new IP set resource.
     */
    Tags?: TagMap;
  }
  export interface CreateIPSetResponse {
    /**
     * The ID of the IPSet resource.
     */
    IpSetId: String;
  }
  export interface CreateMembersRequest {
    /**
     * The unique ID of the detector of the GuardDuty account that you want to associate member accounts with.
     */
    DetectorId: DetectorId;
    /**
     * A list of account ID and email address pairs of the accounts that you want to associate with the GuardDuty administrator account.
     */
    AccountDetails: AccountDetails;
  }
  export interface CreateMembersResponse {
    /**
     * A list of objects that include the accountIds of the unprocessed accounts and a result string that explains why each was unprocessed.
     */
    UnprocessedAccounts: UnprocessedAccounts;
  }
  export interface CreatePublishingDestinationRequest {
    /**
     * The ID of the GuardDuty detector associated with the publishing destination.
     */
    DetectorId: DetectorId;
    /**
     * The type of resource for the publishing destination. Currently only Amazon S3 buckets are supported.
     */
    DestinationType: DestinationType;
    /**
     * The properties of the publishing destination, including the ARNs for the destination and the KMS key used for encryption.
     */
    DestinationProperties: DestinationProperties;
    /**
     * The idempotency token for the request.
     */
    ClientToken?: ClientToken;
  }
  export interface CreatePublishingDestinationResponse {
    /**
     * The ID of the publishing destination that is created.
     */
    DestinationId: String;
  }
  export interface CreateSampleFindingsRequest {
    /**
     * The ID of the detector to create sample findings for.
     */
    DetectorId: DetectorId;
    /**
     * The types of sample findings to generate.
     */
    FindingTypes?: FindingTypes;
  }
  export interface CreateSampleFindingsResponse {
  }
  export interface CreateThreatIntelSetRequest {
    /**
     * The unique ID of the detector of the GuardDuty account that you want to create a threatIntelSet for.
     */
    DetectorId: DetectorId;
    /**
     * A user-friendly ThreatIntelSet name displayed in all findings that are generated by activity that involves IP addresses included in this ThreatIntelSet.
     */
    Name: Name;
    /**
     * The format of the file that contains the ThreatIntelSet.
     */
    Format: ThreatIntelSetFormat;
    /**
     * The URI of the file that contains the ThreatIntelSet. For example: https://s3.us-west-2.amazonaws.com/my-bucket/my-object-key.
     */
    Location: Location;
    /**
     * A Boolean value that indicates whether GuardDuty is to start using the uploaded ThreatIntelSet.
     */
    Activate: Boolean;
    /**
     * The idempotency token for the create request.
     */
    ClientToken?: ClientToken;
    /**
     * The tags to be added to a new threat list resource.
     */
    Tags?: TagMap;
  }
  export interface CreateThreatIntelSetResponse {
    /**
     * The ID of the ThreatIntelSet resource.
     */
    ThreatIntelSetId: String;
  }
  export type Criterion = {[key: string]: Condition};
  export interface DNSLogsConfigurationResult {
    /**
     * Denotes whether DNS logs is enabled as a data source.
     */
    Status: DataSourceStatus;
  }
  export type DataSource = "FLOW_LOGS"|"CLOUD_TRAIL"|"DNS_LOGS"|"S3_LOGS"|string;
  export interface DataSourceConfigurations {
    /**
     * Describes whether S3 data event logs are enabled as a data source.
     */
    S3Logs?: S3LogsConfiguration;
  }
  export interface DataSourceConfigurationsResult {
    /**
     * An object that contains information on the status of CloudTrail as a data source.
     */
    CloudTrail: CloudTrailConfigurationResult;
    /**
     * An object that contains information on the status of DNS logs as a data source.
     */
    DNSLogs: DNSLogsConfigurationResult;
    /**
     * An object that contains information on the status of VPC flow logs as a data source.
     */
    FlowLogs: FlowLogsConfigurationResult;
    /**
     * An object that contains information on the status of S3 Data event logs as a data source.
     */
    S3Logs: S3LogsConfigurationResult;
  }
  export type DataSourceList = DataSource[];
  export type DataSourceStatus = "ENABLED"|"DISABLED"|string;
  export interface DeclineInvitationsRequest {
    /**
     * A list of account IDs of the AWS accounts that sent invitations to the current member account that you want to decline invitations from.
     */
    AccountIds: AccountIds;
  }
  export interface DeclineInvitationsResponse {
    /**
     * A list of objects that contain the unprocessed account and a result string that explains why it was unprocessed.
     */
    UnprocessedAccounts: UnprocessedAccounts;
  }
  export interface DefaultServerSideEncryption {
    /**
     * The type of encryption used for objects within the S3 bucket.
     */
    EncryptionType?: String;
    /**
     * The Amazon Resource Name (ARN) of the KMS encryption key. Only available if the bucket EncryptionType is aws:kms.
     */
    KmsMasterKeyArn?: String;
  }
  export interface DeleteDetectorRequest {
    /**
     * The unique ID of the detector that you want to delete.
     */
    DetectorId: DetectorId;
  }
  export interface DeleteDetectorResponse {
  }
  export interface DeleteFilterRequest {
    /**
     * The unique ID of the detector that the filter is associated with.
     */
    DetectorId: DetectorId;
    /**
     * The name of the filter that you want to delete.
     */
    FilterName: String;
  }
  export interface DeleteFilterResponse {
  }
  export interface DeleteIPSetRequest {
    /**
     * The unique ID of the detector associated with the IPSet.
     */
    DetectorId: DetectorId;
    /**
     * The unique ID of the IPSet to delete.
     */
    IpSetId: String;
  }
  export interface DeleteIPSetResponse {
  }
  export interface DeleteInvitationsRequest {
    /**
     * A list of account IDs of the AWS accounts that sent invitations to the current member account that you want to delete invitations from.
     */
    AccountIds: AccountIds;
  }
  export interface DeleteInvitationsResponse {
    /**
     * A list of objects that contain the unprocessed account and a result string that explains why it was unprocessed.
     */
    UnprocessedAccounts: UnprocessedAccounts;
  }
  export interface DeleteMembersRequest {
    /**
     * The unique ID of the detector of the GuardDuty account whose members you want to delete.
     */
    DetectorId: DetectorId;
    /**
     * A list of account IDs of the GuardDuty member accounts that you want to delete.
     */
    AccountIds: AccountIds;
  }
  export interface DeleteMembersResponse {
    /**
     * The accounts that could not be processed.
     */
    UnprocessedAccounts: UnprocessedAccounts;
  }
  export interface DeletePublishingDestinationRequest {
    /**
     * The unique ID of the detector associated with the publishing destination to delete.
     */
    DetectorId: DetectorId;
    /**
     * The ID of the publishing destination to delete.
     */
    DestinationId: String;
  }
  export interface DeletePublishingDestinationResponse {
  }
  export interface DeleteThreatIntelSetRequest {
    /**
     * The unique ID of the detector that the threatIntelSet is associated with.
     */
    DetectorId: DetectorId;
    /**
     * The unique ID of the threatIntelSet that you want to delete.
     */
    ThreatIntelSetId: String;
  }
  export interface DeleteThreatIntelSetResponse {
  }
  export interface DescribeOrganizationConfigurationRequest {
    /**
     * The ID of the detector to retrieve information about the delegated administrator from.
     */
    DetectorId: DetectorId;
  }
  export interface DescribeOrganizationConfigurationResponse {
    /**
     * Indicates whether GuardDuty is automatically enabled for accounts added to the organization.
     */
    AutoEnable: Boolean;
    /**
     * Indicates whether the maximum number of allowed member accounts are already associated with the delegated administrator account for your organization.
     */
    MemberAccountLimitReached: Boolean;
    /**
     * Describes which data sources are enabled automatically for member accounts.
     */
    DataSources?: OrganizationDataSourceConfigurationsResult;
  }
  export interface DescribePublishingDestinationRequest {
    /**
     * The unique ID of the detector associated with the publishing destination to retrieve.
     */
    DetectorId: DetectorId;
    /**
     * The ID of the publishing destination to retrieve.
     */
    DestinationId: String;
  }
  export interface DescribePublishingDestinationResponse {
    /**
     * The ID of the publishing destination.
     */
    DestinationId: String;
    /**
     * The type of publishing destination. Currently, only Amazon S3 buckets are supported.
     */
    DestinationType: DestinationType;
    /**
     * The status of the publishing destination.
     */
    Status: PublishingStatus;
    /**
     * The time, in epoch millisecond format, at which GuardDuty was first unable to publish findings to the destination.
     */
    PublishingFailureStartTimestamp: Long;
    /**
     * A DestinationProperties object that includes the DestinationArn and KmsKeyArn of the publishing destination.
     */
    DestinationProperties: DestinationProperties;
  }
  export interface Destination {
    /**
     * The unique ID of the publishing destination.
     */
    DestinationId: String;
    /**
     * The type of resource used for the publishing destination. Currently, only Amazon S3 buckets are supported.
     */
    DestinationType: DestinationType;
    /**
     * The status of the publishing destination.
     */
    Status: PublishingStatus;
  }
  export interface DestinationProperties {
    /**
     * The ARN of the resource to publish to.
     */
    DestinationArn?: String;
    /**
     * The ARN of the KMS key to use for encryption.
     */
    KmsKeyArn?: String;
  }
  export type DestinationType = "S3"|string;
  export type Destinations = Destination[];
  export type DetectorId = string;
  export type DetectorIds = DetectorId[];
  export type DetectorStatus = "ENABLED"|"DISABLED"|string;
  export interface DisableOrganizationAdminAccountRequest {
    /**
     * The AWS Account ID for the organizations account to be disabled as a GuardDuty delegated administrator.
     */
    AdminAccountId: String;
  }
  export interface DisableOrganizationAdminAccountResponse {
  }
  export interface DisassociateFromMasterAccountRequest {
    /**
     * The unique ID of the detector of the GuardDuty member account.
     */
    DetectorId: DetectorId;
  }
  export interface DisassociateFromMasterAccountResponse {
  }
  export interface DisassociateMembersRequest {
    /**
     * The unique ID of the detector of the GuardDuty account whose members you want to disassociate from the administrator account.
     */
    DetectorId: DetectorId;
    /**
     * A list of account IDs of the GuardDuty member accounts that you want to disassociate from the administrator account.
     */
    AccountIds: AccountIds;
  }
  export interface DisassociateMembersResponse {
    /**
     * A list of objects that contain the unprocessed account and a result string that explains why it was unprocessed.
     */
    UnprocessedAccounts: UnprocessedAccounts;
  }
  export interface DnsRequestAction {
    /**
     * The domain information for the API request.
     */
    Domain?: String;
  }
  export interface DomainDetails {
    /**
     * The domain information for the AWS API call.
     */
    Domain?: String;
  }
  export type Double = number;
  export type Email = string;
  export interface EnableOrganizationAdminAccountRequest {
    /**
     * The AWS Account ID for the organization account to be enabled as a GuardDuty delegated administrator.
     */
    AdminAccountId: String;
  }
  export interface EnableOrganizationAdminAccountResponse {
  }
  export type Eq = String[];
  export type Equals = String[];
  export interface Evidence {
    /**
     * A list of threat intelligence details related to the evidence.
     */
    ThreatIntelligenceDetails?: ThreatIntelligenceDetails;
  }
  export type Feedback = "USEFUL"|"NOT_USEFUL"|string;
  export type FilterAction = "NOOP"|"ARCHIVE"|string;
  export type FilterDescription = string;
  export type FilterName = string;
  export type FilterNames = FilterName[];
  export type FilterRank = number;
  export interface Finding {
    /**
     * The ID of the account in which the finding was generated.
     */
    AccountId: String;
    /**
     * The ARN of the finding.
     */
    Arn: String;
    /**
     * The confidence score for the finding.
     */
    Confidence?: Double;
    /**
     * The time and date when the finding was created.
     */
    CreatedAt: String;
    /**
     * The description of the finding.
     */
    Description?: String;
    /**
     * The ID of the finding.
     */
    Id: String;
    /**
     * The partition associated with the finding.
     */
    Partition?: String;
    /**
     * The Region where the finding was generated.
     */
    Region: String;
    Resource: Resource;
    /**
     * The version of the schema used for the finding.
     */
    SchemaVersion: String;
    Service?: Service;
    /**
     * The severity of the finding.
     */
    Severity: Double;
    /**
     * The title of the finding.
     */
    Title?: String;
    /**
     * The type of finding.
     */
    Type: FindingType;
    /**
     * The time and date when the finding was last updated.
     */
    UpdatedAt: String;
  }
  export interface FindingCriteria {
    /**
     * Represents a map of finding properties that match specified conditions and values when querying findings.
     */
    Criterion?: Criterion;
  }
  export type FindingId = string;
  export type FindingIds = FindingId[];
  export type FindingPublishingFrequency = "FIFTEEN_MINUTES"|"ONE_HOUR"|"SIX_HOURS"|string;
  export type FindingStatisticType = "COUNT_BY_SEVERITY"|string;
  export type FindingStatisticTypes = FindingStatisticType[];
  export interface FindingStatistics {
    /**
     * Represents a map of severity to count statistics for a set of findings.
     */
    CountBySeverity?: CountBySeverity;
  }
  export type FindingType = string;
  export type FindingTypes = FindingType[];
  export type Findings = Finding[];
  export interface FlowLogsConfigurationResult {
    /**
     * Denotes whether VPC flow logs is enabled as a data source.
     */
    Status: DataSourceStatus;
  }
  export interface GeoLocation {
    /**
     * The latitude information of the remote IP address.
     */
    Lat?: Double;
    /**
     * The longitude information of the remote IP address.
     */
    Lon?: Double;
  }
  export interface GetDetectorRequest {
    /**
     * The unique ID of the detector that you want to get.
     */
    DetectorId: DetectorId;
  }
  export interface GetDetectorResponse {
    /**
     * The timestamp of when the detector was created.
     */
    CreatedAt?: String;
    /**
     * The publishing frequency of the finding.
     */
    FindingPublishingFrequency?: FindingPublishingFrequency;
    /**
     * The GuardDuty service role.
     */
    ServiceRole: String;
    /**
     * The detector status.
     */
    Status: DetectorStatus;
    /**
     * The last-updated timestamp for the detector.
     */
    UpdatedAt?: String;
    /**
     * Describes which data sources are enabled for the detector.
     */
    DataSources?: DataSourceConfigurationsResult;
    /**
     * The tags of the detector resource.
     */
    Tags?: TagMap;
  }
  export interface GetFilterRequest {
    /**
     * The unique ID of the detector that the filter is associated with.
     */
    DetectorId: DetectorId;
    /**
     * The name of the filter you want to get.
     */
    FilterName: String;
  }
  export interface GetFilterResponse {
    /**
     * The name of the filter.
     */
    Name: FilterName;
    /**
     * The description of the filter.
     */
    Description?: FilterDescription;
    /**
     * Specifies the action that is to be applied to the findings that match the filter.
     */
    Action: FilterAction;
    /**
     * Specifies the position of the filter in the list of current filters. Also specifies the order in which this filter is applied to the findings.
     */
    Rank?: FilterRank;
    /**
     * Represents the criteria to be used in the filter for querying findings.
     */
    FindingCriteria: FindingCriteria;
    /**
     * The tags of the filter resource.
     */
    Tags?: TagMap;
  }
  export interface GetFindingsRequest {
    /**
     * The ID of the detector that specifies the GuardDuty service whose findings you want to retrieve.
     */
    DetectorId: DetectorId;
    /**
     * The IDs of the findings that you want to retrieve.
     */
    FindingIds: FindingIds;
    /**
     * Represents the criteria used for sorting findings.
     */
    SortCriteria?: SortCriteria;
  }
  export interface GetFindingsResponse {
    /**
     * A list of findings.
     */
    Findings: Findings;
  }
  export interface GetFindingsStatisticsRequest {
    /**
     * The ID of the detector that specifies the GuardDuty service whose findings' statistics you want to retrieve.
     */
    DetectorId: DetectorId;
    /**
     * The types of finding statistics to retrieve.
     */
    FindingStatisticTypes: FindingStatisticTypes;
    /**
     * Represents the criteria that is used for querying findings.
     */
    FindingCriteria?: FindingCriteria;
  }
  export interface GetFindingsStatisticsResponse {
    /**
     * The finding statistics object.
     */
    FindingStatistics: FindingStatistics;
  }
  export interface GetIPSetRequest {
    /**
     * The unique ID of the detector that the IPSet is associated with.
     */
    DetectorId: DetectorId;
    /**
     * The unique ID of the IPSet to retrieve.
     */
    IpSetId: String;
  }
  export interface GetIPSetResponse {
    /**
     * The user-friendly name for the IPSet.
     */
    Name: Name;
    /**
     * The format of the file that contains the IPSet.
     */
    Format: IpSetFormat;
    /**
     * The URI of the file that contains the IPSet. For example: https://s3.us-west-2.amazonaws.com/my-bucket/my-object-key.
     */
    Location: Location;
    /**
     * The status of IPSet file that was uploaded.
     */
    Status: IpSetStatus;
    /**
     * The tags of the IPSet resource.
     */
    Tags?: TagMap;
  }
  export interface GetInvitationsCountRequest {
  }
  export interface GetInvitationsCountResponse {
    /**
     * The number of received invitations.
     */
    InvitationsCount?: Integer;
  }
  export interface GetMasterAccountRequest {
    /**
     * The unique ID of the detector of the GuardDuty member account.
     */
    DetectorId: DetectorId;
  }
  export interface GetMasterAccountResponse {
    /**
     * The administrator account details.
     */
    Master: Master;
  }
  export interface GetMemberDetectorsRequest {
    /**
     * The detector ID for the administrator account.
     */
    DetectorId: DetectorId;
    /**
     * The account ID of the member account.
     */
    AccountIds: AccountIds;
  }
  export interface GetMemberDetectorsResponse {
    /**
     * An object that describes which data sources are enabled for a member account.
     */
    MemberDataSourceConfigurations: MemberDataSourceConfigurations;
    /**
     * A list of member account IDs that were unable to be processed along with an explanation for why they were not processed.
     */
    UnprocessedAccounts: UnprocessedAccounts;
  }
  export interface GetMembersRequest {
    /**
     * The unique ID of the detector of the GuardDuty account whose members you want to retrieve.
     */
    DetectorId: DetectorId;
    /**
     * A list of account IDs of the GuardDuty member accounts that you want to describe.
     */
    AccountIds: AccountIds;
  }
  export interface GetMembersResponse {
    /**
     * A list of members.
     */
    Members: Members;
    /**
     * A list of objects that contain the unprocessed account and a result string that explains why it was unprocessed.
     */
    UnprocessedAccounts: UnprocessedAccounts;
  }
  export interface GetThreatIntelSetRequest {
    /**
     * The unique ID of the detector that the threatIntelSet is associated with.
     */
    DetectorId: DetectorId;
    /**
     * The unique ID of the threatIntelSet that you want to get.
     */
    ThreatIntelSetId: String;
  }
  export interface GetThreatIntelSetResponse {
    /**
     * A user-friendly ThreatIntelSet name displayed in all findings that are generated by activity that involves IP addresses included in this ThreatIntelSet.
     */
    Name: Name;
    /**
     * The format of the threatIntelSet.
     */
    Format: ThreatIntelSetFormat;
    /**
     * The URI of the file that contains the ThreatIntelSet. For example: https://s3.us-west-2.amazonaws.com/my-bucket/my-object-key.
     */
    Location: Location;
    /**
     * The status of threatIntelSet file uploaded.
     */
    Status: ThreatIntelSetStatus;
    /**
     * The tags of the threat list resource.
     */
    Tags?: TagMap;
  }
  export interface GetUsageStatisticsRequest {
    /**
     * The ID of the detector that specifies the GuardDuty service whose usage statistics you want to retrieve.
     */
    DetectorId: DetectorId;
    /**
     * The type of usage statistics to retrieve.
     */
    UsageStatisticType: UsageStatisticType;
    /**
     * Represents the criteria used for querying usage.
     */
    UsageCriteria: UsageCriteria;
    /**
     * The currency unit you would like to view your usage statistics in. Current valid values are USD.
     */
    Unit?: String;
    /**
     * The maximum number of results to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    NextToken?: String;
  }
  export interface GetUsageStatisticsResponse {
    /**
     * The usage statistics object. If a UsageStatisticType was provided, the objects representing other types will be null.
     */
    UsageStatistics?: UsageStatistics;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    NextToken?: String;
  }
  export type GuardDutyArn = string;
  export interface IamInstanceProfile {
    /**
     * The profile ARN of the EC2 instance.
     */
    Arn?: String;
    /**
     * The profile ID of the EC2 instance.
     */
    Id?: String;
  }
  export interface InstanceDetails {
    /**
     * The Availability Zone of the EC2 instance.
     */
    AvailabilityZone?: String;
    /**
     * The profile information of the EC2 instance.
     */
    IamInstanceProfile?: IamInstanceProfile;
    /**
     * The image description of the EC2 instance.
     */
    ImageDescription?: String;
    /**
     * The image ID of the EC2 instance.
     */
    ImageId?: String;
    /**
     * The ID of the EC2 instance.
     */
    InstanceId?: String;
    /**
     * The state of the EC2 instance.
     */
    InstanceState?: String;
    /**
     * The type of the EC2 instance.
     */
    InstanceType?: String;
    /**
     * The Amazon Resource Name (ARN) of the AWS Outpost. Only applicable to AWS Outposts instances.
     */
    OutpostArn?: String;
    /**
     * The launch time of the EC2 instance.
     */
    LaunchTime?: String;
    /**
     * The elastic network interface information of the EC2 instance.
     */
    NetworkInterfaces?: NetworkInterfaces;
    /**
     * The platform of the EC2 instance.
     */
    Platform?: String;
    /**
     * The product code of the EC2 instance.
     */
    ProductCodes?: ProductCodes;
    /**
     * The tags of the EC2 instance.
     */
    Tags?: Tags;
  }
  export type Integer = number;
  export interface Invitation {
    /**
     * The ID of the account that the invitation was sent from.
     */
    AccountId?: AccountId;
    /**
     * The ID of the invitation. This value is used to validate the inviter account to the member account.
     */
    InvitationId?: String;
    /**
     * The status of the relationship between the inviter and invitee accounts.
     */
    RelationshipStatus?: String;
    /**
     * The timestamp when the invitation was sent.
     */
    InvitedAt?: String;
  }
  export type Invitations = Invitation[];
  export interface InviteMembersRequest {
    /**
     * The unique ID of the detector of the GuardDuty account that you want to invite members with.
     */
    DetectorId: DetectorId;
    /**
     * A list of account IDs of the accounts that you want to invite to GuardDuty as members.
     */
    AccountIds: AccountIds;
    /**
     * A Boolean value that specifies whether you want to disable email notification to the accounts that you are inviting to GuardDuty as members.
     */
    DisableEmailNotification?: Boolean;
    /**
     * The invitation message that you want to send to the accounts that you're inviting to GuardDuty as members.
     */
    Message?: String;
  }
  export interface InviteMembersResponse {
    /**
     * A list of objects that contain the unprocessed account and a result string that explains why it was unprocessed.
     */
    UnprocessedAccounts: UnprocessedAccounts;
  }
  export type IpSetFormat = "TXT"|"STIX"|"OTX_CSV"|"ALIEN_VAULT"|"PROOF_POINT"|"FIRE_EYE"|string;
  export type IpSetIds = String[];
  export type IpSetStatus = "INACTIVE"|"ACTIVATING"|"ACTIVE"|"DEACTIVATING"|"ERROR"|"DELETE_PENDING"|"DELETED"|string;
  export type Ipv6Addresses = String[];
  export interface ListDetectorsRequest {
    /**
     * You can use this parameter to indicate the maximum number of items that you want in the response. The default value is 50. The maximum value is 50.
     */
    MaxResults?: MaxResults;
    /**
     * You can use this parameter when paginating results. Set the value of this parameter to null on your first call to the list action. For subsequent calls to the action, fill nextToken in the request with the value of NextToken from the previous response to continue listing data.
     */
    NextToken?: String;
  }
  export interface ListDetectorsResponse {
    /**
     * A list of detector IDs.
     */
    DetectorIds: DetectorIds;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    NextToken?: String;
  }
  export interface ListFiltersRequest {
    /**
     * The unique ID of the detector that the filter is associated with.
     */
    DetectorId: DetectorId;
    /**
     * You can use this parameter to indicate the maximum number of items that you want in the response. The default value is 50. The maximum value is 50.
     */
    MaxResults?: MaxResults;
    /**
     * You can use this parameter when paginating results. Set the value of this parameter to null on your first call to the list action. For subsequent calls to the action, fill nextToken in the request with the value of NextToken from the previous response to continue listing data.
     */
    NextToken?: String;
  }
  export interface ListFiltersResponse {
    /**
     * A list of filter names.
     */
    FilterNames: FilterNames;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    NextToken?: String;
  }
  export interface ListFindingsRequest {
    /**
     * The ID of the detector that specifies the GuardDuty service whose findings you want to list.
     */
    DetectorId: DetectorId;
    /**
     * Represents the criteria used for querying findings. Valid values include:   JSON field name   accountId   region   confidence   id   resource.accessKeyDetails.accessKeyId   resource.accessKeyDetails.principalId   resource.accessKeyDetails.userName   resource.accessKeyDetails.userType   resource.instanceDetails.iamInstanceProfile.id   resource.instanceDetails.imageId   resource.instanceDetails.instanceId   resource.instanceDetails.networkInterfaces.ipv6Addresses   resource.instanceDetails.networkInterfaces.privateIpAddresses.privateIpAddress   resource.instanceDetails.networkInterfaces.publicDnsName   resource.instanceDetails.networkInterfaces.publicIp   resource.instanceDetails.networkInterfaces.securityGroups.groupId   resource.instanceDetails.networkInterfaces.securityGroups.groupName   resource.instanceDetails.networkInterfaces.subnetId   resource.instanceDetails.networkInterfaces.vpcId   resource.instanceDetails.tags.key   resource.instanceDetails.tags.value   resource.resourceType   service.action.actionType   service.action.awsApiCallAction.api   service.action.awsApiCallAction.callerType   service.action.awsApiCallAction.remoteIpDetails.city.cityName   service.action.awsApiCallAction.remoteIpDetails.country.countryName   service.action.awsApiCallAction.remoteIpDetails.ipAddressV4   service.action.awsApiCallAction.remoteIpDetails.organization.asn   service.action.awsApiCallAction.remoteIpDetails.organization.asnOrg   service.action.awsApiCallAction.serviceName   service.action.dnsRequestAction.domain   service.action.networkConnectionAction.blocked   service.action.networkConnectionAction.connectionDirection   service.action.networkConnectionAction.localPortDetails.port   service.action.networkConnectionAction.protocol   service.action.networkConnectionAction.remoteIpDetails.city.cityName   service.action.networkConnectionAction.remoteIpDetails.country.countryName   service.action.networkConnectionAction.remoteIpDetails.ipAddressV4   service.action.networkConnectionAction.remoteIpDetails.organization.asn   service.action.networkConnectionAction.remoteIpDetails.organization.asnOrg   service.action.networkConnectionAction.remotePortDetails.port   service.additionalInfo.threatListName   service.archived When this attribute is set to 'true', only archived findings are listed. When it's set to 'false', only unarchived findings are listed. When this attribute is not set, all existing findings are listed.   service.resourceRole   severity   type   updatedAt Type: Timestamp in Unix Epoch millisecond format: 1486685375000  
     */
    FindingCriteria?: FindingCriteria;
    /**
     * Represents the criteria used for sorting findings.
     */
    SortCriteria?: SortCriteria;
    /**
     * You can use this parameter to indicate the maximum number of items you want in the response. The default value is 50. The maximum value is 50.
     */
    MaxResults?: MaxResults;
    /**
     * You can use this parameter when paginating results. Set the value of this parameter to null on your first call to the list action. For subsequent calls to the action, fill nextToken in the request with the value of NextToken from the previous response to continue listing data.
     */
    NextToken?: String;
  }
  export interface ListFindingsResponse {
    /**
     * The IDs of the findings that you're listing.
     */
    FindingIds: FindingIds;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    NextToken?: String;
  }
  export interface ListIPSetsRequest {
    /**
     * The unique ID of the detector that the IPSet is associated with.
     */
    DetectorId: DetectorId;
    /**
     * You can use this parameter to indicate the maximum number of items you want in the response. The default value is 50. The maximum value is 50.
     */
    MaxResults?: MaxResults;
    /**
     * You can use this parameter when paginating results. Set the value of this parameter to null on your first call to the list action. For subsequent calls to the action, fill nextToken in the request with the value of NextToken from the previous response to continue listing data.
     */
    NextToken?: String;
  }
  export interface ListIPSetsResponse {
    /**
     * The IDs of the IPSet resources.
     */
    IpSetIds: IpSetIds;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    NextToken?: String;
  }
  export interface ListInvitationsRequest {
    /**
     * You can use this parameter to indicate the maximum number of items that you want in the response. The default value is 50. The maximum value is 50.
     */
    MaxResults?: MaxResults;
    /**
     * You can use this parameter when paginating results. Set the value of this parameter to null on your first call to the list action. For subsequent calls to the action, fill nextToken in the request with the value of NextToken from the previous response to continue listing data.
     */
    NextToken?: String;
  }
  export interface ListInvitationsResponse {
    /**
     * A list of invitation descriptions.
     */
    Invitations?: Invitations;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    NextToken?: String;
  }
  export interface ListMembersRequest {
    /**
     * The unique ID of the detector the member is associated with.
     */
    DetectorId: DetectorId;
    /**
     * You can use this parameter to indicate the maximum number of items you want in the response. The default value is 50. The maximum value is 50.
     */
    MaxResults?: MaxResults;
    /**
     * You can use this parameter when paginating results. Set the value of this parameter to null on your first call to the list action. For subsequent calls to the action, fill nextToken in the request with the value of NextToken from the previous response to continue listing data.
     */
    NextToken?: String;
    /**
     * Specifies whether to only return associated members or to return all members (including members who haven't been invited yet or have been disassociated).
     */
    OnlyAssociated?: String;
  }
  export interface ListMembersResponse {
    /**
     * A list of members.
     */
    Members?: Members;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    NextToken?: String;
  }
  export interface ListOrganizationAdminAccountsRequest {
    /**
     * The maximum number of results to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    NextToken?: String;
  }
  export interface ListOrganizationAdminAccountsResponse {
    /**
     * A list of accounts configured as GuardDuty delegated administrators.
     */
    AdminAccounts?: AdminAccounts;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    NextToken?: String;
  }
  export interface ListPublishingDestinationsRequest {
    /**
     * The ID of the detector to retrieve publishing destinations for.
     */
    DetectorId: DetectorId;
    /**
     * The maximum number of results to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    NextToken?: String;
  }
  export interface ListPublishingDestinationsResponse {
    /**
     * A Destinations object that includes information about each publishing destination returned.
     */
    Destinations: Destinations;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    NextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the given GuardDuty resource. 
     */
    ResourceArn: GuardDutyArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags associated with the resource.
     */
    Tags?: TagMap;
  }
  export interface ListThreatIntelSetsRequest {
    /**
     * The unique ID of the detector that the threatIntelSet is associated with.
     */
    DetectorId: DetectorId;
    /**
     * You can use this parameter to indicate the maximum number of items that you want in the response. The default value is 50. The maximum value is 50.
     */
    MaxResults?: MaxResults;
    /**
     * You can use this parameter to paginate results in the response. Set the value of this parameter to null on your first call to the list action. For subsequent calls to the action, fill nextToken in the request with the value of NextToken from the previous response to continue listing data.
     */
    NextToken?: String;
  }
  export interface ListThreatIntelSetsResponse {
    /**
     * The IDs of the ThreatIntelSet resources.
     */
    ThreatIntelSetIds: ThreatIntelSetIds;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    NextToken?: String;
  }
  export interface LocalIpDetails {
    /**
     * The IPv4 local address of the connection.
     */
    IpAddressV4?: String;
  }
  export interface LocalPortDetails {
    /**
     * The port number of the local connection.
     */
    Port?: Integer;
    /**
     * The port name of the local connection.
     */
    PortName?: String;
  }
  export type Location = string;
  export type Long = number;
  export interface Master {
    /**
     * The ID of the account used as the administrator account.
     */
    AccountId?: AccountId;
    /**
     * The value used to validate the administrator account to the member account.
     */
    InvitationId?: String;
    /**
     * The status of the relationship between the administrator and member accounts.
     */
    RelationshipStatus?: String;
    /**
     * The timestamp when the invitation was sent.
     */
    InvitedAt?: String;
  }
  export type MaxResults = number;
  export interface Member {
    /**
     * The ID of the member account.
     */
    AccountId: AccountId;
    /**
     * The detector ID of the member account.
     */
    DetectorId?: DetectorId;
    /**
     * The administrator account ID.
     */
    MasterId: String;
    /**
     * The email address of the member account.
     */
    Email: Email;
    /**
     * The status of the relationship between the member and the administrator.
     */
    RelationshipStatus: String;
    /**
     * The timestamp when the invitation was sent.
     */
    InvitedAt?: String;
    /**
     * The last-updated timestamp of the member.
     */
    UpdatedAt: String;
  }
  export interface MemberDataSourceConfiguration {
    /**
     * The account ID for the member account.
     */
    AccountId: AccountId;
    /**
     * Contains information on the status of data sources for the account.
     */
    DataSources: DataSourceConfigurationsResult;
  }
  export type MemberDataSourceConfigurations = MemberDataSourceConfiguration[];
  export type Members = Member[];
  export type Name = string;
  export type Neq = String[];
  export interface NetworkConnectionAction {
    /**
     * Indicates whether EC2 blocked the network connection to your instance.
     */
    Blocked?: Boolean;
    /**
     * The network connection direction.
     */
    ConnectionDirection?: String;
    /**
     * The local port information of the connection.
     */
    LocalPortDetails?: LocalPortDetails;
    /**
     * The network connection protocol.
     */
    Protocol?: String;
    /**
     * The local IP information of the connection.
     */
    LocalIpDetails?: LocalIpDetails;
    /**
     * The remote IP information of the connection.
     */
    RemoteIpDetails?: RemoteIpDetails;
    /**
     * The remote port information of the connection.
     */
    RemotePortDetails?: RemotePortDetails;
  }
  export interface NetworkInterface {
    /**
     * A list of IPv6 addresses for the EC2 instance.
     */
    Ipv6Addresses?: Ipv6Addresses;
    /**
     * The ID of the network interface.
     */
    NetworkInterfaceId?: String;
    /**
     * The private DNS name of the EC2 instance.
     */
    PrivateDnsName?: String;
    /**
     * The private IP address of the EC2 instance.
     */
    PrivateIpAddress?: String;
    /**
     * Other private IP address information of the EC2 instance.
     */
    PrivateIpAddresses?: PrivateIpAddresses;
    /**
     * The public DNS name of the EC2 instance.
     */
    PublicDnsName?: String;
    /**
     * The public IP address of the EC2 instance.
     */
    PublicIp?: String;
    /**
     * The security groups associated with the EC2 instance.
     */
    SecurityGroups?: SecurityGroups;
    /**
     * The subnet ID of the EC2 instance.
     */
    SubnetId?: String;
    /**
     * The VPC ID of the EC2 instance.
     */
    VpcId?: String;
  }
  export type NetworkInterfaces = NetworkInterface[];
  export type NotEquals = String[];
  export type OrderBy = "ASC"|"DESC"|string;
  export interface Organization {
    /**
     * The Autonomous System Number (ASN) of the internet provider of the remote IP address.
     */
    Asn?: String;
    /**
     * The organization that registered this ASN.
     */
    AsnOrg?: String;
    /**
     * The ISP information for the internet provider.
     */
    Isp?: String;
    /**
     * The name of the internet provider.
     */
    Org?: String;
  }
  export interface OrganizationDataSourceConfigurations {
    /**
     * Describes whether S3 data event logs are enabled for new members of the organization.
     */
    S3Logs?: OrganizationS3LogsConfiguration;
  }
  export interface OrganizationDataSourceConfigurationsResult {
    /**
     * Describes whether S3 data event logs are enabled as a data source.
     */
    S3Logs: OrganizationS3LogsConfigurationResult;
  }
  export interface OrganizationS3LogsConfiguration {
    /**
     * A value that contains information on whether S3 data event logs will be enabled automatically as a data source for the organization.
     */
    AutoEnable: Boolean;
  }
  export interface OrganizationS3LogsConfigurationResult {
    /**
     * A value that describes whether S3 data event logs are automatically enabled for new members of the organization.
     */
    AutoEnable: Boolean;
  }
  export interface Owner {
    /**
     * The canonical user ID of the bucket owner. For information about locating your canonical user ID see Finding Your Account Canonical User ID. 
     */
    Id?: String;
  }
  export interface PermissionConfiguration {
    /**
     * Contains information about the bucket level permissions for the S3 bucket.
     */
    BucketLevelPermissions?: BucketLevelPermissions;
    /**
     * Contains information about the account level permissions on the S3 bucket.
     */
    AccountLevelPermissions?: AccountLevelPermissions;
  }
  export interface PortProbeAction {
    /**
     * Indicates whether EC2 blocked the port probe to the instance, such as with an ACL.
     */
    Blocked?: Boolean;
    /**
     * A list of objects related to port probe details.
     */
    PortProbeDetails?: PortProbeDetails;
  }
  export interface PortProbeDetail {
    /**
     * The local port information of the connection.
     */
    LocalPortDetails?: LocalPortDetails;
    /**
     * The local IP information of the connection.
     */
    LocalIpDetails?: LocalIpDetails;
    /**
     * The remote IP information of the connection.
     */
    RemoteIpDetails?: RemoteIpDetails;
  }
  export type PortProbeDetails = PortProbeDetail[];
  export interface PrivateIpAddressDetails {
    /**
     * The private DNS name of the EC2 instance.
     */
    PrivateDnsName?: String;
    /**
     * The private IP address of the EC2 instance.
     */
    PrivateIpAddress?: String;
  }
  export type PrivateIpAddresses = PrivateIpAddressDetails[];
  export interface ProductCode {
    /**
     * The product code information.
     */
    Code?: String;
    /**
     * The product code type.
     */
    ProductType?: String;
  }
  export type ProductCodes = ProductCode[];
  export interface PublicAccess {
    /**
     * Contains information about how permissions are configured for the S3 bucket.
     */
    PermissionConfiguration?: PermissionConfiguration;
    /**
     * Describes the effective permission on this bucket after factoring all attached policies.
     */
    EffectivePermission?: String;
  }
  export type PublishingStatus = "PENDING_VERIFICATION"|"PUBLISHING"|"UNABLE_TO_PUBLISH_FIX_DESTINATION_PROPERTY"|"STOPPED"|string;
  export interface RemoteIpDetails {
    /**
     * The city information of the remote IP address.
     */
    City?: City;
    /**
     * The country code of the remote IP address.
     */
    Country?: Country;
    /**
     * The location information of the remote IP address.
     */
    GeoLocation?: GeoLocation;
    /**
     * The IPv4 remote address of the connection.
     */
    IpAddressV4?: String;
    /**
     * The ISP organization information of the remote IP address.
     */
    Organization?: Organization;
  }
  export interface RemotePortDetails {
    /**
     * The port number of the remote connection.
     */
    Port?: Integer;
    /**
     * The port name of the remote connection.
     */
    PortName?: String;
  }
  export interface Resource {
    /**
     * The IAM access key details (IAM user information) of a user that engaged in the activity that prompted GuardDuty to generate a finding.
     */
    AccessKeyDetails?: AccessKeyDetails;
    /**
     * Contains information on the S3 bucket.
     */
    S3BucketDetails?: S3BucketDetails;
    /**
     * The information about the EC2 instance associated with the activity that prompted GuardDuty to generate a finding.
     */
    InstanceDetails?: InstanceDetails;
    /**
     * The type of AWS resource.
     */
    ResourceType?: String;
  }
  export type ResourceList = String[];
  export interface S3BucketDetail {
    /**
     * The Amazon Resource Name (ARN) of the S3 bucket.
     */
    Arn?: String;
    /**
     * The name of the S3 bucket.
     */
    Name?: String;
    /**
     * Describes whether the bucket is a source or destination bucket.
     */
    Type?: String;
    /**
     * The date and time the bucket was created at.
     */
    CreatedAt?: Timestamp;
    /**
     * The owner of the S3 bucket.
     */
    Owner?: Owner;
    /**
     * All tags attached to the S3 bucket
     */
    Tags?: Tags;
    /**
     * Describes the server side encryption method used in the S3 bucket.
     */
    DefaultServerSideEncryption?: DefaultServerSideEncryption;
    /**
     * Describes the public access policies that apply to the S3 bucket.
     */
    PublicAccess?: PublicAccess;
  }
  export type S3BucketDetails = S3BucketDetail[];
  export interface S3LogsConfiguration {
    /**
     *  The status of S3 data event logs as a data source.
     */
    Enable: Boolean;
  }
  export interface S3LogsConfigurationResult {
    /**
     * A value that describes whether S3 data event logs are automatically enabled for new members of the organization.
     */
    Status: DataSourceStatus;
  }
  export interface SecurityGroup {
    /**
     * The security group ID of the EC2 instance.
     */
    GroupId?: String;
    /**
     * The security group name of the EC2 instance.
     */
    GroupName?: String;
  }
  export type SecurityGroups = SecurityGroup[];
  export interface Service {
    /**
     * Information about the activity that is described in a finding.
     */
    Action?: Action;
    /**
     * An evidence object associated with the service.
     */
    Evidence?: Evidence;
    /**
     * Indicates whether this finding is archived.
     */
    Archived?: Boolean;
    /**
     * The total count of the occurrences of this finding type.
     */
    Count?: Integer;
    /**
     * The detector ID for the GuardDuty service.
     */
    DetectorId?: DetectorId;
    /**
     * The first-seen timestamp of the activity that prompted GuardDuty to generate this finding.
     */
    EventFirstSeen?: String;
    /**
     * The last-seen timestamp of the activity that prompted GuardDuty to generate this finding.
     */
    EventLastSeen?: String;
    /**
     * The resource role information for this finding.
     */
    ResourceRole?: String;
    /**
     * The name of the AWS service (GuardDuty) that generated a finding.
     */
    ServiceName?: String;
    /**
     * Feedback that was submitted about the finding.
     */
    UserFeedback?: String;
  }
  export interface SortCriteria {
    /**
     * Represents the finding attribute (for example, accountId) to sort findings by.
     */
    AttributeName?: String;
    /**
     * The order by which the sorted findings are to be displayed.
     */
    OrderBy?: OrderBy;
  }
  export interface StartMonitoringMembersRequest {
    /**
     * The unique ID of the detector of the GuardDuty administrator account associated with the member accounts to monitor.
     */
    DetectorId: DetectorId;
    /**
     * A list of account IDs of the GuardDuty member accounts to start monitoring.
     */
    AccountIds: AccountIds;
  }
  export interface StartMonitoringMembersResponse {
    /**
     * A list of objects that contain the unprocessed account and a result string that explains why it was unprocessed.
     */
    UnprocessedAccounts: UnprocessedAccounts;
  }
  export interface StopMonitoringMembersRequest {
    /**
     * The unique ID of the detector associated with the GuardDuty administrator account that is monitoring member accounts.
     */
    DetectorId: DetectorId;
    /**
     * A list of account IDs for the member accounts to stop monitoring.
     */
    AccountIds: AccountIds;
  }
  export interface StopMonitoringMembersResponse {
    /**
     * A list of objects that contain an accountId for each account that could not be processed, and a result string that indicates why the account was not processed. 
     */
    UnprocessedAccounts: UnprocessedAccounts;
  }
  export type String = string;
  export interface Tag {
    /**
     * The EC2 instance tag key.
     */
    Key?: String;
    /**
     * The EC2 instance tag value.
     */
    Value?: String;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the GuardDuty resource to apply a tag to.
     */
    ResourceArn: GuardDutyArn;
    /**
     * The tags to be added to a resource.
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export type ThreatIntelSetFormat = "TXT"|"STIX"|"OTX_CSV"|"ALIEN_VAULT"|"PROOF_POINT"|"FIRE_EYE"|string;
  export type ThreatIntelSetIds = String[];
  export type ThreatIntelSetStatus = "INACTIVE"|"ACTIVATING"|"ACTIVE"|"DEACTIVATING"|"ERROR"|"DELETE_PENDING"|"DELETED"|string;
  export interface ThreatIntelligenceDetail {
    /**
     * The name of the threat intelligence list that triggered the finding.
     */
    ThreatListName?: String;
    /**
     * A list of names of the threats in the threat intelligence list that triggered the finding.
     */
    ThreatNames?: ThreatNames;
  }
  export type ThreatIntelligenceDetails = ThreatIntelligenceDetail[];
  export type ThreatNames = String[];
  export type Timestamp = Date;
  export interface Total {
    /**
     * The total usage.
     */
    Amount?: String;
    /**
     * The currency unit that the amount is given in.
     */
    Unit?: String;
  }
  export interface UnarchiveFindingsRequest {
    /**
     * The ID of the detector associated with the findings to unarchive.
     */
    DetectorId: DetectorId;
    /**
     * The IDs of the findings to unarchive.
     */
    FindingIds: FindingIds;
  }
  export interface UnarchiveFindingsResponse {
  }
  export interface UnprocessedAccount {
    /**
     * The AWS account ID.
     */
    AccountId: AccountId;
    /**
     * A reason why the account hasn't been processed.
     */
    Result: String;
  }
  export type UnprocessedAccounts = UnprocessedAccount[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the resource to remove tags from.
     */
    ResourceArn: GuardDutyArn;
    /**
     * The tag keys to remove from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDetectorRequest {
    /**
     * The unique ID of the detector to update.
     */
    DetectorId: DetectorId;
    /**
     * Specifies whether the detector is enabled or not enabled.
     */
    Enable?: Boolean;
    /**
     * An enum value that specifies how frequently findings are exported, such as to CloudWatch Events.
     */
    FindingPublishingFrequency?: FindingPublishingFrequency;
    /**
     * Describes which data sources will be updated.
     */
    DataSources?: DataSourceConfigurations;
  }
  export interface UpdateDetectorResponse {
  }
  export interface UpdateFilterRequest {
    /**
     * The unique ID of the detector that specifies the GuardDuty service where you want to update a filter.
     */
    DetectorId: DetectorId;
    /**
     * The name of the filter.
     */
    FilterName: String;
    /**
     * The description of the filter.
     */
    Description?: FilterDescription;
    /**
     * Specifies the action that is to be applied to the findings that match the filter.
     */
    Action?: FilterAction;
    /**
     * Specifies the position of the filter in the list of current filters. Also specifies the order in which this filter is applied to the findings.
     */
    Rank?: FilterRank;
    /**
     * Represents the criteria to be used in the filter for querying findings.
     */
    FindingCriteria?: FindingCriteria;
  }
  export interface UpdateFilterResponse {
    /**
     * The name of the filter.
     */
    Name: FilterName;
  }
  export interface UpdateFindingsFeedbackRequest {
    /**
     * The ID of the detector associated with the findings to update feedback for.
     */
    DetectorId: DetectorId;
    /**
     * The IDs of the findings that you want to mark as useful or not useful.
     */
    FindingIds: FindingIds;
    /**
     * The feedback for the finding.
     */
    Feedback: Feedback;
    /**
     * Additional feedback about the GuardDuty findings.
     */
    Comments?: String;
  }
  export interface UpdateFindingsFeedbackResponse {
  }
  export interface UpdateIPSetRequest {
    /**
     * The detectorID that specifies the GuardDuty service whose IPSet you want to update.
     */
    DetectorId: DetectorId;
    /**
     * The unique ID that specifies the IPSet that you want to update.
     */
    IpSetId: String;
    /**
     * The unique ID that specifies the IPSet that you want to update.
     */
    Name?: Name;
    /**
     * The updated URI of the file that contains the IPSet. For example: https://s3.us-west-2.amazonaws.com/my-bucket/my-object-key.
     */
    Location?: Location;
    /**
     * The updated Boolean value that specifies whether the IPSet is active or not.
     */
    Activate?: Boolean;
  }
  export interface UpdateIPSetResponse {
  }
  export interface UpdateMemberDetectorsRequest {
    /**
     * The detector ID of the administrator account.
     */
    DetectorId: DetectorId;
    /**
     * A list of member account IDs to be updated.
     */
    AccountIds: AccountIds;
    /**
     * Describes which data sources will be updated.
     */
    DataSources?: DataSourceConfigurations;
  }
  export interface UpdateMemberDetectorsResponse {
    /**
     * A list of member account IDs that were unable to be processed along with an explanation for why they were not processed.
     */
    UnprocessedAccounts: UnprocessedAccounts;
  }
  export interface UpdateOrganizationConfigurationRequest {
    /**
     * The ID of the detector to update the delegated administrator for.
     */
    DetectorId: DetectorId;
    /**
     * Indicates whether to automatically enable member accounts in the organization.
     */
    AutoEnable: Boolean;
    /**
     * Describes which data sources will be updated.
     */
    DataSources?: OrganizationDataSourceConfigurations;
  }
  export interface UpdateOrganizationConfigurationResponse {
  }
  export interface UpdatePublishingDestinationRequest {
    /**
     * The ID of the detector associated with the publishing destinations to update.
     */
    DetectorId: DetectorId;
    /**
     * The ID of the publishing destination to update.
     */
    DestinationId: String;
    /**
     * A DestinationProperties object that includes the DestinationArn and KmsKeyArn of the publishing destination.
     */
    DestinationProperties?: DestinationProperties;
  }
  export interface UpdatePublishingDestinationResponse {
  }
  export interface UpdateThreatIntelSetRequest {
    /**
     * The detectorID that specifies the GuardDuty service whose ThreatIntelSet you want to update.
     */
    DetectorId: DetectorId;
    /**
     * The unique ID that specifies the ThreatIntelSet that you want to update.
     */
    ThreatIntelSetId: String;
    /**
     * The unique ID that specifies the ThreatIntelSet that you want to update.
     */
    Name?: Name;
    /**
     * The updated URI of the file that contains the ThreateIntelSet.
     */
    Location?: Location;
    /**
     * The updated Boolean value that specifies whether the ThreateIntelSet is active or not.
     */
    Activate?: Boolean;
  }
  export interface UpdateThreatIntelSetResponse {
  }
  export interface UsageAccountResult {
    /**
     * The Account ID that generated usage.
     */
    AccountId?: AccountId;
    /**
     * Represents the total of usage for the Account ID.
     */
    Total?: Total;
  }
  export type UsageAccountResultList = UsageAccountResult[];
  export interface UsageCriteria {
    /**
     * The account IDs to aggregate usage statistics from.
     */
    AccountIds?: AccountIds;
    /**
     * The data sources to aggregate usage statistics from.
     */
    DataSources: DataSourceList;
    /**
     * The resources to aggregate usage statistics from. Only accepts exact resource names.
     */
    Resources?: ResourceList;
  }
  export interface UsageDataSourceResult {
    /**
     * The data source type that generated usage.
     */
    DataSource?: DataSource;
    /**
     * Represents the total of usage for the specified data source.
     */
    Total?: Total;
  }
  export type UsageDataSourceResultList = UsageDataSourceResult[];
  export interface UsageResourceResult {
    /**
     * The AWS resource that generated usage.
     */
    Resource?: String;
    /**
     * Represents the sum total of usage for the specified resource type.
     */
    Total?: Total;
  }
  export type UsageResourceResultList = UsageResourceResult[];
  export type UsageStatisticType = "SUM_BY_ACCOUNT"|"SUM_BY_DATA_SOURCE"|"SUM_BY_RESOURCE"|"TOP_RESOURCES"|string;
  export interface UsageStatistics {
    /**
     * The usage statistic sum organized by account ID.
     */
    SumByAccount?: UsageAccountResultList;
    /**
     * The usage statistic sum organized by on data source.
     */
    SumByDataSource?: UsageDataSourceResultList;
    /**
     * The usage statistic sum organized by resource.
     */
    SumByResource?: UsageResourceResultList;
    /**
     * Lists the top 50 resources that have generated the most GuardDuty usage, in order from most to least expensive.
     */
    TopResources?: UsageResourceResultList;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-11-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the GuardDuty client.
   */
  export import Types = GuardDuty;
}
export = GuardDuty;
