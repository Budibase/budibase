import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Inspector2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Inspector2.Types.ClientConfiguration)
  config: Config & Inspector2.Types.ClientConfiguration;
  /**
   * Associates an Amazon Web Services account with an Amazon Inspector delegated administrator. An HTTP 200 response indicates the association was successfully started, but doesn’t indicate whether it was completed. You can check if the association completed by using ListMembers for multiple accounts or GetMembers for a single account.
   */
  associateMember(params: Inspector2.Types.AssociateMemberRequest, callback?: (err: AWSError, data: Inspector2.Types.AssociateMemberResponse) => void): Request<Inspector2.Types.AssociateMemberResponse, AWSError>;
  /**
   * Associates an Amazon Web Services account with an Amazon Inspector delegated administrator. An HTTP 200 response indicates the association was successfully started, but doesn’t indicate whether it was completed. You can check if the association completed by using ListMembers for multiple accounts or GetMembers for a single account.
   */
  associateMember(callback?: (err: AWSError, data: Inspector2.Types.AssociateMemberResponse) => void): Request<Inspector2.Types.AssociateMemberResponse, AWSError>;
  /**
   * Retrieves the Amazon Inspector status of multiple Amazon Web Services accounts within your environment.
   */
  batchGetAccountStatus(params: Inspector2.Types.BatchGetAccountStatusRequest, callback?: (err: AWSError, data: Inspector2.Types.BatchGetAccountStatusResponse) => void): Request<Inspector2.Types.BatchGetAccountStatusResponse, AWSError>;
  /**
   * Retrieves the Amazon Inspector status of multiple Amazon Web Services accounts within your environment.
   */
  batchGetAccountStatus(callback?: (err: AWSError, data: Inspector2.Types.BatchGetAccountStatusResponse) => void): Request<Inspector2.Types.BatchGetAccountStatusResponse, AWSError>;
  /**
   * Retrieves code snippets from findings that Amazon Inspector detected code vulnerabilities in.
   */
  batchGetCodeSnippet(params: Inspector2.Types.BatchGetCodeSnippetRequest, callback?: (err: AWSError, data: Inspector2.Types.BatchGetCodeSnippetResponse) => void): Request<Inspector2.Types.BatchGetCodeSnippetResponse, AWSError>;
  /**
   * Retrieves code snippets from findings that Amazon Inspector detected code vulnerabilities in.
   */
  batchGetCodeSnippet(callback?: (err: AWSError, data: Inspector2.Types.BatchGetCodeSnippetResponse) => void): Request<Inspector2.Types.BatchGetCodeSnippetResponse, AWSError>;
  /**
   * Gets vulnerability details for findings.
   */
  batchGetFindingDetails(params: Inspector2.Types.BatchGetFindingDetailsRequest, callback?: (err: AWSError, data: Inspector2.Types.BatchGetFindingDetailsResponse) => void): Request<Inspector2.Types.BatchGetFindingDetailsResponse, AWSError>;
  /**
   * Gets vulnerability details for findings.
   */
  batchGetFindingDetails(callback?: (err: AWSError, data: Inspector2.Types.BatchGetFindingDetailsResponse) => void): Request<Inspector2.Types.BatchGetFindingDetailsResponse, AWSError>;
  /**
   * Gets free trial status for multiple Amazon Web Services accounts.
   */
  batchGetFreeTrialInfo(params: Inspector2.Types.BatchGetFreeTrialInfoRequest, callback?: (err: AWSError, data: Inspector2.Types.BatchGetFreeTrialInfoResponse) => void): Request<Inspector2.Types.BatchGetFreeTrialInfoResponse, AWSError>;
  /**
   * Gets free trial status for multiple Amazon Web Services accounts.
   */
  batchGetFreeTrialInfo(callback?: (err: AWSError, data: Inspector2.Types.BatchGetFreeTrialInfoResponse) => void): Request<Inspector2.Types.BatchGetFreeTrialInfoResponse, AWSError>;
  /**
   * Retrieves Amazon Inspector deep inspection activation status of multiple member accounts within your organization. You must be the delegated administrator of an organization in Amazon Inspector to use this API.
   */
  batchGetMemberEc2DeepInspectionStatus(params: Inspector2.Types.BatchGetMemberEc2DeepInspectionStatusRequest, callback?: (err: AWSError, data: Inspector2.Types.BatchGetMemberEc2DeepInspectionStatusResponse) => void): Request<Inspector2.Types.BatchGetMemberEc2DeepInspectionStatusResponse, AWSError>;
  /**
   * Retrieves Amazon Inspector deep inspection activation status of multiple member accounts within your organization. You must be the delegated administrator of an organization in Amazon Inspector to use this API.
   */
  batchGetMemberEc2DeepInspectionStatus(callback?: (err: AWSError, data: Inspector2.Types.BatchGetMemberEc2DeepInspectionStatusResponse) => void): Request<Inspector2.Types.BatchGetMemberEc2DeepInspectionStatusResponse, AWSError>;
  /**
   * Activates or deactivates Amazon Inspector deep inspection for the provided member accounts in your organization. You must be the delegated administrator of an organization in Amazon Inspector to use this API.
   */
  batchUpdateMemberEc2DeepInspectionStatus(params: Inspector2.Types.BatchUpdateMemberEc2DeepInspectionStatusRequest, callback?: (err: AWSError, data: Inspector2.Types.BatchUpdateMemberEc2DeepInspectionStatusResponse) => void): Request<Inspector2.Types.BatchUpdateMemberEc2DeepInspectionStatusResponse, AWSError>;
  /**
   * Activates or deactivates Amazon Inspector deep inspection for the provided member accounts in your organization. You must be the delegated administrator of an organization in Amazon Inspector to use this API.
   */
  batchUpdateMemberEc2DeepInspectionStatus(callback?: (err: AWSError, data: Inspector2.Types.BatchUpdateMemberEc2DeepInspectionStatusResponse) => void): Request<Inspector2.Types.BatchUpdateMemberEc2DeepInspectionStatusResponse, AWSError>;
  /**
   * Cancels the given findings report.
   */
  cancelFindingsReport(params: Inspector2.Types.CancelFindingsReportRequest, callback?: (err: AWSError, data: Inspector2.Types.CancelFindingsReportResponse) => void): Request<Inspector2.Types.CancelFindingsReportResponse, AWSError>;
  /**
   * Cancels the given findings report.
   */
  cancelFindingsReport(callback?: (err: AWSError, data: Inspector2.Types.CancelFindingsReportResponse) => void): Request<Inspector2.Types.CancelFindingsReportResponse, AWSError>;
  /**
   * Cancels a software bill of materials (SBOM) report.
   */
  cancelSbomExport(params: Inspector2.Types.CancelSbomExportRequest, callback?: (err: AWSError, data: Inspector2.Types.CancelSbomExportResponse) => void): Request<Inspector2.Types.CancelSbomExportResponse, AWSError>;
  /**
   * Cancels a software bill of materials (SBOM) report.
   */
  cancelSbomExport(callback?: (err: AWSError, data: Inspector2.Types.CancelSbomExportResponse) => void): Request<Inspector2.Types.CancelSbomExportResponse, AWSError>;
  /**
   * Creates a filter resource using specified filter criteria. When the filter action is set to SUPPRESS this action creates a suppression rule.
   */
  createFilter(params: Inspector2.Types.CreateFilterRequest, callback?: (err: AWSError, data: Inspector2.Types.CreateFilterResponse) => void): Request<Inspector2.Types.CreateFilterResponse, AWSError>;
  /**
   * Creates a filter resource using specified filter criteria. When the filter action is set to SUPPRESS this action creates a suppression rule.
   */
  createFilter(callback?: (err: AWSError, data: Inspector2.Types.CreateFilterResponse) => void): Request<Inspector2.Types.CreateFilterResponse, AWSError>;
  /**
   * Creates a finding report. By default only ACTIVE findings are returned in the report. To see SUPRESSED or CLOSED findings you must specify a value for the findingStatus filter criteria. 
   */
  createFindingsReport(params: Inspector2.Types.CreateFindingsReportRequest, callback?: (err: AWSError, data: Inspector2.Types.CreateFindingsReportResponse) => void): Request<Inspector2.Types.CreateFindingsReportResponse, AWSError>;
  /**
   * Creates a finding report. By default only ACTIVE findings are returned in the report. To see SUPRESSED or CLOSED findings you must specify a value for the findingStatus filter criteria. 
   */
  createFindingsReport(callback?: (err: AWSError, data: Inspector2.Types.CreateFindingsReportResponse) => void): Request<Inspector2.Types.CreateFindingsReportResponse, AWSError>;
  /**
   * Creates a software bill of materials (SBOM) report.
   */
  createSbomExport(params: Inspector2.Types.CreateSbomExportRequest, callback?: (err: AWSError, data: Inspector2.Types.CreateSbomExportResponse) => void): Request<Inspector2.Types.CreateSbomExportResponse, AWSError>;
  /**
   * Creates a software bill of materials (SBOM) report.
   */
  createSbomExport(callback?: (err: AWSError, data: Inspector2.Types.CreateSbomExportResponse) => void): Request<Inspector2.Types.CreateSbomExportResponse, AWSError>;
  /**
   * Deletes a filter resource.
   */
  deleteFilter(params: Inspector2.Types.DeleteFilterRequest, callback?: (err: AWSError, data: Inspector2.Types.DeleteFilterResponse) => void): Request<Inspector2.Types.DeleteFilterResponse, AWSError>;
  /**
   * Deletes a filter resource.
   */
  deleteFilter(callback?: (err: AWSError, data: Inspector2.Types.DeleteFilterResponse) => void): Request<Inspector2.Types.DeleteFilterResponse, AWSError>;
  /**
   * Describe Amazon Inspector configuration settings for an Amazon Web Services organization.
   */
  describeOrganizationConfiguration(params: Inspector2.Types.DescribeOrganizationConfigurationRequest, callback?: (err: AWSError, data: Inspector2.Types.DescribeOrganizationConfigurationResponse) => void): Request<Inspector2.Types.DescribeOrganizationConfigurationResponse, AWSError>;
  /**
   * Describe Amazon Inspector configuration settings for an Amazon Web Services organization.
   */
  describeOrganizationConfiguration(callback?: (err: AWSError, data: Inspector2.Types.DescribeOrganizationConfigurationResponse) => void): Request<Inspector2.Types.DescribeOrganizationConfigurationResponse, AWSError>;
  /**
   * Disables Amazon Inspector scans for one or more Amazon Web Services accounts. Disabling all scan types in an account disables the Amazon Inspector service.
   */
  disable(params: Inspector2.Types.DisableRequest, callback?: (err: AWSError, data: Inspector2.Types.DisableResponse) => void): Request<Inspector2.Types.DisableResponse, AWSError>;
  /**
   * Disables Amazon Inspector scans for one or more Amazon Web Services accounts. Disabling all scan types in an account disables the Amazon Inspector service.
   */
  disable(callback?: (err: AWSError, data: Inspector2.Types.DisableResponse) => void): Request<Inspector2.Types.DisableResponse, AWSError>;
  /**
   * Disables the Amazon Inspector delegated administrator for your organization.
   */
  disableDelegatedAdminAccount(params: Inspector2.Types.DisableDelegatedAdminAccountRequest, callback?: (err: AWSError, data: Inspector2.Types.DisableDelegatedAdminAccountResponse) => void): Request<Inspector2.Types.DisableDelegatedAdminAccountResponse, AWSError>;
  /**
   * Disables the Amazon Inspector delegated administrator for your organization.
   */
  disableDelegatedAdminAccount(callback?: (err: AWSError, data: Inspector2.Types.DisableDelegatedAdminAccountResponse) => void): Request<Inspector2.Types.DisableDelegatedAdminAccountResponse, AWSError>;
  /**
   * Disassociates a member account from an Amazon Inspector delegated administrator.
   */
  disassociateMember(params: Inspector2.Types.DisassociateMemberRequest, callback?: (err: AWSError, data: Inspector2.Types.DisassociateMemberResponse) => void): Request<Inspector2.Types.DisassociateMemberResponse, AWSError>;
  /**
   * Disassociates a member account from an Amazon Inspector delegated administrator.
   */
  disassociateMember(callback?: (err: AWSError, data: Inspector2.Types.DisassociateMemberResponse) => void): Request<Inspector2.Types.DisassociateMemberResponse, AWSError>;
  /**
   * Enables Amazon Inspector scans for one or more Amazon Web Services accounts.
   */
  enable(params: Inspector2.Types.EnableRequest, callback?: (err: AWSError, data: Inspector2.Types.EnableResponse) => void): Request<Inspector2.Types.EnableResponse, AWSError>;
  /**
   * Enables Amazon Inspector scans for one or more Amazon Web Services accounts.
   */
  enable(callback?: (err: AWSError, data: Inspector2.Types.EnableResponse) => void): Request<Inspector2.Types.EnableResponse, AWSError>;
  /**
   * Enables the Amazon Inspector delegated administrator for your Organizations organization.
   */
  enableDelegatedAdminAccount(params: Inspector2.Types.EnableDelegatedAdminAccountRequest, callback?: (err: AWSError, data: Inspector2.Types.EnableDelegatedAdminAccountResponse) => void): Request<Inspector2.Types.EnableDelegatedAdminAccountResponse, AWSError>;
  /**
   * Enables the Amazon Inspector delegated administrator for your Organizations organization.
   */
  enableDelegatedAdminAccount(callback?: (err: AWSError, data: Inspector2.Types.EnableDelegatedAdminAccountResponse) => void): Request<Inspector2.Types.EnableDelegatedAdminAccountResponse, AWSError>;
  /**
   * Retrieves setting configurations for Inspector scans.
   */
  getConfiguration(params: Inspector2.Types.GetConfigurationRequest, callback?: (err: AWSError, data: Inspector2.Types.GetConfigurationResponse) => void): Request<Inspector2.Types.GetConfigurationResponse, AWSError>;
  /**
   * Retrieves setting configurations for Inspector scans.
   */
  getConfiguration(callback?: (err: AWSError, data: Inspector2.Types.GetConfigurationResponse) => void): Request<Inspector2.Types.GetConfigurationResponse, AWSError>;
  /**
   * Retrieves information about the Amazon Inspector delegated administrator for your organization.
   */
  getDelegatedAdminAccount(params: Inspector2.Types.GetDelegatedAdminAccountRequest, callback?: (err: AWSError, data: Inspector2.Types.GetDelegatedAdminAccountResponse) => void): Request<Inspector2.Types.GetDelegatedAdminAccountResponse, AWSError>;
  /**
   * Retrieves information about the Amazon Inspector delegated administrator for your organization.
   */
  getDelegatedAdminAccount(callback?: (err: AWSError, data: Inspector2.Types.GetDelegatedAdminAccountResponse) => void): Request<Inspector2.Types.GetDelegatedAdminAccountResponse, AWSError>;
  /**
   * Retrieves the activation status of Amazon Inspector deep inspection and custom paths associated with your account. 
   */
  getEc2DeepInspectionConfiguration(params: Inspector2.Types.GetEc2DeepInspectionConfigurationRequest, callback?: (err: AWSError, data: Inspector2.Types.GetEc2DeepInspectionConfigurationResponse) => void): Request<Inspector2.Types.GetEc2DeepInspectionConfigurationResponse, AWSError>;
  /**
   * Retrieves the activation status of Amazon Inspector deep inspection and custom paths associated with your account. 
   */
  getEc2DeepInspectionConfiguration(callback?: (err: AWSError, data: Inspector2.Types.GetEc2DeepInspectionConfigurationResponse) => void): Request<Inspector2.Types.GetEc2DeepInspectionConfigurationResponse, AWSError>;
  /**
   * Gets an encryption key.
   */
  getEncryptionKey(params: Inspector2.Types.GetEncryptionKeyRequest, callback?: (err: AWSError, data: Inspector2.Types.GetEncryptionKeyResponse) => void): Request<Inspector2.Types.GetEncryptionKeyResponse, AWSError>;
  /**
   * Gets an encryption key.
   */
  getEncryptionKey(callback?: (err: AWSError, data: Inspector2.Types.GetEncryptionKeyResponse) => void): Request<Inspector2.Types.GetEncryptionKeyResponse, AWSError>;
  /**
   * Gets the status of a findings report.
   */
  getFindingsReportStatus(params: Inspector2.Types.GetFindingsReportStatusRequest, callback?: (err: AWSError, data: Inspector2.Types.GetFindingsReportStatusResponse) => void): Request<Inspector2.Types.GetFindingsReportStatusResponse, AWSError>;
  /**
   * Gets the status of a findings report.
   */
  getFindingsReportStatus(callback?: (err: AWSError, data: Inspector2.Types.GetFindingsReportStatusResponse) => void): Request<Inspector2.Types.GetFindingsReportStatusResponse, AWSError>;
  /**
   * Gets member information for your organization.
   */
  getMember(params: Inspector2.Types.GetMemberRequest, callback?: (err: AWSError, data: Inspector2.Types.GetMemberResponse) => void): Request<Inspector2.Types.GetMemberResponse, AWSError>;
  /**
   * Gets member information for your organization.
   */
  getMember(callback?: (err: AWSError, data: Inspector2.Types.GetMemberResponse) => void): Request<Inspector2.Types.GetMemberResponse, AWSError>;
  /**
   * Gets details of a software bill of materials (SBOM) report.
   */
  getSbomExport(params: Inspector2.Types.GetSbomExportRequest, callback?: (err: AWSError, data: Inspector2.Types.GetSbomExportResponse) => void): Request<Inspector2.Types.GetSbomExportResponse, AWSError>;
  /**
   * Gets details of a software bill of materials (SBOM) report.
   */
  getSbomExport(callback?: (err: AWSError, data: Inspector2.Types.GetSbomExportResponse) => void): Request<Inspector2.Types.GetSbomExportResponse, AWSError>;
  /**
   * Lists the permissions an account has to configure Amazon Inspector.
   */
  listAccountPermissions(params: Inspector2.Types.ListAccountPermissionsRequest, callback?: (err: AWSError, data: Inspector2.Types.ListAccountPermissionsResponse) => void): Request<Inspector2.Types.ListAccountPermissionsResponse, AWSError>;
  /**
   * Lists the permissions an account has to configure Amazon Inspector.
   */
  listAccountPermissions(callback?: (err: AWSError, data: Inspector2.Types.ListAccountPermissionsResponse) => void): Request<Inspector2.Types.ListAccountPermissionsResponse, AWSError>;
  /**
   * Lists coverage details for you environment.
   */
  listCoverage(params: Inspector2.Types.ListCoverageRequest, callback?: (err: AWSError, data: Inspector2.Types.ListCoverageResponse) => void): Request<Inspector2.Types.ListCoverageResponse, AWSError>;
  /**
   * Lists coverage details for you environment.
   */
  listCoverage(callback?: (err: AWSError, data: Inspector2.Types.ListCoverageResponse) => void): Request<Inspector2.Types.ListCoverageResponse, AWSError>;
  /**
   * Lists Amazon Inspector coverage statistics for your environment.
   */
  listCoverageStatistics(params: Inspector2.Types.ListCoverageStatisticsRequest, callback?: (err: AWSError, data: Inspector2.Types.ListCoverageStatisticsResponse) => void): Request<Inspector2.Types.ListCoverageStatisticsResponse, AWSError>;
  /**
   * Lists Amazon Inspector coverage statistics for your environment.
   */
  listCoverageStatistics(callback?: (err: AWSError, data: Inspector2.Types.ListCoverageStatisticsResponse) => void): Request<Inspector2.Types.ListCoverageStatisticsResponse, AWSError>;
  /**
   * Lists information about the Amazon Inspector delegated administrator of your organization.
   */
  listDelegatedAdminAccounts(params: Inspector2.Types.ListDelegatedAdminAccountsRequest, callback?: (err: AWSError, data: Inspector2.Types.ListDelegatedAdminAccountsResponse) => void): Request<Inspector2.Types.ListDelegatedAdminAccountsResponse, AWSError>;
  /**
   * Lists information about the Amazon Inspector delegated administrator of your organization.
   */
  listDelegatedAdminAccounts(callback?: (err: AWSError, data: Inspector2.Types.ListDelegatedAdminAccountsResponse) => void): Request<Inspector2.Types.ListDelegatedAdminAccountsResponse, AWSError>;
  /**
   * Lists the filters associated with your account.
   */
  listFilters(params: Inspector2.Types.ListFiltersRequest, callback?: (err: AWSError, data: Inspector2.Types.ListFiltersResponse) => void): Request<Inspector2.Types.ListFiltersResponse, AWSError>;
  /**
   * Lists the filters associated with your account.
   */
  listFilters(callback?: (err: AWSError, data: Inspector2.Types.ListFiltersResponse) => void): Request<Inspector2.Types.ListFiltersResponse, AWSError>;
  /**
   * Lists aggregated finding data for your environment based on specific criteria.
   */
  listFindingAggregations(params: Inspector2.Types.ListFindingAggregationsRequest, callback?: (err: AWSError, data: Inspector2.Types.ListFindingAggregationsResponse) => void): Request<Inspector2.Types.ListFindingAggregationsResponse, AWSError>;
  /**
   * Lists aggregated finding data for your environment based on specific criteria.
   */
  listFindingAggregations(callback?: (err: AWSError, data: Inspector2.Types.ListFindingAggregationsResponse) => void): Request<Inspector2.Types.ListFindingAggregationsResponse, AWSError>;
  /**
   * Lists findings for your environment.
   */
  listFindings(params: Inspector2.Types.ListFindingsRequest, callback?: (err: AWSError, data: Inspector2.Types.ListFindingsResponse) => void): Request<Inspector2.Types.ListFindingsResponse, AWSError>;
  /**
   * Lists findings for your environment.
   */
  listFindings(callback?: (err: AWSError, data: Inspector2.Types.ListFindingsResponse) => void): Request<Inspector2.Types.ListFindingsResponse, AWSError>;
  /**
   * List members associated with the Amazon Inspector delegated administrator for your organization.
   */
  listMembers(params: Inspector2.Types.ListMembersRequest, callback?: (err: AWSError, data: Inspector2.Types.ListMembersResponse) => void): Request<Inspector2.Types.ListMembersResponse, AWSError>;
  /**
   * List members associated with the Amazon Inspector delegated administrator for your organization.
   */
  listMembers(callback?: (err: AWSError, data: Inspector2.Types.ListMembersResponse) => void): Request<Inspector2.Types.ListMembersResponse, AWSError>;
  /**
   * Lists all tags attached to a given resource.
   */
  listTagsForResource(params: Inspector2.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Inspector2.Types.ListTagsForResourceResponse) => void): Request<Inspector2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags attached to a given resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Inspector2.Types.ListTagsForResourceResponse) => void): Request<Inspector2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the Amazon Inspector usage totals over the last 30 days.
   */
  listUsageTotals(params: Inspector2.Types.ListUsageTotalsRequest, callback?: (err: AWSError, data: Inspector2.Types.ListUsageTotalsResponse) => void): Request<Inspector2.Types.ListUsageTotalsResponse, AWSError>;
  /**
   * Lists the Amazon Inspector usage totals over the last 30 days.
   */
  listUsageTotals(callback?: (err: AWSError, data: Inspector2.Types.ListUsageTotalsResponse) => void): Request<Inspector2.Types.ListUsageTotalsResponse, AWSError>;
  /**
   * Resets an encryption key. After the key is reset your resources will be encrypted by an Amazon Web Services owned key.
   */
  resetEncryptionKey(params: Inspector2.Types.ResetEncryptionKeyRequest, callback?: (err: AWSError, data: Inspector2.Types.ResetEncryptionKeyResponse) => void): Request<Inspector2.Types.ResetEncryptionKeyResponse, AWSError>;
  /**
   * Resets an encryption key. After the key is reset your resources will be encrypted by an Amazon Web Services owned key.
   */
  resetEncryptionKey(callback?: (err: AWSError, data: Inspector2.Types.ResetEncryptionKeyResponse) => void): Request<Inspector2.Types.ResetEncryptionKeyResponse, AWSError>;
  /**
   * Lists Amazon Inspector coverage details for a specific vulnerability.
   */
  searchVulnerabilities(params: Inspector2.Types.SearchVulnerabilitiesRequest, callback?: (err: AWSError, data: Inspector2.Types.SearchVulnerabilitiesResponse) => void): Request<Inspector2.Types.SearchVulnerabilitiesResponse, AWSError>;
  /**
   * Lists Amazon Inspector coverage details for a specific vulnerability.
   */
  searchVulnerabilities(callback?: (err: AWSError, data: Inspector2.Types.SearchVulnerabilitiesResponse) => void): Request<Inspector2.Types.SearchVulnerabilitiesResponse, AWSError>;
  /**
   * Adds tags to a resource.
   */
  tagResource(params: Inspector2.Types.TagResourceRequest, callback?: (err: AWSError, data: Inspector2.Types.TagResourceResponse) => void): Request<Inspector2.Types.TagResourceResponse, AWSError>;
  /**
   * Adds tags to a resource.
   */
  tagResource(callback?: (err: AWSError, data: Inspector2.Types.TagResourceResponse) => void): Request<Inspector2.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(params: Inspector2.Types.UntagResourceRequest, callback?: (err: AWSError, data: Inspector2.Types.UntagResourceResponse) => void): Request<Inspector2.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: Inspector2.Types.UntagResourceResponse) => void): Request<Inspector2.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates setting configurations for your Amazon Inspector account. When you use this API as an Amazon Inspector delegated administrator this updates the setting for all accounts you manage. Member accounts in an organization cannot update this setting.
   */
  updateConfiguration(params: Inspector2.Types.UpdateConfigurationRequest, callback?: (err: AWSError, data: Inspector2.Types.UpdateConfigurationResponse) => void): Request<Inspector2.Types.UpdateConfigurationResponse, AWSError>;
  /**
   * Updates setting configurations for your Amazon Inspector account. When you use this API as an Amazon Inspector delegated administrator this updates the setting for all accounts you manage. Member accounts in an organization cannot update this setting.
   */
  updateConfiguration(callback?: (err: AWSError, data: Inspector2.Types.UpdateConfigurationResponse) => void): Request<Inspector2.Types.UpdateConfigurationResponse, AWSError>;
  /**
   * Activates, deactivates Amazon Inspector deep inspection, or updates custom paths for your account. 
   */
  updateEc2DeepInspectionConfiguration(params: Inspector2.Types.UpdateEc2DeepInspectionConfigurationRequest, callback?: (err: AWSError, data: Inspector2.Types.UpdateEc2DeepInspectionConfigurationResponse) => void): Request<Inspector2.Types.UpdateEc2DeepInspectionConfigurationResponse, AWSError>;
  /**
   * Activates, deactivates Amazon Inspector deep inspection, or updates custom paths for your account. 
   */
  updateEc2DeepInspectionConfiguration(callback?: (err: AWSError, data: Inspector2.Types.UpdateEc2DeepInspectionConfigurationResponse) => void): Request<Inspector2.Types.UpdateEc2DeepInspectionConfigurationResponse, AWSError>;
  /**
   * Updates an encryption key. A ResourceNotFoundException means that an AWS owned key is being used for encryption.
   */
  updateEncryptionKey(params: Inspector2.Types.UpdateEncryptionKeyRequest, callback?: (err: AWSError, data: Inspector2.Types.UpdateEncryptionKeyResponse) => void): Request<Inspector2.Types.UpdateEncryptionKeyResponse, AWSError>;
  /**
   * Updates an encryption key. A ResourceNotFoundException means that an AWS owned key is being used for encryption.
   */
  updateEncryptionKey(callback?: (err: AWSError, data: Inspector2.Types.UpdateEncryptionKeyResponse) => void): Request<Inspector2.Types.UpdateEncryptionKeyResponse, AWSError>;
  /**
   * Specifies the action that is to be applied to the findings that match the filter.
   */
  updateFilter(params: Inspector2.Types.UpdateFilterRequest, callback?: (err: AWSError, data: Inspector2.Types.UpdateFilterResponse) => void): Request<Inspector2.Types.UpdateFilterResponse, AWSError>;
  /**
   * Specifies the action that is to be applied to the findings that match the filter.
   */
  updateFilter(callback?: (err: AWSError, data: Inspector2.Types.UpdateFilterResponse) => void): Request<Inspector2.Types.UpdateFilterResponse, AWSError>;
  /**
   * Updates the Amazon Inspector deep inspection custom paths for your organization. You must be an Amazon Inspector delegated administrator to use this API.
   */
  updateOrgEc2DeepInspectionConfiguration(params: Inspector2.Types.UpdateOrgEc2DeepInspectionConfigurationRequest, callback?: (err: AWSError, data: Inspector2.Types.UpdateOrgEc2DeepInspectionConfigurationResponse) => void): Request<Inspector2.Types.UpdateOrgEc2DeepInspectionConfigurationResponse, AWSError>;
  /**
   * Updates the Amazon Inspector deep inspection custom paths for your organization. You must be an Amazon Inspector delegated administrator to use this API.
   */
  updateOrgEc2DeepInspectionConfiguration(callback?: (err: AWSError, data: Inspector2.Types.UpdateOrgEc2DeepInspectionConfigurationResponse) => void): Request<Inspector2.Types.UpdateOrgEc2DeepInspectionConfigurationResponse, AWSError>;
  /**
   * Updates the configurations for your Amazon Inspector organization.
   */
  updateOrganizationConfiguration(params: Inspector2.Types.UpdateOrganizationConfigurationRequest, callback?: (err: AWSError, data: Inspector2.Types.UpdateOrganizationConfigurationResponse) => void): Request<Inspector2.Types.UpdateOrganizationConfigurationResponse, AWSError>;
  /**
   * Updates the configurations for your Amazon Inspector organization.
   */
  updateOrganizationConfiguration(callback?: (err: AWSError, data: Inspector2.Types.UpdateOrganizationConfigurationResponse) => void): Request<Inspector2.Types.UpdateOrganizationConfigurationResponse, AWSError>;
}
declare namespace Inspector2 {
  export interface Account {
    /**
     * The ID of the Amazon Web Services account.
     */
    accountId: AccountId;
    /**
     * Details of the status of Amazon Inspector scans by resource type.
     */
    resourceStatus: ResourceStatus;
    /**
     * The status of Amazon Inspector for the account.
     */
    status: Status;
  }
  export interface AccountAggregation {
    /**
     * The type of finding.
     */
    findingType?: AggregationFindingType;
    /**
     * The type of resource.
     */
    resourceType?: AggregationResourceType;
    /**
     * The value to sort by.
     */
    sortBy?: AccountSortBy;
    /**
     * The sort order (ascending or descending).
     */
    sortOrder?: SortOrder;
  }
  export interface AccountAggregationResponse {
    /**
     * The Amazon Web Services account ID.
     */
    accountId?: AccountId;
    /**
     * The number of findings by severity.
     */
    severityCounts?: SeverityCounts;
  }
  export type AccountId = string;
  export type AccountIdSet = AccountId[];
  export type AccountList = Account[];
  export type AccountSortBy = "CRITICAL"|"HIGH"|"ALL"|string;
  export interface AccountState {
    /**
     * The Amazon Web Services account ID.
     */
    accountId: AccountId;
    /**
     * An object detailing which resources Amazon Inspector is enabled to scan for the account.
     */
    resourceState: ResourceState;
    /**
     * An object detailing the status of Amazon Inspector for the account.
     */
    state: State;
  }
  export type AccountStateList = AccountState[];
  export type AggCounts = number;
  export type AggregationFindingType = "NETWORK_REACHABILITY"|"PACKAGE_VULNERABILITY"|"CODE_VULNERABILITY"|string;
  export interface AggregationRequest {
    /**
     * An object that contains details about an aggregation request based on Amazon Web Services account IDs.
     */
    accountAggregation?: AccountAggregation;
    /**
     * An object that contains details about an aggregation request based on Amazon Machine Images (AMIs).
     */
    amiAggregation?: AmiAggregation;
    /**
     * An object that contains details about an aggregation request based on Amazon ECR container images.
     */
    awsEcrContainerAggregation?: AwsEcrContainerAggregation;
    /**
     * An object that contains details about an aggregation request based on Amazon EC2 instances.
     */
    ec2InstanceAggregation?: Ec2InstanceAggregation;
    /**
     * An object that contains details about an aggregation request based on finding types.
     */
    findingTypeAggregation?: FindingTypeAggregation;
    /**
     * An object that contains details about an aggregation request based on container image layers.
     */
    imageLayerAggregation?: ImageLayerAggregation;
    /**
     * Returns an object with findings aggregated by AWS Lambda function.
     */
    lambdaFunctionAggregation?: LambdaFunctionAggregation;
    /**
     * Returns an object with findings aggregated by AWS Lambda layer.
     */
    lambdaLayerAggregation?: LambdaLayerAggregation;
    /**
     * An object that contains details about an aggregation request based on operating system package type.
     */
    packageAggregation?: PackageAggregation;
    /**
     * An object that contains details about an aggregation request based on Amazon ECR repositories.
     */
    repositoryAggregation?: RepositoryAggregation;
    /**
     * An object that contains details about an aggregation request based on finding title.
     */
    titleAggregation?: TitleAggregation;
  }
  export type AggregationResourceType = "AWS_EC2_INSTANCE"|"AWS_ECR_CONTAINER_IMAGE"|"AWS_LAMBDA_FUNCTION"|string;
  export interface AggregationResponse {
    /**
     * An object that contains details about an aggregation response based on Amazon Web Services account IDs.
     */
    accountAggregation?: AccountAggregationResponse;
    /**
     * An object that contains details about an aggregation response based on Amazon Machine Images (AMIs).
     */
    amiAggregation?: AmiAggregationResponse;
    /**
     * An object that contains details about an aggregation response based on Amazon ECR container images.
     */
    awsEcrContainerAggregation?: AwsEcrContainerAggregationResponse;
    /**
     * An object that contains details about an aggregation response based on Amazon EC2 instances.
     */
    ec2InstanceAggregation?: Ec2InstanceAggregationResponse;
    /**
     * An object that contains details about an aggregation response based on finding types.
     */
    findingTypeAggregation?: FindingTypeAggregationResponse;
    /**
     * An object that contains details about an aggregation response based on container image layers.
     */
    imageLayerAggregation?: ImageLayerAggregationResponse;
    /**
     * An aggregation of findings by AWS Lambda function.
     */
    lambdaFunctionAggregation?: LambdaFunctionAggregationResponse;
    /**
     * An aggregation of findings by AWS Lambda layer.
     */
    lambdaLayerAggregation?: LambdaLayerAggregationResponse;
    /**
     * An object that contains details about an aggregation response based on operating system package type.
     */
    packageAggregation?: PackageAggregationResponse;
    /**
     * An object that contains details about an aggregation response based on Amazon ECR repositories.
     */
    repositoryAggregation?: RepositoryAggregationResponse;
    /**
     * An object that contains details about an aggregation response based on finding title.
     */
    titleAggregation?: TitleAggregationResponse;
  }
  export type AggregationResponseList = AggregationResponse[];
  export type AggregationType = "FINDING_TYPE"|"PACKAGE"|"TITLE"|"REPOSITORY"|"AMI"|"AWS_EC2_INSTANCE"|"AWS_ECR_CONTAINER"|"IMAGE_LAYER"|"ACCOUNT"|"AWS_LAMBDA_FUNCTION"|"LAMBDA_LAYER"|string;
  export interface AmiAggregation {
    /**
     * The IDs of AMIs to aggregate findings for.
     */
    amis?: StringFilterList;
    /**
     * The value to sort results by.
     */
    sortBy?: AmiSortBy;
    /**
     * The order to sort results by.
     */
    sortOrder?: SortOrder;
  }
  export interface AmiAggregationResponse {
    /**
     * The Amazon Web Services account ID for the AMI.
     */
    accountId?: AccountId;
    /**
     * The IDs of Amazon EC2 instances using this AMI.
     */
    affectedInstances?: Long;
    /**
     * The ID of the AMI that findings were aggregated for.
     */
    ami: AmiId;
    /**
     * An object that contains the count of matched findings per severity.
     */
    severityCounts?: SeverityCounts;
  }
  export type AmiId = string;
  export type AmiSortBy = "CRITICAL"|"HIGH"|"ALL"|"AFFECTED_INSTANCES"|string;
  export type Architecture = "X86_64"|"ARM64"|string;
  export type ArchitectureList = Architecture[];
  export type Arn = string;
  export interface AssociateMemberRequest {
    /**
     * The Amazon Web Services account ID of the member account to be associated.
     */
    accountId: AccountId;
  }
  export interface AssociateMemberResponse {
    /**
     * The Amazon Web Services account ID of the successfully associated member account.
     */
    accountId: AccountId;
  }
  export interface AtigData {
    /**
     * The date and time this vulnerability was first observed.
     */
    firstSeen?: FirstSeen;
    /**
     * The date and time this vulnerability was last observed.
     */
    lastSeen?: LastSeen;
    /**
     * The commercial sectors this vulnerability targets.
     */
    targets?: Targets;
    /**
     * The MITRE ATT&amp;CK tactics, techniques, and procedures (TTPs) associated with vulnerability.
     */
    ttps?: Ttps;
  }
  export interface AutoEnable {
    /**
     * Represents whether Amazon EC2 scans are automatically enabled for new members of your Amazon Inspector organization.
     */
    ec2: Boolean;
    /**
     * Represents whether Amazon ECR scans are automatically enabled for new members of your Amazon Inspector organization.
     */
    ecr: Boolean;
    /**
     * Represents whether AWS Lambda standard scans are automatically enabled for new members of your Amazon Inspector organization. 
     */
    lambda?: Boolean;
    /**
     * Represents whether AWS Lambda code scans are automatically enabled for new members of your Amazon Inspector organization.  &lt;/p&gt; 
     */
    lambdaCode?: Boolean;
  }
  export interface AwsEc2InstanceDetails {
    /**
     * The IAM instance profile ARN of the Amazon EC2 instance.
     */
    iamInstanceProfileArn?: NonEmptyString;
    /**
     * The image ID of the Amazon EC2 instance.
     */
    imageId?: NonEmptyString;
    /**
     * The IPv4 addresses of the Amazon EC2 instance.
     */
    ipV4Addresses?: IpV4AddressList;
    /**
     * The IPv6 addresses of the Amazon EC2 instance.
     */
    ipV6Addresses?: IpV6AddressList;
    /**
     * The name of the key pair used to launch the Amazon EC2 instance.
     */
    keyName?: NonEmptyString;
    /**
     * The date and time the Amazon EC2 instance was launched at.
     */
    launchedAt?: DateTimeTimestamp;
    /**
     * The platform of the Amazon EC2 instance.
     */
    platform?: Platform;
    /**
     * The subnet ID of the Amazon EC2 instance.
     */
    subnetId?: NonEmptyString;
    /**
     * The type of the Amazon EC2 instance.
     */
    type?: NonEmptyString;
    /**
     * The VPC ID of the Amazon EC2 instance.
     */
    vpcId?: NonEmptyString;
  }
  export interface AwsEcrContainerAggregation {
    /**
     * The architecture of the containers.
     */
    architectures?: StringFilterList;
    /**
     * The image SHA values.
     */
    imageShas?: StringFilterList;
    /**
     * The image tags.
     */
    imageTags?: StringFilterList;
    /**
     * The container repositories.
     */
    repositories?: StringFilterList;
    /**
     * The container resource IDs.
     */
    resourceIds?: StringFilterList;
    /**
     * The value to sort by.
     */
    sortBy?: AwsEcrContainerSortBy;
    /**
     * The sort order (ascending or descending).
     */
    sortOrder?: SortOrder;
  }
  export interface AwsEcrContainerAggregationResponse {
    /**
     * The Amazon Web Services account ID of the account that owns the container.
     */
    accountId?: AccountId;
    /**
     * The architecture of the container.
     */
    architecture?: String;
    /**
     * The SHA value of the container image.
     */
    imageSha?: String;
    /**
     * The container image stags.
     */
    imageTags?: StringList;
    /**
     * The container repository.
     */
    repository?: String;
    /**
     * The resource ID of the container.
     */
    resourceId: NonEmptyString;
    /**
     * The number of finding by severity.
     */
    severityCounts?: SeverityCounts;
  }
  export interface AwsEcrContainerImageDetails {
    /**
     * The architecture of the Amazon ECR container image.
     */
    architecture?: NonEmptyString;
    /**
     * The image author of the Amazon ECR container image.
     */
    author?: String;
    /**
     * The image hash of the Amazon ECR container image.
     */
    imageHash: ImageHash;
    /**
     * The image tags attached to the Amazon ECR container image.
     */
    imageTags?: ImageTagList;
    /**
     * The platform of the Amazon ECR container image.
     */
    platform?: Platform;
    /**
     * The date and time the Amazon ECR container image was pushed.
     */
    pushedAt?: DateTimeTimestamp;
    /**
     * The registry for the Amazon ECR container image.
     */
    registry: NonEmptyString;
    /**
     * The name of the repository the Amazon ECR container image resides in.
     */
    repositoryName: NonEmptyString;
  }
  export type AwsEcrContainerSortBy = "CRITICAL"|"HIGH"|"ALL"|string;
  export interface AwsLambdaFunctionDetails {
    /**
     * The instruction set architecture that the AWS Lambda function supports. Architecture is a string array with one of the valid values. The default architecture value is x86_64.
     */
    architectures?: ArchitectureList;
    /**
     * The SHA256 hash of the AWS Lambda function's deployment package.
     */
    codeSha256: NonEmptyString;
    /**
     * The AWS Lambda function's execution role.
     */
    executionRoleArn: ExecutionRoleArn;
    /**
     * The name of the AWS Lambda function.
     */
    functionName: FunctionName;
    /**
     * The date and time that a user last updated the configuration, in ISO 8601 format 
     */
    lastModifiedAt?: Timestamp;
    /**
     * The AWS Lambda function's  layers. A Lambda function can have up to five layers.
     */
    layers?: LayerList;
    /**
     * The type of deployment package. Set to Image for container image and set Zip for .zip file archive.
     */
    packageType?: PackageType;
    /**
     * The runtime environment for the AWS Lambda function.
     */
    runtime: Runtime;
    /**
     * The version of the AWS Lambda function.
     */
    version: Version;
    /**
     * The AWS Lambda function's networking configuration.
     */
    vpcConfig?: LambdaVpcConfig;
  }
  export interface BatchGetAccountStatusRequest {
    /**
     * The 12-digit Amazon Web Services account IDs of the accounts to retrieve Amazon Inspector status for.
     */
    accountIds?: AccountIdSet;
  }
  export interface BatchGetAccountStatusResponse {
    /**
     * An array of objects that provide details on the status of Amazon Inspector for each of the requested accounts.
     */
    accounts: AccountStateList;
    /**
     * An array of objects detailing any accounts that failed to enable Amazon Inspector and why.
     */
    failedAccounts?: FailedAccountList;
  }
  export interface BatchGetCodeSnippetRequest {
    /**
     * An array of finding ARNs for the findings you want to retrieve code snippets from.
     */
    findingArns: BatchGetCodeSnippetRequestFindingArnsList;
  }
  export type BatchGetCodeSnippetRequestFindingArnsList = FindingArn[];
  export interface BatchGetCodeSnippetResponse {
    /**
     * The retrieved code snippets associated with the provided finding ARNs.
     */
    codeSnippetResults?: CodeSnippetResultList;
    /**
     * Any errors Amazon Inspector encountered while trying to retrieve the requested code snippets.
     */
    errors?: CodeSnippetErrorList;
  }
  export interface BatchGetFindingDetailsRequest {
    /**
     * A list of finding ARNs.
     */
    findingArns: FindingArnList;
  }
  export interface BatchGetFindingDetailsResponse {
    /**
     * Error information for findings that details could not be returned for.
     */
    errors?: FindingDetailsErrorList;
    /**
     * A finding's vulnerability details.
     */
    findingDetails?: FindingDetails;
  }
  export interface BatchGetFreeTrialInfoRequest {
    /**
     * The account IDs to get free trial status for.
     */
    accountIds: BatchGetFreeTrialInfoRequestAccountIdsList;
  }
  export type BatchGetFreeTrialInfoRequestAccountIdsList = MeteringAccountId[];
  export interface BatchGetFreeTrialInfoResponse {
    /**
     * An array of objects that provide Amazon Inspector free trial details for each of the requested accounts. 
     */
    accounts: FreeTrialAccountInfoList;
    /**
     * An array of objects detailing any accounts that free trial data could not be returned for.
     */
    failedAccounts: FreeTrialInfoErrorList;
  }
  export interface BatchGetMemberEc2DeepInspectionStatusRequest {
    /**
     * The unique identifiers for the Amazon Web Services accounts to retrieve Amazon Inspector deep inspection activation status for.  &lt;/p&gt; 
     */
    accountIds?: AccountIdSet;
  }
  export interface BatchGetMemberEc2DeepInspectionStatusResponse {
    /**
     * An array of objects that provide details on the activation status of Amazon Inspector deep inspection for each of the requested accounts.  &lt;/p&gt; 
     */
    accountIds?: MemberAccountEc2DeepInspectionStatusStateList;
    /**
     * An array of objects that provide details on any accounts that failed to activate Amazon Inspector deep inspection and why.  &lt;/p&gt; 
     */
    failedAccountIds?: FailedMemberAccountEc2DeepInspectionStatusStateList;
  }
  export interface BatchUpdateMemberEc2DeepInspectionStatusRequest {
    /**
     * The unique identifiers for the Amazon Web Services accounts to change Amazon Inspector deep inspection status for.
     */
    accountIds: MemberAccountEc2DeepInspectionStatusList;
  }
  export interface BatchUpdateMemberEc2DeepInspectionStatusResponse {
    /**
     * An array of objects that provide details for each of the accounts that Amazon Inspector deep inspection status was successfully changed for. 
     */
    accountIds?: MemberAccountEc2DeepInspectionStatusStateList;
    /**
     * An array of objects that provide details for each of the accounts that Amazon Inspector deep inspection status could not be successfully changed for. 
     */
    failedAccountIds?: FailedMemberAccountEc2DeepInspectionStatusStateList;
  }
  export type Boolean = boolean;
  export interface CancelFindingsReportRequest {
    /**
     * The ID of the report to be canceled.
     */
    reportId: ReportId;
  }
  export interface CancelFindingsReportResponse {
    /**
     * The ID of the canceled report.
     */
    reportId: ReportId;
  }
  export interface CancelSbomExportRequest {
    /**
     * The report ID of the SBOM export to cancel.
     */
    reportId: ReportId;
  }
  export interface CancelSbomExportResponse {
    /**
     * The report ID of the canceled SBOM export.
     */
    reportId?: ReportId;
  }
  export type CisaAction = string;
  export interface CisaData {
    /**
     * The remediation action recommended by CISA for this vulnerability.
     */
    action?: CisaAction;
    /**
     * The date and time CISA added this vulnerability to their catalogue.
     */
    dateAdded?: CisaDateAdded;
    /**
     * The date and time CISA expects a fix to have been provided vulnerability.
     */
    dateDue?: CisaDateDue;
  }
  export type CisaDateAdded = Date;
  export type CisaDateDue = Date;
  export type ClientToken = string;
  export interface CodeFilePath {
    /**
     * The line number of the last line of code that a vulnerability was found in.
     */
    endLine: Integer;
    /**
     * The name of the file the code vulnerability was found in.
     */
    fileName: NonEmptyString;
    /**
     * The file path to the code that a vulnerability was found in.
     */
    filePath: NonEmptyString;
    /**
     * The line number of the first line of code that a vulnerability was found in.
     */
    startLine: Integer;
  }
  export interface CodeLine {
    /**
     * The content of a line of code
     */
    content: CodeLineContentString;
    /**
     * The line number that a section of code is located at.
     */
    lineNumber: Integer;
  }
  export type CodeLineContentString = string;
  export type CodeLineList = CodeLine[];
  export interface CodeSnippetError {
    /**
     * The error code for the error that prevented a code snippet from being retrieved.
     */
    errorCode: CodeSnippetErrorCode;
    /**
     * The error message received when Amazon Inspector failed to retrieve a code snippet.
     */
    errorMessage: NonEmptyString;
    /**
     * The ARN of the finding that a code snippet couldn't be retrieved for.
     */
    findingArn: FindingArn;
  }
  export type CodeSnippetErrorCode = "INTERNAL_ERROR"|"ACCESS_DENIED"|"CODE_SNIPPET_NOT_FOUND"|"INVALID_INPUT"|string;
  export type CodeSnippetErrorList = CodeSnippetError[];
  export interface CodeSnippetResult {
    /**
     * Contains information on the retrieved code snippet.
     */
    codeSnippet?: CodeLineList;
    /**
     * The line number of the last line of a code snippet.
     */
    endLine?: Integer;
    /**
     * The ARN of a finding that the code snippet is associated with.
     */
    findingArn?: FindingArn;
    /**
     * The line number of the first line of a code snippet.
     */
    startLine?: Integer;
    /**
     * Details of a suggested code fix.
     */
    suggestedFixes?: SuggestedFixes;
  }
  export type CodeSnippetResultList = CodeSnippetResult[];
  export interface CodeVulnerabilityDetails {
    /**
     * The Common Weakness Enumeration (CWE) item associated with the detected vulnerability.
     */
    cwes: CweList;
    /**
     * The ID for the Amazon CodeGuru detector associated with the finding. For more information on detectors see Amazon CodeGuru Detector Library.
     */
    detectorId: NonEmptyString;
    /**
     * The name of the detector used to identify the code vulnerability. For more information on detectors see CodeGuru Detector Library.
     */
    detectorName: NonEmptyString;
    /**
     * The detector tag associated with the vulnerability. Detector tags group related vulnerabilities by common themes or tactics. For a list of available tags by programming language, see Java tags, or Python tags. 
     */
    detectorTags?: DetectorTagList;
    /**
     * Contains information on where the code vulnerability is located in your code.
     */
    filePath: CodeFilePath;
    /**
     * A URL containing supporting documentation about the code vulnerability detected.
     */
    referenceUrls?: ReferenceUrls;
    /**
     * The identifier for a rule that was used to detect the code vulnerability.
     */
    ruleId?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the Lambda layer that the code vulnerability was detected in.
     */
    sourceLambdaLayerArn?: LambdaLayerArn;
  }
  export type Component = string;
  export type ComponentType = string;
  export interface Counts {
    /**
     * The number of resources.
     */
    count?: AggCounts;
    /**
     * The key associated with this group
     */
    groupKey?: GroupKey;
  }
  export type CountsList = Counts[];
  export interface CoverageDateFilter {
    /**
     * A timestamp representing the end of the time period to filter results by.
     */
    endInclusive?: DateTimeTimestamp;
    /**
     * A timestamp representing the start of the time period to filter results by.
     */
    startInclusive?: DateTimeTimestamp;
  }
  export type CoverageDateFilterList = CoverageDateFilter[];
  export interface CoverageFilterCriteria {
    /**
     * An array of Amazon Web Services account IDs to return coverage statistics for.
     */
    accountId?: CoverageStringFilterList;
    /**
     * The Amazon EC2 instance tags to filter on.
     */
    ec2InstanceTags?: CoverageMapFilterList;
    /**
     * The Amazon ECR image tags to filter on.
     */
    ecrImageTags?: CoverageStringFilterList;
    /**
     * The Amazon ECR repository name to filter on.
     */
    ecrRepositoryName?: CoverageStringFilterList;
    /**
     * Returns coverage statistics for AWS Lambda functions filtered by function names.
     */
    lambdaFunctionName?: CoverageStringFilterList;
    /**
     * Returns coverage statistics for AWS Lambda functions filtered by runtime.
     */
    lambdaFunctionRuntime?: CoverageStringFilterList;
    /**
     * Returns coverage statistics for AWS Lambda functions filtered by tag.
     */
    lambdaFunctionTags?: CoverageMapFilterList;
    /**
     * Filters Amazon Web Services resources based on whether Amazon Inspector has checked them for vulnerabilities within the specified time range.
     */
    lastScannedAt?: CoverageDateFilterList;
    /**
     * An array of Amazon Web Services resource IDs to return coverage statistics for.
     */
    resourceId?: CoverageStringFilterList;
    /**
     * An array of Amazon Web Services resource types to return coverage statistics for. The values can be AWS_EC2_INSTANCE, AWS_LAMBDA_FUNCTION or AWS_ECR_REPOSITORY.
     */
    resourceType?: CoverageStringFilterList;
    /**
     * The scan status code to filter on. Valid values are: ValidationException, InternalServerException, ResourceNotFoundException, BadRequestException, and ThrottlingException.
     */
    scanStatusCode?: CoverageStringFilterList;
    /**
     * The scan status reason to filter on.
     */
    scanStatusReason?: CoverageStringFilterList;
    /**
     * An array of Amazon Inspector scan types to return coverage statistics for.
     */
    scanType?: CoverageStringFilterList;
  }
  export type CoverageMapComparison = "EQUALS"|string;
  export interface CoverageMapFilter {
    /**
     * The operator to compare coverage on.
     */
    comparison: CoverageMapComparison;
    /**
     * The tag key associated with the coverage map filter.
     */
    key: NonEmptyString;
    /**
     * The tag value associated with the coverage map filter.
     */
    value?: NonEmptyString;
  }
  export type CoverageMapFilterList = CoverageMapFilter[];
  export type CoverageResourceType = "AWS_EC2_INSTANCE"|"AWS_ECR_CONTAINER_IMAGE"|"AWS_ECR_REPOSITORY"|"AWS_LAMBDA_FUNCTION"|string;
  export type CoverageStringComparison = "EQUALS"|"NOT_EQUALS"|string;
  export interface CoverageStringFilter {
    /**
     * The operator to compare strings on.
     */
    comparison: CoverageStringComparison;
    /**
     * The value to compare strings on.
     */
    value: CoverageStringInput;
  }
  export type CoverageStringFilterList = CoverageStringFilter[];
  export type CoverageStringInput = string;
  export interface CoveredResource {
    /**
     * The Amazon Web Services account ID of the covered resource.
     */
    accountId: AccountId;
    /**
     * The date and time the resource was last checked for vulnerabilities.
     */
    lastScannedAt?: DateTimeTimestamp;
    /**
     * The ID of the covered resource.
     */
    resourceId: ResourceId;
    /**
     * An object that contains details about the metadata.
     */
    resourceMetadata?: ResourceScanMetadata;
    /**
     * The type of the covered resource.
     */
    resourceType: CoverageResourceType;
    /**
     * The status of the scan covering the resource.
     */
    scanStatus?: ScanStatus;
    /**
     * The Amazon Inspector scan type covering the resource.
     */
    scanType: ScanType;
  }
  export type CoveredResources = CoveredResource[];
  export interface CreateFilterRequest {
    /**
     * Defines the action that is to be applied to the findings that match the filter.
     */
    action: FilterAction;
    /**
     * A description of the filter.
     */
    description?: FilterDescription;
    /**
     * Defines the criteria to be used in the filter for querying findings.
     */
    filterCriteria: FilterCriteria;
    /**
     * The name of the filter. Minimum length of 3. Maximum length of 64. Valid characters include alphanumeric characters, dot (.), underscore (_), and dash (-). Spaces are not allowed.
     */
    name: FilterName;
    /**
     * The reason for creating the filter.
     */
    reason?: FilterReason;
    /**
     * A list of tags for the filter.
     */
    tags?: TagMap;
  }
  export interface CreateFilterResponse {
    /**
     * The Amazon Resource Number (ARN) of the successfully created filter.
     */
    arn: FilterArn;
  }
  export interface CreateFindingsReportRequest {
    /**
     * The filter criteria to apply to the results of the finding report.
     */
    filterCriteria?: FilterCriteria;
    /**
     * The format to generate the report in.
     */
    reportFormat: ReportFormat;
    /**
     * The Amazon S3 export destination for the report.
     */
    s3Destination: Destination;
  }
  export interface CreateFindingsReportResponse {
    /**
     * The ID of the report.
     */
    reportId?: ReportId;
  }
  export interface CreateSbomExportRequest {
    /**
     * The output format for the software bill of materials (SBOM) report.
     */
    reportFormat: SbomReportFormat;
    /**
     * The resource filter criteria for the software bill of materials (SBOM) report.
     */
    resourceFilterCriteria?: ResourceFilterCriteria;
    s3Destination: Destination;
  }
  export interface CreateSbomExportResponse {
    /**
     * The report ID for the software bill of materials (SBOM) report.
     */
    reportId?: ReportId;
  }
  export type Currency = "USD"|string;
  export interface Cvss2 {
    /**
     * The CVSS v2 base score for the vulnerability.
     */
    baseScore?: Cvss2BaseScore;
    /**
     * The scoring vector associated with the CVSS v2 score.
     */
    scoringVector?: Cvss2ScoringVector;
  }
  export type Cvss2BaseScore = number;
  export type Cvss2ScoringVector = string;
  export interface Cvss3 {
    /**
     * The CVSS v3 base score for the vulnerability.
     */
    baseScore?: Cvss3BaseScore;
    /**
     * The scoring vector associated with the CVSS v3 score.
     */
    scoringVector?: Cvss3ScoringVector;
  }
  export type Cvss3BaseScore = number;
  export type Cvss3ScoringVector = string;
  export interface CvssScore {
    /**
     * The base CVSS score used for the finding.
     */
    baseScore: Double;
    /**
     * The vector string of the CVSS score.
     */
    scoringVector: NonEmptyString;
    /**
     * The source of the CVSS score.
     */
    source: NonEmptyString;
    /**
     * The version of CVSS used for the score.
     */
    version: NonEmptyString;
  }
  export interface CvssScoreAdjustment {
    /**
     * The metric used to adjust the CVSS score.
     */
    metric: NonEmptyString;
    /**
     * The reason the CVSS score has been adjustment.
     */
    reason: NonEmptyString;
  }
  export type CvssScoreAdjustmentList = CvssScoreAdjustment[];
  export interface CvssScoreDetails {
    /**
     * An object that contains details about adjustment Amazon Inspector made to the CVSS score.
     */
    adjustments?: CvssScoreAdjustmentList;
    /**
     * The source of the CVSS data.
     */
    cvssSource?: NonEmptyString;
    /**
     * The CVSS score.
     */
    score: Double;
    /**
     * The source for the CVSS score.
     */
    scoreSource: NonEmptyString;
    /**
     * The vector for the CVSS score.
     */
    scoringVector: NonEmptyString;
    /**
     * The CVSS version used in scoring.
     */
    version: NonEmptyString;
  }
  export type CvssScoreList = CvssScore[];
  export type Cwe = string;
  export type CweList = NonEmptyString[];
  export type Cwes = Cwe[];
  export interface DateFilter {
    /**
     * A timestamp representing the end of the time period filtered on.
     */
    endInclusive?: Timestamp;
    /**
     * A timestamp representing the start of the time period filtered on.
     */
    startInclusive?: Timestamp;
  }
  export type DateFilterList = DateFilter[];
  export type DateTimeTimestamp = Date;
  export interface DelegatedAdmin {
    /**
     * The Amazon Web Services account ID of the Amazon Inspector delegated administrator for your organization.
     */
    accountId?: AccountId;
    /**
     * The status of the Amazon Inspector delegated administrator.
     */
    relationshipStatus?: RelationshipStatus;
  }
  export interface DelegatedAdminAccount {
    /**
     * The Amazon Web Services account ID of the Amazon Inspector delegated administrator for your organization.
     */
    accountId?: AccountId;
    /**
     * The status of the Amazon Inspector delegated administrator.
     */
    status?: DelegatedAdminStatus;
  }
  export type DelegatedAdminAccountList = DelegatedAdminAccount[];
  export type DelegatedAdminStatus = "ENABLED"|"DISABLE_IN_PROGRESS"|string;
  export interface DeleteFilterRequest {
    /**
     * The Amazon Resource Number (ARN) of the filter to be deleted.
     */
    arn: FilterArn;
  }
  export interface DeleteFilterResponse {
    /**
     * The Amazon Resource Number (ARN) of the filter that has been deleted.
     */
    arn: FilterArn;
  }
  export interface DescribeOrganizationConfigurationRequest {
  }
  export interface DescribeOrganizationConfigurationResponse {
    /**
     * The scan types are automatically enabled for new members of your organization.
     */
    autoEnable?: AutoEnable;
    /**
     * Represents whether your organization has reached the maximum Amazon Web Services account limit for Amazon Inspector.
     */
    maxAccountLimitReached?: Boolean;
  }
  export interface Destination {
    /**
     * The name of the Amazon S3 bucket to export findings to.
     */
    bucketName: String;
    /**
     * The prefix that the findings will be written under.
     */
    keyPrefix?: String;
    /**
     * The ARN of the KMS key used to encrypt data when exporting findings.
     */
    kmsKeyArn: String;
  }
  export type DetectionPlatforms = NonEmptyString[];
  export type DetectorTagList = NonEmptyString[];
  export interface DisableDelegatedAdminAccountRequest {
    /**
     * The Amazon Web Services account ID of the current Amazon Inspector delegated administrator.
     */
    delegatedAdminAccountId: AccountId;
  }
  export interface DisableDelegatedAdminAccountResponse {
    /**
     * The Amazon Web Services account ID of the successfully disabled delegated administrator.
     */
    delegatedAdminAccountId: AccountId;
  }
  export interface DisableRequest {
    /**
     * An array of account IDs you want to disable Amazon Inspector scans for.
     */
    accountIds?: AccountIdSet;
    /**
     * The resource scan types you want to disable.
     */
    resourceTypes?: DisableResourceTypeList;
  }
  export type DisableResourceTypeList = ResourceScanType[];
  export interface DisableResponse {
    /**
     * Information on the accounts that have had Amazon Inspector scans successfully disabled. Details are provided for each account.
     */
    accounts: AccountList;
    /**
     * Information on any accounts for which Amazon Inspector scans could not be disabled. Details are provided for each account.
     */
    failedAccounts?: FailedAccountList;
  }
  export interface DisassociateMemberRequest {
    /**
     * The Amazon Web Services account ID of the member account to disassociate.
     */
    accountId: AccountId;
  }
  export interface DisassociateMemberResponse {
    /**
     * The Amazon Web Services account ID of the successfully disassociated member.
     */
    accountId: AccountId;
  }
  export type Double = number;
  export type Ec2DeepInspectionStatus = "ACTIVATED"|"DEACTIVATED"|"PENDING"|"FAILED"|string;
  export interface Ec2InstanceAggregation {
    /**
     * The AMI IDs associated with the Amazon EC2 instances to aggregate findings for.
     */
    amis?: StringFilterList;
    /**
     * The Amazon EC2 instance IDs to aggregate findings for.
     */
    instanceIds?: StringFilterList;
    /**
     * The Amazon EC2 instance tags to aggregate findings for.
     */
    instanceTags?: MapFilterList;
    /**
     * The operating system types to aggregate findings for. Valid values must be uppercase and underscore separated, examples are ORACLE_LINUX_7 and ALPINE_LINUX_3_8.
     */
    operatingSystems?: StringFilterList;
    /**
     * The value to sort results by.
     */
    sortBy?: Ec2InstanceSortBy;
    /**
     * The order to sort results by.
     */
    sortOrder?: SortOrder;
  }
  export interface Ec2InstanceAggregationResponse {
    /**
     * The Amazon Web Services account for the Amazon EC2 instance.
     */
    accountId?: String;
    /**
     * The Amazon Machine Image (AMI) of the Amazon EC2 instance.
     */
    ami?: AmiId;
    /**
     * The Amazon EC2 instance ID.
     */
    instanceId: NonEmptyString;
    /**
     * The tags attached to the instance.
     */
    instanceTags?: TagMap;
    /**
     * The number of network findings for the Amazon EC2 instance.
     */
    networkFindings?: Long;
    /**
     * The operating system of the Amazon EC2 instance.
     */
    operatingSystem?: String;
    /**
     * An object that contains the count of matched findings per severity.
     */
    severityCounts?: SeverityCounts;
  }
  export type Ec2InstanceSortBy = "NETWORK_FINDINGS"|"CRITICAL"|"HIGH"|"ALL"|string;
  export interface Ec2Metadata {
    /**
     * The ID of the Amazon Machine Image (AMI) used to launch the instance.
     */
    amiId?: AmiId;
    /**
     * The platform of the instance.
     */
    platform?: Ec2Platform;
    /**
     * The tags attached to the instance.
     */
    tags?: TagMap;
  }
  export type Ec2Platform = "WINDOWS"|"LINUX"|"UNKNOWN"|"MACOS"|string;
  export interface EcrConfiguration {
    /**
     * The ECR automated re-scan duration defines how long an ECR image will be actively scanned by Amazon Inspector. When the number of days since an image was last pushed exceeds the automated re-scan duration the monitoring state of that image becomes inactive and all associated findings are scheduled for closure.
     */
    rescanDuration: EcrRescanDuration;
  }
  export interface EcrConfigurationState {
    /**
     * An object that contains details about the state of the ECR automated re-scan setting.
     */
    rescanDurationState?: EcrRescanDurationState;
  }
  export interface EcrContainerImageMetadata {
    /**
     * Tags associated with the Amazon ECR image metadata.
     */
    tags?: TagList;
  }
  export interface EcrRepositoryMetadata {
    /**
     * The name of the Amazon ECR repository.
     */
    name?: String;
    /**
     * The frequency of scans.
     */
    scanFrequency?: EcrScanFrequency;
  }
  export type EcrRescanDuration = "LIFETIME"|"DAYS_30"|"DAYS_180"|string;
  export interface EcrRescanDurationState {
    /**
     * The ECR automated re-scan duration defines how long an ECR image will be actively scanned by Amazon Inspector. When the number of days since an image was last pushed exceeds the automated re-scan duration the monitoring state of that image becomes inactive and all associated findings are scheduled for closure.
     */
    rescanDuration?: EcrRescanDuration;
    /**
     * The status of changes to the ECR automated re-scan duration.
     */
    status?: EcrRescanDurationStatus;
    /**
     * A timestamp representing when the last time the ECR scan duration setting was changed.
     */
    updatedAt?: DateTimeTimestamp;
  }
  export type EcrRescanDurationStatus = "SUCCESS"|"PENDING"|"FAILED"|string;
  export type EcrScanFrequency = "MANUAL"|"SCAN_ON_PUSH"|"CONTINUOUS_SCAN"|string;
  export interface EnableDelegatedAdminAccountRequest {
    /**
     * The idempotency token for the request.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Web Services account ID of the Amazon Inspector delegated administrator.
     */
    delegatedAdminAccountId: AccountId;
  }
  export interface EnableDelegatedAdminAccountResponse {
    /**
     * The Amazon Web Services account ID of the successfully Amazon Inspector delegated administrator.
     */
    delegatedAdminAccountId: AccountId;
  }
  export interface EnableRequest {
    /**
     * A list of account IDs you want to enable Amazon Inspector scans for.
     */
    accountIds?: AccountIdSet;
    /**
     * The idempotency token for the request.
     */
    clientToken?: ClientToken;
    /**
     * The resource scan types you want to enable.
     */
    resourceTypes: EnableResourceTypeList;
  }
  export type EnableResourceTypeList = ResourceScanType[];
  export interface EnableResponse {
    /**
     * Information on the accounts that have had Amazon Inspector scans successfully enabled. Details are provided for each account.
     */
    accounts: AccountList;
    /**
     * Information on any accounts for which Amazon Inspector scans could not be enabled. Details are provided for each account.
     */
    failedAccounts?: FailedAccountList;
  }
  export interface Epss {
    /**
     * The Exploit Prediction Scoring System (EPSS) score.
     */
    score?: EpssScore;
  }
  export interface EpssDetails {
    /**
     * The EPSS score.
     */
    score?: EpssScoreValue;
  }
  export type EpssScore = number;
  export type EpssScoreValue = number;
  export type ErrorCode = "ALREADY_ENABLED"|"ENABLE_IN_PROGRESS"|"DISABLE_IN_PROGRESS"|"SUSPEND_IN_PROGRESS"|"RESOURCE_NOT_FOUND"|"ACCESS_DENIED"|"INTERNAL_ERROR"|"SSM_UNAVAILABLE"|"SSM_THROTTLED"|"EVENTBRIDGE_UNAVAILABLE"|"EVENTBRIDGE_THROTTLED"|"RESOURCE_SCAN_NOT_DISABLED"|"DISASSOCIATE_ALL_MEMBERS"|"ACCOUNT_IS_ISOLATED"|string;
  export type ErrorMessage = string;
  export interface Evidence {
    /**
     * The evidence details.
     */
    evidenceDetail?: EvidenceDetail;
    /**
     * The evidence rule.
     */
    evidenceRule?: EvidenceRule;
    /**
     * The evidence severity.
     */
    severity?: EvidenceSeverity;
  }
  export type EvidenceDetail = string;
  export type EvidenceList = Evidence[];
  export type EvidenceRule = string;
  export type EvidenceSeverity = string;
  export type ExecutionRoleArn = string;
  export type ExploitAvailable = "YES"|"NO"|string;
  export interface ExploitObserved {
    /**
     * The date an time when the exploit was first seen.
     */
    firstSeen?: FirstSeen;
    /**
     * The date an time when the exploit was last seen.
     */
    lastSeen?: LastSeen;
  }
  export interface ExploitabilityDetails {
    /**
     * The date and time of the last exploit associated with a finding discovered in your environment.
     */
    lastKnownExploitAt?: DateTimeTimestamp;
  }
  export type ExternalReportStatus = "SUCCEEDED"|"IN_PROGRESS"|"CANCELLED"|"FAILED"|string;
  export interface FailedAccount {
    /**
     * The Amazon Web Services account ID.
     */
    accountId: AccountId;
    /**
     * The error code explaining why the account failed to enable Amazon Inspector.
     */
    errorCode: ErrorCode;
    /**
     * The error message received when the account failed to enable Amazon Inspector.
     */
    errorMessage: NonEmptyString;
    /**
     * An object detailing which resources Amazon Inspector is enabled to scan for the account.
     */
    resourceStatus?: ResourceStatus;
    /**
     * The status of Amazon Inspector for the account.
     */
    status?: Status;
  }
  export type FailedAccountList = FailedAccount[];
  export interface FailedMemberAccountEc2DeepInspectionStatusState {
    /**
     * The unique identifier for the Amazon Web Services account of the organization member that failed to activate Amazon Inspector deep inspection.
     */
    accountId: AccountId;
    /**
     * The status of EC2 scanning in the account that failed to activate Amazon Inspector deep inspection.
     */
    ec2ScanStatus?: Status;
    /**
     * The error message explaining why the account failed to activate Amazon Inspector deep inspection.
     */
    errorMessage?: NonEmptyString;
  }
  export type FailedMemberAccountEc2DeepInspectionStatusStateList = FailedMemberAccountEc2DeepInspectionStatusState[];
  export type FilePath = string;
  export interface Filter {
    /**
     * The action that is to be applied to the findings that match the filter.
     */
    action: FilterAction;
    /**
     * The Amazon Resource Number (ARN) associated with this filter.
     */
    arn: FilterArn;
    /**
     * The date and time this filter was created at.
     */
    createdAt: DateTimeTimestamp;
    /**
     * Details on the filter criteria associated with this filter.
     */
    criteria: FilterCriteria;
    /**
     * A description of the filter.
     */
    description?: FilterDescription;
    /**
     * The name of the filter.
     */
    name: FilterName;
    /**
     * The Amazon Web Services account ID of the account that created the filter.
     */
    ownerId: OwnerId;
    /**
     * The reason for the filter.
     */
    reason?: FilterReason;
    /**
     * The tags attached to the filter.
     */
    tags?: TagMap;
    /**
     * The date and time the filter was last updated at.
     */
    updatedAt: DateTimeTimestamp;
  }
  export type FilterAction = "NONE"|"SUPPRESS"|string;
  export type FilterArn = string;
  export type FilterArnList = FilterArn[];
  export interface FilterCriteria {
    /**
     * Details of the Amazon Web Services account IDs used to filter findings.
     */
    awsAccountId?: StringFilterList;
    /**
     * The name of the detector used to identify a code vulnerability in a Lambda function used to filter findings.
     */
    codeVulnerabilityDetectorName?: StringFilterList;
    /**
     * The detector type tag associated with the vulnerability used to filter findings. Detector tags group related vulnerabilities by common themes or tactics. For a list of available tags by programming language, see Java tags, or Python tags. 
     */
    codeVulnerabilityDetectorTags?: StringFilterList;
    /**
     * The file path to the file in a Lambda function that contains a code vulnerability used to filter findings.
     */
    codeVulnerabilityFilePath?: StringFilterList;
    /**
     * Details of the component IDs used to filter findings.
     */
    componentId?: StringFilterList;
    /**
     * Details of the component types used to filter findings.
     */
    componentType?: StringFilterList;
    /**
     * Details of the Amazon EC2 instance image IDs used to filter findings.
     */
    ec2InstanceImageId?: StringFilterList;
    /**
     * Details of the Amazon EC2 instance subnet IDs used to filter findings.
     */
    ec2InstanceSubnetId?: StringFilterList;
    /**
     * Details of the Amazon EC2 instance VPC IDs used to filter findings.
     */
    ec2InstanceVpcId?: StringFilterList;
    /**
     * Details of the Amazon ECR image architecture types used to filter findings.
     */
    ecrImageArchitecture?: StringFilterList;
    /**
     * Details of the Amazon ECR image hashes used to filter findings.
     */
    ecrImageHash?: StringFilterList;
    /**
     * Details on the Amazon ECR image push date and time used to filter findings.
     */
    ecrImagePushedAt?: DateFilterList;
    /**
     * Details on the Amazon ECR registry used to filter findings.
     */
    ecrImageRegistry?: StringFilterList;
    /**
     * Details on the name of the Amazon ECR repository used to filter findings.
     */
    ecrImageRepositoryName?: StringFilterList;
    /**
     * The tags attached to the Amazon ECR container image.
     */
    ecrImageTags?: StringFilterList;
    /**
     * The EPSS score used to filter findings.
     */
    epssScore?: NumberFilterList;
    /**
     * Filters the list of AWS Lambda findings by the availability of exploits.
     */
    exploitAvailable?: StringFilterList;
    /**
     * Details on the finding ARNs used to filter findings.
     */
    findingArn?: StringFilterList;
    /**
     * Details on the finding status types used to filter findings.
     */
    findingStatus?: StringFilterList;
    /**
     * Details on the finding types used to filter findings.
     */
    findingType?: StringFilterList;
    /**
     * Details on the date and time a finding was first seen used to filter findings.
     */
    firstObservedAt?: DateFilterList;
    /**
     * Details on whether a fix is available through a version update. This value can be YES, NO, or PARTIAL. A PARTIAL fix means that some, but not all, of the packages identified in the finding have fixes available through updated versions.
     */
    fixAvailable?: StringFilterList;
    /**
     * The Amazon Inspector score to filter on.
     */
    inspectorScore?: NumberFilterList;
    /**
     * Filters the list of AWS Lambda functions by execution role.
     */
    lambdaFunctionExecutionRoleArn?: StringFilterList;
    /**
     * Filters the list of AWS Lambda functions by the date and time that a user last updated the configuration, in ISO 8601 format 
     */
    lambdaFunctionLastModifiedAt?: DateFilterList;
    /**
     * Filters the list of AWS Lambda functions by the function's  layers. A Lambda function can have up to five layers.
     */
    lambdaFunctionLayers?: StringFilterList;
    /**
     * Filters the list of AWS Lambda functions by the name of the function.
     */
    lambdaFunctionName?: StringFilterList;
    /**
     * Filters the list of AWS Lambda functions by the runtime environment for the Lambda function.
     */
    lambdaFunctionRuntime?: StringFilterList;
    /**
     * Details on the date and time a finding was last seen used to filter findings.
     */
    lastObservedAt?: DateFilterList;
    /**
     * Details on network protocol used to filter findings.
     */
    networkProtocol?: StringFilterList;
    /**
     * Details on the port ranges used to filter findings.
     */
    portRange?: PortRangeFilterList;
    /**
     * Details on the related vulnerabilities used to filter findings.
     */
    relatedVulnerabilities?: StringFilterList;
    /**
     * Details on the resource IDs used to filter findings.
     */
    resourceId?: StringFilterList;
    /**
     * Details on the resource tags used to filter findings.
     */
    resourceTags?: MapFilterList;
    /**
     * Details on the resource types used to filter findings.
     */
    resourceType?: StringFilterList;
    /**
     * Details on the severity used to filter findings.
     */
    severity?: StringFilterList;
    /**
     * Details on the finding title used to filter findings.
     */
    title?: StringFilterList;
    /**
     * Details on the date and time a finding was last updated at used to filter findings.
     */
    updatedAt?: DateFilterList;
    /**
     * Details on the vendor severity used to filter findings.
     */
    vendorSeverity?: StringFilterList;
    /**
     * Details on the vulnerability ID used to filter findings.
     */
    vulnerabilityId?: StringFilterList;
    /**
     * Details on the vulnerability type used to filter findings.
     */
    vulnerabilitySource?: StringFilterList;
    /**
     * Details on the vulnerable packages used to filter findings.
     */
    vulnerablePackages?: PackageFilterList;
  }
  export type FilterDescription = string;
  export type FilterList = Filter[];
  export type FilterName = string;
  export type FilterReason = string;
  export interface Finding {
    /**
     * The Amazon Web Services account ID associated with the finding.
     */
    awsAccountId: AccountId;
    /**
     * Details about the code vulnerability identified in a Lambda function used to filter findings.
     */
    codeVulnerabilityDetails?: CodeVulnerabilityDetails;
    /**
     * The description of the finding.
     */
    description: FindingDescription;
    /**
     * The finding's EPSS score.
     */
    epss?: EpssDetails;
    /**
     * If a finding discovered in your environment has an exploit available.
     */
    exploitAvailable?: ExploitAvailable;
    /**
     * The details of an exploit available for a finding discovered in your environment.
     */
    exploitabilityDetails?: ExploitabilityDetails;
    /**
     * The Amazon Resource Number (ARN) of the finding.
     */
    findingArn: FindingArn;
    /**
     * The date and time that the finding was first observed.
     */
    firstObservedAt: DateTimeTimestamp;
    /**
     * Details on whether a fix is available through a version update. This value can be YES, NO, or PARTIAL. A PARTIAL fix means that some, but not all, of the packages identified in the finding have fixes available through updated versions.
     */
    fixAvailable?: FixAvailable;
    /**
     * The Amazon Inspector score given to the finding.
     */
    inspectorScore?: Double;
    /**
     * An object that contains details of the Amazon Inspector score.
     */
    inspectorScoreDetails?: InspectorScoreDetails;
    /**
     * The date and time that the finding was last observed.
     */
    lastObservedAt: DateTimeTimestamp;
    /**
     * An object that contains the details of a network reachability finding.
     */
    networkReachabilityDetails?: NetworkReachabilityDetails;
    /**
     * An object that contains the details of a package vulnerability finding.
     */
    packageVulnerabilityDetails?: PackageVulnerabilityDetails;
    /**
     * An object that contains the details about how to remediate a finding.
     */
    remediation: Remediation;
    /**
     * Contains information on the resources involved in a finding. The resource value determines the valid values for type in your request. For more information, see Finding types in the Amazon Inspector user guide.
     */
    resources: ResourceList;
    /**
     * The severity of the finding. UNTRIAGED applies to PACKAGE_VULNERABILITY type findings that the vendor has not assigned a severity yet. For more information, see Severity levels for findings in the Amazon Inspector user guide.
     */
    severity: Severity;
    /**
     * The status of the finding.
     */
    status: FindingStatus;
    /**
     * The title of the finding.
     */
    title?: FindingTitle;
    /**
     * The type of the finding. The type value determines the valid values for resource in your request. For more information, see Finding types in the Amazon Inspector user guide.
     */
    type: FindingType;
    /**
     * The date and time the finding was last updated at.
     */
    updatedAt?: DateTimeTimestamp;
  }
  export type FindingArn = string;
  export type FindingArnList = FindingArn[];
  export type FindingDescription = string;
  export interface FindingDetail {
    cisaData?: CisaData;
    /**
     * The Common Weakness Enumerations (CWEs) associated with the vulnerability.
     */
    cwes?: Cwes;
    /**
     * The Exploit Prediction Scoring System (EPSS) score of the vulnerability.
     */
    epssScore?: Double;
    /**
     * Information on the evidence of the vulnerability.
     */
    evidences?: EvidenceList;
    exploitObserved?: ExploitObserved;
    /**
     * The finding ARN that the vulnerability details are associated with.
     */
    findingArn?: FindingArn;
    /**
     * The reference URLs for the vulnerability data.
     */
    referenceUrls?: VulnerabilityReferenceUrls;
    /**
     * The risk score of the vulnerability.
     */
    riskScore?: RiskScore;
    /**
     * The known malware tools or kits that can exploit the vulnerability.
     */
    tools?: Tools;
    /**
     * The MITRE adversary tactics, techniques, or procedures (TTPs) associated with the vulnerability.
     */
    ttps?: Ttps;
  }
  export type FindingDetails = FindingDetail[];
  export interface FindingDetailsError {
    /**
     * The error code.
     */
    errorCode: FindingDetailsErrorCode;
    /**
     * The error message.
     */
    errorMessage: NonEmptyString;
    /**
     * The finding ARN that returned an error.
     */
    findingArn: FindingArn;
  }
  export type FindingDetailsErrorCode = "INTERNAL_ERROR"|"ACCESS_DENIED"|"FINDING_DETAILS_NOT_FOUND"|"INVALID_INPUT"|string;
  export type FindingDetailsErrorList = FindingDetailsError[];
  export type FindingList = Finding[];
  export type FindingStatus = "ACTIVE"|"SUPPRESSED"|"CLOSED"|string;
  export type FindingTitle = string;
  export type FindingType = "NETWORK_REACHABILITY"|"PACKAGE_VULNERABILITY"|"CODE_VULNERABILITY"|string;
  export interface FindingTypeAggregation {
    /**
     * The finding type to aggregate.
     */
    findingType?: AggregationFindingType;
    /**
     * The resource type to aggregate.
     */
    resourceType?: AggregationResourceType;
    /**
     * The value to sort results by.
     */
    sortBy?: FindingTypeSortBy;
    /**
     * The order to sort results by.
     */
    sortOrder?: SortOrder;
  }
  export interface FindingTypeAggregationResponse {
    /**
     * The ID of the Amazon Web Services account associated with the findings.
     */
    accountId?: AccountId;
    /**
     * The value to sort results by.
     */
    severityCounts?: SeverityCounts;
  }
  export type FindingTypeSortBy = "CRITICAL"|"HIGH"|"ALL"|string;
  export type FirstSeen = Date;
  export type FixAvailable = "YES"|"NO"|"PARTIAL"|string;
  export interface FreeTrialAccountInfo {
    /**
     * The account associated with the Amazon Inspector free trial information.
     */
    accountId: MeteringAccountId;
    /**
     * Contains information about the Amazon Inspector free trial for an account.
     */
    freeTrialInfo: FreeTrialInfoList;
  }
  export type FreeTrialAccountInfoList = FreeTrialAccountInfo[];
  export interface FreeTrialInfo {
    /**
     * The date and time that the Amazon Inspector free trail ends for a given account.
     */
    end: Timestamp;
    /**
     * The date and time that the Amazon Inspector free trail started for a given account.
     */
    start: Timestamp;
    /**
     * The order to sort results by.
     */
    status: FreeTrialStatus;
    /**
     * The type of scan covered by the Amazon Inspector free trail.
     */
    type: FreeTrialType;
  }
  export interface FreeTrialInfoError {
    /**
     * The account associated with the Amazon Inspector free trial information.
     */
    accountId: MeteringAccountId;
    /**
     * The error code.
     */
    code: FreeTrialInfoErrorCode;
    /**
     * The error message returned.
     */
    message: String;
  }
  export type FreeTrialInfoErrorCode = "ACCESS_DENIED"|"INTERNAL_ERROR"|string;
  export type FreeTrialInfoErrorList = FreeTrialInfoError[];
  export type FreeTrialInfoList = FreeTrialInfo[];
  export type FreeTrialStatus = "ACTIVE"|"INACTIVE"|string;
  export type FreeTrialType = "EC2"|"ECR"|"LAMBDA"|"LAMBDA_CODE"|string;
  export type FunctionName = string;
  export interface GetConfigurationRequest {
  }
  export interface GetConfigurationResponse {
    /**
     * Specifies how the ECR automated re-scan duration is currently configured for your environment.
     */
    ecrConfiguration?: EcrConfigurationState;
  }
  export interface GetDelegatedAdminAccountRequest {
  }
  export interface GetDelegatedAdminAccountResponse {
    /**
     * The Amazon Web Services account ID of the Amazon Inspector delegated administrator.
     */
    delegatedAdmin?: DelegatedAdmin;
  }
  export interface GetEc2DeepInspectionConfigurationRequest {
  }
  export interface GetEc2DeepInspectionConfigurationResponse {
    /**
     * An error message explaining why Amazon Inspector deep inspection configurations could not be retrieved for your account.
     */
    errorMessage?: NonEmptyString;
    /**
     * The Amazon Inspector deep inspection custom paths for your organization.
     */
    orgPackagePaths?: PathList;
    /**
     * The Amazon Inspector deep inspection custom paths for your account.
     */
    packagePaths?: PathList;
    /**
     * The activation status of Amazon Inspector deep inspection in your account.
     */
    status?: Ec2DeepInspectionStatus;
  }
  export interface GetEncryptionKeyRequest {
    /**
     * The resource type the key encrypts.
     */
    resourceType: ResourceType;
    /**
     * The scan type the key encrypts.
     */
    scanType: ScanType;
  }
  export interface GetEncryptionKeyResponse {
    /**
     * A kms key ID.
     */
    kmsKeyId: KmsKeyArn;
  }
  export interface GetFindingsReportStatusRequest {
    /**
     * The ID of the report to retrieve the status of.
     */
    reportId?: ReportId;
  }
  export interface GetFindingsReportStatusResponse {
    /**
     * The destination of the report.
     */
    destination?: Destination;
    /**
     * The error code of the report.
     */
    errorCode?: ReportingErrorCode;
    /**
     * The error message of the report.
     */
    errorMessage?: ErrorMessage;
    /**
     * The filter criteria associated with the report.
     */
    filterCriteria?: FilterCriteria;
    /**
     * The ID of the report.
     */
    reportId?: ReportId;
    /**
     * The status of the report.
     */
    status?: ExternalReportStatus;
  }
  export interface GetMemberRequest {
    /**
     * The Amazon Web Services account ID of the member account to retrieve information on.
     */
    accountId: AccountId;
  }
  export interface GetMemberResponse {
    /**
     * Details of the retrieved member account.
     */
    member?: Member;
  }
  export interface GetSbomExportRequest {
    /**
     * The report ID of the SBOM export to get details for.
     */
    reportId: ReportId;
  }
  export interface GetSbomExportResponse {
    /**
     * An error code.
     */
    errorCode?: ReportingErrorCode;
    /**
     * An error message.
     */
    errorMessage?: NonEmptyString;
    /**
     * Contains details about the resource filter criteria used for the software bill of materials (SBOM) report.
     */
    filterCriteria?: ResourceFilterCriteria;
    /**
     * The format of the software bill of materials (SBOM) report.
     */
    format?: SbomReportFormat;
    /**
     * The report ID of the software bill of materials (SBOM) report.
     */
    reportId?: ReportId;
    s3Destination?: Destination;
    /**
     * The status of the software bill of materials (SBOM) report.
     */
    status?: ExternalReportStatus;
  }
  export type GroupKey = "SCAN_STATUS_CODE"|"SCAN_STATUS_REASON"|"ACCOUNT_ID"|"RESOURCE_TYPE"|"ECR_REPOSITORY_NAME"|string;
  export type ImageHash = string;
  export interface ImageLayerAggregation {
    /**
     * The hashes associated with the layers.
     */
    layerHashes?: StringFilterList;
    /**
     * The repository associated with the container image hosting the layers.
     */
    repositories?: StringFilterList;
    /**
     * The ID of the container image layer.
     */
    resourceIds?: StringFilterList;
    /**
     * The value to sort results by.
     */
    sortBy?: ImageLayerSortBy;
    /**
     * The order to sort results by.
     */
    sortOrder?: SortOrder;
  }
  export interface ImageLayerAggregationResponse {
    /**
     * The ID of the Amazon Web Services account that owns the container image hosting the layer image.
     */
    accountId: AccountId;
    /**
     * The layer hash.
     */
    layerHash: NonEmptyString;
    /**
     * The repository the layer resides in.
     */
    repository: NonEmptyString;
    /**
     * The resource ID of the container image layer.
     */
    resourceId: NonEmptyString;
    /**
     * An object that represents the count of matched findings per severity.
     */
    severityCounts?: SeverityCounts;
  }
  export type ImageLayerSortBy = "CRITICAL"|"HIGH"|"ALL"|string;
  export type ImageTagList = NonEmptyString[];
  export interface InspectorScoreDetails {
    /**
     * An object that contains details about the CVSS score given to a finding.
     */
    adjustedCvss?: CvssScoreDetails;
  }
  export type Integer = number;
  export type IpV4Address = string;
  export type IpV4AddressList = IpV4Address[];
  export type IpV6Address = string;
  export type IpV6AddressList = IpV6Address[];
  export type KmsKeyArn = string;
  export interface LambdaFunctionAggregation {
    /**
     * The AWS Lambda function names to include in the aggregation results.
     */
    functionNames?: StringFilterList;
    /**
     * The tags to include in the aggregation results.
     */
    functionTags?: MapFilterList;
    /**
     * The resource IDs to include in the aggregation results.
     */
    resourceIds?: StringFilterList;
    /**
     * Returns findings aggregated by AWS Lambda function runtime environments.
     */
    runtimes?: StringFilterList;
    /**
     * The finding severity to use for sorting the results.
     */
    sortBy?: LambdaFunctionSortBy;
    /**
     * The order to use for sorting the results.
     */
    sortOrder?: SortOrder;
  }
  export interface LambdaFunctionAggregationResponse {
    /**
     * The ID of the AWS account that owns the AWS Lambda function. 
     */
    accountId?: AccountId;
    /**
     * The AWS Lambda function names included in the aggregation results.
     */
    functionName?: String;
    /**
     * The tags included in the aggregation results.
     */
    lambdaTags?: TagMap;
    /**
     * The date that the AWS Lambda function included in the aggregation results was last changed.
     */
    lastModifiedAt?: DateTimeTimestamp;
    /**
     * The resource IDs included in the aggregation results.
     */
    resourceId: NonEmptyString;
    /**
     * The runtimes included in the aggregation results.
     */
    runtime?: String;
    severityCounts?: SeverityCounts;
  }
  export interface LambdaFunctionMetadata {
    /**
     * The name of a function.
     */
    functionName?: String;
    /**
     * The resource tags on an AWS Lambda function.
     */
    functionTags?: TagMap;
    /**
     * The layers for an AWS Lambda function. A Lambda function can have up to five layers.
     */
    layers?: LambdaLayerList;
    /**
     * An AWS Lambda function's runtime.
     */
    runtime?: Runtime;
  }
  export type LambdaFunctionSortBy = "CRITICAL"|"HIGH"|"ALL"|string;
  export interface LambdaLayerAggregation {
    /**
     * The names of the AWS Lambda functions associated with the layers.
     */
    functionNames?: StringFilterList;
    /**
     * The Amazon Resource Name (ARN) of the AWS Lambda function layer. 
     */
    layerArns?: StringFilterList;
    /**
     * The resource IDs for the AWS Lambda function layers.
     */
    resourceIds?: StringFilterList;
    /**
     * The finding severity to use for sorting the results.
     */
    sortBy?: LambdaLayerSortBy;
    /**
     * The order to use for sorting the results.
     */
    sortOrder?: SortOrder;
  }
  export interface LambdaLayerAggregationResponse {
    /**
     * The account ID of the AWS Lambda function layer.
     */
    accountId: AccountId;
    /**
     * The names of the AWS Lambda functions associated with the layers.
     */
    functionName: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the AWS Lambda function layer.
     */
    layerArn: NonEmptyString;
    /**
     * The Resource ID of the AWS Lambda function layer.
     */
    resourceId: NonEmptyString;
    severityCounts?: SeverityCounts;
  }
  export type LambdaLayerArn = string;
  export type LambdaLayerList = String[];
  export type LambdaLayerSortBy = "CRITICAL"|"HIGH"|"ALL"|string;
  export interface LambdaVpcConfig {
    /**
     * The VPC security groups and subnets that are attached to an AWS Lambda function. For more information, see VPC Settings.
     */
    securityGroupIds?: SecurityGroupIdList;
    /**
     * A list of VPC subnet IDs.
     */
    subnetIds?: SubnetIdList;
    /**
     * The ID of the VPC.
     */
    vpcId?: VpcId;
  }
  export type LastSeen = Date;
  export type LayerList = LambdaLayerArn[];
  export type ListAccountPermissionsMaxResults = number;
  export interface ListAccountPermissionsRequest {
    /**
     * The maximum number of results the response can return. If your request would return more than the maximum the response will return a nextToken value, use this value when you call the action again to get the remaining results.
     */
    maxResults?: ListAccountPermissionsMaxResults;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. If your response returns more than the maxResults maximum value it will also return a nextToken value. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
    /**
     * The service scan type to check permissions for.
     */
    service?: Service;
  }
  export interface ListAccountPermissionsResponse {
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
    /**
     * Contains details on the permissions an account has to configure Amazon Inspector.
     */
    permissions: Permissions;
  }
  export type ListCoverageMaxResults = number;
  export interface ListCoverageRequest {
    /**
     * An object that contains details on the filters to apply to the coverage data for your environment.
     */
    filterCriteria?: CoverageFilterCriteria;
    /**
     * The maximum number of results the response can return. If your request would return more than the maximum the response will return a nextToken value, use this value when you call the action again to get the remaining results.
     */
    maxResults?: ListCoverageMaxResults;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. If your response returns more than the maxResults maximum value it will also return a nextToken value. For subsequent calls, use the nextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
  }
  export interface ListCoverageResponse {
    /**
     * An object that contains details on the covered resources in your environment.
     */
    coveredResources?: CoveredResources;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
  }
  export interface ListCoverageStatisticsRequest {
    /**
     * An object that contains details on the filters to apply to the coverage data for your environment.
     */
    filterCriteria?: CoverageFilterCriteria;
    /**
     * The value to group the results by.
     */
    groupBy?: GroupKey;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
  }
  export interface ListCoverageStatisticsResponse {
    /**
     * An array with the number for each group.
     */
    countsByGroup?: CountsList;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
    /**
     * The total number for all groups.
     */
    totalCounts: Long;
  }
  export interface ListDelegatedAdminAccountsRequest {
    /**
     * The maximum number of results the response can return. If your request would return more than the maximum the response will return a nextToken value, use this value when you call the action again to get the remaining results.
     */
    maxResults?: ListDelegatedAdminMaxResults;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. If your response returns more than the maxResults maximum value it will also return a nextToken value. For subsequent calls, use the nextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
  }
  export interface ListDelegatedAdminAccountsResponse {
    /**
     * Details of the Amazon Inspector delegated administrator of your organization.
     */
    delegatedAdminAccounts?: DelegatedAdminAccountList;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
  }
  export type ListDelegatedAdminMaxResults = number;
  export type ListFilterMaxResults = number;
  export interface ListFiltersRequest {
    /**
     * The action the filter applies to matched findings.
     */
    action?: FilterAction;
    /**
     * The Amazon resource number (ARN) of the filter.
     */
    arns?: FilterArnList;
    /**
     * The maximum number of results the response can return. If your request would return more than the maximum the response will return a nextToken value, use this value when you call the action again to get the remaining results.
     */
    maxResults?: ListFilterMaxResults;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. If your response returns more than the maxResults maximum value it will also return a nextToken value. For subsequent calls, use the nextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
  }
  export interface ListFiltersResponse {
    /**
     * Contains details on the filters associated with your account.
     */
    filters: FilterList;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
  }
  export type ListFindingAggregationsMaxResults = number;
  export interface ListFindingAggregationsRequest {
    /**
     * The Amazon Web Services account IDs to retrieve finding aggregation data for.
     */
    accountIds?: StringFilterList;
    /**
     * Details of the aggregation request that is used to filter your aggregation results.
     */
    aggregationRequest?: AggregationRequest;
    /**
     * The type of the aggregation request.
     */
    aggregationType: AggregationType;
    /**
     * The maximum number of results the response can return. If your request would return more than the maximum the response will return a nextToken value, use this value when you call the action again to get the remaining results.
     */
    maxResults?: ListFindingAggregationsMaxResults;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. If your response returns more than the maxResults maximum value it will also return a nextToken value. For subsequent calls, use the nextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
  }
  export interface ListFindingAggregationsResponse {
    /**
     * The type of aggregation to perform.
     */
    aggregationType: AggregationType;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
    /**
     * Objects that contain the results of an aggregation operation.
     */
    responses?: AggregationResponseList;
  }
  export type ListFindingsMaxResults = number;
  export interface ListFindingsRequest {
    /**
     * Details on the filters to apply to your finding results.
     */
    filterCriteria?: FilterCriteria;
    /**
     * The maximum number of results the response can return. If your request would return more than the maximum the response will return a nextToken value, use this value when you call the action again to get the remaining results.
     */
    maxResults?: ListFindingsMaxResults;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. If your response returns more than the maxResults maximum value it will also return a nextToken value. For subsequent calls, use the nextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
    /**
     * Details on the sort criteria to apply to your finding results.
     */
    sortCriteria?: SortCriteria;
  }
  export interface ListFindingsResponse {
    /**
     * Contains details on the findings in your environment.
     */
    findings?: FindingList;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
  }
  export type ListMembersMaxResults = number;
  export interface ListMembersRequest {
    /**
     * The maximum number of results the response can return. If your request would return more than the maximum the response will return a nextToken value, use this value when you call the action again to get the remaining results.
     */
    maxResults?: ListMembersMaxResults;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. If your response returns more than the maxResults maximum value it will also return a nextToken value. For subsequent calls, use the nextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
    /**
     * Specifies whether to list only currently associated members if True or to list all members within the organization if False.
     */
    onlyAssociated?: Boolean;
  }
  export interface ListMembersResponse {
    /**
     * An object that contains details for each member account.
     */
    members?: MemberList;
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon resource number (ARN) of the resource to list tags of.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags associated with the resource.
     */
    tags?: TagMap;
  }
  export type ListUsageTotalsMaxResults = number;
  export type ListUsageTotalsNextToken = string;
  export interface ListUsageTotalsRequest {
    /**
     * The Amazon Web Services account IDs to retrieve usage totals for.
     */
    accountIds?: UsageAccountIdList;
    /**
     * The maximum number of results the response can return. If your request would return more than the maximum the response will return a nextToken value, use this value when you call the action again to get the remaining results.
     */
    maxResults?: ListUsageTotalsMaxResults;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. If your response returns more than the maxResults maximum value it will also return a nextToken value. For subsequent calls, use the nextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: ListUsageTotalsNextToken;
  }
  export interface ListUsageTotalsResponse {
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    nextToken?: ListUsageTotalsNextToken;
    /**
     * An object with details on the total usage for the requested account.
     */
    totals?: UsageTotalList;
  }
  export type Long = number;
  export type MapComparison = "EQUALS"|string;
  export interface MapFilter {
    /**
     * The operator to use when comparing values in the filter.
     */
    comparison: MapComparison;
    /**
     * The tag key used in the filter.
     */
    key: MapKey;
    /**
     * The tag value used in the filter.
     */
    value?: MapValue;
  }
  export type MapFilterList = MapFilter[];
  export type MapKey = string;
  export type MapValue = string;
  export interface Member {
    /**
     * The Amazon Web Services account ID of the member account.
     */
    accountId?: AccountId;
    /**
     * The Amazon Web Services account ID of the Amazon Inspector delegated administrator for this member account.
     */
    delegatedAdminAccountId?: AccountId;
    /**
     * The status of the member account.
     */
    relationshipStatus?: RelationshipStatus;
    /**
     * A timestamp showing when the status of this member was last updated.
     */
    updatedAt?: DateTimeTimestamp;
  }
  export interface MemberAccountEc2DeepInspectionStatus {
    /**
     * The unique identifier for the Amazon Web Services account of the organization member.
     */
    accountId: AccountId;
    /**
     * Whether Amazon Inspector deep inspection is active in the account. If TRUE Amazon Inspector deep inspection is active, if FALSE it is not active.
     */
    activateDeepInspection: Boolean;
  }
  export type MemberAccountEc2DeepInspectionStatusList = MemberAccountEc2DeepInspectionStatus[];
  export interface MemberAccountEc2DeepInspectionStatusState {
    /**
     * The unique identifier for the Amazon Web Services account of the organization member
     */
    accountId: AccountId;
    /**
     * The error message explaining why the account failed to activate Amazon Inspector deep inspection.
     */
    errorMessage?: NonEmptyString;
    /**
     * The state of Amazon Inspector deep inspection in the member account.
     */
    status?: Ec2DeepInspectionStatus;
  }
  export type MemberAccountEc2DeepInspectionStatusStateList = MemberAccountEc2DeepInspectionStatusState[];
  export type MemberList = Member[];
  export type MeteringAccountId = string;
  export type MonthlyCostEstimate = number;
  export interface NetworkPath {
    /**
     * The details on the steps in the network path.
     */
    steps?: StepList;
  }
  export type NetworkProtocol = "TCP"|"UDP"|string;
  export interface NetworkReachabilityDetails {
    /**
     * An object that contains details about a network path associated with a finding.
     */
    networkPath: NetworkPath;
    /**
     * An object that contains details about the open port range associated with a finding.
     */
    openPortRange: PortRange;
    /**
     * The protocol associated with a finding.
     */
    protocol: NetworkProtocol;
  }
  export type NextToken = string;
  export type NonEmptyString = string;
  export type NonEmptyStringList = NonEmptyString[];
  export interface NumberFilter {
    /**
     * The lowest number to be included in the filter.
     */
    lowerInclusive?: Double;
    /**
     * The highest number to be included in the filter.
     */
    upperInclusive?: Double;
  }
  export type NumberFilterList = NumberFilter[];
  export type Operation = "ENABLE_SCANNING"|"DISABLE_SCANNING"|"ENABLE_REPOSITORY"|"DISABLE_REPOSITORY"|string;
  export type OwnerId = string;
  export interface PackageAggregation {
    /**
     * The names of packages to aggregate findings on.
     */
    packageNames?: StringFilterList;
    /**
     * The value to sort results by.
     */
    sortBy?: PackageSortBy;
    /**
     * The order to sort results by.
     */
    sortOrder?: SortOrder;
  }
  export interface PackageAggregationResponse {
    /**
     * The ID of the Amazon Web Services account associated with the findings.
     */
    accountId?: AccountId;
    /**
     * The name of the operating system package.
     */
    packageName: NonEmptyString;
    /**
     * An object that contains the count of matched findings per severity.
     */
    severityCounts?: SeverityCounts;
  }
  export type PackageArchitecture = string;
  export type PackageEpoch = number;
  export interface PackageFilter {
    /**
     * An object that contains details on the package architecture type to filter on.
     */
    architecture?: StringFilter;
    /**
     * An object that contains details on the package epoch to filter on.
     */
    epoch?: NumberFilter;
    /**
     * An object that contains details on the name of the package to filter on.
     */
    name?: StringFilter;
    /**
     * An object that contains details on the package release to filter on.
     */
    release?: StringFilter;
    sourceLambdaLayerArn?: StringFilter;
    /**
     * An object that contains details on the source layer hash to filter on.
     */
    sourceLayerHash?: StringFilter;
    /**
     * The package version to filter on.
     */
    version?: StringFilter;
  }
  export type PackageFilterList = PackageFilter[];
  export type PackageManager = "BUNDLER"|"CARGO"|"COMPOSER"|"NPM"|"NUGET"|"PIPENV"|"POETRY"|"YARN"|"GOBINARY"|"GOMOD"|"JAR"|"OS"|"PIP"|"PYTHONPKG"|"NODEPKG"|"POM"|"GEMSPEC"|string;
  export type PackageName = string;
  export type PackageRelease = string;
  export type PackageSortBy = "CRITICAL"|"HIGH"|"ALL"|string;
  export type PackageType = "IMAGE"|"ZIP"|string;
  export type PackageVersion = string;
  export interface PackageVulnerabilityDetails {
    /**
     * An object that contains details about the CVSS score of a finding.
     */
    cvss?: CvssScoreList;
    /**
     * One or more URLs that contain details about this vulnerability type.
     */
    referenceUrls?: NonEmptyStringList;
    /**
     * One or more vulnerabilities related to the one identified in this finding.
     */
    relatedVulnerabilities?: VulnerabilityIdList;
    /**
     * The source of the vulnerability information.
     */
    source: NonEmptyString;
    /**
     * A URL to the source of the vulnerability information.
     */
    sourceUrl?: NonEmptyString;
    /**
     * The date and time that this vulnerability was first added to the vendor's database.
     */
    vendorCreatedAt?: DateTimeTimestamp;
    /**
     * The severity the vendor has given to this vulnerability type.
     */
    vendorSeverity?: NonEmptyString;
    /**
     * The date and time the vendor last updated this vulnerability in their database.
     */
    vendorUpdatedAt?: DateTimeTimestamp;
    /**
     * The ID given to this vulnerability.
     */
    vulnerabilityId: VulnerabilityId;
    /**
     * The packages impacted by this vulnerability.
     */
    vulnerablePackages?: VulnerablePackageList;
  }
  export type Path = string;
  export type PathList = Path[];
  export interface Permission {
    /**
     * The operations that can be performed with the given permissions.
     */
    operation: Operation;
    /**
     * The services that the permissions allow an account to perform the given operations for.
     */
    service: Service;
  }
  export type Permissions = Permission[];
  export type Platform = string;
  export type Port = number;
  export interface PortRange {
    /**
     * The beginning port in a port range.
     */
    begin: Port;
    /**
     * The ending port in a port range.
     */
    end: Port;
  }
  export interface PortRangeFilter {
    /**
     * The port number the port range begins at.
     */
    beginInclusive?: Port;
    /**
     * The port number the port range ends at.
     */
    endInclusive?: Port;
  }
  export type PortRangeFilterList = PortRangeFilter[];
  export interface Recommendation {
    /**
     * The URL address to the CVE remediation recommendations.
     */
    Url?: NonEmptyString;
    /**
     * The recommended course of action to remediate the finding.
     */
    text?: NonEmptyString;
  }
  export type ReferenceUrls = NonEmptyString[];
  export type RelatedVulnerabilities = RelatedVulnerability[];
  export type RelatedVulnerability = string;
  export type RelationshipStatus = "CREATED"|"INVITED"|"DISABLED"|"ENABLED"|"REMOVED"|"RESIGNED"|"DELETED"|"EMAIL_VERIFICATION_IN_PROGRESS"|"EMAIL_VERIFICATION_FAILED"|"REGION_DISABLED"|"ACCOUNT_SUSPENDED"|"CANNOT_CREATE_DETECTOR_IN_ORG_MASTER"|string;
  export interface Remediation {
    /**
     * An object that contains information about the recommended course of action to remediate the finding.
     */
    recommendation?: Recommendation;
  }
  export type ReportFormat = "CSV"|"JSON"|string;
  export type ReportId = string;
  export type ReportingErrorCode = "INTERNAL_ERROR"|"INVALID_PERMISSIONS"|"NO_FINDINGS_FOUND"|"BUCKET_NOT_FOUND"|"INCOMPATIBLE_BUCKET_REGION"|"MALFORMED_KMS_KEY"|string;
  export interface RepositoryAggregation {
    /**
     * The names of repositories to aggregate findings on.
     */
    repositories?: StringFilterList;
    /**
     * The value to sort results by.
     */
    sortBy?: RepositorySortBy;
    /**
     * The order to sort results by.
     */
    sortOrder?: SortOrder;
  }
  export interface RepositoryAggregationResponse {
    /**
     * The ID of the Amazon Web Services account associated with the findings.
     */
    accountId?: AccountId;
    /**
     * The number of container images impacted by the findings.
     */
    affectedImages?: Long;
    /**
     * The name of the repository associated with the findings.
     */
    repository: NonEmptyString;
    /**
     * An object that represent the count of matched findings per severity.
     */
    severityCounts?: SeverityCounts;
  }
  export type RepositorySortBy = "CRITICAL"|"HIGH"|"ALL"|"AFFECTED_IMAGES"|string;
  export interface ResetEncryptionKeyRequest {
    /**
     * The resource type the key encrypts.
     */
    resourceType: ResourceType;
    /**
     * The scan type the key encrypts.
     */
    scanType: ScanType;
  }
  export interface ResetEncryptionKeyResponse {
  }
  export interface Resource {
    /**
     * An object that contains details about the resource involved in a finding.
     */
    details?: ResourceDetails;
    /**
     * The ID of the resource.
     */
    id: NonEmptyString;
    /**
     * The partition of the resource.
     */
    partition?: NonEmptyString;
    /**
     * The Amazon Web Services Region the impacted resource is located in.
     */
    region?: NonEmptyString;
    /**
     * The tags attached to the resource.
     */
    tags?: TagMap;
    /**
     * The type of resource.
     */
    type: ResourceType;
  }
  export interface ResourceDetails {
    /**
     * An object that contains details about the Amazon EC2 instance involved in the finding.
     */
    awsEc2Instance?: AwsEc2InstanceDetails;
    /**
     * An object that contains details about the Amazon ECR container image involved in the finding.
     */
    awsEcrContainerImage?: AwsEcrContainerImageDetails;
    /**
     * A summary of the information about an AWS Lambda function affected by a finding.
     */
    awsLambdaFunction?: AwsLambdaFunctionDetails;
  }
  export interface ResourceFilterCriteria {
    /**
     * The account IDs used as resource filter criteria.
     */
    accountId?: ResourceStringFilterList;
    /**
     * The EC2 instance tags used as resource filter criteria.
     */
    ec2InstanceTags?: ResourceMapFilterList;
    /**
     * The ECR image tags used as resource filter criteria.
     */
    ecrImageTags?: ResourceStringFilterList;
    /**
     * The ECR repository names used as resource filter criteria.
     */
    ecrRepositoryName?: ResourceStringFilterList;
    /**
     * The AWS Lambda function name used as resource filter criteria.
     */
    lambdaFunctionName?: ResourceStringFilterList;
    /**
     * The AWS Lambda function tags used as resource filter criteria.
     */
    lambdaFunctionTags?: ResourceMapFilterList;
    /**
     * The resource IDs used as resource filter criteria.
     */
    resourceId?: ResourceStringFilterList;
    /**
     * The resource types used as resource filter criteria.
     */
    resourceType?: ResourceStringFilterList;
  }
  export type ResourceId = string;
  export type ResourceList = Resource[];
  export type ResourceMapComparison = "EQUALS"|string;
  export interface ResourceMapFilter {
    /**
     * The filter's comparison.
     */
    comparison: ResourceMapComparison;
    /**
     * The filter's key.
     */
    key: NonEmptyString;
    /**
     * The filter's value.
     */
    value?: NonEmptyString;
  }
  export type ResourceMapFilterList = ResourceMapFilter[];
  export interface ResourceScanMetadata {
    /**
     * An object that contains metadata details for an Amazon EC2 instance.
     */
    ec2?: Ec2Metadata;
    /**
     * An object that contains details about the container metadata for an Amazon ECR image.
     */
    ecrImage?: EcrContainerImageMetadata;
    /**
     * An object that contains details about the repository an Amazon ECR image resides in.
     */
    ecrRepository?: EcrRepositoryMetadata;
    /**
     * An object that contains metadata details for an AWS Lambda function.
     */
    lambdaFunction?: LambdaFunctionMetadata;
  }
  export type ResourceScanType = "EC2"|"ECR"|"LAMBDA"|"LAMBDA_CODE"|string;
  export interface ResourceState {
    /**
     * An object detailing the state of Amazon Inspector scanning for Amazon EC2 resources.
     */
    ec2: State;
    /**
     * An object detailing the state of Amazon Inspector scanning for Amazon ECR resources.
     */
    ecr: State;
    lambda?: State;
    lambdaCode?: State;
  }
  export interface ResourceStatus {
    /**
     * The status of Amazon Inspector scanning for Amazon EC2 resources.
     */
    ec2: Status;
    /**
     * The status of Amazon Inspector scanning for Amazon ECR resources.
     */
    ecr: Status;
    /**
     * The status of Amazon Inspector scanning for AWS Lambda function.
     */
    lambda?: Status;
    /**
     * The status of Amazon Inspector scanning for custom application code for Amazon Web Services Lambda functions. 
     */
    lambdaCode?: Status;
  }
  export type ResourceStringComparison = "EQUALS"|"NOT_EQUALS"|string;
  export interface ResourceStringFilter {
    /**
     * The filter's comparison.
     */
    comparison: ResourceStringComparison;
    /**
     * The filter's value.
     */
    value: ResourceStringInput;
  }
  export type ResourceStringFilterList = ResourceStringFilter[];
  export type ResourceStringInput = string;
  export type ResourceType = "AWS_EC2_INSTANCE"|"AWS_ECR_CONTAINER_IMAGE"|"AWS_ECR_REPOSITORY"|"AWS_LAMBDA_FUNCTION"|string;
  export type RiskScore = number;
  export type Runtime = "NODEJS"|"NODEJS_12_X"|"NODEJS_14_X"|"NODEJS_16_X"|"JAVA_8"|"JAVA_8_AL2"|"JAVA_11"|"PYTHON_3_7"|"PYTHON_3_8"|"PYTHON_3_9"|"UNSUPPORTED"|"NODEJS_18_X"|"GO_1_X"|"JAVA_17"|"PYTHON_3_10"|string;
  export type SbomReportFormat = "CYCLONEDX_1_4"|"SPDX_2_3"|string;
  export interface ScanStatus {
    /**
     * The scan status. Possible return values and descriptions are:   PENDING_INITIAL_SCAN - This resource has been identified for scanning, results will be available soon.  ACCESS_DENIED - Resource access policy restricting Amazon Inspector access. Please update the IAM policy.  INTERNAL_ERROR - Amazon Inspector has encountered an internal error for this resource. Amazon Inspector service will automatically resolve the issue and resume the scanning. No action required from the user.  UNMANAGED_EC2_INSTANCE - The EC2 instance is not managed by SSM, please use the following SSM automation to remediate the issue: https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awssupport-troubleshoot-managed-instance.html. Once the instance becomes managed by SSM, Inspector will automatically begin scanning this instance.   UNSUPPORTED_OS - Amazon Inspector does not support this OS, architecture, or image manifest type at this time. To see a complete list of supported operating systems see: https://docs.aws.amazon.com/inspector/latest/user/supported.html.  SCAN_ELIGIBILITY_EXPIRED - The configured scan duration has lapsed for this image.  RESOURCE_TERMINATED - This resource has been terminated. The findings and coverage associated with this resource are in the process of being cleaned up.  SUCCESSFUL - The scan was successful.  NO_RESOURCES_FOUND - Reserved for future use.  IMAGE_SIZE_EXCEEDED - Reserved for future use.  SCAN_FREQUENCY_MANUAL - This image will not be covered by Amazon Inspector due to the repository scan frequency configuration.  SCAN_FREQUENCY_SCAN_ON_PUSH - This image will be scanned one time and will not new findings because of the scan frequency configuration.  EC2_INSTANCE_STOPPED - This EC2 instance is in a stopped state, therefore, Amazon Inspector will pause scanning. The existing findings will continue to exist until the instance is terminated. Once the instance is re-started, Inspector will automatically start scanning the instance again. Please note that you will not be charged for this instance while it’s in a stopped state.  PENDING_DISABLE - This resource is pending cleanup during disablement. The customer will not be billed while a resource is in the pending disable status.  NO INVENTORY - Amazon Inspector couldn’t find software application inventory to scan for vulnerabilities. This might be caused due to required Amazon Inspector associations being deleted or failing to run on your resource. Please verify the status of InspectorInventoryCollection-do-not-delete association in the SSM console for the resource. Additionally, you can verify the instance’s inventory in the SSM Fleet Manager console.  STALE_INVENTORY - Amazon Inspector wasn’t able to collect an updated software application inventory in the last 7 days. Please confirm the required Amazon Inspector associations still exist and you can still see an updated inventory in the SSM console.  EXCLUDED_BY_TAG - This resource was not scanned because it has been excluded by a tag.  UNSUPPORTED_RUNTIME - The function was not scanned because it has an unsupported runtime. To see a complete list of supported runtimes see: https://docs.aws.amazon.com/inspector/latest/user/supported.html.  UNSUPPORTED_MEDIA_TYPE - The ECR image has an unsupported media type.  UNSUPPORTED_CONFIG_FILE - Reserved for future use.  DEEP_INSPECTION_PACKAGE_COLLECTION_LIMIT_EXCEEDED - The instance has exceeded the 5000 package limit for Amazon Inspector Deep inspection. To resume Deep inspection for this instance you can try to adjust the custom paths associated with the account.  DEEP_INSPECTION_DAILY_SSM_INVENTORY_LIMIT_EXCEEDED - The SSM agent couldn't send inventory to Amazon Inspector because the SSM quota for Inventory data collected per instance per day has already been reached for this instance.  DEEP_INSPECTION_COLLECTION_TIME_LIMIT_EXCEEDED - Amazon Inspector failed to extract the package inventory because the package collection time exceeding the maximum threshold of 15 minutes.  DEEP_INSPECTION_NO_INVENTORY The Amazon Inspector plugin hasn't yet been able to collect an inventory of packages for this instance. This is usually the result of a pending scan, however, if this status persists after 6 hours, use SSM to ensure that the required Amazon Inspector associations exist and are running for the instance. 
     */
    reason: ScanStatusReason;
    /**
     * The status code of the scan.
     */
    statusCode: ScanStatusCode;
  }
  export type ScanStatusCode = "ACTIVE"|"INACTIVE"|string;
  export type ScanStatusReason = "PENDING_INITIAL_SCAN"|"ACCESS_DENIED"|"INTERNAL_ERROR"|"UNMANAGED_EC2_INSTANCE"|"UNSUPPORTED_OS"|"SCAN_ELIGIBILITY_EXPIRED"|"RESOURCE_TERMINATED"|"SUCCESSFUL"|"NO_RESOURCES_FOUND"|"IMAGE_SIZE_EXCEEDED"|"SCAN_FREQUENCY_MANUAL"|"SCAN_FREQUENCY_SCAN_ON_PUSH"|"EC2_INSTANCE_STOPPED"|"PENDING_DISABLE"|"NO_INVENTORY"|"STALE_INVENTORY"|"EXCLUDED_BY_TAG"|"UNSUPPORTED_RUNTIME"|"UNSUPPORTED_MEDIA_TYPE"|"UNSUPPORTED_CONFIG_FILE"|"DEEP_INSPECTION_PACKAGE_COLLECTION_LIMIT_EXCEEDED"|"DEEP_INSPECTION_DAILY_SSM_INVENTORY_LIMIT_EXCEEDED"|"DEEP_INSPECTION_COLLECTION_TIME_LIMIT_EXCEEDED"|"DEEP_INSPECTION_NO_INVENTORY"|string;
  export type ScanType = "NETWORK"|"PACKAGE"|"CODE"|string;
  export interface SearchVulnerabilitiesFilterCriteria {
    /**
     * The IDs for specific vulnerabilities.
     */
    vulnerabilityIds: VulnIdList;
  }
  export interface SearchVulnerabilitiesRequest {
    /**
     * The criteria used to filter the results of a vulnerability search.
     */
    filterCriteria: SearchVulnerabilitiesFilterCriteria;
    /**
     * A token to use for paginating results that are returned in the response. Set the value of this parameter to null for the first request to a list action. For subsequent calls, use the NextToken value returned from the previous request to continue listing results after the first page.
     */
    nextToken?: NextToken;
  }
  export interface SearchVulnerabilitiesResponse {
    /**
     * The pagination parameter to be used on the next list operation to retrieve more items.
     */
    nextToken?: NextToken;
    /**
     * Details about the listed vulnerability.
     */
    vulnerabilities: Vulnerabilities;
  }
  export type SecurityGroupId = string;
  export type SecurityGroupIdList = SecurityGroupId[];
  export type Service = "EC2"|"ECR"|"LAMBDA"|string;
  export type Severity = "INFORMATIONAL"|"LOW"|"MEDIUM"|"HIGH"|"CRITICAL"|"UNTRIAGED"|string;
  export interface SeverityCounts {
    /**
     * The total count of findings from all severities.
     */
    all?: Long;
    /**
     * The total count of critical severity findings.
     */
    critical?: Long;
    /**
     * The total count of high severity findings.
     */
    high?: Long;
    /**
     * The total count of medium severity findings.
     */
    medium?: Long;
  }
  export interface SortCriteria {
    /**
     * The finding detail field by which results are sorted.
     */
    field: SortField;
    /**
     * The order by which findings are sorted.
     */
    sortOrder: SortOrder;
  }
  export type SortField = "AWS_ACCOUNT_ID"|"FINDING_TYPE"|"SEVERITY"|"FIRST_OBSERVED_AT"|"LAST_OBSERVED_AT"|"FINDING_STATUS"|"RESOURCE_TYPE"|"ECR_IMAGE_PUSHED_AT"|"ECR_IMAGE_REPOSITORY_NAME"|"ECR_IMAGE_REGISTRY"|"NETWORK_PROTOCOL"|"COMPONENT_TYPE"|"VULNERABILITY_ID"|"VULNERABILITY_SOURCE"|"INSPECTOR_SCORE"|"VENDOR_SEVERITY"|"EPSS_SCORE"|string;
  export type SortOrder = "ASC"|"DESC"|string;
  export type SourceLayerHash = string;
  export interface State {
    /**
     * The error code explaining why the account failed to enable Amazon Inspector.
     */
    errorCode: ErrorCode;
    /**
     * The error message received when the account failed to enable Amazon Inspector.
     */
    errorMessage: NonEmptyString;
    /**
     * The status of Amazon Inspector for the account.
     */
    status: Status;
  }
  export type Status = "ENABLING"|"ENABLED"|"DISABLING"|"DISABLED"|"SUSPENDING"|"SUSPENDED"|string;
  export interface Step {
    /**
     * The component ID.
     */
    componentId: Component;
    /**
     * The component type.
     */
    componentType: ComponentType;
  }
  export type StepList = Step[];
  export type String = string;
  export type StringComparison = "EQUALS"|"PREFIX"|"NOT_EQUALS"|string;
  export interface StringFilter {
    /**
     * The operator to use when comparing values in the filter.
     */
    comparison: StringComparison;
    /**
     * The value to filter on.
     */
    value: StringInput;
  }
  export type StringFilterList = StringFilter[];
  export type StringInput = string;
  export type StringList = NonEmptyString[];
  export type SubnetId = string;
  export type SubnetIdList = SubnetId[];
  export interface SuggestedFix {
    /**
     * The fix's code.
     */
    code?: SuggestedFixCodeString;
    /**
     * The fix's description.
     */
    description?: SuggestedFixDescriptionString;
  }
  export type SuggestedFixCodeString = string;
  export type SuggestedFixDescriptionString = string;
  export type SuggestedFixes = SuggestedFix[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = String[];
  export type TagMap = {[key: string]: MapValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to apply a tag to.
     */
    resourceArn: Arn;
    /**
     * The tags to be added to a resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type Target = string;
  export type Targets = Target[];
  export type Timestamp = Date;
  export interface TitleAggregation {
    /**
     * The type of finding to aggregate on.
     */
    findingType?: AggregationFindingType;
    /**
     * The resource type to aggregate on.
     */
    resourceType?: AggregationResourceType;
    /**
     * The value to sort results by.
     */
    sortBy?: TitleSortBy;
    /**
     * The order to sort results by.
     */
    sortOrder?: SortOrder;
    /**
     * The finding titles to aggregate on.
     */
    titles?: StringFilterList;
    /**
     * The vulnerability IDs of the findings.
     */
    vulnerabilityIds?: StringFilterList;
  }
  export interface TitleAggregationResponse {
    /**
     * The ID of the Amazon Web Services account associated with the findings.
     */
    accountId?: AccountId;
    /**
     * An object that represent the count of matched findings per severity.
     */
    severityCounts?: SeverityCounts;
    /**
     * The title that the findings were aggregated on.
     */
    title: NonEmptyString;
    /**
     * The vulnerability ID of the finding.
     */
    vulnerabilityId?: String;
  }
  export type TitleSortBy = "CRITICAL"|"HIGH"|"ALL"|string;
  export type Tool = string;
  export type Tools = Tool[];
  export type Ttp = string;
  export type Ttps = Ttp[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the resource to remove tags from.
     */
    resourceArn: Arn;
    /**
     * The tag keys to remove from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateConfigurationRequest {
    /**
     * Specifies how the ECR automated re-scan will be updated for your environment.
     */
    ecrConfiguration: EcrConfiguration;
  }
  export interface UpdateConfigurationResponse {
  }
  export interface UpdateEc2DeepInspectionConfigurationRequest {
    /**
     * Specify TRUE to activate Amazon Inspector deep inspection in your account, or FALSE to deactivate. Member accounts in an organization cannot deactivate deep inspection, instead the delegated administrator for the organization can deactivate a member account using BatchUpdateMemberEc2DeepInspectionStatus.
     */
    activateDeepInspection?: Boolean;
    /**
     * The Amazon Inspector deep inspection custom paths you are adding for your account.
     */
    packagePaths?: PathList;
  }
  export interface UpdateEc2DeepInspectionConfigurationResponse {
    /**
     * An error message explaining why new Amazon Inspector deep inspection custom paths could not be added.
     */
    errorMessage?: NonEmptyString;
    /**
     * The current Amazon Inspector deep inspection custom paths for the organization.
     */
    orgPackagePaths?: PathList;
    /**
     * The current Amazon Inspector deep inspection custom paths for your account.
     */
    packagePaths?: PathList;
    /**
     * The status of Amazon Inspector deep inspection in your account.
     */
    status?: Ec2DeepInspectionStatus;
  }
  export interface UpdateEncryptionKeyRequest {
    /**
     * A KMS key ID for the encryption key.
     */
    kmsKeyId: KmsKeyArn;
    /**
     * The resource type for the encryption key.
     */
    resourceType: ResourceType;
    /**
     * The scan type for the encryption key.
     */
    scanType: ScanType;
  }
  export interface UpdateEncryptionKeyResponse {
  }
  export interface UpdateFilterRequest {
    /**
     * Specifies the action that is to be applied to the findings that match the filter.
     */
    action?: FilterAction;
    /**
     * A description of the filter.
     */
    description?: FilterDescription;
    /**
     * The Amazon Resource Number (ARN) of the filter to update.
     */
    filterArn: FilterArn;
    /**
     * Defines the criteria to be update in the filter.
     */
    filterCriteria?: FilterCriteria;
    /**
     * The name of the filter.
     */
    name?: FilterName;
    /**
     * The reason the filter was updated.
     */
    reason?: FilterReason;
  }
  export interface UpdateFilterResponse {
    /**
     * The Amazon Resource Number (ARN) of the successfully updated filter.
     */
    arn: FilterArn;
  }
  export interface UpdateOrgEc2DeepInspectionConfigurationRequest {
    /**
     * The Amazon Inspector deep inspection custom paths you are adding for your organization.
     */
    orgPackagePaths: PathList;
  }
  export interface UpdateOrgEc2DeepInspectionConfigurationResponse {
  }
  export interface UpdateOrganizationConfigurationRequest {
    /**
     * Defines which scan types are enabled automatically for new members of your Amazon Inspector organization.
     */
    autoEnable: AutoEnable;
  }
  export interface UpdateOrganizationConfigurationResponse {
    /**
     * The updated status of scan types automatically enabled for new members of your Amazon Inspector organization.
     */
    autoEnable: AutoEnable;
  }
  export interface Usage {
    /**
     * The currency type used when calculating usage data.
     */
    currency?: Currency;
    /**
     * The estimated monthly cost of Amazon Inspector.
     */
    estimatedMonthlyCost?: MonthlyCostEstimate;
    /**
     * The total of usage.
     */
    total?: UsageValue;
    /**
     * The type scan.
     */
    type?: UsageType;
  }
  export type UsageAccountId = string;
  export type UsageAccountIdList = UsageAccountId[];
  export type UsageList = Usage[];
  export interface UsageTotal {
    /**
     * The account ID of the account that usage data was retrieved for.
     */
    accountId?: MeteringAccountId;
    /**
     * An object representing the total usage for an account.
     */
    usage?: UsageList;
  }
  export type UsageTotalList = UsageTotal[];
  export type UsageType = "EC2_INSTANCE_HOURS"|"ECR_INITIAL_SCAN"|"ECR_RESCAN"|"LAMBDA_FUNCTION_HOURS"|"LAMBDA_FUNCTION_CODE_HOURS"|string;
  export type UsageValue = number;
  export type VendorCreatedAt = Date;
  export type VendorSeverity = string;
  export type VendorUpdatedAt = Date;
  export type Version = string;
  export type VpcId = string;
  export type VulnId = string;
  export type VulnIdList = VulnId[];
  export type Vulnerabilities = Vulnerability[];
  export interface Vulnerability {
    /**
     * An object that contains information about the Amazon Web Services Threat Intel Group (ATIG) details for the vulnerability.
     */
    atigData?: AtigData;
    /**
     * An object that contains the Cybersecurity and Infrastructure Security Agency (CISA) details for the vulnerability.
     */
    cisaData?: CisaData;
    /**
     * An object that contains the Common Vulnerability Scoring System (CVSS) Version 2 details for the vulnerability.
     */
    cvss2?: Cvss2;
    /**
     * An object that contains the Common Vulnerability Scoring System (CVSS) Version 3 details for the vulnerability.
     */
    cvss3?: Cvss3;
    /**
     * The Common Weakness Enumeration (CWE) associated with the vulnerability.
     */
    cwes?: Cwes;
    /**
     * A description of the vulnerability.
     */
    description?: VulnerabilityDescription;
    /**
     * Platforms that the vulnerability can be detected on.
     */
    detectionPlatforms?: DetectionPlatforms;
    /**
     * An object that contains the Exploit Prediction Scoring System (EPSS) score for a vulnerability.
     */
    epss?: Epss;
    /**
     * An object that contains details on when the exploit was observed.
     */
    exploitObserved?: ExploitObserved;
    /**
     * The ID for the specific vulnerability.
     */
    id: NonEmptyString;
    /**
     * Links to various resources with more information on this vulnerability. 
     */
    referenceUrls?: VulnerabilityReferenceUrls;
    /**
     * A list of related vulnerabilities.
     */
    relatedVulnerabilities?: RelatedVulnerabilities;
    /**
     * The source of the vulnerability information. Possible results are RHEL, AMAZON_CVE, DEBIAN or NVD.
     */
    source?: VulnerabilitySource;
    /**
     * A link to the official source material for this vulnerability.
     */
    sourceUrl?: VulnerabilitySourceUrl;
    /**
     * The date and time when the vendor created this vulnerability.
     */
    vendorCreatedAt?: VendorCreatedAt;
    /**
     * The severity assigned by the vendor.
     */
    vendorSeverity?: VendorSeverity;
    /**
     * The date and time when the vendor last updated this vulnerability.
     */
    vendorUpdatedAt?: VendorUpdatedAt;
  }
  export type VulnerabilityDescription = string;
  export type VulnerabilityId = string;
  export type VulnerabilityIdList = VulnerabilityId[];
  export type VulnerabilityReferenceUrl = string;
  export type VulnerabilityReferenceUrls = VulnerabilityReferenceUrl[];
  export type VulnerabilitySource = "NVD"|string;
  export type VulnerabilitySourceUrl = string;
  export interface VulnerablePackage {
    /**
     * The architecture of the vulnerable package.
     */
    arch?: PackageArchitecture;
    /**
     * The epoch of the vulnerable package.
     */
    epoch?: PackageEpoch;
    /**
     * The file path of the vulnerable package.
     */
    filePath?: FilePath;
    /**
     * The version of the package that contains the vulnerability fix.
     */
    fixedInVersion?: PackageVersion;
    /**
     * The name of the vulnerable package.
     */
    name: PackageName;
    /**
     * The package manager of the vulnerable package.
     */
    packageManager?: PackageManager;
    /**
     * The release of the vulnerable package.
     */
    release?: PackageRelease;
    /**
     * The code to run in your environment to update packages with a fix available.
     */
    remediation?: VulnerablePackageRemediation;
    /**
     * The Amazon Resource Number (ARN) of the AWS Lambda function affected by a finding.
     */
    sourceLambdaLayerArn?: LambdaLayerArn;
    /**
     * The source layer hash of the vulnerable package.
     */
    sourceLayerHash?: SourceLayerHash;
    /**
     * The version of the vulnerable package.
     */
    version: PackageVersion;
  }
  export type VulnerablePackageList = VulnerablePackage[];
  export type VulnerablePackageRemediation = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-06-08"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Inspector2 client.
   */
  export import Types = Inspector2;
}
export = Inspector2;
