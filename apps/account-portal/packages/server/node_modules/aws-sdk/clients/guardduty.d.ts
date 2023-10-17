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
   * Accepts the invitation to be a member account and get monitored by a GuardDuty administrator account that sent the invitation.
   */
  acceptAdministratorInvitation(params: GuardDuty.Types.AcceptAdministratorInvitationRequest, callback?: (err: AWSError, data: GuardDuty.Types.AcceptAdministratorInvitationResponse) => void): Request<GuardDuty.Types.AcceptAdministratorInvitationResponse, AWSError>;
  /**
   * Accepts the invitation to be a member account and get monitored by a GuardDuty administrator account that sent the invitation.
   */
  acceptAdministratorInvitation(callback?: (err: AWSError, data: GuardDuty.Types.AcceptAdministratorInvitationResponse) => void): Request<GuardDuty.Types.AcceptAdministratorInvitationResponse, AWSError>;
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
   * Creates a single Amazon GuardDuty detector. A detector is a resource that represents the GuardDuty service. To start using GuardDuty, you must create a detector in each Region where you enable the service. You can have only one detector per account per Region. All data sources are enabled in a new detector by default. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  createDetector(params: GuardDuty.Types.CreateDetectorRequest, callback?: (err: AWSError, data: GuardDuty.Types.CreateDetectorResponse) => void): Request<GuardDuty.Types.CreateDetectorResponse, AWSError>;
  /**
   * Creates a single Amazon GuardDuty detector. A detector is a resource that represents the GuardDuty service. To start using GuardDuty, you must create a detector in each Region where you enable the service. You can have only one detector per account per Region. All data sources are enabled in a new detector by default. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  createDetector(callback?: (err: AWSError, data: GuardDuty.Types.CreateDetectorResponse) => void): Request<GuardDuty.Types.CreateDetectorResponse, AWSError>;
  /**
   * Creates a filter using the specified finding criteria. The maximum number of saved filters per Amazon Web Services account per Region is 100. For more information, see Quotas for GuardDuty.
   */
  createFilter(params: GuardDuty.Types.CreateFilterRequest, callback?: (err: AWSError, data: GuardDuty.Types.CreateFilterResponse) => void): Request<GuardDuty.Types.CreateFilterResponse, AWSError>;
  /**
   * Creates a filter using the specified finding criteria. The maximum number of saved filters per Amazon Web Services account per Region is 100. For more information, see Quotas for GuardDuty.
   */
  createFilter(callback?: (err: AWSError, data: GuardDuty.Types.CreateFilterResponse) => void): Request<GuardDuty.Types.CreateFilterResponse, AWSError>;
  /**
   * Creates a new IPSet, which is called a trusted IP list in the console user interface. An IPSet is a list of IP addresses that are trusted for secure communication with Amazon Web Services infrastructure and applications. GuardDuty doesn't generate findings for IP addresses that are included in IPSets. Only users from the administrator account can use this operation.
   */
  createIPSet(params: GuardDuty.Types.CreateIPSetRequest, callback?: (err: AWSError, data: GuardDuty.Types.CreateIPSetResponse) => void): Request<GuardDuty.Types.CreateIPSetResponse, AWSError>;
  /**
   * Creates a new IPSet, which is called a trusted IP list in the console user interface. An IPSet is a list of IP addresses that are trusted for secure communication with Amazon Web Services infrastructure and applications. GuardDuty doesn't generate findings for IP addresses that are included in IPSets. Only users from the administrator account can use this operation.
   */
  createIPSet(callback?: (err: AWSError, data: GuardDuty.Types.CreateIPSetResponse) => void): Request<GuardDuty.Types.CreateIPSetResponse, AWSError>;
  /**
   * Creates member accounts of the current Amazon Web Services account by specifying a list of Amazon Web Services account IDs. This step is a prerequisite for managing the associated member accounts either by invitation or through an organization. As a delegated administrator, using CreateMembers will enable GuardDuty in the added member accounts, with the exception of the organization delegated administrator account. A delegated administrator must enable GuardDuty prior to being added as a member. If you are adding accounts by invitation, before using InviteMembers, use CreateMembers after GuardDuty has been enabled in potential member accounts. If you disassociate a member from a GuardDuty delegated administrator, the member account details obtained from this API, including the associated email addresses, will be retained. This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To remove the details associated with a member account, the delegated administrator must invoke the DeleteMembers API. 
   */
  createMembers(params: GuardDuty.Types.CreateMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.CreateMembersResponse) => void): Request<GuardDuty.Types.CreateMembersResponse, AWSError>;
  /**
   * Creates member accounts of the current Amazon Web Services account by specifying a list of Amazon Web Services account IDs. This step is a prerequisite for managing the associated member accounts either by invitation or through an organization. As a delegated administrator, using CreateMembers will enable GuardDuty in the added member accounts, with the exception of the organization delegated administrator account. A delegated administrator must enable GuardDuty prior to being added as a member. If you are adding accounts by invitation, before using InviteMembers, use CreateMembers after GuardDuty has been enabled in potential member accounts. If you disassociate a member from a GuardDuty delegated administrator, the member account details obtained from this API, including the associated email addresses, will be retained. This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To remove the details associated with a member account, the delegated administrator must invoke the DeleteMembers API. 
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
   * Generates sample findings of types specified by the list of finding types. If 'NULL' is specified for findingTypes, the API generates sample findings of all supported finding types.
   */
  createSampleFindings(params: GuardDuty.Types.CreateSampleFindingsRequest, callback?: (err: AWSError, data: GuardDuty.Types.CreateSampleFindingsResponse) => void): Request<GuardDuty.Types.CreateSampleFindingsResponse, AWSError>;
  /**
   * Generates sample findings of types specified by the list of finding types. If 'NULL' is specified for findingTypes, the API generates sample findings of all supported finding types.
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
   * Declines invitations sent to the current member account by Amazon Web Services accounts specified by their account IDs.
   */
  declineInvitations(params: GuardDuty.Types.DeclineInvitationsRequest, callback?: (err: AWSError, data: GuardDuty.Types.DeclineInvitationsResponse) => void): Request<GuardDuty.Types.DeclineInvitationsResponse, AWSError>;
  /**
   * Declines invitations sent to the current member account by Amazon Web Services accounts specified by their account IDs.
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
   * Deletes invitations sent to the current member account by Amazon Web Services accounts specified by their account IDs.
   */
  deleteInvitations(params: GuardDuty.Types.DeleteInvitationsRequest, callback?: (err: AWSError, data: GuardDuty.Types.DeleteInvitationsResponse) => void): Request<GuardDuty.Types.DeleteInvitationsResponse, AWSError>;
  /**
   * Deletes invitations sent to the current member account by Amazon Web Services accounts specified by their account IDs.
   */
  deleteInvitations(callback?: (err: AWSError, data: GuardDuty.Types.DeleteInvitationsResponse) => void): Request<GuardDuty.Types.DeleteInvitationsResponse, AWSError>;
  /**
   * Deletes GuardDuty member accounts (to the current GuardDuty administrator account) specified by the account IDs. With autoEnableOrganizationMembers configuration for your organization set to ALL, you'll receive an error if you attempt to disable GuardDuty for a member account in your organization.
   */
  deleteMembers(params: GuardDuty.Types.DeleteMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.DeleteMembersResponse) => void): Request<GuardDuty.Types.DeleteMembersResponse, AWSError>;
  /**
   * Deletes GuardDuty member accounts (to the current GuardDuty administrator account) specified by the account IDs. With autoEnableOrganizationMembers configuration for your organization set to ALL, you'll receive an error if you attempt to disable GuardDuty for a member account in your organization.
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
   * Returns a list of malware scans. Each member account can view the malware scans for their own accounts. An administrator can view the malware scans for all the member accounts. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  describeMalwareScans(params: GuardDuty.Types.DescribeMalwareScansRequest, callback?: (err: AWSError, data: GuardDuty.Types.DescribeMalwareScansResponse) => void): Request<GuardDuty.Types.DescribeMalwareScansResponse, AWSError>;
  /**
   * Returns a list of malware scans. Each member account can view the malware scans for their own accounts. An administrator can view the malware scans for all the member accounts. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  describeMalwareScans(callback?: (err: AWSError, data: GuardDuty.Types.DescribeMalwareScansResponse) => void): Request<GuardDuty.Types.DescribeMalwareScansResponse, AWSError>;
  /**
   * Returns information about the account selected as the delegated administrator for GuardDuty. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  describeOrganizationConfiguration(params: GuardDuty.Types.DescribeOrganizationConfigurationRequest, callback?: (err: AWSError, data: GuardDuty.Types.DescribeOrganizationConfigurationResponse) => void): Request<GuardDuty.Types.DescribeOrganizationConfigurationResponse, AWSError>;
  /**
   * Returns information about the account selected as the delegated administrator for GuardDuty. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
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
   * Removes the existing GuardDuty delegated administrator of the organization. Only the organization's management account can run this API operation.
   */
  disableOrganizationAdminAccount(params: GuardDuty.Types.DisableOrganizationAdminAccountRequest, callback?: (err: AWSError, data: GuardDuty.Types.DisableOrganizationAdminAccountResponse) => void): Request<GuardDuty.Types.DisableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Removes the existing GuardDuty delegated administrator of the organization. Only the organization's management account can run this API operation.
   */
  disableOrganizationAdminAccount(callback?: (err: AWSError, data: GuardDuty.Types.DisableOrganizationAdminAccountResponse) => void): Request<GuardDuty.Types.DisableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Disassociates the current GuardDuty member account from its administrator account. When you disassociate an invited member from a GuardDuty delegated administrator, the member account details obtained from the CreateMembers API, including the associated email addresses, are retained. This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To remove the details associated with a member account, the delegated administrator must invoke the DeleteMembers API.  With autoEnableOrganizationMembers configuration for your organization set to ALL, you'll receive an error if you attempt to disable GuardDuty in a member account.
   */
  disassociateFromAdministratorAccount(params: GuardDuty.Types.DisassociateFromAdministratorAccountRequest, callback?: (err: AWSError, data: GuardDuty.Types.DisassociateFromAdministratorAccountResponse) => void): Request<GuardDuty.Types.DisassociateFromAdministratorAccountResponse, AWSError>;
  /**
   * Disassociates the current GuardDuty member account from its administrator account. When you disassociate an invited member from a GuardDuty delegated administrator, the member account details obtained from the CreateMembers API, including the associated email addresses, are retained. This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To remove the details associated with a member account, the delegated administrator must invoke the DeleteMembers API.  With autoEnableOrganizationMembers configuration for your organization set to ALL, you'll receive an error if you attempt to disable GuardDuty in a member account.
   */
  disassociateFromAdministratorAccount(callback?: (err: AWSError, data: GuardDuty.Types.DisassociateFromAdministratorAccountResponse) => void): Request<GuardDuty.Types.DisassociateFromAdministratorAccountResponse, AWSError>;
  /**
   * Disassociates the current GuardDuty member account from its administrator account. When you disassociate an invited member from a GuardDuty delegated administrator, the member account details obtained from the CreateMembers API, including the associated email addresses, are retained. This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To remove the details associated with a member account, the delegated administrator must invoke the DeleteMembers API.
   */
  disassociateFromMasterAccount(params: GuardDuty.Types.DisassociateFromMasterAccountRequest, callback?: (err: AWSError, data: GuardDuty.Types.DisassociateFromMasterAccountResponse) => void): Request<GuardDuty.Types.DisassociateFromMasterAccountResponse, AWSError>;
  /**
   * Disassociates the current GuardDuty member account from its administrator account. When you disassociate an invited member from a GuardDuty delegated administrator, the member account details obtained from the CreateMembers API, including the associated email addresses, are retained. This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To remove the details associated with a member account, the delegated administrator must invoke the DeleteMembers API.
   */
  disassociateFromMasterAccount(callback?: (err: AWSError, data: GuardDuty.Types.DisassociateFromMasterAccountResponse) => void): Request<GuardDuty.Types.DisassociateFromMasterAccountResponse, AWSError>;
  /**
   * Disassociates GuardDuty member accounts (from the current administrator account) specified by the account IDs. When you disassociate an invited member from a GuardDuty delegated administrator, the member account details obtained from the CreateMembers API, including the associated email addresses, are retained. This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To remove the details associated with a member account, the delegated administrator must invoke the DeleteMembers API.  With autoEnableOrganizationMembers configuration for your organization set to ALL, you'll receive an error if you attempt to disassociate a member account before removing them from your organization.
   */
  disassociateMembers(params: GuardDuty.Types.DisassociateMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.DisassociateMembersResponse) => void): Request<GuardDuty.Types.DisassociateMembersResponse, AWSError>;
  /**
   * Disassociates GuardDuty member accounts (from the current administrator account) specified by the account IDs. When you disassociate an invited member from a GuardDuty delegated administrator, the member account details obtained from the CreateMembers API, including the associated email addresses, are retained. This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To remove the details associated with a member account, the delegated administrator must invoke the DeleteMembers API.  With autoEnableOrganizationMembers configuration for your organization set to ALL, you'll receive an error if you attempt to disassociate a member account before removing them from your organization.
   */
  disassociateMembers(callback?: (err: AWSError, data: GuardDuty.Types.DisassociateMembersResponse) => void): Request<GuardDuty.Types.DisassociateMembersResponse, AWSError>;
  /**
   * Designates an Amazon Web Services account within the organization as your GuardDuty delegated administrator. Only the organization's management account can run this API operation.
   */
  enableOrganizationAdminAccount(params: GuardDuty.Types.EnableOrganizationAdminAccountRequest, callback?: (err: AWSError, data: GuardDuty.Types.EnableOrganizationAdminAccountResponse) => void): Request<GuardDuty.Types.EnableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Designates an Amazon Web Services account within the organization as your GuardDuty delegated administrator. Only the organization's management account can run this API operation.
   */
  enableOrganizationAdminAccount(callback?: (err: AWSError, data: GuardDuty.Types.EnableOrganizationAdminAccountResponse) => void): Request<GuardDuty.Types.EnableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Provides the details of the GuardDuty administrator account associated with the current GuardDuty member account.  If the organization's management account or a delegated administrator runs this API, it will return success (HTTP 200) but no content. 
   */
  getAdministratorAccount(params: GuardDuty.Types.GetAdministratorAccountRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetAdministratorAccountResponse) => void): Request<GuardDuty.Types.GetAdministratorAccountResponse, AWSError>;
  /**
   * Provides the details of the GuardDuty administrator account associated with the current GuardDuty member account.  If the organization's management account or a delegated administrator runs this API, it will return success (HTTP 200) but no content. 
   */
  getAdministratorAccount(callback?: (err: AWSError, data: GuardDuty.Types.GetAdministratorAccountResponse) => void): Request<GuardDuty.Types.GetAdministratorAccountResponse, AWSError>;
  /**
   * Retrieves aggregated statistics for your account. If you are a GuardDuty administrator, you can retrieve the statistics for all the resources associated with the active member accounts in your organization who have enabled EKS Runtime Monitoring and have the GuardDuty agent running on their EKS nodes.
   */
  getCoverageStatistics(params: GuardDuty.Types.GetCoverageStatisticsRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetCoverageStatisticsResponse) => void): Request<GuardDuty.Types.GetCoverageStatisticsResponse, AWSError>;
  /**
   * Retrieves aggregated statistics for your account. If you are a GuardDuty administrator, you can retrieve the statistics for all the resources associated with the active member accounts in your organization who have enabled EKS Runtime Monitoring and have the GuardDuty agent running on their EKS nodes.
   */
  getCoverageStatistics(callback?: (err: AWSError, data: GuardDuty.Types.GetCoverageStatisticsResponse) => void): Request<GuardDuty.Types.GetCoverageStatisticsResponse, AWSError>;
  /**
   * Retrieves an Amazon GuardDuty detector specified by the detectorId. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  getDetector(params: GuardDuty.Types.GetDetectorRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetDetectorResponse) => void): Request<GuardDuty.Types.GetDetectorResponse, AWSError>;
  /**
   * Retrieves an Amazon GuardDuty detector specified by the detectorId. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
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
   * Returns the details of the malware scan settings. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  getMalwareScanSettings(params: GuardDuty.Types.GetMalwareScanSettingsRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetMalwareScanSettingsResponse) => void): Request<GuardDuty.Types.GetMalwareScanSettingsResponse, AWSError>;
  /**
   * Returns the details of the malware scan settings. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  getMalwareScanSettings(callback?: (err: AWSError, data: GuardDuty.Types.GetMalwareScanSettingsResponse) => void): Request<GuardDuty.Types.GetMalwareScanSettingsResponse, AWSError>;
  /**
   * Provides the details for the GuardDuty administrator account associated with the current GuardDuty member account.
   */
  getMasterAccount(params: GuardDuty.Types.GetMasterAccountRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetMasterAccountResponse) => void): Request<GuardDuty.Types.GetMasterAccountResponse, AWSError>;
  /**
   * Provides the details for the GuardDuty administrator account associated with the current GuardDuty member account.
   */
  getMasterAccount(callback?: (err: AWSError, data: GuardDuty.Types.GetMasterAccountResponse) => void): Request<GuardDuty.Types.GetMasterAccountResponse, AWSError>;
  /**
   * Describes which data sources are enabled for the member account's detector. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  getMemberDetectors(params: GuardDuty.Types.GetMemberDetectorsRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetMemberDetectorsResponse) => void): Request<GuardDuty.Types.GetMemberDetectorsResponse, AWSError>;
  /**
   * Describes which data sources are enabled for the member account's detector. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
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
   * Provides the number of days left for each data source used in the free trial period.
   */
  getRemainingFreeTrialDays(params: GuardDuty.Types.GetRemainingFreeTrialDaysRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetRemainingFreeTrialDaysResponse) => void): Request<GuardDuty.Types.GetRemainingFreeTrialDaysResponse, AWSError>;
  /**
   * Provides the number of days left for each data source used in the free trial period.
   */
  getRemainingFreeTrialDays(callback?: (err: AWSError, data: GuardDuty.Types.GetRemainingFreeTrialDaysResponse) => void): Request<GuardDuty.Types.GetRemainingFreeTrialDaysResponse, AWSError>;
  /**
   * Retrieves the ThreatIntelSet that is specified by the ThreatIntelSet ID.
   */
  getThreatIntelSet(params: GuardDuty.Types.GetThreatIntelSetRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetThreatIntelSetResponse) => void): Request<GuardDuty.Types.GetThreatIntelSetResponse, AWSError>;
  /**
   * Retrieves the ThreatIntelSet that is specified by the ThreatIntelSet ID.
   */
  getThreatIntelSet(callback?: (err: AWSError, data: GuardDuty.Types.GetThreatIntelSetResponse) => void): Request<GuardDuty.Types.GetThreatIntelSetResponse, AWSError>;
  /**
   * Lists Amazon GuardDuty usage statistics over the last 30 days for the specified detector ID. For newly enabled detectors or data sources, the cost returned will include only the usage so far under 30 days. This may differ from the cost metrics in the console, which project usage over 30 days to provide a monthly cost estimate. For more information, see Understanding How Usage Costs are Calculated.
   */
  getUsageStatistics(params: GuardDuty.Types.GetUsageStatisticsRequest, callback?: (err: AWSError, data: GuardDuty.Types.GetUsageStatisticsResponse) => void): Request<GuardDuty.Types.GetUsageStatisticsResponse, AWSError>;
  /**
   * Lists Amazon GuardDuty usage statistics over the last 30 days for the specified detector ID. For newly enabled detectors or data sources, the cost returned will include only the usage so far under 30 days. This may differ from the cost metrics in the console, which project usage over 30 days to provide a monthly cost estimate. For more information, see Understanding How Usage Costs are Calculated.
   */
  getUsageStatistics(callback?: (err: AWSError, data: GuardDuty.Types.GetUsageStatisticsResponse) => void): Request<GuardDuty.Types.GetUsageStatisticsResponse, AWSError>;
  /**
   * Invites Amazon Web Services accounts to become members of an organization administered by the Amazon Web Services account that invokes this API. If you are using Amazon Web Services Organizations to manage your GuardDuty environment, this step is not needed. For more information, see Managing accounts with organizations. To invite Amazon Web Services accounts, the first step is to ensure that GuardDuty has been enabled in the potential member accounts. You can now invoke this API to add accounts by invitation. The invited accounts can either accept or decline the invitation from their GuardDuty accounts. Each invited Amazon Web Services account can choose to accept the invitation from only one Amazon Web Services account. For more information, see Managing GuardDuty accounts by invitation. After the invite has been accepted and you choose to disassociate a member account (by using DisassociateMembers) from your account, the details of the member account obtained by invoking CreateMembers, including the associated email addresses, will be retained. This is done so that you can invoke InviteMembers without the need to invoke CreateMembers again. To remove the details associated with a member account, you must also invoke DeleteMembers. 
   */
  inviteMembers(params: GuardDuty.Types.InviteMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.InviteMembersResponse) => void): Request<GuardDuty.Types.InviteMembersResponse, AWSError>;
  /**
   * Invites Amazon Web Services accounts to become members of an organization administered by the Amazon Web Services account that invokes this API. If you are using Amazon Web Services Organizations to manage your GuardDuty environment, this step is not needed. For more information, see Managing accounts with organizations. To invite Amazon Web Services accounts, the first step is to ensure that GuardDuty has been enabled in the potential member accounts. You can now invoke this API to add accounts by invitation. The invited accounts can either accept or decline the invitation from their GuardDuty accounts. Each invited Amazon Web Services account can choose to accept the invitation from only one Amazon Web Services account. For more information, see Managing GuardDuty accounts by invitation. After the invite has been accepted and you choose to disassociate a member account (by using DisassociateMembers) from your account, the details of the member account obtained by invoking CreateMembers, including the associated email addresses, will be retained. This is done so that you can invoke InviteMembers without the need to invoke CreateMembers again. To remove the details associated with a member account, you must also invoke DeleteMembers. 
   */
  inviteMembers(callback?: (err: AWSError, data: GuardDuty.Types.InviteMembersResponse) => void): Request<GuardDuty.Types.InviteMembersResponse, AWSError>;
  /**
   * Lists coverage details for your GuardDuty account. If you're a GuardDuty administrator, you can retrieve all resources associated with the active member accounts in your organization. Make sure the accounts have EKS Runtime Monitoring enabled and GuardDuty agent running on their EKS nodes.
   */
  listCoverage(params: GuardDuty.Types.ListCoverageRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListCoverageResponse) => void): Request<GuardDuty.Types.ListCoverageResponse, AWSError>;
  /**
   * Lists coverage details for your GuardDuty account. If you're a GuardDuty administrator, you can retrieve all resources associated with the active member accounts in your organization. Make sure the accounts have EKS Runtime Monitoring enabled and GuardDuty agent running on their EKS nodes.
   */
  listCoverage(callback?: (err: AWSError, data: GuardDuty.Types.ListCoverageResponse) => void): Request<GuardDuty.Types.ListCoverageResponse, AWSError>;
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
   * Lists all GuardDuty membership invitations that were sent to the current Amazon Web Services account.
   */
  listInvitations(params: GuardDuty.Types.ListInvitationsRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListInvitationsResponse) => void): Request<GuardDuty.Types.ListInvitationsResponse, AWSError>;
  /**
   * Lists all GuardDuty membership invitations that were sent to the current Amazon Web Services account.
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
   * Lists the accounts designated as GuardDuty delegated administrators. Only the organization's management account can run this API operation.
   */
  listOrganizationAdminAccounts(params: GuardDuty.Types.ListOrganizationAdminAccountsRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListOrganizationAdminAccountsResponse) => void): Request<GuardDuty.Types.ListOrganizationAdminAccountsResponse, AWSError>;
  /**
   * Lists the accounts designated as GuardDuty delegated administrators. Only the organization's management account can run this API operation.
   */
  listOrganizationAdminAccounts(callback?: (err: AWSError, data: GuardDuty.Types.ListOrganizationAdminAccountsResponse) => void): Request<GuardDuty.Types.ListOrganizationAdminAccountsResponse, AWSError>;
  /**
   * Returns a list of publishing destinations associated with the specified detectorId.
   */
  listPublishingDestinations(params: GuardDuty.Types.ListPublishingDestinationsRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListPublishingDestinationsResponse) => void): Request<GuardDuty.Types.ListPublishingDestinationsResponse, AWSError>;
  /**
   * Returns a list of publishing destinations associated with the specified detectorId.
   */
  listPublishingDestinations(callback?: (err: AWSError, data: GuardDuty.Types.ListPublishingDestinationsResponse) => void): Request<GuardDuty.Types.ListPublishingDestinationsResponse, AWSError>;
  /**
   * Lists tags for a resource. Tagging is currently supported for detectors, finding filters, IP sets, threat intel sets, and publishing destination, with a limit of 50 tags per resource. When invoked, this operation returns all assigned tags for a given resource.
   */
  listTagsForResource(params: GuardDuty.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: GuardDuty.Types.ListTagsForResourceResponse) => void): Request<GuardDuty.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists tags for a resource. Tagging is currently supported for detectors, finding filters, IP sets, threat intel sets, and publishing destination, with a limit of 50 tags per resource. When invoked, this operation returns all assigned tags for a given resource.
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
   * Initiates the malware scan. Invoking this API will automatically create the Service-linked role  in the corresponding account.
   */
  startMalwareScan(params: GuardDuty.Types.StartMalwareScanRequest, callback?: (err: AWSError, data: GuardDuty.Types.StartMalwareScanResponse) => void): Request<GuardDuty.Types.StartMalwareScanResponse, AWSError>;
  /**
   * Initiates the malware scan. Invoking this API will automatically create the Service-linked role  in the corresponding account.
   */
  startMalwareScan(callback?: (err: AWSError, data: GuardDuty.Types.StartMalwareScanResponse) => void): Request<GuardDuty.Types.StartMalwareScanResponse, AWSError>;
  /**
   * Turns on GuardDuty monitoring of the specified member accounts. Use this operation to restart monitoring of accounts that you stopped monitoring with the StopMonitoringMembers operation.
   */
  startMonitoringMembers(params: GuardDuty.Types.StartMonitoringMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.StartMonitoringMembersResponse) => void): Request<GuardDuty.Types.StartMonitoringMembersResponse, AWSError>;
  /**
   * Turns on GuardDuty monitoring of the specified member accounts. Use this operation to restart monitoring of accounts that you stopped monitoring with the StopMonitoringMembers operation.
   */
  startMonitoringMembers(callback?: (err: AWSError, data: GuardDuty.Types.StartMonitoringMembersResponse) => void): Request<GuardDuty.Types.StartMonitoringMembersResponse, AWSError>;
  /**
   * Stops GuardDuty monitoring for the specified member accounts. Use the StartMonitoringMembers operation to restart monitoring for those accounts. With autoEnableOrganizationMembers configuration for your organization set to ALL, you'll receive an error if you attempt to stop monitoring the member accounts in your organization.
   */
  stopMonitoringMembers(params: GuardDuty.Types.StopMonitoringMembersRequest, callback?: (err: AWSError, data: GuardDuty.Types.StopMonitoringMembersResponse) => void): Request<GuardDuty.Types.StopMonitoringMembersResponse, AWSError>;
  /**
   * Stops GuardDuty monitoring for the specified member accounts. Use the StartMonitoringMembers operation to restart monitoring for those accounts. With autoEnableOrganizationMembers configuration for your organization set to ALL, you'll receive an error if you attempt to stop monitoring the member accounts in your organization.
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
   * Updates the Amazon GuardDuty detector specified by the detectorId. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  updateDetector(params: GuardDuty.Types.UpdateDetectorRequest, callback?: (err: AWSError, data: GuardDuty.Types.UpdateDetectorResponse) => void): Request<GuardDuty.Types.UpdateDetectorResponse, AWSError>;
  /**
   * Updates the Amazon GuardDuty detector specified by the detectorId. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
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
   * Updates the malware scan settings. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  updateMalwareScanSettings(params: GuardDuty.Types.UpdateMalwareScanSettingsRequest, callback?: (err: AWSError, data: GuardDuty.Types.UpdateMalwareScanSettingsResponse) => void): Request<GuardDuty.Types.UpdateMalwareScanSettingsResponse, AWSError>;
  /**
   * Updates the malware scan settings. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  updateMalwareScanSettings(callback?: (err: AWSError, data: GuardDuty.Types.UpdateMalwareScanSettingsResponse) => void): Request<GuardDuty.Types.UpdateMalwareScanSettingsResponse, AWSError>;
  /**
   * Contains information on member accounts to be updated. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  updateMemberDetectors(params: GuardDuty.Types.UpdateMemberDetectorsRequest, callback?: (err: AWSError, data: GuardDuty.Types.UpdateMemberDetectorsResponse) => void): Request<GuardDuty.Types.UpdateMemberDetectorsResponse, AWSError>;
  /**
   * Contains information on member accounts to be updated. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  updateMemberDetectors(callback?: (err: AWSError, data: GuardDuty.Types.UpdateMemberDetectorsResponse) => void): Request<GuardDuty.Types.UpdateMemberDetectorsResponse, AWSError>;
  /**
   * Configures the delegated administrator account with the provided values. You must provide a value for either autoEnableOrganizationMembers or autoEnable, but not both.  There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
   */
  updateOrganizationConfiguration(params: GuardDuty.Types.UpdateOrganizationConfigurationRequest, callback?: (err: AWSError, data: GuardDuty.Types.UpdateOrganizationConfigurationResponse) => void): Request<GuardDuty.Types.UpdateOrganizationConfigurationResponse, AWSError>;
  /**
   * Configures the delegated administrator account with the provided values. You must provide a value for either autoEnableOrganizationMembers or autoEnable, but not both.  There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
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
  export interface AcceptAdministratorInvitationRequest {
    /**
     * The unique ID of the detector of the GuardDuty member account.
     */
    DetectorId: DetectorId;
    /**
     * The account ID of the GuardDuty administrator account whose invitation you're accepting.
     */
    AdministratorId: String;
    /**
     * The value that is used to validate the administrator account to the member account.
     */
    InvitationId: String;
  }
  export interface AcceptAdministratorInvitationResponse {
  }
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
  export interface AccountFreeTrialInfo {
    /**
     * The account identifier of the GuardDuty member account.
     */
    AccountId?: String;
    /**
     * Describes the data source enabled for the GuardDuty member account.
     */
    DataSources?: DataSourcesFreeTrial;
    /**
     * A list of features enabled for the GuardDuty account.
     */
    Features?: FreeTrialFeatureConfigurationsResults;
  }
  export type AccountFreeTrialInfos = AccountFreeTrialInfo[];
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
    /**
     * Information about the Kubernetes API call action described in this finding.
     */
    KubernetesApiCallAction?: KubernetesApiCallAction;
    /**
     * Information about RDS_LOGIN_ATTEMPT action described in this finding.
     */
    RdsLoginAttemptAction?: RdsLoginAttemptAction;
  }
  export interface AddonDetails {
    /**
     * Version of the installed EKS add-on.
     */
    AddonVersion?: String;
    /**
     * Status of the installed EKS add-on.
     */
    AddonStatus?: String;
  }
  export interface AdminAccount {
    /**
     * The Amazon Web Services account ID for the account.
     */
    AdminAccountId?: String;
    /**
     * Indicates whether the account is enabled as the delegated administrator.
     */
    AdminStatus?: AdminStatus;
  }
  export type AdminAccounts = AdminAccount[];
  export type AdminStatus = "ENABLED"|"DISABLE_IN_PROGRESS"|string;
  export interface Administrator {
    /**
     * The ID of the account used as the administrator account.
     */
    AccountId?: AccountId;
    /**
     * The value that is used to validate the administrator account to the member account.
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
  export type AffectedResources = {[key: string]: String};
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
  export type AutoEnableMembers = "NEW"|"ALL"|"NONE"|string;
  export interface AwsApiCallAction {
    /**
     * The Amazon Web Services API name.
     */
    Api?: String;
    /**
     * The Amazon Web Services API caller type.
     */
    CallerType?: String;
    /**
     * The domain information for the Amazon Web Services API call.
     */
    DomainDetails?: DomainDetails;
    /**
     * The error code of the failed Amazon Web Services API action.
     */
    ErrorCode?: String;
    /**
     * The agent through which the API request was made.
     */
    UserAgent?: String;
    /**
     * The remote IP information of the connection that initiated the Amazon Web Services API call.
     */
    RemoteIpDetails?: RemoteIpDetails;
    /**
     * The Amazon Web Services service name whose API was invoked.
     */
    ServiceName?: String;
    /**
     * The details of the Amazon Web Services account that made the API call. This field appears if the call was made from outside your account.
     */
    RemoteAccountDetails?: RemoteAccountDetails;
    /**
     * The details of the Amazon Web Services account that made the API call. This field identifies the resources that were affected by this API call.
     */
    AffectedResources?: AffectedResources;
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
  export interface Container {
    /**
     * The container runtime (such as, Docker or containerd) used to run the container.
     */
    ContainerRuntime?: String;
    /**
     * Container ID.
     */
    Id?: String;
    /**
     * Container name.
     */
    Name?: String;
    /**
     * Container image.
     */
    Image?: String;
    /**
     * Part of the image name before the last slash. For example, imagePrefix for public.ecr.aws/amazonlinux/amazonlinux:latest would be public.ecr.aws/amazonlinux. If the image name is relative and does not have a slash, this field is empty.
     */
    ImagePrefix?: String;
    /**
     * Container volume mounts.
     */
    VolumeMounts?: VolumeMounts;
    /**
     * Container security context.
     */
    SecurityContext?: SecurityContext;
  }
  export type Containers = Container[];
  export type CountByCoverageStatus = {[key: string]: Long};
  export type CountByResourceType = {[key: string]: Long};
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
  export interface CoverageEksClusterDetails {
    /**
     * Name of the EKS cluster.
     */
    ClusterName?: String;
    /**
     * Represents the nodes within the EKS cluster that have a HEALTHY coverage status.
     */
    CoveredNodes?: Long;
    /**
     * Represents all the nodes within the EKS cluster in your account.
     */
    CompatibleNodes?: Long;
    /**
     * Information about the installed EKS add-on.
     */
    AddonDetails?: AddonDetails;
    /**
     * Indicates how the Amazon EKS add-on GuardDuty agent is managed for this EKS cluster.  AUTO_MANAGED indicates GuardDuty deploys and manages updates for this resource.  MANUAL indicates that you are responsible to deploy, update, and manage the Amazon EKS add-on GuardDuty agent for this resource.
     */
    ManagementType?: ManagementType;
  }
  export interface CoverageFilterCondition {
    /**
     * Represents an equal condition that is applied to a single field while retrieving the coverage details.
     */
    Equals?: Equals;
    /**
     * Represents a not equal condition that is applied to a single field while retrieving the coverage details.
     */
    NotEquals?: NotEquals;
  }
  export interface CoverageFilterCriteria {
    /**
     * Represents a condition that when matched will be added to the response of the operation.
     */
    FilterCriterion?: CoverageFilterCriterionList;
  }
  export interface CoverageFilterCriterion {
    /**
     * An enum value representing possible filter fields.  Replace the enum value CLUSTER_NAME with EKS_CLUSTER_NAME. CLUSTER_NAME has been deprecated. 
     */
    CriterionKey?: CoverageFilterCriterionKey;
    /**
     * Contains information about the condition.
     */
    FilterCondition?: CoverageFilterCondition;
  }
  export type CoverageFilterCriterionKey = "ACCOUNT_ID"|"CLUSTER_NAME"|"RESOURCE_TYPE"|"COVERAGE_STATUS"|"ADDON_VERSION"|"MANAGEMENT_TYPE"|"EKS_CLUSTER_NAME"|string;
  export type CoverageFilterCriterionList = CoverageFilterCriterion[];
  export interface CoverageResource {
    /**
     * The unique ID of the resource.
     */
    ResourceId?: String;
    /**
     * The unique ID of the GuardDuty detector associated with the resource.
     */
    DetectorId?: DetectorId;
    /**
     * The unique ID of the Amazon Web Services account.
     */
    AccountId?: AccountId;
    /**
     * Information about the resource for which the coverage statistics are retrieved.
     */
    ResourceDetails?: CoverageResourceDetails;
    /**
     * Represents the status of the EKS cluster coverage.
     */
    CoverageStatus?: CoverageStatus;
    /**
     * Represents the reason why a coverage status was UNHEALTHY for the EKS cluster.
     */
    Issue?: String;
    /**
     * The timestamp at which the coverage details for the resource were last updated. This is in UTC format.
     */
    UpdatedAt?: Timestamp;
  }
  export interface CoverageResourceDetails {
    /**
     * EKS cluster details involved in the coverage statistics.
     */
    EksClusterDetails?: CoverageEksClusterDetails;
    /**
     * The type of Amazon Web Services resource.
     */
    ResourceType?: ResourceType;
  }
  export type CoverageResources = CoverageResource[];
  export interface CoverageSortCriteria {
    /**
     * Represents the field name used to sort the coverage details.  Replace the enum value CLUSTER_NAME with EKS_CLUSTER_NAME. CLUSTER_NAME has been deprecated. 
     */
    AttributeName?: CoverageSortKey;
    /**
     * The order in which the sorted findings are to be displayed.
     */
    OrderBy?: OrderBy;
  }
  export type CoverageSortKey = "ACCOUNT_ID"|"CLUSTER_NAME"|"COVERAGE_STATUS"|"ISSUE"|"ADDON_VERSION"|"UPDATED_AT"|"EKS_CLUSTER_NAME"|string;
  export interface CoverageStatistics {
    /**
     * Represents coverage statistics for EKS clusters aggregated by resource type.
     */
    CountByResourceType?: CountByResourceType;
    /**
     * Represents coverage statistics for EKS clusters aggregated by coverage status.
     */
    CountByCoverageStatus?: CountByCoverageStatus;
  }
  export type CoverageStatisticsType = "COUNT_BY_RESOURCE_TYPE"|"COUNT_BY_COVERAGE_STATUS"|string;
  export type CoverageStatisticsTypeList = CoverageStatisticsType[];
  export type CoverageStatus = "HEALTHY"|"UNHEALTHY"|string;
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
     * Describes which data sources will be enabled for the detector. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
     */
    DataSources?: DataSourceConfigurations;
    /**
     * The tags to be added to a new detector resource.
     */
    Tags?: TagMap;
    /**
     * A list of features that will be configured for the detector.
     */
    Features?: DetectorFeatureConfigurations;
  }
  export interface CreateDetectorResponse {
    /**
     * The unique ID of the created detector.
     */
    DetectorId?: DetectorId;
    /**
     * Specifies the data sources that couldn't be enabled when GuardDuty was enabled for the first time.
     */
    UnprocessedDataSources?: UnprocessedDataSourcesResult;
  }
  export interface CreateFilterRequest {
    /**
     * The ID of the detector belonging to the GuardDuty account that you want to create a filter for.
     */
    DetectorId: DetectorId;
    /**
     * The name of the filter. Valid characters include period (.), underscore (_), dash (-), and alphanumeric characters. A whitespace is considered to be an invalid character.
     */
    Name: FilterName;
    /**
     * The description of the filter. Valid characters include alphanumeric characters, and special characters such as hyphen, period, colon, underscore, parentheses ({ }, [ ], and ( )), forward slash, horizontal tab, vertical tab, newline, form feed, return, and whitespace.
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
     * Represents the criteria to be used in the filter for querying findings. You can only use the following attributes to query findings:   accountId   id   region   severity To filter on the basis of severity, the API and CLI use the following input list for the FindingCriteria condition:    Low: ["1", "2", "3"]     Medium: ["4", "5", "6"]     High: ["7", "8", "9"]    For more information, see Severity levels for GuardDuty findings.   type   updatedAt Type: ISO 8601 string format: YYYY-MM-DDTHH:MM:SS.SSSZ or YYYY-MM-DDTHH:MM:SSZ depending on whether the value contains milliseconds.   resource.accessKeyDetails.accessKeyId   resource.accessKeyDetails.principalId   resource.accessKeyDetails.userName   resource.accessKeyDetails.userType   resource.instanceDetails.iamInstanceProfile.id   resource.instanceDetails.imageId   resource.instanceDetails.instanceId   resource.instanceDetails.tags.key   resource.instanceDetails.tags.value   resource.instanceDetails.networkInterfaces.ipv6Addresses   resource.instanceDetails.networkInterfaces.privateIpAddresses.privateIpAddress   resource.instanceDetails.networkInterfaces.publicDnsName   resource.instanceDetails.networkInterfaces.publicIp   resource.instanceDetails.networkInterfaces.securityGroups.groupId   resource.instanceDetails.networkInterfaces.securityGroups.groupName   resource.instanceDetails.networkInterfaces.subnetId   resource.instanceDetails.networkInterfaces.vpcId   resource.instanceDetails.outpostArn   resource.resourceType   resource.s3BucketDetails.publicAccess.effectivePermissions   resource.s3BucketDetails.name   resource.s3BucketDetails.tags.key   resource.s3BucketDetails.tags.value   resource.s3BucketDetails.type   service.action.actionType   service.action.awsApiCallAction.api   service.action.awsApiCallAction.callerType   service.action.awsApiCallAction.errorCode   service.action.awsApiCallAction.remoteIpDetails.city.cityName   service.action.awsApiCallAction.remoteIpDetails.country.countryName   service.action.awsApiCallAction.remoteIpDetails.ipAddressV4   service.action.awsApiCallAction.remoteIpDetails.organization.asn   service.action.awsApiCallAction.remoteIpDetails.organization.asnOrg   service.action.awsApiCallAction.serviceName   service.action.dnsRequestAction.domain   service.action.networkConnectionAction.blocked   service.action.networkConnectionAction.connectionDirection   service.action.networkConnectionAction.localPortDetails.port   service.action.networkConnectionAction.protocol   service.action.networkConnectionAction.remoteIpDetails.city.cityName   service.action.networkConnectionAction.remoteIpDetails.country.countryName   service.action.networkConnectionAction.remoteIpDetails.ipAddressV4   service.action.networkConnectionAction.remoteIpDetails.organization.asn   service.action.networkConnectionAction.remoteIpDetails.organization.asnOrg   service.action.networkConnectionAction.remotePortDetails.port   service.action.awsApiCallAction.remoteAccountDetails.affiliated   service.action.kubernetesApiCallAction.remoteIpDetails.ipAddressV4   service.action.kubernetesApiCallAction.requestUri   service.action.networkConnectionAction.localIpDetails.ipAddressV4   service.action.networkConnectionAction.protocol   service.action.awsApiCallAction.serviceName   service.action.awsApiCallAction.remoteAccountDetails.accountId   service.additionalInfo.threatListName   service.resourceRole   resource.eksClusterDetails.name   resource.kubernetesDetails.kubernetesWorkloadDetails.name   resource.kubernetesDetails.kubernetesWorkloadDetails.namespace   resource.kubernetesDetails.kubernetesUserDetails.username   resource.kubernetesDetails.kubernetesWorkloadDetails.containers.image   resource.kubernetesDetails.kubernetesWorkloadDetails.containers.imagePrefix   service.ebsVolumeScanDetails.scanId   service.ebsVolumeScanDetails.scanDetections.threatDetectedByName.threatNames.name   service.ebsVolumeScanDetails.scanDetections.threatDetectedByName.threatNames.severity   service.ebsVolumeScanDetails.scanDetections.threatDetectedByName.threatNames.filePaths.hash   resource.ecsClusterDetails.name   resource.ecsClusterDetails.taskDetails.containers.image   resource.ecsClusterDetails.taskDetails.definitionArn   resource.containerDetails.image   resource.rdsDbInstanceDetails.dbInstanceIdentifier   resource.rdsDbInstanceDetails.dbClusterIdentifier   resource.rdsDbInstanceDetails.engine   resource.rdsDbUserDetails.user   resource.rdsDbInstanceDetails.tags.key   resource.rdsDbInstanceDetails.tags.value   service.runtimeDetails.process.executableSha256   service.runtimeDetails.process.name   service.runtimeDetails.process.name   resource.lambdaDetails.functionName   resource.lambdaDetails.functionArn   resource.lambdaDetails.tags.key   resource.lambdaDetails.tags.value  
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
     * The user-friendly name to identify the IPSet.  Allowed characters are alphanumeric, whitespace, dash (-), and underscores (_).
     */
    Name: Name;
    /**
     * The format of the file that contains the IPSet.
     */
    Format: IpSetFormat;
    /**
     * The URI of the file that contains the IPSet. 
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
     * The URI of the file that contains the ThreatIntelSet. 
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
  export type CriterionKey = "EC2_INSTANCE_ARN"|"SCAN_ID"|"ACCOUNT_ID"|"GUARDDUTY_FINDING_ID"|"SCAN_START_TIME"|"SCAN_STATUS"|"SCAN_TYPE"|string;
  export interface DNSLogsConfigurationResult {
    /**
     * Denotes whether DNS logs is enabled as a data source.
     */
    Status: DataSourceStatus;
  }
  export type DataSource = "FLOW_LOGS"|"CLOUD_TRAIL"|"DNS_LOGS"|"S3_LOGS"|"KUBERNETES_AUDIT_LOGS"|"EC2_MALWARE_SCAN"|string;
  export interface DataSourceConfigurations {
    /**
     * Describes whether S3 data event logs are enabled as a data source.
     */
    S3Logs?: S3LogsConfiguration;
    /**
     * Describes whether any Kubernetes logs are enabled as data sources.
     */
    Kubernetes?: KubernetesConfiguration;
    /**
     * Describes whether Malware Protection is enabled as a data source.
     */
    MalwareProtection?: MalwareProtectionConfiguration;
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
    /**
     * An object that contains information on the status of all Kubernetes data sources.
     */
    Kubernetes?: KubernetesConfigurationResult;
    /**
     * Describes the configuration of Malware Protection data sources.
     */
    MalwareProtection?: MalwareProtectionConfigurationResult;
  }
  export interface DataSourceFreeTrial {
    /**
     * A value that specifies the number of days left to use each enabled data source.
     */
    FreeTrialDaysRemaining?: Integer;
  }
  export type DataSourceList = DataSource[];
  export type DataSourceStatus = "ENABLED"|"DISABLED"|string;
  export interface DataSourcesFreeTrial {
    /**
     * Describes whether any Amazon Web Services CloudTrail management event logs are enabled as data sources.
     */
    CloudTrail?: DataSourceFreeTrial;
    /**
     * Describes whether any DNS logs are enabled as data sources.
     */
    DnsLogs?: DataSourceFreeTrial;
    /**
     * Describes whether any VPC Flow logs are enabled as data sources.
     */
    FlowLogs?: DataSourceFreeTrial;
    /**
     * Describes whether any S3 data event logs are enabled as data sources.
     */
    S3Logs?: DataSourceFreeTrial;
    /**
     * Describes whether any Kubernetes logs are enabled as data sources.
     */
    Kubernetes?: KubernetesDataSourceFreeTrial;
    /**
     * Describes whether Malware Protection is enabled as a data source.
     */
    MalwareProtection?: MalwareProtectionDataSourceFreeTrial;
  }
  export interface DeclineInvitationsRequest {
    /**
     * A list of account IDs of the Amazon Web Services accounts that sent invitations to the current member account that you want to decline invitations from.
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
     * A list of account IDs of the Amazon Web Services accounts that sent invitations to the current member account that you want to delete invitations from.
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
  export interface DescribeMalwareScansRequest {
    /**
     * The unique ID of the detector that the request is associated with.
     */
    DetectorId: DetectorId;
    /**
     * You can use this parameter when paginating results. Set the value of this parameter to null on your first call to the list action. For subsequent calls to the action, fill nextToken in the request with the value of NextToken from the previous response to continue listing data.
     */
    NextToken?: String;
    /**
     * You can use this parameter to indicate the maximum number of items that you want in the response. The default value is 50. The maximum value is 50.
     */
    MaxResults?: IntegerValueWithMax;
    /**
     * Represents the criteria to be used in the filter for describing scan entries.
     */
    FilterCriteria?: FilterCriteria;
    /**
     * Represents the criteria used for sorting scan entries. The  attributeName  is required and it must be scanStartTime.
     */
    SortCriteria?: SortCriteria;
  }
  export interface DescribeMalwareScansResponse {
    /**
     * Contains information about malware scans.
     */
    Scans: Scans;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    NextToken?: String;
  }
  export interface DescribeOrganizationConfigurationRequest {
    /**
     * The ID of the detector to retrieve information about the delegated administrator from.
     */
    DetectorId: DetectorId;
    /**
     * You can use this parameter to indicate the maximum number of items that you want in the response.
     */
    MaxResults?: MaxResults;
    /**
     * You can use this parameter when paginating results. Set the value of this parameter to null on your first call to the list action. For subsequent calls to the action, fill nextToken in the request with the value of NextToken from the previous response to continue listing data.
     */
    NextToken?: String;
  }
  export interface DescribeOrganizationConfigurationResponse {
    /**
     * Indicates whether GuardDuty is automatically enabled for accounts added to the organization. Even though this is still supported, we recommend using AutoEnableOrganizationMembers to achieve the similar results.
     */
    AutoEnable?: Boolean;
    /**
     * Indicates whether the maximum number of allowed member accounts are already associated with the delegated administrator account for your organization.
     */
    MemberAccountLimitReached: Boolean;
    /**
     * Describes which data sources are enabled automatically for member accounts.
     */
    DataSources?: OrganizationDataSourceConfigurationsResult;
    /**
     * A list of features that are configured for this organization.
     */
    Features?: OrganizationFeaturesConfigurationsResults;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    NextToken?: String;
    /**
     * Indicates the auto-enablement configuration of GuardDuty for the member accounts in the organization.    NEW: Indicates that when a new account joins the organization, they will have GuardDuty enabled automatically.     ALL: Indicates that all accounts in the organization have GuardDuty enabled automatically. This includes NEW accounts that join the organization and accounts that may have been suspended or removed from the organization in GuardDuty.    NONE: Indicates that GuardDuty will not be automatically enabled for any account in the organization. The administrator must manage GuardDuty for each account in the organization individually.  
     */
    AutoEnableOrganizationMembers?: AutoEnableMembers;
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
     * The ARN of the resource to publish to. To specify an S3 bucket folder use the following format: arn:aws:s3:::DOC-EXAMPLE-BUCKET/myFolder/ 
     */
    DestinationArn?: String;
    /**
     * The ARN of the KMS key to use for encryption.
     */
    KmsKeyArn?: String;
  }
  export type DestinationType = "S3"|string;
  export type Destinations = Destination[];
  export interface DetectorAdditionalConfiguration {
    /**
     * Name of the additional configuration.
     */
    Name?: FeatureAdditionalConfiguration;
    /**
     * Status of the additional configuration.
     */
    Status?: FeatureStatus;
  }
  export interface DetectorAdditionalConfigurationResult {
    /**
     * Name of the additional configuration.
     */
    Name?: FeatureAdditionalConfiguration;
    /**
     * Status of the additional configuration.
     */
    Status?: FeatureStatus;
    /**
     * The timestamp at which the additional configuration was last updated. This is in UTC format.
     */
    UpdatedAt?: Timestamp;
  }
  export type DetectorAdditionalConfigurationResults = DetectorAdditionalConfigurationResult[];
  export type DetectorAdditionalConfigurations = DetectorAdditionalConfiguration[];
  export type DetectorFeature = "S3_DATA_EVENTS"|"EKS_AUDIT_LOGS"|"EBS_MALWARE_PROTECTION"|"RDS_LOGIN_EVENTS"|"EKS_RUNTIME_MONITORING"|"LAMBDA_NETWORK_LOGS"|string;
  export interface DetectorFeatureConfiguration {
    /**
     * The name of the feature.
     */
    Name?: DetectorFeature;
    /**
     * The status of the feature.
     */
    Status?: FeatureStatus;
    /**
     * Additional configuration for a resource.
     */
    AdditionalConfiguration?: DetectorAdditionalConfigurations;
  }
  export interface DetectorFeatureConfigurationResult {
    /**
     * Indicates the name of the feature that can be enabled for the detector.
     */
    Name?: DetectorFeatureResult;
    /**
     * Indicates the status of the feature that is enabled for the detector.
     */
    Status?: FeatureStatus;
    /**
     * The timestamp at which the feature object was updated.
     */
    UpdatedAt?: Timestamp;
    /**
     * Additional configuration for a resource.
     */
    AdditionalConfiguration?: DetectorAdditionalConfigurationResults;
  }
  export type DetectorFeatureConfigurations = DetectorFeatureConfiguration[];
  export type DetectorFeatureConfigurationsResults = DetectorFeatureConfigurationResult[];
  export type DetectorFeatureResult = "FLOW_LOGS"|"CLOUD_TRAIL"|"DNS_LOGS"|"S3_DATA_EVENTS"|"EKS_AUDIT_LOGS"|"EBS_MALWARE_PROTECTION"|"RDS_LOGIN_EVENTS"|"EKS_RUNTIME_MONITORING"|"LAMBDA_NETWORK_LOGS"|string;
  export type DetectorId = string;
  export type DetectorIds = DetectorId[];
  export type DetectorStatus = "ENABLED"|"DISABLED"|string;
  export interface DisableOrganizationAdminAccountRequest {
    /**
     * The Amazon Web Services Account ID for the organizations account to be disabled as a GuardDuty delegated administrator.
     */
    AdminAccountId: String;
  }
  export interface DisableOrganizationAdminAccountResponse {
  }
  export interface DisassociateFromAdministratorAccountRequest {
    /**
     * The unique ID of the detector of the GuardDuty member account.
     */
    DetectorId: DetectorId;
  }
  export interface DisassociateFromAdministratorAccountResponse {
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
     * The domain information for the DNS query.
     */
    Domain?: String;
    /**
     * The network connection protocol observed in the activity that prompted GuardDuty to generate the finding.
     */
    Protocol?: String;
    /**
     * Indicates whether the targeted port is blocked.
     */
    Blocked?: Boolean;
  }
  export interface DomainDetails {
    /**
     * The domain information for the Amazon Web Services API call.
     */
    Domain?: String;
  }
  export type Double = number;
  export type EbsSnapshotPreservation = "NO_RETENTION"|"RETENTION_WITH_FINDING"|string;
  export interface EbsVolumeDetails {
    /**
     * List of EBS volumes that were scanned.
     */
    ScannedVolumeDetails?: VolumeDetails;
    /**
     * List of EBS volumes that were skipped from the malware scan.
     */
    SkippedVolumeDetails?: VolumeDetails;
  }
  export interface EbsVolumeScanDetails {
    /**
     * Unique Id of the malware scan that generated the finding.
     */
    ScanId?: String;
    /**
     * Returns the start date and time of the malware scan.
     */
    ScanStartedAt?: Timestamp;
    /**
     * Returns the completion date and time of the malware scan.
     */
    ScanCompletedAt?: Timestamp;
    /**
     * GuardDuty finding ID that triggered a malware scan.
     */
    TriggerFindingId?: String;
    /**
     * Contains list of threat intelligence sources used to detect threats.
     */
    Sources?: Sources;
    /**
     * Contains a complete view providing malware scan result details.
     */
    ScanDetections?: ScanDetections;
    /**
     * Specifies the scan type that invoked the malware scan.
     */
    ScanType?: ScanType;
  }
  export interface EbsVolumesResult {
    /**
     * Describes whether scanning EBS volumes is enabled as a data source.
     */
    Status?: DataSourceStatus;
    /**
     * Specifies the reason why scanning EBS volumes (Malware Protection) was not enabled as a data source.
     */
    Reason?: String;
  }
  export interface EcsClusterDetails {
    /**
     * The name of the ECS Cluster.
     */
    Name?: String;
    /**
     * The Amazon Resource Name (ARN) that identifies the cluster.
     */
    Arn?: String;
    /**
     * The status of the ECS cluster.
     */
    Status?: String;
    /**
     * The number of services that are running on the cluster in an ACTIVE state.
     */
    ActiveServicesCount?: Integer;
    /**
     * The number of container instances registered into the cluster.
     */
    RegisteredContainerInstancesCount?: Integer;
    /**
     * The number of tasks in the cluster that are in the RUNNING state.
     */
    RunningTasksCount?: Integer;
    /**
     * The tags of the ECS Cluster.
     */
    Tags?: Tags;
    /**
     * Contains information about the details of the ECS Task.
     */
    TaskDetails?: EcsTaskDetails;
  }
  export interface EcsTaskDetails {
    /**
     * The Amazon Resource Name (ARN) of the task.
     */
    Arn?: String;
    /**
     * The ARN of the task definition that creates the task.
     */
    DefinitionArn?: String;
    /**
     * The version counter for the task.
     */
    Version?: String;
    /**
     * The Unix timestamp for the time when the task was created.
     */
    TaskCreatedAt?: Timestamp;
    /**
     * The Unix timestamp for the time when the task started.
     */
    StartedAt?: Timestamp;
    /**
     * Contains the tag specified when a task is started.
     */
    StartedBy?: String;
    /**
     * The tags of the ECS Task.
     */
    Tags?: Tags;
    /**
     * The list of data volume definitions for the task.
     */
    Volumes?: Volumes;
    /**
     * The containers that's associated with the task.
     */
    Containers?: Containers;
    /**
     * The name of the task group that's associated with the task.
     */
    Group?: String;
  }
  export interface EksClusterDetails {
    /**
     * EKS cluster name.
     */
    Name?: String;
    /**
     * EKS cluster ARN.
     */
    Arn?: String;
    /**
     * The VPC ID to which the EKS cluster is attached.
     */
    VpcId?: String;
    /**
     * The EKS cluster status.
     */
    Status?: String;
    /**
     * The EKS cluster tags.
     */
    Tags?: Tags;
    /**
     * The timestamp when the EKS cluster was created.
     */
    CreatedAt?: Timestamp;
  }
  export type Email = string;
  export interface EnableOrganizationAdminAccountRequest {
    /**
     * The Amazon Web Services account ID for the organization account to be enabled as a GuardDuty delegated administrator.
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
  export type FeatureAdditionalConfiguration = "EKS_ADDON_MANAGEMENT"|string;
  export type FeatureStatus = "ENABLED"|"DISABLED"|string;
  export type Feedback = "USEFUL"|"NOT_USEFUL"|string;
  export type FilePaths = ScanFilePath[];
  export type FilterAction = "NOOP"|"ARCHIVE"|string;
  export interface FilterCondition {
    /**
     * Represents an equal  condition to be applied to a single field when querying for scan entries.
     */
    EqualsValue?: NonEmptyString;
    /**
     * Represents a greater than condition to be applied to a single field when querying for scan entries.
     */
    GreaterThan?: LongValue;
    /**
     * Represents a less than condition to be applied to a single field when querying for scan entries.
     */
    LessThan?: LongValue;
  }
  export interface FilterCriteria {
    /**
     * Represents a condition that when matched will be added to the response of the operation.
     */
    FilterCriterion?: FilterCriterionList;
  }
  export interface FilterCriterion {
    /**
     * An enum value representing possible scan properties to match with given scan entries.  Replace the enum value CLUSTER_NAME with EKS_CLUSTER_NAME. CLUSTER_NAME has been deprecated. 
     */
    CriterionKey?: CriterionKey;
    /**
     * Contains information about the condition.
     */
    FilterCondition?: FilterCondition;
  }
  export type FilterCriterionList = FilterCriterion[];
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
  export type FlagsList = String[];
  export interface FlowLogsConfigurationResult {
    /**
     * Denotes whether VPC flow logs is enabled as a data source.
     */
    Status: DataSourceStatus;
  }
  export interface FreeTrialFeatureConfigurationResult {
    /**
     * The name of the feature for which the free trial is configured.
     */
    Name?: FreeTrialFeatureResult;
    /**
     * The number of the remaining free trial days for the feature.
     */
    FreeTrialDaysRemaining?: Integer;
  }
  export type FreeTrialFeatureConfigurationsResults = FreeTrialFeatureConfigurationResult[];
  export type FreeTrialFeatureResult = "FLOW_LOGS"|"CLOUD_TRAIL"|"DNS_LOGS"|"S3_DATA_EVENTS"|"EKS_AUDIT_LOGS"|"EBS_MALWARE_PROTECTION"|"RDS_LOGIN_EVENTS"|"EKS_RUNTIME_MONITORING"|"LAMBDA_NETWORK_LOGS"|string;
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
  export interface GetAdministratorAccountRequest {
    /**
     * The unique ID of the detector of the GuardDuty member account.
     */
    DetectorId: DetectorId;
  }
  export interface GetAdministratorAccountResponse {
    /**
     * The administrator account details.
     */
    Administrator: Administrator;
  }
  export interface GetCoverageStatisticsRequest {
    /**
     * The unique ID of the GuardDuty detector associated to the coverage statistics.
     */
    DetectorId: DetectorId;
    /**
     * Represents the criteria used to filter the coverage statistics
     */
    FilterCriteria?: CoverageFilterCriteria;
    /**
     * Represents the statistics type used to aggregate the coverage details.
     */
    StatisticsType: CoverageStatisticsTypeList;
  }
  export interface GetCoverageStatisticsResponse {
    /**
     * Represents the count aggregated by the statusCode and resourceType.
     */
    CoverageStatistics?: CoverageStatistics;
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
    /**
     * Describes the features that have been enabled for the detector.
     */
    Features?: DetectorFeatureConfigurationsResults;
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
     * The URI of the file that contains the IPSet.
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
  export interface GetMalwareScanSettingsRequest {
    /**
     * The unique ID of the detector that the scan setting is associated with.
     */
    DetectorId: DetectorId;
  }
  export interface GetMalwareScanSettingsResponse {
    /**
     * Represents the criteria to be used in the filter for scanning resources.
     */
    ScanResourceCriteria?: ScanResourceCriteria;
    /**
     * An enum value representing possible snapshot preservation settings.
     */
    EbsSnapshotPreservation?: EbsSnapshotPreservation;
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
  export interface GetRemainingFreeTrialDaysRequest {
    /**
     * The unique ID of the detector of the GuardDuty member account.
     */
    DetectorId: DetectorId;
    /**
     * A list of account identifiers of the GuardDuty member account.
     */
    AccountIds?: AccountIds;
  }
  export interface GetRemainingFreeTrialDaysResponse {
    /**
     * The member accounts which were included in a request and were processed successfully.
     */
    Accounts?: AccountFreeTrialInfos;
    /**
     * The member account that was included in a request but for which the request could not be processed.
     */
    UnprocessedAccounts?: UnprocessedAccounts;
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
     * The URI of the file that contains the ThreatIntelSet. 
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
  export type Groups = String[];
  export type GuardDutyArn = string;
  export interface HighestSeverityThreatDetails {
    /**
     * Severity level of the highest severity threat detected.
     */
    Severity?: String;
    /**
     * Threat name of the highest severity threat detected as part of the malware scan.
     */
    ThreatName?: String;
    /**
     * Total number of infected files with the highest severity threat detected.
     */
    Count?: Integer;
  }
  export interface HostPath {
    /**
     * Path of the file or directory on the host that the volume maps to.
     */
    Path?: String;
  }
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
  export type InstanceArn = string;
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
     * The Amazon Resource Name (ARN) of the Amazon Web Services Outpost. Only applicable to Amazon Web Services Outposts instances.
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
  export type IntegerValueWithMax = number;
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
  export interface KubernetesApiCallAction {
    /**
     * The Kubernetes API request URI.
     */
    RequestUri?: String;
    /**
     * The Kubernetes API request HTTP verb.
     */
    Verb?: String;
    /**
     * The IP of the Kubernetes API caller and the IPs of any proxies or load balancers between the caller and the API endpoint.
     */
    SourceIps?: SourceIps;
    /**
     * The user agent of the caller of the Kubernetes API.
     */
    UserAgent?: String;
    RemoteIpDetails?: RemoteIpDetails;
    /**
     * The resulting HTTP response code of the Kubernetes API call action.
     */
    StatusCode?: Integer;
    /**
     * Parameters related to the Kubernetes API call action.
     */
    Parameters?: String;
  }
  export interface KubernetesAuditLogsConfiguration {
    /**
     * The status of Kubernetes audit logs as a data source.
     */
    Enable: Boolean;
  }
  export interface KubernetesAuditLogsConfigurationResult {
    /**
     * A value that describes whether Kubernetes audit logs are enabled as a data source.
     */
    Status: DataSourceStatus;
  }
  export interface KubernetesConfiguration {
    /**
     * The status of Kubernetes audit logs as a data source.
     */
    AuditLogs: KubernetesAuditLogsConfiguration;
  }
  export interface KubernetesConfigurationResult {
    /**
     * Describes whether Kubernetes audit logs are enabled as a data source.
     */
    AuditLogs: KubernetesAuditLogsConfigurationResult;
  }
  export interface KubernetesDataSourceFreeTrial {
    /**
     * Describes whether Kubernetes audit logs are enabled as a data source.
     */
    AuditLogs?: DataSourceFreeTrial;
  }
  export interface KubernetesDetails {
    /**
     * Details about the Kubernetes user involved in a Kubernetes finding.
     */
    KubernetesUserDetails?: KubernetesUserDetails;
    /**
     * Details about the Kubernetes workload involved in a Kubernetes finding.
     */
    KubernetesWorkloadDetails?: KubernetesWorkloadDetails;
  }
  export interface KubernetesUserDetails {
    /**
     * The username of the user who called the Kubernetes API.
     */
    Username?: String;
    /**
     * The user ID of the user who called the Kubernetes API.
     */
    Uid?: String;
    /**
     * The groups that include the user who called the Kubernetes API.
     */
    Groups?: Groups;
    /**
     * Entity that assumes the IAM role when Kubernetes RBAC permissions are assigned to that role.
     */
    SessionName?: SessionNameList;
  }
  export interface KubernetesWorkloadDetails {
    /**
     * Kubernetes workload name.
     */
    Name?: String;
    /**
     * Kubernetes workload type (e.g. Pod, Deployment, etc.).
     */
    Type?: String;
    /**
     * Kubernetes workload ID.
     */
    Uid?: String;
    /**
     * Kubernetes namespace that the workload is part of.
     */
    Namespace?: String;
    /**
     * Whether the hostNetwork flag is enabled for the pods included in the workload.
     */
    HostNetwork?: Boolean;
    /**
     * Containers running as part of the Kubernetes workload.
     */
    Containers?: Containers;
    /**
     * Volumes used by the Kubernetes workload.
     */
    Volumes?: Volumes;
  }
  export interface LambdaDetails {
    /**
     * Amazon Resource Name (ARN) of the Lambda function.
     */
    FunctionArn?: String;
    /**
     * Name of the Lambda function.
     */
    FunctionName?: String;
    /**
     * Description of the Lambda function.
     */
    Description?: String;
    /**
     * The timestamp when the Lambda function was last modified. This field is in the UTC date string format (2023-03-22T19:37:20.168Z).
     */
    LastModifiedAt?: Timestamp;
    /**
     * The revision ID of the Lambda function version.
     */
    RevisionId?: String;
    /**
     * The version of the Lambda function.
     */
    FunctionVersion?: String;
    /**
     * The execution role of the Lambda function.
     */
    Role?: String;
    /**
     * Amazon Virtual Private Cloud configuration details associated with your Lambda function.
     */
    VpcConfig?: VpcConfig;
    /**
     * A list of tags attached to this resource, listed in the format of key:value pair.
     */
    Tags?: Tags;
  }
  export type Lineage = LineageObject[];
  export interface LineageObject {
    /**
     * The time when the process started. This is in UTC format.
     */
    StartTime?: Timestamp;
    /**
     * The process ID of the child process.
     */
    NamespacePid?: Integer;
    /**
     * The user ID of the user that executed the process.
     */
    UserId?: Integer;
    /**
     * The name of the process.
     */
    Name?: String;
    /**
     * The ID of the process.
     */
    Pid?: Integer;
    /**
     * The unique ID assigned to the process by GuardDuty.
     */
    Uuid?: String;
    /**
     * The absolute path of the process executable file.
     */
    ExecutablePath?: String;
    /**
     * The effective user ID that was used to execute the process.
     */
    Euid?: Integer;
    /**
     * The unique ID of the parent process. This ID is assigned to the parent process by GuardDuty.
     */
    ParentUuid?: String;
  }
  export interface ListCoverageRequest {
    /**
     * The unique ID of the detector whose coverage details you want to retrieve.
     */
    DetectorId: DetectorId;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * Represents the criteria used to filter the coverage details.
     */
    FilterCriteria?: CoverageFilterCriteria;
    /**
     * Represents the criteria used to sort the coverage details.
     */
    SortCriteria?: CoverageSortCriteria;
  }
  export interface ListCoverageResponse {
    /**
     * A list of resources and their attributes providing cluster details.
     */
    Resources: CoverageResources;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    NextToken?: String;
  }
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
     * Represents the criteria used for querying findings. Valid values include:   JSON field name   accountId   region   confidence   id   resource.accessKeyDetails.accessKeyId   resource.accessKeyDetails.principalId   resource.accessKeyDetails.userName   resource.accessKeyDetails.userType   resource.instanceDetails.iamInstanceProfile.id   resource.instanceDetails.imageId   resource.instanceDetails.instanceId   resource.instanceDetails.networkInterfaces.ipv6Addresses   resource.instanceDetails.networkInterfaces.privateIpAddresses.privateIpAddress   resource.instanceDetails.networkInterfaces.publicDnsName   resource.instanceDetails.networkInterfaces.publicIp   resource.instanceDetails.networkInterfaces.securityGroups.groupId   resource.instanceDetails.networkInterfaces.securityGroups.groupName   resource.instanceDetails.networkInterfaces.subnetId   resource.instanceDetails.networkInterfaces.vpcId   resource.instanceDetails.tags.key   resource.instanceDetails.tags.value   resource.resourceType   service.action.actionType   service.action.awsApiCallAction.api   service.action.awsApiCallAction.callerType   service.action.awsApiCallAction.remoteIpDetails.city.cityName   service.action.awsApiCallAction.remoteIpDetails.country.countryName   service.action.awsApiCallAction.remoteIpDetails.ipAddressV4   service.action.awsApiCallAction.remoteIpDetails.organization.asn   service.action.awsApiCallAction.remoteIpDetails.organization.asnOrg   service.action.awsApiCallAction.serviceName   service.action.dnsRequestAction.domain   service.action.networkConnectionAction.blocked   service.action.networkConnectionAction.connectionDirection   service.action.networkConnectionAction.localPortDetails.port   service.action.networkConnectionAction.protocol   service.action.networkConnectionAction.remoteIpDetails.country.countryName   service.action.networkConnectionAction.remoteIpDetails.ipAddressV4   service.action.networkConnectionAction.remoteIpDetails.organization.asn   service.action.networkConnectionAction.remoteIpDetails.organization.asnOrg   service.action.networkConnectionAction.remotePortDetails.port   service.additionalInfo.threatListName   service.archived When this attribute is set to 'true', only archived findings are listed. When it's set to 'false', only unarchived findings are listed. When this attribute is not set, all existing findings are listed.   service.resourceRole   severity   type   updatedAt Type: Timestamp in Unix Epoch millisecond format: 1486685375000  
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
     * Specifies whether to only return associated members or to return all members (including members who haven't been invited yet or have been disassociated). Member accounts must have been previously associated with the GuardDuty administrator account using  Create Members . 
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
  export interface LoginAttribute {
    /**
     * Indicates the user name which attempted to log in.
     */
    User?: String;
    /**
     * Indicates the application name used to attempt log in.
     */
    Application?: String;
    /**
     * Represents the sum of failed (unsuccessful) login attempts made to establish a connection to the database instance.
     */
    FailedLoginAttempts?: Integer;
    /**
     * Represents the sum of successful connections (a correct combination of login attributes) made to the database instance by the actor.
     */
    SuccessfulLoginAttempts?: Integer;
  }
  export type LoginAttributes = LoginAttribute[];
  export type Long = number;
  export type LongValue = number;
  export interface MalwareProtectionConfiguration {
    /**
     * Describes the configuration of Malware Protection for EC2 instances with findings.
     */
    ScanEc2InstanceWithFindings?: ScanEc2InstanceWithFindings;
  }
  export interface MalwareProtectionConfigurationResult {
    /**
     * Describes the configuration of Malware Protection for EC2 instances with findings.
     */
    ScanEc2InstanceWithFindings?: ScanEc2InstanceWithFindingsResult;
    /**
     * The GuardDuty Malware Protection service role.
     */
    ServiceRole?: String;
  }
  export interface MalwareProtectionDataSourceFreeTrial {
    /**
     * Describes whether Malware Protection for EC2 instances with findings is enabled as a data source.
     */
    ScanEc2InstanceWithFindings?: DataSourceFreeTrial;
  }
  export type ManagementType = "AUTO_MANAGED"|"MANUAL"|string;
  export type MapEquals = ScanConditionPair[];
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
    /**
     * The administrator account ID.
     */
    AdministratorId?: String;
  }
  export interface MemberAdditionalConfiguration {
    /**
     * Name of the additional configuration.
     */
    Name?: OrgFeatureAdditionalConfiguration;
    /**
     * Status of the additional configuration.
     */
    Status?: FeatureStatus;
  }
  export interface MemberAdditionalConfigurationResult {
    /**
     * Indicates the name of the additional configuration that is set for the member account.
     */
    Name?: OrgFeatureAdditionalConfiguration;
    /**
     * Indicates the status of the additional configuration that is set for the member account.
     */
    Status?: FeatureStatus;
    /**
     * The timestamp at which the additional configuration was set for the member account. This is in UTC format.
     */
    UpdatedAt?: Timestamp;
  }
  export type MemberAdditionalConfigurationResults = MemberAdditionalConfigurationResult[];
  export type MemberAdditionalConfigurations = MemberAdditionalConfiguration[];
  export interface MemberDataSourceConfiguration {
    /**
     * The account ID for the member account.
     */
    AccountId: AccountId;
    /**
     * Contains information on the status of data sources for the account.
     */
    DataSources?: DataSourceConfigurationsResult;
    /**
     * Contains information about the status of the features for the member account.
     */
    Features?: MemberFeaturesConfigurationsResults;
  }
  export type MemberDataSourceConfigurations = MemberDataSourceConfiguration[];
  export interface MemberFeaturesConfiguration {
    /**
     * The name of the feature.
     */
    Name?: OrgFeature;
    /**
     * The status of the feature.
     */
    Status?: FeatureStatus;
    /**
     * Additional configuration of the feature for the member account.
     */
    AdditionalConfiguration?: MemberAdditionalConfigurations;
  }
  export interface MemberFeaturesConfigurationResult {
    /**
     * Indicates the name of the feature that is enabled for the detector.
     */
    Name?: OrgFeature;
    /**
     * Indicates the status of the feature that is enabled for the detector.
     */
    Status?: FeatureStatus;
    /**
     * The timestamp at which the feature object was updated.
     */
    UpdatedAt?: Timestamp;
    /**
     * Indicates the additional configuration of the feature that is configured for the member account.
     */
    AdditionalConfiguration?: MemberAdditionalConfigurationResults;
  }
  export type MemberFeaturesConfigurations = MemberFeaturesConfiguration[];
  export type MemberFeaturesConfigurationsResults = MemberFeaturesConfigurationResult[];
  export type Members = Member[];
  export type MemoryRegionsList = String[];
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
  export type NonEmptyString = string;
  export type NotEquals = String[];
  export type OrderBy = "ASC"|"DESC"|string;
  export type OrgFeature = "S3_DATA_EVENTS"|"EKS_AUDIT_LOGS"|"EBS_MALWARE_PROTECTION"|"RDS_LOGIN_EVENTS"|"EKS_RUNTIME_MONITORING"|"LAMBDA_NETWORK_LOGS"|string;
  export type OrgFeatureAdditionalConfiguration = "EKS_ADDON_MANAGEMENT"|string;
  export type OrgFeatureStatus = "NEW"|"NONE"|"ALL"|string;
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
  export interface OrganizationAdditionalConfiguration {
    /**
     * The name of the additional configuration that will be configured for the organization.
     */
    Name?: OrgFeatureAdditionalConfiguration;
    /**
     * The status of the additional configuration that will be configured for the organization. Use one of the following values to configure the feature status for the entire organization:    NEW: Indicates that when a new account joins the organization, they will have the additional configuration enabled automatically.     ALL: Indicates that all accounts in the organization have the additional configuration enabled automatically. This includes NEW accounts that join the organization and accounts that may have been suspended or removed from the organization in GuardDuty. It may take up to 24 hours to update the configuration for all the member accounts.    NONE: Indicates that the additional configuration will not be automatically enabled for any account in the organization. The administrator must manage the additional configuration for each account individually.  
     */
    AutoEnable?: OrgFeatureStatus;
  }
  export interface OrganizationAdditionalConfigurationResult {
    /**
     * The name of the additional configuration that is configured for the member accounts within the organization.
     */
    Name?: OrgFeatureAdditionalConfiguration;
    /**
     * Describes the status of the additional configuration that is configured for the member accounts within the organization. One of the following values is the status for the entire organization:    NEW: Indicates that when a new account joins the organization, they will have the additional configuration enabled automatically.     ALL: Indicates that all accounts in the organization have the additional configuration enabled automatically. This includes NEW accounts that join the organization and accounts that may have been suspended or removed from the organization in GuardDuty. It may take up to 24 hours to update the configuration for all the member accounts.    NONE: Indicates that the additional configuration will not be automatically enabled for any account in the organization. The administrator must manage the additional configuration for each account individually.  
     */
    AutoEnable?: OrgFeatureStatus;
  }
  export type OrganizationAdditionalConfigurationResults = OrganizationAdditionalConfigurationResult[];
  export type OrganizationAdditionalConfigurations = OrganizationAdditionalConfiguration[];
  export interface OrganizationDataSourceConfigurations {
    /**
     * Describes whether S3 data event logs are enabled for new members of the organization.
     */
    S3Logs?: OrganizationS3LogsConfiguration;
    /**
     * Describes the configuration of Kubernetes data sources for new members of the organization.
     */
    Kubernetes?: OrganizationKubernetesConfiguration;
    /**
     * Describes the configuration of Malware Protection for new members of the organization.
     */
    MalwareProtection?: OrganizationMalwareProtectionConfiguration;
  }
  export interface OrganizationDataSourceConfigurationsResult {
    /**
     * Describes whether S3 data event logs are enabled as a data source.
     */
    S3Logs: OrganizationS3LogsConfigurationResult;
    /**
     * Describes the configuration of Kubernetes data sources.
     */
    Kubernetes?: OrganizationKubernetesConfigurationResult;
    /**
     * Describes the configuration of Malware Protection data source for an organization.
     */
    MalwareProtection?: OrganizationMalwareProtectionConfigurationResult;
  }
  export interface OrganizationEbsVolumes {
    /**
     * Whether scanning EBS volumes should be auto-enabled for new members joining the organization.
     */
    AutoEnable?: Boolean;
  }
  export interface OrganizationEbsVolumesResult {
    /**
     * An object that contains the status of whether scanning EBS volumes should be auto-enabled for new members joining the organization.
     */
    AutoEnable?: Boolean;
  }
  export interface OrganizationFeatureConfiguration {
    /**
     * The name of the feature that will be configured for the organization.
     */
    Name?: OrgFeature;
    /**
     * Describes the status of the feature that is configured for the member accounts within the organization. One of the following values is the status for the entire organization:    NEW: Indicates that when a new account joins the organization, they will have the feature enabled automatically.     ALL: Indicates that all accounts in the organization have the feature enabled automatically. This includes NEW accounts that join the organization and accounts that may have been suspended or removed from the organization in GuardDuty. It may take up to 24 hours to update the configuration for all the member accounts.    NONE: Indicates that the feature will not be automatically enabled for any account in the organization. The administrator must manage the feature for each account individually.  
     */
    AutoEnable?: OrgFeatureStatus;
    /**
     * The additional information that will be configured for the organization.
     */
    AdditionalConfiguration?: OrganizationAdditionalConfigurations;
  }
  export interface OrganizationFeatureConfigurationResult {
    /**
     * The name of the feature that is configured for the member accounts within the organization.
     */
    Name?: OrgFeature;
    /**
     * Describes the status of the feature that is configured for the member accounts within the organization.    NEW: Indicates that when a new account joins the organization, they will have the feature enabled automatically.     ALL: Indicates that all accounts in the organization have the feature enabled automatically. This includes NEW accounts that join the organization and accounts that may have been suspended or removed from the organization in GuardDuty.    NONE: Indicates that the feature will not be automatically enabled for any account in the organization. In this case, each account will be managed individually by the administrator.  
     */
    AutoEnable?: OrgFeatureStatus;
    /**
     * The additional configuration that is configured for the member accounts within the organization.
     */
    AdditionalConfiguration?: OrganizationAdditionalConfigurationResults;
  }
  export type OrganizationFeaturesConfigurations = OrganizationFeatureConfiguration[];
  export type OrganizationFeaturesConfigurationsResults = OrganizationFeatureConfigurationResult[];
  export interface OrganizationKubernetesAuditLogsConfiguration {
    /**
     * A value that contains information on whether Kubernetes audit logs should be enabled automatically as a data source for the organization.
     */
    AutoEnable: Boolean;
  }
  export interface OrganizationKubernetesAuditLogsConfigurationResult {
    /**
     * Whether Kubernetes audit logs data source should be auto-enabled for new members joining the organization.
     */
    AutoEnable: Boolean;
  }
  export interface OrganizationKubernetesConfiguration {
    /**
     * Whether Kubernetes audit logs data source should be auto-enabled for new members joining the organization.
     */
    AuditLogs: OrganizationKubernetesAuditLogsConfiguration;
  }
  export interface OrganizationKubernetesConfigurationResult {
    /**
     * The current configuration of Kubernetes audit logs as a data source for the organization.
     */
    AuditLogs: OrganizationKubernetesAuditLogsConfigurationResult;
  }
  export interface OrganizationMalwareProtectionConfiguration {
    /**
     * Whether Malware Protection for EC2 instances with findings should be auto-enabled for new members joining the organization.
     */
    ScanEc2InstanceWithFindings?: OrganizationScanEc2InstanceWithFindings;
  }
  export interface OrganizationMalwareProtectionConfigurationResult {
    /**
     * Describes the configuration for scanning EC2 instances with findings for an organization.
     */
    ScanEc2InstanceWithFindings?: OrganizationScanEc2InstanceWithFindingsResult;
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
  export interface OrganizationScanEc2InstanceWithFindings {
    /**
     * Whether scanning EBS volumes should be auto-enabled for new members joining the organization.
     */
    EbsVolumes?: OrganizationEbsVolumes;
  }
  export interface OrganizationScanEc2InstanceWithFindingsResult {
    /**
     * Describes the configuration for scanning EBS volumes for an organization.
     */
    EbsVolumes?: OrganizationEbsVolumesResult;
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
  export type PositiveLong = number;
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
  export interface ProcessDetails {
    /**
     * The name of the process.
     */
    Name?: String;
    /**
     * The absolute path of the process executable file.
     */
    ExecutablePath?: String;
    /**
     * The SHA256 hash of the process executable.
     */
    ExecutableSha256?: String;
    /**
     * The ID of the child process.
     */
    NamespacePid?: Integer;
    /**
     * The present working directory of the process.
     */
    Pwd?: String;
    /**
     * The ID of the process.
     */
    Pid?: Integer;
    /**
     * The time when the process started. This is in UTC format.
     */
    StartTime?: Timestamp;
    /**
     * The unique ID assigned to the process by GuardDuty.
     */
    Uuid?: String;
    /**
     * The unique ID of the parent process. This ID is assigned to the parent process by GuardDuty.
     */
    ParentUuid?: String;
    /**
     * The user that executed the process.
     */
    User?: String;
    /**
     * The unique ID of the user that executed the process.
     */
    UserId?: Integer;
    /**
     * The effective user ID of the user that executed the process.
     */
    Euid?: Integer;
    /**
     * Information about the process's lineage.
     */
    Lineage?: Lineage;
  }
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
  export interface RdsDbInstanceDetails {
    /**
     * The identifier associated to the database instance that was involved in the finding.
     */
    DbInstanceIdentifier?: String;
    /**
     * The database engine of the database instance involved in the finding.
     */
    Engine?: String;
    /**
     * The version of the database engine that was involved in the finding.
     */
    EngineVersion?: String;
    /**
     * The identifier of the database cluster that contains the database instance ID involved in the finding.
     */
    DbClusterIdentifier?: String;
    /**
     * The Amazon Resource Name (ARN) that identifies the database instance involved in the finding.
     */
    DbInstanceArn?: String;
    /**
     * Instance tag key-value pairs associated with the database instance ID.
     */
    Tags?: Tags;
  }
  export interface RdsDbUserDetails {
    /**
     * The user name used in the anomalous login attempt.
     */
    User?: String;
    /**
     * The application name used in the anomalous login attempt.
     */
    Application?: String;
    /**
     * The name of the database instance involved in the anomalous login attempt.
     */
    Database?: String;
    /**
     * The version of the Secure Socket Layer (SSL) used for the network.
     */
    Ssl?: String;
    /**
     * The authentication method used by the user involved in the finding.
     */
    AuthMethod?: String;
  }
  export interface RdsLoginAttemptAction {
    RemoteIpDetails?: RemoteIpDetails;
    /**
     * Indicates the login attributes used in the login attempt.
     */
    LoginAttributes?: LoginAttributes;
  }
  export interface RemoteAccountDetails {
    /**
     * The Amazon Web Services account ID of the remote API caller.
     */
    AccountId?: String;
    /**
     * Details on whether the Amazon Web Services account of the remote API caller is related to your GuardDuty environment. If this value is True the API caller is affiliated to your account in some way. If it is False the API caller is from outside your environment.
     */
    Affiliated?: Boolean;
  }
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
     * The IAM access key details (user information) of a user that engaged in the activity that prompted GuardDuty to generate a finding.
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
     * Details about the EKS cluster involved in a Kubernetes finding.
     */
    EksClusterDetails?: EksClusterDetails;
    /**
     * Details about the Kubernetes user and workload involved in a Kubernetes finding.
     */
    KubernetesDetails?: KubernetesDetails;
    /**
     * The type of Amazon Web Services resource.
     */
    ResourceType?: String;
    /**
     * Contains list of scanned and skipped EBS volumes with details.
     */
    EbsVolumeDetails?: EbsVolumeDetails;
    /**
     * Contains information about the details of the ECS Cluster.
     */
    EcsClusterDetails?: EcsClusterDetails;
    ContainerDetails?: Container;
    /**
     * Contains information about the database instance to which an anomalous login attempt was made.
     */
    RdsDbInstanceDetails?: RdsDbInstanceDetails;
    /**
     * Contains information about the user details through which anomalous login attempt was made.
     */
    RdsDbUserDetails?: RdsDbUserDetails;
    /**
     * Contains information about the Lambda function that was involved in a finding.
     */
    LambdaDetails?: LambdaDetails;
  }
  export type ResourceArn = string;
  export interface ResourceDetails {
    /**
     * InstanceArn that was scanned in the scan entry.
     */
    InstanceArn?: InstanceArn;
  }
  export type ResourceList = String[];
  export type ResourceType = "EKS"|string;
  export interface RuntimeContext {
    /**
     * Information about the process that modified the current process. This is available for multiple finding types.
     */
    ModifyingProcess?: ProcessDetails;
    /**
     * The timestamp at which the process modified the current process. The timestamp is in UTC date string format.
     */
    ModifiedAt?: Timestamp;
    /**
     * The path to the script that was executed.
     */
    ScriptPath?: String;
    /**
     * The path to the new library that was loaded.
     */
    LibraryPath?: String;
    /**
     * The value of the LD_PRELOAD environment variable.
     */
    LdPreloadValue?: String;
    /**
     * The path to the docket socket that was accessed.
     */
    SocketPath?: String;
    /**
     * The path to the leveraged runc implementation.
     */
    RuncBinaryPath?: String;
    /**
     * The path in the container that modified the release agent file.
     */
    ReleaseAgentPath?: String;
    /**
     * The path on the host that is mounted by the container.
     */
    MountSource?: String;
    /**
     * The path in the container that is mapped to the host directory.
     */
    MountTarget?: String;
    /**
     * Represents the type of mounted fileSystem.
     */
    FileSystemType?: String;
    /**
     * Represents options that control the behavior of a runtime operation or action. For example, a filesystem mount operation may contain a read-only flag.
     */
    Flags?: FlagsList;
    /**
     * The name of the module loaded into the kernel.
     */
    ModuleName?: String;
    /**
     * The path to the module loaded into the kernel.
     */
    ModuleFilePath?: String;
    /**
     * The SHA256 hash of the module.
     */
    ModuleSha256?: String;
    /**
     * The path to the modified shell history file.
     */
    ShellHistoryFilePath?: String;
    /**
     * Information about the process that had its memory overwritten by the current process.
     */
    TargetProcess?: ProcessDetails;
    /**
     * Represents the communication protocol associated with the address. For example, the address family AF_INET is used for IP version of 4 protocol.
     */
    AddressFamily?: String;
    /**
     * Specifies a particular protocol within the address family. Usually there is a single protocol in address families. For example, the address family AF_INET only has the IP protocol.
     */
    IanaProtocolNumber?: Integer;
    /**
     * Specifies the Region of a process's address space such as stack and heap.
     */
    MemoryRegions?: MemoryRegionsList;
  }
  export interface RuntimeDetails {
    /**
     * Information about the observed process.
     */
    Process?: ProcessDetails;
    /**
     * Additional information about the suspicious activity.
     */
    Context?: RuntimeContext;
  }
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
  export interface Scan {
    /**
     * The unique ID of the detector that the request is associated with.
     */
    DetectorId?: DetectorId;
    /**
     * The unique detector ID of the administrator account that the request is associated with. Note that this value will be the same as the one used for DetectorId if the account is an administrator.
     */
    AdminDetectorId?: DetectorId;
    /**
     * The unique scan ID associated with a scan entry.
     */
    ScanId?: NonEmptyString;
    /**
     * An enum value representing possible scan statuses.
     */
    ScanStatus?: ScanStatus;
    /**
     * Represents the reason for FAILED scan status.
     */
    FailureReason?: NonEmptyString;
    /**
     * The timestamp of when the scan was triggered.
     */
    ScanStartTime?: Timestamp;
    /**
     * The timestamp of when the scan was finished.
     */
    ScanEndTime?: Timestamp;
    /**
     * Specifies the reason why the scan was initiated.
     */
    TriggerDetails?: TriggerDetails;
    /**
     * Represents the resources that were scanned in the scan entry.
     */
    ResourceDetails?: ResourceDetails;
    /**
     * Represents the result of the scan.
     */
    ScanResultDetails?: ScanResultDetails;
    /**
     * The ID for the account that belongs to the scan.
     */
    AccountId?: AccountId;
    /**
     * Represents total bytes that were scanned.
     */
    TotalBytes?: PositiveLong;
    /**
     * Represents the number of files that were scanned.
     */
    FileCount?: PositiveLong;
    /**
     * List of volumes that were attached to the original instance to be scanned.
     */
    AttachedVolumes?: VolumeDetails;
    /**
     * Specifies the scan type that invoked the malware scan.
     */
    ScanType?: ScanType;
  }
  export interface ScanCondition {
    /**
     * Represents an mapEqual  condition to be applied to a single field when triggering for malware scan.
     */
    MapEquals: MapEquals;
  }
  export interface ScanConditionPair {
    /**
     * Represents the key in the map condition.
     */
    Key: TagKey;
    /**
     * Represents optional value in the map condition. If not specified, only the key will be matched.
     */
    Value?: TagValue;
  }
  export type ScanCriterion = {[key: string]: ScanCondition};
  export type ScanCriterionKey = "EC2_INSTANCE_TAG"|string;
  export interface ScanDetections {
    /**
     * Total number of scanned files.
     */
    ScannedItemCount?: ScannedItemCount;
    /**
     * Total number of infected files.
     */
    ThreatsDetectedItemCount?: ThreatsDetectedItemCount;
    /**
     * Details of the highest severity threat detected during malware scan and number of infected files.
     */
    HighestSeverityThreatDetails?: HighestSeverityThreatDetails;
    /**
     * Contains details about identified threats organized by threat name.
     */
    ThreatDetectedByName?: ThreatDetectedByName;
  }
  export interface ScanEc2InstanceWithFindings {
    /**
     * Describes the configuration for scanning EBS volumes as data source.
     */
    EbsVolumes?: Boolean;
  }
  export interface ScanEc2InstanceWithFindingsResult {
    /**
     * Describes the configuration of scanning EBS volumes as a data source.
     */
    EbsVolumes?: EbsVolumesResult;
  }
  export interface ScanFilePath {
    /**
     * The file path of the infected file.
     */
    FilePath?: String;
    /**
     * EBS volume Arn details of the infected file.
     */
    VolumeArn?: String;
    /**
     * The hash value of the infected file.
     */
    Hash?: String;
    /**
     * File name of the infected file.
     */
    FileName?: String;
  }
  export interface ScanResourceCriteria {
    /**
     * Represents condition that when matched will allow a malware scan for a certain resource.
     */
    Include?: ScanCriterion;
    /**
     * Represents condition that when matched will prevent a malware scan for a certain resource.
     */
    Exclude?: ScanCriterion;
  }
  export type ScanResult = "CLEAN"|"INFECTED"|string;
  export interface ScanResultDetails {
    /**
     * An enum value representing possible scan results.
     */
    ScanResult?: ScanResult;
  }
  export type ScanStatus = "RUNNING"|"COMPLETED"|"FAILED"|"SKIPPED"|string;
  export interface ScanThreatName {
    /**
     * The name of the identified threat.
     */
    Name?: String;
    /**
     * Severity of threat identified as part of the malware scan.
     */
    Severity?: String;
    /**
     * Total number of files infected with given threat.
     */
    ItemCount?: Integer;
    /**
     * List of infected files in EBS volume with details.
     */
    FilePaths?: FilePaths;
  }
  export type ScanThreatNames = ScanThreatName[];
  export type ScanType = "GUARDDUTY_INITIATED"|"ON_DEMAND"|string;
  export interface ScannedItemCount {
    /**
     * Total GB of files scanned for malware.
     */
    TotalGb?: Integer;
    /**
     * Number of files scanned.
     */
    Files?: Integer;
    /**
     * Total number of scanned volumes.
     */
    Volumes?: Integer;
  }
  export type Scans = Scan[];
  export interface SecurityContext {
    /**
     * Whether the container is privileged.
     */
    Privileged?: Boolean;
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
     * The name of the Amazon Web Services service (GuardDuty) that generated a finding.
     */
    ServiceName?: String;
    /**
     * Feedback that was submitted about the finding.
     */
    UserFeedback?: String;
    /**
     * Contains additional information about the generated finding.
     */
    AdditionalInfo?: ServiceAdditionalInfo;
    /**
     * The name of the feature that generated a finding.
     */
    FeatureName?: String;
    /**
     * Returns details from the malware scan that created a finding.
     */
    EbsVolumeScanDetails?: EbsVolumeScanDetails;
    /**
     * Information about the process and any required context values for a specific finding
     */
    RuntimeDetails?: RuntimeDetails;
  }
  export interface ServiceAdditionalInfo {
    /**
     * This field specifies the value of the additional information.
     */
    Value?: String;
    /**
     * Describes the type of the additional information.
     */
    Type?: String;
  }
  export type SessionNameList = String[];
  export interface SortCriteria {
    /**
     * Represents the finding attribute, such as accountId, that sorts the findings.
     */
    AttributeName?: String;
    /**
     * The order by which the sorted findings are to be displayed.
     */
    OrderBy?: OrderBy;
  }
  export type SourceIps = String[];
  export type Sources = String[];
  export interface StartMalwareScanRequest {
    /**
     * Amazon Resource Name (ARN) of the resource for which you invoked the API.
     */
    ResourceArn: ResourceArn;
  }
  export interface StartMalwareScanResponse {
    /**
     * A unique identifier that gets generated when you invoke the API without any error. Each malware scan has a corresponding scan ID. Using this scan ID, you can monitor the status of your malware scan.
     */
    ScanId?: NonEmptyString;
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
  export type SubnetIds = String[];
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
  export interface ThreatDetectedByName {
    /**
     * Total number of infected files identified.
     */
    ItemCount?: Integer;
    /**
     * Total number of unique threats by name identified, as part of the malware scan.
     */
    UniqueThreatNameCount?: Integer;
    /**
     * Flag to determine if the finding contains every single infected file-path and/or every threat.
     */
    Shortened?: Boolean;
    /**
     * List of identified threats with details, organized by threat name.
     */
    ThreatNames?: ScanThreatNames;
  }
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
  export interface ThreatsDetectedItemCount {
    /**
     * Total number of infected files.
     */
    Files?: Integer;
  }
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
  export interface TriggerDetails {
    /**
     * The ID of the GuardDuty finding that triggered the malware scan.
     */
    GuardDutyFindingId?: NonEmptyString;
    /**
     * The description of the scan trigger.
     */
    Description?: NonEmptyString;
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
     * The Amazon Web Services account ID.
     */
    AccountId: AccountId;
    /**
     * A reason why the account hasn't been processed.
     */
    Result: String;
  }
  export type UnprocessedAccounts = UnprocessedAccount[];
  export interface UnprocessedDataSourcesResult {
    MalwareProtection?: MalwareProtectionConfigurationResult;
  }
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
     * Describes which data sources will be updated. There might be regional differences because some data sources might not be available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more information, see Regions and endpoints.
     */
    DataSources?: DataSourceConfigurations;
    /**
     * Provides the features that will be updated for the detector.
     */
    Features?: DetectorFeatureConfigurations;
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
     * The description of the filter. Valid characters include alphanumeric characters, and special characters such as hyphen, period, colon, underscore, parentheses ({ }, [ ], and ( )), forward slash, horizontal tab, vertical tab, newline, form feed, return, and whitespace.
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
     * The updated URI of the file that contains the IPSet. 
     */
    Location?: Location;
    /**
     * The updated Boolean value that specifies whether the IPSet is active or not.
     */
    Activate?: Boolean;
  }
  export interface UpdateIPSetResponse {
  }
  export interface UpdateMalwareScanSettingsRequest {
    /**
     * The unique ID of the detector that specifies the GuardDuty service where you want to update scan settings.
     */
    DetectorId: DetectorId;
    /**
     * Represents the criteria to be used in the filter for selecting resources to scan.
     */
    ScanResourceCriteria?: ScanResourceCriteria;
    /**
     * An enum value representing possible snapshot preservation settings.
     */
    EbsSnapshotPreservation?: EbsSnapshotPreservation;
  }
  export interface UpdateMalwareScanSettingsResponse {
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
    /**
     * A list of features that will be updated for the specified member accounts.
     */
    Features?: MemberFeaturesConfigurations;
  }
  export interface UpdateMemberDetectorsResponse {
    /**
     * A list of member account IDs that were unable to be processed along with an explanation for why they were not processed.
     */
    UnprocessedAccounts: UnprocessedAccounts;
  }
  export interface UpdateOrganizationConfigurationRequest {
    /**
     * The ID of the detector that configures the delegated administrator.
     */
    DetectorId: DetectorId;
    /**
     * Represents whether or not to automatically enable member accounts in the organization. Even though this is still supported, we recommend using AutoEnableOrganizationMembers to achieve the similar results. You must provide a value for either autoEnableOrganizationMembers or autoEnable.
     */
    AutoEnable?: Boolean;
    /**
     * Describes which data sources will be updated.
     */
    DataSources?: OrganizationDataSourceConfigurations;
    /**
     * A list of features that will be configured for the organization.
     */
    Features?: OrganizationFeaturesConfigurations;
    /**
     * Indicates the auto-enablement configuration of GuardDuty for the member accounts in the organization. You must provide a value for either autoEnableOrganizationMembers or autoEnable.  Use one of the following configuration values for autoEnableOrganizationMembers:    NEW: Indicates that when a new account joins the organization, they will have GuardDuty enabled automatically.     ALL: Indicates that all accounts in the organization have GuardDuty enabled automatically. This includes NEW accounts that join the organization and accounts that may have been suspended or removed from the organization in GuardDuty. It may take up to 24 hours to update the configuration for all the member accounts.    NONE: Indicates that GuardDuty will not be automatically enabled for any account in the organization. The administrator must manage GuardDuty for each account in the organization individually.  
     */
    AutoEnableOrganizationMembers?: AutoEnableMembers;
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
    DataSources?: DataSourceList;
    /**
     * The resources to aggregate usage statistics from. Only accepts exact resource names.
     */
    Resources?: ResourceList;
    /**
     * The features to aggregate usage statistics from.
     */
    Features?: UsageFeatureList;
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
  export type UsageFeature = "FLOW_LOGS"|"CLOUD_TRAIL"|"DNS_LOGS"|"S3_DATA_EVENTS"|"EKS_AUDIT_LOGS"|"EBS_MALWARE_PROTECTION"|"RDS_LOGIN_EVENTS"|"LAMBDA_NETWORK_LOGS"|"EKS_RUNTIME_MONITORING"|string;
  export type UsageFeatureList = UsageFeature[];
  export interface UsageFeatureResult {
    /**
     * The feature that generated the usage cost.
     */
    Feature?: UsageFeature;
    Total?: Total;
  }
  export type UsageFeatureResultList = UsageFeatureResult[];
  export interface UsageResourceResult {
    /**
     * The Amazon Web Services resource that generated usage.
     */
    Resource?: String;
    /**
     * Represents the sum total of usage for the specified resource type.
     */
    Total?: Total;
  }
  export type UsageResourceResultList = UsageResourceResult[];
  export type UsageStatisticType = "SUM_BY_ACCOUNT"|"SUM_BY_DATA_SOURCE"|"SUM_BY_RESOURCE"|"TOP_RESOURCES"|"SUM_BY_FEATURES"|string;
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
    /**
     * The usage statistic sum organized by feature.
     */
    SumByFeature?: UsageFeatureResultList;
  }
  export interface Volume {
    /**
     * Volume name.
     */
    Name?: String;
    /**
     * Represents a pre-existing file or directory on the host machine that the volume maps to.
     */
    HostPath?: HostPath;
  }
  export interface VolumeDetail {
    /**
     * EBS volume Arn information.
     */
    VolumeArn?: String;
    /**
     * The EBS volume type.
     */
    VolumeType?: String;
    /**
     * The device name for the EBS volume.
     */
    DeviceName?: String;
    /**
     * EBS volume size in GB.
     */
    VolumeSizeInGB?: Integer;
    /**
     * EBS volume encryption type.
     */
    EncryptionType?: String;
    /**
     * Snapshot Arn of the EBS volume.
     */
    SnapshotArn?: String;
    /**
     * KMS key Arn used to encrypt the EBS volume.
     */
    KmsKeyArn?: String;
  }
  export type VolumeDetails = VolumeDetail[];
  export interface VolumeMount {
    /**
     * Volume mount name.
     */
    Name?: String;
    /**
     * Volume mount path.
     */
    MountPath?: String;
  }
  export type VolumeMounts = VolumeMount[];
  export type Volumes = Volume[];
  export interface VpcConfig {
    /**
     * The identifiers of the subnets that are associated with your Lambda function.
     */
    SubnetIds?: SubnetIds;
    /**
     * The identifier of the Amazon Virtual Private Cloud.
     */
    VpcId?: String;
    /**
     * The identifier of the security group attached to the Lambda function.
     */
    SecurityGroups?: SecurityGroups;
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
