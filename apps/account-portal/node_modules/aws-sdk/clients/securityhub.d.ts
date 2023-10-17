import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SecurityHub extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SecurityHub.Types.ClientConfiguration)
  config: Config & SecurityHub.Types.ClientConfiguration;
  /**
   * Accepts the invitation to be a member account and be monitored by the Security Hub administrator account that the invitation was sent from. This operation is only used by member accounts that are not added through Organizations. When the member account accepts the invitation, permission is granted to the administrator account to view findings generated in the member account.
   */
  acceptAdministratorInvitation(params: SecurityHub.Types.AcceptAdministratorInvitationRequest, callback?: (err: AWSError, data: SecurityHub.Types.AcceptAdministratorInvitationResponse) => void): Request<SecurityHub.Types.AcceptAdministratorInvitationResponse, AWSError>;
  /**
   * Accepts the invitation to be a member account and be monitored by the Security Hub administrator account that the invitation was sent from. This operation is only used by member accounts that are not added through Organizations. When the member account accepts the invitation, permission is granted to the administrator account to view findings generated in the member account.
   */
  acceptAdministratorInvitation(callback?: (err: AWSError, data: SecurityHub.Types.AcceptAdministratorInvitationResponse) => void): Request<SecurityHub.Types.AcceptAdministratorInvitationResponse, AWSError>;
  /**
   * This method is deprecated. Instead, use AcceptAdministratorInvitation. The Security Hub console continues to use AcceptInvitation. It will eventually change to use AcceptAdministratorInvitation. Any IAM policies that specifically control access to this function must continue to use AcceptInvitation. You should also add AcceptAdministratorInvitation to your policies to ensure that the correct permissions are in place after the console begins to use AcceptAdministratorInvitation. Accepts the invitation to be a member account and be monitored by the Security Hub administrator account that the invitation was sent from. This operation is only used by member accounts that are not added through Organizations. When the member account accepts the invitation, permission is granted to the administrator account to view findings generated in the member account.
   */
  acceptInvitation(params: SecurityHub.Types.AcceptInvitationRequest, callback?: (err: AWSError, data: SecurityHub.Types.AcceptInvitationResponse) => void): Request<SecurityHub.Types.AcceptInvitationResponse, AWSError>;
  /**
   * This method is deprecated. Instead, use AcceptAdministratorInvitation. The Security Hub console continues to use AcceptInvitation. It will eventually change to use AcceptAdministratorInvitation. Any IAM policies that specifically control access to this function must continue to use AcceptInvitation. You should also add AcceptAdministratorInvitation to your policies to ensure that the correct permissions are in place after the console begins to use AcceptAdministratorInvitation. Accepts the invitation to be a member account and be monitored by the Security Hub administrator account that the invitation was sent from. This operation is only used by member accounts that are not added through Organizations. When the member account accepts the invitation, permission is granted to the administrator account to view findings generated in the member account.
   */
  acceptInvitation(callback?: (err: AWSError, data: SecurityHub.Types.AcceptInvitationResponse) => void): Request<SecurityHub.Types.AcceptInvitationResponse, AWSError>;
  /**
   * Disables the standards specified by the provided StandardsSubscriptionArns. For more information, see Security Standards section of the Security Hub User Guide.
   */
  batchDisableStandards(params: SecurityHub.Types.BatchDisableStandardsRequest, callback?: (err: AWSError, data: SecurityHub.Types.BatchDisableStandardsResponse) => void): Request<SecurityHub.Types.BatchDisableStandardsResponse, AWSError>;
  /**
   * Disables the standards specified by the provided StandardsSubscriptionArns. For more information, see Security Standards section of the Security Hub User Guide.
   */
  batchDisableStandards(callback?: (err: AWSError, data: SecurityHub.Types.BatchDisableStandardsResponse) => void): Request<SecurityHub.Types.BatchDisableStandardsResponse, AWSError>;
  /**
   * Enables the standards specified by the provided StandardsArn. To obtain the ARN for a standard, use the DescribeStandards operation. For more information, see the Security Standards section of the Security Hub User Guide.
   */
  batchEnableStandards(params: SecurityHub.Types.BatchEnableStandardsRequest, callback?: (err: AWSError, data: SecurityHub.Types.BatchEnableStandardsResponse) => void): Request<SecurityHub.Types.BatchEnableStandardsResponse, AWSError>;
  /**
   * Enables the standards specified by the provided StandardsArn. To obtain the ARN for a standard, use the DescribeStandards operation. For more information, see the Security Standards section of the Security Hub User Guide.
   */
  batchEnableStandards(callback?: (err: AWSError, data: SecurityHub.Types.BatchEnableStandardsResponse) => void): Request<SecurityHub.Types.BatchEnableStandardsResponse, AWSError>;
  /**
   * Imports security findings generated from an integrated product into Security Hub. This action is requested by the integrated product to import its findings into Security Hub. The maximum allowed size for a finding is 240 Kb. An error is returned for any finding larger than 240 Kb. After a finding is created, BatchImportFindings cannot be used to update the following finding fields and objects, which Security Hub customers use to manage their investigation workflow.    Note     UserDefinedFields     VerificationState     Workflow    Finding providers also should not use BatchImportFindings to update the following attributes.    Confidence     Criticality     RelatedFindings     Severity     Types    Instead, finding providers use FindingProviderFields to provide values for these attributes.
   */
  batchImportFindings(params: SecurityHub.Types.BatchImportFindingsRequest, callback?: (err: AWSError, data: SecurityHub.Types.BatchImportFindingsResponse) => void): Request<SecurityHub.Types.BatchImportFindingsResponse, AWSError>;
  /**
   * Imports security findings generated from an integrated product into Security Hub. This action is requested by the integrated product to import its findings into Security Hub. The maximum allowed size for a finding is 240 Kb. An error is returned for any finding larger than 240 Kb. After a finding is created, BatchImportFindings cannot be used to update the following finding fields and objects, which Security Hub customers use to manage their investigation workflow.    Note     UserDefinedFields     VerificationState     Workflow    Finding providers also should not use BatchImportFindings to update the following attributes.    Confidence     Criticality     RelatedFindings     Severity     Types    Instead, finding providers use FindingProviderFields to provide values for these attributes.
   */
  batchImportFindings(callback?: (err: AWSError, data: SecurityHub.Types.BatchImportFindingsResponse) => void): Request<SecurityHub.Types.BatchImportFindingsResponse, AWSError>;
  /**
   * Used by Security Hub customers to update information about their investigation into a finding. Requested by administrator accounts or member accounts. Administrator accounts can update findings for their account and their member accounts. Member accounts can update findings for their account. Updates from BatchUpdateFindings do not affect the value of UpdatedAt for a finding. Administrator and member accounts can use BatchUpdateFindings to update the following finding fields and objects.    Confidence     Criticality     Note     RelatedFindings     Severity     Types     UserDefinedFields     VerificationState     Workflow    You can configure IAM policies to restrict access to fields and field values. For example, you might not want member accounts to be able to suppress findings or change the finding severity. See Configuring access to BatchUpdateFindings in the Security Hub User Guide.
   */
  batchUpdateFindings(params: SecurityHub.Types.BatchUpdateFindingsRequest, callback?: (err: AWSError, data: SecurityHub.Types.BatchUpdateFindingsResponse) => void): Request<SecurityHub.Types.BatchUpdateFindingsResponse, AWSError>;
  /**
   * Used by Security Hub customers to update information about their investigation into a finding. Requested by administrator accounts or member accounts. Administrator accounts can update findings for their account and their member accounts. Member accounts can update findings for their account. Updates from BatchUpdateFindings do not affect the value of UpdatedAt for a finding. Administrator and member accounts can use BatchUpdateFindings to update the following finding fields and objects.    Confidence     Criticality     Note     RelatedFindings     Severity     Types     UserDefinedFields     VerificationState     Workflow    You can configure IAM policies to restrict access to fields and field values. For example, you might not want member accounts to be able to suppress findings or change the finding severity. See Configuring access to BatchUpdateFindings in the Security Hub User Guide.
   */
  batchUpdateFindings(callback?: (err: AWSError, data: SecurityHub.Types.BatchUpdateFindingsResponse) => void): Request<SecurityHub.Types.BatchUpdateFindingsResponse, AWSError>;
  /**
   * Creates a custom action target in Security Hub. You can use custom actions on findings and insights in Security Hub to trigger target actions in Amazon CloudWatch Events.
   */
  createActionTarget(params: SecurityHub.Types.CreateActionTargetRequest, callback?: (err: AWSError, data: SecurityHub.Types.CreateActionTargetResponse) => void): Request<SecurityHub.Types.CreateActionTargetResponse, AWSError>;
  /**
   * Creates a custom action target in Security Hub. You can use custom actions on findings and insights in Security Hub to trigger target actions in Amazon CloudWatch Events.
   */
  createActionTarget(callback?: (err: AWSError, data: SecurityHub.Types.CreateActionTargetResponse) => void): Request<SecurityHub.Types.CreateActionTargetResponse, AWSError>;
  /**
   * Used to enable finding aggregation. Must be called from the aggregation Region. For more details about cross-Region replication, see Configuring finding aggregation in the Security Hub User Guide. 
   */
  createFindingAggregator(params: SecurityHub.Types.CreateFindingAggregatorRequest, callback?: (err: AWSError, data: SecurityHub.Types.CreateFindingAggregatorResponse) => void): Request<SecurityHub.Types.CreateFindingAggregatorResponse, AWSError>;
  /**
   * Used to enable finding aggregation. Must be called from the aggregation Region. For more details about cross-Region replication, see Configuring finding aggregation in the Security Hub User Guide. 
   */
  createFindingAggregator(callback?: (err: AWSError, data: SecurityHub.Types.CreateFindingAggregatorResponse) => void): Request<SecurityHub.Types.CreateFindingAggregatorResponse, AWSError>;
  /**
   * Creates a custom insight in Security Hub. An insight is a consolidation of findings that relate to a security issue that requires attention or remediation. To group the related findings in the insight, use the GroupByAttribute.
   */
  createInsight(params: SecurityHub.Types.CreateInsightRequest, callback?: (err: AWSError, data: SecurityHub.Types.CreateInsightResponse) => void): Request<SecurityHub.Types.CreateInsightResponse, AWSError>;
  /**
   * Creates a custom insight in Security Hub. An insight is a consolidation of findings that relate to a security issue that requires attention or remediation. To group the related findings in the insight, use the GroupByAttribute.
   */
  createInsight(callback?: (err: AWSError, data: SecurityHub.Types.CreateInsightResponse) => void): Request<SecurityHub.Types.CreateInsightResponse, AWSError>;
  /**
   * Creates a member association in Security Hub between the specified accounts and the account used to make the request, which is the administrator account. If you are integrated with Organizations, then the administrator account is designated by the organization management account.  CreateMembers is always used to add accounts that are not organization members. For accounts that are managed using Organizations, CreateMembers is only used in the following cases:   Security Hub is not configured to automatically add new organization accounts.   The account was disassociated or deleted in Security Hub.   This action can only be used by an account that has Security Hub enabled. To enable Security Hub, you can use the EnableSecurityHub operation. For accounts that are not organization members, you create the account association and then send an invitation to the member account. To send the invitation, you use the InviteMembers operation. If the account owner accepts the invitation, the account becomes a member account in Security Hub. Accounts that are managed using Organizations do not receive an invitation. They automatically become a member account in Security Hub.   If the organization account does not have Security Hub enabled, then Security Hub and the default standards are automatically enabled. Note that Security Hub cannot be enabled automatically for the organization management account. The organization management account must enable Security Hub before the administrator account enables it as a member account.   For organization accounts that already have Security Hub enabled, Security Hub does not make any other changes to those accounts. It does not change their enabled standards or controls.   A permissions policy is added that permits the administrator account to view the findings generated in the member account. To remove the association between the administrator and member accounts, use the DisassociateFromMasterAccount or DisassociateMembers operation.
   */
  createMembers(params: SecurityHub.Types.CreateMembersRequest, callback?: (err: AWSError, data: SecurityHub.Types.CreateMembersResponse) => void): Request<SecurityHub.Types.CreateMembersResponse, AWSError>;
  /**
   * Creates a member association in Security Hub between the specified accounts and the account used to make the request, which is the administrator account. If you are integrated with Organizations, then the administrator account is designated by the organization management account.  CreateMembers is always used to add accounts that are not organization members. For accounts that are managed using Organizations, CreateMembers is only used in the following cases:   Security Hub is not configured to automatically add new organization accounts.   The account was disassociated or deleted in Security Hub.   This action can only be used by an account that has Security Hub enabled. To enable Security Hub, you can use the EnableSecurityHub operation. For accounts that are not organization members, you create the account association and then send an invitation to the member account. To send the invitation, you use the InviteMembers operation. If the account owner accepts the invitation, the account becomes a member account in Security Hub. Accounts that are managed using Organizations do not receive an invitation. They automatically become a member account in Security Hub.   If the organization account does not have Security Hub enabled, then Security Hub and the default standards are automatically enabled. Note that Security Hub cannot be enabled automatically for the organization management account. The organization management account must enable Security Hub before the administrator account enables it as a member account.   For organization accounts that already have Security Hub enabled, Security Hub does not make any other changes to those accounts. It does not change their enabled standards or controls.   A permissions policy is added that permits the administrator account to view the findings generated in the member account. To remove the association between the administrator and member accounts, use the DisassociateFromMasterAccount or DisassociateMembers operation.
   */
  createMembers(callback?: (err: AWSError, data: SecurityHub.Types.CreateMembersResponse) => void): Request<SecurityHub.Types.CreateMembersResponse, AWSError>;
  /**
   * Declines invitations to become a member account. This operation is only used by accounts that are not part of an organization. Organization accounts do not receive invitations.
   */
  declineInvitations(params: SecurityHub.Types.DeclineInvitationsRequest, callback?: (err: AWSError, data: SecurityHub.Types.DeclineInvitationsResponse) => void): Request<SecurityHub.Types.DeclineInvitationsResponse, AWSError>;
  /**
   * Declines invitations to become a member account. This operation is only used by accounts that are not part of an organization. Organization accounts do not receive invitations.
   */
  declineInvitations(callback?: (err: AWSError, data: SecurityHub.Types.DeclineInvitationsResponse) => void): Request<SecurityHub.Types.DeclineInvitationsResponse, AWSError>;
  /**
   * Deletes a custom action target from Security Hub. Deleting a custom action target does not affect any findings or insights that were already sent to Amazon CloudWatch Events using the custom action.
   */
  deleteActionTarget(params: SecurityHub.Types.DeleteActionTargetRequest, callback?: (err: AWSError, data: SecurityHub.Types.DeleteActionTargetResponse) => void): Request<SecurityHub.Types.DeleteActionTargetResponse, AWSError>;
  /**
   * Deletes a custom action target from Security Hub. Deleting a custom action target does not affect any findings or insights that were already sent to Amazon CloudWatch Events using the custom action.
   */
  deleteActionTarget(callback?: (err: AWSError, data: SecurityHub.Types.DeleteActionTargetResponse) => void): Request<SecurityHub.Types.DeleteActionTargetResponse, AWSError>;
  /**
   * Deletes a finding aggregator. When you delete the finding aggregator, you stop finding aggregation. When you stop finding aggregation, findings that were already aggregated to the aggregation Region are still visible from the aggregation Region. New findings and finding updates are not aggregated. 
   */
  deleteFindingAggregator(params: SecurityHub.Types.DeleteFindingAggregatorRequest, callback?: (err: AWSError, data: SecurityHub.Types.DeleteFindingAggregatorResponse) => void): Request<SecurityHub.Types.DeleteFindingAggregatorResponse, AWSError>;
  /**
   * Deletes a finding aggregator. When you delete the finding aggregator, you stop finding aggregation. When you stop finding aggregation, findings that were already aggregated to the aggregation Region are still visible from the aggregation Region. New findings and finding updates are not aggregated. 
   */
  deleteFindingAggregator(callback?: (err: AWSError, data: SecurityHub.Types.DeleteFindingAggregatorResponse) => void): Request<SecurityHub.Types.DeleteFindingAggregatorResponse, AWSError>;
  /**
   * Deletes the insight specified by the InsightArn.
   */
  deleteInsight(params: SecurityHub.Types.DeleteInsightRequest, callback?: (err: AWSError, data: SecurityHub.Types.DeleteInsightResponse) => void): Request<SecurityHub.Types.DeleteInsightResponse, AWSError>;
  /**
   * Deletes the insight specified by the InsightArn.
   */
  deleteInsight(callback?: (err: AWSError, data: SecurityHub.Types.DeleteInsightResponse) => void): Request<SecurityHub.Types.DeleteInsightResponse, AWSError>;
  /**
   * Deletes invitations received by the Amazon Web Services account to become a member account. This operation is only used by accounts that are not part of an organization. Organization accounts do not receive invitations.
   */
  deleteInvitations(params: SecurityHub.Types.DeleteInvitationsRequest, callback?: (err: AWSError, data: SecurityHub.Types.DeleteInvitationsResponse) => void): Request<SecurityHub.Types.DeleteInvitationsResponse, AWSError>;
  /**
   * Deletes invitations received by the Amazon Web Services account to become a member account. This operation is only used by accounts that are not part of an organization. Organization accounts do not receive invitations.
   */
  deleteInvitations(callback?: (err: AWSError, data: SecurityHub.Types.DeleteInvitationsResponse) => void): Request<SecurityHub.Types.DeleteInvitationsResponse, AWSError>;
  /**
   * Deletes the specified member accounts from Security Hub. Can be used to delete member accounts that belong to an organization as well as member accounts that were invited manually.
   */
  deleteMembers(params: SecurityHub.Types.DeleteMembersRequest, callback?: (err: AWSError, data: SecurityHub.Types.DeleteMembersResponse) => void): Request<SecurityHub.Types.DeleteMembersResponse, AWSError>;
  /**
   * Deletes the specified member accounts from Security Hub. Can be used to delete member accounts that belong to an organization as well as member accounts that were invited manually.
   */
  deleteMembers(callback?: (err: AWSError, data: SecurityHub.Types.DeleteMembersResponse) => void): Request<SecurityHub.Types.DeleteMembersResponse, AWSError>;
  /**
   * Returns a list of the custom action targets in Security Hub in your account.
   */
  describeActionTargets(params: SecurityHub.Types.DescribeActionTargetsRequest, callback?: (err: AWSError, data: SecurityHub.Types.DescribeActionTargetsResponse) => void): Request<SecurityHub.Types.DescribeActionTargetsResponse, AWSError>;
  /**
   * Returns a list of the custom action targets in Security Hub in your account.
   */
  describeActionTargets(callback?: (err: AWSError, data: SecurityHub.Types.DescribeActionTargetsResponse) => void): Request<SecurityHub.Types.DescribeActionTargetsResponse, AWSError>;
  /**
   * Returns details about the Hub resource in your account, including the HubArn and the time when you enabled Security Hub.
   */
  describeHub(params: SecurityHub.Types.DescribeHubRequest, callback?: (err: AWSError, data: SecurityHub.Types.DescribeHubResponse) => void): Request<SecurityHub.Types.DescribeHubResponse, AWSError>;
  /**
   * Returns details about the Hub resource in your account, including the HubArn and the time when you enabled Security Hub.
   */
  describeHub(callback?: (err: AWSError, data: SecurityHub.Types.DescribeHubResponse) => void): Request<SecurityHub.Types.DescribeHubResponse, AWSError>;
  /**
   * Returns information about the Organizations configuration for Security Hub. Can only be called from a Security Hub administrator account.
   */
  describeOrganizationConfiguration(params: SecurityHub.Types.DescribeOrganizationConfigurationRequest, callback?: (err: AWSError, data: SecurityHub.Types.DescribeOrganizationConfigurationResponse) => void): Request<SecurityHub.Types.DescribeOrganizationConfigurationResponse, AWSError>;
  /**
   * Returns information about the Organizations configuration for Security Hub. Can only be called from a Security Hub administrator account.
   */
  describeOrganizationConfiguration(callback?: (err: AWSError, data: SecurityHub.Types.DescribeOrganizationConfigurationResponse) => void): Request<SecurityHub.Types.DescribeOrganizationConfigurationResponse, AWSError>;
  /**
   * Returns information about product integrations in Security Hub. You can optionally provide an integration ARN. If you provide an integration ARN, then the results only include that integration. If you do not provide an integration ARN, then the results include all of the available product integrations. 
   */
  describeProducts(params: SecurityHub.Types.DescribeProductsRequest, callback?: (err: AWSError, data: SecurityHub.Types.DescribeProductsResponse) => void): Request<SecurityHub.Types.DescribeProductsResponse, AWSError>;
  /**
   * Returns information about product integrations in Security Hub. You can optionally provide an integration ARN. If you provide an integration ARN, then the results only include that integration. If you do not provide an integration ARN, then the results include all of the available product integrations. 
   */
  describeProducts(callback?: (err: AWSError, data: SecurityHub.Types.DescribeProductsResponse) => void): Request<SecurityHub.Types.DescribeProductsResponse, AWSError>;
  /**
   * Returns a list of the available standards in Security Hub. For each standard, the results include the standard ARN, the name, and a description. 
   */
  describeStandards(params: SecurityHub.Types.DescribeStandardsRequest, callback?: (err: AWSError, data: SecurityHub.Types.DescribeStandardsResponse) => void): Request<SecurityHub.Types.DescribeStandardsResponse, AWSError>;
  /**
   * Returns a list of the available standards in Security Hub. For each standard, the results include the standard ARN, the name, and a description. 
   */
  describeStandards(callback?: (err: AWSError, data: SecurityHub.Types.DescribeStandardsResponse) => void): Request<SecurityHub.Types.DescribeStandardsResponse, AWSError>;
  /**
   * Returns a list of security standards controls. For each control, the results include information about whether it is currently enabled, the severity, and a link to remediation information.
   */
  describeStandardsControls(params: SecurityHub.Types.DescribeStandardsControlsRequest, callback?: (err: AWSError, data: SecurityHub.Types.DescribeStandardsControlsResponse) => void): Request<SecurityHub.Types.DescribeStandardsControlsResponse, AWSError>;
  /**
   * Returns a list of security standards controls. For each control, the results include information about whether it is currently enabled, the severity, and a link to remediation information.
   */
  describeStandardsControls(callback?: (err: AWSError, data: SecurityHub.Types.DescribeStandardsControlsResponse) => void): Request<SecurityHub.Types.DescribeStandardsControlsResponse, AWSError>;
  /**
   * Disables the integration of the specified product with Security Hub. After the integration is disabled, findings from that product are no longer sent to Security Hub.
   */
  disableImportFindingsForProduct(params: SecurityHub.Types.DisableImportFindingsForProductRequest, callback?: (err: AWSError, data: SecurityHub.Types.DisableImportFindingsForProductResponse) => void): Request<SecurityHub.Types.DisableImportFindingsForProductResponse, AWSError>;
  /**
   * Disables the integration of the specified product with Security Hub. After the integration is disabled, findings from that product are no longer sent to Security Hub.
   */
  disableImportFindingsForProduct(callback?: (err: AWSError, data: SecurityHub.Types.DisableImportFindingsForProductResponse) => void): Request<SecurityHub.Types.DisableImportFindingsForProductResponse, AWSError>;
  /**
   * Disables a Security Hub administrator account. Can only be called by the organization management account.
   */
  disableOrganizationAdminAccount(params: SecurityHub.Types.DisableOrganizationAdminAccountRequest, callback?: (err: AWSError, data: SecurityHub.Types.DisableOrganizationAdminAccountResponse) => void): Request<SecurityHub.Types.DisableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Disables a Security Hub administrator account. Can only be called by the organization management account.
   */
  disableOrganizationAdminAccount(callback?: (err: AWSError, data: SecurityHub.Types.DisableOrganizationAdminAccountResponse) => void): Request<SecurityHub.Types.DisableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Disables Security Hub in your account only in the current Region. To disable Security Hub in all Regions, you must submit one request per Region where you have enabled Security Hub. When you disable Security Hub for an administrator account, it doesn't disable Security Hub for any associated member accounts. When you disable Security Hub, your existing findings and insights and any Security Hub configuration settings are deleted after 90 days and cannot be recovered. Any standards that were enabled are disabled, and your administrator and member account associations are removed. If you want to save your existing findings, you must export them before you disable Security Hub.
   */
  disableSecurityHub(params: SecurityHub.Types.DisableSecurityHubRequest, callback?: (err: AWSError, data: SecurityHub.Types.DisableSecurityHubResponse) => void): Request<SecurityHub.Types.DisableSecurityHubResponse, AWSError>;
  /**
   * Disables Security Hub in your account only in the current Region. To disable Security Hub in all Regions, you must submit one request per Region where you have enabled Security Hub. When you disable Security Hub for an administrator account, it doesn't disable Security Hub for any associated member accounts. When you disable Security Hub, your existing findings and insights and any Security Hub configuration settings are deleted after 90 days and cannot be recovered. Any standards that were enabled are disabled, and your administrator and member account associations are removed. If you want to save your existing findings, you must export them before you disable Security Hub.
   */
  disableSecurityHub(callback?: (err: AWSError, data: SecurityHub.Types.DisableSecurityHubResponse) => void): Request<SecurityHub.Types.DisableSecurityHubResponse, AWSError>;
  /**
   * Disassociates the current Security Hub member account from the associated administrator account. This operation is only used by accounts that are not part of an organization. For organization accounts, only the administrator account can disassociate a member account.
   */
  disassociateFromAdministratorAccount(params: SecurityHub.Types.DisassociateFromAdministratorAccountRequest, callback?: (err: AWSError, data: SecurityHub.Types.DisassociateFromAdministratorAccountResponse) => void): Request<SecurityHub.Types.DisassociateFromAdministratorAccountResponse, AWSError>;
  /**
   * Disassociates the current Security Hub member account from the associated administrator account. This operation is only used by accounts that are not part of an organization. For organization accounts, only the administrator account can disassociate a member account.
   */
  disassociateFromAdministratorAccount(callback?: (err: AWSError, data: SecurityHub.Types.DisassociateFromAdministratorAccountResponse) => void): Request<SecurityHub.Types.DisassociateFromAdministratorAccountResponse, AWSError>;
  /**
   * This method is deprecated. Instead, use DisassociateFromAdministratorAccount. The Security Hub console continues to use DisassociateFromMasterAccount. It will eventually change to use DisassociateFromAdministratorAccount. Any IAM policies that specifically control access to this function must continue to use DisassociateFromMasterAccount. You should also add DisassociateFromAdministratorAccount to your policies to ensure that the correct permissions are in place after the console begins to use DisassociateFromAdministratorAccount. Disassociates the current Security Hub member account from the associated administrator account. This operation is only used by accounts that are not part of an organization. For organization accounts, only the administrator account can disassociate a member account.
   */
  disassociateFromMasterAccount(params: SecurityHub.Types.DisassociateFromMasterAccountRequest, callback?: (err: AWSError, data: SecurityHub.Types.DisassociateFromMasterAccountResponse) => void): Request<SecurityHub.Types.DisassociateFromMasterAccountResponse, AWSError>;
  /**
   * This method is deprecated. Instead, use DisassociateFromAdministratorAccount. The Security Hub console continues to use DisassociateFromMasterAccount. It will eventually change to use DisassociateFromAdministratorAccount. Any IAM policies that specifically control access to this function must continue to use DisassociateFromMasterAccount. You should also add DisassociateFromAdministratorAccount to your policies to ensure that the correct permissions are in place after the console begins to use DisassociateFromAdministratorAccount. Disassociates the current Security Hub member account from the associated administrator account. This operation is only used by accounts that are not part of an organization. For organization accounts, only the administrator account can disassociate a member account.
   */
  disassociateFromMasterAccount(callback?: (err: AWSError, data: SecurityHub.Types.DisassociateFromMasterAccountResponse) => void): Request<SecurityHub.Types.DisassociateFromMasterAccountResponse, AWSError>;
  /**
   * Disassociates the specified member accounts from the associated administrator account. Can be used to disassociate both accounts that are managed using Organizations and accounts that were invited manually.
   */
  disassociateMembers(params: SecurityHub.Types.DisassociateMembersRequest, callback?: (err: AWSError, data: SecurityHub.Types.DisassociateMembersResponse) => void): Request<SecurityHub.Types.DisassociateMembersResponse, AWSError>;
  /**
   * Disassociates the specified member accounts from the associated administrator account. Can be used to disassociate both accounts that are managed using Organizations and accounts that were invited manually.
   */
  disassociateMembers(callback?: (err: AWSError, data: SecurityHub.Types.DisassociateMembersResponse) => void): Request<SecurityHub.Types.DisassociateMembersResponse, AWSError>;
  /**
   * Enables the integration of a partner product with Security Hub. Integrated products send findings to Security Hub. When you enable a product integration, a permissions policy that grants permission for the product to send findings to Security Hub is applied.
   */
  enableImportFindingsForProduct(params: SecurityHub.Types.EnableImportFindingsForProductRequest, callback?: (err: AWSError, data: SecurityHub.Types.EnableImportFindingsForProductResponse) => void): Request<SecurityHub.Types.EnableImportFindingsForProductResponse, AWSError>;
  /**
   * Enables the integration of a partner product with Security Hub. Integrated products send findings to Security Hub. When you enable a product integration, a permissions policy that grants permission for the product to send findings to Security Hub is applied.
   */
  enableImportFindingsForProduct(callback?: (err: AWSError, data: SecurityHub.Types.EnableImportFindingsForProductResponse) => void): Request<SecurityHub.Types.EnableImportFindingsForProductResponse, AWSError>;
  /**
   * Designates the Security Hub administrator account for an organization. Can only be called by the organization management account.
   */
  enableOrganizationAdminAccount(params: SecurityHub.Types.EnableOrganizationAdminAccountRequest, callback?: (err: AWSError, data: SecurityHub.Types.EnableOrganizationAdminAccountResponse) => void): Request<SecurityHub.Types.EnableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Designates the Security Hub administrator account for an organization. Can only be called by the organization management account.
   */
  enableOrganizationAdminAccount(callback?: (err: AWSError, data: SecurityHub.Types.EnableOrganizationAdminAccountResponse) => void): Request<SecurityHub.Types.EnableOrganizationAdminAccountResponse, AWSError>;
  /**
   * Enables Security Hub for your account in the current Region or the Region you specify in the request. When you enable Security Hub, you grant to Security Hub the permissions necessary to gather findings from other services that are integrated with Security Hub. When you use the EnableSecurityHub operation to enable Security Hub, you also automatically enable the following standards.   CIS Amazon Web Services Foundations   Amazon Web Services Foundational Security Best Practices   You do not enable the Payment Card Industry Data Security Standard (PCI DSS) standard.  To not enable the automatically enabled standards, set EnableDefaultStandards to false. After you enable Security Hub, to enable a standard, use the BatchEnableStandards operation. To disable a standard, use the BatchDisableStandards operation. To learn more, see the setup information in the Security Hub User Guide.
   */
  enableSecurityHub(params: SecurityHub.Types.EnableSecurityHubRequest, callback?: (err: AWSError, data: SecurityHub.Types.EnableSecurityHubResponse) => void): Request<SecurityHub.Types.EnableSecurityHubResponse, AWSError>;
  /**
   * Enables Security Hub for your account in the current Region or the Region you specify in the request. When you enable Security Hub, you grant to Security Hub the permissions necessary to gather findings from other services that are integrated with Security Hub. When you use the EnableSecurityHub operation to enable Security Hub, you also automatically enable the following standards.   CIS Amazon Web Services Foundations   Amazon Web Services Foundational Security Best Practices   You do not enable the Payment Card Industry Data Security Standard (PCI DSS) standard.  To not enable the automatically enabled standards, set EnableDefaultStandards to false. After you enable Security Hub, to enable a standard, use the BatchEnableStandards operation. To disable a standard, use the BatchDisableStandards operation. To learn more, see the setup information in the Security Hub User Guide.
   */
  enableSecurityHub(callback?: (err: AWSError, data: SecurityHub.Types.EnableSecurityHubResponse) => void): Request<SecurityHub.Types.EnableSecurityHubResponse, AWSError>;
  /**
   * Provides the details for the Security Hub administrator account for the current member account. Can be used by both member accounts that are managed using Organizations and accounts that were invited manually.
   */
  getAdministratorAccount(params: SecurityHub.Types.GetAdministratorAccountRequest, callback?: (err: AWSError, data: SecurityHub.Types.GetAdministratorAccountResponse) => void): Request<SecurityHub.Types.GetAdministratorAccountResponse, AWSError>;
  /**
   * Provides the details for the Security Hub administrator account for the current member account. Can be used by both member accounts that are managed using Organizations and accounts that were invited manually.
   */
  getAdministratorAccount(callback?: (err: AWSError, data: SecurityHub.Types.GetAdministratorAccountResponse) => void): Request<SecurityHub.Types.GetAdministratorAccountResponse, AWSError>;
  /**
   * Returns a list of the standards that are currently enabled.
   */
  getEnabledStandards(params: SecurityHub.Types.GetEnabledStandardsRequest, callback?: (err: AWSError, data: SecurityHub.Types.GetEnabledStandardsResponse) => void): Request<SecurityHub.Types.GetEnabledStandardsResponse, AWSError>;
  /**
   * Returns a list of the standards that are currently enabled.
   */
  getEnabledStandards(callback?: (err: AWSError, data: SecurityHub.Types.GetEnabledStandardsResponse) => void): Request<SecurityHub.Types.GetEnabledStandardsResponse, AWSError>;
  /**
   * Returns the current finding aggregation configuration.
   */
  getFindingAggregator(params: SecurityHub.Types.GetFindingAggregatorRequest, callback?: (err: AWSError, data: SecurityHub.Types.GetFindingAggregatorResponse) => void): Request<SecurityHub.Types.GetFindingAggregatorResponse, AWSError>;
  /**
   * Returns the current finding aggregation configuration.
   */
  getFindingAggregator(callback?: (err: AWSError, data: SecurityHub.Types.GetFindingAggregatorResponse) => void): Request<SecurityHub.Types.GetFindingAggregatorResponse, AWSError>;
  /**
   * Returns a list of findings that match the specified criteria. If finding aggregation is enabled, then when you call GetFindings from the aggregation Region, the results include all of the matching findings from both the aggregation Region and the linked Regions.
   */
  getFindings(params: SecurityHub.Types.GetFindingsRequest, callback?: (err: AWSError, data: SecurityHub.Types.GetFindingsResponse) => void): Request<SecurityHub.Types.GetFindingsResponse, AWSError>;
  /**
   * Returns a list of findings that match the specified criteria. If finding aggregation is enabled, then when you call GetFindings from the aggregation Region, the results include all of the matching findings from both the aggregation Region and the linked Regions.
   */
  getFindings(callback?: (err: AWSError, data: SecurityHub.Types.GetFindingsResponse) => void): Request<SecurityHub.Types.GetFindingsResponse, AWSError>;
  /**
   * Lists the results of the Security Hub insight specified by the insight ARN.
   */
  getInsightResults(params: SecurityHub.Types.GetInsightResultsRequest, callback?: (err: AWSError, data: SecurityHub.Types.GetInsightResultsResponse) => void): Request<SecurityHub.Types.GetInsightResultsResponse, AWSError>;
  /**
   * Lists the results of the Security Hub insight specified by the insight ARN.
   */
  getInsightResults(callback?: (err: AWSError, data: SecurityHub.Types.GetInsightResultsResponse) => void): Request<SecurityHub.Types.GetInsightResultsResponse, AWSError>;
  /**
   * Lists and describes insights for the specified insight ARNs.
   */
  getInsights(params: SecurityHub.Types.GetInsightsRequest, callback?: (err: AWSError, data: SecurityHub.Types.GetInsightsResponse) => void): Request<SecurityHub.Types.GetInsightsResponse, AWSError>;
  /**
   * Lists and describes insights for the specified insight ARNs.
   */
  getInsights(callback?: (err: AWSError, data: SecurityHub.Types.GetInsightsResponse) => void): Request<SecurityHub.Types.GetInsightsResponse, AWSError>;
  /**
   * Returns the count of all Security Hub membership invitations that were sent to the current member account, not including the currently accepted invitation. 
   */
  getInvitationsCount(params: SecurityHub.Types.GetInvitationsCountRequest, callback?: (err: AWSError, data: SecurityHub.Types.GetInvitationsCountResponse) => void): Request<SecurityHub.Types.GetInvitationsCountResponse, AWSError>;
  /**
   * Returns the count of all Security Hub membership invitations that were sent to the current member account, not including the currently accepted invitation. 
   */
  getInvitationsCount(callback?: (err: AWSError, data: SecurityHub.Types.GetInvitationsCountResponse) => void): Request<SecurityHub.Types.GetInvitationsCountResponse, AWSError>;
  /**
   * This method is deprecated. Instead, use GetAdministratorAccount. The Security Hub console continues to use GetMasterAccount. It will eventually change to use GetAdministratorAccount. Any IAM policies that specifically control access to this function must continue to use GetMasterAccount. You should also add GetAdministratorAccount to your policies to ensure that the correct permissions are in place after the console begins to use GetAdministratorAccount. Provides the details for the Security Hub administrator account for the current member account. Can be used by both member accounts that are managed using Organizations and accounts that were invited manually.
   */
  getMasterAccount(params: SecurityHub.Types.GetMasterAccountRequest, callback?: (err: AWSError, data: SecurityHub.Types.GetMasterAccountResponse) => void): Request<SecurityHub.Types.GetMasterAccountResponse, AWSError>;
  /**
   * This method is deprecated. Instead, use GetAdministratorAccount. The Security Hub console continues to use GetMasterAccount. It will eventually change to use GetAdministratorAccount. Any IAM policies that specifically control access to this function must continue to use GetMasterAccount. You should also add GetAdministratorAccount to your policies to ensure that the correct permissions are in place after the console begins to use GetAdministratorAccount. Provides the details for the Security Hub administrator account for the current member account. Can be used by both member accounts that are managed using Organizations and accounts that were invited manually.
   */
  getMasterAccount(callback?: (err: AWSError, data: SecurityHub.Types.GetMasterAccountResponse) => void): Request<SecurityHub.Types.GetMasterAccountResponse, AWSError>;
  /**
   * Returns the details for the Security Hub member accounts for the specified account IDs. An administrator account can be either the delegated Security Hub administrator account for an organization or an administrator account that enabled Security Hub manually. The results include both member accounts that are managed using Organizations and accounts that were invited manually.
   */
  getMembers(params: SecurityHub.Types.GetMembersRequest, callback?: (err: AWSError, data: SecurityHub.Types.GetMembersResponse) => void): Request<SecurityHub.Types.GetMembersResponse, AWSError>;
  /**
   * Returns the details for the Security Hub member accounts for the specified account IDs. An administrator account can be either the delegated Security Hub administrator account for an organization or an administrator account that enabled Security Hub manually. The results include both member accounts that are managed using Organizations and accounts that were invited manually.
   */
  getMembers(callback?: (err: AWSError, data: SecurityHub.Types.GetMembersResponse) => void): Request<SecurityHub.Types.GetMembersResponse, AWSError>;
  /**
   * Invites other Amazon Web Services accounts to become member accounts for the Security Hub administrator account that the invitation is sent from. This operation is only used to invite accounts that do not belong to an organization. Organization accounts do not receive invitations. Before you can use this action to invite a member, you must first use the CreateMembers action to create the member account in Security Hub. When the account owner enables Security Hub and accepts the invitation to become a member account, the administrator account can view the findings generated from the member account.
   */
  inviteMembers(params: SecurityHub.Types.InviteMembersRequest, callback?: (err: AWSError, data: SecurityHub.Types.InviteMembersResponse) => void): Request<SecurityHub.Types.InviteMembersResponse, AWSError>;
  /**
   * Invites other Amazon Web Services accounts to become member accounts for the Security Hub administrator account that the invitation is sent from. This operation is only used to invite accounts that do not belong to an organization. Organization accounts do not receive invitations. Before you can use this action to invite a member, you must first use the CreateMembers action to create the member account in Security Hub. When the account owner enables Security Hub and accepts the invitation to become a member account, the administrator account can view the findings generated from the member account.
   */
  inviteMembers(callback?: (err: AWSError, data: SecurityHub.Types.InviteMembersResponse) => void): Request<SecurityHub.Types.InviteMembersResponse, AWSError>;
  /**
   * Lists all findings-generating solutions (products) that you are subscribed to receive findings from in Security Hub.
   */
  listEnabledProductsForImport(params: SecurityHub.Types.ListEnabledProductsForImportRequest, callback?: (err: AWSError, data: SecurityHub.Types.ListEnabledProductsForImportResponse) => void): Request<SecurityHub.Types.ListEnabledProductsForImportResponse, AWSError>;
  /**
   * Lists all findings-generating solutions (products) that you are subscribed to receive findings from in Security Hub.
   */
  listEnabledProductsForImport(callback?: (err: AWSError, data: SecurityHub.Types.ListEnabledProductsForImportResponse) => void): Request<SecurityHub.Types.ListEnabledProductsForImportResponse, AWSError>;
  /**
   * If finding aggregation is enabled, then ListFindingAggregators returns the ARN of the finding aggregator. You can run this operation from any Region.
   */
  listFindingAggregators(params: SecurityHub.Types.ListFindingAggregatorsRequest, callback?: (err: AWSError, data: SecurityHub.Types.ListFindingAggregatorsResponse) => void): Request<SecurityHub.Types.ListFindingAggregatorsResponse, AWSError>;
  /**
   * If finding aggregation is enabled, then ListFindingAggregators returns the ARN of the finding aggregator. You can run this operation from any Region.
   */
  listFindingAggregators(callback?: (err: AWSError, data: SecurityHub.Types.ListFindingAggregatorsResponse) => void): Request<SecurityHub.Types.ListFindingAggregatorsResponse, AWSError>;
  /**
   * Lists all Security Hub membership invitations that were sent to the current Amazon Web Services account. This operation is only used by accounts that are managed by invitation. Accounts that are managed using the integration with Organizations do not receive invitations.
   */
  listInvitations(params: SecurityHub.Types.ListInvitationsRequest, callback?: (err: AWSError, data: SecurityHub.Types.ListInvitationsResponse) => void): Request<SecurityHub.Types.ListInvitationsResponse, AWSError>;
  /**
   * Lists all Security Hub membership invitations that were sent to the current Amazon Web Services account. This operation is only used by accounts that are managed by invitation. Accounts that are managed using the integration with Organizations do not receive invitations.
   */
  listInvitations(callback?: (err: AWSError, data: SecurityHub.Types.ListInvitationsResponse) => void): Request<SecurityHub.Types.ListInvitationsResponse, AWSError>;
  /**
   * Lists details about all member accounts for the current Security Hub administrator account. The results include both member accounts that belong to an organization and member accounts that were invited manually.
   */
  listMembers(params: SecurityHub.Types.ListMembersRequest, callback?: (err: AWSError, data: SecurityHub.Types.ListMembersResponse) => void): Request<SecurityHub.Types.ListMembersResponse, AWSError>;
  /**
   * Lists details about all member accounts for the current Security Hub administrator account. The results include both member accounts that belong to an organization and member accounts that were invited manually.
   */
  listMembers(callback?: (err: AWSError, data: SecurityHub.Types.ListMembersResponse) => void): Request<SecurityHub.Types.ListMembersResponse, AWSError>;
  /**
   * Lists the Security Hub administrator accounts. Can only be called by the organization management account.
   */
  listOrganizationAdminAccounts(params: SecurityHub.Types.ListOrganizationAdminAccountsRequest, callback?: (err: AWSError, data: SecurityHub.Types.ListOrganizationAdminAccountsResponse) => void): Request<SecurityHub.Types.ListOrganizationAdminAccountsResponse, AWSError>;
  /**
   * Lists the Security Hub administrator accounts. Can only be called by the organization management account.
   */
  listOrganizationAdminAccounts(callback?: (err: AWSError, data: SecurityHub.Types.ListOrganizationAdminAccountsResponse) => void): Request<SecurityHub.Types.ListOrganizationAdminAccountsResponse, AWSError>;
  /**
   * Returns a list of tags associated with a resource.
   */
  listTagsForResource(params: SecurityHub.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: SecurityHub.Types.ListTagsForResourceResponse) => void): Request<SecurityHub.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of tags associated with a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: SecurityHub.Types.ListTagsForResourceResponse) => void): Request<SecurityHub.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Adds one or more tags to a resource.
   */
  tagResource(params: SecurityHub.Types.TagResourceRequest, callback?: (err: AWSError, data: SecurityHub.Types.TagResourceResponse) => void): Request<SecurityHub.Types.TagResourceResponse, AWSError>;
  /**
   * Adds one or more tags to a resource.
   */
  tagResource(callback?: (err: AWSError, data: SecurityHub.Types.TagResourceResponse) => void): Request<SecurityHub.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a resource.
   */
  untagResource(params: SecurityHub.Types.UntagResourceRequest, callback?: (err: AWSError, data: SecurityHub.Types.UntagResourceResponse) => void): Request<SecurityHub.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: SecurityHub.Types.UntagResourceResponse) => void): Request<SecurityHub.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the name and description of a custom action target in Security Hub.
   */
  updateActionTarget(params: SecurityHub.Types.UpdateActionTargetRequest, callback?: (err: AWSError, data: SecurityHub.Types.UpdateActionTargetResponse) => void): Request<SecurityHub.Types.UpdateActionTargetResponse, AWSError>;
  /**
   * Updates the name and description of a custom action target in Security Hub.
   */
  updateActionTarget(callback?: (err: AWSError, data: SecurityHub.Types.UpdateActionTargetResponse) => void): Request<SecurityHub.Types.UpdateActionTargetResponse, AWSError>;
  /**
   * Updates the finding aggregation configuration. Used to update the Region linking mode and the list of included or excluded Regions. You cannot use UpdateFindingAggregator to change the aggregation Region. You must run UpdateFindingAggregator from the current aggregation Region. 
   */
  updateFindingAggregator(params: SecurityHub.Types.UpdateFindingAggregatorRequest, callback?: (err: AWSError, data: SecurityHub.Types.UpdateFindingAggregatorResponse) => void): Request<SecurityHub.Types.UpdateFindingAggregatorResponse, AWSError>;
  /**
   * Updates the finding aggregation configuration. Used to update the Region linking mode and the list of included or excluded Regions. You cannot use UpdateFindingAggregator to change the aggregation Region. You must run UpdateFindingAggregator from the current aggregation Region. 
   */
  updateFindingAggregator(callback?: (err: AWSError, data: SecurityHub.Types.UpdateFindingAggregatorResponse) => void): Request<SecurityHub.Types.UpdateFindingAggregatorResponse, AWSError>;
  /**
   *  UpdateFindings is deprecated. Instead of UpdateFindings, use BatchUpdateFindings. Updates the Note and RecordState of the Security Hub-aggregated findings that the filter attributes specify. Any member account that can view the finding also sees the update to the finding.
   */
  updateFindings(params: SecurityHub.Types.UpdateFindingsRequest, callback?: (err: AWSError, data: SecurityHub.Types.UpdateFindingsResponse) => void): Request<SecurityHub.Types.UpdateFindingsResponse, AWSError>;
  /**
   *  UpdateFindings is deprecated. Instead of UpdateFindings, use BatchUpdateFindings. Updates the Note and RecordState of the Security Hub-aggregated findings that the filter attributes specify. Any member account that can view the finding also sees the update to the finding.
   */
  updateFindings(callback?: (err: AWSError, data: SecurityHub.Types.UpdateFindingsResponse) => void): Request<SecurityHub.Types.UpdateFindingsResponse, AWSError>;
  /**
   * Updates the Security Hub insight identified by the specified insight ARN.
   */
  updateInsight(params: SecurityHub.Types.UpdateInsightRequest, callback?: (err: AWSError, data: SecurityHub.Types.UpdateInsightResponse) => void): Request<SecurityHub.Types.UpdateInsightResponse, AWSError>;
  /**
   * Updates the Security Hub insight identified by the specified insight ARN.
   */
  updateInsight(callback?: (err: AWSError, data: SecurityHub.Types.UpdateInsightResponse) => void): Request<SecurityHub.Types.UpdateInsightResponse, AWSError>;
  /**
   * Used to update the configuration related to Organizations. Can only be called from a Security Hub administrator account.
   */
  updateOrganizationConfiguration(params: SecurityHub.Types.UpdateOrganizationConfigurationRequest, callback?: (err: AWSError, data: SecurityHub.Types.UpdateOrganizationConfigurationResponse) => void): Request<SecurityHub.Types.UpdateOrganizationConfigurationResponse, AWSError>;
  /**
   * Used to update the configuration related to Organizations. Can only be called from a Security Hub administrator account.
   */
  updateOrganizationConfiguration(callback?: (err: AWSError, data: SecurityHub.Types.UpdateOrganizationConfigurationResponse) => void): Request<SecurityHub.Types.UpdateOrganizationConfigurationResponse, AWSError>;
  /**
   * Updates configuration options for Security Hub.
   */
  updateSecurityHubConfiguration(params: SecurityHub.Types.UpdateSecurityHubConfigurationRequest, callback?: (err: AWSError, data: SecurityHub.Types.UpdateSecurityHubConfigurationResponse) => void): Request<SecurityHub.Types.UpdateSecurityHubConfigurationResponse, AWSError>;
  /**
   * Updates configuration options for Security Hub.
   */
  updateSecurityHubConfiguration(callback?: (err: AWSError, data: SecurityHub.Types.UpdateSecurityHubConfigurationResponse) => void): Request<SecurityHub.Types.UpdateSecurityHubConfigurationResponse, AWSError>;
  /**
   * Used to control whether an individual security standard control is enabled or disabled.
   */
  updateStandardsControl(params: SecurityHub.Types.UpdateStandardsControlRequest, callback?: (err: AWSError, data: SecurityHub.Types.UpdateStandardsControlResponse) => void): Request<SecurityHub.Types.UpdateStandardsControlResponse, AWSError>;
  /**
   * Used to control whether an individual security standard control is enabled or disabled.
   */
  updateStandardsControl(callback?: (err: AWSError, data: SecurityHub.Types.UpdateStandardsControlResponse) => void): Request<SecurityHub.Types.UpdateStandardsControlResponse, AWSError>;
}
declare namespace SecurityHub {
  export interface AcceptAdministratorInvitationRequest {
    /**
     * The account ID of the Security Hub administrator account that sent the invitation.
     */
    AdministratorId: NonEmptyString;
    /**
     * The identifier of the invitation sent from the Security Hub administrator account.
     */
    InvitationId: NonEmptyString;
  }
  export interface AcceptAdministratorInvitationResponse {
  }
  export interface AcceptInvitationRequest {
    /**
     * The account ID of the Security Hub administrator account that sent the invitation.
     */
    MasterId: NonEmptyString;
    /**
     * The identifier of the invitation sent from the Security Hub administrator account.
     */
    InvitationId: NonEmptyString;
  }
  export interface AcceptInvitationResponse {
  }
  export interface AccountDetails {
    /**
     * The ID of an Amazon Web Services account.
     */
    AccountId: AccountId;
    /**
     * The email of an Amazon Web Services account.
     */
    Email?: NonEmptyString;
  }
  export type AccountDetailsList = AccountDetails[];
  export type AccountId = string;
  export type AccountIdList = NonEmptyString[];
  export interface Action {
    /**
     * The type of action that was detected. The possible action types are:    NETWORK_CONNECTION     AWS_API_CALL     DNS_REQUEST     PORT_PROBE   
     */
    ActionType?: NonEmptyString;
    /**
     * Included if ActionType is NETWORK_CONNECTION. Provides details about the network connection that was detected.
     */
    NetworkConnectionAction?: NetworkConnectionAction;
    /**
     * Included if ActionType is AWS_API_CALL. Provides details about the API call that was detected. 
     */
    AwsApiCallAction?: AwsApiCallAction;
    /**
     * Included if ActionType is DNS_REQUEST. Provides details about the DNS request that was detected. 
     */
    DnsRequestAction?: DnsRequestAction;
    /**
     * Included if ActionType is PORT_PROBE. Provides details about the port probe that was detected. 
     */
    PortProbeAction?: PortProbeAction;
  }
  export interface ActionLocalIpDetails {
    /**
     * The IP address.
     */
    IpAddressV4?: NonEmptyString;
  }
  export interface ActionLocalPortDetails {
    /**
     * The number of the port.
     */
    Port?: Integer;
    /**
     * The port name of the local connection.
     */
    PortName?: NonEmptyString;
  }
  export interface ActionRemoteIpDetails {
    /**
     * The IP address.
     */
    IpAddressV4?: NonEmptyString;
    /**
     * The internet service provider (ISP) organization associated with the remote IP address.
     */
    Organization?: IpOrganizationDetails;
    /**
     * The country where the remote IP address is located.
     */
    Country?: Country;
    /**
     * The city where the remote IP address is located.
     */
    City?: City;
    /**
     * The coordinates of the location of the remote IP address.
     */
    GeoLocation?: GeoLocation;
  }
  export interface ActionRemotePortDetails {
    /**
     * The number of the port.
     */
    Port?: Integer;
    /**
     * The port name of the remote connection.
     */
    PortName?: NonEmptyString;
  }
  export interface ActionTarget {
    /**
     * The ARN for the target action.
     */
    ActionTargetArn: NonEmptyString;
    /**
     * The name of the action target.
     */
    Name: NonEmptyString;
    /**
     * The description of the target action.
     */
    Description: NonEmptyString;
  }
  export type ActionTargetList = ActionTarget[];
  export interface Adjustment {
    /**
     * The metric to adjust.
     */
    Metric?: NonEmptyString;
    /**
     * The reason for the adjustment.
     */
    Reason?: NonEmptyString;
  }
  export type AdjustmentList = Adjustment[];
  export interface AdminAccount {
    /**
     * The Amazon Web Services account identifier of the Security Hub administrator account.
     */
    AccountId?: NonEmptyString;
    /**
     * The current status of the Security Hub administrator account. Indicates whether the account is currently enabled as a Security Hub administrator.
     */
    Status?: AdminStatus;
  }
  export type AdminAccounts = AdminAccount[];
  export type AdminStatus = "ENABLED"|"DISABLE_IN_PROGRESS"|string;
  export type AdminsMaxResults = number;
  export type ArnList = NonEmptyString[];
  export interface AvailabilityZone {
    /**
     * The name of the Availability Zone.
     */
    ZoneName?: NonEmptyString;
    /**
     * The ID of the subnet. You can specify one subnet per Availability Zone.
     */
    SubnetId?: NonEmptyString;
  }
  export type AvailabilityZones = AvailabilityZone[];
  export interface AwsApiCallAction {
    /**
     * The name of the API method that was issued.
     */
    Api?: NonEmptyString;
    /**
     * The name of the Amazon Web Services service that the API method belongs to.
     */
    ServiceName?: NonEmptyString;
    /**
     * Indicates whether the API call originated from a remote IP address (remoteip) or from a DNS domain (domain).
     */
    CallerType?: NonEmptyString;
    /**
     * Provided if CallerType is remoteIp. Provides information about the remote IP address that the API call originated from.
     */
    RemoteIpDetails?: ActionRemoteIpDetails;
    /**
     * Provided if CallerType is domain. Provides information about the DNS domain that the API call originated from.
     */
    DomainDetails?: AwsApiCallActionDomainDetails;
    /**
     * Identifies the resources that were affected by the API call.
     */
    AffectedResources?: FieldMap;
    /**
     * An ISO8601-formatted timestamp that indicates when the API call was first observed.
     */
    FirstSeen?: NonEmptyString;
    /**
     * An ISO8601-formatted timestamp that indicates when the API call was most recently observed.
     */
    LastSeen?: NonEmptyString;
  }
  export interface AwsApiCallActionDomainDetails {
    /**
     * The name of the DNS domain that issued the API call.
     */
    Domain?: NonEmptyString;
  }
  export interface AwsApiGatewayAccessLogSettings {
    /**
     * A single-line format of the access logs of data, as specified by selected $context variables. The format must include at least $context.requestId.
     */
    Format?: NonEmptyString;
    /**
     * The ARN of the CloudWatch Logs log group that receives the access logs.
     */
    DestinationArn?: NonEmptyString;
  }
  export interface AwsApiGatewayCanarySettings {
    /**
     * The percentage of traffic that is diverted to a canary deployment.
     */
    PercentTraffic?: Double;
    /**
     * The deployment identifier for the canary deployment.
     */
    DeploymentId?: NonEmptyString;
    /**
     * Stage variables that are overridden in the canary release deployment. The variables include new stage variables that are introduced in the canary. Each variable is represented as a string-to-string map between the stage variable name and the variable value.
     */
    StageVariableOverrides?: FieldMap;
    /**
     * Indicates whether the canary deployment uses the stage cache.
     */
    UseStageCache?: Boolean;
  }
  export interface AwsApiGatewayEndpointConfiguration {
    /**
     * A list of endpoint types for the REST API. For an edge-optimized API, the endpoint type is EDGE. For a Regional API, the endpoint type is REGIONAL. For a private API, the endpoint type is PRIVATE.
     */
    Types?: NonEmptyStringList;
  }
  export interface AwsApiGatewayMethodSettings {
    /**
     * Indicates whether CloudWatch metrics are enabled for the method. 
     */
    MetricsEnabled?: Boolean;
    /**
     * The logging level for this method. The logging level affects the log entries that are pushed to CloudWatch Logs. If the logging level is ERROR, then the logs only include error-level entries. If the logging level is INFO, then the logs include both ERROR events and extra informational events. Valid values: OFF | ERROR | INFO 
     */
    LoggingLevel?: NonEmptyString;
    /**
     * Indicates whether data trace logging is enabled for the method. Data trace logging affects the log entries that are pushed to CloudWatch Logs.
     */
    DataTraceEnabled?: Boolean;
    /**
     * The throttling burst limit for the method.
     */
    ThrottlingBurstLimit?: Integer;
    /**
     * The throttling rate limit for the method.
     */
    ThrottlingRateLimit?: Double;
    /**
     * Indicates whether responses are cached and returned for requests. For responses to be cached, a cache cluster must be enabled on the stage.
     */
    CachingEnabled?: Boolean;
    /**
     * Specifies the time to live (TTL), in seconds, for cached responses. The higher the TTL, the longer the response is cached.
     */
    CacheTtlInSeconds?: Integer;
    /**
     * Indicates whether the cached responses are encrypted. 
     */
    CacheDataEncrypted?: Boolean;
    /**
     * Indicates whether authorization is required for a cache invalidation request.
     */
    RequireAuthorizationForCacheControl?: Boolean;
    /**
     * Indicates how to handle unauthorized requests for cache invalidation. Valid values: FAIL_WITH_403 | SUCCEED_WITH_RESPONSE_HEADER | SUCCEED_WITHOUT_RESPONSE_HEADER 
     */
    UnauthorizedCacheControlHeaderStrategy?: NonEmptyString;
    /**
     * The HTTP method. You can use an asterisk (*) as a wildcard to apply method settings to multiple methods.
     */
    HttpMethod?: NonEmptyString;
    /**
     * The resource path for this method. Forward slashes (/) are encoded as ~1 . The initial slash must include a forward slash. For example, the path value /resource/subresource must be encoded as /~1resource~1subresource. To specify the root path, use only a slash (/). You can use an asterisk (*) as a wildcard to apply method settings to multiple methods.
     */
    ResourcePath?: NonEmptyString;
  }
  export type AwsApiGatewayMethodSettingsList = AwsApiGatewayMethodSettings[];
  export interface AwsApiGatewayRestApiDetails {
    /**
     * The identifier of the REST API.
     */
    Id?: NonEmptyString;
    /**
     * The name of the REST API.
     */
    Name?: NonEmptyString;
    /**
     * A description of the REST API.
     */
    Description?: NonEmptyString;
    /**
     * Indicates when the API was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedDate?: NonEmptyString;
    /**
     * The version identifier for the REST API.
     */
    Version?: NonEmptyString;
    /**
     * The list of binary media types supported by the REST API.
     */
    BinaryMediaTypes?: NonEmptyStringList;
    /**
     * The minimum size in bytes of a payload before compression is enabled. If null, then compression is disabled. If 0, then all payloads are compressed.
     */
    MinimumCompressionSize?: Integer;
    /**
     * The source of the API key for metering requests according to a usage plan.  HEADER indicates whether to read the API key from the X-API-Key header of a request.  AUTHORIZER indicates whether to read the API key from the UsageIdentifierKey from a custom authorizer.
     */
    ApiKeySource?: NonEmptyString;
    /**
     * The endpoint configuration of the REST API.
     */
    EndpointConfiguration?: AwsApiGatewayEndpointConfiguration;
  }
  export interface AwsApiGatewayStageDetails {
    /**
     * The identifier of the deployment that the stage points to.
     */
    DeploymentId?: NonEmptyString;
    /**
     * The identifier of the client certificate for the stage.
     */
    ClientCertificateId?: NonEmptyString;
    /**
     * The name of the stage.
     */
    StageName?: NonEmptyString;
    /**
     * A description of the stage.
     */
    Description?: NonEmptyString;
    /**
     * Indicates whether a cache cluster is enabled for the stage.
     */
    CacheClusterEnabled?: Boolean;
    /**
     * If a cache cluster is enabled, the size of the cache cluster.
     */
    CacheClusterSize?: NonEmptyString;
    /**
     * If a cache cluster is enabled, the status of the cache cluster.
     */
    CacheClusterStatus?: NonEmptyString;
    /**
     * Defines the method settings for the stage.
     */
    MethodSettings?: AwsApiGatewayMethodSettingsList;
    /**
     * A map that defines the stage variables for the stage. Variable names can have alphanumeric and underscore characters. Variable values can contain the following characters:   Uppercase and lowercase letters   Numbers   Special characters -._~:/?#&amp;=,  
     */
    Variables?: FieldMap;
    /**
     * The version of the API documentation that is associated with the stage.
     */
    DocumentationVersion?: NonEmptyString;
    /**
     * Settings for logging access for the stage.
     */
    AccessLogSettings?: AwsApiGatewayAccessLogSettings;
    /**
     * Information about settings for canary deployment in the stage.
     */
    CanarySettings?: AwsApiGatewayCanarySettings;
    /**
     * Indicates whether active tracing with X-Ray is enabled for the stage.
     */
    TracingEnabled?: Boolean;
    /**
     * Indicates when the stage was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedDate?: NonEmptyString;
    /**
     * Indicates when the stage was most recently updated. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LastUpdatedDate?: NonEmptyString;
    /**
     * The ARN of the web ACL associated with the stage.
     */
    WebAclArn?: NonEmptyString;
  }
  export interface AwsApiGatewayV2ApiDetails {
    /**
     * The URI of the API.  Uses the format  &lt;api-id&gt;.execute-api.&lt;region&gt;.amazonaws.com  The stage name is typically appended to the URI to form a complete path to a deployed API stage.
     */
    ApiEndpoint?: NonEmptyString;
    /**
     * The identifier of the API.
     */
    ApiId?: NonEmptyString;
    /**
     * An API key selection expression. Supported only for WebSocket APIs. 
     */
    ApiKeySelectionExpression?: NonEmptyString;
    /**
     * Indicates when the API was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedDate?: NonEmptyString;
    /**
     * A description of the API.
     */
    Description?: NonEmptyString;
    /**
     * The version identifier for the API.
     */
    Version?: NonEmptyString;
    /**
     * The name of the API.
     */
    Name?: NonEmptyString;
    /**
     * The API protocol for the API. Valid values: WEBSOCKET | HTTP 
     */
    ProtocolType?: NonEmptyString;
    /**
     * The route selection expression for the API. For HTTP APIs, must be ${request.method} ${request.path}. This is the default value for HTTP APIs. For WebSocket APIs, there is no default value.
     */
    RouteSelectionExpression?: NonEmptyString;
    /**
     * A cross-origin resource sharing (CORS) configuration. Supported only for HTTP APIs.
     */
    CorsConfiguration?: AwsCorsConfiguration;
  }
  export interface AwsApiGatewayV2RouteSettings {
    /**
     * Indicates whether detailed metrics are enabled.
     */
    DetailedMetricsEnabled?: Boolean;
    /**
     * The logging level. The logging level affects the log entries that are pushed to CloudWatch Logs. Supported only for WebSocket APIs. If the logging level is ERROR, then the logs only include error-level entries. If the logging level is INFO, then the logs include both ERROR events and extra informational events. Valid values: OFF | ERROR | INFO 
     */
    LoggingLevel?: NonEmptyString;
    /**
     * Indicates whether data trace logging is enabled. Data trace logging affects the log entries that are pushed to CloudWatch Logs. Supported only for WebSocket APIs.
     */
    DataTraceEnabled?: Boolean;
    /**
     * The throttling burst limit.
     */
    ThrottlingBurstLimit?: Integer;
    /**
     * The throttling rate limit.
     */
    ThrottlingRateLimit?: Double;
  }
  export interface AwsApiGatewayV2StageDetails {
    /**
     * The identifier of a client certificate for a stage. Supported only for WebSocket API calls.
     */
    ClientCertificateId?: NonEmptyString;
    /**
     * Indicates when the stage was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedDate?: NonEmptyString;
    /**
     * The description of the stage.
     */
    Description?: NonEmptyString;
    /**
     * Default route settings for the stage.
     */
    DefaultRouteSettings?: AwsApiGatewayV2RouteSettings;
    /**
     * The identifier of the deployment that the stage is associated with. 
     */
    DeploymentId?: NonEmptyString;
    /**
     * Indicates when the stage was most recently updated. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LastUpdatedDate?: NonEmptyString;
    /**
     * The route settings for the stage.
     */
    RouteSettings?: AwsApiGatewayV2RouteSettings;
    /**
     * The name of the stage.
     */
    StageName?: NonEmptyString;
    /**
     * A map that defines the stage variables for the stage. Variable names can have alphanumeric and underscore characters. Variable values can contain the following characters:   Uppercase and lowercase letters   Numbers   Special characters -._~:/?#&amp;=,  
     */
    StageVariables?: FieldMap;
    /**
     * Information about settings for logging access for the stage.
     */
    AccessLogSettings?: AwsApiGatewayAccessLogSettings;
    /**
     * Indicates whether updates to an API automatically trigger a new deployment.
     */
    AutoDeploy?: Boolean;
    /**
     * The status of the last deployment of a stage. Supported only if the stage has automatic deployment enabled.
     */
    LastDeploymentStatusMessage?: NonEmptyString;
    /**
     * Indicates whether the stage is managed by API Gateway.
     */
    ApiGatewayManaged?: Boolean;
  }
  export interface AwsAutoScalingAutoScalingGroupDetails {
    /**
     * The name of the launch configuration.
     */
    LaunchConfigurationName?: NonEmptyString;
    /**
     * The list of load balancers associated with the group.
     */
    LoadBalancerNames?: StringList;
    /**
     * The service to use for the health checks.
     */
    HealthCheckType?: NonEmptyString;
    /**
     * The amount of time, in seconds, that Amazon EC2 Auto Scaling waits before it checks the health status of an EC2 instance that has come into service.
     */
    HealthCheckGracePeriod?: Integer;
    /**
     * Indicates when the auto scaling group was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedTime?: NonEmptyString;
  }
  export interface AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails {
    /**
     * The device name that is exposed to the EC2 instance. For example, /dev/sdh or xvdh.
     */
    DeviceName?: NonEmptyString;
    /**
     * Parameters that are used to automatically set up Amazon EBS volumes when an instance is launched.
     */
    Ebs?: AwsAutoScalingLaunchConfigurationBlockDeviceMappingsEbsDetails;
    /**
     * Whether to suppress the device that is included in the block device mapping of the Amazon Machine Image (AMI). If NoDevice is true, then you cannot specify Ebs.&gt;
     */
    NoDevice?: Boolean;
    /**
     * The name of the virtual device (for example, ephemeral0). You can provide either VirtualName or Ebs, but not both.
     */
    VirtualName?: NonEmptyString;
  }
  export interface AwsAutoScalingLaunchConfigurationBlockDeviceMappingsEbsDetails {
    /**
     * Whether to delete the volume when the instance is terminated.
     */
    DeleteOnTermination?: Boolean;
    /**
     * Whether to encrypt the volume.
     */
    Encrypted?: Boolean;
    /**
     * The number of input/output (I/O) operations per second (IOPS) to provision for the volume. Only supported for gp3 or io1 volumes. Required for io1 volumes. Not used with standard, gp2, st1, or sc1 volumes.
     */
    Iops?: Integer;
    /**
     * The snapshot ID of the volume to use. You must specify either VolumeSize or SnapshotId.
     */
    SnapshotId?: NonEmptyString;
    /**
     * The volume size, in GiBs. The following are the supported volumes sizes for each volume type:   gp2 and gp3: 1-16,384   io1: 4-16,384   st1 and sc1: 125-16,384   standard: 1-1,024   You must specify either SnapshotId or VolumeSize. If you specify both SnapshotId and VolumeSize, the volume size must be equal or greater than the size of the snapshot.
     */
    VolumeSize?: Integer;
    /**
     * The volume type.
     */
    VolumeType?: NonEmptyString;
  }
  export type AwsAutoScalingLaunchConfigurationBlockDeviceMappingsList = AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails[];
  export interface AwsAutoScalingLaunchConfigurationDetails {
    /**
     * For Auto Scaling groups that run in a VPC, specifies whether to assign a public IP address to the group's instances.
     */
    AssociatePublicIpAddress?: Boolean;
    /**
     * Specifies the block devices for the instance.
     */
    BlockDeviceMappings?: AwsAutoScalingLaunchConfigurationBlockDeviceMappingsList;
    /**
     * The identifier of a ClassicLink-enabled VPC that EC2-Classic instances are linked to.
     */
    ClassicLinkVpcId?: NonEmptyString;
    /**
     * The identifiers of one or more security groups for the VPC that is specified in ClassicLinkVPCId.
     */
    ClassicLinkVpcSecurityGroups?: NonEmptyStringList;
    /**
     * The creation date and time for the launch configuration. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedTime?: NonEmptyString;
    /**
     * Whether the launch configuration is optimized for Amazon EBS I/O.
     */
    EbsOptimized?: Boolean;
    /**
     * The name or the ARN of the instance profile associated with the IAM role for the instance. The instance profile contains the IAM role.
     */
    IamInstanceProfile?: NonEmptyString;
    /**
     * The identifier of the Amazon Machine Image (AMI) that is used to launch EC2 instances.
     */
    ImageId?: NonEmptyString;
    /**
     * Indicates the type of monitoring for instances in the group.
     */
    InstanceMonitoring?: AwsAutoScalingLaunchConfigurationInstanceMonitoringDetails;
    /**
     * The instance type for the instances.
     */
    InstanceType?: NonEmptyString;
    /**
     * The identifier of the kernel associated with the AMI.
     */
    KernelId?: NonEmptyString;
    /**
     * The name of the key pair.
     */
    KeyName?: NonEmptyString;
    /**
     * The name of the launch configuration.
     */
    LaunchConfigurationName?: NonEmptyString;
    /**
     * The tenancy of the instance. An instance with dedicated tenancy runs on isolated, single-tenant hardware and can only be launched into a VPC.
     */
    PlacementTenancy?: NonEmptyString;
    /**
     * The identifier of the RAM disk associated with the AMI.
     */
    RamdiskId?: NonEmptyString;
    /**
     * The security groups to assign to the instances in the Auto Scaling group.
     */
    SecurityGroups?: NonEmptyStringList;
    /**
     * The maximum hourly price to be paid for any Spot Instance that is launched to fulfill the request.
     */
    SpotPrice?: NonEmptyString;
    /**
     * The user data to make available to the launched EC2 instances. Must be base64-encoded text.
     */
    UserData?: NonEmptyString;
  }
  export interface AwsAutoScalingLaunchConfigurationInstanceMonitoringDetails {
    /**
     * If set to true, then instances in the group launch with detailed monitoring. If set to false, then instances in the group launch with basic monitoring.
     */
    Enabled?: Boolean;
  }
  export interface AwsCertificateManagerCertificateDetails {
    /**
     * The ARN of the private certificate authority (CA) that will be used to issue the certificate.
     */
    CertificateAuthorityArn?: NonEmptyString;
    /**
     * Indicates when the certificate was requested. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedAt?: NonEmptyString;
    /**
     * The fully qualified domain name (FQDN), such as www.example.com, that is secured by the certificate.
     */
    DomainName?: NonEmptyString;
    /**
     * Contains information about the initial validation of each domain name that occurs as a result of the RequestCertificate request. Only provided if the certificate type is AMAZON_ISSUED.
     */
    DomainValidationOptions?: AwsCertificateManagerCertificateDomainValidationOptions;
    /**
     * Contains a list of Extended Key Usage X.509 v3 extension objects. Each object specifies a purpose for which the certificate public key can be used and consists of a name and an object identifier (OID).
     */
    ExtendedKeyUsages?: AwsCertificateManagerCertificateExtendedKeyUsages;
    /**
     * For a failed certificate request, the reason for the failure. Valid values: NO_AVAILABLE_CONTACTS | ADDITIONAL_VERIFICATION_REQUIRED | DOMAIN_NOT_ALLOWED | INVALID_PUBLIC_DOMAIN | DOMAIN_VALIDATION_DENIED | CAA_ERROR | PCA_LIMIT_EXCEEDED | PCA_INVALID_ARN | PCA_INVALID_STATE | PCA_REQUEST_FAILED | PCA_NAME_CONSTRAINTS_VALIDATION | PCA_RESOURCE_NOT_FOUND | PCA_INVALID_ARGS | PCA_INVALID_DURATION | PCA_ACCESS_DENIED | SLR_NOT_FOUND | OTHER 
     */
    FailureReason?: NonEmptyString;
    /**
     * Indicates when the certificate was imported. Provided if the certificate type is IMPORTED. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    ImportedAt?: NonEmptyString;
    /**
     * The list of ARNs for the Amazon Web Services resources that use the certificate.
     */
    InUseBy?: StringList;
    /**
     * Indicates when the certificate was issued. Provided if the certificate type is AMAZON_ISSUED. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    IssuedAt?: NonEmptyString;
    /**
     * The name of the certificate authority that issued and signed the certificate.
     */
    Issuer?: NonEmptyString;
    /**
     * The algorithm that was used to generate the public-private key pair. Valid values: RSA_2048 | RSA_1024 | RSA_4096 | EC_prime256v1 | EC_secp384r1 | EC_secp521r1 
     */
    KeyAlgorithm?: NonEmptyString;
    /**
     * A list of key usage X.509 v3 extension objects.
     */
    KeyUsages?: AwsCertificateManagerCertificateKeyUsages;
    /**
     * The time after which the certificate becomes invalid. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    NotAfter?: NonEmptyString;
    /**
     * The time before which the certificate is not valid. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    NotBefore?: NonEmptyString;
    /**
     * Provides a value that specifies whether to add the certificate to a transparency log.
     */
    Options?: AwsCertificateManagerCertificateOptions;
    /**
     * Whether the certificate is eligible for renewal. Valid values: ELIGIBLE | INELIGIBLE 
     */
    RenewalEligibility?: NonEmptyString;
    /**
     * Information about the status of the Certificate Manager managed renewal for the certificate. Provided only when the certificate type is AMAZON_ISSUED.
     */
    RenewalSummary?: AwsCertificateManagerCertificateRenewalSummary;
    /**
     * The serial number of the certificate.
     */
    Serial?: NonEmptyString;
    /**
     * The algorithm that was used to sign the certificate.
     */
    SignatureAlgorithm?: NonEmptyString;
    /**
     * The status of the certificate. Valid values: PENDING_VALIDATION | ISSUED | INACTIVE | EXPIRED | VALIDATION_TIMED_OUT | REVOKED | FAILED 
     */
    Status?: NonEmptyString;
    /**
     * The name of the entity that is associated with the public key contained in the certificate.
     */
    Subject?: NonEmptyString;
    /**
     * One or more domain names (subject alternative names) included in the certificate. This list contains the domain names that are bound to the public key that is contained in the certificate. The subject alternative names include the canonical domain name (CN) of the certificate and additional domain names that can be used to connect to the website.
     */
    SubjectAlternativeNames?: StringList;
    /**
     * The source of the certificate. For certificates that Certificate Manager provides, Type is AMAZON_ISSUED. For certificates that are imported with ImportCertificate, Type is IMPORTED. Valid values: IMPORTED | AMAZON_ISSUED | PRIVATE 
     */
    Type?: NonEmptyString;
  }
  export interface AwsCertificateManagerCertificateDomainValidationOption {
    /**
     * A fully qualified domain name (FQDN) in the certificate.
     */
    DomainName?: NonEmptyString;
    /**
     * The CNAME record that is added to the DNS database for domain validation.
     */
    ResourceRecord?: AwsCertificateManagerCertificateResourceRecord;
    /**
     * The domain name that Certificate Manager uses to send domain validation emails.
     */
    ValidationDomain?: NonEmptyString;
    /**
     * A list of email addresses that Certificate Manager uses to send domain validation emails.
     */
    ValidationEmails?: StringList;
    /**
     * The method used to validate the domain name.
     */
    ValidationMethod?: NonEmptyString;
    /**
     * The validation status of the domain name.
     */
    ValidationStatus?: NonEmptyString;
  }
  export type AwsCertificateManagerCertificateDomainValidationOptions = AwsCertificateManagerCertificateDomainValidationOption[];
  export interface AwsCertificateManagerCertificateExtendedKeyUsage {
    /**
     * The name of an extension value. Indicates the purpose for which the certificate public key can be used.
     */
    Name?: NonEmptyString;
    /**
     * An object identifier (OID) for the extension value. The format is numbers separated by periods.
     */
    OId?: NonEmptyString;
  }
  export type AwsCertificateManagerCertificateExtendedKeyUsages = AwsCertificateManagerCertificateExtendedKeyUsage[];
  export interface AwsCertificateManagerCertificateKeyUsage {
    /**
     * The key usage extension name.
     */
    Name?: NonEmptyString;
  }
  export type AwsCertificateManagerCertificateKeyUsages = AwsCertificateManagerCertificateKeyUsage[];
  export interface AwsCertificateManagerCertificateOptions {
    /**
     * Whether to add the certificate to a transparency log. Valid values: DISABLED | ENABLED 
     */
    CertificateTransparencyLoggingPreference?: NonEmptyString;
  }
  export interface AwsCertificateManagerCertificateRenewalSummary {
    /**
     * Information about the validation of each domain name in the certificate, as it pertains to Certificate Manager managed renewal. Provided only when the certificate type is AMAZON_ISSUED.
     */
    DomainValidationOptions?: AwsCertificateManagerCertificateDomainValidationOptions;
    /**
     * The status of the Certificate Manager managed renewal of the certificate. Valid values: PENDING_AUTO_RENEWAL | PENDING_VALIDATION | SUCCESS | FAILED 
     */
    RenewalStatus?: NonEmptyString;
    /**
     * The reason that a renewal request was unsuccessful. Valid values: NO_AVAILABLE_CONTACTS | ADDITIONAL_VERIFICATION_REQUIRED | DOMAIN_NOT_ALLOWED | INVALID_PUBLIC_DOMAIN | DOMAIN_VALIDATION_DENIED | CAA_ERROR | PCA_LIMIT_EXCEEDED | PCA_INVALID_ARN | PCA_INVALID_STATE | PCA_REQUEST_FAILED | PCA_NAME_CONSTRAINTS_VALIDATION | PCA_RESOURCE_NOT_FOUND | PCA_INVALID_ARGS | PCA_INVALID_DURATION | PCA_ACCESS_DENIED | SLR_NOT_FOUND | OTHER 
     */
    RenewalStatusReason?: NonEmptyString;
    /**
     * Indicates when the renewal summary was last updated. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    UpdatedAt?: NonEmptyString;
  }
  export interface AwsCertificateManagerCertificateResourceRecord {
    /**
     * The name of the resource.
     */
    Name?: NonEmptyString;
    /**
     * The type of resource.
     */
    Type?: NonEmptyString;
    /**
     * The value of the resource.
     */
    Value?: NonEmptyString;
  }
  export interface AwsCloudFrontDistributionCacheBehavior {
    /**
     * The protocol that viewers can use to access the files in an origin. You can specify the following options:    allow-all - Viewers can use HTTP or HTTPS.    redirect-to-https - CloudFront responds to HTTP requests with an HTTP status code of 301 (Moved Permanently) and the HTTPS URL. The viewer then uses the new URL to resubmit.    https-only - CloudFront responds to HTTP request with an HTTP status code of 403 (Forbidden).  
     */
    ViewerProtocolPolicy?: NonEmptyString;
  }
  export interface AwsCloudFrontDistributionCacheBehaviors {
    /**
     * The cache behaviors for the distribution.
     */
    Items?: AwsCloudFrontDistributionCacheBehaviorsItemList;
  }
  export type AwsCloudFrontDistributionCacheBehaviorsItemList = AwsCloudFrontDistributionCacheBehavior[];
  export interface AwsCloudFrontDistributionDefaultCacheBehavior {
    /**
     * The protocol that viewers can use to access the files in an origin. You can specify the following options:    allow-all - Viewers can use HTTP or HTTPS.    redirect-to-https - CloudFront responds to HTTP requests with an HTTP status code of 301 (Moved Permanently) and the HTTPS URL. The viewer then uses the new URL to resubmit.    https-only - CloudFront responds to HTTP request with an HTTP status code of 403 (Forbidden).  
     */
    ViewerProtocolPolicy?: NonEmptyString;
  }
  export interface AwsCloudFrontDistributionDetails {
    /**
     * Provides information about the cache configuration for the distribution.
     */
    CacheBehaviors?: AwsCloudFrontDistributionCacheBehaviors;
    /**
     * The default cache behavior for the configuration.
     */
    DefaultCacheBehavior?: AwsCloudFrontDistributionDefaultCacheBehavior;
    /**
     * The object that CloudFront sends in response to requests from the origin (for example, index.html) when a viewer requests the root URL for the distribution (http://www.example.com) instead of an object in your distribution (http://www.example.com/product-description.html). 
     */
    DefaultRootObject?: NonEmptyString;
    /**
     * The domain name corresponding to the distribution.
     */
    DomainName?: NonEmptyString;
    /**
     * The entity tag is a hash of the object.
     */
    ETag?: NonEmptyString;
    /**
     * Indicates when that the distribution was last modified. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LastModifiedTime?: NonEmptyString;
    /**
     * A complex type that controls whether access logs are written for the distribution.
     */
    Logging?: AwsCloudFrontDistributionLogging;
    /**
     * A complex type that contains information about origins for this distribution.
     */
    Origins?: AwsCloudFrontDistributionOrigins;
    /**
     * Provides information about the origin groups in the distribution.
     */
    OriginGroups?: AwsCloudFrontDistributionOriginGroups;
    /**
     * Provides information about the TLS/SSL configuration that the distribution uses to communicate with viewers.
     */
    ViewerCertificate?: AwsCloudFrontDistributionViewerCertificate;
    /**
     * Indicates the current status of the distribution.
     */
    Status?: NonEmptyString;
    /**
     * A unique identifier that specifies the WAF web ACL, if any, to associate with this distribution.
     */
    WebAclId?: NonEmptyString;
  }
  export interface AwsCloudFrontDistributionLogging {
    /**
     * The S3 bucket to store the access logs in.
     */
    Bucket?: NonEmptyString;
    /**
     * With this field, you can enable or disable the selected distribution.
     */
    Enabled?: Boolean;
    /**
     * Specifies whether you want CloudFront to include cookies in access logs.
     */
    IncludeCookies?: Boolean;
    /**
     * An optional string that you want CloudFront to use as a prefix to the access log filenames for this distribution.
     */
    Prefix?: NonEmptyString;
  }
  export interface AwsCloudFrontDistributionOriginGroup {
    /**
     * Provides the criteria for an origin group to fail over.
     */
    FailoverCriteria?: AwsCloudFrontDistributionOriginGroupFailover;
  }
  export interface AwsCloudFrontDistributionOriginGroupFailover {
    /**
     * Information about the status codes that cause an origin group to fail over.
     */
    StatusCodes?: AwsCloudFrontDistributionOriginGroupFailoverStatusCodes;
  }
  export interface AwsCloudFrontDistributionOriginGroupFailoverStatusCodes {
    /**
     * The list of status code values that can cause a failover to the next origin.
     */
    Items?: AwsCloudFrontDistributionOriginGroupFailoverStatusCodesItemList;
    /**
     * The number of status codes that can cause a failover.
     */
    Quantity?: Integer;
  }
  export type AwsCloudFrontDistributionOriginGroupFailoverStatusCodesItemList = Integer[];
  export interface AwsCloudFrontDistributionOriginGroups {
    /**
     * The list of origin groups.
     */
    Items?: AwsCloudFrontDistributionOriginGroupsItemList;
  }
  export type AwsCloudFrontDistributionOriginGroupsItemList = AwsCloudFrontDistributionOriginGroup[];
  export interface AwsCloudFrontDistributionOriginItem {
    /**
     * Amazon S3 origins: The DNS name of the S3 bucket from which you want CloudFront to get objects for this origin.
     */
    DomainName?: NonEmptyString;
    /**
     * A unique identifier for the origin or origin group.
     */
    Id?: NonEmptyString;
    /**
     * An optional element that causes CloudFront to request your content from a directory in your Amazon S3 bucket or your custom origin.
     */
    OriginPath?: NonEmptyString;
    /**
     * An origin that is an S3 bucket that is not configured with static website hosting.
     */
    S3OriginConfig?: AwsCloudFrontDistributionOriginS3OriginConfig;
  }
  export type AwsCloudFrontDistributionOriginItemList = AwsCloudFrontDistributionOriginItem[];
  export interface AwsCloudFrontDistributionOriginS3OriginConfig {
    /**
     * The CloudFront origin access identity to associate with the origin.
     */
    OriginAccessIdentity?: NonEmptyString;
  }
  export interface AwsCloudFrontDistributionOrigins {
    /**
     * A complex type that contains origins or origin groups for this distribution.
     */
    Items?: AwsCloudFrontDistributionOriginItemList;
  }
  export interface AwsCloudFrontDistributionViewerCertificate {
    /**
     * The ARN of the ACM certificate. Used if the certificate is stored in ACM. If you provide an ACM certificate ARN, you must also provide MinimumCertificateVersion and SslSupportMethod.
     */
    AcmCertificateArn?: NonEmptyString;
    /**
     * The identifier of the certificate. Note that in CloudFront, this attribute is deprecated.
     */
    Certificate?: NonEmptyString;
    /**
     * The source of the certificate identified by Certificate. Note that in CloudFront, this attribute is deprecated.
     */
    CertificateSource?: NonEmptyString;
    /**
     * Whether the distribution uses the CloudFront domain name. If set to false, then you provide either AcmCertificateArn or IamCertificateId.
     */
    CloudFrontDefaultCertificate?: Boolean;
    /**
     * The identifier of the IAM certificate. Used if the certificate is stored in IAM. If you provide IamCertificateId, then you also must provide MinimumProtocolVersion and SslSupportMethod.
     */
    IamCertificateId?: NonEmptyString;
    /**
     * The security policy that CloudFront uses for HTTPS connections with viewers. If SslSupportMethod is sni-only, then MinimumProtocolVersion must be TLSv1 or higher.
     */
    MinimumProtocolVersion?: NonEmptyString;
    /**
     * The viewers that the distribution accepts HTTPS connections from.
     */
    SslSupportMethod?: NonEmptyString;
  }
  export interface AwsCloudTrailTrailDetails {
    /**
     * The ARN of the log group that CloudTrail logs are delivered to.
     */
    CloudWatchLogsLogGroupArn?: NonEmptyString;
    /**
     * The ARN of the role that the CloudWatch Events endpoint assumes when it writes to the log group.
     */
    CloudWatchLogsRoleArn?: NonEmptyString;
    /**
     * Indicates whether the trail has custom event selectors.
     */
    HasCustomEventSelectors?: Boolean;
    /**
     * The Region where the trail was created.
     */
    HomeRegion?: NonEmptyString;
    /**
     * Indicates whether the trail publishes events from global services such as IAM to the log files.
     */
    IncludeGlobalServiceEvents?: Boolean;
    /**
     * Indicates whether the trail applies only to the current Region or to all Regions.
     */
    IsMultiRegionTrail?: Boolean;
    /**
     * Whether the trail is created for all accounts in an organization in Organizations, or only for the current Amazon Web Services account.
     */
    IsOrganizationTrail?: Boolean;
    /**
     * The KMS key ID to use to encrypt the logs.
     */
    KmsKeyId?: NonEmptyString;
    /**
     * Indicates whether CloudTrail log file validation is enabled.
     */
    LogFileValidationEnabled?: Boolean;
    /**
     * The name of the trail.
     */
    Name?: NonEmptyString;
    /**
     * The name of the S3 bucket where the log files are published.
     */
    S3BucketName?: NonEmptyString;
    /**
     * The S3 key prefix. The key prefix is added after the name of the S3 bucket where the log files are published.
     */
    S3KeyPrefix?: NonEmptyString;
    /**
     * The ARN of the SNS topic that is used for notifications of log file delivery.
     */
    SnsTopicArn?: NonEmptyString;
    /**
     * The name of the SNS topic that is used for notifications of log file delivery.
     */
    SnsTopicName?: NonEmptyString;
    /**
     * The ARN of the trail.
     */
    TrailArn?: NonEmptyString;
  }
  export interface AwsCodeBuildProjectArtifactsDetails {
    /**
     * An identifier for the artifact definition.
     */
    ArtifactIdentifier?: NonEmptyString;
    /**
     * Indicates whether to disable encryption on the artifact. Only valid when Type is S3.
     */
    EncryptionDisabled?: Boolean;
    /**
     * Only used when Type is S3. The name of the S3 bucket where the artifact is located.
     */
    Location?: NonEmptyString;
    /**
     * Only used when Type is S3. The name of the artifact. Used with NamepaceType and Path to determine the pattern for storing the artifact.
     */
    Name?: NonEmptyString;
    /**
     * Only used when Type is S3. The value to use for the namespace. Used with Name and Path to determine the pattern for storing the artifact.
     */
    NamespaceType?: NonEmptyString;
    /**
     * Whether the name specified in the buildspec file overrides the artifact name.
     */
    OverrideArtifactName?: Boolean;
    /**
     * Only used when Type is S3. The type of output artifact to create.
     */
    Packaging?: NonEmptyString;
    /**
     * Only used when Type is S3. The path to the artifact. Used with Name and NamespaceType to determine the pattern for storing the artifact.
     */
    Path?: NonEmptyString;
    /**
     * The type of build artifact.
     */
    Type?: NonEmptyString;
  }
  export type AwsCodeBuildProjectArtifactsList = AwsCodeBuildProjectArtifactsDetails[];
  export interface AwsCodeBuildProjectDetails {
    /**
     * The KMS key used to encrypt the build output artifacts. You can specify either the ARN of the KMS key or, if available, the KMS key alias (using the format alias/alias-name). 
     */
    EncryptionKey?: NonEmptyString;
    /**
     * Information about the build artifacts for the CodeBuild project.
     */
    Artifacts?: AwsCodeBuildProjectArtifactsList;
    /**
     * Information about the build environment for this build project.
     */
    Environment?: AwsCodeBuildProjectEnvironment;
    /**
     * The name of the build project.
     */
    Name?: NonEmptyString;
    /**
     * Information about the build input source code for this build project.
     */
    Source?: AwsCodeBuildProjectSource;
    /**
     * The ARN of the IAM role that enables CodeBuild to interact with dependent Amazon Web Services services on behalf of the Amazon Web Services account.
     */
    ServiceRole?: NonEmptyString;
    /**
     * Information about logs for the build project.
     */
    LogsConfig?: AwsCodeBuildProjectLogsConfigDetails;
    /**
     * Information about the VPC configuration that CodeBuild accesses.
     */
    VpcConfig?: AwsCodeBuildProjectVpcConfig;
  }
  export interface AwsCodeBuildProjectEnvironment {
    /**
     * The certificate to use with this build project.
     */
    Certificate?: NonEmptyString;
    /**
     * A set of environment variables to make available to builds for the build project.
     */
    EnvironmentVariables?: AwsCodeBuildProjectEnvironmentEnvironmentVariablesList;
    /**
     * Whether to allow the Docker daemon to run inside a Docker container. Set to true if the build project is used to build Docker images.
     */
    PrivilegedMode?: Boolean;
    /**
     * The type of credentials CodeBuild uses to pull images in your build. Valid values:    CODEBUILD specifies that CodeBuild uses its own credentials. This requires that you modify your ECR repository policy to trust the CodeBuild service principal.    SERVICE_ROLE specifies that CodeBuild uses your build project's service role.   When you use a cross-account or private registry image, you must use SERVICE_ROLE credentials. When you use an CodeBuild curated image, you must use CODEBUILD credentials.
     */
    ImagePullCredentialsType?: NonEmptyString;
    /**
     * The credentials for access to a private registry.
     */
    RegistryCredential?: AwsCodeBuildProjectEnvironmentRegistryCredential;
    /**
     * The type of build environment to use for related builds. The environment type ARM_CONTAINER is available only in Regions US East (N. Virginia), US East (Ohio), US West (Oregon), Europe (Ireland), Asia Pacific (Mumbai), Asia Pacific (Tokyo), Asia Pacific (Sydney), and Europe (Frankfurt). The environment type LINUX_CONTAINER with compute type build.general1.2xlarge is available only in Regions US East (N. Virginia), US East (N. Virginia), US West (Oregon), Canada (Central), Europe (Ireland), Europe (London), Europe (Frankfurt), Asia Pacific (Tokyo), Asia Pacific (Seoul), Asia Pacific (Singapore), Asia Pacific (Sydney), China (Beijing), and China (Ningxia). The environment type LINUX_GPU_CONTAINER is available only in Regions US East (N. Virginia), US East (N. Virginia), US West (Oregon), Canada (Central), Europe (Ireland), Europe (London), Europe (Frankfurt), Asia Pacific (Tokyo), Asia Pacific (Seoul), Asia Pacific (Singapore), Asia Pacific (Sydney), China (Beijing), and China (Ningxia). Valid values: WINDOWS_CONTAINER | LINUX_CONTAINER | LINUX_GPU_CONTAINER | ARM_CONTAINER 
     */
    Type?: NonEmptyString;
  }
  export interface AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails {
    /**
     * The name of the environment variable.
     */
    Name?: NonEmptyString;
    /**
     * The type of environment variable.
     */
    Type?: NonEmptyString;
    /**
     * The value of the environment variable.
     */
    Value?: NonEmptyString;
  }
  export type AwsCodeBuildProjectEnvironmentEnvironmentVariablesList = AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails[];
  export interface AwsCodeBuildProjectEnvironmentRegistryCredential {
    /**
     * The ARN or name of credentials created using Secrets Manager.  The credential can use the name of the credentials only if they exist in your current Amazon Web Services Region.  
     */
    Credential?: NonEmptyString;
    /**
     * The service that created the credentials to access a private Docker registry. The valid value, SECRETS_MANAGER, is for Secrets Manager.
     */
    CredentialProvider?: NonEmptyString;
  }
  export interface AwsCodeBuildProjectLogsConfigCloudWatchLogsDetails {
    /**
     * The group name of the logs in CloudWatch Logs.
     */
    GroupName?: NonEmptyString;
    /**
     * The current status of the logs in CloudWatch Logs for a build project.
     */
    Status?: NonEmptyString;
    /**
     * The prefix of the stream name of the CloudWatch Logs.
     */
    StreamName?: NonEmptyString;
  }
  export interface AwsCodeBuildProjectLogsConfigDetails {
    /**
     * Information about CloudWatch Logs for the build project.
     */
    CloudWatchLogs?: AwsCodeBuildProjectLogsConfigCloudWatchLogsDetails;
    /**
     * Information about logs built to an S3 bucket for a build project.
     */
    S3Logs?: AwsCodeBuildProjectLogsConfigS3LogsDetails;
  }
  export interface AwsCodeBuildProjectLogsConfigS3LogsDetails {
    /**
     * Whether to disable encryption of the S3 build log output.
     */
    EncryptionDisabled?: Boolean;
    /**
     * The ARN of the S3 bucket and the path prefix for S3 logs.
     */
    Location?: NonEmptyString;
    /**
     * The current status of the S3 build logs.
     */
    Status?: NonEmptyString;
  }
  export interface AwsCodeBuildProjectSource {
    /**
     * The type of repository that contains the source code to be built. Valid values are:    BITBUCKET - The source code is in a Bitbucket repository.    CODECOMMIT - The source code is in an CodeCommit repository.    CODEPIPELINE - The source code settings are specified in the source action of a pipeline in CodePipeline.    GITHUB - The source code is in a GitHub repository.    GITHUB_ENTERPRISE - The source code is in a GitHub Enterprise repository.    NO_SOURCE - The project does not have input source code.    S3 - The source code is in an S3 input bucket.   
     */
    Type?: NonEmptyString;
    /**
     * Information about the location of the source code to be built. Valid values include:   For source code settings that are specified in the source action of a pipeline in CodePipeline, location should not be specified. If it is specified, CodePipeline ignores it. This is because CodePipeline uses the settings in a pipeline's source action instead of this value.   For source code in an CodeCommit repository, the HTTPS clone URL to the repository that contains the source code and the build spec file (for example, https://git-codecommit.region-ID.amazonaws.com/v1/repos/repo-name ).   For source code in an S3 input bucket, one of the following.   The path to the ZIP file that contains the source code (for example, bucket-name/path/to/object-name.zip).    The path to the folder that contains the source code (for example, bucket-name/path/to/source-code/folder/).     For source code in a GitHub repository, the HTTPS clone URL to the repository that contains the source and the build spec file.   For source code in a Bitbucket repository, the HTTPS clone URL to the repository that contains the source and the build spec file.   
     */
    Location?: NonEmptyString;
    /**
     * Information about the Git clone depth for the build project.
     */
    GitCloneDepth?: Integer;
    /**
     * Whether to ignore SSL warnings while connecting to the project source code.
     */
    InsecureSsl?: Boolean;
  }
  export interface AwsCodeBuildProjectVpcConfig {
    /**
     * The ID of the VPC.
     */
    VpcId?: NonEmptyString;
    /**
     * A list of one or more subnet IDs in your VPC.
     */
    Subnets?: NonEmptyStringList;
    /**
     * A list of one or more security group IDs in your VPC.
     */
    SecurityGroupIds?: NonEmptyStringList;
  }
  export interface AwsCorsConfiguration {
    /**
     * The allowed origins for CORS requests.
     */
    AllowOrigins?: NonEmptyStringList;
    /**
     * Indicates whether the CORS request includes credentials.
     */
    AllowCredentials?: Boolean;
    /**
     * The exposed headers for CORS requests.
     */
    ExposeHeaders?: NonEmptyStringList;
    /**
     * The number of seconds for which the browser caches preflight request results.
     */
    MaxAge?: Integer;
    /**
     * The allowed methods for CORS requests.
     */
    AllowMethods?: NonEmptyStringList;
    /**
     * The allowed headers for CORS requests.
     */
    AllowHeaders?: NonEmptyStringList;
  }
  export interface AwsDynamoDbTableAttributeDefinition {
    /**
     * The name of the attribute.
     */
    AttributeName?: NonEmptyString;
    /**
     * The type of the attribute.
     */
    AttributeType?: NonEmptyString;
  }
  export type AwsDynamoDbTableAttributeDefinitionList = AwsDynamoDbTableAttributeDefinition[];
  export interface AwsDynamoDbTableBillingModeSummary {
    /**
     * The method used to charge for read and write throughput and to manage capacity.
     */
    BillingMode?: NonEmptyString;
    /**
     * If the billing mode is PAY_PER_REQUEST, indicates when the billing mode was set to that value. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LastUpdateToPayPerRequestDateTime?: NonEmptyString;
  }
  export interface AwsDynamoDbTableDetails {
    /**
     * A list of attribute definitions for the table.
     */
    AttributeDefinitions?: AwsDynamoDbTableAttributeDefinitionList;
    /**
     * Information about the billing for read/write capacity on the table.
     */
    BillingModeSummary?: AwsDynamoDbTableBillingModeSummary;
    /**
     * Indicates when the table was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreationDateTime?: NonEmptyString;
    /**
     * List of global secondary indexes for the table.
     */
    GlobalSecondaryIndexes?: AwsDynamoDbTableGlobalSecondaryIndexList;
    /**
     * The version of global tables being used.
     */
    GlobalTableVersion?: NonEmptyString;
    /**
     * The number of items in the table.
     */
    ItemCount?: Integer;
    /**
     * The primary key structure for the table.
     */
    KeySchema?: AwsDynamoDbTableKeySchemaList;
    /**
     * The ARN of the latest stream for the table.
     */
    LatestStreamArn?: NonEmptyString;
    /**
     * The label of the latest stream. The label is not a unique identifier.
     */
    LatestStreamLabel?: NonEmptyString;
    /**
     * The list of local secondary indexes for the table.
     */
    LocalSecondaryIndexes?: AwsDynamoDbTableLocalSecondaryIndexList;
    /**
     * Information about the provisioned throughput for the table.
     */
    ProvisionedThroughput?: AwsDynamoDbTableProvisionedThroughput;
    /**
     * The list of replicas of this table.
     */
    Replicas?: AwsDynamoDbTableReplicaList;
    /**
     * Information about the restore for the table.
     */
    RestoreSummary?: AwsDynamoDbTableRestoreSummary;
    /**
     * Information about the server-side encryption for the table.
     */
    SseDescription?: AwsDynamoDbTableSseDescription;
    /**
     * The current DynamoDB Streams configuration for the table.
     */
    StreamSpecification?: AwsDynamoDbTableStreamSpecification;
    /**
     * The identifier of the table.
     */
    TableId?: NonEmptyString;
    /**
     * The name of the table.
     */
    TableName?: NonEmptyString;
    /**
     * The total size of the table in bytes.
     */
    TableSizeBytes?: SizeBytes;
    /**
     * The current status of the table.
     */
    TableStatus?: NonEmptyString;
  }
  export interface AwsDynamoDbTableGlobalSecondaryIndex {
    /**
     * Whether the index is currently backfilling.
     */
    Backfilling?: Boolean;
    /**
     * The ARN of the index.
     */
    IndexArn?: NonEmptyString;
    /**
     * The name of the index.
     */
    IndexName?: NonEmptyString;
    /**
     * The total size in bytes of the index.
     */
    IndexSizeBytes?: SizeBytes;
    /**
     * The current status of the index.
     */
    IndexStatus?: NonEmptyString;
    /**
     * The number of items in the index.
     */
    ItemCount?: Integer;
    /**
     * The key schema for the index.
     */
    KeySchema?: AwsDynamoDbTableKeySchemaList;
    /**
     * Attributes that are copied from the table into an index.
     */
    Projection?: AwsDynamoDbTableProjection;
    /**
     * Information about the provisioned throughput settings for the indexes.
     */
    ProvisionedThroughput?: AwsDynamoDbTableProvisionedThroughput;
  }
  export type AwsDynamoDbTableGlobalSecondaryIndexList = AwsDynamoDbTableGlobalSecondaryIndex[];
  export interface AwsDynamoDbTableKeySchema {
    /**
     * The name of the key schema attribute.
     */
    AttributeName?: NonEmptyString;
    /**
     * The type of key used for the key schema attribute.
     */
    KeyType?: NonEmptyString;
  }
  export type AwsDynamoDbTableKeySchemaList = AwsDynamoDbTableKeySchema[];
  export interface AwsDynamoDbTableLocalSecondaryIndex {
    /**
     * The ARN of the index.
     */
    IndexArn?: NonEmptyString;
    /**
     * The name of the index.
     */
    IndexName?: NonEmptyString;
    /**
     * The complete key schema for the index.
     */
    KeySchema?: AwsDynamoDbTableKeySchemaList;
    /**
     * Attributes that are copied from the table into the index. These are in addition to the primary key attributes and index key attributes, which are automatically projected.
     */
    Projection?: AwsDynamoDbTableProjection;
  }
  export type AwsDynamoDbTableLocalSecondaryIndexList = AwsDynamoDbTableLocalSecondaryIndex[];
  export interface AwsDynamoDbTableProjection {
    /**
     * The nonkey attributes that are projected into the index. For each attribute, provide the attribute name.
     */
    NonKeyAttributes?: StringList;
    /**
     * The types of attributes that are projected into the index.
     */
    ProjectionType?: NonEmptyString;
  }
  export interface AwsDynamoDbTableProvisionedThroughput {
    /**
     * Indicates when the provisioned throughput was last decreased. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LastDecreaseDateTime?: NonEmptyString;
    /**
     * Indicates when the provisioned throughput was last increased. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LastIncreaseDateTime?: NonEmptyString;
    /**
     * The number of times during the current UTC calendar day that the provisioned throughput was decreased.
     */
    NumberOfDecreasesToday?: Integer;
    /**
     * The maximum number of strongly consistent reads consumed per second before DynamoDB returns a ThrottlingException.
     */
    ReadCapacityUnits?: Integer;
    /**
     * The maximum number of writes consumed per second before DynamoDB returns a ThrottlingException.
     */
    WriteCapacityUnits?: Integer;
  }
  export interface AwsDynamoDbTableProvisionedThroughputOverride {
    /**
     * The read capacity units for the replica.
     */
    ReadCapacityUnits?: Integer;
  }
  export interface AwsDynamoDbTableReplica {
    /**
     * List of global secondary indexes for the replica.
     */
    GlobalSecondaryIndexes?: AwsDynamoDbTableReplicaGlobalSecondaryIndexList;
    /**
     * The identifier of the KMS key that will be used for KMS encryption for the replica.
     */
    KmsMasterKeyId?: NonEmptyString;
    /**
     * Replica-specific configuration for the provisioned throughput.
     */
    ProvisionedThroughputOverride?: AwsDynamoDbTableProvisionedThroughputOverride;
    /**
     * The name of the Region where the replica is located.
     */
    RegionName?: NonEmptyString;
    /**
     * The current status of the replica.
     */
    ReplicaStatus?: NonEmptyString;
    /**
     * Detailed information about the replica status.
     */
    ReplicaStatusDescription?: NonEmptyString;
  }
  export interface AwsDynamoDbTableReplicaGlobalSecondaryIndex {
    /**
     * The name of the index.
     */
    IndexName?: NonEmptyString;
    /**
     * Replica-specific configuration for the provisioned throughput for the index.
     */
    ProvisionedThroughputOverride?: AwsDynamoDbTableProvisionedThroughputOverride;
  }
  export type AwsDynamoDbTableReplicaGlobalSecondaryIndexList = AwsDynamoDbTableReplicaGlobalSecondaryIndex[];
  export type AwsDynamoDbTableReplicaList = AwsDynamoDbTableReplica[];
  export interface AwsDynamoDbTableRestoreSummary {
    /**
     * The ARN of the source backup from which the table was restored.
     */
    SourceBackupArn?: NonEmptyString;
    /**
     * The ARN of the source table for the backup.
     */
    SourceTableArn?: NonEmptyString;
    /**
     * Indicates the point in time that the table was restored to. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    RestoreDateTime?: NonEmptyString;
    /**
     * Whether a restore is currently in progress.
     */
    RestoreInProgress?: Boolean;
  }
  export interface AwsDynamoDbTableSseDescription {
    /**
     * If the key is inaccessible, the date and time when DynamoDB detected that the key was inaccessible. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    InaccessibleEncryptionDateTime?: NonEmptyString;
    /**
     * The status of the server-side encryption.
     */
    Status?: NonEmptyString;
    /**
     * The type of server-side encryption.
     */
    SseType?: NonEmptyString;
    /**
     * The ARN of the KMS key that is used for the KMS encryption.
     */
    KmsMasterKeyArn?: NonEmptyString;
  }
  export interface AwsDynamoDbTableStreamSpecification {
    /**
     * Indicates whether DynamoDB Streams is enabled on the table.
     */
    StreamEnabled?: Boolean;
    /**
     * Determines the information that is written to the table.
     */
    StreamViewType?: NonEmptyString;
  }
  export interface AwsEc2EipDetails {
    /**
     * The identifier of the EC2 instance.
     */
    InstanceId?: NonEmptyString;
    /**
     * A public IP address that is associated with the EC2 instance.
     */
    PublicIp?: NonEmptyString;
    /**
     * The identifier that Amazon Web Services assigns to represent the allocation of the Elastic IP address for use with Amazon VPC.
     */
    AllocationId?: NonEmptyString;
    /**
     * The identifier that represents the association of the Elastic IP address with an EC2 instance.
     */
    AssociationId?: NonEmptyString;
    /**
     * The domain in which to allocate the address. If the address is for use with EC2 instances in a VPC, then Domain is vpc. Otherwise, Domain is standard. 
     */
    Domain?: NonEmptyString;
    /**
     * The identifier of an IP address pool. This parameter allows Amazon EC2 to select an IP address from the address pool.
     */
    PublicIpv4Pool?: NonEmptyString;
    /**
     * The name of the location from which the Elastic IP address is advertised.
     */
    NetworkBorderGroup?: NonEmptyString;
    /**
     * The identifier of the network interface.
     */
    NetworkInterfaceId?: NonEmptyString;
    /**
     * The Amazon Web Services account ID of the owner of the network interface.
     */
    NetworkInterfaceOwnerId?: NonEmptyString;
    /**
     * The private IP address that is associated with the Elastic IP address.
     */
    PrivateIpAddress?: NonEmptyString;
  }
  export interface AwsEc2InstanceDetails {
    /**
     * The instance type of the instance. 
     */
    Type?: NonEmptyString;
    /**
     * The Amazon Machine Image (AMI) ID of the instance.
     */
    ImageId?: NonEmptyString;
    /**
     * The IPv4 addresses associated with the instance.
     */
    IpV4Addresses?: StringList;
    /**
     * The IPv6 addresses associated with the instance.
     */
    IpV6Addresses?: StringList;
    /**
     * The key name associated with the instance.
     */
    KeyName?: NonEmptyString;
    /**
     * The IAM profile ARN of the instance.
     */
    IamInstanceProfileArn?: NonEmptyString;
    /**
     * The identifier of the VPC that the instance was launched in.
     */
    VpcId?: NonEmptyString;
    /**
     * The identifier of the subnet that the instance was launched in.
     */
    SubnetId?: NonEmptyString;
    /**
     * Indicates when the instance was launched. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LaunchedAt?: NonEmptyString;
    /**
     * The identifiers of the network interfaces for the EC2 instance. The details for each network interface are in a corresponding AwsEc2NetworkInterfacesDetails object.
     */
    NetworkInterfaces?: AwsEc2InstanceNetworkInterfacesList;
  }
  export interface AwsEc2InstanceNetworkInterfacesDetails {
    /**
     * The identifier of the network interface. The details are in a corresponding AwsEc2NetworkInterfacesDetails object.
     */
    NetworkInterfaceId?: NonEmptyString;
  }
  export type AwsEc2InstanceNetworkInterfacesList = AwsEc2InstanceNetworkInterfacesDetails[];
  export interface AwsEc2NetworkAclAssociation {
    /**
     * The identifier of the association between the network ACL and the subnet.
     */
    NetworkAclAssociationId?: NonEmptyString;
    /**
     * The identifier of the network ACL.
     */
    NetworkAclId?: NonEmptyString;
    /**
     * The identifier of the subnet that is associated with the network ACL.
     */
    SubnetId?: NonEmptyString;
  }
  export type AwsEc2NetworkAclAssociationList = AwsEc2NetworkAclAssociation[];
  export interface AwsEc2NetworkAclDetails {
    /**
     * Whether this is the default network ACL for the VPC.
     */
    IsDefault?: Boolean;
    /**
     * The identifier of the network ACL.
     */
    NetworkAclId?: NonEmptyString;
    /**
     * The identifier of the Amazon Web Services account that owns the network ACL.
     */
    OwnerId?: NonEmptyString;
    /**
     * The identifier of the VPC for the network ACL.
     */
    VpcId?: NonEmptyString;
    /**
     * Associations between the network ACL and subnets.
     */
    Associations?: AwsEc2NetworkAclAssociationList;
    /**
     * The set of rules in the network ACL.
     */
    Entries?: AwsEc2NetworkAclEntryList;
  }
  export interface AwsEc2NetworkAclEntry {
    /**
     * The IPV4 network range for which to deny or allow access.
     */
    CidrBlock?: NonEmptyString;
    /**
     * Whether the rule is an egress rule. An egress rule is a rule that applies to traffic that leaves the subnet.
     */
    Egress?: Boolean;
    /**
     * The Internet Control Message Protocol (ICMP) type and code for which to deny or allow access.
     */
    IcmpTypeCode?: IcmpTypeCode;
    /**
     * The IPV6 network range for which to deny or allow access.
     */
    Ipv6CidrBlock?: NonEmptyString;
    /**
     * For TCP or UDP protocols, the range of ports that the rule applies to.
     */
    PortRange?: PortRangeFromTo;
    /**
     * The protocol that the rule applies to. To deny or allow access to all protocols, use the value -1.
     */
    Protocol?: NonEmptyString;
    /**
     * Whether the rule is used to allow access or deny access.
     */
    RuleAction?: NonEmptyString;
    /**
     * The rule number. The rules are processed in order by their number.
     */
    RuleNumber?: Integer;
  }
  export type AwsEc2NetworkAclEntryList = AwsEc2NetworkAclEntry[];
  export interface AwsEc2NetworkInterfaceAttachment {
    /**
     * Indicates when the attachment initiated. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    AttachTime?: NonEmptyString;
    /**
     * The identifier of the network interface attachment
     */
    AttachmentId?: NonEmptyString;
    /**
     * Indicates whether the network interface is deleted when the instance is terminated.
     */
    DeleteOnTermination?: Boolean;
    /**
     * The device index of the network interface attachment on the instance.
     */
    DeviceIndex?: Integer;
    /**
     * The ID of the instance.
     */
    InstanceId?: NonEmptyString;
    /**
     * The Amazon Web Services account ID of the owner of the instance.
     */
    InstanceOwnerId?: NonEmptyString;
    /**
     * The attachment state. Valid values: attaching | attached | detaching | detached 
     */
    Status?: NonEmptyString;
  }
  export interface AwsEc2NetworkInterfaceDetails {
    /**
     * The network interface attachment.
     */
    Attachment?: AwsEc2NetworkInterfaceAttachment;
    /**
     * The ID of the network interface.
     */
    NetworkInterfaceId?: NonEmptyString;
    /**
     * Security groups for the network interface.
     */
    SecurityGroups?: AwsEc2NetworkInterfaceSecurityGroupList;
    /**
     * Indicates whether traffic to or from the instance is validated.
     */
    SourceDestCheck?: Boolean;
    /**
     * The IPv6 addresses associated with the network interface.
     */
    IpV6Addresses?: AwsEc2NetworkInterfaceIpV6AddressList;
    /**
     * The private IPv4 addresses associated with the network interface.
     */
    PrivateIpAddresses?: AwsEc2NetworkInterfacePrivateIpAddressList;
    /**
     * The public DNS name of the network interface.
     */
    PublicDnsName?: NonEmptyString;
    /**
     * The address of the Elastic IP address bound to the network interface.
     */
    PublicIp?: NonEmptyString;
  }
  export interface AwsEc2NetworkInterfaceIpV6AddressDetail {
    /**
     * The IPV6 address.
     */
    IpV6Address?: NonEmptyString;
  }
  export type AwsEc2NetworkInterfaceIpV6AddressList = AwsEc2NetworkInterfaceIpV6AddressDetail[];
  export interface AwsEc2NetworkInterfacePrivateIpAddressDetail {
    /**
     * The IP address.
     */
    PrivateIpAddress?: NonEmptyString;
    /**
     * The private DNS name for the IP address.
     */
    PrivateDnsName?: NonEmptyString;
  }
  export type AwsEc2NetworkInterfacePrivateIpAddressList = AwsEc2NetworkInterfacePrivateIpAddressDetail[];
  export interface AwsEc2NetworkInterfaceSecurityGroup {
    /**
     * The name of the security group.
     */
    GroupName?: NonEmptyString;
    /**
     * The ID of the security group.
     */
    GroupId?: NonEmptyString;
  }
  export type AwsEc2NetworkInterfaceSecurityGroupList = AwsEc2NetworkInterfaceSecurityGroup[];
  export interface AwsEc2SecurityGroupDetails {
    /**
     * The name of the security group.
     */
    GroupName?: NonEmptyString;
    /**
     * The ID of the security group.
     */
    GroupId?: NonEmptyString;
    /**
     * The Amazon Web Services account ID of the owner of the security group.
     */
    OwnerId?: NonEmptyString;
    /**
     * [VPC only] The ID of the VPC for the security group.
     */
    VpcId?: NonEmptyString;
    /**
     * The inbound rules associated with the security group.
     */
    IpPermissions?: AwsEc2SecurityGroupIpPermissionList;
    /**
     * [VPC only] The outbound rules associated with the security group.
     */
    IpPermissionsEgress?: AwsEc2SecurityGroupIpPermissionList;
  }
  export interface AwsEc2SecurityGroupIpPermission {
    /**
     * The IP protocol name (tcp, udp, icmp, icmpv6) or number. [VPC only] Use -1 to specify all protocols. When authorizing security group rules, specifying -1 or a protocol number other than tcp, udp, icmp, or icmpv6 allows traffic on all ports, regardless of any port range you specify. For tcp, udp, and icmp, you must specify a port range. For icmpv6, the port range is optional. If you omit the port range, traffic for all types and codes is allowed. 
     */
    IpProtocol?: NonEmptyString;
    /**
     * The start of the port range for the TCP and UDP protocols, or an ICMP/ICMPv6 type number. A value of -1 indicates all ICMP/ICMPv6 types. If you specify all ICMP/ICMPv6 types, you must specify all codes. 
     */
    FromPort?: Integer;
    /**
     * The end of the port range for the TCP and UDP protocols, or an ICMP/ICMPv6 code. A value of -1 indicates all ICMP/ICMPv6 codes. If you specify all ICMP/ICMPv6 types, you must specify all codes.
     */
    ToPort?: Integer;
    /**
     * The security group and Amazon Web Services account ID pairs.
     */
    UserIdGroupPairs?: AwsEc2SecurityGroupUserIdGroupPairList;
    /**
     * The IPv4 ranges.
     */
    IpRanges?: AwsEc2SecurityGroupIpRangeList;
    /**
     * The IPv6 ranges.
     */
    Ipv6Ranges?: AwsEc2SecurityGroupIpv6RangeList;
    /**
     * [VPC only] The prefix list IDs for an Amazon Web Services service. With outbound rules, this is the Amazon Web Services service to access through a VPC endpoint from instances associated with the security group.
     */
    PrefixListIds?: AwsEc2SecurityGroupPrefixListIdList;
  }
  export type AwsEc2SecurityGroupIpPermissionList = AwsEc2SecurityGroupIpPermission[];
  export interface AwsEc2SecurityGroupIpRange {
    /**
     * The IPv4 CIDR range. You can specify either a CIDR range or a source security group, but not both. To specify a single IPv4 address, use the /32 prefix length.
     */
    CidrIp?: NonEmptyString;
  }
  export type AwsEc2SecurityGroupIpRangeList = AwsEc2SecurityGroupIpRange[];
  export interface AwsEc2SecurityGroupIpv6Range {
    /**
     * The IPv6 CIDR range. You can specify either a CIDR range or a source security group, but not both. To specify a single IPv6 address, use the /128 prefix length.
     */
    CidrIpv6?: NonEmptyString;
  }
  export type AwsEc2SecurityGroupIpv6RangeList = AwsEc2SecurityGroupIpv6Range[];
  export interface AwsEc2SecurityGroupPrefixListId {
    /**
     * The ID of the prefix.
     */
    PrefixListId?: NonEmptyString;
  }
  export type AwsEc2SecurityGroupPrefixListIdList = AwsEc2SecurityGroupPrefixListId[];
  export interface AwsEc2SecurityGroupUserIdGroupPair {
    /**
     * The ID of the security group.
     */
    GroupId?: NonEmptyString;
    /**
     * The name of the security group.
     */
    GroupName?: NonEmptyString;
    /**
     * The status of a VPC peering connection, if applicable.
     */
    PeeringStatus?: NonEmptyString;
    /**
     * The ID of an Amazon Web Services account. For a referenced security group in another VPC, the account ID of the referenced security group is returned in the response. If the referenced security group is deleted, this value is not returned. [EC2-Classic] Required when adding or removing rules that reference a security group in another VPC. 
     */
    UserId?: NonEmptyString;
    /**
     * The ID of the VPC for the referenced security group, if applicable.
     */
    VpcId?: NonEmptyString;
    /**
     * The ID of the VPC peering connection, if applicable.
     */
    VpcPeeringConnectionId?: NonEmptyString;
  }
  export type AwsEc2SecurityGroupUserIdGroupPairList = AwsEc2SecurityGroupUserIdGroupPair[];
  export interface AwsEc2SubnetDetails {
    /**
     * Whether to assign an IPV6 address to a network interface that is created in this subnet.
     */
    AssignIpv6AddressOnCreation?: Boolean;
    /**
     * The Availability Zone for the subnet.
     */
    AvailabilityZone?: NonEmptyString;
    /**
     * The identifier of the Availability Zone for the subnet.
     */
    AvailabilityZoneId?: NonEmptyString;
    /**
     * The number of available IPV4 addresses in the subnet. Does not include addresses for stopped instances.
     */
    AvailableIpAddressCount?: Integer;
    /**
     * The IPV4 CIDR block that is assigned to the subnet.
     */
    CidrBlock?: NonEmptyString;
    /**
     * Whether this subnet is the default subnet for the Availability Zone.
     */
    DefaultForAz?: Boolean;
    /**
     * Whether instances in this subnet receive a public IP address.
     */
    MapPublicIpOnLaunch?: Boolean;
    /**
     * The identifier of the Amazon Web Services account that owns the subnet.
     */
    OwnerId?: NonEmptyString;
    /**
     * The current state of the subnet.
     */
    State?: NonEmptyString;
    /**
     * The ARN of the subnet.
     */
    SubnetArn?: NonEmptyString;
    /**
     * The identifier of the subnet.
     */
    SubnetId?: NonEmptyString;
    /**
     * The identifier of the VPC that contains the subnet.
     */
    VpcId?: NonEmptyString;
    /**
     * The IPV6 CIDR blocks that are associated with the subnet.
     */
    Ipv6CidrBlockAssociationSet?: Ipv6CidrBlockAssociationList;
  }
  export interface AwsEc2VolumeAttachment {
    /**
     * The datetime when the attachment initiated.
     */
    AttachTime?: NonEmptyString;
    /**
     * Whether the EBS volume is deleted when the EC2 instance is terminated.
     */
    DeleteOnTermination?: Boolean;
    /**
     * The identifier of the EC2 instance.
     */
    InstanceId?: NonEmptyString;
    /**
     * The attachment state of the volume.
     */
    Status?: NonEmptyString;
  }
  export type AwsEc2VolumeAttachmentList = AwsEc2VolumeAttachment[];
  export interface AwsEc2VolumeDetails {
    /**
     * Indicates when the volume was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreateTime?: NonEmptyString;
    /**
     * Whether the volume is encrypted.
     */
    Encrypted?: Boolean;
    /**
     * The size of the volume, in GiBs.
     */
    Size?: Integer;
    /**
     * The snapshot from which the volume was created.
     */
    SnapshotId?: NonEmptyString;
    /**
     * The volume state.
     */
    Status?: NonEmptyString;
    /**
     * The ARN of the KMS key that was used to protect the volume encryption key for the volume.
     */
    KmsKeyId?: NonEmptyString;
    /**
     * The volume attachments.
     */
    Attachments?: AwsEc2VolumeAttachmentList;
  }
  export interface AwsEc2VpcDetails {
    /**
     * Information about the IPv4 CIDR blocks associated with the VPC.
     */
    CidrBlockAssociationSet?: CidrBlockAssociationList;
    /**
     * Information about the IPv6 CIDR blocks associated with the VPC.
     */
    Ipv6CidrBlockAssociationSet?: Ipv6CidrBlockAssociationList;
    /**
     * The identifier of the set of Dynamic Host Configuration Protocol (DHCP) options that are associated with the VPC. If the default options are associated with the VPC, then this is default.
     */
    DhcpOptionsId?: NonEmptyString;
    /**
     * The current state of the VPC.
     */
    State?: NonEmptyString;
  }
  export interface AwsEc2VpcEndpointServiceDetails {
    /**
     * Whether requests from other Amazon Web Services accounts to create an endpoint to the service must first be accepted.
     */
    AcceptanceRequired?: Boolean;
    /**
     * The Availability Zones where the service is available.
     */
    AvailabilityZones?: NonEmptyStringList;
    /**
     * The DNS names for the service.
     */
    BaseEndpointDnsNames?: NonEmptyStringList;
    /**
     * Whether the service manages its VPC endpoints.
     */
    ManagesVpcEndpoints?: Boolean;
    /**
     * The ARNs of the Gateway Load Balancers for the service.
     */
    GatewayLoadBalancerArns?: NonEmptyStringList;
    /**
     * The ARNs of the Network Load Balancers for the service.
     */
    NetworkLoadBalancerArns?: NonEmptyStringList;
    /**
     * The private DNS name for the service.
     */
    PrivateDnsName?: NonEmptyString;
    /**
     * The identifier of the service.
     */
    ServiceId?: NonEmptyString;
    /**
     * The name of the service.
     */
    ServiceName?: NonEmptyString;
    /**
     * The current state of the service.
     */
    ServiceState?: NonEmptyString;
    /**
     * The types for the service.
     */
    ServiceType?: AwsEc2VpcEndpointServiceServiceTypeList;
  }
  export interface AwsEc2VpcEndpointServiceServiceTypeDetails {
    /**
     * The type of service.
     */
    ServiceType?: NonEmptyString;
  }
  export type AwsEc2VpcEndpointServiceServiceTypeList = AwsEc2VpcEndpointServiceServiceTypeDetails[];
  export interface AwsEc2VpnConnectionDetails {
    /**
     * The identifier of the VPN connection.
     */
    VpnConnectionId?: NonEmptyString;
    /**
     * The current state of the VPN connection.
     */
    State?: NonEmptyString;
    /**
     * The identifier of the customer gateway that is at your end of the VPN connection.
     */
    CustomerGatewayId?: NonEmptyString;
    /**
     * The configuration information for the VPN connection's customer gateway, in the native XML format.
     */
    CustomerGatewayConfiguration?: NonEmptyString;
    /**
     * The type of VPN connection.
     */
    Type?: NonEmptyString;
    /**
     * The identifier of the virtual private gateway that is at the Amazon Web Services side of the VPN connection.
     */
    VpnGatewayId?: NonEmptyString;
    /**
     * The category of the VPN connection. VPN indicates an Amazon Web Services VPN connection. VPN-Classic indicates an Amazon Web Services Classic VPN connection.
     */
    Category?: NonEmptyString;
    /**
     * Information about the VPN tunnel.
     */
    VgwTelemetry?: AwsEc2VpnConnectionVgwTelemetryList;
    /**
     * The VPN connection options.
     */
    Options?: AwsEc2VpnConnectionOptionsDetails;
    /**
     * The static routes that are associated with the VPN connection.
     */
    Routes?: AwsEc2VpnConnectionRoutesList;
    /**
     * The identifier of the transit gateway that is associated with the VPN connection.
     */
    TransitGatewayId?: NonEmptyString;
  }
  export interface AwsEc2VpnConnectionOptionsDetails {
    /**
     * Whether the VPN connection uses static routes only.
     */
    StaticRoutesOnly?: Boolean;
    /**
     * The VPN tunnel options.
     */
    TunnelOptions?: AwsEc2VpnConnectionOptionsTunnelOptionsList;
  }
  export interface AwsEc2VpnConnectionOptionsTunnelOptionsDetails {
    /**
     * The number of seconds after which a Dead Peer Detection (DPD) timeout occurs.
     */
    DpdTimeoutSeconds?: Integer;
    /**
     * The Internet Key Exchange (IKE) versions that are permitted for the VPN tunnel.
     */
    IkeVersions?: NonEmptyStringList;
    /**
     * The external IP address of the VPN tunnel.
     */
    OutsideIpAddress?: NonEmptyString;
    /**
     * The permitted Diffie-Hellman group numbers for the VPN tunnel for phase 1 IKE negotiations.
     */
    Phase1DhGroupNumbers?: IntegerList;
    /**
     * The permitted encryption algorithms for the VPN tunnel for phase 1 IKE negotiations.
     */
    Phase1EncryptionAlgorithms?: NonEmptyStringList;
    /**
     * The permitted integrity algorithms for the VPN tunnel for phase 1 IKE negotiations.
     */
    Phase1IntegrityAlgorithms?: NonEmptyStringList;
    /**
     * The lifetime for phase 1 of the IKE negotiation, in seconds.
     */
    Phase1LifetimeSeconds?: Integer;
    /**
     * The permitted Diffie-Hellman group numbers for the VPN tunnel for phase 2 IKE negotiations.
     */
    Phase2DhGroupNumbers?: IntegerList;
    /**
     * The permitted encryption algorithms for the VPN tunnel for phase 2 IKE negotiations.
     */
    Phase2EncryptionAlgorithms?: NonEmptyStringList;
    /**
     * The permitted integrity algorithms for the VPN tunnel for phase 2 IKE negotiations.
     */
    Phase2IntegrityAlgorithms?: NonEmptyStringList;
    /**
     * The lifetime for phase 2 of the IKE negotiation, in seconds.
     */
    Phase2LifetimeSeconds?: Integer;
    /**
     * The preshared key to establish initial authentication between the virtual private gateway and the customer gateway.
     */
    PreSharedKey?: NonEmptyString;
    /**
     * The percentage of the rekey window, which is determined by RekeyMarginTimeSeconds during which the rekey time is randomly selected.
     */
    RekeyFuzzPercentage?: Integer;
    /**
     * The margin time, in seconds, before the phase 2 lifetime expires, during which the Amazon Web Services side of the VPN connection performs an IKE rekey.
     */
    RekeyMarginTimeSeconds?: Integer;
    /**
     * The number of packets in an IKE replay window.
     */
    ReplayWindowSize?: Integer;
    /**
     * The range of inside IPv4 addresses for the tunnel.
     */
    TunnelInsideCidr?: NonEmptyString;
  }
  export type AwsEc2VpnConnectionOptionsTunnelOptionsList = AwsEc2VpnConnectionOptionsTunnelOptionsDetails[];
  export interface AwsEc2VpnConnectionRoutesDetails {
    /**
     * The CIDR block associated with the local subnet of the customer data center.
     */
    DestinationCidrBlock?: NonEmptyString;
    /**
     * The current state of the static route.
     */
    State?: NonEmptyString;
  }
  export type AwsEc2VpnConnectionRoutesList = AwsEc2VpnConnectionRoutesDetails[];
  export interface AwsEc2VpnConnectionVgwTelemetryDetails {
    /**
     * The number of accepted routes.
     */
    AcceptedRouteCount?: Integer;
    /**
     * The ARN of the VPN tunnel endpoint certificate.
     */
    CertificateArn?: NonEmptyString;
    /**
     * The date and time of the last change in status. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LastStatusChange?: NonEmptyString;
    /**
     * The Internet-routable IP address of the virtual private gateway's outside interface.
     */
    OutsideIpAddress?: NonEmptyString;
    /**
     * The status of the VPN tunnel.
     */
    Status?: NonEmptyString;
    /**
     * If an error occurs, a description of the error.
     */
    StatusMessage?: NonEmptyString;
  }
  export type AwsEc2VpnConnectionVgwTelemetryList = AwsEc2VpnConnectionVgwTelemetryDetails[];
  export interface AwsEcrContainerImageDetails {
    /**
     * The Amazon Web Services account identifier that is associated with the registry that the image belongs to.
     */
    RegistryId?: NonEmptyString;
    /**
     * The name of the repository that the image belongs to.
     */
    RepositoryName?: NonEmptyString;
    /**
     * The architecture of the image.
     */
    Architecture?: NonEmptyString;
    /**
     * The sha256 digest of the image manifest.
     */
    ImageDigest?: NonEmptyString;
    /**
     * The list of tags that are associated with the image.
     */
    ImageTags?: NonEmptyStringList;
    /**
     * The date and time when the image was pushed to the repository. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    ImagePublishedAt?: NonEmptyString;
  }
  export interface AwsEcrRepositoryDetails {
    /**
     * The ARN of the repository.
     */
    Arn?: NonEmptyString;
    /**
     * The image scanning configuration for a repository.
     */
    ImageScanningConfiguration?: AwsEcrRepositoryImageScanningConfigurationDetails;
    /**
     * The tag mutability setting for the repository.
     */
    ImageTagMutability?: NonEmptyString;
    /**
     * Information about the lifecycle policy for the repository.
     */
    LifecyclePolicy?: AwsEcrRepositoryLifecyclePolicyDetails;
    /**
     * The name of the repository.
     */
    RepositoryName?: NonEmptyString;
    /**
     * The text of the repository policy.
     */
    RepositoryPolicyText?: NonEmptyString;
  }
  export interface AwsEcrRepositoryImageScanningConfigurationDetails {
    /**
     * Whether to scan images after they are pushed to a repository.
     */
    ScanOnPush?: Boolean;
  }
  export interface AwsEcrRepositoryLifecyclePolicyDetails {
    /**
     * The text of the lifecycle policy.
     */
    LifecyclePolicyText?: NonEmptyString;
    /**
     * The Amazon Web Services account identifier that is associated with the registry that contains the repository.
     */
    RegistryId?: NonEmptyString;
  }
  export interface AwsEcsClusterClusterSettingsDetails {
    /**
     * The name of the setting.
     */
    Name?: NonEmptyString;
    /**
     * The value of the setting.
     */
    Value?: NonEmptyString;
  }
  export type AwsEcsClusterClusterSettingsList = AwsEcsClusterClusterSettingsDetails[];
  export interface AwsEcsClusterConfigurationDetails {
    /**
     * Contains the run command configuration for the cluster.
     */
    ExecuteCommandConfiguration?: AwsEcsClusterConfigurationExecuteCommandConfigurationDetails;
  }
  export interface AwsEcsClusterConfigurationExecuteCommandConfigurationDetails {
    /**
     * The identifier of the KMS key that is used to encrypt the data between the local client and the container.
     */
    KmsKeyId?: NonEmptyString;
    /**
     * The log configuration for the results of the run command actions. Required if Logging is NONE.
     */
    LogConfiguration?: AwsEcsClusterConfigurationExecuteCommandConfigurationLogConfigurationDetails;
    /**
     * The log setting to use for redirecting logs for run command results.
     */
    Logging?: NonEmptyString;
  }
  export interface AwsEcsClusterConfigurationExecuteCommandConfigurationLogConfigurationDetails {
    /**
     * Whether to enable encryption on the CloudWatch logs.
     */
    CloudWatchEncryptionEnabled?: Boolean;
    /**
     * The name of the CloudWatch log group to send the logs to.
     */
    CloudWatchLogGroupName?: NonEmptyString;
    /**
     * The name of the S3 bucket to send logs to.
     */
    S3BucketName?: NonEmptyString;
    /**
     * Whether to encrypt the logs that are sent to the S3 bucket.
     */
    S3EncryptionEnabled?: Boolean;
    /**
     * Identifies the folder in the S3 bucket to send the logs to.
     */
    S3KeyPrefix?: NonEmptyString;
  }
  export interface AwsEcsClusterDefaultCapacityProviderStrategyDetails {
    /**
     * The minimum number of tasks to run on the specified capacity provider.
     */
    Base?: Integer;
    /**
     * The name of the capacity provider.
     */
    CapacityProvider?: NonEmptyString;
    /**
     * The relative percentage of the total number of tasks launched that should use the capacity provider.
     */
    Weight?: Integer;
  }
  export type AwsEcsClusterDefaultCapacityProviderStrategyList = AwsEcsClusterDefaultCapacityProviderStrategyDetails[];
  export interface AwsEcsClusterDetails {
    /**
     * The short name of one or more capacity providers to associate with the cluster.
     */
    CapacityProviders?: NonEmptyStringList;
    /**
     * The setting to use to create the cluster. Specifically used to configure whether to enable CloudWatch Container Insights for the cluster.
     */
    ClusterSettings?: AwsEcsClusterClusterSettingsList;
    /**
     * The run command configuration for the cluster.
     */
    Configuration?: AwsEcsClusterConfigurationDetails;
    /**
     * The default capacity provider strategy for the cluster. The default capacity provider strategy is used when services or tasks are run without a specified launch type or capacity provider strategy.
     */
    DefaultCapacityProviderStrategy?: AwsEcsClusterDefaultCapacityProviderStrategyList;
  }
  export interface AwsEcsServiceCapacityProviderStrategyDetails {
    /**
     * The minimum number of tasks to run on the capacity provider. Only one strategy item can specify a value for Base. The value must be between 0 and 100000.
     */
    Base?: Integer;
    /**
     * The short name of the capacity provider.
     */
    CapacityProvider?: NonEmptyString;
    /**
     * The relative percentage of the total number of tasks that should use the capacity provider. If no weight is specified, the default value is 0. At least one capacity provider must have a weight greater than 0. The value can be between 0 and 1000.
     */
    Weight?: Integer;
  }
  export type AwsEcsServiceCapacityProviderStrategyList = AwsEcsServiceCapacityProviderStrategyDetails[];
  export interface AwsEcsServiceDeploymentConfigurationDeploymentCircuitBreakerDetails {
    /**
     * Whether to enable the deployment circuit breaker logic for the service.
     */
    Enable?: Boolean;
    /**
     * Whether to roll back the service if a service deployment fails. If rollback is enabled, when a service deployment fails, the service is rolled back to the last deployment that completed successfully.
     */
    Rollback?: Boolean;
  }
  export interface AwsEcsServiceDeploymentConfigurationDetails {
    /**
     * Determines whether a service deployment fails if a service cannot reach a steady state.
     */
    DeploymentCircuitBreaker?: AwsEcsServiceDeploymentConfigurationDeploymentCircuitBreakerDetails;
    /**
     * For a service that uses the rolling update (ECS) deployment type, the maximum number of tasks in a service that are allowed in the RUNNING or PENDING state during a deployment, and for tasks that use the EC2 launch type, when any container instances are in the DRAINING state. Provided as a percentage of the desired number of tasks. The default value is 200%. For a service that uses the blue/green (CODE_DEPLOY) or EXTERNAL deployment types, and tasks that use the EC2 launch type, the maximum number of tasks in the service that remain in the RUNNING state while the container instances are in the DRAINING state. For the Fargate launch type, the maximum percent value is not used.
     */
    MaximumPercent?: Integer;
    /**
     * For a service that uses the rolling update (ECS) deployment type, the minimum number of tasks in a service that must remain in the RUNNING state during a deployment, and while any container instances are in the DRAINING state if the service contains tasks using the EC2 launch type. Expressed as a percentage of the desired number of tasks. The default value is 100%. For a service that uses the blue/green (CODE_DEPLOY) or EXTERNAL deployment types and tasks that use the EC2 launch type, the minimum number of the tasks in the service that remain in the RUNNING state while the container instances are in the DRAINING state. For the Fargate launch type, the minimum healthy percent value is not used.
     */
    MinimumHealthyPercent?: Integer;
  }
  export interface AwsEcsServiceDeploymentControllerDetails {
    /**
     * The rolling update (ECS) deployment type replaces the current running version of the container with the latest version. The blue/green (CODE_DEPLOY) deployment type uses the blue/green deployment model that is powered by CodeDeploy. This deployment model a new deployment of a service can be verified before production traffic is sent to it. The external (EXTERNAL) deployment type allows the use of any third-party deployment controller for full control over the deployment process for an Amazon ECS service. Valid values: ECS | CODE_DEPLOY | EXTERNAL 
     */
    Type?: NonEmptyString;
  }
  export interface AwsEcsServiceDetails {
    /**
     * The capacity provider strategy that the service uses.
     */
    CapacityProviderStrategy?: AwsEcsServiceCapacityProviderStrategyList;
    /**
     * The ARN of the cluster that hosts the service.
     */
    Cluster?: NonEmptyString;
    /**
     * Deployment parameters for the service. Includes the number of tasks that run and the order in which to start and stop tasks.
     */
    DeploymentConfiguration?: AwsEcsServiceDeploymentConfigurationDetails;
    /**
     * Contains the deployment controller type that the service uses.
     */
    DeploymentController?: AwsEcsServiceDeploymentControllerDetails;
    /**
     * The number of instantiations of the task definition to run on the service.
     */
    DesiredCount?: Integer;
    /**
     * Whether to enable Amazon ECS managed tags for the tasks in the service.
     */
    EnableEcsManagedTags?: Boolean;
    /**
     * Whether the execute command functionality is enabled for the service.
     */
    EnableExecuteCommand?: Boolean;
    /**
     * After a task starts, the amount of time in seconds that the Amazon ECS service scheduler ignores unhealthy Elastic Load Balancing target health checks.
     */
    HealthCheckGracePeriodSeconds?: Integer;
    /**
     * The launch type that the service uses. Valid values: EC2 | FARGATE | EXTERNAL 
     */
    LaunchType?: NonEmptyString;
    /**
     * Information about the load balancers that the service uses.
     */
    LoadBalancers?: AwsEcsServiceLoadBalancersList;
    /**
     * The name of the service.
     */
    Name?: NonEmptyString;
    /**
     * For tasks that use the awsvpc networking mode, the VPC subnet and security group configuration.
     */
    NetworkConfiguration?: AwsEcsServiceNetworkConfigurationDetails;
    /**
     * The placement constraints for the tasks in the service.
     */
    PlacementConstraints?: AwsEcsServicePlacementConstraintsList;
    /**
     * Information about how tasks for the service are placed.
     */
    PlacementStrategies?: AwsEcsServicePlacementStrategiesList;
    /**
     * The platform version on which to run the service. Only specified for tasks that are hosted on Fargate. If a platform version is not specified, the LATEST platform version is used by default.
     */
    PlatformVersion?: NonEmptyString;
    /**
     * Indicates whether to propagate the tags from the task definition to the task or from the service to the task. If no value is provided, then tags are not propagated. Valid values: TASK_DEFINITION | SERVICE 
     */
    PropagateTags?: NonEmptyString;
    /**
     * The ARN of the IAM role that is associated with the service. The role allows the Amazon ECS container agent to register container instances with an Elastic Load Balancing load balancer.
     */
    Role?: NonEmptyString;
    /**
     * The scheduling strategy to use for the service. The REPLICA scheduling strategy places and maintains the desired number of tasks across the cluster. By default, the service scheduler spreads tasks across Availability Zones. Task placement strategies and constraints are used to customize task placement decisions. The DAEMON scheduling strategy deploys exactly one task on each active container instance that meets all of the task placement constraints that are specified in the cluster. The service scheduler also evaluates the task placement constraints for running tasks and stops tasks that do not meet the placement constraints. Valid values: REPLICA | DAEMON 
     */
    SchedulingStrategy?: NonEmptyString;
    /**
     * The ARN of the service.
     */
    ServiceArn?: NonEmptyString;
    /**
     * The name of the service. The name can contain up to 255 characters. It can use letters, numbers, underscores, and hyphens.
     */
    ServiceName?: NonEmptyString;
    /**
     * Information about the service discovery registries to assign to the service.
     */
    ServiceRegistries?: AwsEcsServiceServiceRegistriesList;
    /**
     * The task definition to use for tasks in the service.
     */
    TaskDefinition?: NonEmptyString;
  }
  export interface AwsEcsServiceLoadBalancersDetails {
    /**
     * The name of the container to associate with the load balancer.
     */
    ContainerName?: NonEmptyString;
    /**
     * The port on the container to associate with the load balancer. This port must correspond to a containerPort in the task definition the tasks in the service are using. For tasks that use the EC2 launch type, the container instance they are launched on must allow ingress traffic on the hostPort of the port mapping.
     */
    ContainerPort?: Integer;
    /**
     * The name of the load balancer to associate with the Amazon ECS service or task set. Only specified when using a Classic Load Balancer. For an Application Load Balancer or a Network Load Balancer, the load balancer name is omitted.
     */
    LoadBalancerName?: NonEmptyString;
    /**
     * The ARN of the Elastic Load Balancing target group or groups associated with a service or task set. Only specified when using an Application Load Balancer or a Network Load Balancer. For a Classic Load Balancer, the target group ARN is omitted.
     */
    TargetGroupArn?: NonEmptyString;
  }
  export type AwsEcsServiceLoadBalancersList = AwsEcsServiceLoadBalancersDetails[];
  export interface AwsEcsServiceNetworkConfigurationAwsVpcConfigurationDetails {
    /**
     * Whether the task's elastic network interface receives a public IP address. The default value is DISABLED. Valid values: ENABLED | DISABLED 
     */
    AssignPublicIp?: NonEmptyString;
    /**
     * The IDs of the security groups associated with the task or service. You can provide up to five security groups.
     */
    SecurityGroups?: NonEmptyStringList;
    /**
     * The IDs of the subnets associated with the task or service. You can provide up to 16 subnets.
     */
    Subnets?: NonEmptyStringList;
  }
  export interface AwsEcsServiceNetworkConfigurationDetails {
    /**
     * The VPC subnet and security group configuration.
     */
    AwsVpcConfiguration?: AwsEcsServiceNetworkConfigurationAwsVpcConfigurationDetails;
  }
  export interface AwsEcsServicePlacementConstraintsDetails {
    /**
     * A cluster query language expression to apply to the constraint. You cannot specify an expression if the constraint type is distinctInstance.
     */
    Expression?: NonEmptyString;
    /**
     * The type of constraint. Use distinctInstance to run each task in a particular group on a different container instance. Use memberOf to restrict the selection to a group of valid candidates. Valid values: distinctInstance | memberOf 
     */
    Type?: NonEmptyString;
  }
  export type AwsEcsServicePlacementConstraintsList = AwsEcsServicePlacementConstraintsDetails[];
  export interface AwsEcsServicePlacementStrategiesDetails {
    /**
     * The field to apply the placement strategy against. For the spread placement strategy, valid values are instanceId (or host, which has the same effect), or any platform or custom attribute that is applied to a container instance, such as attribute:ecs.availability-zone. For the binpack placement strategy, valid values are cpu and memory. For the random placement strategy, this attribute is not used.
     */
    Field?: NonEmptyString;
    /**
     * The type of placement strategy. The random placement strategy randomly places tasks on available candidates. The spread placement strategy spreads placement across available candidates evenly based on the value of Field. The binpack strategy places tasks on available candidates that have the least available amount of the resource that is specified in Field. Valid values: random | spread | binpack 
     */
    Type?: NonEmptyString;
  }
  export type AwsEcsServicePlacementStrategiesList = AwsEcsServicePlacementStrategiesDetails[];
  export interface AwsEcsServiceServiceRegistriesDetails {
    /**
     * The container name value to use for the service discovery service. If the task definition uses the bridge or host network mode, you must specify ContainerName and ContainerPort. If the task definition uses the awsvpc network mode and a type SRV DNS record, you must specify either ContainerName and ContainerPort, or Port , but not both.
     */
    ContainerName?: NonEmptyString;
    /**
     * The port value to use for the service discovery service. If the task definition uses the bridge or host network mode, you must specify ContainerName and ContainerPort. If the task definition uses the awsvpc network mode and a type SRV DNS record, you must specify either ContainerName and ContainerPort, or Port , but not both.
     */
    ContainerPort?: Integer;
    /**
     * The port value to use for a service discovery service that specifies an SRV record. This field can be used if both the awsvpcawsvpc network mode and SRV records are used.
     */
    Port?: Integer;
    /**
     * The ARN of the service registry.
     */
    RegistryArn?: NonEmptyString;
  }
  export type AwsEcsServiceServiceRegistriesList = AwsEcsServiceServiceRegistriesDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails {
    /**
     * The dependency condition of the dependent container. Indicates the required status of the dependent container before the current container can start.
     */
    Condition?: NonEmptyString;
    /**
     * The name of the dependent container.
     */
    ContainerName?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsDependsOnList = AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsDetails {
    /**
     * The command that is passed to the container.
     */
    Command?: NonEmptyStringList;
    /**
     * The number of CPU units reserved for the container.
     */
    Cpu?: Integer;
    /**
     * The dependencies that are defined for container startup and shutdown.
     */
    DependsOn?: AwsEcsTaskDefinitionContainerDefinitionsDependsOnList;
    /**
     * Whether to disable networking within the container.
     */
    DisableNetworking?: Boolean;
    /**
     * A list of DNS search domains that are presented to the container.
     */
    DnsSearchDomains?: NonEmptyStringList;
    /**
     * A list of DNS servers that are presented to the container.
     */
    DnsServers?: NonEmptyStringList;
    /**
     * A key-value map of labels to add to the container.
     */
    DockerLabels?: FieldMap;
    /**
     * A list of strings to provide custom labels for SELinux and AppArmor multi-level security systems.
     */
    DockerSecurityOptions?: NonEmptyStringList;
    /**
     * The entry point that is passed to the container.
     */
    EntryPoint?: NonEmptyStringList;
    /**
     * The environment variables to pass to a container.
     */
    Environment?: AwsEcsTaskDefinitionContainerDefinitionsEnvironmentList;
    /**
     * A list of files containing the environment variables to pass to a container.
     */
    EnvironmentFiles?: AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesList;
    /**
     * Whether the container is essential. All tasks must have at least one essential container.
     */
    Essential?: Boolean;
    /**
     * A list of hostnames and IP address mappings to append to the /etc/hosts file on the container.
     */
    ExtraHosts?: AwsEcsTaskDefinitionContainerDefinitionsExtraHostsList;
    /**
     * The FireLens configuration for the container. Specifies and configures a log router for container logs.
     */
    FirelensConfiguration?: AwsEcsTaskDefinitionContainerDefinitionsFirelensConfigurationDetails;
    /**
     * The container health check command and associated configuration parameters for the container.
     */
    HealthCheck?: AwsEcsTaskDefinitionContainerDefinitionsHealthCheckDetails;
    /**
     * The hostname to use for the container.
     */
    Hostname?: NonEmptyString;
    /**
     * The image used to start the container.
     */
    Image?: NonEmptyString;
    /**
     * If set to true, then containerized applications can be deployed that require stdin or a tty to be allocated.
     */
    Interactive?: Boolean;
    /**
     * A list of links for the container in the form  container_name:alias . Allows containers to communicate with each other without the need for port mappings.
     */
    Links?: NonEmptyStringList;
    /**
     * Linux-specific modifications that are applied to the container, such as Linux kernel capabilities.
     */
    LinuxParameters?: AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDetails;
    /**
     * The log configuration specification for the container.
     */
    LogConfiguration?: AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationDetails;
    /**
     * The amount (in MiB) of memory to present to the container. If the container attempts to exceed the memory specified here, the container is shut down. The total amount of memory reserved for all containers within a task must be lower than the task memory value, if one is specified.
     */
    Memory?: Integer;
    /**
     * The soft limit (in MiB) of memory to reserve for the container.
     */
    MemoryReservation?: Integer;
    /**
     * The mount points for the data volumes in the container.
     */
    MountPoints?: AwsEcsTaskDefinitionContainerDefinitionsMountPointsList;
    /**
     * The name of the container.
     */
    Name?: NonEmptyString;
    /**
     * The list of port mappings for the container.
     */
    PortMappings?: AwsEcsTaskDefinitionContainerDefinitionsPortMappingsList;
    /**
     * Whether the container is given elevated privileges on the host container instance. The elevated privileges are similar to the root user.
     */
    Privileged?: Boolean;
    /**
     * Whether to allocate a TTY to the container.
     */
    PseudoTerminal?: Boolean;
    /**
     * Whether the container is given read-only access to its root file system.
     */
    ReadonlyRootFilesystem?: Boolean;
    /**
     * The private repository authentication credentials to use.
     */
    RepositoryCredentials?: AwsEcsTaskDefinitionContainerDefinitionsRepositoryCredentialsDetails;
    /**
     * The type and amount of a resource to assign to a container. The only supported resource is a GPU.
     */
    ResourceRequirements?: AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsList;
    /**
     * The secrets to pass to the container.
     */
    Secrets?: AwsEcsTaskDefinitionContainerDefinitionsSecretsList;
    /**
     * The number of seconds to wait before giving up on resolving dependencies for a container. 
     */
    StartTimeout?: Integer;
    /**
     * The number of seconds to wait before the container is stopped if it doesn't shut down normally on its own.
     */
    StopTimeout?: Integer;
    /**
     * A list of namespaced kernel parameters to set in the container.
     */
    SystemControls?: AwsEcsTaskDefinitionContainerDefinitionsSystemControlsList;
    /**
     * A list of ulimits to set in the container. 
     */
    Ulimits?: AwsEcsTaskDefinitionContainerDefinitionsUlimitsList;
    /**
     * The user to use inside the container. The value can use one of the following formats.     user       user : group       uid       uid : gid       user : gid       uid : group    
     */
    User?: NonEmptyString;
    /**
     * Data volumes to mount from another container.
     */
    VolumesFrom?: AwsEcsTaskDefinitionContainerDefinitionsVolumesFromList;
    /**
     * The working directory in which to run commands inside the container.
     */
    WorkingDirectory?: NonEmptyString;
  }
  export interface AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails {
    /**
     * The name of the environment variable.
     */
    Name?: NonEmptyString;
    /**
     * The value of the environment variable.
     */
    Value?: NonEmptyString;
  }
  export interface AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails {
    /**
     * The type of environment file.
     */
    Type?: NonEmptyString;
    /**
     * The ARN of the S3 object that contains the environment variable file.
     */
    Value?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesList = AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails[];
  export type AwsEcsTaskDefinitionContainerDefinitionsEnvironmentList = AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails {
    /**
     * The hostname to use in the /etc/hosts entry.
     */
    Hostname?: NonEmptyString;
    /**
     * The IP address to use in the /etc/hosts entry.
     */
    IpAddress?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsExtraHostsList = AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsFirelensConfigurationDetails {
    /**
     * The options to use to configure the log router. The valid option keys are as follows:    enable-ecs-log-metadata. The value can be true or false.    config-file-type. The value can be s3 or file.    config-file-value. The value is either an S3 ARN or a file path.  
     */
    Options?: FieldMap;
    /**
     * The log router to use. 
     */
    Type?: NonEmptyString;
  }
  export interface AwsEcsTaskDefinitionContainerDefinitionsHealthCheckDetails {
    /**
     * The command that the container runs to determine whether it is healthy.
     */
    Command?: NonEmptyStringList;
    /**
     * The time period in seconds between each health check execution. The default value is 30 seconds.
     */
    Interval?: Integer;
    /**
     * The number of times to retry a failed health check before the container is considered unhealthy. The default value is 3.
     */
    Retries?: Integer;
    /**
     * The optional grace period in seconds that allows containers time to bootstrap before failed health checks count towards the maximum number of retries.
     */
    StartPeriod?: Integer;
    /**
     * The time period in seconds to wait for a health check to succeed before it is considered a failure. The default value is 5.
     */
    Timeout?: Integer;
  }
  export interface AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersCapabilitiesDetails {
    /**
     * The Linux capabilities for the container that are added to the default configuration provided by Docker.
     */
    Add?: NonEmptyStringList;
    /**
     * The Linux capabilities for the container that are dropped from the default configuration provided by Docker.
     */
    Drop?: NonEmptyStringList;
  }
  export interface AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDetails {
    /**
     * The Linux capabilities for the container that are added to or dropped from the default configuration provided by Docker.
     */
    Capabilities?: AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersCapabilitiesDetails;
    /**
     * The host devices to expose to the container.
     */
    Devices?: AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesList;
    /**
     * Whether to run an init process inside the container that forwards signals and reaps processes. 
     */
    InitProcessEnabled?: Boolean;
    /**
     * The total amount of swap memory (in MiB) that a container can use.
     */
    MaxSwap?: Integer;
    /**
     * The value for the size (in MiB) of the /dev/shm volume.
     */
    SharedMemorySize?: Integer;
    /**
     * Configures the container's memory swappiness behavior. Determines how aggressively pages are swapped. The higher the value, the more aggressive the swappiness. The default is 60.
     */
    Swappiness?: Integer;
    /**
     * The container path, mount options, and size (in MiB) of the tmpfs mount.
     */
    Tmpfs?: AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsList;
  }
  export interface AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails {
    /**
     * The path inside the container at which to expose the host device.
     */
    ContainerPath?: NonEmptyString;
    /**
     * The path for the device on the host container instance.
     */
    HostPath?: NonEmptyString;
    /**
     * The explicit permissions to provide to the container for the device. By default, the container has permissions for read, write, and mknod for the device.
     */
    Permissions?: NonEmptyStringList;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesList = AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails {
    /**
     * The absolute file path where the tmpfs volume is to be mounted.
     */
    ContainerPath?: NonEmptyString;
    /**
     * The list of tmpfs volume mount options.
     */
    MountOptions?: NonEmptyStringList;
    /**
     * The maximum size (in MiB) of the tmpfs volume.
     */
    Size?: Integer;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsList = AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails[];
  export type AwsEcsTaskDefinitionContainerDefinitionsList = AwsEcsTaskDefinitionContainerDefinitionsDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationDetails {
    /**
     * The log driver to use for the container.
     */
    LogDriver?: NonEmptyString;
    /**
     * The configuration options to send to the log driver. Requires version 1.19 of the Docker Remote API or greater on your container instance.
     */
    Options?: FieldMap;
    /**
     * The secrets to pass to the log configuration.
     */
    SecretOptions?: AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsList;
  }
  export interface AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails {
    /**
     * The name of the secret.
     */
    Name?: NonEmptyString;
    /**
     * The secret to expose to the container. The value is either the full ARN of the Secrets Manager secret or the full ARN of the parameter in the Systems Manager Parameter Store.
     */
    ValueFrom?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsList = AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails {
    /**
     * The path on the container to mount the host volume at.
     */
    ContainerPath?: NonEmptyString;
    /**
     * Whether the container has read-only access to the volume.
     */
    ReadOnly?: Boolean;
    /**
     * The name of the volume to mount. Must match the name of a volume listed in VolumeDetails for the task definition.
     */
    SourceVolume?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsMountPointsList = AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails {
    /**
     * The port number on the container that is bound to the user-specified or automatically assigned host port.
     */
    ContainerPort?: Integer;
    /**
     * The port number on the container instance to reserve for the container.
     */
    HostPort?: Integer;
    /**
     * The protocol used for the port mapping. The default is tcp.
     */
    Protocol?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsPortMappingsList = AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsRepositoryCredentialsDetails {
    /**
     * The ARN of the secret that contains the private repository credentials.
     */
    CredentialsParameter?: NonEmptyString;
  }
  export interface AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails {
    /**
     * The type of resource to assign to a container.
     */
    Type?: NonEmptyString;
    /**
     * The value for the specified resource type. For GPU, the value is the number of physical GPUs the Amazon ECS container agent reserves for the container. For InferenceAccelerator, the value should match the DeviceName attribute of an entry in InferenceAccelerators.
     */
    Value?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsList = AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails {
    /**
     * The name of the secret.
     */
    Name?: NonEmptyString;
    /**
     * The secret to expose to the container. The value is either the full ARN of the Secrets Manager secret or the full ARN of the parameter in the Systems Manager Parameter Store.
     */
    ValueFrom?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsSecretsList = AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails {
    /**
     * The namespaced kernel parameter for which to set a value.
     */
    Namespace?: NonEmptyString;
    /**
     * The value of the parameter.
     */
    Value?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsSystemControlsList = AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails {
    /**
     * The hard limit for the ulimit type.
     */
    HardLimit?: Integer;
    /**
     * The type of the ulimit.
     */
    Name?: NonEmptyString;
    /**
     * The soft limit for the ulimit type.
     */
    SoftLimit?: Integer;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsUlimitsList = AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails[];
  export interface AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails {
    /**
     * Whether the container has read-only access to the volume.
     */
    ReadOnly?: Boolean;
    /**
     * The name of another container within the same task definition from which to mount volumes.
     */
    SourceContainer?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionContainerDefinitionsVolumesFromList = AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails[];
  export interface AwsEcsTaskDefinitionDetails {
    /**
     * The container definitions that describe the containers that make up the task.
     */
    ContainerDefinitions?: AwsEcsTaskDefinitionContainerDefinitionsList;
    /**
     * The number of CPU units used by the task.
     */
    Cpu?: NonEmptyString;
    /**
     * The ARN of the task execution role that grants the container agent permission to make API calls on behalf of the container user.
     */
    ExecutionRoleArn?: NonEmptyString;
    /**
     * The name of a family that this task definition is registered to.
     */
    Family?: NonEmptyString;
    /**
     * The Elastic Inference accelerators to use for the containers in the task.
     */
    InferenceAccelerators?: AwsEcsTaskDefinitionInferenceAcceleratorsList;
    /**
     * The IPC resource namespace to use for the containers in the task.
     */
    IpcMode?: NonEmptyString;
    /**
     * The amount (in MiB) of memory used by the task.
     */
    Memory?: NonEmptyString;
    /**
     * The Docker networking mode to use for the containers in the task.
     */
    NetworkMode?: NonEmptyString;
    /**
     * The process namespace to use for the containers in the task.
     */
    PidMode?: NonEmptyString;
    /**
     * The placement constraint objects to use for tasks.
     */
    PlacementConstraints?: AwsEcsTaskDefinitionPlacementConstraintsList;
    /**
     * The configuration details for the App Mesh proxy.
     */
    ProxyConfiguration?: AwsEcsTaskDefinitionProxyConfigurationDetails;
    /**
     * The task launch types that the task definition was validated against.
     */
    RequiresCompatibilities?: NonEmptyStringList;
    /**
     * The short name or ARN of the IAM role that grants containers in the task permission to call Amazon Web Services API operations on your behalf.
     */
    TaskRoleArn?: NonEmptyString;
    /**
     * The data volume definitions for the task.
     */
    Volumes?: AwsEcsTaskDefinitionVolumesList;
  }
  export interface AwsEcsTaskDefinitionInferenceAcceleratorsDetails {
    /**
     * The Elastic Inference accelerator device name.
     */
    DeviceName?: NonEmptyString;
    /**
     * The Elastic Inference accelerator type to use.
     */
    DeviceType?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionInferenceAcceleratorsList = AwsEcsTaskDefinitionInferenceAcceleratorsDetails[];
  export interface AwsEcsTaskDefinitionPlacementConstraintsDetails {
    /**
     * A cluster query language expression to apply to the constraint.
     */
    Expression?: NonEmptyString;
    /**
     * The type of constraint.
     */
    Type?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionPlacementConstraintsList = AwsEcsTaskDefinitionPlacementConstraintsDetails[];
  export interface AwsEcsTaskDefinitionProxyConfigurationDetails {
    /**
     * The name of the container that will serve as the App Mesh proxy.
     */
    ContainerName?: NonEmptyString;
    /**
     * The set of network configuration parameters to provide to the Container Network Interface (CNI) plugin, specified as key-value pairs.
     */
    ProxyConfigurationProperties?: AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesList;
    /**
     * The proxy type.
     */
    Type?: NonEmptyString;
  }
  export interface AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails {
    /**
     * The name of the property.
     */
    Name?: NonEmptyString;
    /**
     * The value of the property.
     */
    Value?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesList = AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails[];
  export interface AwsEcsTaskDefinitionVolumesDetails {
    /**
     * Information about a Docker volume.
     */
    DockerVolumeConfiguration?: AwsEcsTaskDefinitionVolumesDockerVolumeConfigurationDetails;
    /**
     * Information about the Amazon Elastic File System file system that is used for task storage.
     */
    EfsVolumeConfiguration?: AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationDetails;
    /**
     * Information about a bind mount host volume.
     */
    Host?: AwsEcsTaskDefinitionVolumesHostDetails;
    /**
     * The name of the data volume.
     */
    Name?: NonEmptyString;
  }
  export interface AwsEcsTaskDefinitionVolumesDockerVolumeConfigurationDetails {
    /**
     * Whether to create the Docker volume automatically if it does not already exist.
     */
    Autoprovision?: Boolean;
    /**
     * The Docker volume driver to use.
     */
    Driver?: NonEmptyString;
    /**
     * A map of Docker driver-specific options that are passed through.
     */
    DriverOpts?: FieldMap;
    /**
     * Custom metadata to add to the Docker volume.
     */
    Labels?: FieldMap;
    /**
     * The scope for the Docker volume that determines its lifecycle. Docker volumes that are scoped to a task are provisioned automatically when the task starts and destroyed when the task stops. Docker volumes that are shared persist after the task stops.
     */
    Scope?: NonEmptyString;
  }
  export interface AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationAuthorizationConfigDetails {
    /**
     * The Amazon EFS access point identifier to use.
     */
    AccessPointId?: NonEmptyString;
    /**
     * Whether to use the Amazon ECS task IAM role defined in a task definition when mounting the Amazon EFS file system.
     */
    Iam?: NonEmptyString;
  }
  export interface AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationDetails {
    /**
     * The authorization configuration details for the Amazon EFS file system.
     */
    AuthorizationConfig?: AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationAuthorizationConfigDetails;
    /**
     * The Amazon EFS file system identifier to use.
     */
    FilesystemId?: NonEmptyString;
    /**
     * The directory within the Amazon EFS file system to mount as the root directory inside the host.
     */
    RootDirectory?: NonEmptyString;
    /**
     * Whether to enable encryption for Amazon EFS data in transit between the Amazon ECS host and the Amazon EFS server. 
     */
    TransitEncryption?: NonEmptyString;
    /**
     * The port to use when sending encrypted data between the Amazon ECS host and the Amazon EFS server.
     */
    TransitEncryptionPort?: Integer;
  }
  export interface AwsEcsTaskDefinitionVolumesHostDetails {
    /**
     * The path on the host container instance that is presented to the container.
     */
    SourcePath?: NonEmptyString;
  }
  export type AwsEcsTaskDefinitionVolumesList = AwsEcsTaskDefinitionVolumesDetails[];
  export interface AwsEksClusterDetails {
    /**
     * The ARN of the cluster.
     */
    Arn?: NonEmptyString;
    /**
     * The certificate authority data for the cluster.
     */
    CertificateAuthorityData?: NonEmptyString;
    /**
     * The status of the cluster.
     */
    ClusterStatus?: NonEmptyString;
    /**
     * The endpoint for the Amazon EKS API server.
     */
    Endpoint?: NonEmptyString;
    /**
     * The name of the cluster.
     */
    Name?: NonEmptyString;
    /**
     * The VPC configuration used by the cluster control plane.
     */
    ResourcesVpcConfig?: AwsEksClusterResourcesVpcConfigDetails;
    /**
     * The ARN of the IAM role that provides permissions for the Amazon EKS control plane to make calls to Amazon Web Services API operations on your behalf.
     */
    RoleArn?: NonEmptyString;
    /**
     * The Amazon EKS server version for the cluster.
     */
    Version?: NonEmptyString;
    /**
     * The logging configuration for the cluster.
     */
    Logging?: AwsEksClusterLoggingDetails;
  }
  export interface AwsEksClusterLoggingClusterLoggingDetails {
    /**
     * Whether the logging types that are listed in Types are enabled.
     */
    Enabled?: Boolean;
    /**
     * A list of logging types.
     */
    Types?: NonEmptyStringList;
  }
  export type AwsEksClusterLoggingClusterLoggingList = AwsEksClusterLoggingClusterLoggingDetails[];
  export interface AwsEksClusterLoggingDetails {
    /**
     * Cluster logging configurations.
     */
    ClusterLogging?: AwsEksClusterLoggingClusterLoggingList;
  }
  export interface AwsEksClusterResourcesVpcConfigDetails {
    /**
     * The security groups that are associated with the cross-account elastic network interfaces that are used to allow communication between your nodes and the Amazon EKS control plane.
     */
    SecurityGroupIds?: NonEmptyStringList;
    /**
     * The subnets that are associated with the cluster.
     */
    SubnetIds?: NonEmptyStringList;
  }
  export interface AwsElasticBeanstalkEnvironmentDetails {
    /**
     * The name of the application that is associated with the environment.
     */
    ApplicationName?: NonEmptyString;
    /**
     * The URL to the CNAME for this environment.
     */
    Cname?: NonEmptyString;
    /**
     * The creation date for this environment.
     */
    DateCreated?: NonEmptyString;
    /**
     * The date when this environment was last modified.
     */
    DateUpdated?: NonEmptyString;
    /**
     * A description of the environment.
     */
    Description?: NonEmptyString;
    /**
     * For load-balanced, autoscaling environments, the URL to the load balancer. For single-instance environments, the IP address of the instance.
     */
    EndpointUrl?: NonEmptyString;
    /**
     * The ARN of the environment.
     */
    EnvironmentArn?: NonEmptyString;
    /**
     * The identifier of the environment.
     */
    EnvironmentId?: NonEmptyString;
    /**
     * Links to other environments in the same group.
     */
    EnvironmentLinks?: AwsElasticBeanstalkEnvironmentEnvironmentLinks;
    /**
     * The name of the environment.
     */
    EnvironmentName?: NonEmptyString;
    /**
     * The configuration setting for the environment.
     */
    OptionSettings?: AwsElasticBeanstalkEnvironmentOptionSettings;
    /**
     * The ARN of the platform version for the environment.
     */
    PlatformArn?: NonEmptyString;
    /**
     * The name of the solution stack that is deployed with the environment.
     */
    SolutionStackName?: NonEmptyString;
    /**
     * The current operational status of the environment.
     */
    Status?: NonEmptyString;
    /**
     * The tier of the environment.
     */
    Tier?: AwsElasticBeanstalkEnvironmentTier;
    /**
     * The application version of the environment.
     */
    VersionLabel?: NonEmptyString;
  }
  export interface AwsElasticBeanstalkEnvironmentEnvironmentLink {
    /**
     * The name of the linked environment.
     */
    EnvironmentName?: NonEmptyString;
    /**
     * The name of the environment link.
     */
    LinkName?: NonEmptyString;
  }
  export type AwsElasticBeanstalkEnvironmentEnvironmentLinks = AwsElasticBeanstalkEnvironmentEnvironmentLink[];
  export interface AwsElasticBeanstalkEnvironmentOptionSetting {
    /**
     * The type of resource that the configuration option is associated with.
     */
    Namespace?: NonEmptyString;
    /**
     * The name of the option.
     */
    OptionName?: NonEmptyString;
    /**
     * The name of the resource.
     */
    ResourceName?: NonEmptyString;
    /**
     * The value of the configuration setting.
     */
    Value?: NonEmptyString;
  }
  export type AwsElasticBeanstalkEnvironmentOptionSettings = AwsElasticBeanstalkEnvironmentOptionSetting[];
  export interface AwsElasticBeanstalkEnvironmentTier {
    /**
     * The name of the environment tier.
     */
    Name?: NonEmptyString;
    /**
     * The type of environment tier.
     */
    Type?: NonEmptyString;
    /**
     * The version of the environment tier.
     */
    Version?: NonEmptyString;
  }
  export interface AwsElasticsearchDomainDetails {
    /**
     * IAM policy document specifying the access policies for the new Elasticsearch domain.
     */
    AccessPolicies?: NonEmptyString;
    /**
     * Additional options for the domain endpoint.
     */
    DomainEndpointOptions?: AwsElasticsearchDomainDomainEndpointOptions;
    /**
     * Unique identifier for an Elasticsearch domain.
     */
    DomainId?: NonEmptyString;
    /**
     * Name of an Elasticsearch domain. Domain names are unique across all domains owned by the same account within an Amazon Web Services Region. Domain names must start with a lowercase letter and must be between 3 and 28 characters. Valid characters are a-z (lowercase only), 0-9, and – (hyphen). 
     */
    DomainName?: NonEmptyString;
    /**
     * Domain-specific endpoint used to submit index, search, and data upload requests to an Elasticsearch domain. The endpoint is a service URL. 
     */
    Endpoint?: NonEmptyString;
    /**
     * The key-value pair that exists if the Elasticsearch domain uses VPC endpoints.
     */
    Endpoints?: FieldMap;
    /**
     * OpenSearch version.
     */
    ElasticsearchVersion?: NonEmptyString;
    /**
     * Information about an OpenSearch cluster configuration.
     */
    ElasticsearchClusterConfig?: AwsElasticsearchDomainElasticsearchClusterConfigDetails;
    /**
     * Details about the configuration for encryption at rest.
     */
    EncryptionAtRestOptions?: AwsElasticsearchDomainEncryptionAtRestOptions;
    /**
     * Configures the CloudWatch Logs to publish for the Elasticsearch domain.
     */
    LogPublishingOptions?: AwsElasticsearchDomainLogPublishingOptions;
    /**
     * Details about the configuration for node-to-node encryption.
     */
    NodeToNodeEncryptionOptions?: AwsElasticsearchDomainNodeToNodeEncryptionOptions;
    /**
     * Information about the status of a domain relative to the latest service software.
     */
    ServiceSoftwareOptions?: AwsElasticsearchDomainServiceSoftwareOptions;
    /**
     * Information that OpenSearch derives based on VPCOptions for the domain.
     */
    VPCOptions?: AwsElasticsearchDomainVPCOptions;
  }
  export interface AwsElasticsearchDomainDomainEndpointOptions {
    /**
     * Whether to require that all traffic to the domain arrive over HTTPS.
     */
    EnforceHTTPS?: Boolean;
    /**
     * The TLS security policy to apply to the HTTPS endpoint of the OpenSearch domain. Valid values:    Policy-Min-TLS-1-0-2019-07, which supports TLSv1.0 and higher    Policy-Min-TLS-1-2-2019-07, which only supports TLSv1.2  
     */
    TLSSecurityPolicy?: NonEmptyString;
  }
  export interface AwsElasticsearchDomainElasticsearchClusterConfigDetails {
    /**
     * The number of instances to use for the master node. If this attribute is specified, then DedicatedMasterEnabled must be true.
     */
    DedicatedMasterCount?: Integer;
    /**
     * Whether to use a dedicated master node for the Elasticsearch domain. A dedicated master node performs cluster management tasks, but doesn't hold data or respond to data upload requests.
     */
    DedicatedMasterEnabled?: Boolean;
    /**
     * The hardware configuration of the computer that hosts the dedicated master node. For example, m3.medium.elasticsearch. If this attribute is specified, then DedicatedMasterEnabled must be true.
     */
    DedicatedMasterType?: NonEmptyString;
    /**
     * The number of data nodes to use in the Elasticsearch domain.
     */
    InstanceCount?: Integer;
    /**
     * The instance type for your data nodes. For example, m3.medium.elasticsearch.
     */
    InstanceType?: NonEmptyString;
    /**
     * Configuration options for zone awareness. Provided if ZoneAwarenessEnabled is true.
     */
    ZoneAwarenessConfig?: AwsElasticsearchDomainElasticsearchClusterConfigZoneAwarenessConfigDetails;
    /**
     * Whether to enable zone awareness for the Elasticsearch domain. When zone awareness is enabled, OpenSearch allocates the cluster's nodes and replica index shards across Availability Zones in the same Region. This prevents data loss and minimizes downtime if a node or data center fails.
     */
    ZoneAwarenessEnabled?: Boolean;
  }
  export interface AwsElasticsearchDomainElasticsearchClusterConfigZoneAwarenessConfigDetails {
    /**
     * he number of Availability Zones that the domain uses. Valid values are 2 and 3. The default is 2.
     */
    AvailabilityZoneCount?: Integer;
  }
  export interface AwsElasticsearchDomainEncryptionAtRestOptions {
    /**
     * Whether encryption at rest is enabled.
     */
    Enabled?: Boolean;
    /**
     * The KMS key ID. Takes the form 1a2a3a4-1a2a-3a4a-5a6a-1a2a3a4a5a6a.
     */
    KmsKeyId?: NonEmptyString;
  }
  export interface AwsElasticsearchDomainLogPublishingOptions {
    /**
     * Configures the OpenSearch index logs publishing.
     */
    IndexSlowLogs?: AwsElasticsearchDomainLogPublishingOptionsLogConfig;
    /**
     * Configures the OpenSearch search slow log publishing.
     */
    SearchSlowLogs?: AwsElasticsearchDomainLogPublishingOptionsLogConfig;
    AuditLogs?: AwsElasticsearchDomainLogPublishingOptionsLogConfig;
  }
  export interface AwsElasticsearchDomainLogPublishingOptionsLogConfig {
    /**
     * The ARN of the CloudWatch Logs group to publish the logs to.
     */
    CloudWatchLogsLogGroupArn?: NonEmptyString;
    /**
     * Whether the log publishing is enabled.
     */
    Enabled?: Boolean;
  }
  export interface AwsElasticsearchDomainNodeToNodeEncryptionOptions {
    /**
     * Whether node-to-node encryption is enabled.
     */
    Enabled?: Boolean;
  }
  export interface AwsElasticsearchDomainServiceSoftwareOptions {
    /**
     * The epoch time when the deployment window closes for required updates. After this time, Amazon OpenSearch Service schedules the software upgrade automatically.
     */
    AutomatedUpdateDate?: NonEmptyString;
    /**
     * Whether a request to update the domain can be canceled.
     */
    Cancellable?: Boolean;
    /**
     * The version of the service software that is currently installed on the domain.
     */
    CurrentVersion?: NonEmptyString;
    /**
     * A more detailed description of the service software status.
     */
    Description?: NonEmptyString;
    /**
     * The most recent version of the service software.
     */
    NewVersion?: NonEmptyString;
    /**
     * Whether a service software update is available for the domain.
     */
    UpdateAvailable?: Boolean;
    /**
     * The status of the service software update.
     */
    UpdateStatus?: NonEmptyString;
  }
  export interface AwsElasticsearchDomainVPCOptions {
    /**
     * The list of Availability Zones associated with the VPC subnets.
     */
    AvailabilityZones?: NonEmptyStringList;
    /**
     * The list of security group IDs associated with the VPC endpoints for the domain.
     */
    SecurityGroupIds?: NonEmptyStringList;
    /**
     * A list of subnet IDs associated with the VPC endpoints for the domain.
     */
    SubnetIds?: NonEmptyStringList;
    /**
     * ID for the VPC.
     */
    VPCId?: NonEmptyString;
  }
  export type AwsElbAppCookieStickinessPolicies = AwsElbAppCookieStickinessPolicy[];
  export interface AwsElbAppCookieStickinessPolicy {
    /**
     * The name of the application cookie used for stickiness.
     */
    CookieName?: NonEmptyString;
    /**
     * The mnemonic name for the policy being created. The name must be unique within the set of policies for the load balancer.
     */
    PolicyName?: NonEmptyString;
  }
  export type AwsElbLbCookieStickinessPolicies = AwsElbLbCookieStickinessPolicy[];
  export interface AwsElbLbCookieStickinessPolicy {
    /**
     * The amount of time, in seconds, after which the cookie is considered stale. If an expiration period is not specified, the stickiness session lasts for the duration of the browser session.
     */
    CookieExpirationPeriod?: Long;
    /**
     * The name of the policy. The name must be unique within the set of policies for the load balancer.
     */
    PolicyName?: NonEmptyString;
  }
  export interface AwsElbLoadBalancerAccessLog {
    /**
     * The interval in minutes for publishing the access logs. You can publish access logs either every 5 minutes or every 60 minutes.
     */
    EmitInterval?: Integer;
    /**
     * Indicates whether access logs are enabled for the load balancer.
     */
    Enabled?: Boolean;
    /**
     * The name of the S3 bucket where the access logs are stored.
     */
    S3BucketName?: NonEmptyString;
    /**
     * The logical hierarchy that was created for the S3 bucket. If a prefix is not provided, the log is placed at the root level of the bucket.
     */
    S3BucketPrefix?: NonEmptyString;
  }
  export interface AwsElbLoadBalancerAttributes {
    /**
     * Information about the access log configuration for the load balancer. If the access log is enabled, the load balancer captures detailed information about all requests. It delivers the information to a specified S3 bucket.
     */
    AccessLog?: AwsElbLoadBalancerAccessLog;
    /**
     * Information about the connection draining configuration for the load balancer. If connection draining is enabled, the load balancer allows existing requests to complete before it shifts traffic away from a deregistered or unhealthy instance.
     */
    ConnectionDraining?: AwsElbLoadBalancerConnectionDraining;
    /**
     * Connection settings for the load balancer. If an idle timeout is configured, the load balancer allows connections to remain idle for the specified duration. When a connection is idle, no data is sent over the connection.
     */
    ConnectionSettings?: AwsElbLoadBalancerConnectionSettings;
    /**
     * Cross-zone load balancing settings for the load balancer. If cross-zone load balancing is enabled, the load balancer routes the request traffic evenly across all instances regardless of the Availability Zones.
     */
    CrossZoneLoadBalancing?: AwsElbLoadBalancerCrossZoneLoadBalancing;
  }
  export interface AwsElbLoadBalancerBackendServerDescription {
    /**
     * The port on which the EC2 instance is listening.
     */
    InstancePort?: Integer;
    /**
     * The names of the policies that are enabled for the EC2 instance.
     */
    PolicyNames?: StringList;
  }
  export type AwsElbLoadBalancerBackendServerDescriptions = AwsElbLoadBalancerBackendServerDescription[];
  export interface AwsElbLoadBalancerConnectionDraining {
    /**
     * Indicates whether connection draining is enabled for the load balancer.
     */
    Enabled?: Boolean;
    /**
     * The maximum time, in seconds, to keep the existing connections open before deregistering the instances.
     */
    Timeout?: Integer;
  }
  export interface AwsElbLoadBalancerConnectionSettings {
    /**
     * The time, in seconds, that the connection can be idle (no data is sent over the connection) before it is closed by the load balancer.
     */
    IdleTimeout?: Integer;
  }
  export interface AwsElbLoadBalancerCrossZoneLoadBalancing {
    /**
     * Indicates whether cross-zone load balancing is enabled for the load balancer.
     */
    Enabled?: Boolean;
  }
  export interface AwsElbLoadBalancerDetails {
    /**
     * The list of Availability Zones for the load balancer.
     */
    AvailabilityZones?: StringList;
    /**
     * Information about the configuration of the EC2 instances.
     */
    BackendServerDescriptions?: AwsElbLoadBalancerBackendServerDescriptions;
    /**
     * The name of the Amazon Route 53 hosted zone for the load balancer.
     */
    CanonicalHostedZoneName?: NonEmptyString;
    /**
     * The ID of the Amazon Route 53 hosted zone for the load balancer.
     */
    CanonicalHostedZoneNameID?: NonEmptyString;
    /**
     * Indicates when the load balancer was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedTime?: NonEmptyString;
    /**
     * The DNS name of the load balancer.
     */
    DnsName?: NonEmptyString;
    /**
     * Information about the health checks that are conducted on the load balancer.
     */
    HealthCheck?: AwsElbLoadBalancerHealthCheck;
    /**
     * List of EC2 instances for the load balancer.
     */
    Instances?: AwsElbLoadBalancerInstances;
    /**
     * The policies that are enabled for the load balancer listeners.
     */
    ListenerDescriptions?: AwsElbLoadBalancerListenerDescriptions;
    /**
     * The attributes for a load balancer.
     */
    LoadBalancerAttributes?: AwsElbLoadBalancerAttributes;
    /**
     * The name of the load balancer.
     */
    LoadBalancerName?: NonEmptyString;
    /**
     * The policies for a load balancer.
     */
    Policies?: AwsElbLoadBalancerPolicies;
    /**
     * The type of load balancer. Only provided if the load balancer is in a VPC. If Scheme is internet-facing, the load balancer has a public DNS name that resolves to a public IP address. If Scheme is internal, the load balancer has a public DNS name that resolves to a private IP address.
     */
    Scheme?: NonEmptyString;
    /**
     * The security groups for the load balancer. Only provided if the load balancer is in a VPC.
     */
    SecurityGroups?: StringList;
    /**
     * Information about the security group for the load balancer. This is the security group that is used for inbound rules.
     */
    SourceSecurityGroup?: AwsElbLoadBalancerSourceSecurityGroup;
    /**
     * The list of subnet identifiers for the load balancer.
     */
    Subnets?: StringList;
    /**
     * The identifier of the VPC for the load balancer.
     */
    VpcId?: NonEmptyString;
  }
  export interface AwsElbLoadBalancerHealthCheck {
    /**
     * The number of consecutive health check successes required before the instance is moved to the Healthy state.
     */
    HealthyThreshold?: Integer;
    /**
     * The approximate interval, in seconds, between health checks of an individual instance.
     */
    Interval?: Integer;
    /**
     * The instance that is being checked. The target specifies the protocol and port. The available protocols are TCP, SSL, HTTP, and HTTPS. The range of valid ports is 1 through 65535. For the HTTP and HTTPS protocols, the target also specifies the ping path. For the TCP protocol, the target is specified as TCP: &lt;port&gt; . For the SSL protocol, the target is specified as SSL.&lt;port&gt; . For the HTTP and HTTPS protocols, the target is specified as  &lt;protocol&gt;:&lt;port&gt;/&lt;path to ping&gt; .
     */
    Target?: NonEmptyString;
    /**
     * The amount of time, in seconds, during which no response means a failed health check.
     */
    Timeout?: Integer;
    /**
     * The number of consecutive health check failures that must occur before the instance is moved to the Unhealthy state.
     */
    UnhealthyThreshold?: Integer;
  }
  export interface AwsElbLoadBalancerInstance {
    /**
     * The instance identifier.
     */
    InstanceId?: NonEmptyString;
  }
  export type AwsElbLoadBalancerInstances = AwsElbLoadBalancerInstance[];
  export interface AwsElbLoadBalancerListener {
    /**
     * The port on which the instance is listening.
     */
    InstancePort?: Integer;
    /**
     * The protocol to use to route traffic to instances. Valid values: HTTP | HTTPS | TCP | SSL 
     */
    InstanceProtocol?: NonEmptyString;
    /**
     * The port on which the load balancer is listening. On EC2-VPC, you can specify any port from the range 1-65535. On EC2-Classic, you can specify any port from the following list: 25, 80, 443, 465, 587, 1024-65535.
     */
    LoadBalancerPort?: Integer;
    /**
     * The load balancer transport protocol to use for routing. Valid values: HTTP | HTTPS | TCP | SSL 
     */
    Protocol?: NonEmptyString;
    /**
     * The ARN of the server certificate.
     */
    SslCertificateId?: NonEmptyString;
  }
  export interface AwsElbLoadBalancerListenerDescription {
    /**
     * Information about the listener.
     */
    Listener?: AwsElbLoadBalancerListener;
    /**
     * The policies enabled for the listener.
     */
    PolicyNames?: StringList;
  }
  export type AwsElbLoadBalancerListenerDescriptions = AwsElbLoadBalancerListenerDescription[];
  export interface AwsElbLoadBalancerPolicies {
    /**
     * The stickiness policies that are created using CreateAppCookieStickinessPolicy.
     */
    AppCookieStickinessPolicies?: AwsElbAppCookieStickinessPolicies;
    /**
     * The stickiness policies that are created using CreateLBCookieStickinessPolicy.
     */
    LbCookieStickinessPolicies?: AwsElbLbCookieStickinessPolicies;
    /**
     * The policies other than the stickiness policies.
     */
    OtherPolicies?: StringList;
  }
  export interface AwsElbLoadBalancerSourceSecurityGroup {
    /**
     * The name of the security group.
     */
    GroupName?: NonEmptyString;
    /**
     * The owner of the security group.
     */
    OwnerAlias?: NonEmptyString;
  }
  export interface AwsElbv2LoadBalancerAttribute {
    /**
     * The name of the load balancer attribute.
     */
    Key?: NonEmptyString;
    /**
     * The value of the load balancer attribute.
     */
    Value?: NonEmptyString;
  }
  export type AwsElbv2LoadBalancerAttributes = AwsElbv2LoadBalancerAttribute[];
  export interface AwsElbv2LoadBalancerDetails {
    /**
     * The Availability Zones for the load balancer.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * The ID of the Amazon Route 53 hosted zone associated with the load balancer.
     */
    CanonicalHostedZoneId?: NonEmptyString;
    /**
     * Indicates when the load balancer was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedTime?: NonEmptyString;
    /**
     * The public DNS name of the load balancer.
     */
    DNSName?: NonEmptyString;
    /**
     * The type of IP addresses used by the subnets for your load balancer. The possible values are ipv4 (for IPv4 addresses) and dualstack (for IPv4 and IPv6 addresses).
     */
    IpAddressType?: NonEmptyString;
    /**
     * The nodes of an Internet-facing load balancer have public IP addresses.
     */
    Scheme?: NonEmptyString;
    /**
     * The IDs of the security groups for the load balancer.
     */
    SecurityGroups?: SecurityGroups;
    /**
     * The state of the load balancer.
     */
    State?: LoadBalancerState;
    /**
     * The type of load balancer.
     */
    Type?: NonEmptyString;
    /**
     * The ID of the VPC for the load balancer.
     */
    VpcId?: NonEmptyString;
    /**
     * Attributes of the load balancer.
     */
    LoadBalancerAttributes?: AwsElbv2LoadBalancerAttributes;
  }
  export interface AwsIamAccessKeyDetails {
    /**
     * The user associated with the IAM access key related to a finding. The UserName parameter has been replaced with the PrincipalName parameter because access keys can also be assigned to principals that are not IAM users.
     */
    UserName?: NonEmptyString;
    /**
     * The status of the IAM access key related to a finding.
     */
    Status?: AwsIamAccessKeyStatus;
    /**
     * Indicates when the IAM access key was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedAt?: NonEmptyString;
    /**
     * The ID of the principal associated with an access key.
     */
    PrincipalId?: NonEmptyString;
    /**
     * The type of principal associated with an access key.
     */
    PrincipalType?: NonEmptyString;
    /**
     * The name of the principal.
     */
    PrincipalName?: NonEmptyString;
    /**
     * The Amazon Web Services account ID of the account for the key.
     */
    AccountId?: NonEmptyString;
    /**
     * The identifier of the access key.
     */
    AccessKeyId?: NonEmptyString;
    /**
     * Information about the session that the key was used for.
     */
    SessionContext?: AwsIamAccessKeySessionContext;
  }
  export interface AwsIamAccessKeySessionContext {
    /**
     * Attributes of the session that the key was used for.
     */
    Attributes?: AwsIamAccessKeySessionContextAttributes;
    /**
     * Information about the entity that created the session.
     */
    SessionIssuer?: AwsIamAccessKeySessionContextSessionIssuer;
  }
  export interface AwsIamAccessKeySessionContextAttributes {
    /**
     * Indicates whether the session used multi-factor authentication (MFA).
     */
    MfaAuthenticated?: Boolean;
    /**
     * Indicates when the session was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreationDate?: NonEmptyString;
  }
  export interface AwsIamAccessKeySessionContextSessionIssuer {
    /**
     * The type of principal (user, role, or group) that created the session.
     */
    Type?: NonEmptyString;
    /**
     * The principal ID of the principal (user, role, or group) that created the session.
     */
    PrincipalId?: NonEmptyString;
    /**
     * The ARN of the session.
     */
    Arn?: NonEmptyString;
    /**
     * The identifier of the Amazon Web Services account that created the session.
     */
    AccountId?: NonEmptyString;
    /**
     * The name of the principal that created the session.
     */
    UserName?: NonEmptyString;
  }
  export type AwsIamAccessKeyStatus = "Active"|"Inactive"|string;
  export interface AwsIamAttachedManagedPolicy {
    /**
     * The name of the policy.
     */
    PolicyName?: NonEmptyString;
    /**
     * The ARN of the policy.
     */
    PolicyArn?: NonEmptyString;
  }
  export type AwsIamAttachedManagedPolicyList = AwsIamAttachedManagedPolicy[];
  export interface AwsIamGroupDetails {
    /**
     * A list of the managed policies that are attached to the IAM group.
     */
    AttachedManagedPolicies?: AwsIamAttachedManagedPolicyList;
    /**
     * Indicates when the IAM group was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreateDate?: NonEmptyString;
    /**
     * The identifier of the IAM group.
     */
    GroupId?: NonEmptyString;
    /**
     * The name of the IAM group.
     */
    GroupName?: NonEmptyString;
    /**
     * The list of inline policies that are embedded in the group.
     */
    GroupPolicyList?: AwsIamGroupPolicyList;
    /**
     * The path to the group.
     */
    Path?: NonEmptyString;
  }
  export interface AwsIamGroupPolicy {
    /**
     * The name of the policy.
     */
    PolicyName?: NonEmptyString;
  }
  export type AwsIamGroupPolicyList = AwsIamGroupPolicy[];
  export interface AwsIamInstanceProfile {
    /**
     * The ARN of the instance profile.
     */
    Arn?: NonEmptyString;
    /**
     * Indicates when the instance profile was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreateDate?: NonEmptyString;
    /**
     * The identifier of the instance profile.
     */
    InstanceProfileId?: NonEmptyString;
    /**
     * The name of the instance profile.
     */
    InstanceProfileName?: NonEmptyString;
    /**
     * The path to the instance profile.
     */
    Path?: NonEmptyString;
    /**
     * The roles associated with the instance profile.
     */
    Roles?: AwsIamInstanceProfileRoles;
  }
  export type AwsIamInstanceProfileList = AwsIamInstanceProfile[];
  export interface AwsIamInstanceProfileRole {
    /**
     * The ARN of the role.
     */
    Arn?: NonEmptyString;
    /**
     * The policy that grants an entity permission to assume the role.
     */
    AssumeRolePolicyDocument?: AwsIamRoleAssumeRolePolicyDocument;
    /**
     * Indicates when the role was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreateDate?: NonEmptyString;
    /**
     * The path to the role.
     */
    Path?: NonEmptyString;
    /**
     * The identifier of the role.
     */
    RoleId?: NonEmptyString;
    /**
     * The name of the role.
     */
    RoleName?: NonEmptyString;
  }
  export type AwsIamInstanceProfileRoles = AwsIamInstanceProfileRole[];
  export interface AwsIamPermissionsBoundary {
    /**
     * The ARN of the policy used to set the permissions boundary.
     */
    PermissionsBoundaryArn?: NonEmptyString;
    /**
     * The usage type for the permissions boundary.
     */
    PermissionsBoundaryType?: NonEmptyString;
  }
  export interface AwsIamPolicyDetails {
    /**
     * The number of users, groups, and roles that the policy is attached to.
     */
    AttachmentCount?: Integer;
    /**
     * When the policy was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreateDate?: NonEmptyString;
    /**
     * The identifier of the default version of the policy.
     */
    DefaultVersionId?: NonEmptyString;
    /**
     * A description of the policy.
     */
    Description?: NonEmptyString;
    /**
     * Whether the policy can be attached to a user, group, or role.
     */
    IsAttachable?: Boolean;
    /**
     * The path to the policy.
     */
    Path?: NonEmptyString;
    /**
     * The number of users and roles that use the policy to set the permissions boundary.
     */
    PermissionsBoundaryUsageCount?: Integer;
    /**
     * The unique identifier of the policy.
     */
    PolicyId?: NonEmptyString;
    /**
     * The name of the policy.
     */
    PolicyName?: NonEmptyString;
    /**
     * List of versions of the policy.
     */
    PolicyVersionList?: AwsIamPolicyVersionList;
    /**
     * When the policy was most recently updated. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    UpdateDate?: NonEmptyString;
  }
  export interface AwsIamPolicyVersion {
    /**
     * The identifier of the policy version.
     */
    VersionId?: NonEmptyString;
    /**
     * Whether the version is the default version.
     */
    IsDefaultVersion?: Boolean;
    /**
     * Indicates when the version was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreateDate?: NonEmptyString;
  }
  export type AwsIamPolicyVersionList = AwsIamPolicyVersion[];
  export type AwsIamRoleAssumeRolePolicyDocument = string;
  export interface AwsIamRoleDetails {
    /**
     * The trust policy that grants permission to assume the role.
     */
    AssumeRolePolicyDocument?: AwsIamRoleAssumeRolePolicyDocument;
    /**
     * The list of the managed policies that are attached to the role.
     */
    AttachedManagedPolicies?: AwsIamAttachedManagedPolicyList;
    /**
     * Indicates when the role was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreateDate?: NonEmptyString;
    /**
     * The list of instance profiles that contain this role.
     */
    InstanceProfileList?: AwsIamInstanceProfileList;
    PermissionsBoundary?: AwsIamPermissionsBoundary;
    /**
     * The stable and unique string identifying the role.
     */
    RoleId?: NonEmptyString;
    /**
     * The friendly name that identifies the role.
     */
    RoleName?: NonEmptyString;
    /**
     * The list of inline policies that are embedded in the role.
     */
    RolePolicyList?: AwsIamRolePolicyList;
    /**
     * The maximum session duration (in seconds) that you want to set for the specified role.
     */
    MaxSessionDuration?: Integer;
    /**
     * The path to the role.
     */
    Path?: NonEmptyString;
  }
  export interface AwsIamRolePolicy {
    /**
     * The name of the policy.
     */
    PolicyName?: NonEmptyString;
  }
  export type AwsIamRolePolicyList = AwsIamRolePolicy[];
  export interface AwsIamUserDetails {
    /**
     * A list of the managed policies that are attached to the user.
     */
    AttachedManagedPolicies?: AwsIamAttachedManagedPolicyList;
    /**
     * Indicates when the user was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreateDate?: NonEmptyString;
    /**
     * A list of IAM groups that the user belongs to.
     */
    GroupList?: StringList;
    /**
     * The path to the user.
     */
    Path?: NonEmptyString;
    /**
     * The permissions boundary for the user.
     */
    PermissionsBoundary?: AwsIamPermissionsBoundary;
    /**
     * The unique identifier for the user.
     */
    UserId?: NonEmptyString;
    /**
     * The name of the user.
     */
    UserName?: NonEmptyString;
    /**
     * The list of inline policies that are embedded in the user.
     */
    UserPolicyList?: AwsIamUserPolicyList;
  }
  export interface AwsIamUserPolicy {
    /**
     * The name of the policy.
     */
    PolicyName?: NonEmptyString;
  }
  export type AwsIamUserPolicyList = AwsIamUserPolicy[];
  export interface AwsKmsKeyDetails {
    /**
     * The twelve-digit account ID of the Amazon Web Services account that owns the KMS key.
     */
    AWSAccountId?: NonEmptyString;
    /**
     * Indicates when the KMS key was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreationDate?: Double;
    /**
     * The globally unique identifier for the KMS key.
     */
    KeyId?: NonEmptyString;
    /**
     * The manager of the KMS key. KMS keys in your Amazon Web Services account are either customer managed or Amazon Web Services managed.
     */
    KeyManager?: NonEmptyString;
    /**
     * The state of the KMS key.
     */
    KeyState?: NonEmptyString;
    /**
     * The source of the KMS key material. When this value is AWS_KMS, KMS created the key material. When this value is EXTERNAL, the key material was imported from your existing key management infrastructure or the KMS key lacks key material. When this value is AWS_CLOUDHSM, the key material was created in the CloudHSM cluster associated with a custom key store.
     */
    Origin?: NonEmptyString;
    /**
     * A description of the key.
     */
    Description?: NonEmptyString;
    /**
     * Whether the key has key rotation enabled.
     */
    KeyRotationStatus?: Boolean;
  }
  export interface AwsLambdaFunctionCode {
    /**
     * An Amazon S3 bucket in the same Amazon Web Services Region as your function. The bucket can be in a different Amazon Web Services account.
     */
    S3Bucket?: NonEmptyString;
    /**
     * The Amazon S3 key of the deployment package.
     */
    S3Key?: NonEmptyString;
    /**
     * For versioned objects, the version of the deployment package object to use.
     */
    S3ObjectVersion?: NonEmptyString;
    /**
     * The base64-encoded contents of the deployment package. Amazon Web Services SDK and Amazon Web Services CLI clients handle the encoding for you.
     */
    ZipFile?: NonEmptyString;
  }
  export interface AwsLambdaFunctionDeadLetterConfig {
    /**
     * The ARN of an SQS queue or SNS topic.
     */
    TargetArn?: NonEmptyString;
  }
  export interface AwsLambdaFunctionDetails {
    /**
     * An AwsLambdaFunctionCode object.
     */
    Code?: AwsLambdaFunctionCode;
    /**
     * The SHA256 hash of the function's deployment package.
     */
    CodeSha256?: NonEmptyString;
    /**
     * The function's dead letter queue.
     */
    DeadLetterConfig?: AwsLambdaFunctionDeadLetterConfig;
    /**
     * The function's environment variables.
     */
    Environment?: AwsLambdaFunctionEnvironment;
    /**
     * The name of the function.
     */
    FunctionName?: NonEmptyString;
    /**
     * The function that Lambda calls to begin executing your function.
     */
    Handler?: NonEmptyString;
    /**
     * The KMS key that is used to encrypt the function's environment variables. This key is only returned if you've configured a customer managed customer managed key.
     */
    KmsKeyArn?: NonEmptyString;
    /**
     * Indicates when the function was last updated. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LastModified?: NonEmptyString;
    /**
     * The function's layers.
     */
    Layers?: AwsLambdaFunctionLayerList;
    /**
     * For Lambda@Edge functions, the ARN of the master function.
     */
    MasterArn?: NonEmptyString;
    /**
     * The memory that is allocated to the function.
     */
    MemorySize?: Integer;
    /**
     * The latest updated revision of the function or alias.
     */
    RevisionId?: NonEmptyString;
    /**
     * The function's execution role.
     */
    Role?: NonEmptyString;
    /**
     * The runtime environment for the Lambda function.
     */
    Runtime?: NonEmptyString;
    /**
     * The amount of time that Lambda allows a function to run before stopping it.
     */
    Timeout?: Integer;
    /**
     * The function's X-Ray tracing configuration.
     */
    TracingConfig?: AwsLambdaFunctionTracingConfig;
    /**
     * The function's networking configuration.
     */
    VpcConfig?: AwsLambdaFunctionVpcConfig;
    /**
     * The version of the Lambda function.
     */
    Version?: NonEmptyString;
  }
  export interface AwsLambdaFunctionEnvironment {
    /**
     * Environment variable key-value pairs.
     */
    Variables?: FieldMap;
    /**
     * An AwsLambdaFunctionEnvironmentError object.
     */
    Error?: AwsLambdaFunctionEnvironmentError;
  }
  export interface AwsLambdaFunctionEnvironmentError {
    /**
     * The error code.
     */
    ErrorCode?: NonEmptyString;
    /**
     * The error message.
     */
    Message?: NonEmptyString;
  }
  export interface AwsLambdaFunctionLayer {
    /**
     * The ARN of the function layer.
     */
    Arn?: NonEmptyString;
    /**
     * The size of the layer archive in bytes.
     */
    CodeSize?: Integer;
  }
  export type AwsLambdaFunctionLayerList = AwsLambdaFunctionLayer[];
  export interface AwsLambdaFunctionTracingConfig {
    /**
     * The tracing mode.
     */
    Mode?: NonEmptyString;
  }
  export interface AwsLambdaFunctionVpcConfig {
    /**
     * A list of VPC security groups IDs.
     */
    SecurityGroupIds?: NonEmptyStringList;
    /**
     * A list of VPC subnet IDs.
     */
    SubnetIds?: NonEmptyStringList;
    /**
     * The ID of the VPC.
     */
    VpcId?: NonEmptyString;
  }
  export interface AwsLambdaLayerVersionDetails {
    /**
     * The version number.
     */
    Version?: AwsLambdaLayerVersionNumber;
    /**
     * The layer's compatible runtimes. Maximum number of five items. Valid values: nodejs10.x | nodejs12.x | java8 | java11 | python2.7 | python3.6 | python3.7 | python3.8 | dotnetcore1.0 | dotnetcore2.1 | go1.x | ruby2.5 | provided 
     */
    CompatibleRuntimes?: NonEmptyStringList;
    /**
     * Indicates when the version was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedDate?: NonEmptyString;
  }
  export type AwsLambdaLayerVersionNumber = number;
  export interface AwsOpenSearchServiceDomainClusterConfigDetails {
    /**
     * The number of data nodes to use in the OpenSearch domain.
     */
    InstanceCount?: Integer;
    /**
     * Whether UltraWarm is enabled.
     */
    WarmEnabled?: Boolean;
    /**
     * The number of UltraWarm instances.
     */
    WarmCount?: Integer;
    /**
     * Whether to use a dedicated master node for the OpenSearch domain. A dedicated master node performs cluster management tasks, but does not hold data or respond to data upload requests.
     */
    DedicatedMasterEnabled?: Boolean;
    /**
     * Configuration options for zone awareness. Provided if ZoneAwarenessEnabled is true.
     */
    ZoneAwarenessConfig?: AwsOpenSearchServiceDomainClusterConfigZoneAwarenessConfigDetails;
    /**
     * The number of instances to use for the master node. If this attribute is specified, then DedicatedMasterEnabled must be true.
     */
    DedicatedMasterCount?: Integer;
    /**
     * The instance type for your data nodes. 
     */
    InstanceType?: NonEmptyString;
    /**
     * The type of UltraWarm instance.
     */
    WarmType?: NonEmptyString;
    /**
     * Whether to enable zone awareness for the OpenSearch domain. When zone awareness is enabled, OpenSearch Service allocates the cluster's nodes and replica index shards across Availability Zones (AZs) in the same Region. This prevents data loss and minimizes downtime if a node or data center fails.
     */
    ZoneAwarenessEnabled?: Boolean;
    /**
     * The hardware configuration of the computer that hosts the dedicated master node. If this attribute is specified, then DedicatedMasterEnabled must be true. 
     */
    DedicatedMasterType?: NonEmptyString;
  }
  export interface AwsOpenSearchServiceDomainClusterConfigZoneAwarenessConfigDetails {
    /**
     * The number of Availability Zones that the domain uses. Valid values are 2 and 3. The default is 2.
     */
    AvailabilityZoneCount?: Integer;
  }
  export interface AwsOpenSearchServiceDomainDetails {
    /**
     * The ARN of the OpenSearch Service domain.
     */
    Arn?: NonEmptyString;
    /**
     * IAM policy document that specifies the access policies for the OpenSearch Service domain.
     */
    AccessPolicies?: NonEmptyString;
    /**
     * The name of the endpoint.
     */
    DomainName?: NonEmptyString;
    /**
     * The identifier of the domain.
     */
    Id?: NonEmptyString;
    /**
     * The domain endpoint.
     */
    DomainEndpoint?: NonEmptyString;
    /**
     * The version of the domain engine.
     */
    EngineVersion?: NonEmptyString;
    /**
     * Details about the configuration for encryption at rest.
     */
    EncryptionAtRestOptions?: AwsOpenSearchServiceDomainEncryptionAtRestOptionsDetails;
    /**
     * Details about the configuration for node-to-node encryption.
     */
    NodeToNodeEncryptionOptions?: AwsOpenSearchServiceDomainNodeToNodeEncryptionOptionsDetails;
    /**
     * Information about the status of a domain relative to the latest service software.
     */
    ServiceSoftwareOptions?: AwsOpenSearchServiceDomainServiceSoftwareOptionsDetails;
    /**
     * Details about the configuration of an OpenSearch cluster.
     */
    ClusterConfig?: AwsOpenSearchServiceDomainClusterConfigDetails;
    /**
     * Additional options for the domain endpoint.
     */
    DomainEndpointOptions?: AwsOpenSearchServiceDomainDomainEndpointOptionsDetails;
    /**
     * Information that OpenSearch Service derives based on VPCOptions for the domain.
     */
    VpcOptions?: AwsOpenSearchServiceDomainVpcOptionsDetails;
    /**
     * Configures the CloudWatch Logs to publish for the OpenSearch domain.
     */
    LogPublishingOptions?: AwsOpenSearchServiceDomainLogPublishingOptionsDetails;
    /**
     * The domain endpoints. Used if the OpenSearch domain resides in a VPC. This is a map of key-value pairs. The key is always vpc. The value is the endpoint.
     */
    DomainEndpoints?: FieldMap;
  }
  export interface AwsOpenSearchServiceDomainDomainEndpointOptionsDetails {
    /**
     * The ARN for the security certificate. The certificate is managed in ACM.
     */
    CustomEndpointCertificateArn?: NonEmptyString;
    /**
     * Whether to enable a custom endpoint for the domain.
     */
    CustomEndpointEnabled?: Boolean;
    /**
     * Whether to require that all traffic to the domain arrive over HTTPS.
     */
    EnforceHTTPS?: Boolean;
    /**
     * The fully qualified URL for the custom endpoint.
     */
    CustomEndpoint?: NonEmptyString;
    /**
     * The TLS security policy to apply to the HTTPS endpoint of the OpenSearch domain.
     */
    TLSSecurityPolicy?: NonEmptyString;
  }
  export interface AwsOpenSearchServiceDomainEncryptionAtRestOptionsDetails {
    /**
     * Whether encryption at rest is enabled.
     */
    Enabled?: Boolean;
    /**
     * The KMS key ID.
     */
    KmsKeyId?: NonEmptyString;
  }
  export interface AwsOpenSearchServiceDomainLogPublishingOption {
    /**
     * The ARN of the CloudWatch Logs group to publish the logs to.
     */
    CloudWatchLogsLogGroupArn?: NonEmptyString;
    /**
     * Whether the log publishing is enabled.
     */
    Enabled?: Boolean;
  }
  export interface AwsOpenSearchServiceDomainLogPublishingOptionsDetails {
    /**
     * Configures the OpenSearch index logs publishing.
     */
    IndexSlowLogs?: AwsOpenSearchServiceDomainLogPublishingOption;
    /**
     * Configures the OpenSearch search slow log publishing.
     */
    SearchSlowLogs?: AwsOpenSearchServiceDomainLogPublishingOption;
    /**
     * Configures the OpenSearch audit logs publishing.
     */
    AuditLogs?: AwsOpenSearchServiceDomainLogPublishingOption;
  }
  export interface AwsOpenSearchServiceDomainNodeToNodeEncryptionOptionsDetails {
    /**
     * Whether node-to-node encryption is enabled.
     */
    Enabled?: Boolean;
  }
  export interface AwsOpenSearchServiceDomainServiceSoftwareOptionsDetails {
    /**
     * The epoch time when the deployment window closes for required updates. After this time, OpenSearch Service schedules the software upgrade automatically.
     */
    AutomatedUpdateDate?: NonEmptyString;
    /**
     * Whether a request to update the domain can be canceled.
     */
    Cancellable?: Boolean;
    /**
     * The version of the service software that is currently installed on the domain.
     */
    CurrentVersion?: NonEmptyString;
    /**
     * A more detailed description of the service software status.
     */
    Description?: NonEmptyString;
    /**
     * The most recent version of the service software.
     */
    NewVersion?: NonEmptyString;
    /**
     * Whether a service software update is available for the domain.
     */
    UpdateAvailable?: Boolean;
    /**
     * The status of the service software update.
     */
    UpdateStatus?: NonEmptyString;
    /**
     * Whether the service software update is optional.
     */
    OptionalDeployment?: Boolean;
  }
  export interface AwsOpenSearchServiceDomainVpcOptionsDetails {
    /**
     * The list of security group IDs that are associated with the VPC endpoints for the domain.
     */
    SecurityGroupIds?: NonEmptyStringList;
    /**
     * A list of subnet IDs that are associated with the VPC endpoints for the domain.
     */
    SubnetIds?: NonEmptyStringList;
  }
  export interface AwsRdsDbClusterAssociatedRole {
    /**
     * The ARN of the IAM role.
     */
    RoleArn?: NonEmptyString;
    /**
     * The status of the association between the IAM role and the DB cluster.
     */
    Status?: NonEmptyString;
  }
  export type AwsRdsDbClusterAssociatedRoles = AwsRdsDbClusterAssociatedRole[];
  export interface AwsRdsDbClusterDetails {
    /**
     * For all database engines except Aurora, specifies the allocated storage size in gibibytes (GiB).
     */
    AllocatedStorage?: Integer;
    /**
     * A list of Availability Zones (AZs) where instances in the DB cluster can be created.
     */
    AvailabilityZones?: StringList;
    /**
     * The number of days for which automated backups are retained.
     */
    BackupRetentionPeriod?: Integer;
    /**
     * The name of the database.
     */
    DatabaseName?: NonEmptyString;
    /**
     * The current status of this DB cluster.
     */
    Status?: NonEmptyString;
    /**
     * The connection endpoint for the primary instance of the DB cluster.
     */
    Endpoint?: NonEmptyString;
    /**
     * The reader endpoint for the DB cluster.
     */
    ReaderEndpoint?: NonEmptyString;
    /**
     * A list of custom endpoints for the DB cluster.
     */
    CustomEndpoints?: StringList;
    /**
     * Whether the DB cluster has instances in multiple Availability Zones.
     */
    MultiAz?: Boolean;
    /**
     * The name of the database engine to use for this DB cluster.
     */
    Engine?: NonEmptyString;
    /**
     * The version number of the database engine to use.
     */
    EngineVersion?: NonEmptyString;
    /**
     * The port number on which the DB instances in the DB cluster accept connections.
     */
    Port?: Integer;
    /**
     * The name of the master user for the DB cluster.
     */
    MasterUsername?: NonEmptyString;
    /**
     * The range of time each day when automated backups are created, if automated backups are enabled. Uses the format HH:MM-HH:MM. For example, 04:52-05:22.
     */
    PreferredBackupWindow?: NonEmptyString;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC). Uses the format &lt;day&gt;:HH:MM-&lt;day&gt;:HH:MM. For the day values, use mon|tue|wed|thu|fri|sat|sun. For example, sun:09:32-sun:10:02.
     */
    PreferredMaintenanceWindow?: NonEmptyString;
    /**
     * The identifiers of the read replicas that are associated with this DB cluster.
     */
    ReadReplicaIdentifiers?: StringList;
    /**
     * A list of VPC security groups that the DB cluster belongs to.
     */
    VpcSecurityGroups?: AwsRdsDbInstanceVpcSecurityGroups;
    /**
     * Specifies the identifier that Amazon Route 53 assigns when you create a hosted zone.
     */
    HostedZoneId?: NonEmptyString;
    /**
     * Whether the DB cluster is encrypted.
     */
    StorageEncrypted?: Boolean;
    /**
     * The ARN of the KMS master key that is used to encrypt the database instances in the DB cluster.
     */
    KmsKeyId?: NonEmptyString;
    /**
     * The identifier of the DB cluster. The identifier must be unique within each Amazon Web Services Region and is immutable.
     */
    DbClusterResourceId?: NonEmptyString;
    /**
     * A list of the IAM roles that are associated with the DB cluster.
     */
    AssociatedRoles?: AwsRdsDbClusterAssociatedRoles;
    /**
     * Indicates when the DB cluster was created, in Universal Coordinated Time (UTC). Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    ClusterCreateTime?: NonEmptyString;
    /**
     * A list of log types that this DB cluster is configured to export to CloudWatch Logs.
     */
    EnabledCloudWatchLogsExports?: StringList;
    /**
     * The database engine mode of the DB cluster.
     */
    EngineMode?: NonEmptyString;
    /**
     * Whether the DB cluster has deletion protection enabled.
     */
    DeletionProtection?: Boolean;
    /**
     * Whether the HTTP endpoint for an Aurora Serverless DB cluster is enabled.
     */
    HttpEndpointEnabled?: Boolean;
    /**
     * The status of the database activity stream.
     */
    ActivityStreamStatus?: NonEmptyString;
    /**
     * Whether tags are copied from the DB cluster to snapshots of the DB cluster.
     */
    CopyTagsToSnapshot?: Boolean;
    /**
     * Whether the DB cluster is a clone of a DB cluster owned by a different Amazon Web Services account.
     */
    CrossAccountClone?: Boolean;
    /**
     * The Active Directory domain membership records that are associated with the DB cluster.
     */
    DomainMemberships?: AwsRdsDbDomainMemberships;
    /**
     * The name of the DB cluster parameter group for the DB cluster.
     */
    DbClusterParameterGroup?: NonEmptyString;
    /**
     * The subnet group that is associated with the DB cluster, including the name, description, and subnets in the subnet group.
     */
    DbSubnetGroup?: NonEmptyString;
    /**
     * The list of option group memberships for this DB cluster.
     */
    DbClusterOptionGroupMemberships?: AwsRdsDbClusterOptionGroupMemberships;
    /**
     * The DB cluster identifier that the user assigned to the cluster. This identifier is the unique key that identifies a DB cluster.
     */
    DbClusterIdentifier?: NonEmptyString;
    /**
     * The list of instances that make up the DB cluster.
     */
    DbClusterMembers?: AwsRdsDbClusterMembers;
    /**
     * Whether the mapping of IAM accounts to database accounts is enabled.
     */
    IamDatabaseAuthenticationEnabled?: Boolean;
  }
  export interface AwsRdsDbClusterMember {
    /**
     * Whether the cluster member is the primary instance for the DB cluster.
     */
    IsClusterWriter?: Boolean;
    /**
     * Specifies the order in which an Aurora replica is promoted to the primary instance when the existing primary instance fails.
     */
    PromotionTier?: Integer;
    /**
     * The instance identifier for this member of the DB cluster.
     */
    DbInstanceIdentifier?: NonEmptyString;
    /**
     * The status of the DB cluster parameter group for this member of the DB cluster.
     */
    DbClusterParameterGroupStatus?: NonEmptyString;
  }
  export type AwsRdsDbClusterMembers = AwsRdsDbClusterMember[];
  export interface AwsRdsDbClusterOptionGroupMembership {
    /**
     * The name of the DB cluster option group.
     */
    DbClusterOptionGroupName?: NonEmptyString;
    /**
     * The status of the DB cluster option group.
     */
    Status?: NonEmptyString;
  }
  export type AwsRdsDbClusterOptionGroupMemberships = AwsRdsDbClusterOptionGroupMembership[];
  export interface AwsRdsDbClusterSnapshotDetails {
    /**
     * A list of Availability Zones where instances in the DB cluster can be created.
     */
    AvailabilityZones?: StringList;
    /**
     * Indicates when the snapshot was taken. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    SnapshotCreateTime?: NonEmptyString;
    /**
     * The name of the database engine that you want to use for this DB instance.
     */
    Engine?: NonEmptyString;
    /**
     * Specifies the allocated storage size in gibibytes (GiB).
     */
    AllocatedStorage?: Integer;
    /**
     * The status of this DB cluster snapshot.
     */
    Status?: NonEmptyString;
    /**
     * The port number on which the DB instances in the DB cluster accept connections.
     */
    Port?: Integer;
    /**
     * The VPC ID that is associated with the DB cluster snapshot.
     */
    VpcId?: NonEmptyString;
    /**
     * Indicates when the DB cluster was created, in Universal Coordinated Time (UTC). Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    ClusterCreateTime?: NonEmptyString;
    /**
     * The name of the master user for the DB cluster.
     */
    MasterUsername?: NonEmptyString;
    /**
     * The version of the database engine to use.
     */
    EngineVersion?: NonEmptyString;
    /**
     * The license model information for this DB cluster snapshot.
     */
    LicenseModel?: NonEmptyString;
    /**
     * The type of DB cluster snapshot.
     */
    SnapshotType?: NonEmptyString;
    /**
     * Specifies the percentage of the estimated data that has been transferred.
     */
    PercentProgress?: Integer;
    /**
     * Whether the DB cluster is encrypted.
     */
    StorageEncrypted?: Boolean;
    /**
     * The ARN of the KMS master key that is used to encrypt the database instances in the DB cluster.
     */
    KmsKeyId?: NonEmptyString;
    /**
     * The DB cluster identifier.
     */
    DbClusterIdentifier?: NonEmptyString;
    /**
     * The identifier of the DB cluster snapshot.
     */
    DbClusterSnapshotIdentifier?: NonEmptyString;
    /**
     * Whether mapping of IAM accounts to database accounts is enabled.
     */
    IamDatabaseAuthenticationEnabled?: Boolean;
  }
  export interface AwsRdsDbDomainMembership {
    /**
     * The identifier of the Active Directory domain.
     */
    Domain?: NonEmptyString;
    /**
     * The status of the Active Directory Domain membership for the DB instance.
     */
    Status?: NonEmptyString;
    /**
     * The fully qualified domain name of the Active Directory domain.
     */
    Fqdn?: NonEmptyString;
    /**
     * The name of the IAM role to use when making API calls to the Directory Service.
     */
    IamRoleName?: NonEmptyString;
  }
  export type AwsRdsDbDomainMemberships = AwsRdsDbDomainMembership[];
  export interface AwsRdsDbInstanceAssociatedRole {
    /**
     * The ARN of the IAM role that is associated with the DB instance.
     */
    RoleArn?: NonEmptyString;
    /**
     * The name of the feature associated with the IAM role.
     */
    FeatureName?: NonEmptyString;
    /**
     * Describes the state of the association between the IAM role and the DB instance. The Status property returns one of the following values:    ACTIVE - The IAM role ARN is associated with the DB instance and can be used to access other Amazon Web Services services on your behalf.    PENDING - The IAM role ARN is being associated with the DB instance.    INVALID - The IAM role ARN is associated with the DB instance. But the DB instance is unable to assume the IAM role in order to access other Amazon Web Services services on your behalf.   
     */
    Status?: NonEmptyString;
  }
  export type AwsRdsDbInstanceAssociatedRoles = AwsRdsDbInstanceAssociatedRole[];
  export interface AwsRdsDbInstanceDetails {
    /**
     * The IAM roles associated with the DB instance.
     */
    AssociatedRoles?: AwsRdsDbInstanceAssociatedRoles;
    /**
     * The identifier of the CA certificate for this DB instance.
     */
    CACertificateIdentifier?: NonEmptyString;
    /**
     * If the DB instance is a member of a DB cluster, contains the name of the DB cluster that the DB instance is a member of.
     */
    DBClusterIdentifier?: NonEmptyString;
    /**
     * Contains a user-supplied database identifier. This identifier is the unique key that identifies a DB instance.
     */
    DBInstanceIdentifier?: NonEmptyString;
    /**
     * Contains the name of the compute and memory capacity class of the DB instance.
     */
    DBInstanceClass?: NonEmptyString;
    /**
     * Specifies the port that the DB instance listens on. If the DB instance is part of a DB cluster, this can be a different port than the DB cluster port.
     */
    DbInstancePort?: Integer;
    /**
     * The Amazon Web Services Region-unique, immutable identifier for the DB instance. This identifier is found in CloudTrail log entries whenever the KMS key for the DB instance is accessed. 
     */
    DbiResourceId?: NonEmptyString;
    /**
     * The meaning of this parameter differs according to the database engine you use.  MySQL, MariaDB, SQL Server, PostgreSQL  Contains the name of the initial database of this instance that was provided at create time, if one was specified when the DB instance was created. This same name is returned for the life of the DB instance.  Oracle  Contains the Oracle System ID (SID) of the created DB instance. Not shown when the returned parameters do not apply to an Oracle DB instance. 
     */
    DBName?: NonEmptyString;
    /**
     * Indicates whether the DB instance has deletion protection enabled. When deletion protection is enabled, the database cannot be deleted.
     */
    DeletionProtection?: Boolean;
    /**
     * Specifies the connection endpoint.
     */
    Endpoint?: AwsRdsDbInstanceEndpoint;
    /**
     * Provides the name of the database engine to use for this DB instance.
     */
    Engine?: NonEmptyString;
    /**
     * Indicates the database engine version.
     */
    EngineVersion?: NonEmptyString;
    /**
     * True if mapping of IAM accounts to database accounts is enabled, and otherwise false. IAM database authentication can be enabled for the following database engines.   For MySQL 5.6, minor version 5.6.34 or higher   For MySQL 5.7, minor version 5.7.16 or higher   Aurora 5.6 or higher  
     */
    IAMDatabaseAuthenticationEnabled?: Boolean;
    /**
     * Indicates when the DB instance was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    InstanceCreateTime?: NonEmptyString;
    /**
     * If StorageEncrypted is true, the KMS key identifier for the encrypted DB instance.
     */
    KmsKeyId?: NonEmptyString;
    /**
     * Specifies the accessibility options for the DB instance. A value of true specifies an Internet-facing instance with a publicly resolvable DNS name, which resolves to a public IP address. A value of false specifies an internal instance with a DNS name that resolves to a private IP address. 
     */
    PubliclyAccessible?: Boolean;
    /**
     * Specifies whether the DB instance is encrypted.
     */
    StorageEncrypted?: Boolean;
    /**
     * The ARN from the key store with which the instance is associated for TDE encryption.
     */
    TdeCredentialArn?: NonEmptyString;
    /**
     * A list of VPC security groups that the DB instance belongs to.
     */
    VpcSecurityGroups?: AwsRdsDbInstanceVpcSecurityGroups;
    /**
     * Whether the DB instance is a multiple Availability Zone deployment.
     */
    MultiAz?: Boolean;
    /**
     * The ARN of the CloudWatch Logs log stream that receives the enhanced monitoring metrics data for the DB instance.
     */
    EnhancedMonitoringResourceArn?: NonEmptyString;
    /**
     * The current status of the DB instance.
     */
    DbInstanceStatus?: NonEmptyString;
    /**
     * The master user name of the DB instance.
     */
    MasterUsername?: NonEmptyString;
    /**
     * The amount of storage (in gigabytes) to initially allocate for the DB instance.
     */
    AllocatedStorage?: Integer;
    /**
     * The range of time each day when automated backups are created, if automated backups are enabled. Uses the format HH:MM-HH:MM. For example, 04:52-05:22.
     */
    PreferredBackupWindow?: NonEmptyString;
    /**
     * The number of days for which to retain automated backups.
     */
    BackupRetentionPeriod?: Integer;
    /**
     * A list of the DB security groups to assign to the DB instance.
     */
    DbSecurityGroups?: StringList;
    /**
     * A list of the DB parameter groups to assign to the DB instance.
     */
    DbParameterGroups?: AwsRdsDbParameterGroups;
    /**
     * The Availability Zone where the DB instance will be created.
     */
    AvailabilityZone?: NonEmptyString;
    /**
     * Information about the subnet group that is associated with the DB instance.
     */
    DbSubnetGroup?: AwsRdsDbSubnetGroup;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC). Uses the format &lt;day&gt;:HH:MM-&lt;day&gt;:HH:MM. For the day values, use mon|tue|wed|thu|fri|sat|sun. For example, sun:09:32-sun:10:02.
     */
    PreferredMaintenanceWindow?: NonEmptyString;
    /**
     * Changes to the DB instance that are currently pending.
     */
    PendingModifiedValues?: AwsRdsDbPendingModifiedValues;
    /**
     * Specifies the latest time to which a database can be restored with point-in-time restore. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LatestRestorableTime?: NonEmptyString;
    /**
     * Indicates whether minor version patches are applied automatically.
     */
    AutoMinorVersionUpgrade?: Boolean;
    /**
     * If this DB instance is a read replica, contains the identifier of the source DB instance.
     */
    ReadReplicaSourceDBInstanceIdentifier?: NonEmptyString;
    /**
     * List of identifiers of the read replicas associated with this DB instance.
     */
    ReadReplicaDBInstanceIdentifiers?: StringList;
    /**
     * List of identifiers of Aurora DB clusters to which the RDS DB instance is replicated as a read replica.
     */
    ReadReplicaDBClusterIdentifiers?: StringList;
    /**
     * License model information for this DB instance.
     */
    LicenseModel?: NonEmptyString;
    /**
     * Specifies the provisioned IOPS (I/O operations per second) for this DB instance.
     */
    Iops?: Integer;
    /**
     * The list of option group memberships for this DB instance.
     */
    OptionGroupMemberships?: AwsRdsDbOptionGroupMemberships;
    /**
     * The name of the character set that this DB instance is associated with.
     */
    CharacterSetName?: NonEmptyString;
    /**
     * For a DB instance with multi-Availability Zone support, the name of the secondary Availability Zone.
     */
    SecondaryAvailabilityZone?: NonEmptyString;
    /**
     * The status of a read replica. If the instance isn't a read replica, this is empty.
     */
    StatusInfos?: AwsRdsDbStatusInfos;
    /**
     * The storage type for the DB instance.
     */
    StorageType?: NonEmptyString;
    /**
     * The Active Directory domain membership records associated with the DB instance.
     */
    DomainMemberships?: AwsRdsDbDomainMemberships;
    /**
     * Whether to copy resource tags to snapshots of the DB instance.
     */
    CopyTagsToSnapshot?: Boolean;
    /**
     * The interval, in seconds, between points when enhanced monitoring metrics are collected for the DB instance.
     */
    MonitoringInterval?: Integer;
    /**
     * The ARN for the IAM role that permits Amazon RDS to send enhanced monitoring metrics to CloudWatch Logs.
     */
    MonitoringRoleArn?: NonEmptyString;
    /**
     * The order in which to promote an Aurora replica to the primary instance after a failure of the existing primary instance.
     */
    PromotionTier?: Integer;
    /**
     * The time zone of the DB instance.
     */
    Timezone?: NonEmptyString;
    /**
     * Indicates whether Performance Insights is enabled for the DB instance.
     */
    PerformanceInsightsEnabled?: Boolean;
    /**
     * The identifier of the KMS key used to encrypt the Performance Insights data.
     */
    PerformanceInsightsKmsKeyId?: NonEmptyString;
    /**
     * The number of days to retain Performance Insights data.
     */
    PerformanceInsightsRetentionPeriod?: Integer;
    /**
     * A list of log types that this DB instance is configured to export to CloudWatch Logs.
     */
    EnabledCloudWatchLogsExports?: StringList;
    /**
     * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance.
     */
    ProcessorFeatures?: AwsRdsDbProcessorFeatures;
    ListenerEndpoint?: AwsRdsDbInstanceEndpoint;
    /**
     * The upper limit to which Amazon RDS can automatically scale the storage of the DB instance.
     */
    MaxAllocatedStorage?: Integer;
  }
  export interface AwsRdsDbInstanceEndpoint {
    /**
     * Specifies the DNS address of the DB instance.
     */
    Address?: NonEmptyString;
    /**
     * Specifies the port that the database engine is listening on.
     */
    Port?: Integer;
    /**
     * Specifies the ID that Amazon Route 53 assigns when you create a hosted zone.
     */
    HostedZoneId?: NonEmptyString;
  }
  export interface AwsRdsDbInstanceVpcSecurityGroup {
    /**
     * The name of the VPC security group.
     */
    VpcSecurityGroupId?: NonEmptyString;
    /**
     * The status of the VPC security group.
     */
    Status?: NonEmptyString;
  }
  export type AwsRdsDbInstanceVpcSecurityGroups = AwsRdsDbInstanceVpcSecurityGroup[];
  export interface AwsRdsDbOptionGroupMembership {
    /**
     * The name of the option group.
     */
    OptionGroupName?: NonEmptyString;
    /**
     * The status of the option group membership.
     */
    Status?: NonEmptyString;
  }
  export type AwsRdsDbOptionGroupMemberships = AwsRdsDbOptionGroupMembership[];
  export interface AwsRdsDbParameterGroup {
    /**
     * The name of the parameter group.
     */
    DbParameterGroupName?: NonEmptyString;
    /**
     * The status of parameter updates.
     */
    ParameterApplyStatus?: NonEmptyString;
  }
  export type AwsRdsDbParameterGroups = AwsRdsDbParameterGroup[];
  export interface AwsRdsDbPendingModifiedValues {
    /**
     * The new DB instance class for the DB instance.
     */
    DbInstanceClass?: NonEmptyString;
    /**
     * The new value of the allocated storage for the DB instance.
     */
    AllocatedStorage?: Integer;
    /**
     * The new master user password for the DB instance.
     */
    MasterUserPassword?: NonEmptyString;
    /**
     * The new port for the DB instance.
     */
    Port?: Integer;
    /**
     * The new backup retention period for the DB instance.
     */
    BackupRetentionPeriod?: Integer;
    /**
     * Indicates that a single Availability Zone DB instance is changing to a multiple Availability Zone deployment.
     */
    MultiAZ?: Boolean;
    /**
     * The new engine version for the DB instance.
     */
    EngineVersion?: NonEmptyString;
    /**
     * The new license model value for the DB instance.
     */
    LicenseModel?: NonEmptyString;
    /**
     * The new provisioned IOPS value for the DB instance.
     */
    Iops?: Integer;
    /**
     * The new DB instance identifier for the DB instance.
     */
    DbInstanceIdentifier?: NonEmptyString;
    /**
     * The new storage type for the DB instance.
     */
    StorageType?: NonEmptyString;
    /**
     * The new CA certificate identifier for the DB instance.
     */
    CaCertificateIdentifier?: NonEmptyString;
    /**
     * The name of the new subnet group for the DB instance.
     */
    DbSubnetGroupName?: NonEmptyString;
    /**
     * A list of log types that are being enabled or disabled.
     */
    PendingCloudWatchLogsExports?: AwsRdsPendingCloudWatchLogsExports;
    /**
     * Processor features that are being updated.
     */
    ProcessorFeatures?: AwsRdsDbProcessorFeatures;
  }
  export interface AwsRdsDbProcessorFeature {
    /**
     * The name of the processor feature.
     */
    Name?: NonEmptyString;
    /**
     * The value of the processor feature.
     */
    Value?: NonEmptyString;
  }
  export type AwsRdsDbProcessorFeatures = AwsRdsDbProcessorFeature[];
  export interface AwsRdsDbSnapshotDetails {
    /**
     * The name or ARN of the DB snapshot that is used to restore the DB instance.
     */
    DbSnapshotIdentifier?: NonEmptyString;
    /**
     * A name for the DB instance.
     */
    DbInstanceIdentifier?: NonEmptyString;
    /**
     * When the snapshot was taken in Coordinated Universal Time (UTC).
     */
    SnapshotCreateTime?: NonEmptyString;
    /**
     * The name of the database engine to use for this DB instance.
     */
    Engine?: NonEmptyString;
    /**
     * The amount of storage (in gigabytes) to be initially allocated for the database instance.
     */
    AllocatedStorage?: Integer;
    /**
     * The status of this DB snapshot.
     */
    Status?: NonEmptyString;
    /**
     * The port that the database engine was listening on at the time of the snapshot.
     */
    Port?: Integer;
    /**
     * Specifies the name of the Availability Zone in which the DB instance was located at the time of the DB snapshot.
     */
    AvailabilityZone?: NonEmptyString;
    /**
     * The VPC ID associated with the DB snapshot.
     */
    VpcId?: NonEmptyString;
    /**
     * Specifies the time in Coordinated Universal Time (UTC) when the DB instance, from which the snapshot was taken, was created.
     */
    InstanceCreateTime?: NonEmptyString;
    /**
     * The master user name for the DB snapshot.
     */
    MasterUsername?: NonEmptyString;
    /**
     * The version of the database engine.
     */
    EngineVersion?: NonEmptyString;
    /**
     * License model information for the restored DB instance.
     */
    LicenseModel?: NonEmptyString;
    /**
     * The type of the DB snapshot.
     */
    SnapshotType?: NonEmptyString;
    /**
     * The provisioned IOPS (I/O operations per second) value of the DB instance at the time of the snapshot.
     */
    Iops?: Integer;
    /**
     * The option group name for the DB snapshot.
     */
    OptionGroupName?: NonEmptyString;
    /**
     * The percentage of the estimated data that has been transferred.
     */
    PercentProgress?: Integer;
    /**
     * The Amazon Web Services Region that the DB snapshot was created in or copied from.
     */
    SourceRegion?: NonEmptyString;
    /**
     * The DB snapshot ARN that the DB snapshot was copied from.
     */
    SourceDbSnapshotIdentifier?: NonEmptyString;
    /**
     * The storage type associated with the DB snapshot.
     */
    StorageType?: NonEmptyString;
    /**
     * The ARN from the key store with which to associate the instance for TDE encryption.
     */
    TdeCredentialArn?: NonEmptyString;
    /**
     * Whether the DB snapshot is encrypted.
     */
    Encrypted?: Boolean;
    /**
     * If Encrypted is true, the KMS key identifier for the encrypted DB snapshot.
     */
    KmsKeyId?: NonEmptyString;
    /**
     * The time zone of the DB snapshot.
     */
    Timezone?: NonEmptyString;
    /**
     * Whether mapping of IAM accounts to database accounts is enabled.
     */
    IamDatabaseAuthenticationEnabled?: Boolean;
    /**
     * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance.
     */
    ProcessorFeatures?: AwsRdsDbProcessorFeatures;
    /**
     * The identifier for the source DB instance.
     */
    DbiResourceId?: NonEmptyString;
  }
  export interface AwsRdsDbStatusInfo {
    /**
     * The type of status. For a read replica, the status type is read replication.
     */
    StatusType?: NonEmptyString;
    /**
     * Whether the read replica instance is operating normally.
     */
    Normal?: Boolean;
    /**
     * The status of the read replica instance.
     */
    Status?: NonEmptyString;
    /**
     * If the read replica is currently in an error state, provides the error details.
     */
    Message?: NonEmptyString;
  }
  export type AwsRdsDbStatusInfos = AwsRdsDbStatusInfo[];
  export interface AwsRdsDbSubnetGroup {
    /**
     * The name of the subnet group.
     */
    DbSubnetGroupName?: NonEmptyString;
    /**
     * The description of the subnet group.
     */
    DbSubnetGroupDescription?: NonEmptyString;
    /**
     * The VPC ID of the subnet group.
     */
    VpcId?: NonEmptyString;
    /**
     * The status of the subnet group.
     */
    SubnetGroupStatus?: NonEmptyString;
    /**
     * A list of subnets in the subnet group.
     */
    Subnets?: AwsRdsDbSubnetGroupSubnets;
    /**
     * The ARN of the subnet group.
     */
    DbSubnetGroupArn?: NonEmptyString;
  }
  export interface AwsRdsDbSubnetGroupSubnet {
    /**
     * The identifier of a subnet in the subnet group.
     */
    SubnetIdentifier?: NonEmptyString;
    /**
     * Information about the Availability Zone for a subnet in the subnet group.
     */
    SubnetAvailabilityZone?: AwsRdsDbSubnetGroupSubnetAvailabilityZone;
    /**
     * The status of a subnet in the subnet group.
     */
    SubnetStatus?: NonEmptyString;
  }
  export interface AwsRdsDbSubnetGroupSubnetAvailabilityZone {
    /**
     * The name of the Availability Zone for a subnet in the subnet group.
     */
    Name?: NonEmptyString;
  }
  export type AwsRdsDbSubnetGroupSubnets = AwsRdsDbSubnetGroupSubnet[];
  export interface AwsRdsEventSubscriptionDetails {
    /**
     * The identifier of the account that is associated with the event notification subscription.
     */
    CustSubscriptionId?: NonEmptyString;
    /**
     * The identifier of the event notification subscription.
     */
    CustomerAwsId?: NonEmptyString;
    /**
     * Whether the event notification subscription is enabled.
     */
    Enabled?: Boolean;
    /**
     * The list of event categories for the event notification subscription.
     */
    EventCategoriesList?: NonEmptyStringList;
    /**
     * The ARN of the event notification subscription.
     */
    EventSubscriptionArn?: NonEmptyString;
    /**
     * The ARN of the SNS topic to post the event notifications to.
     */
    SnsTopicArn?: NonEmptyString;
    /**
     * A list of source identifiers for the event notification subscription.
     */
    SourceIdsList?: NonEmptyStringList;
    /**
     * The source type for the event notification subscription.
     */
    SourceType?: NonEmptyString;
    /**
     * The status of the event notification subscription. Valid values: creating | modifying | deleting | active | no-permission | topic-not-exist 
     */
    Status?: NonEmptyString;
    /**
     * The datetime when the event notification subscription was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    SubscriptionCreationTime?: NonEmptyString;
  }
  export interface AwsRdsPendingCloudWatchLogsExports {
    /**
     * A list of log types that are being enabled.
     */
    LogTypesToEnable?: StringList;
    /**
     * A list of log types that are being disabled.
     */
    LogTypesToDisable?: StringList;
  }
  export interface AwsRedshiftClusterClusterNode {
    /**
     * The role of the node. A node might be a leader node or a compute node.
     */
    NodeRole?: NonEmptyString;
    /**
     * The private IP address of the node.
     */
    PrivateIpAddress?: NonEmptyString;
    /**
     * The public IP address of the node.
     */
    PublicIpAddress?: NonEmptyString;
  }
  export type AwsRedshiftClusterClusterNodes = AwsRedshiftClusterClusterNode[];
  export interface AwsRedshiftClusterClusterParameterGroup {
    /**
     * The list of parameter statuses.
     */
    ClusterParameterStatusList?: AwsRedshiftClusterClusterParameterStatusList;
    /**
     * The status of updates to the parameters.
     */
    ParameterApplyStatus?: NonEmptyString;
    /**
     * The name of the parameter group.
     */
    ParameterGroupName?: NonEmptyString;
  }
  export type AwsRedshiftClusterClusterParameterGroups = AwsRedshiftClusterClusterParameterGroup[];
  export interface AwsRedshiftClusterClusterParameterStatus {
    /**
     * The name of the parameter.
     */
    ParameterName?: NonEmptyString;
    /**
     * The status of the parameter. Indicates whether the parameter is in sync with the database, waiting for a cluster reboot, or encountered an error when it was applied. Valid values: in-sync | pending-reboot | applying | invalid-parameter | apply-deferred | apply-error | unknown-error 
     */
    ParameterApplyStatus?: NonEmptyString;
    /**
     * The error that prevented the parameter from being applied to the database.
     */
    ParameterApplyErrorDescription?: NonEmptyString;
  }
  export type AwsRedshiftClusterClusterParameterStatusList = AwsRedshiftClusterClusterParameterStatus[];
  export interface AwsRedshiftClusterClusterSecurityGroup {
    /**
     * The name of the cluster security group.
     */
    ClusterSecurityGroupName?: NonEmptyString;
    /**
     * The status of the cluster security group.
     */
    Status?: NonEmptyString;
  }
  export type AwsRedshiftClusterClusterSecurityGroups = AwsRedshiftClusterClusterSecurityGroup[];
  export interface AwsRedshiftClusterClusterSnapshotCopyStatus {
    /**
     * The destination Region that snapshots are automatically copied to when cross-Region snapshot copy is enabled.
     */
    DestinationRegion?: NonEmptyString;
    /**
     * The number of days that manual snapshots are retained in the destination region after they are copied from a source region. If the value is -1, then the manual snapshot is retained indefinitely. Valid values: Either -1 or an integer between 1 and 3,653
     */
    ManualSnapshotRetentionPeriod?: Integer;
    /**
     * The number of days to retain automated snapshots in the destination Region after they are copied from a source Region.
     */
    RetentionPeriod?: Integer;
    /**
     * The name of the snapshot copy grant.
     */
    SnapshotCopyGrantName?: NonEmptyString;
  }
  export interface AwsRedshiftClusterDeferredMaintenanceWindow {
    /**
     * The end of the time window for which maintenance was deferred. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    DeferMaintenanceEndTime?: NonEmptyString;
    /**
     * The identifier of the maintenance window.
     */
    DeferMaintenanceIdentifier?: NonEmptyString;
    /**
     * The start of the time window for which maintenance was deferred. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    DeferMaintenanceStartTime?: NonEmptyString;
  }
  export type AwsRedshiftClusterDeferredMaintenanceWindows = AwsRedshiftClusterDeferredMaintenanceWindow[];
  export interface AwsRedshiftClusterDetails {
    /**
     * Indicates whether major version upgrades are applied automatically to the cluster during the maintenance window.
     */
    AllowVersionUpgrade?: Boolean;
    /**
     * The number of days that automatic cluster snapshots are retained.
     */
    AutomatedSnapshotRetentionPeriod?: Integer;
    /**
     * The name of the Availability Zone in which the cluster is located.
     */
    AvailabilityZone?: NonEmptyString;
    /**
     * The availability status of the cluster for queries. Possible values are the following:    Available - The cluster is available for queries.    Unavailable - The cluster is not available for queries.    Maintenance - The cluster is intermittently available for queries due to maintenance activities.    Modifying -The cluster is intermittently available for queries due to changes that modify the cluster.    Failed - The cluster failed and is not available for queries.  
     */
    ClusterAvailabilityStatus?: NonEmptyString;
    /**
     * Indicates when the cluster was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    ClusterCreateTime?: NonEmptyString;
    /**
     * The unique identifier of the cluster.
     */
    ClusterIdentifier?: NonEmptyString;
    /**
     * The nodes in the cluster.
     */
    ClusterNodes?: AwsRedshiftClusterClusterNodes;
    /**
     * The list of cluster parameter groups that are associated with this cluster.
     */
    ClusterParameterGroups?: AwsRedshiftClusterClusterParameterGroups;
    /**
     * The public key for the cluster.
     */
    ClusterPublicKey?: NonEmptyString;
    /**
     * The specific revision number of the database in the cluster.
     */
    ClusterRevisionNumber?: NonEmptyString;
    /**
     * A list of cluster security groups that are associated with the cluster.
     */
    ClusterSecurityGroups?: AwsRedshiftClusterClusterSecurityGroups;
    /**
     * Information about the destination Region and retention period for the cross-Region snapshot copy.
     */
    ClusterSnapshotCopyStatus?: AwsRedshiftClusterClusterSnapshotCopyStatus;
    /**
     * The current status of the cluster. Valid values: available | available, prep-for-resize | available, resize-cleanup | cancelling-resize | creating | deleting | final-snapshot | hardware-failure | incompatible-hsm | incompatible-network | incompatible-parameters | incompatible-restore | modifying | paused | rebooting | renaming | resizing | rotating-keys | storage-full | updating-hsm 
     */
    ClusterStatus?: NonEmptyString;
    /**
     * The name of the subnet group that is associated with the cluster. This parameter is valid only when the cluster is in a VPC.
     */
    ClusterSubnetGroupName?: NonEmptyString;
    /**
     * The version ID of the Amazon Redshift engine that runs on the cluster.
     */
    ClusterVersion?: NonEmptyString;
    /**
     * The name of the initial database that was created when the cluster was created. The same name is returned for the life of the cluster. If an initial database is not specified, a database named devdev is created by default.
     */
    DBName?: NonEmptyString;
    /**
     * List of time windows during which maintenance was deferred.
     */
    DeferredMaintenanceWindows?: AwsRedshiftClusterDeferredMaintenanceWindows;
    /**
     * Information about the status of the Elastic IP (EIP) address.
     */
    ElasticIpStatus?: AwsRedshiftClusterElasticIpStatus;
    /**
     * The number of nodes that you can use the elastic resize method to resize the cluster to.
     */
    ElasticResizeNumberOfNodeOptions?: NonEmptyString;
    /**
     * Indicates whether the data in the cluster is encrypted at rest.
     */
    Encrypted?: Boolean;
    /**
     * The connection endpoint.
     */
    Endpoint?: AwsRedshiftClusterEndpoint;
    /**
     * Indicates whether to create the cluster with enhanced VPC routing enabled.
     */
    EnhancedVpcRouting?: Boolean;
    /**
     * Indicates when the next snapshot is expected to be taken. The cluster must have a valid snapshot schedule and have backups enabled. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    ExpectedNextSnapshotScheduleTime?: NonEmptyString;
    /**
     * The status of the next expected snapshot. Valid values: OnTrack | Pending 
     */
    ExpectedNextSnapshotScheduleTimeStatus?: NonEmptyString;
    /**
     * Information about whether the Amazon Redshift cluster finished applying any changes to hardware security module (HSM) settings that were specified in a modify cluster command.
     */
    HsmStatus?: AwsRedshiftClusterHsmStatus;
    /**
     * A list of IAM roles that the cluster can use to access other Amazon Web Services services.
     */
    IamRoles?: AwsRedshiftClusterIamRoles;
    /**
     * The identifier of the KMS encryption key that is used to encrypt data in the cluster.
     */
    KmsKeyId?: NonEmptyString;
    /**
     * The name of the maintenance track for the cluster.
     */
    MaintenanceTrackName?: NonEmptyString;
    /**
     * The default number of days to retain a manual snapshot. If the value is -1, the snapshot is retained indefinitely. This setting doesn't change the retention period of existing snapshots. Valid values: Either -1 or an integer between 1 and 3,653
     */
    ManualSnapshotRetentionPeriod?: Integer;
    /**
     * The master user name for the cluster. This name is used to connect to the database that is specified in as the value of DBName.
     */
    MasterUsername?: NonEmptyString;
    /**
     * Indicates the start of the next maintenance window. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    NextMaintenanceWindowStartTime?: NonEmptyString;
    /**
     * The node type for the nodes in the cluster.
     */
    NodeType?: NonEmptyString;
    /**
     * The number of compute nodes in the cluster.
     */
    NumberOfNodes?: Integer;
    /**
     * A list of cluster operations that are waiting to start.
     */
    PendingActions?: StringList;
    /**
     * A list of changes to the cluster that are currently pending.
     */
    PendingModifiedValues?: AwsRedshiftClusterPendingModifiedValues;
    /**
     * The weekly time range, in Universal Coordinated Time (UTC), during which system maintenance can occur. Format:  &lt;day&gt;:HH:MM-&lt;day&gt;:HH:MM  For the day values, use mon | tue | wed | thu | fri | sat | sun  For example, sun:09:32-sun:10:02 
     */
    PreferredMaintenanceWindow?: NonEmptyString;
    /**
     * Whether the cluster can be accessed from a public network.
     */
    PubliclyAccessible?: Boolean;
    /**
     * Information about the resize operation for the cluster.
     */
    ResizeInfo?: AwsRedshiftClusterResizeInfo;
    /**
     * Information about the status of a cluster restore action. Only applies to a cluster that was created by restoring a snapshot.
     */
    RestoreStatus?: AwsRedshiftClusterRestoreStatus;
    /**
     * A unique identifier for the cluster snapshot schedule.
     */
    SnapshotScheduleIdentifier?: NonEmptyString;
    /**
     * The current state of the cluster snapshot schedule. Valid values: MODIFYING | ACTIVE | FAILED 
     */
    SnapshotScheduleState?: NonEmptyString;
    /**
     * The identifier of the VPC that the cluster is in, if the cluster is in a VPC.
     */
    VpcId?: NonEmptyString;
    /**
     * The list of VPC security groups that the cluster belongs to, if the cluster is in a VPC.
     */
    VpcSecurityGroups?: AwsRedshiftClusterVpcSecurityGroups;
  }
  export interface AwsRedshiftClusterElasticIpStatus {
    /**
     * The elastic IP address for the cluster.
     */
    ElasticIp?: NonEmptyString;
    /**
     * The status of the elastic IP address.
     */
    Status?: NonEmptyString;
  }
  export interface AwsRedshiftClusterEndpoint {
    /**
     * The DNS address of the cluster.
     */
    Address?: NonEmptyString;
    /**
     * The port that the database engine listens on.
     */
    Port?: Integer;
  }
  export interface AwsRedshiftClusterHsmStatus {
    /**
     * The name of the HSM client certificate that the Amazon Redshift cluster uses to retrieve the data encryption keys that are stored in an HSM.
     */
    HsmClientCertificateIdentifier?: NonEmptyString;
    /**
     * The name of the HSM configuration that contains the information that the Amazon Redshift cluster can use to retrieve and store keys in an HSM.
     */
    HsmConfigurationIdentifier?: NonEmptyString;
    /**
     * Indicates whether the Amazon Redshift cluster has finished applying any HSM settings changes specified in a modify cluster command. Type: String Valid values: active | applying 
     */
    Status?: NonEmptyString;
  }
  export interface AwsRedshiftClusterIamRole {
    /**
     * The status of the IAM role's association with the cluster. Valid values: in-sync | adding | removing 
     */
    ApplyStatus?: NonEmptyString;
    /**
     * The ARN of the IAM role.
     */
    IamRoleArn?: NonEmptyString;
  }
  export type AwsRedshiftClusterIamRoles = AwsRedshiftClusterIamRole[];
  export interface AwsRedshiftClusterPendingModifiedValues {
    /**
     * The pending or in-progress change to the automated snapshot retention period.
     */
    AutomatedSnapshotRetentionPeriod?: Integer;
    /**
     * The pending or in-progress change to the identifier for the cluster.
     */
    ClusterIdentifier?: NonEmptyString;
    /**
     * The pending or in-progress change to the cluster type.
     */
    ClusterType?: NonEmptyString;
    /**
     * The pending or in-progress change to the service version.
     */
    ClusterVersion?: NonEmptyString;
    /**
     * The encryption type for a cluster.
     */
    EncryptionType?: NonEmptyString;
    /**
     * Indicates whether to create the cluster with enhanced VPC routing enabled.
     */
    EnhancedVpcRouting?: Boolean;
    /**
     * The name of the maintenance track that the cluster changes to during the next maintenance window.
     */
    MaintenanceTrackName?: NonEmptyString;
    /**
     * The pending or in-progress change to the master user password for the cluster.
     */
    MasterUserPassword?: NonEmptyString;
    /**
     * The pending or in-progress change to the cluster's node type.
     */
    NodeType?: NonEmptyString;
    /**
     * The pending or in-progress change to the number of nodes in the cluster.
     */
    NumberOfNodes?: Integer;
    /**
     * The pending or in-progress change to whether the cluster can be connected to from the public network.
     */
    PubliclyAccessible?: Boolean;
  }
  export interface AwsRedshiftClusterResizeInfo {
    /**
     * Indicates whether the resize operation can be canceled.
     */
    AllowCancelResize?: Boolean;
    /**
     * The type of resize operation. Valid values: ClassicResize 
     */
    ResizeType?: NonEmptyString;
  }
  export interface AwsRedshiftClusterRestoreStatus {
    /**
     * The number of megabytes per second being transferred from the backup storage. Returns the average rate for a completed backup. This field is only updated when you restore to DC2 and DS2 node types.
     */
    CurrentRestoreRateInMegaBytesPerSecond?: Double;
    /**
     * The amount of time an in-progress restore has been running, or the amount of time it took a completed restore to finish. This field is only updated when you restore to DC2 and DS2 node types.
     */
    ElapsedTimeInSeconds?: Long;
    /**
     * The estimate of the time remaining before the restore is complete. Returns 0 for a completed restore. This field is only updated when you restore to DC2 and DS2 node types.
     */
    EstimatedTimeToCompletionInSeconds?: Long;
    /**
     * The number of megabytes that were transferred from snapshot storage. This field is only updated when you restore to DC2 and DS2 node types.
     */
    ProgressInMegaBytes?: Long;
    /**
     * The size of the set of snapshot data that was used to restore the cluster. This field is only updated when you restore to DC2 and DS2 node types.
     */
    SnapshotSizeInMegaBytes?: Long;
    /**
     * The status of the restore action. Valid values: starting | restoring | completed | failed 
     */
    Status?: NonEmptyString;
  }
  export interface AwsRedshiftClusterVpcSecurityGroup {
    /**
     * The status of the VPC security group.
     */
    Status?: NonEmptyString;
    /**
     * The identifier of the VPC security group.
     */
    VpcSecurityGroupId?: NonEmptyString;
  }
  export type AwsRedshiftClusterVpcSecurityGroups = AwsRedshiftClusterVpcSecurityGroup[];
  export interface AwsS3AccountPublicAccessBlockDetails {
    /**
     * Indicates whether to reject calls to update an S3 bucket if the calls include a public access control list (ACL).
     */
    BlockPublicAcls?: Boolean;
    /**
     * Indicates whether to reject calls to update the access policy for an S3 bucket or access point if the policy allows public access.
     */
    BlockPublicPolicy?: Boolean;
    /**
     * Indicates whether Amazon S3 ignores public ACLs that are associated with an S3 bucket.
     */
    IgnorePublicAcls?: Boolean;
    /**
     * Indicates whether to restrict access to an access point or S3 bucket that has a public policy to only Amazon Web Services service principals and authorized users within the S3 bucket owner's account.
     */
    RestrictPublicBuckets?: Boolean;
  }
  export interface AwsS3BucketBucketLifecycleConfigurationDetails {
    /**
     * The lifecycle rules.
     */
    Rules?: AwsS3BucketBucketLifecycleConfigurationRulesList;
  }
  export interface AwsS3BucketBucketLifecycleConfigurationRulesAbortIncompleteMultipartUploadDetails {
    /**
     * The number of days after which Amazon S3 cancels an incomplete multipart upload.
     */
    DaysAfterInitiation?: Integer;
  }
  export interface AwsS3BucketBucketLifecycleConfigurationRulesDetails {
    /**
     * How Amazon S3 responds when a multipart upload is incomplete. Specifically, provides a number of days before Amazon S3 cancels the entire upload.
     */
    AbortIncompleteMultipartUpload?: AwsS3BucketBucketLifecycleConfigurationRulesAbortIncompleteMultipartUploadDetails;
    /**
     * The date when objects are moved or deleted. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    ExpirationDate?: NonEmptyString;
    /**
     * The length in days of the lifetime for objects that are subject to the rule.
     */
    ExpirationInDays?: Integer;
    /**
     * Whether Amazon S3 removes a delete marker that has no noncurrent versions. If set to true, the delete marker is expired. If set to false, the policy takes no action. If you provide ExpiredObjectDeleteMarker, you cannot provide ExpirationInDays or ExpirationDate.
     */
    ExpiredObjectDeleteMarker?: Boolean;
    /**
     * Identifies the objects that a rule applies to.
     */
    Filter?: AwsS3BucketBucketLifecycleConfigurationRulesFilterDetails;
    /**
     * The unique identifier of the rule.
     */
    ID?: NonEmptyString;
    /**
     * The number of days that an object is noncurrent before Amazon S3 can perform the associated action.
     */
    NoncurrentVersionExpirationInDays?: Integer;
    /**
     * Transition rules that describe when noncurrent objects transition to a specified storage class.
     */
    NoncurrentVersionTransitions?: AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsList;
    /**
     * A prefix that identifies one or more objects that the rule applies to.
     */
    Prefix?: NonEmptyString;
    /**
     * The current status of the rule. Indicates whether the rule is currently being applied.
     */
    Status?: NonEmptyString;
    /**
     * Transition rules that indicate when objects transition to a specified storage class.
     */
    Transitions?: AwsS3BucketBucketLifecycleConfigurationRulesTransitionsList;
  }
  export interface AwsS3BucketBucketLifecycleConfigurationRulesFilterDetails {
    /**
     * The configuration for the filter.
     */
    Predicate?: AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateDetails;
  }
  export interface AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateDetails {
    /**
     * The values to use for the filter.
     */
    Operands?: AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsList;
    /**
     * A prefix filter.
     */
    Prefix?: NonEmptyString;
    /**
     * A tag filter.
     */
    Tag?: AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateTagDetails;
    /**
     * Whether to use AND or OR to join the operands.
     */
    Type?: NonEmptyString;
  }
  export interface AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails {
    /**
     * Prefix text for matching objects.
     */
    Prefix?: NonEmptyString;
    /**
     * A tag that is assigned to matching objects.
     */
    Tag?: AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsTagDetails;
    /**
     * The type of filter value.
     */
    Type?: NonEmptyString;
  }
  export type AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsList = AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails[];
  export interface AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsTagDetails {
    /**
     * The tag key.
     */
    Key?: NonEmptyString;
    /**
     * The tag value.
     */
    Value?: NonEmptyString;
  }
  export interface AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateTagDetails {
    /**
     * The tag key.
     */
    Key?: NonEmptyString;
    /**
     * The tag value
     */
    Value?: NonEmptyString;
  }
  export type AwsS3BucketBucketLifecycleConfigurationRulesList = AwsS3BucketBucketLifecycleConfigurationRulesDetails[];
  export interface AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails {
    /**
     * The number of days that an object is noncurrent before Amazon S3 can perform the associated action.
     */
    Days?: Integer;
    /**
     * The class of storage to change the object to after the object is noncurrent for the specified number of days.
     */
    StorageClass?: NonEmptyString;
  }
  export type AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsList = AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails[];
  export interface AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails {
    /**
     * A date on which to transition objects to the specified storage class. If you provide Date, you cannot provide Days. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    Date?: NonEmptyString;
    /**
     * The number of days after which to transition the object to the specified storage class. If you provide Days, you cannot provide Date.
     */
    Days?: Integer;
    /**
     * The storage class to transition the object to.
     */
    StorageClass?: NonEmptyString;
  }
  export type AwsS3BucketBucketLifecycleConfigurationRulesTransitionsList = AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails[];
  export interface AwsS3BucketDetails {
    /**
     * The canonical user ID of the owner of the S3 bucket.
     */
    OwnerId?: NonEmptyString;
    /**
     * The display name of the owner of the S3 bucket.
     */
    OwnerName?: NonEmptyString;
    /**
     * The Amazon Web Services account identifier of the account that owns the S3 bucket.
     */
    OwnerAccountId?: NonEmptyString;
    /**
     * Indicates when the S3 bucket was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedAt?: NonEmptyString;
    /**
     * The encryption rules that are applied to the S3 bucket.
     */
    ServerSideEncryptionConfiguration?: AwsS3BucketServerSideEncryptionConfiguration;
    /**
     * The lifecycle configuration for objects in the S3 bucket.
     */
    BucketLifecycleConfiguration?: AwsS3BucketBucketLifecycleConfigurationDetails;
    /**
     * Provides information about the Amazon S3 Public Access Block configuration for the S3 bucket.
     */
    PublicAccessBlockConfiguration?: AwsS3AccountPublicAccessBlockDetails;
    /**
     * The access control list for the S3 bucket.
     */
    AccessControlList?: NonEmptyString;
    /**
     * The logging configuration for the S3 bucket.
     */
    BucketLoggingConfiguration?: AwsS3BucketLoggingConfiguration;
    /**
     * The website configuration parameters for the S3 bucket.
     */
    BucketWebsiteConfiguration?: AwsS3BucketWebsiteConfiguration;
    /**
     * The notification configuration for the S3 bucket.
     */
    BucketNotificationConfiguration?: AwsS3BucketNotificationConfiguration;
  }
  export interface AwsS3BucketLoggingConfiguration {
    /**
     * The name of the S3 bucket where log files for the S3 bucket are stored.
     */
    DestinationBucketName?: NonEmptyString;
    /**
     * The prefix added to log files for the S3 bucket.
     */
    LogFilePrefix?: NonEmptyString;
  }
  export interface AwsS3BucketNotificationConfiguration {
    /**
     * Configurations for S3 bucket notifications.
     */
    Configurations?: AwsS3BucketNotificationConfigurationDetails;
  }
  export interface AwsS3BucketNotificationConfigurationDetail {
    /**
     * The list of events that trigger a notification.
     */
    Events?: AwsS3BucketNotificationConfigurationEvents;
    /**
     * The filters that determine which S3 buckets generate notifications.
     */
    Filter?: AwsS3BucketNotificationConfigurationFilter;
    /**
     * The ARN of the Lambda function, Amazon SQS queue, or Amazon SNS topic that generates the notification.
     */
    Destination?: NonEmptyString;
    /**
     * Indicates the type of notification. Notifications can be generated using Lambda functions, Amazon SQS queues or Amazon SNS topics.
     */
    Type?: NonEmptyString;
  }
  export type AwsS3BucketNotificationConfigurationDetails = AwsS3BucketNotificationConfigurationDetail[];
  export type AwsS3BucketNotificationConfigurationEvents = NonEmptyString[];
  export interface AwsS3BucketNotificationConfigurationFilter {
    /**
     * Details for an Amazon S3 filter.
     */
    S3KeyFilter?: AwsS3BucketNotificationConfigurationS3KeyFilter;
  }
  export interface AwsS3BucketNotificationConfigurationS3KeyFilter {
    /**
     * The filter rules for the filter.
     */
    FilterRules?: AwsS3BucketNotificationConfigurationS3KeyFilterRules;
  }
  export interface AwsS3BucketNotificationConfigurationS3KeyFilterRule {
    /**
     * Indicates whether the filter is based on the prefix or suffix of the Amazon S3 key.
     */
    Name?: AwsS3BucketNotificationConfigurationS3KeyFilterRuleName;
    /**
     * The filter value.
     */
    Value?: NonEmptyString;
  }
  export type AwsS3BucketNotificationConfigurationS3KeyFilterRuleName = "Prefix"|"Suffix"|string;
  export type AwsS3BucketNotificationConfigurationS3KeyFilterRules = AwsS3BucketNotificationConfigurationS3KeyFilterRule[];
  export interface AwsS3BucketServerSideEncryptionByDefault {
    /**
     * Server-side encryption algorithm to use for the default encryption.
     */
    SSEAlgorithm?: NonEmptyString;
    /**
     * KMS key ID to use for the default encryption.
     */
    KMSMasterKeyID?: NonEmptyString;
  }
  export interface AwsS3BucketServerSideEncryptionConfiguration {
    /**
     * The encryption rules that are applied to the S3 bucket.
     */
    Rules?: AwsS3BucketServerSideEncryptionRules;
  }
  export interface AwsS3BucketServerSideEncryptionRule {
    /**
     * Specifies the default server-side encryption to apply to new objects in the bucket. If a PUT object request doesn't specify any server-side encryption, this default encryption is applied.
     */
    ApplyServerSideEncryptionByDefault?: AwsS3BucketServerSideEncryptionByDefault;
  }
  export type AwsS3BucketServerSideEncryptionRules = AwsS3BucketServerSideEncryptionRule[];
  export interface AwsS3BucketWebsiteConfiguration {
    /**
     * The name of the error document for the website.
     */
    ErrorDocument?: NonEmptyString;
    /**
     * The name of the index document for the website.
     */
    IndexDocumentSuffix?: NonEmptyString;
    /**
     * The redirect behavior for requests to the website.
     */
    RedirectAllRequestsTo?: AwsS3BucketWebsiteConfigurationRedirectTo;
    /**
     * The rules for applying redirects for requests to the website.
     */
    RoutingRules?: AwsS3BucketWebsiteConfigurationRoutingRules;
  }
  export interface AwsS3BucketWebsiteConfigurationRedirectTo {
    /**
     * The name of the host to redirect requests to.
     */
    Hostname?: NonEmptyString;
    /**
     * The protocol to use when redirecting requests. By default, uses the same protocol as the original request.
     */
    Protocol?: NonEmptyString;
  }
  export interface AwsS3BucketWebsiteConfigurationRoutingRule {
    /**
     * Provides the condition that must be met in order to apply the routing rule.
     */
    Condition?: AwsS3BucketWebsiteConfigurationRoutingRuleCondition;
    /**
     * Provides the rules to redirect the request if the condition in Condition is met.
     */
    Redirect?: AwsS3BucketWebsiteConfigurationRoutingRuleRedirect;
  }
  export interface AwsS3BucketWebsiteConfigurationRoutingRuleCondition {
    /**
     * Indicates to redirect the request if the HTTP error code matches this value.
     */
    HttpErrorCodeReturnedEquals?: NonEmptyString;
    /**
     * Indicates to redirect the request if the key prefix matches this value.
     */
    KeyPrefixEquals?: NonEmptyString;
  }
  export interface AwsS3BucketWebsiteConfigurationRoutingRuleRedirect {
    /**
     * The host name to use in the redirect request.
     */
    Hostname?: NonEmptyString;
    /**
     * The HTTP redirect code to use in the response.
     */
    HttpRedirectCode?: NonEmptyString;
    /**
     * The protocol to use to redirect the request. By default, uses the protocol from the original request.
     */
    Protocol?: NonEmptyString;
    /**
     * The object key prefix to use in the redirect request. Cannot be provided if ReplaceKeyWith is present.
     */
    ReplaceKeyPrefixWith?: NonEmptyString;
    /**
     * The specific object key to use in the redirect request. Cannot be provided if ReplaceKeyPrefixWith is present.
     */
    ReplaceKeyWith?: NonEmptyString;
  }
  export type AwsS3BucketWebsiteConfigurationRoutingRules = AwsS3BucketWebsiteConfigurationRoutingRule[];
  export interface AwsS3ObjectDetails {
    /**
     * Indicates when the object was last modified. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LastModified?: NonEmptyString;
    /**
     * The opaque identifier assigned by a web server to a specific version of a resource found at a URL.
     */
    ETag?: NonEmptyString;
    /**
     * The version of the object.
     */
    VersionId?: NonEmptyString;
    /**
     * A standard MIME type describing the format of the object data.
     */
    ContentType?: NonEmptyString;
    /**
     * If the object is stored using server-side encryption, the value of the server-side encryption algorithm used when storing this object in Amazon S3.
     */
    ServerSideEncryption?: NonEmptyString;
    /**
     * The identifier of the KMS symmetric customer managed key that was used for the object.
     */
    SSEKMSKeyId?: NonEmptyString;
  }
  export interface AwsSecretsManagerSecretDetails {
    /**
     * Defines the rotation schedule for the secret.
     */
    RotationRules?: AwsSecretsManagerSecretRotationRules;
    /**
     * Whether the rotation occurred within the specified rotation frequency.
     */
    RotationOccurredWithinFrequency?: Boolean;
    /**
     * The ARN, Key ID, or alias of the KMS key used to encrypt the SecretString or SecretBinary values for versions of this secret.
     */
    KmsKeyId?: NonEmptyString;
    /**
     * Whether rotation is enabled.
     */
    RotationEnabled?: Boolean;
    /**
     * The ARN of the Lambda function that rotates the secret.
     */
    RotationLambdaArn?: NonEmptyString;
    /**
     * Whether the secret is deleted.
     */
    Deleted?: Boolean;
    /**
     * The name of the secret.
     */
    Name?: NonEmptyString;
    /**
     * The user-provided description of the secret.
     */
    Description?: NonEmptyString;
  }
  export interface AwsSecretsManagerSecretRotationRules {
    /**
     * The number of days after the previous rotation to rotate the secret.
     */
    AutomaticallyAfterDays?: Integer;
  }
  export interface AwsSecurityFinding {
    /**
     * The schema version that a finding is formatted for.
     */
    SchemaVersion: NonEmptyString;
    /**
     * The security findings provider-specific identifier for a finding.
     */
    Id: NonEmptyString;
    /**
     * The ARN generated by Security Hub that uniquely identifies a product that generates findings. This can be the ARN for a third-party product that is integrated with Security Hub, or the ARN for a custom integration.
     */
    ProductArn: NonEmptyString;
    /**
     * The name of the product that generated the finding. Security Hub populates this attribute automatically for each finding. You cannot update it using BatchImportFindings or BatchUpdateFindings. The exception to this is when you use a custom integration. When you use the Security Hub console to filter findings by product name, you use this attribute. When you use the Security Hub API to filter findings by product name, you use the aws/securityhub/ProductName attribute under ProductFields. Security Hub does not synchronize those two attributes.
     */
    ProductName?: NonEmptyString;
    /**
     * The name of the company for the product that generated the finding. Security Hub populates this attribute automatically for each finding. You cannot be updated using BatchImportFindings or BatchUpdateFindings. The exception to this is when you use a custom integration. When you use the Security Hub console to filter findings by company name, you use this attribute. When you use the Security Hub API to filter findings by company name, you use the aws/securityhub/CompanyName attribute under ProductFields. Security Hub does not synchronize those two attributes.
     */
    CompanyName?: NonEmptyString;
    /**
     * The Region from which the finding was generated. Security Hub populates this attribute automatically for each finding. You cannot update it using BatchImportFindings or BatchUpdateFindings.
     */
    Region?: NonEmptyString;
    /**
     * The identifier for the solution-specific component (a discrete unit of logic) that generated a finding. In various security-findings providers' solutions, this generator can be called a rule, a check, a detector, a plugin, etc. 
     */
    GeneratorId: NonEmptyString;
    /**
     * The Amazon Web Services account ID that a finding is generated in.
     */
    AwsAccountId: NonEmptyString;
    /**
     * One or more finding types in the format of namespace/category/classifier that classify a finding. Valid namespace values are: Software and Configuration Checks | TTPs | Effects | Unusual Behaviors | Sensitive Data Identifications
     */
    Types?: TypeList;
    /**
     * Indicates when the security-findings provider first observed the potential security issue that a finding captured. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    FirstObservedAt?: NonEmptyString;
    /**
     * Indicates when the security-findings provider most recently observed the potential security issue that a finding captured. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LastObservedAt?: NonEmptyString;
    /**
     * Indicates when the security-findings provider created the potential security issue that a finding captured. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    CreatedAt: NonEmptyString;
    /**
     * Indicates when the security-findings provider last updated the finding record. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    UpdatedAt: NonEmptyString;
    /**
     * A finding's severity.
     */
    Severity?: Severity;
    /**
     * A finding's confidence. Confidence is defined as the likelihood that a finding accurately identifies the behavior or issue that it was intended to identify. Confidence is scored on a 0-100 basis using a ratio scale, where 0 means zero percent confidence and 100 means 100 percent confidence.
     */
    Confidence?: Integer;
    /**
     * The level of importance assigned to the resources associated with the finding. A score of 0 means that the underlying resources have no criticality, and a score of 100 is reserved for the most critical resources.
     */
    Criticality?: Integer;
    /**
     * A finding's title.  In this release, Title is a required property. 
     */
    Title: NonEmptyString;
    /**
     * A finding's description.  In this release, Description is a required property. 
     */
    Description: NonEmptyString;
    /**
     * A data type that describes the remediation options for a finding.
     */
    Remediation?: Remediation;
    /**
     * A URL that links to a page about the current finding in the security-findings provider's solution.
     */
    SourceUrl?: NonEmptyString;
    /**
     * A data type where security-findings providers can include additional solution-specific details that aren't part of the defined AwsSecurityFinding format. Can contain up to 50 key-value pairs. For each key-value pair, the key can contain up to 128 characters, and the value can contain up to 2048 characters.
     */
    ProductFields?: FieldMap;
    /**
     * A list of name/value string pairs associated with the finding. These are custom, user-defined fields added to a finding. 
     */
    UserDefinedFields?: FieldMap;
    /**
     * A list of malware related to a finding.
     */
    Malware?: MalwareList;
    /**
     * The details of network-related information about a finding.
     */
    Network?: Network;
    /**
     * Provides information about a network path that is relevant to a finding. Each entry under NetworkPath represents a component of that path.
     */
    NetworkPath?: NetworkPathList;
    /**
     * The details of process-related information about a finding.
     */
    Process?: ProcessDetails;
    /**
     * Threat intelligence details related to a finding.
     */
    ThreatIntelIndicators?: ThreatIntelIndicatorList;
    /**
     * A set of resource data types that describe the resources that the finding refers to.
     */
    Resources: ResourceList;
    /**
     * This data type is exclusive to findings that are generated as the result of a check run against a specific rule in a supported security standard, such as CIS Amazon Web Services Foundations. Contains security standard-related finding details.
     */
    Compliance?: Compliance;
    /**
     * Indicates the veracity of a finding. 
     */
    VerificationState?: VerificationState;
    /**
     * The workflow state of a finding. 
     */
    WorkflowState?: WorkflowState;
    /**
     * Provides information about the status of the investigation into a finding.
     */
    Workflow?: Workflow;
    /**
     * The record state of a finding.
     */
    RecordState?: RecordState;
    /**
     * A list of related findings.
     */
    RelatedFindings?: RelatedFindingList;
    /**
     * A user-defined note added to a finding.
     */
    Note?: Note;
    /**
     * Provides a list of vulnerabilities associated with the findings.
     */
    Vulnerabilities?: VulnerabilityList;
    /**
     * Provides an overview of the patch compliance status for an instance against a selected compliance standard.
     */
    PatchSummary?: PatchSummary;
    /**
     * Provides details about an action that affects or that was taken on a resource.
     */
    Action?: Action;
    /**
     * In a BatchImportFindings request, finding providers use FindingProviderFields to provide and update their own values for confidence, criticality, related findings, severity, and types.
     */
    FindingProviderFields?: FindingProviderFields;
  }
  export interface AwsSecurityFindingFilters {
    /**
     * The ARN generated by Security Hub that uniquely identifies a third-party company (security findings provider) after this provider's product (solution that generates findings) is registered with Security Hub.
     */
    ProductArn?: StringFilterList;
    /**
     * The Amazon Web Services account ID that a finding is generated in.
     */
    AwsAccountId?: StringFilterList;
    /**
     * The security findings provider-specific identifier for a finding.
     */
    Id?: StringFilterList;
    /**
     * The identifier for the solution-specific component (a discrete unit of logic) that generated a finding. In various security-findings providers' solutions, this generator can be called a rule, a check, a detector, a plugin, etc.
     */
    GeneratorId?: StringFilterList;
    /**
     * The Region from which the finding was generated.
     */
    Region?: StringFilterList;
    /**
     * A finding type in the format of namespace/category/classifier that classifies a finding.
     */
    Type?: StringFilterList;
    /**
     * An ISO8601-formatted timestamp that indicates when the security-findings provider first observed the potential security issue that a finding captured.
     */
    FirstObservedAt?: DateFilterList;
    /**
     * An ISO8601-formatted timestamp that indicates when the security-findings provider most recently observed the potential security issue that a finding captured.
     */
    LastObservedAt?: DateFilterList;
    /**
     * An ISO8601-formatted timestamp that indicates when the security-findings provider captured the potential security issue that a finding captured.
     */
    CreatedAt?: DateFilterList;
    /**
     * An ISO8601-formatted timestamp that indicates when the security-findings provider last updated the finding record. 
     */
    UpdatedAt?: DateFilterList;
    /**
     * The native severity as defined by the security-findings provider's solution that generated the finding.
     */
    SeverityProduct?: NumberFilterList;
    /**
     * The normalized severity of a finding.
     */
    SeverityNormalized?: NumberFilterList;
    /**
     * The label of a finding's severity.
     */
    SeverityLabel?: StringFilterList;
    /**
     * A finding's confidence. Confidence is defined as the likelihood that a finding accurately identifies the behavior or issue that it was intended to identify. Confidence is scored on a 0-100 basis using a ratio scale, where 0 means zero percent confidence and 100 means 100 percent confidence.
     */
    Confidence?: NumberFilterList;
    /**
     * The level of importance assigned to the resources associated with the finding. A score of 0 means that the underlying resources have no criticality, and a score of 100 is reserved for the most critical resources.
     */
    Criticality?: NumberFilterList;
    /**
     * A finding's title.
     */
    Title?: StringFilterList;
    /**
     * A finding's description.
     */
    Description?: StringFilterList;
    /**
     * The recommendation of what to do about the issue described in a finding.
     */
    RecommendationText?: StringFilterList;
    /**
     * A URL that links to a page about the current finding in the security-findings provider's solution.
     */
    SourceUrl?: StringFilterList;
    /**
     * A data type where security-findings providers can include additional solution-specific details that aren't part of the defined AwsSecurityFinding format.
     */
    ProductFields?: MapFilterList;
    /**
     * The name of the solution (product) that generates findings. Note that this is a filter against the aws/securityhub/ProductName field in ProductFields. It is not a filter for the top-level ProductName field.
     */
    ProductName?: StringFilterList;
    /**
     * The name of the findings provider (company) that owns the solution (product) that generates findings. Note that this is a filter against the aws/securityhub/CompanyName field in ProductFields. It is not a filter for the top-level CompanyName field.
     */
    CompanyName?: StringFilterList;
    /**
     * A list of name/value string pairs associated with the finding. These are custom, user-defined fields added to a finding. 
     */
    UserDefinedFields?: MapFilterList;
    /**
     * The name of the malware that was observed.
     */
    MalwareName?: StringFilterList;
    /**
     * The type of the malware that was observed.
     */
    MalwareType?: StringFilterList;
    /**
     * The filesystem path of the malware that was observed.
     */
    MalwarePath?: StringFilterList;
    /**
     * The state of the malware that was observed.
     */
    MalwareState?: StringFilterList;
    /**
     * Indicates the direction of network traffic associated with a finding.
     */
    NetworkDirection?: StringFilterList;
    /**
     * The protocol of network-related information about a finding.
     */
    NetworkProtocol?: StringFilterList;
    /**
     * The source IPv4 address of network-related information about a finding.
     */
    NetworkSourceIpV4?: IpFilterList;
    /**
     * The source IPv6 address of network-related information about a finding.
     */
    NetworkSourceIpV6?: IpFilterList;
    /**
     * The source port of network-related information about a finding.
     */
    NetworkSourcePort?: NumberFilterList;
    /**
     * The source domain of network-related information about a finding.
     */
    NetworkSourceDomain?: StringFilterList;
    /**
     * The source media access control (MAC) address of network-related information about a finding.
     */
    NetworkSourceMac?: StringFilterList;
    /**
     * The destination IPv4 address of network-related information about a finding.
     */
    NetworkDestinationIpV4?: IpFilterList;
    /**
     * The destination IPv6 address of network-related information about a finding.
     */
    NetworkDestinationIpV6?: IpFilterList;
    /**
     * The destination port of network-related information about a finding.
     */
    NetworkDestinationPort?: NumberFilterList;
    /**
     * The destination domain of network-related information about a finding.
     */
    NetworkDestinationDomain?: StringFilterList;
    /**
     * The name of the process.
     */
    ProcessName?: StringFilterList;
    /**
     * The path to the process executable.
     */
    ProcessPath?: StringFilterList;
    /**
     * The process ID.
     */
    ProcessPid?: NumberFilterList;
    /**
     * The parent process ID.
     */
    ProcessParentPid?: NumberFilterList;
    /**
     * The date/time that the process was launched.
     */
    ProcessLaunchedAt?: DateFilterList;
    /**
     * The date/time that the process was terminated.
     */
    ProcessTerminatedAt?: DateFilterList;
    /**
     * The type of a threat intelligence indicator.
     */
    ThreatIntelIndicatorType?: StringFilterList;
    /**
     * The value of a threat intelligence indicator.
     */
    ThreatIntelIndicatorValue?: StringFilterList;
    /**
     * The category of a threat intelligence indicator.
     */
    ThreatIntelIndicatorCategory?: StringFilterList;
    /**
     * The date/time of the last observation of a threat intelligence indicator.
     */
    ThreatIntelIndicatorLastObservedAt?: DateFilterList;
    /**
     * The source of the threat intelligence.
     */
    ThreatIntelIndicatorSource?: StringFilterList;
    /**
     * The URL for more details from the source of the threat intelligence.
     */
    ThreatIntelIndicatorSourceUrl?: StringFilterList;
    /**
     * Specifies the type of the resource that details are provided for.
     */
    ResourceType?: StringFilterList;
    /**
     * The canonical identifier for the given resource type.
     */
    ResourceId?: StringFilterList;
    /**
     * The canonical Amazon Web Services partition name that the Region is assigned to.
     */
    ResourcePartition?: StringFilterList;
    /**
     * The canonical Amazon Web Services external Region name where this resource is located.
     */
    ResourceRegion?: StringFilterList;
    /**
     * A list of Amazon Web Services tags associated with a resource at the time the finding was processed.
     */
    ResourceTags?: MapFilterList;
    /**
     * The instance type of the instance.
     */
    ResourceAwsEc2InstanceType?: StringFilterList;
    /**
     * The Amazon Machine Image (AMI) ID of the instance.
     */
    ResourceAwsEc2InstanceImageId?: StringFilterList;
    /**
     * The IPv4 addresses associated with the instance.
     */
    ResourceAwsEc2InstanceIpV4Addresses?: IpFilterList;
    /**
     * The IPv6 addresses associated with the instance.
     */
    ResourceAwsEc2InstanceIpV6Addresses?: IpFilterList;
    /**
     * The key name associated with the instance.
     */
    ResourceAwsEc2InstanceKeyName?: StringFilterList;
    /**
     * The IAM profile ARN of the instance.
     */
    ResourceAwsEc2InstanceIamInstanceProfileArn?: StringFilterList;
    /**
     * The identifier of the VPC that the instance was launched in.
     */
    ResourceAwsEc2InstanceVpcId?: StringFilterList;
    /**
     * The identifier of the subnet that the instance was launched in.
     */
    ResourceAwsEc2InstanceSubnetId?: StringFilterList;
    /**
     * The date and time the instance was launched.
     */
    ResourceAwsEc2InstanceLaunchedAt?: DateFilterList;
    /**
     * The canonical user ID of the owner of the S3 bucket.
     */
    ResourceAwsS3BucketOwnerId?: StringFilterList;
    /**
     * The display name of the owner of the S3 bucket.
     */
    ResourceAwsS3BucketOwnerName?: StringFilterList;
    /**
     * The user associated with the IAM access key related to a finding.
     */
    ResourceAwsIamAccessKeyUserName?: StringFilterList;
    /**
     * The name of the principal that is associated with an IAM access key.
     */
    ResourceAwsIamAccessKeyPrincipalName?: StringFilterList;
    /**
     * The status of the IAM access key related to a finding.
     */
    ResourceAwsIamAccessKeyStatus?: StringFilterList;
    /**
     * The creation date/time of the IAM access key related to a finding.
     */
    ResourceAwsIamAccessKeyCreatedAt?: DateFilterList;
    /**
     * The name of an IAM user.
     */
    ResourceAwsIamUserUserName?: StringFilterList;
    /**
     * The name of the container related to a finding.
     */
    ResourceContainerName?: StringFilterList;
    /**
     * The identifier of the image related to a finding.
     */
    ResourceContainerImageId?: StringFilterList;
    /**
     * The name of the image related to a finding.
     */
    ResourceContainerImageName?: StringFilterList;
    /**
     * The date/time that the container was started.
     */
    ResourceContainerLaunchedAt?: DateFilterList;
    /**
     * The details of a resource that doesn't have a specific subfield for the resource type defined.
     */
    ResourceDetailsOther?: MapFilterList;
    /**
     * Exclusive to findings that are generated as the result of a check run against a specific rule in a supported standard, such as CIS Amazon Web Services Foundations. Contains security standard-related finding details.
     */
    ComplianceStatus?: StringFilterList;
    /**
     * The veracity of a finding.
     */
    VerificationState?: StringFilterList;
    /**
     * The workflow state of a finding. Note that this field is deprecated. To search for a finding based on its workflow status, use WorkflowStatus.
     */
    WorkflowState?: StringFilterList;
    /**
     * The status of the investigation into a finding. Allowed values are the following.    NEW - The initial state of a finding, before it is reviewed. Security Hub also resets the workflow status from NOTIFIED or RESOLVED to NEW in the following cases:   The record state changes from ARCHIVED to ACTIVE.   The compliance status changes from PASSED to either WARNING, FAILED, or NOT_AVAILABLE.      NOTIFIED - Indicates that the resource owner has been notified about the security issue. Used when the initial reviewer is not the resource owner, and needs intervention from the resource owner.    SUPPRESSED - The finding will not be reviewed again and will not be acted upon.    RESOLVED - The finding was reviewed and remediated and is now considered resolved.   
     */
    WorkflowStatus?: StringFilterList;
    /**
     * The updated record state for the finding.
     */
    RecordState?: StringFilterList;
    /**
     * The ARN of the solution that generated a related finding.
     */
    RelatedFindingsProductArn?: StringFilterList;
    /**
     * The solution-generated identifier for a related finding.
     */
    RelatedFindingsId?: StringFilterList;
    /**
     * The text of a note.
     */
    NoteText?: StringFilterList;
    /**
     * The timestamp of when the note was updated.
     */
    NoteUpdatedAt?: DateFilterList;
    /**
     * The principal that created a note.
     */
    NoteUpdatedBy?: StringFilterList;
    /**
     * A keyword for a finding.
     */
    Keyword?: KeywordFilterList;
    /**
     * The finding provider value for the finding confidence. Confidence is defined as the likelihood that a finding accurately identifies the behavior or issue that it was intended to identify. Confidence is scored on a 0-100 basis using a ratio scale, where 0 means zero percent confidence and 100 means 100 percent confidence.
     */
    FindingProviderFieldsConfidence?: NumberFilterList;
    /**
     * The finding provider value for the level of importance assigned to the resources associated with the findings. A score of 0 means that the underlying resources have no criticality, and a score of 100 is reserved for the most critical resources. 
     */
    FindingProviderFieldsCriticality?: NumberFilterList;
    /**
     * The finding identifier of a related finding that is identified by the finding provider.
     */
    FindingProviderFieldsRelatedFindingsId?: StringFilterList;
    /**
     * The ARN of the solution that generated a related finding that is identified by the finding provider.
     */
    FindingProviderFieldsRelatedFindingsProductArn?: StringFilterList;
    /**
     * The finding provider value for the severity label.
     */
    FindingProviderFieldsSeverityLabel?: StringFilterList;
    /**
     * The finding provider's original value for the severity.
     */
    FindingProviderFieldsSeverityOriginal?: StringFilterList;
    /**
     * One or more finding types that the finding provider assigned to the finding. Uses the format of namespace/category/classifier that classify a finding. Valid namespace values are: Software and Configuration Checks | TTPs | Effects | Unusual Behaviors | Sensitive Data Identifications
     */
    FindingProviderFieldsTypes?: StringFilterList;
  }
  export interface AwsSecurityFindingIdentifier {
    /**
     * The identifier of the finding that was specified by the finding provider.
     */
    Id: NonEmptyString;
    /**
     * The ARN generated by Security Hub that uniquely identifies a product that generates findings. This can be the ARN for a third-party product that is integrated with Security Hub, or the ARN for a custom integration.
     */
    ProductArn: NonEmptyString;
  }
  export type AwsSecurityFindingIdentifierList = AwsSecurityFindingIdentifier[];
  export type AwsSecurityFindingList = AwsSecurityFinding[];
  export interface AwsSnsTopicDetails {
    /**
     * The ID of an Amazon Web Services managed key for Amazon SNS or a customer managed key.
     */
    KmsMasterKeyId?: NonEmptyString;
    /**
     * Subscription is an embedded property that describes the subscription endpoints of an SNS topic.
     */
    Subscription?: AwsSnsTopicSubscriptionList;
    /**
     * The name of the topic.
     */
    TopicName?: NonEmptyString;
    /**
     * The subscription's owner.
     */
    Owner?: NonEmptyString;
  }
  export interface AwsSnsTopicSubscription {
    /**
     * The subscription's endpoint (format depends on the protocol).
     */
    Endpoint?: NonEmptyString;
    /**
     * The subscription's protocol.
     */
    Protocol?: NonEmptyString;
  }
  export type AwsSnsTopicSubscriptionList = AwsSnsTopicSubscription[];
  export interface AwsSqsQueueDetails {
    /**
     * The length of time, in seconds, for which Amazon SQS can reuse a data key to encrypt or decrypt messages before calling KMS again.
     */
    KmsDataKeyReusePeriodSeconds?: Integer;
    /**
     * The ID of an Amazon Web Services managed key for Amazon SQS or a custom KMS key.
     */
    KmsMasterKeyId?: NonEmptyString;
    /**
     * The name of the new queue.
     */
    QueueName?: NonEmptyString;
    /**
     * The ARN of the dead-letter queue to which Amazon SQS moves messages after the value of maxReceiveCount is exceeded. 
     */
    DeadLetterTargetArn?: NonEmptyString;
  }
  export interface AwsSsmComplianceSummary {
    /**
     * The current patch compliance status. The possible status values are:    COMPLIANT     NON_COMPLIANT     UNSPECIFIED_DATA   
     */
    Status?: NonEmptyString;
    /**
     * For the patches that are compliant, the number that have a severity of CRITICAL.
     */
    CompliantCriticalCount?: Integer;
    /**
     * For the patches that are compliant, the number that have a severity of HIGH.
     */
    CompliantHighCount?: Integer;
    /**
     * For the patches that are compliant, the number that have a severity of MEDIUM.
     */
    CompliantMediumCount?: Integer;
    /**
     * The type of execution that was used determine compliance.
     */
    ExecutionType?: NonEmptyString;
    /**
     * For the patch items that are noncompliant, the number of items that have a severity of CRITICAL.
     */
    NonCompliantCriticalCount?: Integer;
    /**
     * For the patches that are compliant, the number that have a severity of INFORMATIONAL.
     */
    CompliantInformationalCount?: Integer;
    /**
     * For the patches that are noncompliant, the number that have a severity of INFORMATIONAL.
     */
    NonCompliantInformationalCount?: Integer;
    /**
     * For the patches that are compliant, the number that have a severity of UNSPECIFIED.
     */
    CompliantUnspecifiedCount?: Integer;
    /**
     * For the patches that are noncompliant, the number that have a severity of LOW.
     */
    NonCompliantLowCount?: Integer;
    /**
     * For the patches that are noncompliant, the number that have a severity of HIGH.
     */
    NonCompliantHighCount?: Integer;
    /**
     * For the patches that are compliant, the number that have a severity of LOW.
     */
    CompliantLowCount?: Integer;
    /**
     * The type of resource for which the compliance was determined. For AwsSsmPatchCompliance, ComplianceType is Patch. 
     */
    ComplianceType?: NonEmptyString;
    /**
     * The identifier of the patch baseline. The patch baseline lists the patches that are approved for installation.
     */
    PatchBaselineId?: NonEmptyString;
    /**
     * The highest severity for the patches.
     */
    OverallSeverity?: NonEmptyString;
    /**
     * For the patches that are noncompliant, the number that have a severity of MEDIUM.
     */
    NonCompliantMediumCount?: Integer;
    /**
     * For the patches that are noncompliant, the number that have a severity of UNSPECIFIED.
     */
    NonCompliantUnspecifiedCount?: Integer;
    /**
     * The identifier of the patch group for which compliance was determined. A patch group uses tags to group EC2 instances that should have the same patch compliance.
     */
    PatchGroup?: NonEmptyString;
  }
  export interface AwsSsmPatch {
    /**
     * The compliance status details for the patch.
     */
    ComplianceSummary?: AwsSsmComplianceSummary;
  }
  export interface AwsSsmPatchComplianceDetails {
    /**
     * Information about the status of a patch.
     */
    Patch?: AwsSsmPatch;
  }
  export interface AwsWafRateBasedRuleDetails {
    /**
     * The name of the metrics for the rate-based rule.
     */
    MetricName?: NonEmptyString;
    /**
     * The name of the rate-based rule.
     */
    Name?: NonEmptyString;
    /**
     * The field that WAF uses to determine whether requests are likely arriving from single source and are subject to rate monitoring.
     */
    RateKey?: NonEmptyString;
    /**
     * The maximum number of requests that have an identical value for the field specified in RateKey that are allowed within a five-minute period. If the number of requests exceeds RateLimit and the other predicates specified in the rule are met, WAF triggers the action for the rule.
     */
    RateLimit?: Long;
    /**
     * The unique identifier for the rate-based rule.
     */
    RuleId?: NonEmptyString;
    /**
     * The predicates to include in the rate-based rule.
     */
    MatchPredicates?: AwsWafRateBasedRuleMatchPredicateList;
  }
  export interface AwsWafRateBasedRuleMatchPredicate {
    /**
     * The unique identifier for the predicate.
     */
    DataId?: NonEmptyString;
    /**
     * If set to true, then the rule actions are performed on requests that match the predicate settings. If set to false, then the rule actions are performed on all requests except those that match the predicate settings. 
     */
    Negated?: Boolean;
    /**
     * The type of predicate.
     */
    Type?: NonEmptyString;
  }
  export type AwsWafRateBasedRuleMatchPredicateList = AwsWafRateBasedRuleMatchPredicate[];
  export interface AwsWafRegionalRateBasedRuleDetails {
    /**
     * The name of the metrics for the rate-based rule.
     */
    MetricName?: NonEmptyString;
    /**
     * The name of the rate-based rule.
     */
    Name?: NonEmptyString;
    /**
     * The field that WAF uses to determine whether requests are likely arriving from single source and are subject to rate monitoring.
     */
    RateKey?: NonEmptyString;
    /**
     * The maximum number of requests that have an identical value for the field specified in RateKey that are allowed within a five-minute period. If the number of requests exceeds RateLimit and the other predicates specified in the rule are met, WAF triggers the action for the rule.
     */
    RateLimit?: Long;
    /**
     * The unique identifier for the rate-based rule.
     */
    RuleId?: NonEmptyString;
    /**
     * The predicates to include in the rate-based rule.
     */
    MatchPredicates?: AwsWafRegionalRateBasedRuleMatchPredicateList;
  }
  export interface AwsWafRegionalRateBasedRuleMatchPredicate {
    /**
     * The unique identifier for the predicate.
     */
    DataId?: NonEmptyString;
    /**
     * If set to true, then the rule actions are performed on requests that match the predicate settings. If set to false, then the rule actions are performed on all requests except those that match the predicate settings.
     */
    Negated?: Boolean;
    /**
     * The type of predicate.
     */
    Type?: NonEmptyString;
  }
  export type AwsWafRegionalRateBasedRuleMatchPredicateList = AwsWafRegionalRateBasedRuleMatchPredicate[];
  export interface AwsWafWebAclDetails {
    /**
     * A friendly name or description of the WebACL. You can't change the name of a WebACL after you create it.
     */
    Name?: NonEmptyString;
    /**
     * The action to perform if none of the rules contained in the WebACL match.
     */
    DefaultAction?: NonEmptyString;
    /**
     * An array that contains the action for each rule in a WebACL, the priority of the rule, and the ID of the rule.
     */
    Rules?: AwsWafWebAclRuleList;
    /**
     * A unique identifier for a WebACL.
     */
    WebAclId?: NonEmptyString;
  }
  export interface AwsWafWebAclRule {
    /**
     * Specifies the action that CloudFront or WAF takes when a web request matches the conditions in the rule. 
     */
    Action?: WafAction;
    /**
     * Rules to exclude from a rule group.
     */
    ExcludedRules?: WafExcludedRuleList;
    /**
     * Use the OverrideAction to test your RuleGroup. Any rule in a RuleGroup can potentially block a request. If you set the OverrideAction to None, the RuleGroup blocks a request if any individual rule in the RuleGroup matches the request and is configured to block that request. However, if you first want to test the RuleGroup, set the OverrideAction to Count. The RuleGroup then overrides any block action specified by individual rules contained within the group. Instead of blocking matching requests, those requests are counted.  ActivatedRule|OverrideAction applies only when updating or adding a RuleGroup to a WebACL. In this case you do not use ActivatedRule|Action. For all other update requests, ActivatedRule|Action is used instead of ActivatedRule|OverrideAction. 
     */
    OverrideAction?: WafOverrideAction;
    /**
     * Specifies the order in which the rules in a WebACL are evaluated. Rules with a lower value for Priority are evaluated before rules with a higher value. The value must be a unique integer. If you add multiple rules to a WebACL, the values do not need to be consecutive.
     */
    Priority?: Integer;
    /**
     * The identifier for a rule.
     */
    RuleId?: NonEmptyString;
    /**
     * The rule type. Valid values: REGULAR | RATE_BASED | GROUP  The default is REGULAR.
     */
    Type?: NonEmptyString;
  }
  export type AwsWafWebAclRuleList = AwsWafWebAclRule[];
  export interface AwsXrayEncryptionConfigDetails {
    /**
     * The identifier of the KMS key that is used for encryption. Provided if Type is KMS.
     */
    KeyId?: NonEmptyString;
    /**
     * The current status of the encryption configuration. When Status is UPDATING, X-Ray might use both the old and new encryption.
     */
    Status?: NonEmptyString;
    /**
     * The type of encryption. KMS indicates that the encryption uses KMS keys. NONE indicates to use the default encryption.
     */
    Type?: NonEmptyString;
  }
  export interface BatchDisableStandardsRequest {
    /**
     * The ARNs of the standards subscriptions to disable.
     */
    StandardsSubscriptionArns: StandardsSubscriptionArns;
  }
  export interface BatchDisableStandardsResponse {
    /**
     * The details of the standards subscriptions that were disabled.
     */
    StandardsSubscriptions?: StandardsSubscriptions;
  }
  export interface BatchEnableStandardsRequest {
    /**
     * The list of standards checks to enable.
     */
    StandardsSubscriptionRequests: StandardsSubscriptionRequests;
  }
  export interface BatchEnableStandardsResponse {
    /**
     * The details of the standards subscriptions that were enabled.
     */
    StandardsSubscriptions?: StandardsSubscriptions;
  }
  export interface BatchImportFindingsRequest {
    /**
     * A list of findings to import. To successfully import a finding, it must follow the Amazon Web Services Security Finding Format. Maximum of 100 findings per request.
     */
    Findings: BatchImportFindingsRequestFindingList;
  }
  export type BatchImportFindingsRequestFindingList = AwsSecurityFinding[];
  export interface BatchImportFindingsResponse {
    /**
     * The number of findings that failed to import.
     */
    FailedCount: Integer;
    /**
     * The number of findings that were successfully imported.
     */
    SuccessCount: Integer;
    /**
     * The list of findings that failed to import.
     */
    FailedFindings?: ImportFindingsErrorList;
  }
  export interface BatchUpdateFindingsRequest {
    /**
     * The list of findings to update. BatchUpdateFindings can be used to update up to 100 findings at a time. For each finding, the list provides the finding identifier and the ARN of the finding provider.
     */
    FindingIdentifiers: AwsSecurityFindingIdentifierList;
    Note?: NoteUpdate;
    /**
     * Used to update the finding severity.
     */
    Severity?: SeverityUpdate;
    /**
     * Indicates the veracity of a finding. The available values for VerificationState are as follows.    UNKNOWN – The default disposition of a security finding    TRUE_POSITIVE – The security finding is confirmed    FALSE_POSITIVE – The security finding was determined to be a false alarm    BENIGN_POSITIVE – A special case of TRUE_POSITIVE where the finding doesn't pose any threat, is expected, or both  
     */
    VerificationState?: VerificationState;
    /**
     * The updated value for the finding confidence. Confidence is defined as the likelihood that a finding accurately identifies the behavior or issue that it was intended to identify. Confidence is scored on a 0-100 basis using a ratio scale, where 0 means zero percent confidence and 100 means 100 percent confidence.
     */
    Confidence?: RatioScale;
    /**
     * The updated value for the level of importance assigned to the resources associated with the findings. A score of 0 means that the underlying resources have no criticality, and a score of 100 is reserved for the most critical resources. 
     */
    Criticality?: RatioScale;
    /**
     * One or more finding types in the format of namespace/category/classifier that classify a finding. Valid namespace values are as follows.   Software and Configuration Checks   TTPs   Effects   Unusual Behaviors   Sensitive Data Identifications   
     */
    Types?: TypeList;
    /**
     * A list of name/value string pairs associated with the finding. These are custom, user-defined fields added to a finding.
     */
    UserDefinedFields?: FieldMap;
    /**
     * Used to update the workflow status of a finding. The workflow status indicates the progress of the investigation into the finding. 
     */
    Workflow?: WorkflowUpdate;
    /**
     * A list of findings that are related to the updated findings.
     */
    RelatedFindings?: RelatedFindingList;
  }
  export interface BatchUpdateFindingsResponse {
    /**
     * The list of findings that were updated successfully.
     */
    ProcessedFindings: AwsSecurityFindingIdentifierList;
    /**
     * The list of findings that were not updated.
     */
    UnprocessedFindings: BatchUpdateFindingsUnprocessedFindingsList;
  }
  export interface BatchUpdateFindingsUnprocessedFinding {
    /**
     * The identifier of the finding that was not updated.
     */
    FindingIdentifier: AwsSecurityFindingIdentifier;
    /**
     * The code associated with the error.
     */
    ErrorCode: NonEmptyString;
    /**
     * The message associated with the error.
     */
    ErrorMessage: NonEmptyString;
  }
  export type BatchUpdateFindingsUnprocessedFindingsList = BatchUpdateFindingsUnprocessedFinding[];
  export type Boolean = boolean;
  export type CategoryList = NonEmptyString[];
  export interface Cell {
    /**
     * The column number of the column that contains the data. For a Microsoft Excel workbook, the column number corresponds to the alphabetical column identifiers. For example, a value of 1 for Column corresponds to the A column in the workbook.
     */
    Column?: Long;
    /**
     * The row number of the row that contains the data.
     */
    Row?: Long;
    /**
     * The name of the column that contains the data.
     */
    ColumnName?: NonEmptyString;
    /**
     * For a Microsoft Excel workbook, provides the location of the cell, as an absolute cell reference, that contains the data. For example, Sheet2!C5 for cell C5 on Sheet2.
     */
    CellReference?: NonEmptyString;
  }
  export type Cells = Cell[];
  export interface CidrBlockAssociation {
    /**
     * The association ID for the IPv4 CIDR block.
     */
    AssociationId?: NonEmptyString;
    /**
     * The IPv4 CIDR block.
     */
    CidrBlock?: NonEmptyString;
    /**
     * Information about the state of the IPv4 CIDR block.
     */
    CidrBlockState?: NonEmptyString;
  }
  export type CidrBlockAssociationList = CidrBlockAssociation[];
  export interface City {
    /**
     * The name of the city.
     */
    CityName?: NonEmptyString;
  }
  export interface ClassificationResult {
    /**
     * The type of content that the finding applies to.
     */
    MimeType?: NonEmptyString;
    /**
     * The total size in bytes of the affected data.
     */
    SizeClassified?: Long;
    /**
     * Indicates whether there are additional occurrences of sensitive data that are not included in the finding. This occurs when the number of occurrences exceeds the maximum that can be included.
     */
    AdditionalOccurrences?: Boolean;
    /**
     * The current status of the sensitive data detection.
     */
    Status?: ClassificationStatus;
    /**
     * Provides details about sensitive data that was identified based on built-in configuration.
     */
    SensitiveData?: SensitiveDataResultList;
    /**
     * Provides details about sensitive data that was identified based on customer-defined configuration.
     */
    CustomDataIdentifiers?: CustomDataIdentifiersResult;
  }
  export interface ClassificationStatus {
    /**
     * The code that represents the status of the sensitive data detection.
     */
    Code?: NonEmptyString;
    /**
     * A longer description of the current status of the sensitive data detection.
     */
    Reason?: NonEmptyString;
  }
  export interface Compliance {
    /**
     * The result of a standards check. The valid values for Status are as follows.      PASSED - Standards check passed for all evaluated resources.    WARNING - Some information is missing or this check is not supported for your configuration.    FAILED - Standards check failed for at least one evaluated resource.    NOT_AVAILABLE - Check could not be performed due to a service outage, API error, or because the result of the Config evaluation was NOT_APPLICABLE. If the Config evaluation result was NOT_APPLICABLE, then after 3 days, Security Hub automatically archives the finding.    
     */
    Status?: ComplianceStatus;
    /**
     * For a control, the industry or regulatory framework requirements that are related to the control. The check for that control is aligned with these requirements.
     */
    RelatedRequirements?: RelatedRequirementsList;
    /**
     * For findings generated from controls, a list of reasons behind the value of Status. For the list of status reason codes and their meanings, see Standards-related information in the ASFF in the Security Hub User Guide. 
     */
    StatusReasons?: StatusReasonsList;
  }
  export type ComplianceStatus = "PASSED"|"WARNING"|"FAILED"|"NOT_AVAILABLE"|string;
  export interface ContainerDetails {
    /**
     * The name of the container related to a finding.
     */
    Name?: NonEmptyString;
    /**
     * The identifier of the image related to a finding.
     */
    ImageId?: NonEmptyString;
    /**
     * The name of the image related to a finding.
     */
    ImageName?: NonEmptyString;
    /**
     * Indicates when the container started. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LaunchedAt?: NonEmptyString;
  }
  export type ControlStatus = "ENABLED"|"DISABLED"|string;
  export interface Country {
    /**
     * The 2-letter ISO 3166 country code for the country.
     */
    CountryCode?: NonEmptyString;
    /**
     * The name of the country.
     */
    CountryName?: NonEmptyString;
  }
  export interface CreateActionTargetRequest {
    /**
     * The name of the custom action target. Can contain up to 20 characters.
     */
    Name: NonEmptyString;
    /**
     * The description for the custom action target.
     */
    Description: NonEmptyString;
    /**
     * The ID for the custom action target. Can contain up to 20 alphanumeric characters.
     */
    Id: NonEmptyString;
  }
  export interface CreateActionTargetResponse {
    /**
     * The ARN for the custom action target.
     */
    ActionTargetArn: NonEmptyString;
  }
  export interface CreateFindingAggregatorRequest {
    /**
     * Indicates whether to aggregate findings from all of the available Regions in the current partition. Also determines whether to automatically aggregate findings from new Regions as Security Hub supports them and you opt into them. The selected option also determines how to use the Regions provided in the Regions list. The options are as follows:    ALL_REGIONS - Indicates to aggregate findings from all of the Regions where Security Hub is enabled. When you choose this option, Security Hub also automatically aggregates findings from new Regions as Security Hub supports them and you opt into them.     ALL_REGIONS_EXCEPT_SPECIFIED - Indicates to aggregate findings from all of the Regions where Security Hub is enabled, except for the Regions listed in the Regions parameter. When you choose this option, Security Hub also automatically aggregates findings from new Regions as Security Hub supports them and you opt into them.     SPECIFIED_REGIONS - Indicates to aggregate findings only from the Regions listed in the Regions parameter. Security Hub does not automatically aggregate findings from new Regions.   
     */
    RegionLinkingMode: NonEmptyString;
    /**
     * If RegionLinkingMode is ALL_REGIONS_EXCEPT_SPECIFIED, then this is a comma-separated list of Regions that do not aggregate findings to the aggregation Region. If RegionLinkingMode is SPECIFIED_REGIONS, then this is a comma-separated list of Regions that do aggregate findings to the aggregation Region. 
     */
    Regions?: StringList;
  }
  export interface CreateFindingAggregatorResponse {
    /**
     * The ARN of the finding aggregator. You use the finding aggregator ARN to retrieve details for, update, and stop finding aggregation.
     */
    FindingAggregatorArn?: NonEmptyString;
    /**
     * The aggregation Region.
     */
    FindingAggregationRegion?: NonEmptyString;
    /**
     * Indicates whether to link all Regions, all Regions except for a list of excluded Regions, or a list of included Regions.
     */
    RegionLinkingMode?: NonEmptyString;
    /**
     * The list of excluded Regions or included Regions.
     */
    Regions?: StringList;
  }
  export interface CreateInsightRequest {
    /**
     * The name of the custom insight to create.
     */
    Name: NonEmptyString;
    /**
     * One or more attributes used to filter the findings included in the insight. The insight only includes findings that match the criteria defined in the filters.
     */
    Filters: AwsSecurityFindingFilters;
    /**
     * The attribute used to group the findings for the insight. The grouping attribute identifies the type of item that the insight applies to. For example, if an insight is grouped by resource identifier, then the insight produces a list of resource identifiers.
     */
    GroupByAttribute: NonEmptyString;
  }
  export interface CreateInsightResponse {
    /**
     * The ARN of the insight created.
     */
    InsightArn: NonEmptyString;
  }
  export interface CreateMembersRequest {
    /**
     * The list of accounts to associate with the Security Hub administrator account. For each account, the list includes the account ID and optionally the email address.
     */
    AccountDetails: AccountDetailsList;
  }
  export interface CreateMembersResponse {
    /**
     * The list of Amazon Web Services accounts that were not processed. For each account, the list includes the account ID and the email address.
     */
    UnprocessedAccounts?: ResultList;
  }
  export type CrossAccountMaxResults = number;
  export interface CustomDataIdentifiersDetections {
    /**
     * The total number of occurrences of sensitive data that were detected.
     */
    Count?: Long;
    /**
     * The ARN of the custom identifier that was used to detect the sensitive data.
     */
    Arn?: NonEmptyString;
    /**
     * he name of the custom identifier that detected the sensitive data.
     */
    Name?: NonEmptyString;
    /**
     * Details about the sensitive data that was detected.
     */
    Occurrences?: Occurrences;
  }
  export type CustomDataIdentifiersDetectionsList = CustomDataIdentifiersDetections[];
  export interface CustomDataIdentifiersResult {
    /**
     * The list of detected instances of sensitive data.
     */
    Detections?: CustomDataIdentifiersDetectionsList;
    /**
     * The total number of occurrences of sensitive data.
     */
    TotalCount?: Long;
  }
  export interface Cvss {
    /**
     * The version of CVSS for the CVSS score.
     */
    Version?: NonEmptyString;
    /**
     * The base CVSS score.
     */
    BaseScore?: Double;
    /**
     * The base scoring vector for the CVSS score.
     */
    BaseVector?: NonEmptyString;
    /**
     * The origin of the original CVSS score and vector.
     */
    Source?: NonEmptyString;
    /**
     * Adjustments to the CVSS metrics.
     */
    Adjustments?: AdjustmentList;
  }
  export type CvssList = Cvss[];
  export interface DataClassificationDetails {
    /**
     * The path to the folder or file that contains the sensitive data.
     */
    DetailedResultsLocation?: NonEmptyString;
    /**
     * The details about the sensitive data that was detected on the resource.
     */
    Result?: ClassificationResult;
  }
  export interface DateFilter {
    /**
     * A start date for the date filter.
     */
    Start?: NonEmptyString;
    /**
     * An end date for the date filter.
     */
    End?: NonEmptyString;
    /**
     * A date range for the date filter.
     */
    DateRange?: DateRange;
  }
  export type DateFilterList = DateFilter[];
  export interface DateRange {
    /**
     * A date range value for the date filter.
     */
    Value?: Integer;
    /**
     * A date range unit for the date filter.
     */
    Unit?: DateRangeUnit;
  }
  export type DateRangeUnit = "DAYS"|string;
  export interface DeclineInvitationsRequest {
    /**
     * The list of account IDs for the accounts from which to decline the invitations to Security Hub.
     */
    AccountIds: AccountIdList;
  }
  export interface DeclineInvitationsResponse {
    /**
     * The list of Amazon Web Services accounts that were not processed. For each account, the list includes the account ID and the email address.
     */
    UnprocessedAccounts?: ResultList;
  }
  export interface DeleteActionTargetRequest {
    /**
     * The ARN of the custom action target to delete.
     */
    ActionTargetArn: NonEmptyString;
  }
  export interface DeleteActionTargetResponse {
    /**
     * The ARN of the custom action target that was deleted.
     */
    ActionTargetArn: NonEmptyString;
  }
  export interface DeleteFindingAggregatorRequest {
    /**
     * The ARN of the finding aggregator to delete. To obtain the ARN, use ListFindingAggregators.
     */
    FindingAggregatorArn: NonEmptyString;
  }
  export interface DeleteFindingAggregatorResponse {
  }
  export interface DeleteInsightRequest {
    /**
     * The ARN of the insight to delete.
     */
    InsightArn: NonEmptyString;
  }
  export interface DeleteInsightResponse {
    /**
     * The ARN of the insight that was deleted.
     */
    InsightArn: NonEmptyString;
  }
  export interface DeleteInvitationsRequest {
    /**
     * The list of the account IDs that sent the invitations to delete.
     */
    AccountIds: AccountIdList;
  }
  export interface DeleteInvitationsResponse {
    /**
     * The list of Amazon Web Services accounts for which the invitations were not deleted. For each account, the list includes the account ID and the email address.
     */
    UnprocessedAccounts?: ResultList;
  }
  export interface DeleteMembersRequest {
    /**
     * The list of account IDs for the member accounts to delete.
     */
    AccountIds: AccountIdList;
  }
  export interface DeleteMembersResponse {
    /**
     * The list of Amazon Web Services accounts that were not deleted. For each account, the list includes the account ID and the email address.
     */
    UnprocessedAccounts?: ResultList;
  }
  export interface DescribeActionTargetsRequest {
    /**
     * A list of custom action target ARNs for the custom action targets to retrieve.
     */
    ActionTargetArns?: ArnList;
    /**
     * The token that is required for pagination. On your first call to the DescribeActionTargets operation, set the value of this parameter to NULL. For subsequent calls to the operation, to continue listing data, set the value of this parameter to the value returned from the previous response.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeActionTargetsResponse {
    /**
     * A list of ActionTarget objects. Each object includes the ActionTargetArn, Description, and Name of a custom action target available in Security Hub.
     */
    ActionTargets: ActionTargetList;
    /**
     * The pagination token to use to request the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeHubRequest {
    /**
     * The ARN of the Hub resource to retrieve.
     */
    HubArn?: NonEmptyString;
  }
  export interface DescribeHubResponse {
    /**
     * The ARN of the Hub resource that was retrieved.
     */
    HubArn?: NonEmptyString;
    /**
     * The date and time when Security Hub was enabled in the account.
     */
    SubscribedAt?: NonEmptyString;
    /**
     * Whether to automatically enable new controls when they are added to standards that are enabled. If set to true, then new controls for enabled standards are enabled automatically. If set to false, then new controls are not enabled.
     */
    AutoEnableControls?: Boolean;
  }
  export interface DescribeOrganizationConfigurationRequest {
  }
  export interface DescribeOrganizationConfigurationResponse {
    /**
     * Whether to automatically enable Security Hub for new accounts in the organization. If set to true, then Security Hub is enabled for new accounts. If set to false, then new accounts are not added automatically.
     */
    AutoEnable?: Boolean;
    /**
     * Whether the maximum number of allowed member accounts are already associated with the Security Hub administrator account.
     */
    MemberAccountLimitReached?: Boolean;
  }
  export interface DescribeProductsRequest {
    /**
     * The token that is required for pagination. On your first call to the DescribeProducts operation, set the value of this parameter to NULL. For subsequent calls to the operation, to continue listing data, set the value of this parameter to the value returned from the previous response.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The ARN of the integration to return.
     */
    ProductArn?: NonEmptyString;
  }
  export interface DescribeProductsResponse {
    /**
     * A list of products, including details for each product.
     */
    Products: ProductsList;
    /**
     * The pagination token to use to request the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeStandardsControlsRequest {
    /**
     * The ARN of a resource that represents your subscription to a supported standard. To get the subscription ARNs of the standards you have enabled, use the GetEnabledStandards operation.
     */
    StandardsSubscriptionArn: NonEmptyString;
    /**
     * The token that is required for pagination. On your first call to the DescribeStandardsControls operation, set the value of this parameter to NULL. For subsequent calls to the operation, to continue listing data, set the value of this parameter to the value returned from the previous response.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of security standard controls to return.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeStandardsControlsResponse {
    /**
     * A list of security standards controls.
     */
    Controls?: StandardsControls;
    /**
     * The pagination token to use to request the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeStandardsRequest {
    /**
     * The token that is required for pagination. On your first call to the DescribeStandards operation, set the value of this parameter to NULL. For subsequent calls to the operation, to continue listing data, set the value of this parameter to the value returned from the previous response.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of standards to return.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeStandardsResponse {
    /**
     * A list of available standards.
     */
    Standards?: Standards;
    /**
     * The pagination token to use to request the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface DisableImportFindingsForProductRequest {
    /**
     * The ARN of the integrated product to disable the integration for.
     */
    ProductSubscriptionArn: NonEmptyString;
  }
  export interface DisableImportFindingsForProductResponse {
  }
  export interface DisableOrganizationAdminAccountRequest {
    /**
     * The Amazon Web Services account identifier of the Security Hub administrator account.
     */
    AdminAccountId: NonEmptyString;
  }
  export interface DisableOrganizationAdminAccountResponse {
  }
  export interface DisableSecurityHubRequest {
  }
  export interface DisableSecurityHubResponse {
  }
  export interface DisassociateFromAdministratorAccountRequest {
  }
  export interface DisassociateFromAdministratorAccountResponse {
  }
  export interface DisassociateFromMasterAccountRequest {
  }
  export interface DisassociateFromMasterAccountResponse {
  }
  export interface DisassociateMembersRequest {
    /**
     * The account IDs of the member accounts to disassociate from the administrator account.
     */
    AccountIds: AccountIdList;
  }
  export interface DisassociateMembersResponse {
  }
  export interface DnsRequestAction {
    /**
     * The DNS domain that is associated with the DNS request.
     */
    Domain?: NonEmptyString;
    /**
     * The protocol that was used for the DNS request.
     */
    Protocol?: NonEmptyString;
    /**
     * Indicates whether the DNS request was blocked.
     */
    Blocked?: Boolean;
  }
  export type Double = number;
  export interface EnableImportFindingsForProductRequest {
    /**
     * The ARN of the product to enable the integration for.
     */
    ProductArn: NonEmptyString;
  }
  export interface EnableImportFindingsForProductResponse {
    /**
     * The ARN of your subscription to the product to enable integrations for.
     */
    ProductSubscriptionArn?: NonEmptyString;
  }
  export interface EnableOrganizationAdminAccountRequest {
    /**
     * The Amazon Web Services account identifier of the account to designate as the Security Hub administrator account.
     */
    AdminAccountId: NonEmptyString;
  }
  export interface EnableOrganizationAdminAccountResponse {
  }
  export interface EnableSecurityHubRequest {
    /**
     * The tags to add to the hub resource when you enable Security Hub.
     */
    Tags?: TagMap;
    /**
     * Whether to enable the security standards that Security Hub has designated as automatically enabled. If you do not provide a value for EnableDefaultStandards, it is set to true. To not enable the automatically enabled standards, set EnableDefaultStandards to false.
     */
    EnableDefaultStandards?: Boolean;
  }
  export interface EnableSecurityHubResponse {
  }
  export type FieldMap = {[key: string]: NonEmptyString};
  export interface FindingAggregator {
    /**
     * The ARN of the finding aggregator. You use the finding aggregator ARN to retrieve details for, update, and delete the finding aggregator.
     */
    FindingAggregatorArn?: NonEmptyString;
  }
  export type FindingAggregatorList = FindingAggregator[];
  export interface FindingProviderFields {
    /**
     * A finding's confidence. Confidence is defined as the likelihood that a finding accurately identifies the behavior or issue that it was intended to identify. Confidence is scored on a 0-100 basis using a ratio scale, where 0 means zero percent confidence and 100 means 100 percent confidence.
     */
    Confidence?: RatioScale;
    /**
     * The level of importance assigned to the resources associated with the finding. A score of 0 means that the underlying resources have no criticality, and a score of 100 is reserved for the most critical resources.
     */
    Criticality?: RatioScale;
    /**
     * A list of findings that are related to the current finding.
     */
    RelatedFindings?: RelatedFindingList;
    /**
     * The severity of a finding.
     */
    Severity?: FindingProviderSeverity;
    /**
     * One or more finding types in the format of namespace/category/classifier that classify a finding. Valid namespace values are: Software and Configuration Checks | TTPs | Effects | Unusual Behaviors | Sensitive Data Identifications
     */
    Types?: TypeList;
  }
  export interface FindingProviderSeverity {
    /**
     * The severity label assigned to the finding by the finding provider.
     */
    Label?: SeverityLabel;
    /**
     * The finding provider's original value for the severity.
     */
    Original?: NonEmptyString;
  }
  export interface GeoLocation {
    /**
     * The longitude of the location.
     */
    Lon?: Double;
    /**
     * The latitude of the location.
     */
    Lat?: Double;
  }
  export interface GetAdministratorAccountRequest {
  }
  export interface GetAdministratorAccountResponse {
    Administrator?: Invitation;
  }
  export interface GetEnabledStandardsRequest {
    /**
     * The list of the standards subscription ARNs for the standards to retrieve.
     */
    StandardsSubscriptionArns?: StandardsSubscriptionArns;
    /**
     * The token that is required for pagination. On your first call to the GetEnabledStandards operation, set the value of this parameter to NULL. For subsequent calls to the operation, to continue listing data, set the value of this parameter to the value returned from the previous response.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface GetEnabledStandardsResponse {
    /**
     * The list of StandardsSubscriptions objects that include information about the enabled standards.
     */
    StandardsSubscriptions?: StandardsSubscriptions;
    /**
     * The pagination token to use to request the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetFindingAggregatorRequest {
    /**
     * The ARN of the finding aggregator to return details for. To obtain the ARN, use ListFindingAggregators.
     */
    FindingAggregatorArn: NonEmptyString;
  }
  export interface GetFindingAggregatorResponse {
    /**
     * The ARN of the finding aggregator.
     */
    FindingAggregatorArn?: NonEmptyString;
    /**
     * The aggregation Region.
     */
    FindingAggregationRegion?: NonEmptyString;
    /**
     * Indicates whether to link all Regions, all Regions except for a list of excluded Regions, or a list of included Regions.
     */
    RegionLinkingMode?: NonEmptyString;
    /**
     * The list of excluded Regions or included Regions.
     */
    Regions?: StringList;
  }
  export interface GetFindingsRequest {
    /**
     * The finding attributes used to define a condition to filter the returned findings. You can filter by up to 10 finding attributes. For each attribute, you can provide up to 20 filter values. Note that in the available filter fields, WorkflowState is deprecated. To search for a finding based on its workflow status, use WorkflowStatus.
     */
    Filters?: AwsSecurityFindingFilters;
    /**
     * The finding attributes used to sort the list of returned findings.
     */
    SortCriteria?: SortCriteria;
    /**
     * The token that is required for pagination. On your first call to the GetFindings operation, set the value of this parameter to NULL. For subsequent calls to the operation, to continue listing data, set the value of this parameter to the value returned from the previous response.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of findings to return.
     */
    MaxResults?: MaxResults;
  }
  export interface GetFindingsResponse {
    /**
     * The findings that matched the filters specified in the request.
     */
    Findings: AwsSecurityFindingList;
    /**
     * The pagination token to use to request the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetInsightResultsRequest {
    /**
     * The ARN of the insight for which to return results.
     */
    InsightArn: NonEmptyString;
  }
  export interface GetInsightResultsResponse {
    /**
     * The insight results returned by the operation.
     */
    InsightResults: InsightResults;
  }
  export interface GetInsightsRequest {
    /**
     * The ARNs of the insights to describe. If you do not provide any insight ARNs, then GetInsights returns all of your custom insights. It does not return any managed insights.
     */
    InsightArns?: ArnList;
    /**
     * The token that is required for pagination. On your first call to the GetInsights operation, set the value of this parameter to NULL. For subsequent calls to the operation, to continue listing data, set the value of this parameter to the value returned from the previous response.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of items to return in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface GetInsightsResponse {
    /**
     * The insights returned by the operation.
     */
    Insights: InsightList;
    /**
     * The pagination token to use to request the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetInvitationsCountRequest {
  }
  export interface GetInvitationsCountResponse {
    /**
     * The number of all membership invitations sent to this Security Hub member account, not including the currently accepted invitation.
     */
    InvitationsCount?: Integer;
  }
  export interface GetMasterAccountRequest {
  }
  export interface GetMasterAccountResponse {
    /**
     * A list of details about the Security Hub administrator account for the current member account. 
     */
    Master?: Invitation;
  }
  export interface GetMembersRequest {
    /**
     * The list of account IDs for the Security Hub member accounts to return the details for. 
     */
    AccountIds: AccountIdList;
  }
  export interface GetMembersResponse {
    /**
     * The list of details about the Security Hub member accounts.
     */
    Members?: MemberList;
    /**
     * The list of Amazon Web Services accounts that could not be processed. For each account, the list includes the account ID and the email address.
     */
    UnprocessedAccounts?: ResultList;
  }
  export interface IcmpTypeCode {
    /**
     * The ICMP code for which to deny or allow access. To deny or allow all codes, use the value -1.
     */
    Code?: Integer;
    /**
     * The ICMP type for which to deny or allow access. To deny or allow all types, use the value -1.
     */
    Type?: Integer;
  }
  export interface ImportFindingsError {
    /**
     * The identifier of the finding that could not be updated.
     */
    Id: NonEmptyString;
    /**
     * The code of the error returned by the BatchImportFindings operation.
     */
    ErrorCode: NonEmptyString;
    /**
     * The message of the error returned by the BatchImportFindings operation.
     */
    ErrorMessage: NonEmptyString;
  }
  export type ImportFindingsErrorList = ImportFindingsError[];
  export interface Insight {
    /**
     * The ARN of a Security Hub insight.
     */
    InsightArn: NonEmptyString;
    /**
     * The name of a Security Hub insight.
     */
    Name: NonEmptyString;
    /**
     * One or more attributes used to filter the findings included in the insight. The insight only includes findings that match the criteria defined in the filters.
     */
    Filters: AwsSecurityFindingFilters;
    /**
     * The grouping attribute for the insight's findings. Indicates how to group the matching findings, and identifies the type of item that the insight applies to. For example, if an insight is grouped by resource identifier, then the insight produces a list of resource identifiers.
     */
    GroupByAttribute: NonEmptyString;
  }
  export type InsightList = Insight[];
  export interface InsightResultValue {
    /**
     * The value of the attribute that the findings are grouped by for the insight whose results are returned by the GetInsightResults operation.
     */
    GroupByAttributeValue: NonEmptyString;
    /**
     * The number of findings returned for each GroupByAttributeValue.
     */
    Count: Integer;
  }
  export type InsightResultValueList = InsightResultValue[];
  export interface InsightResults {
    /**
     * The ARN of the insight whose results are returned by the GetInsightResults operation.
     */
    InsightArn: NonEmptyString;
    /**
     * The attribute that the findings are grouped by for the insight whose results are returned by the GetInsightResults operation.
     */
    GroupByAttribute: NonEmptyString;
    /**
     * The list of insight result values returned by the GetInsightResults operation.
     */
    ResultValues: InsightResultValueList;
  }
  export type Integer = number;
  export type IntegerList = Integer[];
  export type IntegrationType = "SEND_FINDINGS_TO_SECURITY_HUB"|"RECEIVE_FINDINGS_FROM_SECURITY_HUB"|"UPDATE_FINDINGS_IN_SECURITY_HUB"|string;
  export type IntegrationTypeList = IntegrationType[];
  export interface Invitation {
    /**
     * The account ID of the Security Hub administrator account that the invitation was sent from.
     */
    AccountId?: AccountId;
    /**
     * The ID of the invitation sent to the member account.
     */
    InvitationId?: NonEmptyString;
    /**
     * The timestamp of when the invitation was sent.
     */
    InvitedAt?: Timestamp;
    /**
     * The current status of the association between the member and administrator accounts.
     */
    MemberStatus?: NonEmptyString;
  }
  export type InvitationList = Invitation[];
  export interface InviteMembersRequest {
    /**
     * The list of account IDs of the Amazon Web Services accounts to invite to Security Hub as members. 
     */
    AccountIds: AccountIdList;
  }
  export interface InviteMembersResponse {
    /**
     * The list of Amazon Web Services accounts that could not be processed. For each account, the list includes the account ID and the email address.
     */
    UnprocessedAccounts?: ResultList;
  }
  export interface IpFilter {
    /**
     * A finding's CIDR value.
     */
    Cidr?: NonEmptyString;
  }
  export type IpFilterList = IpFilter[];
  export interface IpOrganizationDetails {
    /**
     * The Autonomous System Number (ASN) of the internet provider
     */
    Asn?: Integer;
    /**
     * The name of the organization that registered the ASN.
     */
    AsnOrg?: NonEmptyString;
    /**
     * The ISP information for the internet provider.
     */
    Isp?: NonEmptyString;
    /**
     * The name of the internet provider.
     */
    Org?: NonEmptyString;
  }
  export interface Ipv6CidrBlockAssociation {
    /**
     * The association ID for the IPv6 CIDR block.
     */
    AssociationId?: NonEmptyString;
    /**
     * The IPv6 CIDR block.
     */
    Ipv6CidrBlock?: NonEmptyString;
    /**
     * Information about the state of the CIDR block.
     */
    CidrBlockState?: NonEmptyString;
  }
  export type Ipv6CidrBlockAssociationList = Ipv6CidrBlockAssociation[];
  export interface KeywordFilter {
    /**
     * A value for the keyword.
     */
    Value?: NonEmptyString;
  }
  export type KeywordFilterList = KeywordFilter[];
  export interface ListEnabledProductsForImportRequest {
    /**
     * The token that is required for pagination. On your first call to the ListEnabledProductsForImport operation, set the value of this parameter to NULL. For subsequent calls to the operation, to continue listing data, set the value of this parameter to the value returned from the previous response.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of items to return in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListEnabledProductsForImportResponse {
    /**
     * The list of ARNs for the resources that represent your subscriptions to products. 
     */
    ProductSubscriptions?: ProductSubscriptionArnList;
    /**
     * The pagination token to use to request the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListFindingAggregatorsRequest {
    /**
     * The token returned with the previous set of results. Identifies the next set of results to return.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return. This operation currently only returns a single result.
     */
    MaxResults?: MaxResults;
  }
  export interface ListFindingAggregatorsResponse {
    /**
     * The list of finding aggregators. This operation currently only returns a single result.
     */
    FindingAggregators?: FindingAggregatorList;
    /**
     * If there are more results, this is the token to provide in the next call to ListFindingAggregators. This operation currently only returns a single result. 
     */
    NextToken?: NextToken;
  }
  export interface ListInvitationsRequest {
    /**
     * The maximum number of items to return in the response. 
     */
    MaxResults?: CrossAccountMaxResults;
    /**
     * The token that is required for pagination. On your first call to the ListInvitations operation, set the value of this parameter to NULL. For subsequent calls to the operation, to continue listing data, set the value of this parameter to the value returned from the previous response.
     */
    NextToken?: NextToken;
  }
  export interface ListInvitationsResponse {
    /**
     * The details of the invitations returned by the operation.
     */
    Invitations?: InvitationList;
    /**
     * The pagination token to use to request the next page of results.
     */
    NextToken?: NonEmptyString;
  }
  export interface ListMembersRequest {
    /**
     * Specifies which member accounts to include in the response based on their relationship status with the administrator account. The default value is TRUE. If OnlyAssociated is set to TRUE, the response includes member accounts whose relationship status with the administrator account is set to ENABLED. If OnlyAssociated is set to FALSE, the response includes all existing member accounts. 
     */
    OnlyAssociated?: Boolean;
    /**
     * The maximum number of items to return in the response. 
     */
    MaxResults?: CrossAccountMaxResults;
    /**
     * The token that is required for pagination. On your first call to the ListMembers operation, set the value of this parameter to NULL. For subsequent calls to the operation, to continue listing data, set the value of this parameter to the value returned from the previous response.
     */
    NextToken?: NextToken;
  }
  export interface ListMembersResponse {
    /**
     * Member details returned by the operation.
     */
    Members?: MemberList;
    /**
     * The pagination token to use to request the next page of results.
     */
    NextToken?: NonEmptyString;
  }
  export interface ListOrganizationAdminAccountsRequest {
    /**
     * The maximum number of items to return in the response.
     */
    MaxResults?: AdminsMaxResults;
    /**
     * The token that is required for pagination. On your first call to the ListOrganizationAdminAccounts operation, set the value of this parameter to NULL. For subsequent calls to the operation, to continue listing data, set the value of this parameter to the value returned from the previous response. 
     */
    NextToken?: NextToken;
  }
  export interface ListOrganizationAdminAccountsResponse {
    /**
     * The list of Security Hub administrator accounts.
     */
    AdminAccounts?: AdminAccounts;
    /**
     * The pagination token to use to request the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource to retrieve tags for.
     */
    ResourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags associated with a resource.
     */
    Tags?: TagMap;
  }
  export interface LoadBalancerState {
    /**
     * The state code. The initial state of the load balancer is provisioning. After the load balancer is fully set up and ready to route traffic, its state is active. If the load balancer could not be set up, its state is failed. 
     */
    Code?: NonEmptyString;
    /**
     * A description of the state.
     */
    Reason?: NonEmptyString;
  }
  export type Long = number;
  export interface Malware {
    /**
     * The name of the malware that was observed.
     */
    Name: NonEmptyString;
    /**
     * The type of the malware that was observed.
     */
    Type?: MalwareType;
    /**
     * The file system path of the malware that was observed.
     */
    Path?: NonEmptyString;
    /**
     * The state of the malware that was observed.
     */
    State?: MalwareState;
  }
  export type MalwareList = Malware[];
  export type MalwareState = "OBSERVED"|"REMOVAL_FAILED"|"REMOVED"|string;
  export type MalwareType = "ADWARE"|"BLENDED_THREAT"|"BOTNET_AGENT"|"COIN_MINER"|"EXPLOIT_KIT"|"KEYLOGGER"|"MACRO"|"POTENTIALLY_UNWANTED"|"SPYWARE"|"RANSOMWARE"|"REMOTE_ACCESS"|"ROOTKIT"|"TROJAN"|"VIRUS"|"WORM"|string;
  export interface MapFilter {
    /**
     * The key of the map filter. For example, for ResourceTags, Key identifies the name of the tag. For UserDefinedFields, Key is the name of the field.
     */
    Key?: NonEmptyString;
    /**
     * The value for the key in the map filter. Filter values are case sensitive. For example, one of the values for a tag called Department might be Security. If you provide security as the filter value, then there is no match.
     */
    Value?: NonEmptyString;
    /**
     * The condition to apply to the key value when querying for findings with a map filter. To search for values that exactly match the filter value, use EQUALS. For example, for the ResourceTags field, the filter Department EQUALS Security matches findings that have the value Security for the tag Department. To search for values other than the filter value, use NOT_EQUALS. For example, for the ResourceTags field, the filter Department NOT_EQUALS Finance matches findings that do not have the value Finance for the tag Department.  EQUALS filters on the same field are joined by OR. A finding matches if it matches any one of those filters.  NOT_EQUALS filters on the same field are joined by AND. A finding matches only if it matches all of those filters. You cannot have both an EQUALS filter and a NOT_EQUALS filter on the same field.
     */
    Comparison?: MapFilterComparison;
  }
  export type MapFilterComparison = "EQUALS"|"NOT_EQUALS"|string;
  export type MapFilterList = MapFilter[];
  export type MaxResults = number;
  export interface Member {
    /**
     * The Amazon Web Services account ID of the member account.
     */
    AccountId?: AccountId;
    /**
     * The email address of the member account.
     */
    Email?: NonEmptyString;
    /**
     * This is replaced by AdministratorID. The Amazon Web Services account ID of the Security Hub administrator account associated with this member account.
     */
    MasterId?: NonEmptyString;
    /**
     * The Amazon Web Services account ID of the Security Hub administrator account associated with this member account.
     */
    AdministratorId?: NonEmptyString;
    /**
     * The status of the relationship between the member account and its administrator account.  The status can have one of the following values:    CREATED - Indicates that the administrator account added the member account, but has not yet invited the member account.    INVITED - Indicates that the administrator account invited the member account. The member account has not yet responded to the invitation.    ENABLED - Indicates that the member account is currently active. For manually invited member accounts, indicates that the member account accepted the invitation.    REMOVED - Indicates that the administrator account disassociated the member account.    RESIGNED - Indicates that the member account disassociated themselves from the administrator account.    DELETED - Indicates that the administrator account deleted the member account.    ACCOUNT_SUSPENDED - Indicates that an organization account was suspended from Amazon Web Services at the same time that the administrator account tried to enable the organization account as a member account.  
     */
    MemberStatus?: NonEmptyString;
    /**
     * A timestamp for the date and time when the invitation was sent to the member account.
     */
    InvitedAt?: Timestamp;
    /**
     * The timestamp for the date and time when the member account was updated.
     */
    UpdatedAt?: Timestamp;
  }
  export type MemberList = Member[];
  export interface Network {
    /**
     * The direction of network traffic associated with a finding.
     */
    Direction?: NetworkDirection;
    /**
     * The protocol of network-related information about a finding.
     */
    Protocol?: NonEmptyString;
    /**
     * The range of open ports that is present on the network.
     */
    OpenPortRange?: PortRange;
    /**
     * The source IPv4 address of network-related information about a finding.
     */
    SourceIpV4?: NonEmptyString;
    /**
     * The source IPv6 address of network-related information about a finding.
     */
    SourceIpV6?: NonEmptyString;
    /**
     * The source port of network-related information about a finding.
     */
    SourcePort?: Integer;
    /**
     * The source domain of network-related information about a finding.
     */
    SourceDomain?: NonEmptyString;
    /**
     * The source media access control (MAC) address of network-related information about a finding.
     */
    SourceMac?: NonEmptyString;
    /**
     * The destination IPv4 address of network-related information about a finding.
     */
    DestinationIpV4?: NonEmptyString;
    /**
     * The destination IPv6 address of network-related information about a finding.
     */
    DestinationIpV6?: NonEmptyString;
    /**
     * The destination port of network-related information about a finding.
     */
    DestinationPort?: Integer;
    /**
     * The destination domain of network-related information about a finding.
     */
    DestinationDomain?: NonEmptyString;
  }
  export interface NetworkConnectionAction {
    /**
     * The direction of the network connection request (IN or OUT).
     */
    ConnectionDirection?: NonEmptyString;
    /**
     * Information about the remote IP address that issued the network connection request.
     */
    RemoteIpDetails?: ActionRemoteIpDetails;
    /**
     * Information about the port on the remote IP address.
     */
    RemotePortDetails?: ActionRemotePortDetails;
    /**
     * Information about the port on the EC2 instance.
     */
    LocalPortDetails?: ActionLocalPortDetails;
    /**
     * The protocol used to make the network connection request.
     */
    Protocol?: NonEmptyString;
    /**
     * Indicates whether the network connection attempt was blocked.
     */
    Blocked?: Boolean;
  }
  export type NetworkDirection = "IN"|"OUT"|string;
  export interface NetworkHeader {
    /**
     * The protocol used for the component.
     */
    Protocol?: NonEmptyString;
    /**
     * Information about the destination of the component.
     */
    Destination?: NetworkPathComponentDetails;
    /**
     * Information about the origin of the component.
     */
    Source?: NetworkPathComponentDetails;
  }
  export interface NetworkPathComponent {
    /**
     * The identifier of a component in the network path.
     */
    ComponentId?: NonEmptyString;
    /**
     * The type of component.
     */
    ComponentType?: NonEmptyString;
    /**
     * Information about the component that comes after the current component in the network path.
     */
    Egress?: NetworkHeader;
    /**
     * Information about the component that comes before the current node in the network path.
     */
    Ingress?: NetworkHeader;
  }
  export interface NetworkPathComponentDetails {
    /**
     * The IP addresses of the destination.
     */
    Address?: StringList;
    /**
     * A list of port ranges for the destination.
     */
    PortRanges?: PortRangeList;
  }
  export type NetworkPathList = NetworkPathComponent[];
  export type NextToken = string;
  export type NonEmptyString = string;
  export type NonEmptyStringList = NonEmptyString[];
  export interface Note {
    /**
     * The text of a note.
     */
    Text: NonEmptyString;
    /**
     * The principal that created a note.
     */
    UpdatedBy: NonEmptyString;
    /**
     * The timestamp of when the note was updated. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    UpdatedAt: NonEmptyString;
  }
  export interface NoteUpdate {
    /**
     * The updated note text.
     */
    Text: NonEmptyString;
    /**
     * The principal that updated the note.
     */
    UpdatedBy: NonEmptyString;
  }
  export interface NumberFilter {
    /**
     * The greater-than-equal condition to be applied to a single field when querying for findings. 
     */
    Gte?: Double;
    /**
     * The less-than-equal condition to be applied to a single field when querying for findings. 
     */
    Lte?: Double;
    /**
     * The equal-to condition to be applied to a single field when querying for findings.
     */
    Eq?: Double;
  }
  export type NumberFilterList = NumberFilter[];
  export interface Occurrences {
    /**
     * Occurrences of sensitive data detected in a non-binary text file or a Microsoft Word file. Non-binary text files include files such as HTML, XML, JSON, and TXT files.
     */
    LineRanges?: Ranges;
    /**
     * Occurrences of sensitive data detected in a binary text file.
     */
    OffsetRanges?: Ranges;
    /**
     * Occurrences of sensitive data in an Adobe Portable Document Format (PDF) file.
     */
    Pages?: Pages;
    /**
     * Occurrences of sensitive data in an Apache Avro object container or an Apache Parquet file.
     */
    Records?: Records;
    /**
     * Occurrences of sensitive data detected in Microsoft Excel workbooks, comma-separated value (CSV) files, or tab-separated value (TSV) files.
     */
    Cells?: Cells;
  }
  export interface Page {
    /**
     * The page number of the page that contains the sensitive data.
     */
    PageNumber?: Long;
    /**
     * An occurrence of sensitive data detected in a non-binary text file or a Microsoft Word file. Non-binary text files include files such as HTML, XML, JSON, and TXT files.
     */
    LineRange?: Range;
    /**
     * An occurrence of sensitive data detected in a binary text file.
     */
    OffsetRange?: Range;
  }
  export type Pages = Page[];
  export type Partition = "aws"|"aws-cn"|"aws-us-gov"|string;
  export interface PatchSummary {
    /**
     * The identifier of the compliance standard that was used to determine the patch compliance status.
     */
    Id: NonEmptyString;
    /**
     * The number of patches from the compliance standard that were installed successfully.
     */
    InstalledCount?: Integer;
    /**
     * The number of patches that are part of the compliance standard but are not installed. The count includes patches that failed to install.
     */
    MissingCount?: Integer;
    /**
     * The number of patches from the compliance standard that failed to install.
     */
    FailedCount?: Integer;
    /**
     * The number of installed patches that are not part of the compliance standard.
     */
    InstalledOtherCount?: Integer;
    /**
     * The number of patches that are installed but are also on a list of patches that the customer rejected.
     */
    InstalledRejectedCount?: Integer;
    /**
     * The number of patches that were applied, but that require the instance to be rebooted in order to be marked as installed.
     */
    InstalledPendingReboot?: Integer;
    /**
     * Indicates when the operation started. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    OperationStartTime?: NonEmptyString;
    /**
     * Indicates when the operation completed. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    OperationEndTime?: NonEmptyString;
    /**
     * The reboot option specified for the instance.
     */
    RebootOption?: NonEmptyString;
    /**
     * The type of patch operation performed. For Patch Manager, the values are SCAN and INSTALL. 
     */
    Operation?: NonEmptyString;
  }
  export interface PortProbeAction {
    /**
     * Information about the ports affected by the port probe.
     */
    PortProbeDetails?: PortProbeDetailList;
    /**
     * Indicates whether the port probe was blocked.
     */
    Blocked?: Boolean;
  }
  export interface PortProbeDetail {
    /**
     * Provides information about the port that was scanned.
     */
    LocalPortDetails?: ActionLocalPortDetails;
    /**
     * Provides information about the IP address where the scanned port is located.
     */
    LocalIpDetails?: ActionLocalIpDetails;
    /**
     * Provides information about the remote IP address that performed the scan.
     */
    RemoteIpDetails?: ActionRemoteIpDetails;
  }
  export type PortProbeDetailList = PortProbeDetail[];
  export interface PortRange {
    /**
     * The first port in the port range.
     */
    Begin?: Integer;
    /**
     * The last port in the port range.
     */
    End?: Integer;
  }
  export interface PortRangeFromTo {
    /**
     * The first port in the port range.
     */
    From?: Integer;
    /**
     * The last port in the port range.
     */
    To?: Integer;
  }
  export type PortRangeList = PortRange[];
  export interface ProcessDetails {
    /**
     * The name of the process.
     */
    Name?: NonEmptyString;
    /**
     * The path to the process executable.
     */
    Path?: NonEmptyString;
    /**
     * The process ID.
     */
    Pid?: Integer;
    /**
     * The parent process ID.
     */
    ParentPid?: Integer;
    /**
     * Indicates when the process was launched. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LaunchedAt?: NonEmptyString;
    /**
     * Indicates when the process was terminated. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    TerminatedAt?: NonEmptyString;
  }
  export interface Product {
    /**
     * The ARN assigned to the product.
     */
    ProductArn: NonEmptyString;
    /**
     * The name of the product.
     */
    ProductName?: NonEmptyString;
    /**
     * The name of the company that provides the product.
     */
    CompanyName?: NonEmptyString;
    /**
     * A description of the product.
     */
    Description?: NonEmptyString;
    /**
     * The categories assigned to the product.
     */
    Categories?: CategoryList;
    /**
     * The types of integration that the product supports. Available values are the following.    SEND_FINDINGS_TO_SECURITY_HUB - The integration sends findings to Security Hub.    RECEIVE_FINDINGS_FROM_SECURITY_HUB - The integration receives findings from Security Hub.    UPDATE_FINDINGS_IN_SECURITY_HUB - The integration does not send new findings to Security Hub, but does make updates to the findings that it receives from Security Hub.  
     */
    IntegrationTypes?: IntegrationTypeList;
    /**
     * For integrations with Amazon Web Services services, the Amazon Web Services Console URL from which to activate the service. For integrations with third-party products, the Amazon Web Services Marketplace URL from which to subscribe to or purchase the product.
     */
    MarketplaceUrl?: NonEmptyString;
    /**
     * The URL to the service or product documentation about the integration with Security Hub, including how to activate the integration.
     */
    ActivationUrl?: NonEmptyString;
    /**
     * The resource policy associated with the product.
     */
    ProductSubscriptionResourcePolicy?: NonEmptyString;
  }
  export type ProductSubscriptionArnList = NonEmptyString[];
  export type ProductsList = Product[];
  export interface Range {
    /**
     * The number of lines (for a line range) or characters (for an offset range) from the beginning of the file to the end of the sensitive data.
     */
    Start?: Long;
    /**
     * The number of lines (for a line range) or characters (for an offset range) from the beginning of the file to the end of the sensitive data.
     */
    End?: Long;
    /**
     * In the line where the sensitive data starts, the column within the line where the sensitive data starts.
     */
    StartColumn?: Long;
  }
  export type Ranges = Range[];
  export type RatioScale = number;
  export interface Recommendation {
    /**
     * Describes the recommended steps to take to remediate an issue identified in a finding.
     */
    Text?: NonEmptyString;
    /**
     * A URL to a page or site that contains information about how to remediate a finding.
     */
    Url?: NonEmptyString;
  }
  export interface Record {
    /**
     * The path, as a JSONPath expression, to the field in the record that contains the data. If the field name is longer than 20 characters, it is truncated. If the path is longer than 250 characters, it is truncated.
     */
    JsonPath?: NonEmptyString;
    /**
     * The record index, starting from 0, for the record that contains the data.
     */
    RecordIndex?: Long;
  }
  export type RecordState = "ACTIVE"|"ARCHIVED"|string;
  export type Records = Record[];
  export interface RelatedFinding {
    /**
     * The ARN of the product that generated a related finding.
     */
    ProductArn: NonEmptyString;
    /**
     * The product-generated identifier for a related finding.
     */
    Id: NonEmptyString;
  }
  export type RelatedFindingList = RelatedFinding[];
  export type RelatedRequirementsList = NonEmptyString[];
  export interface Remediation {
    /**
     * A recommendation on the steps to take to remediate the issue identified by a finding.
     */
    Recommendation?: Recommendation;
  }
  export interface Resource {
    /**
     * The type of the resource that details are provided for. If possible, set Type to one of the supported resource types. For example, if the resource is an EC2 instance, then set Type to AwsEc2Instance. If the resource does not match any of the provided types, then set Type to Other. 
     */
    Type: NonEmptyString;
    /**
     * The canonical identifier for the given resource type.
     */
    Id: NonEmptyString;
    /**
     * The canonical Amazon Web Services partition name that the Region is assigned to.
     */
    Partition?: Partition;
    /**
     * The canonical Amazon Web Services external Region name where this resource is located.
     */
    Region?: NonEmptyString;
    /**
     * Identifies the role of the resource in the finding. A resource is either the actor or target of the finding activity,
     */
    ResourceRole?: NonEmptyString;
    /**
     * A list of Amazon Web Services tags associated with a resource at the time the finding was processed.
     */
    Tags?: FieldMap;
    /**
     * Contains information about sensitive data that was detected on the resource.
     */
    DataClassification?: DataClassificationDetails;
    /**
     * Additional details about the resource related to a finding.
     */
    Details?: ResourceDetails;
  }
  export type ResourceArn = string;
  export interface ResourceDetails {
    /**
     * Details for an autoscaling group.
     */
    AwsAutoScalingAutoScalingGroup?: AwsAutoScalingAutoScalingGroupDetails;
    /**
     * Details for an CodeBuild project.
     */
    AwsCodeBuildProject?: AwsCodeBuildProjectDetails;
    /**
     * Details about a CloudFront distribution.
     */
    AwsCloudFrontDistribution?: AwsCloudFrontDistributionDetails;
    /**
     * Details about an EC2 instance related to a finding.
     */
    AwsEc2Instance?: AwsEc2InstanceDetails;
    /**
     * Details for an EC2 network interface.
     */
    AwsEc2NetworkInterface?: AwsEc2NetworkInterfaceDetails;
    /**
     * Details for an EC2 security group.
     */
    AwsEc2SecurityGroup?: AwsEc2SecurityGroupDetails;
    /**
     * Details for an EC2 volume.
     */
    AwsEc2Volume?: AwsEc2VolumeDetails;
    /**
     * Details for an EC2 VPC.
     */
    AwsEc2Vpc?: AwsEc2VpcDetails;
    /**
     * Details about an Elastic IP address.
     */
    AwsEc2Eip?: AwsEc2EipDetails;
    /**
     * Details about a subnet in Amazon EC2.
     */
    AwsEc2Subnet?: AwsEc2SubnetDetails;
    /**
     * Details about an EC2 network access control list (ACL).
     */
    AwsEc2NetworkAcl?: AwsEc2NetworkAclDetails;
    /**
     * Details about a load balancer.
     */
    AwsElbv2LoadBalancer?: AwsElbv2LoadBalancerDetails;
    /**
     * Details about an Elastic Beanstalk environment.
     */
    AwsElasticBeanstalkEnvironment?: AwsElasticBeanstalkEnvironmentDetails;
    /**
     * Details for an Elasticsearch domain.
     */
    AwsElasticsearchDomain?: AwsElasticsearchDomainDetails;
    /**
     * Details about an S3 bucket related to a finding.
     */
    AwsS3Bucket?: AwsS3BucketDetails;
    /**
     * Details about the Amazon S3 Public Access Block configuration for an account.
     */
    AwsS3AccountPublicAccessBlock?: AwsS3AccountPublicAccessBlockDetails;
    /**
     * Details about an S3 object related to a finding.
     */
    AwsS3Object?: AwsS3ObjectDetails;
    /**
     * Details about a Secrets Manager secret.
     */
    AwsSecretsManagerSecret?: AwsSecretsManagerSecretDetails;
    /**
     * Details about an IAM access key related to a finding.
     */
    AwsIamAccessKey?: AwsIamAccessKeyDetails;
    /**
     * Details about an IAM user.
     */
    AwsIamUser?: AwsIamUserDetails;
    /**
     * Details about an IAM permissions policy.
     */
    AwsIamPolicy?: AwsIamPolicyDetails;
    /**
     * Provides information about a version 2 stage for Amazon API Gateway.
     */
    AwsApiGatewayV2Stage?: AwsApiGatewayV2StageDetails;
    /**
     * Provides information about a version 2 API in Amazon API Gateway.
     */
    AwsApiGatewayV2Api?: AwsApiGatewayV2ApiDetails;
    /**
     * Details about a DynamoDB table.
     */
    AwsDynamoDbTable?: AwsDynamoDbTableDetails;
    /**
     * Provides information about a version 1 Amazon API Gateway stage.
     */
    AwsApiGatewayStage?: AwsApiGatewayStageDetails;
    /**
     * Provides information about a REST API in version 1 of Amazon API Gateway.
     */
    AwsApiGatewayRestApi?: AwsApiGatewayRestApiDetails;
    /**
     * Provides details about a CloudTrail trail.
     */
    AwsCloudTrailTrail?: AwsCloudTrailTrailDetails;
    /**
     * Provides information about the state of a patch on an instance based on the patch baseline that was used to patch the instance.
     */
    AwsSsmPatchCompliance?: AwsSsmPatchComplianceDetails;
    /**
     * Provides details about an Certificate Manager certificate.
     */
    AwsCertificateManagerCertificate?: AwsCertificateManagerCertificateDetails;
    /**
     * Contains details about an Amazon Redshift cluster.
     */
    AwsRedshiftCluster?: AwsRedshiftClusterDetails;
    /**
     * Contains details about a Classic Load Balancer.
     */
    AwsElbLoadBalancer?: AwsElbLoadBalancerDetails;
    /**
     * Contains details about an IAM group.
     */
    AwsIamGroup?: AwsIamGroupDetails;
    /**
     * Details about an IAM role.
     */
    AwsIamRole?: AwsIamRoleDetails;
    /**
     * Details about an KMS key.
     */
    AwsKmsKey?: AwsKmsKeyDetails;
    /**
     * Details about a Lambda function.
     */
    AwsLambdaFunction?: AwsLambdaFunctionDetails;
    /**
     * Details for a Lambda layer version.
     */
    AwsLambdaLayerVersion?: AwsLambdaLayerVersionDetails;
    /**
     * Details about an Amazon RDS database instance.
     */
    AwsRdsDbInstance?: AwsRdsDbInstanceDetails;
    /**
     * Details about an SNS topic.
     */
    AwsSnsTopic?: AwsSnsTopicDetails;
    /**
     * Details about an SQS queue.
     */
    AwsSqsQueue?: AwsSqsQueueDetails;
    /**
     * Details for an WAF WebACL.
     */
    AwsWafWebAcl?: AwsWafWebAclDetails;
    /**
     * Details about an Amazon RDS database snapshot.
     */
    AwsRdsDbSnapshot?: AwsRdsDbSnapshotDetails;
    /**
     * Details about an Amazon RDS database cluster snapshot.
     */
    AwsRdsDbClusterSnapshot?: AwsRdsDbClusterSnapshotDetails;
    /**
     * Details about an Amazon RDS database cluster.
     */
    AwsRdsDbCluster?: AwsRdsDbClusterDetails;
    /**
     * Details about an ECS cluster.
     */
    AwsEcsCluster?: AwsEcsClusterDetails;
    /**
     * Details about a task definition. A task definition describes the container and volume definitions of an Amazon Elastic Container Service task.
     */
    AwsEcsTaskDefinition?: AwsEcsTaskDefinitionDetails;
    /**
     * Details about a container resource related to a finding.
     */
    Container?: ContainerDetails;
    /**
     * Details about a resource that are not available in a type-specific details object. Use the Other object in the following cases.   The type-specific object does not contain all of the fields that you want to populate. In this case, first use the type-specific object to populate those fields. Use the Other object to populate the fields that are missing from the type-specific object.   The resource type does not have a corresponding object. This includes resources for which the type is Other.   
     */
    Other?: FieldMap;
    /**
     * Details about an RDS event notification subscription.
     */
    AwsRdsEventSubscription?: AwsRdsEventSubscriptionDetails;
    /**
     * Details about a service within an ECS cluster.
     */
    AwsEcsService?: AwsEcsServiceDetails;
    /**
     * Provides details about a launch configuration.
     */
    AwsAutoScalingLaunchConfiguration?: AwsAutoScalingLaunchConfigurationDetails;
    /**
     * Details about an EC2 VPN connection.
     */
    AwsEc2VpnConnection?: AwsEc2VpnConnectionDetails;
    /**
     * Information about an Amazon ECR image.
     */
    AwsEcrContainerImage?: AwsEcrContainerImageDetails;
    /**
     * Details about an Amazon OpenSearch Service domain.
     */
    AwsOpenSearchServiceDomain?: AwsOpenSearchServiceDomainDetails;
    /**
     * Details about the service configuration for a VPC endpoint service.
     */
    AwsEc2VpcEndpointService?: AwsEc2VpcEndpointServiceDetails;
    /**
     * Information about the encryption configuration for X-Ray.
     */
    AwsXrayEncryptionConfig?: AwsXrayEncryptionConfigDetails;
    /**
     * Details about a rate-based rule for global resources.
     */
    AwsWafRateBasedRule?: AwsWafRateBasedRuleDetails;
    /**
     * Details about a rate-based rule for Regional resources.
     */
    AwsWafRegionalRateBasedRule?: AwsWafRegionalRateBasedRuleDetails;
    /**
     * Information about an Amazon Elastic Container Registry repository.
     */
    AwsEcrRepository?: AwsEcrRepositoryDetails;
    /**
     * Details about an Amazon EKS cluster.
     */
    AwsEksCluster?: AwsEksClusterDetails;
  }
  export type ResourceList = Resource[];
  export interface Result {
    /**
     * An Amazon Web Services account ID of the account that was not processed.
     */
    AccountId?: AccountId;
    /**
     * The reason that the account was not processed.
     */
    ProcessingResult?: NonEmptyString;
  }
  export type ResultList = Result[];
  export type SecurityGroups = NonEmptyString[];
  export interface SensitiveDataDetections {
    /**
     * The total number of occurrences of sensitive data that were detected.
     */
    Count?: Long;
    /**
     * The type of sensitive data that was detected. For example, the type might indicate that the data is an email address.
     */
    Type?: NonEmptyString;
    /**
     * Details about the sensitive data that was detected.
     */
    Occurrences?: Occurrences;
  }
  export type SensitiveDataDetectionsList = SensitiveDataDetections[];
  export interface SensitiveDataResult {
    /**
     * The category of sensitive data that was detected. For example, the category can indicate that the sensitive data involved credentials, financial information, or personal information.
     */
    Category?: NonEmptyString;
    /**
     * The list of detected instances of sensitive data.
     */
    Detections?: SensitiveDataDetectionsList;
    /**
     * The total number of occurrences of sensitive data.
     */
    TotalCount?: Long;
  }
  export type SensitiveDataResultList = SensitiveDataResult[];
  export interface Severity {
    /**
     * Deprecated. This attribute is being deprecated. Instead of providing Product, provide Original. The native severity as defined by the Amazon Web Services service or integrated partner product that generated the finding.
     */
    Product?: Double;
    /**
     * The severity value of the finding. The allowed values are the following.    INFORMATIONAL - No issue was found.    LOW - The issue does not require action on its own.    MEDIUM - The issue must be addressed but not urgently.    HIGH - The issue must be addressed as a priority.    CRITICAL - The issue must be remediated immediately to avoid it escalating.   If you provide Normalized and do not provide Label, then Label is set automatically as follows.    0 - INFORMATIONAL    1–39 - LOW    40–69 - MEDIUM    70–89 - HIGH    90–100 - CRITICAL   
     */
    Label?: SeverityLabel;
    /**
     * Deprecated. The normalized severity of a finding. This attribute is being deprecated. Instead of providing Normalized, provide Label. If you provide Label and do not provide Normalized, then Normalized is set automatically as follows.    INFORMATIONAL - 0    LOW - 1    MEDIUM - 40    HIGH - 70    CRITICAL - 90  
     */
    Normalized?: Integer;
    /**
     * The native severity from the finding product that generated the finding.
     */
    Original?: NonEmptyString;
  }
  export type SeverityLabel = "INFORMATIONAL"|"LOW"|"MEDIUM"|"HIGH"|"CRITICAL"|string;
  export type SeverityRating = "LOW"|"MEDIUM"|"HIGH"|"CRITICAL"|string;
  export interface SeverityUpdate {
    /**
     * The normalized severity for the finding. This attribute is to be deprecated in favor of Label. If you provide Normalized and do not provide Label, Label is set automatically as follows.   0 - INFORMATIONAL    1–39 - LOW    40–69 - MEDIUM    70–89 - HIGH    90–100 - CRITICAL   
     */
    Normalized?: RatioScale;
    /**
     * The native severity as defined by the Amazon Web Services service or integrated partner product that generated the finding.
     */
    Product?: Double;
    /**
     * The severity value of the finding. The allowed values are the following.    INFORMATIONAL - No issue was found.    LOW - The issue does not require action on its own.    MEDIUM - The issue must be addressed but not urgently.    HIGH - The issue must be addressed as a priority.    CRITICAL - The issue must be remediated immediately to avoid it escalating.  
     */
    Label?: SeverityLabel;
  }
  export type SizeBytes = number;
  export interface SoftwarePackage {
    /**
     * The name of the software package.
     */
    Name?: NonEmptyString;
    /**
     * The version of the software package.
     */
    Version?: NonEmptyString;
    /**
     * The epoch of the software package.
     */
    Epoch?: NonEmptyString;
    /**
     * The release of the software package.
     */
    Release?: NonEmptyString;
    /**
     * The architecture used for the software package.
     */
    Architecture?: NonEmptyString;
    /**
     * The source of the package.
     */
    PackageManager?: NonEmptyString;
    /**
     * The file system path to the package manager inventory file.
     */
    FilePath?: NonEmptyString;
  }
  export type SoftwarePackageList = SoftwarePackage[];
  export type SortCriteria = SortCriterion[];
  export interface SortCriterion {
    /**
     * The finding attribute used to sort findings.
     */
    Field?: NonEmptyString;
    /**
     * The order used to sort findings.
     */
    SortOrder?: SortOrder;
  }
  export type SortOrder = "asc"|"desc"|string;
  export interface Standard {
    /**
     * The ARN of a standard.
     */
    StandardsArn?: NonEmptyString;
    /**
     * The name of the standard.
     */
    Name?: NonEmptyString;
    /**
     * A description of the standard.
     */
    Description?: NonEmptyString;
    /**
     * Whether the standard is enabled by default. When Security Hub is enabled from the console, if a standard is enabled by default, the check box for that standard is selected by default. When Security Hub is enabled using the EnableSecurityHub API operation, the standard is enabled by default unless EnableDefaultStandards is set to false.
     */
    EnabledByDefault?: Boolean;
  }
  export type Standards = Standard[];
  export interface StandardsControl {
    /**
     * The ARN of the security standard control.
     */
    StandardsControlArn?: NonEmptyString;
    /**
     * The current status of the security standard control. Indicates whether the control is enabled or disabled. Security Hub does not check against disabled controls.
     */
    ControlStatus?: ControlStatus;
    /**
     * The reason provided for the most recent change in status for the control.
     */
    DisabledReason?: NonEmptyString;
    /**
     * The date and time that the status of the security standard control was most recently updated.
     */
    ControlStatusUpdatedAt?: Timestamp;
    /**
     * The identifier of the security standard control.
     */
    ControlId?: NonEmptyString;
    /**
     * The title of the security standard control.
     */
    Title?: NonEmptyString;
    /**
     * The longer description of the security standard control. Provides information about what the control is checking for.
     */
    Description?: NonEmptyString;
    /**
     * A link to remediation information for the control in the Security Hub user documentation.
     */
    RemediationUrl?: NonEmptyString;
    /**
     * The severity of findings generated from this security standard control. The finding severity is based on an assessment of how easy it would be to compromise Amazon Web Services resources if the issue is detected.
     */
    SeverityRating?: SeverityRating;
    /**
     * The list of requirements that are related to this control.
     */
    RelatedRequirements?: RelatedRequirementsList;
  }
  export type StandardsControls = StandardsControl[];
  export type StandardsInputParameterMap = {[key: string]: NonEmptyString};
  export type StandardsStatus = "PENDING"|"READY"|"FAILED"|"DELETING"|"INCOMPLETE"|string;
  export interface StandardsSubscription {
    /**
     * The ARN of a resource that represents your subscription to a supported standard.
     */
    StandardsSubscriptionArn: NonEmptyString;
    /**
     * The ARN of a standard.
     */
    StandardsArn: NonEmptyString;
    /**
     * A key-value pair of input for the standard.
     */
    StandardsInput: StandardsInputParameterMap;
    /**
     * The status of the standard subscription. The status values are as follows:    PENDING - Standard is in the process of being enabled.    READY - Standard is enabled.    INCOMPLETE - Standard could not be enabled completely. Some controls may not be available.    DELETING - Standard is in the process of being disabled.    FAILED - Standard could not be disabled.  
     */
    StandardsStatus: StandardsStatus;
  }
  export type StandardsSubscriptionArns = NonEmptyString[];
  export interface StandardsSubscriptionRequest {
    /**
     * The ARN of the standard that you want to enable. To view the list of available standards and their ARNs, use the DescribeStandards operation.
     */
    StandardsArn: NonEmptyString;
    /**
     * A key-value pair of input for the standard.
     */
    StandardsInput?: StandardsInputParameterMap;
  }
  export type StandardsSubscriptionRequests = StandardsSubscriptionRequest[];
  export type StandardsSubscriptions = StandardsSubscription[];
  export interface StatusReason {
    /**
     * A code that represents a reason for the control status. For the list of status reason codes and their meanings, see Standards-related information in the ASFF in the Security Hub User Guide. 
     */
    ReasonCode: NonEmptyString;
    /**
     * The corresponding description for the status reason code.
     */
    Description?: NonEmptyString;
  }
  export type StatusReasonsList = StatusReason[];
  export interface StringFilter {
    /**
     * The string filter value. Filter values are case sensitive. For example, the product name for control-based findings is Security Hub. If you provide security hub as the filter text, then there is no match.
     */
    Value?: NonEmptyString;
    /**
     * The condition to apply to a string value when querying for findings. To search for values that contain the filter criteria value, use one of the following comparison operators:   To search for values that exactly match the filter value, use EQUALS. For example, the filter ResourceType EQUALS AwsEc2SecurityGroup only matches findings that have a resource type of AwsEc2SecurityGroup.   To search for values that start with the filter value, use PREFIX. For example, the filter ResourceType PREFIX AwsIam matches findings that have a resource type that starts with AwsIam. Findings with a resource type of AwsIamPolicy, AwsIamRole, or AwsIamUser would all match.    EQUALS and PREFIX filters on the same field are joined by OR. A finding matches if it matches any one of those filters. To search for values that do not contain the filter criteria value, use one of the following comparison operators:   To search for values that do not exactly match the filter value, use NOT_EQUALS. For example, the filter ResourceType NOT_EQUALS AwsIamPolicy matches findings that have a resource type other than AwsIamPolicy.   To search for values that do not start with the filter value, use PREFIX_NOT_EQUALS. For example, the filter ResourceType PREFIX_NOT_EQUALS AwsIam matches findings that have a resource type that does not start with AwsIam. Findings with a resource type of AwsIamPolicy, AwsIamRole, or AwsIamUser would all be excluded from the results.    NOT_EQUALS and PREFIX_NOT_EQUALS filters on the same field are joined by AND. A finding matches only if it matches all of those filters. For filters on the same field, you cannot provide both an EQUALS filter and a NOT_EQUALS or PREFIX_NOT_EQUALS filter. Combining filters in this way always returns an error, even if the provided filter values would return valid results. You can combine PREFIX filters with NOT_EQUALS or PREFIX_NOT_EQUALS filters for the same field. Security Hub first processes the PREFIX filters, then the NOT_EQUALS or PREFIX_NOT_EQUALS filters.  For example, for the following filter, Security Hub first identifies findings that have resource types that start with either AwsIAM or AwsEc2. It then excludes findings that have a resource type of AwsIamPolicy and findings that have a resource type of AwsEc2NetworkInterface.    ResourceType PREFIX AwsIam     ResourceType PREFIX AwsEc2     ResourceType NOT_EQUALS AwsIamPolicy     ResourceType NOT_EQUALS AwsEc2NetworkInterface   
     */
    Comparison?: StringFilterComparison;
  }
  export type StringFilterComparison = "EQUALS"|"PREFIX"|"NOT_EQUALS"|"PREFIX_NOT_EQUALS"|string;
  export type StringFilterList = StringFilter[];
  export type StringList = NonEmptyString[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the resource to apply the tags to.
     */
    ResourceArn: ResourceArn;
    /**
     * The tags to add to the resource. You can add up to 50 tags at a time. The tag keys can be no longer than 128 characters. The tag values can be no longer than 256 characters.
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface ThreatIntelIndicator {
    /**
     * The type of threat intelligence indicator.
     */
    Type?: ThreatIntelIndicatorType;
    /**
     * The value of a threat intelligence indicator.
     */
    Value?: NonEmptyString;
    /**
     * The category of a threat intelligence indicator.
     */
    Category?: ThreatIntelIndicatorCategory;
    /**
     * Indicates when the most recent instance of a threat intelligence indicator was observed. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    LastObservedAt?: NonEmptyString;
    /**
     * The source of the threat intelligence indicator.
     */
    Source?: NonEmptyString;
    /**
     * The URL to the page or site where you can get more information about the threat intelligence indicator.
     */
    SourceUrl?: NonEmptyString;
  }
  export type ThreatIntelIndicatorCategory = "BACKDOOR"|"CARD_STEALER"|"COMMAND_AND_CONTROL"|"DROP_SITE"|"EXPLOIT_SITE"|"KEYLOGGER"|string;
  export type ThreatIntelIndicatorList = ThreatIntelIndicator[];
  export type ThreatIntelIndicatorType = "DOMAIN"|"EMAIL_ADDRESS"|"HASH_MD5"|"HASH_SHA1"|"HASH_SHA256"|"HASH_SHA512"|"IPV4_ADDRESS"|"IPV6_ADDRESS"|"MUTEX"|"PROCESS"|"URL"|string;
  export type Timestamp = Date;
  export type TypeList = NonEmptyString[];
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource to remove the tags from.
     */
    ResourceArn: ResourceArn;
    /**
     * The tag keys associated with the tags to remove from the resource. You can remove up to 50 tags at a time.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateActionTargetRequest {
    /**
     * The ARN of the custom action target to update.
     */
    ActionTargetArn: NonEmptyString;
    /**
     * The updated name of the custom action target.
     */
    Name?: NonEmptyString;
    /**
     * The updated description for the custom action target.
     */
    Description?: NonEmptyString;
  }
  export interface UpdateActionTargetResponse {
  }
  export interface UpdateFindingAggregatorRequest {
    /**
     * The ARN of the finding aggregator. To obtain the ARN, use ListFindingAggregators.
     */
    FindingAggregatorArn: NonEmptyString;
    /**
     * Indicates whether to aggregate findings from all of the available Regions in the current partition. Also determines whether to automatically aggregate findings from new Regions as Security Hub supports them and you opt into them. The selected option also determines how to use the Regions provided in the Regions list. The options are as follows:    ALL_REGIONS - Indicates to aggregate findings from all of the Regions where Security Hub is enabled. When you choose this option, Security Hub also automatically aggregates findings from new Regions as Security Hub supports them and you opt into them.     ALL_REGIONS_EXCEPT_SPECIFIED - Indicates to aggregate findings from all of the Regions where Security Hub is enabled, except for the Regions listed in the Regions parameter. When you choose this option, Security Hub also automatically aggregates findings from new Regions as Security Hub supports them and you opt into them.     SPECIFIED_REGIONS - Indicates to aggregate findings only from the Regions listed in the Regions parameter. Security Hub does not automatically aggregate findings from new Regions.   
     */
    RegionLinkingMode: NonEmptyString;
    /**
     * If RegionLinkingMode is ALL_REGIONS_EXCEPT_SPECIFIED, then this is a comma-separated list of Regions that do not aggregate findings to the aggregation Region. If RegionLinkingMode is SPECIFIED_REGIONS, then this is a comma-separated list of Regions that do aggregate findings to the aggregation Region.
     */
    Regions?: StringList;
  }
  export interface UpdateFindingAggregatorResponse {
    /**
     * The ARN of the finding aggregator.
     */
    FindingAggregatorArn?: NonEmptyString;
    /**
     * The aggregation Region.
     */
    FindingAggregationRegion?: NonEmptyString;
    /**
     * Indicates whether to link all Regions, all Regions except for a list of excluded Regions, or a list of included Regions.
     */
    RegionLinkingMode?: NonEmptyString;
    /**
     * The list of excluded Regions or included Regions.
     */
    Regions?: StringList;
  }
  export interface UpdateFindingsRequest {
    /**
     * A collection of attributes that specify which findings you want to update.
     */
    Filters: AwsSecurityFindingFilters;
    /**
     * The updated note for the finding.
     */
    Note?: NoteUpdate;
    /**
     * The updated record state for the finding.
     */
    RecordState?: RecordState;
  }
  export interface UpdateFindingsResponse {
  }
  export interface UpdateInsightRequest {
    /**
     * The ARN of the insight that you want to update.
     */
    InsightArn: NonEmptyString;
    /**
     * The updated name for the insight.
     */
    Name?: NonEmptyString;
    /**
     * The updated filters that define this insight.
     */
    Filters?: AwsSecurityFindingFilters;
    /**
     * The updated GroupBy attribute that defines this insight.
     */
    GroupByAttribute?: NonEmptyString;
  }
  export interface UpdateInsightResponse {
  }
  export interface UpdateOrganizationConfigurationRequest {
    /**
     * Whether to automatically enable Security Hub for new accounts in the organization. By default, this is false, and new accounts are not added automatically. To automatically enable Security Hub for new accounts, set this to true.
     */
    AutoEnable: Boolean;
  }
  export interface UpdateOrganizationConfigurationResponse {
  }
  export interface UpdateSecurityHubConfigurationRequest {
    /**
     * Whether to automatically enable new controls when they are added to standards that are enabled. By default, this is set to true, and new controls are enabled automatically. To not automatically enable new controls, set this to false. 
     */
    AutoEnableControls?: Boolean;
  }
  export interface UpdateSecurityHubConfigurationResponse {
  }
  export interface UpdateStandardsControlRequest {
    /**
     * The ARN of the security standard control to enable or disable.
     */
    StandardsControlArn: NonEmptyString;
    /**
     * The updated status of the security standard control.
     */
    ControlStatus?: ControlStatus;
    /**
     * A description of the reason why you are disabling a security standard control. If you are disabling a control, then this is required.
     */
    DisabledReason?: NonEmptyString;
  }
  export interface UpdateStandardsControlResponse {
  }
  export type VerificationState = "UNKNOWN"|"TRUE_POSITIVE"|"FALSE_POSITIVE"|"BENIGN_POSITIVE"|string;
  export interface Vulnerability {
    /**
     * The identifier of the vulnerability.
     */
    Id: NonEmptyString;
    /**
     * List of software packages that have the vulnerability.
     */
    VulnerablePackages?: SoftwarePackageList;
    /**
     * CVSS scores from the advisory related to the vulnerability.
     */
    Cvss?: CvssList;
    /**
     * List of vulnerabilities that are related to this vulnerability.
     */
    RelatedVulnerabilities?: StringList;
    /**
     * Information about the vendor that generates the vulnerability report.
     */
    Vendor?: VulnerabilityVendor;
    /**
     * A list of URLs that provide additional information about the vulnerability.
     */
    ReferenceUrls?: StringList;
  }
  export type VulnerabilityList = Vulnerability[];
  export interface VulnerabilityVendor {
    /**
     * The name of the vendor.
     */
    Name: NonEmptyString;
    /**
     * The URL of the vulnerability advisory.
     */
    Url?: NonEmptyString;
    /**
     * The severity that the vendor assigned to the vulnerability.
     */
    VendorSeverity?: NonEmptyString;
    /**
     * Indicates when the vulnerability advisory was created. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    VendorCreatedAt?: NonEmptyString;
    /**
     * Indicates when the vulnerability advisory was last updated. Uses the date-time format specified in RFC 3339 section 5.6, Internet Date/Time Format. The value cannot contain spaces. For example, 2020-03-22T13:22:13.933Z.
     */
    VendorUpdatedAt?: NonEmptyString;
  }
  export interface WafAction {
    /**
     * Specifies how you want WAF to respond to requests that match the settings in a rule. Valid settings include the following:    ALLOW - WAF allows requests    BLOCK - WAF blocks requests    COUNT - WAF increments a counter of the requests that match all of the conditions in the rule. WAF then continues to inspect the web request based on the remaining rules in the web ACL. You can't specify COUNT for the default action for a WebACL.  
     */
    Type?: NonEmptyString;
  }
  export interface WafExcludedRule {
    /**
     * The unique identifier for the rule to exclude from the rule group.
     */
    RuleId?: NonEmptyString;
  }
  export type WafExcludedRuleList = WafExcludedRule[];
  export interface WafOverrideAction {
    /**
     *  COUNT overrides the action specified by the individual rule within a RuleGroup . If set to NONE, the rule's action takes place.
     */
    Type?: NonEmptyString;
  }
  export interface Workflow {
    /**
     * The status of the investigation into the finding. The workflow status is specific to an individual finding. It does not affect the generation of new findings. For example, setting the workflow status to SUPPRESSED or RESOLVED does not prevent a new finding for the same issue. The allowed values are the following.    NEW - The initial state of a finding, before it is reviewed. Security Hub also resets the workflow status from NOTIFIED or RESOLVED to NEW in the following cases:    RecordState changes from ARCHIVED to ACTIVE.    ComplianceStatus changes from PASSED to either WARNING, FAILED, or NOT_AVAILABLE.      NOTIFIED - Indicates that you notified the resource owner about the security issue. Used when the initial reviewer is not the resource owner, and needs intervention from the resource owner.    SUPPRESSED - Indicates that you reviewed the finding and do not believe that any action is needed. The finding is no longer updated.    RESOLVED - The finding was reviewed and remediated and is now considered resolved.   
     */
    Status?: WorkflowStatus;
  }
  export type WorkflowState = "NEW"|"ASSIGNED"|"IN_PROGRESS"|"DEFERRED"|"RESOLVED"|string;
  export type WorkflowStatus = "NEW"|"NOTIFIED"|"RESOLVED"|"SUPPRESSED"|string;
  export interface WorkflowUpdate {
    /**
     * The status of the investigation into the finding. The workflow status is specific to an individual finding. It does not affect the generation of new findings. For example, setting the workflow status to SUPPRESSED or RESOLVED does not prevent a new finding for the same issue. The allowed values are the following.    NEW - The initial state of a finding, before it is reviewed. Security Hub also resets WorkFlowStatus from NOTIFIED or RESOLVED to NEW in the following cases:   The record state changes from ARCHIVED to ACTIVE.   The compliance status changes from PASSED to either WARNING, FAILED, or NOT_AVAILABLE.      NOTIFIED - Indicates that you notified the resource owner about the security issue. Used when the initial reviewer is not the resource owner, and needs intervention from the resource owner.    RESOLVED - The finding was reviewed and remediated and is now considered resolved.    SUPPRESSED - Indicates that you reviewed the finding and do not believe that any action is needed. The finding is no longer updated.  
     */
    Status?: WorkflowStatus;
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
   * Contains interfaces for use with the SecurityHub client.
   */
  export import Types = SecurityHub;
}
export = SecurityHub;
