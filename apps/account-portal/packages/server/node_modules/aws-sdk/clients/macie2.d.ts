import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Macie2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Macie2.Types.ClientConfiguration)
  config: Config & Macie2.Types.ClientConfiguration;
  /**
   * Accepts an Amazon Macie membership invitation that was received from a specific account.
   */
  acceptInvitation(params: Macie2.Types.AcceptInvitationRequest, callback?: (err: AWSError, data: Macie2.Types.AcceptInvitationResponse) => void): Request<Macie2.Types.AcceptInvitationResponse, AWSError>;
  /**
   * Accepts an Amazon Macie membership invitation that was received from a specific account.
   */
  acceptInvitation(callback?: (err: AWSError, data: Macie2.Types.AcceptInvitationResponse) => void): Request<Macie2.Types.AcceptInvitationResponse, AWSError>;
  /**
   * Retrieves information about one or more custom data identifiers.
   */
  batchGetCustomDataIdentifiers(params: Macie2.Types.BatchGetCustomDataIdentifiersRequest, callback?: (err: AWSError, data: Macie2.Types.BatchGetCustomDataIdentifiersResponse) => void): Request<Macie2.Types.BatchGetCustomDataIdentifiersResponse, AWSError>;
  /**
   * Retrieves information about one or more custom data identifiers.
   */
  batchGetCustomDataIdentifiers(callback?: (err: AWSError, data: Macie2.Types.BatchGetCustomDataIdentifiersResponse) => void): Request<Macie2.Types.BatchGetCustomDataIdentifiersResponse, AWSError>;
  /**
   * Creates and defines the settings for an allow list.
   */
  createAllowList(params: Macie2.Types.CreateAllowListRequest, callback?: (err: AWSError, data: Macie2.Types.CreateAllowListResponse) => void): Request<Macie2.Types.CreateAllowListResponse, AWSError>;
  /**
   * Creates and defines the settings for an allow list.
   */
  createAllowList(callback?: (err: AWSError, data: Macie2.Types.CreateAllowListResponse) => void): Request<Macie2.Types.CreateAllowListResponse, AWSError>;
  /**
   * Creates and defines the settings for a classification job.
   */
  createClassificationJob(params: Macie2.Types.CreateClassificationJobRequest, callback?: (err: AWSError, data: Macie2.Types.CreateClassificationJobResponse) => void): Request<Macie2.Types.CreateClassificationJobResponse, AWSError>;
  /**
   * Creates and defines the settings for a classification job.
   */
  createClassificationJob(callback?: (err: AWSError, data: Macie2.Types.CreateClassificationJobResponse) => void): Request<Macie2.Types.CreateClassificationJobResponse, AWSError>;
  /**
   * Creates and defines the criteria and other settings for a custom data identifier.
   */
  createCustomDataIdentifier(params: Macie2.Types.CreateCustomDataIdentifierRequest, callback?: (err: AWSError, data: Macie2.Types.CreateCustomDataIdentifierResponse) => void): Request<Macie2.Types.CreateCustomDataIdentifierResponse, AWSError>;
  /**
   * Creates and defines the criteria and other settings for a custom data identifier.
   */
  createCustomDataIdentifier(callback?: (err: AWSError, data: Macie2.Types.CreateCustomDataIdentifierResponse) => void): Request<Macie2.Types.CreateCustomDataIdentifierResponse, AWSError>;
  /**
   * Creates and defines the criteria and other settings for a findings filter.
   */
  createFindingsFilter(params: Macie2.Types.CreateFindingsFilterRequest, callback?: (err: AWSError, data: Macie2.Types.CreateFindingsFilterResponse) => void): Request<Macie2.Types.CreateFindingsFilterResponse, AWSError>;
  /**
   * Creates and defines the criteria and other settings for a findings filter.
   */
  createFindingsFilter(callback?: (err: AWSError, data: Macie2.Types.CreateFindingsFilterResponse) => void): Request<Macie2.Types.CreateFindingsFilterResponse, AWSError>;
  /**
   * Sends an Amazon Macie membership invitation to one or more accounts.
   */
  createInvitations(params: Macie2.Types.CreateInvitationsRequest, callback?: (err: AWSError, data: Macie2.Types.CreateInvitationsResponse) => void): Request<Macie2.Types.CreateInvitationsResponse, AWSError>;
  /**
   * Sends an Amazon Macie membership invitation to one or more accounts.
   */
  createInvitations(callback?: (err: AWSError, data: Macie2.Types.CreateInvitationsResponse) => void): Request<Macie2.Types.CreateInvitationsResponse, AWSError>;
  /**
   * Associates an account with an Amazon Macie administrator account.
   */
  createMember(params: Macie2.Types.CreateMemberRequest, callback?: (err: AWSError, data: Macie2.Types.CreateMemberResponse) => void): Request<Macie2.Types.CreateMemberResponse, AWSError>;
  /**
   * Associates an account with an Amazon Macie administrator account.
   */
  createMember(callback?: (err: AWSError, data: Macie2.Types.CreateMemberResponse) => void): Request<Macie2.Types.CreateMemberResponse, AWSError>;
  /**
   * Creates sample findings.
   */
  createSampleFindings(params: Macie2.Types.CreateSampleFindingsRequest, callback?: (err: AWSError, data: Macie2.Types.CreateSampleFindingsResponse) => void): Request<Macie2.Types.CreateSampleFindingsResponse, AWSError>;
  /**
   * Creates sample findings.
   */
  createSampleFindings(callback?: (err: AWSError, data: Macie2.Types.CreateSampleFindingsResponse) => void): Request<Macie2.Types.CreateSampleFindingsResponse, AWSError>;
  /**
   * Declines Amazon Macie membership invitations that were received from specific accounts.
   */
  declineInvitations(params: Macie2.Types.DeclineInvitationsRequest, callback?: (err: AWSError, data: Macie2.Types.DeclineInvitationsResponse) => void): Request<Macie2.Types.DeclineInvitationsResponse, AWSError>;
  /**
   * Declines Amazon Macie membership invitations that were received from specific accounts.
   */
  declineInvitations(callback?: (err: AWSError, data: Macie2.Types.DeclineInvitationsResponse) => void): Request<Macie2.Types.DeclineInvitationsResponse, AWSError>;
  /**
   * Deletes an allow list.
   */
  deleteAllowList(params: Macie2.Types.DeleteAllowListRequest, callback?: (err: AWSError, data: Macie2.Types.DeleteAllowListResponse) => void): Request<Macie2.Types.DeleteAllowListResponse, AWSError>;
  /**
   * Deletes an allow list.
   */
  deleteAllowList(callback?: (err: AWSError, data: Macie2.Types.DeleteAllowListResponse) => void): Request<Macie2.Types.DeleteAllowListResponse, AWSError>;
  /**
   * Soft deletes a custom data identifier.
   */
  deleteCustomDataIdentifier(params: Macie2.Types.DeleteCustomDataIdentifierRequest, callback?: (err: AWSError, data: Macie2.Types.DeleteCustomDataIdentifierResponse) => void): Request<Macie2.Types.DeleteCustomDataIdentifierResponse, AWSError>;
  /**
   * Soft deletes a custom data identifier.
   */
  deleteCustomDataIdentifier(callback?: (err: AWSError, data: Macie2.Types.DeleteCustomDataIdentifierResponse) => void): Request<Macie2.Types.DeleteCustomDataIdentifierResponse, AWSError>;
  /**
   * Deletes a findings filter.
   */
  deleteFindingsFilter(params: Macie2.Types.DeleteFindingsFilterRequest, callback?: (err: AWSError, data: Macie2.Types.DeleteFindingsFilterResponse) => void): Request<Macie2.Types.DeleteFindingsFilterResponse, AWSError>;
  /**
   * Deletes a findings filter.
   */
  deleteFindingsFilter(callback?: (err: AWSError, data: Macie2.Types.DeleteFindingsFilterResponse) => void): Request<Macie2.Types.DeleteFindingsFilterResponse, AWSError>;
  /**
   * Deletes Amazon Macie membership invitations that were received from specific accounts.
   */
  deleteInvitations(params: Macie2.Types.DeleteInvitationsRequest, callback?: (err: AWSError, data: Macie2.Types.DeleteInvitationsResponse) => void): Request<Macie2.Types.DeleteInvitationsResponse, AWSError>;
  /**
   * Deletes Amazon Macie membership invitations that were received from specific accounts.
   */
  deleteInvitations(callback?: (err: AWSError, data: Macie2.Types.DeleteInvitationsResponse) => void): Request<Macie2.Types.DeleteInvitationsResponse, AWSError>;
  /**
   * Deletes the association between an Amazon Macie administrator account and an account.
   */
  deleteMember(params: Macie2.Types.DeleteMemberRequest, callback?: (err: AWSError, data: Macie2.Types.DeleteMemberResponse) => void): Request<Macie2.Types.DeleteMemberResponse, AWSError>;
  /**
   * Deletes the association between an Amazon Macie administrator account and an account.
   */
  deleteMember(callback?: (err: AWSError, data: Macie2.Types.DeleteMemberResponse) => void): Request<Macie2.Types.DeleteMemberResponse, AWSError>;
  /**
   * Retrieves (queries) statistical data and other information about one or more S3 buckets that Amazon Macie monitors and analyzes for an account.
   */
  describeBuckets(params: Macie2.Types.DescribeBucketsRequest, callback?: (err: AWSError, data: Macie2.Types.DescribeBucketsResponse) => void): Request<Macie2.Types.DescribeBucketsResponse, AWSError>;
  /**
   * Retrieves (queries) statistical data and other information about one or more S3 buckets that Amazon Macie monitors and analyzes for an account.
   */
  describeBuckets(callback?: (err: AWSError, data: Macie2.Types.DescribeBucketsResponse) => void): Request<Macie2.Types.DescribeBucketsResponse, AWSError>;
  /**
   * Retrieves the status and settings for a classification job.
   */
  describeClassificationJob(params: Macie2.Types.DescribeClassificationJobRequest, callback?: (err: AWSError, data: Macie2.Types.DescribeClassificationJobResponse) => void): Request<Macie2.Types.DescribeClassificationJobResponse, AWSError>;
  /**
   * Retrieves the status and settings for a classification job.
   */
  describeClassificationJob(callback?: (err: AWSError, data: Macie2.Types.DescribeClassificationJobResponse) => void): Request<Macie2.Types.DescribeClassificationJobResponse, AWSError>;
  /**
   * Retrieves the Amazon Macie configuration settings for an organization in Organizations.
   */
  describeOrganizationConfiguration(params: Macie2.Types.DescribeOrganizationConfigurationRequest, callback?: (err: AWSError, data: Macie2.Types.DescribeOrganizationConfigurationResponse) => void): Request<Macie2.Types.DescribeOrganizationConfigurationResponse, AWSError>;
  /**
   * Retrieves the Amazon Macie configuration settings for an organization in Organizations.
   */
  describeOrganizationConfiguration(callback?: (err: AWSError, data: Macie2.Types.DescribeOrganizationConfigurationResponse) => void): Request<Macie2.Types.DescribeOrganizationConfigurationResponse, AWSError>;
  /**
   * Disables Amazon Macie and deletes all settings and resources for a Macie account.
   */
  disableMacie(params: Macie2.Types.DisableMacieRequest, callback?: (err: AWSError, data: Macie2.Types.DisableMacieResponse) => void): Request<Macie2.Types.DisableMacieResponse, AWSError>;
  /**
   * Disables Amazon Macie and deletes all settings and resources for a Macie account.
   */
  disableMacie(callback?: (err: AWSError, data: Macie2.Types.DisableMacieResponse) => void): Request<Macie2.Types.DisableMacieResponse, AWSError>;
  /**
   * Disables an account as the delegated Amazon Macie administrator account for an organization in Organizations.
   */
  disableOrganizationAdminAccount(params: Macie2.Types.DisableOrganizationAdminAccountRequest, callback?: (err: AWSError, data: Macie2.Types.DisableOrganizationAdminAccountResponse) => void): Request<Macie2.Types.DisableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Disables an account as the delegated Amazon Macie administrator account for an organization in Organizations.
   */
  disableOrganizationAdminAccount(callback?: (err: AWSError, data: Macie2.Types.DisableOrganizationAdminAccountResponse) => void): Request<Macie2.Types.DisableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Disassociates a member account from its Amazon Macie administrator account.
   */
  disassociateFromAdministratorAccount(params: Macie2.Types.DisassociateFromAdministratorAccountRequest, callback?: (err: AWSError, data: Macie2.Types.DisassociateFromAdministratorAccountResponse) => void): Request<Macie2.Types.DisassociateFromAdministratorAccountResponse, AWSError>;
  /**
   * Disassociates a member account from its Amazon Macie administrator account.
   */
  disassociateFromAdministratorAccount(callback?: (err: AWSError, data: Macie2.Types.DisassociateFromAdministratorAccountResponse) => void): Request<Macie2.Types.DisassociateFromAdministratorAccountResponse, AWSError>;
  /**
   * (Deprecated) Disassociates a member account from its Amazon Macie administrator account. This operation has been replaced by the DisassociateFromAdministratorAccount operation.
   */
  disassociateFromMasterAccount(params: Macie2.Types.DisassociateFromMasterAccountRequest, callback?: (err: AWSError, data: Macie2.Types.DisassociateFromMasterAccountResponse) => void): Request<Macie2.Types.DisassociateFromMasterAccountResponse, AWSError>;
  /**
   * (Deprecated) Disassociates a member account from its Amazon Macie administrator account. This operation has been replaced by the DisassociateFromAdministratorAccount operation.
   */
  disassociateFromMasterAccount(callback?: (err: AWSError, data: Macie2.Types.DisassociateFromMasterAccountResponse) => void): Request<Macie2.Types.DisassociateFromMasterAccountResponse, AWSError>;
  /**
   * Disassociates an Amazon Macie administrator account from a member account.
   */
  disassociateMember(params: Macie2.Types.DisassociateMemberRequest, callback?: (err: AWSError, data: Macie2.Types.DisassociateMemberResponse) => void): Request<Macie2.Types.DisassociateMemberResponse, AWSError>;
  /**
   * Disassociates an Amazon Macie administrator account from a member account.
   */
  disassociateMember(callback?: (err: AWSError, data: Macie2.Types.DisassociateMemberResponse) => void): Request<Macie2.Types.DisassociateMemberResponse, AWSError>;
  /**
   * Enables Amazon Macie and specifies the configuration settings for a Macie account.
   */
  enableMacie(params: Macie2.Types.EnableMacieRequest, callback?: (err: AWSError, data: Macie2.Types.EnableMacieResponse) => void): Request<Macie2.Types.EnableMacieResponse, AWSError>;
  /**
   * Enables Amazon Macie and specifies the configuration settings for a Macie account.
   */
  enableMacie(callback?: (err: AWSError, data: Macie2.Types.EnableMacieResponse) => void): Request<Macie2.Types.EnableMacieResponse, AWSError>;
  /**
   * Designates an account as the delegated Amazon Macie administrator account for an organization in Organizations.
   */
  enableOrganizationAdminAccount(params: Macie2.Types.EnableOrganizationAdminAccountRequest, callback?: (err: AWSError, data: Macie2.Types.EnableOrganizationAdminAccountResponse) => void): Request<Macie2.Types.EnableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Designates an account as the delegated Amazon Macie administrator account for an organization in Organizations.
   */
  enableOrganizationAdminAccount(callback?: (err: AWSError, data: Macie2.Types.EnableOrganizationAdminAccountResponse) => void): Request<Macie2.Types.EnableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Retrieves information about the Amazon Macie administrator account for an account.
   */
  getAdministratorAccount(params: Macie2.Types.GetAdministratorAccountRequest, callback?: (err: AWSError, data: Macie2.Types.GetAdministratorAccountResponse) => void): Request<Macie2.Types.GetAdministratorAccountResponse, AWSError>;
  /**
   * Retrieves information about the Amazon Macie administrator account for an account.
   */
  getAdministratorAccount(callback?: (err: AWSError, data: Macie2.Types.GetAdministratorAccountResponse) => void): Request<Macie2.Types.GetAdministratorAccountResponse, AWSError>;
  /**
   * Retrieves the settings and status of an allow list.
   */
  getAllowList(params: Macie2.Types.GetAllowListRequest, callback?: (err: AWSError, data: Macie2.Types.GetAllowListResponse) => void): Request<Macie2.Types.GetAllowListResponse, AWSError>;
  /**
   * Retrieves the settings and status of an allow list.
   */
  getAllowList(callback?: (err: AWSError, data: Macie2.Types.GetAllowListResponse) => void): Request<Macie2.Types.GetAllowListResponse, AWSError>;
  /**
   * Retrieves the configuration settings and status of automated sensitive data discovery for an account.
   */
  getAutomatedDiscoveryConfiguration(params: Macie2.Types.GetAutomatedDiscoveryConfigurationRequest, callback?: (err: AWSError, data: Macie2.Types.GetAutomatedDiscoveryConfigurationResponse) => void): Request<Macie2.Types.GetAutomatedDiscoveryConfigurationResponse, AWSError>;
  /**
   * Retrieves the configuration settings and status of automated sensitive data discovery for an account.
   */
  getAutomatedDiscoveryConfiguration(callback?: (err: AWSError, data: Macie2.Types.GetAutomatedDiscoveryConfigurationResponse) => void): Request<Macie2.Types.GetAutomatedDiscoveryConfigurationResponse, AWSError>;
  /**
   * Retrieves (queries) aggregated statistical data about all the S3 buckets that Amazon Macie monitors and analyzes for an account.
   */
  getBucketStatistics(params: Macie2.Types.GetBucketStatisticsRequest, callback?: (err: AWSError, data: Macie2.Types.GetBucketStatisticsResponse) => void): Request<Macie2.Types.GetBucketStatisticsResponse, AWSError>;
  /**
   * Retrieves (queries) aggregated statistical data about all the S3 buckets that Amazon Macie monitors and analyzes for an account.
   */
  getBucketStatistics(callback?: (err: AWSError, data: Macie2.Types.GetBucketStatisticsResponse) => void): Request<Macie2.Types.GetBucketStatisticsResponse, AWSError>;
  /**
   * Retrieves the configuration settings for storing data classification results.
   */
  getClassificationExportConfiguration(params: Macie2.Types.GetClassificationExportConfigurationRequest, callback?: (err: AWSError, data: Macie2.Types.GetClassificationExportConfigurationResponse) => void): Request<Macie2.Types.GetClassificationExportConfigurationResponse, AWSError>;
  /**
   * Retrieves the configuration settings for storing data classification results.
   */
  getClassificationExportConfiguration(callback?: (err: AWSError, data: Macie2.Types.GetClassificationExportConfigurationResponse) => void): Request<Macie2.Types.GetClassificationExportConfigurationResponse, AWSError>;
  /**
   * Retrieves the classification scope settings for an account.
   */
  getClassificationScope(params: Macie2.Types.GetClassificationScopeRequest, callback?: (err: AWSError, data: Macie2.Types.GetClassificationScopeResponse) => void): Request<Macie2.Types.GetClassificationScopeResponse, AWSError>;
  /**
   * Retrieves the classification scope settings for an account.
   */
  getClassificationScope(callback?: (err: AWSError, data: Macie2.Types.GetClassificationScopeResponse) => void): Request<Macie2.Types.GetClassificationScopeResponse, AWSError>;
  /**
   * Retrieves the criteria and other settings for a custom data identifier.
   */
  getCustomDataIdentifier(params: Macie2.Types.GetCustomDataIdentifierRequest, callback?: (err: AWSError, data: Macie2.Types.GetCustomDataIdentifierResponse) => void): Request<Macie2.Types.GetCustomDataIdentifierResponse, AWSError>;
  /**
   * Retrieves the criteria and other settings for a custom data identifier.
   */
  getCustomDataIdentifier(callback?: (err: AWSError, data: Macie2.Types.GetCustomDataIdentifierResponse) => void): Request<Macie2.Types.GetCustomDataIdentifierResponse, AWSError>;
  /**
   * Retrieves (queries) aggregated statistical data about findings.
   */
  getFindingStatistics(params: Macie2.Types.GetFindingStatisticsRequest, callback?: (err: AWSError, data: Macie2.Types.GetFindingStatisticsResponse) => void): Request<Macie2.Types.GetFindingStatisticsResponse, AWSError>;
  /**
   * Retrieves (queries) aggregated statistical data about findings.
   */
  getFindingStatistics(callback?: (err: AWSError, data: Macie2.Types.GetFindingStatisticsResponse) => void): Request<Macie2.Types.GetFindingStatisticsResponse, AWSError>;
  /**
   * Retrieves the details of one or more findings.
   */
  getFindings(params: Macie2.Types.GetFindingsRequest, callback?: (err: AWSError, data: Macie2.Types.GetFindingsResponse) => void): Request<Macie2.Types.GetFindingsResponse, AWSError>;
  /**
   * Retrieves the details of one or more findings.
   */
  getFindings(callback?: (err: AWSError, data: Macie2.Types.GetFindingsResponse) => void): Request<Macie2.Types.GetFindingsResponse, AWSError>;
  /**
   * Retrieves the criteria and other settings for a findings filter.
   */
  getFindingsFilter(params: Macie2.Types.GetFindingsFilterRequest, callback?: (err: AWSError, data: Macie2.Types.GetFindingsFilterResponse) => void): Request<Macie2.Types.GetFindingsFilterResponse, AWSError>;
  /**
   * Retrieves the criteria and other settings for a findings filter.
   */
  getFindingsFilter(callback?: (err: AWSError, data: Macie2.Types.GetFindingsFilterResponse) => void): Request<Macie2.Types.GetFindingsFilterResponse, AWSError>;
  /**
   * Retrieves the configuration settings for publishing findings to Security Hub.
   */
  getFindingsPublicationConfiguration(params: Macie2.Types.GetFindingsPublicationConfigurationRequest, callback?: (err: AWSError, data: Macie2.Types.GetFindingsPublicationConfigurationResponse) => void): Request<Macie2.Types.GetFindingsPublicationConfigurationResponse, AWSError>;
  /**
   * Retrieves the configuration settings for publishing findings to Security Hub.
   */
  getFindingsPublicationConfiguration(callback?: (err: AWSError, data: Macie2.Types.GetFindingsPublicationConfigurationResponse) => void): Request<Macie2.Types.GetFindingsPublicationConfigurationResponse, AWSError>;
  /**
   * Retrieves the count of Amazon Macie membership invitations that were received by an account.
   */
  getInvitationsCount(params: Macie2.Types.GetInvitationsCountRequest, callback?: (err: AWSError, data: Macie2.Types.GetInvitationsCountResponse) => void): Request<Macie2.Types.GetInvitationsCountResponse, AWSError>;
  /**
   * Retrieves the count of Amazon Macie membership invitations that were received by an account.
   */
  getInvitationsCount(callback?: (err: AWSError, data: Macie2.Types.GetInvitationsCountResponse) => void): Request<Macie2.Types.GetInvitationsCountResponse, AWSError>;
  /**
   * Retrieves the status and configuration settings for an Amazon Macie account.
   */
  getMacieSession(params: Macie2.Types.GetMacieSessionRequest, callback?: (err: AWSError, data: Macie2.Types.GetMacieSessionResponse) => void): Request<Macie2.Types.GetMacieSessionResponse, AWSError>;
  /**
   * Retrieves the status and configuration settings for an Amazon Macie account.
   */
  getMacieSession(callback?: (err: AWSError, data: Macie2.Types.GetMacieSessionResponse) => void): Request<Macie2.Types.GetMacieSessionResponse, AWSError>;
  /**
   * (Deprecated) Retrieves information about the Amazon Macie administrator account for an account. This operation has been replaced by the GetAdministratorAccount operation.
   */
  getMasterAccount(params: Macie2.Types.GetMasterAccountRequest, callback?: (err: AWSError, data: Macie2.Types.GetMasterAccountResponse) => void): Request<Macie2.Types.GetMasterAccountResponse, AWSError>;
  /**
   * (Deprecated) Retrieves information about the Amazon Macie administrator account for an account. This operation has been replaced by the GetAdministratorAccount operation.
   */
  getMasterAccount(callback?: (err: AWSError, data: Macie2.Types.GetMasterAccountResponse) => void): Request<Macie2.Types.GetMasterAccountResponse, AWSError>;
  /**
   * Retrieves information about an account that's associated with an Amazon Macie administrator account.
   */
  getMember(params: Macie2.Types.GetMemberRequest, callback?: (err: AWSError, data: Macie2.Types.GetMemberResponse) => void): Request<Macie2.Types.GetMemberResponse, AWSError>;
  /**
   * Retrieves information about an account that's associated with an Amazon Macie administrator account.
   */
  getMember(callback?: (err: AWSError, data: Macie2.Types.GetMemberResponse) => void): Request<Macie2.Types.GetMemberResponse, AWSError>;
  /**
   * Retrieves (queries) sensitive data discovery statistics and the sensitivity score for an S3 bucket.
   */
  getResourceProfile(params: Macie2.Types.GetResourceProfileRequest, callback?: (err: AWSError, data: Macie2.Types.GetResourceProfileResponse) => void): Request<Macie2.Types.GetResourceProfileResponse, AWSError>;
  /**
   * Retrieves (queries) sensitive data discovery statistics and the sensitivity score for an S3 bucket.
   */
  getResourceProfile(callback?: (err: AWSError, data: Macie2.Types.GetResourceProfileResponse) => void): Request<Macie2.Types.GetResourceProfileResponse, AWSError>;
  /**
   * Retrieves the status and configuration settings for retrieving occurrences of sensitive data reported by findings.
   */
  getRevealConfiguration(params: Macie2.Types.GetRevealConfigurationRequest, callback?: (err: AWSError, data: Macie2.Types.GetRevealConfigurationResponse) => void): Request<Macie2.Types.GetRevealConfigurationResponse, AWSError>;
  /**
   * Retrieves the status and configuration settings for retrieving occurrences of sensitive data reported by findings.
   */
  getRevealConfiguration(callback?: (err: AWSError, data: Macie2.Types.GetRevealConfigurationResponse) => void): Request<Macie2.Types.GetRevealConfigurationResponse, AWSError>;
  /**
   * Retrieves occurrences of sensitive data reported by a finding.
   */
  getSensitiveDataOccurrences(params: Macie2.Types.GetSensitiveDataOccurrencesRequest, callback?: (err: AWSError, data: Macie2.Types.GetSensitiveDataOccurrencesResponse) => void): Request<Macie2.Types.GetSensitiveDataOccurrencesResponse, AWSError>;
  /**
   * Retrieves occurrences of sensitive data reported by a finding.
   */
  getSensitiveDataOccurrences(callback?: (err: AWSError, data: Macie2.Types.GetSensitiveDataOccurrencesResponse) => void): Request<Macie2.Types.GetSensitiveDataOccurrencesResponse, AWSError>;
  /**
   * Checks whether occurrences of sensitive data can be retrieved for a finding.
   */
  getSensitiveDataOccurrencesAvailability(params: Macie2.Types.GetSensitiveDataOccurrencesAvailabilityRequest, callback?: (err: AWSError, data: Macie2.Types.GetSensitiveDataOccurrencesAvailabilityResponse) => void): Request<Macie2.Types.GetSensitiveDataOccurrencesAvailabilityResponse, AWSError>;
  /**
   * Checks whether occurrences of sensitive data can be retrieved for a finding.
   */
  getSensitiveDataOccurrencesAvailability(callback?: (err: AWSError, data: Macie2.Types.GetSensitiveDataOccurrencesAvailabilityResponse) => void): Request<Macie2.Types.GetSensitiveDataOccurrencesAvailabilityResponse, AWSError>;
  /**
   *  Retrieves the settings for the sensitivity inspection template for an account.
   */
  getSensitivityInspectionTemplate(params: Macie2.Types.GetSensitivityInspectionTemplateRequest, callback?: (err: AWSError, data: Macie2.Types.GetSensitivityInspectionTemplateResponse) => void): Request<Macie2.Types.GetSensitivityInspectionTemplateResponse, AWSError>;
  /**
   *  Retrieves the settings for the sensitivity inspection template for an account.
   */
  getSensitivityInspectionTemplate(callback?: (err: AWSError, data: Macie2.Types.GetSensitivityInspectionTemplateResponse) => void): Request<Macie2.Types.GetSensitivityInspectionTemplateResponse, AWSError>;
  /**
   * Retrieves (queries) quotas and aggregated usage data for one or more accounts.
   */
  getUsageStatistics(params: Macie2.Types.GetUsageStatisticsRequest, callback?: (err: AWSError, data: Macie2.Types.GetUsageStatisticsResponse) => void): Request<Macie2.Types.GetUsageStatisticsResponse, AWSError>;
  /**
   * Retrieves (queries) quotas and aggregated usage data for one or more accounts.
   */
  getUsageStatistics(callback?: (err: AWSError, data: Macie2.Types.GetUsageStatisticsResponse) => void): Request<Macie2.Types.GetUsageStatisticsResponse, AWSError>;
  /**
   * Retrieves (queries) aggregated usage data for an account.
   */
  getUsageTotals(params: Macie2.Types.GetUsageTotalsRequest, callback?: (err: AWSError, data: Macie2.Types.GetUsageTotalsResponse) => void): Request<Macie2.Types.GetUsageTotalsResponse, AWSError>;
  /**
   * Retrieves (queries) aggregated usage data for an account.
   */
  getUsageTotals(callback?: (err: AWSError, data: Macie2.Types.GetUsageTotalsResponse) => void): Request<Macie2.Types.GetUsageTotalsResponse, AWSError>;
  /**
   * Retrieves a subset of information about all the allow lists for an account.
   */
  listAllowLists(params: Macie2.Types.ListAllowListsRequest, callback?: (err: AWSError, data: Macie2.Types.ListAllowListsResponse) => void): Request<Macie2.Types.ListAllowListsResponse, AWSError>;
  /**
   * Retrieves a subset of information about all the allow lists for an account.
   */
  listAllowLists(callback?: (err: AWSError, data: Macie2.Types.ListAllowListsResponse) => void): Request<Macie2.Types.ListAllowListsResponse, AWSError>;
  /**
   * Retrieves a subset of information about one or more classification jobs.
   */
  listClassificationJobs(params: Macie2.Types.ListClassificationJobsRequest, callback?: (err: AWSError, data: Macie2.Types.ListClassificationJobsResponse) => void): Request<Macie2.Types.ListClassificationJobsResponse, AWSError>;
  /**
   * Retrieves a subset of information about one or more classification jobs.
   */
  listClassificationJobs(callback?: (err: AWSError, data: Macie2.Types.ListClassificationJobsResponse) => void): Request<Macie2.Types.ListClassificationJobsResponse, AWSError>;
  /**
   * Retrieves a subset of information about the classification scope for an account.
   */
  listClassificationScopes(params: Macie2.Types.ListClassificationScopesRequest, callback?: (err: AWSError, data: Macie2.Types.ListClassificationScopesResponse) => void): Request<Macie2.Types.ListClassificationScopesResponse, AWSError>;
  /**
   * Retrieves a subset of information about the classification scope for an account.
   */
  listClassificationScopes(callback?: (err: AWSError, data: Macie2.Types.ListClassificationScopesResponse) => void): Request<Macie2.Types.ListClassificationScopesResponse, AWSError>;
  /**
   * Retrieves a subset of information about all the custom data identifiers for an account.
   */
  listCustomDataIdentifiers(params: Macie2.Types.ListCustomDataIdentifiersRequest, callback?: (err: AWSError, data: Macie2.Types.ListCustomDataIdentifiersResponse) => void): Request<Macie2.Types.ListCustomDataIdentifiersResponse, AWSError>;
  /**
   * Retrieves a subset of information about all the custom data identifiers for an account.
   */
  listCustomDataIdentifiers(callback?: (err: AWSError, data: Macie2.Types.ListCustomDataIdentifiersResponse) => void): Request<Macie2.Types.ListCustomDataIdentifiersResponse, AWSError>;
  /**
   * Retrieves a subset of information about one or more findings.
   */
  listFindings(params: Macie2.Types.ListFindingsRequest, callback?: (err: AWSError, data: Macie2.Types.ListFindingsResponse) => void): Request<Macie2.Types.ListFindingsResponse, AWSError>;
  /**
   * Retrieves a subset of information about one or more findings.
   */
  listFindings(callback?: (err: AWSError, data: Macie2.Types.ListFindingsResponse) => void): Request<Macie2.Types.ListFindingsResponse, AWSError>;
  /**
   * Retrieves a subset of information about all the findings filters for an account.
   */
  listFindingsFilters(params: Macie2.Types.ListFindingsFiltersRequest, callback?: (err: AWSError, data: Macie2.Types.ListFindingsFiltersResponse) => void): Request<Macie2.Types.ListFindingsFiltersResponse, AWSError>;
  /**
   * Retrieves a subset of information about all the findings filters for an account.
   */
  listFindingsFilters(callback?: (err: AWSError, data: Macie2.Types.ListFindingsFiltersResponse) => void): Request<Macie2.Types.ListFindingsFiltersResponse, AWSError>;
  /**
   * Retrieves information about the Amazon Macie membership invitations that were received by an account.
   */
  listInvitations(params: Macie2.Types.ListInvitationsRequest, callback?: (err: AWSError, data: Macie2.Types.ListInvitationsResponse) => void): Request<Macie2.Types.ListInvitationsResponse, AWSError>;
  /**
   * Retrieves information about the Amazon Macie membership invitations that were received by an account.
   */
  listInvitations(callback?: (err: AWSError, data: Macie2.Types.ListInvitationsResponse) => void): Request<Macie2.Types.ListInvitationsResponse, AWSError>;
  /**
   * Retrieves information about all the managed data identifiers that Amazon Macie currently provides.
   */
  listManagedDataIdentifiers(params: Macie2.Types.ListManagedDataIdentifiersRequest, callback?: (err: AWSError, data: Macie2.Types.ListManagedDataIdentifiersResponse) => void): Request<Macie2.Types.ListManagedDataIdentifiersResponse, AWSError>;
  /**
   * Retrieves information about all the managed data identifiers that Amazon Macie currently provides.
   */
  listManagedDataIdentifiers(callback?: (err: AWSError, data: Macie2.Types.ListManagedDataIdentifiersResponse) => void): Request<Macie2.Types.ListManagedDataIdentifiersResponse, AWSError>;
  /**
   * Retrieves information about the accounts that are associated with an Amazon Macie administrator account.
   */
  listMembers(params: Macie2.Types.ListMembersRequest, callback?: (err: AWSError, data: Macie2.Types.ListMembersResponse) => void): Request<Macie2.Types.ListMembersResponse, AWSError>;
  /**
   * Retrieves information about the accounts that are associated with an Amazon Macie administrator account.
   */
  listMembers(callback?: (err: AWSError, data: Macie2.Types.ListMembersResponse) => void): Request<Macie2.Types.ListMembersResponse, AWSError>;
  /**
   * Retrieves information about the delegated Amazon Macie administrator account for an organization in Organizations.
   */
  listOrganizationAdminAccounts(params: Macie2.Types.ListOrganizationAdminAccountsRequest, callback?: (err: AWSError, data: Macie2.Types.ListOrganizationAdminAccountsResponse) => void): Request<Macie2.Types.ListOrganizationAdminAccountsResponse, AWSError>;
  /**
   * Retrieves information about the delegated Amazon Macie administrator account for an organization in Organizations.
   */
  listOrganizationAdminAccounts(callback?: (err: AWSError, data: Macie2.Types.ListOrganizationAdminAccountsResponse) => void): Request<Macie2.Types.ListOrganizationAdminAccountsResponse, AWSError>;
  /**
   * Retrieves information about objects that were selected from an S3 bucket for automated sensitive data discovery.
   */
  listResourceProfileArtifacts(params: Macie2.Types.ListResourceProfileArtifactsRequest, callback?: (err: AWSError, data: Macie2.Types.ListResourceProfileArtifactsResponse) => void): Request<Macie2.Types.ListResourceProfileArtifactsResponse, AWSError>;
  /**
   * Retrieves information about objects that were selected from an S3 bucket for automated sensitive data discovery.
   */
  listResourceProfileArtifacts(callback?: (err: AWSError, data: Macie2.Types.ListResourceProfileArtifactsResponse) => void): Request<Macie2.Types.ListResourceProfileArtifactsResponse, AWSError>;
  /**
   * Retrieves information about the types and amount of sensitive data that Amazon Macie found in an S3 bucket.
   */
  listResourceProfileDetections(params: Macie2.Types.ListResourceProfileDetectionsRequest, callback?: (err: AWSError, data: Macie2.Types.ListResourceProfileDetectionsResponse) => void): Request<Macie2.Types.ListResourceProfileDetectionsResponse, AWSError>;
  /**
   * Retrieves information about the types and amount of sensitive data that Amazon Macie found in an S3 bucket.
   */
  listResourceProfileDetections(callback?: (err: AWSError, data: Macie2.Types.ListResourceProfileDetectionsResponse) => void): Request<Macie2.Types.ListResourceProfileDetectionsResponse, AWSError>;
  /**
   *  Retrieves a subset of information about the sensitivity inspection template for an account.
   */
  listSensitivityInspectionTemplates(params: Macie2.Types.ListSensitivityInspectionTemplatesRequest, callback?: (err: AWSError, data: Macie2.Types.ListSensitivityInspectionTemplatesResponse) => void): Request<Macie2.Types.ListSensitivityInspectionTemplatesResponse, AWSError>;
  /**
   *  Retrieves a subset of information about the sensitivity inspection template for an account.
   */
  listSensitivityInspectionTemplates(callback?: (err: AWSError, data: Macie2.Types.ListSensitivityInspectionTemplatesResponse) => void): Request<Macie2.Types.ListSensitivityInspectionTemplatesResponse, AWSError>;
  /**
   * Retrieves the tags (keys and values) that are associated with an Amazon Macie resource.
   */
  listTagsForResource(params: Macie2.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Macie2.Types.ListTagsForResourceResponse) => void): Request<Macie2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves the tags (keys and values) that are associated with an Amazon Macie resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Macie2.Types.ListTagsForResourceResponse) => void): Request<Macie2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Creates or updates the configuration settings for storing data classification results.
   */
  putClassificationExportConfiguration(params: Macie2.Types.PutClassificationExportConfigurationRequest, callback?: (err: AWSError, data: Macie2.Types.PutClassificationExportConfigurationResponse) => void): Request<Macie2.Types.PutClassificationExportConfigurationResponse, AWSError>;
  /**
   * Creates or updates the configuration settings for storing data classification results.
   */
  putClassificationExportConfiguration(callback?: (err: AWSError, data: Macie2.Types.PutClassificationExportConfigurationResponse) => void): Request<Macie2.Types.PutClassificationExportConfigurationResponse, AWSError>;
  /**
   * Updates the configuration settings for publishing findings to Security Hub.
   */
  putFindingsPublicationConfiguration(params: Macie2.Types.PutFindingsPublicationConfigurationRequest, callback?: (err: AWSError, data: Macie2.Types.PutFindingsPublicationConfigurationResponse) => void): Request<Macie2.Types.PutFindingsPublicationConfigurationResponse, AWSError>;
  /**
   * Updates the configuration settings for publishing findings to Security Hub.
   */
  putFindingsPublicationConfiguration(callback?: (err: AWSError, data: Macie2.Types.PutFindingsPublicationConfigurationResponse) => void): Request<Macie2.Types.PutFindingsPublicationConfigurationResponse, AWSError>;
  /**
   * Retrieves (queries) statistical data and other information about Amazon Web Services resources that Amazon Macie monitors and analyzes.
   */
  searchResources(params: Macie2.Types.SearchResourcesRequest, callback?: (err: AWSError, data: Macie2.Types.SearchResourcesResponse) => void): Request<Macie2.Types.SearchResourcesResponse, AWSError>;
  /**
   * Retrieves (queries) statistical data and other information about Amazon Web Services resources that Amazon Macie monitors and analyzes.
   */
  searchResources(callback?: (err: AWSError, data: Macie2.Types.SearchResourcesResponse) => void): Request<Macie2.Types.SearchResourcesResponse, AWSError>;
  /**
   * Adds or updates one or more tags (keys and values) that are associated with an Amazon Macie resource.
   */
  tagResource(params: Macie2.Types.TagResourceRequest, callback?: (err: AWSError, data: Macie2.Types.TagResourceResponse) => void): Request<Macie2.Types.TagResourceResponse, AWSError>;
  /**
   * Adds or updates one or more tags (keys and values) that are associated with an Amazon Macie resource.
   */
  tagResource(callback?: (err: AWSError, data: Macie2.Types.TagResourceResponse) => void): Request<Macie2.Types.TagResourceResponse, AWSError>;
  /**
   * Tests a custom data identifier.
   */
  testCustomDataIdentifier(params: Macie2.Types.TestCustomDataIdentifierRequest, callback?: (err: AWSError, data: Macie2.Types.TestCustomDataIdentifierResponse) => void): Request<Macie2.Types.TestCustomDataIdentifierResponse, AWSError>;
  /**
   * Tests a custom data identifier.
   */
  testCustomDataIdentifier(callback?: (err: AWSError, data: Macie2.Types.TestCustomDataIdentifierResponse) => void): Request<Macie2.Types.TestCustomDataIdentifierResponse, AWSError>;
  /**
   * Removes one or more tags (keys and values) from an Amazon Macie resource.
   */
  untagResource(params: Macie2.Types.UntagResourceRequest, callback?: (err: AWSError, data: Macie2.Types.UntagResourceResponse) => void): Request<Macie2.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags (keys and values) from an Amazon Macie resource.
   */
  untagResource(callback?: (err: AWSError, data: Macie2.Types.UntagResourceResponse) => void): Request<Macie2.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the settings for an allow list.
   */
  updateAllowList(params: Macie2.Types.UpdateAllowListRequest, callback?: (err: AWSError, data: Macie2.Types.UpdateAllowListResponse) => void): Request<Macie2.Types.UpdateAllowListResponse, AWSError>;
  /**
   * Updates the settings for an allow list.
   */
  updateAllowList(callback?: (err: AWSError, data: Macie2.Types.UpdateAllowListResponse) => void): Request<Macie2.Types.UpdateAllowListResponse, AWSError>;
  /**
   * Enables or disables automated sensitive data discovery for an account.
   */
  updateAutomatedDiscoveryConfiguration(params: Macie2.Types.UpdateAutomatedDiscoveryConfigurationRequest, callback?: (err: AWSError, data: Macie2.Types.UpdateAutomatedDiscoveryConfigurationResponse) => void): Request<Macie2.Types.UpdateAutomatedDiscoveryConfigurationResponse, AWSError>;
  /**
   * Enables or disables automated sensitive data discovery for an account.
   */
  updateAutomatedDiscoveryConfiguration(callback?: (err: AWSError, data: Macie2.Types.UpdateAutomatedDiscoveryConfigurationResponse) => void): Request<Macie2.Types.UpdateAutomatedDiscoveryConfigurationResponse, AWSError>;
  /**
   * Changes the status of a classification job.
   */
  updateClassificationJob(params: Macie2.Types.UpdateClassificationJobRequest, callback?: (err: AWSError, data: Macie2.Types.UpdateClassificationJobResponse) => void): Request<Macie2.Types.UpdateClassificationJobResponse, AWSError>;
  /**
   * Changes the status of a classification job.
   */
  updateClassificationJob(callback?: (err: AWSError, data: Macie2.Types.UpdateClassificationJobResponse) => void): Request<Macie2.Types.UpdateClassificationJobResponse, AWSError>;
  /**
   * Updates the classification scope settings for an account.
   */
  updateClassificationScope(params: Macie2.Types.UpdateClassificationScopeRequest, callback?: (err: AWSError, data: Macie2.Types.UpdateClassificationScopeResponse) => void): Request<Macie2.Types.UpdateClassificationScopeResponse, AWSError>;
  /**
   * Updates the classification scope settings for an account.
   */
  updateClassificationScope(callback?: (err: AWSError, data: Macie2.Types.UpdateClassificationScopeResponse) => void): Request<Macie2.Types.UpdateClassificationScopeResponse, AWSError>;
  /**
   * Updates the criteria and other settings for a findings filter.
   */
  updateFindingsFilter(params: Macie2.Types.UpdateFindingsFilterRequest, callback?: (err: AWSError, data: Macie2.Types.UpdateFindingsFilterResponse) => void): Request<Macie2.Types.UpdateFindingsFilterResponse, AWSError>;
  /**
   * Updates the criteria and other settings for a findings filter.
   */
  updateFindingsFilter(callback?: (err: AWSError, data: Macie2.Types.UpdateFindingsFilterResponse) => void): Request<Macie2.Types.UpdateFindingsFilterResponse, AWSError>;
  /**
   * Suspends or re-enables Amazon Macie, or updates the configuration settings for a Macie account.
   */
  updateMacieSession(params: Macie2.Types.UpdateMacieSessionRequest, callback?: (err: AWSError, data: Macie2.Types.UpdateMacieSessionResponse) => void): Request<Macie2.Types.UpdateMacieSessionResponse, AWSError>;
  /**
   * Suspends or re-enables Amazon Macie, or updates the configuration settings for a Macie account.
   */
  updateMacieSession(callback?: (err: AWSError, data: Macie2.Types.UpdateMacieSessionResponse) => void): Request<Macie2.Types.UpdateMacieSessionResponse, AWSError>;
  /**
   * Enables an Amazon Macie administrator to suspend or re-enable Macie for a member account.
   */
  updateMemberSession(params: Macie2.Types.UpdateMemberSessionRequest, callback?: (err: AWSError, data: Macie2.Types.UpdateMemberSessionResponse) => void): Request<Macie2.Types.UpdateMemberSessionResponse, AWSError>;
  /**
   * Enables an Amazon Macie administrator to suspend or re-enable Macie for a member account.
   */
  updateMemberSession(callback?: (err: AWSError, data: Macie2.Types.UpdateMemberSessionResponse) => void): Request<Macie2.Types.UpdateMemberSessionResponse, AWSError>;
  /**
   * Updates the Amazon Macie configuration settings for an organization in Organizations.
   */
  updateOrganizationConfiguration(params: Macie2.Types.UpdateOrganizationConfigurationRequest, callback?: (err: AWSError, data: Macie2.Types.UpdateOrganizationConfigurationResponse) => void): Request<Macie2.Types.UpdateOrganizationConfigurationResponse, AWSError>;
  /**
   * Updates the Amazon Macie configuration settings for an organization in Organizations.
   */
  updateOrganizationConfiguration(callback?: (err: AWSError, data: Macie2.Types.UpdateOrganizationConfigurationResponse) => void): Request<Macie2.Types.UpdateOrganizationConfigurationResponse, AWSError>;
  /**
   * Updates the sensitivity score for an S3 bucket.
   */
  updateResourceProfile(params: Macie2.Types.UpdateResourceProfileRequest, callback?: (err: AWSError, data: Macie2.Types.UpdateResourceProfileResponse) => void): Request<Macie2.Types.UpdateResourceProfileResponse, AWSError>;
  /**
   * Updates the sensitivity score for an S3 bucket.
   */
  updateResourceProfile(callback?: (err: AWSError, data: Macie2.Types.UpdateResourceProfileResponse) => void): Request<Macie2.Types.UpdateResourceProfileResponse, AWSError>;
  /**
   * Updates the sensitivity scoring settings for an S3 bucket.
   */
  updateResourceProfileDetections(params: Macie2.Types.UpdateResourceProfileDetectionsRequest, callback?: (err: AWSError, data: Macie2.Types.UpdateResourceProfileDetectionsResponse) => void): Request<Macie2.Types.UpdateResourceProfileDetectionsResponse, AWSError>;
  /**
   * Updates the sensitivity scoring settings for an S3 bucket.
   */
  updateResourceProfileDetections(callback?: (err: AWSError, data: Macie2.Types.UpdateResourceProfileDetectionsResponse) => void): Request<Macie2.Types.UpdateResourceProfileDetectionsResponse, AWSError>;
  /**
   * Updates the status and configuration settings for retrieving occurrences of sensitive data reported by findings.
   */
  updateRevealConfiguration(params: Macie2.Types.UpdateRevealConfigurationRequest, callback?: (err: AWSError, data: Macie2.Types.UpdateRevealConfigurationResponse) => void): Request<Macie2.Types.UpdateRevealConfigurationResponse, AWSError>;
  /**
   * Updates the status and configuration settings for retrieving occurrences of sensitive data reported by findings.
   */
  updateRevealConfiguration(callback?: (err: AWSError, data: Macie2.Types.UpdateRevealConfigurationResponse) => void): Request<Macie2.Types.UpdateRevealConfigurationResponse, AWSError>;
  /**
   *  Updates the settings for the sensitivity inspection template for an account.
   */
  updateSensitivityInspectionTemplate(params: Macie2.Types.UpdateSensitivityInspectionTemplateRequest, callback?: (err: AWSError, data: Macie2.Types.UpdateSensitivityInspectionTemplateResponse) => void): Request<Macie2.Types.UpdateSensitivityInspectionTemplateResponse, AWSError>;
  /**
   *  Updates the settings for the sensitivity inspection template for an account.
   */
  updateSensitivityInspectionTemplate(callback?: (err: AWSError, data: Macie2.Types.UpdateSensitivityInspectionTemplateResponse) => void): Request<Macie2.Types.UpdateSensitivityInspectionTemplateResponse, AWSError>;
  /**
   * Waits for the findingRevealed state by periodically calling the underlying Macie2.getSensitiveDataOccurrencesoperation every 2 seconds (at most 60 times). Wait until the sensitive data occurrences are ready.
   */
  waitFor(state: "findingRevealed", params: Macie2.Types.GetSensitiveDataOccurrencesRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Macie2.Types.GetSensitiveDataOccurrencesResponse) => void): Request<Macie2.Types.GetSensitiveDataOccurrencesResponse, AWSError>;
  /**
   * Waits for the findingRevealed state by periodically calling the underlying Macie2.getSensitiveDataOccurrencesoperation every 2 seconds (at most 60 times). Wait until the sensitive data occurrences are ready.
   */
  waitFor(state: "findingRevealed", callback?: (err: AWSError, data: Macie2.Types.GetSensitiveDataOccurrencesResponse) => void): Request<Macie2.Types.GetSensitiveDataOccurrencesResponse, AWSError>;
}
declare namespace Macie2 {
  export interface AcceptInvitationRequest {
    /**
     * The Amazon Web Services account ID for the account that sent the invitation.
     */
    administratorAccountId?: __string;
    /**
     * The unique identifier for the invitation to accept.
     */
    invitationId: __string;
    /**
     * (Deprecated) The Amazon Web Services account ID for the account that sent the invitation. This property has been replaced by the administratorAccountId property and is retained only for backward compatibility.
     */
    masterAccount?: __string;
  }
  export interface AcceptInvitationResponse {
  }
  export interface AccessControlList {
    /**
     * Specifies whether the ACL grants the general public with read access permissions for the bucket.
     */
    allowsPublicReadAccess?: __boolean;
    /**
     * Specifies whether the ACL grants the general public with write access permissions for the bucket.
     */
    allowsPublicWriteAccess?: __boolean;
  }
  export interface AccountDetail {
    /**
     * The Amazon Web Services account ID for the account.
     */
    accountId: __string;
    /**
     * The email address for the account.
     */
    email: __string;
  }
  export interface AccountLevelPermissions {
    /**
     * The block public access settings for the Amazon Web Services account that owns the bucket.
     */
    blockPublicAccess?: BlockPublicAccess;
  }
  export interface AdminAccount {
    /**
     * The Amazon Web Services account ID for the account.
     */
    accountId?: __string;
    /**
     * The current status of the account as the delegated Amazon Macie administrator account for the organization.
     */
    status?: AdminStatus;
  }
  export type AdminStatus = "ENABLED"|"DISABLING_IN_PROGRESS"|string;
  export interface AllowListCriteria {
    /**
     * The regular expression (regex) that defines the text pattern to ignore. The expression can contain as many as 512 characters.
     */
    regex?: __stringMin1Max512PatternSS;
    /**
     * The location and name of the S3 object that lists specific text to ignore.
     */
    s3WordsList?: S3WordsList;
  }
  export interface AllowListStatus {
    /**
     * The current status of the allow list. If the list's criteria specify a regular expression (regex), this value is typically OK. Amazon Macie can compile the expression. If the list's criteria specify an S3 object, possible values are: OK - Macie can retrieve and parse the contents of the object. S3_OBJECT_ACCESS_DENIED - Macie isn't allowed to access the object or the object is encrypted with a customer managed KMS key that Macie isn't allowed to use. Check the bucket policy and other permissions settings for the bucket and the object. If the object is encrypted, also ensure that it's encrypted with a key that Macie is allowed to use. S3_OBJECT_EMPTY - Macie can retrieve the object but the object doesn't contain any content. Ensure that the object contains the correct entries. Also ensure that the list's criteria specify the correct bucket and object names. S3_OBJECT_NOT_FOUND - The object doesn't exist in Amazon S3. Ensure that the list's criteria specify the correct bucket and object names. S3_OBJECT_OVERSIZE - Macie can retrieve the object. However, the object contains too many entries or its storage size exceeds the quota for an allow list. Try breaking the list into multiple files and ensure that each file doesn't exceed any quotas. Then configure list settings in Macie for each file. S3_THROTTLED - Amazon S3 throttled the request to retrieve the object. Wait a few minutes and then try again. S3_USER_ACCESS_DENIED - Amazon S3 denied the request to retrieve the object. If the specified object exists, you're not allowed to access it or it's encrypted with an KMS key that you're not allowed to use. Work with your Amazon Web Services administrator to ensure that the list's criteria specify the correct bucket and object names, and you have read access to the bucket and the object. If the object is encrypted, also ensure that it's encrypted with a key that you're allowed to use. UNKNOWN_ERROR - A transient or internal error occurred when Macie attempted to retrieve or parse the object. Wait a few minutes and then try again. A list can also have this status if it's encrypted with a key that Amazon S3 and Macie can't access or use.
     */
    code: AllowListStatusCode;
    /**
     * A brief description of the status of the allow list. Amazon Macie uses this value to provide additional information about an error that occurred when Macie tried to access and use the list's criteria.
     */
    description?: __stringMin1Max1024PatternSS;
  }
  export type AllowListStatusCode = "OK"|"S3_OBJECT_NOT_FOUND"|"S3_USER_ACCESS_DENIED"|"S3_OBJECT_ACCESS_DENIED"|"S3_THROTTLED"|"S3_OBJECT_OVERSIZE"|"S3_OBJECT_EMPTY"|"UNKNOWN_ERROR"|string;
  export interface AllowListSummary {
    /**
     * The Amazon Resource Name (ARN) of the allow list.
     */
    arn?: __stringMin71Max89PatternArnAwsAwsCnAwsUsGovMacie2AZ19920D12AllowListAZ0922;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the allow list was created in Amazon Macie.
     */
    createdAt?: __timestampIso8601;
    /**
     * The custom description of the allow list.
     */
    description?: __stringMin1Max512PatternSS;
    /**
     * The unique identifier for the allow list.
     */
    id?: __stringMin22Max22PatternAZ0922;
    /**
     * The custom name of the allow list.
     */
    name?: __stringMin1Max128Pattern;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the allow list's settings were most recently changed in Amazon Macie.
     */
    updatedAt?: __timestampIso8601;
  }
  export type AllowsUnencryptedObjectUploads = "TRUE"|"FALSE"|"UNKNOWN"|string;
  export interface ApiCallDetails {
    /**
     * The name of the operation that was invoked most recently and produced the finding.
     */
    api?: __string;
    /**
     * The URL of the Amazon Web Service that provides the operation, for example: s3.amazonaws.com.
     */
    apiServiceName?: __string;
    /**
     * The first date and time, in UTC and extended ISO 8601 format, when any operation was invoked and produced the finding.
     */
    firstSeen?: __timestampIso8601;
    /**
     * The most recent date and time, in UTC and extended ISO 8601 format, when the specified operation (api) was invoked and produced the finding.
     */
    lastSeen?: __timestampIso8601;
  }
  export interface AssumedRole {
    /**
     * The Amazon Web Services access key ID that identifies the credentials.
     */
    accessKeyId?: __string;
    /**
     * The unique identifier for the Amazon Web Services account that owns the entity that was used to get the credentials.
     */
    accountId?: __string;
    /**
     * The Amazon Resource Name (ARN) of the entity that was used to get the credentials.
     */
    arn?: __string;
    /**
     * The unique identifier for the entity that was used to get the credentials.
     */
    principalId?: __string;
    /**
     * The details of the session that was created for the credentials, including the entity that issued the session.
     */
    sessionContext?: SessionContext;
  }
  export type AutomatedDiscoveryStatus = "ENABLED"|"DISABLED"|string;
  export type AvailabilityCode = "AVAILABLE"|"UNAVAILABLE"|string;
  export interface AwsAccount {
    /**
     * The unique identifier for the Amazon Web Services account.
     */
    accountId?: __string;
    /**
     * The unique identifier for the entity that performed the action.
     */
    principalId?: __string;
  }
  export interface AwsService {
    /**
     * The name of the Amazon Web Service that performed the action.
     */
    invokedBy?: __string;
  }
  export interface BatchGetCustomDataIdentifierSummary {
    /**
     * The Amazon Resource Name (ARN) of the custom data identifier.
     */
    arn?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the custom data identifier was created.
     */
    createdAt?: __timestampIso8601;
    /**
     * Specifies whether the custom data identifier was deleted. If you delete a custom data identifier, Amazon Macie doesn't delete it permanently. Instead, it soft deletes the identifier.
     */
    deleted?: __boolean;
    /**
     * The custom description of the custom data identifier.
     */
    description?: __string;
    /**
     * The unique identifier for the custom data identifier.
     */
    id?: __string;
    /**
     * The custom name of the custom data identifier.
     */
    name?: __string;
  }
  export interface BatchGetCustomDataIdentifiersRequest {
    /**
     * An array of custom data identifier IDs, one for each custom data identifier to retrieve information about.
     */
    ids?: __listOf__string;
  }
  export interface BatchGetCustomDataIdentifiersResponse {
    /**
     * An array of objects, one for each custom data identifier that matches the criteria specified in the request.
     */
    customDataIdentifiers?: __listOfBatchGetCustomDataIdentifierSummary;
    /**
     * An array of custom data identifier IDs, one for each custom data identifier that was specified in the request but doesn't correlate to an existing custom data identifier.
     */
    notFoundIdentifierIds?: __listOf__string;
  }
  export interface BlockPublicAccess {
    /**
     * Specifies whether Amazon S3 blocks public access control lists (ACLs) for the bucket and objects in the bucket.
     */
    blockPublicAcls?: __boolean;
    /**
     * Specifies whether Amazon S3 blocks public bucket policies for the bucket.
     */
    blockPublicPolicy?: __boolean;
    /**
     * Specifies whether Amazon S3 ignores public ACLs for the bucket and objects in the bucket.
     */
    ignorePublicAcls?: __boolean;
    /**
     * Specifies whether Amazon S3 restricts public bucket policies for the bucket.
     */
    restrictPublicBuckets?: __boolean;
  }
  export interface BucketCountByEffectivePermission {
    /**
     * The total number of buckets that allow the general public to have read or write access to the bucket.
     */
    publiclyAccessible?: __long;
    /**
     * The total number of buckets that allow the general public to have read access to the bucket.
     */
    publiclyReadable?: __long;
    /**
     * The total number of buckets that allow the general public to have write access to the bucket.
     */
    publiclyWritable?: __long;
    /**
     * The total number of buckets that Amazon Macie wasn't able to evaluate permissions settings for. Macie can't determine whether these buckets are publicly accessible.
     */
    unknown?: __long;
  }
  export interface BucketCountByEncryptionType {
    /**
     *  The total number of buckets whose default encryption settings are configured to encrypt new objects with an Amazon Web Services managed KMS key or a customer managed KMS key. By default, these buckets encrypt new objects automatically using SSE-KMS encryption.
     */
    kmsManaged?: __long;
    /**
     * The total number of buckets whose default encryption settings are configured to encrypt new objects with an Amazon S3 managed key. By default, these buckets encrypt new objects automatically using SSE-S3 encryption.
     */
    s3Managed?: __long;
    /**
     * The total number of buckets that don't specify default server-side encryption behavior for new objects. Default encryption settings aren't configured for these buckets.
     */
    unencrypted?: __long;
    /**
     * The total number of buckets that Amazon Macie doesn't have current encryption metadata for. Macie can't provide current data about the default encryption settings for these buckets.
     */
    unknown?: __long;
  }
  export interface BucketCountBySharedAccessType {
    /**
     * The total number of buckets that are shared with one or more of the following or any combination of the following: an Amazon CloudFront OAI, a CloudFront OAC, or an Amazon Web Services account that isn't in the same Amazon Macie organization.
     */
    external?: __long;
    /**
     * The total number of buckets that are shared with one or more Amazon Web Services accounts in the same Amazon Macie organization. These buckets aren't shared with Amazon CloudFront OAIs or OACs.
     */
    internal?: __long;
    /**
     * The total number of buckets that aren't shared with other Amazon Web Services accounts, Amazon CloudFront OAIs, or CloudFront OACs.
     */
    notShared?: __long;
    /**
     * The total number of buckets that Amazon Macie wasn't able to evaluate shared access settings for. Macie can't determine whether these buckets are shared with other Amazon Web Services accounts, Amazon CloudFront OAIs, or CloudFront OACs.
     */
    unknown?: __long;
  }
  export interface BucketCountPolicyAllowsUnencryptedObjectUploads {
    /**
     * The total number of buckets that don't have a bucket policy or have a bucket policy that doesn't require server-side encryption of new objects. If a bucket policy exists, the policy doesn't require PutObject requests to include a valid server-side encryption header: the x-amz-server-side-encryption header with a value of AES256 or aws:kms, or the x-amz-server-side-encryption-customer-algorithm header with a value of AES256.
     */
    allowsUnencryptedObjectUploads?: __long;
    /**
     * The total number of buckets whose bucket policies require server-side encryption of new objects. PutObject requests for these buckets must include a valid server-side encryption header: the x-amz-server-side-encryption header with a value of AES256 or aws:kms, or the x-amz-server-side-encryption-customer-algorithm header with a value of AES256.
     */
    deniesUnencryptedObjectUploads?: __long;
    /**
     * The total number of buckets that Amazon Macie wasn't able to evaluate server-side encryption requirements for. Macie can't determine whether the bucket policies for these buckets require server-side encryption of new objects.
     */
    unknown?: __long;
  }
  export type BucketCriteria = {[key: string]: BucketCriteriaAdditionalProperties};
  export interface BucketCriteriaAdditionalProperties {
    /**
     * The value for the property matches (equals) the specified value. If you specify multiple values, Amazon Macie uses OR logic to join the values.
     */
    eq?: __listOf__string;
    /**
     * The value for the property is greater than the specified value.
     */
    gt?: __long;
    /**
     * The value for the property is greater than or equal to the specified value.
     */
    gte?: __long;
    /**
     * The value for the property is less than the specified value.
     */
    lt?: __long;
    /**
     * The value for the property is less than or equal to the specified value.
     */
    lte?: __long;
    /**
     * The value for the property doesn't match (doesn't equal) the specified value. If you specify multiple values, Amazon Macie uses OR logic to join the values.
     */
    neq?: __listOf__string;
    /**
     * The name of the bucket begins with the specified value.
     */
    prefix?: __string;
  }
  export interface BucketLevelPermissions {
    /**
     * The permissions settings of the access control list (ACL) for the bucket. This value is null if an ACL hasn't been defined for the bucket.
     */
    accessControlList?: AccessControlList;
    /**
     * The block public access settings for the bucket.
     */
    blockPublicAccess?: BlockPublicAccess;
    /**
     * The permissions settings of the bucket policy for the bucket. This value is null if a bucket policy hasn't been defined for the bucket.
     */
    bucketPolicy?: BucketPolicy;
  }
  export interface BucketMetadata {
    /**
     * The unique identifier for the Amazon Web Services account that owns the bucket.
     */
    accountId?: __string;
    /**
     * Specifies whether the bucket policy for the bucket requires server-side encryption of objects when objects are added to the bucket. Possible values are: FALSE - The bucket policy requires server-side encryption of new objects. PutObject requests must include a valid server-side encryption header. TRUE - The bucket doesn't have a bucket policy or it has a bucket policy that doesn't require server-side encryption of new objects. If a bucket policy exists, it doesn't require PutObject requests to include a valid server-side encryption header. UNKNOWN - Amazon Macie can't determine whether the bucket policy requires server-side encryption of new objects. Valid server-side encryption headers are: x-amz-server-side-encryption with a value of AES256 or aws:kms, and x-amz-server-side-encryption-customer-algorithm with a value of AES256.
     */
    allowsUnencryptedObjectUploads?: AllowsUnencryptedObjectUploads;
    /**
     * The Amazon Resource Name (ARN) of the bucket.
     */
    bucketArn?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the bucket was created. This value can also indicate when changes such as edits to the bucket's policy were most recently made to the bucket.
     */
    bucketCreatedAt?: __timestampIso8601;
    /**
     * The name of the bucket.
     */
    bucketName?: __string;
    /**
     * The total number of objects that Amazon Macie can analyze in the bucket. These objects use a supported storage class and have a file name extension for a supported file or storage format.
     */
    classifiableObjectCount?: __long;
    /**
     * The total storage size, in bytes, of the objects that Amazon Macie can analyze in the bucket. These objects use a supported storage class and have a file name extension for a supported file or storage format. If versioning is enabled for the bucket, Macie calculates this value based on the size of the latest version of each applicable object in the bucket. This value doesn't reflect the storage size of all versions of each applicable object in the bucket.
     */
    classifiableSizeInBytes?: __long;
    /**
     * The error code for an error that prevented Amazon Macie from retrieving and processing information about the bucket and the bucket's objects. If this value is ACCESS_DENIED, Macie doesn't have permission to retrieve the information. For example, the bucket has a restrictive bucket policy and Amazon S3 denied the request. If this value is null, Macie was able to retrieve and process the information.
     */
    errorCode?: BucketMetadataErrorCode;
    /**
     * A brief description of the error (errorCode) that prevented Amazon Macie from retrieving and processing information about the bucket and the bucket's objects. This value is null if Macie was able to retrieve and process the information.
     */
    errorMessage?: __string;
    /**
     * Specifies whether any one-time or recurring classification jobs are configured to analyze data in the bucket, and, if so, the details of the job that ran most recently.
     */
    jobDetails?: JobDetails;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when Amazon Macie most recently analyzed data in the bucket while performing automated sensitive data discovery for your account. This value is null if automated sensitive data discovery is currently disabled for your account.
     */
    lastAutomatedDiscoveryTime?: __timestampIso8601;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when Amazon Macie most recently retrieved bucket or object metadata from Amazon S3 for the bucket.
     */
    lastUpdated?: __timestampIso8601;
    /**
     * The total number of objects in the bucket.
     */
    objectCount?: __long;
    /**
     * The total number of objects in the bucket, grouped by server-side encryption type. This includes a grouping that reports the total number of objects that aren't encrypted or use client-side encryption.
     */
    objectCountByEncryptionType?: ObjectCountByEncryptionType;
    /**
     * Specifies whether the bucket is publicly accessible due to the combination of permissions settings that apply to the bucket, and provides information about those settings.
     */
    publicAccess?: BucketPublicAccess;
    /**
     * The Amazon Web Services Region that hosts the bucket.
     */
    region?: __string;
    /**
     * Specifies whether the bucket is configured to replicate one or more objects to buckets for other Amazon Web Services accounts and, if so, which accounts.
     */
    replicationDetails?: ReplicationDetails;
    /**
     * The sensitivity score for the bucket, ranging from -1 (classification error) to 100 (sensitive). This value is null if automated sensitive data discovery is currently disabled for your account.
     */
    sensitivityScore?: __integer;
    /**
     * The default server-side encryption settings for the bucket.
     */
    serverSideEncryption?: BucketServerSideEncryption;
    /**
     * Specifies whether the bucket is shared with another Amazon Web Services account, an Amazon CloudFront origin access identity (OAI), or a CloudFront origin access control (OAC). Possible values are: EXTERNAL - The bucket is shared with one or more of the following or any combination of the following: a CloudFront OAI, a CloudFront OAC, or an Amazon Web Services account that isn't part of your Amazon Macie organization. INTERNAL - The bucket is shared with one or more Amazon Web Services accounts that are part of your Amazon Macie organization. It isn't shared with a CloudFront OAI or OAC. NOT_SHARED - The bucket isn't shared with another Amazon Web Services account, a CloudFront OAI, or a CloudFront OAC. UNKNOWN - Amazon Macie wasn't able to evaluate the shared access settings for the bucket. An Amazon Macie organization is a set of Macie accounts that are centrally managed as a group of related accounts through Organizations or by Macie invitation.
     */
    sharedAccess?: SharedAccess;
    /**
     * The total storage size, in bytes, of the bucket. If versioning is enabled for the bucket, Amazon Macie calculates this value based on the size of the latest version of each object in the bucket. This value doesn't reflect the storage size of all versions of each object in the bucket.
     */
    sizeInBytes?: __long;
    /**
     * The total storage size, in bytes, of the objects that are compressed (.gz, .gzip, .zip) files in the bucket. If versioning is enabled for the bucket, Amazon Macie calculates this value based on the size of the latest version of each applicable object in the bucket. This value doesn't reflect the storage size of all versions of each applicable object in the bucket.
     */
    sizeInBytesCompressed?: __long;
    /**
     * An array that specifies the tags (keys and values) that are associated with the bucket.
     */
    tags?: __listOfKeyValuePair;
    /**
     * The total number of objects that Amazon Macie can't analyze in the bucket. These objects don't use a supported storage class or don't have a file name extension for a supported file or storage format.
     */
    unclassifiableObjectCount?: ObjectLevelStatistics;
    /**
     * The total storage size, in bytes, of the objects that Amazon Macie can't analyze in the bucket. These objects don't use a supported storage class or don't have a file name extension for a supported file or storage format.
     */
    unclassifiableObjectSizeInBytes?: ObjectLevelStatistics;
    /**
     * Specifies whether versioning is enabled for the bucket.
     */
    versioning?: __boolean;
  }
  export type BucketMetadataErrorCode = "ACCESS_DENIED"|string;
  export interface BucketPermissionConfiguration {
    /**
     * The account-level permissions settings that apply to the bucket.
     */
    accountLevelPermissions?: AccountLevelPermissions;
    /**
     * The bucket-level permissions settings for the bucket.
     */
    bucketLevelPermissions?: BucketLevelPermissions;
  }
  export interface BucketPolicy {
    /**
     * Specifies whether the bucket policy allows the general public to have read access to the bucket.
     */
    allowsPublicReadAccess?: __boolean;
    /**
     * Specifies whether the bucket policy allows the general public to have write access to the bucket.
     */
    allowsPublicWriteAccess?: __boolean;
  }
  export interface BucketPublicAccess {
    /**
     *  Specifies whether the bucket is publicly accessible due to the combination of permissions settings that apply to the bucket. Possible values are: NOT_PUBLIC - The bucket isn't publicly accessible. PUBLIC - The bucket is publicly accessible. UNKNOWN - Amazon Macie can't determine whether the bucket is publicly accessible.
     */
    effectivePermission?: EffectivePermission;
    /**
     * The account-level and bucket-level permissions settings for the bucket.
     */
    permissionConfiguration?: BucketPermissionConfiguration;
  }
  export interface BucketServerSideEncryption {
    /**
     * The Amazon Resource Name (ARN) or unique identifier (key ID) for the KMS key that's used by default to encrypt objects that are added to the bucket. This value is null if the bucket is configured to use an Amazon S3 managed key to encrypt new objects.
     */
    kmsMasterKeyId?: __string;
    /**
     * The server-side encryption algorithm that's used by default to encrypt objects that are added to the bucket. Possible values are: AES256 - New objects are encrypted with an Amazon S3 managed key. They use SSE-S3 encryption. aws:kms - New objects are encrypted with an KMS key (kmsMasterKeyId), either an Amazon Web Services managed key or a customer managed key. They use SSE-KMS encryption. NONE - The bucket's default encryption settings don't specify server-side encryption behavior for new objects.
     */
    type?: Type;
  }
  export interface BucketSortCriteria {
    /**
     * The name of the bucket property to sort the results by. This value can be one of the following properties that Amazon Macie defines as bucket metadata: accountId, bucketName, classifiableObjectCount, classifiableSizeInBytes, objectCount, sensitivityScore, or sizeInBytes.
     */
    attributeName?: __string;
    /**
     * The sort order to apply to the results, based on the value specified by the attributeName property. Valid values are: ASC, sort the results in ascending order; and, DESC, sort the results in descending order.
     */
    orderBy?: OrderBy;
  }
  export interface BucketStatisticsBySensitivity {
    /**
     * The aggregated statistical data for all buckets that have a sensitivity score of -1.
     */
    classificationError?: SensitivityAggregations;
    /**
     * The aggregated statistical data for all buckets that have a sensitivity score of 50.
     */
    notClassified?: SensitivityAggregations;
    /**
     * The aggregated statistical data for all buckets that have a sensitivity score of 1-49.
     */
    notSensitive?: SensitivityAggregations;
    /**
     * The aggregated statistical data for all buckets that have a sensitivity score of 51-100.
     */
    sensitive?: SensitivityAggregations;
  }
  export interface Cell {
    /**
     * The location of the cell, as an absolute cell reference, that contains the sensitive data, for example Sheet2!C5 for cell C5 on Sheet2 in a Microsoft Excel workbook. This value is null for CSV and TSV files.
     */
    cellReference?: __string;
    /**
     * The column number of the column that contains the sensitive data. For a Microsoft Excel workbook, this value correlates to the alphabetical character(s) for a column identifier, for example: 1 for column A, 2 for column B, and so on.
     */
    column?: __long;
    /**
     * The name of the column that contains the sensitive data, if available.
     */
    columnName?: __string;
    /**
     * The row number of the row that contains the sensitive data.
     */
    row?: __long;
  }
  export type Cells = Cell[];
  export interface ClassificationDetails {
    /**
     * The path to the folder or file in Amazon S3 that contains the corresponding sensitive data discovery result for the finding. If a finding applies to a large archive or compressed file, this value is the path to a folder. Otherwise, this value is the path to a file.
     */
    detailedResultsLocation?: __string;
    /**
     * The Amazon Resource Name (ARN) of the classification job that produced the finding. This value is null if the origin of the finding (originType) is AUTOMATED_SENSITIVE_DATA_DISCOVERY.
     */
    jobArn?: __string;
    /**
     * The unique identifier for the classification job that produced the finding. This value is null if the origin of the finding (originType) is AUTOMATED_SENSITIVE_DATA_DISCOVERY.
     */
    jobId?: __string;
    /**
     * Specifies how Amazon Macie found the sensitive data that produced the finding. Possible values are: SENSITIVE_DATA_DISCOVERY_JOB, for a classification job; and, AUTOMATED_SENSITIVE_DATA_DISCOVERY, for automated sensitive data discovery.
     */
    originType?: OriginType;
    /**
     * The status and other details of the finding.
     */
    result?: ClassificationResult;
  }
  export interface ClassificationExportConfiguration {
    /**
     * The S3 bucket to store data classification results in, and the encryption settings to use when storing results in that bucket.
     */
    s3Destination?: S3Destination;
  }
  export interface ClassificationResult {
    /**
     * Specifies whether Amazon Macie detected additional occurrences of sensitive data in the S3 object. A finding includes location data for a maximum of 15 occurrences of sensitive data. This value can help you determine whether to investigate additional occurrences of sensitive data in an object. You can do this by referring to the corresponding sensitive data discovery result for the finding (classificationDetails.detailedResultsLocation).
     */
    additionalOccurrences?: __boolean;
    /**
     * The custom data identifiers that detected the sensitive data and the number of occurrences of the data that they detected.
     */
    customDataIdentifiers?: CustomDataIdentifiers;
    /**
     * The type of content, as a MIME type, that the finding applies to. For example, application/gzip, for a GNU Gzip compressed archive file, or application/pdf, for an Adobe Portable Document Format file.
     */
    mimeType?: __string;
    /**
     * The category, types, and number of occurrences of the sensitive data that produced the finding.
     */
    sensitiveData?: SensitiveData;
    /**
     * The total size, in bytes, of the data that the finding applies to.
     */
    sizeClassified?: __long;
    /**
     * The status of the finding.
     */
    status?: ClassificationResultStatus;
  }
  export interface ClassificationResultStatus {
    /**
     *  The status of the finding. Possible values are: COMPLETE - Amazon Macie successfully completed its analysis of the S3 object that the finding applies to. PARTIAL - Macie analyzed only a subset of the data in the S3 object that the finding applies to. For example, the object is an archive file that contains files in an unsupported format. SKIPPED - Macie wasn't able to analyze the S3 object that the finding applies to. For example, the object is a file that uses an unsupported format.
     */
    code?: __string;
    /**
     * A brief description of the status of the finding. This value is null if the status (code) of the finding is COMPLETE. Amazon Macie uses this value to notify you of any errors, warnings, or considerations that might impact your analysis of the finding and the affected S3 object. Possible values are: ARCHIVE_CONTAINS_UNPROCESSED_FILES - The object is an archive file and Macie extracted and analyzed only some or none of the files in the archive. To determine which files Macie analyzed, if any, refer to the corresponding sensitive data discovery result for the finding (classificationDetails.detailedResultsLocation). ARCHIVE_EXCEEDS_SIZE_LIMIT - The object is an archive file whose total storage size exceeds the size quota for this type of archive. ARCHIVE_NESTING_LEVEL_OVER_LIMIT - The object is an archive file whose nested depth exceeds the quota for the maximum number of nested levels that Macie analyzes for this type of archive. ARCHIVE_TOTAL_BYTES_EXTRACTED_OVER_LIMIT - The object is an archive file that exceeds the quota for the maximum amount of data that Macie extracts and analyzes for this type of archive. ARCHIVE_TOTAL_DOCUMENTS_PROCESSED_OVER_LIMIT - The object is an archive file that contains more than the maximum number of files that Macie extracts and analyzes for this type of archive. FILE_EXCEEDS_SIZE_LIMIT - The storage size of the object exceeds the size quota for this type of file. INVALID_ENCRYPTION - The object is encrypted using server-side encryption but Macie isn't allowed to use the key. Macie can't decrypt and analyze the object. INVALID_KMS_KEY - The object is encrypted with an KMS key that was disabled or is being deleted. Macie can't decrypt and analyze the object. INVALID_OBJECT_STATE - The object doesn't use a supported Amazon S3 storage class. JSON_NESTING_LEVEL_OVER_LIMIT - The object contains JSON data and the nested depth of the data exceeds the quota for the number of nested levels that Macie analyzes for this type of file. MALFORMED_FILE - The object is a malformed or corrupted file. An error occurred when Macie attempted to detect the file's type or extract data from the file. MALFORMED_OR_FILE_SIZE_EXCEEDS_LIMIT - The object is a Microsoft Office file that is malformed or exceeds the size quota for this type of file. If the file is malformed, an error occurred when Macie attempted to extract data from the file. NO_SUCH_BUCKET_AVAILABLE - The object was in a bucket that was deleted shortly before or when Macie attempted to analyze the object. OBJECT_VERSION_MISMATCH - The object was changed while Macie was analyzing it. OOXML_UNCOMPRESSED_RATIO_EXCEEDS_LIMIT - The object is an Office Open XML file whose compression ratio exceeds the compression quota for this type of file. OOXML_UNCOMPRESSED_SIZE_EXCEEDS_LIMIT - The object is an Office Open XML file that exceeds the size quota for this type of file. PERMISSION_DENIED - Macie isn't allowed to access the object. The object's permissions settings prevent Macie from analyzing the object. SOURCE_OBJECT_NO_LONGER_AVAILABLE - The object was deleted shortly before or when Macie attempted to analyze it. TIME_CUT_OFF_REACHED - Macie started analyzing the object but additional analysis would exceed the time quota for analyzing an object. UNABLE_TO_PARSE_FILE - The object is a file that contains structured data and an error occurred when Macie attempted to parse the data. UNSUPPORTED_FILE_TYPE_EXCEPTION - The object is a file that uses an unsupported file or storage format. For information about quotas, supported storage classes, and supported file and storage formats, see Quotas and Supported storage classes and formats in the Amazon Macie User Guide.
     */
    reason?: __string;
  }
  export type ClassificationScopeId = string;
  export type ClassificationScopeName = string;
  export interface ClassificationScopeSummary {
    /**
     * The unique identifier for the classification scope.
     */
    id?: ClassificationScopeId;
    /**
     * The name of the classification scope: automated-sensitive-data-discovery.
     */
    name?: ClassificationScopeName;
  }
  export type ClassificationScopeUpdateOperation = "ADD"|"REPLACE"|"REMOVE"|string;
  export interface CreateAllowListRequest {
    /**
     * A unique, case-sensitive token that you provide to ensure the idempotency of the request.
     */
    clientToken: __string;
    /**
     * The criteria that specify the text or text pattern to ignore. The criteria can be the location and name of an S3 object that lists specific text to ignore (s3WordsList), or a regular expression (regex) that defines a text pattern to ignore.
     */
    criteria: AllowListCriteria;
    /**
     * A custom description of the allow list. The description can contain as many as 512 characters.
     */
    description?: __stringMin1Max512PatternSS;
    /**
     * A custom name for the allow list. The name can contain as many as 128 characters.
     */
    name: __stringMin1Max128Pattern;
    /**
     * A map of key-value pairs that specifies the tags to associate with the allow list. An allow list can have a maximum of 50 tags. Each tag consists of a tag key and an associated tag value. The maximum length of a tag key is 128 characters. The maximum length of a tag value is 256 characters.
     */
    tags?: TagMap;
  }
  export interface CreateAllowListResponse {
    /**
     * The Amazon Resource Name (ARN) of the allow list.
     */
    arn?: __stringMin71Max89PatternArnAwsAwsCnAwsUsGovMacie2AZ19920D12AllowListAZ0922;
    /**
     * The unique identifier for the allow list.
     */
    id?: __stringMin22Max22PatternAZ0922;
  }
  export interface CreateClassificationJobRequest {
    /**
     * An array of unique identifiers, one for each allow list for the job to use when it analyzes data.
     */
    allowListIds?: __listOf__string;
    /**
     * A unique, case-sensitive token that you provide to ensure the idempotency of the request.
     */
    clientToken: __string;
    /**
     * An array of unique identifiers, one for each custom data identifier for the job to use when it analyzes data. To use only managed data identifiers, don't specify a value for this property and specify a value other than NONE for the managedDataIdentifierSelector property.
     */
    customDataIdentifierIds?: __listOf__string;
    /**
     * A custom description of the job. The description can contain as many as 200 characters.
     */
    description?: __string;
    /**
     * For a recurring job, specifies whether to analyze all existing, eligible objects immediately after the job is created (true). To analyze only those objects that are created or changed after you create the job and before the job's first scheduled run, set this value to false. If you configure the job to run only once, don't specify a value for this property.
     */
    initialRun?: __boolean;
    /**
     * The schedule for running the job. Valid values are: ONE_TIME - Run the job only once. If you specify this value, don't specify a value for the scheduleFrequency property. SCHEDULED - Run the job on a daily, weekly, or monthly basis. If you specify this value, use the scheduleFrequency property to define the recurrence pattern for the job.
     */
    jobType: JobType;
    /**
     * An array of unique identifiers, one for each managed data identifier for the job to include (use) or exclude (not use) when it analyzes data. Inclusion or exclusion depends on the managed data identifier selection type that you specify for the job (managedDataIdentifierSelector). To retrieve a list of valid values for this property, use the ListManagedDataIdentifiers operation.
     */
    managedDataIdentifierIds?: __listOf__string;
    /**
     * The selection type to apply when determining which managed data identifiers the job uses to analyze data. Valid values are: ALL - Use all managed data identifiers. If you specify this value, don't specify any values for the managedDataIdentifierIds property. EXCLUDE - Use all managed data identifiers except the ones specified by the managedDataIdentifierIds property. INCLUDE - Use only the managed data identifiers specified by the managedDataIdentifierIds property. NONE - Don't use any managed data identifiers. If you specify this value, specify at least one value for the customDataIdentifierIds property and don't specify any values for the managedDataIdentifierIds property. RECOMMENDED (default) - Use the recommended set of managed data identifiers. If you specify this value, don't specify any values for the managedDataIdentifierIds property. If you don't specify a value for this property, the job uses the recommended set of managed data identifiers. If the job is a recurring job and you specify ALL or EXCLUDE, each job run automatically uses new managed data identifiers that are released. If you specify RECOMMENDED for a recurring job, each job run automatically uses all the managed data identifiers that are in the recommended set when the run starts. For information about individual managed data identifiers or to determine which ones are in the recommended set, see Using managed data identifiers and Recommended managed data identifiers in the Amazon Macie User Guide.
     */
    managedDataIdentifierSelector?: ManagedDataIdentifierSelector;
    /**
     * A custom name for the job. The name can contain as many as 500 characters.
     */
    name: __string;
    /**
     * The S3 buckets that contain the objects to analyze, and the scope of that analysis.
     */
    s3JobDefinition: S3JobDefinition;
    /**
     * The sampling depth, as a percentage, for the job to apply when processing objects. This value determines the percentage of eligible objects that the job analyzes. If this value is less than 100, Amazon Macie selects the objects to analyze at random, up to the specified percentage, and analyzes all the data in those objects.
     */
    samplingPercentage?: __integer;
    /**
     * The recurrence pattern for running the job. To run the job only once, don't specify a value for this property and set the value for the jobType property to ONE_TIME.
     */
    scheduleFrequency?: JobScheduleFrequency;
    /**
     * A map of key-value pairs that specifies the tags to associate with the job. A job can have a maximum of 50 tags. Each tag consists of a tag key and an associated tag value. The maximum length of a tag key is 128 characters. The maximum length of a tag value is 256 characters.
     */
    tags?: TagMap;
  }
  export interface CreateClassificationJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the job.
     */
    jobArn?: __string;
    /**
     * The unique identifier for the job.
     */
    jobId?: __string;
  }
  export interface CreateCustomDataIdentifierRequest {
    /**
     * A unique, case-sensitive token that you provide to ensure the idempotency of the request.
     */
    clientToken?: __string;
    /**
     * A custom description of the custom data identifier. The description can contain as many as 512 characters. We strongly recommend that you avoid including any sensitive data in the description of a custom data identifier. Other users of your account might be able to see this description, depending on the actions that they're allowed to perform in Amazon Macie.
     */
    description?: __string;
    /**
     * An array that lists specific character sequences (ignore words) to exclude from the results. If the text matched by the regular expression contains any string in this array, Amazon Macie ignores it. The array can contain as many as 10 ignore words. Each ignore word can contain 4-90 UTF-8 characters. Ignore words are case sensitive.
     */
    ignoreWords?: __listOf__string;
    /**
     * An array that lists specific character sequences (keywords), one of which must precede and be within proximity (maximumMatchDistance) of the regular expression to match. The array can contain as many as 50 keywords. Each keyword can contain 3-90 UTF-8 characters. Keywords aren't case sensitive.
     */
    keywords?: __listOf__string;
    /**
     * The maximum number of characters that can exist between the end of at least one complete character sequence specified by the keywords array and the end of the text that matches the regex pattern. If a complete keyword precedes all the text that matches the pattern and the keyword is within the specified distance, Amazon Macie includes the result. The distance can be 1-300 characters. The default value is 50.
     */
    maximumMatchDistance?: __integer;
    /**
     * A custom name for the custom data identifier. The name can contain as many as 128 characters. We strongly recommend that you avoid including any sensitive data in the name of a custom data identifier. Other users of your account might be able to see this name, depending on the actions that they're allowed to perform in Amazon Macie.
     */
    name: __string;
    /**
     * The regular expression (regex) that defines the pattern to match. The expression can contain as many as 512 characters.
     */
    regex: __string;
    /**
     * The severity to assign to findings that the custom data identifier produces, based on the number of occurrences of text that match the custom data identifier's detection criteria. You can specify as many as three SeverityLevel objects in this array, one for each severity: LOW, MEDIUM, or HIGH. If you specify more than one, the occurrences thresholds must be in ascending order by severity, moving from LOW to HIGH. For example, 1 for LOW, 50 for MEDIUM, and 100 for HIGH. If an S3 object contains fewer occurrences than the lowest specified threshold, Amazon Macie doesn't create a finding. If you don't specify any values for this array, Macie creates findings for S3 objects that contain at least one occurrence of text that matches the detection criteria, and Macie assigns the MEDIUM severity to those findings.
     */
    severityLevels?: SeverityLevelList;
    /**
     * A map of key-value pairs that specifies the tags to associate with the custom data identifier. A custom data identifier can have a maximum of 50 tags. Each tag consists of a tag key and an associated tag value. The maximum length of a tag key is 128 characters. The maximum length of a tag value is 256 characters.
     */
    tags?: TagMap;
  }
  export interface CreateCustomDataIdentifierResponse {
    /**
     * The unique identifier for the custom data identifier that was created.
     */
    customDataIdentifierId?: __string;
  }
  export interface CreateFindingsFilterRequest {
    /**
     * The action to perform on findings that match the filter criteria (findingCriteria). Valid values are: ARCHIVE, suppress (automatically archive) the findings; and, NOOP, don't perform any action on the findings.
     */
    action: FindingsFilterAction;
    /**
     * A unique, case-sensitive token that you provide to ensure the idempotency of the request.
     */
    clientToken?: __string;
    /**
     * A custom description of the filter. The description can contain as many as 512 characters. We strongly recommend that you avoid including any sensitive data in the description of a filter. Other users of your account might be able to see this description, depending on the actions that they're allowed to perform in Amazon Macie.
     */
    description?: __string;
    /**
     * The criteria to use to filter findings.
     */
    findingCriteria: FindingCriteria;
    /**
     * A custom name for the filter. The name must contain at least 3 characters and can contain as many as 64 characters. We strongly recommend that you avoid including any sensitive data in the name of a filter. Other users of your account might be able to see this name, depending on the actions that they're allowed to perform in Amazon Macie.
     */
    name: __string;
    /**
     * The position of the filter in the list of saved filters on the Amazon Macie console. This value also determines the order in which the filter is applied to findings, relative to other filters that are also applied to the findings.
     */
    position?: __integer;
    /**
     * A map of key-value pairs that specifies the tags to associate with the filter. A findings filter can have a maximum of 50 tags. Each tag consists of a tag key and an associated tag value. The maximum length of a tag key is 128 characters. The maximum length of a tag value is 256 characters.
     */
    tags?: TagMap;
  }
  export interface CreateFindingsFilterResponse {
    /**
     * The Amazon Resource Name (ARN) of the filter that was created.
     */
    arn?: __string;
    /**
     * The unique identifier for the filter that was created.
     */
    id?: __string;
  }
  export interface CreateInvitationsRequest {
    /**
     * An array that lists Amazon Web Services account IDs, one for each account to send the invitation to.
     */
    accountIds: __listOf__string;
    /**
     * Specifies whether to send the invitation as an email message. If this value is false, Amazon Macie sends the invitation (as an email message) to the email address that you specified for the recipient's account when you associated the account with your account. The default value is false.
     */
    disableEmailNotification?: __boolean;
    /**
     * Custom text to include in the email message that contains the invitation. The text can contain as many as 80 alphanumeric characters.
     */
    message?: __string;
  }
  export interface CreateInvitationsResponse {
    /**
     * An array of objects, one for each account whose invitation hasn't been processed. Each object identifies the account and explains why the invitation hasn't been processed for the account.
     */
    unprocessedAccounts?: __listOfUnprocessedAccount;
  }
  export interface CreateMemberRequest {
    /**
     * The details of the account to associate with the administrator account.
     */
    account: AccountDetail;
    /**
     * A map of key-value pairs that specifies the tags to associate with the account in Amazon Macie. An account can have a maximum of 50 tags. Each tag consists of a tag key and an associated tag value. The maximum length of a tag key is 128 characters. The maximum length of a tag value is 256 characters.
     */
    tags?: TagMap;
  }
  export interface CreateMemberResponse {
    /**
     * The Amazon Resource Name (ARN) of the account that was associated with the administrator account.
     */
    arn?: __string;
  }
  export interface CreateSampleFindingsRequest {
    /**
     * An array of finding types, one for each type of sample finding to create. To create a sample of every type of finding that Amazon Macie supports, don't include this array in your request.
     */
    findingTypes?: __listOfFindingType;
  }
  export interface CreateSampleFindingsResponse {
  }
  export interface CriteriaBlockForJob {
    /**
     * An array of conditions, one for each condition that determines which buckets to include or exclude from the job. If you specify more than one condition, Amazon Macie uses AND logic to join the conditions.
     */
    and?: __listOfCriteriaForJob;
  }
  export interface CriteriaForJob {
    /**
     * A property-based condition that defines a property, operator, and one or more values for including or excluding buckets from the job.
     */
    simpleCriterion?: SimpleCriterionForJob;
    /**
     * A tag-based condition that defines an operator and tag keys, tag values, or tag key and value pairs for including or excluding buckets from the job.
     */
    tagCriterion?: TagCriterionForJob;
  }
  export type Criterion = {[key: string]: CriterionAdditionalProperties};
  export interface CriterionAdditionalProperties {
    /**
     * The value for the property matches (equals) the specified value. If you specify multiple values, Macie uses OR logic to join the values.
     */
    eq?: __listOf__string;
    /**
     * The value for the property exclusively matches (equals an exact match for) all the specified values. If you specify multiple values, Amazon Macie uses AND logic to join the values. You can use this operator with the following properties: customDataIdentifiers.detections.arn, customDataIdentifiers.detections.name, resourcesAffected.s3Bucket.tags.key, resourcesAffected.s3Bucket.tags.value, resourcesAffected.s3Object.tags.key, resourcesAffected.s3Object.tags.value, sensitiveData.category, and sensitiveData.detections.type.
     */
    eqExactMatch?: __listOf__string;
    /**
     * The value for the property is greater than the specified value.
     */
    gt?: __long;
    /**
     * The value for the property is greater than or equal to the specified value.
     */
    gte?: __long;
    /**
     * The value for the property is less than the specified value.
     */
    lt?: __long;
    /**
     * The value for the property is less than or equal to the specified value.
     */
    lte?: __long;
    /**
     * The value for the property doesn't match (doesn't equal) the specified value. If you specify multiple values, Macie uses OR logic to join the values.
     */
    neq?: __listOf__string;
  }
  export type Currency = "USD"|string;
  export interface CustomDataIdentifierSummary {
    /**
     * The Amazon Resource Name (ARN) of the custom data identifier.
     */
    arn?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the custom data identifier was created.
     */
    createdAt?: __timestampIso8601;
    /**
     * The custom description of the custom data identifier.
     */
    description?: __string;
    /**
     * The unique identifier for the custom data identifier.
     */
    id?: __string;
    /**
     * The custom name of the custom data identifier.
     */
    name?: __string;
  }
  export interface CustomDataIdentifiers {
    /**
     * The custom data identifiers that detected the data, and the number of occurrences of the data that each identifier detected.
     */
    detections?: CustomDetections;
    /**
     * The total number of occurrences of the data that was detected by the custom data identifiers and produced the finding.
     */
    totalCount?: __long;
  }
  export interface CustomDetection {
    /**
     * The unique identifier for the custom data identifier.
     */
    arn?: __string;
    /**
     * The total number of occurrences of the sensitive data that the custom data identifier detected.
     */
    count?: __long;
    /**
     * The name of the custom data identifier.
     */
    name?: __string;
    /**
     * The location of 1-15 occurrences of the sensitive data that the custom data identifier detected. A finding includes location data for a maximum of 15 occurrences of sensitive data.
     */
    occurrences?: Occurrences;
  }
  export type CustomDetections = CustomDetection[];
  export interface DailySchedule {
  }
  export type DataIdentifierSeverity = "LOW"|"MEDIUM"|"HIGH"|string;
  export type DataIdentifierType = "CUSTOM"|"MANAGED"|string;
  export type DayOfWeek = "SUNDAY"|"MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|string;
  export interface DeclineInvitationsRequest {
    /**
     * An array that lists Amazon Web Services account IDs, one for each account that sent an invitation to decline.
     */
    accountIds: __listOf__string;
  }
  export interface DeclineInvitationsResponse {
    /**
     * An array of objects, one for each account whose invitation hasn't been declined. Each object identifies the account and explains why the request hasn't been processed for that account.
     */
    unprocessedAccounts?: __listOfUnprocessedAccount;
  }
  export interface DefaultDetection {
    /**
     * The total number of occurrences of the type of sensitive data that was detected.
     */
    count?: __long;
    /**
     * The location of 1-15 occurrences of the sensitive data that was detected. A finding includes location data for a maximum of 15 occurrences of sensitive data.
     */
    occurrences?: Occurrences;
    /**
     * The type of sensitive data that was detected. For example, AWS_CREDENTIALS, PHONE_NUMBER, or ADDRESS.
     */
    type?: __string;
  }
  export type DefaultDetections = DefaultDetection[];
  export interface DeleteAllowListRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
    /**
     * Specifies whether to force deletion of the allow list, even if active classification jobs are configured to use the list. When you try to delete an allow list, Amazon Macie checks for classification jobs that use the list and have a status other than COMPLETE or CANCELLED. By default, Macie rejects your request if any jobs meet these criteria. To skip these checks and delete the list, set this value to true. To delete the list only if no active jobs are configured to use it, set this value to false.
     */
    ignoreJobChecks?: __string;
  }
  export interface DeleteAllowListResponse {
  }
  export interface DeleteCustomDataIdentifierRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
  }
  export interface DeleteCustomDataIdentifierResponse {
  }
  export interface DeleteFindingsFilterRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
  }
  export interface DeleteFindingsFilterResponse {
  }
  export interface DeleteInvitationsRequest {
    /**
     * An array that lists Amazon Web Services account IDs, one for each account that sent an invitation to delete.
     */
    accountIds: __listOf__string;
  }
  export interface DeleteInvitationsResponse {
    /**
     * An array of objects, one for each account whose invitation hasn't been deleted. Each object identifies the account and explains why the request hasn't been processed for that account.
     */
    unprocessedAccounts?: __listOfUnprocessedAccount;
  }
  export interface DeleteMemberRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
  }
  export interface DeleteMemberResponse {
  }
  export interface DescribeBucketsRequest {
    /**
     * The criteria to use to filter the query results.
     */
    criteria?: BucketCriteria;
    /**
     * The maximum number of items to include in each page of the response. The default value is 50.
     */
    maxResults?: __integer;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
    /**
     * The criteria to use to sort the query results.
     */
    sortCriteria?: BucketSortCriteria;
  }
  export interface DescribeBucketsResponse {
    /**
     * An array of objects, one for each bucket that matches the filter criteria specified in the request.
     */
    buckets?: __listOfBucketMetadata;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface DescribeClassificationJobRequest {
    /**
     * The unique identifier for the classification job.
     */
    jobId: __string;
  }
  export interface DescribeClassificationJobResponse {
    /**
     * An array of unique identifiers, one for each allow list that the job uses when it analyzes data.
     */
    allowListIds?: __listOf__string;
    /**
     * The token that was provided to ensure the idempotency of the request to create the job.
     */
    clientToken?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the job was created.
     */
    createdAt?: __timestampIso8601;
    /**
     * An array of unique identifiers, one for each custom data identifier that the job uses when it analyzes data. This value is null if the job uses only managed data identifiers to analyze data.
     */
    customDataIdentifierIds?: __listOf__string;
    /**
     * The custom description of the job.
     */
    description?: __string;
    /**
     * For a recurring job, specifies whether you configured the job to analyze all existing, eligible objects immediately after the job was created (true). If you configured the job to analyze only those objects that were created or changed after the job was created and before the job's first scheduled run, this value is false. This value is also false for a one-time job.
     */
    initialRun?: __boolean;
    /**
     * The Amazon Resource Name (ARN) of the job.
     */
    jobArn?: __string;
    /**
     * The unique identifier for the job.
     */
    jobId?: __string;
    /**
     * The current status of the job. Possible values are: CANCELLED - You cancelled the job or, if it's a one-time job, you paused the job and didn't resume it within 30 days. COMPLETE - For a one-time job, Amazon Macie finished processing the data specified for the job. This value doesn't apply to recurring jobs. IDLE - For a recurring job, the previous scheduled run is complete and the next scheduled run is pending. This value doesn't apply to one-time jobs. PAUSED - Macie started running the job but additional processing would exceed the monthly sensitive data discovery quota for your account or one or more member accounts that the job analyzes data for. RUNNING - For a one-time job, the job is in progress. For a recurring job, a scheduled run is in progress. USER_PAUSED - You paused the job. If you paused the job while it had a status of RUNNING and you don't resume it within 30 days of pausing it, the job or job run will expire and be cancelled, depending on the job's type. To check the expiration date, refer to the UserPausedDetails.jobExpiresAt property.
     */
    jobStatus?: JobStatus;
    /**
     * The schedule for running the job. Possible values are: ONE_TIME - The job runs only once. SCHEDULED - The job runs on a daily, weekly, or monthly basis. The scheduleFrequency property indicates the recurrence pattern for the job.
     */
    jobType?: JobType;
    /**
     * Specifies whether any account- or bucket-level access errors occurred when the job ran. For a recurring job, this value indicates the error status of the job's most recent run.
     */
    lastRunErrorStatus?: LastRunErrorStatus;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the job started. If the job is a recurring job, this value indicates when the most recent run started or, if the job hasn't run yet, when the job was created.
     */
    lastRunTime?: __timestampIso8601;
    /**
     * An array of unique identifiers, one for each managed data identifier that the job is explicitly configured to include (use) or exclude (not use) when it analyzes data. Inclusion or exclusion depends on the managed data identifier selection type specified for the job (managedDataIdentifierSelector).This value is null if the job's managed data identifier selection type is ALL, NONE, or RECOMMENDED.
     */
    managedDataIdentifierIds?: __listOf__string;
    /**
     * The selection type that determines which managed data identifiers the job uses when it analyzes data. Possible values are: ALL - Use all managed data identifiers. EXCLUDE - Use all managed data identifiers except the ones specified by the managedDataIdentifierIds property. INCLUDE - Use only the managed data identifiers specified by the managedDataIdentifierIds property. NONE - Don't use any managed data identifiers. Use only custom data identifiers (customDataIdentifierIds). RECOMMENDED (default) - Use the recommended set of managed data identifiers. If this value is null, the job uses the recommended set of managed data identifiers. If the job is a recurring job and this value is ALL or EXCLUDE, each job run automatically uses new managed data identifiers that are released. If this value is null or RECOMMENDED for a recurring job, each job run uses all the managed data identifiers that are in the recommended set when the run starts. For information about individual managed data identifiers or to determine which ones are in the recommended set, see Using managed data identifiers and Recommended managed data identifiers in the Amazon Macie User Guide.
     */
    managedDataIdentifierSelector?: ManagedDataIdentifierSelector;
    /**
     * The custom name of the job.
     */
    name?: __string;
    /**
     * The S3 buckets that contain the objects to analyze, and the scope of that analysis.
     */
    s3JobDefinition?: S3JobDefinition;
    /**
     * The sampling depth, as a percentage, that determines the percentage of eligible objects that the job analyzes.
     */
    samplingPercentage?: __integer;
    /**
     * The recurrence pattern for running the job. This value is null if the job is configured to run only once.
     */
    scheduleFrequency?: JobScheduleFrequency;
    /**
     * The number of times that the job has run and processing statistics for the job's current run.
     */
    statistics?: Statistics;
    /**
     * A map of key-value pairs that specifies which tags (keys and values) are associated with the classification job.
     */
    tags?: TagMap;
    /**
     * If the current status of the job is USER_PAUSED, specifies when the job was paused and when the job or job run will expire and be cancelled if it isn't resumed. This value is present only if the value for jobStatus is USER_PAUSED.
     */
    userPausedDetails?: UserPausedDetails;
  }
  export interface DescribeOrganizationConfigurationRequest {
  }
  export interface DescribeOrganizationConfigurationResponse {
    /**
     * Specifies whether Amazon Macie is enabled automatically for accounts that are added to the organization.
     */
    autoEnable?: __boolean;
    /**
     * Specifies whether the maximum number of Amazon Macie member accounts are part of the organization.
     */
    maxAccountLimitReached?: __boolean;
  }
  export interface DetectedDataDetails {
    /**
     * An occurrence of the specified type of sensitive data. Each occurrence can contain 1-128 characters.
     */
    value: __stringMin1Max128;
  }
  export interface Detection {
    /**
     * If the sensitive data was detected by a custom data identifier, the Amazon Resource Name (ARN) of the custom data identifier that detected the data. Otherwise, this value is null.
     */
    arn?: __string;
    /**
     * The total number of occurrences of the sensitive data.
     */
    count?: __long;
    /**
     * The unique identifier for the custom data identifier or managed data identifier that detected the sensitive data. For additional details about a specified managed data identifier, see Using managed data identifiers in the Amazon Macie User Guide.
     */
    id?: __string;
    /**
     * The name of the custom data identifier or managed data identifier that detected the sensitive data. For a managed data identifier, this value is the same as the unique identifier (id).
     */
    name?: __string;
    /**
     * Specifies whether occurrences of this type of sensitive data are excluded (true) or included (false) in the bucket's sensitivity score.
     */
    suppressed?: __boolean;
    /**
     * The type of data identifier that detected the sensitive data. Possible values are: CUSTOM, for a custom data identifier; and, MANAGED, for a managed data identifier.
     */
    type?: DataIdentifierType;
  }
  export interface DisableMacieRequest {
  }
  export interface DisableMacieResponse {
  }
  export interface DisableOrganizationAdminAccountRequest {
    /**
     * The Amazon Web Services account ID of the delegated Amazon Macie administrator account.
     */
    adminAccountId: __string;
  }
  export interface DisableOrganizationAdminAccountResponse {
  }
  export interface DisassociateFromAdministratorAccountRequest {
  }
  export interface DisassociateFromAdministratorAccountResponse {
  }
  export interface DisassociateFromMasterAccountRequest {
  }
  export interface DisassociateFromMasterAccountResponse {
  }
  export interface DisassociateMemberRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
  }
  export interface DisassociateMemberResponse {
  }
  export interface DomainDetails {
    /**
     * The name of the domain.
     */
    domainName?: __string;
  }
  export type EffectivePermission = "PUBLIC"|"NOT_PUBLIC"|"UNKNOWN"|string;
  export interface EnableMacieRequest {
    /**
     * A unique, case-sensitive token that you provide to ensure the idempotency of the request.
     */
    clientToken?: __string;
    /**
     * Specifies how often to publish updates to policy findings for the account. This includes publishing updates to Security Hub and Amazon EventBridge (formerly Amazon CloudWatch Events).
     */
    findingPublishingFrequency?: FindingPublishingFrequency;
    /**
     * Specifies the new status for the account. To enable Amazon Macie and start all Macie activities for the account, set this value to ENABLED.
     */
    status?: MacieStatus;
  }
  export interface EnableMacieResponse {
  }
  export interface EnableOrganizationAdminAccountRequest {
    /**
     * The Amazon Web Services account ID for the account to designate as the delegated Amazon Macie administrator account for the organization.
     */
    adminAccountId: __string;
    /**
     * A unique, case-sensitive token that you provide to ensure the idempotency of the request.
     */
    clientToken?: __string;
  }
  export interface EnableOrganizationAdminAccountResponse {
  }
  export type EncryptionType = "NONE"|"AES256"|"aws:kms"|"UNKNOWN"|string;
  export type ErrorCode = "ClientError"|"InternalError"|string;
  export interface FederatedUser {
    /**
     * The Amazon Web Services access key ID that identifies the credentials.
     */
    accessKeyId?: __string;
    /**
     * The unique identifier for the Amazon Web Services account that owns the entity that was used to get the credentials.
     */
    accountId?: __string;
    /**
     * The Amazon Resource Name (ARN) of the entity that was used to get the credentials.
     */
    arn?: __string;
    /**
     * The unique identifier for the entity that was used to get the credentials.
     */
    principalId?: __string;
    /**
     * The details of the session that was created for the credentials, including the entity that issued the session.
     */
    sessionContext?: SessionContext;
  }
  export interface Finding {
    /**
     * The unique identifier for the Amazon Web Services account that the finding applies to. This is typically the account that owns the affected resource.
     */
    accountId?: __string;
    /**
     * Specifies whether the finding is archived (suppressed).
     */
    archived?: __boolean;
    /**
     * The category of the finding. Possible values are: CLASSIFICATION, for a sensitive data finding; and, POLICY, for a policy finding.
     */
    category?: FindingCategory;
    /**
     * The details of a sensitive data finding. This value is null for a policy finding.
     */
    classificationDetails?: ClassificationDetails;
    /**
     * The total number of occurrences of the finding. For sensitive data findings, this value is always 1. All sensitive data findings are considered unique.
     */
    count?: __long;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when Amazon Macie created the finding.
     */
    createdAt?: __timestampIso8601;
    /**
     * The description of the finding.
     */
    description?: __string;
    /**
     * The unique identifier for the finding. This is a random string that Amazon Macie generates and assigns to a finding when it creates the finding.
     */
    id?: __string;
    /**
     * The Amazon Web Services partition that Amazon Macie created the finding in.
     */
    partition?: __string;
    /**
     * The details of a policy finding. This value is null for a sensitive data finding.
     */
    policyDetails?: PolicyDetails;
    /**
     * The Amazon Web Services Region that Amazon Macie created the finding in.
     */
    region?: __string;
    /**
     * The resources that the finding applies to.
     */
    resourcesAffected?: ResourcesAffected;
    /**
     * Specifies whether the finding is a sample finding. A sample finding is a finding that uses example data to demonstrate what a finding might contain.
     */
    sample?: __boolean;
    /**
     * The version of the schema that was used to define the data structures in the finding.
     */
    schemaVersion?: __string;
    /**
     * The severity level and score for the finding.
     */
    severity?: Severity;
    /**
     * The brief description of the finding.
     */
    title?: __string;
    /**
     * The type of the finding.
     */
    type?: FindingType;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when Amazon Macie last updated the finding. For sensitive data findings, this value is the same as the value for the createdAt property. All sensitive data findings are considered new.
     */
    updatedAt?: __timestampIso8601;
  }
  export interface FindingAction {
    /**
     * The type of action that occurred for the affected resource. This value is typically AWS_API_CALL, which indicates that an entity invoked an API operation for the resource.
     */
    actionType?: FindingActionType;
    /**
     * The invocation details of the API operation that an entity invoked for the affected resource, if the value for the actionType property is AWS_API_CALL.
     */
    apiCallDetails?: ApiCallDetails;
  }
  export type FindingActionType = "AWS_API_CALL"|string;
  export interface FindingActor {
    /**
     * The domain name of the device that the entity used to perform the action on the affected resource.
     */
    domainDetails?: DomainDetails;
    /**
     * The IP address of the device that the entity used to perform the action on the affected resource. This object also provides information such as the owner and geographic location for the IP address.
     */
    ipAddressDetails?: IpAddressDetails;
    /**
     * The type and other characteristics of the entity that performed the action on the affected resource.
     */
    userIdentity?: UserIdentity;
  }
  export type FindingCategory = "CLASSIFICATION"|"POLICY"|string;
  export interface FindingCriteria {
    /**
     * A condition that specifies the property, operator, and one or more values to use to filter the results.
     */
    criterion?: Criterion;
  }
  export type FindingPublishingFrequency = "FIFTEEN_MINUTES"|"ONE_HOUR"|"SIX_HOURS"|string;
  export type FindingStatisticsSortAttributeName = "groupKey"|"count"|string;
  export interface FindingStatisticsSortCriteria {
    /**
     * The grouping to sort the results by. Valid values are: count, sort the results by the number of findings in each group of results; and, groupKey, sort the results by the name of each group of results.
     */
    attributeName?: FindingStatisticsSortAttributeName;
    /**
     * The sort order to apply to the results, based on the value for the property specified by the attributeName property. Valid values are: ASC, sort the results in ascending order; and, DESC, sort the results in descending order.
     */
    orderBy?: OrderBy;
  }
  export type FindingType = "SensitiveData:S3Object/Multiple"|"SensitiveData:S3Object/Financial"|"SensitiveData:S3Object/Personal"|"SensitiveData:S3Object/Credentials"|"SensitiveData:S3Object/CustomIdentifier"|"Policy:IAMUser/S3BucketPublic"|"Policy:IAMUser/S3BucketSharedExternally"|"Policy:IAMUser/S3BucketReplicatedExternally"|"Policy:IAMUser/S3BucketEncryptionDisabled"|"Policy:IAMUser/S3BlockPublicAccessDisabled"|"Policy:IAMUser/S3BucketSharedWithCloudFront"|string;
  export type FindingsFilterAction = "ARCHIVE"|"NOOP"|string;
  export interface FindingsFilterListItem {
    /**
     * The action that's performed on findings that match the filter criteria. Possible values are: ARCHIVE, suppress (automatically archive) the findings; and, NOOP, don't perform any action on the findings.
     */
    action?: FindingsFilterAction;
    /**
     * The Amazon Resource Name (ARN) of the filter.
     */
    arn?: __string;
    /**
     * The unique identifier for the filter.
     */
    id?: __string;
    /**
     * The custom name of the filter.
     */
    name?: __string;
    /**
     * A map of key-value pairs that specifies which tags (keys and values) are associated with the filter.
     */
    tags?: TagMap;
  }
  export interface GetAdministratorAccountRequest {
  }
  export interface GetAdministratorAccountResponse {
    /**
     * The Amazon Web Services account ID for the administrator account. If the accounts are associated by an Amazon Macie membership invitation, this object also provides details about the invitation that was sent to establish the relationship between the accounts.
     */
    administrator?: Invitation;
  }
  export interface GetAllowListRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
  }
  export interface GetAllowListResponse {
    /**
     * The Amazon Resource Name (ARN) of the allow list.
     */
    arn?: __stringMin71Max89PatternArnAwsAwsCnAwsUsGovMacie2AZ19920D12AllowListAZ0922;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the allow list was created in Amazon Macie.
     */
    createdAt?: __timestampIso8601;
    /**
     * The criteria that specify the text or text pattern to ignore. The criteria can be the location and name of an S3 object that lists specific text to ignore (s3WordsList), or a regular expression (regex) that defines a text pattern to ignore.
     */
    criteria?: AllowListCriteria;
    /**
     * The custom description of the allow list.
     */
    description?: __stringMin1Max512PatternSS;
    /**
     * The unique identifier for the allow list.
     */
    id?: __stringMin22Max22PatternAZ0922;
    /**
     * The custom name of the allow list.
     */
    name?: __stringMin1Max128Pattern;
    /**
     * The current status of the allow list, which indicates whether Amazon Macie can access and use the list's criteria.
     */
    status?: AllowListStatus;
    /**
     * A map of key-value pairs that specifies which tags (keys and values) are associated with the allow list.
     */
    tags?: TagMap;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the allow list's settings were most recently changed in Amazon Macie.
     */
    updatedAt?: __timestampIso8601;
  }
  export interface GetAutomatedDiscoveryConfigurationRequest {
  }
  export interface GetAutomatedDiscoveryConfigurationResponse {
    /**
     * The unique identifier for the classification scope that's used when performing automated sensitive data discovery for the account. The classification scope specifies S3 buckets to exclude from automated sensitive data discovery.
     */
    classificationScopeId?: ClassificationScopeId;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when automated sensitive data discovery was most recently disabled for the account. This value is null if automated sensitive data discovery wasn't enabled and subsequently disabled for the account.
     */
    disabledAt?: Timestamp;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when automated sensitive data discovery was initially enabled for the account. This value is null if automated sensitive data discovery has never been enabled for the account.
     */
    firstEnabledAt?: Timestamp;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when automated sensitive data discovery was most recently enabled or disabled for the account.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The unique identifier for the sensitivity inspection template that's used when performing automated sensitive data discovery for the account. The template specifies which allow lists, custom data identifiers, and managed data identifiers to use when analyzing data.
     */
    sensitivityInspectionTemplateId?: SensitivityInspectionTemplateId;
    /**
     * The current status of the automated sensitive data discovery configuration for the account. Possible values are: ENABLED, use the specified settings to perform automated sensitive data discovery activities for the account; and, DISABLED, don't perform automated sensitive data discovery activities for the account.
     */
    status?: AutomatedDiscoveryStatus;
  }
  export interface GetBucketStatisticsRequest {
    /**
     * The unique identifier for the Amazon Web Services account.
     */
    accountId?: __string;
  }
  export interface GetBucketStatisticsResponse {
    /**
     * The total number of buckets.
     */
    bucketCount?: __long;
    /**
     * The total number of buckets that are publicly accessible due to a combination of permissions settings for each bucket.
     */
    bucketCountByEffectivePermission?: BucketCountByEffectivePermission;
    /**
     * The total number of buckets whose settings do or don't specify default server-side encryption behavior for objects that are added to the buckets.
     */
    bucketCountByEncryptionType?: BucketCountByEncryptionType;
    /**
     * The total number of buckets whose bucket policies do or don't require server-side encryption of objects when objects are added to the buckets.
     */
    bucketCountByObjectEncryptionRequirement?: BucketCountPolicyAllowsUnencryptedObjectUploads;
    /**
     * The total number of buckets that are or aren't shared with other Amazon Web Services accounts, Amazon CloudFront origin access identities (OAIs), or CloudFront origin access controls (OACs).
     */
    bucketCountBySharedAccessType?: BucketCountBySharedAccessType;
    /**
     * The aggregated sensitive data discovery statistics for the buckets. If automated sensitive data discovery is currently disabled for your account, the value for each statistic is 0.
     */
    bucketStatisticsBySensitivity?: BucketStatisticsBySensitivity;
    /**
     * The total number of objects that Amazon Macie can analyze in the buckets. These objects use a supported storage class and have a file name extension for a supported file or storage format.
     */
    classifiableObjectCount?: __long;
    /**
     * The total storage size, in bytes, of all the objects that Amazon Macie can analyze in the buckets. These objects use a supported storage class and have a file name extension for a supported file or storage format. If versioning is enabled for any of the buckets, this value is based on the size of the latest version of each applicable object in the buckets. This value doesn't reflect the storage size of all versions of all applicable objects in the buckets.
     */
    classifiableSizeInBytes?: __long;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when Amazon Macie most recently retrieved bucket or object metadata from Amazon S3 for the buckets.
     */
    lastUpdated?: __timestampIso8601;
    /**
     * The total number of objects in the buckets.
     */
    objectCount?: __long;
    /**
     * The total storage size, in bytes, of the buckets. If versioning is enabled for any of the buckets, this value is based on the size of the latest version of each object in the buckets. This value doesn't reflect the storage size of all versions of the objects in the buckets.
     */
    sizeInBytes?: __long;
    /**
     * The total storage size, in bytes, of the objects that are compressed (.gz, .gzip, .zip) files in the buckets. If versioning is enabled for any of the buckets, this value is based on the size of the latest version of each applicable object in the buckets. This value doesn't reflect the storage size of all versions of the applicable objects in the buckets.
     */
    sizeInBytesCompressed?: __long;
    /**
     * The total number of objects that Amazon Macie can't analyze in the buckets. These objects don't use a supported storage class or don't have a file name extension for a supported file or storage format.
     */
    unclassifiableObjectCount?: ObjectLevelStatistics;
    /**
     * The total storage size, in bytes, of the objects that Amazon Macie can't analyze in the buckets. These objects don't use a supported storage class or don't have a file name extension for a supported file or storage format.
     */
    unclassifiableObjectSizeInBytes?: ObjectLevelStatistics;
  }
  export interface GetClassificationExportConfigurationRequest {
  }
  export interface GetClassificationExportConfigurationResponse {
    /**
     * The location where data classification results are stored, and the encryption settings that are used when storing results in that location.
     */
    configuration?: ClassificationExportConfiguration;
  }
  export interface GetClassificationScopeRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
  }
  export interface GetClassificationScopeResponse {
    /**
     * The unique identifier for the classification scope.
     */
    id?: ClassificationScopeId;
    /**
     * The name of the classification scope: automated-sensitive-data-discovery.
     */
    name?: ClassificationScopeName;
    /**
     * The S3 buckets that are excluded from automated sensitive data discovery.
     */
    s3?: S3ClassificationScope;
  }
  export interface GetCustomDataIdentifierRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
  }
  export interface GetCustomDataIdentifierResponse {
    /**
     * The Amazon Resource Name (ARN) of the custom data identifier.
     */
    arn?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the custom data identifier was created.
     */
    createdAt?: __timestampIso8601;
    /**
     * Specifies whether the custom data identifier was deleted. If you delete a custom data identifier, Amazon Macie doesn't delete it permanently. Instead, it soft deletes the identifier.
     */
    deleted?: __boolean;
    /**
     * The custom description of the custom data identifier.
     */
    description?: __string;
    /**
     * The unique identifier for the custom data identifier.
     */
    id?: __string;
    /**
     * An array that lists specific character sequences (ignore words) to exclude from the results. If the text matched by the regular expression contains any string in this array, Amazon Macie ignores it. Ignore words are case sensitive.
     */
    ignoreWords?: __listOf__string;
    /**
     * An array that lists specific character sequences (keywords), one of which must precede and be within proximity (maximumMatchDistance) of the regular expression to match. Keywords aren't case sensitive.
     */
    keywords?: __listOf__string;
    /**
     * The maximum number of characters that can exist between the end of at least one complete character sequence specified by the keywords array and the end of the text that matches the regex pattern. If a complete keyword precedes all the text that matches the pattern and the keyword is within the specified distance, Amazon Macie includes the result. Otherwise, Macie excludes the result.
     */
    maximumMatchDistance?: __integer;
    /**
     * The custom name of the custom data identifier.
     */
    name?: __string;
    /**
     * The regular expression (regex) that defines the pattern to match.
     */
    regex?: __string;
    /**
     * Specifies the severity that's assigned to findings that the custom data identifier produces, based on the number of occurrences of text that match the custom data identifier's detection criteria. By default, Amazon Macie creates findings for S3 objects that contain at least one occurrence of text that matches the detection criteria, and Macie assigns the MEDIUM severity to those findings.
     */
    severityLevels?: SeverityLevelList;
    /**
     * A map of key-value pairs that identifies the tags (keys and values) that are associated with the custom data identifier.
     */
    tags?: TagMap;
  }
  export interface GetFindingStatisticsRequest {
    /**
     * The criteria to use to filter the query results.
     */
    findingCriteria?: FindingCriteria;
    /**
     * The finding property to use to group the query results. Valid values are: classificationDetails.jobId - The unique identifier for the classification job that produced the finding. resourcesAffected.s3Bucket.name - The name of the S3 bucket that the finding applies to. severity.description - The severity level of the finding, such as High or Medium. type - The type of finding, such as Policy:IAMUser/S3BucketPublic and SensitiveData:S3Object/Personal.
     */
    groupBy: GroupBy;
    /**
     * The maximum number of items to include in each page of the response.
     */
    size?: __integer;
    /**
     * The criteria to use to sort the query results.
     */
    sortCriteria?: FindingStatisticsSortCriteria;
  }
  export interface GetFindingStatisticsResponse {
    /**
     * An array of objects, one for each group of findings that matches the filter criteria specified in the request.
     */
    countsByGroup?: __listOfGroupCount;
  }
  export interface GetFindingsFilterRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
  }
  export interface GetFindingsFilterResponse {
    /**
     * The action that's performed on findings that match the filter criteria (findingCriteria). Possible values are: ARCHIVE, suppress (automatically archive) the findings; and, NOOP, don't perform any action on the findings.
     */
    action?: FindingsFilterAction;
    /**
     * The Amazon Resource Name (ARN) of the filter.
     */
    arn?: __string;
    /**
     * The custom description of the filter.
     */
    description?: __string;
    /**
     * The criteria that's used to filter findings.
     */
    findingCriteria?: FindingCriteria;
    /**
     * The unique identifier for the filter.
     */
    id?: __string;
    /**
     * The custom name of the filter.
     */
    name?: __string;
    /**
     * The position of the filter in the list of saved filters on the Amazon Macie console. This value also determines the order in which the filter is applied to findings, relative to other filters that are also applied to the findings.
     */
    position?: __integer;
    /**
     * A map of key-value pairs that specifies which tags (keys and values) are associated with the filter.
     */
    tags?: TagMap;
  }
  export interface GetFindingsPublicationConfigurationRequest {
  }
  export interface GetFindingsPublicationConfigurationResponse {
    /**
     * The configuration settings that determine which findings are published to Security Hub.
     */
    securityHubConfiguration?: SecurityHubConfiguration;
  }
  export interface GetFindingsRequest {
    /**
     * An array of strings that lists the unique identifiers for the findings to retrieve. You can specify as many as 50 unique identifiers in this array.
     */
    findingIds: __listOf__string;
    /**
     * The criteria for sorting the results of the request.
     */
    sortCriteria?: SortCriteria;
  }
  export interface GetFindingsResponse {
    /**
     * An array of objects, one for each finding that matches the criteria specified in the request.
     */
    findings?: __listOfFinding;
  }
  export interface GetInvitationsCountRequest {
  }
  export interface GetInvitationsCountResponse {
    /**
     * The total number of invitations that were received by the account, not including the currently accepted invitation.
     */
    invitationsCount?: __long;
  }
  export interface GetMacieSessionRequest {
  }
  export interface GetMacieSessionResponse {
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the Amazon Macie account was created.
     */
    createdAt?: __timestampIso8601;
    /**
     * The frequency with which Amazon Macie publishes updates to policy findings for the account. This includes publishing updates to Security Hub and Amazon EventBridge (formerly Amazon CloudWatch Events).
     */
    findingPublishingFrequency?: FindingPublishingFrequency;
    /**
     * The Amazon Resource Name (ARN) of the service-linked role that allows Amazon Macie to monitor and analyze data in Amazon Web Services resources for the account.
     */
    serviceRole?: __string;
    /**
     * The current status of the Amazon Macie account. Possible values are: PAUSED, the account is enabled but all Macie activities are suspended (paused) for the account; and, ENABLED, the account is enabled and all Macie activities are enabled for the account.
     */
    status?: MacieStatus;
    /**
     * The date and time, in UTC and extended ISO 8601 format, of the most recent change to the status of the Amazon Macie account.
     */
    updatedAt?: __timestampIso8601;
  }
  export interface GetMasterAccountRequest {
  }
  export interface GetMasterAccountResponse {
    /**
     * (Deprecated) The Amazon Web Services account ID for the administrator account. If the accounts are associated by a Macie membership invitation, this object also provides details about the invitation that was sent to establish the relationship between the accounts.
     */
    master?: Invitation;
  }
  export interface GetMemberRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
  }
  export interface GetMemberResponse {
    /**
     * The Amazon Web Services account ID for the account.
     */
    accountId?: __string;
    /**
     * The Amazon Web Services account ID for the administrator account.
     */
    administratorAccountId?: __string;
    /**
     * The Amazon Resource Name (ARN) of the account.
     */
    arn?: __string;
    /**
     * The email address for the account. This value is null if the account is associated with the administrator account through Organizations.
     */
    email?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when an Amazon Macie membership invitation was last sent to the account. This value is null if a Macie membership invitation hasn't been sent to the account.
     */
    invitedAt?: __timestampIso8601;
    /**
     * (Deprecated) The Amazon Web Services account ID for the administrator account. This property has been replaced by the administratorAccountId property and is retained only for backward compatibility.
     */
    masterAccountId?: __string;
    /**
     * The current status of the relationship between the account and the administrator account.
     */
    relationshipStatus?: RelationshipStatus;
    /**
     * A map of key-value pairs that specifies which tags (keys and values) are associated with the account in Amazon Macie.
     */
    tags?: TagMap;
    /**
     * The date and time, in UTC and extended ISO 8601 format, of the most recent change to the status of the relationship between the account and the administrator account.
     */
    updatedAt?: __timestampIso8601;
  }
  export interface GetResourceProfileRequest {
    /**
     * The Amazon Resource Name (ARN) of the S3 bucket that the request applies to.
     */
    resourceArn: __string;
  }
  export interface GetResourceProfileResponse {
    /**
     * The date and time, in UTC and extended ISO 8601 format, when Amazon Macie most recently recalculated sensitive data discovery statistics and details for the bucket. If the bucket's sensitivity score is calculated automatically, this includes the score.
     */
    profileUpdatedAt?: __timestampIso8601;
    /**
     * The current sensitivity score for the bucket, ranging from -1 (classification error) to 100 (sensitive). By default, this score is calculated automatically based on the amount of data that Amazon Macie has analyzed in the bucket and the amount of sensitive data that Macie has found in the bucket.
     */
    sensitivityScore?: __integer;
    /**
     * Specifies whether the bucket's current sensitivity score was set manually. If this value is true, the score was manually changed to 100. If this value is false, the score was calculated automatically by Amazon Macie.
     */
    sensitivityScoreOverridden?: __boolean;
    /**
     * The sensitive data discovery statistics for the bucket. The statistics capture the results of automated sensitive data discovery activities that Amazon Macie has performed for the bucket.
     */
    statistics?: ResourceStatistics;
  }
  export interface GetRevealConfigurationRequest {
  }
  export interface GetRevealConfigurationResponse {
    /**
     * The current configuration settings and the status of the configuration for the account.
     */
    configuration?: RevealConfiguration;
  }
  export interface GetSensitiveDataOccurrencesAvailabilityRequest {
    /**
     * The unique identifier for the finding.
     */
    findingId: __string;
  }
  export interface GetSensitiveDataOccurrencesAvailabilityResponse {
    /**
     * Specifies whether occurrences of sensitive data can be retrieved for the finding. Possible values are: AVAILABLE, the sensitive data can be retrieved; and, UNAVAILABLE, the sensitive data can't be retrieved. If this value is UNAVAILABLE, the reasons array indicates why the data can't be retrieved.
     */
    code?: AvailabilityCode;
    /**
     * Specifies why occurrences of sensitive data can't be retrieved for the finding. Possible values are: INVALID_CLASSIFICATION_RESULT - Amazon Macie can't verify the location of the sensitive data to retrieve. There isn't a corresponding sensitive data discovery result for the finding. Or the sensitive data discovery result specified by the classificationDetails.detailedResultsLocation field of the finding isn't available, is malformed or corrupted, or uses an unsupported storage format. OBJECT_EXCEEDS_SIZE_QUOTA - The storage size of the affected S3 object exceeds the size quota for retrieving occurrences of sensitive data. OBJECT_UNAVAILABLE - The affected S3 object isn't available. The object might have been renamed, moved, or deleted. Or the object was changed after Macie created the finding. UNSUPPORTED_FINDING_TYPE - The specified finding isn't a sensitive data finding. UNSUPPORTED_OBJECT_TYPE - The affected S3 object uses a file or storage format that Macie doesn't support for retrieving occurrences of sensitive data. This value is null if sensitive data can be retrieved for the finding.
     */
    reasons?: __listOfUnavailabilityReasonCode;
  }
  export interface GetSensitiveDataOccurrencesRequest {
    /**
     * The unique identifier for the finding.
     */
    findingId: __string;
  }
  export interface GetSensitiveDataOccurrencesResponse {
    /**
     * If an error occurred when Amazon Macie attempted to retrieve occurrences of sensitive data reported by the finding, a description of the error that occurred. This value is null if the status (status) of the request is PROCESSING or SUCCESS.
     */
    error?: __string;
    /**
     * A map that specifies 1-100 types of sensitive data reported by the finding and, for each type, 1-10 occurrences of sensitive data.
     */
    sensitiveDataOccurrences?: SensitiveDataOccurrences;
    /**
     * The status of the request to retrieve occurrences of sensitive data reported by the finding. Possible values are: ERROR - An error occurred when Amazon Macie attempted to locate, retrieve, or encrypt the sensitive data. The error value indicates the nature of the error that occurred. PROCESSING - Macie is processing the request. SUCCESS - Macie successfully located, retrieved, and encrypted the sensitive data.
     */
    status?: RevealRequestStatus;
  }
  export interface GetSensitivityInspectionTemplateRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
  }
  export interface GetSensitivityInspectionTemplateResponse {
    /**
     * The custom description of the template.
     */
    description?: __string;
    /**
     *  The managed data identifiers that are explicitly excluded (not used) when analyzing data.
     */
    excludes?: SensitivityInspectionTemplateExcludes;
    /**
     * The allow lists, custom data identifiers, and managed data identifiers that are included (used) when analyzing data.
     */
    includes?: SensitivityInspectionTemplateIncludes;
    /**
     * The name of the template: automated-sensitive-data-discovery.
     */
    name?: __string;
    /**
     * The unique identifier for the template.
     */
    sensitivityInspectionTemplateId?: SensitivityInspectionTemplateId;
  }
  export interface GetUsageStatisticsRequest {
    /**
     * An array of objects, one for each condition to use to filter the query results. If you specify more than one condition, Amazon Macie uses an AND operator to join the conditions.
     */
    filterBy?: __listOfUsageStatisticsFilter;
    /**
     * The maximum number of items to include in each page of the response.
     */
    maxResults?: __integer;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
    /**
     * The criteria to use to sort the query results.
     */
    sortBy?: UsageStatisticsSortBy;
    /**
     * The inclusive time period to query usage data for. Valid values are: MONTH_TO_DATE, for the current calendar month to date; and, PAST_30_DAYS, for the preceding 30 days. If you don't specify a value, Amazon Macie provides usage data for the preceding 30 days.
     */
    timeRange?: TimeRange;
  }
  export interface GetUsageStatisticsResponse {
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
    /**
     * An array of objects that contains the results of the query. Each object contains the data for an account that matches the filter criteria specified in the request.
     */
    records?: __listOfUsageRecord;
    /**
     * The inclusive time period that the usage data applies to. Possible values are: MONTH_TO_DATE, for the current calendar month to date; and, PAST_30_DAYS, for the preceding 30 days.
     */
    timeRange?: TimeRange;
  }
  export interface GetUsageTotalsRequest {
    /**
     * The inclusive time period to retrieve the data for. Valid values are: MONTH_TO_DATE, for the current calendar month to date; and, PAST_30_DAYS, for the preceding 30 days. If you don't specify a value for this parameter, Amazon Macie provides aggregated usage data for the preceding 30 days.
     */
    timeRange?: __string;
  }
  export interface GetUsageTotalsResponse {
    /**
     * The inclusive time period that the usage data applies to. Possible values are: MONTH_TO_DATE, for the current calendar month to date; and, PAST_30_DAYS, for the preceding 30 days.
     */
    timeRange?: TimeRange;
    /**
     * An array of objects that contains the results of the query. Each object contains the data for a specific usage metric.
     */
    usageTotals?: __listOfUsageTotal;
  }
  export type GroupBy = "resourcesAffected.s3Bucket.name"|"type"|"classificationDetails.jobId"|"severity.description"|string;
  export interface GroupCount {
    /**
     * The total number of findings in the group of query results.
     */
    count?: __long;
    /**
     * The name of the property that defines the group in the query results, as specified by the groupBy property in the query request.
     */
    groupKey?: __string;
  }
  export interface IamUser {
    /**
     * The unique identifier for the Amazon Web Services account that's associated with the IAM user who performed the action.
     */
    accountId?: __string;
    /**
     * The Amazon Resource Name (ARN) of the principal that performed the action. The last section of the ARN contains the name of the user who performed the action.
     */
    arn?: __string;
    /**
     * The unique identifier for the IAM user who performed the action.
     */
    principalId?: __string;
    /**
     * The username of the IAM user who performed the action.
     */
    userName?: __string;
  }
  export interface Invitation {
    /**
     * The Amazon Web Services account ID for the account that sent the invitation.
     */
    accountId?: __string;
    /**
     * The unique identifier for the invitation.
     */
    invitationId?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the invitation was sent.
     */
    invitedAt?: __timestampIso8601;
    /**
     * The status of the relationship between the account that sent the invitation and the account that received the invitation.
     */
    relationshipStatus?: RelationshipStatus;
  }
  export interface IpAddressDetails {
    /**
     * The Internet Protocol version 4 (IPv4) address of the device.
     */
    ipAddressV4?: __string;
    /**
     * The city that the IP address originated from.
     */
    ipCity?: IpCity;
    /**
     * The country that the IP address originated from.
     */
    ipCountry?: IpCountry;
    /**
     * The geographic coordinates of the location that the IP address originated from.
     */
    ipGeoLocation?: IpGeoLocation;
    /**
     * The registered owner of the IP address.
     */
    ipOwner?: IpOwner;
  }
  export interface IpCity {
    /**
     * The name of the city.
     */
    name?: __string;
  }
  export interface IpCountry {
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country that the IP address originated from. For example, US for the United States.
     */
    code?: __string;
    /**
     * The name of the country that the IP address originated from.
     */
    name?: __string;
  }
  export interface IpGeoLocation {
    /**
     * The latitude coordinate of the location, rounded to four decimal places.
     */
    lat?: __double;
    /**
     * The longitude coordinate of the location, rounded to four decimal places.
     */
    lon?: __double;
  }
  export interface IpOwner {
    /**
     * The autonomous system number (ASN) for the autonomous system that included the IP address.
     */
    asn?: __string;
    /**
     * The organization identifier that's associated with the autonomous system number (ASN) for the autonomous system that included the IP address.
     */
    asnOrg?: __string;
    /**
     * The name of the internet service provider (ISP) that owned the IP address.
     */
    isp?: __string;
    /**
     * The name of the organization that owned the IP address.
     */
    org?: __string;
  }
  export type IsDefinedInJob = "TRUE"|"FALSE"|"UNKNOWN"|string;
  export type IsMonitoredByJob = "TRUE"|"FALSE"|"UNKNOWN"|string;
  export type JobComparator = "EQ"|"GT"|"GTE"|"LT"|"LTE"|"NE"|"CONTAINS"|"STARTS_WITH"|string;
  export interface JobDetails {
    /**
     * Specifies whether any one-time or recurring jobs are configured to analyze data in the bucket. Possible values are: TRUE - The bucket is explicitly included in the bucket definition (S3BucketDefinitionForJob) for one or more jobs and at least one of those jobs has a status other than CANCELLED. Or the bucket matched the bucket criteria (S3BucketCriteriaForJob) for at least one job that previously ran. FALSE - The bucket isn't explicitly included in the bucket definition (S3BucketDefinitionForJob) for any jobs, all the jobs that explicitly include the bucket in their bucket definitions have a status of CANCELLED, or the bucket didn't match the bucket criteria (S3BucketCriteriaForJob) for any jobs that previously ran. UNKNOWN - An exception occurred when Amazon Macie attempted to retrieve job data for the bucket.
     */
    isDefinedInJob?: IsDefinedInJob;
    /**
     * Specifies whether any recurring jobs are configured to analyze data in the bucket. Possible values are: TRUE - The bucket is explicitly included in the bucket definition (S3BucketDefinitionForJob) for one or more recurring jobs or the bucket matches the bucket criteria (S3BucketCriteriaForJob) for one or more recurring jobs. At least one of those jobs has a status other than CANCELLED. FALSE - The bucket isn't explicitly included in the bucket definition (S3BucketDefinitionForJob) for any recurring jobs, the bucket doesn't match the bucket criteria (S3BucketCriteriaForJob) for any recurring jobs, or all the recurring jobs that are configured to analyze data in the bucket have a status of CANCELLED. UNKNOWN - An exception occurred when Amazon Macie attempted to retrieve job data for the bucket.
     */
    isMonitoredByJob?: IsMonitoredByJob;
    /**
     * The unique identifier for the job that ran most recently and is configured to analyze data in the bucket, either the latest run of a recurring job or the only run of a one-time job. This value is typically null if the value for the isDefinedInJob property is FALSE or UNKNOWN.
     */
    lastJobId?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the job (lastJobId) started. If the job is a recurring job, this value indicates when the most recent run started. This value is typically null if the value for the isDefinedInJob property is FALSE or UNKNOWN.
     */
    lastJobRunTime?: __timestampIso8601;
  }
  export interface JobScheduleFrequency {
    /**
     * Specifies a daily recurrence pattern for running the job.
     */
    dailySchedule?: DailySchedule;
    /**
     * Specifies a monthly recurrence pattern for running the job.
     */
    monthlySchedule?: MonthlySchedule;
    /**
     * Specifies a weekly recurrence pattern for running the job.
     */
    weeklySchedule?: WeeklySchedule;
  }
  export interface JobScopeTerm {
    /**
     * A property-based condition that defines a property, operator, and one or more values for including or excluding objects from the job.
     */
    simpleScopeTerm?: SimpleScopeTerm;
    /**
     * A tag-based condition that defines the operator and tag keys or tag key and value pairs for including or excluding objects from the job.
     */
    tagScopeTerm?: TagScopeTerm;
  }
  export interface JobScopingBlock {
    /**
     * An array of conditions, one for each property- or tag-based condition that determines which objects to include or exclude from the job. If you specify more than one condition, Amazon Macie uses AND logic to join the conditions.
     */
    and?: __listOfJobScopeTerm;
  }
  export type JobStatus = "RUNNING"|"PAUSED"|"CANCELLED"|"COMPLETE"|"IDLE"|"USER_PAUSED"|string;
  export interface JobSummary {
    /**
     * The property- and tag-based conditions that determine which S3 buckets are included or excluded from the job's analysis. Each time the job runs, the job uses these criteria to determine which buckets to analyze. A job's definition can contain a bucketCriteria object or a bucketDefinitions array, not both.
     */
    bucketCriteria?: S3BucketCriteriaForJob;
    /**
     * An array of objects, one for each Amazon Web Services account that owns specific S3 buckets for the job to analyze. Each object specifies the account ID for an account and one or more buckets to analyze for that account. A job's definition can contain a bucketDefinitions array or a bucketCriteria object, not both.
     */
    bucketDefinitions?: __listOfS3BucketDefinitionForJob;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the job was created.
     */
    createdAt?: __timestampIso8601;
    /**
     * The unique identifier for the job.
     */
    jobId?: __string;
    /**
     * The current status of the job. Possible values are: CANCELLED - You cancelled the job or, if it's a one-time job, you paused the job and didn't resume it within 30 days. COMPLETE - For a one-time job, Amazon Macie finished processing the data specified for the job. This value doesn't apply to recurring jobs. IDLE - For a recurring job, the previous scheduled run is complete and the next scheduled run is pending. This value doesn't apply to one-time jobs. PAUSED - Macie started running the job but additional processing would exceed the monthly sensitive data discovery quota for your account or one or more member accounts that the job analyzes data for. RUNNING - For a one-time job, the job is in progress. For a recurring job, a scheduled run is in progress. USER_PAUSED - You paused the job. If you paused the job while it had a status of RUNNING and you don't resume it within 30 days of pausing it, the job or job run will expire and be cancelled, depending on the job's type. To check the expiration date, refer to the UserPausedDetails.jobExpiresAt property.
     */
    jobStatus?: JobStatus;
    /**
     * The schedule for running the job. Possible values are: ONE_TIME - The job runs only once. SCHEDULED - The job runs on a daily, weekly, or monthly basis.
     */
    jobType?: JobType;
    /**
     * Specifies whether any account- or bucket-level access errors occurred when the job ran. For a recurring job, this value indicates the error status of the job's most recent run.
     */
    lastRunErrorStatus?: LastRunErrorStatus;
    /**
     * The custom name of the job.
     */
    name?: __string;
    /**
     * If the current status of the job is USER_PAUSED, specifies when the job was paused and when the job or job run will expire and be cancelled if it isn't resumed. This value is present only if the value for jobStatus is USER_PAUSED.
     */
    userPausedDetails?: UserPausedDetails;
  }
  export type JobType = "ONE_TIME"|"SCHEDULED"|string;
  export interface KeyValuePair {
    /**
     * One part of a key-value pair that comprises a tag. A tag key is a general label that acts as a category for more specific tag values.
     */
    key?: __string;
    /**
     * One part of a key-value pair that comprises a tag. A tag value acts as a descriptor for a tag key. A tag value can be an empty string.
     */
    value?: __string;
  }
  export type KeyValuePairList = KeyValuePair[];
  export interface LastRunErrorStatus {
    /**
     * Specifies whether any account- or bucket-level access errors occurred when the job ran. For a recurring job, this value indicates the error status of the job's most recent run. Possible values are: ERROR - One or more errors occurred. Amazon Macie didn't process all the data specified for the job. NONE - No errors occurred. Macie processed all the data specified for the job.
     */
    code?: LastRunErrorStatusCode;
  }
  export type LastRunErrorStatusCode = "NONE"|"ERROR"|string;
  export interface ListAllowListsRequest {
    /**
     * The maximum number of items to include in each page of a paginated response.
     */
    maxResults?: MaxResults;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
  }
  export interface ListAllowListsResponse {
    /**
     * An array of objects, one for each allow list.
     */
    allowLists?: __listOfAllowListSummary;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface ListClassificationJobsRequest {
    /**
     * The criteria to use to filter the results.
     */
    filterCriteria?: ListJobsFilterCriteria;
    /**
     * The maximum number of items to include in each page of the response.
     */
    maxResults?: __integer;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
    /**
     * The criteria to use to sort the results.
     */
    sortCriteria?: ListJobsSortCriteria;
  }
  export interface ListClassificationJobsResponse {
    /**
     * An array of objects, one for each job that matches the filter criteria specified in the request.
     */
    items?: __listOfJobSummary;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface ListClassificationScopesRequest {
    /**
     * The name of the classification scope to retrieve the unique identifier for.
     */
    name?: __string;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
  }
  export interface ListClassificationScopesResponse {
    /**
     * An array that specifies the unique identifier and name of the classification scope for the account.
     */
    classificationScopes?: __listOfClassificationScopeSummary;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: NextToken;
  }
  export interface ListCustomDataIdentifiersRequest {
    /**
     * The maximum number of items to include in each page of the response.
     */
    maxResults?: __integer;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
  }
  export interface ListCustomDataIdentifiersResponse {
    /**
     * An array of objects, one for each custom data identifier.
     */
    items?: __listOfCustomDataIdentifierSummary;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface ListFindingsFiltersRequest {
    /**
     * The maximum number of items to include in each page of a paginated response.
     */
    maxResults?: MaxResults;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
  }
  export interface ListFindingsFiltersResponse {
    /**
     * An array of objects, one for each filter that's associated with the account.
     */
    findingsFilterListItems?: __listOfFindingsFilterListItem;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface ListFindingsRequest {
    /**
     * The criteria to use to filter the results.
     */
    findingCriteria?: FindingCriteria;
    /**
     * The maximum number of items to include in each page of the response.
     */
    maxResults?: __integer;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
    /**
     * The criteria to use to sort the results.
     */
    sortCriteria?: SortCriteria;
  }
  export interface ListFindingsResponse {
    /**
     * An array of strings, where each string is the unique identifier for a finding that matches the filter criteria specified in the request.
     */
    findingIds?: __listOf__string;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface ListInvitationsRequest {
    /**
     * The maximum number of items to include in each page of a paginated response.
     */
    maxResults?: MaxResults;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
  }
  export interface ListInvitationsResponse {
    /**
     * An array of objects, one for each invitation that was received by the account.
     */
    invitations?: __listOfInvitation;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface ListJobsFilterCriteria {
    /**
     * An array of objects, one for each condition that determines which jobs to exclude from the results.
     */
    excludes?: __listOfListJobsFilterTerm;
    /**
     * An array of objects, one for each condition that determines which jobs to include in the results.
     */
    includes?: __listOfListJobsFilterTerm;
  }
  export type ListJobsFilterKey = "jobType"|"jobStatus"|"createdAt"|"name"|string;
  export interface ListJobsFilterTerm {
    /**
     * The operator to use to filter the results.
     */
    comparator?: JobComparator;
    /**
     * The property to use to filter the results.
     */
    key?: ListJobsFilterKey;
    /**
     * An array that lists one or more values to use to filter the results.
     */
    values?: __listOf__string;
  }
  export type ListJobsSortAttributeName = "createdAt"|"jobStatus"|"name"|"jobType"|string;
  export interface ListJobsSortCriteria {
    /**
     * The property to sort the results by.
     */
    attributeName?: ListJobsSortAttributeName;
    /**
     * The sort order to apply to the results, based on the value for the property specified by the attributeName property. Valid values are: ASC, sort the results in ascending order; and, DESC, sort the results in descending order.
     */
    orderBy?: OrderBy;
  }
  export interface ListManagedDataIdentifiersRequest {
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
  }
  export interface ListManagedDataIdentifiersResponse {
    /**
     * An array of objects, one for each managed data identifier.
     */
    items?: __listOfManagedDataIdentifierSummary;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface ListMembersRequest {
    /**
     * The maximum number of items to include in each page of a paginated response.
     */
    maxResults?: MaxResults;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
    /**
     * Specifies which accounts to include in the response, based on the status of an account's relationship with the administrator account. By default, the response includes only current member accounts. To include all accounts, set this value to false.
     */
    onlyAssociated?: __string;
  }
  export interface ListMembersResponse {
    /**
     * An array of objects, one for each account that's associated with the administrator account and matches the criteria specified in the request.
     */
    members?: __listOfMember;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface ListOrganizationAdminAccountsRequest {
    /**
     * The maximum number of items to include in each page of a paginated response.
     */
    maxResults?: MaxResults;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
  }
  export interface ListOrganizationAdminAccountsResponse {
    /**
     * An array of objects, one for each delegated Amazon Macie administrator account for the organization. Only one of these accounts can have a status of ENABLED.
     */
    adminAccounts?: __listOfAdminAccount;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface ListResourceProfileArtifactsRequest {
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
    /**
     * The Amazon Resource Name (ARN) of the S3 bucket that the request applies to.
     */
    resourceArn: __string;
  }
  export interface ListResourceProfileArtifactsResponse {
    /**
     * An array of objects, one for each of 1-100 S3 objects that Amazon Macie selected for analysis. If Macie has analyzed more than 100 objects in the bucket, Macie populates the array based on the value for the ResourceProfileArtifact.sensitive field for an object: true (sensitive), followed by false (not sensitive). Macie then populates any remaining items in the array with information about objects where the value for the ResourceProfileArtifact.classificationResultStatus field is SKIPPED.
     */
    artifacts?: __listOfResourceProfileArtifact;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface ListResourceProfileDetectionsRequest {
    /**
     * The maximum number of items to include in each page of a paginated response.
     */
    maxResults?: MaxResults;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
    /**
     * The Amazon Resource Name (ARN) of the S3 bucket that the request applies to.
     */
    resourceArn: __string;
  }
  export interface ListResourceProfileDetectionsResponse {
    /**
     * An array of objects, one for each type of sensitive data that Amazon Macie found in the bucket. Each object reports the number of occurrences of the specified type and provides information about the custom data identifier or managed data identifier that detected the data.
     */
    detections?: __listOfDetection;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface ListSensitivityInspectionTemplatesRequest {
    /**
     * The maximum number of items to include in each page of a paginated response.
     */
    maxResults?: MaxResults;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
  }
  export interface ListSensitivityInspectionTemplatesResponse {
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
    /**
     * An array that specifies the unique identifier and name of the sensitivity inspection template for the account.
     */
    sensitivityInspectionTemplates?: __listOfSensitivityInspectionTemplatesEntry;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: __string;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A map of key-value pairs that specifies which tags (keys and values) are associated with the resource.
     */
    tags?: TagMap;
  }
  export type MacieStatus = "PAUSED"|"ENABLED"|string;
  export type ManagedDataIdentifierSelector = "ALL"|"EXCLUDE"|"INCLUDE"|"NONE"|"RECOMMENDED"|string;
  export interface ManagedDataIdentifierSummary {
    /**
     * The category of sensitive data that the managed data identifier detects: CREDENTIALS, for credentials data such as private keys or Amazon Web Services secret access keys; FINANCIAL_INFORMATION, for financial data such as credit card numbers; or, PERSONAL_INFORMATION, for personal health information, such as health insurance identification numbers, or personally identifiable information, such as passport numbers.
     */
    category?: SensitiveDataItemCategory;
    /**
     * The unique identifier for the managed data identifier. This is a string that describes the type of sensitive data that the managed data identifier detects. For example: OPENSSH_PRIVATE_KEY for OpenSSH private keys, CREDIT_CARD_NUMBER for credit card numbers, or USA_PASSPORT_NUMBER for US passport numbers.
     */
    id?: __string;
  }
  export interface MatchingBucket {
    /**
     * The unique identifier for the Amazon Web Services account that owns the bucket.
     */
    accountId?: __string;
    /**
     * The name of the bucket.
     */
    bucketName?: __string;
    /**
     * The total number of objects that Amazon Macie can analyze in the bucket. These objects use a supported storage class and have a file name extension for a supported file or storage format.
     */
    classifiableObjectCount?: __long;
    /**
     * The total storage size, in bytes, of the objects that Amazon Macie can analyze in the bucket. These objects use a supported storage class and have a file name extension for a supported file or storage format. If versioning is enabled for the bucket, Macie calculates this value based on the size of the latest version of each applicable object in the bucket. This value doesn't reflect the storage size of all versions of each applicable object in the bucket.
     */
    classifiableSizeInBytes?: __long;
    /**
     * The error code for an error that prevented Amazon Macie from retrieving and processing information about the bucket and the bucket's objects. If this value is ACCESS_DENIED, Macie doesn't have permission to retrieve the information. For example, the bucket has a restrictive bucket policy and Amazon S3 denied the request. If this value is null, Macie was able to retrieve and process the information.
     */
    errorCode?: BucketMetadataErrorCode;
    /**
     * A brief description of the error (errorCode) that prevented Amazon Macie from retrieving and processing information about the bucket and the bucket's objects. This value is null if Macie was able to retrieve and process the information.
     */
    errorMessage?: __string;
    /**
     * Specifies whether any one-time or recurring classification jobs are configured to analyze objects in the bucket, and, if so, the details of the job that ran most recently.
     */
    jobDetails?: JobDetails;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when Amazon Macie most recently analyzed data in the bucket while performing automated sensitive data discovery for your account. This value is null if automated sensitive data discovery is currently disabled for your account.
     */
    lastAutomatedDiscoveryTime?: __timestampIso8601;
    /**
     * The total number of objects in the bucket.
     */
    objectCount?: __long;
    /**
     * The total number of objects in the bucket, grouped by server-side encryption type. This includes a grouping that reports the total number of objects that aren't encrypted or use client-side encryption.
     */
    objectCountByEncryptionType?: ObjectCountByEncryptionType;
    /**
     * The current sensitivity score for the bucket, ranging from -1 (classification error) to 100 (sensitive). This value is null if automated sensitive data discovery is currently disabled for your account.
     */
    sensitivityScore?: __integer;
    /**
     * The total storage size, in bytes, of the bucket. If versioning is enabled for the bucket, Amazon Macie calculates this value based on the size of the latest version of each object in the bucket. This value doesn't reflect the storage size of all versions of each object in the bucket.
     */
    sizeInBytes?: __long;
    /**
     * The total storage size, in bytes, of the objects that are compressed (.gz, .gzip, .zip) files in the bucket. If versioning is enabled for the bucket, Amazon Macie calculates this value based on the size of the latest version of each applicable object in the bucket. This value doesn't reflect the storage size of all versions of each applicable object in the bucket.
     */
    sizeInBytesCompressed?: __long;
    /**
     * The total number of objects that Amazon Macie can't analyze in the bucket. These objects don't use a supported storage class or don't have a file name extension for a supported file or storage format.
     */
    unclassifiableObjectCount?: ObjectLevelStatistics;
    /**
     * The total storage size, in bytes, of the objects that Amazon Macie can't analyze in the bucket. These objects don't use a supported storage class or don't have a file name extension for a supported file or storage format.
     */
    unclassifiableObjectSizeInBytes?: ObjectLevelStatistics;
  }
  export interface MatchingResource {
    /**
     * The details of an S3 bucket that Amazon Macie monitors and analyzes.
     */
    matchingBucket?: MatchingBucket;
  }
  export type MaxResults = number;
  export interface Member {
    /**
     * The Amazon Web Services account ID for the account.
     */
    accountId?: __string;
    /**
     * The Amazon Web Services account ID for the administrator account.
     */
    administratorAccountId?: __string;
    /**
     * The Amazon Resource Name (ARN) of the account.
     */
    arn?: __string;
    /**
     * The email address for the account. This value is null if the account is associated with the administrator account through Organizations.
     */
    email?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when an Amazon Macie membership invitation was last sent to the account. This value is null if a Macie membership invitation hasn't been sent to the account.
     */
    invitedAt?: __timestampIso8601;
    /**
     * (Deprecated) The Amazon Web Services account ID for the administrator account. This property has been replaced by the administratorAccountId property and is retained only for backward compatibility.
     */
    masterAccountId?: __string;
    /**
     * The current status of the relationship between the account and the administrator account.
     */
    relationshipStatus?: RelationshipStatus;
    /**
     * A map of key-value pairs that specifies which tags (keys and values) are associated with the account in Amazon Macie.
     */
    tags?: TagMap;
    /**
     * The date and time, in UTC and extended ISO 8601 format, of the most recent change to the status of the relationship between the account and the administrator account.
     */
    updatedAt?: __timestampIso8601;
  }
  export interface MonthlySchedule {
    /**
     * The numeric day of the month when Amazon Macie runs the job. This value can be an integer from 1 through 31. If this value exceeds the number of days in a certain month, Macie doesn't run the job that month. Macie runs the job only during months that have the specified day. For example, if this value is 31 and a month has only 30 days, Macie doesn't run the job that month. To run the job every month, specify a value that's less than 29.
     */
    dayOfMonth?: __integer;
  }
  export type NextToken = string;
  export interface ObjectCountByEncryptionType {
    /**
     * The total number of objects that are encrypted with a customer-provided key. The objects use customer-provided server-side encryption (SSE-C).
     */
    customerManaged?: __long;
    /**
     * The total number of objects that are encrypted with an KMS key, either an Amazon Web Services managed key or a customer managed key. The objects use KMS encryption (SSE-KMS).
     */
    kmsManaged?: __long;
    /**
     * The total number of objects that are encrypted with an Amazon S3 managed key. The objects use Amazon S3 managed encryption (SSE-S3).
     */
    s3Managed?: __long;
    /**
     * The total number of objects that use client-side encryption or aren't encrypted.
     */
    unencrypted?: __long;
    /**
     * The total number of objects that Amazon Macie doesn't have current encryption metadata for. Macie can't provide current data about the encryption settings for these objects.
     */
    unknown?: __long;
  }
  export interface ObjectLevelStatistics {
    /**
     * The total storage size (in bytes) or number of objects that Amazon Macie can't analyze because the objects don't have a file name extension for a supported file or storage format.
     */
    fileType?: __long;
    /**
     * The total storage size (in bytes) or number of objects that Amazon Macie can't analyze because the objects use an unsupported storage class.
     */
    storageClass?: __long;
    /**
     * The total storage size (in bytes) or number of objects that Amazon Macie can't analyze because the objects use an unsupported storage class or don't have a file name extension for a supported file or storage format.
     */
    total?: __long;
  }
  export interface Occurrences {
    /**
     * An array of objects, one for each occurrence of sensitive data in a Microsoft Excel workbook, CSV file, or TSV file. This value is null for all other types of files. Each Cell object specifies a cell or field that contains the sensitive data.
     */
    cells?: Cells;
    /**
     * An array of objects, one for each occurrence of sensitive data in an email message or a non-binary text file such as an HTML, TXT, or XML file. Each Range object specifies a line or inclusive range of lines that contains the sensitive data, and the position of the data on the specified line or lines. This value is often null for file types that are supported by Cell, Page, or Record objects. Exceptions are the location of sensitive data in: unstructured sections of an otherwise structured file, such as a comment in a file; a malformed file that Amazon Macie analyzes as plain text; and, a CSV or TSV file that has any column names that contain sensitive data.
     */
    lineRanges?: Ranges;
    /**
     *  Reserved for future use.
     */
    offsetRanges?: Ranges;
    /**
     * An array of objects, one for each occurrence of sensitive data in an Adobe Portable Document Format file. This value is null for all other types of files. Each Page object specifies a page that contains the sensitive data.
     */
    pages?: Pages;
    /**
     * An array of objects, one for each occurrence of sensitive data in an Apache Avro object container, Apache Parquet file, JSON file, or JSON Lines file. This value is null for all other types of files. For an Avro object container or Parquet file, each Record object specifies a record index and the path to a field in a record that contains the sensitive data. For a JSON or JSON Lines file, each Record object specifies the path to a field or array that contains the sensitive data. For a JSON Lines file, it also specifies the index of the line that contains the data.
     */
    records?: Records;
  }
  export type OrderBy = "ASC"|"DESC"|string;
  export type OriginType = "SENSITIVE_DATA_DISCOVERY_JOB"|"AUTOMATED_SENSITIVE_DATA_DISCOVERY"|string;
  export interface Page {
    /**
     *  Reserved for future use.
     */
    lineRange?: Range;
    /**
     *  Reserved for future use.
     */
    offsetRange?: Range;
    /**
     * The page number of the page that contains the sensitive data.
     */
    pageNumber?: __long;
  }
  export type Pages = Page[];
  export interface PolicyDetails {
    /**
     * The action that produced the finding.
     */
    action?: FindingAction;
    /**
     * The entity that performed the action that produced the finding.
     */
    actor?: FindingActor;
  }
  export interface PutClassificationExportConfigurationRequest {
    /**
     * The location to store data classification results in, and the encryption settings to use when storing results in that location.
     */
    configuration: ClassificationExportConfiguration;
  }
  export interface PutClassificationExportConfigurationResponse {
    /**
     * The location where the data classification results are stored, and the encryption settings that are used when storing results in that location.
     */
    configuration?: ClassificationExportConfiguration;
  }
  export interface PutFindingsPublicationConfigurationRequest {
    /**
     * A unique, case-sensitive token that you provide to ensure the idempotency of the request.
     */
    clientToken?: __string;
    /**
     * The configuration settings that determine which findings to publish to Security Hub.
     */
    securityHubConfiguration?: SecurityHubConfiguration;
  }
  export interface PutFindingsPublicationConfigurationResponse {
  }
  export interface Range {
    /**
     * The number of lines from the beginning of the file to the end of the sensitive data. 
     */
    end?: __long;
    /**
     * The number of lines from the beginning of the file to the beginning of the sensitive data. 
     */
    start?: __long;
    /**
     * The number of characters, with spaces and starting from 1, from the beginning of the first line that contains the sensitive data (start) to the beginning of the sensitive data.
     */
    startColumn?: __long;
  }
  export type Ranges = Range[];
  export interface Record {
    /**
     * The path, as a JSONPath expression, to the sensitive data. For an Avro object container or Parquet file, this is the path to the field in the record (recordIndex) that contains the data. For a JSON or JSON Lines file, this is the path to the field or array that contains the data. If the data is a value in an array, the path also indicates which value contains the data. If Amazon Macie detects sensitive data in the name of any element in the path, Macie omits this field. If the name of an element exceeds 20 characters, Macie truncates the name by removing characters from the beginning of the name. If the resulting full path exceeds 250 characters, Macie also truncates the path, starting with the first element in the path, until the path contains 250 or fewer characters.
     */
    jsonPath?: __string;
    /**
     * For an Avro object container or Parquet file, the record index, starting from 0, for the record that contains the sensitive data. For a JSON Lines file, the line index, starting from 0, for the line that contains the sensitive data. This value is always 0 for JSON files.
     */
    recordIndex?: __long;
  }
  export type Records = Record[];
  export type RelationshipStatus = "Enabled"|"Paused"|"Invited"|"Created"|"Removed"|"Resigned"|"EmailVerificationInProgress"|"EmailVerificationFailed"|"RegionDisabled"|"AccountSuspended"|string;
  export interface ReplicationDetails {
    /**
     * Specifies whether the bucket is configured to replicate one or more objects to any destination.
     */
    replicated?: __boolean;
    /**
     * Specifies whether the bucket is configured to replicate one or more objects to a bucket for an Amazon Web Services account that isn't part of your Amazon Macie organization. An Amazon Macie organization is a set of Macie accounts that are centrally managed as a group of related accounts through Organizations or by Macie invitation.
     */
    replicatedExternally?: __boolean;
    /**
     * An array of Amazon Web Services account IDs, one for each Amazon Web Services account that owns a bucket that the bucket is configured to replicate one or more objects to.
     */
    replicationAccounts?: __listOf__string;
  }
  export interface ResourceProfileArtifact {
    /**
     * The Amazon Resource Name (ARN) of the object.
     */
    arn: __string;
    /**
     * The status of the analysis. Possible values are: COMPLETE - Amazon Macie successfully completed its analysis of the object. PARTIAL - Macie analyzed only a subset of data in the object. For example, the object is an archive file that contains files in an unsupported format. SKIPPED - Macie wasn't able to analyze the object. For example, the object is a malformed file.
     */
    classificationResultStatus: __string;
    /**
     * Specifies whether Amazon Macie found sensitive data in the object.
     */
    sensitive?: __boolean;
  }
  export interface ResourceStatistics {
    /**
     * The total amount of data, in bytes, that Amazon Macie has analyzed in the bucket.
     */
    totalBytesClassified?: __long;
    /**
     * The total number of occurrences of sensitive data that Amazon Macie has found in the bucket's objects. This includes occurrences that are currently suppressed by the sensitivity scoring settings for the bucket (totalDetectionsSuppressed).
     */
    totalDetections?: __long;
    /**
     * The total number of occurrences of sensitive data that are currently suppressed by the sensitivity scoring settings for the bucket. These represent occurrences of sensitive data that Amazon Macie found in the bucket's objects, but the occurrences were manually suppressed. By default, suppressed occurrences are excluded from the bucket's sensitivity score.
     */
    totalDetectionsSuppressed?: __long;
    /**
     * The total number of objects that Amazon Macie has analyzed in the bucket.
     */
    totalItemsClassified?: __long;
    /**
     * The total number of the bucket's objects that Amazon Macie has found sensitive data in.
     */
    totalItemsSensitive?: __long;
    /**
     * The total number of objects that Amazon Macie wasn't able to analyze in the bucket due to an object-level issue or error. For example, the object is a malformed file. This value includes objects that Macie wasn't able to analyze for reasons reported by other statistics in the ResourceStatistics object.
     */
    totalItemsSkipped?: __long;
    /**
     * The total number of objects that Amazon Macie wasn't able to analyze in the bucket because the objects are encrypted with a key that Macie can't access. The objects use server-side encryption with customer-provided keys (SSE-C).
     */
    totalItemsSkippedInvalidEncryption?: __long;
    /**
     * The total number of objects that Amazon Macie wasn't able to analyze in the bucket because the objects are encrypted with KMS keys that were disabled, are scheduled for deletion, or were deleted.
     */
    totalItemsSkippedInvalidKms?: __long;
    /**
     * The total number of objects that Amazon Macie wasn't able to analyze in the bucket due to the permissions settings for the objects or the permissions settings for the keys that were used to encrypt the objects.
     */
    totalItemsSkippedPermissionDenied?: __long;
  }
  export interface ResourcesAffected {
    /**
     * The details of the S3 bucket that the finding applies to.
     */
    s3Bucket?: S3Bucket;
    /**
     * The details of the S3 object that the finding applies to.
     */
    s3Object?: S3Object;
  }
  export interface RevealConfiguration {
    /**
     * The Amazon Resource Name (ARN), ID, or alias of the KMS key to use to encrypt sensitive data that's retrieved. The key must be an existing, customer managed, symmetric encryption key that's in the same Amazon Web Services Region as the Amazon Macie account. If this value specifies an alias, it must include the following prefix: alias/. If this value specifies a key that's owned by another Amazon Web Services account, it must specify the ARN of the key or the ARN of the key's alias.
     */
    kmsKeyId?: __stringMin1Max2048;
    /**
     * The status of the configuration for the Amazon Macie account. In a request, valid values are: ENABLED, enable the configuration for the account; and, DISABLED, disable the configuration for the account. In a response, possible values are: ENABLED, the configuration is currently enabled for the account; and, DISABLED, the configuration is currently disabled for the account.
     */
    status: RevealStatus;
  }
  export type RevealRequestStatus = "SUCCESS"|"PROCESSING"|"ERROR"|string;
  export type RevealStatus = "ENABLED"|"DISABLED"|string;
  export interface S3Bucket {
    /**
     * Specifies whether the bucket policy for the bucket requires server-side encryption of objects when objects are added to the bucket. Possible values are: FALSE - The bucket policy requires server-side encryption of new objects. PutObject requests must include a valid server-side encryption header. TRUE - The bucket doesn't have a bucket policy or it has a bucket policy that doesn't require server-side encryption of new objects. If a bucket policy exists, it doesn't require PutObject requests to include a valid server-side encryption header. UNKNOWN - Amazon Macie can't determine whether the bucket policy requires server-side encryption of new objects. Valid server-side encryption headers are: x-amz-server-side-encryption with a value of AES256 or aws:kms, and x-amz-server-side-encryption-customer-algorithm with a value of AES256.
     */
    allowsUnencryptedObjectUploads?: AllowsUnencryptedObjectUploads;
    /**
     * The Amazon Resource Name (ARN) of the bucket.
     */
    arn?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the bucket was created. This value can also indicate when changes such as edits to the bucket's policy were most recently made to the bucket, relative to when the finding was created or last updated.
     */
    createdAt?: __timestampIso8601;
    /**
     * The default server-side encryption settings for the bucket.
     */
    defaultServerSideEncryption?: ServerSideEncryption;
    /**
     * The name of the bucket.
     */
    name?: __string;
    /**
     * The display name and canonical user ID for the Amazon Web Services account that owns the bucket.
     */
    owner?: S3BucketOwner;
    /**
     * The permissions settings that determine whether the bucket is publicly accessible.
     */
    publicAccess?: BucketPublicAccess;
    /**
     * The tags that are associated with the bucket.
     */
    tags?: KeyValuePairList;
  }
  export interface S3BucketCriteriaForJob {
    /**
     * The property- and tag-based conditions that determine which buckets to exclude from the job.
     */
    excludes?: CriteriaBlockForJob;
    /**
     * The property- and tag-based conditions that determine which buckets to include in the job.
     */
    includes?: CriteriaBlockForJob;
  }
  export interface S3BucketDefinitionForJob {
    /**
     * The unique identifier for the Amazon Web Services account that owns the buckets.
     */
    accountId: __string;
    /**
     * An array that lists the names of the buckets.
     */
    buckets: __listOf__string;
  }
  export type S3BucketName = string;
  export interface S3BucketOwner {
    /**
     * The display name of the account that owns the bucket.
     */
    displayName?: __string;
    /**
     * The canonical user ID for the account that owns the bucket.
     */
    id?: __string;
  }
  export interface S3ClassificationScope {
    /**
     * The S3 buckets that are excluded.
     */
    excludes: S3ClassificationScopeExclusion;
  }
  export interface S3ClassificationScopeExclusion {
    /**
     * An array of strings, one for each S3 bucket that is excluded. Each string is the full name of an excluded bucket.
     */
    bucketNames: __listOfS3BucketName;
  }
  export interface S3ClassificationScopeExclusionUpdate {
    /**
     * Depending on the value specified for the update operation (ClassificationScopeUpdateOperation), an array of strings that: lists the names of buckets to add or remove from the list, or specifies a new set of bucket names that overwrites all existing names in the list. Each string must be the full name of an S3 bucket. Values are case sensitive.
     */
    bucketNames: __listOfS3BucketName;
    /**
     * Specifies how to apply the changes to the exclusion list. Valid values are: ADD - Append the specified bucket names to the current list. REMOVE - Remove the specified bucket names from the current list. REPLACE - Overwrite the current list with the specified list of bucket names. If you specify this value, Amazon Macie removes all existing names from the list and adds all the specified names to the list.
     */
    operation: ClassificationScopeUpdateOperation;
  }
  export interface S3ClassificationScopeUpdate {
    /**
     * The names of the S3 buckets to add or remove from the list.
     */
    excludes: S3ClassificationScopeExclusionUpdate;
  }
  export interface S3Destination {
    /**
     * The name of the bucket.
     */
    bucketName: __string;
    /**
     * The path prefix to use in the path to the location in the bucket. This prefix specifies where to store classification results in the bucket.
     */
    keyPrefix?: __string;
    /**
     * The Amazon Resource Name (ARN) of the customer managed KMS key to use for encryption of the results. This must be the ARN of an existing, symmetric encryption KMS key that's in the same Amazon Web Services Region as the bucket.
     */
    kmsKeyArn: __string;
  }
  export interface S3JobDefinition {
    /**
     * The property- and tag-based conditions that determine which S3 buckets to include or exclude from the analysis. Each time the job runs, the job uses these criteria to determine which buckets contain objects to analyze. A job's definition can contain a bucketCriteria object or a bucketDefinitions array, not both.
     */
    bucketCriteria?: S3BucketCriteriaForJob;
    /**
     * An array of objects, one for each Amazon Web Services account that owns specific S3 buckets to analyze. Each object specifies the account ID for an account and one or more buckets to analyze for that account. A job's definition can contain a bucketDefinitions array or a bucketCriteria object, not both.
     */
    bucketDefinitions?: __listOfS3BucketDefinitionForJob;
    /**
     * The property- and tag-based conditions that determine which S3 objects to include or exclude from the analysis. Each time the job runs, the job uses these criteria to determine which objects to analyze.
     */
    scoping?: Scoping;
  }
  export interface S3Object {
    /**
     * The Amazon Resource Name (ARN) of the bucket that contains the object.
     */
    bucketArn?: __string;
    /**
     * The entity tag (ETag) that identifies the affected version of the object. If the object was overwritten or changed after Amazon Macie produced the finding, this value might be different from the current ETag for the object.
     */
    eTag?: __string;
    /**
     * The file name extension of the object. If the object doesn't have a file name extension, this value is "".
     */
    extension?: __string;
    /**
     * The full name (key) of the object, including the object's prefix if applicable.
     */
    key?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the object was last modified.
     */
    lastModified?: __timestampIso8601;
    /**
     * The full path to the affected object, including the name of the affected bucket and the object's name (key).
     */
    path?: __string;
    /**
     * Specifies whether the object is publicly accessible due to the combination of permissions settings that apply to the object.
     */
    publicAccess?: __boolean;
    /**
     * The type of server-side encryption that was used to encrypt the object.
     */
    serverSideEncryption?: ServerSideEncryption;
    /**
     * The total storage size, in bytes, of the object.
     */
    size?: __long;
    /**
     * The storage class of the object.
     */
    storageClass?: StorageClass;
    /**
     * The tags that are associated with the object.
     */
    tags?: KeyValuePairList;
    /**
     * The identifier for the affected version of the object.
     */
    versionId?: __string;
  }
  export interface S3WordsList {
    /**
     * The full name of the S3 bucket that contains the object.
     */
    bucketName: __stringMin3Max255PatternAZaZ093255;
    /**
     * The full name (key) of the object.
     */
    objectKey: __stringMin1Max1024PatternSS;
  }
  export type ScopeFilterKey = "OBJECT_EXTENSION"|"OBJECT_LAST_MODIFIED_DATE"|"OBJECT_SIZE"|"OBJECT_KEY"|string;
  export interface Scoping {
    /**
     * The property- and tag-based conditions that determine which objects to exclude from the analysis.
     */
    excludes?: JobScopingBlock;
    /**
     * The property- and tag-based conditions that determine which objects to include in the analysis.
     */
    includes?: JobScopingBlock;
  }
  export interface SearchResourcesBucketCriteria {
    /**
     * The property- and tag-based conditions that determine which buckets to exclude from the results.
     */
    excludes?: SearchResourcesCriteriaBlock;
    /**
     * The property- and tag-based conditions that determine which buckets to include in the results.
     */
    includes?: SearchResourcesCriteriaBlock;
  }
  export type SearchResourcesComparator = "EQ"|"NE"|string;
  export interface SearchResourcesCriteria {
    /**
     * A property-based condition that defines a property, operator, and one or more values for including or excluding resources from the results.
     */
    simpleCriterion?: SearchResourcesSimpleCriterion;
    /**
     * A tag-based condition that defines an operator and tag keys, tag values, or tag key and value pairs for including or excluding resources from the results.
     */
    tagCriterion?: SearchResourcesTagCriterion;
  }
  export interface SearchResourcesCriteriaBlock {
    /**
     * An array of objects, one for each property- or tag-based condition that includes or excludes resources from the query results. If you specify more than one condition, Amazon Macie uses AND logic to join the conditions.
     */
    and?: __listOfSearchResourcesCriteria;
  }
  export interface SearchResourcesRequest {
    /**
     * The filter conditions that determine which S3 buckets to include or exclude from the query results.
     */
    bucketCriteria?: SearchResourcesBucketCriteria;
    /**
     * The maximum number of items to include in each page of the response. The default value is 50.
     */
    maxResults?: __integer;
    /**
     * The nextToken string that specifies which page of results to return in a paginated response.
     */
    nextToken?: __string;
    /**
     * The criteria to use to sort the results.
     */
    sortCriteria?: SearchResourcesSortCriteria;
  }
  export interface SearchResourcesResponse {
    /**
     * An array of objects, one for each resource that matches the filter criteria specified in the request.
     */
    matchingResources?: __listOfMatchingResource;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    nextToken?: __string;
  }
  export interface SearchResourcesSimpleCriterion {
    /**
     * The operator to use in the condition. Valid values are EQ (equals) and NE (not equals).
     */
    comparator?: SearchResourcesComparator;
    /**
     * The property to use in the condition.
     */
    key?: SearchResourcesSimpleCriterionKey;
    /**
     * An array that lists one or more values to use in the condition. If you specify multiple values, Amazon Macie uses OR logic to join the values. Valid values for each supported property (key) are: ACCOUNT_ID - A string that represents the unique identifier for the Amazon Web Services account that owns the resource. S3_BUCKET_EFFECTIVE_PERMISSION - A string that represents an enumerated value that Macie defines for the BucketPublicAccess.effectivePermission property of an S3 bucket. S3_BUCKET_NAME - A string that represents the name of an S3 bucket. S3_BUCKET_SHARED_ACCESS - A string that represents an enumerated value that Macie defines for the BucketMetadata.sharedAccess property of an S3 bucket. Values are case sensitive. Also, Macie doesn't support use of partial values or wildcard characters in values.
     */
    values?: __listOf__string;
  }
  export type SearchResourcesSimpleCriterionKey = "ACCOUNT_ID"|"S3_BUCKET_NAME"|"S3_BUCKET_EFFECTIVE_PERMISSION"|"S3_BUCKET_SHARED_ACCESS"|string;
  export type SearchResourcesSortAttributeName = "ACCOUNT_ID"|"RESOURCE_NAME"|"S3_CLASSIFIABLE_OBJECT_COUNT"|"S3_CLASSIFIABLE_SIZE_IN_BYTES"|string;
  export interface SearchResourcesSortCriteria {
    /**
     * The property to sort the results by.
     */
    attributeName?: SearchResourcesSortAttributeName;
    /**
     * The sort order to apply to the results, based on the value for the property specified by the attributeName property. Valid values are: ASC, sort the results in ascending order; and, DESC, sort the results in descending order.
     */
    orderBy?: OrderBy;
  }
  export interface SearchResourcesTagCriterion {
    /**
     * The operator to use in the condition. Valid values are EQ (equals) and NE (not equals).
     */
    comparator?: SearchResourcesComparator;
    /**
     * The tag keys, tag values, or tag key and value pairs to use in the condition.
     */
    tagValues?: __listOfSearchResourcesTagCriterionPair;
  }
  export interface SearchResourcesTagCriterionPair {
    /**
     * The value for the tag key to use in the condition.
     */
    key?: __string;
    /**
     * The tag value to use in the condition.
     */
    value?: __string;
  }
  export interface SecurityHubConfiguration {
    /**
     * Specifies whether to publish sensitive data findings to Security Hub. If you set this value to true, Amazon Macie automatically publishes all sensitive data findings that weren't suppressed by a findings filter. The default value is false.
     */
    publishClassificationFindings: __boolean;
    /**
     * Specifies whether to publish policy findings to Security Hub. If you set this value to true, Amazon Macie automatically publishes all new and updated policy findings that weren't suppressed by a findings filter. The default value is true.
     */
    publishPolicyFindings: __boolean;
  }
  export type SensitiveData = SensitiveDataItem[];
  export interface SensitiveDataItem {
    /**
     * The category of sensitive data that was detected. For example: CREDENTIALS, for credentials data such as private keys or Amazon Web Services secret access keys; FINANCIAL_INFORMATION, for financial data such as credit card numbers; or, PERSONAL_INFORMATION, for personal health information, such as health insurance identification numbers, or personally identifiable information, such as passport numbers.
     */
    category?: SensitiveDataItemCategory;
    /**
     * An array of objects, one for each type of sensitive data that was detected. Each object reports the number of occurrences of a specific type of sensitive data that was detected, and the location of up to 15 of those occurrences.
     */
    detections?: DefaultDetections;
    /**
     * The total number of occurrences of the sensitive data that was detected.
     */
    totalCount?: __long;
  }
  export type SensitiveDataItemCategory = "FINANCIAL_INFORMATION"|"PERSONAL_INFORMATION"|"CREDENTIALS"|"CUSTOM_IDENTIFIER"|string;
  export type SensitiveDataOccurrences = {[key: string]: __listOfDetectedDataDetails};
  export interface SensitivityAggregations {
    /**
     * The total storage size, in bytes, of all the objects that Amazon Macie can analyze in the buckets. These objects use a supported storage class and have a file name extension for a supported file or storage format. If versioning is enabled for any of the buckets, this value is based on the size of the latest version of each applicable object in the buckets. This value doesn't reflect the storage size of all versions of all applicable objects in the buckets.
     */
    classifiableSizeInBytes?: __long;
    /**
     * The total number of buckets that are publicly accessible due to a combination of permissions settings for each bucket.
     */
    publiclyAccessibleCount?: __long;
    /**
     * The total number of buckets.
     */
    totalCount?: __long;
    /**
     * The total storage size, in bytes, of the buckets. If versioning is enabled for any of the buckets, this value is based on the size of the latest version of each object in the buckets. This value doesn't reflect the storage size of all versions of the objects in the buckets.
     */
    totalSizeInBytes?: __long;
  }
  export interface SensitivityInspectionTemplateExcludes {
    /**
     * An array of unique identifiers, one for each managed data identifier to exclude. To retrieve a list of valid values, use the ListManagedDataIdentifiers operation.
     */
    managedDataIdentifierIds?: __listOf__string;
  }
  export type SensitivityInspectionTemplateId = string;
  export interface SensitivityInspectionTemplateIncludes {
    /**
     * An array of unique identifiers, one for each allow list to include.
     */
    allowListIds?: __listOf__string;
    /**
     * An array of unique identifiers, one for each custom data identifier to include.
     */
    customDataIdentifierIds?: __listOf__string;
    /**
     * An array of unique identifiers, one for each managed data identifier to include. Amazon Macie uses these managed data identifiers in addition to managed data identifiers that are subsequently released and recommended for automated sensitive data discovery. To retrieve a list of valid values for the managed data identifiers that are currently available, use the ListManagedDataIdentifiers operation. 
     */
    managedDataIdentifierIds?: __listOf__string;
  }
  export interface SensitivityInspectionTemplatesEntry {
    /**
     * The unique identifier for the sensitivity inspection template.
     */
    id?: __string;
    /**
     * The name of the sensitivity inspection template: automated-sensitive-data-discovery.
     */
    name?: __string;
  }
  export interface ServerSideEncryption {
    /**
     * The server-side encryption algorithm that's used when storing data in the bucket or object. If default encryption settings aren't configured for the bucket or the object isn't encrypted using server-side encryption, this value is NONE.
     */
    encryptionType?: EncryptionType;
    /**
     * The Amazon Resource Name (ARN) or unique identifier (key ID) for the KMS key that's used to encrypt data in the bucket or the object. This value is null if an KMS key isn't used to encrypt the data.
     */
    kmsMasterKeyId?: __string;
  }
  export interface ServiceLimit {
    /**
     * Specifies whether the account has met the quota that corresponds to the metric specified by the UsageByAccount.type field in the response.
     */
    isServiceLimited?: __boolean;
    /**
     * The unit of measurement for the value specified by the value field.
     */
    unit?: Unit;
    /**
     * The value for the metric specified by the UsageByAccount.type field in the response.
     */
    value?: __long;
  }
  export interface SessionContext {
    /**
     * The date and time when the credentials were issued, and whether the credentials were authenticated with a multi-factor authentication (MFA) device.
     */
    attributes?: SessionContextAttributes;
    /**
     * The source and type of credentials that were issued to the entity.
     */
    sessionIssuer?: SessionIssuer;
  }
  export interface SessionContextAttributes {
    /**
     * The date and time, in UTC and ISO 8601 format, when the credentials were issued.
     */
    creationDate?: __timestampIso8601;
    /**
     * Specifies whether the credentials were authenticated with a multi-factor authentication (MFA) device.
     */
    mfaAuthenticated?: __boolean;
  }
  export interface SessionIssuer {
    /**
     * The unique identifier for the Amazon Web Services account that owns the entity that was used to get the credentials.
     */
    accountId?: __string;
    /**
     * The Amazon Resource Name (ARN) of the source account, Identity and Access Management (IAM) user, or role that was used to get the credentials.
     */
    arn?: __string;
    /**
     * The unique identifier for the entity that was used to get the credentials.
     */
    principalId?: __string;
    /**
     * The source of the temporary security credentials, such as Root, IAMUser, or Role.
     */
    type?: __string;
    /**
     * The name or alias of the user or role that issued the session. This value is null if the credentials were obtained from a root account that doesn't have an alias.
     */
    userName?: __string;
  }
  export interface Severity {
    /**
     * The qualitative representation of the finding's severity, ranging from Low (least severe) to High (most severe).
     */
    description?: SeverityDescription;
    /**
     * The numerical representation of the finding's severity, ranging from 1 (least severe) to 3 (most severe).
     */
    score?: __long;
  }
  export type SeverityDescription = "Low"|"Medium"|"High"|string;
  export interface SeverityLevel {
    /**
     * The minimum number of occurrences of text that must match the custom data identifier's detection criteria in order to produce a finding with the specified severity (severity).
     */
    occurrencesThreshold: __long;
    /**
     * The severity to assign to a finding: if the number of occurrences is greater than or equal to the specified threshold (occurrencesThreshold); and, if applicable, the number of occurrences is less than the threshold for the next consecutive severity level for the custom data identifier, moving from LOW to HIGH.
     */
    severity: DataIdentifierSeverity;
  }
  export type SeverityLevelList = SeverityLevel[];
  export type SharedAccess = "EXTERNAL"|"INTERNAL"|"NOT_SHARED"|"UNKNOWN"|string;
  export interface SimpleCriterionForJob {
    /**
     * The operator to use in the condition. Valid values are EQ (equals) and NE (not equals).
     */
    comparator?: JobComparator;
    /**
     * The property to use in the condition.
     */
    key?: SimpleCriterionKeyForJob;
    /**
     * An array that lists one or more values to use in the condition. If you specify multiple values, Amazon Macie uses OR logic to join the values. Valid values for each supported property (key) are: ACCOUNT_ID - A string that represents the unique identifier for the Amazon Web Services account that owns the bucket. S3_BUCKET_EFFECTIVE_PERMISSION - A string that represents an enumerated value that Macie defines for the BucketPublicAccess.effectivePermission property of a bucket. S3_BUCKET_NAME - A string that represents the name of a bucket. S3_BUCKET_SHARED_ACCESS - A string that represents an enumerated value that Macie defines for the BucketMetadata.sharedAccess property of a bucket. Values are case sensitive. Also, Macie doesn't support use of partial values or wildcard characters in these values.
     */
    values?: __listOf__string;
  }
  export type SimpleCriterionKeyForJob = "ACCOUNT_ID"|"S3_BUCKET_NAME"|"S3_BUCKET_EFFECTIVE_PERMISSION"|"S3_BUCKET_SHARED_ACCESS"|string;
  export interface SimpleScopeTerm {
    /**
     * The operator to use in the condition. Valid values for each supported property (key) are: OBJECT_EXTENSION - EQ (equals) or NE (not equals) OBJECT_KEY - STARTS_WITH OBJECT_LAST_MODIFIED_DATE - Any operator except CONTAINS OBJECT_SIZE - Any operator except CONTAINS
     */
    comparator?: JobComparator;
    /**
     * The object property to use in the condition.
     */
    key?: ScopeFilterKey;
    /**
     * An array that lists the values to use in the condition. If the value for the key property is OBJECT_EXTENSION or OBJECT_KEY, this array can specify multiple values and Amazon Macie uses OR logic to join the values. Otherwise, this array can specify only one value. Valid values for each supported property (key) are: OBJECT_EXTENSION - A string that represents the file name extension of an object. For example: docx or pdf OBJECT_KEY - A string that represents the key prefix (folder name or path) of an object. For example: logs or awslogs/eventlogs. This value applies a condition to objects whose keys (names) begin with the specified value. OBJECT_LAST_MODIFIED_DATE - The date and time (in UTC and extended ISO 8601 format) when an object was created or last changed, whichever is latest. For example: 2020-09-28T14:31:13Z OBJECT_SIZE - An integer that represents the storage size (in bytes) of an object. Macie doesn't support use of wildcard characters in these values. Also, string values are case sensitive.
     */
    values?: __listOf__string;
  }
  export interface SortCriteria {
    /**
     * The name of the property to sort the results by. Valid values are: count, createdAt, policyDetails.action.apiCallDetails.firstSeen, policyDetails.action.apiCallDetails.lastSeen, resourcesAffected, severity.score, type, and updatedAt.
     */
    attributeName?: __string;
    /**
     * The sort order to apply to the results, based on the value for the property specified by the attributeName property. Valid values are: ASC, sort the results in ascending order; and, DESC, sort the results in descending order.
     */
    orderBy?: OrderBy;
  }
  export interface Statistics {
    /**
     * The approximate number of objects that the job has yet to process during its current run.
     */
    approximateNumberOfObjectsToProcess?: __double;
    /**
     * The number of times that the job has run.
     */
    numberOfRuns?: __double;
  }
  export type StorageClass = "STANDARD"|"REDUCED_REDUNDANCY"|"STANDARD_IA"|"INTELLIGENT_TIERING"|"DEEP_ARCHIVE"|"ONEZONE_IA"|"GLACIER"|"GLACIER_IR"|"OUTPOSTS"|string;
  export interface SuppressDataIdentifier {
    /**
     * The unique identifier for the custom data identifier or managed data identifier that detected the type of sensitive data to exclude or include in the score.
     */
    id?: __string;
    /**
     * The type of data identifier that detected the sensitive data. Possible values are: CUSTOM, for a custom data identifier; and, MANAGED, for a managed data identifier.
     */
    type?: DataIdentifierType;
  }
  export interface TagCriterionForJob {
    /**
     * The operator to use in the condition. Valid values are EQ (equals) and NE (not equals).
     */
    comparator?: JobComparator;
    /**
     * The tag keys, tag values, or tag key and value pairs to use in the condition.
     */
    tagValues?: __listOfTagCriterionPairForJob;
  }
  export interface TagCriterionPairForJob {
    /**
     * The value for the tag key to use in the condition.
     */
    key?: __string;
    /**
     * The tag value to use in the condition.
     */
    value?: __string;
  }
  export type TagMap = {[key: string]: __string};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: __string;
    /**
     * A map of key-value pairs that specifies the tags to associate with the resource. A resource can have a maximum of 50 tags. Each tag consists of a tag key and an associated tag value. The maximum length of a tag key is 128 characters. The maximum length of a tag value is 256 characters.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export interface TagScopeTerm {
    /**
     * The operator to use in the condition. Valid values are EQ (equals) or NE (not equals).
     */
    comparator?: JobComparator;
    /**
     * The object property to use in the condition. The only valid value is TAG.
     */
    key?: __string;
    /**
     * The tag keys or tag key and value pairs to use in the condition. To specify only tag keys in a condition, specify the keys in this array and set the value for each associated tag value to an empty string.
     */
    tagValues?: __listOfTagValuePair;
    /**
     * The type of object to apply the condition to.
     */
    target?: TagTarget;
  }
  export type TagTarget = "S3_OBJECT"|string;
  export interface TagValuePair {
    /**
     * The value for the tag key to use in the condition.
     */
    key?: __string;
    /**
     * The tag value, associated with the specified tag key (key), to use in the condition. To specify only a tag key for a condition, specify the tag key for the key property and set this value to an empty string.
     */
    value?: __string;
  }
  export interface TestCustomDataIdentifierRequest {
    /**
     * An array that lists specific character sequences (ignore words) to exclude from the results. If the text matched by the regular expression contains any string in this array, Amazon Macie ignores it. The array can contain as many as 10 ignore words. Each ignore word can contain 4-90 UTF-8 characters. Ignore words are case sensitive.
     */
    ignoreWords?: __listOf__string;
    /**
     * An array that lists specific character sequences (keywords), one of which must precede and be within proximity (maximumMatchDistance) of the regular expression to match. The array can contain as many as 50 keywords. Each keyword can contain 3-90 UTF-8 characters. Keywords aren't case sensitive.
     */
    keywords?: __listOf__string;
    /**
     * The maximum number of characters that can exist between the end of at least one complete character sequence specified by the keywords array and the end of the text that matches the regex pattern. If a complete keyword precedes all the text that matches the pattern and the keyword is within the specified distance, Amazon Macie includes the result. The distance can be 1-300 characters. The default value is 50.
     */
    maximumMatchDistance?: __integer;
    /**
     * The regular expression (regex) that defines the pattern to match. The expression can contain as many as 512 characters.
     */
    regex: __string;
    /**
     * The sample text to inspect by using the custom data identifier. The text can contain as many as 1,000 characters.
     */
    sampleText: __string;
  }
  export interface TestCustomDataIdentifierResponse {
    /**
     * The number of occurrences of sample text that matched the criteria specified by the custom data identifier.
     */
    matchCount?: __integer;
  }
  export type TimeRange = "MONTH_TO_DATE"|"PAST_30_DAYS"|string;
  export type Timestamp = Date;
  export type Type = "NONE"|"AES256"|"aws:kms"|string;
  export type UnavailabilityReasonCode = "OBJECT_EXCEEDS_SIZE_QUOTA"|"UNSUPPORTED_OBJECT_TYPE"|"UNSUPPORTED_FINDING_TYPE"|"INVALID_CLASSIFICATION_RESULT"|"OBJECT_UNAVAILABLE"|string;
  export type Unit = "TERABYTES"|string;
  export interface UnprocessedAccount {
    /**
     * The Amazon Web Services account ID for the account that the request applies to.
     */
    accountId?: __string;
    /**
     * The source of the issue or delay in processing the request.
     */
    errorCode?: ErrorCode;
    /**
     * The reason why the request hasn't been processed.
     */
    errorMessage?: __string;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: __string;
    /**
     * One or more tags (keys) to remove from the resource. In an HTTP request to remove multiple tags, append the tagKeys parameter and argument for each tag to remove, separated by an ampersand (&amp;).
     */
    tagKeys: __listOf__string;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAllowListRequest {
    /**
     * The criteria that specify the text or text pattern to ignore. The criteria can be the location and name of an S3 object that lists specific text to ignore (s3WordsList), or a regular expression that defines a text pattern to ignore (regex). You can change a list's underlying criteria, such as the name of the S3 object or the regular expression to use. However, you can't change the type from s3WordsList to regex or the other way around.
     */
    criteria: AllowListCriteria;
    /**
     * A custom description of the allow list. The description can contain as many as 512 characters.
     */
    description?: __stringMin1Max512PatternSS;
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
    /**
     * A custom name for the allow list. The name can contain as many as 128 characters.
     */
    name: __stringMin1Max128Pattern;
  }
  export interface UpdateAllowListResponse {
    /**
     * The Amazon Resource Name (ARN) of the allow list.
     */
    arn?: __stringMin71Max89PatternArnAwsAwsCnAwsUsGovMacie2AZ19920D12AllowListAZ0922;
    /**
     * The unique identifier for the allow list.
     */
    id?: __stringMin22Max22PatternAZ0922;
  }
  export interface UpdateAutomatedDiscoveryConfigurationRequest {
    /**
     * The new status of automated sensitive data discovery for the account. Valid values are: ENABLED, start or resume automated sensitive data discovery activities for the account; and, DISABLED, stop performing automated sensitive data discovery activities for the account. When you enable automated sensitive data discovery for the first time, Amazon Macie uses default configuration settings to determine which data sources to analyze and which managed data identifiers to use. To change these settings, use the UpdateClassificationScope and UpdateSensitivityInspectionTemplate operations, respectively. If you change the settings and subsequently disable the configuration, Amazon Macie retains your changes.
     */
    status: AutomatedDiscoveryStatus;
  }
  export interface UpdateAutomatedDiscoveryConfigurationResponse {
  }
  export interface UpdateClassificationJobRequest {
    /**
     * The unique identifier for the classification job.
     */
    jobId: __string;
    /**
     * The new status for the job. Valid values are: CANCELLED - Stops the job permanently and cancels it. This value is valid only if the job's current status is IDLE, PAUSED, RUNNING, or USER_PAUSED. If you specify this value and the job's current status is RUNNING, Amazon Macie immediately begins to stop all processing tasks for the job. You can't resume or restart a job after you cancel it. RUNNING - Resumes the job. This value is valid only if the job's current status is USER_PAUSED. If you paused the job while it was actively running and you specify this value less than 30 days after you paused the job, Macie immediately resumes processing from the point where you paused the job. Otherwise, Macie resumes the job according to the schedule and other settings for the job. USER_PAUSED - Pauses the job temporarily. This value is valid only if the job's current status is IDLE, PAUSED, or RUNNING. If you specify this value and the job's current status is RUNNING, Macie immediately begins to pause all processing tasks for the job. If you pause a one-time job and you don't resume it within 30 days, the job expires and Macie cancels the job. If you pause a recurring job when its status is RUNNING and you don't resume it within 30 days, the job run expires and Macie cancels the run. To check the expiration date, refer to the UserPausedDetails.jobExpiresAt property.
     */
    jobStatus: JobStatus;
  }
  export interface UpdateClassificationJobResponse {
  }
  export interface UpdateClassificationScopeRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
    /**
     * The S3 buckets to add or remove from the exclusion list defined by the classification scope.
     */
    s3?: S3ClassificationScopeUpdate;
  }
  export interface UpdateClassificationScopeResponse {
  }
  export interface UpdateFindingsFilterRequest {
    /**
     * The action to perform on findings that match the filter criteria (findingCriteria). Valid values are: ARCHIVE, suppress (automatically archive) the findings; and, NOOP, don't perform any action on the findings.
     */
    action?: FindingsFilterAction;
    /**
     * A unique, case-sensitive token that you provide to ensure the idempotency of the request.
     */
    clientToken?: __string;
    /**
     * A custom description of the filter. The description can contain as many as 512 characters. We strongly recommend that you avoid including any sensitive data in the description of a filter. Other users of your account might be able to see this description, depending on the actions that they're allowed to perform in Amazon Macie.
     */
    description?: __string;
    /**
     * The criteria to use to filter findings.
     */
    findingCriteria?: FindingCriteria;
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
    /**
     * A custom name for the filter. The name must contain at least 3 characters and can contain as many as 64 characters. We strongly recommend that you avoid including any sensitive data in the name of a filter. Other users of your account might be able to see this name, depending on the actions that they're allowed to perform in Amazon Macie.
     */
    name?: __string;
    /**
     * The position of the filter in the list of saved filters on the Amazon Macie console. This value also determines the order in which the filter is applied to findings, relative to other filters that are also applied to the findings.
     */
    position?: __integer;
  }
  export interface UpdateFindingsFilterResponse {
    /**
     * The Amazon Resource Name (ARN) of the filter that was updated.
     */
    arn?: __string;
    /**
     * The unique identifier for the filter that was updated.
     */
    id?: __string;
  }
  export interface UpdateMacieSessionRequest {
    /**
     * Specifies how often to publish updates to policy findings for the account. This includes publishing updates to Security Hub and Amazon EventBridge (formerly Amazon CloudWatch Events).
     */
    findingPublishingFrequency?: FindingPublishingFrequency;
    /**
     * Specifies a new status for the account. Valid values are: ENABLED, resume all Amazon Macie activities for the account; and, PAUSED, suspend all Macie activities for the account.
     */
    status?: MacieStatus;
  }
  export interface UpdateMacieSessionResponse {
  }
  export interface UpdateMemberSessionRequest {
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
    /**
     * Specifies the new status for the account. Valid values are: ENABLED, resume all Amazon Macie activities for the account; and, PAUSED, suspend all Macie activities for the account.
     */
    status: MacieStatus;
  }
  export interface UpdateMemberSessionResponse {
  }
  export interface UpdateOrganizationConfigurationRequest {
    /**
     * Specifies whether to enable Amazon Macie automatically for an account when the account is added to the organization in Organizations.
     */
    autoEnable: __boolean;
  }
  export interface UpdateOrganizationConfigurationResponse {
  }
  export interface UpdateResourceProfileDetectionsRequest {
    /**
     * The Amazon Resource Name (ARN) of the S3 bucket that the request applies to.
     */
    resourceArn: __string;
    /**
     * An array of objects, one for each custom data identifier or managed data identifier that detected the type of sensitive data to start excluding or including in the bucket's score. To start including all sensitive data types in the score, don't specify any values for this array.
     */
    suppressDataIdentifiers?: __listOfSuppressDataIdentifier;
  }
  export interface UpdateResourceProfileDetectionsResponse {
  }
  export interface UpdateResourceProfileRequest {
    /**
     * The Amazon Resource Name (ARN) of the S3 bucket that the request applies to.
     */
    resourceArn: __string;
    /**
     * The new sensitivity score for the bucket. Valid values are: 100, assign the maximum score and apply the Sensitive label to the bucket; and, null (empty), assign a score that Amazon Macie calculates automatically after you submit the request.
     */
    sensitivityScoreOverride?: __integer;
  }
  export interface UpdateResourceProfileResponse {
  }
  export interface UpdateRevealConfigurationRequest {
    /**
     * The new configuration settings and the status of the configuration for the account.
     */
    configuration: RevealConfiguration;
  }
  export interface UpdateRevealConfigurationResponse {
    /**
     * The new configuration settings and the status of the configuration for the account.
     */
    configuration?: RevealConfiguration;
  }
  export interface UpdateSensitivityInspectionTemplateRequest {
    /**
     * A custom description of the template. The description can contain as many as 200 characters.
     */
    description?: __string;
    /**
     *  The managed data identifiers to explicitly exclude (not use) when analyzing data. To exclude an allow list or custom data identifier that's currently included by the template, update the values for the SensitivityInspectionTemplateIncludes.allowListIds and SensitivityInspectionTemplateIncludes.customDataIdentifierIds properties, respectively.
     */
    excludes?: SensitivityInspectionTemplateExcludes;
    /**
     * The unique identifier for the Amazon Macie resource that the request applies to.
     */
    id: __string;
    /**
     * The allow lists, custom data identifiers, and managed data identifiers to include (use) when analyzing data.
     */
    includes?: SensitivityInspectionTemplateIncludes;
  }
  export interface UpdateSensitivityInspectionTemplateResponse {
  }
  export interface UsageByAccount {
    /**
     * The type of currency that the value for the metric (estimatedCost) is reported in.
     */
    currency?: Currency;
    /**
     * The estimated value for the metric.
     */
    estimatedCost?: __string;
    /**
     * The current value for the quota that corresponds to the metric specified by the type field.
     */
    serviceLimit?: ServiceLimit;
    /**
     * The name of the metric. Possible values are: AUTOMATED_OBJECT_MONITORING, to monitor S3 objects for automated sensitive data discovery; AUTOMATED_SENSITIVE_DATA_DISCOVERY, to analyze S3 objects for automated sensitive data discovery; DATA_INVENTORY_EVALUATION, to monitor S3 buckets; and, SENSITIVE_DATA_DISCOVERY, to run classification jobs.
     */
    type?: UsageType;
  }
  export interface UsageRecord {
    /**
     * The unique identifier for the Amazon Web Services account that the data applies to.
     */
    accountId?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the free trial of automated sensitive data discovery started for the account. If the account is a member account in an organization, this value is the same as the value for the organization's Amazon Macie administrator account.
     */
    automatedDiscoveryFreeTrialStartDate?: __timestampIso8601;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the Amazon Macie free trial started for the account.
     */
    freeTrialStartDate?: __timestampIso8601;
    /**
     * An array of objects that contains usage data and quotas for the account. Each object contains the data for a specific usage metric and the corresponding quota.
     */
    usage?: __listOfUsageByAccount;
  }
  export interface UsageStatisticsFilter {
    /**
     * The operator to use in the condition. If the value for the key property is accountId, this value must be CONTAINS. If the value for the key property is any other supported field, this value can be EQ, GT, GTE, LT, LTE, or NE.
     */
    comparator?: UsageStatisticsFilterComparator;
    /**
     * The field to use in the condition.
     */
    key?: UsageStatisticsFilterKey;
    /**
     * An array that lists values to use in the condition, based on the value for the field specified by the key property. If the value for the key property is accountId, this array can specify multiple values. Otherwise, this array can specify only one value. Valid values for each supported field are: accountId - The unique identifier for an Amazon Web Services account. freeTrialStartDate - The date and time, in UTC and extended ISO 8601 format, when the Amazon Macie free trial started for an account. serviceLimit - A Boolean (true or false) value that indicates whether an account has reached its monthly quota. total - A string that represents the current estimated cost for an account.
     */
    values?: __listOf__string;
  }
  export type UsageStatisticsFilterComparator = "GT"|"GTE"|"LT"|"LTE"|"EQ"|"NE"|"CONTAINS"|string;
  export type UsageStatisticsFilterKey = "accountId"|"serviceLimit"|"freeTrialStartDate"|"total"|string;
  export interface UsageStatisticsSortBy {
    /**
     * The field to sort the results by.
     */
    key?: UsageStatisticsSortKey;
    /**
     * The sort order to apply to the results, based on the value for the field specified by the key property. Valid values are: ASC, sort the results in ascending order; and, DESC, sort the results in descending order.
     */
    orderBy?: OrderBy;
  }
  export type UsageStatisticsSortKey = "accountId"|"total"|"serviceLimitValue"|"freeTrialStartDate"|string;
  export interface UsageTotal {
    /**
     * The type of currency that the value for the metric (estimatedCost) is reported in.
     */
    currency?: Currency;
    /**
     * The estimated value for the metric.
     */
    estimatedCost?: __string;
    /**
     * The name of the metric. Possible values are: AUTOMATED_OBJECT_MONITORING, to monitor S3 objects for automated sensitive data discovery; AUTOMATED_SENSITIVE_DATA_DISCOVERY, to analyze S3 objects for automated sensitive data discovery; DATA_INVENTORY_EVALUATION, to monitor S3 buckets; and, SENSITIVE_DATA_DISCOVERY, to run classification jobs.
     */
    type?: UsageType;
  }
  export type UsageType = "DATA_INVENTORY_EVALUATION"|"SENSITIVE_DATA_DISCOVERY"|"AUTOMATED_SENSITIVE_DATA_DISCOVERY"|"AUTOMATED_OBJECT_MONITORING"|string;
  export interface UserIdentity {
    /**
     * If the action was performed with temporary security credentials that were obtained using the AssumeRole operation of the Security Token Service (STS) API, the identifiers, session context, and other details about the identity.
     */
    assumedRole?: AssumedRole;
    /**
     * If the action was performed using the credentials for another Amazon Web Services account, the details of that account.
     */
    awsAccount?: AwsAccount;
    /**
     * If the action was performed by an Amazon Web Services account that belongs to an Amazon Web Service, the name of the service.
     */
    awsService?: AwsService;
    /**
     * If the action was performed with temporary security credentials that were obtained using the GetFederationToken operation of the Security Token Service (STS) API, the identifiers, session context, and other details about the identity.
     */
    federatedUser?: FederatedUser;
    /**
     * If the action was performed using the credentials for an Identity and Access Management (IAM) user, the name and other details about the user.
     */
    iamUser?: IamUser;
    /**
     * If the action was performed using the credentials for your Amazon Web Services account, the details of your account.
     */
    root?: UserIdentityRoot;
    /**
     * The type of entity that performed the action.
     */
    type?: UserIdentityType;
  }
  export interface UserIdentityRoot {
    /**
     * The unique identifier for the Amazon Web Services account.
     */
    accountId?: __string;
    /**
     * The Amazon Resource Name (ARN) of the principal that performed the action. The last section of the ARN contains the name of the user or role that performed the action.
     */
    arn?: __string;
    /**
     * The unique identifier for the entity that performed the action.
     */
    principalId?: __string;
  }
  export type UserIdentityType = "AssumedRole"|"IAMUser"|"FederatedUser"|"Root"|"AWSAccount"|"AWSService"|string;
  export interface UserPausedDetails {
    /**
     * The date and time, in UTC and extended ISO 8601 format, when the job or job run will expire and be cancelled if you don't resume it first.
     */
    jobExpiresAt?: __timestampIso8601;
    /**
     * The Amazon Resource Name (ARN) of the Health event that Amazon Macie sent to notify you of the job or job run's pending expiration and cancellation. This value is null if a job has been paused for less than 23 days.
     */
    jobImminentExpirationHealthEventArn?: __string;
    /**
     * The date and time, in UTC and extended ISO 8601 format, when you paused the job.
     */
    jobPausedAt?: __timestampIso8601;
  }
  export interface WeeklySchedule {
    /**
     * The day of the week when Amazon Macie runs the job.
     */
    dayOfWeek?: DayOfWeek;
  }
  export type __boolean = boolean;
  export type __double = number;
  export type __integer = number;
  export type __listOfAdminAccount = AdminAccount[];
  export type __listOfAllowListSummary = AllowListSummary[];
  export type __listOfBatchGetCustomDataIdentifierSummary = BatchGetCustomDataIdentifierSummary[];
  export type __listOfBucketMetadata = BucketMetadata[];
  export type __listOfClassificationScopeSummary = ClassificationScopeSummary[];
  export type __listOfCriteriaForJob = CriteriaForJob[];
  export type __listOfCustomDataIdentifierSummary = CustomDataIdentifierSummary[];
  export type __listOfDetectedDataDetails = DetectedDataDetails[];
  export type __listOfDetection = Detection[];
  export type __listOfFinding = Finding[];
  export type __listOfFindingType = FindingType[];
  export type __listOfFindingsFilterListItem = FindingsFilterListItem[];
  export type __listOfGroupCount = GroupCount[];
  export type __listOfInvitation = Invitation[];
  export type __listOfJobScopeTerm = JobScopeTerm[];
  export type __listOfJobSummary = JobSummary[];
  export type __listOfKeyValuePair = KeyValuePair[];
  export type __listOfListJobsFilterTerm = ListJobsFilterTerm[];
  export type __listOfManagedDataIdentifierSummary = ManagedDataIdentifierSummary[];
  export type __listOfMatchingResource = MatchingResource[];
  export type __listOfMember = Member[];
  export type __listOfResourceProfileArtifact = ResourceProfileArtifact[];
  export type __listOfS3BucketDefinitionForJob = S3BucketDefinitionForJob[];
  export type __listOfS3BucketName = S3BucketName[];
  export type __listOfSearchResourcesCriteria = SearchResourcesCriteria[];
  export type __listOfSearchResourcesTagCriterionPair = SearchResourcesTagCriterionPair[];
  export type __listOfSensitivityInspectionTemplatesEntry = SensitivityInspectionTemplatesEntry[];
  export type __listOfSuppressDataIdentifier = SuppressDataIdentifier[];
  export type __listOfTagCriterionPairForJob = TagCriterionPairForJob[];
  export type __listOfTagValuePair = TagValuePair[];
  export type __listOfUnavailabilityReasonCode = UnavailabilityReasonCode[];
  export type __listOfUnprocessedAccount = UnprocessedAccount[];
  export type __listOfUsageByAccount = UsageByAccount[];
  export type __listOfUsageRecord = UsageRecord[];
  export type __listOfUsageStatisticsFilter = UsageStatisticsFilter[];
  export type __listOfUsageTotal = UsageTotal[];
  export type __listOf__string = __string[];
  export type __long = number;
  export type __string = string;
  export type __stringMin1Max1024PatternSS = string;
  export type __stringMin1Max128 = string;
  export type __stringMin1Max128Pattern = string;
  export type __stringMin1Max2048 = string;
  export type __stringMin1Max512PatternSS = string;
  export type __stringMin22Max22PatternAZ0922 = string;
  export type __stringMin3Max255PatternAZaZ093255 = string;
  export type __stringMin71Max89PatternArnAwsAwsCnAwsUsGovMacie2AZ19920D12AllowListAZ0922 = string;
  export type __timestampIso8601 = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-01-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Macie2 client.
   */
  export import Types = Macie2;
}
export = Macie2;
